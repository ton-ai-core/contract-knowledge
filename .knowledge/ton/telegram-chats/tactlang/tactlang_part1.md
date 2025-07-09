# TON Tact Language Chat (ID: 1795643586, Type: public_supergroup)

— 2022-06-03 —

Andrey: i found easter egg group

Oleg: welcome to the easter egg group

— 2022-06-04 —

Vudi: 🤔 tacto tact

Егор: It will be interesting

— 2022-06-05 —

Undefined: Есть те кто уже развернул первый контракт ?

K⁧: я установить даже не смог https://gist.github.com/klim0v/327644383ffb28ec321e527a12fd35d6 подскажите что за ошибка, как исправить, макос м1

User<5305381596>: Как временное решение, dune build bin должно подойти

User<5305381596>: Скоро поправим инструкции

User<5305381596>: инструкции поправлены, @klim0v, я сейчас свежие инструкции с нуля прогонял

User<5305381596>: просто одна команда поменялась:   opam switch create $(pwd) --with-test -y   вместо   opam switch create $(pwd) -y

User<5305381596>: Мой косяк 😀 если не сработает, тогда готов копнуть глубже и разобраться. Но я думаю что причина там была.

Dmytro: @oleganza Эта группа на всех языках?

Andrey: непотрібно

Oleg: Да (reply to 43)

Oleg: Потом разберемся

Undefined: Отличный вариант высокоуровневой обертки вы придумали 🔥 порадовало 😀 (reply to 42)

Undefined: @cmxog есть пример того как это все использовать с ton-cli и т.д?

Dmytro: В плане как деплоить контракт на такте в тон? (reply to 48)

Undefined: В целом весь процесс (reply to 49)

Dmytro: Я бы пока не стал использовать tact напрямую с ton-cli/etc. Компилятор сейчас не готов генерировать код (он на половине кейсов попросту сломается), так что если необходимо, то лучше вручную перепроверять что компилятор выдает и вручную вставлять в свои фансишные файлы и дальше по пайплайну от фанси. Как только компилятор будет готов для использования с ton, мы сообщим. (reply to 50)

Undefined: Насколько я понимаю, делаем все в локальном blockchain только 1 но например как в real-time тестировать это все

Undefined: ? (reply to 51)

Dmytro: Не совсем понимаю, что Вас интересует. Можете сформулировать вопрос еще раз? (reply to 53)

Undefined: Как в реальном времени тестировать работу контракта написанную на tact? (reply to 54)

Dmytro: Это хороший вопрос. Давайте сразу проясню момент: Такт компилируется по итогу в байткод TVM - виртуальную машину TON Blockchain, то есть по итогу в любом случае можно будет поднять ton blockchain локально, и запустить необходимый пайплайн для тестирования с разворачиваем нескольких конктрактов (написанных на Tact/FunC/Fift, это неважно) и их взаимодействием, но это будет далеко не простая задача. Поэтому прорабатывается возможный тулинг для тестирования контрактов и межконтрактного взаимодействия (будет ли он только для tact-контрактов, и будет ли вообще = вопрос открытый). (reply to 55)

K⁧: спасибо, помогло! (reply to 41)

K⁧: плагинов пока ни каких нет для идешек?

Andrey: Скоро будет (reply to 61)

Andrey: Постараюсь на следующей неделе выкатить для intellij-ton

K⁧: попробую пока по аналогии с конкурсом для func задачи поделать) (reply to 36)

Undefined: vscode - было бы не плохо (reply to 63)

Undefined: Будет плагин ? (reply to 66)

Andrey: Я занимаюсь поддержкой плагина только для intellij

K⁧: opam init opam switch create $(pwd) --with-test -y eval $(opam env) dune build && dune install  после выполнения этих команд, у меня tact становится доступен для вызова из любой дирректории, если открыть новый терминал то опять не находит. так и должно быть или стоит добавить ~/tact/_opam/bin/tact в PATH?

Undefined: Актуально (reply to 70)

Dmytro: Да, так и должно быть. eval $(opam env) просто добавляет в env variables для текущей сессии пути к dune/opam и для tact. Если вам нужен tact компилятор, то либо добавляйте самостоятельно tact в PATH, либо переносите в удобное для вас место. (reply to 70)

K⁧: а как называется функция обратная serializer?

Dmytro: такой пока не существует (reply to 75)

K⁧: существует только то что есть в документации? там где TBD, там реализации нет уже? или только в документации не дописано?

Dmytro: пока все несколько хаотично. часть описанного в документации не существует в компиляторе, и наоборот. (reply to 77)

K⁧: если есть возможность информируйте о том что реализованно и можно потестировать уже, сюда 🙏

K⁧: как вообще на данном этапе можно помочь вам с тестированием или еще с чем либо?

Dmytro: Следует прояснить один момент, который видимо неясен. Такт - это проект ближайшего будущего, в настоящий момент он находится на стадии проектирования и ресерча. Текущая презентация - скорее декларирование намерений, который мы изучаем и планируем воплотить. К концу июня планирую доделать core-часть фичей, и таким образом (опять же, по исключительно моим прогнозам) к лету возможна первая официальная версия компилятора. (reply to 77)

Dmytro: Все зависит от того насколько сильно вы заинтересованы в этом. Если вы хотите тестировать то что мы будем производить и давать оценку - то все релизы будут происходить публично. Если вы заинтересованы в более глубоком анализе еще на этапе проектирования - свяжитесь с @oleganza и договоритесь о возможном участии. (reply to 80)

— 2022-06-06 —

Dmytro: You are welcome

— 2022-06-08 —

Kiba: Это уже можно использовать в продакшене или пока еще нет? (reply to 78)

RocketMan: вроде в дев чате писали что до продакшена несколько месяцев (reply to 94)

Dmytro: Пока проект на стадии ресерча. По моим _прогнозам_ к концу лета мы можем предоставить первую версию, однако с уверенностью не могу заявлять, поскольку многие концепции разрабатываемые нами достаточно новы. (reply to 94)

— 2022-06-12 —

🔳 ivan: @p0lunin где учат OCaml?

Dmytro: Формула такая же как и для других языков: фичи учить по официальным гайдам, экосистему и тулинг от других разработчиков. Гайды:  https://cs3110.github.io/textbook/chapters/preface/about.html https://ocaml.org/docs/up-and-running https://v2.ocaml.org/releases/4.14/htmlman/index.html (reply to 101)

— 2022-06-21 —

Vudi: Нападение Tegro )

Andrey: TegroDDoS

— 2022-07-02 —

Vasilii: When will the release be?

Vasilii: Or is that what is on the github now, is that all?

Dmytro: We plan to release the proof-of-concept complier in August. Also, we will publish a progress update of the June this Monday. (reply to 132)

Seymour: Вы разве не оба русскоговорящие?

🔳 ivan: this is international blockchain (reply to 135)

Seymour: Thank you for the explanation, I am sorry

Dmytro: There are also people in this chat who do not speak Russian, so it is advisable to communicate in English. (reply to 135)

Seymour: Got you, sir

🔳 ivan: @mnill и ты, брут.

Denis: Et tu, Brute.  It's international blockchain.

Michael: 🤣

— 2022-07-04 —

User<5305381596>: Hey there!   It’s July already, so we have decided to keep you updated following the initial announcement. Here is a brief overview of what happened since the announcement and a peek at what’s coming: https://github.com/tact-lang/tact/wiki/July-2022-Update  We will continue doing regular updates to socialize our progress and collect feedback. Let us know if you have any thoughts or questions!

User<1840958475>: Такт уже научили компилится в Fift-ASM для TVM?

User<1840958475>: Aga konechno (reply to 136)

Denis: No. Only to func (reply to 168)

kalloc: FunC, not func

Andrey: Speedrun for ban in 3...2...1... (reply to 166)

kalloc: Why? (reply to 172)

kalloc: What is the reason ?

User<1840958475>: Is Tact already in release status or is it beta testing? (reply to 170)

Narek: Its pre-alpha i guess (reply to 175)

Andrey: it's local meme, don't take it seriously :) (reply to 173)

User<1840958475>: I am blocked in almost all TON chats 😬 This is TON policy 🤷‍♂️ (reply to 174)

Aimin: Все русские, говорят на английском

kalloc: :D so popular

Andrey: https://t.me/tactlang/138 (reply to 180)

Dmytro: Tact is currently in development stage. (reply to 175)

Denis: Is TON already in release status or still testnet2? (reply to 175)

Dmytro: Just do not spam, and you won't get banned here. (reply to 179)

User<1840958475>: Why did the language developers choose to implement Tact -> FunC compiler? It's just awful... (reply to 183)

Andrey: Read this: https://github.com/tact-lang/tact/wiki/July-2022-Update (reply to 186)

User<1840958475>: Ok (reply to 187)

User<1840958475>: It is safer to develop with raw TVM bytecode 😃

User<5305381596>: Specifically, this https://github.com/tact-lang/tact/wiki/July-2022-Update#tvm-backend (reply to 188)

User<1840958475>: 🤔

— 2022-07-09 —

p: 👋 (reply to 206)

— 2022-07-13 —

aupiff: when do you think a practical compiler will be available? a year from now? (reply to 134)

aupiff: Who is developing the tact language and how are they funded?

Oleg: Hi, hopefully by the end of this year we'll have some useful tooling. The weight is mostly on the R side of R&D. (reply to 210)

Oleg: Core team are @cmxog & @p0lunin, plus me as an advisor, plus occasional design/UI devs who join for specific tasks. The development is funded by a grant from the TON Foundation. (reply to 211)

aupiff: awesome is the grant public info? (reply to 213)

aupiff: I mean the size & duration of the grant? How well-funded is the foundation?

Dmytro: We have plans that include not only the language, but also many useful tools for developing smart contracts. Tact and the compiler are of course our main goal, but we'll research some other concepts as well. By the end of the year, we will have at least a practical compiler and one another useful tool, which we are research right now. (reply to 210)

Oleg: donations are always welcome, if you'd like to participate 😉 (reply to 216)

— 2022-07-22 —

K⁧: что за ошибка? ни чего не происходит, после нажатия Entr такое выдает  ➜  tact1project tact a.tact #  Fatal error: exception File "lib/compiler.ml", line 63, characters 19-25: Assertion failed Raised at Tact__Compiler.succeed in file "lib/compiler.ml", line 63, characters 19-31 Called from Tact__Compiler.eval_stmt in file "lib/compiler.ml", line 137, characters 6-35 Called from Dune__exe__Main.repl in file "bin/main.ml", line 31, characters 8-78 Called from Dune__exe__Main in file "bin/main.ml", line 62, characters 2-9

K⁧: собрал из мастера, + пришлось еще зависимости поправить https://github.com/tact-lang/tact/pull/82

— 2022-07-23 —

Dmytro: В мастере версия которая вызывает repl вместо компилятора.  Поправлю, отпишу. (reply to 229)

Dmytro: 1. Problem with compiler fixed. You can now call "tact file.tact" and compiler will compile file to the FunC output. 2. I'll check problems with dependencies next week. (reply to 229)

K⁧: отлично, помогло, благодарю! (reply to 231)

— 2022-07-26 —

Oleg: @cryshado my mistake! We dont have a russian-speaking public channel

Oleg: The link i posted was to a low-traffic internal consulting group

— 2022-08-02 —

User<5305381596>: Hey guys, here’s a quick update on what we’ve been working on in the past few weeks https://github.com/tact-lang/tact/wiki/August-2022-Update  Please let us know if you have any questions or comments; any constructive feedback is welcome!

— 2022-08-22 —

Anton: Можете подсказать hello-world на tact какой нить простой и полностью описанный Или OS проект на нем написанный

— 2022-08-23 —

User<5305381596>: As Tact is still in early development, there's not a whole lot available. In the meantime, please feel free to check this out https://github.com/tact-lang/tact/blob/main/examples/wallet_v3.tact  And we are always available to answer any and all questions! (reply to 255)

— 2022-08-24 —

Anton: Thx

— 2022-09-01 —

davide: hi! can tact used for code a jetton?

User<5305381596>: Once it is ready for production use, it could be. At this moment, it's possible to write contracts in it (see Wallet example in the repo) for exploration. Caution should be exercised if you want to try developing a production-grade contract.  Please also be aware that the language will continue evolving to address needs of TON developers most effectively.

— 2022-09-05 —

Andrey: 👋, I saw new wallet_v3 example written on Tact, kinda awesome. Is it ready for deploy? I want to add tact support in toncli

Tigr: Are there any guides on Tact out there?

Tigr: In the same format as with FunC

Tigr: By Disintar

Dmytro: Tact is not ready for the production yet. Use it at your own risk. (reply to 272)

Dario: How does it work for deployment? (reply to 276)

Dmytro: Currently, our focus is on developing and researching. When Tact will be ready for release, we will also release documentation and guide. (reply to 273)

Dmitriy: А сейчас то можно чего-то изучать?) (reply to 278)

Vlad: Speaking of time frames, are there any approximate dates? (reply to 278)

Tigr: Okay (reply to 278)

Dmytro: Current version of compiler can produce smartcontract code to the FunC, and then you can deploy it as if you want to deploy FunC code. (reply to 277)

Dmytro: Currently, there are no up-to-date documentation or specification, but we work in this direction, and if nothing is happened, I guess we will release something for reading in the next 1-1.5 monthes. (reply to 279)

Oleg: Hey everyone, a short status update on Tact.  Tact as an improved FunC  Today Tact is a working language that compiles to FunC and offers a number of features that help writing TON contracts with considerably less boilerplate. Big kudos to @cmxog and @p0lunin for pulling this off and getting us to that point.  Tact compiler supports some basic features: control flow and operators, and adds to FunC with nice definitions for structs and enums, automatic de/serialization to/from cells and offers a working model for generic types that lets implementing safe APIs such as checking signed message and extracting its body in one call.  You can check out how Wallet V3 code looks like in Tact right now:  https://github.com/tact-lang/tact/blob/main/examples/wallet_v3.tact  At this stage Tact still has some oddities and boilerplate that is easy to fix within the current model: e.g. adding mutable slices will let us cleanup annoying "trailing" slices, and we can bake in the serialization compatible with TL-B to remove unnecessary "derive impl (De)serialize" calls. But these are just small polishing tasks that we will put aside for a minute and look at the bigger picture.  The road ahead: from “Rust” to “Swift”  Let's draw some parallels with popular systems programming languages: C, Rust and Swift.   FunC is, well, "fun C" :-), a thin abstraction over underlying machine with a much nicer syntax than an assembly language.   Current Tact is somewhat similar to Rust: it has a more expressive and safer type system, plus some syntactic affordances, yet delegating a lot of choices to the user and having some annoying internal details sticking out whether you need them or not.  What we want to achieve is a leap-frog language that focuses on the developer experience and makes writing most contracts significantly easier than FunC and the current Tact, thus making development on TON much more accessible to new enthusiasts who join the community today and in the future.   At the risk of making a bad analogy, I will refer to Swift: this is a language that tries to combine two opposites — being capable to express the finest details of the program with minimal overhead, while also being instantly friendly to newcomers and making basic programs look as simple as a scripting language.  Intermission  Before we go ahead improving tiny bits of the language that we've got, we are taking a brief pause to review our original goals and design a more concise and powerful syntax. And then improve the compiler towards that goal.  We want to add to the language:  1. Dedicated first-class syntax for message handlers and message interfaces. 2. No-boilerplate serialization compatible with TL-B. 3. Fully automated load/store for the contract state. 4. Gas/value requirements in the interfaces.  We will rewrite common contracts in hypothetical Tact 1.1 and then come back with a concrete roadmap on how we build towards that.

— 2022-09-06 —

Roman: 2. No-boilerplate serialization compatible with TL-B.  It's a good point. I risk looking a little foolish here. Is there any way we could have something like auto-generated abi later?   So we could parse methods and run them using UI in an external software like an online IDE for newcomers using Tact (like RemixIDE analog). (reply to 285)

Oleg: I think view/get methods are the ideal for UI integration because message formats are usually designed for compactness and you may need some "unpacking" to do in the get method to turn some bits into a readable number. And those get methods are for offchain execution anyway (reply to 287)

Oleg: We may also consider similarly offchain "action" methods that would map into SDK directly and perform client-side checks such as "read seqno from the contract state and use it in the message and sign".

Oleg: But that would require extension beyond TVM for sign operations, ignoring gas and making sure we don’t deploy that code to a blockchain. That's outside the current scope and brings along an unknown amount of complications. (reply to 289)

— 2022-10-16 —

🔳 ivan: @kok_kek_pek heres the group about the new TON language, which i told you about

— 2022-10-17 —

Riccardo: super interesting initiative and definitely very needed to reach a larger dev adoption

— 2022-10-25 —

davide: is there a roadmap?

— 2022-11-12 —

User<5113432313>: Roadmap: work, work and work (reply to 319)

— 2022-11-17 —

sepezho: hey👋

Oleg: Hi

— 2022-11-22 —

rudolfnn: 👋

rudolfnn: I found tact by searching for 'func for beginners'

Seitaro: You may find this interesting https://learnxinyminutes.com/docs/func/ Then i suggest to go to https://ton.org/docs/develop/smart-contracts (reply to 333)

rudolfnn: Thanks a lot (reply to 334)

— 2022-11-23 —

Steve: Hey, where are an updated sources? All i can see is something old, as i know it was dramatically upgraded lately

— 2022-11-27 —

rudolfnn: As a newcomer, how would you recommend to start learning Tact? Javascript or Rust, or both?

— 2022-12-05 —

kalloc: :/

— 2022-12-06 —

Howard: ＧＭ

Howard: awesome design!

User<5542046197>: struct Wallet {   Int32 seqno   Int256 pubkey   Int16 people }  Builder test() {   serialize(Wallet(0, 777)) }  Builder testBuilder() {   let b = Builder.new()   serialize(Wallet(0, 777), b) }  Builder testParameters() {   serialize(Wallet{pubkey: 777}) } (reply to 348)

— 2022-12-09 —

Howard: One question for struct Wallet, there has 3 input parameters.  But why serialize function only use 2 (reply to 349)

Howard: if I want to have similar design as Account Abstraction like EVM.   What is it should be in Tact or the Smart Contract on TVM. Like,   - Generate a specific code when people want to deposit into this wallet (leverage the feature of comment when sending money on TON network)  - Store each depositors' info (reply to 285)

Howard: https://github.com/toncenter/examples/blob/826094db6d181214260008d4ee782a53c498c108/deposits-multi-wallet.js#L82

Howard: But maybe in .js library level that can satisfy what I need

— 2022-12-12 —

Steve: Hello, Guys! I am actually started to work on reinstanting TACT compiler and bult it from scratch, i am currently ironing out some corner cases, waiting for FunC compiler fixes, but i was able to compile walet-v4-like contract that even works better (less gas usage) than native implementation.  I am doing it under my own repo: https://github.com/ex3ndr/tact-v2  Comments are greadly appreciated

Kirill: Great!

Kirill: Do you need any help with anything?

Kirill: Like tests / examples or docs?

Steve: i think it would be great to assemble basic documentation about what already implemented

Kirill: in your repo or in general? (reply to 358)

Steve: in general, i am open to move it to ton-community (for example)

Denis: https://github.com/ex3ndr/tact-v2/tree/main/src/examples can you also build jetton.tact.abi?

Steve: it is work in progress (reply to 361)

Steve: I haven't implemented multiple contracts connections right now

Denis: is this abi autogenerated?

Steve: yes

Steve: and ts-wrappers too

Kirill: After a brief chat with Steve, looks like priorities are:  1. Getting a website up 2. Improving docs 3. Addind examples  We need help on getting MVPs of those or creating Footsteps to provide the scope of work for the community to pick up on it

Kirill: @SwiftAdviser does assembling Footsteps for such tasks seem like something you can help with?

Denis: i don't see "wallet-4v-like" contract. only v3-like

Kirill: sounds like a good idea for a Footstep / Issue submission (reply to 369)

Steve: i have implemented only one feature (tx sending) (reply to 369)

Kirill: will you do the honors and create one? (reply to 369)

Steve: I think dicts are just int -> int, not sufficient for plugins

Kirill: @oleganza can I please get admin rights here

Seitaro: Is Jetton example functional or it is WIP for now?

Steve: WIP, i hope to make it work today or tomorrow

Denis: i think wallet v4 is more interesting task. converting hashmap to tuples... what can be more complicated task than jettons (reply to 373)

Steve: i removed tuples since they are slow

Denis: cool. so wallet v4 can't be implemented?

Steve: wat?

Steve: https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L186  This is bad code, better to return cell

Steve: since get methods could eat a lot of gas just like was in our nominators

Denis: I agree. But it's already expected by wallets (reply to 382)

Steve: i don't care about backward compatibility, there are no point in doing so anyway

Steve: my version of tact doesn't support externals for now at all since wallets are the only users of such messages and it is always a good idea to authenticate via address instead of key anyway

Roman: Sounds like a good example of how community could help on developing new language. I'll cover tasks with footsteps. (reply to 368)

Oleg: this looks great! I will find time this week and send my comments. (reply to 354)

Steve: I have updated jetton code: https://github.com/ex3ndr/tact-v2/blob/main/stdlib/jetton.tact https://github.com/ex3ndr/tact-v2/blob/main/src/examples/jetton.tact  I haven't implemented hacks from original contract and not notifications, but you can see an idea

kalloc: Is tact ready to use?

kalloc: 🧸

Denis: no

— 2022-12-13 —

Steve: I just moved my tact repo to ton-community

Steve: https://github.com/ton-community/tact

Steve: Added template project of tact-based contracts: https://github.com/ton-community/tact-template

Kiba: Could you please replace ton-contract-executor to @ton-community/tx-emulator? I think it much better. (reply to 398)

Steve: i think it is a part of ton-nodejs, i am using abstraction

Narek: Agree, tx-emulator is better for testing contracts, @steve_kite maybe you should switch to emulator? (reply to 399)

shahar: Do we plan to deprecate ton-contract-executor?

Steve: does tx-emulator execute via ton-contract-executor? In general this is not that important since my current implementation can do execution both on blockchain and locally (reply to 401)

Narek: I mean it’s important for template since you can cover much more test-cases with emulator (reply to 403)

Max: tx-emulator will also at one point have the ability to emulate all the consequences of a sent message in fact this functionality is already available (as an experiment) in the blockchain-experimental branch

Dario: so, we will be able to test chain of messages without doing it manually with different contracts? (reply to 406)

Max: yes

Dario: thats awesome

— 2022-12-15 —

Александр: Tact will be updated in the future? So far it looks like the project is dead

Oleg: Yes, we are working on rebooting it. (reply to 410)

Александр: Ok, do you have any timeline?

Steve: https://github.com/ton-community/tact https://github.com/ton-community/tact-template

Steve: there are still major issues, but is ok to play around

Hermès: Looks great. (reply to 413)

Hermès: Would like to help as well! (reply to 413)

Hermès: The code looks dope for me. (reply to 413)

Steve: I was able to implement first useful contract: distributed multisig https://github.com/ton-community/tact/blob/main/src/examples/multisig.tact

Hermès: any one has able to put syntax highlight? (reply to 413)

Steve: Just added self-reporting of it's abi by contract itself via ipfs link, added support for supported_intefaces TEP

Steve: For example, example treasure contract now reports that it provides ipfs abi, implements transferrable interface and ownable

Steve: just add this attribute to trait or contract and it will put into self-reporting interfaces list

Andrey: It's looks like annotations on jvm (reply to 428)

Steve: yep

— 2022-12-16 —

Howard: Hi @steve_kite , why this line of the code is the same no matter how I change the Tact file.   https://github.com/tactfunc/tact-template/blob/92e28b75ee70b070376d3ae978008b4dfca806a0/sources/output/sample_SampleTactContract.ts#L216 (reply to 413)

Steve: Idk works for me

Howard: then what is this line about? How you got this line of code. (reply to 433)

Steve: I don't understand what you are asking, this is an autogenerated file from tact source

Steve: Are there any chanses that you renamed contract file or created a new one or renamed cotnract name?

Roman: Regarding the tact documentation, I see it like this:  — Installation (done) — The most simple example of the language — Building contract process — Deploying contract process — List of examples in the repository as text links  + write materials in the "thinking in TON" paradigm:  It is very hard to write contracts for ton IF you are trying to use your experience from other blockchains. And it is quite easy once you got into distributed thinking  What I forgot to add to the first iteration of the tact documentation? Maybe, we should cover some necessary functions/methods? (reply to 358)

Steve: This is a decent summary, it could be expanded to teach about TON concepts during deeper and deeper tutorials

Steve: More like "thinking in TON" since a lot of people coming with solidity in mind and tact intentionally doesn't have much in common

Steve: It is very hard to write contracts for ton IF you are trying to use your experience from eth, but quite easy once you got into distributed thinking

Roman: thank you, it's a good point! I'll think about how to write it (reply to 442)

Kirill: It is very hard to write contracts for ton IF you are trying to use your experience from other blockchains. And it is quite easy once you got into distributed thinking (reply to 443)

Kirill: Like this (reply to 444)

Hermès: Same (reply to 434)

Steve: Is tonhub broken somehow?

— 2022-12-17 —

Howard: oh, ok. Because I try to change a bit on .tact file and adding more functions. But it didn't changed. (reply to 437)

Yakitori: gm - Have been following TON for a while, I was a bit reluctant to commit completely due to FunC laborious syntax, so Tact is a great step forward!

— 2022-12-18 —

Howard: yeh, let me try out. (reply to 438)

Howard: anyway to add the syntax highlight in VS? hard to read 🙈 (reply to 433)

Howard: tonHub Link for deploying   still got same error when scan the link we generated when deploying (reply to 438)

Howard: you can write mastering TON (reply to 441)

Dan: Yep, that is possible (reply to 453)

— 2022-12-20 —

talkol: Hi guys, we just see this group now. We were in a different group called “TACT Community” that was created by @rulon a while ago

talkol: Were not invited here, a bit of a shame

Seitaro: This group was pretty dead for two or three months, until @steve_kite started his own Tact implementation (reply to 468)

Steve: My initial impression of this new compiler was remarkable. I recently tested distributed betting contract. It was so easy to build comparing to nominator's pool that not even distributed. Ability to automatically extract ABI, build interfaces list, clean and a safe way to build contracts is remarkable comparing to func.   I don't see the reason to even try to continue to push func tools for general audience since it is just awful (and reason why we don't have much apps in ton still), compiler have some issues, but they are on par with func level.

Steve: I spent only 30 minutes to build this contract: https://github.com/ex3ndr/tonbet/blob/main/sources/contract.tact

Steve: I just don't like this part: https://github.com/ex3ndr/tonbet/blob/668b9a57d0b91f6e893f2c4b4e17d2265a7052ec/sources/contract.tact#L152  But unaware how to clearly without losing flexibility

Steve: and some quality of life improvements like constants, enums and may be unions, but it is not that interesting

talkol: We don't have anything against TACT, it's a good idea to improve the language, we just want to be involved :)

Steve: I think we urgently need to kill func as language for newcomers, it is very good low level one, but not much above.

shahar: Why compile to func btw and not directly to fift?

Steve: too much risk

Steve: Right now you can still review code that generated and check that everything is fine, fift is impossible to read

doni: fift is impossible

Steve: and i would need to build my own func in practice

shahar: Would generated func be easy to read for complex contracts?

Steve: compiler is quite straight forward

Seitaro: I also want to emphasize that solidity is also compiles to intermediate human-readable language Yul. So it has some sense.

Steve: Yeah, stack-based optimizer is much much easier to do on func level since there are limited types and everything is much lower level. On high level it is unreasonable to do since there are too much magic involved

Steve: like.. there are no concept of a stack at all in my code, rolling out this would be just reinventing func

Howard: that is helpful (reply to 471)

Howard: awesome @steve_kite, but I got issued when I get the initial deploy code like here (reply to 473)

Howard: then the problem will be: the browser can't read the URL long like this. I sent the testTON to through this URL, and it failled.

Steve: Yeah, i usually copy it to mac notes app and sync it to an iphone and then click a link

Steve: I think eventually i will finalize tonblack.com and give a simple way to perform transactions via any available wallet

Howard: lmao I tried to changed it to ton:// seems still can't work properly. But your suggestion is good. (reply to 493)

kalloc: hm do you have vim syntax for tact ?

kalloc: or tree-sitter ?

Steve: no, but looking for someone to contribute

Steve: very painful right now

kalloc: i can port vscode syntax to tree-sitter

kalloc: ouch, don't you have vscode extension?

Steve: no

Howard: Correct we if I am wrong: You can still deploy the code even the smart contract having the bug, right?

Howard: because yarn deploy didn't check any functional for the Tact code itself.

Steve: you can write tests to test everything

Howard: Because I thought at least it should be get error message if code is not completed.   like Remix here.

Steve: deploy uses the one you built before

Steve: so you need first to build it, yarn build, and then deploy

Steve: it is done this way to be able to commit changes and always new what you are going to deploy

Howard: oh, understood

Steve: HOPEFULLY ledger would be tomorrow

Vitaly: Is there like a post or something to explain what's the current status of tact?  I gather it's functional on some level but everything is a bit confusing (reply to 513)

Steve: It is working, but uses experimental standards that are not yet to be finalized. I would recommend to use it if you are not planning to launch something VERY big in a month.

Steve: There are no docs, though, only examples.

Howard: you sure it works? haha (reply to 493)

Steve: try to wrap init in this function function toUrlSafe(src: string) {     while (src.indexOf('/') >= 0) {         src = src.replace('/', '_');     }     while (src.indexOf('+') >= 0) {         src = src.replace('+', '-');     }     while (src.indexOf('=') >= 0) {         src = src.replace('=', '');     }     return src; }

Steve: i think my template doesn't use base64 in url-safe mode

Howard: what is the test-net ID on workchain parameter?

Steve: Ton have multiple chains, you should use only 0 one

— 2022-12-21 —

doni: great news ! (reply to 513)

doni: is there a jetton implementation in tact yet ?

Howard: so the`message` in .tact is more like Event in solidity, right?

Howard: is a way that help us can track on-chain data for the smart contract behavior

Oleg: no, the messages in Tact are the TON messages: things that contracts (actors) communicate with (reply to 524)

Andrew: *replaceAll (reply to 518)

Steve: replaceAll not avaliable in all environments

Mr. John: value   .replace(/+/g, '-')   .replace(/\//g, '_')   .replace(/=/g, '')

Dan: а есть разница?

Mr. John: короче

Steve: Added more docs about TACT: https://github.com/ton-community/tact/blob/main/docs/overview.md

— 2022-12-22 —

Steve: Just released new version: https://github.com/ton-community/tact/releases/tag/v0.3.0  A lot of fixes and deep strings support!

Dan: Great! Strings look like a game changer 😅 (reply to 534)

Howard: I just deployed a contract on testnet! (It's so cool that I can deploy through TonKeeper, awesome experience!)  But I got this error that exit code 130 on explorer, is there any Explorer I can test the contract or interacting with it directly? https://testnet.tonscan.org/address/kQA54BekYjFpmVa4AMD6cB2Eu_GYD9KATiQgrxeMXmci_KPj

Howard: nice niec (reply to 534)

Howard: can you explain more on Context means in Tact? I can't find on document for this yet.   And seems this is a default syntax that we can use? Like address(this) in Solidity? (reply to 473)

Howard: For example, I am trying to build a Vault contract which can store every deposit record. Like the code below:  Since the receive method can't put like this firstly? 😅😅   *I am thinking the way like  emit UploadRecord(msg.sender, _amount, _code);  in Solidity.

Howard: ummm, need to know how to set ERROR code. Otherwise it's hard to know why the tx fallback.  https://testnet.tonscan.org/address/EQAzdTWkHL3eFDGDnJPMx8DngVwfRyWID76TYp8rknv24C5M

Steve: I am working on error codes, description is in Abi currently

Howard: oh?

Howard: maybe I asked with a misleading way.

Howard: What is the simpleReply means here in your TonBet contract?  https://github.com/ex3ndr/tonbet/blob/668b9a57d0b91f6e893f2c4b4e17d2265a7052ec/sources/contract.tact#L204   Can't properly find why 64 here, and use 128 in other place.

Steve: 64 sends all remaining value of an incoming message

Steve: 128 sends all remaining balance of a contract

Steve: There are no events in TON right now and they work different here (reply to 540)

Howard: oh I think I understand how message works.

Howard: Would love to try out Struct and and mapping right now in tact

Steve: Struct almost the same though

Howard: OK, then that was bad because I can't find out why the transaction failed even though I test it before. Maybe can adding the comment message in require like: require( valueA > valueB, "tx failed because valueB is bigger than valueA"); (reply to 549)

Steve: Yes I will generate error codes from error messages but explorer won’t show you the message, it is available only knowing abi and explorers doesn’t support it yet

Howard: I will say the customized message in TON is super cool.   More like I can specifically asked what Smart Contract should do. Compared with Solidity, this is more flexible to scale the usage of the functions, right?

Steve: Yes, they all also async

Howard: Oh, ok. Thanks! Would like to see more example codes from you!  With the usage of mapping and customized struct.  Thinking how fast or convenient it is in TON blockchain. If I want to store the data on-chain in TON. Let's say a dataset for a school, is it ok to store those data on-chain?  You know, in EVM it's so expensive to store the data like this on-chain.

Steve: Ton is scalable, you can store it yes but not in a single contract, but in many separate one

Steve: Just like multisig contract stores all pending transactions in separate contract

Steve: Or tonbet stores bet value in BetHolder

Un gars bien: would love to see them too 😵 still lost in FunC documentation on dicts (reply to 551)

Howard: Got an error here when set the Struct

Steve: Update the compiler

Howard: Seems I am struggling in using Struct in practice now

Steve: You need to construct it via {…}

shahar: is it up to the contract owner to upload and pin the abi-ipfs artifact?

Steve: yes

Steve: i will provide an opt-in (out?) service to upload abi

Steve: i personally want to have compiler completely offline i often work on planes👀

shahar: definitely. I think that publishing the proof is a different step

shahar: we have the https://tonverifier.live service that can handle that

shahar: the architecture is a bit different, where there’s a proof-contract for each code cell hash, and there’s a main sources registry that’s queried for the child contract addresses.

Steve: verify source?

Steve: i want to provide ipfs link to sources too, you would be able to scan contracts on the network and capture all sources and verify them automatically

shahar: yes, it allows different parties to register as verifiers that ensure that the provided source compiles to the same hash as onchain.

shahar: the proof-contracts provide the ipfs link to the sources (reply to 579)

Steve: Also it would be possible to perform re-verification in browser

shahar: also the proof contracts are upgradeable, so that you won’t need to redeploy them when upgrading from ipfs to ton-storage

Steve: actually i don't see the need for verifiers as it is since you can always recompile in browser itself

Steve: just simple web app that displays and verifies source on client

shahar: it minimizes the probabilty of a source being fake.  in the approach where the contract declares on the sources itself, there’s no other authority to verify that when publishing the ipfs link, which obviously can be forged.  so yes, the contracts can be re-verified, but would we want explorers displaying the source code and encouraging all users to re-verify all the time?  with verifiers, there’s a gatekeeper. that gatekeeper would need to be compromised in order to publish a fake proof.

shahar: so you get: - a good (though not perfect) level of trust, - pinning out of the box, - upgrade path to ton storage - some deduplication due to it relying on code cell hash instead of being per contract

Steve: 🚀 Minor release 0.4.0  https://github.com/ton-community/tact/releases/tag/v0.4.0

Howard: If you got this error said Module '"ton"' has no exported member 'readString'.ts  Remember to run yarn add ton (reply to 588)

Steve: update it to the latest version too

Howard: The expected type comes from property 'initialData' which is declared here on type '{ workchain: number; initialCode: Cell; initialData: Cell; }'   Have you got this error on the origin deploy scripts?

Steve: i usually enforce to a single version by adding this to package.json    "resolutions": {     "ton": "12.3.2"   },

Howard: Yes, I had. Because I am using the template. (reply to 592)

Howard: But there is no error since I just remove the import for 'readString' and 'StringToCell'. All good now. (reply to 589)

Howard: Understood. If I want to trigger the receive method with Name<>Address and Score<>Int as input, I need to encode these values as a code and combine them in the URL.   This will allow TonKeeper to send the correct information to the contract.   We cannot just put these informations in the comment area directly if we want to transfer the funds to other address let's say.

Howard: How you guys put the input String(the text want to send to smartContract) coded to type Cell or any else? (reply to 529)

Howard: like this line of code in test, I just want to trigged the receive method and passed the ValueA / ValueB through TonKeeper.   I have to encoded the input value in TypeScript first right?

Steve: it encodes everything for you, just pass string

Steve: and tonkeeper would encode it by itself

Howard: ummm then how I pass string like this receive(msg: Join2) in comment area?  It's "Join2, my-address, 10" ?

Steve: no, this is have to be encoded to cell and send just like during deploy

Steve: deploy in ton is the same as just sending a message

Howard: I see. I can find the encode modules in the output folder that inside the xxxx.ts (reply to 601)

Howard: just like here packAdd is the method which is executable from this smart contract.

Steve: yes, all types have this encodings inside of generated bindings

Andrey: @steve_kite where i can see grammar for new tact? I wanna implement support to intellij after NY

Steve: https://github.com/ton-community/tact/blob/main/src/grammar/grammar.ohm

Andrey: ty 🦝 (reply to 607)

Steve: I recommend not to use it as is since it is tailloared for compilation

Andrey: although the syntax is very similar to BNF for Intellij, I will still make edits to it to interact with the internal API, so don't worry. This is exactly what I need (reply to 609)

Andrey: I've been running my eyes quickly right now and the syntax is very cool, very kotlinish, just like I love it. Very good job, @steve_kite 😍

Steve: Thanks!

Andrey: I will definitely start picking the tact as soon as I finish my current tasks

Howard: 😵‍💫😵‍💫😵‍💫 (reply to 605)

Steve: Just finished Jetton implementation on TACT. Now create your own jetton contract very easy: https://github.com/ton-community/tact/blob/main/src/examples/jetton.tact  stdlib implementation details: https://github.com/ton-community/tact/blob/main/stdlib/libs/jetton/wallet.tact https://github.com/ton-community/tact/blob/main/stdlib/libs/jetton/master.tact https://github.com/ton-community/tact/blob/main/stdlib/libs/jetton/messages.tact  It would be useful if someone review this and check that this indeed works. Do we have tools to check jettons on testnet?

Steve: It turns if you rewrite jettons to TACT, standard would make sense

Seitaro: What a surprise! There are toncli tests for jettons in toncli main repo and I believe there ton-contract-executor tests there as well. Should be a good start (reply to 616)

— 2022-12-23 —

Howard: Just deploy to test net then send tx each by each? (reply to 615)

Howard: is it possible to import directly by putting these .tact in the same place? (reply to 615)

Howard: Try to compile but got this error, even tho I put these file in the same place.

Howard: just trying to understand the new type StateInit, is it a data type that you import from library "@stdlib/ownable"? Can't find in any place on tact-template.  I know it's a method that when you want to create a new contract, you will need initialized the code for it.   But where is this type word came from?

Howard: Same as the syntax here I got from TonBet files:  1) Why we need nativeReserve to keep more spaces for storage? And where is this words coming from?  2) Why SimpleSend function (in below) need to keep extract plus 2 with 128? Also because of TVM design that we need keep the extract space for storage?   🧐 Please bear with the questions I asked here. I am just intensively learning tact. (reply to 473)

Howard: Hi, I am playing with mapping now on Tact. The structure I set is quite simple as pic1, and pic2 shows the mapping data I got when I read from contract.  Question: How can I turn the address data in the mapping, turn back to the readable address format?

Howard: like in TypeScript library, we turn address to executor here. But how to reverse it back to 36bytes?

Howard: What is the default Bool value in Tact. I got failed with ExitCode 7....change a bit but still can't find the solution.  I am thinking that for the require statement, it is not correct. Because the if the address never store in the mapping, it will get Null.

Howard: Oh, yes. It's null. I found answer here:  https://github.com/ton-community/tact/blob/main/examples/increment.tact (reply to 634)

Vitaly: >https://github.com/ton-community/tact/blob/main/src/examples/jetton.tact seems to unavailable 404 (reply to 615)

Vitaly: ah

Vitaly: you have moved examples out of src as it seems

Howard: is there any time limitation I can add in Tact, like timestamp + 3 days in solidity.

Howard: How to implement the data into the struct I design in a map I have called myMap: map[Address]myStruct

Howard: MemberInfo is the struct I define in the first🙈😂

Howard: OK, I checked this repo and try to navigate the use case of assign the data into Struct. Will learn more in TON whitepaper and see who can share the example for Struct in storage 😵‍💫 (reply to 607)

Steve: TACT Compiler release v0.5.0 - Constants - Jettons example and library - require now accepts string as second parameter - Optional address is now serialized using native representation, not tact-one  https://github.com/ton-community/tact/releases/tag/v0.5.0 (forwarded from TON Development News)

Steve: btw, subscribe to this channel, it always meant to be a independent source of all dev tools news. if you have something to post, please share with me, let's improve this group

Steve: One of the nicest things is that TACT now generates ids for errors and require method now accepts a string and put mappings into ABI.

doni: I have a question regarding the jetton impl.   I see that its not the same interface ( opcodes are different bc of the hash256(“mint”) convention ) right ?

Steve: mint is not part of the standard i think

doni: I agree its not on TEP 74 ,  but its part of the source code https://github.com/ton-blockchain/token-contract/blob/main/ft/op-codes.fc

Steve: idk, op = 21 is a weird choise

doni: I agree =) not a crc of anything

doni: I tried to test it with tests and tools that already exsits

Steve: did it work?

doni: I will play with it

doni: well mint doesnt work

doni: i will by pass that

Steve: well, mint is not part so it is custom

Steve: if you want i think you can do the same message with such opcode

Steve: but tact right now requires to have at least one field so if it doesn't have fields it won't work

doni: Im trying to understand everything thorugh the source code … Im getting there step by step

doni: not sure why the double op for every action … I will understand eventually just started

doni: double op ( comment and Int)

Steve: what do you mean?

doni: ;; Text Receivers     if (op == 0) {         var text_op = slice_hash(in_msg);                  ;; Receive "Mint!" message         if (text_op == 0xcd0d986cb1a2f468ae7089f4fc3162c116e5f53fbd11a6839f52dbf5040830b2) { and     ;; Receive Mint message     if (op == 2737462367) {

Steve: it is a different messages

doni: one is binary for mint message   and the 2nd ?

Steve: second is for text message

doni: I understand  ok but its the same aciton diffrenet apis ,  binary messages  and comment based messages

Steve: yes

Steve: one requires some code, another could be used with any wallet right out of the box

Steve: also text could be confirmed on ledger

Steve: I actually thinking about expanding text parsing capabilities, it would be better for ledger

doni: ok that would be great to see comments on the ledeger screen

doni: instead of HEX

Steve: what do you mean?

Steve: ofc it has it

Steve: i send all transactions with text comments and confirm messages on the screen

doni: Yes that great !

doni: great expierence

Steve: ah i got what you mean, yes text is better

Steve: i am thinking about how to send schema to ledger but i am not able to figure out the best way to do so

doni: what is paractice for sperators ?   Action!arg1,arg2,  etc ?

Steve: it is not supported yet

— 2022-12-24 —

Howard: got error when compile, I already update to v0.5.0 then. TypeError: (0 , ton_1.stringToCell) is not a function

Howard: ummm even back to ton-tact@0.3.0 still got this error. So it's not the .tact file issued.

Howard: Fixed. Do not use ton@12.2.8 😂

Howard: what is the Cell data type looks like in TVM on Tact? Haven't have any idea that how to input the message into it.

Howard: Good to know: 1/ Can't use Builder or Slice data type on Tact. 2/ You can claim dataType with question mark that enable the data could be null. For example, if you claim one of data set in Struct with "Int?" then it could be Int or the Null. (reply to 691)

Howard: I just declared a mapping with a struct in my code, and set the data into it!   All the transactions ran successfully when I wrote the data into the chain.  But when I read the contract message, I got this kind of data set. As you can see, it should be based on a key input that is an Int. I get null when I input a key that is not an Int.  So when I printed all the mapping data, I got this.   My question is, how can we read the mapping data from the smart contract successfully? Because I need to transform/decode the bits into an Int or?

— 2022-12-25 —

Howard: It's in BOC, you need to know the TL-B schema of the data. Then you can use any Slice implementation to read the data according to the schema. (forwarded from Slava Fomin)

Howard: How do I find my SmartContract TL-B schema to help me decoded the data I fetched from my on-chain data?

Howard: anyone know that?

Howard: maybe we need an unpack script as well in output folder once we run yarn build successfully?

Howard: Like the template here, once we deploy the contract, we will using the packAdd function from the folder.  https://github.com/ton-community/tact-template/blob/0488a8e7f333a49e34ff8762223bc27f818869ad/sources/contract.deploy.ts#L2  cc@steve_kite

Howard: is there any way we can test contract with more caller accounts?   I know we can write test case on contract.spec.ts file, but that is not enough for me to test my contract

Howard: I wrote a 250 lines of code in practice, and got this error once I want to deploy.   (Yes, it can compile successfully. And the input argument is correct)

Howard: Out of my knowledge, definitely need Steve to trouble shooting 🥶😓 the exitCode seems not the same means in _errors area in your ts file after you compile the contract code.

Alex: Hello, guys! I want to get into the creating of detailed documentation of the TACT language. This first footstep describes my vision of this work, based on what you mentioned earlier. I ask involved people to consider the proposed plan and add comments if you have any thoughts how to improve it.

Howard: it shouldn't be the Contract Code error right? Or the abi issued. Seems the encoded typeScript file show the error when I get the bin/Boc data when I try to genera a URL to deploy the code. (reply to 706)

— 2022-12-26 —

Howard: I found the issued!!!   Because I claim a parameters and did not claim and value in default!! (like self.key = value; in init part) (reply to 705)

Seitaro: it is not part of standard and it is ok to use other op (reply to 650)

Howard: Tact and TON is super cool!

Howard: is there any example for return value that I temporally had in a if loop?

Howard: Like here, return the Value A.   Although it is claim in a if Loop. ✅

Howard: or maybe I should using fun xyz() that manipulate the value in the function.

Howard: But in ton-bet example, we are using 3 parameters?

Howard: Same issue: If you deploy a contract that can trigger the deployment of a new contract, you need to ensure that the initial parameters you specify have default values. In Rust, you must provide a default value for any Int or Address you set previously.  This is why we got Exit Code: 7 (reply to 718)

datboi: hi there! how did you enable syntax highlight in VS? (reply to 453)

Howard: I put it as Rust lang. Let's all.

— 2022-12-27 —

Howard: in Jetton Wallet standard: We have     let fwdFee: Int = ctx.readForwardFee();    What is .readForwardFee means? This is the "Gas Fee" of the Tx sent to the current contract, I guess?

Steve: No, it is much more complicated that this. Better to take a look at whitepapers first

Howard: Thanks. Is it called with other name?

Steve: Yes

Howard: I can't implement the String to the .tact.   1) Already update to ^0.5.0; 2) Even I copy the example payout.tact in my local folder then compile still got the error.

Steve: upgrade ton library to latest and don't forget to update resolve field in package.json

Howard: OKOK

Howard: Seems the executor issued.

Howard: what version should I add in resolve field in package.json? (reply to 730)

Steve: that's why we are enforcing versions in package.json

Steve: i spent few last days to reimplement everything in a new library that would work without such issues

Howard: Nice nice!!!!

Howard: Tips: Noticed that you were not putting the same address in the mapping multiple time!  Although you can still compile the code to get the deploy URL and then send the transaction, you will not be able to activate this contract if you write it like this in the mapping! (For example, the mapData2 in the screenshot.)

Steve: Missing type check?

Steve: please, file this in github?

Howard: For those non-activate contract will be like this on https://testnet.dton.io/

Howard: for the receive() method, is it able to receive Integer as a input?   I am thinking that how I can set series of functions once user send numbers, like '1, 2, 3, 4.....`  If receive integer number 1, I store his address. if else receive the integer number 2, I store his TON balance..during the moment.

Steve: only by wrapping into a message

Howard: yeh, understood. But I am thinking how I can integrate with @cryptoBot based on the comment feature when sending Tx. I want People can trigge Tx without wrapping the message.

Howard: Then that would be super super cool and easily get mass adoption.

Steve: You can try to parse slices

Steve: like receive a String, make it ".asSlice" and then read it byte by byte

Howard: Slices? Can you share a gist for example?

Howard: ohhhh probably got your point. Let me try out.   Is .asSlice method already integrate in Tact @^0.5.0?

Steve: yes

Howard: So write a receive method that can accept all the Strung Input? How to do so? (reply to 748)

Steve: receive(msg: String) { }

Howard: like this?

Steve: no, you have to parse numbers

Howard: can't find .loadCoins() in https://github.com/ton-community/tact by the way.   What is that means in detail?

Howard: ummm seems close the answer. But still got  ExitCode '9': `Cell underflow `

Howard: Have you try out how to turn the String to the BigInt before? @iftryalexg

Howard: @name(load_uint) extends mutates native loadUint(self: Slice, l: Int): Int;  @name(preload_uint) extends native preloadUint(self: Slice, l: Int): Int;   What is load / preload means? 🤣

Andrey: Load changes position of slice, preload - not (reply to 767)

Howard: 😵‍💫

Howard: still shows Exit9 if I  send a String type of number

Andrey: As you can see load has modificator "mutable", it's changes state of Slice with new position (reply to 767)

Howard: make sense. Then how I should prepare for the bytes space if the input is the Numbers with "String type".  (because it's on comment only)

Howard: Oh! I got the solutions, maybe the space of Slice is different every time!  The best situation is record the size of Slice for this input String!  Aka, check the size of the Builder(the size of the Slice we got from Input)

datboi: will this contract accept my external message? or is it possible to transfer coins only by internal message with TransferMessage structure?  https://github.com/ton-community/tact/blob/main/examples/wallet.tact

datboi: is it possible to define a method like recv_external in func?

Steve: Not yet, but I recommend to use internal instead

datboi: will it be implemented?

Steve: What’s the use case?

Andrey: ponimayu

Steve: Bounced flag doesn’t make sense here btw

datboi: basic wallet contract, for example. if i use wallet, it’s possible that i dont have any other contract, from which i can send internal message (reply to 778)

Steve: You better avoid doing this

Steve: External messages require to have completely different flow and work with gas, it is better to avoid and just use internal messages

Steve: New low level wallet contracts not needed in general

datboi: ok, got it

datboi: this function just creates local variable and nothing else, am i right?  receive("duplicate") {     // Create new wallet     let walletInit: StateInit = initOf Wallet(self.key, self.walletId + 1); } (reply to 774)

Howard: @CryptoBot can't support withdraw to the contract address yet. (reply to 773)

datboi: does tact have jetton example? the contract below at least doesn’t have transfer methods 🙂  https://github.com/ton-community/tact/blob/main/examples/jetton.tact

Howard: noticed that an error will happen if I create to many mapping initially....

Howard: Tips: you can only set 8 mapping in one contract!!  Remember this then can save you lots of time!  Solution: Clean up the data structure, or create a new contract to store the data I guess.

Howard: wondering how we can send fallback comment once people accidentally sent the money to the contract?

doni: I think it would be very interesting for you to study the jetton and nft architecture and understand how to shard data between multiple contracts  mapping / dictionaries have many cons due to the memory layout of ton ( everything is a bag of cells ) (reply to 790)

doni: https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons

Howard: nice! nice!

Steve: This is temprorary limitation, I did t aware that someone would hit it (reply to 789)

Howard: One more question is that, how we get 'the current moment of "ctx.value" '  For example, the Tx will trigged a receive method in my contract that will generate a new contract.  But during the excecution, it's hard to get the rest of value that "after the gas used". Is there any any way to get so?

Steve: No

Howard: URI Too Large

— 2022-12-28 —

Howard: OK, same mistake.   If you get Exit Code 7 all the time since your ContractA will initialized a ContractB. It might be happend because you didn't set a default value for the dataType you claimed firstly!!  (Took hours to find the bug 😭 (reply to 720)

Howard: is there any functions that can count in BlockNumbers or Local Time? (Like 1 hour, 1 day...so on)  For example, would like to set a functions that will fallback the funds to original senders since after 24hrs.

Howard: Like, I can create a bounty by deposit some TONs, and since no one submit the Tx, then the funds will back to myself after 24 hours.

Howard: Any example for NFT in Tact yet? (reply to 792)

Howard: btw, there is no Non-fungible Token Standard yet, right?

Seitaro: TON's repository with standards is here (reply to 807)

Howard: I can't understand FunC 🥺

Howard: but will try out build a trait

Howard: On the other hand, I am building a DApp using self.counter: Int as the MemberID to tag for the users.   One question is that, is this might be something issued happend there?

Howard: Tagging the users using the contract status, is that ok in Tact?   (For example, once the receive(Register) complete, then add 1 in self.counter)

Howard: Would like to see what is the example in Tact for rollback action

Howard: ok, builders never stop. Will try out implement a NFT version in Tact.

Howard: what is the recv_internal means in Tact?   Like init() {}, right?

Howard: hi all, what is the op == op::get_royalty_params()?   Which means the type of message send to smart Contract with method called get_royalty_params? (forwarded from Howard)

Howard: this method is "External message" right?

Howard: I think TACT haven't have the global syntax for this yet?

Lev: There's just a function defined somewhere called op::get_royalty_params() that returns an int with the op-code of the operation, no special syntax involved (reply to 816)

Howard: okok!

Steve: You can’t parse manually in TACT this code is generated and value of op is a part of message definition

Howard: There is also has input for get Method in NFT, what is the individual_nft_content means?

Howard: okok 😂

Howard: ok, would like to know how I can pick up a "random number" in Tact to set as query_id like we had in standards (reply to 808)

Alex: It seems math.tact permanently included and you can use one of (randomize_lt(), randomize()), don't you? (reply to 825)

Howard: This is super cool! But are the differences for those two? (reply to 826)

Howard: Can't code in FunC yet. But appreciate it! (reply to 828)

— 2022-12-29 —

Howard: hi @steve_kite , I jus reached a error said "Max Call Stack Size" when compiling. What should I do next?

Howard: Never mind, seems some empty setting for  receive(),  receive(msg: String) bounced() will crashed the compiler. Just skip these part.

Howard: tried to follow the dataStructure & input that the standard asked.   Can we set a  'Get' function to get the MethodCode of the contract? (reply to 808)

Howard: got this error when I tried to import Math.tact   import "@stdlib/math"; (reply to 826)

Alex: it is part of stdlib, you needn’t include it, I think. For me build works properly w/o additional import:  contract Lottery with OwnableTransferable {     owner: Address;     rand: Int as uint256;      init(owner: Address) {         self.owner = owner;         self.rand = random();     } } (reply to 835)

Howard: think that the difference for  random() and randomize(x: Int) (reply to 836)

Steve: do you have a test file? (reply to 832)

Steve: do not use random generator in init functions (reply to 836)

Alex: As I understand you need contract Collection.  I saw example, where Contract uses Trait, but you are trying in Trait using Trait. What for? (reply to 840)

Steve: Traits within traits are supported

Steve: I suppose there are no imports provided

Howard: Do we get passed for this jetton Standard on Tact already?   Some part of the code doens't maket sense for me when I compared with TEP074 (reply to 615)

Steve: Like what?

Steve: I tested jettons briefly, it worked

Howard: why here is double '!'https://github.com/ton-community/tact/blob/0e0d8088809d82e2bffce553cb6b2c92887ad5bc/stdlib/libs/jetton/wallet.tact#L98  I can't compile the code....

Steve: This forces variable to be not null

Howard: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md   And as this TEP mentioned, I guess I should set Int? as Bool data type?

Howard: Yeh, it doesn't work with me. Quite weird. (reply to 852)

Steve: You prev_owner is not nullable

— 2022-12-30 —

Howard: maybe just typo: But the response_destination in TEP-0074 didn't be use in JettonStandard.tact (reply to 849)

Howard: Hi all, how can we unpacked the data from on-chain?

Howard: I followed the TEP0074 to set this get function in Tact.

Howard: The problem is the the data return from this function is an Object

Hermès: Maybe you can set the function with the store value you want first? (reply to 862)

Remy 🥞: Hey 👋 guys

— 2022-12-31 —

Howard: Hi, guys. I am test it out with Forward Fee, and it always failed because the ctx.value(aka the TON I sent) is lower than the value I got.   My question is why the value I got at ctx.readForwardFee are so high?

Steve: what do you mean high?

Howard: This line of code is followed TEP64 here, right?

Howard: I am confusing with forward_ton_amount and fwd_fee I guess.   To be clear, fwd_fee is the fee that we paid during the execution.   And forward_ton_amount or forward_amount in TEP62 is the nano-ton that we move to token contract itself to paid with the future storage cost, is that correct?

Steve: forward_ton_amount is the amount to attach to a message of a sent token

Steve: you usually need some ton in the message to make receiving part to execute code (this is how it paid for transactions)

Howard: That is more like Account Abstraction I guess in EVM?  Then next question is, when the ton balance of JettonWallet Contract(let's say) going to zero, we need to transfer the TON to contract to maintain it can receive the Tx and execute the code as well?

Steve: no, by default tx fees are paid from value of incoming messages

Howard: Then I think I found a place might not followed TEP74-Jetton, correct me if I am wrong:  the Jetton standard in this line under the fun mint(), it trigged the initial TransferInternal for the first Tx.   The forward_amount should not put as zero as TEP said. (reply to 873)

Steve: yes, because notification doesn't make sence to send with zero value

Steve: since it wouldn't be processed

Howard: I just deployed the NFT standard in TEP62 successfully.   But now the issued is that even I passed the Txs with right method code. The testnet.getgems.io still can't fetch my NFT data success.   (aka, the get method for 'get_nft_data')   1/ I can called and get my nft contract data back successfully.   2/ Some people asked that I should change the Get Function name to exactly same in get_nft_data. But I don't think it would work.

Howard: 👾 😂

Howard: it must be kidding me.... it passed if I changed my local tact file function to exactly same name.....   thanks get_nft_data....

Howard: I thought the name is no different for the result tho

Alex: Does anybody know, if I can invoke a test for a function declared inside the contract(like fun doMagic)? Failed in my experiments and can’t find similar case in the examples.   contract Sample {  //contract body     fun doMagic() {     // Magic     } }

Steve: self.doMagic()

Howard: Hi I jus tried to implement the TEP62 of NFT standard in Tact. You can deploy then send the 'Mint' in string to get NFT.  You should implement UpdateContent or Update Royalty Parameters if you want listing on getgems!  https://github.com/howardpen9/tact-template-nft/tree/main/sources

Dan: Great job! (reply to 888)

Howard: I followed most of the steps as reference in @steve_kite 's Jetton code. Because of those template that I can easily learn how to code in Tact! (reply to 889)

— 2023-01-01 —

Howard: hi, how to put "String" into Cell data type in Tact libraries? I am checking with getgems NFT libraries.   I think what we need in Tact ecosystem is different. For example, when we deploy the contract with the initial content, we don't have "String" data type to put for NFT content(aka, the URL, the metadata, the string).  We only accept with Cell data type.

Howard: I think can optimized this part for Tact developer more easy to deploy the contract so on so for.

Alex: Hey, hny. As I saw from source(also added short description here), it should work in this way: StringBuilder s = beginString(); s.append("String"); Cell data = s.toCell();  or  in short form, perhaps Cell data = beginString().append("String").toCell();  But need to check how Tact compiler(also, I'm not sure about boundaries for String length). As you really f&f I think you can try it right now. :) (reply to 891)

Howard: I also tried this way, because you know, in NFT standard we need passed the Royalties Parameters and the URL. (reply to 893)

Howard: Thanks a lot!   Let me try out this method and then change my Tact code. (reply to 893)

Howard: do you have the way for TypeScript? Because those initial input can only send the string in Cell, right? (reply to 893)

Howard: I tried to sent this URL in collection_content for different ways, still failed  https://testnet.explorer.tonnft.tools/collection/EQA4P3-7QwrqjE3P87XDWrW1umKK2vy6g3ILR51sxyhXPxJZ

Howard: I guess I had issued when put this URL content to the Cell when I trying to deploy the contract

Alex: Well, I'm not sure what way will better for you. Perhaps @truecarry or @dvlkv could advice the best way. I looked through examples and It seems most relevant of them. You can check examples for NFT-deployers here. But example for "ton" library should exist too, i think. (reply to 898)

Howard: Then I think implement wrong in get_nft_content(int index, cell individual_content)

Howard: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md   the full_content in down below is the same as the collection_content previously, right?   It made the confusion 😂

Seitaro: No, collection and each NFT of collection have it's own independent content. However content of the NFT is not stored in it's contract but distributed between NFT and Collection. To get finalised NFT content you need to get individual_content from NFT contract and process it via collection's get_nft_content method. Such separation allows to build flexible systems, for instance - collection can contain shared part of content of all items - update of collection contract allows to update all NFT's content simultaneously by updating get_nft_content function (otherwise it would be necessary to update each NFT separately) (reply to 901)

Howard: To get finalized of NFT Item content, I need process item contract's get function get_nft_data() get the individual_content, and then passed to get_nft_content() get function on collection data to get the full content data (aka, the url?   Let's take the example cases here again, in testnet-nft tool website we got the content for this collection for each:  Then I will store these URL separately in content? Got it.

Seitaro: >To get finalized of NFT Item content, I need process item contract's get function get_nft_data() get the individual_content, and then passed to get_nft_content() get function on collection data to get the full content data Yes  Note, however, that NFT content is not always url, content/metadata is also may be stored onchain (reply to 903)

Howard: https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/nft-collection/NftCollection.data.ts#L12 (forwarded from Howard)

Howard: This is the example in FunC that people will passed in when create an NFT collections.

— 2023-01-02 —

Howard: can we have more example in, how to use .asSlice()? .fromBase64()? (reply to 748)

Howard: I think I am struggle with put Slice to String lmao.

Howard: Cell into Slice data type, then put Slice into StringBuilder, then put StringBuilder to String Output ? 👾😂

Howard: It is failed.   I checked with src/test/features/strings.tact in Tact repo, there is no direct way to put Cell to String.   (aka, for NFT content, will need concat 2 string which store in Cell type in Smart Contract)  Any suggestion?

Howard: Hi, I followed the document that put the cell data I store in contract put as 'StringBuilder'.   But since I append the String, got this error.   ` cannot unify type tuple with slice       tuple $content_toSlice = __gen_Cell_asSlice($content_cell);`

Howard: cc @steve_kite can you take a look please? I am stuck in here a while😵‍💫

Howard: Hi, before I figured out the Tact compile issue. I draw this graph to clarify the process of setting the NFT standard in Tact.  Followed the TEP62.   And I have the question about 'query_id'. Let's say we implement the initial mint of NFT item based on this, (follow the example, this kind of Tx query_id is set for 0)

Howard: My question is: If I want to implement more functionality, should we let the user(pass on message format with 'query_id').   Or we just set a random query_id in smart contract code level?  (For the red line as the example that I want to add in my NFT contract)

Howard: anyone has the same issued? when dealing with Cell to String something like that (reply to 912)

Steve: query id is arbitrary number that could be used in contracts

Steve: I am not aware if anyone actually used it now

Howard: thanks thanks

Howard: can't understand why got this error tho🥹🤩

Howard: does simpleSend or simpleReply not works in stdlib?

Alex: Where are from these functions? I can't find them in send.tact. (reply to 921)

Howard: I followed it from TonBet repo.

Howard: https://github.com/ex3ndr/tonbet/blob/668b9a57d0b91f6e893f2c4b4e17d2265a7052ec/sources/contract.tact#L52

Alex: Declared as special case of send in this contract here. (reply to 924)

Howard: thanks, make sense. I can implement it in contract myself.

Howard: Btw, anyone got this error when trying to put cell to string? (reply to 912)

Howard: still trying to implement a version for NFT standard in Tact

Alex: I had same issue when tried append() (reply to 927)

Howard: I just got this weird error that I can't find where if I had this get function....

Howard: This function is basically a easy math calculation tho😳🤪

Howard: but if I comment the require line of code, then wouldn't had the error when compile... quite wired. Wouldn't have error before tho.

Steve: incorrect library versions

Howard: ok, I think it is happend when too many different string in require() statement

Howard: oh? what is that mean (reply to 936)

Howard: I am using ton in "12.2.8". and ^0.5.0 for Tact

Howard: Yeh, I think the error is coming from require statement

— 2023-01-03 —

Howard: Sorry, which one is incorrect? (reply to 936)

Alex: @steve_kite  I noticed fromInit() function in tests, and I can't launch successfully yarn test in jetton project. Is it something in progress? Or could You provide, what I should double check to achieve a successful launch of these tests?

Howard: since compile completed, got this kind of error that I can't find the solution myself.    Property '#private' in type 'BitString' refers to a different member that cannot be accessed from within type 'BitString'  BitString? I didn't interactive with String tho.

Howard: OK, fix when I deleted the resolution changed in package.json (reply to 944)

User<2130735915>: Good (reply to 947)

Steve: I just released TACT 0.6.0, no language changes, but it works with a new ton.js libraries and uses completely different way to test your contracts using new ton-emulator:  I recommend to checkout new template and copy your sources: https://github.com/ton-community/tact-template

Steve: I need a feedback of testing: https://github.com/ton-community/tact-template/blob/main/sources/contract.spec.ts  With a new api you are not testing contract as is, but in the whole system and things became a little bit different and little bit more complicated, but i hope it is still straightforward

Steve: BTW bindings now can work with v2 and v4 API as well as emulator using the same syntax!

Steve: Also, i am really looking into a list of a bugs, but i need them ready to test, usually just ready to build source helps

Steve: Sorry i was really busy solving all this legacy stuff in ton.js library and whole ecosystem

Steve: 🌚

Steve: In general, i think we are 60% into production ready release. The things that stops from 1.0.0: 1) ABI interface and bindings. They are not stable right now and i am planning to change some logic in the nearest future 2) Dictionaries, i have implemented them in correct way in core libraries, but haven't ported everything to TACT 3) Improve random function. I think compiler must enforce randomize_lt before calling any random function, this is a serious breaking change that could alter behaviour. 4) Remove abi.pack_slice / abi.pack_cell and introduce .toCell in structures itself  Nothing else seems to be breaking changes

Steve: Ofc solving bugs is important, but it wouldn't introduce breaking changes

Steve: Ah yes, i need a simple centralized helper service to upload bindings during deploy

— 2023-01-04 —

Steve: Just relased a version that is incompatible with previous, it changes the way get methods expect arguments and return values. Also abi.pack_slice and abi.pack_cell was removed, new random functions  https://github.com/ton-community/tact/releases/tag/v0.7.0

Howard: oh abi.pack_cell was removed 🤣 (reply to 949)

Steve: Yes

Howard: ok. I removed the syntax for abi.pack_cell and got this error when compile. (Using ^0.7.0 already

Steve: Please post the code to GitHub

Howard: https://gist.github.com/howardpen9/713e22366604cace12f7c13a1ff18abf (reply to 963)

Steve: I will take a look

Howard: ok, founded, it's related to the .toSlice() method (reply to 964)

Steve: What do you mean? (reply to 966)

Steve: asSlice?

Steve: Ah I see

Steve: No type checking for declaration hm

Steve: check 0.7.1, should show a correct error

Howard: Question about multi-calls in Contract:  I have the contract logic that will trigge like this. I am thinking that how I can set in 'value' field, to make sure the Tx will not failed? (Or any Mode I should set in Send function with parameters)  Because when I tried this at this moment, my contract will get Auction Failed.

Daniil: Maybe you're trying to send more than your contract's balance? (reply to 972)

Daniil: Sum of both calls' values must be less than balance

Howard: I thought it failed because I use SendRemainingValue in first Send functions, I guess.

Daniil: probably that's the reason I had a similar problem few days ago (reply to 977)

Daniil: That "sendremainingvalue" mode doesn't take in account other outgoing messages

Daniil: And if you use that mode in first outgoing msg, the second one won't have anything to send (reply to 977)

Howard: then how you set value in each internal Txs?

Daniil: It all depends on what logic do you need to implement (reply to 981)

Daniil: If contracts 2 and 3 don't require you to attach some additional value to a msg, you can just send some little constant amount to cover the fees

Daniil: And if you really want to send "all remaining balance", you can try subtracting the fee from contract's balance manually and send the remaining

Howard: then the next common issued is that, how we set for min_balance for a contract to maintain its functionality usually? In Steve's Jetton implementation, he keep 0.1 TON for a wallet contract tho.

Daniil: Yes, you should keep some little amount on balance (reply to 985)

Howard: ok ok

Steve: That’s the question of the year, but in general you manually estimate how you need in each case. Fees are fixed in ton or they would go down, not higher. (reply to 972)

Steve: Kind of, but I am not using really this in non Jetton contracts, if you need your contract without money for less than say 6 months it is ok not to keep storage (reply to 985)

Steve: For jettons the issue that someone could keep them for years

Steve: Currently it is impossible to spend more than one ton in gas fees so this is your higher limit, you can always return remaining tons

Howard: yeh, maybe I can set a receive method for owner to withdraw all the funds there

Howard: I am thinking the custom_payload in practice. It's a Cell.   Is there best way to transition the Int to a Cell`?

Steve: Yes we are using this scheme usually since it is much more predictable and also saves on gas fees (reply to 992)

Daniil: Int to a cell -> just make the cell with a single (u)int256 or whatever size do you need (reply to 993)

Daniil: /report (reply to 997)

Howard: /report (reply to 997)

Howard: yeh, I think I need some example to learn how people deal with Txs in paralleled. Especially accessing different receive method. 😢 The Tx all at failed with Auction Failed. (reply to 984)

Howard: any example with SendPayGasSeparately guys?

Dario: To send two messages that is likely to forward unused gas, do something like this:  int gas = (msg_value - (storage_fee + GAS_USAGE+(fwd_gas_estimated * 2)) / 2; And mode 0 on both messages.  you can use an hardencoded value for gasusage OR compute it dynamically based on gas price

Dario: In tact,.idk how to do it. IMO there might be a static parser of the code that assume all conditions to true and estimate gas usage at the most, so we can use gas_usage everywhere and get pretty accurate estimations (reply to 1003)

Howard: I tried to type ton("0.1") but seems it will forward the all TON to next contract. (reply to 1003)

Howard: Thanks for reply, will try right now. (reply to 1003)

Dario: You should nt use hardencoded values (reply to 1005)

Howard: we changed the Read contract structure as well?

Howard: the old method shows the error now.🥶🥲

Howard: how to access contract's get method right now>? Used to be accessing import { createExecutorFromRemote } from "ton-nodejs"; like here on TonBet https://github.com/ex3ndr/tonbet/blob/668b9a57d0b91f6e893f2c4b4e17d2265a7052ec/sources/contract.read.ts#L42

Howard: not the TS expert, but since we changed the compiled file structure. How can I access get method now like this for NFT collection?

Howard: was easy like this to get smartContract data, but I think we changed the way to call the get function?

Howard: would be happy to see other people share how to fetch the data onchain on Tact template repo!  I will prepare with test file to test my contract first.

Howard: how we generated this events code😅 (reply to 950)

Howard: Still will got error once using the .asSlice when I set a StringBuilder with a coming Cell datatype 😅 (reply to 968)

Steve: Isn’t I told you to use new libraries several times?

Howard: Sorry, I am not familiar with TS libraries. Are these correct? (reply to 1017)

Steve: Yes

Steve: Ton-nodejs is deprecated

Howard: is there a way that I give a "String" in default and put it as a Cell data type?  Now I only put it as    self.individual_content = emptyCell();

Howard: This is the code that I am working on for NFT implementation on Tact. (reply to 1021)

Howard: Yes, there has a way to put String in default for the content you can put initially.   Using "String Here".asComment(); to put it as Cell. (reply to 1021)

Steve: no, how can you put a string into binary tree?

Howard: 😂 I need a cheat sheet. I just want to put a string append together tho

— 2023-01-05 —

Howard: Hi guys, is there any way I can let NFT item 1 contract fetch data from NFT Item 2 in Tact? like this

Howard: I am trying to fetch data from Item 2 contract back to fetch 1 to do the comparison.   Like here in Solidity

Steve: no data sharing in ton, only sending messages

Lev: Literally 1984 (reply to 1029)

Lev: But the NFT standart has an op-code for getting the data, so you can send the message and then act on the reply from the second item

Lev: Ofc it depends on what you need to do, but I'd say it's kind of like this: 1. You do everything until you need to fetch the data 2. You save the intermediate variables (if you need) into the storage 3. You send the message with the request to the second item 4. You handle the response in recv_internal() by checking if a message is coming from the second item 5. You continue doing stuff with the information

Howard: I am trying to implement the own feature for the Dapp.... Thinking how I can solve this

Howard: More like a game based on NFT. So people can transfer, sell it so on so for. And NFT itself also has the other value that I can track, fetch to offline and show on website so on so for.

Howard: recv_internal() in FunC is more like receive() method in Tact, right? (reply to 1032)

Lev: Probably, yeah (reply to 1036)

Steve: i welcome you to review what tact generates, it compiles to FunC (reply to 1036)

Steve: btw on this openai screenshot it is just a reading function that you can emulate offchain, you have to do this in dapp itself (reply to 1027)

Howard: this is a great topic. Interesting. I will try and implement like this. Thank you. (reply to 1032)

Howard: really not a expert in TypeScript. Can we add an example for contract.read.ts again?  Try to fetch the data from my contract to verify the result.

Steve: did you open contract?

Howard: yeh, I just deployed on testnet and test it by fetching the data. Because I haven't familiar write in test at this moment.

Howard: Since I usually use createExecutorFromRemote to check the data. Now it's abandoned.

Steve: again this is ton-nodejs it is deprecated and not going to work

Howard: OK, this is the latest way to read contract data since after you compile successfully.

Roman: Dear developers, 👋   I'm Roman, a Developer Onboarding Manager at TON Foundation.  Recently, TON Footstep about Tact documentation was launched. @iftryalexg made a structure for future documentation and will implement it.   We aim to make the best documentation we can in an open and transparent way with help of community.  🆔 Everyone is welcome to read the documentation plan in the ton-foostep:  https://github.com/ton-society/ton-footsteps/issues/105  If any questions about documentation, this chat is the best place for discussion and continuous improvement.   The most valuable contribution would be: - which examples of using Tact do you lack? - what guides for Tact do we need first? - documentation plan improvements?  For any Tact language ideas, bugs, and feedback, please (1) create an issue and (2) post the link here.  Let's build the future of TON together! 💎

Howard: hi all, I am trying to read on-chain data (again!)  With the latest template, I can't understand how to decode the structure we pointed out..... anyone know how we decoded this? It changed with the last version.

Howard: anyone? 😅 (reply to 1049)

Steve: it automatically decoded

Howard: Btw since I am working on NFT standard, I noticed that when I using TonKeeper to transfer the NFT, got exitCode:9 Cell underflow

Howard: does that mean my NFT with Transfer message receive implementation has the issued?

Steve: try to use ton.cx and find your transaction there

Steve: it will show you everything in detail

Steve: https://testnet.ton.cx for testnet

Steve: https://test-explorer.toncoin.org

Howard: oh, ok! I just need add a quote like this to read a Struct from new libraries!! (reply to 1052)

Howard: Is there has any way I can track what method code I will get in my message list?   I have 5++ of receive implement on my contract. I can't figure out which one is which lmao

Howard: Can I give arbitrary code for them? Like the TEP62 NFT standard gave the method code specifically.

Steve: you can try to read func

Howard: I will! Since I haven't finished the NFT standard in Tact. Can you help? (reply to 1062)

Howard: I can't passed the TonKeeper transfer method. (reply to 964)

Howard: Hi @steve_kite I think I reached a maximum charatars in IE. How could I deploy the contract to testnet?

Steve: IE?

Steve: For large contracts I usually copy link to the notes app and open it on the iPhone

Steve: iOS doesn’t have limitations for links at all, you can pack even 1gb of data in the link

Howard: It will like this

Howard: any suggestion?

Steve: You need url safe encoding I forgot to add it again

Howard: Please add🙌 I want to code more!

Alex: Hello, TON developers!👋 Ready to step into the 2023 TON massive adoption year? Let’s do it with Tact!  TLDR  Tact is a high-level, scalable language designed to improve the usability of smart contract development for TON. If you've long wanted to dive into smart contract development, now is the time when you can start from the very basics as a Tact developer. Definitely, your participation will be especially appreciated if you are an experienced FunC developer🤝.  The Tact language project was originally initiated in the summer of 2022 when the original concept was designed.  In December 2022, the Tact compiler development continued, and currently work is in full swing.🌋   What next?  To improve the quality of the Tact compiler an important request🥺  to the great TON community is to play with the compiler according to the template project.   If you will find a BIG problem with the Tact compiler itself, we will be very happy if you tell us about it in the chat or in git issues. Also, feel free to ask your questions Tact questions in chat.   If you have any questions about the Tact documentation DM me @iftryalexg  - I will disclose all questions ASAP in the documentation or answer you with a link that helps you.🤓 (forwarded from Alex)

Stanislav: Hi! I like tact design at first glance. For me it is similar to js&golang in some way(Maybe because I work only with them😁). Is there support for tact language in any IDE?

Alex: Text editor highlight is currently unavailable and will be developed with the community's help in the near future. I think it will be Jet Brains/VS Code in the first order. (reply to 1076)

Howard: Yeh. VS to code. I usually change the syntax highlight to set it as Rust! Which is helpful. (reply to 1076)

Howard: Want to follow up the “String” usage when encoded into Cell.  Anyone solve this yet? (reply to 912)

— 2023-01-06 —

Howard: Is the Transfer function that TonKeeper wallet called for NFT is different from the Transfer we defined here in TEP62?   https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md (reply to 912)

— 2023-01-07 —

Howard: how do we do the comparison, since the self.get method will need add the question mark "?" for the value.

Steve: !! forces to be non-null but would crash if value is a null

Howard: wow! Nice. (reply to 1089)

Howard: sorry, how to solve the deploy URL too large?

Howard: my deploy code is over 10,000++ now😂

Howard: is this official Twitter?

datboi: deploy by yourself, via tonutils-go, for example  https://github.com/xssnick/tonutils-go/blob/master/example/deploy-nft-collection/main.go (reply to 1091)

Howard: oh nice! (reply to 1094)

Howard: can we deploy the conde through API as well in TypeScript?

Steve: I think we can, it is just you won’t be able to send message from a correct address

datboi: why not? you just need to send a message with StateInit inside. i guess TypeScript has some libraries to send messages via API, such as tonweb (reply to 1096)

Steve: Please no tonweb here

datboi: anyways, it’s trivial to send message, Tact compiler must give you StateInit code and data

Steve: Not universal and I prefer not to have any keys on working machine

Howard: out of my knowledge! 🤣

Howard: oh, that make sense. Yeh, it's totally different than the way we developing on Solidity.   Interacting with chain through Wallet then wouldn't need to store the key in the local .env file. (reply to 1101)

Steve: Yeah I wouldn’t want to make it default way to deploy even for development

Steve: But I guess it could be done

Steve: Also you can just use ledger I am not sure if this is a feasible way to someone

Howard: so how I can deploy the code right now tho? Or I just learn how to write the test case right now first. (reply to 1106)

Steve: You can use normal api and a library to send message the same way you are doing tests

Howard: Sorry, how we get those json part.... in test file? (reply to 950)

Steve: It is autogenerated by jest

Howard: how you got those? Can't find any description about this part in template repo 😅

Howard: 3 major issues:  1. How to put string URL in Tact code for NFT content.  2. The deploy code is too large that can't deploy through TonKeeper  3. How to generate test cases from jest

datboi: 1. you can check NFT content cell generation in tonutils-go framework https://github.com/xssnick/tonutils-go/blob/master/ton/nft/content.go (reply to 1112)

Howard: omg, all go-lang? 😂

datboi: at least, it’s easy to read :)

Steve: We are almost ready to 1.0.0

Steve: TACT reached feature and ABI freeze in 0.8.1  This is the last breaking release before 1.0.0. I expect compiler to have some possible bugs, but if you are testing your contracts you should be fine. I recommend it to early-stage production development. For example if you are going to release in a month-two, TACT is a good choise for you.  Changes: * Dictionaries in typescript bindings * You can now generate bindings for non-tact contracts by writing a specially formatted JSON file (we are welcome to contribute another ways to describe contracts!) * Stable and predictable ABI that you can use in your explorers and apps to generate a UI for working with a smart contract  https://github.com/ton-community/tact/releases/tag/v0.8.0 (forwarded from TON Development News)

davide: is there also a guide to tact,? (reply to 1117)

Steve: Nope

Steve: Just examples and stuff

Howard: Hi, can we help to solve the issued for URL too large? (reply to 1117)

Steve: Have you tried to send a transaction via ton library directly?

Howard: nope.... is there an example? Just need to solve the  initial contract code

Howard: the write, read the smart contract is ok for me. I followed the template repo then.

Steve: https://github.com/ton-community/ton

Howard: seems need a template for me to deploy the code I got after compile the tact..... (reply to 1125)

Alex: Can anybody share another example of *.deploy.ts that relates to Tact language contract(from Tact examples or your own)? It will help to learn how it works faster.

Howard: Change Line 3, 10, based on the .ts file you got in output folder.  https://github.com/ton-community/tact-template/blob/main/sources/contract.deploy.ts (reply to 1128)

Alex: Thank you, this is clear part for me too. I want to see more specific examples for different cases.  For example, in payouts.tact we should invoke init(address, public key) in payouts.deploy.ts. (reply to 1129)

Howard: it's just an Address data type and a Int data type (reply to 1130)

Howard: Example for the other contract.deploy.ts

Howard: once you compile you can find the packed that encoded in output folder.   And based on message you define previously in .tact file, you can find them in there.   And just copy / paste based the message data type you got.

Howard: anyone got it? 😅 ngmi (reply to 1126)

Howard: Hi @steve_kite I am using the new suggest you asked.   And it failed because I think I am using the library generated a new account that doesn't have TON in balance, right?

datboi: yep (reply to 1137)

datboi: api key is needed (reply to 1138)

datboi: Please no tonweb here (forwarded from Steve Korshakov)

datboi: and he asked for this (reply to 1141)

datboi: ¯\_(ツ)_/¯

Howard: ohhhhh? I think he means accept with TonClient

Howard: ohhhhhh, level up.

Howard: OKOK

Howard: Since I deployed the contract successfully, ExitCode 7 shows the TypeCheckError

Hermès: 👍

Steve: Tonweb doesn’t have bindings supported, and rate limits and general instability or classical api is the reason we are using TonClien4

— 2023-01-08 —

Steve: I just added deployment code that would open local link automatically without traveling to a browser: https://github.com/ton-community/tact-template/commit/c775d220838ffc07f1c619adeda4ea4cec58ad4e

Steve: Worked just fine with locally installed tonkeeper on macos

Howard: This is super cool! (reply to 1155)

Howard: got this error since only happend in @0.8.2.  There is no error to compile if I put Tact back to @0.7.1

Steve: it said what it said

Howard: sorry, I don't understand. Is it any line of code wrong? Or just the disclaim of the data type was wrong in my code initially.

Steve: you declared a field with remaining modifier and made it optional, it is impossible combination

Howard: OK, find the issued. I got your point now.  Yes, for ^0.8.1, the data type you set in message field now can't with question mark '?' now.

Howard: Hi, wondering whether the changed for non-empty accept in initial Message setting make this.   My contract now will only get exit code 7 in the first message Transfer (followed the standard of TEP62 message structure)

Howard: especially forward_payload format might be the empty I guess? (0xff)

Howard: OK, Exit Code 7 happened if you did not fully use the initial data you set on Contract_B you generated from contact_A. (reply to 1163)

Howard: What is the error code 100 means? Can't find in my Tact compiled TS file.

Steve: i have seen it somewhere, not exported error, try to check func code

Howard: By the way, the latest integrate for Tact contract report is quite cool. Well done Steve.

Howard: And the plug-in feature to trigged the local TonKeeper is super helpful. Thanks!   Now I can focus on coding Tact. (reply to 1157)

Howard: about Send Parameters, I know you can set the bounce message for funds back to previous sender.   But is it possible that I can set, "if this txs failed, do X, Y or Z?"   Because I noticed if the Tx to NFT Item failed, it will only put the TON back to Collection contract. Which is not I want.   I want to implement that any txs failed, go to this NFT Item owner. (Which more make sense for me

Howard: Is there has official Tact Twitter account?

Kirill: Working on it (reply to 1173)

Hermès: 👍🏾

Howard: what will it usually looks like in the FunC files we got in output folder? (reply to 1168)

— 2023-01-10 —

Howard: Oh. Now my code is like this: contract A ➡️ contract B ➡️ contract C.   - It's fantastic to think of a new way to design the protocol architecture, especially since each contract can't know the contract status in any block height.   - The way you want to track the data on the other contract is to let 'the current contract' send a message to the other and set a customized receive() method to send the transactions back with the status for this contract.

Daniil: Also note that it's not always safe to rely on the data that contract send you in a message. Its state may change while the message is on the way to the destination (reply to 1178)

Daniil: I think in most cases it's fine, but sometimes you should think of something more complex

Howard: Is it the original issued for TVM? Any example that how you solve this?

Howard: is it has a way like Event in Solidity so I can keep track the data/value/status for the SmartContract I just interacted?

Steve: not yet, but could be in the future yes

datboi: how will it be implemented? through external out messages? (reply to 1183)

Steve: May be yes

Howard: Can I say that the empty receive() method call are the way that set a default Txs once people send TON to the contract without "any" message or comment?

Steve: Yes

Steve: Empty comment or without any payload at all

Howard: About some standard libraries:  1. since simpleSend converted to nativeSendMessage, it seems doesn't support with contract in default yet.   2. For reply() method call: what can we leverage in this for the bounced message about body?   I mean if the body informations will bounced back, can we design a receive method to catch this error then do other behavior? (let's say ContractA -> Contract B (bounces the message) -> Contract A (catch the message)   3. For the nativeReserve, there has only 3 usage in `Tact Example`, can we say that: "If the mode is set to 0, the output action will reserve exactly the specified amount of nano-toncoins. If the mode is set to 2, the output action will reserve at most the specified amount of nano-toncoins. If the mode is set to 1 or 3, the output action will reserve all but the specified amount of nano-toncoins."

Howard: https://github.com/ton-community/tact/blob/main/docs/stdlib.md  Kind of confuse for me when reading this part. Will like to fully understand how to use this standard method.

Daniil: 2. Yes, in the contract A add some if-statement which will catch messages with bounced flag (reply to 1190)

Howard: - then that will bounced back to Contract A and rely on reply() method I designed in Contract A?  - What if I set a empty receive() in contract A as well? It's different, right? receive() is for any TON transfer with empty message.  But tx / message from a bounced situation is having the message inside, right?

Alex: I did a mistake in the description: we will send body to the sender who had sent a message to our contract(so dst of bounced message does not depends on the body). So the message body will be according to what you placed there - comment or anything else.  About catching messages, as I understand if we want to do something special in the contract we need to specify our actions with opcodes. And something special, I mean some actions, that we will do after getting this. Technically we can define actions based on bounced messages, but it seems like bad behavior. Maybe I’m wrong here, everything I saw contracts just ignores bounced messages(recognized by flag). In my understanding bounce generally serves only for returning funds.  Maybe somebody knows an example, where we do some actions after bounced message gets?

Steve: The bounced message body has just first 256 bits of the original one

Howard: Excuse me, what do you mean "Original one"? (reply to 1195)

Howard: And by the way, would like to follow up the "test" case you shared in Tact template. How you got thos json format string like here? (reply to 1109)

Steve: They generated by jest

Steve: Remove them and they will be generated on next run

Howard: Oh, it's just basic jest? How possible they can integrate without change any? Let me do more research. Thanks. (reply to 1200)

Steve: No specific integration needed it just gets the object it received and put it into test source code (reply to 1201)

Howard: But I think it would be easy to pitch the sentence, “without learning new libraries or test modules(hardhat, Ganache, Foundry...etc.), you can test your Tact code quickly in TypeScript

Howard: Is there any way I can get the random number? Try to build a lottery example for newbies.

Howard: By the way, for the tact implementation with the NFT standard, I am still stuck with the content URL part. Did anyone try that as well? Packaging the String to the Cell.

datboi: https://github.com/puppycats/ton-random (reply to 1206)

Howard: Thanks. But damn, I cant rear FunC yet. (reply to 1208)

Daniil: There should be some native random() function in Tact (reply to 1206)

Daniil: But note that its result can be predicted if you don't use some additional tricks

Daniil: One of these tricks is implemented in this repository ^ (reply to 1208)

datboi: you just send message to the smart-contract and get reply in another message (reply to 1209)

Daniil: Yeah, you can just use the deployed contract. But if you want some more customization, check the code :)  I'm also writing an article about RNG for ton docs, but it won't be ready this week (reply to 1213)

Steve: Yes tact has random function

Steve: https://github.com/ton-community/tact/blob/832e55b86f9d1b9a209d4022a4816fc037479587/stdlib/std/math.tact#L20

Steve: random and randomInt

Steve: No need to randomize it like in func, it is done automatically

Howard: Probably none-proper question: But how can we convert "Treasure" data type to "Address" data type.

Steve: .address

Kirill: https://twitter.com/tact_language/status/1612873670719901697 (reply to 1173)

— 2023-01-11 —

Howard: haha it is hard 🤣 (reply to 1221)

Howard: why we can read the msg.loadRef() in body like line 27?  https://github.com/ton-community/tact/blob/3be4ef83b29006c754b6806f4283eb44168815ac/examples/wallet-opt.tact#L27

Howard: I will get the auction failed with 2 send in the same execution. For example: In this function, I trigged a first Send method with 0.1 TON (in theory).  Then send a second Send method. But no matter what I tried, still will get "Auction failed".   How can I solve this?

Steve: What’s the value of incoming message?

Howard: sorry, "incoming message"?

Steve: Everything is done as a reaction to incoming message

Howard: for first Send message, may I just send 0.1 TON, then send all the remaining value in second Send method? This is what i want.

Howard: I am guessing that it's not able to implement 2 send method at same time.

Howard: (Like what I did over there. It just failed)

Steve: Actions can’t be failed if it is marked as ignore errors one

Steve: Nothing adds up in your code and it is not all of it

Howard: But I put both with SendIgnoreErrors then. (reply to 1227)

Howard: oh, ok. so maybe this is not the error came from. Let me check more. Thanks.

Howard: Need a tutorial for test library! 🤣🥹 (reply to 1224)

Howard: LFG LFG

Hermès: how can we leverage the usage of Deployable here in the example? https://github.com/ton-community/tact-template/blob/main/sources/contract.tact

Howard: hiiiii, how can we convert the Slice to String or StringBuilder? (reply to 748)

Howard: https://github.com/howardpen9/nft-standard-tact/blob/9a50b86b0ff83d2454de258c701ab3b9957a2906/sources/contract.tact#L155

Howard: Need someone to help with, to go through the NFT standard in Tact....   I checked and tested a while, still can't figure out how to put Cell -> Slice -> append String -> Cell   This get function is followed here: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#nft-collection-smart-contract

— 2023-01-12 —

Howard: hey guys, might be a wired question but: For sending message to a contract address initially, we have to put body and data right?

Daniil: do you want to deploy new contract from your contract, or do you want to just send some message? (reply to 1249)

Steve: And code

Daniil: to deploy you need both code and data. body is not necessary if you're deploying

Howard: Contract A will generate contractB, like NFT Collection -> multiple NFT Item Contracts. (reply to 1250)

Daniil: then contract A need to send a message to contract B address with code and data cells. body is not necessary (only if your contract B requires it right after the deployment) (reply to 1253)

Howard: I think there are using queryId? as a index to distinguish the orders for deploying the contract? (reply to 1242)

Howard: 👾 Looking for people check this together~ 🫡 (reply to 1247)

Howard: Is it possible for a user to pass in a 'String Text' and store it in a smart contract without worrying about the original text being known?   For example, in a Rock-Paper-Scissors game on Solidity like this one: https://github.com/ojroques/ethereum-rockpaperscissors#reveal-phase

— 2023-01-13 —

Howard: 🫠

Howard: I think I will just keep test in test-net production 🤣🤣🤣

Howard: Since followed the TEP62 here, we have a get function called get_nft_content. Let's say we have the URL for Collection & NFT Item were as follows.   My question here is that, what is the individual_content means here? I might not want to prepare 10,000 different URL if I have  10,000 NFT Item in total.

Howard: I know Seitaro explained before. But yeh, still stuck in here. (reply to 904)

Daniil: what's the problem with 10000 different URLs? (reply to 1265)

Daniil: often people have collections where each NFT is an unique image

Daniil: so they must have different URLs :)

Howard: Yes, I mean, I already can put index input as a parameter to generate each NFTs' URL (based on index_id)   Then why I need individual_content as a second parameter as an Input here?

Steve: Because it could store content on chain and you can change it if you wish

Howard: how will you go next to implement this part?   Append the URL (content) must using String or StringBuilder in Tact, right?

Steve: The problem is that standard somehow requires non standard prefix of a single byte

Steve: This is not supported by tact right now, but you can always work with slices directly

Howard: non standard prefix of a single byte? Can you explain more.

Howard: All slice solution might be looks like this..... can compile, but not sure is correct or not.

Steve: You forgot assign new builder to a variable

Seitaro: Well, if you have offchain metadata (via url) and each nft is unique, each nft should have it's own url. However, you can for instance store common prefix in collection like "myawesomecollection.ton/nfts/" and individual content will only contain suffix of each nft. It is possible that you mixed two concepts: collection metadata (metadata of collection as a whole set), one per collection, nft metadata - one per item. (reply to 1265)

Howard: OK, then I will try again to let my NFT standard in Tact can works on https://testnet.explorer.tonnft.tools/ 😵‍💫😭

Howard: new builder? (reply to 1277)

Howard: anyone got this issued when deploying the contract?

Steve: I just released a new version with updated stdlib: https://github.com/ton-community/tact/releases/tag/v0.8.7

Steve: it allows to build a string that conforms this standard and allows to dangerously convert slice to a string

Howard: when I read a Cell data in the contract(follow the TEP62)  the Cell I got is like this "x{68747470733A2F2F732E67657467656D732E696F2F6E66742D73746167696E672F632F363238663661623830373730363061376138643532643633}"  How to turn it back to String I stored initially.

Howard: this is wrong format for collection content (forwarded from Tim)

Howard: Can you @steve_kite check what is the nft standard should be put for content part🤣 (reply to 1287)

Remy 🥞: Not directly related, but how TVM can achieving the randomness for some degree? https://www.paradigm.xyz/2023/01/eth-rng

Steve: It is built in

Steve: Done as part of a validator consensus algorithm

Remy 🥞: Oh nice

Steve: I actually was corrected and this is not part of a consensus, but I hope it would be better in the future

— 2023-01-14 —

Howard: when I deploying my TACT contract code through local TonKeeper, it will failed like this after a while of times in execution. (1-2mins)

Howard: Might be only because my initial code is too large?

Howard: yeh, I think there has some limitation for TonKeeper API now? Can't deploy contract properly if my initial code is too large still.   Just will expired the loading time per Txs on TonKeeper? I can share the URL then let you try out tho.

Howard: Hi, what is the usage or purpose for nativeReserve?  Because "to maintain" a contract alive, we need keep some TON in it for storage cost?    Then what is this the difference we just set a constant number like here in Jetton standard as well?       const minTonsForStorage: Int = ton("0.01"); (reply to 1189)

Howard: I solved this by using TonClient API.... sadly. (reply to 1300)

Hermès: 🫡

Alex: For wallet.tact example Tact compiler makes init function with Bigint arguments: init(key: bigint, walletId: bigint)   In the ton library, we are working with BN numbers. Can somebody advise, how can we use ton library to invoke init() function in this case? Cast BN to bigint or something else?

Steve: New ton library works with bigint

Steve: But you can always do .toString(10) for both types

Howard: I noticed when I using Send method with an address I assigned before can't receive the funds.   For example, like this: self.owner_address were the initial input I put in. But it some how router to an Unknown wallet address!  If I use TonHub address as an input setting initially, this self.owner_address will be router to an unknown address (wired)

Howard: is it possible that the input address will change the format since after we put as input initially?

Alex: That code repeats what we do in tact-template. From this side, I didn’t meet any issues with changing owner’s Addresses. In the deployed contract I got the exact owner, that I specified in init() function.  Which way did you calculate your owner address when deploying your contract? (reply to 1308)

Howard: I am using testAddress libraries in "ton-emulator"

Howard: Thinking might be some shift for the address?

Alex: I used Address object, shift via Address.parse(); But it seems to work equally.  Did I understand correctly, your owner is another smart contract(wallet?) deployed earlier?

Howard: now, owner_address was the initial wallet address I gave for the Collection Address.   But the owner_address just changed since after I deployed the code and read on-chain data, it just fallback a totally different address.   I am assume that the code got shift since after we compile successfully.

Howard: for example, maybe the Tact line of code is too large or too many parameters in one contract. Can't sure.

Alex: Can you resend the address of the collection? (reply to 1313)

Howard: can we hardcoded the owner_address initially?   because like the example here I put for owner address, will change after I deploy the code (seems the contract didn't catch correctly even I send the right format of wallet address)

Howard: I mean, since I deployed this collection contract, using get function to get owner_address was different with the initial I put in. Even I didn't do any change for this owner parameter.

Alex: Since I successfully deployed wallet.tact, I think we have no such issue. wallet.tact (in the compiled version) is big enough too. (reply to 1314)

Alex: Well, I think you could get the same address but in another form. Could you resend here your address in text or link, I want to take a look too. (reply to 1317)

— 2023-01-15 —

Howard: I am still debugging which part of the initial code I pointed to the contract is causing issues.  There are still some type check errors. I think I may have triggered an edge case for Tact, as it is able to compile the code even with errors present.  Some errors will only show up with an Exit Code 7, while others don't.  Additionally, some errors cause the wrong address to be stored in the contract status.

Howard: It sounds foolish, but it actually happened! I initially pointed the owner address to my wallet address when deploying the Collection contract, but for some reason, since I read the contract status, it stored the wrong wallet address (i.e. an unknown type of address).  After thinking for a while and testing for hours, I am assuming that even though I put the initial code, the TVM might have caught and stored the wrong address. It is beyond my understanding. (reply to 1316)

Howard: Do not set the get function with a question mark, even though the NFT item address is predictable.  I think the question mark will cause the data set to take up more space in bits/cells, which may cause the original data you passed to the contract to be shifted.  For example, the owner_address we declared initially when deploying this collection contract.

Howard: anyone can share some testTON, I run out of it again. Please DM me.

Howard: Since I am using a mapping to store a series of tier level for the users:  - I am using Int? since Tact@^0.7.0 requested. So to achieve the needs, I am using the !! since after the minRequirement.  But I will get the error no matter what.  What should I do to passed this?

Howard: I implement this functions in empty receive() method, but contract will not do any since receive the TON.   thinking myBalance() didn't work here

Howard: maybe using             mode: SendRemainingBalance + SendIgnoreErrors, is proper way

Steve: Balance includes value of incoming message and therefore always more than is available since it is before gas substraction

Howard: so best way is mode: SendRemainingBalance + SendIgnoreErrors?   How about the difference in sort in order? Like mode: SendIgnoreErrors + SendRemainingBalance (reply to 1328)

Steve: No difference

Hermès: How do we know it's not “predictable”? (reply to 1218)

Steve: It is up to validators

Daniil: It is (reply to 1331)

Daniil: Unless you use some additional tricks like skipping a block

Howard: nice nice

Hermès: hi guys, trying to check the Send methods with a trigger. I noticed that the Txs might failed based on "TON value" I sent? Can't sure why.   Got this in TS file:  5: { message: `Integer out of expected range },`  But I wasn't claim this in my Tact code.

Howard: Hey, how we filter "a day" in Tact? I know TVM using LT to define the time/block height on TON.   But how we value a 24hrs/7days/ or even 30days?

Howard: https://github.com/ton-community/tact/blob/main/docs/statements.md   I checked and know that there has now() in Tact.

Steve: now is unixtime

Howard: I tried a bit in code: it was supposed to execute the Tx every 24hrs, but it seems unrealistic since we can call the function every 24hrs off-chain.

Howard: is there any way I can get the length of a mapping? And seems we don't have array in Tact.

Steve: No length

Howard: Just tried out a "String" msg and got an error code 5:     5: { message: `Integer out of expected range }`   why🤣

Steve: Because ints are maximum 257/256 bits

Step: any tact example for nft item with collection?

Howard: @Kingphin not perfect. But it can be tagged as collection on explorer. (reply to 1247)

Howard: Would be great if you can add:   1/ content part with implement String input adding in the contract.    2/ let it enable to transfer owner on TonKeeper.

— 2023-01-16 —

Howard: @steve_kite any solution we can achieve something like that? (reply to 1342)

Howard: I think in TVM, there is no way to know the exact length for a data set? So we should create the new address if so?

Howard: Like we did in NFT Item, if we have a collection with 10,000 items, then we will have 10,001 contract addresses.

Howard: can you shared with us why we need skip first 32 bits here? (reply to 1345)

Howard: 1 & 2 both can't work for me😵‍💫

Hermès: Got this error when using the  randomInt();

Step: bot? (reply to 1355)

Step: just now saw in gh issues

Daniil: are you doing anything with the result of randomInt()? (reply to 1355)

Daniil: maybe you just try to multiply it by something and it causes an overflow

Step: i also got similar exit code with func code dont know how to fix

Step: int forward_amount = in_msg_body~load_coins();     throw_unless(708, slice_bits(in_msg_body) >= 1);      int rest_amount = my_balance - min_tons_for_storage();     if (forward_amount) {         rest_amount -= (forward_amount + fwd_fees);     }     int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00     if (need_response) {         rest_amount -= fwd_fees;     }

Step: something strange with rest_amount

Step: nft transfer (reply to 1361)

Step: related to this (reply to 1361)

Hermès: where/how you got this (reply to 1364)

Step: here https://t.me/tondev_eng/19743  computation phase » server run (reply to 1365)

Howard: Hi, @steve_kite  since 0.8.0, noticed that the mapping get method will always got the error in compile. Like this:

Howard: I follow the Tact example and using this will still got error.

Howard: I am testing random() right now. And funny that the TonKeeper can know what is the result for random number... (WTF  Here is my code, I put random number to do a calculate!

Howard: But once I calling the contract, it will show what is the team code I got!!! 🫥🫣

Howard: So I do some tricks, I do not post the team_code that I got from random Int, I binding into the message to send to next contract rather than exposure as a initial code for contract B.

Howard: then TonKeeper will not able to decode the message I assume.

Hermès: I am thinking that we need a better way to get "random number" (reply to 1373)

Steve: What’s the problem with a normal random why use low level internal functions instead?

Howard: waht do you mean? (reply to 1376)

Howard: why use low level internal functions ?

Steve: Why you are using nativeRandom

Howard: I wanna get a random number tho!

Howard: or should I using this? random(min: Int, max: Int): Int

Alex: It seems so https://t.me/tactlang/1218 (reply to 1383)

Howard: Roger that!

Howard: 🫡

Howard: 😵‍💫

Howard: I am using it as random Integer pick, and it always return 1 or 2 since I divided with 3. I think the function is predictable.

Howard: You can test it out. Maybe I made something wrong. (reply to 1390)

Step: what is self.record  dictionary? (reply to 1390)

Steve: I bet you are not using random again and doing your own magic lol

Steve: Ofc it would be more predictable

Howard: Just the place I store the record (reply to 1392)

Howard: like I showed in here (reply to 1388)

Step: howmany record we can store like this?

Howard: mmmmm I am guessing it's predictable if you send the exactly same TON and using same Addresses. (reply to 1394)

Howard: then highly chance get a out put which is the same as previous.

Howard: will always get this error since using the randomInt() I think.       5: { message: `Integer out of expected range }`

Howard: Only the error in the initial Txs, and wouldn't get error even the exactly same Txs!

Andrew: Hi, I'm trying to get started with tact but it fails to build after executing the opam switch create $(pwd) --with-test -y command. The log is as follows:  [ERROR] The compilation of tact.~dev failed at "dune build -p tact -j 7 --promote-install-files=false @install @runtest".  #=== ERROR while compiling tact.~dev ==========================================# # context     2.1.4 | linux/x86_64 | ocaml.4.14.0 | pinned(git+file:///pathtotact/tact#main#0364245b) # path        ~/pathtotact/tact/_opam/.opam-switch/build/tact.~dev # command     ~/.opam/opam-init/hooks/sandbox.sh build dune build -p tact -j 7 --promote-install-files=false @install @runtest # exit-code   1 # env-file    ~/.opam/log/tact-101185-cd38a8.env # output-file ~/.opam/log/tact-101185-cd38a8.out ### output ### # [...] # Error: Library "tact" is private, it cannot be a dependency of a private # library attached to a package. You need to give "tact" a public name. # File "test/dune", line 26, characters 12-16: # 26 |  (libraries tact core sexplib shared alcotest)) #                  ^^^^ # Error: Library "tact" is private, it cannot be a dependency of a private # library attached to a package. You need to give "tact" a public name. # (cd _build/default && .ppx/c3461e88ae1503d575d582eb5874e916/ppx.exe -o bin/main.pp.ml --impl bin/main.ml -corrected-suffix .ppx-corrected -diff-cmd - -dump-ast) # File "bin/main.ml", line 18, characters 16-35: # 18 | let stdlib_fc = [%blob "stdlib.fc"] #                      ^^^^^^^^^^^^^^^^^^^ # Error: [%blob] could not find or load file stdlib.fc    <><> Error report <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><> ┌─ The following actions failed │ λ build tact ~dev └─    When trying to build with dune build, another set of errors appears: https://gist.github.com/arterialist/e9cc1ca1956c0635b3ed9074943c741e  Did I miss some installation steps by any chance?

Alex: Not entirely clear, what do you try to build?  Currently, we discuss this Tact language project that does not need to build separately. Also, an example of the Tact project here.  Maybe I was wrong and you already learn this, then could you share some details of what do you trying to do? (reply to 1405)

— 2023-01-17 —

Howard: Have you checked and maybe help with me working this? @Kingphin (reply to 1348)

Howard: Question: How we can multi-sending the transaction in Tact?  I mean it is based on Gas Cost right? Then I am trying like this: Building a Int => Address mapping list, and using do method to adding one my one to get receiver address.  But you know, it's unrealistic because the gas used is huge here.   Anyone has better solution for this? Since we don't have array in Tact.

Howard: I implement it with 0.01 TON per message Txs, is there any better way to do so? Sending Message and without paying high gas fee.   Heard that using the method I did here, will only able to send with 253 accounts/messages?

Howard: 👍 (reply to 793)

Steve: You are looking at the old tact, that was built using ocaml, new one is written in typescript and doesn’t have anything in common with old one and was designed from scratch (reply to 1405)

Howard: Hi @steve_kite , is this a proper way to send a series of addresses? I noticed that there is a concept in TVM called High-load wallets that we haven't implement in Tact I guess? (reply to 1409)

Steve: High wallet wallets are just generic wallets

Step: how to store unlimited number of address in a array/variable? (reply to 1416)

Step: please send any example (reply to 1417)

Howard: there is no array sir (reply to 1417)

Step: yea something equivalent (reply to 1419)

Step: 😁

Howard: have you checked the NFT standard tho. Let's finish that 😂😂😂 (reply to 1418)

Andrew: yeah, thanks, I was working with the wrong repo (reply to 1406)

Hermès: 🔥

Hermès: Is it okay to get this kind of error syntax warning when trying to read the FunC file we got after compiling?

Steve: This is a bug in func syntax highlighter

Step: should report here? https://github.com/ton-community/vscode-func/issues (reply to 1426)

Steve: Yes

Hermès: anyone know why my Send method can't execute with second one?

Hermès: even I keep mode: SendIgnoreErrors + SendRemainingValue, without in first one.

Howard: Generic means….? (reply to 1416)

Step: normal wallets like v3 v4? (reply to 1434)

Daniil: is there a VS Code extension for tact highlighting?

Howard: Using Rust (reply to 1437)

— 2023-01-18 —

Hermès: anyone has the idea? (reply to 1431)

Howard: It works good for me (reply to 1437)

Howard: What is the minimum TON I should prepare for sending a "Text message"?

Howard: in test-net it sometimes cost me: - 0.0140 ton - 0.0061 ton  - etc

Alex: It depends from time passed from last outgoing message. I think you need read about fees to understand how it works in TON.

Alex: I think this is nice article to learn more.  https://ton.org/docs/develop/smart-contracts/fees

Daniil: where are the docs for Map type? I didn't find any in repo

Daniil: I wanted to know what will happen if some key does not exist in map and I call m.get(key). Will it throw an error return null, or maybe something else?

Howard: thanks. #fee (reply to 1445)

Howard: null   That is why you need signed a ? after the datatype (reply to 1447)

Daniil: okay, and then to check if the value is null, I just need to do: let val: Int? = self.someMap.get(123); if (!!val) {     // is not null } else {     // is null }

Daniil: right?

Daniil: what the !! operator does exactly? just checks if the value is null?

Howard: highlight that it must have the value tho (reply to 1454)

Howard: but you will get compiler error in latest version if you wrote like this

Daniil: so is my code snippet above is correct? I just want to make something if there is no such key in map  let val: Int? = self.someMap.get(123); if (VAL_NOT_FOUND) {     // do something }  how do I write it in tact? (reply to 1455)

Howard: Yes

Howard: But there also has another way I think using function, for example.

Daniil: oh I actually found this example in repo

Howard: But assume the easier way for me, I will using if.

Daniil: so we can just compare with null

Daniil: why I can't make a cell like this: beginCell().storeUint(1, 32).endCell() and only like this: endCell(storeUint(beginCell(), 1, 32))  it's actually painful to make cells that way...

Daniil: also strange that empty message structures are forbidden

Kon: We are working on VScode extension for Tact, in 2-4 weeks will be released, we hope... (reply to 1437)

Steve: If someone knows textmate grammars it would be nice to have tact one since it is a common format for web highlighters

Steve: It would be fixed in next releases, this is just the most ancient part of stdlib (reply to 1463)

Howard: I know it's a non-Tact question but: What will it happen for the smart contract if we using SendRemainingBalance to let the balance of an "active" smart contract balance being zero?   #storageFee, Fee Calculate

Daniil: It'll be frozen (reply to 1468)

Howard: the functions totally can't be called or? What is the definition for it?  I am sure I can send Tx anytime to the contract tho.

Steve: balance would be zero, depending on the size of a contract in a months it would be frozen and things would be complicated, eventually in years it would be deleted

Steve: you can unfreeze contract by sending state init data with latest known data and code, but this could be challenging to recover

Daniil: If it's frozen, you still can recover it by sending a message with code and data to it

Howard: then maybe we should implement msgValue in a standard that I can set 0.001 TON for a contract? (reply to 1472)

Howard: Yes, but then my SendParameters will always need with code and data that will make Gas Cost higher or no? (reply to 1473)

Steve: yes, higher

Daniil: Only if it's frozen (reply to 1475)

Daniil: You don't need to send that every time

Steve: code and data from initOf won't work

Steve: you need data and code that was at the moment of freeze, so it is impossible to infer from just contract code

Howard: And after I testing the code in many hours, you can't with multiple context like this:  mode: SendRemainingValue + SendIgnoreErrors  + SendRemainingBalance ❌  mode: SendIgnoreErrors  + SendRemainingBalance ✅ mode: SendIgnoreErrors  + SendRemainingValue  ✅ (reply to 1329)

Daniil: that's explained in docs (reply to 1481)

Dario: Do not use sum, use | (reply to 1481)

Howard: ok, will try out. But sometimes still get ExitCode 7 if I didn't put the code and data Cells (reply to 1480)

Daniil: can we write a receiver for some opcode, like receive(0x12345678) {} ?

Daniil: result will be same (reply to 1483)

Steve: no, but you can handle it manutally using receive(msg: Slice) (reply to 1485)

Dario: Yes, but in case he do smt like  int mode = 32 + 2; ..... if(stuff){ mode += 2; }  Using | is better since the mode will still be valid (reply to 1486)

Daniil: I think it would be a good feature (opcode receive) (reply to 1487)

Steve: no plans doing so, what's usecase?

Daniil: just easier interaction

Steve: with what?

Steve: just define a message and work with it

Daniil: is there a possibility to define a message with stuff like "Either" in tl-b scheme? Currently, I only saw "Maybe" by just adding ? after the type (reply to 1493)

Daniil: I thought we can't define some kinds of messages using "message" structure, that's why I asked about opcode receivers

Steve: no, either not specifying how to serialize and instead gives you two options

Daniil: okay

Daniil: even if I have defined some Message, I still need to serialize it myself with Builder to use in send(), right? wouldn't it be easier for people to do like this?: send(SendParameters{     bounce: ...,     to: ...,     value: ...,     mode: ...,     body: MyMessage{         someField1: ...,         someField2: ...     } });  Maybe it's hard to implement in compiler, but I'm just saying my thoughts

Howard: is there any merkle root I can use to store User List? Like the example here? https://github.com/a16z/eth-testnet-drop  1/ In EVM, the gas cost is so high. So one of the solution is that we only store the merkle root to save the spaces we need on-chain.  2/ We don't have array in Tact, then how we can store a list that with Users Addresses' data? And search, calling it each by each?   I am thinking to use the Collection+Item design like NFTs. Correct me if I am wrong. Thanks...

— 2023-01-19 —

Howard: Sharing the code I tried to build for lottery for these two days:  1) It included the if... else if statment in practice. 2) It included some  do... until statment in practice. 3) It included the mapping in practice with set get 4) It included some "ABCDEFG".asComment()  in usage.  5) It included the usage for randomInt()  I have identified that it is not efficient to send text messages and move the prize in the same transaction, as it is not predictable for the gas cost. I was using a constant number for it, but it seems that this is not a good approach.  Please note: 1) If you want to trigger two 'Send' methods in one 'Receive' method job, you should not add 'bounce: false'. The second 'Send' method will not be triggered if you do so.  2) The code still has many bugs and not perfect. Just sharing it for community.

Howard: Is there a way to verify the legitimacy of people claiming to be from the TON Foundation?

Anthony: Can you share the account name? (reply to 1502)

Howard: I am thinking how to search a "unlimited" list in a mapping.... like member_index: map[Int]Address  If I wan to search an Address in the list, I have to use a do... statment. Which is not scalible since the search from 0, 1, 2...etc

Step: use address as key? 😅 (reply to 1504)

Howard: @ton-community/tx-emulator has been rebranded into @ton-community/sandbox and significantly improved!  It now uses the new ton-core under the hood and is compatible with all the APIs that it provides, making the creation of smart contract wrappers easier than ever!  More importantly though, the blockchain-experimental features have been merged, so you can now emulate whole chains of transactions and even emulate interactions with existing smart contracts from real networks (both mainnet and testnet)!  Together with it we released another package, test-utils, which, along with the new features  of sandbox, significantly simplifies testing of systems of multiple smart contracts.  Check out the examples provided together with sandbox to see the intended way to use it.  Please note that this tool is still in beta, but we would love to hear any feedback from you!  Also, stay tuned for more detailed tutorials for using this tool! (forwarded from TonTech)

Howard: should we update in Tact-template?

— 2023-01-20 —

Alex: @steve_kite could you please add “tact-hello-world” branch in tact-template? I want to push a special version of tact-template there. In this version contact.tact will be empty and need to be restored with Tact hello-world guide.

Howard: Yes, I have more feedback on this.   I am currently dealing with transferring multiple addresses in a single transaction. It can be difficult to predict the current balance that the Vault contract still has.   This can make it challenging to work with, especially if we are dealing with a Staking or Vault contract that needs to calculate a fee share.   I highly recommend that we include a syntax in the standard libraries that shows the balance of TON that a contract has (after the current message and subtracting storage fees, etc.). (reply to 1328)

Howard: OK, I crossed the issued there, I took the example and gave a buffer that in there.

Howard: Question: How do we measure the gas cost in the string type on body field?   Is it gas costly? I think I want to send the message to all accounts that hit lucky numbers tho.

Howard: 0.003604 0.003740 (forwarded from Howard)

Howard: Testing some String message in Testnet, wondering how I can better to set a minium Gas setting for sending the text.

Howard: You can send just 0 (forwarded from Andrey Tvorozhkov)

Howard: And use sendrawmessage mode to pay for fees (forwarded from Andrey Tvorozhkov)

Howard: Hi @steve_kite, have we implement same feature in Tact? Sorry, not the expert in FunC

Howard: https://github.com/ton-community/tact/blob/428fa54716e77656a40fb44690512c7a417eebdb/docs/stdlib.md   Because I tested in SendPayGasSeparately already, it seems not what I want neither what he mentioned there.   Seems out of my knowledge or just Tact haven't implement yet.

Alex: If you mean, "can we send message with sendmode = 0", that is default value in Tact, as I remember. (reply to 1517)

Howard: Seems can't. Will got 'Action failed' if I doing so. (reply to 1521)

Kirill: Updated the website with a link to docs: https://tact-lang.org  What else should we put up there? Please share feedback in @tactlang (forwarded from Tact Language is for TON)

Alex: Actually from definition of SendParameters,  it's not necessary to declare mode = 0: struct SendParameters {     bounce: Bool = true;     to: Address;     value: Int;     mode: Int = 0;     body: Cell? = null;     code: Cell? = null;     data: Cell? = null; }  About your result, maybe need to create separate contract to check sending message with mode=0. I think it will work fine. (reply to 1524)

Howard: Thanks Alex!

Eugene: There is a small typo that might confuse someone on the new docs website — missing "r" in "yarn"  I wanted to send a pull request to fix that, but the docs I see on GitHub differ from the docs I see on the new website, why is that? (reply to 1525)

Andrew: docs are located in this repo: https://github.com/ton-community/tact-docs (reply to 1530)

Eugene: Oh, now I see, unevenjoy beat me to it by 10 minutes) Thanks (reply to 1531)

— 2023-01-21 —

Howard: anyone building the project in latest test library tho? I am not TS expert but learning on it 🤣   Otherwise I can only test the contract in test-net manually, it is not reliable for edge cases I think.

Howard: How we can trouble shooting the error happened with ErrorCode5?   Since it "sometimes" shows up in my contract......

Maksim: receive(num: String) {         let rand: String = random(1, 2).toString();         if (rand == num)  Invalid type "String" for binary operator "==" how should i check strings for equality?

Chris: Where can i find lang support for vs?

— 2023-01-22 —

Howard: Put it as Slice data type first. The do the comparison.   Or put String to Cell, by using “Text”.asComment() (reply to 1542)

Un gars bien: Got answers to this? Would like to know also. (reply to 1499)

Maksim: i tied to defince num_cell and rand_cell like: let num_cell: Cell = num.asComment(); and compare them but it makes the error too

Howard: if you want to do the comparison in Int, why don't you using Int still? (reply to 1549)

Alex: I think for Cell, Slice we should use hash() function to compare them(inherits from FunC). But, I’m not sure about the idea of how it should work in Tact.

Howard: Checking in test-library, should we write the  export ourself for test initially??

Maksim: cause i want to recieve a number and compare it to random number😁 and there is no String.toInt() method (reply to 1550)

Maksim: wow this worked, thanks! (reply to 1551)

Alex: export is ordinary js/ts keyword for modules. You can include(import) functions you need from another module, files in this way. (reply to 1552)

Maksim: i have one more question: why when i run contract.deploy.ts for several times for the same contract it generates the same address for the contract? shouldn't address be new every time i run contract.deploy.ts?

Howard: nah, I mean those modules in contract folders in contract https://github.com/ton-community/sandbox/tree/main/examples/contracts  are the export modules that we should write ourself? To define the script we want to test, right? (reply to 1555)

Alex: It depends on what you declared in contract.deploy.ts.  The address will not change if you have no unique updated data in init() function. (reply to 1556)

Alex: I’m trying to deploy jetton.contract, placed in this project.  Got this error output when running yarn deploy :   $ ts-node sources/jetton.deploy.ts /Users/alexg/Dev/tact-jetton/node_modules/ts-node/src/index.ts:859     return new TSError(diagnosticText, diagnosticCodes, diagnostics);            ^ TSError: ⨯ Unable to compile TypeScript: sources/output/jetton_SampleJetton.ts:771:105 - error TS2339: Property 'vmLogs' does not exist on type '{ success: true; gasUsed: bigint; stack: TupleReader; exitCode: number; }'.  771             throw new ComputeError(SampleJetton_errors[res.exitCode].message, res.exitCode, { logs: res.vmLogs });  @steve_kite can You suggest how to solve this issue?

Maksim: @howard_peng are there templates for standard contracts like NFT, wallets, jettons, etc?

Lev: There's Howard's NFT implementation: https://github.com/howardpen9/nft-standard-tact (reply to 1560)

Lev: Didn't see jettons, vaguely remember seeing wallets

Howard: Jetton, Yes.   NFT standard, No!   I still can't figure out the String data type store in Collection/NFT Item..... (reply to 1560)

Howard: can take a reference for Jetton implementation from: https://github.com/ton-community/tact/blob/main/examples/jetton.tact

Maksim: so how should i create a message that contract will recognize as a message of a specific type? (reply to 1564)

Howard: you can check the TS file located in output folder

Howard: Tact libraries will generate for every Contracts by each

Chris: did anybody start create extension for vs code?

Alex: Yes, I saw footstep in progress. But didn’t see for JetBrains. (reply to 1569)

— 2023-01-23 —

Howard: Hi all, has anyone tried to implement the TypeScript (TS) file we got after compiling in the SandBox?  Like this line it was routed from the contracts folder that we wrote previously.  I think what he did is exactly what we have already in the output folder.

Howard: I think Tact compiler can integrate it by just change a bit for output file?Then everyone can benefit from that without rewriting modules for test themself again and again.

Howard: Example, I think there has something similar part we can use:  Left: My new module for test libraries - SandBox  Right: The output TS file from Tact - by @Steve_kite

Alex: @steve_kite Is it possible to solve this issue currently, or does something need to do with ton-tact library? (reply to 1559)

Steve: tact works just fine, ask questions to sandbox people

Steve: you won't be able to write "classes for testing" by yourself

Alex: What about jetton.tact, is it possible to deploy current jetton.tact contract? (reply to 1577)

Steve: Tact VS Code Plugin  Official Tact Plugin: https://marketplace.visualstudio.com/items?itemName=ton-community.tact-vscode  We decided to use a pink unicorn for file icons 🦄 (forwarded from TON Development News)

Steve: should be able to, but haven't tested it yet (reply to 1579)

Kon: How about footstep progress then? Double work... (reply to 1580)

Steve: Zero people contacted me about vs code plugin

Kon: If footstep is approved, what is the reason to contact?

Steve: I have approved nothing, I recommend you to contact whatever is doing so

Kon: From now assume that footstep is disapproved by you or we will continue own development process?

Steve: I am do not know anything about footsteps

Kon: Here (reply to 1570)

Kon: Have we any reason to do the same work?

Steve: I created a grammar since I needed it for docs, once I finished it we packed an extension too

Steve: Reason? Nothing existed when we started

Kirill: It is good that we have a functioning extension

Kon: We need to decide who will continue at all, we have footstep and repo with your project in the ton-community

Kon: We have planned to publish our release in 1-2 weeks, as it was described in the footstep, for now we don't know continue or not our progress...

Kon: The problem that it is not all that was planned in footstep (reply to 1592)

Andrew: I wonder if ton society moderators can handle this

Kirill: If Footstep was approved it will be payed out for

Kirill: maybe some existing code can be reused in the work on the Footstep according to the licensing

Kon: We can try to merge in the ton-community repository, but we need to be sure that we can continue and don't do the double work... Because it is no the reason to spend time on the same task...

— 2023-01-24 —

Howard: Do you mean Tact can work with its test libraries, which works fine without the need to use Sandbox? (reply to 1577)

Howard: need more support with test libraries, I can't understand the difference for using Jest or Sandbox

Howard: from contract testing safely, what should we do? Just want a easier way to write the test cases.

Daniil: Sandbox is for working with smart contracts, and jest (or mocha) is just a general testing library (reply to 1601)

Steve: What can be easier than auto generated snapshot testing?

Howard: Sorry, more clarification. What should I do for multi-calling?   My structure is that the one receive method in contract A will call to a second contract. And for now, it doesn't show on the Snapshot area.  It would be great if you could share the test cases in Jetton Standard b/c it us a mutil contact structure as well. (reply to 1604)

Steve: So, just create a second tracker?

Howard: What I mean is for the big project that will bind the call methods to create the new contract like NFT Collection -> NFT Item contract.   1/ [Red square] if I build the new It statement, the variable of owner will change in a new one.   How to keep the single address as owner and keep the authority all the time.   2/ [Orange square] the first contract's "New" statement will pass the message to my UserRecord contract(the second one); I will need to keep the parameters and status to track contract 1&2's reactions.   Since I will get the reply message from Contract 2 sending to contract 1.   My question is, how can we track those series of messages trigged by this Tx?  ContractA: receive(A) — calling to --> ContractB: receive(the A plus)  — calling to —> ContractA: receive("any feedback message")    3/ How we fetch the balance of the contract all the time(like monitoring each Txs cost, and the remaining balance for an address)   Since I always tested in production test net, now I am facing the issue that the contract might fail “at some times” but works successfully by chance. (Yes, the opCode is the same, but the result might be failed based on different sizes of TON) This is why I am researching how to write proper test cases.

Alex: Can anybody else try to deploy jetton.tact. I'm not sure we have problem in Tact compiler, but really stuck with this issue. (reply to 1581)

Andrew: Hello, just trying to use storeSlice according to docs https://docs.tact-lang.org/reference/cells#builderstoreslice  How I expect it should work (case 1):   let message: Cell = beginCell().storeSlice(msg).endCell();   Actual result:    Error: Line 28, col 33:   27 |             let to: Address = self.owner; > 28 |             let message: Cell = beginCell().storeSlice(msg).endCell();                                        ^~~~~~~~~~~~~~~~~~~~~~~~~~~   29 |  Type "Builder" does not have a function named "storeSlice"   How it works instead:  let builder: Builder = beginCell(); builder = storeSlice(builder, msg); let message: Cell = endCell(builder);   Is it expected behavior in case 1 or what I’m doing wrong? maybe it's a bug  e.g. msg.asCell() works as expected.

Steve: this would be updated in next release, but i am advising against using builders at all

Andrew: why are you advising that? What's the issue with builders? (reply to 1611)

Steve: Because it is error prone and better to use automated solutions

Andrew: what the best way to write next code in Tact?    cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();   var msg = begin_cell()     .store_uint(0x10, 6)     .store_slice(owner_address)     .store_coins(0)     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_slice(sender_address)     .store_ref(msg_body_cell)     .end_cell();   send_raw_message(msg, 64);   I rewrote it like this, based on this example https://docs.tact-lang.org/guides/send#send-typed-message   struct Responce {     sender: Address;     msg: Slice; }   send(SendParameters{                 to: to,                 value: 0,                  mode: SendRemainingValue + SendIgnoreErrors,                  bounce: true,                  body: Responce{sender: ctx.sender, msg: msg}.asCell()             });   However getting the same error:    Error: Line 34, col 23:   33 |                 bounce: true,  > 34 |                 body: Responce{sender: ctx.sender, msg: msg}.asCell()                              ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   35 |             }); Type "Responce" does not have a function named "asCell"   How to convert struct to Cell any other way? (reply to 1611)

Steve: It is toCell, since it is not a cast but a costly operation

Daniil: Oh, so there is actually this thing 😳 Nice

Steve: Btw there are an example wallet-opt that do some mangling of slices that could work for you, but I recommend not to play around with cryptic code with slices, but just use structs and messages

Andrew: tnx (reply to 1617)

Steve: Also Slice.asCell and Slice.asBuilder functions exist for easy conversion

Andrew: sent PRs to fix typos

— 2023-01-25 —

Howard: nice nice (reply to 1619)

Howard: new Docs website is legit

Howard: I am building a notification for users who win a prize. However, there is a limitation for single transaction cost in TVM (1 TON).   My question is, how many messages can I send to 100+ wallet addresses without incurring additional gas costs?   *I am unable to test this in test libraries and cannot generate 100+ addresses on the test-net at this moment. If you know how to achieve this, let me know.

Steve: Better not to, ask each user to withdraw their balance

Howard: This is only sending Notification. Then they can come to call with Website to claim reward. Not airdrop the reward then. (reply to 1624)

Steve: It is the same price for “notification” and for payout

Steve: Minor upgrade: fixed builder method signatures https://github.com/ton-community/tact/releases/tag/v0.8.8

Maksim: by the way, how to use textmate grammar in IDE? (reply to 1627)

Andrew: After update getting error on build    $ tact --config ./tact.config.json node:internal/modules/cjs/loader:998   throw err;   ^  Error: Cannot find module './funcfiftlib.js' Require stack: - /Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/dist/func/funcCompile.js - /Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/dist/pipeline/build.js - /Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/dist/main.js - /Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/bin/tact     at Module._resolveFilename (node:internal/modules/cjs/loader:995:15)     at Module._load (node:internal/modules/cjs/loader:841:27)     at Module.require (node:internal/modules/cjs/loader:1061:19)     at require (node:internal/modules/cjs/helpers:103:18)     at Object.<anonymous> (/Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/dist/func/funcCompile.js:10:24)     at Module._compile (node:internal/modules/cjs/loader:1159:14)     at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)     at Module.load (node:internal/modules/cjs/loader:1037:32)     at Module._load (node:internal/modules/cjs/loader:878:12)     at Module.require (node:internal/modules/cjs/loader:1061:19) {   code: 'MODULE_NOT_FOUND',   requireStack: [     '/Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/dist/func/funcCompile.js',     '/Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/dist/pipeline/build.js',     '/Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/dist/main.js',     '/Users/andrewpolyansky/w/tmp/tact-proxy/node_modules/ton-tact/bin/tact'   ] }  Node.js v18.12.1   Using tact-template (reply to 1627)

Hermès: 👍 (reply to 1623)

Steve: my bad, will fix now

Steve: try https://github.com/ton-community/tact/releases/tag/v0.8.9

Andrew: working 👍 (reply to 1632)

Howard: then usually speaking, what is the better usage to "remind" each wallet addresses? My Txs was tagged in SPAM now (reply to 1626)

Steve: not doing so

Maksim: that’s because of small amount (reply to 1634)

Maksim: what’s the problem they tagged SPAM? it’s just a tag in tonkeeper, but your txs fulfill their purpose: they inform users😁

Maksim: the only problem i see is that scammers can send same notifications to users with the wrong website like “you win! come to scammer.ton to claim your reward” and steal users funds

Hermès: that make sense

Howard: yeh, then I will remove them. Was thinking it is helpful to remind the users on-chain. (reply to 1639)

Andrew: Is it possible to set ‘op’ id in tact instead of random generated?  For example I want op=1 for ‘receive(msg: myMessage)’

Steve: It is not random

Howard: 'op’ id? (reply to 1642)

Steve: But you can overwrite it in declaration message(0x1)

Andrew: Got it, thanks! (reply to 1645)

Andrew: Op means operations in func internal messages (reply to 1644)

Lev: Btw would be interesting to know the demographics of the TON community

Lev: Like what's the percentage of 239 people lol

— 2023-01-26 —

Hermès: Is it possible to implement Gaussian distribution in Tact?   - How we describe log function with Numbers? - How we describe Pi in Tact?

Hermès: This is the example for Gaussian distribution in Solidity (reply to 1681)

Hermès: OK, this is a successful implement for sqrt in Tact. ❤️ (forwarded from Hermès)

Andrew: don't use sqrt based on loop  best practice: https://github.com/TonoxDeFi/open-contracts/blob/main/contracts/math/math.func#L26 (reply to 1685)

Hermès: But I need it because I am coding in Tact. Maybe will have better practice in standard libraries by Steve. (reply to 1686)

Hermès: and Log by the way. I am testing in my own way to achieve it. But seems not safety enough.

Hermès: 🦄

Andrew: this makes me think - would it be beneficial to have an inline func in tact, in analogy to c++ inline assembly? (reply to 1687)

Andrew: also, what happened to @steve_kite? He isn't there anymore

Alex: It's ok, he leaves chat every time he tries to concentrate on his task. (reply to 1691)

Step: https://github.com/ton-community/tact-docs project website is still tact-docs.vercel.app it should be https://docs.tact-lang.org ?

Hermès: yeh should be this one https://docs.tact-lang.org/reference/random (reply to 1693)

Hermès: Oh, hi, I got the solution. By using `random(max, min)` I can more easily to pick a ranges and follow the Gaussian distribution. (reply to 1681)

Andrew: well... (reply to 1692)

— 2023-01-27 —

Step: https://github.com/ton-community/tact This repository has been archived by the owner on Jan 26, 2023. It is now read-only.🙊

Andrew: new repos are here - https://github.com/ton-core (reply to 1698)

Step: every 2 weeks projects being moved to new repo 🤣

Alex: Has somebody else noticed new build issues with the last Tact 0.8.10?  Tact compilation failed Error: Line 40, col 17:   39 |             send(SendParameters{ > 40 |                 to: msg.responseAddress,                         ^~~~~~~~~~~~~~~~~~~~~~~   41 |                 value: 0, Invalid type "Address?" for fields "to" with type Address in type SendParameters

Howard: You can't put ‘Address?’ data type in there. Need adding as ‘Your Address!!’

Alex: This error appears because the new type checker does not allow Address? for send function. Type of msg.responseAddress inherits from the definition of messages for jettons in @stdlib/jetton  What do you think, Should I create an additional variable, that will have a strict Address type and read there before using it as to parameter of send() function?

Alex: I see now, I meant to add !! operator. Thank you, fixed. (reply to 1702)

Howard: What is the usage for ‘now()’ with logical time?    What is the time frame for 1hr, 24hour or 7days?

Seitaro: logical time is not in any way bound to unix timestamp (or "real" time), LT is merely way of ordering entities on TON (entity with lower LT can not depend on entity with higher LT) (reply to 1705)

Howard: https://docs.tact-lang.org/reference/common#now

Howard: How can I adding it if I want to set a duration for 24hr

Seitaro: now() returns unixtimestamp, but you asked about "logical time" in your question (reply to 1709)

Seitaro: cur_lt() returns logical time and there is no strict correlation between span in "real time" and span in "logical time"

Andrew: how to iterate on map keys and remove some?

Howard: adding in map is like  ->  self.map.set(value1, value2) (reply to 1712)

Andrew: but how to remove data? (reply to 1713)

Howard: I usually just put a new value in value2 to overwrite it. (reply to 1713)

Andrew: also guess it is possible to overwrite whole map with new map like this self.map = newmap;   How do you iterate on map without knowing keys? I need to remove some obsolete keys on request the value by which they need to be deleted stores in value2 (reply to 1715)

Andrew: Can any one explain on example what !! operator do? I don’t understand   > !! suffix operator - enforce non-null value, defined only for nullable types.

Howard: force the value being have the value in my cases ✅ (reply to 1718)

Andrew: so what will be difference if I return .get(address) without !! in else case? (reply to 1720)

Howard: maybe get null? for my cases, I don't want that happend

Lev: I think it would be a different type

Lev: A nullable type vs Int

Andrew: But you checked in if case for null and return 0.   So it is imposible to return null in else case and then question even if I return enforced value with !! where does this value come from? (reply to 1722)

Lev: Even if you checked for null using an if, it will be of type Int? (reply to 1725)

Lev: And it should be just Int

Andrew: so if write the same code as Howard sent but without !! return type of the function witll be Int? (reply to 1724)

Lev: Yes, probably

Andrew: got it, thanks

Howard: Using standard trait like Stoppable can save the gas or just for safety purpose?

Andrew: Is it possible to convert Slice to struct type?

Andrew: It just throw error on any receivers where requireNotStopped() was called and stoped = true. To set stoped neeed to send message with "Stop”.  Code here https://github.com/ton-core/tact/blob/cddf370adcce09c920da51ab06614d736c79c40a/stdlib/libs/stoppable.tact (reply to 1731)

Andrew: Has anyone encountered the problem of comparing two numbers?   Code in tact:    let a: Int = 1;  let b:int = 2;  let c:int = -1;  if(a == b) { // do smtg }    Generated code in func:   int $a = 1; int $b = 2; int $c = (-1)    if (($a == $b)) {     }   Leads to an transaction error  9 “Cell underflow”.   I suppose generated code should looks like:   int $a = 1; int $b = 2; int $c = -1   if ($a == $b) {     }

— 2023-01-28 —

Howard: this is a great question. But since I think most of people learned the Tact wouldn't be able to write in FunC. (reply to 1735)

Howard: But then your error code might not have occurred because the format of FunC files looks different. Maybe you need to debug by looking at your full .tact file first. (reply to 1735)

Howard: what is the loadTupleXXXXX and storeTupleXXXXX usage for our output modules in TS?

Andrew: Yep, the problem was something else. I haven’t figured it out yet, but looks like it’s because I compare int and uint (reply to 1737)

Andrew: What explorer is this? (reply to 1740)

Howard: https://testnet.ton.cx/address

— 2023-01-29 —

Howard: What is the difference for & or || here means in TLB Shcema.  Same as TEP62 for NFT standard. Some using & some use ||   I followed the code they defined to claim previously. But I am thinking this is not correct at this moment on my Tact code.

Howard: 🫥🫠 why it is on the first

Howard: I can't believe the meta.json string is on the prefix 😂

Daniil: & is bitwise AND (reply to 1744)

Howard: Anyone figure out why / how to combine two Slice? (reply to 1750)

Howard: hey guys, I solve this!

Howard: by putting the String data type combine, you have using StringBuilder to convert to Slice data type first...!

Alex: Added tact.jetton demo project with deployment. Example of deployed contract - here. Created from the original jetton.tact example without significant changes, but added “!!” operator.

Hermès: LFG

Howard: is there the group for TonKeeper? Testing in testnet of getgems, and can't scan to log-in on Macbook M1   Either the original one or TonConnect 2.0

Spite: https://t.me/tonkeeperdev

— 2023-01-30 —

Howard: so what will it makes differences in Tact code? (reply to 1751)

Howard: Got this error since I tried to test in my Transfer method in second time after I mint the NFT Item. ExitCode9 usually means my Tact code is not correct tho?

Daniil: These are for calculating the opcode tags (reply to 1759)

Daniil: You should just use the results

Howard: Thanks Daniil! I am trying my logic in Transfer that, since my NFT still can't trigged the Transfer method through TonKeeper. (reply to 1762)

Howard: Here is my code, the initial Transfer that trigged by minting process is fine. It can shows on my wallet.  But error code:9 pop at second timing transfer, which is known as  msg.forward_amount > 0 situation.   (the line of code I highlighted)

Howard: but since the error code is only pop with 9: Cell underflow, and it just out of my knowledge to debugging or change any side of the code. I checked with Jetton template already.    Need any other suggestion to find the way out (reply to 1764)

Howard: except with TonKeeper, where can I trigge the Transfer method on website tho?

Howard: thinking maybe the parameters that TonKeeper passed is not on the TEP62.   That is why the receive method I prepared was not matched and always cause Cell underflow ExitCode 9 (reply to 1764)

Andrew: check tonkeeper's sources to figure out the parameters it sends (reply to 1768)

Howard: Ohhhh. Good advice. Thanks.  But any else I can able to transfer NFTs? TonHub seems didn’t support showing NFTs. (reply to 1769)

Andrew: You can try OpenMask or MyTonWallet they show NFT or you can write TS script by yourself and send msg. (reply to 1770)

— 2023-01-31 —

Howard: https://github.com/tonkeeper/wallet/blob/5ff02dc85b0ce486b7764be40a9ca2d77aa821fe/src/store/models.ts#L59 (reply to 1769)

Howard: any example that you know is calling with NFTtransfers? (reply to 1769)

Andrew: unfortunately no (reply to 1774)

Alex: Are you trying to use API for Transer NFT or something else? (reply to 1774)

Andrew: found one I think https://github.com/disintar/sale-dapp/blob/3b625f2cf2f58709934be86ee62ded3e8ec71c51/dapp/src/popups/DeployOrSend.js#L672 (reply to 1774)

Howard: Both, just want to figure out what kind of data parse to the contract.   And why my NFT contract can't trigge the Transfer (reply to 1776)

Howard: I think queryId is Int?  Which means might be null? (reply to 1773)

Howard: Yeh, similar, but why he set a 228? (reply to 1777)

Howard: 🥺

Hermès: how can we make sure the SmartContract Notification will not be tag as a SPAM on TonKeeper?

Alex: Steve wrote early. This means - it's bad behavior for your dApp, smart contract. What for you want use it?  But generally, in case of Tonkeeper it depends on their rules. Value of amount and perhaps exceptions for some TON addresses.

Hermès: it's just a message to remind the users what status they got

Alex: Why do they need this notification? Can you implement this feature with get methods and show this on request from the user?   For example, in this way wallet's balance displays to the user, and we have no messages-notifies on balance update events.

— 2023-02-01 —

Hermès: Sounds perfect, but with get functions means? Since my logic is that "One wallet can register with multiple-times"  And I think sending message is one way to improve the UX. Maybe there has better solutions. (reply to 1787)

Howard: Hi all, I am passing a "Full mapping" into a new contract.   There wasn't any error during the compile, but once I execute the Tx, it will get a Type Check Error message.  Exit Code 7

Howard: Since the example has the same syntax, I was just wondering if it is safe and functional. Because my mapping might be very large.  cc @steve_kite (reply to 1797)

Howard: and I am still working on this.... LFG LFG.... (reply to 1773)

Alex: But what is the idea? I'm using TON wallet for year and looked into transaction history a few times. Much more reason for me was that I tested wallets. And I believe, that most part of users just want to swipe off transaction's push notify(if it's not about the incoming huge amounts👀🤩) and almost never look at their transaction's history.  Please, note, that I have practical experience only in realizing smart contracts for learning purposes and never realized my own product for TON.  From what I know about classic development, I see following ways:  1) To make own Web client(mobile/desktop). That will display your contract's with UI you want. Something like a blockchain explorer adapted to your contract and viewing that's content according to your idea.  2) To create something like(or exactly the same) NFT item. Users can see this on their wallets from blockchain explorers and some wallets. You can try to implement your updates via NFT-editable.  For example, GetGem's Easter eggs event was implemented with NFT. I tested it, and I've never got any notifications in the blockchain. But I have a lot in the telegram bot or in their marketplace. Another thing is that I could open my wallet when I wanted and check the "status" of my egg.  That's what I meant, hope it looks more clear for now. (reply to 1796)

Alex: Is it possible to exclude maps from your solution? Large maps + Tact really looks like double trouble currently. It really useful for Tact improvement in general, I think..🌝 However, I would prefer to begin from the solution without maps and use an address mechanic similar to how it works in the calculation for messages' destination for jetton wallets. (reply to 1798)

Howard: do you have example for use an address mechanic similar to how it works in the calculation for messages' destination for jetton wallets?   The only way I think possible is writing a for loop read each line of data in the mapping. But again, it is not reliable since the gas cost is not predictable, which means your Tx might failed in a sudden the bounced. (reply to 1801)

Alex: Briefly idea with good explanation in this video - https://www.youtube.com/watch?v=oEO29KmOpv4&t=309s  And more accurate, here. (reply to 1802)

Alex: Every time you realize that you need a big loop for your infinity-long list in the TON monolith-service-like contract - something went wrong🙂. (reply to 1802)

Howard: Got it. Like one NFT Item is one contract. Because creating a contract is cheap in TON (reply to 1803)

Alex: Not only because of cost, but also because it will not create a bottle-neck for your service in your contract. (reply to 1805)

Howard: and data accuracy/usability right, I remember.

Steve: I just published a small roadmap: https://github.com/ton-core/tact/blob/main/ROADMAP.md  I am welcome to hear what you are missing

Steve: I just added importing func code, that could help you writing something in plain func and keep working mostly in Tact. For example, you can create a jetton/nft content cell as you wish.

Steve: Tact v0.9.0  This release is significantly improves gas usage and compatibility with func by allowing importing func files into your Tact contract!  This line would append contents of this file to the begining of Tact-generated file:  import "./native.fc";  Then you can declare native functions in tact that uses your func code.  Some caveats: func imports are not supported, order of imports are not guaranteed, func syntax is not verified (this could lead to cryptic errors), type safety is reduced and you have to be careful with declaring native functions in tact.  https://github.com/ton-core/tact/releases/tag/v0.9.0 (forwarded from TON Development News)

Howard: Followed the article, it shows Internal Message Tx support with different message bodies, then why kind of condition will make Exit Code 9 usually? (reply to 1760)

— 2023-02-02 —

Alex: Only reason of Exit code 9 - Your contract triyng to read bits or reference, but there was not any data. (reply to 1815)

Howard: hmmmmm got it

Howard: Hi everyone! I just fixed the issue for the previous version of the NFT standard in Tact. Now, you can successfully mint NFT Collections with NFT Items, since after you get the NFT Item in your wallet, you can transfer it through TonKeeper smoothly! 💪🏽❤️  https://github.com/howardpen9/tact-nft-standard  - There are example URIs for the image content, so you can change it to whatever you need! It's an off-chain content following the TEP64 metadata.  - For the minting process, you need to know that the is_initialized field is defined when the contract is deployed. Once the Item is being minted, it should change to true. (TEP-62)  - The Royalties Fee part has also been successfully implemented following TEP-66; it is now set to a default of 35% in the deploy.ts file. You can change it to whatever you want.

Steve: There is fun createOffchainContent(link: String): Cell in @stdlib/content now, no need to do this hacks for content link

Steve: Just added an ability to collect logs from contracts

Steve: TON Emulator v2.0.0  Added: * Ability to track VM logs of any contract  Breaking changes: * Tracker now returns transactions, instead events * events() renamed to collect()  https://github.com/ton-core/ton-emulator/releases/tag/v2.0.0 (forwarded from TON Development News)

Alex: Can you clarify, if it is some special idea to exist these various output files? Especially, interesting, how developers can use *.abi and *.md files?  For example, abi, as I understand it, is something Etherium legacy approach. I want to get a general idea directly for TON clear,  to understand what I can tell to newcomers about this(instead redirect them to the Ethereum source).

Lev: *.md — the documentation, *.abi describes the interface of the smart contract (operators, getters, types)

Alex: Thank you, but question - how developers can use it on practice? Where from they should to know this? What for these operators, getters, types generates?  I need little bit more detailed example of using.

Lev: I think you can just guess the format from the file — depends on what you want to do with it. There's a type called ContractABI, you can look at it, too

Steve: Proposal for formal ABI format was rejected, currently its format is defined only by Tact project. It is used to generate bindings and you can use it to generate UI for contract.

Kon: https://github.com/ton-blockchain/TEPs/pull/108 is this, right? TLB then? (reply to 1826)

Kon: Just your idea to use ABI for UI generation really useful...

Steve: You can do it now, tact even have tools to generate bindings for non-tact contracts and tact self-report it’s abi via get method and ipfs link

Steve: misread message, no, i am not interested in implementing foreign ideas on basis of random ideas of strangers on the internet. JSON is fine, future compatible and does it's job well (reply to 1827)

— 2023-02-04 —

Howard: what will happend if we set a op code in 0x1 for example?  For most of cases, we don't need to set the code of it. (In here, we need to follow the TEP62)   1/ Does the length of opCode here is having the limitation?  2/ What will happened if we set with 0x1 or 0x00000001 (8 digits)

Steve: It is uint32

Alex: Maybe my thoughts will be helpful:  I saw two cases in general in FunC contracts: 1) Messages bounced back if it something not expected by contract with funds - fees value. It's good practice and user friendly. 2) Messages just deliver to the destination contract, and then contract won't do any actions.  I'm not sure, what the current logic for the Tact compiler in general, but when I sent in testnet something unexpected by recievers it's just bounced back. It look like, all messages(op-codes) we not expected with receivers bounced.  And you can try send any opcode via ton library.  here not the best😅 example of how to put opcode in Cell msg:   //TL-B mint#01fb345b amount:int257 = Mint     let msg = beginCell().storeBuffer(Buffer.from("01fb345b", "hex")).storeInt(amount, 257).endCell(); (reply to 1836)

Steve: tact by default bounces unknown messages, but there is a receiver bounced(msg: Slice) that allow to handle bounced messages

Howard: yeh, it works. Even 0x1 is works in Message, as Steve mentioned, it's just a uint32.   In theory you can set what ever you want, if your receive method is not against with any TEP I think.   (forget the error code...

Lev: I feel like maps are under-documented: they're not mentioned in the standard library article Like, for instance, how do I create an empty map?

Steve: You just declare it

Steve: It is confusing but i don’t know a better way. On func level empty map is just null.

Lev: In a contract initially yes, but I need to set it to an empty map afterwards (reply to 1844)

Steve: Hm, should add clear method then. Please, file an issue

Steve: Btw right now you can declare local variable of a map and then assign it to a contract one

Lev: How do I declare it?

Steve: With maps the biggest issue is that you can’t iterate. While it is quite expensive operation that could lead you to out of gas situations, it is still needed sometimes.

Steve: let newMap:map[…]…; (reply to 1849)

Steve: You can also compare maps for equality! oldMap == newMap

Steve: But this need investigation, I am not sure if it could return false-negative results

Steve: File an issue

Lev: Done 👌

Steve: Will fix once I get time

Steve: Actually i have fixed it: https://github.com/ton-core/tact/releases/tag/v0.9.2

Lev: Ah, thanks!

— 2023-02-05 —

Howard: From a security perspective, does that mean that "if I don't share my .tact file, no one can find bugs in my code?"  - The .ts file helps us interact with the smart contract without getting our hands dirty, as it is generated from the compiled output. It's not possible to reverse engineer the original logic of the code, similar to the .byte code in Solidity.  - To ensure that the receive method is not being called by anyone, it is correct to add as many require statements as possible. However, this may increase gas costs. I am currently unable to determine the difference as I have only tested on the test-net.

Andrew: reverse engineer always wins, it's important to keep that in mind (reply to 1863)

Alex: https://github.com/ton-society/ton-footsteps/issues/145 🤩

Alex: https://github.com/ton-core/tact-docs/pull/5 guides PR.

— 2023-02-06 —

Hermès: from my understand, we can implement PaymentChannel in Tact as well right? Since it is interacting based on Signatures

Steve: Yes but payment channels are basically useless.

Daniil: Payments channels in ton is just a standard, so you can implement it in any language you want (that works on TVM) (reply to 1870)

Steve: It could only useful for some use cases where user is going to spend a lot small amounts of coins. I can’t make up a good example

Steve: Also you can’t withdraw anything until channel destroyed

Daniil: Why? It's similar to bitcoin lightning network which is pretty popular and used by a lot of people (reply to 1871)

Steve: Bitcoin has 20min transaction time, ~1$ fees

Steve: Ton is fast and cheap

Daniil: Not that cheap if you want to perform a lot of transactions

Steve: Yes but why?

Kirill: What application of the bitcoin lightning network have you personally used in the last 3 months? (reply to 1875)

Steve: I know one use case - marketplace arbitrage

Steve: But cexes doesn’t support now and you still need to withdraw from time to time

Seitaro: It is not standardized, btw (reply to 1872)

Daniil: I don't use Bitcoin at all (reply to 1880)

Daniil: Another example can be gambling app which processes all bets through the payment channel so that user can't get his withdrawal declined (reply to 1881)

Steve: No, it won’t work

Andrew: Ads? (reply to 1873)

Daniil: Hm? The owner of such app can only scam user on his last bet, not the whole balance (reply to 1886)

Steve: You need each user to setup a payment channel which has more gas cost than simple transfer

Steve: You can check tonbet in my github

Steve: It scales infinitely

Daniil: Each user may just deploy a single contract on registration (reply to 1889)

Daniil: I saw it (reply to 1890)

Steve: No need for payment channels here

Steve: Payment channels are useful if there are 10+ payments at least

Daniil: I don't think people who gamble would just make a few bets in casino and leave (reply to 1895)

Steve: You also need a wallet support (reply to 1896)

Steve: Btw

Lev: What about stuff like TON Proxy? You pay continuously as you use it, so it makes sense

Steve: Yes. But this is not a working feature in practice right now. (reply to 1899)

Hermès: interesting. Love to try out. (reply to 1873)

Hermès: Pop in my head might be IoT: like your toilet will upload every time to click the button. It's a minimum cost for uploading a original data.   And maybe it can receive the funds as well. Because the users might be able to earn the reward if they use the service. X-to-Earn.

Hermès: but yeh, early stage will keep thinking. Since Bitcoin lightning network is not Smart contract based right?

Steve: Sure but payment channels right now expect a deposit before opening a channel. It is not like just magical no fee transactions

Lev: When can TVM exit code 7 (Type check error. An argument to a primitive is of an incorrect value type) appear?

Seitaro: https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes > If you encounter such exception in a func contract it probably means a type error in asm declarations. (reply to 1906)

Lev: I saw it, I mean in Tact

Seitaro: Sorry, missed chat topic. (reply to 1908)

Steve: do you have an idea where it could be? get method? (reply to 1906)

Steve: receiver?

Steve: may be incorrect message?

Lev: This one could be (reply to 1912)

Lev: One of these

Steve: you can try to emulate it in ton-emulator/sandbox and see logs

Steve: Try to check that you have inited all variables in init method

Howard: can we have a tutorial for how to debug in logs? (reply to 1916)

Steve: You can find some examples in ton-emulator repo

Sergei: I think about an implementation of order book exchange based on payment channels. But the current implementation is not suitable for this. At least we need payment channels for Jettons (reply to 1895)

Steve: I recommend to just implement everything from scratch on the same principles

Steve: @howard_peng why no? (reply to 1900)

Lev: Btw why do you want to do it? Are you introducing type variables/generics?

Steve: I need to use syntax like “Int as uint32”. And also future path to generics.

— 2023-02-07 —

Howard: Vote in No because I feel I get used to it.   But if we are thinking more Rudt-like language, then YES. (reply to 1922)

— 2023-02-08 —

Lev: How do I parse a struct from its Cell representation?

Howard: from its Cell representation? (reply to 1927)

Lev: Structs are serialized into cells, I want to deserialize

Lev: Well I guess deserializing maps would be enough

Steve: Manual parsing is not implemented yet, what’s use case?

Lev: Wanted to store data in one field for multiple use cases But I can do it without manual parsing, it's ok

Lev: Btw rusty enums would be really cool

— 2023-02-10 —

Howard: I am checking a bit on TON Storage that people shared with me.  https://github.com/ton-blockchain/ton/blob/testnet/storage/storage-daemon/smartcont/storage-provider.fc  - Whether we(Tact community) have plan to integrate/implement it in roadmap?

Step: @steve_kite hi how to use serializeDict from ton-core/ton ?  its currently not exported 🤔 in  https://github.com/ton-core/ton-core/blob/main/src/index.ts

Alex: As I remember it was replaced with  storeDict(),  for more similar syntax with FunC  https://github.com/ton-community/tact-jetton/blob/main/sources/utils/jetton-helpers.ts#L58 (reply to 1939)

Howard: Is there any DApp that is open-source using Tact? I need the modules when building the website.   Since I don't know how to let the users in my Dapp directly read / write the message to smart contract.

Andrew: there will be (reply to 1941)

talkol: All of them will. not open source, not a dapp 😅 (reply to 1941)

Dario: github pages is true layer 3 blockchain

Roman: Feedback about Tact language  Are you ready to help us make Tact language even better?  🆘 We need your feedback and ideas! Share your developer experience and we'll use it to shape the future of the language.   Get started here: 👉 https://liabbc8a.paperform.co/

Hermès: 🫶🏼

Max: Gm 💎  Can you please tell me if it is possible to write an onchain mint nft smart contract on tact?

Howard: Yes, there is an implementation for initial mint on NFTs in Tact  https://t.me/tactlang/1818 (reply to 1948)

Max: Thank you! (reply to 1949)

Max: 👍

Step: any replacement for StateInit ? (reply to 1940)

Alex: No, it seems same. Example (reply to 1952)

— 2023-02-11 —

Howard: hi, seems my friend will get error when reading in my Tact repo. He got this error in Address library that from ton.   Seems the issued from the package?

Step: Do you know how to get stateinit  from new ton library that i can pass to tonweb's transfer? (reply to 1953)

Howard:     let seqno: number = await wallet_address.getSeqno();     let transfer = await wallet_address.sendTransfer({         seqno: seqno,         secretKey: keyPair.secretKey,         messages: [             internal({                 value: toNano("0.5"),                 to: contract_address,                 init: { code: init.code, data: init.data },                 bounce: true,                 body: packed, // TDODO             }),         ],     }); (reply to 1956)

Step: I am asking stateinit for tonweb library (reply to 1957)

Alex: Did he try use it with very last versions of libraries? (reply to 1955)

Alex: Sounds really unclear. Do you want to use ton and tonweb in one project? Is it Tact lang project? (reply to 1958)

Step: yes i want to use ton and tonweb in one project (reply to 1960)

Alex: It is bad idea, you shouldn't use both of them in one project.  If you tell more about your current issue somebody can help you use one library for all features in project. (reply to 1962)

Step: the days i was working on it, ton js was also updated and broken everything. then i managed to get it working by combining both.  now ton updated stateinit removed now broken again. (reply to 1963)

Alex: StateInit is a function that tact compiler creates for you in output file contract.ts (reply to 1964)

Alex: What is init function in your .tact currently?

Step: sorry its not a tact project. 😅 funcjs and ton js

Alex: So, I think you should ask help in general ton dev chat for this case.

Howard: 😹 (reply to 1955)

Andrew: Most difficult part yet is understanding TLB.   Documentation said that is advanced and low-level, but it’s almost impossible to write something more difficult than counter without understanding it.   Documentation itself written at the same level of difficulty. (reply to 1970)

Howard: Just help few devs in Tact since it is easier to learn and deploy their first smart contract in TON 👍

Kon: how to remove some element from Map? There is only set/get methods

Andrew: check this thread: https://t.me/tactlang/1712 (reply to 1976)

Howard: Maybe there is no remove. I just overwritten the new value. (reply to 1976)

Kon: yes, some bypass hack, thank you... we need to add in further version "remove" from Map...

Andrew: map.set(key, null) will remove item from Map/Dict (reply to 1976)

— 2023-02-12 —

Howard: 👋🏽 (reply to 1983)

Maksim: where should i specify individual content link for nft? (reply to 1818)

Alex: Currently, it is only on-chain  content implemented. Defined via  hardcode in the deployment script .deploy.ts. (reply to 1985)

Maksim: there is a link in deploy.ts https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/ but for each nft {nft_index}.json adds to this link. so where we define this {nft_index}.json? (reply to 1986)

Maksim: i guess here?

Alex: It's implementation of reading.  Content creates in this snippet. + Part of the implementation for the generation nft_item's content is placed in NFTitem init() function. @howard_peng (reply to 1988)

Maksim: but when we mint nft we just send to the contract “Mint” comment and don’t specify content for nft. so how it creates? (reply to 1989)

Maksim: i mean we have basic link for collection which we define in deploy.ts but where we define nft individual content suffix

Alex: Ah, sorry, I said it on-chain. I was wrong.🙈 (reply to 1986)

Alex: Yeah, this place really tricky for me. 1) "Mint" message Invokes mint() function  2) mint() invokes init() for creating data for new NFTItem here  2) init() use getter getNftItemInit() for creating Individual content here 3) getNftItemInit() invokes get_nfr_data() individual content from here. (reply to 1991)

Alex: So, it is true, that individual NFTitem content is built here. (reply to 1987)

Maksim: so it builds in get_nft_data()? (reply to 1994)

Maksim: and one more question how do i form cutom messages like this

Alex: As I know Howard tested it with Tonkeeper. Do you want to create such a transaction via code?

Maksim: yeah (reply to 1997)

Maksim: so how i create transactions when we have custom messages receivers

Howard: I just followed the index_id as a parameters, to follow the metadata URL want to implement. (reply to 1993)

Alex: I have no ready-made example for NFT transfer, trying to find an example. I did several custom messages for my demo projects with ton library. Which library do you want to use? (reply to 1999)

Howard: Good question! In fact, I tested it out and enable to put as a input that your users can put.    For example, maybe it could be text message or the ID in the game, so it could plug-inon-chain rather than on the Metadata level(in JSON).   That's why we keep custom_playload with question marks. (reply to 1996)

Howard: I haven't tried out this yet. But good to try. (reply to 1999)

Howard: Yes. I only test it out on TonKeeper for transfer.

Maksim: it’s not really matter you can send any example) (reply to 2001)

Maksim: so individual content suffix builds only in get_nft_data()? (reply to 2000)

Alex: Ok, give me some time, I will try send from Howard's repo and add there if I get success.

Howard: Yeh. But you can change it for sure. If your NFT content in metadata is not followed the index_id (reply to 2006)

Alex: Need check, do you have any testnet wallet address for sending NFT? (reply to 2005)

Alex: As I understand, your NFT items have no store toncoins for itself, doesn’t it? (reply to 2008)

Alex: https://github.com/howardpen9/tact-nft-standard/pull/1 added Example of transfer via ton here

Maksim: thank you so much (reply to 2011)

Howard: Just back to home after the Hack-a-TonX! Thanks Alex. (reply to 2011)

— 2023-02-13 —

Howard: Try to read a bit in the FunC file I got in my output folder, since I had install the syntax for FunC, seems there has some potential error in there?   How can we solve this, should I worried about the FunC code I got after compiled?

Daniil: These are problems with syntax highlighting extension (reply to 2014)

Daniil: I also saw some troubles with func comments on the docs page

Howard: I encountered a similar issue when I implemented the NFT standard. It's possible that the message structure you set is not consistent with the message you are sending from your client-side.  For instance, I encountered an error when I attempted to transfer the NFT on TonKeeper after I minted it.  That's why I had to deploy the contract and test it in production, checking and adding more 'if' cases to account for scenarios such as what would happen if the "forwardPayload" was empty or zero. (reply to 1915)

Alex: https://github.com/ton-core/tact/issues/10

Hermès: What is this for? (reply to 2018)

Hermès: Thought will get error code when we code in Tact with require already

Alex: wdym? (reply to 2021)

Hermès: will get these automatically right

Alex: Yes, it is about duplication this list in md.  I saw numbers of questions about "what 135 exit code mean?", so for some people, it isn't obvious how to find out their meaning.(I want add little description about reading exit codes in tact docs) Also for the complex contract(with includes from other tact libs) it could very big ABI. I think in these cases it is more convenient for reading exit codes from .md. (reply to 2023)

Howard: 🫡🫡🫡 (reply to 1945)

Howard: would like to know how we can have upgrade-able for the contract since I think that is very important if we want to deploy the Tact language in main-net.

Alex: What is use case? It is announced in the 3d release. (reply to 2026)

Howard: LFG LFG

Howard: let's implement more examples in Tact

Alex: Perhaps there are people who are still trying to do something on Tact and they need help. For example, wondering what @hermes_hhh tried to do. (reply to 2029)

Hermès: Maybe build some random shit (reply to 2030)

Justin: +++ (reply to 1945)

Andrew: does this form have an expiration date? (reply to 1945)

Roman: we will use it every month to get feedback from the community 🙂 (reply to 2033)

Justin: This is Roman’s bread and butter.  And how he ended up working at TON Foundation. 🔥

Remy 🥞: ok (reply to 1945)

— 2023-02-14 —

Howard: Is there the maximum route for one Transaction can trigge?   Let's say my contract will have a series of transactions. Like this image.

Howard: I tried it out, but Tx pause at number 5. No error, no out of gas. It just no execute the Tx it supposed to do.

Seitaro: There are no restrictions on chain length/depth (reply to 2039)

Seitaro: Moreover message does not contain any info on it's "depth in call stack", so transactions caused by "new message just from wallet" and caused by "result of chain of hundred transactions" will be the same.

Daniil: Are you sure the message body is formed correctly? Maybe there's problem with your "Contract second"? (reply to 2040)

Howard: Shouldn't be. Because contract can compile success.   Let me try out with combining Contract Second and  SubContract first. Thanks. (reply to 2043)

Howard: OK, I made mistake, I didn't notice I typed in the incorrect name in subContract.    let contract_init: StateInit = initOf SubContractName(PARAMETER1, PARAMETER2);   Want to point it out that, even the non-exist Contract Name in your code with "contractAddress(contract_init)", you still can compile your Tact code successfully.

Justin: @wdshin welcome!

Kon: Periodically I have got this error:  RuntimeError: Aborted(OOM). Build with -sASSERTIONS for more info.     at abort (D:\serverdoc\tact-project\node_modules\ton-tact\dist\func\funcfiftlib.js:9:6437)     at abortOnCannotGrowMemory (D:\serverdoc\tact-project\node_modules\ton-tact\dist\func\funcfiftlib.js:9:81074)     at _emscripten_resize_heap (D:\serverdoc\tact-project\node_modules\ton-tact\dist\func\funcfiftlib.js:9:81193)     at wasm://wasm/00a881aa:wasm-function[668]:0x2c8ed     at wasm://wasm/00a881aa:wasm-function[210]:0xf74e     at wasm://wasm/00a881aa:wasm-function[87]:0x4bc3     at wasm://wasm/00a881aa:wasm-function[1831]:0x9cc54     at wasm://wasm/00a881aa:wasm-function[531]:0x246d6     at wasm://wasm/00a881aa:wasm-function[840]:0x3ab17     at wasm://wasm/00a881aa:wasm-function[297]:0x13803 FunC compiler crashed Error: Unexpected compiler response     at funcCompile (D:\serverdoc\tact-project\node_modules\ton-tact\dist\func\funcCompile.js:97:15)     at async build (D:\serverdoc\tact-project\node_modules\ton-tact\dist\pipeline\build.js:86:21)     at async Object.compileProjects (D:\serverdoc\tact-project\node_modules\ton-tact\dist\main.js:49:9)     at async D:\serverdoc\tact-project\node_modules\ton-tact\bin\tact:18:9  did someone already have this? how to treat? I tried to increase the memory using TOOL_NODE_FLAGS=--max-old-space-size=4096, it didn't help...

Howard: is this Tact question? @telepulos

Kon: yes

— 2023-02-15 —

Lev: What can an error code (4294967282) that is not in the Tact-generated messages or in the standard TVM exit codes mean?

Seitaro: Did you get this exit_code in real network? (reply to 2052)

Lev: No, it's in ton-emulator

Howard: Can you share the code for how you using emulator? (reply to 2054)

Seitaro: It is quite strange since, to my knowledge, there are no TVM instuctions which can throw exceptions with exit_code > 65535 (reply to 2054)

Lev: I will check the exact event and get back to you a bit later

Seitaro: Oh, I get it, it is uint32(-14)

Lev: Ah

Lev: So out of gas?

Seitaro: -14 is "out of gas" exception, probably ton-emulator or your code somewhere parses this parameter with wrong type

Hermès: 👍🏾 (reply to 760)

Step: anybody help me convert this parseDict(c.beginParse(), 264, () => null); to new tonjs library code.

— 2023-02-16 —

Howard: Never use this before. Is this part of Tact? (reply to 2063)

Hermès: can we compare the value in key of the mapping  and do the comparison?

Hermès: Like here, the first Int is the key of the mapping.   Or is there any way to store values in smart contract and compared with it

Alex: If values are slice_data, as I saw in FunC, it is compered via hash functions. Also we can do something like store owner's address(any data) in contract and check it with require() statement here. (reply to 2067)

Alex: I think you should avoid maps in the current version of the Tact compiler. You can share your task to find a better way to implement your logic without a maps(dicts).

Kon: you can compare hash. Convert the value to slice and then apply .hash() - for example for string it will work... but if have Int - you can use math expressions even, what is the problem? You can compare: let a: Int = 1; let b: Int = 2; if (a != b) { ... } If you mean the question how to pass through the map, then use index for map length + loop, then into loop use map.get(key) and compare (reply to 2067)

Hermès: loop is a big issed I think. But I think I will take a look in hash().

Howard: any possible we can upgrade the contract code before the Roadmap Ch 3?

Kon: I assume that you can create code on funC and run in from tact (reply to 2072)

Andrew: https://ton.org/docs/develop/func/stdlib/#set_code  Using native wrapper to call it from tact (reply to 2072)

Howard: Yeh, same as my idea, but will like to see what potential error or what should I notice if I doing so.

Howard: - The previous contract status will move to new one? - How to migrate the original data in previous move to new one if I adding more storage spaces?

Howard: ok, I will learn more in FunC now 😂

Kon: I think that you can store the data in somewhere else in this case... I mean that you can create a new smart contract, store there and then migrate the data, for example. I saw only examples where the data is wiped and code upgraded...

Howard: I think we need a serious example about this way(if this is a solution), since we plan to deploy the Tact code in production. (reply to 2074)

Howard: If the project can't be upgrade, then it will limit the scalability of the project that code in Tact.

Kon: you can create proxy smart contract , load to there code and then deploy new versions, at any case, in the common way, you won't be able to update the old version of smart contracts, you will be forced to migrate from the old code to the new

Kon: the same problem in EVM, for example order of values in MAP, etc... to migrate you need to shift something to the new structure...

int(0.0): hi

Andrew: there are several ways to update data:   1. Provide migrated data with new code  - for this your contract should support seqno (before code update)  to be sure that latest data will be updated  - data should be migrated offchain and provided for contract   This method has the disadvantage that any data can be set. Because can be modifyed in any way (e.g. adding or deliting some data outside of migration logic)  2. Contract should support some predefined instruction for modifying data before new code will be set.  3.  I’m not sure if it possible to send some migration code in Func or Fift that will be executed while migration.

Howard: there is no proxy in Tact yet, right? (reply to 2081)

Kon: 3 - like eval? It is not supported, afaik... (reply to 2085)

Kon: I didn't see any example, yes. (reply to 2086)

Andrew: yep (reply to 2087)

Dario: 3. You can. load cell, ctos bless and execute (reply to 2085)

Andrew: So then third option is preferable, but most complicated I guess.   Theoretically, all 3 options can be implemented in tact with an native function and good understanding how FunC and Tact (underhood) works

Howard: 🧐

Daniil: 👁

Steve: I recommend everyone to take a look and file questions there to preserve knowledge for everyone.

Steve: Tact Community forums  We just launched forums as alternative to chats for community collaboration. It is very early, but i (Steve) believe that forums are far superiour to chats for communities.   It is designed after Swift's and FoundationDB's one. Two communities that i have a great success participating in.  https://forums.tact-lang.org/ (forwarded from TON Development News)

Hermès: cool cool cool

Howard: who is the expert in https://github.com/ton-core/ton-emulator 🤣🤣🤣

Daniil: I'm not an "expert", but anyway, what did you want to ask? (reply to 2098)

Hermès: What kind of mode we should set can call like this with 0 fee and call a contract?

Hermès: oh, and mode in Send method is not in Docs.  https://docs.tact-lang.org/guides/send#send-typed-message   Like the content about mode: SendIgnoreErrors + SendRemainingValue

— 2023-02-17 —

Howard: I don't know about this as well. But seems it's related with FunC (reply to 2101)

Howard: I think this is a great example about native functions?  https://github.com/anstill/tact-contracts/blob/main/src/contracts/hashmap/contract.tact#L27   But would like to see more example, and how this dictionary can be use. cc @drewstill

Howard: In FunC, we have recv_internal & recv_external to set different logic when receiving the internal/external messages.   Like here [WalletV3]  - What can we do in Tact to send a external message?   Follow up with https://t.me/tactlang/783

Andrew: you can't send them from smart contracts (reply to 2106)

Steve: You can, but why?

Andrew: wait, you can send external messages from within the smart contract? (reply to 2108)

Steve: yes, you can

Steve: but this is not a popular thing and doesn't make much sence since anyone could send them

Denis: really? i mean you can send outcoming external message to MsgAddressExt but can you send external message from contract to another contract?

Steve: yes you can

Steve: but again it doesnt make sence since anyone could do so and it would be cheaper

— 2023-02-18 —

Howard: https://forums.tact-lang.org/t/how-can-we-store-multiple-addresses-data-into-the-contract-without-mass-up-the-gas-cost/22 (reply to 2096)

Steve: Answered, thanks! (reply to 2117)

Howard: OK, this is cool. I can put in multiple data in mapping from off-chain. Here is the example code: (reply to 2118)

Howard: And you can paste and put data like this:

Howard: I checked and seems haven't have people ask about ExitCode 128.   Hope anyone can give some feedback to help me navigate the bug.

Howard: I am thinking about how I can track an NFT that has already been minted?   At this moment, I will have to call the get method for the NFT Item to check if it is active.  (Right now, based on the get_nft_address_by_index , you can get the arbitrary NFT Item ID you want. And if it is inactive in status, the API call will fail when you read the data.) (reply to 1183)

Steve: Yes this is the way (reply to 2124)

— 2023-02-19 —

Hermès: What is the gas usage when using Mapping map[Int]Int versus  const data1: Int = 1234;  const data2: Int = 1234;  .....more   In storing let's say 10 integer values, which one is more gas sufficient? And why?

Steve: I recommend you to just test it and share results :)

Hermès: seems website down

Hermès: https://docs.tact-lang.org/guides/statements#loops

Steve: Links changed

💵: Hi, I'm trying to deploy a test TACT jetton, but I get an error  error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state  What does it mean? I am a beginner developer in ton

Lev: No money on the deployment account (reply to 2133)

💵: Yes, thanks, I used a different version of the wallet, changed V4 to V3R2 (reply to 2134)

Step: Welcome number supply admin 😃 (reply to 2136)

qpwe: 👋 Hi (reply to 2137)

qpwe: logs propery does not exist on type GetMethodResult. Only vmLogs. Am I doing smth wrong?

Steve: Upgrade emulator

qpwe: Works. Ty (reply to 2141)

Steve: Fixed in template though, it seems i forgot to update it

qpwe: Why am I still getting error 4429 even with changed owner address?   https://testnet.tonscan.org/address/EQAcT46EJNtZrAYHW2RfEEeHZGQG23GkE6zcrJQ-LgvyO0Jq

— 2023-02-20 —

Howard: 1/ try to use Address.parse("your-address") I guess  2/ Can you check your TS file to debugging errorCode:4429 means? (reply to 2144)

Hermès: Seems the link in Search barr is in rekt. Totally wrong.  https://docs.tact-lang.org/language/guides/statements#loops (reply to 2132)

Steve: Looks like some cache, it is fine on my mache (reply to 2146)

Steve: will we have a logo today?

Kirill: Depends on Ilya Grishin

Steve: https://icons8.com/icons/set/bolt

qpwe: 1. Changed to Address.parse but still getting 4429  2. 4429: { message: Invalid sender }  https://testnet.tonscan.org/address/EQAf1HyUorbyD7TzR6Xhmj33zOmxbauVxQ845bK-3B-TjXj4 (reply to 2145)

Alex: looks correct. Are you sure you sent last message with updated deployment link? Can’t check your destination address from pic.   You can try simplified increment version with unixtime-based initial value counter.

qpwe: On deploy I get error 130   https://testnet.tonscan.org/address/EQBDU-4d8ljbp8rpSlhoXgEzDdoLINNeggV3es7pVTdLbkDF (reply to 2152)

Alex: Which version? - simplified checked moment ago, https://testnet.ton.cx/address/kQCGMu0PKVjTlmVnauQ4eMZCGrr1OlDfZRKppO7Fb68fDGp1  For me works: clone from git->yarn install->yarn build -> yarn deploy-> sent via sandbox. (reply to 2153)

qpwe: Keeper gives 130 but sandbox works fine (reply to 2155)

qpwe: Tried to deploy with sandbox. Still 4429  https://testnet.tonscan.org/address/EQCZKw_0VxVW6yMyPVt_1cTHzKzRyMwjFEx2KZqSn56eDy2z   Problem was in tonkeeper wallet. Sandbox works well in both cases. Thank you for help  https://testnet.tonscan.org/address/EQCSi7jB-4EOgAuKgfWHP9K-7jbEmrhfbkd7NQUmiBfTk1Yl (reply to 2151)

Alex: It seems Tonkeeper currently excludes from message "comment". I tried figure out how to fix the problem, but can't find any solution.🤔 (reply to 2157)

Andrew: try to contact Tonkeeper team, if you haven't already (reply to 2158)

Howard: Just update a example about Boolean modified: - What will be the risks here if the logic is set like this? Especially for a Multi-Sig Wallet, for example?  - Should we be aware of any vulnerabilities in the Smart Contract code when dealing with this Boolean situation?

Steve: What kind of situation?

Seer Iλusha: i should learn tact

Howard: Any security risk to hacking this contract? No? (reply to 2161)

Steve: Which contract?

Seer Iλusha: seems Tact is similar to Rust (reply to 2163)

Seer Iλusha: no classic inheritance but traits have not associated types :( (reply to 2167)

Whizzie🐾: Hello

— 2023-02-21 —

Howard: What is inspect means in ton-emulator?

Daniil: https://www.npmjs.com/package/object-inspect (reply to 2172)

Howard: It would be super helpful if someone can share some example about how to use Emulator.   The sentences there was not enable to execute. (reply to 2172)

Howard: I am using import util from "util"; seems also works......? (reply to 2173)

Kon: just create global variable or what is the problem with it? "BeforeAll' will be set "owner" before "it"

Howard: fixed! But new error is coming!

Howard: OK, a big thank you to @Gusarich, @telepulos, and @iftryalexg for their help. I am happy to be testing now 🫡   In general, it's not that hard, but it would still be great to have more detailed documentation, as some aspects are a bit different from Jest, I think.  (Even ChatGPT gave me the wrong answer.)

Howard: Once I got the transaction record and tried to capture some data, what should I do to compare it to the result I got from toMatchInlineSnapshot in my next expect statement?

Howard: There are multiple Tx records, and let's say I want to fetch the address from the "to" field of the first "sequo" number.  I think this is a common need in testing.

— 2023-02-22 —

Howard: I made a mistake in my code that took me two days to figure out. I was using the == operator instead of = to assign a value to a variable, but the code still compiled without any errors.  The == operator is used for equality comparisons, not assignments. The correct operator for assignment is =.  Here's an example of the mistake I made: self.status_A == 3; // 🔴  self.status_A = 3; // ✅   So, if you're assigning a value to a variable, make sure to use a single = sign, not ==. 🥶😂

Sergei: Hello, guys! Does tact-example work correctly from the repo?

Howard: Yeh I think so, what are you looking for? (reply to 2186)

Alex: Could you please create issue https://github.com/tact-lang/tact/issues or topic in https://forums.tact-lang.org/? It seems like unexpected behavior of the compiler. (reply to 2185)

Sergei: I tried to run tests from the box but it diesn't work. Even with the fixes from this pull request (reply to 2187)

qpwe: Do you have the right verion of emulator? Could you show an error? (reply to 2189)

Lev: Use the -u flag to update test snapshots

Sergei: Thanks! It works! (reply to 2192)

Howard: I found this interesting book. And it has some cool pictures https://craftinginterpreters.com/a-virtual-machine.html#design-note (forwarded from Chih Cheng)

Seer Iλusha: for good, linter should have reported that the boolean result of the expression is never used (reply to 2185)

💵: Hi, I have a trivial question, I minted a token using the tact-jetton repository, but I can't send it to another address, what could be the problem?  The balance to pay for gas is everywhere

Steve: I have updated template to fix all issues, sorry for inconvenience https://github.com/tact-lang/tact-template

Steve: Also built a debugging article: https://docs.tact-lang.org/language/guides/debug https://docs.tact-lang.org/language/ref/common#dump

Howard: oh nice (reply to 2199)

Howard: How can I use in my .tact file? Nothing shows during after compiled

Lev: It prints to the execution logs

Howard: ooooohhhhhhh thanks. that make sense.

Howard: Quickly two questions:  1) Is it always necessary to deploy the contract? Since I got the error for     Contract is not active    2) The log is quite long. Is it normal?

Steve: yes and yes

Steve: also create a new contract system for each test for repeatable results

Andrew: I don’t understand what snapshot tests actually test except that the contract was changed.   While developing I want to test some scenarios and keep my tests “green”.    I case of snapshots I have to manually validate what have been changed and  and does scenario work correctly, after this I should decide to update snapshots or not. If I will update snapshot any time when I change code, it doesn’t make sense since it doesn't test anything. (reply to 2199)

Steve: you can review diffs of your tests and see what changes

qpwe: Steve, is it risky to use tact now in production? If so, how long will it take to reach the production level?

Steve: depends on your case. In general you can always review generated func code.

Howard: in beforeEach / beforeAll right>? (reply to 2208)

Steve: i usually just copy/paste in each case, but beforeEach/all might work too

Howard: will need tutor to explain how to read log 🙌 (reply to 2206)

Andrew: Yes, I mean it under manual validating, it's not very convenient, since I want to test scenarios, rather than changes in address. It also teaches me to update snapshots without looking.   My tests will fail every time when I change the code even scenarios working properly, so I can’t be sure about why it’s failed and should validate it manually. It’s completely ok when I working with something simple, but when I work with some complex scenarios I want to code check and repeat that instead of me. It's much safer especially when you work in a team and not aware about all complex scenarios, but can rely on that they tested. (reply to 2210)

Steve: we will introduce naming of addresses later to abstract it away, that would reduce dramatically changes in snapshots

Howard: the deploy you mean here is deploy in side the test cases, or I always have to deploy the contract to test-net?   Even with I change a bit in .tact file and compiled. (reply to 2207)

Steve: emulator doesn't have anything with testnet

Andrew: Can we expect something similar like ‘FlatTeansaction’ in sandbox?   ‘’’ export type FlatTransaction = {     from?: Address     to: Address     value?: bigint     body: Cell     initData?: Cell     initCode?: Cell     deploy: boolean     lt: bigint     now: number     outMessagesCount: number     oldStatus: AccountStatus     endStatus: AccountStatus     totalFees?: bigint     aborted?: boolean     destroyed?: boolean     exitCode?: number     success?: boolean }  ‘’’ (reply to 2217)

Steve: Everything already provided but in a structured way, so no

Steve: For example oldStatus and endStatus is reduntary since you can provide only changes in this status, but in practice it is not useful. lt is useless thing in emulator, also it could be different from time to time. now is binded to time that would break snapshots. exitCode and success is almost the same value. outMessageCount doesn't make sence since you need to test messages that were sent. (reply to 2220)

Steve: also transaction "to" also useless since we have all transactions bound to a single contract

Steve: totalFees is simply incorrect in ton and have to be calculated separately (to be implemented in emulator)

— 2023-02-23 —

Hermès: May I ask why dump didn't design as console.log that will pop the value of the contract? Rather then pop like this?  Seems not human readable. (reply to 2206)

Howard: Correct me if I am wrong: 1/ We need to implement a get method to fetch the balance of a TON address since the test library does not provide a built-in function to fetch balance information.  2/ Similar question: How to get the balance of the owner address we got temporally? (reply to 2184)

Howard: yes, just sent. Thanks. (reply to 2188)

Howard: Another question: How can we get the error code in ton-emulator?  If await contract.send() fails, it won't show up in track.collect(), right?  Also, the log output is not very usable, since it can generate thousands of lines of logs.

Steve: send usually can't fail, only system.run can throw exception when external message wasn't accepted. (reply to 2231)

Steve: Error code is reported in track.collect results, it even have an error message

Steve: right now you can call system.contract(address).state to get contract's state that includes the balance (reply to 2228)

Howard: 1/ can we put in optional that can use toNano? It's hard for me to read the amount of TON in balance. For example: (reply to 2235)

Steve: this method doesn't mean for tests, but i will generate something in bindings

Howard: nice (reply to 2237)

Howard: would like to know how this dump can shows properly in log as well (reply to 2226)

Steve: dump are shown in the very beginning of the log

Howard: but it's thousands of logs that can't show properly, no matter print it in spec.ts file or show on console.log.... (reply to 2206)

Steve: yes, i am going to release a new emulation library since i am no longer has an access to ton-emulator one

Howard: thanks a lot! I am coding deeply in Tact because of this.

Andrew: You mean npm package? (reply to 2242)

Steve: yes

Lev: How do I remove a key from the map?

Andrew: map.set(key, null) (reply to 2246)

Lev: Thanks (reply to 2247)

— 2023-02-24 —

Howard: https://forums.tact-lang.org/t/how-to-effectively-test-transactions-that-trigger-multi-contract-behavior/25

— 2023-02-25 —

Hermès: will get this since the inlineSnapshot record is too long?

Steve: Haven’t seen such errors yet. How long it is?

Steve: You can use normal snapshots it would be written to a separate file

Hermès: 30+ Txs since after system.run

Hermès: wdym? Which one? (reply to 2260)

Steve: toMatchSnapshot instead of inline one

Hermès: I think it's quite hard to debug. Is there a way I can filter all the transactions with a specific address, wallet, or smart contract?

Steve: You can filter them as you wish yes

— 2023-02-26 —

Hermès: Can't get why always get ErrorCode 128?

Steve: null pointer exception somewhere

Hermès: I wrote a loop that will check the mapping

Hermès: oh I see

Hermès: This is bad

— 2023-02-27 —

Howard: @steve_kite I changed the version in package in @0.10.0, and got this error. It is ok?

Howard: OK found, using yarn add @tact-lang/compiler for latest version (reply to 2275)

Howard: But got this error since after the update of Tact

Kon: "options" is now "parameters"

Kon: you have to change in your tact.config

Howard: what should I add? (reply to 2278)

Kon: "options" has been renamed to "parameters"

Kon: and maybe need to remove "experimental", because "debug" flag is used only into "parameters"

Howard: Yeh, not getting error if I changed to parameters. Thanks!

Howard: But mapping is in new format. But my local syntax in IDE still haven't followed up  the new version.

Howard: OK, cool

Kon: @dvlkv, this about VS code extension, maybe the time has come already? (reply to 2287)

Dan: yep, lets try a new one (reply to 2289)

Dan: @steve_kite what do you think about transferring @telepulos extension to tact-lang org and giving him maintainer rights in vscode extensions marketplace?

Howard: Is there possible to let the "Contract" itself pay the gas from Balance?

Howard: I am thinking that my Tx sent to the smartContract might be less and unable to trigged the next tx....

Daniil: https://ton.org/docs/develop/func/stdlib/#buy_gas (reply to 2292)

Daniil: I hope there is some similar function in Tact too.

Steve: This method is not implemented though (reply to 2294)

Steve: Yes you can. set_gas_limit is the method you are looking for. The problem with this method that you are going to pay for a gas, not the guy that sent a message. The problem with this is that you can drain your contract's balance. Therefore we are yet to expose it in tact since it is very tricky thing to do. I have implemented it in our TON Nominators contract, but in practice it just put stuff at risk (but it is mitigated by other contract code for checking incoming value of messages) (reply to 2292)

Howard: as the Tact pro user, I can't find what is set_gas_limit (reply to 2297)

Andrew: https://ton.org/docs/develop/func/stdlib/#set_gas_limit (reply to 2298)

Howard: Because I am testing the looping in TVM, and seems it's crazy to do so. (reply to 2039)

Howard: Thanks. Got it. Haven't implement in Tact yet. Understood. (reply to 2299)

Steve: just don't do this (reply to 2300)

Steve: You can import it without a problem in tact using native functions (reply to 2301)

Hermès: I have a contract that can send the text message, but the TON doesn't fallback since the Tx failed. Why?

Steve: Have you sent it with bounce:true flag?

Hermès: Seems like TonConnect doesn't have bounce in parameters

Daniil: you can just send to bounceable/non-bounceable address (reply to 2307)

Hermès: I'm using SendTransction.

Hermès: How do I know the contract I send to has bounceable addr or not?

Daniil: you set the bounceable/non-bounceable flag yourself with some library like ton.js. Just use Address class from it (reply to 2310)

Hermès: never mind.

Hermès: So I can't use the TonConnect to send a bounce-able address?

Daniil: address: string

Daniil: use the bounceable or non-bounceable address, depending on what you need

Daniil: ton.js: https://github.com/ton-core/ton-core/blob/main/src/address/Address.ts#L155  TonWeb: https://github.com/toncenter/tonweb/blob/master/src/utils/Address.js#L116

Hermès: TonConnect, b/c TonKeeper is good. (reply to 2317)

Hermès: 🔥

Daniil: ? (reply to 2319)

Hermès: I mean we are using TonConnect b/c it's good. But I can't understand why there is no bounce-able in filed. But thanks a lot. (reply to 2321)

Steve: Wallet usually do this for you. I recommend to check explorer if wallet sent a bounce flag set

Hermès: but why we just set the Bounce in true by default?

Steve: Yes bounce is the default usually

Hermès: Got the error code 7 as well. And can't figure out where went wrong. (reply to 1906)

Lev: It's probably null in the message arguments (reply to 2327)

Kon: the common case when you can face with this error it is the case when you have defined some global variables in your smart contract and not initialized them ALL in your "init" function (reply to 2327)

Kon: because then tact generates null() for them in the funC code, and there, for example, Cell is needed... then Cell cannot be equal to null() -> you catch 7 error... the Cell variable must be initialized in your "init" function with "emptyCell()" - all variables must be initialized according to their types...

Steve: Ah I see, I forgot to implement this check

Steve: Will fix it in 1.0.0

Kon: I think you need to add some notice in the documentation, because you might run into trouble when you need to create an empty Struct

Steve: Empty structs are prohibited though

Kon: but you can define in a contract such variable: _symbol1: Symbol; then you need to initialize it.. the question is how?

Howard: Correct!! I had this before. (reply to 2329)

Maksim: hello can I test fun() as a pure function without sending messages to the contract? just want to test some math

Hermès: use  get fun do_the_math(input: Int): Int {  // Content & Logic //  } (reply to 2338)

Maksim: is there some way to include fift code in Tact? like assembly {} block in solidity?

Steve: you can import func files (reply to 2342)

Steve: i am not sure about docs though

Maksim: some examples maybe?

Steve: import “./some.fc”

Steve: And then define native function that imports func one

Steve: And there you can define assembly functions

— 2023-02-28 —

Maksim: can i fast forward timestamp/blocks in tests?

Steve: Yes, there is an update function that could update time. Block numbers are not precise right now since they are not really accessible from smart contracts

Howard: any idea with this error? Stack List? Is this TonClient not support with the TS file we generated by Tact?

Howard: From the Tuple function that generated in output/TS File

Steve: Try to use v4 api

Howard: Thinking the .stack has the issued maybe?

Howard: OK, I founded. The List stored with a null in value. But ClientV1 can't read properly.   But Client4 can print all the values in the list, even the null in one of the list. (reply to 2357)

Steve: Classical api is very unstable and it’s support is not that good

Maksim: where is @stdlib/jetton imported from? where can i see the source code?

Steve: it was removed recently to be re-introduced separately

Steve: do you need it?

Maksim: trying to understand how things work. need to implement custom master/sharded contracts similar to jetton

Steve: https://github.com/tact-lang/tact/blob/v0.10.1/stdlib/libs/jetton.tact

Steve: https://github.com/tact-lang/tact/blob/v0.10.1/examples/multisig.tact

Steve: multisig one is the best example of sharded contracts and much easier to reason about

Howard: why this happened. I

Try: Dear friends,  I am writing to invite you to join me in a new initiative to build communities around various topics of interest. Whether you are passionate about social justice, spirituality, electronic vehicles, technology, or anything else, I believe we can come together as a team to create a thriving community.  The purpose of this initiative is to connect like-minded individuals who share a common interest and want to make a positive impact. By working together, we can build a community that is both supportive and informative, providing a platform for discussion, education, and activism.  If you are interested in being part of this project, please reach out to me so that we can start working together to create something amazing. Together, we can make a difference and create the change we want to see in the world.  Looking forward to hearing from you soon!  Best regards,  https://api.whatsapp.com/send?phone=916353527476&text=I%20am%20interested%20in%20working%20as%20team%20to%20build%20community%20  Message me on: https://api.whatsapp.com/send?phone=916353527476&text=I%20am%20interested%20in%20working%20as%20team%20to%20build%20community%20

Howard: ????????

Maksim: can i send message from init() block ?

Steve: In latest version yes

Maksim: how to check version? "@tact-lang/compiler": "^0.10.0" ok? (reply to 2374)

Steve: Yes

Maksim: contract var is not set? (reply to 2370)

— 2023-03-01 —

Maksim: what does toMatchSnapshot mean here expect(tracker.collect()).toMatchSnapshot(); ?

Hermès: that will print or show the last line of record I think. For example,

Hermès: But full of Txs record will be in here:

Steve: toMatchSnapshot doesn’t have arguments (reply to 2379)

Maksim: what is it for in tests? https://github.com/tact-lang/tact/blob/a0811149413f972b7e980e4c95831a2608519c91/examples/multisig-3.spec.ts#L18 (reply to 2381)

Steve: https://jestjs.io (reply to 2382)

Steve: https://jestjs.io/docs/snapshot-testing

Steve: I think the argument is a name of a snapshot ;) (reply to 2379)

Maksim: strange that there is no arguments in tests )

Steve: Because it writes a snapshot that you commit to your vcs

Maksim: what is vcs? (reply to 2387)

Steve: Version control system, git

Maksim: what for? (reply to 2387)

Maksim: ok looks like i need gonna read it first ) (reply to 2384)

Steve: You are reviewing snapshot and check that everything as it should be and then you commit this to the git and your test would crash when something changed

Maksim: ah, The first time this test is run, Jest creates a snapshot file that looks like this - ok now i see, thanks a lot for help

Maksim: can i decode a cell to testable format?

Steve: Not yet unfortunately

Howard: What is the maximum data the mapping can return in a get method?  map<Address, Bool>;  I might store a lot of addresses in there.

Steve: you better just return the map itself, it is cheap

Hermès: any better choice to fetch NFT informations? https://testnet.tonapi.io is not fast enough.

Andrew: depends on the information that you want to fetch. You can manually call get_methods (on testnet.ton.cx for example) and parse the content (reply to 2398)

Hermès: - How do we track the data for a button on Website? - Why my NFT address can't pop up with the get_nft_address_by_index. It's successfully in my side when I fetch data from my TS file.

Hermès: they don't have api in testnet.ton.cx  isn't it? (reply to 2399)

Hermès: but it works with the upper side at Arbirary method  lol

Andrew: seems like no (reply to 2401)

Hermès: just need a way to track whether "an NFT" is being activate or not lol 🤣 (reply to 2398)

Hermès: 👾

Hermès: OK found, https://testnet.toncenter.com/api/v2/#/accounts/get_address_getAddressState_get  Can use this method to track. (reply to 2404)

Hermès: Or any better way to track "whether a wallet address having how many NFTs?"

Steve: We have disabled masterchain support in tact in our latest release, candidate: https://docs.tact-lang.org/language/guides/masterchain  Please, share you thoughts if you need it or you think that this would be a mistake.

Howard: what is that mean? We can't deploy Tact in production yet?

Steve: you can

Andrew: no, it means that you can only work in workchain (reply to 2410)

Andrew: there's a masterchain and a workchain in mainnet

Howard: ok, sounds great for me. Since I think we haven't write any implement any about Validators in Tact yet.

Gajesh: what is the Tact alternative for minting or transferring jetton tokens (by contract to a user)?

Howard: https://github.com/howardpen9/nft-standard-template  Just added the test cases! Let me know if you have any feedback. (reply to 1818)

Gajesh: or is there an example of using jetton tokens in something (reply to 2415)

Howard: yeh, https://github.com/ton-community/tact-jetton (reply to 2417)

Gajesh: thanks! 😄 (reply to 2418)

— 2023-03-02 —

Sergei: If I create a field that starts with init it breaks the highlighting

Hermès: Init is the primitive in Tact. Could you not use it as a variable?

Sergei: I haven't tried. I just used isInited instead (reply to 2422)

Sergei: is there const in tact?

Sergei: it seems no 🤔

Hermès: yes, it does. You can try as const minTonsForStorage: Int = ton("0.02");

Hermès: What is extend even means? Like override in Solidity?   https://docs.tact-lang.org/language/guides/functions#extension-function

Andrew: more like extension functions in kotlin (reply to 2427)

Andrew: https://kotlinlang.org/docs/extensions.html

Sergei: Hmm... I didn't find anything about const in documentation. (reply to 2426)

Hermès: yeh, just doing so. I am noticed this as well. But you can take reference in other's example (reply to 2430)

Hermès: like this one (reply to 2416)

Hermès: Maybe the document can put the example code in below? Kind of confusing. Since I don't code in Kotlin before.   Will send request for editing. (reply to 2428)

Sergei: I got it. Thank you! (reply to 2432)

Andrew: there is an example code already, no? (reply to 2433)

Hermès: an example like this maybe? Full of content that will give full picture of the language.

Hermès: yeh, only the define of the "Native" functions. Would be great if we add like:  // Will let you get 27 by using pow() native function let tempInt: Int = pow(3, 3); (reply to 2435)

Andrew: the result of that extension function would be the ability to make a call like this: const temp = 123.pow(45) (reply to 2438)

Hermès: wtf, ok you are right.   And this is why "adding a few line of code" can make newbie more easy to understand. (if we put the Rust document as a example (reply to 2440)

Andrew: true. I guess a PR would be nice (reply to 2441)

Howard: I am testing this code with do... until:  My question is that, the Send method never be executed.   I can't find why. Even the test cases were fine. Hope anyone can give the feedback for this. Thanks!

Sergei: Guys, how to undestand the contract.send method?  There are 4 different types in the wallet.spec.ts: 1. contract.send(treasure, { value: toNano(1) }, 'notify'); 2. contract.send(treasure, { value: toNano('10') }, 'Deploy'); 3. contract.send(treasure, { value: toNano(1) }, null); 4. ```         contract.send(treasure, { value: toNano(1) }, {             $$type: 'TransferMessage',             transfer,             signature: beginCell().storeBuffer(signature).endCell()         }); ```  I'm confused by the last parameter ('notify', 'Deploy', etc...)

Howard: Those are just parameters followed the receive method you set in your contract code. Depends on what kind of parameters you support with. (reply to 2445)

Gajesh: so with in TACT is similar to is in solidity   right?

Hermès: which part you saw for with (reply to 2447)

Gajesh: contract Name with Jetton (reply to 2448)

Hermès: yeh, looks like that. but I think Tact hasn't have overwritten yet for functions

Gajesh: gotcha

Steve: It has just not published

Gajesh: is there a way to check jetton token balance of certain wallet on the blockchain? (with tact)

Gajesh: * onchain

Daniil: no way. (reply to 2453)

Gajesh: wait. wut. how do the current defi platforms work on prices (x * y = k)? (reply to 2455)

Daniil: they just store the current jetton balances inside of the exchange contracts and update them when users trade (reply to 2456)

Gajesh: oh boy

Gajesh: also so can i read data from other contracts?  for example, there is contract A which wants to know contract B's owner

Daniil: only if the contract B has some opcode which returns the message with it's owner (in this example) (reply to 2459)

Daniil: but you can't get that info in the same transaction. the only way is to send some "request" message and wait for "response" message

Gajesh: oh okay

Gajesh: new to Tact. so tons of questions in mind haha.   - what's the alternative to address(this) in tact?  - can a contract sign messages? (i assume yes)

Daniil: "signing" messages usually means that you just sign it with your private key and store the signature in the beginning of data. but smart contracts usually don't have any private keys (it would be strange to store the private key publicly on-chain) so it makes no sense (reply to 2463)

Daniil: and why would you need to sign some message by a contract?

Daniil: if contract B receives a message from contract A, it can be 100% sure that it is really from contract A

Gajesh: got it.

Gajesh: and is there a way to transfer jettons in same transaction?  for example, for DEX or farm.

Howard: myAddress() => means address(this) in Solidity (reply to 2463)

Gajesh: and commenting in Tact is similar to FunC?

Gajesh: {/* comment */}

Kon: no, // /*

Gajesh: thanks (reply to 2473)

Gajesh: is there array or array-equivalent on Tact?

Kon: Struct

Kon: Map

Kon: Map from struct

Gajesh: oh got it.

Step: Can store unlimited number of key value?? (reply to 2478)

Step: I heard there is 255 limit on something?

Gajesh: oh what. u can only have 255 keys and values? (reply to 2481)

Howard: You can return a full Mapping in get method by the way.

Howard: Can't be sure what the limitation is for it.

Daniil: On tuple (reply to 2481)

Daniil: Maps can store almost any amount of keys

Hermès: Can we put this in Tact and FunC?  https://github.com/shobrook/adrenaline

Howard: 😵 Does anyone knows why the line of code after do didn't execute? (reply to 2444)

Gajesh: how can i token transferFrom user to contract w/ tact?

Whizzie🐾: Hello guys

Whizzie🐾: I'm just starting up in ton, I have been building in  Ethereum

Whizzie🐾: Just about to start learning func, but kind of confuse about it and tact. Can someone help me out please.  May be just as we write smart contracts on Ethereum with solidity, on ton, is it with FunC or tact?

Howard: Using SDK? (reply to 2490)

Gajesh: which sdk? (reply to 2494)

Howard: Can you fix the sentences through ChatGPT? Can't understand properly what do you want. (reply to 2493)

Gajesh: for example, i have a deposit function which should deposit 100 USDC from user to contract.  how can i possibily implement it

Howard: You can use ton-cli to send tx through the traditional way with the moment.    Or you can use the deploy.ts file to generate a URL and execute it through TonKeeper on mobile (reply to 2495)

Gajesh: no no

Gajesh: i want it to be done onchain

Howard: You can write a smart contract through FunC or Tact, or Fift language. But not recommend in Fift lang. (reply to 2493)

Whizzie🐾: Oh, I think it's a bit clear now, FunC and Tact are two different programming language right.? (reply to 2501)

Alex: You need to learn some theory. These links could be useful for you:  - https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers - https://ton.org/docs/develop/getting-started - https://ton.org/docs/develop/smart-contracts/sdk/javascript  - https://ton-community.github.io/tutorials/01-wallet/ (and the following guides) (reply to 2493)

Alex: Did not notice, that it is Tact's group.🤯  Try to learn general information from the Tact documentation. Article still will be useful for you even in Tact context - https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers    Also you can try launch demo-projects:  https://github.com/reveloper/tact-increment-uni https://github.com/ton-community/tact-jetton (reply to 2493)

Gajesh: does Tact support 1e12 or `1e10)

talkol: pow(10, 10) in 1.0.0rc

Steve: isn't it doesn't work right now? (reply to 2506)

Gajesh: oh

talkol: was this issue resolved? https://github.com/tact-lang/tact/issues/18 because I couldn't compile code with pow

Steve: i am looking at this now, i am not sure why it doesn't work. Seems that it should be compile only.

talkol: undefined function ** in func

Steve: actually it seems that "**" does not exist in func

Dario: afaik, there is no pow in ton, only pow2  pow should be implemented like this  https://github.com/TonoxDeFi/open-contracts/blob/main/contracts/math/math.func#L7 (reply to 2510)

Steve: yeah, it is just too expensive

talkol: maybe we should use a directive like ** in tact so it doesn't work in runtime but in compile time with constant literals only

talkol: https://tact-by-example.org  we're also working on this 🙂

Howard: wow, it looks good for me.

Steve: Soon

Steve: this is the UI for the deployer after opening a url generated by the deployer lib.  let me know if there are comments pls before I publish (forwarded from shahar)

Steve: What do you guys think about logo?

Daniil: Looks sick 🔥 (reply to 2522)

Step: Logo reminds me of a shitcoin called electroneum (reply to 2522)

Hermès: 🤣 (reply to 2526)

— 2023-03-03 —

Sergei: I got some trouble. If I use const in the reciver:   receive(msg: TopUp) {       require(!self.data.isInited, "Already inited");        const addA: Int = msg.coinsA;       const addB: Int = msg.coinsB;        self.data.balanceA = self.data.balanceA + addA;       self.data.balanceB = self.data.balanceB + addB;        require(self.data.balanceA + self.data.balanceB > myBalance(), "Not enough money for init");     }   I get an error (on the screenshot). But if I use let it works well

Howard: I think that is b/c the const value will store in different location in SmartContract? The place that can not be read in temp value or something. (reply to 2532)

Sergei: you mean after compilation? (reply to 2534)

Howard: yeh, in FunC level or the Fift language I think. (reply to 2535)

Sergei: How can I load coins from the message?  message TopUp {     coinsA: Int as coins;     coinsB: Int as coins; }  receive(msg: TopUp) {     // .... ? }

Daniil: msg.coinsA (reply to 2537)

Sergei: I tried it but contract balance didn't change. Only for a gas fee. Or I should to add that ammount to the value? contract.send(walletA, { value: toNano("0.01") }, { $$type: "TopUp", coinsA: toNano(5), coinsB: 0n }); (reply to 2538)

Daniil: because the value is just 0.01 ton. Yes, you should add 5 ton to the value (in this case). TON Blockchain itself doesn't know anything about your custom message structures and functions. You just send some value and some additional info attached (reply to 2539)

Steve: Hey, i have the only one visible task to finish before i am able to cut 1.0.0  https://github.com/tact-lang/tact/issues/20

Steve: does anyone has comments about send function and it's arguments?

Sergei: Is it possible to set a mode? (reply to 2542)

Steve: Yes (reply to 2543)

Howard: any example for this? (reply to 2542)

Howard: I am checking https://docs.tact-lang.org/language/guides/send#send-typed-message   But never used this before. Any example for this, and why we need this?

Steve: What do you mean never used before?

Howard: I've never seen an example of this before. (reply to 2547)

— 2023-03-04 —

Hermès: Have you solve this? Staking contract for arbitrary Jetton token (reply to 2469)

Gajesh: no (reply to 2549)

Hermès: Can we have upgradable contract 🫣

Steve: Not yet

Steve: The main obstacle is that contract upgrades involves changing code in secondary contracts.

Steve: We will provide some limited capability of upgrades soon

Howard: Planning to deploy my code in production but still very worried about the bugs as well. 😵 (reply to 2554)

Steve: Yeah this is a main concern, but upgrades really work only for a single contract.

Howard: That sounds great too! (reply to 2556)

— 2023-03-05 —

Dan: https://github.com/ton-blockchain/ton/commit/d9eb0bbd3b8e4516d5afb0f2950e59a993edbfad (forwarded from Seitaro Higuchi)

Howard: I read https://ton.org/docs/participate/ton-storage/storage-daemon in a couple of time, from my understanding we can implement it in Tact?   And there is a open protocol that people can rent his hard-disk. Right?

— 2023-03-06 —

Howard: Hi all, basically we can use below code in Solidity to let contract wait for a few blocks. I made the similar one down below: But the Tx always out of gas.   Is it because we can't do this in TVM or?

Daniil: It's really a bad idea to rely on ChatGPT suggestions that much (reply to 2564)

Daniil: You can't do that this way neither in EVM or TVM

Daniil: You can skip 1+ block in TON by sending a message to some bounce contract in masterchain and receiving it back

Howard: The idea behind this is that I want to ensure that a series of transactions cannot be made at the same block height. From a security standpoint, I do not want to allow any possibility of flash deposits or withdrawals. That is why I want the code to wait for a while, perhaps now() + 1000 would suffice.  Other than that, I can't think of a better way to achieve this.  What do you mean by 'skip 1 + block'? There is no 'skip' primitive keyword in Tact, right? (reply to 2567)

Daniil: I just explained how you can "skip" a few blocks in the same message above (reply to 2568)

Howard: ok, got your point. Let my try out and checked into the Logical Time. (reply to 2569)

— 2023-03-07 —

Howard: Got this error when compiling since I think I reached the maximum space can store in a contract?

Howard: But successfully compiled if I comment few lines of code.

Kon: this issue is fixed on rc version (reply to 2573)

Howard: how to upgrade to Rc version, sorry? using yarn add @tact-lang/compiler already  still got "@tact-lang/compiler": "^0.10.1" (reply to 2576)

Kon: https://github.com/tact-lang/tact/issues/19

Kon: change in package.json  "@tact-lang/compiler": "^1.0.0-rc.12",

Kon: then yarn

Howard: oh yeh! Thanks a lot Kon. Very thankful!!!! (reply to 2580)

Maksim: do i have to initialize all state vars in init? can not set up self.id only. But I wanna set positionAddress later. Should I set some null/zero in positionAddress ? how?

Hermès: Set data type as ‘Address?’ (reply to 2583)

Maksim: is this ok?

Steve: You can declare a nullable address as Address?

Maksim: how?

Maksim: it works at least (reply to 2585)

Maksim: in tests, how to send something to  contract.send(treasure, { value: toNano('10') }, 'Debug');  as internal message from another contract?  Is it possible to create treasure from certain address?

Steve: you can create multiple treasures, do you want to use some specific address?

Gajesh: what is the easiest way to deploy tact contract?

Maksim: yes, I want to test specific address of another contract to test access control function, which calculates address of caller from code and init (reply to 2590)

Steve: right now template has tools for deployment, but we are going to release a better way to do so

Gajesh: i generated the deploy url but it's too long for QR Code (reply to 2591)

Gajesh: oh (reply to 2593)

Andrew: what about integrating with blueprint? (reply to 2593)

Gajesh: what is blueprint?

Andrew: github.com/ton-community/blueprint (reply to 2597)

Steve: Idk, i still don't understand what blueprint tries to achieve. We are building a tool integrated with contract code verification: https://verifier.ton.org

Steve: that would allow you to connect your wallet to it and perform deploy, verify and a lot of other thigs

Maksim: any ideas? (reply to 2590)

Steve: i recommend just to use different treasures and deploy your contracts according to addresses from this treasures

Steve: if it is dependent on another contract, i recommend just to test once contract at once

Howard: yes, you can take a reference with the repo https://github.com/ton-core/tact-template/blob/41619417e653fbea6d39e171dffaeb9e9074cd22/sources/transfer.ts (reply to 2591)

Howard: Using mnemonic and calling API to fast deploy without using URL

Howard: oh this looks good! (reply to 2599)

Maksim: but how could i test this https://github.com/tact-lang/tact/blob/talkol-patch-1/stdlib/libs/jetton/master.tact#L102 ?  i need sender being calculated from initial contract state (reply to 2602)

Howard: Question: - If I verify the code, will it increase the risk for a hack?  - Even if I give people my FunC file, could they still find a way to attack? What if I show them the TS file we obtained after compiling? (reply to 2599)

Howard: you can set the jetton wallet inside the beforeAll? (reply to 2607)

Maksim: but how to send message to master from jettonWallet name?  contract.send(treasure, { value: toNano('10') }, ...); how to set treasure as jettonWallet? (reply to 2609)

Gajesh: is there an example to use the send() in typescript generated in output

Seitaro: https://docs.tact-lang.org/language/guides/func#tensor-return-types From the examples, I don't understand when a getter returns a tuple and when a tensor? Does ? at the end defines the output form?

Howard: For my experience, the Maybe on FunC is equal the ? in Tact.  Here is the example, the TEP62 vs my NFT standard code. (reply to 2612)

Howard: But since I am not expert in FunC hope this helpeful.

Seitaro: Yeah, it is about serialization to the cells. I think that I understand how it works, the question is about get functions which do not serialize but leave bare variables on the stack. Looks like (at least from docs) sometimes those variables are wrapped to tuple and sometimes not. (reply to 2613)

— 2023-03-08 —

Hermès: is it unlimited? ex. map<Int, Int> let's say (reply to 2487)

Gajesh: yes (reply to 2618)

Steve: direct compatibility with func tensors only for non-nullable types since we can't represent nullable tensors in func anyway and there are no need for backward compatibility, but when it is an optional type it returns tuple (or null). (reply to 2612)

Steve: And all inner references are wrapped to tuples. In essence struct/messages is always a tuple except the special case of a tensor representation on top level that was built for func-level compatibility with standards.

— 2023-03-09 —

Maksim: from docs: "To make dump work you need to enable feature debug in tact.conf.json" i have tact.config.json in my project, where to enable debug feature and how?

Maksim: solved (reply to 2623)

Steve: Is is options now

Steve: I just added ability to use named contracts that would use name instead of an address in snapshots.

Steve: ⚡️Tact Emulator v3.2.0  ton-emulator is now @tact-lang/emulator. It became browser friendly, uses reproducable build of WASM emulation binaries, exposes verbosity level for system and for contract and you now can name your contracts to make snapshot testing easier.  https://github.com/tact-lang/tact-emulator/releases/tag/v3.2.0 (forwarded from TON Development News)

User<6247944943>: cool

— 2023-03-10 —

Gajesh: is there hashing in Tact?

Steve: cell/slice.hash()

Gajesh: gotcha

Gajesh: is it using sha25^?

Gajesh: 256*

Steve: it id doing "cell hashing", that uses sha256 but it is not trivial as it is

Dan: hey guys, I'm currently writing integration of tact with blueprint here's what I currently achieved  .compile.ts looks like this: import { CompilerConfig } from '@ton-community/blueprint';  export const compile: CompilerConfig = {     lang: 'tact',     target: 'contracts/sample.tact', };  when you run npx blueprint build with the respective name, files get generated as follows: build/ ├── Sample │   ├── tact_SampleTactContract.abi │   ├── tact_SampleTactContract.code.boc │   ├── tact_SampleTactContract.code.fc │   ├── tact_SampleTactContract.code.fif │   ├── tact_SampleTactContract.code.rev.fif │   ├── tact_SampleTactContract.md │   ├── tact_SampleTactContract.pkg │   └── tact_SampleTactContract.ts └── Sample.compiled.json  then there's a file wrappers/Sample.ts that only has one line: export * from '../build/Sample/tact_SampleTactContract'; so it relies on the files in build folder existing  the spec file has minimal differences, the main one is that compile function is not called since tact embeds code into the resulting ts file  I haven't written a script for deployment yet but I expect it will have minimal differences too  please let me know what you think, especially about that "wrapper depends on files existing in the build folder" of course also let me know if you have better ideas on how to do this, I haven't spent a lot of time making this and I barely know how tact works (forwarded from Max)

Dan: you can consider SampleTactContract to be replaced by Sample in this whole example, it's just a little mistake on my part (reply to 2636) (forwarded from Max)

— 2023-03-11 —

talkol: We're making nice progress with https://tact-by-example.org Will appreciate feedback

qpwe: Wow, awesome (reply to 2638)

— 2023-03-12 —

Howard: To display "text message" on TonKeeper when a transaction bounces back, should we use throw or reply?  Currently, I can debug based on the ExitCode from Explorer. However, since users cannot receive any text information on TonKeeper, I am unsure.

— 2023-03-13 —

Hermès: What would it look like to implement an Upgradable or Proxy contract in TON? While OpenZeppelin's template is good, it can be difficult for some people to understand and implement.  One example of a challenging implementation is the Diamond Standard (https://eips.ethereum.org/EIPS/eip-2535). It's important to consider these scenarios before implementing upgradable methods for contracts, as they can be difficult to maintain and implement.  I believe that ease of understanding is key to onboarding more developers.

Placeholder: Is there any need in such proxies in ton, considering that ton contracts are upgradable by design? (reply to 2642)

Andrew: yeah, all you have to do is call set_code() (reply to 2644)

talkol: it's indeed very easy to upgrade code in ton, but in tact it requires some thinking.. for example what do we do about the ABI? simply change it?

Maksim: changed ton-emulator to @tact-lang/emulator got similar errors what's wrong? (reply to 2628)

— 2023-03-14 —

Howard: can we get the length of the key in a map<Int, StudentList>?   For example:

Howard: - How can I determine/get the current length of student_data here?  - How can I retrieve the mapping inside a structure and call each one individually?   msg.student_data[0].studentName seems not correct.

Daniil: Maps don't keep their size anywhere. But you can store the size in a separate variable for example, and update it everytime you add/delete something from a map (reply to 2650)

Eugene: I'm touching Tact for the first time and I already have a silly question. Tact docs and tact-by-example use fun for functions, but on the tact-lang.org main page I see fn. Are "fun" and "fn" synonyms that both can be used? Or did the syntax change making "fn" outdated? Or am I missing something?

Steve: Main site is outdated

— 2023-03-15 —

Howard: basically, you are looking for grants, right? Then you can apply here: https://github.com/ton-society/ton-footsteps https://ton.org/grants https://ton.org/sponsorships

Daniil: Are you talking about some gambling stuff? I don't think you'll get a grant for that (reply to 2658)

Daniil: And also, 100% on-chain game of chance is a bad idea

Daniil: It's a bad idea to build 100% on-chain casino. It leads to bad experience for users and risks for owners. (forwarded from Daniil)

Eugene: The website itself is great (thanks for it), but I'm currently experiencing some navigation issue  The navigation "prev / next" links show "Writing Your Own Trait" as prev underneath EACH example and show no next example at all  Reproduced it in three different browsers (reply to 2638)

Daniil: I'm not saying these are good (reply to 2665)

Daniil: Just giving you a recommendation about gambling projects.

talkol: oh yeah, looks like i broke it last night. I updated many dependencies and probably ruined something (reply to 2664)

talkol: thanks for reporting! I missed it somehow

talkol: try now, should be fixed (reply to 2664)

Eugene: Yeah, works fine, thanks! (reply to 2673)

— 2023-03-16 —

User<6247944943>: Question: How can we know the address is a smartContract address or Wallet Address? No?

User<6247944943>: Both smart contracts.

Alex: Wallet (contract) is a smart contract too.  About defining which one (type of) smart contract we have, for instance, blockchain explorers trying access to the typical GetMethods(get_public_key() - wallet, get_wallet_data() - jetton). (reply to 2675)

Andrew: you can also look at the contract's code (reply to 2675)

Daniil: There are several versions of wallets. And new versions may appear in future. Also don't forget there may be some custom implementations of wallets (why not?). (reply to 2678)

Daniil: Checking by get methods is the correct option

Andrew: it's not the only option (reply to 2680)

Andrew: one can check for several versions, why not? (reply to 2679)

Daniil: Yes, you can, but you'll miss some wallets that way. (reply to 2682)

Andrew: I can expose some get methods on my contract but the code would implement some logic that's not related to wallet at all. In this case you'll get false-positive if you only rely on get-methods

Andrew: and you'll miss the ones that don't comply with the standard (reply to 2683)

Daniil: Is there a standard for wallets? :) (reply to 2685)

Andrew: I meant the get-methods that you'd rely on (reply to 2680)

User<6247944943>: sorry, I mean in Tact code level.   I want to add a check that the owner of a smart contract must be the WalletV4. (reply to 2677)

Alex: Get Methods in the Tact version will used by the same way, just double check their signature(for example with .md output files or .tact source).  For the WalletV4 contract it was recommended to use the FunC version. There is no implementation of WalletV4 with Tact language.  Tact must be used to create new cross-contract services with complex on-chain business logic.  If I read right your task: 1) Get owner's address from "smart contract" 2) Try to use get method on owner's address.  Perhaps, open-source blockchain explorers could be helpful to research this deeper. (reply to 2688)

Howard: What is the difference for using get fun vs (private) fun if they both can return value and passing the data to go some calculation.   Maybe the usage in Gas is difference as well?

Howard: I have a question about the "RemainingValue" feature. Here is an example of code: when we run multiple lines of code and need to transfer the rest of the value, we usually use the SendRemainingValue mode.  My question is, how do we properly pay for the second Send function? We need to keep some TONs in the contract for storage and the minimum gas cost, so how can we ensure that the remaining value is transferred correctly while also keeping enough funds in the contract?

Steve: SendRemainingValue, it is a flag

Howard: Yes, and I don't use that method. I usually use the following approach:    However, this method can't calculate properly if my Send functions are in the second, or third if loop.

Howard: I was only able to solve this issue by setting minTonsForStorage and gasConsumption to ton("0.1").   Do you know why the transaction paused there in my previous example code? It seems like there might have been an issue with the msgValue measurement. (reply to 2692)

talkol: Get fun is for end users querying your contract. I wouldn’t call them from inside the contract (reply to 2690)

Howard: I thought of it more as a view function in Solidity, which doesn't cost much in gas. Thank you for letting me know. (reply to 2696)

Omid: Hi guys

Omid: I am happy to be with you

Omid: I am a web developer who has been working in Ton community for some time.

Omid: https://omidpaydar.ir

— 2023-03-17 —

Howard: to keep the contract remaining some amount of TON in there, should I use:          send(SendParameters{             value: 0,             to: self.owner,              mode: SendIgnoreErrors + SendRemainingBalance,             bounce: false         });  or          send(SendParameters{             value: myBalance() - ton("0.1),             to: self.owner,              mode: SendIgnoreErrors,             bounce: false         }); (reply to 1328)

Howard: 1/ I understand from the documentation that we need to keep a certain amount of TON in the contract.  2/ That's why I used a function to calculate the remaining value we need to keep in the contract, building on Steve's previous code.  3/ However, the problem arises when we need to use multiple send transactions (based on one input receive function method). In these cases, we need to properly calculate the remaining value.  Sometimes, the value I wrote like this fails. I suspect this might be due to the dynamic gas cost, which could prevent us from achieving the minimum value we set to keep in the contract. (reply to 2693)

talkol: It’s a good question Howard! (reply to 2706)

talkol: I want to start writing a section in tact-by-example about gas strategies

talkol: Your multiple sends is a good question

talkol: Also if you see in tact-by-example the “Communicating Between Contracts” example, and ask yourself how to send the excess gas back at the end of the flow, it’s a good question

talkol: If you want to help me, let’s collect a group of different scenarios for this topic and answer them all at once and show the pattern people should use

talkol: (I’ll do some digging with people in the community to understand what they recommend)

talkol: Long story short, your job is to collect 6 scenarios for me in this family of questions so we can cover it end to end

— 2023-03-21 —

Howard: I just uploaded my version of jetton implementation in Tact, which: - enables minting of an arbitrary amount of tokens by only the owner set initially - anyone can call with the command Mint: 100 to mint tokens one by one - the status for mintability can be changed. Only the owner can close the minting feature. - supports the Transfer function with two methods:  a) using mnemonics to trigger it - URL b) using a URL to transfer jetton tokens to a new owner. - URL - Set a max supply initially when you deploy the code  https://github.com/howardpen9/jetton-implementation-in-tact

Steve: This one better for telegram, thanks @pirogovoe for our logo!

— 2023-03-23 —

Howard: Where is the table for each mode Int means?   mode: 64 -> SendRemainingValue mode: 0 -> SendIgnoreErrors   I remember?

Andrew: https://ton.org/docs/develop/func/stdlib/#send_raw_message (reply to 2723)

Howard: Oh, thanks a lot. (reply to 2724)

talkol: https://github.com/tact-lang/tact/blob/main/stdlib/std/send.tact#L5

— 2023-03-24 —

Howard: Anyone tried the NFT of standard and list on getgems.io tho? (reply to 2416)

Gajesh: can anyone help me with transferFrom user to smart contract in one message? 🥲

Gajesh: (Jetton)

Daniil: there's no transferfrom (reply to 2730)

Gajesh: yup. i meant an equivalent (reply to 2733)

Gajesh: @howard_peng resolved the Q (reply to 2730)

— 2023-03-25 —

Howard: After trying to implement more FunC files into Tact, I believe that Tact simplifies the implementation of complex and diverse business ideas. This is especially useful for building POCs.  In general, Tact is a very helpful tool.

Maksim: It's very interesting to find out where and when Tact gives way to funC. I'm gonna do some experiments.

Howard: anyone tried out pow before? Got this crashed when compile

Maksim: i've used it for simple things like pow(10, 27), it worked (reply to 2739)

Andrew: I guess it's due to the variables being present in the expression (reply to 2739)

Howard: don't know, seems it's not in global standard https://github.com/tact-lang/tact/commit/925a9332ae67d03d45412f2809131c1a39921861 (reply to 2741)

Daniil: Error says it all. Pow() in tact works only for constants (reply to 2739)

Daniil: (why?)

talkol: So people won’t make gas assumptions for it (reply to 2744)

talkol: You can implement a runtime Pow function yourself if you need it in runtime

Maksim: @howard_peng how did you calculate message op code  message(0xd53276db) TokenExcesses {} did you calculate from message schema, or just defined random hex?

Daniil: - yes, it is calculated from scheme  - it is defined in jetton standard: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#tl-b-schema (reply to 2747)

Maksim: do you know how to calculate own custom message opcode? (reply to 2748)

Daniil: Yes, check the link I've attached  Also: https://docs.ton.org/learn/overviews/tl-b-language#constructors (reply to 2749)

Daniil: crc32('excesses query_id:uint64 = InternalMsgBody') = 0x553276db | 0x80000000 = 0xd53276db

Steve: tact is different

Maksim: how different? i need to know opcodes to do bounced() handler (reply to 2752)

Steve: completely different, you shouldn't calculate them yourself

Steve: you can check generated id in md file

Howard: I know that I can put any customized opcode that I want, but I don't understand the difference or the outcome that will result from setting it with message(0x01) Minting { } as well.   I can't sure as well. (reply to 2747)

Dario: Why? Also, how tact pack data in cells? (reply to 2754)

Dario: I dont find any description about it

Steve: https://docs.tact-lang.org/evolution/OTP-004

Dario: Thanks!

Dario: So basically sequentially. Its a waste imho

Steve: mostly it is as efficient as manual allocation

Dario: There are a few optimization that can be done in tact to avoid begin_cell().end_cell() with static fields, for example, when there is a lot of data. Instead of serializating it, you can just store the loaded cell and store it directly. So you might keep that that change and static data in different cells for example. Eg in jetton wallet, minter and owner never change

Steve: it won't improve much

Dario: If there are other data, you can keep static data in another cell and avoid serialization when updating storage. Just an example

Steve: you will save on 20 gas at most

Dario: Actually, depends on how much data there is (reply to 2764)

Steve: you shouldn't use too much data

Dario: Just an example, i think this kind of optimization should be managed

Dario: No, you are removing a NEWC and ENDC, you save a lot of gas (reply to 2766)

Steve: in jetton contract everything is stored in a single cell

Steve: not that much to optimize

Dario: As I already said, i was taking about more complex contracts (or jetton wallet if you have MORE fields than standard one). You cant skip this optimization if everything fits in 1023 bits. But again, a simple serialization to me looks very inefficient, especially when working with complex contract (eg check ston-fi contracts)

Dario: There are other optimizations Ive been thinking of, maybe i will post then in dev chats

Maksim: What chats? (reply to 2774)

Dario: Idk tondev etc

Steve: You can do your own optimizations without relying on Tact itself by importing func implementations

talkol: Want to learn how contract sharding in TON works? It is much easier to understand with Tact. And Tact is much easier to understand with https://tact-by-example.org  Check out the latest lessons in https://tact-by-example.org/all that explain everything about contract sharding and parent-child relationships with easy to understand examples you can play with

talkol: feedback welcome

— 2023-03-26 —

Howard: The Communicating Parent & Child contract is very cool since the two contracts can interact with each other and "dump" or "reply" the current status of itself back to the original senders (Parent contract). (reply to 2778)

Howard: I just fixed the issue for NFT when listing on getgems.io. The ctx.forwardFee variable might sometimes become a very large integer, so we need to be careful with it.  https://github.com/howardpen9/nft-standard-in-ton (reply to 2416)

Howard: 😂

— 2023-03-27 —

Howard: What is the best recommend to avoid "Integer out of expected range"?   - it will crashed if I assign toNano(10) for the jetton amount that I want to mint with a price_weight - 10n (bigint) tho.    Thought toNano(10) represent a call to the toNano function with the argument 10, which should convert 10 TON to nanotons, resulting in 10. 000 000 000 nanotons.

Howard: ok, made some mistake.   The length of data type coins is not long enough for jetton amounts. If you can't sure how much jetton token with the totally supply can just set with Int rather then uint32(which is range 0 to 4,294,967,295) - followed by Tact-by-example for more details (reply to 2792)

Howard: Would you like to see an example of a Jetton-ICO template? Check out this link: https://github.com/howardpen9/jetton-ico-example/blob/552c545b0e129623cc0856ba7b036a8f661a7d27/sources/contract.tact#L29  Here are some tips for using this template: - Set the multiplier to determine the amount of Jetton tokens people can get per TON. For example, if you set it to 2500, then 1 TON for minting can get 2500 new Jetton tokens.  - There is a 1.5% fee implemented in TON for fundraising. And only enable withdraw by initial admin.  - In Tact, make sure not to use now() inside the init() function, or your contract code will change addresses based on block height.  - You can set an expiration date based on the starting logical time you want in Unix timestamp.   inspired by: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-ICO.fc (reply to 2792)

Steve: You are using old compiler if calling now affects address

Howard: when checking with the contract code on getgems.io, noticed that they prepared with the boc code of each contracts.   Where can I find the boc code of my contract we compiled in Tact?

Howard: oh, I think we have in here: https://docs.tact-lang.org/evolution/OTP-006#specification (reply to 2799)

Steve: You can’t see boc in output folder?

Howard: yeh I just found. 😅 (reply to 2801)

— 2023-03-28 —

Hermès: waht do yuo measn (reply to 2803)

Howard: You can use it as a multiplier, meaning from an altcoin perspective, you can think of it as placing a leveraged bet by investing in the altcoin. If you examine the price correlation chart, you can conclude that in a bull market, it's better to hold onto ETH, but in a bear market, holding altcoins may have more potential for growth. This is why I refer to it as a 'weight' or multiplier from a data standpoint.  On the other hand, from a psychological standpoint, holding a larger amount of any currency feels better regardless of the type. Holding 1 billion Zimbabwean dollars feels better than $1 US dollar, for sure. (reply to 2804)

Howard: 🤣 correct, maybe I should delete that. But I also hope help people knows that they can find boc info in output folder haha (reply to 2806)

Howard: Thanks for asking, have you test the code as well? Would be great if you point out the bugs for me. 👍🏿 https://t.me/tactlang/2795 (reply to 2810)

User<6247944943>: ‘yarn deploy’ then you will get URL to deploy the code. (reply to 2812)

User<6247944943>: No need for the knowledge for it still can code in Tact.

— 2023-03-31 —

User<6247944943>: Can we have the Tact auditing support?

talkol: Due to requests, I wrote a new introductory post that defines lots of the terminology we use like “smart contract” and “gas”. It also has a very simple definition of “what is blockchain”:  https://blog.ton.org/what_is_blockchain

Hermès: In Tact level, can we check the owner of a NFT contract is a Wallet Adress or other Smart Contracts?

Hermès: Since I want my NFT contract to verify the ownership transfer before proceeding.  I'm looking for a way to ensure that the destination address is a valid wallet address and not some other type of address.   This will help prevent any potential issues that could arise from transferring ownership to an incorrect address(non-Wallet Address)

— 2023-04-01 —

Howard: Honestly, from my knowledge, you can't do that since walletV4 is also the smart contract itself.   This means you can't distinguish whether the address is a “Wallet” or whether the smart contract is for NFT marketplace purposes. (reply to 2824)

— 2023-04-02 —

Step: @talkol please check private message

— 2023-04-03 —

Иван: Hello guys. I’m curious are you a part of Telegram team? If you are not then how your code is excuted on their “virtual machines”? In other words how TON network able to supports your language?

Eugene: 1. Blockchain is decentralized, so the virtual machines are not "their". Different people may become part of the blockchain network and provide equipment to execute the code.  2. Tact language compiles to FunC, and FunC was supported by TON blockchain from the beginning. (reply to 2830)

Иван: Got it. My code in TACT will be translated to FunC with Nodejs. Now it’s clear. Thank you. (reply to 2831)

— 2023-04-05 —

Alex: Please tell me how to convert sender() to a human readable address, toString() does not work

— 2023-04-06 —

Howard: Are you asking if it's recommended to hardcode an address in your smart contract code?   I would recommend you that you can create a receive function that only accepts messages from the owner's address. (reply to 2835)

— 2023-04-08 —

Vivi: After I finished 123 steps,I can not run the last step

User<6247944943>: this is not for Tact I think

User<6247944943>: you are trying to install toncli? You can use Blueprint to compile FunC file more easily

— 2023-04-09 —

Vivi: I know but I cannot get toncli group chat

Vivi: I see and will try it, thanks 🙏

Vivi: I will try it, thanks!

User<6247944943>: https://github.com/ton-community/blueprint (reply to 2841)

Placeholder: Vivi can be not very familiar with unix tools in macos terminal and confused about ton developer echaosystem. They asked for help. Instead of helping them, you show them your superiority and discourage them from further hacking. Is such a behavior any beneficial for tact/ton dev community? (reply to 2845)

Андрей: Toxic (reply to 2851)

Howard: "Tact is good but no toxic here plz."

Vivi: Ton is the friendliest community I've ever seen, thanks to everyone❤️

Yuri: Hey guys, is it possible to define more than one path or use glob?

Steve: You can define multiple entry points or simply import other code from the main one

Yuri: I see, another project. Think I'll do the second option for now, thanks! (reply to 2858)

Seitaro: typo in inline (reply to 2857)

Steve: meanwhile this feature shouldn't be enabled

Yuri: Is it better to use @tact-lang/deployer and @tact-lang/emulator or do like tact-template repo?

Steve: i think template uses deployer and emulator

Yuri: I see, the repo in tact-lang is updated, but not in ton-core and ton-community (reply to 2863)

Steve: all work is in tact-lang

Steve: including template

Yuri: Do structs also have .toCell() method like messages?

Steve: yes, messages and structs are the same, the only difference is serialization format (reply to 2867)

Andrew: dude chill (reply to 2871)

Steve: No harassment in tact

Eugene: In other words, Tact developers should be tactful (reply to 2874)

— 2023-04-10 —

Yuri: The Address type would be equivalent to Slice?

Howard: You will need to convert to Slice data type with Address in FunC.  But in Tact will be much more easier, Address is Address. The Slice usually use for specific usage like forward_payload, here is the example:

Yuri: Got it. I'd like to know because there's a TEP standard that I would need to provide the address as Slice. I want to know if I can return it as an Address. (reply to 2882)

Howard: yes you can

Howard: Slice is just a data type that use quite often in TVM. Especially Cell and so on. 👍🏿

Yuri: Is there any shortcut for addr_none?

Steve: where do you need it? in general it uses addr_none in serialization, but nothing explicit and not in get methods

Yuri: I want to set some values later with an "Init msg", so it doesn't determine the contract address. (reply to 2888)

Steve: just make it nullable and assign null value

Yuri: Nice! thanks (reply to 2890)

— 2023-04-11 —

&rey: How to cast Cell to map<Int, [for simplicity] Int>? I want to parse config parameter 18 (storage fees), and getConfigParam only returns a Cell.

&rey: Also, how to get-and-delete the first key-value pair in dictionary? That's just binding to FunC stdlib function, right?

— 2023-04-17 —

Howard: maybe this is the example for your scenario? Claim the Struct you want for the message architecture.   If you mean to the return value of mapping  and get as a Cell, seems we can't at this moment. (reply to 2894)

Steve: right now just using native, but in 1.0 custom key serialization is not supported (reply to 2894)

&rey: I'm trying to load TON config parameter (#18), and it's dictionary (not cell with bit 1 and reference to dictionary, but dict itself), from which I want to extract value at certain key. (reply to 2899)

Steve: i recommend implement it in func right now and import it to the tact

&rey: I'd rather implement the whole contract in FunC, then) (reply to 2902)

Steve: good luck

Daniil: Hi guys, how can I convert Int to String (or something like this in tact)?

Steve: .toString()

talkol: fyi - https://ton.vote launch, which is going to be in about 2 weeks and will allow projects to create their own spaces and have governance votes with their own jettons and NFTs - is implemented in Tact 💪

Daniil: So, one more question. How do I join two strings?

Steve: Using StringBuilder

Daniil: Where can I find examples? (reply to 2910)

talkol: https://tact-by-example.org/02-strings (reply to 2911)

Daniil: thanks a lot (reply to 2913)

— 2023-04-18 —

Daniil: Hi everyone, is there an example of receiving Jetton Notification?

Howard: https://github.com/howardpen9/jetton-implementation-in-tact/blob/6a302b2325b5ed1150a3858686280bcbb3cd8511/sources/contract.tact#L252   Can take a reference here (reply to 2919)

Calvin | Impossible: Ooo nice ^

Daniil: My contract does not receive a notification, although it is in the transactions. What is wrong with the code? (reply to 2920)

Howard: 1/ where you put the second paragraph of code? In jetton Wallet?    2/ The TonkenNotification in Jetton is a message notification for your main core Wallet rather then the Jetton Wallet itself. (reply to 2923)

Dario: It does it at compile time or exec? (reply to 2906)

Daniil: 1. no. at the beginning of the code, after the imports 2. I know, and I need to be notified that my wallet has received tokens. (reply to 2925)

Daniil: As I can see, my wallet receives a notification with the correct op code, but for unknown reason the contract does not recognize this transaction. (reply to 2927)

Howard: I am guessing if you are trying to let "Charge a tiny TON when your Jetton Token being transfer", then you should add this extract Send method in the Transfer receive method.

Howard: oh, I asked this few weeks ago.    Right now the explorer didn't decode those informations. But you still can decode it by yourself. (reply to 2928)

Daniil: ok. is there any way I can get the op code of the transaction inside receive()? (reply to 2930)

Howard: https://t.me/tondev_eng/26762 (reply to 2930)

Howard: can't understand the question.   OP code is defined based on the Send method you defined by the data of the SendMessage itself. (reply to 2931)

Daniil: no, can I get the op code of the transaction inside the receive() function? (reply to 2933)

Steve: Right now it is runtime only (reply to 2926)

Howard: However, you can still set the OP code you want like this, but since Steve does not recommend doing so unless it is necessary for TEP standards, I assume there are some risks involved.

Daniil: which mode is default in tact's SendParameters?

Daniil: 1 or 3?

Steve: 0

Daniil: What are the risks here? (reply to 2936)

— 2023-04-19 —

Howard: catched in here https://t.me/tactlang/2754 (reply to 2940)

Steve: We will support bounced messages in 1.1 we are waiting for func hot fix

— 2023-04-20 —

Howard: Just want to share with you that I just tried to build an example of an NFT staking contract today. You can mint the NFT then: - Put the NFT into a staking status, although it's not strictly considered staking since the ownership of the NFT doesn't change. (*Compared with NFTs for sale on Getgems.io, where you have to transition ownership to a new contract.)  - The amount of TON each NFT can claim is based on the Weight it has in the total weight amount of the pool. The weight is based on the duration you choose when  staking.  - To put it simply, if we use the Transfer function(we defined on TEP62)  to stake the NFT, the Transfer function won't be able to bring the information of the NFT itself to the staking contract (e.g. rarity information, level of NFT like we did here in this example).  - But you can still implement your Transfer function with more customized information in custom_payload, although that could make the contract too complicated I guess.  More questions and expansion: 1/ Why don't you design the feature like the NFT sale contract in Getgems.io?  Since the core feature for NFT staking should be based on rarity, I added the Level to the NFT item itself (in code, randomly generated from 1 to 100). This means the ratio of the share you have in the staking pool is based on the level of the NFT itself and the duration you choose, such as 24 hours, 3 days, or more.  2/ What else can we do with this? Basically, we will need to add a "cool-down" feature, so people can't flash deposit and stake NFT to get a heavy share of weight and then claim the TON coin, etc.  3/ Can we implement Jetton claiming as well? Sure, we can! But since I think it's easier to implement this staking feature here than staking NFTs and then claiming Jetton tokens.

Daniil: What's the idea behind this? Collection owner will just share their funds to NFT stakers? (reply to 2944)

Howard: I don't know, any feedback or any FunC code want to migrate in Tact feel free to DM me.  The idea is that I hope to get more feedback for the code itself, since I'm trying to build something in production but can't find reliability or auditing support(more code I already tried). I believe that sharing more code in the community can help Tact grow more quickly.

Daniil: Oh, so just to showcase the real Tact usage examples. Okay

Howard: Maybe you can route the Royalties fee to the staking contract? There are some use cases for this in the ETH ecosystem. (reply to 2945)

Steve: Added externals documentation:  https://docs.tact-lang.org/language/guides/external

Steve: Added docs for virtual and abstract constants: https://docs.tact-lang.org/language/guides/constants

Howard: 🔥 (reply to 2951)

Steve: Also a new bounced handlers: https://docs.tact-lang.org/language/guides/bounced  So much easier to work now!

Steve: Guys what's missing?

&rey: Diff between virtual and abstract consts. (reply to 2954)

Steve: abstract doesn't have default value as in any language

Howard: maybe more in deep example? Like how we can trigged the external message here? It's a TypeScript code to send the String? (reply to 2953)

Steve: bindings are not built for external messages, you have to construct them directly

Steve: this is for advanced users

Steve: Just added sending externals as you asked

Steve: ⚡️Tact v1.1.1  Bugfix release that fixed bindings generation for new custom key and value types in maps, adds external message sending in bindings  https://github.com/tact-lang/tact/releases/tag/v1.1.1 (forwarded from TON Development News)

Howard: LFG (reply to 2961)

— 2023-04-23 —

Daniil: if I set some value of a Map to null, does it actually delete it from there? is it a correct way to remove the elements of a Mapping?

Daniil: oh, someone have asked that before. (reply to 1980)

Steve: Yes

— 2023-04-25 —

nonam3e: hey all, Are func functions like dict_get_min?() dict_get_max?() dict_get_next?() dict_get_prev?() implemented in tact? Is it possible to use inline func in tact?

Steve: you can import func files into tact and define native functions to use them

nonam3e: can you give me an example? I looked through tact documentation https://docs.tact-lang.org and haven't seen examples of defining native funcs. (reply to 2971)

Steve: https://docs.tact-lang.org/language/guides/functions#native-functions

nonam3e: got it, thanks (reply to 2973)

Steve: importing func code is as simple as tact one: import "./code.fc";

Steve: func stdlib is already included though

nonam3e: Should it look like this or I can't use structs for it? struct DictGetMinResult {     minKey: Int;     value: Slice;     flag: Int; }  @name(dict_get_min?) native native_dictGetMin(dict: Cell, key_len: Int): DictGetMinResult;

Steve: you can, they are mapped to tensors as is

nonam3e: nice (reply to 2978)

nonam3e: I was worried about it

nonam3e: Is there an option to convert Slice to some struct? Or should I do it manually using funcs like load_ref ?

Steve: Manually

Steve: What’s the usecase?

&rey: (Cell to some struct) Parsing config parameter containing dict of (shard id) —> (storage fees). (reply to 2983)

nonam3e: To use previous native function as it is for any value type of a map (reply to 2983)

Steve: For this usecase it is better to just write parser manually (reply to 2984)

&rey: To be honest, all those difficulties just make it easier to use FunC and not to worry about Tact/Rift limitations 🙂 (reply to 2986)

Steve: Feel free to use func

Howard: 🧐 Maybe you could share more examples about this. Otherwise, I think it could significantly increase the learning curve for developers with intermediate-level skills.   After all, our goal from the beginning was to make the language-learning process as simple as possible, wasn't it? (reply to 2987)

&rey: Here's the code of Stabletimer at the moment I abandoned Tact. https://github.com/ProgramCrafter/ton-stable-timer/blob/tact/sources/contract.tact (reply to 2991)

Steve: I doubt that reading storage prices is useful since it represents only current price, but not the stuff that could be in the future unlike other fees

— 2023-04-27 —

Howard: Thinking that can we store the TransactionHash once it is executed? More liks this in Solidity

Howard: *checkSignature is for wallet signing. I would like to point out that in Tact, Hash is stored as an Int.   And I can't find what I need in FunC as well: https://docs.ton.org/develop/func/stdlib#hashes

Steve: i don't think you need to store tx itself since storage event would be emitted within transaction itself

Howard: Oh. Thinking can use Transaction Hash put as an integer source which is randomly generated(at least confirmed after the tx is executed (reply to 2998)

Steve: What’s the use case though?

Howard: Trying to put the Hash of the transaction put as a parameter for the NFTs itself.

— 2023-04-28 —

sd: good evening always get func compilation error with tact-template what should I do? 🥲 win10  /same error when starting from scratch

Howard: What is your Tact file looks like (reply to 3003)

Kon: https://github.com/tact-lang/tact/issues/39 this known issue (reply to 3004)

Igor: https://t.me/tactlang_ru  Нужно популяризовать TACT, чтобы он оставался актуальным и востребованным! Создал чат для русскоязычного сообщества. Надеюсь администраторы меня простят за рекламу 🙃   Всем мир!

— 2023-04-30 —

Howard: Are there any permissionless DEXs currently available? I want to practice implementing addLiquidity for the DEXs built using FunC.

— 2023-05-03 —

Gajesh: i remember some rewrote nft contract in tact. does anyone have the link to it

— 2023-05-04 —

Gajesh: anyone? ^^ (reply to 3011)

Alex: @howard_peng  https://github.com/howardpen9/nft-standard-template? (reply to 3016)

Gajesh: thanks! (reply to 3017)

— 2023-05-07 —

Howard: Helping people deploy their first NFT contract in Tact today at FOMO BKK.

— 2023-05-08 —

Howard: For Jetton token transfer:  What if we want to allow the owners to transfer (stake) jetton in a staking contract by implementing "advanced Tx in Transfer messages"?  - Should we implement msg: Stake in custom_payload or forward_payload?  - Has anyone tried this before?

Andrew: in Tonpay I use custom forward_payload to trigger a chain of complex actions upon receiving the jettons (reply to 3022)

Howard: oh, you were using Tact for that or FunC? (reply to 3023)

Andrew: func

— 2023-05-09 —

Howard: Hey @Arterialist, I have tried using both "custom_payload" and "forward_payload" on both sides.  Here is my TypeScript code that compresses the data format I want to send with, which is the message format I want to execute.   In this case, it is the "Stake" function in my Staking contract, and it is the new owner of this Jetton amount. (Shows in second graph, and those modules were generated by Tact lang)

Howard: The Staking Contract will got exitCode: 130, which is "Invalid incoming message".   My assumption is that, we can't compressed the "Stake Message format for the Staking contract" like that?   Since the Cell data should be correct. Maybe someone had tried this before as well? (reply to 3029)

Howard: This is my StakingContract code for Stake method then. (reply to 3031)

Andrew: you need to handle op::transfer_notification from jetton-wallet.fc in your Staking contract (reply to 3032)

Andrew: and your Stake  message will be inside the forward_payload in the transfer notification

Howard: ohhhh, you mean implement   message(0x7362d09c) TokenNotification {     queryId: Int as uint64;     amount: Int as coins;     from: Address;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton  }  in my staking contract? OK, interesting. Let me try out. (reply to 3033)

Andrew: yes (reply to 3035)

Howard: OK seems works. Although we can't see the "Message" itself in Comment area on Explorer.

Howard: But yeh, I think I get your point and understand how "Jetton Transfer" implement in other "non-wallet contracts". Thanks a lot @Arterialist !

— 2023-05-10 —

Howard: let's say I store Address into a Cell in TypeScript, which function I can use in to load the Address?

Andrew: .loadAddress() (reply to 3042)

Howard: Seems docs missed loadAddress?

Howard: ah, okok

Howard: A question arose while dealing with a staking contract: The Jetton staking contract receives a message from TokenNotification(0x7362d09c), but the message itself doesn't contain the "Jetton Minter Contract information".  My question is, how can we ensure that the user is transferring the correct Jetton token into the staking contract?  - I know the staking contract I wrote can functionally support all the transferred tokens, but in our case, we don't want that.   - In other words, how can we define a "Wallet Contract" that can only receive a specific Jetton token?

Howard: Oh, you might suggest editing the logic inside the TokenTransferInternal, but since not all jetton tokens would support that, it might not be a feasible solution. For instance, the WrappedTON contract is already deployed in the FunC file."

Andrew: you need to know the jetton master address of the jetton you want to receive, as well as jetton wallet code for that jetton. Upon receiving the transfer notification, you can calculate the correct address of the jetton wallet using that data + sender address from transfer notification forward payload, and compare it with the sender address of the message you received (reply to 3046)

Andrew: refer to https://docs.ton.org/develop/dapps/asset-processing/jettons#jetton-processing-on-chain

Andrew: here you can see the address calculation logic for jettons in func - https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-utils.fc

Howard: I see, same as NFT item <> NFT Collection tho. got it got it.   So basically I will need implement/import the Jetton Wallet contract initially with my Jetton Staking contract tho(to catch the init code)

Howard: will you like to help with me check our Tact version of Jetton Wallet code(init code) is the same as the jetton token in FunC? (oUSDT, iUSDT, wTON... so on so for)  I think I will take times to do so as well tho. (reply to 3050)

Andrew: let's try (reply to 3052)

— 2023-05-11 —

Howard: OK, since the Tact version of jetton code in init Cell might be different with the FunC one.    I will say if you want to build any expand contracts like DEXs or Staking contract in Tact, you will need import these functions to fetch the correct Jetton Wallet init_code (reply to 3050)

— 2023-05-13 —

Howard: 🔥

Howard: Does anyone try out `emit()` yet?  And how we read it off-chain through RPC?

Daniil: Wow! It's very good that this was added to Tact.  These are external messages or "messages to nowhere". They can actually have some kind of  a recipient (just an arbitrary bytes value). They are stored in blocks as any other messages, so you can access them using any preferred API. (reply to 3059)

Howard: what API you mentioned? to fetch data from on-chain event emit()

Howard: From my understanding, this is the method that we can monitoring "Minting process" is success or not right? Rather than just Error ExitCode stages.   This is exactly the same as emit in Solidity

Howard: 🥵 need to know how to fetch the emit() data through the TS file we got after compiled

Howard: Sure, here's your text with improved grammar and an attempt at providing a potential answer:  Fundamentally, a message will be delivered "on-chain", but it won't be directed to any specific address.  However, the current challenge for me is finding an API that can assist in fetching information from the body of the message, so I can decode the message for the emit message I've set.  In this screenshot, it's 0xcdbea1c3. (reply to 3064)

&rey: *I suppose you already have some way to fetch account transactions. You need to fetch transactions and check outgoing messages. The messages directed to null are external-out messages. (reply to 3064)

Steve: i have a very hacky library that could parse messages using ABI: https://github.com/tact-lang/ton-abi  Here is an example how to forward types from bidings: https://github.com/tact-lang/tact-emulator/blob/a9a41d0be50cf03612bfbf15814c3a716cbccac2/src/emulator/ContractSystem.ts#L175  Then just call registry.parse and it would hopefuly parse your message  It does not support everything, i think dicts are not implemented.

Howard: The practical uses for this feature (please correct me if I'm wrong) are:  1/ Compared to sending a message to a contract, storing it, and then using the get method to read it from on-chain to off-chain, using emit() can help us avoid paying high gas fees to check the data.  2/ Another advantage is the lower latency since you can read the message through the "out message body", decode the message, and get the data we want by fetching the transaction data from the API. (reply to 3069)

Steve: it is useful to store some kind of logs, for example when NFT was minted explicitly

Howard: Thanks! Followed the modules we got in TS files, I tried to decode the message I got here like this:  "te66ccu...." is the message I got from dton.io API. (reply to 3067)

Howard: but will get error since the { throw Error('Invalid prefix'); }

Howard: 1/ Is the approach I tried incorrect? 2/ @steve_kite, could you please explain why we need the ABI in your previous reply? (reply to 3075)

— 2023-05-14 —

Howard: I had try this tho, but didn't success..... (reply to 3069)

&rey: te6ccu... is BOC, you can base64-decode it and feed into something like Cell.oneFromBoc. (reply to 3075)

Howard: 1/ what is Cell.oneFromBoc means?  2/ Oh and we succeed! I solve by doing this:

Howard: YES, I think for dton.io giving the graphQL that can fetch the BOC data for the message output is great!

Howard: So this is the way that we can get out_put message from the ABI code?  Like this te6cc.... BOCs data inside of a message output? (reply to 3069)

Brave: 👨‍💻 (reply to 3085)

— 2023-05-15 —

Howard: Can we enforce a transaction to bounce back even if the user sends a Transfer method with bounce: false?   For now the TON will stuck in the contract for mistake.  (This line of code is the TS file)

Daniil: That's the purpose of setting "bounce: false" — to force contract not to bounce back on errors (reply to 3087)

Daniil: Why would you want it to still bounce

Howard: for some cases, like "only certain amount of TON in the contract then enable to claim...etc" (reply to 3089)

Howard: One proper solution might be using a parameter storing the Number of balance(and modified once message change contract status), rather than using "myBalance()". (reply to 3091)

nonam3e: I'd use require() statement in this situation. (reply to 3091)

Daniil: Then why would the user send with bounce: false flag? (reply to 3091)

Howard: Because if we set limitations using myBalance() and allow users to send transactions with bounce: false, it may create an incentive for users to increase the balance of the contract by continuously sending such transactions themselfs. (reply to 3094)

Brave: "Tact is bad but more toxic here plz." (reply to 2854)

— 2023-05-16 —

doni: ignore then

— 2023-05-17 —

Roman: 🚀 Hello, Tact Community! 🚀  We've just launched the new awesome-tact repository on GitHub! It's a curated list of resources designed to help you learn and program in Tact for the TON Blockchain.  🔥 We've put together everything from official resources, developer tools, libraries, to smart contracts examples. But we need your help to make it even better!   🙌 We invite you to contribute your own resources, tutorials, articles, libraries, or anything that you've found useful while coding in Tact. Let's make awesome-tact a one-stop resource for all Tact developers.  Plus, don't forget to give it a ⭐️ star on GitHub to show your support. Every star helps to bring more attention to Tact and our vibrant community.  🔗 Here's the link to the repository: https://github.com/tact-lang/awesome-tact  Let's make Tact shine together! ✨

Eugene: The repository looks great!   My article https://blog.ton.org/the-story-of-tact doesn't directly "help to learn Tact", but I think it might add valuable context — maybe it's a good idea to add it?   Created a PR for that: https://github.com/tact-lang/awesome-tact/pull/2 (reply to 3103)

Roman: Thanks! Merged! (reply to 3104)

moono: I hate func Language, too difficult to learn... Tact is better than func? there are many references?

Howard: Lots of reference

— 2023-05-19 —

Howard: - https://github.com/howardpen9/nft-standard-template - https://github.com/tact-lang/tact-template - https://tact-by-example.org/all (reply to 3106)

Howard: All decent examples here! (reply to 3111)

moono: wow thx very much sir :) (reply to 3111)

— 2023-05-20 —

Nick: Hi, guys. I’ve faced with an issue of backwards compatibility of contracts on Tact  My v1 version had one kind  generated of opcode value for the operation, but v2 had a different generated opcode for the same operation  I know I can manually change auto generated by Tact funC code  and to insert the v1 opcodes values   But still, is there a more correct way to support backwards compatibility of already deployed and used contracts

Steve: op ids never changed starting from v1.0.0 everything before was marked as unstable. So I don’t think opcodes are changed, but you can override it’s value just put it in the brackets after keyword message

Nick: Thank you, makes sense

nonam3e: is break keyword for loops implemented in tact?

Steve: no, since it is not implemented in func too

&rey: Move the loop into its own function and use return. (reply to 3117)

nonam3e: Have someone got an error like Func compilation error: path/sources/output/project_contract.code.fc:122:190: error: parameters of an assembler built-in function must have a well-defined fixed width   forall X0, X1, X2, X3, X4, X5, X6, X7, X8, X9, X10, X11, X12, X13, X14, X15, X16 -> tuple __tact_tuple_create_17((X0, X1, X2, X3, X4, X5, X6, X7, X8, X9, X10, X11, X12, X13, X14, X15, X16) v) asm "17 TUPLE";? I stored many dict types in the struct and everything was ok, but I added a Slice? to it and received the error

— 2023-05-22 —

Howard: One advanced application of msg.forward_payload: Is it possible to append the data of the NFT item itself after the Transfer method has been executed? According to TEP62 here (https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md), they "should be equal".  However, since we can't directly view or fetch information from the NFT itself using view/get function, we have to solely rely on the message.

Howard: I am endeavoring to construct an NFT staking system. My NFT may be based on Levels or on-chain rarity, meaning that a simple transfer wouldn't suffice.  What I need is a transfer method that includes the NFT's storage data information within the forward_payload for certain. (reply to 3121)

Seitaro: The are two limits: one of funC level (no more than 16 arguments for asm functions) and another one on TVM level (TUPLE opcode only accepts up to 16 variables, for more TUPLEVAR should be used). (reply to 3120)

Seitaro: So we need Tact to get updated to solve this. Second issue is easy, while proper solution of first one requires either either fix on funC level or dirty hack, something like forall X0 ... X15 -> stash_16_elements((X0 ..., X15) v) asm "NOP";

nonam3e: Oh, I didn't know about it. I managed to compress this struct and the problem is solved. Btw how does tact store struct? Firstly I thought tact stores it in one cell and I had an error because of the limits of the cell (reply to 3123)

User<6247944943>: Is it more gas-efficient if we can claim the integer data type inside a mapping?

nonam3e: Is it internal wasm error? RuntimeError: Aborted(OOM). Build with -sASSERTIONS for more info.     at abort (/path/node_modules/ton-tact/dist/func/funcfiftlib.js:9:6437)     at abortOnCannotGrowMemory (/path/node_modules/ton-tact/dist/func/funcfiftlib.js:9:81074)     at _emscripten_resize_heap (/path/node_modules/ton-tact/dist/func/funcfiftlib.js:9:81193)     at wasm://wasm/00a881aa:wasm-function[668]:0x2c8ed     at wasm://wasm/00a881aa:wasm-function[210]:0xf74e     at wasm://wasm/00a881aa:wasm-function[87]:0x4bc3     at wasm://wasm/00a881aa:wasm-function[1831]:0x9cc54     at wasm://wasm/00a881aa:wasm-function[531]:0x246d6     at wasm://wasm/00a881aa:wasm-function[573]:0x279d3     at invoke_vii (/path/node_modules/ton-tact/dist/func/funcfiftlib.js:9:101167) FunC compiler crashed Error: Unexpected compiler response     at funcCompile (/path/ton-tact/dist/func/funcCompile.js:97:15)     at async build (/path/node_modules/ton-tact/dist/pipeline/build.js:86:21)     at async Object.compileProjects (/path/node_modules/ton-tact/dist/main.js:49:9)     at async /path/node_modules/ton-tact/bin/tact:18:9 💥 Compilation failed. Skipping packaging

Steve: yes, this is a memory overflow, i suppose you have quite complicated contract?

nonam3e: yeap, it's pretty big. How can I resolve this problem? (reply to 3128)

Steve: func sometimes can't compile complicated contracts, i would recommend to see the place where it fails and try to split code to separate functions

Steve: IIRC next release of func would improve this

Seitaro: If you can isolate part of the code that have such behavior - please send it to me. (reply to 3127)

Seitaro: We know a few ways to make compilation very very long, but all off them are quite synthetic and should not occur in real life.

nonam3e: The contract doesn't really have complicated functions. It just has a lot of data in it and many simple functions. So I don't know if there's a reason to try to find the place where it crashes (reply to 3132)

&rey: Maybe you could deploy the contract with less data in init state, then fill storage with the first message? (reply to 3134)

nonam3e: Firstly I'll try to compress it a bit, maybe it would help (reply to 3135)

nonam3e: I deleted this one function and one address from the data and it compiled

nonam3e: So it's just too large to compile

— 2023-05-23 —

Ilya: Could you please tell me how I can iterate over a dictionary in a loop?

Howard: there is no dictionary in Tact? any code example you can point out? (reply to 3140)

Ilya: I mean map type (reply to 3141)

Howard: I will set a parameter to count the total length of the map, b/c there is no way to get the length of a map directly.

User<6247944943>: For the gas-efficiency, what is the best choice to use: 1) require  2) if...{} statement?   Like here

Steve: First one

Ilya: In this example, I'm simply writing the message as a whole. However, what I actually need is to append the data each time a new message is received. When writing, it is necessary to check if the key exists. Yes, I am aware that there is no length or count method for dictionaries. Of course, I can keep track of the dictionary's length, but how can I compute it? (reply to 3143)

Steve: It is unavailable in ton, you have to count it manually

Ilya: Am I understanding correctly that this task can only be solved using the Map type if I'm adding only one entry at a time, and in that case, I can keep track of the length? (reply to 3146)

Seitaro: on TVM and funC level there are opcodes to check whether there is this key in the dict and "add/set" ops (add - adds key-value only if key is non-existent). I'm not sure whether there is native functions for maps which implement it, but probably you can add funC wrapper (reply to 3148)

Seitaro: you also can keep track of map length too

Ilya: Oh, I can store count in PushMapMessage... 🙉 thank you!

Steve: you can just get value by key and check if it is null (reply to 3149)

Ilya: Yes, I know that, thanks. The problem was that I had bound to the map type in PushMapMessage. In fact, an array was needed here. Later today I will throw off the code here, what happened. (reply to 3152)

Howard: can use a index to track the length of your mapping? (reply to 3153)

Howard: If the get_value of mapping is null then the that value key didn't in the mapping so you can store it to the mapping and adding in self.index

Howard: @steve_kite I think the latest template of Tact is more difficult to use? How can we put the packed info in here again?

Howard: Compared with the previous deploy method, user can easily import & understand the packed info we got from TS file.

— 2023-05-26 —

Howard: The default operator for << and >> is cool.  Math Operator: - https://tact-by-example.org/02-integer-ops - https://docs.tact-lang.org/language/ref/math#pow

Howard: - Is there any possibility that the contract could be invoked by others even if we set the code like this? There's no chance of that happening, correct?  - What's the difference between using the Trait from the deployable standard code base (for instance, importing the deployable library by @steve_kite )?   - Does it lead to improved gas efficiency?  https://docs.tact-lang.org/language/libs/ownable

Daniil: 1) correct (reply to 3159)

— 2023-05-27 —

Howard: As I know, the data we can put in a Cell and pass in forward_payload (Slice) is like 256 bits right? (reply to 3121)

Howard: What if we store more than that? The receiver will not enable to receive the NFT? Or we can't decode the informations in that field?

Howard: yeh, followed the first question, I am testing with NFT Staking: Stake NFT then get Jetton Token.  I think using Tact is way more easy to implement those business logic. (reply to 3122)

Daniil: Why? It can be arbitrary cell (reply to 3161)

Howard: sorry, 1023 bits. Not 256 bits. hhhh (reply to 3164)

Daniil: I'm sure it can also have references. (reply to 3165)

nonam3e: Hello everyone. I caught the same error while compiling another smart-contract. It's kinda strange but deletion of receive() {} solves the problem. And when I add another receive or add some data in the contract it crashes the compiler (reply to 3127)

— 2023-05-28 —

Howard: would you like share the code? (reply to 3168)

nonam3e: Updating tact lib solved the problem. Should've done it much earlier

Howard: For the contract initial deploy, why will I get exitCode:130 if the body is null?

&rey: Probably your newly deployed contract throws error with code 130 if the body is null. (reply to 3171)

&rey: Is that contract written in Tact?

— 2023-05-29 —

Ilya: Hello everyone! Could you please advise me on how to correctly import files? I've seen examples in listings like import "./somelib", but it doesn't work for me. What am I doing wrong or what am I missing?

— 2023-05-30 —

&rey: Have you tried import "./structs.tact"? (reply to 3175)

Ilya: Yes, tried this and many other variants, everything that just happened in my head (reply to 3176)

Steve: Windows?

Ilya: Ubuntu (reply to 3178)

&rey: What directory are you running the compile command in? (reply to 3179)

Ilya: Parent for contracts

— 2023-06-01 —

Slava: Hello!  Who can help with high resolution Tact logos?

Andrew: like so? (reply to 3183)

Slava: Thank you. Is this the only Tact language logo or is it used for this group? (reply to 3184)

Andrew: idk, I just recreated the group's logo in vector (reply to 3185)

— 2023-06-02 —

Yuri: Hey guys, trying to build Tact using npx blueprint build, getting the following error:

Howard: never try to using FunC before in Tact. What library you want to use? (reply to 3187)

Yuri: I just setup the Tact blueprint environment

Yuri: And executed npx blueprint build

Yuri: Also tried to install @tact-lang/compiler as a dev dependency but didn't work

— 2023-06-03 —

User<6247944943>: ❤️

— 2023-06-05 —

1.1: it's a TON of lies, they're all fake scammers, don't believe them, they're all a dime a dozen

Dima: Who (reply to 3196)

— 2023-06-06 —

Howard: welcome (reply to 3199)

October 😃 🟣: Great to be here

pongtap: IY8*&BRp*2

— 2023-06-08 —

Howard: New Project is looking for open auditing, it's built by Tact-lang: https://gitlab.tonb.io/pub/contract/-/tree/main/sources

— 2023-06-09 —

Howard: Honestly, would like to know how / where they found the audit 😂😂😂 (reply to 3209)

nonam3e: Func devs and ton devs with advanced level (reply to 3210)

Daniil: What do you mean? (reply to 3210)

F: gm)

Hakiem: Hi, is there any Tact equivalent of event (in solidity)?

talkol: You can output a log (reply to 3215)

User<1810392154>: ,gtt4u  oikl

Steve: Yes, it is called emit() (reply to 3215)

— 2023-06-10 —

Hakiem: Thanks! Do you have a link to the docs for emit()?

Howard: https://tact-by-example.org/03-emit (reply to 3223)

— 2023-06-12 —

Hakiem: Hey @howard_peng. For the nft-standard-template, is there a way to deploy the contract without minting the first NFT? I believe 'body' variable in line 12 of contract.deploy.ts contains the bin message to be appended to the deployment link. I've tried replacing "Mint" with an empty string or changing the 'body' variable to be of type string but the transaction always reverts.

Howard: Yes, that was the purpose for people to easily understand the on-chain transaction since you and your users can check on Explore and know that they were sending the transaction with the comment text to mint the NFT.  You can expand the message (TL-B) format based transaction by changing the Tact file, such as coding Transfer as 0x5fcc3d14.  You can also add more receive method functions and call them using self.mint, which is the internal function we have already defined in the code below. (reply to 3225)

Hakiem: Hi guys, is const not supported in traits anymore? I get this error  Syntax error: expected ":"  Line 2, col 11:   1 | trait TestTrait { > 2 |     const minTonsForStorage: Int = ton("0.03");                 ^

389538: Mom some jumpman fight

— 2023-06-13 —

Badsha Khan: welcome

Hakiem: Hi guys, what is the syntax for abstract methods in traits and the corresponding override in the child class/contract? Cant seem to find in the tact docs

Howard: https://github.com/ton-blockchain/TEPs/pull/123  Might be quite important for Tact community as well.

— 2023-06-15 —

User<5841048263>: Hello everyone

IKke: is there a solution? can't find anything (reply to 3192)

Howard: @steve_kite is it possible to bring the Contract Upgrade to the reality faster? Since I have couple of contracts that might need re-redeploy if the bugs need to fix

Howard: https://github.com/tact-lang/tact-vscode   I like the updates in repo that we have formatting now. 👍🏿

Yuri: Switched to FunC for the time being (reply to 3242)

Silver: hello

— 2023-06-16 —

User<6247944943>: What is the size of Slice in bits?

Step: size could be dynamic? (reply to 3249)

User<6247944943>: Does that means getgems.io will pass the 0 in the forward_payload?

User<6247944943>: For reading the data from the Slice to Uint in Tact, what is the difference between uint(target_Slice, 32) and uint(target_Slice, 16)?

Step: Getgems requires forward_payload

Step: in getgems forward_payload contains sale config

Step: 1. reading 32 bit unsigned integer 2. Reading 16 bit unsigned integer (reply to 3253)

Howard: Proof-of-Testing

— 2023-06-17 —

Howard: need upgradable contract method🙇🏿‍♂️ (reply to 3243)

Howard: The standard default function we can use — self.forward  , Source  Need to notice that it's with mode SendRemainingValue tho. It only suitable when you want to send one single message transaction to fallback.

Howard: Like here: (reply to 3264)

Howard: why do we need called the nativeReserve here?  Reference: https://docs.tact-lang.org/language/ref/advanced#nativereserve

Howard: anyone got this error when running the latest Extension?

Asher: Hi all! We invite pros on Tact to the our team.  Please PM if interested. We develop training channels for development in the TON blockchain - https://www.youtube.com/@TONDevStudy and https://www.youtube.com/@WikiMar

— 2023-06-18 —

Howard: I got this error once I migrate to @tact-lang/emulator?

Howard: ok, never mind. Will just take reference to Steve latest project to expand my code example.

Pablo: "Good morning, I have been searching for the representation of an int as an alias, I'm not sure if I'm explaining myself correctly. In the 'send' method, it receives a 'SendParameters' object which has a 'mode' property. This property is of type Int, and in a TACT example, I found that they set the 'mode' value to 32+128, but I can't find an explanation. Can someone help me?"

Мертвый человек никогда не возвращается к жизни: Hi

— 2023-06-19 —

User<6247944943>: https://t.me/tactlang/2724 (reply to 3275)

Pablo: 😱🤩😘😘😘😘

— 2023-06-20 —

Hakiem: Hey guys, how to parse cell as string in ts?

Hakiem: how would you parse newContent as string to get back string_first?

Howard: 1/ Read the cell data. 2/ Decode it from base64. 3/ Parse it into a string.

Howard: https://github.com/howardpen9/nft-standard_in_tact  Just update a bit (reply to 3111)

Howard: anyone got this error before?

Howard: I am using the          let jettonMaster = Address.parse("EQ-----ADDRESS-----");    But seems test-libraries didn't accept with it

nonam3e: try open the contract and send a message to it (reply to 3288)

Howard: question: What is the maximum usage for a Slice?

Howard: I am curious about whether the Slice will explode if we doing this.   Since my contract failed to receive the Tx. Maybe I will test it in test-net tho.

Daniil: Slice can contain up to 1023 bits and 4 references (reply to 3291)

Howard: On the other hand, how we fetch the error code if I want to track the contract receive the message?

Howard: In this case, the address in the "To" field is the NFT item I just generated. However, I want to check the status of the NFT item, but it appears that there is no data available for it.

Howard: What will the bits use when we use this .storeBool? (https://docs.tact-lang.org/language/ref/cells#builderstorebool)   Should I use targetSlice.loadInt(2) to fetch it?

nonam3e: builder __tact_store_bool(builder b, int v) inline {     return b.store_int(v, 1); } 1 bit (reply to 3297)

— 2023-06-21 —

Vladimir: Hi everyone! Is there option to debug Tact via blueprint?

Vladimir: I see this option only via tact-emulator

User<6247944943>: 👍🏿

User<6247944943>: yeh,  tact-emulator (reply to 3300)

Vladimir: But is it possible to combine tact emulator and blueprint tests? (reply to 3302)

User<6247944943>: yeh

Vladimir: Can you help me with it?) (reply to 3304)

nonam3e: npm create ton@latest and choose tact in the console (reply to 3305)

Vladimir: It’s not my question:) I know how use blueprint. There isn’t tact-emulator by default. (reply to 3306)

Vladimir: And commands as these don’t work

Vladimir: Also there isn’t tact.conf.json in the blueprint

Vladimir: Maybe is there option to work with jest.config.json to enable debug ..?

Howard: it was for tokenized products but need to validate them more (forwarded from You)

Howard: anyone thinking in ERC1155 implement in TON as well?

Howard: Tokenized NFT

— 2023-06-22 —

User<6247944943>: @gajesh can we use NFT SDK to fetch floor price of any collection maybe?

Howard: maybe you create a pr for it? (reply to 3307)

User<6029046490>: Algien

User<6029046490>: Ke me ayude

Howard: Hey, I think the requirements are almost the same, right? Do you want to write more test cases, or are you simply planning to incorporate blueprints using @tact-lang/emulator? (reply to 3302)

Hakiem: how to achieve this in ts? the Cell.asSlice().asString() equivalent (reply to 3282)

Hakiem: okay i managed to do this using Cell.asSlice().loadStringTail() (reply to 3319)

Howard: Which API can better fetch all the data for an NFT collection, though?  I'm thinking about how we can fetch all the NFT items with certain values for their attributes.

Denis: dton.io/graphql ? (reply to 3321)

User<6247944943>: So, if the value of Bool is true, we will store -1. If the value of Bool is false, we will store 0.   But what if we want to store null? Can we put in 1?   In other words, can we use the if {}...else if {} statement to achieve the storeBool method? (reply to 3297)

User<6247944943>: and store in a 1bit size of data in the Builder datatype (reply to 3298)

Howard: Will the cost of storing the value into the mapping increase recursively as the list grows larger and larger?  For example, will the cost for ID#1 versus ID#100 be the same? Or will the gas cost differ?

nonam3e: Yes, it forms a binary tree, so it grows with O(log(n)) (reply to 3325)

Howard: 🤯🤯🤯 (reply to 3326)

Howard: The cost of storing is as high as the removing?

Daniil: Actually it's more complex, but for simple approximations that's enough (reply to 3326)

Howard: ok, maybe I need use "Sharing" your data in to separate Addresses like NFT Collection tho

Howard: then based on the Message-based feature to pass each Contracts' data to the main contract? Probably better.  Just store the data in each Contract Addresses like NFT Item rather than in single one!

— 2023-06-23 —

Vladimir: Hi friends, 👋  Many of us here are trying to figure out Tact and want to be able to create our own smart contracts. So, I decided to share with you my free course on developing smart contracts in Tact!  The goal is to make entering into the tone of development friendly.  In this course, I've tried to make it as easy as possible to explain all the intricacies I know. We'll start with the basics, from creating and testing a smart contract.   Lesson Titles:   Video 1: Introduction to TON  Video 2: Installing and setting up the development environment, the first smart contract  Video 3: Syntax and data types in Tact  Video 4: Messages between contracts, Throwing Errors  Video 5: TON coin sending, working with gas  Video 6: Syntax and data types in Tact 2  Video 7: Traits.  Video 8: From ERC20 to Jetton.  Video 9: The nft collection contract  Video 10: The first dapp on TON integrated with Telegram  Two lessons have been done so far. And please don't forget to forward this message to friends who also want to start developing on TON. We'll make our community stronger together!  Link to the first video 👇  https://www.youtube.com/watch?v=Vf3Fx7qgL6k  P.S. Keywords: "Where to Start Learning Tact", "Smart Contracts from Zero", "Practical Lessons in Tact", "Tutorials"

Slava: Community, give your feedback on these videos so they can become even better. (reply to 3332)

Howard: How can we implement external signing to trigger transactions in Tact? For instance, let's assume I want to send an order or transaction for minting an NFT once a user signs in with their wallet.

nonam3e: I think for your purpose it's better to use internal messages. This way users pay for themselves. (reply to 3337)

Howard: but I remember we have the Signing like EVM tho?

nonam3e: yeah, you can check ed25519 signature using checkSignature method. Also secp256 will be added soon and now is available in testnet. (reply to 3339)

Howard: Oh really? I see.

Howard: How about Upgradable contract as well!! 🫶🏼 (reply to 3263)

User<6029046490>: Hola

— 2023-06-24 —

User<6247944943>: gm

Howard: I hate O(log(n)) tho 😵 (reply to 3326)

Howard: Do the mappings in FunC and Tact have the same disadvantages as those in TVM when it comes to sorting values? For example, if I want to build an order-book-based trading system, what would be the best design case for this? Should I structure the order book as an NFT collection, where each OrderID represents an NFT item?  Would that approach help to mitigate the sorting problem and save on gas costs? Even so, we would still need a mapping to store which Int is smaller or larger, right? (I.e., sorting the orders based on an integer value). (reply to 3326)

Howard: Alternatively, following the model used in Ethereum, we could calculate the current order-book situation off-chain, aggregating all the orders later in an off-chain database maybe?

nonam3e: What kind of disadvantages do you mean? You can go through the map from min to max key values using dict_get_min and dict_get_next functions (reply to 3346)

Howard: Don't think it's on Tact yet. And storing value in mapping is gas cost right. (reply to 3348)

nonam3e: You can implement it in tact using native functions (reply to 3349)

Amin: پیام بالا رو بفرست☝🏻  پیام بالا رو برای 10 نفر بفرست و بهشون بگو اینجا میشه بدون هیچ سرمایه ای پول در آورد.   اینجوری هم داخل کانال پرایوت عضو میشی و از اینترنت آزاد بدون هزینه و رایگان استفاده می‌کنی🌐  هم میتونی خیلی سریع 10$ دلار (معادل 500 هزارتومان) اولت رو از ما بگیری، بعدش هم میتونی 10 نفر 10 نفر مخاطب بیاری و 10$ دلار 10$ دلار (معادل نیم میلیون تومان) از ما پول نقد بگیری 😘  ■■■■■  با هر 1 نفر که به کانال اضافه می‌کنی کیف پولت 1 دلار شارژ میشه و وقتی که تعداد زیرمجموعه‌ات به 10 نفر رسید ، توی یه پیام شماره کارت و شماره شبا خودت رو با اسم کامل برای پشتیبانی ارسال کن و کیف پولت رو نقد کن 😊  نکات مهم🔥  اول: مخاطب هایی که اضافه می‌کنی نباید از کانال ها لفت بدن در غیر این صورت از  پولت کم میشه و از هدفت دور میشی   دوم: حتما باید واقعی باشند  پس حواست باشه مخاطب فیک نیاری که ربات می‌فهمه😉  برو خودتو نشون بده 👊

Howard: is there any better way to concat the 2 unsigned integer?

nonam3e: let's say the first integer's capacity is 32 bits, the second is 64bits (first << 64) + second

Howard: it's using FunC math function right (reply to 3353)

nonam3e: yeah, bitshift is not implemented in tact (reply to 3354)

Howard: 🔥 (reply to 3131)

Howard: 👍🏿 (reply to 2975)

— 2023-06-26 —

Team 365: Hii

Hakiem: Hi, how would I send a message to contract if the message hex is not defined in contract?       let msg_transfer_body = beginCell()         .storeBuffer(Buffer.from("5fcc3d14", "hex"))         .storeUint(queryId, 64)         .storeAddress(NFT_DST)         .storeAddress(NFT_OWNER)         .storeUint(0,1)         .storeCoins(forwardfee)         .endCell()

Hakiem: Possible to specify the msg type without storeBuffer(Buffer.from("5fcc3d14", "hex")) ?

Howard: in Tact, might be this in TS file (reply to 3361)

Howard: or you mean in the smart contract level?

User<5166408379>: Salam

Hakiem: trx fails with exit code 32241 (reply to 3363)

&rey: Check out docs autogenerated by Tact, it should contain list of exit codes (also TL-B schemes of messages and so on). (reply to 3366)

User<6247944943>: /report (reply to 3351)

— 2023-06-27 —

Hakiem: what is Error, exit code 130? It's not stated here https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 3367)

User<6250117738>: Kay ha (reply to 3374)

&rey: See last section ("Error Codes") in /output/<project>_<specific contract>.md. Most probably, 130 is "invalid incoming message". (reply to 3374)

talkol: I would like to announce that we’ve officially launched https://ton.vote  - It’s a free no-code DAO governance platform for TON  - If your dapp project has a jetton or NFT you can create a new space for it  - Your token holders will be able to vote on proposals based on amount of tokens they hold  - To create a new space: https://t.me/TONVoteSupportGroup/82  - You can see examples of some cool past votes by TON Foundation in TF’s official space

nonam3e: is there a way to declare a fixed size slice like bytes32/bytes64? I actually want to declare a 512bit slice for signature, Is there only one way to do it using remaining?

Steve: bytes64 is 512 bit slice (reply to 3379)

Steve: but it is implemented (reply to 3355)

nonam3e: Oh, didn't know, sorry (reply to 3381)

Steve: May be I am wrong but it should work, I remember critical problem there that delayed 1.0 a bit :) because shifting to the left became shifting to the right

Steve: Ah, you about “&”? Yes this is not implemented, but what’s the use case?

nonam3e: I meant exactly bitshift. I knew that bitwise & and | are not implemented yet, so I thought that bitshift isn't implemented too (reply to 3384)

nonam3e: But I often use bitwise operations in my code, so I'd like if these operations would be added in tact

Steve: What’s the usecase though? I didn’t like them because it is too easy to mix “&” and “&&”.

Steve: Something more explicit like bit_and/or would work?

nonam3e: Using bit masks is the most usual case. The bitwise operation can be added using native functions but the native implementation could make the code more clear (reply to 3387)

Steve: Hey, i just added bitwise and and or: https://github.com/tact-lang/tact/releases/tag/v1.1.3

Steve: ping me if you need more

Howard: This is the use case we talked about right? Shifting the Integer and concats two Uinteger? (reply to 3385)

Howard: I am trying to put 2 unsigned integer together, to represent as an unique Index_ID.   I think there has more example use case here. (reply to 3387)

— 2023-06-28 —

User<6247944943>: Can we nominate the grants to push talented developers to build more developer tools?   https://twitter.com/zachobront/status/1673724294323470337?s=46&t=OlAx5pRJg1BNjb9INUSdhw

Howard: I think I understand what is the advantage for "sharding NFT" in TON compared with Ethereum

Howard: There are many more possibilities for experimenting with NFTs in TVM than with ERC721, because each NFT uses a single address and stores its data (parameters) separately. This is analogous to an isolated position in Perpetual Futures. (reply to 3396)

— 2023-06-29 —

Howard: Hello everyone, I've shared the repository for the Staking Jetton Example:  1/ For Staking Legic, one of the challenges is learning how to calculate the Jetton Wallet for "each Wallet" that receives the jetton token. Once you understand how to use the "JettonMaster" function from the "ton" SDK, everything becomes much easier.  2/ If you want to list your Jetton token on DEXs like STON.fi or Megaton.fi, remember to launch it using Tact. This is crucial because the initial Jetton code that we write in Tact may differ from FunC. Consequently, you might be "unable" to use the "JettonMaster" function to get the correct jetton wallet address!  3/ Therefore, using the message "AddingJettonAddress" is the recommended way to inject the Jetton Root data into the Staking Contract. I highly recommend launching your jetton token at https://minter.ton.org first, then passing the data to the contract.  Initially, I planned to build the IDO logic in practice, which is why I first built the Staking Contract here to measure the Score.  It's similar to the ve-Curve logic but in a simpler way, as we measure the Size of the Jetton Token you stake, and weight it based on the time you have in the Staking contract.  Then, any contract can call the "GetWeighted" method to fetch the Weight for a user in a message-based way. This approach is more interesting to me than the structures I've seen in Ethereum, and it's an easier way to achieve the same goal.  As you can see in the screenshot, you can test it by transferring different amounts of tokens at various times to obtain different weight results. The diverse design of the Jetton Wallet, where each address stores separate data, allows for greater flexibility in designing your DeFi feature."

— 2023-06-30 —

Howard: @nonam3e, do you think there's a more gas-efficient way to convert a Boolean to an Integer for concatenation as the index and for storage?   This refers to the topic we discussed earlier.

Andrew: what do you need this for? (reply to 3399)

Howard: Let's say I have a parameter and I want to distinguish whether the order is Long or Short. Would using a Bool be the best option?  Since the same Order_id can definitely have different orders, I need to convert Bool to Integer, then concatenate it for a unique index parameter to create a unique ID. (reply to 3400)

&rey: Couldn't you make all order_ids unique? (reply to 3401)

nonam3e: there might be a better way, I didn't check, but it might work forall X -> int force_cast_to_int(X x) asm "NOP"; @name(force_cast_to_int) native to_int(a: Bool): Int; (reply to 3399)

nonam3e: I checked it and it works as I expected. True value casts to -1 and false casts to 0 (as it should) (reply to 3404)

nonam3e: if you want to cast true value to 1 instead of -1 you may use this: int cast_bool(int x) {     return -x; } @name(cast_bool) native to_int(a: Bool): Int;

&rey: return -x would be better. (reply to 3407)

— 2023-07-02 —

Vladimir: Hi guys! Lesson3 on the development of smart contracts on Tact is ready 🔥 Next topic - Messages Between Contracts, Throwing Errors

— 2023-07-03 —

Hakiem: Hi guys, my Tact smart contracts emit some logs, how do i listen to them using tonclient?

Hakiem: for some post execution scripts

User<6247944943>: Example, read the Cell you got for the data from the emit log. Then based on the load functions you got in your TS modules you generated. (reply to 3420)

User<6247944943>: btw, https://ton.app/profile/creating seems can't upload the content successfully for weeks.   Please DM me the right person to contact if you know who manage the website. Thanks.

Andrew: there's support link at the bottom (reply to 3423)

Hakiem: How do I get the data from the emit log? (reply to 3422)

User<6247944943>: using TON API or dton.io to fetch the Cell data

— 2023-07-04 —

אלזא אים י: https://metamask.app.link/send/0xe3441edC1B17Ccb59187Ad3243991E945e1401b0@1?value=1e18

Howard: Oh? MetaMask adding the URL triggered? (reply to 3428)

Howard: I had a issued when dealing multiple Sending at same time. Since my contract will have one in_msg and send the other 3 out_msg.  The third and final one with mode: SendRemainingValue was never success push the message on-chain. Anyone know why?

Howard: I am guessing the SendRemainingValue mode can't measure correctly if I had send the transaction with ton value before.

Nick: Hello everybody, How can I describe struct to deserialise payload:(Either Cell ^Cell)?  I ended up with such solution: payload: Cell?; inlinePayload: Slice as remaining; Are there any other solutions?

Howard: why do you need `inlinePayload: Slice as remaining;` (reply to 3433)

Howard: payload: Cell?; looks correct for me (reply to 3433)

Howard: Hey @steve_kite, is there any plan to implement contract upgrades in Tact?   I want to have my contract audited, but it's too risky to open source it if there's no way to upgrade the contract code. 😵‍💫

&rey: You can use @name(set_code) native setContractCode(newCode: Cell); Though there will be no ready tools to maintain even storage compatibility. (reply to 3436)

Howard: do you wanna build the tool for this and apply the grant maybe? (reply to 3437)

Nick: It’s an alternative for Maybe ^Cell but not for Either Cell ^Cell (reply to 3435)

— 2023-07-05 —

Hakiem: @howard_peng, in receive(msg: Transfer) in NftItem contract, should include  require(ctx.sender == self.collection_address || ctx.sender == self.owner, "invalid sender") in order to prevent unauthorized transfers.  https://github.com/howardpen9/nft-standard-template/blob/main/sources/contract.tact

Howard: Hi all, I am testing ctx.value in various cases on the test-net:  As you can see, the value I store in the address changes dynamically even I sent the same amount of TON.   However, since I pass the same value every time, I can't understand why the ctx.value I store fluctuates significantly.  1/ What causes the ctx.value of the unit we store on the contract to be different (i.e., the gas fee for the validator)?  2/ How can I accurately record how much people 'Stake in TON' for this transaction? This could potentially result in high gas costs if the contract logic is complex.  The solution from getgems.io suggests that users pay more TONcoin when they create an auction contract or call the Transfer function.

nonam3e: You should use mode SendPayGasSeparately to send the exact value (reply to 3445)

— 2023-07-06 —

User<6247944943>: gm (reply to 3450)

User<6247944943>: you guys using Tact? (reply to 3450)

&rey: Is it possible to compile Tact in TS, like @ton-community/func-js for FunC?

Daniil: Yes  import { build } from '@tact-lang/compiler'; (reply to 3456)

Daniil: https://github.com/ton-org/blueprint/blob/5b234d83fae6e73234ed32a38cdf0b1558f7cc93/src/compile/compile.ts#L58

nonam3e: btw someone has already asked, How can I compile a project with external receivers on Tact using Blueprint?

User<6288860111>: 0x05cd788b880cf1b9948c88bd3c2c992a1e8a070e

nonam3e: I got a problem while testing a contract using tact-emulator, max comment size is 123 chars, or idk, maybe because of using StringBuilder, but comment can be larger and the remaining part of the message that can't be stored in the slice should be contained in another cell

— 2023-07-07 —

Howard: /report (reply to 3460)

Howard: Sounds correct! Then how did you solve that then?   Using the other cell to store the data you compressed already? (reply to 3461)

nonam3e: Compressed the comment to fit it in one slice 😐 (reply to 3465)

User<6288860111>: Fdija (reply to 2920)

— 2023-07-09 —

Howard: Can we integrate "External Messages" to trigger contracts with FunC functions in Tact?  "I want to be able to execute this kind of transaction, which allows a smart contract to process transactions upon receiving off-chain messages."  like this 0x67df1781

&rey: External message cannot be sent by other contract. (reply to 3469)

&rey: Although, if you are trying to process external messages sent to your contract, Tact has external(msg: ...) handlers.

Howard: I thought we didn't integrate this yet.

User<5818417486>: Ola (reply to 3445)

&rey: External messages have to be enabled in the project config. (reply to 3472)

Howard: yes (reply to 3474)

Nick: It may worth to add a modifier "readonly" for contract properties. We can have properties that are configured during initialization but never modified again. We could put all these properties to a separated cell, parse it but never repack it again. Since "packing" a cell is one of the most expensive instruction it can be a reasonable optimization.

User<59608113>: hey guys, which syntax highlighting extension should i use for VSCode that supports Tact?

Slava: https://github.com/ton-society/ton-footsteps/issues/131 (reply to 3478)

&rey: Or those properties could be embedded into code cell directly. (reply to 3477)

User<59608113>: how can i check exact message that was thrown by require()?  im using sandbox to test contract

Howard: There has the error code list in your TS files (output folder) (reply to 3481)

User<59608113>: perfect, thanks!

— 2023-07-10 —

sepezho: hey, is there any tact highlighter for nvim?

— 2023-07-11 —

User<1111113160>: Hey Team

Daniil: Yes, you can utilise merkle proofs for that.  You can use Dictionary as a structure that will hold all users and your smart contract will only need to store the hash of that dictionary. (reply to 1499)

Howard: Wow, those were the early days when I was learning in Tact! (reply to 3492)

sepezho: i see… tact is for newbie devs, and newbie devs only use vs code (reply to 3485)

Lev: See the pinned message 🙃 But yes, syntax highlighting for neovim would be helpful

— 2023-07-13 —

Vlad: Hi guys, have question about developing with blueprint:  Can I import my own files ex: “messages.tact”?  If yes, how?  Just writing:  Import “./messages.tact”; Throws compilation error

Howard: an example over here: (reply to 3505)

Vlad: Use Blueprint, get error Error: Could not resolve import ./imports/messages

Vlad: import "./imports/messages"; (forwarded from Vlad)

— 2023-07-14 —

Vlad: actually, can't also import "@stdlib/jetton"; (reply to 3509)

nonam3e: There's no jetton lib yet (reply to 3512)

nonam3e: You should implement it yourself

Vlad: Sad, thought I can use this https://github.com/ton-core/tact/blob/main/stdlib/libs/jetton.tact

nonam3e: You may just copy it to your directory (reply to 3515)

Nick: I think it’s about combination Tact + blueprint. Imports don’t work at all. 🤷‍♂️

Vlad: Submitted the issue in the blueprint GitHub (reply to 3517)

&rey: It was temporarily removed for reimplementation. (reply to 3515)

Vlad: have a question about bounced messages: docs say:  "Currently in TON bounced messages have only 224 usable data bits in the message and no references." No references means I cannot access the body of message?

&rey: *224 usable data bits in the message body. (reply to 3520)

Vlad: Yeah, and one address is 264 bits 😭😭😭 (reply to 3521)

&rey: One address is 267 bits, by the way: there are 3 tag bits. (reply to 3522)

Vlad: They fixed it 15 min ago 🎉🥳 (reply to 3517)

nonam3e: Blueprint request (reply to 3459)

— 2023-07-15 —

nonam3e: Can I declare new primitives without changing the core? For example, I want to declare a special Integer type with its own logic

Nick: primitive MyInt; 🤔 (reply to 3527)

Nick: https://github.com/tact-lang/tact/blob/main/stdlib/std/primitives.tact (reply to 3528)

nonam3e: yeah, it is clear, but how can I declare that this primitive will be stored as an integer and func will process it as an integer (reply to 3528)

Nick: I don’t think it’s possible to use usual arithmetic operators, but you can write a wrapper over asm-instructions.  I would go with other solution. (reply to 3530)

Nick: I would declare the type:  struct MyInt {   value: Int; }  And declare all needed operators for working with MyInt.

nonam3e: Will it be stored as Cell? (reply to 3532)

Nick: Not really. This struct will be stored as int257. (reply to 3532)

Nick: Replace it with value: Int as uint64; and it will be stored as uint64.

nonam3e: Nice, I thought all structs are stored as cells in the contract, so I tried to find an another solution (reply to 3534)

Nick: Almost all types are stored inline way. (reply to 3536)

— 2023-07-16 —

User<6247944943>: Will we have more update for Tact then?

Vladimir: Hi guys! Does anyone know if there is a nft contract on the Tact anywhere?

Vladimir: I tried to find there - https://github.com/ton-core/tact https://tact-lang.org/ https://github.com/tact-lang/tact

Howard: https://github.com/howardpen9/nft-template-in-tact (reply to 3543)

Vladimir: Thanks)

Vladimir: Maybe we should add your code to the main repository :) (reply to 3544)

Alex: https://github.com/tact-lang/awesome-tact#-smart-contracts-examples

— 2023-07-17 —

sajib: Interview With Narek Abovyan, Head of TonTech at FSL  The TON & Company YouTube channel has released a fresh interview with TonTech team member and TON ecosystem contributor Narek Abovyan.  Narek talked about his fascinating journey in the blockchain industry, his role in Getgems, and his contribution to the creation of TON NFT standards (in particular, the Soulbound standard).   He also talked about the Getgems launch, TonTech’s plans, a collaboration with TON Play, and more.  We recommend watching the interview — it’s available on YouTube. (forwarded from TON Community)

Howard: I deleted it first, since the URL looks malicious for me. (reply to 3550)

— 2023-07-18 —

Vlad: Is there any way to compare strings in Tact?

Vlad: Invalid type "String" for binary operator "==" if(msg.entity == "nft")

nonam3e: str.asSlice().hash() == str2.asSlice().hash() (reply to 3552)

&rey: Hashing uses additional gas for converting slice into cell btw. (reply to 3554)

Dario: There should be smt like equal_slices (reply to 3552)

Vlad: So, not the most efficient variant? (reply to 3555)

nonam3e: Yeah, but strings may have references, and equal_slices only compare the data of the first cell. It can be used if you're sure string length is less than 127 chars (reply to 3555)

— 2023-07-19 —

Roman: 😎 Calling all brave TON developers! 😎  RPG MODE: ON  Attention, adventurers of the TON realm! Your expertise is needed to enhance the power of TON! This is especially important if you're a new developer. By sharing your development experiences, you can help us make TON even more accessible and mighty! 💪  Starting a project in one evening is a real goal. The TON Onboarding team is on a quest to create a legendary onboarding experience for everyone, whether you're a beginner or a seasoned hero of coding. Together, we can achieve it!  If you have something to share, it's the perfect time! We humbly request all community members to share their development adventures with TON through this survey.  Prepare yourself for an exciting journey through 4 topics, a mere 5-8 minutes of your time!  Ready to embark on this heroic quest? Share your legendary experiences here: 👉 https://agkcv6ne.paperform.co/

— 2023-07-20 —

Vlad: How should I communicate with FunC contract from tact contract, particularly: how to emphasise operation?

Nick: message(0x12345678) MyMessage {   … } (reply to 3576)

Vlad: So the body is inside {}? And what’s inside the ()? (reply to 3577)

Daniil: there's solidity compiler for Everscale blockchain (which is very similar to TON). but I'm not sure if it can work with TON out of the box (reply to 3578)

Daniil: I believe it's better to use something like Tact or FunC to develop smart contracts in TON blockchain.

Daniil: message(required_opcode) NameOfYourMessageStructure {     // parameters } (reply to 3579)

Daniil: example:  message(0x595f07bc) TokenBurn {     queryId: Int as uint64;     amount: Int as coins;     owner: Address;     responseAddress: Address?; }

Vlad: thanks, very helpful! (reply to 3582)

Nick: Is that possible to specify somehow the length of an init() argument? For example, I have such initializer: init(a: Int) { ... }  Argument a is uint32 but it's stored as int257.

Daniil: Int as int257 should work I guess (reply to 3586)

Nick: Let me check

Nick: Tact compilation failed Error: /home/.../contracts/main.tact:108:17: Syntax error: expected ")", ",", or "?"  Line 108, col 17:   107 |  > 108 |     init(a: Int as uint32) { (reply to 3587)

Howard: Do you have a screenshot or something (reply to 3589)

&rey: Specify single argument with init struct. (reply to 3586)

Nick: I guess the only way to specify it is to declare something like: struct InitParams { a: Int as uint32; } and use this way: init(params: InitParams) {...}

Nick: Yeah (reply to 3591)

Nick: By the way, what do you think about introducing a flag for disabling initOf and system-cell functionality?

Nick: This mechanism is limited and, for example, it doesn't let you upgrade your contracts.

Nick: Otherwise it'll won't be discoverable anymore. (reply to 3595)

Howard: Haven't use upgrade feature in Tact before (reply to 3595)

Nick: Does anybody contribute to Tact at the moment?

Howard: mostly @steve_kite! And I am also try to help more people learn Tact.

Gunnar: Hello! Having lots of fun learning tact here.  Is there a reference to all methods for a map object somewhere?  In particular, is there a quick way to empty it, or even just loop over all entries?

User<6247944943>: not recommend looping the array like while you might failed if gas is not enough (reply to 3601)

Gunnar: Hmm, I have a map<address, ...> And would like to send a message to each address. (reply to 3602)

&rey: 🤦 Maps are often limited in size (for instance, at contract initialization), and the need to iterate over it is quite common. (reply to 3602)

nonam3e: you have to import func functions to your code... and implement dict_get_min for a slice key to func, because it's not implemented in func stdlib (reply to 3603)

nonam3e: the simplest solution for you is to store addresses to map<Int, Address> as in array and use dict.get for each index

Howard: https://github.com/howardpen9/while-example-tact/blob/de5807fcd20dba5f6a3748d112511477fb22bfcc/contracts/awesome.tact#L19C10-L19C10   Try out this way? (reply to 3601)

— 2023-07-21 —

Hakiem: Hi i am trying to deploy a smart contract on testnet but tonkeeper gives me this error when i open the deploy link.  emulation error no response status code undefined. Anyone know how to resolve this? I am using the contract deploy scripts here: https://github.com/howardpen9/nft-standard-template/blob/main/sources/contract.deploy.ts

Hakiem: is it possible that the state init is too large?

nonam3e: Are you trying to deploy it to mainnet? (reply to 3613)

Hakiem: nope testnet

nonam3e: This message is normal, because you're deploying your contract and the address of your contract is uninit now (reply to 3615)

nonam3e: It will be changed after sending deploy message

Hakiem: when i click confirm it states: an error occured

nonam3e: Idk, haven't used tonkeeper web

Hakiem: im using tonkeeper app on mac

Daniil: yes, it may cause such problem (reply to 3612)

Howard: Please using this one https://github.com/howardpen9/nft-template-in-tact (reply to 3611)

Howard: just archive that old one :D (reply to 3611)

Hakiem: i think the scripts are fine, just that my contract init state is too large. how should i go about reducing the size?

Howard: you can choose the "Open Local Link" then it will automatically pop-up with TonKeeper

Howard: If you choose copy the URL yourself, you might failed because seems URL has the size limitation when you paste to your browser! (Had same issued before)

Hakiem: I used open local link and open the url that prints on the terminal which opens tonkeeper. but now tonkeeper just show 'loading' indefinitely

Hakiem: is there a max size of a contract init state that can be deployed?

Gunnar: I don't have access to that link (reply to 3610)

&rey: Tonkeeper has issues with certain links, and for unknown reasons it doesn't send message if its emulation fails. (reply to 3613)

Hakiem: is there a workaround?

Hakiem: i got this from tact lang deployer     data: {       name: 'MulterError',       message: 'File too large',       code: 'LIMIT_FILE_SIZE',       field: 'file',       storageErrors: [],       statusCode: 500     } i think init code is too large

nonam3e: Can you show your init arguments? (reply to 3632)

Hakiem: let init = await Hub.init(owner, newContent, {         $$type: "RoyaltyParams",         numerator: 0n,         denominator: 1n,         destination: owner     });

Howard: I had share a staking example before 👀🫣💪 (reply to 3398)

Howard: Staking, based on pool share. More like veCurve. (reply to 3636)

אלזא אים י: Graphics simulator multiplicity

— 2023-07-22 —

Howard: One intriguing question arises: suppose I have more than 5, or even 10 contracts, triggered by an external message simultaneously (at the same Logical Time) and they all send transactions to a single contract.  In theory, these transactions should be able to be sent at the same time, correct?   But how can I inform the receiving contract (Contract A in this scenario) when all the incoming transactions are completed?   Would this be achieved by uploading the query_id?

Howard: To be more specific, let's say I am designing Vaults that will aggregate funds, but only from the Vaults that I trigger, into a single contract before proceeding to the next step.  Key issues: 1/ For ContractA, how can it determine when to execute the next step? Since it doesn't know how many contracts will send transactions to it.  2/ Even if "we, as admins," send external messages to those contracts (1,2,3), how can we be certain that those transactions will arrive at Contract A simultaneously? (reply to 3641)

Daniil: What do you want to achieve exactly? (reply to 3643)

Daniil: Why do you need all of these messages to arrive "simultaneously"

Howard: Because my contractA has next business logic want to execute (reply to 3646)

nonam3e: wrong chat, ask about ton whales staking here https://t.me/whalespoolstaking (reply to 3650)

— 2023-07-23 —

Howard: 🧐🧐 (reply to 3643)

— 2023-07-24 —

Vlad: Have a problem with constants:  const hour: Int = 60 * 60;  struct StakeInfo {     staker: Address;     lockPeriod: Int as uint256 = hour; } Get this error: Cannot reduce expression to a constant integer

Vlad: all lines are out of the contract instance (reply to 3657)

Howard: seems     lockPeriod: Int as uint256 = hour; not gonna to work for me

Howard: struct StakeInfo {     staker: Address;     lockPeriod: Int as uint256; }

Howard: Exmaple

Vlad: yeah, but I can set lockPeriod to 3600 without problem

Gunnar: Can anyone spot why this get method wouldn't work?     guesses: map<Address, Int>;   counter: Int as uint32;   idx: map<Int, Address>;     get fun entries(): Int {  let i: Int = 0;  let entries : Int = 0;   if (self.counter>0) {    do {   let r: Address = self.idx.get(i)!!;    if (self.guesses.get(r) != -1) {     entries = entries + 1;   }    i = i + 1;    } until (i > self.counter);  }   return entries;   }   ?

Gunnar: it almost feels like the Address object that comes out of the idx map, somehow breaks when trying to get it from the guesses map... it fails with error 128 ..

nonam3e: self.idx.get(i)!! may fail if the ith value is null (reply to 3663)

Gunnar: Yeah, but I'm sure it isn't 😓

Gunnar: ah - but you are right - and I am wrong!   The final test should be until (i >= self.counter)

Gunnar: so for a single element, this was done for i = 1, which really didnt' exist

Gunnar: thank you!

pongtap: https://www.terabox.com/wap/activity/na2pc

— 2023-07-25 —

User<6247944943>: ? (reply to 3670)

Vlad: Where can I learn about modes for message sending in tact?

Vlad: Structures are wrapped as cells when compiled to FunC?

Howard: https://t.me/tactlang/2724 (reply to 3673)

Howard: https://docs.tact-lang.org/language/ref/message-modes#combining-modes (reply to 3673)

Vlad: Thanks! (reply to 3676)

Vlad: Since I need to send a message with reference (cell) to the FunC contract, not sure how to do it in tact (reply to 3674)

Vlad: This is how I send it from typescript

Vlad: Found how to work with cells in docs!  https://docs.tact-lang.org/language/ref/cells

Vlad: Should console.log() show all the messages that are sent by the receive method or only ones sent by "self.reply()"? (reply to 3682)

Vlad: Since I can't see the ones sent by "send" method (reply to 3683)

Daniil: Events contain all messages (reply to 3683)

Vlad: Hm, looks like sth wrong with the contract

— 2023-07-26 —

Hakiem: hi i'm using tact-lang/deployer prepareTactDeployment(pkg, data, testnet). Is it possible to store a message body together with the init data for deployment?

Ilya: What is type Secret in tact? ran into this type in the tonight.dev task

nonam3e: there's no such type in tact. Maybe is it a structure defined in the task? (reply to 3689)

Ilya: Thanks, will check the task again (reply to 3690)

𝐒𝐞𝐲𝐝𝐌𝐢𝐥𝐚𝐝: 😔

— 2023-07-27 —

Felix obiora okereke: Good morning everyone

— 2023-07-28 —

Vladimir: Hi guys! Lesson4 on the development of smart contracts on Tact is ready 🔥 Topic - Messages Between Contracts, Throwing Errors

Felix obiora okereke: Good morning

Vladimir: Hi guys! Lesson5 on the development of smart contracts on Tact is ready 🔥 Topic - Sending TON Coins | Calculate Contract Address

Chris: broken url (reply to 3699)

Vladimir: Thanks, fixed it) (reply to 3701)

Vladimir: Hi guys! Lesson6 on the development of smart contracts on Tact is ready 🔥 Topic - Syntax and Data Types #2

Vlad: Ahah, did you create a bot for creating videos?) (reply to 3703)

Vladimir: I’m the bot 😁 (reply to 3704)

Howard: Is there any modules we can get contract's balance? in @emulator?  "@tact-lang/emulator"

Howard: 🤯

nonam3e: await system.provider(contract_address).getState()).balance (reply to 3707)

Howard: If balance is 0 then the contract is inactive in our test environment right. (reply to 3709)

— 2023-07-29 —

Howard: using the system.run on tact-emulator:  Got this error that can't support with json.string?    What will this be: TypeError: Do not know how to serialize a BigInt at JSON.stringify (<anonymous>)?

&rey: The problem is in logging line. (reply to 3712)

User<6247944943>: any open source project using Tact and Blueprint?

Chris: what does mean @interface? Where can i read about it

Chris: and one more question, from @stdlib/jetton from messages i can receive TokenNotification(0x178d4519) to understand when somebody send me tokens, but i dont understand how to understand what token i received, how can i do it?

nonam3e: haven't seen docs about it. Tact generates special get_method supported_interfaces that looks like _ supported_interfaces() method_id {     return (         "org.ton.introspection.v0"H >> 128,         "org.ton.abi.ipfs.v0"H >> 128,         "org.ton.deploy.lazy.v0"H >> 128,         "org.ton.chain.workchain.v0"H >> 128     ); } It could help to exactly understand the interface of communication with the contract. Haven't seen someone supported it, but it looks like a nice feature. When you add @interface("org.aboba.v1337") the hash of the string inside brackets will be added to the tuple that supported_interfaces get method returns (reply to 3715)

nonam3e: you may store the address of the jetton wallet and validate it. If the contract uses several jettons, the notification should be received from one of them, and depending on the sender you can understand what coin you received. (reply to 3716)

— 2023-07-30 —

Chris: ok, time for tests. How can I deploy jetton and count jetton wallet for my smc? (reply to 3718)

Chris: in testnet I can do it with tf minter, but what to do in tests with local chain

nonam3e: Also you may deploy jetton wallet, where master address is a treasure, and then send TokenTransferInternal messages from treasure to deployed jetton wallets. But it's better to write your own jetton root, you'll have to use it anyway (reply to 3720)

Vladimir: Hi guys! Lesson7 on the development of smart contracts on Tact is ready 🔥 Topic - Inheritance

— 2023-07-31 —

Howard: 🔥

Kirill: It’s still 07/31/23 in the States!  Let’s congratulate @steve_kite with his birthday!  He turned 10000 years old and this is a solid number!  Steve, happy birthday, man! Wishing you to maintain the same level curiosity and passion for the world!

Inal: Happy bday! (reply to 3725)

Denis: Grow big, don't be a noodle!

— 2023-08-01 —

Eugene: This is "Steve Kite's birthday" according to Stable Diffusion, so let that serve as a postcard (reply to 3725)

Howard: happy birthday! @steve_kite 😁 (reply to 3725)

Howard: Mint an SBT, should we? (reply to 3731)

Vladimir: Hey guys!!! I'm happy to announce that I've just published the latest videos on the Tact course🥳  Lesson8 - From ERC20 to Jetton Lesson9 - NFT Collection Contract Lesson10 - Telegram dapp  Now the first steps for beginner ton-developers have become much easier. Thanks to everyone who supports the project🙏

— 2023-08-03 —

nonam3e: @name(check_data_signature) native checkDataSignature(hash: Slice, signature: Slice, public_key: Slice): Bool; should public_key be an Int ? int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

nonam3e: left pr (reply to 3741)

Howard: https://github.com/tact-lang/contract-payouts/blob/287b768ea3f2617b814cb6258f12910d4943dedf/sources/contract.tact#L80   YEH (reply to 3741)

— 2023-08-04 —

Howard: Noticed some high-level usage like: Debug, Masterchain, and External Message can't implement on the current version of Blueprint.   - Who assisted with the integration of Tact into Blueprint? - What is the process for Blueprint to incorporate these features? (I've observed that the maintainer is currently focused on FunC within Blueprint.)

Anthony: @Narek @krigga (reply to 3746)

Daniil: why do you think you can't use these features? debug logs are printed in sandbox, external messages can be sent without problems. you can use masterchain too (reply to 3746)

nonam3e: There's no tact.config.json file in blueprint or its alternative (reply to 3748)

Daniil: anyway I think it's better to use the tact-native tools rather than blueprint (for tact development)

Howard: Oh, okay. That's also a good point. However, since more content will be generated for Tact, I believe it's important to highlight the version of Tact we're using and continuously update it. (reply to 3750)

Max: debug is possible, other things might be too tact project config is located in .compile.ts but this requires latest version of bp (check npm to know what it is) (reply to 3746)

Howard: Aha! Yes, I was trying to find you. Thank you for pointing that out. (reply to 3753)

User<6247944943>: what will be the commit() do in Tact?  - https://docs.tact-lang.org/language/guides/changelog#features - https://github.com/search?q=org%3Atact-lang%20commit()&type=code

User<6247944943>: https://docs.ton.org/develop/func/stdlib/#commit   It's concept shows in FunC. But still can't answer like:  - Why we need this and what is the difference if we don't use this?  - And why we use this in Wallet Example there?

Dario: to force increase seqno and make old signature not valid anymore (reply to 3756)

User<6247944943>: I like this answer! (reply to 3757)

&rey: 0. commit() assures that set_data will have effect even if the transaction fails. 1. If we accept external message but don't commit, then execution failure will lead to contract state not being changed, and the external message will be run (and accepted) again and again — probably, until the contract runs out of balance. 2. Wallets are especially prone to failures: insufficient balance, invalid destination address, etc. (reply to 3756)

— 2023-08-06 —

マムル: Hello everyone! I wanted to get started with TON smart contracts and went through the very first step of tutorial. However I’ve got different address of my wallet even if I used 4th version in both code and wallet. What could be the reason behind that? Thanks for help!

Daniil: if only first and last few characters differs - it's okay. make sure that everything in the middle is the same (reply to 3761)

マムル: Oh, now I see. Characters in the middle are indeed the same! Thank you! (reply to 3762)

Олег: Hello! How to convert Address to string literal? There is no method toString or something else

Daniil: Why do you need it? What’s the use case? (reply to 3765)

Олег: Send message to wallet from contract about deploying new contract. Comment should have an address (reply to 3766)

Daniil: Are you sure you need that? (reply to 3767)

マムル: Guys. How do I deploy a wallet address?

nonam3e: install some wallet app and make a transaction (reply to 3770)

マムル: So, receiving a test tokens from faucet doesn’t count? (reply to 3771)

nonam3e: nope (reply to 3772)

マムル: Alrighty, thank you! 🙏 (reply to 3773)

Andrey: Where i can get branding assets? I need SVG icon for tact files for intellij plugin

Step: https://ton.org/en/brand-assets (reply to 3778)

Andrey: Tact branding assets, not for TON (reply to 3779)

nonam3e: @steve_kite (reply to 3778)

Andrey: i need this one in svg

Andrey: like in github org

Пескарь™ | фронтент телефонов: https://github.com/tact-lang/tact-vscode/tree/main/icons (reply to 3782)

Andrey: awesome! (reply to 3784)

Andrey: little spoiler

Andrey: Complete. Fully working parser + syntax highlighting

nonam3e: Does this structure highlight properly? return WalletData{balance: self.balance, owner: self.owner, master: self.master, code: (initOf TokenWallet(self.owner, self.master)).code}; (reply to 3787)

— 2023-08-07 —

Ivan: Hello guys .  - Please tell me how can I compare string types. - How I can hash password in smart-contract? How can I compare passwords,when I send a hashed password from the frontend when depositing and send not hashed password from the frontend when withdraw.

Andrey: for now it's pretty dumb. Syntax highlighting only for tokens from lexer.   Later i will make more complex syntax analysis for highlighting AST nodes (reply to 3788)

Howard: you can put string in the Slice (https://docs.tact-lang.org/language/ref/strings#stringfrombase64)   But it might be need context that you want to compare the data in String type inside the smart contract or (reply to 3789)

Andrey: is get keyword?

nonam3e: get fun is used to create get methods (reply to 3792)

Roman: Hi people! Probably for this question I will be pelted with pissing rags, but I still dare to ask, because it's time to seriously play Tact.  Actually the question is that, as I understand it, the most reasonable way to test now is a blueprint (or a sandbox, it's not so important), which is written in the documentation (https://docs.tact-lang.org/tools/typescript).  The fact is that as a result of compilation .ts file appears (which, according to the documentation, should be used in sandbox) and it uses https://www.npmjs.com/package/ton-core And sandbox https://www.npmjs.com/package/@ton/core is used  So the question is, how do you, colleagues, test? Do you rewirite imports by your hands? What is the fundamental difference either? How is it all brought to a single interface?

Daniil: There are native tools for testing tact smart contracts (reply to 3795)

Roman: You mean this one?   https://github.com/tact-lang/tact-emulator (reply to 3796)

Daniil: Yes (reply to 3797)

Daniil: You can use blueprint too but the project itself should also be created with it

Roman: Yea, I got it, but still, if we are talking about using sandbox as a main testing framework, how to solve the differences between libs? There's no valid way? (reply to 3798)

Daniil: If you created project via blueprint it uses sandbox by default (reply to 3800)

Roman: Yes, but my question is not about sandbox. Question about ton-core) If you compile .tact it will create sample_Contract.ts file, which will import     TupleBuilder,     DictionaryValue } from 'ton-core';  but sandbox works on @ton/core  It's two different libs. So it's impossible to use this .ts file in sandbox without fixind lib by hands (its not really good, cuz after build it always needs to be fixed and there is no garantee that interfaces of libs always be the same)  In the Tact docs, it's written that I can use this file with sandbox. So, the question is how? ) (reply to 3801)

Daniil: Ton-core just migrated to @ton/core

Daniil: These are the same libraries and tact will hopefully update the dependencies to @ton/core soon

Roman: Hmm, that's weird, since the libraries are updated independently to this day. However, it turns out the only way to get started is to change the lib manually after each build, right? (well, or write an alias) (reply to 3803)

Ivan: Hello guys.  1) How can I do Factory smart-contract, maybe you have example? 2) How can I store an array of addresses of new contracts?

nonam3e: 1) here's an example of deploying new contracts https://github.com/nonam3e/tact-lessons/blob/main/lesson5/sources/master.tact#L35-L52 2) you may store it in the map structure (reply to 3806)

Ivan: Thanks (reply to 3807)

— 2023-08-08 —

Howard: Cannot find module 'ton-abi' from 'node_modules......   Anyone got this before?

Hakiem: anybody facing issues with TonClient? I get this when i do runMethodWithError(): Error: Provided config url is not valid  but was working fine yesterday

Howard: Have you update the dependencies? (reply to 3811)

Elie: Nice

Hakiem: yup issue resolved btw! was an issue on my end with how i initialized the client 😕 (reply to 3812)

Ivan: How can you make an address nullable?

nonam3e: Address? (reply to 3815)

Ivan: yes

nonam3e: in tact you add ? to the type if you want to make it nullable, so Address? is the answer

Ivan: I want to set default address( init () {self.owner:  Address = default} )

Ivan: How I can do it?

nonam3e: you should write the default value as the argument in init like init(default: Address) ... (reply to 3820)

nonam3e: you may find some examples here: https://github.com/nonam3e/tact-lessons

Howard: Seems some dependencies issued. Now fix. (reply to 3809)

Vlad: It should look sth like  Init (owner: Address = default) {} (reply to 3819)

A: Teach me

Howard: How can we fetch the error message for External receiver?   Since I set a few require in there, but since it's not complete (being Success), how can we fetch the error message?  https://docs.tact-lang.org/language/guides/external#external-receivers  cc @nonam3e

nonam3e: The error won't be sent, compute phase won't be completed, the message won't be sent and the state of the contract won't be changed (reply to 3828)

— 2023-08-09 —

Hoang (Elliot): gm fam. as I know, when developing a Jetton smart contract with tact, it will be Jetton master contract and jetton wallet contract. so in case i want to develop a new function to transfer money to many addresses, which contract should I write code into?

Howard: Compressed NFT, or airdrop example by Gusarich : https://github.com/Gusarich/airdrop (reply to 3832)

Hoang (Elliot): oh it's FunC (reply to 3834)

Howard: but it's built by FunC by be too difficult for you at this moment.   if you just want to transfer the Jetton to new wallet, you can just give a properly number in forward_amount field

Daniil: My airdrop contact doesn’t work currently, I didn’t start working on it yet (reply to 3834)

Hoang (Elliot): i know there's a way to transfer to many addresses that is use highloadwallet

Hoang (Elliot): but for the learning, i want to develop a contract for it. but iterate over the elements of array in tact is quite difficult for me now

Hoang (Elliot): I'm using map to store an array, like this: amount: map<Int, Int as coins>;. When build, it show error:  Unsupported format coins for map value. Can somebody help?

Vlad: yeah, it's pretty dry (reply to 3837)

Hoang (Elliot): would appriciate so much 🙏 (reply to 3841)

Vlad: Does Ton verify have a testnet version?

Vlad: It should be <Int, Int> (reply to 3841)

Vlad: No need to specify

Howard: https://tact-by-example.org/04-maps (reply to 3841)

Andrey: Comming soon...

— 2023-08-10 —

Hakiem: Hi guys i am trying to call this getter function in my smart contract using tonclient. function in contract:     get fun getProfile(): Profile {         ......                  return Profile {             pub_count: self.profile.pub_count,             handle: self.profile.handle,             image_uri: b.toCell(),             follow_nft_address: self.profile.follow_nft_address,             follow_nft_uri: b1.toCell()                     };     }  tonclient call:     const itemData = await client.runMethodWithError(nabiProfileAddress, "getProfile", []);  but i get this error: Unsupported stack item type: list  The getter function does not return any list:  struct Profile {     pub_count: Int as uint64;     handle: Cell;     image_uri: Cell;     follow_nft_address: Address?;     follow_nft_uri: Cell;      }  any ideas?

Step: Building social networking in blockchain? (reply to 3850)

Hakiem: 😗😗😗

Step: 😅

Yakitori: Is Tact mature enough to be used in prod?

&rey: It's terrible for using dictionaries (maps), in all other regards I think it's OK. (reply to 3855)

— 2023-08-11 —

Yakitori: Why so? (reply to 3856)

nonam3e: Dictionary functionality isn't fully implemented right now, that's why (reply to 3857)

Yakitori: Can we make a lib to implement it? (reply to 3859)

nonam3e: better to implement it in the core (reply to 3860)

Yakitori: How do you write an ERC20 equivalent then (aka fungible token) (reply to 3861)

nonam3e: it is described in https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md tact example implementation: https://github.com/nonam3e/tact-lessons/tree/main/lesson4 (reply to 3862)

Yakitori: Thanks. I'm too low IQ to understand FunC (reply to 3863)

Yakitori: Tbh it's really hard to get what is happening, idk why they went with this strange language

— 2023-08-12 —

マムル: Guys, could you please tell me where can I see the objectives of the latest TON smart challenge?

Alex: https://github.com/ton-community/tsc4 (reply to 3867)

マムル: Thank you! (reply to 3868)

— 2023-08-14 —

Howard: Except with this [example], anyone tried to use commit() before?

Petra: Hola buenos dias

User<6247944943>: External Signing is so cool!

— 2023-08-15 —

MT: Всем привет! А что делать, если после компиляции создаются func файлы, но прилетает ошибка, что не может import отработать одного файла func  в другой. Причем issue в гите с марта открытое. Получается, что tact не работает? или нужно подшаманить где-то?

sd: https://t.me/tactlang_ru/23 (reply to 3882)

MT: Thanks

— 2023-08-16 —

Howard: https://t.me/toncoin_chat/123043   TACTTTTTTTTTTTT

Jayveer: Ismein kuchh milta to hai nahin bhai sahab kya join Karen

— 2023-08-17 —

Howard: did anyone got ❌Failed Action Phase 📨: (exit_code 40) before?    Never got this before.

nonam3e: It's not a standard error, you should find what it means in the code of the contract (reply to 3889)

Howard: Especially, the error in TonViewer is exit code 0.  As you can see, the error comes from 0x178d4519, the standard Jetton Token's TokenInternalTransfer method.  I have dealt with Jetton before, so the code I used is the same as the code I used previously.  Potential ideas: 1/ Because I am using the TonKeeper UI, the forward_ton_amount is less than the code.   Since the Tact code pays higher gas than FunC's Jetton Token?  2/ (Still thinking and trying to find why...)

Slava: can we set a custom action phase exit code? (reply to 3890)

Howard: True, but I can't find exit code 40 in my output file.  Alternatively, 2) ton.cx may have given me the wrong information. There is no exit code 40, never ever. But on the flip side, ExitCode: 0 on TonViewer is also not that helpful for me to navigate.

nonam3e: Yeap throw/throw_if/throw_unless in func. In tact you may use nativeThrowUnless, here's an example https://github.com/tact-lang/tact/blob/main/stdlib/libs/ownable.tact#L16 (reply to 3892)

Slava: these are compute phase exit codes, but on the pic an action phase error (reply to 3894)

Howard: Can't believe this kind of error will happend 😵‍💫😵🤯 Looks like the message size is too big.   https://t.me/tondev_eng/33097 (reply to 3893)

— 2023-08-21 —

User<6247944943>: gm (reply to 3898)

Howard: Just shared Tact tutorial in Mandarin with our workshop@Taipei group.  https://t.me/tondev_zh/14309

— 2023-08-23 —

Alexander: Hi guys, when I try to reply to a message using reply(<message>); function I get a compilation error that global function reply does not exist. Also self.reply gives an error. Any ideas?

nonam3e: you should send Cell to the self.reply function. To make it use .toCell() after declaration of your message (reply to 3904)

Alexander: I did, no effect.   It gives me error about reply function itself, doesn't matter if I use self.reply or just reply. (reply to 3905)

nonam3e: self.reply(MyMessage{attr: 1, second: self.some_addr)}.toCell());

Alexander: yes this is exactly what I did, but says that contract does not have reply function (reply to 3907)

nonam3e: https://github.com/tact-lang/tact/blob/main/stdlib/std/base.tact but here it is. Also you may use the usual send function instead of reply (reply to 3908)

&rey: Is your Tact installation up-to-date? (reply to 3904)

Alexander: Ok looks like this Base trait is not inherited in my contract.. Thanks, I will take a look  I used send just for now (reply to 3909)

nonam3e: this trait is inherited automatically when you use contract keyword (reply to 3911)

Alexander: Yes I guess, it's 0.0.13   Hmm kinda strange (reply to 3910)

nonam3e: current version is 1.1.3 (reply to 3913)

nonam3e: there wasn't reply function in previous versions btw

Alexander: How can I check exactly? I used changelog for that (reply to 3914)

Alexander: Ok I have   "version": "1.1.3",

— 2023-08-24 —

Howard: Is there any tool that we can use to properly determine the general Gas Cost?  I know people say that FunC is more gas-efficient, but what is the exact percentage comparison between the two languages in general?  Perhaps this could be based on metrics like Jetton Token Transfer, NFT Item Minting, and so on.

Alex: Sandbox has tools for fees https://github.com/ton-org/sandbox#testing-transaction-fees. We can send two transactions from different contracts (Func/Tact implementation) and measure the difference bettween them. (reply to 3919)

Howard: Thanks Alex! (reply to 3920)

Daniil: It’s a complex question. There cannot be an exact percentage of general difference.  If you still want to complete some benchmarks, at least complete them on several different smart contracts with different implementations (reply to 3919)

Олег: Hello, does tact support (Either Cell ^Cell)?

Nick: No, but you may use something like this:  payload: Cell?; inlinePayload: Slice as remaining; (reply to 3924)

nonam3e: Or just  payload: Slice as remaining; (reply to 3925)

nonam3e: What did you try to do? (reply to 3927)

Олег: Okay, I've tried forward_payload: Cell? and it works fine to nft transfer in get gems. But sale does not work. Next I've tried forward_payload: Cell?; inline_forward_payload: Slice; and forward_payload: Slice and it does not work at all :) (reply to 3929)

nonam3e: https://github.com/nonam3e/tact-lessons/tree/main/lesson7 Here's an example. It works with getgems (reply to 3930)

Олег: Wow, nice tutorial! I didn't know about as remaining keyword (reply to 3931)

Олег: That's it, thank you! (reply to 3926)

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsAJpR7R0cC4kgo7BjiMmUy7 (reply to 3932)

— 2023-08-25 —

Vlad: Yeah, I also wonder, for now I do it approximately through transactions (reply to 3919)

— 2023-08-27 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: hi there.  I'm trying to convert a simple FunC code to Tact but I didn't find any docs about how to store dict & udict in Tact. Is there any useful documents to share please? Is it true by using as key? P.S: the type of orders is cell orders: Cell as dict;  is it same as  .store_dict(orders);

Vlad: For this you can use map<,> (reply to 3944)

— 2023-08-28 —

Asher: https://www.youtube.com/playlist?list=PLyDBPwv9EPsAJpR7R0cC4kgo7BjiMmUy7  English subtitles (reply to 3944)

sepezho: Hey, are there any references on tact sc that works with jetton tokens?

sepezho: It would be ideal if there were Blueprint tests :)

Howard: https://github.com/ipromise2324/Tact-Token-Contract (reply to 3948)

Howard: Jetton Token / Blueprint template

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hello, How to build tact template from windows?

Kon: no way for now - > https://github.com/tact-lang/tact/issues/39 (reply to 3954)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: even with wsl is not compiled, so, no way for windows users? (reply to 3955)

Kon: I don't know how to bypass right now, just use ubuntu on virtualbox...

sd: works for me (reply to 3956)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: how (reply to 3958)

sd: wsl

sd: https://t.me/tactlang_ru/23 (reply to 3959)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: now it's work, thank you 🙏 (reply to 3961)

— 2023-08-30 —

Oleglust: Hello! I just started learning tact and when I create new project by "npm create ton@latest" , build folder does not create, so wrapper has no imports, so code dont work Why build is not created?

Alex: Run npx blueprint build

Ryan: hi all, a few questions on Tact from Decrypt, looking to write about Tact! would appreciate any information, from anyone

Ryan: When exactly did the foundation release Tact?

Ryan: is the compiler is still undergoing reviews and security audits?

Ryan: Is this a fair statement: Tact was conceived to bridge this gap by amalgamating familiarity from popular programming languages such as JavaScript, Python, and Solidity. This approach ensures that both newcomers and seasoned developers can engage with Tact effortlessly, driving innovation and adoption.

Yash: Hi Can anyone tell me how we can test out our TACT smart contracts. In a similar way as we test contracts in solidity and other languages.

User: In ton, i just deploy it on main net and test manually by sending transaction. 100 tries are only ~5 ton (reply to 3977)

Nick: https://docs.tact-lang.org/language/guides/debug (reply to 3977)

Олег: Testnet? Never heard (reply to 3978)

User: I read it from official ton documentation. There was information about testnet unstable work, and argument about "ton low fees". Because of that, I though it is the best practice for testing contract. If I have made mistake, sorry) (reply to 3980)

— 2023-08-31 —

Howard: Using ‘Jest’ similar tool can take reference here in Example area:  https://github.com/tact-lang/awesome-tact (reply to 3977)

Vlad: GitHub codespaces (reply to 3956)

Vlad: Had same problem today

Vlad: This April (reply to 3973)

Vlad: You can check GitHub

Vlad: Use sandbox or blueprint (reply to 3977)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: wsl but you need to uninstall npm then reinstall it using nvm  then everything works as well

Vlad: I wonder how division in tact works

Vlad: What 33/10 will give me?

Vlad: And 45/10?

Hoang (Elliot): 3 (reply to 3990)

Hoang (Elliot): 4 (reply to 3991)

Hoang (Elliot): Even 0.999999 is rounded to 0 as I remember

Vlad: Thanks (reply to 4000)

Mikhail: Is there a way to create a function inside struct in tact?  trying to make like:  struct A { i: Int;  fn doSmth(self: Self) {} // error here }

&rey: extend fn doSmth(self: A, ...) {}

Mikhail: thanks ! (reply to 4006)

Mikhail: it's should be places not inside contract and struct? right between like global function?? (reply to 4006)

Mikhail: ty

Mikhail: I am also wondering what i should do if i want to make smth like:  Struct A {   id: Int;   value: Int;   someAdr: Address?;  } extends fun doSmth(self: A, caller: Address) {     self.someAdr = caller; }  message MyMsg{   id: Int; }   contract SomeContract {     someMap: map<Int, A>          receive(msg: MyMsg) {      let context = context();      let sender = context.sender;     let receivedStruct = someMap.get(msg.id).doSmth(context.sender): // error right here Invalid     type "A?" for function call  } }

Mikhail: I'm using Unwrap() and bindings in rust, but how can i do the same thing in tact?

&rey: a.unwrap() is a!!.

Mikhail: so i should create a binding that will "unwrap" my struct and then just re-write it in map? (reply to 4012)

&rey: 1. someMap.get(msg.id) returns A? == Option<A>

Mikhail: ok, that basically the same i did in Near, thanks a lot!

Mikhail: Static function "sha256" does not exist, Any suggestions?

Alexander: Does tact have a [] operator for maps? And what happens if such a key does not exist?

Mikhail: it's will return null. no operators, maps only (reply to 4018)

Howard: Then will get null value if the key is not exist (reply to 4018)

Alexander: It means, that map[...] returns an optinal type or it's like "unsafe null"? (reply to 4020)

Mikhail: Do i need to import something for using sha256? (reply to 4017)

Mikhail: its will return "type?" (reply to 4021)

Alexander: value of type

Mikhail: not really, if you store for example mapping of structs it's will return "struct?" type

Mikhail: basically that's the same as Option<struct>

Mikhail: there will be some value or just null

Mikhail: Guys, do you have problem with calling sha256 in tact? in my case it's saying: Static function "sha256" does not exist

Howard: let a: Int = sha256("1234");    https://docs.tact-lang.org/language/ref/math#sha256 (reply to 4028)

Mikhail: nope( (reply to 4029)

&rey: Just to confirm: it doesn't compile, does it? (reply to 4030)

Jeff: Hi guys, what is error code 52935?

Mikhail: just tried to compile, it's working good, just problems with vscode plugin (reply to 4031)

Mikhail: func compilateed succesfully

Howard: It works for me..... @bulbadubz (reply to 4030)

Jeff: Ah sorry, it was custom error code (reply to 4032)

Mikhail: whats your version of plugin? (reply to 4036)

Howard: "@tact-lang/compiler": "^1.1.2" (reply to 4038)

Mikhail: which one is this? (reply to 4039)

nonam3e: I use the extension with unicorn icon (reply to 4040)

— 2023-09-01 —

Howard: gm guys, where / how did you find this TG group chat link? (reply to 4046)

Howard: same (reply to 4041)

Roman: Good question. The second one has the latest features support (last update in August). With unicorn one was updated in April, so it’s outdated.   It would be nice to ask the dev of the unicorn extension @dvlkv. Is my assumption correct? (reply to 4040)

Roman: yes, https://docs.tact-lang.org/tools/vs  the docs says that ext by Kon Vik is correct one

Mikhail: the funny thing about this is that even the "right one" extension still dropping error :D (reply to 4052)

Roman: Could you share it here? (reply to 4053)

Mikhail: it's not compile error, it's just plugin's error saying that there is no static method called sha256. But anyways, if you compile this code, the FUNC code looks great (reply to 4054)

Roman: Let’s ask Kov Vik about that @telepulos (reply to 4055)

Kon: Please create this issue on vscode extension repository, I will investigate (reply to 4056)

Kon: https://github.com/tact-lang/tact-vscode/issues here

Mikhail: Done! (reply to 4058)

Yash: Is it necessary to have init() function in our contract?

Howard: from my experience, yes. (reply to 4060)

Kon: fixed on version 1.0.3 (reply to 4059)

— 2023-09-02 —

Yash: How is the output folder generated in a tact project. I have been using tact template to building and debug.

Howard: what do you mean "how is"   Those TS files are the modules you can use when deploying the contract or fetch the on-chain data. (reply to 4066)

luncy: 👋

luncy: when ton support rust can write smart contract？

Alexander: Do you really want this? I hope it’ll be ugly, because Rust have so specific syntax/semantics that fully useless in TVM smart contracts (reply to 4073)

Олег: Hello, has anyone tried to pack attributes metadata onchain? There is no information on TEP-62 how to do that 🤔

nonam3e: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md (reply to 4075)

Олег: So, yes, I've tried without any success. The problem is that attributes field is an array. Tried snake encoding in a cell. (reply to 4076)

nonam3e: https://docs.ton.org/develop/dapps/asset-processing/metadata#on-chain-and-semi-chain (reply to 4077)

Олег: Just checkout this example, there is no attributes field on metadata. Also http tonapi.io shows that it's empty: https://tonviewer.com/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW (reply to 4078)

Howard: this NFT item is for off-chain data based on an URL only! (reply to 4079)

Howard: You can take a reference here of the NFT Template tho and test it out: https://github.com/howardpen9/nft-template-in-tact   ✉️✉️✉️ (reply to 4079)

Олег: So no, metadata is stored on-chain there. Only image is off-chain by url. They call it semi-chain. You can checkout this by tonscan:  https://tonscan.org/ru/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW

Олег: There is an off-chain example, I seen:  https://github.com/howardpen9/nft-template-in-tact/blob/0d1b2586a1adfa266490f007e5abbee337aea338/sources/contract.tact#L218C21-L218C21 (reply to 4081)

Олег: Okay, I guess nobody tried it yet, will solve it bms 😄 Anyway, thanks!

Олег: Short example:  override fun content(): Cell {         let content: NftMetaDataOnchain = NftMetaDataOnchain{data:emptyMap()};          content.data.set(sha256("name"), self.createOnchainValue("Test"));         content.data.set(sha256("description"), self.createOnchainValue("Example"));         content.data.set(sha256("image"), self.createOnchainValue("https://media.discordapp.net/attachments/1037152756206669854/1040704252714176552/Architector_Tiny_cute_isometric_bedroom_in_a_cutaway_box_border_7face436-1789-4c83-b4db-adc8263833eb.png"));         content.data.set(sha256("attributes"), self.createOnchainValue("test"));          return content.toCell();     }  https://testnet.tonviewer.com/kQBuiDnjXvb3AygTi0cwLFvZTmtL8aM0yu06z-H6yGiur9d1  https://testnet.tonapi.io/v2/nfts/kQBuiDnjXvb3AygTi0cwLFvZTmtL8aM0yu06z-H6yGiur9d1

Олег: As you can see, there is no attributes field, but it should be 🤔

&rey: Maybe it gets ignored because it's in invalid format? I guess it should be a map or list. (reply to 4088)

Олег: That what I'm talking about - how to encode list? I've tried a snake encoding in single cell, but the result is same (reply to 4089)

Howard: have you using the 0x00 in prefix like here?   https://github.com/nonam3e/tact-lessons/blob/4bbdbd12b8c226b0985c369ff952a3614a2f37dc/lesson5/sources/build_data.ts#L40 (reply to 4090)

Олег: Sure: struct NftMetaDataOnchainValue {     flag: Int as uint8 = 0;     value: Cell; } (reply to 4091)

nonam3e: Why can't you store the content as a Cell? (reply to 4092)

Олег: It is: fun createOnchainValue(val: String): Cell {     return NftMetaDataOnchainValue{value: val.asSlice().asCell()}.toCell(); } (reply to 4093)

nonam3e: I mean you may create a snakestring outside the contract and store it in the contract without processing inside

Олег: It should be depended of internal contract data. That's why I need on-chain. As you can see, other fields are showing properly (reply to 4095)

&rey: And as prefix for attributes value? (reply to 4092)

Олег: So, yes (reply to 4097)

&rey: I believe that explorers just don't support that. For instance, support for NFTs with onchain images was added at my request (for "Frozen NFTs"). (reply to 4075)

Олег: Okay, in 2 words, I want to show an attributes of NFT in getgems. But the attributes are taking from internal contract data. So, either I'm making a mistake, or there is no support yet (reply to 4100)

sd: /report (reply to 4102)

— 2023-09-03 —

Howard: They don't. I think. But I think you still can implement the parameters in your NFT Items. (reply to 4101)

User<6399953433>: how you doing geys

Howard: In light of the increasing number of people joining Tact recently, I want to share with you all the Jetton Staking POC here: https://github.com/howardpen9/staking-in-tact  - Basically, you can set a Jetton Root as the capable token contract for this. - You can check the ratio of the staking record for each depositor.

Howard: Feel free to provide feedback or ideas for expansion if you have any! (reply to 4108)

Abhishek Pandey |: https://t.me/OOIVentures/9

nonam3e: but how can you set the jetton wallet address of the contract on init of the contract? (reply to 4108)

Alexander: Why tact need RUNVM for init?

— 2023-09-04 —

Howard: Great question!  1/ I have set a receive function to inject it. We can only know the "current Staking contract's Jetton Wallet Address" after the Staking contract has been deployed.  2/ The second point is that this approach can prevent front-running. People who want to deposit tokens into the contract could otherwise track the deployer's transactions to gain an advantage.  However, this is not a critical consideration at this stage.🤕 (reply to 4112)

Пескарь™ | фронтент телефонов: 💀

Howard: hhhh

Mikhail: Never seen anything better than rust, despite its hard syntax its remembering me the days of learning C (reply to 4074)

— 2023-09-05 —

Alexander: Hi guys! Does anyone know how can I use Tact dump() method proreply?  I created a tact.config.json file in the root of my project with debug: true option. However, when I run tests in blueprint, debugLogs are empty. Didn't find to much information about it on the website.

Roman: try to use tact-template with tact-emulator package  https://docs.tact-lang.org/language/guides/debug (reply to 4138)

Howard: also can take reference here for dump() in Tact usage: https://tact-by-example.org/06-communicating-children (reply to 4138)

— 2023-09-06 —

Vlad: I am trying currently, but in FunC (reply to 4086)

Vlad: Yeah, almost none support onchain metadata as for now (reply to 4100)

User<6399953433>: how you doing

nonam3e: looks like ton.cx shows onchain nft metadata

Олег: tonviewer does (reply to 4151)

Vlad: Look at meridian collection (reply to 4152)

Vlad: Shows only in Tonkeeper web version

Vlad: Oh actually, I am not putting it as attributes, but just store it in dict with various keys (reply to 4148)

Олег: https://tonapi.io/v2/nfts/EQDtEP3nnj8BXOUegHw5MtfwxSqHsJWYHwBOPpsJG7LX2GGU (reply to 4153)

Олег: The problem on api side or on contract side with packing metadata 🤷‍♂️ (reply to 4156)

Vlad: Did anyone try to send messages from FunC to tact contract?

Vlad: I know the structure of message and op code

&rey: On API side, since I believe there is currently no correct way to pack metadata. (reply to 4157)

Daniil: then just compose the message and send it ✔️ (reply to 4161)

Vlad: But how to receive it? (reply to 4163)

Vlad: Just create a message with same fields?

Vlad: And op code?

Павел: Hi. Do we have tact plugin for JetBrains?

nonam3e: yeap (reply to 4166)

Олег: You can checkout the op code in the TACT Compilation Report markdown file (reply to 4166)

Олег: Also there you can checkout signature for func (reply to 4169)

Howard: For example, you can mint the Jetton token in https://minter.ton.org/ then transfer token to your Tact contract if you set the TokenNotification message as TEP64 (reply to 4165)

— 2023-09-07 —

Alexander: Hi! Is there any examples of upgradable contracts in Tact?

Alexander: How is the Slice size calculated in this example? It is used further as a signature, I can assume 512 bits. But how is the size determined by the compiler?

Howard: from my understanding, unfortunately, there is no upgradable function yet in Tact   https://docs.tact-lang.org/language/guides/upgrades (reply to 4172)

Vlad: Are strict Sun tact stored like dict in FunC?

Vlad: I literally wanna construct a dict like this in tact  const itemContentDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())         .set(toSha256("name"), toTextCell(content.name))         .set(toSha256("description"), toTextCell(content.description))         .set(toSha256("image"), toTextCell(content.image));

Howard: oh, just noticed. TON.vote was built by Tact language as well ❤️  https://github.com/orbs-network/ton-vote-contracts

nonam3e: "as bytes64", "as bytes32", "as remaining" (reply to 4173)

Alexander: but why in this example we don't have to specify size? (reply to 4179)

Nick: The example is focused on building the message, but not reading. (reply to 4180)

Alexander: Do we have anything other than "as bytes64", "as bytes32", "as remaining"? Maybe like "as bits200" e.t.c? (reply to 4179)

Roman: Yep  https://docs.tact-lang.org/tools/jetbrains (reply to 4167)

nonam3e: Only these 3 right now as I remember (reply to 4182)

Howard: - What is the scenario/use case for other data size you want? @agapak  - And why we need specify the data type when reading? @NickNekilov (reply to 4181)

Alexander: no, it's reading a message (reply to 4181)

Alexander: How did the compiler calculate the size of the signature?

Howard: 1/ what do you mean "how"? you want to safe more gas or?  2/ It's looks fine for me. I am using bytes64 when I deal with it. (reply to 4187)

Alexander: In this example we can't see "as bytes64", how it works?! (reply to 4186)

nonam3e: var v'signature = sc_0~load_ref().begin_parse(); (reply to 4187)

nonam3e: It takes actually from cell

Alexander: why not "Slice as Cell" 🙂 (reply to 4190)

nonam3e: Better to ask why Slice instead of Cell (reply to 4192)

Alexander: Because you need Slice on the stack (reply to 4193)

nonam3e: begin_parse then (reply to 4195)

Павел: Thank you. Installed (reply to 4183)

— 2023-09-08 —

Good: Hello. How I can specify workdir for Blueprint?

Good: If I want put dirs contracts/, scripts/, wrappers/, etc. in src/, for example

Maxey: Has anyone tried receiving external messages in Tact and successfully written tests for it?

Vlad: the easiest way is to create project called src/ (reply to 4200)

Vlad: it will put everything in it) then you can delete initial contracts and scripts

Good: thank you. But it would be more convenient with blueprint's config (reply to 4203)

User<5660798371>: Hello. Is there any way to call get functions from other contracts?

nonam3e: Nope (reply to 4207)

User<5660798371>: also external requests cannot be made from other contracts?

User<5660798371>: Are there any ways to get the value of a variable from another contract without transferring money?

nonam3e: Nope, contracts can interact with each other only by internal messages (reply to 4209)

User<5660798371>: ? (reply to 4210)

Howard: You can think TON Blockchain is a message-based blockchain. (reply to 4212)

Howard: The data usability is rely on onchain messages passing from other contracts.

User<5660798371>: What conclusion can be drawn from this?

&rey: Each TON transaction requires data of one contract only so to interact with other contracts in any way you have to send messages. (reply to 4215)

Kon: you have to send to back a message and all, it will bind contracts (reply to 4215)

Kon: A contract sends M1 to B, B sends M2 to A contract

User<5660798371>: This is simple logic, but I'd like to dispense with unnecessary transfer:  1) A sends M1 a message checking a condition in B's contract 2) M1 sends a message to M2 (reply to 4218)

Kon: to check condition, need to have some "receive" method in B contract that will send the result to A, then A will send M2. You can't just receive data from B contract in the same method on A contract, because TON is the asynchronous blockchain

User<5660798371>: Okay, got it. (reply to 4220)

— 2023-09-09 —

User<6143423349>: https://twitter.com/Henry0323389595/status/1700298222042771496?s=20

GD@0606: hello, help me out  i need to send (ton) to another account for testnet network  provide any Javascript library as a reference

nonam3e: https://www.npmjs.com/package/ton (reply to 4224)

GD@0606: through this  lib i am able to  successfully send some ton to another account ??

GD@0606: thank you .. (reply to 4225)

GD@0606: for this we want any apikey.. to send transaction because i am getting error like this data: {       ok: false,       result: '',       error: 'Rate limit exceeded: 1 per 1 second',       code: 429     }   },   isAxiosError: true,   toJSON: [Function: toJSON] }

nonam3e: Try to use another API or get the API key (reply to 4228)

GD@0606: help me out how to get the api-key bcoz i tired a lot about api key but no result

nonam3e: https://t.me/tonapibot (reply to 4230)

GD@0606: From this i am unable get the api key Can you explain the procedure on how to get the api key.. (reply to 4231)

User<5660798371>: Maybe this bot is checking for username and avatar (reply to 4232)

User<5660798371>: You don't have a username and avatar:)

GD@0606: Yes I don't have Give a suggestion to create username and avatar ??

&rey: Use ton-access nodes from Orbs. (reply to 4228)

User<5660798371>: tg://settings/edit_profile (reply to 4235)

GD@0606: So in bot i need to provide my username right ?? (reply to 4237)

User<5660798371>: show me your dialog with bot

GD@0606: Here I am getting the token from bot ,then I am ready for the testing environment of toncoin ??

&rey: Actually, https://www.orbs.com/ton-access/ provides access without any API keys. To test something on TON, you also should test a couple of transaction explorers and select one which you like and which has enough functionality. (reply to 4240)

GD@0606: Thank you bro I will check once...

— 2023-09-11 —

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Is there a plugin for tact highlight in neovim? 🤔

Howard: At this moment. Probably no unfortunately 🫥 (reply to 4247)

Daniil: Well, I think every user of Neovim here would like to have that highlighting :) (reply to 4249)

Alex: Sure, you’re right. 🙂 I noticed request and want to measure number of potential users. This will be helpful to find out the priority for this task. (reply to 4250)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: I think we neovim users are minority, so it'll also reflected in the poll

AIRDROP SCR🌱SEED: where i can get ton wallet?can you share me TON RPC? (reply to 4248)

GD@0606: anyone had done with transaction by sending some test ton from one account to another ?? please provide any reference ?? I am struct with transaction part ??

Howard: Wait. What is the question? 2 different stuff (reply to 4258)

— 2023-09-12 —

Howard: One open question I'd like to ask the community:  Do you find the terms self.reply and self.forward confusing?

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Comming from js and rust, not really, why

nonam3e: nope, anyway I always use send instead of them (reply to 4263)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Flexible field in types is an interesting approach, how was the author, can a type use the methods of a class if the "only required" field is match?

— 2023-09-13 —

AIRDROP SCR🌱SEED: Rpc TON sir (reply to 4261)

Sea💎✈️: Hello, I use template in GitHub and    I use my own wallet address in the contract.deploy.ts , then I yarn deploy and get the deploy url. I visit the url and connect my wallet and click the deploy than confirm the transaction but the website notice me the transaction is canceled.why

Vlad: Do you have enough ton?

Vlad: Are you on the testnet?

Vlad: Which template?

Sea💎✈️: Yes ,I have 4.8 ton (reply to 4275)

Sea💎✈️: https://github.com/tact-lang/tact-template (reply to 4277)

Sea💎✈️: I use chrome Mytonwallet , it is transaction fail, but I use Tonkeeper it is ok. Why (reply to 4274)

Vlad: ? (reply to 4276)

Sea💎✈️: Yes . MyTonwallet is testnet and my Tonkeeper also is (reply to 4281)

Sea💎✈️: So, why mytonwallet is fail?

Vlad: Not sure if it’s tonconnect compatible

Vlad: Actually not sure if they use tonconnect 😅

&rey: It is. https://github.com/ton-blockchain/wallets-list/blob/ef3dc744fae46b99706131f537b7a63748cbd987/wallets.json#L47 (reply to 4284)

Railgun: Hello guys, I'm new to tact. Is there any documentation on how to operate on optional type? unwrap or any function to extract the underlying data?

&rey: x!! throws error if null, otherwise returns underlying value. (reply to 4288)

Railgun: Thanks! 🙏 (reply to 4289)

Railgun: Able to defins the throw code?

&rey: require(x != null, "..."); (reply to 4291)

Railgun: Ok, that also works

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hello, Is there any SBT Standard contract available  in Tact?

Howard: No. But you can achieve this by not implementing the Transfer method.   In other words, refer to this section of the code:  https://github.com/howardpen9/nft-template-in-tact/blob/0d1b2586a1adfa266490f007e5abbee337aea338/sources/contract.tact#L143 (reply to 4296)

nonam3e: not only, it's also needed to implement revoke, ownership_assignment prove_ownership and destroy (reply to 4297)

Howard: Oh, right.  Even if the NFT Item itself does not implement the Transfer method, it's still possible for people to send the ownership_assignment message to the NFT item.  correct? @nonam3e (reply to 4298)

nonam3e: https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md I meant prove_ownership, this message should be processed and the contract should reply with ownership_proof, the same as for request_owner, also destroy and revoke processing should be implemented. So SBT is not just removing transfer message processing

— 2023-09-14 —

Rocky: Hi all, i want to create a nft collection contract in ton language. but i don't know ton please help me

Roman: https://docs.ton.org/develop/dapps/tutorials/collection-minting (reply to 4304)

— 2023-09-15 —

Rocky: Hi all , i want to other help ,   if there's any chance to change a  solidity contract to tact contract or ton contract .

Vlad: Unfortunately, no for now (reply to 4307)

Vlad: Is there an analogue of FunC function store_dict() in tact?

&rey: Even if there is not, you can use @name(store_dict) native fun storeDict(...) (reply to 4311)

Vlad: I was implementing it via: storeUint(1, 1).storeRef(self.nftItemCode) (reply to 4312)

Vlad: hm, get such error:    Type "Builder" does not have a function named "storeDict"

Vlad: @name(store_dict) native storeDict(b: Builder, c: Cell): Builder;

&rey: Have you converted Map<_, _> to Cell? (reply to 4315)

Vlad: Well, I don't use any maps

Vlad: should it be the map?

&rey: No, not necessarily. (reply to 4318)

— 2023-09-16 —

&rey: native extends storeDict(... (reply to 4315)

— 2023-09-17 —

Howard: seems not TON or Tact related. Let me delete it first. (reply to 4338)

Yakitori: https://forums.tact-lang.org/ are the forums dead?

Yakitori: (as seen on the gh repo)

Yakitori: https://github.com/tact-lang/tact#communities

— 2023-09-18 —

Howard: Ohhh that is a hidden gem. Thanks for highlight.   I think at this moment I recommend you using answers.ton.org first (reply to 4343)

User<515573853>: what is ecosystem portal for TON?

Step: ton.app (reply to 4349)

Mikhail: Hello everyone, any templates how can i call contract methods of deployed contracts?

Howard: https://github.com/howardpen9/nft-template-in-tact/blob/0d1b2586a1adfa266490f007e5abbee337aea338/sources/contract.read.ts#L21 (reply to 4351)

Mikhail: not really what i meant to, i mean like calling it from frontend, like im calling ethers in ethereum (reply to 4352)

Mikhail: because right now i am testing contract just by writing tests in IDE

Mikhail: I am also wondering is there are any methods like map.clear()? how do i clear the map?

nonam3e: emptyMap() (reply to 4355)

Eugene: By completing tutorials (reply to 4357)

Eugene: This training: https://ton-community.github.io/tutorials/01-wallet/ (reply to 4359)

Howard: https://youtu.be/D6t3eZPdgAU?si=8DYiX7ZupbM8ltL_&t=186  maybe can take a look in Vlad's latest video. It's using Tact as well. (reply to 4353)

Mikhail: Thanks! just figured that i can use clearmap() (reply to 4362)

Mikhail: https://github.com/ton-core/ton/issues/11  Is there are any ways to return a struct contains maps?

Mikhail: Cause the only way i see is to "recreate" map into string in runtime inside function

Yakitori: Is there a python distribution on Tact?

Yakitori: (or any plan)

— 2023-09-19 —

Howard: you mean deploy the code? Probably not. (reply to 4375)

Howard: The compiler will generate the TS files at this moment in your output folder

Rocky: I can use the TON Center API, but the bot is not working

Alex: You can use https://www.orbs.com/ton-access/ to connect with Tonceter. (reply to 4379)

Vlad: Does anyone has examples of working with maps?

Vlad: Docs have 0 info

Vlad: Also noticed an interesting thing: structs are transformed into Cell with refs when you use .toCell()

Vlad: So they don’t care about the fields’ names

Криптоподсвинок: Do you need to access fields’ names at runtime? (reply to 4385)

Mikhail: map<(int or address), value>   map.get() map.set() (reply to 4382)

Mikhail: thats basically all it can do

Vlad: Yeah, I need to serialise a dictionary ideally, for metadata (reply to 4388)

— 2023-09-20 —

Yakitori: Thanks - I have some JS ptsd after working on Hardhat/Solidity, so that's why I was asking. (reply to 4378)

Yakitori: @ex_binance how can we contribute by the way?

Yakitori: Lol I hadn't noticed your handle 😄

Mikhail: TUPLE:integer does not fit into cell  Any suggestions?

Mikhail: Problem accure here:  battles: map<Int, Battle>;    get fun getBattleData(id: Int): Battle {         return self.battles.get(id)!!;     } (reply to 4400)

&rey: This is issue with Fift. Is everything up-to-date?

Mikhail: yep, should be, yesterday everything was fine, i even didn't changed code

&rey: The likely reason for this issue is that code doesn't fit into cell. You may have to rearrange some functions for everything to compile correctly. By the way, does battle have 257-bit int keys, or they could be shortened? (reply to 4403)

Mikhail: не понял) (reply to 4404)

&rey: Possible solutions for your problem: 1. Change order of your functions and if-s where possible; 2. Make key length in map<Int, Battle> more specific, like map<Int as uint64, Battle>. (reply to 4405)

Mikhail: already put all possible specifications for variable types (reply to 4406)

Mikhail: changing order like really copy-paste in different part of the code ?)

Mikhail: @pcrafter looks like it didn't helped at all, the only solutions is to commend this function. With this function Commented everything works fine.

— 2023-09-21 —

Howard: Would be happy to try out with the full code. (reply to 4409)

Howard: Hi everyone, I've just updated my Jetton Token repo:  - It now supports Comment during transfers, similar to the feature available on TonKeeper.  - I've included a max_supply field in my template, as it seems to be important in most cases. This is also emphasized by https://minter.ton.org/.  - I've added instructions for generating a Transfer URL when you're trying to send the Jetton Token to a third person. (In Jetton, if you want to transfer your Jetton Token to someone, you need to send a message to YOUR Jetton Wallet, not to the new recipient's wallet.)  - forward_ton_amount can be set as lower as possible: Same as TelemintNFT. I don't know why, but looks like we can set (1e-9 TON) in forward_ton_amount without any error.   https://github.com/howardpen9/jetton-implementation-in-tact

Vlad: Didn’t get the tip about url (reply to 4411)

Vlad: What’s the difference between native throw and require?

Vlad: It should be:  extends native storeDict(…) (reply to 4339)

Howard: throw seems the style from FunC, I can't sure the difference in details like gas cost...etc. But I prefer require for sure.. (reply to 4413)

Vlad: Same here (reply to 4415)

Vlad: Btw, noticed that there is no way to serialise a dictionary in tact

Vlad: Maps are also converted in a cell with ordered data

Vlad: Slices and cells go as refs, other like bits

Vlad: I wonder how to make an onchain collection compatible with marketplaces then 🤷‍♂️

Vlad: Submitted the issue on GitHub

Mikhail: About this error:  Seem's like i used the whole possible limitation for contract size, cause it's have embeded structs. The solution was:  To create your own "bicycle" by using booleans and other low-cost data types for representation for some data. For example i was developing a small game on TON and the struct has tons of fields, some of theme were like firstPlayer: Address, secondPlayer: Address,  winner: Address?;  Seems like i used to many bytes, so i changed "winner" field to "bool" type where "true" - firstPlayer, and "false" means secondPlayer (reply to 4410)

Mikhail: Never seen any limitations about max data stored in contract. That's weird :) I thought i just will pay a little bigger number for storage when deploying.

Vlad: It also exists in Evm, I remember that you can’t pay more than 1 ETH in gas

Vlad: I think it’s the limitations of blueprint, maybe you can try another way to deploy (reply to 4423)

Mikhail: idk what function you must call to pay 1 eth in gas XD (reply to 4424)

Vlad: I did an audit and saw people putting whitelist as an array

Vlad: If you put more than ~ 1000 addresses it will cost more) (reply to 4426)

Daniil: How many items do you have in map? (reply to 4423)

Mikhail: doesnt mattep, it's even didn't compile so there was zero items (reply to 4429)

Mikhail: not runtime error, could not be compiled

Daniil: Can you show the error? (reply to 4431)

Mikhail: /

Mikhail: TUPLE:integer does not fit into cell  Any suggestions? (forwarded from Mikhail)

Mikhail: Problem accure here:  battles: map<Int, Battle>;    get fun getBattleData(id: Int): Battle {         return self.battles.get(id)!!;     } (reply to 4434) (forwarded from Mikhail)

Daniil: I’m sure the problem is in the tact compiler. You can try creating an issue on GitHub (reply to 4434)

Mikhail: but as after some detective series, the problem has been solved by decreasing amount of data stored in embeded struct

&rey: Yes, because this changed instructions to load it and, in turn, function compiled successfully. (reply to 4437)

&rey: Limit is 65536 cells. (reply to 4423)

Mikhail: then it was not really correct error desctiption by the compiler (reply to 4438)

&rey: *in Fift compiler. Tact is only responsible insofar it chooses its version and contents of Asm.fif. (reply to 4436)

&rey: It failed to put code into current cell and somewhy not proceeded by writing it to ref. Maybe also limit of 256 cells in depth was reached. (reply to 4440)

— 2023-09-22 —

Calvin | Impossible: gm

Пескарь™ | фронтент телефонов: gn

Daniil: gm

Rocky: {     "image": "https://gold-exact-termite-826.mypinata.cloud/ipfs/QmXrSEAXam3nLangGFputyUMNEt8piEjao2zdz7fbhQuc8",     "name" : "My Certificates",     "description" : "My Certificate collections",     "social_links" : ["https://github.com/iamrakki/Tact-NFT-Lesson7.git"],     "marketplace" : "getgems.io" }   this is my NFTcollection file   how to import the NFT's

— 2023-09-23 —

Howard: so you can check my NFT template, https://github.com/howardpen9/nft-template-in-tact/blob/0d1b2586a1adfa266490f007e5abbee337aea338/sources/contract.deploy.ts#L10 (reply to 4451)

— 2023-09-24 —

Alexander: Hi guys, can anyone share an example of handling bounced messages? Official docs give the following info, but it's unclear what should I do with src argument. Does it have the same members as original message (I doubt that)? contract MyContract {     bounced(src: bounced<MyMessage>) {         // ...     } }

— 2023-09-25 —

Vlad: It has same fields, but they are cut to 256(?) bits (reply to 4460)

Vlad: So if your message is bigger, you get only the part of it

Howard: gm (reply to 4464)

Alexander: I guess it should be something like this. But if my message is bigger than 256 bits (likely yes) should I get only the fields that fit in? (reply to 4465)

Vlad: Only the first fields that fit in (reply to 4469)

Mikhail: self.earned.get(msg.battleId) == false   undefined function __tact_dict_get_int_int, defining a global function of unknown type       int $earned = __tact_dict_get_int_int($self'earned, 32, $msg'battleId, 1);  Any suggestions?

Alex: Hello, community! Help me to figure out, is it important to implement highlight for both of vim and neovim editors for this ton-bounty. You also can share you thoughts in comments.

— 2023-09-26 —

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: neovim 👌 (reply to 4476)

Jamie: hello there, want to ask what should I do to receive the emitted message from the smart contract in my test case?

Vlad: Can you give more background (reply to 4478)

Jamie: I have this line of code in my .tact file:    emit(GameResult{winner: winnerAddree, randomResult: random}.toCell()); (reply to 4479)

Jamie: I just want to know how to get this message after I call the smart contract from my test.ts

Vlad: Do you use blueprint?

Jamie: yes

Jamie: I am using blueprint

Vlad: What is the emit function?

Vlad: If you wanna see the messages in tests, just take the instance of your send request and access the transactions or events property

Jamie: https://tact-by-example.org/03-emit (reply to 4485)

Vlad: Hm, strange that it’s not in the docs (reply to 4487)

Vlad: Anyway: const depositMessage = await nexton.send(....  console.log(await depositMessage.events);

Jamie: I will try this, I logged everything from depositMessage, and do a search, I cannot find anything related to the emitted message, not even the error message from the require() funciton

Vlad: It will show every event that happens after your message sent

Mario: Hey all, how "production ready" is Tact? I'm about to dive deep into TON development as part of my job and need to put this into consideration

Howard: there are a few as I know, for example: TonUP(https://github.com/microcosm-labs/tonup-contracts (reply to 4493)

Howard: oh you from OrderlyNetwork. nice (reply to 4493)

Mario: thx, will look into this

Mario: yes, do you know them? (reply to 4495)

— 2023-09-28 —

Howard: https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages (reply to 4460)

Mario: I think there's a version mismatch for unit testing. @tact-lang/coverage has @ton/core as peerDependency, but the latest compiler outputs a TS file with ton-core

Mario: which results in Jest not working properly

Mario: same for @tact-lang/emulator which relies on @ton/core, but the generated code from compiler has incompatible types, because it relies on ton-core

Mario: https://github.com/tact-lang/tact-emulator/commit/771a9550c28ef8d73a85243de1fd2a30fe6d7c01 This is a breaking change and has been published in a patch

Mario: same for this https://github.com/tact-lang/ton-coverage/commit/1dcae81942e54b98fb14f251643f015b26e4a3e7

Alexander: Hi guys! I found a possible bug in this Tact example from https://tact-by-example.org/06-authenticating-children  This chapter is dedicated to children contract authentification by it's address to make children impersonation impossible. However, children constructor doesn't check that parent address passed as an argument is really a message sender:     init(parent: Address, seqno: Int) {         self.parent = parent;         self.seqno = seqno;     }  With this code we can create a child from another parent contract and pass Victim parent address as an argument. Using self.parent = sender() is not an option as it won't affect child address this way. We can add require(parent == sender() ) to make it secure.  Did I get it right or there's something I've missed?

Howard: Good catch! I can help fix this. Thank you.  Correct. If we want to filter specific senders, then adding that line is a reasonable choice. (reply to 4509)

— 2023-09-29 —

Howard: hmmmm can't understand properly, what is your suggestion here?   I think I will update a bit in Tact-template, adding the test case from: import "@ton-community/sandbox"; import "@ton-community/test-utils";   Current testcase example is using @tact-lang/emulator, I think some people is in confusing when download the Tact-template. (reply to 4508)

Vlad: Is there any way to read the dictionary I receive in the message from FunC contract now?

First: HI evryone Learning fast)  running simple code in my smartcontract  import { toNano } from 'ton-core'; import { FirstContract } from '../wrappers/FirstContract'; import { NetworkProvider } from '@ton-community/blueprint';  export async function run(provider: NetworkProvider) {     const firstContract = provider.open(await FirstContract.fromInit(54322n));      const counter = await firstContract.getCounter()     const id = await firstContract.getId()      console.log(`Counter - ${counter}; Id -${id}`)  Error: Exit code: -256  🧐 any ideas?))  but it should be 54322 and id 0

Howard: have you deployed the contract successfully? (reply to 4518)

First: tried without real deposit and have a fault not enoF money)) is that reason?)  trying to deploy with transaction (reply to 4519)

Howard: what was that data looks lile? (reply to 4515)

Vlad: Error codes in FunC can’t be more then some value (reply to 4518)

Vlad: It crashed for my code bigger than 1000

First: import "@stdlib/deploy";  message Add{     amount: Int as uint32; }  contract FirstContract with Deployable {          id: Int as uint32;     counter: Int as uint32; //2 ** 32           init(id: Int) {         self.id = id;         self.counter = 0;      }      receive("increment") {         self.counter = self.counter +1;     }      receive(msg:Add){         self.counter = self.counter + msg.amount;     }      get fun counter(): Int{         return self.counter;     }      get fun id(): Int{         return self.id;     }  }  code of first contract (reply to 4521)

Vlad: Maybe it converts your huge error code into negative value 🤷‍♂️ (reply to 4522)

Vlad: Oh, 54322 is not an error code) Sorry (reply to 4522)

First: Error: Exit code: -256 (reply to 4526)

Vlad: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes

First: i see tnx (reply to 4528)

Vlad: no such code in tvm, so it's custom (reply to 4527)

First: i think i should unizialize first) somehow? and try script again (reply to 4524)

علی🌱SEED: Hi

Howard: GM

— 2023-09-30 —

@joinhide14_bot: Hello, I am Telegram bot to delete join/left user messages!  How to install me into chat: 1) Add me to chat 2) Give me admin permission to delete messages  Visit tgdev.io to get more free bots for chat moderation.  Visit orgrobot.io to get universal moderator bot @BetaOrgRobot

Howard: Perhaps I'm too tired, but I can't find where the problem occurs in the code. 🧐😵

&rey: As bounce cuts part of the message, not all parameters are available. (reply to 4571)

Howard: But that would be "the message in bounced" when we received the message on-chain.  I remember the code format here is correct tho. (reply to 4572)

Howard: https://github.com/nonam3e/tact-lessons/tree/main/lesson5

nonam3e: Your parameter probably is placed near the end of the message, so it doesn't exist in the bounced message. In this example src.amount is placed in the part of the message that isn't cut after bouncing. Try place it near the start of your message and it will work (reply to 4574)

Howard: I found the reason, b/c I set my query_id in uint128. It should be uint64.

Howard: yeh, correct. (reply to 4578)

Andrew: good hunting

Howard: 😂 (reply to 4581)

Vlad: Haw to check that slices(addresses) are equal?

Vlad: Ah, just through equality (reply to 4588)

Vlad: Does now() function return time in seconds or milliseconds?

nonam3e: Seconds (reply to 4590)

Vlad: @name(load_dict) extends native loadDict(self: Slice): (Slice, Cell);

Vlad: want to add load_dict function to tact, get "Invalid type of binary operation error" (reply to 4593)

Howard: I don't have much exp in FunC functions import in Tact, maybe @nonam3e has the solutions. (reply to 4594)

— 2023-10-01 —

User<6247944943>: how do we pop the emit log in test? using @ton-community/sandbox"

Alex: You can print VM logs, by adding such structure after Blockchain entity created.          blockchain.verbosity = {             ...blockchain.verbosity,             blockchainLogs: true,             vmLogs: 'vm_logs_full',             debugLogs: true,             print: true, //vm logs will be printed         }  For more details - sandbox docs.

Dev: Hello. Any example Jettons TEP-74 standard contrtract for Tact lang?

Aleksey: https://github.com/howardpen9/jetton-implementation-in-tact (reply to 4608)

Vlad: I feel this is out of topic (reply to 4613)

Santosh | Wagmi11: /report (reply to 4613)

— 2023-10-02 —

Howard: bounced messages:

Vlad: Still in limit of 256 bits( (reply to 4630)

Howard: yes!!! (reply to 4631)

Howard: I've noticed an interesting bug, I suppose:  1/ You can't place emit after the self.forward message; it will completely fail and pause the transaction.  2/ You need to measure the GasInStorage as we did in the NFT standard. Then, set the remaining TonCoin value to pass the message and trigger the emit event from the current Smart Contract address.   The method 1 will failed, but nor method 2.

iCeNT: Hello all

Howard: First Tact-by-example: https://tact-by-example.org/all

iCeNT: всем привет, может знает кто , как пофиксить ошибку ?? https://hastebin.com/share/exunenuqic.bash

K⁧: У меня такой же результат, возможно что это просто не корректный пример (reply to 4643)

&rey: yarn test -u will update your tests. (reply to 4643)

K⁧: а команды корректно работают? yarn build yarn deploy (reply to 4643)

K⁧: Thanks. It works for me! (reply to 4645)

iCeNT: Need Help 😢😢😢  yarn build yarn run v1.22.19 $ tact --config ./tact.config.json � Compiling project sample...    > SampleTactContract: tact compiler    > SampleTactContract: func compiler Func compilation error: D:\Prog\12345\tact-template-main\sources\output\sample_SampleTactContract.code.fc:5:1: error: File not found: sample_SampleTactContract.heade rs.fc   #include "sample_SampleTactContract.headers.fc"; � Compilation failed. Skipping packaging

Howard: hmmm can't understand why it happened.   It's windows and shows can't find the ...headers.fc

K⁧: Yeah. That's true. However I believe that we can fix it. Maybe someone from the Tact team can help 🥸 (reply to 4649)

Kon: On the latest version all is ok, try on v1.1.4 (reply to 4648)

K⁧: A version of what? (reply to 4655)

K⁧: the last version of the tact is 1.1.3 (reply to 4655)

Kon: https://www.npmjs.com/package/@tact-lang/compiler

iCeNT: Спаибо / Thanks 🙋‍♂️💪 (reply to 4655)

— 2023-10-03 —

Menwe| now: Hello

Howard: Hi guys, there has a Tact contest right now! Go check it out!  https://x.com/ton_blockchain/status/1708829456020766956?s=20

🗝️Nordom🚪✌️Yescoiner Sanii: Hello

Howard: hey! (reply to 4689)

ㅤ Алексей (▀ Ĺ̯▀ ): hello! when will the tasks become available? (reply to 4695)

Howard: It's close! Will announce pretty soon! (reply to 4697)

Rocky: https://docs.ton.org/develop/dapps/tutorials/collection-minting

Rocky: this is nft mint in ton. it's all backend code. how to interact with front end .

Daniil: hi, does any new detailed info about it? for now I see that Context gives to us info about message that not sended yet, but it's planned, is it right? (reply to 539)

Howard: Right. https://docs.tact-lang.org/language/ref/common#context (reply to 4703)

S: Hi everyone! Could u please tell me is there a some kind of Web IDE for Tact (like Remix for Ethereum)?

Howard: https://ide.nujan.io/ will support soon, they are plan to do so! (reply to 4706)

Pie: Gm! I am wondering whether there is implement of jetton with tact.

Pie: 😁

Howard: Yes, we do!   Check here: https://github.com/tact-lang/awesome-tact/blob/main/README.md#-smart-contracts-examples (reply to 4709)

User<5782801949>: Hello guys.  What are the tasks?!  Or what are we supposed to do actually.😅  Kinda lost.😐

Dmitry | backend4you.ton: Are Tact Challenge tasks not announced yet, or I missed them?

Howard: It's upcoming! (reply to 4698)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: self.count = self.count + ton(context().value.toCoinString())   Error: cannot reduce expression to a constant string, why is this 🤔

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: count: Int as coins;

&rey: Maybe just self.count += context().value;? (reply to 4718)

nonam3e: += is not implemented yet as I remember (reply to 4720)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Using jest, every test is stateless right?

IRFAN: gn sir

Howard: haha I think the issued is in ton(context().value.toCoinString())  1/ self.count is in Int 2/ then it shouldn't be put the operating with string here? (reply to 4718)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: I fixed, haha, now I have another problem, self.owner == context().sender, I guess jest test sender and owner aren't equal (reply to 4729)

&rey: Have you set the owner address at deploy? (reply to 4730)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: requiere() method

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Yes (reply to 4731)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Let me try this (reply to 4732)

Howard: Sender Address in the context() should be called ctx.sender sir (reply to 4705)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: I think the logic is correct but testing ownership with jest can't be made

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: I guess sender will always differ

&rey: You should deploy the contract and do the action in the same test. (reply to 4736)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Yes, deployer.getSender() it's the "wrong" part, haha (reply to 4738)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: I did it in the same, but still (reply to 4738)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: I made the owner adress, same as deployer.getSender(), test passed 🌚

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: So this can't be done, ok (reply to 3552)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: How to check presence of optionak field in message..  message Example {     field: String?; }

&rey: Check if it is equal to null. (reply to 4744)

GILBERT: Hi

Pie: Apologies if it's not appropriate to mention this here - we are developing a DeFi product on TON, and if you are an experienced TON developer, please feel free to contact me to discuss more.

— 2023-10-04 —

Jeff: HI, Is there any document about "Slice as remaining, Slice as bytes32"?

Howard: Good to share infos on jobs.ton.org as well! (reply to 4748)

Howard: Oh I only remember when dealing with Jetton Tokens, you can't use Slice as byte32. Otherwise your Tx will failed with exit code -14! (reply to 4753)

Jeff: out of gas? hmm.. I wonder when to use as bytes32, remaining, bytes64. There's some example codes but can't find document. https://github.com/tact-lang/contract-wallet/blob/1cf3c57a54bd2ab2d59669caf18ae09653010765/sources/contract.tact#L4 (reply to 4755)

Jeff: Anyway, thanks Howard!

Павел: Is Tact Ton Contest started? Could not find tasks

K⁧: it moved to 13-20 October (reply to 4759)

Howard: ⭐️

Soulincloud: 🎧 05:00 | 11.46 MB | 321 Kbps

— 2023-10-05 —

Jeff: Hello everyone, what is the right naming convention? Official docs uses camelCase but I found many of opensources use snake_case for variables.

&rey: I don't think there is "objectlively right" naming convention, and I think that it should rather follow convention of dApp language. (reply to 4775)

Jeff: We are using tact. But you mean it's our choice?

&rey: Yes; I think it's better to match JS/Python/whatever you use for interaction with smart contract.

Jeff: Oh make sense. That's nice way. Thanks!

Vlad: I use underscores (C style) for FunC And camel Case (Js style) for tact Just because the syntax is similar (reply to 4775)

Vlad: Has anyone received such error?:  "Invalid types for binary operation"

Anton: can you share the code that reproduces it? (reply to 4781)

Vlad: It's a rather huge smart contract and the thing is it doesn't specify the line

Vlad: Tact compilation failed Error: Invalid types for binary operation     at writeExpression (/Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/writers/writeExpression.js:251:19)     at Object.generate (/Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/abi/global.js:89:124)     at writeExpression (/Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/writers/writeExpression.js:411:53)     at writeStatement (/Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/writers/writeFunction.js:107:57)     at /Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/writers/writeRouter.js:209:52     at Writer.inIndent (/Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/utils/Writer.js:10:9)     at WriterContext.inIndent (/Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/Writer.js:245:29)     at writeReceiver (/Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/writers/writeRouter.js:205:13)     at /Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/writers/writeContract.js:168:45     at /Users/vlad/DEV/TON/Nexton/node_modules/@tact-lang/compiler/dist/generator/Writer.js:195:17 💥 Compilation failed. Skipping packaging Error: Could not compile tact

Anton: Can you try installing Tact from its GitHub repo? (most recent master branch — I just pushed a change that hopefully will print the file and location) (reply to 4783)

Vlad: Ok, since I am using blueprint internal installation, maybe the case

Anton: no, no, the release version of the compiler just throws an error without the location info, so blueprint does not have anything to do with it

Anton: I hope the master version of the compiler will show it (I didn’t test it though)

Anton: @ex_binance do you know how make blueprint use the non-released version Tact from GitHub?

Anton: also let me cc @Narek

Howard: No. 😵 I didn't use Blueprint back the day. (reply to 4790)

Anton: looks like one can specify it in package.json:  // package.json ... "dependencies": { "@tact-lang/compiler": “tact-lang/tact#master”, … } ...

Vlad: Just tried: "@tact-lang/compiler": "^1.1.4"  using commands from here: https://github.com/tact-lang/tact-template  Still no error location (reply to 4789)

Anton: yeah, that’s because there is no release yet

Anton: the location thing is in the most recent commit: https://github.com/tact-lang/tact/commit/6fd9091fc22499fac531cb5b7dd3958c1f678cb1

Jeff: Hello, I'm currently using Blueprint. When I run a test, I see some 'console.log' messages even though I haven't written any. Does anyone know why this might be happening?

Jeff: The script is "npm run test tests/sometest.spec.ts"

Vlad: If you are using blueprint, why not use Npm blueprint test ? (reply to 4799)

Vlad: Didn’t manage to make it show, but found the error (reply to 4789)

Vlad: I was comparing address and slice

Vlad: Thought it’s ok, since address is slice

Jeff: I'm trying to run just one test file, but it seems the Blueprint command might not support it (reply to 4802)

Vlad: Is there a way of transforming Cell to StateInit?

Vlad: Or address to Slice?) (reply to 4809)

Vlad: Looks like I found the way:  fun getNftItemInit(item_index: Int): StateInit {         let data: Cell = beginCell().storeUint(item_index,64).storeSlice(self.nFTContractAddress.asSlice()).endCell();         let itemInit: StateInit = StateInit{             data: data,             code: self.nftItemCode         };          return itemInit;     }       get fun getNftAddressByIndex(item_index: Int): Address {         return contractAddress(self.getNftItemInit(item_index));             }   At least it compiles)

Jeff: Hello, If I use blueprint, I can't use dump?

Sergey: Hi guys! I get error "Invalid type "Invoice?" for field access". How do I correctly use value "Invoice.key" of a variable if it can be null? Here I found data about use suffix "!!", but I can't figure out where I should use it. https://docs.tact-lang.org/language/guides/statements#operators

Howard: try invoice.amount!! (reply to 4822)

Howard: Since your Invoice data type has a ? mark, you need to inherently add !! to any data field when you use it. (reply to 4822)

Sergey: This is the first thing I tried, but I still fail. Should I declare in the struct type that I can get a null value? (reply to 4823)

Howard: Wait. Why you claim invoice == null in first? (reply to 4825)

Sergey: This is where I was wrong. I change it like this and still get the error (reply to 4826)

Howard: what is the error messages in therer (reply to 4828)

Sergey: Invalid type "Invoice?" for field access Line 48, col 21:   47 |         self.archive_invoices.set(self.next_item_index, Invoice{ > 48 |             amount: invoice.amount!!,                            ^~~~~~~~~~~~~~   49 |             isPaid: false, (reply to 4829)

Howard: invoice!!.amount (reply to 4830)

Howard: same as the invoice!!.description

Sergey: it didn't work (reply to 4832)

Howard: what is your struct invoice looks like (reply to 4827)

Howard: I see. Try out not using invoice? in the first line.   Using invoice: Invoice = self.get_pending_invoice(msg.index)!!;

Sergey: it will work if i don't check that if (invoice != null). But I need to make sure I don't get null. Can I use require(invoice != null, "Invoice not found"); for it? (reply to 4836)

&rey: The example by @howard_peng also checks that invoice is non-null and throws otherwise. (reply to 4837)

Sergey: Now I understand, thanks!

— 2023-10-06 —

Vlad: How to make a function return multiple values? like tuple

sd: return struct? (reply to 4844)

Vlad: @nonam3e saw your video about maps.  There you create it like this:  map<Int as uint256, User> But when I try it, I receive the error.

Vlad: Invalid key type for map:  let content: map<Int as uint256, Int> = emptyMap();

Howard: I remember that the temp value in map doesn't necessary set the arbitrary data type.   Can set let content: map<Int, Int> = emptyMap(); then. (reply to 4847)

Howard: same as you can't set coin like this:  let value: Int as coins = ton("0.1"); ❌

Vlad: But how to make map keys unsigned integers then?

pid | ton: just confirming whether my understanding is correct, sorted by level of abstraction from low to high, TVM -> fifth -> FunC -> tact ? Is this true

&rey: TVM bytecode - TVM assembly, easily confused with Fift - FunC - Tact. (reply to 4853)

pid | ton: is it true that everscale is a ton of virtual machine users? are we related to them (reply to 4854)

&rey: Everscale is a fork of TON. (reply to 4855)

Daniil: Not a fork, but different implementation of the same ideas from whitepapers (reply to 4856)

&rey: As far as I remember, Telegram Open Network already had its code, and both TON and Everscale started from it. (reply to 4857)

pid | ton: thanks

Андрей: + (reply to 4858)

Hakiem: Hi, I have a few questions regarding Jetton contract in Tact https://github.com/howardpen9/jetton-implementation-in-tact/blob/new_/sources/contract.tact.  For this portion of the TokenTransferInternal message:           // 0x7362d09c - notify the new owner of JettonToken that the transfer is complete         if (msg.forward_ton_amount > 0) {              send(SendParameters{                 to: self.owner,                 value: msg.forward_ton_amount,                 mode: SendPayGasSeparately + SendIgnoreErrors,                 bounce: false,                 body: TokenNotification {                     queryId: msg.queryId,                     amount: msg.amount,                     from: msg.from,                     forward_payload: msg.forward_payload                 }.toCell()             });         }  1) Is this used to trigger additional logic in the owner contract upon receiving jettons? 2) Is it possible to send other parameters in the TokenNotification message as per this standard? Maybe in forwardPayload? (idk what this param is for tbh) 3) If this is the case, how much forward_ton_amount is set conventionally? Is 1 nanoton enough just so that this code is triggered?

Howard: Great questions!  1/ The forward_ton_amount in text refers to "the amount of TonCoin you want to allocate for this TokenNotification messages."  This message format is required to notify the original owner that "He has transferred a certain amount of Jetton to someone."  2/ Correct. You can input whatever you desire, regardless of the parameters you wish to pass. On DeDust.io, the text message is displayed to notify everyone at the explorer level that this Tx is for adding Liquidity, Exit, Swap, etc.  3/ It depends on the action you want the receiver contract to perform. For a standard Transfer reminder in message passing, 10^-9 TonCoin is acceptable. (reply to 4862)

Ahmet Said: this deploy script works ? https://docs.tact-lang.org/start/deploy#deploying-with-typescript-and-deploy-link-1

Pie: Yes it works once you set up ts-node or Bun runtime. (reply to 4865)

Ahmet Said: so this line works out of async-await block? let init =  await SampleTactContract.init(owner); (reply to 4866)

Hakiem: Oooo thanks! Very interesting mechanism. I was stuck trying to figure out how a contract can trigger a transfer of jettons since there's no transferFrom() and allowances. I guess the transfer happens first which then triggers the subsequent logic. A few other things:  1) for (2) are you referring to inputting into the forward_payload? 2) if so, how would I input a cell containing for example an address and an int? 3) and how would I validate (in the owner contract) that the payload contains the correct number of inputs and are of the correct types? (reply to 4863)

Daniil: 3) however, if you want to start up TVM in order to process something on the other side, you need to attach at least 0.0001 TON. And if the receiving contract doesn't call "accept_message", you'll need to attach even more to cover gas fees (reply to 4863)

Vivi: Why it was false？

pizza-777: I think, If the wallet doesn't exist and bounce:true the message can be bounced and wallet will not deployed. So the bounce:false param is for replenish and deploy wallet before. (reply to 4870)

lanford: Is it possible to use asm instruction in Tact? For example: func int are_slices_equal_2? (slice a, slice b) asm "SDEQ"; This funC snippet used asm "SDEQ", I'm wondering whether Tact can also do this or not

Daniil: You can import func functions into tact. By the way, what’s the use case? Your feedback may help in Tact development (reply to 4873)

lanford: Thank you! I'm trying to convert this FunC example into Tact, but I'm not sure if asm can be used directly in Tact. There are no use-cases for me now. (reply to 4874)

— 2023-10-07 —

Alexander: Hi Does anyone have any idea how this can happen? Contract gets this message in deploy and answer falls with "no money" action phase error.      receive(msg: Deploy) {         self.requirePool();         send(SendParameters         {             to: sender(),             value: 0,             mode: SendRemainingValue,             body: DeployOk{queryId: msg.queryId, Id: self.Id}.toCell()         });     }  Result   {         from: EQAOv4R2Fe47y5SmXt7p4OWcaca2E6e7TRPEcbOVV--_j8kE,         to: EQC5JkAgIpxyfeywqgpp7ZrkuoMKR3VISfa3vODGnaXTzndr,         on: EQC5JkAgIpxyfeywqgpp7ZrkuoMKR3VISfa3vODGnaXTzndr,         value: 139094000n,         body: x{387E8B3F000000000000000200000000000000000000000000000000},         inMessageBounced: false,         inMessageBounceable: true,         op: 947817279,         initData: undefined,         initCode: undefined,         deploy: false,         lt: 45000000n,         now: 1696591129,         outMessagesCount: 0,         oldStatus: 'active',         endStatus: 'active',         totalFees: 20406000n,         aborted: true,         destroyed: false,         exitCode: 0,         actionResultCode: 37,         success: false       }

lanford: Is there an official Tact style guide? I read some sample code and noticed a mixture of CamelCase and snake_case, like this: totalSupply and max_supply.

Jeff: https://t.me/tactlang/4776 (reply to 4881)

lanford: so, what's the convention of Tact? (reply to 4882)

lanford: BTW, I think the code example on the homepage of https://tact-lang.org is outdated

Flex: Hi, all, from the doc https://docs.tact-lang.org/language/guides/upgrades said Tact currently doesn't allow contract upgrade. So my question is there is no way to upgrade the contract with the address not changed?

Vlad: I have problems with imports when I wanna deal with dict, like load_dict, dict_get? (reply to 4874)

Duck Pepe: I'm wondering too if it's possible to implement something like proxy contracts in Tact? (reply to 4886)

Howard: That is my fault haha. Right, I will fix this. Thanks for feedback. (reply to 4881)

— 2023-10-08 —

Howard: Does anyone implement the on-chain storing for metadata like here in Tact? https://github.com/ton-blockchain/stablecoin-contract

Vlad: I succeeded (reply to 4900)

Vlad: Using map

Gekodô: I like being a professional developer and dedicating my life to programming and building applications at TON, I don't know how to start but I'm willing to learn, I need help

Howard: Another idea is related about workchain question: In FunC there is always need to write this line of code, my concern is that "How Tact can implement it easily as well once more Shard-chain enable in main-net"

&rey: Shardchains don't pose significant problem, but workchains (possibly with different VMs) can. Though, why not allow someone in other workchain own jettons? (reply to 4907)

Maxey: How can I test if an address is valid using Tact?

Maxey: I think this force_chain() function can check in func?! Is there a similar method in Tact? (reply to 4908)

🅰🅻🅰🅽: Additional question, is newAddress(0, 0) equals to null address in tact?

&rey: Tact automatically does that and rejects addresses not in masterchain and not in basechain. (reply to 4912)

&rey: It's probably 0:00000000000000000000000000000000 — zero address of basechain, not a null address. (reply to 4914)

Howard: yeh, maybe we can just import the Functions from FunC for this then. (reply to 4913)

🅰🅻🅰🅽: Thanks for your answer :) (reply to 4916)

— 2023-10-09 —

Ahmet Said: does ton verifier support for verifiying of tact 1.1.4 in test net ?

Ahmet Said: or am i doin something wrong maybe

Ahmet Said: https://github.com/ASaidOguz/Tact-Lang-TON-blockchain--First-Contract

Howard: Does the size "of Value field in mapping" matters for the storing cost? (Int as coins)  <Int as uint32, Int>  can store more data than <Int as uint64, Int>, correct?

Vlad: how do you even do it? (reply to 4923)

Vlad: <Int as uint32, Int> gives me an error

🅰🅻🅰🅽: Hey, does anyone have experience importing a 'tact' file from node_modules in blueprint project? I'm looking to publish my tact code on npm and then use it by installing it in my project.  I have only found this relative issue https://github.com/ton-org/blueprint/issues/59

Vlad: Why don’t you try connecting to blueprint team and adding your package to their dependencies? (reply to 4927)

Vlad: But if it’s just some trait or contract, you can import it freely as a relative import

🅰🅻🅰🅽: Our team want to put the experimental standard traits in one repo, and reuse them in other repos

🅰🅻🅰🅽: Since it is an try out, not ready for production (reply to 4928)

Howard: oh yeh, you're right. Current Tact doesn't implement that. (reply to 4926)

Hurshidbek: Olg'a O'ZBEGIM

Eugene: Hi, do you have any specific question? (reply to 4973)

wiwi: send(SendParameters{to: l.addr,     bounce: true,     value: ton("0.1"),     mode: SendPayGasSeparately   } );   sent 0.1 ton to another address, but just received 0.099691 ton. I guess because the receiver pays some gas.  how to receive all 0.1 ton, and let the sender pay ALL gas fee?

Anthony: Hello 👋

Howard: 🫥🫠

Dmitry | backend4you.ton: receiver always pays his storage fee himself. amount of this fee depends of volume of data smartcontract stores and time when this fee had benn paid last time (e.g. time since previous tx) (reply to 4978)

&rey: Impossible, since validator of sender shard may not know anything about receiver contract. (reply to 4978)

wiwi: thx

Vlad: Вы видимо чатом ошиблись, это группа по разработке. Никаких конкурсов здесь нет!

Vlad: @expectfun

Howard: cool knowledge in detail. Can we find more about this in which whitepaper? (reply to 4990)

Daniil: Everything is in whitepapers (reply to 5034)

Vlad: Just found out that tact supports some func functions, like: store_uint(0,8) while in docs it's: storeUint(0,8) https://docs.tact-lang.org/language/ref/cells#builderstoreuint

Howard: yeh (reply to 5040)

Vlad: Coins is equal to uint120, right?

Howard: 120bits, yes. https://tact-by-example.org/02-integers (reply to 5043)

Annier: Hello

Vlad: Actually that’s not true, I was just testing with previous build 😅 with proper tact syntax (reply to 5040)

Vlad: https://docs.tact-lang.org/language/ref/cells#builderstoreslice why function "storeSlice" takes CELL as an argument?

Howard: In fact we have Tact[RU] group: https://t.me/tactlang_ru (reply to 5114)

User<6505168171>: Hello

Pie: GN! I've noticed that LSD projects on TON, such as Bemo and Tonstaker, haven't implemented rebasing tokens. Is it not possible to achieve this feauture on TON?

Alireza: So, which algorithm is used? (reply to 5129)

Howard: Sure you do!  You can try. (reply to 5129)

Annier: Hablo español

&rey: Why do you need them instead of directly changing price in DEX contract? To multiply jetton balance by some value, you need to get that multiplier into jetton wallet contract, and that may be expensive. (reply to 5129)

Annier: Yes (reply to 5152)

Howard: Hi, this is a really tough question: "How can I make the current smart contract I've built understand if the sender is the correct NFT item from a specific NFT collection I'm targeting?"  1. In the past, if I deployed the NFT collection simultaneously, it was straightforward. This is because I knew how to calculate each NFT item's address within the smart contract.  2. The issue arises when an NFT item is transferred. It doesn't convey useful information in a consistent manner. This means the contract simply receives OwnershipAssigned(0x05138d91) and can't determine if it's the desired NFT item or not. (neither which the NFT Item is down below in one Specific Collection or not)

User<6216510705>: 5 Dollars

Alireza: I guess it's about 0.5 TON for each user per month  It might be relatively high but if you can make incentive for users such as profit by staking or ..., it wouldn't be high (reply to 5152)

Daniil: no. Coins = VarUint 16 (reply to 5043)

User<6216510705>: 16 uint

Rövşen: a cto nada delat

— 2023-10-10 —

Vlad: What does rebasing mean? (reply to 5129)

Vlad: I am trying to do it with FunC nft collection (reply to 5154)

Vlad: 120bits, yes. https://tact-by-example.org/02-integers (forwarded from Howard Peng | Building on TON)

Vlad: What about this then? (reply to 5164)

Howard: in FunC we used VarUint 16, in Tact, it's coins (reply to 5175)

Howard: how? (reply to 5173)

Vlad: Not succeeded yet, but I am calculating the item address by index

Hakiem: Hey guys, bumping this message:  1) how do I input a cell containing address an int in the forward_payload field (Slice) of TokeNotification in  the TokenTransferInternal message for Jetton? 2) how can i validate that the payload (Slice) contains the address and the int? (reply to 4868)

Alex: Could you please add this link in the channel description? (reply to 5116)

Howard: right. But I don't have autho to edit the intro here.

CALANQOO: 1534542

Howard: 🫥 (reply to 5154)

Vlad: Just create it: beginCell()… (reply to 5181)

Vlad: For checking there are methods  like sliceBits, sliceRefs, preload uint…

Hakiem: In https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/message.tact,  TokenTransfer message has a custom_payload (Cell) which is not used in the receiver for JettonDefaultWallet. What is this for?

Hakiem: forwardPayload in TokenTransfer is of type "Slice as remaining" but in my test file the input must be of type cell. is this correct? And what is this "Slice as remaining" type? (reply to 5189)

Vlad: Hm, payload should be a cell for sure (reply to 5193)

Howard: EmptySetDollar, BasisDollar, Yam Finance...etc (reply to 5172)

Luke: is there a way to add asm functions

Ali: As i understand Ton is a new programming language and i have no idea about it, but i am keen to learn this new programming language. Where can i find the source to learn

Howard: https://ton.org/dev?filterBy=developSmartContract  https://tact-by-example.org/all (reply to 5276)

ARISTO BLACK: Da same🤷‍♂️😁 (reply to 5276)

Мурад: Ким каттан

Howard: Let's say I deployed a FunC NFT collection before.  And now I want it enable to implement that NFT collection(by FunC) into my current Tact contract, is it possible? I think we can't.

Alex: gmgm

Howard: I want to checking whether it's sender is one of the NFT item addresses or not. (reply to 5337)

&rey: You have to calculate StateInit cell manually, but you can. (reply to 5337)

Howard: probably no? Because even I wrote the same functions like the Collection I want to support in my current contract, the code of the StateInit in cell is still different. (reply to 5340)

&rey: You need to use beginCell().storeUint(6, 5).storeRef(actual_nft_item_code).storeRef(nft_item_data).endCell() instead of initOf(...). (reply to 5346)

Howard: what is the .storeUint(6,5) here means?

&rey: Flags indicating that code and data are available in refs. (reply to 5348)

Howard: I see, the FunC skills (reply to 5349)

Daniil: TL-B skills (reply to 5350)

𝖃𝖎𝖆𝖔𝖒𝖊𝖎 𝕬𝖓𝖙𝖎 𝕾𝖈𝖆𝖒: Gak ngerti bahasa Inggris

— 2023-10-11 —

Hiro: Hello,  how can I define enum and array in tact? Thank so much

sd: check structs and maps also check this example about arrays (reply to 5439)

Hiro: Thank you, how about enum? (reply to 5442)

Vlad: You need to have the FunC code of item (reply to 5346)

Вера: 11

ARISTO BLACK: I cannot connect my wallet🤷‍♂️😔

ARISTO BLACK: Too many scammers writing me naming "TON COMMUNITY SUPPORT" WTH?🤦‍♂️😔

ARISTO BLACK: Привет Вера.

ARISTO BLACK: Чё тут пройсходит?

Heydar: guys I saw that there is a challenge with 30k$ , do you have any info about that?

Dmitry | backend4you.ton: try to find it https://t.me/contest here (reply to 5529)

Heydar: I had a question  do you think someone is C++ engineer , can have a chance in this contest? (reply to 5532)

Dmitry | backend4you.ton: there are a lot of contests there for different specialities (reply to 5533)

Gazozz: GM everyone

&rey: You can find those on ton.org/. (reply to 5529)

Howard: Tact Contest! (reply to 5529)

Howard: I am checking the small amount transfer message, will get this exit code -14 in general. Although it's not a big deal (since the address still receive the funds), does anyone know how to pass this issued?

Daniil: It’s “not enough gas” (reply to 5598)

Howard: But even tho my contract is set like this, which is "receive the message and do nothing".   It is still will have this error? Sounds wired. (reply to 5602)

&rey: It does so many checks that it's not surprising. (reply to 5603)

&rey: *Tact does (reply to 5604)

Daniil: Starting up TVM costs 0.0001 ton, and since you have several “receivers”, there is also some code to be executed (reply to 5603)

Howard: Wait, 1. I thought those receive functions don't affect each other?  2. Why do multiple receive functions increase the gas cost, even when I specify that each receive function is targeting a different use case?   (One is for message Slice, one is for message that is "text" string message) (reply to 5606)

Daniil: Because after the compilation, TVM smart contract has only one “receiver” function for internal messages which is recv_internal. And when you define several receivers in Tact, they all are just being compiled into a bunch of if-else’s. (reply to 5607)

Howard: Right, got it.  Is that why the syntax of FunC is only based on two sides: recv_internal and recv_external? (reply to 5608)

Daniil: Yes, right. You can define more functions in FunC, but the incoming message only triggers one of these two (reply to 5609)

Howard: 1. Does FunC also have the same effect that "more receive methods lead to higher gas costs when receiving messages"?    This is super super interesting.  2. I am just testing and trying to write a smart contract that will pass all received messages (Slice, String, null OP, etc.) to the owner's address!   Then this contract should have a standardized contract that I can implement tho.

Daniil: 1. If you write more if-else’s, yes, it’ll cost more gas to execute.  2. Then why do you even need to split these receivers into a several different ones? Just do receive(){…} (reply to 5611)

Howard: 1/ I think from my knowledge in FunC, the sentence should more specific that "Adding more receive method in Tact is more like adding more if-else’s in FunC. Yes, it’ll cost more gas to execute.   2/ I thought receive(msg: Slice), receive(msg: String), receive() are three different situations. (reply to 5612)

Daniil: 2) these are different situations, but you can handle them all using the last one if I’m not mistaken (reply to 5617)

&rey: 2. Isn't receive(msg: Slice) {} sufficient for forwarding everything? (reply to 5611)

Լևոն | Brgndy: Hi everyone, trying to build my tact smart contract using “npx blueprint build” and this is the error that I’m getting

Լևոն | Brgndy: Using file: TonSmartContract Build script running, compiling TonSmartContract ⏳ Compiling...    > TonSmartContract: tact compiler    > TonSmartContract: func compiler Func compilation error: C:\Users\User\Desktop\ton-smart-contract\ton-smart-contract\build\TonSmartContract\tact_TonSmartContract.code.fc:5:1: error: File not found: tact_TonSmartContract.headers.fc   #include "tact_TonSmartContract.headers.fc"; 💥 Compilation failed. Skipping packaging Error: Could not compile tact

Լևոն | Brgndy: What could be the reason?

Howard: can't sure (reply to 5622)

Ken: test

Howard: 👋 (reply to 5651)

Ken: I'm struggling to understand the storage limitations.  1/ If I have a map<Int, Int>, can it grow indefinitely? 2/ If I have a map<Int, struct> and the struct is passed in as a message, can it grow indefinitely?

Daniil: Storage limit currently is around 30k keys for the whole contract. Also remember that the more keys you have in a map, the more costly is to operate with it. (reply to 5654)

Daniil: That’s why in TON we often use parent->child smart contract architecture where instead of a big map you deploy separate child smart contracts for each entry. This approach can be a bit harder to implement but it can scale.

Ken: If the value is a tact struct (so another cell) it would use additional smart contract storage? Would it save space if the message takes a ref instead?

Mario: Hey, can someone point me to an up to date example of how to do Jetton token testing for an e.g. DEX or any other smart contract that can receive Jettons?

Howard: https://github.com/howardpen9/staking-in-tact  ICO Example: https://github.com/tact-lang/awesome-tact#-smart-contracts-examples (reply to 5661)

Mario: Thx will later look into it (reply to 5662)

— 2023-10-12 —

Vlad: They are all compiled into 1 receive_internal function (reply to 5607)

Vlad: All cells are still stored in the contract, manipulation with refs can only make it less or more efficient (reply to 5658)

Howard: yeh, that make sense, since Tact is pre-compile before FunC. (reply to 5692)

Howard: What do you mean "manipulation with refs can only make it more efficient"? (reply to 5693)

Vlad: I mean the contract execution (reading this map) (reply to 5695)

&rey: Yes, if Tact compiled into TVM bytecode directly, it could use opcodes to index functions in contract...

FxCryptoUz: Which programming language will be used?

FxCryptoUz: In this competition

Daniil: Tact (reply to 5705)

lanford: Hi, I just wanted to confirm the status of Tact lang to decide whether to start with FunC or Tact. I checked the Github commits and it seems there have been few commits after April(10 in total for the past 5 months). Is there a stable team currently working on it?

Anton: Hi, yes, there is a team working on it. I would expect some commits after we finalize the roadmap for the language (reply to 5794)

Vlad: Guys, please update maps and docs for them. (reply to 5800)

Anton: Opening some github issues on that would be really appreciated: https://github.com/tact-lang/tact/issues and https://github.com/tact-lang/tact-docs/issues (reply to 5810)

Howard: 🫡 (reply to 5811)

.: Hi

abdallah: problems should be Tomorrow right?

— 2023-10-13 —

Yt nam: А

Yt nam: А

Spite: Could anyone send project in Tact with tests (blueprint)?

abdallah: when is the problems going to announced (reply to 4685)

Mario: Hey, is there a Message.toCell() equivalent but the other way around where I have a cell and want to parse it into a message?

Мурад: Hello guys

Андрей: hi

Андрей: it was hard

Мурад: Hackers is the best way

&rey: I remember that at some moment it was available as dataSlice % Struct, but now you only can do it manually by .load...-ing data from slice. (reply to 5962)

Mario: Ok thx. How would I load an array? (reply to 6033)

Mario: I have another question. I am receiving an error on my test: Trying to run get method on non-active contract        1022 |     async getGetWalletData(provider: ContractProvider) {       1023 |         let builder = new TupleBuilder();     > 1024 |         let source = (await provider.get('get_wallet_data', builder.build())).stack;  In this line: https://github.com/Tarnadas/orderly-ton-amm/blob/master/tests/OrderlyAmm.spec.ts#L172  I'm trying to build integration tests, so trying to mock as few as possible. I used Jetton Tact reference implementation to deploy JettonMaster in my test.  From my understanding this should output the same address, but it doesnt: console.log('ownerJettonA', ownerJettonA.address); console.log('await tokenA.getGetWalletAddress(owner.address)', await tokenA.getGetWalletAddress(owner.address));   So I assume this is the reason why I receive this error. Does anyone have an idea what's going wrong?  Also do I really need the Jetton reference implementation? Could I do this with the JettonMaster from ton library without relying on my own test Jetton code?

Howard: Trying to run get method on non-active contract  means your contract didn't deployed properly. Pause/fallback in the middle I think.   Better to check the contract code, or deploy on test-net to find the exit code and see which contract failed to reply (reply to 6038)

Duck Pepe: are the tasks going to be published in a public repository today?

Mario: Ok yeah it's because these aren't the same, but idk why https://github.com/Tarnadas/orderly-ton-amm/blob/master/tests/OrderlyAmm.spec.ts#L170-L171 (reply to 6039)

&rey: Oh, are you trying to build AMM on base of my code? Have a good luck! (reply to 6044)

Mario: Is that yours? Yeah (reply to 6045)

Mario: I mean I've been just copying it bit it will likely be very different. I'm very new to Tact and Ton

Mario: So you say this will be very difficult?

&rey: I didn't really intend sarcasm though I haven't even found any jetton wrappers (and I can't take them from your repo as it has no license). (reply to 6048)

Heydar: too late knew 😩 finished the deadline ... (reply to 5597)

Duck Pepe: so guys, is the exact time of the tasks reveal known?

Mario: So how did you test your code? I still am trying to find a repository with integration tests for Jetton transferring (reply to 6049)

Mario: I just used the Jetton Tact implementation and modified it slightly. I think it has been linked quite often here or you can find it in awesome tact repo

&rey: I still haven't (if you see build logs, the tests don't even launch). (reply to 6052)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: alefmanvladimir/lesson8/tree/main/contracts @ github (reply to 6053)

Mykola: It seems like Tact Challenge has already started. And somebody solved all the tasks. LOL

Андрей: How?) (reply to 6056)

&rey: At least not "first 6 of 5" 😀

Mario: This repository does have any tests where Jettons are sent to another contract nor does it even test that JettonWallet gets deployed from JettonMaster (reply to 6055)

pizza-777: I've implemented my version of jetton with tact and you can find the deploy ability and tests this repo https://github.com/pizza-777/Jetton-Tact (reply to 6064)

Duck Pepe: wow, now it became clear (reply to 6056)

Mykola: I guess the jury was testing if there solutions were actually passing there tests. So it is a good sign that challenge starts soon.

Mario: Thx this helps! I've seen this: user1JettonWallet = blockchain.openContract(JettonWallet.fromAddress(user1JettonWalletAddressFromMaster));  And was wondering why JettonWallet.fromInit with respective variables doesn't return the same address (reply to 6065)

pizza-777: I don't know this too) (reply to 6068)

Mario: Could be a bug in the generated TS code?

Mykola: 📢 Tasks for TON Tact Challenge are live now!    💰 $30K prize pool ⏰ Deadline: 20th of October, 23:59:59 GMT+4. Don't miss out! ⏳  Are you ready to jump into the challenge and learn Tact? 🚀💻  Link to Tasks GitHub Repository  ➡️ https://github.com/ton-community/tact-challenge  P.S. Don't forget to fill in the Participation Form before submitting your results! (forwarded from 🏆 TON Smart Challenge bot)

Duck Pepe: happy coding, guys

Ahmet Said: in contest repo why im having this error ? Property 'toHaveTransaction' does not exist on type 'JestMatchers<BlockchainTransaction[]>'.ts(2339)

Pie: Excuese me, it is my first challenge, do I need to clone this repository and pass it on to my own private repository.

Dmitry | backend4you.ton: yes, as readme says. clone to local computer, create new empty  private github repo and push from local into this new repo. then set secret (reply to 6086)

Dmitry | backend4you.ton: same thing. https://docs.tact-lang.org/language/guides/debug says that '@tact-lang/emulator' should be used for testing, but challenge repo uses '@ton-community/sandbox' ... (reply to 6085)

Ahmet Said: checked the tact by example code and Tal kol using sandbox not tact/emulator and tact/emulator in here https://docs.tact-lang.org/language/guides/debug doesnt work at all cause theres no dependency information

Mario: Task 3 has wrong description: "" So, if smartcontract have 10 of token A and 2 of token B, then after sending 1 tokens B you will receive 5 of tokens A." 2 * 10 = 20 So if someone sends 1 token B it's 3 * x = 20, but x is definitely not 5 as explained in the text

Mario: What tests need to pass? Should we write our own tests or how to get points for tests?

Dmitry | backend4you.ton: real tests are only known to challenge server. you'll only know how many you pass

Sergey: where can I get information about the competition? what's the deadline? Should I have pre-registered?

&rey: Maybe there is another invariant, not tokenA*tokenB? (reply to 6090)

Dmitry | backend4you.ton: https://t.me/smartchallengebot (reply to 6095)

Dmitry | backend4you.ton: and https://t.me/toncontests/141 (reply to 6095)

Mario: I doubt it tbh. I just hope that the tests don't have such kind of errors (reply to 6097)

&rey: I have an example of DEX with custom invariant, so it may as well be not a mistake. https://github.com/ProgramCrafter/MulDEX/blob/2df63bf49cbaec660ee736e29ce9e22da25695fd/contracts/multitoken_dex.tact#L152

Luke: How do you fix this  Func compilation error: C:\Users\opk\Desktop\TON\tact-challenge\build\Task1\tact_Task1.code.fc:5:1: error: File not found: tact_Task1.headers.fc   #include "tact_Task1.headers.fc"; 💥 Compilation failed. Skipping packaging Error: Could not compile tact

Capitoska: If you are developing on Windows, you should use WSL for the build (reply to 6102)

Rami: My ci throws the error "Unknown github user" for tact-challenge, my github username is "liketurbo". I've already tried to reregister, but still the same error 🤷

Ahmet Said: trying to send solution but get this Error message: Unknown github user

Rami: Welcome to the club 😅 (reply to 6117)

Dmitry | backend4you.ton: Recheck that you added token to secrets (reply to 6117)

Ahmet Said: already set my user-name as shown and set the user token

Ahmet Said: still same problem

Dmitry | backend4you.ton: GitHub repo: Settings / Secrets and variables / Actions / Secrets - and add USER_TOKEN with your value?

Rami: I've set the USER_TOKEN in secrets and in variables. I've also tried regenerating and setting it again (reply to 6119)

Dmitry | backend4you.ton: No need to set in variables, in secrets is enough. But challenge servers have some problems with tests now, maybe they have sync problems too.

Ahmet Said: added workflow_dispatch for manuel starting is it bad effect the workflow? (reply to 6124)

Alexey: +1 Failed to submit TON Tact Challenge solution. Status code: 500 Error message: Unknown github user

Павел: Regeneration of github token helps for me, but then I have a such error:  Task1: func compiler\n💥 Compilation failed. Skipping packaging\n____ TACT ERROR ____\nFunC compiler crashed\nRuntimeError: Aborted(RangeError: WebAssembly.instantiate(): Out of memory: wasm memory (reply to 6126)

Luke: How do i enable toHaveTransaction   Property 'toHaveTransaction' does not exist on type 'JestMatchers<BlockchainTransaction[]>'.

Fortune: add   import '@ton-community/test-utils';  to your imports

Ahmet Said: thanks (reply to 6129)

Sergey: I see that people have already earned their first points, but I'm still struggling with the error Unknown github user 🤣

Dmitry | backend4you.ton: That 8 users were happy to hit server in several minutes it was alive

Sergey: is there a method to run testing of only one contract?

Sergey: I don’t understand, can I change solution to the task after successful submission? For example, i get 1 points for task 1. Can I make a new decision and get more points?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: somebody could help me? I can't send the contest solutions... I get an error

Ahmet Said: yarn test ./tests/Task1.spec.ts (reply to 6137)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If you are an windows user, you must use WSL or github codespace (reply to 6139)

Sergey: isn't he talking about a solution server error? (reply to 6150)

Luke: My code compiles and passes my local tests, but gets compilation error on server  ____ TACT LOG ____    > Task2: tact compiler    > Task2: func compiler 💥 Compilation failed. Skipping packaging ____ TACT ERROR ____ FunC compiler crashed RuntimeError: Aborted(RangeError: WebAssembly.instantiate(): Out of memory: wasm memory). Build with -sASSERTIONS for more info.  Anyone know why?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: right, I read wrong, I read "I can send the contest ...", sorry (reply to 6151)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: The problem is when I submit the github solution... it tells me that the user does not exist or but I registered correctly in the bot and everything

Sergey: welcome on board (reply to 6154)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Possible errors: 1- you tried to submit before registering with bot 2- error with storing github token  3- typo in github account you submitted in the bot (reply to 6154)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: a ti también te pasa lo mismo (reply to 6155)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I'm already tired of registering... of generating the token... I don't know what the mystery is (reply to 6156)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Failed to submit TON Tact Challenge solution. Status code: 500 Error message: Unknown github user Warning: The set-output command is deprecated and will be disabled soon. Please upgrade to using Environment Files. For more information see: https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/

Luis Daniel ,Ⓜ️ MEMES▪️🐾: This is the error

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: verify these 3,  your token must be store in repository secrets with naming 'USER_TOKEN' »»»»»» DO NOT ADD ANY ADDITIONAL CHARS TO YOUR TOKEN  your github account must be sent in '@yourGithubAccount' style (reply to 6156)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I did it like this

Luis Daniel ,Ⓜ️ MEMES▪️🐾: 🥲

Sergey: this does not work (reply to 6164)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if you know how to debug github actions try it in debug mode, (retry all failed jobs @ right corner, then check the debug box)

Sergey: I'll just wait until tomorrow) (reply to 6170)

Мурад: Узб?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: but is it general? Does it happen to everyone? (reply to 6172)

Sergey: I'm not sure. But I see that leaderboard is not growing. (reply to 6174)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: How can you count on the contest manager to ask questions?

Alexey: I have the same issue (reply to 6174)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: look but there are people who have made shipments (reply to 6175)

Sergey: it was in first minutes. I think the counter task can be done by a little more people (reply to 6178)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I don't understand... eh, the problem we have is that github gives an error when submitting the code for review, right? (reply to 6179)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: So how could they send... and we can't because it says the user is wrong?

Sergey: I don't know what the problem is, but you are not alone. I think there are some problems on the testing server right now.

Sergey: But nothing prevents you from working on the assignment without submitting it. This can be postponed.

Luis Daniel ,Ⓜ️ MEMES▪️🐾: ooo now... I feel more relieved I thought it was some problem of mine (reply to 6182)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: If you're right, that's actually what I plan to do. (reply to 6183)

Arash Nemat Zadeh: Guys I regenerated my github token from the bot and my answer finally got accepted✅  You can give it a try

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I'll try it, thanks for the information. (reply to 6186)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Run response=$(curl -s -w "%{http_code}" --max-time 600 -X POST -H "Content-Type: multipart/form-data" -F "file=@code.zip" -F "token=***" -F "github=ldgalvarez" $ENDPOINT_URL -o response.json) Failed to submit TON Tact Challenge solution. Status code: 500 Error message: Unknown github user Warning: The set-output command is deprecated and will be disabled soon. Please upgrade to using Environment Files. For more information see: https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/ Error: Process completed with exit code 1.

Luis Daniel ,Ⓜ️ MEMES▪️🐾: 🙁

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I get the same error

Sergey: In what format did you enter your github username? (reply to 6186)

Sergey: I still can't get over the error

Luis Daniel ,Ⓜ️ MEMES▪️🐾: asi

Luis Daniel ,Ⓜ️ MEMES▪️🐾: coo decia el bot

Luis Daniel ,Ⓜ️ MEMES▪️🐾: nor I (reply to 6192)

Arash Nemat Zadeh: @arashnm80 (reply to 6191)

Sergey: Failed to submit TON Tact Challenge solution. Status code: 500 Error message: Unknown github user

Sergey: it's endless

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I get a similar error (reply to 6199)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: correction... I get the same error

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Failed to submit TON Tact Challenge solution. Status code: 500 Error message: Unknown github user

Sergey: Well, I don't know what else I can do.

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Me neither... how can I contact support?

Sergey: I tried 2 more times and finally it worked (reply to 6205)

Ahmet Said: yeh it works

Luis Daniel ,Ⓜ️ MEMES▪️🐾: It still doesn't work for me😭 (reply to 6206)

Sergey: I just couldn't check the result (reply to 6207)

Ahmet Said: didnt reflect yet maybe same here

Ahmet Said: all test pass for 1 question

Luis Daniel ,Ⓜ️ MEMES▪️🐾: because it doesn't work for me🥲

Luis Daniel ,Ⓜ️ MEMES▪️🐾: ?

Sergey: new error

krau5: Visit the link. It’s not the new error. It’s a new approach to show the results ( but there is an error 🤣) (reply to 6218)

Sergey: Aborted(RangeError: WebAssembly.instantiate(): Out of memory: wasm memory) (reply to 6219)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: new error

krau5: The servers are down )) (reply to 6220)

Sergey: Then it's time to go to bed. I hope resources will be increased. (reply to 6222)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: pain 🥲 Please not again, I hate this

Luis Daniel ,Ⓜ️ MEMES▪️🐾: where can I see that (reply to 6227)

— 2023-10-14 —

Kernel: When the leaderboard updates ?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: there is no cache. so, I can see my results live (reply to 6229)

Ken: Crashed tests! (Hint: Check Tact Contract Arch) 😂

Ahmet Said: better then nothing xdd

Howard: I think will transit or at least give the method based on @ton/sanbox tho (reply to 6088)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I have a problem, the exercises are good... but I don't appear in the classification... do you know what happened?

Kernel: it's ok, you need to wait until your dns provider get refresh, then you can see your result stream (reply to 6241)

Ken: Why do I get crashed tests? Can we have at least 1 test case for each problem (doesn't have to be the same as in evaluation)?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: well that was hours ago (reply to 6242)

Luke: does anyone know if there are libraries that include jetton and nft contracts for testing, like the Treasury contract in blueprint

Kernel: I have the same problem 5 hours ago (reply to 6244)

Luke: u figure it out? i am still in pain (reply to 6227)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm good now, try your best (reply to 6247)

Luke: thx, i just passed, im kind of mad about the reason it failed though (reply to 6248)

❤KAMOLA❤: Aloo

Javohir: hello

Javohir: how to learn "tact"

Javohir: ha

Шахноза: Qanaqa musobaqa ekan

Javohir: bilmadim

Javohir: dasturlash (menimcha)

Шахноза: Priz 30 000$ dib yozib qoyganakan

Javohir: dasturlash boyicha menimcha (reply to 6311)

Javohir: o'zbeklar kopayayapti

Шахноза: Mars IT school da oqiganmisiz

Javohir: yo'q

Javohir: Ishtirokchilarning eng yaxshi 15 foizi TONda 10 000 dollarni bo'lishadi Ishtirokchilarning o'rtadagi 30 foizi TONda 10 000 dollarni bo'lishadi Ishtirokchilarning eng quyi 55% 10 000 dollarni TONda bo'lishadi Har bir sovrin jamg'armasi ushbu guruh ishtirokchilari o'rtasida teng taqsimlanadi. Hammasi bo'lib, biz 30 000 AQSh dollari miqdorida TON mukofotlarini beramiz.  Umumiy mukofot ishtirokchilar soniga qarab o'zgarishi mumkin.  🚀 TON bilan ishlashni boshlash Blokcheyn yoki TON rivojlanishi uchun yangimi? Bu yerdan boshlang:  Blokcheyn asoslari TON Kirish Dasturchilar portali 📘 Muhim takt resurslari Bo'lishi kerak bo'lgan ushbu materiallar bilan takt tilini o'zlashtiring:  Misol bo'yicha xushmuomalalik Takt hujjatlari Video darsliklar Tact hamjamiyatiga qo'shiling Foydalanishga tayyor aqlli shartnoma misollarini bu yerda toping . Ajoyib takt omborida Tact haqida ko'proq bilib oling .  🛠 Tact kompilyatsiya va sinov uchun vositalar Tact Challenge uchun Tact Challenge uchun biz joriy omborni klonlashni tavsiya qilamiz va yuqorida tavsiflangan topshirish yo'riqnomasiga amal qilamiz.  O'zingizning Tact loyihalaringizni tezda boshlash uchun Tact-shablonni silliq ishlab chiqish tajribasi uchun foydalanishni tavsiya etamiz :  Repo shablonini klonlash yarn buildshartnomalar tuzish yarn testshartnomalarni sinab ko'rish uchun yarn deployshartnomalarni joylashtirish uchun 🌍 TON Developers hamjamiyat suhbatlari Bog'lanishdan xabardor bo'ling va boshqa ishlab chiquvchilar bilan aloqada bo'ling:  TON Dev Chat (EN) TON Dev Chat (yǎng) TON Dev Chat (RU)

Шахноза: Siz qatnashasizmi (reply to 6323)

🪐: Ha

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 🥶🥶🥶

Heydar: is that second task? (reply to 6227)

Chorshanbi: 10

Mатлубахон: Qanday qatnashsa bõladi (reply to 6336)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: My English is very poor, who can help me explain task #5? 🤕  we have 10 items if prevOwner is admin so: totalNftsHeld + 1 // 11 items else replace swapped item with incoming one still we have 10 totalNftsHeld?

Heydar: Sorry guys, a question. When I was reading a tutorial, it had a link that was saying it's my reward. The link is starting by ton://transfer what's that? who knows?

Dmitry | backend4you.ton: It’s a link that will transfer coins from your wallet (one that signs this transaction) to some other wallet. I don’t think that link is a reward for you ;)

Heydar: but it was on official website , how its possible 😐 (reply to 6413)

Андрей: then you are mistaken in considering the site to be official (reply to 6449)

Heydar: yeah , your right. https://ton-community.github.io/tutorials/02-contract/ (reply to 6450)

User<6290590704>: Man chunmadim nima qilish kk uzi (reply to 6336)

User<6290590704>: Uzbekla chuntrila

Dmitry | backend4you.ton: my browser can't find (Ctrl+F) ton://transfer text on that page (reply to 6451)

Dmitry | backend4you.ton: if you means "Reward" at the end - thats NFT. You transfer 0.5 TON (or 0.05? its not easy to count zeroes manually) and recieve this NFT in response.

T010110111T: 8

Heydar: the reward section (reply to 6463)

Heydar: which NFT? (reply to 6466)

Dmitry | backend4you.ton: read above QR (reply to 6471)

Heydar: so in action it's not reward :/ (reply to 6472)

Dmitry | backend4you.ton: action is _request_ for reward. and reward is NFT

Dmitry | backend4you.ton: (unless somebody hacked official website 😁)

Dmitry | backend4you.ton: damn, what is the 6th test in task2...

Dmitry | backend4you.ton: in receive(msg: Slice) the msg and context().raw are the same thing ?

Dmitry | backend4you.ton: also, if I have receive(msg: Bounced) and receive(msg: Slice) - is there a way to "abort" processing recieve(msg:bounced) and fallback to receive(msg:Slice) ? say "return false" or something ?

Arash Nemat Zadeh: I am following getting-started-from-scratch tutorial from here: https://docs.tact-lang.org/start#getting-started-from-scratch  but I get this error in yarn build: 'tact' is not recognized as an internal or external command  does anybody know how to solve it?

Alexander: Hi guys, anyone experienced same issue when trying to run Actions on tact challenge repo? Failed to submit TON Tact Challenge solution. Status code: 500 Error message: No registered user found for this token.   I successfully regitered at Challenge bot, set up secret var and etc.

pizza-777: In the third tact challenge contract there are no code of jetton wallet. So is the problem to check incoming jetton token type.

Dmitry | backend4you.ton: Task 2: "Create a contract that forwards all messages sent and tokens received" - maybe messages "recieved"  too?

Light Shadow: Guys how to submit

Light Shadow: I'm newbie here

Carlos: Read de readme file in the repo (reply to 6532)

Howard: This might be windows issued. (reply to 6485)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Can someone guide me on what Task4 Test4 could be?

User<6536277585>: 20

Влад: What is the code for Jeton Wallet from Task 3?

Dmitry | backend4you.ton: answer is "no". replacing one with another changes number of successful tests (reply to 6483)

Dmitry | backend4you.ton: https://docs.tact-lang.org/language/ref/common#context (reply to 6550)

Heydar: I just joined TON community and anything related that from yesterday , and it's so hard to know what's going on :D do you have good reference to learn that?(Tact language and good training questions) I'm C++ software engineer , and have not good knowledge about any related topics. (reply to 6549)

Dmitry | backend4you.ton: https://docs.tact-lang.org (reply to 6552)

Heydar: not enough. :/ (reply to 6553)

Howard: https://github.com/tact-lang/tact/blob/main/stdlib/libs/deploy.tact (reply to 6548)

Dmitry | backend4you.ton: lol, am i first with this type of error ? :)

Howard: would you mind to share with me your code? DM me (reply to 6561)

sd: me too (reply to 6561)

Dmitry | backend4you.ton: this will violate "important rule #2", sorry (reply to 6562)

Howard: right, ok. (reply to 6564)

Ahmet Said: context().value is same as stored coins inside the cell?

Howard: 1/ context().value is in coins data type I think  2/ What do you mean store inside the cell

Ahmet Said: let msg_body:Cell=beginCell().                       storeCoins(msg_value).                       storeAddress(sender).                       storeRef(forwarded_msg).                       endCell(); trying to send the coin like this

Ahmet Said: value  Int  Amount of nanoToncoins in message for ctx.value it says Int

Ahmet Said: theres ambigiuty in code i mean where the value exist ? is it the value field which is in send function or its within the cell

Grit: message(0x7362d09c) TokenNotification {     queryId: Int as uint64;     amount: Int as coins;     from: Address;     forwardPayload: Slice as remaining; } Hey, guys! Please enlighten me how can I understand which Jetton contract this notification refers to? Because what I understand, the sender of this message is JettonWallet contract, right? But I can't see any reference to the actual Jetton contract here. (this is from task #3)

Dmitry | backend4you.ton: sender of this notification is your jetton contract (AFAIK) (reply to 6581)

Grit: 👌👌 this makes it simpler! Thanks! But I just browsed a Jetton Wallet sources and is sends this kind of message (reply to 6582)

Dmitry | backend4you.ton: yes. or you think that jettonAddressA/B is jetton master contract? (reply to 6583)

Grit: Yes this is what I was thinking. (reply to 6584)

Grit: Are these just someones wallet addresses?

Dmitry | backend4you.ton: Then I think we’re in big trouble ) (reply to 6585)

Grit: 🙈🙈 ahhh... will read more docs ))) (reply to 6590)

BrayanD: what happens with the price of jetton A if amount of jetton B is 0?

Aleksey: context().value (reply to 6609)

Ahmet Said: what a dem edge case is this xdd cant find it

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: your refund handler must response to admin contract , ONLY (reply to 6647)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: any hint for task5 test9 please? gas usage is related to batch withdrawal  or it's my mistake 🤔

Ahmet Said: thanks man i wouldnt think about it for zillion times (reply to 6652)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: try to read descriptions with more focus, learn and learn (reply to 6654)

Ahmet Said: yeap totaly (reply to 6655)

Dmitry | backend4you.ton: It seems I'm sending messages in some wrong way, because test results are the same when I use send() and when I don't use them at all.  For example for Task 4, for sending NFT - should msg be sent with value = 0 and mode = SendRemainingValue, or with some fixed value and mode = 3? Should it have forwardAmount and forwardPayload or not?

Kilyandra: Can I use JettonTransfer in body of send parameters? And what should I put in customPayload and forwardPayload? Empty values?

Object6: Who won't have time to take part? Or he will accept it on the last day. Did you try in vain? (reply to 6074)

— 2023-10-15 —

Luis Daniel ,Ⓜ️ MEMES▪️🐾: ____ TACT LOG ____    > Task3: tact compiler    > Task3: func compiler 💥 Compilation failed. Skipping packaging ____ TACT ERROR ____ Func compilation error: /Task_Task3.code.fc:32:1: error: previous function return type ((slice, int, int, slice, slice, int, int, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((slice, int, int, slice, slice, int, int, int), int)   }

Luis Daniel ,Ⓜ️ MEMES▪️🐾: What is this error due to?

Howard: https://t.me/tactlang/6109 (reply to 6699)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I get that error when I send it from github, not on the PC... um, I don't compile on the PC.😅 (reply to 6703)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: On task number 3... the message format for returning tokens to clients and sending exchange tokens?... is this? message (0xf8a7ea5) Token Transfer {     queryId: Int as uint64;     quantity: Int ascoins;     destination address;     responseDestination: Address?;     custom payload: Cellular?;     forwardTonAmount: Int ascoins;     forwardPayload: Cut as remainder; }

User<5619119025>: Maybe because in older versions of language, "bounce" field didn't have default value. (reply to 6718)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: could be (reply to 6719)

Павел: How to convert gas to toncoins? How can I understand, how many toncoins should I sent to cover 1m gas usage?

Heydar: sorry when we need trait ? I mean where we have no way to avoid use that? sorry Im newbi.

Ken: It's a convenience, you don't have to use that (reply to 6732)

Heydar: Sorry really I cant understand what's useful for? do you have any link to explain that better? (reply to 6733)

🅰🅻🅰🅽: Take our project as example, you can easily create a TEP 0074 jetton token with a little bit customize logic  https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/contracts/jetton_example.tact (reply to 6732)

Heydar: Thank you so much, I think that will be so good point to start practice. (reply to 6735)

🅰🅻🅰🅽: Hahaha, if you like it, you can give us some support by clicking a star! (reply to 6736)

Heydar: ofc , I did now. followed too, I wanna learn more on TON's related technology. (reply to 6737)

Ken: Or the stdlib deployable trait https://github.com/tact-lang/tact/blob/main/stdlib/libs/deploy.tact (reply to 6734)

Daniil: hi, should I do something else if I want to send transaction where the string comment is more than 127 chars?  let str_builder: StringBuilder = beginComment(); str_builder.append("string more than 127 chars"); self.reply(str_builder.toCell());

Ken: What's the use case? You can use cell references instead, but it won't show up on block explorers. (reply to 6740)

Daniil: just to know how to do it, need to send a long text coment (reply to 6741)

Daniil: I've run it through the local tests and they are passed, but I'm not sure if there should be an error. Is there some method in tests to log an info about completed transaction? like it shows in block explorers

Dmitry: guys, i am new to environment, most of the documentation is brilliant, but it is not that intuitive how to execute or compile tact files. Can anyone advice in dm or here?

🅰🅻🅰🅽: I  recommend you using Blueprint. With yarn build to compile  tact contracts  and yarn deploy to deploy your contract.  https://docs.ton.org/develop/smart-contracts/sdk/javascript  https://github.com/ton-org/blueprint (reply to 6747)

Vadym: hey guys, I'm using dump in the code, but I can not see results when running a test. Shall I enable something in jest.config.ts to see dump result?

Daniil: current code is showing up comment in the explorer (here is more than 127 chars). you mean, if I will use references, then it woun't? (reply to 6741)

Ken: can you try more than 128? (reply to 6750)

Daniil: It’s 140+ on the screenshot (reply to 6755)

Heydar: can anyone help me please. when I downloaded the repo(challenge) and then did: npm install npx blueprint build (choosed task1) now the error is: Build script running, compiling Task1 ⏳ Compiling...    > Task1: tact compiler    > Task1: func compiler Func compilation error: M:\MyPartition\tact-challenge\build\Task1\tact_Task1.code.fc:5:1: error: File not found: tact_Task1.headers.fc   #include "tact_Task1.headers.fc"; 💥 Compilation failed. Skipping packaging Error: Could not compile tact

Ken: Interesting... it didn't compile when I tried a long string a couple of months ago (reply to 6756)

Павел: Hi. Did you solve 3-d task? (reply to 6655)

Bharat 🐾🌱SEED: 8⃣

Heydar: Can somebody  tell me how build it please? (reply to 6757)

Павел: use npm run build instead (reply to 6771)

calpaliu.eth: GM

Heydar: thanks for guide, but still it giving same error (reply to 6777)

Павел: Dont’ know how to help, sorry… Did you add utils before test? (reply to 6782)

Павел: How to udnerstand jetton address? Is it `destination`

Heydar: Thanks for trying to help ❤️ , Im  beginner in Tact , totaly Im C++ developer and im learning tact recently. (reply to 6792)

Grit: hey, guys! My github actions are failing one after another. Anyone has this issue?

Grit: Ah

Grit: I see Failed to submit TON Tact Challenge solution. Status code: 500 Error message: You can't submit more than 10 solutions per hour.

Grit: Hit the submission limit

Heydar: please how you started build and running your tasks? (reply to 6800)

Heydar: is that incorrect? (reply to 6757)

Grit: actually there are built in scripts in place: just run 'yarn build' (reply to 6757)

Grit: also make sure you did yarn install

Grit: before running

Grit: or if you use npm then run 'npm install'

Grit: and after that 'npm run build'

Heydar: I cloned the repo(challenge) and then did: npm install npx blueprint build (choosed task1) , (also tested npm run build too) (reply to 6807)

Heydar: but didnt help me.

Heydar: this is the error. (reply to 6757)

Grit: ahhh

Grit: you are Windows user... I am not sure what to do, but it seems somewhere before people answered Windows related questions

Heydar: oops, so it's depend on the platform , weird. (reply to 6812)

Grit: not really, It's just some environment quirks IMO

Heydar: I think it's new problem maybe in the latest version , because somebody has same problem recently  https://github.com/tact-lang/tact/issues/71 (reply to 6814)

Grit: yes, windows related, sorry, I can't help you with that, I'm on linux

Heydar: So Im going to switch on linux now : D (reply to 6816)

Grit: btw for blockchain dev stuff linux is the best

Heydar: for anything except games it's the best (in next vulkan generation , it will be best for games too :D) (reply to 6818)

Grit: yep (reply to 6823)

M: U don’t need to necessarily, you can use WSL on windows for build staff (reply to 6817)

calpaliu.eth: It's quite fun to build the Tact Smart Contract

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: tact-challenge's git repo has all needs for running on windows, without WSL, you can follow it for your other projects  I suggest you to use yarn || pnpm as your package manager (reply to 6817)

MBA: hi everybody what parameters exactly Address type will give us?

Howard: yeh, this looks great! (reply to 6735)

Grit: Hey people, where can I find the description of every SendParameters.mode flag?

Влад: https://docs.tact-lang.org/language/ref/message-modes (reply to 6858)

Grit: thanks!

Bharat 🐾🌱SEED: 19

krau5: Cannot reduce expression to a constant string  What’s wrong with the code? The types are correct, as the readForwardFee returns Int and toCoinsString returns String  ton(context().readForwardFee().toCoinsString())

Yash: Hi, I created the solution for first problem and uploaded it on the github but there I am getting the error that Error message: No registered user found for this token.. Even when I have registered on the bot.

krau5: I saw that someone already got this error once, but I did not find a solution (reply to 6869)

Ahmet Said: https://github.com/ton-community/tact-jetton in this code coins means 10^9 as decimal ? and where can i see the jetton trait have been presented as import

Ahmet Said: this part  import "@stdlib/jetton";

Heydar: tested these too, had some problems , also reported the issue in github. but for now switching to linux helped me, thank you so much (reply to 6830)

Grit: hey everyone, I'm getting this in github actions fot Task5:  Crashed tests! (Hint: Check Tact Contract Arch)

Grit: what does it mean?

Grit: It compiles ok

Grit: and I didn't change method signatures

Heydar: the origin repo is updated , do you have latest update? (reply to 6878)

Grit: ahhhh

Heydar: guys can you please give me a better explain of Slice by example? , do you know any example?  the website had not any example. also the docs didnt explain good that  for beginners ...

Dmitry | backend4you.ton: Imagine some array/bunch/list of bits. You can read the m sequentially. Slice is your “location” is this list. You can read it only forward - once you moved forward, you can’t return back (reply to 6886)

Heydar: so it's a linked list(with just forward iterations) and have variant of types so it seems like storing all data in array of bits , and third variable present what is saved from to bits ... is that right? if it's right  what's the location meaning? do we have any example of using the slice? to better understand, Im beginner. (reply to 6887)

Dmitry | backend4you.ton: “Third” variable??? (reply to 6888)

Heydar: I mean another variable in underhood. (or in our mind , when sending bits or receiving) (reply to 6889)

Ahmet Said: why getting this error ? error: previous function return type ((slice, int, int, slice, slice, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((slice, int, int, slice, slice, int), int) theres something wrong with getter functions in func compiling?

Dmitry | backend4you.ton: Hmmmmm let’s start again.  Let’s say you have 1000bits. In Cell. You can read them “forward only”, so you start by making Slice from Cell. This Slice points to first bit of 1000. You can read 32 bits as int or “several bits” as Address (address size can vary). You must know what was stored to read correctly. If it was stored as uint256 but you read it as uint32… you will receive wrong value.  So once your read,say, 32 bits - your slice “pointer” moved forward and you have 1000-32 bits remaining (reply to 6890)

Dmitry | backend4you.ton: That’s why TL-B schemas are important - they describe what is contained inside cells and how many bits it occupies

Heydar: Got it perfect. thanks. thank you very much (reply to 6896)

Heydar: and sorry do we have a good example of this? :D (reply to 6896)

Dmitry | backend4you.ton: Everything in docs.ton.org is a good example. In FunC (not Tact), but maybe it’s even better

Heydar: actually it has not example for slice  https://docs.ton.org/develop/func/stdlib/#slice-primitives (reply to 6900)

Павел: How withing tests send Jetton Notify transaction from Jetton address?

Павел: How to set exact addres as sender withing tests?

krau5: SendRemainingValue mode forwards all the Ton’s received in the message, right?

Kon: received tons - gas consumptions - reserved (reply to 6910)

krau5: Reserved? (reply to 6911)

Kon: https://docs.tact-lang.org/language/ref/advanced#nativereserve

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Task #3 message(0x7362d09c) TokenNotification {     queryId: Int as uint64;     amount: Int as coins;     from: Address;     forwardPayload: Slice as remaining; } The variable: will it be the type of token that the user sends to the contract?... What is the variable forwardPayload: what is it for?

Luke: In task 5 "if value of TON attached is less then 2.1 TON then stop execution and return NFT back, but only in case that TON attached is enough to process refund without losing TONs on the SC's balance".  How do we know if theres enough. Or does it just want us to send with remaining message value and ignore if it errors?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: You know which one is? (reply to 6547)

Влад: No. (reply to 6918)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 1s and bomb compiled without PR 🤔 (reply to 6877)

Heydar: 🙁🙁 my problem is in windows , but in linux its ok (reply to 6920)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is windows if you know what PS is (powershell) (reply to 6921)

Heydar: I didnt say it's not windows  :D (reply to 6922)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Well... I was going to ask you... but I see that you don't know like I do.😅 (reply to 6919)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: clone latest changes, install yarn, then yarn yarn blueprint build (reply to 6921)

Arash Nemat Zadeh: Is 'from' field in TokenNotification of task 3, address of jetton A and B?

— 2023-10-16 —

./FerNaN: Lmao

Luis Daniel ,Ⓜ️ MEMES▪️🐾: that's what I ask myself (reply to 6930)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: that's not ? (reply to 6930)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what is the limit of send per transaction in the tact? for example when we need an batch mint in nft collection?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: So to know what token it is, is it with sender()?

calpaliu.eth: If I want to optimize the code in order to reduce the gas, where can I find the related documentation or articles?

Vlad: I am sending a map(dict) as cell in the message, how can I read it?

calpaliu.eth: For me, fixing the return type as  mentioned in the error message is ok now (reply to 6895)

Vlad: Trying to deal with it using u_dict_get? (reply to 6940)

Vlad: @name(udict_get?) extends native udictGet(self: Cell, kl: Int, k: Int): Slice;

Leon｜BitsLab: Hello everyone, I'm just starting to explore Tact, and I'd like to compile a summary of security issues related to Tact. I wanted to ask if any of you could share the security issues you've encountered, such as reentrancy vulnerabilities similar to those in the EVM. Your input would be greatly appreciated

Vlad: How can I just stop the receive function execution?

Vlad: Like break or return()

🅰🅻🅰🅽: return; would meet your requirements (reply to 6953)

Vlad: I get this error when use it: error: previous function return type ((slice, int, int, slice, slice, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((slice, int, int, slice, slice, int), int)

Heydar: I think it cant detect what should return , that func has return type? so return a default object of that. (reply to 6956)

Heydar: or you can use require() too. (reply to 6953)

Howard: https://github.com/howardpen9/jetton-implementation-in-tact/blob/5a770b7708d9a128557fdc1c8c9ecadb06457691/sources/contract.tact#L169C27-L169C37  from filed in the TokenNotification is the previous Owner's JettonWallet Address. (reply to 6930)

Vlad: Frankly, I don’t understand who sends the notification message (reply to 6938)

Vlad: Is it the wallet or master

Vlad: And is jettonAddressA address of master?

Eric: seems u are stucking into task 3? give a return statement(return 0;) will fix this error (reply to 6956)

Vlad: you are right) (reply to 6966)

Vlad: return 0; => Int is not assignable to <void> (reply to 6966)

Vlad: also wonder what is  "remaining" here: forwardPayload: Slice as remaining;

Eric: add it within two getter, I just got the same error (reply to 6968)

Grit: heya guys! Task3 is killing me! I implemented everything as per updated specs, but no luck, 3/10 tests passed. Getters are correct. So it must be something missing in the specs 😤

Grit: who else is stuck here? Or maybe you have any clue? (reply to 6971)

Vlad: What do you mean? Oh (reply to 6970)

Howard: How many people has the same issued? (reply to 6971)

Heydar: I need the sender() and context() docs , where I can find it? the return type and it's underhood member variables.

Grit: here is what I did in task3: 1. getters are good. 2. TokenNotification: - if nessage is not from A or B throw an error - if sender is admin - just update incoming token balance - calculate swap price (as per spec) if it is greater than dest token balance - send incoming tokens back to prev owner - otherwise send dest tokens to owner - update balances accordingly

Grit: looks like something is missing in specs (reply to 6976)

Eric: same problem here

Kenny: same, giving up

Grit: Also I must add that I finished task 4, and got 10/11 of task 5 so far (reply to 6977)

Heydar: no documents about the operation code in the documents message(0x44) I mean that hex number in the preceding

Heydar: how I can learn more about that? (reply to 6984)

Vlad: how do you manage to finish receiver execution when receiving tokens from owner(admin)? (reply to 6976)

Grit: looks like you can check stlib sources in fc (reply to 6985)

Vlad: it's just arbitrary, I think (reply to 6984)

Grit: with 'return' (reply to 6986)

Heydar: so Shall I do anything with that in functions?(my code) or just it is usefull in protocols to execute correct function (reply to 6988)

Vlad: It's not important for the task (reply to 6992)

Grit: Can anyone tell me what 'readForwardFee' does? Everything I found in docs is: "Read and computes forward fee from Context and return it as Int value in nanoToncoins." But what is forward fee? Is it what was already spent? Or what?

Sasha: Any tips for 4/5 task 4 (reply to 6983)

Howard: hi! Guys! I noticed a few people confusing the newJettonAddressA here in Task3, please remind that the name here doesn't matter with the rest of code. You don't need to change it still can pass the test.  https://github.com/ton-community/tact-challenge/blob/0317d3f84b3a61d7c196265ced656af0520a7114/contracts/3.tact#L62

Heydar: how convert Address to comment (or string then to comment)?  I mean something like this: address.toString().asComment()

Heydar: Im so sorry but really the documentation is weak now (because it's new ...) (reply to 7005)

Vlad: Actually, that’s important to understand that it’s a wallet address, I thought it’s a master address at first (reply to 7002)

Heydar: found something not sure Im going correct or no 😂😂 https://github.com/ton-org/ton-core/blob/main/src/address/Address.ts#L164  toRawString = () => {         return this.workChain + ':' + this.hash.toString('hex');     }

Heydar: extends fun toRawString(self: Address): String{   self.workChain + ':' + self.hash.toString('hex'); }  Something like this.

Heydar: extends fun toRawString(self: Address): String {   let sb: StringBuilder = beginString();   sb.append(self.workChain);   sb.append(":");   sb.append(self.hash.toString("hex"));   return sb.toString(); }  but I know the workChain is not accessible.  so how make Address as Comment :(

Howard: You wanna print the Address shows in Text message? (reply to 7016)

Heydar: I dont want use it in js , I need convert it asComment  in tact so if I convert it as string then i can make it as Comment. (reply to 7017)

Heydar: searching in repositories for finding the suitable methods like this

Heydar: Im not sure this is correct code or not context().sender.asSlice().asCell()  so I need more documents , because this just compiling ok , but Im not sure. cause of that Im searching for.

Grit: Is this supposed to be a hint? (reply to 7002)

Heydar: even in task 2 I dont know why we have queryID in refund message ...  and that operation code too :/ (reply to 7002)

Vlad: Queryid is there to keep track of messages easily (reply to 7022)

Vlad: But I don’t know how to use it in task 2, since the incoming message is just slice(has no queryId)

Heydar: but it's creating from admin , so how we validate or use that? (reply to 7023)

Vlad: Usually the first message sets it, and then other(response, bounce,etc) keep it same (reply to 7025)

Vlad: Thus if one message breaks, you know it’s source

Vlad: Actually I can’t pass tests for task 2 (1/6)

Heydar: i just passed 2/6  too ... :( (reply to 7028)

Heydar: the data flow is easy to understand , my whole problem during the solutions is finding what exactly type has and is. for example in SendParameters how we fill body first bits or anything like that ...

Vlad: send parameters may be the issue, but I tried various

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: How do you manage it? (reply to 6986)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: @ex_binance Is there any documentation for this? (reply to 6937)

Vlad: Return; (reply to 7032)

Heydar: Im checking the admin with sender and also sending the remain value that took from adming.  but my problem is in sending data from proxy to admin.  how you manage that? I mean the data parameter. (reply to 7032)

Howard: Can't get your question😅 What do you mean? You wanna implement different way to mint NFT? (reply to 6937)

Howard: Yeh you can.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I wanna mint 1000 item with one request, seems not possible, so what's the limit number of send  msg limitations (reply to 7040)

Vlad: 256(?) is the limit (reply to 7044)

Vlad: String.ascomment (reply to 7045)

Павел: The same thing (reply to 6971)

Павел: Second day in Task3 - and still 3/10. Seems like everything is correct, my local tests all passed (according to description). Actually, price calculation not following desc, but external tests passed. Don’t know, what else can I do to pass tests...

Grit: here is the same ((((( (reply to 7054)

Heydar: second day in task 2 🤨😂 (reply to 7054)

Light Shadow: How you complete task 1 😁 (reply to 7056)

Heydar: was so hard :DDDD (reply to 7057)

Light Shadow: Congrats 😁 (reply to 7058)

Alexander: Same stuff, 3/10 and seems like everything is fine. Moving on to 4 and 5 (reply to 7054)

Павел: How should I understand, how to write the value of map data type? https://docs.tact-lang.org/language/guides/types#maps

Павел: How to understand format of forwardPayload for Task4???

Vlad: 😁 (reply to 7056)

Vlad: myMap: map<Int, Cell>; (reply to 7064)

Dmitry | backend4you.ton: task description says "time (in a forwardPayload message as uint32)" - seems enough (reply to 7066)

Vadym: did you figured out this? (reply to 6663)

Dmitry | backend4you.ton: yep. do not use your SC balance, do not fill fields you don't know what fill with. (reply to 7073)

Vlad: So just put null into payload, etc? (reply to 7074)

Vadym: responseDestination is the one field that should't be filled, right? (reply to 7074)

Heydar: what's SC balance? (reply to 7074)

Dmitry | backend4you.ton: TONs on your smartcontract (reply to 7086)

Heydar: tested anything on task 2 :(( on sending from proxy to admin , all has same passing tests :(( it's so simple task .. but I don't know which  edge case ignored ...

Vlad: So to not use SC balance message mode is: sendIgnoreErrors? (reply to 7074)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: how to write optimized code in the tact? 🤔 is any document/article available?

Sasha: I used some hints from solidity Looks like it works (reply to 7092)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: any suggestion for task#3 giant 3/10 please?😈 🧑‍💻

Heydar: how about second #2 task? (reply to 7100)

Павел: Hm… Leaderboard shows me, that you solved 4 tasks from 5. Is it right? (reply to 7100)

Павел: What exactly are you interested in 2nd task? (reply to 7101)

Павел: I can help you, because I solved it

Heydar: I want learn more about the types , because I think my problem is in sendparameters when sending from user to admin. actually I send the sender address in data and sending msg (create a builder and set its ref to the msg) then convert it as cell and send by body I changed anything like value , mode too. but Im getting same passing tests. (reply to 7103)

Dmitry | backend4you.ton: // (reply to 7106)

Heydar: // and in func I think it was ;; (reply to 7106)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Very easy, just need to concentrate while reading the description, receiving and sending messages is the first and most important thing in networks. Getting hint in this point will harm your future for learning TON, I seriously recommend you read and don't waste your time for guidance in the groups (reply to 7101)

Heydar: thanks. please give me better docs. it's not really good doc ... it's so weak (reply to 7109)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: i'm sure you can solve all the task (except evil written #3) with tact-by-example.org (reply to 7110)

Sasha: One person solved task 3 somehow) (reply to 7111)

calpaliu.eth: Task 1 and 2 are really easy

Heydar: 1is not really a task , it's just for testing the push and checking actions. but second is really easy but  I dont know what's the problem in my code. :(( (reply to 7113)

Ahmet Said: maybe something wrong with testing ? ı have the same 3/10 and my code looks correct (reply to 7100)

Ahmet Said: and one question about transfer message : if the receiver of jetton doesnt have jetton wallet its being deployed auto or do we need to deploy ourselves?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 2 now, what??????? (reply to 7112)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: seems someone found the problem, 4 people already solved #3 🤨  how is possible? 4 resolver at same time? 🤔🤔🤔

calpaliu.eth: I think question #3 is having some understanding problems skip now…

Ken: I solved 3 but am having trouble with 4 and 5....

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what's the secret behind task3 test4? (reply to 7128)

Ken: I don't know, I directly passed (reply to 7129)

Ken: anyone know anything about task4.4 or 5.3?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: we all directly passed them I don't know what these numbers mean (reply to 7134)

Ken: ah it's a struggle when you know it's a little thing but don't know what it is

Dmitry | backend4you.ton: I have funny thing with task 5: when my receiver contains only one require- 10/11. When I add some code below - 9/11 😄

Heydar: so try to revert message more 😂😂 (reply to 7137)

Heydar: for tasks how I can detect how much my contract need for storage fee? how calculate that?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: by reading task description (reply to 7156)

&rey: You can pretend it doesn't need any. (reply to 7156)

Heydar: but in task 2 I cant see that. (reply to 7157)

Heydar: ah , thanks , so I should find another problems :DD (reply to 7158)

Sasha: Am I right that SendRemainingValue is context().value - value?

&rey: context().value - <gas spent for calculations>. (reply to 7161)

Sasha: And how it connected with value in SendParameters? My understanding was that SendRemainingValue is smth that is added to the actual value of the tx So, in case of SendRemainingValue user will receive value + SendRemainingValue (context().value - value) - gascost In case of SendPayGasSeparately gascost is paid from myAddress And in case of simple SendIgnoreErrors you need to always set value becasue otherwise there will no money for the gas (reply to 7162)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: __ TACT LOG ____    > Task4: tact compiler    > Task4: func compiler 💥 Compilation failed. Skipping packaging ____ TACT ERROR ____ Func compilation error: /Task_Task4.code.fc:34:1: error: previous function return type ((int, int, slice, slice), slice) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((int, int, slice, slice), slice)   }

Luis Daniel ,Ⓜ️ MEMES▪️🐾: what is that error

&rey: If value is nonzero, then value + context().value - <gas spent> is sent. (reply to 7164)

Heydar: so in task 2 if we dont consider the gas spent , we will send to admin less than the original amount is that acceptable? (reply to 7169)

Bozo The Clown: My submission stuck at "send archive to endpoint". Is it only me or not?

Ahmet Said: whats the different between maybe address and address?

Павел: What is the key to solve 3 task? (reply to 7128)

Heydar: is that correct that Im filling body, data  in task2 when sending to admin?

Anton: data (from the task description) is a part of body (reply to 7176)

Heydar: you mean we should store address and msg slice both in the body? oops I thought we should fill data in SendParamteres (reply to 7177)

Sergey: What should I attach as the "value" in task 4 when withdraw nft? Value remainings or all contract balance remainings?

Sergey: What is owner/admin address in init of task3? Is it admins jetton-wallet address or admins usual wallet address?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: in task 4 it is assumed that forwardAmount: 0 ?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: and in this field the responseDestination would go: ...... my adress()?

Dmitry | backend4you.ton: responseDestination is address who receives all excesses. so if you got msg from user, who added TONs "to cover gas fees" - good boys should return unused gas back to user, not put them into own pocket (reply to 7193)

Павел: New comments helps to solve Task3 a lot

Павел: finally 10/10

Heydar: ooooooooooh my god :D finally solved task #2 😂😂😂😂😂

Heydar: ok let take a rest for a month , then start next task 😎

Heydar: guys which tas is easier between 4-5? (it seems 3 was so hard for all)

Dmitry | backend4you.ton: 4th is about only one nft, while 5th is about a lot of nfts :) (reply to 7208)

Heydar: so shall I start with 4th? (reply to 7209)

Dmitry | backend4you.ton: read them both and start the one that seems easier to you :) (reply to 7210)

Heydar: task 2 was hard for me 😂  Im totally very new in TON ... Thanks. (reply to 7211)

Dmitry | backend4you.ton: dont forget to read TEP-62 which explains how NFTs work in TON (reply to 7212)

Dmitry | backend4you.ton: There are pros and cons in 5-min builds: pro: its harder to hit 10-submit-per-hour limit enforced by challenge submit server con: its much easier to hit 2000min/month actions limit enforced by github free 😁

&rey: So you're better left off writing script that submits solutions from local computer. Even when that requires proxy. (though, does waiting for server's response count for Actions limit?) (reply to 7214)

Dmitry | backend4you.ton: github counts total time, it doesnt care who waits what (reply to 7215)

Dmitry | backend4you.ton: damn, i'm like rolling dices with task 5. I have 10/11 without withdraw-nft code, so last one test is somewhere there. but i can't figure what tests wants. i tried batches 254, 100 and 1 i tried auto-withdraw profit after all nft i tried same and different msg type for "retry" i tried 0 and 0.01 forwardAmount i tried myaddress and owner in resp.Dest. i guess some of this dices are not important, and maybe i missed some others

Dmitry | backend4you.ton: maybe task 5 also need some improvements in description?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: That is, the address of the person who originally sent the message is entered. (reply to 7200)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: and what would be forwardAmount: .... which stays at 0? (reply to 7200)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: thanks

Sasha: What are batches in ton? I have same 10/11 (reply to 7217)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I've been busy all day with task 4. Could anyone give me any idea why it's giving me a 3/5?

Ruslan: #TASK_4 if i hasn't NFT, what's time i need get?

Sergey: +++ (reply to 7223)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: ? (reply to 7225)

Sergey: Same (reply to 7226)

Sergey: It looks like something is wrong with nft unlock transfer — when I comment it, I still get 3/5

Luis Daniel ,Ⓜ️ MEMES▪️🐾: aaa what's wrong with you

Luis Daniel ,Ⓜ️ MEMES▪️🐾: In my case it is with the transfer of returning an nft if the contract already has one (reply to 7228)

Pathfinder: how to test receive of mesage type Slice? receive(msg: Slice)  If I use { $$type: 'Slice', queryId: 0n, } it shows Type '"Slice"' is not assignable to type.

Mahdi: do sth like this: send(beginCell().storeInt(78, 16).endCell().asSlice()) (reply to 7234)

Zaa💞: Hai

Luis Daniel ,Ⓜ️ MEMES▪️🐾: x2  ? (reply to 7001)

Ruslan: why not use SC balance? in task we have "send ... with all the remaining TON balance" (reply to 7074)

Dmitry | backend4you.ton: i think we were talking about diffrent sends. in this one - yes send remaining balance, as text says (reply to 7247)

Ruslan: ok, thx

Ruslan: then i dont know wtf is wrong with my code...

Y: so, when NFT is withdrawn, all the balance of the SC should be sent, not even 0.1 or 0.01TON left on the SC? (reply to 7248)

Dmitry | backend4you.ton: "send the locked nft back to the owner with all the remaining TON balance" (reply to 7251)

Sergey: Should I send all remaining balance to nft contract and to the owner using forwardAmount, or I have to perform two separared transfers? (reply to 7252)

Dmitry | backend4you.ton: no. read "message modes" (reply to 7253)

Luke: how are we supposed to reserve .1 ton in task 5

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Task 4 gives me a score of 4/5, any suggestions on why the last test case doesn't pass?

Pathfinder: 5/6 on Task 2. local test works under my understanding of the description requirements. any suggestions what could be the last case?

Luke: Did test cases of task 4 change? I got WA even thouogh i changed nothing

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: hate all the DEXs anymore 😠

— 2023-10-17 —

Luke: did you put .08 ton for the Transfer message in Task 5? (reply to 7263)

Luke: in message value

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I reads what that sending mode mean and how works context.value (reply to 7265)

Luke: yeah but what about for the admin withdrawing nfts, because I don't see how that could be done with send mods (reply to 7268)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: send the value with context and tell the validators how to process this transaction by adding true mode (reply to 7269)

Luke: thx, ill keep trying, appreciate it (reply to 7270)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: The challenge is to learn and not to teach how to get hints, I still believe that the designer of these tasks are from tact-by-example team, because you can use this site as a great resource. (reply to 7269)

Carlos: which task is easier 3rd or 5ft?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 3 for beginners, 5 for pros is easier  Because they always looking for hardest solutions (reply to 7273)

calpaliu.eth: Even I implement the nft logic, I still get 0/5 in task 4... any hopes?

sd: task 3 is about jettons, why nft (reply to 7275)

calpaliu.eth: 4 sor

Vlad: Did anyone get 6 for task 1?)

Vlad: I wonder how to optimise the code more) (reply to 7282)

Dmitry | backend4you.ton: "more"? did you optimized it anyway better than default 5.3679 ? (reply to 7283)

Dmitry | backend4you.ton: because task 1 is literally three lines of code

Vlad: No, just wondering) (reply to 7284)

User<6199232976>: This guessing game is killing me.   In task 3: -How does this dex contract stores jettons? --Are these newJettonAddressA and newJettonAddressB are address of contract of some jetton wallets? ---Are these wallets specific or they can be anything with trait Jetton from stdlib? ---Who is set as owner in corresponding field of these wallets? -How does user send a transfer request? --How does user transfer jettons in this request? ---How does dex contract consume this jettons? -How should dex contract transfer jettons to user? -How does user reject a transfer? Should it be in the same way as regular transfer?  -What is the correct formula for the price? If I use your formula "amountOfJettonAOnContract * decimal / amountOfJettonBOnContract" then example should give 5 * 10^9. --What should I provide in getter? -Should dex contract return unused gas to user?

Vlad: Just figured out the problem with task 2, it was value and message mode Use the ones as in tact-by example

Vlad: Addresses of wallets (reply to 7290)

Vlad: Messages come from the wallets owned by the dex contract

Vlad: User interacts with his wallet, it sends message to the receiver wallet

Vlad: Price is right, given with decimals (reply to 7290)

Vlad: https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/message.tact  example contracts

&rey: 1. aAmount and bAmount 2. Yes 3. Anything 4. Not stated 5. Not stated 6. According to specification 7. When it receives notification from its own jetton wallet 8. According to specification 9. Invalid jetton allows to simply throw an error, insufficient value to swap requires a refund 10. Indeed, it is 11. The thing from point 10 12. Not quite (reply to 7290)

Heydar: Guys do we have good docs about the compiler's compile flow and any optimization that it doing? or what' the source code of that ?

Luke: Is there anything wrong with this for task5? (this is just a snippet for sending one nft to admin)  send(SendParameters{         to: nft,         value: ton("0.08"),         mode: SendPayGasSeparately,         body: Transfer{           queryId: msg.queryId,           newOwner: self.admin,           responseDestination: self.admin,           forwardAmount: 0,           forwardPayload: emptySlice()         }.toCell()       });  I've been debugging for hours, days even, and im still stuck on 10/11

Vlad: How are math operations executed in tact?

Vlad: From right to left?

Howard: First, perform multiplication and division, and then addition and sub? (reply to 7310)

Howard: Just wake, gm guys 😅 Let me check the messages, feel like everyone is working hard.

Vlad: can I change it using brackets? (reply to 7316)

Vlad: and admin in the third task is the owner, rigth?

calpaliu.eth: I am trying to write the test for task 4, quite interesting

User<6199232976>: 1. How does dex own jettons? 4. In such case dex contracts can't interact with these wallets. If we use wallet from stdlib. 5. Then I can imagine various scenarios and each of them would require different actions  6 and 8. I haven't seen any specifications. 9. It wasn't my question. 10. The price is incorrect or the example is wrong? 11. Should I return the price of one jetton or the price of 10^(-9) jetton? 12. Have I missed another specification? (reply to 7299)

Howard: yeh (reply to 7318)

Vlad: task 4  "- If the smart contract already holds an nft then return the incoming nft back to the sender" So one contract - one nft locked? then, looks like I need to create a bool variable

Vlad: error: previous function return type ((slice, int, int, slice, slice, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((slice, int, int, slice, slice, int), int)

Vlad: What’s the reason of this error?

Dmitry | backend4you.ton: Yes, one contract - one locked nft (reply to 7323)

Dmitry | backend4you.ton: Seems like you missed return or return wrong type (reply to 7326)

Vlad: ok, I checked:  it happens when get method returns only under if statement and does nothing out of it (reply to 7327)

Vlad: so, there are occasions when it returns nothing

Heydar: guys composition is better on Tact or inheritance , I always prefer using composition in c++. (for some reasons) but in Tact I want to know which one reduce gas fee ?

Howard: We still have 3 days away with the Tact SmartContract Contest deadline! (reply to 6074)

Dmitry | backend4you.ton: correction: one contract = one nft at some moment in time. after contract unlocked and returned nft - it can accept/lock new one (reply to 7323)

Dmitry | backend4you.ton: i use mode = 0 (not sure it important)  and add customPayload=null (compiler throws " Missing fields "customPayload" in type Transfer" without it), but other seems fine (reply to 7302)

Vlad: taks 4: message NftWithdrawal {   queryId: Int as uint64;   nftAddress: Address; }  why do we have address of nft in the incoming message, should i check it matches the stored nft?

Vlad: since I have only one nft stored and know it's address (reply to 7339)

/B4ckSl4sh\: is that ok? 10 minute testing (i sent only 1st and 2nd task)

/B4ckSl4sh\: github canceled it

Sasha: Is it possible for contract to call itself? For example in 5th task looks like we can't withdraw all nfts with one tx and need to init a new one

Dmitry | backend4you.ton: the only way of "calling" in TON is messages (reply to 7343)

Heydar: what do you mean call itself? do you mean re-construct that? or sending a message? (reply to 7343)

Sasha: Send a message (reply to 7345)

Heydar: guys how many level can use traits (inheritance)?

Heydar: what do you do in that message receiver? move the behavior in a method and add the method in that message receiver , then call the method of itself anywhere in your contract. (reply to 7346)

Dmitry | backend4you.ton: sure. contract can send message to anybody, including himself (reply to 7346)

Railgun: Hello, do we need to create test cases on our own?

Heydar: calling the function is cheaper than executing the message receiver. (reply to 7349)

Sasha: As I understand there is a limit for messages you can send in one receiver (reply to 7351)

Dmitry | backend4you.ton: yes, but they are different.  for example, shouting aloud is cheaper than calling by phone, but sometimes you are too far and the only way to talk is to call (reply to 7351)

Heydar: not just that , if you think about the underhood, they implemented a map<string, messagReceiverFunction> and then it should use log(n)*len(yourString) to execute your messageRceiverFunction, in best case it's hash not map, but when your  using the function , you  just call the function address ... I think this is one of the reasons . and another one is that you said limiting ... also we have more too. and Im not sure that when you doing message to yourself how much cost vs using sendMessage (reply to 7352)

Vlad: Wow, that’s interesting (reply to 7349)

Heydar: your right , but when you are in your scope(contract class) why using send to yourself, while it's possible just call your method 😐 (reply to 7353)

Heydar: calling method just calling the function address. message should send that via protocol and etc tasks.

Vlad: task 4  "send the locked nft back to the owner with all the remaining TON balance"

Heydar: is that right?  Im just guessing , Im just beginner.

Heydar: I consider that is using protobuf and something like grpc so sending message vs just calling the method there is very cheaper than parsing message , and finding correspond function then call. (reply to 7360)

Dmitry | backend4you.ton: the answer is in one of 10 previous messages above your question :) (reply to 7359)

Vlad: remaining ton balance means balance of the contract? (reply to 7361)

Heydar: 🤔 which? (reply to 7364)

Dmitry | backend4you.ton: i'll answer this question in 4 days if you'll still need it :) (reply to 7366)

Heydar: OFC 😍  I definitely want to learn this technology; I've only been at it for 3 days, and there's a long way for me to understand it. 😁 (reply to 7367)

Sasha: Now its time to understand if it is the right solution for 5th task) (reply to 7349)

Vlad: task 4 time (in a forwardPayload message as uint32) is a period or end time?

Sasha: Any articles about ton gas reduce? Following solidity rules doesn't always help

Vlad: And is it in seconds?   since now() returns seconds (reply to 7371)

Ken: why is build time so long now

Ken: https://xkcd.com/303/

🅰🅻🅰🅽: In challenge #5, should we use self.profit to record the profit that the admin earns? Or we can simply use myBalance to handle it?

🅰🅻🅰🅽: I think myBalance will be better.   But what if admin directly add nft to the collection with many tons attached?  Should we return the remain ton back to owner?

Mario: how can I print dump and emit messages with blueprint? I tried to set it up like this:         blockchain.verbosity = {             ...blockchain.verbosity,             blockchainLogs: true,             vmLogs: 'vm_logs_full',             debugLogs: true,             print: false,         };  but I am lost in all the logs and can't see the log I'm looking for. For dump I assume I would have to compile the contracts in debug mode, but how to do that with blueprint and no tact.config.json?

Павел: Do we have any Tact editor? JetBrains plugin dosn’t work… (((

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: gas usages are same in these codes??? let ctx: Context = context();  let a: Int = ctx.value; let b: Int = ctx.value - 1; let c: Address = ctx.sender; VS let a: Int = context().value; let b: Int = context().value - 1; let c: Address = sender();

Vlad: Almost (reply to 7386)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: yeah, crashes after enabling on my laptop (reply to 7385)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: which lower? (reply to 7387)

Anton: Have you tried the official VS Code plugin? https://marketplace.visualstudio.com/items?itemName=KonVik.tact-lang-vscode (reply to 7385)

Vlad: Second (reply to 7389)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: also when we use them directly without pointing them to local variables? beginCell().storeAddress(sender()).endCell(); (reply to 7391)

Vlad: I think creating a variable takes gas, while the context is loaded anyway in both cases (reply to 7392)

Sasha: With sender() for example it is not the truth But maybe because sender() is context().sender which cause more gas (reply to 7393)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: we think same, I seen some tact pros uses let ctx: Context = context(); even for verify the owner. I want to do optimization, we haven't good reference for that (reply to 7393)

Vlad: The best way is read FunC compiled files (reply to 7395)

Vlad: In the build

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: so`sender() VS `context().sender the context().sender is the winner, right? (reply to 7394)

Vlad: I think they are equal (reply to 7398)

Sasha: let sender: Address = sender() is better than sender() if you use sender() multiple times (that is what I saw in tests output) (reply to 7398)

Sasha: The most interesting question is how to optimise 1 and 2 tasks (if possible), because without them I am somehow missing +-.1 on the 5th and it is sad

Sergey: What does  If the smart contract already holds an nft then return the incoming nft back to the sender exactly mean in task4? Should I attach all msg value, or 0.01 ton, or notehing? Tried all options, nft is returned back to the owner, but test is still not passed

Railgun: For task 4, where is the nft to be locked described in the OwnershipAssigned?

Railgun: Or maybe we dont need that at all? And assume NftWithdraw always return the ntfAddress that we locked?

🅰🅻🅰🅽: Hey guys, i found something wierd. When i use context().sender, i can pass all the test. But when i simply replace it to sender(), one of the tests fails. It seems like these two are different.

Dmitry | backend4you.ton: you need to know address before withdrawal to return it from get fun nft() (reply to 7423)

Dmitry | backend4you.ton: TEP-62 should help with this (reply to 7422)

&rey: It means that tests cached invalid result on one of the codes. (reply to 7424)

Dmitry | backend4you.ton: And I found that test failing after swapping two non related codelines: https://t.me/toncontests_chat/23502 This contest (or this language) is very "funny" :) (reply to 7424)

🅰🅻🅰🅽: Sorry, i don't get it. Where is the cache located? Could you please elaborate again? (reply to 7429)

🅰🅻🅰🅽: This challenge is a "funny" guessing game :) (reply to 7430)

Heydar: this test is for finding the tact's problems , I think 🤔 (reply to 7430)

&rey: TON's testing server caches results of testing the solutions received, by code cell hash. (reply to 7431)

Railgun: Thanks

Kon: randomInt - Generates a new pseudo-random unsigned 256-bit integer x   Maybe in your code has appeared some inx that was not existed in nfts list. (reply to 7430)

Kon: maybe better to use in your case - fun random(from: Int, to: Int): Int; Generates a new pseudo-random unsigned integer in provided interval: from <= x <= to or from >= x >= to (for negative values). but we can't see all code and can't determine the logic

Павел: Task4: could I use self.reply to reject OwnershipAssigned?

Sasha: Does receive action with all code in it cost the same gas as if I will split it on different internal functions?

Dmitry | backend4you.ton: no matter what is inside my map - I have two lines that are not related to each other, and swapping their position results in different test result.  literally, saving sender() into some variable before or after calling randomInt makes test pass or fail.  I have two submits of both cases - and one code failed both times, other code succeeded both times. hard to believe that this is related to particular generated values by generator (reply to 7436)

Dmitry | backend4you.ton: check compiled code. I suppose calling internal function may cost some additional tuple operations (reply to 7439)

&rey: https://t.me/tactlang/7429 (reply to 7441)

Sasha: Is it possible to check TACT sources? Only see archive repo

Dmitry | backend4you.ton: thats about gas on receive, or about different test results when swapping lines of code ? (reply to 7442)

&rey: About different test results. (reply to 7444)

Andy: yes, just construct the Transfer correctly (reply to 7438)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I had little  changes on my codes to simply reduce gas usage via less local variables, then test are failed, these are not passing even with revert (wtf)  But I'm still on board 🤨

Dmitry | backend4you.ton: so your point that contest server "accidentally" (due to "unlucky" random value) failed first time, cached this code cell hash and does not run tests on subsequent commits, and just return me previous results, and for changed code, tests "accidentally" succeeded (I got "lucky" random value) and cached it too, and no matter how much times I'll re-submit that code - i'll recieve not result of "fresh" runs, but results of "first" runs? (reply to 7445)

Nikita: I guess the leaderboard counts not the last try but the max points 🤔 (reply to 7448)

Dmitry | backend4you.ton: But if that true, then why subsequent commits still takes a lot of time (returning cached results should work much faster). (reply to 7449)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: In TCS 4 I had changes in last day, then they removed me from list with cheater label  I hope this not happening again

Dmitry | backend4you.ton: leaderboard counts best (max) score per each successful task (reply to 7450)

Dmitry | backend4you.ton: also, this testserver design (cached {code -> result}) does not align with task where "random" thing is used... (reply to 7451)

Mario: how can I convert an Address to a String inside the contract?

Mario: (for debugging)

Mario: ok found this issue: https://github.com/tact-lang/tact/issues/16

Sasha: Does get methods requier gas?

Dmitry | backend4you.ton: not from contract balance. get-method executed "in memory" (of lite-server or on the client), the gas is counted and if method too complex (require a lot of gas) it may fail, but this gas never deducted from balance of smartcontract (reply to 7461)

Ken: But OwnershipAssigned is not part of TEP-62? (reply to 7428)

Dmitry | backend4you.ton: no, it is (reply to 7463)

Ken: oh thx

Heydar: I thought contracts are like classes , and you can create multiple times of that class. but it seems it's not and each contract is specific and it is an object not class to making instance, am I right?

Ken: Forget about OOP BS (reply to 7466)

Heydar: ok , now each contract we make , is an instance, ok? (reply to 7467)

Heydar: and when we deploy , it will join in the chains?

Ken: yes, each deployed contract is a separate program

Heydar: so if one body from another place in the world write a code in tact that is like our code(exactly his code is look like our code), can he deploy too!?

Ken: If the bytecode + init params is unique

Heydar: but it wont be! (reply to 7472)

Heydar: because the bytecode is same , and anything in his code is same as us.

Heydar: I mean if anybody have a code that is exactly like our code, he cant deploy :/

Dmitry | backend4you.ton: that's why "init data" are used - that's "public key" for wallets, "index" for NFT etc

Heydar: but that means we should add a variable store and more gas just cause of deploying same idea? (reply to 7481)

Павел: how to get coins amount sent by sender() ?

Dmitry | backend4you.ton: yes, check init(seed: Int) in task 4 and 5  and... if you want to deploy "same idea" - what will differ it from already deployed one ? (reply to 7482)

Heydar: ah your right , how know that I need init seed(I mean how I detect my code is same as another)? when Im deploying ? (reply to 7484)

Heydar: guys really I have so many questions , should I ask where these questions ... no answer in the docs ...

Heydar: guys where is the 12-words in this technology , that 12 or 24 words making a hash that is our wallet address?? it means that we can make the address manually when deploying? how?

Heydar: so interesting field , I love it   but need more docs(about ton and tact and anything that make me expert in this field) to learn , where should I learn better these question's answers, can any experienced buddy help me please ❤️

Dmitry | backend4you.ton: If you wrote code yourself - it’s not same as another ) (reply to 7485)

Heydar: if you see that in deeper way , it may be. because your code is in tact , and tact will be converted to func then fift ... , it seems sometimes the compiler or convert to same code that you didnt know 😎 (reply to 7492)

Vlad: For which task? (reply to 7424)

Dmitry | backend4you.ton: If you’re writing something like Task1 - maybe, but once you’re making something that may be reused - you’ll understand that youself need several “copies” and will put some “seed” into init (reply to 7493)

Heydar: got it , thanks. (reply to 7496)

Heydar: when we want to deploy new contract on the runtime(I mean by another contracts) it should have a value , that means any contract need to have initial ton. so the question is that the root contract that we are creating and want to join in chains , how should give it the money?

Dmitry | backend4you.ton: how you create the root contract ? (reply to 7498)

Heydar: in my tact-emulator 😂 (reply to 7499)

Heydar: and just deploy there.

Dmitry | backend4you.ton: https://docs.tact-lang.org/start/deploy (reply to 7501)

Heydar: when I creating a contract, the myBalance is zero I think, is that right?

Dmitry | backend4you.ton: link. text at the bottom of the page

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: stop playing with test scripts 😂

Heydar: wow, it means we send the bytecode as initstr, and it will be deployed? (reply to 7502)

Heydar: so, first Contract in whole of this blockchain is for TON's company ? and when we send it will using these data to deploy on chain? do we have any video about this question, I want to see. (reply to 7506)

Heydar: sorry for asking questions :( (reply to 7502)

Dmitrii: Who solved how many problems in the tournament? (my +1)

&rey: 267, as in TVM. (reply to 7512)

Павел: how to get ton amount which was recently sent by message? (reply to 7513)

Павел: the analog of loadCoins in funC?

Sea💎✈️: hello, for Tact, anybody know Slice? how to resolve the Slice received and get ton amount and send it to other address

&rey: Do you mean incoming amount? That's context().value. You shouldn't trust any other source providing it.

Vincent: When TokenNotification receives the message, context().sender is the JettonWallet address. How do I get the Jetton address from the JettonWallet address? Or was it not acquired this way? Is there any way to get Jetton's address when you get the notification?

Dmitry | backend4you.ton: 1) what you mean under "jetton address"? TEP-74 describes "jetton wallet" address and "jetton master" (jetton minter) address. 2) why do you think you need that address? (reply to 7521)

Rami: It's an artificial delay from the submission server (reply to 7375)

Vincent: owner: Address; jettonAddressA: Address; jettonAddressB: Address;    When the TokenNotification is received and msg.from is the owner, Need to decide the amount is give jettonAddressA or give jettonAddressB, CTX. Sender is a MSG. The from jettonwalletAddreess, but only store the jettonAddressA in the contract, How do I know whether jettonwalletAddreess is jettonAddressA or jettonAddressB

Grit: tests are crashing

Grit: but I didn't change anything global

🅰🅻🅰🅽: Challenge #4. Now everything is going right. It seems like tests cached invalid result on one of my codes. (reply to 7494)

./FerNaN: Hello, quick question. On task 5 comments there are typos on the errors we should send, like "Insufficent funds", or "Insufficient privelegies". Could this cause errors on submissions? I'm asking because idk if this is a critical factor on judging submissions, or if the test cases in the server also have this

Sasha: If I send simple message to contract For example "message", or even with empty body, how to handle it on contract side?

sd: Receive(msg: String) {} ?   // Slice if needed (reply to 7534)

Sasha: In case of slice I can simply send empty slice, right? What is cheeper, empty slice or string? (Time to check I think) (reply to 7535)

Kastuś: For task3, I suppose these are not unit tests? How should I know if jetton address check is valid at least for balance and price functions? Is there a difference between contract jetton addresses and input address parameters?

Вероника: I have the same problem, if you solved it, can you tell me what the sixth test checks? (reply to 7259)

Dmitry: why long messages deletes?

Mario: if I call .hash() on a Cell, what's the amount of byte for the int of the hash?

/B4ckSl4sh\: 8 (reply to 7555)

/B4ckSl4sh\: Like any other int

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 27 😮 Is the use of native functions freed?

Mario: yeah but are all bits used? If I send the hash via message or store it in the contract, can I use less bits?

Mario: other question. I suppose maps are just lookup maps and can't be iterated?

Павел: You need exactry such address, which available. You don’t need any other calculated address (reply to 7521)

Sasha: >This rule applies to Tact bindings as they're using a lower level of abstraction thus compromising the nature of Tact Challenge. What does it mean?

Павел: just compare it with sender() ? (reply to 7529)

Павел: Try to reed docs above about Jetton agreement. Solution is quite simple (reply to 7541)

Dmitry | backend4you.ton: my point was the same, but after writing all code I have 1/10 in task 3, so I was ready to start thinking something different.... :( (reply to 7564)

Павел: Should we take care about excess when exchaging NFT in Task5 and revert it back to prevOwner? Or it doesn’t matter? (reply to 7559)

Dmitry | backend4you.ton: good smartcontracts do not try to "keep" excesses for they own, so returning it back to user is very desirable. but not with _separate_ send of course. (reply to 7569)

Mario: do bounced message by default have send mode SendRemainingValue?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: In task 5, do we have to keep the nft that the user sent?

Dmitry | backend4you.ton: "The smart contract randomly chooses some NFT from the available NFTs (including the newly incoming one) and gives it to the user in exchange for the brought NFT (but occasionally just returns user's NFT in some cases)." (reply to 7572)

Howard: The NFT Standard Challenge nearly has reached its conclusion. Time to make your final submissions to the bot:  • Click the contest button in the @toncontests_bot • Follow the provided instructions carefully • Ensure that your repositories are accessible for our judges  ❗️Remember, the deadline for submissions — 18 October, 23:59:59 GMT+4. (forwarded from TON Contests)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: my nft standard repository was open to the public from the beginning of the challenge, on the other hand, I didn't have time to complete the code because of the mini-app and tact challenge and hack-ton-berfest competitions. Because it was declared that it is not mandatory. So that I can deal with the copying of my idea? (reply to 7575)

Mahdi: It's unbelievable but I passed it after put body in send function in refund part(but they didn't say that) (reply to 7545)

Sasha: Does emptySlice() and nothing are the same thing?

Вероника: thaaanks (reply to 7577)

Dmitry | backend4you.ton: what is "nothing"? null?  no, emptySlice is an object of type Slice, but it contains zero bits (reply to 7578)

Dmitry | backend4you.ton: like empty array (empty list) vs null

Sasha: Looks like not zero but 1023 bits of data (reply to 7581)

Dmitry | backend4you.ton: emptySlice cant contain data... it should have empty() == true

Sasha: I don't know if I am right but  inline fun emptySlice(): Slice {     return emptyCell().asSlice(); } inline fun emptyCell(): Cell {     return beginCell().endCell(); }  And Cells is a low level primitive that represents data in TON blockchain. Cell consists of a 1023 bits of data (reply to 7584)

Dmitry | backend4you.ton: Cell consist of data up to 1023 bits and up to 4 references to other cells

Sasha: I am not sure How are you going to read cell if you don't know exact number of bits? (reply to 7586)

Dmitry | backend4you.ton: you know number of bits (not cell, but slice - slice.bits(), slice.refs()

Sasha: Make sence 🤔

Dmitry | backend4you.ton: if you switch from TACT to FunC and deep dive into grouping Cells into BoC (Bag of Cells) and serializing BoC into {b5ee9c72...} hex sequence - you will find more interesting case how the length of Cell (0..1023) is stored in only one byte!

Sasha: I will not, accidentally saw contest and decided to try) But thanks (reply to 7590)

Dmitry | backend4you.ton: so you don't want to know how to store in one byte (range 0...255) the value (length of data) that may be 0...1023 ? ;) (reply to 7592)

Ahmet Said: in responseDestination field how can we catch it if transfer  not succesful?

Pathfinder: Yes found my problem, it was about the amount sent. Played around with value and mode. (reply to 7545)

Ahmet Said: i hope got enuff time for tasj 5 😅😅

Leonid: Which problem is easier to solve 3 or 4?) (reply to 7597)

Ahmet Said: 4 (reply to 7600)

Railgun: Maybe the definition of your price is reversed (reply to 7568)

— 2023-10-18 —

Vlad: Right (reply to 7571)

MonoBit: I have 9/10 in task 3 and I have no idea what to do :( any hint please 😔

Vlad: Guys, task 4 is confusing: “with all the remaining TON balance” but SendRenainingBalance is wrong, use remaining value

Vlad: nfts: map<Int as uint16, Address>; How does it work?

Vlad: 3 days ago it threw me an error: unsupported type for keys

ntly: did you pass test 5 in task 4 with that? (reply to 7605)

Vlad: Yeah (reply to 7608)

MonoBit: I'm still 4/5. This task was so hard for me (reply to 7605)

&rey: You can't store it in variable but can in contract. (reply to 7606)

Nikolay: According to the jetton specification, each user has their own JettonWallet. And we are given only two jettonWallets. And the sender can be either an admin or another user. Which doesn't look like the specification. We don't have a wallet code to get the user's jettonWallet address. Also we have notifications coming from two given jettonWallets. And according to the specification notifications should come from our jettonWallet, and there should be two of them. I calculate the price using this formula. And only 5/10 tests. (reply to 7567)

Vlad: Notification comes from your wallet (reply to 7615)

Nikolay: Yes That's right. I misspoke. But that doesn't change the point. (reply to 7618)

Vlad: Don’t worry, I am on 1/10 😅

Vlad: task 5, does it mean whole contract balance (without profit) or remaining value from 0.1 ton? " the sender with all remaining balance (except for admin profit = fees collected from this and other swaps)"

Vlad: in task 3 should I update amounts of jettons after the swap?

Павел: balance - 0.1 - allFees[calculated by contract] (reply to 7622)

Павел: How can I calculate gas usage locally?

Vlad: not all 0.1 ton will be used (reply to 7624)

Павел: So, you question was not clear. Попробуй по-русски (reply to 7626)

Vlad: already found the way to send ( my balance - profit) (reply to 7627)

Vlad: task 5 is tricky, the part with sending nft to user, I should delete this nft from map

Yuri: But contract's balance does not increase exactly by 2 in that case (reply to 7628)

Vlad: why? I get 2.sth ton, take 2 and return all other, mode SendIgnore Errors

BrayanD: "but only in case that TON attached is enough to process refund without losing TONs on the SC's balance"  How do I check that the TON attached is enough?

BrayanD: In task #5 should I return 'context().value - ton("2")' to user when swap NFT?

Vlad: hm looks like same as my approach

BrayanD: but I still get 8/11

BrayanD: I tried everything

Heydar: sending init data for each message to the child contract has less cost or saving that id uint32 (or address) in my parent contract?

Railgun: I switched from manual throw on each cases to a top level require and passed the last. (reply to 7604)

Vlad: Do you use throw for message from another Jetton? (reply to 7639)

Vlad: Or you made it with require too?

Railgun: Right now all in require. Only throw when checking address.

Railgun: Send section should only return.

Vlad: What do you throw, when Jetton is wrong? (reply to 7642)

Vlad: just got stuck here too (reply to 7635)

Vlad: check the updates for task 3

Vlad: https://github.com/ton-community/tact-challenge/commit/0badb9d2180017c59c0184007dd0fb9f8e3e4b72

Vlad: In task 3 should I check that amount of jettons is not 0? before devidinng?

Railgun: Yes

Railgun: Dont let divide by zero throw

Railgun: Properly handle it and send back to the  msg.from

Vlad: ok, looks like that is my mistake

🅰🅻🅰🅽: I have been struggling with these challenges for several days, and I want to make sure when we should set messages as bounceable?

Railgun: Some of them wont influence the result. But others do...

🅰🅻🅰🅽: Sure, i have observed this....

🅰🅻🅰🅽: Does anyone here have any summarized experiences? I'm genuinely curious about why this challenge is designed this way.

Grit: ❔Hey People! Tact challenge deadline is October 20th, right? Are our scores considered submitted automatically? Or there is some procedure to submitting them? By Automatically I mean if my score is in leader board then it effectively is submitted.

Railgun: Just push and trigger github action. Watch out for your free quota if you are an active developer 😂

Grit: What I think is bounce flag is only makes sence when you are going to work with bounced message. So if you don't have bounced method in your contract it's kinda useless (reply to 7658)

🅰🅻🅰🅽: But i passed some testcases just by adding bounce:true (reply to 7664)

Vlad: for which task? (reply to 7665)

🅰🅻🅰🅽: Task 4 and 5

Vlad: did you pass all tests in 5? (reply to 7667)

🅰🅻🅰🅽: Nope, currently 10/11

9: 9/11 :(

🅰🅻🅰🅽: But i pass challenge #4 by simply setting bounce to true. (4/5 -> 5/5)

Vlad: and what to do with getter? return 0? (reply to 7654)

Vincent: Can someone help me explain how to determine the type of Jetten here? Or did something go wrong there?

Vincent: The sender cannot directly judge and cannot get the master of jettonwallet. Is there any problem?

Heydar: guys where is explaination about nft in tact by example ... need some example?

Vlad: you don't need to interact with master (reply to 7675)

Vlad: check this git https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/message.tact (reply to 7676)

Vincent: I know, but how do I know if I need to increase aAmount or bAmount?

Vlad: you check from which wallet the jettons came (reply to 7679)

Andy: I checked the source code of Tact, and it seems that bounce is true by default... This task 4 test 5 is such a mystery 🧐 (reply to 7671)

Vincent: What do you mean? Would you mind clarifying? The source address that can be obtained so far is ctx.sender, but it is a jettonwallet address and cannot be compared with the jetton address in the initialization (reply to 7680)

Heydar: actually jetton is nft?! (reply to 7678)

Vlad: no he has a repo for nfts (reply to 7685)

Heydar: it's weird why we have not example of that in tact-by-example then (reply to 7686)

🅰🅻🅰🅽: We have fully documented the nft collection and nft item standard in our project  https://github.com/Ton-Dynasty/tondynasty-contracts/tree/main/contracts/packages/token/nft  And here is a simple example  https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/contracts/nft_example.tact (reply to 7676)

Vlad: you know the addresses of wallets A nad B, you receive messages from them (reply to 7684)

🅰🅻🅰🅽: really weird (reply to 7683)

Vincent: receive messages from #DEBUG#: ctx.sender     #DEBUG#: 106049046352529569845024950561425216312340780032640300146531616007534400268795 #DEBUG#: TokenTransferInternal myAddress()     #DEBUG#: 106049046352529569845024950561425216312340780032640300146531616007534400268795

Vlad: you do not interact with jetton master

Vlad: only with wallets

Vlad: notification comes from them

Vincent: But in that case, how do I know if the address belongs to tokenA or tokenB? (reply to 7698)

Nikita: if we interact only with wallets (and they are separate smart contracts).  Then what is stopping the wallet to send the amount which is bigger than his balance? AFAIU there is no balances map in master contract so can't validate that the user has those money 🤔

Heydar: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#summary (reply to 7686)

Grit: where did you get those logs from? 🤔 (reply to 7674)

Vlad: you have this addreses set in your contract (reply to 7699)

Vlad: please read about jettons on tact by example (reply to 7700)

Vincent: Is there no, or did I do something wrong (reply to 7703)

Vincent: dump (reply to 7702)

Vlad: idk what you doiong (reply to 7706)

Vlad: . (reply to 7704)

Vincent: dump(beginCell().storeAddress(msg.from).endCell().hash()); (reply to 7708)

Vlad: https://tact-by-example.org/07-jetton-standard

Vlad: Ignore any errors arising while processing this message during the action phase   What is action phase here?

Vincent: Read it many times, didn't find any help for my question, or was our question wrong? What I don't know is whether my question is in the wrong direction, or whether I haven't found a solution? (reply to 7711)

Vincent: Could you clarify it for me? (reply to 7711)

Grit: I mean technically. Did you run them locally along with jetton contracts? Or is there some online sandbox? I'm new to TON so I'm sorry if this is a stupid  question (reply to 7707)

Vlad: yeah, looks like you don't understand how jettons work (bring jetton master for no reason) (reply to 7713)

Vlad: you can run locally using blueprint folder "tests" (reply to 7715)

Vincent: hi everyone, does anyone know the comparison method of A and B jetton in task3? Thank you

Vlad: Compare the sender with JettonAddresses

pizza-777: Seems everything is good in #3 but tests 1/10. Anyone has the same?

Vincent: @pizzza777 How did you determine whether jettonA or B was received? Can you help me with that?

Kastuś: 0/10 with all features working in my test script 😂 (reply to 7720)

Vlad: Yeah (reply to 7720)

🅰🅻🅰🅽: There might be a slight discrepancy between your test and theirs. Based on my experience, it is more efficient to submit directly than to write a test, as you do not know how they structure their test. (reply to 7722)

🅰🅻🅰🅽: For instance, some messages require to be bounceable. (reply to 7660)

Vlad: Isn’t it by default? (reply to 7727)

🅰🅻🅰🅽: Sure

🅰🅻🅰🅽: But what is the problem when i set bounce:false?

🅰🅻🅰🅽: If they do not implement a bounce receiver, then whether to 'bounce' or not does not matter.

Vlad: It changes the number of events and transactions (reply to 7731)

Vlad: I think they check it in tests

🅰🅻🅰🅽: Yeah

🅰🅻🅰🅽: I suppose as well.

Kon: bounce: true is by default (reply to 7665)

🅰🅻🅰🅽: Another question: Will setting bounce: false reduce gas consumption? (reply to 7736)

Kon: I guess that yes, but only if the message doesn't need to be bounced in tests

Dmitry | backend4you.ton: swap A / B in get fun price. don't ask why, just swap :) (reply to 7720)

User<5793713516>: Can anyone please tell me what body's first ref and body's data/bits means? In task 2

🅰🅻🅰🅽: beginCell() ... storeRef(...) ... endCell() (reply to 7740)

User<5793713516>: Can you please share some references to study about cell?

🅰🅻🅰🅽: Ton Concepts https://docs.ton.org/learn/overviews/cells  Tact Docs https://docs.tact-lang.org/language/ref/cells  Tact By Examples https://tact-by-example.org/all (reply to 7742)

User<5793713516>: thanks (reply to 7745)

🅰🅻🅰🅽: currently I remove all bounce: false to pass all the test. For gas optimization, you may try modify bounce: false one by one. (reply to 7743)

Andy: what? Only return B price in the getter or what? (reply to 7739)

Dmitry | backend4you.ton: no. return A when you return B and B when you return A (reply to 7748)

Sergey: I'm shocked by the level of organization of this hackathon. The tests do not meet the conditions of the tasks, the verification server constantly breaks down, the tests return different results for the same code, and the organizers simply ignore messages, even direct... (reply to 7749)

Andy: this brought me back from 9 to 1, I guess I did everything correctly initially :) any hint for test 10? (reply to 7749)

Dmitry | backend4you.ton: sorry, yes you appears to had correct one. and for last test... check possible division to 0 maybe ? (reply to 7753)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: What is the maximum number of cells that I can use as references from the main branch and sub-branches in a tree? I know that each cell has 4 references and it is up to 255 deep.

Yuri: Nobody else get 4/11 on Task5? No one seems do discuss this

9: two days on 9/11, check OwnershipAssigned and getters, others don't test before 7/11 (reply to 7756)

Vlad: What?) (reply to 7749)

Vlad: So when I get JettonA I return the price of B? (reply to 7749)

Dmitry | backend4you.ton: I had 1/11 before and 11/11 after. If yo think your code is Ok and you have 1/11 - try to swap :) (reply to 7759)

Puria: Is there anybody knows about last test of task 4?

Puria: I stuck at 4/5

Sergey: same (reply to 7763)

Howard: what is the current issued mostly?

Andy: me too (reply to 7763)

Vlad: I was, but solved with send remaining value mode (reply to 7763)

Heydar: did you solve 4? (reply to 7770)

Sergey: mode: SendRemainingValue ? (reply to 7770)

Heydar: that is making me confusing  :(

Puria: I changed mode from SendRemainingBalance to SendRemainingValue and set the value to myBalance() - value But I ended with another failed test (3/5) 🤦🏻‍♂️ (reply to 7770)

Sergey: When I remove send in withdraw nft handler I still have 4/5 (reply to 7770)

Vlad: Don’t change the value (reply to 7774)

Maxey: stuck 10/11 at task 5

Ruslan: +

Puria: You mean set value to myBalance or 0? (reply to 7778)

Vlad: 0

Sergey: 0 (reply to 7781)

Vlad: I really passed the second test by doing so (reply to 7761)

9: do you understand what the 9/11 test is about? 2 days on it (reply to 7779)

Vlad: that's ridiculous (reply to 7784)

Ruslan: depends on what you have already) (reply to 7785)

Ruslan: check requires in withdraw all nfts (reply to 7785)

Вероника: task 4, how to get an NFT address if there is nothing about the address in the OwnershipAssigned message?

Ruslan: sender() is nft

Вероника: Wow thanks

9: do you return remaining tons back to admin in withdraw all nfts or they remain on the balance of the contract? i think i incorect calculate in this place, or maybe it doesn't matter at all (reply to 7787)

Ruslan: i have 10/11 and problems with that (reply to 7792)

Ruslan: as i understand 1 ton is for SC gas and 0.08 * n is to send all nfts

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: optimizing to get back our position 🧑‍💻 (reply to 7768)

Sergey: Which is cheaper on gas: else or return?

&rey: Depends on contract structure, but return is translated into TVM assembly IFRET<{...}> which is shorter. (reply to 7796)

Mario: Hey, does anyone have a function in Tact to store on-chain metadata for Jetton? (reply to 4900)

🅰🅻🅰🅽: We have implemented on chain jetton content in our project  https://github.com/Ton-Dynasty/tondynasty-contracts/blob/a2dadba58d192c5ea6b3a82ce1cec9f7d2d1d51e/contracts/nft_fractionalize_example.tact#L148-L174 (reply to 4900)

Mikhail: Hello everyone, how can i escape "max" size of a contract in Tact? i've had problems with previous projects. How can i put it in more than 1 cell?

Howard: oh, nice!! Let me check 💪 (reply to 7799)

Mario: how can I call the muldiv builtin from Func in Tact? https://docs.ton.org/develop/func/builtins#integer-operations

&rey: If it's not provided in stdlib, you must not, since it would require native fun — that is, binding. (reply to 7805)

Vlad: Any clues for test 9 task 5, test 8 is about profit withdrawal

9: + (reply to 7808)

Vlad: No (reply to 7810)

Maxey: Is there any trick to WithdrawAllNfts in Task 5?

Maxey: I think the problem is at while loop(when I try to send Transfer msg to NFT Item) Any one have any ideas?

Maxey: There are multiple questions I want to confirm: 1. should we need to refund the owner after calling AdminWithdrawalAllNFTs?  2. What should we fill in the Transfer message? We have tried any reasonable combinations but still failed.  3. Can we reset the map and index after while loop? Or I need to update them in every single iteration?

sd: You are not in EVM (reply to 7815)

Павел: try to change a and b in price getter (reply to 7720)

Павел: Local tests are very helpful… For example, tests can help to improve gase usage (reply to 7726)

Павел: No. I tested it (reply to 7737)

Павел: You will return price of A calculated in B tokens. When you will multiply them, you will receive amaunt of B… (reply to 7760)

Howard: If your contract has a balance of zero, then using SendRemainingValue will not leave any amount of TONcoin in it.  (Similar to the scenario when using self.forward)  If there is a balance in the contract and you want to clear it, then using SendRemainingBalance will bring the contract's balance to zero, even if this withdrawal transaction involves only a small amount of TONcoin. (reply to 7824)

Dmitry | backend4you.ton: you need to "reserve" this N (reply to 7824)

🅰🅻🅰🅽: I agree with your perspective. Unit testing is indeed a powerful method for identifying bugs and optimizing gas usage, but it truly shines when we have a thorough understanding of every checkpoint and detail in our specification. Therefore, if we successfully pass all the test cases, local testing becomes crucial. It is important to consider that if we lack insight into how the server conducts the tests (how they implement their underlying contracts), writing tests may only help us identify issues that we are already aware of. (reply to 7818)

Павел: hm… Or help to be more carefully and strictly to be able more complex tasks... (reply to 7829)

a: In task 5, can we use the function myBalance or is it better to create a variable with the values?

User<5793713516>: I have tried task 2 more than 50 times but still got at most 1 testcase passed.😢

&rey: myBalance is cleaner. (reply to 7834)

User<5793713516>: At last i have completed task 2, 🥲

M: hey guys, i have a question for 4th task, do i need to send myself(contract address) the message OwnershipAssigned after i send the Transfer message to NFT?

a: did anyone figure out what is the problem when you get 10/11 in task 5?

&rey: My problem was in rejecting NFT with insufficient value in message. (reply to 7843)

a: how do you check if there is not enough value? (reply to 7844)

a: In task 5, if there is not enough value in message to give the nft back, do we need to add the nft to the map?

&rey: Nope. You don't even need to check that — just let TVM throw error that there is insufficient gas. (reply to 7848)

BrayanD: But in that case how to now if we should keep his NFT or not? (reply to 7849)

&rey: if (context().value < ton("2.1")) {try returning, if error arises don't handle it} (reply to 7850)

Kenny: when withdrawing all NFTs, each draw set to take an avg context value?

./FerNaN: If error arises should we store the NFT in the map? or just ignore it? (reply to 7851)

&rey: Just ignore it. By the way, contract may not even know about the error occuring, since it can happen at action phase (after all computations). (reply to 7853)

BrayanD: Thank you!, btw when the admin makes a withdrawal should we keep in the Smart Contract 1 ton and use the remaining 0.08 * totalNft tons to transfer each NFT? or split equally the total amount of tons for each trasfer? (reply to 7851)

&rey: Use a bit less (0.06 TON) per NFT, you'll need the remaining money for calculations. (reply to 7855)

BrayanD: But for the calculations we have the extra 1ton right? Because the admin sends 1 + 0.08*Nfts tons (reply to 7856)

&rey: I predict that you need more than 1 TON for calculations. (That's reason you can send no more than 100 NFTs, 255 would fail.) (reply to 7857)

BrayanD: It makes sense, thank you so much (reply to 7858)

Heydar: he removed this 😐 (reply to 7678)

Kilyandra: https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/messages.tact (reply to 7862)

Heydar: thanks (reply to 7863)

Heydar: in task 4 we should save more member variable? or its does not need?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Assignment 5 gives me a score for 9/11... any ideas or suggestions that I might be going wrong?

Heydar: guys do we need that? or it's not allowed? (reply to 7871)

Kilyandra: you can create your own variables (reply to 7873)

./FerNaN: Hi, sorry for keep bothering. In task #5 it is correct to use this to transfer NFT to newOwer? or should I change some argument?  send(SendParameters{         to: nft,         bounce: true,         value: amount,         mode: SendIgnoreErrors,         body: Transfer{           queryId: 0,           newOwner: newOwner,           responseDestination: newOwner,           customPayload: null,           forwardAmount: 0,           forwardPayload: emptySlice()         }.toCell()       }); (reply to 7858)

Kilyandra: queryId (reply to 7875)

TORUN: Okay

Y: I keep struggling with the last test in task4. Seems like it is checking for  "message with text comment".  Do we need something more complicated than "self.reply("needed text".asComment()); " ?  I tried this and more "extended" version of send() with .asComment() in the body, But none of these seems to work.  Any ideas, what can be the problem?

Kilyandra: reply is enough (reply to 7893)

— 2023-10-19 —

Ahmet Said: what is the geniune effect of query-ıd here ? (reply to 7876)

Konstantin: Several hours of problems with the server: "Error: The operation was canceled"

Kenny: Did u figure this out 🙄? (reply to 7814)

Luke: server down?

Maxey: Still trying (reply to 7903)

Vlad: is it connected to SendIgnoreErrors mode? (reply to 7849)

Vlad: my problem was with mode (reply to 7893)

Vlad: what does this function do ? https://docs.tact-lang.org/language/ref/advanced#readforwardfee

Luis Daniel ,Ⓜ️ MEMES▪️🐾: In task 5 the 0.08 ton would be sent in the shipping value parameter to the nft, right?

TORUN: Correct

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Well I leave it at 0 and set it to 0.08 ton and it makes no difference in the score, it's as if it had no influence (reply to 7910)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: 😐

Vlad: check this guys (reply to 7856)

Vinh: Anyone have troube when submit the codes? the ci show: "Error: The operation was canceled" and timeout after 10 mins

Luis Daniel ,Ⓜ️ MEMES▪️🐾: No matter how the rate changes... I saw that it simply does not give or take away points... at least for me... I will have some problem with secure shipping (reply to 7913)

Vlad: when I use some value and mode "Send ignore Errors", does it pay for message using the incoming message value?

Vlad: mode is also important (reply to 7917)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Yes, I know... they must send the 0.06 tons... of the shipment value and collect the gasoline from the balance of the contract. Good? (reply to 7919)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Or shouldn't I do that?

Kenny: shipment value is forwardAmount? (reply to 7920)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: If you simply use that method, they will charge you for gas from the value of the shipment itself. (reply to 7918)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: As far as I know, that field is what is sent to the user of the shipping value. (reply to 7922)

Vlad: Why gas from balance? (reply to 7920)

Vlad: You will lose profit

Vlad: Should forwardAmount be 0?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: When you receive a message, the tons it contains are deposited directly into the contract balance and when you use the mode: "SendPayGasSeparately"  What it does is pay the gas balance of the message that you are going to send from the balance of the contract (reply to 7925)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: no idea (reply to 7927)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: 🤦‍♂️

Luis Daniel ,Ⓜ️ MEMES▪️🐾: I no longer know how to humanly configure that sending... that sending of all the nfts is the only one that does not affect the score in all my code

Yuri: If the limit of max NFTs withdrawn somewhere about 255? (reply to 7858)

BrayanD: What should we do to keep exactly 2 tons after swaping NFT? because using context().value - ton("2"), maybe some gas will be use from those 2 tons that you keep right? (reply to 7932)

Yuri: Check out reserving TON  https://docs.tact-lang.org/language/ref/advanced (reply to 7933)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: Is it legal to do so? it works for you like this (reply to 7933)

Vlad: End when I don’t use this mode? (reply to 7928)

Vlad: Reserve (reply to 7933)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: ? (reply to 7937)

Andy: What modes worked for you? (reply to 7907)

Vlad: I believe this mode pays fee from the balance, not touching the value (reply to 7939)

&rey: Maximum actions count is 255, but you will definitely run into gas limit by then. (reply to 7932)

Vlad: So you loose profit unless you reserve

Luis Daniel ,Ⓜ️ MEMES▪️🐾: yes (reply to 7941)

Yuri: Yeah, solved it. I asked the question while waiting for github action to finish (reply to 7942)

Luke: Ive been at 10/11 on task 5 for days, someone plz help me

Luke: i know the issue is with the sendAdminNFTs like everyone else, but idk what

Luis Daniel ,Ⓜ️ MEMES▪️🐾: And me on 9/11, any advice? (reply to 7946)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: look what they talked about above (reply to 7946)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: maybe it will help you

Luke: nah ive tried it all, something is just not right (reply to 7950)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: ? (reply to 7948)

Luke: idk i never had 9/11 (reply to 7952)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: 😭

Luke: like my first submission was 10/11 like 4 days ago, and ive never fixed it

BrayanD: But nativeReserve reserves the balance? or also it can reserves the current value? (reply to 7935)

Yuri: It can reserve: - exact amount of tons, - all but exact amount of tons  Use some calculations to figure out how much you need to reserve

Howard: I merged one of the pr from community. Why do you ask here? Anywhere you need help? (reply to 7862)

Howard: can put in 0n (reply to 7901)

Howard: It's using when we try to forward the message like the scenario here in Jetton Transfer(in TEP-62).  https://github.com/howardpen9/jetton-implementation-in-tact/blob/7b8d9d03c348d87489d76617a8fe5f669e187810/sources/jetton.tact#L108C47-L108C47 (reply to 7908)

Heydar: thanks to you for that, a buddy suggested that and I wanted to learn more. (reply to 7958)

Heydar: however stucked in task 4 :/

Vlad: if I use native reserve and sendRemaining balnce, the resrved amount stays in the contract?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: This is not really fair to those who started the development in TON with TACT. I worked hard to finish the tasks, but now my position is the same as the people who completed 4 tasks. Because people by abusing their knowledge are at the top of the table by using nativeSendMessage. So this is not the challenge of the new language, it is the challenge of bypassing the limitations of the new language.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: For fair competition, I request everyone to use nativeSendMessage and do not let your rights be lost. It is same as send you can store your struct as reference by using .toCell().   Transfer { ....}.toCell()

sd: I didn't found nativesendmessage in official docs at docs.tact-lang.org (reply to 7967)

Vlad: How do you see the table? (reply to 7964)

Dmitry | backend4you.ton: are we allowed to use undocumented features? (reply to 7967)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: that's funC

Luis Daniel ,Ⓜ️ MEMES▪️🐾: They penalize you for using that

Vlad: What about the fwdamount and response destination in the body? (reply to 7856)

Mario: Hey, what's the maximum gas a tx can consume? Also if I have a chain of transactions via messaging the max gas only applies to a single tx and not the entire chain? I come from Near Protocol background, where this is different and internal tx are called receipts. The max gas applies to a chain of receipts.

pizza-777: What is the locked time in #4? Is it the time duration (200 seconds for example) or simple timestamp before nft will be locked?

Mario: do bounced messages have altered fields compared to original message? I get a compiler error, which doesn't make sense: # error Type bounced<"SendLiquidityToLpInternal"> does not have a field named "amount"  # code message SendLiquidityToLpInternal {     amount: Int as coins;     # ... }

Vlad: Duration (reply to 7979)

Sasha: I didn't use it and got 26.915 Even if top places use it, it is still possible to reach it But agree, that it is not really understandable if we can use it or not (reply to 7964)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Interesting, waiting to see your code to learn fair and hove to code good, awesome (reply to 7982)

Mario: oh I found the answer: https://docs.tact-lang.org/language/guides/bounced#caveats (reply to 7980)

Mario: with this limitation almost all little more complex recovery mechanism are kinda useless?

Sasha: Sure, can send after contest But if orgs will allow nativeSend, I will use it) (reply to 7983)

Dmitry | backend4you.ton: 26.930 without nativeSendMessage - only things searchable in TACT docs (except making new native functions via @name). But yes, this only thanks to previous FunC challenge.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: with nowhere documented, it is about fair bro, I can use it, then you lose your rights, I know may you can use too even better of others, but think about +300 new comes with only tact-lang & tact-by-example resouces as I said this is a challenge about new language to find bugs, get feedbacks and ways to how to develop it, not about how to cheating compiler to fetch more points (reply to 7986)

Dmitry | backend4you.ton: yes (reply to 7989)

🅰🅻🅰🅽: I came up a question: when will SendRemainingBalance evaluates its value? Suppose that myBalance is 200 ton at the beginning. When receiving an arbitrary message, I use a nativeReserve(ton("100"), 0) and then send a message with mode  SendRemainingBalance, how much ton will the contract send?

sd: Balance except 100 ton (reply to 7993)

🅰🅻🅰🅽: How about change it to nativeReserve(ton("100"), 0+4), and nativeReserve(ton("100"), 0+8)? (reply to 7994)

Dmitry | backend4you.ton: disagree.  --- Docs: nativeReserve calls native raw_reserve function with specified amount and mode. The raw_reserve() is a function that creates an output action to reserve a specific amount of nanotoncoins from the remaining balance of the account. ---  your source balance 200  you recieve msg with X tons for gas, you balance is 200+X after recieve phase  execution of your code (compute phase) spend some gas Y, so you have balance 200+X-Y, and you created "output action" to reserve 100 and second output action to send msg with SendRemainingBalance.  in action phase, "reserve 100" executed and now you have "available" balance 200+X-Y-100, which will be sent with SendRemainingBalance (reply to 7994)

🅰🅻🅰🅽: Wow! Thank you for your clarification! Will the output balance different if i change the mode to +4 / +8 ? I couldn't clearly understand the explanation on the document. (reply to 7996)

Dmitry | backend4you.ton: --- +4 - Increase amount by the original balance of the current account (before the compute phase) --- so nativeReserve(100, 0+4) will reserve 200 (source) +100, so last msg will send 200+X-Y-(200+100) so it will fail if X is less than 100+Y (reply to 7997)

Dmitry | backend4you.ton: about +8.. dont understand when "negate amount" may be used, sorry. its better to check FunC / TVM docs, but I don't have time now

🅰🅻🅰🅽: I really appreciate your elaboration. Thanks a lot!

Andy: let's say X is 200, Y is 75, and we send a message with SendRemainingValue. Would nativeReserve(100, 0) and nativeReserve(100, 4) be the same thing? Because incoming message's value is always used first, Y and nativeReserve(100, z) would also be spent/reserved from the incoming value. And so sending remaining value would result in 25 nanotoncoins being sent back regardless, right?  Also to add to the discussion, I'd guess that +8 flag would be for unreserving an amount of nanotoncoins (reply to 7998)

sd: please describe, i'm newbie (reply to 7996)

Dmitry | backend4you.ton: sc recieved 1 + 200 + 1 in three messages something spent for gas (and storage) with last, you reserved 100 and send all other ("SendRemaniningBalance) yes, your balance is exactly 100 because you sent all other except reserved 100 (reply to 8002)

sd: so, the question was: > how much ton will the contract send? my answer was: > Balance except 100 ton  sc sent:  > all other except reserved 100  where i was wrong o_o (reply to 7994)

Dmitry | backend4you.ton: sorry too complex to think now :) (reply to 8001)

Dmitry | backend4you.ton: what is "balance" in your answer? original balance before msg or final balance  msg reciev + action phases ? (reply to 8004)

sd: final balance ofc 🫡 i meant that on sc balance would be exactly 100 ton (reply to 8006)

sd: 🤔

Dmitry | backend4you.ton: with original question with "balance = 200 at the beginning" and your answer "balance except 100" I supposed that your answer is 200-100 = 100  but actually its 200+X-Y-100 so its not exactly 100 (reply to 8006)

Grit: Remarkable result! I don't have any Func background so struggle for every 100th of point😂. Can you please share a breakdown of your score by tasks, for the reference? (reply to 7987)

Илья: Hi, anyone had problems with the action, they stopped working last night?

Dmitry | backend4you.ton: sometimes contest server is overloaded. github action has 10min timeout set. (reply to 8015)

Hakiem: for receiving bounced messages like this:     bounced(src: bounced<MyMessage>) {         // ...     }  how do i access the fields of the bounced message?

Grit: hmm, in task2 do you use context.raw? (reply to 8014)

Dmitry | backend4you.ton: no (reply to 8018)

..: do we need to use bounced handlers?

Илья: I ran it several times, and at different times, but it didn’t work, after have added 3 task (reply to 8016)

Mario: you just do src.field, but check this: https://t.me/tactlang/7984 (reply to 8017)

Mario: is the TokenExcesses message standardized?

User<5754972482>: Tact does not compile me in vs code, I guess I no longer have time to deliver tasks

Quang: still stuck 3/5 in task 4 when reject NFT, Anyone can hint me =((

Mario: I see excesses in TEP-74 (https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md), but is the gas refund standardized across any smart contract? (reply to 8030)

Mario: does SendRemainingValue only work, if I send a single message?

Protagonist: i have an extension for tact but it shows me this error

Protagonist: hello (reply to 8035)

Protagonist: anybody can help? (reply to 8036)

Kon: you don't need to debug, because extension doesn't have this feature. (reply to 8037)

Protagonist: i don't want to debug it. i selected start without debugging (reply to 8038)

Kon: This extension provides:  Syntax highlighting Error highlighting Snippets Additional information by hover event Code completion for all variables, functions, global parameters and unique types for tact Code completion for all contracts / libraries in the current file and all referenced imports Formatting

Kon: to run tact contract on ton-emulator you need to use blueprint

Mikhail: Hello everyone, have anyone seen ERC721 standart in Tact? found only NFT example in tact

Protagonist: i'm sorry. i am a beginner in programming.how i can use blueprint? i have to install it or what? (reply to 8041)

User<5754972482>: https://github.com/tact-lang/tact-emulator (reply to 8043)

🅰🅻🅰🅽: You can refer to our nft template  https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/contracts/nft_example.tact (reply to 8042)

🅰🅻🅰🅽: And here is our documents related to NFT standard https://ton-dynasty.github.io/docs.contracts/docs/nft/NFTCollection (reply to 8042)

Mikhail: Thanks a lot! (reply to 8051)

Nikolay: how to load uint from slice?

Alireza: https://docs.tact-lang.org/language/ref/cells#sliceloaduint (reply to 8062)

abdallah: how to make my fork private guys

Nikolay: Type "Slice" does not have a function named "load_uint". Do you have example? (reply to 8063)

Mikhail: cause it's loadUint, not load_uint (reply to 8065)

Railgun: In tact cell, how do we store null?

a: in Task5, when admin calls AdminWithdrawalAllNFTs, do we need to give him back all the value if we don't use it? (ie, should we use SendRemainingValue in the end?)

Railgun: Also how do we implement toCell for messages with op code. I.e., buildCell

abdallah: guys ... (reply to 8064)

Ivan: Guys, please tell me if it is possible to reduce gas consumption by require.  I mean, does it make sense to change require(... , "") to something else, is there any advice.

🅰🅻🅰🅽: Is there anyone familiar with funC knowing how readForwardFee works?

&rey: Yes. It reads 2/3 of fee paid by incoming message sender to deliver the message. (reply to 8077)

🅰🅻🅰🅽: Why is the ratio being 2/3?

&rey: Because... some strange things about how transaction is sent (maybe splitting fees between validators of sender's and receiver's shard). Ratio is hardcoded into validator code. (reply to 8079)

🅰🅻🅰🅽: That’s cool 😎

🅰🅻🅰🅽: Thank you for your explanation 🙏

&rey: You need, and I'm 70% sure that it was hidden deliberately. This is actually a good exercise on figuring out how to do everything correctly.

a: What should we do if we have more than 100 nfts? (reply to 8084)

&rey: Send them all. Yes, sending them all in one transaction is impossible. Yes, there must be only one admin message. No further hint should be required. (reply to 8085)

a: Wait, is it possible to send more that one nft in one transaction?

&rey: Indeed you can't even send one nft in one transaction; you'd need at least three (message import onto wallet contract; wallet—>your contract internal message; your contract—>NFT). (reply to 8087)

BrayanD: I think he means sending a transfer message, is it possible to send more than 100 messages or transfer messages in one smart contract call? (reply to 8088)

&rey: It is possible. Hard limit is 255, gas limit is somewhere around 120-180. (reply to 8092)

BrayanD: In the test cases could be more than 255 NFTs?

Kiba: I send 253 at a time (reply to 8093)

Andy: did you figure this out? btw this was very helpful to know what test 8 was about, thanks (reply to 7808)

a: how can we send more than 255 transfer messages then? (reply to 8094)

.: As I understand, 9/11 in task 5 means that AdminWithdrawalAllNFTs doesnt work at all, right?

BrayanD: It means that you will spend a week to figure out what is the bug

.: send(SendParameters{               to: sender(),               value: 0,                mode: SendIgnoreErrors,                bounce: true,                body: TokenTransfer{queryId: 0, amount: (self.aAmount / self.bAmount) * (msg.amount * self.decimal), destination: msg.from, responseDestination: myAddress(), customPayload: null, forwardTonAmount: ton("0.01"), forwardPayload: emptySlice()}.toCell()           }); tell me if I'm doing everything correctly in the third task

Павел: What about test 4 task 5? (reply to 7808)

MonoBit: What is 7? (reply to 7808)

BrayanD: how do I get myBalance without counting the new incomes?

Rami: Maybe ‘myBalance() - context().value’ (reply to 8113)

BrayanD: MMM I think that you receive less than context.().value because of fees, so I want to know the exact value counting fees (reply to 8114)

Rami: Not according to this tip https://t.me/tactlang/7217 from @just_dmitry - you can get 10/11 without withdraw nfts (reply to 8104)

Grit: I guess it's something of interest. Task2.  Left case is good. Right case fails some test. How come?🧐

Dmitry | backend4you.ton: https://t.me/toncontests_chat/23502 same thing :) (reply to 8123)

Grit: I guess we hit some bug in compiler

Grit: I'm pulling my hair off - trying to guess how you've optimized task2 😂 (reply to 8126)

Dmitry | backend4you.ton: "If you have no hope: Invent" - Alegria, CdS (reply to 8128)

Grit: I even removed one receiver and parsed slice directly - but test failed (reply to 8129)

Dmitry | backend4you.ton: test runned but failed? when I tried this trick on first task - I got https://t.me/tactlang/6561 (reply to 8130)

Grit: yes this is possible when you are changing a signature of contract methods, but I was hoping that setting receiver which is a fallback for any msg would stop their tests from breaking (reply to 8131)

Nikita: task 4 in OwnershipAssigned I should send the message to sender() (as it's the NFT contract) right? But in NftWithdrawal I'm sending to: nftAddress provided?  stuck with 3/5

Dmitry | backend4you.ton: you tried recieve Refund in receive(Slice)? this will not work - check build/Task2/tact_Task2.code.fc , in _contract_router_internal it reads op-code and make separate IFs for each known value (reply to 8138)

Dmitry | backend4you.ton: what your get fun time() return when time is over? (reply to 8138)

Nikita: If time is over I'm returning 0; Should I throw an error? (reply to 8141)

Dmitry | backend4you.ton: 0 is ok. no need for error. wrong answer is return negative value (reply to 8142)

Dmitry | backend4you.ton: when you returned (withdrawed) nft - does your code able to accept/lock new one ?

Nikita: It should as I'm nullifying all the vars after I send (reply to 8144)

Nikita: I've read it but I didn't quite get it. I should check if sender() is not myAddress()? (reply to 8140)

Dmitry | backend4you.ton: no-no, that was not to you, dont' read that ^) (reply to 8150)

Mario: I found a storeBool function, but no loadBool. It also gives me compilation error so it apparently doesn't exist. How am I supposed to load a bool?

Grit: you can try loadUint(1) (reply to 8152)

Grit: not sure if it works, but 0 would be false and 1 true

Mario: I think -1 is true aka all 8 bits 1

Mario: yeah will try that

Grit: booleans are stored in slices as 1 bit

Ahmet Said: stuck in test 9 it seems . Any hint ı can get ?

Mario: oh yeah the -1 doesn't make sense. This confused me: https://docs.tact-lang.org/language/ref/cells#builderstorebool

Luke: i have spent a week, i still dont know whats wrong (reply to 8105)

— 2023-10-20 —

Y: I can't find anything about message batches in tact. Can someone give me a hint? Seems like just iterating through the map with NFTs and sending messages is not enough. May be some special param or something

pizza-777: task 4, 3/5 tests But seems everything ok.  Don't know why? Anybody solved similar?

Vlad: I know what test 5 is about (reply to 8111)

Vlad: Dk (reply to 8112)

Vlad: Trying using nativereserve and sendbalance mode (reply to 8096)

Vlad: It’s about profit withdraw more likely (reply to 8165)

Павел: Thanks, but now is 10/11 question( (reply to 8164)

Vlad: It’s about withdrawing a lot of nfts (reply to 8168)

Vlad: There is a limit for messages in ton

MonoBit: Do you know what does 9 do? (reply to 8168)

Ahmet Said: theres limit yes but how to solve this problem ? theres example how to handle this problem ??? (reply to 8169)

Павел: No. I got 10/11 right after 3/11 (reply to 8171)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: In task 5 should you worry about returning the excess withdrawal of all NFTs to the administrator?

Artem: i had the same, fixed modifiyng time getter and responseDist (reply to 8162)

Hakiem: how do you access the fields of the bounced message? i cant find the answer in the docs. or do i have to process manually using raw slice? (reply to 7984)

&rey: You can access only those fields which weren't truncated. Tact provides access to those. (reply to 8180)

Hakiem: Are there more docs on this? How do you know which fields were truncated

&rey: Only first 256 bits of original message are kept. (reply to 8182)

Hakiem: if the original message contains an address and an int, the bounced message would only contain the address? (reply to 8183)

Hakiem: i am unable to access any field: Type bounced<"MyMessage"> does not have a field named "field_1"

Vlad: No, address doesn’t fit into the message (reply to 8184)

Hakiem: cause bounced messages only store 224 bits of data whereas addresses take up 256bits? (reply to 8186)

&rey: Bounced messages contain (UPD) 256 bits of original and address length is 267 bits. (reply to 8187)

Vlad: 256 and address is 267

Grit: Speaking of gas optimization, this is kinda frustrating experience to understand you need to know Func (or Fift maybe) in order to optimize your Tact code.  What tips are there for optimization? Where can I find them?

Alex: Anyone knows how i can extract  an Addres and a int from  a slice variable ? Thanks

.: send(SendParameters{               to: self.jettonAddressB,               value: 0,                mode: SendRemainingValue,                bounce: true,                body: TokenTransfer{queryId: 0, amount: (self.bAmount / self.aAmount) * msg.amount * self.decimal, destination: msg.from, responseDestination: myAddress(), customPayload: null, forwardTonAmount: ton("0.01"), forwardPayload: emptySlice()}.toCell()           }); tell me the parameters are correct

.: and I correctly understood that in the third task you need to compare msg.from if it is equal to owner then compare sender() with jettonAddressA if it is correct to increase aAmount by msg.amount otherwise increase bAmount by msg.amount and if msg.from is not equal to owner then do send(SendParameters{               to: self.jettonAddressB,               value: 0,               mode: SendRemainingValue,               bounce: true,               body: TokenTransfer{queryId: 0, amount: (self.bAmount / self.aAmount) * msg.amount * self.decimal, destination: msg.from, responseDestination: myAddress(), customPayload: null, forwardTonAmount: ton("0.01 "), forwardPayload: emptySlice()}.toCell()           });

Dmitry | backend4you.ton: amount is wrong. re-read task description (and check that you have uptodate version because it had been updated several times since challenge start) (reply to 8196)

.: what is the problem (reply to 8202)

.: decimal?

Dmitry | backend4you.ton: your formula is different from formula directly written in task description by orgs (reply to 8203)

Andy: in what part of the contract? (reply to 8166)

Vlad: Almost all

Mario: how can manually serialize a dictionary in TS and deserialize it in Tact?

zolnex: here

zolnex: remember to import from 'ton-core'

Mario: ok thx. Do you also know how to parse it in Tact?

zolnex: use .get()

Mario: sorry need to be more clear. I have it as a Slice and need to parse it manually (reply to 8222)

zolnex: .asString()?

Mario: no I need to call load... on the Slice

zolnex: https://docs.tact-lang.org/language/ref/cells#sliceloadint here is the slice operations in tach

Mario: yes I know, but there is no documentation how to load a dictioanry

Heydar: is that right to taking the uint32 from task #4 ? msg.forwardPayload.loadUint(32);

Kilyandra: . (reply to 8228)

Heydar: but how I know that time? (reply to 8229)

Heydar: 😢😢😢 Ah god, my poor brain can't help me ...

Kilyandra: oops my bad (reply to 8230)

Kilyandra: yes you are right

Kilyandra: Slice is not a just "dictionary", you need to know how to parse slices correctly (reply to 8227)

Andrey: Guys, please any hints on 3rd one? Just playing the guessing game for a while..  What I have:   - top up from admin  - balance and price works  - echange works   - price throws if any jetton count is zero  - send jettons back in case not enough jettons to exchange  - throw if unknown jetton and send it back  - wrote tests that check exchange messages, balances and prices  9/10

testertesterov: Yes. I managed to do this after ~150 tests 👍 (reply to 8237)

Mario: that's exactly my question (reply to 8236)

Andrey: you are the man (reply to 8238)

Mario: I receive a TokenNotification and need to parse a dictionary inside the forward_payload Slice

Kilyandra: are you sure that you need to do this?

Mario: yes

Kilyandra: why

testertesterov: getPrice{B->{return "A"} and {A-> return "B"}}? (reply to 8240)

Mario: I need to send an array of data via TokenNotification, so need to use map for that

Mario: it's not related to the contest btw

Kilyandra: oh (reply to 8247)

Kilyandra: do you know how this dictionary is stored? (reply to 8241)

Kilyandra: you need to know what structure of data this "dictionary" have and you will easy parse it on receiving

Mario: const keys = Dictionary.Keys.BigUint(256);         const route: Swap['route'] = Dictionary.empty(keys, null);         route.set(0n, { $$type: 'RouteEntry', lpAddress: lp.address, side: false, minOut: 0n });  Yes this is how I create it.  And here is Tact message/struct: message Swap {     routeLength: Int as uint8;     route: map<Int, RouteEntry>; }  struct RouteEntry {     lpAddress: Address;     side: Bool; // true = buy, false = sell     minOut: Int as coins; } (reply to 8249)

Heydar: As far as I know, this contest is just for debugging their tools and better Tact compiler tools. So when I think about how the developers should work on the bugs we cleared for them, I really want to cry. It's so hard for them, but I can understand them now. 😞😞😭😭😭 I hope you (Ton and Tact developers) will be successful boys.

Andrey: unfortunately not: got 1 out 10 by swapping them (reply to 8245)

Kilyandra: why do you need map for this? (reply to 8251)

Andy: You shouldn't be throwing when there are no jettons. In a swap you should return the jettons, and in the price getter you should just return 0 (reply to 8237)

Mario: there's no array type in Tact and I implement an AMM with multiple swaps per tx (reply to 8254)

Kilyandra: so, when you are receiving Swap message, just using swap.route.get(0) doesn't work?

Mario: I don't have a "route". I only have a Slice aka forward_payload (reply to 8257)

Mario: I need to parse the route from the Slice

Kilyandra: show what are you sending in forward_payload

Mario: this message Swap {     routeLength: Int as uint8;     route: map<Int, RouteEntry>; }  struct RouteEntry {     lpAddress: Address;     side: Bool; // true = buy, false = sell     minOut: Int as coins; } (reply to 8260)

Mario: Swap encoded into Slice

Mario: anyway, gtg for a while. Thx for trying to help

Andrey: Thanks for suggestion, just left throw on wrong jetton type with no luck. Regarding returning jettons: should the same TokenTransfer message be used for that? (reply to 8255)

testertesterov: task4 3/5 Any ideas on what "try to test"?

Andy: yes make sure to fill out the fields according to the task's description (reply to 8264)

Павел: Who is responsible of this repo https://github.com/ton-org/test-utils? I created PR https://github.com/ton-org/test-utils/pull/10 with helper for calculation of gas usage

Павел: This is example of usage:   const smr: SendMessageResult = await act("some send message act");  expect(smr).toApproxGasUsage(10000000n); (reply to 8268)

Павел: I sure, that everybody have been dreams of it, but nobody done

Railgun: Is it possible to manually parse the message from slice instead of relying on multiple recieves?

Павел: You can test it using test utils, it is pretty common and simple (reply to 8271)

Dmitry | backend4you.ton: > throw if unknown jetton and send it back  you can't "throw" and "send back" at same time  on unknown just throw (reply to 8237)

Dmitry | backend4you.ton: also, check what happens if swap will arrive before admin put something into pool

Dmitry | backend4you.ton: > price throws if any jetton count is zero  return 0 instead of throw

Toheeb: Good day guys

Toheeb: I'm trying to understand Task 2,  Outcoming body's data/bits, outcoming body's first ref,  What do they mean?

Андрей: Good afternoon, I have a very strange problem: at one point all my solutions started to fall at the build() stage (even solutions that were already built and did not pass all the tests), Someone faced such a problem and how to solve it?

MBA: hi guys Task5 how should withdraw all nfts?

Railgun: I would like to know what should be the balance change in task 5 withdraw all

Railgun: Stucked in case 9 for a long time

Павел: It could be because of wrong formatting code (reply to 8282)

Андрей: Thanks for the answer, but the problem turned out to be a large number of solutions per hour (reply to 8290)

Павел: Did you split withdrawal nfts on chanks? (reply to 8289)

Andy: 9/11 or 8/11? I'm currently stuck on 8/11, have no idea what's wrong (reply to 8289)

Railgun: I send transfer one by one, iterate through the whole nft map

Railgun: Using SendPayGasSeparately + SendIgnoreErrors

Railgun: And send with value 0.06 as suggested in this channel

Railgun: also i believe we need to check on ctx.value >= ton(1) + hold * ton(0.08)?

Rami: As 9/11 guy I can tell you can get 9th pass without all nft withdraw implementation (reply to 8294)

Railgun: That's... interesting

Railgun: So maybe my owner assign has some mistakes

Rami: Most definitely (reply to 8302)

Victoria: check your get profit method , if your balance is lower that 0.1 ton, it should return 0🧐 (reply to 8301)

Artem: 0.01 or 0.1 as in task?

Dmitry | backend4you.ton: 0.1 as in task

Grit: Hey, Folks!  Are we allowed to use nativeSendMessage or what? What's the consensus?

Dmitry | backend4you.ton: https://github.com/ton-community/tact-challenge/issues/12 no official answer

Toheeb: Is there something wrong with the send function? (reply to 8308)

Grit: Just for the sake of gas usage optimization... (reply to 8312)

Toheeb: Okay (reply to 8313)

Toheeb: Only one test of the Task 2 is passed, any suggestions on that?

Kastuś: being kicked from the challenge for using nativeSendMessage would be the icing on this beautiful cake (reply to 8308)

Grit: sooo.... is it not allowed then? (reply to 8316)

Artem: can we send 254 nfts in one batch or is too much?

Artem: task 5

Grit: Max messages per transaction limit is 255 IMO

Grit: But, there is also a gas limit

Artem: k

Toheeb: Any one on this? (reply to 8315)

Kastuś: I guess it’s allowed, it’s part of tact stdlib and just saves you from using send method, allowing to manage storage at a lower level (reply to 8317)

Artem: send mode? (reply to 8315)

Toheeb: I only added SendIgnoreErrors (reply to 8327)

Artem: you need amother 1

Artem: another*

a: how can you do multiple batches? (reply to 8318)

Artem: i send message to our SC (reply to 8331)

Toheeb: Okay thanks (reply to 8329)

Dmitry | backend4you.ton: Better start with 100 and increase when all tests pass (reply to 8318)

Artem: i've already tried down to 150, probably have error somewhere else (reply to 8334)

Artem: size of 100 is 100%? (reply to 8334)

Dmitry | backend4you.ton: My one works with 150

Artem: damn

Dmitry | backend4you.ton: Do you remember about tons for gas for processing msg that you send to yourself?

Artem: we have 1 more ton for that, no?

Artem: 1 + nfts * 0.08

Dmitry | backend4you.ton: When you receive msg, no matter from who, your existing balance is not used by default

testertesterov: Try this (reply to 8315)

Artem: can you explain pls (reply to 8348)

Artem: dont get it

Dmitry | backend4you.ton: You recieved msg with 1+X*0.08 attached; Used some for sending nft, some for code execution, some is left and was added to your balance; You send msg to yourself When you process this message, only amount that was attached to it is used by default. Not coins on your balance.  Send money to yourself with "next" msg (reply to 8350)

Artem: i use mode 64

Artem: not enough?

Dmitry | backend4you.ton: https://docs.ton.org/develop/smart-contracts/guidelines/accept#internal-message here are deep details. 64 should work, but also may try 128

Artem: 128 with reserve? or just send all balance

Dmitry | backend4you.ton: Send all.

Artem: k thanks ill try

Grit: Guys, who can give authoritative answer: are we allowed to use nativeSendMessage ? 🤯🤯

Ahmet Said: awful gas consumptions but still all done xd

Andy: In task 5 what should we do if admin tries to withdraw profit and the contract's balance is less than or equal to 0.1 ton? throw? return? message with 0 ton? (if it even makes sense)

Rami: Any hint for 9/11?) (reply to 8365)

Ahmet Said: Dmitry gave a lot already about remaningBalance hint (reply to 8367)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: They want to kept 15% clean for the old developers, at the end they remove the group with the cheater tag so that the prize pool is distributed to the old participants. What we clearly saw in contest 4. Due to my poor English, I could not defend myself and was eliminated from the competition in 71st place  Hoping one day that the network will develop so much that there will be no room for this kind of games (reply to 8309)

Ahmet Said: my final touch was that

.: why is seed needed in the fourth task?

Grit: it's just a way to ensure every new contract instance has diff address (reply to 8373)

testertesterov: I think everything is fine. I managed to guess the condition only in 3 problems and the beginning of problem 4. ~153 place (reply to 8371)

Rami: Use chatgpt if you have/had trouble explaining yourself. You simple type your message in your native, and it will provide a good translation in English. Also you can add context (like messege[s] they sent you) for better transaltion. Or it happened before chatgpt?) (reply to 8371)

Artem: omg just found error in my task 5 algorithm, and now i have to check diffrent mods again...

.: understood nothing (reply to 8374)

Artem: just ignore it (reply to 8378)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I don't understand your answer, I am talking about respecting the rights of the participants and not the way of using the robot as a lawyer (reply to 8376)

Grit: this seed is used for calculation of the future contract address when deplying it. That's it (reply to 8378)

.: in what form do nft come in? test forwardPayload can be used (reply to 8381)

Grit: my turn to not understand your question 😅 (reply to 8382)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: After requesting a review, I was asked to explain how you found the solution. Briefly explain the solutions. I did, the only response I got was that "unfortunately we still think it was a fraud". They should have a reason for their accusation, not asking me how you managed to do matrix multiplication

.: I just can’t understand what OwnershipAssigned will look like (reply to 8383)

Grit: It's in the source file

Grit: Look at the top lines, before the contract code

MBA: any clue for task5 9/11

Andy: what was your issue? could be helpful 👀 (reply to 8377)

testertesterov: The solution to Task 2 also appears to be within the rules of the current competition. It is necessary to encrypt the solution against false matches with other participants. You can write down its solution less optimally. (reply to 8384)

Artem: theres git with basic outline of ton with dex, nft etc. i cant find the url, but there is a description of every parameter of transfer and OwnershipAssigned

Rami: https://t.me/tactlang/8370 🙂 (reply to 8388)

Artem: for you (reply to 8385)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I was one of the first 10 participants who finished the tasks, now I have prepared a complete version of the defense, so that I can defend myself if I am still not included in the list of old participants.🏍 (reply to 8390)

Grit: why old participants? 👀 Newcomers are discounted? (reply to 8395)

Artem: i know, but it was usefull for me to understand how nft works (reply to 8394)

Grit: did you look at nft contract sources? (reply to 8397)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: let see are the Tact organizers same as funC guys or not. (reply to 8396)

sd: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md (reply to 8397)

Artem: this one yes (reply to 8400)

testertesterov: 3/5 works for me now. I still don’t understand what the problem is. ~150 tests completed. (reply to 8397)

Artem: getter cant return negative values

Artem: time getter

Railgun: For admin to store nft, should it follow the 2.1 ton rules?

&rey: > They want to kept 15% clean for the old developers, at the end they remove the group with the cheater tag so that the prize pool is distributed to the old participants.  On first read, I've thought that you meant that top 15% will be removed as cheaters and prize pool will be split among participants below. Insofar I'm in top 15%, I don't endorse that) (reply to 8371)

&rey: It can, when there is no NFT (both at init and after withdrawal). (reply to 8403)

testertesterov: I tried. Did not help. There is something wrong with the NFT sending options. (reply to 8403)

Artem: what's your respDest (reply to 8407)

Artem: i passed 4 and 5, when returned 0 instead of negative) (reply to 8407)

Artem: srry (reply to 8409)

Artem: wrong message)

Artem: check your respDest (reply to 8408)

&rey: Maybe the tests were changed? (reply to 8410)

Artem: maybe

testertesterov: I tried different options myAddress(), sender(), msg.prevOwner() (reply to 8409)

Artem: than something wrong with code, i guess

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I don't understand the lack of accountability of the organizers regarding the use of native functions, and I can't imagine anything other than that everyone knows how to use it but we don't make it public so that other participants don't follow. So all the people above the board remain users with good knowledge of func = kept 15% prize pool for old participants (reply to 8406)

testertesterov: forwardAmount ? (reply to 8417)

Artem: 0

Artem: check this and youll understand which respDist you need and why forwardAmount 0 (reply to 8400)

Ahmet Said: in dev chat when someone come and ask "if we can just learn tact would be enuff " most old devs says without func its not good for u so i guess thats normal for ppl with good func background takes the lead .But im hoping dat no organizers enters the challenge if they were the real author of the challenge itself (reply to 8418)

Artem: does order of requires matter in task 5?

Artem: in withdraw nfts

| timon: Well I send all remainingvalue to owner in response destination with 0 forwardAmount and still get 3/5. (reply to 8424)

Artem: . (reply to 8417)

Heydar: oh my god,  any hint about the task #4?😢😢

Heydar: I could not pass even one test, IDK what I didnt understand about the problem ... (reply to 8430)

testertesterov: Maybe something is wrong here? OA: t: s, v: 0, m: SRV, b: t{q: 0, no: mpo, rD: mA, cP: null, fA: 0, fP: eS}  NW: t: mnA, v: 0, m: SRV, b: t{q: 0, nO: s, rD: mA, cP: null, fA: 0, fP: eS} (reply to 8429)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: check the time getter and setter (reply to 8431)

Heydar: ok ,thank you , I will double check now. (reply to 8434)

Grit: When Tact is mature enough this won't be the case. As to Func knowledge - it doesn't help much IMO. But knowing Fift surely does. (reply to 8425)

testertesterov: check OA: nft = s (reply to 8435)

testertesterov: I started getting 3/5 after this fix.

Luis Daniel ,Ⓜ️ MEMES▪️🐾: nativeReserve until when do you reserve the balance?

&rey: Until the end of action phase (when contract sends all the messages). (reply to 8439)

Luis Daniel ,Ⓜ️ MEMES▪️🐾: thanks (reply to 8440)

Alexey: completely stuck at 3/10 on Task3. What could it be?

Andy: Do you format your message according to the description? That was my issue (reply to 8442)

Sergey: Me too. I believe, balance and price are ok, but swap logic is not right. (reply to 8442)

Y: If in receiver of one incoming msg I produce several out-msg and each one has SendRemainingValue mode, how the value from incoming msg is spread between outgoing messages?

Kilyandra: don't forget to check that your jetton balance are >= than amount you sending (reply to 8444)

Hung: Hi guys, do we need to implement batch withdraw in task5 to pass all tests?

Sergey: I do. I tried use required and tried to send back Jettons.  The main problem for me is lack of understanding the idea behind the task. (reply to 8446)

Kilyandra: Idea is not that hard. You receive jetton 1, calculate price and send back jetton 2 (reply to 8448)

Sergey: Probably, because I don't have experience with any smart contracts, but it looks unnatural to send back to jettonAddressA jettons of type B. (reply to 8449)

&rey: But you send jettons of type B to msg.from, not to jettonAddressA! (reply to 8450)

Alexey: Thank you! This helped 10/10. (reply to 8443)

Sergey: That is making the case really bad for me to understand. Why from? I expected that this is the initiator of the whole chain. (reply to 8451)

&rey: Well, to be more precise: you send internal message (JettonTransfer) to your jetton wallet address (jettonAddressB) with request to send some tokens to the initiator of the whole chain (msg.from). (reply to 8453)

Toheeb: My Task3 only one test passed 😌

Sergey: How did you get that? (reply to 8454)

Sergey: Is it common pattern&

&rey: Indeed. It's pretty common on https://docs.ton.org. (reply to 8457)

Sergey: Thx! (reply to 8458)

Y: To put address in builder we use builder.storeAddress(adr) and to get the address we use newAddress(0, slice.loadBits(264)) ?

Alexey: Try to swap A and B in price getter. (reply to 8455)

Toheeb: Okay I'll try that (reply to 8468)

Heydar: guys can anyone help me where should I use the Transfer message in Task4 ?  :(

&rey: When sending NFT to owner, of course. (reply to 8470)

Kirill: In task 4, "forwardPayload" provided in UNIX-time or in another format?

&rey: Delta in seconds from the moment at which locker receives the NFT. (reply to 8475)

Kirill: thanks

Toheeb: When sending a token, are we using the adding the decimal to the actual amount?

Leonid: Hi guys, I have 4/5 tests on task4 now and I can't figure out what the error is.   some questions: In the receive(msg: NftWithdrawal) function can I use SendRemainingBalance or as above advised is it necessary to SendRemainingValue?  There is a small clarification - newOwner and responseDestination have the same values?

Manuel Darío: in task 5 AdminWithdrawalAllNFTs am i supposed to earn a profit? or should i send remaining TON to admin?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: by the task description, is not necessary, the balance of contract is withdrawable by the admin, so (reply to 8483)

Y: if I can store an address in slice by builder.storeAddress(adr), how can I extract if from slice?

&rey: .loadAddress() (reply to 8485)

Y: is it a slice method? Not mentioned on tact doc page about cells, builders, slices (reply to 8486)

Kirill: in task 4, what do we have to return in getters, if there is no NFT storaged?

Leonid: I think null if these are functions returning "address?" and 0 in time function (reply to 8488)

Kirill: thanks

| timon: Should i consider storage rent costs when send remaining balance and nft back to user in task 4?

Toheeb: Still the same error (reply to 8468)

Kirill: Stuck at test 2/5 Task4 pls help

testertesterov: This is not true.  I changed the signature to a more adequate one and everything worked 5/5 (reply to 8433)

Kirill: what's difference between "Address" and "Address?"?

testertesterov: null (reply to 8498)

Andy: Address? can be null, regular Address can't be null (reply to 8498)

Kirill: if I try to compare "Adress?" and "Adress" by "==", will it work correctly?

| timon: What a stupid mistake that I didn't notice for 2 days lol. Task 4 solved finally.

testertesterov: Do you have time for task5? (reply to 8502)

| timon: I'll try my best). (reply to 8506)

Kirill: What's in test 3 Task 4?

Grit: 👀👀

Grit: less then 30 minutes till deadline!

Railgun: Finally passed all

Railgun: May not have time for task 5 optimisation

Artem: the end?)

Grit: And So - It's concluded!

testertesterov: Error message: Deadline for submissions is over!

testertesterov: Thanks to all :)

Grit: Congratulations everyone! It was fun and challenging )

Ivan: It was really difficult, I couldn't solve 5 until the end.  Thanks everyone for participating.

Railgun: Didn't notice that bounced might be able to be used to save gas. Everything is too late

MonoBit: Please share a solution to 5 😢

Y: On the one hand it feels good to reach top 30% with no previous Tact and very limited TON experience. But spending 2 last days solving the very last test of the last task... and not being able to finalize it, it's sad) ... friking 10/11

Sasha: I think all want to see Spite solutions)

Railgun: That might include lots of string to slice serialisation

Railgun: Or magical uints with long bits

Toheeb: Can we get the solution to the challenges 🥲

K: All I need is the test suite 😢

Dmitrii: I thank the organizers for the opportunity to take part. I hope next time I will be better prepared and will be able to solve problems faster. ✅

— 2023-10-21 —

Railgun: I am not that upfront, but i think i could opensource mine.

Railgun: Many ideas are from this channel

Maxey: https://www.youtube.com/watch?v=CG3GALNvx60 This link will take you to Ton Dynasty's instructional videos for the Tact Challenge Task1 and Task2. 🎉  Developers who are interested can come and take a look. 👀 We will be uploading videos for Task 3, Task 4, and Task 5 shortly. If you have any questions, please feel free to discuss them with us! 🙌

Heydar: thanks. (reply to 8549)

Heydar: task 4 is provided too? (reply to 8549)

Maxey: In the comments section, there is a GitHub link that you can click to take a look at the answers for this Tact Challenge. The video part will be uploaded soon. (reply to 8554)

Heydar: I found a link to the task answer, but need a video to clarify it especially in flows and UML ... (reply to 8555)

Heydar: thanks. (reply to 8555)

🅰🅻🅰🅽: Your wish will come true in about one week 😆 (reply to 8556)

Grit: It would be really interesting to see what tricks people used for gas optimization

Grit: Gas usage optimization in Tact is not obvious nor trivial task. It would be great to have this topic covered in official tact docs.

Spite: My solutions for Tact Challenge: https://github.com/aSpite/tact-challenge-contracts.  I added a README in which I described almost all the optimizations in order to make it convenient to read the code. There are also some points about inaccurate tests.   The most interesting hacks:  - Storing the address as uint256 since Tact uses tact_verify_address every time an address is received, which consumes a lot of gas.  - Using commit (c4 and c5 saving) and throw(0) to abruptly exit the function when you only need to send a message without changing storage.  - The correct order of data storage in the storage. It is important to understand how Tact works with storage. It depends on which value will be the first on the stack. With the correct sequence of values used and their location in the storage, a significant improvement in gas can be achieved. (forwarded from Spite)

Dawit: https://t.me/addlist/kixOwqn3ERxkYWI8

Railgun: Reuse seed as time in task 4? That's super interesting 😎 (reply to 8571)

pizza-777: addr.skipBits(11) What is the function do/return? And why 11 bits? What is this bits? (reply to 8571)

Spite: Address consists of 267 bits. We need only last 256 bits, because they are data bits. First 11 were constant in context of this contest

Railgun: And maybe in task5 we could store nft as Slice instead of Address, so that no additional conversion call is required?

Spite: There are no Slice for value type. Actually, we can store as uint256, but there was bug, which does not allow you to use Int as ...  That's why I used Address as value type  I fixed it and created PR (reply to 8583)

Railgun: Also in the context mentions: The smart contract randomly chooses some NFT from the available NFTs (including the newly incoming one) and gives it to the user in exchange for the brought NFT So there might be a case that client send one without anything stored in nft. In that case, return back the new one.

Railgun: https://github.com/zenixls2/tact-challenge/blob/main/contracts/5.tact#L113 My solution for handling this, well still have bug that this should be self.totalNftsHold without -1

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: is possible to see your submission instead of this good detailed of tact-challenge solutions? (reply to 8571)

pizza-777: Are any tutorials how to build message for         nativeSendMessage function?

Grit: You can look at tact stdlib, namely send.tact file. (reply to 8592)

&rey: https://docs.ton.org/develop/smart-contracts/messages (reply to 8592)

Aleksey: How to test with jest that transaction is declined by require() condition?

Maxey: You can check this link(https://github.com/Ton-Dynasty/tondynasty-contracts/blob/85b17b393274e5aa6a59ad4442998868c8fd60e7/tests/NftAuctionExample.spec.ts#L269C1-L269C13)  Example:   expect(setUpAuctionResult2.transactions).toHaveTransaction({             from: alice.address,             to: nftAuctionMarket.address,             success: false,             exitCode: 58706, // Auction was already set for this NFT.         });   You can use exitCode to test whether it throw error. Your error code of your string (fun require(condition: Bool, error: String)) will be at build/contract_name/tact_contract_name.md  for this example: 58706: Auction was already set for this NFT.

Aleksey: Thank you (reply to 8608)

Александр: Greetings! I've cloned tact-template, set owner address in contract.deploy.ts to my testnet wallet, but when trying to deploy on tactDeployer site I get the following error: Transaction was rejected. Please retry. Does anybody have an idea why is it so? I've got the following error in Chrome console: Error: [TON_CONNECT_SDK_ERROR] tu Connect wallet to send a transaction.

User<5332466353>: wanna add some unique <on-chain> attributes to each NFT item

User<5332466353>: however, this requires me to input these unique values during initialization to obtain the correct initial data and thereby acquire the correct address

User<5332466353>: so i must storing these unique values in the collection contract, using a mapping

User<5332466353>: because my NFT collection doesn't have a maximum supply limit, it could lead to situations where the gas limit is exceeded when people use this contract later on

User<5332466353>: anyone has some idea about this issue?

User<5754972482>: Hackaton end ?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: It is clear that you are facing a serious challenge, because you cannot explain it well You don't have a limit and you want to set a limit or are you worried about the minimum balance for storage? (reply to 8620)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You can calculate the minimum balance amount for one year of the contract based on the storage you need and don't let it be less than that and after one year by sending TON to the contract keep it in chain  https://docs.ton.org/develop/smart-contracts/fees#storage-fee

User<5332466353>: What I mean is, if I use a map to store each item's unique data, this will result in unbounded data (reply to 8623)

User<5332466353>: In my case, the init.data for each item is different.

Dmitry | backend4you.ton: What is size of this “unique data” for one nft?

User<5332466353>: so i can't get its address only by the single input index

🅰🅻🅰🅽: Let me clarify what you’re talking about:  You want to build nft with different individual content, and you wonder where can you store these unique contents.  Am I right? (reply to 8628)

User<5332466353>: Imagine the withdrawal scenario in Lido. When users want to withdraw, they can't immediately withdraw stETH for ETH. Instead, they will get a withdrawal voucher NFT. This voucher NFT records the amount of ETH for this time's withdrawal.

User<5332466353>: yes (reply to 8629)

🅰🅻🅰🅽: And the problem is:   If you pass these amount of eth as init parameter, you need to save them in nftCollection to calculate nft item address in the future

🅰🅻🅰🅽: Right?

User<5332466353>: yes

User<5332466353>: saving them may lead to a problem of unbounded data

🅰🅻🅰🅽: Or try another way: update individual content after init it?

User<5332466353>: Haha, yes, that's also the only solution I've come up with so far.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I get you, so you need to review your algorithm if you want to follow the standards. you should calculate item address by the index + collection address one bad solution, you can store your item's index in a map after init and return the address from the map which is not suggested for huge collections

🅰🅻🅰🅽: Yeah but I think you can send a update content message with code and data, which you can meanwhile deploy a contract without setting individual content as init parameters

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: editable content is not acceptable by holders, However, we also have a standard for that (reply to 8639)

Dmitry | backend4you.ton: If changing part is an amount of some token - I guess this value will have some max limit, so may be it fit into int with counter in high bits?

🅰🅻🅰🅽: Mmmmm… So there should be some check inside of the update content function like only allow nft collection to call it? (reply to 8640)

Dmitry | backend4you.ton: And/or check in nft that allows only one update, not several

🅰🅻🅰🅽: Yeah, if so, “Initialize” may be a better name than “UpdateContent”

🅰🅻🅰🅽: Since we only allow to modify it once, as we deploy the contract

🅰🅻🅰🅽: Like the solidity proxy pattern does

— 2023-10-22 —

Howard: Hi community, I just write a boilerplate serves as a template for implementing the Friend Tech protocol on the TON Blockchain using the Tact-lang.   The pricing structure adheres to a predetermined equation. Please feel free to verify the code before using it!  https://github.com/howardpen9/FriendTech_in_Tact

🅰🅻🅰🅽: Sounds interesting 🙌 May I ask if there is any flowchart available to help me understand its operational principles intuitively? (reply to 8671)

Howard: Yeh. I will write one later. ☺️

Andy: Hi, everyone! Here are my solutions to the tact challenge: https://github.com/AndyRusso/tact-challenge

pizza-777: storeUint(0, 111) Why 111, not 107 ? (reply to 8571)

Spite: 4 bits for storeCoins(0) (reply to 8691)

pizza-777: ok. And why used storeUint(33792, 17) not storeUint(0x10, 6) Why need such long length of binary number in this case? (reply to 8692)

Spite: 6 bits for flags, 11 bits for address which consists of 267 bits.  11 + 256 = 267 (reply to 8694)

pizza-777: Thanks. And please other one question: storeUint(60331648, 29) Why 29 length, not 26? (reply to 8695)

— 2023-10-23 —

Spite: Because storeCoins(ton('0.01')) stores 28 bits of data.  storeCoins stores VarUint16, which means that the first 4 bits indicate how many bytes are needed to store the number. In this case, the number 10000000 fits in 24 bits, which makes 3 bytes. The first 4 bits contain the number 3, and the next 24 bits (3) bytes are the number itself. It turns out 28 bits + zero bit for custom payload (reply to 8702)

Dawit: https://t.me/addlist/oQRKNRFHcwdlZGZk

Hiro: does ton tact support event like in sol?

🅰🅻🅰🅽: You can emit event on tact, here is the example  https://tact-by-example.org/03-emit (reply to 8722)

Ken: Will the tests for the challenge be published?

Dmitry | backend4you.ton: They were not published for previous challenge :(

Grit: Time to change this practice (reply to 8751)

Ahmet Said: it would be great to have the tests so we can use it as template to create more tests (reply to 8752)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: @pcrafter for which one we had tests? 🤔

Grit: Yes, this would benefit everyone (reply to 8753)

&rey: https://github.com/ton-blockchain/func-contest1-tests https://github.com/ton-blockchain/func-contest2-tests (reply to 8754)

Howard: Add a fee images help you understand how it works!   https://github.com/howardpen9/FriendTech_in_Tact#buy-shares (reply to 8677)

TORUN: 1

— 2023-10-24 —

testertesterov: !! suffix operator - enforce non-null value, defined only for nullable types.  What happens if  null value passes into the send method? 0 and send or throw an exception?

Dmitry | backend4you.ton: !! Operator throws exception when actual value is null

testertesterov: Please tell me what exception it throws, otherwise the subtleties of the language are not often written in the documentation. (reply to 8818)

Dmitry | backend4you.ton: I don’t remember exact error code, but I have seen null check and throw somewhere in sources (reply to 8819)

pizza-777: What is the inline functions and static functions in tact? Where can I read explanation about it?

Kon: about inline - "modifier for functions for inlining them into the caller" from the changelog and nothing more. Where did you find a notion about static function?

🅰🅻🅰🅽: Yeah I haven’t seen static modifier before, either

Dmitry | backend4you.ton: /report (reply to 8826)

pizza-777: In the error message (reply to 8824)

Grit: This only means you are calling this function not as self.sqrt IMO

Grit: So it's static call in a sense

Mikhail: how can i convert cell into struct?

Howard: into struct? What do you mean. (reply to 8846)

🅰🅻🅰🅽: There is no way to serialize a cell into a struct directly (as far as I know). Alternatively, you should load data from cell one by one and then assign to a struct.

Mikhail: i'm trying to store some data in contract, there will be just a few Ints.   Since Cell is the most universal type of data i want to store it as cell. But if i want to change just one field in this cell i need to load each INT from cell, change some of them and then reupload it back to cell.  I want to do the next things:  Intead of parsing cell i want to do something like: struct MyStruct {    a: Int;    b: Int; }  some_data: Cell;   fun save_initial_struct(data: MyStruct) {     self.some_data = data.toCell(); }  fun change_a_field(value: Int) {    let parsedStruct: MyStruct = Cell.ParseToStruct(self.some_data)// i know that there is no method like this, just showing what i mean    parsedStruct.a = value;    self.some_data = parsedStruct.toCell(); } (reply to 8847)

Mikhail: @howard_peng as i understand there is no way how can i do this, so is should parse it with cell.beginParse().loadUint()...... and then change it re-write it in cell?

Dmitry | backend4you.ton: If you want to store some ints in contract storage - declare them as contract-level variables and TACT will parse/store them automatically (reply to 8852)

Mikhail: These one's are in child-contract, tbh it's nft's so it's logical to store them in metadata (individual_content) which is a cell in a nft standart. (reply to 8856)

Dmitry | backend4you.ton: Are you writing this child in func or tact?

Mikhail: tact (reply to 8858)

Dmitry | backend4you.ton: Yep, for now you have to parse and build it manually

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You can parse your cell then use load int/uint to load data and set them to your struct (reply to 8855)

Conrad 🐦 SUI: Okay

Mikhail: Can someone explain how to work with slice? For example i have a "Cell" field: field_a: Cell; i want to store here some amount of data and sometimes change it. for example i want to store 2 uint32 and 2 int32, so it's will be stored like: uint32(a)->uint32(b)->int32(c)->int32(d) How can i get value of a "c", and how can i change it?

Dmitry | backend4you.ton: Slice is for reading. If you need 3rd int32 - you need to read two first (no need to store them anywhere)  To change slice - you must create new cell and rewrite it all. Two unchanged int32 first (so you have to store them in variables while reading), then new 3rd, then unchanged 4th. Then endCell() and store it where needed. (reply to 8866)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: to load let cs: Slice = cell.beginParse();  cs.loadUint(32); //skip a cs.loadUint(32); //skip b let c: Int = cs.loadInt(32);  to load and edit let cs: Slice = cell.beginParse();  let a: Int = cs.loadUint(32); let b: Int = cs.loadUint(32); let c: Int = cs.loadInt(32); let d: Int = cs.loadInt(32);  let data: Cell = beginCell().storeUint(a).storeUint(b).storeInt(c * 2).storeInt(d + c).endCell(); (reply to 8866)

— 2023-10-25 —

yi: hi, how can I calculate the estimated gas for each function call on my local test env

Павел: Hi. I am looking for reliable partners to develop a large project in the TON blockchain. That’s our site - https://mirosphere.org

sd: /report (reply to 8877)

Grit: What kind of project are you going to build? (reply to 8876)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I need emergency help 😄 how to seed map<Int, Int> in constructor with key value?  I want to seed my map with {1: 1, 2: 12, 3: 123 }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Right now, I used an inline method to seed. not sure it's best practice, waiting for a true way for this. thank you (reply to 8886)

Howard: self.map.set(1, value1) self.map.set(2, value2)  ? (reply to 8886)

Railgun: In tvm it supports instructions to serialize/deserialize dictionary from a set.

Railgun: But i don't think that one is supported in tact... And maybe not in funC?

Railgun: Oh, it has load_dict

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Yes, this is what I did with an inline function, but data are static inside a math function like a global constant, for clarity I have a method to calculate month of year from Unix, I need a loop of 12 key {1..12} with value of days in month(29-30-31) based on days in year (365-366) (reply to 8890)

Railgun: Write a nodejs script to generate the inline function?

Mikhail: error: lvalue expected before ~load_uint           $rarity = begin_parse($payload)~load_uint(8); 💥 Compilation failed. Skipping packaging  Hello everyone, does anyknow how to solve this?

Anton: can you provide a reproducible example please? (reply to 8899)

Mikhail: Already figured out, need to create slice and load data in different lines of code:  instead  let a = cell.beginParse().loadUint(8)  do:  let slice = cell.beginParse(); let a = slice.loadUint(8); (reply to 8900)

— 2023-10-26 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: This is the code I use to convert the unix time to UTC string. Dear engineers, I want help for optimization please  day = day + (unix / 86400); // I miss to add this in screenshot (reply to 8894)

Dmitry | backend4you.ton: need fix for leap year:  "This extra leap day occurs in each year that is an integer multiple of 4 (except for years evenly divisible by 100, but not by 400). " (reply to 8922)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Thank you for your attention, I have paid attention to these things during the implementation. The tests have been passed since day 0 (1970-01-01) until today. It is the same in seconds (reply to 8923)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: But it is a bit heavy as a time extension, so I'm looking for math optimization  It's can be useful for who needs human readable datetime on chain

Andrii: Hello everyone, Please tell me how I can display all NFTs from a specific wallet after connecting it. Maybe someone knows how this is done on the getgems project? Thanks

Howard: TonViewer API (reply to 8934)

Mario: Hey, how can I call a read function on a smart contract via tonweb/tonconnect?

Mario: Is there a way like on EVM to auto generate a client to interact with a contract given its abi?

&rey: Blueprint does that for Tact contracts. (reply to 8944)

Mario: Do you know how the generated code can be used with tonweb or tonconnect SDK? (reply to 8945)

&rey: 1. Blueprint provides console interface that already supports TON Connect. 2. There are Typescript wrappers which can be copied into your site code. More details somewhere in documentation docs.ton.org. (reply to 8946)

— 2023-10-27 —

Mario: sorry I don't get it. I'm not trying to use TON Connect to deploy via Blueprint. I just want to call methods from a smart contract via TS. I know that Blueprint creates TS files, but idk how to use them in a frontend app. Those files seem to be useful for testing (reply to 8947)

Mario: for example Blueprint creates this function async getGetJettonData(provider: ContractProvider), but how can I use it via tonweb? How to get a ContractProvider?

Mario: I see there's this function in ton-core: export declare function openContract<T extends Contract>(src: T, factory: (params: {     address: Address;     init: {         code: Cell;         data: Cell;     } | null; }) => ContractProvider): OpenedContract<T>;  maybe this is how I can use it similar to testing?

Mario: but what's the factory param?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Check the SDK's documentation and sample projects  You may have to take a look at the Vladimir Alefman tact lessons at youtube

Howard: yeh, check here: https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/contract.read.ts (reply to 8941)

Mario: but this uses TonClient4 from ton library. If I understand it correctly I should rather use lightweight tonweb library for frontend (reply to 8972)

Howard: well, yeh. But you will need to use those modules if you are calling with the contract data that you deployed (reply to 8973)

Mario: hm... is there no example of how to use tonweb to call a get method of any smart contract?

Howard: for the standard userflow, no.   On the other hand, since you need to know the TL-B for the smart contract that to calling the data from On-chain level through the TonWeb

Howard: I don't recommend new devs to do that.

Mario: how can I get the seqno required for TonClient4.getAccountLite?

MonoBit: Is it possible to make http requests in FunC or Tact?

MonoBit: Something like oracle in BTC blockchain

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: as I know, not ready yet. (reply to 8983)

&rey: Nope. Unless until SSL is reimplemented. (reply to 8982)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: One of my friends applied for a grant to implement oracle in TON, but it was not approved. They informed him that was being implementing by another team. Do you know about it? (reply to 8985)

&rey: There are many kinds of oracles. No. (reply to 8986)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: @alirezatabatabaeian What kind of oracle did your team offer but was not approved?

Alireza: Consensus Based (reply to 8988)

yi: Can a map inside a struct, and the struct inside a map? It compiles ok, but can’t reading the value inside the struct map.

yi: Showing undefined reading “kind”

yi: And also can’t set the value inside the struct map field, compile ok, but all other function after the map set will stop.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: struct ContractStateArg2 {      valueA: Int;     valueB: Int; }   struct ContractStateInner {     valueA: Int;     valueB: Int; } struct ContractState {     valueA: Int;     valueB: ContractStateInner; }     get fun get_contract_state(arg1: Int, arg2: ContractStateArg2): ContractState {     return ...; } (reply to 8994)

yi: I mean have a map inside the struct

yi: Struct A { c: map<..> }  f: map<Int, A>

yi: Will this works? I saw no compiler error, but the test case will failed for set and read the field of struct’s map

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I haven't tried it, I will.  you must set your map value to emptyMap() if there is nothing to store. did you do? (reply to 8999)

yi: I have set the map with value inside function, so it’s not an empty map (reply to 9001)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Please share method for creating A and F so I can reproduce problem (reply to 9002)

yi: Struct A {   c: map<Int, Int> }  contract C{   f: map<Int, A>   initC: map<Int, Int>  receive…{   self.f.set(2,   A {     c: self.initC   } }  get fun getFun…{   let b: A = self.f.get(2)!!;   return b.c.get(…)!!; }   }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm not sure if this is same as you did, but you need to load storage before read data and you must sure loaded data is not empty let map: <Int, Int> = b.c; if(map.get(..) != null) {     return map.get(..)!!; } but I will try it soon (reply to 9004)

Marmion Robillard: If you're interested in a real way to generate daily profits through Crypto no risk involved, send me a message now for guide on how this works.

Behrang: Read the current last block of masterchain and use that. (reply to 8978)

Mario: with @tonconnect/ui-react and using TonConnectUI#sendTransaction I receive a "boc" string as a result. What am I supposed to do with that? I want to get a tx hash and check the blockchain whether the tx has been processed. How can I do that?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: struct A {     b: map<Int, Int>; }  contract Test with Deployable {     b: map<Int, Int>;     c: map<Int, A>;      init() {         self.b.set(1, 11);         self.b.set(2, 22);          self.c.set(1, A { b: self.b });     }      get fun valueC1(): A {         return self.c.get(1)!!;     }      get fun valueB1(): Int? {         let a: A = self.c.get(1)!!;         if(a.b.get(1) != null){             return a.b.get(1)!!;         }         return null;     }      get fun mapB(): map<Int, Int> {         let a: A = self.c.get(1)!!;         return a.b;     } } everything works as expected, you need to review your code or share it then we can help you to debug (reply to 9004)

Mario: I found this on tonconnect sdk docs: try {     const result = await tonConnectUI.sendTransaction(transaction);      // you can use signed boc to find the transaction      const someTxData = await myAppExplorerService.getTransaction(result.boc);     alert('Transaction was sent successfully', someTxData); } catch (e) {     console.error(e); }  but it's not explained what myAppExplorerService is (reply to 9017)

yi: @hitasp can you try to change c's map to <Address, A>? there will be an error import "@stdlib/deploy"; struct A {     b: map<Int, Int>; }  contract Test with Deployable {     b: map<Int, Int>;     c: map<Address, A>;      init() {         self.b.set(1, 11);         self.b.set(2, 22);          self.c.set(sender(), A { b: self.b });     }      get fun valueC1(): A {         return self.c.get(sender())!!;     }      get fun valueB1(): Int? {         let a: A = self.c.get(sender())!!;         if(a.b.get(1) != null){             return a.b.get(1)!!;         }         return null;     }      get fun mapB(): map<Int, Int> {         let a: A = self.c.get(sender())!!;         return a.b;     }     receive("e") {         let ctx: Context = context(); // get sender Info         let sender: Address = ctx.sender;          self.b.set(1, 22);          self.c.set(sender, A { b: self.b });     } }   test.ts import { toNano } from "ton"; import { ContractSystem } from "@tact-lang/emulator"; import { Test } from "./output/sample_Test";   (async () => {    let system = await ContractSystem.create();   let owner = system.treasure("owner");   let contract = system.open(await Test.fromInit());    await contract.send(owner, { value: toNano(1) }, "e");   await system.run();   const b = await contract.getValueB1();   console.log('b', b) })() (reply to 9019)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If your test content is this, your error is due to not deploying the contract before test (reply to 9024)

yi: but the error is like this

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes#standard-exit-codes (reply to 9026)

yi: And if I not change the test case just run it with following tact code which can get correct result

yi: import "@stdlib/deploy"; struct A {     b: map<Int, Int>; }  contract Test with Deployable {     b: map<Int, Int>;     c: map<Int, A>;      init() {         self.b.set(1, 11);         self.b.set(2, 22);          self.c.set(1, A { b: self.b });     }      get fun valueC1(): A {         return self.c.get(1)!!;     }      get fun valueB1(): Int? {         let a: A = self.c.get(1)!!;         if(a.b.get(1) != null){             return a.b.get(1)!!;         }         return null;     }      get fun mapB(): map<Int, Int> {         let a: A = self.c.get(1)!!;         return a.b;     }     receive("e") {         let ctx: Context = context(); // get sender Info         let sender: Address = ctx.sender;          self.b.set(1, 22);          self.c.set(1, A { b: self.b });     } }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you can't use sender() in getters, so you need to pass deployer address to your getter (reply to 9028)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: get fun valueC1(sender: Address): A {         return self.c.get(sender)!!;     }      get fun valueB1(sender: Address): Int? {         let a: A = self.c.get(sender)!!;         if(a.b.get(1) != null){             return a.b.get(1)!!;         }         return null;     }      get fun mapB(sender: Address): map<Int, Int> {         let a: A = self.c.get(sender)!!;         return a.b;     }  test let mapA = await test.getValueC1(deployer.address); let mapB = await test.getMapB(deployer.address); (reply to 9028)

yi: Thanks Hitasp! that's the answer. (reply to 9032)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: context() is null when you call an getter, take a note for the future (reply to 9034)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: export const getTxHash = (   tx: SendTransactionResponse,   encoding: BufferEncoding = 'base64', ): string => {   return Cell.fromBoc(Buffer.from(tx.boc, 'base64'))[0].hash().toString(encoding); };  usage: const tx = await connector.sendTransaction({ your transaction body });  const txHash = getTxHash(tx); (reply to 9020)

Mario: Ok thx! Will be looking into how check tx status. It feels like there's a considerable delay when using APIs. I assume there's a delay from the indexer? How do I know if the API already indexed up until a specific block height? The idea is that I want to update my UI and do a refetch once I know that it has been indexed (reply to 9036)

— 2023-10-28 —

A: Bruh you are already poor stop wasting your time in internet scams and get a job (reply to 9067)

Howard: how to print this (reply to 9026)

yi: You can try the test case that I provided above (reply to 9070)

yi: Do you know how to print dump message using ton emulator? (reply to 9070)

Howard: need to check again (reply to 9074)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: contract Example {     adress: Adress; }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: not for tact, let me check with func contract Example {     adress: Adress; }  same 😢 (reply to 9096)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Hahah, well, lets use rust (reply to 9097)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: contract Example {     adress: Adress; }

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: Ok, rust seams fine (reply to 9099)

𝕰𝖉𝖚𝖆𝖗𝖉𝖔: cpp may also work

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you know, we can verify that in our save massege 🫠 to prevent spam

— 2023-10-29 —

Howard: good question.   DM you. (reply to 7993)

Maxey: https://www.youtube.com/watch?v=z-utWdvz58k  This link will take you to Ton Dynasty's instructional videos for the Tact Challenge Task4. 🎉  Developers who are interested can come and take a look. 👀 We will be uploading videos for Task 3 and Task 5 shortly. If you have any questions, please feel free to discuss them with us! 🙌

Grit: Hey Guys

pizza-777: How to use checkSignature function?

pizza-777: Can I sign data with smart contract or only check?

Sentiar: Hi, how can I convert string representation of address to Address type in tact?

sd: address() https://tact-by-example.org/02-addresses (reply to 9129)

Sentiar: address() can take constant string as parameter, (reply to 9130)

sd: change string to address (reply to 9132)

Sentiar: if i do so, then i face another error. I need to call my getter from react using ton-core. And i get error of exit_code 7(which is invalid type check) (reply to 9134)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Address.parse(string) (reply to 9135)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm not sure where you get that string address, seems you are using 'Sender', are you sending 'sender.Address' truly?  Please share the react part to better understanding the problem (reply to 9135)

Sentiar: well, ive resolved the issue like this

— 2023-10-30 —

Howard: ✉️

Grit: Hey, people! When Tact Challenge prizes are going to be distributed?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: One week after publishing accepted submissions, not published yet (reply to 9185)

Grit: oh, I thought they meant one week for everything... ok (reply to 9186)

— 2023-10-31 —

yi: Do tact’s map has (for of) to iterate all the map items?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: No, I hope they add this for now, you can use an indexer for it. if your key has Int type you can do it via `next_item_index: Int` or even for a cyclical array if your key has Address type you should use extra map as indexer key_store: map<Int, Address> (reply to 9202)

yi: import { Dictionary } from 'ton-core'; const userAddressMap = new Map() as unknown as Dictionary<bigint, Address>;     await contract.send(owner, { value: toNano(1) }, {       $$type: "Users",       userAddressMap: userAddressMap,       totalUserCount: 2n     });

yi: I tried to pass map as a parameter in to the receive function, but there was a TypeError: dict.store is not a function do you know why? (reply to 9204)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: is it a ts wrapper code? share the receiver code too (reply to 9205)

yi: message Users {     userAddressMap: map<Int, Address>;      totalUserCount: Int; }       receive(msg: Users){         let i: Int = 0;         while (i < msg.totalUserCount) {             let userAddress: Address = msg.userAddressMap.get(i)!!;      dump(userAddress);             i = i + 1;         }     }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: thanks, problem is your dict constant, use this and let me know the result const userAddressMap = Dictionary.empty<bigint, Address>(); (reply to 9207)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: and use this for seeding your map const userAddressMap = Dictionary.empty<bigint, Address>().set(1n, userAddress); (reply to 9209)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: @expectfun (reply to 9211)

yi: no error now, but the userAddress seems not received by the function   tact tests: map<Address, Int>;  receive(msg: Users){         let i: Int = 0;         while (i < msg.totalUserCount) {             let userAddress: Address = msg.userAddressMap.get(i)!!;             self.tests.set(userAddress, 132123);             i = i + 1;         }     }      get fun valueAa(user: Address): Int {         if(self.tests.get(user) == null) {             return 222;         }         return self.tests.get(user)!!;     }   test.ts      const userAddressMap = Dictionary.empty<bigint, Address>()     userAddressMap.set(0n, owner.address);     await contract.send(owner, { value: toNano(1) }, {       $$type: "Users",       userAddressMap: userAddressMap,       totalUserCount: 2n     });     await system.run();      const aa = await contract.getValueAa(owner.address);     console.log('aa', aa) (reply to 9212)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I need to make sure this is exactly your code, if it is, you have 1 item in your map but you asked to re-set 3 items in the local map tests, so try this: tests: map<Address, Int>;  receive(msg: Users){         let i: Int = 0;         repeat (msg.totalUserCount) {             let userAddress: Address = msg.userAddressMap.get(i)!!;             self.tests.set(userAddress, 132123);             i = i + 1;         }     }      get fun valueAa(user: Address): Int {         if(self.tests.get(user) == null) {             return 222;         }         return self.tests.get(user)!!;     } and test:     const userAddressMap = Dictionary.empty<bigint, Address>();     userAddressMap.set(0n, owner.address);     await contract.send(owner, { value: toNano(1) }, {       $$type: "Users",       userAddressMap: userAddressMap,       totalUserCount: 1n     });     await system.run();      const aa = await contract.getValueAa(owner.address);     console.log('aa', aa) (reply to 9215)

Dmitry | backend4you.ton: /report (reply to 9217)

yi: thanks Hitasp it works. But still wonder why resetting three times for the items in the local map results in an empty value for the item (reply to 9216)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: good question, because you had an force load for item that doesn't exist so you had error in process: let userAddress: Address = msg.userAddressMap.get(i)!!; I have an suggestion for you same as Tact's docs, use a checker before reading data from maps: if(msg.userAddressMap.get(i) != null) {     let userAddress: Address = msg.userAddressMap.get(i)!!;     self.tests.set(userAddress, 132123); } you are forcing map reader via !! that mean you are ensure map has value at this key, avoid that (reply to 9222)

yi: Did this throw an error and cause the entire while condition to revert, even though the first one successfully set the value?" (reply to 9223)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: This is related to the life cycle of transactions in the TVM . My English is not well to explain this to you 🫠, refer to the TVM documentations (reply to 9224)

yi: Got it, thanks Hitasp!

Dawit: 106, 529 TPS WOW

Максим: Hi everyone! Is there any way to send an http request to my off-chain backend API or do I need to send a request to the TON API to get data from my contract getters?

— 2023-11-01 —

Howard: getter method, can check the https://tact-by-example.org/03-getters and https://github.com/howardpen9/nft-template-in-tact/blob/tutorial/sources/contract.read.ts (reply to 9250)

Максим: Thank you! (reply to 9288)

Aydin: Hi all. Where can I find the list of Tact error codes? Couldn't find them by myself.  (By codes, I mean the int arguments inside the throw() method.)  Are they the same as TVM exit codes, or are they different?

Howard: in your output folder (reply to 9290)

— 2023-11-02 —

Aydin: @alefman, I have sent you a question regarding Tact error codes in your Tutorial Lesson 4. Could you check your pv, please? Thanks

Alex: Hi all, I am working on liquid staking  in ton network. There are problems in my deploy script.  And everything is the same everywhere, because if there is a problem in the smart contract, it will be visible in the test. Only the deploy script is error. , someone who can help me please DM)

— 2023-11-03 —

User<1658592266>: Please help me understand.  I issued tokens of my project in TON, how can I now make wrapped tokens on the Ethereum network?  TON BRIDGE does not perform the transfer. What do I need to do to implement this?

Howard: Don't forget that I had open-source the FriendTech implementation in Tact!   https://github.com/howardpen9/FriendTech_in_Tact  Feel free to leave the feedback and ideas.

Howard: bridge.ton.org supposedly support any token to ERC20 automatically. (reply to 9371)

Howard: or testnet: https://bridge.ton.org/?testnet=true

User<1658592266>: This tool is doesn't work 😳 (reply to 9383)

Howard: what is the error you got

DEXTON - DeFi экосистема блокчейна TON: Has anyone ever tried to do this with tokens?

User<1658592266>: Nothing happens when i click submit. (reply to 9386)

Mikhail: Hello everyone, how can i check if child contract exists with stateInit?

tyulpan: Get the contract address of instance using contractAddress and compare it with null. (reply to 9393)

Mikhail: thanks!

Mikhail: but then, what will happend here?  let init: StateInit = initOf TodoChild(self.numChildren);         send(SendParameters{             to: contractAddress(init),             value: ton("0.1"),              // pay for message, the deployment and give some TON for storage             mode: SendIgnoreErrors,             code: init.code,                // attaching the state init will cause the message to deploy             data: init.data,             body: "identify".asComment()    // we must piggyback the deployment on another message         });  is sending mesage to a null address with init data & code deploys a contract? (reply to 9394)

Maxey: I don't think it can have a null address when you use initOf🤔

tyulpan: I would send a message after verification. let init: StateInit = initOf TodoChild(self.numChildren); if (contractAddress(init) != null) {    send(SendParameters {    ... } (reply to 9396)

Mikhail: this is example from  https://tact-by-example.org/06-authenticating-children (reply to 9398)

Mikhail: me too, thats the point of my question, cannot really understand how can i check is contract already deployed (reply to 9397)

Maxey: You can check that by writing test (reply to 9400)

Maxey: https://github.com/Ton-Dynasty/tondynasty-contracts/blob/51e162a31c6fc9bc75ed1d6a0ddcc7309a83e0c7/tests/NFTEnforceRoyalty/NFTEnforceAuction.spec.ts#L119C9-L126C12

Mikhail: i need to check it in contract code (reply to 9404)

Maxey: Why do you have to check that in contract code

Mikhail: cause i need to have contract with unique ID in it and, of course i need to check if i am not trying to make some changes in contract, that was not deployed previously in function that basically deploys it (reply to 9406)

tyulpan: Maybe you need a pool of created contracts then? *if I understood the problem correctly (reply to 9410)

Maxey: You use initOf to deploy a child contract, which means you have the code for the child contract, allowing for successful deployment. However, if you need to verify whether the child contract has been deployed previously, you could use a map <>.

Mikhail: there may be like 10000+ contracts i want to deploy, i am using child contracts deploy method to store big amount of data  The most show-case example is NFT standart, where each NFT item has it's own address. Then how can i know if NFTItem already been minted? (reply to 9411)

Mikhail: but then how can i shard it if i'll have really big amounts of data (ex. 90000+ NFT's) this will cost lots of gas to just check if contract was deployed (reply to 9412)

Maxey: or you can send a msg to child contract and child contract will send msg back to you and  tell you is deployed or not

Mikhail: if you send messages to any contract, you need to have initState of a contract, and if you'll send a message to a contract it will automatically deployed to a chain (reply to 9415)

Yash: Can anyone help me with the NFT contract?

Yash: We are required to pass on the collection_content as Cell in constructor. But we wish to simply pass on IPFS string as argument and then build Cell in contract so that we can pass on simple arguments.

Yash: I tried to do some stuff and I think it worked

Maxey: You only  have to  use child's address and you can send a msg to it. It won't deploy a contract if you you don't use init and data when you send a msg (reply to 9416)

Yash: Yash Garg: init(         owner: Address,          ipfs_url: String,          royalty_params: RoyaltyParams     ){         let string1: StringBuilder = beginString();         string1.append(ipfs_url);         let stringCell: Cell = string1.toCell();         self.owner = owner;         self.collection_content = beginCell().storeInt(0x01, 8).storeRef(stringCell).endCell();         self.royalty_params = royalty_params;         self.owner = sender();     }  I updated to this code and the contract deployed successfully and even the nft item  But I am not able to check that nft on getgems  this was the deployed nft collection address  https://testnet.tonscan.org/address/EQCCpCthkU22GKuEoXkcD3XMuSze6jowy46U-3FRPrLwsstO  It is saying that this address is not an nft

Yash: https://github.com/yash0501/nft_contracts_tact/tree/main/contracts  We used these contract to deploy nft and made the above change in the init function

🅰🅻🅰🅽: If your nft index is serial numbers, then you can simply to compare the current index with the incoming one, in order to check whether the child contract (nft item) is deployed.  Since nft item init state may only related to collection address and index (depends on your usecase), therefore you can calculate their address by initOf. (reply to 9416)

Mikhail: this wont work if you mint nft's not by serial number but in random order (reply to 9423)

🅰🅻🅰🅽: Oh I see. in your case, the index is not a sequence of numbers

🅰🅻🅰🅽: And now you want to check that nft item with random index is deployed or not

🅰🅻🅰🅽: Am I understanding correctly?

Mikhail: not really nft, any contract but yes

🅰🅻🅰🅽: Oh, you mean you’re interacting with other contract, but you are not sure if the contract is deployed

🅰🅻🅰🅽: As far as I know, there is no way to check an arbitrary address is deployed. An alternative is to send a bounceable message and receive the bounced message if the receiver contract  does not exist.

Mikhail: do you know any examples of this i can check? (reply to 9430)

🅰🅻🅰🅽: This answer is based on my experience, but I will search it with you. Wait for me to check several documents.

Maxey: I think this only way to do it too (reply to 9415)

🅰🅻🅰🅽: This section implies that a contract call expected to bounce back if the target contract does not exist.  https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages

Mikhail: receive("greet 3") {         let i: Int = 0;         repeat (3) {             i = i + 1;             let init: StateInit = initOf TodoChild(i);             send(SendParameters{                 to: contractAddress(init),                 body: HiFromParent{greeting: "darling"}.toCell(),                 value: ton("0.1"),              // pay for message and potential deployment                 mode: SendIgnoreErrors,                 code: init.code,                // if child is not deployed, also deploy it                 data: init.data             });         }     }  Maybe not the worst solution is not to send "code" field, so contract won't be deployed?

Mikhail: and change mode from SendIgnorError to some other, so the method will be reverted?

🅰🅻🅰🅽: As long as you have the initCode, you can deploy a contract if it does not exist. And you can use contractAddress(init) == null to know the contract is deployed or not (not pretty sure. Based on my impression, it can be done like this.) (reply to 9437)

🅰🅻🅰🅽: The term 'SendIgnoreError' indicates that regardless of any errors occurring during the 'action phase,' the message will still be sent to the destination.

Максим: Hi. Is there any way to convert Address to String? I wanna send child contract address to the sender as comment

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: address.toString() (reply to 9445)

Mittho: Hi

— 2023-11-04 —

Howard: yeh, if you have send with data and code from StateInit (reply to 9396)

Howard: why don't you check our template in NFT otherwise? (reply to 9422)

Howard: yeh, using bounce method might be ok in this example. (reply to 9430)

Howard: How can we rounded a number in Tact?   Or maybe import the FunC function to do that?

nonam3e: using native functions (reply to 9475)

— 2023-11-05 —

Howard:         self.publicKey = beginCell().storeAddress(owner).endCell().asSlice().hash();          self.publicKey = sha256(owner.asSlice());  Both are ok in Tact.

Dmitry | backend4you.ton: But this is not equal to public key of wallet (reply to 9505)

Howard: Yeh. I am still trying more potential use case for this maybe 🤣 (reply to 9506)

Dmitry | backend4you.ton: If you don’t care about mainnet/basenet - you may use tact winners approach (skip 11 bits and read uint as “pure” address value) (reply to 9508)

fabriregu: hello everyone, i have some questions about NFTs.  in Ton Blockchain there is one contract for the Collection and one contract for each Nfts. We need to pay each year a fee for storage.  The fee is only for the collection contract or for the nft contract too? how can i prevent that my collection/nft disappear because of i forget to pay the fee?

fabriregu: i'm working on this repo https://github.com/getgems-community-tact/nft-template-in-tact to study Nfts contract.  is there any youtube video that explain this contract? because the tests in this repo are checking only the minting of the Nft. I would like to know if there is a test suite that checks the transactions and balances of deployer, collectionContract, nftContract, user before and after Minting /Tranfer in order to better understand the money flow between all the actors.

Alex: https://www.youtube.com/watch?v=US0ln30Tf0s&ab_channel=AlefmanVladimir%5BEN%5D (reply to 9514)

fabriregu: thank you @alexgton

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: For every contract on the network, apart from the code content, you have to pay a storage fee based on the amount of memory used (reply to 9513)

fabriregu: ok thank you And do you know how can i prevent that my collection/nft disappear because of i forget to pay the fee?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: send some $TON to your contract address, I think 0.1 is enough you can use this formula to calculate it: https://docs.ton.org/develop/smart-contracts/fees#storage-fee (reply to 9518)

Howard: why skip 11 bits? Because different of workchain might changed? flag etc (reply to 9509)

nonam3e: addr_std$10 anycast:(Maybe Anycast)     workchain_id:int8 address:bits256  = MsgAddressInt; so addr length = 2 + 1 + 8 + 256 = 267, and to obtain the hash part you should skip 2+1+8 = 11 bits (reply to 9520)

Sergey: guys, check you my TWA+TON app: https://ton.app/gambling/spend-a-ton?id=1320

— 2023-11-06 —

Truong: hello guys, how can i transfer jetton of sender from smart contract in Tact, tks

Howard: https://github.com/howardpen9/jetton-implementation-in-tact (reply to 9557)

Truong: My idea is to write a function that allows users to deposit any jetton tokens into a smart contract, but I don't know how to use the transfer function to move tokens from the user to the smart contract's wallet. (reply to 9558)

Railgun: sendMessage to the token contract to transfer. Think the contract as a service that listen to requests (reply to 9562)

Truong: can my contract use transfer token like transferFrom in EVM, because user call function deposit in my contract then contract call transfer token (reply to 9563)

Fingunt: How can I start working with TON?

Slava: ton.org/dev (reply to 9576)

Slava: If you're talking about finding a job, then you should go to ton.org/jobs (reply to 9576)

Mikhail: let hasRole: Bool? = binding.roles.get(needed);  rror: undefined function __tact_dict_get_int_int, defining a global function of unknown type       int $hasRole = __tact_dict_get_int_int($binding'roles, 256, $needed, 1);

Mikhail: Any suggestions?

Mikhail: full code:  struct RoleData {     roles: map<Int as uint256, Bool>; }  fun has_role(addr: Address, needed: Int) {         let data: RoleData? = self.roles.get(context().sender);         require(data != null, "Role Not Set");         let binding: RoleData = data!!;         let hasRole: Bool? = binding.roles.get(needed);         // require(hasRole != null, "Wrong role");         // let bind2: Bool = hasRole!!;         // require(bind2 == true, "Wrong role");     }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Your tact fun is void but you are used it as a map type (reply to 9594)

Mikhail: nope, it's all working if you'll change the map structure to <Int, Bool> (reply to 9595)

Mikhail: funny shit

User<6777981734>: 6

🅰🅻🅰🅽: This is sooooo weird, anyway (reply to 9596)

🅰🅻🅰🅽: map<Int as uint256, Bool> is currently not supported

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: fun has_role(addr: Address, needed: Int) : RoleData? {         require(self.roles.get(addr) != null, "Role Not Set");         return self.roles.get(addr)!!;     } try this and ensure you are not using context() in an get (getters) method (reply to 9596)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: default value for bool type is false, he thinks that false is returned by the contract, that code has more than one problem (reply to 9602)

Andrey: Hi all How can I set addr_none for the collection_address parameter in tact ?  NftData {              is_initialized: self.is_initialized,             index: self.item_index,             collection_address: ???,             owner_address: self.owner_address,             individual_content: self.item_content         }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If is nullable type  collection_address: Address? = null; (reply to 9616)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If is collection contract of nft standard  collection_address: myAddress() (reply to 9618)

Andrey: If I pass collection_address: null in the parameter, then my smart contract is not displayed as nft_item  Smart contract with collection_address: null https://testnet.tonviewer.com/EQAZx9Q7GuvK9FqAtARgUqSEPyXrRREkTRgr0q6CaAXqhxGl  The same smart contract but with collection_address: self.owner_address https://testnet.tonviewer.com/kQDR5zdaOSwoSFQ-ad4MwRvks4lRQPGrDlK41sPnO2oDCErR (reply to 9618)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Collection_address = owner is valid for single nft item  If it's a collection you should pass collection_address on init. So that always has value (reply to 9621)

Andrey: the goal is to create collection-less nfts and so that they are identified as nft_item (reply to 9623)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: So, self.owner is your collection address (reply to 9624)

Andrey: Here is an example of a smart contract where collection_address is not set. When I try to set collection_address: null for some reason it doesn't show up as nft_item. https://testnet.tonviewer.com/kQB1_LlEVGp5yYFfL6XHYCqIp8m-FF7b3waonRLDrSHbiZYV (reply to 9625)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You can use cell builder and pass emptySlice as collection address (reply to 9627)

Andrey: I tried but it still doesn't help (reply to 9628)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You must follow standards to show up as nft in scanners/marketplaces   And this is not standard  https://t.me/tactlang/9630 (reply to 9626)

Andrey: What exactly is not standard here? (reply to 9631)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Return a cell and use cell builder  let data: Cell = beginCell()     .storeUint(...)     .storeUint(...)     .storeSlice(...)     .storeSlice(emptySlice())     .storeRef(...)     .endCell() return data;  or send the owner address and don't care about how is look like in explorer (reply to 9632)

Ahmet Said: when we gonna get finalized info for Tact contest?

Luis Daniel ,Ⓜ️ MEMES▪️🐾: When is payment for the tact contest made?

— 2023-11-07 —

Carlos: Hello, how can I contact support? My friends got paid and I went to check the scoreboard and saw that I was removed from the scoreboard.

Ahmet Said: i received the payment but its extremely low 36 ton and my pos in leaderboard is 67 why ???

User<5793713516>: Thanks for the ton tact challenge I have received my reward 🤩

Dudi Hivera: 11

— 2023-11-08 —

Howard: Any example code using nativeReserve?   Wanna check the usages and gas cost.

sd: Task 5 from Tact Challenge (reply to 9703)

🅰🅻🅰🅽: In tact challenge #5, i have tried nativeReserve to preserve exactly 2 Ton. However, it is equivalant to sending a message attached with 2 TON to ourselves, thus it is more expensive than just dwindle 2 ton from ctx.value (they have some tolerance of the test, so this way is feasible to pass the challenge). You may uncomment this line to check the gas usage.  https://github.com/alan890104/tact-challenge/blob/130628a8b2011401df3efba7d0058b576184786b/contracts/5.tact#L116

Howard: This is awesome! 👍 (reply to 9705)

&rey: This is actually surprising. What are the gas levels, then? (reply to 9705)

🅰🅻🅰🅽: I have just tested by a simple contract, which contains two receive functions with almost identical logic (target: to preserve about 1 TON in our contract), but the only difference is nativeReserve and deduct it from context directly.   In summary, native reserve costs 0.0127 gas unit, whereas deduct method costs  0.012215.   Thus, native reserve is a bit more expensive but more accurate. (native reserve exactly remain 1 TON in contract, but meanwhile dedeuct method will remain about 0.991 in the contract)  https://github.com/alan890104/tact-nativereserve-gas

nonam3e: Yeap, according to documentation RAWRESERVE costs 526 gas (reply to 9713)

🅰🅻🅰🅽: The above repo is a better way to prove my experience (reply to 9706)

Alex: Hi , i put a wrong wallet in Tact challenge and i dident get my money, now i changed it to a valid one and now they dont send it , what can i do ?

— 2023-11-09 —

yi: const deploy_wallet = WalletContractV4.create({ workchain: 0, publicKey }); const deploy_wallet_contract = client.open(deploy_wallet); await deploy_wallet_contract.sendTransfer({...  Can we track the sendTransfer status something like below? Or how to track the transaction status? deployedContract.methods.transfer(transfer_to, transfer_value,).send({from: web3.eth.accounts[0], gas: 200000})    on('transactionHash', function(hash){         console.log("transactionHash: "+transactionHash);     })     .on('confirmation', function(1, receipt){         console.log("Transaction confirmed");     })     .on('error', console.error);

Howard: oh no.....💀 Need to track the address and more bits that I put in. (reply to 8186)

Vlad: Impossible (reply to 9770)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Is it text message?  Bounced text messages are not supported yet. https://docs.tact-lang.org/language/guides/bounced#bounced-messages-in-tact (reply to 8185)

Maxey: The equation will result in 1004774287000 / 4800000000 = 209.32797, but because the return type is an integer, it turns into 209. Is there a way to keep the decimal digits? The unit is tons, and it's used for sending money to others, so it needs to be precise.

Maxey: I tried multiplying by 1000000000 and then dividing by 1000000000, but the result is still the same.

Kilyandra: of course 209 * 1000000000 / 1000000000 = 209 (reply to 9803)

Kilyandra: if you using nanotons in your calculations, try 1004774287000 * 1000000000 / 4800000000

Maxey: I did this because the TACT challenge also does it in the same way.  Example formula for aAmountToSend in B->A swap will be   (amountOfJettonAOnContract * decimal / amountOfJettonBOnContract) * amountOfTokenBToSwap / decimal

Maxey: When I want to transfer money, is there a way to convert its unit back to tons? (reply to 9805)

Пескарь™ | фронтент телефонов: value in SendParameters takes nanotons (reply to 9807)

Maxey: Thanks! Problem solved!

— 2023-11-10 —

🕷: Hi i need ru chat dev

Mikhail: https://t.me/tactlang_ru (reply to 9826)

Daniil: why is the +1 message sending mode called "SendPayGasSeparately" in Tact? even though it's about Forward fees, not Gas fees.

— 2023-11-11 —

Good: Hi. I have 3 contract. This scheme: // contract_first.tact (140 lines) ContractFirst {} ----------------------- // contract_second.tact (260 lines) ContractSecond {} ----------------------- // contract_third.tact (280 lines) import "./contract_first"; import "./contract_second"; ContractThird {}  The first and second are deployed easy,  but I have difficulties trying to deploy the third. All builds are ok, all local tests are ok. Why could this be and how can I fix it?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Why you need to import first & second in the third? (reply to 9871)

User<796481024>: You may try to add .tact extension for your imports

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: What if the compilation/build is already successful? (reply to 9874)

User<796481024>: No idea 😅

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If you have stateInit of the first and second with same init params as your deploy in your third contract so why you need to deploy them manually? You have to seed contracts with unique data to avoid any address conflicts (reply to 9871)

Maxey: https://www.youtube.com/watch?v=6CJTZK07rZE This link will take you to Ton Dynasty's instructional videos for the Tact Challenge Task3. 🎉  Developers who are interested can come and take a look. 👀 We will be uploading videos for Task 5 shortly. If you have any questions, please feel free to discuss them with us! 🙌

— 2023-11-13 —

Denis: hey guys, a stupid question.. is there any approach to read data from subcontracts for free (from main contract)? Or I should call "SendParameters" all the time to get the data from child contract?

Aydin: Hi. As far as I know, the only way for different contracts to communicate with each other is to send messages which costs gas anyway. Unless more experienced devs know a better option... (reply to 9971)

Denis: I also think so based on examples. My Idea: I'm going to implement NFT collection (main contract) and keep some data on NFT (subcontract) and I need validate unique data along all NFT contracts (reply to 9972)

Denis: ok, I will try to implement this validation based on messages ... thanks...

Denis: or maybe it's a stupid idea and I need to keep all necessary data on NFT collection (main contract). because I won't be able to maintain integrity in this multithreading.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: What you mean by "validation"? You have to pass unique content on init, index, owner, collection address and the content Did you mean you need to validate item content? What's the usage? (reply to 9974)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: To be ensure next item has unique data? So you have to handle this at generating in collection, review the code

Denis: I can give u a simple example. I would like to create plenty of NFT with unique string inside. but before creating a new NFT I'm going to check this string from all NFTs I created before. (reply to 9976)

Denis: and I have 2 ways of doing it. to keep all the array of these strings on collection contract (main contract) or use plenty of messages to my child NFT which should return me this string.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: So if your collection has more than 1000 item did you want to pay 3 transactions fee to knowing what you created before? 3000 transaction just for minting an nft? 😖🤯 You really need to review it (reply to 9979)

Denis: yes. maybe I need to keep this data in main collection.. (reply to 9980)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Better solution but still dirty (reply to 9981)

Denis: do we have something else? (reply to 9982)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Maybe, it's related to data type of the content  For example you have time which is unique, use it if possible (reply to 9983)

Denis: is it better to use "get" from the map then loop? (reply to 9984)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: In client side or on chain? So you have to pay storage fee (reply to 9985)

Denis: in chain (reply to 9986)

Denis: i'm going to keep 2,073,600 unique items

Denis: and before adding a new one I have to be sure that this item doesn't exist

Denis: and my idea was to keep it on NFT contracts.. not to pay fee myself for that

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: cool, so you have to pay 312000 TON per year for storage.  From the validator community, thank you hero (reply to 9988)

Denis: for 2 073 600 items in a map?? (reply to 9991)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: only for the item cell content which you want to kept in a map (reply to 9992)

Denis: I would prefer to keep it on people's NFT but I can't provide integrity ...

Denis: I need to think about this.. thank u so much!

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you have to pay 3 transaction fee per term!!!!!! then you have to pay this 312000TON per mint. not per year  Collection -> Item -> Collection (reply to 9994)

Denis: yes I understood , both ways are shit :) (reply to 9996)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if it's a opensource project share me the link, I'm interested to finding solutions (reply to 9997)

Denis: not yet but I came up with another solution. I can hardcored this  string in a constructor of contract .. and check if contract exist (reply to 9998)

Denis: not going to use the map anymore anywhere and keep this string inside a NFT

Denis: thank u guys for these explanations

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you have the time() which is unique, use it in your string builder and redesign your algorithm to works on time good luck (reply to 10000)

fabriregu: hello, i'm using locally the tool https://github.com/tondiamonds/ton-nft-deployer and when i press Start Deploy after the start log i get this [Deployer] deployNft error Error: http provider parse response error  what does it mean? how can i fix?

Dmitry | backend4you.ton: And two more ways: * use values that can never happen to repeat, like sha256 over incrementing index * use external (offchain) storage (reply to 9979)

Denis: oh.. what is "external (offchain) storage"..? (reply to 10009)

Denis: how can I use it from contract?

Dmitry | backend4you.ton: some backend with sql database and unique index. you can't call it from contract, but can call it prior to calling contract from frontend (reply to 10010)

Denis: no. It is not safe. Someone can call my contract without frontend.. and cheat.. (reply to 10012)

Dmitry | backend4you.ton: Backend can give some “signature” with his answer and contract can check this sig (reply to 10013)

Denis: do we have some existing implementations on tact? (reply to 10014)

Denis: people can disassemble my contract and to know my signature

Dmitry | backend4you.ton: For backend? No ) For sig verification? Every wallet do it (checking incoming external msg), so it’s first-class task in TON, but have no direct tact link for now (reply to 10015)

Dmitry | backend4you.ton: Nope. Contract will hold only public key to check sig, not the private one to make it (reply to 10016)

Denis: sounds interesting for big projects. (reply to 10018)

Denis: would be interesting to see some more info about this.. (reply to 10018)

Dmitry | backend4you.ton: It may or may not be suitable for particular project, my point was to show that you have more than just two options.  Если вас съели - у вас есть как минимум два выхода :) (reply to 10019)

Dmitry | backend4you.ton: https://docs.tact-lang.org/language/ref/math#checksignature start here (reply to 10020)

Denis: oh.. thank u very much! that's a really nice think to know (reply to 10022)

Denis: guys how can I check the status of contract? if it active and exist?   by contractAddress or StateInit ?

Denis: inside the chain of course

Denis: oh just don't tell me that's also impossible :(

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You need learn more about blockchains and the distributed systems (reply to 10029)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Did you want to mint your collection from marketplace? Or it's a private? I mean you can use an deployer script to deploy them with single command off chain with all requirements (reply to 10027)

Denis: yes It's the only way to do that (reply to 10031)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Only way based on details you shared, yes (reply to 10032)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I can't understand that type of your +2 million contents which you said are strings 🤯 Maybe you had more solutions but we needs more details

— 2023-11-15 —

Psycho: Hi, is there an example implementation of walletV4?

Psycho: And plugin (reply to 10083)

ابو العز: https://kfc168.net/?KFC=688044

ابو العز: Kentucky huge profits

&rey: v5 is very similar to inplug-v1 from https://github.com/ProgramCrafter/wallet-contract. (reply to 10083)

Step: wonder why they did not reward you. (reply to 10090)

&rey: This is a story of the past... I don't support Tonkeeper pushing their own wallet as standard. (reply to 10091)

Sam: hello guys, is tact good for production contracts?

Howard: yes (reply to 10097)

Sam: how do i send events in tact?

Sam: do you know how to send events in tact? (reply to 10098)

Sam: guys any example to write events in tact would be nice, and a decoding example would be super nice

Howard: emit  - https://tact-by-example.org/03-emit (reply to 10099)

Sam: thanks man <3

Sam: any example to decode it? (reply to 10109)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: blockchain.track(contract)   In the client (reply to 10111)

Sam: tonweb? (reply to 10114)

Sam: is there a tact example of deploying a nft contract from inside a contract?

Denis: https://github.com/howardpen9/nft-template-in-tact (reply to 10124)

Sam: thanks <3

Mehdi: @zerex , what you think about this solution. You craft your entry contract such that it will receive some parameters and initiate another contract for one nft(this means sharding in smart contract design pattern). Discuss here. https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons  As any sub contract is also a contract and has a unique address , you craft your main contract such that it sends an external message, in this case initial hash or new address .Then your layer 3 app listens for any updates and has arbitrary business logic for any purpose. So two entities are in your hand without needing to touch Blockchain, doing everything you need without any gas . For future reference also you can utilize them . I assume some fundamental concepts of how TVM and Smart contract work are already available in  mind .For clearance I am open discussing more.Maybe I am wrong.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I had discussions with @zerex about the idea he has, this can't help, he must follow the sequency indexes to solve this gas cost problem (reply to 10139)

Mehdi: I respectfully disagree with your viewpoint. My proposed solution leverages an extensive array of entities, addresses, or smart contracts with minimal storage fees. The subcontract in question requires only a small balance for occupation (storage fee), remaining in standby until activated as needed (following the actor model). This design ensures code capability, providing advantages such as extensibility, configurability, and upgradability. The solution is designed for ease of maintenance and facilitates straightforward owner changes for future needs, which are crucial for our specific use case.  I am intrigued by the concept of indexing you mentioned and would appreciate further clarification. I am concerned about the potential overcomplication of our code and whether time-based indexing is necessary, given the inherent collision resistance of these entities. (reply to 10141)

&rey: You can't check whether other contract (which probably is in another shardchain) exists without sending a message. (reply to 9999)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: According to the conversation I had with him in private and the details of the idea, I know that both the time-based solution and your sharding proposal will not help him.   He needs real-time information that can only be provided through the main contract or off-chain at mint.   If I had the opportunity to explain his idea, I am sure that we could benefit from the knowledge of others.  I am still not sure about my solution which I shared with he in DM

&rey: Based on the shards of your idea I've heard here: if items are uniquely identified by their content, you just don't need any checks: second NFT won't get created, as the message will be sent to the same address as the previous one with that content. (reply to 9989)

&rey: You may also make NFT respond to collection whether it existed before or not. (Probably this doesn't need any modifications, since if NFT is initialized it'll likely bounce next init messages).

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: the base idea is editable nft standard, but with 2D index, in 1D index we can check if mint request are grater than last item or even we can store next_index,  but he needs to validate if item with index [n,k] already minted or not, at mint time. after minting was ended their is no need for validating (reply to 10146)

&rey: What should happen if item is already minted? Is it OK to ignore the user's message? (reply to 10147)

Denis: the error should appears :) (reply to 10148)

Denis: because I also get some fee during the minting

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: should thrown (reply to 10148)

&rey: So, 1. You don't need to check if mint request is greater than last item. Just send mint message, that's all. 2. NFT should respond with error if it's already initialized. Bouncing isn't the best solution since it can lose user address (or it could be kept in StateInit, but that should be checked separately). 3. Collection should check for those error responses and return remaining TON to user.

Denis: oh shit.. really I can call the same mint 2 times !! and throw the error if it's already inited @hitasp (reply to 10152)

Denis: and I don't need to check it in collection

Denis: that was easier..

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: so send deployRequest to the item and if already initialed reject request and send tons to the responseAddress, it's awesome (reply to 10152)

Denis: perfect! i'm happy! :) (reply to 10156)

Denis: because it's a problem the guy who wanted the hack my system and he going to pay proceed fees

Denis: @pcrafter thank u for the brainstorm :) really appreciate!

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: throw will returns ton to collection address which is your sender at sending mint request you have to handle this manually by sending string message to user with remaining coins (reply to 10153)

Denis: do we have an example of this on tact? (reply to 10160)

Denis: i'm trying to mint 3 NFT for example and would like to interrupt transaction if even 1 wouldn't be created.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if(self.initialed) {     send(SendParameters{             to: msg.response_address,             value: 0,             mode: SendRemainingValue,             body: "Already minted. Try another index ".asComment()         });     return; } (reply to 10163)

Psycho: Thanks a lot, but I would like to see an implementation in tact language (reply to 10090)

&rey: Tact isn't exactly suitable for creating wallet contracts. And I don't believe it will be in future. (reply to 10166)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: good for homework bad for implementation. Tact is not good for wallet contracts (reply to 10166)

Denis: Am I correctly understand that if I have the error in 1 NFT other 2 will be created? (reply to 10165)

Psycho: Thanks! (reply to 10167)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: it's related to your code!  are you using loops in the client side? or are you want to do it in contract?  require(...) returns throw at false, so if you had throw on contract next will not process (reply to 10169)

Denis: i'm going to use loop when minting NFTs on collection side (contract) (reply to 10171)

Denis: oh and I got rid of "index: Int;" in my GetNftData , and seems to be it's important..

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: ok, by using  https://t.me/tactlang/10165 you can handle error in bulk minting at all, you should use collection_address and item_index as init params of the item nothing else, to avoid conflicts (reply to 10172)

Denis: I wanted to get rid of item_index because it's  not relevant for me (reply to 10174)

Denis: as u remember I'm using x,y instead

Denis: and it's helping me to find the address of contract

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: so that 2D number is your item_index you can name it what you like

Denis: as I can understand it should be Int (reply to 10178)

Denis: struct GetNftData {     is_initialized: Bool;     index: Int;     collection_address: Address;     owner_address: Address;     individual_content: Cell; }

Denis: after I removed that my contract no longer recognizable as an NFT Collection

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: for getting stateInit of your item you need fresh and unique data, that data must be immutable  you can calculate it in your own and also name it what you like.

Denis: initOf NftTonWallPixel(myAddress(), x, y, self.owner, self.collection_content); (reply to 10182)

Denis: unique and working

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: self.owner is collection owner  and the content should be send at initialing  ok, good luck

&rey: Combine with x * height + y. (reply to 10179)

Denis: oh.. really :) u are pretty smart guy :) (reply to 10186)

&rey: A common idea in general programming to avoid 2-dimensional arrays. (reply to 10187)

Denis: i'm not sure it can solve my problem 100% but will try

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you are pretty smart, accept that 🤓 especially for an old man like me 🥸 (reply to 10188)

Denis: guys, don't u know is it possible to mint many NFTs using loop inside the collection? Seems to be not :)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you have limitation per process  ~255 you can try it in limited loops  use 200 round per request (reply to 10192)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is an NFT withdrawal. The contract has 1000 NFT which must be withdraw all items with 1 request. TACT Smart Contracts Challenge Task #5 Line #99 (reply to 10192)

Denis: thanks going to have a look

Howard: https://github.com/howardpen9/tutorial-customized-wallet_tact   External Wallet example in Tact (reply to 10166)

— 2023-11-16 —

Francesco: Hello

Francesco: Why is the chat deleting my messages?

Francesco: Let me retry without showing any code. If I try to assign to a Int variable a value from a map, obtained with get, it tells me that Type mismatch: Int? is not assignable to Int

Francesco: Any idea where can be the error? (unfortunately, if I include the code, TG deletes my message)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Send it as image/screen shot (reply to 10226)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: let a: Int = 0;  if(map.get(key) != null) {     a = map.get(key)!!; } Do you have map<int,int?>? Try this let a: Int = 0;  if(map.get(key) != null) {     a = (map.get(key)!!)!!;     // OR     let b: Int? = map.get(key);     if(b != null) {         // do something     } else {         // do something special      } } (reply to 10225)

Francesco: It worked!!!

Francesco: Thanks so much

Francesco: Is there a way to have the equivalent of this mapping in Solidity? mapping(address => mapping(address => uint256)) public sharesBalance;

Francesco: I mean a nested map

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You have to use typed struct because tact isn't allowing maps as values Follow this discussion  https://t.me/tactlang/9019 (reply to 10232)

Francesco: Thanks. I will

Francesco: I have following the conversation but it looks like a multi-multi structure is not possible.  Let me make an example with pseudocode. Let's say I have 3 addresses:  owner1Address, owner2Address and buyerAddress I would expect that  map[owner1Address][buyerAddress] is different than map[owner2Address][buyerAddress]   The conversation above seems to show that this is not possible. Am I right?

Francesco: I guess I must change the approach, and split the storage among many contracts... I just have to learn how to do so :D

Howard: using "```" to clean up your code block (reply to 10235)

Howard: or using 3rd website to show your code. Would be helpful.

Francesco: If I use "```" TG deletes my message. I don't know why

Francesco: It happens only in this chat

Howard: ummm, maybe you can use https://carbon.now.sh/

Howard: ❓ One question: What is the best way to do the sorting?  I am considering implementing the liquidation feature in TON.   However, a contract in TON shouldn't store all the contract statuses (for example, we usually don't recommend using map<Int, Int> in this manner).  If I store the status in each Balance contract (let's say), then how can we sort all the contract values and select the lowest value from each contract?

Howard: https://github.com/tact-lang/tact/blob/main/examples/wallet.tact  here has one example in Tact btw (reply to 10167)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You can do this via map<Address, Address> I can't see needs for nested map (reply to 10235)

Denis: hey guys. can someone say what is unverified NFT? https://testnet.tonviewer.com/EQCYuJNxzX8eO7PEsTdlzfi8aC2nBNI4IOfGadKHT56vF21v

Denis: will it be verified after a while?

ᗩᗰᏆᑎ: Hi

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: How I can connect with Tact repo organizers?

Denis: the problem was connected with NFT's index .. should be unique but was the same: "0" for 3 items (reply to 10262)

Francesco: I can't because it is a multi-multi relation. Anyway, I am splitting the storage in individual contracts for any sellerAddress and any buyerAddress, following the best practices suggested for TON (reply to 10255)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Make better use of the knowledge of the people available in this group to you. https://t.me/tactlang/10187 (reply to 10274)

— 2023-11-17 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: What is the best way to add nested colons in Tact strings? I'm looking for a way to building json string onchain

— 2023-11-18 —

Howard: Do we have the better way sorting data in the map?   Like this:  https://ethereum.stackexchange.com/questions/1517/sorting-an-array-of-integer-with-ethereum   - Thinking there is the functions from FunC standard library, like Max and Min()

Dmitry | backend4you.ton: You want to sort the map??? But it is always/already sorted, by design. (reply to 10311)

Maxey: I don't know why method2 can compile, but method1 can't. They look the same.

Maxey: The only difference is that I parse with a single line of code versus parsing through a variable.

Howard: put within a () there?

Howard: wait so you mean I can store   map.set(3,6) map.set(1, 3)  map.set(4,6)  the mapping will shows as: (1,3) (3,6) (4,6)  ? (reply to 10317)

Dmitry | backend4you.ton: why not? map is a key -> value. keys are unique, but values may be any (reply to 10328)

Dmitry | backend4you.ton: about showing... it depends how you will traverse the map (may be 4 then 3 then 1). but no matter how you add values - output will always be the same

Dmitry | backend4you.ton: one more "but": map stores key in binary format, so I guess you'll get keys sorted by their binary representation

Howard: this is one special knowledge point. cool. (reply to 10331)

Dmitry | backend4you.ton: it comes from Hashmap TL-B description and serialization example https://docs.ton.org/develop/data-formats/tl-b-types#hashmap (reply to 10332)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: so map.set(3,6) map.set(1,3)   dump(map)  returns  (1,3) (3,6)   ? (reply to 10330)

Dmitry | backend4you.ton: I don’t know. I even don’t know if dump() can dump maps. But map is a dictionary, special structure for storing key-value for fast access by key. So it’s impossible to sort it (whatever order you want) “in place” - you need to copy keys to some other sortable list of values (Tuple?), sort them there and then iterate over sorted list and get corresponding values from original map. (reply to 10335)

Dmitry | backend4you.ton: And I’m not saying that this (copy keys to tuple, sort it) is possible in tact :) my point is that you can’t sort the map itself.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Yes, it looks like the only solution for now to work with maps in a loop when our key is not int type repeat(array_length) {     key = keys_array.get(loop_index)     value = data_array.get(key) } then we have same order as set ordering in output (reply to 10337)

— 2023-11-19 —

Francesco: Dumb question (I can't find clear docs about it): What happens to the ctx.value received by the contract when a require throws an error? Will the value be returned to the sender, or should we manage that manually?

Howard: if satisfied in require statment and got the error, then the tonCoin you pay for this Tx will bounce back. (with the error exit code shows on Explorer) (reply to 10351)

Francesco: I suspected so :) But what happens if contract A sends a message to contract B and contract B reverts? I guess the value bounce back to contract A which have no idea about what to do with it? If so, I should manage the error and send a message back instead of throwing an error. Does it make sense?

Francesco: How, I totally missed the bounced statement 😊 That solves my problem

Dmitrii: Has anyone received a prize award after the tournament?

Ahmet Said: Yeah but wrong amount .Not even single anouncment about prize transfer (reply to 10378)

— 2023-11-20 —

Sentiar: Hello, please explain this point, apparently I’m not getting it enough. When I send a message from a wallet to a contract that should create another contract via lazy deploy (passing data, code to SendParams), the body is empty, mode: SendRemainingValue, then the second contract (it has an empty receive) does not become active with a 0 balance, unless Shouldn't the sent tones minus gas remain on the second contract and the status is active?

Howard: What is the status for the second contract shows on explorer.   If it's non-exist, I am thinking that you were not passing the init.code or init.data successfully (reply to 10393)

Sentiar: heh, interesting, i was writing test(jest) for contracts but now i've tried to do same thing in test env and it works(sent coins remains on the 2nd contract and its status is active) probably did smth wrong in tests

Howard: is there the way like msg.sender == tx.origin in Solidity here on Tact?   Thinking if we want the caller must to be the Wallet(V3, V4)...etc   Probably cant?

Daniil: well, it's technically possible to verify whether the message sender is a smart-contract of some particular type using merkle proofs for account states  but why would you ever want to do that? (reply to 10404)

Mikhail: Hello everyone, im am doing a thing like that in tact:  tact receive(msg: SetEventResult) {         self.has_role(sender(), self.DEFAULT_ADMIN_ROLE);         let init_state: StateInit = initOf Event(myAddress(), msg.event_id);         send(SendParameters {             to: contractAddress(init_state),             body: msg.toCell(),             value: context().value,             mode: SendIgnoreErrors,             bounce: true         });     } receive(msg: SetEventResult) {         require(context().sender == self.arena_address, "Only Arena Address");         let info: EventInfo = self.load();         info.match_result = msg.result;         let cell: Cell = self.fit_info_into_cell(info);         self.event_info = cell;         self.reply(EventResultChanged{event_id: msg.event_id, match_result: info.match_result}.toCell());     }   after i call another method   tact  let info: EventInfo = self.load();         self.reply(ReturnEventInfoForReward {             match_result: info.match_result,             event_id: msg.event_id,             user: msg.user,             bet_id: msg.bet_id         }.toCell());  then in another receiver i check for this field  require(msg.match_result > 1, "Match cancelled or in progress");    i am sending match_result 2,  but require aborts transaction

Mikhail: any suggestions?

Mikhail: looks like it cannot change some variables in receive() function

— 2023-11-21 —

Sentiar: Hello, the question is whether one contract can own several jetton wallets (jetton type, master and owner are the same, but the jw addresses are different), and uniqueness can be achieved by passing an additional seqno field to jw init, so that contractAddress always returns a unique address ? Or the original idea is to have one contract which owns only 1 jetton wallet with tokens of a certain type?

Dmitry | backend4you.ton: This will violate https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md and explorers and wallets will not show additional wallets, and you will have difficulties when transferring jettons to additional wallets, but in theory this is possible if you make custom Jetton contracts. (reply to 10445)

Dmitry | backend4you.ton: And in general, you can’t call it “Jetton” because this custom thing will be incompatible with Jetton

Sentiar: Got it. Thanks (reply to 10446)

Howard: you solved already? Can't understand your code since you missed some part of functions. (reply to 10436)

He: Ask for help😂

Howard: can't get the question properly, you do can call contract A then send Tx2 to contract B.  Reference: https://tact-by-example.org/06-unbounded-arrays (reply to 10458)

🐾: Hey! Start earn Notcoin with me and get the first bonus! 🎁

Dmitry | backend4you.ton: is it legit to have two receive() with identical signatures? which one will be called ? (reply to 10454)

He: Is there no way to directly obtain the return value of the getaa method of contract A in the "to A" method of contract B?😅

Dmitry | backend4you.ton: one contract can't call get-method of other contract. the only way to communicate is by sending tx/message: 1) contract-A sends message to contract-B 2) contract-B receives this message and responds with answer 3) contract-A receives respond message and perform some actions But (1) and (3) are different program flows in contract-A. It can't "wait for response". (reply to 10466)

Howard: idk, never try out before. You probably can't compileed (reply to 10465)

He: Thank you, I understand. It seems that this can’t be used as a linear request.😂 (reply to 10467)

Howard: Yeh, you can. Since fetching the contract data from another is based on "message calling". You can't directly calling other contract's get method there.   TON doesn't have get function on on-chain level in each contracts itself. Check the Tact-by-example code. (reply to 10466)

🅰🅻🅰🅽: The process of retrieving multiple token prices from oracle is not straightforward on TON, owing to its message passing mechanism. Is there any best practices?  In my imagination, the workflow should be: 1. contract call the oracle to get price with callback payload 2. the oracle process the request 3. the oracle reply with callback payload

Howard: I think can check Pyh's model (reply to 10471)

Slava: There is an another option, using a "update on demand" model. In this case you send oracle price + its signatures to your contract, contract has to verify the signature and only then process the price. Storm Trade uses this approach (reply to 10471)

Howard: signature means only the one address(Oracle Address) can send the data into the current right? (reply to 10473)

Slava: No, by "signature" I mean the signature of oracle payload cell, 512 bits. Just like we send signatures to our wallet contracts via external messages (reply to 10475)

🅰🅻🅰🅽: I am still consufing about the "signature". How can a price feed (uniswap v3 on ethereum, binance api, etc.) generate a verifiable signature? Don't we need to elect price from all verifiable candidates?

Slava: You can start with PythNetwork or RedStone oracle providers. They both support "on-demand" model (or "pull" model) (reply to 10477)

Mikhail: it's was two different contracts, i've sent bad snippet i apologise (reply to 10468)

Mikhail: but the problem is still here:  1) Parent contract receive's message  2) Parent contract sent message to child contract 3) Child contract must change some of it's variables 4) Child contract must reply back to parent and emit event  So in my case, num.3 is not making any changes in contract

Francesco: I am using Blueprint for a Tact project. If I put a dump(123) in the contract, the build works without errors, but during testing I don't see and debugging. Any idea why? (BTW, it looks like Blueprint ignores the tact.conf.json file)

User<796481024>: Hi guys, what can I do if the first tact file imports the second tact file within its contract but the last one does same with the first one file, it's like a cycled loop, import imports import haha, and as a result I get a "Type ContractName already exists" error. I know the problem may be solved by adding the contracts in one file, but I need separate files.

Francesco: Can you maybe separate the common part in a trait and load that trait from both contracts? (reply to 10498)

Francesco: I found it. You need to add the option in the wrappers (reply to 10497)

User<796481024>: No, the contracts don’t have common functionality. I use imports to check a sender is a contract. And the 2nd contract after receiving a message from the 1st one, reply it and I need to check a sender again. That’s why I need imports. (reply to 10499)

Francesco: I am afraid you have to change the way it works. AFAIK, you cannot generate import loops.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I think you are not familiar with TACT compilation method, At the time of compilation, all content of imported file is rewritten in one file, so use 1 import in which one you want to be at top, and don't care about IDE syntax errors in other one (reply to 10501)

— 2023-11-22 —

Howard: Oh, one thing I've noticed in Tact is that using emit will finalize the transaction.   In Solidity, emit doesn't pause the transaction during execution and will continue to execute the next line of code continuously. (You can have multiple emit inside a function)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Can you confirm this with Tact's core team? (reply to 10520)

Howard: you can test it out as well. That is why I always put in the end of the function (reply to 10536)

— 2023-11-23 —

Francesco: In an Tact contract for TON Network, I have the following code: let givenSupply: Int = 0; if (self.queries.get(msg.query_id) != null) {             dump("Verified);             givenSupply = (self.queries.get(msg.query_id)!!).givenSupply;             dump(givenSupply); } It dumps "Verified", but it never dumps givenSupply. I guess that the line before throws some exception. Any idea where the error is?

Francesco: I can't find any info about emitting events in the documentation... Where is it? (reply to 10520)

Howard: https://tact-by-example.org/03-emit  For the github repo example, here shows how you can set the event() (reply to 10545)

Sumit: Sumit, [23-Nov-2023 at 3:12:11 PM]: Hey Ton Fam,  data: {       ok: false,       error: 'INVALID_BAG_OF_CELLS: bodycannot deserialize bag-of-cells: invalid header, error 0',       code: 500     }  i am getting this when sending a transaction after signing it

Logan Wang | Aptos: Hi How can we verify, within a contract, the authenticity of a TokenNotification received from a specified jetton during its reception?

Dmitry | backend4you.ton: compare its sender with pre-saved address of desired jetton wallet address (reply to 10600)

— 2023-11-24 —

Mikhail: hello,  have found this: https://answers.ton.org/question/1602580552903299072/check-signature-check-data-signature-usage-for-signing  how do i must send public key? it's dont look like it's int

— 2023-11-25 —

Good: Hello. If I use one contract creation and response msg in contract receiver , deploy is ok. But if I try create 2 new contract in the same receiver, deploy contract falls. Are there any restrictions for creating of new contacts in receivers??

Grit: looks like you are creating the same contract again, you need to add some seed counter in the Init data (reply to 10660)

Good: Creating contracts have different source code (reply to 10669)

Grit: if you are deploying a contract with identical code and init data it produces the same address (reply to 10669)

Grit: oh... then I can't help without looking to actual sources (reply to 10670)

Timofei: hi guys!  after mint jeton (https://minter.ton.org/), can I apply new Tact contracts to this jetton after its deployment?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: When you importing an contract and you have init of it in your contract then you already deployed it   Use an unique initial seed to avoid any address conflicts  For example deployTime then use now() from state init:  init() {     self.deployTime = now(); } (reply to 10670)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: No, you can call contract inside your wrapper using JettonMaster, JettonWallet from @ton/ton library (reply to 10673)

Timofei: One question is, after the release of the jetton, will I be able to influence the behavior of the jetton with my smart contracts? (reply to 10675)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If requested by owner of the jetton, yes Minter.ton contract is not transferable so you can't use third contract as owner, where you want to manage jetton from DAO (reply to 10676)

Timofei: I'm a stranger, I haven't revoked administrator rights yet (reply to 10677)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Jetton owner is that wallet which paid mint fee in minter.ton.org and is not transferable (reply to 10678)

Timofei: I am the owner of Jetton. (reply to 10679)

He: Please tell me the framework is blueprint Writing tests Use npm test -- tests/xxx.spec.ts Is there a way to print the information written in the contract at the same time during testing? dump("============0=========="); The information is used to see where the execution is interrupted and what errors are reported.😂

MonoBit: Hi guys  Is there any equivalent for FunC's inline_ref specifier in Tact? (reply to 10682)

— 2023-11-26 —

Howard: you don't. But you need pass it on off-chain level(the TypeScript file) (reply to 10622)

Mikhail: yep, figured it out recently. (reply to 10695)

Howard: From my experience: For creating the new contract(contract initially), you have to "one-line" processing the contract.   Which means only set the one Tx in-and-out to initialized the contract! (reply to 10660)

Howard: Like this (reply to 10697)

MonoBit: Hi Do bitwise operators work on boolean variables? (reply to 3391)

— 2023-11-27 —

He: When there are two contracts A and B The user carries Ton and requests contract A. Contract A carries the Ton requested by the user and initiates a send request. The structure is roughly ` send(SendParameters{      to: "to address",      value: 0,      mode: SendRemainingValue,      body: B contract {owner: sender(), amount: user Ton}.toCell() }) `  If a require exception occurs in contract B after receiving a request from contract A, will the user's user Ton be automatically returned to the user, or does it still need to be written in contract B to manually return it?

Howard: yess (reply to 10708)

Howard: initialized the contract need to send with init.code and init.data.   like here: https://tact-by-example.org/06-contract-deploy-another (reply to 10727)

Anton: Hey folks, please take a look at Tact's roadmap: https://github.com/tact-lang/roadmap -- we'd like to hear your thoughts on that

M: I will kike to understand it more?

KrishnaMani: guy is anyone participated in codeforces ICPC post world finals ?

KrishnaMani: have any idea about NP-hard problems

KrishnaMani: ??

M: What's up!

M: I'm new here can someone please explain the purpose?

— 2023-11-28 —

Mikhail: Hello, i have strange error in ton: exit code 136 which mean { message: Invalid address },  how is that even possible if i know that i send messages to existing contract?

— 2023-11-29 —

Howard: through the ton sdk, we can get the Jetton WalletCode in Cell.   Is this Cell can turn into StateInit as we deal with in Tact?

Howard: This might be the missing feature for us in Tact:  We can't place 'contract initialization code and data' in 'StateInit' from off-chain and then store it at the on-chain level.  The scenario for this is as follows: Let's say I want to write a contract that is only callable by any 'jUSDT jetton wallet.' Then, I would need this method to mandatorily ensure that only the qualified addresses can send the message through.

Vlad: I’ve created a work around, but that definitely should be developed

Howard: oh? How you achieving that? (reply to 10849)

MonoBit: Is there any way to set storage variables in our contract when we are testing, without creating a transaction to do that?  something like contract.setDataCell() in testing func contracts.

MonoBit: I think this 👇 should work but I am not sure.          contract.init!.data = beginCell()             .store(                 storeData(                     {                         $$type: 'Data',                         owner: user.address,                     }                 )             )         .endCell(); (reply to 10855)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: why you are trying to avoid using simple fromInit method inside Contract class?  struct InitParam {     owner: Address; }  contract SampleContract {     data: InitParams;      init(data: InitPatams) {         self.data = data;     } } let test1 = await contract.fromInit({ $$type: 'InitParam', owner: owner.address }); let test2 = await contract.fromInit({ $$type: 'InitParam', owner: user.address }); (reply to 10856)

MonoBit: In that case I have to deploy it again. I wanted to change init data of a delpoyed contract during the test. (reply to 10860)

Vlad: It’s the last commit in tact cookbook (reply to 10850)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: emulator has same design with ton, contract's code is deploying during tests, so it's impossible to do that without transaction from client (offchain) to TON (onchain), means I can't ask something from you in my mind and expect response (reply to 10866)

MonoBit: In "ton-contract-executor" package, we can change storage data using SmartContract.setCellData()  I think there should be something like that in Tact using "ton-core" Contract class. (reply to 10871)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: in the func you can update your code with filling new data cell via set_code method, Tact is not cover this yet, however, you have to send transaction for it (reply to 10872)

MonoBit: Thank you.  In the end, I tried to deploy it again with new init data to avoid using insecure receivers to manipulate the contract's storage. (reply to 10873)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm not sure if updating emulator data is possible or not (it's possible in theory), can you explain usecases please? what's your forces/limits to avoid init contract with new data? (reply to 10874)

— 2023-12-01 —

José Luis: Hello, where can I see the details of the TON Smart Challenge contest payment transfer?

Howard: Have you leave the correct Telegram handle? Sometimes will pay through @CryptoBot or @wallet (reply to 10923)

José Luis: I received the money without problems 👍, but I lost the two factor of the wallet and I need proof of where the money was sent from. I don't know if that information is available. (reply to 10924)

&rey: tonscan.org can show transactions of any address. (reply to 10923)

Howard: any example of Tact code people use that import FunC language?

Howard: https://github.com/Cosmodude/Nexton (reply to 10934)

User<6247944943>: is this the cell data type or BOC?

Howard: const dataCell = Cell.fromBase64("YOUR STRING"); (reply to 10941)

Dmitry | backend4you.ton: you can't serialize "only cell" - you'll lose referenced cells. so its a BOC. its always a BOC. (reply to 10941)

Roman: Hello everyone! 👋   Recently, Anton Trunov, the new lead for the Tact language at TON Foundation, created a Tact Roadmap for the development of the Tact language.  We aim to make the Tact language as good as possible for developers. You can help improve the Roadmap by participating in a survey.  The survey consists of 7 questions, but it's crucial to reveal your experience so Anton can tailor the Tact language to your needs:  👉 https://liabbc8a.paperform.co/

— 2023-12-02 —

Howard: what is the store_maybe_ref might be in Tact? Should it with empty bits or?   Never saw before.

nonam3e: Cell? (reply to 10954)

🅰🅻🅰🅽: Tact storeRef only supports Cell type, a maybe ref means  Cell? type in tact, but there is no such method to store it into cell according to tact document (reply to 10954)

nonam3e: storeUint(0,1) or storeUint(1,1).storeRef(cell) (reply to 10961)

🅰🅻🅰🅽: Yeah, after investigation, this is how load_maybe_ref implemented   ;;; Loads (Maybe ^Cell) from `slice` [s]. ;;; In other words loads 1 bit and if it is true ;;; loads first ref and return it with slice remainder ;;; otherwise returns `null` and slice remainder (slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

🅰🅻🅰🅽: so storeUint(0,1) or storeUint(1,1).storeRef(cell) is what you need

— 2023-12-03 —

Daniil: Or store_maybe_ref :) (reply to 10965)

🅰🅻🅰🅽: Do you mean native binding? (reply to 11001)

Daniil: Yes, if there’s no such function already (reply to 11002)

Aleks: hi, tell me how much map<Int, Bool> will cost per year in a contract with 10000 bool items?

Aleks: 1000 simple Bool items without map<> cost 0.00072 per year. Will it be about the same here?

Daniil: No, it will be more. But not too much, actually.  Also it depends on the key sizes. (reply to 11011)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: map can't store boolean value yet! you should use <Int,Int>  Or an struct: struct BoolValue {     value: Bool; }  boolArray: map<Int, BoolValue>; (reply to 11010)

— 2023-12-04 —

Howard: interesting speak, I thought the map.set<Address, Address> cost higher than map.set<Int, Address>

Vlad: wow, how did you print the tx data in such an organised way?

User<690261130>: Some framework

Howard: https://github.com/howardpen9/MappingMessage_Tact/blob/7901dccc2394e7b7dd1d02ffc789735ee2a6aa6b/sources/test_2.spec.ts#L68 (reply to 11029)

Денис: Hello. Tact programming language, is it possible to immediately learn it without knowledge of JavaScript?

Denis: :) u don't need to know JavaScript for tact lang (reply to 11042)

Mikhail: Hello everyone, does anyone know the solution?  error: previous function return type ((slice, cell, int, cell, slice, cell, cell, slice, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((slice, cell, int, cell, slice, cell, cell, slice, int), int)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You have a method without returning a value.  Hint: recheck your methods which has if statement to returning values (reply to 11069)

Mikhail: yep, but i dont even want to return any value, i am doing self.doSomething();  fun doSomething() { ////bla-bla-bla //nothing to return } (reply to 11070)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: check your getters (reply to 11071)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if(a) {     return something; } if(b) {     return somethingElse; } return defaultValue; (reply to 11070)

Mikhail: yep, everything it's ok in these   looks like problem is somewhere there: fun get_default_lives_by_rarity(rarity: Int) : Int {         if(rarity == 0){ return 2;}         if(rarity == 1) {return 2;}         if(rarity == 2) {return 3;}         if(rarity == 3) {return 4;}         if(rarity == 4) {return 5;}         if(rarity == 5) {return 10;}         else {             return 0;         }     }  but it's seems like everying is ok 😕 (reply to 11073)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Remove else and return 0 would work same (reply to 11074)

Mikhail: nope, still error (reply to 11075)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm sure you can fix this by reviewing your getters and functions, or share your code if you need more help. good luck (reply to 11076)

Mikhail: gotta go to eye doctor, really missed one getter, thanks for help! (reply to 11077)

Francesco: In our contract, at the very end of the execution we emit an event, calling something like emit(someMessage(...)); I can't find info about how to monitor the event in the app. Any idea?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you should track your contract and it's depended on TON's SDK/Tools you are using on your APP (reply to 11081)

Francesco: Ok, thanks

— 2023-12-06 —

Howard: In fact, you can track it through output folder module. (reply to 11081)

cell: Testnet is dead?

Mikhail: yep, dont even let me send transaction (reply to 11180)

Mikhail: Error: no healthy nodes for v4-testnet lolz (reply to 11180)

cell: Same

Mikhail: As far as i know some guys are stress-testing ton

Mikhail: but then how we should test our contracts:) testing in local != testing in testnet

cell: i thought orbs is bulletproof solution

cell: I hope for mainnet it is true

Sergey: how can I make sure the user is using mainnet wallet with js? Should I check workchain parameter? -3 or -239

Dmitry | backend4you.ton: Check where (in what)? (reply to 11188)

Sergey: account object from ton-connect-ui after login. Account - workchain. I'm not sure and that's why I'm asking (reply to 11189)

Dmitry | backend4you.ton: Once some user logged in - you may be sure he owns private key for corresponding public key (wallet, address). He may use same keys everywhere (lol but he may). Do what you need next (sign something?) and wait for result in blockchain you need.

Dmitry | backend4you.ton: work chain is not about testnet/mainnet. Workchain is about base chain (0) / masterchain (-1). Both testnet and mainnet have both master and base chains. Base chain is for everyday operations (cheaper), master chain is for management/control/etc - and fees are higher.

Sergey: thanks for  detailed explanation. I'm confused by "chain" parameter that returns ton-connect. This values -3 or -239. Could you let me know what this is? (reply to 11192)

Denis: 239 is the number of school in saint petersburg :)

— 2023-12-07 —

Denis: hey guys. maybe I don't know something but I have the problem, on testnet   throw new Error(`no healthy nodes for ${protonet}`);

Denis: mainnet seems to be working

Denis: using library "@orbs-network/ton-access"

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Please wait until official announcement about normal situation and avoid any new transactions (reply to 11217)

Anthony: TON20 Inscription Use-case on TON Starting on December 5th, The Open Network (TON) experienced an incredible spike in network activity, thanks to the BRC20 Bitcoin Ordinals type of inscription use-case, called TON20, launched by the Tonano team.   Producing over 2 million transactions increased our network usage by 61 times within just half an hour. TON Community is proud to witness a creative use case take-off in TON driven by independent participants in the ecosystem.  Moreover, this sudden growth has revealed many interesting insights for our blockchain. Dynamic sharding technology worked as expected. At its peak, TON split into eleven shardchains, stabilizing at five shardchains to handle the heavy load.  At the same time, this phenomenon also revealed where the community should work to swiftly onboard the exponential increase in network activity expected in the near future. Network validators must ensure that TON is supported by hardware capable of scaling to the performance demanded by high usage.  Network Performance Delays This peak interest also came with a severe congestion of TON network, where validation was severely delayed even though the network validators are still producing blocks.   Popular wallets like @Wallet and Tonkeeper have paused the service temporarily.  TON core developers are aware of the issues affecting users and are working on TON blockchain. An initial technical report is available here. TON core team will be providing us with a further update within the next 24 hours.   We thank you and the community for your patience and unwavering support as we go through the growing pains together, preparing for the unprecedented growth season expected in the near future. (forwarded from TON Community)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Call for Network Validators to get in contact! The TON blockchain is experiencing reduced performance now due to a backlog of transactions in the queue to be validated. We’ve received a fantastic response from many validators on the network who have already upgraded using the patch provided this morning.  However, there are still some we have been unable to reach. We need to collect the machine specifications from all validators to progress the upgrade as quickly as possible. If you maintain a TON validator node, please get in touch with us urgently so we can resolve the network performance issues.   You can reach the team via this google form. If you know someone who maintains a validator node on TON, please also feel free to forward this message. (forwarded from TON Community)

— 2023-12-08 —

Mehdi: Greetings, everyone! I'm curious about the technical limitations that an actor might have , where we can find more detail about this limitation other than source code?

Mehdi: Note, that since there is a limit on max cell-depth <1024, and particularly the limit on c4 and c5 depth <=512, there will be a limit on the number of output actions in one tx <=255. If a contract needs to send more than that, it may send a message with the request continue_sending to itself and send all necessary messages in subsequent transactions.

Howard: wdym (reply to 11245)

Mehdi: message to itself go last in actor inbox or process instantly ?

Mehdi: I am thinking about recent congestion, I think this is due to wrong design of contract in ton20 not validator or TON. (reply to 11247)

Howard: yeh, they should using the Jetton Minter

Howard: or NFT collection to let every mint in different addresses

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: However, this should have been processed by TON. This was expected from the design of TON and sharding system. It must be ensured that such an incident will not be repeated, even if it was repeated deliberately with higher scales. I'm sure the TON core team are the best to prevent this from happening again and will do their best to keep TON stable (reply to 11250)

Mikhail: the funny thing that you can broke the whole blockchain for n-days just by writing "wrong design" contract xd (reply to 11250)

doni: can anyone share the incident report ?

Mehdi: https://telegra.ph/7-Dec-2023-12-07 (reply to 11256)

Mehdi: You know that saying, 'What doesn't kill you makes you strong'? Well, that's exactly how software systems become thriving and resilient! (reply to 11255)

Mikhail: you can use this quote to gambling but thats will sound stupid. bro, i cant ship my projects cause chain is dead (reply to 11263)

Mehdi: Before you want to ship your project in any system ,at first place you should believe in system. this sound stupid bro, TON is best system ever invented without any doubt . (reply to 11264)

Mehdi: Mainnet validators, get ready to update your software today at 12:00 UTC.  More updates are also possible during this day, please stay in touch. (forwarded from TON Status)

doni: did contract used a dictionary  and it kept growing  ?   that was the issue ? (reply to 11262)

Howard: Has anyone tried working with the Slice data type in Tact? I want to know the maximum size of data that can be input and check whether it breaks.

nonam3e: You may store up to 1023 in the slice and up to 4 references to cells

Howard: yes, maybe I am just suddenly stuck in Slice and Cell when trying to loadAddres

Mikhail: for some reason is also not working for me (reply to 11271)

Mikhail: it's dropping error: invalid address

Howard: which part (reply to 11274)

Mikhail: when i am trying to store address in builder, on the action phase (reply to 11275)

— 2023-12-09 —

Howard: maybe you can share with me your Tact code then help you to solve

Bear: ...

Bear: I can't post image. why

Bear: even the code block nither

Bear: // .... code          // method 1         if (self.record.get(msg.caller) != null) {             return;         }          // method 2         require(self.record.get(msg.caller) == null, "Already on the list");          // ... continue

Bear: which cases is better in Tact?

Howard: // .... code          // method 1         if (self.record.get(msg.caller) != null) {             return;         }          // method 2         require(self.record.get(msg.caller) == null, "Already on the list");          // ... continue   I think method 2 is cheaper? since no if statement (reply to 11298)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: aren't same, require throw a error which returns bounced msg  but return;it just stops processing so it's not traceable (reply to 11300)

cell: Is it possible to get transaction fee during contract execution?  Or estimated fee is only thing we can use?

Mehdi: During contract execution fee is change, it means by every step or any instructions fee calculation continues till end .

Andrew: - don't use non-deterministic functions (loops, hashmaps, etc.) - test all cases for gas consumption (reply to 11314)

cell: What am i doing wrong?  My setup: message SetFeePercent {     fee_percent: Int as uint8; }  // fee_percent: Int as uint8 = 5  receive(msg: SetFeePercent) {         let ctx: Context = context();         require(ctx.sender == self.owner, "Access denied.");         self.fee_percent = msg.fee_percent; }  Message send:   // set_fee_percent const messageBody_set_fee_percent = beginCell()     .storeUint(285412494, 32)     .storeUint(0, 64)     .storeUint(2, 8) //fee percent     .endCell();   await contract.sendTransfer({   seqno,   secretKey: keyPair.secretKey,   messages: [internal({     value: toNano("0.2"),     to: contract_address,     bounce: true,     body: messageBody_set_fee_percent   })] });  After this message, fee_percent in contract = 0, but should be = 2 ( i guess?).

— 2023-12-10 —

Howard: any tool can get this info or test this properly? (reply to 11316)

Howard: can't get this part. What is this for. (reply to 11319)

Andrew: blueprint :) (reply to 11320)

Howard: yeh just print the table right https://t.me/tactlang/11025?single  Thought you have better tool (reply to 11322)

Andrew: You shouldn’t use address as a hashmap key, because address is not deterministic in length (reply to 11025)

Andrew: It’s also very interesting to see the output code (func or fift-asm) (reply to 11324)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: why you are not using tact's generated wrappers? for SetFeePercent should be something like this storeSetFeePercent(fee_percent: bigint) (reply to 11319)

Howard: where you found the load_dict? (reply to 8893)

Howard: hey guys, how we set initOf in Tact?   In FunC, we usually need init.code and init.data to generate the contract address.   In Tact, we have the contractAddress.

nonam3e: Dependent code is set in the data cell automatically (reply to 11340)

Howard: I want to let my Tact code correct with WalletV4 interface on TonViewer. And basically it's based on the init.code

Howard: The problem is seems no matter how I tried, the init.code still in correct.   So my idea is that why don't we store the init.code there.

Alexandr: 20

— 2023-12-11 —

cell: Hello! Is it possible to predict? Is there any better solutions for true random value? nativeRandomize(abs(randomInt() - self.lockedValue) + now()); //lockedValue = (value of last 3 transactions minus fee) nativeRandomizeLt();  let maxNumber: Int = 10000; let randomNumber: Int = random(0, maxNumber);  Also  nativeRandomize and nativeRandomizeLt  works together? Or they rewrite each other?

Howard: literray not

Howard: theory random, you can put some numbers and LT time with it I think

Howard: will increase the difficulty to predict

cell: they mint again? 😡

Mikhail: Hello guys, is testnet alive? cannot send transaction, dropping here

Andrey: Hi everyone, how can I fix it ? blueprint script for deploy contract

— 2023-12-12 —

Howard: can you choose the other deploy option? (reply to 11396)

Howard: your from.Init() module is incorrect (reply to 11407)

Howard: maybe can take a reference: https://github.com/Cosmodude/Nexton (reply to 11407)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you are trying to pass a nullable argument (providerAddress) as non-nullable argument, try providerAddress! (reply to 11407)

MonoBit: Try to import @ton/blueprint instead of @ton-community/blueprint Make sure you are using the latest version of blueprint and ton utility packages they are now a part of @ton (reply to 11407)

Howard: import { compile, NetworkProvider } from '@ton/blueprint'; (reply to 11426)

Andrey: Thanks guys

Дмитрий: hello everyone! Can you help me with VSCode settings? I cant understend how deploy my contract and use vscode

Дмитрий: How can i run ts script?

Howard: For tact it's very simple. Can use my template:   https://x.com/0xhoward_peng/status/1712481683545731173?s=46&t=OlAx5pRJg1BNjb9INUSdhw (reply to 11435)

— 2023-12-13 —

&rey: npx ts-node <name>.ts in console (reply to 11435)

Дмитрий: I’ll try it today, thank you (reply to 11451)

Hakiem: Hi guys, is anybody else having issues sending transactions to Tonkeeper wallet using TonConnect on testnet? Transaction confirmation doesnt pop up on tonkeeper

Hakiem: and am having issues with test giver bot as well @testgiver_ton_bot

abdallah: no more callanges?

— 2023-12-14 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you have exit code 130 which mean "Invalid incoming message", share your msg body

— 2023-12-15 —

Faker: How can I active the uninit wallet?

Alex: Send outgoing message (reply to 11500)

— 2023-12-16 —

He: I have a question: how to convert EQ address to UQ address? Is there any node package available?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what's use case? (reply to 11547)

Denis: hey guys. I have maybe a stupid question. There is an approach to get all NFTs assigned to a certain wallet? Or I should brute force all NFTs by item_index and cache it to easy access?

Step: https://tonapi.io/v2/accounts/UQDYzZmfsrGzhObKJUw4gzdeIxEai3jAFbiGKGwxvxHinf4K/nfts?collection=EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N&limit=1000&offset=0&indirect_ownership=false (reply to 11552)

Denis: and how this website works? scanning the blockchain and cache it?

Howard: 👍🏿

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you can do it in your app via an api sdk,  https://github.com/delab-team/ton-api-sdk/tree/main (reply to 11555)

Denis: thanks! (reply to 11557)

— 2023-12-17 —

MonoBit: Is it possible to deserialize a Cell to a specific struct in Tact?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧:     let structObject: Object = Object {         propA: parsedCell.loadUint(64),         ...     }; (reply to 11562)

MonoBit: I expected a built in way but that's ok Thank you (reply to 11563)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: no, tact doesn't know about your cell's data schema, maybe in future when we had our objects as re-useable schemas (reply to 11564)

🅰🅻🅰🅽: great idea (reply to 11565)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this can be a solution to generate func wrappers as well as tact wrappers https://github.com/ton-org/blueprint/issues/75 (reply to 11566)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: However, we can achieve this with a little change in the compiler, and instead of reading the code line by line, we use a function to load the structure from a json file, so our build output can be very simplest and serialize/deserialize can be possible. we can use this schemas to generate API/Front codes and any RAD tools top of this resources

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: let obj: Object = cell.parseTo(Object); // or let obj: Object = cell.beginParse() as Object; // or  let obj: Object = cell.loadRef() as Object;

Дмитрий: Hello, how can I transform int to float type? For example 1749 -> 1.749

Олег: there is no floats in tact language, fixed point is using instead. So, you can use 1749*1000000 that is same as ton(“1.749”)  P.S.: sorry,  ton(“1.0”)=pow(10, 9) (reply to 11583)

Дмитрий: Hm  when smartcontract transfer Jettons, value is x * 10^9 where x- amount of jettons to transfer? (reply to 11584)

Олег: So yes, the amount of coins is stored in nano-coins: amount: Int as coins (reply to 11588)

Дмитрий: Thanks! ☺️ (reply to 11589)

Олег: You can checkout this short tutorial about integers in tact:  https://tact-by-example.org/02-integers (reply to 11590)

— 2023-12-18 —

Dmitry | backend4you.ton: Sometimes not. Each Jetton can have its own factor (number of decimal places). Jetton master contract knows/holds that value (reply to 11588)

Howard: Uint256 vs Address which one is safe more gas in storage

Daniil: these will consume same gas but Address is usually a little larger in storage (267 bits) (reply to 11616)

Howard: yeh, I am thinking using Signature might be more efficient? Seems not

Aleks: hi guys, tell me pls how to do the following more efficiently and with best practice: 1. The contract is initialized 2. you need to init the contract.. and save a map with 100 000 strings in it for example (how much will such calculations cost.. hm). Like this?:  struct TypeValue {   str: String; }  trait Lib {   lib: map<Int as uint32, TypeValue>;   lib_length: Int;    owner: Address;    receive("init lib") {     require(sender() == self.owner, "Invalid owner");     let i: Int = 1;     // ... 100000 records     while (i <= 100000) {       self.lib.set(i, TypeValue{ str: "Hello " });       i = i + 1;     }     // or.. if the lines are different, then there should be a trait for 100000 lines of code             // self.lib.set(1, TypeValue{ str: "A str" });       // self.lib.set(2, TypeValue{ str: "B str" });       // self.lib.set(3, TypeValue{ str: "C str" });       // ... 100000 lines      self.lib_length = 100000;  } }

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 1. if you have output msg, you should limit your process to < 250 (unsafe 256) 2. use repeat because while has  one `if and you need loop for simple indexer 3. 100000 line of code for a contract is unprofessional and it is not understandable to me, because I do not know your needs. But according to my knowledge, it is not possible. Because the number of cells that are created to transfer your code is beyond the network limit (reply to 11623)

Muhammad Javad: Wait! Is there a way to write TON contracts by Rust? (reply to 11623)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: just in telegram code pallet, yes (reply to 11626)

Aleks: yes, I understand that this is crazy) and I think these 'db' should be stored on the back, and not in this way. Thanks for the clarification (reply to 11625)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if you have an formula to generating that 'bd' you can write it onchain, if not so, backend is best solution (reply to 11628)

Aleks: most likely if you store such a count of strings, then the old-fashioned way is json and a bot sending transactions if required. I'm just exploring the possibilities of bringing the backend completely into the blockchain.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: yes, I said best solution is backend, of curse you have more option. 100,000 transaction and JSON as source needs ~2000 ton but you can seed your map much cheaper (reply to 11630)

Yones: Hi

Aleks: interesting. what much cheaper other ways are there? (reply to 11631)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: let lib = Dictionary.empty<bigint, string>(); for(let i=0; i<100000; i++)     lib.set(BigInt(i), getStringFromJsonOrAnywhere(i));  await contract.seedLib(sender, lib);  receive(msg: SeedLib) {     require(sender() == self.owner, "Invalid owner");     self.lib = msg.lib;  } (reply to 11634)

Aleks: 🙏🏻 thank you (reply to 11635)

— 2023-12-19 —

Howard: what is the data type for SeedLib in Tact ? (reply to 11635)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: It's a example code with assuming lib: map<Int, String> in our contract's storage, so: message SeedLib {     lib: map<Int, String>; } But I'm not sure map<Int, String> is valid or not 🧐 (reply to 11638)

Howard: When I writing the tes-case, how to tag the address here as a "easy memorable name"?

Aleks: btw yes, for the map value in Tact String is not valid (err -> unsupported map value type String). it turns out need something like this: type ItemLibStruct = {     $$type: 'ItemLibStruct';     item: string; }  type SeedLib = {     $$type: 'SeedLib';     lib: Dictionary<bigint, ItemLibStruct>; }  let lib = Dictionary.empty<bigint, ItemLibStruct>(); for(let i=0; i<100000; i++) {     const item: ItemLibStruct = {         $$type: 'ItemLibStruct;         item: getStringFromJsonOrAnywhere(i);     }     lib.set(BigInt(i), item); }  await contract.SeedLib(sender, lib); //tact struct ItemLib { item: String; } message SeedLib { lib: map<Int, ItemLib>; }  //...  receive(msg: SeedLib) {     require(sender() == self.owner, "Invalid owner");     self.lib = msg.lib; } 🤔 Or is this again flirting with excessive size.. (reply to 11648)

Howard: I can't sure whether this works? Since storing in String need huge spaces in contract? (reply to 11656)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: struct StringValue {     value: String; } message SeedLib {     lib: map<Int, StringValue>; }  receive(msg: SeedLib) {     require(sender() == self.owner, "Invalid owner");     self.lib = msg.lib;  } types are coming from Tact builds import type { StringValue } from './PATH/TO/WRAPPER/contract';  let lib = Dictionary.empty<bigint, StringValue>(); for(let i=0; i<100000; i++) {     const item: StringValue = {         $$type: 'StringValue',         value: getStringFromJsonOrAnywhere(i);     }     lib.set(BigInt(i), item); }  await contract.SeedLib(sender, lib); (reply to 11656)

Aleks: yeah, not sure either (reply to 11657)

Howard: 🎄🧦💝❄️🎅📆

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I will help them by assuming that they are aware of storage costs. If you send 100,000 single numbers to the chain, you must calculate the storage cost before that. However, my contribution is only to reduce the cost of seeding the contract, not storage. (reply to 11657)

Aleks: 100000 is an example number

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if your contract has only 1 storage props and that is same type map<Int, StringValue> and your string size are less than 1024, you have to pay ~1 TON for storage per year, that mean 100,000 TON per year, you have to pay ~0.5 ton per cell for a year and structs are storing as refCell, also you have Int key which cost 256 bit storage, ... and more things you should think on them (reply to 11659)

Aleks: thank you, this will force most projects to abandon such ventures). Maybe you could recommend a link to a handy cost calculator in Ton? Or is everything done manually at the moment? (reply to 11663)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If you need on-chain storage space, store your data as JSON or XML on a file and use TON STORAGE SDK and store larger data with very small cost. (reply to 11662)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: We have many open source libraries that you can use to read and write data to local files, load data from chain, ADD, READ, UPDATE, DELETE them and send it back to the chain (reply to 11665)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://docs.ton.org/develop/smart-contracts/fees (reply to 11664)

Alireza: Hi guys. I have a question. How does the jusdt/jusdc maintain its stability on TON?

Howard: decentralized based on oracle: https://bridge.ton.org/ (reply to 11669)

Alireza: Is "jusdt jetton wallet" same as other jetton wallets? (reply to 11670)

Howard: yeh, same code

Alireza: Thanks (reply to 11673)

— 2023-12-20 —

Howard: what is these default info in out output folder, looks still very high tech for me 🤣 (In out output folder when after compiled)  I can't understand why has the IPFS stuff?

Andrey: why ipfs, not ton storage? (reply to 11682)

Howard: good question, I am not compiler expert, but maybe it's a potential improvement. (reply to 11683)

Bear: seems this is not work

Bear: Got the empty content

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You should read more about Force Casting Slice.toString() docs.tact-lang.org (reply to 11686)

Bear: wdym? (reply to 11693)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: let sc: slice = cell.asSlice(); dump(sc.toString()); (reply to 11695)

Bear: OH!

Aleks: Hi guys)! I want to continue my questions about map type.  ok, let's say we changed our mind about storing strings)  1. and i decided to store 1000 'bool' type in a map<Int as uint8, Int as uint256> of 4 elements (250 'bool-bits' in each uint256). how much will it cost the contract per year? Based on the calculations here: about 0.00072 TON + a little over 4 uint8?  2. or let's say i decided to store another - map<Int as uint16, Int as uint256> of 1000 elements and also in the contract. Then it will cost : approximately 0.184 + 0.012 TON per year.  Is that right? or how is the map stored in the contract, will it be more expensive? (reply to 11663)

Dmitry | backend4you.ton: You need 1 bit to store bool itself. Int256 can store 256 bools. You will need only four int256 if you learn about bit operations and bit shifts :)

Aleks: yes, that's what I'm talking about) my question is about the cost of storage. tell me pls, am I doing the calculation for the map correctly for storing 4 uint256. or will it be more expensive? since, 256 * 4 + 4 the key will be more than 1023 bits and 1+ cells is obtained.. and it will be more expensive? (reply to 11701)

Aleks: I took 250 bits out of 256 for the convenience of counting

Dmitry | backend4you.ton: using 4 int256 (into one cell) does NOT need using any map. if you want to use map - it will take more space (and cells) of course. You may try to store them in testnet and check storage length in explorers, or check dic serialization algorithm to understand how complex it is.

Aleks: Thanks, I will test it. But if need to scale much more than 4 elements, and store, for example, 1000+ mutable uint256 for the contract to interact with them, then can't get away from map..in Tact (reply to 11704)

Bear:         let sc: Slice = forward_payload.asSlice();         dump(sc.asString()); (reply to 11696)

Bear: asString()

Bear: do we have function can put Address data type to String?

Bear: I saw there has XXXX.asSlice().asString()

Bear: anyone know how the String concat is properly as TypsScript in Tact?          let b: StringBuilder = beginString();         let a: String = (self.return_string_1!!).asSlice().asString();         b.append(a);         b.append(myAddress().asSlice().asString());         b.append((self.return_string_2!!).asSlice().asString());

Mehdi: In context of TVM , we can access to 3 type of instruction,  third was those which address outside of actor registry and incoming message,  I know it would be cell and cell hash can be used as something like index ,to bring it to context,  but I don't know where this Cell reside? Is it on master chain ? At the end we should have a database mechanism to find those instruction and bring them in scope. Anybody can help?  Why this question is important,  because in smart contract that have huge usecase , like wallet by using this technique we can reduce storage fee significantly,  like v5 of tonkeeper, in their repo , they said we used shared library,  in master chain . But I don't know how they did that , and which process should be carried out to have this facilities.  Database concepts in TON ,  and how they really works is hard to grasp . Block , smart contract , have id , but what about something like library or specefic cells?

— 2023-12-21 —

Howard: https://chat.openai.com/share/b74254b5-cd07-4f55-8e3f-409772f4bfd2 (reply to 11713)

Howard: what. is your question specifically? (reply to 11713)

Hakiem: Hi guys, is it possible to override a recieve(msg) of an inherited trait?

Mehdi: Thank you, is this information chatgpt brought valid ?  It said we can access other smart contract  ,and also it's register that maybe have cell which maybe include instruction . If this is correct, we solve our half our problem. (reply to 11737)

Howard: Yea (reply to 11741)

Mehdi: Let's simplify my question, how we can access shared library.where this library reside?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: how? you can't override receive(msg), but you can do it via an virtual function:  virtual inline fun mint(msg: JettonMint) {     // minting code }  receive(msg: JettonMint) {     self.mint(msg); }  or abstract function: // override this function in inherited contract abstract inline fun mint(msg: JettonMint);  receive(msg: JettonMint) {     self.mint(msg); }  then: override inline fun mint(msg: JettonMint) {     // override the virtual method or implement abstract }  However, if you need context in your function, I recommend that you pass the context as an object to your virtual function to avoid losing the context. virtual inline fun mint(ctx: Context, msg: JettonMint) {     require(ctx.value >= self.min_value);     // minting code } (reply to 11743)

TORUN: ❤️❤️❤️💯💯💯💯💯

cell: Guys, i really need your help  Check this: https://tonviewer.com/transaction/887ee627659d1940bde6fc1802e678a6995bd17cdb43a39702212ef062a24cf8  Transaction failed at compute phase but was never returned to the sender  I used "require" which sender not passed. Why contract didn't return transaction??

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: can you confirm that 15612 is related to this require? you can check it via contract.md file inside build output folder (reply to 11750)

cell: All other transactions was returned as it should Just this one for some reason was not bounced

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: well, I faced losing context in my local development for past few days, I'm not sure this is a bug related to TON or tact. is it a function from a trait?

cell: Looks like all explorers did something wrong with this transaction Because code is right, everything should work

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: can you share message body from sender?  also, Bool has false as default, you should be careful on using require(false) in your code (reply to 11753)

cell: It was standart transaction from tonkeeper, without comments (reply to 11756)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧:     fun IsPlayerOutGame(address: Address) : Bool {        return  self.players_list.get(address) == null;     }  or something more clear: require(self.players_list.get(address) == null, "Error: This player in game already!"); (reply to 11756)

Howard: thanks for highlight! (reply to 11745)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: This is a serious issue, I request you to refer this issue with your wallet support. According to the details of the transaction, this is related to the type of send mode, that was sent as non-bounceable.  transaction was aborted but not bounced (reply to 11757)

cell: Contacted them, will post about results  Thank you (reply to 11760)

cell: Yep, they confirmed. Tonkeeper error, when you copy last 'sent' address and send again.

Howard: 💪

Bear: do we have:   (condition) ? value_if_true : value_if_false，  in tact?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Sadly no. We have it plus more in new roadmap, some of them (not this one) already merged. Not published yet. (reply to 11775)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: However, it's available on func, so you can use it to simplify the output file. (reply to 11775)

Bear: R u the tech lead? (reply to 11776)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I am an ordinary community member who is interested in TON & TACT, nothing more 😁 (reply to 11784)

— 2023-12-22 —

Barney Gumble: Hello, where can I find the merkle proof code for cNFT?

— 2023-12-23 —

Howard: is there any possible to set init.code & init.data in Tact?   My friend want to implement the contract that enable to receive the message ONLY from WalletV4 interface.

Muhammad Javad: Is there any gas-less function in tact like view functions in solidity ?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://docs.tact-lang.org/language/guides/functions#getter-functions (reply to 11852)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Isn't that exactly what we do when minting NFTs?  My friend want to implement the contract that enable to receive the message ONLY from WalletV4 interface. It has not been explained which feature of version 4 is required on the contract? (reply to 11849)

Hakiem: hey guys, what is tact lang deployer max contract size?  Got this error response:     data: {       name: 'MulterError',       message: 'File too large',       code: 'LIMIT_FILE_SIZE',       field: 'file',       storageErrors: [],       statusCode: 500     }  BOC Size: 6638 bytes is too large?  Is there an alternative deploy method that supports larger contracts?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you can create your own deployer, I had same problem when I tried to use blueprint providers (reply to 11855)

Hakiem: how did you do that? any references? (reply to 11856)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: file: main.ts import { Cell, Address, internal, contractAddress, toNano, fromNano, SendMode } from "@ton/ton"; import { TonClient, WalletContractV4, TonClient4 } from "@ton/ton";   export async function deployAwesomeContract() {     // create client     const client = new TonClient({         endpoint: 'https://toncenter.com/api/v2/jsonRPC',         apiKey: 'YOUR_API_KEY'     });      // crerate sender     let workchain = 0;     let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));     let secretKey = keyPair.secretKey;     let wallet_contract = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });     let my_wallet = client.open(wallet_contract);      // send deploy     let balance: bigint = await my_wallet.getBalance();     let init = await AwesomeContract.init(contract_init_params);      // Compute init data for deployment     let destination_address = contractAddress(workchain, init);      let deployAmount = toNano('0.2');      // send a message on new address contract to deploy it     let seqno: number = await my_wallet.getSeqno();      let res = await my_wallet.sendTransfer({         seqno,         secretKey,         messages: [internal({             value: deployAmount,             to: destination_address,             bounce: false,             init: {                 code: init.code,                 data: init.data             }         })]     }); } usage: $ cd path/to/root/of/main.ts $ npx ts-node -e "import * as Helper from './main'; Helper.deployAwesomeContract()"  EDIT: converted to reusable helper script https://t.me/tondev_eng/39700 (reply to 11857)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: fill it and you have your owned (reply to 11857)

Hakiem: awesome! thanks let me try that out

Howard: Nah, we don't (reply to 11854)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: however, you can do it by passing mnemonic and wallet version to blueprint via inline args or .env file, but with this script you have full control on deploying (reply to 11860)

Mehdi: Friends , I find the answer ,Library Cells is a special Cells ,  Library cells are used to store common or reusable code that can be referenced by other cells. They promote code reuse and modularity.

Mehdi: This question (reply to 11713)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is from your GH 🤔 fun mint(sender: Address, msgValue: Int) {     // TODO: if (is_initialized == false) { // next_item_index == -1 }     require(self.next_item_index >= 0, "non-sequential NFTs");      let nft_init: StateInit = self.getNftItemInit(self.next_item_index);     send(SendParameters{             to: contractAddress(nft_init),              value: msgValue,              bounce: false,             mode: SendIgnoreErrors,             body: Transfer{                 query_id: 0,                 new_owner: sender,                 response_destination: self.owner_address,                 custom_payload: emptyCell(),                 forward_amount: 0,                 forward_payload: emptySlice()             }.toCell(),             code: nft_init.code,             data: nft_init.data         });     self.next_item_index = self.next_item_index + 1; } (reply to 11861)

Howard: nativeReserve (reply to 9713)

Howard: it's different. I mean if we want to implement the WalletV4 contract in there, (reply to 11867)

Howard: wait, this field is in Cell Data type right? Let me try out. (reply to 11867)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: make a function that accept cell, and pass walletV4 compile from the client, good luck (reply to 11870)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: or if the contract has force dependency to a special version, store it in contract storage same as we do for nft_item_code (in func);  init(owner: Address, wallet_code: Cell) {     self.owner = owner;     self.wallet = wallet_code; } (reply to 11871)

Howard: ohhhhhhhhh

— 2023-12-24 —

Andrey: Full Tact support in IntelliJ plugin comming soon. Looking for beta-testers, DM to me for instructions

Howard: nice! (reply to 11897)

Ken: When you save an Address in Tact into a slice, it's 267-bits. How to interpret that? What do the bytes mean?

Ken: I thought it should be workchain id + 256bit address = 264 bits

Dmitry | backend4you.ton: https://docs.ton.org/develop/data-formats/msg-tlb#msgaddressint-tl-b (reply to 11909)

PLATFORM: TON Ecosystem News Summary in the Past Week on Tonradar (reply to 352)

— 2023-12-25 —

User<5345724231>: gm

To: Hi

To: wrote a contract, how to check its working in testnet?  Which environment is better blueprint or tact-emulator what is the difference between npx and yarn

User<6322792766>: Hello everyone, its first day im learning Tact and a have a several stupid questions One of them: does tact lang has a lists? eg. [wallet_1, wallet_2...]

User<6322792766>: I didnt find this type in Tact Documentation

Puria: Hi as I know tact doesn't support list  you can use map instead https://tact-by-example.org/04-arrays (reply to 11957)

User<6322792766>: Wow, awesome site! There are all i need, tnx dude (reply to 11959)

Muhammad Javad: How can we call bounced functions in typescript. After compile tact code there is no message param according to bounced message and only loader and store function created. Is that correct to call store function instead send?

User<6322792766>: And the second one: can my contract send Jettons of another contract from its balance? (reply to 11957)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Contract's balance is TONCOIN, but any contract can own other contracts and jetton is one of them. (reply to 11965)

&rey: You need the contract being tested to send message which will bounce. (reply to 11961)

— 2023-12-26 —

Howard: anyone try out cNFT in Tact?   https://github.com/ton-blockchain/TEPs/pull/126

Howard: I mean set up a backend is a new knowledge cost for me haha  https://github.com/ton-community/compressed-nft-api  Hope there has the example api_data I can paste there on testnet to try out! (reply to 11977)

Hakiem: Hey man, ive found that this script works for testnet but for mainnet, the outgoing message with contract init data is not even sent out from the deployer wallet. and every subsequent run returns the same seqno (reply to 11858)

Vincent: hi guys, does anyone know how to use ton's oracle? Or there can be an example, for example, I need to get the eth/usd price on the ton chain, what should I do?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you need api without limit 1 request per sec (reply to 11979)

Hakiem: Ohhh so it's not just request limits but a limit to payload size as well? (reply to 11983)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: also you should use mainnet api key if you want to use mainnet (reply to 11984)

Hakiem: I checked both mainnet and testnet for the same API key (reply to 11985)

Alex: What do I have to do to make the contract work? How do I add an owner wallet and add it to the Blockchain?  loom .com/share/d5c4b4f585e04250a38b425ca5e8803a?sid=84896d00-55bf-42fd-b625-f6285a9cab45  loom .com/share/192558f435534ef29a67817bba850175?sid=7ef4fc5a-ef73-4603-97ab-b74250586fa6

Alex: it tact contract - github .com/wety-dev/jackpot-ton/blob/main/jackpot-ton.tact

Roman: You need configure contract.deploy.ts  see template  https://github.com/tact-lang/tact-template  jackpot-ton.tact - this is only .tact file it alone is not enough

Denis: hey guys. I'm trying to track the transaction , using this manual https://docs.ton.org/develop/dapps/ton-connect/transactions#3-getting-the-result

Denis: but I don't understand how to transfer BOC  to something which can help me to track the transaction..

Denis: for example I have such response (SendTransactionResponse) and what should I do with this? :) te6cckEBBQEA1wAB4YgBTTTXQPfo207XzJPyzHMIIDuYVHiNFK+Wq73KNEMCcmYAOtb8FRgW7CdXUtm5Y18hd5Fq4vbKfbVFa/EuDd1rfzVHaaxhuHRRftfrLDwVTKfzUJS5D+WSPbmTBNIpwntYUU1NGLssVb5AAAAFeAAcAQF5YgAeoo4DUk30YUrimcRBhGWXCuttuicVFyjj0xPxm1Jzw6I8NGAAAAAAAAAAAAAAAAAAALmery4AAAABwAIBA9BAAwEPAAQAAP7+/uAEACJodHRwOi8vZ29vZ2xlLmNvbbrBnxw=

Alex: Thank you❤️ (reply to 11995)

— 2023-12-27 —

Hakiem: hey i still cant send the deployment message despite using a paid toncenter api key (reply to 11985)

Hakiem: But testnet deployment works fine

Alex: how to add this contract.deploy.ts (reply to 11995)

Alex: How to add the contract.deploy.ts file (https://github .com/tact-lang/tact-template/blob/main/sources/contract.deploy.ts) to contract - github .com/wety-dev/jackpot-ton/blob/main/jackpot-ton.tact  for use in https:// ide .nujan.io/

— 2023-12-28 —

Howard: if you want to deploy contract on Nujan.io can just use their template (reply to 12032)

@Yoda93: I go today to my best friend He, because I have a problem such that the device was in the service center for repair and after returning from the service center, it turned out that the phone was in working order Root I didn't know about it until a few days ago, I found out about it when my device started to jam and I went to my best friend's house. Sorry.

Alex: This template? (reply to 12057)

Alex: am I going in the right direction?

Alex: or is it?

Alex: I've been trying to get help from the community to turn the contract around for 4 days now! I admit, I have no experience in creating smart contracts and may be asking primitive and possibly stupid questions.  But logically it's simple, there is a contract on tact (it works )   We need to deploy it  1. to do this you need to deploy an environment (blueprint, ton emulator or nudjan.io 2. to deploy it you need to edit several files, because the most complicated part is the contract itself (50% of the code is already there). 3. Deploy to testnet then to mainnet  What I have already done: I deployed an empty blueprint (npx blueprint test npx blue print run worked) here is the created contract https://testnet.tonscan.org/address/EQCsmbdWOCYeTkTnZb0yizoRr9k_p6Bi2qJjCp2wwFw4MgOp  Here is the main contract - https://github.com/wety-dev/jackpot-ton/blob/main/jackpot-ton.tact  What do I need to add?  paste the jackpot-ton.tact code into contracts/toncoin.tact I assume that I need to make changes to the files build/toncoin/tact_Toncoin.ts and scripts/deployToncoin.ts.  But I don't know what code should be added or edited?

He: Please tell me how to print the dump in the contract during npx blueprint test

averebrand: Looks like you trying to deploy contract with zero knowledge at all. Start from documentation, my friend. (reply to 12068)

averebrand: Not sure, but I think you have to enable dump somewhere in config first (reply to 12069)

Alex: I bluntly admitted that I have no knowledge.   I'm moving away from the task of deploying a smart contract and making it work.   The contract is already in place (it works and it's open).  I'm just asking you to save me time and help me deploy it for myself.   I think it won't take a good specialist long.   I will deploy the code and learn TACT gradually. (reply to 12077)

Alex: I'm not asking you to write me a contract. I'm just asking you to help me run the contract...

Alex: I just asked for help, this is clearly a 15-minute job for a good technician.   it's not like I asked to create a contract, just help get it up and running  The contract has already been created and it's open.

Alex: or does anyone know how to do that?  What's this channel for? If it's really complicated and takes more than 1 hour?

cell: For now you just annoying.  I will change my contract license asap, don’t use it. (reply to 12086)

Alex: and what did I do? (reply to 12087)

Alex: If money is more important to you than technology, I'm willing to not use your code.

Roman: Did you read this?  https://docs.tact-lang.org/start/deploy

Alex: I'm not gonna use his code. (reply to 12090)

Alex: it's not going to make me happy.

Alexander: Hi guys! I'm reading about the Tact now and really excited to try. And I cannot find any info about running local node, like the Truffle or Hardhat one. Is there an option to run a local node or the only way is to use the testnet?

Sergey: Where can I see the best results of the TACT challenge?

Mikhail: Hello everyone, is ton ORBS rpc is dead?

cell: Works for me (reply to 12100)

Mikhail: for some reason transactions are sending only from some wallets, mosst users in our daap cant send transactions (reply to 12103)

— 2023-12-29 —

Vahid: Where can i find example of jetton, nft, wallet implemented by tact ?

Aleks: hi, guys! please tell me. does getgems may see and use the data if it for nft-item and nft-collection is not published off-chain as .json, but is stored on-chain as here in standard? off-chain - all is ok, but don't understand, how encode on-chain nft metadata - attributes: []

Aleks: Wallet | Jetton | NFT (reply to 12117)

— 2023-12-30 —

User<6322792766>: Hi there, i need for russian community group, does someone know?

Denis: https://t.me/tactlang_ru (reply to 12141)

Alex: I believe that YOU invented a simple effective invention as Kalashnikov automatic rifle, in this regard I take my hat off to you and offer you personally and all those who had to be involved in this unpleasant situation my sincere apologies!   The New Year is coming! I wish you to celebrate this New Year with good emotions! (reply to 12087)

— 2024-01-02 —

He: Ask a question How to request A contract's String method under B contract's BT method How to write request body: msg.comment I wrote it as msg.comment.asSlice().asCell() A contract will report an error Invalid incoming message😂

Aleks: msg.comment.asComment() (reply to 12165)

Muhammad Javad: Is there any way to call a getter function of contract A using contract B? (reply to 12171)

Bear: do we have the multi-Signing example before?

Bear: Contract method needs to be set up with a multi-signature system, similar to the TON bridge.   For instance, if there are three validators, the function call operation by the user would only be executed by the smart contract after 2 out of 3 validators have confirmed it.

Howard: maybe can take a look in: https://github.com/tact-lang/contract-payouts (reply to 12174)

Howard: oh maybe this one is better  https://github.com/tact-lang/contract-safe (reply to 12174)

— 2024-01-03 —

Mister Sir: Any devs available???

Pam: 😍👍🏿\

Mister Sir: I’m looking to create something similar to ton punks

Mister Sir: Can u assist (reply to 12192)

Howard: It's just the NFT stuff, take a look my Tact template for NFT: https://github.com/howardpen9/nft-template-in-tact (reply to 12193)

— 2024-01-04 —

Mister Sir: Can I dm you? (reply to 12195)

Howard: any difference for these 2? hahaha   https://docs.tact-lang.org/language/ref/strings#stringascomment-1

Howard: ohhhhh that make sense. Let me update the description here.

Howard: How is the Address type in String format calculated?   For example, how do you convert  EQATqIQLRMCQ9IyrByFLNvHP_iYr4encZF1M8li9KIOG0fL_  into  0:13a8840b44c090f48cab07214b36f1cffe262be1e9dc645d4cf258bd288386d1  in the TON Tact language?

Denis: maybe this can help you https://github.com/ton-org/ton-core/blob/be1f3f84a58d8398a02bf2136f33c72bad9f3a68/src/address/Address.ts#L62 to have a look at the implementation (reply to 12234)

Howard: 🔥🔥🔥🔥

Howard: hashing in Tact is expensive tho (reply to 12235)

— 2024-01-05 —

Howard: noticing a bug maybe:   function Example(bytes: Slice) {         let size: Int = bytes.bits() / 6;         let result: Builder = beginCell();         repeat (size) {             let code: Int = bytes.loadUint(6);             if (code < 26) {                 result.storeUint(code + 65, 8);             }             if (code >= 26 && code < 52) {                 result.storeUint(code + 97 - 26, 8);             }             if (code >= 52 && code < 62) {                 result.storeUint(code + 48 - 52, 8);             }             else if (code == 62) {                 result.storeUint(45, 8);             }             else if (code == 63) {                 result.storeUint(95, 8);             }             dump(result.bits());         } }  The log result will be like 0 at all.

Howard: I've created an issue; it seems the issue is not with beginCell but rather with the repeat for the temporary value.  https://github.com/tact-lang/tact/issues/116  If you are interested, please feel free to get involved. (reply to 12250)

RA: Hi, i use this lib https://github.com/ton-org/blueprint I dont understand how to use dump i enabled options debug but i dont see my dump output

Howard: you need to put inside the receive method. Since get method need you called it (reply to 12255)

Howard: @nonam3e can you try? (reply to 12252)

RA: not working. i put dump to getter and receive but i didn't see dump result (reply to 12261)

Howard: oh, dump seems only support in Int and Cell, the "Hello" String seems not showing in result. (reply to 12263)

RA: https://docs.tact-lang.org/language/guides/debug (reply to 12264)

Howard: anyone try out this? (reply to 12252)

cell: Is it possible to convert address to int? And back

Howard: probably not (reply to 12269)

Ken: yes (reply to 12269)

Ken: converting back would lose some info though

Ken: https://docs.ton.org/develop/data-formats/msg-tlb#msgaddressint-tl-b

— 2024-01-06 —

Howard: can we convert Address to String? Seems not as well.

Howard: so the contract address in TON is able to shows in Int? (reply to 12279)

cell: Found this solution:   address.asSlice().hash()

Dmitry | backend4you.ton: But you can’t convert it back (reply to 12294)

Howard: then how to show the Integer of the address hashing in like this 0:13a8840b44c090f48cab07214b36f1cffe262be1e9dc645d4cf258bd288386d1 (reply to 12294)

Bear: is there the tuple chars = empty_tuple(); from FunC implement in Tact?

Howard: 😶‍🌫️

Howard: if I have a mapping called: map<Int, Address>  is there the way to get the length of this mapping?   I remember we need import the FunC function like dict_length right?

Howard: haha I just found

MonoBit: This will only give you the minimum and the next item in the map. How did you get the length of it? (reply to 12308)

— 2024-01-07 —

Howard: yeh, I choose other way to do that, just using the unique Int value in storage to put as the length in mapping

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Or, a separate counter for avoiding that idx+1 for next (reply to 12339)

Howard: wdym? (reply to 12340)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you have to index your entries if you want to get length by index new item index should be last + 1; but what if you remove some items from the middle? you can use counter e.x array_len Item added array_len += 1, item removed array_len -=1 and get length by returning array_len (reply to 12341)

Bear: how to store the value in 2-layer of the mapping/array in Tact?

Bear: 💀

Bear: 😁😁😁 (reply to 12346)

Howard: ummmmm double mapping>? (reply to 12343)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: first, maps can't support boolean values yet and yes, you can returns array element directly but you have to set it before building struct  if( is null) {     self.user_list.set(index, value); } User {     name: msg.to,     address: msg.address,     fans: self.user_list.get(index)!! } (reply to 12343)

Howard: fans: map<Address, Bool> I think is functioning (reply to 12350)

Howard: The problem here is:  UserList is a mapping, and inside the mapping also has the new mapping. (reply to 12343)

Howard: Seems can't set the value in second mapping tho

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I didn't tried latest version yet, cool news (reply to 12351)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: also you can refer to this conversation  https://t.me/tactlang/9019 (reply to 12346)

Howard: Cool, never tried this before. (reply to 12355)

Bear: thanks for replying, but this is not set data into the Second mapping, right? (reply to 12355)

Bear: Get the value in second layer of mapping is easy. But how can we add the value?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: This is an unnecessary complication, create the element temporarily before store. if(user_list at this user is null) {     self.user_list.set(user_address, true); } User {     name: msg.to,     address: msg.address,     fans: self.user_list.get(index)!! } (reply to 12358)

Bear: Sorry, can you modify agagin? struct User {     name: String;     address: Address;     fans: map<Address, Bool>; }  contract UserRecord {     user_list: map<Int, User>;       receive("A") {         if (self.user_list.get(1) == null) {             self.user_list.set(1, User {                 name: receiver.name,                  address: receiver.address,                  fans: // xxxx.set????             });         } else {             /// DO NOTHING          }     } } (reply to 12360)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: struct User {     name: String;     address: Address;     fans: map<Address, Bool>; }  contract UserRecord {     user_list: map<Int, User>;       receive("A") {         if (self.user_list.get(1) == null) {             let fans: map<Address, Bool> = empty_map();               // or load from storage             let fans: map<Address, Bool> = self.fans_list.get(address);              fans.set(address, true);             self.user_list.set(1, User {                 name: receiver.name,                  address: receiver.address,                  fans: fans;             });         } else {             /// DO NOTHING          }     } }

Bear: Thank you, I am not smart

Igor: q: is there something like remix ide for tact/funC? web-based ide

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://ide.nujan.io/ (reply to 12365)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hello, if you need a reliable, fast and secure backend in .NET for your project, which has all the prerequisites for enterprise projects, send me a DM.  Modular architecture Multi-Tenant (SaaS) Multi-Lingual  Advanced User-Manager + External logins Multi-UI (Angular, Blazor, MAUI, Razor) Admin dashboard + Advanced feature management (per user/tenant)  for more details  commercial.abp.io

To: Greetings! I need to send a message with the body Recover   How do I do it?

— 2024-01-08 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: sender.send({             to: Address.parse(vault),             value: toNano("0.1"),             body: comment('Recover')         }); (reply to 12383)

To: ❤️ (reply to 12407)

He: I would like to ask if the balance value of a contract is always 0, which means that the contract has no gas, will this contract be deleted by the ton chain after a period of time?

Guziec: Guys i am new in the TON world. How to make UI in telegram app? What technologies i need to use?

Asidert: React/Vue (reply to 12437)

Guziec: do you have an exmaple (reply to 12441)

Guziec: best will be to have an example of the game implemented in telegram

Guziec: i think about the app similar to the notcoin

Asidert: https://github.com/vkruglikov/react-telegram-web-app?tab=readme-ov-file (reply to 12442)

Asidert: https://phaser.io/ (reply to 12444)

Guziec: that is great! (reply to 12445)

Guziec: but is there any instruction how to deploy a created application?

Asidert: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site (reply to 12452)

Guziec: wait, the app used as the telegram app is just published as the github page and that is all?

Asidert: Yes (reply to 12454)

— 2024-01-09 —

Howard: does anyone try to implement on-chain data in Tact level?  Basically put the string data into the cell in dictionary. I think using map<Cell, Info>  struct Info {   symbol: String;   name: String; } ?

Howard: https://github.com/Cosmodude/Nexton/blob/2dc90bea82952b6ece90beff29adae0d069a04c9/contracts/NexTon.tact#L106

Howard: Found one. cc @the_cosmic_dude 👍 (reply to 12477)

MonoBit: Hi 👋  What about images? How can we store images on-chain? And how about getgems social links? How do you store those links? (reply to 12478)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: isn't good idea, onchain metadata is usefull for Jettons  however, you can convert your image to base64 string and store it in snake-style cells (reply to 12489)

Bear: if I want to store the unique Cell data in the mapping, should I use hash() or sha256?

Bear: which one cost less

Vlad: Yeah, nft images might be heavy Recommend using ipfs or tonstorage and use a link (reply to 12493)

cell: I receive address from get method, response looks like this:   x{80180A5D3CD50A6164F5DFAEB3579E5CE0A6A8B2D3972479C59AD9DB12352F2E15B_} <=>te6cckEBAQEAJAAAQ4AYCl081QphZPXfrrNXnlzgpqiy05ckecWa2dsSNS8uFbAskZgj   How to convert this to friendly looking address?

Mikhail: Looks like Cell, try to parse it and then try to make Cell.readAddress (reply to 12527)

— 2024-01-10 —

Bear: How to read the Jetton Content

Bear: https://t.me/tondev_eng/41551

Bear: hi all, I have the wired error that only happend when contract deployed a few hours later:  here is my code:     get fun calculateMintPerTime(): Int {         let remainingAmount: Int = self.max_supply!! - self.total_supply;          // Calculate the remaining seconds         let remainingSenconds: Int = self.start_time + (self.total_Duration!! * 3600) - now();         if (remainingSenconds > 0) {             return remainingAmount * 3600 / remainingSenconds / self.mintRate!!;         } else {             return remainingAmount;         }     }  We suspect the error stems from a division issue, causing the same error Code: 4 even when this method is called through get method.   Does anyone know how to avoid this?

Bear: 💀

Howard: maybe remainingAmount is possibly in zero? So there is zero divided by numbers will get error? (reply to 12579)

Ken: Error 4 is integer overflow (reply to 12579)

vishal: I need coding for finding minimum of arrey using pointer

MonoBit: Hello Did you find any answer? (reply to 10800)

Ken: if a loop is not enough then you'll need BTreeMap (reply to 12603)

User<640167606>: Okay good morning

User<640167606>: Where is the guide for token?

Bear: We still will get error of ExitCode 4 after deployed in "a few hours" (reply to 12586)

geky: friends, is this problem solved in any way?  https://github .com/tact-lang/tact/issues/25

Heydar: do we have any books about Tact or func , to learn?

Дмитрий: Hello! What does it mean? I trying to transfer jetton, but exit code is 130. How to fix it? Wallet code is here https://github.com/nonam3e/tact-lessons/blob/main/lesson5/sources/wallet.tact

Mikhail: Nope (reply to 12605)

— 2024-01-11 —

Howard: maybe it's not the correct information. (reply to 10800)

Howard: 👍🏿 (reply to 10860)

Howard: 130:     130: { message: `Invalid incoming message },`   Means your message body is incorrect. You need change / update your TS code to set up the correct message body. (reply to 12637)

Дмитрий: But what and where should I change? (reply to 12645)

Mikhail: da fuq (reply to 12648)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: your msg_body builder, in the your contract's wrapper| app's service (reply to 12649)

Дмитрий: what i should change? code is here I really cant understand what is uncorrect https://github.com/nonam3e/tact-lessons/blob/main/lesson5/sources/wallet.tact (reply to 12651)

Howard: can take a look in my Jetton Code: https://github.com/howardpen9/jetton-implementation-in-tact/blob/748c7d2bf1680c91efe946c92cc139015f3d56b9/sources/1_Transfer.ts#L65 (reply to 12652)

Bear: any auditing firm / service in Tact-lang?

Дмитрий: so, code what i sended here has not errors? (reply to 12653)

Дмитрий: i am sending transactions via tonhub sandbox

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: code hasn't error, written by someone who has great experience in TON, but how you running it? (reply to 12652)

Дмитрий: I am deploying it and trying to transfer jettons via tonhub sandbox wallet (reply to 12658)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: in theory, seems things are good, can you show me some code of your try and also the contract address?

Дмитрий: My wallet: https://testnet.tonviewer.com/EQAuApEkomx4E7vMGv5eNB7Av6_myMhe-3Tmbn6HU3ohvl3d  Here’s all my attempts (reply to 12660)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: well, you are used mode 64 everywhere and your contract's balance is 0, but you asked for forwarding amount to dest address. so, mode, context value and body is not fit. I didn't check other operations (reply to 12663)

geky: there is no way to escape special characters? (reply to 12621)

Ken: Please leave a like if you think this is useful https://github.com/ton-society/grants-and-bounties/issues/413

Дмитрий: How can I fix it? (reply to 12664)

User<640167606>: How do I deploy a token on TON

Дмитрий: minter.ton.org can help you (reply to 12690)

— 2024-01-12 —

sd: @dev_rel scam link (reply to 12726)

— 2024-01-13 —

Дмитрий: Have you a working method to deploy Jetton via VSCode? If you have, can you help me?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you can deploy any contract via devTool blueprint. you have to create your contract with this framework. had useful artifacts for tact's contracts (reply to 12743)

Howard: https://github.com/howardpen9/jetton-implementation-in-tact (reply to 12743)

Lord.: is there any online ide for tact language

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tactlang/12366 (reply to 12768)

Lord.: thank u

Дмитрий: how can i fix it? I just wrote "git clone <url>" and "yarn build" (reply to 12749)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if it's windows OS you should upgrade all packages to the latest version, or build the project using WSL (reply to 12773)

Дмитрий: I use MacOS (reply to 12774)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 1. create new project using npm create ton@latest 2. create contracts with same name as cloned repo's contracts yarn blueprint create Jetton and other contracts — P.S: That repo has multi contracts per files 3. replace contract code one-by-one with codes from cloned repo 4. try to build using yarn blueprint build --all good luck (reply to 12778)

2+4: 11 (reply to 12794)

— 2024-01-14 —

User<6386211635>: Large stakeholders in the digital currency community are called whales. Such market participants may hold exclusive knowledge and receive tips from skilled experts. Several members of the cryptocurrency field track the activity of large participants. Personally, I keep an eye on the channel of one famous strategist. Owing to his guidance, I was successful in accumulating more than 6.4 btc. To join, simply search for in the Telegram find: BigXMag. Try it, you surely won't be disappointed with it!

RA: where can i see emit's work? https://tact-by-example.org/03-emit

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: track your contract address (reply to 12821)

RA: How can i get emit result? (reply to 12822)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: by tracking your contract and a function to inject emit message types to the result (reply to 12823)

Ken: via toncenter api? or directly using RPC? (reply to 12824)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: both are available, also in sandbox at test (reply to 12825)

— 2024-01-15 —

Дмитрий: Hello, i deployed jetton contract, but when i mint token, it isnt shows in my wallet. Jetton walet have balance and owner(my address). Can yoou help me?  url: https://testnet.tonviewer.com/kQBoxBbg8db9vXmY0Dsusdnxs7PvPNR1bhn_uO5lLY585Nui

— 2024-01-16 —

Stone: can the Tact be well used in production?

Stone: i still struggle with the options between func and tact, while func seems to be complexity and tack give more focus on logical.

Howard: Yes, more project using Tact now (reply to 12888)

Piotrek: Hey, I'm trying to deploy Jetton using blueprint framework. How should I pass metadata as Cell argument in constructor?

Piotrek: I have to pass this object as a cell

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: do you want code or you have problem in storing? (reply to 12894)

Piotrek: I want code

Piotrek: Because I don't know how to convert my json variable to Cell

Piotrek: I found this but im using blueprint sdk

Piotrek: https://github.com/ton-blockchain/minter-contract/blob/main/build/jetton-minter.deploy.ts

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: it's not 4-5 lines code, you need some converter, snake cell builder, an sha256 coder, and so (reply to 12898)

Piotrek: Is there any tutorial how to do it?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: everything you need is in this link! (reply to 12901)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/build/jetton-minter.deploy.ts#L42 (reply to 12899)

Piotrek: Yes, but I am using @ton/core and they are using 'ton'

Piotrek: So we are using different libraries

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: they are same libraries, those renamed to @ton/PACKAGE_NAME, (reply to 12906)

Piotrek: But @ton/core doesn't have beginDict

Piotrek: And BitString is different

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I see, well you can build your Dictionary using: let dict = Dictionary.empty(         Dictionary.Keys.BigUint(256),         Dictionary.Values.Cell()     );     Object.entries(data).forEach(([key, value]) => {         dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")));     });      return beginCell()         .storeInt(ONCHAIN_CONTENT_PREFIX, 8) .storeDict(dict)         .endCell();

Piotrek: Or there is other way to solve my problem

Piotrek: I need to calculate Jetton Wallet of my Contract

Piotrek: I have Sale contract that exchanges TON for MyJetton

Piotrek: But this function doesn't work on my Sale contract

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: sorry this is related to your design and I can't help. good luck.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: just a hint: add/update jettonWalletAddress for your sale contract manually, and set address from ton explorer after deploying sale contract.   1. deploy sale contract 2. use your master contract api to get walletAddress by account address (your sale contract address) 3. update wallet address in sale contract (reply to 12918)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: also check this https://docs.tact-lang.org/language/ref/common#contractaddressext (reply to 12919)

Дмитрий: help me please (reply to 12884)

Aleks: hello. XOR ^ operator don't use in Tact?

Ken: you need to do: @name(xor) native xor(a: Int, b: Int): Int; (reply to 12961)

MonoBit: I think this would work too (A & !B) | (!A & B) (reply to 12961)

Aleks: good, thanks!

B_BIG_MIC: Anyone know how to update metadata in deployed contract (NFT contract) ?

— 2024-01-17 —

Howard: Can check in this repo:  👉🏽https://github.com/Cosmodude/Nexton/blob/6a9472da7d14ee13f944015be29780f8fec4b4fb/contracts/NexTon.tact#L76 (reply to 12894)

Piotrek: Now I have next error guys

Piotrek: ...

Piotrek: This call fails with code 4159

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: search for this in your build output in tact_YOUR_CONTRACT_NAME.md file (reply to 13027)

— 2024-01-18 —

Truong: Hi guys, can I ask a question? Can I deposit tokens from a wallet to a smart contract and withdraw tokens from a smart contract to a wallet?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if smart contact has jettonWallet interface yes, else you have to withdraw it from smart contract's jetton wallet (reply to 13055)

Truong: If I want to deposit tokens into a smart contract's jetton wallet using a function within the smart contract, can I do that? (reply to 13056)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: if smart contract function holder has jettonWallet interface yes, else you have to send transfer request to the smart contract's jetton wallet

Truong: I want to write a smart contract similar to staking tokens and earning rewards in tokens. Is there any other way to do that? (reply to 13058)

Truong: So, does the smart contract need a jettonWallet interface?

Ken: TransferInternal does not go through the master (reply to 13060)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: in simple transfer yes, they want to reward stakers by jettons, so they need to mint rewards, and this chart has their design and not mine (reply to 13065)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I haven't see any jetton wallet with stake option yet 🤔

Ken: I see what you mean, but I think you'd need a staking contract

Truong: Is there a way for users to call the stake() function and then transfer tokens to the jetton wallet of the smart contract?

Truong: If it's impossible, how about minting and burning tokens?  Can I mint and burn tokens from the smart contract if I am the owner of jetton minter?

— 2024-01-20 —

Святослав: 13

Firefox (TROJAN) -: Hi guys. I'm trying to build a bot to swap tokens. I don't like using a dex. I want a solution to be faster in swaps. What program language it's better for this task? I would appreciate any ideas. Thank you

Mirka: You want another way to swap tokens or faster language? (reply to 13394)

Firefox (TROJAN) -: to create my own script for swaping tokens. (reply to 13400)

— 2024-01-21 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is a question without minimal background knowledge. learn more about TON, Bridges, DEX, then come back and re-ask your question. (reply to 13401)

Tau: Does anyone here have such script written already?

Howard: which script (reply to 13437)

Tau: To swap tokens (ton for jetton for example) (reply to 13438)

Howard: https://github.com/ton-community/tact-challenge (reply to 13439)

Howard: @Gusarich I think there has a participating list that can let he take a look?

Daniil: what do you mean? (reply to 13441)

Howard: I remember there is a Tact example that building the DEXs by Tact

— 2024-01-22 —

Bear: how many data can we store in Slice

Maksim: a cell can contain up to 1023 bits and 4 references to other cells (reply to 13508)

Boris: So lets say a jetton contains multiple cells to provide token name, description, site ref etc.? (reply to 13510)

Bear: hi, is it possible to failed if my get method is over the 1024 bits like here?        get fun get_jettonMinter_data(): TokenData {         return TokenData {             ownerOfNftItemAddress: self.owner_of_nft_item_address,             costPerMint: self.cost_per_mint!!,             startTime: self.start_time,             maxSupply: self.max_supply!!,             totalDuration: self.total_Duration!!,             lastMintTimestamp: self.lastMintTimestamp!!,             currentMintRate: self.mintRate!!,             acutalMintTimes: self.acutalMintTimes,             contractBalance: myBalance(),             is_owenr_claimed: self.is_owenr_claimed         };     }   struct TokenData {     ownerOfNftItemAddress: Address;     costPerMint: Int as coins;     startTime: Int as uint32;     maxSupply: Int as coins;     totalDuration: Int as uint16;     lastMintTimestamp: Int as uint32;     currentMintRate: Int as uint32;     acutalMintTimes: Int as uint32;     contractBalance: Int as coins;     is_owenr_claimed: Bool; }

Howard: no you wouldn't. Supposedly the Tact compiler will notify you. (reply to 13535)

— 2024-01-23 —

Howard: what is the size of bits we load with storeCoins?

nonam3e: var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))          = VarUInteger n; nanograms$_ amount:(VarUInteger 16) = Grams; (reply to 13578)

nonam3e: 4 + 15 * 8 max 4 min

Andy: hi, "Is it possible to create a mintable jetton using only Tact programming language?"

Andy: no using funC

Howard: Possibly, but need careful about the modularity with DeDust and STON.fi (reply to 13581)

Andy: thanks (reply to 13583)

Howard: 1. The line of Tact I pivot the error doesn't not related with this part of code. (the error pop out in the Tact code of mine is about the Contract 2)  2. The error popped here, I think is not clear enough maybe? Or guessing it's over the limitation of bits or someting I hope in Tact? (reply to 13588)

Howard: I think I found the way to skip this(still will have the error), but I use other tips to avoid this. It's able to compile right now. (reply to 13588)

Yuri: Hello guys, is this kind of import allowed in Tact, I'm getting a "Could not resolve import" error:

Howard: adding the xxx.tact   like import "./imports/stdlib.fc"; import "./jetton"; import "./message.tact"; (reply to 13593)

Yuri: Didn't work (reply to 13602)

Maxey: This works for me!

Yuri: Have you tried going back to parent folder? ('../parent_folder/something') (reply to 13610)

Maxey: I remember this can't work (reply to 13612)

Yuri: Is it something that will be fixed? (reply to 13614)

— 2024-01-25 —

Yuri: Hey guys, what's wrong with this?

Yuri: It's inside a trait

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You have a method without correct return, and this isn't that one. (reply to 13701)

Yuri: It seems it's the method to return the contract data (reply to 13703)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You asked where is the problem? I advised you to review your functions. So leave your imagination and use the provided guidance.   hint: You can start from the functions that have a condition to return values. (reply to 13704)

Yuri: The problem was that I was using an empty return on init function: (reply to 13705)

Yuri: Thanks for the guidance

Howard: Hey guys, I think we don't have hybrid example repo for Tact + FunC in Blueprint template right?

nonam3e: You may create a new contract in your project using any template (reply to 13716)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: yes, there is no limits (reply to 13717)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: also you can extract your utils|helpers|constant as func and re-use them in both func & tact (native) contracts (reply to 13716)

— 2024-01-28 —

Howard: awesome

Yuri: Hello, this is not having the desired behavior, i.e., the index is not being appended as a string, what am I missing?

Yuri: Found the problem already

Boris: and what was the problem? (reply to 13865)

Yuri: I created two mocks, one for NFT with royalties and another without. I added the index to the one with royalties but forgot to also add it to the other one (reply to 13870)

Yuri: Sorry to bother hehe

Alireza: Hi guys Does anyone know how the error string we use in require command transpiles to integer exit code in throw command in FunC?

— 2024-01-29 —

Mikhail: Hello everyone, we're currently developing a project on ton and currently on testing phase so we're facing problem with high prices for transactions. We have like 5 contracts, which communicating with each other, and some simple transaction with NFT transfer+ store a few bits on-chain costs almost 0.5 TON.   Since we are building gasless system for our users, it makes very difficult to always have balance on dev accounts (and it's also costs lotts of money).  So we're currently looking for an option to "batch" our transactions, is there a way?

nonam3e: Try to optimize your contracts, rewrite them on func or change the architecture (reply to 13933)

Howard: In FunC, you define the Int yourself. But Tact is auto-generated in it. (reply to 13904)

Alireza: Thanks I'm looking for the algorithm which auto-generates it (reply to 13945)

— 2024-01-31 —

Yuri: Hello guys, is this gonna be fixed? I came into another situation that I'll need to import something from the parent folder. (reply to 13612)

Anton: hey Yuri, raising priority for this, will be fixed soon (reply to 13993)

Yuri: Thanks! (reply to 13996)

— 2024-02-01 —

User<6322792766>: Hello everyone  Is there any way to convert String to Int?

Howard: yeh, put it in slice and decoded it.

Daniil: .

Daniil: Ryzen@DESKTOP-88VUM72 MINGW64 ~/Desktop/FirstTact $ npx blueprint build npm ERR! could not determine executable to run  npm ERR! A complete log of this run can be found in: C:\Users\Ryzen\AppData\Local\npm-cache\_logs\2024-02-01T19_43_18_496Z-debug-0.log

Daniil: help me please

— 2024-02-02 —

Howard: I think it's the Windows issued? Have you install the package successfully before (reply to 14062)

Daniil: Windows. I installed node.js again, created new tact project, nothing changed (reply to 14072)

Howard: What is the difference for:      forward_payload: Slice as bytes64;      forward_payload: Slice as remaining;      forward_payload: Slice;

User<6322792766>: Can i convert address type to Int or String?

User<6322792766>: address.toString() returns an error

Howard: Turn the Address type or Slice type, then toString() (reply to 14080)

Sol: Hello.I address to you as to the most experienced, I study in tone dev studio on the second stream, and very tight in the financial plan, scattered about 5-6 resumes, most of all liked from the study smart contracts on the tact, tell me how to tighten their skills, how to find a paid practice, maybe somewhere need my help? I am free a lot of time.try to give it to study

Howard: Noticing a different in FunC and Tact compiled FunC;    In Jetton, we use Cell in forward_payload

Howard: In Tact, how do we show the either?

Howard: I checked all the compiled Tact file in FunC, can't find Either words there.

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm sure this Either word is an adjective the author used to describe the use of payload and has nothing to do with tact or func  Either = both  meant of Either in TL-B description = both maybe Cell or Cell meant of Either in custom_payload description = both sender or receiver (reply to 14087)

Howard: Nah. The format does matter right?   Some issues happens when testing with other protocols. That’s why I am mentioning this. (reply to 14088)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is npm error, sometime you can solve it via npm cache clean --force can you share your dependencies from package.json file please?  do you have nvm installed? use latest stable node version (reply to 14075)

User<6322792766>: Slice doesn't have this function (reply to 14082)

— 2024-02-03 —

Howard:  /// Converts an Address to a hex string. /// `prefix` is whether the output should have a "0:" prefix. /// Returns a `Slice` that can be converted to a `String` using `asString()`. extends fun to_hex(self: Address, prefix: Bool): Slice {     let s: Slice = self.asSlice();     s.skipBits(11);     let addr: Int = s.preloadUint(256);     if (prefix) {         return ss_concat("0:".asSlice(), addr.int_to_hex(64, false));     }     return addr.int_to_hex(64, false); }  inline fun ss_concat(str1: Slice, str2: Slice): Slice {     return beginCell().storeSlice(str1).storeSlice(str2).asSlice(); } /// Converts an integer to a hex string. /// `num` is the integer to convert. /// `nibbles` is the number of nibbles(4-bits, or a hex character) the output should have. /// `prefix` is whether the output should have a "0x" prefix. /// If `nibbles` is less than the number of nibbles needed to represent `num`, the output will have the MSBs truncated. /// If `nibbles` is 0 then the output will have the minimum number of nibbles needed to represent `num`. /// If `nibbles` is greater than the number of nibbles needed to represent `num`, the output will be left-padded with 0s. /// Returns a `Slice` that can be converted to a `String` using `asString()`. extends fun int_to_hex(self: Int, nibbles: Int, prefix: Bool): Slice {     let b: Builder = beginCell();     if (prefix) {         b = b.storeUint(12408, 16); // "0x"     }     if (nibbles == 0) {         let n: Int = self;         while (n > 0) {             n = n >> 4;             nibbles = nibbles + 1;         }     }      let i: Int = 0;     while (i < nibbles) {         let nibble: Int = (self >> (4 * (nibbles - i - 1))) & 0xF;         if (nibble < 10) {             b = b.storeUint(nibble + 48, 8); // 0-9         } else {             b = b.storeUint(nibble + 87, 8); // a-f         }         i = i + 1;     }     return b.asSlice(); }   Put Address Type to Slice    Reference: https://github.com/ton-society/grants-and-bounties/issues/413 (reply to 14098)

Howard: Would be great if you can leave commend for this grant, @kenxfi spent lots of time test the string library out:  https://github.com/ton-society/grants-and-bounties/issues/413 (reply to 14098)

Ilya: Has anyone already tried to implement cnft on tact? please share a link.

— 2024-02-04 —

Yuri: Hello guys, I'm trying to do the following: inherit NftCollectionTrait on SbtCollectionTrait, though there're some abstract methods on NftCollectionTrait which I don't wanna implement in the SBT trait. Is there a way to do so?

Howard: I guess you need copy the code then delete the non-use part. (reply to 14137)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: best practice is creating new trait without non-use parts. if there is no way to do this, override that functions with throwing "not supported" (reply to 14137)

Mirka: Do I understand correctly that there is no way to update tact contract?

Dmitry | backend4you.ton: Any TON contract can’t be updated unless old (already deployed) contract version has special pre-coded instruction(s) to update itself. (reply to 14149)

— 2024-02-06 —

Nazar: How I can verify my smart contract on testnet?

Sol: Hello everyone. How much does a smart contract developer or tester earn?

Vanëk: how can i help?

— 2024-02-07 —

User<6295881685>: 18 (reply to 14278)

— 2024-02-08 —

Plantoshi 🌱: 15

Kip-: 12

Bear: do we have the sqrt in Tact?

Howard: maybe can use pow(x, 0.5)  https://docs.tact-lang.org/language/ref/math#pow

Andrew: In tact, I think cell is object, slice is stream style of cell  Builder → Cell → Slice  let slice:Slice  = c:Cell.beginParse(); (reply to 14085)

Andrew: In tact There is no support for Either since it does not define what to pick during serialization in some cases.

фил таунс: 10

Seitaro: It seems that pow arguments are integers. There is sqrt in mathlib.fc: https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/mathlib.fc#L37C1-L37C24 probably you can link it manually (reply to 14293)

Victor: 8

Howard: yes.... need to import sqrt function from FunC library will be better (reply to 14300)

— 2024-02-09 —

Mikhail: Hello, does anyone have problems with deploying via blueprint right now? seems like ton.access.orbs is dead or smth. https://ton-access-status.herokuapp.com/

cell: Testnet dead For orbs (reply to 14337)

Anton: Fixed on the main branch now, will make a new release soon (next week most likely).  I have a test for the fix, however, I would appreciate it, if you could check the fix works for you (notice that you’ll need to install Tact from GitHub’s main branch to test it) (reply to 13993)

— 2024-02-11 —

Aleks: Hello.  self.my_map.set(sha256("attributes"), beginCell().storeSlice(  StringBuilderWithVeryLongString.toString().asSlice()  ).endCell());   that's the error if the string (onchain nft attributes) takes up more than one cell. How to do it right?

Aleks: now have done it this way. It doesn't look very effective, but it should work.  self.my_map.set(sha256("attributes"),   beginCell().storeUint(0, 8)  .storeSlice( StringBuilderPartLongString_1.toString().asSlice() )  .storeRef( StringBuilderPartLongString_2.toString().asSlice().asCell() )  .endCell() );

Howard: why is our tact lang is storing the other contracts initial code in here and with 16 there?

Howard: if you want to deal with on-chain metadata, take this: (reply to 14375)

Howard:         self.itemContent.set(sha256("name"), beginCell().storeUint(0, 8).store_slice("Nexton Staking Derivative".asSlice()).endCell());         self.itemContent.set(sha256("description"), beginCell().storeUint(0, 8).store_slice("Holds information about the user's stake in the Nexton platform pool".asSlice()).endCell());         self.itemContent.set(sha256("image"), beginCell().storeUint(0, 8).store_slice("https://raw.githubusercontent.com/Cosmodude/Nexton/main/Item_Image.jpg".asSlice()).endCell());

Aleks: thanks, this code and the link to this example contract above from you helped me a lot!   yes, but i'm also trying to keep attributes that the contract calculates itself, accordingly, i create StringBuilder : with the necessary type/values.  let attr: StringBuilder = beginString();     attr.append("[{'trait_type':'attrName1','value':'");     attr.append(data.attrName1.toString());     attr.append("'},{ ............many attributes..........").     // ...many other attributes  But if the final string takes up more than 1 Cell, then storeSlice does not allow this to be done (the method stops with an error), that is, i am looking for a best practice, a way (as far as possible in Tact) to create from string of more than 1 cell and save it as onchain data in the correct snake format for NFT. (reply to 14395)

Aleks: btw, store_slice stdlib Func and storeSlice tact .. the same thing as i understand it?

Howard: yes, but only a few you can use by import the FunC code:  https://github.com/Cosmodude/Nexton/blob/main/contracts/NexTon.tact (reply to 14399)

Белый: How I can receive ton society nft?

— 2024-02-12 —

Yuri: Hello Anton, could you tell me how to install Tact from the repo? I just found how to install using NPM in the README. (reply to 14343)

Bear: what is the nativeRandom in Tact? Is it safe to use? Can anyone emulate the result from off-chain ?

Anton: hi Yuri, looks like something like the following should work:   git clone https://github.com/tact-lang/tact cd tact yarn build && yarn gen  cd TO-YOUR-PROJECT-FOLDER npm install PATH-TO-YOUR-CLONED-TACT-FOLDER   Basically, it’s a local package installation. Worked for a Blueprint-based Tact project (reply to 14424)

— 2024-02-13 —

User<6955603556>: @dev_rel @corefather @JettSnow Did you implement cNFT in Tact ?

Howard: Good question, no! Haven't try. Since it's need set-up the API to send the merkle tree data! maybe @nonam3e ?

nonam3e: there's no reason to do that

nonam3e: tact doesn't support exotic cells

Bear: 👍👍👍

&rey: Is it so? (reply to 14454)

nonam3e: haven't seen examples of usage or references in sources (reply to 14456)

&rey: That doesn't mean that it's impossible, right?) (reply to 14457)

nonam3e: I haven't said it's not impossible, but right now the implementation of such contract on tact seems to be more complicated than on func (reply to 14458)

Howard: I am noticing the sendingRemainingValue will failed if the case like this

Gekodô: Why does this token not verified message appear?

Vladimir: Defence from scam. (reply to 14465)

Gekodô: Create now (reply to 14466)

Gekodô: There must be something wrong with http://minter.ton.org/ (reply to 14466)

Vladimir: The TonKeeper marks all the tokens that he is not sure about. Why wouldn't he mark your token that you just created like that? (reply to 14473)

Gekodô: I created 3 new tokens, and the message says not verified, if all the tokens created are marked as not verified, how will people know which is the real one? (reply to 14474)

Mikhail: hello guys, aren't "coins" and uint32 are the same thigs?

Mikhail: droppting me exit code 5 which means int out of range, but i am trying to store 1 TON in uint32, what can cause problem?

Dmitry | backend4you.ton: maybe "verification" is some additional procedure that should/may be executed after creation. so users can distinguish newly created and "verified" tokens... (reply to 14475)

Vanëk: one "s" change all mention about this sites link (reply to 14473)

Vanëk: hyperlink althou

— 2024-02-14 —

Yuri: Hey, still trying to clone the repo, but my internet connection is not good and I'm getting this: (reply to 14427)

Yuri: Trying for 2 days already hehe

Yuri: Hey, all good, I could get it by doing shallow clone: git clone --depth 1 https://github.com/tact-lang/tact

Yuri: @AntonTrunov It worked fine

Anton: Thanks for trying it out, really appreciate it. I can now cut a new release (reply to 14512)

Howard: nice emoji lol (reply to 14465)

Howard: That is managed by TonViewer team, maybe you can update once you verified more infos. (reply to 14475)

Howard: no, coins data type means 120 bits?   details can check: https://tact-by-example.org/02-integers (reply to 14476)

nonam3e: No, coins struct is the alias of VarUInteger 16 (reply to 14519)

Mikhail: Hello everyone, trying to add "forward_payload" as cell to JettonTransfer. Storing this like:      let a = Cell.EMPTY.asBuilder().storeUint(2,8).storeUint(0,256).storeUint(2,256).endCell();  Getting error: Error: BitBuilder overflow  Any suggestions?

Mikhail: Why does forward_payload is storing as builder? not as ref?

Mikhail: @dev_rel

Howard: once the function called it will do another works I remember (reply to 14522)

Howard: Also, what you need to know is that, forward_payload is in Slice data type in Tact

Mikhail: yep, but i am calling it from front-end and compiled type is Cell, and for some reasong it's converted into builder (reply to 14522)

Howard: If it's in the output folder(compiled) file, the you should be fine. (reply to 14528)

Mikhail: Could you please help me with other question: Do we need to have balance on NFT Item contracts? or it is ok if it's has 0ton balance? (reply to 14530)

Mikhail: or we still need to pay for storage to know who is owner of nft etc.

Howard: you need keep some tonCoin for Storage Fee(the fee for Contract staying in Blockchain (reply to 14531)

Mikhail: Can i somehow know how much kb is my contract require for storing? Also i would like to know if i need to pay for storing contract code on-chain, not only data inside it (reply to 14533)

Dmitry | backend4you.ton: Yes, you should pay for code and data. You may look at compiled BOC length before deployment - it’s you code. Or check in any explorer after deployment. (reply to 14534)

Mikhail: i have like 20k nft's, we need to make migration to newer nft-contract and remint nfts to our users. Is there a way of minimizing costs? Seem's like we need to attach at least 0.05 ton for each NFT to store data at-lease for 2.5 years, (reply to 14535)

Dmitry | backend4you.ton: Ask users to pay for re-minting :)

Boris: Sorry for the dumb question, but where do this identifiers come from? Are these compiled functions?

Denis: crc32 of TLB scheme description

Denis: it's not forced by code. just agreement between people

Boris: Ok, those are types, but do you have to include them manually?

Boris: ok, I'll search for it (reply to 14545)

Boris: Thx

— 2024-02-15 —

Howard: 🌊 anyone? (reply to 14464)

Andrew: this HEX is not mandatory, tact compiler will compute it automatically, BUT if you give a value as the screenshot, that means to OVERWRITE the default value and use yours. (reply to 14544)

Boris: unclear how to decide which value to provide (reply to 14556)

Boris: just some value?

Andrew: no need to provide this value by default. (reply to 14557)

Boris: so, why would you provide a value?

Andrew: If you want to overwrite it, you will know how to decide.

Boris: ok

Boris: do you have a small example? (reply to 14561)

Andrew: Not yet.

Jay: Hi team, anyone getting 503 when calling tact deployer?

Mikhail: Hello everyone, does anyone have experience in migrating nft collections?

Mikhail: we need to migrate up to 20k nfts

— 2024-02-16 —

User: from one wallet to another? (reply to 14575)

— 2024-02-19 —

Mikhail: nope, we had nft contract. users mints our nfts with more thank 20k supply. Due we still in testnet and many of our contracts need improovements and new functionality, we want to migrate nfts of our users to newer nft-contract. So now we spent more thank 2-3k TON to migrate them to a newer contract. We would like to know if there a better way of doing this (reply to 14608)

Mikhail: Hello everyone, how much bits do i need to load to read Bool from slice? is it 1 bit?

@Yoda93: Just sell it all and take benefits for ton tact team

Mikhail: Like it's said that it's stores it as Integer, but it would be stupid to store it as 257 INT, that what it is?

Mikhail: then i guess i need to read it like slice.readInt(1) ? and then to parse it into bool i need to do something like this?  let my_bool: Bool = slice.readInt(1) == -1 ?

— 2024-02-20 —

Kenpach | Cedehub.io: Hello guys - Who should I reach for having our product listed on the TON foundation ecosystem page please ?

Mikey: Hey guys

Mirka: Did you try this link: https://ton.org/en/contact-us? Found it on the bottom of ton.org page (reply to 14696)

— 2024-02-22 —

Howard: 1/ it's the hashing value generated by crc32 method(https://emn178.github.io/online-tools/crc32.html)   2/ In Tact, we help you generate that value based on the TL-B structure you set at the message data. (https://docs.ton.org/develop/data-formats/tl-b-language) (reply to 14544)

🅰🅻🅰🅽: Is there anyone familiar with TVM mechanism? I wish to know whether I can get the message hash from signed BOC or not. If so, how can i achieve it?

Danny: Good morning, please I need help on how I can deploy a jetton fungible written in tact to testnet/mainnet

Truong: https://github.com/howardpen9/jetton-implementation-in-tact (reply to 14763)

Danny: Thanks, will look it up now (reply to 14764)

Mirka: Is it TEP79 jetton? I just know that jetton should be TEP89 to be listed on dedust (reply to 14764)

Mikhail: Hello everyone, Im trying to implement "Ownership Assigned" receiver in my contract, but it's dropping me error over here    receive(msg: OwnershipAssigned) {         require(context().value > ton("0.25"), "Not enough ton sent");         let _token_id: Int = msg.forward_payload.loadInt(257);         let sender: StateInit = initOf CardNFTItem(self.card_collection, _token_id,self.card_collection_owner);                  require(context().sender == contractAddress(sender), "Wrong sender, must be nftItem");

Mikhail: I cannot check if sender is ligit, for some reason it's reverting whole method

— 2024-02-23 —

Aron: Having issues compiling tact contracts with the following      bounced(msg: bounced<Add>){         self.amount = self.amount - msg.amount;     }   The message 100% has "amount" in it as I use it in another receive message, but when compiling I get this error on the bounced receiver:  Type bounced<"Add"> does not have a field named "amount"

Aron: Am I doing something wrong at a glance?

Aron: message Add {     to: Address;     amount: Int as coins; }  not a whole lot to the message

Aron: ahh dw figured it out, the order of messages matters in this case, swapped amount with to and worked

Mikhail: send(SendParameters {             to: contractAddress(lot_state_init),             value: self.msgValue(context().value),             mode: SendIgnoreErrors,             body: CreateLot {                 start_price: msg.start_price,                 creator: msg.caller,                 is_mcn: msg.isMcn,                 token_id: msg.token_id             }.toCell(),             code: lot_state_init.code,             data: lot_state_init.data         }); Having exit code 135: { message: Code of a contract was not found },  What can cause the problem? I am attaching code and data in call

Anton: Can you provide a locally reproducible example, please? (reply to 14905)

Mikhail: receive(msg: CreateCardLot) {         require(context().value > ton("0.25"), "Not enough ton sent");         require(context().sender == self.card_collection, "Wrong sender, must be collection");         require(msg.start_price > 0, "Cannot be 0");         let lot_state_init: StateInit = initOf AuctionLot(myAddress(), self.next_lot_id, self.jetton_master);         send(SendParameters {             to: contractAddress(lot_state_init),             value: self.msgValue(context().value),             mode: SendIgnoreErrors,             body: CreateLot {                 start_price: msg.start_price,                 creator: msg.caller,                 is_mcn: msg.isMcn,                 token_id: msg.token_id             }.toCell(),             code: lot_state_init.code,             data: lot_state_init.data         });     }  well thats it (reply to 14907)

Anton: I meant like a repo with the project file and tests (reply to 14908)

— 2024-02-24 —

Андрей: can you show an example of transferring jetton inside a contract?

Андрей: Как для дебага Address преобразовать в string ?

Андрей: how do I convert Address to string for debag ?

Дмитрий: Hello! How can i transform string type to Address type in contract?

Aydin: The address function:  a1: Address = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"); // bouncable (same foundation wallet)   a2: Address = address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"); // non-bounceable (same foundation wallet) Details here:  https://tact-by-example.org/02-addresses (reply to 15082)

— 2024-02-25 —

Андрей: Hello! How can i transform Address type to String type in contract?

Howard: what is the error code or the Tx you have? (reply to 14804)

Howard: https://github.com/ton-society/grants-and-bounties/issues/413   Reference here: (reply to 15113)

Андрей: is there no ready-made solution now? (reply to 15115)

Mikhail: Ah, it's mine custom, problem is that for some reason addresses are not the same, nevertheless the args of init code are right (reply to 15114)

Андрей: how do I find out how much gas is required to make a call?

User<6328929763>: 😉你好

Howard: can try out in sandbox test framework (reply to 15122)

Howard: I shared in the chat before, maybe can find a bit.   Or you can leave comment in that Github repo so we can push this String library in public!! ❤️😌 (reply to 15116)

Андрей: I didn't find a solution there, can you show it clearly? (reply to 15125)

Андрей: is more gas consumed in the debag mode?

User<6328929763>: 😚你好

Андрей: is there a token source code that is generated on minter.ton.org ? in the tact language ?

Daniil: it's wasn't written in tact. https://github.com/ton-blockchain/token-contract/tree/main/ft (reply to 15133)

Дмитрий: hm. my code isnt work.  admin = address("0:<numbers>")  require(self.owner == self.admin, "Not admin");  There two identical addresses (reply to 15083)

Aydin: Perhaps this is due to wrong format? You have used the "hex" form of the address. Please try "bounceable" or "non-bounceable" forms (you can convert the forms into one another using this url). (reply to 15145)

Андрей: Tell me what the problem may be, sending tokens in the test network does not work out the method Jetton Notify https://testnet.tonviewer.com/transaction/96c7510a624a41db3505d0ccf9b2b3ed168193f7e5dcee36a048fd83078f2e6d?section=trace  Jetton mint here https://minter.ton.org/?testnet=true code my contract: https://pastebin.com/eHF0tdfy

Дмитрий: I’ve tried different forms, nothing changes (reply to 15154)

Aydin: Then please share your code, if possible (reply to 15160)

Дмитрий: admin and owner are one address, like this  self.admin = self.owner;  require(self.owner == self.admin, "Not admin"); (reply to 15166)

TORUN: ❤️

Дмитрий: In test net it works, but in main net not (reply to 15166)

Bear: what would be the newAddress(0, 0) in Tact on FunC?

Bear: parse_addr("0")?

Bear: ;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`. ;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown. tuple parse_addr(slice s) asm "PARSEMSGADDR";

Bear: I have the code in Tact:  if (msg.new_owner != newAddress(0, 0)) { ...... }  Want to find out the way same in FunC

Супер заработок на сокращении ссылок: 10

— 2024-02-26 —

Mikhail: Hello everyone, for some reason im always getting Error that "contrac code cannot be found"          let lot_state_init: StateInit = initOf AuctionLot(myAddress(), self.next_lot_id, self.jetton_master);         send(SendParameters {             to: contractAddress(lot_state_init),             value: self.msgValue(context().value),             mode: SendIgnoreErrors,             body: "test".asComment(),             code: lot_state_init.code,             data: lot_state_init.data         });

Yuri: Hello guys, I'm importing a common contract into two different others, since I need addresses calculated given the InitData. Though, I'm not getting the same address for both given the same InitData. I investigated a little bit and found out that the generated FunC code for the same imported contract was different for each context in just one place, the IPFS link for the ABI. Since the IPFS CID should be the same if the files are equal, I've taking a look at the generated ABI for each case and noticed that there're exit codes that doesn't belong to the common contract, the one I want the address to be calculated, but from the contracts that it's being imported into.

Aydin: 🤔🤔 I see. Could it be related to the recent network instablities? What libraries are you using? (reply to 15176)

Дмитрий: Only TACT I don’t think that troubles in chain can crush my contact today (reply to 15209)

Виталий: 12

Mirka: Is it true that soulbound can be created by removing transfer method from nft?

— 2024-02-27 —

Daniil: Kind of (reply to 15258)

— 2024-02-28 —

Dhrumil: Hey...how do I deploy my jetton contract and verify it??

Mirka: https://verifier.ton.org/ (reply to 15306)

Ravi: If anyone wants to publish your app please contact me

Cyber: Done (reply to 15322)

— 2024-02-29 —

Yuri: Is there any method to store a map in a cell? Turn it into a slice or cell?

Daniil: Why do you have to work with cells in Tact? Can you share your case? (reply to 15367)

Daniil: Usually you just put it into a struct or a message and don't have to think about cells.

Yuri: TEP-64 on-chain HashMapE (reply to 15374)

Yuri: I see, I was thinking on that, I can create a struct with header(uint32) and the map, or a message with the header and just the map inside, right? (reply to 15375)

Dhrumil: What types of data can you use in dump()??

Anton: https://docs.tact-lang.org/language/guides/debug#printing-out-debug-data (reply to 15387)

Dhrumil: Can we not use other types? Like Address or StateInit

— 2024-03-01 —

Samarth: hi guys

Samarth: guys i am facing error while reading the nft contract i deployed using the github link i found online

Samarth: can anybody help me with this

Anton: Addresses are not supported at the moment, as far as I remember (reply to 15389)

— 2024-03-02 —

Spite: There are contracts A and B. Contract A should be able to call initOf on contract B and contract B also on contract A. Is it possible to do this using imports?

Spite: And also why doesn't fromInit from wrapper create a contract with the same address that is obtained inside another contract using initOf? The arguments passed are 100% correct (rechecked several times)

Spite: As I understand it, the only solution is to store everything in one big file 🙂 (reply to 15495)

— 2024-03-03 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Even 10 separate files, they will be put in a big file at compile when you are using imports. (reply to 15499)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If you want to keep your contract clean, import A in B then get initOf B inside A and don't care about IDE errors, your build will be successful but you have to use B build outputs (reply to 15495)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I'm not sure why we still have not import optimization. Sir, What you think about the tree shaking imports before compile? @AntonTrunov

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: If path already imported ignore it or if type exists skip compile instead of throwing

Spite: Problem with compilation (reply to 15504)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Build B and check output/build folder (reply to 15509)

cemorum: Greetings! Any examples on lootbox system smart contrats avalable?

Spite: Contract B imports contract A, which imports contract B. It won't compile anyway, since the imports just take and paste one file into another instead of ignoring cyclic imports and solving the problem of missing types (reply to 15512)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: As a workaround, don't import B into A, when you import A into B, build B's contract and have A & B's assets in the build folder. Forget it, continue with your scenario! (reply to 15516)

Spite: Do you mean that if you import contract B into contract A, then compile contract A, then both are compiled? (reply to 15526)

Spite: Hm, thanks

Anton: @aspite @hitasp could you folks please open an issue in tact-lang/tact about this? I’d really appreciate an example with some reproducible code and the error message you see (if any)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I came across this when I was working on the Jetton contracts. where we need initOf wallet inside master or initOf jetton inside wallet. So I decided to import all contracts inside master, then I would just compile the master contract and my wrappers would be available at the build/Master/*.ts  I’d really appreciate an example with some reproducible code sure, I will (reply to 15530)

Spite: https://github.com/tact-lang/tact/issues/165 (reply to 15530)

Anton: awesome! thanks a lot

Spite: @AntonTrunov, do you have any ideas? (reply to 15498)

Anton: I’ll take a look on Monday (reply to 15535)

Aydin: Just as a raw idea to think of:  What about creating a 3rd contract C which then imports both A and B simultaneously?  Rationale. According to your description about cyclic imports, it seems that contracts A and B should look as peers of each other, with equal ranks in some hierarchy of contracts. So, a third contract C which to be of a higher hierarchy may handle both of them equally. (reply to 15495)

Spite: Not necessarily a contract, you can just create a file that imports two contracts, but still cyclic imports should be handled correctly, because creating 3 files for such a case is not a direct solution (reply to 15545)

— 2024-03-04 —

Aron: If I have multiple send() functions for forwarding TON on to various addresses within a single receive() function, how can I calculate the gas properly without overdrawing from the SC? If I understand correctly using the SendRemainingValue flag for the last txn to refund the user does not take into account all the previous send() functions gas cost.  I can see this was asked before, but is there a clear answer besides manually calculating gas?

Lulzx: Thanks! (reply to 8757)

Truong: Can anyone help me with how to receive the events that a smart contract emits on TON?

Andrew: SendRemainingValue seems CANNOT work when you send multiple messages in one receive method. Sigh~~ (reply to 15563)

🅰🅻🅰🅽: as far as i know, the only way is to estimate gas in your unittest and modify the value in your contract  manually (reply to 15563)

🅰🅻🅰🅽: I hope somedays TVM supports this feature, that will indeed dwindle the difficulty for developing smart contract on TON

Andrew: yes, We need 2 enhancements:  1- distributed transaction management support 2- annotation of receive method about gas consumption (reply to 15577)

Yuri: Hey guys, anyone knows about this? I need to use the NFT Item code in two different contracts but it's generating a different ABI. (reply to 15201)

Yuri: And since the ABI IPFS link goes into the code, different code as well

Luki: hey guys

Luki: Error: Type sendParameters not found

Luki: I keep getting this error when trying to build a token

Luki: any ideas what could cause it

Mirka: Show your code (reply to 15612)

Luki: thanks, but I already  fixed it (reply to 15618)

— 2024-03-05 —

Deepam: Hey I am new to TON & Tact. Can someone share any guide to start creating a smart contract

amir: You can find a “TON Blockchain Course” on Stepik learning platform. (reply to 15650)

amir: But for learning Tact read official documentation.

— 2024-03-06 —

Yuri: Hello guys, I got another problem, since I'm importing 2 NFTs which I need the code to calculate it's addresses and validate on a protocol contract. There're some structs that are common to both (NftData for example). It's not compiling because it says the struct already exists. How can I tackle this problem?

Andrew: move the common struct and message in a new file.tact, and import this file as need. (reply to 15673)

Yuri: But it'll be needed in both NFTs and I also need to import both NFT codes, is that fine? (reply to 15681)

Andrew: import N times in other N files

Yuri: It worked thanks! (reply to 15683)

Daniil: speaking about possible improvements in Tact itself, would the syntax below be good for this situation?   import "./first" as First; import "./second" as Second;  // somewhere in the code First.myFunction(); Second.anotherFunction(); (reply to 15673)

Daniil: I guess implementing imports the way they work in TS would be nice, but we'll also need to maintain backward compatibility and make  import "./file";  identical to  import * from "./file";

Andrew: That is module is not support in Tact by now.

Andrew: Smart Contract project maybe no need module system to keep simple?

Anton: 🚀 Tact v1.2.0 Release Highlights   New Tact v1.2.0 is now live with features requested by the community.   —  Fresh assignment operators  +=, -=, *=, /= and %= —  Readability boost with underscores in large numbers: 1000000000 »»  1_000_000_000 —  Added binary and octal literals: 0b1010_0101, 0o4242_0376  —  Added support for ternary conditional operators let foo: Int = your_condition ? 42 : 0 . —  The equality and non-equality operators (== and !=) now support slices and strings by comparing the hashes of the left-hand and right-hand sides.  Both the official VS Code plugin for Tact and tact.vim have been updated with the new features.   Happy Coding! (forwarded from TON Dev News)

Yuri: Anyone know why I have this problem? (reply to 15201)

Андрей: Tell me how to get a random result from the digital range ?

Mirka: https://docs.tact-lang.org/language/ref/random (reply to 15702)

Андрей: Depending on the result, I return a random number of tokens, the problem is that when forming a request to call a method in the thinkeeper, it sees the result that will be, that is, it does not turn out to be random  В зависимости от результата возвращаю рандомное число жетонов, проблема в том что при формировании запроса на вызов метода в тонкипере он видет результат который будет, то есть не получается рандом (reply to 15704)

Mirka: А ты уверен, что кипер возвращает точное значение? Возможно он просто какое то рандомное число возвращает (reply to 15706)

Mirka: Попробуй это https://docs.tact-lang.org/language/ref/advanced#nativerandomize (reply to 15706)

Андрей: а как тут именно из определенного диапазона получить ? мне к примеру 0 до 500 нужно fun nativeRandomize(x: Int); (reply to 15710)

Mirka: Я тебе предложил попробовать рандом зарандомить при вызове (reply to 15711)

Mirka: fun nativePrepareRandom(); Это например попробуй (reply to 15711)

Mirka: А это вообще подготовка рандома (reply to 15711)

Андрей: а типо такого  temp = random(0, 500) fun nativeRandomize(temp);

Андрей: или как ? не понимаю эти вызовы нужно до или после  вызова метода random их вызывать ?

Mirka: Ты пользовался рандомом в каком-нибудь языке программирования? (reply to 15715)

Андрей: или так ? nativePrepareRandom() res = random(0, 500)

Андрей: не особо углублялся, понятно то что он не по настоящему рандомный а зависит от разных вещей (reply to 15717)

Андрей: Не пойму как эти методы правильно использовать, из нужно перед получением рандома вызвать или как

Mirka: В начале метода делай nativeRandomizeLt(), потом уже вызывай рандом как раньше, эта функция рандомизирует рандом и по идее так кипер не сможет предсказать число (reply to 15719)

Андрей: Спасибо, попробую 👍 (reply to 15721)

— 2024-03-07 —

alchemist: 13

— 2024-03-09 —

Macrov: Hello everyone, I would like to ask if there is a specific size limit for smart contract code on TON, similar to the 24.576K limit on EVM. Currently, we keep adding code to a .tact file, and after a certain point, the compilation fails with an error. However, if we remove some of the code, it compiles successfully again. Any suggestions would be greatly appreciated

Andrew: https://docs.ton.org/learn/overviews/cells (reply to 15821)

Alex: Hello everyone, I have 2 contracts. I need to call the get method of the first contract in the second one. I have his State Init. How can I do this?  Всем привет, у меня есть 2 контракта. Мне нужно вызвать get метод первого контракта во втором. У меня есть его State Init. Как я могу это сделать?

Asidert: Контракты общаются сообщениями же, надо отправить с первого на второй запрос, чтобы второй ответил первому. (reply to 15823)

Alex: Насколько я знаю - get метод не является сообщением. Это можно реализовать через обмен сообщениями, но мне было интересно есть ли возможность вызвать get метод из контракта

Asidert: Из вне можно вызвать, но не из контракта напрямую (reply to 15825)

Macrov: Thank you, Andrew, but I didn't find a very direct answer. In the post-compilation report file, there is a line stating "BOC Size: 20167 bytes." Is there a specific size limit for this BOC size? Currently, my code's BOC size can reach up to approximately 20197 bytes. Is this size a fixed limit for each contract, or does it relate to the types of variables declared and the number of functions in the code? (reply to 15822)

Andrew: I also didn't find a very direct answer (reply to 15831)

Aydin: As I understand, TON contracts are supposed to be as compact as possible. Let me give a comparison.  In Ethereum, contracts have a "monolith" structure; that is, a single (possibly huge) contract can store a list of a myriad of items (tokens, NFTs, etc.) in itself. And when a new item is to be added to the list, a new transaction occurs, extending the size of the contract.  On the other hand, in TON the situation is completely different. TON blockchain works with the "actor model," and this is one the cornerstones of its infinite scalability. In this model, instead of a single giant contract, we have a composite structure of relatively small-sized contracts, consisting of a "parent" contract together with lots of "child" contracts, each of which storing a single item of the list as compared to the above monolithic Ethereum contract. And whenever a new item is to be added to the list, a message is sent to the parent contract which, in turn, generates a new child contract containing the newly added item. This way, infinite extendibility of the list of items is guaranteed in TON ecosystem.  Now, returning to your question, I would kindly recommend you to keep your contracts as compact as possible, and instead try to utilize the actor model of TON. I'm sure you will achieve better results this way. (reply to 15831)

Alex: Good afternoon, I am facing the following problem. During development I used blueprint framework, and I wrote some scripts to interact with contracts in Type Script. I would like to be able to run them from a program, for example to make a website, and on clicking a button - execute the script. I've run into the problem that I can't get a NetworkProvider. Are there any guides on how to do this? I would be very grateful  Доброго дня, Столкнулся со следующей проблемой. Во время разработки я использовал фреймворк blueprint, и я написал несколько скриптов для взаимодействия с контрактами на Type Script. Я бы хотел уметь их запускать из программы, к примеру сделать сайт, и по нажатию на кнопку - выполнять скрипт. Я столкнулся с проблемой, что не могу получить NetworkProvider. Существуют ли гайды как это сделать? Был бы очень признатален

— 2024-03-10 —

Alex: This could be helpful https://youtu.be/Qe0oggjihTs?si=uFdqX7UsMnWDbEcc (reply to 15846)

Alex: Thank you, it helps me (reply to 15860)

Asher: https://www.youtube.com/@WikiMar (reply to 15846)

— 2024-03-11 —

Андрей: Подскажите, есть возможность из func получить код для tact ?

Kon: tact компилируется в func, который потом компилируется в fift, который потом компилируется в инструкции TVM. Так что надо переписывать на структуры tact, если хотите на него перейти из func. Обычно func для оптимизации надо использовать, а общую логику работы вести на tact. func можно подключать в tact и тогда будет всё организовано и оптимизировано достаточно хорошо. (reply to 15897)

Андрей: просто есть код на func, но с ним я не знаком, а синтаксис tact знаю, поэтому хотелось бы к tact привести что бы разобраться в коде) (reply to 15898)

Андрей: вроде видел, можно как то метод на func использовать прям в файле кода tact ?

Kon: да, просто подключайте и всё, https://docs.tact-lang.org/book/functions#native-functions

Alex: Hello guys. Does anyone find the solution or explanation of this problem? (reply to 15498)

Mikhail: had same problem, tried manything but that doest helped, moved to other implementation of code (reply to 15910)

Никита Рязанов: Should a query_id be defined in each Message?I'm trying to receive a custom Message, but it ends up with an error code of 130.

Dmitry | backend4you.ton: Every message may have its own schema. It’s recommended to have query_id everywhere, but every developer decides himself… (reply to 15917)

Dmitry | backend4you.ton: op_code and query_id are different fields. also, throwing 0xffff is a piece of code that developer should explicitly put in func code (unless he has reason not to do this). (reply to 15920)

Alireza: I've mentioned the reason behind 130 exit code. I'm not talking about query_id. about 0xffff, yeah it's something that developer writes in FunC manually but, in Tact, it is done automatically and instead of throwing 0xffff, it throws 130 (reply to 15921)

— 2024-03-12 —

Mikhail: Hello everyone, what are the limitations of using maps inside a message? What is max possible amount of elements in a map if i am using map<Int,Int>?

🅰🅻🅰🅽: in ton, it has a limit with 65535 cell per contract

🅰🅻🅰🅽: which is about 65535*1023 bits for contract storage

🅰🅻🅰🅽: this limitation is in the validation node side, but not in TVM itself

— 2024-03-13 —

Kira: what is language for development ton smart contract ?

Daniil: Tact and Func are most common. You're in the Tact group right now. General TON dev group: @tondev_eng (reply to 16013)

Howard: 👍🏿

— 2024-03-14 —

Adwaer: Hey guys, I'm learning tact and having an issue I'm fighting whole day..  struct InvestorBalanceInfo {     total: Int; } //1 get fun balanceInfo(): InvestorBalanceInfo? {     return self.investors.get(sender()); } //2 get fun balanceInfo(): InvestorBalanceInfo? {     return self.investors.get(address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")); }  It works fine for case 2, but not working for case 1. Please help, how to make work this case 1..  btw.. why blueprint don't showm me logs from dumb method? I've added options: {   debug: true } to CompilerConfig

Howard: get fun balanceInfo(): InvestorBalanceInfo? {     return self.investors.get(sender()); }  I think you will get Null value? (reply to 16077)

&rey: Because there is no sender for a get-method? (reply to 16077)

Adwaer: yeah, I didn't even think about it (reply to 16083)

Truong: hello, can TON sending multiple transactions at 1 time? tks like Sending transaction swap and transfer at the same time

Minh: I have the same problem 😭😭 (reply to 16111)

Jay: I think can use send_pay_gas_separately? I have same problem but never tried it out yet (reply to 16111)

&rey: What SDK do you use? (reply to 16111)

Truong: I use tonweb

CryptoMM Cool: Same question.. (reply to 16111)

Javier: I guess if the transaction is made to a contract, and that contract send multiple messages it is doable.like I send 10ton to a contract and in the internal message op I use a function that send multiple messages to multiple parties. (reply to 16111)

Truong: Tks

Jay: Do you have any code samples on this? (reply to 16122)

Mirka: How much more gas does the tact use than the func?

Javier: It should be the same. Tact compiles to func and then it compiles like func

Mirka: I know that, but I was told in @tondev chat that tact uses more. I mean, that's what I thought, but I need more about the difference (reply to 16137)

Javier: I dont think so, of course since tact is a simpler language, I guess people will make simpler things and store more stuff than needed. But it really depends on what kind of processing the language do in  the end. If a function from tact that compiles in func do 10 operations, and you can do the same with 4 operations in func, probably it will cost more. That would be the normal if you use a higher level language. Is like comparing C# against c++ or assembler. The lower the level of the language, the more optimized it is.

— 2024-03-15 —

Andrei: Hello guys I hope this type of message is allowed  I am looking for a dev who can write 3 smart contracts. Pls pm me - we can discuss it in more details

— 2024-03-16 —

Howard: At this moment, Jetton Transfers may incur twice the gas cost in Tact.  However, there is certainly room for improvement. The higher-level language has more structured patterns, which should allow for optimization at the compiler level.  Although, as of now, Tact is more of a transpiler that helps you generate FunC code after you compile your Tact-lang code. (reply to 16136)

Jay: Agree on this. I feel the same when I first comes to FunC/Fift. It's a steep learning curve for me. After I discovered Tact, I get the job done with fewer line of codes and cleaner overall structure. Personally, I think it worth the tradeoff. 😄 (reply to 16139)

Mirka: Can you please explain how to decompile tact to func.  Is it to possible using blueprint? (reply to 16221)

Howard: decompile? after running the yarn build successfully, then you will get func code in your build folder. (reply to 16246)

Mirka: Oh, Im stupid, thank you (reply to 16249)

Mirka:     owner: Address;     jetton_master: Address;     jetton_wallet: Address?;      init(owner: Address, jetton_master: Address) {         self.owner = owner;         self.jetton_master = jetton_master;          send(SendParameters{             to: self.jetton_master,             value: 0,             mode: SendRemainingValue,             body: ProvideWalletAddress{query_id: now(), owner_address: myAddress(), include_address: true}.toCell()         });     }      receive(msg: TakeWalletAddress) {         let ctx: Context = context();         require(ctx.sender == self.jetton_master, "Invalid sender");         self.jetton_wallet = msg.wallet_address;     }  This code should just get jetton wallet address, but tx always get exit code 9. I know, that its cell underflow, but I dont understand where do I read empty cell.  Here are my messages:  message(0x2c76b973) ProvideWalletAddress {     query_id: Int as uint64;     owner_address: Address;     include_address: Bool; } message(0xd1735400) TakeWalletAddress {     query_id: Int as uint64;     wallet_address: Address;     owner_address: Address?; }

Javier: Arr you sending money for gas fee?

Mirka: Yes, 0.5 ton should be enough (reply to 16261)

Javier: I am seeing in your code value 0, thats why I am asking

Mirka: It has SendRemainingValue mode, but I'll try to set it (reply to 16263)

Sergey: how can I calculate the cost of storing a variable? For example, int ?

Javier: SendRrmainingValue is that it will returning back the money you are sending, but as the value is 0, nothing can be returned. Just saying, not that I really checked your code :)

Javier: There is a formula for the cost of bits. The int depending on the size 8 bits 32 bits 64 bits. That will be the amount of bits (reply to 16265)

Sergey: where can I check  formula? (reply to 16267)

Mirka: Nope( (reply to 16266)

Javier: This is, but the real cost, I don't know. I guess you can try storing a 8bit int, in testnet, then wait for 1 week, you will know about the amount

Javier: I read in the course it should be like 0.5ton or something like that for a year of 1MB. If I remember well 1MB is about 1 million it's of 8bit

Mirka: Can anyone provide code that handles TakeWalletAddress correctly so I can see what I did wrong? (reply to 16258)

— 2024-03-17 —

Mirka: I found out that this happens because the token contract sends me a completely blank message for some reason. Could you please explain how to work around this?  The code only worked when I made all values in the message optional: message(0xd1735400) TakeWalletAddress {     query_id: Int? as uint64;     wallet_address: Address?;     owner_address: Address?; } (reply to 16258)

Mirka: Maybe @dev_rel(sorry fot tagging I just really need this) know, I saw your github with jettons implementations on tact

Howard: int? is not same as int (reply to 16313)

Howard: I don't think here should be the Address? (reply to 16258)

Mirka: Yes, but without ? it was null and I got exit code 9 (reply to 16315)

Jay: Exit code 9 cell underflow, do you pass in storeAddress when calling to the contract? (reply to 16317)

Slava: Hey guys! A few questions.  Is Tact can be considered production-ready right now?  Do we have some serious projects implemented in Tact?  Does it produce optimized code for most cases?  Or are we still safer using FunC for now?

Slava: BTW you did an extraordinary work. Tact looks amazing and very dev-friendly, based on what I've read at the documentation. I'm sure it will attract a lot of new developers to the TON in the future and will dramatically reduce the adoption curve.

Anton: Let me put it this way: I’d say Tact is prototype-ready at this moment. It’s a great solution to create your MVP and encode the core of your business-logic in Tact, interfacing with some manually optimized FunC code when there is gas pressure. There is at least one serious project that utilizes this approach. The output FunC code that Tact produces can be suboptimal in many cases but this is to be expected since Tact is a more high-level language. The Tact team will be working on gas optimizations, though, as soon as we finish the features outlined in the Tact roadmap. You can checkout how these features and bugfixes are spread across different milestones here: https://github.com/tact-lang/tact/milestones. Our main priority are UX improvements and compiler correctness now. We are going to have Tact’s implementation checked by a top-notch software security audit firm and also we are building our own security-ensuring tools, like a compiler fuzzer: https://github.com/tact-lang/tact/issues/133. (reply to 16328)

Anton: Thanks so much for your words. Btw, the recent Tact features were contributed by @Gusarich and the major update to the Tact documentation was done by @novusnota42. Both guys are on the Tact team now, continuing to enhance and improve the language, the docs and the tooling around it (reply to 16330)

Mirka: What do you mean? (reply to 16322)

Jay: How do you call the contract? I think there's something missing when passing in, then contract trying to extract the value, thus causing the exit code 9 hmm. (reply to 16333)

Mirka: Yes, but I dont understand what's the reason Can you try to run my code? I can share it (reply to 16334)

CryptoMM Cool: How to deploy contract wallet when send TON to orther wallet?

— 2024-03-18 —

Никита Рязанов: if I want to get metadata for the nft from the off-chain, is it ok to do it this way?

Никита Рязанов: Mint is happening now, the nft is being created, but the metadata is empty

Mirka: I've noticed that the metadata loads a bit later after a mint, maybe it's just in the tonviewer (reply to 16426)

Никита Рязанов: Unfortunately, it still hasn't loaded, I think I'm wrong somewhere, I can't figure out where (reply to 16448)

— 2024-03-19 —

Silent Warrior: Which website can I create tokens on the TON system?

Javier: minter.ton.org

Silent Warrior: Thank you

Asidert: Paste your NFT address here and check metadata link  https://explorer.tonnft.tools/ (reply to 16450)

Asidert: It seems to be broken

Jeff: Hi, I've opened a issue related to emit log and carry remaining gas. I get an action code 40 or action code 37 when I try to send log message and carry remaining gas message in one transaction. It happens sometimes, but it doesn't, depending on the code. Details here : https://github.com/tact-lang/tact/issues/176. Thanks!

saddas: 10

saddas: 70

Behrang: This field is sent to collection metadata getter before being displayed. Make sure your collection get method works correctly. (reply to 16425)

— 2024-03-20 —

saddas: 15

saddas: hi

Meliboboyev.D: Hi

Kaisar🐾🌱SEEDMEMES🦒🦒PocketFi🐍✌️Yescoiner: Hi

Sergey: I keep getting an error when trying to deploy a contract to the network. How can I fix this?

Mirka: Did you add tonconnect manifest file? (reply to 16688)

Sergey: https://raw.githubusercontent.com/ton-defi-org/tonconnect-manifest-temp/main/tonconnect-manifest.json I don't think I should do this. This is a base blueprint deploy command with run (reply to 16689)

Mirka: Do you have temp folder in your project root? (reply to 16690)

Sergey: yes, with file testnet/tonconnect,json (reply to 16691)

Mirka: What wallet did you connect? (reply to 16692)

Mirka: Maybe try to reconnect it

Sergey: i tried tonkeeper and tonhub ( Does this look like a local problem? Should I try a VPN or something like that? (reply to 16693)

Mirka: I dont think so, maybe you can send connect link and I'll try to connect my wallet (reply to 16695)

Sergey: https://app.tonkeeper.com/ton-connect?v=2&id=bca66bf6a0d5c1d5160859801c9f189e278a27a776039c00c3ed60f73c6ea45f&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fraw.githubusercontent.com%2Fton-defi-org%2Ftonconnect-manifest-temp%2Fmain%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D it will be great if you try it! (reply to 16696)

Mirka: https://testnet.tonviewer.com/kQAk5ujNAx_JmLWKKIzmjwcaeSBB3oPoICX43-IfiI8MlvsR Everything is ok (reply to 16697)

Mirka: I have deployed your contract

Sergey: yes, it's something local. Thanks for the help! (reply to 16699)

Mirka: Try to reinstall tonkeeper (reply to 16701)

Sergey: it seems that now all transactions go through your wallet (reply to 16702)

Sergey: where can I cancel this?

Mirka: Ooops, give me a sec (reply to 16703)

Mirka: I disconnected

D.: 13

— 2024-03-21 —

Howard: I will say yes, lots of project using Tact in production now. (reply to 16328)

Bear: do we have 3^3 = 27 in Tact?  Let's say x^y in Tact

Howard: https://docs.tact-lang.org/language/ref/math#pow (reply to 16745)

Dawit: Are you from Africa?  We've launched the TON_Society_Africa  🚀 Join TON_Society_Africa now for engaging discussions on the TON ecosystem and opportunities to develop on the TON Blockchain. If you're from any African country, we'd love to have you on board! Let's explore the potential of TON together. Join us: https://t.me/TONSocietyAfrica

saddas: 6

Vladimir: TON Tact Challenge #2   TON Foundation is launching the TON Tact Challenge #2, a contest open to all developers, from eager beginners to seasoned experts. This is your chance to contribute to the creation of a decentralized social network.  What's in store? The challenge unfolds in five stages, covering everything from setting up user profiles to implementing decentralized management. Dive deep into the world of TON Blockchain and explore the limits of what's possible.  Prize pool & important dates ▪️ $20,000 in Toncoin (TON). ▪️ Registration is now open.  ▪️ Challenge starts on March 25, 2024. ▪️ Deadline: April 3, 2024.  How to participate? Register through @smartchallengebot. You'll receive all the essential details, including start times, submission guidelines, and insights into the challenge stages.  For more information, visit this page.  Showcase your skills, learn from real-world applications, and connect with the vibrant TON Community. Join now.

Bear: /Minter.tact:67:37: Invalid type "<void>" for binary operator "+" Line 67, col 37:   66 |         // let getChallengePrice: Int = self.price.get(msg.challenger_type); > 67 |         let challenge_value: Int = (120 + msg.challenger_level * 3 + self.getRandomNumber(msg.challenger_level)) / 10;                                            ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   68 |

Bear: why can't using + (reply to 16820)

saddas: 14

Артём🐸🐾: 11

Mehdi: 10

Raden0x: Tact by far is way better than FunC if you’re familiar with JS and TS it will flow right in (reply to 16330)

Slava: I don't think that "better" is the correct word here :)  The choice between these two languages shouldn't be done lightly right now. It's more complicated. (reply to 16960)

Raden0x: true maybe better is a too much of a stronger term, but the option to have something similar  to what i was used to helps

Anton: You are right. Let’s see where Tact can get to in 6 months ;) (reply to 16963)

Sergey: https://docs.tact-lang.org/language/ref/common#dump how to use this correctly? When creating a new blueprint project I don't have a default tact.config.json file. I created a file in the project root, but it doesn't work

Sergey: thank you, its work! (reply to 17040)

Sergey: is there a way to convert the address to a string? debug not supported show address

Hailey: 5 (reply to 17088)

Hailey: 5

— 2024-03-22 —

Vanesa: Hola

saddas: 6

User<6234295669>: Hello is there anyone can help me?

kh: What's up can anyone help me with TON?

Jay: What help is needed? Contract?

Raden0x: Hey guys! Deployed my first to collections with each having an nft item within each collection.   I do have a question though… I noticed my metadata thats uploaded to the ipfs isn’t being uploaded correctly to the blockchain or get gems. I run it first and get a link out of it but when I inject it into the metadata link into one of the params of my deployment, it’s not uploading correctly.

Raden0x: const metadata_link = 'https://gateway.pinata.cloud/ipfs/Qmc3ZuVvdeKQTStaoHNhAp9cW84AWnHsJhRRnzG2V2HCQP'; // will need to add this IPFS url      let content: Cell = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(metadata_link).endCell();     let owner = provider.sender().address!;      const nftCollection = provider.open(await OysterNftCollection.fromInit(owner, content, {         $$type: "RoyaltyParams",         numerator: 50n, // 50n = 5%         denominator: 1000n,         destination: owner,     }));

Raden0x: My deploy script ☝🏼

El👑DISCIPLINA🔰NIKILA❌: Y (reply to 17118)

Sergey: can I test created contracts with contract?When I create a new contract through another contract, I can't call any methods - get error in test " Trying to run get method on non-active contract". Could you tell me where I'm going wrong? Or are such tests impossible?

Mikhail: Hello eveyone, is there are any solutions for Contract upgrades?

Mirka: Nope, but you can create some methods to change contract data (reply to 17232)

Mikhail: I would like to add more functionality to my already deployed contracts. Sick of nft migrations tbh (reply to 17273)

Mirka: You can read about jettons migration from tep74 to tep89(people add a new contract with some new methods), but i dont know whether it will help you (reply to 17274)

Sergey: any help (reply to 17224)

Mirka: Are you sure that bounced should be true? I don't use this parameter and I don't have this problem (reply to 17224)

Sergey: I tried different options and right now I removed the bounce flag, but i get error. Even if I create a simple two-line contract. (reply to 17286)

Mirka: I'll send you my code, dm me pls (reply to 17287)

— 2024-03-23 —

Santos: Hey guys, pls can anyone help me with tutorial vidoes on how to build mini apps in telegram?

Илья: Hello guys, can I receive get fun results from child contract for free? For example to receive todoDetails from parent contract (didn't find it in examples or documentation)

Daniil: you can't call get-methods of other contracts (reply to 17322)

Mirka: Its better to ask in https://t.me/tondev_eng (reply to 17317)

Anton: but it is actually in the docs (reply to 17322)

CryptoMM Cool: I want to active wallet with v4r2 version. How to active or deploy wallet with nodejs? Thanks everybody.

Jennifer: 17

Jennifer: 7

Enoma: 3

Enoma: 3

MA: Hello guys, Is there any example for a lottery application in tact? How can generate a safe random number? Is the random function in docs safe to use in production?

Mirka: What lottery do you mean? (reply to 17419)

Mirka: /report (reply to 17417)

MA: it should be like Yologames spin to win, but actually   I just need to check how can I create a safe random number in Tact language (reply to 17420)

Mirka: https://docs.tact-lang.org/language/ref/random -  pseudo-random https://docs.tact-lang.org/language/ref/advanced#nativerandomizelt - randomizer by logical time (reply to 17422)

amir: Maybe import rand() from C or funC? (reply to 17422)

— 2024-03-24 —

saddas: 16

Vage: Tell me where to find the application form for the participation of the project in the Open league

Sergey: I'm trying to test a contract and I have a question about scope. If I test the "token" contract in the token creation test function, everything is fine.I f I use the contract "token" in another testing method - it doesn't work. Why is that?

Sergey: solved. I change  baforeEach to beforeAll (reply to 17555)

— 2024-03-25 —

dwusiq: I deployed a jetton two days ago and was able to mint and transfer normally, but an error was reported when I executed it again today: “Something happened but we don't understand what.”

&rey: TON-embedded random is determined by validators and as such can be influenced. For lotteries, you need an oracle like https://ratingers.pythonanywhere.com/ecvrf-about.html. (reply to 17419)

Cortex: how do you iterate thru map in tact?

Alex: any one know how to refund the value? When value > gas

szansky: Hi guys

Mehdi: 7

saddas: 11

saddas: 13

saddas: 56

saddas: 6

Gsaomfets: how to call getters?

Gsaomfets: Please improve the language, so that it would be:  var contract=new MyContract() var value=contract.getTestGetter()

Ilya: Can anyone show an example of sending a dedust swap transaction on a tact?

Miras: Hey guys! When does Ton Tact Challenge 2 begin?

Miras: Do you know what kind of tasks there will be? Maybe someone had already participated in Ton Tact Challenge 1?

Harsh: You can see previous tact challenge repo on ton-community github. All the tasks are listed in the repo. (reply to 17732)

Javier: https://docs.tact-lang.org/book/message-mode (reply to 17662)

Макар: Where I can find tasks for TON Tact Challenge #2? I registred through the bot and have token.

Sergey: i use @orbs-network/ton-acces and always get this error when trying to read the contract. How can I fix this?

Sergey: solved. Change ton package to @ton/core (reply to 17805)

Raden0x: i've successfully deployed contracts via collection or item.. however, how come my ipfs meta data uploads never show?

Raden0x: it uploads succesffully and i recieve a link to use my gateway domain.. but still nothing

🐾Omid: 15

Gsaomfets: 10

— 2024-03-26 —

Jimmy Becen: Hello everyone! Please help me process this request!   receive("refunding increment") {         // print how much TON coin were sent with this message         dump(context().value);         // Todo: The smart contract will take a portion of the user's funds and return all the unused excess TON coin value.         // For example: User sends 1Ton. The smart contract takes 0.5Ton and returns the remaining unused amount to the sender                  // return all the unused excess TON coin value on the message back to the sender (with a textual string message)         self.reply("increment refund".asComment());     }

Jay: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md  Can check the NFT Standard here, it shall fits the JSON format ya (reply to 17826)

Raden0x: Already have it formatted (reply to 17869)

Jay: Hmm how about the NFT Item?

Raden0x: yep formatted as well.. (reply to 17875)

Jay: Let's check if your get_nft_data is getting 0.json correctly? Inside the deploy script have the base URL, then it'll append to the end of the base URL.

Raden0x: you mean this?? (reply to 17877)

&rey: Please answer: is calling get-methods of other contracts possible on TON? (reply to 17717)

Jay: Yes, then it'll be something like after your IPFS URL + "/collection.json" for your collection metadata, then after your IPFS URL + "/0.json", "/1.json", "2.json"... for the rest of NFT item metadata (reply to 17878)

Raden0x: something like this (reply to 17885)

Raden0x: i must be missing something here?

Jay: Can you try accessing your ${metadata_link}/collection.json in any browser to see if it's loading? (reply to 17878)

Jay: Or ${metadata_link}/0.json just to verify it's correctly appended to the prefix

Raden0x: https://red-worthy-guppy-897.mypinata.cloud/ipfs/QmPvg8J4UmWb6e74WweJxhqwu8U2VvJF6qyf1FyLR8uHj7/nft_collection.json

Jay: Try changing nft_collection.json to collection.json

saddas: 12

Raden0x: change the file name? (reply to 17892)

Raden0x: this

Jay: Yepp try changing the file name

Raden0x: wow that fixed it dude!

Raden0x: @jiayee9729 the man!

Jay: Happy to help 😄

Raden0x: it worked for the collection contract.. now gonna test the nft item

Raden0x: @jiayee9729 looks like the item failed but the collection uploaded

Raden0x: is this a naming convention issue as well?

Jay: Can try check 0.json, 1.json, 2.json and so on ya just like how collection.json being placed

Raden0x: i only have one item

Raden0x: added more than one item to the collection and still meta data doesnt up load (reply to 17909)

Jay: https://red-worthy-guppy-897.mypinata.cloud/ipfs/QmPvg8J4UmWb6e74WweJxhqwu8U2VvJF6qyf1FyLR8uHj7/0.json  https://red-worthy-guppy-897.mypinata.cloud/ipfs/QmPvg8J4UmWb6e74WweJxhqwu8U2VvJF6qyf1FyLR8uHj7/1.json  https://red-worthy-guppy-897.mypinata.cloud/ipfs/QmPvg8J4UmWb6e74WweJxhqwu8U2VvJF6qyf1FyLR8uHj7/2.json

Jay: Seems like your 0.json is working (reply to 17912)

Jay: Means if you mint 3 items, only the first item working, is that correct?

Raden0x: yea cause i onnly have one 0.json file (reply to 17912)

Jay: Yes can you generate 1.json 2.json and so on?

Raden0x: oh okay... i just trying 0.json and 1.json and still no uploa

Raden0x: the 0.json you shared works on the url but doest show up on get gems

Raden0x: yea still nothing..

Jay: Hmm

Raden0x: yup, i even made new collection contracts and with new items everytime.. (reply to 17924)

Bear: what is. the issued here for the length overflow?

&rey: Link is too large for QR. (reply to 17934)

Max: Hey all! Recently I started using the TON ecosystem and became a fan of the developer tools.  Wanted to start contributing to the TON community by making a PR in the Tact repository with the JSON schema implementation (made a PR #194 just a minute ago). Would love to hear your feedback about it!

Vel: I want to make a token on the Ton blockhain.

Mayushii: Hello, i need a help. i saw an ad about ton tact challenge 2 with starting date in 25 march, but i cant find github directory with tasks and tact-challenge-bot havent gave me any links. Is it has already started and im blind or its not?

Anton: I hear the contest will start on March 28 (reply to 18010)

Mayushii: oh, okay, thank you (reply to 18011)

Mirka: minter.ton.org (reply to 18006)

Vel: I need  some help on my token creation.

Vel: the token features

Vel: i need 5 volunteer devs, I have 300+ Influencers with me, each has 30k followers each.  Lets build something from scratch.  Whos with me?

Anton: Cool stuff, cool stuff! I left some feedback on GitHub (reply to 17975)

Mirka: Do you need any specific features? (reply to 18022)

Vel: Just a simple standard token bro (reply to 18031)

Mirka: So what's the problem? (reply to 18033)

Vel: I need some guidance (reply to 18034)

Mirka: Ask me your questions in dm (reply to 18035)

Vel: Hey (reply to 18036)

— 2024-03-27 —

Raden0x: @jiayee9729 any other suggestions you tink that can fix this? i reached out to GetGems to see if there is anything i can do to fix this (reply to 17925)

Jay: Hmm nope at the moment (reply to 18072)

mooncake: hello everyone. How to build a Merkle tree for a whitelist  on my tact contract ?  is there any lib can help?  thanks .

saddas: 12

Vudi: Is set_code implemented in tact? Are there any examples?

Daniil: https://t.me/tactlang_ru/899 (reply to 18110)

Daniil: At this time, you'll have to define and import FunC functions in your Tact contract in order to work with exotic cells (reply to 18091)

mooncake: if i build a merkle tree in my contract, can I dynamic add/delete entry in the tree?

Mikhail: yep, but there are limitation in TON on maps, Discussed it there for like 100 times (reply to 18113)

Daniil: they're talking about merkle trees. (reply to 18114)

Daniil: yes, there are Merkle Update cells. (reply to 18113)

Xander: if I want to create a contract that using a func file as my trait, how could I do?

Mikhail: and? They are still will be stored in a map i guess? (reply to 18115)

Daniil: you can check out my Scalable Airdrop project on github: https://github.com/Gusarich/airdrop  it utilizes merkle trees. without merkle updates but if you understand and implement the rest of it in your project, adding merkle updates won't be hard. (reply to 18091)

Daniil: smart contract will only store the root hash of the map, while the map itself is stored somewhere offchain (reply to 18118)

mooncake: what limitation about maps?  can not find any information about it on docs.   do you means the max length of map? how much is this? (reply to 18114)

Daniil: yes, contract can only store around ~30k map items at the moment, but it might possibly be expanded in future. (reply to 18122)

mooncake: great! I will try.  thanks for your repo (reply to 18119)

Xander: for example, I want to use https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc as a trait to create my own jetton contract, how could I do it?

saddas: 8

Mikhail: Hello everone, getting exitcode 9 (Cell underflow) while trying to do this:  let bet_id: Int = sha256(beginCell().storeAddress(msg.caller).storeInt(msg.event_id, 64).asSlice());

Eagle: hello I am looking for dev who would be interested in participating in this TON hackathon https://dorahacks.io/hackathon/the-open-league-hackathon/detail#introduction for a language learning web3 game project

Miras: hello! I'm trying to debug my smart contract and using dump() function but logs are not showing up. I have added options: {debug: true} in wrappers.compile.ts

Evgeniy: re-compile? (reply to 18144)

Bear: ? (reply to 17935)

Denis: Hello! I wonder if there is a way to delete a value from Map. Can anyone help?

Dmitry | backend4you.ton: Try set it to null (reply to 18191)

Anton: Chat history search does wonders: https://t.me/tactlang/1980 :) (reply to 18191)

Denis: Thank you guys! I hope it works as intended, not leaving the key value in storage or something.

Daniil: it actually deletes the value. syntax is not very dev-friendly at the moment, but .del() function will be added to Tact in one of future releases (reply to 18194)

Denis: It's thousand times friendlier than the Func syntax anyway =) (reply to 18196)

Denis: Thanks for clarification!

Xander: How can I set addr_none (aka store_uint(0, 2)) in tact lang?

Javier: I read the maximum size of global variables is 31. This is for func contracts. But you should not have such that lot of variables, try to split in multiple contracts as it will be easier to mantain

Sumit: why cant i send messages

Mayushii: try it after bankai (reply to 18232)

Sumit: damn

Sumit: error: previous function return type ((int, int, int, int, int, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((int, int, int, int, int, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, int), int)  can anyone help me with this error?

Javier: You have in your return some variable that is different than your function returning definition. As I see in the error you have a return type that start with 5 int's and you are returning from the function, only 4 int's (from the beginning

Sumit: i have rechecked my return type and can confirm they are okay (reply to 18241)

Javier: Why are you returning a () inside? Like ((...),int)

Sumit: fuck i found it (reply to 18244)

Sumit: was returning nothing where a bool was expected

Javier: hmmhu this happened to me, not with tact, but on func

Sumit: the error can be better reported ig

Javier: yes probably, but I have a saying, 99.98% of the time is our fault as dev’s so we have to triple check 🙂

— 2024-03-28 —

Sniper Man: me (reply to 18143)

Pike 🦴 🏴‍☠️: hi everyone, is there any example for smart contracts calling a "get" from another smart contract? or even calling a function?

Erik🆓: No, other contracts are not available during execution. (reply to 18271)

Pike 🦴 🏴‍☠️: That means cross contract interaction is not yet available on TON? (reply to 18272)

Erik🆓: Contracts send messages to other contracts. (reply to 18273)

Pike 🦴 🏴‍☠️: Ah, so sending messages is still OK but getting their states is not huh

Erik🆓: Yes, since getting information directly from other contracts during execution assumes that all contracts are available on the same node and that would not be scalable. (reply to 18275)

Pike 🦴 🏴‍☠️: Alright I understood, thanks for answering.

AdBeast #admin: Hii

AdBeast #admin: Im looking for dev to make a webapp for us

Pike 🦴 🏴‍☠️: hi everyone. does anyone have an example of cross contract message sending, like how do i identify the target contract and the message body

&rey: https://tact-by-example.org/03-messages-between-contracts (reply to 18303)

Pike 🦴 🏴‍☠️: thanks a lot, i didn't know this page existed

Miras: Guys who should pay the gas, end users or contracts itself? And how to implement it, are there any methods to know the gas beforehand?

Beast: Guys, has the competition started yet?

Mirka: Wallet who call the contract should pay the gas (reply to 18345)

Raden0x: @jiayee9729 hey how are you? mayeb this can give us some insight. Upon looking at the testnet.explorer.tonnft.tools i got a better insight on how its uploading to the blockchain. You can see that the "Content" isn't including the proper end point and its just "0" not "0.jpg" or 0.json... however for the collection it does upload correctly

Raden0x: @jiayee9729

Raden0x: @jiayee9729 here's the collection

Jay: Heyy @NewCodeOnDaBlock , can you check this equivalent function in your codes?

Jay: This would be the part of it appending item_index and .json to the NFT item ya

Raden0x: yes thats correct @jiayee9729

Jay: Does it includes the ".json" part?

Raden0x: but this test im showing above was me seeing if a .json file woould make a difference.. its always been blappend(".json")

Raden0x: should i include something there? (reply to 18364)

Jay: Yepp the individual_content should be passed in as the base url, then the codes should be handling the appending json logic for you ya

Raden0x: so maybe removing b.append(".json")? (reply to 18371)

Jay: Yepp let's try that

Raden0x: okay lets see

Jay: Cool

Raden0x: worked!!!!!! (reply to 18377)

Jay: Great to hear that! ⚡⚡⚡

Raden0x: btw.. so if i wanted to deploy another nft item into that collection.. I wouldn't be able to and would need to deploy a brand new collection contract with the list of nft items id want to deploy correct? @jiayee9729

Jay: Yes need deploy brand new collection contract with new list of nft items

Raden0x: got it!

Igor: Hey, guys I'm a little confused, when does the #2 tact challenge start / has it started already?

Miras: Nobody knows, we are all waiting (reply to 18394)

Enoma: ...still waiting for competition launch.

Mahmoud: Guys, how do I participate in this thing? any recap for what is going on please

Enoma: Already passed the time that it's suppose to start.

Mohammad: Hi everyone, my last two message where in detail, but got deleted (idk why). so, here is a short one.  Is there a repository with standard implementation of NFT in tact that marketplaces support?

Fardin: Hello everyone

Fardin: Do anybody knows what is the TEP-89?

cicada.: https://tonresear.ch/t/tep-89-enhancing-jetton-master-contracts-for-discoverable-wallet-addresses/118 (reply to 18426)

Fardin: Thanks buddy (reply to 18427)

cicada.: ur welcome (reply to 18428)

Artur: Hi. Is there a way to find out the address of the user who sent money from a custodial wallet (@wallet)? Since this wallet sends money from one common address for different users🤔

Wild: Guys can I know where I can find the problem statement of TON Challenge posted on codeforces

A. Romy: https://t.me/toncontests/159 it is canceled, I think you can follow that channel for more update (reply to 18437)

Flyheck: Hi. Where can i read about work with nft and jettons with tact? i don't see it in official documentation

— 2024-03-29 —

Bear: hello; why the nativeRandomInterval doesn't work?        fun getNftType(): Int {         let result: Int = nativeRandomInterval(self.ranges);         dump(result);         return result;     }

Bear: https://docs.tact-lang.org/language/ref/advanced#nativerandominterval

Bear: never mind

Bear: My code is here and it wouldn't execute once receiving the message. 😰

Howard: good question (reply to 18091)

Howard: Is this same as the Raffles airdrop feature sir? (reply to 18119)

User<7003351347>: 🦐

Bear: 💀 (reply to 18474)

Bear: ok I got it, the received address haven't be activated

saddas: 15

Daniil: If you mean “airdrop” page on their website, yes. I helped them to integrate the technology. (reply to 18479)

Good: Hello. How can I switch testnet in mobile Tonkeeper?

Sumit: let init:StateInit = initOf WrappedJettonWallet(myAddress(), token.address);         let wallet: Address = contractAddress(init);         send(SendParameters {             to: wallet,             body: JettonTransfer {                 amount: amount,                 destination: to,                 response_destination: context().sender,                 custom_payload: null,                 forward_ton_amount: 0,                 forward_payload: beginCell().asSlice(),                 query_id: 0             }.toCell(),             code: init.code,             data: init.data,             value: ton("0.5"),             bounce: true         });  i am trying to calculate the address of JettonWallet for my contract address. and this calculation seems to be off for the same arguments on chain and off chain

Mohammad: Hi everyone. I'm trying to enable the debug feature, however, there is no tact.config.json file inside the auto generated blueprint project.

Flyheck: Hi. Where can i read about work with nft with tact? (reply to 18474)

Anton: https://t.me/tactlang/17040 (reply to 18510)

Mohammad: Thank you 🙏I just found it in github issues as well, it would be convenient if was in the documentation as well. (reply to 18513)

Howard: https://github.com/howardpen9/nft-template-in-tact (reply to 18511)

Flyheck: Thanks (reply to 18516)

Mohammad: Great community👍 (reply to 18516)

Good: Hello. does anyone deploy smarts in testnet? (reply to 18498)

Mirka: I think everyone here😁 (reply to 18524)

Good: In the past it was available on dev screen. But where is it now? (reply to 18525)

Mirka: Settings -> tap 10 times on tonkeeper logo on the bottom of the screen -> dev mode on -> then try to add new wallet(there will be testnet wallet option) (reply to 18526)

Good: So easy. Thank you (reply to 18527)

User<6781515812>: 12

saddas: 6

User<7003351347>: 🦐

マムル: Guys, I have a newbie question. 1. Wrote a simple smart contract with Tact.  2. Ran a command npx blueprint run 3. Chose Tonkeeper option, but forgot to change to testnet. And scanned QR with main net wallet instead. 4. As a result contract was not deployed, and I’ve got an error (that contract was not deployed) 5. Now when I try to rerun the command npx blueprint run I’m getting: “User has already opened the previous request “ How do I fix it?🤔

nonam3e: Try deleting /temp folder (reply to 18573)

マムル: Thank you so much! 🙏 (reply to 18575)

Good: where manifest should be put? root? (reply to 16689)

Саня: 12

Raden0x: i keep getting this error when tryig to deploy contact:   Error: no healthy nodes for v4-testnet

Raden0x: what does this mean?

Alireza: I got this error today in some interactions with tonapi. but after a while, it just fixed (reply to 18607)

Raden0x: Alright will try again in a few then

Raden0x: Yes root (reply to 18584)

Raden0x: also what does it mean when deploying and it stays on sendTransaction forever and doesnt do anything?

Raden0x: so weird now its doing the same (reply to 18378)

Nichita: Hey everyone! Does anyone have an example of jettons transfer in Tact? Desired behaviour is receiving TONs and sending jettons back

Андрей: Where can I find a link to the github tact challenge? I registered, but the bot did not send the link

nonam3e: https://github.com/nonam3e/tact-lessons/blob/main/lesson8-9/sources/contract.tact#L118-L121 (reply to 18625)

nonam3e: the challenge is suspended for now (reply to 18629)

Андрей: Thanks for info! (reply to 18631)

Андрей: Sorry, do you have any information when the contest will continue? (reply to 18631)

Heydar: Hello guys, Im beginner (just I have very low knowledge in tact) ,what's best refrence to learn FunC as fast(and considering important things)? and also do we have func group? thanks for guiding me

— 2024-03-30 —

Dmitry: Hello guys! Does anyone knows how to read value from bounced<T> message?   Now tact compiler fails with error Type bounced<"InternalInitWalletSettings"> does not have a field named "owner"

Daniil: Bounced messages are very limited by size (reply to 18681)

Dmitry: I read it in the documentation, but maybe there is some kind of solution? (reply to 18682)

Dmitry: I have to return back coins, when my message bounced, but i can't read address of first transaction initator.

Daniil: in that case you should consider sending a message that will act like a "bounce" (reply to 18684)

Dmitry: Can you show example? (reply to 18685)

kh: Who wants to sell notcoin's vaucher

Daniil: just send a message back to the sender instead of throwing an error  but note that in some cases you'll also need to validate that the message came from a correct smart contract (reply to 18686)

Dmitry: My message workflow: Initator -> MasterWallet -> ChildWallet (bounce)  BouncedMessage (from ChildWallet) -> MasterWallet (here i can't define initator address) -> Return coins back (reply to 18688)

Daniil: and it could be:  Initator -> MasterWallet -> ChildWallet (MyBounceMessage) MyBounceMessage (from ChildWallet) -> MasterWallet (here you can get all data) -> Return coins back (reply to 18689)

ALi Sahari: 8⃣

User<7003351347>: 🦐

Gsaomfets: Is there an online tool for deploying a smart contract?

Anton: https://ide.nujan.io (reply to 18730)

Gsaomfets: thanks you (reply to 18731)

— 2024-03-31 —

User<7003351347>: 🦐

saddas: 11

Sergey: hot to parse cell with @ton/ton library in js?

Rafa: Hey! First of all thanks for tact! Awesome effort. Also tact by example is awesome.   I am learning coding smart contracts (coming from mobile/web dev).  Im wondering is there a way to test smart contracts like in “learn by example ui”.  Coming from Web/Mobile I’m used to deploy/test in real device workflow.  I was thinking to just clone that repo and modify smart contracts there. Is it the best way to start?   I’m reading the chat but can’t find a link that enlightens me 😂  Thanks 🙏

Aydin: Hey Rafa! You can use Blueprint. (reply to 18822)

Rafa: Aha! Thanks Aydin!

Andrew 🐾: 5

— 2024-04-01 —

Hạo: I followed this example https://github.com/howardpen9/staking-in-tact but it doesn't seem to work, and when downloading the build there is also an error. I wonder where I did wrong? , the call contract always fails

LIBEIQI: is there a book for learning this smart contract language?

Anton: https://docs.tact-lang.org and https://tact-by-example.org (reply to 18887)

LIBEIQI: thanks

LIBEIQI: is there a paperbook one on Amazon?

Anton: Not yet, Tact is a very young language. Maybe in a year or two… (reply to 18890)

LIBEIQI: hhhh

LIBEIQI: i see

Davis: How do I configure deploy npx blueprint run with Mnemonic?

Davis: WALLET_VERSION

Bear: hib I got this string data for message body. How to conver to Slice?  in Tact? (reply to 18912)

Bear: I have the function like this: export function loadEventMintRecord(slice: Slice) {   let sc_0 = slice;   if (sc_0.loadUint(32) !== 2279359072) {     throw Error("Invalid prefix");   }   let _minter = sc_0.loadAddress();   let _cost_per_mint = sc_0.loadCoins();   let _mintAmount = sc_0.loadCoins();   let _currentTime = sc_0.loadUintBig(32);   let _lastMintTimestamp = sc_0.loadUintBig(32);   let _mintRate = sc_0.loadUintBig(32);    return {     $$type: "EventMintRecord" as const,     minter: _minter,     cost_per_mint: _cost_per_mint,     mintAmount: _mintAmount,     currentTime: _currentTime,     lastMintTimestamp: _lastMintTimestamp,     mintRate: _mintRate,   }; }

Bear: 1111 (reply to 3080)

Bear: umm still have the error (reply to 3080)

Esubalew: 8

Louis: Hello everyone, I'm getting acquainted with Tact and currently using VSCode. Could anyone suggest some extensions for me?

Louis: Is there anything better than Tact language support?

Louis: I found it already, thanks, docs tact-lang org/ecosystem/tools/vscode

Louis: I'll read more carefully next time :)))

IKke: Hi guys, what's the best practice to recreate transferFrom function? since standard don't have it, i should use multi message in one transaction plus signature? is there example for tact with scripts?

Aydin: .asSlice() (reply to 18913)

Sumit: Hi, i want to send all the remaining value to next message. How can i do that?

Sumit: {         lt: 20000000n,         now: 1712001538,         outMessagesCount: 0,         oldStatus: 'active',         endStatus: 'active',         totalFees: 12581000n,         from: EQAB32tDDEtUe0bd92ulajgR0CN1q8_kh3m4IOpmBQ4rJEO9,         to: EQCVsPaR0bKRpIyvXtt8bYR2LVhBgmSiyChvqNCtv9ReWM0n,         on: EQCVsPaR0bKRpIyvXtt8bYR2LVhBgmSiyChvqNCtv9ReWM0n,         value: 1281351819n,         body: x{D53276DB0000000000000000},         inMessageBounced: false,         inMessageBounceable: false,         op: 3576854235,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: false,         destroyed: false,         exitCode: 0,         actionResultCode: 0,         success: true       },       {         lt: 21000000n,         now: 1712001538,         outMessagesCount: 1,         oldStatus: 'active',         endStatus: 'active',         totalFees: 9920328n,         from: EQBtE7sxSqbDZwuWhxxQRzSZZ3UAm8j4mhR25iWS2xfEmZ6D,         to: EQCVsPaR0bKRpIyvXtt8bYR2LVhBgmSiyChvqNCtv9ReWM0n,         on: EQCVsPaR0bKRpIyvXtt8bYR2LVhBgmSiyChvqNCtv9ReWM0n,         value: 39351000n,         body: x{7BDD97DE000000000000000010180003BED6861896A8F68DBBEED74AD47023A046EB579FC90EF37041D4CC0A1C564900256C3DA4746CA469232BD7B6DF1B611D8B5610609928B20A1BEA342B6FF51796000068002A_}          x{62727568},         inMessageBounced: false,         inMessageBounceable: true,         op: 2078119902,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: true,         destroyed: false,         exitCode: 63413,         actionResultCode: undefined,         success: false       } I am doing that, but the value is still different (reply to 18984)

Sumit: ie 1281351819n in last, and then the next value is 39351000n

Sumit: i dont want the contract to destroy (reply to 18987)

Sumit: its basically a middleware contract that performs some logic while it should just send the value as it after consuming whatever required for its gas. (reply to 18987)

Sumit: 39351000n this is the amount i get, regardless of the mode being SendRemainingBalance or SendRemainingValue (reply to 18987)

Aydin: Maybe there is some problem with other lines of the code? (reply to 18991)

Sumit: i have a forward_ton_amount (reply to 18992)

Sumit: in my original message

Sumit: that could be the issue

Daniil: can you share the code? (reply to 18991)

Sumit: I figured it out (reply to 19002)

Sumit: it was this (reply to 18993)

IKke: just transfer them to address UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ (reply to 19006)

— 2024-04-02 —

IKke: yep (reply to 19013)

IKke: yes, need to send message with op code for burn (reply to 19016)

Jimmy Becen: Hi guys, Today I can't find the Jetton Token Launchpad example anymore :(. Can someone who cloned it please send it to me?

Facu: Hello! I am needing a little help with a very basic question. I've deployed for the first time an smart contract, as a simple test I was using 03-send-coins sample from TACT site and added only 1 more receive with other parameters. But when deployed in production I've sent 0.05 TON with Tonhub wallet and I got back 0.041841 TON. Then I've sent to the contract again 0.05 but got back 0.046926 TON. Does it means that there is an error when processing the messages?

Facu: I am sending funds to the contract with empty message. So I asume should do nothing and only receive the funds as defined in this part of the contract:      // accept incoming TON transfers     receive() {         dump("funds received");     }

Sumit: how can i integrate ton wallet with the wrapper that is generated using blueprint?

Dmitry | backend4you.ton: Do not decide about transaction status by returned amount. Use explorer (tonscan.org, tonviewer.com, ...) and check your wallet there. (reply to 19055)

Facu: thanks for answering, I am looking into it, but I dont understand why all money sent is returned, ... maybe is a simple thing but I am just starting working with TACT

Facu: Oh, I can not post the image ...

Facu: What I see is Exit code: 130, and the text bounce

Dmitry | backend4you.ton: so, look for throw (130) in your code (reply to 19074)

Facu: I dont have something throwing that, it is a simple example from TACT site. And local test works. "130 Tact (Compiler) Invalid incoming message — no suitable operation is found" Probably is a simple thing but I new on this ...

Facu: I was assuming that this part would accept any message, mmm      // accept incoming TON transfers     receive() {         dump("funds received");     }

Anton: exit codes are documented here: https://docs.tact-lang.org/book/exit-codes (reply to 19074)

Anton: hope this is helpful, but if it’s not, feel free to open an issue here: https://github.com/tact-lang/tact-docs/issues, asking for clarification

Facu: 7

Dmitry | backend4you.ton: accept and continue execution to next lines. check compiled fc code - its hard to modify it, but relatively easy to understand in general (reply to 19077)

Daniil: can you give tx link please? (reply to 19077)

Facu: I got automatically deleted when trying to send a link. But this is the last try transaction: 7142338066ff1658c3f7ab7cfa1899308dc9d8d664d12a03fec118219866298b (reply to 19087)

Daniil: and where is the error? (reply to 19089)

Facu: I don't see any error when deploying, but I got this money returned

Facu: I will now send a message to the contract ...

Facu: oh! now the coins are received without issues

Facu: the only thing that I dont understand is why on the deploy the money was returned, but it's not an issue for me

Daniil: That’s how it works (reply to 19094)

Daniil: It sends a “notification” about successful deployment

Good: 18

Good: Hello. Is it possible to implement such a trick so that the transaction is executed only when the recipient confirms it? In other words, the transaction is executed only if there are two signatures

nonam3e: yeap, check it here https://github.com/ton-blockchain/multisig-contract (reply to 19116)

Daniil: I don’t think he’s talking about multisig wallets (reply to 19118)

Good: As I know, any wallet is already smart-contract, isn’t it? (reply to 19119)

Daniil: It is (reply to 19122)

Good: So, I needed to get general way. That’s great there is

Good: Thank you (reply to 19118)

Дмитрий: Hello! how can i receive 0xd1735400 (TakeWalletAddress) message from jetton master? Can you give me an example?

Mirka: /report (reply to 19165)

— 2024-04-03 —

Blockchain Dev: I couldn't find how can we set address to 0. Is there some kind of address(0)?

Blockchain Dev: Okay, I've found: self.pendingOwner = newAddress(0, 0);

Jimmy Becen: Hi guys Please help me with a example contract about Liquidity Pool

O: 10

Samyar: what is the api should do? is there an example implementation of it available? (reply to 14452)

Илья: I've already asked here. Does anyone know what error code 130 is? Here it is here  (testnet) I send a lot of money to the child contract (0.4 tons), it sends 2 times less (0.2 tons) to the parent contract, but these messages fall either by mistake Not enough toncoins (37), or by code 130 (it is unclear what)  On the simulation in the bluprint, it works

Hạo: tranfer: () => {             let packed_stake = beginCell().storeUint(300, 64).endCell();             console.log( jettonWalletContract?.address.toString())             const message : TokenTransfer = {                  $$type: "TokenTransfer",                 queryId: 0n,                 amount: toNano("200"),                 destination: Address.parse("kQCpiPHn6wvKiJdqCJOIre6wZBC1R7lA4Yro58sade6P9_BH"),                 responseDestination: Address.parse("0QAr0F8pkahHEAvW-eicDqxLwQFqpNEVx68yI4menKfXGBV8"),                 customPayload:null,                 forwardTonAmount: toNano("0.0333"),                 forwardPayload: packed_stake,             }             jettonWalletContract?.send(sender, {                 value: toNano("0.05")             }, message)         } hi guys, I want to send jetton from wallet 0QAr0F8pkahHEAvW-eicDqxLwQFqpNEVx68yI4menKfXGBV8 to kQCpiPHn6wvKiJdqCJOIre6wZBC1R7lA4Yro58sade6P9_BH but the call keeps failing, what am I doing wrong?

ᅠ: How can I send TON to many wallets in one transaction ?

ᅠ: I'll give you 1 TON for the answer (reply to 19233)

Dmitry | backend4you.ton: You may add up to 4 “messages” (sends) in one tx when using regular wallet (v3, v4) or up to 255 when using highload one.  You need programmer skills to create such tx (wallets apps does not support multi send yet) (reply to 19234)

Дмитрий: @tonmassend_bot (reply to 19233)

— 2024-04-04 —

Jimmy Becen: hi guys, how to calculate_user_jetton_wallet from jetton master in smartcontract, Please help me!!

gsan bro 🐾: 12

Bill: contractAddress(beginCell().storeRef(walletcode) .storeRef(beginCell().storeAddress(jettonMsater).storeAddress(UserWallet).endCell()).endCell()) calculate_user_jetton_wallet » i guess some code like this

Bill: @interface("org.ton.jetton.wallet") contract JettonDefaultWallet 's code  == walletcode

&rey: Not guaranteed to work for custom jettons. (reply to 19274)

Slava: Hey guys! Do we have a repository for deploy jetton on Tact like this?  github.com/howardpen9/jetton-implementation-in-tact - Is this something that could be used to deploy jetton on Tact?

Blockchain Dev: Hey guys, how can I get an event emitted during this call? What should I Expect?

Good: /report (reply to 19294)

Blockchain Dev: I have a problem here. This call should deploy a Certificate contract. But in fact when try to call some functions of Certificate contract I an get error, it says that I "Trying to run get method on non-active contract" (reply to 19290)

Blockchain Dev: I dont understand this contract was deployed or not? How could I realize that?

Blockchain Dev: certificate = blockchain.openContract(await Certificate.fromAddress(certAddress)); retrieves to me correct address

Blockchain Dev: I've caught the event! And now I can see that it definitely being deployed to different address. But why?

Alexander: Hey guys. I have a method that accepts private key and returns public key based on input:   get fun get_public_key_from_private_key(private_key: String): String {     // need to do smth to get public key     let public_key: String = private_key;      return public_key; }   But I haven't found any library for tact to do so. Is there any simple way to implement it?

Daniil: why would you need that? (reply to 19335)

Alexander: quite hard to explain a project that works like a pow miner of addresses, I need to verify that user owns an address without direct tx/request from the address (reply to 19336)

Alexander: I looked through the funC documentation and didn't find the method I was looking for in it as well. Hope it is possible without making a lot of crypto things

Daniil: sending private key to smart contract is not safe anyway (reply to 19338)

Alexander: yeah, but anyway these private keys aren't going to be used anywhere else except my contract, so all good (reply to 19340)

— 2024-04-05 —

Blockchain Dev: Same problem. Have you been success? (reply to 17224)

Mirka: Try to rename message in child contract, try set value to a constant(for example ton("0.05")) (reply to 19383)

Blockchain Dev: Does Body field keep Init params? Doesn't it? (reply to 19384)

Blockchain Dev: Btw, I can see that your MintItem has only 2 fields, but you send MintItem with 3 fields in body in message (reply to 17224)

Blockchain Dev: Well I've done it. I put params into Init of child contract separately instead a structure. Put fixed value. And made a function call that creates child without parameters, left a literal only (reply to 19384)

Blockchain Dev: That is parent contract

Blockchain Dev: That is child

Blockchain Dev: And that is how I create child. It works

Blockchain Dev: BTW, somebody know could we get parent contract's address with TON itself? Something like address.parent

Blockchain Dev: I've got a new bug. I'm testing child creation with for() statement and every 3 or 4 call doesn't set owner address to child contract. I checked events and realized that when I'm doing call to the parent's function that makes a couple of calls to a child contract second call doesn't happen every 3 or 4 times. It looks like it is a bug of TON emulator

Blockchain Dev: Well, probably TON doesn't able to work with more than a single call with a single transaction. I've split calls to separate functions and it became a solution

Ken: it can definitely send multiple messages in a single tx (reply to 19403)

Blockchain Dev: What is your opinion why it loose second call if both calls are present in a single function? (reply to 19406)

Alexander: Hi everyone, how to convert that FunC Cell builder into Tact?          .store_ref(             begin_cell()                 .store_uint(now() + 60 * 5, 32) ;; deadline:Timestamp # 5 min                 .store_slice(RECIPIENT_ADDR) ;; recipient_addr:MsgAddressInt                 .store_slice(addr_none()) ;; referral_addr:MsgAddress                 .store_maybe_ref(null()) ;; fulfill_payload:(Maybe ^Cell)                 .store_maybe_ref(null()) ;; reject_payload:(Maybe ^Cell)                 .end_cell()         )  The question is more about storing null values, there is nothing like storeMaybe in Tact. is it possible at all without defining new struct?

Blockchain Dev: Func is the thing I won't see ever

Miras: There are optional types in tact (reply to 19412)

Good: Incorrect question has incorrect answer. Tact is a wrapper over FunC.  If you want to store null values, you can use optional values (reply to 19412)

Alexander: I asked how to do so without structs (reply to 19419)

&rey: .storeUint(0, 1) into Builder. (reply to 19412)

Anton: Is Tact zero-cost abstraction on top on FunC? (reply to 19419)

Doge: 11

Anton: It’s not an abstraction on top of FunC. It’s a language currently implemented using compilation (some would also say transpilation) into FunC (reply to 19427)

Anton: It has some costs to it, though. And it does not have to be like this in the future. You just write a compiler backend and you don’t have to deal with FunC (except when interacting with FunC contracts)

Yari: Could you explain is there any function or property of TACT that could retrieve a parent contract? (reply to 19438)

Good: you should just know its address in any case (reply to 19449)

Javier: And save it in the childcontract (reply to 19450)

Good: or use parent pattern (reply to 19449)

Yari: I ask about some solution that can prove that address 1 is derived from address 2

Yari: To prove that some nft belongs exactly to some collection

Javier: Just the same you can do to know the owner, saving the owner address, you can save the collection address

Yari: That is not solution. I can deploy my own nft that will contain address of your collection (reply to 19456)

Javier: In your collection you have an index, the address of the nft will be generated based on the index and the collection address if I am not mistaken

Javier: The initstate that will create the address of the nft. It should be the index on your collection+the collection address+ the code

Yari: All this is public data, I can stole those to fake your NFT (reply to 19459)

Yari: Imagine you have an NFT collection. I deploy my own NFT, insert the address of your collection into it, and forge it so that my NFT looks similar to an NFT from your collection. Then, I sell it as if it were one of your NFTs.

Yari: Am I wrong?

Yari: Yeah, I forgot that, we can put autorization into code

Yari: And this code will prevent the forgery of the NFT.

Yari: I thought new address depends on Init params only, I forgot that it depends on code of the contract too

Javier: yes this (reply to 19467)

— 2024-04-06 —

&rey: In general, there is not one; there may be zero or two and more. (reply to 19449)

Konstantin: Hi, I'm trying to read the dictionary, but I'm getting errors: no more reference or index is out of bounds:  // tact map: map<Address, Bool>;  // ton-core const dict = stack       .readCell()       .beginParse()       .loadDict(Dictionary.Keys.Address(), Dictionary.Values.Bool());

Philip 菲力: you should check if the stack is empty or not. (reply to 19498)

Konstantin: Solved using 'loadDictDirect' (reply to 19498)

Eldar: 9

— 2024-04-07 —

Jimmy Becen: hi guys how to generate error code from string. for example: /*      NFT Auciton Market Error Code :     3724: Bid doesn't meet the minimum increase requirement     11017: Contract is already initialized     19941: Only owner can build nft auction contract     20805: Only owner can init auction end time.     20844: BuyNowPrice must be greater than reservePrice   */ (reply to 19275)

.: Hi , where can I find the tl-b schematic for forward_payload?

Dmitry | backend4you.ton: This data is for “final” recipient who will receive notification about transfer. You should put there something that final recipient “wants”, so you should ask recipient what it wants (if any) (reply to 19609)

— 2024-04-08 —

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: Guyz I got some questions regarding tact. Im completely new. Anyone here can assist?

Classifiedweb3: ?? (reply to 19672)

𝕸𝖚𝖍𝖆𝖒𝖒𝖆𝖉🍋: Is C++ still been used in Ton or only tact, or how it is working actually?  Also, tact compiler will turn the program to funC code on the fly— does it mean if I write a simple tact code, it will automatically turned to funC code? (reply to 19676)

Classifiedweb3: Yes it'll automatically c++ ? (reply to 19681)

Johnny Le: can anyone pls help me

Johnny Le: $ npm create ton@latest  ? Project name a ? First created contract name (PascalCase) a Error: Cannot create a contract with the name 'a'

Blockchain Dev: Try 'A'

ağadadaş🍅: 7

Jimmy Becen: Hi guys!  receive("Claim PreSale"){         let amount_b: Int = self.remain_reward(sender());         require(self.is_stop(), "Not Stop!");         require(self.is_reach_soft_cap(), "Softcap not reached!");         require(amount_b > 0, "Nothing to claim!");         require(context().value >= 2 * self.gasConsumption, "Not enough funds to claim");         send(SendParameters{                 to: self.protocol_wallet_jetton(),                 value: 0, // pay for message, the deployment and give some TON for storage                 mode: SendRemainingValue,                 body: TokenTransfer{                     query_id: 5,                     amount: amount_b * 10, // Make exception                     sender: sender(),                     response_destination: myAddress(),                     custom_payload: emptyCell(),                     forward_ton_amount: ton("0"),                     forward_payload: beginCell().storeBool(true).endCell().beginParse()                 }.toCell()             }         );         self.set_claimed_reward(sender(), amount_b);     }      bounced(msg: bounced<TokenTransfer>){         if (msg.query_id == 5) {             dump("Claim PreSale ERORRR ");             dump(msg.sender == myAddress());         }     }  Why does the build fail with the message:  Type bounced<"TokenTransfer"> does not have a field named "sender"

Nikita Aplin: You can get sender from context (reply to 19768)

Jimmy Becen: But I want to get both sender and response_destination information. Is it possible? (reply to 19770)

Denis: Hello everyone! When I try to calculate the address of some contract via usual Tact method (let init: StateInit = initOf SecondContract(arg1, arg2);let address: Address = contractAddress(init)), I get different address on 2 different contracts. Anyone has an idea on why it can happen?

Denis: I probably located the problem in compiled files, get_abi_ipfs has different values associated with it. Since it's a part of "OTP-003: Self-ABI reporting" and I don't need it, maybe I can turn it off somehow? Or any other way to fix this? (reply to 19783)

Denis: It seems that for some reason, structs from Parent contract get into child's ABI...

Vitor: I started trying to convert my notes while I was learning Tact into a primer... I did very rough first draft https://vitorpy.com/2024-04-08-tact-primer-for-solidity-devs/ if someone has some free time, I'd love to get some feedback and see how can I make it better

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: 4

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: 6

S: 6

— 2024-04-09 —

Anton: contracts cannot call getters (reply to 19935)

Anton: send a message with this info (reply to 19940)

𝐓𝐃: Hi all, I want to introduce my AI bot that I trained from a collection of data from official TON documents and data about TON on the internet. I will try to train more. Hopefully this bot can help answer some basic knowledge questions as well as further develop the TON community.  Please try Utya Professor utyapro_bot and give me some feedback 🙏  Anyone would like to contribute effort collect and classify data and train data more for this bot please send me message

Johnny Le: Hi guys

Johnny Le: Does TON token have smart contract

Dmitry: Yes. But it’s the network, not the token (reply to 20009)

Johnny Le: so no contract for native token ? (reply to 20013)

Dmitry: The native token itself is a smart contract (reply to 20014)

Johnny Le: I mean address mate (reply to 20015)

Dmitry: Please explain what you want to do exactly. I will explain technically, as it seems that you are trying to tell me something different (reply to 20016)

Johnny Le: Ah, I want to get contract of ton token (reply to 20017)

nik: I think he asks if TON being a native coin acts like a smart contract

Johnny Le: to make a code for swap

Johnny Le: from jeton1 to jeton2 which jetton1 is TON, i got contract addres of jetton2 alr

nik: you should use a wrapped ton, stonfi uses pton for example (reply to 20020)

Dmitry: In that case, yes (reply to 20019)

Johnny Le: so no address of TON native ? (reply to 20022)

Johnny Le: https://tonviewer.com/EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv

Johnny Le: is this wton u r talking about

Alexander: Guys I have a crypto.fc file with method: (int,int) derivePubKey(int privKey) inline_ref {   return curve_math::derivePubKey(privKey); }  I'm trying to import and declare it in tact file: import "./imports/crypto.fc";  @name(derivePubKey) native derivePubKey(privKey: Int): (Int,Int);  But I'm getting error on compilation:  Error: /home/kazrez/projects/ton/nft-contract/contracts/example_contract.tact:4:36: Syntax error: expected "bounced", "map", or "A".."Z"  Line 4, col 36:   3 | @name(derivePubKey) > 4 | native derivePubKey(privKey: Int): (Int,Int);                                          ^   5 |  How to import the method from func to tact correctly in this case?

Anton: Tact does not support tuple types like (Int, Int) yet, so you need to declare a structure with two integer fields and make it the return type of derivePubKey (reply to 20028)

— 2024-04-10 —

He: let b: StringBuilder = beginTailString(); b.append(forward_payload);  send(SendParameters{     value: ton("0.1"),     to: jetton_address,      mode: 0,     body: JettonTransfer {         query_id: query_id,         amount: amount,         destination: to,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.01"),         forward_payload: b.toSlice()     }.toCell(),     bounce: bounce  }); How to add a text postscript when transferring money with Jetton? I tried following the writing method in the document and it still showed up in the browser. Call: 0x00a8d0c2 does not display text message like Ton transfer

Asher: Предложение для тех, кто ищет разработчиков на не сложные работы. У нас заканчивается второй поток обучения в онлайн-школе, который начался 29.11.2023 Поэтому могу разместить ваши предложения в чате этого потока. Если интересно - велкам!

saddas: 6

dd: Hey guys. Is tact production-ready, or func is a safer bet for a new project ?

Johnny Le: how to pass cell data here guys

Johnny Le: via nujan

Denis: I'll bump my question hoping someone will be able to answer. I really hope someone does, this bug makes one of the core features of TON unusable with Tact. (reply to 19783)

Anton: Could you please provide a reproducible example? (reply to 20165)

— 2024-04-11 —

Boris: Can anyone tell the difference between loadUint and preloadUint?

Boris: if (msg.custom_payload != null) {     let payload: Cell = msg.custom_payload!!;     let nft_id: Int = payload.beginParse().loadUint(128);     self.nft_id = nft_id; }   Here loadUint produced this error:  //  error: lvalue expected before ~load_uint int $nft_id = begin_parse($payload)~load_uint(128);  With preloadUint it works fine..

Anton: loadUint moves the slice pointer after it reads data, but preloadUint does not do that (preload just does lookahead) (reply to 20205)

Boris: Hmm.. ok, why does the one throw an error and the other not? (reply to 20207)

Anton: because loadUint needs to mutate your slice which is a temp value in this case

Anton: if you store your slice (assign it to a variable) then you should be able to use loadUint

Boris: like   let slice: Slice = payload.beginParse() let int: Int = slice.loadUint(128)

Boris: Or do you mean assigning to the contract as a variable?

Johnny Le: Hi guys

Johnny Le: can we use merkle tree in ton

saddas: 9

Butterfly: Hello everyone! I was advised to look for upcoming projects seeking funding on the website "ton". However, I can't seem to find that particular section with projects. Could you please help?

Sumit: I am deploying a jetton from another contract. how can i store individual content ie symbol and decimals inside a jetton from the contract itself?

Scilef🦉: Hi, guys! Can anybody share with me some good walkthrough for deploying a contract to the testnet?

Андрей: А есть пример/шаблон кода на tact для nft коллекции ?

Anton: в https://github.com/tact-lang/awesome-tact что-то было (reply to 20270)

Андрей: а дорого по газу будет стоить запись и чтение из словарика на 1000 элементов ? ну и соответственно хранение

Kon: Не знаю, что у вас за задача, но для тон лучше делать контракты потомки по примеру jetton, то есть корневой контракт, а 1000 элементов это отдельные контракты, так будет намного дешевле (reply to 20272)

&rey: It won't be cheaper in most cases. Re: forward fees. (reply to 20274)

Дмитрий: hello, do you know what will be returned from 2001 / 2 ?

Дмитрий: Int type

Андрей: Подскажите, как мне при пересылке жетонов добавить комментарий у меня щас такой forward_payload forward_payload: beginCell().storeUint(0, 1).endCell().beginParse()

Андрей: пробовал так же не отображается комментарий при переводе жетонов... (reply to 20089)

Андрей: Реально ли спарсить из комментария к транзакции строку и преобразовать в адрес ? Можете подсказать решение ?

Дмитрий: Попробуй туда пихнуть asComment (reply to 20320)

Дмитрий: Попробуй address(str); (reply to 20327)

Андрей: там он slice ожидает (reply to 20330)

Андрей: let addrString: String = "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"; let addr: Address = address(addrString);  получаю ошибку Cannot reduce expression to a constant string  вообще я хочу строку из комментария к  транзакции парсить (reply to 20333)

Дмитрий: А ты попробуй так  beginCell().str.asComment().endCell().beginParse() (reply to 20332)

Андрей: насчет комментария к переводу жетона там asComment не подходит, так как он возвращает cell, а forward_payload ожидает slice (reply to 20330)

Дмитрий: Вдруг сработает (reply to 20335)

Андрей: я вот как этот парень пробовал через стринг билдер, но комментарий все равно пустой остается (reply to 20089)

Андрей: может у кого рабочий пример есть, что бы не гадать

Дмитрий: А вообще чат на английском. Давай в лс перейдём) (reply to 20339)

Андрей: в js я использовал storeStringTail для комментария, но в tact я такого не нашел

Андрей: попробую спасибо (reply to 20340)

Сардор: Привет, есть кто сможет создать токен на базе тон лаунчпад похожую на ноткоин ?  Нужно консультация, если договоримся приступим.

— 2024-04-12 —

web-assist 🧀: Всем привет, можете подсказать как из boc получить хэш транзакции?

Anton: Constant evaluation does not yet resolve constants. It’s a known issue that should be resolved in the next Tact release in April (reply to 20334)

Johnny Le: how to write a method in ton guys

Johnny Le: As I deployed a contract, how can I interact with it

Nerses: Hello everyone! I'm delving into Hashed Timelock Contracts (HTLCs) and their implementation possibilities within blockchain frameworks. HTLCs are key for enabling secure, conditional, and time-bound transactions, making them essential for things like cross-chain trades and other trustless protocols. I'm particularly curious about implementations in the Tact language. Does anyone here have experience with HTLCs in Tact, or know of any resources or examples? Any guidance or examples you could provide would be incredibly helpful. Thanks!

Danny: Goodday everyone, can anyone help me with this error. This error is throw "Failed to calculate fee" when i transfer using  const body = beginCell()   .storeUint(0, 32)    .storeStringTail("Hello, TON!")    .endCell();  tonConnectUI.sendTransaction([   {     validUntil: Date.now() + 1000000,     messages: [       {           address: Address.parse(tonWalletReceiverAddress),            amount: toNano("0.5"),           payload: body.toBoc().toString("base64")       }   ]   } ])

Danny: This is the issue i have when transaferring

Anton: The Address type is not supported by the dump function currently, see https://docs.tact-lang.org/language/ref/common#dump (reply to 20440)

Anton: However, dumping addresses will be available in Tact 1.3.0

Anton: Please share your contract code (reply to 20445)

dailyReviews.link: AI+WEB3

Андрей: Как можно использовать кастомную функцию на func используя код tact ? Видел что есть возможность использовать нативный код func К примеру я хочу использовать такой код у себя в контракте, взял из верефецированного контракта  How can I use a custom function on func using the tact code?

Андрей: этот пример не особо понятен... https://docs.tact-lang.org/book/functions#native-functions

Андрей: where should I write the func code myself? to which file?  сам код который на func мне нужно где прописать, я так понял то что я в tact просто обёртку для него делаю и он должен сметчиться по имени что бы выполнился этот метод ? (reply to 20470)

Андрей: я не понимаю, в примерах указываются методы которые уже реализованы в func и в tact они просто типо переопределение, но а если мне нужно кастомный код на func переопределить, куда мне его записать ? в каком файле хранить...

Андрей: thank you very much 👍👍👍 (reply to 20476)

Андрей: don't work in my case....  How i can send jetton with comment ? Transfer{     query_id: now(),      amount: 1000000000,      destination: ctx.sender,      response_destination: ctx.sender,      custom_payload: emptyCell(),      forward_ton_amount: ton("0.01"),      forward_payload: "test".asComment().asSlice() } (reply to 20340)

Boris: How to setup this emulator locally? https://tact-by-example.org/03-errors

Anton: https://github.com/tact-lang/tact-by-example (reply to 20487)

Boris: yeah, thank you, just found it (reply to 20488)

Boris: do you have to rebuild the contracts manually? (reply to 20488)

— 2024-04-13 —

Sa: Hi everyone, is there any way to make local development like ganache ?

Jimmy Becen: hi guys how to load the map key after doing map.asCell()

Konstantin: hey guys! i need your help) i did mint for classic implementation of jetton (sample jetton + master jetton + wallet), but my tx is failed (exit code 5) https://testnet.tonviewer.com/transaction/75652678116b74c13154eed2ad80450443e0544aa1f7fea574c03a9f705e0e94  my script for minting:  const sampleJetton = provider.open(await SampleJetton.fromAddress(simpleAddr));      const message: Mint = {         $$type: "Mint",         amount: 10n,         receiver: receiver,     }      await sampleJetton.send(         provider.sender(),         {             value: toNano('0.05'),         },         message     );      await provider.waitForDeploy(sampleJetton.address); what am I doing wrong?

User<798352611>: The message and struct types have a limit on the number of keys, but it is not mentioned in the documentation.

User<798352611>: Can only hold up to 15 keys

Konstantin: but message hold just three (type, amount, receiver), sorry don't get you (reply to 20543)

User<798352611>: struct Keys {     key1: Address;     key2: Address;     key3: Address;     key4: Address;     key5: Address;     key6: Address;     key7: Address;     key8: Address;     key9: Address;     key10: Address;     key11: Address;     key12: Address;     key13: Address;     key14: Address;     key15: Address;     key16: Address; //will can't build }

Anton: just tried your example with https://ide.nujan.io and it builds successfully

User<798352611>: games: map<Int, Keys>; self.games.get(1);

User<798352611>: add this 2 lines; build it will show error

User<798352611>: if you delete key16 of Keys, it is normal,

Nick WAL: Всем привет! Ищем разработчика на ton, который напишет смартконтракт для игры формата plinko с алгоритмом сжигания для токена.

Anton: thanks, reported here: https://github.com/tact-lang/tact/issues/248 (reply to 20548)

User<798352611>: thank you

User<798352611>: message type have same question

Shah: How to do. Kindly learn me

Boris: Is there a way to convert a struct into a Cell and vice-versa?

Boris: Or somehow provide typing for a Kind of Cell?

Boris: lets say you have a   message MyMessage {   data: Cell; }   Its not clear what kind of data are inside the cell.

Boris: Ok, basically what I need in my contract is both the struct representation and the cell representation. I guess its then better to use struct for the interface part and create the cell on the fly where its needed.. 🤔️️️️️️

Vlad: Creating a mapping, setting value, but can't read it using get method     itemClaimed: map<Int, Bool>;    setting value,         self.itemClaimed.set(itemIndex, true);   but can't read it using this get method           get fun itemClaimed(index: Int): Bool{         return self.itemClaimed.get(index)!!;  }

Vlad: I am calling the get method like this in typescript   const claimed = await contract.getItemClaimed(0n);

Vlad: getting this error     Test suite failed to run      TypeError: Do not know how to serialize a BigInt         at stringify (<anonymous>)

&rey: Do you have false values also set in the map? !! operator does not provide default value but rather throws error if there is null. (reply to 20593)

Vlad: But I am trying to get the true value out of it

Vlad: if I put get method like this    get fun itemClaimed(index: Int): Bool?{         return self.itemClaimed.get(index);  }   I am getting  ``null`

Vlad: You mean there are no default values? (reply to 20596)

Anton: Nope (reply to 20599)

Vlad: hm, interesting:  if I set the value to "false" and then set to "true", all works fine  if I just set it to "true", I get null

Vlad: actually the interesting thing is that   I first set the value with key of type "Int as uint64" to false   if I set it with key of type "Int", I get null (reply to 20601)

Vlad: self.itemClaimed.set(self.itemCounter, false); // Int as uint64         self.itemClaimed.set(itemIndex, true); // Int   gives me true

Vlad: self.itemClaimed.set(itemIndex, false); // Int         self.itemClaimed.set(itemIndex, true); // Int    gives me null

Boris: How big do you expect the map to get? (reply to 20606)

Vlad: Up to 100k entries (reply to 20609)

Vlad: This issue is with only one entry though (reply to 20606)

Dmitry: Hello everyone! Does anyone know, can jetton master receive events for getter methods?  I need to get jetton wallet address for my contract, can I receive it onchain?  Can contract checks balance of its jetton wallet?

&rey: Not possible, you'll hit cells storage limit at 32k entries. (reply to 20612)

&rey: And users will wonder about the fees.

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: 5

NeerdOner: Where I can found ready to deploy jetton template?

Kevin: Check ton foundation docs they have examples (reply to 20673)

NeerdOner: On tact? (reply to 20674)

NeerdOner: I found only on FunC (reply to 20674)

— 2024-04-14 —

Vlad: It’s possible if your Jetton is discoverable (reply to 20647)

Vlad: Not through get methods though, only messages

Vlad: Has anyone tried using load_dict function in tact?   struct DictLoadRes{     slice: Slice;     dict: Cell; }  @name(load_dict) extends native loadDict(self: Slice): DictLoadRes;   wonder if I am doing right

Vlad: #compiler  trying to use    nativeThrowWhen(906, res.slice.empty());  getting this error   error: undefined function `throw_when`, defining a global function of unknown type       throw_when(906, slice_empty?($res'slice));

Vlad: what is the best way to check if Dict is empty in tact? sth like  dict.dict_empty?()

Thang: hi

Thang: i deployed contract tact

Thang: but have a error

Thang: can who help me?

Vlad: That works actually (reply to 20685)

Anton: simply compare if your map is equal to null (reply to 20700)

&rey: Yes, with some code like here: https://gist.github.com/ProgramCrafter/53fc3a4846397ee5f3f3b25ca3356ab5. (reply to 20647)

&rey: That's absolutely onchain, works on recent TVM update without any messages and requirement for jetton to be discoverable.

Vlad: Oh, they just rewrote the calculate wallet address function in tact 👍 (reply to 20719)

Vlad: Have same in my contracts)

Spa: i get it

Spa: this tool is very nice

&rey: I'd bet you don't. My code RUNVM-s jetton master contract to get own jetton wallet. (reply to 20722)

Spa: "ide nujan io" this is very nice

Spa: this is website

Vlad: What is this runvm?

Vlad: what does RUNVM-s mean?  Would appreciate any reference (reply to 20753)

&rey: See the first TVM upgrade on docs.ton.org. It means that a certain (possibly untrusted) TVM code is executed inside a contract. (reply to 20767)

Vlad: This is the latest update, right? (reply to 20768)

&rey: No, 2023-07 one. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#runvm (reply to 20769)

Vlad: Thanks!

Ken: How many bits does VarUInt16 take?

M-A™: 15

Ken: So the definitions are: var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))          = VarUInteger n; #< x - Nat less than x bit unsigned integer stored as lenBits(x - 1) bits, up to 31 bits According to my understanding if len<=16 then value takes max 128 bits, while len takes (15?) bits. But you don't need 15 bits to store a value up to 16 (you only need 5 bits). What am I missing here?

Ken: More confusingly, Tact-by-example states that Int as coins;           // range 0 to 2^120 - 1 (takes 120 bit = 15 bytes)

Behrang: More details here:  https://t.me/tondev_eng/42653 (reply to 20772)

Ken: This is the confusing part of the documentation then ``` #< x - Nat less than x bit unsigned integer stored as lenBits(x - 1) bits, up to 31 bits It should be #< x - Nat less than x, stored as lenBits(x - 1) bits unsigned integer, up to 31 bits ```

DEVgenerate: What is the correct way to deposit exact amount to the smart contract using blueprint? I couldn't find the answer to that in the docs. I want the user to send 1TON via receive function + gas cost. And the contract to refund anything above 1 TON

ayushag: Hey, can anyone tell me about any good resources for learning tact?

DEVgenerate: Search for tact lang book (reply to 20788)

Sumit: i want to construct a jetton’s jetton_content inside a tact contract. how can i do that?

Green: hi

Green: I met 500 Internal Error when deploy with sandbox-v4.tonhubapi

Green: Does anyone met the same error?

Spa: my codes can build, but can't build on nujan online.  "Error while building"

Ilya: Hello everyone  I'm new in tact language, and cant uderstand how is required working I put my require condition in init() block, and set message and condition. Yes, my test is failed, but where can I looking for a message from required condition?

Thang: Build script running, let's find some FunC contracts to compile.. 'func' is not recognized as an internal or external command, operable program or batch file.  FATAL ERROR: 'func' with version >= 0.2.0 executable is not found, is it installed and in path?

Thang: hey everyone, how to fix it

Kevin: Ask chatgpt (reply to 20825)

Kevin: Your problem is extremely basic and you should look for some good resources to explain it

Sergey: What is the difference between varuint and uint?

Андрей: Can someone send an example of a json file for the nft collection ?

Sergey: Спасибо!! (reply to 20836)

Андрей: Подскажите по nft не совсем понимаю принцип, для каждого отдельного itemNFT нужен отдельный json ? Как правильно реализовывать минт нового нфт, подготовить json с мета датой, типа: 1.json 2.json 3.json   И при генерации нового нфт в контент передавать нужную ссылку на json с методатой или как делают ?

Spa: i find a bug on nujan website . i can's use map<Address,Int> , if i use this , i will can't build. i will get a error.

Spa: i can't send website URL, this group chat have a bot, this bot always delete my chat.

Peter: Hey Guys I am new here

— 2024-04-15 —

Saptor💠🐾: Gm gm same (reply to 20869)

reverie: hey guys

reverie: wondering anyone know  the interface(“org.ton.jetton”) grammar

reverie: saw it in the jetton tact sample implementation

Sa: hi guys, how can I get the address of deployer

Dmitry: provider.address, but usually it is your wallet (reply to 20897)

Sa: I want to deploy jetton token with deploy script. but it's failed    import { toNano } from '@ton/core'; import { Token } from '../wrappers/Token'; import { NetworkProvider } from '@ton/blueprint';  import { Address } from '@ton/core'; import { buildOnchainMetadata } from './utils/jetton-helpers';  export async function run(provider: NetworkProvider) {     let owner = Address.parse('UQBvc2UnNWGyp761BoLdQQmto4EXHkBPsCDC69CU7lAR7STc');      const jettonParams = {         name: 'VKRO Token',         description: 'This is description of Test Jetton Token in Tact-lang',         symbol: 'VKRO',         image: 'https://avatars.githubusercontent.com/u/104382459?s=200&v=4',     };      // Create content Cell     let content = buildOnchainMetadata(jettonParams);     let max_supply = toNano(123456766689011);      const token = provider.open(await Token.fromInit(owner, content, max_supply));      await token.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         },     );      await provider.waitForDeploy(token.address);      console.log('ID', await token.getGetJettonData()); } (reply to 20901)

Sa: Error: Exit code: 18668

Sa: I'm using blueprint

Nerses: Hi everyone ! Is there any platform (like Remix for Solidity) where you can test smart contract written in TACT ?

Anton: https://ide.nujan.io (reply to 20943)

Nerses: please can someone help ? for this piece of code struct HTLC {     hashlock: Int as int256;     secret: Int as int256;     amount: Int as coins;     timelock: Int as uint256;     sender: Address;     _receiver: Address;     redeemed: Bool;     refunded: Bool; }; i get this error Syntax error: expected ":" Line 8, col 8:   7 | > 8 | struct HTLC {              ^   9 |     hashlock: Int as int256;. i checked in docs seems everything is ok but can not figure out why I get that error

Marcus: You don't need a semicolon at the end of a struct, could be causing other syntax errors below (reply to 20953)

Nerses: Thanks a lot (reply to 20954)

Marcus: Hey everyone, I'm trying to write a contract that implements Jetton.  So in my buy function, I am running into quite alot of issues when trying to send TON to someone.   receive(msg: Buy) {     let price: Int = self.calculatePrice(self.totalSupply, msg.amount);     let shareFee: Int = price * self.shareFeePercent / 100;     let forwardFee: Int = context.readForwardFee();     require(context().value >= price + shareFee + forwardFee, "Not enough value");          // send funds code, see below     // ...     // send funds code, see below      self.mint(...); }   I'm unsure what parameters I should be putting here, as using SendPayGasSeparately always fails my transaction.    // A send(SendParameters{     to: self.owner,     value: shareFee,     bounce: false,     body: SendShareFeeSuccess{ amount: shareFee }.toCell(),     mode: SendIgnoreErrors + SendPayGasSeparately }); // B send(SendParameters{     to: self.owner,     value: shareFee + forwardFee,     bounce: false,     body: SendShareFeeSuccess{ amount: shareFee }.toCell(),     mode: SendIgnoreErrors });   Appreciate anyone's help 🙂

K⁧: how to represent address as string?

Nerses: have you tried toString() method ? (reply to 20960)

K⁧: Type "Address" does not have a function named "toString" (reply to 20962)

Ken: In Tact or Typescript? (reply to 20960)

K⁧: tact

Anton: if it’s a constant you can use the address builtin:   address("UQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doczSI")  address("EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN")  address("0:4a81708d2cf7b15a1b362fbf64880451d698461f52f05f145b36c08517d76873")   but if you need it for a variable string, then you’ll have to wait until Tact 1.3.0 release (should be soonish) (reply to 20960)

Anton: or you can get it from the Tact implementation and write some bindings for FunC code

Sa: is there any example for tact and blueprint to deploy a jetton token

K⁧: I need the other way around (reply to 20971)

Ken: https://github.com/microcosm-labs/tact-libs/blob/ab677df79f4803feed6846954a76ef159dcff279/utils/string.tact#L748  I have a library for it, but the foundation denied by bounty request lol https://github.com/ton-society/grants-and-bounties/issues/413 (reply to 20960)

Ken: you can write myAddress().to_base64(false).asString();

K⁧: Should I import like that?

K⁧: Still have trouble  Error: example.tact:223:24: Type "Address" does not have a function named "to_base64" Line 223, col 24:   222 |         builder.append("/"); > 223 |         builder.append((self.jetton!!).to_base64(false).asString());                                ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   224 |         builder.append("/");

K⁧: @kenxfi

Ken: issue with import, maybe try without the .tact suffix

K⁧: the same error (reply to 20984)

K⁧: also wrong example.tact:227:24: Static function "to_base64" does not exist Line 227, col 24:   226 |         builder.append("/"); > 227 |         builder.append(to_base64(self.jetton!!, false).asString());

Ken: import issue, can't say further

K⁧: Yes it was exactly my fall with import (reply to 20987)

K⁧: I created file but I didn't save it 😅 I have vscode. How to make autosave like in idea?

Nerses: in the top left corner there is file>autosave (reply to 20990)

Nerses: Who can help to overload = operator for this struct ? solidity struct HTLC {         hashlock: Int as int256;         secret: Int as int256;         amount: Int as int256;         timelock: Int as uint256;         sender: Address;         _receiver: Address;         redeemed: Bool;         refunded: Bool;     }

Ken: save it into a Slice and use Slice.hash() (reply to 20995)

Scilef🦉: Is somewhere an example of a NFT contract written with tact?

— 2024-04-16 —

Zero: does anyone know where to get the LP status of a token on TON?

Sonny: Let me ask, how can I transfer the ton to the owner in tact

Jimmy Becen: hi guys, Please give me example for addliquidity in ston-fi

Nerses: Hi everyone. I try to deploy counter smart contract written in tact  using https://ide.nujan.io/ . But transaction bounces back and I cant see the contract in testnet. What can cause that ?

Howard: what do you mean the integrate here (reply to 19069)

Howard: can check STON.fi's code I remember (reply to 19164)

Дмитрий: I already done it, tnx (reply to 21072)

Sumit: Connect (reply to 21071)

Howard: can you highload wallet(I think I answered it in other chat (reply to 19233)

Howard: like these SDKs: import { toNano } from '@ton/core'; import { Factory } from '../wrappers/Factory'; import { compile, NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const factory = provider.open(Factory.createFromConfig({}, await compile('Factory')));      await factory.sendDeploy(provider.sender(), toNano('0.05'));      await provider.waitForDeploy(factory.address);      // run methods on `factory` } (reply to 21074)

Sumit: Yes (reply to 21076)

Bear: I have the Cell data put into the Contract.  If I want to adding the cell data with the sender address, I try like this:         let newBuilder: Cell = beginCell().storeRef(msg.minting_info).storeAddress(sender()).endCell();         self.mintTokenTick(sender(), newBuilder, jettonContent, symbolHashing);

Bear: is it correct? msg.minting_info is the Cell way less than 1024 bits (reply to 21080)

Андрей: Given the new low commission rules, what should the token transfer function look like in a smart contract?

SU: 8

Louis: I want to write a contract for jetton and mint tokens for users, but only wallets on the whitelist can transfer those tokens. Can anyone give me some suggestions?

Konstantin: guys, please advise me. if a deployed contract with nft-collection, but when a i going to open it in tonscan - i got This address is not an NFT what does it mean? i am not implemented properly some stuff?

Nerses: How can i concatenate strings in TACT and convert Address to String ?

Green: Does anyone write tact jetton contract that can update tax when transfer

Alexander: hey guys. I need to verify signature by address. I have a function: fun verifySign(data: Slice, signature: Slice, address: Address) {     require(checkDataSignature(data, signature,address), "Invalid signature"); } But I need address to be integer. How to transform address to public key?

Sumit: require(myBalance() > amount, "Insufficient Funds");         self.TVL -= amount;         send(SendParameters{value: amount, to: to, body: "From Emmet.Finance Bridge".asComment(), bounce: true});  my this transaction is failing with Code 40  what could be the problem?

Boris: you can’t get the public key directly from the address, a keypair can have multiple addresses. However, you can get the publicKey from the wallet contract (reply to 21123)

— 2024-04-17 —

Alex: Have you found the solution of this issue? I ran into the same problem at the TakeWalletAddress stage, and don't understand what i do wrong (reply to 16335)

Baldwin: Who have sample contract nft for tact language?  I only sample for jetton

Vlad: Is there a way to store integer as a slice in cell?

Sonny: Hi , Hello, I want to get the token price, how can I do that?

reverie: hi anyone knows how to the token master from transfer_notification

reverie: like someone transfer A token to wallet owned by contractB, however contractB has no idea to know the which token right?

Sa: could you share your jetton sample ? (reply to 21189)

reverie: for instance    body: TokenNotification { // 0x7362d09c -- Remind the new Owner                         query_id: msg.query_id,                         amount: msg.amount,                         from: msg.from,                         forward_payload: msg.forward_payload                     }.toCell()

reverie: after transfer , notification will be sent, however, the receiver has no idea  what is the token master, only amount and from is known

Baldwin: check it https://tact-by-example.org/07-jetton-standard (reply to 21199)

Sa: I want to use blueprint to deploy this on testnet, but I cannot find any example script . (reply to 21202)

reverie: yes, I checked code from here (reply to 21202)

Baldwin: check dm me (reply to 21203)

reverie: things strange is here    if (msg.forward_ton_amount > 0) {              send(SendParameters{                 to: self.owner,                 value: msg.forward_ton_amount,                 mode: SendPayGasSeparately + SendIgnoreErrors,                 bounce: false,                 body: TokenNotification {                     queryId: msg.queryId,                     amount: msg.amount,                     from: msg.from,                     forward_payload: msg.forward_payload                 }.toCell()             });         }  once the TokeNotification is sent, how the receiver know the token type, since only amount and from

Vlad: i want to do sth like this   storeSlice("[{'trait_type': 'principal','value': '}]".asSlice()).storeSlice(ctx.value) (reply to 21192)

Vlad: save a dynamic string

Nerses: Hi everyone !  How can I convert Address type to String type in TACT ?

Wendy: 9

Wendy: 9 (reply to 21236)

Wendy: 9 (reply to 21236)

Wendy: Hi

Wendy: Hey guys, I want to call self. mint twice in a single receive function

Wendy: For jetton token, but it failed (reply to 21260)

Wendy: receive(msg: Referral){     require(context().value >= ton("1"), "Wrong Value");     require(self.mintable, "Can't Mint Anymore");     self. mint(context().sender, 1, self.owner);     self. mint(msg.referredBy, 1, self.owner); }

Wendy: If I just use one self. mint, it works (reply to 21271)

Wendy: But I want to call self. mint twice

Jimmy Becen: I encountered this error when writing some more simple code. I think it's the maximum size code  Build script running, compiling PreSale ⏳ Compiling...   > 👀 Enabling debug    > PreSale: tact compiler    > PreSale: func compiler File not found    > PreSaleMaster: tact compiler    > PreSaleMaster: func compiler    > PreSaleMaster: fift decompiler 💥 Compilation failed. Skipping packaging Error: Could not compile tact how many maximum codes are there in the file

Sergey: Hi, how can I find out the jeton to ston rate from the contract?

ASD: 13

Jeremy: How to verify a contract

web-assist 🧀: Тут есть русскоязычные разработчики?

Dmitry | backend4you.ton: a lot, but please use English here. You may ask in @tondev in Russian (reply to 21318)

web-assist 🧀: is a hard rule for chat? (reply to 21320)

Dmitry | backend4you.ton: You are not banned yet, but this means nothing :) (reply to 21321)

web-assist 🧀: Если это не установленное администраторами правило - не вижу проблемы общаться на том языке, на котором мне привычно говорить. Так что не понимаю твоей претензии Я думал тон и его сообщество за открытость, прозрачность и свободу (reply to 21322)

Dmitry | backend4you.ton: Feel free to do anything you want until admins come :)

Alex: Привет, я не хочу писать собственный жетон поэтому использую готовый из официального минтера. Но я хочу уметь делать сообщение Mint из Typescript и из Tact. По коду на гитхабе я увидел, что это возможно, однако у меня возникли сложности с билдом сообщения. Как я могу это сделать? Есть ли готовые примеры, описанные где либо?

K⁧: when a message from require func will be supported in blockchain?

Sergey: Are there generic types in the tact?

— 2024-04-18 —

Wendy: is there a complete code exam using tact and blueprint for NFT

Louis: hello guys, can i emit event then listen and scan it in backend like evm?

Sa: is there any example which I can transfer jetton token from a user wallet to other wallet ?

Sa: https://github.com/microcosm-labs/tonup-contracts  this link is not available now

Fast is slow: Hi, how do I check the event details in testnet? In tact, I did the following: emit(EventMintRecord{             minter: sender(),              item_id: self.next_item_index,              generate_number: nativeRandom()          }.toCell());

Fast is slow: but i dont know in the frontend, how can i find the same record

Fast is slow: how do i get the data from the BOC? using the following code? const someTxData = await myAppExplorerService.getTransaction(result.boc);

Max: Hey folks, I try to generate random int from to. For some reason, I get the same results in my tests. What did I miss?    nativePrepareRandom();  let winnerId: Int = random(0, self.next_ticket_id - 1);

Viacheslav: also interested, have the same behaviour, feels like it’s randomized only at comile stage (reply to 21403)

Vladimir: Hi guys! Meet the hero of Tact - Anton Trunov🔥  Enjoy the episode, it's in Russian, but there are automatic subtitles.  https://www.youtube.com/watch?v=Cg7geUDHH4A  And drop by our hackathon, there are 12 days left to register.  By the way, Anton is holding a live workshop today.

Stanislav: Hi, mb somewhere are example of smartcontract for bets-battles? when 2 user pay first, and after time end winner get award, which is a sum of star payments

Spetsnaz: I'm trying to get around extensions, but something is not clear. I know they can extend, for example, an Int and add methods to it. But what I'm trying to achieve is:  I have a trait that defines a function: foo, in the contract, I want to extend the functionnality of that foo function to do additional stuff.  The only work around I thought of is to send() a message to the same address of the contract.

Marcus: I believe it's because self.mint has a SendRemainingBalance call inside, and the cashback in your case is sent to self.owner, not myAddress(). So that means your next self.mint will fail because it doesn't have enough to pay for gas (reply to 21271)

Wendy: I see, thank you! (reply to 21416)

Sa: await token.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'TokenTransfer',             queryId: 0n,             amount: toNano('100'),             destination: stakingAddress,             response_destination: provider.sender().address!!,              custom_payload: null,             forward_ton_amount: toNano('0.0333'),              forward_payload: packed_stake,         },     );   I’m trying to send jetton token, but the exit code is 130. please help me.

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: 12

encs: hello everyone, how should I manage multiple received tokens in a contract? How can I differentiate them?

shereMeshchain.Ai🌱SEED🐍🔵 ONUS: 5

deFIATer: seems they deleted (reply to 21382)

User<6468801057>: Hi everyone in the chat, I would like to invite you to join our new web3 project. We need experienced translators and nft makers, also looking for beta testers. From us: decent pay and good schedule. If you are interested, I am waiting for you in private messages.

Green: Hi Everyone, Can anyone deploy tact contract success now?

Green: I met 500 internal server error when deploying with this endpoint "https://mainnet-v4.tonhubapi.com"

Stanislav: Hi,  mb somewhere are example of such smartcontract for bets-battles? when 2 user lock some tokens, and after time end winner get award, which is a sum of star payments

bonibanana: 17

— 2024-04-19 —

Сергей: 12

D: hi, please tell me how can I return a comment without returning all funds? i use reply but it refund all income

Miras: reply is similar to the send() method with mode SendRemainingValue, so I guess you should just use send() method without SendRemainingValue mode  you can read more about modes here https://docs.tact-lang.org/book/message-mode (reply to 21599)

User<6468801057>: Hi everyone in the chat, I would like to invite you to join our new web3 project. We need experienced translators and nft makers, also looking for beta testers. From us: decent pay and good schedule. If you are interested, I am waiting for you in private messages.

Alexander: Hey guys. I have a method in smart contract: get fun verify_sign(data: Slice, signature: Slice): Bool {   return checkDataSignature(data, signature, self.public_key); } I want to test it with blueprint tests. I'm trying to run: const data = beginCell(); data.storeUint(123,32); data.endCell();  // validatorPrivateKey is the key for self.public_key in contract const signature = naclSign(data.asCell().hash(), validatorPrivateKey); const signatureSlice = beginCell().storeBuffer(signature).endCell();  const result = await nftCollection.getVerifySign(data.asCell(), signatureSlice);  console.log(result); But it returns false in result. Why?  P.S. naclSign is an alias for nacl.sign from ton-crypto

Sa: Warning: blueprint's Sender does not support bounce flag, because it is ignored by all used Sender APIs To silence this warning, change your bounce flags passed to Senders to unset or undefined   Why bounce is not support here ?

外汇结算现金收U: 哪個高手能寫合約啊？

D: i can use send 2 times in one recieve method?

Nerses: Hi everyone ! How can I verify my smart contract deployed in testnet ?

Vlad: Йоу

Miras: You can search it in tonscan   https://testnet.tonscan.org (reply to 21677)

Nerses: Thanks a lot (reply to 21696)

Miras: Also if you are using Blueprint you can write your own tests like deployment test   https://docs.tact-lang.org/book/guides/getting-started/test (reply to 21677)

Miras: Sure (reply to 21672)

Nerses: Yeah I use blueprint.while writing deployment script I have some difficulties so used ide Nujan instead. Thanks for sharing your knowledge (reply to 21699)

Alex: Hi guys, I ran into the strange behavior of blueprint. I do "npx blueprint run", choose script, choose mainnet -> TonConnect ... -> TonKeeper. And then scripts starts, and send "unable to connect to wallet", and if I remove the wallet session, it starts, and throw this error: node:internal/process/promises:289             triggerUncaughtException(err, true /* fromPromise */);             ^  [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "#<Event>".] {   code: 'ERR_UNHANDLED_REJECTION' } How to fix it?

Cloud: hi guys, can we "upgrade/update" a TON smart contract without changing the Address, and existing data?  I believe there would be complex pattern like contract proxy, just wondering if something is different on TON?  additional context: I'm using Tact, guess that it would be no different versus FunC

Cloud: I found the answer for above question here: https://docs.tact-lang.org/book/upgrades, at least Tact did not support contract upgrade yet (reply to 21733)

Cloud: but still wondering how to do upgrade-able smart contract in TON, even with FunC - if anyone have clue or link, that would save my life 🙏

D: random on emulator - not random? I run the test and get the same value every time

Daniil: Because the seed is the same

D: thanks, is there a way to generate random? (reply to 21743)

Daniil: https://docs.tact-lang.org/language/ref/random (reply to 21744)

D: thanks, that's what I used. I have a problem, how to choose a random number so that it is different each time with the same from and to (reply to 21746)

Daniil: tests will have the same seed everytime probably (reply to 21747)

— 2024-04-20 —

Behrang: Check here for an example in FunC:  https://github.com/HipoFinance/contract/blob/d5b0d2eab0ff64a0b148c0e36acb61afac202b12/contracts/treasury.fc#L1705 (reply to 21739)

Tikhon: Hello! I have an example, in what repository to create an issue? https://github.com/jokly/tact-bug (reply to 20188)

Spetsnaz: Anyone can help with this one please? I still didn't figure it out (reply to 21415)

Spetsnaz: Found it, virutal functions (reply to 21788)

Роман: Hello everyone, what could be the problem?  FAIL  tests/main.spec.ts   main.fc contract tests     × should get the proper most recent sender address (234 ms)    ● main.fc contract tests › should get the proper most recent sender address      Unable to execute get method. Got exit_code: 11

Роман: async getData(provider: ContractProvider) {         const { stack } = await provider.get("get_the_latest_sender", []);         return {           recent_sender: stack.readAddress(),         };     }

Roman: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes#standard-exit-codes (reply to 21814)

Roman: Check «get_the_latest_sender» function in your contract. There is probably something wrong with it. (reply to 21814)

Роман: he looks good  slice get_the_latest_sender() {     slice ds = get_data().begin_parse();     return ds~load_msg_addr(); } (reply to 21817)

Roman: Did you (re)compile your contract after changing? (reply to 21818)

Роман: yes (reply to 21819)

Noah: hi guys!

Roman: I would check the data of the contract - get_data() may return empty result. slice addr = ds~load_msg_addr(); ~dump(addr); return addr; and check console output. (reply to 21818)

Роман: thank you so much (reply to 21827)

gf: can someone explain, shouldn't I get the same addresses in console.log?          let jettonWallet = blockchain.openContract(             await JettonWallet.fromInit(                 jettonMaster.address, deployer.address             )         );          console.log(jettonWallet.address, 'addresswallet');          const addressTest = await jettonMaster.getWalletAddress(deployer.address);          console.log(addressTest, 'addressTest')       init(parent: Address, owner: Address) {         self.parent = parent;         self.owner = owner;         self.balance = 0;     }        get fun walletAddress(owner: Address): Address {         let init: StateInit = initOf JettonWallet(myAddress(), owner);         return contractAddress(init);     }

Jeremy: Hey everyone, do you have any examples of works contracts for factories?

Jeremy: How can I create other contracts from the factory contract?

Noah: is there a vscode extension support tact syntax?

Eagle: Hello guy I need to connect with a TON dev for the Open League Hackathon to complete our team. If you are familiar with Tact please DM me

Anton: https://marketplace.visualstudio.com/items?itemName=KonVik.tact-lang-vscode (reply to 21847)

Noah: thanks! (reply to 21853)

Noah: 1 more question! is there good example to interact multiple smart contract thru tact?

Cloud: thank you so much @behrang 🙏 (reply to 21778)

Spetsnaz: Hey guys. I know that on TON, things are asynchronous and we can’t just query directly the contract to know the balance. So the solution is to build notifications to send back. This is fine.  What about querying Jettons which are outside of my control? I would like to know the balance of a certain Jetton (which I have the address of) from my contract in the sender’s wallet.  Any way to query standard Jettons asynchronously to get the balance?

— 2024-04-21 —

Yakitori: I'm curious about this too (reply to 21930)

Spetsnaz: I think the logic should be to init the default jetton contract with the sender's address, but I wonder where to go from there (reply to 21930)

Yakitori: https://tact-by-example.org/07-jetton-standard if you check this contract, there is no way to get the balance from an internal call? (reply to 21942)

Spetsnaz: It’s not about that. I have FooContract for example which is not a Jetton. I want to know the balance of JettonX of the sender()’s wallet from within FooContract (reply to 21947)

Spetsnaz: It’s not possible to query the Jetton directly and getters do not work (reply to 21948)

Spetsnaz: Trying to find a way in Tact (better) or FunC to know the balance of JettonX that the sender() is holding (reply to 21949)

Yakitori: I understand, I'm looking for the same thing (reply to 21950)

Yakitori: https://tonresear.ch/t/tep-137-enhancing-jetton-wallets-introducing-onchain-balance-queries/154 (reply to 21950)

Yakitori: It isn't implemented in most deployed wallets

Yakitori: kek goodbye any hopes of composability

Spetsnaz: Got it. How does then Tonkeeper and the likes know all the jettons a wallet is holding?

Yakitori: 2024 it's time 😬

Yakitori: Getter functions allow you to query off-chain (reply to 21956)

Spetsnaz: I know, but the exploration of the jettons a wallet has

Yakitori: tl;dr you can read the state off-chain but not on chain

Spetsnaz: So a wallet has multiple smart contracts to represent Jetton Wallets. I see no where in the main Jetton Master to know how many jettons, even off-chain

Yakitori: I think that they run an indexing program that parses the transactions to see it (reply to 21959)

Spetsnaz: Got it, I'll have to look for some apis that can help with this then (reply to 21962)

Yakitori: You can use Tonkeeper's API

Yakitori: https://tonapi.io/ (reply to 21963)

Spetsnaz: Nice (reply to 21966)

Spetsnaz: Thanks

&rey: What is "total_supply"? (reply to 21961)

encs: Total supply returns the number of jettons in circulation (reply to 21976)

encs: Once they are minted they are put in circulation thus increasing total supply

User<5782801949>: I want to learn Tact language.  What are requirements ate needed?

reverie: wondering how should I get information from emit()

reverie: like in Eth, you could client.filterLog({})

reverie: I tried to get transactions and trace, however, can not find the log I emitted

Ken: I wrote a documentation generator for Tact. https://github.com/microcosm-labs/tact-tools/tree/main/tactdoc

Vladimir: 404 (reply to 22113)

Ken: oops...just made it public😄

Yakitori: Wow! Greaaat! (reply to 22113)

Yakitori: Btw, I saw your TEP for on-chain balance query - it's really, cool, thanks for proposing it

Yakitori: By the way, can I do cross-contract calls during getter functions?

— 2024-04-22 —

Diego: hello everyone, its just i'm starting with Tact and I'm reading in the Ton docs that replay should be avoided for security reasons, does anyone know how to implement such validations in tact? thanks in advance

Yakitori: It's mainly with Jetton wallets, usually setting a nonce is sufficient I think? (reply to 22142)

Diego: a nonce is a seqno? or is it something different?

Yakitori: Yeah (reply to 22146)

Diego: thanks a lot

Yakitori: Just like with Ethereum, each transaction has a nonce number that increases with each transaction

Yakitori: So you can't replay an old transaction with a lower nonce

Diego: great tks again for the explanation, is just I forgot to mention I'm also new to blockchain in general lol

Diego: but I think I get it its just a way to check its not the same message given it a number

Yakitori: You can add a counter held in the state of the contract, and when you pass a transaction you need to give a nonce. (reply to 22152)

Diego: I guess i should get the next id from a getter function and add this id to the message im going to send and then check it

Yakitori: If the nonce is lower or equal to the current nonce, you revert

Yakitori: And if the transaction is valid, update the counter

Diego: thanks a lot Yakitori

Yakitori: I'm a Solidity dev, but Tact noob so haha let's help each others out ! (reply to 22157)

Diego: btw getting next id doesn't have problems of concurrency?

Diego: like 2 different proccesses consuming the same id?

Yakitori: Humm I don't think so - usually a nonce will be used for the user endpoint (his wallet for instance), so unless he sends 2 transactions with the same nonce at the same time there wouldn't be a problem? (reply to 22159)

Diego: oh ok I get it

Baldwin: How to listen for event emit?

&rey: On one contract or several? (reply to 22180)

Baldwin: Contract sir (reply to 22187)

&rey: Listen for messages on it, and get "external out". (reply to 22188)

&rey: Then, parse message body by TL-B.

dd: What is the common approach to upgradeable contracts on ton ?

Jimmy Becen: hi guys How to send a message whose payload is a multi-element array of address? I tried storeAddress but it only allows store to have a maximum of 3 addresses

Miras: Hi! storeAddress stores your data into Cell. Cell is limited to 1023 bits of data and can store up to 4 references to another cells. So what you can do is to store addresses into multiple Cells and make references to these Cells  https://docs.tact-lang.org/language/ref/cells https://docs.ton.org/learn/overviews/cells (reply to 22199)

Jimmy Becen: Tks for rep! I found the Dictionary in tone-core. But I don't know any way to read the value in Tact Smartcontract (reply to 22204)

Pike 🦴 🏴‍☠️: hi, small question, i want to write a custom message

Pike 🦴 🏴‍☠️: how exactly do you calculate the hash in the message

Miras: there is Map type in Tact which is actually a dictionary, but I do not recommend to use it if you have unlimited or big amount of entries  https://docs.tact-lang.org/book/maps (reply to 22207)

Miras: hi! you can omit the hash in the message because Tact automatically generates them (but you can overwrite it if you wish)  https://docs.tact-lang.org/book/structs-and-messages#messages (reply to 22209)

Jimmy Becen: tks you! (reply to 22210)

Pike 🦴 🏴‍☠️: does modifying this to a random hash affect the function functionality? (reply to 22211)

Daniil: It’s recommended to just let Tact decide the opcode for you (reply to 22213)

Pike 🦴 🏴‍☠️: thanks for the answers ❤️

Sonny: I am doing the token staking function, how can I let users transfer tokens to the contract

Yakitori: Have the users send the tokens to the contract wallet and record their stake when the contract wallet notifies the staking contract (reply to 22230)

Yakitori: Btw Tact is really great, much easier to learn for noobs, and to handle the TON quirks

Yakitori: I'm learning by porting a famous ERC contract and for now I can focus on the architecture without having to figure out the bit layout like in FunC

Yakitori: Which for my small brain would be very hard to handle

Sonny: So what message will I use to transfer tokens to the TokenTransfer TokenTransferInternal TokenNotification contract?

Yakitori: TokenNotification (reply to 22235)

Yakitori: Also you can rename the message to Deposit for instance!

Sonny: Let me ask what is the difference between TokenTransfer TokenTransferInternal TokenNotification

Yakitori: I'm on my phone right now, I'd suggest that you check the Jetton Tact contract in the cookbook section (reply to 22238)

Sonny: Tks very much (reply to 22239)

Yakitori: If you have more questions  please ask I'm learning too (reply to 22240)

Yakitori: Also let's make this chat comfy asf for tact devs!

Sonny: I'm writing a simple token staking contract, like 1 month 3 months... (reply to 22241)

dd: What am I doing wrong, not one of my messages got any response lmao

dd: How to build

encs: @yakito_ri

encs: I m trying to deploy a jetton. What data should I pass to the "cell"?

Sa: could you share your contract source code (reply to 22243)

encs: Any idea what should I pass to cell?

Sonny: I'm starting to write, when I finish I will DM you (reply to 22250)

Daniil: createOffchainContent("https://link_to_metadata.json") (reply to 22252)

Sa: Ah. Sorry. I thought you already finished it. (reply to 22253)

encs: Understood

encs: Thanks (reply to 22254)

Sonny: Have you completed any projects yet? (reply to 22255)

Yakitori: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md (reply to 22252)

Yakitori: It's the metadata

encs: Love you

Sonny: Pass Cell  is normally info metadata for contract master (reply to 22252)

Sa: I’m learning (reply to 22258)

Nerses: hi everone. I have deployed smart contract with ide Nujan but only 2 functions of 3 appeared in methods panel.

Nerses: here is my code

Nerses: struct HTLC {         hashlock: Int as int256;         secret: Int as int256;         amount: Int as int256;         timelock: Int as uint256;         sender: Address;         _receiver: Address;         redeemed: Bool;         refunded: Bool;     }      message TonTransferInitiated {        __hashlock: Int as int256;        __amount: Int as int256;        __chainId: Int as int256;        __timelock: Int as int256;        __sender: Address;        __receiver: Address;        __targetCurrencyReceiverAddress: String;      }      message TonTransferClaimed {         __hashlock: Int as int256;         __receiver: Address;         __amount: Int as int256;     }      message TonTransferRefunded {         __hashlock: Int as int256;         __receiver: Address;         __amount: Int as int256;     }   contract HashedTimeLockTON with Deployable {     init() {              }      contracts: map<Int as int256, HTLC> ;      fun contractExists(hashlock: Int): Bool {         if(self.contracts.get(hashlock) != null){             return true;         }         return false;     }        fun create(_Receiver: Address, _hashlock: Int, _timelock: Int, _chainId: Int,_targetCurrencyReceiverAddress: String , _amount: Int): Int {         require(now() <= _timelock,"Not Future Timelock");         require(_amount != 0,"Funds Not Sent");          require(false == self.contractExists(_hashlock),"Contract Already Exists");                                                                          let htlc: HTLC = HTLC { hashlock: _hashlock,                                 amount: _amount,                                 secret: 0x0,                                 timelock: _timelock,                                 sender: sender(),                                 _receiver: _Receiver,                                 redeemed: false,                                 refunded: false};          self.contracts.set(_hashlock,htlc);          emit(TonTransferInitiated{                         __hashlock: _hashlock,                         __amount: _amount,                         __chainId: _chainId,                         __timelock: _timelock,                         __sender: sender(),                         __receiver: _Receiver,                         __targetCurrencyReceiverAddress: _targetCurrencyReceiverAddress                         }.toCell());          return _hashlock;     }       fun redeem(hashlock: Int, _secret: Int): Bool{             let pre: Int = sha256(_secret.toString());             let hashlockFromSecret: Int = sha256(pre.toString());                       require((self.contracts.get(hashlock)!!).hashlock == hashlockFromSecret,"Hashlock Not Match");             require((self.contracts.get(hashlock)!!).refunded == false,"Already Refunded");             require((self.contracts.get(hashlock)!!).redeemed == false,"Already Redeemed");             require((self.contracts.get(hashlock)!!).timelock <= now(),"Not Future Timelock");              let htlc: HTLC =  HTLC {                             hashlock: (self.contracts.get(hashlock)!!).hashlock,                             secret: _secret,                             amount: (self.contracts.get(hashlock)!!).amount,                             timelock: (self.contracts.get(hashlock)!!).timelock,                             sender: (self.contracts.get(hashlock)!!).sender,                             _receiver: (self.contracts.get(hashlock)!!)._receiver,                             redeemed: true,                             refunded: false             };                          self.contracts.set(hashlock,htlc);              emit(TonTransferClaimed{__hashlock: hashlock, __receiver: htlc._receiver, __amount: htlc.amount}.toCell());             return true;         }             fun refund(hashlock: Int): Bool {          if(self.contractExists(hashlock)){             let htlc: HTLC = self.contracts.get(hashlock)!!;              require(htlc.ref

encs: any idea how to generate the content: Cell for the jetton? (reply to 22262)

encs: init(content: Cell) {         self.owner = sender(); // we can initialize owner to any value we want, the deployer in this case         self.totalSupply = 0;         self.max_supply = 100000000;         self.mintable = true;         self.content = content;         self.mint(self.owner, self.max_supply, self.owner);     }

encs: cannot really find the way it should be

encs: can you give me a hand? (reply to 22254)

encs: i want to pass that info on-chain, is that possible?

Daniil: it is, but there's no function for that in stdlib, so you'll have to do it manually by composing a dictionary with metadata (reply to 22281)

encs: ooh

encs: @Gusarich another question, how can I use the receive() function to receive a specific JETTON, i have a list of jettons I want to accept, how can I check that? thanks

Ken: you check the jetton wallet address (reply to 22287)

encs: Understood

encs: Thanks

Alex: Attention TON Developers 🤑  The TON Dev Community calls on your expertise to contribute to advancing the TON ecosystem. Your insights and experiences in development are invaluable in making TON more robust and user-friendly.  We encourage every community member to share their experiences with TON development by participating in our survey.  The survey encompasses four key topics and will take approximately 5-8 minutes of your time.  👉 https://nletwfvh.paperform.co (forwarded from TON Contests)

