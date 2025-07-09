Spetsnaz: Anyway to debug these kind of error messages in Tact:  Func compilation error: /Users/path/build/ContractMaster/tact_ContractTransfer.code.fc:128:1: error: previous function return type ((slice, int, int, int, int, int, slice, (cell, int, int), int, int, cell, int, int, int, slice, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((slice, int, int, int, int, int, slice, (cell, int, int), int, int, cell, int, int, int, slice, int), int)   }  I can't find the file mentioned in the error, so I can't read the code in there understand what it is about. There's also no indication about the function name or any kind of clue about the problematic part of the contract

Spetsnaz: Found the solution. For those who encounter a similar issue, this may happen when you have a getter function that defines a return type but does not actually return stuff.  Not easy to spot, IDE won't highlight and Tact too won't show an error (reply to 22350)

Sa: How to read Struct of getter function by typescript?

— 2024-04-23 —

Sonny: contract must be getter function Struct , compile by tact language , and getter function on ts (reply to 22355)

Sa: I solved the problem. thanks (reply to 22380)

encs: Hey guys, I m using this method trying to get received JETTONS to my contract and add them to pools

encs: receive(msg: TokenNotification) {         self.receivedTokens = msg.amount;         dump(msg.amount);     }

encs: I don't get any notification, any idea?

encs: @spetsnaz116

encs: message(0x7362d09c) TokenNotification {     queryId: Int as uint64;     amount: Int as coins;     from: Address;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton  }

encs: this is the message

encs: @Gusarich

Spetsnaz: What do you mean receiving TonkenNotification? From where? (reply to 22389)

encs: When I sent a Jetton to my contract from my wallet, I want to get the notification on my contract, like receiving it and add it to a map

encs: if I use receive(){} normally, I can only get the TON that I send to the contract, but not the jettons

encs: If I use this function to get the TON received it works, but if I send jettons it doesn't work (reply to 22399)

encs: receive() {         let ctx: Context = context();         let depositsLet: Deposits = Deposits{sender: ctx.sender, amount: ctx.value};         self.deposits.set(self.depositsLength, depositsLet);         self.depositsLength = self.depositsLength + 1;          //dump(msg.amount);     }

Spetsnaz: Jettons on TON need their own wallet. It’s not EVM. Logic as follow: WalletA owns JettonA via WalletAA (which is created automatically)  When you send to FooContract, which is your  contract, JettonA creates a JettonA wallet (new contract) that has as owner FooContract. So your contract never really stores Jettons, it’s being assigned new wallets for their respective jettons (reply to 22401)

Spetsnaz: If you look at the standard Jetton wallet, you’ll see that it initializes a new contract for each address

Spetsnaz: I faced this issue where I can’t check the Jetton balance of a wallet. You’ll need to use apis to get that

encs: Oh shit

encs: So I can't view if a user sends to my contract jettons

Spetsnaz: Nope. Unless you use special Jetton wallets that you create which communicate with FooContract directly. The other way around is to use an API and update the balance on your contract using this api. You can look at tonapi.io (reply to 22412)

encs: Understood! Thanks very much

encs: is there any farming project on ton? (reply to 22413)

encs: https://github.com/delab-team/contracts/tree/main/jetton-pool

encs: what about this, is there something similar in tact?

Haz: Hi

Haz: Is there anybody here who can help me with tact tests?  PROBLEM: jetton is minted during deployment in init function. When I check deployer balance after minting I have 0, don't know why. On testnet it works, in test not, why?

Haz: Is it now allowed to paste link to code here? I don't know why my message is removed

Spetsnaz: I didn't run tests yet, working on them, but I think you can use blockchain.treasury with the 2nd argument containing the balance (reply to 22445)

Spetsnaz: Something like this maybe, but I didn't try yet

Haz: Thanks, but my problem is not a TON balance but Jetton balance on deployer address (reply to 22451)

Haz: Do you know how to paste link to code here?

Spetsnaz: You can paste if it's not too much (reply to 22455)

Haz: I cant, it is removed automatycally

Haz: even github gist...

Haz: I have sent you link via PM (reply to 22451)

Nerses: Hi everyone. while verifying my smart contract i get compilation error with exit code 9(Cell underflow. Read from slice primitive tried to read more bits or references than there are) How can i find that bug are there any tools for it ?

Լևոն | Brgndy: Hi everyone, does anybody in here have an experience or an example of a smart contract for staking a non-native token (jetton)? Trying to create my own token with vesting and staking options. Will appreciate the help!

K⁧: How I can iterate by all elements in map? Without list of keys

Jimmy Becen: hi guys I have stored the merkleRoot of a Dictionary<Address, bigint> in the smart contract. When a user sends a message containing a merkleProof (obtained from the generateMerkleProof function of the Dictionary), how can I verify the merkleProof?

Vitor: native map transversal was merged in yet - https://github.com/tact-lang/tact/pull/106 - I'm not sure what's the best alternative (reply to 22494)

Nerses: if i want to emit this message message TonTransferInitiated {        __hashlock: Int as int256;        __amount: Int as int256;        __chainId: Int as int256;        __timelock: Int as int256;        __sender: Address;        __receiver: Address;        __targetCurrencyReceiverAddress: String;      }   how can I serialize it as data type (the data needs more storage than Cell)

Sumit: https://katb.in/isuquludola what am i doing wrong in this?

fläve: 18

Diego: Hi everyone, sorry I’m a bit confused almost every example I have seen it’s about how to receive ton coins, but if I want to create an smart contract to receive usdt what would change? Or any other token indeed

Boris: Please read the jetton standard https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 22532)

Diego: Tks a lot

— 2024-04-24 —

Yakitori: Yes, you can, as when the user sends jettons to your contract, it gets a notification with TokenNotification (reply to 22412)

Yakitori: The cookbook has a nice Jetton contract in Tact

Yakitori: I suggest to read it

Yakitori: Ston and deDust have farming (reply to 22417)

Yakitori: Making a farming contract with Tact is fairly easy I think, if you reuse as a base the classic Sushiswap contracts

Pike 🦴 🏴‍☠️: hi guys, do you know how to create tact-like abi from func?

Sebastianos285300🦉: What’s?

Sebastianos285300🦉: A ok thanks

Spetsnaz: Anyway to test (jest) receiving this notification? (reply to 22548)

encs: ++ interested in this too (reply to 22581)

encs: Tried to use receice(msg: Token Notification) but getting no data at all (reply to 22548)

saddas: 6

Sergei: How to get a public key from a private in blueprint test?

Truong: let publicKey = beginCell().storeBuffer(keypair.publicKey).endCell().beginParse().loadUintBig(256); (reply to 22597)

Spetsnaz: I guess for this one, you'll just need to test that the notification is sent in the transactions object (reply to 22581)

Spetsnaz: I couldn't find any documentation on how to take fees from the context value. For example, the contract will charge 1 TON for a certain service.  - SendRemainingValue will just return all the tons minus the blockchain fees - Using send() means that it's going to essentially "refund" in a different message, so the person would "receive" Tons as if it's a new transaction to them  Anyway to do this without option 2, where we just deduct the 1 TON from the value and SendRemainingValue?

Mindy | NNN: 18

live: testnet overloaded now？

Vasily: adm wtf? Why u cicked my post about looking for progers?

encs: You probably posted a link, it gets autoremoved (reply to 22650)

Vasily: Hi , we are looking for two progers (frontend and backend) wanting to get cool experience working in a team of experienced guys at The Open League Hackathon. Each will get a share of the project ownership tokens according to tokenomics, once the mvp is realized What we have now:  - Approved Hackathon application   - Pitchdeck  - Identified user need and solution   - 2 people in the team: Product Owner ex Aeroflot (i.e. me) and Researcher ex proger.  - Perspective idea at the intersection of Defi and Creator Economy, won a prize at TONidea  Objectives:  - Develop MVP and get the first users  -To receive a part of the prize fund and/or to get a grant.  For links to the project in a private message, thanks!

Sa: Hi guys, I have a staking contract. then I send jetton token X to staking contract for staking. But the transaction is failed, the token which I send are gone. How to prevent it ?

Eagle: Hey everyone we are looking for dev who is familiar with TON to help us with Token creation for our AI-powered language learning web3 game

Yakitori: Can a contract get access to its own address ?

Diego: yes with myAddress() (reply to 22656)

Yakitori: Awesome (reply to 22658)

cypherpunksO1: Hi)

cypherpunksO1: Does anyone know what Cell is for? I don't really understand it, and there is very little documentation....

Yakitori: Cell is the basic data structure for TON (reply to 22676)

Yakitori: You can store 1024 bits in it

cypherpunksO1: Roughly speaking, it's a dictionary?

Yakitori: https://docs.ton.org/learn/overviews/cells  No, it's more like a 1024 bit slot where you can put whatever you want, and that can be linked. (reply to 22679)

cypherpunksO1: But in tact, you can arrange the dictionaries there, right?

Yakitori: Yes - but bear in mind that making dict with Cells doesn't scale, as you will be limited by its size (reply to 22681)

Yakitori: The best way is to use the blockchain as a dict and deploy a specific contract for each key-value pair

cypherpunksO1: Thanks, I'm new to writing smart contracts and appreciate any help I can get

Yakitori: (if you don't know the bounds of your dict)

Yakitori: Sure! I'm learning too, so let's help each others! (reply to 22684)

cypherpunksO1: Great)

cypherpunksO1: Yeah, I heard about that, thanks (reply to 22685)

Yakitori: @howard_ton Is it ok to make PR to the tact docs? As I'm grinding them I see a few improvements to be made.

cypherpunksO1: Honestly, developing on TON is a new world for me. I would be grateful for any clear resources on developing on tact

Vitor: Go for it. I made some small PRs to the compiler, the team is quite friendly. (reply to 22689)

Yakitori: https://docs.tact-lang.org/ (reply to 22690)

Yakitori: https://tact-by-example.org/

Yakitori: Tact by example is really great

cypherpunksO1: By the way, he has a rather small cookbook (reply to 22697)

Yakitori: Yeah that's the kind of things we can improve 🙂 (reply to 22699)

Anton: https://maps.app.goo.gl/hq6dS8Zed8GeyXwp8?g_st=it

cypherpunksO1: In fact, there are too few sections in the official documentation and the information is superficial :(((

Yakitori: It's ok I think but you need to read it carefully (reply to 22706)

Multi: Hello I have a question, how would I be able to add the telegram group and website of my project to the metadata? Is this possible? Thank you in advance.

Diego: hello, is this enough to receive usdt in a smart contract?

encs: Try with a custom token

Sumit: how can i create a contract, and transfer the jettons that i just received to this newly deployed contract?

— 2024-04-25 —

Baldwin: After all, should I use camel or snake?

Spetsnaz: myAddress() (reply to 22656)

cypherpunksO1: Can you tell me how to process incoming contracted jettons? Get their quantity and contract

Spetsnaz: You can, check the content of Jetton or you can simply make non standard getter functions (reply to 22724)

Spetsnaz: This looks ok, but bear in mind that the balance is in another contract, the USDT jetton contract will create a new contract for the USDT jetton holding of your contract. You're basically replicating data in your contract. Also, think about when the USDT goes out from your wallet (reply to 22732)

Spetsnaz: From my understanding, getter functions are snake, the rest is up to you, I prefer camel (reply to 22755)

Spetsnaz: Can you elaborate? Create your contract, get the address, then transfer to that address. But keep in mind, your contract won't get the jettons in it, it will just be the owner of a wallet that contains those jettons (reply to 22739)

cypherpunksO1: Please (reply to 22759)

Spetsnaz: In your contract? Maybe you can use TokenNotification (reply to 22759)

Baldwin: Why doesn't ton have official documents for jetton and NFT?  I need them to confirm the correct documents to deploy my token (reply to 22766)

cypherpunksO1: Yes, I want that when sending jettons of contract n to my contract in can get in the handler the contract address of the jettons being sent and the number of jettons. (reply to 22766)

cypherpunksO1: There are official standards (reply to 22767)

Baldwin: Can you tell me about the NFT sample contract? (reply to 22769)

Baldwin: not found

Spetsnaz: TokenNotification doesn't have those kind information. The Jetton standard lacks some important data imo

cypherpunksO1: So by processing this event I can get this data? (reply to 22773)

Dmitry: wow, hi bro (reply to 22775)

cypherpunksO1: Broo ) (reply to 22776)

cypherpunksO1: But how do I get the address of the contract I received and ship the jettons from the contract? (reply to 22773)

cypherpunksO1: Friends, how tominate token in tesnet?

Multi: Thank you I’ll try this! (reply to 22760)

Baldwin: Has anyone got an nft tact contract yet?

Howard: I think everyone could!! (reply to 22689)

Howard: https://github.com/howardpen9/nft-template-in-tact  I am surely I need have some updates. But haven't have time yet. (reply to 22791)

cypherpunksO1: And how do you add a picture to this nft? (reply to 22795)

Howard: 2 ways; but I am using the off-line like we did with most of NFTs on OpenSea(https://github.com/howardpen9/nft-template-in-tact/blob/193fe699e8d03d9debbf929f177895f82b90c1fe/sources/contract.deploy.ts#L10)  On-chain method might be too hard for the first time TON developer; you need store the fileds in the dictionary then turn into single Cell data type. (reply to 22796)

cypherpunksO1: I would like to see onchain specifically (reply to 22797)

Howard: I remember @nonam3e you built the one with Tact lang? (reply to 22798)

cypherpunksO1: What? (reply to 22804)

Ext.getCmp('Keken');: Hello everyone! 😊 I need to link a Jetton to a contract and be able to manage them through it, essentially creating a sort of buffer for the transaction (send, store, hold until the owner unlocks). Where can I find the most up-to-date Jetton wallet written in Tact so that I can deploy it from my other contract (and I also want to understand if this is the right approach)? Are there any examples available?

Baldwin: hey sir, how to listenter event log from contract emiting? (reply to 22804)

Nerses: Hi everyone ! how can I emit long message that size of Cell isnt enought for it ?

Ilhomboy: 13

cypherpunksO1: Is it possible to write your own domain zone on tact in ton?

Marcus: Hi just a bump on this, appreciate anyone's help (reply to 20957)

Jeremy: Can the front-end directly call this type of message, or can it only call contract methods?

Yakitori: https://twitter.com/murat_ogat/status/1783394869290946744  I think that this tweet is really right on the money, and could be a great inspiration for the TON community

Yakitori: Btw @dev_rel check the Stack overflow clone, there is a lot of spam/scams

Miras: Hi there!  Is there any way to upgrade a smart contract? Or maybe some best practices?

Howard: wait what, we don't have Tact in StackOverflow right (reply to 22858)

Yakitori: I was referring to the answers.ton.org website, but it seems offline (reply to 22866)

Naved: Hello

Naved: How i can pass address parameter while calling this message      receive("AddToWhitelist") {         let ctx: Context = context();         require(ctx.sender == self.owner_address, "Only owner can whitelist");         let recipient: Address = ctx.params.get_address("recipient"); // get recipient address from parameters         require(recipient != null, "Recipient address required");         self.addToWhitelist(recipient);      }      fun addToWhitelist(recipient: Address) {         require(sender() == self.owner_address, "Only owner can whitelist");         require(recipient != null, "Recipient address required");         self.whitelist.set(recipient, true);     }

Naved: Please if anyone can help it would be really great

Diego: It’s not possible for now sending additional parameters in string messages, but you can create a custom message outside of your contract code like: message mywhitelist{ newAddress: Address;} and then receive it in your smart contract:   receive(msg: mywhitelist){… msg.newAddress; ....}

Ken: https://tact-by-example.org/ (reply to 22883)

Naved: thank you (reply to 22887)

cypherpunksO1: You seem to have two identical checks (reply to 22882)

Naved: yes i am new to ton, first i was trying to directly call the function, then i got to know that i can not call function directly i have to call through a message (reply to 22891)

cypherpunksO1: Remove the checks from the addToWhitelist function, because they already exist in the receiver (reply to 22892)

Naved: message AddTowhitelist {     receipient: Address; }      receive(msg: AddTowhitelist) {         let ctx: Context = context();         require(ctx.sender == self.owner_address, "Only owner can whitelist");         require(msg.receipient != null, "Recipient address required");         self.addToWhitelist(msg.receipient);      }      fun addToWhitelist(recipient: Address) {         self.whitelist.set(recipient, true);     }

Naved: is it correct now?

cypherpunksO1: Yeah, I think so. Don't forget the built-in self.requireOwner(); function to check what the creator sends to the contract (reply to 22894)

cypherpunksO1: self.requireOwner()   replaces   require(ctx.sender == self.owner_address, "Only the owner can whitelist");

Miras: Hi there! Is there someone who knows how to handle fee logic for production ready contracts? The only thing that comes to mind is to use constant FEE = 0.1 ton or something like this

Amin: Hi I'm Amin Want to support the TON community to make a difference? Join our "Art for Life" initiative –  NFTs minted on TON to support urgent humanitarian aid amidst conflict. Submissions are open, and 50% of proceeds go to vetted aid organizations.  This is art with purpose. To learn more: send a message to me.

🥕: for example, i have jettons minted by official ton minter app.  can i send it from my own contract to user's jetton wallet?

Behrang: You have to use network config to calculate fee. There are some new opcodes in the latest release of TVM that will help you. (reply to 22916)

Yakitori: How do you manage to confirm an action after a message has been sent?  Say you want to send message B only if message A was sent and was successful.   I understand that you can use bounced, however will execution stop until we got a callback from message A, or will the bounced message come after the execution of the initial function has ended?

Yakitori: For instance, say that I want to deposit a token (say USDT) into a contract, and mint a token as a proof-of-deposit.  To mint, I need to ensure that the deposit was done and successful. Is there a simple way to do this ?

— 2024-04-26 —

Baldwin: how to listener event from emiting?

Lu: Where can I transfer Tact to FunC code?

Diego: are you using blueprint? (reply to 22962)

Diego: when you compile it, it generates func code

Lu: Got it

cypherpunksO1: Good afternoon, can anyone explain why you need @name (looks like a decorator in python) in tact?

&rey: To attach "native" Tact function declaration to its FunC body. (reply to 22975)

Nerses: Why i cant declare function like this  fun create (param: Int as int256) {}   I get error Syntax error: expected ")", ",", or "?"

Макс: try   fun create (param: Int) {} (reply to 22999)

Nerses: Your suggested way works but the problem is that I want Integer which can store only 256 bits (reply to 23001)

Nerses: Does TACT supports such decleration and syntax ?

Miras: as a workaround you can declare a message: message MyMessage {   param: Int as int256; } (reply to 23003)

Nerses: Yeah i have implemented in that way also. So TACT doesnt support such syntax ? (reply to 23011)

Anton: nope, and it shouldn’t  you pass function arguments via TVM stack and all integers there have the width of 257 bits  you need the as annotation only for storage (reply to 23012)

Nerses: Thanks for detailed explanation (reply to 23013)

Nerses: Is here anyone who can help to check my code ? Cant understand why it doesnt work

Vitor: Post a snippet and I'd be happy to take a look. (reply to 23038)

Nerses: thanks for help

Nerses: let ctx: Context = context();         require(now() <= _timelock,"Not Future Timelock");         require(ctx.value != 0,"Funds Not Sent");          require(false == self.contractExists(_hashlock),"Contract Already Exists");                                                                          let htlc: HTLC = HTLC { hashlock: _hashlock,                                 amount: ctx.value,                                 secret: 0x0,                                 timelock: _timelock,                                 sender: sender(),                                 _receiver: _Receiver,                                 redeemed: false,                                 refunded: false};          self.contracts.set(_hashlock,htlc);          emit(Create {data: TonTransferInitiated{                         __hashlock: _hashlock,                         __amount: ctx.value,                         __chainId: _chainId,                         __timelock: _timelock,                         __sender: sender(),                         __receiver: _Receiver,                         __targetCurrencyReceiverAddress: _targetCurrencyReceiverAddress                         }}.toCell());          return _hashlock;     }

Nerses: it is the function and also receive for it     receive(msg: Create){         let ctx: Context = context();                 send(SendParameters{                 to: myAddress(),                 bounce: true,                 value: ctx.value,                 mode: SendBounceIfActionFail + SendPayGasSeparately         });     }

Nerses: call of this function fails (reply to 23039)

cypherpunksO1: I saw a library working with ton dns in the tact documentation. Tell me, will this allow you to create your own domain zone?

&rey: Subdomains only. (reply to 23051)

&rey: So if you already have cypherp.ton, you'll be able to create best.cypherp.ton.

cypherpunksO1: So I can create my own subdomains cheaper? (reply to 23054)

cypherpunksO1: Got it, thank you (reply to 23055)

&rey: Wdym cheaper? Than what? (reply to 23056)

cypherpunksO1: It's a pity, it would be nice to implement your domain zone

cypherpunksO1: Than through the ton domains service (reply to 23058)

cypherpunksO1: Is there more detailed documentation on how domains work in ton?

&rey: They have a bit different goals, no? Domains and subdomains. (reply to 23060)

&rey: Have you searched through docs? (reply to 23061)

cypherpunksO1: That's right, I wanted to implement the .open domain zone in honor of my project (reply to 23062)

cypherpunksO1: Now in search (reply to 23063)

&rey: You'd have to use .open.cypherpunks.ton. (reply to 23064)

cypherpunksO1: So I can only create domain.open.ton? (reply to 23066)

cypherpunksO1: By the way, subdomains are prohibited in the official service for creating domains. What could it mean?

Viacheslav: Using import "@stdlib/jetton”;, but get an error at build stage, what’s wrong?  Could not resolve import @stdlib/jetton

cypherpunksO1: It seems that there is no official Jetton library (reply to 23074)

cypherpunksO1: https://docs.tact-lang.org/language/libs/overview

Viacheslav: but.. https://github.com/tactfunc/tact/blob/e3a9a9407831018c03d39b18b1e59b34f9b9ac09/stdlib/jetton.tact (reply to 23076)

Viacheslav: it was there I guess..

cypherpunksO1: Try:  import "@stdlib/jetton/wallet”; (reply to 23077)

Viacheslav: tried, same, docs using this are outdated 🙁 (reply to 23079)

cypherpunksO1: Jetton is not mentioned in the official documentation. Just copy the contract code from there and use it at home (reply to 23080)

Viacheslav: yeah, will do, thanks (reply to 23081)

cypherpunksO1: Contact us)

Viacheslav: yeah, it worked

Viacheslav: is there any way to test jetton transfers in blueprint tests?

— 2024-04-27 —

cypherpunksO1: And why not? Write tests for this (reply to 23086)

Viacheslav: I mean you have to deploy your own Jetton, no Jetton implementations in libs? (reply to 23113)

cypherpunksO1: And in TransferNotification, is the sender field a jetton wallet?

cypherpunksO1: Yes (reply to 23121)

cypherpunksO1: Good afternoon, how can I implement in tact to receive contract tokens and send them to the user's wallet?

Nikita: Антон Трунов горорил про workshop по такту в интервью  это можно посмотреть где то?

Nikita: can I build escrow service (2/3 threshold) with tact?

Nikita: trying to write more context but my message is getting deleted 😐

Jeremy: I created multiple child contracts with a parent contract. How can I obtain the addresses of all the child contracts? Do I retrieve them from the chain using a specific library, or do the contracts emit the addresses proactively?

Vlad: Hello, help me please with sending external messages. Here the code snippet (script, contract tact) const test: TEST = {             data: n,             $$type: "TEST",         }         return lotteryMaster.sendExternal(test); external(msg: TEST) {         acceptMessage();         self.seqno += 100;     }  Tonapi response always 500

Gleb: Hello 👋🏼 Maybe someone knows smart contract templates for voting? github or other links?

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: Hey can someone assist me?

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: Just got banned from ton community group.  I told in grp that someone is trying to scam me with the admin's identity, the real admin/Moderator told me to sent proof.

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: I provided a picture (ss) of the chat and bot instantly kicked me? Can Anyone do something?

Benedict: Hey there! We're on the hunt for skilled professionals to join our exciting new venture in the realm of Web3. Whether you're a developer, an NFT guru, a linguistic wizard, or a beta tester, we want you! Great pay, supportive team - slide into my DMs if you're keen!

Yagermeister: Hello, guys! I’m new here, and want to know how to write metadata for my token?

Viacheslav: What’s wrong? Getting this error at         let walletData = await jettonWalletContract.getGetWalletData();   FAIL  tests/TestJetton.spec.ts   ● Test suite failed to run      TypeError: Do not know how to serialize a BigInt         at stringify (<anonymous>)        at messageParent (node_modules/.pnpm/jest-worker@29.7.0/node_modules/jest-worker/build/workers/messageParent.js:29:19)

Adwaer: Hello guys! Do you know how to handle this? "Unsupported item type: tvm.stackEntrySlice"  I'm using @ton/core in a react app, and I see this: function parseStackEntry(s) {       switch (s["@type"]) {         case "tvm.stackEntryNumber":           return { type: "int", value: BigInt(s.number.number) };         case "tvm.stackEntryCell":           return { type: "cell", cell: core_1.Cell.fromBase64(s.cell) };         case "tvm.stackEntryTuple":           return { type: "tuple", items: s.tuple.elements.map(parseStackEntry) };         default:           throw Error("Unsupported item type: " + s["@type"]);       }     }  And slice type is really not defined. Is there any solition? I return optional Structure from smart contract. Blueprint works fine with this result

Diego: hi every one, does anybody knows what "as remaining" means in this definition?   forwardPayload: Slice as remaining;

Viacheslav: probably related to https://github.com/jestjs/jest/issues/11617 (reply to 23197)

Viacheslav: adding "workerThreads": true to jest config helped (reply to 23201)

Nick: nft trading contract ?

— 2024-04-28 —

Samu: https://t.me/toncontests/166 Can this contest be carried out in teams?

live: hi everyone,Why is the error "Static function "get_Jetton_Params" does not exist"?

Dmitry | backend4you.ton: I guess “all remaining bits there” (reply to 23200)

Steven: I'm learning the Ton contract. If I have any questions, can I get help here?

Taro: Hello, guys

Fardin: Hello my friends

Fardin: I'm looking for alternative of ecrecover in TACT

Fardin: Do we have something like that?

Daniil: ⚡️

Daniil: ⚡️

cypherpunksO1: Good afternoon, can anyone tell me how SendRemainingBalance differs from SendRemainingValue in tact? Not really clear, thanks in advance

Taro: Looking for the answer too🤓 (reply to 23291)

Anton: have you tried reading the cookbook? https://docs.tact-lang.org/cookbook/single-communication#how-to-send-a-message-with-the-entire-balance

Gregory: How can I take the TON address from text comment and use this address in the tact smart contact?  receive (str: String)  address( X )  How could I specify the address from the text string in X?

Taro: Hi, Anton. Love u and love ur videos😄 (reply to 23294)

PeiQi: tact-lang/emulator Is there currently a way to Fork the mainnet similar to that on Forge, similar to sandbox

Taro: Try Blueprint (reply to 23311)

Taro: X = "EQasdasdasdasd" (reply to 23303)

Gregory: I need to use the address from the text message (From the incoming transaction). But not the fixed address as you suggested (reply to 23315)

Taro: I see (reply to 23316)

Taro: use msg to receive (reply to 23303)

Taro: message(0xf8a7ea5) TokenTransfer {  sender: Address; }

Taro: like this

Taro: then     receive(msg: TokenTransfer){ let temp:Address = msg.sender;}

Gregory: I understand the general idea, however I’m very new to tact so ask for specific answer.  By the way, for the string it is better to use str: String and not msg (reply to 23320)

Taro: I'm new too

Gregory: I do not need the address of the sender. I need the address from the comment (address 1 could send a transaction and specify the address 2 as the text comment) (reply to 23324)

Gregory: Omg, so do not give the advices you do not understand (reply to 23326)

Taro: you can named the 'sender' whatever you want (reply to 23328)

Taro: message(0xf8a7ea5) TokenTransfer {  who: Address; }

Taro: and the msg name

Daniil: Is there an example of mint SBT on Taсt?

Алексей: 12

Fardin: @AntonTrunov Any idea buddy? (reply to 23264)

Dmitry: Hello guys! Does anyone knows are there testable Jettons contracts? I am creating a smart contract that manages jettons. For example, it can store and send USDT. Are there test jetons so that I can create them, top up and debit the balance from them in tests?

cypherpunksO1: Good afternoon, can you tell me what the error code in tact is 130?

Viacheslav: Invalid incoming message — no suitable operation is found (reply to 23355)

Viacheslav: https://docs.tact-lang.org/book/exit-codes

Viacheslav: what is the best way to add logic for incoming jetton transfers? is it the only way to work witj TransferNotifications? how to pass payloads and so on?

— 2024-04-29 —

PeiQi: Is there a decompile tool for unverified source code？

&rey: Yes. (reply to 23362)

Nerses: Hi everyone !

Nerses: Is here anyone who can help to fix a bug just stucked more than a week.Thanks beforehand

User<6447148679>: Good morning everyone Nice 🙂 to be here

okolo: Hi all! I've install Blueprint in VS code, Trying to build contract, but returns error: npm error could not determine executable to run  if i try yarn: error Command "blueprint" not found.  what i have to do?)

Spetsnaz: What is it? (reply to 23408)

Spetsnaz: Have you tried through the terminal? (reply to 23429)

okolo: yes (reply to 23431)

okolo: also yarn

Spetsnaz: Try to make the contracts in your repository, then initialize them and fund them. You can use:  const funderWallet = await blockchain.treasury('whatever', {       balance: toNano('20') // amount of TON     }) (reply to 23352)

Spetsnaz: It seems like it's tryong to load package.json from ../../../ (reply to 23433)

Spetsnaz: Are you sure there's a package.json inside the folder 02?

Nerses: I have implemented HTLC and try to test it.And now stuck on function that locks funds in smart contract.I use blueprint to test it but get error 37,then changed to lock less money and get error -14.Cant understand what causes that (reply to 23430)

okolo: package.json (reply to 23436)

Daniil: import "@stdlib/deploy";  contract SendTon with Deployable {          let recipient: Address = "0QAeBRsyYoa_ROLZSlaEltmazMDBIm37XmHlPYcV4fQSH4-I";     let value: Int = ton("1");          init() {              }          receive() {         send(SendParameters{         // bounce is set to true by default         to: recipient,         value: value,         mode: SendIgnoreErrors, // will send the message despite any errors         body: "Hello, World!".asComment()         });     }  } Is it possible to indicate the address like this? if not, then by what principle should he understand where to send TON?

Spetsnaz: Ok, did you try those scripts? Start and build (reply to 23438)

Spetsnaz: No, it's address("your_address_here") (reply to 23442)

Daniil: import "@stdlib/deploy";  contract SendTon with Deployable {          init() {              }          receive() {         let recipient: Address = sender();  // Retrieve the address of the sender         let value: Int = ton("0.1");  // Define the amount of Toncoins to send back          send(SendParameters{             // Bounce is set to true by default             to: recipient,             value: value,             mode: SendIgnoreErrors,  // Will send the message despite any errors             body: "Hello, World!".asComment()  // Message body as a comment         });     }  }  the contract was deployed twice, my task is that if I send a tone to the contract, it will return this amount to me with a comment.

okolo: i found my mistake: i haven entered in target folder with blueprint in bash) (reply to 23443)

Yakitori: gm to the tact_chads

Yakitori: Does someone knows what is the remaining type here

Benedict: Hi, we are seeking skilled individuals for our innovative Web3 venture! Are you a developer, NFT creator, translator, or beta tester? Join our friendly team for fair compensation and exciting projects. Drop a DM if intrigued!

cypherpunksO1: Good evening, why is the number always 1n when testing? Has anyone encountered this in tact?

Ars: Hi there! Can you help me out with updating a smart contract on tactLang?

Валерий: 9

Валерий: 9 (reply to 23477)

Валерий: 9

Валерий: 17 (reply to 23482)

Валерий: 3

MEW: test

Валерий: 10 (reply to 23493)

Валерий: 9 (reply to 23495)

Валерий: 6 (reply to 23498)

BreAAth: 7

Валерий: 12

— 2024-04-30 —

spanish-or-vanish: Gm Gm is it possible to create a smartcontract that a user with nfts triggers and it sends all his nfts to a destination selected.   How would this work?  in evm world i would request an approval  and so on how is it done in ton land

Diego: hello, is anyone else having this issue trying to deploy  2 subsequent contrats after calling the first one?

Spetsnaz: Check the error code (reply to 23524)

Spetsnaz: It could be related to not enough gas

Diego: nop in fact it doesn't produce any error I detected it because I tried to run a get function from the las contract and it wasn't  deployed

Spetsnaz: How are you testing? jest? (reply to 23529)

Diego: and after using many dumps i realized that it wasn't deployed

Diego: yes (reply to 23530)

Spetsnaz: I would make a jest test, check that there are 2 transition with deploy: true

Spetsnaz: If one fails, jest will dump the transaction results (in Expected)

Spetsnaz: Then read the dump and notice if there’s an error code in there

Diego: thats exactly as I have it

Diego: but it doesn't complain

Spetsnaz: I’m suspecting that there is no enough gas to deploy the second contract. Try deploying the second contract by itself (reply to 23536)

Spetsnaz: Dm me a minimal reproduction and I’ll look into it (reply to 23537)

Spetsnaz: We can’t know this way

Diego: I also thougt about it but I sent it with 100 ton and it fails too (reply to 23538)

Diego: great tks

Diego: did you received the message?

cypherpunksO1: Good afternoon, does anyone have the code to transfer the jettons received on contract? Please

cypherpunksO1: I wrote a contract to send the jettons sent to it back, but it does not send back, only accepts them. What is wrong?

Dmitry | backend4you.ton: Seems fine at first sight.  Check your “environment” (in explorer) - that you actually receive notification msg, that opcode in it is same as in your compiled FunC code, etc. (reply to 23551)

cypherpunksO1: I checked it on the blockchain, everything works, but the tokens don't come back to the wallet (reply to 23554)

cypherpunksO1: Here are the opcodes

Dmitry | backend4you.ton: This is your incoming tx? You got 0.00…1 ton in notification - it’s too low to sendRemainingValue (and I guess too low even to start TVM to process incoming notification msg) (reply to 23555)

cypherpunksO1: But how do you fix it? (reply to 23557)

cypherpunksO1: Where to specify a value greater than?

cypherpunksO1: Here?

Dmitry | backend4you.ton: Do you want to pay for gas from your contract balance? I mean, everyone will send shit tokens to your contract, and your contract will pay  own coins for return? (reply to 23558)

cypherpunksO1: No, the user has to pay for the transfer (reply to 23561)

Dmitry | backend4you.ton: Then user should put value greater than 0.0…1 in his code. Yes, it’s forward-amount, but not in your contract (reply to 23562)

cypherpunksO1: Which one? Where do I specify that? (reply to 23563)

Dmitry | backend4you.ton: You (contract owner) can’t. User who send you shit token - he must (in his wallet/code) (reply to 23564)

cypherpunksO1: Okay, what if I pay for the transfer?

cypherpunksO1: Or what if with the token just accepting the tone?

Dmitry | backend4you.ton: Then change value (and possibly mode) in your send code (reply to 23566)

cypherpunksO1: What's the value to change? I don't quite understand (reply to 23568)

Dmitry | backend4you.ton: But you’ll still fail to send back sometimes - when user will put too low value in his forward-amount and your contract code will not run at all (like in your screen) (reply to 23566)

Dmitry | backend4you.ton: value: 0 (reply to 23569)

Dmitry | backend4you.ton: Think like you’re writing code to “simply send jettons” (your own jettons to your legit users) - with all fees etc.

cypherpunksO1: Changing forward_ton_amount it didn't help

Dmitry: Hello guys! What does it means is_right in forward_dayload? Does any documentation exist?

Dmitry | backend4you.ton: Still 0.0…1 on screen. TVM have no way to start (reply to 23574)

cypherpunksO1: But how to send more? Where to write this in code? (reply to 23582)

Nerses: cant understand why in this code require doesnt work. Any help ?     receive(msg: Create){         require(false == self.contractExists(msg.data.__hashlock),"Contract Already Exists");           require(now() <= msg.data.__timelock,"Not Future Timelock");         require(msg.data.__amount != 0,"Funds Not Sent");           self.contracts.set(msg.data.__hashlock,HTLC{hashlock: msg.data.__hashlock,                                                     secret: 0x0,                                                     amount: msg.data.__amount,                                                     timelock: msg.data.__timelock,                                                     sender: msg.data.__sender,                                                     _receiver: msg.data.__receiver,                                                     redeemed: false,                                                     refunded: false});                  send(SendParameters{                 to: myAddress(),                 bounce: true,                 value: msg.data.__amount,                 mode: 128         });     }

wf: hi, what does exit code 34835 mean? I noticed there's no such exit code in the docs

Gregory: Did you find a way to concatenate strings in tact? (reply to 21118)

Nerses: unfortunatley no (reply to 23594)

Dmitry | backend4you.ton: In code that is sending initial Jetton transfer (of “wrong” jettons that you want to return) (reply to 23584)

Anton: most likely it’s auto-generated by the Tact compiler by hashing the data passed to require (reply to 23593)

Gregory: tact-by-example.org/02-strings (reply to 23595)

Ken: https://github.com/microcosm-labs/tact-libs/blob/ab677df79f4803feed6846954a76ef159dcff279/utils/string.tact#L197 (reply to 21118)

Nerses: thanks a lot (reply to 23604)

Viacheslav: is it possible to get a balance of my jetton wallet with the help of InitOf ? or any other way… have to check if I have enough balance

Naved: I am looking for a developer for contract work with experience in writing nft smart contracts, integrating with frontend and understanding of the work of TON.

Justin1: Hello guys, I'm new to TON.   May I ask if there's a way to estimate the exact cost of deploying a contract on-chain?  Assume that I have a parent contract that deploys child contracts. How do I know the sufficient amount of tons to init a child contract instead of just relying on the remainning value of sender?

wf: got it! can confirm the error is produced from require. Thanks! (reply to 23602)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: When I executed a transfer from tonkpeeper to a smart contract, what did the smart contract receive from the ton network? Is it an internal message? (forwarded from Luis Daniel ,Ⓜ️ MEMES▪️🐾)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure { (forwarded from Luis Daniel ,Ⓜ️ MEMES▪️🐾)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Is this always going to be the structure of the internal messages or is it different? (forwarded from Luis Daniel ,Ⓜ️ MEMES▪️🐾)

Yakitori: The wallet smart contract receives an external message then (reply to 23618)

Aydin: (Moved my answer to Ton Dev Chat because here is about Tact) (reply to 23621)

Aydin: Wallet receives external, and the other contract receives internal from wallet (reply to 23624)

Yakitori: Yes you're right, I didn't give the second part of the answer (reply to 23647)

R G: hey guys! do we have some good example/best practices for tact language? i translated solidity contract to tact but now im stuck with writing tests

R G: there are enough knowledge for tact itself but for testing - no

R G: oh so i can use func testing docs for tact? (reply to 23663)

— 2024-05-01 —

Д: Hey👋  For example I have a v3 wallet and I have a USDT jetton contract that is owned by my v3 wallet. Can I somehow calculate what my jetton address will be? Is it predefined or its created when you first send some jettons like in solana?

Howard: storeCoins stores 28 bits of data (reply to 8711)

Wendy: is tact allowed in a contract, call get function in another contract?

Zo🧠: anyone here who knows online ide that support tact language?

Anton: no https://docs.tact-lang.org/book/contracts#getter-functions (reply to 23708)

Anton: https://ide.nujan.io (reply to 23712)

Wendy: in tact, if I deployed a nft collection, how can I get nft item address?

Zo🧠: Thank you very much!!!! 😆 (reply to 23714)

Howard: Can fetch from Get Method (reply to 23718)

Wendy: Which method? Can I pass index and get item address? (reply to 23721)

Wendy: Hi, can you help me? I still can not get nft item address (reply to 23721)

Yakitori: Wow this is fire (reply to 23714)

Yakitori: Btw @AntonTrunov please review my PR in the Tact docs repo :-)

Anton: We will, thanks 🙏  Just a bit busy with Tact 1.3.0 release at the moment :) (reply to 23730)

Ken: Is there any tool to calculate Tact test coverage?

Anton: https://github.com/tact-lang/ton-coverage  but test coverage in general is a very dubious metric (reply to 23737)

Yakitori: It's a good TO-DO metric to check that you did your unit tests (reply to 23738)

Anton: there is a bunch of research that shows there is correlation between test coverage and software quality and a bunch of research that says there is no correlation between test coverage and software quality (reply to 23742)

Yakitori: I agree, I like to test to see basic bugs, and coverage is just a tool to help me make sure that I tested everything. In this way I think it's useful ! (reply to 23743)

Ken: What exactly does this mean completeCoverage('... path to boc files with contracts ...');? Is there an example? (reply to 23738)

Wendy: {       '$$type': 'GetNftData',       is_initialized: true,       index: 3n,       collection_address: EQB6n-04wOvHYYKBBHKxnxucCXJC2uqXO9qg_L7LCBjqOsKH,       owner_address: EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G,       individual_content: x{0168747470733A2F2F62616679626569683765736B68356A786F71633335776E7565716237777234656B6E7061796F777970336C346F6B33737A707173737A6A366134792E697066732E6E667473746F726167652E6C696E6B2F332E6A736F6E}     } how to convert the individual_content to human readable string in typescript

Ken: I tried completeCoverage('../build/SampleContract'); completeCoverage('../build/SampleContract/'); completeCoverage('../build/SampleContract/tact_SampleContract.code.boc'); none works

Wendy: receive("update") {         let ctx: Context = context();         require(ctx.sender == self.owner, "not owner");         self.update_nft_data();     }      fun update_nft_data() {         send(SendParameters {             to: self.collection_address,             value: 1,             mode: SendIgnoreErrors,               // bounce: true,             body: OpenGiftBox{                 nft_item_address: myAddress(),                 item_index: self.item_index             }.toCell()         });     }   if I want to call partent contract in a child contract is this correct?

Miras: Hi everyone! Does anybody encounter a problem when using wrappers then the contract address generated fromInit() is different from actual one? I have passed init state exactly as it is but expecting address differs from actual one

Diego: I'm not only having the same issue from wrappers but also inside the contract (reply to 23791)

Diego: this generates two different addresses if I call it from 2 different contracts

Diego: return contractAddress(initOf NftAccountItem(id, collAddress));

Diego: I think it is a bug in Tact

— 2024-05-02 —

Baldwin: How can i listener cell from emit log?

Tarikh: Hi guys, just starting learning TON and going to learn a smart contract. just want to ask about the Tact. Is this language already good for production?

Diego: this is what it says in their website (reply to 23834)

Tarikh: yes have read it, but anyone alr use it on the prod?

Tarikh: using funC is pretty hard to understand for me 😂

Diego: i've been testing it for almost 2 weeks now it't pretty much stable but I have found some annoying bugs

Sonny: Can anyone tell me, I'm doing the claim token function and when I give the user a claim token, I get this error message

Nerses: Hi everyone ! for checking transaction is failed (using blueprint test) is it ok to pass false in succes field or there is  more appropriate way to do expect(    .transactions).toHaveTransaction({         from: ,         to:   ,         success: false,     });

Daniil: Why is it that when sending 0.02, 0.0001 is not sent back?

Diego: perhaps 0.02 is the minimum amount the tvm requires to execute your code try with 0.03

— 2024-05-03 —

Baldwin: How to listener event log from emit?

Johnny Le: Im facing 12855 error, can anyone pls help me

Wendy: require(context().value >= ton("0.5"), "Insuffcient Funds");

Wendy: can I write as ton("0.5") * 3

Wendy: is add or multiply allowed  for ton in tact

Wendy: const minimalValue: Int = 1 * msg.number; or can I cast it into string?

Wendy: let msgValue: Int = ctx.value;         let minimalValue: Int = 1 * msg.number * 10 * 10 * 10 * 10 * 10 * 10 * 10 * 10 * 10;         require(context().value >= minimalValue, "Insuffcient Funds");

Wendy: I can not use   ton(minimalValue)

Wendy: receive(msg: BatchMint){     require(self.next_item_index + msg.number <= self.total_supply, "Total Supply Excceed");     let ctx: Context = context();     let msgValue: Int = ctx.value;     let minimalValue: Int = 1 * msg.number * 10 * 10 * 10 * 10 * 10 * 10 * 10 * 10 * 10;     require(context().value >= minimalValue, "Insuffcient Funds");     let tonBalanceBeforeMsg: Int = myBalance() - msgValue;     let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);     msgValue = msgValue - (storageFee + gasConsumption);     repeat(msg.number) {         self.mint(ctx.sender, msgValue);     } }

Wendy: @dev_rel do you know the right way to do it?

Howard: I think you could do that. (reply to 23957)

Howard: but why? lol (reply to 23960)

Howard: 1/ be careful the usage in repeat. Better to double check the result by using the emit log or dump   2/ I can't sure whether the message in-put can set inside the repeat (reply to 23962)

Wendy: If I write test using typescript and using jest, how can I see dump? (reply to 23968)

Baldwin: how to get emit log? (reply to 23968)

.: Hi, guys!!! Can somebody help what's wrong with this, I did all from the video https://www.youtube.com/watch?v=J7ZF3KWxX_8&t=286s, but it's not working, help me pls.  import { toNano } from '@ton/core'; import { Counter } from '../wrappers/Counter'; import { compile, NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const randomInt = BigInt(Math.floor(Math.random() * 1000000));     const counter = provider.open(await Counter.fromInit(randomInt));      await counter.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );      await provider.waitForDeploy(counter.address);      console.log('Id', await counter.getId()); }

NB: Hi, I am new to tact programming language  I want to ask that in the receive function, is there any way to check the coin tone sent with that message?  Below is my code:  message CreateOffer {      seller: Address; }    receive(msg: CreateOffer) {           //TODO: Check the number of TON COIN received   }  Thank you very much for helping me

Alexandr: Just look at context().value (reply to 23975)

Daniil: how to send an existing Jetton?

Daniil: where should the address be indicated?

Gregory: +1  Yes, give the piece of code to send the existing Jetton (the whole sending function and all necessary declarations of messages) (reply to 23985)

Daniil: message(0xf8a7ea5) TokenTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton }

Daniil: where should the token address be located? (reply to 23995)

ed: send it to your jetton wallet, the destination is the one who gets it. the actual token is determined by your jetton wallet contract, which is different for every jetton (reply to 23996)

Nerses: bounce: true,                     value: msg.data.__amount,                     mode: 128                 });     }  I have this code in my smart contract. If someone calls this method will the smart contract send TON to reciever or caller will send to reciever ?

Danil: hello, can somebody help, why i have mistake that wanna from me 3 arguments, but in docs tells that i need only 2?

Danil: https://docs.tact-lang.org/book/expressions#initof

Anton: what does Nftcontract init function look like? (reply to 24016)

Anton: you are showing something different (reply to 24022)

Danil: no, that is

Anton: what does the Nftcontract init function look like?  contract Nftcontract {     init(…) {     } }

Anton: we need this part ^^^

Danil: is it?

Danil: owner ?

Anton: how many parameters does the init function have? (reply to 24027)

Danil: uhmm

Danil: 3

Danil: ok

Danil: thx

Nerses: if my transaction is failed should I pass in success field false to pass the test ? expect(  .transactions).toHaveTransaction({         from: address,         to: address,         success: true,     }); (forwarded from Nerses)

User<7034773867>: Hey folks, I've got an exciting opportunity for you all! We're launching a cutting-edge web3 project and we're on the lookout for skilled translators and NFT creators. Plus, we need beta testers and developers to join our team. Offering competitive pay and flexible schedules. Drop me a message if you're keen!

Jeremy: I tried to send a message, but it didn't go through. We should both try sending messages to each other. (reply to 24051)

User<7034773867>: + (reply to 24057)

Daniil: hello, can someone help with receiving and sending tokens?

Aventu: Who can tell me, I want to make a mini app and a smart contract, where should I start and what should I study, can you tell me?

Danil: blueprint

Aventu: Blueprint, tact and func? Best is the blueprint? (reply to 24063)

Danil: for fast start ur proj very well

Aventu: Thank u (reply to 24065)

Daniil: how to send tokens in TS? where to specify the token wallet address?

Danil: message .tact (reply to 24069)

Danil: looks like this

Daniil: message(0xf8a7ea5) TokenTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton }  message(0x178d4519) TokenTransferInternal {     queryId: Int as uint64;     amount: Int as coins;     from: Address;     response_destination: Address;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton }  what to use and what is the difference? (reply to 24073)

Danil: do u have git of standarts ton ?

Daniil: tact-by-example? (reply to 24075)

Danil: https://github.com/tact-lang

Danil: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

Daniil: I need to send tokens to a smart contract and receive them back. I'm not making my own token, I'm working with an existing one (reply to 24079)

Danil: https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc

Daniil: export async function run(provider: NetworkProvider) {     const JettonWalletAddress = "kQD5Bqxff0kOIZNDh3Yx4tawkyRfcz3aJwB-seu_eLNEooh_";     const sendTon = provider.open(await SendTon.fromInit(0n));     const id = await sendTon.getId();     await sendTon.send(         provider.sender(),         {             value: toNano("0.04")         },         "test"     ); } Do I need to indicate the JettonWalletAddress here?

Andrew: Guys, I am a newbie and faced a problem. I created a wallet in the test network using Tonkeeper. Then I created a contract using counter template and now I'm trying to deploy to test network, but after scanning qr code I get error "unable to subscribe to notifications: request failed with status code 400". Deployment test is successful.

Benedict: Hello to all in this chat! We're excited to extend an invitation to our latest venture in the world of Web3. We're on the lookout for seasoned developers and skilled NFT creators. Additionally, we're seeking beta testers and translators to join our team. Rest assured, we offer competitive compensation and flexible schedules. If this piques your interest, feel free to drop me a message

— 2024-05-04 —

Nick: Any examples of other token contracts being called?

cypherpunksO1: Good afternoon, does anyone have a sample contract for shipping jettons?

Louis: how to verify code Tact languaege

Mr. Badihi: Did you figure it out? (reply to 24080)

Daniil: No (reply to 24125)

Baldwin: Does anyone have an example for nft marketplace?

wf: https://verifier.ton.org/  You only need to submit the .pkg file and the options will be configured automatically.  For Windows users, you need to change all path in the .pkg file from windows-style to unix-style (reply to 24124)

Louis: Available on testnet? (reply to 24144)

wf: yes. at the website footer, there’s a toggle to switch to testnet (reply to 24145)

Louis: Thank you (reply to 24146)

PeiQi: Is there any script available for the poof parameter of the nft claim

PeiQi: Similar to the construction of this contract code

Alexandr: Yesterday was release of new version of Tact (1.3.0) and now it should be available.  https://github.com/tact-lang/tact/releases/tag/v1.3.0 (reply to 24099)

Howard: you mean read the emit value from the on-chain level to off-chain? (reply to 23970)

— 2024-05-05 —

God: I don't know why I was banned That's right, I want to read offchain log data but can't find any documentation to guide you sir (reply to 24164)

wf: Hi, is there a way to get block number in tact just like block.number in Solidity?

🅰🅻🅰🅽: you can try our tact implementation of TEPs  https://github.com/Ton-Dynasty/tondynasty-contracts (we actually renamed ourselves to Perman Lab Imao) (reply to 24075)

🅰🅻🅰🅽: i guess what you need is now() instead of knowing block number? (reply to 24264)

🅰🅻🅰🅽: https://tact-by-example.org/03-emit (reply to 23970)

God: i mean emit is done, how can i read this data (reply to 24267)

wf: after further research i think this is doable since block number works the same way as block timestamp. thanks (reply to 24266)

🅰🅻🅰🅽: you may need to use toncenter / tonfura / tonapi to parse the transaction, the emitted log should be in the out_msgs (reply to 24268)

God: Do you have any documents or examples, because I just see it as some kind of encoded string (reply to 24270)

Konstantin: hi guys, tell me please.  How do you usually check whether an address has a specific NFT or not?

God: How to decode out msg sir (reply to 24270)

🅰🅻🅰🅽: This repo shows you how to decode out messages by calling toncenter (use v3), you can install it and try it out.    https://github.com/Ton-Dynasty/pytoncenter (reply to 24271)

🅰🅻🅰🅽: Also, with pytoncenter v3 api, you can check if one has an NFT or not.  https://github.com/Ton-Dynasty/pytoncenter (reply to 24275)

🅰🅻🅰🅽: The best part of pytoncenter is that I have built the tx trace features, which looks like the tonviewer but shows in terminals

Konstantin: thank you man! what if we are talking about a frontend app?  then what are the options? (reply to 24279)

🅰🅻🅰🅽: asset sdk is our best choice for frontend development  https://github.com/ton-community/assets-sdk (reply to 24281)

Thomas: 10

Dan: Hi, can somebody help me out? I'm new to Ton and hitting some problems. I'm using blueprint with the sample counter, in Tact. Everything default, I haven't changed anything yet. I've deployed the contract on testnet and I'm trying to run the increment example script. I can call the getters (getCounter() and getId()), but sending the Add message fails with the exception "AxiosError: timeout of 5000ms exceeded". I've tried to instead deploy to mainnet, but the Deploy message always fails with "AxiosError: Request failed with status code 500".

Dan: ah.. ok, it seems the issue is with Mnemonic, when i use tonhub wallet, I'm able to run the increment script and send the Add message (reply to 24308)

Ext.getCmp('Keken');: Hello everyone, I wrote a smart contract on Tact (using Blueprint). How can I call its function or send a message from the frontend (NextJS)? Is there any documentation on this matter?

Howard: how can we achieving the usage like FunC here to Tact:  const slice TON_VAULT_ADDR = "EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"a; ;; main-net

Ext.getCmp('Keken');: I have another question :)  Is there an analog of “Events” from Solidity in Tact?

God: Same question but there has been no answer so far (reply to 24353)

Anton: look for “emit” in tact docs (reply to 24353)

Vitor: https://docs.tact-lang.org/language/ref/common#emit as Anton said plus https://github.com/toncenter/ton-indexer for indexing (or TonCenter API, if you're looking for a hosted solution). (reply to 24353)

Vitor: Look at the implementation of assets-sdk for sending Jetton messages https://github.com/ton-community/assets-sdk/blob/main/src/jetton/JettonWallet.ts#L84 (basiclly, calling internal on a ContractProvider https://ton-core.github.io/ton-core/interfaces/ContractProvider.html#internal). https://www.npmjs.com/package/@tonconnect/ui-react for an equivalent of RainbowKit (needs a 'use client'; wrapper to use with nextjs) (reply to 24330)

— 2024-05-06 —

Justin1: hi, can anyone send transaction on testnet atm?

God: same issue

live: network overloaded?

God: The number of transactions is too small, how can it be overloaded? (reply to 24416)

live: this (reply to 24417)

live: I tried to use ide.nujan.io to deploy it to testnet

Jimmy Becen: same issue (reply to 24413)

wf: Regarding this implementation in the staking contract, does this mean that the token will not be returned to the owner if the staking Tx fails e.g. staker doesnt fulfill the staking requirement? (reply to 22231)

Alex: Testnet work?

Johnny Le: Still error

Johnny Le: How can I update tact to 1.3.0

Alexandr: I know only one way with blueprint, it’s create new project by command: npm create ton@latest   And here will be tact 1.3.0 (and then you can move your files to new project)  If someone knows how to update tact version in existing project, pls say) (reply to 24439)

Alexandr: considering that this issue is open, i think no other ways right now  https://github.com/ton-org/blueprint/issues/100 (reply to 24442)

Danil: Change v4 to v3

Gregory: How can I put the cell jetton_wallet_code in order to calculate user jetton wallet?  The jetton has been already deployed, and I see its raw and byte codes in 3 formats (hex, Cells and Base64). How can I use this code in func?

Anton: I haven’t tried it, but something like yarn upgrade in your existing project should work (reply to 24443)

denis: how i can import my python code to telegram?

…….: Hz (reply to 24453)

Alexandr: yeah it's working, thx) (reply to 24452)

Valera: 13

Valera: Hi. Can I debug my receive function in traits? I already set debug flag

Nerses: Hi everyone. How can I interact with deployed smart contract on testnet (send innner message) ?

wf: is this for testnet? (reply to 24444)

Justin1: hi, after I send a transaction, how can I check if the tx is failed or partially failed with the returned tx hash?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: How can I deploy a contract to the testnet? (forwarded from Luis Daniel ,Ⓜ️ MEMES▪️🐾)

Nerses: use https://ide.nujan.io/ (reply to 24497)

Nerses: i think this may help https://github.com/ton-org/sandbox/blob/main/docs/tact-testing-examples.md#transaction-success-test:~:text=Transaction%20Success%20Test (reply to 24490)

Valera: Is there contract examples for marketplace and sale?  I found examples for collection and item contracts

Влад: 13

Nerses: how can i lock funds in smart contract ?

Nerses: for example call  function and so send funds to smart contract which can be redeemed if certain requierments are met

Ext.getCmp('Keken');: Hello everyone, what are some methods to prevent the misuse of a contract by third parties? For example, should I simply maintain an array of owner addresses and check each receive?

ㅤ: Hello! I try to test contract which using external message feature; I added these parameters to the *.compile file:  export const compile: CompilerConfig = {     lang: 'tact',     target: 'contracts/fcontract.tact',     options: {         external: true,         masterchain: true     } }    but I still get an error when running the test:  { message: `Masterchain support is not enabled for this contract` }

Danil: For any reason (reply to 24489)

Danil: Mainnet/testnet

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: 6

ㅤ: Is everyone having problems with version v4-testnet?  How do I change the testnet version in blueprint?

Даниил: What kind of documentation do you use? (reply to 24554)

Vitalik: Hello. I'm looking for someone who can raise a node to TON and connect it to the web

ㅤ: I'm not sure if I'm asking in the right chat room. But in general I'm working with the orbs-network/ton-access library and I'm having problems with v4-testnet. Which you can see right here: https://ton-access-status.herokuapp.com/. I'm not sure if changing the testnet version is the solution, but I don't have any other versions (reply to 24557)

— 2024-05-07 —

Serge K: Delete spam-bot please, it banes my account for github link, for big answers. I can’t even ask anything normally  banned not only from this group, but from all public chats

Serge K: Where i can find information about remaining (from Slice) type?

Jay: Can try to refer to the deployment script here in the template: https://github.com/howardpen9/nft-template-in-tact/blob/tutorial/sources/contract.deploy_api.ts (reply to 24497)

minhtienhcmus: how to return address  in using method receive in tact ? please help me

Nikita Aplin: Someone try this? https://github.com/everx-labs/TVM-Solidity-Compiler

Vitor: Sounds like a terrible idea to be honest. There are enough differences (call/delegatecall mechanics, storage pricing) between the TVM and EVM so the mental models for writing contracts don't really match. (reply to 24618)

Valera: Hi. Is there contract examples for marketplace and sale?  I found examples for collection and item contracts? I tried write by myself but when nft minting on Getgems nft has no price

Valera: I tried rewrite code from typescript to tact from step-by-step doc ton

Valera: I found offer contract example by alefmanvladimir and I don’t understand how to deploy this contract

Vitor: https://github.com/howardpen9/nft-template-in-tact/blob/tutorial/sources/contract.deploy_api.ts use this an example, hack a quick script and deploy. (reply to 24637)

Valera: I did like in this template (reply to 24638)

Valera: But in getgems nft haven’t price

Vitor: Look at the fixed price sale contract from getgems: https://github.com/getgems-io/nft-contracts (reply to 24640)

Vitor: It's FunC though.

Valera: Yes. Func (reply to 24642)

Nikita Aplin: Is it possible to import func file to tact?

mar1n {preR status}: Can i use tact as only one language for TON dapps? If yes what can i loose by this decision

Dmitry: Hello! How I can set empty address to response_destination param in JettonTransfer message? Does tact has method like emptyAddress()?

Louis: score_list: map<Address, Int>;   self.score_list.get(msg.applied_user_address)!!  !! What does it mean?

Louis: self.score_list.get(msg.applied_user_address)!! (reply to 24658)

Louis: score_list: map<Address, Int>; is map

Anton: !! means ‘unpack an optional if you are sure it’s not a null’  you are not supposed to use it directly on the result of the get method, unless it’s a 100% guaranteed your map has that key (reply to 24657)

Benedict: Hey all! Exciting opportunity: come aboard our web3 project. Need translators, NFT creators, developers and beta testers. Good pay and scheduling. Message me if keen.

— 2024-05-08 —

Max: Hello, I can't receive TransferNotification messages on testnet. For example, simple smart contract:  message(0x7362d09c) TransferNotification {     query_id: Int as uint64;     amount: Int as coins;     sender: Address;     forward_payload: Slice as remaining; }  contract Zero with Deployable {          init() {}      receive(msg: TransferNotification) {         emit("1".asComment()); //doesn't work     }      receive(msg: String) {         emit("2".asComment()); //works     } }  String messages work well, and TransferNotification messages don't work. I can't get why?

Valera: Hi. Can someone explain a couple of things?  To put NFT up for sale in getgems, do you need an offer and marketplace contract?  Or it's done in a different way. The path from writing a collection contract to selling for a fixed price is interesting

encs: Someone ban these scammers (reply to 24692)

Johnny Le: How to know if a tx success guys

Johnny Le: Can I use result.transactions

Howard: how to know he is scammers (reply to 24716)

encs: Try to contact them, if you want to work for them as a dev they ask you money to process your candidature lol (reply to 24745)

Yakitori: Here me out

Yakitori: No upgradeability in Tact contracts is not a bug

Yakitori: It's a feature

Yakitori: Don't like it ? Skill issue

Howard: Yes, some people think it's better to let developers write smarter contracts, so users don't have to worry about the risk of upgrades. (reply to 24764)

Valera: Hello. Looked ur public repositories with a smart contract offer nft. Do u have example smart contract for fix price sale nft ? (reply to 24770)

Valera: Did u delete the message ? (reply to 24770)

Howard: I can't send URL in this account lol

Howard: No, since Tact cost higher than FunC. But can take reference in this: https://github.com/getgems-io/nft-contracts (reply to 24772)

Valera: Same thing)) (reply to 24777)

Valera: Do u mean that I should write a contract on typescript? (reply to 24778)

Howard: https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc (reply to 24780)

Valera: Thx u 🙏 (reply to 24783)

— 2024-05-09 —

Baldwin: I only know about tact, can you briefly explain how it works, so I can understand the code using tact :D (reply to 24783)

Steven: let prepare = await prepareTactDeployment({ pkg, data, testnet });  I've set up the proxy but I'm getting an error when deploying the contract, I need help

dotfx: Hey there! As a Solidity dev, I'm really interested in Tact Can someone explain why the Github repo of the compiler has been archived (ton-community/tact)? Is there an active fork being maintaned? Thanks!

dotfx: Ok replying to myself Active github repo: tact-lang/tact Very alive, definitely a good choice

Jay: Can try using tonapi deployment script instead of Tact Deployment script? (reply to 24831)

Steven: Let me try (reply to 24834)

Vitor: I'm coming from a Solidity background as well. Happy to help/talk if you have questions 😊 (reply to 24833)

Yakitori: Do you know what the best practices are regarding gas forwarding? (reply to 24850)

Yakitori: https://docs.tact-lang.org/book/message-mode

Yakitori: For each case, what is the typical situation?

Pavel: Where I can find information about difference between Slice and Slice as remaining?  I didn't find anything in docs

Artem: Hi everyone! Does anyone have an example of contract? Which takes ton from connected wallet and send it to another one. Or if possible, just lockup some ton on the wallet and unlock it by request? The second one is more preferable. Thanks in advance!

Yakitori: I have looked for this but there is no info in the docs (reply to 24898)

Pavel: That's I'm talking about) (reply to 24912)

ᗩᒪᗴ᙭: ?

Ken: Slice as remaining just stores data using the remaining bits and refs of a cell, Slice stores data in a fresh new cell (reply to 24898)

wh: hello guys, does anyone know how to send tuple as argument to get function ? thank you in advance

— 2024-05-10 —

User<6855931209>: Does anybody need a  developer?

Johnny Le: I want to use TokenNotification for 2 different function (1 is to record amount when an user deposit in money, 1 is for admin to deposit in money)

Johnny Le: But I got error redefinition of function, how can I fix

Jay: What is the error? (reply to 24961)

User<6855931209>: 9

Johnny Le: I can not use to receive with the same Notification (reply to 24963)

Johnny Le: receive(userDeposit: TokenNotification) receive(adminDeposit: TokenNotification)

Johnny Le: like this

Jay: Try define the logic inside the function, where sender() === self.admin (reply to 24967)

Johnny Le: so u mean use if else in 1 function ? (reply to 24970)

Jay: Yes can try (reply to 24971)

Johnny Le: if I want to defi in 2 function, then can I use send(SendParameters with body is tokentransfer ? (reply to 24972)

Jay: Yes you can, but I think since the receive define TokenNotification it'll come to that as well right (reply to 24973)

Johnny Le: thank mate (reply to 24974)

Jay: Happy to help (reply to 24975)

Louis: where are u from? (reply to 24976)

Jay: You can try the Send Coin and Receive Coin example in github tact-lang/tact-by-example I'm unsure if I can share URL here thus not doing so. (reply to 24911)

Jay: SG (reply to 24977)

Johnny Le: btw how to write a function that msg.sender call to its jetton wallet to transfer jetton token to contract (reply to 24976)

Johnny Le: cause at "to:", I dont know how to pass jetton wallet of msg.sender

Pavel: It calculates automatically inside defaultJettonWallet implementation (reply to 24983)

Jay: First we calculate the user jetton wallet address by passing in the jetton master wallet address. Can refer to this script.     const jettonMaster = client4.open(JettonMaster.create(Address.parse(JETTON_MASTER_ADDRESS)));     const TARGET_ADDRESS = await jettonMaster.getWalletAddress(USER_ADDRESS);   Then TARGET_ADDRESS is the user jetton wallet address right, we can send an instruction to it to send X amount of jetton to contract. See below.     let packed_msg = beginCell()         .storeUint(0x0f8a7ea5, 32)         .storeUint(0, 64)         .storeCoins(toNano(7)) //number of jetton to be sent         .storeAddress(Address.parse(SMART_CONTRACT_ADDRESS)) //send to where? the contract address         .storeAddress(USER_ADDRESS) //when done, response to where         .storeUint(0, 1)         .storeCoins(toNano("0.4")) // forward amount         .endCell();   Then finally we trigger the sending             internal({                 to: TARGET_ADDRESS,                 value: toNano("0.5"),                 body: packed_msg,             }), (reply to 24982)

Johnny Le: thanks much lets me try (reply to 24986)

NB: Hello guys, I have a question about out-of-money contracts (TON coins).  I have a smart contract that has performed many transactions, however, from now on I will no longer use that smart contract so I will withdraw all money from the contract.  I want to ask if this is a problem? For example, about 10 years later, I want to check the transactions of this contract, can I check? (I do not create new transactions on this contract)  Thank you for your support

Artem: I thought, that lock coins more secure. Otherwise I need to have separate contract for every user. Is this kind of thing possible? (reply to 24980)

Howard: 👍🏾 (reply to 24929)

Howard: https://tact-by-example.org/all (reply to 24911)

Daniil: all contracts must pay fees for storing data on-chain. if your contract stops paying these fees (for example, you withdraw all its balance), it'll become frozen after some time, and if it's frozen for long enough, it'll get deleted from blockchain completely.  transaction history could still be visible, though, but there are no guarantees that it will be visible forever. (reply to 25001)

Pavel: The difference between bounce: true and mode: SendBounceIfActionFail is that in first case it bounces if contract can't receive this type of message or contract doesn't exist and in second case it bounces if revert occurs during action?  If bounce set to true and contract revert during action, than this won't bounce without this mode?

gavin: Hello guys, I would like to ask if there are any DEX Dapps written in Tact language now? I want to learn

Howard: At this moment, no.  But I heard that some people are trying to do so. (reply to 25029)

gavin: Ok, thank you for your reply (reply to 25033)

Howard: Since a DEX is highly transaction-intensive, we still recommend building on FunC. However, it also requires more time to learn and build, so you need to assess your project scope and team size to determine which language to use. (reply to 25035)

Pavel: When working with different protocols, I cannot be sure that I will always have enough gas. Will bounce work if I set mode: SendBounceIfActionFail and run out of gas while performing actions?  As far as I understand, enough gas must be reserved for bounce in this case.

Steven: 7

Steven: How should I deploy the contract, I need help

Steven: Case deployment always fails

Jay: Can try tonapi deployment instead of tact verifier? (reply to 25046)

Steven: I still want to figure it out

Valera: Check ur imports (Contract, pkg). Check path to build folder (outputPath), and Paste ur imported Contract instead of SampleTactContract. Also check ur code (reply to 25046)

Pavel: Oh, you are the owner of the git repository that contains the jetton example. I just have questions about your implementation) Can you answer if it’s not difficult?  1) For example, why in jetton.tack#L211 such a balance check, we use safeMath by default, so it should be replaced with require(self.balance >= msg.amount, "Invalid amount");  before subtraction.  2) Why is response_destination of type address?, although in TEP-74 this parameter is set explicitly. Should it be address and may have value address(0,0)?  3) Why don't we use mode: SendBounceIfActionFail in burn/mint receivers, since we don't have gas checks there?  In general, thanks for the example, it’s very clear and helps in understanding architecture! (reply to 25012)

Steven: Yes, I checked my code again and found no problem. The error message is that my connection failed. Is the deployment address invalid, or is it a problem with my proxy? (reply to 25049)

Jay: Oh also can check if you ran the build command to build the TACT output files? (reply to 25049)

Jay: I've hit this before as well, try another connection (mobile data) (reply to 25052)

Valera: Yes, sure Need build contract before deploy and tests)) (reply to 25054)

Jay: Yepp

Valera: Seems like u don’t have internet connection :)  And axios can send request)) (reply to 25053)

Valera: Can’t * (reply to 25058)

Steven: However, the url is failing

Steven: ping ton-source-prod-testnet-1.herokuapp.com time out

Valera: Can u send this ur code (reply to 25046)

Nerses: GM!  I have written smart contract in TACT.While testing it I use printTransactionFees(result.transactions) and see that tranasaction fails with exit code that I need but same time this piece of code fails    expect(result.transactions).toHaveTransaction({         from: hashedTimeLockTON.address,         to: receiver,         success: false,     }); What can cause this ?

Steven: https://github.com/tact-lang/tact-template (reply to 25063)

Valera: No, not template. Ur part of code (reply to 25065)

Valera: Mb u don’t have a test net wallet? (reply to 25066)

Steven: This is what I use (reply to 25067)

Valera: With address that u pasted in Address.parse (reply to 25067)

Steven: No way either (reply to 25069)

Ken: I wrote a tool to generate Mermaid diagrams from sandbox transactions https://github.com/microcosm-labs/tact-tools/tree/main/ts-utils

Valera: sry, then idk (reply to 25070)

Steven: Why is the private key not used to deploy the contract?

User<6855931209>: Does anybody need a  developer?

Daniil: that sounds exactly as the thing I dreamed of few months ago! does it only work with Tact or I can pass arbitrary transactions? (reply to 25071)

Ken: It uses Tact generated ts files to parse message names, error codes and boc into plaintext, but other than that it works for arbitrary transactions (reply to 25096)

wh: hi guys, how to calculate child contract address when init data is not empty ?

Valera: data + code = address as i know (reply to 25102)

Valera:  let nft_init: StateInit = initOf Item(myAddress(), msg.index);     let nft_address: Address = contractAddress(nft_init);  Nft item address (reply to 25102)

Valera: data + code* (reply to 25121)

Pike 🦴 🏴‍☠️: hi guys

Pike 🦴 🏴‍☠️: send(SendParameters{                 to: contractAddress(nft_init),                  value: msgValue - self.mint_fee,                  bounce: true,                 mode: SendBounceIfActionFail,                 body: Transfer {                     query_id: 0,                     new_owner: sender,                     response_destination: self.owner_address,                     custom_payload: self.collection_content,                     forward_amount: 0,                     forward_payload: emptySlice(),                     referral: referral                 }.toCell(),                 code: nft_init.code,                 data: nft_init.data             });

Pike 🦴 🏴‍☠️: why does this NFT init code would bounce no matter what

Pike 🦴 🏴‍☠️: if i perform a loop to mint multiple NFT, if my input is not sufficient it would return "integer not in expected range" down the line

Valera: Can somebody tell me a logic of fix-price-sale for nft item?  Whats messages he's must receive? OwnershipAssigned?  Maybe someone has a scheme of this process ?

Pike 🦴 🏴‍☠️: but even thou the mint is failed the transaction is still partially successful

Pike 🦴 🏴‍☠️: and the nft counter still went up

Vitalik: Hi. Help please.   After creating the transaction, I received a boc - how can I validate that it has a delivery address and the required amount?  here is an example - I use it in js   async function sendTransaction(value) {     const transaction = {         validUntil: Math.floor(new Date() / 1000) + 360,         messages: [             {                 address: "123456789",                 amount: (value*(10**9)).toString() //Toncoin in nanotons             }         ]     }     try {         const result = await tonConnectUI.sendTransaction(transaction);         console.log("Transaction sent. Result:", result);         console.log(result.boc);     } catch (error) {         console.error("Failed to send transaction:", error);     } }

Андрей: Can anyone show an example of sending a dedust swap transaction on a tact?

Андрей: is this issue planned to be solved? https://github.com/tact-lang/tact-docs/issues/146

— 2024-05-11 —

Anton: of course, but there is no timeline at the moment (reply to 25157)

Steven: What dependent libraries are used to deploy contracts?

wf: hi, can someone tell me what does n/a exit code mean?  i want to simulate staking operation for 600 users. the first 500 TXs passed successfully, but the subsequent tx has n/a exit code (which supposedly be 0 exit code) in one of the messages which caused error for the whole tx.

Bwo: n/a it like null, no info (reply to 25194)

wf: yeah, as shown in the snippet (reply to 25198)

wf: the message with n/a exit code is supposed to call token minting message in another master contract.   the message returns success: true but i think it somehow doesnt actually execute the process. How is that even possible? (reply to 25199)

Valera: Hi  I have a problem. I can't put on sale my nft  Contract sale  import "@stdlib/deploy"; import "./messages.tact";  @name(muldiv) native mulDiv(a: Int, b: Int, c: Int): Int;  const minGasAmount: Int = ton("1");  contract FixPrice with Deployable {   isComplete: Bool = false;   createdAt: Int as uint32;   marketplaceAddress: Address;   nftAddress: Address;   nftOwnerAddress: Address;   fullPrice: Int as coins;   marketplaceFeeAddress: Address;   marketplaceFee: Int as uint32;   royaltyAddress: Address;   royaltyAmount: Int as uint32;   init(marketplaceAddress: Address,     nftAddress: Address,     nftOwnerAddress: Address,     fullPrice: Int,     marketplaceFeeAddress: Address,     marketplaceFee: Int,     royaltyAddress: Address,     royaltyAmount: Int){     self.createdAt = now();     self.marketplaceAddress = marketplaceAddress;     self.nftAddress = nftAddress;     self.nftOwnerAddress = nftOwnerAddress;     self.fullPrice = myBalance();     self.marketplaceFeeAddress = marketplaceFeeAddress;     self.marketplaceFee = marketplaceFee;     self.royaltyAddress = royaltyAddress;     self.royaltyAmount = royaltyAmount;   }    receive(msg: NftOwnershipAssigned){     let ctx: Context = context();     dump(ctx.value);     dump((self.fullPrice + minGasAmount));     require(sender() == self.nftAddress, "Invalid Owner");     require(!(self.isComplete), "Already completed");     nativeThrowUnless(450, ctx.value >= (self.fullPrice + minGasAmount));     send(SendParameters{         to: self.nftOwnerAddress,         value: (((self.fullPrice -           self.marketplaceFee) -           self.royaltyAmount) +           (myBalance() -           ctx.value)),         mode: SendPayGasSeparately       }     );     dump("Sent message to nft owner address");     send(SendParameters{         to: self.royaltyAddress,         value: self.royaltyAmount,         mode: SendPayGasSeparately       }     );     dump("Sent message to royalty address");     send(SendParameters{         to: self.marketplaceAddress,         value: self.marketplaceFee,         mode: SendPayGasSeparately       }     );     dump("Sent message to marketplace address");     send(SendParameters{         to: self.nftAddress,         value: 0,         body: NftTransfer{           query_id: msg.queryId,           new_owner: msg.prevOwner,           response_destination: self.nftOwnerAddress,           custom_payload: emptyCell(),           forward_amount: 0,           forward_payload: beginCell().storeCoins(0).endCell().asSlice()         }.toCell()       }     );     dump("Sent message to nft address");     dump("complete");     self.fullPrice = (self.fullPrice - minGasAmount);     self.isComplete = true;   }    get fun get_sale_data(): NftFixPriceSaleData {     return       NftFixPriceSaleData{         isComplete: self.isComplete,         createdAt: self.createdAt,         marketplaceAddress: self.marketplaceAddress,         nftAddress: self.nftAddress,         nftOwnerAddress: self.nftOwnerAddress,         fullPrice: self.fullPrice,         marketplaceFeeAddress: self.marketplaceFeeAddress,         marketplaceFee: self.marketplaceFee,         royaltyAddress: self.royaltyAddress,         royaltyAmount: self.royaltyAmount       };   } }  And trait NftStandards

Valera: import "../messages.tact"; // const min_tons_for_storage: Int = ton("0.05"); // trait NftStandarts {   deployed: Bool;   collection: Address;   owner: Address;   index: Int;   content: Cell;    receive(msg: NftTransfer){     let ctx: Context = context();     nativeThrowUnless(401, sender() == self.owner);     require(self.deployed, "Not Deployed");     let rest_amount: Int = (myBalance() - min_tons_for_storage);     dump(rest_amount);     if (msg.forward_amount != 0) {       rest_amount = (msg.forward_amount + ctx.readForwardFee());     }     if (msg.response_destination != null) {       rest_amount = (rest_amount - ctx.readForwardFee());     }     nativeThrowUnless(402, rest_amount >= 0);     if (msg.forward_amount != 0) {       send(SendParameters{           to: msg.new_owner,           value: msg.forward_amount,           mode: SendPayGasSeparately,           body: NftOwnershipAssigned{             forwardPayload: emptySlice(),             queryId: msg.query_id,             prevOwner: self.owner           }.toCell()         }       );     }     if (msg.response_destination != null) {       send(SendParameters{           to: msg.response_destination,           value: rest_amount,           body: NftExcesses{query_id: msg.query_id}.toCell()         }       );     }     self.owner = msg.new_owner;   }    receive(msg: NftGetStaticData){     send(SendParameters{         to: sender(),         value: 0,         mode: SendRemainingValue,         body: NftReportStaticData{           query_id: msg.query_id,           index: self.index,           collection: self.collection         }.toCell()       }     );   }    get fun get_nft_data(): NftData {     return       NftData{         deployed: self.deployed,         index: self.index,         collection: self.collection,         owner: self.owner,         content: self.content       };   } }

Valera: This is my test case  await nft.send(       deployer.getSender(),       {         value: toNano('5'),       },       {         $$type: 'NftTransfer',         query_id: 0n,         new_owner: sale.address,         response_destination: deployer.address,         custom_payload: beginCell().endCell(),         forward_amount: toNano('0.5'),         forward_payload: beginCell().endCell(),       },     );      console.log(await nft.getGetNftData());     console.log(await sale.getGetSaleData());  But  getSaleData still equals false  Can someone tell me where is my mistake in contract?

Aleksandr: Could you explain this a little bit? Where this value comes from? (reply to 4869)

Daniil: It’s a constant set in blockchain configuration (reply to 25236)

Daniil: Actually I’m not sure if it’s 0.0001 or 0.00004 now, as there was a fee reduction recently

NB: Hello guys, I use require and am passing error: String. fun require(condition: Bool, error: String);  So, where can I read error: String. I checked the transaction message on testnet.tonscan.org but couldn't find any error text.

Justin1: fun emit(body: Cell);  Hi, how can I estimate the gas cost when contract emit an event in tact?

Piotrek: Hello, how long did you want for getgems to update metadata collection?

Денис: Hello,  How can I find out the status of the contract at its address?

User<7034773867>: Attention, adventurers! Join our squad as we embark on an epic DeFi gaming project. With vacancies aplenty, we prioritize seasoned hands. Every application will be duly considered, so don't hold back!  Moderator  - $600/week NFT Artistic Genius - Compensation discussed one-on-one Game Design Guru -  $4000/month Developer- About $5000/month (flexible) Beta Tester (experience optional) - Starting from $50/hour. Weekly payments available in USDT, BTC, or ETH. Drop us a DM if this piques your interest!

— 2024-05-12 —

Blockchain Dev: Does anybody know there are some analog of Code4Rena for TON smart contracts?

Creator: Hello everyone! Who can help me?)  Im trying to send message to JettonWallet of my contract. Before this I sent some amount of Jettons there from another wallet. But something wrong and after 'revoke' self.state is in OfferClosed state, but JettonWallet of this contract is still has jettons.    ```           receive("revoke") {         require(self.owner == sender(), "Offer could be revoked only by poster.");         require(self.state == OfferPublished, "Cant revoke job. ");         self.send_deposit(self.owner, self.price);         self.state = OfferClosed;     }      fun send_deposit(address: Address, amount: Int) {         let init: StateInit = initOf TokenWallet(myAddress(), self.jetton_master);           let my_jetton_address: Address = contractAddress(init);         let forward_destination: Int = ton("0.91");         send(SendParameters{             to: my_jetton_address,              value: 0,             mode: SendRemainingValue,              bounce: false,             body: Transfer{ // 0x0f817ea5                 query_id: 0,                 amount: amount,                 destination: address,                 response_destination: address,                 custom_payload: beginCell().endCell(),                 forward_ton_amount: forward_destination,                 forward_payload: beginCell().endCell().asSlice(),             }.toCell(),             code: init.code,             data: init.data         }); ``` Here is peace of tests:  // revoke         let res = await jobOffer.send(             poster.getSender(),             {                 value: toNano(1.64)             },             "revoke"         )         JOData = await jobOffer.getJobData()         assert(JOData.state == 6n) // passed                  poster_data = await posterJettonWallet.getGetWalletData()         log(fromNano(poster_data.balance), "Poster balance after revoke") //did not changed          OfferContractData = await jobOfferJettonWallet.getGetWalletData()         log(OfferContractData.balance, "Offer balance after") // did not changed   Or how can I debug this casee

Ext.getCmp('Keken');: Hello everyone, is there any trait (like Ownable) for a contract to use Jetton instead of native TON?

Louis: How to notify received token jetter

Louis: tx received(0x7362d09c)

Louis: But UI wallet TonKeeper not show history

Louis: Do I need to change Forward Payload: Empty Slice() to  not empty?

Valera: Can someone suggest me? Rewrite nft-fixprice-sale-v3r3.fc this contract from func to tact. And is func contract op-code == 2 & op-code == 0, but in op-codes.fc there is no op-code that returns 0 or 2 value. Maybe this op-codes there is by default in lang?  https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc

Valera: rewriting * (reply to 25322)

Cesar: hey guys, can anyone help me figure out how to provide liquidity on ston.fi (create a pool) in tact?

Christine: Any off-the-shelf solutions for sending nfts in large quantities via minting directly to the user's address?

Valera: What it could be? It’s error when I put on sale nft

ビクトリア🍊: I can't even buy nft in testnet of getgems (reply to 25394)

Valera: Test net is fell? (reply to 25399)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Hello.... I found a repository on github that is in func and typescipt.... To use it I programmed my code in typescipt, how do I deploy that code on the ton network... Do I do it with blueprint?....I mean... I create a new project in blueprint... I install the github repository... I copy my code into the script part and run it... Does that work? (forwarded from Luis Daniel ,Ⓜ️ MEMES▪️🐾)

— 2024-05-13 —

wf: can the /estimateFee api in Toncenter be used for estimating gas fee for the contract recv() call?  https://toncenter.com/api/v2/estimateFee

minhtienhcmus: how to  setting input type array in method. receive on tact ? please help me ?:((

Winder: does ton coin itself has an address? thanks

Nerses: Hello everyone,  I'm encountering a problem while testing a smart contract written in Tact language. I use the printTransactionFees(result.transactions) function to observe transaction details, and I notice that the transaction fails as expected with a specific exit code. However, when I run a check to verify the transaction status, it unexpectedly shows success: true. Here's the check I'm using: expect(result.transactions).toHaveTransaction({     from: hashedTimeLockTON.address,     to: receiver,     success: false, });

Sunny: Hi everyone! Could you please help me about this: I have a code snippet in Tact language for emitting an event in bellow: receive("transfer") {     emit(TransferEvent{amount: ton("1.25"), recipient: sender()}.toCell()); }  My question is how to listen that emit event from scripts/frontend. Actually i need the code to listen for this event. Hope to receive help from you guys. Thank you in advance!

Stanislav: Hi, All! Anybody knows, how Tact use cells to store data:  as linear single ref tree, or use all cells?

Louis: how to read value from contract to contract different

Extiint: This is the funniest group, with everyone coming with a question and nobody answering 🤣

Valera: U r right))) (reply to 25513)

Extiint: Tact increase in popularity and will only grow from here, since it's the only easy alternative out there, especially for EVM devs

Louis: how to get balance jetton token balance from contract different (reply to 25512)

Stanislav: via messages, damn (reply to 25512)

Louis: how to  read balance  jetton token from contract (by message) (reply to 25517)

Louis: jetwallet not define reply send balance (reply to 25518)

Stanislav: Add this function, that send back message with balance (reply to 25519)

Louis: The contract wallet has been deployed (reply to 25520)

Stanislav: Sad ((

Родион: hi

Farel: hi, how can I create a multisend contract if there are no arrays in tact?

все капли из Европы ..азии ..африки и ближнего востока все в нал: Honduras people come

Родион: why i get error like "Unsupported format unit64" in this case?   message Add {     queryId: Int as unit64;     amount: Int as unit32; }

— 2024-05-14 —

Wendy: @dev_rel Is it possible to deploy a staking contract for NFT?

Jay: Try uint64 and uint32 (reply to 25559)

Spetsnaz: Is there a Tact implementation of Wallet V4?

Jay: Yeahh, I come from a typescript javascript background and found it easy to learn (reply to 25515)

minhtienhcmus: How to fix an inactive status issue when a contract is deployed from another contract on tact laguage?

Родион: Thank's a lot, it works for me :) (reply to 25566)

gavin: Guys, I would like to ask how to determine which version of the wallet an address is? I know there are v3 and v4. I want to know how to identify them

Slava: Why? (reply to 25585)

Jay: Happy to help (reply to 25584)

Manh Tran: Hi everyone. Can u give me some examples that is written by tact about staking/token vault/interact with jetton token?

Jay: You can try search github howardpen9/jetton-implementation-in-tact I drew a lot of inspirations and learnings out from this. (reply to 25592)

Manh Tran: thanks for sharding

@: Кто уже делал токен через смарт контракт, напишите в лс, есть вопросы на которые вы точно ответите. Оплачу

@: 9

Creator: Hi everyone!  Why log say differend addresses for posterJW contract amd posterJW contract from jetton_master address?   deployer = await blockchain.treasury("deployer");         token = blockchain.openContract(await TokenMaster.fromInit(deployer.address, content));         await token.send(             deployer.getSender(),             {                 value: deployAmount,             },             "Mint: 100"         )          poster = await blockchain.treasury("poster");         posterJW = blockchain.openContract(await TokenWallet.fromInit(poster.address, token.address));         log(posterJW.address, "from JW ADDRESS")         // EQDN90HlNJNMAI2J--JlpyK4ISFIS5hJrFHkFngxVaKk0eih         log(await token.getGetWalletAddress(poster.address), "from JettonMaster master method")         // EQCT3z2WWPrw8Nz8Itx-Z1go34hVbc0x0QwH__u83fcR4UOg

Johnny Le: Hi guys, how can I use this: let a: Int = b /c;

Johnny Le: But b is 5 and c is 8 then a is not an Int anymore

Johnny Le: Cause I see no float

Ken: 5/8=0 (reply to 25614)

Johnny Le: yep but I want to calculate 0.4 😩(( (reply to 25617)

Johnny Le: impossible ?

Ken: depends on your use case, you can scale b up by 1000

Johnny Le: ok thank br

Howard: hey, what kind of Staking do you mean here? (reply to 25565)

Jay: Yes scale up by 1000 as suggested by @kenxfi is a good idea, when dealing with Jettons since it's the smallest unit is indivisible anymore, thus no float. (reply to 25618)

Wendy: Stake nft item into a contract for a certain time (reply to 25627)

Johnny Le: Can I code Multisend like this: So I can send from my adress to many receiver by using for loop (reply to 25628)

User<6855931209>: I 'm looking for a dev position

Creator: Please help guys.  Why is this problem? Where is the mistake? (reply to 25606)

Denis: I've encountered the same problem. There seems to be a bug that generates the interfaces for imported contracts with a bit different sorting order when you code is generated for different contracts. And then this interfaces with different sorting are hashed to construct the IPFS link and that link get's embedded into your contracts source code (! that's a very bad thing it's not on demand). And that's what makes the source code and thus the resulting addresses differ.  Unfortunately I have no solution, we've finished our prototype with a workaround and are done with Tact for now. (reply to 25637)

Creator: Thanks (reply to 25642)

Эльдар: Hi all, duplicating the first post as it was deleted.  I am new to tact, but backend developer background. I can't figure out how to implement a simple thing so that a smart contract can find out what NFTs the calling wallet has.

Эльдар: There was an idea to keep track of the NFT rights transfer and record the data in the state of the main smart contract, but it looks messy (huge gas fee) (reply to 25651)

Эльдар: tell me if I'm in the wrong chat with this question.

Daniil: link in pm

Louis: Hi Bounce OpCode = 0xffffffff and payload : payload: b5ee9c720101010100220000400f8a7ea50000000000000000504a817c800800b19f92f2a4b6bdc9d18f7c690f

Louis: how to process to revert ?

Louis: send link (reply to 25665)

User<6855931209>: Does anybody need a  developer?

🦜: no, i use chatGPT now (reply to 25675)

— 2024-05-15 —

Ken: After tactdoc and sandboxMermaid, we're releasing our tactfmt tool to format your Tact code: https://github.com/microcosm-labs/tact-tools/tree/main/tactfmt

Wendy: @dev_rel Hi, in tact  receive()  works for jetton tokens?

Wendy: for example, I send jetton token to a contract, and call function

Manh Tran: Must call message between contract and jetton

Creator: Hi everyone. Question about testing contracts. I need to emulate blockchain environment and test interaction between different contracts;  What another approach I can explore for testing this functionality? Because I met the problem:  token = blockchain.openContract(await TokenMaster.fromInit(deployer.address, content));         await token.send(                 deployer.getSender(),                 {                     value: deployAmount,                 },                 "Mint: 100"             )         deployerJW = blockchain.openContract(             await TokenWallet.fromInit(deployer.address, token.address)          )         log(deployerJW.address, "deployer JW address")          // EQBko2AxduHfkugtASrwt8PpgrRF219f5bfF7KSnvyqM-r_B         log(await token.getGetWalletAddress(deployer.address), "Deployer JW from master")         // EQAL5bi5NXRHq3HRBZkSFun8kWPHT9J7OE3LNebt8WgWefzi         log(token.address, "Token Address")         // EQDy5DDBz9DtUT7m93oBE-NJN9WAwz_0JDVrQhGaUaDhtXRb         await deployerJW.send(             deployer.getSender(),             {                 value: toNano(10)             },             {                 $$type: "Deploy",                 queryId: 1n             }         )         log(await deployerJW.getGetWalletData())          // my custom contract has the same type of JettonWallet and I wanna manage jettons.         // I don`t know why, but it too calculated another fun jetton_wallet_address(): Address {         // let init: StateInit = initOf TokenWallet(myAddress(), self.jetton_master);         // let wallet_address: Address = contractAddress(init);

Vacuous: hi. maybe you have problems with imports (reply to 25737)

Blockchain Dev: What does it mean? "VM terminated with exit code 61530"

Creator: Does anyone know if I can use some standard jetton master/jetton wallet library in tact?(and then in tests( so as not to rewrite your own. I actually don't care about the implementation, as long as at least I want my custom contract to have its own token and be able to manage it.

Vacuous: https://github.com/ton-blockchain/token-contract/  https://github.com/ton-core/tact/tree/main/stdlib/libs/jetton (reply to 25748)

Jay: For jetton tokens use receive(msg: TokenNotification) (reply to 25730)

Jay: Try search github howardpen9/jetton-implementation-in-tact (reply to 25748)

Wendy: Thank you (reply to 25755)

Wendy: Can I customise the message? (reply to 25755)

Jay: Yes you can. Try draw some references from this use case quite handy... Search github howardpen9/nft-template-in-tact (reply to 25758)

Winder: can i send a message contains array?

Elon: hi what is the best way to interact with ton contract from react? ton core?

VoyTech: gm

Jay: Yeahh ton core npmjs (reply to 25767)

Vladimir: Hey guys! How to send Jetton via send(SendParameters()) on Tact?

Aleksandr: https://github.com/howardpen9/jetton-implementation-in-tact/blob/9eee917877a92af218002874a9f2bd3f9c619229/sources/messages.tact#L16 (reply to 25813)

Vladimir: receive("send") {         send(SendParameters{             to: address("EQD_kMQkK-A9-CQu3CdOnQUDZ2_8bY8Zrh1PvtE3hZpxvdRH"), // USDT contract             bounce: true,             value: 0,             mode: SendRemainingBalance + SendIgnoreErrors,             body: TokenTransfer{                 query_id: 1,                 amount: ton("0.0001"), // USDT amount to send                 sender: myAddress(),                 response_destination: self.deployer, // send USDT here                 forward_ton_amount: ton("0.01")             }.toCell()         });     }

Vladimir: should this work?

Nerses: GM!   While testing my smart contract I get such issue.The transaction fails as I needed with specified exit code,but this check contradicts it     expect(launchResult.transactions).toHaveTransaction({         from: launcher.address,         to: hashedTimeLockTON.address,         success: true,     });

Guro: Hello guys, is there any way to define Tact message with field represented as  forward_payload:(Either Cell ^Cell) TL-B notation?

Aleksandr: But wait, looks like 3-rd parameter is actually a payment destination address. Better to look into jetton standard. (reply to 25827)

⁭: hello guys, any newbies guide?  I've checked pinned messages, not really found anything

Vladimir: huh yes apparently "sender" has to be a receiver. thanks! (reply to 25838)

Guro: Hi, you may start from here https://tact-by-example.org/00-hello-world (reply to 25839)

Ken: forward_payload: Cell? (reply to 25837)

Guro: As I see it would be (Maybe ^Cell), but I need ether Cell or ref Cell Am I wrong? (reply to 25857)

Ken: Right, I think (Either Cell ^Cell) is just Slice as remaining then

Ken: semantically they're different, because ^Cell is just one ref, and Slice as remaining has multiple refs

Ken: but in practice it works (at least for Jetton forward_payload)

Guro: ok, thank you, so Slice as remaining should work? And do manual parsing afterwards? (reply to 25870)

Ken: yup

— 2024-05-16 —

Manh Tran: how can I calculate extract forward_ton_amount param? (reply to 25826)

Wendy: but receive() will trigger only when ton is received right? (reply to 25755)

Wendy: I want to trigger receive() when receive Jetton token

Jay: You can use this Jetton Notify at the receive(msg: TokenNotification). Please note the OpCode 0x7362d09c it must be passed in so that it can recognize the operation (reply to 25897)

Wendy: What if I want to customise the message? (reply to 25899)

Jay: Yes you can put in at forward_payload (reply to 25900)

Wendy: Thank you

Jay: Happy to help

Wendy: hi, do you know what does 0xf8a7ea5 mean? each of them are different?  message(xxxxxxxx){} (reply to 25903)

Wendy: can I write a random string here for my customized message? such as 0x1234567

Truong: hii, can i remove "as remaining" in forward_payload?

Wendy: how do I generate them? (reply to 25905)

Wendy: do you know the id in the message()? How can I calculate them? (reply to 25910)

Truong: You search opcode, it hash by Crc

Wendy: only jetton token need them? (reply to 25913)

Wendy: does that mean, they hash all the message content into 0x7362d09c? (reply to 25913)

Truong: It opcode of message

Wendy: is there an online converter so I can have a try?

Wendy: but the value is wrong, there the value is be6b1998, not 0x7362d09c

Wendy: https://emn178.github.io/online-tools/crc32.html?input_type=utf-8&input=TokenNotification%20%7Bquery_id%3A%20Int%20as%20uint64%3Bamount%3A%20Int%20as%20coins%3Bfrom%3A%20Address%3Bforward_payload%3A%20Slice%20as%20remaining%3B%7D&output_type=hex

Nelt: You could assign message's opcode, default value is from crc

Jay: This is OpCode ya the contract recognize this operation when receiving message. (reply to 25905)

Jay: Yes you can. Example I have 3 custom messages with 0x111 0x112 0x113 (reply to 25906)

Jay: Can check github TEP74 Jetton Standard (reply to 25919)

Wendy: thank you

Jay: No problem

AA: Looking for a bot that extracts data from blockchain  transaction address comment transfer amount

wesson 🆙 UXUY: when i deploy the contract,show some error message. how i can deal with it?

Jay: You're using prepareTactDeployment ? (reply to 25947)

Mihail: hello! how i can get this event in tests. example

Mihail: on event logs i see only one event

Nerses: Hi everyone !

Nerses: How can I check that transaction is ended up with certain exit code(in tests using blueprint)  ?

wesson 🆙 UXUY: yes (reply to 25956)

User<6855931209>: I am looking for a developer position

Эльдар: any working dex in testnet? dedust or stonfi?

Valera: Did someone write nft fix-price-sale-v3 contract for getgems in tact?

Valera: Very need help with this (reply to 25992)

Valera: I need mint big collection but paste price for every nft with ur hands it’s impossible   Maybe someone tell me the solution on tact?

Kirill: 11

Creator: Hi everyone.  Help please. Cant move on. Can give a few TON reward for helping.   Intro: 1) I created a custom contract something like JobOffer. It should has own JettonWallet and manage jettons based on its state.  2) I created test environment but could not test because of here is dificulty for JettonWallet addresses, JettonWallets states and so on..II think I'm blind and I'm missing something important or making a base mistake   blockchain = await Blockchain.create();         platform = await blockchain.treasury("platform")         deployer = await blockchain.treasury("deployer");         token = blockchain.openContract(await TokenMaster.fromInit(deployer.address, content));         // deploy contract         let res = await token.send(                 deployer.getSender(),                 {                     value: deployAmount,                 },                 "Mint: 100"             )         log(res.events) // jetton wallet created EQAL5bi5NXRHq3HRBZkSFun8kWPHT9J7OE3LNebt8WgWefzi         deployerJW = blockchain.openContract(             await TokenWallet.fromInit(deployer.address, token.address)          )         log(deployerJW.address, "deployer JW address") // EQBko2AxduHfkugtASrwt8PpgrRF219f5bfF7KSnvyqM-r_B         log(await token.getGetWalletAddress(deployer.address), "Deployer JW from master") // EQAL5bi5NXRHq3HRBZkSFun8kWPHT9J7OE3LNebt8WgWefzi         jobOffer = blockchain.openContract(await JobOffer.fromInit(title, description, price, order, token.address))         log(jobOffer.address) // EQDC4xYNKjAChYMo_Kt7WVD7Qx2AwUYiuEs5wBoLQmQZ-caj         await jobOffer.send(             deployer.getSender(),             {                 value: toNano(19)             },             {                 $$type: "Deploy",                 queryId: 1n             }         )         log(await jobOffer.getJobData())         // here is field my_jetton_address: EQDA3JZpNi6juYnNKNrF4GfrW9C_f_WI0gkQuoCy42jLv8dh         // calculated by Tact contract         // fun jetton_wallet_address(): Address {         // let init: StateInit = initOf TokenWallet(myAddress(), self.jetton_master);         // let wallet_address: Address = contractAddress(init);         // return wallet_address;     // }         log(await token.getGetWalletAddress(jobOffer.address))         // EQBeoUvcjxLgY99xKaV2VcPiYmEUTNSKT69IfpVgM6KfK2lN   Please help get the ball rolling and I'm sure you will get a big karma boost ❤️

Tarikh: Hi everyone, i know the TON smart contract is async, but is possible to check the jetton balance in a smart contract? i'd like to make user pay jetton when calling the smart contract function

— 2024-05-17 —

Jay: Try use tonapi for deployment, it can be .env way initializing your wallet (reply to 25970)

Jay: What's inside getGetWalletAddress method? (reply to 26012)

Dmitry | backend4you.ton: Not possible. User should pay first, with custom forward-payload in his tx, and you’ll execute required action upon receiving transfer-notification (reply to 26019)

Creator: Wrapper:  async getGetWalletAddress(provider: ContractProvider, owner_address: Address) {         let builder = new TupleBuilder();         builder.writeAddress(owner_address);         let source = (await provider.get('get_wallet_address', builder.build())).stack;         let result = source.readAddress();         return result;     }  Token master tact  get fun get_wallet_address(owner_address: Address): Address {         let init: StateInit = initOf TokenWallet(owner_address, myAddress());         return contractAddress(init);     } }  TokenWallet init  contract TokenWallet with Deployable {     balance: Int as coins = 0;     owner: Address;     master: Address;      init(owner: Address, master: Address) {         self.owner = owner;         self.master = master;     } (reply to 26027)

Jay: You want to check a specific Jettons balance inside your contract, is that what you're looking for? (reply to 26037)

Creator: Yes. I would like but as I know I can’t get balance of JW (reply to 26040)

Creator: Because of this I decided only “manage” (reply to 26040)

Tarikh: how can i receive the success notification after transfer completed? should i send message manually to my contract? (reply to 26036)

Jay: Can check github TEP74 Jetton Standard, upon user transfer completed it'll automatically receive a TokenNotification with opcode 7362d09c then you can use receive function to perform your next flow (reply to 26043)

Tarikh: is it possible if i sent the notification to different smart contract? lets say i created a smart contract for handling minting the NFTs. (reply to 26045)

Jay: You can capture the TokenNotification first, then use send function to send to your different smart contract. (reply to 26047)

Dmitry | backend4you.ton: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md answers here (reply to 26047)

Tarikh: thank you!, do you think we can change the response_destination into non wallet smart contract? lets say i need to sent a message to NFT Contract (reply to 26050)

Tarikh: thanks, will try (reply to 26048)

Dmitry | backend4you.ton: you may put any address there. but pay attention to "and the rest of the incoming toncoins" - usually NFTs have no way to withdraw TOn from their balance (reply to 26051)

Tarikh: thats make sense thank you (reply to 26053)

Tarikh: for the context i'll create the NFT Minting with jetton coin. is there any example of implementation? (reply to 26053)

Jay: You can try search github howardpen9/nft-template-in-tact (reply to 26055)

Manh Tran: If I use TokenNotification to listen token transfer event to contract. It mean I can’t listen two jetton transfer to contract parallel? Ex I want to add LP two jettons

Dmitry | backend4you.ton: you can. use source address to understand which jetton arrived (reply to 26070)

VoyTech: Any hints for testing / debugging? I'm doing a simple test which deploys my contract, and the deployment message fails & bounces, no idea how to find out what is the issue though?

Sumit: is there no way to have completely seprate collection data and individual nft data on ton?

Nerses: Hi everyone. Who can help to do method call to deployed smart contract ?

Эльдар: so many questions and so few answers, sad

Амир: Check logs, exit codes, use ~dump (reply to 26073)

Dmitry | backend4you.ton: https://docs.ton.org/develop/smart-contracts/guidelines/get-methods ? (reply to 26089)

Dmitry | backend4you.ton: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md check TEP-64 standard (reply to 26080)

Sumit: but all these generally mean that  collection will store base url (reply to 26100)

Sumit: And a suffix for each nft can be added in form of token id and some constant string

Dmitry | backend4you.ton: Each NFT Item and NFT Collection itself has its own metadata  If you store metadata with single base uri and different "endings" - its only your choice (reply to 26101)

Nerses: unfortunately no.here is spoken only about get methods while I need to do simple internal call(send message) to deployed smart contract (reply to 26099)

Dmitry | backend4you.ton: "Invoking get methods from other contracts" is a section there (reply to 26104)

Dmitry | backend4you.ton: you asked " to do method call" - its about get-methods. if you want "send message" - look into sending messages

Sumit: Nope. That has to be mandatory (reply to 26103)

Dmitry | backend4you.ton: can you quote plz ? (reply to 26107)

Sumit: See, its always the collection content that is sent in the initOf the contract (reply to 26108)

Sumit: if you provide unique cells. Then the contracts addresses wont be predictable

Nerses: in my case the function which I want to call isnt get method.it is function to do transaction.Maybe i described the question in wrong way (reply to 26105)

Dmitry | backend4you.ton: collection content does not means "item content" (reply to 26110)

Sumit: but collection content has the base uri and item content is something like “10/meta.json” or something (reply to 26113)

Dmitry | backend4you.ton: contracts can interact inly by sending messages.  look into "internal msg" (reply to 26112)

Dmitry | backend4you.ton: why you think its "mandatory" ? (reply to 26114)

Dmitry | backend4you.ton: try to describe in more detail what do you want to achieve

Sumit: Is this not enough case? (reply to 26114)

Sumit: I want each NFT to have a full uri content of its own

Sumit: “Mint” method does not take uri as an argument

Sumit: So how can an nft has its own data.

Dmitry | backend4you.ton: this is not mandatory (reply to 26119)

Dmitry | backend4you.ton: if you want each nft has its own uri - do it. you just need to "deliver" this uri somehow to it

Dmitry | backend4you.ton: (and, its not mandatory to have this uri at all, all metadata can be onchain)

Sumit: there would be one downside in that case, the contract will not be able to tell me the address of the NFT item if i dont have the its “individual content” cell (reply to 26125)

Dmitry | backend4you.ton: also, make sure you found that collection is optional (nft may be collection-less), as https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md says

Dmitry | backend4you.ton: it would, if you make "individual content" initially empty (reply to 26127)

— 2024-05-18 —

Nelt: I'm testing this function in my contract and found out that 2 of 10 times when TokenTransferInternal receive it didn't send TokenNotification message. Plz help

ed: how are you going to find the jobOffer from FE when it consists of so many variables? it is like calling getJobOffer but supplying all the relevant info to actually get the info. (reply to 26012)

&rey: Well, SendIgnoreErrors is responsible for that silent failure, it's not a random bug or whatever. (reply to 26195)

&rey: How much TON are you sending out with that message?

Nelt: It's 0.15, the ton forward is 0.025

&rey: Then count all TON your send parameters send out. (reply to 26208)

Nelt: https://testnet.tonviewer.com/kQAaynYax_AiMf7MQle8Y5FgroV99ud3jUm7rVSLrR5tXmYJ/jetton/kQA3PBz81_OL_L9SHB6wJLuobVHy5-B6CuW5ooHSZqff_upE  I think i send excess TON to this function. In list transaction, the latest one is seem not correct somehow, and the second is my happy case (burn token)

&rey: let v = context().value; let f = context().readForwardFee(); let w = ton("0.1"); send(SendParameters {     value: w,     mode: SendPayGasSeparately + SendRemainingValue,     ... }); How much TON does contract send? How much destination address receives? (reply to 26208)

Nelt: actually i just want to transfer ton remaining to destination. but somehow it not working (sometimes)

Enoch: Hi

Enoch: I need help with my swap function on contract.  Tokens are sent out from the contract

getteppo: looking for a dApp developer hmu asap

Sumit: is there no way to call loadStringRefTail inside a contract?

ecomnazar: hi, how can i handle ton transaction status succees or not in my twa

Эльдар: I want to implement some logic only for DEX swap (dedust, stonfi), anyone can guide me in the right direction where I should dig?

— 2024-05-19 —

ch4rter: I am looking for a decentralized application developer on a permanent basis. Please contact me. The project promises to be interesting, not a scam, not a memcoin, not tap tap tap

getteppo: looking for a miniapp developer hmu asap

Sumit: can i parse a struct/message from a cell?

Enoch: pls i need help with my tact contract

⁭: how much you pay for deployment? for nft contract for example or more sophisticated things, how much fees to expect? I know that it depends on length, but average?

Sonny: I just want the user to stake the correct Jetton Token, but when the user stakes in, the contract fails and the contract is not recorded.

A: You can use dedust SDK - https://docs.dedust.io/docs/getting-started - I think stonfi has the same one

User<6578700114>: how to integrate smart contract and front-end on TON?

A: Just use ton connect: https://github.com/ton-connect (reply to 26381)

A: Yes, look here: https://docs.tact-lang.org/language/ref/cells (reply to 26339)

Sumit: It cant parse a struct/message (reply to 26388)

Sumit: Just individual values, that too strings arent possible

A: Mmm, but messages and strict are just abstraction only in tact. You can pack it with .toCell(), and unpack just creating. Look: https://tact-by-example.org/03-messages-between-contracts (reply to 26389)

Sumit: I want to send strings in forward_payload of a jetton, and parse/decode them from the cell inside the contract. (reply to 26392)

Игорь: Hello guys! I have already minted jetton by ton minter. And I need to receive and send this jetton by another contract.

Игорь: Does anyone have a ready-made solution for this?

Aydin: Maybe you can try asking questions here:  https://t.me/dedust_dev (reply to 26298)

gfhfyibr: Hi guys, I have a question, can I catch an error from a child contract (which I call via send) and fail the whole transaction call in wallet.

— 2024-05-20 —

&rey: Those transactions are separate, so first has already succeeded by the time you process something in subcontract. (reply to 26432)

&rey: You will have to change architecture.

Davis: Hi guys, How do I fix the error 'timeout of 5000ms exceeded' when deploying?

Johnny Le: testnet server not stable atm (reply to 26467)

Davis: I tried using the mainnet but still got the error. (reply to 26468)

Davis: Do I need to add any config to avoid this error?

Johnny Le: yes its the API (reply to 26469)

Aleksandr: await provider.waitForDeploy(address, 300); 300 seconds timeout (reply to 26467)

Davis: thank (reply to 26472)

Mihail: hello. anybody know when tact contacts will be support upgrades?

Davis: const OFFCHAIN_CONTENT_PREFIX = 0x01; const string_first = "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json"; // Change to the content URL you prepared let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

Davis: Hi, Why do I get an error when using this content? I can't display metadata collection

Davis: Metadata

Quang: Can we send a nativeMessage to trigger Bounce?

Tom - Bushi: hey all, new to tact. Taking a look at the random number generating fun randomInt(). I am wondering if under the hood it uses the randomize_lt() found in funC or if its less safe than the funC alternatives? Any tips on randomness in general?

Pavlo Voronyuk: Hi there ! Maybe here someone who prepared to create few contracts on Tact ? How it cost ?

Vitor: One option is to run tact with —func argument and check the generated FunC code. (reply to 26496)

A: Just some more notes:  randomInt (from tact) - generates random number randomize_lt (from func) - set random seed for random generator with current logical time (equivalent to randomize(cur_lt()))  Basically, nativeRandomizeLt (from tact) is equivalent to randomize_lt (from func) randomInt (from tact) is equivalent to random (from func)  and under the hood it uses native func functions:  https://github.com/tact-lang/tact/blob/e080f7f180da318363584530b6801b3e7bb4d11e/stdlib/std/math.tact#L20 (reply to 26496)

Andrew: Hey, everyone, do we have a Jettoken standart like it was in archived repo of Tact?

Andrew: Can't send a link for some reason

Bear: is there the limitation for a slice size?  msg.symbol.asSlice().bits() <= 128

Bear: for example, do I have to set the symbol size in slice have to be less 128 bits? (reply to 26526)

Tom - Bushi: thanks for the answers guys, Im sure Ill be back with more.  In the meantime, can you guys suggest any good tools for tact, or perhaps a repo with all basic dependencies and good project structure I could take a look at?

Bear: I am dealing with symbol in Jetton, can it be:         require(msg.symbol.asSlice().bits() <= 1023, "symbol too long");                   let symbol_length: Int = msg.symbol.asSlice().bits() / 8;         require(symbol_length >= 2, "symbol too short, at least 2 chars");         dump(symbol_length);   ? (reply to 26536)

Bear: I thin 1 char is 8 bits?

Andrew: Hey, is there any way to get information about the transaction(like the TON amount spent) given the transaction id?

Bear: ohhh Jetton symbol in TON capable with emoji? hahaha (reply to 26541)

Павел: Hi there! Does basic Tact configuration is workable? I try to deploy initial counter contract to testnet, but it shows me error: «Unable to subscribe to notifications: Request failed with status code 400» and if I try to switch off notifications, it is never been finished…

Narek: Hey everyone, how do you debug tact code locally?

Павел: I don’t know, what will help, but I will change queryId and seems it will deployed such way… Or, other (reply to 26545)

Andy: Is  receive(msg:Add) { self.add(msg.amount); }  legal syntax or should it be receive(msg: Add) { self.add(msg.amount); } with the space in between the type and the parameter name?

A: Try https://tonscan.org/ (reply to 26543)

A: Both are correct - use what you like 😁 (reply to 26560)

Andrew: thank you! However, I am talking about getting information about transaction inside smart contact. As I can see, there is no way to do it, only by a be/fe service and api calls (reply to 26561)

Andrew: When you provide transaction hash and get info about this transaction inside smart contract

A: Oh, you are correct - it is impossible for external transactons inside contract runtime (reply to 26563)

Andrew: Thank you for your help!

Andy: snipboard dot io/ueKjkC.jpg  'coz the Tact syntax highlighter doesn't colorize the version without the space in between the colon and type... (reply to 26562)

— 2024-05-21 —

Johnny Le: anyone able to use merkle tree in tact yet

Fardin: I'm looking for this either (reply to 26617)

Fardin: The lack of Merkel tree and ecrecover is making development and progress difficult for us

Johnny Le: Only saw in func (reply to 26648)

Johnny Le: tact no example yet hm

Creator: Hi everyone.  This is a question, maybe you know the reason for this awkward situation.  Im trying to create contract, which  must manage jettons on JettonDefaultWallet. I use the default JettonDefaultWallet and JettonMaster.  But in the contract it gives a different result than when I ask JettonMastera for the JettonVolet address at the my contract address. I thought this was in a test environment. But it’s the same on the testnet. And everything seems to be according  to the manual.   let init: StateInit = initOf JettonDefaultWallet(myAddress(), self.jetton_master);         let wallet_address: Address = contractAddress(init);   Func:   ((slice, slice, slice, int, slice, slice, (int, int), int, int, slice), ()) $JobOffer$_fun_send_deposit((slice, slice, slice, int, slice, slice, (int, int), int, int, slice) $self, slice $address, int $amount) impure inline_ref {     var (($self'order, $self'title, $self'description, $self'price, $self'owner, $self'doer, ($self'job_state'doer, $self'job_state'owner), $self'state, $self'is_locked, $self'jetton_master)) = $self;     var ($ctx'bounced, $ctx'sender, $ctx'value, $ctx'raw) = __tact_context_get();     var ($init'code, $init'data) = $JettonDefaultWallet$_init_child(__tact_context_sys, my_address(), $self'jetton_master);     slice $to = $global_contractAddress(($init'code, $init'data));     $global_send($SendParameters$_constructor_to_value_mode_body_data_code($to, 0, (64 | 2), $TokenTransfer$_store_cell($TokenTransfer$_constructor_query_id_amount_sender_response_destination_custom_payload_forward_ton_amount_forward_payload(0, $amount, my_address(), $address, end_cell(begin_cell()), 100000000, $Cell$_fun_asSlice(end_cell(begin_cell())))), $init'data, $init'code));     return (($self'order, $self'title, $self'description, $self'price, $self'owner, $self'doer, ($self'job_state'doer, $self'job_state'owner), $self'state, $self'is_locked, $self'jetton_master), ()); }    And it turns out that the only way out is to transfer the init + data code for the flight token manually after deployment. But this is kind of an ugly solution. Perhaps you know what the problem is in the story now.   Thank you

Nerses: hi everyone. how can I do internal transactions already deployed smart contract (testnet)  ?

A: Hello, my friend,   Did you mean: do internal transactions TO already deployed smart contract or do internal transactions FROM already deployed smart contract ? (reply to 26676)

Nerses: I meant to. I need to interact with deployed smart contract (reply to 26683)

A: you can do it with any libs implemnted communication with TON blockchain via provider, good example of how to do it with js - http://tonhelloworld.com/03-client/ on frontend (reply to 26684)

Nerses: i checked the link .It really seems solution but isnt there more optimal way without creating app for interaction ? (reply to 26686)

A: yep, any of SDK you wish 🙂 - https://docs.ton.org/develop/dapps/apis/sdk

Nerses: thanks.really helpful (reply to 26688)

Diego: Hi everyone, I’m working on a project called Tonp.io and I’m starting the beta testing phase and I would like to have some honest feedback about the service so If any of you have a .ton domain connected to a website and would like to access it from web 2 common browsers without any additional configuration, please feel free to contact me to give you access to https://tonp.io thanks in advance

global35: 🤚

User<976668536>: hello everyone

Nerses: can smart contract(not wallet contract) send some amount of money when "special" message it gets ? I meant can i implement using send(SendParameters{         // bounce is set to true by default         to:          value:          mode:          body:      });

We: We have been developing the  decentralized launchpad platform on Ton blockchain. There is currently a testnet version for presale. Please test and give us your comments to help us improve the product.  testnet .wesale .finance

Pavlo Voronyuk: Anyone 👀🫣 (reply to 26504)

Sumit: is this the way to get the current tx’s hash context().raw.hash().toString()?

Sumit: what could be the reason for this error: lvalue expected before `~load_int `?

Dmitry | backend4you.ton: difference between ~load_int and .load_int (reply to 26755)

A: Yes, good example: https://tact-by-example.org/03-messages-between-contracts (reply to 26718)

— 2024-05-22 —

Vlad: I wonder if there is a difference when I use  “+” or “|” between message modes?

Dmitry | backend4you.ton: no, unless you use it wrong (reply to 26790)

Vlad: Here in the examples it says "bitwise or" should be applied  https://docs.tact-lang.org/book/message-mode  "+" operation is not always equal to it

Vlad: Hm, but considering the fact that modes are 2^sth (so all use different bits) there shouldn't be a problem

Anton: Bitwise Or is idempotent, so it’s safer to use it: 16 | 16 is still 16, but 16 + 16 is 32, so if you accidentally use the same flag twice, you are still fine (kind of). Actually, we can and should catch mistakes like this one statistically (reply to 26793)

Vlad: Well, it will give me a different message mode (32). So maybe not very safe) (reply to 26796)

MAHI: 👋

Nerses: Hi everyone ! How can I see emitted log of the smart contract after internal message ?

Sumit: How can i get the nft_item address from a nft_collection and tokenid inside a contract?

Vitor: Use an indexer, either host ton-indexer yourself or use one of the APIs such as toncenter. (reply to 26836)

Nerses: because of this getter function I get exit code 11  get fun getHTLCDetails(hashlock: Int): HTLC? {         return self.contracts.get(hashlock);     }  Cant understand what is the problem with it

Lev: How can I calculate the address of Func contracts in Tact? E.g. a Func jettonwallet

Enoch: What do want to achieve ? (reply to 26868)

Lev: Deploy a ston.fi pool, as one of the cases (reply to 26871)

Lev: I guess a low-level way would be to load the code as a constant and manually get the address, but maybe there's a better way

Sumit: https://github.com/ton-foundation/specs/blob/main/specs/wtf-0004.md is there something similar for NFTs?

Enoch: Have you tried state init (reply to 26868)

Lev: Wdym? (reply to 26886)

Nerses: I used TON indexer from TONCenter and get this data from transaction {   "messages": [     {       "hash": "JQuq8Gr01+p9B0rBke3GIk3zD7hMKqhVPhv5GbMxpms=",       "source": "0:90F50B1734B015F5AFB679FFFE7988A597B45A3C4F0172D8FDEEE2FB94265EFD",       "destination": "0:327F9B538BA5C09FCC9C4FF443AFF3EFB97FD36BC180B74F4FEAB9E3BA14AA33",       "value": "100000000",       "fwd_fee": "507471",       "ihr_fee": "0",       "created_lt": "21911980000002",       "created_at": "1716385739",       "opcode": "0x22e6bcc1",       "ihr_disabled": true,       "bounce": true,       "bounced": false,       "import_fee": null,       "message_content": {         "hash": "NgcfHiE/NYWIn6FOycCqHCTHA7VVZkqHnE26eWdnXvk=",         "body": "te6cckEBAQEAZwAAySLmvMEIzAzX83wOx+7PoHXR2Nap8TAHuSK/13QheL2bVyiP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE7+vyQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL68IAQBm1Pdg==",         "decoded": null       },       "init_state": null     }   ] }   how can I convert for example message_content.body to human readable text ?

Dmitry | backend4you.ton: https://github.com/ton-blockchain/TEPs ? (reply to 26874)

Sumit: No, i meant an interface for an NFT. (reply to 26903)

Sumit: https://github.com/tact-lang/tact/blob/main/stdlib/libs/ownable.tact#L11C13-L11C28

Sumit: this thing

Dmitry | backend4you.ton: oh, ok, sorry. first link had too few content to understand it meaning.

Arseniy: can special contract that is not a jetton wallet change jetton master’s supply? in my case burn

Dmitry | backend4you.ton: in reference jetton code - no. in custom - up to you (reply to 26909)

Arseniy: thank you, Dmitry 🤝 (reply to 26910)

Creator: Hi all.   I have a question, maybe someone knows the answer or at least where to dig. I'm using the contract to manage Jettons on his own wallet. In the contract code I get its address:   let init: StateInit = initOf TokenWallet(myAddress(), self.jetton_master);   But of course I want to use the code of some popular tokens, like USDT. How can I put code here when compiling a contract, for example this wallet https://tonviewer.com/EQDmVdCZ2SALvyfCDVlPLr0hoPhUxgjNFtTAxemz9V_C5wbN?section=code  Thanks everyone!

cypherpunksO1: Good afternoon. Is it possible to send a TON from the Jetton Master (minter.ton.org) contract back? The rights have not been revoked yet

Cesar: Hey guys, when trying to add a "bounced" function:       bounced(msg: bounced<A>){        let x: Int = msg.a;     }  I get the error:  Type bounced<"A"> does not have a field named "a"  How do I fix this? I'm running on compiler v1.3.0 with the blueprint SDK

Aλex: Hello everyone, cannot figure out whether I can reassign struct variables without recreating the struct entirely.  Of cource structs are immutable, but maybe there is some syntactic sugar for such cases

Ken: bounced<A> only has 224 bits (reply to 26941)

Alex 🥤: hi guys why they diferent

Alex 🥤: address from initState in contract not the same with address from initState in ts code

Alex 🥤: all contract are builded

Alex 🥤: pls help i dont understand why this dont work

Creator: Check imports. It should be from one build direction. (reply to 26967)

Alex 🥤: love u so much man TNX 💕 (reply to 26977)

Creator: Welcome) I wasted 1 week for seeking answer) (reply to 26980)

Alex 🥤: nah, it should be automatically (reply to 26982)

gf: Thanks :) (reply to 26982)

— 2024-05-23 —

Howard: 🐶 (reply to 26981)

Aλex: Am I doing this right?

D: Hi, help please with scam nft how i can transfer ton from balance nft to me?  https://tonviewer.com/EQCiJT6YbUsVpaZnPPISWSK0acPwFZmO2BxlRzZfikubIK3M?section=code

Nerses: Hi evryone! How can I see emitted logs of smart contract ? I need the most optimal solution

VoyTech: I'm getting this info on my message, any idea why it could be skipped?     { '$type': 'skipped', reason: 'no-state' }

VoyTech: And what does this reason mean?

Creator: Need to send init code and init data with message (reply to 27059)

VoyTech: Ok. That contract is already initialised by a previous message. But maybe the simulator doesn’t handle that? (reply to 27065)

Its3L: If anyone here wants to get involved in a perp and cover the development, we have quite a good base and 2 upcoming CEX pre agreement listings

Its3L: Thanks so much happy to chat further via DM

— 2024-05-24 —

Cesar: Hey guys, how do I get the StateInit of a contract that I don't have in tact? and can i send a deployment transaction with just the "code" and the init? (but idk how to get the init)

Hanniba1111: Hi guys，is there the template or sample of daily checkin contract?

Manh Tran: Hi guys, how to calculate gas of function execution to invoke this function?

Tom - Bushi: Hey guys, coming from a solidity background Im wondering what is the benefit of having many small contracts which send messages to each other, which seems to be the suggested way of developing on TON, above having one larger contract like in EVM? Why is this type of contract splitting beneficial?

Vitor: Basically re the differences in the storage cost model from the TVM to the EVM. (reply to 27146)

Aleksandr: Scaling. The problem with EVM model is the atomic transaction nature. You either do everything in single transaction, or you cannot do it at all. It is somewhat like having one enourmous database with everything on single machine vs splitting that database into shards. System complexity in TON model is definitely higher, but it is scalable. (reply to 27146)

Vitor: There's a decent write up called "Actor model in Everscale", which is another chain with roots on the TVM.

Vitor: (Re the improvements as it relates to scaling)

Vitor: Kinda wish there was more material explaining trade offs on the TVM design. Kinda tried to do it, but I'm such a terrible writer :D

Tom - Bushi: cool guys, thanks for the answers. Now I know what to research more 👍

Alexandr: We wake cool video about blockchain,donate for future moves welcome :)

Mahima Thacker: Hello everyone,  I want to write a contract to Mint an NFT. In ethereum, we have been using ERC721 standard, from openzeppelin's contract but I am wondering what could be done here? Is there any way to create NFT Minting contract using Tact? Could you share the tutorial to implement it? Or is it only possible using FunC?  Your help would be greatly appreciated :)  Thank You!

Alex 🥤: Hi guys, random work in testnet? When i call contract function with random inside, wallet show me who gonna win instand and its work

Alex 🥤: why?

Vladimir: Anyone has an example of how to attach token payment to smart contract invocation in JS?

Aλex: Can I create a copy of struct?

Vitor: It is possible, you can lookinto howardpen GitHub for the NFT. Frankly, I wouldn' t roll my own contract and I'd just use the getgems standard NFT contravts. My 2c. (reply to 27171)

ABRAHAM: Hi, how to deploy contract without auto verifying the source code?

ABRAHAM: can I turn off this function by option in config file?

Мурс: 12 (reply to 27197)

Мурс: Hi everyone!

Мурс: Just dived into TON development, deployed my NFT-collection contract On explorer it says "uninitialized", is that okay?  Also, what's the simplest way to send "Mint" message?

Benedict: Hi everyone, we have opened a new in meta universe p2e project for which we are looking for people to join our team to work on the project.  Beta tester - from 55$ per hour  NFT Artist - personally negotiable Game Designer - from $4000/month Moderator - from 600 bucks (week) Developer - to be discussed personally (depending on qualifications)  Payment in BTC, ETH, USDT (weekly). We are waiting for you in a developing and promising team! Write to DM.

fa: guys, can anyone tell me how I can connect my Python backend using a smart contract, I need people to be able to top up the balance on the site with tones and withdraw the same

Mookid: I'm looking for someone who can help me complete a script that will place existing NFTs on Getgems all at once for one price  https://docs.ton.org/develop/dapps/ton-connect/message-builders  Ready to pay extra for urgency

Mookid: That is, there are 600 nft already minted, and I just need to list them at the same price

SeiOkami: Done

— 2024-05-25 —

Mahima Thacker: But It's in FunC, right? (reply to 27186)

Vitor: Howard published NFTs in Tact. (reply to 27253)

Mahima Thacker: I meant getgems standards NFT! Is it in Tact or FunC?

Vitor: FunC. (reply to 27258)

Mahima Thacker: Oh Okay, Fine. Thank you (reply to 27259)

Disha | SMBmarket: Hey guys need your help!!  How we can store the metadata in Blockchain and receive?  Please provide reference as I tried many times.

Bc. Žak: Hey devs, can i use message in my constructor like:```init(msg: MintToken, owner: Address)```? compiler says: Field initialized is not set

Anton: could it be because your contract has an initialized field which is not actually set? (reply to 27289)

Bc. Žak: yeah, you right, i thought it means something with contructor, not my variable, tnx (reply to 27291)

Bc. Žak: is there a way to emit an address? im tring to: emit(myAddress().toCell()) nut address is not castable to cell. any solutions?

Bc. Žak: shoud i wrap it to message  struct and then emit the message?

Dan: Hi guys! I do not understand something. When calling the receive() in contract, how can I get the exact amount of tons that the user is sending to the contract? Is it equal to myBalance() or context().value?

Bc. Žak: Is there a way to parse emited log in test? i got the body but a belive it is a cell, i need to parse to get data from it. How shoud i proceed?

Vitor: @ton/core has a BitStream and a BitReader class that you can use for parsing binary data. (reply to 27305)

Мурс: Are you talking about emitted events? I am having a hard time figuring out how to subscribe to them. May you please share any code? (reply to 27305)

Bc. Žak: Yes (reply to 27307)

Bc. Žak: Have you found a way to parse let's say for example TransferToken message?

Dan: Thanks. Will try (reply to 27304)

Vitor: TonAPI from TON Console has a Streaming API that you can subscribe to events. (reply to 27307)

Мурс: Thanks for answer! Do they provide their services for testnet? (reply to 27312)

Nerses: yes they provide (reply to 27320)

Эльдар: can anyone answer, it is possible to get back tons from deployed nft_collection if owner wallet is mine?

Danil: No (reply to 27332)

Эльдар: so sad) (reply to 27339)

Danil: Это дп

Эльдар: не понял, что значит дп? (reply to 27341)

Danil: Это, да означает

Danil: А почему тестнет не использовал?

Dan: No way. It’s blockchain (reply to 27332)

Эльдар: да, на нем все ок было, просто скрипт для деплоя нфт криво написал и он вместо одно раза дохера раз отработал (reply to 27344)

ᅠ: Дайте бота для массовой отправки TON

Dan: А такой есть? (reply to 27349)

ᅠ: Был этот @tonmassend_bot (reply to 27350)

ᅠ: Но перестал работать, так и не попробовал его.

Dan: может контракт написать и в бота обернуть

Danil: Можно без бота, чисто консолью

Danil: Ну тут сам уже нагадил (reply to 27348)

ᅠ: Как ? (reply to 27354)

ᅠ: Например есть 1000 адресов или 100

ᅠ: На них надо TON разослать

Danil: Ну создай кнопку и добавь к ней send через смарт, импортируй что надо и поставь переменные для аккаунта и кол-ва

Danil: Если всегда одни и те же , просто вбей их в смарт

ᅠ: Есть инструкция как сделать это ?

Danil: Обычную send функцию создай, добавь мастер аккаунт и косвенные, напиши кол-во и задеплой

Vanëk: in 3d line mistake in peremennaya, i guess:  //init0f (reply to 26967)

ᅠ: Где изучить как писать смарт-контракты ? (reply to 27362)

Vanëk: можем разобраться в отдельном чате с примером (reply to 27361)

Danil: Docstob

Danil: Ton*

sd: /report (reply to 27368)

Mark: https://tact-by-example.org/all (reply to 27364)

Эльдар: еще вопрос, nft с медтаданными в ipfs, на getgems отобразилось сразу же в tonkeeper уже часов 5 прошло не отображается, что-то криво сделал или это норма?

Danil: Да

Эльдар: криво? (reply to 27390)

Игорь: Cointool (reply to 27358)

Danil: Да (reply to 27392)

Эльдар: печаль блин (reply to 27394)

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsAJpR7R0cC4kgo7BjiMmUy7 (reply to 27364)

— 2024-05-26 —

User<6327676316>: I want to know how to downgrade tack version because I can't verify contract written by tact on the verifier platform. please help me

Spetsnaz: Maybe you should use older versions of blueprint? (reply to 27423)

Мурс: hey guys, I am writing NFT contract how do I calculate these 4 bits for my new message Mint?  message Mint {     address: Address;               }   message(0x693d3950) GetRoyaltyParams {     query_id: Int as uint64;

d: Hi guys! How can I use initOf with 3rd party smart contracts? Is it possible to import them into my solution?

d: My task is to accept payments with 3rd party jettons like usdt or NOT, and verify sender of Transfer Notify message

Vanëk: are u sure index does not important (reply to 27434)

— 2024-05-27 —

Том🥷🏿🏴‍☠️: Hello everyone, can anyone tell me if there is a Python library that will help you find out the wallet address and balance through mnemonics, or generate a new wallet and save its mnemonic phrase?

Matt: hello everyone, when I receive "TokenNotification" message which include forward_payload, how can I decode the forward_payload(Slice) to the specify Message

Davis: Hey everyone, I will use the jetton wallet of the sender or the contract stake in the unstake function?

Rohit: Has anyone tried receiving external messages in Tact and successfully written tests for it?

Vitor: In the Tact code base, look at ./src/test/feature-try-catch.spec.ts or other feature tests for examples. (reply to 27531)

Vitor: pytoniq, look at pytoniq-core/crypto/keys.py. And remenber that TON has smart contract wallets, so, generate the PK. create a contract wallet with the pub key, and use the address of that. (reply to 27504)

Jay: let swap: Slice = msg.forward_payload;         require(swap.loadUint(256) == self.signing_key, "401 unauthorized key");   You can refer to this code example (reply to 27521)

Cesar: Hey guys, whats the best way to estimate a deployment cost in tact?

Matt: thanks, I already found the way in the Doc (reply to 27536)

Tom - Bushi: hey guys, I have a question about gas usage and error handling.   Say I got some complex logic with many contracts user -> contractA -> contractB -> C -> D and I get an error or lack of permission in contract D. I would like to roll back the changes made in the previous contracts, but as I understand it that would also take gas right? But from what I understand, if I run out of gas at some point, the logic just stops at the point where there was no more gas.   So potentially it could stop mid change reversal in contractB and leave the changes in contract A inTact (pun semi-intended).   How is stuff like this handled? Should the user just be sending enough gas to cover all potential routes of logic?

Ken: there's no established patterns to solve your question. I just require a TON of gas (pun also semi-intended) to cover all paths and refund any extra at the end. (reply to 27539)

Эльдар: Здравствуйте может кто-нибудь помочь разобраться, сминтил НФТ метаданные и изображение залиты на pinata cloud, пробовал и по протоколу ipfs:// и через http шлюз, все равно при просмотре контракта коллекции и самих НФТ в tonviewer, не отображаются картинки и описание... просто есть общая инфа owner, name и прочее, а картинок и остальных метаданных нет... (на getgems отображается отлично и то и другое) уже устал блин ковырять...? может кто-нибудь подсказать куда копнуть?

Mahima Thacker: Hello guys, I want to connect tact smart contract with the frontend so I believe I can use tonweb sdk, correct me if I am wrong here so could anyone please share the implemented example of how can we get the TON blockchain's data from the contract to the frontend ?

Max: В контракте NFT url метаданных частичный или полный? В коллекции указана общая часть url для её NFTs (нужно, если в NFT часть url)? (reply to 27545)

Max: Что в других сканнерах блокчейна --  tonscan.org, tonscan.com. Возможно индексер у tonviewer небыстрый. (reply to 27545)

Эльдар: благодарю за отклик, минтил через truecarry.github.io, отвечая на вопрос, в коллекции указывал корень ресурса, а в nft по черновику {index}.json как он по итогу упаковал -хз. В других https://ton.cx/ - ок, tonscan.org - никак, tonscan.com частично (метаданные коллекции -ок, а НФТ - нет ) (reply to 27550)

Max: А может дело в отсутствии слеша в конце collection base? (Первый скриншот). (reply to 27554)

Dan: Кто-нибудь знает как записывается в коммент к транзакции в BOC?      cell = Cell()          cell.bits.write_string('text')     boc = cell.to_boc()     base64_boc = base64.b64encode(boc).decode('utf-8')      return base64_boc вот такой  код возвращает base64, который не создаёт коммент. Может перед комментом нужно записать какой-то байт?

Daniil: 32 нулевых бита в начале нужны ещё (reply to 27558)

Daniil: а что это за SDK?

Dan: tonsdk для питона

Dan: сейчас попробую (reply to 27559)

Dan: Походу сработало. Спасибо (reply to 27559)

Nerses: I have created such field in my struct dstAddresses: map<Int,String>;  and get error Unsupported map value type String . Isnt it correct usage ? if not how to create array of strings in TACT ?

Tom - Bushi: do contracts which dont hold state variables but instead have for ex. utility functions require TON for rent?

Diego: Contracts have to pay for storage and computation (reply to 27573)

Tom - Bushi: but if its just a contract which has getters and constants that also has to have some TON for storage correct? (reply to 27584)

Diego: There is a minimum amount of ton required in balance to avoid being deleted (reply to 27588)

Arseniy: hi everyone how i can convert json data to the cell data type inside my deploy ts script?

Karim: Is it good implementation of jetton standard on Tact? https://github.com/howardpen9/jetton-implementation-in-tact  I want to found my project on it, but afraid of vulnerabilities. Maybe anyone know if there any big jettons built on top of it?

— 2024-05-28 —

Racie: We're thrilled to announce that Nimbus is now the #1 Utility app on the TON blockchain!  Nimbus empowers users with seamless TON asset tracking through its user-friendly design and robust features. We're seeking partnerships to:   - Integrate your DeFi project with Nimbus   - Launch joint on-chain co-marketing campaigns  Send us a DM and let's explore the possibilities together.

Disha | SMBmarket: 👋 Has anyone created a simple NFT minting smart contract using Tact, Func, or any SDK/library?

Lord.: Is there a way i can transfer jetton tokens from wallet to wallet using typescript?

Made by: Almost the same implementation you can find on https://tact-by-example.org/07-jetton-standard which is kinda supported by dev team (reply to 27607)

R G: guys can you please help me? i want to deploy my tact contract to testnet using blueprint but i dont understand example from github. is there another way to deploy it?

Fomean: Paste provider.sender().address!! into fromInit method in you deployPROJECTNAME.ts file  yarn start in terminal

Fomean: I am started now 2 hours, bud i am ts dev

Jay: Try use tonhubapi to deploy (reply to 27675)

R G: guys im finished. if someone will have problems with it you can ask me dm or here

R G: testnet.tonviewer.com/{contract_address}?section=code  do we have a way to force refresh code verification? i did it like 20 minutes ago on ton verifier org and still zero changes on tonviewer + tonscan

Korol: hey, is there any guide of how to interact with nfts in tact?

Мурс: there is (reply to 27720)

Korol: Can you share a link ☺️ (reply to 27721)

Мурс: https://tact-by-example.org/00-hello-world  Вроде тут где-то видел в примерах (reply to 27722)

R G: @tonsupport_aibot (reply to 27720)

Johan: Guys, please say which is the easiest way to get circulating supply of any token??

Johan: What should I have for that?

Johan: I have total supply

Igor: The telegram wallet simply blocked my funds without explanation and allowed me to withdraw them, demanded that I go through additional verification, I passed it, nothing has changed, support has not responded for more than a day. It's not clear what's wrong with my money. Friends, this is complete bullshit. How can you treat loyal users like this? I'm very disappointed.

Мурс: Can’t you just restore it on another account using your seed phrase? (reply to 27748)

Igor: I have not lost access to it, I sent money from it (USDT TRC20), the money did not go away and it is not in the account. The transaction history in the wallet is not displayed at all. (reply to 27751)

Igor: another transfer is also not credited to the wallet (reply to 27751)

Мурс: They said their wallet app is not custodial – e.g. they can’t block you, since they don’t have the keys.   What actually happened? You bought some USDT via credit card or transferred from TRC? (reply to 27752)

Igor: I mean a wallet that is built into the messenger (reply to 27754)

Мурс: I understand Well, I thought they don’t have access to wallets, apparently I was wrong  However, the probability of them just blocking your money without a reason is low. If I were you, I’d waited until they respond, there’s ain’t much we can do ¯\_(ツ)_/¯

Vitor: Folks, this is a Tact language chat. Lets keep it on topic. There are different channels if you need support with @wallet.

Sumit: can i get the transaction hash inside a contract?

Rima: Thay can block u. Read the wallet rules!!! (reply to 27754)

Rima: https://wallet.helpscoutdocs.com/ RULES (reply to 27764)

Rima: https://wallet.helpscoutdocs.com/article/240-restricted-access#My-access-to-Wallet-has-been-suspended-What-can-be-the-reason-xF_VX (reply to 27767)

Мурс: They can block the main one, but not TonSpace (allegedly). However, I wouldn’t trust this wallet with any decent money.  —- Just read the whole doc It’s even worse than Binance (reply to 27764)

Rima: It's sad and truth (reply to 27771)

It's: Hello everyone, I have a question, I started learning the language and have already watched a video on how to transfer a TON token, how to make an NFT, how to send Messages, how to make your own token, but I haven’t found a video on how to swap other tokens at the address, please tell me this is possible with this language?) I would be grateful for your answer!

— 2024-05-29 —

giangp: 20

Vitor: This is not a feature of a language. This is something you implement on top of it. You could use Tact to interact with DeDust or Stonfi, for example. Take a look at their docs. (reply to 27792)

Davis: Hi everyone, I have reviewed the staking example at https://github.com/howardpen9/staking-in-tact/blob/main/sources/contract.tact  How can I find out this_contract_jettonWallet?

Vitor: https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md (reply to 27812)

Disha | SMBmarket: Hey, Is there any library or sdk to connect with Frontend?

Max: There’s foton.sh but it’s in beta (reply to 27816)

Disha | SMBmarket: Thanks! Have you used? (reply to 27818)

Max: I created it 😅  It should be good for not-so-difficult smart contracts. If you face a problem, create an issue and we'll deal with it fast (reply to 27822)

Disha | SMBmarket: awesome 😁, I am Exploring it. (reply to 27829)

Vitor: That's really cool. (reply to 27829)

Nerses: I get such exit code for transaction.How to know how much should be balanace of smart contract to pass action phase ?

Igor: Привет Изучаю сейчас контракты жеттонов, подскажите, получить какие-то глобальные настройки из мастер контракта я могу только отправив сообщение? Я хочу сделать, чтобы нельзя было переводить монеты, если "не включен трейдинг" То есть я сначала планирую разослать монеты, а потом включить трансферы, как это можно правильно сделать?

Sumit: how can i get a public key from a TreasuryContract ?

Dmitry | backend4you.ton: только отправив сообщение. или заранее заложив "дату х" и включив её код жетон-валлета (при деплое) (reply to 27870)

— 2024-05-30 —

Nerses: I get exit code 40 (forwarded from Nerses)

Nerses: let ctx: Context = context();                                                                     send(SendParameters{to: myAddress(),                             bounce: true,                             value: ctx.value,                             mode: 0,                             body: Create {data: TonTransferInitiated{__hashlock: _hashlock,                                                                     __amount: ctx.value,                                                                     __chainId: _chainId,                                                                     __timelock: _timelock,                                                                     __sender: sender(),                                                                     __srcAddress: _srcAddress,                                                                     __targetCurrencyReceiverAddress: _targetCurrencyReceiverAddress,                                                                     __phtlcID: _phtlcID,                                                                     __messenger: _messenger                                                                     }}.toCell()});      }      receive(msg: Create){          let ctx: Context = context();         if(false == self.htlcExsits(msg.data.__hashlock) && now() <= msg.data.__timelock && msg.data.__amount != 0){                     self.contracts.set(msg.data.__hashlock, HTLC {hashlock: msg.data.__hashlock,                                                                 secret: 0x0,                                                                 amount: msg.data.__amount,                                                                 timelock: msg.data.__timelock,                                                                 sender: msg.data.__sender,                                                                 srcAddress: msg.data.__srcAddress,                                                                 redeemed: false,                                                                 refunded: false});                      emit(Create {data: TonTransferInitiated{__hashlock: msg.data.__hashlock,                                                             __amount: msg.data.__amount,                                                             __chainId: msg.data.__chainId,                                                             __timelock: msg.data.__timelock,                                                             __sender: msg.data.__sender,                                                             __srcAddress: msg.data.__srcAddress,                                                             __targetCurrencyReceiverAddress: msg.data.__targetCurrencyReceiverAddress,                                                             __phtlcID: msg.data.__phtlcID,                                                             __messenger: msg.data.__messenger                                                             }}.toCell());                      send(SendParameters{to: msg.data.__messenger,                                         bounce: true,                                         value: 0,                                         mode: 0,                                         body: HTLCNotify {data: HTLCNotification {                                                                                     htlcID: msg.data.__hashlock,                                                                                     sender: msg.data.__sender,                                                                                     receiver: msg.data.__srcAddress,                                                                                     amount: msg.data.__amount, (forwarded from Nerses)

Nerses: How can I fix that ? I think in contract there is enough balance for action phase although it fails (forwarded from Nerses)

Truong: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 27943)

Nerses: I know that exit code indicates that smart contract hasnt enough balance.The problem is how to know how much should it be in balance to pass action phase (reply to 27948)

Truong: Not enough funds to process a message. This error is thrown when there is only enough gas to cover part of the message, but does not cover it completely. i think the value of message not enough to pay gas (reply to 27949)

Nerses: ok.I will try now with bigger amount (reply to 27950)

Nerses: i tried with 4 TON.it again faild.Is it adequate to try bigger amount than that ?  https://testnet.tonscan.org/tx/8kMh8aq5Mz2qfLNqTWF68KbHf8k4-PuKMsG9HYtLMuE= (reply to 27950)

Vitor: https://testnet.tonviewer.com/transaction/dd0a7b0363fe4dda7cac2d82f139f0d6cd09ecb2d7f05a9375eb5dcb6af059a9?section=trace look at the compute fees used in Tonviewer. It's not lack of funds. Deploy the contract on a local simulator, add a few dumps and trace what's going on. (reply to 27952)

Truong: maybe this message ?

ABRAHAM: Hi everyone, in this transaction, the in message body hash get from ton center is clCqA9oGLf1Th2KmyTew8RjxONO6KmVb3pgP6AyBpPU= But in tonscan, it is EJfMigjpdKu8xdM/SmvUd0gqAKZ29fibWTFE63uEPIA= How it convert from clCqA9... to EJfMigjpd...  https://tonscan.org/tx/9EFOtVn49R7lPhB99_FTKEhfy1MHlUoii4MEIVP6vn0= (forwarded from ABRAHAM)

Manh Tran: Hi guys. I have a question. If my contract store only jetton address. How can I know extract what is jetton send to my contract (I don’t know jetton wallet of contract)

Nerses: how to parse data from emitted log ? What is the most optimal way ?

regex: 12

Creator: Hi everyone.  Somebody knows what the Cell __system is here?   async function MyContract_init(title: string, description: string, price: bigint, order: string, jetton_master: Address, native_master: Address) {     const __code = Cell.fromBase64('te6ccgEC const __system = Cell.fromBase64('te6cck let builder = beginCell();     builder.storeRef(__system);     builder.storeUint(0, 1);

最も弱い: 2+8=10 (reply to 28015)

Dmitry | backend4you.ton: @admin

Dmitry | backend4you.ton: Ban above plz

Danil: @expectfun

It's: Всем привет, вопрос немного не по теме,  может кто работал с dedust sdk? Есть пара ошибок которые выбивает код)

— 2024-05-31 —

Enoch: Pls I need help with my tact contract I am trying to implement token notifications

Mahima Thacker: Hello guys, Could you please the example of how we can mint Dynamic NFTs in the tact contract, currently this code is minting an NFT statically:- https://github.com/alefmanvladimir/lesson9/blob/main/contracts/nft_collection.tact and I am wondering how dynamic Nfts works in a TON blockchain?!

ed: receive or send? (reply to 28108)

Smart: hi

W. [Разработка сайтов]: Всем привет!

Enoch: Yeah (reply to 28127)

Karim: How to get ConfigParam 21 as a constant in the contract code?

Nerses: Hi there.How can I check if arbirary smart contract handeled correctly with recieved message without emitting logs ? For example how to check that transaction succeded. I need do that on mainnet

Nerses: I want to do that check  with code. for example using any API. Would it be enough action phase exit code 0 to consider transaction as succeded ? (reply to 28163)

Nerses: A lil bit clarification if compute phase is failed then action phase will automatically fail.Am I right ? (reply to 28165)

Nerses: Thanks a lot (reply to 28167)

Nerses: Can smart contract have only recieve() for handling with incoming messages and DO NOT  have any function e.g. fun sendMsg() to send message ? will smart contract work correctly ? (recieve messaages and handle,and accounts be able to interact with smart contract)

Nerses: so it will only need correct message parameters to process and recieve() will handle with data as needed ?

Nerses: If my smart contract doesnt have any function only recieve() s can any arbitrary account send message to the contract ? Or for internal messages it is must to have functions in smart contract so every account will be able to interact with it ?

Tom - Bushi: hey guys, Im a bit confused by the TEP-62 standard, specifically metadata fetching.   Do I correctly understand, that on the individual NFT I fetch individual_content via the get_nft_data getter, which I can then use to get the whole metadata or metadata link from the collection via get_nft_content(index: Int, individual_content: Cell)?

Karim: To send message we can use SendRemainingValue to send all the value left from the message. How can I subtract some value from remaining value and send such message?  For example: 1. User sends 2 TON 2. Contract collects exactly 1 TON from user 3. Contract sends remaining value back, so that user gets get (1 TON – all_the_fees)

Karim: Actually I don't understand how to calculate all_the_fees value. Is it possible to in runtime? (reply to 28181)

Lev: Are addresses serialized as workchain_id:int8 address:uint256?

Ilya: Hi everyone,  I need some advice. I'm learning Tact and trying to build a smart contract that can accept USDT from one address, hold it for a while, and then send it to another address. I know how to send TON, but I'm not sure how to send USDT on the TON blockchain.  I found USDT Asset Processing on TON, but I'm still confused. Can someone explain the steps I need to take and where to look for information? Is it possible to do this with just Tact?  The goal is for a user to log in with TON Connect, send USDT to another user (who also connects with TON Connect), and after some time, the sender sends another transaction to release the funds to the receiver.  Thanks for your help!

Karim: Thank you! (reply to 28193)

Nerses: How can I get length of map is there any method ?

Nerses: thnx (reply to 28223)

Nerses: Line 197, col 29:   196 | > 197 |         foreach (key, value in msg.data.amount) {                                     ^   198 |             require(value != 0,"Funds Not Sent");    i get such error. Cant understand why as i kept syntax of docs (reply to 28223)

Vitor: Make sure you're using tact 1.3.0. Older versions don't support foreach. (reply to 28226)

Nelson: Wow

Nerses: Yeah I use 1.2.0 Thnx (reply to 28231)

— 2024-06-01 —

Teddo: Hi devs Please can I use locklift for tact?

Mahima Thacker: Hey devs, Can we call functions directly in the test or it is mandatory to use receive function in Tact?

Vitor: That's a cool idea, I'm guessing it should be possible to make that work. (reply to 28300)

Mahima Thacker: Hello everyone, I am trying to get the decoded dynamic metadata to mint an NFT but I am unable to get these metadata so could you please check my code and provide solution for this?   import "@stdlib/deploy"; import "@stdlib/ownable"; import "./nft_item.tact"; import "./messages.tact";  const minTonsForStorage: Int = ton("0.02"); const gasConsumption: Int = ton("0.02");  contract NftCollection {     next_item_index: Int as uint32 = 0;     owner_address: Address;     royalty_params: RoyaltyParams?;      init(owner_address: Address, royalty_params: RoyaltyParams) {         self.owner_address = owner_address;         self.royalty_params = royalty_params;     }      receive("Mint") {         let ctx: Context = context();         let msgValue: Int = ctx.value;         let tonBalanceBeforeMsg: Int = myBalance() - msgValue;         let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);         msgValue = msgValue - (storageFee + gasConsumption);          let metadata: String = decodeMetadata();         self.mint(ctx.sender, msgValue, metadata.name, metadata.description, metadata.imageUrl);               emit(LogEventMintRecord{ minter: sender(), item_id: self.next_item_index, generate_number: nativeRandom() }.toCell());      }      fun mint(sender: Address, msgValue: Int, name: String, description: String, imageUrl: String) {         let nft_init: StateInit = self.getNftItemInit(self.next_item_index, name, description, imageUrl);         send(SendParameters{             to: contractAddress(nft_init),             value: msgValue,             bounce: false,             mode: SendIgnoreErrors,             body: Transfer {                 query_id: 0,                 new_owner: sender,                 response_destination: self.owner_address,                 custom_payload: encodeMetadata(name, description, imageUrl),                 forward_amount: 0,                 forward_payload: emptySlice()             }.toCell(),             code: nft_init.code,             data: nft_init.data         });         self.next_item_index = self.next_item_index + 1;     }      fun encodeMetadata(name: String, description: String, imageUrl: String): Cell {         let b: StringBuilder = beginCell();         b.storeString(name).storeString(description).storeString(imageUrl);         return b.endCell();     } }   nft_Item.tact   fun decodeMetadata(payload: Cell): Metadata {     let b: Slice = payload.asSlice();     let metadata: Metadata = Metadata{         name: b.asString(),         description: b.asString(),         imageUrl: b.asString()     };     return metadata; }   contract NftItem {     collection_address: Address;     item_index: Int;      is_initialized: Bool;     owner: Address?;     name: String;     description: String;     imageUrl: String;      init(collection_address: Address, item_index: Int, name: String, description: String, imageUrl: String) {         require(sender() == collection_address, "not from collection");         self.collection_address = collection_address;         self.item_index = item_index;         self.name = name;         self.description = description;         self.imageUrl = imageUrl;         self.is_initialized = false;     }   Can anyone please help me?

Kɪᴍᴏᴠ: You don't seem to be passing the parameter to decodeMetadata. (reply to 28334)

ilhan: Hı

ilhan: Hı

ilhan: Hı help me

— 2024-06-02 —

Part Thai: gmgm.  I need some help. Where can I get USDT on Ton testnet?

Part Thai: Thanks in advance.

ABCDE: Hello everyone  I am working with Blueprint tests. Why my contract don't has balance? Balance is 0.

ABCDE: Contract method:  get fun balance(): String {         return myBalance().toCoinsString();     }

ABCDE: Tests:      const deployResult = await core.send(         deployer.getSender(),         {             value: toNano('0.5'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     )      console.log(await core.getBalance())

Kɪᴍᴏᴠ: Hello. How can I read Cell (i. e. a field in a message defined as Cell?) into a struct?

Kɪᴍᴏᴠ: I mean I have a defined struct type, but the Cell field can contain arbitrary data. If some conditions tell me that this Cell contains a struct, how do I cast this Cell to a variable of this struct type?

Alex: How can I test the map<Int, String> in js tests?

Aydin: Cell is (packed) serialized data. So:  1. Convert it to slice  2. Deserialize it  3. Cast the result into your struct type (reply to 28590)

Kɪᴍᴏᴠ: Wouldn't struct have the same memory layout as the whole cell basically? (reply to 28609)

Kɪᴍᴏᴠ: Or a slice of the cell of our interest. (reply to 28611)

Aydin: No. These are different types.   Cell/slice is like a "train" of data having been put in order, one piece after another. (And of course, with at most 4 references to other cells.)  But struct is like a "vector" with multiple dimensions. (reply to 28613)

Denis: @dev_rel /ban (reply to 28622)

— 2024-06-03 —

Mahima Thacker: Yes but I am not able to get the decoded parameter data to pass in the Mint function! Do I need to use here StringBuilder instead of using Slice? Could you please help me with this? (reply to 28372)

Ilya: Hi guys, can somebody help me to understand, im trying to send Jetton from one address to another, but its not working, what is wrong here ?      await test.send(         provider.sender(),         {             value: toNano('0.05')         },         {             queryId: 1n,             $$type: "InitiateTransfer",             amount: toNano("0.2"),             recipient: address('0QCnkeLAqVdHLKxHj2mQGgFqfoxOpic_NafnyVjpMd4tSoKG'),             forward_ton_amount:  toNano('0.02')         }     )   receive(msg: InitiateTransfer) {         self.transactionCounter += 1;          send(SendParameters{             to: sender(), // address with jettons ( from which we will send values )             bounce: true,             value: 0,             mode: SendRemainingBalance + SendIgnoreErrors,             body: TokenTransfer{                 queryId: 2,                 amount: msg.amount,                 response_destination: self.usdtWallet,                 forward_ton_amount: msg.forward_ton_amount,                 destination: self.usdtWallet,                 custom_payload: null,                 forward_payload: emptyCell().asSlice(),             }.toCell()         });      }

Nick: Anyone experienced with TON DNS contracts?

Mahima Thacker: Should we store multiple Strings in one Cell?

Kɪᴍᴏᴠ: What slice? I don't see any slice. In your mint message receiver, by the logic, you have to generate the description and the image url, not to decode it from something. (reply to 28693)

Mahima Thacker: Oh Okay, Could you please explain what should I use for that? (reply to 28716)

Kɪᴍᴏᴠ: You should just pass literal strings as the description and the URL. Or, maybe use StringBuilder, if they differ for different items (but on this step, in "Mint" receiver, you can only tell items apart by current next_item_index). (reply to 28718)

Mahima Thacker: How can I pass three string in the custom_payload? (reply to 28719)

Mahima Thacker: Does it support this?

ABRAHAM: Hi everyone, how to disable tact auto verify smart contract when deploy?

Kɪᴍᴏᴠ: Your encode_metadata correctly packs the strings to Cell. (reply to 28721)

Kɪᴍᴏᴠ: However, IIRC, it should be a well formed json, not just a bunch of strings. (reply to 28724)

Mahima Thacker: Okay, got it. Thanks for the help

Dhruv: hello guys, I am facing an issue related passing metadata Uri which is String type and i am facing this while creating new NFT, so when i try to create new nft that transaction got automatically rejected from wallet and got "User rejected the transaction request from their wallet", I am using tact smart contract.  If i do same for nft collection data then it is working fine, but while creting nft i'm facing such issue, please help me here  Also if i modify Mint message in contract in such way that it can receive some integer value or data type then it is also working good, but only when I try to use String then i am facing issue.

Kɪᴍᴏᴠ: From your description it's hard to say what the problem is about. (reply to 28740)

Johnny Le: TON API provides REST API access to TON Blockchain. Some of its methods require to fill the {account-id} variable. What should I put there, what value format does it accept?

Dhruv: my problem is that I'm not able to pass String type data from frontend to the smart contract but for integer and other data type it is working good (reply to 28745)

Kɪᴍᴏᴠ: I guess, it's just an address in its "unfriendly" form 0:hexstring. Use ton.org/address to convert addresses. (reply to 28755)

Kɪᴍᴏᴠ: Do you mean the opcode? Like "Mint"? I think, you should pass crc32 of the string. (reply to 28757)

Dhruv: let me share you code (reply to 28760)

Dhruv: sharing you in personal here it's got deleted (reply to 28761)

Johnny Le: thank br (reply to 28758)

Chưởng: hi

Chưởng: I want to know the data immediately after minting the NFT. Is there any way to help me do that? Please help me

Nerses: Hi everyone ! How can I update my TACT version from 1.2.0 to 1.3.0 /

Louis: Hello everyone, when performing a jetton transfer in FE Next.js, can I obtain the event_id to match it with the data returned from https://tonapi.io/v2/accounts/0:b2c460ee69644d52d8f5aae5aacda4bee41b103d62f0250764ac495280b7802b/events?limit=10?

Nerses: I updated TACT version to 1.3.0 but still get error `Syntax error: expected ")" |         foreach (key, value in msg.data.amount)` (reply to 28231)

Nerses: What can cause that ?

Vitor: Can you share a minimal snippet that reproduces your problem? (reply to 28783)

Nerses: let ctx: Context = context();          let totalAmount: Int = 0;                  foreach (key, value in (msg.data.amount)) {             require(value != 0,"Funds Not Sent");             totalAmount += value;         }         require(ctx.value == totalAmount,"Incorrect Data");     } (reply to 28785)

Vitor: Not sure if (msg.data.amount) works, can you assign it to a variable and try write the foreach as foreach(k, v in myMap)? If it does work, let me know and I'll open a GitHub issue. (reply to 28786)

Nerses: I will try now and let you know (reply to 28787)

Nerses: Yeah it was the problem (reply to 28787)

Nerses: after assigning new variable it builds

Anton: At this moment only identifiers can be used as maps to be traversed, arbitrary expressions are not allowed (reply to 28783)

Nerses: how can I know length of map ? I wanna use while loop but couldnt find statment like break to exit out of loop

Ken: this is a bad idea, you should store length of map separately (reply to 28803)

Nerses: Then how to handle with case when you get message and there are few maps which lengths should be equal,How to check if they equal or not ? (reply to 28805)

Ken: why don't you change the message to map<idx, struct> instead?

Nerses: i cant change beacuse of the application architecture i am trying to implement. In your approach message sender can pass wrong values and equality check will pass although it shouldnt (reply to 28807)

Anton: There should be a relevant example in the Tact docs (reply to 28803)

Nerses: couldnt find something about break  in this materials https://docs.tact-lang.org/book/statements (reply to 28810)

Nerses: and also here nothing was mentioned https://tact-by-example.org/04-loops

Anton: I was answering the first question (reply to 28811)

Anton: There is no break statement atm

Made by: Hello everyone, I’m trying to contribute to tondynasty contracts with Upgradable trait.  https://github.com/bymoses/tondynasty-contracts/blob/feat/upgradable/tests/UpgradableExample.spec.ts  Here you can find tests for this trait and code updates (functions add/update) are working fine, but when there is some change in storage fields of contract (see v3) it breaks something within Cells. I don’t have deep understanding of what’s happening here so I need some help to write native funC wrapper for set_data function that will not corrupt contract Cells

Nerses: https://tact-by-example.org/04-maps (reply to 28814)

Nerses: https://docs.tact-lang.org/book/maps

Nerses: i have read these materials but nothing could find

Nerses: is there any other reference ?

Made by: @AntonTrunov maybe you could give me some clue about what’s happening when we call native set_data within tact contract and why is it breaking storage

Anton: https://docs.tact-lang.org/cookbook/data-structures#array (reply to 28820)

Nerses: What about the case when I get message which contains few maps and I should check lengths equality.Should I implement array or there is more optimal way ? (reply to 28822)

Anton: There not enough info in your problem statement to answer

Anton: It depends if you trust the source, if you can include the length info or it’s to late to do that, in the worst case you can just calculate it by traversing the map

Nerses: no i dont trust the source. (reply to 28825)

Nerses: so it would be more clever to use foreach than implement array ?

Anton: please forget the arrays, it’s just an example, the foreach statement is your friend

Nerses: thnx (reply to 28828)

Kɪᴍᴏᴠ: Do you mean that it breaks when a contract's storage structure changes? I was planning to implement just that, so I'm interested in how it goes. (reply to 28816)

Made by: Yup, you could find details at the github issue, there’s some weird behaviour occurring when you try to add new field to the contract (reply to 28830)

Kɪᴍᴏᴠ: Maybe it's Tact who expects something internal in storage and gets confused? @AntonTrunov (reply to 28831)

Made by: If I get this snippet of compiled code right, it’s likely not the Tact issue, but maybe missuse of set_data function itself (reply to 28832)

Kɪᴍᴏᴠ: Look at generated recv_internal in build/tact_YourContract.code.fc. It calls YourContract_contract_store at the end, which calls set_data. (reply to 28833)

Made by: Could you help me to figure this out because I have zero experience in func? (reply to 28835)

Kɪᴍᴏᴠ: As I understand, the problem is that Tact's runtime rewrites contract's storage after all of your code. So, it appears that we cannot really replace a contract's data from within Tact. I have no idea, if it's possible to sustainably work around this. (reply to 28837)

Kɪᴍᴏᴠ: By "Tact runtime" here I mean all that FunC wrapper code that gets generated upon build.

Kɪᴍᴏᴠ: I suspect that when you upgrade your contract without changing fields, the storage, in fact, will still contain the old data.

Made by: Oh I see (reply to 28838)

Made by: So now the only pure tact option is to only rely on code upgrades and wait for native approach for storage upgrades?

Kɪᴍᴏᴠ: Seems so. (reply to 28844)

Made by: It seems like there we need to wait for 1.4.0 for native upgrades mechanism https://github.com/tact-lang/tact/issues/27#issuecomment-2124694217 (reply to 28845)

Made by: But I’m not familiar with tact development cycles so is there some chance devs decide to delay this feature?

Kɪᴍᴏᴠ: Upvoted the issue. I hope it will indeed get through. (reply to 28846)

Made by: Do you know some ways to post process func to bypass this behaviour on upgrade, maybe as a temporary solution we can make simple middleware script? (reply to 28838)

Kɪᴍᴏᴠ: I don't see any feasible solution. There's some Blueprint plugin mechanism. Maybe that could get called after the build and modify already generated *.fc files. But how would it know if it needs to eliminate set_data call? (reply to 28851)

Kɪᴍᴏᴠ: Let's hope. (reply to 28847)

Made by: Actually if there will be standardised upgrade msg op code we could make some branching before line 20 (reply to 28852)

Mahima Thacker: Hey guys, do we need to convert maps to a cell in order to get the values using its key?

Mahima Thacker: I tried to get the nft addresss using its index but getting null here:       address: map<Int, Address>;  fun mint(sender: Address, msgValue: Int, individual_metadata: Cell ) {         require(self.next_item_index >= 0, "non-sequential NFTs");         let nft_init: StateInit = self.getNftItemInit(self.next_item_index,individual_metadata );         let add: Address = contractAddress(nft_init);         self.address.set(self.next_item_index, add);      get fun get_nft_address_by_index(item_index: Int): Address? {         // self.address.asCell();         return self.address.get(item_index);     } (reply to 28859)

Kɪᴍᴏᴠ: It's currently hardcoded. https://github.com/tact-lang/tact/blob/1590a4cc8a943d8c19495f2945fd539b6bf4a48c/src/generator/writers/writeContract.ts#L324 (reply to 28855)

Kɪᴍᴏᴠ: https://github.com/tact-lang/tact/blob/1590a4cc8a943d8c19495f2945fd539b6bf4a48c/src/generator/writers/writeContract.ts#L99

Made by: Yup, we could try using blueprint plugins as post processing (reply to 28864)

Made by: I will test idea with custom op code later today, maybe it will work

Kɪᴍᴏᴠ: Maybe, you'll be better off with wrappers/yourcontract.compile.ts script. See blueprint's compile pipeline: https://github.com/ton-org/blueprint/blob/main/src%2Fcompile%2Fcompile.ts#L136 (reply to 28870)

Made by: Brilliant! Post compile hook is  much more suitable approach (reply to 28880)

Kɪᴍᴏᴠ: Unfortunately, it's too late to intervene here because Tact already has its FunC code compiled at this point. I suppose, you're gonna have to use funCOnly option, then run your hook, and only then manually compile those fc files with FunC compiler. Not a clean solution, though. (reply to 28884)

Made by: Sure, I’m thinking of it as a temporary workaround until devs introduce a native solution. Technically maybe I will use just regexp for testing this thing and then depending on results we will figure out how to make this pretty (reply to 28885)

Made by: But it’s kinda unfortunate that you can’t intervene in compilation pipeline

Lev: How do I make StateInit out of a non-Tact contract?

Lev: I guess this is the way: https://t.me/tactlang/4812

Vladimir: Yo guys, any suggestions how to do pow(5, 0.4) in Tact?

Creator: Hello People.  Can`t figure out why TransferNotification falling down with error skip_no_gas.   https://testnet.tonviewer.com/transaction/838076826058886eca12212900432625d826dda1f870fdb77d20ebb26020ac8e  I send enough forward amount etc. Master and wallet are defaults from minter.org.   Can anybody help me?)  here is receiever code:  receive(msg: TransferNotification) {         let ctx: Context = context();         if (self.costs.get(ctx.sender) == null) {             self.costs.set(ctx.sender, msg.amount);         } else {             let updated_value: Int = self.costs.get(ctx.sender)!! + msg.amount;             self.costs.set(ctx.sender, updated_value);         }         if (self.state == self.OfferPrePublished || self.state == self.OfferCreated) {             send(SendParameters{             to: myAddress(),              value: 0,              mode: SendPayGasSeparately,             body: CheckPublish{                 query_id: 0             }.toCell(),         });         }     }

Kɪᴍᴏᴠ: The result would be float. There are no floats. (reply to 28936)

Yakitori: Hi, what is he difference between context.readForwardFee and context.value? https://docs.tact-lang.org/ref/core-advanced#contextreadforwardfee

— 2024-06-04 —

Mahima Thacker: Hey guys, I tried to get the address of the nftItem but I am getting null value so could you please check my syntax? here's the code:   next_item_index: Int as uint32 = 0;     owner_address: Address;

Mahima Thacker: address: map<Int as uint32 , Address>;      fun mint(sender: Address, msgValue: Int, individual_metadata: Cell ) {         require(self.next_item_index >= 0, "non-sequential NFTs");         let nft_init: StateInit = self.getNftItemInit(self.next_item_index,individual_metadata );         let add: Address = contractAddress(nft_init);         self.address.set(self.next_item_index, add);         send(SendParameters{                 to: contractAddress(nft_init),                  value: msgValue,                  bounce: false,                 mode: SendIgnoreErrors,                 body: Transfer {                     query_id: 0,                     new_owner: sender,                     response_destination: self.owner_address,                     custom_payload: individual_metadata,                     forward_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: nft_init.code,                 data: nft_init.data             });         // dump(self.next_item_index); // Reference at: https://tact-by-example.org/03-emit         self.next_item_index = self.next_item_index + 1;     }       get fun getNftItemInit(item_index: Int, individual_metadata: Cell): StateInit {           return initOf NftItem(self.owner_address, myAddress(), item_index, individual_metadata);     }        get fun get_nft_address_by_index(item_index: Int): Address? {         // self.address.asCell();         return self.address.get(item_index);     }  And here's the test code:-     it("should mint nft", async()=>{         const OFFCHAIN_CONTENT_PREFIX = 0x01;         const string_first = "https://salmon-governing-canidae-592.mypinata.cloud/ipfs/QmQYUEJqsfkSNyJ8Vxdsq5ZpLyp9cyw81HWPemkJ2tBuzF/collection.json";         let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();                      const res =  await nftCollection.send(             deployer.getSender(),             {                 value: toNano("0.02")             },             {                 $$type: 'Mint',                 individual_metadata: newContent             }         )          console.log(res)          console.log("deployer - ", deployer.getSender().address)         console.log("nftCollection - ", nftCollection.address)          const nftItemAddress = await nftCollection.getGetNftAddressByIndex(0n);         console.log("nftItemAddress - ", nftItemAddress)                  const nftItem: SandboxContract<NftItem> = blockchain.openContract(NftItem.fromAddress(nftItemAddress!))                  let nftItemData = await nftItem.getGetItemData();          console.log("Item data", nftItemData.individual_metadata.beginParse().loadStringTail()); (reply to 28982)

Kɪᴍᴏᴠ: Check if nftCollection contract has been deployed successfully first. Looks like it might have not. (reply to 28983)

Teddo: Hi, I am looking the best way to effectively follow or track the progress of a transaction

Baldwin: How is it different throw and required in tact?

Anton: throw just throws with a specified exit code, but require generates the code for you, based on the error message string (reply to 29005)

Yakitori: Hi, do you know the difference between context.readForwardFee and context.value? https://docs.tact-lang.org/ref/core-advanced#contextreadforwardfee (reply to 29009)

JakeTheSlug | BTR: forward is the cost of sending to destination and back, value is the total gas (with processing) (reply to 29013)

JakeTheSlug | BTR: https://docs.ton.org/develop/smart-contracts/guidelines/processing

Yakitori: Answer your dms (reply to 29015)

Lev: How do I create the zero address in Tact?

Lev: For locking tokens

Vitor: UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ is a commonly used burn address in TON. An Ethereum-like address(0) would not be a valid address. (reply to 29021)

Lev: How do we define it as a constant in Tact? (reply to 29024)

Vitor: const BURN_ADDRESS: Address = '...'? (reply to 29025)

Lev: This doesn't work (reply to 29026)

Lev: const BurnAddr: Address = address("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ"); — this works

Karim: How to define compiled hex contract code as const in Tact? I have hex-string with code

Nerses: let ctx: Context = context();          if(ctx.value == 0){             send(SendParameters{to: ctx.sender,                                 bounce: true,                                 value: ctx.value,                                 mode: 0});          }else{                     }         require(ctx.value != 0,"Funds Not Sent");     } In this code in case the ctx.value is 0 will body of if be executed so doing transaction and then revereted in bottom require OR it will revert immediatly without exefcuting anything ?

Ken: code: Cell = cell("te6cckECEAEA..."); (reply to 29030)

Hunter: In tact web ide , how to give cell input as a message after deploy?

Mahima Thacker: Hey guys, is there any way to add a connect wallet functionality using tonkeeper extension and not using QR code with tonconnect SDK?

Vitor: Yeah, look at ton connect UI react for an example. Also, this is a Tact group. This question is a bit off topic and might be more appropriate at @tondev_eng for example. (reply to 29105)

Alexander I: @expectfun (reply to 29110)

Ilya: Hi guys, everyone.   The included dump (ala log) increases the gas consumption of the contract, right?

Nerses: If size of map affects on gas fee and based to my architecture I cant specify limit of maps.How can I find optimal way to specify as transaction amount to pass computation phase and escape from exit code 37 ?

Nostra: Hey guys whats the best way to validate in my dapp if a transaction was successful? I am calling the contract with my client however as a result I get undefined. Would appreciate your help 🙏

Kɪᴍᴏᴠ: I guess, your main concern should be storage fee. As for gas, you probably should estimate it based on the current length of the map. (reply to 29132)

Nerses: yeah exactly.Do you have any ideas ? (reply to 29150)

Vasily: Hey guys! Maybe someone here can give me a clue =) My team is developing a Traction Eye service where a user can analyse not only tokens but also the DeFi protocols he uses.  We have a technical question from the backend side: 1)Is it possible to get the data of protocols used by a particular wallet:  - Liquid pools (Dedust, StonFi) - Lending protocol (EVAA)  - Staking providers (Bemo, Stakers, Stakee, etc). How can this be implemented? To make it clearer what data we are talking about, you can see the mockup.

Nerses: the problem is that my map changes dynamically and In contract I should notify other party so sending message,for it I send money so the computation phase will pass and I writ in contract certain amount.But as I see chnages of map length can affect to that amount so after some time when map exceeds the normal length all notifying messages will fail getting exit code 37 (reply to 29150)

Nostra: I also emit a log for a successful transaction how would you call the rpc client to query it ? (reply to 29140)

Kɪᴍᴏᴠ: I would suggest refactoring your architecture. And be cautious about your contract being drained if it can be forced to spend money. To calculate gas on map traversal, you can try to locate this code in compiled fift file (in build difectory), look up TVM instructions gas prices and estimate the cost by multiplying it on length of your map (or log of length). (reply to 29153)

Kɪᴍᴏᴠ: I. e. estimate one iteration by summing up gas prices of instructions. Then multiply.

Nerses: could you please give me some insight ? By refactoring architecture you mean  specifying limit ? (reply to 29159)

Aydin: /ban (reply to 29169)

Kɪᴍᴏᴠ: I mean that you would probably try to follow TON's paradigm: use blockchain itself as an array. Like like jetton master creates jetton wallets instead of storing amounts in a map. (reply to 29161)

Kɪᴍᴏᴠ: Or at least make the map bounded.

Nerses: I think bounded map is better as first approach will contradict to my applications architecture. And what about sharding ? I think it can be solution as well

Kɪᴍᴏᴠ: Sharding won't be of any help for you, if you have a single contract. (reply to 29175)

Nerses: Let me give you some context. In my map I store structs.What if I try with sharding split that data among child contracts ? Thats why I thought It can be solution (reply to 29176)

Kɪᴍᴏᴠ: Are you afraid your child contracts end up in different shards? Well, it's better to push logic to the child contracts when possible, so that they can communicate with each other without touching master contract. If possible. Anyway, I don't think sharding nowadays is a big concern. (reply to 29180)

Kɪᴍᴏᴠ: Jetton master + jetton wallets and NFT collection + NFT item work just like that.

Kɪᴍᴏᴠ: Wallet-to-wallet doesn't talk to master.

Aydin: I guess Nerses is using the term "shard" with a meaning different from TON's Infinite Sharding Paradigm.  By "shard", Nerses is actually refering to the parent-child model.  Am I right? (reply to 29181)

Nerses: I think your are right. As i was speaking about concept used in this example https://tact-by-example.org/06-unbounded-maps (reply to 29184)

— 2024-06-05 —

Ilya: Is it possible to send Jettons via ton-connect ?

nimcat: create send jetton msg and send it via tonconnect sender to the jetton contract's address (reply to 29244)

Ilya: const transaction = {     validUntil: Date.now() + 1000000,     messages: [         {             address: "adddress",             amount: "20000000"          }     ]  }  with this message it sended ton, but i need to send usdt (reply to 29244)

nimcat: this message hasn't body cell, build that cell as transfer jetton request and send it (reply to 29246)

Ilya: Can u please show the example how to do it ton connect react ? (reply to 29248)

Dhruv: hey there, I am sending transaction from front end so how to know that transaction is get confirmed, like is there any status code or anything?

Baldwin: What if the SendParameters command fails and totalSupply was previously increased because I don't see a revert?

Baldwin: totalSupply has increased while there is no certainty that the user's wallet has been successfully minted

Baldwin: Is there any way to check the success of SendParameter transaction?

ABCDE: thank you very much! (reply to 28547)

Guziec: HI gys, is there any method to get all transaction executed on smart contract written in TACT?

Guziec: also is there a simple solution to get all emited messages?

Vitor: Use an indexer or an API such as TonCenter, etc. (reply to 29369)

Guziec: bro, do you have some example? (reply to 29370)

Guziec: i am completly new in ton world

Vitor: Look at the endpoint /v2/blockchain/accounts/{account_id}/transactions here https://docs.tonconsole.com/tonapi/api-v2 (reply to 29371)

Guziec: receive("payment"){         require(context().value >= self.MinTonForUnlock, "Insufficient payment fee");         emit(PaymentEvent{purchasedBy: context().sender}.toCell());     }  i have a such function in the contract, I see transactions with decodedName payment, but how can i decode the output message to get sender address?

Guziec: do i need somehow decode raw_body and opcode?

Guziec: "op_code": "0x42ba10b9",      "raw_body": "b5ee9c7201010101002800004b42ba10b9801581d680775190195f77631eab7279c9c46ed4ecf2ccc7e333584727e344fb57b0"

Vitor: context().sender (reply to 29379)

Guziec: I want to get the sender address from transaction log from api

Hunter: 🤔 metaMAsk wallet users can sign a message without any fees to sign-in apps .  Have Ton wallets that features ?

Павел: How to use tact config with blurprint?

Guziec: any idea guys? (reply to 29388)

Vitor: If you're using the TonAPI link that I sent you, the sender is available on the output. I'm sure other indexers will have it too. (reply to 29404)

Guziec: but dont see that (reply to 29406)

Vitor: https://docs.ton.org/develop/dapps/ton-connect/sign (reply to 29389)

Vitor: First, please, don't post a massive snippet taking over the entire screen That's just rude. Also look for "in_msg", "source". (reply to 29409)

Павел: Yes, I am using exactly this article, but I don’t know the way, how to let compiler to use tact config file… (reply to 29410)

Guziec: sorry for that (reply to 29412)

Guziec: yeah it looks like i have an addres of a transaction based on the transaction but it's a specific scenario

Guziec: i just wonder is there any idea to decode params in emited message

Guziec: like having a recive function with address for a user and a value in ton and then emit a message with both infromation

Павел: Compiler doesn’t use config file by default. Do you know, how to set it up? (reply to 29410)

Vitor: https://docs.ton.org/develop/data-formats/tl-b-language take a look at data serialization part of the TON docs. (reply to 29418)

Vitor: tact --config yourfile.json? (reply to 29419)

Павел: No such information (reply to 29424)

Ilya: Hello!  Where I can test my smart contract? I deployed it to testnet.   I want to use get method   Maybe there are online sites or bot in telegram to do it? Please help :)

Vitor: I don't know of a website to do that, but it doesn't take more than a handful of lines of JS to instantiate a client, get your contract and call a get method on it. @ton/core (https://github.com/ton-core/ton) has all you need. (reply to 29441)

Ilya: thx! (reply to 29442)

Скот: I pay 10Not to everyone who signs up and will play on projects such as Catizen, Blum, PocketFi. 10Not for EACH project! Follow the links in my chat

Yevhenii: 10 NOT - 0.2$

Taro: Hello guys, I would like to ask a question. Here, b appends an IPFS JSON, which can be viewed in getgems after minting, but not in tonapis. What should I do? Thx

Aydin: For one thing:  From experience, I've found that sometimes explorers and scanners have difficulties finding those NFT items. For example, I minted an NFT item on GetGems and then made it "hidden". Now, when I explore my wallet using TonViewer, I can see the NFT under the "Collectibles" tab with no problem. However, when I switch to TonScan, it cannot be found under the "NFTs" tab, though one can still find it by tracing the transaction history of the wallet. (reply to 29456)

YuiopNOT: Check Free Ton in my profile. Check bio

Dmitry: Guys, we're looking for the members to our team to build special Bots for the TON City 🌆   Next stop - event called Orientir 🧭 so we need TON Dev (Devs)

— 2024-06-06 —

ABRAHAM: Hi, everyone, if I let tact encode this message, it generate another opcode, but when I fix this opcode for this message, is that ok when I send?

Dmitry: Also hello everyone 😺 I have new one proj - DAO with music, social, apps, games . So nowadays we are making tokenomics for the team, building the team, making it even bigger. Of you're interested, welcome to chat me directly ☺️

𝖞𝖓𝖌𝖇𝖘𝖉 🛰: @admin (reply to 29644)

Justin1: Hi, I'm trying to create a contract that sends message to  provide liquidity for a stonfi pool. And I got exitcode: 8 (Cell overflow) when my contract sends this message. Is this the correct way to create the forward_payload?

Evoke: @expectfun ^^ spam (reply to 29654)

Taro: spam (reply to 29667)

Made by: @lxn_kmv pls check dm

𝖞𝖓𝖌𝖇𝖘𝖉 🛰: @admin (reply to 29675)

web3: 16

Dmitry: is there a way to inline assembly in tact?

Dmitry: or should i create a func wrapper and then importing it

Anton: Yeah, this is the way for now (reply to 29686)

Dmitry: where can i find docs for that?

Dmitry: oh i c

Dmitry: is there a way to add namespace to a function?  smth like Library.someFunction()

It's: Hello guys, a little off topic, but where can I find out more specifically about working with the mempool? There are some communities, otherwise I can’t reach the endpoint(

Vitor: Looking to write a MEV Bot? :D I recommend you look into Pytoniq implementation of a LiteClient, it's easy to understand how ADNL over TCP works and how transactions are propagated. (reply to 29736)

It's: No I do not want. I need to track users' transactions and see their transactions before they are completed. For some reason the GraphQL API throws an error. Plus, the operation of a mevbot on the network is impossible due to the lack of an increase in transaction speed with the help of a commission. (reply to 29744)

Vitor: I know, it was just a mempool joke. If you want to track mempool-to-inblock status, I'd recommend you take one of the open source indexers (ton-indexer or anton) and start from that. (reply to 29745)

It's: Thanks for the answer, but I still don't understand why I can't access the mempool through my paid tone api via node.js (reply to 29747)

Vitor: The network natively "speaks" ADNL. APIs offer whatever their dev decided to offer. I'm surprise TonAPI doesn't support it though, as Tonkepper uses and it has push notifications for when the transactions go from mempool to being in a block. (reply to 29748)

Vitor: https://docs.tonconsole.com/tonapi/streaming-api#real-time-notifications-about-finalized-transactions It does support it.

It's: I know I know but The API tone is supportive, that’s what it says, but when I try to reach the endpoint, I get an error that access to the endpoint is denied 😂 (reply to 29751)

Vitor: Will DM you a contact with their team. (reply to 29752)

Teddo: Hi, I am working on a project and I need to get information store in another contract in my smart contract, since contracts can not call other contract's getters, How can I retrieve info from other contracts?

Javier: You send a message and reply from the other contract with a message to the original contract. This is Asynchronous so you need to be careful with that (reply to 29792)

Teddo: Thanks for this (reply to 29793)

Teddo: Please how do I  access the faucet for testnet

Javier: @testgiver_ton_bot

Javier: I think is this one

— 2024-06-07 —

Wang: Please how do I access contract from react js?

ABRAHAM: could you share the function get jetton wallet? I also get it from state init of jetton wallet default but somethinng wrong, I got wrong address (reply to 29649)

Vitor: Look at this: https://github.com/VanishMax/foton (reply to 29869)

Владислав: Pnpm- dislike (reply to 29901)

Illia: What's the limit of outActions per transaction?

Illia: And also how should I handle message when I have >3 actions? (reply to 29947)

Kɪᴍᴏᴠ: https://docs.ton.org/learn/tvm-instructions/tvm-overview#:~:text=the%20limit%20on%20c4%20and%20c5%20depth%20%3C%3D512%2C%20there%20will%20be%20a%20limit%20on%20the%20number%20of%20output%20actions%20in%20one%20tx%20%3C%3D255 (reply to 29947)

Illia: wow, that's great, thanks (reply to 29949)

Aibar: We are looking for an experienced and knowledgeable TON smart contracts developer to build a next big dapp. If you’re interested and consider yourself to be an experienced developer please dm me to get details.

Teddo: Does TON transfer behave like jetton transfers too?  With Jetton notify and stuffs?

Illia: Nope. $TON is like $ETH. Jetton is like ERC-20. $ETH doesn't have ERC-20 methods and $TON doesn't have Jetton features. (reply to 29973)

Illia: How are actions executed? Are they all executed in a single block or can be split across multiple blocks? Some docs references would be very much appreciated

Illia: Do actions get into mempool before execution? I am building a system with cross-contract calls and I am afraid that if, for some reason, transactions don't reach the contract and bounce back (some internal TON network error), then there is no way I can reverse all the actions and restore the state (reply to 29977)

Adrian: @alefman (reply to 29975)

Vasily: Traction Eye team is looking for a blockchain dev💻. If you wanted to participate in a hackathon, but for some reason didn't find a team, now you have a cool opportunity to join a strong international team. Our product solves real user problems, has a long-term development strategy and a clear plan. Only you are missing! DM: @voxdecaelo  Forward to whoever might be interested.

Aydin: What do you mean by "actions"? (reply to 29978)

Illia: outActions, e.g., send_raw_message, raw_reserve (reply to 29984)

Aydin: Please take a look at TON Whitepaper, page 34, Section:  2.4.17. Output queues (reply to 29988)

D: Please tell me what’s wrong, I’m posting NFT v3r2 for sale - good, but if I change the base64 code to v3r3, then the NFT goes to an unknown address

— 2024-06-08 —

It's: Hello everyone, I have a question who can help or at least hint how to decrypt and get transaction data knowing the boc received from mempool?) plsssssss 🥹

Illia: Wow, that's so good, thanks! (reply to 29993)

Illia: The address of your wallet is derived from your public key and the wallet's code. It means that if you change your wallet's code, you will have it deployed under a different address.  This can be illustrated using the following equation: public key + code = wallet address  Hence  public key + code v3r2 = wallet address v3r2   public key + code v3r3 = wallet address v3r3  Therefore, when you change your wallet version, you change your wallet's code and hence have your NFT deployed to a completely different address! (reply to 30026)

Illia: As far as I am concerned, there is no way to decode the BoC without knowing its TL-B. TL-B is a schema of the message. It's like protobuf. BoC is binary data and it can be literally anything.  Well, you may try to brute-force all possible combinations of what the original message could look like and see if the decoded data makes any sense. But I don't think that you're interested in decoding a single BoC.    Therefore the answer is that there is no way to decode BoC without its TL-B. Please feel free to correct me if my reasoning is somewhere wrong. (reply to 30034)

Daniil: Internal messages are guaranteed to arrive to the destination. However, delays are still a thing and you should consider cases when your internal message travels for several minutes. (reply to 29978)

D: we are talking about a sales contract, after changing the version, it is therefore not sent to the deployer (reply to 30047)

Anton: 🚀 Tact v1.3 release notes  The new Tact v1.3 release provides a massive improvement on the smart contract programming for TON blockchain.  🗺 Maps  Traversing a map has never been easier! The foreach loop for the Map type:  let mapLength: Int = 0; foreach (k, v in map) {   mapLength += 1; }   You don't have to use map.set(key, null) to remove a key from your maps, use the more intuitive del method instead: map.del(key).  Want to check if the map is empty? Use map.isEmpty()!  🔤 Strings   Strings finally support escape sequences, like \\, \", \n, \u0000 through \uFFFF, etc.  There is a new non-modifying StringBuilder's concat method for chained string concatenations: b = b.concat("Hello,").concat(foo).concat("Tact!").  We added the toString method for the Address type that you asked for numerous times in the dev chats: address("EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN").toString().  👌 Handling exceptions  Want to process various TVM and user-defined exit codes before your contract fails at runtime? The try and try-catch statements: https://docs.tact-lang.org/book/statements#try-catch:   try {     let foo: Int = 42 / 0; } catch(e) {     // your division by zero handler }   ☀️ New quality-of-life improving syntax  Tact started supporting struct fields punning, i.e. {foo, bar} is syntactic sugar for { foo: foo, bar: bar }.  There is support for trailing commas in all comma-separated lists in Tact, here is how you can use it with structs:      foo(Struct {     field1: 42,     field2: "42",   })     You can now chain method calls with the unboxing operator !!, e.g. map.asCell()!!.hash().  For those missing some bit-level hackery, there is the bitwise XOR operator ^ available now.  ⚙️ Stdlib enhancements   The Tact team has added log2 and log, pow2 and pow functions.  Use reserve mode constants from @stdlib/reserve instead of their numeric values to make your code even easier to read: https://docs.tact-lang.org/ref/core-advanced#nativereserve-base-modes.  🧠 Debugging  Debugging has become easier now as the dump() and dumpStack() functions now print the file path, line number, and column number in addition to the data specified by the programmer.  Addresses can be arguments of the dump function.  💻 Tact CLI  Tact's command line interface just became a lot more user-friendly: run npx tact --help from terminal and see what's available.  Just a highlight: CLI now allows compiling a single Tact file directly, without specifying a config file: npx tact your-awesome-contract.tact. It's very useful for quick experiments or bug reports.  🛠 Third-party tools support   For third-party tools implementors there is new improved APIs: AST traversals, access to the AST store of top-level items like functions, constants, traits, etc.  Happy hacking! ❤️  Check out Tact's CHANGELOG for the comprehensive list of features, changes and bugfixes.  Check out the Tact docs and read about the new Tact features.  To upgrade your Blueprint-based Tact projects to use Tact v1.3.1, run npm upgrade inside the project folder.  This release was brought to you by 0kenx, byakuren-hijiri, Max Korsunov, Novus Nota, Vitor Py, Daniil Sedov, and Anton Trunov. (forwarded from TON Dev News)

Anton: 🧑‍🍳 The Tact team invites you to peek behind the scenes and into the steaming pot of hot updates to the Tact compiler, tooling, documentation and ecosystem as a whole, join our Telegram channel: @tact_kitchen.  ⚡️ You know what's cooking — Tact! (forwarded from TON Dev News)

Illia: I have a map defined as fizz: map<Address, Int as uint8>;  The maximum number of elements stored in this map is 250.  1) How to calculate the worst-case computation fee for rizz.get(key: Address) given the key-value pairs limit? What's the best-case fee? The average-case fee?  2) What the structure used to store dicts in TVM? Is it a binary tree or a trie? Does Tact uses bear dicts under the hood?  3) How to calculate storage fee for the map depending on the number of key-value pairs stored inside?

Illia: I have also encountered a problem when compiling foreach with self.rizz as a map to iterate over.  Is it a bug or there is a deliberate limitation on such syntax? (reply to 30194)

Anton: It’s a restriction we are going to lift in the next release (1.4). Iterating over storage maps will be possible (reply to 30195)

Павел: Do I able load the data from other smart contract wile action execution?

Anton: You can only communicate with other contracts through sending messages to them (reply to 30230)

Павел: Is there a simple and cheap way to send messages to all jetton holders?

Illia: Do you want an 'on-chain' or 'off-chain' solution?   The off-chain solution may be to fetch all jetton holders using tonapi.io and then send a message directly to their addresses (reply to 30233)

Павел: I need on-chain solution. When an event occurs, all jetton holders must receive an additional portion of jettons. (reply to 30234)

Павел: It seems that for this I should make wallets like a linked list, so that the next field is stored in the next wallet. But this solution may not work if at least one of the wallets is frozen due to a negative balance. Is it possible to find some better on-chain solution for this problem?

Ken: unlikely. it seem that your design is flawed (reply to 30235)

Павел: What do you mean? What could you suggest instead? (reply to 30246)

Ken: depends on your business requirement. what you want to do is simply impossible

Illia: there is no easy solution because the jetton wallet address is derived  from (jetton_master + holder)  to notify everyone you either need to have a huge map (which is strongly not recommended and is a very bad idea as it doesn't scale)  but this can be a good idea if you have up  to 250 elements, I guess, I still try to figure out how gas is calculated for mappings  you can also try to create something like 'channel' contract which deploys subscriptions from (channel address + subscription id = 0) but deriving address costs ~0.005 TON for single contract + transfer 0.005 approximately  so to message 1000 holders it will cost 10 tons  there easiest way is to make jetton holders claim their tokens by themselves, so you create such contract and then other people just send a message to claim their tokens (reply to 30239)

Павел: Yes, I see. Seems like claiming is the best solution. Thank you for explanation (reply to 30249)

Yakitori: Do you control the token contract? (reply to 30235)

Yakitori: You could use a merkle airdrop: https://learnweb3.io/lessons/how-to-create-merkle-trees-for-airdrops/

Swaraj: Where to learn coding on ton?

Tiqan: Hey Guys. How can I check the dump?

Tiqan: Somehow if I test my code i do not see the dump even though i enabled debug in tact.config.json

Illia: do you use jest? (reply to 30329)

Tiqan: yep

Illia: Try npx jest --verbose --silent=false and also try to increase the value you attach to your message.  I had a similar issue recently. I found that dump consumes 0.06 TON on a simple receiver that forwards a message to another contract. (reply to 30339)

Illia: Make sure you add some enormous amount of tocoins to neglect your forwarding, storage and computing fees (reply to 30341)

Illia: This is an example of unit tests for my sandbox contract that I used to compare gas fees.  It has a handy printTransaction function at the bottom. It is my modified version of printTransactions function that provides better info on what has just happened.  The usage can be found in this file as well. (reply to 30339)

Illia: You can use this function to print actions caused by your transactions, see sources and destinations, and also totalFees per each. I found it very useful when debugging cross-contract calls and also that how I found out that dump takes too much fees. (reply to 30339)

Illia: npm create ton@latest + create a project with simple Tact counter  then go though tutorial tact-by-example and literalrly rewrite all the code into your project and try test it as much as possible  https://tact-by-example.org/00-hello-world  explore tact docs if you want to check if you don't understand some staff in tact-by-example or you wanna deepen your knoweldge  then probably ton docs and then whitepapers (reply to 30281)

Tiqan: First of all thanks. But i get this type error: TypeError: expect(...).toHaveTransaction is not a function (reply to 30343)

Tiqan: And my dump still not gets executed... How does your tact config look like? And how does your wrapper look like?

Illia: my wrapper is auto-generated by Tact  and, honestly, I have no idea where my config is... I just created a project using blueprint and it seems like it doesn't provide one; I had no incentive to create it or modify (reply to 30351)

Tiqan: tact.config.js in root

Illia: did you create your project though npm create ton@latest? (reply to 30350)

Illia: nope, nothing, no tact.config.js

Tiqan: ok

Tiqan: could you show me? (reply to 30352)

Tiqan: nope (reply to 30354)

Illia: can you create a new project using npm create ton@latest and choose to init the project with simple Tact counter?  if it doesn't work, i'll upload a demo project with my code as an example (reply to 30358)

Tiqan: i created a new one. put my contract in it and it still does not work

Tiqan: But with the Sample Counter it works

Tiqan: I think i got it now

Tiqan: had to set  options: {         debug: true, }  in my wrapper compile file

Illia: wow, congrats, thanks for the solution btw! (reply to 30369)

— 2024-06-09 —

Tiqan: is it possible to call a function in init()?

Tiqan: And is it possible to use Dictionaries in tact? Because I do not find anything in the docs

Anton: It’s called “maps” in Tact (reply to 30391)

Tiqan: Thanks

Tiqan: Why does map.asCell() return Cell? and not Cell

Tiqan: I cant find a way to append a map to my cell any other way...

Swaraj: I want to learn how to develop game on ton can someone help me?

Swaraj: Where can I find materials?

MyName: Hello there! How can i get hash (Int) of string? Is there some function for String type to implement it?

MyName: sha256(:String), found 👌 (reply to 30466)

Zakhar: 8

Zakhar: 7

Illia: That's a good question. I think you can call functions that don't produce actions as the contract is yet to be deployed (reply to 30383)

Tiqan: I found out how to do it. Had to declare it above the contract

Dmitry: I need a smart contract developer for my project, if you are very familiar with jettons, bonding curve mechanism, liquidity and trading, regarding the technical aspect, then please write me a message.  I hope I can post this in the chat, if not please ping me and point me where I can post this 🤝

Illia: What happens to the action if nativeThrow() happens with error code >= 1? Does message bounces back?

Illia: Wow, that's great. Thanks! (reply to 30538)

Illia: Do I get any confirmations if exit code = 0? (reply to 30538)

Illia: Or i need to sent some message back on my own e.g., DeploySuccess?

Illia: and also I've asked this question a long ago, but didn't get the answer; why bounced message size is limited to 224 bytes?  'cause i found it's difficult to rollback changes if contract bounces; if i had the full message, then it would be much easier  do i need to create some sort of dict with queries map<CellHash, MessageCell> to store all outcoming requests and then rollback if I get the message back? (reply to 30538)

Illia: very nice (reply to 30548)

Illia: i just have 6 cross-contract calls and i'm afraid that if at least one fails for some unknown reason, then there's no way to rollback  i'm also concerned that if TON fails for some reason, e.g., the network is congested and all messages become bounced, then my system sucks as there's no way to rollback 6 cross-contract calls properly  of course, TON is reliable and scalable, but risks of failure still can be... (reply to 30552)

Nick: Hey, does anyone want to join our team & project for the TON hackathon ?   https://dorahacks.io/buidl/12513  We’re looking for Tact / FunC developers urgently! Please DM me if interested!

Illia: What's the difference between exitCode and actionCode? Exit code is thrown using nativeThrow, so how to set actionCode in TVM?

Kɪᴍᴏᴠ: You might be referring to these:  https://docs.ton.org/learn/tvm-instructions/tvm-initialization#:~:text=As%20described%20in%20the%20corresponding%20TL%2DB%20scheme (reply to 30574)

Dmitry: Depending on business logic you can also create a multiplier in the master contract (reply to 30253)

Illia: I've noticed that the printTransactionsFees() function from @ton/utils provides some actionCode. As I see, it's the resultCode of the actionPhase. The link you provided doesn't contain info about that or I don't see it. (reply to 30575)

Dmitry: It probably would also require a two step transfer transaction (reply to 30588)

Dmitry: Initiate tx Request master multiplier Receive it and then transfer

️️Vlad: How in Tact inside init() block can we specify  more precise type (e.g. uint32) for int arguments?

Dmitry: You can write a revert yourself  It will revert on assignment to a state  var  You can create a struct with desirable int field (reply to 30608)

— 2024-06-10 —

Tiqan: How do I calculate gas fees?

Johnny Le: check docs of TON, there is a section for gas estimate (reply to 30664)

Tiqan: thanks

Tharun: export async function run(provider: NetworkProvider) {     const firstContract = provider.open(await FirstContract.fromInit(3306n));      await firstContract.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );      await provider.waitForDeploy(firstContract.address);      // run methods on firstContract }  how to deploy this contract using mnemonics ? can anyone plz help me

Aibar: What language is the best to build defi smart contracts on ton?

Illia: No way to deploy though an existing mnemonic.   Your init must take your public key, in this way, it's derived using your mnemonics. Then you can modify the deploy receiver and provide initial values for your init.   Your current contract address is derived from some initial value you provide (your data) and the code of your contract. There is no link to you public key and, therefore, your mnemonics (reply to 30685)

Tharun: how to add the publickey can you send me some docs or examples code

Tharun: @pantemon

Illia: I don't think I have some code for Tact, but the idea behind is the same as for wallet contracts.  This is the simplest wallet on TON (V1)  https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc  You can see that on the line 13, the public key is loaded from get data with seqno.  It's stored with contract init   So you can add init(publicKey: slice)   Then you can modify the deploy message so it sends the correct initial value for your contract.  Deploy { queryId, value }  You will need to remove Deployable trait  Then you receive deploy message, init everything completely, and then just do self.notify DeployOk  I hope you manage implement this. If you struggle, I can help you with the code later today (reply to 30702)

Illia: Depending on your requirements. The easiest way to start is, obviously, Tact. It has good docs, familiar syntaxes and auto-generates wrappers to interact with contracts. However, if you have some specific requests, such as update, that Tact doesn't support yet, or you want to optimize your contract aggressively, then it's probably still FunC.  Tact is like C, but FunC is like Assembly (it's not entirely correct comparison, but effective as it shows the difference from the developer experience point of view) (reply to 30695)

Aibar: We need someone with a strong understanding of ton smart contracts development to get a consultation. Can i dm you? (reply to 30707)

Behrang: I believe a better comparison would be this:  - Tact is like JavaScript - FunC is like C - Fift is like Assembly (reply to 30707)

Aibar: are you a ton developer? (reply to 30716)

Behrang: Yeah, but in FunC.

Ken: I think FunC is a lot more low level than C

Ken: and the FunC compiler doesn't do much optimization

Aibar: can i dm you? (reply to 30719)

Behrang: No, I disagree. I would say that with some syntax similarities like Ruby, it is a little easier than C.  It also has good enough optimizations. For more optimizations you can use Fift inside FunC, like writiing Assembly inside C.   The hard part is learning TVM. (reply to 30720)

Ken: The FunC compiler does a literal translation to Fift in most cases, and even trivial changes such as the order that you do multiple assignments can change the gas usage.

Behrang: I don't think that gas usage is any problem here. Ton fees are already low enough.   These optimization that you talk about, might only matter in competition between differet protocols.   And in that case, you still have options. (reply to 30728)

Ken: that's the definition of "optimization". If trivial changes in code result in different assembly code, then it means the compiler failed to properly optimize one of the two versions. (reply to 30729)

Behrang: This makes FunC predictable. I prefer to know what is going on behind the scene in smart contract development. (reply to 30731)

Dmitry: what do you mean saying "predictable" (reply to 30733)

Tharun: how to switch to testnet network in the wallet

Illia: if you're using Tonkeeper, click to settings and tap on the wallet's version until you get an option to switch to the dev mode. Then go and create a new wallet, but when creating it, specify that this is testnet wallet (reply to 30737)

Tharun: ohh okay thanks

Tharun: now i can able to switch network thanks @pantemon

unsphere: Can you give me a hint on how to extract the following values from the forward_payload slice in TokenNotification?  message ForwardPayload {     query_id: Int as uint64;     amount: Int as coins;     receivers: map<Int as uint16, Address>;     comment: String; }  in js i can get it like that:  const query_id = forwardPayload.loadUintBig(64); const amount = forwardPayload.loadCoins(); const receivers = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.Address(), forwardPayload); const comment = forwardPayload.loadStringRefTail();  but how to do the same in tact?

Aish: Hey guys, new to ton.   I am creating a Jetton and a receiver contract in tact.  How can a contract receive jetton token and make sure that that the receiving contract is getting notified by the jetton created by me?  Also how can we add the metadata to a cell, what is the format for cell data in tact.

Behrang: "Ken M" said that it would be good that compiler optimizes code in such a way that small changes are automatically applied to improve gas usage.  This makes the generated code somehow unpredictable. After all, another "improved" code is generated and placed there, and I as a developer/reader/auditor cannot easily guess what Fift (assembly) code is generated behind the scenes. (reply to 30736)

Dmitry: it seems that try catch does not work in loops

Anton: What output do you expect and why? (reply to 30775)

Dmitry: i guess that it should go to the catch block and then enter the next cycle

Dmitry: but it falls

Dmitry: am i wrong? (reply to 30798)

Nerses: how can I convert from String to Slice ? I used Builder for it,but for long  Strings i get BitBuilder overflow

Dmitry: https://docs.tact-lang.org/ref/core-strings#stringasslice (reply to 30801)

Nerses: thanks a lot,but it seems I described the problem not well,my blame (reply to 30803)

Nerses: I use this code to parse message             const data = result[1];             const buffer = Buffer.from(data, 'hex');             let builder = new Builder();             builder.storeBuffer(buffer);             const slice = builder.asSlice();             console.log(functionMap[result[0]](slice));

Nerses: data has type string in typescript but for parametr functionMap I should pass slice type variable

Dmitry: https://ton-org.github.io/ton-core/classes/Builder.html#storeStringTail  ? (reply to 30805)

Nerses: i used this one,as from typescript string I convert to Buffer to pass this function as parametr https://ton-org.github.io/ton-core/classes/Builder.html#storeBuffer:~:text=Builder.ts%3A83-,storeBuffer,-storeBuffer( (reply to 30807)

Dmitry: > Overridden function "foo" can not be a getter  is there a reason behind this?

Dmitry: and it does not make an error in trait code

Davis: I tried deploying Jetton and creating liquidity on Stonfi, but why is the pool only created with the minimum amounts of TON and TESTT?

Nerses: let builder = new Builder();             builder.storeStringTail(data);             const slice = builder.asSlice();             console.log(functionMap[result[0]](slice)); i changed code like this,but now i get invalid prefix is it possible storeStringTail can modify the string ? (reply to 30807)

Illia: Can I use accept_message with the internal message? What if I want to make a contract to pay for the transaction? Or it's valid for external messages only?

Dmitry: as i understand it: that is the case already (reply to 30864)

Dmitry: but you need gas to send tx from your wallet

Aleksandr: should work. (reply to 30864)

Illia: Minimum amounts of TON and TESTTT mean minimum amounts of tokens you can swap. It means that you cannot swap less than 0.00...1001 TON and you cannot swap less than 0.00...111611 TESTTTT (reply to 30823)

Dmitry: your wallet is the "culprit" (reply to 30876)

Dmitry: and, to say more, you should revert if you dont want such thing to happen (reply to 30864)

Illia: thanks for responses, your bets accepted, gentlemen; i'll build a demo and let you know the result

Dmitry: require(context.value >= txCommission, "pay the gas")

Illia: no, i don't mean this case, I mean the case when someone sends an internal transaction with let's say 0.001 TON, but to execute the receiver, it's needed, for example, 0.2 TON  so if i can do accept_message, can I refund 0.001 TON back to the sender and then process the rest of receiver using  i understand that this is the case for external messages, but is it possible if the message is internal? (reply to 30882)

Dmitry: it is the case (reply to 30883)

Dmitry: you automatically accept

Dmitry: and you CAN revert

Dmitry: if you want it to refund cash you can send a message (reply to 30883)

Dmitry: value: context.value;

Illia: i can revert, but if receiving the message costs 20 ton, but the sender attaches only 0.001 ton, transaction will be reverted isn't it? (reply to 30888)

Dmitry: (i guess youd better remove send remaining flag etc)

Dmitry: if your contract has 20 ton — nope (reply to 30892)

Illia: hmmm (reply to 30894)

Dmitry: (and there is some thing about block size so imnot sure about unlimited gascost like 20 ton)

️️Vlad: What's the purpose of interface(name)? I've seen its usage in stlib traits but couldn't find info about it in the docs.

Tiqan: Can someone tell me why this is not sending?  send(SendParameters{             to: self.jettonAddr,             value: 0,             bounce: false,             mode: SendRemainingValue | SendIgnoreErrors,             body: TokenTransfer {                 query_id: 0,                 amount: 500000,                 destination: sender(),                 response_destination: sender(),                 custom_payload: beginCell().storeUint(0, 1).endCell(),                 forward_ton_amount: 1,                 forward_payload: beginCell().storeUint(0, 1).endCell().asSlice()             }.toCell()         });

Illia: @expectfun (reply to 30924)

— 2024-06-11 —

Daytona project: How i can get nft creator address?

joe: hi, i have read the docs of tact language.I find the dust and ston-fi are listed in the cook book.however, i can't find the contract code using tact. can anyone help share the link?

Anton: there is no link atm (reply to 30982)

Daniil: what kind of an error do you get? (reply to 30907)

unsphere: is jettonAddr the jetton address or the contracts jetton wallet address? you need to send it to the wallet address (reply to 30907)

Nerses: I have two versions of parsing the data one is this  let builder = new Builder();             builder.storeStringTail(data);             const slice = builder.asSlice();             console.log(functionMap[result[0]](slice));    and in second one i create buffer from data and then use storeBuffer. In buffer case it pareses correctly in case size of data isnt huge but stringTail case it parse incorrectly. So what can cause this ,any hints or 'predictions' ?

Danil: wtf with this

Danil: https://docs.tact-lang.org/book/receive

Truong: receive not recieve (reply to 31020)

Danil: omg

Danil: sry

Danil: 😅

Anton: that’s a spelling issue (reply to 31020)

Rustacean: Hi guys, I want to ask if Tact is ready for production (available/compatible with TON mainnet) yet? Are there any working smart contract written in Tact deployed on TON mainnet?

Behrang: ton.vote (reply to 31036)

Nerses: i have such code             // version 1             let builder = new Builder();             builder.storeStringTail(data);             const slice = builder.asSlice();             console.log(functionMap[result[0]](slice));              // version 2             let builder2 = new Builder();             let buffer = Buffer.from(data,'hex');             builder2.storeBuffer(buffer);             const slice2 = builder2.asSlice();             console.log(functionMap[result[0]](slice2));  version2 works but version1 doesnt work.What can cause that ?

Nelson: Any new news.   What work I gave myself in these months...

Rustacean: I can't find their source code, is it public, ton-vote-contracts-sdk repo only contains funC files (reply to 31055)

Rustacean: Ah nevermind, found it. Sorry

Smart: hello, can you help please, i am stuck how to send message type:       $$type: 'Transfer',       new_owner: newAddress,       queryId: 0n,     }         const payload = beginCell();    payload.storeStringTail(internalMessageBody.new_owner).storeUint(internalMessageBody.queryId,32);      let result = await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: contractAddress,         value: "0.03",         body: payload.endCell(),          bounce: true,                },)     ],     sendMode: 1 + 2   });   it is ok when message as comment, but i dunno howabout $$type

Illia: Is it possible to 'unimplement' BaseTrait from the contract?  I like forward, notify, reply, but I wanna change the way it calculates reserved amount of Toncoin so that the contract can collect fees for the owner (i wanna collect a small fee on each request to the contract, but the rest value of the message is passed next to another contract so it doesn't state at this contract)

Illia: thanks! (reply to 31138)

Illia: Can I break the foreach loop? Cause if I use return inside the foreach, it will stop my receiver?

Illia: I've also heard somewhat about local fee markets on the TON blockchain. Does it mean that if I will be sending lots of messages to a specific contract, the gas price for this contract will go up? Or am I mistaking this from other blockchains?

Illia: A corresponding link to the docs will be very much appreciated (reply to 31146)

— 2024-06-12 —

John: @ryandennislive please reply to my private message Sir 🙏

Howard: why so many Ads OMG

Howard: It's just the way we previously explained in the output folder after you compiled the Tact language. (reply to 31127)

Baldwin: I am a front end developer, how do I know if a transaction was successful or failed sir?

Illia: That's a very good question. As far as I know, there is no 'easy' way yet.  This is what you can do with tonweb:  https://docs.ton.org/develop/dapps/ton-connect/react#understanding-transaction-status-by-hash:~:text=The%20principle%20located%20in%20Payment%20Processing%20(using%20tonweb).%20See%20more (reply to 31237)

web-assist 🧀: Hi, how i can convert string address (EQ... or UQ....) to Address

Illia: (if you need to get it programmatically) https://docs.ton.org/develop/dapps/cookbook#working-with-contracts-addresses  (this is just a nice online tool) https://ton.org/address/ (reply to 31244)

Decentralized: anyone knows how to deploy a tact contract to testnet / mainnet, how should we run the example what should be the provider here and how our wallet is determined?  ``` import { toNano } from '@ton/core'; import { SimpleCounter } from '../wrappers/SimpleCounter'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const simpleCounter = provider.open(await SimpleCounter.fromInit(BigInt(Math.floor(Math.random() * 10000))));      await simpleCounter.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );      await provider.waitForDeploy(simpleCounter.address);      console.log('ID', await simpleCounter.getId()); } ```

Decentralized: there's no method to inject the provider which should be a signer? any example to run this code (reply to 31248)

web-assist 🧀: i need to do it in smart-contract (tact) (reply to 31245)

cindy: Hi, If i needs to upgrade the contract on TON, and holds the data on the contract the same, how i can deploy the new contract?

cindy: I am not sure that whether the data of the contract is still on there.If i depoly it again,is the data lost?how can i avoid it?

Mahima Thacker: Hey guys, how to add buy/sell functionality in the tact nft collection contract? Is there any example out there on this?

Illia: Well, UQ is non-bounceble address whereas EQ is a bounceble  What do you want to achieve by deriving a non-bounceable address?   You can simply do send() with bounceble: false and mode SendIgnoreErrors (reply to 31250)

Illia: Provider cannot be a signer because it provides interface to the network API  You need to create a deployer account who will initiate the deployment (reply to 31249)

Key: Can someone give me the template nft marketplace source code with Tact?

Tharun: can any one tell me on tact language when can able to send coins using another address not in signer address

Baldwin: 300 usd for it :v (reply to 31308)

Baldwin: what do u mean? (reply to 31309)

Tharun: i have another address from that address i need to send coins not from the existing address (reply to 31315)

Baldwin: "have another address from that address" don't unsderstand

Tharun: i have two wallet address 1st address is the signer address from the second wallet address i can able to send ton coins

Tharun: using the privatekey or mnemonics

Tom - Bushi: when writing tests in blueprint is it possible to 'name' addresses so that in the logs they are easily recognizable?

Illia: that's very good question; the short answer is no; but i'm currently writing a script that can sort it out; i'll send it to this group by the end of today (reply to 31351)

Tom - Bushi: amazing! thank you, that would be very useful (reply to 31352)

Baldwin: So please code yourself, my friend :)) (reply to 31308)

Vitalik: HI. Who can help with connecting Highload Wallet v3?

Tom - Bushi: followup question to blueprint testing. When I send a transaction and await the result, does it wait for all messages to finish and all steps to be completed?

Danil: No

Tom - Bushi: that is starting to make some sense then 😄 so if I have 2 contracts. I send a message to contractA which sends a message to contractB. How can I inspect the second message and test its contents?

Tom - Bushi: or if I want to check the state change on contractB, how can I know that the full process has been completed before I get the data and test its correct?

Sumit: when a jetton is burned, who is the sender of the jetton burn notification to response destination?

— 2024-06-13 —

Decentralized: anyone know how to let deployer of contract to send some ton along with deployment and store in the contract? and how to send from a contract to a wallet address?

Key: Where can I find an online smart contract development environment with TACT like Remix for Ethereum or PlayGround for Solana ? Help me

Nick: Hey, how can we get historical on-chain data? How would i find how many transactions are emitted from a contract a day ?

Illia: There is no such feature. If you want to use historical data, you need to publish it yourself (reply to 31475)

Illia: Are you using Blueprint?   https://tact-by-example.org/03-receive-coins (reply to 31456)

Aish: Suppose I have a transaction that requires multiple message passing (like 7 or more). How do I make sure from the begining that the transaction won't bounce in between because of low gas?

Tom - Bushi: I had a similar question and the suggestion was to send a lot more TON than you think necessary and refund it at the end (reply to 31544)

Aish: Thank you.  But if you have some 7 interactions in between and got bounced due to some other reasons, at that time whatever that was passed as value(gas) will get stucked in the immediate caller right, it wil not be given back to the user who initiated it. Right  So the user will loose the extra TON.  Is there something that can be done , so users wont loose the extra TON? (reply to 31547)

Ǻřτė₥ | 🔥: hi guys  Who knows where I can find ton mev bots?

Teddo: This seems trivial but I've been trying to get the balance of a contract in my test, can't a way to do it

Nerses: has anyone example how to parse data that is longer than cell size using load*  functions of build file ?

Illia: You can create a getter for your contract called balance that will return myBalance (reply to 31563)

Teddo: Yeah, that's what I did 😂 Thanks for your response (reply to 31580)

Illia: You can validate that input had enough value to cover everything (reply to 31544)

Davis: Hey, How can I read a variable in another contract?

Stuart: hey peeps

Stuart: what are some good video resources for learning about tact and the ton paradigm?

Key: Here is answer to that problem https://tact-by-example.org/03-messages-between-contracts (reply to 31600)

Tom - Bushi: anyone have any tips? https://t.me/tactlang/31403

️️Vlad: To check the message body we're doing this:  From compilation result you'll get load and store functions for your messages   const SESSubscribe = await session.send(       alice.getSender(),       {         value: await session.getSubscribeDeposit(4n),       },       {         $$type: "SESSubscribe",         queryId: 0n,       },     );     logger.logTransactions(SESSubscribe.transactions);  const body = new Builder(); storeSESSubscribeSuccess({       $$type: "SESSubscribeSuccess",       queryId: 0n,     })(body);     const SESSubscribeSuccess = body.endCell();  expect(SESSubscribe.transactions).toHaveTransaction({       from: session.address,       to: alice.address,       success: true,       body: SESSubscribeSuccess,     }); (reply to 31609)

Anton: https://github.com/tact-lang/awesome-tact (reply to 31605)

Stuart: Thanks man

PλVΞL: Hello everyone, I have a question: Is it possible to create a contract that reacts to receiving jetton tokens? For example, I am working on a contract for selling event tickets in exchange for jetton tokens.

PλVΞL: Where should I start? How can I create a handler that takes the number of tokens and an address, allowing me to write this information to the contract array? (reply to 31653)

PλVΞL: and most importantly, can my contract aggregate jetton tokens? in other words, could this contract be some kind of wallet of tokens? (reply to 31654)

Nerses: what for are generated load* functions in build files while compiling tact contract ?

Tiqan: Hey guys, somehow my initOf JettonDefaultWallet returns a different address inside the contract and my test. Anyone knows the reason for that? I didnt found any solutions in the messages before. I only found people having the same issue.

Nerses: If I have map in my contract and I (delete it)assign one of its (key,value) pair null.Is that (key,value) pair still occupying storage ?

Nerses: So I the contract shouldn't pay storage fees for it.Am I right ? (reply to 31727)

Nerses: Thanks (reply to 31728)

Nick: urgently need a FUNC or TACT developer

— 2024-06-14 —

Andrey: Hi, can you send me exmaple, how to put metadata in Jetton before deploy it?

Truong: https://github.com/howardpen9/jetton-implementation-in-tact (reply to 31870)

Nerses: How can i create getter in tact that returns how much storage occupies my contract currently ?

Nerses: In map<Int,Int> from what index will start keys

Narek: it’s a map not an array, so you can use any Int key (reply to 31925)

Nerses: I know,but I was trying to get length of the map by adding every key and then from result get the length with progression formula 🤦‍♂️.I complicated it (reply to 31931)

Nerses: let result: Int = 0;         foreach(key,value in (self.contracts)){             result+=1;         }         return result;     }

Narek: you just need to store length into another state variable (reply to 31932)

Nerses: although for this code i get a syntax error `Syntax error: expected "_", "A".."Z", or "a".."z"  Line 661, col 30:   660 |         let result: Int = 0; > 661 |         foreach(key,value in (self.contracts)){                                      ^   662 |             result+=1;`

怠け者: Hey, guys! help pls! How can I create a Cell for a custom message containing only single one Bool variable?

Nerses: what about writing such getter ? (reply to 31934)

Narek: // this contract records the last 5 timestamps of when "timer" message was received contract Arrays {      const MaxSize: Int = 5;     arr: map<Int, Int>; // this is our array implemented with a map     arrLength: Int as uint8 = 0;     arrStart: Int as uint8 = 0; // our array is cyclic      init() {}      // push an item to the end of the array     fun arrPush(item: Int) {         if (self.arrLength < self.MaxSize) {             self.arr.set(self.arrLength, item);             self.arrLength = self.arrLength + 1;         } else {             self.arr.set(self.arrStart, item);             self.arrStart = (self.arrStart + 1) % self.MaxSize;         }     }      // iterate over all items in the array and dump them     fun arrPrint() {         let i: Int = self.arrStart;         repeat (self.arrLength) {             dump(self.arr.get(i)!!); // !! tells the compiler this can't be null             i = (i + 1) % self.MaxSize;         }     }      // record the timestamp when each "timer" message is received     receive("timer") {         let timestamp: Int = now();         self.arrPush(timestamp);     }      receive("dump") {         self.arrPrint();     }      get fun length(): Int {         return self.arrLength;     }      get fun map(): map<Int, Int> {         return self.arr;     } } (reply to 31937)

Nerses: yeah i think it would be great if i limitted my maps(as computation fees will be higher and higher) (reply to 31938)

Nerses: thanks a lot

Dmitry: pages/book/structs-and-messages.mdx // This Message overwrites its unique id with 0x7362d09c message(0x7362d09c) TokenNotification {     forwardPayload: Slice as remaining; } this syntax was not explained in the book

Dmitry: what does it mean tho :) (reply to 31957)

Dmitry: • am i obliged to define all the fields in "union" traits ( i want to create different interfaces and then merge them to write less when i will write realization). it seems like it • why cant i use "as uintx" in traits • is there a way to create abstract receivers / getters?

Dmitry: 1) like   trait IEntity with IAspect1, IAspect2; (reply to 31961)

Dmitry: why cant i use code blocks here

Dmitry: compilers makes me rewrite all the fields from nested traits into the outer one  trait ILol with IKek, IHeh {   // IKek   owner: Address;    // IHeh   addr: Address; }  so i cannot do just  trait ILol with IKek, IHeh;   or  trait ILOL with IKek, IHeh {}

Dmitry: 2. trait ILol {   number:  Int as uint8; } (reply to 31965)

Dmitry: 3.   trait ILol {   abstract get fun index(): Int; }  contract Kek with ILol {   [override] get fun index(): Int {     return 0;   } }     Overridden function "index" can not be a getter Line 53, col 3:   52 | contract Kek with ILol { > 53 |   override get fun index(): Int {          ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~   54 |     return 0;     or      Function "index" already exist in "Kek" Line 52, col 1:   51 |  > 52 | contract Kek with ILol {        ^~~~~~~~~~~~~~~~~~~~~~   53 |   get fun index(): Int { (reply to 31965)

Dmitry: absence of abstract receiver is sad...  receivers are the true interface for contract interaction so its kinda strange

Dmitry: Abstract function doesn't have abstract modifier Line 5, col 3:   4 | trait ILol { > 5 |   virtual get fun index(): Int;         ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~   6 | } (reply to 31973)

Dmitry: probably one can create abstract function and just invoke it in the receiver (reply to 31973)

Dmitry: ic. thanks. will try (reply to 31978)

Dmitry: also it turns out you cant do  contract Lol with AspectOuter {   override fun doSmth() {   } }  trait AspectOuter with AspectInner {   override fun doSmth(); }  trait AspectInner {   abstract fun doSmth(); }

Dmitry: or as it seems any permutation of such a concept    Overrides functions cannot be abstract Line 83, col 3:   82 | trait AspectOuter with AspectInner { > 83 |   override abstract fun doSmth();          ^~~~~~~~   84 | }      Abstract function doesn't have abstract modifier Line 83, col 3:   82 | trait AspectOuter with AspectInner { > 83 |   override fun doSmth();          ^~~~~~~~~~~~~~~~~~~~~~   84 | } (reply to 31984)

Dmitry: you probably can create a virtual one and override it (reply to 31994)

Dmitry: virtual fun lol(msg: Lolmsg) {require(false, "Not implemented") ;}

Anton: as of Tact v1.3 the traversed map needs to be a simple identifier like foo, so self.contracts is not going to work.  you can do  let c: map<…> = self.contracts; foreach (k, v in c) {  … } as a workaround.  We will lift this restriction in the next Tact release. Hopefully next week (reply to 31935)

Anton: check out Tact docs, our cookbook: https://docs.tact-lang.org/cookbook/data-structures#array (reply to 31937)

Nerses: i have a problem with parsing message. What to do if i get long string with api and dont know in what type of variable to store it (as it overflows) to load data from it bit by bit ? any hints or approaches ?

Dmitry: Function does not always return a result. Adding 'return' statement(s) should fix the issu e. Line 58, col 3:   57 |    > 58 |   virtual fun doSmth(args: DoSmthArgs): DoSmthRetVal { throw(200); }          ^~~   it seems to me that throws / requires should be treated like returns

Anton: requires cannot be treated as returns in general, because those throw on condition (reply to 32020)

Anton: thanks for your example

Dmitry: condition can be a constant  (i understand that there is a better way to use the developers' time) (reply to 32021)

Anton: yeah, but we don’t want to complicate the analysis with a special case like that :) (reply to 32023)

Dmitry: is it a bad idea to have dedicated structs/messages for each function to enforce bit length of ints?  fun doSmth(args: DoSmthArgs): DoSmthRetVal {}     Is there a plan for making args typed with formats? fun doSmth(x: Int as uint8) {}

Anton: nope, fun doSmth(x: Int as uint8) {} does not really make sense, because functions get their arguments from the TVM stack and all integers there are 257-bit ones (reply to 32025)

Dmitry: but runtime checks is still a thing (reply to 32027)

Dmitry: create a runtime check before every function call or smth  it can be suboptimal, but if one wants such a behaviour, he will be doing it ad hoc anyway

Dmitry: *every function call with such argument syntaxis (reply to 32031)

Anton: sure, this is what programming languages are for, to encode and enforce your own rules (reply to 32031)

Anton: if it can be done in the language and does not incur too much performance penalty then it should be done on the user side

Anton: otherwise we are going to have a huge language with too many special cases supported

Anton: @D_M1s5 btw, I opened an issue about throw that you mentioned before https://github.com/tact-lang/tact/issues/421

Dmitry: is there a formatter for tact?

Anton: There are at least two: - the one builtin into Tact VS Code extension - https://github.com/microcosm-labs/tact-tools/tree/main/tactfmt (not sure if this one supports the latest features from Tact v1.3)  And the Tact team is working on our own formatter, but it’s not really ready yet (reply to 32038)

Dmitry: is it ok to have a map<Int as uint16, Cell> where keys are uint14 and cells are full loaded with no refs?   not "great", but ok )))  as far as i get it 2**14 = 16384 and it is less than 30k

Tiqan: does anyone know why a getter works in testnet and sandbox but not in mainnet?

Tiqan: we are currently testing our contract in mainnet and we get error 128 Null reference exception

Denis: Hi, can .tact contract be upgradable (update code/implementation) ?

Made by: yup, https://github.com/Ton-Dynasty/tondynasty-contracts/issues/12#issuecomment-2153116433 (reply to 32061)

Made by: There's no need to deploy new contract in TON. Unlike Ethereum's proxy contracts , TON provides unified way to upgrade your contracts code and data as it's just Cells (reply to 31264)

Stuart: Hey guys im looking for a a Tact (ideally) or FunC developer to translate Solidity NFT and ERC20 project and deploy it on TON. Interested in building a Telegram Mini App as well. Total Solidity LoC excluding OpenZeppelin imports is 300 lines. All code is fully tested with ~1000 LoC in the test suites and roughly 50 tests

Dmitry: got problem with initOf  135  Tact (Compiler)  Code of a contract was not found — false flag for a dictionary call  how is it possible in runtime

Nerses: bounce: true,                     value: ctx.value,                     mode: 0                     });                   self.contracts.del(msg.data.__hashlock);         self.contractLength -=1;  } send operation will be done in the end ? or operations are done from start to end ?

User<7037859753>: Hi guys anyone have mini game telegram bot ?

Decentralized: i need to send from contract to other address, also wonder what's the dev env you guys use? (reply to 31534)

Decentralized: is there a local dev that we can deploy contract and test like solidity

Illia: yeah, take a look  This is an official tact guide on testing https://docs.tact-lang.org/book/debug  These are just links about blueprint if you want something extra https://github.com/ton-org/blueprint https://docs.ton.org/develop/smart-contracts/sdk/javascript (reply to 32087)

Tiqan: Is it possible that maps are not ready for mainnet yet?

Illia: maps are ready for mainnet, but are strongly not recommended as it's hard to predict the costs of gas fees for maps (they depend on the number of key-value pairs, load factor and lots of other factors) (reply to 32112)

Tiqan: What would be the alternative?

Illia: depending on what you want to achieve  if you wanna do nfts or jettons, then standards derive addresses of next indexes (reply to 32115)

Illia: it's like on solana, where you derive where to store the data

Tiqan: I want to store some User Data for an address. My map looks like this:  userInfo: map<Address, UserInfo>; How would you do that without a map

Anton: https://tact-by-example.org/06-unbounded-maps (reply to 32120)

Tiqan: Thanks

Decentralized: how to switch deployment wallet (reply to 32089)

Decentralized: so there's no way to send ton upon deployment, it refunds what's left? (reply to 32129)

Decentralized: wonder is there an example to wrap a provider, contract address and its abi to interact with a contract? (reply to 32089)

Dmitry: can a contract invoke myAddress() at init? ______________________________________________________   console.log     #DEBUG#: [DEBUG] File contracts/contract.tact:29:9     #DEBUG#: ----init     #DEBUG#: [DEBUG] File contracts/contract.tact:31:13     #DEBUG#: ----init@myAddress-0        at SmartContract.runCommon (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:221:21)  ______________________________________________________     init(address: Address) {         dump("----init");         try{             dump("----init@myAddress-0");             dump(myAddress());             dump("----init@myAddress-1");         } catch (e) {             dump("ERROR-----init");             dump(e);         }

Decentralized: hey wonder who is behind tonconnect and where is best to ask tonconnect relevant question, the tutorial and code seems be quite buggy and unusable, e.g. when i use and use same node i get  > ton-connect-bot@1.0.0 run > node ./dist/main.js  (node:481) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time (Use `node --trace-warnings ...` to show where the warning was created) /home//ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:2187             const event = new CustomEvent(eventName, { detail: eventDetails });                           ^  ReferenceError: CustomEvent is not defined     at BrowserEventDispatcher.<anonymous> (/home//ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:2187:27)     at Generator.next (<anonymous>)     at /home//ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:42:71     at new Promise (<anonymous>)     at __awaiter (/home//ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:38:12)     at BrowserEventDispatcher.dispatchEvent (/home//ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:2186:16)     at TonConnectTracker.dispatchUserActionEvent (/home/ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:2309:18)     at TonConnectTracker.trackConnectionStarted (/home//ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:2321:18)     at TonConnect.connect (/home//ton/rp_bot/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:2539:22)     at /home//ton/rp_bot/dist/main.js:35:28     at Generator.next (<anonymous>)     at fulfilled (/home//ton/rp_bot/dist/main.js:5:58)     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)  Node.js v18.1.0

Denis: Hi, is native TON Coin transfer trigger TokenNotification on recipient?

cindy: Thanks for quick reply.If I only want to upgrade the contract and hold the storage,is it possible to do it (reply to 32064)

— 2024-06-15 —

Decentralized: anyone able to set tonconnect's wallet to testnet, i don't have mainnet ton so have to do things on testnet..

Decentralized: is there a way to interact with contract through python?

ecomnazar: hi, who knows the funC language chat, share pls, thanks!

Davis: Hey, When I send a transaction then how can I check whether the transaction is successful or failed?

zhiguo: how to compile local .tact file?

Anton: run tact in your terminal and it will show you (provided you have v1.3) (reply to 32241)

Made by: Sure, here’s the explanation https://github.com/Ton-Dynasty/tondynasty-contracts/issues/12#issuecomment-2153116433 (reply to 32182)

Danil: Hello, anybody have examples for managing jettons?

Danil: for sending them to peoples that's pressing on button at the site

— 2024-06-16 —

Quillen: Hi everyone, I've a trouble when get Jetton contract wallet address inside the smart contract. I'm using the Jetton contract from this source: https://tact-by-example.org/07-jetton-standard, and I'm trying to get the Jetton wallet address from my contract. Here are the details:  In my contract, I get the wallet address with this code:   let init: StateInit = initOf JettonDefaultWallet(msg.jettonAddress, myAddress()); let contractWallet: Address = contractAddress(init); dump("Master: "); dump(msg.jettonAddress); dump("Owner: "); dump(myAddress()); dump("contractWallet: "); dump(contractWallet);  However, when I read the data from the Jetton address, I get a different contract wallet, even though I use the same input for Master and Owner addresses:   virtual fun getJettonWalletInit(address: Address): StateInit {     let init: StateInit = initOf JettonDefaultWallet(myAddress(), address);     let contractWallet: Address = contractAddress(init);     dump("Master: ");     dump(myAddress());     dump("Owner: ");     dump(address);     dump("contractWallet: ");     dump(contractWallet);      return initOf JettonDefaultWallet(myAddress(), address); }   You can find more details and reproduce the issue by running the tests here: https://github.com/quocle108/ton-tact-test. Below is the test debug output:  console.log     #DEBUG#: [DEBUG] File contracts/ton_tact_test.tact:31:9     #DEBUG#: Master:      #DEBUG#: [DEBUG] File contracts/ton_tact_test.tact:32:9     #DEBUG#: EQA9sBJca1njccs9ax9-d1jXe--kH8xYM7AC-X7UTT3DWp0x     #DEBUG#: [DEBUG] File contracts/ton_tact_test.tact:33:9     #DEBUG#: Owner:      #DEBUG#: [DEBUG] File contracts/ton_tact_test.tact:34:9     #DEBUG#: EQAc9BddkOwhmwhEmt5YlxXsVnUQreiXpB8GI0dgFqsqRbTZ     #DEBUG#: [DEBUG] File contracts/ton_tact_test.tact:35:9     #DEBUG#: contractWallet:      #DEBUG#: [DEBUG] File contracts/ton_tact_test.tact:36:9     #DEBUG#: EQCd6YhGbUWl14PtxYRwVW7brztYBGTPU6j3iX-r-3B3LBxu        at SmartContract.runCommon (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:221:21)    console.log     #DEBUG#: [DEBUG] File contracts/jetton.tact:110:9     #DEBUG#: Master:      #DEBUG#: [DEBUG] File contracts/jetton.tact:111:9     #DEBUG#: EQA9sBJca1njccs9ax9-d1jXe--kH8xYM7AC-X7UTT3DWp0x     #DEBUG#: [DEBUG] File contracts/jetton.tact:112:9     #DEBUG#: Owner:      #DEBUG#: [DEBUG] File contracts/jetton.tact:113:9     #DEBUG#: EQAc9BddkOwhmwhEmt5YlxXsVnUQreiXpB8GI0dgFqsqRbTZ     #DEBUG#: [DEBUG] File contracts/jetton.tact:114:9     #DEBUG#: contractWallet:      #DEBUG#: [DEBUG] File contracts/jetton.tact:115:9     #DEBUG#: EQCvc-h9jpX2MZYTQuoJeDG_r7hM3NEDVhJnEAedftvYPL6N  Any help would be greatly appreciated!

Quillen: did you find the answer? (reply to 31702)

Quillen: did you have the answer, i have the smae issue (reply to 26671)

Creator: You probably import contract wrapper from another dir. When we write contracts in Tact, when compiled, they are linked to the code of the contracts that we use. If you use this approach, then you need to import contracts from the same compiled folder. But if you want to use token contracts without being tied to the token code, and for example use jUSDT tokens, you can consider requesting the token address from the master contract in your contract. I did it like this:     send(SendParameters{             to: self.jetton_master, // sending message back to the sender             value: simple_message_request,              body: ProvideWalletAddress{                 query_id: 0,                 owner_address: myAddress(),                 include_address: false,             }.toCell(),         });   And do receiver like this:   receive(msg: TakeWalletAddress) {         let ctx: Context = context();         if (ctx.sender == self.jetton_master) {             self.jetton_wallet = msg.wallet_address;     } (reply to 32416)

User<6219485322>: 10

Tiqan: Could you please share a sample Repo to that? (reply to 32419)

Creator: Cant. You can find example here: https://www.youtube.com/watch?v=CUQa_6NwcyI&list=PLyDBPwv9EPsAJpR7R0cC4kgo7BjiMmUy7&index=10 (reply to 32472)

Tiqan: Now i need to learn russian haha

Creator: You can find this tutorial in English. (reply to 32475)

Tiqan: Ok

User<6923299204>: Is there any way in TON to burn tokens? How to send tokens to zero address to burn them?

User<6923299204>: I didn't find the English version (reply to 32476)

Creator: You should see source code of this repo) Or study russian (reply to 32488)

— 2024-06-17 —

cindy: Hi,since  contract addresses on TON are derived from the initial code of the contract and the initial data of the contract(the arguments of init), my question is that: 1、if two contracts are same with the code and the initial data, are the contract address the same? 2、If i(user B) deployed it on the ton,will it override the contract deployed by user A?

cindy: The examples of TACT is perfect to study.thanks for the effort of the team.

TMT: is there an lsp server for tact language?

Anton: there is one in https://github.com/tact-lang/tact-vscode and there is an extracted version: https://github.com/novusnota/tact-extracted-ls (reply to 32644)

andrew: may I ask contract questions here? it got deleted immediately

jay: Can contracts written by tact be put into production?

jay: It has always been an experimental and is more concerned

andrew: Hey guys how you doing? I'm a total newbie here and just deployed my first mainnet contract, which send back all remaining ton back for every interaction. But the issue now is, every time it sends back fund with code 130 and bounce, what's wrong here? I tried everywhere even ChatGPT, still couldn't fix it after over a dozon deploys.... Anyone could help me please?

andrew: contract ProcessTransactions with Deployable {     deployer: Address;     const MinTonForStorage: Int = ton("0.004"); // enough for 1 KB of storage for 1 year      init() {         self.deployer = sender();         emit("Launched".asComment());     }      receive() {         let currentBalance:Int = myBalance();         let receivedValue:Int = context().value;         let minRequiredBalance:Int = self.MinTonForStorage;          emit("Your Ticket Punched".asComment());         emit(currentBalance.toString().asComment());         emit(receivedValue.toString().asComment());         emit(minRequiredBalance.toString().asComment());

andrew: // Ensure the contract retains enough balance for storage         let sendValue:Int = currentBalance - receivedValue - minRequiredBalance;                  if (sendValue > 0) {             send(SendParameters{                 to: sender(),                 bounce: true,                 value: sendValue,                 mode: SendRemainingValue | SendIgnoreErrors,                 body: "Hello, Astronaut!".asComment(), // comment (optional)             });         } else {             emit("Insufficient balance to send".asComment());         }     } }

andrew: I'll delete if this bothers you, sorry for any inconvenience...

Creator: Hi. Possible you fill the code or data cells incorrect. Or you deploy to bounced address.  how do you deploy? (reply to 32664)

andrew: I used "npx blueprint run" to deploy to mainnet

andrew: here is on of the contract I just deplolyed - EQC-RgAjZAs3xhEUQQYssF1vjsM_HFvqlUDkp9e72g_03UgI

Creator: Invalid incoming message — no suitable operation is found (reply to 32672)

Creator: Invalid op code

andrew: oh I send ton to the contract address, and that's wrong? lol

andrew: I should be just sending an empty message and it should work, if that's what you mean?

Creator: I don't know for sure, I need to dive deeper. But Im 130 code is invalid op code.  You can rewrite you  receive()  to  receive(msg: Deploy) and  try this approach

Creator: Also you can use testnet)

andrew: Thank you so much! I'll try it now! (reply to 32677)

Nerses: to: sender(),                     bounce: true,                     value: ctx.value,                     mode: 0                     });         }            self.contracts.del(msg.data.__hashlock);         self.contractLength -=1;       }  in this code which order will be executed the code ?

Illia: 1. yes, that's how you can find already deployed contracts from Init (if you don't know the address)  2. no, as it's already deployed (reply to 32633)

Illia: that's a good question, I think yes, don't see a reason why not, i've recently laucnhed mine in testnet, I'm going to launch mine in the mainnet next month (reply to 32660)

Illia: There are different stages when executing contracts with TVM.  Some of them are the compute phase and the action phase.  In your code, when it's executed, it's in the compute phase. The action of sending a message is recorded in the c5 register containing actions. Then you delete something from the contract dictionary and decrement its length.  The action itself is sent after the compute phase, hence it's sent after you update your storage.  However, if you will be sending 2 messages where each message has the mode SendRemainingBalance, then the first message will send all the remaining balance and the second one will just send 0 (because you have already decided to send all the remaining balance with the first message)  There are more info on TVM phases on the following page:  https://docs.ton.org/learn/tvm-instructions/tvm-overview (reply to 32695)

Nerses: the problem is that in send I use some data from the dicitionary which is deleted further. So I guess it is deleted before the send and as ther is no data transaction isnt done. Am i right ? (reply to 32701)

jay: I was aware that Tact would compile to Func, but I had concerns about the compiler's stability. (reply to 32697)

Nerses: how can i 'force' compiler to do certain line of the code in the end of all computations ?

Illia: Tact has evolved a lot since the first announcement was published; if that's something critical, then I think it's still better to write in FunC; but if your ultimate goal is quick 0 to 1, then Tact is great;   For example, I managed to build within a week a contract system of 3 with Tact; building such a system with FunC would take me at least month... (reply to 32706)

Stuart: how do i get the balance of an address from my test suite?

Stuart: Example

Stuart: do you do development work for other people? looking for dev partners (reply to 32728)

Illia: Do you have a bug with that?  It should not work as you describe, to my knowledge. That's because you compute what to send when your dictionary still has data that you delete later. The action is sent later, but what to send is calculated before you delete the data. (reply to 32702)

Illia: Can you elaborate on that? As far as I am concerned no event can execute some code after each received message. If you're focused on receivers, then you can write a wrapper around the send function so that it executes some action every time you send a message (reply to 32714)

Dmitry: how does "init" maps into func code?  some builtins don't work in init block  myAddress initOf

Nerses: i wanted some solution because of previously described problem.I thought it will be fixed if i force compiler to delete the dicitionary data in the end.I have sent message with higher amount now it succedede but before it it neither failed nor succeded.I should do some more tests oon it (reply to 32735)

Illia: const contract = await blockchain.getContract(address); console.warn(contract.balance); (reply to 32729)

Illia: i do part-time, DM me if you have specific request (reply to 32732)

Illia: I have contract called Broker  If you build your contract and then explore its code, you can find the following:  slice $broker = $global_contractAddress(($brokerStateInit'code, $brokerStateInit'data));  this is what contractAddress compiles for.  initOf is compiled into:  var ($brokerStateInit'code, $brokerStateInit'data) = $Broker$_init_child(__tact_context_sys, my_address(), $response'stream);  Instead of $Broker$ you will have $<YourContractName>$ (reply to 32738)

Illia: Oh I see, gas is such a tricky one to handle.  I have a nice logger, which helps me debug my contracts, I shared it before with some members of that chat and will upload it later today so it will be easier for you to debug your contracts (reply to 32739)

Nerses: it would be great.thanks a lot (reply to 32753)

Stuart: this works for things that arent contracts too? (reply to 32749)

Stuart: because im trying to get the collection owners balance, not the collection contract

Illia: Ultimately, treasury is a contract (Treasury Contract). The collection's owner is defined as treasury in your tests. Therefore, my code snippet works for your case as well because it gets balance of an arbitrary contract, including  Treasury Contract (reply to 32760)

lin: How can TACT obtain the address of the current contract

Stuart: send me the code (reply to 32798)

Stuart:  let nft_init: StateInit = self.getNftItemInit(self.next_item_index);         send(SendParameters{                 to: contractAddress(nft_init),                  value: msgValue,                  bounce: false,                 mode: SendIgnoreErrors,                 body: Transfer {                     query_id: 0,                     new_owner: sender,                     response_destination: self.owner_address,                     custom_payload: self.collection_content,                     forward_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: nft_init.code,                 data: nft_init.data             });

Stuart: because i think you can just do soemthing like this

Stuart: contractAddress(nft_init)

Stuart: Does tact have plans at abstracting the send(SendParameters)) paradigm into something that feels more like a function call?

Stuart: Its really verbose and redundant

Aleksandr: But it is not a function call in any way😀 (reply to 32803)

Stuart: Sure but youre sending messages to things that recieve those messages

Stuart: and then process them

Stuart: in a lot of ways, it 'feels' the same as a public function in solidity

Stuart: which is basically doing the same thing, albeit synchronously

Stuart: Like this has three sends that are essentially doing RPC on another contract

lin: contract SampleTactContract with Deployable {     owner: Address;     counter: Int;     init(owner: Address) {         self.owner = owner;         self.counter = 0;     }     fun add(v: Int) {         let ctx: Context = context();         require(ctx.sender == self.owner, "Invalid sender");         self.counter = (self.counter + v);     }     receive(msg: TokenExcesses) {         self.add(msg.queryId);     }     receive("increment") {         self.counter = self.counter + 2;         if (self.counter == 6) {           self.counter = 0;           self.reply("incremented".asComment());         }         if (self.counter > 10) {           self.counter = 0;         }     }     get fun counter(): Int {         return self.counter;     }     get fun get_address(): Int {         // todo         return self.address;     } } (reply to 32799)

lin: This is my code. I want to return the address of the current contract at the last position (reply to 32819)

Stuart: https://docs.tact-lang.org/ref/core-common#myaddress (reply to 32819)

Stuart: Try this

lin: Yes, he seems to be able to solve my problem. Thank you (reply to 32823)

Stuart: np!

Dmitry: myAddress() (reply to 32798)

mordecai: gm guys

Maxim: Hi guys, I have a question  When i deployer contract, i pay ton for  deployment, but when i lookup contract address on blockchain, balance of contract is set to 0, why?  where goes deployment payment

Illia: What contract are u deploying? And where are you deploying it? (reply to 32896)

Maxim: testnet, same behaviour in tests (reply to 32897)

Maxim: thx) (reply to 32898)

Maxim: one more question, i have this func in tact  receive("add") {}  how can i call it from tests like  const initialBalanceResult = await deployer.send({     value: toNano(lotteryInitBalance),     to: lottery.address, });  it other words how to call string functions from tact  UPD: adding comment to msg.body  body=beginCell().storeUint(0, 32).storeStringTail('add').endCell();

MyName: Hello everyone! Is query_id a random int or smt? Or it is like a hashsum of message data?

MyName: In example in InternalTransfer message in Jetton standart

Dmitry: It is whatever you want it to be to distinguish between queries (reply to 32928)

Illia: query_id is just a number for your convenience, it's like a convenient way to track queries in distributed systems (reply to 32928)

Andrew: Hi, I'm from solidity and have a question. When I sent a transaction, how do I get the information? In the transaction, I create a deal and define an ID. HOW do I get this ID?  In solidity, the method could return this value to me, but how to do it on the TACT?  Thx

MyName: You can implement a getter fun and track the differense at init state i think, idk (reply to 32937)

Andrew: as an option But if there will be many users, then I need a lot of checks to find exactly his transaction (reply to 32939)

Vitor: Send the message, have the contract process the message, "emit a log", use indexer to get the difference. (reply to 32937)

Vitor: Also, don't do unbounded state, TVM is fairly different from the EVM.

Vitor: What is a sensible contract design on the EVM might not be on the TVM.

Vitor: See the Jetton design for a comparison.

MyName: Btw, is there analogue of initOf in Solidity? (reply to 32943)

Vitor: Triple quote tact new line code here triple code will format it properly:-D

Vitor: You send the message. It's async. Then you check for the side effects.

Andrew: it's a bit difficult for me to adjust)  I sent, "await" is waiting for execution and I see a large response object. However, there is no message body 'body: self.lastId,' (reply to 32951)

Vitor: Await will wait for the first message in the chain, not for the entire execution. Messaging passing is not a function call. Watch a transaction go through on Tonviewer. Your message "returns" but execution barely began. Sorry, I'm a bit tired and not that clear, I know

Andrew: I`m undersand, thx  I added an emit and saw a new object in the res.externals. I understand that this is what I transferred to the emit, but the format of the cell? How I can format to string (any human format) (reply to 32958)

Vitor: In JS? https://docs.ton.org/develop/dapps/cookbook#writing-comments-long-strings-in-snake-format (reply to 32960)

Andrew: yep  If this is a test and I want to check the result. Isn't there any native way to get the string? (reply to 32961)

Vitor: That's the native way so far, take the cell, convert to string. DevEx on TON is not on post with Ethereum tbh. Tact is a massive leap forward from FunC, but testing tooling etc ain't as nice. (reply to 32962)

Andrew: oh, okay Thx 🤝 (reply to 32964)

— 2024-06-18 —

lin: forward_payload: beginCell().storeUint(630424929, 32).storeAddress(pTon).storeCoins(msg.amount).storeAddress(myAddress()).storeUint(0, 1).endCell().asSlice(),   May I ask if there is any problem with writing forward payload like this? The result is *exit code 8, cell overflow*

Decentralized: is there any doc on how to dev locally and write unit test

Bluebird: Is Tact ready for production ? Can I use it in my product?

Anton: https://docs.tact-lang.org/book/debug (reply to 32996)

Frances: Hi, guys!, in ton ecosystem, is there equivalent of "subgraph" for data indexing?

Stuart: so as i understand, ctx.value is the total value of the message, right?

Stuart: unlike in solidity where there is gas, which is value, and value, which is value but not used for computation

Stuart: in tact the two values are together in one

Stuart: yes?

Stuart: so i have to pull out the compute fees from the message value if im, lets say, running an nft auction and want to make sure that the message has 1 ton minus the compute fees before minting an nft

Stuart: Cool that’s what I thought

Stuart: How do I extract the fees?

Stuart: Because as I understand, I should be able to inside of a contract right

Никита Колодин: Hello. I want to test the contract deployment via testnet tact and blueprint. For every deployment of tonkeeper, mytonwallet or tonhub, the testnet of wallets gives an invalid address error. I activated the wallets and sent testnet ton there. What could it be related to?

Vitor: Look at message modes and flags to handle fees being sent and the remainder being returned: https://docs.ton.org/develop/smart-contracts/messages#message-modes. If you actually need the _numerical_ value of used compute in that point in time, I'm not sure you have it available during compute phase (since action phase costs would not be calculated at that point in time) (reply to 33057)

Stuart: interesting (reply to 33063)

Stuart: thanks

Stuart: i think ill go thru the ton academy videos to understand the architecture more

Stuart: like i get what tact is doing, but i need more to understand the lower level of whats happening

Stuart: also whats with all these structs and messages that are just reencapsulations of the structs

Stuart: i feel like tact could make the recieve / message flow much more like RPC

Vitor: https://stepik.org/course/176754/promo it's a good dive into the TVM. (reply to 33068)

Stuart: already there lol

Vitor: Yeah, Tact is a million times better than FunC, but it definitely could be even better.

Stuart: agreed

Stuart: i wish it was a bit more like a regular language, abstracting out some of the common design patterns that i see

Stuart: like send(sendParameters())

Stuart: i feel like this could be much more like an RPC call / function call while still informing the developer that its a message going out

Vitor: To be honest the code base is not hard to understand and Anton and the team are quite open to PRs. If you have a suggestion, maybe propose it as a issue on GitHub?

Stuart: Good idea

Stuart: i wrote a python smart contracting language in my last startup

Stuart: so hopefully they take me seriously hahahhaha

Vitor: Targeting the EVM? Vyper-ish?

Stuart: https://github.com/lamden/contracting

Stuart: sandboxed python

Vitor: Ah, the dudes are fine. I had zero experience contributing to compilers before and they are always nice enough to review my PRs.

Vitor: There is a dead project out there for doing Python -> FunC, I can't recall the name. I'd also enjoy a more Pythonic language.

Stuart: agreed

Stuart: i mean tact isnt horrible

Stuart: there are just some annoying parts

Stuart: and the testing framework for ton is really annoying as well

Stuart: imo most of the concepts that are unique to ton should be abstracted and made to 'feel' like a regular language while still giving the gaurentees that ton gives you

Stuart: if there were a few abstractions in tact, it would be perfect because its really clear and clean for the most part

Vitor: Yeah... I have been looking into an open source project to contribute, the more I hang around, the more I think a *good* testing framework might be best way to make an impact into the ecosystem. (reply to 33092)

Stuart: i would be interested in helping out there

Stuart: i also wrote my testing framework

Stuart: you could write shit in python and test it in the same file

Vitor: https://github.com/tact-lang/tact/issues/210 is the way to go for unit test, IMHO. (reply to 33099)

Stuart: this would be dope

Stuart: kind of like foundry forge for solidity

A: guys, quick question. If I am making any contract should I care to maintain it’s positive balance on this blockchain? I mean I heard that contract pays for it’s own storage on a subscription basis and then it has no balance it would be removed from the blockchain?

Stuart: @vitorpyb do i just take a pr out for tact or is there an ERC type proposal scheme

Vitor: I don't think there's an EIP-like system yet for Tact (there's TEP for the core code). I would just draft an issue and wait for feedback before coding a PR. (reply to 33105)

Vitor: Yes, there's the equivalent of "state rent" and smart contracts have to pay for storage costs. (reply to 33104)

David: Hi guys, I got error code 9. Under flow  when sending Jetton from smart contract to user wallet, any idea why?

David: Usually why, do you know? (reply to 33120)

Stuart: @vitorpyb https://github.com/tact-lang/tact/issues/433

Stuart: check it out

lin: forward_payload: beginCell().storeUint(630424929, 32).storeAddress(pTon).storeCoins(msg.amount).storeAddress(myAddress()).storeUint(0, 1).endCell().asSlice(),   May I ask if there is any problem with writing forward payload like this? The result is *exit code 8*, *cell overflow*

Don: Hi guys. I'm new to tact. I was wondering if there is a tool I can use to bootstrap a new tact project. One that comes with boilerplate, testing and deployment? Thanks

Mikhail: Its called blueprint (reply to 33128)

Don: Oh thanks I'll check it out. (reply to 33130)

Никита Колодин: guys, this is purely a problem in intellij idea in visual code it works fine (reply to 33062)

Nerses: If my contract get message consisting of maps and I dont know length of it.How can I parse that data ?

Vitor: Did you send the data yourself? Just serialize the message with the length. (reply to 33143)

Nerses: I need to parse arbitraray message of that type (reply to 33144)

Mahima Thacker: Hey guys, I am facing an error called:- Unsupported item type: tvm.stackEntrySlice     at parseStackEntry (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:284:19)     at Array.map (<anonymous>)     at parseStackItem (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:316:34)     at parseStack (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:326:20)     at TonClient.runMethod (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:45:49)      I am trying to get the function data using TonClient:-   const items = await client.runMethod(collectionAddress, 'get_market_item',[   { type: 'int', value: 0n}   ]);   console.log(items);   And here's the tat contract code:-      struct MarketItem {         index: Int;         nftContract: Address;         seller: Address;         owner : Address;         price : Int;         isListed: Bool;         sold: Bool;     }      sales: map<Int, MarketItem>;     get fun get_market_item(item_index: Int): MarketItem? {          return self.sales.get(item_index);       }  So can anyone tell me what could be the issue here?

Nerses: is there way to know how much memeory occupies certain contract ?

Maxim: Hi, how can i send message with amount to cover transation fees,       send(SendParameters{         to: ctx.sender,         value: 0,         body: "You win!".asComment()     });  this doesnot work because message cant pay for gas fees, but i want similar behaviour

Kirill: Hi, everyone! Could you help me, i want get 1 ton, and send 0.3 ton to user, which invite. Do I understand correctly, if i send message with value 0.3 and mode SendIgnoreErrors, then user get less ton, then 0.3?

Kirill: I understand that I can send a little more and then the user will receive how much he owes, but I don't want to send too much

Nerses: is there any lib in typescript for parsing messages which have fields map  ?

Nerses: so what to do in that cases ? have you incountered such problem ? (reply to 33188)

Mikhail: you can use SendGasSeparately for these types of messages (reply to 33182)

Mirka: Hey, moderation?

Mirka: /report (reply to 33204)

Dmitry: This group is unusable now. Please integrate @banofbot or some alternative so the community can ban all of these annoying bots by voting

MyName: Can someone kick this guy (reply to 33224)

MyName: Unfortunately. (reply to 33233)

Tiqan: How much gas does one require cost?

MyName: F**k off please (reply to 33253)

MyName: Noone follows your scam here

MyName: Ok.

Nick: Scam

HARKI: Hi

Boris: Guys, we are looking for designers, which are familiar with the industry, to help out on the marketing side as well as for the product (for different kind of graphics, like onboard etc.)  This is the project to support:   @pizzagems_bot  If you know any, please pm, thank you!

— 2024-06-19 —

harlan: Is there a Chinese community?

harlan: Did Jetton authorize these statements, using operations such as transferFrom?

harlan: Any recommended links?

harlan: transferFrom related operations are not implemented in howardpen9/jetton-implementation-in-tact. Where can I find a complete implementation for reference?

Decentralized: is there more example of contract and test

Decentralized: also how do we see the gas price and cost for tx

Decentralized: hey i put a tact.config.json in the root dir of the project created by blueprint but it never prints out the dump, wonder how to print it? {     "projects": [       {         "name": "SimpleCounter",         "path": "./contracts/simple_counter.tact",         "output": "./contract_output", // this dir non-existent for my setup         "options": {           "debug": true         }       }     ]   }

Decentralized: wonder does ton allow send ton at deploy time by deployer, this is a common practice from evm chain and pretty useful

Decentralized: wonder how to transfer ton programmatically from one address to another in blueprint test framework, is there an example to learn from?

Mahima Thacker: Hey guys, I am facing an error called:- Unsupported item type: tvm.stackEntrySlice     at parseStackEntry (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:284:19)     at Array.map (<anonymous>)     at parseStackItem (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:316:34)     at parseStack (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:326:20)     at TonClient.runMethod (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:45:49)      I am trying to get the function data using TonClient:-   const items = await client.runMethod(collectionAddress, 'get_market_item',[   { type: 'int', value: 0n}   ]);   console.log(items);   And here's the tat contract code:-      struct MarketItem {         index: Int;         nftContract: Address;         seller: Address;         owner : Address;         price : Int;         isListed: Bool;         sold: Bool;     }      sales: map<Int, MarketItem>;     get fun get_market_item(item_index: Int): MarketItem? {          return self.sales.get(item_index);       }  So can anyone tell me what could be the issue here?

Gowtham: Hi

Tharun: hi i have doubt i have deployed a smart contract and this is my code to transfer the ton coins    import { Address, Sender, toNano } from '@ton/core'; import { Gasless } from '../wrappers/Gasless'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const counter = provider.open(         Gasless.fromAddress(Address.parse('EQDDeEICbV4sg49ZcWEYWy_HguaNCesMzMXNOnANZaAFdwhu')),     );          await counter.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Transferparams',             destinationAddress: Address.parse('0QBe3eHtG4thL6HoGiBAkDOqX-MsjbpMhkCU_31W-SJM8oVn'),             amount: 100000000n,          },     );     console.log('counter.address: ', await counter.getBalance());  }  i want my another address to pay the gasfee for this transactions it is possible ?

Tharun: can anyone help me plz

Nerses: how to parse map if it is part of the message.In case of Int you know that it will be 257 bits and so can parse while in case of map it is problem. Has anyone such problem ?

Dmitry: is there any sense(gazwise) to create local variable copy of state struct?

Dmitry: self.info.kek = 1         self.info.lol = 2  vs          let info: MyStruct = self.info;          info.kek = 1         info.lol = 2

Dmitry: thx. (reply to 33302)

Daniil: There’s no “transferFrom” in TEP-74 standard:  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 33279)

Dmitry: is there a reason btw? (reply to 33308)

Vitor: "forward_payload" replaces the transferFrom mechanics, indirectly. It's the expectation the owner will trigger the change, but a subsequent contract interaction can be made, instead of the owner triggering a contract that triggers the transfer on the owner's behalf. (reply to 33309)

Tom - Bushi: what is more gas efficient: 1. making a local variable let vari:Int = X * Y; and then using it in two or 3 places or 2. just doing the X * Y calculation inline

Tom - Bushi: second question - does anyone have a good example of batch minting nft's? Or a suggestion on how to do it?  Should I just be sending messages back and forth between NFT's and minter with info of how many more to mint? Im wondering how to handle gas for both the transaction and storage for something like this

David Le | POLYQUEST (데이비드 리): Gm team! I'm David from Comic One and Fizen - the projects start from 2021 with $2M fund raised and still building until now.  We're having more than 200.000 downloaded from Appstore and CH Play, with 30.000 DAUs and available in 180+ countries.   I want to discuss with your team about partnerships or collaboration to grow up together, so who can I contact with?

faramo_žayw: I'm new to Ton and trying to figure out how to use ECRECOVER and KECCAK256 in a Tact/FunC contract. Can anyone provide examples of how to use these functions?

Vitor: MUL costs 18 gas, so does a PUSH and a POP. So it really depends on how many times you re-use the local variable. Reference: https://docs.ton.org/learn/tvm-instructions/instructions (reply to 33314)

Vitor: Both have operands, https://docs.ton.org/learn/tvm-instructions/instructions, but I'm not sure the Tact standard library encapsulates those already. If it doesn't, you can write a little FunC and call it from Tact - there's an example in the Cookbook. (reply to 33319)

Tom - Bushi: thx for the answer. Any thoughts on my second question about batch minting NFT's? (reply to 33320)

Vitor: Not really, sorry, I never stopped to look into how NFT interfaces are implemented on TON. (reply to 33323)

faramo_žayw: yea, I saw it, but it's not very clear how to do this little FunC 😅 (reply to 33321)

Vitor: https://github.com/UltraNihilist/0-gas-vote-ton/blob/7c38e7f5628536f6ffc57c8296d05c09d7d3d1c2/ballot.fc#L39-L84 for an example of FunC calling the ECRECOVER opcode. (reply to 33325)

Виктор: Hello everyone, we need a partner , we have access to all streaming services , the idea of a cool project , financing after the beta version , who is ready to listen in private messages?❤️

Decentralized: how to parse emit event any example?

Decentralized: anyone knows why this emit(TransferEvent{amount: myAmount, recipient: sender}.toCell());   throws err?

Decentralized: no, i have sender (reply to 33333)

Illia: what compiler says to y? (reply to 33332)

Illia: send you console output (reply to 33332)

— 2024-06-20 —

Andrew: There is so little educational content on the Internet about Ton development.  I decided to improve this situation.  I’m just starting to study this area, and everything I learn will be shared in my channel.  I hope this will turn out to be an excellent tutorial on developing on the Ton blockchain from scratch (since I'm starting from scratch right now).  If you would like to join me on this journey, please let me know.  I don't want to advertise here.

Howard: Let me check (reply to 33246)

lin: How to place an empty address in storeAddress

lin: In JS SDK, it looks like this e.bits.writeAddress( void 0)

fa: Hello everyone, tell me, can I find out the address of the owner of the smart contract?

Nerses: I have created contract which message has different type fields like Int , Address or Map. Is serialization of message deterministic ? I mean that in messages of the same type, fields are stored at the same bit position in each Cell.

Nerses: for eexample if i have such message message Hello {     hi: Int;     hello: Address;     goodDay: map<Int,Int>; }   and in serialization field hello ends at bit x will goodDay start at x+1 bit ? Or how they will be stored ?

Anton: Tact produces a compilation report in .md format, you can check the TLB schemes in it. That will tell you how your data is organized (reply to 33363)

Nerses: TLB: `hello#aef3a620 hi:int257 hello:address goodDay:dict<int, int> = Hello` Signature: Hello{hi:int257,hello:address,goodDay:dict<int, int>}

Anton: yep

Nerses: but still it doesnt tell at which position of bit will start every field (reply to 33369)

Anton: it does (reply to 33370)

Anton: check out the docs on tlb

Nerses: is this the appropriate matreial ? https://docs.ton.org/develop/data-formats/tl-b-language (reply to 33372)

Nerses: i read the doc but still cant figure out for example at what bit will start  goodDay . Could you please give any hint ? (reply to 33372)

Maxim: Hi, anybody have script to generate Cell with JettonContent or example of generation

Dmitry: There are online generators of jettons (reply to 33377)

Tiqan: Does anyone have any idea, why my contract works in testnet but not in mainnet?

Nick: anyone have any contracts for trading TON DNS? is TON DNS just a jetton ?

Mirka: Ton dns is just a nft (reply to 33393)

Nick: So it’s different from a Jetton ?

Mirka: It's not a jetton, it's nft (reply to 33395)

Nick: Do you have any contracts with interacting with NFTs I can look at

.: Guys how much money do i need to get my own jetton?

— 2024-06-21 —

🅰🆂🆃🅾🆁🄳🄴🅅: Hi. How to interact with tact using react? Have any templates or docs? Thank

Max: Try https://foton.sh/ – there is a tutorial for React (reply to 33441)

Nerses: is there any example how to parse dictionary using libs in ts ?

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Hello there! I encountered a problem that after building a contract, blueprint deploys the same contract to the same address, does anyone know how to fix it?

Dmitry: How it should work in your opinion (reply to 33449)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: I think that after rebuilding the contract, blueprint should deploy the new contract (reply to 33453)

Nerses: In what data type of TACT i can store map ?

Dmitry: If you haven't change your contract the result of the build will be the same, hence the same address (reply to 33454)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: I changed it, but the result is the same (reply to 33459)

Illia: Try deleting the rebuild, build again and see the result (reply to 33462)

Illia: There is a folder called build (reply to 33462)

Illia: Can you describe the use case? Ultimately, the map is the dict and the dict is represented as cell (reply to 33455)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Ok, i will try

Nerses: I try to parse message which consist of different fields such as map. So for it I tried maually to store map and load data from it (reply to 33465)

Illia: I haven't seen if it's possible to store maps in messages, but I guess it should be possible.  What is your map size? Do you want to use this in production or just as a fun project? (reply to 33467)

Nerses: I stored it succefully,but problems occured trying to parse that data. It will be production code (reply to 33468)

Nerses: In docs it is stated that during compilation is generated ts file which can be used for example there are load store for messages of contract

Illia: I reckon it's not possible yet. I haven't seen such syntax in the docs or somewhere in the recent announcements.  You may try using native functions from FunC to interact with your dict as a cell in the Tact contract (reply to 33469)

Nerses: But the main problem is that loadSomeMssg accepts as argument Slice while data is too long to be stored in Slice

Illia: Yes, that's true. Do you want to parse your dict in Tact or in TypeScript? (reply to 33470)

Nerses: I want to parse in Type Script, but as it was useless i tried to store some message and load data using compilation ts functions just for understandi9gn why it doesnt work (reply to 33474)

Illia: If TypeScript is the case, then there is a special type of Dictionary. This is used for maps.  If you send your code, preferably as a GitHub repository, I may try to help you with your problem and write some code that does the job.  Or send you a link to the relevant part of documentation. (reply to 33470)

Nerses: if you dont mind I will dm you to describe in detail the problem (reply to 33476)

🅰🆂🆃🅾🆁🄳🄴🅅: Thanks (reply to 33443)

🅰🆂🆃🅾🆁🄳🄴🅅: Yes, you can store the map, but with an unpredictable map length, consider implementing parent-child contract schemes. https://tact-by-example.org/04-maps https://tact-by-example.org/06-parent-child. (reply to 33455)

Nerses: thanks a lot (reply to 33481)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: It's possible to create contract from contract like in solidity?

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: ty so much (reply to 33497)

— 2024-06-22 —

C i d: Good day,  My name is Cid, and I am an Affiliate Marketing Specialist for TokenWin, an online crypto gaming and entertainment platform. Today, I am reaching out to the talented TON Society and developers interested in partnering with us.  What’s in it for you?  New Utility for Your Coin: Integrate your cryptocurrency with TokenWin and offer your community an exciting new way to utilize their coins. Increased Visibility: Get your project in front of a new audience, boosting your coin's adoption and recognition. Mutual Growth: Drive traffic and revenue to our platform, and in return, enjoy the benefits of an expanding user base for your coin. Why Us?  Smooth Integration: We provide easy-to-use APIs and comprehensive documentation to make the integration process seamless. Robust Support: Our team is here to help every step of the way, ensuring a successful collaboration. Innovative Platform: Be part of TokenWin, a cutting-edge online crypto casino that is set to redefine the gaming experience. Join Us!  Looking forward to building the future of crypto gaming with you.  Best regards,  Cid

C i d: For any interested parties you can email me at  cid.stifler@tokenwin.com

Dhruv: hello devs, can anyone please help me here, how to wait till send transaction is completed? The storeOnDB function gets called after sending the send transaction but i want it to call after the send transaction is executed, how can i make it possible.   const mintPost = async (data) => {         if (!postContractInstance) return;          const res = await postContractInstance.send(             sender,             {                 value: parseTon("0.05")             },             {                 $$type: 'Mint',                 query_id: BigInt(Math.floor(Math.random() * 1000)),             }         ).then(async () => {             await storeOnDB(data);         });     }

Viacheslav: Hey guys, what’s the best way to send multiple messages in a single go without usin PayGasSeparately mode?

Illia: use mode: 0 + attach some value like 0.005  then do nativeAcceptMessage() on the receiving contract after validating that the sender is someone you trust and expect getting notification from  or simply provide more value (you may want to ask the recipient of the notification to pay some toncoins in advance) (reply to 33521)

Illia: You may want to do something like that:  https://github.com/VanishMax/foton/blob/b33f2daf446456f76deb2aa7235c161cd3df1b97/packages/core/src/public/wait-for-transaction.ts#L19 (reply to 33519)

Illia: Harvard's free CS50 online course is the best option for that (reply to 33515)

Viacheslav: but if it’s not enough? e.g. for TokenTransfer and I have to manage everything manually? is it possible to SendRemainingValue at the end? (reply to 33522)

Illia: if you do accept_message on the receiving contract, you set the gas limit of the current (incoming) transaction to the balance of your contract  therefore, when receiving the notification, you agree to pay for it using your own contract balance  by default, the gas limit is incoming message value / gas price  0.005 should be enough for the average transaction + call accept_message (reply to 33525)

Illia: https://docs.ton.org/develop/smart-contracts/guidelines/accept (reply to 33525)

Viacheslav: and to send multiple I just use multiple send or pack them in a single body?

Illia: you need to find the optimum value by youself; if you transfer simple message with query_id int as u64; then even 0.002 toncoins can be enough (considering current gas price stays the same and you call native_accept as soon as your receive begins) (reply to 33526)

Illia: you just call send() as many times as you want  you can do it in the for-loop, for example (reply to 33528)

Illia: we're talking about sending messages inside the contracts, right?  cause it's slightly different if we're talking about sending messages using TON Connect (reply to 33528)

Viacheslav: So this should work, but it fails with 708 exit code..   send(SendParameters{                     to: ctx.sender,                     value: ton("0.03"),                     mode: SendIgnoreErrors,                     bounce: false,                     body: TokenTransfer{                         queryId: 0,                         amount: someTokenAmount,                         destination: self.owner,                         response_destination: msg.from,                         custom_payload: null,                         forward_ton_amount: 0,                         forward_payload: emptyCell().asSlice()                     }.toCell()                 }             );              send(SendParameters{                     to: ctx.sender,                     value: ton("0.03"),                     mode: SendIgnoreErrors,                     bounce: false,                     body: TokenTransfer{                         queryId: 0,                         amount: tokenAmount,                         destination: msg.from,                         response_destination: msg.from,                         custom_payload: null,                         forward_ton_amount: 0,                          forward_payload: emptyCell().asSlice()                      }.toCell()                 }             );             send(SendParameters{                     to: msg.from,                     value: 0,                     mode: SendRemainingValue | SendIgnoreErrors,                     bounce: false,                     body: “Some text!”.asComment()                 }             );

Viacheslav: only tokentransfer fails, third one is ok

Illia: 708 is not the standard exit code; the contract you send this too throws this error code; you need to have a look when your destination contract throws this error (reply to 33532)

Viacheslav: it’s just basic jetton deployed with minter

Illia: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L66 (reply to 33535)

Illia: based on this code, it expects the message you sending to have body, but you're sending a message with empty body (reply to 33535)

Illia: 🤷‍♂️ (reply to 33534)

Viacheslav: throw_unless(708, slice_bits(in_msg_body) >= 1);   slice either_forward_payload = in_msg_body (reply to 33538)

🅰🆂🆃🅾🆁🄳🄴🅅: how to verify my tact source code? I tried verifier.ton.org but not allow send tact file just func file

Anton: I can see some verified Tact files there. You might want to try their support group: @tonverifier (reply to 33542)

Anton: offtopic (reply to 33545)

Illia: ⏳ Compiling...   > Broker: tact compiler    > Broker: func compiler Func compilation error: /home/pantemon/nenuma/packages/contracts/build/Brokerage/tact_Broker.headers.fc:190:209: error: formal parameter name expected instead of `type`   ... n_expiration_type_investment_payout(slice holder, slice writer, int initiation, int expiration, int type, int investment, int payout) inline;  Does it mean that type is a reserved word in Tact?  I've built a contract that accepts the Agreement struct with the type field. It works fine in the testnet.   But now I'm trying to instantiate an object of that struct in the contract and I'm simply getting pissed off by the compiler.  UPD. I've just refactored all my code that there's no type field anymore. As a result, I have no errors.  If that's a reserved word, then cool, but we need to make sure that the user is not limited inside structs, or, at least show this error earlier, when the first compilation takes place. I've also never seen any type parameter in FunC. Is it some extra from Tact?

Anton: can you share a minimal Tact example, please? (reply to 33563)

Illia: uno momento, working on that (reply to 33564)

— 2024-06-23 —

Howard: interesting (reply to 33326)

Anton: Btw, this is going to be fixed in the next bug fix Tact release: https://github.com/tact-lang/tact/pull/467 (reply to 33565)

cindy: hi, how to get length of tact map?

cindy: map.length map.len() not work

Neo: Hi, how to receive jetton deposit on business contract ? , need use tact

ABCDE: Hello! Is there any good implementation of jetton in Tact language?

Neo: no , i just want my business contract can accept deposit usdt jetton token , and can withdraw usdt jetton token with owner, use tact

Neo: is there any example for this ?

Виктор: Hi, I'm looking for a partner to develop a service in Russia, a good case. Large partner companies ,info in private messages

Sumit: Hi. i want to transfer X ton from my contract to some wallet. but i get have to send transfer amount as well with that. and the user ends up receiving more than X

Sumit: how can i fix that?

Vlad: +1, the only 2 things I could find myself: https://tact-by-example.org/07-jetton-standard https://github.com/howardpen9/jetton-implementation-in-tact  But not sure how trustworthy are these, lmk if you find sth better, would be nice to have basic things like jettons and NFTs implemented in tact (reply to 33645)

Nick: Any good implementation of transfering NFTs ?

Anton: The new Sublime Text 4 package for Tact is now available.  🚀 The Tact team is thrilled to announce the launch of a new official ST4 package for the Tact language! Check it out to enhance your coding experience: tact-sublime. ✨ Features: • Syntax highlighting • Auto-completions and code snippets • Syntax checks through simple Tact compiler integration • Symbol lists, indentation, folding and comments • ...for all the details, see its README ⚙️ Installation:  1 Open the command palette with Ctrl + Shift + P (or Cmd + Shift + P on macOS)  2 Select Package Control: Install Package (install Package Control, if it's missing)  3 Type and select Tact 👨‍💻 Made with 🤍 by Novus Nota ⚡️ Happy coding with Tact! 👨‍🍳 And also come visit what's cooking there 🤌 (forwarded from TON Dev News)

Rashid: Howdy! Thrilled to join such a community and the first question is: - Going forward, is Tact going to be a preferred way to develop Smart Contracts on TON? - Is there anything Tact won't be able to do that I will have to use FunC for?  Thanks

Illia: Wow, that's great news! Thanks for your quick response to my issue. Unfortunately, I didn't manage to produce the example for your earlier, but it seems like you managed to do that by yourself. (reply to 33634)

Illia: Welcome, Rashid!  It's difficult to answer your question because it contains 'is going to be'. I'm sure it will substitute FunC completely one day. But it's yet to happen. For building proofs of concept, it's already great. My development time decreased a lot (I reckon it increased at least 4 times). I would spend like 2 months rather than 2 weeks on what I have built now. If you need to use FunC, you can simply call FunC code from Tact using native functions. Therefore, the answer to your question depends on what you want to build. If something is 0-to-1 and maybe beyond, Tact is already preferred. If you require aggressive optimizations and complex engineering, then I would prefer FunC today, but, as Tact gets better, I will switch to Tact.  Well, now, I will address the next question. As of now, Tact compiles directly into FunC. Therefore, if FunC can do something, you can do it Tact. You may even write some custom code in FunC and call it from Tact 👀 As long as Tact is compliable into FunC, you will have no trouble. But in the future, Tact is going to be compiled directly into Fift (that's the language for manipulating the TVM stack like the Forth programming language). I think, once this milestone is achieved, the developers of Tact will make sure that Tact can do the same spectre of tasks as FunC. (reply to 33670)

User<6923299204>: Is there any source code to create a  USDT-like token in Tact?

Illia: https://tact-by-example.org/07-jetton-standard  This is probably the best reference so far. (reply to 33677)

Rashid: Thank you so much! What an extensive answer! Exactly what I needed. Bookmarking your answer for future reference! (reply to 33676)

MyName: We need fckn Rose here (reply to 33686)

— 2024-06-24 —

Kevin: https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=code  Here’s the source code for USDT (reply to 33677)

Haris: Hi Everyone! it was nice to find the tact language community. I was struggling with some errors in building tact smart contract. I want to debug my contract. When i use dump for printing the Address type it gives me error that dump() does not support Address type and also when i use Address.toString() it says toString() function is not found

Haris: ok thanks

Howard: nice (reply to 33668)

Nerses: how can i convert BoC base64 to Slice type ?

Illia: If you're using ton-core   Cell.fromBase64(boc).beginParse() (reply to 33704)

Nerses: thanks a lot (reply to 33705)

Haris: I am trying to mint a NFT in which contracts calls transferNFT to change the owner of the nft from collection to caller but it do not save the owner address to caller

Haris: transaction successfully executed but does not change the nftItem owner

Haris: resolved (reply to 33707)

Haris: but now dump(myAddress()) ot working

Haris: *not

Illia: I was about to record my project's demo video for the hackathon.  But my teammate made a commit just before that. It installed Tact 1.4.0 into our project.  As a result, our tests stopped working and we also started getting mysterious errors on newly deployed contracts to the testnet.

Illia: https://github.com/dreamqip/nenuma  That's our project's repo. The contracts are in /packages/contracts  We're going to downgrade to the previous version of Tact as of now. We haven't committed a downgraded version yet (reply to 33716)

Illia: Some integer overflow now occurs, but I have no idea whether it was an error in Tact in the past, and hence my tests are wrong, or that's just a fresh bug from the latest release (reply to 33716)

Illia: we've downgrade to 1.3.1 and now everything is ok again

Illia: We're going to update our code now  The code that doesn't compile on 1.4.0 is on the branch tact-magic  https://github.com/dreamqip/nenuma/tree/tact-magic

Anton: Thanks for reporting it, will look into it first thing tomorrow (reply to 33720)

Illia: ha-ha, yeah, lots of logs, will fix that during the next week; (reply to 33724)

User<6319350984>: Hello buddy (reply to 33726)

User<6319350984>: I got a proposal, tried sending a dm but I couldn’t

User<6319350984>: Please can you message

Pouya: why @ton-community/sandbox use @ton/core but @ton/blueprint use ton/core?  the compiled tact contract ts interface by blueprint is not valid in sandbox cause of the @ton/core and ton/core  how should I solve it?

Pouya: Tnx (reply to 33736)

— 2024-06-25 —

lee: yarn deploy ,how to solve this

lee: cause: AggregateError       at internalConnectMultiple (node:net:1117:18)       at afterConnectMultiple (node:net:1684:7) {     code: 'ETIMEDOUT',     [errors]: [ [Error], [Error] ]   }

lee: yarn run v1.22.17 $ ts-node ./sources/contract.deploy.ts Uploading package... D:\01-Blockchain\21-ton\01-tact\tact-template-main\node_modules\axios\lib\core\AxiosError.js:89   AxiosError.call(axiosError, error.message, code, config, request, response);              ^ AxiosError [AggregateError]     at Function.AxiosError.from (D:\01-Blockchain\21-ton\01-tact\tact-template-main\node_modules\axios\lib\core\AxiosError.js:89:14)

lee: how to solve this problem

Illia: increase timeout limit or change API provider (reply to 33764)

lee: thanks i will try (reply to 33770)

lee: add timeout ，but not work

lee: The template for running the official website has not been working for two days. Please help.

lee: TON is too difficult.

Son Pin: any comparion of tact and func in deep level

Anton: So basically the issue is in the storageReserve constant. Here you declare it as a variable (which the typechecker misses, we will fix that), what you really need to do is to say it like this:  override const storageReserve: Int = ton("0.01”);   You’ll have to do it like this, because defining constants in terms of other constants is not possible now, but will be in the next Tact feature release (reply to 33720)

Howard: deep level? Which part you mean? We have the example comparison in here: https://tact-lang.org (reply to 33782)

Son Pin: I mean some case of control low level that we can not do with tact but good with func. We are In RnD phase (reply to 33784)

Anton: you can always write some parts of your project in FunC and then do FFI with Tact (it’s really straightforward) (reply to 33785)

Haris: i cant init the 2nd contract  from its parent contract please help

Haris: anyone? (reply to 33788)

Anton: well, you didn’t provide any detail. what did you try? what have you got? what result did you expect? where is your code? (reply to 33789)

Haris: Here is my code:   receive(msg: Mint) {         require(sender() == self.owner, "Unauthorized");         // dump("start");         let init: StateInit = self.walletInit(self.owner);         let wallet: Address = contractAddress(init);         // dump(wallet);         send(SendParameters{             to: contractAddress(init),             body: InternalAdd{amount: self.totalSupply, origin: myAddress()}.toCell(),             value: ton("0.03"),             mode: SendIgnoreErrors,             code: init.code,             data: init.data         });         // dump("end");     }       get fun walletInit(owner: Address): StateInit {         return initOf JettonWallet(myAddress(), owner);     }      get fun walletAddress(owner: Address): Address?{               let initCode: StateInit = self.walletInit(owner);         return contractAddress(initCode);     }

Haris: Mint transaction giving me no error but when i tried to get balance from child contract it is giving me error:   Trying to run get method on non-active contract

Anton: It’s still unclear how you test it

Haris: there is no rocket science in it i am trying to make nft collection which initiate the JettonMaster contract and that JettonMaster should initiate jettonWallet contract

Haris: but i think JettonMaster is not able to deploy or initiate the JettonWallet contract

Haris: here is my test script:   blockchain = await Blockchain.create();         // blockchain.now =                   deployer = await blockchain.treasury("deployer");         user = await blockchain.treasury("user");         let royaltiesParam: RoyaltyParams = {             $$type: "RoyaltyParams",             numerator: 350n, // 350n = 35%             denominator: 1000n,             destination: deployer.address,         };         // let map = Dictionary<BigInt, BigInt>;         console.log(Date.now());         // console.log(blockchain.now);         blockchain.now = Math.floor(new Date().getTime()/1000.0);         console.log("blockchain time " + blockchain.now);         collection = blockchain.openContract(             await NftCollection.fromInit(deployer.address, newContent, royaltiesParam, 5n)         );                  let deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) },          {             $$type: 'MintNft',             vesting_period: 365n,             // token_master_address: jettonMaster.address         });                  expect(deploy_result.transactions).toHaveTransaction({             from: deployer.address,             to: collection.address,             deploy: true,             success: true,         });          let token_master_address = (await collection.getGetJettonMasterAddress());         console.log(token_master_address);         jettonMaster = blockchain.openContract(             await JettonMaster.fromAddress(token_master_address!! )         );                 console.log(await jettonMaster.getMetadata());           let wallet_address = await jettonMaster.getWalletAddress(collection.address);         // console.log(jettonMaster)         console.log(wallet_address)         let wallet = blockchain.openContract(             await JettonWallet.fromAddress(wallet_address)         );         // console.log(wallet)         console.log(await wallet.getBalance());

Haris: will it help? (reply to 33793)

Sumit: https://testnet.tonviewer.com/transaction/7c4effed8b32b300075f9952a77756aeb385ba3d5b479fe10c2a2ca1858929ad

Sumit: i am trying to transfer a token.

Sumit: and i get 708. what could be wrong with it?

Sumit: https://katb.in/qiviruxejik

Sumit: this is the contract that i am using

Son Pin: What’s FFI sir (reply to 33786)

Surendra: Hello (reply to 33817)

Stuart: yo peeps

Stuart: how do i determine set an address to '0x0' or the equivalent in solidity

A: Hi guys. How to send a Stop message to a Stoppable contract. The following code gives me this error: Type '"Stop"' is not assignable to type '"Deploy"'  it('should stop', async () => {         await stoppableContract.send(             deployer.getSender(),             {                 value: 0n,             },             { $$type: 'Stop' },         );     });

A: Oh, I should send "Stop" text instead of "Stop" message. I found the solution  it('should stop', async () => {         await stoppableContract.send(             deployer.getSender(),             {                 value: 0n,             },             "Stop",         );     }); (reply to 33821)

Tom - Bushi: anyone have an idea why prettier is working in a contract in the root contracts/contract1.tact folder but isnt working in a nested folder contracts/folder/contract2.tact?

سجاد: سلام

سجاد: مال 500هراز پرفایلم

— 2024-06-26 —

•: Maybe in settings set specific path, or rules in .prettierignore. There are a lot reasons… (reply to 33826)

cindy: Hi TACT community, Is there any example to send Array struct params to ton?

cindy: I need your help.How can i send transcations of request params like this to ton?

cindy: The message data structure is map and struct.

David: Compile the smart contract it will generated ts file then use it (reply to 33871)

cindy: thanks for your help.I find the tact_***.ts generated,i will try to use it.thanks. (reply to 33878)

cindy: tact language is great,tact community is great.thanks.

lee: how to use blueprint,is there any examples

lee: ?

Vitor: Plenty of examples in the docs: https://docs.ton.org/develop/smart-contracts/sdk/javascript (reply to 33882)

lee: thanks

lee: ok

cindy: Hi, if i put the dump() in the receive function of contract,where can i see the log output?

cindy: I have depoyed it to the testnet.where can i see the log info?

Haris: you can't see it while running on testnet. You need to write your testcases to debug the contract (reply to 33889)

Haris: I am receiving following error while deploying on testnet will somebody help:  AxiosError: connect ECONNREFUSED 127.0.0.1:8080

lee: I saw a video before that showed how to change a signature into a QR code, so you can sign by scanning the code. How can this be done?

jay: Hi guys, is there any implementation code for creating merkle tree using tact?

Anton: https://t.me/tactlang/33887 (reply to 33889)

Haris: please help (reply to 33892)

Haris: i am using blueprint to deploy the contract

Haris: if i revert back to old ton and blueprint versions it is deploying

Haris: but if i changed it to latest versions it is giving me error

Haris: how to resolve it ? i dont have access to axios

Rahul: Haris I didn't find an issue with the latest version of the blueprint. Could you share a sample source code to reproduce it?

𝙏𝙖𝙧𝙞𝙦 𝙈𝙖𝙝𝙢𝙤𝙤𝙙: Dear developer.   I want smart contract developer   I want build project on the on ton blockchain.   We want expert who can write ✍🏻 smart contract   Please contact with me.   Thanks 👍🏻  Tariq Mahmood

Haris: i am trying to deploy on other system if it did not deploy i will let you know (reply to 33904)

𝙏𝙖𝙧𝙞𝙦 𝙈𝙖𝙝𝙢𝙤𝙤𝙙: My tom smart contract has problem how I can fix?

Illia: you need to provide arguments when you calling fromInit()  the arguments are owner, content, max_supply (you can see them in the log below) (reply to 33908)

Illia: Wow, thanks very much, Anton! I'll change that so that our contracts now support Tact 1.4.0 (reply to 33783)

Stuart: guys question

Stuart: I'm writing a game that pays out

Stuart: if(!self.has_started) {             require(myBalance() >= self.prize_value, "Not enough balance to start");             self.has_started = true;         }

Stuart: heres my code

Stuart: pretty simple. in my tests, i set the prize value to 1 ton

Stuart: when the game ends, i send a payout with this function

Stuart: fun pay(recipient: Address, value: Int) {         send(SendParameters{             to: recipient,             value: value,             bounce: false,             mode: SendRemainingValue + SendIgnoreErrors         });     }

Stuart: self.pay(self.current_winner, self.prize_value);

Stuart: like this

Stuart: i have a test that runs thru the game, and then hits the play function again

Stuart: which automatically restarts the game

Stuart: but it should fail because it doesnt have enough balance

Stuart: however, its not failing. when i output the balance variable, its not changing, even though the past winner is getting creditted

Stuart: any thoughts?

Illia: can u upload your code on github?  try nativeThrowUnless instead of require (i found its easier to debug)

Tom - Bushi: when writing tests how can I check the reason for a reversal of a transaction? like how can I see if this require statement was failed?  require(ctx.value >= spentOnTickets, "Not enough funds sent");

Stuart: yo are there docs for that (reply to 33927)

Stuart: and my codes on github but its private

Illia: take a look at stdlib.fc  there's function throw_unless  there's a comment explaining how it works (reply to 33929)

Stuart: gotcha

Stuart: simple enough

Stuart: i can add you to the repo if you want to take a look at it

Stuart: its pretty simple

Illia: i might help if u add (reply to 33935)

User<6889675046>: i can add you to the repo if you want to take a look at it

ABCDE: Hello!  Tell me in which field of the transaction object you can get information from require() when it stops the transaction.

𝙏𝙖𝙧𝙞𝙦 𝙈𝙖𝙝𝙢𝙤𝙤𝙙: Ok you can write ✍🏻 a new ton smart contract? (reply to 33910)

Anton: is it because the exit code is obvious from the code? (unlike with require which hashes the error string into an exit code)? (reply to 33927)

Illia: Yes, exactly. I've written a custom logger (shrek-logger)  It's inside utils.ts at the nenuma repository.  It shows the exit code as a number. If I get some errors, I then just go to the code and can precisely track what's the problem.  If I have a hashed string, that's quite not intuitive.  I create constants that represent error codes so that it's also easy for me to navigate around the code.  However, it also adds lots of boilerplate. Unfortunately, there's no way to export constants yet (or I just haven't found them in the exports). (reply to 33946)

Anton: this sounds awesome! I haven’t looked yet, but is it possible to integrate it with blueprint directly or refactor it as a separate package and plug into blueprint? (reply to 33947)

Anton: this sounds a bit too abstract to actually decide, i would say it depends on what your contract does exactly (reply to 33948)

i: DM find a teamm8

Illia: That would be great. I will create a new repo later today. It would be amazing if you could take a look and provide some feedback on how to improve it. It would be good if it becomes a part of the blueprint, or it can stay as a separate package. I think it would be better to leave it as a separate package of custom utils (reply to 33949)

𝙏𝙖𝙧𝙞𝙦 𝙈𝙖𝙝𝙢𝙤𝙤𝙙: You can make a new smart contract? (reply to 33955)

Illia: Please DM me with the requirements (reply to 33956)

Pouya: how can i get an arg with type Int as bytes32 in a function I used:  fun someFunc(myArge: Int as bytes32) and I got error : Syntax error: expected ")", ",", or "?"

Pouya: And how about slice.hash? What type is the hash?  I want to convert a string to hahs(like keccak)  Is there any direct way or I should convert string to slice and then use hash method? (reply to 33959)

Pouya: Document dose not mention any note about the hash type (reply to 33961)

Sumit: how can i estimates fees of an external message in a contract?

Pouya: which one is more efficient in tact to store and why?  bytes32(hash(sha256) of a string) the string(dynamic length)

Illia: There are also new opcodes for SHA256 and for Keccak256  https://docs.ton.org/learn/tvm-instructions/instructions#:~:text=F90403-,HASHEXT_KECCAK256,-s_1%20...%20s_n%20n  But you will have to write bindings to call these opcodes from FunC. (reply to 33960)

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: hi

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: Hello everybody how are you

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: Can i ask some question

Illia: The answer to your question very much depends on the length of your string.  Fift (the language for manipulating the TVM stack; Tact compiles into FunC and Func compiles into Fift) uses UFT-8 for strings. It means that each character can be 8 bits (1 byte), 16 bits (2 bytes), 24 bits (3 bytes), or 32 bits (4 bytes). Chinese characters require more than 1 byte to store.  Therefore, a string 'Hello, World!' takes 13 bytes or 13 * 8 = 104 bits. That's how much storage you need.   The function sha256 in Tact calls the SHA256U opcode under the hood. It returns a 256-bit unsigned integer x.  https://docs.ton.org/learn/tvm-instructions/instructions#:~:text=F902-,SHA256U,-s%20%2D%20x  Therefore, if your string size is <= 256 bits, that's reasonable to store the value as a string. But, if it's longer than that, it's better to use sha256 as you only need to check if the strings match. Obviously, you won't be able to restore the original value from such a hash.  I have to double-check that you pay fees just for the bits you use or for the number of cells you use. Could anyone elaborate on that and supply a relevant link to the documentation?  If you pay just for the number of bits you use, then the limits are the same as I described above. If you pay for the number of cells, then it's reasonable to use sha256 if you have a string that takes more then 1023 bits. (reply to 33970)

Illia: The process of estimating fees for external messages should be the same as for internal messages.  I have a great example of how to calculate fees for transferring and burning jettons.  https://verifier.ton.org/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs#:~:text=()%20check_amount_is_enough_to_transfer(,))%3B%0A%7D  That's the source code of the USDT contract on the TON Blockchain. You can write such functions in FunC and then bridge them into Tact. (reply to 33964)

︎ ︎Loren Terw: ❕Срочно ищу Func разработчика с опытом в TON ❕ Потфолио в лс

poppa: nice work team, tact lang is such a pleasure to use 👍

poppa: coming from solidity world, it's very nice

Sumit: I want to send exactly 1 TON to a address from my contract. What send mode should i use?

Sumit: because when i send 1 TON

Sumit: https://testnet.tonviewer.com/transaction/a44a4f57a14382baa46020f44aee1f23130288f21e512919f0f6207fc0c6e28b

Sumit: i get 0.9994672 TON

Pouya: Is anyone here who know about tact and ton contracts audit

Jade: Please any sure invitation profitable link to earn

Oke: Yes am with you (reply to 33995)

Pouya: If you are interesting contribute on an open source tact devtools, dm me   Thanks (reply to 34006)

Pouya: storage_fee = (cells_count * cell_price + bits_count * bit_price)   * time_delta / 2^16  Both cell_price and bit_price could be obtained from Network Config param 18.  Current values are:  Workchain: bit_price_ps:1 cell_price_ps:500 Masterchain: mc_bit_price_ps:1000 mc_cell_price_ps:500000 https://docs.ton.org/develop/howto/fees-low-level#storage-fee (reply to 33975)

Pouya: Storage fee is based on both bits and cells😱 (reply to 33975)

Illia: https://www.npmjs.com/package/@henchtab/shrek  👀 (reply to 33949)

— 2024-06-27 —

Anton: a small snippet on how to use it in the README would be extremely helpful   https://github.com/tact-lang/awesome-tact/issues/33 (reply to 34012)

King's uncle: why here says 2/1 = 0? Am I missing sth? Or the doc wrote it wrong?

Anton: a typo (reply to 34023)

Anton: cc @novusnota42

King's uncle: Tks (reply to 34025)

lin: How to use the storeAddress() and storeRef() methods to store nulls in tact

lin: The storeMaybeRef is used in the JS SDK, but it is not present in the tact

cindy: I am doing test on tact.It's the same with other tests.why it reports the error:error TS2339: Property 'toHaveTransaction' does not exist on type 'JestMatchers<BlockchainTransaction[]>'.

cindy: thanks.I import the "@ton/test-utils". I will try it again. (reply to 34034)

cindy: Resolved.And I imported '@ton-community/test-utils'; not the package: import '@ton/test-utils'; (reply to 34035)

lin: emptyCell() is possible, but there is no emptyAddress() (reply to 34036)

cindy: My package may be too old.I will update it later (reply to 34037)

cindy: wow,my first debug on tact works

cindy: How can i get the failure reason on the transcation result of tact test?

0xCryptolia: Hello everyone. Is it possible to get a reply value from a contract sent using self.reply() in blueprint test?

Illia: Will do today. Btw I've initiated a blueprint project with a simple counter in Tact; added example there (reply to 34022)

0xCryptolia: Thank) (reply to 34046)

Illia: added new readme; if there are any suggestions on features, please let me know  i think i may add human-readable names for opcodes in the next update (reply to 34022)

Aish: Hi everyone, Is it possible to write test cases using blue print for a set of asynchronous transactions?  Here is the scenario,  There is contract A and a user 1. The user 1 makes a transaction to contract A and which makes further transcations in response.  Here is the txn flow:  1 -> A -> B ->C -> A  Is it possible to create test cases using blueprint for the entire transaction flow( as the transactions are asynchronous), like if a transaction at C bounces, can we know it from blueprint test cases?

Illia: Yes, that's very possible. You may take a look at how I test action chains at nenuma.  https://github.com/dreamqip/nenuma/tree/main/packages/contracts  If you want to check if transactions bounced, then u need to add bounced: true (if I'm not mistaken) and/or success: false in your toHaveTransaction pattern (reply to 34053)

Illia: I've just updated the link (reply to 34054)

Aish: Thanks, will check that. (reply to 34055)

Truong: hello guys, Please help me look at this contract, why is the total score still 0 when I stake tokens? It seems that TokenNotification is not working properly

Illia: i don't see how you add/subtract stakes tokens; based on this code, you just record the amount transfered (that's doesn't sound like staking)  one possibility is that you don't have enough gas coming with you notification to execute your complex hendler  try logging the contract in the tests with with https://www.npmjs.com/package/@henchtab/shrek  it will show you -14 exit code if you try to send jetton in your tests with specifying the sender   There're 2 options you can do;  the first one is to set higher forward_ton_amount  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#:~:text=forward_ton_amount%20%2D%20the%20amount%20of%20nanotons%20to%20be%20sent%20to%20the%20destination%20address.  that's the value in toncoins that comes with your notification   the second one is to call nativeAcceptMessage(); you have to write a binding from FunC's stdlib for this one,  https://github.com/dreamqip/nenuma/blob/f2ec7c03fcb1f365234e4db7ff702a7487a5b925/packages/contracts/contracts/subscriber.tact#L3  That's how i did it in nenuma  if you call this function after authorizing that the sender is the right contract, then your contract will pay for this transfer from its balance  https://github.com/dreamqip/nenuma/blob/f2ec7c03fcb1f365234e4db7ff702a7487a5b925/packages/contracts/contracts/subscriber.tact#L204 (reply to 34057)

Truong: I am referencing and testing with source: https://github.com/howardpen9/staking-in-tact/tree/patch-Sep1 (reply to 34061)

🐾: Hi

Ignacia: As

jay: Ton has too many npm packages.

jay: tough choice.

Anton: decentralization at work! (reply to 34073)

jay: 😭Need more consensus

jay: Is there a recommended choice?

jay: thank you.

jay: pr maybe better. (reply to 34074)

Anton: prs are very welcome, lol

Cake: Is have any erc721 or erc1155 examples?

Cake: I want to know more about ECDSA usage

Illia: ERC is a non-EVM chain; there's no erc721 and erx1155 tokens  TON uses it's own standard TEP-74 for Jettons (it's like ERC-20 but better) and NFT standard is TEP-62 (https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) (reply to 34082)

Matthew: I have checked null elements in the map, but I can't access the data in it

Illia: You can check ECDSA signatures using the check_signature function in FunC's stdlib (Tact may have its handy implementation as well; check the docs)  You may write some binding for FunC in Tact (reply to 34083)

Cake: Thanks

Illia: Package is possibly null  You cannot access any properties on the null object   You need to explicitly state that the value is not null  Try package!!.endTime  But make sure it's not null  The type for endTime is also just Int; it's not defined as maybe null in your struct (reply to 34088)

Matthew: self.packages.get(packageId) != null but i have check it before (reply to 34091)

Illia: That's great, but Tact is yet to support the feature that will automatically infer that the result is not null.  As of now, you must always add !! (reply to 34092)

Matthew: do  you have any example for  ECDSA signatures, i need presign for user on backend,  and verify signature on smartcontract

Illia: https://docs.tact-lang.org/ref/core-math#checkdatasignature  that's the best option available (reply to 34094)

Matthew: thank you

Anton: so, shrek is like a better version of @ton/test-utils? (reply to 34052)

Illia: Yes, that's like a library that has features that I didn't find in the @ton/test-utils, but I found them very useful when developing smart contracts for Nenuma.   There is a function in @ton/test-utils called something like printTransactionFees and it was so confusing. It was a nightmare debugging contracts with it.   I saw lots of random fees and now idea what transaction action is failing, where this message is, etc.  I was once debugging a set of transactions that was causing 13 actions. One of my transactions was bouncing as I hadn't attached enough value to pay for the gas fees.  I spent a few hours writing expects and then just gave up and implemented a function called printTransactions. It was printing simplified fees and was showing me sources and destinations of my actions.  Then I realized that it would be good to have some labels and log contract balances from time to time. That's how I created a logger.  There's a feature in the sandbox that the first transaction was like an external transaction that brings some value. It didn't have source address and values could be null sometimes.  I was rewatching Shrek with my friend that day so I just started generating some funny ogre-style info in my console.  That's pretty much who the Shrek was born :)) (reply to 34097)

Anton: really awesome stuff! would be really nice to have it integrated into the TON tooling like Blueprint/Sandbox, let’s see if we could go through the grants-and-bounties program to do that (reply to 34098)

Mikael: Hello Guys. Is there any oracles for smart contracts in Tact?

Illia: I'm currently exploring how to set up a local environment like Hardhat:  https://hardhat.org/hardhat-network/docs/overview  The console logger is great, but imagine if we had a graphical interface like Tonviewer that shows action flows with dynamic charts. That would be a game-changer for TON development.  Unlike other blockchains, where you don't have to track tons of transactions, TON's async nature makes it super easy to get lost. Plus, architecting contracts to be scalable, like Jetton wallets or NFTs, is really tough to debug. (reply to 34099)

Illia: There are no oracles on TON as of now.   I'm developing one right now for the real-time on-chain market data.   https://dorahacks.io/buidl/13423  Although it's available on the testnet already, it's not ready for production yet.  I'm planning to launch it by the end of Q3 if everything goes well  So if you need some real-time market data, I'll update you once Nenuma is launched (reply to 34100)

Vitor: There is. Stork Network supports TON and that's what Storm Trade uses. I couldn't find a reference on the website but their sales people did confirm the availability. (reply to 34102)

Illia: wow; that's very nice to know; thanks mate; will check what they have (reply to 34105)

Illia: Thanks everyone for providing useful links to think about. I'll explore their code to see how to make it better

Dmitry: What can be the reason for such an error?

Dmitry: i found the probable reason:  it is {} block

Dmitry: like  fun lol() {    let a: Int = 0;    {      let b: Int = 10;   }  }

Anton: yeah, nested blocks are not supported yet https://github.com/tact-lang/tact/issues/362 (reply to 34112)

Dmitry: Cannot reduce expression to a constant integer  const Lol:  Int = -10; const Kek: Int = -Lol;

Illia: It's yet to be supported as well (reply to 34117)

Anton: https://github.com/tact-lang/tact/issues/229 (reply to 34117)

Anton: will be supported in Tact v1.5

Dmitry: error: previous function return type slice cannot be unified with return statem ent expression type (): cannot unify type () with slice       return $self~skip_bits($l);    > Tick: tact compiler    > Tick: func compiler   beginParse().skipBits(CONSTANT * lol)

Dmitry: beginParse()                     .skipBits(CONSTANT * lol)                     .loadUint(CONSTANT); (reply to 34123)

Dmitry: what is the work around (reply to 34125)

Dmitry: like do it in two steps?

Dmitry: ic

Dmitry: why doesn't it break on tact compilation stage  and whats the reason behind chaining removing (reply to 34125)

Dmitry: thx. but not doin it here (reply to 34133)

Dmitry: can you try to explain this? (reply to 32163)

Dmitry: it neither make an error nor printing "—1"   i came up with the decision to not to deploy other contracts at init block. but still not sure that it is great

Dmitry: constructors can create its own dependencies (reply to 34138)

Dmitry: import "@stdlib/deploy";  contract TestInit with Deployable {   // Empty init() function is present by default in all Tact contracts   // since v1.3.0, so the following may be omitted:   //   init() {      dump("----init");     try{       dump("----init@myAddress-0");       dump(myAddress());       dump("----init@myAddress-1");     } catch (e) {       dump("ERROR-----init");       dump(e);     }   } }    > jest --verbose    console.log     #DEBUG#: [DEBUG] File contracts/test_init.tact:9:5     #DEBUG#: ----init     #DEBUG#: [DEBUG] File contracts/test_init.tact:11:7     #DEBUG#: ----init@myAddress-0        at SmartContract.runCommon (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:221:21)   FAIL  tests/TestInit.spec.ts   TestInit     ✕ should deploy (247 ms)

Dmitry: this one seems crazy  tact_<ContractName>.storage.fc:137:273: error: return type of an assembler built-in function must have a well-defined fixed  width   ... , int, int), (int, int, int, int, int, int, int, int), (int, int, int, int, int, int, int, int)) v) asm "NOP";

Dmitry: maybe this one makes it init(){     self.Lol = LolStruct { }; }  struct LolStruct {     a: Int as uint 64 = 0; } (reply to 34141)

Dmitry: and btw is there a way to save incomplete build? i cant even look at those ints

Dmitry: 1.3.1

Dmitry: build error changed  Tact compilation failed Error: Struct value is missing a field:  will work on it

Dmitry: this one still is an issue  default fields dont work (reply to 34142)

Dmitry: btw it seems that "tact-lang/tact.vim" got problems with ?new? tree sitter api or something.

Dmitry: this one returned once i initialized all the fields of the struct (reply to 34141)

Dmitry: ints' count is the same as fields' count   removing default values doesn't help (reply to 34141)

Dmitry: this "storage.fc" thingy got lines alike ((int, slice, int, int)) $<StructName>$_tensor_cast((int, slice, int, int) v) asm "NOP";

Dmitry: so i ~found a problem  i got:  struct Lol { ...// 8 fields } struct Heh { ... //5 fields }  struct Kek { data: Heh; lower: Lol; upper: Lol; // 18 fields = Lol x 2 + Heh } (reply to 34141)

Dmitry: and if i get rid of upper one it all began to compile

Dmitry: Kek is either too big or idk

Dmitry: i have removed kek, and used fields by themselves... it worked :(   i thought ive found a one fits all bulky template for dealing with functions + receivers (reply to 34156)

Dmitry: something wrong with mine (reply to 34161)

Dmitry: mb index haven't updated yet or smth

Dmitry: thx for reminding of the comand   but it didnt help

Dmitry: they removed astro update from leader+p pane :( (reply to 34169)

Dmitry: samd...

Dmitry: thx a lot!!!! )

— 2024-06-28 —

Anton: can you provide a reproducible example? (reply to 34135)

Dmitry: This one  Launched on freshly installed blueprint project (reply to 34140)

Anton: you didn’t post your exit code, btw it’s -14, meaning your contract is running out of gas, just increase the amount you pass during deployment (reply to 34182)

Anton: debug instructions also consume gas

0xCryptolia: Hello everyone. How do I convert cell data to a string obtained from contract in Blueprint test?

Truong: What is the problem with the build command? when the header.fc file still exists in the output

Dmitry: import "@stdlib/deploy";   contract TestNested with Deployable {   owner: Address;   init(owner: Address) {     self.owner = owner;      dump("Nested----init");     try{       dump("Nested----init@myAddress-0");       dump(myAddress());       dump("Nested----init@myAddress-1");     } catch (e) {       dump("ERROR-----init");       dump(e);     }    } }  contract TestInit with Deployable {   // Empty init() function is present by default in all Tact contracts   // since v1.3.0, so the following may be omitted:   //   init() {     try{       dump("init@TestInit-0");       dump(myAddress());       dump("init@TestInit-1");       dump(myAddress());       let init: StateInit = initOf TestNested(myAddress());       dump("init@TestInit-2");       send(SendParameters{         // bounce is set to true by default         to: contractAddress(init),         value: 0,         mode: SendIgnoreErrors | SendRemainingValue, // don't stop in case of errors         code: init.code,         data: init.data,         body: "Hello, World!".asComment(), // not necessary, can be omitted       });     } catch (e) {       dump("ERROR@TestInit");       dump(e);     }   } }   what about this one?    console.log     #DEBUG#: [DEBUG] File contracts/test_init.tact:28:7     #DEBUG#: init@TestInit-0     #DEBUG#: [DEBUG] File contracts/test_init.tact:29:7     #DEBUG#: EQCXrn_WIyKUCljokzAeTUAOozQiwhgncoUi8poJseJjvqwN     #DEBUG#: [DEBUG] File contracts/test_init.tact:30:7     #DEBUG#: init@TestInit-1     #DEBUG#: [DEBUG] File contracts/test_init.tact:31:7     #DEBUG#: EQCXrn_WIyKUCljokzAeTUAOozQiwhgncoUi8poJseJjvqwN     #DEBUG#: [DEBUG] File contracts/test_init.tact:44:7     #DEBUG#: ERROR@TestInit     #DEBUG#: [DEBUG] File contracts/test_init.tact:45:7     #DEBUG#: 135        at SmartContract.runCommon (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:221:21)

Dmitry: 135 = Code of a contract was not found

Son Pin: Try to build before test? (reply to 34188)

Dmitry: the build is fine.    but ill try to make it a separate contract

Anton: there not enough information from your side to understand the issue here, yarn build can do anything (reply to 34187)

Anton: you should either use Blueprint or npx tact

Dmitry:   console.log     #DEBUG#: [DEBUG] File contracts/test_init.tact:11:7     #DEBUG#: init@TestInit-0     #DEBUG#: [DEBUG] File contracts/test_init.tact:12:7     #DEBUG#: EQCTxvGeJt7AIOaEQLeFVYp5JYKaKgJdD_JO854ncTm2B_We     #DEBUG#: [DEBUG] File contracts/test_init.tact:13:7     #DEBUG#: init@TestInit-1     #DEBUG#: [DEBUG] File contracts/test_init.tact:14:7     #DEBUG#: EQCTxvGeJt7AIOaEQLeFVYp5JYKaKgJdD_JO854ncTm2B_We     #DEBUG#: [DEBUG] File contracts/test_init.tact:27:7     #DEBUG#: ERROR@TestInit     #DEBUG#: [DEBUG] File contracts/test_init.tact:28:7     #DEBUG#: 135  the same

Dmitry: and i built it using both  npm run build TestInit  npm run build TestNested

Truong: I run the build command (reply to 34192)

Anton: what Tact version are you using? ``` npx tact --version ``` (reply to 34199)

Truong: sr I cloned https://github.com/howardpen9/staking-in-tact and ran yarn install + yarn build. I cannot run npx tact --version command (reply to 34200)

Anton: you are using an outdated version of Tact https://github.com/howardpen9/staking-in-tact/blob/af7d35fea411ba8af5bf99ca77e6394111beefa1/yarn.lock#L664 v1.1.2 (reply to 34201)

Anton: upgrade the packages and see if you still get that error

Dmitry: Any ideas? (reply to 34188)

lee: how to translate string to cell?

0xCryptolia: string.asComment() (reply to 34208)

lee: thanks ,i will try

lee: result : wrong jetton content

lee: //let str = "{name: \"DDtest.jetton\",description: \"This is description of Test Jetton Token in Tact-lang\",symbol: \"DDt.t\",image: \"https://avatars.githubuserntent.com/u/104382459?s=20\",}";         self.content = str.asComment();

lee: how to init jetton content in contract

Konstantin: HI there! Is any one know why contract address is different if I'm trying get this adres directly from my contract and if I'm getting that address from jetton standard method  There are examples:  contract = await MyWallet.fromInit(gamer.address, jetton.address);  contract.address == jetton.getGetWalletAddress(gamer.address); ---> FALSE   But code for getGetWalletAddress is the same like      get fun get_wallet_address(owner_address: Address): Address {         let init: StateInit = initOf MyWallet(owner_address, myAddress());         dump(contractAddress(init));         dump(owner_address);         dump(myAddress());         return contractAddress(init);     }  so all values are correct owner_address and myAddress() in contract the same as in MyWallet.fromInit(gamer.address, jetton.address) but always contractAddress(init) not equal  await MyWallet.fromInit(gamer.address, jetton.address).address  Thanks!

ABCDE: Hi all! Tell me, how much does an nft purchase transaction cost on average now? Any NFT, in any service. My tests (not NFT) have a high commission.

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Hello there! Is there a way to check which jetton was sent for the contract?

Illia: Interesting, why it's not called toCell? It would be more intuitive... (reply to 34209)

︎ ︎Loren Terw: ❕Срочно ищу Func разработчика с опытом в TON ❕ Потфолио в лс

Illia: very nice explanation; didn't know that comments are prefixed strings; thanks (reply to 34232)

Konstantin: Why contract address is different if get address from original contract and after that get it from parent? same code, works different.... WHY???

Illia: can u give an example of code that demonstrates such behaviour? (reply to 34237)

Konstantin: contract Item with Deployable {     // ----- other code here      get fun get_my_address(): Address {         let init: StateInit = initOf Item(self.owner, self.master);         dump("ITEM");         dump(self.owner);         dump(self.master);         dump(contractAddress(init));         return contractAddress(init);     } }  contract Master with Deployable, OwnableTransferable {     // ----- other code here      get fun get_item_address(owner_address: Address): Address {         let init: StateInit = initOf Item(owner_address, myAddress());         dump("MASTER");         dump(owner_address);         dump(myAddress());         dump(contractAddress(init));         return contractAddress(init);     } }  where is   dump(self.owner); dump(self.master);  absolutely identical (reply to 34238)

Konstantin:   console.log     #DEBUG#: ITEM     #DEBUG#: EQAo-FxhMEmnBKIy0KNQmSB696ozXqBO9WGmsIhf3xEB-7zF     #DEBUG#: EQDVnS5QfXUBdXnSKXQpvoJSpeN4k6Rnf6cTfnimJBNZiryp     #DEBUG#: EQC8MdQOQhaR0_i7mxM2aWnu5JIW7634bMrdi7234pPMn1Xb    console.log     #DEBUG#: MASTER     #DEBUG#: EQAo-FxhMEmnBKIy0KNQmSB696ozXqBO9WGmsIhf3xEB-7zF     #DEBUG#: EQDVnS5QfXUBdXnSKXQpvoJSpeN4k6Rnf6cTfnimJBNZiryp     #DEBUG#: EQCZxYAqIOgjpMRL2EskZoQ6NP31yH9uCqt-90u7IYPSzggk  there is a logs from tests (reply to 34239)

Dmitry: error: return type of an assembler built-in function must have a well-defined fixed  width  <...>cast(((int, int, int, int, int), (int, int, int, int, int, int), (int, int, int, int, int, int)) v) asm "NOP";  this one seems to be the limit for a function  17 ints

Dmitry: where can i look for limitations of structs/tensors

balthy: Hi  what is @interface("") in tact?

Dmitry: afaig it generates some type of getter in func implementation which responds with supported interfaces (reply to 34248)

balthy: where i can find the list of this interfaces? (reply to 34249)

Pouya: Hi 🔋 I create an issue for tact about some feature for add something like modifier in solidity or decorators💻  Please review it and comment your opinion or idea about it here or in GitHub👍  https://github.com/tact-lang/tact/issues/513

Anton: thanks! i just did (reply to 34252)

Anton: there is no list, you can add interface annotation as you see fit (reply to 34251)

balthy: it means the interfaces like : @interface("org.ton.jetton.master") not defined anywhere?  but what is the use case? for example, in solidity, the EIP codes are use for interface supputrt (reply to 34254)

Anton: eventually it can become some kind of standard, see here: https://docs.tact-lang.org/ref/evolution/overview (reply to 34255)

balthy: I can't understood  could you please explain more? thanks (reply to 34256)

Anton: there is several docs if you follow the link, I think those are pretty-well written (reply to 34257)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Hello there! Is there a way to check which jetton was sent for the contract?

Dmitry: getter functions CAN be used in the same contract?

Jamilu: Yes (reply to 34267)

Dmitry: thx

Jamilu: Homster (reply to 34267)

Dmitry: ? (reply to 34270)

Sumit: can i combine it with SendRemainingValue ? (reply to 33993)

Sumit: what would be the effect. amount will stay 1, and the gas will be paid from the current transaction’s value instead of SC? (reply to 34275)

Konstantin: Any ideas? Please (reply to 34241)

Sumit: i want the amount to stay the same (that i send in value). not increase. and want to pay from inbound message. so i should just use SendRemainingValue ? (reply to 34278)

Sumit: thanks (reply to 34280)

Sumit: is there an example available for a liquidity pool contract in tact?

— 2024-06-29 —

Konstantin: Is any one had same situation? How to get same contract address in both methods? Thanks! (reply to 34237)

cindy: Hi,bro,I am using your tact code on Swap.I have never successed,can you share me your tact example? (reply to 34284)

Sumit: You are probably sending incorrect arguments (reply to 34290)

cindy: I am testing the swap in tact. I am trying to swap RED to Blue. The address has been replaced to Route wallet address of Red token. (reply to 34291)

cindy: I can't find the wrong arguments.so confused. (reply to 34291)

cindy: My test is also simple. The client address has minted Red and Blue tokens. I just called the test function to swap the token.

Illia: so basically you derive addresses differently  you derive address for master from just owner address  we can note this as the following: hash(owner_address) -> master_address  but for item you derive the address like hash(owner_address, master_address) -> item_address  as you see, you provide different arguments when calculating the address of the contract; that's why addresses are different (reply to 34277)

Illia: if you want to get the same address using the getter function, then you need to store this addresses somewhere  the most straightforward solution is to put a getter for Item inside the Master  like using self.owner field  like get fun master() -> return myAddress() and get fun item() -> return initOf Item(self.owner, myAddress()) (reply to 34289)

Illia: what contract is that? (reply to 34295)

cindy: I am testing call stonfi contract. (reply to 34299)

Illia: You are likely missing out on the message body, it can't be hello joe take a look at docs.  https://docs.ston.fi/docs/developer-section/sdk/dex-v2/swap (reply to 34300)

cindy: Hi,thanks.I have put the message body in the receive contract to test. Client send hello Joe to my contract,then the contract send message body to the stonfi contract. (reply to 34303)

@Osad2021: I wont oppen new telegram wallet

jay: Hi guys, I use newAddress(0, 0); init a zero address, but I got an error "Error: Invalid address hash length: 0" when I build contract. How can I fix this? thank you.

Anton: Are you sure zero is a valid address? (reply to 34309)

Dmitry: It can be used as alternative way to burn tokens (reply to 34312)

oluwatobi: 0 is a valid address in Ethereum but I'm not sure it is valid in Ton

jay: i saw zero address from tact examples (reply to 34312)

jay: https://tact-by-example.org/02-addresses

poppa: There is a zero address and you are referencing it properly, but it may not perform the way you’re expecting as there’s no receive logic (reply to 34315)

Marley Cushi: Pls let’s knw how to receive the giveaway pls

jay: But if I use zero address, the build will failed. (reply to 34319)

Illia: Try newAddress(0, 0x0) (reply to 34321)

Dmitry: Sounds like it won't matter (reply to 34322)

Dmitry: Is there a way to dump in binary format?

Illia: nope as of now (reply to 34324)

Anton: as a temporary workaround you can block constant evaluation by using a variable:  import "@stdlib/deploy";  contract Test with Deployable {      get fun newAddressZero(): Address {         let zero = 0;         return newAddress(0,zero);     } } (reply to 34321)

poppa: It’s a good interim solution (reply to 34327)

— 2024-06-30 —

jay: Is there a compiler bug? (reply to 34327)

jay: How can I receive TON on Tact? myBalance always return 0

jay: Very difficult to understand.

jay: How to recieve ton coin when user call my contract function?

Illia: Users should attach some when sending the message to your contract (reply to 34359)

jay: yeah, but the contract myBalance still return 0.

Illia: Do you use Deployable trait? (reply to 34364)

Illia: If yes, then:  You need to override const storageReserve: Int = 1_000_000_000  It will store 1 toncoin on your account if you deploy it (reply to 34364)

Illia: If you want to store extra toncoins, you need to use nativeReserve() (reply to 34364)

jay: Thank you, I used the Deployable trait.

jay: https://docs.tact-lang.org/ref/core-advanced#nativereserve

jay: I'll try to understand nativeReserve.

jay: It's working fine.

jay: I would rather implement a contract that can accept transfer

jay: I succeeded and was able to receive the transfer TON.

Illia: Please not that 1 is 1 nanotoncoin  1_000_000_000 (reply to 34372)

Illia: You can also just leave your receive empty  If you leave it empty, then all toncoins will be stored (reply to 34374)

Illia: Cause you don't call self.notify that will return excessive toncoins (reply to 34376)

jay: The second arg is mode.

jay: mode 1 means "Reserves all, but the specified amount of nanoToncoins.", so is it correct?

Illia: You can do this one as well if you want, but if you don't return toncoins back, then there is no need to reserve any (reply to 34379)

Illia: @expectfun (reply to 34381)

jay: https://tact-by-example.org/all These examples are not enough. Can Tact has more examples?

Illia: What types of examples do you want? If you provide me with some topics, I can create more.  I was thinking about explaining the multi-action transactions, is this relevant? (reply to 34384)

Illia: Btw there are some examples in tact repo https://github.com/tact-lang/tact/blob/main/examples/rugpull.tact (reply to 34384)

jay: merkle tree, deposit and withdraw. thank you (reply to 34385)

jay: does ton have some grants plan, improve the developer ecosystem.

Illia: Mm I'm currently building merklee trees for tact btw  I'll release repo @henchtab/merkle-tree in upcoming weeks (reply to 34391)

Illia: https://github.com/henchtab/nenuma/blob/main/packages/contracts/contracts/broker.tact#L45  Take a look at this code.  I've implemented withdrawals/deposits recently. I think it can be improved and turned into a trait, but still that's a good thing to study from (reply to 34391)

killerClown: Hi everone, I have contract with USDT and a Jetton. I was trying to transfer it out. But it was failing all the times.  For USDT, the error code was exit code 9, and other jetton it was 708.  Here is the code, and "msg.tokenWallet" is the token wallet associated with the jetton for this particular contract.   Is there an issue with the code or am I missing something here.  receive(msg: TokenTransferWithWallet) {          self.sum -= msg.amount;          send(SendParameters{             to: msg.tokenWallet,             value: 0,             mode: SendRemainingValue,             bounce: false,             body: TokenTransfer{                     query_id: msg.query_id,                     amount: msg.amount,                     destination: msg.destination,                     response_destination: msg.response_destination,                     custom_payload: emptyCell(),                     forward_ton_amount: msg.forward_ton_amount,                     forward_payload: emptySlice()                 }.toCell()             }         );     }

jay: Thank you very much.  I'm trying on an airdrop contract.

Illia: Other Jetton throws 708 because the body is empty   Go to the source code and find out where it throws the error with code 708 (reply to 34398)

Illia: Exit code 9 is  Cell underflow  That's like when you try to read 80 bits when the slice has just 10  That's probably cause u are missing your body as well (reply to 34398)

Anton: https://github.com/ton-society/grants-and-bounties (reply to 34393)

killerClown: Okk Thanks, will try it out (reply to 34401)

🎚Дмитрий: hello guys!  i want to do a 2d game in the 8xr engine, but i cant find any tutorials can you give me any direction?

Illia: There's no 8XR engine tutorial, but you can interact with ton   https://docs.ton.org/develop/dapps/ton-connect/web  Take a look at tact by example and blueprint for wrinf smart contracts (reply to 34406)

Illia: @expectfun

balthy: how decimals handle in Jettons?

jay: Is there anyone can block this scam ad?

🎚Дмитрий: hello my friends!  please tell me can i use adobe animate cc project for integration with ton api if i will compilat it to webgl? or i should use unity instead

Illia: U should be able to make js calls (reply to 34418)

Illia: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md  You add decimals into metadata   {    "name": "Huebel Bolt",    "description": "Official token of the Huebel Company",    "symbol": "BOLT",    "decimals": 9,    "image_data": "..." } (reply to 34416)

Bulochka💦: Is it neccessary to check values on != null — that i receive from struct with          require(msg.id != null, "Incorrect id");  if struct/message doesn't have ? types of variables ? message UserPayment{     id: Int as uint64;     amount: Int as coins; }

Konstantin: thanks for the advise, do you have any specification of that?  Because it not clear, how it works. Also I found same issue https://github.com/tact-lang/tact/issues/516   Also not understood why you think that is different address if   Item code         let init: StateInit = initOf Item(self.owner, self.master);                  dump(self.owner);  // EQAo-FxhMEmnBKIy0KNQmSB696ozXqBO9WGmsIhf3xEB-7zF         dump(self.master); // EQDVnS5QfXUBdXnSKXQpvoJSpeN4k6Rnf6cTfnimJBNZiryp         dump(contractAddress(init)); // EQC8MdQOQhaR0_i7mxM2aWnu5JIW7634bMrdi7234pPMn1Xb << -- DIFFERENT  and   Master code         let init: StateInit = initOf Item(owner_address, myAddress());          dump(owner_address);  // EQAo-FxhMEmnBKIy0KNQmSB696ozXqBO9WGmsIhf3xEB-7zF         dump(myAddress());  // EQDVnS5QfXUBdXnSKXQpvoJSpeN4k6Rnf6cTfnimJBNZiryp         dump(contractAddress(init)); // EQCZxYAqIOgjpMRL2EskZoQ6NP31yH9uCqt-90u7IYPSzggk << -- DIFFERENT  In both examples is the same initial addresses for  initOf Item - the values are the equal  Thank you @pantemon! (reply to 34297)

MdRAISH: Good 👍😊

Bulochka💦: Ok, i have another question Maybe someone knows any example of contract, which release escrow contract functionality? For example stores money before some message and after that sends money to the recipient? (reply to 34430)

Illia: In this example i release (withdraw) toncoins when the withdraw message is received from the owner https://github.com/henchtab/nenuma/blob/main/packages/contracts/contracts/broker.tact#L45  that's may be something you are looking for (reply to 34441)

balthy: i got 500 error when use this url for deploy   what URL should I use? (use /send + BoC)

Illia: what's the version of  tact-compiler you're using?  i've just built a demo using you code and run the tests using tact-lang/compiler v1.4.0  https://github.com/pantemon/laughing-octo-chainsaw.git  i have no problem as you described  i've also tried to clone the repo of the author of the issue, and this repo simply didn't compile 🤷‍♂️  can u upload you code on github and share? 'cause i don't see how it can be wrong  btw calling like initOf inside the contract itself is a bit unusual  https://github.com/pantemon/laughing-octo-chainsaw/blob/main/contracts/master.tact#L13  what's the use case?  in this design, i would simply use myAddress()  it may be the reason why you got different addresses as tact < v1.4.0 may had the issue compiling such code (reply to 34434)

Illia: I'm experiencing similar issue when trying to await the transaction. I may try toncenter's indexer v3 (reply to 34445)

balthy: with TonClientV4? (reply to 34452)

Illia: if i want to send a regular message; there's no problem, but for some specific api routes, it gives me 500 now (reply to 34453)

balthy: how shoud i send the transaction from code?

balthy: on sandbox testnet

Illia: https://github.com/pantemon/laughing-octo-chainsaw/blob/main/contracts/master.tact#L13  you may have a look there (i've literarly just built this smart contract) (reply to 34455)

10x: is there a good guide on developong NFT collections with tact?

Illia: I haven't seen any. You should create your own contract which implements NFT standard  something like this but for NFTs  https://tact-by-example.org/07-jetton-standard (reply to 34462)

— 2024-07-01 —

Illia: I've been just exporting types for my contracts via monorepo    "type": "module",   "main": "dist/index.js",   "module": "dist/index.mjs",   "types": "dist/index.d.ts",  so i've added these lines of code into my project, and then my contracts stopped compiling and i started getting some error like cannot compile modules...  now sure if that's a bug, but just wondering what's the cookbook solution for exporting types via monorepo  the snapshot of my code that doesn't compile is on the branch la-module  github.com/henchtab/nenuma/tree/la-module

Illia: i've also wanted to implement wait for the transaction feature  and i need to get the transaction boc to do that  is there a way to get it using tact-generated wrappers?  'cause i found that send method returns just void 😭

Vlad: Having issues with "@stdlib/deploy";  Trying to deploy a contract, so that it sends a message to another contract inside of init() function.  Nevertheless, while testing, there is no outgoing messages ,except of the gas exccess sent to deployer

Vlad: I think it is a bad idea in general to mix contracts with frontend/backend   you will face a lot of module errors (reply to 34467)

Vlad: Wonder how the library is connected to Init() function? https://github.com/tact-lang/tact/blob/main/stdlib/libs/deploy.tact (reply to 34471)

Vlad: hm, still wonder why DeployOk message is sent before my custom message from init() function, thus later not executed (reply to 34474)

Vlad: getter is not an option, since message is not just info, need to pay gas  Looks like I would have to find some workaround   P.S. I am trying to put the jetton wallet address for my contract inside of it (using discoverable jettons) (reply to 34477)

Anton: init is basically a regular receiver, we just set a bit in the contract storage so it’s only executed once (reply to 34476)

Vlad: why can't it send messages though? (reply to 34479)

Anton: it can (reply to 34480)

Vlad: Hm, then is the problem with library? (reply to 34471)

Anton: I need a reproducible example: code, sandbox tests and how to build and run everything

Vlad: here is the contract code https://github.com/Cosmodude/Nexton/blob/main/contracts/JNexTon.tact#L56  and here is the test for it  https://github.com/Cosmodude/Nexton/blob/main/tests/JNexton.spec.ts#L124 (reply to 34483)

Vlad: Hey folks, just out of curiosity: why TON took a path of its own set of instucrions set therefore its own languages: fift and func. Why not just WASM: it has a rich instructions set: https://webassembly.github.io/spec/core/appendix/index-instructions.html It would make everyone's life so much f-ing easier, no fift no func no tact, just write it in rust or javascript and compile to wasm - done! I think is the biggest resistence for developers to start with TON, at least for me :(

Vlad: That’s a good question.  Not sure that WASM is compatible with TVM though (reply to 34488)

Vlad: for sure not at this point, its a long gone decision 😂 (reply to 34489)

Dmitry: What can be the problem here? (reply to 34188)

Illia: Do you have any receive functions? Tact contracts throw 135 exit codes if they receive messages they don't recognize. If you add receive, there should be no error (reply to 34491)

Dmitry: That's the whole contract code (reply to 34492)

Dmitry: Deployable means they got deploymessage receivers

Illia: Do u send deploy message then? (reply to 34494)

Illia: If you send anything else then Deploy then it throws 135

Dmitry: I guess there's something with contract lifecycle and especially init (reply to 34492)

Dmitry: Yes. The default test code sends deploy message (reply to 34495)

Dmitry: It throws INSIDE init function (reply to 34496)

Dmitry: Not before not after

Dmitry: It throws on a row with Initof operator

Dmitry: It cannot get initof inside init func for some reason

Illia: Sending messages inside init is a bit unusual. I've been exploring what it builds into and literally init is just a faction that hashes code of the contract with data, and this data cell is constructed of the init. It's not supposed to run any message. In my code, I just make custom Deploy messages as I also require custom properties not known at the init time (reply to 34497)

Dmitry: But it doesn't throw on sending the message. It falls on initof

Illia: That's because you try to call myAddress but the contract is not deployed yet (reply to 34504)

Dmitry: My idea is to deploy one contract that will immediately deploy all of its util subcontracts (reply to 34503)

Dmitry: My address does work (And it should cause its not about deployed/not deployed but making a hash out of initial data, that is present in init) (reply to 34505)

Illia: Hm very strange, all right I will just go into silent mode and see what happens out there; I had lots of bugs with it in tact 1.3.0 so maybe it's different now, I just don't do any complex logic inside the init now

Dmitry: And i CAN make a custom deploy receiver but... For some reason i want to understand why the init is not suitable for this from technical perspective (reply to 34506)

Dmitry: It seems to be that init can have all the info that other functions have

Dmitry: "with it" = with init func? (reply to 34508)

Dmitry: 👉👈 im sorry for CAPS. It's only to make emphasis, not to be harsh (reply to 34508)

Illia: Yeah, with init (reply to 34511)

Illia: That's great. I just can't be helpful right now so can't be that objective. Very keen to know the answer. If you advance forward somewhere, please let me know (reply to 34512)

Mantrax: gm, I've read the doc but I don't understand how can I make a kind of mapping suitable for a large amount of entry ?

Mantrax: thanks (reply to 34518)

Nerses: what can cause such error during compilation npm ERR! could not determine executable to run  ?

Illia: what command are u running? (reply to 34524)

Nerses: npx blueprint build (reply to 34525)

Nerses: I have created blueprint project then changed directory of contracts I think it can cause that.How to init new blueprint project in directory of contracts without conflicting existing project

ㅤ: Can I accept Jetton tokens with message on my smart contract? The most near example is calling a function with sending ERC20 token, can we do that in tact?

Illia: yes, you can do, you need to listen for TokenTransfer notification  https://tact-by-example.org/07-jetton-standard#:~:text=message(0xf8a7ea5,the%20jetton%0A%7D  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md  https://tact-by-example.org/07-jetton-standard (reply to 34530)

ㅤ: Can you send some examples, from GitHub maybe ? (reply to 34537)

Pouya: Is anyone here who knows about tact and ton contracts audit?

Mantrax: I don't understand in https://tact-by-example.org/07-jetton-standard for in TokenTransfer what does this mean :         let init: StateInit = initOf JettonDefaultWallet(self.master, msg.destination);           let walletAddress: Address = contractAddress(init); We are creating a JettonDefaultWallet contract for the receiver ?

Sergey: yeah. you should do it for two reasons: 1. you don't know the jetton address of recipient 2. user may not even have such jetton, so it is necessary to deploy wallet.   that's why you need state init (reply to 34542)

Mantrax: and if the receiver already has a JetonWallet ? (reply to 34543)

Sergey: so everything is going to be okay (reply to 34544)

Sergey: contract will be deployed at the same address and won't change anything

Mantrax: oh ok

Mantrax: ty

Sergey: np

Mantrax: and about the randomness ? Is it really trustable?

Mantrax: I mean with randomInt();

Dmitry: Depending on usecase (reply to 34552)

Mantrax: if I want to use it like a lotery (reply to 34554)

Dmitry: If it is not about millions of dollars -> may be okey (reply to 34555)

Dmitry: Validators can theoretically cheat

balthy: is there any way to deploy contract in the blueprint except call a function of that?  i want to first deploy it(in beforeAll in test) and then try to call the functions

Dmitry: You can create variable in "describe" callback and init it in before all. Then you can 'try to call the functions" in test cases (reply to 34558)

balthy: when i use init method and then try to call a get method, I got a call a non-active contract error (reply to 34559)

Dmitry: You should send deploy msg in before all

Dmitry: And btw it should be async

balthy: how should I send just a deploy message? i do not want to invoke any receive or any method of my contract just want to deploy it (reply to 34561)

Dmitry: You can deploy contract with receive (reply to 34563)

Dmitry: It is the way

Dmitry: You can send any msg(with code and init data) but as convention you should send deploy msg

Dmitry: The other way around you can read smth about snapshots. It can be smth you are talking about

Dmitry: It is ~saved blockchain state.

Dmitry: You can read about it in ton sandbox repo

10x: anyone familiar with NFT contracts on TON using TACT? I’m looking at the example https://github.com/howardpen9/nft-template-in-tact, wondering how to add: - paid mints - free mint w/ merkle tree (whitelist)  thanks! looks cool so far

balthy: Hi   i use this repo to create and deploy jetton but while deploy the TonClient4 not work and I got error   any solution?   https://github.com/howardpen9/jetton-implementation-in-tact

User<7085045095>: Hy

Dmitry: you can use hashed user secrets as random seed: 1. Starting pre-game 2. Users pay for participation 3. Users create own secrets. 4. Users hash it and send this hash in the game contract. 5. You stop pre-game. Users can enter the game no more. 6. Game starts. 7. Timelocked contract wait for players to reveal their secrets. 8. When the time ran out one can end the game. The random seed is hash of users' secrets.   If participation is too cheap one can create lots of fake players and reveal their secret only if it makes him win. You can make people pay a big fee on secret sending and repay a part of it on secret reveal (reply to 34555)

Fardin: Hello i want to implement the STON into my TACT contract  for purchasing tokens what should I do?

unsphere: why is it unusual? if the main contract deploys other contracts like pools based on jetton0 & jetton1 for example it needs to use initOf to get the pool address or? https://tact-by-example.org/06-contract-deploy-another (reply to 34451)

Illia: let's define 'usual' and 'unusual'  'usual' is when you implement master-slave (or as it's also called parent-child) pattern  e.g., you have a collection, the collection deploys NFT items;  i consider that as usual as i've always worked with such code in FunC and hence now working in Tact  'unusual' this is when Todo deploys Todo, as in your example; that's when you call initOf inside the contract itself  if you're building a referral system which has a structure similar to the linked list, then yes, that's a great pattern, but I never used it on TON   btw that's an interesting task to do in FunC 'cause i literally haven't seen anyone doing that   i'm not involved with building tact compiler; if the question is to fix the problem, then just use 'usual' master-slave pattern  if the question is too figure out what is theoretically possible to do and the goal is not to fix staff, but to explore, then i'm likely to be not the best guide as i'm not involved with tact compilor development; i'm just a developer who tries to help others with building their web3 products  i've just tried to solve the problem ignoring that the question is like 'what theoretically i can achieve'  i'm very keen to see what this issues ends up with (reply to 34580)

Tiqan: Does anyone know why initof isnt working properly?

Illia: reported bug in tact v1.4.0 (reply to 34584)

Tiqan: How long does it usually take until something big like this will be fixed? And does it work in v1.3?

— 2024-07-02 —

Chinwe2: Good morning guys

Dicky: Ya (reply to 34597)

Illia: I reckon it will be fixed fairly soon. I don't have any issues with initOf btw. What are u trying to do? (reply to 34587)

Illia: Go on (reply to 34601)

Nerses: // some code           send(SendParameters{to: msg.data.__messenger,                             bounce: true,                             value: 20000000,                             mode: 0,                             body: data; });               }   in this TACT code in case msg.data.__messenger doesnt have appropriate recieve for handling that message and send fails, will some code be executed ?

Haris: Hi Guys! I want to pass map parameter type data in init function through typescript how can i do that? typescript asking me to pass Dictionary type data but i am unable to do it. Please help

Illia: If there are no receivers, then yeah, the message will bounce (if another contract bounces if there are no receivers)  If the message bounces, the state is preserved, i.e. there is no change (reply to 34605)

Illia: Have u added types for your dictionary? (reply to 34606)

Tobias: Is this a personal project or a commercial product? (reply to 34607)

Nerses: a lil bit clarification: can i say that send will work somehow seperate from other code(it doesnt have require or such code that can revert) ? (reply to 34610)

Haris: i am trying to create Dictionary type object but cant do so (reply to 34611)

Illia: There inevitably is some cost involved when interacting with smart contracts.  Storing large amounts of data on the blockchain is no good.  You need to off-chain data that you don't really need or use ton storage.  If u want to subsidize transactions for your users, then you need to implement something like Tonkeeper Battery but which funds only interactions with your smart contracts (reply to 34607)

Son Pin: how to print wallet address on Testnet with same mnemonics. using @ton/ton WalletContractV4

Illia: the send functions creates an action during the action phrase that will be executed during the action phrase  since ton blockchain is async, once you sent your message from contract A to contract B, no matter what happens to contract B (whether it rejects the transaction or processes it gracefully) the state of contract A is not changes (unlike on Ethereum where if one action fails, then everything fails; therefore you need to make sure that if you message bounces you handle it gracefully) (reply to 34613)

Illia: i'll build up a demo once get back to the computer and update you; there's a possibility that maps are not supported for inits, but i have to double-check (reply to 34614)

Nerses: thanks a lot (reply to 34618)

Illia: can u clarify your question? if you already have an instance of WalletContractV4, then you can just console.log(wallet.address) 🤷‍♂️   https://ton-community.github.io/ton/classes/WalletContractV4.html#address:~:text=address-,address%3A%20Address,-Implementation%20of%20Contract (reply to 34617)

Son Pin: this just print wallet address on mainnet. not have a property to determine network (reply to 34621)

hΔrdshell: anyone have examples of building a jetton with its meta data? ex. image, url, name, symbol etc?

User<6319350984>: https://t.me/mysterytokenonton

Illia: exactly (reply to 34625)

User<6319350984>: Please check this out , MYSTERY Token on Ton (reply to 34629)

Illia: https://ton.org/address/  you can sub your address into these util to see how different addresses behave  if you want a testnet address, then you can convert it into any other by changing the prefix. i.e., the first letter (so if you want a bouncable testnet then you need the first letter to be k) and also you need to change the postfix, i.e., the last 4 letters (i.e. change them for IslI if you're doing bounceable testnet) (reply to 34627)

Illia: are u looking for onchain or offchain metadata? (reply to 34628)

hΔrdshell: onchain (reply to 34633)

hΔrdshell: contract Tea with Ownable, Deployable {      totalSupply: Int;     mintable: Bool;     owner: Address;     content: Cell?;  the content cell contains the image, name, symbol etc. but I dont see how to provide that info upon deployment in blueprint or any examples

Danil: U have to use js file with config it

hΔrdshell: do you have an example?

hΔrdshell: content i feel should be a cookie cutter thing so many might have it done.

Illia: do you have init in your contract? you need to pass your content though the init function (that's the easiest way, alternatively, you can create a ChangeContent receiver and update content if you're owner) (reply to 34636)

hΔrdshell: yea I know I have content as an arg, im more concerened about the actual deployment file (reply to 34640)

hΔrdshell: just an example structure

Illia: afaik there're no beginner friendly tutorial for onchain metadata  basically, the idea is that you need to encode the data you need into a new Cell object so that it matches with these standard: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md  this is an example of how encode cell that matches the TEP64 standard for offchain metadata  https://docs.ton.org/develop/dapps/tutorials/collection-minting#encode-offchain-content:~:text=export%20function%20encodeOffChainContent(content%3A%20string) (reply to 34641)

hΔrdshell: ok thanks, but you dont already have an example deploy file for me? (reply to 34643)

Danil: $$deploy

hΔrdshell: wut? lol (reply to 34645)

Matthew: i need a javascript or typescript client to query on Ton blockchain same etherjs or web3js on EVM , Do you have any suggestions?

Illia: https://github.com/ton-core/ton (reply to 34647)

Sergey: if you'll create a project via blueprint you will have an example of deploy file (reply to 34644)

hΔrdshell: i found a helper file to convert the content data i think i should be good now (reply to 34649)

Matthew: Is there a tool that can help me calculate the fee for storing my smart contract data for 1 year?

Sergey: it is aprox 0.00000575 ton per kb per year (reply to 34651)

Anton: Take a look at this PR: https://github.com/tact-lang/tact/pull/520  And help us reproduce your issue (reply to 34584)

Sergey: hm, probably my mistake.  but tact playground says following:  Storing 1000 32-bit integers only costs 0.023 TON per year by comparison.  1000 32-bit integers ~ 4000kb. that's how i calculated price per KB (reply to 34653)

Sergey: now i see my mistake)) it's price per byte, not per kb

Matthew: too expensive 😢 for fully onchain dapp

Matthew: Will the storage fee be charged each time the contract stores additional data, or will I pay periodically

Illia: there's no tool for that as far as i'm aware of  that's good idea to create one as i was looking for something like that by myself  you can just set 0.05 and be sure that your contract will be alive for at least a few years (reply to 34651)

Matthew: if smartcontract store many data i think 0.05 ton not enough for some day 😅

Illia: the storage fee is charged per one second as contract exists onchain  it means that if you add new data into your contract, the storage fee per second will increase  you will have to pay higher storage fees if you don't use your contract for a while to keep the reserve in place (if you're doing override const storageReserve = 10_000_000) (reply to 34659)

Illia: 0.05 is like storing NFT item with offchain data for 100+ years  should be enough for most of the contracts depending how long you want them to be alive; unless you're storing your image onchain (reply to 34663)

Matthew: So it means if my contract has frequent transactions then the storage fee per second will not increase ?

Haris: Please help (reply to 34606)

Haris: Thanks let me check (reply to 34668)

Illia: imagine you contract's balance is 1 ton  let you contract eats 0.1 ton per second  if time = 0s, then you balance is 1 ton if time = 1s, then you balance is 0.9 ton if time = 2s, then you balance is 0.8 ton  now someone sends some transaction to your wallet, e.g., message Add and your contract calculates the result and, using self.notify, sends the result back to the owner  the value which arrived with Add message was 0.5 ton  the total transaction fees is 0.1 ton  as a result, when the transaction arrives at t = 2s, you pay 0.3 ton worth of fees and the sender of the message gets back 0.2 ton  that's because you paid 0.1 ton of fees + the contract locks 0.2 ton from you for future storage costs   in fact, you will not have such high fees i just made them high to make the math clear (reply to 34666)

Matthew: so i should deploy new contract every year 😅

Matthew: If so, the longer a smart contract is deployed and the more data it has, the higher its fee will be. Imagine an nft or a token whose fees increase over time: first year fee transfer is 0.1 ton, second year fee tranfer 0. 2 ton,  ten years  5 ton 😅 while value of nft is 0.1 ton (reply to 34670)

Valli Nayagi: import "@stdlib/deploy";  struct Details {     level: Int as uint256;     duration: Int as uint256; }  contract TactCounter with Deployable {      myMap: map<Int as uint256, Details>;      init() {         self.myMap = emptyMap();     }     receive("SetMap") {         let det = Details{             level: 23894,             duration: 600         };         self.myMap.set(12345, det);     }      get fun getMap(): Details? {         return self.myMap.get(12345);     }     }

Valli Nayagi: How to edit the value in duration to 900? Is there a way to edit values in map?

Illia: the storage reserve is topped up only once  so if i continue my example,  t = 3s, contract's balance = 1 ton again t = 4s, contract's balance = 0.9 ton t = 5s, contract's balance = 0.8 ton (reply to 34672)

Illia: you just do  let abc = Details{   level: 23894,   duration: 900 };  self.myMap.set(12345, abc); (reply to 34674)

Matthew: fee per second is fixed at it init contract for depend on data on contract

Illia: yes, it depends on the total number of cells the contract is using  the storage fee is paid for the contract's code ('cause ultimately all the smart contracts are bags of cells)  and for the data stored at the c7 (which is a cell as well) (reply to 34679)

Matthew: example if contract storage info of  1000 user, fee per second 0.1 2000 user fee per second still 0.1 for morethan. i think more than, so back to my above example if i have an NFT,  on first year my nft have 1000 holder, transfer fee is 0.1 ton,  but on second year my nft have 1 milllion holder, transfer fee is maybe 1 ton per transfer

Sergey: why would you need to store info about all your nft holders? (reply to 34681)

Illia: https://docs.ton.org/develop/smart-contracts/fees  Have a look at this. That's a comprehensive guide.  You must avoid storing your NFTs in the hashmap. The fees for hashmaps depend on the number of elements you store. That's unpredictable. (reply to 34681)

Danil: Anybody have a js that could receive jettons from ownerAddress?

Danil: An example

Nerses: having only address of smart contract how I can check f it has receive method for certain type of message ?

Nerses: It is something like solidity interface

Illia: There are no Solidity-interfaces-like feature as of now. AFAIK it's planned for Q3 this year (reply to 34695)

Nerses: thanks a lot (reply to 34697)

Illia: You can expect that something has to have a given receiver. If someone messes this up, you can notify them by sending back the bounced message (if the other contract doesn't exist or bounces if it receives unknown message) (reply to 34694)

Nerses: so having only address I can know if ithat contract implements some certain methods ? (reply to 34701)

🦁: Hey…

Illia: Btw do you have any links on discussions of the interface standards as well as guidance for sharing contracts on TON? I've seen that they are in the roadmap, but I'm not sure if that's possible to see some intermediary working (reply to 34701)

Nerses: will i pay transaction fee for this getter     get fun getHTLCDetails(hashlock: Int): HTLC? {         return self.contracts.get(hashlock);     }  ?

User<6442034874>: Hello, I need some help  import "@stdlib/deploy";  message Send {     contract: Address; }  message(0x5fcc3d14) Transfer {     query_id: Int as uint64;     new_owner: Address;     response_destination: Address?;     custom_payload: Cell?;     forward_amount: Int as coins;     forward_payload: Slice as remaining; }  contract TestAddress1 with Deployable {     receive(){         acceptMessage();     }     receive("print"){         send(SendParameters{             to: sender(),             value: 0,             bounce: false,             mode: SendRemainingValue,             body: myAddress().toString().asComment(),         });     }      receive(msg: Send) {         send(SendParameters{             to: msg.contract,             value: 0,             bounce: false,             mode: SendIgnoreErrors,             body: Transfer {                 query_id: 0,                 new_owner: sender(),                 response_destination: myAddress(),                 custom_payload: emptyCell(),                 forward_amount: 1,                 forward_payload: emptySlice()             }.toCell()         });     } }  async function callContract() {     const body = TonCore.beginCell()                         .storeUint(0x579c7489, 32)                         .storeAddress(TonCore.Address.parse('kQBab3hZsSdRFFs-O5BOlIjB4mgawaAcbDjkmC0p0lLfwFLN'))                         .endCell();      const transaction = {         messages: [             {                 address: 'EQB6wlOzNHSKOoWCE2AgfE6oVViQwsDJZKW4Cm7-0rDizdUY',                 amount: 50000000,                 payload: body.toBoc().toString("base64")             }         ]     }     await tonConnectUI.sendTransaction(transaction); }  NFT is not being sent, contract has enough for fees, is there anything I'm doing wrong?

Illia: Nope (reply to 34712)

Illia: There is some gas limit of 200k AFAIK  If you get it up, then the getter will revert. So don't do too complicated getters (reply to 34712)

Nerses: Important point.i will take it into account.Thanks a lot (reply to 34719)

Illia: Do you have wrappers generated in the build folder? You can just use them (or copy code from them). They will do the boilerplate for you (reply to 34716)

User<6442034874>: ye i got wrappers, any example of how would that work? (reply to 34721)

User<6442034874>: hmmmmmmm now im getting exit code 136 which is Invalid Address but I dont know what address is invalid (reply to 34722)

Illia: Are u using Blueprint? You can debug the contract with github.com/henchtab/shrek (reply to 34725)

Illia: Try again (reply to 34727)

Illia: I changed the link (reply to 34726)

User<6442034874>: can't get it to work, I will try to figure this out some other way (reply to 34726)

Illia: Do you have a problem with the logger (like it gives an error) or you just didn't manage to set it up? (reply to 34732)

User<6442034874>: didnt manage to set it up 😭 (reply to 34735)

Illia: Out of interest, where are you stuck? I built this package and am now wondering how to improve developer experience (reply to 34737)

Illia: Did u manage to new Logger(blockchain)? (reply to 34738)

Dmitry: you pay transaction fee when you send a transaction(ie on-chain invocation).   if you dont send a transaction but rather call getter from outside world(ie off-chain) you dont pay.    this getter can be used both in onchain tx (only calls from the same contract: eg receive() can call its contract getter ) and in offchain scenario(your frontend app calls getter by itself) (reply to 34712)

Nerses: Thnx for detailed explanation (reply to 34742)

Dmitry: not sure but getters are smth that RPC-nodes are responsible for. so whatever they choose to set will be the limit (reply to 34719)

User<6442034874>: i managed to get the contract send NFT but I am wondering now why does it not show here Received NFT (reply to 34739)

User<6442034874>: This is failing to call excess for some reason

User<6442034874>: Also there is no "received NFT" message in history which is weird too

Illia: yeah, but currently it's set for 200k gas (reply to 34744)

Dmitry: as far as i get it you can make your own node with your own config (reply to 34749)

Dmitry: but nevertheless thx for data

User<6442034874>: Again, after i called the contract I've received NFT without any notification (reply to 34745)

Illia: well, notifications of tonkeeper are not part of that discussion, you better ask guys from tonkeeper chat (reply to 34753)

User<6442034874>: what's the @ of the chat?

Illia: if you get nfts, that's great, tonkeeper pro may not have notifications yet, so you can try tonkeeper mobile and it should fix the problem

Illia: you can find that on their website https://tonkeeper.com/ (reply to 34755)

User<6442034874>: nah its same on extension, I've seen apps saying Received NFT and showing badge of the icon etc. (reply to 34756)

Hugo: gm - new to the ecosystem and looking to build smart contracts using Tact. How developped and supported is it as a programming language vs func for instance?

Illia: very well supported and excellent for learning, take a look at Tact by Example (reply to 34770)

Hugo: Thank you! Will have a look. Where is the best place to ask implementation questions? Is it here?

Illia: +, just drop a question here if you're not sure about something or DM me (reply to 34772)

Hugo: Sounds good thank you Illia!

— 2024-07-03 —

yonas: Good Morning Family .❤️ How can I used wallet ?

Key: Hello everyone, I'm building a telegram mini app, I want to authenticate users, after verifying init data from frontend by bot token, do I still need to create jwt token, or is that enough?

jay: You can choose your preferred authorization method, session or jwt are both possible.

Illia: You can also use TON Proofs to authenticate users on the backend. It's like asking them to sign some message and then verifying if the message is signed by the user's public key   https://docs.ton.org/develop/dapps/ton-connect/sign (reply to 34786)

Ryan: Hi, does anyone know how to use ECRECOVER tvm opcode in Tact? It would be great if there is an example😃

Illia: https://docs.tact-lang.org/book/functions#native-functions  You need to use native functions  https://github.com/henchtab/nenuma/blob/main/packages/contracts/contracts/subscriber.tact#L3  This is an example of how I used accept_message  The idea is that accept_message is inside the stdlib.fc and we create a binding to this function in the stdlib.fc  I have to check if there's a function for ECRECOVER  If there's no such function, then simply add by expanding the stdlib (reply to 34801)

Ryan: Ok, let me try, thanks!

Illia: tonkeeper.com (reply to 34785)

jay: How can I implement proof.begin_parse_exotic on Tact?

jay: This is the func code.

jay: I want to verify merkle tree proof on Tact.

Illia: mmm this is very nice thanks (reply to 34812)

jay: Thank you, I understood. I’ll try it soon.

jay: Can send_code used in this way?

Illia: Yeah (reply to 34816)

Illia: Btw where did u find this code? Is it somewhere on GitHub? (reply to 34810)

jay: https://github.com/Gusarich/airdrop/blob/main/contracts/airdrop.fc

jay: From here.

Illia: nice, thanks mate (reply to 34822)

unsphere: if i need to do 2 TokenTransfers in one contract function how to do it correctly with SendRemainingValue? I cant use fixed value because when i test the contract and set e.g. now() + 3 years the transfer will cost more than the fixed value. If I only have 1 TokenTransfer then value = 0 + SendRemainingValue works for all years going forward.

Nerses: can I check two addresses being same with operator ==  ?

User<6442034874>: yep import "@stdlib/deploy";  contract MessageSender with Deployable {      deployer: Address;     lastSender: Address;       init() {         self.deployer = sender(); // sender() of init is who deployed the contract         self.lastSender = newAddress(0, 0); // zero address     }      receive("who") {         if (sender() == self.deployer) {             dump("deployer");         } else {             dump("not deployer!");         }     }       receive("hello") {         if (sender() != self.lastSender) {             self.lastSender = sender();             dump("hello new sender!");         }     } }  ^ example (reply to 34830)

Nerses: thanks a lot.And one more question can foreach be used for state variables (map)  ? (reply to 34831)

User<6442034874>: hm it should be possible, never tried it before

Nerses: thanks i will try (reply to 34833)

Nerses: Line 321, col 36:   320 |         let index: Int = 0; > 321 |         foreach (key, value in self.pContracts) {                                            ^   322 |             if(value.sender == addr){ (reply to 34833)

Nerses: it doesnt work

Nerses: does this problem solved in TACT 1.4 ?

User<6442034874>: hm what does the error say

Nerses: Syntax error: expected ")" (reply to 34838)

User<6442034874>: hm

User<6442034874>: // Empty map let cells: map<Int, Cell> = emptyMap();   // Setting four entries cells.set(1, beginCell().storeUint(100, 16).endCell()); cells.set(2, beginCell().storeUint(200, 16).endCell()); cells.set(3, beginCell().storeUint(300, 16).endCell()); cells.set(4, beginCell().storeUint(400, 16).endCell());   // A variable for summing up the values let sum: Int = 0;   // For each key and value pair in cells map, do: foreach (key, value in cells) { // or just k, v     let s: Slice = value.beginParse(); // convert Cell to Slice     sum += s.loadUint(16);             // sum the Slice values } dump(sum); // 1000

User<6442034874>: i found example on

User<6442034874>: docs

User<6442034874>: https://docs.tact-lang.org/book/statements#foreach-loop

User<6442034874>: ^ check it out it should cover everything you need 😄

Nerses: As i see here cells isnt state variable.For other maps foreach works as expected but not for state variable

Anton: It’s solved in Tact 1.4, you need to upgrade your dependencies (reply to 34837)

Nerses: how can i upgrade ? (reply to 34851)

Anton: You may run yarn upgrade -P @tact-lang/compiler to only upgrade Tact to the latest version (reply to 34852)

Alexander: Hi, can anyone please suggest how to get the 'require' text error message on the client side (e.g. in tests)? In the transactions array I can only see a numeric exit code like 49280. How to get the text message?

Nerses: after upgrading I got again same error "Error: contracts\hashed_time_lock_t_o_n.tact:321:32: Parse error: expected "_", "A".."Z", or "a".."z"  Line 321, col 32:   320 |         let index: Int = 0; > 321 |         foreach (key, value in (self.pContracts)) {                                        ^   322 |             if(value.sender == addr){" (reply to 34853)

User<6442034874>: would self.forward() work for the jetton receiving?

Illia: Nope, that's just for Toncoins.  That's its source code:  https://github.com/tact-lang/tact/blob/eb2bbdccff216f060fa4b81adb626e249fdc1793/stdlib/std/base.tact#L12 (reply to 34861)

User<6442034874>: okay so theoretically this SHOULD work: import "@stdlib/deploy";  message(0x7362d09c) TokenNotification {     queryId: Int as uint64;     amount: Int as coins;     sender: Address;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton  }  message(0xf8a7ea5) TokenTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton }  contract JettonReceiveer with Deployable {     receive() {         acceptMessage();     }     receive(msg: TokenNotification) {         let sendTo: Address = address("add");         send(SendParameters{             to: sender(),             value: ton("0.5"),             bounce: false,             body: TokenTransfer{                 queryId: 0,                 amount: msg.amount,                 destination: sendTo,                 response_destination: myAddress(),                 custom_payload: emptyCell(),                 forward_ton_amount: 1,                 forward_payload: emptySlice()             }.toCell()         });     } }  Except it doesn't (reply to 34868)

User<6442034874>: any ideas why?

Illia: How do you test this one? Do you specify your JettonReceiver contract address as response_destination when transferring jetton? (reply to 34874)

User<6442034874>: nope, i just send to the contract address of JettonReceiver (reply to 34876)

User<6442034874>: then the contract of the jetton deploys a wallet address contract which notifies the destination

User<6442034874>: and destination uses that new deployed contract for sending interactions, now I did some tests and realized that JettonReceiver is not registering message(0x7362d09c) TokenNotification message

User<6442034874>: (i have enough for fees on the contract)

Illia: can u add github.com/henchtab/shrek logger and the output you get in the sandbox? (reply to 34879)

Illia: if you want to get the notification, then you need to have forward_ton_amount > 0  https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L127  otherwise, transfer_notification is not sent (reply to 34879)

Illia: if you set forward_ton_amount let's say 0.05 Toncoins, then the transfer should work (reply to 34877)

User<6442034874>: i have it on > 0 always, now im trying to do it with forward_payload

User<6442034874>: its calling it like it should

User<6442034874>: but

User<6442034874>: its failing

Illia: how do you form your transaction?  btw are u deploying your contracts straight into testnet? not the best idea for testing bugs (reply to 34889)

User<6442034874>: nope doing this all on mainnet

User<6442034874>: hm you think so? (reply to 34887)

Illia: you need to explicitly set the forward_ton_amount  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#:~:text=MsgAddress%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response_destination%3AMsgAddress%20custom_payload%3A(Maybe%20%5ECell)-,forward_ton_amount%3A(VarUInteger%2016)%20forward_payload%3A(Either%20Cell%20%5ECell),-%3D%20InternalMsgBody%3B (reply to 34889)

User<6442034874>: im gonna try forward_ton_amount right now

Illia: read my message from above and take a look at the func code (reply to 34894)

User<6442034874>: I actually realized how I could do that, i can send a jetton with forward_payload and call contract like that (reply to 34898)

User<6442034874>: btw I was receiving a notification, its just that the receiveJetton contract was not registering the notification, I was looking into previous messages in group and realized that there is not a single possibility that contract that receives jettons CAN register a notification 😄 (reply to 34895)

User<6442034874>: @expectfun

User<6442034874>: also, is there a extension for vscode that is not this one?

User<6442034874>: its giving me random errors on working code lol

Illia: nope, what kind of erros? (reply to 34906)

User<6442034874>: sometimes it has red underline on text saying syntax error expecting ')' and such error messages

User<6442034874>: when, indeed, everything is alright

Illia: yeah i have it as well from time to time, i just reload the plugin

User<6442034874>: .storeSlice(                             TonCore.beginCell()                             .storeUint(3920803186, 32)                             .storeCoins(1)                             .storeAddress(TonCore.Address.parse("add"))                             .endCell()                             .asSlice()                         ) any idea why is it failing to interact with contract? 😄 It's forward_payload part (reply to 34911)

User<6442034874>: message RegisterTx {     amount: Int as coins;     dest: Address; }

User<6442034874>: without this (forward_payload), it works (reply to 34913)

User<6442034874>: I'm kinda stuck forward_payload seems not to be correct for some reason...

Illia: Try to read TEP-74   https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md&ved=2ahUKEwi0w9CYiIyHAxWMUkEAHQ5fDDkQFnoECB8QAQ&usg=AOvVaw2fUsivuhce-ak9G6qop6F7 (reply to 34916)

User<6442034874>: I see

User<6442034874>: it must be a simple message

— 2024-07-04 —

User<6442034874>: It's being saved as message, not quite sure how do I call it as contract 😮‍💨 (reply to 34917)

Illia: ?  forward_payload - optional custom data that should be sent to the destination address. (reply to 34923)

Freed: Is it a good idea to have gas cost variable with an owner only setter in case if gas price changes in future TON updates?

Chou: Hello everyone, I am a beginner developer. The official recommendations include func and tact. As a front-end developer, tact is more suitable for me, but it is marked as under development. I want to ask if tact is suitable for use in a production environment now.

Daniil: You can use it in production. But still be cautious and perform proper testing of your smart contracts (reply to 34931)

Evelyn: can anyone point me to a sample jetton and NFT in tact?

Evelyn: i would love to read more on github

Evelyn: is this https://tact-by-example.org/07-jetton-standard the official version?

Anton: What does your tact --version say? (reply to 34857)

jay: Can I store 100k records in map<Int, Bool> ?

jay: Is there another structure to store 100k records in a single contract？

Anton: not really (reply to 34948)

Anton: that’s TON limitation

Anton: no, there is no way to get the strings _on-chain_, those strings just get hashed and all you see are those exit codes (reply to 34855)

Sergey: If you need to understand what was the exit code - just use numeric ones (reply to 34855)

Nerses: I checked actually it wasn't updated (reply to 34945)

Vlad: submitted the issue regarding that https://github.com/tact-lang/tact/issues/527 (reply to 34471)

Anton: Thanks so much! Will take a look today (reply to 34956)

Vlad: I wonder if the recieve function can accept a struct as a parameter and if it will have any diference with receiveng messages?

Alexander: Funny, what’s the purpose of the require strings if they don’t appear anywhere later? How can I correspond the numeric exit code to the certain triggered require operator? (reply to 34952)

Alexander: How to use numeric if the require operator accepts strings? And for example the existing jetton and nft implementations also use require with strings. How can I tell which require failed? (reply to 34953)

Sergey: https://docs.tact-lang.org/ref/core-debug#nativethrowunless (reply to 34961)

Sergey: what you see in tact jetton implementation - is just an standart implementation, but usually everyone uses func one. like this https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc or this https://github.com/ton-blockchain/minter-contract (reply to 34961)

Alexander: Thanks, it’s clearer now. At least there’s a way to know the error. So - the require operator is pointless then? Given that I cannot get its message anyway? (reply to 34962)

Sergey: it isn't pointless if you just need to throw some error, but it is pointless if you need to undestand what was the error (reply to 34964)

Anton: you can try, but it actually should not accept structs, the difference between structs and messages is the implicit “opcode” field that every message has, it’s a tag used to dispatch. You can specify that opcode using syntax like this one:  message(42) MyMessage {     field1: Int;     field2: Int; } (reply to 34958)

Anton: 42 is the opcode

Anton: you can. look in the .abi file (reply to 34964)

Vlad: Thanks (reply to 34966)

Sergey: now the require function makes sense (reply to 34968)

Daniil: 100k - no, but around 20k is OK unless you ever want to iterate over them (reply to 34947)

Dmitry: you probably can create map<int, int> and make use of bitmask (reply to 34948)

Dmitry: not sure about 100k but the density will probably increase

Dmitry: or even map<int, cell> and pack cell with flags (reply to 34972)

Denis: Hi, help me please, how to download transaction history of wallet in csv file?

Daniil: It's a more general question not related directly to Tact, so please forward it to @tondev_eng (reply to 34977)

Denis: Thanks a lot! (reply to 34978)

jay: @Gusarich @D_M1s5 Can you tell me which map structure can store more data? I'm not sure what type of value would be better.

Buggy: Is there anyway to compile Tact language to Rust just like it does as wrappers with typescript?

Buggy: Right now I use tonlib-rs which has basic function of contract which is wallet, jetton contract factory. Else than that so I have to implement it myself to let Rust know what t has to do with.

Daniil: If you need more than a few thousand entries, consider thinking about distributed architecture with small smart contracts that store data for each individual user/entry/row (reply to 34980)

jay: Can we get and check child contract state from main contract? I don't want users to deploy child contracts

Gasheye 2: Ton

jay: Like https://github.com/Gusarich/airdrop/tree/main?tab=readme-ov-file#claiming-the-airdrop, users have to deploy contract and then send claim, it's a bad user experience.

Illia: hm that's interesting; btw @sedov why did you prefer such distributed design in this case?  i'm currently researching ways for sharding contracts on the TON blockchain, i thought that Load Balancer implemented as round robin can be very nice solution for all the smart contracts on the TON blockchain;  how do you feel about this? i think of implementing one (reply to 34989)

Illia: not all contracts* but most of them, especially, if you have replicas (reply to 34990)

Daniil: these can be deployed from the main contract (reply to 34989)

Daniil: at the time when I was writing that smart contract, wallet apps such as Tonkeeper were breaking on exotic cells with merkle proofs in messages, so I made a solution with external message that can be sent without using an app  now it's possible to rewrite the code to make it a little bit cheaper and simpler (reply to 34990)

Johnny Le: Can I have the code for that mate (reply to 34996)

Johnny Le: digging in merkle tree too

Illia: could u provide some hints on func/fift sources that implement such proofs? (reply to 34996)

Nwobueze: You're welcome! (reply to 34979)

Daniil: It was mentioned above: https://github.com/Gusarich/airdrop (reply to 34999)

Illia: but as you said, you don't use exotic cells and proofs   are there examples for them in FunC? (reply to 35001)

Daniil: I do use them. It's just that these are sent separately in an external message to overcome wallet apps limitations of that past time (reply to 35002)

Illia: Oh right my bad, thanks mate (reply to 35003)

jay: Is there a demo code for verifying merkle proof at Tact?

Illia: personally, i haven't found any yet (reply to 35005)

jay: 🙈 Looks like we'll have to call the func code.

jay: I think Tact need a utility functions lib, ex: transfer  transferJetton etc.

Daniil: in 1.5.0 probably 😄 (reply to 35009)

Waliu: Hello (reply to 34968)

Waliu: You're welcome (reply to 34969)

Chinwe2: Good morning I noticed that many people here are looking for some help regarding TG games, Bots, Lanuchpads, Market places , Hackathon etc...  Ping me a message and I will tell you more .I am from experienced venture builder and software studio Thank you 😊❤️

jay: Build failed:  error: undefined function .begin_parse_exotic, defining a global function of unknown type       (slice cs, int exotic?) = proof_cell.begin_parse_exotic();

jay: When I try to import func code in Tact.

Daniil: https://github.com/Gusarich/airdrop/blob/e1b1a8e544fb0d68eaeed9a93210ffca045917b7/contracts/airdrop.fc#L28 (reply to 35015)

jay: I fixed this by add： (slice, int) begin_parse_exotic(cell c) asm "XCTOS";

Chou: Thanks， (reply to 34939)

jay: Wow, call func code in Tact work fine.

Son Pin: Any example? (reply to 35021)

Calvin | Impossible: Gm :) (reply to 35024)

Son Pin: Bro (reply to 35025)

jay: `(slice, int) begin_parse_exotic(cell c) asm "XCTOS";  slice merkle_verify(cell proof_cell, int merkle_root, int index) method_id {     (slice cs, int exotic?) = proof_cell.begin_parse_exotic();     throw_unless(42, exotic?);     throw_unless(43, cs~load_uint(8) == 3);     throw_unless(44, merkle_root == cs~load_uint(256));      cell dict = cs~load_ref();     (slice entry, int found?) = dict.udict_get?(256, index);     throw_unless(45, found?);      return entry; }`  helper.fc (reply to 35024)

jay: My next question is how to send jetton at Tact? Is anyone know this?

jay: I saw https://tact-by-example.org/07-jetton-standard, but I still no understanding.

lee: Are there any examples or exercises of staking contracts?

Sergey: The same way as at func. You need to send transfer token message to the Jetton wallet of the sender, where recipient will be your smart contract address, and then listen to token notify message. Jetton standard ftom playground will help you with that (reply to 35029)

Ага: Any example how to make custom token ?

Illia: https://tact-by-example.org/07-jetton-standard  this is the best one you can get afaik (reply to 35039)

Nerses: is there Jetton implementation in TACT ? couldnt find appropriate one for understanding Jetton architecture

Illia: it's yet to come; the best one yet https://tact-by-example.org/07-jetton-standard (reply to 35041)

jay: https://tact-by-example.org/07-jetton-standard This is the Jetton implementation. But this demo haven't operate jetton. (reply to 35041)

Nerses: i have seen that but it isnt the best material I would like to see for implementing. (reply to 35042)

Nerses: I have implemented HTLC s in native token and want to do same for Jetton

Nerses: But I cant find any appropriate info to understand how Jetton works

Nerses: isnt it public production code of Jetton ? (reply to 35043)

jay: Thank you, would you give me the playground url? (reply to 35037)

Sergey: https://tact-by-example.org/07-jetton-standard  You sent it yourself) (reply to 35048)

jay: I'm with the demo that wants to operate Jetton.

jay: For example, withdraw jetton from the contract or transfer jetton from contract to user.

Illia: are there any previews? would love to contribute (reply to 35051)

Nerses: thanks a lot (reply to 35051)

Neo: Hi, what is diffrent with jetton_wallet and jetton_wallet_governed ?

Neo: i have a contract use standard jetton token everything is ok, when i deploy mainnet use real usdt , has error Cell underflow , usdt's jetton_wallet contract type is jetton_wallet_governed, so what's diffrent  with jetton_wallet and jetton_wallet_governed ?

Nerses: is there any platform where I can verify Jetton contracts of testnet ?

Illia: https://verifier.ton.org/?testnet= (reply to 35057)

Illia: Can you share the source code? (reply to 35055)

Neo: import "@stdlib/deploy"; import "./jetton";  message SetMyJettonWallet{     wallet: Address; }  message WithdrawToken{     to: Address;     amount: Int as coins;     value: Int as coins; }  message WithdrawEvent{     to: Address;     amount: Int as coins; }  message TokenExcessesEvent{     queryId: Int as uint64; }   contract DzTon with Deployable{     owner: Address;     jetton: Address;     MyJettonWallet: Address;      init(jetton: Address){         self.jetton = jetton;         self.owner = sender();         self.MyJettonWallet = newAddress(0, 0);     }      receive(){}      // 接收Execss 消息, 多余的Ton Gas 返回给合约     receive(msg: TokenExcesses){}      receive(msg: SetMyJettonWallet){         require(sender() == self.owner, "Invalid sender!");         self.MyJettonWallet = msg.wallet;     }      receive(msg: WithdrawToken){         require(sender() == self.owner, "Invalid sender!");         require(self.MyJettonWallet != newAddress(0, 0), "Jetton wallet not set!");         require(myBalance() >= ton("0.05"), "Insufficient balance!");         require(msg.to != newAddress(0, 0), "Invalid address!");         require(msg.amount > 0, "Invalid amount!");         send(SendParameters{             to: self.MyJettonWallet,             value: ton("0.05") + msg.value,             mode: SendRemainingValue,             bounce: false,             body: TokenTransfer{                 queryId: 0,                 amount: msg.amount,                 destination: msg.to,                 response_destination: myAddress(),                 custom_payload: emptyCell(),                 forward_ton_amount: ton("0.001"),                 forward_payload: emptySlice()             }.toCell()         });          emit(WithdrawEvent{to: msg.to, amount: msg.amount}.toCell());     }       get fun getOwner(): Address{         return self.owner;     }      get fun getJetton(): Address{         return self.jetton;     }      get fun getMyJettonWallet(): Address{         return self.MyJettonWallet;     }  } (reply to 35060)

Neo: @pantemon source code is here

Neo: and the transaction : https://tonviewer.com/transaction/86f2a2d849ba7545b512260a00b2b9dd748a6799e781f7d2e0335b5dab1a327e

Waliu: Okay (reply to 35066)

Neo: where can find jetton_wallet_governed interface source code ?

Nerses: Please can someone provide any material how to send jettons in TACT smart contract ? Thanks beforehand

🍅🐾: Hi (reply to 34808)

— 2024-07-05 —

jay: Hello~ (reply to 35091)

avi: Hello

avi: Looking for  contract code that can send token to a telegram contact. Any pointers?

lee: is there anything wrong?

jay: Please check where throw the error code 7

jay: Excuse me, how can I deploy a Jetton by @ton/sandbox in unit test?

Illia: I like your idea mate; try using it's official chat to tell more about it (reply to 35118)

Illia: https://tact-by-example.org/05-the-stoppable-trait (reply to 35111)

Illia: You can use TreasuryContract to send Jettons and test transactions.  Have a look at   https://github.com/henchtab/nenuma/blob/main/packages/contracts/tests/Broker.spec.ts#L52  If you specifically want to deploy a wallet, you will need to have a wrapper to interact with such a wallet.   Have a look at how tests are done for the new wallet W5   https://github.com/tonkeeper/w5/tree/main/tests  You can use w5 in your tests as well if u want, but I don't see much point unless you deliberately test batch transactions (reply to 35103)

Illia: Once you add it to your contract, you will get the receiver Stop

jay: 😅 so hard.

jay: Very frustrating, one broken at a time.

jay: Can we return a jetton balance in a contract?

Brady: Hello, everyone. How to identify that a transaction is a deploy nft type?

Illia: That's because you need explicitly add self.requireNotStopped() before each transfer. You can find the source code of this trait to explore how it's supposed to work (reply to 35128)

Illia: You can do that as well. But if you add this into your trait, pay attention to the fact that all contracts inherited from this trait will be stoppable (and the trait needs to implement Stoppable) (reply to 35133)

Illia: you can do that mate, keep working 💪 (reply to 35126)

Illia: You can create a property that will increase every time you transfer Jettons in and out (reply to 35129)

Illia: Or you can implement a message on your custom Jetton like provide_wallet_data and send back take_wallet_data  with details you need (reply to 35129)

jay: thank you, I returned jetton wallet address from contract😂 (reply to 35136)

Illia: all right, what's you problem mate? what're you trying to build

Illia: can u share you contracts with me so i can have a look? this example literarily has everything you need (reply to 35120)

Illia: i'm pantemon on github

Illia: pretty much yeah (reply to 35153)

Illia: i'll have a look in a few hours as get back to my pc (reply to 35152)

jay: You can add all your logic when receive token transfer message, Include block user transfer. (reply to 35153)

jay: Sorry, I am a beginer on TON. But I think it’s useful because all transfer logic will be processing by this message handle

Mr.Dashti: What is the main site for making tokens on the ton network?

Mr.Dashti: Can you explain more? (reply to 35172)

Stephan: Hello, please tell me, is it safe to launch a project in production whose smart contracts were written in Tact and not in Func? It's just that TON warns that the language is created by the community and you need to be more careful   I’m sorry. Misspell. It was a question (reply to 35173)

Pouya: Hi @novusnota42   Could you please check your DM? thanks (reply to 35183)

— 2024-07-06 —

cindy: Dear Devs, this error occurs when compiling the contracts: RangeError: Maximum call stack size exceeded. How can i handle this error? I don't know why the errors occurs here.thanks.

cindy: RangeError: Maximum call stack size exceeded     at getType (/Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveDescriptors.js:1145:15)     at createTupleSignature (/Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:155:52)     at createTypeFormat (/Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:124:19)     at createTLBField (/Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:135:24)     at /Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:159:44     at Array.map (<anonymous>)     at createTupleSignature (/Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:159:33)     at createTypeFormat (/Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:124:19)     at createTLBField (/Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:135:24)     at /Users/foonsun/works/QexcSwap/node_modules/@tact-lang/compiler/dist/types/resolveSignatures.js:159:44 Error: Could not compile tact

Anton: Can you share the source code please? Also, what Tact version are you using? (reply to 35219)

cindy: Dear, The code is here. the Tact version here is:  "@tact-lang/compiler": "^1.4.0", (reply to 35220)

Anton: Can you send it as a full contract which I can compile on my computer? (reply to 35222)

cindy: sure.wait for a moment. (reply to 35224)

cindy: thanks for the help.I find the reason here. (reply to 35224)

Ага: Hi guys. I am from Mumbai, can you help mi with guidelines.  How to create custom Jetton on FUNC? Any guide or instructions please?

🦁: Lol

User<6981260071>: Someone in here that can help me with a smart contract in TACT

Daniil: you can ask questions right here (reply to 35246)

User<6981260071>: Hi mate.. I try to store a user with there wallet address.  First i check if the user is stored returns boolean.  If not i will not store the user but the user is not getting stored dont know if i do it correctly :) (reply to 35248)

User<6981260071>: Do not think this is correct with treasure("deployer") but if I don't have it it says error (reply to 35251)

Stephan: hello guys, please help, how to create list of addresses in tact? there is no information in documentation

Daniil: You can use Map (reply to 35254)

Stephan: like this?    list: map<Address, Address, Address, Address, Address>;    i need to save 5 addresses (reply to 35257)

User<6981260071>: No check out the first picture I sent a bit longer up (reply to 35258)

User<6981260071>: This (reply to 35249)

User<6981260071>: Int is key address is value

Stephan: oh i see. but how can I specify a limit of 5 addresses? (reply to 35260)

User<6981260071>: Can you check out my message why the user is not getting stored? (reply to 35262)

User<6981260071>: You can pass them manually if not in dapp (reply to 35263)

User<6981260071>: Or make a check in your js

Stephan: like this?    addresses: map<5, Address>; (reply to 35265)

User<6981260071>: No 5 should be Int as key (reply to 35267)

User<6981260071>: In your script make a count check for they array

User<6981260071>: Frontend

Stephan: addresses: map<Address, 5>; ? (reply to 35268)

User<6981260071>: addresses: map<Int, Address>;

Stephan: i got it, but how can I specify a limit of 5 addresses? (reply to 35272)

User<6981260071>: Do you call the function in your frontend? (reply to 35274)

Stephan: no, I dont have frontend yet, I don't even have any functions that interact with this list. (reply to 35275)

User<6981260071>: Then in tact use . length and count the array (reply to 35277)

Stephan: that is, it needs to be done through the check "if addresses > variable With 5 - throw(111)" ? (reply to 35279)

Stephan: I just assumed. I'm just starting at tact. I need to create a list of addresses with a maximum of 5 (reply to 35282)

Stephan: Okay, I'll try and come back, thanks! (reply to 35284)

User<6981260071>: why is this not storing user address

User<6981260071>: How to do it then ? (reply to 35290)

Pouya: Remove the get and if you want to call this function(with message) call it in a receive block (reply to 35291)

User<6981260071>: I am new  to TACT can you  come with and example in private then i can send the full code aswell 🙂 (reply to 35292)

Tonion Dev: Let me share sample with you (reply to 35293)

User<6981260071>: Thanks (reply to 35294)

jay: https://tact-by-example.org/all See this (reply to 35293)

User<6981260071>: what should i click here (reply to 35297)

jay: What are you want to do?

User<6981260071>: Store the users wallet address (reply to 35300)

jay: get function only for query data.

User<6981260071>: Yes i found at that but how to store it (reply to 35302)

jay: Please add a receive function to update contract data.

User<6981260071>: dont know how to do that .. (reply to 35304)

jay: https://tact-by-example.org/04-maps

Tonion Dev: contract Sample{     fun createUserWallet(address:Address) {         self.user.lengthAddress += 1;         self.user.address.set(self.user.lengthAddress, address);     }      get fun userWalletLength(): Int {         return self.user.lengthAddress;     }      receive(msg: CreateUserWalletMessage) {         self.createUserWallet(msg.address);     } }  message CreateUserWalletMessage{     address: Address; } (reply to 35295)

Tonion Dev: the methods marked as get are just viewable and can not change the contract states and can call from  your contract or outside of contract but if you want to change the contract's states you should use non-get functions and call them in a wrapper function by a receiver or directly in a receiver block actually if you are come from solidity, get methods are like view in solidity  FYI - @tonSniperDev (reply to 35307)

User<6981260071>: Okay i understand that.. So my receive msg: "CreateUserWalletMessage" i can call from my backend and store  the user ? (reply to 35309)

User<6981260071>: How do i call this in my test script     receive(msg: StoreUserWalletMessage){         self.storeUser(msg.address)     } (reply to 35309)

User<6981260071>: i want to do it like this (reply to 35309)

jay: I found a question that contractAddress from contract and js isn't same, how can I resolve this? My contract code:

Tonion Dev: I suggest use blueprint to structure your project and after build your contracts it make a ts wrapper for you that you can use it in your tests our anywhere else.  For example; This counter contract test maybe can help you:  Test:  https://github.com/ton-ion/tonion-contracts/blob/main/tests/utils/Counter.behavior.ts  Implementation:  https://github.com/ton-ion/tonion-contracts/blob/main/contracts/mocks/utils/counterImp.tact (reply to 35313)

User<6981260071>: Already using blueprint (reply to 35315)

jay: My test code. (reply to 35314)

Tonion Dev: Great  Use blueprint build to build your project (reply to 35316)

Tonion Dev: And then try to use sandbox to simulate your contracts deployment and try to call methods like the mentioned links  FYI - @tonSniperDev (reply to 35318)

Tonion Dev: Hi Jay   Maybe this implementation of a basic Jetton be helpful for you:  https://github.com/ton-ion/tonion-contracts/blob/main/contracts/mocks/tokens/jetton/basic.tact  Test:  https://github.com/ton-ion/tonion-contracts/blob/main/tests/tokens/jetton/basic/Basic.behavior.ts  Take a look at test to get your answer 😎 (reply to 35317)

User<6981260071>: I had blueprint build and it works but have to call the store user function when it's not a get (reply to 35319)

Tonion Dev: Let me share an example with you  Wait... (reply to 35321)

User<6981260071>: Thanks (reply to 35322)

User<6981260071>: this is my setup for now (reply to 35322)

Tonion Dev: This is an example of call the ChangeOwner2Step method from Ownable transferable 2 step contract   https://github.com/ton-ion/tonion-contracts/blob/main/tests/access/OwnableTransferable2Step.ts#L44C4-L48C8 (reply to 35323)

jay: thank you, I used the jetton that is copy from tact-by-example (reply to 35320)

Tonion Dev: Could you please share your code as a repo with me? (reply to 35324)

User<6981260071>: give me a sec i try your sulotion now (reply to 35327)

Tonion Dev: The mentioned Jettons implementation is same (reply to 35326)

jay: https://github.com/w3player/airdrop-master-ton/blob/dev/contracts/airdrop_master.tact It's my code. (reply to 35329)

User<6981260071>: is not working i create a repo now for you (reply to 35329)

User<6981260071>: This is the repo i think you know the file structur   https://github.com/olivergadelarsen/tonthreespace (reply to 35327)

Nwobueze: What's  New

User<6981260071>: just pushed the build folder aswell (reply to 35327)

Tonion Dev: Thanks I'll review it ASAP (reply to 35332)

User<6981260071>: thanks ❤️ (reply to 35335)

Part Thai: Is there any good github action package I can use for CI/CD pipeline?

jay: I saw your code, the contract doesn't look like a problem. (reply to 35336)

User<6981260071>: i think its the way i test it (reply to 35338)

Tonion Dev: For tact? Could you please share more info about your need? (reply to 35337)

jay: So you want to know how to call the function? (reply to 35339)

User<6981260071>: i do call the function correctly now but is not storing the user (reply to 35341)

User<6981260071>: check out the test script

Part Thai: Thinking to run build, test and also deploy automatically from github action (reply to 35340)

Tonion Dev: Maybe this GitHub action be useful for you:  https://github.com/ton-ion/tonion-contracts/blob/main/.github/workflows/unit-test.yml  Build  Run tests (reply to 35344)

User<6981260071>: and no fees are subtracted from my wallet when i run the test (reply to 35335)

Tonion Dev: Auto deployment is not able yet by GitHub action  But it is a good idea to develop it   If you are interested you can open an issue in Tonion and then we can work on it together 💻  https://github.com/ton-ion/tonion-contracts/issues/new (reply to 35344)

jay: it's only a sandbox env, not affect your wallet balance

jay: And you don't deploy your contract twice. the contract was deployed on beforeEach. (reply to 35346)

User<6981260071>: removed that and pushed a new update to git (reply to 35349)

User<6981260071>: i get this when i call getUserCount   user count 1n  so i guess the user is stored but i  get false when i check (reply to 35335)

Tonion Dev: Which line of your test file? (reply to 35351)

User<6981260071>: u push it now to sec (reply to 35352)

User<6981260071>: pushed (reply to 35352)

Tonion Dev: Could you address me to the line of your test file where it return false?

User<6981260071>: https://github.com/olivergadelarsen/tonthreespace/blob/main/tests/TonThreeSpaceContract.spec.ts#L47 (reply to 35355)

Tonion Dev: You don't call user store in your test before call getIsWalletStore (reply to 35356)

User<6981260071>: so i should call this https://github.com/olivergadelarsen/tonthreespace/blob/main/tests/TonThreeSpaceContract.spec.ts#L49,#L70  before i check if user is stored? (reply to 35357)

User<6981260071>: but that wont make since bc i want to check if user is stored first before store user

User<6981260071>: can you find a solution mate 🙂 (reply to 35357)

Tonion Dev: you deployed the contract in this state there is no stored user and when you call the : const result= await tonThreeSpaceContract.getIs``WalletStored(testAddress); you got FALSE, because there is no stored account yet  before call the getIsWalletStored you should store the wallet first and then call the getIsWalletStored then will get TRUE (reply to 35362)

User<6981260071>: but then my contract structur is wrong ?   and if i store the user before check user is stored then the same user will stored over and over again right ? (reply to 35363)

Tonion Dev: It is based on your need and goal of your project (reply to 35364)

User<6981260071>: now i get true all the  time.. And user count stays the same..   Can you help rewrite my contract to i first check if user is stored if not then store the user please 🙂 (reply to 35365)

User<6981260071>: i did this to the contract   `     fun storeUser(address: Address){         if (!self.contains(address)) {             self.user.lengthAddress += 1;             self.user.address.set(self.user.lengthAddress, address);         }     }  `  but not helping (reply to 35365)

x: Hello, I need some help, I have no idea how to store and load NFT Item content metadata, collection metadata works and is there but for NFT Item i have no idea how to do it

.: Hi  i have this abstract method in my trait:      abstract fun calculate_jetton_wallet_init(account: Address): StateInit; and I try to override it my contract:       override fun calculate_jetton_wallet_init(owner_address: Address): StateInit {         return initOf ExampleJettonWallet(owner_address, self.jetton_master);     } but I got this error while compiling:   > ExampleJettonMaster: tact compilerTact compilation failed Error: Invalid address hash length: 0  how should I solve it?

— 2024-07-07 —

User<7413585778>: gm

User<7413585778>: is anyone looking for a developer?

User<7413585778>: hello. is anyone looking for a developer now?

lee: get map value wrong, why?  struct StakeRecord {     amount: Int as coins;     stakeTime: Int as uint32;     minEndTime: Int as uint32;     bExit:Bool; }  stakeRecordMap: map<Int, StakeRecord>;  let record: StakeRecord = self.stakeRecordMap.get(0)!!; require(record != null, "not stake"); require(record.amount > 0, "not stake");    building error Func compilation error: /dist/tact_StakingContract.code.fc:77:105: error: cannot apply function null? : Forall (_Z) _Z -> int to arguments of type (int, int, int, int): cannot unify type ??547 with (int, int, int, int): cannot unify generic type and tensor throw_unless(38370, (~ null?(($record'amount, $record'stakeTime, $record'minEndTime, $record'bExit)))

jay: Tact compile fc code with import will throw file not found error, how can I fix this question?

jay: There's a problem with the jetton in Tact-by-example, the calculated jetton wallet address doesn't match the func's.

Igor: https://tact-by-example.org/02-integers  I am checking this example, and see that dump() execution requires a lot of gas  Gas: 0.070887  While whole contract deploy needs  Gas: 0.008681  I checked func generated, looks dump is removed from there, changed to __tact_nop();  So this is just the way emulator counts gas, in real net it will be zero?

.: No body know about it? (reply to 35363)

User<6981260071>: sadly (reply to 35425)

Max: Hey guys, can anyone make it clear for me why is there an error?

Max: two actually

Max: Oh okay, it's  a pain in the ass because it disables auto complete, but thanks  I also have another one problem, if use .get() on a map with key as Address it doesn't want to work properly in tests with this message:  Unable to execute get method. Got exit_code: 7, but with Ints it works great.  Here is my headache:  get fun notifications(): FeedOfAddress {     let feed: FeedOfAddress? = self.notifications.get(sender()); // if I comment this it won't crush my test     require(feed != null, "notifications not found"); // with this of course     return feed!!;   }  I looked for an answer to this question in the chat, but never found it

Max: I spent my whole day because of this stuff, will be really grateful (reply to 35433)

Max: OF COURSE (reply to 35435)

Max: Damn you saved it, thank you mate 🙈🙈🙈

.: @novusnota42 Could you please help me (reply to 35363)

.: this repo use the ton-core to compile, etc. when I use the ton-core it is ok  but I want to use it with @ton/core and I got that error I mentioned above  https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/contracts/jetton_example.tact (reply to 35440)

.: The calculate_jetton_wallet_init is marked as abstract inline   And in the implementation marked as override  And I think the error is about the Functions overriding (reply to 35440)

Doug: I can't activate my Ton wallet, when I request the 5 free Ton, so I can then make a smart contract, could anyone help me?

User<6981260071>: you also need to send a tx with your wallet first to init it (reply to 35446)

User<6981260071>: should this not promt a transaction in wallet ?

User<6981260071>: ?????

User<6981260071>: yes i deployed on testnet.. with blueprint run .. but how to test in no sandbox then? (reply to 35450)

User<6981260071>: what should i do then? (reply to 35450)

User<6981260071>: this is set to Sandbox should i change that to something else?

User<6981260071>: should i make the functions here ?

Chinwe2: Good evening I noticed that many people here are looking for some help regarding TG games, Bots, Lanuchpads, Market places , Hackathon etc...  Ping me a message and I will tell you more .I am from experienced venture builder and software studio Thank you 😊❤️

User<6981260071>: Do you know contract deployment for ton ? (reply to 35455)

Chinwe2: Please send a dm (reply to 35456)

User<6981260071>: what should i use as NetworkProvider when i call the function (reply to 35450)

User<6981260071>: yes but when i call the function i get his   i know i should await and so on

User<6981260071>: but cant figuout the the provider thing

— 2024-07-08 —

Spetsnaz: Try to open the contract with the client (.openContract()), it will inject the provider (reply to 35464)

Spetsnaz: I'd like to confirm one thing. If you don't self.reply(); in Tact, it won't return the excess gas right?

Neo: there is an error, error code is 9, error msg is: Cell underflow,

Neo: use usdt in mainnet

KryptoX: what address that you deploy contract for ton with Tact ? could you give me the link or show me how ? (reply to 35485)

Neo: https://tonviewer.com/transaction/2102093f07856286aae52aed942f52ef00cdc9dee087325f6da2570833e72591

Neo: in here (reply to 35486)

Neo: do you find the probleam ? @zhask_vn

Nerses: I've implemented an HTLC atomic swap in TACT. What key aspects should I consider to enable HTLC for arbitrary Jetton swaps? (e.g. how to recieve and send Jetton)

.: @novusnota42 (reply to 35442)

.: Share  I'll share it with you ASAP (reply to 35492)

zolnex: https://github.com/solnex/tact-contract  some contracts like airdrop, faucet,  signatures, etc written by tact ,keep learing~

🅰🅻🅰🅽: we are using another approach to implement airdrop - merkle distributor. The core contract aims to verify the merkle root for claiming airdrop, and using bitmap in child contract to prevent double claiming. The SDK is in wrapper folder and the usecase is in the tests folder. Just want to share with you guys 😎  https://github.com/Ton-Dynasty/thunder-drop-v1/blob/main/contracts/thunder_drop.fc

Nerses: can someone please provide an example how jetton sending and recieving is done TACT smart contract ?

Daniil: You don't use exotic cells there? (reply to 35496)

Daniil: try setting forward_payload to beginCell().storeBool(false).endCell().asSlice() (reply to 35485)

🅰🅻🅰🅽: this is a general implementation for merkle distributor with only common utilities, exotic cell is still under investigation, may i kindly inquire your experience about it? (reply to 35499)

Daniil: https://github.com/Gusarich/airdrop/blob/main/contracts/airdrop.fc  Take a look at this (reply to 35503)

Nerses: what happens when Jetton master contract send jettons to an address which doesnt have Jetton wallet ? Is autumatiacally new wallet contract created  by master contract or it depend how master is implemented?

🅰🅻🅰🅽: here you are   https://github.com/Ton-Dynasty/tondynasty-contracts (reply to 35497)

Nerses: thnx a lot (reply to 35506)

🅰🅻🅰🅽: it depends on how jetton master is implemented. But it usually deploys the jetton wallet along with internal transfer while sending. (reply to 35505)

Waliu: 😊 (reply to 35507)

Nerses: what will be in case it doesnt deploy but transfer message is sent ? (reply to 35509)

🅰🅻🅰🅽: if the recipient address is not initialized, your message will bounce back by default.

Jean-Baptiste: Hey people. Stupid question : what is the recommanded way to develop and deploy tact smart contracts ?  On one hand, we have blueprint, but it's not using tact's last version, and it's not using tact deployer. On the other hand, we have what's look like the official tact template, but seems less popular than blueprint.

🅰🅻🅰🅽: first of all, there is no stupid question here  second, blueprint is always your good friend. if the tact version is not latest, just create an issue and notify the team to upgrade it (reply to 35513)

Jean-Baptiste: Thanks. Yeah I guess the first step could be an issue or a PR to update blueprint to tact's last version. (reply to 35514)

🅰🅻🅰🅽: yeah go ahead for your first contribution on TON 🫡 (reply to 35515)

🅰🅻🅰🅽: thanks for sharing that stuff, quite awesome!   yet i have some question about that: most of the wallets do not support exotic cell, thus we have to conduct two action to claim the airdrop. I think the user experience is quite bad, doesn't it?  Our implementation (w/o exotic cell) is quite cheap as well, and is highly customizable, it should be a better choice now, just my opinion, free to discuss about that. (reply to 35504)

Nerses: I have another case in my mind.Suppose i have jettons in my wallet and my wallet isnt the master wallet I want to send jettons to another address which possible hasnt initialized wallet contract.What will be in this flow ? (reply to 35512)

Valli Nayagi: Hi.. Anyone knows how to send a simple contract message using ton sdk??? Could someone share a snippet of how it is done? I'm using nodejs backend to connect to tact contracts.. Would be really helpful. Thanks :)

jay: Can anyone tell me why this code calculates the jetton wallet address incorrectly? https://github.com/w3player/airdrop-master-ton/blob/dev/contracts/airdrop_master.tact#L75

Jean-Baptiste: Indeed, thank you. Opened a PR nonetheless, hoping it might be usefull (https://github.com/ton-org/blueprint/pull/134) (reply to 35521)

jay: import { Address, JettonMaster, TonClient4 } from '@ton/ton';  !(async function run() {     const demoData = {         jettonMasterAddress: 'EQCa2efoPKIq7gdpcGZQliz5yxT566m9pKg_pOhH__G5KHsX',         userAddress: 'EQD3ArhrHmmWPjaUVSeJrv_AnRgtCsNOoZBSmwPgC8suDmzN', // contract address     };      const testnetClient = new TonClient4({ endpoint: 'https://testnet-v4.tonhubapi.com', timeout: 5000 });     // calc contract by call     const master = JettonMaster.create(Address.parse(demoData.jettonMasterAddress));     const result = await master.getWalletAddress(         testnetClient.provider(Address.parse(demoData.jettonMasterAddress)),         Address.parse(demoData.userAddress),     );     console.log(         'result',         result.toString({ bounceable: true, testOnly: true }),         result.toString({ bounceable: false, testOnly: true }),     ); })(); (reply to 35523)

Neo: it work, thanks a lot (reply to 35500)

MyName: Scam. (reply to 35529)

Александр: Hello! Is there anything similar to uint(3) in tact or i can use only uint8 as minimal Int representation?

Daniil: All wallets support exotic cells already! (reply to 35517)

Daniil: It’s just that I didn’t find time to rewrite the project and documentation 😄

Денис: Hello, I’m creating a pool contract, I’d like to use parent-child approach for storing user contribution into the pool, in that case I can have one main contract and child ones for user contribution, it will allow to store lots of users and easily refund the users if the goal is not reached in time. But I should also have the ability to collect all the money from the pool and send it to another address , how can I do it?

Александр: Maybe introduce smth like enums to tact? Or it is already in plans? Do not want to consume more storage then it realy needed (reply to 35532)

🅰🅻🅰🅽: 1. you will send a jetton transfer message to your jetton wallet. 2. your jetton wallet will send a internal transfer message to target jetton wallet with init code, which will deployed that jetton wallet 3. your jetton wallet is deployed and funded 4. if forward amount is not zero, target jetton wallet will send transfer notification to target for further callback (e.g. swap logic or something else) (reply to 35519)

Stephan: hi guys, please help, in the function I send 1 ton to the contract, but something like 0.97832 comes to the contract, how do I make sure that the exact transfer amount comes to the contract. in tact

Stephan: yes, but this is when the contract sends a message, but I need to figure out how to cover the commission when the user sends to contract (reply to 35540)

Vincent: hi everyone, how should jetton_content be parsed in typescript?

Vincent: const jettonMaster = provider.open(await ExampleJettonMaster.fromAddress(testTokenAddress));     const data = await jettonMaster.getGetJettonData();     //How to parse this data, I want to get jetton's symbol and decimals etc     const content= data.jetton_content;     //const symbol= content???     //const decimals= content???

Vincent: How do I get this, anybody know? Thank you

Stephan: hi guys, please help, I'm sending 1 ton to my contract, but something like 0.97832 comes, how do I cover the commission so that exactly 1 comes to the contract? I wrote it on tact   import { Address, toNano,  SendMode, Sender } from '@ton/core'; import { Contract } from '../wrappers/LotteryJtl'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const contractAddress = 'address';      const contract = provider.open(LotteryJtl.fromAddress(Address.parse(contractAddress)));      await contract.send(         provider.sender(),         {             value: toNano('1'),          },         'pay'     );       }

.: Hi  Could you please explain the inline for me?  I can not find about it in document (reply to 35540)

MEW: my lord, need your help

MEW: Why is there a difference in the tail of the base64 format of  code and  system, when compiling my two contracts that imported the same contract file and used initOf in it

MEW: the second one:

— 2024-07-09 —

Doug: Has anyone made a game using Ton's jetton? (forwarded from Doug)

Doug: I'm trying to integrate the TON Blockchain API into my game, but I'm having difficulties, could anyone help me? (forwarded from Doug)

Daniil: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/scripts/deployNftCollection.ts  Help please. This code mint only collection or collection and sbt?

Nerses: 1 so inside my contract I need somehow calculate my wallet address for specific Jetton and transfer it ?   2 how my Jetton wallet will know the address of receievers Jetton wallet ? (reply to 35537)

🅰🅻🅰🅽: 1. yes 2. in ton blockchain, address is calculated by code (contract logic) and data (contract storage), so jetton wallet itself has code, and combine with the receiver address (data) then it knows the receiver jetton wallet address (reply to 35594)

Nerses: thanks a lot.If you dont mind can I dm you to discuss some more details about my project ? (reply to 35597)

🅰🅻🅰🅽: Join perman lab community, all of my team members are quite open to help new comers 🙌 (reply to 35599)

Nerses: can you please  provide any link so i can join the community ? (reply to 35600)

Nerses: so calculating receiver jettwon wallets address will automatically do my jetton wallet ? (reply to 35597)

🅰🅻🅰🅽: Here is the link: https://t.me/permanlab   The receiver jetton wallet address will be automatically calculated 👍 (reply to 35601)

Nerses: thanks a lot (reply to 35603)

Jake: how do I verify a TON contract written with tact? Following the Simple-counter example

Johnny Le: verify using .fc file (reply to 35606)

Nwobueze: Okay (reply to 35609)

Johnny Le: every tact must be compile to func

Jake: I submitted to the online verifier, why does it cost 0.5 TON? Seems excessive (reply to 35611)

Johnny Le: which site (reply to 35612)

Johnny Le: mine is free last time

Jake: https://verifier.ton.org

Aish: Hi all,  Is it possible for tact contracts to get the real time price of other crypto currencies   In Ethereum, we have oracles right, is there a way in Ton (using tact)?

Nerses: Suppose i have smart contract for doing HTLC and user1 wants to do swap of Jetton with user2. when user1 locks his Jetton funds in HTLC smart contract,Jetton wallet will be created for HTLC contarct after it how HTLC smart contract should calculate the Jetton wallet address of user2 to do transfer ? if Jetton wallet for user 2 doesnt exist  what will be done ?

Son Pin: Anyone has stonfi and dedust Testnet addresses?

.: Hey, in TON blockchain, can we create an MEV bot similar to those on Ethereum?

eo: Hey, is there a way to prank a message sender when writing tests?  I'd like to send some USDT from a whale to a smart contract, wondering how this is done when developing on the TVM? In Foundry (Solidity) we can use vm.prank(address)

eo: Can you fork mainnet in blueprint sandbox environment? Does it already do this? Would all of the AMMs like DeDust and Ston.fi be deployed?

Johnny Le: Mev can not work in TOn (reply to 35620)

Nerses: what concept of consensus make MEV impossible ? (reply to 35626)

Johnny Le: Ton is asynchrony (reply to 35627)

Jean-Baptiste: Hey there. Reading some code from Ton Dynasty, I see that kind of contruct (in a message or a struct):   forward_ton_amount: Int as coins; forward_payload: Slice as remaining  Int as coins is well covered in the documentation, but I wasn't able to find any reference to this Slice as remaining 🤔

Max: Hey guys, how do you encode $$type and some string key into payload using tonconnectUI.sendTransaction() method and ton-core? It's a rocket science to me this hashing encoding thing... Doc did not help me, videos and example projects on it too  for example  I have  const message = {         $$type: "Bet",         team: team,       };  await tonConnectUI.sendTransaction({         validUntil: Date.now() + 60 * 1000,         messages: [           {             address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,             amount: TONValue.toString(),             payload: ?,           },         ],       });

Jean-Baptiste: Perfect. Sorry for the noise, I need to rely more on TG search feature 😅 (reply to 35634)

unsphere: I noticed that when the contract send a message to itself and this message includes another send with SendPayGasSeparately, the exact amount will be not sent. Is that an expected behaviour?

Tiqan: Does SendpayGasSeperately sends the gas and fwd fee seperatly?

Tiqan: Could there be an issue with Sending a message from a contract to itself? Somehow if I do that my SendPayGasSeparately does not work...

Haris: Hey how to check contract is already active or deployed?

Haris: I want to check it with another contract

DAN: you can see it in explorer

Haris: yeah but how to confirm it with another contract? (reply to 35645)

DAN: you cant make the verification externally (not from the contract) ?

DAN: like this fn: await provider.waitForDeploy(myContract.address);

DAN: honestly idk how to do it from the contract

DAN: idk if it's even possible

Barbosa: I have a question. When we are doing a tonweb getTransactions call, what is the actual purpose of passing as a parameter the lt, and the transactionHash… I thought it would bring only the transactions after the one we specified on the parameters, but doesn’t seem to work. Can someone help me ?

Barbosa: Makes sense ?

Barbosa: Keep in mind I'm testing this on testnet: https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get

Barbosa: With the http provider

Max: What could be the problem if I can't update the self.*** map outside of receivers and functions? I trace the execution of each, everywhere the changes take effect up to the end of functions and receivers, but if I access the map from any other getter it's as if the changes are not committed at all

𝖞𝖓𝖌𝖇𝖘𝖉 🛰: @admin (reply to 35669)

Barbosa: Bump (reply to 35658)

Tiqan: Any ideas? (reply to 35641)

A: Hello 👋

Bachikk: b

Teddo: Hi, I'm kind of curious, Is there a way to properly estimate how much ton a message will use and send just only that amount of ton?

— 2024-07-10 —

Illia: can you give an example? doesn't sound right; btw it's generally a bad idea to send a message to itself (i tried designing such contracts a few times) and it's better to call accept_message if you want your contract to pay all the remaining fees for the transaction (reply to 35638)

Illia: as i said in my message from above, it's not great idea to send a message from the contract to itself; what's your use case? (reply to 35641)

Illia: what's your use case? generally, there's no way to do that; you can include the stateinit to deploy the contract and execute the message unless it's deployed; (reply to 35643)

Illia: it doesn't say that, but fields are optional; you don't need to provide lt or transaction_hash; if you provide them though, you will get only transactions that match this pattern (reply to 35658)

Illia: The answer is it depends. If the message you're sending is like sum numbers a and b, then such a transaction is pretty much deterministic. It means you can actually quite well predict the fees. But if you have something that involves a loop inside, then the number of iterations and, as a result, the gas depends a lot on the actual value. You could have run a simulation, but since TON is async, that's inefficient and rather expansive. It's recommended to use a 'carry pattern' which carries all the value along the transaction to make sure that all fees are paid and then the excessive funds are returned back to someone. Take a look at TEP-74. There's a response_destination address. It will receive all the excessive funds from the transaction.  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer (reply to 35681)

Degen: map: map<Address, Int>;  How to determine if an address already exists before adding it?

Anton: use .get and check if the result is null (reply to 35687)

Degen: Is this correct? Why does the compiler throw an error?

Anton: there is no guarantee the element you are looking up is always in the map, hance the return type of .get is optional (reply to 35689)

Anton: e.g. Int?, but you are trying to force it to be non-optional

Degen: Is this correct?

Anton: looks good

raya: Hello guys, Is there any way I can check which jetton token received when a Tact contract receive the TokenNotification message? or get the jetton master address

Max: Hey everyone, is anyone experienced in Tact open to doing paid hourly consultations? In English or Russian  I’m experimenting with Tact but having a hard time overcoming some issues (it’s mostly jetton creation related questions). I’m looking for someone who could help me

Anton: Hey Max, why don’t you try asking here? Someone might be able to help you free of charge (reply to 35705)

Max: Might be too much text for a group but let me try, thanks! (reply to 35706)

Max: I’m trying to create and mint Jettons inside of another contract, but it’s not working and a transaction fails. The main question, am I initializing a jetton contract and minting tokens correctly?   I’d really appreciate any feedback, thanks!   Here’s my main contract:  receive(msg: CreateMarket) {  let initCode: StateInit = initOf TheJetton(self.admin, "description".asComment(), 1000000000);    let jettonsReceiver = address("0QDzADdEMSGsp-dMTrHaeEKBB7HCgRoVGsuk_ya03UYhcRgu");    send(SendParameters{   to: contractAddress(initCode),   value: ton("0.25"),   mode: SendIgnoreErrors,   body: Mint { amount: 100000, receiver: jettonsReceiver }.toCell(),      code: initCode.code,   data: initCode.data  }); }  Also here's TheJetton contract: contract TheJetton with Jetton {  total_supply: Int as coins;  owner: Address;  content: Cell;  mintable: Bool;      ... everything is similar to the example from tact-by-example }   Here's an example transaction: https://testnet.tonviewer.com/transaction/258a9d6fafc8023accac5c63e38e65d489448e89678146c3f535911a6c471f1f

cindy: hi,why the dump only show a few logs during my test? I am doing the foreach loop,it needs to dump 5 times of this log.  #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:95:9     #DEBUG#: 1     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:102:9     #DEBUG#: s0 = C{450E2B6F43BBD111930DAE36460E2AEE12057A978B7C192105367795035F0432}     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:109:13     #DEBUG#: order:     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:110:13     #DEBUG#: 0     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:112:13     #DEBUG#: 1     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:113:13     #DEBUG#: 0     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:120:13     #DEBUG#: EQCIEEaD_8z6FnkozF6mFaaWNN1E0JiDJBOVOWQPnBgGRTv0     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:121:13     #DEBUG#: 1     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:109:13     #DEBUG#: order:     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:110:13     #DEBUG#: 1     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:112:13     #DEBUG#: 2     #DEBUG#: [DEBUG] File contracts/swap_wallet.tact:113:13

Degen: What type is used to represent time?

cindy: The logs seems not complete.why? (reply to 35713)

cindy: it loops for 5 times.The logs only show 2 times.

Neo: how to parse contract event log , any example ?

Degen: In the process of nft mint, how to limit each wallet to mint a fixed amount

Max: I’d also love to pay $15 for helping me figure this out. Or I could pay whatever rate you think is good for an hourly consultation (reply to 35708)

Nerses: is there any code snippet in TACT how to calculate Jetton wallet address ? thanks for any help

Degen: Does it need to store the address and its quantity every time mint? (reply to 35717)

Barbosa: I don’t think so, at least it’s not working, I’m using the lt (reply to 35685)

hΔrdshell: oh hey your still around (reply to 35682)

Nerses: i get this error  346 | fun packJettonWalletData(balance: Int, ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Cell { > 347 |    return  begin_cell()                    ^~~~~~~~~~~~   348 |             .store_coins(balance)   althoght I have this line in the contract import "@stdlib/deploy";  What can cause such error ?

Barbosa: Alright this is weird, so I’m trying to filter the getTransactions call by passing the lt and the hash parameter. Let say I have 4 transactions for a given addresss, I’m trying to pass the hash and lt of the 3rd one, but I keep getting errors like cannot locate transaction in block with specified logical time. Can someone help me ? Pretty sure this came across a lot of people

Nerses: what method should i use to store dict in TACT ?

Nerses: return beginCell()                     .storeUint(0, 2)           .storeDict(jettonWalletCode)           .storeDict(packJettonWalletData(0, ownerAddress, jettonMasterAddress, jettonWalletCode))           .storeUint(0, 1)          .endCell(); }

Nerses: here for storeDict i get error

Nerses: Type "Builder" does not have a function named "storeDict"

Illia: Can you provide the parameters you sub in?   I might have got confused with V2 and V3.  Can you call Indexer V3 API? It doesn't require any of them.  I used it a week ago   https://toncenter.com/api/v3/#/default/get_transactions_api_v3_transactions_get (reply to 35721)

Samdezero: Tact language developers are new to the market and often they aren't reliable as I'm experiencing trouble with the devs I hired.  However I have found some good gem of a developers too. Let me know if you have any works on tact based implementations, I can introduce you to a couple of reliable devs you can trust on with proven portfolio on tg bot based implementations, on both web3 and contract side.  Any references is appreciated as well. Thank you Community ❤️

Daniil: in what situation do you need to compose such cell? (reply to 35726)

Nerses: I am trying to write code in TACT that will calculate address of Jetton wallet (reply to 35736)

Illia: if you want some help, you need to provide the source code of the loop you're running (reply to 35715)

Illia: Have you tried initOf? There's also a standard for discoverable wallet addresses btw (reply to 35737)

Illia: timestamps on TON are in seconds; in tact you can simply write Int; or u may try to optimize it and make it uint32 (reply to 35712)

Max: Does anyone have examples of constructing a jetton’s metadata in a smart contract? I’d appreciate it  I’ve only found how to do it on the front-end side: https://github.com/howardpen9/jetton-implementation-in-tact/blob/9eee917877a92af218002874a9f2bd3f9c619229/sources/utils/jetton-helpers.ts#L18

Max: There’s a weird const ONCHAIN_CONTENT_PREFIX = 0x00, also some snake cells lol, sounds too complicated to be true

Dmitry: hello. when would you like to do that? (reply to 34172)

Illia: i haven't seen any for tact; the idea is that you need to port all these functions from TypeScript into Tact; they should be 1-to-1 pretty much (reply to 35741)

Max: Thanks for the feedback! I tried, but couldn’t figure out how to convert a dict/map into a Cell   return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell(); (reply to 35744)

Illia: where's exit code 3734 occurs in your code? (reply to 35708)

Illia: looks right; how do you create your dict? (reply to 35745)

Nerses: No.could you omeaae provide any link ? (reply to 35739)

Illia: https://tact-by-example.org/06-contract-deploy-another (reply to 35748)

Neo: how to parse contract event log , like this WithdrawEvent ?

Max: How do I find this out? (reply to 35746)

Illia: I've just taken a look at the transaction you provided below. There is a bounced action with exit code 3734 (reply to 35751)

Max: Do you mean there should be an error code “3734” explicitly defined somewhere in my code? (reply to 35752)

Illia: i don't know as i haven't seen your code; but 3734 is not a standard exit code, meaning your code should be throwing it somewhere (reply to 35753)

Anton: https://docs.tact-lang.org/book/debug#logging-local (reply to 35750)

Max: Interesting, there’s no such an exit code in my code (reply to 35754)

Dmitry: thx a lot (reply to 35757)

Illia: How to port HASHEXT_SHA256 to Tact via native functions?   I would like to have something like hashext_sha256(slice a, slice b)

Anton: looks like one of the CI checks failed there: > Check loading of syntax files / Check Query Files (pull_request) (reply to 35757)

Rayan: have TonCenter any limit for calls. what about TonWhales?

Illia: You can get a free API key which grants 10 RPS; you may get higher limits as well, take a look at their bot (reply to 35762)

10x: anyone have a good example for implementing an NFT mint in TACT? Also looking for any examples of a whitelist/merkle tree in TACT

Rayan: there is no other limit except rps? (reply to 35763)

Illia: What limits are you expecting to be there as well? (reply to 35765)

Degen: How to call the get method of other contracts in a contract

Rayan: Number of requests (reply to 35767)

Degen: like this

Illia: No way, it's not allowed. You need to send a message that will return some data back (take a look at wallet discovery standard as an example) (reply to 35768)

Illia: RPS stands for requests per second (reply to 35769)

Nerses: will that work for calculating Jetton wallet address ? (reply to 35749)

Illia: You need to provide the source code of your wallet that you're deploying (reply to 35774)

Nerses: in case I want to calculate in smart contract jetton wallet address of that contract should i provide jetton source code or smart contract code ? (reply to 35775)

Illia: Have a look at this  https://tact-by-example.org/07-jetton-standard (reply to 35776)

Neo: how to transfer jetton in ton space with mini app ? is there have example ?

Daniil: скажите пожалуйста, почему при деплое контракта выдает адрес уже существующего контракта, которые задеплоил другой человек? как исправить?

Dmitry: Адреса контрактов не зависят от того кто задеплоил напрямую. Они зависят от кода контракта и от начальных данных. Если вы используете одинаковый код и одинаковые начальные значения адресс будет тем же. (reply to 35780)

Dmitry: Можно добавить какое то новое поле. К примеру владелец. При вызове вставить ваш адрес.

Daniil: понял, спасибо. (reply to 35781)

Nerses: how to write this func code in TACT .store_int(workchain(), 8)                      .store_uint(cell_hash(state_init), 256)   ?

Nerses: I use that code snippet for calculatteing snmart contracts jetton wallet address what will be in case workchain isnt 0 ? (reply to 35785)

Illia: get fun verify() {   let x0: Slice = "Hello, ".asSlice();   dump("x0=");   dump(x0);    let h0: Int = sha256(x0);   dump("h0=");   dump(h0);    let x1: Slice = "World!".asSlice();   dump("x1=");   dump(x1);    let h1: Int = sha256(x1);   dump("h1=");   dump(h1);    let x2: Slice = beginCell().storeUint(h0, 256).storeUint(h1, 256).endCell().beginParse();   dump("x2=");   dump(x2);    let h2: Int = sha256(x2);   dump("h2=");   dump(h2); }  Why these two codes don't produce the same results?  console.log     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:38:7     #DEBUG#: x0=     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:39:7     #DEBUG#: s0 = CS{Cell{01f48b748656c6c6f2c2088b378303d88d0b96d111509551d748119a5b194818dbdb9d1c9858dd1ccbdb595c9adb1957dcdd1c99585b4b9d1858dd0e8cce0e8de0fe1430fe1430208d0b96d111509551d748119a5b194818dbdb9d1c9858dd1ccbdb595c9adb1957dcdd1c99585b4b9d1858dd0e8cce4e8de0fe1430} bits: 12..68; refs: 0..0}     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:42:7     #DEBUG#: h0=     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:43:7     #DEBUG#: 15948637247332847334751526614430217658224023850701350644207501345608022946634     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:46:7     #DEBUG#: x1=     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:47:7     #DEBUG#: s0 = CS{Cell{000c576f726c6421} bits: 0..48; refs: 0..0}     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:50:7     #DEBUG#: h1=     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:51:7     #DEBUG#: 36770597706723938441707517153172187416219044224004611621596231837816406157164     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:54:7     #DEBUG#: x2=     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:55:7     #DEBUG#: s0 = CS{Cell{008023429bd9ba98dd5140309bb9b0094b3aad642430fff6fb3ca61f008ce644f34a514b6bb7c846ecfb8d2d29ef0b5c79b63e6ae838f123da936fe827fda654276c} bits: 0..512; refs: 0..0}     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:58:7     #DEBUG#: h2=     #DEBUG#: [DEBUG] File contracts/merkle_stream.tact:59:7     #DEBUG#: 16692067631252981464795818515005889066649883679758444394813530541815757321025

Nerses: then what is the puprose in func code to use workchain() ? (reply to 35787)

Illia: import hashlib  x0 = "Hello, " h0 = hashlib.sha256(x0.encode()).digest() print("h0=", int.from_bytes(h0))  print(len(h0))  x1 = "World!" h1 = hashlib.sha256(x1.encode()).digest() print("h1=", int.from_bytes(h1))  print(len(h1))  x2 = x0 + x1 h2 = hashlib.sha256(x2.encode()).digest() print("h2=", int.from_bytes(h2))  print(len(h2))  Here's my python script  h0= 15948637247332847334751526614430217658224023850701350644207501345608022946634 32 h1= 36770597706723938441707517153172187416219044224004611621596231837816406157164 32 h2= 101313441018496298855616188252934726526525012911655317211406949275718146758767 32

Nerses: please can anyone check this code snippet if it is correctly written to calculate smart contracts Jetton wallet address in TACT ?https://gist.github.com/nerses-asaturyan/bba08a545d001717737fbfb00a602bb4

Andrew 🐾: Good day guys... Please is it possible to create a ton connect to a web application built with php

10x: Anyone have an example of a whitelist/merkle tree in TACT?

Andrew 🐾: Thanks man (reply to 35795)

Illia: Bloody hell. You're right. I haven't noticed that... It seems like I mistakenly changed the variable names... 😐 (reply to 35794)

Illia: All good now. Cheers mate 🥂

Родион: hi guys, can anyone explain how can i make an array in contract? its like const array 100 length.

Local: https://tact-by-example.org/04-arrays (reply to 35801)

Родион: thx. ive already saw it. but i cant get how to do it. how to deploy contract with a variable and an array in it. (reply to 35802)

Nerses: can I calculate Jetton contract code having only master Jetton contract address ?

Rayan: why TonCenter Apis work without apikeys? (reply to 35773)

Родион: guys, still cant understand how create an "array" then  deploy contract, Can anybody explain? something like in JS  const array = [ {name: "Joe", age: 32},{name: "Will", age: 22},{name: "Joe", age: 32}]   by the way, it can be that i don't need an array, but dont know how to architect contract without it (reply to 35801)

Родион: I have like 120 items, they will be in one map, like maps in map? or 120 variables? (reply to 35814)

Dmitry: array = map<int, XXX> (reply to 35801)

Dmitry: Xxx can be a struct

Родион: thx, and then, how to define variable with 120 structs? (reply to 35816)

Dmitry: What do you mean by define? Initialize with 120 elements at once?  + Do you want to do that from js or in the contract    Afaik map is a cell tree so you can create such a tree in js and send it. Maybe there is a map in ton/core already (reply to 35818)

Illia: like a free trial; so everyone can use it; like imagine you're non-dev trying to figure out how to create an API key... you don't really need this (reply to 35807)

Родион: Yep, 120 on init. In conract (reply to 35819)

— 2024-07-11 —

Degen: Unit testing, won't this error be thrown?

Degen: Why is the transaction array empty?

Degen: How to catch require errors to verify logic

Hellen 💷: TypeError: Cannot read properties of undefined (reading 'create')     at main (/root/ton-simulator/contracts/ruble/contracts/deploy.js:18:37) root@vm564849:~/ton-simulator/contracts/ruble/contracts#   🤮🤮🤮🤮 change of node version - no result

Hellen 💷: This deploying is endless , least give any advice

Degen: any body help me pay 1TON

BK: Your condition is incorrect, this require is always blocked at the beginning of the function. (reply to 35832)

Degen: yes i just for testing (reply to 35840)

Degen: same code, place them after deploy msg ,then can receive,put it under a separate 'it'  structure and no messages will be received

Son Pin: What’s foward fee? And forward fee is paid for storage fee or compute fee?

Nerses: can Jetton code be accessed only having master Jetton address ?

live: Can the master contract get the balance of this jetton holder?

Degen: Can dump output like console?

Degen: console.log(`${nftSaleWithBoxContract}`);

Degen: like this Placeholder

Anton: You mean template strings? Then no (reply to 35848)

Degen: yes

Degen: Is the query_id in the message body required?

Degen: Is there a problem if the query_id is the same every time?

Son Pin: I can understand that the foward fee will only be available if the contract sends the next message, right? (reply to 35856)

Degen: When I switch to the testnet in the sandbox, it says timeout

Nerses: Can this code be used to calculate Jetton wallet address ? fun packJettonWalletData(balance: Int, ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Cell {    return  beginCell()             .storeCoins(balance)             .storeSlice(ownerAddress)             .storeSlice(jettonMasterAddress)             .storeRef(jettonWalletCode)            .endCell(); }  fun calculateJettonWalletStateInit(balance: Int, ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Cell{       return beginCell()                     .storeUint(0, 2)           .storeRef(jettonWalletCode)           .storeRef(packJettonWalletData(0, ownerAddress, jettonMasterAddress, jettonWalletCode))           .storeUint(0, 1)          .endCell(); }  fun calculateJettonWalletAddress( stateInit: Cell): Slice{       return beginCell().storeUint(4, 3)                      .storeInt(0, 8)                      .storeUint(stateInit.hash(), 256)                      .endCell()                      .beginParse(); }  fun calculateUserJettonWalletAddress(ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Slice{   return calculateJettonWalletAddress(calculateJettonWalletStateInit(0,ownerAddress, jettonMasterAddress, jettonWalletCode)); }

Son Pin: fw fee is calculate in both sender and receiver? (reply to 35856)

Родион: hi! how an i send this arraylike dictionary to to the message reciever ?

Freeman: tact，一个合约怎么读取其他合约的状态变量呢 (forwarded from Freeman)

Anton: hi, the official language of this group is English, please refrain from using other languages here (reply to 35869)

Freeman: thinks bro

Vladislav: Hi, did you find a solution to the problem?  This task was not a priority for me, but I came across your message while I was solving another problem and now I have a solution (reply to 35836)

Degen: how to resolve

Degen: not yet, i don't know how to catch the errors , It doesn't seem to be executed in trycatch (reply to 35885)

Illia: You can expect a transaction with success: true (reply to 35885)

Illia: + you can expect an exit code that matches the hash of the string of the require (reply to 35885)

Illia: Btw @AntonTrunov what algorithm you're using for that? I may add this feature into Shrek so that people can add these errors into the logger and it will produce a handy wrapper (reply to 35891)

Illia: Wow where did you get this one? (the one message which was just deleted)

10x: is there no guide on deploying an NFT with tact??

Anton: It’s basically this one:    sha256_sync(errorMessageString).readUInt32BE(0) % 63000) + 1000   here it is: https://github.com/tact-lang/tact/blob/99c30636d41b76a9a5181790c9bb326116d0725a/src/types/resolveErrors.ts#L19 (reply to 35892)

Degen: Is it not possible to send messages from one contract to other contracts?

Degen: Why doesn't next_item_index increase?

Degen: It is possible to test the add message alone, but sending the add message from another contract will have no effect.

Degen: Sent here

Degen: NftSaleWithBoxContract holds the address of NftCollectionContract and then sends a message to the address of nftCollectionContract

Degen: outdated results? Do you mean that next_item_index actually increased?

User<7413585778>: Hello.I am a blockchain engineer and looking for a new project. If you are interested in exploring potential collaborations, please feel free to reach out to me.

Drag.vas: Hello everybody. Could you explain me how can I deploy smart contract without scanning QR code?

Teddo: U can use the —mnemonics argument when running your scripts, it'll require you to have your mnemonic as environmental variable (reply to 35938)

— 2024-07-12 —

Nerses: can ayone send jetton wallet address calculation docs (just cant find it,only spoken about using api)?

Nerses: how can i get jetton code on chain just having master jetton contract address ? or is there any other approach

jay: call master contract's getWalletAddress function

Nerses: I need to do that on chain (reply to 35985)

jay: I tried this, but failed. because I cant get the code of wallet contract.

Родион: hello! tell me pls how a can send dictionary with bigint key?

Degen: How to calculate the size of a map

Degen: Can I only control the calculation manually?

Dmitry: You can save length alongside (reply to 35993)

Degen: How to determine whether the map contains the specified key？

Max: Hey guys, how do you deploy a contract inside of another contract and return the new contract address? So that the client can get this new address   receive(msg: CreateMarket) {     let initCode: StateInit = initOf Market(self.marketCount, self.admin);     send(SendParameters{ … });         and now I want to return contractAddress(initCode) to the client. How do I do that?  }

Degen: emit ？？

Max: Let me try, thanks! (reply to 35997)

Degen: Why does this error appear when executing this line of code?

Degen: Can the key of map type only be of int type?

Anton: this is not a typechecking error, you have an issue in your typescript tests (reply to 36002)

Anton: addresses are allowed as map key types: https://docs.tact-lang.org/book/maps#allowed-types

Alfred: send a msg back to the caller with a body include the new contractAddress (reply to 35996)

Alfred: I think you are trying to console.log(JSON.stringify(mint_records)). Try print the address and count separately. (reply to 36000)

Degen: Unable to output json in the contract

Max: via emit or self.reply? (reply to 36006)

Degen: The official demo does not use address as key.

Degen: 🤔

Alfred: maybe custom Message, or you can try self.reply(address.asComment()) first if you don't need more data to provide back (reply to 36010)

Max: How do you then catch this reponse on the front-end? Is there any guide on that?

Alfred: Only dump the primitive value like dump(self.mint_records1.get(1)!!) (reply to 36008)

Alfred: It will return to the caller contract. If you'd like to get the address at FE. Just calculate it using the initCode and data again. (reply to 36014)

Alfred: const userAccountContract = provider.open(await UserAccount.fromInit(poolAddress ,providerAddress));     const userAccount = await userAccountContract.getAccount(); (reply to 36014)

Alfred: Similar to this one.

Max: We send the “CreateMarket” message to the MarketFactory —> MarketFactory replies to the message via self.reply —> I’m trying to understand how to get this response on the client side (reply to 36023)

Alfred: Use the similar code as you use on chain to calculate the address. It should be the same one.

Max: But how do you retrieve the response from  the .send function? (reply to 36025)

Freed: It is sent but result of execution is unknown. You probably would want to wait until transaction goes through and then read it's logs (reply to 36026)

Alfred: export interface Sender {     readonly address?: Address;     send(args: SenderArguments): Promise<void>; } (reply to 36026)

Alfred: You won't be able to read the result directly.

Alfred: Maybe use provider.getTransactions to read it once the seqno increase

Dmitry: Tact is not a js (reply to 36008)

10x: anyone know how to create an NFT in TACT?

10x: i see there are examples out there, i’d like to learn how to set up a typical mint function, with a public price & whitelist price

10x: also just make sure i’m doing everything right, in terms of the metadata, limitations on the mint (max / wallet, etc)

10x: there seem to be no examples except one very basic one i found

10x: no guides or anything.. whitelist/merkle tree does not seem possible

Niffler: just send Mint in comment message (reply to 36036)

Niffler: https://github.com/howardpen9/nft-template-in-tact/blob/a6ed450cf79eaaf7fe8bd1dc8cc0b62014dfd8e3/sources/contract.tact#L17 (reply to 36041)

10x: what do you mean by comment message? what do i need to do in order to accept payments from the minter, and check if they are on a whitelist? i guess whitelist can be implemented manually, thoguh for large whitelist this seems prohibitive (reply to 36041)

Liber: " Slice as remaining" What does that mean?

Anton: ⚡️ Added Mermaid diagrams of trait inheritance and contract dependencies to the compilation report  Did you know, that Tact produces a report of each compilation in a markdown format? If not, take a quick look at what it offers:  • Resulting BoC size of the contract in bytes • TL-B schemes of all Structs and Messages alongside with their Tact signatures • List of all getter functions • List of exit codes, both default and produced by calls to require()  And now, Tact also automatically generates neat Mermaid diagrams of trait inheritance and contract dependencies, and puts them in that .md file! Check your build folders once in a while, it's definitely worth it.  🧑‍🍳 Contributor: Gusarich 🐙 Implementation: #560 🍽 To be released in: v1.4.1 (quite soon!)  🍲 Look at this photograph ♨️ @tact_kitchen (forwarded from Tact Kitchen)

— 2024-07-13 —

Liber: thanks (reply to 36048)

Jake: I have the same question. Let me know if you have the answer yet 😄 (reply to 36044)

10x: nah im giving up for now. TON needs a dev framework like metaplex.. right now seems it’s only for experts (reply to 36071)

Jake: I’m looking to see if it can verify signatures, if it can then I’ll move all my logics to the backend for convenience sake (reply to 36072)

Freed: You need another smart contact to sell an NFT (reply to 36071)

Jake: Do you know if there is an example on verifying signature? Thanks (reply to 36074)

Freed: I'm sorry, signatures of what? Do you want to create custom contact with external message that can be verified using private key? (reply to 36075)

Freed: You might want to look into ton wallet implementation in tact and nft offer

Jake: I mean an external oracle party sign a message with his private key, and the onchain contract verify such signature using the public key

Freed: https://github.com/howardpen9/tutorial-customized-wallet_tact/blob/tutorial/sources/contract.tact (reply to 36078)

Jake: Such implementation is the basis for oracles on EVM for example

Freed: Line 40

Jake: Great, exactly what I need. Thanks Freed (reply to 36081)

Freed: You're welcome (reply to 36082)

Ginta 🦴: Has anyone watched the official contract video tutorial?

Ginta 🦴: i got an error while running test

User<6581944262>: Hello everyone, does anyone knows about a bot on telegram that only allows holder of an NFT (on TON blockchain) to enter the private group ? 😁

ok: May I ask if it is possible to sell an NFT in mind box, and withdrawal nft in telegram, and allow NFT withdrawals to be made by connecting to the Ton wallet for recharging

Guy: Hey, is there an example to parsing an event in Tact? I can't find anything online.  Thanks in advance

Guy: decoding the event

01896334476: Okay (reply to 36132)

Arslan: Hello

Arslan: Hi

User<7220515373>: I am from an affordable and experienced Dev studio that can handle TG games , Bots, Hackathon projects

01896334476: how

01896334476: how

Sergey: ❌ (reply to 36143)

Guy: Asking again, is there any code snippet of an event that emitted from a smart contract in tact,  and parsed in TypeScript? I am used to Solidity, and here I can't even find the event in the tx object...and help would be much appreciated,  thanks!

Guy: Thanks for the reply 🙌, I went through all of the documentation. I have a contract already with unit tests running in a Sandbox environment. The only this I am missing is the parsing of the events in TypeScript. Is there just a simple example of that? Thank u 🙏

Guy: Thanks again for the reply.  I already have the parsing itself (of messages and comments). It just seems as if the event itself is not emitted with the transaction. Could u please point me to where the event is? It's not under the 'events' section

Guy: Thank u 🙌 (reply to 36154)

— 2024-07-14 —

Igor: Does tact compiler works on browser?  https://docs.tact-lang.org/book/programmatic  Here in example Buffer.from(...) used which is nodejs API as I know.

Anton: It should work in the browser although we haven’t tried it for a while. Tact uses a virtual file system (reply to 36164)

Igor: Tried to bundle your dist files (they are in CommonJS style), what esbuild writes, dependings on "path, process, fs" (reply to 36165)

Anton: Can you open an issue please?🙏 (reply to 36167)

Chinwe2: Good morning I noticed that many people here are looking for some help regarding TG games, Bots, Lanuchpads, Market places , Hackathon etc...  Ping me a message and I will tell you more .I am from experienced venture builder and software studio Thank you 😊❤️

Degen: Does this simulate a wallet with a wallet balance of 0?

Degen: But why can I send it successfully using this deployment contract?

Degen: What is forward amount?

Xaalibuu: I don't know (reply to 36180)

Антон: GreenVault team is looking for a smart contract developer (FunC/Tact)  We are a young project in the DeFi sector on the TON blockchain. We need a talented developer to create smart contracts in FunC or Tact languages.  Requirements: - Experience in smart contract development - Knowledge of FunC and/or Tact - Understanding of TON blockchain principles - Experience with DeFi protocols is an advantage  Responsibilities: - Development and optimization of smart contracts - Participation in designing the architecture of DeFi applications - Interaction with the team for contract integration  We offer: - Work on innovative DeFi solutions - Opportunity for professional growth - % of profits after release  If you want to join the GreenVault team and create the future of decentralized finance, send us your resume in private messages.​​​​​​​​​​​​​​​​

Degen: Does this field represent all the fees for that transaction?

ㅤ: excuse me, in explorers I don't see code. only dissasembly into low level lang. is out there any way to see the code deployed? I must have missed it somewhere

Stephan: hi guys, please help, I have 1000 of my token on my contract, what will the code that will send the token from the contract look like?

Illia: Yeah. You can log your transactions with github.com/henchtab/shrek btw (reply to 36189)

Pedro|💲🔓: /

Salam: I want to build bot like this  https://t.me/tontrade?start=ChqCHB8k Which best language should I use Tact or Func or Fift?

— 2024-07-15 —

Degen: How to calculate the total fee of a transaction

Degen: I have a contract. After deducting the gas fee, the remaining amount is transferred to the specified wallet. However, the result calculated using this field is wrong. (reply to 36192)

kkk: Hello, can someone explain to me the relationship between Tact and Func? I'm just getting started, Ton. Thank you!

kkk: Do I need to start with Func? That seems a little difficult.

Degen: How is this fee calculated?

Degen: Can it be used in a sandbox? (reply to 36192)

Anton: Start with Tact (reply to 36207)

Slava: https://docs.ton.org/develop/smart-contracts/#programming-languages (reply to 36206)

Naveen Kumar: Hi Everyone, I have a doubt regarding Validation of Signed BOC in the Backend, I am following this article as reference, https://medium.com/coinmonks/understanding-ton-transactions-how-to-track-transaction-results-and-utilize-tonclient-b992336eb3a3 Here, they are getting the signed BOC from the frontend, How can I get the signed BOC in the backend as the functionality we have will initiate transactions on the backend level. Can anyone please clarify this doubt const openedWallet = client.open(wallet);     const seqNo = await openedWallet.getSeqno();     const message = internal({       to:toAddress,       value: toNano("0.01"),       body: beginCell().storeUint(0, 32).endCell(),       bounce: false,     });      const transfer = openedWallet.createTransfer({       secretKey: key.secretKey,       seqno: seqNo,       messages: [message],     });      const signedBOC = transfer.toBoc().toString("base64");     const hash = transfer.hash().toString("base64");     console.log("Signed BOC:", signedBOC); This is what I have tried but validation is not working properly, the validation code is the following  const transaction = await this.WaitForTransaction({       hash,       walletAddress: openedWallet.address,       refetchInterval: 2000,       refetchLimit: 10,     });     console.log(transaction); public static WaitForTransaction = async (options: WaitForTransactionOptions): Promise<Transaction | null> => {     const { hash, refetchInterval = 1000, refetchLimit, walletAddress } = options;     const client = await TonClientService.GetTonClient();     return new Promise((resolve) => {       let refetches = 0;       const interval = setInterval(handleTransactionCheck, refetchInterval);       async function handleTransactionCheck() {         refetches += 1;         console.log("waiting transaction...");         const state = await client.getContractState(walletAddress);         if (!state || !state.lastTransaction) {           clearInterval(interval);           resolve(null);           return;         }         console.log("last transaction available");         const lastLt = state.lastTransaction.lt;         const lastHash = state.lastTransaction.hash;         const lastTx = await client.getTransaction(walletAddress, lastLt, lastHash);          if (lastTx && lastTx.inMessage) {           const msgCell = beginCell().store(storeMessage(lastTx.inMessage)).endCell();            const inMsgHash = msgCell.hash().toString("base64");           console.log("InMsgHash", inMsgHash);           console.log("Hash", hash);           if (inMsgHash === hash) {             clearInterval(interval);             resolve(lastTx);           }         }         if (refetchLimit && refetches >= refetchLimit) {           clearInterval(interval);           resolve(null);         }       }     });   };

Hanson: hello everyone. is it possible to compile tact into FunC?

Winder: Does ton has the concept of block, if it does, what's the average block time

Mihas_sha: Hi, how can I verify sender address (JettonDefaultWallet) of the TokenNotification message in my contract?

Dmitry: https://docs.tact-lang.org/ref/core-common#contractaddress (reply to 36224)

Dmitry: its more interesting if it's not "default" wallet code. how should i obtain StateInit for such a Jetton?

Dmitry: master has  get_jetton_data() returns (int total_supply, int mintable, slice admin_address, cell jetton_content, cell jetton_wallet_code) total_supply

Dmitry: tldr for 2 lines is epic (reply to 36228)

Winder: Thanks. I noticed that there're two kind of blocks which are masterchain and workchain, and the master blocks are incremented 1 by 1, but workchain blocks are changing randomly. So if I want to do something like staking or lending which is based on block numbers, which number should I use? thanks (reply to 36230)

Winder: Thanks. I've read the doc before but I still have no idae about the question above (reply to 36234)

Rohit kumar: Hi

cindy: Hi,The exit code shows: 88.What is the meaning of 88? https://testnet.tonviewer.com/transaction/a275ecdfcc284115e7153cb8fab1d90491811f995d50572a115c072b67dced29

Guy: Hi :) If I want to read the map back to typescript (e.g. I have this map -  let m: map<Int, Int as uint64> = emptyMap();  And I send the map as a Cell and emit it in an event.  How do I read it? Is there some parameter for 'numItems' so I can traverse it? Thanks (reply to 34668)

BeingAmarachi_SOL: Hello everyone I'm a web3 UI/UX Designer and also a developer in framer  I'm opened to gigs and collaboration and happy to connect with y'all. Let's bullish the market ❤️

Guy: Thank u very very much! really helpful, enjoy the day :)

Anton: Release 2.3.0  Added: - Support for the latest Tact 1.4.0 - Inspections for out of range integer values in FunC and Tact - Inspections for integer division by zero in FunC and Tact - Inspections for integer overflow in FunC - Constant expression evaluation in FunC and Tact (with inline hints!)  Full changelog: https://github.com/ton-blockchain/intellij-ton/releases/tag/v2.3.0 (forwarded from IntelliJ TON Development)

David: How can I implement a transfer fee feature in the TokenTransfer and TokenTransferInternal messages of Jetton?

Mista: Hello, do you know how to generate unpredictable random values ​​in TON?

— 2024-07-16 —

Alfred: @nzhlfred 😉

Hanson: what about deving dapp in both Tact and FunC? like writing interface and storage in tact but logic codes in FunC. (reply to 36228)

Vincent: Hello all, I am new to Tact but is there anyway to obtain block number natively ?

Daniil: Why do you need that exactly? (reply to 36267)

Vincent: we are looking to use the block elapse to calculate the rate accrued but is it the best practive to use timestamp instead? (reply to 36268)

Daniil: Use timestamps (reply to 36269)

Vincent: Okay thanks man (reply to 36270)

Snow: hello I don't know how to make money if I apply to develop a game on ton

cj: Do you have a good example of code tact

Snow: For example, if I want to develop a small game and upload it to ton's gamefi, how would it be tied to ton tokens? And where are some other sources of profit outside of the game?

Tonion Dev: Hi  Maybe the below links be helpful:  Tonion quick start, help you to create Jetton by Tonion library so fast and easy: https://tonion.tech/docs/Getting%20started/quick-start   Tact by example: https://tact-by-example.org/07-jetton-standard (reply to 36274)

cj: thanks

cj: Can I consider Tonion as openzeppelin on Solidity

Jean-Baptiste: Quick question. In Func, one can write a constant like this   const getter_pool_address = "getter_pool_address"c;  Meaning basically, I want the CRC32 of that string.  I wasn't able to find a way to do this in Tact ? even by importing a func file ?

A: Hi I've got this compilation error for my tact code:   error: mixing type and non-type expressions inside the same tuple           (slice admin, slice operator) = $sc~$MyContract$init$_load();

A: Could anybody suggest what's the problem?

Tonion Dev: Actually yes (reply to 36278)

Daniil: Can you share the source code that led to that error? (reply to 36282)

Daniil: Not possible yet, but will be in 1.5.0 (reply to 36280)

Max: Is it possible to log data in a human readable way on testnet? So I could see it in an explorer somehow

Денис: Hello everyone. Tell me how to implement the following solidity code on tact, given that in TON mapping users it is a smart contract with its state? Thanks  while (users[_user].uplines[_round] == 0) {             _user = users[_user].uplines[0];         }

Max: How do you handle incoming jetton transfers in a smart contract?  In case someone sends a custom token to a smart contract, how can I retrieve the amount and the address of the token being sent?

Alexander: Hi guys, could you please clarify on getting multiple data from a slice. I can see in docs methods like loadInt, loadBool etc but can't find how to read multiple variables. Say I stored data like beginCell().storeInt(1).storeBool(true).asSlice() - how to read both variables? Should I call sequentially loadInt then loadBool and this will  read them correctly or somehow else? Thanks!

Alfred: loadInt and then loadBool, read in the same sequence. (reply to 36295)

Alexander: Great, thanks! 👍

Daniil: And also, you don’t have to compose cells manually, you can just use .toCell() method of your defined struct. (reply to 36295)

Daniil: Not internal_transfer but transfer_notification (reply to 36299)

Daniil: “Internal transfer” messages are sent between jettonwallets and used internally for Jetton logic

Stanley: Hey guys, is there an SDK where I could utilise for programmatically making t9ken swaps on TON ?

Max: Thank you! (reply to 36299)

Max: In my case I have the following message with the same code 0x7362d09c:  message(0x7362d09c) TokenNotification {     query_id: Int as uint64;     amount: Int as coins;     from: Address;      forward_payload: Slice as remaining; }  And here’s how I’m trying to handle an incoming transfer:  receive(msg: TokenNotification) {     emit("Tokens transferred!".asComment()); }  Am I getting this right?  Btw, the implementation from your link has a bit different parameter name, instead of from: Address it has sender: Address. I’m using the implementation from tact-by-example (reply to 36299)

Daniil: seems right. but note that if the sender set forwardAmount = 0 you won't receive that notification message. (reply to 36306)

Max: So I might not be able to get that notification if I send a regular transfer from a wallet, correct? (reply to 36307)

Daniil: right (reply to 36308)

Stephan: hi guys, please help, I have 1000 of my token on my contract, what will the code that will send the token from the contract look like?

User<7413585778>: hello. is anyone looking for a blockchain engineer?

Nyxtharion: You can DM me your experiences (reply to 36314)

— 2024-07-17 —

Kraven: Can some one guide me how to send jetton in js

Hanson: hey guys, what is the best way to impl enum type

Hanson: make it a struct and some extension funcs? (reply to 36321)

Bear: Hi, how to instantly get TL-B in Tact compiled data? (reply to 26654)

Max: Is there a way to validate the jettons that are being received?   receive(msg: TokenNotification) { … }   I need to verify that we’ve receiving the right jetton in this function.  I was thinking that context().sender will return the master address, but it returns something different (reply to 36307)

harlan: Is there a demo for staking ton and jetton tokens?

Max: https://github.com/howardpen9/staking-in-tact/tree/main (reply to 36326)

harlan: He stores all the data in the map, so there will be problems if there is too much data.

cindy: HI, where can i find the error code? The exit code show 83.however,why?

cindy: https://testnet.tonviewer.com/transaction/751e8941af6224689be085973d33c5b11d5c27efce3f3f494ed34c87ebd4c384

Justin1: Hi, I see queryId in some message. For example, TokenTransfer message has the queryId Param, but I dont see it is used anywhere on jetton contract. What is this queryId used for?  message(0xf8a7ea5) TokenTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     responseDestination: Address?;     customPayload: Cell?;     forwardTonAmount: Int as coins;     forwardPayload: Slice as remaining; }

Nerses: How can I write analog of this solidity code in TACT ?     commitId = sha256(       abi.encodePacked(         address(this),         msg.sender,         msg.value,         dstChain,         dstAsset,         dstAddress,         srcAsset,         srcReceiver,         timelock,         messenger       )     );  where fields have this types in solidity     string memory dstChain,     string memory dstAsset,     string memory dstAddress,     string memory srcAsset,     address srcReceiver,     uint timelock,     address messenger,uint msg.value,address msg.sender,address address(this)

Daniil: context().sender in this case is Jetton wallet address of your contract.  You can store the expected address in contract storage (reply to 36324)

Aish: Hey guys, Self.reply and sending balance in sendRemainingValue mode in transactions only send the TON amount that is remaining from the transaction Fees is what I read.  But when I use them in my contract, a little amount of TON from my contract is getting deducted. So at some point will my contract be depleted of all TON.

Winder: I found dump() in tact will cause some problems sometime. If I remove dump(), things will be ok. Any one got this problem?

Anton: nope, works fine for me  have you checked if the gas is sufficient? (reply to 36354)

Winder: yes. I checked the gas, I changed the gas from 1 ton to 10 ton, but still fails. weird. Sometimes it makes the tx fail, sometimes it makes the message send fail. (reply to 36355)

Max: My contract dynamically mints these jettons. How do I obtain the jetton wallet address for the jetton upon its initiation?  Here’s how I mint them: receive("InitJettons") {         let theInitCode: StateInit = initOf TheJetton(…);                  self.theJetton = theInitCode;                  send(SendParameters{ …  });          // How do I obtain the jetton wallet address for the contract here? }  And here’s how I handle the incoming transfers of the same jettons in the same contract: receive(msg: TokenNotification) {         let jettonWalletAddress: Address = context().sender;                  // Here I want to ensure that the received jettons == TheJetton that we’ve created above } (reply to 36348)

Winder: But If I remove the dump() or change the config from debug: true to debug: false. Things got OK. It happened sometime, not always. Seems some condition makes the error

Daniil: What’s the exit code? (reply to 36356)

Winder: -14 (reply to 36359)

Winder: I got this. It does a out of gas error, thanks guys

Nerses: what can cause such error Type "Builder" does not have a function named "storeMaybeStringTail"                                                                               Line 153, col 30: > 153 |             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeUint(ctx.value,257).storeMaybeStringTail(msg.data.dstChain).asSlice();

Anton: do you have the storeMaybeStringTail function? (reply to 36365)

Bianca: Hello, we are lооking for emрlоyees for a crypto рroject! : Beta tester ($37/hour) Moderator ($400/week) NFT artist (to be discussed) Advertisers (to be discussed) Web Developer (to be discussed) If you are interested in collаborating, plеase send me a DM !!

Nerses: https://github.com/ton-org/ton-core/blob/main/src/boc/Builder.ts#L409    i wanted to use this function in TACT smart contract (reply to 36366)

Anton: is this tact code? (reply to 36365)

Nerses: of course not it is in type script,But doesnt all that functions implemented in TACT stdlib? (reply to 36370)

Anton: no

Nerses: : (reply to 36347)

User<7080417626>: GM ser (reply to 36370)

Nerses: Then how can i solve the problem which i mentioned ? as storing strings isnt implemented (reply to 36372)

Nerses: because of this line of code compute phase is failed            let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeInt(ctx.value,257).storeSlice(msg.data.dstChain.asSlice()).storeSlice(msg.data.dstAsset.asSlice()).storeSlice(msg.data.dstAddress.asSlice()).storeSlice(msg.data.srcAsset.asSlice()).storeAddress(msg.data.srcReceiver).storeInt(msg.data.timelock,257).storeAddress(msg.data.messenger).asSlice();  how should i write the code to pass it ? i get exit code 8 cell overflow

Stephan: hi guys, please help me, I created jeton according to this standard https://tact-by-example.org/07-jetton-standard  after that I had to send my created token from the contract, I sent 1000 tokens to the contract.  Next, I imported the jetton file  import "./sample_jetton";   and used the TokenTrasnfer message  receive("Finish") {         require(self.playersCount == MaxPlayers, "Maximum");         require(sender() == self.owner, "Only owner is allowed to finish game");         require(self.state.status == StatusStarted, "Only started game is allowed to finish");          nativeRandomizeLt();           let wonAmount: Int = (self.ticketsCount * ton("1") - self.meta.comissionAmount);          let winnerTicket: Int = random(1, self.ticketsCount + 1);          let winner: Address = self.state.tickets.get(winnerTicket)!!;          self.state.winnerTicket = winnerTicket;         self.state.status = StatusFinished;                   send(SendParameters{                 to: winner,                  value: 0,                 mode: SendIgnoreErrors,                  bounce: false,                 body: TokenTransfer{                     queryId: 0,                     amount: 100,                     destination: winner,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             });       }    I wanted to send 100 jettons to the address of the winner in my lottery  then I ran the script. The lottery winner was selected but the tokens were not sent to him.  const sendParams = {         value: toNano('0.1'),          bounce: false      };       await lotteryJtl.send(         owner, {              value: sendParams.value,          },           'Finish'     );   how can I solve this problem, please help me 🙏

Anton: you are trying to fit too much data into one single cell  one cell can only contain up to 1023 bits of data, and each address occupies 267, so you can store only 3 addresses in a cell and even a 257-bit integer won’t fit anymore (reply to 36384)

Anton: you need to create a tree of cells, using cell references

Nerses: slc0 has only 4 references,slc1 has 2 address and 1 int, and slc has 2 address 1 int and 2 ref. Cant figure out where is overflow as cell can have up to 1023 bit and 4 refs (reply to 36388)

Anton: where do you have endCell() in your original expression? (reply to 36390)

Nerses: i havent any (reply to 36391)

Nerses: let slc1: Cell = beginCell().storeAddress(msg.data.srcReceiver).storeInt(msg.data.timelock,257).storeAddress(msg.data.messenger).endCell();             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeInt(ctx.value,257).storeRef(slc0).storeRef(slc1).asSlice();

Nerses: should it be like this ?

Anton: I have no idea, that totally depends on what you are trying to do

Nerses: I meant will it pass compute phase ? (reply to 36395)

Daniil: I strongly recommend you to use structs in Tact instead of manually composing and parsing cells (reply to 36393)

Nerses: In my case I need to do sha256 of message few fields that I received.Do you recommend to create struct from needed fields and then pass it as argument for hash function ? (reply to 36397)

Stephan: hi guys, please help me, I created jeton according to this standard https://tact-by-example.org/07-jetton-standard  after that I had to send my created token from the contract, I sent 1000 tokens to the contract.  Next, I imported the jetton file  import "./sample_jetton";   and used the TokenTrasnfer message  receive("Finish") {         require(self.playersCount == MaxPlayers, "Maximum");         require(sender() == self.owner, "Only owner is allowed to finish game");         require(self.state.status == StatusStarted, "Only started game is allowed to finish");          nativeRandomizeLt();           let wonAmount: Int = (self.ticketsCount * ton("1") - self.meta.comissionAmount);          let winnerTicket: Int = random(1, self.ticketsCount + 1);          let winner: Address = self.state.tickets.get(winnerTicket)!!;          self.state.winnerTicket = winnerTicket;         self.state.status = StatusFinished;                   send(SendParameters{                 to: winner,                  value: 0,                 mode: SendIgnoreErrors,                  bounce: false,                 body: TokenTransfer{                     queryId: 0,                     amount: 100,                     destination: winner,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             });       }    I wanted to send 100 jettons to the address of the winner in my lottery  then I ran the script. The lottery winner was selected but the tokens were not sent to him.  const sendParams = {         value: toNano('0.1'),          bounce: false      };       await lotteryJtl.send(         owner, {              value: sendParams.value,          },           'Finish'     );   how can I solve this problem, please help me 🙏

Vincent: The to argument should be the jetton wallet address of your contract, not the winner's address (reply to 36399)

Stephan: and how to define it? Is there a command? (reply to 36402)

Max: I’m trying to generate an address of a contract’s jetton wallet. Is this the right way to do it?  let JettonInitCode: StateInit = initOf TheJetton(self.admin, TheJettonInfo.toCell(), ton("1000000000"));  let TheJettonWalletInit: StateInit = initOf JettonDefaultWallet(self.admin, contractAddress(JettonInitCode));  let TheJettonWalletAddress: Address = contractAddress(TheJettonWalletInit); (reply to 36357)

— 2024-07-18 —

Aish: Hi all, I am creating a tact contract that accepts TON as payment and am emitting an event upon receiving the payment.  I wanted to create an event listener in backend (Typescript) that catches the event real time. Is there any github repo or code example for this as I am unable to find any.

Truong: https://github.com/tact-lang/contract-payouts/blob/main/sources/contract.events.ts (reply to 36414)

cindy: I also get 708. how do you resolve it? (reply to 33807)

Sumit: Check the func code for token (reply to 36416)

Sumit: And find 708

cindy: yeah. i have checked it.throw_unless(708, slice_bits(in_msg_body) >= 1); (reply to 36418)

cindy: the msg body is not empty. like your code: https://katb.in/qiviruxejik (reply to 36418)

Sumit: I fixed it by changing my TokenTransfer struct (reply to 36419)

cindy: Do you mean this struct?:  message(0x0f8a7ea5) JettonTransfer {     query_id: Int as uint64;                // arbitrary request number     amount: Int as coins;                   // amount of jettons to transfer     destination: Address;                   // address of the new owner of the jettons     response_destination: Address;          // address where to send a response with confirmation of a successful transfer and the rest of the incoming message Toncoins.     custom_payload: Cell?;                  // optional custom payload     forward_ton_amount: Int as coins;       // the amount of nanotons to be sent to the destination address.     forward_payload: Slice as remaining;    // optional custom data that should be sent to the destination address. } (reply to 36421)

Sumit: Yes (reply to 36422)

cindy: What is the wrong field? (reply to 36422)

Anton: check the abi report in your output directory (reply to 36416)

cindy: sorry, i just call the other jetton contract.and it says 708. (reply to 36425)

cindy: My output directory has no 708 error code

NEEEEEEEEEEEEEEEEEEK: hi 👋 Tajikistan 🇹🇯 ba peshhh

Mouzim: https://www.instagram.com/reel/C9jUlzsSibt/?igsh=dWpyMGs4YmxqeGQz

cindy: struct JettonTransferForwardPayload {     is_right: Bool;     value: Slice as remaining; }  message(0x0f8a7ea5) JettonTransfer {     query_id: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: JettonTransferForwardPayload; }

cindy: I will try this again.

Sumit: use https://github.com/howardpen9/jetton-implementation-in-tact transfer struct from this (reply to 36431)

cindy: thanks. (reply to 36433)

Mouzim: https://www.instagram.com/reel/C9jUlzsSibt/?igsh=dWpyMGs4YmxqeGQz

Aish: Thanks will check (reply to 36415)

cj: jetton how to swap with ston.fi? Which Jeton feature was used

di: the bot of givetester send captcha, but no way to fill the number

Johnny Le: transfer jetton to pool. then pool transfer back to wallet lol (reply to 36437)

Nerses: because of this code I get Cell underflow solidity             let slc0: Cell = beginCell().storeRef(msg.data.dstChain.asSlice().asCell()).storeRef(msg.data.dstAsset.asSlice().asCell()).storeRef(msg.data.dstAddress.asSlice().asCell()).storeRef(msg.data.srcAsset.asSlice().asCell()).endCell();             let slc1: Cell = beginCell().storeAddress(msg.data.srcReceiver).storeInt(msg.data.timelock,257).storeAddress(msg.data.messenger).endCell();             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeInt(ctx.value,257).storeRef(slc0).storeRef(slc1).endCell().asSlice();     Can someone explain what is wrong with that code ?

cindy: i got overflow (reply to 36445)

Nerses: https://testnet.tonscan.org/tx/uQCh0n-dB-6VfzdeRjIbWA57B0SaHxMwKjaJd_o3_9Y=   here is the transaction which terminated with exit code 9 (reply to 36446)

cj: In tact language,Do you have any examples of Jetton interacting with other contracts?

Degen: When using tonConnectUI to send a specified message to a contract, is the message type specified in the payload?

Degen: How to use tonConnectUI to achieve similar

cindy: I am using this struct,however,i got cell overflow. The difference is  change forward_payload: Slice   to  forward_payload: Slice as remaining. I found it so hard to debug the errors.  message(0x0f8a7ea5) JettonTransfer {     query_id: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining;  }

Nerses: How can i concatenate all this data as String in TACT     myAddress(): Address,     sender(): Address,     ctx.value: Int,     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address;

Nerses: and i will not get overflow ? (reply to 36456)

Nerses: will this work properly ?             let aggregatedData: StringBuilder = beginString()                                         .concat(myAddress().toString())                                         .concat(sender().toString())                                         .concat((ctx.value).toString())                                         .concat(msg.data.dstChain)                                         .concat(msg.data.dstAsset)                                         .concat(msg.data.dstAsset)                                         .concat(msg.data.dstAsset)                                         .concat((msg.data.srcReceiver).toString())                                         .concat((msg.data.timelock).toString())                                         .concat((msg.data.messenger).toString());              let commitId: Int = sha256(aggregatedData.toString());     as in sha256 is written that String input should have a number of bits divisible by 8. Should I do additional check on that ?

angel: I am going to create 5% commission Jetton that 5% of total amount is transferred to Jetton owner's wallet when users pucharge and sell from Ston.fi. To do this, I have built a Jetton, but 5% commission is applied to all transaction including users transfer, not only transaction from Dex. so I thought to ignore users transfer by adding "if" statement passing only pucharge/sell from Dex. however, to add "if" statement, I have to know already added Dex pool address. but how can I add liquidity using my Jetton don't deployed yet? I use Tact language and it is good. There is a upgrade method, but Tact don't allow upgrading smart contract now. Is there any other solution you know? I hope you helping me. Thank you.

Mirka: Stonfi stores all jettons here: EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt (reply to 36462)

Mirka: You can also add way to add address (reply to 36462)

angel: thank for your reply. I donot know well. can you explain in more detail please? (reply to 36465)

angel: and can I implement this function using Tact?

Nerses: https://docs.tact-lang.org/ref/core-math#:~:text=Computes%20and%20returns%20the%20SHA,bits%20of%20data%20in%20total).    as sha256 works like this how i can do sha of this data     myAddress(): Address,     sender(): Address,     ctx.value: Int,     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address;     ?

Anton: if the type of hash function is not important, you can turn your struct (I assume those are struct fields) into a cell and then call the .hash() method on the cell (reply to 36470)

Nerses: they are fileds of message.So i should store everything in one cell using refrences then do sha256 ? (reply to 36471)

Anton: sha256 works on slices or strings, you need .hash

Nerses: In case data is a String it should have a number of bits divisible by 8, and in case it's a Slice it must also have no references.I think there isnt way to use all the data for sha256 (reply to 36473)

Stephan: hi guys, please help me, I created jeton according to this standard https://tact-by-example.org/07-jetton-standard  after that I had to send my created token from the contract, I sent 1000 tokens to the contract.  Next, I imported the jetton file  import "./sample_jetton";   and used the TokenTrasnfer message  fun jettonWalletAddress(owner: Address): Address {         let init: StateInit = initOf JettonDefaultWallet(myAddress(), owner);         return contractAddress(init);     }  receive("Finish") {         require(self.playersCount == MaxPlayers, "Maximum");         require(sender() == self.owner, "Only owner is allowed to finish game");         require(self.state.status == StatusStarted, "Only started game is allowed to finish");          nativeRandomizeLt();           let wonAmount: Int = (self.ticketsCount * ton("1") - self.meta.comissionAmount);          let winnerTicket: Int = random(1, self.ticketsCount + 1);          let winner: Address = self.state.tickets.get(winnerTicket)!!;          self.state.winnerTicket = winnerTicket;         self.state.status = StatusFinished;          let winnerJettonWallet: Address = self.jettonWalletAddress(winner);          send(SendParameters{                 to: winnerJettonWallet,                  value: ton("0.01"),                 mode: SendIgnoreErrors | SendRemainingValue,                 bounce: false,                 body: TokenTransfer{                     queryId: 0,                     amount: 100,                     destination: winnerJettonWallet,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             });       }    I wanted to send 100 jettons to the address of the winner in my lottery  then I ran the script. The lottery winner was selected but the tokens were not sent to him.  const sendParams = {         value: toNano('0.1'),          bounce: false      };       await lotteryJtl.send(         owner, {              value: sendParams.value,          },           'Finish'     );   how can I solve this problem, please help me 🙏

cindy: Hi, I fixed it by changing the  slice as Remaining  to  slice. and it works. however, i am stilll confused at this. I am also using your funciton here.  But I wonder why it can't support SLICE AS REMAINING ? fun createSwapBody(userWalletAddress: Address,         minAskAmount: Int,         askJettonWalletAddress: Address,         referralAddress: Address?): Slice {         let builder: Builder = beginCell().         storeUint(0x25938561, 32).         storeAddress(askJettonWalletAddress         ).storeCoins(minAskAmount).storeAddress(userWalletAddress);         if (referralAddress != null) {             builder = builder.storeUint(1, 1);             builder = builder.storeAddress(referralAddress!!);         } else {             builder = builder.storeUint(0, 1);         }         return builder.asSlice();     } (reply to 36421)

Sumit: No idea. I think its some func/tact compat issue (reply to 36478)

Nerses: Who can provide any TACT code where is done Jetton sending ?

Nerses: how to check TON user friendly address validation in type script ?

Rahul: https://ton-org.github.io/ton-core/classes/Address.html#isFriendly (reply to 36482)

Tonion Dev: Hi Nerses,  I hope this link help you  If you have any questions feel free to ask 😎  https://github.com/ton-ion/tonion-contracts/blob/0a9a8b3caf97faeed7cbfbff01d2fcfc7efd53d9/contracts/traits/tokens/jetton/JettonWallet.tact#L167 (reply to 36480)

Tonion Dev: Could you please share more information about your problem, I hope can help you 👍 (reply to 36448)

— 2024-07-19 —

Vasily: Guys, is it possible to recognize transactions in the blockchain on Tact? For example: purchase of a token and withdrawal of rewards from a liquid pool? If so, how can I do it?

User<7413585778>: sure, it is possible. to identify specific transactions such as the purchase of a token or withdrawal of rewards from a liquidity pool, you need to monitor and analyze the blockchain for relevant transaction types and smart contract interactions.  any other questions? or do you need a developer for this work? (reply to 36507)

Vasily: Thank you. Which methods can be used to analyze a blockchain for transaction types? (reply to 36508)

User<7413585778>: yeah, so there are some methods to identify specific transactions. well, you can identify it by setting full node.  then, in programming, you can make custom scripts (using python, js, ton sdk and so on) and interact with smart contracts. (reply to 36511)

Vasily: All right, thank you! We'll give it a try. (reply to 36512)

harlan: The tons pledged by the user remain in the master contract. When pledging, the user's contract is created. How should the message be sent?

Gally: why result = undefined when send message to ton contract

Davis: Hello, how can I build a contract that can send multiple NFTs to upgrade into another NFT?

A: Hi guys. Is there any documentation about how to work with Cell, Slice, and Builder data types in Tact? I know that they are low-level primitive data types in Tact, but have not seen any tutorials about them.

Alfred: Check the examples and existing contract. (reply to 36530)

A: I didn't get it. I know that there are methods like toCell() or toCell.asSlice() to convert complicated data types to Cells or Slices and vice versa ( using fromCell() or fromSlice() ) but I still do not understand why and where should we use Cells or Slices? (reply to 36531)

Alfred: If you are using tact, usually you can use a struct/message. If you wanna to process a message from an existing contract and you know how the data looks like, you can use cell.loadXXX to read them.

Alfred: struct and message will be compiled to cell and slices as well.

Degen: https://testnet.tonviewer.com/transaction/7c4e8deccf89d6966dfda559c194cce23fe3cccd60480d7020686f004743a76c  Who can help me analyze this transaction?

Degen: Why was 0.09 tons finally sent back to the sender?

Louis: How to deploy Jetton contract in factory contract

User<7413585778>: hello. is anyone looking for a developer?

Jayesh: No (reply to 36555)

Nerses: is there any example of Jetton transefer (NOT internal).for example how smart contract (TACT) sends Jetton to wallet ?

Nerses: what Jetton Transfer message op_code 0x0f8a7ea5  or  0xf8a7ea5 ?  In differnet implemenatations I have seen both

Nerses: does this code has correct structure for sending Jetton from smart contract to receiver ?         send(SendParameters{                 to: jettonWalletAddress,                 value: ctx.value,                 bounce: true,                 mode: 0,                 body: TokenTransfer {                                     queryId: 9072345,//e.g.                                     amount: (self.commits.get(msg.data.commitId)!!).amount,                                     destination: (self.commits.get(msg.data.commitId)!!).sender,                                     response_destination: ctx.sender,                                     custom_payload: null,                                     forward_ton_amount: ctx.value,                                     forward_payload: "Token Transfer".asSlice(),                                  }.toCell(),                 code: init.code,                 data: init.data             }         );

— 2024-07-20 —

cindy: Hi Devs, I parsed the forward_payload using loadUint(32), i get the op code :0x2283c2a0,which is different with the offical opcode: 1158120768. Why it's different?

Лев: Hello everyone, do you know, which code is responsible for receiving the number of Ton that came to my smart contract?

Лев: Thank you (reply to 36584)

cindy: Dear Devs, 1、How to get the jetton(such as USDT,etc)  wallet address of user? I beleive it can't be got unless the address is passed as arguments. 2、How to get the owner address from the jetton(such as USDT,etc) wallet address?  I mean by tact contract call,not api. pls help me. thanks.

Лев: Hello everyone, I want to divide by two the money that came to me from another smart contract, but the compiler swears at this line:         val: Int = context().value / 2;   Do you know, where is the problem? It is the TACT

Anton: you cannot use context() during storage (contract) variable declarations, and if this is inside a function, then you need to use let val = … (reply to 36588)

Лев: Thank you very much

A: Please share StonFI/DeDust UI link for testnet

Moni Rul: Hi

∆yoseun: Hello guys   Please can someone help me, how do I view an emit event, when I call for example  emit(Saved{user:"king"}.to cell()) How do I get the word king out of the emitted event

∆yoseun: Could you provide a code snippet for parsing the cell please

∆yoseun: Is it possible to initialize a Jetton and still call mint in the same function from a contract, sorry I'm coming from a solidity background

∆yoseun: Thanks for this. (reply to 36600)

∆yoseun: Thanks alot

∆yoseun: What about this (reply to 36602)

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please

Son Pin: Anyone familiar with dedust sdk?

Son Pin: I use sdk to add liquidity but its fail with 263

Son Pin: my code is follow docs. but it’s fail when deposit native TON (forwarded from Son Pin)

Son Pin: https://tonviewer.com/transaction/a43238ebf89d937bcce52a01105a2ed601aecac1c757cb2e6d353ef53641ecee (forwarded from Son Pin)

Son Pin: Can you help me (reply to 36610)

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please

perfect: hello, expert. I'm new to TON and I'd like your help with my code. I defined these 2 types and don't know how to send message in a test script... (reply to 36616)

perfect: struct Array {     tiers: map<Int as uint16, Int>; // array of Int values as a map of Ints to Ints,                                   // with serialization of its keys to uint16 to save space     length: Int = 0;              // length of the array, defaults to 0 } message CreateTiers {     queryId: Int as uint64;     // amount: Int as uint32;     tierFees: Array; }

perfect: await vmContract.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'CreateTiers',             queryId: 0n,             tierFees: {                 $$type: 'Array',                 tiers: {},                 length: 3n             },         }     );

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please

Anton: how about you stop spamming with the same question in this group and make an effort writing local tests? (reply to 36624)

∆yoseun: [       {         info: {           type: 'external-out',           src: EQCtJ6KjkuS08sTPviNjUJZbtUJfwDVIH-Zl5Ov6X4nntqhX,           dest: undefined,           createdAt: 1721510241,           createdLt: 7000002n         },         init: undefined,         body: x{000000004361746368206D6520696620796F752063616E2C204D722E20486F6C6D6573}       },       {         info: {           type: 'external-out',           src: EQCtJ6KjkuS08sTPviNjUJZbtUJfwDVIH-Zl5Ov6X4nntqhX,           dest: undefined,           createdAt: 1721510241,           createdLt: 7000003n         },         init: undefined,         body: x{8827C71D801B8E59908A538F3BDDCD273975425705741ED8315C17E70312DA9E81763F4C24D_}          x{00C_}           x{2_}            x{BFF082EB663B57A00192F4A6AC467288DF2DFEDDB9DA1BEE28F6521C8BEBD21F1EC_}             x{0068747470733A2F2F692E6962622E636F2F4774685A3838502F6231383036396333623261632E6A7067}            x{2_}             x{2_}              x{BF4546A6FFE1B79CFDD86BAD3DB874313DCDE2FB05E6A74AA7F3552D9617C79D13_}               x{0041796F7365756E20546F6B656E}              x{BF6ED4F942A7848CE2CB066B77A1128C6A1FF8C43F438A2DCE24612BA9FFAB8B03_}               x{004159534E}             x{BF89046F7A37AD0EA7CEE73355984FA5428982F8B37C8F7BCEC91F7AC71A7CD104}              x{0046756C6C206F662066616974683B2066756C6C206F662074686520737069726974203A29}       }     ]   This is what i get (reply to 36604)

∆yoseun: How do i deserialize the message body

∆yoseun: yea i did that

∆yoseun: const emits: ExternalOut[] =createTokenResult.externals; let slice=emits[0].body.beginParse() console.log(slice);

∆yoseun: This is correct right? (reply to 36636)

∆yoseun: I am trying to get this data  emit(ContractDeployed{tokenInfo:msg.content,contractAddress:address}.toCell())

∆yoseun: I want to get the address and tokenInfo which is a cell

∆yoseun: I greatly appreciate your help

— 2024-07-21 —

Gleb: Seeking Partners for Ton Projects  ﻿﻿﻿1. Real Estate (RWa) ﻿﻿﻿ 2.SocialFi + NFT  ﻿﻿﻿3.Self-Development App

ㅤ: Привет тезка, подробности в лс можна ? (reply to 36646)

Лев: Hello everyone, I want to send back half of the amount that came to me to the smart contract, I wrote this code:           let v: Int = context().value / 2;   but I don't get half of it, but it's unclear what amount, can you tell me where is the problem? This is Tact.

cj: ton is async,If I swap, Jetton's outgoing transaction is successful, but the incoming transaction fails,Will my Jetton disappear?

Howard: nope.   But what is the incoming Tx fails? Example TX? (reply to 36649)

Dexta: Do you also need a community manager?  I'm available for that (reply to 36646)

Max: Hey guys, I’m trying to handle incoming transfers of USDT to my contract.  Is this the right way to get the contract’s wallet address for USDT?   self.USDT_MASTER_ADDRESS = address("EQBxyk…”);  let USDTWalletInit: StateInit = initOf JettonDefaultWallet(myAddress(), self.USDT_MASTER_ADDRESS);  self.USDTWalletAddress = contractAddress(USDTWalletInit);

Alfred: You need to have the init data of the USDT contract

Max: Is that for sure? How would you handle transfers of third-party jettons if you don’t have their code? (reply to 36658)

Max: As I see JettonDefaultWallet accepts these init params:  init(owner: Address, master: Address) {  }  Why can’t I simply pass my contract’s address as an “owner” and the USDT’s master contract address as a “master”?

Degen: Why can't the browser index nft meta data?

Degen: Is tact placed in the custom_payload field?

∆yoseun: Any tutorial or code snippet on how i can read emit in react using any ton react library?

Degen: Why can't I index the meta data?

Degen: Using the method on the document

Cardinal: Hi, can you tell me how to get the user's payment history in the contract? like he paid something 3 times, and to get something he sends it to the claim function, and it checks if he really paid. it is not cheap to get through storage.

Emmanel: Use apis (reply to 36671)

Cardinal: hm, when user send claim, smart contract send api and when get true from api, i give some rewards? like this? (reply to 36672)

Emmanel: Oh, you can't do that on smart contract (reply to 36674)

Emmanel: You can't interact with external API onchain

Emmanel: You can create a map and map his address to what he paid every time he pays, you won't need to loop and it's cheaper that way (reply to 36671)

Cardinal: yeah, but problem is in contract storage, if users too much, gas is higher  if i send claim func any other transactionId, have some method to get his data? (reply to 36677)

Emmanel: How many things are you storing already? (reply to 36678)

Emmanel: The best thing is to keep it in contract. It will take little bytes if you use map

Emmanel: Don't store the txId , just the amount sent

Emmanel: Unless you want to emit the the txId and catch it offline, and save it on offline db, when the user comes to claim, you can query your offchain db and perform the claim action, but that might be risky as you have to manage more security issues

Cardinal: okay thank you ❤️ (reply to 36682)

HovMel: Hi everyone. I'm a beginner TON developer. I've thoroughly studied the theory (languages, how the TON blockchain works), but I have no experience in writing dapps. If it is possible, can I ask a few questions related to creating dapps? Specifically conceptual questions, not technical ones. Please dm me.

— 2024-07-22 —

Howard: Do we have better explain for Slice as remaning yet?  https://docs.tact-lang.org/book/cells#serialization-bytes64

cindy: Hi Guys, I am trying to parse the op code of forward_payload here.  let swapOpCode: Int = msg.forward_payload.loadUint(32);  however, the opcode get from here is not equal to the opcode:3326308581. Am i wrong? how to get the opcode here? query_id: 310 amount: "2240017" sender: 0:779dcc815138d9500e449c5291e7f12738c23d575b5310000f6a253bd607384e forward_payload:   is_right: false   value:     sum_type: StonfiSwapOk     op_code: 3326308581     value: {}

Howard: can take reference with my code: https://github.com/howardpen9/nft-template-in-tact in metadata part (reply to 36667)

c9 👨‍🍳: Gm kindly check DM bro (reply to 36186)

Alexander: Why it said in the official docs that Tact doesn’t support code upgrades?

Daniil: you can try using SETCODE instruction manually but there's a big chance that it won't work properly with Tact smart contract systems  native contract upgrades are going to be implemented in the future (no exact date/version for that yet) (reply to 36698)

Nerses: can different Jetton implementations have different names for Token transfer Message ?

cindy: update: I have to << 1 to get 3326308580. However,it still is unequal to 3326308581. I guess there are some field missing. (reply to 36695)

∆yoseun: Error: Invalid address. Got EQD1DCgzZEvxhL3FYEVN0Af-kPUwC5dK-4kRTW0-RawVRbNo     at BitBuilder.writeAddress (BitBuilder.js:257:15)     at Builder.storeAddress (Builder.js:237:20)     at eval (tact_TonkPumpJetton.ts:765:13)     at Builder.storeWritable (Builder.js:338:13)     at Builder.store (Builder.js:362:14)     at TonkPumpJetton.send (tact_TonkPumpJetton.ts:1438:32)     at Proxy.eval (openContract.js:38:47)     at deployContract (use-jetton-contract.ts:94:11)     at async handleSubmit (page.  I am trying to mint a jetton, it works well in my blueprint test and script but when i try to use it in tonconnect UI react i get this error

∆yoseun: const mintMessage: Mint = {         $$type: "Mint",         amount: 80n,         receiver: Address.parse(" EQD1DCgzZEvxhL3FYEVN0Af-kPUwC5dK-4kRTW0-RawVRbNo"),       };         await (         await tonkPumpJetton(token?.toString() as string)       )         //   @ts-ignore         ?.send(           sender,           {             value: toNano("0.05"),           },           mintMessage         );

Nerses: how can i retrieve data for a specific Jetton wallet  on chain ?

ashes: Should i make my map mutable somehow? Error: contracts/main.tact:18:40: Cannot evaluate expression to a constant: cannot evaluate a variable Line 18, col 40:   17 |     receive(msg: Create){ > 18 |         self.buy_order_map.set(address(msg.order.user_id),msg.order);                                               ^~~   19 |     }

User<6981260071>: is this in ton units ? "total_supply": "1000000000000000000",

Max: Does anyone have any idea how to check if the incoming jettons are USDT? I can’t figure out how to calculate the contract’s jetton wallet address for USDT   I’d appreciate any feedback! (reply to 36657)

Tonion Dev: Hi Nerses    Yes, you can implement the transfer method with your customize name   But the transfer message should have correct identifier    I hope this example be helpful for you 😎  https://github.com/ton-ion/tonion-contracts/blob/0a9a8b3caf97faeed7cbfbff01d2fcfc7efd53d9/contracts/traits/tokens/jetton/JettonWallet.tact#L1C9-L1C19 (reply to 36704)

Nerses: thanks.one more question.In case my code is smth like this,where implemented smart contract token transfer logic send(SendParameters{                 to: myAddress(),                 value: ctx.value,                 bounce: true,                 mode: 0,                 body: TokenTransfer {                                     queryId: 9072345,//e.g.                                     amount: (self.commits.get(msg.data.commitId)!!).amount,                                     destination: (self.commits.get(msg.data.commitId)!!).sender,                                     response_destination: ctx.sender,                                     custom_payload: null,                                     forward_ton_amount: ctx.value,                                     forward_payload: "Token Transfer".asSlice(),                                  }.toCell()             }     How i can know that for this Jetton implemented transfer method is called exactly "TokenTransfer" ? (reply to 36716)

pfeffunit: Hi Tact people! I searched and it’s been asked, so I’ll ask again: people are using Tact in prod? I’m looking at doing some NFTs for a client, seems safe for that?

𝐊𝐀𝐌𝐑𝐎𝐍: send(SendParameters{                 to: myAddress(),                 value: ctx.value,                 bounce: true,                 mode: 0,                 body: TokenTransfer {                                     queryId: 9072345,//e.g.                                     amount: (self.commits.get(msg.data.commitId)!!).amount,                                     destination: (self.commits.get(msg.data.commitId)!!).sender,                                     response_destination: ctx.sender,                                     custom_payload: null,                                     forward_ton_amount: ctx.value,                                     forward_payload: "Token Transfer".asSlice(),                                  }.toCell()             }

∆yoseun: MEHNN, i have been struggling, does anyone know how i can read an emitted event in react using ton-client

.: Hello  I downloaded template  And when I deployed, I had error in link: “Transaction was rejected. Please retry.”  What do I wrong ?

∆yoseun: Transaction can be rejected if you did not accept it in your wallet (reply to 36722)

Nerses: i have written such code for my project.It might be helpful for you.And also for parsing the message you should use functions created during compilation  import { HttpClient, Api } from 'tonapi-sdk-js'; import { Cell } from '@ton/core'; import { Address } from 'ton'; import { hexToBase64 } from '../utils/utils'; import { loadCommitId } from '../wrappers/HashedTimeLockTON';  async function parseEmit(address: string, token: string, index: number) {     const httpClient = new HttpClient({         baseUrl: 'https://testnet.tonapi.io',         baseApiParams: {             headers: {                 Authorization: Bearer ${token},                 'Content-type': 'application/json'             }         }     });      const client = new Api(httpClient);      try {         const tx = await client.blockchain.getBlockchainAccountTransactions(Address.parse(address).toString());         for (let i = 0; i < tx.transactions[index].out_msgs.length; i++) {             if (tx.transactions[index].out_msgs[i].msg_type === 'ext_out_msg' && tx.transactions[index].out_msgs[i].op_code === '0x2eec4b61' ) {                 let rawBody = tx.transactions[index].out_msgs[i].raw_body??"";                 let slc = Cell.fromBase64(hexToBase64(rawBody)).beginParse();                 return loadCommitId(slc)             }         }     } catch (error) {         console.error("Error fetching data from TON API:", error);     } } (reply to 36721)

∆yoseun: Do you have any example for the react library

Nerses: nope (reply to 36725)

∆yoseun: damrnnnn

Alexander: But is there a technical reason? (reply to 36701)

Nerses: How to convert Slice to Address  on chain ?

∆yoseun: This function checks the transactions of an address onchain right? (reply to 36724)

Nerses: not on chain.it checks off chain.it gets all transactions of address,then checks for 'ext_out_msg' with certain emit opcode,after it just remains parsing the data (reply to 36733)

∆yoseun: oh okay

∆yoseun: Does this work for contracts too

∆yoseun: because i am getting an empty array

∆yoseun: It works for testnet?

Sumit: I want to ask how is transaction deduplications handled on ton?

Sumit: We have a bridge

Sumit: and we dont want to allow somebody to process a transaction again and again.

Alexander: You can create a smart contract whose address depends on the data of your transaction. By sending a message to initialize such a smart contract from another one, you can change its state to avoid re-execution. (reply to 36746)

Sumit: I got that but like creating a contract sounds like an overkill? (reply to 36747)

Alexander: Nope, for example in architecture of jettons (fungible tokens on TON), a smart contract is deployed for each user to store a balance, and other data for the particular user. When a user sends a token transfer request to his/her jetton wallet, that contract sends a message to the recipient's jetton wallet that will verify the source (by address calculation) (reply to 36748)

Sumit: Yes. I am aware of this architecture. But is there any other solution? (reply to 36750)

Alexander: I think it depends on your task, but I guess no. In TON, it is common to deploy smart contracts on each user just to keep bool variable. If your messages have an expire time, you maybe can keep a hashmap inside one contract and clean it of expired messages, but be aware that the gas cost of hashmap operations increases with it's size and you can stuck with gas limit (reply to 36751)

KinG: How I open task

Extiint: Yes you can do everything with one contract, but that's done to achieve scalability of storage so it would be very bad to use a different approach. On top of having compatibility problems with the major platforms ofc (reply to 36751)

Extiint: Simply use a map to store users info and your done

Extiint: But it's a terrible idea ahah

Cardinal: can anyone advice me top oracles for TON network?

Sumit: https://katb.in/agohatufeqe Does this look good then? (reply to 36757)

∆yoseun: // Test case: Verify that only the owner can transfer ownership     it('should only allow deployer to call transfer function', async () => {         // Attempt to transfer ownership from non-owner (user1)         const transferResult = await tonkFactory.send(             user1.getSender(),             {                 value: toNano('0.05'), // Send 0.05 TON for the transaction             },             {                 $$type: 'ChangeOwner',                 queryId: 0n,                 newOwner: user1.address,             },         );          // Verify that the ownership transfer transaction failed         expect(transferResult.transactions).toHaveTransaction({             from: user1.address,             to: tonkFactory.address,             success: false,         }); (reply to 36749)

∆yoseun: example

∆yoseun: Can anyone confirm if this is possible     receive("Mint-Only"){        // require(self.mintable, "Can't Mint Anymore");         let ctx: Context = context();       //  self.ammToken = 7840000 * pow(10, 9);         self.devToken = 160000 * pow(10, 9);         self.exchangeToken = 800000 * pow(10, 9);         // self.ynvToken = 8000 * pow(10, 9);         // self.mint(self.ammContract, self.ammToken, self.owner);         self.mint(ctx.sender, self.devToken, self.owner);         self.mint(self.exchangeWallet, self.exchangeToken, self.owner);         // self.mint(self.yyvWallet, self.yciycToken, self.owner);     }

— 2024-07-23 —

Liber: I deployed a Jetton, but I can't see its metadata, contract type, etc. on the blockchain browser

Liber: Is this a problem with the contract or the deployment script?

Liber: https://testnet.tonviewer.com/transaction/2623ff2126b2fd59cc0a4fd08d8b5a19a5e4b41899e3b61f44557ac0e889b70a (reply to 36781)

Liber: The problem with the contract. (reply to 36782)

Nerses: I have encountered an issue that I can't solve.Thanks for help beforehand. Suppose I have a smart contract that receives different jettons. For every jetton, it has a jetton wallet contract. How can I send a transfer message from the smart contract to the jetton wallet contract to send jettons to another receiver?

Kishidle: Greetings! Is it possible to turn this Array code https://docs.tact-lang.org/cookbook/data-structures#array into an import somehow? When I try it with just a standard import it's showing a parse error where it's expecting a '}' on the Array struct

ashes: JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v) (reply to 36795)

fomo: does anyone know how to do square root in ton?  I tried this but it doesn't work

fomo: Another question, I don't know why this happened: "Static function "log2" does not exist"

Kishidle: Just to add, but I can't even build this one as a standalone. Encountering the same Parse error: expected "}" on the Array struct (reply to 36794)

Anton: replace map with arr or something like that everywhere (reply to 36794)

ashes: replace with self.log2 (reply to 36798)

Anton: what Tact version are you using? (reply to 36798)

Anton: why? (reply to 36801)

ashes: I was referring to docs, and i had similar issue - and using self fixed it here's the docs https://tact-by-example.org/04-functions (reply to 36804)

Anton: you cannot add self. for builtin functions, it does not make sense (reply to 36805)

Nerses: let slc: Slice = beginCell().storeInt(num,62).endCell().asSlice()  where num  is 256 bit integer. What will be stored in slc  first 62 bits of num  ?

Kishidle: Thanks, that fixed it. Although another error popped up afterwards, saying "struct value is missing a field: length" (reply to 36800)

Anton: initialize it directly, it’s a known issue that will be fixed within a few days (reply to 36808)

Anton: if you remove the initializer for length in the Array struct (th = 0 part), the typechecker should tell you where to fix futher

Kishidle: Alright, thanks!

ashes: //CREATE receive(msg: CreateOrder){     dump(msg.order.id);     self.orderList(msg.order); } //compiler export const compile: CompilerConfig = {     lang: 'tact',     target: 'contracts/main.tact',     options: {         debug: true,     }, }; //test it('should add order', async () => {     await mainContract.send(         deployer.getSender(),         {             value: toNano('0.05')         },         {             $$type: 'CreateOrder',             order: {                 $$type: 'Order',                 id: 1n,                 is_buy: false,                 user_id: randomAddress(),                 amount: 100n,                 price: 100n,                 base_token: 39n,                 quote_token: 49n             }         }     ) })   Why i dont see any logs after build && test

Anton: https://docs.tact-lang.org/book/debug (reply to 36813)

fomo: tried this, doesnt work (reply to 36801)

fomo: how to check this? I just created a project using blueprint (reply to 36802)

fomo: got it

fomo: I updated the tact

fomo: thank you

fomo: by the way, is there any way we can do natural log or squre root?

fomo: ahha, thanks. I read the doc and see no way to do natural log (reply to 36825)

fomo: and I dont think there is anyway to do square root?  I tried using this code but it won't work for any number larger than 100 (reply to 36797)

Nerses: how can i get 64 bits from 257 bit integer ?

Anton: https://docs.tact-lang.org/book/operators#binary-bitwise-and (reply to 36828)

fomo: after updating the tact using yarn, it is no longer compatible with blueprint test. And some weird error appears:  Type 'SandboxContract<Contract>' is missing the following properties from type 'SandboxContract<MyContract>': send, getOperatorAddress, getKeyWalletAddress, getKeyWalletAddress2, and 33 more. (reply to 36822)

Son Pin: can we check signature in tact?

Son Pin: check_signature

Anton: https://docs.tact-lang.org/ref/core-math#checksignature (reply to 36831)

Son Pin: public key is Int? (reply to 36833)

ashes: emit(MatchEvent{order_history:order_history}.toCell());   Could someone explain how to decode the body of the cell?  typescript e {       type: 'message_sent',       from: EQABEq658dLg1KxPhXZxj0vapZMNYevotqeINH786lpwwSnT,       to: EQDW7wbsPTfQcqoRM1lp-DGuIi-e7fPEo0zvPTqo9VdBuF48,       value: 500000000n,       body: x{FEEB96840000000280002255D73E3A5C1A9589F0AECE31E97B54B261AC3D7D16D4F1068FDF9D4B4E182000000C8000000C90000001880000013C_},       bounced: false     }

Денис: Greetings to all. Please tell me, is it possible to send a message to the contract in one transaction, when receiving this message, the contract will deposit the children contract, and in the same transaction immediately send a message to the children contract to set the desired state? Init children is not an option to pass state

Nerses: having only jetton master address can i get init code and init data of that jetton off chain ?

fomo: Anyone has similar experience? (reply to 36830)

Stephan: Hello guys. how to send tokens from a smart contract on a clock in addition to wallets?

Alexander: Hi guys, does anyone happen to know is there any way to automatically convert cells to structs on client side typescript code? Similar to fromCell in Tact but in typescript, to convert Cell type to auto-generated ts types for structs?

Alexander: I can see auto-generated types (corresponding to Tact structs), but I can’t see how to convert Cell to such types, can you please suggest? (reply to 36848)

pfeffunit: Anyone know of any other (english 🙏) TON dev groups? TG or Discord?

Alexander: Great, thanks! 👍 (reply to 36850)

Stephan: Bro please, can you help me? 🙏 (reply to 36848)

pfeffunit: Thanks!

Stephan: Look, this is what I'm up against  Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please (reply to 36857)

Stephan: Exit code 62972 (reply to 36860)

Stephan: ok, thank you, I will try (reply to 36863)

Stephan: I checked it, it is error "Invalid balance". is it about not enought tokens? (reply to 36863)

∆yoseun: Hello devs, is it possible to put multiple message in one send

Muhammad Azan: Ji

∆yoseun: const message: DeployContract = {         $$type: "DeployContract",         maxSupply: toNano("8000000000"),         content,       };       //   @ts-ignore       await jettonContract?.send(         sender,         {           value: toNano("0.08"),         },         message       );

∆yoseun: Is it possible to define 3 message and put them in this one send?

— 2024-07-24 —

fomo: Type 'SandboxContract<Contract>' is missing the following properties from type 'SandboxContract<Counter>': send, getCounter, getId  this happened after I run "yarn add @tact-lang/compiler"

fomo: this is just the default example

Lucky: Is that a way to send jetton out from the contract? Like withdraw the jetton?

Anton: Tact’s CI has a Windows build with Blueprint, so I’m not sure about “the” issue (reply to 36899)

Lego: have you solve it, may i know the solution? (reply to 36788)

Bill: I heard there's a new contract protocol for issuing jettons, making transfers cheaper in terms of gas. Does anyone know about this? Are there any source codes or ready-made examples available?

Nikita: Hi all, does anyone know if there is any information about how much more suboptimal it is to use Tact? Or is there not much difference with FunC?

Anton: What is your definition of “suboptimal”? (reply to 36903)

Nikita: I talk about gas price (reply to 36905)

Anton: Tact is a higher-level language, so it’s easier to learn and build MVPs

Anton: It depends on what you are trying to achieve (reply to 36906)

Anton: What about correctness? (reply to 36906)

Anton: Are you sure your, let’s say, DeFi protocol is correct and your system won’t be drained of money if you have to deal with all the low level details FunC imposes on you?

Anton: I say you first should build robust solutions and only then measure and fix gas issues where they needed to be fixed and not indulge in premature optimizations

Nikita: You are right, I got your idea. Yes, I'm going to build staking contract and I have low experience in TON dev. I am experienced with Solidity and EVM btw, but in TON there significant differences from them.  Even if Tact forces to spend more money on gas, I am better start with Tact just to achieve my contract working well and later I can dive into gas optimizations with generated FunC contracts, i believe. Thanks for this idea, for some reason I didnt think about it. (reply to 36911)

Anton: Yeah, you can try to manually optimize the generated FunC code, however there are a couple more options: - Tact supports FFI with FunC code, so you can write some gas-critical parts of your project in FunC and link that code from Tact; - also, you can get in touch with us (the Tact team) and we might as well support your use case in the compiler if it will benefit the whole community in the long run (reply to 36912)

Nikita: Awesome, thanks! (reply to 36913)

Haris: Hey guys is there any open source contract which implements the bonding curve mechanism?

tony: Hello everyone! We are a team dedicated to building the TON ecosystem. We have developed several AI bots to assist with development. Currently, we have three bots: a bot to help with the issuance of Jetton tokens, a bot to assist in writing Tact, and a TON documentation assistant bot. We welcome everyone to give them a try!

Haris: please help? (reply to 36916)

Anton: we have some example documented here: https://github.com/tact-lang/awesome-tact  but I cannot recall if there was the one you are asking for specifically (reply to 36920)

Son Pin: any example about verify signature in tact @AntonTrunov

Anton: did you check the Tact reference? (reply to 36922)

Son Pin: yes. it’s not clear

Haris: I could not find it (reply to 36921)

Anton: So is your question (reply to 36924)

Anton: What is not clear exactly?

Son Pin: An example about data of signatures , message, pubkey. To verify signature

Anton: https://docs.tact-lang.org/ref/core-math#checksignature has a couple examples (reply to 36928)

Haris: please help? (reply to 36925)

Anton: Tact is a young language it probably does not exist until you implement it (reply to 36930)

Haris: ok

Лев: Hello everyone, I code get fun function and want to return string type of data, but when I checked there on this website: https://testnet.tonviewer.com/, it is reply cell's code. How do I get a response in the form of a string

Guy: Hi, I have a design question regarding sharding.  Does it make sense to have a parent contract that deploys all child contracts and maintains a map of their addresses. In such a scheme, all requests are received by the parent contract and routed to the respective child contract. The parent remains relatively 'thin' but still holds a map. Or, should the parent deploy the child contract, and then have the users interact directly with the child contract? In this scheme the parent contract acts pretty much as a deployer and is very thin in the sense that no map is required. What are some pros and cons of each from your experience? Thanks in advance

Kishidle: Greetings again. Is there a way to send "Arrays" (or maps) as a Message? I'm not sure how to properly structure it

Alfred: Use a Map (reply to 36936)

Alfred: To create an array, define a map with an Int type as the key. This key will represent the index in the array. Additionally, include a variable to keep track of the number of items in the array.

Kishidle: I'm using a map right now (in the contract) but I'm not sure how to structure it for, say, sending a message coming from a webapp

Kishidle: Like I wish to send something like [0, 1, 2] into the contract and get the contract to save it

Alfred: Use Dictionary and bigint

Alfred: message Array {     data: map<Int, Int>;     length: Int; }

Alfred: data: Dictionary<bigint, bigint>;     length: bigint;

Alfred: It should work

Haris: i am receiving following while executing get method from blueprint  unable to execute get method. got exit_code -13

Haris: please help

Alfred: The contract is not deployed yet

Alfred: Please check the contract address is right first

Haris: ok thanks

Alfred: You'd like to build a lending platform? (reply to 36916)

Alfred: or a dex?

Alfred: stonfi is using a similar fomula x*y=k just like uniswap v2 did, you can refer to their code

Haris: thanks Alfred i will check

Anton: Have you checked what this exit code means? (reply to 36946)

Haris: it says out of gas (reply to 36956)

Anton: bingo!

Anton: I’d try sending more tons

Son Pin: can we send a rawdata message? @AntonTrunov

Sumit: I am trying to compile a contract and i get this error: https://katb.in/ijulonuyoqi

Anton: what Tact version are you using? (reply to 36966)

Sumit: i tried "@tact-lang/compiler": "1.4.0-dev.20240724", and 1.4.0 (reply to 36968)

Anton: Can you provide your code please? If possible a minimized version of it that still produces the same error (reply to 36969)

Sumit: https://katb.in/enawamanecu (reply to 36970)

Sumit: https://github.com/tact-lang/tact/issues/515 (reply to 36970)

Sumit: i found this

Pppppppp: Is there a boss who needs skills in developing source code He knows php,java,vue,uni,go He mainly fixes bugs and develops source code

Anton: this is already resolved in "@tact-lang/compiler": "1.4.0-dev.20240724" (reply to 36972)

Sumit: i am still getting this for some reason (reply to 36976)

Anton: you tact version is not "@tact-lang/compiler": "1.4.0-dev.20240724" then, I just tried it locally (reply to 36977)

Anton: check our wiki to see how to set it up: https://github.com/tact-lang/tact/wiki/Using-unreleased-versions-of-tools-early#dev-versions-of-tact-with-blueprint

Sumit: ah, this i was not doing. (reply to 36979)

TG: Hey Everyone :)

— 2024-07-25 —

cindy: How many jetton transfers can be included in a single transaction at most?

Phan: how can I calculate the op for this message?  message Mint {     amount: Int;     receiver: Address; }

Max: Did anyone ever have this issue sending a transaction from a client to the smart contract? Any ideas what could be the reason?  “LITE_SERVER_UNKNOWN: cannot apply external message … before smart-contract execution"

Anton: you might want to try asking your question in @tondev_eng as it’s not really Tact specific (reply to 37015)

Jake: where may I read more about this BASE_URL pls? How can I config my own collection and nft items’ metadata

Jake: above is example from https://github.com/Ton-Dynasty/tondynasty-contracts

Son Pin: @AntonTrunov do you know how can convert message to cell in sdk??

Alexander: In what kind of sdk, what language are you using etc, you need to provide more context to get help (reply to 37023)

Son Pin: async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | MultisigInit) {                  let body: Cell | null = null;         if (message === null) {             body = new Cell();         }         if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'MultisigInit') {             body = beginCell().store(storeMultisigInit(message)).endCell();         }         if (body === null) { throw new Error('Invalid message type'); }                  await provider.internal(via, { ...args, body: body });              }  let deployer: SandboxContract<TreasuryContract>;  Im using sandbox contract of "@ton/sandbox"; But I want to create a raw message and send raw message instead of a structured message

Lin: Hi Jay, I want to ask if I want to customizable NFT metadata, like adding a "rarity" data into every NFT,  how can I add this data to the individual content? Just using append("string") function without any title like"rarity" ,  the code can correctly analyze its content? I don't understand how it works, please help me thx! (reply to 18371)

Truong: Hello, can TON sponsor gas for transactions? Can another user pay the gas fee for me, or can I send a message with value=0 to a smart contract, and it sponsors the gas?

c9 👨‍🍳: gm i want to convert address in Tact to Int , is there anyway to do that ? thank for helping

Anton: Ints are 257 bit long and won’t fit addresses, which are 267 bits (reply to 37028)

c9 👨‍🍳: thank for enlighten me sir im working with checkSignature(hash: Int, signature: Slice, public_key: Int) function for dynamic multisig what is the best way for hash to sign, im planing to use myAddress() can you give me some example for this case study (reply to 37030)

c9 👨‍🍳: that mean hash should be unpredicted and built in contract

Daniil: address has two parts: workchain and hash. the hash part is 256 bits (reply to 37030)

Daniil: do you want to check the signature of some data? in this case the hash should be derived from data itself, not just some random value (reply to 37031)

c9 👨‍🍳: yeah so i think contract address is kind of that data type we cant reuse in the future so its safe for multisig (reply to 37034)

c9 👨‍🍳: hash is unique for each address right ? sir (reply to 37033)

c9 👨‍🍳: and how we can get hash part from address ?

c9 👨‍🍳: seems like we can create new address from workchain and hash  let oldTonFoundationAddr: Address =     newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);  but dont have way to get

Daniil: you can use parse_std_addr FunC function (reply to 37038)

Degen: How to clear the Telegram miniapps wallet connect cache

c9 👨‍🍳: Cool but what about tact (reply to 37039)

Anton: as a workaround you can interact with FunC code from Tact, we will add it probably in the next Tact release (reply to 37041)

c9 👨‍🍳: Cool can u give me more example sir

c9 👨‍🍳: Btw what about using unix time for hash in signature

Anton: should be something like this  struct Addr {     workchain: Int;     address: Int; }  @name(parse_std_addr) native parseStdAddr(s: Slice): Addr; (reply to 37043)

Shahzaib: hey, i wanna save historic data for chats. can you please help me how to setup/find indexer/collector?

Shahzaib: please help (reply to 37049)

c9 👨‍🍳: one more question sir  im using checkSignature(hash: Int, signature: Slice, public_key: Int)  The addresses of signers are stored as Address  but public_key is Int type so is it the same hash part from parseStdAddr native function ? (reply to 37045)

Nerses: can this code be used to mint Jetton ? import { toNano, Cell } from '@ton/core'; import { SampleJetton } from '../wrappers/SampleJetton'; import { NetworkProvider } from '@ton/blueprint'; import { Address } from "@ton/ton";  export async function run(provider: NetworkProvider) {     const owner = Address.parse("0QBdIYx_26bIOerW5uWXaQOahyxZE9GxjySpOiXoIPUaGrPB"); // Replace with actual owner address     const content = new Cell(); // Initialize content as required     const maxSupply = 1000000000000000n; // Set the maximum supply      const sampleJetton = provider.open(await SampleJetton.fromInit(owner, content, maxSupply));      await sampleJetton.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Mint',             amount: 1000000000n,             receiver: Address.parse("EQBuuKDHq4KmWlIR3WeY0N590o-sbJBWje0e77DL5uFvJ9st")         }     );      await provider.waitForDeploy(sampleJetton.address);  }

Nerses: is there any example of script how to send Jetton from jetton owner to arbitrary address ?

ashes: Does it consider good practice to use self.reply("Refund gas excess".asComment()); inside each receive func - to return the excess to user?

Alfred: Looks good (reply to 37052)

hΔrdshell: is there a specific way you have to format the "content" on a jetton cell so the image - symbol - name - descriptin etc. appears proper in the wallet?

Nerses: I use this code to send token transfer message,how should I init.code and init.data for deploying the jetton wallet same time ?  const tokenTransferMessage: TokenTransfer = {   $$type: 'TokenTransfer',   queryId,   amount,   destination,   response_destination,   custom_payload,   forward_ton_amount,   forward_payload, };    await contractProvider.send(walletSender, { value: toNano("0.5"), bounce: true }, tokenTransferMessage);

Tom - Bushi: anyone know how to unpin a wallet from blueprint?

Tom - Bushi: or just change the one used? seems to default to one I dont want to use anymore

Tom - Bushi: nvm found the file

Alexandr: hi, i am using nativeReserve in my contract, sandbox tests passed successfully, but tx failed on testnet with exit code: 0 and result code: 34. does anybody knows whats the problem?

Tonion Dev: Hi Nerses when you try to send the token to someone else, the Jetton master contract computes the init.data and init.code and sends a Tx, if the receiver wallet has an instance of that Jetton wallet, it will receive the tokens and his balance will increment, otherwise, a new Jetton wallet will deploy for receiver and then the transferred token amount will be added to the receiver Jetton Wallet  you can find a sample of a function that calculates the init in Tonion   abstraction: https://github.com/ton-ion/tonion-contracts/blob/57e84a223798db5a43ffe57250baa0928a288ff2/contracts/traits/tokens/jetton/JettonMaster.tact#L36  implementation: https://github.com/ton-ion/tonion-contracts/blob/57e84a223798db5a43ffe57250baa0928a288ff2/contracts/mocks/tokens/jetton/JettonImp.tact#L18C1-L20C6  and the test case for transfer Jetton: https://github.com/ton-ion/tonion-contracts/blob/57e84a223798db5a43ffe57250baa0928a288ff2/tests/tokens/jetton/Jetton.behavior.ts#L115C5-L179C8 (reply to 37060)

Tonion Dev: Hi  maybe this function will be helpful for you this function creates on-chain metadata and returns Cell type  maybe reversing this function logic from Tonion can help you :   https://github.com/ton-ion/tonion-contracts/blob/57e84a223798db5a43ffe57250baa0928a288ff2/tests/tokens/jetton/jettonHelper.ts#L18ma (reply to 37059)

— 2024-07-26 —

Tonion Dev: Hi Phan😎  you can find how OP calculates in this link:  https://github.com/ton-blockchain/TIPs/issues/74#issue-1166704612  calcualte the CRC32 of the message TL-B schema and then & bitwise with 0x7fffffff (reply to 37011)

c9 👨‍🍳: GM,  i want to get pubkey from Address for this func: checkSignature(hash: Int, signature: Slice, public_key: Int) so this one parse_std_addr can get pub_key from address right ?

Nwobueze: Yes (reply to 37096)

c9 👨‍🍳: address has two parts: workchain and hash. the hash part is 256 bits  so hash stands for pubkey ? is that right ?

Nwobueze: Ko

c9 👨‍🍳: what do u mean (reply to 37100)

Nwobueze: Nothing (reply to 37101)

c9 👨‍🍳: you just said yes above ?

Nwobueze: Yeah (reply to 37103)

c9 👨‍🍳: do you really understand this question Nwobueze ? (reply to 37096)

Nwobueze: Yes, I do (reply to 37105)

Howard: gm, 🔥 (reply to 37109)

Howard: sir, can share on gist or something. THis is hard to read. (reply to 37111)

Howard: this part is same as OpenSea, or you can use these explores to check your NFT:  - https://explorer.tonnft.tools - https://testnet.explorer.tonnft.tools  😇💼🏝❤️❤️❤️❤️ (reply to 37020)

.: Hi how do I send a transaction with multiple recipients?

c9 👨‍🍳: gm gm  i have pubkey in Slice type i want to convert it to Int type, so how many bits i should pass to Slice.loadInt function ?

hΔrdshell: this only shows the name, image and desc but no symbol? (reply to 37093)

Max: Is there a reason why no one tried to build metadata in a smart contract? For instance, you might need that if a contract creates jettons dynamically.  All examples I’ve seen build metadata on the client side (reply to 37093)

hΔrdshell: oh wait on the contract side thats easy theres many examples (reply to 37119)

hΔrdshell: im doing the client side metadata which is then added when a user creates a token just like the ton official minter

Max: I haven’t seen any, I may have missed something   I wasn’t able to convert makeSnakeCell and other functions to Tact (reply to 37122)

hΔrdshell: ah im not sure so like have the same name etc. everytime baked into the contract

hΔrdshell: this just doesnt seem to work at all for the image, just the other metadata (reply to 37093)

Haris: Hi guys!  I want to make a contract in which people can buy tokens/NFT from tons if 1 user send me a transaction how do i segregate the transactions fees and to get the amount of that token/NFT??

Haris: please help (reply to 37127)

Alfred: add the value for payment as a parameter then the rest is the gas

Haris: ok if i add the value in the message than how the contract will receive that tons?

Nerses: thanks a lot.for detailed and very good explanation (reply to 37092)

Gala: Hello everyone, can the Ton contract implement batch transfers of main chain coins and Jetton coins? Are there any examples?

hΔrdshell: ? read the docs (reply to 37138)

hΔrdshell: Contract?.send(   sender,   {     value: 6n * E9,   },   message );

Haris: Thanks alot (reply to 37140)

hΔrdshell: for anyone reading this in the future, the image has to be scaled i just found out (reply to 37126)

Nerses: is there any exaple of TokenNotification message that is passed as an argument for forward_payload field TokenTransfer.I get overflow trying to write it

Nerses: how can i rearrange this code to escape overflow ?   let slc: Slice = beginCell().storeStringTail("You recived tokens succefully").endCell().asSlice();   const forward_payload = beginCell()                           .storeUint(0x7362d09c, 32) // Function selector for the message type                           .storeUint(Number(queryId), 64) // queryId                           .storeCoins(amount) // amount                           .storeAddress(wallet.address) // from address                           .storeSlice(slc) // forward_payload; can be modified with additional data if necessary                           .endCell();

Александр: you can use smth like this  let commentCell = beginCell().storeStringTail("You recived tokens succefully").endCell();   const forward_payload = beginCell()                           .storeUint(0x7362d09c, 32) // Function selector for the message type                           .storeUint(Number(queryId), 64) // queryId                           .storeCoins(amount) // amount                           .storeAddress(wallet.address) // from address                           .storeMaybeRef(commentCell) // forward_payload; can be modified with additional data if necessary                           .endCell();   store comment as ref, not cell (reply to 37146)

Nerses: again got BitBuilder overflow (reply to 37148)

Leven: Hi, I have a question about Tact Jetton example,  if the totalSupply already modify successful, but the next asynchronous msg(TokenTransferInternal) execute failed, and bounce is false, the available totalSupply not revert? Is it right?

Nerses: is it possible to call get_jetton_data calling the getter of JettonMaster ?

Nerses: as after succesfull calling it I get that some fields are private,so i have no access to them

Anton: 🎉 Tact 1.4.1 has just landed on NPM!  🐞 We fixed a gazillion bugs reported by the TON builders and TOL hackaton participants  ❤️‍🔥 Thanks so much for your helpful feedback! It means so much to have such a vibrant community of Tacticians  🍳 Now that bug squashing is out of the way, we are on to adding more exciting features (and inevitably introducing some more bugs along the way). Tact 1.5.0 ingredients are out of the fridge and into the pan.   — The Tact team  🍲 don’t let it bit rot ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Alexander: How to update Tact to the latest version? I can’t see any tact package in package.json

User<6770884080>: can you help me? (reply to 36616)

Anton: https://t.me/tactlang/35521 (reply to 37161)

— 2024-07-27 —

Ad: help, how to generate a new v5 wallet? using nodejs or payton

Lego: Hi everyone! I'm looking for recommendations for an audit firm for the TACT smart contract. Any suggestions?

Anton: Hey, you might want to contact some of these firms: https://github.com/ton-society/ecosystem-map?tab=readme-ov-file#security-solutions  And this one too https://tonbit.xyz/ (reply to 37173)

Lego: thank you (reply to 37174)

User<6573316513>: Has anyone worked with nft? Who has the opportunity to talk in DM, there are a few questions

Rahul: share link (reply to 36918)

Son Pin: Can we parse code and data from raw (cell, boc) ?

hΔrdshell: anyone know how to programatically get the jetton wallet address if you hold a jetton

Ahmad: 👍

Hunter: How are the notcoin and scale addresses ending with their names?   Not coin - E .   . - not  Scale - E . . . _scale

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please

— 2024-07-28 —

.: Hi How to do message with more outputs ?

Howard: https://github.com/ton-community/vanity-contract  Can "mine" the smart contract address (reply to 37186)

Mújæmmîl: Hello

Mújæmmîl: How are you sir

hΔrdshell: how do i convert EQ address into KQ?

hΔrdshell: this is really really annoying

Max: Why would you need to do that? (reply to 37204)

hΔrdshell: cause i need to find a jetton default wallet address (which differs per user)\

hΔrdshell: and the getGetWalletAddress returns in a retarded format

Rahul: looking for a tact dev for a paid gig, dm if interested

Alexander: Use any of the SDKs that are available for multiple languages https://docs.ton.org/develop/dapps/apis/sdk, OR do it manually https://docs.ton.org/learn/overviews/addresses#user-friendly-address OR just to do it once by hand https://ton.org/address/ (reply to 37204)

Alexander: You don’t need to convert addresses for this, on the inside not depending on this “prefix” both of them are representing the same address. Read some of the docs that I’ve sent about to have a better understanding (reply to 37208)

Alexander: You could share the link to the transaction, and that will definitely help someone to help you :) (reply to 37190)

hΔrdshell: if i put the EQ address in a function it doesnt work (reply to 37211)

hΔrdshell: where as a plain string kQ works

Alexander: That's weird. In which environment are you trying to call this function? I mean language, SDK etc (reply to 37213)

hΔrdshell: typescript with @ton/core

Alexander: Could you send a code snippet? Just this piece with the address (reply to 37216)

hΔrdshell: tonconnect ui react

hΔrdshell: sure

Alexander: Usually there’s some sort of Address.parse(…) that accepts any type of address and converts it to an Address type

hΔrdshell: its already an address type and i tried that already also to convert to different version but doesnt seem to work or call it at all

hΔrdshell: function convertEQtoKQ(eqAddress: string): string {     const address = Address.parse(eqAddress);     const kQAddress = address.toString({ urlSafe: true, bounceable: false });     return kQAddress;   }

Haq: Guys do any one know what i should type in the bot or in which way too get USDT on testnet?   BOT: https://t.me/testnet_usdt_giver_bot  I try:  - /get{5} - /get 5

User<6573316513>: I’m struggling with an error in the deploy file (content is underlined)  There may be a problem with the ton-core import version  Can someone tell me which version is better to install? Or maybe the problem is something else?  *I’m making a nft contract on the guid https://youtu.be/ePknjQwJg3Q? si=Lp6zqa-ELsHuJJXV

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please  This is a transaction https://testnet.tonviewer.com/transaction/dcfcfce74543141193d6f0ac8dcdadf05e9c50adfb38c83d9fb992f9d9d2dcd3

Sumit: is there an implementation for proxyTON in tact?

Герман: I think so (reply to 37237)

Sumit: Can you share the link? (reply to 37238)

Герман: https://testnet.tonviewer.com/transaction/dcfcfce74543141193d6f0ac8dcdadf05e9c50adfb38c83d9fb992f9d9d2dcd3

Tonion Dev: Hi  Maybe Tonion tests be helpful for you    https://github.com/ton-ion/tonion-contracts/blob/57e84a223798db5a43ffe57250baa0928a288ff2/tests/access/AccessControl.behavior.ts#L18  Alice, Bob and Sarah are the accounts used in the Access control contract in Tonion 😎 (reply to 37224)

Tonion Dev: Ask your question here or in Tonion group (can find it in Tonion channel)  I hope can help you (reply to 37247)

— 2024-07-29 —

Winder: Will the throw revert the send message? I tested in local test file, seems that throw will revert the message. Thanks

Winder: But I found this in others' contract, wired

Nerses: Who can explain differences of fields custom_payload  and forward_payload in Jetton Transfer message ?

Hunter: It works 👍 (reply to 37199)

ashes: I'm trying to transfer tokens using the Jetton standard, similar to how transferFrom is used in ERC-20 standard. Here's the Solidity code: token.transferFrom(msg.sender, address(this), _amount); How can I replicate this token transfer functionality with Jettons?

Kishidle: Anyone know what's the best way to interact with a contract in the backend? Preferably using the wrapper TS classes that blueprint generates on build. I've been looking at ton-sdk but I'm not sure where to start

Nikita: Good day everyone. Perhaps someone knows is there Jetton/NFT ready-to-use implementations on Tact? I see such sections in documentation, but both of them are blank

Reed: I'm getting an error after upgrading to @tact-lang/compiler v1.4.1 I use the NFT template of "https://github.com/Ton-Dynasty/tondynasty-contracts", after build and deployed with @tact-lang/compiler v1.3.0 everything is fine, tonscan and getgems still recognize "Contract Type: NFT Collection", however after updating @tact-lang/compiler to v1.4.1, tonscan/tonviewer can't recognize "Contract Type" (Unknown), and getgems can't read NFT Collection anymore even though the contract is still the same. Does anyone know about this case, please help.

Kishidle: Also side questions, but is there a way to upgrade contracts on Tact (like adding new methods, state variables) ?

Max: Hey guys! Real challenge here. Is there a way to rewrite the code below to Tact? Particularly a dictionary creation and converting to a Cell    cell build_content_cell() {     cell content_dict = new_dict();       content_dict~udict_set_ref(256, "uri"H, begin_cell().store_uint(0, 8).store_slice(“customtoken.ton").end_cell());       cell content = begin_cell().store_uint(0, 8).store_dict(content_dict).end_cell();          return content; }

Nikita: btw I found such, why not to add it into the documentation?  https://github.com/howardpen9/nft-template-in-tact https://github.com/howardpen9/jetton-implementation-in-tact (reply to 37275)

Max: Thank you! (reply to 37283)

— 2024-07-30 —

Howard: looks like forward payload message is wrong (reply to 37236)

Samnang: Hello, I need some help. i call an external message, and the tx seems to trigger more than 1 time with unknown status and charge the fee as well. what's could go wrong with this?  a simple incremental function: external(msg: Add) {         acceptMessage();          dump("external");         dump(msg.address);         dump(msg.amount);          if (self.loyaltyPoints.get(msg.address) != null) {             let points = self.loyaltyPoints.get(msg.address)!!;             points += msg.amount;             self.loyaltyPoints.set(msg.address, points);             emit(AddEvent{address: msg.address, totalPoint: points}.toCell());         } else {             self.loyaltyPoints.set(msg.address, msg.amount);             emit(AddEvent{address: msg.address, totalPoint: msg.amount}.toCell());         }     }  https://testnet.tonviewer.com/kQDhEwnGg-E695-m35Q7o7b1cBMaBzfPGG8DsATsVwYL3XZ5

User<6327676316>: Please help me

Anton: how is this relevant to Tact? (reply to 37316)

ashes: Hi, could someone explain - why JettonDefaultWallet doesnt implement the deployable trait? My goal is to deploy JettonDefaultWallet contract with some additional messages that are sent to the other contract when it receives token. https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/jetton.tact

Alfred: Cause it's deployed on the fly when the wallet received the jetton

c9 👨‍🍳: just thought forward_payload can be empty :-? (reply to 37307)

Alfred: Seems to be Invalid balance issue. Can you check if you have enough jetton to transfer? (reply to 37236)

Alfred: Usually, you need to mint some jetton to address A and then transfer from A's wallet to B.

Nerses: Hello everyone,  I'm excited to share a project I've been working on! We've developed a new protocol called PreHTLC, an evolution of the traditional HTLC (Hash Time-Locked Contract) designed for crypto asset transfers. This protocol aims to facilitate truly permissionless and trustless cross-chain asset transactions.  We're providing a user-friendly UI along with the necessary links and access to our GitHub repository for those interested in diving into the code or providing feedback.  Looking forward to your thoughts and feedback!  UI: https://layerswap.io/v8  GitHub: https://github.com/layerswap/layerswap-atomic-bridge

Illia: https://docs.ton.org/develop/smart-contracts/guidelines/accept  Have a look at this. It explains side-effects of external messages (reply to 37312)

ashes: If the master jetton already been minted, is there a way to create a new instance of jettonWallet with some modifications (send additional message on receive)? As I see from the tact example - there's no way to do that, right? (reply to 37320)

Illia: theoretically, you could have done that; you could provide a setter that changes the code of the wallet that is going to be deployed if there's no wallet yet; but it's very much low-level thing that's, as of now, will be likely possible only though quite complex FunC engineering; therefore, practically, that's not the case in Tact yet;  what's your use case? you could change the architecture (reply to 37328)

ashes: I’m implementing the staking contract, and need to communicate with my staking contract via messages when user sends token to our hot wallet Jetton contract. Basically, user sends jettton to my wallet - my wallet sends the message to staking contract (reply to 37333)

Illia: That's embedded in the standard by default. You just need to set the payload and response_destination field accordingly to the TEP-74 standard (reply to 37334)

Nikita: Hi!  I'd like to know what can I use for hashing in Tact? All I found is workaround with Cell.hash, so first I need to build a cell with data I want to hash, but it seems strange for me, is it OK?

Illia: There are multiple ways to do that. You can do cell hash, slice hash and sha255 on slices in Tact. Check out https://docs.tact-lang.org/ref/core-math#sha256 (reply to 37336)

Alfred: If you have left the message to handle these use case, it should be doable. (reply to 37328)

Alfred: You should be able to receive  the transfer_notification(notify the receiver's owner) or the excess message(notify the sender). (reply to 37334)

ashes: I’ve checked, but it’s still needs the modification of the Jetton contract, isn’t it? I cannot do any changes to it cause it’s been deployed (reply to 37335)

Austin: hi fam I'm working on an nft contract but I'm totally lost

Austin: can someone help me with a guide on writing nft contracts pls

Austin: Could not find any resource on the Tact Documentation

Illia: I'm referring to the original FunC implementation. There's no 'official' Tact Jetton implementation AFAIK. Are you creating your own implementation? (reply to 37342)

Illia: As far as I know, there's no such thing for tact. You can check ton docs for how nfts work  https://docs.ton.org/develop/dapps/tutorials/collection-minting and then implement the NFT contract compatible with TEP-62 (reply to 37345)

ashes: I cannot create my own, i have to work with the already deployed one - as I understand in this case I have to handle it outside of the blockchain, as you told me above (reply to 37348)

ashes: Check this out  https://github.com/howardpen9/nft-template-in-tact (reply to 37346)

Illia: If you have a Jetton that is already deployed and it's compatible with the TEP-74 standard, then you simply need to create a Transfer message (a cell that holds the data as described in the Transfer TLB scheme) as described in TEP-74 (reply to 37350)

Nikita: Hi! I want to create a contract that receives some jetton and burn it, and increasing caller address score. But I don't know how to achieve it... Is there any way to handle jetton transfer in contract? Even more, all this transfers handled by separate jetton wallet contracts, which, I ques, will be deployed for my contract after receiving jettons. So, perhaps someone knows or has any ideas? I would be really glad for any help

Nerses: Is it possible to get blockhash of specific node on chain (TACT) ?

MEW: hello

MEW: what does the __system do?

MEW: such a long cell

MEW: and i see this in the output .fc file, why we need this?

Tom - Bushi: Two nft questions: 1. I want the metadata to be stored on IPFS. Does that mean that the item's individual_content should store this IPFS link or is it found on the collection? 2. How can I get all the items owned by an address?

Illia: Default standard expects metadata url to be:  collection_content + individual_content   For example, example.com/NFT/ + 0.jsob (reply to 37363)

Illia: https://toncenter.com/api/v3/#/default/get_nft_items_api_v3_nft_items_get (reply to 37363)

Tom - Bushi: thanks for answering.  So for 1. I think I get it now. But is the individual metadata fetched from the collection contract or from the individual items?  And for 2. I understand it is usually just from indexed data? (reply to 37364)

Syntax: Is there anyone looking for dev?

— 2024-07-31 —

Howard: please check with the code here, you need confirmed based on the seqno parameters you set. Otherwise the contract will stuck in there: (reply to 37312)

Di K ⬡: Hi fren.

avi: Hello... tonkeeper has created W5 gasless USDT transactions. Using ton-connect I need an api to check that the connected wallet supports W5 or not. Is it possible today? And if so, how?

Illia: 1) individual items and collection content from collection  2) yes, that's the easiest way to do that, usually, it's updated almost immediately (reply to 37368)

Gennady: hi  tell me if I can call the "get" method of another contract from one contract?

Anton: https://docs.tact-lang.org/book/contracts#getter-functions (reply to 37388)

Williams: Hello please how  can I read the emit in a contract using ton client

Williams: Thank but this the code examples here is for blueprint testing (reply to 37393)

Williams: And the out_msg specified there does not exist in client

Williams: I tried that and it kept failing

Williams: Do you have any code examples ple

Stephan: hello guys, please help, where can i find nft tact standard?

Max: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md (reply to 37401)

User<6573316513>: Hi, Guys! 👋   Does anyone know how to remove the selected nft from the collection?  How to make sure that after the deposition, nft is not created in the wallet of the contract creator, but is created in the collection with the status «for sale» and with the price assigned to it?  It’s also very interesting 🤔 is there anyone here who connected their nft contracts to their own interface?                                                                                            https://testnet.tonviewer.com/kQAinnLMuHKeRRJRwQS_Uun78w6smJe4bf5m6wdZwUQ444Km?section=overview

Dmitry: Hi guys! Is there something like Remix Web IDE for TON? https://remix.ethereum.org

Dmitry: Thx!

Nerses: i try to send Jetton transfer message and for its field forward_payload  I create this message   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());       let b = new Builder();     const forward_payload = b.storeUint(1734998782, 32).storeBuilder(b_0).asCell();   but i get error too much references.Any hints or pointers how i can solve it ?

Nerses: i dont get what you mean, isnt this the part you mentioned ?   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell()); (reply to 37413)

Nerses: I took that code from compile files (wrappers).So how it could have such problem ? (reply to 37413)

Degen: What library should I use to get all the NFTs in a specified wallet?

Degen: Can tonweb be obtained?

Денис: Hi everybody. Please tell me how to implement such mapping in Tact mapping(uint256 => uint256[]) referrals;

— 2024-08-01 —

ゆめレイン🦴: I input blueprint run in terminal，choose testnet, tonkeeper,an then copy the link, open my tonkeeper desktop wallet, connect to github, then nothing happened...how can I fix this?

tony: Hello, we are the PuzzleMind team. Currently, we are using AI technology to expand the capabilities of Telegram bots with the goal of building an AI bot store based on the TON ecosystem. We are in the product prototype phase. The current prototype of the AI bot store can be found at: https://t.me/puzzlemind_bot/puzzlemind Currently, the store offers three bots designed for TON developers: Jetton BOT, a one-click coin/NFT issuance assistant: https://t.me/puzzlemind_official_chat_bot?start=bSwAvxLUa6XZpz6PLBEKHG TonDoc Bot, a documentation assistant for TON: https://t.me/puzzlemind_official_chat_bot?start=HBdbcXnDJoR3eNiho7K6gK Tact Bot, Tact language assistant: https://t.me/TactLanguageAssistantBot

Nerses: from which TACT version is added assignment operator for structs ?  let struct: Struct = struct1;

ashes: I've looked through the code, correct me if im wrong. In tokenTransferInternal if response_destination is not null than the Jetton Contract generates an event TokenExcesses which sends only the query_id to the address i've included inside the message.  So if the token already deployed - then I can only receive the queryId, which I managed to get on my staking contract. In this case - i cant get anything else, right? (reply to 37352)

Illia: This is also true, but you will get a transfer_notification as well  if forward_amount > 0 ensure that receiver's jetton-wallet send message to destination address with forward_amount nanotons attached and with the following layout: TL-B schema: transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16) sender:MsgAddress forward_payload:(Either Cell ^Cell) = InternalMsgBody; (reply to 37447)

ashes: But it's sent to self.owner, isnt it?  send(SendParameters{ to: self.owner, value: msg.forward_ton_amount, mode: SendPayGasSeparately, bounce: false, body: TokenNotification { // 0x7362d09c -- Remind the new Owner query_id: msg.query_id, amount: msg.amount, from: msg.from, forward_payload: msg.forward_payload }.toCell() }); (reply to 37450)

Uncle: hello, how can i upgrade my ton smart contract using tact?

Tonion Dev: Hi, There is no tested and official solution for upgrade smart contracts until now   But the community and Tact team are works on it to provide the. best solution 😎 (reply to 37463)

Uncle: ok (reply to 37464)

Nerses: How to convert Cell to Slice as remaining  ?

Indriana: How sir

Nerses: while sending Jettons with field forward_payload i also send message that will trigger receiver to do some action.Should i send that message in same TL-B scheme as receiver accepts,or the important is to have all fields filled. for insatnce will bld and bld2  be equivalent and both acceptable if they were messages     const bld = new Builder();   bld.storeInt(123,257);    const bld2 = new Builder();   const additionalbld = new Builder();   additionalbld.storeInt(123,257);   bld2.storeRef(additionalbld);

Денис: Hi, does anyone know how to deploy the wallet of the contract owner on the server using Js to manage the contract. I understand this phrase, but it's not working yet

Nerses: the contract ( D )  accepts message ( 0x6769fafe ) but why it throws exit code 130 ( invalid message ),what can cause that ?  https://testnet.tonviewer.com/transaction/3ac699f752cae5a7898d8b93601a5b06183b81874b0db520282d5c3ddb557e8f

Сергей: Hi, do you manage to solve the issue with cell underflow for usdt? (reply to 35483)

Dmitry: is there a way to change repo for tact lsp? it seems they do not merge your update (reply to 36297)

Cardinal: Hi, can anyone tell me what I'm doing wrong? I'm trying to send tokens to sender address but instead both tokens and address are empty in tonviewer.   let msg: Cell = JettonTransfer{     query_id: now(),     amount: 5 * 1000000000,     destination: ctx.sender,     response_destination: myAddress(),     custom_payload: null,     forward_ton_amount: ton("0.5"),     forward_payload: emptyCell() }.toCell();  send(SendParameters{     to: self.jettonWallet,     value: ton("0.5"),     mode: SendIgnoreErrors,     body: msg });

— 2024-08-02 —

Ginta 🦴: Hi, Do I need to learn both Func and Fift? I have learned Func, but according to the official example, Fift is still included in Func?

Phan: Hi guys, does anyone know how to increase the time of the blockchain while testing in local environment?

c9 👨‍🍳: gm gm, anyway to automatically generate hash (0x2c76b973) for message like that  message(0x2c76b973) ProvideWalletAddress {     query_id: Int as uint64;     owner_address: Address;     include_address: Bool; }

Anton: https://docs.tact-lang.org/book/debug#tests-time (reply to 37504)

Anton: you either do not specify the message opcode (0x2c76b973 in your example above) and it will be generated by the Tact compiler automatically, or specify it explicitly as it was already done in your snippet (reply to 37506)

c9 👨‍🍳: which file i can find it after compiling successfully (reply to 37513)

c9 👨‍🍳: in .md file right ?

Anton: yes

c9 👨‍🍳: i see

c9 👨‍🍳: ty sir

Nikita: Hi guys! I wondering is it possible to get origin of tx sender in contract method? Like in Solidity, tx.origin

Nikita: Let me clarify please... Does it store the initial address of messages chain initiator? Or just the address of current message sender (reply to 37527)

Nikita: Got it, thanks. There is no problem with getting msg sender either from context or msg. But I see method you sent is more gas efficient over context initialization, thanks. Anyways I'm looking for a way of getting origin initiator address of messages chain. (reply to 37531)

Nerses: what indicates this Jetton wallet error 5 · Integer out of expected range . more scpecifically what integer is mentioned about ?

Vraj: Heyy guys,  Do anyone from the group use Tact language to deploy contracts on Ton mainnet? Or you use FunC?

Hankson: Tact is the future

Vraj: yeah true, but do people deploy on mainnet using Tact now or use FunC? because Tact is like in beta stage

Vraj: Alright, thanks!

Nerses: how should i send Jettons in case i want to trigger reciever contract do some action.  In this example payload code is the message with which i want to trigger receiver contract but actullay receiver gets only Jetton notify with forward_payload of triggering message  https://testnet.tonviewer.com/transaction/151f995eb67dab93c93a81fb4d9ed1a08b75b5446af13d5acc56f20284952349

Anton: Hi everyone, I can't parse dict  This is how it works let dict = Dictionary.loadDirect(Dictionary.Keys.Uint(32), Dictionary.Values.Uint(256), res.tierToAmount);  But it only parses the first ref, and doesn't work if there are more than 2 elements ______ And this doesn't work in any cases. With an empty dictionary, with single elements, with a large number  dict2 = Dictionary.load(Dictionary.Keys.Uint(32), Dictionary.Values.Uint(256), res.tierToAmount)  Error: No more references  Can someone please help?

Nerses: Have you tried to use functions of wrappers ? (reply to 37551)

Anton: Yep

Anton: dict is definitely not empty and keys and values ​​match

Dmitry: ive updated what i could(as i think) (reply to 37482)

Dmitry: :(

Dmitry: btw tactfmt tends to shift everything to the the right as it seems

Dmitry: (i shall check for grammar errors nevertheless)

Сергей: I have an issue with cell overflow when trying to send TokenTransfer request. Creating payload as Slice work fine. I can parse it. But when I try to use it in the body of the TokenTransfer - code throws 8 cell overflow. How can I create body for TokenTransfer in this case?      let payload = StonfiSwap{       tokenWallet: myAddress(),       minOut: ton("0.1"),       toAddress: myAddress(),       referralAddress: null     }.toCell().asSlice();      let copy = StonfiSwap.fromSlice(payload);     dump(copy.minOut); // works fine      let body = TokenTransfer{       queryId: msg.queryId,       amount: ton("0.01"),       destination: myAddress(),       responseDestination: myAddress(),       customPayload: null,       forwardTonAmount: ton("0.01"),       forwardPayload: payload,     }.toCell();     dump(1); // no dump      send(SendParameters{       to: myAddress(),       value: 0,       mode: SendRemainingValue,       bounce: false,       body,     });     dump(2); // no dump either

Dmitry: tactfmt started to work properly after update(and reboot)!!!  ... but floating error is still popin' out (reply to 37561)

Tom - Bushi: is there any way to restrict who can call a getter? If so, how do I set the origin in a tact test?

Nerses: is it possible to call another receive() method from same contract's other receive()

Nerses: i understood you.can i dm you i would like to discuss a piece of architecture,as your advised method is the only solution for it,but I am not sure (reply to 37567)

Alexander: Hi guys, can you please explain how the SendRemainingValue flag works. If I send a message with this flag after simple setting some storage variables, everything works fine. But if I send another message before sending remaining value (creating another contract if it matters), then message with SendRemainingValue isn't sent (no transaction, no message).

Anton: it’s described here: https://docs.tact-lang.org/book/send#outbound-message-processing (reply to 37572)

Сергей: I will appreciate any help and can pay for consultation that will help to solve the issue (please DM me to discuss) (reply to 37562)

Lib_Data_Auth>: Hello friend, can I help you (reply to 37574)

Сергей: I hope you can, I described an issue here https://t.me/tactlang/37562 (reply to 37575)

Сергей: When I use forward_payload: Slice as remaining my contract throws with 8 cell overflow When I use forward_payload: Struct it works fine in blueprint testing, but when deploy to the mainnet jetton wallet contract written in func throw 9 cell underflow (I tried with usdt and not) (reply to 37575)

Alexander: So, the SendRemainingValue flag cannot be used if there are other messages? In such cases we have to calculate the remaining value manually? (reply to 37573)

User<745529128>: What's your tact compiler version?  Make sure you use the latest one https://github.com/tact-lang/tact/releases/tag/v1.4.1  There was a fix regarding the cell overflows (reply to 37577)

User<6576297005>: I am proficient with UX/UI, frontend,miniapp and smart contract writing and integration. If you are in need ofdev, please contact.

Ahmad🐱: Okay (reply to 37582)

Сергей: It is 1.4.1, thank you (reply to 37581)

User<745529128>: Please try to change the fields order in TokenTransfer, put all adresses first, and all nullables at the end, for example (reply to 37584)

Сергей: As ar as I understand it will not work because fields are parsed in exact order if I will send message with wrong fields order recipient contract will not be able to parse message.

User<745529128>: Aha, and you don't control the recipient contract, okay.. (reply to 37586)

Сергей: I need to send TokenTransfer message - to the jetton wallet contracts (reply to 37587)

User<745529128>: Can you please share StonfiSwap and TokenTransfer schemas? (reply to 37588)

Anton: If you post an issue in tact-lang/tact with the code and a test showing how to reproduce it, we might be able to fix it pretty quickly (reply to 37562)

Сергей: Posted an issue, thank you for advise (reply to 37590)

Daniil: overflow happens because you store "payload" in the same cell as the main part of the TokenTransfer  to fix this (and also to fix the underflow that occurs for you in real network) change your payload construction to this:  let payload = beginCell().storeBit(true).storeRef(StonfiSwap{       tokenWallet: myAddress(),       minOut: ton("0.1"),       toAddress: myAddress(),       referralAddress: null     }.toCell()).endCell().asSlice(); (reply to 37562)

Сергей: will try, thank you (reply to 37594)

Сергей: Error: contracts/test.tact:5:19: Type "Builder" does not have a function named "storeBit" (reply to 37594)

Anton: it should probably be storeBool (reply to 37597)

Сергей: It works in blueprint, I will check in the mainnet @Gusarich, @AntonTrunov thank you!

Daniil: Confused it with .storeBit from @ton/core 😅 (reply to 37598)

Сергей: It does exactly what I need, thank you a lot! (reply to 37599)

— 2024-08-03 —

Degen: Has anyone deployed getgems' nft-marketplace-v2?

Degen: https://testnet.tonviewer.com/transaction/4086bc3e77b449fcf812ee787274518bad1bb95607ed66e50a877f257cb9bb0a  Can someone tell me why this transaction has insufficient gas?

Али: Hello Guys, i have an issue with this line    let now = await blockchain.now;  await send_ext_message(listraContract, pair.secretKey, BigInt(now + 15), params);   error :  'now' is possibly 'undefined'.ts(18048). Do you have any suggestions?

Stephan: hello guys, please help, how do I link metadata to the nft and nft collections when deploying in the blueprint library?

Almatbek: https://t.me/hackatonx/11987/22355

Almatbek: Could there be an opportunity for a capable developer to contribute to your project?

Никита Колодин: Hey guys. The nft collection contract does not become active. Deploying the NFT Collection contract. Tonkeeper tools are used to send tokens and smart contracts. I'm trying to mint the nft collection smart contract and also call mint, but the collection contract remains inactive, without various methods. Maybe I deployed it incorrectly. First I call   openedContract.send(             sender             {                 value: toNano('0.1'),             },             {                 $$type: 'Deploy',                 queryId: 0n,             }  Then   await openedContract.send(sender, {             value: toNano("0.4")         }, 'Mint');

— 2024-08-04 —

Rohit: I created a Jetton contract in Tact language. Yesterday, it showed the contract type as "Jetton" and provided details when clicked. Today, it  shows the contract type as "unknown." Can anyone explain the reason for this?

yash: Looking for freelance Tact/FunC devs, please DM, if interested.

Mr. Badihi: Hey guys anyone have seen this error before ?

Sumit: now() returns the same unit as block.timestamp in solidity?

Alexander: Yes, it’s a unix block time in seconds (reply to 37724)

— 2024-08-05 —

prodvd: Hello Yash. Can you elaborate your dev plan? (reply to 37701)

Nerses: what is the proper way to use forward_payload  as body. Should it be converted ?       receive(msg: TokenNotification){         let ctx: Context = context();                 send(SendParameters{                                 to: myAddress(),                                 value: ctx.value,                                 bounce: true,                                 mode: 0,                                 body: (msg.forward_payload),                             }         );     }

ashwani: anybody please help me to setup TON Mainnet on ubuntu

ashwani: because official document is not enough to setup TON mainnet

Денис: Has anyone encountered it? when trying to send an address to the getter, an Unsupported stackitemtype: undefined error occurs    Is the transfer of the address to the gutter supported in fact?  try {         const result = await this.client.callGetMethod(this.address, 'getPlayerBalance', [             { type: 'address', value: address }  // Fix here: Use the address variable         ]);         ..     } catch (error) {         console.error("Error getting player balance:", error);         return BigInt(0);     }

Buggy: Does ton support transferFrom() jetton like in EVM?

Buggy: Maybe non-undefinable of object been called by function (reply to 37723)

Tom - Bushi: if I have an nft with metadata stored in ipfs, where should this link be found? in the individual_content part of the struct?

Stephan: good afternoon everyone, who knows what the error "132: Access denied" means when calling Mint in the nft collection? https://testnet.tonviewer.com/transaction/a610be0fa8f71ace85398b31690f4eacbc2b51c3f294ffc2f62376d75e526c9d

Tom - Bushi: sounds like you arent the owner (reply to 37755)

Stephan: no, i am (reply to 37756)

Nerses: this code throws error cell umderflow   receive(msg: TokenNotification){         let op_code: Int = msg.forward_payload.preloadUint(32);         if (op_code == 1734998782){             // self._commit(Commit.fromSlice(msg.forward_payload), ctx);         }         if (op_code == 3995289619){             // self._lock(Lock.fromSlice(msg.forward_payload), ctx);         }     }   although first line works correctly  without any error. What can cause that ?

Nerses: how to read main data from variable where data is stored like this beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell()  ?

Nikita: Hi guys! I am looking for experienced Tact dev for small smart contract audit and some kind of mentorship. Russian-speaking person is preferred. Reach me in DM if you are interested please

Felix: I am interested in your task. (reply to 37778)

Nerses: does this aggregation   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());      const forward_payload = beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();  is correct for the structure  message Commit{     data: CommitData; } struct CommitData{     hopChains: map<Int,StringImpl>;     hopAssets: map<Int,StringImpl>;     hopAddresses: map<Int,StringImpl>;     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address;     jettonMasterAddress: Slice;     jettonWalletCode: Slice;       amount: Int;  }

Nikita: Is there any naming conventions in Tact? Firstly it seemed like everything is camelCase except getters which are snake_case. But after some research I found that some folks use snake_case for everything

Nikita: Thanks a lot (reply to 37789)

Mr. Badihi: help :) I started a new counter contract using npm create ton@latest than did npx blueprint build (it worked) but run keep throw this error

sycore: you make sure to run npm install right? (reply to 37791)

— 2024-08-06 —

sycore: hey @novusnota42 i wasn't able to find a comparison or something similar, but as of now, is Tact feature-complete for smart contract development on TON? like, is there anything that you wouldn't be able to do with Tact rn that you can with FunC, other than low level stuff?  i was also wondering if Tact let's you drop down to FunC or Fift, similar to how Solidity let's you drop down to Yul when you need low-level stuff

tony: Hello, what do you think are the current issues with the Tact language? We are currently developing a bot that can assist developers in Tact programming. You can send your Tact code to our bot, and it can help you add features and fix bugs. If you are interested, you can DM me. Thank you!

tony: You can use our bot, which can help you understand the Tact language more quickly. Please DM me, and I will send you the usage link. (reply to 37787)

Mr. Badihi: Yep (reply to 37805)

Terence: Is there any automated static analysis tools, like Slither but for FunC smart contracts?

Terence: Found it really assuring to use to make sure basic mistakes are not make before deploying to production

Nerses: while executing this code      receive(msg: TokenNotification){         let ctx: Context = context();         let data: Slice = msg.forward_payload.loadRef().asSlice();         let op_code: Int = data.preloadUint(32);         if (op_code == 1734998782){             self._commit(Commit.fromSlice(data), ctx);         }     }  I got cell underflow, which occurs because of passing a data with layout different from the Message Commit. Here is the message structure and how I create layout,any hints or help will be appreaciated ! https://gist.github.com/nerses-asaturyan/d4dc102cd9d20a24204a4f6dcc198aa0

prodvd: Where is Tact dev community?

Anton: what do you mean? Tact users or Tact compiler team? (reply to 37832)

Anton: there is a static analyzer tool for Tact: https://github.com/nowarp/misti  its roadmap says it will support FunC sometime in the future (reply to 37823)

Georgiy: Yes, there is the Misti analyzer I'm currently working on. Feel free to reach me if you have any questions. (reply to 37823)

Nerses: is there a way to get blockhash in TON like is done in solidity ? https://docs.soliditylang.org/en/latest/units-and-global-variables.html#:~:text=blockhash(uint%20blockNumber)%20returns%20(bytes32)

Rohit: Is there an official contract for NFTs and Jettons on Tact? If so, could someone please share it?

Anton: works for me ```shell ❯ npm create ton -y -- Test --type tact-counter --contractName Counter  > npx > create-ton Test --type tact-counter --contractName Counter    [1/3] Copying files... [2/3] Installing dependencies...  npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful. npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported  added 458 packages, and audited 459 packages in 1m  50 packages are looking for funding   run npm fund for details  4 moderate severity vulnerabilities  To address issues that do not require attention, run:   npm audit fix  Some issues need review, and may require choosing a different dependency.  Run npm audit for details.  [3/3] Creating your first contract... (node:7232) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead. (Use node --trace-deprecation ... to show where the warning was created) Build script running, compiling Counter ⏳ Compiling...   > 👀 Enabling debug    > Counter: tact compiler    > Counter: func compiler    > Packaging    > Counter    > Bindings    > Counter    > Reports    > Counter  ⚠️ Make sure to disable debug mode in contract wrappers before doing production deployments!  ✅ Compiled successfully! Cell BOC result:  {   "hash": "54c77d7b878e1157df465cadd376f8e78177c6828cd8ae051387470b8e90561b",   "hashBase64": "VMd9e4eOEVffRlyt03b454F3xoKM2K4FE4dHC46QVhs=",   "hex": "b5ee9c724102110100021e000114ff00f4a413f4bcf2c80b010201620208029cd001d0d3030171b0a301fa400120d74981010bbaf2e08820d70b0a208104ffbaf2d0898309baf2e088545053036f04f86102f862db3c5adb3cf2e082c8f84301cc7f01ca005902cb1fcb1fc9ed540d0303e00192307fe07021d749c21f953020d70b1fde2082108b341822ba8f2030d31f0182108b341822baf2e081d33fd31f596c1231a088f84201706ddb3c7fe08210946a98b6ba8ea7d31f018210946a98b6baf2e081d33f0131c8018210aff90f5758cb1fcb3fc9f84201706ddb3c7fe03070040505001800000000436173686261636b013a6d6d226eb3995b206ef2d0806f22019132e2102470030480425023db3c0601cac87101ca01500701ca007001ca02500520d74981010bbaf2e08820d70b0a208104ffbaf2d0898309baf2e088cf165003fa027001ca68236eb3917f93246eb3e2973333017001ca00e30d216eb39c7f01ca0001206ef2d08001cc95317001ca00e2c901fb000700987f01ca00c87001ca007001ca00246eb39d7f01ca0004206ef2d0805004cc9634037001ca00e2246eb39d7f01ca0004206ef2d0805004cc9634037001ca00e27001ca00027f01ca0002c958cc02015809100202730a0c0210aa18db3cdb3c6c210d0b0002200210a990db3cdb3c6c210d0f0150ed44d0d401f863d2000197d31fd31f596c12e0f828d70b0a8309baf2e089810101d7000101d1db3c0e0002700002210011b82beed44d0d200018986c085e" }  ✅ Wrote compilation artifact to build/Counter.compiled.json Initialized empty Git repository in /Users/anton_1/ton/Test/.git/ Success!       __  _    _   _ ___ __  __  _ _   _ ___     | __ )| |  | | | | ____|  _ \|  _ \|_ _| \ | |_   _|     |  _ \| |  | | | |  _| | |_) | |_)    \| | | |     | |_) | |__| |_| | |___|  __/|  _ < | || |\  | | |     |____/|_____\___/|_____|_|   |_| \_\___|_| \_| |_|                      TON development for professionals  Your new project is ready, available commands:   >  cd Test  change directory to your new project   >  npx blueprint build  choose a smart contract and build it   >  npx blueprint test  run the default project test suite   >  npx blueprint run  choose a script and run it (eg. a deploy script)   >  npx blueprint create AnotherContract  create all the necessary files for another new contract  For help and docs visit https://github.com/ton-community/blueprint (reply to 37791)

Anton: ❯ cd Test ❯ ls build      jest.config.ts  package-lock.json  README.md  tests          wrappers contracts  node_modules    package.json       scripts    tsconfig.json ❯ yarn build && yarn test yarn run v1.22.22 warning package.json: No license field $ blueprint build (node:7790) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead. (Use node --trace-deprecation ... to show where the warning was created) Using file: Counter Build script running, compiling Counter ⏳ Compiling...   > 👀 Enabling debug    > Counter: tact compiler    > Counter: func compiler    > Packaging    > Counter    > Bindings    > Counter    > Reports    > Counter  ⚠️ Make sure to disable debug mode in contract wrappers before doing production deployments!  ✅ Compiled successfully! Cell BOC result:  {   "hash": "54c77d7b878e1157df465cadd376f8e78177c6828cd8ae051387470b8e90561b",   "hashBase64": "VMd9e4eOEVffRlyt03b454F3xoKM2K4FE4dHC46QVhs=",   "hex": "b5ee9c724102110100021e000114ff00f4a413f4bcf2c80b010201620208029cd001d0d3030171b0a301fa400120d74981010bbaf2e08820d70b0a208104ffbaf2d0898309baf2e088545053036f04f86102f862db3c5adb3cf2e082c8f84301cc7f01ca005902cb1fcb1fc9ed540d0303e00192307fe07021d749c21f953020d70b1fde2082108b341822ba8f2030d31f0182108b341822baf2e081d33fd31f596c1231a088f84201706ddb3c7fe08210946a98b6ba8ea7d31f018210946a98b6baf2e081d33f0131c8018210aff90f5758cb1fcb3fc9f84201706ddb3c7fe03070040505001800000000436173686261636b013a6d6d226eb3995b206ef2d0806f22019132e2102470030480425023db3c0601cac87101ca01500701ca007001ca02500520d74981010bbaf2e08820d70b0a208104ffbaf2d0898309baf2e088cf165003fa027001ca68236eb3917f93246eb3e2973333017001ca00e30d216eb39c7f01ca0001206ef2d08001cc95317001ca00e2c901fb000700987f01ca00c87001ca007001ca00246eb39d7f01ca0004206ef2d0805004cc9634037001ca00e2246eb39d7f01ca0004206ef2d0805004cc9634037001ca00e27001ca00027f01ca0002c958cc02015809100202730a0c0210aa18db3cdb3c6c210d0b0002200210a990db3cdb3c6c210d0f0150ed44d0d401f863d2000197d31fd31f596c12e0f828d70b0a8309baf2e089810101d7000101d1db3c0e0002700002210011b82beed44d0d200018986c085e" }  ✅ Wrote compilation artifact to build/Counter.compiled.json ✨  Done in 1.31s. yarn run v1.22.22 warning package.json: No license field $ jest --verbose   console.log     increase 1/3        at Object.<anonymous> (tests/Counter.spec.ts:45:21)    console.log     counter before increasing 0n        at Object.<anonymous> (tests/Counter.spec.ts:51:21)    console.log     increasing by 93n        at Object.<anonymous> (tests/Counter.spec.ts:55:21)    console.log     counter after increasing 93n        at Object.<anonymous> (tests/Counter.spec.ts:77:21)    console.log     increase 2/3        at Object.<anonymous> (tests/Counter.spec.ts:45:21)    console.log     counter before increasing 93n        at Object.<anonymous> (tests/Counter.spec.ts:51:21)    console.log     increasing by 38n        at Object.<anonymous> (tests/Counter.spec.ts:55:21)    console.log     counter after increasing 131n        at Object.<anonymous> (tests/Counter.spec.ts:77:21)    console.log     increase 3/3        at Object.<anonymous> (tests/Counter.spec.ts:45:21)    console.log     counter before increasing 131n        at Object.<anonymous> (tests/Counter.spec.ts:51:21)    console.log     increasing by 38n        at Object.<anonymous> (tests/Counter.spec.ts:55:21)    console.log     counter after increasing 169n        at Object.<anonymous> (tests/Counter.spec.ts:77:21)   PASS  tests/Counter.spec.ts   Counter     ✓ should deploy (167 ms)     ✓ should increase counter (139 ms)  Test Suites: 1 passed, 1 total Tests:       2 passed, 2 total Snapshots:   0 total Time:        1.037 s Ran all test suites. ✨  Done in 2.35s. ` (reply to 37791)

B: hello everyone.

B: I wanna start study Ton Blockchain .

Hunter: is there any smart contract auditing company for ton blockchain ?   👀

Anton: https://ton.tech (reply to 37852)

Anton: 🐞 Misti – TON Static Program Analyzer  The first release of Misti – a static program analyzer for the TON blockchain has landed!  🐛 Detect Vulnerabilities: Identify and fix potential security flaws early in the development cycle.  🛠 Create Custom Detectors: Solve specific problems in your code or provide a thorough security review if you are an auditor.  📄 Improve Code Quality: Maintain high standards by catching bugs and enforcing best practices automatically.  🚀 Streamline Development: Integrate Misti into your CI/CD pipeline to ensure continuous code quality checks.  💎 Language Support: Tact ⚡ is supported; FunC support is planned.   - GitHub: https://github.com/nowarp/misti, contributions are very welcome! - Documentation: https://nowarp.github.io/tools/misti/docs - Telegram Group: @misti_dev (forwarded from TON Dev News)

Mr. Badihi: Thanks I will try (reply to 37847)

Vladyslav: Hi everyone, I have a question related to NFT collections. I deployed a collection using this template: https://github.com/howardpen9/nft-template-in-tact?tab=readme-ov-file I minted NFTs, but tonviewer and tonkeeper doesn't see the NFT and collection metadata, whereas getgems shows all metadata correctly. What could be the issue? Thanks in advance for your help!

Anton: no (reply to 37872)

Abdullahi: exactly... (reply to 37890)

Mikhail: Hi guys! Do you have experience with jetton swapping in Tact? Where we can get docs or code example of getting jetton from user wallet?

Oleksandr: Hello everyone! I just started learning tatc and I have a problem with sending tokens. As an example, there are tokens on the contract. Tell me what function should be for withdrawing these tokens to the user's wallet.

Kɪᴍᴏᴠ: Does tonviewer identify your contract as nft_collection? I believe not, because the template you mention doesn't use any standard traits. Use traits or @interface. (reply to 37865)

sycore: yeppa that was part two (reply to 37820)

sycore: oh heck yes (reply to 37826)

sycore: oh man that sounds great. not that FunC is terrible, but it reminds me a lot of working with solana where you have to handle alllll the different chain-specific idiosyncrasies (reply to 37827)

— 2024-08-07 —

c9 👨‍🍳: gm im writing unit test for contract in Tact

c9 👨‍🍳: how i can get the balance of contract or wallet with @tact-lang/emulator

Rjx: Hi Team,  I’m experiencing an issue where the [TON_CONNECT_SDK] Bridge is intermittently reconnecting with a 5000ms delay. I’m using Toncenter with API keys from the free plan. The error does not occur continuously but happens randomly.  Could anyone provide insights into what might be causing this problem?  Thanks!

Định Xuân: Hi guys, I tried to create some NFTs follow this repo https://github.com/howardpen9/nft-template-in-tact, I was able to deploy collection contract and item contract, but NFTs does not appear in my wallet or scan. Has anyone faced this issue yet?

Casa: Check your DM. (reply to 37922)

Phan: Hi guys, does anyone know how to specify the entrypoint for blueprint build?

Nerses: Is there way to get any data (Int type) from c7 register ? In my code logic that data will be used after deployment

7n: Hi all, does anyone know why the tone has a weird seed phrase format, the standard ones don't fit?

Nerses: for this simple code I get compile error       get fun greeting(): Int {         let rand: Int = random(10000000000000000000000000000000000000000000000000000000000000000000000000000,99999999999999999999999999999999999999999999999999999999999999999999999999999);         let result: Int = (rand ^ 1);         return result;       }    but have no idea what causes that. Any hints ? here is the error message Syntax error: expected ")", "{", "(", "!!", ".", "%", "/", "*", "|", "&", "<<", ">>", "-", "+", "&&", "<=", "<", ">=", ">", "==", "!=", "?", or "||"

Casa: Hi guys. If I want to set nft owner when I mint, I should mint first and transfer nft?

Anton: you are using an outdated Tact version, most likely the one that does not support the bitwise XOR operator (reply to 37932)

Vesper: Hi there, as Tact bebeginner and FunC beginner do you have a good link or explanation between both and when to use one or the other?

Nerses: it is 1.2.0 (reply to 37939)

Anton: the current one is 1.4.1 (reply to 37941)

Nerses: I use in my contract fromSlice method.I get in this way message and send it to another party which cant execute it (exit code 130 Invalid incoming message) I think the main problem comes from wrong layout although cant figure out what is wrong. Couls someone give any hint or enlight how I can fix this ? here is the message and how i create layout which later is passed pas parametr to fromSlice https://gist.github.com/nerses-asaturyan/d4dc102cd9d20a24204a4f6dcc198aa0

Nerses: should I use it right after fromSlice ? CommitData.fromSlice(data).toCell() (reply to 37947)

Nerses: the gist code is used to send message, after it I use fromSlice . Where I should use toCell . I didnt get what you mean (reply to 37947)

Denis: Is it normal that jettons compiled with 1.4.1 via blueprint are not detected on tonviewer (at least in testnet)?  get_jetton_data is handled differently in the wrapper: readTuple() was added in 1.4.1. The jetton code itself is based on howardpen9's example edit: and all goes fine with 1.4.0

Anton: Will be fixed in 1.4.2 (reply to 37965)

— 2024-08-08 —

Rjx: Hey guys, error: [TON_CONNECT_SDK] Bridge reconnecting, 5000ms delay. I am getting this error in my TG bot while using it, This issue does not occur continuously but intermittently. Can someone please assist me with this?

Bharathraj: Hey team I just exploring TON and mini app development so my question is should I learn FunC or Tact at the beginning.  I know few concepts of FunC

c9 👨‍🍳: tact bro (reply to 37973)

c9 👨‍🍳: or func if you dont want peace

Bharathraj: Thanks bro 😎

Joel Mun: If u learn func first, tact is easy peasy

Joel Mun: Also i wanna mention that all important contracts on TON are written and deployed in func. So if u need to look into them (like jetton wallet contracts), u might wanna learn func too. Because it is inevitable that u interact with those contracts

Son Pin: "in_msg":{ "@type":"raw.message", "source":"EQANsvIDPk22MqkDtk-TCeBTW1MDz5PP-Gy35WVGOZ15N1LF", "destination":"EQClRL5UpS51_wm1Vmzs7GKquvCOZY7C6tv_PmrNOI0wENXF", "value":"20000000", "fwd_fee":"461337", "ihr_fee":"0", "created_lt":"24325525000002", "body_hash":"4nIC4tpC2aRMnGymkSN/Z72vYV+IqClvje96czP1d00=", "msg_data":{ "@type":"msg.dataRaw", "body":"te6cckEBAwEAVAACDyv1xOGBkAADAQIAQ7+NsvIDPk22MqkDtk+TCeBTW1MDz5PP+Gy35WVGOZ15N8AAQ7+QLZYDBkkCtsmxcRJqWPAIw81owF79ShN7vigMsj81pMDn44rX", "init_state":"" }, "message":"K/XE4YGQAAI=\n" },  how can we extract op_code from msg data? (forwarded from Son Pin)

Сергей: Hi, I need to verify sender address when receive TokenNotification for contract written in funC (say USDT) Is it possible to calculate usdt jetton wallet address for my contract in tact?

Joel Mun: func has a method for it, idk if tact does. Maybe u can translate the function into tact?

Joel Mun: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-utils.fc heres everything u need

Nerses: how can this variable be opened in TACT to read b_0 and uint ? beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();

Fardin: Hello Every single time hitting this issue (Not sure its about vpn):

Fardin: I have same issue How could i fix this? (reply to 37965)

Denis: I can only suggest u to downgrade @ton-language/compiler to 1.4.0 or wait for 1.4.2 (reply to 38007)

Fardin: Well this package doesnt existed in the counter sample (reply to 38008)

Denis: You can find it in package-lock in dependencies of other packages) I just installed it myself with strict version(dependencies with ^) (reply to 38010)

Denis: I guess there are no package depends on latest version, so it should not be a problem (but better check it)

Fardin: Yep as u said its here (reply to 38012)

Denis: just execute npm i @tact-lang/compiler@1.4.0 If there are some package need last version, i guess npm should notify you) In this case you need to downgrade package, which depends on 1.4.1 (reply to 38014)

Fardin: Great lets me try it buddy (reply to 38015)

X Era Space 🦴 🍅▪️ 🐾 🐶: hello gm

X Era Space 🦴 🍅▪️ 🐾 🐶: Please feloow devs, how can i get a validity of an address using tact? if (msg.response_destination.isValidAddress()) {}

X Era Space 🦴 🍅▪️ 🐾 🐶: someone should be please assist me, i am just getting started on TON eco

X Era Space 🦴 🍅▪️ 🐾 🐶: i want to get validity of an address  like:  if myAddress.isValid   do some tasks else do other tasks.  but i dont know how i can get the validity on Tact language. please someone should assist me on this......

Fardin: I think the type of Address should be enough for this purpose (reply to 38025)

Fardin: contract Treasure with Ownable {     // Persistent state variable, which MUST be defined in the contract     owner: Address;       // Constructor function init(), where all the variables are initialized     init(owner: Address) {         self.owner = owner;     } } (reply to 38027)

Alan: How i can chat in dm with one of @ton/blueprint contributor? Seems like we have found some bug in compilator in the last version of BP. Downgrade package.json and lock file fix issue, but still..  Both version (last and from lock file) use the same contract code (100% identical)

— 2024-08-09 —

Anton: A better way would be to open an issue in Tact’s repo with the problem description and a reproducible example (reply to 38043)

Degen: Mine minted NFT is showing unverified NFT on ton keeper, why？

Degen: How to publish a verified NFT

Tuấn: same question (reply to 38050)

Vegeta Toriyama |: hi I have a question in tact, how to send precisely an amount of TON from contract to a wallet ?

Vegeta Toriyama |: Im sending this message from the contract but the recipient balance does not increase as expected (sentAmount) ` send(SendParameters {             to: recipient,             value: sentAmount,                           mode: SendPayGasSeparately | SendIgnoreErrors,             bounce: false,             body: "whatever here".asComment()         }); `

Денис: Hello everyone, is it possible to return two values from a function in Tact?  fun getLevelInfo(levelID: Int): Slice{         levelID -= 1;         require(levelID < self.levelsLength, "!levelID");         let level: Int = levelID % 2;         let round: Int = (levelID - level) / 2;         let res: Cell = beginCell().storeUint(level, 4).storeUint(round, 4).endCell();         return res.asSlice();     }

Денис: Or just like that? (reply to 38065)

Nerses: in case the data is encapsulted  inside variable in this way beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();   and send it as field in message will this be correct way to read the data ?           let op_code: Int = mainMsg.loadUint(32);         let b_0: Slice = mainMsg.loadRef().asSlice();    here mainMsg is the value of sent data

Nerses: the forward_payload which is aggregated like this   let b_0 = new Builder();   b_0.storeDict(hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   b_0.storeDict(hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());   let b_1 = new Builder();   b_1.storeStringRefTail(dstChain);   b_1.storeStringRefTail(dstAsset);   b_1.storeStringRefTail(dstAddress);   let b_2 = new Builder();   b_2.storeStringRefTail(srcAsset);   b_2.storeAddress(srcReceiver);   b_2.storeInt(timelock, 257);   b_2.storeAddress(messenger);   b_2.storeRef(jettonMasterAddress);   b_2.storeRef(jettonWalletCode);   let b_3 = new Builder();   b_3.storeInt(amount, 257);   b_2.storeRef(b_3.endCell());   b_1.storeRef(b_2.endCell());   b_0.storeRef(b_1.endCell());      const forward_payload = beginCell().storeUint(1, 1).storeRef(beginCell().storeUint(1734998782, 32).storeBuilder(b_0).endCell()).endCell();  i get as message field. I have correctly parsed the data of op_code . here is the code         let slice = msg.forward_payload.asCell().beginParse();          let flag = slice.loadUint(1);           let refCell = slice.loadRef();           let refSlice = refCell.beginParse();         let op_code = refSlice.loadUint(32);     could someone give a hint how I can get the data of b_0 ?

Nerses: for this piece of code javascript             let msg: CommitData? = null;             try {                 msg = CommitData.fromSlice(msgSlc);             } catch (e) {                 require(false,"Unable to resolve CommitData");             }             require(ctx.value != 0,"Funds Not Sent");             require(msg.timelock > now(),"Not Future Timelock");   i got error `Invalid type "CommitData?" for field access                                                                                          Line 202, col 21:   201 |             require(ctx.value != 0,"Funds Not Sent"); > 202 |             require(msg.timelock > now(),"Not Future Timelock");  i tried to use (msg.timelock)!!`  but again got same error. Any hints how this can be solved ?

Degen: How to determine whether a transaction has been completed? Is there any API to detect it?

Degen: For example, when initializing a contract, I need to monitor the completion status of the contract.

Nerses: @AntonTrunov could you please have a look at this ? Thanks beforehand (reply to 38077)

Bharathraj: See i am new to TACT, when i running keep on getting this error, even i run npm install and update commands too.

Sumit: SendPayGasSeprately | SendRemainingValue = The gas will be paid from value attached to original message?

— 2024-08-10 —

Alexey: I'm writing smart on tact, I just can't figure out the gas when sending several messages from one smart contract function I often get 37 exit code For some reason, SendRemainingValue does not take into account the sent ton from previous messages Has anyone encountered anything like this?

Alexey: no, I do it within one call example  send(SendParameters{                 to: wallet_address,                  value: ton("0.2"),                 mode: 0,                  bounce: false,                 body: TokenTransferInternal{                      query_id: msg.query_id,                     amount: msg.amount,                     from: self.owner,                     response_destination: msg.response_destination,                     forward_ton_amount: msg.forward_ton_amount,                     forward_payload:  msg.forward_payload                 }.toCell(),                 code: init.code,                 data: init.data             });              send(SendParameters{                   to: self.master,                 value: ton("0.2"),                 mode: 0,                 bounce: false,                 body: TokenBurnNotification{                     query_id: msg.query_id,                     amount: percent05,                     sender: self.owner,                     response_destination: self.owner,                     send_excess: false                 }.toCell()             });                  send(SendParameters{                 to: dev_wallet_address,                  value: 0,                 mode: SendRemainingValue,                 bounce: false,                 body: TokenTransferInternal{                      query_id: msg.query_id,                     amount: percent05,                     from: self.owner,                     response_destination: msg.response_destination,                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             }); (reply to 38132)

Alexey: @ethics_man but SendRemainingValue send all ton, and ton for previos 2 sends (0.4) does not take into account

Sumit: https://docs.tact-lang.org/ref/stdlib-config What is the use of this?

Anton: https://docs.tact-lang.org/book/send#outbound-message-processing (reply to 38131)

Fardin: Does anyone used the jetton transferring method before with payload on excess function?   I wanna to transfer a jetton to a tact contract with a custom payload.  Could some of this contract functions be called via the jetton transfer?

— 2024-08-11 —

Alexey: в точку! (reply to 38141)

EDITOR FRED: Hello guys

EDITOR FRED: Anyone looking for a collaborator? I'm looking for where to contribute 🧘

Mr. Badihi: how do I cast type Address to String ?

Sumit: i am emitting a struct

Sumit: what would be the const code = om.body.asSlice().loadUint(32); code for this emit inside a hash

Sumit: for example if i emit a message that it has a value

Sumit: which i generally fetch from loadMyStructName in tact generated code

Sumit: but this is not the case for a struct

Mista: Hi, I want to execute a transaction without a fee as follows but without success. Am I mistaken that I can execute a transaction without a fee in the first place?       await Contract.send(provider.sender(),.       {value: BigInt(0)},.

Kiran: Hey everyone maybe someone can help. Why does my bot show 5 users at the top when it has more? How can we amend this?

— 2024-08-12 —

Georgiy: https://github.com/nowarp/misti/labels/good%20first%20issue if you want to contribute to a static analyzer for Tact. (reply to 38163)

tony: Hello, we are the PuzzleMind team, aiming to create a product on Telegram that helps developers use the Tact language more efficiently. We are currently in the early stages of the product, and we hope to collect everyone's needs. After experiencing our product, you can fill out the questionnaire, and we will offer a USDT reward! https://forms.gle/iqDJQyiQ6p1wzoAz7

Олег: From were blockchain have to take fee for a gas? (reply to 38173)

Naved: Hi everyone,  I'm reaching out today to seek feedback on a smart contract I've been working on. It's Nft contracts which allows only whitelisted users mint NFTs. it is managed by a WhitelistManager on which owners add users to whitelist it deploy new contract that stores users whitelist info. That contract can be call by the whitelist user. User call "mintNFT" to mint nft from two contracts Cards and Pets  I've posted the code on GitHub Gist: https://gist.github.com/nxved/217b473ba275ddfe582b4ad0a225ea01  I'm particularly interested in getting your insights on:  Security: Are there any potential vulnerabilities or exploits in the contract? Functionality: Does the code achieve the intended functionality as expected? Efficiency: Can the code be optimized for better gas usage or performance? Best Practices: Are there any coding practices or standards I should be following that I've missed? Any feedback or suggestions you have would be greatly appreciated. I'm open to learning and improving the contract, so please don't hesitate to point out any areas that could be better.

Georgiy: I just ran the static analyzer and skimmed through the contract in 5 minutes:  * Unused variable randomNum here. Did you forget to use it? * Why do you duplicate code here? * Hardcoded address: what if you would like to change the owner later? * RoyaltyParams should not be optional * What this hardcoded value means? (reply to 38182)

Vegeta Toriyama |: hi I deployed a jetton contract using this code https://tact-by-example.org/07-jetton-standard  i deployed to testnet but i dont know why explorer did not recognize the deployed jetton contract.  I deployed here on testnet  https://testnet.tonviewer.com/transaction/c96b6232add0c7afd4079993a512f273f313fa84ecde3d4791caa9bc0fac27c8  could any one help me. thank you very much

Joel Mun: This is a known issue. See https://t.me/tactlang/37965 (reply to 38192)

Vegeta Toriyama |: Oh. Thanks mate. Does it mean blueprint 1.4 should work ? Thank you very much for your help (reply to 38194)

Joel Mun: Yeah just install 1.4.0 and it should work https://t.me/tactlang/38015 (reply to 38195)

Nerses: in case i use such code in smart contract for Jetton transfer will it deplot jetton wallet contract for receiver in case it doersnt have,as i specified init code and data ?         send(SendParameters{                             to: lockObj.htlcJettonWalletAddress.loadAddress(),                             value: ctx.value,                             bounce: true,                             mode: 0,                             body: TokenTransfer {                                                 queryId: queryIndex,                                                 amount: lockObj.amount,                                                 destination: lockObj.srcReceiver,                                                 response_destination: sender(),                                                 custom_payload: null,                                                 forward_ton_amount: 1,                                                 forward_payload: ("Redeemed").asSlice(),                                              }.toCell(),                             code: lockObj.initCode,                             data: lockObj.initData,                                              }         );

Vegeta Toriyama |: Thank you very much (reply to 38197)

Joel Mun: If you are interacting with a standard jetton contract, you dont need to specify init code and data. Jetton wallet implementation has it done for you already. You dont need to worry about it. (reply to 38198)

X Era Space 🦴 🍅▪️ 🐾 🐶: Please i am trying to build a METADATA for my NFT on TON blockchain, but i dont know how to input it in the contract.  someone should assist me 👏    struct COLLECTIONMETADATA {    "image": String;   //"https://ton.org/_next/static/media/smart-challenge1.7210ca54.png",    "name":  String;   //"TON Smart Challenge #2",    "description": String;   //"TON Smart Challenge  #2 Winners Trophy", "social_links": String []; }

Alexander: Hi guys, I think it can be useful to add this kind of exam ple to Tact usage examples. It helps to use one factory to deploy children when you need to allow change Child code. What do you think?

Nikita: Hi! Is it possible to log or something parameters that where receivied to receiver in some contract?

Денис: Hello everyone, how to implement the following logic: The user sends a message to the smart contract address "Parent" and 5 tons, upon receipt of this message, the Parent deposits the Child and 5 tons remains at the Parent's address. But if the user sends the same message again with 5 tons, then how do I send these tons back to him? When sending a message from a Parent to a Child, I check the parameter in the Child contract and if it is not equal to 0, then I need to roll back the entire transaction and return the user his coins minus the commission?

— 2024-08-13 —

Anton: We just released a dev version of Tact (`next` tag on NPM) that is supposed to fix this issue. Could you try it and check it does indeed resolve your issue? https://www.npmjs.com/package/@tact-lang/compiler/v/1.4.1-dev.20240813  Here are some instructions on how to use the next version of Tact: https://github.com/tact-lang/tact/wiki/Using-unreleased-versions-of-tools-early#dev-versions-of-tact-with-blueprint  @M3HTos could you please also try it?  UPD: actually, it’s easier to install that version of Tact like so  yarn add @tact-lang/compiler@1.4.1-dev.20240813 (reply to 38192)

Vegeta Toriyama |: Sure (reply to 38218)

Ryan: Hi！ Does anyone know how “bounced<T>” message is constructed in Tact compiler? I did find the logic in code base. Thanks!

Kɪᴍᴏᴠ: You can't create a bounced message inside a contract. (reply to 38220)

Kɪᴍᴏᴠ: You can only receive one.

Anton: it gets the first fields of your message that fits into the 224 bit limit (reply to 38220)

Nikita: Hi guys! I have a question about building struct data. Perhaps I should build cell for nullable fields different. Maybe add false flag if it's null or something. Example:  struct StakeRequest {     requestId: Int as uint32;     from: Address;     stakeHash: Int;     boosterNft: Address?; } forwardPayload: beginCell()                     .storeUint(0, 32)                     .storeAddress(user1.address)                     .storeUint(stakeHash, 257)                     .storeAddress(null)                     .endCell(),  When I try to parse struct using Struct.fromSlice I get underflow (9) exit code.

Nikita: I tried to replace  storeAddress(null)  with  storeBit(false)  and still get 9 exit code

Vegeta Toriyama |: hi this does not seem to work  https://testnet.tonviewer.com/transaction/345cb6c368c7d1fd081a8c8968da126af694e87056180bb9a1a15cce51ae0d1b (reply to 38218)

ashes: Why in this case i get 708 exit code, should I forward something else than emptySlice?  send(SendParameters{ to: self.contractJettonWallet!!, value: 0, mode: (SendRemainingValue + SendIgnoreErrors), bounce: false, // 0x7362d09c - notify new owner body: TokenTransfer{ queryId: now(), amount: msg.amount, destination: context().sender, response_destination: myAddress(), custom_payload: null, forward_ton_amount: ton("0.01"), forward_payload: emptySlice() }.toCell() } );

Nikita: 708 error code is custom code generated from your ‘require’ statements. Check generated ts file in build folder for your contracts and find error message matches for this code (reply to 38230)

Joel: you need to store an empty address. an empty address is two-bits long zero value, not null or false (reply to 38226)

Nikita: Got it, thanks so much (reply to 38232)

Joel: Have a look at the tl-b scheme of addr_none: https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/block.tlb#L100 (reply to 38233)

Joel: addr_none$00 = MsgAddressExt;

ashes: It's from jetton contract,  throw_unless(708, slice_bits(in_msg_body) >= 1); (reply to 38231)

Dmitry: does tact have spread syntax?

Daniil: seems that it's a custom version of a contract for such spam transfers. (reply to 38240)

Vegeta Toriyama |: Is there any feature to write unit tests but calling a contract on the chain? Like unit tests with forking similar to foundry with ethereum

Nikita: Hm, I will check same code I have for Jetton transfer as soon as I back home. Text me if I forget (reply to 38236)

ashes: solved it like this, if u find it not optimal solution - please review  SendParameters{     to: self.contractJettonWallet!!,     value: ton("0.000001"),     mode: (SendRemainingValue + SendIgnoreErrors),     bounce: false, // 0x7362d09c - notify new owner     body: TokenTransfer{         queryId: now(),         amount: msg.amount,         destination: context().sender,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.000001"),         forward_payload: beginCell().storeUint(0,1).endCell().asSlice() }     .toCell() } (reply to 38246)

Pika: hi has anyone implemented ERC20 transferFrom equivalent code for jetton in tact

Vegeta Toriyama |: i dont think transfer from is necessary (reply to 38251)

Anton: 🎉 Tact 1.4.2 has just landed on NPM!  🐞 We fixed a few type-checking and code generation bugs. One of the most important fixes is that getters again return flattened types for structs as it used to be. We broke it while trying to allow structs with more than 15 fields. Please give it a try and let us know if the issue is gone now — all your bug reports are really appreciated.  🛠 A bunch of the other changes include improved support for the misti static smart-contract analyzer — give it a try, it’s in early stage of development but already found some issues in soon-to-be released projects.  — The Tact team  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Dmitry: Btw is there smth to read about 15 fields. I stumbled upon this once in my code. (reply to 38256)

Dmitry: And the message was rather cryptic

Dmitry: It was from Func compiler as i remember (reply to 38259)

Anton: Yeah, we keep everything in our changelog: https://github.com/tact-lang/tact/blob/main/CHANGELOG.md#142---2024-08-13  If you follow the links from it, you arrive at this issue: https://github.com/tact-lang/tact/issues/248 (reply to 38258)

Nikita: Guys, I still get error code 9 and don't have any idea why... Request data parses OK when I use generated loadStakeRequest function from ts file in build folder.  But when it comes to Struct.fromSlice I get error 9. Perhaps any ideas what can cause it?  struct StakeRequest {     requestId: Int as uint32;     from: Address;     stakeHash: Int;     boosterNft: Address?; } const requestData = beginCell()             .storeUint(0, 32)             .storeAddress(user1.address)             .storeUint(stakeHash, 257)             .storeUint(0, 2)             .endCell();          const transferJettonToStakingWalletResult = await user1.send({             to: user1JettonWalletAddress,             value: toNano('0.1'),             sendMode: SendMode.CARRY_ALL_REMAINING_BALANCE,             body: createJettonTransferBody({                 queryId: 0,                 jettonAmount: 1_000_000_000n,                 toAddress: stakingMaster.address,                 responseAddress: user1.address,                 forwardAmount: toNano('0.06'),                 forwardPayload: requestData,             }),         });  export function createTransferBody(params: TransferBodyParams): Cell {     const cell = beginCell();     cell.storeUint(0xf8a7ea5, 32);     cell.storeUint(params.queryId || 0, 64);     cell.storeCoins(params.jettonAmount);     cell.storeAddress(params.toAddress);     cell.storeAddress(params.responseAddress);     cell.storeMaybeRef(null);     cell.storeCoins(params.forwardAmount || 0n);     cell.storeMaybeRef(params.forwardPayload);      return cell.endCell(); }  receive(msg: TokenNotification) {         let stakeRequest = StakeRequest.fromSlice(msg.forward_payload); // error code 9 here }

Vegeta Toriyama |: Does it solve the issue with jetton deployment not recognized on tonviewer? (reply to 38256)

Farel: Has anyone already tried to implement cnft on tact? please share a link.

Anton: This should be solved, yes. Would appreciate your feedback on it though (reply to 38265)

Denis: In this case all fine. (reply to 38267)

Vegeta Toriyama |: Amazing. I’ll deploy one and confirm (reply to 38267)

Rahul: Yes, it's working now. I tested it on Nujan IDE with Tact v1.4.2 (reply to 38265)

Nikita: Perhaps I should store forwardPayload as Slice... But when I try to use cell.storeMaybeSlice() with this data I get error (reply to 38264)

Vegeta Toriyama |: which tact jetton implementation do you use bro ? (reply to 38271)

Tom - Bushi: 2 questions: 1. how can I make a dictionary in blueprint tests? 2. is there code coverage in blueprint/tact?

Vegeta Toriyama |: 1. can use map but it has limited max entries (reply to 38274)

Son Pin: 1. Question 1 =============== https://testnet.toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get  after get transaction. I can see in message info with   info: CommonMessageInfo;     init?: Maybe<StateInit>;     body: Cell;  But how can parse the body with generated function in Tact.  2. Question 2 =============== Although i added emit function. but the api still return the same

Tom - Bushi: thanks for answering, do you know the limit? (reply to 38275)

Vegeta Toriyama |: 30k entries per map 65k per contract (reply to 38277)

Tom - Bushi: hmmn odd, Im only trying to send 100 entries and using map in the transaction but doesnt look to be sending (reply to 38278)

Vegeta Toriyama |: map in the transaction ? (reply to 38279)

Tom - Bushi: yeah that was my question, I want to send a message where one parameter is a map in a test message Message {     indexAmount: Int as uint16;     indexToId: map<Int, Int>; } (reply to 38280)

Sumit: i have a blueprint script and if it has more than 2 actions then only one gets applied.

Sumit: what can i do to prevent this

Vegeta Toriyama |: i dont know this. but sending map is odd in any other smart contract languages. might think of sending 2 arrays instead (reply to 38281)

Rahul: https://github.com/howardpen9/jetton-implementation-in-tact  With Deployable trait (reply to 38273)

Vegeta Toriyama |: thanks (reply to 38285)

Vegeta Toriyama |: does it work without deployable ? (reply to 38285)

Tom - Bushi: are you awaiting the completion of the actions? (reply to 38282)

Sumit: yes i am awaiting (reply to 38288)

Tom - Bushi: I thought tact didnt support arrays 🤔 (reply to 38284)

Sumit: each action

Rahul: Yes (reply to 38287)

Tom - Bushi: I figured it out, just need to use Dictionary.empty<bigint, bigint>() and then populate it (reply to 38284)

— 2024-08-14 —

Pika: i want a tact function which can accept jettons by user for any jetton_master. how can i implement this ? (reply to 38254)

Nikita: Hey everyone again! I continue to fight against issue I texted about yesterday. Small updates from yesterday. I added dump for forward_payload I try to parse into struct (exact place where I get 9 exit code) and faced with strange behaviour. Here is place where I send message (jetton wallet contract): if (msg.forward_ton_amount > 0) {             dump(msg.forward_payload);             send(SendParameters{                 to: self.owner,                 value: msg.forward_ton_amount,                 mode: SendPayGasSeparately + SendIgnoreErrors,                 bounce: false,                 body: TokenNotification {                     queryId: msg.queryId,                     amount: msg.amount,                     from: msg.from,                     forward_payload: msg.forward_payload                 }.toCell()             });         }  and here is place where I receive it:  receive(msg: TokenNotification) {         dump("TokenNotification received".asComment());         self.requireJettonWallet(myAddress());         dump("wallet verification success".asComment());         dump(msg.forward_payload); }  And I see next in logs. Forward payload is different, even length, or I understand this logs incorrectly: (reply to 38264)

Nikita: I would be really glad if someone pay attention to it, because I really tired from this weird issue... It's either stupid mistake or some details I don't know about (reply to 38309)

Anton: If you want help, then you need to provide a repository with all the code and tests and instructions how to reproduce your issue locally and get the actual output + specific what you expect to see instead and why (reply to 38311)

Piotr: Hello, could you recommend what would be nice test coverage tool for tact smart contracts

— 2024-08-15 —

Sumit: Is there a proxy TON in tact

AB: message TransferRequest{     amount : Int; }  contract AB with Deployable{  contractJettonWallet : Address;  init(addrss : Address){     self.contractJettonWallet = addrss; }   receive(msg : TransferRequest) {          let init: StateInit = initOf JettonDefaultWallet(self.contractJettonWallet,context().sender);           let walletAddress: Address = contractAddress(init);      send(SendParameters{     to: walletAddress,     value: ton("0.001"),     mode: (SendRemainingValue + SendIgnoreErrors),     bounce: false,     body: TokenTransfer{         queryId: now(),         amount: msg.amount,         destination: context().sender,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.000001"),         forward_payload: beginCell().storeUint(0,1).endCell().asSlice() }.toCell() }) }  }

AB: hello everyone  I am experiencing an issue with a smart contract I’ve developed on the TON blockchain. Specifically, I’m having trouble with a token transfer function within my lottery contract. The token transfer is not occurring as expected, and I am unable to determine the cause of the problem.

Евгений: Any error codes in transaction?

AB: https://testnet.tonviewer.com/transaction/a9fa3241637e37ae79b402b50f92d2a4891b899d348d676e8432292d8144f041

Евгений: Seems like jetton wallet is incorrect + u don’t have any jettons on contract

AB: please suggest me

wadaxiwa: Hello friends, I would like to ask a question, Jetton wallet address (offline), why the address printed in the testnet environment is inconsistent with the address printed using get_wallet_address.

Joel: Lemme drop my two cents for all the devs here.   If you are asking a question, ask it properly. We dont know about what you are working on as well as your entire codebase.   What you choose to mention is the only info we have.   Dont ask questions as if you are dropping a bomb in haste and expect someone to answer you. Provide as much detail as you want to solve your problem and very preferably give a link to the entire codebase or at least all relevant parts.  And do the basic things.. format your code, get rid of typos, etc etc..

Mr. Badihi: Do I must deploy a contract before I start to send messages?

Mr. Badihi: For some reason I see that the contract is uninit (reply to 38372)

Mr. Badihi: I tried to make a parent child design. I calculated the address of the new child from the parent and just sent a message directly to the children

Anton: 🎉 Tact 1.4.3 has just landed on NPM!  🐞 We fixed a couple more issues and provided a fix for a special case of optional types in getter return types. Happy hacking, Tacticians!  — The Tact team  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Alex: how can i make a short name for a smart contract or wallet? I know about the domain .ton but here in the screenshot or any exchange address does not use the domain .ton

Denis: Maybe i wrong. But by naming u already have wallet address (not jetton) from constructor(init) arguments. And after that trying to calculate wallet address. JettonDefaultWallet(self.contractJettonWallet,context().sender);   first argument should be JettonMaster address, not wallet (reply to 38346)

— 2024-08-16 —

Rinat | ZilPay (Will not Call or DM you): neovim (reply to 38411)

Nerses: Is it possible on the TON blockchain for one wallet to sign a message or transaction, and then have another wallet publish it, similar to how it's done in Ethereum? If so, how would this be implemented?

Mr. Badihi: what is the best want to convert String to Int .. it also might be negative. I tried this :         let slice: Slice = str.asSlice();         let user_id: Int = slice.loadInt(slice.bits());

Ricardo: you have an example on the docs. https://docs.tact-lang.org/cookbook/type-conversion (reply to 38418)

Mr. Badihi: // Caution: produces unexpected results when String contains non-numeric characters! (reply to 38419)

Mr. Badihi: Also its not covering the neg nums

澀谷工程師: Yes, it is. You can follow the wallet V5 release!  https://github.com/tonkeeper/w5/blob/c5465be2312b4fd83cb429904828c771db6f7721/contracts/wallet_v5.fc#L164  Tonkeeper wallet/w5 documents mentions the authentication mode which could be verified by signature   https://github.com/tonkeeper/w5/blob/main/Specification.md (reply to 38415)

Ricardo: you can make that function your own. implement a flag that if the first char is a "-" you multiply by -1 in the end. and verify each char if it's a valid int and if not, error out. (reply to 38420)

Mr. Badihi: yeah thats what im trying now

Nerses: how message signing is handled by wallets in the TON blockchain. Specifically, I'm interested in how this can be done programmatically, ideally with a code example. Additionally, does the process of signing a message depend on the version of the wallet being used?

Asahi: I tried compiling the Tact example from 07-jetton-standard, but I encountered the following error:   Incompatible types "Address" and "<null>" for binary operator "!=" Line 64, col 13:   63 |         self.total_supply = self.total_supply - msg.amount; // Update supply > 64 |         if (msg.response_destination != null) { // Cashback                    ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   65 |             send(SendParameters{  Has anyone else faced this issue? thanks

Anton: you don’t need to compare it to null, there is no point in doing so:   message(0x178d4519) TokenTransferInternal {     queryId: Int as uint64;     amount: Int as coins;     from: Address;     response_destination: Address;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton }   in the above response_destination already has type Address (reply to 38428)

Joel: I dont know about this example or Tact much in general, but Address cannot be a null type. Address can only be ‘none’ which is represented by two-bits long zero (reply to 38428)

Joel: You can have a look at Redstone oracle implementation. They use signing on the price data and they have an example on github (reply to 38427)

Asahi: thanks, Removed it, and it indeed works. But why does the Tact example include this check? (reply to 38429)

Nerses: could you please say is it the right folder i am searching in  https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector/contracts/redstone ? (reply to 38431)

Joel: Yeap (reply to 38433)

Joel: Signing should be done off-chain though. Not sure where the code is for that.

Nerses: yeah I am mainly interested in it.Thanks for help and guidance (reply to 38435)

Anton: who knows? :) the Tact team just does not have the manpower to maintain tact-by-example, we only improve the official docs at the moment: https://docs.tact-lang.org (reply to 38432)

Asahi: The Tact example didn't provide a deployment script, so I wrote one on my own that should work. However, I have a question: the example doesn't mention how to configure the token's image or other related information. How should this be done? Thanks! (reply to 38437)

Joel: You can check unit tests in the jetton contract repository (reply to 38438)

Joel: Lemme find it for u (reply to 38439)

Joel: https://github.com/ton-blockchain/token-contract/blob/main/sandbox_tests/JettonWallet.spec.ts#L40-L41 (reply to 38438)

Joel: The off chain data pointed to by the uri should follow the standard mentioned here https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain (reply to 38441)

Joel: hope this helps

Asahi: Thank you for your help, I'll give it a try. (reply to 38444)

Joel: Btw ive noticed that a lot of devs here find it difficult to understand how the jetton contract works. Ive written a very detailed explainer here so check it out if you are interested: https://research.lazer1.xyz/blog/how-jettons-work-on-ton-with-sharding-in-mind-part-1/

Asahi: I deployed a contract to the testnet. Will the token's logo be visible in Tonkeeper? If not, is there a way to display the token's logo on the testnet? (reply to 38447)

Joel: Soz i never tried that. Somebody else might be able to help on this (reply to 38448)

Maxim: Hello guys! Is there any way to understand why some messages wasn't delivered? https://testnet.tonviewer.com/transaction/f20029165c9a2ca85359868b88a9e0d12885211bad88044fe4cadcd70caa371e?section=trace

Maxim: And what is the main reason that whole transaction marked as unsuccessful?

Maxim: It seems that problem appeared each time contract sends 2 messages in a time

Maxim: Is there any way to debug it?

Maxim: Thank you

Fardin: How to convert this boc to a human understandable version?   https://docs.ton.org/develop/dapps/ton-connect/transactions (forwarded from Fardin)

Fardin: Same boc as document but not working ... (forwarded from Fardin)

Asahi: I'm currently on the testnet, but I can't see the icon for the token I issued. Is this normal? (reply to 38460)

— 2024-08-17 —

Joel: Im not 100% sure but could the gas be an issue? (reply to 38461)

Maxim: Is there any proper way how to calculate gas consumption in case of 2+ messages sending during one transaction?

Maxim: I did it this way but not sure that it is correct

Joel: You got local sandbox tests? (reply to 38481)

Maxim: it was running on testnet

Maxim: I don't know how to resolve it neither on local machine or testnet...

Maxim: I don't see any errors on local

Joel: You can check the jetton wallet contract (its in func tho) code (reply to 38479)

Joel: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L85-L96  https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L128-L157  First part: sends a txn that will send another txn  Second part: sends two txns at once (reply to 38487)

Joel: Im not super well versed with gas, but could it be storage fee issue then? That could be different in mainnet env. Cos transaction_fee = storage_fees                 + in_fwd_fees                 + computation_fees                 + action_fees                 + out_fwd_fees (reply to 38484)

Joel: Sorry if this isnt the case 😓 I am still learning (reply to 38489)

Maxim: Thanks for the reply, I will try my best with your links

Maxim: But I am newbie in FunC

AB: send(SendParameters{             to: msg.master,             value: ton("0.001"),              mode: (SendRemainingValue + SendIgnoreErrors),             bounce: false,              body: TokenTransfer{               queryId: now(),         amount: msg.amount,         destination: context().sender,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.000001"),         forward_payload: beginCell().storeUint(0,1).endCell().asSlice() }     .toCell()         });

AB: https://testnet.tonviewer.com/transaction/efc8738ecd43fc1a5ba517bfaa0c384f923a40304c247e1ff5959b7de8d40824

AB: Exit code 65535

Sorovi: 65535

AB: The tokens aren't transferring between contracts as expected, and I'm not sure why exit code 65535

AB: transaction errror Unable to complete the operation

Joel: i think your opcode is wrong or you didn't specify it?

AB: I've tried various methods, but the token transfer isn't working as expected. I've written a lottery smart contract that successfully transfers USDT, but I'm currently testing it with the AB token on the testnet, and it's not functioning properly.

Mr. Badihi: I think you can’t send two messages (reply to 38481)

Asahi: I switched to a different block explorer, and now I can see the token's logo. Thank you! (reply to 38476)

Ashwin: Hi guys, how can I use ton-connect to sign arbitrare plain text messages from the user's wallet?

M. Said: Hi everyone, I’m new to TON development. What do you think about the Func language? If I learn Tact, do I still need to learn Func? How mature is Tact?

Ashwin: Ahi guy (reply to 38507)

Ashwin: https://github.com/ton-connect/sdk/issues/172

Ashwin: Looks like there is absolutely no way sign messaged using the ton wallet

Ashwin: awesome

Sumit: Just use ed25519 signatures (reply to 38511)

Ashwin: I want the user to sign with their telegram-wallet (reply to 38513)

Ashwin: When users create a telegram wallet, they get a mnemonic seed phrase right?

Ashwin: regardless, how come users can't sign messages using a wallet. Regardless of if its centralized or not (reply to 38515)

Ashwin: yeah im not talking about Tonkeeper at all (reply to 38520)

Ashwin: Im talking about how it's almost impossible as a dev to requests arbitrary signatures from the user from an app

Ashwin: Okay thanks for that clarity. Is there a way to talk to smart-contracts with the Telegram wallet? Or that's a no as well?

Ashwin: So signatures are possible with the Telegram wallet? (reply to 38525)

Ashwin: Yeah I never mentioned Tonkeeper. But I got you. Thanks

Ashwin: It's truly a shame that we can't use Telegram wallet for everything TON related. It would be a true unlock to the web3 eco

Ashwin: Yeah it will be centralized. But there could be off-ramps to get to full self custody for those who need

Ashwin: Not sure if many would be interested in downloading a wallet

Ashwin: even if it's inside telegram

Ashwin: For my particular usecase, I just want the users to  a) make a smart-contract call via their "telegram-wallet" or b) sign an off-chain message approving an action

Ashwin: And what I learnt here is both are not possible

Ashwin: Unless I ask users to use a ton-keeper wallet

Ashwin: @bulkawithkoritsa just confirming (reply to 38538)

Ashwin: Gotchu! Thanks (reply to 38543)

mgnfy_view: Hello, are there any good DeFi tact codebases to study?

3827: how do i get my wallet api

— 2024-08-18 —

Anton: 🎉 Tact 1.4.4 has just landed on NPM!  Fixed a few bugs and added AST equality comparison API mostly for third-party tools, like the misti static smart-contract analyzer. The API also be used to compare contracts without taking into account whitespace, comments or even order of definitions and declarations.  More details as always can be found in the changelog.  — The Tact team  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Alexander: Unfortunately most of the TON DeFi projects are proprietary (i.e. closed source). As well developed with FunC (reply to 38547)

Anton: Have a look at https://github.com/henchtab/nenuma — the team behind it did a really great job, although that might not be of great relevance to you, I still think it’s worth to look at their contracts.  More DeFi contracts and libraries in Tact are going to be published later this year (reply to 38547)

Alexander: Opened a random tact file and saw that they are using nativeAcceptMessage in methods that are supposed to handle internal messages. Don’t think these are good examples (reply to 38560)

Alexander: With multiple “dump” calls around the codebase, and maybe other bad practices

Alexander: First t.me link from the readme isn’t working, and the entire project description looks like some sort of scam …

.: I have read the documentation about the message modes and gas. And I still not get it.   Let’s say I want to transfer ton(“1”) net from one contract to another I tried the  SendPayGasSeparately but I never get the full ton. What am I missing?

Anton: hmm, the folks behind this project were pretty active during the hackathon, and even wrote and released a logger for tests: https://github.com/henchtab/shrek (reply to 38563)

Anton: this is fine as long as the compiler removes those during release compilation (reply to 38562)

Anton: thanks for pointing this out, things like that are going to be reported as compiler errors in future releases (reply to 38561)

Alexander: I don't think it should be reported as an error or warning. It’s totally normal to invoke things like “ACCEPT” within the internal message if you know what you’re doing. But in most cases new devs mess with that and at the result it leads to major security issues (reply to 38568)

Alexander: Didn’t know that, nice feature 👍 (reply to 38567)

mgnfy_view: I looked at some FunC code and it's a big pain ngl (reply to 38558)

mgnfy_view: I think for any development on TON I would prefer tact

mgnfy_view: I know the basics, I just need to read some professionally written DeFi codebases to get started quickly

mgnfy_view: Is there a large demand for DeFi on TON?

Anton: There is, yes. The area is underdeveloped at the moment (reply to 38575)

Ashwin: Hi guys! Still trying to learn how I can use any tonconnect wallets to get signatures from users. It's very hard to understand why something so trivial is so difficult @AntonTrunov @agapak

Nikita: Hi guys! Is there any way of creating gas report for contract/tests? As well as in foundry, if someone is familiar with it:   forge test --match-test testBurn --gas-report

Anton: Does this help? https://docs.tact-lang.org/book/debug#tests-fees (reply to 38586)

Nikita: yep, looks like that, thanks a lot again for your help (reply to 38587)

Mr. Badihi: Anyone here have some experience with TonTools (python) I’m getting weird exception which solves by a sleep but on tests it works without this sleep

Alexander: What kind of platform are you  on? Did you tried following this guide https://github.com/ton-connect/sdk/tree/main/packages/sdk ? (reply to 38581)

Tiqan: Hey guys, how do I calculate Map Storage Fees? And Storage and Transaction Fees in general

Dmitry: Hello! Is it possible to deploy contracts written in FunC from contracts written in Tact?

Alexander: Yes, just send a message with code and data (StateInit) (reply to 38614)

— 2024-08-19 —

Alexander: https://docs.ton.org/develop/howto/fees-low-level#storage-fee (reply to 38606)

Laisky: I am a newcomer to TON/tact and would like to ask a question. If I want to send a lot of messages at the lowest possible cost and the recipient will not return the remaining value, how should I set the value of each message?  ---  My current idea is to deploy my contract to all receivers, and all of these contracts will refund the remaining value in the message through SendRemainingValue.

Howard: Hello I am a student studying about TON chain and I have one question regarding account creation on -1 (master chain). It is mentioned in the document that account created in master chain are treated as invalid unless the masterchain option in the configuration file is set to true.  I am wondering  1. what is wrong with creating account in masterchain? 2. why would someone create account in master chain? 3. can account in master chain has security risks?

Mirodil O: on what purpose counter is used ?  What is actually counter, do we need it ?

c9 👨‍🍳: Gm fam , anyone know any service or source code for batch transfer with Ton and Jetton

Mikhail: check highload_wallet (reply to 38628)

Mikhail: https://docs.ton.org/participate/wallets/contracts#highload-wallet-v3 (reply to 38628)

c9 👨‍🍳: Oh ty so much sir

Alexander: Hi guys, could anyone please suggest how to send array of structs in a message from  the client side (and then parse them in the smart contract)? I can see in the wrapper a function that converts one struct to a cell, but what if I need to send multiple ones?

Eldar 🧬: Hello everyone,  I'm using this example to create a token, but I'm still not sure how everything works. Could you please take a look at this transaction: https://testnet.tonviewer.com/kQDm4O2WyFfctjA9LrrWje4NDp4gy21IhoMS5AuE9YoiTyAo? Why is the metadata empty? What needs to be done to fix this?  Also, am I creating the token correctly? Is this the standard?

Eldar 🧬: Perhaps you have the code for creating a token, specifying its ticker, etc. I would be grateful!

Nikita: Hi! Perhaps someone faced with an issue that jetton written in tact is not recognized by tonviewer in testnet? All signatures are the same as in documentation

Rajesh: Okay

Alexey: Does anyone know why Jetton Notfication breaks?? example https://tonviewer.com/transaction/1acd3f5942fe81e8d4afb356b2f941483e9dc75fc8c933bfb0190a5069e81eb9

Alexey: in this transaction notification is 0x7362d09c

Alexey: And it is not showed on TonKeeper

Alexey: but here, with same opcode is all right https://tonviewer.com/transaction/e7fe1e7646278d1a7c5c773f6322cc0772e11b83b0faa1d23cc43b5d9805669b

Alexey: data no changed

Alexey: why is broke?

Eldar 🧬: Could you please send an example of deploying Jetton code with correct metadata?

Alexey: yes

Alexey: all source ?

Eldar 🧬: Yes, if possible, please.   I’m having trouble uploading the correct metadata, and there might also be something wrong with the source code. (reply to 38657)

Alexey: trouble in that message              send(SendParameters{                 to: dev_wallet_address,                  value: ton00888,                 mode: SendPayGasSeparately,                 bounce: false,                 body: TokenTransferInternal{                      query_id: 888,                     amount: percent5,                     from: self.owner,                     response_destination: msg.response_destination,                     forward_ton_amount: ton("0.000000001"),                     forward_payload: emptySlice(),                 }.toCell(),             });

Alexey: or not ?

Alexey: I dont change them

Alexey: but token notification is broke

Alexey:   const jettonParams = {         name: "Chapa",         description: "",          symbol: "CHPA",         image: "https://ipfs.io/ipfs/QmTChDStMuZqVGjqpRViQDhRNQgHv6unDgzAFZ7GekyALa",       };            let content = buildOnchainMetadata(jettonParams);       let max_supply = toNano(100000000);             const simpleJetton = provider.open(await BalancerCoin.fromInit(provider.sender().address!, content));

Alexey: correct metadata

Alexey: but desription must be non empty

Alexey: helper file

Alexey: for buildOnchainMetadata

Vladimir: /report (reply to 38671)

^_^: /report (reply to 38671)

^_^: Everyone, this is scam site (reply to 38671)

^_^: don't click connect wallet button. If you click, your money will be gone!

Renat: Hi, Anton, could you please help with very simple question, where can I get a tact repository for current modern version of jetton, I'm new on TON and watched a lot of tutorials, but everythere i can find only simple example of Jetton contract, and Im not sure if I will use it, can I use it to create Jetton and trade it on dexes? (reply to 38587)

— 2024-08-20 —

Laisky: If I know a wallet contract's interface but not its code, can I interact with that contract using the Blueprint provider? For instance, if the contract has a method get fun info(): WalletInfo, can I directly request this method by its address in Blueprint?

Johnny Le: yes sure (reply to 38691)

Laisky: Thanks. I found the problem. I previously thought that initOf was the deployment, but it's actually not; it's just a local compilation. It is also necessary to send the code and data to the specified address. (reply to 38693)

Dmitry: is it intentional... like x2?

Mr. Badihi: Testnet down?

Дмитрий: Hi all. can someone tell me how to fix this error? I'm sending a token burn message

Dmitry: some integer overflow. you need to send code snippets

Maxim: Maybe this could be the reason Skip Reason: cskip_no_gas (reply to 38649)

Дмитрий: Is 10^29 a lot? (reply to 38733)

Дмитрий: You should set the forward_amount parameter to ~0.01 ton (reply to 38649)

Дмитрий: Use TonConnect   For example https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer-1

Illia: depends on how much bits you allocate; if you allocate 256 bits, then it's fine, if just 8 bits, then it's definitely not enough (reply to 38739)

Alexey: Thanks for reply, i found reason, need to send no emptySlice, but emptySlice with is_right flag in forward payload (reply to 38741)

Illia: it may be a better strategy to ask your question there; someone may answer it or give a hint where to find an answer (reply to 38734)

Дмитрий: I use Int type  x: Int = ton(“100”) * ton(“1.000.000.000”) (reply to 38742)

Дмитрий: Maybe I should use uint256 type?

Maxim: Hello guys! Does anyone know how to set minimum mandatory TON amount for TokenTransfer (0xf8a7ea5) transaction? When I send 0.7 TON via sandbox everything works great, but Tonkeeper sets the amount to ~0.20-0.35 and the transaction fails due to insufficient funds.

Illia: 'there' is TON Tact Language Chat (reply to 38749)

Illia: very interesting syntax; try simply write x: Int = ton("100000000000");  100% this code would not compile on tact <= 1.4.0 'cause i was trying to multiply constants as well and it didn't work well (reply to 38747)

Дмитрий: But it work       n: Int = ton("1000000000"); d: Int = ton("100"); m: Int = 0;  init() {     self.m = self.n * self.d;   } (reply to 38756)

Illia: this code and the line x: Int = ton(“100”) * ton(“1.000.000.000”) are completely different codes in terms of compilation (reply to 38757)

Дмитрий: it works, but self.m / self.n doesn’t work (reply to 38758)

Rodion: brother, please forgive me, I didn't read the correspondence above, but if you need to make nanotones in tone, then the best thing would be: nanoTon / 1_000_000_000

Rodion: This is how I got the tones

Дмитрий: This is not my goal. Moreover, there is no float type in tact

Renat: @AntonTrunov Hi, I already asked, but no response. situation is, I want to launch Jetton for my game and trade it on DEX, can you please provide TACT code for modern Jetton contract? In every tutorial I wathched, devs using simplified version for TACT Jetton contract, only good modern contract I have found written in func, If we can't use TACT for deploy MAJOR contract like Jetton or NFT (accepted by getgems) why we need TACT at all?

Maxim: What do you mean, by saying only good modern contract written in FunC? (reply to 38779)

Renat: Or at least can you please provide step by step tutorial how to build Dapp using mix, Jetton contract written on Func and other on TAct

Renat: I mean all TACT contract written 1 year ago and noone telling it is full implementation of Jetton, if you have it can you please provide link to repository? (reply to 38780)

Renat: in other words we have TEPs, and it will be very helpfull for newbies like me to provide implementations written in TACT

Maxim: This one should be absolutely complete for deployment, as I know. https://github.com/howardpen9/jetton-implementation-in-tact

Renat: EXCELLENT, why we don't have it on TACT lang website?

Maxim: https://tact-by-example.org/07-jetton-standard (reply to 38788)

Maxim: Here you can find good manual

Denis: Hello! After deploying jetton from factory contract all remaining value sent back to the factory(leaving 0 TON for storage on jetton). How can i fix it?

Maxim: Try this: ,value  : ton("0.01") ,mode  : SendPayGasSeparately (reply to 38792)

Denis: This mode change nothing in this case unfortunately (reply to 38796)

Maxim: In this case all remaining TON should be left on contract balance (reply to 38797)

Denis: It's strange, but after put this mode back(ctrl+z) and rebuild i have another flow... Maybe that was some build problem when i try it last time. Ty (reply to 38798)

— 2024-08-21 —

groue_juice: When i try to build sample ton jetton contract, I got this error

groue_juice: Anyone know why?

Anton: it’s a type error, just remove this check (reply to 38818)

groue_juice: how can I remove it?

groue_juice: Is anything i missed?

Maxim: just delete line 226 and closing line as well (reply to 38822)

Dmitry: What's your idea? (reply to 38747)

Dmitry: As far as i get it ton() multiplies argument by 10^smth. Do you really need 10^(smth*2)

Dmitry: Uint256 has less bits then Int (int257). But their max positive number is the same... So no reason to do that (reply to 38748)

Dmitry: Also if it is not a state var its bitsize can not be controlled

Дмитрий: Mechanics similar to DEX. x * y = k (reply to 38833)

Dmitry: If that's the case you don't need ton() (reply to 38882)

Дмитрий: Why? (reply to 38884)

Dmitry: I think that's more productive for you to tell why you should (reply to 38885)

Дмитрий: I have reserves on contract (x and y) where x- TON, y - jetton. And they have 9 decimal places (reply to 38886)

Dmitry: You dont need to look at decimals in this scenario (reply to 38882)

Dmitry: Decimals are for ux on frontend or smth

Dmitry: All mathematics is applied to amount per se

Дмитрий: If I discard the decimals, then the accuracy will be low

Dmitry: Which operation makes it low?

Дмитрий: If you discard the decimal places, the calculations will not be accurate. For example 1.12 * 102.371 != 1 * 102

Dmitry: You got no decimal places if you store it in int as a minimal value   For "everyday currencies" you would have smth like  $: Amount=1000 Decimals=2  => You have 10.00$

Dmitry: Open up jetton standard/erc20

Dmitry: If your 1.12 has 9 decimals it would be stored as 11_2000_0000 (reply to 38893)

Dmitry: You have no "1.12" in your smart contract

Дмитрий: I know. 1120 and 102371 if we have 3 decimals (reply to 38897)

Dmitry: Your reserve will always be with no decimals. Decimals are stored alongside and the are only needed for rendering on end devices

Дмитрий: I don’t understand how can I use it (reply to 38894)

Tom - Bushi: is there a function to estimate how much gas has to be sent for the full transaction to complete? along with any TON left for storage fees?

TMT: Hello everyone, how can you interact with a smart contract? on the frontend? I have seen many examples where a lot of code is pulled to the front end in order to implement the contract. for example, they build smart contract code next to the front-end project but what if there is no smart contract build file, there is only abi how to work with this?

......: anybody knows the maxmium size limit for the ton transation?

GANDI: Can you help me with assembling a message? I can't find storeAddress(null) in Tact. Cell = beginCell()             .storeUint(0, 32) // deadline             .storeAddress(null)             .storeAddress(null)             .storeBool(false)             .storeBool(false)              .endCell();

GANDI: I figured it out. This might be helpful for someone else. .storeAddress(null)   to   .storeUint(0, 256)

Vladislav: Hi, I got error if trying to make multiple mint of jetton token to multiple users in one message call, do you know why?  It works only if mint to one user

GANDI: As far as I understand, these are the specifics of TON. There's typically a 30-40 second delay between transactions, and you can't send another one immediately after.

GANDI: It's necessary to send one message and then loop it. This is a simple example and requires further refinement.

Abhishek: I have bought magnets media youtube course  If any buddy need let me know

GANDI: This is one of the examples. It needs further refinement, but it's a clear demonstration. Additionally, it's necessary to calculate the commission.  + "ctx.readForwardFee() * 3"

Юра: Hello! Please help me! I have jetton on my smart contract, how can I send it from a smart contract to another address?

Arman: Hi everyone, I want to ask if you have a workaround for such cases to avoid error. Even though I have check before using event.something editor still complains that event  could be null and build also crashes.

Александр: use event!!.ticketPrice (reply to 38935)

Arman: it works thank you!!

Arman: do you think there is a chance to have a problem with types in my code therefore I face that error? I'm not sure if compiler/editor/extension whether understand or no that I've checked in require the truthiness of the event

— 2024-08-22 —

0xtitn: Who knows how to generate a function ID in TACT?

Laisky: If I emitted a struct message in a contract, and I would like to know how to retrieve this message off-chain. I found this document ( https://docs.tact-lang.org/book/debug#logging-parsing ), but it doesn't explain how to retrieve the externals.body from the transaction.  for example, At the bottom of this page, there's an external-out message, which I suspect is the log emitted from my contract. How can I access this body through the client?  https://testnet.tonviewer.com/transaction/762b50a6f6ddaec63d2b9592fc3b560bffb091c70ab1a2ad638461af5c886523  btw, the struct of message is  message WalletManifestChangedEvent {     oldManifestUrl: String;     newManifestUrl: String; } ---------------------------- I found the solution  get trace from https://testnet.tonapi.io/v2/traces/<TX_ID>,   curl -s https://testnet.tonapi.io/v2/traces/db96ca304b4126371b15db4ba4f64f8e7bcbffec8581c019abafc16b2eae9733 | jq '.children[-1].children[-1].transaction.out_msgs[-1].raw_body'  then  const hexmsg = 'b5ee9c7201010201003c000208ae59284b0101006468747470733a2f2f6172696f2e6c6169736b792e636f6d2f616c6961732f6174746573742d6d616e69666573742e6a736f6e';  const cells = Cell.fromBoc(Buffer.from(hexmsg, 'hex')); const msg = loadWalletManifestChangedEvent(cells[0].asSlice());  console.log(`oldManifestUrl: ${msg.oldManifestUrl}`); console.log(`newManifestUrl: ${msg.newManifestUrl}`);

GANDI: = event!!.ticketPrice (reply to 38934)

Laisky: When using the internal messaging feature of @ton/core, the returned promise is null. Is there a way to retrieve the transaction ID for this message?

Dmitry: Hi! Is there a way to redeploy contract using same code and initial state?

P.H | Skate: Hi, is there any example of tact NFT contracts available?   I can't seem to get the NFT implemented in tact recognized by explorer (tonviewer/toncenter)

P.H | Skate: state and initial code determines the contract address. Maybe you should try adding a deployment nonce as storage variable of your contract (reply to 38967)

Georgiy: 🎉 Misti 0.2 has just landed on NPM!  🔍 Five New Tact Detectors: Сonstant Address, Branch Duplicate, `dump` Is Used, Field Initialized Twice, Prefer Augmented Assignment.  🛠 Blueprint Support: Introducing the new Blueprint Plugin.  🔧 Fixes & Enhancements: More configuration options and various fixes. Check out the full changelog.  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Max: Hi everyone!  Is it possible to handle transfers of several different jettons in a single transaction?  For instance, can a user send a pair of USDT and another token in a single transaction? And is it possible to handle such cases in a smart contract?

P.H | Skate: I think you can create an intermediate contracts that is the owner of two jettons. Then an user owns this contract.  An in message to this contract would transfer the 2 jettons.

Tom - Bushi: I am sending a struct as a cell in a message. How can I access this struct in the receiving contract?   let data = StructName.fromCell(msg.structAsCell); gives a syntax error though its in the docs.   When I put the type after data it is unable to resolve the struct id after the =, even though it finds the assigned type

Anton: what Tact version are you using? try upgrading to Tact v1.4.4 (reply to 38982)

Tom - Bushi: I was using blueprint 0.21.0, bumping to 0.22.0 hasnt helped. Would separately adding @tact-lang/compiler, which I see is on 1.4.0, be an issue? (reply to 38983)

— 2024-08-23 —

TMT: what does 709 error mean? I'm making a transfer on the test network

Anton: not enough native toncoins to pay for the transaction, if i recall correctly (reply to 39000)

TMT: hmm, very strange (reply to 39001)

Александр: value should be more than forward amount (reply to 38999)

Александр: If it equal it couldn't sent forward message

TMT: Wow. it works. Thank you (reply to 39003)

TMT: Can I get the child's address?  I want to calculate the child's address if I know the parent's address  I want to get this address on the client application and not make many requests to the network      const childAddress = await parentMasterContract?.getStakeAddress(       Address.parse(wallet),       BigInt(1) // tariff Id 1 | 2 | 3 | 4     ) I see many examples doing just that. are there other ways to do this? I don’t want to make 4 requests because I have 4 ID plans

Dmitry: You can get address from "init" as you do in contract (reply to 39008)

TMT: do you mean do it like this, parentContract.init(someData) ? (reply to 39009)

TMT: oh sorry. I saw. childContract.init( OK. lol I'll try it now (reply to 39010)

Dmitry: not like that

TMT: (method) ChildContract.init(parent: Address, owner: Address, tariff: bigint): Promise<{     code: Cell;     data: Cell; }> this also returns a promise. I would like not to make requests sorry I can't understand (reply to 39009)

TMT: set an example. I can't find it on Google

Dmitry: promise can be a request to read code from disk, and not from blockchain.

Dmitry: you need code to create init

Dmitry: i did it in the context of blueprint testing... so yours CAN be right as well (reply to 39012)

Dmitry: > await Contract.fromInit(...)  yes you were right writing this (reply to 39013)

Dmitry: dont worry about a promise

Dmitry: static async fromInit(id: bigint) {         const init = await TestContract_init(id);         const address = contractAddress(0, init);         return new TestContract(address, init); }   async function TestContract_init(id: bigint) {     const __code = Cell.fromBase64('te6ccgECFQEAAsQAART/APSkE/S88sgLAQIBYgIDApzQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxa2zzy4ILI+EMBzH8BygBZAssfyx/J7VQQBAIBWAkKA+ABkjB/4HAh10nCH5UwINcLH94gghCLNBgiuo8gMNMfAYIQizQYIrry4IHTP9MfWWwSMaCI+EIBcG3bPH/gghCUapi2uo6n0x8BghCUapi2uvLggdM/ATHIAYIQr/kPV1jLH8s/yfhCAXBt2zx/4DBwBQYGABgAAAAAQ2FzaGJhY2sBOm1tIm6zmVsgbvLQgG8iAZEy4hAkcAMEgEJQI9s8BwHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAIAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAgEgCwwCAUgTFAIBbg0OALm3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHBOA3qTvfKost446np7wKs4ZNBOE7Lpy1Zp2W5nQdLNsozdFJACEKoY2zzbPGwhEA8CEKmQ2zzbPGwhEBEAAiABUO1E0NQB+GPSAAGX0x/TH1lsEuD4KNcLCoMJuvLgiYEBAdcAAQHR2zwSAAIhAAJwABGwr7tRNDSAAGAAdbJu40NWlwZnM6Ly9RbWQyWnVxNkxGRzg5S3pSNzl4QjRYTWgzUlZxUW94eWFlUzlhdWV4ZXNkNlVTgg');     const __system = Cell.fromBase64('te6cckECFwEAAs4AAQHAAQEFoey9AgEU/wD0pBP0vPLICwMCAWIECgKc0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8Wts88uCCyPhDAcx/AcoAWQLLH8sfye1UEAUD4AGSMH/gcCHXScIflTAg1wsf3iCCEIs0GCK6jyAw0x8BghCLNBgiuvLggdM/0x9ZbBIxoIj4QgFwbds8f+CCEJRqmLa6jqfTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J+EIBcG3bPH/gMHAGBwcAGAAAAABDYXNoYmFjawE6bW0ibrOZWyBu8tCAbyIBkTLiECRwAwSAQlAj2zwIAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7AAkAmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwCAVgLFAIBIAwTAgFuDQ8CEKoY2zzbPGwhEA4AAiACEKmQ2zzbPGwhEBIBUO1E0NQB+GPSAAGX0x/TH1lsEuD4KNcLCoMJuvLgiYEBAdcAAQHR2zwRAAJwAAIhALm3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHBOA3qTvfKost446np7wKs4ZNBOE7Lpy1Zp2W5nQdLNsozdFJACAUgVFgARsK+7UTQ0gABgAHWybuNDVpcGZzOi8vUW1kMlp1cTZMRkc4OUt6Ujc5eEI0WE1oM1JWcVFveHlhZVM5YXVleGVzZDZVU4INm7Rp8=');     let builder = beginCell();     builder.storeRef(__system);     builder.storeUint(0, 1);     initTestContract_init_args({ $$type: 'TestContract_init_args', id })(builder);     const __data = builder.endCell();     return { code: __code, data: __data }; }

Dmitry: as far as i can see it doesnt even need to be async

Khim: i dev from ethereum came to this ton evir

Khim: hi guys

Khim: can i ask some question?

Illia: you're more than welcome (reply to 39026)

Khim: so i begin to write my first simple contract with tact and really confused with this deploy file:      let testnet = true;     let packageName = "sample_SampleTactContract.pkg";     let owner = Address.parse("0QDVod6k6pyXPsEHb76UwH_Ny44GhTD7H0Lg4vOu69nzL7v9");     let init = await SampleTactContract.init(owner);      // Load required data     let address = contractAddress(0, init);     let data = init.data.toBoc();     let pkg = fs.readFileSync(path.resolve(__dirname, "output", packageName));

Khim: any document explain that what does the contract get the deployer address??

Khim: i dont think that is the var "owner"

Urban: Can someone explain what am doing wrong here? Im trying to handle JettonTransferNotification messages inside my contract, but nothing happens (on testnet anyway). The expected result would be that the usdt_balance would be / msg.amount. However when calling the getter function its still 0. Is this a testnet thing or am I doing something really wrong?  import "@stdlib/deploy"; import "@stdlib/ownable";  //********************************************// //                  Messages                  // //********************************************//   message(0x7362d09c) JettonNotify {     queryId: Int as uint64;     amount: Int as coins;     sender: Address;     forward_payload: Slice as remaining; }  message WithdrawJetton {     queryId: Int as uint64;     amount: Int as coins; }  contract TestWallet with Deployable, Ownable {     owner: Address;     usdt_master_address: Address;     usdt_balance: Int as coins = 0;     init(usdt_master_address: Address){         self.usdt_master_address = usdt_master_address;         self.owner = sender();     }      // Implement JettonTransferNotification message handler     receive(msg: JettonNotify){         // Add usdt validation logic here e.g.         // if(sender() != self.usdt_master_address) revert();         self.usdt_balance = self.usdt_balance + msg.amount;         emit("Jetton balance has been topped up".asComment());     }      // Implement WithdrawUsdt message handler     receive(msg: WithdrawJetton){         ...     }      //*********************************//     //             Getters             //     //*********************************//      get fun get_usdt_master_address(): Address {         return self.usdt_master_address;     }      get fun get_usdt_balance(): Int {         return self.usdt_balance;     } }

hΔrdshell: trying to login with firebase in my Telegram web app and it just loads forever doesnt go back to the TWAP

NearWormHole ▪️ 🐾: Gm fellow

Marcus: Hello. How can i use Nodejs server to call receive() func in Tact contract? any example?

X Era Space 🦴 🍅▪️ 🐾 🐶: please what is error code 132 in TON

X Era Space 🦴 🍅▪️ 🐾 🐶: 132 in TON explorer how can i solve it

X Era Space 🦴 🍅▪️ 🐾 🐶: these are my .tact codes including messages.tact, nftItem.tact and parent contract

X Era Space 🦴 🍅▪️ 🐾 🐶: message(0x5fcc3d14) Transfer {   // message Transfer {       query_id: Int as uint64;                  new_owner: Address;       // response_destination: Address;       // custom_payload: Cell?;       // forward_amount: Int as coins;       // forward_payload: Slice as remaining;   }    message(0x05138d91) OwnershipAssigned{      query_id: Int as uint64;      prev_owner: Address;      forward_payload: Slice as remaining;   }    message(0xd53276db) Excesses {      query_id: Int as uint64;  }    message(0x2fcb26a2) GetStaticData {       query_id: Int as uint64;  }    message(0x8b771735) ReportStaticData{      query_id: Int as uint64;      index_id: Int;      collection: Address;  }    struct RoyaltyParams {      numerator: Int;      denominator: Int;      destination: Address;  }    struct CollectionData {      next_item_index: Int;      collection_content: Cell;      owner_address: Address;  }    struct nftItemData {       owner: Address;      collection_address: Address;       item_index: Int;      individual_content: Cell;      is_initialized: Bool;   }      struct CollectionMetadata {     image: String;   //"https://ton.org/_next/static/media/smart-challenge1.7210ca54.png",     name:  String;   //"TON Smart Challenge #2",     description: String;   //"TON Smart Challenge #2 Winners Trophy",     socialLinks: Cell ;  }

Дмитрий: Access denied — someone other than the owner sent a message to the contract (reply to 39038)

Дмитрий: https://docs.tact-lang.org/book/exit-codes

NearWormHole ▪️ 🐾: I’m banned from sending messages (reply to 39043)

NearWormHole ▪️ 🐾: That is what @Aixeraspace sent me in dm

Nostra: Hey guys has anyone a template how to write the standard nft transfer method in tact for a getgems nft collection ?

Urban: The message (TokenNotification) does not even register. In fact it gets skipped on-chain: https://testnet.tonviewer.com/transaction/ccadeb75d238988a380eb08d7411793d9cd34579f290beed7480c7102891590f (cskio_no_gas). I try and transfer these with forward_amount as well but it's the same result: e.g.: https://app.tonkeeper.com/transfer/EQAuazI2Sz2U75XY9608OHn_GX7Y6t740hD0avck-t1ewNln?jetton=kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy&amount=1000000&fee-amount=100000000&forward-amount=20000000&text=Tests (reply to 39031)

Александр: its probably error with this link cause it does not accept forward ton amount (reply to 39052)

Александр: is this working? I thought you cannot use sender in init (reply to 39031)

Urban: Works both in tests and testnet ->https://testnet.tonviewer.com/kQAuazI2Sz2U75XY9608OHn_GX7Y6t740hD0avck-t1ewGLt

Urban: hmm.. ok strange, did work on 2 tonkeeper wallets, but maybe I'm a snowflake here. Do you have any suggestions on how to better test/generate this transaction? Also not sure how to better test this locally. Right now I use this:  it('should top up usdt balance', async () => {         const jettonNotifyWalletResponse = await testWallet.send(             deployer.getSender(),             {                 value: toNano('0.05'),             },             {                 $$type: 'JettonNotify',                 queryId: 0n,                 amount: 10n,                 sender: customer.address,                 forward_payload: Cell.EMPTY.asSlice()             }         );          expect(jettonNotifyWalletResponse.transactions).toHaveTransaction({             from: deployer.address,             to: testWallet.address,             success: true,         });          const usdtBalance = await testWallet.getGetUsdtBalance();         expect(usdtBalance).toBe(10n);     }); (reply to 39053)

Александр: you could try just use testnet wallet seed phrase and try to send this transaction with forward_amount provided programmaticly

Александр: im pretty sure it is an error with deeplink

thebatclaudio: Hello! I'm trying to deploy an nft collection on testnet, but on tonscan I see that "Contract Type" is "Unknown". I think that I'm writing the offchain content url in a wrong way, but I don't know how to debug.  So I'm asking: - Do you know how can I debug a deployed contract to read the content? (in this case, I need to check if my content url is the right one) - Do you have any other suggestions to debug deployed contracts?   Thank you!

Tom - Bushi: if I have to perform X messages between contracts and their order doesnt matter, is there any benefit to sending them out all at once over making a chain where one message and response triggers another?

Illia: from my experience, if you have a message that bounces for some reason, it will be easier to revert the changes if you have a smaller chain of transactions  e.g.  the chain: A -> B -> C -> D -> E  E bounces message, now D reverts changes and sends to C to revert changes, then C reverts and sends to B, etc.  if you have a chain like A -> E, then E bounces and A simply reverts changes  if you don't handle bounces, then it doesn't matter, but it's strongly recommended that you handle all bounces (reply to 39060)

Tom - Bushi: in my case it would be A->B -> A -> C -> A -> ... etc so I take it I can run them in parallel and it wont be some kind of anti-pattern? (reply to 39061)

Illia: i haven't seen real-world applications for this case  your contract can sand a maximum of 255 actions per one contract call  if you have <= 255 actions (send_raw_message = 1 action)  then i would just loop over them and send all the messages in one transaction  if you have more transactions, then it may have sense to sort of recursively transfer transactions;  whats you case (reply to 39062)

Tom - Bushi: dont think Ill be going over 255, but Ill see if I can make the chain just in case. Thanks for answering bud (reply to 39063)

Zeinu Ahmed: Illia malovanyi

Zeinu Ahmed: If you hav more transactions thenit

Obakeng: Hi, flow. (reply to 39073)

mx: Does anyone here in the group have a simple token code that can be deployed using Nujan without issues?

cubby: Hello. Is anyone looking for a blockchain engineer?

David: hi

David: guys

David: is Tact usable in prodaction?

David: or it is just an concept now?

Fardin: Hello As u know we could send JettonTransferNotification to any contract with our custom forward_payload. So how could we define the message (transaction) sent by our specified jetton wallet and related to our Jetton Master contract?  Looking for a kind of secure jetton receive method.  message(0x7362d09c) JettonTransferNotification {     query_id: Int as uint64;                // arbitrary request number     amount: Int as coins;                   // amount of jettons to transfer     sender: Address;                        // address of the sender of the jettons     forward_payload: Slice as remaining;    // optional custom payload }

— 2024-08-24 —

Cyril M |: is it possible to modify the default JettonDefaultWallet contract to add addtional custom function?

Cyril M |: does anyone knows the solution? when I compile tact contract using blueprint, it's not producing .ts wrapper

Cyril M |: anyone knows how to reproduce 1000^0.2 in tact?

Cyril M |: since floating point is not supported in tact

Anton: You need to use a fixed-point library. Either write your own or write bindings to mathlib.fc (reply to 39103)

Cyril M |: can this be used in tact? (reply to 39106)

Cyril M |: okay, it can be imported.

Cyril M |: anyway, the function will be used for pow?

Cyril M |: how can I produce 1000*0.2?

Cyril M |: i have imported mathlib.fc (reply to 39106)

Anton: There are no floating point literals in Tact and btw neither in FunC, so you need to look at the doc comments in mathlib.fc to understand the number format it can work with (reply to 39110)

Cyril M |: i have read the library, how can I import the exponential 0.2 or 1/5?

Nick: Hey Anton, did you say something or delete it? You can DM if needed

Hung: Hi Guys, Can I generate a random string using tact ? I searched on Tact  document but only have random the numbers

Alexander: Why do you need a string? (reply to 39116)

Alexander: You can choose symbols from the ascii table using random numbers

Hung: I want to create tickets where each ticket has a unique string (reply to 39117)

Alexander: Do you really need this string to be generated on chain? You can just keep a number, and off chain convert it into a string (reply to 39119)

Hung: Yes, I want to create it on-chain to be more transparent (reply to 39121)

Alexander: . (reply to 39118)

hΔrdshell: who do we even talk to for help with TON mini apps?

Cyril M |: how do you verify a tac contract?

Дмитрий: Try to use @interface(…) (reply to 39059)

Дмитрий: https://docs.tact-lang.org/book/contracts#interfaces

Дмитрий: If you want to get contract’s Jetton wallet- send ProvideWalletAddress message to master. Then master will send TakeWalletAddress message back to your contract (reply to 39093)

User<6623141573>: Bro i was hoping to learn tact.  Any suggestion?

Fardin: Alright  Do you have a sample code? (reply to 39144)

Дмитрий: Please, wait about 20 minutes (reply to 39146)

hΔrdshell: https://stackoverflow.com/questions/78612568/how-do-i-use-firebase-sign-in-providers-google-oauth-and-apple-oauth-inside-my

hΔrdshell: anyone have an answer?

Arman: Hi guys, what error code I can expect in my test when my require() condition is not met in the contract

Arman: or there is a better way to test problematic cases

Arman: from logs found 13955 as the exit code for require() statement

Дмитрий: Something like this (reply to 39146)

Дмитрий: Messages

Fardin: With this code we could take the jetton wallet address of our contract right? Then for the next jetton transfers the wallet address had to be same as this returned data from jetton_master contract (reply to 39156)

Itsu: Hi

Afzal: Hai

Sumit: What does an error code 88 mean in a jetton wallet?

hΔrdshell: anyone (reply to 39148)

Ton_M🎓: Who is core developer of Tact?

3827: hi can someone tell mr how to get a ton wallet api

Ak: Hi Guys, looking for experienced senior developers for our telegram game. We already have the game live and working on Multiplayer Feature. If you are looking for a job DM me

— 2024-08-25 —

hΔrdshell: pulling my hair out for 3 days trying to get some kind of auth to work for telegram mini apps with vite

TMT:   async getGetWalletAddress(provider: ContractProvider, owner: Address) {     let builder = new TupleBuilder()     builder.writeAddress(owner)     let source = (await provider.get('get_wallet_address', builder.build()))       .stack     let result = source.readAddress()     return result   }  Hy. blueprint generated my jetton master interface this method getGetWalletAddress Is it possible to obtain address data locally, without using a provider? (reply to 39020)

Dmitry: It is local

Дмитрий: Hello. how can i return Address type from get fun like this?

Дмитрий: When I use the owner function it does not return an address

David: Okay

Max: Hey guys  I’m trying to send a message from a child contract back to its parent, but I’m getting a 135 exit code (Code of a contract was not found — false flag for a dictionary call). What can be the reason?   contract ChildContract with Deployable {  parent: Address;  seqno: Int as uint64;    init (parent: Address, seqno: Int) {   self.parent = parent;   self.seqno = seqno;  }    receive(msg: CallParent) {   let msgToParent = MessageToParent { data: "testdata" };      send(SendParameters{    to: self.parent,    value: ton("0.1"),    mode: SendIgnoreErrors,    body: msgToParent.toCell()   }); // this causes the 135 error   } }

Дмитрий: How do you deploy the child contract? (reply to 39224)

Дмитрий: Maybe you missed code and data parameters

Max: I think the problem was that I was using tact 1.4.0, and the init function from my actual code had a StateInit as a param, which causes the bug in 1.4.0 and was fixed in 1.4.1  Will try it with 1.4.4 now

3827: hi i need someone that can develop a program based on ton, using wallet apis and telegram bots

— 2024-08-26 —

TMT: did you find the solution? (reply to 38905)

Sofi: Study the sandbox docs (reply to 39245)

Baldwin: Does stonfi have a testnet version?

mgnfy_view: How do you interact with stonfi using tact?

mgnfy_view: I want to add liquidity

mgnfy_view: Stored in my contract

yash: looking for someone who can write smart contracts on funcc, please dm, it's a paid gig

Tom - Bushi: nope (reply to 39245)

NearWormHole ▪️ 🐾: Yo DM (reply to 39252)

NearWormHole ▪️ 🐾: Over 18 (reply to 39257)

hate crab 🦀: 19 (reply to 39257)

Broki: hey guys

Broki: is there any TacT documentation out there that I can learn from please

Broki: not much 🙁

Rahul: https://docs.tact-lang.org/  https://tact-by-example.org/ (reply to 39265)

Broki: thaks man I already went thorugh them (reply to 39270)

Khim: can u guys help with this syntax error pls

Anton: rename map to something else (reply to 39277)

Khim: it fixed thanks u a alot

Cyril M |: how do you verify tact contracts?

Nerses: How can I pass a signature as an argument to a function in a TON blockchain smart contract and verify it within the function to conditionally allow certain operations based on the validity of the signature?

Nikita: Hi everyone, did some use this plugin for blueprint?  https://github.com/1IxI1/blueprint-scaffold  I get next errors in console after build and run, perhaps someone faced with same issue

Georgiy: What about the first error messages? I suppose, the problem is in scaffold itself (reply to 39288)

Nikita: I think so, cause I did not performed any action after installation and generating UI for wrappers. That's why I ask, perhaps someone faced with same errors (reply to 39289)

Georgiy: I mean, it worked when I used it, so it might be a problem with your environment or project. However, I would need the complete error output to understand this. (reply to 39290)

Nikita: Oh, got you. Perhaps problem comes from Windows, I saw similar issues in GH, but I tried to rebuild and run with WSL and got same result. The screen I sent that's all I have for errors — no errors in build/run stage. (reply to 39291)

0xtitn: is there any dex source using tact?

David: Hi guys

David: i have some question about ton connect

David: thhere is some way to call contract getter function

David: like we do using blueprint

Cyril M |: what does exitCode: 51754 mean?

Anton: check it in the compilation report (an .md file in your build directory) (reply to 39302)

User<6874026708>: Hello, I am a full stack blockchain developer with 4 years of experience. Can I available to speak regarding dev work? (reply to 39305)

Cyril M |: thanks (reply to 39303)

Cyril M |: btw, is there any guide on how to verify tact contract on an explorer? (reply to 39303)

Anton: You might want to try asking here @tonverifier (reply to 39309)

Дмитрий: I have an error Null reference exception(code 128) when working with a map. how can this be fixed?

Nerses: I'm working on a smart contract that involves verifying a signed message on-chain. The contract receives a message with several fields, including signature, data, and a few others. The contract first checks the validity of the signature before proceeding with any further logic.  I've implemented the off-chain message signing using ton-crypto and passed the signed message to the contract, but the signature verification fails on-chain. I'm not sure if I'm missing something in the signing process or if there's an issue with how the contract verifies the signature.  Could someone help me figure out what might be going wrong? I've provided the relevant parts of the code in this GitHub Gist. Any insights would be greatly appreciated!

Nerses: What is the analog of storeStringRefTail in C# ton sdk ?

cubby: Hello. Is anyone looking for a blockchain engineer?

mx: Does anyone know if there is an explorer for TON with these interaction functions?

mx: Where can I find open-source code on interactions with smart contracts using Web3 and TonWeb?

— 2024-08-27 —

Dannel: hi

Dannel: how to get jetton notify on smart contract tact

Dannel: i want to implement logic on smart contract when get jetton from other address

angel: I am a Senior Blockchain Engineer with 6 years of professional development experience. I have strong expertise in Rust, Solidity, Solana, and Func, and I am proficient in various networks such as Ethereum, Solana, TON, and Stellar. My Experience: -Built and audited a Substrate-based chain. -Developed a DEX project on the MultiversX chain. -Created multiple game projects on the TON network, including TapToEarn-Game and NFT-based games. -Developed a launchpad and built a project forked from pump.fun. -Worked on a variety of projects across industries such as e-commerce, finance, education, and customer management. -Developed trading bots, including a Solana Sniper Bot. If you need my help, ping me anytime please.

User<7426900320>: hello, everybody

User<7426900320>: I am a beginner of ton blockchain I am really interested in tact It makes me crazy Who can help me? Feel free dm me Thanks

blocksdev: i am a beginner as well, if you found anything helpful you can share it with me tooo :) (reply to 39349)

Nerses: can anyone provide materials where I can see implemenataion of check_signature and check_data_signature ?

blocksdev: which lib are you using ? (reply to 39356)

jay: Get from querystring, but first, you should ensure the route matched. (reply to 39357)

blocksdev: You should checkout https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/init-data/init-data (reply to 39365)

Nerses: i tried to sign and verify message off chain using ton-crypto but if fails. Can anyone give a hint wha is wrong with this code ? const hashlock = BigInt("86063709575516430416322238016776016577783477821483564045133774829893108097467"); const timelock = BigInt(Math.floor(Date.now() / 1000) + 3600);    const dataCell: Cell = beginCell()       .storeInt(hashlock, 257)       .storeInt(timelock, 255)       .endCell();  const hashlockBuffer = Buffer.from(hashlock.toString(16), 'hex');  const timelockBuffer = Buffer.from(timelock.toString(16), 'hex');  const combinedBuffer = Buffer.concat([hashlockBuffer, timelockBuffer]);  const signatureBuffer = sign(dataCell.hash(), key.secretKey);  console.log(signVerify(combinedBuffer,signatureBuffer,key.publicKey));

K..: Hello devs, I am building ICO in tact please help. How we can send jetton fungible tokens from user address to contract address.

Dmitry: message Mes{     x: Int; } struct Kek {    x: Int; } contract Lol {    kek: Kek?;    init() {  }     receive(msg: Mes) {           self.kek!!.x = msg.x;    }   }

Dmitry: it seems i cannot set kek.x like that or other way    Parse error: expected "+" .........

Денис: self.kek!!.x = msg.x ;

Nerses: data: LockCommitmentSigData; }  struct LockCommitmentSigData{     commitId: Int;     data: Slice;      signature: Slice;     publicKey: Int; }      receive(msg: LockCommitmentSig){         require(self.commitExists(msg.data.commitId),"Commitment does not exist");         require(checkSignature(msg.data.data.hash(),msg.data.signature,msg.data.publicKey),"Invalid signature");         let hashlock: Int = msg.data.data.loadInt(257);         let timelock: Int = msg.data.data.loadInt(255);         let lockCommitmentMessage: LockCommitment = LockCommitment{             data: LockCommitmentData{                 commitId: msg.data.commitId,                 hashlock: hashlock,                 timelock: timelock             }         };         self.lockCommitment(lockCommitmentMessage,context());     }  are hashlock  and timelock loaded correctly   in receive ?

Dmitry: just a typo (reply to 39378)

Dmitry: does not solve the problem

Dmitry: error can be different because of tact version. ( created new project ) (reply to 39382)

User<7426900320>: /balance

User<7426900320>: hello

K..: Anyone please help (reply to 39374)

ashes: Just transfer Jetton to the contract address, and the funds will go to the Jetton contract address of your contract (reply to 39389)

potato: Hi! I need to store multiple addresses in the forward_payload when i transferring tokens to read them into the contract and send some coins to each of them  Should the entry look something like this: .beginCell() .storeAddress(address1) .storeAddress(address2) .endCell()  How read it into the contract?

Nerses: in my receive  when i get message I want after processing it to send back remaiined ton.Is this correct code to include in receive  ?                     send(SendParameters{to: ctx.sender,                                         bounce: true,                                         value: ctx.value,                                         mode: 64});

K..: Thank you ashes for you response please share code snippet (reply to 39390)

Cyril M |: how do you send ton from contract to an address? not using the msg.value

Nerses: In case i send message to contract I want to inbound enough ton for message processing but not more than that,is it possible or the contract should return remining amount of ton ?

Cyril M |: receive(msg: SellToken){         let ctx: Context = context();         require(ctx.value >= self.min_fee, "Insufficient funds");         require(self.county_tokens.get(msg.country) != null, "Country token not found");         let country: Country = self.county_tokens.get(msg.country)!!;         require(country.sellable, "Country token not sellable");         let ton_amount: Int = (msg.amount * self.sell_rate) / 100;         require(ton_amount > 0, "Invalid amount");         send(SendParameters{                 to: country.address,                 value: ton("0.02"),                 mode: SendIgnoreErrors,                 body: SellTokenInternal{amount: msg.amount, seller: ctx.sender}.toCell()             }         );         send(SendParameters{to: ctx.sender, value: ton_amount, bounce: false, mode: SendIgnoreErrors});     }

Cyril M |:  receive(msg: SellToken){         let ctx: Context = context();         require(ctx.value >= self.min_fee, "Insufficient funds");         require(self.county_tokens.get(msg.country) != null, "Country token not found");         let country: Country = self.county_tokens.get(msg.country)!!;         require(country.sellable, "Country token not sellable");         let ton_amount: Int = (msg.amount * self.sell_rate) / 100;         require(ton_amount > 0, "Invalid amount");         send(SendParameters{                 to: country.address,                 value: ton("0.02"),                 mode: SendIgnoreErrors,                 body: SellTokenInternal{amount: msg.amount, seller: ctx.sender}.toCell()             }         );         send(SendParameters{to: ctx.sender, value: ton_amount, bounce: false, mode: SendIgnoreErrors});     }

blocksdev: is this a typo? (reply to 39401)

Cyril M |: no

blocksdev: oh okay 👍

Cyril M |: struct Country {     country: String;     address: Address;     buyable: Bool;     sellable: Bool; }     county_tokens: map<Int, Country>;

Cyril M |: it's a mapping

blocksdev: I thought its a typo and should be country_tokens

blocksdev: is there any playground were I can deploy, build & test my contracts on testnet with a sneak UI

HIRE: Oh (reply to 39408)

Anton: https://ide.nujan.io (reply to 39408)

blocksdev: Thanks dude (reply to 39410)

Денис: Hello, I want to accept deposits only from the users that are verified in my backend, I can encrypt verified user address using backend private key and then decrypt it in the smart contract using public key and compare it to sender address. Is it possible to implement?

Денис: Or is there other way to know that the transaction comes from verified source?

Muhammad: Hello Guys, Please somebody mistakely send me a TRX on my telegram address. I need your help

MD.: Hi

Nerses: I use @ton/ton.How i can specify sending message mode here await contractProvider.send(walletSender, { value: amount,bounce: true }, lockCommitmentMessage);

H: hihi, there is no standard codes to deploy jetton?

User<7426900320>: Hello, everyone

cubby: Hello. Is anyone looking for a blockchain engineer?

mgnfy_view: Hello, we are a two-membered team of security researchers/smart contract devs looking to build a degen-focused defi/GameFi product on TON. We are looking for tact devs and a full stack developer with experience in crafting good looking UIs.

— 2024-08-28 —

M: hello, is there any eg for Deposit/Withdraw jetton？i find this section in doc is still empty

Laisky: child wallet contract keep the number of the jetton by themself. they can transfer the number with other child wallet contract which has same code and master directly (reply to 39441)

M: send(SendParameters{             to: self.owner,             bounce: true,             value: amount,             mode: SendIgnoreErrors         }); (reply to 39442)

M: Yeah,I just try transfer jetton to contract, but how  can i  transfer jetton from contract to wallet, just like this way

Nerses: in case I parse all messages to smart contract receives,how I can know that smart contract did operation successfull which was triggered by that message ?

Laisky: jetton is not value, its just some number stores in your contract's variable. In contract A, you decrease a number by one, and then in contract B, you increase a number by one, thereby completing a transfer. (reply to 39444)

澀谷工程師: You can check the exit code on the tonviewer.com, it mean tx implmented succefully if the exit code is 0 (reply to 39445)

Nerses: I want to do that programitically (reply to 39447)

澀谷工程師: it’s complex. because the low level deisgn of ton

澀谷工程師: ton is async blockchain, it means you wouldn’t know the transactions status (even tx hash)after you send it

澀谷工程師: all you could do is that rembering the seqno and trace this tx until it on chain

Laisky: https://ario.laisky.com/alias/ton-converter share a simple conversion tool that may help with debugging

Nerses: I need exactly somehting like that.The  problem is I need to know if certain message ttriggered that tx was successfull or not. (reply to 39451)

Nerses: is there any code snippet or example how I should store somwhere seqno and trace andthen do that check ? (reply to 39451)

澀谷工程師: as my experience, you should store the seqno before you send tx, after you send the tx, check the seqno was increased 1

Nerses: but that doesnt mean smart contract processed the message successfull.As i can send message from my wallet to smart contract.The contract can fail to do something based on my message but my wallets seqon will increase as message is sent successfully (reply to 39455)

澀谷工程師: if seqno +1 it is generating data on chain successfully or it is fail

Laisky: poll and fetch the trace from https://testnet.tonapi.io/v2/traces/<TX_ID>, until all children are complete (reply to 39453)

Nerses: can you give more insight what means all children are complete ? (reply to 39458)

澀谷工程師: If your observation object is a smart contract, you could parse all txs from this contract, and write a matcher to check the tx sender, after that, you could parse the message exit code

Laisky: here is an example https://testnet.tonapi.io/v2/traces/521ce114ade4b4834df5ce8253429557320e4e2b8dcef205e312948acb167333  you can search "success" (reply to 39459)

Nerses: let me sum up the flow of that check. I parse incoming message to my smart contract store there for specific message its trace then poll and fetch untill all children are complete and then loop throw all children checking property success to be true. after all this I can be sure that the message by which the contract was triggered processed the message correctly (reply to 39461)

Laisky: make sense for me.  BTW, If you're just want to quickly check the status manually, you can view it directly here: https://testnet.tonviewer.com/transaction/da5602e0577cc3160c8ba4005f9e8a270545fffa4d181454383d10fc7d9eb630 (reply to 39462)

Nerses: it also can be solution,thanks for it (reply to 39460)

Nerses: I know about it,i just wanted to do that programitically.Thanks for help and advice (reply to 39463)

poppa: https://t.me/tgresistancebot/letter  Join the #DigitalResistance. Sign the Open Letter to #FREEDUROV.

Nerses: How can I design a smart contract on the TON blockchain that allows users to send exactly the required amount of TON for a transaction to process, ensuring that any excess amount is returned to the user?

User<7236462253>: Hello i already withdraw TON from Quick bot from 10 hour ago but my wallet not yet have TON come , Who can help me ?

Fardin: The Tin is temporary slow, please be patient (reply to 39470)

Nerses: I use ton/ton how i can specify sending message mode here  await contractProvider.send(walletSender, { value: amount, bounce: true }, lockCommitmentSigMessage);   ?

Fardin: U want to do it on chain or off chain? (reply to 39469)

Nerses: off chain (reply to 39473)

Nerses: i have provided the line where I send message but it seems ton/ton send method doesnt have property to specify mode or i am doing something wrong (reply to 39473)

Jason: Is there any documents about generate tonwallet/send ton/fetch transactions from an ton wallet by Java? I need help please...

Fardin: Usually the amount of the fee will be decreased from the amount of the ton in transaction  But you could use a simple condition in the contract and solve the issue (reply to 39474)

Nerses: is there any example of it ? (reply to 39477)

Fardin: Instead of equality ( == ) operator use greater than ( >= ) (reply to 39479)

Nerses: where ? (reply to 39481)

Fardin: In the functions which require an amount of TON (reply to 39482)

live: How do I build the forward_payload format so that TonKeeper shows the type and number of incoming jetton (instead of the default TonCoin)

Cyril M |: hi guys, I wonder if this is correct:  receive(msg: SellToken){         let ctx: Context = context();         require(ctx.value >= self.min_fee, "Insufficient funds");         require(self.county_tokens.get(msg.country) != null, "Country token not found");         let country: Country = self.county_tokens.get(msg.country)!!;         require(country.sellable, "Country token not sellable");         let ton_amount: Int = (msg.amount * self.sell_rate * pow(10, 9)) / 100_000;         dump(ton_amount);         require(ton_amount > 0, "Invalid amount");          send(SendParameters{                 to: country.address,                 value: ton("0.02"),                 mode: SendIgnoreErrors,                 body: SellTokenInternal{amount: msg.amount, seller: ctx.sender}.toCell()             }         );         send(SendParameters{to: ctx.sender, value: ton_amount, bounce: true, mode: SendRemainingValue + SendIgnoreErrors});  the function will burn the Tokens and then send the ton_amount to the sender

Cyril M |: @here

Дмитрий: How to fix 128: { message: Null reference exception }, error?

Mikhail: it means that there are null somewhere. :) (reply to 39490)

Mikhail: look at your map readings, probably you are trying to read data that is not in map

Nikita: AFK WEB3 STUDIO  Who are we? We are WEB3 studio, one of the largest in the CIS, we are engaged in: - Creating Telegram Mini Apps (turnkey); - WEB DESIGN; UX/UI;  - NFT Collections; - Raster graphics; - Vector graphics; - Motion design; - 2D animations, (frame-by-frame+overlay); - SGI; - Memcoin design; - Marketing; - back/front end development;  Some of the most popular cases in our portfolio include: Ben the dog, TOMOCAT, Gaimin, Aptos Labs, Stoned ape crew, Alpha Gardeners, Mad Lads, Famous Fox Federation, BONK, SILLY, Solana Sensei, MEW, MonkeDAO, Aptos monkeys, OrdinalMisfits, Souffl3, Dust City, TittyDAO, Lemur Lounge, Afterland,Notcoin,NotAi, Cyber Finance, as well as other tyr1 telegram mini apps and this is just a part of the most popular projects/memcoin/NFT collection. (And many more top projects under NDA).  We are not just a studio, we are a big team of professionals of different directions. We guarantee you quality fulfillment of your orders, in the right time. (forwarded from Talkin life)

Дмитрий: In map? But I check it  Like this: if (value == null) {spme code} else {let n: Int = value!!} (reply to 39492)

Blanco: Hello, if you don't mind, could you give me some advice? Let's say we have a pool from a platform like DeDust, and the pool has a method to get reserves, and I need to monitor changes in the reserves in real-time. Initially, I thought of doing it this way: subscribing to the transaction stream for the pool, and as soon as a new transaction comes in, calling the contract method. But I'm using RPC, and I don't have my own node. As a result, the request to get the reserves takes about 200ms. Is it possible to implement this faster, preferably in real-time?

Дмитрий: What could go wrong? (reply to 39496)

Mikhail: Could you snap whole function? (reply to 39496)

Дмитрий: working with map only in this part (reply to 39499)

Mikhail: can you drop tx? (reply to 39500)

Дмитрий: Why? Explorers do not return all error information

Mikhail: you might want to debug it locally enabling debug mode in sandbox or you can watch stacktrace in ton.cx (reply to 39503)

Mikhail: https://docs.tact-lang.org/book/debug#logging (reply to 39503)

Mikhail: that how you can check which part of code went off

Mikhail: btw, yousure that array is not a null? (reply to 39503)

Дмитрий: yes (reply to 39508)

Mikhail: + there could be error in self.game

Дмитрий: is there testnet version? (reply to 39504)

Дмитрий: i dont think so (reply to 39510)

Дмитрий: contract works 50/50 in one situation

Mikhail: could you just drop a gist with contract code? (reply to 39513)

Mikhail: or give repo url

Дмитрий: something like lottery (reply to 39514)

Mikhail: we cant help you with fixing you code unless you drop a code (reply to 39516)

Mikhail: you can try to fix by yourself with debugging with tests in sandbox

Mikhail: maybe i lied :) then check it via tests and debug mode (reply to 39522)

Дмитрий: I haven't written tests before) (reply to 39523)

Nerses: does emitting costs fees ?

Mikhail: yes, around 0.002 because emit is basically sending a message to nowhere (reply to 39525)

Nerses: thanks a lot (reply to 39526)

Cyril M |: hello (reply to 39485)

Kelvin: Hey guys, anyone with Java implementation of TON Network with libraries?

Kelvin: Especially on sending ton messages

stereo: is any sandbox like remix avail for ton ?

Anton: https://ide.nujan.io (reply to 39532)

stereo: thnx looking right in (reply to 39533)

stereo: awesome exactly what i was looking for ... good call (reply to 39533)

— 2024-08-29 —

Hung: Hello guys, I have a question is it possible for me to get the latest transaction hash of the current contract using tact?

Jake: any good method to track all NFTs’ transfers from a certain NFT collection?

jay: Can tact support nested object arrays?

jay: message SendItem { to: Address;     amount: Int as uint128; }  message BatchSend {     queryId: Int as uint64;     recipients: SendItem[];     message: String; }

jay: This will compilation failed.

jay: Would you give me some example?

jay: I want to implement a batch transfer contract.

jay: There's no way to get it. (reply to 39542)

Anton: it does not have even non-nested arrays (reply to 39545)

jay: Yeah, maybe I should parse data from cell

jay: I found out that tact doesn't support loadDict

jay: is right?

Nerses: what is the best approach to track transaction sucess ? Lets suppose I have smart contract and every time it receives message is done some operation based on that message,or fails if something is wrong in message.I dont emmit any event(as in TON it is useless).I cant figure out the flow how I should track the succesffull messages and be sure that for certain message the needed operation is done

Metalgear: This is a scam, isn't it? (reply to 39560)

Malik: I am new to ton What tooling do I need? Are nix modules available?

Champer Wu: It depends on what kind of the contract you are using (reply to 39558)

Champer Wu: If you are interacting with Jetton contract, the full pocess of it include 5 messages

Champer Wu: the process would be like A ->(sendBocReturnHash) -> TON A <-(return hash 0x1234) <- TON A-> getTxByHash -> TON A<- return(Tx HEADER and BODY) <- TON tracing the outMsg and do the processing above again

Nerses: I have the same contract for Jettons and also for native token.would like to listen both flows (reply to 39567)

Champer Wu: If you are interacting with Jetton , you could monitor the dest address and check the transfer notification was be executed

Champer Wu: or you could trace the path as I mentioned above

Georgiy: What tooling do I need? https://github.com/nowarp/misti/ for static analysis among other things. (reply to 39564)

Nerses: so ths approach is shorter,and it will be better i think (reply to 39570)

Nerses: thanks a lot

Joaquim: Is this kind of spam OK for this chat? 🤔 (reply to 39576)

Joaquim: Not your bro, and it is spam. It is not related to the Tact Language -- you are advertising services.

Joaquim: Btw I'm not against you or anyone trying to bring more business to their company I'm just asking if this is OK in this chat

Nerses: how is specified amount property of jetton notify message ? is it in gramms ?

Nerses: Is it possible to verify on-chain that a signature was made by a specific address on the TON blockchain? If so, how can it be done?

Mikhail: https://answers.ton.org/question/1602580552903299072/check-signature-check-data-signature-usage-for-signing (reply to 39592)

Nerses: but I have only address of user howcan I get from it pubKey to pass as parametr ? (reply to 39593)

Joel: Its in coins (reply to 39582)

Joel: Which is VarInteger 16 type

Mikhail: you can pass pubKey to function and then just verify it (reply to 39594)

Nerses: can you bring any example ? (reply to 39595)

Nerses: how derive from address the public  key on chain ? as I have only users address (reply to 39597)

Mikhail: ah you want to do it full on-chain without frontend? then you need to somehow get pubkey from wallet contract, sorry i cant remember is there are any message receivers for getting wallet info (reply to 39599)

Nerses: yeah I need that case (reply to 39600)

Mikhail: wallet contract have pubkey field in it, but tbh i dont remember is there are receivers like "GetWalletInfo"

Nerses: in case it exists will it be possible to get publicey from samrt contract ? (reply to 39602)

Mikhail: well, there is a get method for pub key, but i guess you can somehow convert address to pubkey

Nerses: yeah i also want to get method that converts address to pubkey,but useless.i started to think it is impossible in TON (reply to 39604)

Nerses: I researched and found that every wallet has getter for publickey https://verifier.ton.org/EQCfCUwHtdIzOvupHmIQO-z40lrb2sUsYWRrPgPhCiiw62_6?testnet=#:~:text=int%20get_public_key()%20method_id  but I think it isnt possible from smart contract do such call then getting that data use it in computations (reply to 39602)

Andrew: Guys, hello Who have simple token but without ise Jetton Can share with me gothub please or send me dm Thx 🙏

Nerses: how i can use func code in tact contrcat ? is there any example ?

Georgiy: https://docs.tact-lang.org/book/import#import-func-code (reply to 39610)

Nerses: thnaks a lot (reply to 39611)

Nerses: is this correct func code to use tvm instruction ecrecover (int, int, int) ecrecover?(cell hash, int v, int r, int s) asm(hash s r v) "ECRECOVER";  ?

Nerses: as TVM instruction ECRECOVER return 4 Int from which first 3 are parts of address,should I store them in Cell and then read all at once as Address ?

0xtitn: who can make DEX using tact?

Nick: Not sure if it’s a good idea (reply to 39616)

0xtitn: why? (reply to 39619)

0xtitn: DM me

Anton: it depends on the version of Tact (reply to 39619)

Alejo: Hi guys, quick questions, has anyone tried this solidity to ton compiler: https://github.com/everx-labs/TVM-Solidity-Compiler.git  Thanks in advance!

stereo: what lang does it output ? tact or func (reply to 39625)

&rey: TVM assembly. (reply to 39631)

stereo: first timer for me  thnx i'll look into it sounds quite deep though

stereo: i nested a struct Tx inside the struct user and im mapping the User struct in userByAdrExt with the goal to collect all Tx by this User in User.txs   does anyone get what im trying to say and knows why this thing is bugging around ?  problem : i want usr.txs.set to add a new Tx to the array but it just does it once and overwrites the 2. one again and again ???  any suggestions ???

stereo: import "@stdlib/deploy";  struct Tx {     id: Int as uint64;     snd: Address;     rcv: Address;     cntx: String;     date: Int as uint32;     msg: String; }  struct User {     adr: Address;     name: String;     age: Int as uint32;     txs: map<Int, Tx>;     frnz: map<Int, Address>; }  contract Yaard with Deployable {      txs: map<Int,Tx>;     t: Int as uint32;     usrs: map<Address,User>;     admin: Address;     za: Address = newAddress(0,0);      init() {         self.admin = sender();         self.t = 0;         self.txs.set(self.t,Tx{             id: self.t,             snd: self.admin,             rcv: myAddress(),             cntx: "Deploy",             date: now(),             msg: "Yaard contract deployed !"         });         self.t +=+ 1;         self.usrs.set(sender(),User {             adr: sender(),             name: "Admin",             age: 1980,             txs: self.txs,             frnz: emptyMap()         });     }      fun userByAdrExt(a: Address): User {         let tx: Tx = Tx{             id: self.t,             snd: self.admin,             rcv: myAddress(),             cntx: "Get User Data",             date: now(),             msg: "User Data fetched !"         };         let usr: User = self.usrs.get(a)!!;         usr.txs.set(self.t ,tx);         self.txs.set(self.t ,tx);         self.t += 1;         self.usrs.set(a, usr);         return usr;     }      get fun userByAdr(a: Address): User {         let usr: User = self.userByAdrExt(a);         return usr;     }      get fun txcount(): Int {         return self.t;     }  } (forwarded from stereo)

&rey: And where do you happen to update contract's state? You need a receiver = handler of incoming messages. (reply to 39635)

stereo: alright thnx great hint im changing the state ...  i have to turn the fun into a message reciever thing and i'll figure it out !  blessings 👌 (reply to 39636)

— 2024-08-30 —

Tiqan: Hi I have two Contracts.  Contract A imports Contract B Contract B imports Contract A  This results in an error. How do i fix this?

Joel: Circular import. Just take out the stuff that's needed in both contracts and put it into Contract C. And let Contract A and B import Contract C (reply to 39642)

Tiqan: I know that already. Sadly that doesnt really work for my usecase i think.  Contract A has an initOf Contract B to get the address of Contract B and send a message to it  Contract B has an initOf Contract A to check if the message comes from Contract A

Nikolaj: Hello, is it possible to send messages of arbitrary format to a smart contract written in Takt and parse those messages as Takt messages with an underlying struct?

Jb: Hello is there a way to encode structs,pack them together and then decode them inside a smart contract, in order to get the struct data again?

csx: Hello, Is there and IDE I can deploy ton contract? like remix for evm contract.

Dmitry: https://ide.nujan.io/ (reply to 39651)

csx: Thank you very much👍

Gennady: Hi  can I convert the Address type to Int?

Money: I ❤️ TACT

Hung: Hi guys, I have a small question that is it posible to get an specific error message when call a smart contract like on EVM, even though in the required function I defined error message for it Thank you

David: hi there

David: is in Tact  some libs to work with encription?

TMT: hey, you found solution? (reply to 29267)

Laisky: How can I set the metadata for an NFT? As I understand it, I can retrieve individualContent using the NFT item's get_nft_data method. Then, I can obtain the URL for the NFT metadata through the collection's get_nft_content method.  But it seems not work.  I would appreciate any assistance in clarifying this.  source code: https://github.com/Laisky/HelloWorld/blob/master/blockchain/ton/contracts/nft/contracts/nft.tact  tonviewer: https://testnet.tonviewer.com/kQBq2q2vne2Rl1N18RecCu3Y8RVGsyFAOVPxrNjq43YBaOII?section=nft

Nerses: In my smart contract on the TON blockchain, the protocol requires a user to complete two transactions for successful execution. To streamline the process, I've removed the need for the user to perform the second transaction themselves. Instead, during the first transaction, the user provides their signature, which allows an LP (Liquidity Provider) to execute the second transaction on their behalf.  I need to ensure that during the second transaction, I can verify that the provided signature indeed belongs to the user, using only the information available within the smart contract. Although one approach is to store the user's public key during the first transaction, I would prefer a more secure and efficient method, such as leveraging the TVM instruction ecrecover or other techniques to verify the signature's ownership without explicit key storage. What would be the best approach to achieve this?

Laisky: Does using snake_case or camelCase for struct members matter?  My code is almost identical to this example, but I changed the naming style of the member properties. (reply to 39670)

Tom - Bushi: in blueprint tests, how can I parse the event body param to determine the message when I revert a transaction using require?

stereo: is there some sort of tokenstandard library similar to openzeppelin on soliidity

Nerses: can smart contract(not wallet contract) in TON sign transaction as it doesnt have private key ?  and also does it have public key ?

Kirill: Hello, how can I convert array data format to tact cell format?

Kirill: Specifically, I'm sending some data from typescript code and want to use it in my tact contact

Renat: Can anyone, please, provide a link to documentation or tutorial with good explanatoin how to create smart contract, who will be able to process payment from Jetton contract?

Renat: in other words, I need to create a smart contract who will accept Jetton payment and I need to understand what is the messages flow?

Alejo: how does tact manage encoded/bytes data? as strings? or should we create a Cell ?

blocksdev: How can i fetch the transactions of a wallet address which includes an OP code of someopcode or like interacted with my contract!

blocksdev: Dude stop spamming, we are not interested in your crap. Edited: try to send this somewhere else like a group were sharing this crap of yours is allowed! (reply to 39689)

Cyril M |: anyone encountered this bug when burning jetton? I tried burning 10 jetton with this code:  send(SendParameters{                 to: contractAddress(sellerWalletInit),                 value: 0,                 bounce: true,                 mode: SendRemainingValue + SendIgnoreErrors,                 body: TokenBurn{query_id: 0, amount: msg.amount, response_destination: self.owner}.toCell()             }         );  on local unit test, the burned amount is exactly 10. but when deployed on testnet, the burn amount is 0.00000001  https://testnet.tonviewer.com/transaction/819b23dcac76e77ddb9aa1ce63644fad7cb14b82658cf38c90a9662995ec2227

Cyril M |: receive(msg: TokenBurn){         let ctx: Context = context();         require(ctx.sender == self.owner || ctx.sender == self.master, "Invalid sender"); // Check sender         self.balance = (self.balance - msg.amount); // Update balance         require(self.balance >= 0, "Invalid balance");         let fwd_fee: Int = ctx.readForwardFee(); // Gas checks         require(ctx.value > ((fwd_fee + 2 * self.gasConsumption) + self.minTonsForStorage), "Invalid value - Burn");         // Burn tokens         send(SendParameters{                 to: self.master,                 value: 0,                 mode: SendRemainingValue,                 bounce: true,                 body: TokenBurnNotification{                     query_id: msg.query_id,                     amount: msg.amount,                     sender: self.owner,                     response_destination: msg.response_destination                 }.toCell()             }         );     }

Cyril M |: receive(msg: TokenBurnNotification){         self.requireSenderAsWalletOwner(msg.sender); // Check wallet         self.total_supply = (self.total_supply - msg.amount); // Update supply         if (msg.response_destination != null) {             // Cashback             send(SendParameters{                     to: msg.response_destination!!,                     value: 0,                     bounce: false,                     mode: SendRemainingValue,                     body: TokenExcesses{query_id: msg.query_id}.toCell()                 }             );         }     }

David: HI  this method  param is result of method  ``` ;;; Returns the internal address of the current smart contract as a Slice with a MsgAddressInt. ;;; If necessary, it can be parsed further using primitives such as [parse_std_addr]. slice my_address() asm "MYADDR"; ```  right? (reply to 37045)

David: so  message signed by user wallet can`t be checked by int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU"; (reply to 39696)

David: i like to sign message by user keys and then check it in contract is that posible? Thanks for answer

Sumit: arguments are passed by reference or value?

Tyler: hello How can I create a contract on the network that will give people tokens or NFTs of our project after paying a certain amount of TON currency?

0xtitn: I'm looking for a ton developer who can make the DEX using tact

— 2024-08-31 —

Cyril M |: hi guys, still need help on this (reply to 39692)

Laisky: 👆👆👆The issue of being unable to read NFT metadata still hasn't been resolved. Can anyone help me take a look at it?🙏  NFT item: https://testnet.tonviewer.com/kQD2IWbvrV9My7oSJ_uGccWA_gY73wSIhcTCuRyMr3GYS-5g?section=nft  NFT contract: https://github.com/Laisky/HelloWorld/blob/master/blockchain/ton/contracts/nft/contracts/nft.tact (reply to 39666)

stereo: Working on a NFT Standard Template ! (reply to 39721)

c9 👨‍🍳: gm, i want to make script to claim transaction like below, what i should do now: https://tonviewer.com/transaction/0d38004402660c7635377a99d795c83c1def191e90daa8aa3f12d6ca923fe706

Anton: ASMR `asm`-functions are coming in the future Tact v1.5.0 release, so you can tap into the power of TVM directly.  This will be valid Tact code ⚡️:   asm fun keccak256(s: Slice): Int {     1 INT HASHEXT_KECCAK256 }  // … more stuff …  let h = keccak256(yourSlice);   — The Tact team  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

CodeCop🐵: Wallet is not deployed Hi everyone. I'm new to TON smart contract development.  I wrote a simple counter contract and trying to deploy it to testnet. I connected my Tonkeeper wallet. It has balance in testnet account. (>40TON). It is active  But still getting this wallet is not deployed msg.  Can someone help me with this please.  Thanks in advance. (forwarded from CodeCop🐵)

blocksdev: How should i send the winning reward back to the user ?  like i have a very simple contract, were user can Predict a number between 0-1 and the bot generates a random number if the random number is equal to the predicted num the contract should reward him otherwise the contract will keep it.

Cyril M |: still need helppp (reply to 39692)

ashes: Are u sending back jettons or ton? If ton - then check this  https://docs.tact-lang.org/book/send  If Jetton  send(SendParameters{         to: self.contractJettonWallet!!,         value: ton("0.000001"),         mode: (SendRemainingValue + SendIgnoreErrors),         bounce: false, // 0x7362d09c - notify new owner         body: TokenTransfer{         queryId: now(),         amount: msg.amount,         destination: context().sender,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.0000001"),         //working on tests         forward_payload: beginCell().storeUint(0,1).endCell().asSlice()         }.toCell()         }         ) (reply to 39743)

— 2024-09-01 —

Laisky: I modified the code based on the template, and from the output, there is no difference at all. (reply to 39723)

blocksdev: Yes i am sending ton back, but the problem i am facing is when the user is sending the transaction it showing the result.. (reply to 39752)

stereo: im building a whole new code standard with a few new NFT features ...  Layers to design on and immutable interactive content !  Stay tuned in ! (reply to 39759)

groue_juice: GM, guys

groue_juice: I want to know the more docs for lean TACT, like contract call contract

groue_juice: where can I find it?

SAJAHAN: Hi

Joaquim: Have you tried the de official docs? - https://tact-lang.org/ (reply to 39776)

Cyril M |: hello? still need answers (reply to 39692)

— 2024-09-02 —

Mirka: 10 nano-token = 0.00000001 token (reply to 39692)

Cyril M |: yes, but when i input toNano('10') the TokenBurn will read it as 10000000000. it will result to "invalid amount" error

Cyril M |: on local unit test, when i only put 10, it's read as 10 ton. not 10 nano

TMT: how to subscribe to a wallet address from the frontend app.  I want to receive information about when the wallet status changes in the front-end application

Cyril M |: it's actually burning 10 tokens. not 0.00000001 token. but when deployed to testnet. it's 0.00000001

Mirka: Use API or make your own (reply to 39807)

TMT: what api are you talking about? tonapi. io? (reply to 39809)

Mirka: It's an option (reply to 39810)

Crypto noobie: Hi guys. I want to create a TON Jetton and implement an airdrop feature that sends tokens when a user connects their wallet. I'm using NestJS as the backend. Should I call smart contracts from an endpoint, or is there a better approach to trigger the airdrop? Any guidance on how to set this up would be helpful. Thanks!

Sumit: How can i make my contract upgradable?

Anton: https://github.com/tact-lang/tact/issues/27 (reply to 39814)

M: hi everyone, i just send token to my contract in Tokenkeeper without any word, but seems i never reveive the "TokenNotification", is there some wrong with my operation?

M: https://testnet.tonviewer.com/kQDXHvaY-TJMn4iL_7_jS8WNXJkKMn9hBd6cmWe4zra5_vs7, but explore already display it

mgnfy_view: Hey there guys, I'm still looking for some tact and fullstack devs

Joaquim: I've pinged you (DM) (reply to 39821)

Cyril M |: still need help on thiiissss (reply to 39692)

GyNanzo: /report (reply to 39827)

Nerses: is it okay that contract processing this message fails when  it receieves first time and in balance is 0 TON but after having some amount of TON it process susccessfully ? it fails because of sending Notify  message,Initially I set its parameters value:0 mode:1  but it failed as well

Nerses: let ctx: Context = context();         require(self.lockExists(msg.data.hashlock) == false,"Lock Already Exists");          require(now() <= msg.data.timelock ,"Not Future Timelock");         require(ctx.value != 0,"Funds Not Sent");          self.locks.set(msg.data.hashlock,  HTLC  {                                                         dstAddress: msg.data.dstAddress,                                                         dstChain: msg.data.dstChain,                                                         dstAsset: msg.data.dstAsset,                                                         srcAsset: msg.data.srcAsset,                                                         sender: sender(),                                                         srcReceiver: msg.data.srcReceiver,                                                         hashlock: msg.data.hashlock,                                                         secret: 0x0,                                                         amount: ctx.value,                                                         timelock: msg.data.timelock,                                                         redeemed: false,                                                         unlocked: false                                                         });          if(msg.data.commitId != null){             let id: Int = msg.data.commitId!!;             self.commitIdToLockId.set(id,msg.data.hashlock);         }          if(msg.data.messenger != null && msg.data.commitId != null){             // notify messenger             // value:0 (as we dont send TON) mode:1 (fees will be payed separetly)             send(SendParameters{to: msg.data.messenger!!,                                 bounce: true,                                 value: 20000000,                                 mode: 0,                                 body: Notify {data: Notification {                                                                             commitId: msg.data.commitId!!,                                                                             hashlock: msg.data.hashlock,                                                                             dstChain: msg.data.dstChain,                                                                             dstAsset: msg.data.dstAsset,                                                                             dstAddress: msg.data.dstAddress,                                                                             srcAsset: msg.data.srcAsset,                                                                             sender: sender(),                                                                             srcReceiver: msg.data.srcReceiver,                                                                             amount: ctx.value,                                                                             timelock: msg.data.timelock,                                                                         }}.toCell()});           }          // mode:64 will be sent tx sender remaining amount after msg processing         send(SendParameters{to: sender(),                             bounce: true,                             value: 0,                             mode: 64});          emit(TokenLocked{                 hashlock: msg.data.hashlock,                 dstChain: msg.data.dstChain,                 dstAddress: msg.data.dstAddress,                 dstAsset: msg.data.dstAsset,                 sender: sender(),                 srcReceiver: msg.data.srcReceiver,                 srcAsset: msg.data.srcAsset,                 amount: ctx.value,                 timelock: msg.data.timelock,                 messenger: msg.data.messenger,                 commitId: msg.data.commitId             }.toCell());     }

blocksdev: Have you calculated how much storage fee is required for 1000 hashes ? (reply to 39830)

Nerses: nope (reply to 39832)

Nerses: why do i need it (reply to 39832)

Bharathraj: Any good documentation for deploying and minting NFT?

Nerses: In my TACT smart contract, I have receivers that accept messages but don't require TON for processing. How should users specify the exact amount of TON to send with the message to avoid the transaction being reverted? Alternatively, should the contract automatically send back any excess TON?

Cyril M |: have anyone here tested the jetton burning??

blocksdev: i dont know, i asked cuz earlier i was trying to make a Claimable contract and i thought using maps would be costly for that . (reply to 39834)

Eason: Hi, I am struggling to decide whether to use funC or tact to develop ton's dapp，Seems Tact is the most easiest but I didn’t find any online products are using it, could you share some products that are using Tact?

Piotr: Hi I am currently developing vesting smart contract in tact, clients of that vesting will come with their own jettons ready. Can anyone help with providing information on how I can store and manage those jettons on the contract? It would be highly appreciated. Thanks in advance 🙏

Bricoll: have you found the develoer who can make the DEX using tact? (reply to 39714)

Sumit: what is the replacement for ‘bytes’ type from solidity?

Joaquim: have you checked the docs? They have good explanation for the primitives (reply to 39854)

Joaquim: what do you mean by storing in the contract? The contract would have a reference of addresses and the number of jettons (most likely a map) (reply to 39848)

Joaquim: Imo falls more in the personal preference type of decision, both are production ready. (reply to 39844)

— 2024-09-03 —

Laisky: Is the testnet down? Can't send any transactions.

jun_song: same (reply to 39861)

jun_song: what to do

allen: me too

Laisky: Just like before, sit and wait, hoping for a miracle. there have never been any announcements. (reply to 39866)

Meme: Anyone knows how to manage launched app on Telegram Apps Center?

prodvd: Hey Tact fam. Who can develop DeFi, NFT staking and jettons with tax using Tact?

Alberto: hi, bro can we continue chat on dm? (reply to 39872)

Alberto: I have previously sent you message on dm.

CodeCop🐵: Can anyone answer please (reply to 39740)

Degen: How to parse exotic cells in tact

Degen: (slice cs, int exotic?) = proof_cell.begin_parse_exotic(); Similar to func, how to parse in tact?

Anton: if you install the next version of Tact: @tact-lang/compiler@1.5.0-dev.20240903, you will be able to use `asm`-functions and define your own function to parse exotic cells:   struct ExoticParse {   s: Slice;   isExotic: Bool; }  asm beginParseExotic(c: Cell): ExoticParse { XCTOS }   (just a heads-up: I haven’t tested the code above) (reply to 39877)

Degen: cell dict = cs~load_ref(); (slice entry, int found?) = dict.udict_get?(256, index); slice minter = entry~load_msg_addr(); int mint_amount = entry~load_uint(64); throw_unless(45, found?); throw_unless(46, msg_value >= mint_amount * 6000000);  How to write this code using tact?

Degen: @AntonTrunov

Degen: https://github.com/tact-lang/tact/issues/154

Degen: @AntonTrunov

Anton: you don’t have to tag me, I’m well aware of the issue and also there is a corresponding draft PR: https://github.com/tact-lang/tact/pull/343 (reply to 39882)

Degen: So is there an alternative solution for parsing? Is it just a matter of changing func and rewriting it?

Degen: I found the method used to verify merkle in the test case

Cyril M |: can you call getter function of another contract?

Degen: But the tact language does not seem to support loadBuffer()

Cyril M |: ex: from main contract, I want to call get_jetton_data from jetton contract?

Degen: @AntonTrunov How to achieve the same verification effect as exoticMerkleProof in tact?

Degen: plz help， master

Cyril M |: or you need to call via message?

Degen: I found that using loadUint(256) is the way to go

Degen: 🥹

Tom - Bushi: is there a good way to verify a transaction bounced with a specific error in the blueprint tests?

Piotr: But how does the process look like, that's what I'm having troubles understanding. So let's say someone created jetton, and they want to create vesting that will withdraw e.g. 100 coins to the beneficary address, how do I make transfer of the tokens to the beneficiary and how do I ensure that these "100 coins" are frozen until vesting cliff ends. Is there some guide to it in Tact docs? (reply to 39856)

Joaquim: tbh that's hard to explain here but the Tact docs should have everything you need go on DuckDuckGo and just search jetton tact vesting see if it yields anything (reply to 39904)

Piotr: Can I ask why tho, is this better search engine than chrome for example? @joaquimley

Joaquim: Dunno, I did just that (I use DDG) and saw some potential solutions/examples but I didn't want to post any links here

Piotr: Could you provide me with them on private message then?

— 2024-09-04 —

Johnny Le: hi, is there any sdk so I can generate wallet both v4r2 and w5 from words phrase ?

Laisky: https://blog.laisky.com/p/ton-tact/ Just wrote an article for TON Tact newbies on Jetton & NFT development. Feedback and discussions are welcome!

Degen: cell dict = cs~load_ref();         (slice entry, int found?) = dict.udict_get?(256, index);  How to write this code in tact??

jun_song: 请问调用jetton代币合约的sendTransfer方法的参数如何传递

jun_song: How to pass the parameters of sendTransfer method of jetton token contract when ts calls it?

M: Why i can't parse this payload in notice?

Tiqan: How do i achieve that my opcode gets displayed like this?

Tom - Bushi: can you mock a specific address and send a transaction from it in blueprint tests?

— 2024-09-05 —

Gennady: hello everyone  I want to use "checkSignature", but I have a problem. How do I convert sender() to Int ? Maybe someone has done this?

Khim: Hi, Are there any way get the native value have sent from the message guys? exam in solidity we can use msg.value, in tact do we have anything simular with it?

Anton: context().value (reply to 39986)

Daniil: sender is not a public key.  what exactly are you trying to solve using checkSignature? If you're checking the incoming message source - it's enough to compare addresses. If you're working with some external entities then you usually just store their public key in contract. (reply to 39983)

Nerses: is there a way to get remaining value after msg processing ? as fees are payed from context().value (reply to 39988)

IMDb: Hello, every one. I am a newbie to Tact programming... I have some difficulties with the multiple mint in one function... One time mint works, but more than two fails, can't see the error, just said that failed transaction.      receive("Owner: Airdrop") {         let ctx: Context = context();         require(ctx.sender == self.owner, "Not Owner");         // self.mint(self.airdrop_info.communityWallet, 5000000000, self.owner);         // self.mint(self.airdrop_info.earlyContributorsWallet, 5000000000, self.owner);         // self.mint(self.airdrop_info.listingAndLiquidityWallet, 5000000000, self.owner);         self.mint(self.airdrop_info.developmentWallet, 5000000000, self.owner);         self.mint(self.airdrop_info.projectFundWallet, 5000000000, self.owner);     }

IMDb: Anybody who knows why?

Anton: are you using SendRemainingValue? if that is correct, read this https://docs.tact-lang.org/book/send#outbound-message-processing (reply to 39991)

IMDb: Yes, I use SendRemainingValue when mint

IMDb: Is this a problem, @AntonTrunov ?

Anton: Check out the link (reply to 39995)

IMDb: Yea, I checked but nothing special?

Cyril M |: sending remaining value on first message will send all the unused value. meaning the rest of the message wont be sent due to lack of gas

IMDb: Oh, that was it...

IMDb: 🙏

Cyril M |: only use send remaining value on the very last message you send

IMDb: Thank you, @cyrilns, @AntonTrunov

Cyril M |: also this is optional depending on your goal (reply to 40001)

Anton: Your precise case is explained there, check again (reply to 39997)

Cyril M |: and make sure you have enough gas for all the message. use bounce: true to return the gas if transaction fails

IMDb: Actually I was testing Jetton token contract on this example: https://tact-by-example.org/07-jetton-standard

IMDb: Here mint function was scheduled to use send with mode of SendRemainingValue.

Cyril M |: this example is outdated, you will have issues on decimal soon (reply to 40007)

Cyril M |: specially in burning tokens and no one will ever help you regarding it

IMDb: Oh, is it outdated?

Cyril M |: yes

IMDb: Where can I check the Jetton token contract example?

IMDb: Made by tact language

Cyril M |: i did some research few days ago. all of the examples were years ago

Cyril M |: i just follow the standard and created my own jetton and wallet

Cyril M |: https://github.com/ton-blockchain/TEPs/blob/master/text%2F0074-jettons-standard.md

Laisky: Is there a way to show transfered Jetton information on the Tonkeeper transaction confirmation screen?

Crypto 小V同学.eth: Hello, I am the project company. We are currently testing mint nft. We need a lot of test coins. Where can I link to more test coins? Help!!

Crypto 小V同学.eth: @cyrilns

Toan: Hi guys, I'm new with TON TACT  I followed this repo https://github.com/howardpen9/nft-template-in-tact?tab=readme-ov-file to deploy NFT collection smart contract with tact  After run yarn deploy I receive this contract and transfer 1 TON to this smart contract  Then use address contract to change in contract.read.ts but it keep return Invalid address. Please help me, thank you  https://testnet.tonviewer.com/0QCksnWtDG0yhNJFLGCT26zLbllAMds3wPAs8oEkPHuOtdq4

Laisky: Mining an NFT on the testnet requires less than 0.1 TON. Planning a mass launch on the testnet? 🤔 (reply to 40022)

Laisky: That code has many issues. If you're interested, here’s a tutorial I wrote: https://blog.laisky.com/p/ton-tact/ (reply to 40025)

Toan: thank you ser. You made my day 🙏. It took me 3 days keep research how to fix this and found nothing (reply to 40029)

Laisky: The GitHub link in the article includes a complete implementation of Jetton and NFT. If you have any questions or corrections, please don't hesitate to reach out to me. (reply to 40030)

Toan: if I want user to pay small amount for minting transaction for me. How can I add this transaction into contract ser? @laiskycai

blocksdev: I think you can just put a condition we’re it will check the ctx.value and if it’s less than the fee/price you can throw error

lienhage: Hey guys, I'm new in TON, I'd like to know which language should I begin with, Tact or func? Has Tact been ready for production?

king: tact is better

Crypto noobie: What's better about Tact?

Crypto 小V同学.eth: Yes, we are testing a large-scale mint. The project is incredible. There are about 80,000 test coins. How to solve this problem? (reply to 40026)

Cyril M |: is it possible to have array as input in tact?

Joaquim: Yes. Check the tact-lang cookbook/data-structures (reply to 40040)

Anton: depends on what kind of array you’d like  arrays simulated with maps: https://docs.tact-lang.org/cookbook/data-structures#array  short bit arrays: https://github.com/tact-lang/tact/issues/163 (reply to 40040)

Cyril M |: what's the max length an array can hold as input?

Tiqan: Hey i somehow get error when deploying a contract with blueprint.  AxiosError: timeout of 5000ms exceeded. Does anyone have an idea on how to fix this?

blocksdev: It’s a network issue (reply to 40044)

Tiqan: And what can I do then?

Anton: Tact does not have arrays. Maps can be several tens of thousands of elements because of contract state size limits on TON (reply to 40043)

Jb: Hey! Is there something similar or compatible with abi.encodepacked() function of solidity? Thanks

Cyril M |: ok (reply to 40047)

Nerses: what can be used as null address in TON ?

poppa: newAddress(0, 0x0) should work, if not https://t.me/tactlang/34327 (reply to 40050)

Nerses: thanks a lot (reply to 40051)

Jb: Hey have you found something similar to the abi.encodepacked or keccak for solidity? (reply to 40052)

Nerses: //     let hashlockFromSecret: Int = sha256(hashlockFromSecretSlice); (reply to 40055)

Jb: But sha256 uses sha2 while keccak uses sha3

Jb: And related to encoding like the abi.encodepacked?

Jb: I think the keccak can be done in fift though

Nerses: the previous code is analog of this solidity code in TACT sha256(abi.encodePacked(secret)) . I dont know how it works under the hood but in this way they gave same result (reply to 40058)

Jb: Ok thanks

Jb: Yeah but there are sometimes instead of sha256, solidity uses keccak256() which is a higher version of the sha

Jb: I saw in the dec2023 upgrade they added it but only through fift

Anton: will be available in Tact v1.5 through asm-functions, now you can do kind of the same but via FunC bindings (reply to 40063)

Jb: Do you have any resource please? (reply to 40064)

Anton: well, I’m the one who added the feature, lol  https://t.me/tact_kitchen/30 (reply to 40065)

Jb: Hahaha thanks, is that usable?

Jb: Meanwhile, do you have some func code to do that?

Anton: we are already using it in the Tact standard library (reply to 40067)

Jb: But is it available for usage? Can I import it somewhere?

Jb: Thanks!

Jb: Do you have the complete code for this? Seems cut . Thanks! (reply to 40056)

Nerses: oops.just saw that some part has been cut.          let hashlockFromSecretSlice: Slice = beginCell().storeUint(msg.secret,256).asSlice();         let hashlockFromSecret: Int = sha256(hashlockFromSecretSlice); (reply to 40073)

Jb: sorry I am having trouble importing the stdlib, where do I import it from, the tact-lang repo? Also how do I import it, as import "./stdlib" or import "@stdlib/..."? (reply to 40071)

Cyril M |: is there a way for sending message in typescript without the need to prompt from a wallet app? use mnemonic seed phrase to sign the transaction programmatically?

Jb: Hey sorry, do you have any insights on how to import the updated stdlib on tact? Since the asm is not in the npm package. Thanks! (reply to 40071)

⁭: I have 2 advanced questions about ton in general, not closely really related to tact, but still.  1) Is there a possibility to vanitygen contract address like in ethereum? or it's not really forecastable?  2) Any example of proxy-smart contract on ton? is it economically economically justified for user to create them? It would be few cents or few dollars?  Thanks.

— 2024-09-06 —

Anton: It’s on npm, use the next tag (reply to 40082)

IMDb: How to do multi-mint in one transaction? The case of SendRemainingValue is not working though, have to check gas manually. I have less experience with it, please give me some guide.

blocksdev: You can forward me the link of the hackathon (reply to 40106)

Vladimir: Can you please recommend any tutorial on Tact which just works? step-by-step  I spent 2 hours trying to deploy my first Tact contract from the tutorial here - https://docs.tact-lang.org/book/deploy  but I dont understand which command to execute deploy script should I execute and why it does not work out of the box   yarn create ton simple-counter --type tact-counter --contractName SimpleCounter  PS C:\Users\v\PycharmProjects\tact-sandbox\simple-counter> npx ts-node ./scripts/deploySimpleCounter.ts                      TypeError: Unknown file extension ".ts" for C:\Users\v\PycharmProjects\tact-sandbox\simple-counter\scripts\deploySimpleCounter.ts  PS C:\Users\v\PycharmProjects\tact-sandbox\simple-counter> npx run .\scripts\deploySimpleCounter.ts Watching C:\Users\v\PycharmProjects\tact-sandbox\simple-counter and all sub-directories not excluded by your .gitignore. Will not monitor dotfiles. Found & ignored ./build ; is listed in .gitignore Found & ignored ./node_modules ; is listed in .gitignore  Starting: .\scripts\deploySimpleCounter.ts (node:31268) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.

TopSecretAgent007: Hello How are you? I am ton smart contract developer

blocksdev: You should try this: npx blueprint run (reply to 40108)

SAJAHAN: S.A

pid | ton: is it possible to remove the collection list when we create an nft contract, then let users create their own content (UGC)? i use maps, but it seems inefficient.

Anton: Check out the Blueprint documentation https://github.com/ton-org/blueprint (reply to 40108)

Vladimir: works thnx 😊 (reply to 40111)

Vladimir: thnx (reply to 40117)

IMDb: How to catch the emitted message of contract?

Alex: I’m wondering if there are examples of large contracts written at Tact and deployed to main net?

Jb: Is it available for blueprint? (reply to 40103)

Anton: Blueprint just uses your package manager (yarn, npm, etc.), so yes (reply to 40133)

Jb: I did yarn add @tact-lang/compiler@next, installed the latest dev version, imported the @stdlib/deploy , still not able to use asm inline. Am I missing any part? That for blueprint  And in the tact template repo, did the same . (reply to 40134)

Anton: Check this wiki page please, let us know if it works for you: https://github.com/tact-lang/tact/wiki/Using-unreleased-versions-of-tools-early (reply to 40135)

Jb: Thanks

Jb: Do you have an estimate on when it will be released?

Anton: About ten days (reply to 40138)

Jb: Great, appreciate it!

......: anybody knows how to convert a raw address into MsgAddressInt in contract?

......: the raw address is a 256 bits data and we know it's on the masterchain or workchain

Mark: Hello 👋  Does anyone have the source code for a non-custodial wallet? On the ton blockchain. If anyone has, please unsubscribe in private messages.

Jb: Is it possible to send an “array” or a mapping as a parameter in a message? I need to be able to send an array of cells like Cell[]

Joel: Gotta use tuple (reply to 40150)

Jb: Do you have any example please? (reply to 40152)

Jb: Perhaps I missexplained, I need to send an external message to a receive function an array of cells of variable length

Jb: message ContractData {     contracts: map<Int, Cell>; } Something like this?

Alhamdulillah: Yes (reply to 40155)

Jb: Thanks

— 2024-09-07 —

Vladimir: I try to write upgradeable smart contracts but a bit confused    - in tact docs it's saying it's not possible  https://docs.tact-lang.org/book/upgrades   - I have found set_code instruction discussion  https://answers.ton.org/question/1597038683951730688/are-there-set-code-examples  - I have found upgradeable tact contract   https://github.com/wedvjin/ton-tact-contract-upgrade/blob/master/contracts/tact_v1.tact   So what is the current status of tact upgrades?  What risks a potential problems I should worry about?  How storage layout works in Tact?

Anton: https://github.com/tact-lang/tact/issues/27 (reply to 40163)

Vladimir: Thank you. As I understood, no problem with new logic, but better to not touch the storage :-)  I think I can use the hack and just create a map  Map(Uint256=>Uint256) keyValueStorage  Which I will be able to use for anything if I really will need new data variables in future (reply to 40164)

Anton: we will solve this eventually, hopefully in v1.6 (reply to 40165)

FakeName: Hey can i get any docs or previous soulbound NFT contract in tact ?

Irasad: Sure (reply to 40182)

FakeName: Thanks Irasad can you share resource link?

— 2024-09-08 —

Howard: ☠️☠️☠️ (reply to 40200)

غَيْث GhaetH: hi

غَيْث GhaetH: good morning

Mr. Handsome: Hi  i want to create my own mini game

Vladimir: I there anything like Eip712 signatures in TACT / FunC  I want to have a user claiming his rewards using off-chain signature from my verifier backend

Vladimir: found this but would like to see end-2-end example with some data signed by JS code and verified in contract - https://docs.tact-lang.org/ref/core-math#checkdatasignature

Sumit: you can use @noble/ed25519 library to sign cells in javascript (reply to 40208)

c9 👨‍🍳: gm gm, where i can find docs about sending Ton from mnemonic in JS

Vladimir: I have a  verifier: Address;  in my contract storage  how to convert Address to Int public_key as required by  https://docs.tact-lang.org/ref/core-math#checksignature  fun checkSignature(hash: Int, signature: Slice, public_key: Int): Bool;

Vladimir: look like i have to make an instance over my TON Wallet and then call int get_public_key() method_id   but i cant find how to make an instance of my wallet (reply to 40213)

Daniil: Hi guys!  Does anybody know how to calculate a hash of the struct?  I receive internal msg with struct Item: struct Item {     prop1: String;     prop2: String;     prop3: String;     prop4: String; } and I wanna save its hash with price in a small map like a catalog. If I use  sha256(msg.item.toCell().asSlice())  it returns the same hash for all incoming items (probably because it hashes only ref cell). So what is be the best approach of hasing a stuct with string fields (taking into account, that sha256 is relatively havy hash func and I can stand with lighter hashing)?

Vladimir: after I deploy my contract sending 0.05 TON i expect it to have some TON as a reserve to pay for storage  however, as i can see from the deployment transaction, the rest of unused TON was returned to the deployer  https://testnet.tonscan.org/address/EQAU9WyB6u_gDm1RfJa6SDiPYVmMnb2GWUSQrfbJ7iepx8cq#transactions  is it OK? how can I change it and leave some TON on the contract balance after deployment?

blocksdev: its completely okay,i believe  you change that behaviour in the init() part of the contract. (reply to 40218)

Vladimir: i dont have anything related to the returning TON back       init(         id: Int,         verifierPubKey: Int     ) {         self.id = id;         self.owner = sender();         self.verifierPubKey = verifierPubKey;     }  i am just afraid that if my contract will have 0 balance after deployment it can be removed since it cant pay for storage (reply to 40219)

blocksdev: then maybe its just default behaviour. you should read this NativeStorage and Deploy. (reply to 40220)

Vladimir: i try to use this library but get the error  export async function run(provider: NetworkProvider) {     const ed = await import('@noble/ed25519');   Error [ERR_REQUIRE_ESM]: require() of ES Module C:\Users\v\PycharmProjects\tact-sandbox\counter\node_modules\@noble\ed25519\index.js from C:\Users\v\PycharmProjects\tact-sandbox\counter\scripts\getRewards.ts not supported.                                         Instead change the require of index.js in C:\Users\v\PycharmProjects\tact-sandbox\counter\scripts\getRewards.ts to a dynamic import() which is available in all CommonJS modules.  i dont understand this lol, im python dev gpt4 did not help as well 😊  i dont use require since i already write await import (reply to 40209)

Toan: Hi guys, I want to write code that can buy offer NFT from Getgems. Is there any tutorial for this?

Toan: Also I read this tutorial for listing nft on marketplace https://docs.ton.org/develop/dapps/tutorials/collection-minting#deploy-marketplace  The one things that I concern is why do i need to deploy marketplace contract? Is Getgems have their smart contract for marketplace?

Anton: Hi, can you please create a bug report in Tact’s GitHub repo? (reply to 40217)

Anton: Are you using the Deployable trait? It has this behavior by default, but you can change it if you redefine the storage reserve constant from BaseTrait (reply to 40218)

Daniil: Hi, I have already fixed this issue) (reply to 40226)

Anton: What was the fix? (reply to 40228)

Daniil: item.toCell().hash(). (reply to 40229)

Vladimir: I get strange timeout issue when running my scripts which worked on TestNet on mainnet  AxiosError: timeout of 5000ms exceeded     at RedirectableRequest.handleRequestTimeout (C:\Users\v\PycharmProjects\tact-sandbox\counter\node_modules\axios\lib\adapters\http.js:657:16)

Vladimir: yeah, really strange, all my scripts works on testnet but on mainnet I get timeout all the time

stereo: from evm experience ... sounds like gas settings

Vladimir: My contacts are deployed on ton successfully, but my script can't wait for the contract, neither call any method and wait for response   Look like RPC issue (reply to 40234)

— 2024-09-09 —

M: Hi all, how can i parse a string from slice in tact? there is no loadString() for it.

Laisky: Just wrote an implementation for multi-mint. Check it out if you're still interested  https://github.com/Laisky/HelloWorld/blob/master/blockchain/ton/contracts/jettons/scripts/multimint.ts (reply to 40104)

Laisky: https://docs.tact-lang.org/ref/core-strings#sliceasstring (reply to 40253)

mgnfy_view: How do I accept Jetton deposits in my tact contract?

Laisky: follow TEP-0074 (reply to 40261)

Phil: How can I trace transaction before and after create transfer

Dmitry: Hi everybody! We made an educational TON based wargame https://www.hacktheton.com/ it will be helpful for beginners and everybody who want to learn more about how TVM works and how to develop safe TON smart contracts

6xiaowu9: Hi mates, Can anyone tell me how to convert the public key into a user address in the tact contract?

Anton: https://docs.tact-lang.org/book/debug#debug-mode (reply to 40271)

Nerses: Hi everyone, I'm using the ton/ton SDK, and when I call the master contract's public getter to retrieve the jetton wallet address, I get exit code -13. Could anyone help me understand what might be causing this error?

Jb: Hi! What is the difference between sending a dictionary in its original format and storing it inside a cell? is there any advantage in terms of storage or what?     const body = beginCell()         .storeDict(cellsDictionary)   // Store the dictionary (Int -> Cell)         .endCell(); and  directly sending cellsDictionary ?

Shuvo:     const body = beginCell()         .storeDict(cellsDictionary)   // Store the dictionary (Int -> Cell)         .endCell();

MD. ABUL: Okay (reply to 40287)

K..: Hi Everyone, how we do jetton token transfer using other contract. Like i have to transfer token from user wallet to contract address. Please share some code snippet. I am stucked please help

......: 7 - Type check error. An argument to a primitive is of an incorrect value type. 1 anybody knows what's this meaning?

......: have you resolved this problem? (reply to 1906)

— 2024-09-10 —

User<6563347363>: Hey, I just started playing on TON recently. Is there anyone who can show me around?

Lev: I think it was with an incorrectly formed message (reply to 40305)

ZombHunt: Is there a way to call getter function of another contract ?

Anton: no (reply to 40324)

ZombHunt: @AntonTrunov thank you. I'm working on a parent-child model. If there is a setting parameter in Parent contract, how do we notify all of the sub-contracts the setting is changed?

0xST: Hi, is there any sample for merkle tree using tact ?

Anton: if you have unbounded amount of children, this design won’t work, the children should ask the parent if something is changed, you cannot do these (potentially) massive updates (reply to 40326)

Anton: will be, once this PR is updated and merged https://github.com/tact-lang/tact/pull/343 (reply to 40327)

Ron: Mining link

Justin1: Hi, how can I skip the block timestamp in unit test environment?

Anton: https://docs.tact-lang.org/book/debug#tests-time (reply to 40336)

Alex: I started getting an error when using @orbs-network/ton-access. What could have happened?

ed: it is back (reply to 40340)

Setmax: Hey guys, Is there any way to partially sign a transaction? I want to send Jettons to another wallet and have the receiver pay the transaction fee.

blocksdev: You mean claimable contract funds (reply to 40342)

Setmax: Honestly, I dont know what exactly claimable contract funds is, but i'm looking for a way to transfer funds from walletA to walletB with have walletB pays the transaction fee. for this we need two signs from walletA and walletB owners, sender and fee payer. (reply to 40343)

K..: Anyone please reply (reply to 40291)

Jb: Hello how do you handle bitbuilder overflow? Is there a way to separate it into 2 and concatenate?

Nerses: can you give more context ? (reply to 40354)

Nerses: as I have encountered same problem,but not sure it will be exact your case

Nerses: My issue was in parsing emitted data

Jb: I am doing what I asked you some time ago about replicating the abi.encodepacked feom solidity but in tact. I did the beginCell().store…. But I need to store more than 1023 bits. Does storeRef do the work? , am I getting the same result or maybe doing 2 separate cells and then concatenate them. But I cant do it in the same because I have bit overflow. (reply to 40361)

Jb: I need to store lots of hashes and adresses, encode them and hash the result

Nerses: the only way to do it is to create tree of cells.As every Cell can have up to 4 Cell References.In this way you can create the tree (reply to 40362)

Jb: Yeah but with store ref? Also do you have any snippet you’ve built? Thanks! (reply to 40364)

Nerses: b_0.storeUint(3208455377, 32);         b_0.storeInt(src.commitId, 257);         b_0.storeStringRefTail(src.dstChain);         b_0.storeStringRefTail(src.dstAddress);         let b_1 = new Builder();         b_1.storeStringRefTail(src.dstAsset);         b_1.storeAddress(src.sender);         b_1.storeAddress(src.srcReceiver);         b_1.storeStringRefTail(src.srcAsset);         b_1.storeInt(src.amount, 257);         let b_2 = new Builder();         b_2.storeInt(src.timelock, 257);         b_2.storeAddress(src.messenger);         b_2.storeAddress(src.jettonMasterAddress);         let b_3 = new Builder();         b_3.storeAddress(src.htlcJettonWalletAddress);         b_3.storeInt(src.senderPubKey, 257);         b_3.storeDict(src.hopChains, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());         b_3.storeDict(src.hopAssets, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());         b_3.storeDict(src.hopAddresses, Dictionary.Keys.BigInt(257), dictValueParserStringImpl());         b_2.storeRef(b_3.endCell());         b_1.storeRef(b_2.endCell());         b_0.storeRef(b_1.endCell()); (reply to 40365)

......: Thank you. I will check my code again (reply to 40319)

Jb: Thank you! And you hash just b_0? (reply to 40366)

Jb: My only doubt is that if I hash b_0 it will include all the ref cells. But I guess I have to test it

Nerses: yeah it will include all your data (reply to 40369)

Jb: Thank you very much (reply to 40370)

dotfx: Hi! Can you query an external contract (send() ?) and receive its returned result within the same function? I need to retrieve jetton's name, symbol and totalSupply within the same function and send it back to the sender using a struct

dotfx: Thanks for your reply. So you can't return to the user an external reply within the same call, not even wait for the reply, async maybe? (reply to 40376)

dotfx: Understood. I could fill the "missing" data by making off-chain calls, as the final result will be displayed on a frontend Not ideal for your RPC credits if you have to call 5-6 fun at once, but that's an alternative Thanks (reply to 40378)

Andrew: Hey! I created a wallet in tonkeeper. And I'm trying to get the wallet address in python and tonsdk by passing the mnemonic to Wallets.from_mnemonics(). But as a result I get an address that does not match the original one from tonkeeper. Maybe someone knows what the reason could be?

Jb: Dont use tonkeeper, I dont like it personally. Use the openmask ton wallet chrome extension, it is basically metamask (reply to 40380)

Jb: Hey I tried doing: sha256((builder_0.storeRef(builder_1.endCell())).asSlice()); And the result is the same as doing:  sha256((builder_0).asSlice())  It isnt including the ref cell. Do I need to load it or smth? (reply to 40370)

Nerses: Can I see how you constructed builder_1 ? (reply to 40383)

Jb:          let builder_0: Builder = beginCell().storeUint(123456, 256)                     .storeUint(msg.maxSequenceTimestamp, 64);         let builder_1: Builder =  beginCell().storeUint(123456, 256);         builder_0.storeRef(builder_1.endCell()) I just put some random dummy values to test

Jb: I guess it makes sense because it doesnt store the ref cell in the value of the cell.

Jb: But I was wondering if there was a way to pack everything and hash it.

Nerses: //     .storeAddress(myAddress()).storeAddress(ctx.sender).storeUint(ctx.value, 120)             //     .storeRef(beginCell().storeRef(msg.data.dstChain.asSlice().asCell()).storeRef(msg.data.dstAsset.asSlice().asCell())             //         .storeSlice(msg.data.dstAddress.asSlice()).endCell())             //     .storeRef(beginCell().storeRef(msg.data.srcAsset.asSlice().asCell()).storeAddress(msg.data.srcReceiver)             //         .storeUint(msg.data.timelock, 64).storeAddress(msg.data.messenger).endCell())             //     .endCell().hash(); (forwarded from Nerses)

Nerses: I have done something like this.trying to solve the problem you mentioned (reply to 40387)

Nerses: Are you sure that in b_0 there isn't all data you stored? (reply to 40383)

Jb: Yeah, I dumped both of hashes and they give the same. With the store ref and without it.

Nerses: Very interesting. I will try to do same tomorrow and figure out (reply to 40391)

Jb: Ok, me the same. I’ll update you if I find something. But at first the most logical thing to do is load the refs.

User<5762094943>: BTW, let me Know  this is contract, in your mind how can I add metadata here any idea or guide,  https://github.com/ton-community/compressed-nft-contract

Andrew: it turned out that the tonkeeper wallet has version v5, which not support by tonsdk (reply to 40380)

— 2024-09-11 —

cubby: Hello. Is anyone looking for a blockchain engineer?

Laisky: I have a thought that I’m uncertain about: the TON protocol does not have built-in defenses against message replay attacks. This means that an attacker could replay historical messages, and contracts must implement their own defense against replay attacks using a nonce. Is that correct?

dotfx: Hi! After sending some ton to another account, is myBalance() immediately updated and can be called within the same function?

Anton: does this answer your question? https://docs.tact-lang.org/ref/core-common#mybalance (reply to 40408)

dotfx: thanks! (reply to 40409)

Anton: if you know the concept of send works, then it should be immediate that myBalance cannot be updated: send just adds a message to the message queue, there is no actual send after executing that line of code with send (reply to 40408)

dotfx: right, not until it is really processed (next tx) thanks for your clarification (reply to 40411)

Mouad: ٠

dotfx: Has anyone some url/resources on how to create/add liquidity pools on Stonfi v1/v2 and DeDust using Tact (with op codes if needed)?

dotfx: basically this!

Neo: Hi everyone , who knows why i withdraw from contract failed

Neo: and i can't find this Exit code 16059 in my builed code

ashes: Is there a way to get the current jetton balance of specific JettonMaster inside the contract?

Руслан: Good day) I created a simple token - a smart contract based on an example. I want to add the following option in it: When one person sends tokens to another, I want to make some token commission go to the wallet of the admin who created the tokens. Is this possible?

cubby: yes, it's possible (reply to 40431)

Руслан: when tokens are sent from one user to another - the contract works fine. but if add a method to send a commission, then the transaction fails, and TON takes a large commission of 1.05 tones. 2 send methods don't work  receive(msg: TokenTransfer) { // 0xf8a7ea5  first method send to: wallet_user,               body: TokenTransferInternal              ............    second method send to: wallet_admin,               body TokenTransferInternal               ........... after add second method, transaction failed and transaction fee is 1 ton } (reply to 40432)

Руслан: Here is my question in more detail: https://github.com/howardpen9/jetton-implementation-in-tact/issues/22

cubby: i will check now (reply to 40434)

Руслан: Thank you ) (reply to 40435)

K..: Anyone please share the code of send jetton token using other contract

K..: I am geeting error in this please help to solve error

Danil: Which error u got?

K..: Thanks for your kind response, I am getting 65535 - Exit Code (reply to 40443)

Andrew: Hi I am testing sending 0.001 ton from wallet to wallet using python and tonsdk. Sometimes the transaction is successful, but very often the error occurs:  LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to get account state  Maybe someone knows what could be the reason and how to solve it?

......: 65535 is the same as 0xffffffff, which is the op mismatch error for the most of contracts (reply to 40451)

Tiqan: Can i store any address as Slice? I do not want tact_verify_address to be called

FakeName: My Nft Contract is Bounced & getting fail!

FakeName: Can anyone help me with this ?

Tiqan: Or is it even more cost efficient to store it as uint256? (reply to 40457)

Tiqan: But this guy says to store as uint256 (reply to 8571)

Tiqan: https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract

Tiqan: This says addresses are 256 bits

Tiqan: Or do I understand something wrong?

— 2024-09-12 —

FakeName: Error getting address by index: Error: Unable to execute get method. Got exit_code: -13     at TonClient.runMethod (/Users/jayanthkoppala/Desktop/Developer/2/NFT_QUIZ_REWARD/node_modules/ton/dist/client/TonClient.js:55:19)     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) Error querying NFT address: Error: Failed to get address by index     at CollectionService.<anonymous> (/Users/jayanthkoppala/Desktop/Developer/2/NFT_QUIZ_REWARD/dist/app.js:71:23)     at Generator.throw (<anonymous>)     at rejected (/Users/jayanthkoppala/Desktop/Developer/2/NFT_QUIZ_REWARD/dist/app.js:29:65)     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)   Is it problem from Ton Api or Am i fetching it wrong?  The problem is 3 out 1 transactions are successfull (forwarded from FakeName)

Laisky: https://s3.laisky.com/public/nft/connect/demo/index.html Share a complete implementation that includes Jetton, NFT, scripts, and TonConnectUI.

Nerses: Hi everyone,  I’m building a smart contract that needs to send notifications (messages) to users for certain events. I’m wondering if there’s a standard message format or structure that works with different wallet versions. My aim is to make sure these notifications are compatible across various wallets so all users get them.

Urban: when creating custom messages.. is there a guideline how to generate the opcode?  Example: message(0x03c672ca) WithdrawTokens {}   I know its not mandatory, but it's a pain in the ass to always go looking into the compiled code and finding the generated opcode, that I then use in scripts

Nerses: you can fix your opcode. (reply to 40482)

Urban: I know. But is there a guideline or just random 32bit and go nuts?

Nerses: I havent seen any,but maybe I am mistaken (reply to 40484)

Anton: no, there are no real guidelines, go nuts :)  two points worth mentioning, though:  - to communicate with contracts written by others you have to specify their message opcode, of course;  - don’t use 0 as opcode, as it is reserved for text messages (Tact v1.5 will be complaining if you try this) (reply to 40484)

Daniil: Hey, how catizen avoid regulations and able to accept payments on phone with $TON via pluto top-up?   Because in the game on phone you are not able to pay with crypto, but in the top-up app you can.  How?

Chad: struct Point{     x: Int as uint64;     y: Int as uint64; }  message Add {     point: Point; }   how to write?     await counter.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Add',             point: ''         }     );  please help?

Darius: is ton testnet down?

Darius: nvm, seems that tonviewer only

Tiqan: What is that "as remaining" for?

Anton: https://docs.tact-lang.org/book/cells#serialization-remaining (reply to 40498)

Tiqan: thanks

Chad: yes i think not working for me also (reply to 40494)

Darius: Is tonconsole the only events streaming service there? Couldn’t really found anything more than basic API service

Anton: not yet, but it’s coming in a week or two (reply to 40504)

Jb: But is it possible building it from scratch? (reply to 40505)

Anton: sure, but no documented examples, afaik

Jb: Ok thanks! Is it coming with the 1.5 asm?

GyNanzo: Can i get docs for tact language?

Cyril M |: is testnet down?

Md Ridoy Khan: No (reply to 40519)

Darius: tonviewer testnet api was down, seems to be fine now (reply to 40519)

Jb: Hello, how do you deal with data such as hashes that return uint256 and need to store it in runtime function that converts it to Int257. Example: fun getRoot() : Int {         let node: Int = 0;          node = sha256(values to be hashed);    return node }  Will my node be of type uint256 or break it into int257?

dotfx: map<Int as uint32, Int as coins>  with value declared as Int as coins, compiler crashes with value: Int as uint256 or not even specifying a serialization, everything is ok

Laisky: This is not just a tool, it’s a template code includes Jetton & NFT. You can do whatever you want by copy and modify the source code.  Next, I plan to rewrite it into a trait that is easier to modify. (reply to 40511)

— 2024-09-13 —

Lawson: Hey guys, can someone tell me how to call a function like this which is imported from an external funC lib? The lib extends the native math lib, it adds a new function called sqrt. Seems I map it with the wrong way as an error throw with this mesage "Function 'sqrt' does not exist in imported FunC sources", thank you in advance!

lv: excuse me， I want to call the get_wallet_data method of a jetton wallet in the contract, how should I write the code

Laisky: Getter methods cannot be called on-chain; contracts can only interact with each other through messages. (reply to 40545)

Nerses: I’m working on a TACT smart contract where I need to send a text message to users that includes some variable data. In JavaScript, I can use string interpolation like ${var} here is the data. How can I achieve something similar in TACT? Specifically, I want to concatenate variable values into a message string.

Laisky: https://docs.tact-lang.org/ref/core-strings#stringbuilderconcat (reply to 40549)

Nerses: thanks a lot (reply to 40550)

Urban: A question regarding tests. I have a contract that does some processing when it recieves a jetton (via transfernotification msg) and then if certain conditions are met it also triggers an outbound transfer. Currently I have a mock jetton contract, that I initialize in tests. But I'm probably doing this wrong. Does anyone have an example of *test* where you test minting / transfers / notifications / ....

&rey: Store verifier's public key, obviously. (reply to 40213)

&rey: Instead of address, because why would it even be a wallet.

Jiego: hi guys! Quick question, how can i check if a transaction was successful and if not, its error message while testing? I set a require(condition, errorMessage) function on my tact SC but im not sure how can I check if it was correctly handled

Jiego: seems like this would do, but im not sure what this means

Jiego: nevermind, found it

Jiego: https://docs.tact-lang.org/ref/core-debug#require  For anyone needing that information, here https://docs.tact-lang.org/ref/core-debug#require

Jb: Hello , is there a way to get block properties like blockhash(), block.number, etc?

&rey: Of which block, precisely? (reply to 40568)

Jb: Actual

&rey: From which language? At least, backend or frontend?

Jb: In tact

Jb: Inside a smart contract

&rey: You know that block hash is determined by all block contents and is therefore undefined at contract execution time?

&rey: Block height... of shardchain or masterchain? Though, neither is accessible inside contracts IIRC.

Jb: No, I did not know that.  I wanted to do something like this in solidity:             uint256 lastBlockHash = uint256(blockhash(block.number - 1));

&rey: Oh. This might have some solution.

&rey: I feel this is basis for unsafe code. What are you trying to achieve?

&rey: You need TVM asm intrinsic. For opcodes, look here (and a bit above the position on page): https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#opcodes-to-work-with-new-c7-values. (reply to 40579)

Jb: Ok thanks, and this will be introduced in 1.5 version right? Only way to use asm in tact rn.

&rey: Use FunC binding.

Jb: Ok thanks!

Anton: Yes, this will be in v1.5, but with v1.4.4 you have to use FunC bindings (reply to 40581)

— 2024-09-14 —

Iwarah: Hello 👋guys new here

blocksdev: Hey, welcome here.  You can ask your questions here (reply to 40592)

Sol: why is there a func library?

🪬: Im facing this error

— 2024-09-15 —

Mohit Madan: Hey guys

Mohit Madan: Has anyone been able to create a factory contract with TACT/FUnC?

Laisky: https://t.me/tactlang/40478 take a look at this (reply to 40624)

Jiego: Wdym? A contract that deploys other contracts? (reply to 40624)

Cyril M |: i have (reply to 40624)

Vladimir: I have. In fact, it’s smth like nft collection (reply to 40624)

User<6414394130>: Yes

User<6414394130>: I have

traceur: Hello, does anyone know how to debug when running test failed on the “toHaveTransaction”? The console output doesn’t give any hint why the tx failed.

traceur: I’m using blueprint + tact

Anton: 🎉 Tact v1.5.0 has just been released  The new Tact release v1.5.0 just landed on NPM! Here are the highlights of the most important features.  🛠 New Tact features  asm functions allow you to access the deep dark corners of TVM for more features or better performance:    asm fun keccak256(s: Slice): Int {     1 INT HASHEXT_KECCAK256 }   asm functions have some limitations at this point and the Tact team will make them even more powerful in the next releases.  - A wider range of serialization options for integers can now be used, not just 8, 16, 32, 64, 128 and 256-bit integers, but anything in between: uint1 through uint256 and int1 through int257. For instance, a 48-bit timestamp can be defined now if you'd like to build contracts that can work after the year 2038:   contract Contract {     timestamp: Int as uint48 }   - Constant definitions now support calls to user-defined functions and references to other constants:   const CONSTANT: Int =     myFunction(OTHER_CONSTANT)   👩‍💻 New builtin and stdlib functions and methods  - The exists method for the Map type: m.exists(key) which is equivalent to m.get(key) != null.  - The deepEquals method for the Map type: m1.deepEquals(m2) -- you can now easily compare two maps with the same key-value pairs and get true as the result, even if their internal representations are different, so the hash-based == comparison would return false.  - The toSlice method for structs and messages: struct.toSlice().  - The new slice, rawSlice, ascii and crc32 built-in compile-time functions to help you define constant integers and slices more conveniently.  - The new stdlib functions to help with fee calculations: gasConsumed, getComputeFee, getStorageFee, getForwardFee, getSimpleComputeFee, getSimpleForwardFee, getOriginalFwdFee, myStorageDue. This brings you access to the TVM instructions from 2023.07 and 2024.04 upgrades.  - The parseStdAddress and parseVarAddress stdlib functions allow you to parse slices into structured addresses.  🐞 The new release also includes a bunch of bugfixes. Thanks to all the Tacticians for all the issues you open!  📜 Full changelog for Tact v1.5.0: https://github.com/tact-lang/tact/blob/main/CHANGELOG.md#150---2024-09-15 (forwarded from TON Dev News)

dotfx: won't work without installing husky package

Jiego: whats the error? (reply to 40642)

Jiego: i used this as a guide https://github.com/orbs-network/ton-vote-contracts/blob/main/contracts/proposal-deployer.tact (reply to 40624)

Jiego: how do i update if im using blueprint? (reply to 40644)

Jiego: if i needed to check a variable inside one contract on another contract, how could i do that?

Jiego: i think i got it https://tact-by-example.org/03-messages-between-contracts

TYGGËR: Okay (reply to 40664)

— 2024-09-16 —

traceur: The error is just simple: it should expect to have a transaction which is successful, but the result is that transaction is not successful. And the console output doesn’t tell me why transaction is failed. (reply to 40652)

Jiego: Send the log? (reply to 40669)

Jiego: for some reason these values dont get dumped

Jiego: any idea why?

Jiego: https://github.com/tact-lang/tact/issues/16   that needs to be on the book

Jiego: apparently it doesnt get dumped but its working anyway so whatever

Chad: How to create nested map? stakes: map<Address, map<Address, Stake>>;

traceur: I want to write a receive function that user send certain amount of tons along with the gas. After gas is consumed, the smart contract should keep the remaining ton. How should I implement this feature?

traceur: okay thanks. So context().value basically is same as msg.value in solidity? In solidity msg.value does not include gas. In tact, does context().value include gas? If context().value includes gas, how can I make sure the contract receive exact amount of ton (Ex. 1 ton, besides gas fee) (reply to 40689)

traceur: How do I use the SendPayGasSeparately flag in sandbox test? Looks like there is no mode field on the send function. (reply to 40695)

traceur: so i tried to print out the transaction fees. I send 35 ton initially, after transaction, my smart contract has 0 balance. It shows “34.9 ton is valueOut”, where does this 34.9 ton go?

traceur: This is part of the  code in my receive function, which call’s another smart contract. Is it because I set the mode to SendRemainingValue, that the remaint 34.9 ton are all sent to another contract?

traceur: Yes I’m using deployable trait, but my test is based on other recevier function, so it should not be a problem. (reply to 40701)

traceur: what mode should I use instead of SendRemaingValue? I tried mode 0, but will result exit code 40(not enough gas) (reply to 40700)

traceur: SendPayGasSeparately is also not working

Jb: Hello I updated to 1.5 in blueprint with :  yarn upgrade -P @tact-lang/compiler  and am receiving this error when compiling:  TypeError: paramSet.isSubsetOf is not a function Error: Could not find boc in tact compilation result

Сева: Hello guys do I need database to keep inforamtion about pools? Or I can just get information from blokchain and it's enough?

Anton: the minimal required Node.js version is 22 for Tact v1.5.0 (reply to 40705)

AB: How to deploy contract  front-end  ??

Jiego: Netlify, vercel, some cool vps (reply to 40709)

AB: Smart contract (reply to 40710)

Jiego: https://docs.tact-lang.org/book/deploy (reply to 40711)

🥕: does anyone know, how to genearate ton address with specific symbols, like $not jetton master ends with “NOT”

🥕: solana cli has built-in solana-keygen tool, what about ton?

Jb: Upgraded it, still unable to use inline asm, it is not recognized. (reply to 40708)

🥕: m? (reply to 40714)

Anton: We test Tact on Linux/macos/Windows, including compatibility with Blueprint:  https://github.com/tact-lang/tact/blob/main/.github/workflows/tact.yml (reply to 40717)

Jb: I've tried on windows, on my actual project, and also created a new blueprint just in case. But can't compile as the asm key is not recognized. Idk if I have to do some extra stuff (reply to 40719)

Anton: what does your lock file have? @tact-lang/compiler is the package of interest (reply to 40720)

Jb: Yeah I've checked it it says: "@tact-lang/compiler@^1.4.0", "@tact-lang/compiler@^1.4.4":   version "1.5.0"   resolved "https://registry.yarnpkg.com/@tact-lang/compiler/-/compiler-1.5.0.tgz#1a3c3c9faf32c41fbab269db9fe2af24b7f9c360"   integrity sha512-VN/E81VDwwyoE6H8NrX2Sfp63Y3N0Jdk349tg48YjdoTmyDEpiEbpHajfRoy04ZoxLKwbOD6213qflyv9g52Mw==   dependencies:     "@tact-lang/opcode" "^0.0.16"     "@ton/core" "0.57.0"     "@ton/crypto" "^3.2.0"     blockstore-core "1.0.5"     change-case "^4.1.2"     crc-32 "1.2.2"     ipfs-unixfs-importer "9.0.10"     json-bigint "^1.0.0"     meow "^13.2.0"     mkdirp "^2.1.3"     ohm-js "^17.1.0"     path-normalize "^6.0.13"     prando "^6.0.1"     zod "^3.22.4"

Jb: And blueprint is downloading the ^1.4

Jb:  "@ton/blueprint@^0.22.0":   version "0.22.0"   resolved "https://registry.yarnpkg.com/@ton/blueprint/-/blueprint-0.22.0.tgz#58ee2cb666bd15b0ee1bb119f7051b5ede6cdae6"   integrity sha512-+2HeuyGTogitavxZvH4TP0Cpr7y1muSTRva4uLxiiF9emliCqzKLuHgv+3rGr+lZGCcmjsld+U3TKsX+LVEqsg==   dependencies:     "@orbs-network/ton-access" "^2.3.3"     "@tact-lang/compiler" "^1.4.0"     "@ton-community/func-js" "^0.7.0"     "@tonconnect/sdk" "^2.2.0"     arg "^5.0.2"     chalk "^4.1.0"     dotenv "^16.1.4"     inquirer "^8.2.5"     qrcode-terminal "^0.12.0"     ton-x "^2.1.0"     ts-node "^10.9.1"

Jb: The same on a newly created blueprint and an upgraded project.

Anton: hmmm, ^1.4.0 means from 1.4.0 to  2.0.0, maybe some caching issues?

Jb: I'll try cleaning the cache

Jb: My cache says 1.5 on the tact compiler version, but when compiling it still throws it.   Tact compilation failed                                                                                                                                                                                                                                                                         Error: contracts\sparse_merkle_tree_lib.tact:160:9: Parse error: expected ":"                                                                                                                                                                                                                                   Line 160, col 9:   159 | > 160 |     asm fun keccak256(s: Slice): Int {                 ^   161 |         1 INT HASHEXT_KECCAK256 (reply to 40726)

Jb: Can you please double check when creating a blueprint project works for you?

cubby: Hello. Is anyone looking for a blockchain engineer?

Anton: here is a workaround:   npm install husky npm install @tact-lang/compiler (reply to 40729)

Anton: thanks a lot for the report, we will take care of it

Jb: Using yarn also possible?

Anton: I haven’t tried, but should be (reply to 40733)

Jb: np, thanks you for everyithing 😂 (reply to 40732)

Jb: I had an error on blueprint when creating a new project, related to husky also. And had to separate the installation and creation of a new project with contracts in 2. But I'll try on the existing one.

Jiego: whats the best way to get my opcodes?

Jiego: for my functions, that is

Goldmaster525: Hello, talents. I need your help.  As I was deploying airdrop contract and trying to transfer method, I got an error.   https://testnet.tonviewer.com/kQAx66S9GCN9e9iNeMBEng_vIw4UO0422khgfIvwJTt5sj8n  You can check contract here and there are failed transactions.   Please help me urgently.  Thanks

Denis: Hello! Can't find answer by search: In tact by example forward_payload has Slice type(as remaining) But in docs on official site it has Cell type. What option is correct?  We have both variants in mainnet (from two different teams) and i need to communicate with both. Should i separate them, or it's fine to pass argument with cell type (in tests Slice version accept Cell, but not vice versa). P.S. in theory we can redeploy Slice version if nothing wrong with Cell and it's be better for future interactions.

⁭: where to asc nob questions about sc in general?) how to keep state and so on

Сева: Hello guys, did somebody have problem with installation tact on ununtu 24.04? I can not build blueprint because of tact compiler: ~/ton-smart-contracts-tutorial/FirstLesson$ npx blueprint build Using file: FirstContract Build script running, compiling FirstContract ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function     at resolveFunctionDescriptor (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@tact-lang/compiler/dist/types/resolveDescriptors.js:600:31)     at resolveDescriptors (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@tact-lang/compiler/dist/types/resolveDescriptors.js:1243:19)     at precompile (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@tact-lang/compiler/dist/pipeline/precompile.js:18:55)     at Object.build (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@tact-lang/compiler/dist/pipeline/build.js:62:43)     at doCompileTact (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@ton/blueprint/dist/compile/compile.js:113:28)     at doCompileInner (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@ton/blueprint/dist/compile/compile.js:127:22)     at doCompile (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@ton/blueprint/dist/compile/compile.js:142:23)     at async buildOne (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@ton/blueprint/dist/build.js:21:24)     at async build (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@ton/blueprint/dist/cli/build.js:33:9)     at async main (/home/vsevolod/ton-smart-contracts-tutorial/FirstLesson/node_modules/@ton/blueprint/dist/cli/cli.js:91:5) Error: Could not find boc in tact compilation result

— 2024-09-17 —

Jiego: how did you install it? (reply to 40759)

Anton: You need Node.js 22 (reply to 40759)

Albert: hello everybody, i want to subscribe an account to listen transfer transaction, now i am using ton-api/streaming lib with traceObserver.subscribe function . But sometimes, it can't catch the transfer transaction. Could u pls let me know your idea about my issue?

J: https://t.me/tgresistancebot/letter  Join the #DigitalResistance. Sign the Open Letter to #FREEDUROV.

Nerses: Hi all, I’ve created a smart contract and I’m interacting with it through a script. However, in the wallet, I can only see the opcodes of the function call, not the function name. Is it possible to make the function name visible in the wallet? Any advice would be appreciated!

Сева: Local installation as mentioned here  https://docs.ton.org/develop/smart-contracts/sdk/javascript (reply to 40763)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Hello guys! It's possible to get address of received jetton?

Jiego: yes, pen and paper (reply to 40795)

Sol: Build script running, compiling Ee ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function     at resolveFunctionDescriptor (C:\Users\legal\ee\node_modules\@tact-lang\compiler\dist\types\resolveDescriptors.js:600:31)     at resolveDescriptors (C:\Users\legal\ee\node_modules\@tact-lang\compiler\dist\types\resolveDescriptors.js:1243:19)     at precompile (C:\Users\legal\ee\node_modules\@tact-lang\compiler\dist\pipeline\precompile.js:18:55)     at Object.build (C:\Users\legal\ee\node_modules\@tact-lang\compiler\dist\pipeline\build.js:62:43)     at doCompileTact (C:\Users\legal\ee\node_modules\@ton\blueprint\dist\compile\compile.js:113:28)     at doCompileInner (C:\Users\legal\ee\node_modules\@ton\blueprint\dist\compile\compile.js:127:22)     at doCompile (C:\Users\legal\ee\node_modules\@ton\blueprint\dist\compile\compile.js:142:23)     at async buildOne (C:\Users\legal\ee\node_modules\@ton\blueprint\dist\build.js:21:24)     at async create (C:\Users\legal\ee\node_modules\@ton\blueprint\dist\cli\create.js:102:9)     at async main (C:\Users\legal\ee\node_modules\@ton\blueprint\dist\cli\cli.js:91:5) Error: Could not find boc in tact compilation result Error: Command failed: npm exec blueprint -- create Ee --type tact-empty     at genericNodeError (node:internal/errors:984:15)     at wrappedFn (node:internal/errors:538:14)     at checkExecSyncError (node:child_process:890:11)     at execSync (node:child_process:962:15)     at main (C:\Users\legal\AppData\Local\npm-cache\_npx\314ef3dfcdb14211\node_modules\create-ton\dist\cli.js:133:34) {   status: 1,   signal: null,   output: [ null, null, null ],   pid: 11148,   stdout: null,   stderr: null }    help please

Sol: (node:5088) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead. (Use node --trace-deprecation ... to show where the warning was created) C:\Users\legal\ee\wrappers\Ee.compile.ts already exists, not changing. C:\Users\legal\ee\wrappers\Ee.ts already exists, not changing. C:\Users\legal\ee\contracts\ee.tact already exists, not changing. C:\Users\legal\ee\scripts\deployEe.ts already exists, not changing. C:\Users\legal\ee\tests\Ee.spec.ts already exists, not changing. Build script running, compiling Ee ⏳ Compiling...   > Ee: tact compiler    > Ee: func compiler    > Packaging    > Ee    > Bindings    > Ee    > Reports    > Ee  ⚠️ Make sure to disable debug mode in contract wrappers before doing production deployments!  ✅ Compiled successfully! Cell BOC result:  {   "hash": "7d2a0d15c473af96a2f7b3a6e3904fbe321008da53f137d9484db6166d7506cd",   "hashBase64": "fSoNFcRzr5ai97Om45BPvjIQCNpT8TfZSE22Fm11Bs0=",   "hex": "b5ee9c7241020a010001a9000114ff00f4a413f4bcf2c80b0102016202090292d001d0d3030171b0a301fa400120d74981010bbaf2e08820d70b0a208104ffbaf2d0898309baf2e088545053036f04f86102f862db3c59db3cf2e08230c8f84301cc7f01ca00c9ed5403050134ed44d0d401f863d20030916de0f828d70b0a8309baf2e089db3c0400026d018a0192307fe07021d749c21f953020d70b1fde8210946a98b6ba8ea7d31f018210946a98b6baf2e081d33f0131c8018210aff90f5758cb1fcb3fc9f84201706ddb3c7fe0307006013c6d6d226eb3995b206ef2d0806f22019132e2102470030480425023db3c300701cac87101ca01500701ca007001ca02500520d74981010bbaf2e08820d70b0a208104ffbaf2d0898309baf2e088cf165003fa027001ca68236eb3917f93246eb3e2973333017001ca00e30d216eb39c7f01ca0001206ef2d08001cc95317001ca00e2c901fb080800987f01ca00c87001ca007001ca00246eb39d7f01ca0004206ef2d0805004cc9634037001ca00e2246eb39d7f01ca0004206ef2d0805004cc9634037001ca00e27001ca00027f01ca0002c958cc0011a1857dda89a1a40003df259536" (reply to 40798)

Gainer: if i deploy child contract from parent contract , can i check          context().value() and  context().sender  in child constructor?  And can i send all neccessary params to child constructor using           let init: StateInit = initOf DealContract(self.id, etc.........); And don't sending a message in body?

Showrov: Yes (reply to 40806)

MD: Thanks (reply to 40809)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Guys, does anyone know why this message isn't catching my jetton transaction?  message(0x7362d09c) JettonTransferNotification {     query_id: Int as uint64;                // arbitrary request number     amount: Int as coins;                   // amount of jettons to transfer     sender: Address;                        // address of the sender of the jettons     forward_payload: Slice as remaining;    // optional custom payload }

— 2024-09-18 —

traceur: I have a receive function which will send two messages. Code is like this:  receive(“some message”) {     send(SendParameters{                 to: walletAddress,                  value: 0,                 mode: 0, // not sure which mode to choose                 body: {….}             });} send(SendParameters{                 to: walletAddress,                  value: 0,                 mode: SendRemainingValue, // not sure which mode to choose                 body: {….}             });} }  I don’t know which message mode to use for these two sending messages. Can anyone help me with that?

Laisky: You must manually set the value and cannot use SendRemainingValue for multiple send. You can take a look at this implementation: https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact#L142-L187 (reply to 40815)

Pratham: I am not getting seqno of any wallet can anyone please help me?

Pratham: https://toncenter.com/api/v3/wallet?address=UQBfUBEt9PcIuyVJgEWJfpF5HdnB3VHm1kZXhfSGHD5_9E5X

Pratham: This api is not working is there any problem with ton server?

Pratham: Please tell me

Mikael: Cannot evaluate expression to a constant: calls of "toString" are not supported at this moment  Why this problem caused during compilation?

Georgiy: Could you share the source code that this error points to? (reply to 40825)

Anton: you are using toString which is not supported at compile time at this moment, we are gradually enlarge the fragment of Tact that can be used in constant initializers, so it might be resolved in the next release  if you shared your code, we might be able to offer a workaround (reply to 40825)

Cyril M |: does self.reply costs ton?

Mikael: I have field in message  amount: Int as coins; And send message with this field to contract , but forgot that i can set this value to value field in transfer and i tried to wrap  ton(msg.value.toString())  but finally i corrected this mistake, everything good @jubnzv @AntonTrunov

Mikael: i have another question. If i create contract and i need to send value when i deploy this contract. How to make ton coins remain on contract, not sending back to deployer? (reply to 40830)

Nerses: I think it can be done specifying bounce:false , as deployment is also sending message (reply to 40841)

P.H | Skate: hi, does importing func code support files with #include?

P.H | Skate: E.g. Im trying to import USDT source code from func to use with tact.   But compiler seems to source file in the build directory thus giving func file not found error

Mikael:  const deployResult = await DealContract.send(             admin.getSender(),             {                 value: toNano('0.05'),                 bounce: false,             },             {                 $$type: 'Deploy',                 queryId: 0n,             },         ); (reply to 40844)

Mikael: after that in tests i check           console.log('Contract balance ', await DealContract.getContractBalance());  getContractBalance is from  get fun contractBalance(): Int {         return myBalance();     }  function in my contract

FakeName: is it possible to make nft item metadata dynamic   as like storing marks of students ?

Nerses: I think in this way it shouldnt return the amount (reply to 40849)

Mikael: unfortunately it isn't (reply to 40852)

Mikael: @jubnzv @AntonTrunov guys, maybe you know? (reply to 40841)

Jiego: Yes, add new fields to the nft contract and some functions to edit them (reply to 40851)

Jiego: Why not just send a second message? (reply to 40853)

Jb: Hello , is there any other way to handle infinit maps rather than deploying a contract for each key?

poppa: Theoretically possible but doing so would circumvent the scaling features of TON, and if your account chain's state becomes very large by way of many many entries to this mapping, the rent would be quite high. Sharding the state is a superpower, not a limitation. (reply to 40862)

Anton: no, not really, a workaround is to (manually) substitute the included FunC files into your FunC import  you can subscribe to this issue and get notifications about its progress: https://github.com/tact-lang/tact/issues/851 (reply to 40846)

Anton: you can either use the empty receiver receive() { … } or redefine the virtual storageReserve constant from BaseTrait (all contracts inherit from it)  https://docs.tact-lang.org/ref/core-base#self-storagereserve (reply to 40841)

P.H | Skate: thank you! it works (reply to 40864)

Mikael: thank you! (reply to 40865)

Mikael: yes, done in this way (reply to 40859)

Mikael: {"stack":"Error: Unsupported tact version: 1.5.0\n at TactSourceVerifier.<anonymous> (/app/src/source-verifier/tact-source-verifier.ts:91:15)\n at Generator.next (<anonymous>)\n at fulfilled (/app/src/source-verifier/tact-source-verifier.ts:28:58)","message":"Unsupported tact version: 1.5.0"}

Mikael: during verification received this error

Mikael: i tried to verify manually, but unfortunately i couldn't

Mikael: maybe i can do something with it?

Anton: You can try asking here: https://t.me/tonverifier  I think they haven’t added support for Tact v1.5 (reply to 40875)

Mikael: can i downgrade tact version? (reply to 40876)

Mikael: inside existing repo

Jiego: Yes (reply to 40877)

Anton: you should be able to do it, using your package manager, see e.g. https://t.me/tactlang/35521 (reply to 40877)

Jiego: how should i implement this forward_payload from the jetton contract on another contract that sends tokens? https://github.com/howardpen9/jetton-implementation-in-tact/blob/8ff4598bceab69a25093cc7147d017275299776d/sources/contract.spec.ts#L132

Jiego: something like just sending a 0?

Jb: Hello I want to use this opcode in a func function: PREVBLOCKSINFOTUPLE  I see it returns PrevBlocksInfo: [last_mc_blocks, prev_key_block] from c7. I assume it is a tuple. However, how can I make the func binding so I can extract the values in tact please?

Laisky: You may take a look at this       https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact#L126 (reply to 40882)

— 2024-09-19 —

Anton: You can use the opcode from Tact as it has asm-functions since v1.5.0 (reply to 40887)

Jb: Yep but how can I use that opcode? (reply to 40891)

Anton: do you need full info from that instruction or just some specific part? (reply to 40892)

Jb: Just how to use it in tact. For example the return types or how to destructure it. What I need is the blockhash or block id mainly. (reply to 40893)

Anton: Tact currently does not really support tuples, but if you only need some specific part of the block information, you could have done something like this (beware of bugs in the following code, I didn’t test it):   struct BlockId {     wc: Int;     shard: Int;     seqno: Int;     root_hash: Int;     file_hash: Int; }  asm fun prevKeyBlock(): BlockId {     PREVKEYBLOCK     5 UNTUPLE }   Btw, Sandbox does not emulate blocks, so all those tuples should be empty in your local tests. (reply to 40894)

Jb: Ok I did exactly the same but the untuple, and was getting a parsing error. Will try with it. Thanks

Jb: But do you receive undefined or an empty data? (reply to 40895)

Anton: please let me know how it goes (would be interested if it actually works in testnet) (reply to 40896)

Anton: I didn’t try running it (reply to 40897)

Jb: Ok, will try thanks

Jb: error: cannot assign an expression of type tuple to a variable or pattern of type (??1019, ??1020, ??1021, ??1022, ??1023): cannot unify type (??1019, ??1020, ??1021, ??1022, ??1023) with tuple       var ($block'wc, $block'shard, $block'seqno, $block'root_hash, $block'file_hash) = prevKeyBlock(); (reply to 40898)

Anton: Can I see your full code please? (reply to 40903)

Jb: I did not use 1.5 because I could not solve the compilation errors so I am using func bindings.  The code is:

Jb: for the func file: tuple prevKeyBlock() asm "PREVKEYBLOCK 5 UNTUPLE";  and in my tact contract:  @name(prevKeyBlock) native prevKeyBlock(): BlockId;  struct BlockId {     wc: Int;     shard: Int;     seqno: Int;     root_hash: Int;     file_hash: Int; }      get fun getPrevKeyBlock() : BlockId {         let block: BlockId =  prevKeyBlock();         return block;     }  I think the error might be in the declaration of the variable block inside the get fun

Anton: prevKeyBlock in your FunC code should return a tensor (int, int, int, int, int), not a tuple tuple or not even a concrete tuple [int, int, int, int, int] (reply to 40906)

Anton: UNTUPLE converts it from a tuple to a tensor

traceur: I have a failed transaction, the exit code is 0. Can anyone help me figure out why this transaction fail? https://testnet.tonviewer.com/transaction/a0ce05ca833d5facb75ee18a9270aa6252af7213ac68c564d629294ee4ed5257

lv: Ton not enough

Cyril M |: what's the difference between sender() and context.sender?

traceur: I’m deploying contracts with blueprint + tonkeeper. My tonkeeper wallet1 is connected with the project, how can i disconnet the wallet1 and use another tonkeeper wallet instead?

Laisky: remove temp dir (reply to 40920)

Cyril M |: other than the gas?  coz I have a contract that sends message to another contract, and that contract sends another message to a contract. I want to get the original sender which is me. when I use ctx.sender, it's only the sender of the message. not the original sender (reply to 40924)

Cyril M |: does sender() returns the original sender?

He-he: Hello guys, does anyone know how to retrieve a String from a Slice. I have a forwarded payload from a jetton that contains a textual message, but that Forwarded payload is a Slice. i need that textual message, not sure how to properly get it and later on use in my logic

Mikael: tact is included into blueprint module? (reply to 35521)

Sashi kanta: Correct (reply to 40929)

lv: hello,who can teach me how to call the transfer of USDT in the tact contract?a

lv: if  some params error？

Anton: There is a WIP PR to the Tact docs: https://github.com/tact-lang/tact-docs/pull/380 You might want to check it out (reply to 40931)

Alejo: Hi guys, is there a way to run the ton node isolated like in hardhat ?

lv: If I want to implement the mint method of the A address calling the B contract, I need to transfer usdt and return the s_usdt certificate in the B contract. How should I write this B contract? I tried to call the transfer method of usdt in the B contract  but  it reported an error. (reply to 40933)

cubby: Hello. Is anyone looking for a blockchain engineer?

FakeName: export function useNftCollection() {     const client = useTonClient();     const [contractData, setContractData] = useState<null | {         collection_content: Cell;         next_item_index: number;         owner: Address;     }>();      const [balance, setBalance] = useState<number | null>(0);      const nftCollection = useAsyncInitialize(async () => {         if (!client) return;          const contract = NftCollection.fromAddress(Address.parse('EQDfkb9aldpAIkc37peVwDGCquby5dVhilZ70LUZElo4druo'));         return await client.open(contract);     }, [client]);     Property 'open' does not exist on type '{ client: TonClient | undefined; }'.ts(2339) any   can anyone help me here ?

— 2024-09-20 —

lv: hello,  who  can  help me.😢It stuck me for a long time (reply to 40935)

Nikita: Hi! Is there information when my contract can become frozen, if there is no funds on balance?

0xST: Guys how do I determine the forward fee when transferring jetton to another jetton wallet address?

Sashi kanta: Network (reply to 40955)

Ak: Hi Guys, we are looking for experienced and motivated BD for our mini game with 1m Players. DM for more information

blocksdev: whats BD (reply to 40957)

Ak: Sales manager

wizardev: Hi , I've developed  air drop  b o t

0xCryptolia: Well done (reply to 40970)

Tugged: Anyone familiar with wallet creation and TON particularly. Dm

Laisky: Pay a sufficient amount, and then return the excess (reply to 40955)

— 2024-09-21 —

E: Hi! Help please ). How i can parse income string from message (str) to words? and get first word and second word?)  method receiver:  receive(str: String) {}  or  How i can send transaction via "tonconnect" to struct type MyMessage?  message MyMessage{     str: String; }  method receiver: receive(msg: MyMessage) {}

Cardinal: Hello. I am developing a smart contract in the TON network, I need to get the token price in the contract in the ratio of TON and USDT. Is it possible to do this with Redstone?  As far as I saw in the documentation, there is no access for TON at the blockchain level

Endgame: hey guys im trying out the tact example to deploy a jetton but when I build with blueprint, I got an error:  Error: contracts/jetton_wallet.tact:94:13: Incompatible types "Address" and "<null>" for binary operator "!=" Line 94, col 13:   93 |         // 0xd53276db -- Cashback to the original Sender > 94 |         if (msg.response_destination != null) {                     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   95 |         // if (msg.response_destination != Address.parse(null)) {

Endgame: can anyone help on this? how to compare null with the Address type?

Endgame: ok I found the answers from previous messages

Endgame: just remove that check is ok

JustFilmk: Hello Guys

JustFilmk: i have my own domain is hexastudioz.ton

JustFilmk: can i link it with my website ?

— 2024-09-22 —

Sara: Sure (reply to 41010)

Endgame: Hi guys, using blueprint to deploy, is there a way to get the sender address when calling a contract.fromInit?   const jettonMaster = provider.open(         await JettonMaster.fromInit(provider.sender().address, default_content, 100000000n),     );  I tried this but it doesnt seem to work.

Georgiy: 🎉 Misti 0.3 has just landed on NPM!  ⚡️Tact 1.5 Support  🔍 Five New Tact Detectors: String Receivers Overlap, Asm Is Used, Preferred Stdlib API, Inherited State Mutation, Argument Copy Mutation.  🔧 Fixes & Enhancements: More configuration options, optimization and API improvements. Check out the full changelog.  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Сева: Hello how can I deploy contract from the code? In my dapp I click on a button and a new jetton minter will be created

— 2024-09-23 —

kk: hello， I would like to ask if there is a significant difference in functionality between Tact language and FunC language. I am accustomed to using typescript language in my daily life. Which language should I learn for developing TON

🌱SEED 📦 Bums: Hello, can I find anyone to help me here?

⁭: is there any example of bid/ask structure/state on smart contract?

mgnfy_view: Are there some good examples available for common stuff like, transferring Jetton from user to contract, contract to contract, interacting with other contracts, etc?

Georgiy: I would start from here: https://github.com/tact-lang/awesome-tact?tab=readme-ov-file#-smart-contracts-examples.  There are other examples available, some of them could be found on GitHub. Just extend this search with code patterns you are interested in: https://github.com/search?q=path%3A*.tact&type=code. (reply to 41040)

Georgiy: See the main page: https://tact-lang.org/  tl;dr: Tact is a safer, more high-level alternative that won't let you shoot yourself in the foot with error-prone low-level stuff. But in some projects you'll need to write some logic in FunC and integrate it to Tact in order to optimize things or involve low-level constructions. (reply to 41036)

Jiego: hey guys, quick question:  Lets say i wanted to implement something similar to https://tact-by-example.org/06-unbounded-arrays   A todo list is pretty simple, but lets say i want to offer this to several users. In that case, what are some ideas to implement a basic auth here, as it would defeat its purpose if anyone could go and interact with the parent contract, modifying other users todo list.

Jiego: in my current proyect i ended up created a map storing some basic info for each todo, but im guessing that would be too scalable on the long term

Jiego: something like:  1) user creates a list, on the parent contract i store their address and the id on a map 2) on a third contract i want to check the state of the child-todo, so i would need to use the parent-todo to access the auth info and deny access to the user if its not the owner 3) the parent-todo could get clogged if billions of users got in

Jiego: any ideas?

8exor 🦴: hey guys i need help in contract integration with  React app

Jiego: whats the issue there? (reply to 41048)

Nerses: Is there any issue on testnet right now ? As this simple check doesnt pass require(timelock > now(),"Not Future Timelock");  with correct timelock. And also interacting with smart contract very often gives error 504

Nerses: can loading data from received message reorder data ?  let Id: Int = msg.data.preloadInt(257);         let hashlock: Int = msg.data.preloadInt(257);         let timelock: Int = msg.data.preloadInt(257);   as I emit timelock  but actually it emits Id . what can cause this ?

Anton: because you use preloadInt, it does not change your slice pointer (reply to 41052)

Nerses: is there any method to change pointer ? So i can reference to next 257 bits ? (reply to 41053)

Anton: Why do you actually need that? What problem are you trying to solve? Because you might be able to just describe your data using the syntax of structs as far as I can tell from your snippet (reply to 41054)

Nerses: here is the full code receive(msg: AddLockSig){         let Id: Int = msg.data.preloadInt(257);         let hashlock: Int = msg.data.preloadInt(257);         let timelock: Int = msg.data.preloadInt(257);         require(self.contractExists(Id),"Contract Does Not Exist");         let htlc: HTLC = (self.contracts.get(Id)!!);         require(checkSignature(msg.data.hash(),msg.signature,htlc.senderPubKey),"Invalid signature");         let addLockMessage: AddLock = AddLock{                                                 Id: Id,                                                 hashlock: hashlock,                                                 timelock: timelock                                                 };         let ctx: Context = context();         self.addLock(addLockMessage,ctx);     }   in this receive  is done signiture verification and based on data  which has 3 fields id  hashlock  and timelock  is executed the function addLock. I tried to use fromSlice  but it wouldnt work as I dont have opcode in data only properties

Anton: what about this?   message AddLockSig {   …   data: Lock;   … }  struct Lock {   id: Int;   hashlock: Int;   timelock: Int; }

Nerses: so just to encapsulate on struct inside another ? (reply to 41058)

Anton: an idiomatic way to write this would be using struct fields punning:   let addLockMessage: AddLock =   AddLock{ Id, hashlock, timelock} (reply to 41057)

Anton: sure (reply to 41059)

Nerses: I thought that way but was avoiding it in purpose of simpler solution (reply to 41061)

Anton: but manually reading things is not simpler (reply to 41063)

Anton: you can even remove the type annotation:   let addLockMessage = AddLock{ Id, hashlock, timelock} (reply to 41060)

Nerses: thanks a lot.In that case I will use that approach (reply to 41064)

Cyril M |: is it possible to have 2 dimensional mapping like in solidity?  ex: mapping(uint256 => mapping(uint256 => uint256))?? (reply to 41061)

mgnfy_view: You can use the grandparent, parent, child model (reply to 41068)

Chad: i have two contract 1. JetTon Contract token name is "Khan" 2. Manager Contract where i will manage to transfer/send "Khan" token to another wallet address how can i achieve this task please help , guide and share reference

Cyril M |: thanks

Ashwin: https://docs.metamask.io/wallet/how-to/sign-data/#use-personal_sign  How can I use TON Keeper to achieve something similar to Personal Sign?

— 2024-09-24 —

gag: Anyone using MyLocalTon? I try it's built in ton-http-api but always get Failed to unpack account state error

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: Hey how to write in a code snippet in telegram like this? (reply to 40687)

Yuri: Hi guys! Could you please tell me how to check whether the contract has already been deployed or not? let init: StateInit = initOf Userinfo(msg); let address: Address = contractAddress(init)

shi: where to get TON testnet coin?

Denis: @testgiver_ton_bot (reply to 41132)

shi: thx

Chad: how to transfer/send jetTon to other address? My JetTon token contract already deploy now i want to create staking contract for staking i want to take token from user to stake and on unstake i want to back to him how?  @novusnota42 could you please help?

Rohit: I want to make a contract to create token, buy token and sell token  ( jettons) using Tact ... Can please anyone share me resources related to this?

Laisky: https://github.com/Laisky/tact-utils is a template and example to implement a contract to create/transfer jetton/nft. (reply to 41137)

Rohit: Thanks (reply to 41140)

Сева: error during build: [commonjs--resolver] Could not load /home/vsevolod/TON/hash-cash/hash-cash-front-end/node_modules/node-stdlib-browser/cjs/mock/empty.js/promises: ENOTDIR: not a directory, open '/home/vsevolod/TON/hash-cash/hash-cash-front-end/node_modules/node-stdlib-browser/cjs/mock/empty.js/promises' file: /home/vsevolod/TON/hash-cash/hash-cash-front-end/node_modules/@ton/blueprint/dist/index.js     at async open (node:internal/fs/promises:638:25)     at async Object.readFile (node:internal/fs/promises:1238:14)     at async Object.load (file:///home/vsevolod/TON/hash-cash/hash-cash-front-end/node_modules/vite/dist/node/chunks/dep-DG6Lorbi.js:65033:25)     at async PluginDriver.hookFirstAndGetPlugin (file:///home/vsevolod/TON/hash-cash/hash-cash-front-end/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:19836:28)     at async file:///home/vsevolod/TON/hash-cash/hash-cash-front-end/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:19017:33     at async Queue.work (file:///home/vsevolod/TON/hash-cash/hash-cash-front-end/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:20046:32)  how to fix it?

Georgiy: The error originates from the node-stdlib-browser package, which is not related to Tact or its ecosystem. I suppose you're doing something wrong in your TypeScript code. (reply to 41169)

Сева: okay thank you

Haq: Hey guys, to you have maybe some Vesting contract example in Tact?

Jiego: What I did was adding code to the wallet. Send a message to the staking contract to deposit (reply to 41136)

Jiego: I would create a special jetton wallet that receives the tokens for the owner and has a require() with the vesting period (reply to 41185)

Jiego: I think basic jetton staking is missing there, let me see if I can work that out as I'm doing something related to it. Are there any special guidelines for contributions? (reply to 41140)

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: {   "firstName": "John",   "lastName": "Smith",   "age": 25 } (reply to 41147)

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: You just pasted it from IDE right? We can't do it on tg? (reply to 41147)

🐤 wahaha qubic: Excuse me, how can I generate an MPC wallet address?

🐤 wahaha qubic: Use mnemonic words

Tom - Bushi: why can I not send a transaction with SendRemainingValue after I use nativeReserve even if the reserved value is less than the ctx.value?

Tom - Bushi: SendRemainingBalance works, but Id rather operate on the former

Tom - Bushi: pretty confused why the message isnt being sent

— 2024-09-25 —

Laisky: PRs welcome! 😊 Better to provide reusable & overwritable contract traits. (reply to 41191)

Jiego: important question here (reply to 41131)

Laisky: https://github.com/ton-org/blueprint/blob/ca4dcdd9e17e4bd0fcc2168801fe311997a81e67/src/network/createNetworkProvider.ts#L183 (reply to 41227)

Jiego: how about inside a smart contract? onlyy sending a message to it and praying it lands? (reply to 41231)

Laisky: When sending, you can include both code and data, allowing you to deploy a contract for the recipient simultaneously with the message.  https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact#L128-L129 (reply to 41233)

User<6898193927>: 可以用abi 调用调用合约吗

abc: I want to issue my own token on the TON blockchain. The token will be issued using the jetton standard, but I'd like to make the jetton master contract a multi-signature wallet so that it can be managed by multiple people. If there's a way to do this, I'd like you to tell me about it.

User<6898193927>: tact opcdoe where?????

Jiego: like this? https://github.com/tact-lang/tact/blob/main/examples/multisig.tact (reply to 41238)

Jiego: cool, but i meant when you create a StateInit with some information that maybe doesnt match the reality (an edge case). is there a way for me to know if the contract actually exists? (reply to 41235)

Jiego: say the user wants to sell an nft with an id that does not exists, or something like that. the message wouldnt be sent, right?

abc: Thank you！ (reply to 41241)

Tom - Bushi: does anyone have an example of how to use nativeReserve with SendRemainingValue?

Nerses: in this pseudocode what will be tx sender for function func  receive(){         self.func()     }      fun func(){         dump~(sender())     }

shi: how to sending a DeDust swap transaction by tact?

helena: ✋ Hackers, devs, founders.... TON is hosting a $2M hackathon for you!   Hackers League is a large online hackathon with  ◾️ $2M in prizes  ◾️ 19 offline bootcamps around the world  ◾️online workshops, mentors, and post-hackathon support  🏃‍♂️ Join the voice chat on September 30th at 12.00 UTC with Helena, the Hackers League Organizer at TON Society and Anton, the Tact Compiler Lead at TON Foundation to learn how to win the hackathon and build your project on TON.  Set the bell 👉 Click   The competition runs from September 13 until December 20—so there’s still time to get in the game!   Register for the hackathon 👉 Click  Find your city and join an offline bootcamp 👉 Click (forwarded from TON Dev News)

shi: when send jetton, how to calc jetton wallet address??

Laisky: https://github.com/Laisky/tact-utils/tree/main there are a lot of samples using nativeReserve in this repo (reply to 41245)

Laisky: I think your question is very strange. If you want to transfer jetton/NFT, then you must know the contract code, and therefore, initof must be able to get the correct address.  BTW, even if the target contract doesn't exist, the message can still be delivered, unless you set bounce: true. (reply to 41242)

shi: for example, i want write this function ,how to get the target's jettonWalletAddress fun transferJetton(jettonMasterAddress: Address, amount: Int, target: Address) { (reply to 41273)

shi: how to get the contract code?

shi: just use JettonWalletTemplate?

Dmitriy: you only need to know your jetton wallet address when sending jettons as for recepient, you need the recipient address, not recipient’s jetton wallet one, it will be calculated by your jetton wallet, so it’s not your concern  you should know your jetton wallet address, so there should be no problems in it (reply to 41271)

shi: but i only know the recipient wallet address and jetton master address. in nodejs i can use runMethod to get the jetton wallet address, but how to calc jetton wallet address in tact? (reply to 41277)

shi: calc jettonWalletAddress must use jettonWalletCode

Dmitriy: does your contract work with some limited set of jettons, or with every possible jetton? (reply to 41279)

shi: every possible jetton, like dedust

Dmitriy: it makes things harder in case of some limited set of jettons, I’d sugget you to store the map from jetton master address to jetton wallet address in your contract  then you need to accept the jetton wallet address (or cell with code) as an input in your tact contract to calculate jetton wallet address from it in general it’s impossible to calculate jetton master -> jetton wallet address mapping since different jettons may have different code (reply to 41282)

Dmitriy: there is also a discoverable jettons standard (https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md) where jetton master has provide_wallet_address method to return (asynchonously, of course) the jetton wallet address  but not every jetton is a discoverable jetton, so you can’t rely on it

Dmitriy: so you either need to rework your contract to support only some whitelisted set of jettons or accept jetton wallet address (or code) as an argument but for the latter case you also need to come up with some validation to make sure that jetton wallet address indeed corresponds to a certain jetton master

shi: ok, thx bro

Durga: Hi fam I'm from bangalore india a web 2 dev intrsted to explore web 3 especially ton Blockchain. I want to participate in bangalore hackers league but I don't have any idea can I still apply?

TORUN: ♥️

Tom - Bushi: thx Laisky, in fact I learned about this function from your blog post. But you seem to only use SendRemainingBalance while I would like to use SendRemainingValue. The contract might be accepting payments in TON so sending remaining balance seems risky (reply to 41272)

Cyril M |: Hi guys, I just created an Access Control trait. It's a role-based access control  https://github.com/ed3ath/tact-access-control  contributions are welcome

Anton: looks like struct UserRoles could benefit from associated extension functions that incapsulate working with the map length (reply to 41293)

Anton: also, for roles you might use a smaller integer, let’s say 8-bit or even 4-bit integer

Jb: Hello, I am dealing with an async problem here.  I am trying to create infinite maps, and a solution proposed is to deploy a new mapping on an empty contract that holds that value such as jetton does. Every time I execute a function in my c ontract, the a new value is inserted in the mapping, and each value is related to each other like a chain. And I need to also query the new contract. My problem comes when that call might fail, and I need to revert changes. I tried putting a bounced method but it is not easy to revert a hashchain  in the mapping, moreover when I might have many calls at the same time.

Georgiy: Looks good. I would remove roles_length as it was reported as unused by the static analyzer. (reply to 41293)

Cyril M |: removed the unused variable (reply to 41299)

Jose Fabio: Hello. Can someone please explain to me why SendMode 3 is the standard? Why not 1?  I don't get why is it a standard to ignore errors.

Jose Fabio: https://docs.ton.org/develop/smart-contracts/messages

Jose Fabio: Tact's documentation says The optional flag SendIgnoreErrors means that even when an error occurs during message sending next messages would be sent anyway. No error during the sending phase would revert a transaction.  It doesn't explain why many people use it. Is it safe? Wouldn't it be desirable to revert a transaction if an error occurs?

cubby: Hello. Is anyone looking for a blockchain engineer?

Alex: Hey, is it possible to initiate contract balance on deploy phase? Let's say i need to make sure that for creating contract user should pay some amount of Ton, how can i implement this with Tact?

Alex: @expectfun

⁭: Bouncable? (reply to 41308)

Jose Fabio: Does ignoring errors make it bouncable? (reply to 41318)

Cyril M |: is the mintless jetton works on tact?

— 2024-09-26 —

Laisky: nativeReserved can limit the balance reserved by SendRemainingBalance, so there is no risk. SendRemainingValue cannot be used with nativeReserved. (reply to 41291)

Pasha: isn't it just standard jetton with public Mint message handler? (reply to 41330)

P.H | Skate: When I deploy a tact contract that is a factory of other contracts. Does tact automatically put the other contracts code as library reference cell?

⁭: that's what I'm asking, probably not since bouncable is not implemented, maybe it's hack to achieve this (reply to 41319)

lv: hello, I executed a contract I wrote myself and wanted to call the contract's usdt wallet to transfer assets. The above error message appeared, but I couldn't find out where the problem was.

lv: code like this, can  someone  help me?

Jiego: https://docs.tact-lang.org/book/exit-codes (reply to 41342)

Jiego: try an emptyCell() on the custom_payload (reply to 41343)

lv: let me try

lv: No changes were made in the generated  .fc  file.  null or emptyCell()  has the same result (reply to 41346)

Jiego: any logs you can share? why not use a unit test to debug the whole tx chain

Jiego: like this

lv: I sent you a private message

Tom - Bushi: is there a way to see the contract balance before the value from the tx is added? afaik mybalance() shows the latter. Apart from mybalance() - ctx.value (reply to 41332)

Laisky: why not mybalance() - ctx.value? (reply to 41353)

Daniel: Error: sources/contract.tact:384:9: Parse error: expected ":" Line 384, col 9:   383 | > 384 |     asm fun keccak256(s: Slice): Int {                 ^  385 |         1 INT HASHEXT_KECCAK256  are asm functions working with 1.5.2?

Alex: is it possible? (reply to 41312)

Alex: Hey, is it possible to initiate contract balance on deploy phase? Let's say i need to make sure that for creating contract user should pay some amount of Ton, how can i implement this with Tact?

Anton: yes, asm-functions are working with Tact v1.5.2  are you sure you are using 1.5.2, though? (reply to 41360)

Daniel: "@tact-lang/compiler@~1.5.2":   version "1.5.2"   resolved "https://registry.yarnpkg.com/@tact-lang/compiler/-/compiler-1.5.2.tgz#eece10634091eb31fa2f1b5453ede867cf68af9e"   integrity sha512-i6FONPYpM4hYujmrhtyXtcNA7UkDOcgWbHUCFvHT4+RFwPFHlwbq7gdDWDP4dgW6uMLoNt+JUL/o62Ho+rJn0Q==   dependencies: (reply to 41364)

Anton: asm fun keccak256(s: Slice): Int {     1 INT HASHEXT_KECCAK256 }   this works for me with blueprint

Anton: btw, asm-functions are only allowed as module-level functions

Anton: you cannot define those inside contracts or traits

Daniel: thx. all good. (reply to 41368)

Shifa: Yes (reply to 41318)

Tom - Bushi: I can do that, just was wondering if there is a more performant, perhaps one use function that was around that I didnt know about (reply to 41359)

Vincent: Hi guys i have a question , when a recieve("message") is called does this mean it will call the function message in the contract ?

⁭: any method to get user balance? for example if he bid the value without sending it we need to check balance of the sender address

Jiego: No, it Will call whatever is inside the receiver function receive("message"), but only that. The common function message needs to be inside the receiver "message" in order to be called (reply to 41379)

Jiego: Easier to declare a Context and check msg.value inside the receiver function (reply to 41380)

Vincent: I see , correct me if im wrong so lets say i want to have 2 function 1 is to increase something and another is to decrease so i need to have 2 recieve function but how would i differentiate it ?

⁭: msg.value seems value which was sent, if value is less than balance or even just to pay fees, like on fragment they may bid without sending funds (reply to 41382)

Jiego: Sorry I meant like this https://docs.tact-lang.org/ref/core-common#context (reply to 41384)

Vincent: oh so the receive function couldnt take in 2 params

Jiego: Receive("increase") {self.value = self.value+1}  Receive("decrease") {self.value = self.value-1} (reply to 41383)

Jiego: It can, but instead of a "message" you would need to send a msg: Message. Say: (reply to 41386)

Vincent: Oh so like  message RegisterMessage { str: "register" struct: Data { ..... } } (reply to 41388)

Jiego: Receive(m: Increase) {self.value = self.value+m.valueToBeAdded}  Receive(m: Decrease) {self.value = self.value-m.valueToBeSubtracted}

Vincent: Aaa i see

Vincent: noted

Vincent: Thank you very much

Anton: btw, you can use += and -= here:   receive(m: Increase) {self.value += m.valueToBeAdded}  receive(m: Decrease) {self.value -= m.valueToBeSubtracted} (reply to 41390)

Vincent: Thank you this is super helpful

Anton: misti should suggest changes like that one (reply to 41394)

Vincent: TypeError: paramSet.isSubsetOf is not a function    is this error a map set error ?

Anton: you need node.js v22 (reply to 41398)

Anton: Tact v1.5.2 should warn you about it

Vincent: I see

E: I deleted this 😂 (reply to 41398)

Vincent: lmao what u mean by deleted this (reply to 41402)

E: I've removed this check in two places and everything works. I do not advise you to do the same (reply to 41403)

Vincent: Does tact support reverts or error handling ?

Vincent: oh so it means i could custom exit codes for the exit codes that isnt used right ? (reply to 41406)

Vincent: is there example on how to custom one ?

Vincent: oh so the number will be handled by the FE to know if this number represent which error ? (reply to 41411)

Vincent: Aa that would be better understandable

Vincent: Thank you so much 🙏 (reply to 41414)

august.l: is there any package help to get code coverage？

Durga: Hi fam I am a web 2 dev and want to learn web 3 can anyone give a roadmap or resources for learning to build on ton blockchain

Denis: Hello guys, Can you recommend something to read or watch regarding gas payments in contracts on TON?  Right now, I don't understand who pays the gas and when. We keep the balance non-zero, and I understand why. However, I'm unsure how the gas is deducted from contracts that have used up their entire balance. And how do you control all of this when writing contracts in Tact?  Thanks!

Stephan: Hello guys, do you know, where i can find BOC code of transaction in ton scan or ton viewer?

Showrov: I'll check (reply to 41429)

Roger: Hi everyone, why is it the some of the play apps are not compatible or when getting the coins we are restricted?

— 2024-09-27 —

Jose Fabio: Thank you for answering. Can you please explain to me why mode 3 is bouncable? It seems counter intuitive that ignoring errors makes it bouncable (reply to 41370)

traceur: Is there any example of code showing how to parse slice to a struct? like in jetton’s TokenNotification message, I want to parse the forwardPayload into a struct.

traceur: never mind. I think I find it: https://docs.tact-lang.org/ref/core-cells#structfromslice

traceur: How can we represent zero address in TACT? like in solidity there is address(0), is there an equivalent thing in TACT?

Laisky: you may take a look at this template https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact  Whoever starts the transaction covers all the fees (reply to 41428)

Laisky: maybe UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ (reply to 41458)

traceur: How can I create an Address variable with “UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ”? (reply to 41460)

Laisky: https://docs.tact-lang.org/ref/core-strings#addresstostring (reply to 41462)

Jiego: zeroWallet: Address = newAddress(0, 0x0000000000000000000000000000000000000000000000000000000000000000) (reply to 41458)

Jiego: If I have message X { a: Int, b: Bool, c: Address } and I send that from one contract to another, is there anyway i can edit any part of the message itself?

Laisky: You should provide a clearer description of who is performing the action. (reply to 41469)

Jiego: user is sending message X { a: Int?, b: Bool, c: Address? }  as user does not know c, on parent i want to do something like msg.c = someAddress

Laisky: Why not do it this way? (reply to 41471)

Jiego: im asking if thats possible 😅

Laisky: yes, contract can edit messages received (reply to 41473)

dotfx: Hi! I'm trying to enable external messages but compiler throws an error after adding the option to tact.config.json

Georgiy: You should include options in the project configuration, e.g.: (reply to 41482)

dotfx: oh it's not a global option, ok thanks! (reply to 41484)

dotfx: Compiled nicely, thanks

dotfx: Can you read the msg content before accepting an external message? I want to accept it only if a certain key/value has been sent within the body Or is there no harm if I accept it immediately and do not process it if conditions are not met?

Nerses: in this pseudocode what will be tx sender for function func  receive(){         self.func()     }      fun func(){         dump~(sender())     }

Nerses: is there a way in TACT the smart contract to call its function so the tx sender will be changed (reply to 41493)

yash: we have written our codes in funcc and want to get them audited (reply to 41493)

yash: anyone from foundation who can help us?

Akan: hi, is there an example how to fetch events emitted by contracts written in tact ?

Vincent: https://docs.tact-lang.org/book/deploy  im trying to deploy my contract and i saw a ./output/ which how do i generate or have that in the first place ?

Laisky: You may take a look and follow this repo https://github.com/Laisky/tact-utils (reply to 41507)

Vincent: Thank yiu 🙏 (reply to 41508)

Vincent: whats a good facuet for ton testnet ?

pfeffunit: https://t.me/testgiver_ton_bot (reply to 41510)

Bharathraj: Hi team any NFT minting tutorial plse, new to TACT need support.

Laisky: https://t.me/tactlang/41508 also includes NFT (reply to 41513)

Vincent: Hi i deployed my tact contract on chain and now im trying to sendTransaction on my contract which the message takes in a struct how would i construct the struct for the transaction payload ?

Khalid: Use JavaScript (reply to 41524)

Vincent: yes but like how would u construct the payload ? (reply to 41526)

Jb: await contract.send(     provider.sender(), {     value: toNano(value) }, {     $$type: "MessageType",     param1:     param2:     etc... }, ) (reply to 41527)

Jb: Check for tests or scripts in existing repos or examples.

Khalid: simple counter adding script

Jb: Does anyone have an example in go using ton utils go? On sending a message with many params with various types ?

Vincent: I see , so i still need to use the non react to send transaction

Ricky: Looking for Tact developers, who are good in solidity too

Ricky: I've got a good gigi

Ricky: gig*

Ricky: Please DM for more details

Ksms: I need to review q contract written in tact and I come from solidity. what is the best approach to getit going? is it a good idea to compile it and bother only with func? When I compile it I get a bunch of func files (storage, stdlib,..), and they all look intimidating

Ksms: also is tact production ready?has it been audited? I recenlty found a post from 2023 where the main dev was advising against using it for applications handling more than 10k in funds

Артур: Hi everyone!  I have this contract:  import "@stdlib/deploy";  message(0x05138d91) OwnershipAssigned {     query_id: Int as uint64;     prev_owner: Address;     forward_payload: Slice as remaining; }  contract TempContract with Deployable {     id: Int as uint16;     nftReceived: Bool;      init(id: Int) {         self.id = id;         self.nftReceived = false;     }      receive(msg: OwnershipAssigned) {         self.nftReceived = true;     }      get fun isNftReceived(): Bool {         return self.nftReceived;     } }  Could anyone tell me why  isNftReceived  returns false  after NFT was sent to the contract?   transaction id: 9fc01c6e272497f975e8d10f0f085000eb3661385b28f6dde0a3befd3be4c725 contract address: 0QAgJD5pmyNPcsfjEaBbrBrW98RYK8WLGfRY6fGUMAXC1ZSq network: testnet

— 2024-09-28 —

Kyle 🐾: How can I mint a large NFT collection and put them up for sale?

Cube: what is the reason for not working dump function?

Vincent: does anyone know why this happen when trying to construct the payload using beginCell() ?

Laisky: the first line told you (reply to 41561)

Vincent: im looking through the docs for this buffer (reply to 41562)

Vincent: https://github.com/Gusarich/multisig-ts-example/blob/main/src/main.ts  i dont see buffers being defined tho

Anton: You need to set the debug option, most likely (reply to 41559)

Undefine: Thanks. (reply to 41565)

c: gm evry one i create trasaction but it's not work (

Ksms: Are there any implementations like reflection and divident paying already? Is that even possible?

Denis: Guys, I see that there are receive, external, and emit. receive accepts any messages. emit seems to send a message to the outside world (similar to Solidity). What is external used for?  And where can I find an example of an indexer for emit messages?

Jiego: Are you dumping an address? That doesn't work. Also, is debug active on your project? (reply to 41559)

Sergey: Hi everyone! How can I understand why am I keep getting 136 exit code?  I know that this is an invalid address error, but I have no idea why or how can I check what address exactly is incorrect

все капли из Европы ..азии ..африки и ближнего востока все в нал: У меня есть дропы из Ближнего Востока, Азии и Африки, мгновенный возврат USDT, я работаю по согласованному %также доступен банк Шри-Ланки

sixvxsh: Hey there;  Is it possible to access the source code for the crowdfunding project from the workshop, particularly the test files or deployment scripts?  Thanks @AntonTrunov

Alex: Hey, i'm trying to find good example how programmaticly deploy smart contract with TypeScript. I have contract written with Tact. Please somebody share with me some instruction.

sd: qq, what should i do?

sd: it happens in the latest version (reply to 41591)

Vladio: Hi everyone, how to check ton contract balance with blueprint?

— 2024-09-29 —

Laisky: Take a look at this https://github.com/Laisky/tact-utils (reply to 41586)

E: If i send 3 transactions via loop via test, the third transaction is error

E: wthat does this mean?

E: "if i <=2" - all is ok. But if "if i <=3" - the third transaction is failed

Leonardo: hello ，how use mytonwallet sign self msg。like metamask

Laisky: sounds like insufficient value (reply to 41604)

E: Of course! You are right)) Forgot that i need to control the commission on the balance) Thank you. (reply to 41606)

Georgiy: I don't think blueprint has that functionality. You can get the balance using this library: https://github.com/ton-org/ton. (reply to 41596)

Alex: thanks, but i need an example how to deploy smart contract with params (reply to 41599)

pid | ton: does anyone know how to create a getter function that returns the state of an address using the initOf contract . and the data is no longer in the form of cells. Thanks

NatX: GM everyone, please how can I interact with an already deployed smart contract?

NatX: i.e call smart contract functions (reply to 41651)

— 2024-09-30 —

Laisky: I don't understand what you're asking for. Doesn't the code I provided contain the deploy part? (reply to 41641)

Laisky: send message to that address (reply to 41652)

Denis: Guys I see in the docs https://docs.tact-lang.org/ref/core-debug#dump  dump(myAddress());  but It does not work for me. Why?

Jiego: its a known bug, i think it even has a github bug report. Simply put (afaik): too costly gas wise to dump an address (reply to 41656)

Jiego: ??? (reply to 41641)

Jiego: what's the best way to build a query for the body of a tx? For example I have this Struct (thats just a copypaste of this array):

Jiego: the body ends up being

Jiego: how should i construct that?

Jiego: https://docs.ton.org/develop/data-formats/tl-b-types🧠

Johnny Le: let memoCell = beginCell()             .storeUint(msg.order, 32)                .storeUint(msg.level, 32)                .endCell();  here is my memo cell, then I got this raw body:    body:           is_right: false           value:             sum_type: Unknown             op_code: 1356125587             value: b5ee9c7201010101000e00001850d4d5930000000100000002  -> how can I decode value to order and level up there. Thank you

miami: yes we can hear you

helena: 👀 Hackers, founders, developers…  This is an open call for you to join a $2M TON Hackathon.  TON Society is announcing Hackers League — an ecosystem-wide winter competition for early stage founders that will begin in October and end with a winners announcement in December.  Featuring:  ▪️ $2M prize pool ▪️ 19 IRL 3-day bootcamps  ▪️ Key ecosystem projects tracks   Apply at eco.ton.org! (forwarded from TON Society)

miami: why not switch (reply to 41604)

E: Only example (reply to 41681)

miami: oh okay (reply to 41682)

helena: Join the Global Hackers League Bootcamps!  19 cities, 3 days, real-world connections, and the chance to build the next unicorn apps. Join one of the 19 IRL Hackers League Bootcamps happening worldwide, starting from October 11th. Meet, pitch, and compete in the $2M online TON Hackathon.  Find your city and get started! (forwarded from TON Society)

miami: none in africa, nigeria to be precise  i’m sad. (reply to 41684)

traceur: I meet a problem when writing tests for Tact code. I need to parse a struct into a slice, which will be used in the jetton transfer_notificatoin’s forward_payload field. How can I parse a struct into a slice in TypeScript?

Dmitry: @oopshelena It was a nice voice chat, thank you 🤝

Anton: thanks for joining!

⁭: how to test nft sending in testnet?

mo.eth: @AntonTrunov amazing voice chat! I hope see another one soon

Johnny Le: thanks mate, can u guide me pls (reply to 41679)

cubby: Hello. Is anyone looking for a blockchain engineer?

Dipanshu ( Normie.Tech ): Sup i am getting this error in tact setup

Dipanshu ( Normie.Tech ): TypeError: paramSet.isSubsetOf is not a function

Denis: Switch your nodejs to version 22 (reply to 41699)

Dipanshu ( Normie.Tech ): okay

Dipanshu ( Normie.Tech ): what should i set my Wallet version as ?

Dipanshu ( Normie.Tech ): and how to run in sandbox ?

Abdi: Okay

— 2024-10-01 —

Viacheslav: do we have a pdf version of tact docs?

Anton: No, not really. You might try using pandoc to generate a pdf, since it’s written in markdown (mdx to be more precise) (reply to 41723)

Viacheslav: would be great to create a github action for this to have an up to date pdf all the time (reply to 41724)

Harpreet: GM GM  I wanted to know if there something like OpenZeppelin or Thirdweb type of platforms for developing smart contracts on TON   Was making a NFT Contract so wanted to know how to write them securely.

Georgiy: Not yet. There is a static analyzer that currently supports 17 detectors for Tact: https://github.com/nowarp/misti. It can cover some common issues. (reply to 41727)

ctb0k33: hello everyone,  i currently follow this tutorial in youtube: https://youtu.be/EaoVJuSCVmU?si=akQAE-XLTm3OgOmt  When i try to run the test, i got this error: " Unable to execute get method. Got exit_code: 11        27 |       28 |     async getData(provider: ContractProvider){     > 29 |         const {stack} = await provider.get("get_the_latest_sender",[]);          |                         ^       30 |         return {       31 |             recent_sender: stack.readAddress(),       32 |         } "  Here is the function in contract: slice get_the_latest_sender() method_id {     ;; get memory cell from C4 storage     slice ds = get_data().begin_parse();     return ds~load_msg_sender(); }  The wrapper: import { Contract, Address, Cell, beginCell, contractAddress, ContractProvider, Sender, SendMode } from "ton-core"  export class MainContract implements Contract {     constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {              }      // create contract instance base on config     static createFromConfig(config:any, code:Cell, workchain = 0){         const data = beginCell().endCell();         const init = { code, data };         const address = contractAddress(workchain, init);         return new MainContract(address, init);     }      async sendInternalMessage(         provider: ContractProvider,         sender: Sender,         value: bigint,     ){         await provider.internal(sender, {             value,              sendMode: SendMode.PAY_GAS_SEPARATELY,             body: beginCell().endCell()         })     }      async getData(provider: ContractProvider){         const {stack} = await provider.get("get_the_latest_sender",[]);         return {             recent_sender: stack.readAddress(),         }     } } and the test import { Cell, Address, toNano } from "ton-core" import { hex } from "../build/main.compiled.json" import { Blockchain } from "@ton-community/sandbox" import { MainContract } from "../wrappers/MainContract"  import "@ton-community/test-utils"  describe("main.fc contracts tests", () => {     it("our first test", async () => {         const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];          const blockchain = await Blockchain.create();          const myContract = blockchain.openContract(             await MainContract.createFromConfig({}, codeCell)         );          const senderWallet = await blockchain.treasury("sender");          const sendMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(), toNano("0.05")) // 50 000 000           // toHaveTransaction is a custom matcher come from @ton-community/test-utils         expect(sendMessageResult.transactions).toHaveTransaction({             from: senderWallet.address,             to: myContract.address,             success: true,         })                  const data = await myContract.getData();          expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());     }) })  Can anyone please explain the error and help me fix that, thanks a lot !

Hugo: Hello - are there any open source Jetton staking smart contracts available in the ecosystem?

0xtitn: https://github.com/howardpen9/staking-in-tact check this (reply to 41760)

Hugo: thank you !

Viacheslav: is there any other options? because this one doesn’t look like a scalable solution, isn’t it? (reply to 41761)

— 2024-10-02 —

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: Hey how you are writing in code snippets on telegram? (reply to 41255)

blocksdev: ```python # code here  def somefunc() -> None:     print("Executed somefunc()")  ``` (reply to 41782)

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: Yeah got it. 🫂 (reply to 41784)

Rohit: I am not seeing the option for the testnet in the TON Keeper wallet, even though I have enabled developer mode. If anyone knows how to resolve this, please let me know.

Sami: If you are using the web extension you can try downloading the desktop application that worked for me (reply to 41788)

Rohit: Actually I am looking for mobile app (reply to 41789)

blocksdev: You have to go to the settings tab, and scroll to the bottom and tap the "Ton Kepper icon" 5-10 times and you will be redirected to the network setting, were you can change it. (reply to 41788)

Rohit: Thanks but in new version there is no such option (reply to 41792)

NearWormHole ▪️ 🐾: Copy your mnemonic and try to add a new wallet, then scroll down to choose a testnet account. It will take you to testnet (reply to 41794)

Alexander: Hey, I need verify that a hash is correctly created. I want to hash an object with a varying size between 200 and 500 Bytes (4000 bits).  However, I cannot stored all of this in a cell without references. According to the docs, this implies I cannot sha256 hash it. It this true?  I have tried various other paths, like trying to convert the information to strings (since strings seems to have less strict size requirements), however this doesn't seem possible either.

Nerses: Does testnet work now ?

Nerses: I get error 429 trying to deploy smart contract

Vladislav: Sha256 does everything by rounds. I assume you can implement your own sha256 that pulls data iteratively from cells and their refs and put everything in other cells. Sort of. The main peril here is that it's unattractive to debug it. Also, tx cost isn't cheap  If that's possible use another algorithm (CRC f.e., but I wouldn't use it if data is sensitive) or even Merkle trees based on easier hash (reply to 41809)

— 2024-10-03 —

Cardinal: Hey, how can I call the get method from my smart contract? get_wallet_data() from jetton wallet, specially balance, I want to burn the remaining tokens, but I can’t find a way to do it. Does anyone have any advice?

Anton: You cannot call getters from contracts. All data passing needs to be done via messages (reply to 41828)

Денис: Hello everyone, for several days now I can't figure out how to generate the correct payload for my smart contract. I will be very grateful if someone can help 🙏  There is a smart contract on the clock for accepting payments:  ------------  import "@stdlib/deploy";  message Payment {     orderId: Int as uint32; }  message PaymentReceived {     orderId: Int as uint32;     amount: Int as coins;     sender: Address; }  contract PaymentReceiver with Deployable {     owner: Address;          init(owner: Address) {         self.owner = owner;     }      receive(msg: Payment) {         let ctx: Context = context();                  // Check that the transfer amount is greater than 0         require(ctx.value > 0, "Payment amount must be greater than 0");                  // We will issue an event about the received payment         emit(PaymentReceived{             orderId: msg.orderId,             amount: ctx.value,             sender: ctx.sender         }.toCell());          // We send funds to the owner of the contract         send(SendParameters{             to: self.owner,             value: ctx.value - ton("0.1"), // We leave a little for the commission             mode: SendIgnoreErrors,             bounce: false         });     }      // Handler for the "withdraw" text message, allowing the owner to withdraw funds     receive("withdraw") {         let ctx: Context = context();         require(ctx.sender == self.owner, "Only the owner can withdraw");                  send(SendParameters{             to: self.owner,             value: myBalance() - ton("0.1"), // We leave a little for the commission             mode: SendIgnoreErrors,             bounce: false         });     }      get fun owner(): Address {         return self.owner;     } }  ------------  at the front, I am forming a transaction and trying to form the correct body for the payload  ------------  import type { SendTransactionRequest, SendTransactionResponse } from '@tonconnect/sdk' import { TonConnectButton, useTonAddress, useTonWallet, useTonConnectUI } from '@townsquarelabs/ui-vue' import { beginCell, Address, toNano } from "@ton/core"; import { storePayment, Payment } from ' ./tact_PaymentReceiver'; // Importing the necessary functions from the generated file  ...  const { order_id, amount, payment_address } = paymentInfo.value  const payment: Payment = {   $$type: 'Payment',   orderId: BigInt(order_id) };  const testAmount = 0.05 //test amount  const body = beginCell()     .store(storePayment(payment))     .endCell();   // Forming a const transaction = {   validUntil: Math.floor(Date.now() / 1000) + 600, // Transaction duration (10 minutes)   messages: [ { address: payment_address, // Contract address       amount: toNano(testAmount.toString()).toString(), // Payment amount       stateInit: undefined,       payload: body.toBoc().toString('base64'),     }   ] };  paymentStatus.value = 'sending' const result: SendTransactionResponse = await tonConnectUI.sendTransaction(transaction)  ------------  as soon as I didn't try to generate a correct payload, an error occurs every time 'it is not possible to verify the transaction'  But if you comment out the payload: body.toBoc().toString('base64') line, then the transaction is created and confirmed in the wallet successfully

E: receive(str: String) {         self.main(address(str));     }  Error: sources/contract.tact:151:27: Cannot evaluate expression to a constant: cannot evaluate a variable Hi. Could you please tell me how to pass a wallet to a function?

Georgiy: address is a compile-time function, which means it cannot accept an argument not evaluable in compile time: https://docs.tact-lang.org/ref/core-comptime/#address (reply to 41833)

E: I need to pass a wallet to make a transaction on it. What function can I use to do this? (reply to 41834)

E: or how i can send transaction to string wallet?

Alexander: The solution was using assembly calling HASHEXT_SHA256. Thanks to Anton for helping. (reply to 41825)

blocksdev: You should go and find someone on Fiverr or UpWork (reply to 41840)

Anton: please do not react to spam messages (reply to 41841)

blocksdev: sorry, my bad. (reply to 41842)

Mehmet Ali: Hi All! We are trying to implement a taxing function for our jetton. Excluding the owner transfers; all jetton transfer would be taxed a %8 of the amount total which is like if addressA sends 100 jetton to addressB then 92 will arrive at destination and 8 will be deducted and transfered to the owner address. using blueprint to deploy tact sc.

E: Any idea? I need any way to pass wallet in smart contract and then send money to this wallet (reply to 41833)

Jiego: message A { addy: Address; }  Receive(msg: A) { SendMoneyTo(msg.addy) } (reply to 41833)

Jiego: https://docs.tact-lang.org/book/structs-and-messages/#messages (reply to 41851)

Jiego: Override the internal transfer function? Have a trait that does so? (reply to 41850)

E: Thank, but I'm trying to send data to a contract message via web - ton connect (reply to 41861)

E: not from another smart contract

E: tests is working. But how to send via ton connect there is no examples in docs )

Jiego: Show me the docs (reply to 41865)

ctb0k33: Hello guys, is there any chanel for funC language ? Or people just use tact most of the time now ?

E: i mean - working with tact functions which receive structured message (reply to 41865)

Jiego: U using this? https://github.com/ton-connect/sdk (reply to 41868)

E: yes. There is examples for working with simple string message, not structured message https://docs.ton.org/develop/dapps/ton-connect/transactions (reply to 41869)

E: build text payload - ok. This is working. But how to send {$$type: "MessageObject", affiliate: "address-here"} - the question.

Jiego: https://docs.ton.org/develop/dapps/ton-connect/transactions#sending-complex-transactions (reply to 41871)

Jiego: You have to build the message body using cells

Jiego: https://docs.ton.org/develop/dapps/ton-connect/transactions#transfer-with-comment  Suggests to use https://github.com/toncenter/tonweb  There you can find https://github.com/toncenter/tonweb/blob/master/src/contract/README.md (reply to 41871)

E: Thank you. (reply to 41873)

Sergey: Guys, hello.  Could you please help me?  I'm building a payload to send jetton like this:   transferPayload := cell.BeginCell().  MustStoreUInt(sendJettonOpCode, 32).  MustStoreUInt(uint64(messageID), 64).  MustStoreBigCoins(tlb.MustFromDecimal(fmt.Sprintf("%f", amount), jettonData.Decimals).Nano()).  MustStoreAddr(h.contractAddress).  MustStoreAddr(parsedSenderAddress).  MustStoreBoolBit(false).  MustStoreBigCoins(tlb.MustFromTON("0.05").Nano()).  MustStoreBuilder(forwardPayload).  EndCell()   also I calculate jettonAddress of the sender this way:   token := jetton.NewJettonMasterClient(api, address.MustParseAddr(jettonData.MasterContract))  senderTokenWallet, err := token.GetJettonWallet(ctx, parsedSenderAddress) if err != nil {  h.log.Error().Err(err).Msg("failed to get wallet for sender")   return "", "", err }   but when I'm trying to send such transaction i see this.   if i send such transcation i will get 49 exit code. I couldn't find any info about this code.   but the most interesting part - the same code works perfectly in testnet.   maybe someone can help me?

Sergey: also the same happenes with the usdt

Howard: awesome! (reply to 41025)

Zahid: Hi

— 2024-10-04 —

Howard: cool, where is the previous message? (reply to 40994)

Howard: it shows in Failed because you calculated in wrong Jetton Wallet Address sir. (reply to 41876)

Howard: you can check your output folder to check the Exit Code.  https://docs.tact-lang.org/book/exit-codes/ (reply to 41876)

Baldwin: Can anyone who has used checkDataSignature give me an example, pls?

Mahima Thacker: Hey Everyone. I have node version 22.9.0 and npm version 10.8.3 but still I am getting this error while creating tact project.  npm ERR! Darwin 23.1.0 npm ERR! argv "/usr/local/Cellar/node/22.9.0/bin/node" "/Users/codecrunch/node_modules/.bin/npm" "install" "--ignore-scripts" npm ERR! node v22.9.0 npm ERR! npm  v2.15.12 npm ERR! path /Users/codecrunch/Documents/mansi/Telegram/escrow(ton)/escrow/node_modules/@types/jest/package.json npm ERR! code ENOTDIR npm ERR! errno -20 npm ERR! syscall open  npm ERR! ENOTDIR: not a directory, open '/Users/codecrunch/Documents/mansi/Telegram/escrow(ton)/escrow/node_modules/@types/jest/package.json' npm ERR!  npm ERR! If you need help, you may report this error at: npm ERR!     <https://github.com/npm/npm/issues>  npm ERR! Please include the following file with any support request: npm ERR!     /Users/codecrunch/Documents/mansi/Telegram/escrow(ton)/escrow/npm-debug.log Error: Command failed: npm install --ignore-scripts     at genericNodeError (node:internal/errors:983:15)     at wrappedFn (node:internal/errors:537:14)     at checkExecSyncError (node:child_process:890:11)     at execSync (node:child_process:962:15)     at main (/Users/codecrunch/.npm/_npx/b56225140edd990c/node_modules/create-ton/dist/cli.js:117:42) {   status: 236,   signal: null,   output: [ null, null, null ],   pid: 41715,   stdout: null,   stderr: null }

Sergey: thank you for your reply! but that was not the case.  I don't know why exactly, but if I add one zero uint before the forward payload slice - it is working properly. But i also needed to read that uint in smart contract.  And as I said before - have no idea why it was working in testnet (reply to 41890)

Anton: not sure if it will work but try removing the parentheses from your directory name escrow(ton) (maybe something like escrow-ton) (reply to 41895)

— 2024-10-05 —

sixvxsh: Did you find an answer to the question? same question. (reply to 41734)

King: yes (reply to 41924)

Jiego: https://github.com/howardpen9/jetton-implementation-in-tact/blob/8ff4598bceab69a25093cc7147d017275299776d/sources/messages.tact#L21  https://github.com/howardpen9/jetton-implementation-in-tact/blob/8ff4598bceab69a25093cc7147d017275299776d/sources/messages.tact#L23 (reply to 41734)

Jiego: You could have a custom payload at transfer time

Jiego: I think I didn't quite understand, but let me try: are you asking me if by using JettonTransfer on any other jetton contract, even if you didn't deploy it, you can transfer it? In that case yes, JettonTransfer is a standard message (reply to 41931)

Jiego: Just like transfer(amount, to) is a standard on erc20

Jiego: I haven't done it myself but it makes sense, yes (reply to 41934)

Mahima Thacker: Thanks for the response, I will give it a try (reply to 41900)

Arman: hi everyone, is there a way to upgrade a contract to add a new getter in tact please? I mean ofc in tact docs I found that it is not supported, but I wanted to make sure or if there is any workaround for that

Laisky: you may take a look at this  repo https://github.com/Laisky/tact-utils/blob/main/contracts/common/traits.tact#L99 (reply to 41939)

Arman: thank you, I will try it out!!

Mehmet Ali: Need an example of a tax jetton contract which enables %8 tax of the total amount transfered. It will transfered to the owner.

Mehmet Ali: Should be tact language.

— 2024-10-06 —

Ton.: Hello guys glad to be here. I have some issues with my project and i need some help. I created a jetton and when it reach out 27k mc and join DeDust it apears at wallets as FAKE. How i could verify my jetton and be clear? Could anyone help me with that?

Yuri: Hello! Could you provide an example of code that demonstrates how to write a contract that can accept different jettons from users?

User<6323497659>: Hello! I am a senior UI/UX designer with experience working with Ocean Kombat, Blum and other projects. Ready to take a leadership position in a project or make a one-time design for your child’s Web3! Contact: @slacked Providing a portfolio upon request

Ton.: i creaded on gas.pump (reply to 41964)

Yuri: I've seen this docs I just need to see contract's code that works with multi-jetons. I wanna get in how to transfer different jetons from contract-to-contract, contract-to-user (reply to 41967)

NearWormHole ▪️ 🐾: Please I want to ask, how to verify if a is holding my jetton. Or a wallet is holding nftItem from my nftCollection

— 2024-10-07 —

⁭: There is information about the storage price. When you store 100 ints you pay something every year. It takes from sc balance? Should I clear somehow state I don't need?

dotfx: Hi We're finishing a product but would like to have it reviewed and fixed if necessary by an experienced Tact dev/audit company (paid service, ofc) Do you have a list of reachable people for that task maybe? Thanks

Igor: Hi, we can help you with the code review and recommend TON experienced auditors. (reply to 41980)

Anton: https://docs.ton.org/develop/companies/auditors (reply to 41980)

Anton: @dotfx have you tried https://github.com/nowarp/misti on your project?

dotfx: nop, will have a look, thanks and probably contact someone to be sure our code is safe and optimized (reply to 41983)

dotfx: Can we dm? Thanks! (reply to 41981)

Cyril M |: what's the wrap jetton token for TON?

<\>: Hi

Albert: Hello how can i decode raw data in a transaction?

Mehmet Ali: contribution needed for our open-source jetton creation on TON with TACT. We are trying to deploy a jetton with a %8 tax to the owner for every transaction.

Pat: Hi in solidity i can compare twoo adresses like this: "if(address1 > address2)", can I somehowe recreate that in tact?

Anton: you can use parseStdAddress(YOUR_ADDRESS.asSlice()) and get this struct in return:   struct StdAddress {     workchain: Int as int8;     address: Int as uint256; } (reply to 41998)

Pat: I tryed but i received: " contracts/ton_tut.tact:187:32: Static function "parseStdAddress" does not exist"

Anton: this is available starting Tact v1.5 (reply to 42002)

Albert: hello, do u have any idea for my question? (reply to 42003)

Albert: here (reply to 41995)

blocksdev: Hey i recently started learning about TON development and there are few things i have missed, is there any open-source guide or paid course for this ?  i used docs.ton.org and docs.tact-lang.org . (reply to 42001)

— 2024-10-08 —

blocksdev: Thanks 🖐️ (reply to 42007)

Laisky: also recommand https://github.com/Laisky/tact-utils (reply to 42006)

traceur: Hi guys, I have a question about jetton transfer: does the forward_payload has a max length restrication? I try to put some data into the forward_payload to interact with another smart contract.  The code below works fine.  let b_0 = new Builder(); b_0.storeAddress(sender);  await userWallet.send(     …     …     {         …         forward_payload: b_0.asSlice()     } )  But the code below has this error “BitBuilder overflow”.  let b_0 = new Builder(); b_0.storeAddress(sender); b_0.storeAddress(sender); await userWallet.send(     …     …     {         …         forward_payload: b_0.asSlice()     } )  Why storing only two addresses causes overflow?

live: hello，everybody，hao can i convert Int to Int as coins?

Tree: Hey, how did you solve the problem? Can you please share？ (reply to 36351)

NearWormHole ▪️ 🐾: Please Dev’s on $TON eco. How can I do holder’s verification of a particular Jetton or NftCollection in the frontend.  [ isHolder, setHolder ] = useState(false) ;  async function checkHolder(userFreindlyAddress) { await // how to check if a wallet is an holder of a particular nft if isHolder setHolder(true)   if(isHolder) { console.log("Is Holder)  } else { console.log(" You didn't have any of this asset/nftItem from nftcollection in Your wallet"  }

Max: Hey guys, what’s the difference between the following?  .storeAddress(myAddress()) vs .storeSlice(myAddress().asSlice())  I’ve seen both implementations used in a jetton transfer message body

traceur: this error is due to the BitBuilder has max size: 1023 bits (reply to 42019)

traceur: I guess when building “TokenTransfer” message, all the fields add up with forward_payload(two addresses) exceed 1023.   {                 $$type: 'TokenTransfer',                 queryId: 124n,                 amount: 100n,                 destination: address1,                 response_destination: address2,                 custom_payload: null,                 forward_ton_amount: toNano("0.01"),                 forward_payload: b_0.asSlice() }

traceur: Does anyone know how to put complicated data in forward_payload and not cause the overflow error?

Laisky: use struct? (reply to 42029)

traceur: Yes I have already tried using struct, still has overflow problem. (reply to 42030)

traceur: If the struct is complicated, the builder compiled from the struct still has large data size

blocksdev: This is very helpful .. (reply to 42018)

Eliasnuru🍅: Okay

Denys: Hi all, I got an error while creating a project on Tact via blueprint. I run the npm create ton@latest command, specify project names, contract name, then select an empty Tact project, then this error occurs: [3/3] Creating your first contract... Build script running, compiling Counter ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function     at resolveFunctionDescriptor (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@tact-lang/compiler/dist/types/resolveDescriptors.js:600:31)     at resolveDescriptors (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@tact-lang/compiler/dist/types/resolveDescriptors.js:1243:19)     at precompile (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@tact-lang/compiler/dist/pipeline/precompile.js:18:55)     at Object.build (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@tact-lang/compiler/dist/pipeline/build.js:62:43)     at doCompileTact (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@ton/blueprint/dist/compile/compile.js:113:28)     at doCompileInner (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@ton/blueprint/dist/compile/compile.js:127:22)     at doCompile (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@ton/blueprint/dist/compile/compile.js:142:23)     at async buildOne (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@ton/blueprint/dist/build.js:21:24)     at async create (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@ton/blueprint/dist/cli/create.js:102:9)     at async main (/media/kali/Local Disk/Folder/Projects/Work/ton/Tact/counter/node_modules/@ton/blueprint/dist/cli/cli.js:91:5) Error: Could not find boc in tact compilation result  Error: Command failed: npm exec blueprint -- create Counter --type tact-counter     at checkExecSyncError (node:child_process:890:11)     at execSync (node:child_process:962:15)     at main (/home/kali/.npm/_npx/b56225140edd990c/node_modules/create-ton/dist/cli.js:133:34) {   status: 1,   signal: null,   output: [ null, null, null ],   pid: 219882,   stdout: null,   stderr: null } But if I create a func project, everything works fine.

ed: Use the latest version of node nvm install node (reply to 42040)

Anton: you need node.js version 22 (reply to 42040)

Denys: ok, thanks

Rinat | ZilPay (Will not Call or DM you): what is this error? blueprint build Jetton                                                                                                                                                            │          │Using file: Jetton                                                                                                                                                                  │          │Build script running, compiling Jetton                                                                                                                                              │          │⏳ Compiling...Tact compilation failed                                                                                                                                              │          │TypeError: paramSet.isSubsetOf is not a function        {     "name": "funtonic-sc",     "version": "0.0.1",     "scripts": {         "start": "blueprint run",         "build": "blueprint build",         "test": "jest --verbose"     },     "devDependencies": {         "@ton/blueprint": "^0.24.0",         "@ton/sandbox": "^0.22.0",         "@ton/test-utils": "^0.4.2",         "@types/jest": "^29.5.13",         "@types/node": "^22.5.5",         "jest": "^29.7.0",         "prettier": "^3.3.3",         "@ton/ton": "^15.0.0",         "@ton/core": "~0",         "@ton/crypto": "^3.3.0",         "ts-jest": "^29.2.5",         "ts-node": "^10.9.2",         "typescript": "^5.6.2"     } }

Deedee: help me!! Build script running, compiling SimpleCounter ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function

Georgiy: Update Node.js to version 22+ (reply to 42046)

Prateek: I'm working on integrating write functions with our frontend for our smart  on the Tact blockchain and would appreciate your guidance on the best practices for interacting with these functions. can u guys help me on that

Deedee: tks, after update node 22: Error: Your application tried to access dotenv, but it isn't declared in your dependencies; this makes the require call ambiguous and unsound.  Required package: dotenv Required by: /Users/admin/Desktop/ton-smct/simple-counter/node_modules/.pnpm/@ton+blueprint@0.24.0_@ton+core@0.58.1_@ton+crypto@3.3.0_@ton+ton@15.0.0_@types+node@22.7.5_typescript@5.6.2/node_modules/@ton/blueprint/dist/cli/ (reply to 42048)

Georgiy: That's some kind of npm magic which is not related to Tact. Perhaps, you should add dotenv to your dependencies, or somehow change the configuration of your local environment. (reply to 42050)

Deedee: so not work

Georgiy: I came across this contract again while testing Misti. The latest 0.4 version shows 19 warnings, including duplicated code and incorrect behavior of some standard library functions, which may lead to issues in the frontend's functionality. (reply to 38182)

Ashwin: hey guys. I have a Ton proof from my backend which i need signature for.  If i sign using the mini app opened on Telegeam - connected to tonkeeper using ton connect. signature verification works well  But if i run the same app inside tonkeeper using the URL, the signature verification fails

Ashwin: anyone who can help me is much appreciated

— 2024-10-09 —

Ashwin: Is there a way to verify ECDSA signatures on TON?

Johnny Le: check_signature in ton docs (reply to 42102)

Ashwin: But that doesn't have anything to do with ECDSA

User<7835018115>: how to manage an already deployed contract in the tact language, how to call the burn and mint functions?

mo.eth: Hey admin, from where a can start gas optimization (Opcodes and bytes)?, just like EVM world (reply to 42042)

Georgiy: Misti provides some detectors that could find suboptimal code patterns. (reply to 42112)

mo.eth: Thanks bro 🤜🏻🤛🏻 (reply to 42113)

Pat: Hi, I am trying to test signature like this:              const signatureCell: Slice = beginCell().storeBuffer(data.signature).endCell().asSlice();              const getTicketsResult = await tonTut.send(                 player1.getSender(),                 {                     value: toNano('0.15'),                 },                 {                     $$type: "GetRaffleTicketsMessage",                     raffleId: BigInt(0),                     account: player1.address,                     amount: BigInt(1),                     signature: signatureCell,                     nonce: BigInt(0),                     randomness: BigInt(100)                     }             );  My constract expect signature to be a Slice, but when i run the test i receive this error:     Invalid argument        749 |         let b_1 = new Builder();       750 |         b_1.storeUint(src.nonce, 256);     > 751 |         b_1.storeRef(src.signature.asCell());           |             ^       752 |         b_1.storeUint(src.randomness, 256);       753 |         b_0.storeRef(b_1.endCell());       754 |     };  I wonder what do i do wrong_

Anton: 📢 Folks, the Tact VS Code plugin with v1.5 support has landed on the Marketplace:  https://marketplace.visualstudio.com/items?itemName=KonVik.tact-lang-vscode

blocksdev: Cars ++ (reply to 42123)

Denys: Hi all, is there any official implementation of Jetton on Tact, or where can I get the token code?

Andrey: Hi all! I want to create keccak256 function with dynamic number of data items. Now I am writing many functions with many params. It looks bad. Is it possible to write common function with first argument of data items count and second argument of mapping or something else?

traceur: Hi all, what does exitCode -14 stand for? I can’t find it in https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes

Jiego: https://docs.tact-lang.org/book/exit-codes/#13 (reply to 42160)

— 2024-10-10 —

Laisky: you may take a look at https://github.com/Laisky/tact-utils This is not an "official implementation," but I am working on to improve it. (reply to 42131)

Anton: The last function is not going to work at all. Since Tact does not support variadic functions, the best thing you can do at this point is define a dispatch function that would call functions with 1, 2, 3, … slices up to a certain number of arguments (reply to 42141)

Denys: Thank you. But I can use the Jetton code on FunC (I think there is an official implementation there) and then just call the necessary methods from the Tact code? (reply to 42163)

zonh: Hi friends, I am using ton4j sdk in java language to calculate the usdt address, but I cannot calculate the hash of state_init correctly. Actually the usdt wallet code is b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd 5d8af2b7c3d68. Can anyone help me? Thank you very much.

Vicki: hi， Has anyone ever used @ ton/cocos sdk?

Laisky: yes. (reply to 42169)

Baldwin: Why am I not getting fields from messages?

Hiếu: Hello, can I have the git of Ton's smartcontract, tact

Yehor: Hi all, how can I put an address into a variable? Here's how I'm trying to do it const targetAddress: Address = Address.parse("UQC7H_Csp1ZzOkzn43KHj_41qyMnX4hIQWdQZmFIXaHguAVu");

Pat: Hi!  I implement checkSignature exactly how it is shown in the docs, but does someone have a valid test for checking if signature works correctly?

Yehor: thanks (reply to 42183)

Baldwin: How to loadAddress from bounced JettonTransfer, please?

‌‎ㅤ: how can I see the name of my getter function? when deployed, I try to get it using tact name which is "getNumberOfPurchases", yet receive Exit code: 11  I suspect in funC my func is named differently  https://testnet.tonviewer.com/kQDMRt17uxuiTZTJHc72E9B9HBReGt8uoWR2z4ByIubVy2zz?section=method

Freed: you need to add "fun" before function name to be able to get it like that, otherwise you should use generated tact wrapper to interact with tact functions (reply to 42188)

Cyril M |: how do you parse bounced message?

Denys: Hi guys, hint how to verify Tact contract at https://verifier.ton.org/

Denys: If I upload all the files I have in the build folder, I get this error: Error: Compile error  {"stack":"Error: Unsupported tact version: 1.5.2\n at TactSourceVerifier.<anonymous> (/app/src/source-verifier/tact-source-verifier.ts:91:15)\n at Generator.next (<anonymous>)\n at fulfilled (/app/src/source-verifier/tact-source-verifier.ts:28:58)","message":"Unsupported tact version: 1.5.2"}

Anton: TON Studio is hiring!  TON Studio team is seeking for Lead Developer (smart contracts & audits).  You will work with both FunC and Tact smart contracts to develop highly optimized, secure, and efficient DApps, leveraging your understanding of Fift, TVM, and gas optimizations.   You can find more details about the job opening and apply here: https://jobs.ton.org/companies/ton-studio/jobs/41178106-lead-developer-smart-contracts-audits#content  We invite builders to post vacancies in the TON Jobs channel. To do this, you need to write to support @tonjobs_support (forwarded from TON Jobs)

‌‎ㅤ: what do you mean? (reply to 42189)

Cyril M |: do not use camel case (reply to 42188)

Cyril M |: get_number_of_purchases

Bohdan: hi guys, I want to add ton payment into my telegram web app so users can buy upgrades for their profile. Could you give me some resources where I can read how to implement it? And another question, should I create a separate smart contract for it?

User<7008929507>: npm create ton@latest -- testcoin --type tact-counter --contractName test   I'm getting this error when running npm create out of the box.

User<7008929507>: What could be the issue?

Daksa_eth: Hi Guys, i have problem in here could you please guide me   npx blueprint build Using file: FirstContract Build script running, compiling FirstContract ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function

ダーリン: you need to upgrade node version (reply to 42220)

Daksa_eth: oh thank you so much

Daksa_eth: Thank you , solved🙏🏻🌷🌷🌷 (reply to 42221)

— 2024-10-11 —

Baldwin: can anyone help me? (reply to 42187)

Jiego: That's another team (reply to 42191)

Dannel: what is exit code 9577 on tact ?

Dannel: can anyone help me?

Sol: Hello everyone, I am looking for technical assignments on the topic of smart contracts to gain experience. I already have one developed smart contract on my account. If anyone needs it, I will demonstrate the code or its operation

Laisky: Anything over 1000 is your custom error. (reply to 42244)

Dannel: I use tact, i dont see 9577 in my code (reply to 42247)

Laisky: You may used require (reply to 42248)

Laisky: The string in require will be converted to error code

Sameer: Bro I need to learn c language from starting 😅

Dannel: Thank you, i will check

Sameer: I am first year student 😂

Laisky: That’s why I prefer nativeThrow https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact#L109 (reply to 42253)

Max: Hey guys, suppose we want to build a simple lending protocol, can we use maps to store balances of users with addresses? I realize its not the most efficient solution, but can it work?  What’s the current limit on the amount of data that can be stored in maps?

Anton: Basically it’s 10s thousands of entries (reply to 42256)

Max: So for example, if we limit the number of loans to 5,000, we’re good? (reply to 42257)

Anton: Should be fine, but you really need to stress test it before doing that in production (reply to 42258)

Laisky: Generally, Do not store any user data in your contract; create an independent wallet contract for each user to save their own data. (reply to 42256)

Max: Yes, but imagine that a main contract determines the price of the collateral, and when the price falls below a certain point, it needs to liquidate loans where the collateral ratio is below acceptable.   You’d need to store borrowers and their positions in the main contract, otherwise you’d need a system with off-chain tracking like Liquity (reply to 42261)

User<2044870299>: import "@stdlib/deploy";

User<2044870299>: set(msg.index, true);         self.sendJetton(msg.queryId,             self.airdropSettings.tokenWalletAddress!!,             walletAddress,             claimableAmount,             sender(),             "claim"         );     }      //   withdraw TON     receive("withdraw"){         self.requireOwner();         let params: SendParameters = SendParameters{             to: sender(),             bounce: true,             value: 0,             mode: (SendRemainingBalance + SendIgnoreErrors)         };         send(params);     }      receive(msg: WithdrawToken){         self.requireOwner();         self.sendJetton(msg.queryId,             self.airdropSettings.tokenWalletAddress!!,             sender(),             msg.amount,             sender(),             "withdraw"         );     }      receive(){         let ctx: Context = context();         // https://docs.tact-lang.org/ref/core-advanced#nativereserve         nativeReserve(ctx.value, ReserveAllExcept);     } } message SetBaseParams {     args: AirdropSettings; } message Claim {     queryId: Int as uint64;     proof: Cell;     index: Int; } message WithdrawToken {     queryId: Int as uint64;     amount: Int as coins; }

Albert: Hello, do u have an example how to trace transfer events for wallet by js?

Laisky: I understand that this is very difficult to do. However, I have a feeling that there should be a more distributed way to implement it. Not sure how yet. (reply to 42262)

Albert: But i want to trace ton transfer in ton blockchain

Laisky: This looks like a stupid GPT bot. (reply to 42269)

Laisky: https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get  Is this HTTP API meet your need? (reply to 42266)

Max: But searching an entry in the map would be super gas consuming, right?  Let’s say we have 5,000 entries (a map of structs) and we need to find the one with the lowest property’s value (reply to 42259)

Albert: but it's always get 10 transactions right? I want to pull data everyday (reply to 42273)

Anton: You will have to either traverse the whole map or create a new map-based data structure that keeps the minimal value alongside the map and updates it when there is a map insertion/deletion (reply to 42274)

Max: Got it, thanks! (reply to 42276)

Albert: thank u so much

Laisky: I've created a Jettons Staking template using Tact. Anyone interested can check it out, and any questions or PRs are welcome. https://github.com/Laisky/tact-utils/tree/main/contracts/staking

Pat: Hi, can someone please tell mi with checkSignature/checkData signature functions? I am trying to create valid signature in tests, bot constantly failing

Pat: help me with*

⚡️ Ἑρμῆς (Hermes): Hi guys, need some help, I am trying to calculate my contract Jetton wallet inside the contract struct JettonWalletData {     ownerAddress: Address;     jettonMasterAddress: Address; }  fun calculateJettonWalletAddress(ownerAddress: Address, jettonMasterAddress: Address, jettonWalletCode: Cell): Address {     let initData = JettonWalletData{ownerAddress, jettonMasterAddress};     return contractAddress(StateInit{code: jettonWalletCode, data: initData.toCell()}); } As Jetton I use example from ton-dynasty  function from JettonWallet -  override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {         return initOf ExampleJettonWallet(owner_address, self.jetton_master);     }  Jetton Master function - get fun get_wallet_address(owner_address: Address): Address {         let initCode: StateInit = self.calculate_jetton_wallet_init(owner_address);         return contractAddress(initCode);     }  Yet in my tests I get two diffrent wallets, I am loosing my mind  let masterPredictedWallet = await jettonMaster.getGetWalletAddress(MyCoolContract.address)          console.log(await MyCoolContract.getJettonWallet()) // EQCEMrJerbRirCbXmbDXNik03AmvErXe5_yYR9ZINwNHWFFS         console.log(masterPredictedWallet) // EQAS3hnn6C1KeNNn3ehx90iOqqMAEGaPs6xbNaCRwMtAro3Q  Any Ideas what went wrong?  UPD, jettonWalletCode are same, so I am just stuck

dotfx: Nice contract Can I dm you? (reply to 42287)

Viacheslav: oh, you have Upgradable trait implemented, does it really work? (reply to 42287)

Viacheslav: did you test it? in which cases? (reply to 42313)

Viacheslav: shouldn’t it be Taxable? https://github.com/Laisky/tact-utils/blob/286311965b3c8f5394783035ee13a6a94e86e684/contracts/common/traits.tact#L7 (reply to 42287)

Viacheslav: why should we deploy staking wallet separately, why can’t we deploy it during initial stake? (reply to 42287)

Pat: Thank you i will try it first thing tomorrow (reply to 42325)

Rehman: No, I don't (reply to 42329)

dazzler: Can anyone explain any one how to integrate the ton wallet on our dapp

Viacheslav: why does blueprint still uses tact compiler 1.4.0? https://github.com/ton-org/blueprint/blob/ca4dcdd9e17e4bd0fcc2168801fe311997a81e67/package.json#L37

Anton: this is fine because of the ^ sign (reply to 42339)

Viacheslav: ah, I see, thanks for pointing this out 🙂 (reply to 42340)

— 2024-10-12 —

Laisky: There is a helloworld_upgrade in script’s directory (reply to 42314)

Laisky: Because I have no idea how to deploy a staking wallet via token transfer notification (reply to 42316)

Howard: does anyone got this notify before?

⚡️ Ἑρμῆς (Hermes): I am having same issue with latest tact extension, just ignoring this as of now (reply to 42357)

Neo: how to resolve the bytecode always the same , when use npx blueprint build ?

Neo: deploy on chain , the contract address always the same

Rahul: The contract address is derived from the contract code and initial data. The address will only change if either the code or the initial data changes.

Anton: You can add an integer field (usually called seqno) to trigger new deployments when you change that integer in the initial data (reply to 42363)

Dmitry: Hi everyone, is there a lsp server fot tact luanguage for nvim?

— 2024-10-13 —

mgnfy_view: Tact isn't compiling for me Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function

mgnfy_view: Any solution for this?

Georgiy: Update to Node.js 22+ (reply to 42383)

mgnfy_view: I have 22.0.0 (reply to 42384)

Georgiy: It may not be in use for this particular execution. I would investigate the local environment installation. (reply to 42385)

mgnfy_view: Oh, great! It worked

mgnfy_view: Had to run nvm use 22.0.0

mgnfy_view: How can I customize the behavior of the default formatter that comes with Tact VSCode extension?

mgnfy_view: I want to separate some imports with a new line, but the formatter keeps removing the blank line

Daksa_eth: I have a question and that is whether the development of tact language is finished or not, and whether it is possible to write a complete smart contract with it?

Anton: Yes, you can write smart contracts in Tact. And no, no language can be ever finished and Tact is being very actively developed (reply to 42394)

Daksa_eth: I have a site where my users get points and everything is happening off-chain. I want to create a token after the number of users increases so that the tokens can be sent to the users. This can be an airdrop similar to notcoin. is it possible with tact? (reply to 42395)

Daksa_eth: Thank you so much🙏🏻🌷

Mikko: Yes (reply to 42396)

Mikko: Token standard is called Jetton

Daksa_eth: Thank you so much , yes it's Jetton (reply to 42399)

Mikko: No matter which number you choose someone can spam your map full, as wallets are free to create, so you are not good (reply to 42258)

Max: Well if there’s a certain fee to get a loan, I doubt that it can be spammed to someone’s advantage (reply to 42402)

Pat: Have someone done signatures right way? I have some problems to write tests for them

Georgiy: You could write unit tests using the local sandbox environment and run the static analyzer over your contracts to automatically detect some common problems. (reply to 42414)

Georgiy: You could interact with the contract locally using blueprint (reply to 42422)

Иван: Hello. Why is it not allowed to store addr_none (two bits: 00) in an Address variable? It fails to verify in __tact_verify_address. What should I do if I need to represent it? Do I have to lose type-safety and use Slice?

live: hi, everyone, Does anyone know what this constant does?

Behruz▪️: Hello dear ton developers, I wanted to create a smart contract and the smart contract should have such a function, the ton should be removed from my first wallet to another wallet, and the tokens in the wallet should come to me from the wallet that sent the ton, but if I put the ton in that wallet, it will remove the ton to another wallet if if a smart contract is created and a ton is sent and that wallet is banned from sending a ton to another wallet until the smart contract is executed

Laisky: here are some examples for testing with blueprint https://github.com/Laisky/tact-utils/tree/main/tests (reply to 42424)

Pat: Have you ever seen valid test case for checkSignature function? (reply to 42438)

Anton: For now yes, please open an issue about your use case in the tact-lang/tact repo on GitHub (reply to 42427)

Viacheslav: what is the best way to switch between different payloads once receive TokenNotification? I need to do different actions based on this, e.g. record Jetton deposit or deploy a contract

Viacheslav: can I just compare forward_payload with a specified message struct and do if else? (reply to 42453)

Иван: You can try MyStruct.fromCell and see if it throws or succeeds (reply to 42454)

Viacheslav: something like this? https://docs.tact-lang.org/ref/core-cells/#messagefromcell (reply to 42455)

Иван: Yes, but message or struct depends on if you expect the opcode in the cell or not (reply to 42456)

Viacheslav: I think that having an opcode is cleaner? (reply to 42457)

Иван: How to encode your data is 100% your choice. There's no right answer, it all depends (reply to 42458)

Viacheslav: agree, I’m at the planning stage atm and thinking about a better option (reply to 42459)

User<7185613751>: nice

— 2024-10-14 —

Tiqan: Hey. Is it possible to check if sender is from the same contract but with different data? So the code is the same but the data in the init is different.

Laisky: absolutely, just initOf a new contract then check the address (reply to 42469)

Tiqan: But for initOf I would need the data of the other contract

Laisky: Indeed, if you don't know the initial data of the other party, you can't verify its address. However, you can simply compare the code of the two contracts off-chain. (reply to 42471)

Tiqan: Thats not what i want… I want to compare code of sender and receiver on chain :/

Tiqan: So i will have to send the data for the initOf with it. Got it

traceur: Hi all, does Tact support keccak256 function to calculate some data’s hash?

Thang: Does anyone have an example of writing an ICO contract on TON using Tact that I can refer to?

Baldwin: you can hire me 😄 (reply to 42479)

Dannel: Pm me (reply to 42479)

Laisky: your msg.response_destination may not an optional variable, so it can not be compared with null. (reply to 42489)

Laisky: why you need this if (msg.response_destination != null) (reply to 42491)

Laisky: This site has nothing to do with me. (reply to 42493)

Laisky: BTW, this is my example https://github.com/Laisky/tact-utils/tree/main/contracts/jetton

Laisky: check the repo's README (reply to 42496)

Laisky: no (reply to 42498)

Laisky: absolutely not, My contract template is handwritten by me; it can't possibly be the same as anyone else's. But they all follow the same TEP standard. (reply to 42501)

Denys: Hi everyone, if I want to transfer a Jetton token to a new account (who has not yet deployed a wallet contract), will I pay more gas for deploying a new contract than if the user has already deployed a wallet code and I just transferred the tokens to him?

⚡️ Ἑρμῆς (Hermes): Hi guys, I am trying to make a simple jetton transfer to my contract jetton wallet (uninitialized) async function sendJettonTo(         jettonContractSender : SandboxContract<ExampleJettonWallet>,         sender: SandboxContract<TreasuryContract>,          amount: bigint,          receiver: Address         ) {         console.log(`Jetton sender is ${sender}`)         console.log(`Jetton sender wallet is ${jettonContractSender.address}`)         expect((await jettonContractSender.getGetWalletData()).owner == sender.address);                      const receiverWalletAddress = await jettonMaster.getGetWalletAddress(receiver);         console.log(`Receiver wallet addr - ${receiverWalletAddress}`)          const jettonTransfer: JettonTransfer = {             $$type: 'JettonTransfer',             queryId: 42n,             amount,             destination: receiver,             responseDestination: receiver,             customPayload: null,             forwardTonAmount: toNano('1'),             forwardPayload: beginCell().endCell().asSlice(),         };              const transfterResult = await jettonContractSender.send(             sender.getSender(),             {                 value: toNano('1'),             },             jettonTransfer         );          expect(transfterResult.transactions).toHaveTransaction({             from: sender.address,             to: jettonContractSender.address,             success: true, // TokenTransfer         });          expect(transfterResult.transactions).toHaveTransaction({             from: jettonContractSender.address,             to: receiverWalletAddress,             success: true, // TokenTransferInternal         });          expect(transfterResult.transactions).toHaveTransaction({             from: receiverWalletAddress,             to: receiver,             success: true, // TransferNotification         });      }      async function getAddressWallet(addressOf: Address) {         return  await jettonMaster.getGetWalletAddress(addressOf);     }      });  Yet here   expect(transfterResult.transactions).toHaveTransaction({             from: jettonContractSender.address,             to: receiverWalletAddress,             success: true, // TokenTransferInternal         });  I get an error  tx with error -  {         lt: 24000000n,         now: 1728905596,         outMessagesCount: 1,         oldStatus: 'non-existing',         endStatus: 'non-existing',         totalFees: 133331n,         from: EQB4pYdHxm5W_LUTwb95WJa8TRVRHpOJcOEdhstsOd1kNjFL,         to: EQBKYVaEOCtpLl0GYyAdirl2FTY_ZWmvvQLQfcp9l_-c41O5,         on: EQBKYVaEOCtpLl0GYyAdirl2FTY_ZWmvvQLQfcp9l_-c41O5,         value: 991702000n,         body: x{178D4519000000000000002A10180194DDFF9BA93265B574C215ABD4BFD85D208744D2A7628686A3532A89A239C26F002FD9AE056F45A00DF9FEFDAC41AC65106F9D929FD6E03C8F80C666150175DAA750EE6B2802_},         inMessageBounced: false,         inMessageBounceable: true,         op: 395134233,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: true,         destroyed: false,         exitCode: undefined,         actionResultCode: undefined,         success: false       }     > 292 |         expect(transfterResult.transactions).toHaveTransaction({           |                                              ^       293 |             from: jettonContractSender.address,       294 |             to: receiverWalletAddress,       295 |             success: true, // TokenTransferInternal        at sendJettonTo (tests/NAPSingle.spec.ts:292:46)  I believe the error is because of my smart contract jetton wallet is not being initialized(but I have no idea why)

Иван: Btw, is someone maintaining JetBrains IDE plugin (tact part) or not? It's quite broken right now (reply to 42505)

Shivam maurya: Can any one send me multisender smart contract please

Shivam maurya: ? (reply to 42508)

Shivam maurya: I am a beginner to this language

0xParSa | Σ🧠Ξ: hey

Shivam maurya: How i can transfer token from contract to any user address

Shivam maurya: I am working on multisender smart contract

Viacheslav: what’s the difference between using require and nativeThrowUnless?

Viacheslav: Is it the e only difference or maybe nativeThrowUnless is more efficient? (reply to 42520)

Viacheslav: Any rule to follow to choose between them?

Shivam maurya: ? (reply to 42508)

Viacheslav: Feels like require makes code more readable, especially if doesn’t bring any downsides (reply to 42524)

Viacheslav: But predefined codes make it easier to debug…

xiaoyu1998: please help send me an open source AMM dex repository in tact for study

xiaoyu1998: i am porting a solidity margin trading dex to ton

xiaoyu1998: I have read all "tact by examples", its similar with solidity, I am chosing tact or func to implement my dex, which has more than 10K lines solidity?  is there any mass production dex written by Tact? why the tact twitter(https://twitter.com/tact_language) is not active from aug. 2023?

Anton: You can follow @tact_kitchen for some pre-release updates shared by the Tact team or @tondev_news for Tact releases (reply to 42545)

xiaoyu1998: thanks

Anton: There is a DEX written in Tact afaik. I think it is called PixelSwap (reply to 42545)

mgnfy_view: How do you get users to deposit TON into a contract? Can you share a code snippet?

mgnfy_view: Not just using an empty receive, but a receive function with a message struct

mgnfy_view: Also, is there a way to get users to deposit the exact amount of TON? Like I want the user to deposit 1 TON, but some of the ton sent with transaction can get consumed for gas costs

⚡️ Ἑρμῆς (Hermes): Update didn't fix an issue for me :( (reply to 42505)

⚡️ Ἑρμῆς (Hermes): Ok, I am testing another issue in tact rn) Will to it later (reply to 42556)

Viacheslav: any link so far?) (reply to 42549)

Viacheslav: no code 🙁 https://docs.pixelswap.io/technology/open-source

— 2024-10-15 —

Laisky: you may need SendPayGasSeparately (reply to 42553)

Prateek: let currentShares: Int? = self.userShares.get(key);          if (currentShares == null) {             self.userShares.set(key, sharesBought);          } else {             self.userShares.set(key, currentShares + sharesBought);          }  Invalid type "Int?" for binary operator "+" i am getting this error

Prateek: can anybody tell me what is wrong

dotfx: Use a double !! after your variable as it could be a null instead of an Int (because you marked it as optative) currentShares!! + sharesBought

dotfx: This way you're forcing it to be interpreted as an Int datatype

Prateek: let currentShares: Int? = self.userShares.get(key);          if (currentShares == null) {             self.userShares.set(key, sharesBought);          } else {             let current: Int = self.userShares.get(key)!!;             self.userShares.set(key, current + sharesBought);          } this worked

Prateek: i tried this also but it was still giving the same error (reply to 42584)

dotfx: Then redefine a new var in your else block:  let currentSharesAsInt: Int = self.userShares.get(key)!!;  and use currentSharesAsInt + sharesBought

Prateek: thanks

Prateek: is there anything in tact that resembles events in solidity

dotfx: emit, works the same way

dotfx: But offchain processing will be different

Prateek: like? (reply to 42592)

Prateek: what is the difference

dotfx: unlike on evm, event logs are not splitted from the output response, so you will have to parse all the output op codes of the tx to get your event trace Destination address is also null

Prateek: okk

Никита: Hello, im working on swapping jettons by smart-contract. So smart-contract receive TokenNotification with sender Address. Can i somehow validate ctx.sender of this message (knowing JettonMaster Address) - is it JettonWalletAddress of declared JettonMaster Address?

Bbb: Which API is more suitable for smart contracts on your network?    Do you know a site that you can introduce similar to Truffle on Ethereum?

Laisky: contractAddress(initOf YOUR_WALLET_CONTRACT(master_addr, msg.sender)) == sender() (reply to 42599)

Georgiy: Blueprint automatically generates wrappers to interact with the contract (reply to 42602)

Никита: So i should include code of my Wallet_contract  Is there any ways to handle it only with Address of JettonMasterContract? (reply to 42604)

⚡️ Ἑρμῆς (Hermes): So after 3 days of suffering I found an error, I was trying to call this function fun calculateJettonWalletAddress(ownerAddress: Address, jettonMasterAddress: Address): Address {     // let initData = JettonWalletData{ownerAddress, jettonMasterAddress};     // return contractAddress(StateInit{code: jettonWalletCode, data: initData.toCell()});     return contractAddress(initOf ExampleJettonWallet(ownerAddress, jettonMasterAddress)); }   which was NEXT to my contract,not inside it, and that is the reason I got exitCode 135, moving to single line call  -  it worked (reply to 42308)

Mikael: How to calculate how much ton send to contract in order to maintain it (due to TON requires money on contract for storage)?

Prateek: hey can u guys tell me how to send some balance or ton coins when deploying the smart contract

Xingwang: how to get test net toncoin?

Никита: So im trying to receive TransefNotification on my smart-contract (after sending tokens to this smart)  message(0x7362d09c) JettonTransferNotification {         queryId: Int as uint64;         amount: Int as coins;         sender: Address;         forward_payload: Slice as remaining;     }      receive(msg: JettonTransferNotification) {         let ctx: Context = context(); // Check sender         self.jettonABalance = self.jettonABalance + 5; }  But nothing happens, can some1 explain?

Prateek: import { toNano } from '@ton/core'; import { BetsParentContract } from '../wrappers/BetsParentContract'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const betsParentContract = provider.open(await BetsParentContract.fromInit());      await betsParentContract.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );      await provider.waitForDeploy(betsParentContract.address);     // run methods on betsParentContract }   IN THIS deployment script how to initialise the contract with some initial funds

⚡️ Ἑρμῆς (Hermes): In order to receive notification you must provide forward_ton_amount (I guess forward fee here). I think (reply to 42613)

Никита: Ur getting it "by default" = 1 when sending tokens via tonkeeper on testnet

Bahaa: any good course video tutorials?

mgnfy_view: Do you have a code snippet? User sends a message to create another contract and store 1 ton in the parent contract (reply to 42577)

blocksdev: well the excess amount is transferred back to the sender, so after deploy-transaction you can try sending one more transaction with some ton (reply to 42614)

Bahaa: Any video tutorials course ? For evm people experience?

Santosh: Hi All, i'm trying to create native binding so i can use fixed248::exp function from mathlib.fc in tact. But i am getting error file not found /build/SampleContract/stdlib.fc  #include "stdlib.fc"; Both mathlib.fc and stdlib.fc are in the same directory  This is my tact code  import "@stdlib/ownable"; import "@stdlib/deploy"; import "./imports/mathlib.fc";  @name(fixed248::exp) native exp(x: Int): Int;   Can someone help me with importing mathlib.fc library

⁭: any good practice selecting randomly between addresses? for example select random from addresses of holders and so on  how to get map length btw?

Anton: It’s a known issue. A workaround is to import everything from one .fc file. You can extract the code you need (reply to 42685)

Anton: Maps don’t store their lengths directly. You can either do foreach and compute your map’s length or define your own map struct that stores length alongside and some associated operations (reply to 42689)

Viacheslav: what would be a better way to implement a kind of whitelist logic with multiple Addresses? e.g. multiple admins for a single contract

⁭: In examples I see counter variable was used (reply to 42692)

— 2024-10-16 —

Laisky: In TON, there is no distinct deploy operation; only messages. When you send a message to an address that includes code and data, the contract is deployed at the same time as it's called. You can include any amount of TON coins in the message. (reply to 42609)

Laisky: That's a great question! I realized that I made an error earlier: the TransferNotification should be sent to the newOwner, not to the responseDestination. As a result, I have modified the Staking process, and it is no longer necessary to pre-deploy the staking wallet contract.  https://github.com/Laisky/tact-utils/tree/main/contracts/staking (reply to 42316)

Almatbek: Does anyone have a sample of staking or investment contract on Ton using Tact? I am looking for a senior developer to do it

JustFilmk: so tell me how can i link my website with hexastudioz.ton (reply to 41011)

Deedee: hello, i need find website interact contract ton like eth95

Laisky: I have a very basic template; maybe you could take a look at it.  https://github.com/Laisky/tact-utils/tree/main/contracts/staking (reply to 42705)

Illia: Hi, I'm trying to create a new Tact project via Bun. I'm using the command on the home page of the documentation. Unfortunately, I'm getting the error below.  My Bun version is 1.30  `Error: Command failed: bun x blueprint create SimpleCounter --type tact-counter     at checkExecSyncError (node:child_process:890:11)     at execSync (node:child_process:962:15)     at main (/tmp/bunx-1000-create-ton@latest/node_modules/create-ton/dist/cli.js:133:34) {   status: 1,   signal: null,   output: [ null, null, null ],   pid: 10769,   stdout: null,   stderr: null }`

Georgiy: It seems like a blueprint issue (reply to 42730)

Illia: TypeError: paramSet.isSubsetOf is not a function (reply to 42731)

Illia: shall I just use Node + pnpm then? (reply to 42731)

Александр: Use node 22 (reply to 42732)

Georgiy: Update to node 22+ (reply to 42732)

Illia: cheers guys

Illia: haven't coded contracts in Tact for the last 3 month; the progress is incredible

Illia: rep to the Tact team!

Prateek: hey guys can i return multiple types in tact getter functions??

Anton: yep, but you need to define a struct to do that (reply to 42740)

P: yeah, return value type can be struct. (reply to 42740)

Prateek: ok

Prateek: {                                                                                                                                                                         '$$type': 'BetDetails',       totalPool: 300n,       options: Dictionary {         _key: {           bits: 257,           serialize: [Function: serialize],           parse: [Function: parse]         },         _value: { serialize: [Function: serialize], parse: [Function: parse] },         _map: Map(2) { 'b:0' => [Object], 'b:1' => [Object] }       }     } how can i parse this response from on the frontend??

Laisky: There will be a function called loadBetDetails in your build folder. like this one https://github.com/Laisky/tact-utils/blob/main/scripts/jetton.ts#L6 (reply to 42748)

— 2024-10-17 —

PtcBink: It’s a known issue. A workaround is to import everything from one .fc file. You can extract the code you need (reply to 42685)

Prateek: slice.loadBit is not a function 1:46 @ton_core.js?v=83dfbf5c:1490 Uncaught (in promise) TypeError: slice.loadBit is not a function this is the error showing up when i use this: const data = await betsContract.getGetBetDetails();     const balance = loadBetDetails(data.content.slice()); (reply to 42750)

Winder: Is there a way to fork mainnet in blueprint? thanks

Illia: do you want to open a smart contract deployed to the mainnet during your unit-tests? (reply to 42777)

Winder: yes (reply to 42778)

Illia: https://github.com/ton-org/sandbox/tree/main/examples/remote-storage (reply to 42779)

Almatbek: yes, I have experienced with it (reply to 42777)

Illia: have a look at the link above; hope it helps (reply to 42779)

Almatbek: What's the problem?

Winder: thanks , will check it out (reply to 42780)

Illia: 🤗 (reply to 42784)

Illia: I found quite a nasty bug.   I store owner: Address; Then I check if the sender is the owner. These two codes compile successfully. But, the code where I mistakenly 'call' owner as a function (although it's not) causes a bug at the runtime. There's no compilation error or a warning.

Anton: A bug report on GitHub would be highly appreciated 🙏 (reply to 42786)

Prateek: hey can u guys tell me how to send ton coins to the smart contract

Prateek: ?

Prateek: or do i have to make a function in my smart contract to do  so

Иван: Support for exotic cells is craved af (reply to 42760)

Georgiy: https://docs.tact-lang.org/book/send/ (reply to 42789)

Illia: Do wallets like Tonkeeper already support them? (reply to 42792)

⁭: When nft?

Артур: Hello! Could anybody tell me why building this contract fails with this message:  Error: contracts\bank_account_contract.tact:5:1: Type "BankAccountContract" already exists Line 5, col 1:   4 | > 5 | contract BankAccountContract with Deployable {       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   6 |     id: Int as uint16;  import "@stdlib/deploy"; import "./messages"; import "./bank_cell_contract";  contract BankAccountContract with Deployable {     id: Int as uint16;      init(msg: DeployBankAccount) {         self.id = msg.id;     } }  I did not define contract BankAccountContract anywhere else in the code. Is this name reserved or smth?

Артур: other contracts building with no errors (even those that deploy BankAccountContract) (reply to 42834)

Tiqan: Do you import BankAccountContract in  messages or bank_cell_contract ? (reply to 42835)

Артур: yes :( (reply to 42836)

Артур: oh its circular import...

Tiqan: Thats a circular import

Tiqan: es (reply to 42838)

Tiqan: *yes

Артур: got it.. thank you! (reply to 42839)

Tiqan: You are Welcome ❤️

— 2024-10-18 —

Loda: Hi, is there an API available to check if a user has claimed the Normie Badge?

Holst 🧙🏻‍♂️: Hello everyone! My name is Sergey, and I’m with the DeFi Canvas project. We participated in the TON Bootcamp from October 11-13, and now we are #lookingfor reinforcements.  We are preparing a DeFi product for TON Hackers, aiming to release an MVP by the end of November. Currently, we are looking for:  - Frontend Developer: Experienced in TWA, React, and API integrations. Knowledge of TON is a plus. FunC/Tact Developer: Knowledge of TWA, swap functions, and liquidity interactions.  We already have a concept, mockups, a testnet solution, and a working backend. Now, we are finalizing the scope, prioritizing features, and distributing tasks. As a startup, we are budget-conscious and primarily focused on earning rewards from TON Hackers winter. However, we have a small budget to cover operational expenses for the next month.  If you're interested or know someone who might be, feel free to DM me for more details. Thanks, everyone! :)  P.S. Most of our team members are ru-speaking

ATH: EQD264kOuQVWEbcgE7yo46_wiXmD55-9G7Wa_x46sDxlGRoq. How can I get list of addresses holding this SBT?

Prateek: hey guys how can i implement the events in tact smart contract that i can listen to in my backend as with solidity i used webhooks to listen to events from solidity in my backend

Jb: Hello guys is there any limitation on computation size or memory in the execution of a function? I am running an iteration and dumping the value of the iterator and breaks early. I tried sending more gas but it ends in the same point . Running through a get reaches further but it cuts due to gas limitations. And putting inside the receive breaks in that point,  and adding more dumps, makes it break even earlier. Also testing that piece of code alone works fine. The problem is when adding it inside of a bigger func.

Guy: Hello everyone, I want to create a contract that receives and sends USDT. Ran into this wonderful guide: https://docs.tact-lang.org/cookbook/jettons/#accepting-jetton-transfer and I havec2 questions 1. Can someone please explain what exactly is the 'jettonWalletCode' I need to pass as a parameter? Is there an example? 2. Is there an example for a unit test for such a contract? How can I test these functions locally before moving to testnet?

— 2024-10-19 —

Almatbek: you can send ton coins by a message TON is based btw contracts is done by send and receive messages (reply to 42789)

Prateek: hey guys can u guide me on how to connect my contract on my node js backend

Prateek: is there a documentation ?

Dan: hey guys. Maybe somebody received the same error while compiling any contract:  Build script running, compiling MyContract ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function

Georgiy: Update to Node.js 22+ (reply to 42914)

Mirheydar: Hi, is there a standard jetton contract by TON in TACT?

Dan: thanks a lot 💪 (reply to 42915)

0xST: Hi, anyone facing 'Choose Tact source file (.tact).' in .func file after import in tact file ? when i import  func file inside tact file, the func file would get 'Choose Tact Source file (.tact)' error . if remove the import from tact file, func file would not have this error anymore.

0xST: thanks for the reply. But my func file do not have any imports, still getting this error. Is there any config i need to update ? (reply to 42919)

Tane: Can anyone help me setup the architecture for a jetton? I want some custom logic in there. Also got some general questions on how TON contracts work. Would prefer to do a call if possible. I could do it in solidity but I'd like it to be on TON

Nikita: Hi everyone! I wondering what is _system in wrapper generated by blueprint? It is used for creating state init data, but I don't understand what is it and why it's needed. Perhaps someone knows where I can read about it?

Illia: Hello there,  Trying to get the same cell hash when generating one with @ton/core and the other one with Cell.hash() Tact's in-built function.  That's my received in Tact.  It dumps number 9418...1544  I'm generating a hash using '.hash()' on a Cell object  But I don't get the same number as the one which is dumped.

Illia: I've just written another code for generating hashes in Python with pytoniq_core and I got the same integer representation of the hash.   It seems like not a Tact's problem so this question is not relevant to this chat, but, if someone has a solution, it will be greatly appreciated.

Bahaa: Any good course video ready ???🛑🛑

Nikita: Okay, based on func generated code this value is something named "context". I don't see how this value is used in func generated code, but it's stored in persistent state in all cases. Who knows why? (reply to 42929)

Illia: For people who might have the same issue...  // Function to convert a 256-bit (32 bytes) Buffer to BigInt (big-endian)   function bufferToBigInt256(buffer: Buffer) {     let bigIntValue = BigInt(0);      for (const byte of buffer) {       bigIntValue = (bigIntValue << BigInt(8)) + BigInt(byte);     }      return bigIntValue;   } (reply to 42935)

Bashirat: Thanks (reply to 41042)

— 2024-10-20 —

Georgiy: I don't think so. You can find two long videos introducing Tact by Anton on YouTube. These contain code walkthroughs, so they might be enough. (reply to 42936)

Georgiy: Is it the FunC code generated from Tact? Could you provide the source code of this function and its use? (reply to 42960)

Jiego: would be better to deploy something like a debt-keeper for each individual debt the user creates. think about sharding (reply to 42256)

Laisky: there are a lot of client SDKs (reply to 42969)

Max: The problem is not really in storing balances, but in the ability to liquidate loans when the price changes, given that our parent contract determines the price of the asset. So, when the parent (a uniswap v2-like pool) contract understands that the price reaches a certain point, it may want to liquidate some loans.   The only way I see is offchain tracking with incentives for liquidators (reply to 42970)

Jiego: Absolutely, you would need off chain code to check on prices, check positions and liquidate (reply to 42972)

Max: Right, so that was my question, can it theoretically work fully on chain. We can probably use maps and store a limited number of loans/borrowers (reply to 42973)

Jiego: Something needs to trigger the liquidation. Either the user checking their position or a bot taking a look every few seconds or something like that. Onchain code cannot be triggered by itself (reply to 42974)

Max: When a user executes trade (buy/sell), so the price changes (reply to 42975)

Jiego: so you have a dex on your own? (reply to 42976)

Max: Yes (reply to 42977)

Jiego: ah cool, then is cool, you can check it on each buy/sell. But if the user doesnt sell, how are they gonna be liquidated? (reply to 42978)

Max: Then why would they get liquidated? If they don’t sell, the price doesn’t change :) (reply to 42979)

Jiego: then whats the point of the loan? (reply to 42980)

@just_d.fanciey: I don't know (reply to 42981)

Max: Leverage (reply to 42981)

