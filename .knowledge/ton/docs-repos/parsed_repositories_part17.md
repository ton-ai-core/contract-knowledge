# GitHub Docs Parser - Part 17

[jetton-addr-online]: https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-jetton-wallet-addresses-for-a-given-user
[jetton-addr-offline]: https://docs.ton.org/v3/guidelines/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offline
[discoverable-jetton-wallets]: https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
[fees-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/index.mdx
================================================
---
title: Cookbook 概述
description: 制作 Tact Cookbook 的主要目的是将 Tact 开发人员的所有经验汇集到一个地方，以便未来的开发人员可以使用。 这部分文档更侧重于每个 Tact 开发人员在开发智能合约过程中需要解决的日常任务。
---

import { LinkCard, Card, CardGrid, Steps } from '@astrojs/starlight/components';

制作 Tact Cookbook 的主要目的是将 Tact 开发人员的所有经验汇集到一个地方，以便未来的开发人员可以使用。 这部分文档更侧重于每个 Tact 开发人员在开发智能合约过程中需要解决的日常任务。

将其作为在 TON 区块链上制作令人愉悦的智能合约的食谱，而无需在此过程中重新发明轮子。

<Steps>

1. #### 单一合约 {#single-contract}

   以下页面以单个合约实例为重点，涵盖了广泛的主题：

   <CardGrid>
     <LinkCard
       title="1️⃣ 单合约通信"
       href="/zh-cn/cookbook/single-communication"
     />
     <LinkCard
       title="⚙️ 类型转换"
       href="/zh-cn/cookbook/type-conversion"
     />
     <LinkCard
       title="📦 数据结构"
       href="/zh-cn/cookbook/data-structures"
     />
     <LinkCard
       title="🤖 算法"
       href="/zh-cn/cookbook/algo"
     />
     <LinkCard
       title="📆 时间和日期"
       href="/zh-cn/cookbook/time"
     />
     <LinkCard
       title="⚠️ 访问控制"
       href="/zh-cn/cookbook/access"
     />
     <LinkCard
       title="✨ 随机数"
       href="/zh-cn/cookbook/random"
     />
     <LinkCard
       title="🤔 其他"
       href="/zh-cn/cookbook/misc"
     />
   </CardGrid>

2. #### 多重合约 {#multiple-contracts}

   下文将重点介绍多合约示例，探讨 TON 区块链的可扩展性：

   <CardGrid>
     <LinkCard
       title="🧮 多合约通信"
       href="/zh-cn/cookbook/multi-communication"
     />
     <LinkCard
       title="💎 可替代代币 (Jettons)"
       href="/zh-cn/cookbook/jettons"
     />
     <LinkCard
       title="🖼️ 非可替代代币 (NFTs)"
       href="/zh-cn/cookbook/nfts"
     />
   </CardGrid>

   此外，还有与流行的 TON DEX（去中心化交易所）合作的例子，这些交易所通常需要许多合约和复杂的逻辑：

   <CardGrid>
     <LinkCard
       title="DeDust.io"
       href="/zh-cn/cookbook/dexes/dedust"
     />
     <LinkCard
       title="STON.fi"
       href="/zh-cn/cookbook/dexes/stonfi"
     />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/jettons.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/jettons.mdx
================================================
---
title: 同质化代币（Jettons）
description: 在Tact中处理同质化代币（Jettons）的常见示例
---

本页列出了使用 [jettons](https://docs.ton.org/develop/dapps/asset-processing/jettons) 的常见示例。

Jettons 是TON区块链上的代币标准，旨在创建同质化代币（类似于以太坊上的ERC-20），并采用去中心化的方式。 它们以一对智能合约的形式实现，通常由两个核心组件组成：

- Jetton Master Contracting (Jetton master)
- Jetton Wallet Contract (Jetton wallet)

这些合同相互影响，以管理代币供应、分配、转让以及与捷通相关的其他操作。

## Jetton Master Contract

Jetton 主合同是特定 Jetton 的中心实体。 它保留了有关Jetton本身的重要信息。 Jetton 主合同中存储的主要责任和数据包括：

- Jetton元数据：诸如代币名称、符号、总供应量和小数点等信息。

- 铸造和销毁：当新的Jettons被铸造（创建）时，Jetton主合约管理创建过程并将其分发到相应的钱包。 它还能根据需要管理代币的燃烧（销毁）。

- 供应管理：Jetton Master 跟踪 Jettons 的总供应量，并确保对所有已发放的 Jettons 进行适当核算。

## Jetton Wallet 合约

Jetton Wallet 合约是个人持有者的代币钱包，负责管理特定用户的余额和与代币相关的操作。 每个持有Jettons的用户或实体将拥有自己独特的Jetton钱包合约。 Jetton Wallet 合约的主要特点包括：

- 余额跟踪：钱包合约存储用户的代币余额。

- 代币转账：钱包负责处理用户之间的代币转账。 当用户发送Jetton时，Jetton Wallet 合约确保与收件人的钱包进行适当的转移和沟通。 Jetton Master 不参与这项活动，也不会造成瓶颈。 钱包可充分利用 TON 的分片功能

- 代币销毁：Jetton钱包与Jetton Master交互以销毁代币。

- 所有者控制：钱包合约由特定用户拥有和控制 表示只有钱包的所有者可以启动转账或其他代币操作。

## 示例：

处理Jettons的常见示例。

### 接受 jetton 转移 {#accepting-jetton-transfer}

转账通知信息的结构如下

```tact
message(0x7362d09c) JettonTransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}
```

使用 [receiver](/zh-cn/book/receive) 功能接受代币通知信息。

:::caution

  必须验证转账通知的发送方！

:::

必须验证传输通知的发件人，因为恶意行为者可能试图从未经授权的账户中伪造通知。
如果不进行这种确认，合约可接受未经授权的交易，从而造成潜在的安全脆弱性。

使用合约中的 Jetton 地址进行验证：

1. 发送者向其 Jetton 钱包发送以 `0xf8a7ea5` 作为 32 位标题（操作码）的信息。
2. Jetton钱包将资金转到合约的Jetton钱包。
3. 在成功的转账接受后，合约的Jetton钱包将转账通知给他的所有者合约。
4. 合约验证Jetton信息。

你可以使用 [`contractAddress(){:tact}`](/zh-cn/ref/core-common#contractaddress) 函数获取合约的 Jetton 钱包，或链下计算此地址。

要获取 Jetton 钱包的初始状态，您需要钱包的数据和代码。 虽然初始数据布局有一个共同的结构，但在某些情况下可能不同，如 [USDT](#usdt-jetton-operations)。

由于通知源自您的合约的 Jetton 钱包，函数[`myAddress(){:tact}`](/zh-cn/ref/core-contextstate#myaddress) 应在 \`owners' 字段中使用。

:::caution

  通知并不总能保证发送。 默认情况下，如果 `forwardAmount` 设置为零，执行不会发送通知。 因此，在这种情况下，不能依靠发送通知。

:::

```tact
struct JettonWalletData {
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell
): Address {

    let initData = JettonWalletData{
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
        jettonWalletCode,
    };

    return contractAddress(StateInit{
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}

message(0x7362d09c) JettonTransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

contract Example {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    receive() { cashback(sender()) } // for the deployment

    receive(msg: JettonTransferNotification) {
        require(
            sender() == self.myJettonWalletAddress,
            "Notification not from your jetton wallet!",
        );

        self.myJettonAmount += msg.amount;

        // Forward excesses
        self.forward(msg.sender, null, false, null);
    }
}
```

### 发送Jetton转账

Jetton 转账是将指定数量的 Jetton 从一个钱包（合约）发送到另一个钱包的过程。

若要发送Jetton转账，请使用 [`send(){:tact}`](/zh-cn/book/send) 函数。

```tact
message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

const JettonTransferGas: Int = ton("0.05");

struct JettonWalletData {
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell,
): Address {

    let initData = JettonWalletData{
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
        jettonWalletCode,
    };

    return contractAddress(StateInit{
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}

message Withdraw {
    amount: Int as coins;
}

contract Example {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    receive() { cashback(sender()) } // for the deployment

    receive(msg: Withdraw) {
        require(
            msg.amount <= self.myJettonAmount,
            "Not enough funds to withdraw"
        );

        send(SendParameters {
            to: self.myJettonWalletAddress,
            value: JettonTransferGas,
            body: JettonTransfer{
                // To prevent replay attacks
                queryId: 42,
                // Jetton amount to transfer
                amount: msg.amount,
                // Where to transfer Jettons:
                // this is an address of the Jetton wallet
                // owner and not the Jetton wallet itself
                destination: sender(),
                // Where to send a confirmation notice of a successful transfer
                // and the rest of the incoming message value
                responseDestination: sender(),
                // Can be used for custom logic of Jettons themselves,
                // and without such can be set to null
                customPayload: null,
                // Amount to transfer with JettonTransferNotification,
                // which is needed for the execution of custom logic
                forwardTonAmount: 1, // if its 0, the notification won't be sent!
                // Compile-time way of expressing:
                //     beginCell().storeUint(0xF, 4).endCell().beginParse()
                // For more complicated transfers, adjust accordingly
                forwardPayload: rawSlice("F")
            }.toCell(),
        });
    }
}
```

### 销毁 jetton {#burning-jetton}

Jetton 销毁是将指定数量的 Jetton 永久移出流通的过程，无法恢复。

```tact
message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address?;
    customPayload: Cell? = null;
}

const JettonBurnGas: Int = ton("0.05");

struct JettonWalletData {
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell,
): Address {

    let initData = JettonWalletData{
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
        jettonWalletCode,
    };

    return contractAddress(StateInit{
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}

message ThrowAway {
    amount: Int as coins;
}

contract Example {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    receive() { cashback(sender()) } // for the deployment

    receive(msg: ThrowAway) {
        require(
            msg.amount <= self.myJettonAmount,
            "Not enough funds to throw away",
        );

        send(SendParameters {
            to: self.myJettonWalletAddress,
            value: JettonBurnGas,
            body: JettonBurn{
                // To prevent replay attacks
                queryId: 42,
                // Jetton amount you want to burn
                amount: msg.amount,
                // Where to send a confirmation notice of a successful burn
                // and the rest of the incoming message value
                responseDestination: sender(),
                // Can be used for custom logic of Jettons themselves,
                // and without such can be set to null
                customPayload: null,
            }.toCell(),
        });
    }
}
```

### USDT jetton 业务 {#usdt-jetton-operations}

除了 `JettonWalletData` 将采用以下结构外，USDT（在 TON 上）的操作保持不变：

```tact
struct JettonWalletData {
    status: Int as uint4;
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
}

// And the function to calculate the wallet address may look like this:
fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell
): Address {

    let initData = JettonWalletData{
        status: 0,
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
    };

    return contractAddress(StateInit{
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}
```

:::tip[Hey there!]

没有找到您最喜欢的 jetton 使用范例？  您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/misc.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/misc.mdx
================================================
---
title: 杂项
description: 各种尚未有专门页面但仍然有用且有趣的示例。
---

各种尚未有专门页面但仍然有用且有趣的示例。

## 如何抛出错误

当我们不知道要多久执行一次特定操作时，合约中的 `throw(){:tact}` 函数就非常有用。

它允许有意的异常或错误处理，从而导致当前事务的终止，并恢复该事务中的任何状态更改。

```tact
let number: Int = 198;

// the error will be triggered anyway
try { throw(36); } catch (exitCode) {}

// the error will be triggered only if the number is greater than 50
try { throwIf(35, number > 50); } catch (exitCode) {}

// the error will be triggered only if the number is NOT EQUAL to 198
try { throwUnless(39, number == 198); } catch (exitCode) {}
```

:::note[Useful links:]

  [核心库中的 `throw(){:tact}`](/zh-cn/ref/core-debug#throw)/
  [Tact-By-Example中的错误](https://tact-by-example.org/03-errors)

:::

:::tip[Hey there!]

  没有找到您最喜欢的利基工作范例？ 您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/multi-communication.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/multi-communication.mdx
================================================
---
title: 多合约通信
description: 区块链上许多已部署合约之间通信的常见例子
prev:
  link: /zh-cn/cookbook/misc
  label: 其他事项
---

:::danger[Not implemented]

  这页是一个存根页面。 本页为残页。 [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/nfts.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/nfts.mdx
================================================
---
title: 非同质化代币 (NFT)
description: 在Tact中处理非同质化代币 (NFT) 的常见示例
---

此页列出了与 [NFTs]交互的常见例子(https://docs.ton.org/develop/dapps/asset-processing/nfts)。

## 接受 NFT 所有权分配 {#accepting-nft-ownership-assignment}

指派的 NFT 所有权的通知信息具有以下结构：

```tact
message(0x05138d91) NFTOwnershipAssigned {
    previousOwner: Address;
    forwardPayload: Slice as remaining;
}
```

使用 [receiver](/zh-cn/book/receive) 函数来接受通知消息。

:::caution

  必须验证通知发件人！

:::

验证可以通过两种方式进行：

1. 直接保存 NFT 项目地址并进行验证。

```tact
message(0x05138d91) NFTOwnershipAssigned {
    previousOwner: Address;
    forwardPayload: Slice as remaining;
}

contract SingleNft {
    nftItemAddress: Address;

    init(nftItemAddress: Address) {
        self.nftItemAddress = nftItemAddress;
    }

    receive() { cashback(sender()) } // for the deployment

    receive(msg: NFTOwnershipAssigned) {
        require(self.nftItemAddress == sender(), "NFT contract is not the sender");

        // your logic of processing nft ownership assign notification
    }
}
```

2. 使用 [`StateInit{:tact}`](/zh-cn/book/expressions#initof) 和派生的 NFT 项目地址。

```tact
message(0x05138d91) NFTOwnershipAssigned {
    previousOwner: Address;
    forwardPayload: Slice as remaining;
}

struct NFTItemInitData {
    index: Int as uint64;
    collectionAddress: Address;
}

inline fun calculateNFTAddress(index: Int, collectionAddress: Address, nftCode: Cell): Address {
    let initData = NFTItemInitData{
        index,
        collectionAddress,
    };

    return contractAddress(StateInit{code: nftCode, data: initData.toCell()});
}

contract NftInCollection {
    nftCollectionAddress: Address;
    nftItemIndex: Int as uint64;
    nftCode: Cell;

    init(nftCollectionAddress: Address, nftItemIndex: Int, nftCode: Cell) {
        self.nftCollectionAddress = nftCollectionAddress;
        self.nftItemIndex = nftItemIndex;
        self.nftCode = nftCode;
    }

    receive() { cashback(sender()) } // for the deployment

    receive(msg: NFTOwnershipAssigned) {
        let expectedNftAddress = calculateNFTAddress(self.nftItemIndex, self.nftCollectionAddress, self.nftCode); // or you can even store expectedNftAddress
        require(expectedNftAddress == sender(), "NFT contract is not the sender");

        // your logic of processing nft ownership assign notification
    }
}
```

由于NFT项目的初始数据布局可能各不相同，第一种方法往往更合适。

## 转移 NFT 项目

要发送 NFT 项目转移，请使用 [`send(){:tact}`](/zh-cn/book/send)函数。

```tact
import "@stdlib/deploy";

message(0x5fcc3d14) NFTTransfer {
    queryId: Int as uint64;
    newOwner: Address; // address of the new owner of the NFT item.
    responseDestination: Address; // address where to send a response with confirmation of a successful transfer and the rest of the incoming message coins.
    customPayload: Cell? = null; //  optional custom data. In most cases should be null
    forwardAmount: Int as coins; // the amount of nanotons to be sent to the new owner.
    forwardPayload: Slice as remaining; // optional custom data that should be sent to the new owner.
}

contract Example {
    nftItemAddress: Address;

    init(nftItemAddress: Address) {
        self.nftItemAddress = nftItemAddress;
    }

    // ... add more code from previous examples ...

    receive("transfer") {
        send(SendParameters {
            to: self.nftItemAddress,
            value: ton("0.1"),
            body: NFTTransfer{
                queryId: 42,
                // FIXME: Change this according to your needs
                newOwner: sender(),
                responseDestination: myAddress(),
                customPayload: null,
                forwardAmount: 1,
                forwardPayload: rawSlice("F"), // precomputed beginCell().storeUint(0xF, 4).endCell().beginParse()
            }.toCell(),
        });
    }
}
```

## 获取 NFT 静态信息

请注意，TON Blockchain 不允许合约相互调用 [getters](https://docs.tact-lang.org/book/contracts#getter-functions)。
要从另一个合约接收数据，您必须交换消息。

```tact
message(0x2fcb26a2) NFTGetStaticData {
    queryId: Int as uint64;
}

message(0x8b771735) NFTReportStaticData {
    queryId: Int as uint64;
    index: Int as uint256;
    collection: Address;
}

struct NFTItemInitData {
    index: Int as uint64;
    collectionAddress: Address;
}

inline fun calculateNFTAddress(index: Int, collectionAddress: Address, nftCode: Cell): Address {
    let initData = NFTItemInitData{
        index,
        collectionAddress,
    };

    return contractAddress(StateInit{code: nftCode, data: initData.toCell()});
}

contract Example {
    nftCollectionAddress: Address;
    nftItemIndex: Int as uint64;
    nftCode: Cell;

    init(nftCollectionAddress: Address, nftItemIndex: Int, nftCode: Cell) {
        self.nftCollectionAddress = nftCollectionAddress;
        self.nftItemIndex = nftItemIndex;
        self.nftCode = nftCode;
    }

    // ... add more code from previous examples ...

    receive("get static data") {
        // FIXME: Put proper address("[NFT_ADDRESS]") here
        let nftAddress = sender();
        send(SendParameters {
            to: nftAddress,
            value: ton("0.1"),
            body: NFTGetStaticData{
                queryId: 42,
            }.toCell(),
        });
    }

    receive(msg: NFTReportStaticData) {
        let expectedNftAddress = calculateNFTAddress(msg.index, msg.collection, self.nftCode);
        require(expectedNftAddress == sender(), "NFT contract is not the sender");

        // Save nft static data or do something
    }
}
```

## 获取 NFT 版税参数

此处](https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md)介绍了 NFT 版税参数。

```tact
message(0x693d3950) NFTGetRoyaltyParams {
    queryId: Int as uint64;
}

message(0xa8cb00ad) NFTReportRoyaltyParams {
    queryId: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

contract Example {
    nftCollectionAddress: Address;

    init(nftCollectionAddress: Address) {
        self.nftCollectionAddress = nftCollectionAddress;
    }

    // ... add more code from previous examples ...

    receive("get royalty params") {
        send(SendParameters {
            to: self.nftCollectionAddress,
            value: ton("0.1"),
            body: NFTGetRoyaltyParams{
                queryId: 42,
            }.toCell(),
        });
    }

    receive(msg: NFTReportRoyaltyParams) {
        require(self.nftCollectionAddress == sender(), "NFT collection contract is not the sender");

        // Do something with msg
    }
}
```

## NFT 集合方法

:::caution

  这些方法不是任何标准的一部分，它们只能与 [此特定实现](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection.fc) 一起工作。 请在使用之前记住这一点。

:::

请注意，只有NFT所有者才能使用这些方法。

### 部署 NFT

```tact
message(0x1) NFTDeploy {
    queryId: Int as uint64;
    itemIndex: Int as uint64;
    amount: Int as coins; // amount to sent when deploying nft
    nftContent: Cell;
}

contract Example {
    nftCollectionAddress: Address;

    init(nftCollectionAddress: Address) {
        self.nftCollectionAddress = nftCollectionAddress;
    }

    // ... add more code from previous examples ...

    receive("deploy") {
        send(SendParameters {
            to: self.nftCollectionAddress,
            value: ton("0.14"),
            body: NFTDeploy{
                queryId: 42,
                itemIndex: 42,
                amount: ton("0.1"),
                nftContent: beginCell().endCell() // FIXME: Should be your content, mostly generated offchain
            }.toCell(),
        });
    }
}
```

### 更改所有者

```tact
message(0x3) NFTChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}

contract Example {
    nftCollectionAddress: Address;

    init(nftCollectionAddress: Address) {
        self.nftCollectionAddress = nftCollectionAddress;
    }

    // ... add more code from previous examples ...

    receive("change owner") {
        send(SendParameters {
            to: self.nftCollectionAddress,
            value: ton("0.05"),
            body: NFTChangeOwner{
                queryId: 42,
                // FIXME: Put proper address("NEW_OWNER_ADDRESS") here
                newOwner: sender(),
            }.toCell(),
        });
    }
}
```

:::tip[Hey there!]

  没有找到您最喜欢的 NFT 操作的例子？ 您有很酷的实施方案吗？ 本页为残页。 [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/random.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/random.mdx
================================================
---
title: 随机性
description: 使用随机数字、不确定性和一般随机性的常见例子
---

本页列出了使用随机数、不确定性和随机性的示例。

## 如何生成随机数

```tact
// Declare a variable to store the random number
let number: Int = 0;

// Generate a new random number, which is an unsigned 256-bit integer
number = randomInt();

// Generate a random number between 1 and 12
number = random(1, 12);
```

:::note[Useful links:]

  [`randomInt(){:tact}` in Core library](/zh-cn/ref/core-random#randomint)\
  [`random(){:tact}` in Core library](/zh-cn/ref/core-random#random)

:::

:::tip[Hey there!]

  没有找到你最喜欢的使用随机性的例子？  您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/single-communication.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/single-communication.mdx
================================================
---
title: 单项合约通信
description: 常见的单个已部署合约与区块链上其他合约通信的示例：
prev:
  link: /zh-cn/cookbook
  label: Cookbook 概述
---

本页列出了单个已部署合约与区块链上其他合约进行通信的示例。

有关多个已部署合约之间的通信示例，请参阅：[多合约通信](/zh-cn/cookbook/multi-communication)。

## 如何进行基本回复 {#how-to-make-a-basic-reply}

```tact
contract Example {
    receive() {
        self.reply("Hello, World!".asComment()); // asComment converts a String to a Cell with a comment
    }
}
```

## 如何发送简单信息

```tact
contract Example {
    receive() {
        send(SendParameters {
            bounce: true, // default
            to: sender(), // or another destination address
            value: ton("0.01"), // attached amount of Tons to send
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

## 如何发送包含全部余额的信息

如果我们需要发送智能合约的全部余额，则应使用 `SendRemainingBalance{:tact}` 发送模式。  或者，我们也可以使用 `mode：128{:tact}`，其含义相同。

```tact
contract Example {
    receive() {
        send(SendParameters {
            // bounce = true by default
            to: sender(), // send the message back to the original sender
            value: 0,
            mode: SendRemainingBalance, // or mode: 128
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

## 如何发送带有余值的信息

如果我们要向同一发件人发送回复，可以使用 `SendRemainingValue{:tact}`模式（即 `mode: 64{:tact}`），除了新信息中最初显示的值外，它还会携带入站信息的所有剩余值。

```tact
contract Example {
    receive() {
        send(SendParameters {
            // bounce = true by default
            to: sender(), // send the message back to the original sender
            value: 0,
            mode: SendRemainingValue,
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

通常还需要添加 `SendIgnoreErrors{:tact}`标记，以便忽略在操作阶段处理该消息时出现的任何错误

```tact
contract Example {
    receive() {
        send(SendParameters {
            // bounce = true by default
            to: sender(), // send the message back to the original sender
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors, // prefer using | over + for the mode
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

后一个示例与使用 [`self.reply(){:tact}` 函数](#how-to-make-a-basic-reply)相同。

## 如何发送带有长文本注释的信息

如果我们需要发送一条带有冗长文本注释的信息，我们应该创建一个 [`String{:tact}`](/zh-cn/book/types#primitive-types)，由超过 $127$ 个字符组成。 如果我们需要发送一条带有冗长文本注释的信息，我们应该创建一个 [`String{:tact}`](/zh-cn/book/types#primitive-types)，由超过 $127$ 个字符组成。 为此，我们可以利用 [`StringBuilder{:tact}`](/zh-cn/book/types#primitive-types)原始类型及其名为 `beginComment(){:tact}` 和 `append(){:tact}` 的方法。 在发送之前，我们应该使用 `toCell(){:tact}` 方法将字符串转换为cell。 在发送之前，我们应该使用 `toCell(){:tact}` 方法将字符串转换为cell。

```tact
contract Example {
    receive() {
        let comment: StringBuilder = beginComment();
        let longString = "..."; // Some string with more than 127 characters.
        comment.append(longString);

        send(SendParameters {
            // bounce = true by default
            to: sender(),
            value: 0,
            mode: SendIgnoreErrors,
            body: comment.toCell(),
        });
    }
}
```

:::note[Useful links:]

  ["Sending messages" in the Book](/zh-cn/book/send#send-message)\
  ["Message `mode`" in the Book](/zh-cn/book/message-mode)\
  [`StringBuilder{:tact}` in the Book](/zh-cn/book/types#primitive-types)\
  [`Cell{:tact}` in Core library](/zh-cn/ref/core-cells)

:::

:::tip[Hey there!]

  没有找到您最喜欢的单一合约通信案例？  您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/time.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/time.mdx
================================================
---
title: 时间和日期
description: 与时间和日期一起工作的常见例子
---

## 如何获取当前时间

使用 `now(){:tact}` 方法获取当前标准[Unix 时间](https://en.wikipedia.org/wiki/Unix_time)。

如果需要在状态中存储时间或在信息中编码时间，请使用下面的 [serialization](/zh-cn/book/integers#serialization)：`Int as uint32{:tact}`。

```tact
let currentTime: Int = now();

if (currentTime > 1672080143) {
    // do something
}
```

:::note[Useful links:]

  [核心库中的 `now(){:tact}`](/zh-cn/ref/core-common#now)/
  [Tact-By-Example中的 "当前时间"](https://tact-by-example.org/04-current-time)

:::

:::tip[Hey there!]

  没有找到您最喜欢的使用时间和日期的例子？  您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/type-conversion.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/type-conversion.mdx
================================================
---
title: 类型转换
description: 常见的在基本类型之间转换并从复合类型中获取它们的示例
---

本页展示了在[原始类型][p]之间进行转换以及从[复合类型](/zh-cn/book/types#composite-types)中获取这些类型的示例。

## `Int` ↔ `String` {#int-string}

### 如何将 `String` 转换为 `Int` {#how-to-convert-a-string-to-an-int}

```tact
// Defining a new extension function for type String that returns value of type Int
// Caution: produces unexpected results when String contains non-numeric characters!
extends fun toInt(self: String): Int {
    // Cast the String as a Slice for parsing
    let string: Slice = self.asSlice();

    // A variable to store the accumulated number
    let acc: Int = 0;

    // Loop until the String is empty
    while (!string.empty()) {
        let char: Int = string.loadUint(8); // load 8 bits (1 byte) from the Slice
        acc = (acc * 10) + (char - 48);     // using ASCII table to get numeric value
        // Note, that this approach would produce unexpected results
        //   when the starting String contains non-numeric characters!
    }

    // Produce the resulting number
    return acc;
}

fun runMe() {
    let string: String = "26052021";
    dump(string.toInt());
}
```

### 如何将 `Int` 转换为 `String` 字符

```tact
let number: Int = 261119911;

// Converting the [number] to a String
let numberString: String = number.toString();

// Converting the [number] to a float String,
//   where passed argument 3 is the exponent of 10^(-3) of resulting float String,
//   and it can be any integer between 0 and 76 including both ends
let floatString: String = number.toFloatString(3);

// Converting the [number] as coins to a human-readable String
let coinsString: String = number.toCoinsString();

dump(numberString); // "261119911"
dump(floatString);  // "261119.911"
dump(coinsString);  // "0.261119911"
```

:::note[Useful links:]

  [`Int.toString(){:tact}` 在核心库中](/zh-cn/ref/core-strings#inttostring)/
  [`Int.toFloatString(){:tact}` 在核心库中](/zh-cn/ref/core-strings#inttofloatstring)/
  [`Int.toCoinsString(){:tact}` 在核心库中](/zh-cn/ref/core-strings#inttocoinsstring)

:::

## `Struct` 或 `Message` ↔ `Cell` 或 `Slice` {#structmessage-cellslice}

### 如何将任意的 `Struct` 或 `Message` 转换成一个 `Cell` 或 `Slice`

```tact {19-20, 22-23}
struct Profit {
    big: String?;
    dict: map<Int, Int as uint64>;
    energy: Int;
}

message(0x45) Nice {
    maybeStr: String?;
}

fun convert() {
    let st = Profit{
        big: null,
        dict: null,
        energy: 42,
    };
    let msg = Nice{ maybeStr: "Message of the day!" };

    st.toCell();
    msg.toCell();

    st.toCell().asSlice();
    msg.toCell().asSlice();
}
```

:::note[Useful links:]

  [`Struct.toCell(){:tact}` 在核心库中](/zh-cn/ref/core-cells#structtocell)/
  [`Message.toCell(){:tact}` 在核心库中](/zh-cn/ref/core-cells#messagetocell)

:::

### 如何将 `Cell` 或 `Slice` 转换为任意的 `Struct` 或 `Message`

```tact {19-20, 22-23}
struct Profit {
    big: String?;
    dict: map<Int, Int as uint64>;
    energy: Int;
}

message(0x45) Nice {
    maybeStr: String?;
}

fun convert() {
    let stCell = Profit{
        big: null,
        dict: null,
        energy: 42,
    }.toCell();
    let msgCell = Nice{ maybeStr: "Message of the day!" }.toCell();

    Profit.fromCell(stCell);
    Nice.fromCell(msgCell);

    Profit.fromSlice(stCell.asSlice());
    Nice.fromSlice(msgCell.asSlice());
}
```

:::note[Useful links:]

  [`Struct.fromCell(){:tact}` in Core library](/zh-cn/ref/core-cells#structfromcell)\
  [`Struct.fromSlice(){:tact}` in Core library](/zh-cn/ref/core-cells#structfromslice)\
  [`Message.fromCell(){:tact}` in Core library](/zh-cn/ref/core-cells#messagefromcell)\
  [`Message.fromSlice(){:tact}` in Core library](/zh-cn/ref/core-cells#messagefromslice)

:::

:::tip[Hey there!]

  没有找到您最喜欢的类型转换示例？  您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::

[p]: /zh-cn/book/types#primitive-types



================================================
FILE: docs/src/content/docs/zh-cn/ecosystem/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ecosystem/index.mdx
================================================
---
title: 生态系统概述
description: 生态系统部分 — Tac生态系统的鸟眼概览、 工具和您可以开始贡献的方式
---

import { CardGrid, LinkCard, Steps } from '@astrojs/starlight/components';

欢迎来到**生态系统**版块--鸟瞰 Tact 生态系统、工具以及您可以开始为之做出贡献的方法！

以下是其主要内容：

<Steps>

1. #### 工具

   工具是官方和社区专门为 Tact 制作的工具列表，或与 Tact 语言和其他工具配合使用的工具列表。  每个工具都有简要的使用细节和附加信息，这些信息有时在相应的文档中缺失，或者仅在Tact文档中提供方便的摘要。

   <CardGrid>
    <LinkCard
      title="TypeScript"
      href="/zh-cn/ecosystem/typescript"
    />
    <LinkCard
      title="VS Code Extension"
      href="/zh-cn/ecosystem/vscode"
    />
    <LinkCard
      title="JetBrains IDEs Plugin"
      href="/zh-cn/ecosystem/jetbrains"
    />
    <LinkCard
      title="Misti Static Analyzer"
      href="/zh-cn/ecosystem/misti"
    />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/zh-cn/ecosystem/jetbrains.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ecosystem/jetbrains.mdx
================================================
---
title: 用于 JetBrains  IDEs的 TON 开发插件
description: 支持在JetBrains IDE（2023及更高版本）中突出显示Tact语法，并提供对TON区块链的FunC和Fift语言的丰富支持，以及TL-B架构的支持。
---

支持在 **2023.** 及更高版本的 JetBrains  IDEs中突出显示 Tact 的语法。 请注意，除了对 Tact 的支持，它还包括对 TON 区块链的 FunC 和 Fift 语言以及 TL-B 模式的丰富支持。

JetBrains Marketplace 上的插件： [TON 开发插件](https://plugins.jetbrains.com/plugin/23382-ton)

## 安装手册

1. 打开 JetBrains IDE（IntelliJ IDEA、PyCharm、WebStorm 等）。
2. 通过选择 `File > Settings/Preferences > Plugins` 导航到 **插件市场**。
3. 在插件市场的搜索栏中输入 "TON Development"。 You will see a dropdown with the extension provided by `ton-blockchain`. 您将看到一个下拉菜单，其中包含由 `TON Foundation` 提供的扩展名。
4. 点击插件名称旁边的 **Install** 按钮。 等待安装完成。
5. 插件安装完成后，系统会提示您重新启动 JetBrains IDE。 单击 ** 重新启动** 按钮应用更改。 单击 ** 重新启动** 按钮应用更改。
6. 重新启动后，TON 开发插件应已成功安装到 JetBrains IDE 中。

## 故障排除

如果在安装过程中遇到问题，请查阅 [插件的 GitHub 代码库](https://github.com/ton-blockchain/intellij-ton) 以获取解决方案和更多信息。

## 参考资料和资源

- [Plugin on GitHub](https://github.com/ton-blockchain/intellij-ton)
- [Plugin on the JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23382-ton)



================================================
FILE: docs/src/content/docs/zh-cn/ecosystem/misti.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ecosystem/misti.mdx
================================================
---
title: Misti 静态分析器
description: 静态分析测验合约、自定义探测器和CI/CD 集成
---

[Misti](https://nowarp.io/tools/misti/)是一款支持 Tact 的静态程序分析工具。

## 什么是Misti？

- **静态程序分析**：Misti 在不执行代码的情况下对代码进行分析，通过检查结构和语法来扫描[漏洞和安全缺陷](https://nowarp.io/tools/misti/docs/detectors)。  这种方法可以及早发现问题，防止问题影响生产。

- **自定义探测器**：创建 [自定义探测器](https://nowarp.io/tools/misti/docs/hacking/custom-detector)，根据您的特定需求定制 Misti。 这有助于识别通用工具可能会遗漏的漏洞，确保对代码进行彻底审查。

- **CI/CD 集成**：[集成](https://nowarp.io/tools/misti/docs/tutorial/ci-cd) Misti 到您的 CI/CD 管道中，以确保持续的代码质量检查，在问题进入生产之前将其捕获。

## 资源

- [Github](https://github.com/nowarp/misti)
- [Telegram Community](https://t.me/misti_dev)
- [Misti文档](https://nowarp.io/tools/misti/)



================================================
FILE: docs/src/content/docs/zh-cn/ecosystem/typescript.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ecosystem/typescript.mdx
================================================
---
title: Typescript 库
description: Tact 的编译器会自动生成包装代码，供 @ton/ton 和 @ton/core 库使用
prev:
  link: /zh-cn/ecosystem
  label: 生态系统概览
---

Tact 语言内置了对 [@ton/ton](https://github.com/ton-org/ton) 和 [@ton/core](https://github.com/ton-org/ton-core) TypeScript 库的支持。 编译器会自动为这些库生成代码，因此您可以使用 [@tact-lang/emulator](https://github.com/tact-lang/tact-emulator) 或 [@ton/sandbox](https://github.com/ton-org/sandbox)，在它们之上运行。

## Typescript 中的合约

编译器会为[项目](/zh-cn/book/config#projects)中的每个合约生成名为`{project}_{contract}.ts` 的文件，其中包含即用型强类型封装器，可在任何由 TypeScript 支持的环境中使用：[测试](/zh-cn/book/debug)、[部署](/zh-cn/book/deploy)等。



================================================
FILE: docs/src/content/docs/zh-cn/ecosystem/vscode.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ecosystem/vscode.mdx
================================================
---
title: VS Code扩展
description: 广泛支持Visual Studio 代码中的 Tact 语言：语法高亮、错误诊断、代码片断、悬停信息和更多
---

在 Visual Studio Code (VSCode) 中为 Tact 语言提供广泛支持：

- [语义语法高亮][l1]
- [代码补全][l2] [自动导入][l3]、[后缀补全][l4]、片段、[导入补全][l5]
- 转到 [定义][l6]、实现、[类型定义][l7］
- 查找所有引用、工作区符号搜索、符号重命名
- 悬停时的类型和文档
- [类型][l8]、[参数名][l9] 和 [更多][l10] 的镶嵌提示
- 具有快速修复功能的即时检查
- 调用、“initOf ”和结构体初始化内部的签名帮助
- 带有实现/引用计数的[透镜][l11］
- 汇编函数的[气体估计][l12］
- 基于蓝图和 Tact 模板构建和测试项目
- 集成 Tact 编译器和 [Misti 静态分析器](/ecosystem/misti)

[l1]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/highlighting.md
[l2]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md
[l3]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md#auto-import
[l4]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md#postfix-completion
[l5]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md#imports-completion
[l6]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/navigation.md#go-to-definition
[l7]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/navigation.md#go-to-type-definition
[l8]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/inlay-hints.md#type-hints
[l9]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/inlay-hints.md#parameter-hints
[l10]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/inlay-hints.md#additional-hints
[l11]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/code-lenses.md
[l12]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/gas-calculation.md

## 快速启动

为 VS Code 和基于 VSCode 的编辑器（如 VSCodium、Cursor、Windsurf 等）下载扩展：

- 在 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact) 上获取。
- 在 [Open VSX Registry](https://open-vsx.org/extension/tonstudio/vscode-tact) 上获取。
- 或者从[夜间版本中的`.vsix`文件](https://github.com/tact-lang/tact-language-server/releases)中安装。

对于非基于 VSCode 的编辑器，请安装 [Language Server (LSP Server)](https://github.com/tact-lang/tact-language-server) 。它支持 Sublime Text、(Neo)Vim、Helix 以及其他任何支持 LSP 的编辑器。

## VSCode 安装手册

1. 打开 Visual Studio Code (VSCode)。

2. 点击窗口侧面活动栏中的 “扩展 ”图标，进入扩展视图。它看起来就像一个正方形中的正方形。

3. 在扩展视图中，输入 “Tact 语言”。你会在下拉菜单中看到 [TON Studio](https://tonstudio.io) 提供的扩展 “Tact Language”。你还会看到其他由社区提供的扩展，但你应该使用 TON Studio 提供的扩展，因为它是由 Tact 团队正式支持和开发的。

4. 点击扩展名称旁边的 “安装 ”按钮。等待安装完成。

5. 安装扩展后，你可能需要重新加载 VS Code。你可能会在扩展旁边看到一个 “重新加载”（Reload）按钮。出现该按钮时点击它。

## 参考文献和资源

- [GitHub上的扩展](https://github.com/tact-lang/tact-language-server)
- [Visual Studio Marketplace 上的扩展](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact)
- [开放 VSX 注册表上的扩展](https://open-vsx.org/extension/tonstudio/vscode-tact)



================================================
FILE: docs/src/content/docs/zh-cn/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/index.mdx
================================================
---
title: 学习 Tact 中的所有编程知识
description: Tact 是 TON 区块链的一种新编程语言，注重效率和简便性。 它设计得易于学习和使用，并且非常适合智能合约。
template: doc
tableOfContents: false
hero:
  tagline: Tact 是 TON 区块链的一种新编程语言，注重效率和简便性。 它设计得易于学习和使用，并且非常适合智能合约。 它设计得易于学习和使用，并且非常适合智能合约。 Tact 是一种静态类型语言，具有简单的语法和强大的类型系统。
  image:
    dark: /public/logomark-light.png
    light: /public/logomark-dark.png
    alt: Tact logo
  actions:
    - text: 📚 书
      link: /zh-cn/book
      variant: minimal
      icon: right-arrow
    - text: 🍲 开发指南
      link: /zh-cn/cookbook
      variant: minimal
      icon: right-arrow
    - text: 🔬 参考资料
      link: /zh-cn/ref
      variant: minimal
      icon: right-arrow
    - text: 🗺️ 相关生态
      link: /zh-cn/ecosystem
      variant: minimal
      icon: right-arrow
---

import { LinkCard, CardGrid, Tabs, TabItem, Steps } from '@astrojs/starlight/components';

## 🚀 我们开始吧！ {#start}

<p>ㅤ</p>

<Steps>

1. #### 确保已安装受支持的 Node.js 版本并可用 {#start-1}

    要检查它，请运行 `node --version{:shell}` --它应该会显示 22.0.0 或更高版本。

2. #### 运行以下命令 {#start-2}

   它将创建一个带有简单计数器合约的新项目：

   <Tabs>
     <TabItem label="yarn" icon="seti:yarn">
       ```shell
       # recommended
       yarn create ton simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
     <TabItem label="npm" icon="seti:npm">
       ```shell
       npm create ton@latest -- simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
     <TabItem label="pnpm" icon="pnpm">
       ```shell
       pnpm create ton@latest simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
     <TabItem label="bun" icon="bun">
       ```shell
       bun create ton@latest simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
   </Tabs>

3. #### 就是这样！ 就是这样！ {#start-3}

   您的第一个合约项目已经编写完成！

   进入相关目录查看 - `cd simple-counter/contracts{:shell}`。  这就是它的样子：

   ```tact
   message Add {
       queryId: Int as uint64;
       amount: Int as uint32;
   }

   contract SimpleCounter {
       id: Int as uint32;
       counter: Int as uint32;

       init(id: Int) {
           self.id = id;
           self.counter = 0;
       }

       // Empty receiver for the deployment
       receive() {
           // Forward the remaining value in the
           // incoming message back to the sender
           cashback(sender());
       }

       receive(msg: Add) {
           self.counter += msg.amount;

           // Forward the remaining value in the
           // incoming message back to the sender
           cashback(sender());
       }

       get fun counter(): Int {
           return self.counter;
       }

       get fun id(): Int {
           return self.id;
       }
   }
   ```

   要重新编译或部署，请参考此新创建项目根目录中 `package.json` 文件的脚本部分，以及 [Blueprint](https://github.com/ton-org/blueprint) 的文档——这是我们用来创建和编译您第一个简单计数器合约的工具。 事实上，Blueprint 的功能远不止这些：包括测试、定制等。

</Steps>

## 🤔 下一站去哪里？  {#next}

<p>ㅤ</p>

<Steps>

1. #### 已经掌握了一些区块链知识？ {#next-1}

   请参阅 [Tact Cookbook](/zh-cn/cookbook)，它是每个 Tact 开发人员在智能合约开发过程中面临的日常任务（和解决方案）的便捷集合。 使用它可以避免重复发明轮子。

   此外，还可以查看以下小抄，快速入门：

   <CardGrid>
     <LinkCard
       title="💎 来自 FunC (TON)"
       href="/zh-cn/book/cs/from-func"
     />
     <LinkCard
       title="🔷 来自 Solidity (Ethereum)"
       href="/zh-cn/book/cs/from-solidity"
     />
   </CardGrid>

2. #### 想了解更多吗？  {#next-2}

   有关编译、测试和部署的进一步指导，请参阅相关页面：

   - [测试和调试](/zh-cn/book/debug) 页面将为您介绍有关 Tact 合约调试的所有内容。
   - [部署](/zh-cn/book/deploy)页面展示了部署的样子，并帮助你利用[Blueprint](https://github.com/ton-org/blueprint) 的力量进行部署。

   有关您最喜欢的编辑器和其他工具的自定义插件，请参阅 [生态系统](/zh-cn/ecosystem) 部分。

   或者，也可以查看以下更广泛的章节：

   - [书籍](/zh-cn/book) 帮助您逐步学习语言
   - [Cookbook](/zh-cn/cookbook)为您提供现成的 Tact 代码食谱
   - [参考资料](/zh-cn/ref) 提供了标准库、语法和演变过程的完整词汇表
   - 最后，[Ecosystem](/zh-cn/ecosystem) 描述了 Tact 和 TON 生态系统中“有什么”。

   <CardGrid>
     <LinkCard
       title="📚 阅读 Tact 书籍"
       href="/zh-cn/book"
     />
     <LinkCard
       title="🍲 研习食谱"
       href="/zh-cn/cookbook"
     />
     <LinkCard
       title="🔬 浏览参考文档"
       href="/zh-cn/ref"
     />
     <LinkCard
       title="🗺️ 拥抱生态系统"
       href="/zh-cn/ecosystem"
     />
   </CardGrid>

3. #### 感觉有点不舒服？  {#next-3}

   如果遇到困难，请尝试搜索--搜索框就在文档顶部。 如果遇到困难，请尝试搜索--搜索框就在文档顶部。 还有一个方便的<kbd>Ctrl</kbd>+<kbd>K</kbd>快捷键，可以在输入时快速对焦并开始搜索。

   如果您在文档中找不到答案，或者您尝试进行了一些本地测试，但仍然无济于事，请不要犹豫，联系 Tact 活跃的社区：

   <CardGrid>
     <LinkCard
       title="✈️ Telegram Group"
       href="https://t.me/tactlang"
     />
     <LinkCard
       title="🐦 X/Twitter"
       href="https://twitter.com/tact_language"
     />
   </CardGrid>

   祝你在⚡ Tact 的编码冒险中好运！

</Steps>



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-advanced.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-advanced.mdx
================================================
---
title: 高级
description: Tact 核心库中的高级、特殊或危险功能
---

import { Badge } from '@astrojs/starlight/components';

各种小众、危险或不稳定的功能，可能会产生意想不到的结果，仅供更有经验的用户使用。

:::caution

  谨慎行事。

:::

## gasConsumed

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun gasConsumed(): Int;
```

返回当前交易中 [TVM][tvm] 到目前为止消耗的 [gas][gas] 的 [nanoToncoin][nanotoncoin] [`Int{:tact}`][int] 数量。 由此产生的值包括调用此功能的费用。

用法示例：

```tact
let gas: Int = gasConsumed();
```

:::note[Useful links:]

  [TON Docs中的 Gas](https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees#gas)

:::

## myStorageDue

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun myStorageDue(): Int;
```

返回累积的 [storage fee][storage-fee] 债务的 [nanoToncoin][nanotoncoin] [`Int{:tact}`][int] 数量。 在计算新的合约余额之前，将从收到的信息值中扣除储存费。

用法示例：

```tact
let debt: Int = myStorageDue();
```

:::note[Useful links:]

  [TON 文档中的存储费][storage-fee](存储费）
  [TON 文档中的存储费计算][storage-fee-calc]

:::

## getStorageFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getStorageFee(cells: Int, bits: Int, seconds: Int, isMasterchain: Bool): Int;
```

计算并返回在给定数量的 `cells` 和 `bits` 下存储合约指定 `seconds` 时间所需的 [storage fee][storage-fee]，以 [nanoToncoins][nanotoncoin] [`Int{:tact}`][int] 表示。 如果`isMasterchain` 是 `true{:tact}`，则使用 [masterchain][masterchain] 的价格，否则 [basechain][basechain] 的价格。 当前价格来自[TON Blockchain的配置参数18](https://docs.ton.org/develop/howto/blockchain-configs#param-18)。

请注意，`cells`和`bits`的数值被用来作为它们最大的数值加上 $1$的模块。 也就是说，如果指定的值高于[账户状态限制（`max_acc_state_cells`和`max_acc_state_bits`）](/zh-cn/book/exit-codes#50)中列出的值，其结果将与指定精确限制的结果相同。 此外，请确保您考虑到[与同一哈希的 cells 分离][deduplication]。

试图指定负数的 `cells`、`bits` 或 `seconds` 会抛出异常[export code 5](/zh-cn/book/exit-codes#5)：`整数超出预期范围`。

用法示例：

```tact
let fee: Int = getStorageFee(1_000, 1_000, 1_000, false);
//                           -----  -----  -----  -----
//                           ↑      ↑      ↑      ↑
//                           |      |      |      Isn't on the masterchain,
//                           |      |      |      but on the basechain
//                           |      |      Number of seconds to calculate
//                           |      |      the storage fee for
//                           |      Number of bits in a contract
//                           Number of cells in a contract
```

:::note[Useful links:]

  [TON 文档中的存储费][storage-fee](存储费）
  [TON 文档中的存储费计算][storage-fee-calc]

:::

## getComputeFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getComputeFee(gasUsed: Int, isMasterchain: Bool): Int;
```

计算并返回消耗了 `gasUsed` 数量的[gas][gas]的交易的[compute fee][compute-fee]，单位为[nanoToncoins][nanotoncoin][`Int{:tact}`][int]。 如果`isMasterchain` 是 `true{:tact}`，则使用 [masterchain][masterchain] 的价格，否则 [basechain][basechain] 的价格。 当前价格来源于 TON 区块链的 [主链配置参数 20 和基本链配置参数 21][param-20-21]。

当 `gasUsed` 小于称为 [`flat_gas_limit`][param-20-21] 的某个阈值时，需支付的最低费用基于 [`flat_gas_price`][param-20-21] 的值计算。 gas 使用量越小，最低价格就越高。 请参阅[`getSimpleComputeFee(){:tact}`](#getsimplecomputefee)的示例来得出这个阈值。

试图指定一个 `gassUsed` 的负值导致异常[退出码 5](/zh-cn/book/exit-codes#5)：`Integer out of expected range`。

使用示例

```tact
let fee: Int = getComputeFee(1_000, false);
//                           -----  -----
//                           ↑      ↑
//                           |      Isn't on the masterchain,
//                           |      but on the basechain
//                           Number of gas units
//                           consumed per transaction
```

:::note[Useful links:]

  [Compute fee in TON Docs][compute-fee]\
  [Compute fee calculation in TON Docs][compute-fee-calc]\
  [`getSimpleComputeFee(){:tact}`](#getsimplecomputefee)

:::

## getSimpleComputeFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getSimpleComputeFee(gasUsed: Int, isMasterchain: Bool): Int;
```

类似于[`getComputeFee(){:tact}`](#getcomputefee)，但没有[`flat_gas_price`][param-20-21]，如果`gassUsed`小于一个叫做[`flat_gas_limit`][param-20-21] 的阈值，则不支付最低价格。 计算并只返回当前 gas 价格的 `gasUsed` 倍数。

试图指定一个 `gassUsed` 的负值导致异常[退出码 5](/zh-cn/book/exit-codes#5)：`Integer out of expected range`。

示例用法：

```tact
let fee = getComputeFee(0, false);
let feeNoFlat = getSimpleComputeFee(0, false);
let maxFlatPrice = fee - feeNoFlat;
```

:::note[Useful links:]

  [Compute fee in TON Docs][compute-fee]\
  [Compute fee calculation in TON Docs][compute-fee-calc]\
  [`getComputeFee(){:tact}`](#getcomputefee)

:::

## Context.readForwardFee

```tact
extends fun readForwardFee(self: Context): Int;
```

[`Context{:tact}`](/zh-cn/ref/core-contextstate#context) 的扩展函数。

读取[forward fee](https://docs.ton.org/develop/smart-contracts/guidelines/processing)，然后返回为 [`Int{:tact}`][int] [nanoToncoins][nanotoncoin]。

示例用法：

```tact
let fwdFee: Int = context().readForwardFee();
```

:::note[Useful links:]

  [`getOriginalFwdFee(){:tact}`](#getoriginalfwdfee)

:::

## getForwardFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getForwardFee(cells: Int, bits: Int, isMasterchain: Bool): Int;
```

计算并返回一个出站消息的[转发费用][forward-fee]，该消息由给定数量的`cells`和`bits`组成，费用以[nanoToncoins][nanotoncoin]表示，类型为[`Int{:tact}`][int]。 如果`isMasterchain` 是 `true{:tact}`，则使用 [masterchain][masterchain] 的价格，否则 [basechain][basechain] 的价格。 当前价格来自 TON 区块链的[主链配置参数 24 和基链配置参数 25][param-24-25]。

如果源地址和目的地址都在 [basechain][basechain]中，那么指定`isMasterchain` 为 `false{:tact}`。 否则，请指定 `true{:tact}`。

请注意，`cells` 和 `bits` 的值取其最大值加上 $1$。 也就是说，指定高于[账户状态限制（`max_msg_cells` 和 `max_msg_bits`）](/zh-cn/book/exit-codes#50)中所列值的值，会产生与指定精确限制相同的结果。

然而，不管`cells`和`bits`的数值如何，此函数总是添加基于[`lump_price`][param-24-25] 的最低价格。 请参阅[`getSimpleForwardFee(){:tact}`](#getsimpleforwardfee) 的示例以获取它。 此外，请确保考虑到[具有相同哈希的cell去重][deduplication]，因为例如 root cell 及其数据位不计入转发费用，并由[`lump_price`][param-24-25]覆盖。

试图指定负数的 `cells` 或 `bits` 会导致异常[退出码 5](/zh-cn/book/exit-codes#5)：`Integer out of expected range`。

使用示例

```tact
let fee: Int = getForwardFee(1_000, 1_000, false);
//                           -----  -----  -----
//                           ↑      ↑      ↑
//                           |      |      Both source and destination
//                           |      |      isn't on the masterchain,
//                           |      |      but on the basechain
//                           |      Number of bits in a message
//                           Number of cells in a message
```

:::note[Useful links:]

  [TON 文档中的转发费用][forward-fee]\
[TON 文档中的转发费用计算][forward-fee-calc]\
[`CDATASIZEQ` 指令用于计算 `Cell{:tact}` 中不同cell、数据位和引用的数量](https://docs.ton.org/v3/documentation/tvm/instructions#F940)\
[`getSimpleForwardFee(){:tact}`](#getsimpleforwardfee)\
[`getOriginalFwdFee(){:tact}`](#getoriginalfwdfee)

:::

## getSimpleForwardFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getSimpleForwardFee(cells: Int, bits: Int, isMasterchain: Bool): Int;
```

类似于[`getForwardFee(){:tact}`](#getforwardfee)，但没有 [`lump_price`][param-24-25], 例如, 不考虑`cells`或`bits`的数量，支付最低价格。 计算并返回仅由 `cells` 乘以当前单元价格加上 `bits` 乘以当前位价格的结果。

试图指定负数的 `cells` 或 `bits` 会导致异常[退出码 5](/zh-cn/book/exit-codes#5)：`Integer out of expected range`。

使用示例

```tact
let fee = getForwardFee(1_000, 1_000, false);
let feeNoLump = getSimpleForwardFee(1_000, 1_000, false);
let lumpPrice = fee - feeNoLump;
```

:::note[Useful links:]

  [TON 文档中的forward-fee][forward-fee](
  ） [TON 文档中的forward-fee计算][forward-fee-calc](
  ） [`getForwardFee()（{:tact}）`](#getforwardfee)

:::

## getOriginalFwdFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getOriginalFwdFee(fwdFee: Int, isMasterchain: Bool): Int;
```

根据从传入信息中获取的 `fwdFee` 计算并返回传出信息的所谓 _original_ [转发费][forward-fee]，单位为 [nano Toncoins][nanotoncoin] [`Int{:tact}`][int]。 如果源地址和目的地址都在 [basechain][basechain]中，那么指定`isMasterchain` 为 `false{:tact}`。 否则，请指定 `true{:tact}`。

当发出的信息在很大程度上取决于收到的信息的结构，以至于无法单独使用 [`getForwardFee(){:tact}`](#getforwardfee) 来完全预测费用时，这个函数就非常有用。 即使可以，以 [nanoToncoin][nanotoncoin] 级别的精度计算精确费用也会非常昂贵，因此该函数给出的近似值通常已经足够好了。

试图指定一个 `fwdFee` 的负值导致异常[退出码 5](/zh-cn/book/exit-codes#5)：`Integer out of expected range`。

用法示例：

```tact
let fwdFee: Int = context().readForwardFee();
let origFee: Int = getOriginalFwdFee(fee, false);
```

:::note[Useful links:]

  [TON 文档中的转发费用][forward-fee]/
  [TON 文档中的转发费用计算][forward-fee-calc]/
  [`getForwardFee(){:tact}`](#getforwardfee)/
  [`Context.readForwardFee(){:tact}`](#contextreadforwardfee)

:::

## getConfigParam

```tact
fun getConfigParam(id: Int): Cell?;
```

通过 `id` 加载 TON 区块链的[配置参数](https://docs.ton.org/develop/howto/blockchain-configs)。

使用示例：

```tact
// Parameter 0, address of a special smart contract that stores the blockchain's configuration
let configAddrAsCell: Cell = getConfigParam(0)!!;

// Parameter 18, configuration for determining the prices for data storage
let dataStorageFeeConfig: Cell = getConfigParam(18)!!;
```

:::note

  标准库 [`@stdlib/config`](/zh-cn/ref/stdlib-config) 提供了两个相关的辅助函数：\
  [`getConfigAddress(){:tact}`](/zh-cn/ref/stdlib-config#getconfigaddress)，用于获取配置 [`Address{:tact}`][p]/
  [`getElectorAddress(){:tact}`](/zh-cn/ref/stdlib-config#getconfigaddress)，用于获取选区 [`Address{:tact}`][p]。

  了解有关其他参数的更多信息：[TON 文档中的配置参数](https://docs.ton.org/develop/howto/blockchain-configs)。

:::

## acceptMessage

```tact
fun acceptMessage();
```

同意购买一些 gas 来完成当前交易。 处理外部信息时需要这一操作，因为外部信息本身没有值（因此没有 gas ）。

用法示例：

```tact {10}
contract Timeout {
    timeout: Int;

    init() {
        self.timeout = now() + 5 * 60; // 5 minutes from now
    }

    external("timeout") {
        if (now() > self.timeout) {
            acceptMessage(); // start accepting external messages once timeout went out
        }
    }
}
```

:::note

  更多详情，请参阅[TON 文档中的接受信息效果](https://docs.ton.org/develop/smart-contracts/guidelines/accept)。

:::

## commit

```tact
fun commit();
```

提交 [寄存器](https://docs.ton.org/learn/tvm-instructions/tvm-overview#control-registers)`c4`（"持久化数据"）和`c5`（"操作"）的当前状态，这样，即使随后在计算阶段出现异常，当前执行也会因保存的值而被视为 "成功"。

用法示例：

```tact {1}
commit();  // now, transaction is considered "successful"
throw(42); // and this won't fail it
```

## nativePrepareRandom {#nativePrepareRandom}

```tact
fun nativePrepareRandom();
```

使用 [`nativeRandomizeLt(){:tact}`](#nativerandomizelt)准备随机数生成器。 由 [`randomInt(){:tact}`](/zh-cn/ref/core-random#randomint) 和 [`random(){:tact}`](/zh-cn/ref/core-random#random) 函数自动调用。

用法示例：

```tact
nativePrepareRandom(); // prepare the RNG
// ... do your random things ...
```

## nativeRandomize

```tact
fun nativeRandomize(x: Int);
```

使用指定的种子 `x` 随机化伪随机数生成器。

用法示例：

```tact
nativeRandomize();          // now, random numbers are less predictable
let idk: Int = randomInt(); // ???, it's random!
```

## nativeRandomizeLt

```tact
fun nativeRandomizeLt();
```

使用当前 [逻辑时间](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time) 随机化随机数发生器。

用法示例：

```tact
nativeRandomizeLt();        // now, random numbers are unpredictable for users,
                            // but still may be affected by validators or collators
                            // as they determine the seed of the current block.
let idk: Int = randomInt(); // ???, it's random!
```

## nativeRandom

```tact
fun nativeRandom(): Int;
```

生成并返回 $256$-bit 随机数，就像 [`randomInt(){:tact}`](/zh-cn/ref/core-random#randomint)，但不会事先用 [`nativePrepareRandom(){:tact}`](#nativePrepareRandom)初始化随机生成器。

:::note

  不要直接使用该函数，而应使用 [`randomInt(){:tact}`](/zh-cn/ref/core-random#randomint)。

:::

## nativeRandomInterval

```tact
fun nativeRandomInterval(max: Int): Int;
```

生成并返回 $256$-bit 的随机数，范围从 $0$ 到 `max`，类似于 [`random(){:tact}`](/zh-cn/ref/core-random#random)，但不会事先用 [`nativePrepareRandom(){:tact}`](#nativePrepareRandom)初始化随机生成器。

:::note

  不要直接使用该函数，而应使用 [`random(){:tact}`](/zh-cn/ref/core-random#random)。

:::

## nativeSendMessage

```tact
fun nativeSendMessage(cell: Cell, mode: Int);
```

[排序消息](/zh-cn/book/send#outbound-message-processing)将通过指定完整的 `cell` 和 [message `mode`](/zh-cn/book/message-mode) 发送。

:::note

  除非您有无法以其他方式表达的复杂逻辑，否则请优先使用更常见、更方便用户使用的 [`send(){:tact}`](/zh-cn/ref/core-send#send)函数。

:::

## nativeReserve

```tact
fun nativeReserve(amount: Int, mode: Int);
```

以指定的金额和模式调用本地 `raw_reserve` 函数。 `raw_reserve`是一个能够创建输出动作的函数，从账户余额中保留一定数量的 [nanoToncoins][nanotoncoin]。

它在 FunC 中的签名如下

```func
raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
```

该函数有两个参数：

- `amount`: 保留的 [nanoToncoins][nanotoncoin] 个数。
- `mode `: 确定预订行为。

函数 `raw_reserve` 大致等同于创建一条向外发送的消息，将指定的 "数量" [nano Toncoins][nanotoncoin](或 `b`  $-$ "数量" [nano Toncoins][nanotoncoin]，其中 `b`为余额）发送给自己。 这就确保了后续产出行动所花费的资金不会超过剩余资金。

您可以使用原始的 [`Int{:tact}`][int]值，并手动为 `mode` 提供这些值，但为了方便起见，您可以使用一组常量来轻松构建复合 `mode`。 有关基本模式和可选标记的更多信息，请参阅下表。

:::caution

  目前，`amount` 必须是非负整数，`mode` 的范围必须是 $0..31$（含）。

:::

### 基本模式 {#nativereserve-base-modes}

由此产生的 `mode` 值可以有以下基本模式：

|        模式值 | 常量名称                          | 说明                                                 |
| ---------: | :---------------------------- | -------------------------------------------------- |
| $0$        | `ReserveExact{:tact}`         | 精确保留指定数量的 [nanoToncoins][nanotoncoin]。             |
| $1$        | `ReserveAllExcept{:tact}`     | 保留所有，但是指定的 [nanoToncoins][nanotoncoin] 的`amount` 。 |
| $2$        | `ReserveAtMost{:tact}`        | 最多保留指定数量的 [nanoToncoins][nanotoncoin]。             |

### 可选标记 {#nativereserve-optional-flags}

此外，生成的 `mode` 还可以添加以下可选标记：

|        标志值 | 常量名称                               | 描述                                            |
| ---------: | :--------------------------------- | --------------------------------------------- |
| $+4$       | `ReserveAddOriginalBalance{:tact}` | 增加 `amount` 的值，包含当前账户的原始余额（计算阶段之前），包括所有额外的货币。 |
| $+8$       | `ReserveInvertSign{:tact}`         | 在执行预留操作之前，将 `amount` 值取反。                     |
| $+16$      | `ReserveBounceIfActionFail{:tact}` | 保留失败时退回交易。                                    |

### 使用标志组合模式 {#nativereserve-combining-modes-with-flags}

要为 `mode` 参数创建 [`Int{:tact}`][int] 值，只需通过应用 [按位或操作](/zh-cn/book/operators#binary-bitwise-or) 将基本模式与可选标志结合起来：

```tact
nativeReserve(ton("0.1"), ReserveExact | ReserveBounceIfActionFail);
//            ----------  ----------------------------------------
//            ↑           ↑
//            |           mode, which would bounce the transaction if exact reservation would fail
//            amount of nanoToncoins to reserve
```

## parseStdAddress

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun parseStdAddress(slice: Slice): StdAddress;
```

将包含地址的 [`Slice{:tact}`][slice] 转换为 `StdAddress{:tact}` [Struct][s] 并返回它。 `StdAddress{:tact}` 是一个内置的 [Struct][s] 包含：

| 字段          | 类型                             | 说明                                                |
| :---------- | :----------------------------- | :------------------------------------------------ |
| `workchain` | [`Int as int8{:tact}`][int]    | 地址的工作链ID，通常是 $0$ (basechain) 或 $-1$ (masterchain) |
| `address`   | [`Int as uint256{:tact}`][int] | 指定的`工作链`中的地址                                      |

尝试传递具有不同布局的 [`Slice{:tact}`][slice]，或者加载的数据超过给定 [`Slice{:tact}`][slice] 所包含的数据，会抛出异常，带有 [退出码 9](/zh-cn/book/exit-codes#9)：`Cell underflow`。

用法示例：

```tact
let addr = address("EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2");
let parsedAddr = parseStdAddress(addr.asSlice());

parsedAddr.workchain; // 0
parsedAddr.address;   // 107...lots of digits...287

// Using newAddress() function with the contents of StdAddress will yield the initial Address:
let addr2: Address = newAddress(parsedAddr.workchain, parsedAddr.address);
addr2 == addr; // true
```

:::note

  要解析变量长度的地址，请参阅[`parseVarAddress(){:tact}`](#parsevaraddress) 函数。

:::

## parseVarAddress

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun parseVarAddress(slice: Slice): VarAddress;
```

将包含可变长度的地址的 [`Slice{:tact}`][slice] 转换为 `VarAddress{:tact}` [Struct][s] 并返回它。 `VarAddress{:tact}` 是一个内置的 [Struct][s] 由以下部分组成：

| 字段          | 类型                           | 函数 "raw_reserve "大致等同于创建一个向外发送的消息，将指定的 "金额"[nanoToncoins](/zh-cn/book/integers#nanotoncoin)（或 "b " $-$ "金额"[nanoToncoins](/zh-cn/book/integers#nanotoncoin)，其中 "b "为余额）发送给自己。 这就确保了后续产出行动所花费的资金不会超过剩余资金。 |
| :---------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workchain` | [`Int as int32{:tact}`][int] | 变量长度地址的 Workchain ID                                                                                                                                                                         |
| `address`   | [`Slice{:tact}`][slice]      | 指定的`工作链`中的地址                                                                                                                                                                                 |

尝试传递具有不同布局的 [`Slice{:tact}`][slice]，或者加载的数据超过给定 [`Slice{:tact}`][slice] 所包含的数据，会抛出异常，带有 [退出代码 9](/zh-cn/book/exit-codes#9)：`Cell underflow`。

用法示例：

```tact
let varAddrSlice = beginCell()
    .storeUint(6, 3)     // to recognize the following as a VarAddress
    .storeUint(123, 9)   // make address occupy 123 bits
    .storeUint(234, 32)  // specify workchain ID of 234
    .storeUint(345, 123) // specify address of 345
    .asSlice();
let parsedVarAddr = parseVarAddress(varAddrSlice);

parsedVarAddr.workchain;             // 234
parsedVarAddr.address;               // CS{Cell{002...2b3} bits: 44..167; refs: 0..0}
parsedVarAddr.address.loadUint(123); // 345
```

:::caution

  可变长度地址是为未来扩展而设计的，虽然验证者必须准备好接受它们的入站消息，但标准（非可变）地址在可能的情况下仍然优先使用。

:::

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[slice]: /zh-cn/book/cells#slices
[s]: /zh-cn/book/structs-and-messages#structs
[masterchain]: /zh-cn/book/masterchain
[cell-hash]: /zh-cn/ref/core-cell#cellhash
[nanotoncoin]: /zh-cn/book/integers#nanotoncoin
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[basechain]: https://docs.ton.org/v3/documentation/smart-contracts/addresses#workchain-id
[deduplication]: https://docs.ton.org/v3/documentation/data-formats/tlb/library-cells
[storage-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee
[storage-fee-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation#storage-fee
[gas]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees#gas
[compute-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees
[compute-fee-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation#computation-fee
[param-20-21]: https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-20-and-21
[forward-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/forward-fees
[forward-fee-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation#forward-fee
[param-24-25]: https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-24-and-25



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-base.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-base.mdx
================================================
---
title: 基本trait
description: Tact 中的每个合约和特性都隐含继承BaseTrait 特性
prev:
  link: /zh-cn/ref/evolution/otp-006
  label: OTP-006：合约包
---

Tact 中的每个[合约](/zh-cn/book/contracts)和[特性](/zh-cn/book/types#traits)都会隐式[继承](/zh-cn/book/contracts#traits) `BaseTrait{:tact}` 特性，该特性包含许多适用于各种合约的[内部函数](/zh-cn/book/contracts#internal-functions)，以及一个面向 Tact 高级用户的常量 `self.storageReserve{:tact}`。

## 常数

### self.storageReserve {#self-storagereserve}

```tact
virtual const storageReserve: Int = 0;
```

用法示例：

```tact
contract AllYourStorageBelongsToUs {
    // This would change the behavior of self.forward() function,
    // causing it to try reserving this amount of nanoToncoins before
    // forwarding a message with SendRemainingBalance mode
    override const storageReserve: Int = ton("0.1");
}
```

## 函数

### self.reply {#self-reply}

```tact
virtual fun reply(body: Cell?);
```

使用以下参数调用 [`self.forward(){:tact}`](#self-forward)函数的别名：

```tact
self.forward(sender(), body, true, null);
//           ↑         ↑     ↑     ↑
//           |         |     |     init: StateInit?
//           |         |     bounce: Bool
//           |         body: Cell?
//           to: Address
```

示例用法：

```tact
// 这条信息会反弹给我们！
self.reply("Beware, this is my reply to you!".asComment());
```

### self.notify {#self-notify}

```tact
virtual fun notify(body: Cell?);
```

使用以下参数调用 [`self.forward(){:tact}`](#self-forward)函数的别名：

```tact
self.forward(sender(), body, false, null);
//           ↑         ↑     ↑      ↑
//           |         |     |      init: StateInit?
//           |         |     bounce: Bool
//           |         body: Cell?
//           to: Address
```

示例用法：

```tact
// 此消息不会跳转！
self.notify("Beware, this is my reply to you!".asComment());
```

### self.forward {#self-forward}

```tact
virtual fun forward(to: Address, body: Cell?, bounce: Bool, init: StateInit?);
```

[将消息排入队列](/zh-cn/book/send#outbound-message-processing)（可回弹或不可回弹），以发送到指定的地址 `to`。 您可以选择提供消息的 `body` 和 [`init` 包](/zh-cn/book/expressions#initof)。

当 [`self.storageReserve{:tact}`](#self-storagereserve) 常量被覆盖为大于 $0$ 时，在发送消息之前，它会尝试从剩余余额中预留 `self.storageReserve{:tact}` 数量的 [nanoToncoins][nano]，然后再以 [`SendRemainingBalance{:tact}`](https://docs.tact-lang.org/book/message-mode#base-modes) 模式进行发送 ($128$)。

如果预留尝试失败，或者在没有尝试的默认情况下，消息将改为使用 [`SendRemainingValue{:tact}`](https://docs.tact-lang.org/book/message-mode#base-modes) ($64$) 模式发送。

:::note

  请注意，`self.forward(){:tact}` 永远不会在余额上额外发送 [nanoToncoins][nano]。要通过单条消息发送更多的 [nanoToncoins][nano]，请使用 [`send(){:tact}`](/zh-cn/ref/core-send#send) 函数。

:::

用法示例：

```tact
import "@stdlib/ownable";

message PayoutOk {
    address: Address;
    value: Int as coins;
}

contract Payout with Ownable {
    completed: Bool;
    owner: Address;

    init(owner: Address) {
        self.owner = owner;
        self.completed = false;
    }

    // ... some actions there ...

    // Bounced receiver function, which is called when the specified outgoing message bounces back
    bounced(msg: bounced<PayoutOk>) {
        // Reset completed flag if our message bounced
        self.completed = false;

        // Send a notification that the payout failed using the remaining funds for processing this send
        self.forward(self.owner, "Payout failed".asComment(), false, null);
    }
}
```

[nano]: /zh-cn/book/integers#nanotoncoin



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-cells.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-cells.mdx
================================================
---
title: Cells, Builders 和 Slices
description: Tact 核心库中的各种 Cell、Builder 和 Slice 函数
---

import { Badge } from '@astrojs/starlight/components';

[`Cell{:tact}`][cell] 是一个低级别的 [原始类型][p]，表示 TON 区块链中的数据。 cell由 $1023$ 位数据组成，最多可 $4$ 引用另一个cell。 它们是只读的、不可变的，并且不能循环引用。

[`Builder{:tact}`][builder] 是一个不可变的 [原始类型][p]，用于构建单元格，而 [`Slice{:tact}`][slice] 是一个可变的 [原始类型][p]，用于解析单元格。

:::note

  在手动构建和解析单元格时要非常小心，并始终确保记录其所需的布局：用于序列化和反序列化的值和类型的严格顺序。

  为此，建议高级用户使用[类型语言 - 二进制（TL-B）模式][tlb]。

  每个用户都建议使用 [结构体][struct] 及其 [方法](/zh-cn/book/functions#extension-function)，例如 [`Struct.toCell(){:tact}`](#structtocell) 和 [`Struct.fromCell(){:tact}`](#structfromcell)，而不是手动构建和解析单元格，因为 [结构体][struct] 和 [消息][message] 最接近于作为你合约的 [活的 TL-B 模式](/zh-cn/book/cells#cnp-structs)。

:::

## beginCell

```tact
fun beginCell(): Builder;
```

创建一个新的空[`Builder{:tact}`][builder]。

示例用法：

```tact
let fizz: Builder = beginCell();
```

## emptyCell

```tact
fun emptyCell(): Cell;
```

创建并返回空 [`cell{:tact}`][cell](不含数据和引用）。 别名为 `beginCell().endCell(){:tact}`。

示例用法：

```tact
let fizz: Cell = emptyCell();
let buzz: Cell = beginCell().endCell();

fizz == buzz; // true
```

## emptySlice

```tact
fun emptySlice(): Slice;
```

创建并返回一个空的 [`Slice{:tact}`][slice] (没有数据和引用)。 与 `emptyCell().asSlice(){:tact}` 同名。

示例用法：

```tact
let fizz: Slice = emptySlice();
let buzz: Slice = emptyCell().asSlice();

fizz == buzz; // true
```

## Cell.beginParse

```tact
extends fun beginParse(self: Cell): Slice;
```

[`Cell{:tact}`][cell] 的扩展函数。

打开 [`Cell{:tact}`][cell] 进行解析，并以 [`Cell{:tact}`][cell] 的形式返回。

示例用法：

```tact
let c: Cell = emptyCell();
let fizz: Slice = c.beginParse();
```

## Cell.hash

```tact
extends fun hash(self: Cell): Int;
```

[`Cell{:tact}`][cell] 的扩展函数。

计算并返回给定 [`Cell{:tact}`][cell] 的 [标准 `Cell{:tact}` 表示][std-repr] 的 [SHA-256][sha-2] 哈希值的 [`Int{:tact}`][int]。

示例用法：

```tact
let c: Cell = emptyCell();
let fizz: Int = c.hash();
```

## Cell.asSlice

```tact
extends fun asSlice(self: Cell): Slice;
```

[`Cell{:tact}`][cell] 的扩展函数。

将cell转换为[`Slice{:tact}`][slice]并返回。 `self.beginParse(){:tact}` 的别名。

示例用法：

```tact
let c: Cell = emptyCell();
let fizz: Slice = c.asSlice();
```

## Builder.endCell

```tact
extends fun endCell(self: Builder): Cell;
```

[`Builder{:tact}`][builder] 的扩展函数。

将 [`Builder{:tact}`][builder] 转换为普通的 [`cell{:tact}`][cell]。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Cell = b.endCell();
```

## Builder.storeUint

```tact
extends fun storeUint(self: Builder, value: Int, bits: Int): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将一个无符号的 `bits` 位 `value` 存储到 [`Builder{:tact}`][builder] 的副本中，范围为 $0 ≤$ `bits` $≤ 256$。 返回该副本。

尝试存储一个负数 `value` 或提供一个不足或超出范围的 `bits` 数量会抛出异常，错误代码为 [退出代码 5](/zh-cn/book/exit-codes#5): `Integer out of expected range`。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeUint(42, 6);
```

## Builder.storeInt

```tact
extends fun storeInt(self: Builder, value: Int, bits: Int): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将一个有符号的 `bits` 位的 `value` 存储到 [`Builder{:tact}`][builder] 的副本中，范围是 $0 ≤$ `bits` $≤ 257$。 返回该副本。

试图提供一个不足或超出范围的`比特`数时，会出现[退出码5](/zh-cn/book/exit-codes#5)的异常：`Integer out of expected range`。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeUint(42, 7);
```

## Builder.storeBool

```tact
extends fun storeBool(self: Builder, value: Bool): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将[`Bool{:tact}`][bool]`value`存储到[`Builder{:tact}`][builder]的副本中。 如果 `value` 是 `true{:tact}`，则写入 $1$ 作为单个位，否则写入 $0$。 返回 [`Builder{:tact}`][builder] 的副本。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeBool(true);  // writes 1
let buzz: Builder = b.storeBool(false); // writes 0
```

## Builder.storeBit

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun storeBit(self: Builder, value: Bool): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。 [`Builder.storeBool(){:tact}`](#builderstorebool) 的别名。

用法示例：

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeBit(true);  // writes 1
let buzz: Builder = b.storeBit(false); // writes 0
```

## Builder.storeBuilder

```tact
extends fun storeBuilder(self: Builder, other: Builder): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将 [`Builder{:tact}`][builder] `cell` 中的所有数据添加到[`Builder{:tact}`][builder] 的副本中。 返回该副本。

示例用法：

```tact
let b: Builder = beginCell().storeCoins(42);
let fizz: Builder = beginCell().storeBuilder(b);
b.endCell() == fizz.endCell(); // true
```

## Builder.storeSlice

```tact
extends fun storeSlice(self: Builder, cell: Slice): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将[`slice{:tact}`][slice]`cell`存储到[`builder{:tact}`][builder]的副本中。 返回该副本。

示例用法：

```tact
let b: Builder = beginCell();
let s: Slice = emptyCell().asSlice();
let fizz: Builder = b.storeSlice(s);
```

## Builder.storeCoins

```tact
extends fun storeCoins(self: Builder, value: Int): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将一个无符号的 [`Int{:tact}`][int] `value` 存储（序列化）到范围 $0 .. 2^{120} - 1$ 到 [`Builder{:tact}`][builder] 的副本中。 `value` 的序列化由一个 4 位无符号大端整数 `l` 组成，`l` 是满足 `value` $< 2^{8 _ l}$ 的最小整数 $l ≥ 0$，然后是一个 8 _ l 位无符号大端表示的 `value`。 返回 [`Builder{:tact}`][builder] 的副本。

试图存储一个超出范围的`值`时，会出现[退出码5](/zh-cn/book/exit-codes#5)的异常：`Integer out of expected range`。

这是保存 [nanoToncoins](/zh-cn/book/integers#nanotoncoin) 的最常见方式。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeCoins(42);
```

:::note[Useful links:]

  [特殊的 `coins` 序列化类型](/zh-cn/book/integers#serialization-coins)

:::

## Builder.storeAddress

```tact
extends fun storeAddress(self: Builder, address: Address): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将地址存储在 [`Builder{:tact}`][builder] 的副本中。 返回该副本。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeAddress(myAddress());
```

## Builder.storeRef

```tact
extends fun storeRef(self: Builder, cell: Cell): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

将引用 `cell` 存储到 [`Builder{:tact}`][builder] 的副本中。 返回该副本。

由于单个 [`cell{:tact}`][cell] 最多可存储 $4$ 引用，如果尝试存储更多引用，则会出现[退出码 8](/zh-cn/book/exit-codes#8)异常：`Cell overflow`。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeRef(emptyCell());
```

## Builder.storeMaybeRef

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun storeMaybeRef(self: Builder, cell: Cell?): Builder;
```

[`Builder{:tact}`][builder] 的扩展函数。

如果`cell`不是`null{:tact}`, 把 $1$ 作为一个位存储，然后在[`Builder{:tact}`][builder] 中使用 `cell` 。 返回此复制。

如果 `cell` 是 `null{:tact}`，则只将 $0$ 作为单个位存储到 [`Builder{:tact}`][builder] 的副本中。 返回此复制。

由于单个 [`Cell{:tact}`][cell] 最多可以存储 $4$ 个引用，尝试存储更多引用将抛出异常，错误码为 [exit code 8](/zh-cn/book/exit-codes#8)：`Cell overflow`。

用法示例：

```tact
let b: Builder = beginCell();
let fizz: Builder = b
    .storeMaybeRef(emptyCell()) // stores a single 1 bit, then an empty cell
    .storeMaybeRef(null);       // stores only a single 0 bit
```

## Builder.refs

```tact
extends fun refs(self: Builder): Int;
```

[`Builder{:tact}`][builder] 的扩展函数。

以 [`Int{:tact}`][int] 形式返回已存储在 [`Builder{:tact}`][builder] 中的cell引用的数目。

用法示例：

```tact
let b: Builder = beginCell();
let fizz: Int = b.refs(); // 0
```

## Builder.bits

```tact
extends fun bits(self: Builder): Int;
```

[`Builder{:tact}`][builder] 的扩展函数。

以[`Int{:tact}`][int]形式返回已存储在[`builder{:tact}`][builder]中的数据位数。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Int = b.bits(); // 0
```

## Builder.asSlice

```tact
extends fun asSlice(self: Builder): Slice;
```

[`Builder{:tact}`][builder] 的扩展函数。

将[`builder{:tact}`][builder]转换为[`slice{:tact}`][slice]并返回。 `self.endCell().beginParse(){:tact}` 的别名。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Slice = b.asSlice();
```

## Builder.asCell

```tact
extends fun asCell(self: Builder): Cell;
```

[`Builder{:tact}`][builder] 的扩展函数。

将[`Builder{:tact}`][builder]转换为[`Cell{:tact}`][cell]并返回。 `self.endCell(){:tact}` 的别名。

示例用法：

```tact
let b: Builder = beginCell();
let fizz: Cell = b.asCell();
```

## Slice.loadUint

```tact
extends mutates fun loadUint(self: Slice, l: Int): Int;
```

[`Slice{:tact}`][slice] 的扩展突变函数。

从 [`Slice{:tact}`][slice]中加载并返回一个无符号的 `l` 位 [`Int{:tact}`][int]，条件是 $0 ≤$ `l` $≤ 256$。

试图指定一个超出范围的 `l` 值时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeUint(42, 7).asSlice();
let fizz: Int = s.loadUint(7);
```

## Slice.preloadUint

```tact
extends fun preloadUint(self: Slice, l: Int): Int;
```

[`Slice{:tact}`][slice] 的扩展函数。

为 $0 ≤$ `l` $≤ 256$ 从 [`Slice{:tact}`][slice]中预载并返回一个无符号的 `l` 位 [`Int{:tact}`][int]。 不会修改 [`Slice{:tact}`][slice]。

试图指定一个超出范围的 `l` 值时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

尝试预载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9)异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeUint(42, 7).asSlice();
let fizz: Int = s.preloadUint(7);
```

## Slice.loadInt

```tact
extends mutates fun loadInt(self: Slice, l: Int): Int;
```

[`Slice{:tact}`][slice] 的扩展突变函数。

从 [`Slice{:tact}`][slice] 中加载并返回一个有符号的 `l` 位 [`Int{:tact}`][int]，值为 $0 ≤$ `l` $≤ 257$。

试图指定一个超出范围的 `l` 值时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Int = s.loadInt(7);
```

## Slice.preloadInt

```tact
extends fun preloadInt(self: Slice, l: Int): Int;
```

[`Slice{:tact}`][slice] 的扩展函数。

为 $0 ≤$ `l` $≤ 257$ 从 [`Slice{:tact}`][slice]中预载并返回一个有符号的 `l` 位 [`Int{:tact}`][int]。 不会修改 [`slice{:tact}`][slice]。

试图指定一个超出范围的 `l` 值时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

尝试预载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9)异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Int = s.preloadInt(7);
```

## Slice.loadBits

```tact
extends mutates fun loadBits(self: Slice, l: Int): Slice;
```

[`Slice{:tact}`][slice] 的扩展突变函数。

从 [`Slice{:tact}`][slice] 中加载 $0 ≤$ `l` $≤ 1023$ 位，并作为单独的  [`Slice{:tact}`][slice] 返回。

试图指定一个超出范围的 `l` 值时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Slice = s.loadBits(7);
```

## Slice.preloadBits

```tact
extends fun preloadBits(self: Slice, l: Int): Slice;
```

[`Slice{:tact}`][slice] 的扩展函数。

从 [`Slice{:tact}`][slice] 中预载 $0 ≤$ `l` $≤ 1023$ 位，并将其作为单独的 [`Slice{:tact}`][slice] 返回。 不修改原始 [`slice{:tact}`][slice]。

试图指定一个超出范围的 `l` 值时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

尝试预载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9)异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Slice = s.preloadBits(7);
```

## Slice.skipBits

```tact
extends mutates fun skipBits(self: Slice, l: Int);
```

[`Slice{:tact}`][slice]的扩展突变函数。

从 [`Slice{:tact}`][slice] 中加载除第一个 0 ≤$ `l` $≤ 1023$ 位以外的所有位。

试图指定一个超出范围的 `l` 值时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
s.skipBits(5);                   // all but first 5 bits
let fizz: Slice = s.loadBits(1); // load only 1 bit
```

## Slice.loadBool

```tact
extends mutates fun loadBool(self: Slice): Bool;
```

[`Slice{:tact}`][slice]的扩展突变函数。

从[`Slice{:tact}`][slice]加载单个位并返回[`Bool{:tact}`][bool]值。 如果加载的位等于 $1$，则读取 `true{:tact}`，否则读取 `false{:tact}`。

当 [`Bool{:tact}`][bool][`slice{:tact}`][slice]不包含它时，尝试加载此类 [`Bool `][bool]会产生异常，[退出码 8](/zh-cn/book/exit-codes#8)：`Cell overflow`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeBool(true).asSlice();
let fizz: Bool = s.loadBool(); // true
```

## Slice.loadBit

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends mutates fun loadBit(self: Slice): Bool;
```

[`Slice{:tact}`][slice] 的扩展突变函数。 别名为 [`Slice.loadBool(){:tact}`](#sliceloadbool)。

示例用法：

```tact
let s: Slice = beginCell().storeBit(true).asSlice();
let fizz: Bool = s.loadBit(); // true
```

## Slice.loadCoins

```tact
extends mutates fun loadCoins(self: Slice): Int;
```

[`Slice{:tact}`][slice] 的扩展突变函数。

从[`Slice{:tact}`][slice]中加载并返回一个[序列化的](#builderstorecoins)无符号[`Int{:tact}`][int]值，范围为 $0 .. 2^{120} - 1$。此值通常代表 [nanoToncoins](/zh-cn/book/integers#nanotoncoin) 的金额。

当 [`Slice{:tact}`][slice]中不包含[`Int{:tact}`][int]时，尝试加载此类[`Int `][int]会产生异常，[退出码为 8](/zh-cn/book/exit-codes#8)：`Cell overflow`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell overflow`。

用法示例：

```tact
let s: Slice = beginCell().storeCoins(42).asSlice();
let fizz: Int = s.loadCoins();
```

:::note[Useful links:]

  [特殊的 "coin" 序列化类型](/zh-cn/book/integers#serialization-coins)

:::

## Slice.loadAddress

```tact
extends mutates fun loadAddress(self: Slice): Address;
```

[`Slice{:tact}`][slice] 的扩展突变函数。

从 [`Slice{:tact}`][slice] 加载并返回一个[`Address{:tact}`][p]。

当[`Address{:tact}`][p][[`Slice{:tact}`][slice]不包含该地址时，尝试加载该[`地址 `][p]会产生异常，[退出码 8](/zh-cn/book/exit-codes#8)：`Cell overflow`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell underflow`。

示例用法：

```tact
let s: Slice = beginCell().storeAddress(myAddress()).asSlice();
let fizz: Address = s.loadAddress();
```

## Slice.loadRef

```tact
extends mutates fun loadRef(self: Slice): Cell;
```

[`Slice{:tact}`][slice] 的扩展突变函数。

从 [`Slice{:tact}`][slice] 中加载下一个引用作为 [`cell{:tact}`][cell]。

当 [`Cell{:tact}`][cell][`slice{:tact}`][slice]不包含该引用时，尝试加载该引用会产生异常，[退出码 8](/zh-cn/book/exit-codes#8)：`Cell overflow`。

尝试加载的数据超过 [`Slice{:tact}`][slice] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9) 异常：`Cell underflow`。

示例用法：

```tact
let s1: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Cell = s1.loadRef();

let s2: Slice = beginCell()
    .storeRef(emptyCell())
    .storeRef(s1.asCell())
    .asSlice();
let ref1: Cell = s2.loadRef();
let ref2: Cell = s2.loadRef();
ref1 == ref2; // false
```

## Slice.preloadRef

```tact
extends fun preloadRef(self: Slice): Cell;
```

[`Slice{:tact}`][slice] 的扩展函数。

预加载下一个引用从 [`Slice{:tact}`][slice] 为 [`cell{:tact}`][cell] 没有修改原来的 [`Slice{:tact}`][slice]

试图在 [`Slice{:tact}`][slice] 时预加载此引用 [`slice{:tact}`][slice] 不包含一个异常[退出码 8](/zh-cn/book/exit-codes#8)：`Cell overflow`。

试图预加载更多数据超过 [`Slice{:tact}`][slice] 含有异常[export code 9](/zh-cn/book/exit-codes#9)：`Cell underflow`。

示例用法：

```tact
let s1: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Cell = s1.preloadRef(); // didn't modify s1

let s2: Slice = beginCell()
    .storeRef(emptyCell())
    .storeRef(s1.asCell())
    .asSlice();
let ref1: Cell = s2.preloadRef();
let ref2: Cell = s2.preloadRef();
ref1 == ref2; // true
```

## Slice.refs

```tact
extends fun refs(self: Slice): Int;
```

[`Slice{:tact}`][slice] 的扩展函数。

以 [`Int{:tact}`][int]形式返回 [`Slice{:tact}`][slice] 中引用的个数。

示例用法：

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Int = s.refs();
```

## Slice.bits

```tact
extends fun bits(self: Slice): Int;
```

[`slice{:tact}`][slice]的扩展函数。

以 [`Int{:tact}`][int]形式返回 [`Slice{:tact}`][slice] 中的数据位数。

用法示例：

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Int = s.bits();
```

## Slice.empty

```tact
extends fun empty(self: Slice): Bool;
```

[`Slice{:tact}`][slice] 的扩展函数。

检查 [`Slice{:tact}`][slice] 是否为空（即不包含数据位和cell引用）。 如果为空，则返回 `true{:tact}`，否则返回 `false{:tact}`。

用法示例：

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Bool = s.empty();                     // false
let buzz: Bool = beginCell().asSlice().empty(); // true
```

:::note

  与 [`Slice.endParse(){:tact}`](#sliceendparse)不同，即使 [`Slice{:tact}`][slice]为空，该函数也不会抛出任何异常。

:::

## Slice.dataEmpty

```tact
extends fun dataEmpty(slice: Slice): Bool;
```

[`Slice{:tact}`][slice] 的扩展函数。

检查[`slice{:tact}`][slice] 是否没有任何比特的数据。 如果没有数据，则返回 `true{:tact}`，否则返回 `false{:tact}`。

使用示例

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Bool = s.dataEmpty();  // true

let s2: Slice = beginCell().storeInt(42, 7).asSlice();
let buzz: Bool = s2.dataEmpty(); // false
```

## Slice.refsEmpty

```tact
extends fun refsEmpty(slice: Slice): Bool;
```

[`Slice{:tact}`][slice]的扩展函数。

检查 [`Slice{:tact}`][slice] 是否没有引用。 如果没有引用，则返回 `true{:tact}`，否则返回 `false{:tact}`。

用法示例：

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Bool = s.refsEmpty();                     // false
let buzz: Bool = beginCell().asSlice().refsEmpty(); // true
```

## Slice.endParse

```tact
extends fun endParse(self: Slice);
```

[`Slice{:tact}`][slice] 的扩展函数。

检查 [`Slice{:tact}`][slice] 是否为空（即不包含数据位和cell引用）。 如果不是，则抛出异常[退出码 9](/zh-cn/book/exit-codes#9)：`Cell underflow`。

使用示例：

```tact {2,6}
let emptyOne: Slice = emptySlice();
emptyOne.endParse(); // nothing, as it's empty

let paul: Slice = "Fear is the mind-killer".asSlice();
try {
    paul.endParse(); // throws exit code 9
}
```

## Slice.hash

```tact
extends fun hash(self: Slice): Int;
```

[`Slice{:tact}`][slice] 的扩展函数。

计算并返回给定[`Slice{:tact}`][slice]的 [标准 `Cell{:tact}` 表示][std-repr] 的[SHA-256][sha-2]哈希值的[`Int{:tact}`][int]值。

用法示例：

```tact
let s: Slice = beginCell().asSlice();
let fizz: Int = s.hash();
```

## Slice.asCell

```tact
extends fun asCell(self: Slice): Cell;
```

[`Slice{:tact}`][slice] 的扩展函数。

将 [`Slice{:tact}`][slice]转换为 [`Cell{:tact}`][cell]并返回。 别名为 `beginCell().storeSlice(self).endCell(){:tact}`。

用法示例：

```tact
let s: Slice = beginCell().asSlice();
let fizz: Cell = s.asCell();
let buzz: Cell = beginCell().storeSlice(s).endCell();

fizz == buzz; // true
```

## Address.asSlice

```tact
extends fun asSlice(self: Address): Slice;
```

[`Address{:tact}`][p] 的扩展函数。

将 [`Address{:tact}`][p] 转换为[`Slice{:tact}`][slice]并返回。 别名为 `beginCell().storeAddress(self).asSlice(){:tact}`。

用法示例：

```tact
let a: Address = myAddress();
let fizz: Slice = a.asSlice();
let buzz: Slice = beginCell().storeAddress(a).asSlice();

fizz == buzz; // true
```

## Struct.toCell

```tact
extends fun toCell(self: Struct): Cell;
```

任何结构类型 [Struct][struct] 的扩展函数。

将 [Struct][struct] 转换为 [`cell{:tact}`][cell]并返回。

用法示例：

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinCell(): Cell {
    let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
    let fizz: Cell = s.toCell();

    return fizz; // "x{12A11B}"
}
```

## Struct.toSlice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun toSlice(self: Struct): Slice;
```

任何结构类型 [Struct][struct]的扩展函数。

将 [Struct][struct] 转换为 [`Slice{:tact}`][slice] 并返回它。 别名为`self.toCell().asSlice(){:tact}`。

用法示例：

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinSlice(): Slice {
    let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
    let fizz: Slice = s.toSlice();

    return fizz; // "CS{Cell{000612a11b} bits: 0..24; refs: 0..0}"
}
```

## Struct.fromCell

```tact
extends fun fromCell(self: Struct, cell: Cell): Struct;
```

任何结构类型 [Struct][struct] 的扩展函数。

将 [`cell{:tact}`][cell] 转换为指定的 [结构体][struct]，并返回该 [结构体][struct]。

试图传递布局与指定 [Struct][struct] 不同的 [`cell{:tact}`][cell]，或加载的数据超过 [`cell{:tact}`][cell] 所包含的数据时，会出现 [exit code 9](/zh-cn/book/exit-codes#9)异常：`Cell underflow`。

使用示例：

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun directParse(payload: Cell): GuessCoin {
    return GuessCoin.fromCell(payload);
}

fun cautiousParse(payload: Cell): GuessCoin? {
    let coin: GuessCoin? = null;
    try {
        coin = GuessCoin.fromCell(payload);
    } catch (e) {
        dump("Cell payload doesn't match GuessCoin Struct!");
    }
    return coin;
}
```

## Struct.fromSlice

```tact
extends fun fromSlice(self: Struct, cell: Slice): Struct;
```

任何结构类型 [Struct][struct] 的扩展函数。

将 [`Slice{:tact}`][slice] 转换为指定的 [Struct][struct]，并返回该 [Struct][struct]。

尝试传递布局与指定 [结构][struct] 不同的 [`Slice{:tact}`][slice]，或加载比 [`Slice{:tact}`][slice] 包含的数据更多的数据时，会出现[退出码 9](/zh-cn/book/exit-codes#9)异常：`Cell underflow`。

使用示例：

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun directParse(payload: Slice): GuessCoin {
    return GuessCoin.fromSlice(payload);
}

fun cautiousParse(payload: Slice): GuessCoin? {
    let coin: GuessCoin? = null;
    try {
        coin = GuessCoin.fromSlice(payload);
    } catch (e) {
        dump("Slice payload doesn't match GuessCoin Struct!");
    }
    return coin;
}
```

## Message.toCell

```tact
extends fun toCell(self: Message): Cell;
```

任何消息类型 [Message][message] 的扩展函数。

将 [Message][message] 转换为[`cell{:tact}`][cell]并返回。

用法示例：

```tact
message GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinCell(): Cell {
    let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
    let fizz: Cell = s.toCell();

    return fizz; // "x{AB37107712A11B}"
}
```

## Message.toSlice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun toSlice(self: Message): Slice;
```

任何 [Message][message] 类型的扩展函数。

将 [Message][message] 转换为 [`Slice{:tact}`][slice] 并返回它。 别名为`self.toCell().asSlice(){:tact}`。

用法示例：

```tact
message GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinSlice(): Slice {
    let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
    let fizz: Slice = s.toSlice();

    return fizz; // "CS{Cell{000eab37107712a11b} bits: 0..56; refs: 0..0}"
}
```

## Message.fromCell

```tact
extends fun fromCell(self: Message, cell: Cell): Message;
```

任何消息类型 [Message][message] 的扩展函数。

将 [`cell{:tact}`][cell] 转换为指定的 [Message][message]，并返回该 [Message][message]。

尝试传递布局与指定 [Message][message] 不同的[`cell{:tact}`][cell]，或加载的数据超过[`cell{:tact}`][cell]所包含的数据时，会出现[退出码 9](/zh-cn/book/exit-codes#9)的异常：`Cell underflow`。

使用示例：

```tact
message(0x777) TripleAxe {
    prize: Int as uint32;
}

fun directParse(payload: Cell): TripleAxe {
    return TripleAxe.fromCell(payload);
}

fun cautiousParse(payload: Cell): TripleAxe? {
    let coin: TripleAxe? = null;
    try {
        coin = TripleAxe.fromCell(payload);
    } catch (e) {
        dump("Cell payload doesn't match TripleAxe Message!");
    }
    return coin;
}
```

## Message.fromSlice

```tact
extends fun fromSlice(self: Message, cell: Slice): Message;
```

任何 [Message][message] 类型的扩展函数。

将 [`Slice{:tact}`][slice] 转换为指定的 [Message][message]，并返回该 [Message][message]。

试图传递布局不同于指定 [Message][message] 的[`Slice{:tact}`][slice]，或加载的数据多于[`Slice{:tact}`][slice]所包含的数据时，会出现[退出码 9](/zh-cn/book/exit-codes#9)的异常：`Cell underflow`。

使用示例

```tact
message(0x777) TripleAxe {
    prize: Int as uint32;
}

fun directParse(payload: Slice): TripleAxe {
    return TripleAxe.fromSlice(payload);
}

fun cautiousParse(payload: Slice): TripleAxe? {
    let coin: TripleAxe? = null;
    try {
        coin = TripleAxe.fromSlice(payload);
    } catch (e) {
        dump("Slice payload doesn't match TripleAxe Message!");
    }
    return coin;
}
```

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[cell]: /zh-cn/book/cells#cells
[builder]: /zh-cn/book/cells#builders
[slice]: /zh-cn/book/cells#slices
[map]: /zh-cn/book/maps
[struct]: /zh-cn/book/structs-and-messages#structs
[message]: /zh-cn/book/structs-and-messages#messages
[std-repr]: /zh-cn/book/cells#cells-representation
[tlb]: https://docs.ton.org/develop/data-formats/tl-b-language
[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-common.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-common.mdx
================================================
---
title: 常见问题
description: Tact 核心库中的常用全局静态函数
---

最常用的内置 [全局静态函数] 列表(/book/functions#global-static-functions)。

## 上下文

### now

```tact
fun now(): Int
```

返回当前 [Unix 时间](https://en.wikipedia.org/wiki/Unix_time)。

用法示例：

```tact
let timeOffset: Int = now() + 1000; // thousand seconds from now()
```

### myBalance

```tact
fun myBalance(): Int;
```

返回当前交易的 [计算阶段](https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase) 开始时智能合约的 [nano Toncoins](/zh-cn/book/integers#nanotoncoin) 余额。

用法示例：

```tact
let iNeedADolla: Int = myBalance();
```

:::caution

  请注意，Tact 的 [所有信息发送函数](/zh-cn/book/send) 可以更改 _实际_ 合约的余额，但 _不会_ 更新此函数返回的值。

:::

### myAddress

```tact
fun myAddress(): Address;
```

以[`Address{:tact}`][p]的形式返回当前智能合约的地址。

用法示例：

```tact
let meMyselfAndI: Address = myAddress();
```

### sender

```tact
fun sender(): Address;
```

返回当前信息发件人的 [`Address{:tact}`][p]。

用法示例：

```tact
contract MeSee {
    receive() {
        let whoSentMeMessage: Address = sender();
    }
}
```

:::caution

  对于 [getter 函数](/zh-cn/book/contracts#getter-functions)，行为是未定义的，因为它们不能有发送者，也不能发送信息。

:::

:::note

  为了减少 gas 用量，当您只需要知道消息的发件人时，请使用此函数而不是调用 [`context().sender{:tact}`](#context)。

:::

### context

```tact
fun context(): Context;
```

返回 `Context{:tact}` [Struct](/zh-cn/book/structs-and-messages#structs)，包含：

| 字段      | 类型                      | 描述
| :-------- | :------------------------ | :---
| `bounced` | [`Bool{:tact}`][bool]     | 传入消息的[Bounced](https://ton.org/docs/learn/overviews/addresses#bounceable-vs-non-bounceable-addresses) 标志.
| `sender`  | [`Address{:tact}`][p]     | 发送方在 TON 区块链上的内部地址。
| `value`   | [`Int{:tact}`][int]       | 信息中 [nanoToncoins](/zh-cn/book/integers#nanotoncoin) 的数量。
| `raw`     | [`Slice{:tact}`][slice]   | 信息的其余部分作为 [`Slice{:tact}`][slice]。 它遵循 TON 的 [内部消息布局](https://docs.ton.org/develop/smart-contracts/messages#message-layout)，从目标 [`Address{:tact}`][p] (`dest:MsgAddressInt` 在 [TL-B 记法](https://docs.ton.org/develop/data-formats/tl-b-language)) 开始。

示例用法：

```tact
let ctx: Context = context();
require(ctx.value != 68 + 1, "Invalid amount of nanoToncoins, bye!");
```

:::note

  请注意，如果您只需要知道谁发送了信息，请使用 [`sender(){:tact}`](#sender) 函数，因为它耗 gas 量较少。

:::

## Addressing

### newAddress

```tact
fun newAddress(chain: Int, hash: Int): Address;
```

根据[`chain`id](https://ton-blockchain.github.io/docs/#/overviews/TON_blockchain_overview)和[SHA-256](/zh-cn/ref/core-math#sha256)编码的[`hash`值](https://docs.ton.org/learn/overviews/addresses#account-id)创建一个新的[`Address{:tact}`][p]。

此函数试图尽可能解析 [compile-time](/zh-cn/ref/core-comptime) 中的常数值。

示例用法：

```tact
let oldTonFoundationAddr: Address =
    newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
    //         ↑  ------------------------------------------------------------------
    //         |  ↑
    //         |  sha-256 hash of contract's init package (StateInit)
    //         chain id: 0 is a workchain, -1 is a masterchain
```

:::caution

  如果 `chain` 无效，该方法会抛出错误[退出码 136](/zh-cn/book/exit-codes#136)；如果 `chain` 指向主链 ($-1$) 且未启用[主链支持](/zh-cn/book/masterchain)，该方法会抛出错误[退出码 137](/zh-cn/book/exit-codes#137)。

:::

:::note[Useful links:]

  [TON文档中的`chain`（工作链ID）](https://docs.ton.org/learn/overviews/addresses#workchain-id)\
  [TON文档中的`hash`（账户ID）](https://docs.ton.org/learn/overviews/addresses#account-id)\
  [合约的初始包（`StateInit{:tact}`）](/zh-cn/book/expressions#initof)

:::

### contractAddress

```tact
fun contractAddress(s: StateInit): Address;
```

根据智能合约的 [`StateInit{:tact}`](/zh-cn/book/expressions#initof)，计算智能合约在工作链 $0$ 中的 [`Address{:tact}`][p]。

示例用法：

```tact
let foundMeSome: Address = contractAddress(initOf SomeContract());
```

### contractAddressExt

```tact
fun contractAddressExt(chain: Int, code: Cell, data: Cell): Address;
```

根据 `chain` id、合约 `code` 和合约初始状态 `data` 计算智能合约的 [`Address{:tact}`][p]。 使用 [`initOf{:tact}`](/zh-cn/book/expressions#initof)表达式获取给定合约的初始 `code` 和初始 `data` 。

用法示例：

```tact
let initPkg: StateInit = initOf SomeContract();
let hereBeDragons: Address = contractAddressExt(0, initPkg.code, initPkg.data);
```

:::caution

  如果 `chain` 无效，该方法会抛出错误[退出码 136](/zh-cn/book/exit-codes#136)；如果 `chain` 指向主链 ($-1$) 且未启用[主链支持](/zh-cn/book/masterchain)，该方法会抛出错误[退出码 137](/zh-cn/book/exit-codes#137)。

:::

:::note

  要使用该功能，必须在 [configuration file](/zh-cn/book/config).
  中为当前项目将编译器选项 `debug` 设置为 `true{:tact}`：[调试](/zh-cn/book/debug)。

:::

## 通信

### send

```tact
fun send(params: SendParameters);
```

[排序消息](/zh-cn/book/send#outbound-message-processing)，以便使用 [`SendParameters{:tact}`](/zh-cn/book/send) [结构体](/zh-cn/book/structs-and-messages#structs) 发送。

示例用法：

```tact
send(SendParameters {
    to: sender(),    // back to the sender,
    value: ton("1"), // with 1 Toncoin (1_000_000_000 nanoToncoin),
                     // and no message body
});
```

:::note[Useful links:]

  [Sending messages in the Book](/zh-cn/book/send)\
  [Message `mode` in the Book](/zh-cn/book/message-mode)\
  [Single-contract communication in the Cookbook](/zh-cn/cookbook/single-communication)

:::

### emit

```tact
fun emit(body: Cell);
```

[将消息排序的](/zh-cn/book/send#outbound-message-processing) `body` 发送到外部世界，目的是进行日志记录并在链外进行后续分析。 该信息没有收件人，与使用 Tact 的其他信息发送功能相比更省 gas。

使用示例

```tact
emit("Catch me if you can, Mr. Holmes".asComment()); // asComment() converts a String to a Cell
```

:::note

  要分析 `emit(){:tact}` 调用，必须查看合约产生的 [外部信息](/zh-cn/book/external)。

  了解更多信息：[通过 `emit(){:tact}`记录日志](/zh-cn/book/debug#logging)。

:::

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[slice]: /zh-cn/book/cells#slices



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-comptime.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-comptime.mdx
================================================
---
title: 编译时 (Compile-time)
description: Tact 核心库中的各种编译时全局函数
---

import { Badge } from '@astrojs/starlight/components';

此页面列出了所有内置的[全局静态函数](/zh-cn/book/functions#global-static-functions)，这些函数在构建 Tact 项目时进行求值，并且无法与非常量的运行时数据一起使用。 这些函数通常被称为 "编译时函数(compile-time functions)"。

## address

```tact
fun address(s: String): Address;
```

编译时函数，用于将包含地址的 [`String{:tact}`][p] 转换为 [`Address{:tact}`][p] 类型，并嵌入到合约中。

示例用法：

```tact
contract Example {
    // Persistent state variables
    addr: Address =
        address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"); // works at compile-time!
}
```

:::note

  Tact 中的 `address("...Address...."){:tact}` 相当于 FunC 中的 `"...Address.... "a{:func}`。

:::

## cell

```tact
fun cell(bocBase64: String): Cell;
```

编译时函数，用于将 base64 编码的[BoC][boc] `bocBase64` 作为[`Cell{:tact}`][cell]嵌入到合约中。

使用示例：

```tact
contract Example {
    // Persistent state variables
    stored: Cell =
        // Init package for Wallet V3R1 as a base64-encoded BoC
        cell("te6cckEBAQEAYgAAwP8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVD++buA="); // works at compile-time!
}
```

## slice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun slice(bocBase64: String): Slice;
```

编译时函数，将 base64 编码的 [BoC][boc] `bocBase64` 作为 [`Slice{:tact}`][slice] 嵌入到合约中。

使用示例：

```tact
contract Example {
    // Persistent state variables
    stored: Slice =
        // Works at compile-time!
        slice("te6cckEBAQEADgAAGEhlbGxvIHdvcmxkIXgtxbw="); // Hello world!
}
```

## rawSlice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun rawSlice(hex: String): Slice;
```

编译时函数，用于将`hex` [`String{:tact}`][p] 的内容转换为 [`slice{:tact}`][slice]的十六进制编码和可选的位填充内容。

如果 [`String{:tact}`][p] 的末尾有下划线 `_`，则内容将以位填充。 填充去掉了所有尾部的零和前面的最后一个 $1$ 位：

```tact
// Not bit-padded
rawSlice("4a").loadUint(8); // 74, or 1001010 in binary

// Bit-padded
rawSlice("4a_").loadUint(6); // 18, or 10010 in binary
```

请注意，该功能是有限的，最多只能指定 $1023$ 位。

示例用法：

```tact
contract Example {
    // Persistent state variables
    stored: Slice =
        rawSlice("000DEADBEEF000");  // CS{Cell{03f...430} bits: 588..644; refs: 1..1}
    bitPadded: Slice =
        rawSlice("000DEADBEEF000_"); // CS{Cell{03f...e14} bits: 36..79; refs: 0..0}
}
```

:::note

  Tact 中的 `rawSlice("...Hex contents..."){:tact}` 相当于 FunC 中的 `"...Hex contents..."s{:func}`。

:::

## ascii

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun ascii(str: String): Int;
```

编译时函数，用于将 `str` 中字符的十六进制值连接成一个，并将生成的 [`Int{:tact}`][int] 嵌入到合约中。 仅适用于最多占用 $32$ 字节的字符串，即最多可表示 $32$ [ASCII 码](https://en.wikipedia.org/wiki/ASCII#Control_code_chart) 或 $8$ $4$- 字节 [Unicode 码点](https://en.wikipedia.org/wiki/List_of_Unicode_characters)。

用法示例：

```tact
contract Example {
    // Persistent state variables
    a: Int = ascii("a");            // 97 or 0x61, one byte in total
    zap: Int = ascii("⚡");         // 14850721 or 0xE29AA1, 3 bytes in total
    doubleZap: Int = ascii("⚡⚡"); // 249153768823457 or 0xE29AA1E29AA1, 6 bytes in total
}
```

:::note

  Tact 中的 `ascii("...String contents..."){:tact}` 相当于 FunC 中的 `"...String contents..."u{:func}`。

:::

## crc32

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun crc32(str: String): Int;
```

编译时函数，使用 [CRC-32](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) 算法计算校验和，并将计算结果 [`Int{:tact}`][int] 值嵌入到合约中。

用法示例：

```tact
contract Example {
    // Persistent state variables
    checksum: Int = crc32("000DEADBEEF000"); // 1821923098
}
```

:::note

  Tact 中的 `crc32("...String contents..."){:tact}` 等同于 FunC 中的 `"...String contents..."c{:func}`。

:::

## ton

```tact
fun ton(value: String): Int;
```

一个编译时函数，将给定的 Toncoin `value` 从人类可读格式 [`String{:tact}`][p] 转换为 [nanoToncoin](/zh-cn/book/integers#nanotoncoin) [`Int{:tact}`][int] 格式。

用法示例：

```tact
contract Example {
    // Persistent state variables
    one: Int = ton("1");            // one Toncoin, which is equivalent to 10^9 nanoToncoins
    pointOne: Int = ton("0.1");     // 0.1 Toncoin, which is equivalent to 10^8 nanoToncoins
    nano: Int = ton("0.000000001"); // 10^-9 Toncoins, which is equivalent to 1 nanoToncoin
                                    // works at compile-time!
}
```

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[cell]: /zh-cn/book/cells#cells
[slice]: /zh-cn/book/cells#slices
[boc]: /zh-cn/book/cells#cells-boc
[crc]: https://en.wikipedia.org/wiki/Cyclic_redundancy_check



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-debug.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-debug.mdx
================================================
---
title: 调试
description: Tact 核心库中的各种调试功能
---

Tact 中调试智能合约常用的函数列表。

:::note

  有关调试的更多信息，请访问专用页面：[调试](/zh-cn/book/debug)。

:::

## require

```tact
fun require(condition: Bool, error: String);
```

检查 `condition` 并抛出错误，如果 `condition` 为 `false{:tact}`，则从 `error` 消息中生成 [exit code](/zh-cn/book/exit-codes)。 除此之外，别无其他作用。

生成退出码的算法如下：

- 首先，获取`错误`报文 [`String{:tact}`][p] 的[SHA-256](https://en.wikipedia.org/wiki/SHA-2#Hash_standard) 哈希值。
- 然后，它的值被作为一个32位的 [大端](https://en.wikipedia.org/wiki/Endianness) 数字读取，计算方式是对 $63000$ 取模后加上 $1000$，按此顺序进行。
- 最后，它将被放入 `.md` 编译报告文件，该文件与其他编译工件一起存放在项目的 `outputs/` 或 `build/` 目录中。

保证生成的退出码不在为 TVM 和 Tact 合约错误保留的常用 $0 - 255$ 范围内，这样就可以将退出码与 `require(){:tact}` 和任何其他 [标准退出码](/zh-cn/book/exit-codes) 区分开来。

示例用法：

```tact
// now() has to return a value greater than 1000, otherwise an error message will be thrown
require(now() > 1000, "We're in the first 1000 seconds of 1 January 1970!");

try {
    // The following will never be true, so this require would always throw
    require(now() < -1, "Time is an illusion. Lunchtime doubly so.");
} catch (e) {
    // e will be outside of range 0-255
    dump(e);
}
```

## dump

```tact
fun dump(arg);
```

将参数 `arg` 打印到合约的调试控制台。 仅当[配置文件](/zh-cn/book/config) 中的 "debug "选项设置为 `true{:json}` 时才进行评估，否则不执行任何操作。

可应用于下列类型和值：

- [`Int{:tact}`][int]
- [`Bool{:tact}`][bool]
- [`Address{:tact}`][p]
- [`Cell{:tact}`][cell], [`Builder{:tact}`][builder] 或 [`Slice{:tact}`][slice]
- [`String{:tact}`][p]
- [`map<K, V>{:tact}`](/zh-cn/book/maps)
- [Optionals 和 `null{:tact}` value](/zh-cn/book/optionals)
- `void`，当函数没有定义返回值时隐式返回

示例用法：

```tact
// Int
dump(42);

// Bool
dump(true);
dump(false);

// Address
dump(myAddress());

// Cell, Builder or Slice
dump(emptyCell());  // Cell
dump(beginCell());  // Builder
dump(emptySlice()); // Slice

// String
dump("Hello, my name is...");

// Maps
let m: map<Int, Int> = emptyMap();
m.set(2 + 2, 4);
dump(m);

// Special values
dump(null);
dump(emit("msg".asComment())); // As emit() function doesn't return a value, dump() would print #DEBUG#: void.
```

:::note[Useful links:]

  [使用 `dump(){:tact}` 调试](/zh-cn/book/debug#tests-dump)

:::

## dumpStack

```tact
fun dumpStack();
```

将 [持久状态变量](/zh-cn/book/contracts#variables)的所有值打印到合约的调试控制台。 仅当[配置文件](/zh-cn/book/config) 中的 "debug "选项设置为 `true{:json}` 时才进行评估，否则不执行任何操作。

用法示例：

```tact {6}
contract DumpsterFire {
    var1: Int = 0;
    var2: Int = 5;

    receive() {
        dumpStack(); // would print 0 5
    }
}
```

:::note[Useful links:]

  [使用 `dump(){:tact}` 调试](/zh-cn/book/debug#tests-dump)

:::

## throw

```tact
fun throw(code: Int);
```

是 [`nativeThrow(){:tact}`](#nativethrow)的别名。

## nativeThrow

```tact
fun nativeThrow(code: Int);
```

抛出错误代码等于 `code` 的异常。 当前上下文的执行将停止（`nativeThrow` 后的语句将不会执行），控制权将传递给调用栈中的第一个[`try...catch{:tact}`块](/zh-cn/book/statements#try-catch)。 如果调用者函数中不存在 `try{:tact}` 或 `try...catch{:tact}` 块，[TVM](https://docs.ton.org/learn/tvm-instructions/tvm-overview)将终止事务。

试图在 $0 - 65535$ 范围之外指定 `code` 时，会出现 [exit code 5](/zh-cn/book/exit-codes#5)异常：`Integer out of expected range`。

示例用法：

```tact {2,7}
fun thisWillTerminate() {
    nativeThrow(1042); // throwing with exit code 1042
}

fun butThisDoesNot() {
    try {
        nativeThrow(1042); // throwing with exit code 1042
    }

    // ... follow-up logic ...
}
```

## nativeThrowIf

```tact
fun nativeThrowIf(code: Int, condition: Bool);
```

类似于 [`nativeThrow(){:tact}`](#nativethrow)，但会在 `condition` 等于 `true{:tact}` 时有条件地抛出异常。 否则不会抛出。

试图在 $0 - 65535$ 范围之外指定 `code` 时，会出现 [exit code 5](/zh-cn/book/exit-codes#5) 异常：`Integer out of expected range`。

示例用法：

```tact {2,7}
fun thisWillTerminate() {
    nativeThrowIf(1042, true); // throwing with exit code 1042
}

fun butThisDoesNot() {
    try {
        nativeThrowIf(1042, true); // throwing with exit code 1042
    }
    // ... follow-up logic ...
}
```

## nativeThrowUnless

```tact
fun nativeThrowUnless(code: Int, condition: Bool);
```

类似于 [`nativeThrow(){:tact}`](#nativethrow)，但会在 `condition` 等于 `false{:tact}` 时有条件地抛出异常。 否则不会抛出。

试图在 $0 - 65535$ 范围之外指定 `code` 时，会出现 [exit code 5](/zh-cn/book/exit-codes#5) 异常：`Integer out of expected range`。

使用示例：

```tact {2,7}
fun thisWillTerminate() {
    nativeThrowUnless(1042, false); // throwing with exit code 1042
}

fun butThisDoesNot() {
    try {
        nativeThrowUnless(1042, false); // throwing with exit code 1042
    }
    // ... follow-up logic ...
}
```

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[cell]: /zh-cn/book/cells#cells
[builder]: /zh-cn/book/cells#builders
[slice]: /zh-cn/book/cells#slices



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-math.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-math.mdx
================================================
---
title: 数学
description: Tact 核心库中的各种数学辅助函数
---

各种数学辅助函数

## min

```tact
fun min(x: Int, y: Int): Int;
```

计算并返回两个 [`Int{:tact}`][int]值 `x` 和 `y` 的 [最小值](https://en.wikipedia.org/wiki/Maximum_and_minimum)。

使用示例

```tact
min(1, 2);        // 1
min(2, 2);        // 2
min(007, 3);      // 3
min(0x45, 3_0_0); // 69, nice
//  ↑     ↑
//  69    300
```

## max

```tact
fun max(x: Int, y: Int): Int;
```

计算并返回两个 [`Int{:tact}`][int]值 `x` 和 `y` 的 [最大值](https://en.wikipedia.org/wiki/Maximum_and_minimum)。

使用示例：

```tact
max(1, 2);        // 2
max(2, 2);        // 2
max(007, 3);      // 7
max(0x45, 3_0_0); // 300
//  ↑     ↑
//  69    300
```

## abs

```tact
fun abs(x: Int): Int
```

计算并返回[`Int{:tact}`][int]值 `x` 的[绝对值](https://en.wikipedia.org/wiki/Absolute_value)。

使用示例：

```tact
abs(42);        // 42
abs(-42);       // 42
abs(-(-(-42))); // 42
```

## log

```tact
fun log(num: Int, base: Int): Int;
```

计算并返回数字 `num` $> 0$ 以 `base` $≥1$ 为底的 [logarithm](https://en.wikipedia.org/wiki/Logarithm) 值。 结果[四舍五入](https://en.wikipedia.org/wiki/Rounding#Rounding_down)。 传入一个非正数 `num` 值或 `base` 小于 $1$ 会产生错误[退出码 5](/zh-cn/book/exit-codes#5)：`Integer out of expected range`。

示例用法：

```tact
log(1000, 10); // 3, as 10^3 is 1000
//  ↑     ↑             ↑       ↑
//  num   base          base    num

log(1001, 10);  // 3
log(999, 10);   // 2
try {
  log(-1000, 10); // throws exit code 5 because of the non-positive num
}
log(1024, 2);   // 10
try {
  log(1024, -2);  // throws exit code 5 because of the base less than 1
}
```

:::note

  请注意，如果只需要获取以 $2$为底的对数，请使用 [`log2(){:tact}`](#log2)函数，因为它更省 gas。

:::

## log2

```tact
fun log2(num: Int): Int;
```

类似于 [`log(){:tact}`](#log)，但将 `base` 设为 $2$。

示例用法：

```tact
log2(1024); // 10, as 2^10 is 1024
//   ↑                ↑       ↑
//   num              base₂   num
```

:::note

  为了减少 gas 用量，当您只需要获取以 $2$为底的对数时，最好使用该函数，而不是调用 [`log(){:tact}`](#log)。

:::

## pow

```tact
fun pow(base: Int, exp: Int): Int;
```

计算并返回涉及两个数字的 [指数运算](https://en.wikipedia.org/wiki/Exponentiation)：`base` 和指数（或 _幂_）`exp`。 指数 `exp` 必须是非负数，否则将产生[退出码 5](/zh-cn/book/exit-codes#5)错误：`Integer out of expected range`。

请注意，该函数在运行时和[编译时](/zh-cn/ref/core-comptime)均有效。

示例用法：

```tact
contract Example {
    // Persistent state variables
    p23: Int = pow(2, 3); // raises 2 to the 3rd power, which is 8
    one: Int = pow(5, 0); // raises 5 to the power 0, which always produces 1
                          // works at compile-time!

    // Internal message receiver, which accepts message ExtMsg
    receive() {
        pow(self.p23, self.one + 1); // 64, works at run-time too!
        pow(0, -1);                  // ERROR! Exit code 5: Integer out of expected range
    }
}
```

:::note

  注意，如果只需要获取 $2$的幂，请使用 [`pow2(){:tact}`](#pow2)函数，因为它更省 gas。

:::

:::note

  仅在编译时工作的函数列表：[API Comptime](/zh-cn/ref/core-comptime)。

:::

## pow2

```tact
fun pow2(exp: Int): Int;
```

与 [`pow(){:tact}`](#pow) 类似，但将 `base` 设为 $2$。 在运行时和 [编译时](/zh-cn/ref/core-comptime) 均可使用。

示例用法：

```tact
contract Example {
    // Persistent state variables
    p23: Int = pow2(3); // raises 2 to the 3rd power, which is 8
    one: Int = pow2(0); // raises 2 to the power 0, which always produces 1
                        // works at compile-time!

    // Internal message receiver, which accepts message ExtMsg
    receive() {
        pow2(self.one + 1); // 4, works at run-time too!
        pow2(-1);           // ERROR! Exit code 5: Integer out of expected range
    }
}
```

:::note

  为了减少 gas 用量，当您只需要获取 $2$的幂时，最好使用该函数，而不是调用 [`pow(){:tact}`](#pow) 。

:::

:::note

  仅在编译时工作的函数列表：[API Comptime](/zh-cn/ref/core-comptime)。

:::

## checkSignature

```tact
fun checkSignature(hash: Int, signature: Slice, public_key: Int): Bool;
```

检查 $256$ 位无符号 [`Int{:tact}`][int] `hash` 的 [Ed25519][ed] `signature`，使用 `public_key`，它也是一个 $256$ 位无符号 [`Int{:tact}`][int]。 签名必须包含至少 $512$ 位数据，但只使用前 $512$ 位。

如果签名有效，则返回 `true{:tact}`，否则返回 `false{:tact}`。

示例用法：

```tact {19-24}
message ExtMsg {
    signature: Slice;
    data: Cell;
}

contract Showcase {
    // Persistent state variables
    pub: Int as uint256; // public key as an 256-bit unsigned Int

    // Constructor function init(), where all the variables are initialized
    init(pub: Int) {
        self.pub = pub; // storing the public key upon contract initialization
    }

    // External message receiver, which accepts message ExtMsg
    external(msg: ExtMsg) {
        let hash: Int = beginCell().storeRef(msg.data).endCell().hash();
        let check: Bool = checkSignature(hash, msg.signature, self.pub);
        //                               ----  -------------  --------
        //                               ↑     ↑              ↑
        //                               |     |              public_key, stored in our contract
        //                               |     signature, obtained from the received message
        //                               hash, calculated using the data from the received message
        // ... follow-up logic ...
    }
}
```

## checkDataSignature

```tact
fun checkDataSignature(data: Slice, signature: Slice, public_key: Int): Bool;
```

检查 `data` 的 [Ed25519][ed] `signature`，使用 `public_key`，类似于 [`checkSignature(){:tact}`](#checksignature)。 如果 `data` 的位长不能被 $8$整除，该函数将产生错误[退出码 9](/zh-cn/book/exit-codes#9)：`Cell underflow`。 验证本身是间接进行的：根据  `data` 的[SHA-256][sha-2] 哈希值进行验证。

如果签名有效，则返回 `true{:tact}`，否则返回 `false{:tact}`。

示例用法：

```tact
let data: Slice = some_data;
let signature: Slice = some_signature;
let publicKey: Int = 42;

let check: Bool = checkSignature(data, signature, publicKey);
```

## sha256

```tact
fun sha256(data: Slice): Int;
fun sha256(data: String): Int;
```

从传递的 [`Slice{:tact}`][slice] 或 [`String{:tact}`][p]`data`计算[SHA-256][sha-2] 哈希值，并以 $256$-bit 无符号 [`Int{:tact}`][int]的形式返回。

如果 `data` 是一个 [`String{:tact}`][p]，它的位数应能被 $8$除，如果它是一个 [`Slice{:tact}`][slice]，它**也必须**没有引用（即总共只有最多 $1023$ 位数据）。 该函数尽可能在 [编译时](/zh-cn/ref/core-comptime) 解析常量字符串值。

:::caution

  如果[`String{:tact}`][p] 值在[编译时间](/zh-cn/ref/core-comptime)期间无法解析，则哈希值是由 [TVM][tvm] 本身在运行时计算的。 注意，通过 [TVM][tvm] 对超过 $128$ 字节的字符串进行哈希处理时，如果它们的前 $128$ 字节相同，可能会导致碰撞。

  因此，选择尽可能使用静态的字符串。 如有疑问，请使用长度不超过 $128$ 字节的字符串。

:::

使用示例：

```tact
sha256(beginCell().asSlice());
sha256("Hello, world!"); // will be resolved in compile-time
sha256(someVariableElsewhere); // will try to resolve at compile-time,
                               // and fallback to run-time evaluation
```

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[slice]: /zh-cn/book/cells#slices
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[ed]: https://en.wikipedia.org/wiki/EdDSA#Ed25519
[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-random.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-random.mdx
================================================
---
title: 随机数生成
description: Tact 核心库中的各种随机数生成函数
---

为 Tact 智能合约生成随机数。

## random

```tact
fun random(min: Int, max: Int): Int;
```

生成并返回一个新的伪随机无符号 [`Int{:tact}`][int] 值 `x`，该值位于提供的半闭区间内：`min` $≤$ `x` $<$ `max`，或者当 `min` 和 `max` 都是负数时，`min` $≥$ `x` $>$ `max`。 请注意，`max`值从未包含在区间内。

示例用法：

```tact
random(42, 43); // 42, always
random(0, 42);  // 0-41, but never a 42
```

## randomInt

```tact
fun randomInt(): Int;
```

生成并返回一个新的伪随机无符号 $256$-bit [`Int{:tact}`][int]值 `x`。

算法如下：如果 `r` 是随机种子的旧值，认为它是一个 $32$ 字节的数组（通过构建无符号 $256$ 位 [`Int{:tact}`][int] 的大端表示），那么计算其 `sha512(r){:tact}`。 哈希值的前 $32$ 字节作为随机种子的新值 `r'` 存储，其余 $32$ 字节作为下一个随机值 `x` 返回。

用法示例：

```tact
let allYourRandomBelongsToUs: Int = randomInt(); // ???, it's random :)
```

:::caution

  用于处理随机数的高级函数列在一个专门页面上：[高级应用程序接口](/zh-cn/ref/core-advanced)。

:::

[int]: /zh-cn/book/integers



================================================
FILE: docs/src/content/docs/zh-cn/ref/core-strings.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/core-strings.mdx
================================================
---
title: 字符串(Strings)和字符串构造器(StringBuilders)
description: Tact 核心库中的各种字符串和字符串构建函数
---

字符串是不可更改的字符序列，这意味着 [`String{:tact}`][p]一旦创建，就不能更改。 字符串可用于存储文本，因此可将其转换为[`cell{:tact}`][cell]类型，用作信息体。

要以省 gas 的方式连接字符串，请使用 [`StringBuilder{:tact}`][p]。

要直接使用 [`String{:tact}`][p]字面量，请参阅：[字符串字面量](/zh-cn/book/expressions#string-literals)。

## beginString

```tact
fun beginString(): StringBuilder;
```

创建并返回空 [`StringBuilder{:tact}`][p]。

示例用法：

```tact
let fizz: StringBuilder = beginString();
```

## beginComment

```tact
fun beginComment(): StringBuilder;
```

创建并返回一个空的 [`StringBuilder{:tact}`][p]，用于生成注释字符串，并在生成的 [`String{:tact}`][p] 前加上四个空字节。 这种格式用于传递文本注释作为报文正文。

使用示例

```tact
let fizz: StringBuilder = beginComment();
```

## beginTailString

```tact
fun beginTailString(): StringBuilder;
```

创建并返回一个空的 [`StringBuilder{:tact}`][p]，用于生成尾字符串，并在生成的 [`String{:tact}`][p] 前加上一个空字节。 这种格式在 NFT 或 Jetton 等各种标准中都有使用。

示例用法：

```tact
let fizz: StringBuilder = beginTailString();
```

## beginStringFromBuilder

```tact
fun beginStringFromBuilder(b: StringBuilder): StringBuilder;
```

从现有的 [`StringBuilder{:tact}`][p] `b` 创建并返回一个新的 [`StringBuilder{:tact}`][p]。 当您需要将现有的 [`String{:tact}`][p] 序列化为 [`cell{:tact}`][cell]，并加上一些其他数据时非常有用。

示例用法：

```tact
let fizz: StringBuilder = beginStringFromBuilder(beginString());
```

## StringBuilder.append

```tact
extends mutates fun append(self: StringBuilder, s: String);
```

用于 [`StringBuilder{:tact}`][p] 的扩展突变函数。

将 [`String{:tact}`][p] `s` 追加到 [`StringBuilder{:tact}`][p]。

示例用法：

```tact
let fizz: StringBuilder = beginString();
fizz.append("oh");
fizz.append("my");
fizz.append("Tact!");
```

## StringBuilder.concat

```tact
extends fun concat(self: StringBuilder, s: String): StringBuilder;
```

[`StringBuilder{:tact}`][p] 的扩展函数。

与 [`String{:tact}`][p] `s` 连接后，返回一个新的 [`StringBuilder{:tact}`][p]。 与 [`StringBuilder.append(){:tact}`](#stringbuilderappend)不同，可以进行链式操作。

示例用法：

```tact
let fizz: StringBuilder = beginString()
    .concat("oh")
    .concat("my")
    .concat("Tact!");
```

## StringBuilder.toString

```tact
extends fun toString(self: StringBuilder): String;
```

[`StringBuilder{:tact}`][p]的扩展函数。

返回从 [`StringBuilder{:tact}`][p]构建的 [`String{:tact}`][p]。

示例用法：

```tact
let fizz: StringBuilder = beginString();
let buzz: String = fizz.toString();
```

## StringBuilder.toCell

```tact
extends fun toCell(self: StringBuilder): Cell;
```

[`StringBuilder{:tact}`][p]的扩展函数。

返回由 [`StringBuilder{:tact}`][p]组装的 [`cell{:tact}`][cell]。

示例用法：

```tact
let fizz: StringBuilder = beginString();
let buzz: Cell = fizz.toCell();
```

## StringBuilder.toSlice

```tact
extends fun toSlice(self: StringBuilder): Slice;
```

[`StringBuilder{:tact}`][p] 的扩展函数。

从 [`StringBuilder{:tact}`][p] 返回一个组装好的 [`cell{:tact}`][cell] 作为 [`Slice{:tact}`][slice]。 别名为 [`self.toCell().asSlice(){:tact}`](/zh-cn/ref/core-cells#cellasslice)。

用法示例：

```tact
let s: StringBuilder = beginString();
let fizz: Slice = s.toSlice();
let buzz: Slice = s.toCell().asSlice();

fizz == buzz; // true
```

## String.asSlice

```tact
extends fun asSlice(self: String): Slice;
```

[`String{:tact}`][p] 的扩展函数。

从[`String{:tact}`][p]返回一个[`Slice{:tact}`][slice]，方法是尝试将其所有位打包到一个连续的[cell][p]列表中，每个cell引用下一个cell，并为将来的解析打开所有cell。

请注意，[`Slice{:tact}`][slice]中没有说明特定字符可能占用多少字节，也没有说明引用列表的深度，因此只有在知道自己在做什么的情况下才能使用该函数。

用法示例：

```tact
let s: String = "It's alive! It's alive!!!";
let fizz: Slice = s.asSlice();
let buzz: Slice = s.asSlice().asString().asSlice();

fizz == buzz; // true, but be careful as it's not always the case
```

:::note

  查看 `String.asSlice{:tact}` 函数如何实际使用：[如何将 `String` 转换为 `Int`](/zh-cn/cookbook/type-conversion#how-to-convert-a-string-to-an-int).

:::

## String.asComment

```tact
extends fun asComment(self: String): Cell;
```

[`String{:tact}`][p] 的扩展函数。

从 [`String{:tact}`][p] 返回一个 [`cell{:tact}`][cell]，在后者的前缀加上四个空字节。 此格式用于将文本评论作为消息正文传递。

用法示例：

```tact
let s: String = "When life gives you lemons, call them 'yellow oranges' and sell them for double the price.";
let fizz: Cell = s.asComment();

let b: StringBuilder = beginComment();
b.append(s);
let buzz: Cell = b.toCell();

fizz == buzz; // true
```

## String.fromBase64

```tact
extends fun fromBase64(self: String): Slice;
```

[`String{:tact}`][p] 的扩展函数。

从解码后的 [Base64](https://en.wikipedia.org/wiki/Base64) [`String{:tact}`][p]中返回 [`Slice{:tact}`][slice]。 别名为 `self.asSlice().fromBase64(){:tact}`。

请注意，该函数是有限制的，只能从给定的 [`String{:tact}`][p] 中获取前 $1023$ 位数据，当 [`String{:tact}`][p] 较大（即包含超过 $1023$ 位数据）时，不会抛出异常。

如果给定的 [`String{:tact}`][p] 包含不属于 Base64 集的字符，则会出现[退出码 134](/zh-cn/book/exit-codes#134)异常：`Invalid argument`。

用法示例：

```tact
let s: String = "SGVyZSdzIEpvaG5ueSE=";
let fizz: Slice = s.fromBase64();
let buzz: Slice = s.asSlice().fromBase64();

fizz == buzz; // true
```

## Slice.asString

```tact
extends fun asString(self: Slice): String;
```

[`Slice{:tact}`][slice] 的扩展函数。

从 [`String{:tact}`][p] 返回一个 [`Slice{:tact}`][slice]，方法是尝试加载它的所有位，而不查找它的引用（如果有的话）。

请注意，该函数根本不查看引用，而且会将输出截断到 $1023$ 位，因此只有在知道自己在做什么的情况下才使用它。

用法示例：

```tact
let s: String = "Keep your Slices close, but your Strings closer.";
let fizz: String = s;
let buzz: String = s.asSlice().asString();

fizz == buzz; // true, but be careful as it's not always the case
```

## Slice.fromBase64

```tact
extends fun fromBase64(self: Slice): Slice;
```

[`Slice{:tact}`][slice] 的扩展函数。

从解码后的 [Base64](https://en.wikipedia.org/wiki/Base64) [`Slice{:tact}`][slice]返回一个新的 [`Slice{:tact}`][slice]。

请注意，该函数是有限制的，只能从给定的 [`Slice{:tact}`][slice] 中获取前 $1023$ 位数据，如果 [`Slice{:tact}`][slice] 有更多数据（即有任何引用），则不会抛出异常。

如果给定的 [`Slice{:tact}`][p]包含不属于 Base64 集的字符，将产生[退出码 134](/zh-cn/book/exit-codes#134)异常：`Invalid argument`。

用法示例：

```tact
let s: Slice = "SSBhbSBHcm9vdC4=".asSlice();
let fizz: Slice = s.fromBase64();
```

## Int.toString

```tact
extends fun toString(self: Int): String;
```

[`Int{:tact}`][int] 的扩展函数。

从 [`Int{:tact}`][int] 值返回 [`String{:tact}`][p]。

用法示例：

```tact
let fizz: String = (84 - 42).toString();
```

## Int.toFloatString

```tact
extends fun toFloatString(self: Int, digits: Int): String;
```

[`Int{:tact}`][int] 的扩展函数。

返回一个 [`String{:tact}`][p]，它是通过 [`Int{:tact}`][int] 值使用 [定点表示法](https://en.wikipedia.org/wiki/Fixed-point_arithmetic) 的小数形式生成的，其中 `self` 是数值的有效部分，`digits` 是小数部分的位数。

更精确地说，`digits` 是一个指数参数，表示 $10^{-\mathrm{digits}}$，当与实际的 [`Int{:tact}`][int] 值相乘时，给出表示的小数值。 参数 `digits` 必须在封闭区间内：$0 <$ `digits` $< 78$，否则会出现 [exit code 134](/zh-cn/book/exit-codes#134)异常：`Invalid argument`。

用法示例：

```tact
let fizz: String = (42).toFloatString(9); // "0.000000042"
```

## Int.toCoinsString

```tact
extends fun toCoinsString(self: Int): String;
```

[`Int{:tact}`][int] 的扩展函数。

返回一个 [`String{:tact}`][p]，该字符串由 [`Int{:tact}`][int] 值通过 [定点表示法](https://en.wikipedia.org/wiki/Fixed-point_arithmetic) 转换为分数形式的数字。 别名为 `self.toFloatString(9){:tact}`。

用于用字符串表示 [nano Toncoins](/zh-cn/book/integers#nanotoncoin) [`Int{:tact}`][int]值。

用法示例：

```tact
let nanotons: Int = 42;
let fizz: String = nanotons.toCoinsString();
let buzz: String = nanotons.toFloatString(9);

fizz == buzz; // true, both store "0.000000042"
```

## Address.toString

```tact
extends fun toString(self: Address): String;
```

[`Address{:tact}`][p] 的扩展函数。

从 [`Address{:tact}`][p] 返回 [`String{:tact}`][p]。

用法示例：

```tact
let community: Address = address("UQDpXLZKrkHsOuE_C1aS69C697wE568vTnqSeRfBXZfvmVOo");
let fizz: String = community.toString();
```

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[cell]: /zh-cn/book/cells#cells
[slice]: /zh-cn/book/cells#slices



================================================
FILE: docs/src/content/docs/zh-cn/ref/evolution/otp-001.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/evolution/otp-001.mdx
================================================
---
title: OTP-001：支持的接口
description: 此提案建议了一种方法，用于检查智能合约并确定其支持哪些接口
sidebar:
  order: 1
---

此提案建议了一种方法，用于检查智能合约并确定其支持哪些接口。

## 动机

现在，我们无法猜测用户想用合约做什么，也无法弄清交易的内容，因为没有明确的方法找到合约的内容。 在大多数情况下，人类需要记住或猜测这是怎么回事。

## 指南

当人们试图签署一项交易时，他们需要清楚地了解自己在做什么：铸币、代币转移、质押、DAO 投票。 虽然以太坊钱包支持签署任意结构，但仍不清楚您签署的是什么以及这样做的影响。 同样，区块链浏览器无法以直观的形式展示正在发生的事情。

与特定合约交互的起点是执行反推操作，即弄清楚该合约对自身的声明。 当应用程序知道这份合约的内容时，它就可以建立一个良好的用户界面，显示交易历史，并验证人类试图签署的内容。

该提案描述了一种报告合约支持哪些接口的方法。

接口是以自由格式的规范定义的。 与其他大多数方法不同的是，本提案不仅将接口定义为合约的技术接口（获取方法、内部信息等），还将其定义为合约行为的描述。 附加一个合约技术接口表示的哈希值可能会导致不同标准之间的冲突，因此该提案对接口的定义较为宽松。 此外，这种方法使接口更加灵活，例如，一个无法转移的代币可以仅是一个合约，它包含一个返回 `false` 的方法 `can_transfer`。这就意味着该代币完全不支持转移，而无需实际实现转移功能。

接口 ID 是反向域名（类似于 Java 中的包）的哈希值，这可以避免不同团队在为自己构建功能时发生名称冲突。

## 技术说明

为了支持反推，合约必须实现 supports_interface GET 方法：

`(int...) supported_interfaces()`
返回支持的接口代码列表。 第一个值必须是 `hash("org.ton.introspection.v0")` = `123515602279859691144772641439386770278`。
如果第一个值不正确，应用程序必须停止尝试反推合约。
示例

```func
_ supported_interfaces() method_id {
    return (123515602279859691144772641439386770278);
}
```

接口的哈希值定义为截断为 128 位的 SHA256。

## 缺点

这项建议并不能保证合约对接口的正确执行，也不能保证避免不同接口之间的名称冲突。 这不是本提案的目标。

这项建议与特定的技术接口无关。 这可能导致多个接口做同样的事情，但 ID 不同。 这是该提案的非目标，因为一个集中式的注册表对于现有接口非常有用，而自定义的注册表主要是内部使用。

## 理由和替代方案

- 为什么是 128 位？ 我们需要在不发生冲突的情况下保留一个全局命名空间，我们不能使用小得多的命名空间，因为发生冲突的可能性会高得多。 我们正在研究类似 UUID 的熵，它正好是 128 位，并且经过时间验证。 超过 128 太浪费了。
- 为什么是自由形式？ 如前所述，定义一些 ID 更容易尽早开始工作，然后最终建立一个标准。 此外，接口（如 ERC20）通常不仅仅是一个技术接口，还包括一些如何使用它的规则。
- 为什么不通过反编译找出合约支持什么？ 在开放世界场景中，明示总比暗示好。 我们不能依靠自己的 "拆解 "能力来进行反推，即使是很小的错误也可能是致命的。
- 为什么不使用表示的哈希值？ 目前还没有编译器支持这一点，而且这项建议是面向未来的。 如果有人想构建更自动化的东西，他们可以很容易地按照自己的规则构建自己的哈希值，对外部观察者而言，一切保持不变。

## 现有技术

[以太坊接口检测](https://eips.ethereum.org/EIPS/eip-165)



================================================
FILE: docs/src/content/docs/zh-cn/ref/evolution/otp-002.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/evolution/otp-002.mdx
================================================
---
title: OTP-002：合约 ABI
description: 这项建议定义了与部署的智能合约通信的ABI
sidebar:
  order: 2
---

ABI 定义了如何与智能合约通信。 它包含有关合约接收器、数据结构等的信息。

## 动机

ABI 是一种重要工具，允许开发人员生成方便的绑定和用户界面等。 其中最好的消费者用例之一是使用DAO，并在签署交易之前能够确认它到底在尝试做什么。

## 指南

本 OTP 基于 TLB+ 中定义的类型，建议在阅读本 OTP 之前先了解这些类型。

## 技术说明

ABI 是一个 JSON 文件：

```json
{
  "name": "MyContract",
  "types": [
    {
      "name": "MyRequest",
      "header": 12315123,
      "fields": [
        {
          "name": "queryId",
          "type": {
            "kind": "simple",
            "type": "int",
            "optional": false,
            "format": "uint256"
          }
        }
      ]
    }
  ],
  "receivers": [
    { "type": "binary", "kind": "internal", "name": "MyRequest" },
    { "type": "binary", "kind": "internal" },
    { "type": "comment", "kind": "internal", "comment": "Vote!" },
    { "type": "comment", "kind": "internal" },
    { "type": "empty", "kind": "internal" }
  ],
  "getters": [
    { "name": "getOwner", "type": "address", "args": [] },
    {
      "name": "getBalance",
      "type": "coins",
      "args": [
        {
          "name": "invested",
          "type": {
            "kind": "simple",
            "type": "uint",
            "format": "coins"
          }
        }
      ]
    }
  ],
  "errors": {
    "123": "Error description",
    "124": "Division by zero"
  }
}
```

## 缺点

- ABI 的二进制和紧凑表示法可能会更好，但目前并不重要。

## 现有技术

- OTP-001，是对本 OTP 的补充。



================================================
FILE: docs/src/content/docs/zh-cn/ref/evolution/otp-003.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/evolution/otp-003.mdx
================================================
---
title: "OTP-003: 自我ABI报告"
description: 这项建议界定了如何使用IPFS 链路报告合约的ABI
sidebar:
  order: 3
---

本建议定义了如何使用 IPFS 链接报告合约的 ABI。

## 动机

通常，ABI 是通过第三方服务或 GitHub 上的某个存储库单独提供的。 本提案建议增加一项新的合约 ABI 自我报告，使用 IPFS 链接。 这将使我们避免任何第三方依赖，并允许任何人构建依赖于 ABI 的工具，如区块链浏览器、钱包等。

## 技术说明

为支持这一提议，合约应实施 OTP-001，并报告一个接口 `org.ton.abi.ipfs.v0`。 然后实现一个获取方法 `get_abi_ipfs`，该方法会返回一个字符串，其中包含指向 ABI 文件的 IPFS 链接。 链接格式应为 `ipfs://<hash>`。

## 缺点

- 不更新合约就无法升级 ABI。 这个缺点只存在于硬编码链接中。



================================================
FILE: docs/src/content/docs/zh-cn/ref/evolution/otp-004.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/evolution/otp-004.mdx
================================================
---
title: OTP-004：自动编码器
description: 该提案定义了一种为给定结构自动构建序列化布局的方法
sidebar:
  order: 4
---

该提案定义了一种为给定结构自动构建序列化布局的方法。

## 动机

在 TLB 中设计序列化布局是一项非常冒险的任务。 开发人员必须注意cell的大小限制，并记住每个字段使用的位数。 这是一项非常容易出错的工作，而且很容易出错。 本建议旨在解决这一问题，它提供了一种为给定结构自动构建序列化布局的方法。

## 技术说明

我们将自编码器定义为一种急切算法，它为给定的结构构建序列化布局。 算法的定义如下：

```text
定义当前单元格中的可用引用和位分别为 `available_references` 和 `available_bits`。
注意：必须至少保留一个引用用于序列化尾部，且至少保留一位用于可选标志。根据上下文，可能会保留更多的引用或位。

对于 A 中的每个字段：
    (size_bits, size_ref) = get_field_max_size(field);
    if (available_bits >= size_bits && available_references >= size_ref) {
        Push field to a current cell
    } else {
        available_references = (1023 - 1);
        available_bits = (4 - 1);
        Allocate a new tail and continue from the current field
    }
```

## 缺点

- 这是一个隐式算法。 目前还不清楚是否需要检查该分配器的结果，以便进行兼容的序列化。



================================================
FILE: docs/src/content/docs/zh-cn/ref/evolution/otp-005.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/evolution/otp-005.mdx
================================================
---
title: "OTP-005: 可选择地址的合同"
description: 该提案定义了一种通过参数而非初始数据来处理合约的方法。
sidebar:
  order: 5
---

该提案定义了一种通过参数而非初始数据来处理合约的方法。

## 动机

Init 数据可能与参数非常不同。 这样，我们就能避免在当前合约的上下文中执行来自另一个合约的不受信任的代码，或在链外执行 TVM 代码进行部署，而这在某些情况下可能会有风险。

## 技术说明

本规范定义了一种将参数写入初始化数据cell的方法，以便在部署过程中由合约代码读取。

### 前缀

前缀由智能合约本身定义，但默认情况下，假定为“单个零位 (single zero bit)”。 合约代码使用前缀来区分已部署和未部署状态。

### 参数 编码

参数使用 [Auto Encoder](/zh-cn/ref/evolution/otp-004) 编码。

### 合约要求

- 合约必须暴露 `lazy_deployment_completed` 获取方法，如果合约已部署，则返回 `true`，否则返回 `false`。
- 合约必须暴露 `org.ton.deploy.lazy.v0` 接口。

## 缺点

- 合约可能处于半部署状态
- 有多种写参数的方法，最终会产生不同的初始数据和不同的地址
- 您可以部署一个预初始化的合约，它将有一个不同的地址，但功能完整
- 部署时无法预测的gas用量。 部署费用通常很高，但这项建议使费用更加高昂。



================================================
FILE: docs/src/content/docs/zh-cn/ref/evolution/otp-006.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/evolution/otp-006.mdx
================================================
---
title: OTP-006：合约包
description: 该提案定义了一种将编译合约、其依赖关系和所有相关元数据打包成一个文件的方法
sidebar:
  order: 6
---

该提案定义了一种将编译合约、其依赖关系和所有相关元数据打包成一个文件的方法。

## 动机

需要一种统一的包格式，以简化使用各种工具部署和升级合约的过程，而无需进行配置。

## 技术说明

软件包文件的扩展名为".pkg"，是一个 JSON 文件：

```json
{
  "name": "My Contract",
  "code": "... boc of code ...",
  "abi": "ABI string to be uploaded as is to IPFS or Ton Storage",
  "init": {
    "kind": "direct", // Means that this contract can be deployed as is
    "args": {
      // ... Arguments in ABI format
    },
    "prefix": {
      // Optional prefix for contract init state
      "bits": 0, // Number of bits in prefix
      "value": 0 // Value of prefix
    },
    "deployment": {
      "kind": "system-cell", // Means that this contract can be deployed as is
      "system": "... boc of system cell ..."
    }
  },
  "sources": {
    "file.ton": "... base64 encoded source file ..."
  },
  "compiler": {
    "name": "func",
    "version": "0.4.1",
    "parameters": "..." // Optional string parameters
  }
}
```

## 缺点

无

## 参考资料

- Bags of Cells (BoC): https://docs.ton.org/develop/data-formats/cell-boc#packing-a-bag-of-cells



================================================
FILE: docs/src/content/docs/zh-cn/ref/evolution/overview.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/evolution/overview.mdx
================================================
---
title: 演变概述
description: 进化小节包含由 Tact 基金会定义并在 Tact 和 TON 生态系统进化过程中使用的所有标准
sidebar:
  label: 概述
  order: 0
---

import { LinkCard, CardGrid } from '@astrojs/starlight/components';

本小节包含 Tact 基金会定义的所有标准，这些标准用于 Tact 和 TON 生态系统的演进过程。
此外，它还提供 TEP（TON 增强建议）和 Tact 更新的最新变更日志。

## 开放式 Tact 提案 (OTPs)

<CardGrid>
  <LinkCard
    title="OTP-001"
    href="/zh-cn/ref/evolution/otp-001"
  />
  <LinkCard
    title="OTP-002"
    href="/zh-cn/ref/evolution/otp-002"
  />
  <LinkCard
    title="OTP-003"
    href="/zh-cn/ref/evolution/otp-003"
  />
  <LinkCard
    title="OTP-004"
    href="/zh-cn/ref/evolution/otp-004"
  />
  <LinkCard
    title="OTP-005"
    href="/zh-cn/ref/evolution/otp-005"
  />
  <LinkCard
    title="OTP-006"
    href="/zh-cn/ref/evolution/otp-006"
  />
</CardGrid>

## TON 增强协议 (TEPs)

TON 增强提案的主要目标是提供一种便捷且正式的方式来提议对 TON 区块链的更改，并标准化生态系统不同部分之间的交互方式。 提案管理是通过 GitHub 拉取请求完成的，[TEP-1](https://github.com/ton-blockchain/TEPs/blob/master/text/0001-tep-lifecycle.md) 对该过程进行了正式描述。

[合并的 TEPs](https://github.com/ton-blockchain/TEPs#merged-teps)列表。

## 更新日志

主 Tact 代码库的所有显著变更都记录在 [CHANGELOG.md](https://github.com/tact-lang/tact/blob/main/dev-docs/CHANGELOG.md) 和 [CHANGELOG-DOCS.md](https://github.com/tact-lang/tact/blob/main/dev-docs/CHANGELOG-DOCS.md) 中。



================================================
FILE: docs/src/content/docs/zh-cn/ref/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/index.mdx
================================================
---
title: 参考资料概览
description: 参考部分——发现Tact的标准库、语法规格和进化过程的地方
---

import { LinkCard, CardGrid, Steps } from '@astrojs/starlight/components';

欢迎来到 Tact 文档的**参考资料**部分，这里是了解 Tact 标准库、语法规范和演变过程的地方。

以下是其主要内容：

<Steps>

1. #### 核心库

   [核心库](/zh-cn/ref/core-base)提供了自动包含的函数、trait和其他结构体的完整列表及其使用示例。

   <CardGrid>
     <LinkCard
       title="转到核心库"
       href="/zh-cn/ref/core-base"
     />
   </CardGrid>

2. #### 标准库

   [标准库](/zh-cn/ref/standard-libraries) 子章节解释了如何使用捆绑的库，列出了所有库的内容及其使用示例。

   <CardGrid>
     <LinkCard
       title="转到标准库"
       href="/zh-cn/ref/standard-libraries"
     />
   </CardGrid>

3. #### 技术规范

   [技术规范](/zh-cn/ref/spec) 页面面向更有经验的程序员，但对于快速掌握一种语言的所有可能语法仍然非常有用。

   <CardGrid>
     <LinkCard
       title="转到技术规范"
       href="/zh-cn/ref/spec"
     />
   </CardGrid>

4. #### 演进

   最后，[演进](/zh-cn/ref/evolution/overview) 子章节介绍了有关语言语义的重要决定、Tact 的未来以及 Tact 更新日志的链接。

   <CardGrid>
     <LinkCard
       title="前往演进"
       href="/zh-cn/ref/evolution/overview"
     />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/zh-cn/ref/spec.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/spec.mdx
================================================
---
title: Tact 规格
pagefind: false
---

:::danger[Not 已实施]
  在 [#76](https://github.com/tact-lang/tact-docs/issues/76) 实现之前，本页主要是一个存根。
:::



================================================
FILE: docs/src/content/docs/zh-cn/ref/standard-libraries.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/standard-libraries.mdx
================================================
---
title: 标准库概述
description: 一些库已捆绑在 Tact 编译器中，但在未显式包含到项目中之前，它们不会自动添加到你的项目中
prev:
  link: /zh-cn/ref/core-advanced
  label: 进阶设置
---

有些库（也称为标准库或 stdlibs）与 Tact 编译器捆绑在一起，但不会自动包含到项目中，除非明确指定。

要导入任何标准库，请使用[`import{:tact}`关键字](/zh-cn/book/import)，然后在 [string][p] 中输入该库的名称，像这样：

```tact
// This would include everything from @stdlib/deploy into your codebase:
import "@stdlib/deploy";
```

## 标准库列表： {#list}

| 库                       | 描述                                                        | 常用的 API |
| :----------------------- | :---------------------------------------------------------- | :--------- |
| [`@stdlib/config`][1]    | 配置和选举地址检索。                                        | [`getConfigAddress(){:tact}`][gca], [`getElectorAddress(){:tact}`][gea] |
| [`@stdlib/content`][2]   | 将链下链接(link) [strings][p] 编码为[`cell{:tact}`][cell]。 | [`createOffchainContent(){:tact}`][coff] |
| [`@stdlib/deploy`][3]    | 统一的部署机制。                                            | [`Deployable{:tact}`][dep], [`FactoryDeployable{:tact}`][fcd] |
| [`@stdlib/dns`][4]       | 解析 [DNS][dns] 名称。                                      | [`DNSResolver{:tact}`][dnsr], [`dnsInternalVerify(){:tact}`][dnsi] |
| [`@stdlib/ownable`][5]   | 所有权管理的trait。                                         | [`Ownable{:tact}`][own], [`OwnableTransferable{:tact}`][ownt] |
| [`@stdlib/stoppable`][6] | 允许合约停止的 Traits。 需要 [@stdlib/ownable][5]。         | [`Stoppable{:tact}`][stp], [`Resumable{:tact}`][res] |

[1]: /zh-cn/ref/stdlib-config
[gca]: /zh-cn/ref/stdlib-config#getconfigaddress
[gea]: /zh-cn/ref/stdlib-config#getelectoraddress
[2]: /zh-cn/ref/stdlib-content
[coff]: /zh-cn/ref/stdlib-content#createoffchaincontent
[3]: /zh-cn/ref/stdlib-deploy
[dep]: /zh-cn/ref/stdlib-deploy#deployable
[fcd]: /zh-cn/ref/stdlib-deploy#factorydeployable
[4]: /zh-cn/ref/stdlib-dns
[dnsr]: /zh-cn/ref/stdlib-dns#dnsresolver
[dnsi]: /zh-cn/ref/stdlib-dns#dnsinternalverify
[5]: /zh-cn/ref/stdlib-ownable
[own]: /zh-cn/ref/stdlib-ownable#ownable
[ownt]: /zh-cn/ref/stdlib-ownable#ownabletransferable
[6]: /zh-cn/ref/stdlib-stoppable
[stp]: /zh-cn/ref/stdlib-stoppable#stoppable
[res]: /zh-cn/ref/stdlib-stoppable#resumable
[p]: /zh-cn/book/types#primitive-types
[cell]: /zh-cn/book/cells#cells
[dns]: https://docs.ton.org/participate/web3/dns



================================================
FILE: docs/src/content/docs/zh-cn/ref/stdlib-config.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/stdlib-config.mdx
================================================
---
title: "@stdlib/config"
description: 提供配置和选举(elector)地址检索的功能
---

提供配置和选举(elector)地址检索功能。

要使用该库，请导入 `@stdlib/config`：

```tact
import "@stdlib/config";
```

## 函数

### getConfigAddress

```tact
fun getConfigAddress(): Address;
```

读取配置参数 $0$ 作为 [`Address{:tact}`][p]。

源码:

```tact
fun getConfigAddress(): Address {
    let cell: Cell = getConfigParam(0)!!;
    let sc: Slice = cell.beginParse();
    return newAddress(-1, sc.loadUint(256));
}
```

### getElectorAddress

```tact
fun getElectorAddress(): Address;
```

读取配置参数 $1$ 作为 [`Address{:tact}`][p]。

源码:

```tact
fun getElectorAddress(): Address {
    let cell: Cell = getConfigParam(1)!!;
    let sc: Slice = cell.beginParse();
    return newAddress(-1, sc.loadUint(256));
}
```

## 资料来源

- [config.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/config.tact)

[p]: /zh-cn/book/types#primitive-types



================================================
FILE: docs/src/content/docs/zh-cn/ref/stdlib-content.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/stdlib-content.mdx
================================================
---
title: "@stdlib/content"
description: 提供一个将字符串编码为 Cell 的链下链接的函数
---

提供一个将 [`String{:tact}`][p] 编码为 [`Cell{:tact}`][cell] 的链下链接的函数。

要使用该库，请导入 `@stdlib/content`：

```tact
import "@stdlib/content";
```

## 函数

### createOffchainContent

```tact
fun createOffchainContent(link: String): Cell;
```

将链下链接(link) [strings][p] 编码为[`cell{:tact}`][cell]。

源码:

```tact
fun createOffchainContent(link: String): Cell {
    let builder: StringBuilder = beginStringFromBuilder(beginCell().storeUint(0x01, 8));
    builder.append(link);
    return builder.toCell();
}
```

## 资料来源

- [content.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/content.tact)

[p]: /zh-cn/book/types#primitive-types
[cell]: /zh-cn/book/cells#cells



================================================
FILE: docs/src/content/docs/zh-cn/ref/stdlib-deploy.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/stdlib-deploy.mdx
================================================
---
title: "@stdlib/deploy"
description: 提供统一的部署机制
---

提供统一的部署机制。

要使用该库，请导入 `@stdlib/deploy`：

```tact
import "@stdlib/deploy";
```

## 消息 - Messages {#messages}

### Deploy

```tact
message Deploy {
    queryId: Int as uint64;
}
```

### DeployOk

```tact
message DeployOk {
    queryId: Int as uint64;
}
```

### FactoryDeploy

```tact
message FactoryDeploy {
    queryId: Int as uint64;
    cashback: Address;
}
```

## Traits

### Deployable

最简单的 trait `Deployable{:tact}` 提供了一个便捷的统一部署机制，通过实现一个简单的接收器来处理 [Deploy](#deploy) 消息。

所有合约都是通过发送消息来部署的。 虽然任何消息都可用于此目的，但最佳做法是使用特殊的 [部署](#deploy) 消息。

该消息只有一个字段 `queryId` ，由部署者提供（通常设置为零）。 如果部署成功，合约将回复一条 [DeployOk](#deployok) 消息，并在回复中呼应相同的 `queryId` 。

源码:

```tact
trait Deployable {
    receive(deploy: Deploy) {
        self.notify(DeployOk{queryId: deploy.queryId}.toCell());
    }
}
```

示例用法：

```tact /Deployable/
import "@stdlib/deploy";

contract ExampleContract with Deployable {
    // Now, this contract has a receiver for Deploy message
}
```

### FactoryDeployable

Trait `FactoryDeployable{:tact}` 为连锁部署提供了方便的统一机制。

源码:

```tact
trait FactoryDeployable  {
    receive(deploy: FactoryDeploy) {
        self.forward(deploy.cashback, DeployOk{queryId: deploy.queryId}.toCell(), false, null);
    }
}
```

用法示例：

```tact /FactoryDeployable/
import "@stdlib/deploy";

contract ExampleContract with FactoryDeployable {
    // Now, this contract has a receiver for FactoryDeploy message
}
```

## 资料来源

- [deploy.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/deploy.tact)



================================================
FILE: docs/src/content/docs/zh-cn/ref/stdlib-dns.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/stdlib-dns.mdx
================================================
---
title: "@stdlib/dns"
description: 提供 TON 上DNS 名称的解析方式
---

提供[DNS](https://docs.ton.org/participate/web3/dns)名称的解析手段。

要使用该库，请导入 `@stdlib/dns`：

```tact
import "@stdlib/dns";
```

## Structs

### DNSResolveResult

```tact
struct DNSResolveResult {
    prefix: Int;
    record: Cell?;
}
```

## 函数

### dnsStringToInternal

```tact
@name(dns_string_to_internal)
native dnsStringToInternal(str: String): Slice?;
```

将一个 DNS 字符串转换为 [`Slice{:tact}`][slice] 或 [`null{:tact}`](/zh-cn/book/optionals)，如果不可能转换则返回 [`null{:tact}`]。

源代码 (FunC)：[dns.fc#L1](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc#L1)

### dnsInternalNormalize

```tact
@name(dns_internal_normalize)
native dnsInternalNormalize(src: Slice): Slice;
```

规范化 [`Slice{:tact}`][slice] 的内部 DNS 表示。 传入的 [`Slice{:tact}`][slice] 不能有任何引用，否则[ext code 134](/zh-cn/book/exit-codes#134)将会抛出：`Invalid argument`。

源代码 (FunC)：[dns.fc#L125](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc#L125)

### dnsInternalVerify

```tact
@name(dns_internal_verify)
native dnsInternalVerify(subdomain: Slice): Bool;
```

验证 `子域(subdomain)` [`Slice{:tact}`][slice] 的内部 DNS 表示。

源代码 (FunC)：[dns.fc#L81](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc#L81)

### dnsExtractTopDomainLength

```tact
fun dnsExtractTopDomainLength(subdomain: Slice): Int;
```

计算顶域(top domain)在 `子域(subdomain)` [`Slice{:tact}`][slice]中的长度。

源码:

```tact
fun dnsExtractTopDomainLength(subdomain: Slice): Int {
    let i: Int = 0;
    let needBreak: Bool = false;
    do {
        let char: Int = subdomain.loadUint(8); // we do not check domain.length because it MUST contain \0 character
        needBreak = char == 0;
        if (!needBreak) {
            i += 8;
        }
    } until (needBreak);
    require(i != 0, "Invalid DNS name");
    return i;
}
```

### dnsExtractTopDomain

```tact
fun dnsExtractTopDomain(subdomain: Slice): Slice;
```

从 "子域 "中提取顶域 [`Slice{:tact}`][slice]。

源码:

```tact
fun dnsExtractTopDomain(subdomain: Slice): Slice {
    let len: Int = dnsExtractTopDomainLength(subdomain);
    return subdomain.loadBits(len);
}
```

### dnsResolveNext

```tact
fun dnsResolveNext(address: Address): Cell;
```

将 `address` [`Address{:tact}`][p]解析为[`cell{:tact}`][cell]。

源码:

```tact
fun dnsResolveNext(address: Address): Cell {
    return beginCell()
        .storeUint(0xba93, 16)
        .storeAddress(address)
        .endCell();
}
```

### dnsResolveWallet

```tact
fun dnsResolveWallet(address: Address): Cell;
```

将钱包 `address` [`Address{:tact}`][p]解析为[`Cell{:tact}`][cell]。

源码:

```tact
fun dnsResolveWallet(address: Address): Cell {
    return beginCell()
        .storeUint(0x9fd3, 16)
        .storeAddress(address)
        .storeUint(0, 8)
        .endCell();
}
```

## Traits

### DNSResolver

Trait `DNSResolver` 为 DNS 解析提供了两个辅助函数：

1. [getter函数](/zh-cn/book/functions#getter-functions) `dnsresolve(){:tact}`，对应于其[FunC变体](https://docs.ton.org/develop/howto/subresolvers#dnsresolve-code)。
2. 虚函数 `doResolveDNS(){:tact}`，它通过子域 [`Slice{:tact}`][slice] 位创建一个 [DNSResolveResult](#dnsresolveresult) 结构体。

源码:

```tact
trait DNSResolver {
    get fun dnsresolve(subdomain: Slice, category: Int): DNSResolveResult {
        // Normalize
        let delta: Int = 0;
        if (subdomain.preloadUint(8) == 0) {
            subdomain.loadUint(8); // Skip first byte
            delta += 8;
        }

        // Checks correctness
        require(dnsInternalVerify(subdomain), "Invalid DNS name");

        // Resolve
        let res: DNSResolveResult = self.doResolveDNS(subdomain, category);
        return DNSResolveResult{prefix: res.prefix + delta, record: res.record};
    }
    virtual fun doResolveDNS(subdomain: Slice, category: Int): DNSResolveResult {
        return DNSResolveResult{prefix: subdomain.bits(), record: null};
    }
}
```

示例用法：

```tact
import "@stdlib/dns";

contract ExampleContract with DNSResolver {
    // Now, this contract has a:
    // 1. dnsresolve getter function
    // 2. doResolveDNS virtual function
}
```

## 资料来源

- [dns.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/dns.tact)
- [dns.fc](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc)

[p]: /zh-cn/book/types#primitive-types
[cell]: /zh-cn/book/cells#cells
[slice]: /zh-cn/book/cells#slices



================================================
FILE: docs/src/content/docs/zh-cn/ref/stdlib-ownable.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/stdlib-ownable.mdx
================================================
---
title: "@stdlib/ownable"
description: 提供适用于拥有合约的 traits，这些 traits 通常是其他 traits 所需要的。
---

为可拥有的合约提供 [traits](/zh-cn/book/types#composite-types)。 这些 traits 通常是其他 traits 所需要的。

要使用该库，请导入 `@stdlib/ownable`：

```tact
import "@stdlib/ownable";
```

## Messages

### ChangeOwner

```tact
message ChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}
```

### ChangeOwnerOk

```tact
message ChangeOwnerOk {
    queryId: Int as uint64;
    newOwner: Address;
}
```

## Traits

### Ownable

[Trait](/zh-cn/book/types#composite-types) `Ownable{:tact}` 声明了 [contract](/zh-cn/book/contracts) 的所有者（不可编辑），并提供了一个辅助函数 `requireOwner(){:tact}` 来检查消息是否由所有者发送。

此 [trait](/zh-cn/book/types#composite-types) 要求声明一个字段 `owner: Address{:tact}`，并公开一个 [getter 函数](/zh-cn/book/functions#getter-functions) `owner(){:tact}`，该函数从 [合约](/zh-cn/book/contracts) 中读取。

源码:

```tact
@interface("org.ton.ownable")
trait Ownable {
    owner: Address;

    fun requireOwner() {
        throwUnless(TactExitCodeAccessDenied, sender() == self.owner);
    }

    get fun owner(): Address {
        return self.owner;
    }
}
```

示例用法：

```tact /Ownable/
import "@stdlib/ownable";

contract ExampleContract with Ownable {
    owner: Address;

    init(owner: Address) {
        self.owner = owner;
    }
}
```

### OwnableTransferable

`OwnableTransferable{:tact}` 是 [`Ownable{:tact}`](#ownable) 的扩展，允许将合约的所有权转移到另一个地址。 它提供了一个安全的句柄 [Message](/zh-cn/book/structs-and-messages#messages) [`ChangeOwner{:tact}`](#changeowner)，可供所有者调用以转移所有权。

如果所有者转移请求成功，合约将回复一条 [`ChangeOwnerOk{:tact}`](#changeownerok) [消息](/zh-cn/book/structs-and-messages#messages)。

源码:

```tact
@interface("org.ton.ownable.transferable.v2")
trait OwnableTransferable with Ownable {
    owner: Address;

    receive(msg: ChangeOwner) {
        // Check if the sender is the owner
        self.requireOwner();

        // Update owner
        self.owner = msg.newOwner;

        // Reply result
        self.reply(ChangeOwnerOk{ queryId: msg.queryId, newOwner: msg.newOwner }.toCell());
    }
}
```

示例用法：

```tact /OwnableTransferable/
import "@stdlib/ownable";

contract ExampleContract with OwnableTransferable {
    owner: Address;

    init(owner: Address) {
        self.owner = owner;
    }
}
```

## 资料来源

- [ownable.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/ownable.tact)



================================================
FILE: docs/src/content/docs/zh-cn/ref/stdlib-stoppable.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/ref/stdlib-stoppable.mdx
================================================
---
title: "@stdlib/stoppable"
description: 提供允许停止合同的 traits ，这对紧急或维护模式非常有用
---

提供[traits](/zh-cn/book/types#composite-types)，允许停止[合约](/zh-cn/book/contracts)。 适用于应急或维护模式。 需要来自 [`@stdlib/ownable`](/zh-cn/ref/stdlib-ownable) 的 [`Ownable{:tact}`](/zh-cn/ref/stdlib-ownable#ownable)trait。 该trait只管理合约中的一个标记 `stopped`，处理停止状态必须在合约本身中完成。

要使用该库，请导入 `@stdlib/stoppable`：

```tact
import "@stdlib/stoppable"; // this would automatically import @stdlib/ownable too!
```

## Traits

### Stoppable

[Trait](/zh-cn/book/types#composite-types) `Stoppable{:tact}` 实现了一个接收者，用于接收所有者可以发送的 [Message](/zh-cn/book/structs-and-messages#messages) 消息 "Stop"。它还实现了 `stopped(){:tact}` [getter 函数](/zh-cn/book/functions#getter-functions)，如果合约已停止则返回 `true{:tact}`（否则返回 `false{:tact}`），并提供了私有（非 getter）函数 `requireNotStopped(){:tact}` 和 `requireStopped(){:tact}`。

源码:

```tact
@interface("org.ton.stoppable")
trait Stoppable with Ownable {
    stopped: Bool;
    owner: Address;

    fun requireNotStopped() {
        throwUnless(TactExitCodeContractStopped, !self.stopped);
    }

    fun requireStopped() {
        require(self.stopped, "Contract not stopped");
    }

    receive("Stop") {
        self.requireOwner();
        self.requireNotStopped();
        self.stopped = true;
        self.reply("Stopped".asComment());
    }

    get fun stopped(): Bool {
        return self.stopped;
    }
}
```

示例用法：

```tact /Stoppable/
import "@stdlib/ownable";
import "@stdlib/stoppable";

contract MyContract with Stoppable {
    owner: Address;
    stopped: Bool;

    init(owner: Address) {
        self.owner = owner;
        self.stopped = false;
    }
}
```

### Resumable

`Resumable{:tact}` [trait](/zh-cn/book/types#composite-types) 扩展了 [`Stoppable{:tact}`](#stoppable) trait，允许恢复 [合约](/zh-cn/book/contracts) 的执行。

源码:

```tact
@interface("org.ton.resumable")
trait Resumable with Stoppable {
    stopped: Bool;
    owner: Address;

    receive("Resume") {
        self.requireOwner();
        self.requireStopped();
        self.stopped = false;
        self.reply("Resumed".asComment());
    }
}
```

用法示例：

```tact /Resumable/
import "@stdlib/ownable";
import "@stdlib/stoppable";

contract MyContract with Resumable {
    owner: Address;
    stopped: Bool;

    init(owner: Address) {
        self.owner = owner;
        self.stopped = false;
    }
}
```

## 资料来源

- [stoppable.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/stoppable.tact)



================================================
FILE: docs/src/env.d.ts
URL: https://github.com/tact-lang/tact/blob/main/docs/src/env.d.ts
================================================
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />



================================================
FILE: docs/src/fonts/KaTeX_AMS-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_AMS-Regular.ttf
================================================
[Binary file blocked: KaTeX_AMS-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_AMS-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_AMS-Regular.woff
================================================
[Binary file blocked: KaTeX_AMS-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_AMS-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_AMS-Regular.woff2
================================================
[Binary file blocked: KaTeX_AMS-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Caligraphic-Bold.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Caligraphic-Bold.ttf
================================================
[Binary file blocked: KaTeX_Caligraphic-Bold.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Caligraphic-Bold.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Caligraphic-Bold.woff
================================================
[Binary file blocked: KaTeX_Caligraphic-Bold.woff]


================================================
FILE: docs/src/fonts/KaTeX_Caligraphic-Bold.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Caligraphic-Bold.woff2
================================================
[Binary file blocked: KaTeX_Caligraphic-Bold.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Caligraphic-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Caligraphic-Regular.ttf
================================================
[Binary file blocked: KaTeX_Caligraphic-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Caligraphic-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Caligraphic-Regular.woff
================================================
[Binary file blocked: KaTeX_Caligraphic-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Caligraphic-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Caligraphic-Regular.woff2
================================================
[Binary file blocked: KaTeX_Caligraphic-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Fraktur-Bold.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Fraktur-Bold.ttf
================================================
[Binary file blocked: KaTeX_Fraktur-Bold.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Fraktur-Bold.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Fraktur-Bold.woff
================================================
[Binary file blocked: KaTeX_Fraktur-Bold.woff]


================================================
FILE: docs/src/fonts/KaTeX_Fraktur-Bold.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Fraktur-Bold.woff2
================================================
[Binary file blocked: KaTeX_Fraktur-Bold.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Fraktur-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Fraktur-Regular.ttf
================================================
[Binary file blocked: KaTeX_Fraktur-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Fraktur-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Fraktur-Regular.woff
================================================
[Binary file blocked: KaTeX_Fraktur-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Fraktur-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Fraktur-Regular.woff2
================================================
[Binary file blocked: KaTeX_Fraktur-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Main-Bold.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Bold.ttf
================================================
[Binary file blocked: KaTeX_Main-Bold.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Main-Bold.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Bold.woff
================================================
[Binary file blocked: KaTeX_Main-Bold.woff]


================================================
FILE: docs/src/fonts/KaTeX_Main-Bold.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Bold.woff2
================================================
[Binary file blocked: KaTeX_Main-Bold.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Main-BoldItalic.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-BoldItalic.ttf
================================================
[Binary file blocked: KaTeX_Main-BoldItalic.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Main-BoldItalic.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-BoldItalic.woff
================================================
[Binary file blocked: KaTeX_Main-BoldItalic.woff]


================================================
FILE: docs/src/fonts/KaTeX_Main-BoldItalic.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-BoldItalic.woff2
================================================
[Binary file blocked: KaTeX_Main-BoldItalic.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Main-Italic.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Italic.ttf
================================================
[Binary file blocked: KaTeX_Main-Italic.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Main-Italic.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Italic.woff
================================================
[Binary file blocked: KaTeX_Main-Italic.woff]


================================================
FILE: docs/src/fonts/KaTeX_Main-Italic.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Italic.woff2
================================================
[Binary file blocked: KaTeX_Main-Italic.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Main-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Regular.ttf
================================================
[Binary file blocked: KaTeX_Main-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Main-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Regular.woff
================================================
[Binary file blocked: KaTeX_Main-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Main-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Main-Regular.woff2
================================================
[Binary file blocked: KaTeX_Main-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Math-BoldItalic.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Math-BoldItalic.ttf
================================================
[Binary file blocked: KaTeX_Math-BoldItalic.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Math-BoldItalic.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Math-BoldItalic.woff
================================================
[Binary file blocked: KaTeX_Math-BoldItalic.woff]


================================================
FILE: docs/src/fonts/KaTeX_Math-BoldItalic.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Math-BoldItalic.woff2
================================================
[Binary file blocked: KaTeX_Math-BoldItalic.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Math-Italic.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Math-Italic.ttf
================================================
[Binary file blocked: KaTeX_Math-Italic.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Math-Italic.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Math-Italic.woff
================================================
[Binary file blocked: KaTeX_Math-Italic.woff]


================================================
FILE: docs/src/fonts/KaTeX_Math-Italic.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Math-Italic.woff2
================================================
[Binary file blocked: KaTeX_Math-Italic.woff2]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Bold.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Bold.ttf
================================================
[Binary file blocked: KaTeX_SansSerif-Bold.ttf]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Bold.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Bold.woff
================================================
[Binary file blocked: KaTeX_SansSerif-Bold.woff]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Bold.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Bold.woff2
================================================
[Binary file blocked: KaTeX_SansSerif-Bold.woff2]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Italic.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Italic.ttf
================================================
[Binary file blocked: KaTeX_SansSerif-Italic.ttf]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Italic.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Italic.woff
================================================
[Binary file blocked: KaTeX_SansSerif-Italic.woff]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Italic.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Italic.woff2
================================================
[Binary file blocked: KaTeX_SansSerif-Italic.woff2]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Regular.ttf
================================================
[Binary file blocked: KaTeX_SansSerif-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Regular.woff
================================================
[Binary file blocked: KaTeX_SansSerif-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_SansSerif-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_SansSerif-Regular.woff2
================================================
[Binary file blocked: KaTeX_SansSerif-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Script-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Script-Regular.ttf
================================================
[Binary file blocked: KaTeX_Script-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Script-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Script-Regular.woff
================================================
[Binary file blocked: KaTeX_Script-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Script-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Script-Regular.woff2
================================================
[Binary file blocked: KaTeX_Script-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Size1-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size1-Regular.ttf
================================================
[Binary file blocked: KaTeX_Size1-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Size1-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size1-Regular.woff
================================================
[Binary file blocked: KaTeX_Size1-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Size1-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size1-Regular.woff2
================================================
[Binary file blocked: KaTeX_Size1-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Size2-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size2-Regular.ttf
================================================
[Binary file blocked: KaTeX_Size2-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Size2-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size2-Regular.woff
================================================
[Binary file blocked: KaTeX_Size2-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Size2-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size2-Regular.woff2
================================================
[Binary file blocked: KaTeX_Size2-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Size3-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size3-Regular.ttf
================================================
[Binary file blocked: KaTeX_Size3-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Size3-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size3-Regular.woff
================================================
[Binary file blocked: KaTeX_Size3-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Size3-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size3-Regular.woff2
================================================
[Binary file blocked: KaTeX_Size3-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Size4-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size4-Regular.ttf
================================================
[Binary file blocked: KaTeX_Size4-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Size4-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size4-Regular.woff
================================================
[Binary file blocked: KaTeX_Size4-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Size4-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Size4-Regular.woff2
================================================
[Binary file blocked: KaTeX_Size4-Regular.woff2]


================================================
FILE: docs/src/fonts/KaTeX_Typewriter-Regular.ttf
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Typewriter-Regular.ttf
================================================
[Binary file blocked: KaTeX_Typewriter-Regular.ttf]


================================================
FILE: docs/src/fonts/KaTeX_Typewriter-Regular.woff
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Typewriter-Regular.woff
================================================
[Binary file blocked: KaTeX_Typewriter-Regular.woff]


================================================
FILE: docs/src/fonts/KaTeX_Typewriter-Regular.woff2
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/KaTeX_Typewriter-Regular.woff2
================================================
[Binary file blocked: KaTeX_Typewriter-Regular.woff2]


================================================
FILE: docs/src/fonts/katex.fontfaces.css
URL: https://github.com/tact-lang/tact/blob/main/docs/src/fonts/katex.fontfaces.css
================================================
@font-face{font-family:KaTeX_AMS;font-style:normal;font-weight:400;src:url(KaTeX_AMS-Regular.woff2) format("woff2"),url(KaTeX_AMS-Regular.woff) format("woff"),url(KaTeX_AMS-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:700;src:url(KaTeX_Caligraphic-Bold.woff2) format("woff2"),url(KaTeX_Caligraphic-Bold.woff) format("woff"),url(KaTeX_Caligraphic-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:400;src:url(KaTeX_Caligraphic-Regular.woff2) format("woff2"),url(KaTeX_Caligraphic-Regular.woff) format("woff"),url(KaTeX_Caligraphic-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:700;src:url(KaTeX_Fraktur-Bold.woff2) format("woff2"),url(KaTeX_Fraktur-Bold.woff) format("woff"),url(KaTeX_Fraktur-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:400;src:url(KaTeX_Fraktur-Regular.woff2) format("woff2"),url(KaTeX_Fraktur-Regular.woff) format("woff"),url(KaTeX_Fraktur-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:700;src:url(KaTeX_Main-Bold.woff2) format("woff2"),url(KaTeX_Main-Bold.woff) format("woff"),url(KaTeX_Main-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:700;src:url(KaTeX_Main-BoldItalic.woff2) format("woff2"),url(KaTeX_Main-BoldItalic.woff) format("woff"),url(KaTeX_Main-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:400;src:url(KaTeX_Main-Italic.woff2) format("woff2"),url(KaTeX_Main-Italic.woff) format("woff"),url(KaTeX_Main-Italic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:400;src:url(KaTeX_Main-Regular.woff2) format("woff2"),url(KaTeX_Main-Regular.woff) format("woff"),url(KaTeX_Main-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:700;src:url(KaTeX_Math-BoldItalic.woff2) format("woff2"),url(KaTeX_Math-BoldItalic.woff) format("woff"),url(KaTeX_Math-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:400;src:url(KaTeX_Math-Italic.woff2) format("woff2"),url(KaTeX_Math-Italic.woff) format("woff"),url(KaTeX_Math-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:700;src:url(KaTeX_SansSerif-Bold.woff2) format("woff2"),url(KaTeX_SansSerif-Bold.woff) format("woff"),url(KaTeX_SansSerif-Bold.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:italic;font-weight:400;src:url(KaTeX_SansSerif-Italic.woff2) format("woff2"),url(KaTeX_SansSerif-Italic.woff) format("woff"),url(KaTeX_SansSerif-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:400;src:url(KaTeX_SansSerif-Regular.woff2) format("woff2"),url(KaTeX_SansSerif-Regular.woff) format("woff"),url(KaTeX_SansSerif-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Script;font-style:normal;font-weight:400;src:url(KaTeX_Script-Regular.woff2) format("woff2"),url(KaTeX_Script-Regular.woff) format("woff"),url(KaTeX_Script-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size1;font-style:normal;font-weight:400;src:url(KaTeX_Size1-Regular.woff2) format("woff2"),url(KaTeX_Size1-Regular.woff) format("woff"),url(KaTeX_Size1-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size2;font-style:normal;font-weight:400;src:url(KaTeX_Size2-Regular.woff2) format("woff2"),url(KaTeX_Size2-Regular.woff) format("woff"),url(KaTeX_Size2-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size3;font-style:normal;font-weight:400;src:url(KaTeX_Size3-Regular.woff2) format("woff2"),url(KaTeX_Size3-Regular.woff) format("woff"),url(KaTeX_Size3-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size4;font-style:normal;font-weight:400;src:url(KaTeX_Size4-Regular.woff2) format("woff2"),url(KaTeX_Size4-Regular.woff) format("woff"),url(KaTeX_Size4-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Typewriter;font-style:normal;font-weight:400;src:url(KaTeX_Typewriter-Regular.woff2) format("woff2"),url(KaTeX_Typewriter-Regular.woff) format("woff"),url(fonts/KaTeX_Typewriter-Regular.ttf) format("truetype")}



================================================
FILE: docs/src/katex.min.css
URL: https://github.com/tact-lang/tact/blob/main/docs/src/katex.min.css
================================================
.katex{font:normal 1.21em KaTeX_Main,Times New Roman,serif;line-height:1.2;text-indent:0;text-rendering:auto}.katex *{-ms-high-contrast-adjust:none!important;border-color:currentColor}.katex .katex-version:after{content:"0.16.11"}.katex .katex-mathml{clip:rect(1px,1px,1px,1px);border:0;height:1px;overflow:hidden;padding:0;position:absolute;width:1px}.katex .katex-html>.newline{display:block}.katex .base{position:relative;white-space:nowrap;width:-webkit-min-content;width:-moz-min-content;width:min-content}.katex .base,.katex .strut{display:inline-block}.katex .textbf{font-weight:700}.katex .textit{font-style:italic}.katex .textrm{font-family:KaTeX_Main}.katex .textsf{font-family:KaTeX_SansSerif}.katex .texttt{font-family:KaTeX_Typewriter}.katex .mathnormal{font-family:KaTeX_Math;font-style:italic}.katex .mathit{font-family:KaTeX_Main;font-style:italic}.katex .mathrm{font-style:normal}.katex .mathbf{font-family:KaTeX_Main;font-weight:700}.katex .boldsymbol{font-family:KaTeX_Math;font-style:italic;font-weight:700}.katex .amsrm,.katex .mathbb,.katex .textbb{font-family:KaTeX_AMS}.katex .mathcal{font-family:KaTeX_Caligraphic}.katex .mathfrak,.katex .textfrak{font-family:KaTeX_Fraktur}.katex .mathboldfrak,.katex .textboldfrak{font-family:KaTeX_Fraktur;font-weight:700}.katex .mathtt{font-family:KaTeX_Typewriter}.katex .mathscr,.katex .textscr{font-family:KaTeX_Script}.katex .mathsf,.katex .textsf{font-family:KaTeX_SansSerif}.katex .mathboldsf,.katex .textboldsf{font-family:KaTeX_SansSerif;font-weight:700}.katex .mathitsf,.katex .textitsf{font-family:KaTeX_SansSerif;font-style:italic}.katex .mainrm{font-family:KaTeX_Main;font-style:normal}.katex .vlist-t{border-collapse:collapse;display:inline-table;table-layout:fixed}.katex .vlist-r{display:table-row}.katex .vlist{display:table-cell;position:relative;vertical-align:bottom}.katex .vlist>span{display:block;height:0;position:relative}.katex .vlist>span>span{display:inline-block}.katex .vlist>span>.pstrut{overflow:hidden;width:0}.katex .vlist-t2{margin-right:-2px}.katex .vlist-s{display:table-cell;font-size:1px;min-width:2px;vertical-align:bottom;width:2px}.katex .vbox{align-items:baseline;display:inline-flex;flex-direction:column}.katex .hbox{width:100%}.katex .hbox,.katex .thinbox{display:inline-flex;flex-direction:row}.katex .thinbox{max-width:0;width:0}.katex .msupsub{text-align:left}.katex .mfrac>span>span{text-align:center}.katex .mfrac .frac-line{border-bottom-style:solid;display:inline-block;width:100%}.katex .hdashline,.katex .hline,.katex .mfrac .frac-line,.katex .overline .overline-line,.katex .rule,.katex .underline .underline-line{min-height:1px}.katex .mspace{display:inline-block}.katex .clap,.katex .llap,.katex .rlap{position:relative;width:0}.katex .clap>.inner,.katex .llap>.inner,.katex .rlap>.inner{position:absolute}.katex .clap>.fix,.katex .llap>.fix,.katex .rlap>.fix{display:inline-block}.katex .llap>.inner{right:0}.katex .clap>.inner,.katex .rlap>.inner{left:0}.katex .clap>.inner>span{margin-left:-50%;margin-right:50%}.katex .rule{border:0 solid;display:inline-block;position:relative}.katex .hline,.katex .overline .overline-line,.katex .underline .underline-line{border-bottom-style:solid;display:inline-block;width:100%}.katex .hdashline{border-bottom-style:dashed;display:inline-block;width:100%}.katex .sqrt>.root{margin-left:.2777777778em;margin-right:-.5555555556em}.katex .fontsize-ensurer.reset-size1.size1,.katex .sizing.reset-size1.size1{font-size:1em}.katex .fontsize-ensurer.reset-size1.size2,.katex .sizing.reset-size1.size2{font-size:1.2em}.katex .fontsize-ensurer.reset-size1.size3,.katex .sizing.reset-size1.size3{font-size:1.4em}.katex .fontsize-ensurer.reset-size1.size4,.katex .sizing.reset-size1.size4{font-size:1.6em}.katex .fontsize-ensurer.reset-size1.size5,.katex .sizing.reset-size1.size5{font-size:1.8em}.katex .fontsize-ensurer.reset-size1.size6,.katex .sizing.reset-size1.size6{font-size:2em}.katex .fontsize-ensurer.reset-size1.size7,.katex .sizing.reset-size1.size7{font-size:2.4em}.katex .fontsize-ensurer.reset-size1.size8,.katex .sizing.reset-size1.size8{font-size:2.88em}.katex .fontsize-ensurer.reset-size1.size9,.katex .sizing.reset-size1.size9{font-size:3.456em}.katex .fontsize-ensurer.reset-size1.size10,.katex .sizing.reset-size1.size10{font-size:4.148em}.katex .fontsize-ensurer.reset-size1.size11,.katex .sizing.reset-size1.size11{font-size:4.976em}.katex .fontsize-ensurer.reset-size2.size1,.katex .sizing.reset-size2.size1{font-size:.8333333333em}.katex .fontsize-ensurer.reset-size2.size2,.katex .sizing.reset-size2.size2{font-size:1em}.katex .fontsize-ensurer.reset-size2.size3,.katex .sizing.reset-size2.size3{font-size:1.1666666667em}.katex .fontsize-ensurer.reset-size2.size4,.katex .sizing.reset-size2.size4{font-size:1.3333333333em}.katex .fontsize-ensurer.reset-size2.size5,.katex .sizing.reset-size2.size5{font-size:1.5em}.katex .fontsize-ensurer.reset-size2.size6,.katex .sizing.reset-size2.size6{font-size:1.6666666667em}.katex .fontsize-ensurer.reset-size2.size7,.katex .sizing.reset-size2.size7{font-size:2em}.katex .fontsize-ensurer.reset-size2.size8,.katex .sizing.reset-size2.size8{font-size:2.4em}.katex .fontsize-ensurer.reset-size2.size9,.katex .sizing.reset-size2.size9{font-size:2.88em}.katex .fontsize-ensurer.reset-size2.size10,.katex .sizing.reset-size2.size10{font-size:3.4566666667em}.katex .fontsize-ensurer.reset-size2.size11,.katex .sizing.reset-size2.size11{font-size:4.1466666667em}.katex .fontsize-ensurer.reset-size3.size1,.katex .sizing.reset-size3.size1{font-size:.7142857143em}.katex .fontsize-ensurer.reset-size3.size2,.katex .sizing.reset-size3.size2{font-size:.8571428571em}.katex .fontsize-ensurer.reset-size3.size3,.katex .sizing.reset-size3.size3{font-size:1em}.katex .fontsize-ensurer.reset-size3.size4,.katex .sizing.reset-size3.size4{font-size:1.1428571429em}.katex .fontsize-ensurer.reset-size3.size5,.katex .sizing.reset-size3.size5{font-size:1.2857142857em}.katex .fontsize-ensurer.reset-size3.size6,.katex .sizing.reset-size3.size6{font-size:1.4285714286em}.katex .fontsize-ensurer.reset-size3.size7,.katex .sizing.reset-size3.size7{font-size:1.7142857143em}.katex .fontsize-ensurer.reset-size3.size8,.katex .sizing.reset-size3.size8{font-size:2.0571428571em}.katex .fontsize-ensurer.reset-size3.size9,.katex .sizing.reset-size3.size9{font-size:2.4685714286em}.katex .fontsize-ensurer.reset-size3.size10,.katex .sizing.reset-size3.size10{font-size:2.9628571429em}.katex .fontsize-ensurer.reset-size3.size11,.katex .sizing.reset-size3.size11{font-size:3.5542857143em}.katex .fontsize-ensurer.reset-size4.size1,.katex .sizing.reset-size4.size1{font-size:.625em}.katex .fontsize-ensurer.reset-size4.size2,.katex .sizing.reset-size4.size2{font-size:.75em}.katex .fontsize-ensurer.reset-size4.size3,.katex .sizing.reset-size4.size3{font-size:.875em}.katex .fontsize-ensurer.reset-size4.size4,.katex .sizing.reset-size4.size4{font-size:1em}.katex .fontsize-ensurer.reset-size4.size5,.katex .sizing.reset-size4.size5{font-size:1.125em}.katex .fontsize-ensurer.reset-size4.size6,.katex .sizing.reset-size4.size6{font-size:1.25em}.katex .fontsize-ensurer.reset-size4.size7,.katex .sizing.reset-size4.size7{font-size:1.5em}.katex .fontsize-ensurer.reset-size4.size8,.katex .sizing.reset-size4.size8{font-size:1.8em}.katex .fontsize-ensurer.reset-size4.size9,.katex .sizing.reset-size4.size9{font-size:2.16em}.katex .fontsize-ensurer.reset-size4.size10,.katex .sizing.reset-size4.size10{font-size:2.5925em}.katex .fontsize-ensurer.reset-size4.size11,.katex .sizing.reset-size4.size11{font-size:3.11em}.katex .fontsize-ensurer.reset-size5.size1,.katex .sizing.reset-size5.size1{font-size:.5555555556em}.katex .fontsize-ensurer.reset-size5.size2,.katex .sizing.reset-size5.size2{font-size:.6666666667em}.katex .fontsize-ensurer.reset-size5.size3,.katex .sizing.reset-size5.size3{font-size:.7777777778em}.katex .fontsize-ensurer.reset-size5.size4,.katex .sizing.reset-size5.size4{font-size:.8888888889em}.katex .fontsize-ensurer.reset-size5.size5,.katex .sizing.reset-size5.size5{font-size:1em}.katex .fontsize-ensurer.reset-size5.size6,.katex .sizing.reset-size5.size6{font-size:1.1111111111em}.katex .fontsize-ensurer.reset-size5.size7,.katex .sizing.reset-size5.size7{font-size:1.3333333333em}.katex .fontsize-ensurer.reset-size5.size8,.katex .sizing.reset-size5.size8{font-size:1.6em}.katex .fontsize-ensurer.reset-size5.size9,.katex .sizing.reset-size5.size9{font-size:1.92em}.katex .fontsize-ensurer.reset-size5.size10,.katex .sizing.reset-size5.size10{font-size:2.3044444444em}.katex .fontsize-ensurer.reset-size5.size11,.katex .sizing.reset-size5.size11{font-size:2.7644444444em}.katex .fontsize-ensurer.reset-size6.size1,.katex .sizing.reset-size6.size1{font-size:.5em}.katex .fontsize-ensurer.reset-size6.size2,.katex .sizing.reset-size6.size2{font-size:.6em}.katex .fontsize-ensurer.reset-size6.size3,.katex .sizing.reset-size6.size3{font-size:.7em}.katex .fontsize-ensurer.reset-size6.size4,.katex .sizing.reset-size6.size4{font-size:.8em}.katex .fontsize-ensurer.reset-size6.size5,.katex .sizing.reset-size6.size5{font-size:.9em}.katex .fontsize-ensurer.reset-size6.size6,.katex .sizing.reset-size6.size6{font-size:1em}.katex .fontsize-ensurer.reset-size6.size7,.katex .sizing.reset-size6.size7{font-size:1.2em}.katex .fontsize-ensurer.reset-size6.size8,.katex .sizing.reset-size6.size8{font-size:1.44em}.katex .fontsize-ensurer.reset-size6.size9,.katex .sizing.reset-size6.size9{font-size:1.728em}.katex .fontsize-ensurer.reset-size6.size10,.katex .sizing.reset-size6.size10{font-size:2.074em}.katex .fontsize-ensurer.reset-size6.size11,.katex .sizing.reset-size6.size11{font-size:2.488em}.katex .fontsize-ensurer.reset-size7.size1,.katex .sizing.reset-size7.size1{font-size:.4166666667em}.katex .fontsize-ensurer.reset-size7.size2,.katex .sizing.reset-size7.size2{font-size:.5em}.katex .fontsize-ensurer.reset-size7.size3,.katex .sizing.reset-size7.size3{font-size:.5833333333em}.katex .fontsize-ensurer.reset-size7.size4,.katex .sizing.reset-size7.size4{font-size:.6666666667em}.katex .fontsize-ensurer.reset-size7.size5,.katex .sizing.reset-size7.size5{font-size:.75em}.katex .fontsize-ensurer.reset-size7.size6,.katex .sizing.reset-size7.size6{font-size:.8333333333em}.katex .fontsize-ensurer.reset-size7.size7,.katex .sizing.reset-size7.size7{font-size:1em}.katex .fontsize-ensurer.reset-size7.size8,.katex .sizing.reset-size7.size8{font-size:1.2em}.katex .fontsize-ensurer.reset-size7.size9,.katex .sizing.reset-size7.size9{font-size:1.44em}.katex .fontsize-ensurer.reset-size7.size10,.katex .sizing.reset-size7.size10{font-size:1.7283333333em}.katex .fontsize-ensurer.reset-size7.size11,.katex .sizing.reset-size7.size11{font-size:2.0733333333em}.katex .fontsize-ensurer.reset-size8.size1,.katex .sizing.reset-size8.size1{font-size:.3472222222em}.katex .fontsize-ensurer.reset-size8.size2,.katex .sizing.reset-size8.size2{font-size:.4166666667em}.katex .fontsize-ensurer.reset-size8.size3,.katex .sizing.reset-size8.size3{font-size:.4861111111em}.katex .fontsize-ensurer.reset-size8.size4,.katex .sizing.reset-size8.size4{font-size:.5555555556em}.katex .fontsize-ensurer.reset-size8.size5,.katex .sizing.reset-size8.size5{font-size:.625em}.katex .fontsize-ensurer.reset-size8.size6,.katex .sizing.reset-size8.size6{font-size:.6944444444em}.katex .fontsize-ensurer.reset-size8.size7,.katex .sizing.reset-size8.size7{font-size:.8333333333em}.katex .fontsize-ensurer.reset-size8.size8,.katex .sizing.reset-size8.size8{font-size:1em}.katex .fontsize-ensurer.reset-size8.size9,.katex .sizing.reset-size8.size9{font-size:1.2em}.katex .fontsize-ensurer.reset-size8.size10,.katex .sizing.reset-size8.size10{font-size:1.4402777778em}.katex .fontsize-ensurer.reset-size8.size11,.katex .sizing.reset-size8.size11{font-size:1.7277777778em}.katex .fontsize-ensurer.reset-size9.size1,.katex .sizing.reset-size9.size1{font-size:.2893518519em}.katex .fontsize-ensurer.reset-size9.size2,.katex .sizing.reset-size9.size2{font-size:.3472222222em}.katex .fontsize-ensurer.reset-size9.size3,.katex .sizing.reset-size9.size3{font-size:.4050925926em}.katex .fontsize-ensurer.reset-size9.size4,.katex .sizing.reset-size9.size4{font-size:.462962963em}.katex .fontsize-ensurer.reset-size9.size5,.katex .sizing.reset-size9.size5{font-size:.5208333333em}.katex .fontsize-ensurer.reset-size9.size6,.katex .sizing.reset-size9.size6{font-size:.5787037037em}.katex .fontsize-ensurer.reset-size9.size7,.katex .sizing.reset-size9.size7{font-size:.6944444444em}.katex .fontsize-ensurer.reset-size9.size8,.katex .sizing.reset-size9.size8{font-size:.8333333333em}.katex .fontsize-ensurer.reset-size9.size9,.katex .sizing.reset-size9.size9{font-size:1em}.katex .fontsize-ensurer.reset-size9.size10,.katex .sizing.reset-size9.size10{font-size:1.2002314815em}.katex .fontsize-ensurer.reset-size9.size11,.katex .sizing.reset-size9.size11{font-size:1.4398148148em}.katex .fontsize-ensurer.reset-size10.size1,.katex .sizing.reset-size10.size1{font-size:.2410800386em}.katex .fontsize-ensurer.reset-size10.size2,.katex .sizing.reset-size10.size2{font-size:.2892960463em}.katex .fontsize-ensurer.reset-size10.size3,.katex .sizing.reset-size10.size3{font-size:.337512054em}.katex .fontsize-ensurer.reset-size10.size4,.katex .sizing.reset-size10.size4{font-size:.3857280617em}.katex .fontsize-ensurer.reset-size10.size5,.katex .sizing.reset-size10.size5{font-size:.4339440694em}.katex .fontsize-ensurer.reset-size10.size6,.katex .sizing.reset-size10.size6{font-size:.4821600771em}.katex .fontsize-ensurer.reset-size10.size7,.katex .sizing.reset-size10.size7{font-size:.5785920926em}.katex .fontsize-ensurer.reset-size10.size8,.katex .sizing.reset-size10.size8{font-size:.6943105111em}.katex .fontsize-ensurer.reset-size10.size9,.katex .sizing.reset-size10.size9{font-size:.8331726133em}.katex .fontsize-ensurer.reset-size10.size10,.katex .sizing.reset-size10.size10{font-size:1em}.katex .fontsize-ensurer.reset-size10.size11,.katex .sizing.reset-size10.size11{font-size:1.1996142719em}.katex .fontsize-ensurer.reset-size11.size1,.katex .sizing.reset-size11.size1{font-size:.2009646302em}.katex .fontsize-ensurer.reset-size11.size2,.katex .sizing.reset-size11.size2{font-size:.2411575563em}.katex .fontsize-ensurer.reset-size11.size3,.katex .sizing.reset-size11.size3{font-size:.2813504823em}.katex .fontsize-ensurer.reset-size11.size4,.katex .sizing.reset-size11.size4{font-size:.3215434084em}.katex .fontsize-ensurer.reset-size11.size5,.katex .sizing.reset-size11.size5{font-size:.3617363344em}.katex .fontsize-ensurer.reset-size11.size6,.katex .sizing.reset-size11.size6{font-size:.4019292605em}.katex .fontsize-ensurer.reset-size11.size7,.katex .sizing.reset-size11.size7{font-size:.4823151125em}.katex .fontsize-ensurer.reset-size11.size8,.katex .sizing.reset-size11.size8{font-size:.578778135em}.katex .fontsize-ensurer.reset-size11.size9,.katex .sizing.reset-size11.size9{font-size:.6945337621em}.katex .fontsize-ensurer.reset-size11.size10,.katex .sizing.reset-size11.size10{font-size:.8336012862em}.katex .fontsize-ensurer.reset-size11.size11,.katex .sizing.reset-size11.size11{font-size:1em}.katex .delimsizing.size1{font-family:KaTeX_Size1}.katex .delimsizing.size2{font-family:KaTeX_Size2}.katex .delimsizing.size3{font-family:KaTeX_Size3}.katex .delimsizing.size4{font-family:KaTeX_Size4}.katex .delimsizing.mult .delim-size1>span{font-family:KaTeX_Size1}.katex .delimsizing.mult .delim-size4>span{font-family:KaTeX_Size4}.katex .nulldelimiter{display:inline-block;width:.12em}.katex .delimcenter,.katex .op-symbol{position:relative}.katex .op-symbol.small-op{font-family:KaTeX_Size1}.katex .op-symbol.large-op{font-family:KaTeX_Size2}.katex .accent>.vlist-t,.katex .op-limits>.vlist-t{text-align:center}.katex .accent .accent-body{position:relative}.katex .accent .accent-body:not(.accent-full){width:0}.katex .overlay{display:block}.katex .mtable .vertical-separator{display:inline-block;min-width:1px}.katex .mtable .arraycolsep{display:inline-block}.katex .mtable .col-align-c>.vlist-t{text-align:center}.katex .mtable .col-align-l>.vlist-t{text-align:left}.katex .mtable .col-align-r>.vlist-t{text-align:right}.katex .svg-align{text-align:left}.katex svg{fill:currentColor;stroke:currentColor;fill-rule:nonzero;fill-opacity:1;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;display:block;height:inherit;position:absolute;width:100%}.katex svg path{stroke:none}.katex img{border-style:none;max-height:none;max-width:none;min-height:0;min-width:0}.katex .stretchy{display:block;overflow:hidden;position:relative;width:100%}.katex .stretchy:after,.katex .stretchy:before{content:""}.katex .hide-tail{overflow:hidden;position:relative;width:100%}.katex .halfarrow-left{left:0;overflow:hidden;position:absolute;width:50.2%}.katex .halfarrow-right{overflow:hidden;position:absolute;right:0;width:50.2%}.katex .brace-left{left:0;overflow:hidden;position:absolute;width:25.1%}.katex .brace-center{left:25%;overflow:hidden;position:absolute;width:50%}.katex .brace-right{overflow:hidden;position:absolute;right:0;width:25.1%}.katex .x-arrow-pad{padding:0 .5em}.katex .cd-arrow-pad{padding:0 .55556em 0 .27778em}.katex .mover,.katex .munder,.katex .x-arrow{text-align:center}.katex .boxpad{padding:0 .3em}.katex .fbox,.katex .fcolorbox{border:.04em solid;box-sizing:border-box}.katex .cancel-pad{padding:0 .2em}.katex .cancel-lap{margin-left:-.2em;margin-right:-.2em}.katex .sout{border-bottom-style:solid;border-bottom-width:.08em}.katex .angl{border-right:.049em solid;border-top:.049em solid;box-sizing:border-box;margin-right:.03889em}.katex .anglpad{padding:0 .03889em}.katex .eqn-num:before{content:"(" counter(katexEqnNo) ")";counter-increment:katexEqnNo}.katex .mml-eqn-num:before{content:"(" counter(mmlEqnNo) ")";counter-increment:mmlEqnNo}.katex .mtr-glue{width:50%}.katex .cd-vert-arrow{display:inline-block;position:relative}.katex .cd-label-left{display:inline-block;position:absolute;right:calc(50% + .3em);text-align:left}.katex .cd-label-right{display:inline-block;left:calc(50% + .3em);position:absolute;text-align:right}.katex-display{display:block;margin:1em 0;text-align:center}.katex-display>.katex{display:block;text-align:center;white-space:nowrap}.katex-display>.katex>.katex-html{display:block;position:relative}.katex-display>.katex>.katex-html>.tag{position:absolute;right:0}.katex-display.leqno>.katex>.katex-html>.tag{left:0;right:auto}.katex-display.fleqn>.katex{padding-left:2em;text-align:left}body{counter-reset:katexEqnNo mmlEqnNo}



================================================
FILE: docs/src/starlight.custom.css
URL: https://github.com/tact-lang/tact/blob/main/docs/src/starlight.custom.css
================================================
/*
	Color palettes are generated via:
	https://starlight.astro.build/guides/css-and-tailwind/#color-theme-editor
*/

/* Dark mode colors. */
:root {
	--sl-color-accent-low: #00234c;
	--sl-color-accent: #0067c9;
	--sl-color-accent-high: #a4ccff;
	--sl-color-white: #ffffff;
	--sl-color-gray-1: #eceef2;
	--sl-color-gray-2: #c0c2c7;
	--sl-color-gray-3: #888b96;
	--sl-color-gray-4: #545861;
	--sl-color-gray-5: #353841;
	--sl-color-gray-6: #24272f;
	--sl-color-black: #17181c;
}

/* Light mode colors. */
:root[data-theme='light'] {
	--sl-color-accent-low: #bddaff;
	--sl-color-accent: #0069cd;
	--sl-color-accent-high: #003166;
	--sl-color-white: #17181c;
	--sl-color-gray-1: #24272f;
	--sl-color-gray-2: #353841;
	--sl-color-gray-3: #545861;
	--sl-color-gray-4: #888b96;
	--sl-color-gray-5: #c0c2c7;
	--sl-color-gray-6: #eceef2;
	--sl-color-gray-7: #f5f6f8;
	--sl-color-black: #ffffff;
}

/*
	Base inline code highlighting colors on the general mode/theme colors.
	The value of those CSS variables are set
	in the ./../inline-code-highlighting.js script for each target <span>.
*/
:root code:not(pre *)>span {
	color: var(--shiki-dark);
}

:root[data-theme='light'] code:not(pre *)>span {
	color: var(--shiki-light);
}

/*
	This restores proper width on the index page,
	which uses the `template: doc` in combination
	with a hero element, sidebar, and a disabled ToC (table of contents)
*/
html[data-has-hero] {
	--sl-content-width: 67.5rem;
}

/* Clip the right side of the view */
.fifty {
	clip-path: inset(0 0 0 50%);
}

/* Add bigger margin between steps. */
.sl-steps>li+li {
	margin-top: 1.25rem;
}

/* Add an autolink '#' to headings */

h1 .autolink-header,
h5 .autolink-header,
h6 .autolink-header {
	display: none;
}

h2:hover .autolink-header,
h3:hover .autolink-header,
h4:hover .autolink-header {
	opacity: 1;
}

.autolink-header {
	opacity: 0;
	transition: opacity 0.1s ease-in-out;
	margin-left: 4px;
	text-decoration: none;
}

.autolink-header::after {
	content: '#';
	color: #7d8080;
	padding-left: 0.25rem;
	padding-right: 0.25rem;
}

:root[data-theme~='light'] .autolink-header::after {
	color: #acaeae;
}

/* # */

/* Disable bold fonts on nested group labels */
ul ul div.group-label>span.large {
	font-size: var(--sl-text-sm);
	font-weight: inherit;
	color: inherit;
}

/* Add a sidebar separator */
.sidebar-separator {
	margin-top: 1rem;
	font-weight: 600;
	pointer-events: none;
}

/* Prevent work breaks in inline code items in tables */
td>code,
td>a>code {
	white-space: nowrap;
}

/* Prevent inline code snippets from changing background color */
code:not(pre *) {
	background-color: var(--sl-color-bg-inline-code) !important;
}

/* Stylizing <a> links to Web IDE */
.web-ide-link {
	display: flex;
	justify-content: right;
	text-decoration: none;
	margin-top: 0.25rem;
	margin-bottom: 1rem;
}

/* Stylizing <span> tags inside <a> links to Web IDE */
.web-ide-link-span {
	/* from .sl-badge */
	display: inline-block;
	border: 1px solid var(--sl-color-border-badge);
	border-radius: 0.25rem;
	font-family: var(--sl-font-system-mono);
	line-height: normal;
	color: var(--sl-color-text-badge);
	background-color: var(--sl-color-bg-badge);
	overflow-wrap: anywhere;

	/* from .default */
	--sl-color-bg-badge: var(--sl-badge-default-bg);
	--sl-color-border-badge: var(--sl-badge-default-border);
	--sl-color-text-badge: var(--sl-badge-default-text);

	/* from .small */
	font-size: var(--sl-text-xs);
	padding: 0.125rem 0.25rem;
}



================================================
FILE: docs/themes/one-light-mod.jsonc
URL: https://github.com/tact-lang/tact/blob/main/docs/themes/one-light-mod.jsonc
================================================
// A modified version of https://github.com/akamud/vscode-theme-onelight,
// with adjusted highlighting for keyword.operator.new.
//
// The MIT License (MIT)
//
// Copyright (c) 2015 Mahmoud Ali
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
{"author":"akamud","name":"one-light-mod","colors":{"activityBar.background":"#FAFAFA","activityBar.foreground":"#121417","editorInlayHint.background":"#F5F5F5","editorInlayHint.foreground":"#AFB2BB","notebook.cellEditorBackground":"#F5F5F5","activityBarBadge.background":"#526FFF","activityBarBadge.foreground":"#FFFFFF","button.background":"#5871EF","button.foreground":"#FFFFFF","button.hoverBackground":"#6B83ED","diffEditor.insertedTextBackground":"#00809B33","dropdown.background":"#FFFFFF","dropdown.border":"#DBDBDC","editorIndentGuide.activeBackground":"#626772","editor.background":"#FAFAFA","editor.foreground":"#383A42","editor.lineHighlightBackground":"#383A420C","editor.selectionBackground":"#E5E5E6","editorCursor.foreground":"#526FFF","editor.findMatchHighlightBackground":"#526FFF33","editorGroup.background":"#EAEAEB","editorGroup.border":"#DBDBDC","editorGroupHeader.tabsBackground":"#EAEAEB","editorIndentGuide.background":"#383A4233","editorLineNumber.foreground":"#9D9D9F","editorLineNumber.activeForeground":"#383A42","editorWhitespace.foreground":"#383A4233","editorRuler.foreground":"#383A4233","editorHoverWidget.background":"#EAEAEB","editorHoverWidget.border":"#DBDBDC","editorSuggestWidget.background":"#EAEAEB","editorSuggestWidget.border":"#DBDBDC","editorSuggestWidget.selectedBackground":"#FFFFFF","editorWidget.background":"#EAEAEB","editorWidget.border":"#E5E5E6","input.background":"#FFFFFF","input.border":"#DBDBDC","focusBorder":"#526FFF","list.activeSelectionBackground":"#DBDBDC","list.activeSelectionForeground":"#232324","list.focusBackground":"#DBDBDC","list.hoverBackground":"#DBDBDC66","list.highlightForeground":"#121417","list.inactiveSelectionBackground":"#DBDBDC","list.inactiveSelectionForeground":"#232324","notification.background":"#333333","pickerGroup.border":"#526FFF","scrollbarSlider.background":"#4E566680","scrollbarSlider.activeBackground":"#747D9180","scrollbarSlider.hoverBackground":"#5A637580","sideBar.background":"#EAEAEB","sideBarSectionHeader.background":"#FAFAFA","statusBar.background":"#EAEAEB","statusBar.foreground":"#424243","statusBarItem.hoverBackground":"#DBDBDC","statusBar.noFolderBackground":"#EAEAEB","tab.activeBackground":"#FAFAFA","tab.activeForeground":"#121417","tab.border":"#DBDBDC","tab.inactiveBackground":"#EAEAEB","titleBar.activeBackground":"#EAEAEB","titleBar.activeForeground":"#424243","titleBar.inactiveBackground":"#EAEAEB","titleBar.inactiveForeground":"#424243","statusBar.debuggingForeground":"#FFFFFF","extensionButton.prominentBackground":"#3BBA54","extensionButton.prominentHoverBackground":"#4CC263","badge.background":"#526FFF","badge.foreground":"#FFFFFF","peekView.border":"#526FFF","peekViewResult.background":"#EAEAEB","peekViewResult.selectionBackground":"#DBDBDC","peekViewTitle.background":"#FFFFFF","peekViewEditor.background":"#FFFFFF"},"tokenColors":[{"name":"Comment","scope":["comment"],"settings":{"foreground":"#A0A1A7","fontStyle":"italic"}},{"name":"Comment Markup Link","scope":["comment markup.link"],"settings":{"foreground":"#A0A1A7"}},{"name":"Entity Name Type","scope":["entity.name.type"],"settings":{"foreground":"#C18401"}},{"name":"Entity Other Inherited Class","scope":["entity.other.inherited-class"],"settings":{"foreground":"#C18401"}},{"name":"Keyword","scope":["keyword"],"settings":{"foreground":"#A626A4"}},{"name":"Keyword Control","scope":["keyword.control"],"settings":{"foreground":"#A626A4"}},{"name":"Keyword Operator","scope":["keyword.operator"],"settings":{"foreground":"#383A42"}},{"name":"Keyword Operator New","scope":["keyword.operator.new"],"settings":{"foreground":"#A626A4"}},{"name":"Keyword Other Special Method","scope":["keyword.other.special-method"],"settings":{"foreground":"#4078F2"}},{"name":"Keyword Other Unit","scope":["keyword.other.unit"],"settings":{"foreground":"#986801"}},{"name":"Storage","scope":["storage"],"settings":{"foreground":"#A626A4"}},{"name":"Storage Type Annotation,storage Type Primitive","scope":["storage.type.annotation","storage.type.primitive"],"settings":{"foreground":"#A626A4"}},{"name":"Storage Modifier Package,storage Modifier Import","scope":["storage.modifier.package","storage.modifier.import"],"settings":{"foreground":"#383A42"}},{"name":"Constant","scope":["constant"],"settings":{"foreground":"#986801"}},{"name":"Constant Variable","scope":["constant.variable"],"settings":{"foreground":"#986801"}},{"name":"Constant Character Escape","scope":["constant.character.escape"],"settings":{"foreground":"#0184BC"}},{"name":"Constant Numeric","scope":["constant.numeric"],"settings":{"foreground":"#986801"}},{"name":"Constant Other Color","scope":["constant.other.color"],"settings":{"foreground":"#0184BC"}},{"name":"Constant Other Symbol","scope":["constant.other.symbol"],"settings":{"foreground":"#0184BC"}},{"name":"Variable","scope":["variable"],"settings":{"foreground":"#E45649"}},{"name":"Variable Interpolation","scope":["variable.interpolation"],"settings":{"foreground":"#CA1243"}},{"name":"Variable Parameter","scope":["variable.parameter"],"settings":{"foreground":"#383A42"}},{"name":"String","scope":["string"],"settings":{"foreground":"#50A14F"}},{"name":"String > Source,string Embedded","scope":["string > source","string embedded"],"settings":{"foreground":"#383A42"}},{"name":"String Regexp","scope":["string.regexp"],"settings":{"foreground":"#0184BC"}},{"name":"String Regexp Source Ruby Embedded","scope":["string.regexp source.ruby.embedded"],"settings":{"foreground":"#C18401"}},{"name":"String Other Link","scope":["string.other.link"],"settings":{"foreground":"#E45649"}},{"name":"Punctuation Definition Comment","scope":["punctuation.definition.comment"],"settings":{"foreground":"#A0A1A7"}},{"name":"Punctuation Definition Method Parameters,punctuation Definition Function Parameters,punctuation Definition Parameters,punctuation Definition Separator,punctuation Definition Separator,punctuation Definition Array","scope":["punctuation.definition.method-parameters","punctuation.definition.function-parameters","punctuation.definition.parameters","punctuation.definition.separator","punctuation.definition.separator","punctuation.definition.array"],"settings":{"foreground":"#383A42"}},{"name":"Punctuation Definition Heading,punctuation Definition Identity","scope":["punctuation.definition.heading","punctuation.definition.identity"],"settings":{"foreground":"#4078F2"}},{"name":"Punctuation Definition Bold","scope":["punctuation.definition.bold"],"settings":{"foreground":"#C18401","fontStyle":"bold"}},{"name":"Punctuation Definition Italic","scope":["punctuation.definition.italic"],"settings":{"foreground":"#A626A4","fontStyle":"italic"}},{"name":"Punctuation Section Embedded","scope":["punctuation.section.embedded"],"settings":{"foreground":"#CA1243"}},{"name":"Punctuation Section Method,punctuation Section Class,punctuation Section Inner Class","scope":["punctuation.section.method","punctuation.section.class","punctuation.section.inner-class"],"settings":{"foreground":"#383A42"}},{"name":"Support Class","scope":["support.class"],"settings":{"foreground":"#C18401"}},{"name":"Support Type","scope":["support.type"],"settings":{"foreground":"#0184BC"}},{"name":"Support Function","scope":["support.function"],"settings":{"foreground":"#0184BC"}},{"name":"Support Function Any Method","scope":["support.function.any-method"],"settings":{"foreground":"#4078F2"}},{"name":"Entity Name Function","scope":["entity.name.function"],"settings":{"foreground":"#4078F2"}},{"name":"Entity Name Class,entity Name Type Class","scope":["entity.name.class","entity.name.type.class"],"settings":{"foreground":"#C18401"}},{"name":"Entity Name Section","scope":["entity.name.section"],"settings":{"foreground":"#4078F2"}},{"name":"Entity Name Tag","scope":["entity.name.tag"],"settings":{"foreground":"#E45649"}},{"name":"Entity Other Attribute Name","scope":["entity.other.attribute-name"],"settings":{"foreground":"#986801"}},{"name":"Entity Other Attribute Name Id","scope":["entity.other.attribute-name.id"],"settings":{"foreground":"#4078F2"}},{"name":"Meta Class","scope":["meta.class"],"settings":{"foreground":"#C18401"}},{"name":"Meta Class Body","scope":["meta.class.body"],"settings":{"foreground":"#383A42"}},{"name":"Meta Method Call,meta Method","scope":["meta.method-call","meta.method"],"settings":{"foreground":"#383A42"}},{"name":"Meta Definition Variable","scope":["meta.definition.variable"],"settings":{"foreground":"#E45649"}},{"name":"Meta Link","scope":["meta.link"],"settings":{"foreground":"#986801"}},{"name":"Meta Require","scope":["meta.require"],"settings":{"foreground":"#4078F2"}},{"name":"Meta Selector","scope":["meta.selector"],"settings":{"foreground":"#A626A4"}},{"name":"Meta Separator","scope":["meta.separator"],"settings":{"foreground":"#383A42"}},{"name":"Meta Tag","scope":["meta.tag"],"settings":{"foreground":"#383A42"}},{"name":"Underline","scope":["underline"],"settings":{"text-decoration":"underline"}},{"name":"None","scope":["none"],"settings":{"foreground":"#383A42"}},{"name":"Invalid Deprecated","scope":["invalid.deprecated"],"settings":{"foreground":"#000000","background":"#F2A60D"}},{"name":"Invalid Illegal","scope":["invalid.illegal"],"settings":{"foreground":"white","background":"#FF1414"}},{"name":"Markup Bold","scope":["markup.bold"],"settings":{"foreground":"#986801","fontStyle":"bold"}},{"name":"Markup Changed","scope":["markup.changed"],"settings":{"foreground":"#A626A4"}},{"name":"Markup Deleted","scope":["markup.deleted"],"settings":{"foreground":"#E45649"}},{"name":"Markup Italic","scope":["markup.italic"],"settings":{"foreground":"#A626A4","fontStyle":"italic"}},{"name":"Markup Heading","scope":["markup.heading"],"settings":{"foreground":"#E45649"}},{"name":"Markup Heading Punctuation Definition Heading","scope":["markup.heading punctuation.definition.heading"],"settings":{"foreground":"#4078F2"}},{"name":"Markup Link","scope":["markup.link"],"settings":{"foreground":"#0184BC"}},{"name":"Markup Inserted","scope":["markup.inserted"],"settings":{"foreground":"#50A14F"}},{"name":"Markup Quote","scope":["markup.quote"],"settings":{"foreground":"#986801"}},{"name":"Markup Raw","scope":["markup.raw"],"settings":{"foreground":"#50A14F"}},{"name":"Source C Keyword Operator","scope":["source.c keyword.operator"],"settings":{"foreground":"#A626A4"}},{"name":"Source Cpp Keyword Operator","scope":["source.cpp keyword.operator"],"settings":{"foreground":"#A626A4"}},{"name":"Source Cs Keyword Operator","scope":["source.cs keyword.operator"],"settings":{"foreground":"#A626A4"}},{"name":"Source Css Property Name,source Css Property Value","scope":["source.css property-name","source.css property-value"],"settings":{"foreground":"#696C77"}},{"name":"Source Css Property Name Support,source Css Property Value Support","scope":["source.css property-name.support","source.css property-value.support"],"settings":{"foreground":"#383A42"}},{"name":"Source Elixir Source Embedded Source","scope":["source.elixir source.embedded.source"],"settings":{"foreground":"#383A42"}},{"name":"Source Elixir Constant Language,source Elixir Constant Numeric,source Elixir Constant Definition","scope":["source.elixir constant.language","source.elixir constant.numeric","source.elixir constant.definition"],"settings":{"foreground":"#4078F2"}},{"name":"Source Elixir Variable Definition,source Elixir Variable Anonymous","scope":["source.elixir variable.definition","source.elixir variable.anonymous"],"settings":{"foreground":"#A626A4"}},{"name":"Source Elixir Parameter Variable Function","scope":["source.elixir parameter.variable.function"],"settings":{"foreground":"#986801","fontStyle":"italic"}},{"name":"Source Elixir Quoted","scope":["source.elixir quoted"],"settings":{"foreground":"#50A14F"}},{"name":"Source Elixir Keyword Special Method,source Elixir Embedded Section,source Elixir Embedded Source Empty","scope":["source.elixir keyword.special-method","source.elixir embedded.section","source.elixir embedded.source.empty"],"settings":{"foreground":"#E45649"}},{"name":"Source Elixir Readwrite Module Punctuation","scope":["source.elixir readwrite.module punctuation"],"settings":{"foreground":"#E45649"}},{"name":"Source Elixir Regexp Section,source Elixir Regexp String","scope":["source.elixir regexp.section","source.elixir regexp.string"],"settings":{"foreground":"#CA1243"}},{"name":"Source Elixir Separator,source Elixir Keyword Operator","scope":["source.elixir separator","source.elixir keyword.operator"],"settings":{"foreground":"#986801"}},{"name":"Source Elixir Variable Constant","scope":["source.elixir variable.constant"],"settings":{"foreground":"#C18401"}},{"name":"Source Elixir Array,source Elixir Scope,source Elixir Section","scope":["source.elixir array","source.elixir scope","source.elixir section"],"settings":{"foreground":"#696C77"}},{"name":"Source Gfm Markup","scope":["source.gfm markup"],"settings":{"-webkit-font-smoothing":"auto"}},{"name":"Source Gfm Link Entity","scope":["source.gfm link entity"],"settings":{"foreground":"#4078F2"}},{"name":"Source Go Storage Type String","scope":["source.go storage.type.string"],"settings":{"foreground":"#A626A4"}},{"name":"Source Ini Keyword Other Definition Ini","scope":["source.ini keyword.other.definition.ini"],"settings":{"foreground":"#E45649"}},{"name":"Source Java Storage Modifier Import","scope":["source.java storage.modifier.import"],"settings":{"foreground":"#C18401"}},{"name":"Source Java Storage Type","scope":["source.java storage.type"],"settings":{"foreground":"#C18401"}},{"name":"Source Java Keyword Operator Instanceof","scope":["source.java keyword.operator.instanceof"],"settings":{"foreground":"#A626A4"}},{"name":"Source Java Properties Meta Key Pair","scope":["source.java-properties meta.key-pair"],"settings":{"foreground":"#E45649"}},{"name":"Source Java Properties Meta Key Pair > Punctuation","scope":["source.java-properties meta.key-pair > punctuation"],"settings":{"foreground":"#383A42"}},{"name":"Source Js Keyword Operator","scope":["source.js keyword.operator"],"settings":{"foreground":"#0184BC"}},{"name":"Source Js Keyword Operator Delete,source Js Keyword Operator In,source Js Keyword Operator Of,source Js Keyword Operator Instanceof,source Js Keyword Operator New,source Js Keyword Operator Typeof,source Js Keyword Operator Void","scope":["source.js keyword.operator.delete","source.js keyword.operator.in","source.js keyword.operator.of","source.js keyword.operator.instanceof","source.js keyword.operator.new","source.js keyword.operator.typeof","source.js keyword.operator.void"],"settings":{"foreground":"#A626A4"}},{"name":"Source Ts Keyword Operator","scope":["source.ts keyword.operator"],"settings":{"foreground":"#0184BC"}},{"name":"Source Flow Keyword Operator","scope":["source.flow keyword.operator"],"settings":{"foreground":"#0184BC"}},{"name":"Source Json Meta Structure Dictionary Json > String Quoted Json","scope":["source.json meta.structure.dictionary.json > string.quoted.json"],"settings":{"foreground":"#E45649"}},{"name":"Source Json Meta Structure Dictionary Json > String Quoted Json > Punctuation String","scope":["source.json meta.structure.dictionary.json > string.quoted.json > punctuation.string"],"settings":{"foreground":"#E45649"}},{"name":"Source Json Meta Structure Dictionary Json > Value Json > String Quoted Json,source Json Meta Structure Array Json > Value Json > String Quoted Json,source Json Meta Structure Dictionary Json > Value Json > String Quoted Json > Punctuation,source Json Meta Structure Array Json > Value Json > String Quoted Json > Punctuation","scope":["source.json meta.structure.dictionary.json > value.json > string.quoted.json","source.json meta.structure.array.json > value.json > string.quoted.json","source.json meta.structure.dictionary.json > value.json > string.quoted.json > punctuation","source.json meta.structure.array.json > value.json > string.quoted.json > punctuation"],"settings":{"foreground":"#50A14F"}},{"name":"Source Json Meta Structure Dictionary Json > Constant Language Json,source Json Meta Structure Array Json > Constant Language Json","scope":["source.json meta.structure.dictionary.json > constant.language.json","source.json meta.structure.array.json > constant.language.json"],"settings":{"foreground":"#0184BC"}},{"name":"Ng Interpolation","scope":["ng.interpolation"],"settings":{"foreground":"#E45649"}},{"name":"Ng Interpolation Begin,ng Interpolation End","scope":["ng.interpolation.begin","ng.interpolation.end"],"settings":{"foreground":"#4078F2"}},{"name":"Ng Interpolation Function","scope":["ng.interpolation function"],"settings":{"foreground":"#E45649"}},{"name":"Ng Interpolation Function Begin,ng Interpolation Function End","scope":["ng.interpolation function.begin","ng.interpolation function.end"],"settings":{"foreground":"#4078F2"}},{"name":"Ng Interpolation Bool","scope":["ng.interpolation bool"],"settings":{"foreground":"#986801"}},{"name":"Ng Interpolation Bracket","scope":["ng.interpolation bracket"],"settings":{"foreground":"#383A42"}},{"name":"Ng Pipe,ng Operator","scope":["ng.pipe","ng.operator"],"settings":{"foreground":"#383A42"}},{"name":"Ng Tag","scope":["ng.tag"],"settings":{"foreground":"#0184BC"}},{"name":"Ng Attribute With Value Attribute Name","scope":["ng.attribute-with-value attribute-name"],"settings":{"foreground":"#C18401"}},{"name":"Ng Attribute With Value String","scope":["ng.attribute-with-value string"],"settings":{"foreground":"#A626A4"}},{"name":"Ng Attribute With Value String Begin,ng Attribute With Value String End","scope":["ng.attribute-with-value string.begin","ng.attribute-with-value string.end"],"settings":{"foreground":"#383A42"}},{"name":"Source Ruby Constant Other Symbol > Punctuation","scope":["source.ruby constant.other.symbol > punctuation"],"settings":{"foreground":"inherit"}},{"name":"Source Php Class Bracket","scope":["source.php class.bracket"],"settings":{"foreground":"#383A42"}},{"name":"Source Python Keyword Operator Logical Python","scope":["source.python keyword.operator.logical.python"],"settings":{"foreground":"#A626A4"}},{"name":"Source Python Variable Parameter","scope":["source.python variable.parameter"],"settings":{"foreground":"#986801"}},{"name":"customrule","scope":"customrule","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Support Type Property Name","scope":"support.type.property-name","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Punctuation for Quoted String","scope":"string.quoted.double punctuation","settings":{"foreground":"#50A14F"}},{"name":"[VSCODE-CUSTOM] Support Constant","scope":"support.constant","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] JSON Property Name","scope":"support.type.property-name.json","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JSON Punctuation for Property Name","scope":"support.type.property-name.json punctuation","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Punctuation for key-value","scope":["punctuation.separator.key-value.ts","punctuation.separator.key-value.js","punctuation.separator.key-value.tsx"],"settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] JS/TS Embedded Operator","scope":["source.js.embedded.html keyword.operator","source.ts.embedded.html keyword.operator"],"settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] JS/TS Variable Other Readwrite","scope":["variable.other.readwrite.js","variable.other.readwrite.ts","variable.other.readwrite.tsx"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Support Variable Dom","scope":["support.variable.dom.js","support.variable.dom.ts"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Support Variable Property Dom","scope":["support.variable.property.dom.js","support.variable.property.dom.ts"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Interpolation String Punctuation","scope":["meta.template.expression.js punctuation.definition","meta.template.expression.ts punctuation.definition"],"settings":{"foreground":"#CA1243"}},{"name":"[VSCODE-CUSTOM] JS/TS Punctuation Type Parameters","scope":["source.ts punctuation.definition.typeparameters","source.js punctuation.definition.typeparameters","source.tsx punctuation.definition.typeparameters"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Definition Block","scope":["source.ts punctuation.definition.block","source.js punctuation.definition.block","source.tsx punctuation.definition.block"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Punctuation Separator Comma","scope":["source.ts punctuation.separator.comma","source.js punctuation.separator.comma","source.tsx punctuation.separator.comma"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Variable Property","scope":["support.variable.property.js","support.variable.property.ts","support.variable.property.tsx"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Default Keyword","scope":["keyword.control.default.js","keyword.control.default.ts","keyword.control.default.tsx"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Instanceof Keyword","scope":["keyword.operator.expression.instanceof.js","keyword.operator.expression.instanceof.ts","keyword.operator.expression.instanceof.tsx"],"settings":{"foreground":"#A626A4"}},{"name":"[VSCODE-CUSTOM] JS/TS Of Keyword","scope":["keyword.operator.expression.of.js","keyword.operator.expression.of.ts","keyword.operator.expression.of.tsx"],"settings":{"foreground":"#A626A4"}},{"name":"[VSCODE-CUSTOM] JS/TS Braces/Brackets","scope":["meta.brace.round.js","meta.array-binding-pattern-variable.js","meta.brace.square.js","meta.brace.round.ts","meta.array-binding-pattern-variable.ts","meta.brace.square.ts","meta.brace.round.tsx","meta.array-binding-pattern-variable.tsx","meta.brace.square.tsx"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Punctuation Accessor","scope":["source.js punctuation.accessor","source.ts punctuation.accessor","source.tsx punctuation.accessor"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Punctuation Terminator Statement","scope":["punctuation.terminator.statement.js","punctuation.terminator.statement.ts","punctuation.terminator.statement.tsx"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Array variables","scope":["meta.array-binding-pattern-variable.js variable.other.readwrite.js","meta.array-binding-pattern-variable.ts variable.other.readwrite.ts","meta.array-binding-pattern-variable.tsx variable.other.readwrite.tsx"],"settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] JS/TS Support Variables","scope":["source.js support.variable","source.ts support.variable","source.tsx support.variable"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Support Variables","scope":["variable.other.constant.property.js","variable.other.constant.property.ts","variable.other.constant.property.tsx"],"settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] JS/TS Keyword New","scope":["keyword.operator.new.ts","keyword.operator.new.j","keyword.operator.new.tsx"],"settings":{"foreground":"#A626A4"}},{"name":"[VSCODE-CUSTOM] TS Keyword Operator","scope":["source.ts keyword.operator","source.tsx keyword.operator"],"settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] JS/TS Punctuation Parameter Separator","scope":["punctuation.separator.parameter.js","punctuation.separator.parameter.ts","punctuation.separator.parameter.tsx "],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Import","scope":["constant.language.import-export-all.js","constant.language.import-export-all.ts"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JSX/TSX Import","scope":["constant.language.import-export-all.jsx","constant.language.import-export-all.tsx"],"settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] JS/TS Keyword Control As","scope":["keyword.control.as.js","keyword.control.as.ts","keyword.control.as.jsx","keyword.control.as.tsx"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Variable Alias","scope":["variable.other.readwrite.alias.js","variable.other.readwrite.alias.ts","variable.other.readwrite.alias.jsx","variable.other.readwrite.alias.tsx"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Constants","scope":["variable.other.constant.js","variable.other.constant.ts","variable.other.constant.jsx","variable.other.constant.tsx"],"settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] JS/TS Export Variable","scope":["meta.export.default.js variable.other.readwrite.js","meta.export.default.ts variable.other.readwrite.ts"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JS/TS Template Strings Punctuation Accessor","scope":["source.js meta.template.expression.js punctuation.accessor","source.ts meta.template.expression.ts punctuation.accessor","source.tsx meta.template.expression.tsx punctuation.accessor"],"settings":{"foreground":"#50A14F"}},{"name":"[VSCODE-CUSTOM] JS/TS Import equals","scope":["source.js meta.import-equals.external.js keyword.operator","source.jsx meta.import-equals.external.jsx keyword.operator","source.ts meta.import-equals.external.ts keyword.operator","source.tsx meta.import-equals.external.tsx keyword.operator"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Type Module","scope":"entity.name.type.module.js,entity.name.type.module.ts,entity.name.type.module.jsx,entity.name.type.module.tsx","settings":{"foreground":"#50A14F"}},{"name":"[VSCODE-CUSTOM] JS/TS Meta Class","scope":"meta.class.js,meta.class.ts,meta.class.jsx,meta.class.tsx","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Property Definition Variable","scope":["meta.definition.property.js variable","meta.definition.property.ts variable","meta.definition.property.jsx variable","meta.definition.property.tsx variable"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Meta Type Parameters Type","scope":["meta.type.parameters.js support.type","meta.type.parameters.jsx support.type","meta.type.parameters.ts support.type","meta.type.parameters.tsx support.type"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Meta Tag Keyword Operator","scope":["source.js meta.tag.js keyword.operator","source.jsx meta.tag.jsx keyword.operator","source.ts meta.tag.ts keyword.operator","source.tsx meta.tag.tsx keyword.operator"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Meta Tag Punctuation","scope":["meta.tag.js punctuation.section.embedded","meta.tag.jsx punctuation.section.embedded","meta.tag.ts punctuation.section.embedded","meta.tag.tsx punctuation.section.embedded"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Meta Array Literal Variable","scope":["meta.array.literal.js variable","meta.array.literal.jsx variable","meta.array.literal.ts variable","meta.array.literal.tsx variable"],"settings":{"foreground":"#C18401"}},{"name":"[VSCODE-CUSTOM] JS/TS Module Exports","scope":["support.type.object.module.js","support.type.object.module.jsx","support.type.object.module.ts","support.type.object.module.tsx"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] JSON Constants","scope":["constant.language.json"],"settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] JS/TS Object Constants","scope":["variable.other.constant.object.js","variable.other.constant.object.jsx","variable.other.constant.object.ts","variable.other.constant.object.tsx"],"settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] JS/TS Properties Keyword","scope":["storage.type.property.js","storage.type.property.jsx","storage.type.property.ts","storage.type.property.tsx"],"settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] JS/TS Single Quote Inside Templated String","scope":["meta.template.expression.js string.quoted punctuation.definition","meta.template.expression.jsx string.quoted punctuation.definition","meta.template.expression.ts string.quoted punctuation.definition","meta.template.expression.tsx string.quoted punctuation.definition"],"settings":{"foreground":"#50A14F"}},{"name":"[VSCODE-CUSTOM] JS/TS Backtick inside Templated String","scope":["meta.template.expression.js string.template punctuation.definition.string.template","meta.template.expression.jsx string.template punctuation.definition.string.template","meta.template.expression.ts string.template punctuation.definition.string.template","meta.template.expression.tsx string.template punctuation.definition.string.template"],"settings":{"foreground":"#50A14F"}},{"name":"[VSCODE-CUSTOM] JS/TS In Keyword for Loops","scope":["keyword.operator.expression.in.js","keyword.operator.expression.in.jsx","keyword.operator.expression.in.ts","keyword.operator.expression.in.tsx"],"settings":{"foreground":"#A626A4"}},{"name":"[VSCODE-CUSTOM] JS/TS Variable Other Object","scope":["variable.other.object.js","variable.other.object.ts"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] JS/TS Meta Object Literal Key","scope":["meta.object-literal.key.js","meta.object-literal.key.ts"],"settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Python Constants Other","scope":"source.python constant.other","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Python Constants","scope":"source.python constant","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Python Placeholder Character","scope":"constant.character.format.placeholder.other.python storage","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Python Magic","scope":"support.variable.magic.python","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Python Meta Function Parameters","scope":"meta.function.parameters.python","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Python Function Separator Annotation","scope":"punctuation.separator.annotation.python","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Python Function Separator Punctuation","scope":"punctuation.separator.parameters.python","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] CSharp Fields","scope":"entity.name.variable.field.cs","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] CSharp Keyword Operators","scope":"source.cs keyword.operator","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] CSharp Variables","scope":"variable.other.readwrite.cs","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] CSharp Variables Other","scope":"variable.other.object.cs","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] CSharp Property Other","scope":"variable.other.object.property.cs","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] CSharp Property","scope":"entity.name.variable.property.cs","settings":{"foreground":"#4078F2"}},{"name":"[VSCODE-CUSTOM] CSharp Storage Type","scope":"storage.type.cs","settings":{"foreground":"#C18401"}},{"name":"[VSCODE-CUSTOM] Rust Unsafe Keyword","scope":"keyword.other.unsafe.rust","settings":{"foreground":"#A626A4"}},{"name":"[VSCODE-CUSTOM] Rust Entity Name Type","scope":"entity.name.type.rust","settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] Rust Storage Modifier Lifetime","scope":"storage.modifier.lifetime.rust","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Rust Entity Name Lifetime","scope":"entity.name.lifetime.rust","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Rust Storage Type Core","scope":"storage.type.core.rust","settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] Rust Meta Attribute","scope":"meta.attribute.rust","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Rust Storage Class Std","scope":"storage.class.std.rust","settings":{"foreground":"#0184BC"}},{"name":"[VSCODE-CUSTOM] Markdown Raw Block","scope":"markup.raw.block.markdown","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Shell Variables Punctuation Definition","scope":"punctuation.definition.variable.shell","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Css Support Constant Value","scope":"support.constant.property-value.css","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Css Punctuation Definition Constant","scope":"punctuation.definition.constant.css","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Sass Punctuation for key-value","scope":"punctuation.separator.key-value.scss","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Sass Punctuation for constants","scope":"punctuation.definition.constant.scss","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Sass Punctuation for key-value","scope":"meta.property-list.scss punctuation.separator.key-value.scss","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Java Storage Type Primitive Array","scope":"storage.type.primitive.array.java","settings":{"foreground":"#C18401"}},{"name":"[VSCODE-CUSTOM] Markdown headings","scope":"entity.name.section.markdown","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Markdown heading Punctuation Definition","scope":"punctuation.definition.heading.markdown","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Markdown heading setext","scope":"markup.heading.setext","settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Markdown Punctuation Definition Bold","scope":"punctuation.definition.bold.markdown","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Markdown Inline Raw","scope":"markup.inline.raw.markdown","settings":{"foreground":"#50A14F"}},{"name":"[VSCODE-CUSTOM] Markdown List Punctuation Definition","scope":"beginning.punctuation.definition.list.markdown","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Markdown Quote","scope":"markup.quote.markdown","settings":{"foreground":"#A0A1A7","fontStyle":"italic"}},{"name":"[VSCODE-CUSTOM] Markdown Punctuation Definition String","scope":["punctuation.definition.string.begin.markdown","punctuation.definition.string.end.markdown","punctuation.definition.metadata.markdown"],"settings":{"foreground":"#383A42"}},{"name":"[VSCODE-CUSTOM] Markdown Punctuation Definition Link","scope":"punctuation.definition.metadata.markdown","settings":{"foreground":"#A626A4"}},{"name":"[VSCODE-CUSTOM] Markdown Underline Link/Image","scope":["markup.underline.link.markdown","markup.underline.link.image.markdown"],"settings":{"foreground":"#A626A4"}},{"name":"[VSCODE-CUSTOM] Markdown Link Title/Description","scope":["string.other.link.title.markdown","string.other.link.description.markdown"],"settings":{"foreground":"#4078F2"}},{"name":"[VSCODE-CUSTOM] Ruby Punctuation Separator Variable","scope":"punctuation.separator.variable.ruby","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] Ruby Other Constant Variable","scope":"variable.other.constant.ruby","settings":{"foreground":"#986801"}},{"name":"[VSCODE-CUSTOM] Ruby Keyword Operator Other","scope":"keyword.operator.other.ruby","settings":{"foreground":"#50A14F"}},{"name":"[VSCODE-CUSTOM] PHP Punctuation Variable Definition","scope":"punctuation.definition.variable.php","settings":{"foreground":"#E45649"}},{"name":"[VSCODE-CUSTOM] PHP Meta Class","scope":"meta.class.php","settings":{"foreground":"#383A42"}}],"uuid":"1446a9a1-9d70-421a-bae3-87b3b112ddb0"}



================================================
FILE: docs/tsconfig.json
URL: https://github.com/tact-lang/tact/blob/main/docs/tsconfig.json
================================================
{
  "extends": "astro/tsconfigs/strict"
}


================================================
FILE: docs/yarn.lock
URL: https://github.com/tact-lang/tact/blob/main/docs/yarn.lock
================================================
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@ampproject/remapping@^2.2.0":
  version "2.3.0"
  resolved "https://npm.dev-internal.org/@ampproject/remapping/-/remapping-2.3.0.tgz#ed441b6fa600072520ce18b43d2c8cc8caecc7f4"
  integrity sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw==
  dependencies:
    "@jridgewell/gen-mapping" "^0.3.5"
    "@jridgewell/trace-mapping" "^0.3.24"

"@astrojs/check@0.9.4":
  version "0.9.4"
  resolved "https://npm.dev-internal.org/@astrojs/check/-/check-0.9.4.tgz#6a5310eca7ba57c8f3bd65c8ea0c7be79106c30f"
  integrity sha512-IOheHwCtpUfvogHHsvu0AbeRZEnjJg3MopdLddkJE70mULItS/Vh37BHcI00mcOJcH1vhD3odbpvWokpxam7xA==
  dependencies:
    "@astrojs/language-server" "^2.15.0"
    chokidar "^4.0.1"
    kleur "^4.1.5"
    yargs "^17.7.2"

"@astrojs/compiler@^2.10.3":
  version "2.10.3"
  resolved "https://npm.dev-internal.org/@astrojs/compiler/-/compiler-2.10.3.tgz#852386445029f7765a70b4c1d1140e175e1d8c27"
  integrity sha512-bL/O7YBxsFt55YHU021oL+xz+B/9HvGNId3F9xURN16aeqDK9juHGktdkCSXz+U4nqFACq6ZFvWomOzhV+zfPw==

"@astrojs/internal-helpers@0.4.1":
  version "0.4.1"
  resolved "https://npm.dev-internal.org/@astrojs/internal-helpers/-/internal-helpers-0.4.1.tgz#ceb5de49346dbdbfb6cba1b683c07fef7df56e1c"
  integrity sha512-bMf9jFihO8YP940uD70SI/RDzIhUHJAolWVcO1v5PUivxGKvfLZTLTVVxEYzGYyPsA3ivdLNqMnL5VgmQySa+g==

"@astrojs/internal-helpers@0.6.1":
  version "0.6.1"
  resolved "https://registry.npmjs.org/@astrojs/internal-helpers/-/internal-helpers-0.6.1.tgz#87d0f5dbe4bdc2b61c6409672b921bca193abad6"
  integrity sha512-l5Pqf6uZu31aG+3Lv8nl/3s4DbUzdlxTWDof4pEpto6GUJNhhCbelVi9dEyurOVyqaelwmS9oSyOWOENSfgo9A==

"@astrojs/language-server@^2.15.0":
  version "2.15.4"
  resolved "https://npm.dev-internal.org/@astrojs/language-server/-/language-server-2.15.4.tgz#9c2eeb64e4b9df9a52f19c6bfdce5397b8dba094"
  integrity sha512-JivzASqTPR2bao9BWsSc/woPHH7OGSGc9aMxXL4U6egVTqBycB3ZHdBJPuOCVtcGLrzdWTosAqVPz1BVoxE0+A==
  dependencies:
    "@astrojs/compiler" "^2.10.3"
    "@astrojs/yaml2ts" "^0.2.2"
    "@jridgewell/sourcemap-codec" "^1.4.15"
    "@volar/kit" "~2.4.7"
    "@volar/language-core" "~2.4.7"
    "@volar/language-server" "~2.4.7"
    "@volar/language-service" "~2.4.7"
    fast-glob "^3.2.12"
    muggle-string "^0.4.1"
    volar-service-css "0.0.62"
    volar-service-emmet "0.0.62"
    volar-service-html "0.0.62"
    volar-service-prettier "0.0.62"
    volar-service-typescript "0.0.62"
    volar-service-typescript-twoslash-queries "0.0.62"
    volar-service-yaml "0.0.62"
    vscode-html-languageservice "^5.2.0"
    vscode-uri "^3.0.8"

"@astrojs/markdown-remark@5.3.0":
  version "5.3.0"
  resolved "https://npm.dev-internal.org/@astrojs/markdown-remark/-/markdown-remark-5.3.0.tgz#fd1f8874f2bd1e2c33a7447d069fc75005b677f2"
  integrity sha512-r0Ikqr0e6ozPb5bvhup1qdWnSPUvQu6tub4ZLYaKyG50BXZ0ej6FhGz3GpChKpH7kglRFPObJd/bDyf2VM9pkg==
  dependencies:
    "@astrojs/prism" "3.1.0"
    github-slugger "^2.0.0"
    hast-util-from-html "^2.0.3"
    hast-util-to-text "^4.0.2"
    import-meta-resolve "^4.1.0"
    mdast-util-definitions "^6.0.0"
    rehype-raw "^7.0.0"
    rehype-stringify "^10.0.1"
    remark-gfm "^4.0.0"
    remark-parse "^11.0.0"
    remark-rehype "^11.1.1"
    remark-smartypants "^3.0.2"
    shiki "^1.22.0"
    unified "^11.0.5"
    unist-util-remove-position "^5.0.0"
    unist-util-visit "^5.0.0"
    unist-util-visit-parents "^6.0.1"
    vfile "^6.0.3"

"@astrojs/markdown-remark@6.3.1":
  version "6.3.1"
  resolved "https://registry.npmjs.org/@astrojs/markdown-remark/-/markdown-remark-6.3.1.tgz#3261c934959d779df77d30424ef78b9d6abb4b80"
  integrity sha512-c5F5gGrkczUaTVgmMW9g1YMJGzOtRvjjhw6IfGuxarM6ct09MpwysP10US729dy07gg8y+ofVifezvP3BNsWZg==
  dependencies:
    "@astrojs/internal-helpers" "0.6.1"
    "@astrojs/prism" "3.2.0"
    github-slugger "^2.0.0"
    hast-util-from-html "^2.0.3"
    hast-util-to-text "^4.0.2"
    import-meta-resolve "^4.1.0"
    js-yaml "^4.1.0"
    mdast-util-definitions "^6.0.0"
    rehype-raw "^7.0.0"
    rehype-stringify "^10.0.1"
    remark-gfm "^4.0.1"
    remark-parse "^11.0.0"
    remark-rehype "^11.1.1"
    remark-smartypants "^3.0.2"
    shiki "^3.0.0"
    smol-toml "^1.3.1"
    unified "^11.0.5"
    unist-util-remove-position "^5.0.0"
    unist-util-visit "^5.0.0"
    unist-util-visit-parents "^6.0.1"
    vfile "^6.0.3"

"@astrojs/mdx@^3.1.3":
  version "3.1.9"
  resolved "https://npm.dev-internal.org/@astrojs/mdx/-/mdx-3.1.9.tgz#f8c56d36a580f205cce51672bcc33bdf5f770f49"
  integrity sha512-3jPD4Bff6lIA20RQoonnZkRtZ9T3i0HFm6fcDF7BMsKIZ+xBP2KXzQWiuGu62lrVCmU612N+SQVGl5e0fI+zWg==
  dependencies:
    "@astrojs/markdown-remark" "5.3.0"
    "@mdx-js/mdx" "^3.1.0"
    acorn "^8.14.0"
    es-module-lexer "^1.5.4"
    estree-util-visit "^2.0.0"
    gray-matter "^4.0.3"
    hast-util-to-html "^9.0.3"
    kleur "^4.1.5"
    rehype-raw "^7.0.0"
    remark-gfm "^4.0.0"
    remark-smartypants "^3.0.2"
    source-map "^0.7.4"
    unist-util-visit "^5.0.0"
    vfile "^6.0.3"

"@astrojs/mdx@^4.0.5":
  version "4.2.3"
  resolved "https://registry.npmjs.org/@astrojs/mdx/-/mdx-4.2.3.tgz#224347aedb1d99d3c9272d01b9239cdf90348150"
  integrity sha512-oteB88udzzZmix5kWWUMeMJfeB2Dj8g7jy9LVNuTzGlBh3mEkGhQr6FsIR43p0JKCN11fl5J7P/Ev4Q0Nf0KQQ==
  dependencies:
    "@astrojs/markdown-remark" "6.3.1"
    "@mdx-js/mdx" "^3.1.0"
    acorn "^8.14.1"
    es-module-lexer "^1.6.0"
    estree-util-visit "^2.0.0"
    hast-util-to-html "^9.0.5"
    kleur "^4.1.5"
    rehype-raw "^7.0.0"
    remark-gfm "^4.0.1"
    remark-smartypants "^3.0.2"
    source-map "^0.7.4"
    unist-util-visit "^5.0.0"
    vfile "^6.0.3"

"@astrojs/prism@3.1.0":
  version "3.1.0"
  resolved "https://npm.dev-internal.org/@astrojs/prism/-/prism-3.1.0.tgz#1b70432e0b16fafda191ce780c2820822a55bc46"
  integrity sha512-Z9IYjuXSArkAUx3N6xj6+Bnvx8OdUSHA8YoOgyepp3+zJmtVYJIl/I18GozdJVW1p5u/CNpl3Km7/gwTJK85cw==
  dependencies:
    prismjs "^1.29.0"

"@astrojs/prism@3.2.0":
  version "3.2.0"
  resolved "https://registry.npmjs.org/@astrojs/prism/-/prism-3.2.0.tgz#e8ad1698395bd05f8d1177b365a8de899655c912"
  integrity sha512-GilTHKGCW6HMq7y3BUv9Ac7GMe/MO9gi9GW62GzKtth0SwukCu/qp2wLiGpEujhY+VVhaG9v7kv/5vFzvf4NYw==
  dependencies:
    prismjs "^1.29.0"

"@astrojs/sitemap@^3.1.6":
  version "3.2.1"
  resolved "https://npm.dev-internal.org/@astrojs/sitemap/-/sitemap-3.2.1.tgz#ed3874861fbca83f9ca3e66ac24a0f7ae3f9cf49"
  integrity sha512-uxMfO8f7pALq0ADL6Lk68UV6dNYjJ2xGUzyjjVj60JLBs5a6smtlkBYv3tQ0DzoqwS7c9n4FUx5lgv0yPo/fgA==
  dependencies:
    sitemap "^8.0.0"
    stream-replace-string "^2.0.0"
    zod "^3.23.8"

"@astrojs/starlight@0.29.3":
  version "0.29.3"
  resolved "https://npm.dev-internal.org/@astrojs/starlight/-/starlight-0.29.3.tgz#9efde9dd695e2b6db1e352af7de3d956c0a25401"
  integrity sha512-dzKuGBA7sodGV2dCzpby6UKMx/4b7WrhcYDYlhfX5Ntxh8DCdGU1hIu8jHso/LeFv/jNAfi7m6C7+w/PNSYRgA==
  dependencies:
    "@astrojs/mdx" "^3.1.3"
    "@astrojs/sitemap" "^3.1.6"
    "@pagefind/default-ui" "^1.0.3"
    "@types/hast" "^3.0.4"
    "@types/js-yaml" "^4.0.9"
    "@types/mdast" "^4.0.4"
    astro-expressive-code "^0.38.3"
    bcp-47 "^2.1.0"
    hast-util-from-html "^2.0.1"
    hast-util-select "^6.0.2"
    hast-util-to-string "^3.0.0"
    hastscript "^9.0.0"
    i18next "^23.11.5"
    js-yaml "^4.1.0"
    mdast-util-directive "^3.0.0"
    mdast-util-to-markdown "^2.1.0"
    mdast-util-to-string "^4.0.0"
    pagefind "^1.0.3"
    rehype "^13.0.1"
    rehype-format "^5.0.0"
    remark-directive "^3.0.0"
    unified "^11.0.5"
    unist-util-visit "^5.0.0"
    vfile "^6.0.2"

"@astrojs/telemetry@3.1.0":
  version "3.1.0"
  resolved "https://npm.dev-internal.org/@astrojs/telemetry/-/telemetry-3.1.0.tgz#1038bea408a0f8cf363fb939afeefed751f1f86f"
  integrity sha512-/ca/+D8MIKEC8/A9cSaPUqQNZm+Es/ZinRv0ZAzvu2ios7POQSsVD+VOj7/hypWNsNM3T7RpfgNq7H2TU1KEHA==
  dependencies:
    ci-info "^4.0.0"
    debug "^4.3.4"
    dlv "^1.1.3"
    dset "^3.1.3"
    is-docker "^3.0.0"
    is-wsl "^3.0.0"
    which-pm-runs "^1.1.0"

"@astrojs/yaml2ts@^0.2.2":
  version "0.2.2"
  resolved "https://npm.dev-internal.org/@astrojs/yaml2ts/-/yaml2ts-0.2.2.tgz#eabcb75a57a97c5a2f0422a0a03ca14f000f4f5e"
  integrity sha512-GOfvSr5Nqy2z5XiwqTouBBpy5FyI6DEe+/g/Mk5am9SjILN1S5fOEvYK0GuWHg98yS/dobP4m8qyqw/URW35fQ==
  dependencies:
    yaml "^2.5.0"

"@babel/code-frame@^7.25.9", "@babel/code-frame@^7.26.0", "@babel/code-frame@^7.26.2":
  version "7.26.2"
  resolved "https://npm.dev-internal.org/@babel/code-frame/-/code-frame-7.26.2.tgz#4b5fab97d33338eff916235055f0ebc21e573a85"
  integrity sha512-RJlIHRueQgwWitWgF8OdFYGZX328Ax5BCemNGlqHfplnRT9ESi8JkFlvaVYbS+UubVY6dpv87Fs2u5M29iNFVQ==
  dependencies:
    "@babel/helper-validator-identifier" "^7.25.9"
    js-tokens "^4.0.0"
    picocolors "^1.0.0"

"@babel/compat-data@^7.25.9":
  version "7.26.3"
  resolved "https://npm.dev-internal.org/@babel/compat-data/-/compat-data-7.26.3.tgz#99488264a56b2aded63983abd6a417f03b92ed02"
  integrity sha512-nHIxvKPniQXpmQLb0vhY3VaFb3S0YrTAwpOWJZh1wn3oJPjJk9Asva204PsBdmAE8vpzfHudT8DB0scYvy9q0g==

"@babel/core@^7.26.0":
  version "7.26.0"
  resolved "https://npm.dev-internal.org/@babel/core/-/core-7.26.0.tgz#d78b6023cc8f3114ccf049eb219613f74a747b40"
  integrity sha512-i1SLeK+DzNnQ3LL/CswPCa/E5u4lh1k6IAEphON8F+cXt0t9euTshDru0q7/IqMa1PMPz5RnHuHscF8/ZJsStg==
  dependencies:
    "@ampproject/remapping" "^2.2.0"
    "@babel/code-frame" "^7.26.0"
    "@babel/generator" "^7.26.0"
    "@babel/helper-compilation-targets" "^7.25.9"
    "@babel/helper-module-transforms" "^7.26.0"
    "@babel/helpers" "^7.26.0"
    "@babel/parser" "^7.26.0"
    "@babel/template" "^7.25.9"
    "@babel/traverse" "^7.25.9"
    "@babel/types" "^7.26.0"
    convert-source-map "^2.0.0"
    debug "^4.1.0"
    gensync "^1.0.0-beta.2"
    json5 "^2.2.3"
    semver "^6.3.1"

"@babel/generator@^7.26.0", "@babel/generator@^7.26.3":
  version "7.26.3"
  resolved "https://npm.dev-internal.org/@babel/generator/-/generator-7.26.3.tgz#ab8d4360544a425c90c248df7059881f4b2ce019"
  integrity sha512-6FF/urZvD0sTeO7k6/B15pMLC4CHUv1426lzr3N01aHJTl046uCAh9LXW/fzeXXjPNCJ6iABW5XaWOsIZB93aQ==
  dependencies:
    "@babel/parser" "^7.26.3"
    "@babel/types" "^7.26.3"
    "@jridgewell/gen-mapping" "^0.3.5"
    "@jridgewell/trace-mapping" "^0.3.25"
    jsesc "^3.0.2"

"@babel/helper-annotate-as-pure@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.25.9.tgz#d8eac4d2dc0d7b6e11fa6e535332e0d3184f06b4"
  integrity sha512-gv7320KBUFJz1RnylIg5WWYPRXKZ884AGkYpgpWW02TH66Dl+HaC1t1CKd0z3R4b6hdYEcmrNZHUmfCP+1u3/g==
  dependencies:
    "@babel/types" "^7.25.9"

"@babel/helper-compilation-targets@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.25.9.tgz#55af025ce365be3cdc0c1c1e56c6af617ce88875"
  integrity sha512-j9Db8Suy6yV/VHa4qzrj9yZfZxhLWQdVnRlXxmKLYlhWUVB1sB2G5sxuWYXk/whHD9iW76PmNzxZ4UCnTQTVEQ==
  dependencies:
    "@babel/compat-data" "^7.25.9"
    "@babel/helper-validator-option" "^7.25.9"
    browserslist "^4.24.0"
    lru-cache "^5.1.1"
    semver "^6.3.1"

"@babel/helper-module-imports@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/helper-module-imports/-/helper-module-imports-7.25.9.tgz#e7f8d20602ebdbf9ebbea0a0751fb0f2a4141715"
  integrity sha512-tnUA4RsrmflIM6W6RFTLFSXITtl0wKjgpnLgXyowocVPrbYrLUXSBXDgTs8BlbmIzIdlBySRQjINYs2BAkiLtw==
  dependencies:
    "@babel/traverse" "^7.25.9"
    "@babel/types" "^7.25.9"

"@babel/helper-module-transforms@^7.26.0":
  version "7.26.0"
  resolved "https://npm.dev-internal.org/@babel/helper-module-transforms/-/helper-module-transforms-7.26.0.tgz#8ce54ec9d592695e58d84cd884b7b5c6a2fdeeae"
  integrity sha512-xO+xu6B5K2czEnQye6BHA7DolFFmS3LB7stHZFaOLb1pAwO1HWLS8fXA+eh0A2yIvltPVmx3eNNDBJA2SLHXFw==
  dependencies:
    "@babel/helper-module-imports" "^7.25.9"
    "@babel/helper-validator-identifier" "^7.25.9"
    "@babel/traverse" "^7.25.9"

"@babel/helper-plugin-utils@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.25.9.tgz#9cbdd63a9443a2c92a725cca7ebca12cc8dd9f46"
  integrity sha512-kSMlyUVdWe25rEsRGviIgOWnoT/nfABVWlqt9N19/dIPWViAOW2s9wznP5tURbs/IDuNk4gPy3YdYRgH3uxhBw==

"@babel/helper-string-parser@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/helper-string-parser/-/helper-string-parser-7.25.9.tgz#1aabb72ee72ed35789b4bbcad3ca2862ce614e8c"
  integrity sha512-4A/SCr/2KLd5jrtOMFzaKjVtAei3+2r/NChoBNoZ3EyP/+GlhoaEGoWOZUmFmoITP7zOJyHIMm+DYRd8o3PvHA==

"@babel/helper-validator-identifier@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.25.9.tgz#24b64e2c3ec7cd3b3c547729b8d16871f22cbdc7"
  integrity sha512-Ed61U6XJc3CVRfkERJWDz4dJwKe7iLmmJsbOGu9wSloNSFttHV0I8g6UAgb7qnK5ly5bGLPd4oXZlxCdANBOWQ==

"@babel/helper-validator-option@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/helper-validator-option/-/helper-validator-option-7.25.9.tgz#86e45bd8a49ab7e03f276577f96179653d41da72"
  integrity sha512-e/zv1co8pp55dNdEcCynfj9X7nyUKUXoUEwfXqaZt0omVOmDe9oOTdKStH4GmAw6zxMFs50ZayuMfHDKlO7Tfw==

"@babel/helpers@^7.26.0":
  version "7.26.10"
  resolved "https://npm.dev-internal.org/@babel/helpers/-/helpers-7.26.10.tgz#6baea3cd62ec2d0c1068778d63cb1314f6637384"
  integrity sha512-UPYc3SauzZ3JGgj87GgZ89JVdC5dj0AoetR5Bw6wj4niittNyFh6+eOGonYvJ1ao6B8lEa3Q3klS7ADZ53bc5g==
  dependencies:
    "@babel/template" "^7.26.9"
    "@babel/types" "^7.26.10"

"@babel/parser@^7.1.0", "@babel/parser@^7.20.7", "@babel/parser@^7.25.4", "@babel/parser@^7.25.9", "@babel/parser@^7.26.0", "@babel/parser@^7.26.3":
  version "7.26.3"
  resolved "https://npm.dev-internal.org/@babel/parser/-/parser-7.26.3.tgz#8c51c5db6ddf08134af1ddbacf16aaab48bac234"
  integrity sha512-WJ/CvmY8Mea8iDXo6a7RK2wbmJITT5fN3BEkRuFlxVyNx8jOKIIhmC4fSkTcPcf8JyavbBwIe6OpiCOBXt/IcA==
  dependencies:
    "@babel/types" "^7.26.3"

"@babel/parser@^7.26.9":
  version "7.26.10"
  resolved "https://npm.dev-internal.org/@babel/parser/-/parser-7.26.10.tgz#e9bdb82f14b97df6569b0b038edd436839c57749"
  integrity sha512-6aQR2zGE/QFi8JpDLjUZEPYOs7+mhKXm86VaKFiLP35JQwQb6bwUE+XbvkH0EptsYhbNBSUGaUBLKqxH1xSgsA==
  dependencies:
    "@babel/types" "^7.26.10"

"@babel/plugin-syntax-jsx@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/plugin-syntax-jsx/-/plugin-syntax-jsx-7.25.9.tgz#a34313a178ea56f1951599b929c1ceacee719290"
  integrity sha512-ld6oezHQMZsZfp6pWtbjaNDF2tiiCYYDqQszHt5VV437lewP9aSi2Of99CK0D0XB21k7FLgnLcmQKyKzynfeAA==
  dependencies:
    "@babel/helper-plugin-utils" "^7.25.9"

"@babel/plugin-transform-react-jsx@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/plugin-transform-react-jsx/-/plugin-transform-react-jsx-7.25.9.tgz#06367940d8325b36edff5e2b9cbe782947ca4166"
  integrity sha512-s5XwpQYCqGerXl+Pu6VDL3x0j2d82eiV77UJ8a2mDHAW7j9SWRqQ2y1fNo1Z74CdcYipl5Z41zvjj4Nfzq36rw==
  dependencies:
    "@babel/helper-annotate-as-pure" "^7.25.9"
    "@babel/helper-module-imports" "^7.25.9"
    "@babel/helper-plugin-utils" "^7.25.9"
    "@babel/plugin-syntax-jsx" "^7.25.9"
    "@babel/types" "^7.25.9"

"@babel/runtime@^7.23.2":
  version "7.26.10"
  resolved "https://npm.dev-internal.org/@babel/runtime/-/runtime-7.26.10.tgz#a07b4d8fa27af131a633d7b3524db803eb4764c2"
  integrity sha512-2WJMeRQPHKSPemqk/awGrAiuFfzBmOIPXKizAsVhWH9YJqLZ0H+HS4c8loHGgW6utJ3E/ejXQUsiGaQy2NZ9Fw==
  dependencies:
    regenerator-runtime "^0.14.0"

"@babel/template@^7.25.9":
  version "7.25.9"
  resolved "https://npm.dev-internal.org/@babel/template/-/template-7.25.9.tgz#ecb62d81a8a6f5dc5fe8abfc3901fc52ddf15016"
  integrity sha512-9DGttpmPvIxBb/2uwpVo3dqJ+O6RooAFOS+lB+xDqoE2PVCE8nfoHMdZLpfCQRLwvohzXISPZcgxt80xLfsuwg==
  dependencies:
    "@babel/code-frame" "^7.25.9"
    "@babel/parser" "^7.25.9"
    "@babel/types" "^7.25.9"

"@babel/template@^7.26.9":
  version "7.26.9"
  resolved "https://npm.dev-internal.org/@babel/template/-/template-7.26.9.tgz#4577ad3ddf43d194528cff4e1fa6b232fa609bb2"
  integrity sha512-qyRplbeIpNZhmzOysF/wFMuP9sctmh2cFzRAZOn1YapxBsE1i9bJIY586R/WBLfLcmcBlM8ROBiQURnnNy+zfA==
  dependencies:
    "@babel/code-frame" "^7.26.2"
    "@babel/parser" "^7.26.9"
    "@babel/types" "^7.26.9"

"@babel/traverse@^7.25.9":
  version "7.26.4"
  resolved "https://npm.dev-internal.org/@babel/traverse/-/traverse-7.26.4.tgz#ac3a2a84b908dde6d463c3bfa2c5fdc1653574bd"
  integrity sha512-fH+b7Y4p3yqvApJALCPJcwb0/XaOSgtK4pzV6WVjPR5GLFQBRI7pfoX2V2iM48NXvX07NUxxm1Vw98YjqTcU5w==
  dependencies:
    "@babel/code-frame" "^7.26.2"
    "@babel/generator" "^7.26.3"
    "@babel/parser" "^7.26.3"
    "@babel/template" "^7.25.9"
    "@babel/types" "^7.26.3"
    debug "^4.3.1"
    globals "^11.1.0"

"@babel/types@^7.0.0", "@babel/types@^7.20.7", "@babel/types@^7.25.4", "@babel/types@^7.25.9", "@babel/types@^7.26.0", "@babel/types@^7.26.3":
  version "7.26.3"
  resolved "https://npm.dev-internal.org/@babel/types/-/types-7.26.3.tgz#37e79830f04c2b5687acc77db97fbc75fb81f3c0"
  integrity sha512-vN5p+1kl59GVKMvTHt55NzzmYVxprfJD+ql7U9NFIfKCBkYE55LYtS+WtPlaYOyzydrKI8Nezd+aZextrd+FMA==
  dependencies:
    "@babel/helper-string-parser" "^7.25.9"
    "@babel/helper-validator-identifier" "^7.25.9"

"@babel/types@^7.26.10", "@babel/types@^7.26.9":
  version "7.26.10"
  resolved "https://npm.dev-internal.org/@babel/types/-/types-7.26.10.tgz#396382f6335bd4feb65741eacfc808218f859259"
  integrity sha512-emqcG3vHrpxUKTrxcblR36dcrcoRDvKmnL/dCL6ZsHaShW80qxCAcNhzQZrpeM765VzEos+xOi4s+r4IXzTwdQ==
  dependencies:
    "@babel/helper-string-parser" "^7.25.9"
    "@babel/helper-validator-identifier" "^7.25.9"

"@cspell/cspell-bundled-dicts@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/cspell-bundled-dicts/-/cspell-bundled-dicts-8.17.1.tgz#61adad73f1bb1e12b182ffa04423d6052b18f0fc"
  integrity sha512-HmkXS5uX4bk/XxsRS4Q+zRvhgRa81ddGiR2/Xfag9MIi5L5UnEJ4g21EpmIlXkMxYrTu2fp69SZFss5NfcFF9Q==
  dependencies:
    "@cspell/dict-ada" "^4.0.5"
    "@cspell/dict-al" "^1.0.3"
    "@cspell/dict-aws" "^4.0.7"
    "@cspell/dict-bash" "^4.1.8"
    "@cspell/dict-companies" "^3.1.8"
    "@cspell/dict-cpp" "^6.0.2"
    "@cspell/dict-cryptocurrencies" "^5.0.3"
    "@cspell/dict-csharp" "^4.0.5"
    "@cspell/dict-css" "^4.0.16"
    "@cspell/dict-dart" "^2.2.4"
    "@cspell/dict-django" "^4.1.3"
    "@cspell/dict-docker" "^1.1.11"
    "@cspell/dict-dotnet" "^5.0.8"
    "@cspell/dict-elixir" "^4.0.6"
    "@cspell/dict-en-common-misspellings" "^2.0.7"
    "@cspell/dict-en-gb" "1.1.33"
    "@cspell/dict-en_us" "^4.3.28"
    "@cspell/dict-filetypes" "^3.0.9"
    "@cspell/dict-flutter" "^1.0.3"
    "@cspell/dict-fonts" "^4.0.3"
    "@cspell/dict-fsharp" "^1.0.4"
    "@cspell/dict-fullstack" "^3.2.3"
    "@cspell/dict-gaming-terms" "^1.0.9"
    "@cspell/dict-git" "^3.0.3"
    "@cspell/dict-golang" "^6.0.17"
    "@cspell/dict-google" "^1.0.4"
    "@cspell/dict-haskell" "^4.0.4"
    "@cspell/dict-html" "^4.0.10"
    "@cspell/dict-html-symbol-entities" "^4.0.3"
    "@cspell/dict-java" "^5.0.10"
    "@cspell/dict-julia" "^1.0.4"
    "@cspell/dict-k8s" "^1.0.9"
    "@cspell/dict-latex" "^4.0.3"
    "@cspell/dict-lorem-ipsum" "^4.0.3"
    "@cspell/dict-lua" "^4.0.6"
    "@cspell/dict-makefile" "^1.0.3"
    "@cspell/dict-markdown" "^2.0.7"
    "@cspell/dict-monkeyc" "^1.0.9"
    "@cspell/dict-node" "^5.0.5"
    "@cspell/dict-npm" "^5.1.17"
    "@cspell/dict-php" "^4.0.13"
    "@cspell/dict-powershell" "^5.0.13"
    "@cspell/dict-public-licenses" "^2.0.11"
    "@cspell/dict-python" "^4.2.13"
    "@cspell/dict-r" "^2.0.4"
    "@cspell/dict-ruby" "^5.0.7"
    "@cspell/dict-rust" "^4.0.10"
    "@cspell/dict-scala" "^5.0.6"
    "@cspell/dict-software-terms" "^4.1.19"
    "@cspell/dict-sql" "^2.1.8"
    "@cspell/dict-svelte" "^1.0.5"
    "@cspell/dict-swift" "^2.0.4"
    "@cspell/dict-terraform" "^1.0.6"
    "@cspell/dict-typescript" "^3.1.11"
    "@cspell/dict-vue" "^3.0.3"

"@cspell/cspell-json-reporter@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/cspell-json-reporter/-/cspell-json-reporter-8.17.1.tgz#c1678665f183589e5fc19a1c0933b8d362165a43"
  integrity sha512-EV9Xkh42Xw3aORvDZfxusICX91DDbqQpYdGKBdPGuhgxWOUYYZKpLXsHCmDkhruMPo2m5gDh++/OqjLRPZofKQ==
  dependencies:
    "@cspell/cspell-types" "8.17.1"

"@cspell/cspell-pipe@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/cspell-pipe/-/cspell-pipe-8.17.1.tgz#c247d4bd1c8ec43c49c46dc4458f00489e98232b"
  integrity sha512-uhC99Ox+OH3COSgShv4fpVHiotR70dNvAOSkzRvKVRzV6IGyFnxHjmyVVPEV0dsqzVLxltwYTqFhwI+UOwm45A==

"@cspell/cspell-resolver@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/cspell-resolver/-/cspell-resolver-8.17.1.tgz#6377c9c8c05c940fee675c74e31f893b7b2f38ab"
  integrity sha512-XEK2ymTdQNgsV3ny60VkKzWskbICl4zNXh/DbxsoRXHqIRg43MXFpTNkEJ7j873EqdX7BU4opQQ+5D4stWWuhQ==
  dependencies:
    global-directory "^4.0.1"

"@cspell/cspell-service-bus@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/cspell-service-bus/-/cspell-service-bus-8.17.1.tgz#8d6d82ea3ab0fc9d7efed8523b070e4842780bd1"
  integrity sha512-2sFWQtMEWZ4tdz7bw0bAx4NaV1t0ynGfjpuKWdQppsJFKNb+ZPZZ6Ah1dC13AdRRMZaG194kDRFwzNvRaCgWkQ==

"@cspell/cspell-types@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/cspell-types/-/cspell-types-8.17.1.tgz#5512030b4c2e7881a8822ab3afabbd4f5ddffb6f"
  integrity sha512-NJbov7Jp57fh8addoxesjb8atg/APQfssCH5Q9uZuHBN06wEJDgs7fhfE48bU+RBViC9gltblsYZzZZQKzHYKg==

"@cspell/dict-ada@^4.0.5":
  version "4.0.5"
  resolved "https://npm.dev-internal.org/@cspell/dict-ada/-/dict-ada-4.0.5.tgz#c14aae2faaecbad2d99f0d701e4700a48c68ef60"
  integrity sha512-6/RtZ/a+lhFVmrx/B7bfP7rzC4yjEYe8o74EybXcvu4Oue6J4Ey2WSYj96iuodloj1LWrkNCQyX5h4Pmcj0Iag==

"@cspell/dict-al@^1.0.3":
  version "1.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-al/-/dict-al-1.0.3.tgz#09e288b5ab56b126dce895d3301faf7c0dd732d6"
  integrity sha512-V1HClwlfU/qwSq2Kt+MkqRAsonNu3mxjSCDyGRecdLGIHmh7yeEeaxqRiO/VZ4KP+eVSiSIlbwrb5YNFfxYZbw==

"@cspell/dict-aws@^4.0.7":
  version "4.0.7"
  resolved "https://npm.dev-internal.org/@cspell/dict-aws/-/dict-aws-4.0.7.tgz#f96f3b70cd52a25b895eb08e297de5a5cc3fc5b6"
  integrity sha512-PoaPpa2NXtSkhGIMIKhsJUXB6UbtTt6Ao3x9JdU9kn7fRZkwD4RjHDGqulucIOz7KeEX/dNRafap6oK9xHe4RA==

"@cspell/dict-bash@^4.1.8":
  version "4.1.8"
  resolved "https://npm.dev-internal.org/@cspell/dict-bash/-/dict-bash-4.1.8.tgz#26dc898e06eddea069cf1ad475ee0e867c89e632"
  integrity sha512-I2CM2pTNthQwW069lKcrVxchJGMVQBzru2ygsHCwgidXRnJL/NTjAPOFTxN58Jc1bf7THWghfEDyKX/oyfc0yg==

"@cspell/dict-companies@^3.1.8":
  version "3.1.9"
  resolved "https://npm.dev-internal.org/@cspell/dict-companies/-/dict-companies-3.1.9.tgz#c3ae263ac6b4bdee8bd836441e665c397030abfb"
  integrity sha512-w7XEJ2B6x2jq9ws5XNyYgpYj2MxdZ3jW3PETLxjK7nc8pulCFmaGVgZ0JTnDWfJ3QMOczoagn5f9LM2PZ/CuJg==

"@cspell/dict-cpp@^6.0.2":
  version "6.0.2"
  resolved "https://npm.dev-internal.org/@cspell/dict-cpp/-/dict-cpp-6.0.2.tgz#e4549ee1bdf4b6402c0b978eb9dd3deac0eb05df"
  integrity sha512-yw5eejWvY4bAnc6LUA44m4WsFwlmgPt2uMSnO7QViGMBDuoeopMma4z9XYvs4lSjTi8fIJs/A1YDfM9AVzb8eg==

"@cspell/dict-cryptocurrencies@^5.0.3":
  version "5.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-cryptocurrencies/-/dict-cryptocurrencies-5.0.3.tgz#502f9fffcb2835a3379668ddebdc487678ce6207"
  integrity sha512-bl5q+Mk+T3xOZ12+FG37dB30GDxStza49Rmoax95n37MTLksk9wBo1ICOlPJ6PnDUSyeuv4SIVKgRKMKkJJglA==

"@cspell/dict-csharp@^4.0.5":
  version "4.0.5"
  resolved "https://npm.dev-internal.org/@cspell/dict-csharp/-/dict-csharp-4.0.5.tgz#c677c50be09ca5bb3a2cc0be15f3cd05141fd2f7"
  integrity sha512-c/sFnNgtRwRJxtC3JHKkyOm+U3/sUrltFeNwml9VsxKBHVmvlg4tk4ar58PdpW9/zTlGUkWi2i85//DN1EsUCA==

"@cspell/dict-css@^4.0.16":
  version "4.0.16"
  resolved "https://npm.dev-internal.org/@cspell/dict-css/-/dict-css-4.0.16.tgz#b7b87b5ea0f1157b023205bdb00070a7d231e367"
  integrity sha512-70qu7L9z/JR6QLyJPk38fNTKitlIHnfunx0wjpWQUQ8/jGADIhMCrz6hInBjqPNdtGpYm8d1dNFyF8taEkOgrQ==

"@cspell/dict-dart@^2.2.4":
  version "2.2.4"
  resolved "https://npm.dev-internal.org/@cspell/dict-dart/-/dict-dart-2.2.4.tgz#8b877161ccdc65cead912b742b71aa55099c1706"
  integrity sha512-of/cVuUIZZK/+iqefGln8G3bVpfyN6ZtH+LyLkHMoR5tEj+2vtilGNk9ngwyR8L4lEqbKuzSkOxgfVjsXf5PsQ==

"@cspell/dict-data-science@^2.0.5":
  version "2.0.5"
  resolved "https://npm.dev-internal.org/@cspell/dict-data-science/-/dict-data-science-2.0.5.tgz#816e9b394c2a423d14cdc9a5de5d6fc6141d3900"
  integrity sha512-nNSILXmhSJox9/QoXICPQgm8q5PbiSQP4afpbkBqPi/u/b3K9MbNH5HvOOa6230gxcGdbZ9Argl2hY/U8siBlg==

"@cspell/dict-django@^4.1.3":
  version "4.1.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-django/-/dict-django-4.1.3.tgz#a02a4a9ef8c9f47344f2d4a0c3964bcb62069ef5"
  integrity sha512-yBspeL3roJlO0a1vKKNaWABURuHdHZ9b1L8d3AukX0AsBy9snSggc8xCavPmSzNfeMDXbH+1lgQiYBd3IW03fg==

"@cspell/dict-docker@^1.1.11":
  version "1.1.11"
  resolved "https://npm.dev-internal.org/@cspell/dict-docker/-/dict-docker-1.1.11.tgz#6fce86eb6d86d73f77e18d3e7b9747bad3ca98de"
  integrity sha512-s0Yhb16/R+UT1y727ekbR/itWQF3Qz275DR1ahOa66wYtPjHUXmhM3B/LT3aPaX+hD6AWmK23v57SuyfYHUjsw==

"@cspell/dict-dotnet@^5.0.8":
  version "5.0.8"
  resolved "https://npm.dev-internal.org/@cspell/dict-dotnet/-/dict-dotnet-5.0.8.tgz#8a110ca302946025e0273a9940079483ec33a88a"
  integrity sha512-MD8CmMgMEdJAIPl2Py3iqrx3B708MbCIXAuOeZ0Mzzb8YmLmiisY7QEYSZPg08D7xuwARycP0Ki+bb0GAkFSqg==

"@cspell/dict-elixir@^4.0.6":
  version "4.0.6"
  resolved "https://npm.dev-internal.org/@cspell/dict-elixir/-/dict-elixir-4.0.6.tgz#3d8965c558d8afd190356e9a900b02c546741feb"
  integrity sha512-TfqSTxMHZ2jhiqnXlVKM0bUADtCvwKQv2XZL/DI0rx3doG8mEMS8SGPOmiyyGkHpR/pGOq18AFH3BEm4lViHIw==

"@cspell/dict-en-common-misspellings@^2.0.7":
  version "2.0.7"
  resolved "https://npm.dev-internal.org/@cspell/dict-en-common-misspellings/-/dict-en-common-misspellings-2.0.7.tgz#62861cc9e813c947ebd71c7a50fc720767b4b543"
  integrity sha512-qNFo3G4wyabcwnM+hDrMYKN9vNVg/k9QkhqSlSst6pULjdvPyPs1mqz1689xO/v9t8e6sR4IKc3CgUXDMTYOpA==

"@cspell/dict-en-gb@1.1.33":
  version "1.1.33"
  resolved "https://npm.dev-internal.org/@cspell/dict-en-gb/-/dict-en-gb-1.1.33.tgz#7f1fd90fc364a5cb77111b5438fc9fcf9cc6da0e"
  integrity sha512-tKSSUf9BJEV+GJQAYGw5e+ouhEe2ZXE620S7BLKe3ZmpnjlNG9JqlnaBhkIMxKnNFkLY2BP/EARzw31AZnOv4g==

"@cspell/dict-en_us@^4.3.28":
  version "4.3.28"
  resolved "https://npm.dev-internal.org/@cspell/dict-en_us/-/dict-en_us-4.3.28.tgz#41169e1ed18465e7ff367a4f4488d4cbc6cf0baa"
  integrity sha512-BN1PME7cOl7DXRQJ92pEd1f0Xk5sqjcDfThDGkKcsgwbSOY7KnTc/czBW6Pr3WXIchIm6cT12KEfjNqx7U7Rrw==

"@cspell/dict-filetypes@^3.0.9":
  version "3.0.9"
  resolved "https://npm.dev-internal.org/@cspell/dict-filetypes/-/dict-filetypes-3.0.9.tgz#f4d5c35c341e6c3b77c08aec00678412641e1504"
  integrity sha512-U7ycC1cE32A5aEgwzp/iE0TVabonUFnVt+Ygbf6NsIWqEuFWZgZChC7gfztA4T1fpuj602nFdp7eOnTWKORsnQ==

"@cspell/dict-flutter@^1.0.3":
  version "1.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-flutter/-/dict-flutter-1.0.3.tgz#23e552209ab2238733d30ca3f2a141359756af51"
  integrity sha512-52C9aUEU22ptpgYh6gQyIdA4MP6NPwzbEqndfgPh3Sra191/kgs7CVqXiO1qbtZa9gnYHUoVApkoxRE7mrXHfg==

"@cspell/dict-fonts@^4.0.3":
  version "4.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-fonts/-/dict-fonts-4.0.3.tgz#abf578c10a2e7b2bd8f4374002677625288560d9"
  integrity sha512-sPd17kV5qgYXLteuHFPn5mbp/oCHKgitNfsZLFC3W2fWEgZlhg4hK+UGig3KzrYhhvQ8wBnmZrAQm0TFKCKzsA==

"@cspell/dict-fsharp@^1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@cspell/dict-fsharp/-/dict-fsharp-1.0.4.tgz#19a7263a61ca89cd3ec9c17537e424907b81ef38"
  integrity sha512-G5wk0o1qyHUNi9nVgdE1h5wl5ylq7pcBjX8vhjHcO4XBq20D5eMoXjwqMo/+szKAqzJ+WV3BgAL50akLKrT9Rw==

"@cspell/dict-fullstack@^3.2.3":
  version "3.2.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-fullstack/-/dict-fullstack-3.2.3.tgz#f6fff74eff00c6759cba510168acada0619004cc"
  integrity sha512-62PbndIyQPH11mAv0PyiyT0vbwD0AXEocPpHlCHzfb5v9SspzCCbzQ/LIBiFmyRa+q5LMW35CnSVu6OXdT+LKg==

"@cspell/dict-gaming-terms@^1.0.9":
  version "1.0.9"
  resolved "https://npm.dev-internal.org/@cspell/dict-gaming-terms/-/dict-gaming-terms-1.0.9.tgz#6b920386d281b89f70857e6dacea10ab89e88658"
  integrity sha512-AVIrZt3YiUnxsUzzGYTZ1XqgtkgwGEO0LWIlEf+SiDUEVLtv4CYmmyXFQ+WXDN0pyJ0wOwDazWrP0Cu7avYQmQ==

"@cspell/dict-git@^3.0.3":
  version "3.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-git/-/dict-git-3.0.3.tgz#3a3805ab9902bffc9255ec48f648145b957eb30b"
  integrity sha512-LSxB+psZ0qoj83GkyjeEH/ZViyVsGEF/A6BAo8Nqc0w0HjD2qX/QR4sfA6JHUgQ3Yi/ccxdK7xNIo67L2ScW5A==

"@cspell/dict-golang@^6.0.17":
  version "6.0.17"
  resolved "https://npm.dev-internal.org/@cspell/dict-golang/-/dict-golang-6.0.17.tgz#8f3c11189b869db7216cb4496514b9882d1e30a5"
  integrity sha512-uDDLEJ/cHdLiqPw4+5BnmIo2i/TSR+uDvYd6JlBjTmjBKpOCyvUgYRztH7nv5e7virsN5WDiUWah4/ATQGz4Pw==

"@cspell/dict-google@^1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@cspell/dict-google/-/dict-google-1.0.4.tgz#e15a7ea2dee73800231a81840a59d3b50d49346f"
  integrity sha512-JThUT9eiguCja1mHHLwYESgxkhk17Gv7P3b1S7ZJzXw86QyVHPrbpVoMpozHk0C9o+Ym764B7gZGKmw9uMGduQ==

"@cspell/dict-haskell@^4.0.4":
  version "4.0.4"
  resolved "https://npm.dev-internal.org/@cspell/dict-haskell/-/dict-haskell-4.0.4.tgz#37e9cb9a7f5be337a697bcffd0a0d25e80aab50d"
  integrity sha512-EwQsedEEnND/vY6tqRfg9y7tsnZdxNqOxLXSXTsFA6JRhUlr8Qs88iUUAfsUzWc4nNmmzQH2UbtT25ooG9x4nA==

"@cspell/dict-html-symbol-entities@^4.0.3":
  version "4.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-html-symbol-entities/-/dict-html-symbol-entities-4.0.3.tgz#bf2887020ca4774413d8b1f27c9b6824ba89e9ef"
  integrity sha512-aABXX7dMLNFdSE8aY844X4+hvfK7977sOWgZXo4MTGAmOzR8524fjbJPswIBK7GaD3+SgFZ2yP2o0CFvXDGF+A==

"@cspell/dict-html@^4.0.10":
  version "4.0.10"
  resolved "https://npm.dev-internal.org/@cspell/dict-html/-/dict-html-4.0.10.tgz#7b536b2adca4b58ed92752c9d3c7ffc724dd5991"
  integrity sha512-I9uRAcdtHbh0wEtYZlgF0TTcgH0xaw1B54G2CW+tx4vHUwlde/+JBOfIzird4+WcMv4smZOfw+qHf7puFUbI5g==

"@cspell/dict-java@^5.0.10":
  version "5.0.10"
  resolved "https://npm.dev-internal.org/@cspell/dict-java/-/dict-java-5.0.10.tgz#e6383ca645046b9f05a04a2c2e858fcc80c6fc63"
  integrity sha512-pVNcOnmoGiNL8GSVq4WbX/Vs2FGS0Nej+1aEeGuUY9CU14X8yAVCG+oih5ZoLt1jaR8YfR8byUF8wdp4qG4XIw==

"@cspell/dict-julia@^1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@cspell/dict-julia/-/dict-julia-1.0.4.tgz#e478c20d742cd6857b6de41dc61a92036dafb4bc"
  integrity sha512-bFVgNX35MD3kZRbXbJVzdnN7OuEqmQXGpdOi9jzB40TSgBTlJWA4nxeAKV4CPCZxNRUGnLH0p05T/AD7Aom9/w==

"@cspell/dict-k8s@^1.0.9":
  version "1.0.9"
  resolved "https://npm.dev-internal.org/@cspell/dict-k8s/-/dict-k8s-1.0.9.tgz#e9392a002797c67ffc3e96893156cc15af3774d1"
  integrity sha512-Q7GELSQIzo+BERl2ya/nBEnZeQC+zJP19SN1pI6gqDYraM51uYJacbbcWLYYO2Y+5joDjNt/sd/lJtLaQwoSlA==

"@cspell/dict-latex@^4.0.3":
  version "4.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-latex/-/dict-latex-4.0.3.tgz#a1254c7d9c3a2d70cd6391a9f2f7694431b1b2cb"
  integrity sha512-2KXBt9fSpymYHxHfvhUpjUFyzrmN4c4P8mwIzweLyvqntBT3k0YGZJSriOdjfUjwSygrfEwiuPI1EMrvgrOMJw==

"@cspell/dict-lorem-ipsum@^4.0.3":
  version "4.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-lorem-ipsum/-/dict-lorem-ipsum-4.0.3.tgz#c5fc631d934f1daf8b10c88b795278701a2469ec"
  integrity sha512-WFpDi/PDYHXft6p0eCXuYnn7mzMEQLVeqpO+wHSUd+kz5ADusZ4cpslAA4wUZJstF1/1kMCQCZM6HLZic9bT8A==

"@cspell/dict-lua@^4.0.6":
  version "4.0.6"
  resolved "https://npm.dev-internal.org/@cspell/dict-lua/-/dict-lua-4.0.6.tgz#7de412bfaead794445e26d566aec222e20ad69ba"
  integrity sha512-Jwvh1jmAd9b+SP9e1GkS2ACbqKKRo9E1f9GdjF/ijmooZuHU0hPyqvnhZzUAxO1egbnNjxS/J2T6iUtjAUK2KQ==

"@cspell/dict-makefile@^1.0.3":
  version "1.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-makefile/-/dict-makefile-1.0.3.tgz#08d3349bf7cbd8f5dacf8641f3d35092ca0b8b38"
  integrity sha512-R3U0DSpvTs6qdqfyBATnePj9Q/pypkje0Nj26mQJ8TOBQutCRAJbr2ZFAeDjgRx5EAJU/+8txiyVF97fbVRViw==

"@cspell/dict-markdown@^2.0.7":
  version "2.0.7"
  resolved "https://npm.dev-internal.org/@cspell/dict-markdown/-/dict-markdown-2.0.7.tgz#15d6f9eed6bd1b33921b4332426ff387961163f1"
  integrity sha512-F9SGsSOokFn976DV4u/1eL4FtKQDSgJHSZ3+haPRU5ki6OEqojxKa8hhj4AUrtNFpmBaJx/WJ4YaEzWqG7hgqg==

"@cspell/dict-monkeyc@^1.0.9":
  version "1.0.9"
  resolved "https://npm.dev-internal.org/@cspell/dict-monkeyc/-/dict-monkeyc-1.0.9.tgz#58b5f6f15fc7c11ce0eeffd0742fba4b39fc0b8b"
  integrity sha512-Jvf6g5xlB4+za3ThvenYKREXTEgzx5gMUSzrAxIiPleVG4hmRb/GBSoSjtkGaibN3XxGx5x809gSTYCA/IHCpA==

"@cspell/dict-node@^5.0.5":
  version "5.0.5"
  resolved "https://npm.dev-internal.org/@cspell/dict-node/-/dict-node-5.0.5.tgz#11653612ebdd833208432e8b3cbe61bd6dd35dc3"
  integrity sha512-7NbCS2E8ZZRZwlLrh2sA0vAk9n1kcTUiRp/Nia8YvKaItGXLfxYqD2rMQ3HpB1kEutal6hQLVic3N2Yi1X7AaA==

"@cspell/dict-npm@^5.1.17":
  version "5.1.18"
  resolved "https://npm.dev-internal.org/@cspell/dict-npm/-/dict-npm-5.1.18.tgz#5f748f24a96cae46a1c601da01e1d2fc3ccdb0c7"
  integrity sha512-/Nukl+DSxtEWSlb8svWFSpJVctAsM9SP+f5Q1n+qdDcXNKMb1bUCo/d3QZPwyOhuMjDawnsGBUAfp+iq7Mw83Q==

"@cspell/dict-php@^4.0.13":
  version "4.0.13"
  resolved "https://npm.dev-internal.org/@cspell/dict-php/-/dict-php-4.0.13.tgz#86f1e6fb2174b2b0fa012baf86c448b2730f04f9"
  integrity sha512-P6sREMZkhElzz/HhXAjahnICYIqB/HSGp1EhZh+Y6IhvC15AzgtDP8B8VYCIsQof6rPF1SQrFwunxOv8H1e2eg==

"@cspell/dict-powershell@^5.0.13":
  version "5.0.13"
  resolved "https://npm.dev-internal.org/@cspell/dict-powershell/-/dict-powershell-5.0.13.tgz#f557aa04ee9bda4fe091308a0bcaea09ed12fa76"
  integrity sha512-0qdj0XZIPmb77nRTynKidRJKTU0Fl+10jyLbAhFTuBWKMypVY06EaYFnwhsgsws/7nNX8MTEQuewbl9bWFAbsg==

"@cspell/dict-public-licenses@^2.0.11":
  version "2.0.11"
  resolved "https://npm.dev-internal.org/@cspell/dict-public-licenses/-/dict-public-licenses-2.0.11.tgz#37550c4e0cd445991caba528bf4ba58ce7a935c3"
  integrity sha512-rR5KjRUSnVKdfs5G+gJ4oIvQvm8+NJ6cHWY2N+GE69/FSGWDOPHxulCzeGnQU/c6WWZMSimG9o49i9r//lUQyA==

"@cspell/dict-python@^4.2.13":
  version "4.2.13"
  resolved "https://npm.dev-internal.org/@cspell/dict-python/-/dict-python-4.2.13.tgz#c3dbaa7e2434c835e11540345e2168e5e685190a"
  integrity sha512-mZIcmo9qif8LkJ6N/lqTZawcOk2kVTcuWIUOSbMcjyomO0XZ7iWz15TfONyr03Ea/l7o5ULV+MZ4vx76bAUb7w==
  dependencies:
    "@cspell/dict-data-science" "^2.0.5"

"@cspell/dict-r@^2.0.4":
  version "2.0.4"
  resolved "https://npm.dev-internal.org/@cspell/dict-r/-/dict-r-2.0.4.tgz#31b5abd91cc12aebfffdde4be4d2902668789311"
  integrity sha512-cBpRsE/U0d9BRhiNRMLMH1PpWgw+N+1A2jumgt1if9nBGmQw4MUpg2u9I0xlFVhstTIdzXiLXMxP45cABuiUeQ==

"@cspell/dict-ruby@^5.0.7":
  version "5.0.7"
  resolved "https://npm.dev-internal.org/@cspell/dict-ruby/-/dict-ruby-5.0.7.tgz#3593a955baaffe3c5d28fb178b72fdf93c7eec71"
  integrity sha512-4/d0hcoPzi5Alk0FmcyqlzFW9lQnZh9j07MJzPcyVO62nYJJAGKaPZL2o4qHeCS/od/ctJC5AHRdoUm0ktsw6Q==

"@cspell/dict-rust@^4.0.10":
  version "4.0.10"
  resolved "https://npm.dev-internal.org/@cspell/dict-rust/-/dict-rust-4.0.10.tgz#8ae6eaf31a0ebce9dc8fd8dd68e5925e1d5290ee"
  integrity sha512-6o5C8566VGTTctgcwfF3Iy7314W0oMlFFSQOadQ0OEdJ9Z9ERX/PDimrzP3LGuOrvhtEFoK8pj+BLnunNwRNrw==

"@cspell/dict-scala@^5.0.6":
  version "5.0.6"
  resolved "https://npm.dev-internal.org/@cspell/dict-scala/-/dict-scala-5.0.6.tgz#5e925def2fe6dc27ee2ad1c452941c3d6790fb6d"
  integrity sha512-tl0YWAfjUVb4LyyE4JIMVE8DlLzb1ecHRmIWc4eT6nkyDqQgHKzdHsnusxFEFMVLIQomgSg0Zz6hJ5S1E4W4ww==

"@cspell/dict-software-terms@^4.1.19":
  version "4.1.20"
  resolved "https://npm.dev-internal.org/@cspell/dict-software-terms/-/dict-software-terms-4.1.20.tgz#8a4956bbc0df9153f792b3adb7e35035f82e679f"
  integrity sha512-ma51njqbk9ZKzZF9NpCZpZ+c50EwR5JTJ2LEXlX0tX+ExVbKpthhlDLhT2+mkUh5Zvj+CLf5F9z0qB4+X3re/w==

"@cspell/dict-sql@^2.1.8":
  version "2.1.8"
  resolved "https://npm.dev-internal.org/@cspell/dict-sql/-/dict-sql-2.1.8.tgz#45ea53b3e57fd2cc5f839f49b644aa743dac4990"
  integrity sha512-dJRE4JV1qmXTbbGm6WIcg1knmR6K5RXnQxF4XHs5HA3LAjc/zf77F95i5LC+guOGppVF6Hdl66S2UyxT+SAF3A==

"@cspell/dict-svelte@^1.0.5":
  version "1.0.5"
  resolved "https://npm.dev-internal.org/@cspell/dict-svelte/-/dict-svelte-1.0.5.tgz#09752e01ff6667e737566d9dfc704c8dcc9a6492"
  integrity sha512-sseHlcXOqWE4Ner9sg8KsjxwSJ2yssoJNqFHR9liWVbDV+m7kBiUtn2EB690TihzVsEmDr/0Yxrbb5Bniz70mA==

"@cspell/dict-swift@^2.0.4":
  version "2.0.4"
  resolved "https://npm.dev-internal.org/@cspell/dict-swift/-/dict-swift-2.0.4.tgz#bc19522418ed68cf914736b612c4e4febbf07e8d"
  integrity sha512-CsFF0IFAbRtYNg0yZcdaYbADF5F3DsM8C4wHnZefQy8YcHP/qjAF/GdGfBFBLx+XSthYuBlo2b2XQVdz3cJZBw==

"@cspell/dict-terraform@^1.0.6":
  version "1.0.6"
  resolved "https://npm.dev-internal.org/@cspell/dict-terraform/-/dict-terraform-1.0.6.tgz#f67b7363d0cf08c820818980bbe8c927332ad0b8"
  integrity sha512-Sqm5vGbXuI9hCFcr4w6xWf4Y25J9SdleE/IqfM6RySPnk8lISEmVdax4k6+Kinv9qaxyvnIbUUN4WFLWcBPQAg==

"@cspell/dict-typescript@^3.1.11":
  version "3.1.11"
  resolved "https://npm.dev-internal.org/@cspell/dict-typescript/-/dict-typescript-3.1.11.tgz#40586f13b0337bd9cba958e0661b35888580b249"
  integrity sha512-FwvK5sKbwrVpdw0e9+1lVTl8FPoHYvfHRuQRQz2Ql5XkC0gwPPkpoyD1zYImjIyZRoYXk3yp9j8ss4iz7A7zoQ==

"@cspell/dict-vue@^3.0.3":
  version "3.0.3"
  resolved "https://npm.dev-internal.org/@cspell/dict-vue/-/dict-vue-3.0.3.tgz#295c288f6fd363879898223202ec3be048663b98"
  integrity sha512-akmYbrgAGumqk1xXALtDJcEcOMYBYMnkjpmGzH13Ozhq1mkPF4VgllFQlm1xYde+BUKNnzMgPEzxrL2qZllgYA==

"@cspell/dynamic-import@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/dynamic-import/-/dynamic-import-8.17.1.tgz#2b3f3325b6013a067a1a49cda8b69ae73aaed36a"
  integrity sha512-XQtr2olYOtqbg49E+8SISd6I5DzfxmsKINDn0ZgaTFeLalnNdF3ewDU4gOEbApIzGffRa1mW9t19MsiVrznSDw==
  dependencies:
    "@cspell/url" "8.17.1"
    import-meta-resolve "^4.1.0"

"@cspell/filetypes@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/filetypes/-/filetypes-8.17.1.tgz#d193afc5029364334f005ff23f4c4cb80170c374"
  integrity sha512-AxYw6j7EPYtDFAFjwybjFpMc9waXQzurfBXmEVfQ5RQRlbylujLZWwR6GnMqofeNg4oGDUpEjcAZFrgdkvMQlA==

"@cspell/strong-weak-map@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/strong-weak-map/-/strong-weak-map-8.17.1.tgz#2fa88f283ef10222fad25134b5ebb54edaad985f"
  integrity sha512-8cY3vLAKdt5gQEMM3Gr57BuQ8sun2NjYNh9qTdrctC1S9gNC7XzFghTYAfHSWR4VrOUcMFLO/izMdsc1KFvFOA==

"@cspell/url@8.17.1":
  version "8.17.1"
  resolved "https://npm.dev-internal.org/@cspell/url/-/url-8.17.1.tgz#e7daec1597fa31b4d0a7a685e7a24a11b0c8a193"
  integrity sha512-LMvReIndW1ckvemElfDgTt282fb2C3C/ZXfsm0pJsTV5ZmtdelCHwzmgSBmY5fDr7D66XDp8EurotSE0K6BTvw==

"@ctrl/tinycolor@^4.0.4":
  version "4.1.0"
  resolved "https://npm.dev-internal.org/@ctrl/tinycolor/-/tinycolor-4.1.0.tgz#91a8f8120ffc9da2feb2a38f7862b300d5e9691a"
  integrity sha512-WyOx8cJQ+FQus4Mm4uPIZA64gbk3Wxh0so5Lcii0aJifqwoVOlfFtorjLE0Hen4OYyHZMXDWqMmaQemBhgxFRQ==

"@emmetio/abbreviation@^2.3.3":
  version "2.3.3"
  resolved "https://npm.dev-internal.org/@emmetio/abbreviation/-/abbreviation-2.3.3.tgz#ed2b88fe37b972292d6026c7c540aaf887cecb6e"
  integrity sha512-mgv58UrU3rh4YgbE/TzgLQwJ3pFsHHhCLqY20aJq+9comytTXUDNGG/SMtSeMJdkpxgXSXunBGLD8Boka3JyVA==
  dependencies:
    "@emmetio/scanner" "^1.0.4"

"@emmetio/css-abbreviation@^2.1.8":
  version "2.1.8"
  resolved "https://npm.dev-internal.org/@emmetio/css-abbreviation/-/css-abbreviation-2.1.8.tgz#b785313486eba6cb7eb623ad39378c4e1063dc00"
  integrity sha512-s9yjhJ6saOO/uk1V74eifykk2CBYi01STTK3WlXWGOepyKa23ymJ053+DNQjpFcy1ingpaO7AxCcwLvHFY9tuw==
  dependencies:
    "@emmetio/scanner" "^1.0.4"

"@emmetio/css-parser@^0.4.0":
  version "0.4.0"
  resolved "https://npm.dev-internal.org/@emmetio/css-parser/-/css-parser-0.4.0.tgz#96135093480c79703df0e4f178f7f8f2b669fbc2"
  integrity sha512-z7wkxRSZgrQHXVzObGkXG+Vmj3uRlpM11oCZ9pbaz0nFejvCDmAiNDpY75+wgXOcffKpj4rzGtwGaZxfJKsJxw==
  dependencies:
    "@emmetio/stream-reader" "^2.2.0"
    "@emmetio/stream-reader-utils" "^0.1.0"

"@emmetio/html-matcher@^1.3.0":
  version "1.3.0"
  resolved "https://npm.dev-internal.org/@emmetio/html-matcher/-/html-matcher-1.3.0.tgz#43b7a71b91cdc511cb699cbe9c67bb5d4cab6754"
  integrity sha512-NTbsvppE5eVyBMuyGfVu2CRrLvo7J4YHb6t9sBFLyY03WYhXET37qA4zOYUjBWFCRHO7pS1B9khERtY0f5JXPQ==
  dependencies:
    "@emmetio/scanner" "^1.0.0"

"@emmetio/scanner@^1.0.0", "@emmetio/scanner@^1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@emmetio/scanner/-/scanner-1.0.4.tgz#e9cdc67194fd91f8b7eb141014be4f2d086c15f1"
  integrity sha512-IqRuJtQff7YHHBk4G8YZ45uB9BaAGcwQeVzgj/zj8/UdOhtQpEIupUhSk8dys6spFIWVZVeK20CzGEnqR5SbqA==

"@emmetio/stream-reader-utils@^0.1.0":
  version "0.1.0"
  resolved "https://npm.dev-internal.org/@emmetio/stream-reader-utils/-/stream-reader-utils-0.1.0.tgz#244cb02c77ec2e74f78a9bd318218abc9c500a61"
  integrity sha512-ZsZ2I9Vzso3Ho/pjZFsmmZ++FWeEd/txqybHTm4OgaZzdS8V9V/YYWQwg5TC38Z7uLWUV1vavpLLbjJtKubR1A==

"@emmetio/stream-reader@^2.2.0":
  version "2.2.0"
  resolved "https://npm.dev-internal.org/@emmetio/stream-reader/-/stream-reader-2.2.0.tgz#46cffea119a0a003312a21c2d9b5628cb5fcd442"
  integrity sha512-fXVXEyFA5Yv3M3n8sUGT7+fvecGrZP4k6FnWWMSZVQf69kAq0LLpaBQLGcPR30m3zMmKYhECP4k/ZkzvhEW5kw==

"@emnapi/runtime@^1.2.0":
  version "1.3.1"
  resolved "https://npm.dev-internal.org/@emnapi/runtime/-/runtime-1.3.1.tgz#0fcaa575afc31f455fd33534c19381cfce6c6f60"
  integrity sha512-kEBmG8KyqtxJZv+ygbEim+KCGtIq1fC22Ms3S4ziXmYKm8uyoLX0MHONVKwp+9opg390VaKRNt4a7A9NwmpNhw==
  dependencies:
    tslib "^2.4.0"

"@esbuild/aix-ppc64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.0.tgz#499600c5e1757a524990d5d92601f0ac3ce87f64"
  integrity sha512-O7vun9Sf8DFjH2UtqK8Ku3LkquL9SZL8OLY1T5NZkA34+wG3OQF7cl4Ql8vdNzM6fzBbYfLaiRLIOZ+2FOCgBQ==

"@esbuild/android-arm64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/android-arm64/-/android-arm64-0.25.0.tgz#b9b8231561a1dfb94eb31f4ee056b92a985c324f"
  integrity sha512-grvv8WncGjDSyUBjN9yHXNt+cq0snxXbDxy5pJtzMKGmmpPxeAmAhWxXI+01lU5rwZomDgD3kJwulEnhTRUd6g==

"@esbuild/android-arm@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/android-arm/-/android-arm-0.25.0.tgz#ca6e7888942505f13e88ac9f5f7d2a72f9facd2b"
  integrity sha512-PTyWCYYiU0+1eJKmw21lWtC+d08JDZPQ5g+kFyxP0V+es6VPPSUhM6zk8iImp2jbV6GwjX4pap0JFbUQN65X1g==

"@esbuild/android-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/android-x64/-/android-x64-0.25.0.tgz#e765ea753bac442dfc9cb53652ce8bd39d33e163"
  integrity sha512-m/ix7SfKG5buCnxasr52+LI78SQ+wgdENi9CqyCXwjVR2X4Jkz+BpC3le3AoBPYTC9NHklwngVXvbJ9/Akhrfg==

"@esbuild/darwin-arm64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.0.tgz#fa394164b0d89d4fdc3a8a21989af70ef579fa2c"
  integrity sha512-mVwdUb5SRkPayVadIOI78K7aAnPamoeFR2bT5nszFUZ9P8UpK4ratOdYbZZXYSqPKMHfS1wdHCJk1P1EZpRdvw==

"@esbuild/darwin-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/darwin-x64/-/darwin-x64-0.25.0.tgz#91979d98d30ba6e7d69b22c617cc82bdad60e47a"
  integrity sha512-DgDaYsPWFTS4S3nWpFcMn/33ZZwAAeAFKNHNa1QN0rI4pUjgqf0f7ONmXf6d22tqTY+H9FNdgeaAa+YIFUn2Rg==

"@esbuild/freebsd-arm64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.25.0.tgz#b97e97073310736b430a07b099d837084b85e9ce"
  integrity sha512-VN4ocxy6dxefN1MepBx/iD1dH5K8qNtNe227I0mnTRjry8tj5MRk4zprLEdG8WPyAPb93/e4pSgi1SoHdgOa4w==

"@esbuild/freebsd-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/freebsd-x64/-/freebsd-x64-0.25.0.tgz#f3b694d0da61d9910ec7deff794d444cfbf3b6e7"
  integrity sha512-mrSgt7lCh07FY+hDD1TxiTyIHyttn6vnjesnPoVDNmDfOmggTLXRv8Id5fNZey1gl/V2dyVK1VXXqVsQIiAk+A==

"@esbuild/linux-arm64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-arm64/-/linux-arm64-0.25.0.tgz#f921f699f162f332036d5657cad9036f7a993f73"
  integrity sha512-9QAQjTWNDM/Vk2bgBl17yWuZxZNQIF0OUUuPZRKoDtqF2k4EtYbpyiG5/Dk7nqeK6kIJWPYldkOcBqjXjrUlmg==

"@esbuild/linux-arm@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-arm/-/linux-arm-0.25.0.tgz#cc49305b3c6da317c900688995a4050e6cc91ca3"
  integrity sha512-vkB3IYj2IDo3g9xX7HqhPYxVkNQe8qTK55fraQyTzTX/fxaDtXiEnavv9geOsonh2Fd2RMB+i5cbhu2zMNWJwg==

"@esbuild/linux-ia32@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-ia32/-/linux-ia32-0.25.0.tgz#3e0736fcfab16cff042dec806247e2c76e109e19"
  integrity sha512-43ET5bHbphBegyeqLb7I1eYn2P/JYGNmzzdidq/w0T8E2SsYL1U6un2NFROFRg1JZLTzdCoRomg8Rvf9M6W6Gg==

"@esbuild/linux-loong64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-loong64/-/linux-loong64-0.25.0.tgz#ea2bf730883cddb9dfb85124232b5a875b8020c7"
  integrity sha512-fC95c/xyNFueMhClxJmeRIj2yrSMdDfmqJnyOY4ZqsALkDrrKJfIg5NTMSzVBr5YW1jf+l7/cndBfP3MSDpoHw==

"@esbuild/linux-mips64el@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-mips64el/-/linux-mips64el-0.25.0.tgz#4cababb14eede09248980a2d2d8b966464294ff1"
  integrity sha512-nkAMFju7KDW73T1DdH7glcyIptm95a7Le8irTQNO/qtkoyypZAnjchQgooFUDQhNAy4iu08N79W4T4pMBwhPwQ==

"@esbuild/linux-ppc64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-ppc64/-/linux-ppc64-0.25.0.tgz#8860a4609914c065373a77242e985179658e1951"
  integrity sha512-NhyOejdhRGS8Iwv+KKR2zTq2PpysF9XqY+Zk77vQHqNbo/PwZCzB5/h7VGuREZm1fixhs4Q/qWRSi5zmAiO4Fw==

"@esbuild/linux-riscv64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-riscv64/-/linux-riscv64-0.25.0.tgz#baf26e20bb2d38cfb86ee282dff840c04f4ed987"
  integrity sha512-5S/rbP5OY+GHLC5qXp1y/Mx//e92L1YDqkiBbO9TQOvuFXM+iDqUNG5XopAnXoRH3FjIUDkeGcY1cgNvnXp/kA==

"@esbuild/linux-s390x@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-s390x/-/linux-s390x-0.25.0.tgz#8323afc0d6cb1b6dc6e9fd21efd9e1542c3640a4"
  integrity sha512-XM2BFsEBz0Fw37V0zU4CXfcfuACMrppsMFKdYY2WuTS3yi8O1nFOhil/xhKTmE1nPmVyvQJjJivgDT+xh8pXJA==

"@esbuild/linux-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/linux-x64/-/linux-x64-0.25.0.tgz#08fcf60cb400ed2382e9f8e0f5590bac8810469a"
  integrity sha512-9yl91rHw/cpwMCNytUDxwj2XjFpxML0y9HAOH9pNVQDpQrBxHy01Dx+vaMu0N1CKa/RzBD2hB4u//nfc+Sd3Cw==

"@esbuild/netbsd-arm64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.25.0.tgz#935c6c74e20f7224918fbe2e6c6fe865b6c6ea5b"
  integrity sha512-RuG4PSMPFfrkH6UwCAqBzauBWTygTvb1nxWasEJooGSJ/NwRw7b2HOwyRTQIU97Hq37l3npXoZGYMy3b3xYvPw==

"@esbuild/netbsd-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/netbsd-x64/-/netbsd-x64-0.25.0.tgz#414677cef66d16c5a4d210751eb2881bb9c1b62b"
  integrity sha512-jl+qisSB5jk01N5f7sPCsBENCOlPiS/xptD5yxOx2oqQfyourJwIKLRA2yqWdifj3owQZCL2sn6o08dBzZGQzA==

"@esbuild/openbsd-arm64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.25.0.tgz#8fd55a4d08d25cdc572844f13c88d678c84d13f7"
  integrity sha512-21sUNbq2r84YE+SJDfaQRvdgznTD8Xc0oc3p3iW/a1EVWeNj/SdUCbm5U0itZPQYRuRTW20fPMWMpcrciH2EJw==

"@esbuild/openbsd-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/openbsd-x64/-/openbsd-x64-0.25.0.tgz#0c48ddb1494bbc2d6bcbaa1429a7f465fa1dedde"
  integrity sha512-2gwwriSMPcCFRlPlKx3zLQhfN/2WjJ2NSlg5TKLQOJdV0mSxIcYNTMhk3H3ulL/cak+Xj0lY1Ym9ysDV1igceg==

"@esbuild/sunos-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/sunos-x64/-/sunos-x64-0.25.0.tgz#86ff9075d77962b60dd26203d7352f92684c8c92"
  integrity sha512-bxI7ThgLzPrPz484/S9jLlvUAHYMzy6I0XiU1ZMeAEOBcS0VePBFxh1JjTQt3Xiat5b6Oh4x7UC7IwKQKIJRIg==

"@esbuild/win32-arm64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/win32-arm64/-/win32-arm64-0.25.0.tgz#849c62327c3229467f5b5cd681bf50588442e96c"
  integrity sha512-ZUAc2YK6JW89xTbXvftxdnYy3m4iHIkDtK3CLce8wg8M2L+YZhIvO1DKpxrd0Yr59AeNNkTiic9YLf6FTtXWMw==

"@esbuild/win32-ia32@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/win32-ia32/-/win32-ia32-0.25.0.tgz#f62eb480cd7cca088cb65bb46a6db25b725dc079"
  integrity sha512-eSNxISBu8XweVEWG31/JzjkIGbGIJN/TrRoiSVZwZ6pkC6VX4Im/WV2cz559/TXLcYbcrDN8JtKgd9DJVIo8GA==

"@esbuild/win32-x64@0.25.0":
  version "0.25.0"
  resolved "https://npm.dev-internal.org/@esbuild/win32-x64/-/win32-x64-0.25.0.tgz#c8e119a30a7c8d60b9d2e22d2073722dde3b710b"
  integrity sha512-ZENoHJBxA20C2zFzh6AI4fT6RraMzjYw4xKWemRTRmRVtN9c5DcH9r/f2ihEkMjOW5eGgrwCslG/+Y/3bL+DHQ==

"@expressive-code/core@^0.38.3":
  version "0.38.3"
  resolved "https://npm.dev-internal.org/@expressive-code/core/-/core-0.38.3.tgz#e5ae46ba527846370c862c534792c2f98b51f760"
  integrity sha512-s0/OtdRpBONwcn23O8nVwDNQqpBGKscysejkeBkwlIeHRLZWgiTVrusT5Idrdz1d8cW5wRk9iGsAIQmwDPXgJg==
  dependencies:
    "@ctrl/tinycolor" "^4.0.4"
    hast-util-select "^6.0.2"
    hast-util-to-html "^9.0.1"
    hast-util-to-text "^4.0.1"
    hastscript "^9.0.0"
    postcss "^8.4.38"
    postcss-nested "^6.0.1"
    unist-util-visit "^5.0.0"
    unist-util-visit-parents "^6.0.1"

"@expressive-code/plugin-frames@^0.38.3":
  version "0.38.3"
  resolved "https://npm.dev-internal.org/@expressive-code/plugin-frames/-/plugin-frames-0.38.3.tgz#c0ddc5f3aa170e8009aecce508e91a10366b8203"
  integrity sha512-qL2oC6FplmHNQfZ8ZkTR64/wKo9x0c8uP2WDftR/ydwN/yhe1ed7ZWYb8r3dezxsls+tDokCnN4zYR594jbpvg==
  dependencies:
    "@expressive-code/core" "^0.38.3"

"@expressive-code/plugin-shiki@^0.38.3":
  version "0.38.3"
  resolved "https://npm.dev-internal.org/@expressive-code/plugin-shiki/-/plugin-shiki-0.38.3.tgz#07186d1f76fccf9fcd288ee64990fc065586a382"
  integrity sha512-kqHnglZeesqG3UKrb6e9Fq5W36AZ05Y9tCREmSN2lw8LVTqENIeCIkLDdWtQ5VoHlKqwUEQFTVlRehdwoY7Gmw==
  dependencies:
    "@expressive-code/core" "^0.38.3"
    shiki "^1.22.2"

"@expressive-code/plugin-text-markers@^0.38.3":
  version "0.38.3"
  resolved "https://npm.dev-internal.org/@expressive-code/plugin-text-markers/-/plugin-text-markers-0.38.3.tgz#86dadb812df4bc8ebb35dd748ad3dd9fdccc1a3d"
  integrity sha512-dPK3+BVGTbTmGQGU3Fkj3jZ3OltWUAlxetMHI6limUGCWBCucZiwoZeFM/WmqQa71GyKRzhBT+iEov6kkz2xVA==
  dependencies:
    "@expressive-code/core" "^0.38.3"

"@img/sharp-darwin-arm64@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.33.5.tgz#ef5b5a07862805f1e8145a377c8ba6e98813ca08"
  integrity sha512-UT4p+iz/2H4twwAoLCqfA9UH5pI6DggwKEGuaPy7nCVQ8ZsiY5PIcrRvD1DzuY3qYL07NtIQcWnBSY/heikIFQ==
  optionalDependencies:
    "@img/sharp-libvips-darwin-arm64" "1.0.4"

"@img/sharp-darwin-x64@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.33.5.tgz#e03d3451cd9e664faa72948cc70a403ea4063d61"
  integrity sha512-fyHac4jIc1ANYGRDxtiqelIbdWkIuQaI84Mv45KvGRRxSAa7o7d1ZKAOBaYbnepLC1WqxfpimdeWfvqqSGwR2Q==
  optionalDependencies:
    "@img/sharp-libvips-darwin-x64" "1.0.4"

"@img/sharp-libvips-darwin-arm64@1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.0.4.tgz#447c5026700c01a993c7804eb8af5f6e9868c07f"
  integrity sha512-XblONe153h0O2zuFfTAbQYAX2JhYmDHeWikp1LM9Hul9gVPjFY427k6dFEcOL72O01QxQsWi761svJ/ev9xEDg==

"@img/sharp-libvips-darwin-x64@1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.0.4.tgz#e0456f8f7c623f9dbfbdc77383caa72281d86062"
  integrity sha512-xnGR8YuZYfJGmWPvmlunFaWJsb9T/AO2ykoP3Fz/0X5XV2aoYBPkX6xqCQvUTKKiLddarLaxpzNe+b1hjeWHAQ==

"@img/sharp-libvips-linux-arm64@1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.0.4.tgz#979b1c66c9a91f7ff2893556ef267f90ebe51704"
  integrity sha512-9B+taZ8DlyyqzZQnoeIvDVR/2F4EbMepXMc/NdVbkzsJbzkUjhXv/70GQJ7tdLA4YJgNP25zukcxpX2/SueNrA==

"@img/sharp-libvips-linux-arm@1.0.5":
  version "1.0.5"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.0.5.tgz#99f922d4e15216ec205dcb6891b721bfd2884197"
  integrity sha512-gvcC4ACAOPRNATg/ov8/MnbxFDJqf/pDePbBnuBDcjsI8PssmjoKMAz4LtLaVi+OnSb5FK/yIOamqDwGmXW32g==

"@img/sharp-libvips-linux-s390x@1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.0.4.tgz#f8a5eb1f374a082f72b3f45e2fb25b8118a8a5ce"
  integrity sha512-u7Wz6ntiSSgGSGcjZ55im6uvTrOxSIS8/dgoVMoiGE9I6JAfU50yH5BoDlYA1tcuGS7g/QNtetJnxA6QEsCVTA==

"@img/sharp-libvips-linux-x64@1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.0.4.tgz#d4c4619cdd157774906e15770ee119931c7ef5e0"
  integrity sha512-MmWmQ3iPFZr0Iev+BAgVMb3ZyC4KeFc3jFxnNbEPas60e1cIfevbtuyf9nDGIzOaW9PdnDciJm+wFFaTlj5xYw==

"@img/sharp-libvips-linuxmusl-arm64@1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.0.4.tgz#166778da0f48dd2bded1fa3033cee6b588f0d5d5"
  integrity sha512-9Ti+BbTYDcsbp4wfYib8Ctm1ilkugkA/uscUn6UXK1ldpC1JjiXbLfFZtRlBhjPZ5o1NCLiDbg8fhUPKStHoTA==

"@img/sharp-libvips-linuxmusl-x64@1.0.4":
  version "1.0.4"
  resolved "https://npm.dev-internal.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.0.4.tgz#93794e4d7720b077fcad3e02982f2f1c246751ff"
  integrity sha512-viYN1KX9m+/hGkJtvYYp+CCLgnJXwiQB39damAO7WMdKWlIhmYTfHjwSbQeUK/20vY154mwezd9HflVFM1wVSw==

"@img/sharp-linux-arm64@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.33.5.tgz#edb0697e7a8279c9fc829a60fc35644c4839bb22"
  integrity sha512-JMVv+AMRyGOHtO1RFBiJy/MBsgz0x4AWrT6QoEVVTyh1E39TrCUpTRI7mx9VksGX4awWASxqCYLCV4wBZHAYxA==
  optionalDependencies:
    "@img/sharp-libvips-linux-arm64" "1.0.4"

"@img/sharp-linux-arm@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.33.5.tgz#422c1a352e7b5832842577dc51602bcd5b6f5eff"
  integrity sha512-JTS1eldqZbJxjvKaAkxhZmBqPRGmxgu+qFKSInv8moZ2AmT5Yib3EQ1c6gp493HvrvV8QgdOXdyaIBrhvFhBMQ==
  optionalDependencies:
    "@img/sharp-libvips-linux-arm" "1.0.5"

"@img/sharp-linux-s390x@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.33.5.tgz#f5c077926b48e97e4a04d004dfaf175972059667"
  integrity sha512-y/5PCd+mP4CA/sPDKl2961b+C9d+vPAveS33s6Z3zfASk2j5upL6fXVPZi7ztePZ5CuH+1kW8JtvxgbuXHRa4Q==
  optionalDependencies:
    "@img/sharp-libvips-linux-s390x" "1.0.4"

"@img/sharp-linux-x64@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.33.5.tgz#d806e0afd71ae6775cc87f0da8f2d03a7c2209cb"
  integrity sha512-opC+Ok5pRNAzuvq1AG0ar+1owsu842/Ab+4qvU879ippJBHvyY5n2mxF1izXqkPYlGuP/M556uh53jRLJmzTWA==
  optionalDependencies:
    "@img/sharp-libvips-linux-x64" "1.0.4"

"@img/sharp-linuxmusl-arm64@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.33.5.tgz#252975b915894fb315af5deea174651e208d3d6b"
  integrity sha512-XrHMZwGQGvJg2V/oRSUfSAfjfPxO+4DkiRh6p2AFjLQztWUuY/o8Mq0eMQVIY7HJ1CDQUJlxGGZRw1a5bqmd1g==
  optionalDependencies:
    "@img/sharp-libvips-linuxmusl-arm64" "1.0.4"

"@img/sharp-linuxmusl-x64@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.33.5.tgz#3f4609ac5d8ef8ec7dadee80b560961a60fd4f48"
  integrity sha512-WT+d/cgqKkkKySYmqoZ8y3pxx7lx9vVejxW/W4DOFMYVSkErR+w7mf2u8m/y4+xHe7yY9DAXQMWQhpnMuFfScw==
  optionalDependencies:
    "@img/sharp-libvips-linuxmusl-x64" "1.0.4"

"@img/sharp-wasm32@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-wasm32/-/sharp-wasm32-0.33.5.tgz#6f44f3283069d935bb5ca5813153572f3e6f61a1"
  integrity sha512-ykUW4LVGaMcU9lu9thv85CbRMAwfeadCJHRsg2GmeRa/cJxsVY9Rbd57JcMxBkKHag5U/x7TSBpScF4U8ElVzg==
  dependencies:
    "@emnapi/runtime" "^1.2.0"

"@img/sharp-win32-ia32@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.33.5.tgz#1a0c839a40c5351e9885628c85f2e5dfd02b52a9"
  integrity sha512-T36PblLaTwuVJ/zw/LaH0PdZkRz5rd3SmMHX8GSmR7vtNSP5Z6bQkExdSK7xGWyxLw4sUknBuugTelgw2faBbQ==

"@img/sharp-win32-x64@0.33.5":
  version "0.33.5"
  resolved "https://npm.dev-internal.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.33.5.tgz#56f00962ff0c4e0eb93d34a047d29fa995e3e342"
  integrity sha512-MpY/o8/8kj+EcnxwvrP4aTJSWw/aZ7JIGR4aBeZkZw5B7/Jn+tY9/VNwtcoGmdT7GfggGIU4kygOMSbYnOrAbg==

"@jridgewell/gen-mapping@^0.3.5":
  version "0.3.8"
  resolved "https://npm.dev-internal.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.8.tgz#4f0e06362e01362f823d348f1872b08f666d8142"
  integrity sha512-imAbBGkb+ebQyxKgzv5Hu2nmROxoDOXHh80evxdoXNOrvAnVx7zimzc1Oo5h9RlfV4vPXaE2iM5pOFbvOCClWA==
  dependencies:
    "@jridgewell/set-array" "^1.2.1"
    "@jridgewell/sourcemap-codec" "^1.4.10"
    "@jridgewell/trace-mapping" "^0.3.24"

"@jridgewell/resolve-uri@^3.1.0":
  version "3.1.2"
  resolved "https://npm.dev-internal.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz#7a0ee601f60f99a20c7c7c5ff0c80388c1189bd6"
  integrity sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==

"@jridgewell/set-array@^1.2.1":
  version "1.2.1"
  resolved "https://npm.dev-internal.org/@jridgewell/set-array/-/set-array-1.2.1.tgz#558fb6472ed16a4c850b889530e6b36438c49280"
  integrity sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==

"@jridgewell/sourcemap-codec@^1.4.10", "@jridgewell/sourcemap-codec@^1.4.14", "@jridgewell/sourcemap-codec@^1.4.15", "@jridgewell/sourcemap-codec@^1.5.0":
  version "1.5.0"
  resolved "https://npm.dev-internal.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.0.tgz#3188bcb273a414b0d215fd22a58540b989b9409a"
  integrity sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==

"@jridgewell/trace-mapping@^0.3.24", "@jridgewell/trace-mapping@^0.3.25":
  version "0.3.25"
  resolved "https://npm.dev-internal.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.25.tgz#15f190e98895f3fc23276ee14bc76b675c2e50f0"
  integrity sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==
  dependencies:
    "@jridgewell/resolve-uri" "^3.1.0"
    "@jridgewell/sourcemap-codec" "^1.4.14"

"@mdx-js/mdx@^3.1.0":
  version "3.1.0"
  resolved "https://npm.dev-internal.org/@mdx-js/mdx/-/mdx-3.1.0.tgz#10235cab8ad7d356c262e8c21c68df5850a97dc3"
  integrity sha512-/QxEhPAvGwbQmy1Px8F899L5Uc2KZ6JtXwlCgJmjSTBedwOZkByYcBG4GceIGPXRDsmfxhHazuS+hlOShRLeDw==
  dependencies:
    "@types/estree" "^1.0.0"
    "@types/estree-jsx" "^1.0.0"
    "@types/hast" "^3.0.0"
    "@types/mdx" "^2.0.0"
    collapse-white-space "^2.0.0"
    devlop "^1.0.0"
    estree-util-is-identifier-name "^3.0.0"
    estree-util-scope "^1.0.0"
    estree-walker "^3.0.0"
    hast-util-to-jsx-runtime "^2.0.0"
    markdown-extensions "^2.0.0"
    recma-build-jsx "^1.0.0"
    recma-jsx "^1.0.0"
    recma-stringify "^1.0.0"
    rehype-recma "^1.0.0"
    remark-mdx "^3.0.0"
    remark-parse "^11.0.0"
    remark-rehype "^11.0.0"
    source-map "^0.7.0"
    unified "^11.0.0"
    unist-util-position-from-estree "^2.0.0"
    unist-util-stringify-position "^4.0.0"
    unist-util-visit "^5.0.0"
    vfile "^6.0.0"

"@nodelib/fs.scandir@2.1.5":
  version "2.1.5"
  resolved "https://npm.dev-internal.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz#7619c2eb21b25483f6d167548b4cfd5a7488c3d5"
  integrity sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==
  dependencies:
    "@nodelib/fs.stat" "2.0.5"
    run-parallel "^1.1.9"

"@nodelib/fs.stat@2.0.5", "@nodelib/fs.stat@^2.0.2":
  version "2.0.5"
  resolved "https://npm.dev-internal.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz#5bd262af94e9d25bd1e71b05deed44876a222e8b"
  integrity sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==

"@nodelib/fs.walk@^1.2.3":
  version "1.2.8"
  resolved "https://npm.dev-internal.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz#e95737e8bb6746ddedf69c556953494f196fe69a"
  integrity sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==
  dependencies:
    "@nodelib/fs.scandir" "2.1.5"
    fastq "^1.6.0"

"@oslojs/encoding@^1.1.0":
  version "1.1.0"
  resolved "https://npm.dev-internal.org/@oslojs/encoding/-/encoding-1.1.0.tgz#55f3d9a597430a01f2a5ef63c6b42f769f9ce34e"
  integrity sha512-70wQhgYmndg4GCPxPPxPGevRKqTIJ2Nh4OkiMWmDAVYsTQ+Ta7Sq+rPevXyXGdzr30/qZBnyOalCszoMxlyldQ==

"@pagefind/darwin-arm64@1.3.0":
  version "1.3.0"
  resolved "https://npm.dev-internal.org/@pagefind/darwin-arm64/-/darwin-arm64-1.3.0.tgz#f1e63d031ba710c98b0b83db85df9251a255f543"
  integrity sha512-365BEGl6ChOsauRjyVpBjXybflXAOvoMROw3TucAROHIcdBvXk9/2AmEvGFU0r75+vdQI4LJdJdpH4Y6Yqaj4A==

"@pagefind/darwin-x64@1.3.0":
  version "1.3.0"
  resolved "https://npm.dev-internal.org/@pagefind/darwin-x64/-/darwin-x64-1.3.0.tgz#10aa3c5988daa464c5c0db5c5aa4bf72e9bbfba1"
  integrity sha512-zlGHA23uuXmS8z3XxEGmbHpWDxXfPZ47QS06tGUq0HDcZjXjXHeLG+cboOy828QIV5FXsm9MjfkP5e4ZNbOkow==

"@pagefind/default-ui@^1.0.3":
  version "1.3.0"
  resolved "https://npm.dev-internal.org/@pagefind/default-ui/-/default-ui-1.3.0.tgz#e3fb585d2fb08d463a8abc3c8f430420f0310109"
  integrity sha512-CGKT9ccd3+oRK6STXGgfH+m0DbOKayX6QGlq38TfE1ZfUcPc5+ulTuzDbZUnMo+bubsEOIypm4Pl2iEyzZ1cNg==

"@pagefind/linux-arm64@1.3.0":
  version "1.3.0"
  resolved "https://npm.dev-internal.org/@pagefind/linux-arm64/-/linux-arm64-1.3.0.tgz#cceb0391901736427738ee1232ff326a985eda8a"
  integrity sha512-8lsxNAiBRUk72JvetSBXs4WRpYrQrVJXjlRRnOL6UCdBN9Nlsz0t7hWstRk36+JqHpGWOKYiuHLzGYqYAqoOnQ==

"@pagefind/linux-x64@1.3.0":
  version "1.3.0"
  resolved "https://npm.dev-internal.org/@pagefind/linux-x64/-/linux-x64-1.3.0.tgz#06ec4c2907780a75d2fb65a22203c5a48abe7a82"
  integrity sha512-hAvqdPJv7A20Ucb6FQGE6jhjqy+vZ6pf+s2tFMNtMBG+fzcdc91uTw7aP/1Vo5plD0dAOHwdxfkyw0ugal4kcQ==

"@pagefind/windows-x64@1.3.0":
  version "1.3.0"
  resolved "https://npm.dev-internal.org/@pagefind/windows-x64/-/windows-x64-1.3.0.tgz#ce3394e5143aaca4850a33473a07628971773655"
  integrity sha512-BR1bIRWOMqkf8IoU576YDhij1Wd/Zf2kX/kCI0b2qzCKC8wcc2GQJaaRMCpzvCCrmliO4vtJ6RITp/AnoYUUmQ==

"@rollup/pluginutils@^5.1.3":
  version "5.1.4"
  resolved "https://npm.dev-internal.org/@rollup/pluginutils/-/pluginutils-5.1.4.tgz#bb94f1f9eaaac944da237767cdfee6c5b2262d4a"
  integrity sha512-USm05zrsFxYLPdWWq+K3STlWiT/3ELn3RcV5hJMghpeAIhxfsUIg6mt12CBJBInWMV4VneoV7SfGv8xIwo2qNQ==
  dependencies:
    "@types/estree" "^1.0.0"
    estree-walker "^2.0.2"
    picomatch "^4.0.2"

"@rollup/rollup-android-arm-eabi@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.28.1.tgz#7f4c4d8cd5ccab6e95d6750dbe00321c1f30791e"
  integrity sha512-2aZp8AES04KI2dy3Ss6/MDjXbwBzj+i0GqKtWXgw2/Ma6E4jJvujryO6gJAghIRVz7Vwr9Gtl/8na3nDUKpraQ==

"@rollup/rollup-android-arm64@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.28.1.tgz#17ea71695fb1518c2c324badbe431a0bd1879f2d"
  integrity sha512-EbkK285O+1YMrg57xVA+Dp0tDBRB93/BZKph9XhMjezf6F4TpYjaUSuPt5J0fZXlSag0LmZAsTmdGGqPp4pQFA==

"@rollup/rollup-darwin-arm64@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.28.1.tgz#dac0f0d0cfa73e7d5225ae6d303c13c8979e7999"
  integrity sha512-prduvrMKU6NzMq6nxzQw445zXgaDBbMQvmKSJaxpaZ5R1QDM8w+eGxo6Y/jhT/cLoCvnZI42oEqf9KQNYz1fqQ==

"@rollup/rollup-darwin-x64@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.28.1.tgz#8f63baa1d31784904a380d2e293fa1ddf53dd4a2"
  integrity sha512-WsvbOunsUk0wccO/TV4o7IKgloJ942hVFK1CLatwv6TJspcCZb9umQkPdvB7FihmdxgaKR5JyxDjWpCOp4uZlQ==

"@rollup/rollup-freebsd-arm64@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.28.1.tgz#30ed247e0df6e8858cdc6ae4090e12dbeb8ce946"
  integrity sha512-HTDPdY1caUcU4qK23FeeGxCdJF64cKkqajU0iBnTVxS8F7H/7BewvYoG+va1KPSL63kQ1PGNyiwKOfReavzvNA==

"@rollup/rollup-freebsd-x64@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.28.1.tgz#57846f382fddbb508412ae07855b8a04c8f56282"
  integrity sha512-m/uYasxkUevcFTeRSM9TeLyPe2QDuqtjkeoTpP9SW0XxUWfcYrGDMkO/m2tTw+4NMAF9P2fU3Mw4ahNvo7QmsQ==

"@rollup/rollup-linux-arm-gnueabihf@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.28.1.tgz#378ca666c9dae5e6f94d1d351e7497c176e9b6df"
  integrity sha512-QAg11ZIt6mcmzpNE6JZBpKfJaKkqTm1A9+y9O+frdZJEuhQxiugM05gnCWiANHj4RmbgeVJpTdmKRmH/a+0QbA==

"@rollup/rollup-linux-arm-musleabihf@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.28.1.tgz#a692eff3bab330d5c33a5d5813a090c15374cddb"
  integrity sha512-dRP9PEBfolq1dmMcFqbEPSd9VlRuVWEGSmbxVEfiq2cs2jlZAl0YNxFzAQS2OrQmsLBLAATDMb3Z6MFv5vOcXg==

"@rollup/rollup-linux-arm64-gnu@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.28.1.tgz#6b1719b76088da5ac1ae1feccf48c5926b9e3db9"
  integrity sha512-uGr8khxO+CKT4XU8ZUH1TTEUtlktK6Kgtv0+6bIFSeiSlnGJHG1tSFSjm41uQ9sAO/5ULx9mWOz70jYLyv1QkA==

"@rollup/rollup-linux-arm64-musl@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.28.1.tgz#865baf5b6f5ff67acb32e5a359508828e8dc5788"
  integrity sha512-QF54q8MYGAqMLrX2t7tNpi01nvq5RI59UBNx+3+37zoKX5KViPo/gk2QLhsuqok05sSCRluj0D00LzCwBikb0A==

"@rollup/rollup-linux-loongarch64-gnu@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-loongarch64-gnu/-/rollup-linux-loongarch64-gnu-4.28.1.tgz#23c6609ba0f7fa7a7f2038b6b6a08555a5055a87"
  integrity sha512-vPul4uodvWvLhRco2w0GcyZcdyBfpfDRgNKU+p35AWEbJ/HPs1tOUrkSueVbBS0RQHAf/A+nNtDpvw95PeVKOA==

"@rollup/rollup-linux-powerpc64le-gnu@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-powerpc64le-gnu/-/rollup-linux-powerpc64le-gnu-4.28.1.tgz#652ef0d9334a9f25b9daf85731242801cb0fc41c"
  integrity sha512-pTnTdBuC2+pt1Rmm2SV7JWRqzhYpEILML4PKODqLz+C7Ou2apEV52h19CR7es+u04KlqplggmN9sqZlekg3R1A==

"@rollup/rollup-linux-riscv64-gnu@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.28.1.tgz#1eb6651839ee6ebca64d6cc64febbd299e95e6bd"
  integrity sha512-vWXy1Nfg7TPBSuAncfInmAI/WZDd5vOklyLJDdIRKABcZWojNDY0NJwruY2AcnCLnRJKSaBgf/GiJfauu8cQZA==

"@rollup/rollup-linux-s390x-gnu@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.28.1.tgz#015c52293afb3ff2a293cf0936b1d43975c1e9cd"
  integrity sha512-/yqC2Y53oZjb0yz8PVuGOQQNOTwxcizudunl/tFs1aLvObTclTwZ0JhXF2XcPT/zuaymemCDSuuUPXJJyqeDOg==

"@rollup/rollup-linux-x64-gnu@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.28.1.tgz#b83001b5abed2bcb5e2dbeec6a7e69b194235c1e"
  integrity sha512-fzgeABz7rrAlKYB0y2kSEiURrI0691CSL0+KXwKwhxvj92VULEDQLpBYLHpF49MSiPG4sq5CK3qHMnb9tlCjBw==

"@rollup/rollup-linux-x64-musl@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.28.1.tgz#6cc7c84cd4563737f8593e66f33b57d8e228805b"
  integrity sha512-xQTDVzSGiMlSshpJCtudbWyRfLaNiVPXt1WgdWTwWz9n0U12cI2ZVtWe/Jgwyv/6wjL7b66uu61Vg0POWVfz4g==

"@rollup/rollup-win32-arm64-msvc@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.28.1.tgz#631ffeee094d71279fcd1fe8072bdcf25311bc11"
  integrity sha512-wSXmDRVupJstFP7elGMgv+2HqXelQhuNf+IS4V+nUpNVi/GUiBgDmfwD0UGN3pcAnWsgKG3I52wMOBnk1VHr/A==

"@rollup/rollup-win32-ia32-msvc@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.28.1.tgz#06d1d60d5b9f718e8a6c4a43f82e3f9e3254587f"
  integrity sha512-ZkyTJ/9vkgrE/Rk9vhMXhf8l9D+eAhbAVbsGsXKy2ohmJaWg0LPQLnIxRdRp/bKyr8tXuPlXhIoGlEB5XpJnGA==

"@rollup/rollup-win32-x64-msvc@4.28.1":
  version "4.28.1"
  resolved "https://npm.dev-internal.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.28.1.tgz#4dff5c4259ebe6c5b4a8f2c5bc3829b7a8447ff0"
  integrity sha512-ZvK2jBafvttJjoIdKm/Q/Bh7IJ1Ose9IBOwpOXcOvW3ikGTQGmKDgxTC6oCAzW6PynbkKP8+um1du81XJHZ0JA==

"@shikijs/core@1.24.2":
  version "1.24.2"
  resolved "https://npm.dev-internal.org/@shikijs/core/-/core-1.24.2.tgz#6308697f84a5029983885d0a7651d1667444bbce"
  integrity sha512-BpbNUSKIwbKrRRA+BQj0BEWSw+8kOPKDJevWeSE/xIqGX7K0xrCZQ9kK0nnEQyrzsUoka1l81ZtJ2mGaCA32HQ==
  dependencies:
    "@shikijs/engine-javascript" "1.24.2"
    "@shikijs/engine-oniguruma" "1.24.2"
    "@shikijs/types" "1.24.2"
    "@shikijs/vscode-textmate" "^9.3.0"
    "@types/hast" "^3.0.4"
    hast-util-to-html "^9.0.3"

"@shikijs/core@3.2.2":
  version "3.2.2"
  resolved "https://registry.npmjs.org/@shikijs/core/-/core-3.2.2.tgz#d3c7f53d964ee68ec63f4ad55a62dcf9eb42a9f8"
  integrity sha512-yvlSKVMLjddAGBa2Yu+vUZxuu3sClOWW1AG+UtJkvejYuGM5BVL35s6Ijiwb75O9QdEx6IkMxinHZSi8ZyrBaA==
  dependencies:
    "@shikijs/types" "3.2.2"
    "@shikijs/vscode-textmate" "^10.0.2"
    "@types/hast" "^3.0.4"
    hast-util-to-html "^9.0.5"

"@shikijs/engine-javascript@1.24.2":
  version "1.24.2"
  resolved "https://npm.dev-internal.org/@shikijs/engine-javascript/-/engine-javascript-1.24.2.tgz#af5920fdd76765d04dc5ec1a65cc77e355d6ceed"
  integrity sha512-EqsmYBJdLEwEiO4H+oExz34a5GhhnVp+jH9Q/XjPjmBPc6TE/x4/gD0X3i0EbkKKNqXYHHJTJUpOLRQNkEzS9Q==
  dependencies:
    "@shikijs/types" "1.24.2"
    "@shikijs/vscode-textmate" "^9.3.0"
    oniguruma-to-es "0.7.0"

"@shikijs/engine-javascript@3.2.2":
  version "3.2.2"
  resolved "https://registry.npmjs.org/@shikijs/engine-javascript/-/engine-javascript-3.2.2.tgz#d9a02f07ef6f173d929520ee36442560cf229f86"
  integrity sha512-tlDKfhWpF4jKLUyVAnmL+ggIC+0VyteNsUpBzh1iwWLZu4i+PelIRr0TNur6pRRo5UZIv3ss/PLMuwahg9S2hg==
  dependencies:
    "@shikijs/types" "3.2.2"
    "@shikijs/vscode-textmate" "^10.0.2"
    oniguruma-to-es "^4.1.0"

"@shikijs/engine-oniguruma@1.24.2":
  version "1.24.2"
  resolved "https://npm.dev-internal.org/@shikijs/engine-oniguruma/-/engine-oniguruma-1.24.2.tgz#90924001a17a2551a2a9073aed4af3767ce68b1b"
  integrity sha512-ZN6k//aDNWRJs1uKB12pturKHh7GejKugowOFGAuG7TxDRLod1Bd5JhpOikOiFqPmKjKEPtEA6mRCf7q3ulDyQ==
  dependencies:
    "@shikijs/types" "1.24.2"
    "@shikijs/vscode-textmate" "^9.3.0"

"@shikijs/engine-oniguruma@3.2.2":
  version "3.2.2"
  resolved "https://registry.npmjs.org/@shikijs/engine-oniguruma/-/engine-oniguruma-3.2.2.tgz#2a68e7be01960161615bcd6866a74f63c25578bc"
  integrity sha512-vyXRnWVCSvokwbaUD/8uPn6Gqsf5Hv7XwcW4AgiU4Z2qwy19sdr6VGzMdheKKN58tJOOe5MIKiNb901bgcUXYQ==
  dependencies:
    "@shikijs/types" "3.2.2"
    "@shikijs/vscode-textmate" "^10.0.2"

"@shikijs/langs@3.2.2":
  version "3.2.2"
  resolved "https://registry.npmjs.org/@shikijs/langs/-/langs-3.2.2.tgz#b4db801a27e9e29191cac8766db610a048e66cdb"
  integrity sha512-NY0Urg2dV9ETt3JIOWoMPuoDNwte3geLZ4M1nrPHbkDS8dWMpKcEwlqiEIGqtwZNmt5gKyWpR26ln2Bg2ecPgw==
  dependencies:
    "@shikijs/types" "3.2.2"

"@shikijs/themes@3.2.2":
  version "3.2.2"
  resolved "https://registry.npmjs.org/@shikijs/themes/-/themes-3.2.2.tgz#56b9d6f6803296e9cb7233e25334897496d40d9d"
  integrity sha512-Zuq4lgAxVKkb0FFdhHSdDkALuRpsj1so1JdihjKNQfgM78EHxV2JhO10qPsMrm01FkE3mDRTdF68wfmsqjt6HA==
  dependencies:
    "@shikijs/types" "3.2.2"

"@shikijs/types@1.24.2":
  version "1.24.2"
  resolved "https://npm.dev-internal.org/@shikijs/types/-/types-1.24.2.tgz#770313a0072a7c14ab1a130a36d02df7e4d87375"
  integrity sha512-bdeWZiDtajGLG9BudI0AHet0b6e7FbR0EsE4jpGaI0YwHm/XJunI9+3uZnzFtX65gsyJ6ngCIWUfA4NWRPnBkQ==
  dependencies:
    "@shikijs/vscode-textmate" "^9.3.0"
    "@types/hast" "^3.0.4"

"@shikijs/types@3.2.2":
  version "3.2.2"
  resolved "https://registry.npmjs.org/@shikijs/types/-/types-3.2.2.tgz#3718364c46965b15b767a38ef663877f4f7e6fa9"
  integrity sha512-a5TiHk7EH5Lso8sHcLHbVNNhWKP0Wi3yVnXnu73g86n3WoDgEra7n3KszyeCGuyoagspQ2fzvy4cpSc8pKhb0A==
  dependencies:
    "@shikijs/vscode-textmate" "^10.0.2"
    "@types/hast" "^3.0.4"

"@shikijs/vscode-textmate@^10.0.2":
  version "10.0.2"
  resolved "https://registry.npmjs.org/@shikijs/vscode-textmate/-/vscode-textmate-10.0.2.tgz#a90ab31d0cc1dfb54c66a69e515bf624fa7b2224"
  integrity sha512-83yeghZ2xxin3Nj8z1NMd/NCuca+gsYXswywDy5bHvwlWL8tpTQmzGeUuHd9FC3E/SBEMvzJRwWEOz5gGes9Qg==

"@shikijs/vscode-textmate@^9.3.0":
  version "9.3.1"
  resolved "https://npm.dev-internal.org/@shikijs/vscode-textmate/-/vscode-textmate-9.3.1.tgz#afda31f8f42cab70a26f3603f52eae3f1c35d2f7"
  integrity sha512-79QfK1393x9Ho60QFyLti+QfdJzRQCVLFb97kOIV7Eo9vQU/roINgk7m24uv0a7AUvN//RDH36FLjjK48v0s9g==

"@types/acorn@^4.0.0":
  version "4.0.6"
  resolved "https://npm.dev-internal.org/@types/acorn/-/acorn-4.0.6.tgz#d61ca5480300ac41a7d973dd5b84d0a591154a22"
  integrity sha512-veQTnWP+1D/xbxVrPC3zHnCZRjSrKfhbMUlEA43iMZLu7EsnTtkJklIuwrCPbOi8YkvDQAiW05VQQFvvz9oieQ==
  dependencies:
    "@types/estree" "*"

"@types/babel__core@^7.20.5":
  version "7.20.5"
  resolved "https://npm.dev-internal.org/@types/babel__core/-/babel__core-7.20.5.tgz#3df15f27ba85319caa07ba08d0721889bb39c017"
  integrity sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==
  dependencies:
    "@babel/parser" "^7.20.7"
    "@babel/types" "^7.20.7"
    "@types/babel__generator" "*"
    "@types/babel__template" "*"
    "@types/babel__traverse" "*"

"@types/babel__generator@*":
  version "7.6.8"
  resolved "https://npm.dev-internal.org/@types/babel__generator/-/babel__generator-7.6.8.tgz#f836c61f48b1346e7d2b0d93c6dacc5b9535d3ab"
  integrity sha512-ASsj+tpEDsEiFr1arWrlN6V3mdfjRMZt6LtK/Vp/kreFLnr5QH5+DhvD5nINYZXzwJvXeGq+05iUXcAzVrqWtw==
  dependencies:
    "@babel/types" "^7.0.0"

"@types/babel__template@*":
  version "7.4.4"
  resolved "https://npm.dev-internal.org/@types/babel__template/-/babel__template-7.4.4.tgz#5672513701c1b2199bc6dad636a9d7491586766f"
  integrity sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==
  dependencies:
    "@babel/parser" "^7.1.0"
    "@babel/types" "^7.0.0"

"@types/babel__traverse@*":
  version "7.20.6"
  resolved "https://npm.dev-internal.org/@types/babel__traverse/-/babel__traverse-7.20.6.tgz#8dc9f0ae0f202c08d8d4dab648912c8d6038e3f7"
  integrity sha512-r1bzfrm0tomOI8g1SzvCaQHo6Lcv6zu0EA+W2kHrt8dyrHQxGzBBL4kdkzIS+jBMV+EYcMAEAqXqYaLJq5rOZg==
  dependencies:
    "@babel/types" "^7.20.7"

"@types/braces@*":
  version "3.0.5"
  resolved "https://registry.npmjs.org/@types/braces/-/braces-3.0.5.tgz#91159f97e516630c7946d8b0d5bf60245986e04c"
  integrity sha512-SQFof9H+LXeWNz8wDe7oN5zu7ket0qwMu5vZubW4GCJ8Kkeh6nBWUz87+KTz/G3Kqsrp0j/W253XJb3KMEeg3w==

"@types/cookie@^0.6.0":
  version "0.6.0"
  resolved "https://npm.dev-internal.org/@types/cookie/-/cookie-0.6.0.tgz#eac397f28bf1d6ae0ae081363eca2f425bedf0d5"
  integrity sha512-4Kh9a6B2bQciAhf7FSuMRRkUWecJgJu9nPnx3yzpsfXX/c50REIqpHY4C82bXP90qrLtXtkDxTZosYO3UpOwlA==

"@types/debug@^4.0.0":
  version "4.1.12"
  resolved "https://npm.dev-internal.org/@types/debug/-/debug-4.1.12.tgz#a155f21690871953410df4b6b6f53187f0500917"
  integrity sha512-vIChWdVG3LG1SMxEvI/AK+FWJthlrqlTu7fbrlywTkkaONwk/UAGaULXRlf8vkzFBLVm0zkMdCquhL5aOjhXPQ==
  dependencies:
    "@types/ms" "*"

"@types/estree-jsx@^1.0.0":
  version "1.0.5"
  resolved "https://npm.dev-internal.org/@types/estree-jsx/-/estree-jsx-1.0.5.tgz#858a88ea20f34fe65111f005a689fa1ebf70dc18"
  integrity sha512-52CcUVNFyfb1A2ALocQw/Dd1BQFNmSdkuC3BkZ6iqhdMfQz7JWOFRuJFloOzjk+6WijU56m9oKXFAXc7o3Towg==
  dependencies:
    "@types/estree" "*"

"@types/estree@*", "@types/estree@1.0.6", "@types/estree@^1.0.0":
  version "1.0.6"
  resolved "https://npm.dev-internal.org/@types/estree/-/estree-1.0.6.tgz#628effeeae2064a1b4e79f78e81d87b7e5fc7b50"
  integrity sha512-AYnb1nQyY49te+VRAVgmzfcgjYS91mY5P0TKUDCLEM+gNnA+3T6rWITXRLYCpahpqSQbN5cE+gHpnPyXjHWxcw==

"@types/hast@^3.0.0", "@types/hast@^3.0.4":
  version "3.0.4"
  resolved "https://npm.dev-internal.org/@types/hast/-/hast-3.0.4.tgz#1d6b39993b82cea6ad783945b0508c25903e15aa"
  integrity sha512-WPs+bbQw5aCj+x6laNGWLH3wviHtoCv/P3+otBhbOhJgG8qtpdAMlTCxLtsTWA7LH1Oh/bFCHsBn0TPS5m30EQ==
  dependencies:
    "@types/unist" "*"

"@types/js-yaml@^4.0.9":
  version "4.0.9"
  resolved "https://npm.dev-internal.org/@types/js-yaml/-/js-yaml-4.0.9.tgz#cd82382c4f902fed9691a2ed79ec68c5898af4c2"
  integrity sha512-k4MGaQl5TGo/iipqb2UDG2UwjXziSWkh0uysQelTlJpX1qGlpUZYm8PnO4DxG1qBomtJUdYJ6qR6xdIah10JLg==

"@types/katex@^0.16.0":
  version "0.16.7"
  resolved "https://npm.dev-internal.org/@types/katex/-/katex-0.16.7.tgz#03ab680ab4fa4fbc6cb46ecf987ecad5d8019868"
  integrity sha512-HMwFiRujE5PjrgwHQ25+bsLJgowjGjm5Z8FVSf0N6PwgJrwxH0QxzHYDcKsTfV3wva0vzrpqMTJS2jXPr5BMEQ==

"@types/mdast@^4.0.0", "@types/mdast@^4.0.4":
  version "4.0.4"
  resolved "https://npm.dev-internal.org/@types/mdast/-/mdast-4.0.4.tgz#7ccf72edd2f1aa7dd3437e180c64373585804dd6"
  integrity sha512-kGaNbPh1k7AFzgpud/gMdvIm5xuECykRR+JnWKQno9TAXVa6WIVCGTPvYGekIDL4uwCZQSYbUxNBSb1aUo79oA==
  dependencies:
    "@types/unist" "*"

"@types/mdx@^2.0.0":
  version "2.0.13"
  resolved "https://npm.dev-internal.org/@types/mdx/-/mdx-2.0.13.tgz#68f6877043d377092890ff5b298152b0a21671bd"
  integrity sha512-+OWZQfAYyio6YkJb3HLxDrvnx6SWWDbC0zVPfBRzUk0/nqoDyf6dNxQi3eArPe8rJ473nobTMQ/8Zk+LxJ+Yuw==

"@types/micromatch@^4.0.9":
  version "4.0.9"
  resolved "https://registry.npmjs.org/@types/micromatch/-/micromatch-4.0.9.tgz#8e5763a8c1fc7fbf26144d9215a01ab0ff702dbb"
  integrity sha512-7V+8ncr22h4UoYRLnLXSpTxjQrNUXtWHGeMPRJt1nULXI57G9bIcpyrHlmrQ7QK24EyyuXvYcSSWAM8GA9nqCg==
  dependencies:
    "@types/braces" "*"

"@types/ms@*":
  version "0.7.34"
  resolved "https://npm.dev-internal.org/@types/ms/-/ms-0.7.34.tgz#10964ba0dee6ac4cd462e2795b6bebd407303433"
  integrity sha512-nG96G3Wp6acyAgJqGasjODb+acrI7KltPiRxzHPXnP3NgI28bpQDRv53olbqGXbfcgF5aiiHmO3xpwEpS5Ld9g==

"@types/nlcst@^2.0.0":
  version "2.0.3"
  resolved "https://npm.dev-internal.org/@types/nlcst/-/nlcst-2.0.3.tgz#31cad346eaab48a9a8a58465d3d05e2530dda762"
  integrity sha512-vSYNSDe6Ix3q+6Z7ri9lyWqgGhJTmzRjZRqyq15N0Z/1/UnVsno9G/N40NBijoYx2seFDIl0+B2mgAb9mezUCA==
  dependencies:
    "@types/unist" "*"

"@types/node@*":
  version "22.10.2"
  resolved "https://npm.dev-internal.org/@types/node/-/node-22.10.2.tgz#a485426e6d1fdafc7b0d4c7b24e2c78182ddabb9"
  integrity sha512-Xxr6BBRCAOQixvonOye19wnzyDiUtTeqldOOmj3CkeblonbccA12PFwlufvRdrpjXxqnmUaeiU5EOA+7s5diUQ==
  dependencies:
    undici-types "~6.20.0"

"@types/node@^17.0.5":
  version "17.0.45"
  resolved "https://npm.dev-internal.org/@types/node/-/node-17.0.45.tgz#2c0fafd78705e7a18b7906b5201a522719dc5190"
  integrity sha512-w+tIMs3rq2afQdsPJlODhoUEKzFP1ayaoyl1CcnwtIlsVe7K7bA1NGm4s3PraqTLlXnbIN84zuBlxBWo1u9BLw==

"@types/picomatch@2.3.3":
  version "2.3.3"
  resolved "https://npm.dev-internal.org/@types/picomatch/-/picomatch-2.3.3.tgz#be60498568c19e989e43fb39aa84be1ed3655e92"
  integrity sha512-Yll76ZHikRFCyz/pffKGjrCwe/le2CDwOP5F210KQo27kpRE46U2rDnzikNlVn6/ezH3Mhn46bJMTfeVTtcYMg==

"@types/sax@^1.2.1":
  version "1.2.7"
  resolved "https://npm.dev-internal.org/@types/sax/-/sax-1.2.7.tgz#ba5fe7df9aa9c89b6dff7688a19023dd2963091d"
  integrity sha512-rO73L89PJxeYM3s3pPPjiPgVVcymqU490g0YO5n5By0k2Erzj6tay/4lr1CHAAU4JyOWd1rpQ8bCf6cZfHU96A==
  dependencies:
    "@types/node" "*"

"@types/unist@*", "@types/unist@^3.0.0":
  version "3.0.3"
  resolved "https://npm.dev-internal.org/@types/unist/-/unist-3.0.3.tgz#acaab0f919ce69cce629c2d4ed2eb4adc1b6c20c"
  integrity sha512-ko/gIFJRv177XgZsZcBwnqJN5x/Gien8qNOn0D5bQU/zAzVf9Zt3BlcUiLqhV9y4ARk0GbT3tnUiPNgnTXzc/Q==

"@types/unist@^2.0.0":
  version "2.0.11"
  resolved "https://npm.dev-internal.org/@types/unist/-/unist-2.0.11.tgz#11af57b127e32487774841f7a4e54eab166d03c4"
  integrity sha512-CmBKiL6NNo/OqgmMn95Fk9Whlp2mtvIv+KNpQKN2F4SjvrEesubTRWGYSg+BnWZOnlCaSTU1sMpsBOzgbYhnsA==

"@ungap/structured-clone@^1.0.0":
  version "1.2.1"
  resolved "https://npm.dev-internal.org/@ungap/structured-clone/-/structured-clone-1.2.1.tgz#28fa185f67daaf7b7a1a8c1d445132c5d979f8bd"
  integrity sha512-fEzPV3hSkSMltkw152tJKNARhOupqbH96MZWyRjNaYZOMIzbrTeQDG+MTc6Mr2pgzFQzFxAfmhGDNP5QK++2ZA==

"@volar/kit@~2.4.7":
  version "2.4.11"
  resolved "https://npm.dev-internal.org/@volar/kit/-/kit-2.4.11.tgz#12fa1825bdbaa54752e86d9eecb0d3b6d1c60f5e"
  integrity sha512-ups5RKbMzMCr6RKafcCqDRnJhJDNWqo2vfekwOAj6psZ15v5TlcQFQAyokQJ3wZxVkzxrQM+TqTRDENfQEXpmA==
  dependencies:
    "@volar/language-service" "2.4.11"
    "@volar/typescript" "2.4.11"
    typesafe-path "^0.2.2"
    vscode-languageserver-textdocument "^1.0.11"
    vscode-uri "^3.0.8"

"@volar/language-core@2.4.11", "@volar/language-core@~2.4.7":
  version "2.4.11"
  resolved "https://npm.dev-internal.org/@volar/language-core/-/language-core-2.4.11.tgz#d95a9ec4f14fbdb41a6a64f9f321d11d23a5291c"
  integrity sha512-lN2C1+ByfW9/JRPpqScuZt/4OrUUse57GLI6TbLgTIqBVemdl1wNcZ1qYGEo2+Gw8coYLgCy7SuKqn6IrQcQgg==
  dependencies:
    "@volar/source-map" "2.4.11"

"@volar/language-server@~2.4.7":
  version "2.4.11"
  resolved "https://npm.dev-internal.org/@volar/language-server/-/language-server-2.4.11.tgz#e0d87bd8d4eee0470e806e832ed26f27caf08d81"
  integrity sha512-W9P8glH1M8LGREJ7yHRCANI5vOvTrRO15EMLdmh5WNF9sZYSEbQxiHKckZhvGIkbeR1WAlTl3ORTrJXUghjk7g==
  dependencies:
    "@volar/language-core" "2.4.11"
    "@volar/language-service" "2.4.11"
    "@volar/typescript" "2.4.11"
    path-browserify "^1.0.1"
    request-light "^0.7.0"
    vscode-languageserver "^9.0.1"
    vscode-languageserver-protocol "^3.17.5"
    vscode-languageserver-textdocument "^1.0.11"
    vscode-uri "^3.0.8"

"@volar/language-service@2.4.11", "@volar/language-service@~2.4.7":
  version "2.4.11"
  resolved "https://npm.dev-internal.org/@volar/language-service/-/language-service-2.4.11.tgz#44008ad68ff82c618fe4f6ad338af9164853e82b"
  integrity sha512-KIb6g8gjUkS2LzAJ9bJCLIjfsJjeRtmXlu7b2pDFGD3fNqdbC53cCAKzgWDs64xtQVKYBU13DLWbtSNFtGuMLQ==
  dependencies:
    "@volar/language-core" "2.4.11"
    vscode-languageserver-protocol "^3.17.5"
    vscode-languageserver-textdocument "^1.0.11"
    vscode-uri "^3.0.8"

"@volar/source-map@2.4.11":
  version "2.4.11"
  resolved "https://npm.dev-internal.org/@volar/source-map/-/source-map-2.4.11.tgz#5876d4531508129724c2755e295db1df98bd5895"
  integrity sha512-ZQpmafIGvaZMn/8iuvCFGrW3smeqkq/IIh9F1SdSx9aUl0J4Iurzd6/FhmjNO5g2ejF3rT45dKskgXWiofqlZQ==

"@volar/typescript@2.4.11":
  version "2.4.11"
  resolved "https://npm.dev-internal.org/@volar/typescript/-/typescript-2.4.11.tgz#aafbfa413337654db211bf4d8fb6670c89f6fa57"
  integrity sha512-2DT+Tdh88Spp5PyPbqhyoYavYCPDsqbHLFwcUI9K1NlY1YgUJvujGdrqUp0zWxnW7KWNTr3xSpMuv2WnaTKDAw==
  dependencies:
    "@volar/language-core" "2.4.11"
    path-browserify "^1.0.1"
    vscode-uri "^3.0.8"

"@vscode/emmet-helper@^2.9.3":
  version "2.11.0"
  resolved "https://npm.dev-internal.org/@vscode/emmet-helper/-/emmet-helper-2.11.0.tgz#7a53e4fdb17329cc2ed88036905c78d811d231d6"
  integrity sha512-QLxjQR3imPZPQltfbWRnHU6JecWTF1QSWhx3GAKQpslx7y3Dp6sIIXhKjiUJ/BR9FX8PVthjr9PD6pNwOJfAzw==
  dependencies:
    emmet "^2.4.3"
    jsonc-parser "^2.3.0"
    vscode-languageserver-textdocument "^1.0.1"
    vscode-languageserver-types "^3.15.1"
    vscode-uri "^3.0.8"

"@vscode/l10n@^0.0.18":
  version "0.0.18"
  resolved "https://npm.dev-internal.org/@vscode/l10n/-/l10n-0.0.18.tgz#916d3a5e960dbab47c1c56f58a7cb5087b135c95"
  integrity sha512-KYSIHVmslkaCDyw013pphY+d7x1qV8IZupYfeIfzNA+nsaWHbn5uPuQRvdRFsa9zFzGeudPuoGoZ1Op4jrJXIQ==

acorn-jsx@^5.0.0:
  version "5.3.2"
  resolved "https://npm.dev-internal.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz#7ed5bb55908b3b2f1bc55c6af1653bada7f07937"
  integrity sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==

acorn@^8.0.0, acorn@^8.14.0:
  version "8.14.0"
  resolved "https://npm.dev-internal.org/acorn/-/acorn-8.14.0.tgz#063e2c70cac5fb4f6467f0b11152e04c682795b0"
  integrity sha512-cl669nCJTZBsL97OF4kUQm5g5hC2uihk0NxY3WENAC0TYdILVkAyHymAntgxGkl7K+t0cXIrH5siy5S4XkFycA==

acorn@^8.14.1:
  version "8.14.1"
  resolved "https://registry.npmjs.org/acorn/-/acorn-8.14.1.tgz#721d5dc10f7d5b5609a891773d47731796935dfb"
  integrity sha512-OvQ/2pUDKmgfCg++xsTX1wGxfTaszcHVcTctW4UJB4hibJx2HXxxO5UmVgyjMa+ZDsiaf5wWLXYpRWMmBI0QHg==

ajv@^8.11.0:
  version "8.17.1"
  resolved "https://npm.dev-internal.org/ajv/-/ajv-8.17.1.tgz#37d9a5c776af6bc92d7f4f9510eba4c0a60d11a6"
  integrity sha512-B/gBuNg5SiMTrPkC+A2+cW0RszwxYmn6VYxB/inlBStS5nx6xHIt/ehKRhIMhqusl7a8LjQoZnjCs5vhwxOQ1g==
  dependencies:
    fast-deep-equal "^3.1.3"
    fast-uri "^3.0.1"
    json-schema-traverse "^1.0.0"
    require-from-string "^2.0.2"

ansi-align@^3.0.1:
  version "3.0.1"
  resolved "https://npm.dev-internal.org/ansi-align/-/ansi-align-3.0.1.tgz#0cdf12e111ace773a86e9a1fad1225c43cb19a59"
  integrity sha512-IOfwwBF5iczOjp/WeY4YxyjqAFMQoZufdQWDd19SEExbVLNXqvpzSJ/M7Za4/sCPmQ0+GRquoA7bGcINcxew6w==
  dependencies:
    string-width "^4.1.0"

ansi-regex@^5.0.1:
  version "5.0.1"
  resolved "https://npm.dev-internal.org/ansi-regex/-/ansi-regex-5.0.1.tgz#082cb2c89c9fe8659a311a53bd6a4dc5301db304"
  integrity sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==

ansi-regex@^6.0.1:
  version "6.1.0"
  resolved "https://npm.dev-internal.org/ansi-regex/-/ansi-regex-6.1.0.tgz#95ec409c69619d6cb1b8b34f14b660ef28ebd654"
  integrity sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==

ansi-styles@^4.0.0:
  version "4.3.0"
  resolved "https://npm.dev-internal.org/ansi-styles/-/ansi-styles-4.3.0.tgz#edd803628ae71c04c85ae7a0906edad34b648937"
  integrity sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==
  dependencies:
    color-convert "^2.0.1"

ansi-styles@^6.2.1:
  version "6.2.1"
  resolved "https://npm.dev-internal.org/ansi-styles/-/ansi-styles-6.2.1.tgz#0e62320cf99c21afff3b3012192546aacbfb05c5"
  integrity sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==

arg@^5.0.0:
  version "5.0.2"
  resolved "https://npm.dev-internal.org/arg/-/arg-5.0.2.tgz#c81433cc427c92c4dcf4865142dbca6f15acd59c"
  integrity sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==

argparse@^1.0.7:
  version "1.0.10"
  resolved "https://npm.dev-internal.org/argparse/-/argparse-1.0.10.tgz#bcd6791ea5ae09725e17e5ad988134cd40b3d911"
  integrity sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==
  dependencies:
    sprintf-js "~1.0.2"

argparse@^2.0.1:
  version "2.0.1"
  resolved "https://npm.dev-internal.org/argparse/-/argparse-2.0.1.tgz#246f50f3ca78a3240f6c997e8a9bd1eac49e4b38"
  integrity sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==

aria-query@^5.3.2:
  version "5.3.2"
  resolved "https://npm.dev-internal.org/aria-query/-/aria-query-5.3.2.tgz#93f81a43480e33a338f19163a3d10a50c01dcd59"
  integrity sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==

array-iterate@^2.0.0:
  version "2.0.1"
  resolved "https://npm.dev-internal.org/array-iterate/-/array-iterate-2.0.1.tgz#6efd43f8295b3fee06251d3d62ead4bd9805dd24"
  integrity sha512-I1jXZMjAgCMmxT4qxXfPXa6SthSoE8h6gkSI9BGGNv8mP8G/v0blc+qFnZu6K42vTOiuME596QaLO0TP3Lk0xg==

array-timsort@^1.0.3:
  version "1.0.3"
  resolved "https://npm.dev-internal.org/array-timsort/-/array-timsort-1.0.3.tgz#3c9e4199e54fb2b9c3fe5976396a21614ef0d926"
  integrity sha512-/+3GRL7dDAGEfM6TseQk/U+mi18TU2Ms9I3UlLdUMhz2hbvGNTKdj9xniwXfUqgYhHxRx0+8UnKkvlNwVU+cWQ==

astring@^1.8.0:
  version "1.9.0"
  resolved "https://npm.dev-internal.org/astring/-/astring-1.9.0.tgz#cc73e6062a7eb03e7d19c22d8b0b3451fd9bfeef"
  integrity sha512-LElXdjswlqjWrPpJFg1Fx4wpkOCxj1TDHlSV4PlaRxHGWko024xICaa97ZkMfs6DRKlCguiAI+rbXv5GWwXIkg==

astro-expressive-code@^0.38.3:
  version "0.38.3"
  resolved "https://npm.dev-internal.org/astro-expressive-code/-/astro-expressive-code-0.38.3.tgz#121d852aeeea70699c802ae42bcfa9940d427f2c"
  integrity sha512-Tvdc7RV0G92BbtyEOsfJtXU35w41CkM94fOAzxbQP67Wj5jArfserJ321FO4XA7WG9QMV0GIBmQq77NBIRDzpQ==
  dependencies:
    rehype-expressive-code "^0.38.3"

astro@4.16.18:
  version "4.16.18"
  resolved "https://npm.dev-internal.org/astro/-/astro-4.16.18.tgz#c7db47d5554d865543d6917f42b5129819c6bc88"
  integrity sha512-G7zfwJt9BDHEZwlaLNvjbInIw2hPryyD654314KV/XT34pJU6SfN1S+mWa8RAkALcZNJnJXCJmT3JXLQStD3Lw==
  dependencies:
    "@astrojs/compiler" "^2.10.3"
    "@astrojs/internal-helpers" "0.4.1"
    "@astrojs/markdown-remark" "5.3.0"
    "@astrojs/telemetry" "3.1.0"
    "@babel/core" "^7.26.0"
    "@babel/plugin-transform-react-jsx" "^7.25.9"
    "@babel/types" "^7.26.0"
    "@oslojs/encoding" "^1.1.0"
    "@rollup/pluginutils" "^5.1.3"
    "@types/babel__core" "^7.20.5"
    "@types/cookie" "^0.6.0"
    acorn "^8.14.0"
    aria-query "^5.3.2"
    axobject-query "^4.1.0"
    boxen "8.0.1"
    ci-info "^4.1.0"
    clsx "^2.1.1"
    common-ancestor-path "^1.0.1"
    cookie "^0.7.2"
    cssesc "^3.0.0"
    debug "^4.3.7"
    deterministic-object-hash "^2.0.2"
    devalue "^5.1.1"
    diff "^5.2.0"
    dlv "^1.1.3"
    dset "^3.1.4"
    es-module-lexer "^1.5.4"
    esbuild "^0.21.5"
    estree-walker "^3.0.3"
    fast-glob "^3.3.2"
    flattie "^1.1.1"
    github-slugger "^2.0.0"
    gray-matter "^4.0.3"
    html-escaper "^3.0.3"
    http-cache-semantics "^4.1.1"
    js-yaml "^4.1.0"
    kleur "^4.1.5"
    magic-string "^0.30.14"
    magicast "^0.3.5"
    micromatch "^4.0.8"
    mrmime "^2.0.0"
    neotraverse "^0.6.18"
    ora "^8.1.1"
    p-limit "^6.1.0"
    p-queue "^8.0.1"
    preferred-pm "^4.0.0"
    prompts "^2.4.2"
    rehype "^13.0.2"
    semver "^7.6.3"
    shiki "^1.23.1"
    tinyexec "^0.3.1"
    tsconfck "^3.1.4"
    unist-util-visit "^5.0.0"
    vfile "^6.0.3"
    vite "^5.4.11"
    vitefu "^1.0.4"
    which-pm "^3.0.0"
    xxhash-wasm "^1.1.0"
    yargs-parser "^21.1.1"
    zod "^3.23.8"
    zod-to-json-schema "^3.23.5"
    zod-to-ts "^1.2.0"
  optionalDependencies:
    sharp "^0.33.3"

axobject-query@^4.1.0:
  version "4.1.0"
  resolved "https://npm.dev-internal.org/axobject-query/-/axobject-query-4.1.0.tgz#28768c76d0e3cff21bc62a9e2d0b6ac30042a1ee"
  integrity sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==

b4a@^1.6.4:
  version "1.6.7"
  resolved "https://npm.dev-internal.org/b4a/-/b4a-1.6.7.tgz#a99587d4ebbfbd5a6e3b21bdb5d5fa385767abe4"
  integrity sha512-OnAYlL5b7LEkALw87fUVafQw5rVR9RjwGd4KUwNQ6DrrNmaVaUCgLipfVlzrPQ4tWOR9P0IXGNOx50jYCCdSJg==

bail@^2.0.0:
  version "2.0.2"
  resolved "https://npm.dev-internal.org/bail/-/bail-2.0.2.tgz#d26f5cd8fe5d6f832a31517b9f7c356040ba6d5d"
  integrity sha512-0xO6mYd7JB2YesxDKplafRpsiOzPt9V02ddPCLbY1xYGPOX24NTyN50qnUxgCPcSoYMhKpAuBTjQoRZCAkUDRw==

bare-events@^2.0.0, bare-events@^2.2.0:
  version "2.5.0"
  resolved "https://npm.dev-internal.org/bare-events/-/bare-events-2.5.0.tgz#305b511e262ffd8b9d5616b056464f8e1b3329cc"
  integrity sha512-/E8dDe9dsbLyh2qrZ64PEPadOQ0F4gbl1sUJOrmph7xOiIxfY8vwab/4bFLh4Y88/Hk/ujKcrQKc+ps0mv873A==

bare-fs@^2.1.1:
  version "2.3.5"
  resolved "https://npm.dev-internal.org/bare-fs/-/bare-fs-2.3.5.tgz#05daa8e8206aeb46d13c2fe25a2cd3797b0d284a"
  integrity sha512-SlE9eTxifPDJrT6YgemQ1WGFleevzwY+XAP1Xqgl56HtcrisC2CHCZ2tq6dBpcH2TnNxwUEUGhweo+lrQtYuiw==
  dependencies:
    bare-events "^2.0.0"
    bare-path "^2.0.0"
    bare-stream "^2.0.0"

bare-os@^2.1.0:
  version "2.4.4"
  resolved "https://npm.dev-internal.org/bare-os/-/bare-os-2.4.4.tgz#01243392eb0a6e947177bb7c8a45123d45c9b1a9"
  integrity sha512-z3UiI2yi1mK0sXeRdc4O1Kk8aOa/e+FNWZcTiPB/dfTWyLypuE99LibgRaQki914Jq//yAWylcAt+mknKdixRQ==

bare-path@^2.0.0, bare-path@^2.1.0:
  version "2.1.3"
  resolved "https://npm.dev-internal.org/bare-path/-/bare-path-2.1.3.tgz#594104c829ef660e43b5589ec8daef7df6cedb3e"
  integrity sha512-lh/eITfU8hrj9Ru5quUp0Io1kJWIk1bTjzo7JH1P5dWmQ2EL4hFUlfI8FonAhSlgIfhn63p84CDY/x+PisgcXA==
  dependencies:
    bare-os "^2.1.0"

bare-stream@^2.0.0:
  version "2.6.1"
  resolved "https://npm.dev-internal.org/bare-stream/-/bare-stream-2.6.1.tgz#b3b9874fab05b662c9aea2706a12fb0698c46836"
  integrity sha512-eVZbtKM+4uehzrsj49KtCy3Pbg7kO1pJ3SKZ1SFrIH/0pnj9scuGGgUlNDf/7qS8WKtGdiJY5Kyhs/ivYPTB/g==
  dependencies:
    streamx "^2.21.0"

base-64@^1.0.0:
  version "1.0.0"
  resolved "https://npm.dev-internal.org/base-64/-/base-64-1.0.0.tgz#09d0f2084e32a3fd08c2475b973788eee6ae8f4a"
  integrity sha512-kwDPIFCGx0NZHog36dj+tHiwP4QMzsZ3AgMViUBKI0+V5n4U0ufTCUMhnQ04diaRI8EX/QcPfql7zlhZ7j4zgg==

base64-js@^1.3.1:
  version "1.5.1"
  resolved "https://npm.dev-internal.org/base64-js/-/base64-js-1.5.1.tgz#1b1b440160a5bf7ad40b650f095963481903930a"
  integrity sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==

bcp-47-match@^2.0.0:
  version "2.0.3"
  resolved "https://npm.dev-internal.org/bcp-47-match/-/bcp-47-match-2.0.3.tgz#603226f6e5d3914a581408be33b28a53144b09d0"
  integrity sha512-JtTezzbAibu8G0R9op9zb3vcWZd9JF6M0xOYGPn0fNCd7wOpRB1mU2mH9T8gaBGbAAyIIVgB2G7xG0GP98zMAQ==

bcp-47@^2.1.0:
  version "2.1.0"
  resolved "https://npm.dev-internal.org/bcp-47/-/bcp-47-2.1.0.tgz#7e80734c3338fe8320894981dccf4968c3092df6"
  integrity sha512-9IIS3UPrvIa1Ej+lVDdDwO7zLehjqsaByECw0bu2RRGP73jALm6FYbzI5gWbgHLvNdkvfXB5YrSbocZdOS0c0w==
  dependencies:
    is-alphabetical "^2.0.0"
    is-alphanumerical "^2.0.0"
    is-decimal "^2.0.0"

bl@^4.0.3:
  version "4.1.0"
  resolved "https://npm.dev-internal.org/bl/-/bl-4.1.0.tgz#451535264182bec2fbbc83a62ab98cf11d9f7b3a"
  integrity sha512-1W07cM9gS6DcLperZfFSj+bWLtaPGSOHWhPiGzXmvVJbRLdG82sH/Kn8EtW1VqWVA54AKf2h5k5BbnIbwF3h6w==
  dependencies:
    buffer "^5.5.0"
    inherits "^2.0.4"
    readable-stream "^3.4.0"

boolbase@^1.0.0:
  version "1.0.0"
  resolved "https://npm.dev-internal.org/boolbase/-/boolbase-1.0.0.tgz#68dff5fbe60c51eb37725ea9e3ed310dcc1e776e"
  integrity sha512-JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==

boxen@8.0.1:
  version "8.0.1"
  resolved "https://npm.dev-internal.org/boxen/-/boxen-8.0.1.tgz#7e9fcbb45e11a2d7e6daa8fdcebfc3242fc19fe3"
  integrity sha512-F3PH5k5juxom4xktynS7MoFY+NUWH5LC4CnH11YB8NPew+HLpmBLCybSAEyb2F+4pRXhuhWqFesoQd6DAyc2hw==
  dependencies:
    ansi-align "^3.0.1"
    camelcase "^8.0.0"
    chalk "^5.3.0"
    cli-boxes "^3.0.0"
    string-width "^7.2.0"
    type-fest "^4.21.0"
    widest-line "^5.0.0"
    wrap-ansi "^9.0.0"

braces@^3.0.3:
  version "3.0.3"
  resolved "https://npm.dev-internal.org/braces/-/braces-3.0.3.tgz#490332f40919452272d55a8480adc0c441358789"
  integrity sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==
  dependencies:
    fill-range "^7.1.1"

browserslist@^4.24.0:
  version "4.24.3"
  resolved "https://npm.dev-internal.org/browserslist/-/browserslist-4.24.3.tgz#5fc2725ca8fb3c1432e13dac278c7cc103e026d2"
  integrity sha512-1CPmv8iobE2fyRMV97dAcMVegvvWKxmq94hkLiAkUGwKVTyDLw33K+ZxiFrREKmmps4rIw6grcCFCnTMSZ/YiA==
  dependencies:
    caniuse-lite "^1.0.30001688"
    electron-to-chromium "^1.5.73"
    node-releases "^2.0.19"
    update-browserslist-db "^1.1.1"

buffer@^5.5.0:
  version "5.7.1"
  resolved "https://npm.dev-internal.org/buffer/-/buffer-5.7.1.tgz#ba62e7c13133053582197160851a8f648e99eed0"
  integrity sha512-EHcyIPBQ4BSGlvjB16k5KgAJ27CIsHY/2JBmCRReo48y9rQ3MaUzWX3KVlBa4U7MyX02HdVj0K7C3WaB3ju7FQ==
  dependencies:
    base64-js "^1.3.1"
    ieee754 "^1.1.13"

callsites@^3.0.0, callsites@^3.1.0:
  version "3.1.0"
  resolved "https://npm.dev-internal.org/callsites/-/callsites-3.1.0.tgz#b3630abd8943432f54b3f0519238e33cd7df2f73"
  integrity sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==

camelcase@^8.0.0:
  version "8.0.0"
  resolved "https://npm.dev-internal.org/camelcase/-/camelcase-8.0.0.tgz#c0d36d418753fb6ad9c5e0437579745c1c14a534"
  integrity sha512-8WB3Jcas3swSvjIeA2yvCJ+Miyz5l1ZmB6HFb9R1317dt9LCQoswg/BGrmAmkWVEszSrrg4RwmO46qIm2OEnSA==

caniuse-lite@^1.0.30001688:
  version "1.0.30001689"
  resolved "https://npm.dev-internal.org/caniuse-lite/-/caniuse-lite-1.0.30001689.tgz#67ca960dd5f443903e19949aeacc9d28f6e10910"
  integrity sha512-CmeR2VBycfa+5/jOfnp/NpWPGd06nf1XYiefUvhXFfZE4GkRc9jv+eGPS4nT558WS/8lYCzV8SlANCIPvbWP1g==

ccount@^2.0.0:
  version "2.0.1"
  resolved "https://npm.dev-internal.org/ccount/-/ccount-2.0.1.tgz#17a3bf82302e0870d6da43a01311a8bc02a3ecf5"
  integrity sha512-eyrF0jiFpY+3drT6383f1qhkbGsLSifNAjA61IUjZjmLCWjItY6LB9ft9YhoDgwfmclB2zhu51Lc7+95b8NRAg==

chalk-template@^1.1.0:
  version "1.1.0"
  resolved "https://npm.dev-internal.org/chalk-template/-/chalk-template-1.1.0.tgz#ffc55db6dd745e9394b85327c8ac8466edb7a7b1"
  integrity sha512-T2VJbcDuZQ0Tb2EWwSotMPJjgpy1/tGee1BTpUNsGZ/qgNjV2t7Mvu+d4600U564nbLesN1x2dPL+xii174Ekg==
  dependencies:
    chalk "^5.2.0"

chalk@^5.2.0, chalk@^5.3.0:
  version "5.4.0"
  resolved "https://npm.dev-internal.org/chalk/-/chalk-5.4.0.tgz#846fdb5d5d939d6fa3d565cd5545697b6f8b6923"
  integrity sha512-ZkD35Mx92acjB2yNJgziGqT9oKHEOxjTBTDRpOsRWtdecL/0jM3z5kM/CTzHWvHIen1GvkM85p6TuFfDGfc8/Q==

character-entities-html4@^2.0.0:
  version "2.1.0"
  resolved "https://npm.dev-internal.org/character-entities-html4/-/character-entities-html4-2.1.0.tgz#1f1adb940c971a4b22ba39ddca6b618dc6e56b2b"
  integrity sha512-1v7fgQRj6hnSwFpq1Eu0ynr/CDEw0rXo2B61qXrLNdHZmPKgb7fqS1a2JwF0rISo9q77jDI8VMEHoApn8qDoZA==

character-entities-legacy@^3.0.0:
  version "3.0.0"
  resolved "https://npm.dev-internal.org/character-entities-legacy/-/character-entities-legacy-3.0.0.tgz#76bc83a90738901d7bc223a9e93759fdd560125b"
  integrity sha512-RpPp0asT/6ufRm//AJVwpViZbGM/MkjQFxJccQRHmISF/22NBtsHqAWmL+/pmkPWoIUJdWyeVleTl1wydHATVQ==

character-entities@^2.0.0:
  version "2.0.2"
  resolved "https://npm.dev-internal.org/character-entities/-/character-entities-2.0.2.tgz#2d09c2e72cd9523076ccb21157dff66ad43fcc22"
  integrity sha512-shx7oQ0Awen/BRIdkjkvz54PnEEI/EjwXDSIZp86/KKdbafHh1Df/RYGBhn4hbe2+uKC9FnT5UCEdyPz3ai9hQ==

character-reference-invalid@^2.0.0:
  version "2.0.1"
  resolved "https://npm.dev-internal.org/character-reference-invalid/-/character-reference-invalid-2.0.1.tgz#85c66b041e43b47210faf401278abf808ac45cb9"
  integrity sha512-iBZ4F4wRbyORVsu0jPV7gXkOsGYjGHPmAyv+HiHG8gi5PtC9KI2j1+v8/tlibRvjoWX027ypmG/n0HtO5t7unw==

chokidar@^4.0.1:
  version "4.0.2"
  resolved "https://npm.dev-internal.org/chokidar/-/chokid

[Content truncated due to size limit]


================================================
FILE: spell/cspell-fift-words-adjusted.txt
URL: https://github.com/tact-lang/tact/blob/main/spell/cspell-fift-words-adjusted.txt
================================================
'exit-interpret
'nop
-roll
-rot
-trailing
-trailing0
0X
0x
2constant
2drop
2dup
2over
2swap
atend
Base
Base
Bcmp
Bhash
BhashB
Bhashu
Blen
Bx
Digit
Fift
Fift-wordlist
Len
Li
Lu
Pos
Split
abort
abs
addop
allot
and
anon
atom
base
base
base64
base64url
bbitrefs
bbits
binary
bl
boc
box
brefs
brembitrefs
brembits
bremrefs
bt
bye
caddr
cadr
call
car
cc
cddr
cdr
char
chr
cmod
cmp
compile
cond
cons
constant
cont
context
count
cr
crc16
crc32
crc32c
create
csr
current
decimal
def
definitions
depth
dict
dictdiff
dictforeach
dictforeachfromx
dictforeachrev
dictmap
dictmapext
dictmerge
dictnew
digit
does
drop
dump
dup
ed25519_chksign
ed25519_sign
ed25519_sign_uint
emit
empty
eq
eqv
exch
exch2
execute
explode
false
file
file-exists
filepart
find
first
fits
forget
gas2runvm
gas2runvmcode
gas2runvmctx
gas2runvmctxact
gas2runvmdict
gasrunvm
gasrunvmcode
gasrunvmctx
gasrunvmctxact
gasrunvmctxactq
gasrunvmdict
getenv
halt
hash
hashB
hashu
hex
hex-number
hmap
hmapempty
hmapforeach
hmapnew
hmapunpack
hold
hole
idict
idictforeach
idictforeachrev
idictmapext
if
ifnot
include
include-depth
integer
interpret-prepare
ldump
len
library
library-version
list
max
min
minmax
mod
namespace
negate
newkeypair
nil
nip
nop
not
now
null
number
octal
or
over
pair
pfxdict
pick
pop
pos
procdictkeylen
priv
pub
push
quit
recursive
ref
remaining
reverse
rmod
roll
rot
runvm
runvmcode
runvmctx
runvmctxact
runvmctxactq
runvmdict
runvmx
s-fits
s-fits-with
sL
sbitrefs
sbits
scan-until-word
sdict
second
seekeof
sgn
shash
sign
single
skip-ifdef
skip-to-eof
skipspc
sl
smca
space
spec
sr
srefs
string
swap
tab
tc
ten
third
times
totalcsize
totalssize
tpop
triple
true
tuck
tuple
tuple-len
type
udict
ufits
uncons
undef
unpair
unsingle
until
untriple
untuple
variable
vmcont
vmlibs
vmopdump
vmoplen
while
word
word-prefix-find
words
xchg
xor



================================================
FILE: spell/cspell-list.txt
URL: https://github.com/tact-lang/tact/blob/main/spell/cspell-list.txt
================================================
Aksakov
Aliaksandr
alnum
Ashimine
assgn
astrojs
augmentedassign
babecafe
backdoor
backdoors
Bahdanau
basechain
bitcode
bitstring
bitstrings
blockstore
bocchi
bounceable
Brujin
CCITT
cheatsheet
Cheatsheet
cheatsheets
Cheatsheets
chksgn
cleanall
CNFT
codegen
compilables
Compilables
comptime
Comptime
CSBT
Daniil
Danil
decompilation
Decompilation
decompile
Decompiled
decompiler
decompiles
decompiling
dentry
Descr
dictpush
disasm
divmod
dnsresolve
Domínguez
dstr
elseifnot
Eltociear
Epva
errno
Esorat
Excno
extracurrency
flamegraph
flamegraphs
forall
formedness
frontmatter
funcfiftlib
funcid
funs
Georgiy
getsimpleforwardfee
gettest
guarantor
Gutarev
hazyone
Héctor
hehe
heisenbugs
hippity
Hoppity
idict
Ikko
Ilya
infixl
infixr
initof
injectivity
Intelli
Ints
ipfs
IPFS
ipld
Jesús
jetton
Jetton
jettons
Jettons
jojo
jsxdev
Kaladin
keccak
keypair
knip
Komarov
Korshakov
Lagus
Laika
langle
langtools
learnXinYminutes
letrec
Liskov
llm
llms
logomark
lordivash
lparen
lvalue
lvalues
Makhnev
Maksim
masterchain
Masterchain
mathrm
maxint
memecoin
Merkle
minmax
mintable
miscompilation
misparse
misparsed
mktemp
multiformats
nanoton
nanotons
Nemo
Neovim
nextra
nobounce
nocheck
noexcept
nonterminal
Nonterminal
notcoin
Novus
Nowarp
Offchain
omelander
Ovchinnikov
Parens
Petr
pgen
pinst
POSIX
postpack
prando
quadtree
quadtrees
RANDU
Reentrancy
rangle
rawslice
reentrancy
renamer
replaceget
respecifying
rparen
rugpull
rugpulled
Sánchez
sansx
Satoshi
sctx
seamus
Seamus
Sedov
seqno
seti
shardchains
shiki
Shvetc
skywardboundd
Stateinit
statinit
stdlib
stdlibs
stmts
Ston
STON.fi
Stonfi
storer
struct
structs
stry
styleguide
subfolders
subtyping
subwallet
supertypes
Tactina
tactlang
Tarjan
testdata
thetonstudio
TIMELOCK
timeouted
Timeouted
Toncoin
Toncoins
tonstudio
Topup
Tradoor
Trunov
typechecker
udict
uintptr
uints
unboc
uncons
undiscussed
uninit
Uninit
unixfs
untypable
varint
varuint
verytactical
viiii
Viltrum
vogons
Vsevolod
workchain
workchains
xffff
XMODEM
xpyctumo
xtwitter
yeehaw
привет



================================================
FILE: spell/cspell-tvm-instructions.txt
URL: https://github.com/tact-lang/tact/blob/main/spell/cspell-tvm-instructions.txt
================================================
-ROT
-ROLLX
ABS
ACCEPT
ADD
ADDCONST
ADDDIVMOD
ADDDIVMODC
ADDDIVMODR
ADDRAND
ADDRSHIFTMOD
ADDRSHIFTMODC
ADDRSHIFTMODR
AGAIN
AGAINBRK
AGAINEND
AGAINENDBRK
AND
ATEXIT
ATEXITALT
BALANCE
BBITREFS
BBITS
BCHKBITREFS
BCHKBITREFSQ
BCHKBITS
BCHKBITSQ
BCHKBITSQ_VAR
BCHKBITS_VAR
BCHKREFS
BCHKREFSQ
BDEPTH
BITSIZE
BLESS
BLESSARGS
BLESSNUMARGS
BLESSVARARGS
BLKDROP
BLKDROP2
BLKPUSH
BLKSWAP
BLKSWX
BLOCKLT
BOOLEVAL
BRANCH
BREFS
BREMBITREFS
BREMBITS
BREMREFS
CADDR
CADR
CALLCC
CALLCCARGS
CALLCCVARARGS
CALLDICT
CALLDICT_LONG
CALLREF
CALLXARGS
CALLXARGS_VAR
CALLXVARARGS
CDATASIZE
CDATASIZEQ
CDDDR
CDDR
CDEPTH
CDEPTHIX
CHANGELIB
CHASHIX
CHKBIT
CHKBOOL
CHKDEPTH
CHKNAN
CHKSIGNS
CHKSIGNU
CHKTUPLE
CLEVEL
CLEVELMASK
CMP
COMMIT
COMPOS
COMPOSALT
COMPOSBOTH
CONDSEL
CONDSELCHK
CONFIGDICT
CONFIGOPTPARAM
CONFIGPARAM
CONFIGROOT
CTOS
DEBUG
DEBUGSTR
DEC
DEPTH
DICTADD
DICTADDB
DICTADDGET
DICTADDGETB
DICTADDGETREF
DICTADDREF
DICTDEL
DICTDELGET
DICTDELGETREF
DICTEMPTY
DICTGET
DICTGETNEXT
DICTGETNEXTEQ
DICTGETOPTREF
DICTGETPREV
DICTGETPREVEQ
DICTGETREF
DICTIADD
DICTIADDB
DICTIADDGET
DICTIADDGETB
DICTIADDGETREF
DICTIADDREF
DICTIDEL
DICTIDELGET
DICTIDELGETREF
DICTIGET
DICTIGETEXEC
DICTIGETEXECZ
DICTIGETJMP
DICTIGETJMPZ
DICTIGETNEXT
DICTIGETNEXTEQ
DICTIGETOPTREF
DICTIGETPREV
DICTIGETPREVEQ
DICTIGETREF
DICTIMAX
DICTIMAXREF
DICTIMIN
DICTIMINREF
DICTIREMMAX
DICTIREMMAXREF
DICTIREMMIN
DICTIREMMINREF
DICTIREPLACE
DICTIREPLACEB
DICTIREPLACEGET
DICTIREPLACEGETB
DICTIREPLACEGETREF
DICTIREPLACEREF
DICTISET
DICTISETB
DICTISETGET
DICTISETGETB
DICTISETGETOPTREF
DICTISETGETREF
DICTISETREF
DICTMAX
DICTMAXREF
DICTMIN
DICTMINREF
DICTPUSHCONST
DICTREMMAX
DICTREMMAXREF
DICTREMMIN
DICTREMMINREF
DICTREPLACE
DICTREPLACEB
DICTREPLACEGET
DICTREPLACEGETB
DICTREPLACEGETREF
DICTREPLACEREF
DICTSET
DICTSETB
DICTSETGET
DICTSETGETB
DICTSETGETOPTREF
DICTSETGETREF
DICTSETREF
DICTUADD
DICTUADDB
DICTUADDGET
DICTUADDGETB
DICTUADDGETREF
DICTUADDREF
DICTUDEL
DICTUDELGET
DICTUDELGETREF
DICTUGET
DICTUGETEXEC
DICTUGETEXECZ
DICTUGETJMP
DICTUGETJMPZ
DICTUGETNEXT
DICTUGETNEXTEQ
DICTUGETOPTREF
DICTUGETPREV
DICTUGETPREVEQ
DICTUGETREF
DICTUMAX
DICTUMAXREF
DICTUMIN
DICTUMINREF
DICTUREMMAX
DICTUREMMAXREF
DICTUREMMIN
DICTUREMMINREF
DICTUREPLACE
DICTUREPLACEB
DICTUREPLACEGET
DICTUREPLACEGETB
DICTUREPLACEGETREF
DICTUREPLACEREF
DICTUSET
DICTUSETB
DICTUSETGET
DICTUSETGETB
DICTUSETGETOPTREF
DICTUSETGETREF
DICTUSETREF
DIV
DIVC
DIVMOD
DIVMODC
DIVMODR
DIVR
DIV_BASE
DROP
DROP2
DROPX
DUEPAYMENT
DUMP
DUMPSTK
DUP
DUP2
ECRECOVER
ENDC
ENDS
ENDXC
EQINT
EQUAL
EXECUTE
EXPLODE
EXPLODEVAR
FIRST
FIRSTQ
FITS
FITSX
GASCONSUMED
GEQ
GETFORWARDFEE
GETFORWARDFEESIMPLE
GETGASFEE
GETGASFEESIMPLE
GETGLOB
GETGLOBVAR
GETORIGINALFWDFEE
GETPARAM
GETPRECOMPILEDGAS
GETSTORAGEFEE
GLOBALID
GLOBALID
GREATER
GTINT
HASHCU
HASHEXT
HASHEXTAR_BLAKE
HASHEXTAR_BLAKE2B
HASHEXTAR_KECCAK
HASHEXTAR_KECCAK256
HASHEXTAR_KECCAK512
HASHEXTAR_SHA
HASHEXTAR_SHA256
HASHEXTAR_SHA512
HASHEXTA_BLAKE
HASHEXTA_BLAKE2B
HASHEXTA_KECCAK
HASHEXTA_KECCAK256
HASHEXTA_KECCAK512
HASHEXTA_SHA256
HASHEXTA_SHA512
HASHEXTR_BLAKE2B
HASHEXTR_KECCAK256
HASHEXTR_KECCAK512
HASHEXTR_SHA256
HASHEXTR_SHA512
HASHEXT_BLAKE2B
HASHEXT_KECCAK256
HASHEXT_KECCAK512
HASHEXT_SHA256
HASHEXT_SHA512
HASHSU
IF
IFBITJMP
IFBITJMPREF
IFELSE
IFELSEREF
IFJMP
IFJMPREF
IFNBITJMP
IFNBITJMPREF
IFNOT
IFNOTJMP
IFNOTJMPREF
IFNOTREF
IFNOTRET
IFNOTRETALT
IFREF
IFREFELSE
IFREFELSEREF
IFRET
IFRETALT
INC
INCOMINGVALUE
INDEX
INDEX2
INDEX3
INDEXQ
INDEXVAR
INDEXVARQ
INVERT
ISNAN
ISNEG
ISNNEG
ISNPOS
ISNULL
ISPOS
ISTUPLE
ISZERO
JMPDICT
JMPREF
JMPREFDATA
JMPX
JMPXARGS
JMPXDATA
JMPXVARARGS
KECCAK
LAST
LDDICT
LDDICTQ
LDDICTS
LDGRAMS
LDI
LDILE4
LDILE4Q
LDILE8
LDILE8Q
LDIQ
LDIX
LDIXQ
LDI_ALT
LDMSGADDR
LDMSGADDRQ
LDONES
LDOPTREF
LDREF
LDREFRTOS
LDSAME
LDSLICE
LDSLICEQ
LDSLICEX
LDSLICEXQ
LDSLICE_ALT
LDU
LDULE4
LDULE4Q
LDULE8
LDULE8Q
LDUQ
LDUX
LDUXQ
LDU_ALT
LDVARINT
LDVARINT16
LDVARUINT
LDZEROES
LEQ
LESS
LESSINT
LSHIFT
LSHIFTADDDIVMOD
LSHIFTADDDIVMODC
LSHIFTADDDIVMODR
LSHIFTDIV
LSHIFTDIVC
LSHIFTDIVC_VAR
LSHIFTDIVR
LSHIFTDIVR_VAR
LSHIFTDIV_VAR
LSHIFT_VAR
LTIME
MAX
MIN
MINMAX
MOD
MODPOW2
MUL
MULADDDIVMOD
MULADDDIVMODC
MULADDDIVMODR
MULADDRSHIFTCMOD
MULADDRSHIFTMOD
MULADDRSHIFTRMOD
MULCONST
MULDIV
MULDIVC
MULDIVMOD
MULDIVR
MULRSHIFT
MULRSHIFTC
MULRSHIFTC_VAR
MULRSHIFTR
MULRSHIFTR_VAR
MULRSHIFT_VAR
MYADDR
MYCODE
NEGATE
NEQ
NEQINT
NEWC
NEWDICT
NIL
NIP
NOP
NOT
NOW
NULL
NULLROTRIF
NULLROTRIF2
NULLROTRIFNOT
NULLROTRIFNOT2
NULLSWAPIF
NULLSWAPIF2
NULLSWAPIFNOT
NULLSWAPIFNOT2
ONE
ONLYTOPX
ONLYX
OR
OVER
OVER2
P256_CHKSIGNS
P256_CHKSIGNU
PAIR
PARSEMSGADDR
PARSEMSGADDRQ
PFXDICTADD
PFXDICTCONSTGETJMP
PFXDICTDEL
PFXDICTGET
PFXDICTGETEXEC
PFXDICTGETJMP
PFXDICTGETQ
PFXDICTREPLACE
PFXDICTSET
PICK
PLDDICT
PLDDICTQ
PLDDICTS
PLDI
PLDILE4
PLDILE4Q
PLDILE8
PLDILE8Q
PLDIQ
PLDIX
PLDIXQ
PLDOPTREF
PLDREF
PLDREFIDX
PLDREFVAR
PLDSLICE
PLDSLICEQ
PLDSLICEX
PLDSLICEXQ
PLDU
PLDULE
PLDULE4
PLDULE4Q
PLDULE8
PLDULE8Q
PLDUQ
PLDUX
PLDUXQ
PLDUZ
POP
POPCTR
POPCTRX
POPROOT
POPSAVE
POP_LONG
POW2
PREPAREDICT
PREVBLOCKSINFOTUPLE
PREVKEYBLOCK
PREVMCBLOCKS
PU2XC
PUSH
PUSH2
PUSH3
PUSHCONT
PUSHCONT_SHORT
PUSHCTR
PUSHCTRX
PUSHINT
PUSHINT_16
PUSHINT_4
PUSHINT_8
PUSHINT_LONG
PUSHNAN
PUSHNEGPOW2
PUSHPOW2
PUSHPOW2DEC
PUSHREF
PUSHREFCONT
PUSHREFSLICE
PUSHROOT
PUSHSLICE
PUSHSLICE_LONG
PUSHSLICE_REFS
PUSH_LONG
PUXC
PUXC2
PUXCPU
QADD
QAND
QDEC
QDIV
QDIVC
QDIVMOD
QDIVMODC
QDIVMODR
QDIVR
QFITS
QFITSX
QINC
QLSHIFT
QMOD
QMUL
QMULDIVMOD
QMULDIVR
QNEGATE
QNOT
QOR
QPOW2
QRSHIFT
QSUB
QSUBR
QTLEN
QUFITS
QUFITSX
QXOR
RAND
RANDSEED
RANDU
RANDU256
RAWRESERVE
RAWRESERVEX
REPEAT
REPEATBRK
REPEATEND
REPEATENDBRK
RET
RETALT
RETARGS
RETDATA
RETURNARGS
RETURNVARARGS
RETVARARGS
REVERSE
REVX
REWRITESTDADDR
REWRITESTDADDRQ
REWRITEVARADDR
REWRITEVARADDRQ
RIST255_ADD
RIST255_FROMHASH
RIST255_MUL
RIST255_MULBASE
RIST255_PUSHL
RIST255_QADD
RIST255_QMUL
RIST255_QMULBASE
RIST255_QSUB
RIST255_QVALIDATE
RIST255_SUB
RIST255_VALIDATE
ROLL
ROLLREV
ROLLX
ROT
ROT2
ROTREV
RSHIFT
RSHIFTC
RSHIFTC_VAR
RSHIFTR
RSHIFTR_VAR
RSHIFT_VAR
RUNVM
RUNVMX
SAMEALT
SAMEALTSAVE
SAVE
SAVEALT
SAVEBOTH
SBITREFS
SBITS
SCHKBITREFS
SCHKBITREFSQ
SCHKBITS
SCHKBITSQ
SCHKREFS
SCHKREFSQ
SCUTFIRST
SCUTLAST
SDATASIZE
SDATASIZEQ
SDBEGINS
SDBEGINSQ
SDBEGINSX
SDBEGINSXQ
SDCNTLEAD0
SDCNTLEAD1
SDCNTTRAIL0
SDCNTTRAIL1
SDCUTFIRST
SDCUTLAST
SDEMPTY
SDEPTH
SDEQ
SDFIRST
SDLEXCMP
SDPFX
SDPFXREV
SDPPFX
SDPPFXREV
SDPSFX
SDPSFXREV
SDSFX
SDSFXREV
SDSKIPFIRST
SDSKIPLAST
SDSUBSTR
SECOND
SECONDQ
SEMPTY
SENDMSG
SENDRAWMSG
SETALTCTR
SETCODE
SETCONTARGS
SETCONTARGS_N
SETCONTCTR
SETCONTCTRX
SETCONTVARARGS
SETCP
SETCP0
SETCPX
SETCP_SPECIAL
SETEXITALT
SETFIRST
SETFIRSTQ
SETGASLIMIT
SETGLOB
SETGLOBVAR
SETINDEX
SETINDEXQ
SETINDEXVAR
SETINDEXVARQ
SETLIBCODE
SETNUMARGS
SETNUMVARARGS
SETRAND
SETRETCTR
SETSECOND
SETSECONDQ
SETTHIRD
SETTHIRDQ
SGN
SHA256U
SINGLE
SKIPDICT
SPLIT
SPLITQ
SREFS
SREMPTY
SSKIPFIRST
SSKIPLAST
STB
STBQ
STBR
STBREF
STBREFQ
STBREFR
STBREFRQ
STBREFR_ALT
STBRQ
STDICT
STDICTS
STGRAMS
STI
STILE4
STILE8
STIQ
STIR
STIRQ
STIX
STIXQ
STIXR
STIXRQ
STI_ALT
STONE
STONES
STOPTREF
STORAGEFEES
STREF
STREF2CONST
STREFCONST
STREFQ
STREFR
STREFRQ
STREF_ALT
STSAME
STSLICE
STSLICECONST
STSLICEQ
STSLICER
STSLICERQ
STSLICE_ALT
STU
STULE
STULE4
STULE8
STUQ
STUR
STURQ
STUX
STUXQ
STUXR
STUXRQ
STU_ALT
STVARINT16
STVARINT
STVARUINT
STZERO
STZEROES
SUB
SUBDICTGET
SUBDICTIGET
SUBDICTIRPGET
SUBDICTRPGET
SUBDICTUGET
SUBDICTURPGET
SUBR
SUBSLICE
SWAP
SWAP2
TEN
THENRET
THENRETALT
THIRD
THIRDQ
THROW
THROWANY
THROWANYIF
THROWANYIFNOT
THROWARG
THROWARGANY
THROWARGANYIF
THROWARGANYIFNOT
THROWARGIF
THROWARGIFNOT
THROWIF
THROWIFNOT
THROWIFNOT_SHORT
THROWIF_SHORT
THROW_SHORT
TLEN
TPOP
TPUSH
TRIPLE
TRUE
TRY
TRYARGS
TUCK
TUPLE
TUPLEVAR
TWO
UBITSIZE
UFITS
UFITSX
UNPACKEDCONFIGTUPLE
UNPACKFIRST
UNPACKFIRSTVAR
UNPAIR
UNSINGLE
UNTIL
UNTILBRK
UNTILEND
UNTILENDBRK
UNTRIPLE
UNTUPLE
UNTUPLEVAR
WHILE
WHILEBRK
WHILEEND
WHILEENDBRK
XC2PU
XCHG
XCHG2
XCHG3
XCHG3_ALT
XCHGX
XCHG_0I
XCHG_0I_LONG
XCHG_1I
XCHG_IJ
XCPU
XCPU2
XCPUXC
XCTOS
XLOAD
XLOADQ
XOR
ZERO



================================================
FILE: src/ast/contracts/attributes.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/attributes.tact
================================================
extends mutates fun fun1(self: Int, c: Int) {
    let res: Int = 1;
    repeat (c) {
        res *= self;
    }
    self = res;
}

mutates extends fun fun2(self: Int, c: Int) {
    let res: Int = 1;
    repeat (c) {
        res *= self;
    }
    self = res;
}



================================================
FILE: src/ast/contracts/case-1.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-1.tact
================================================
struct Source {
    a: Int;
    b: Int;
    c: Int;
    d: Int;
}

fun isZero(x: Int, y: Int, z: Bool, m: Source): Bool {
    let b: Int = x + y;
    b = b + 1 + m.a + m.b;
    let c: Int = y >> 123;
    let d: Int = x << 10;
    return b > 0 && z && c == 0 && d == 0;
}

contract Empty {
    init() {}

    get fun a(x: Int, y: Int, z: Bool, m: Source): Bool {
        return isZero(x, y, z, m);
    }
}



================================================
FILE: src/ast/contracts/case-2.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-2.tact
================================================
struct Source {
    a: Int;
    b: Int;
}

fun isZero(x: Int, y: Int, z: Bool, m: Source): Bool {
    m.b = 10;
    return x + m.b > 0 && z;
}

contract Empty {
    init() {}
}


================================================
FILE: src/ast/contracts/case-3.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-3.tact
================================================
struct Source {
    a: Int;
    b: Int;
}

fun isZero(x: Int, y: Int, z: Bool, m: Source): Bool {
    m.b = 10;
    return 2 * x + m.b > 0 && z;
}

contract SampleContract {
    a: Int;
    b: Int;
    c: Source;

    init() {
        self.a = 0;
        self.b = 0;
        self.c = Source{a: 0, b: 0};
    }

    fun addStake() {
        self.a = 10;
        self.b = -20;
        self.c = Source{a: 10, b: 20};
    }

    get fun stake(): Int {
        return self.a;
    }
}


================================================
FILE: src/ast/contracts/case-4.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-4.tact
================================================
import "@stdlib/deploy";

primitive NInt;

struct Source {
    a: Int;
    b: Int;
}

@name(store_uint)
native storeUint(s: Builder, value: Int, bits: Int): Builder;

fun isZero(x: Int, y: Int, z: Bool, m: Source): Bool {
    m.b = 10;
    return x + m.b > 0 && z;
}

const a: Int = 0;
const s: String = "string";
const t: Bool = true;
const f: Bool = false;

contract SampleContract {
    a: Int;
    b: Int;
    c: Source;
    d: map<Int, Int>;

    const e: Int = 42;

    init() {
        self.a = 0;
        self.b = 0;
        self.c = Source{a: 0, b: 0};
    }

    fun addStake() {
        let d: Int? = null;
        self.a = 10;
        d = a > 0 ? self.a : 0;
        let res: Bool = isZero(1, 2, false, self.c);
        let e = 42;
        self.b = a;
        self.c = Source{a: 10, b: 20};
    }

    get fun stake(): Int {
        self.addStake();
        return self.a;
    }

    receive("increment") {
        self.a -= 1;
    }
}



================================================
FILE: src/ast/contracts/case-asm-fun.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-asm-fun.tact
================================================
asm fun keccak256(s: Slice): Int {
    1
    INT
    HASHEXT_KECCAK256
}

asm( -> 1 0) extends fun loadCoins(self: Slice): Int {
    LDVARUINT16
}

asm(c b) extends fun storeDict(b: Builder, c: Cell) {
    STDICT
}

asm(s len -> 1 0) extends fun loadInt(self: Slice, len: Int): Int {
    LDIX
}



================================================
FILE: src/ast/contracts/case-augmented-assign.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-augmented-assign.tact
================================================
contract SampleContract {
    a: Int;

    init() {
        self.a = 0;
        self.a += 2;
        self.a -= 1;
        self.a *= 2;
        self.a /= 2;
        self.a %= 5;
    }
}


================================================
FILE: src/ast/contracts/case-bin-ops.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-bin-ops.tact
================================================
contract SampleContract {
    a: Int;

    init() {
        self.a = (1 + 2 - 3) / 4 % 5 | 255 & 53 ^ 2;
        if (1 > 2 || 3 == 0 && (5 - 3) * 10 > 0) { }
    }
}



================================================
FILE: src/ast/contracts/case-block-statements.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-block-statements.tact
================================================
contract Foo {
    get fun foo(): Int {
        let x1: Int = 42;
        {
            let x: Int = 42;
            {
                x1 += x;
            }
        }
        return x1;
    }
}



================================================
FILE: src/ast/contracts/case-destructuring.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-destructuring.tact
================================================
struct S {
    a: Int;
    b: Int;
    c: Int;
}

message M {
    a: Int;
    b: Int;
}

fun testFunc(): Int {
    let s = S{a: 1, b: 2, c: 3};
    let S {a, b, c} = s;
    let S {a: a1, ..} = s;
    let S {b: b1, ..} = s;
    let S {c: c1, ..} = s;
    let S {a: a2, b: b2, ..} = s;
    let S {a: a3, c: c3, ..} = s;
    let S {b: b4, c: c4, ..} = s;
    let m = M{a: 1, b: 2};
    let M {a: a_m, b: b_m} = m;
    return a + b + c + a1 + b1 + c1 + a2 + b2 + a3 + c3 + b4 + c4 + a_m + b_m;
}


================================================
FILE: src/ast/contracts/case-if.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-if.tact
================================================
fun checkIf(x: Int, y: Int): Int {
    if (x < y) {
        return x;
    } else {
        return y;
    }
}

contract SampleContract {
    x: Int as int32;

    init() {
        if (1 > 0) {
            if (2 > 3) {
                self.x = 1;
            } else {
                self.x = 2;
            }
        } else {
            self.x = 0;
        }
    }
}


================================================
FILE: src/ast/contracts/case-initOf.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-initOf.tact
================================================
contract A {
    a: Int;
    b: Bool;

    init(a: Int, b: Bool) {
        self.a = a;
        self.b = b;
    }
}

contract B {
    init() {
        initOf A(1, false);
    }
}


================================================
FILE: src/ast/contracts/case-loops.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-loops.tact
================================================
contract SampleContract {
    x: Int;
    y: map<Int, Int>;

    init() {
        self.x = 5;
        self.y = emptyMap();
        self.y.set(1, 42);
        elf.y.set(2, 3);
        let y: map<Int, Int> = emptyMap();
        y.set(1, 42);
        y.set(2, 3);
        while (self.x > 0) {
            self.x = self.x - 1;
        }
        repeat (self.x) {
            self.x += self.x;
        }
        do {
            self.x = self.x + 1;
        } until (self.x < 10);
        foreach (k, v in y) {
            self.x += v;
        }
        foreach (k, v in self.y) {
            self.x += v;
        }
    }
}


================================================
FILE: src/ast/contracts/case-message-opcode.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-message-opcode.tact
================================================
message(0xdeadbeef) MyMessageHex {
    x: Int;
}

message(3735928559) MyMessageDec {
    x: Int;
    y: Int;
}

message(0o33653337357) MyMessageOct {
    x: Int;
    y: Int;
    z: Int;
}

message(0b11011110101011011011111011101111) MyMessageBin {
    x: Int;
    y: Int;
    z: Int;
    w: Int;
}

message MyMessageAuto {
    value: Int;
}

const DEADBEEF: Int = 0xdeadbeef;

message(DEADBEEF + 1) MyMessageWithExprOpcode {
    a: Int;
}

contract TestContract { }



================================================
FILE: src/ast/contracts/case-priority.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-priority.tact
================================================
contract Priority {
    x: Bool;
    y: Int;

    init() {
        self.x = true || true && true == 5 < 6 << 9 + 7 * 8;
        self.x = true || true && true != 5 > 6 >> 9 - 7 / 8;
        self.x = true || true && true != 5 <= 6 >> 9 - 7 % 8;
        self.x = true || true && true != 5 >= 6 >> 9 - 7 % 8;
        self.y = 1 | 2 ^ 3 & 6 >> 9 - 7 % 8;
        self.x = (true ? true : false) ? 1 : 2;
        self.x = true ? (true ? 1 : 2) : 3;
        self.x = false ? 1 : false ? 2 : 3;
        self.x = +self.x!!;
        self.x = (+self.x)!!;
    }
}



================================================
FILE: src/ast/contracts/case-receive.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-receive.tact
================================================
message MyMessage {
    value: Int;
}

contract ReceiveTestContract {
    a: Int;

    init() {
        self.a = 0;
    }

    receive() {
        self.a = 1;
    }

    receive("message") {
        self.a = 2;
    }

    receive(m: MyMessage) {
        self.a = m.value;
    }

    bounced(m: bounced<MyMessage>) {
        self.a = 3;
    }

    external() {
        self.a = 4;
        acceptMessage();
    }

    external("message") {
        self.a = 5;
        acceptMessage();
    }

    external(m: MyMessage) {
        self.a = m.value;
        acceptMessage();
    }
}


================================================
FILE: src/ast/contracts/case-traits.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-traits.tact
================================================
@interface("") trait B { }

trait C {
    abstract get fun d(e: String): String;
}

trait Ownable with B {
    owner: Address;
    value: Int;

    const someNum: Int = 2;
    abstract const something: Int;

    receive("message") { }

    fun requireOwner() {
        throwUnless(TactExitCodeAccessDenied, context().sender == self.owner);
    }

    get fun owner(): Address {
        return self.owner;
    }
}

@interface("a") contract Treasure with Ownable {
    owner: Address;
    value: Int;

    const something: Int = 2;

    init(owner: Address) {
        self.owner = owner;
        self.value = 1;
    }
}



================================================
FILE: src/ast/contracts/case-trycatch.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/case-trycatch.tact
================================================
fun braveAndTrue() {
    try {
        nativeThrow(42);
    }
    dump(42);
}

fun niceCatch() {
    try {
        nativeThrow(42);
    } catch (err) {
        dump(err);
    }
}


================================================
FILE: src/ast/contracts/getter-with-method-id-const.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/getter-with-method-id-const.tact
================================================
const FOO: Int = crc32("crc32") + 42;

contract Test {
    get(FOO) fun test(): Int {
        return FOO;
    }
}



================================================
FILE: src/ast/contracts/getter-with-method-id.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/getter-with-method-id.tact
================================================
contract Test {
    get(crc32("crc32") + 42 & 0x3ffff | 0x4000) fun test(): Int {
        return 0;
    }
}




================================================
FILE: src/ast/contracts/native-functions.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/native-functions.tact
================================================
@name(hello_world)
native helloWorld(): Int;

@name(__tact_compute_contract_address)
native contractAddressExt(chain: Int, code: Cell, data: Cell): Address;



================================================
FILE: src/ast/contracts/parameters.tact
URL: https://github.com/tact-lang/tact/blob/main/src/ast/contracts/parameters.tact
================================================
contract Params1(
    val1: Int as uint64,
    val2: String
) { }

contract Params2(
    val1: Int,
    val2: String
) { }

contract Params3() { }





================================================
FILE: src/benchmarks/escrow/func/escrow.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/escrow/func/escrow.fc
================================================
#include "params.fc";
#include "jetton-utils.fc";
#include "op-codes.fc";

;; Escrow Smart Contract with TON/Jetton payments

{-

params: guarantor_address, deal_amount, guarantor_fee_percent, asset_address, seller_address

messages:
    buyer:
        - send funds (ton/jetton)
    guarantor:
        - approve
        - cancel
    anyone:
        - top up

flow:
seller::deploy -> buyer::send_funds -> guarantor::approve/cancel -> send funds to seller + royalties or refund

-}

const op::approve = "op::approve"c;
const op::cancel = "op::cancel"c;
const op::buyer_transfer = "op::buyer_transfer"c;
const op::top_up = "op::top_up"c;
const op::change_wallet_code = "op::change_wallet_code"c;
const op::provide_escrow_data = "op::provide_escrow_data"c;

const royalties_constant = 1000; ;; for floating point royalties (up to 3 digits)
;; gas consumption constants (could be further optimized)
const int fee_per_jetton = 50000000; ;; 0.05 ton
const int send_fee = 15000000; ;; 0.015 TON

global int ctx_id; ;; for address salt
global slice seller_address;
global slice guarantor_address;
global int deal_amount;
global slice asset_address; ;; null slice to represent ton, minter jetton address otherwise
global int guarantor_royalty_percent; ;; see calculate_guarantor_royalty
global slice buyer_address; ;; initially null, set after funding
global int state; ;; 0 - init, 1 - funded
global cell jetton_wallet_code;

{-
  Storage
  storage#_ ctx_id:uint32 seller_address:MsgAddressInt guarantor_address:MsgAddressInt deal_amount:uint64 asset_address:^Cell
            guarantor_royalty_percent:uint32 buyer_address:(Maybe ^MsgAddressInt)
            state:uint2 jetton_wallet_code:(Maybe ^Cell) = Storage;

-}

() load_data() impure {
    slice ds = get_data().begin_parse();

    ctx_id = ds~load_uint(32);
    seller_address = ds~load_msg_addr();
    guarantor_address = ds~load_msg_addr();
    deal_amount = ds~load_uint(64);

    if (ds.preload_uint(2) != 0) {
        asset_address = ds~load_msg_addr();
    } else {
        ds~skip_bits(2);
        asset_address = null();
    }

    slice ds2 = ds~load_ref().begin_parse();
    guarantor_royalty_percent = ds2~load_uint(32);
    buyer_address = ds2~load_msg_addr();
    state = ds2~load_uint(2);
    jetton_wallet_code = ds2~load_maybe_ref();
}

() save_data() impure inline {
    builder b = begin_cell()
                    .store_uint(ctx_id, 32)
                    .store_slice(seller_address)
                    .store_slice(guarantor_address)
                    .store_uint(deal_amount, 64);

    if (null?(asset_address)) {
        b = b.store_uint(0, 2);
    } else {
        b = b.store_slice(asset_address);
    }

    cell b2 = begin_cell()
                    .store_uint(guarantor_royalty_percent, 32)
                    .store_slice(buyer_address)
                    .store_uint(state, 2)
                    .store_maybe_ref(jetton_wallet_code)
                .end_cell();

    set_data(b.store_ref(b2)
            .end_cell()
    );
}

int calculate_guarantor_royalty() inline {
    ;; use royalties_constant (set to 1_000) to represent
    ;; floating point percents less than 1%
    ;; e.g. 0,05% actual royalty would be 50 in state_init
    int percent = guarantor_royalty_percent;

    ;; max royalty percent is 90%
    if (percent > 90000) {
        percent = 90000;
    }

    return deal_amount / (100 * royalties_constant) * percent;
}

() send_tokens(slice recipient, int amount, int mode) impure {
    slice escrow_jetton_wallet = calculate_user_jetton_wallet_address(my_address(), asset_address, jetton_wallet_code);

    send_raw_message(begin_cell()
        .store_uint(0x18, 6)
        .store_slice(escrow_jetton_wallet) ;; recipient address
        .store_coins(fee_per_jetton)
        .store_uint(1, 107)
        .store_ref(begin_cell()
            .store_uint(op::transfer(), 32)
            .store_uint(0, 64) ;;query id
            .store_coins(amount)
            .store_slice(recipient)
            .store_slice(recipient)
            .store_uint(0, 1)
            .store_coins(0)
            .store_uint(0, 1)
            .end_cell())
        .end_cell(), mode);
}

() handle_approve_ton() impure {
    int royalty = calculate_guarantor_royalty();

    [int balance, _] = get_balance();
    throw_unless(404, balance > (deal_amount + 2 * send_fee)); ;; check balance for both fees, so we don't abort after first

    cell msg = begin_cell()
                  .store_uint(0x10, 6) ;; no bounceable messages
                  .store_slice(seller_address)
                  .store_coins(deal_amount - royalty)
                  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .end_cell();

    send_raw_message(msg, 1); ;; pays transfer fees separately

    cell royalty_msg = begin_cell()
                          .store_uint(0x10, 6) ;; no bounceable messages
                          .store_slice(guarantor_address)
                          .store_coins(0)
                          .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                       .end_cell();

    send_raw_message(royalty_msg, 128 + 32); ;; send the remaining balance of contract, destroy
}

() handle_approve_jetton() impure {
    int royalty = calculate_guarantor_royalty();

    [int balance, _] = get_balance();
    throw_unless(404, balance > (2 * fee_per_jetton));

    send_tokens(seller_address, deal_amount - royalty, 1);
    send_tokens(guarantor_address, royalty, 128 + 32);
}

() handle_cancel_ton() impure {
    ;; it's up to business logic whether guarantor should receive
    ;; royalty in case of cancelled deal, in this implementation he will not

    cell msg = begin_cell()
                    .store_uint(0x10, 6) ;; no bounceable messages
                    .store_slice(buyer_address)
                    .store_coins(0)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .end_cell();

    send_raw_message(msg, 128 + 32); ;; refund to buyer & send all remaining, destroy
}

() handle_cancel_jetton() impure {
    send_tokens(buyer_address, deal_amount, 128 + 32);
}

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
    load_data();

    int op = in_msg_body~load_uint(32);

{-
    buyer_transfer#9451eca9 = BuyerTransfer;
-}
    if (op == op::buyer_transfer) {
        throw_unless(400, state == 0);
        throw_unless(400, null?(asset_address));
        throw_unless(401, msg_value == deal_amount);

        state = 1;
        buyer_address = sender_address;
        ;; seller can be same as buyer, allow it
        save_data();

        return ();
    }

{-
  In compliance with https://github.com/ton-blockchain/TIPs/issues/74

  transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                                 sender:MsgAddress forward_payload:(Either Cell ^Cell)
                                 = InternalMsgBody;
-}

    if (op == op::transfer_notification()) {
        throw_unless(400, state == 0);
        throw_unless(400, (~ null?(asset_address)));

        in_msg_body~load_uint(64); ;; skip query id
        int jetton_amount = in_msg_body~load_coins();
        slice from_address = in_msg_body~load_msg_addr();
        ;; verify escrow jetton wallet
        throw_unless(402,
            equal_slices_bits(
                calculate_user_jetton_wallet_address(my_address(), asset_address, jetton_wallet_code),
                sender_address
            )
        );

        throw_unless(401, jetton_amount == deal_amount);

        state = 1;
        buyer_address = from_address;
        save_data();

        return ();
    }

{-
    approve#e8c15681 = Approve;
-}
    if (op == op::approve) {
        throw_unless(403, (state == 1));
        throw_unless(403, equal_slices_bits(sender_address, guarantor_address));

        ;; send funds to seller, royalties to guarantor
        if (null?(asset_address)) {
            handle_approve_ton();
        } else {
            handle_approve_jetton();
        }

        return ();
    }

{-
    cancel#cc0f2526 = Cancel;
-}
    if (op == op::cancel) {
        throw_unless(403, state == 1);
        throw_unless(403, equal_slices_bits(sender_address, guarantor_address));

        ;; refund buyer
        if (null?(asset_address)) {
            handle_cancel_ton();
        } else {
            handle_cancel_jetton();
        }

        return ();
    }

{-
    change_wallet_code#9eacde91 new_jetton_wallet_code:^Cell = ChangeWalletCode;
-}

    if (op == op::change_wallet_code) {
        throw_unless(400, state == 0 & (~ null?(asset_address)));
        throw_unless(403, equal_slices_bits(sender_address, seller_address)); ;; only seller can change wallet code

        cell new_jetton_wallet_code = in_msg_body~load_ref();
        jetton_wallet_code = new_jetton_wallet_code;
        save_data();

        return ();
    }

{-
    top_up#ae98db22 = TopUp;
-}

    if (op == op::top_up) {
        return ();
    }

    if (op == op::provide_escrow_data) {
        send_raw_message(begin_cell()
            .store_uint(0x18, 6)
            .store_slice(sender_address) ;; recipient address
            .store_coins(send_fee)
            .store_uint(1, 107)
            .store_ref(get_data())
            .end_cell(), 1);
        return ();
    }

    throw(0xffff);
}

int get_state() method_id {
    load_data();
    return state;
}

int get_guarantor_royalty() method_id {
    load_data();
    return calculate_guarantor_royalty();
}

(int, slice, slice, int, slice, int, slice, int, cell) get_escrow_data() method_id {
    load_data();

    return (
        ctx_id,
        seller_address,
        guarantor_address,
        deal_amount,
        asset_address,
        guarantor_royalty_percent,
        buyer_address,
        state,
        jetton_wallet_code
    );
}



================================================
FILE: src/benchmarks/escrow/func/jetton-utils.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/escrow/func/jetton-utils.fc
================================================
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
   return  begin_cell()
            .store_coins(balance)
            .store_slice(owner_address)
            .store_slice(jetton_master_address)
            .store_ref(jetton_wallet_code)
           .end_cell();
}

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

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}




================================================
FILE: src/benchmarks/escrow/func/op-codes.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/escrow/func/op-codes.fc
================================================
int op::transfer() asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::internal_transfer() asm "0x178d4519 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::burn() asm "0x595f07bc PUSHINT";
int op::burn_notification() asm "0x7bdd97de PUSHINT";

;; Minter
int op::mint() asm "21 PUSHINT";



================================================
FILE: src/benchmarks/escrow/func/params.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/escrow/func/params.fc
================================================
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}


================================================
FILE: src/benchmarks/escrow/tact/escrow.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/escrow/tact/escrow.tact
================================================
import "./messages";

inline fun calculateJettonWalletAddress(owner: Address, master: Address, code: Cell): Address {
    let initData = JettonWalletData { balance: 0, owner, master, code };
    return contractAddress(StateInit { code, data: initData.toCell() });
}

inline fun calculateJettonBasechainWalletAddress(owner: Address, master: Address, code: Cell): BasechainAddress {
    let initData = JettonWalletData { balance: 0, owner, master, code };
    return contractBasechainAddress(StateInit { code, data: initData.toCell() });
}

message(0x9eacde91) UpdateJettonWalletCode {
    newJettonWalletCode: Cell;
}
message TakeEscrowData {
    escrowData: EscrowData;
}

message(0x9451eca9) Funding {}
message(0xe8c15681) Approve {}
message(0xcc0f2526) Cancel {}
message(0xc33b3126) ProvideEscrowData {}

struct EscrowData {
    id: Int as uint32; // contract address salt
    sellerAddress: Address;
    guarantorAddress: Address;
    dealAmount: Int as coins;
    guarantorRoyaltyPercent: Int as uint32; // 3 decimal points, see GUARANTOR_PERCENT_CONST
    isFunded: Bool;
    assetAddress: Address?; // null for TON
    jettonWalletCode: Cell?;
    buyerAddress: Address?; // null if not funded, set after funding
}

contract Escrow(
    id: Int as uint32,
    sellerAddress: Address,
    guarantorAddress: Address,
    buyerAddress: Address?,
    dealAmount: Int as coins,
    guarantorRoyaltyPercent: Int as uint32,
    isFunded: Bool,
    assetAddress: Address?,
    jettonWalletCode: Cell?,
) {
    const GUARANTOR_PERCENT_CONST: Int = 100000;
    const GUARANTOR_PERCENT_MAX: Int = 90000;
    const JETTON_TRANSFER_GAS: Int = ton("0.05");
    const TON_TRANSFER_GAS: Int = ton("0.015");

    fun sendJettons(receiver: Address, amount: Int, mode: Int) {
        let escrowJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            self.assetAddress!!,
            self.jettonWalletCode!!,
        );
        message(MessageParameters {
            to: escrowJettonWalletAddress,
            value: self.JETTON_TRANSFER_GAS,
            body: JettonTransfer {
                queryId: 0,
                amount,
                destination: receiver,
                responseDestination: receiver,
                forwardTonAmount: ton("0.01"),
                forwardPayload: emptySlice(),
                customPayload: null,
            }.toCell(),
            mode,
        });
    }

    receive(_: Funding) {
        throwIf(400, self.isFunded);
        throwUnless(400, self.assetAddress == null);

        let ctx: Context = context();
        throwUnless(401, ctx.value == self.dealAmount);

        self.isFunded = true;
        self.buyerAddress = ctx.sender;
    }

    receive(msg: UpdateJettonWalletCode) {
        throwIf(400, self.isFunded);
        throwIf(400, self.assetAddress == null);
        throwUnless(403, self.sellerAddress == sender());

        self.jettonWalletCode = msg.newJettonWalletCode;
    }

    receive(msg: JettonNotification) {
        throwUnless(400, !self.isFunded);
        throwUnless(400, self.assetAddress != null);

        let escrowJettonWalletAddress = calculateJettonBasechainWalletAddress(
            myAddress(),
            self.assetAddress!!,
            self.jettonWalletCode!!,
        );
        let sender = parseStdAddress(sender().asSlice());

        throwUnless(74, sender.workchain == 0 && sender.address == escrowJettonWalletAddress.hash!!);

        throwUnless(401, self.dealAmount == msg.amount);

        self.isFunded = true;
        self.buyerAddress = msg.sender;
    }

    // send funds to seller and royalty to guarantor
    receive(_: Approve) {
        throwUnless(403, self.isFunded);

        let ctx: Context = context();

        throwUnless(403, self.guarantorAddress == ctx.sender);
        let percent: Int = max(self.guarantorRoyaltyPercent, self.GUARANTOR_PERCENT_MAX);
        let royaltyAmount: Int = muldivc(percent, self.dealAmount, self.GUARANTOR_PERCENT_CONST);

        if (self.assetAddress == null) {
            throwUnless(404, ctx.value > (2 * self.TON_TRANSFER_GAS));
            message(MessageParameters {
                to: self.sellerAddress,
                value: self.dealAmount - royaltyAmount,
                mode: SendPayFwdFeesSeparately,
            });
            message(MessageParameters {
                to: self.guarantorAddress,
                value: royaltyAmount,
                mode: SendRemainingBalance | SendDestroyIfZero, // send all remaining and destroy escrow
            });
        } else {
            throwUnless(404, ctx.value > (2 * self.JETTON_TRANSFER_GAS));
            self.sendJettons(self.sellerAddress, self.dealAmount - royaltyAmount, SendPayFwdFeesSeparately);
            self.sendJettons(self.guarantorAddress, royaltyAmount, SendRemainingBalance | SendDestroyIfZero);
        }
    }

    // send funds back to buyer
    receive(_: Cancel) {
        throwUnless(403, self.isFunded);
        throwUnless(403, self.guarantorAddress == sender());

        // it's up to business logic to decide if guarantor gets royalty in case of cancel
        // in this implementation we don't pay royalty in case of cancel
        if (self.assetAddress == null) {
            message(MessageParameters {
                to: self.buyerAddress!!,
                value: self.dealAmount,
                mode: SendRemainingBalance | SendDestroyIfZero, // send all remaining and destroy escrow
            });
        } else {
            self.sendJettons(self.buyerAddress!!, self.dealAmount, SendRemainingBalance | SendDestroyIfZero);
        }
    }

    // on-chain data access, could be useful to guarantor contract
    receive(_: ProvideEscrowData) {
        message(MessageParameters {
            bounce: false,
            value: 0,
            to: sender(),
            body: TakeEscrowData {
                escrowData: EscrowData {
                    id: self.id,
                    sellerAddress: self.sellerAddress,
                    guarantorAddress: self.guarantorAddress,
                    dealAmount: self.dealAmount,
                    guarantorRoyaltyPercent: self.guarantorRoyaltyPercent,
                    isFunded: self.isFunded,
                    assetAddress: self.assetAddress,
                    jettonWalletCode: self.jettonWalletCode,
                    buyerAddress: self.buyerAddress,
                },
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    get fun calculateRoyaltyAmount(): Int {
        // using integer math to avoid floating point issues
        // see https://tact-by-example.org/04-decimal-point
        let percent: Int = max(self.guarantorRoyaltyPercent, self.GUARANTOR_PERCENT_MAX);

        return muldivc(percent, self.dealAmount, self.GUARANTOR_PERCENT_CONST);
    }

    get fun walletAddress(): Address {
        return calculateJettonWalletAddress(myAddress(), self.assetAddress!!, self.jettonWalletCode!!);
    }

    get fun escrowInfo(): Escrow {
        return self;
    }
}



================================================
FILE: src/benchmarks/escrow/tact/messages.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/escrow/tact/messages.tact
================================================
struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    jettonWalletCode: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

struct MaybeAddress {
    address: Address?;
}

message(4) JettonUpdateContent {
    queryId: Int as uint64;
    content: Cell;
}

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x178d4519) JettonTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x7362d09c) JettonNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    customPayload: Cell?;
}

message(0x7bdd97de) JettonBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address;
}

message(0xd53276db) JettonExcesses {
    queryId: Int as uint64;
}

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}

message(0xd1735400) TakeWalletAddress {
    queryId: Int as uint64;
    walletAddress: Address;
    ownerAddress: Cell?; //It is Maybe ^Address, just encoded it like this
}

message(21) Mint {
    queryId: Int as uint64;
    receiver: Address;
    tonAmount: Int as coins;
    mintMessage: JettonTransferInternal;
}

message(3) ChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}

// notcoin
message(0xd372158c) TopUp {
    queryId: Int as uint64;
}

message(0x6501f354) ChangeAdmin {
    queryId: Int as uint64;
    nextAdmin: Address;
}

message(0xfb88e119) ClaimAdmin {
    queryId: Int as uint64;
}

message(0x7431f221) DropAdmin {
    queryId: Int as uint64;
}



================================================
FILE: src/benchmarks/jetton/func/discovery-params.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/func/discovery-params.fc
================================================
;; moved to the separate file to keep hex of the previous codes unchanged
#include "params.fc";

int op::provide_wallet_address() asm "0x2c76b973 PUSHINT";
int op::take_wallet_address() asm "0xd1735400 PUSHINT";

int is_resolvable?(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);

    return wc == workchain();
}



================================================
FILE: src/benchmarks/jetton/func/jetton-minter-discoverable.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/func/jetton-minter-discoverable.fc
================================================
;; Jettons discoverable smart contract
#include "params.fc";
#include "op-codes.fc";
#include "discovery-params.fc";
#include "jetton-utils.fc";

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
int provide_address_gas_consumption() asm "10000000 PUSHINT";

;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

(int, slice, cell, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
            ds~load_coins(), ;; total_supply
            ds~load_msg_addr(), ;; admin_address
            ds~load_ref(), ;; content
            ds~load_ref() ;; jetton_wallet_code
    );
}

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
    set_data(begin_cell()
            .store_coins(total_supply)
            .store_slice(admin_address)
            .store_ref(content)
            .store_ref(jetton_wallet_code)
            .end_cell()
    );
}

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
    cs~load_msg_addr(); ;; skip dst
    cs~load_coins(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_coins(); ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();

    if (op == op::mint()) {
        throw_unless(73, equal_slices_bits(sender_address, admin_address));
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

    if (op == op::burn_notification()) {
        int jetton_amount = in_msg_body~load_coins();
        slice from_address = in_msg_body~load_msg_addr();
        throw_unless(74,
                equal_slices_bits(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
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

    if (op == op::provide_wallet_address()) {
        throw_unless(75, msg_value > fwd_fee + provide_address_gas_consumption());

        slice owner_address = in_msg_body~load_msg_addr();
        int include_address? = in_msg_body~load_uint(1);

        cell included_address = include_address?
                ? begin_cell().store_slice(owner_address).end_cell()
                : null();

        var msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(sender_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(op::take_wallet_address(), 32)
                .store_uint(query_id, 64);

        if (is_resolvable?(owner_address)) {
            msg = msg.store_slice(calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code));
        } else {
            msg = msg.store_uint(0, 2); ;; addr_none
        }
        send_raw_message(msg.store_maybe_ref(included_address).end_cell(), 64);
        return ();
    }

    if (op == 3) { ;; change admin
        throw_unless(73, equal_slices_bits(sender_address, admin_address));
        slice new_admin_address = in_msg_body~load_msg_addr();
        save_data(total_supply, new_admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == 4) { ;; change content, delete this for immutable tokens
        throw_unless(73, equal_slices_bits(sender_address, admin_address));
        save_data(total_supply, admin_address, in_msg_body~load_ref(), jetton_wallet_code);
        return ();
    }

    throw(0xffff);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}



================================================
FILE: src/benchmarks/jetton/func/jetton-utils.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/func/jetton-utils.fc
================================================
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
   return  begin_cell()
            .store_coins(balance)
            .store_slice(owner_address)
            .store_slice(jetton_master_address)
            .store_ref(jetton_wallet_code)
           .end_cell();
}

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

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}




================================================
FILE: src/benchmarks/jetton/func/jetton-wallet.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/func/jetton-wallet.fc
================================================
;; Jetton Wallet Smart Contract

#include "params.fc";
#include "op-codes.fc";
#include "discovery-params.fc";
#include "jetton-utils.fc";

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
;; Note that 2 * gas_consumptions is expected to be able to cover fees on both wallets (sender and receiver)
;; and also constant fees on inter-wallet interaction, in particular fwd fee on state_init transfer
;; that means that you need to reconsider this fee when:
;; a) jetton logic become more gas-heavy
;; b) jetton-wallet code (sent with inter-wallet message) become larger or smaller
;; c) global fee changes / different workchain
int gas_consumption() asm "15000000 PUSHINT"; ;; 0.015 TON

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline {
  slice ds = get_data().begin_parse();
  return (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
}

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
  set_data(pack_jetton_wallet_data(balance, owner_address, jetton_master_address, jetton_wallet_code));
}

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
  force_chain(to_owner_address);
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  balance -= jetton_amount;

  throw_unless(705, equal_slices_bits(owner_address, sender_address));
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

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

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
      equal_slices_bits(jetton_master_address, sender_address)
      |
      equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
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
  throw_unless(705, equal_slices_bits(owner_address, sender_address));
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
  int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs

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

(int, slice, slice, cell) get_wallet_data() method_id {
  return load_data();
}



================================================
FILE: src/benchmarks/jetton/func/op-codes.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/func/op-codes.fc
================================================
int op::transfer() asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::internal_transfer() asm "0x178d4519 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::burn() asm "0x595f07bc PUSHINT";
int op::burn_notification() asm "0x7bdd97de PUSHINT";

;; Minter
int op::mint() asm "21 PUSHINT";



================================================
FILE: src/benchmarks/jetton/func/params.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/func/params.fc
================================================
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}


================================================
FILE: src/benchmarks/jetton/tact/messages.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/tact/messages.tact
================================================
struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    jettonWalletCode: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

struct MaybeAddress {
    address: Address?;
}

message(4) JettonUpdateContent {
    queryId: Int as uint64;
    content: Cell;
}

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x178d4519) JettonTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x7362d09c) JettonNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    customPayload: Cell?;
}

message(0x7bdd97de) JettonBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address;
}

message(0xd53276db) JettonExcesses {
    queryId: Int as uint64;
}

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}

message(0xd1735400) TakeWalletAddress {
    queryId: Int as uint64;
    walletAddress: Address;
    ownerAddress: Cell?; //It is Maybe ^Address, just encoded it like this
}

message(21) Mint {
    queryId: Int as uint64;
    receiver: Address;
    tonAmount: Int as coins;
    mintMessage: JettonTransferInternal;
}

message(3) ChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}

// notcoin
message(0xd372158c) TopUp {
    queryId: Int as uint64;
}

message(0x6501f354) ChangeAdmin {
    queryId: Int as uint64;
    nextAdmin: Address;
}

message(0xfb88e119) ClaimAdmin {
    queryId: Int as uint64;
}

message(0x7431f221) DropAdmin {
    queryId: Int as uint64;
}



================================================
FILE: src/benchmarks/jetton/tact/minter.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/tact/minter.tact
================================================
// https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

import "./wallet";
import "./messages";

const ProvideAddressGasConsumption: Int = ton("0.01");
const Workchain: Int = 0;

struct JettonMasterState {
    totalSupply: Int as coins;
    mintable: Bool;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
}

contract JettonMinter(
    totalSupply: Int as coins,
    owner: Address,
    jettonContent: Cell,
) {
    receive(msg: JettonBurnNotification) {
        let sender = parseStdAddress(sender().asSlice());
        let wallet = getJettonBasechainWalletByOwner(msg.sender);

        throwUnless(74, sender.workchain == Workchain && sender.address == wallet.hash!!);

        self.totalSupply -= msg.amount;

        if (msg.responseDestination.isNotNone()) {
            message(MessageParameters {
                to: msg.responseDestination,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors, // ignore errors, because supply has already been updated
            });
        }
    }

    receive(msg: ProvideWalletAddress) {
        // we use message fwdFee for estimation of forward_payload costs
        let ctx = context();
        let fwdFee = ctx.readForwardFee();
        throwUnless(75, ctx.value > fwdFee + ProvideAddressGasConsumption);

        let ownerWorkchain: Int = parseStdAddress(msg.ownerAddress.asSlice()).workchain;

        let targetJettonWallet: BasechainAddress = (ownerWorkchain == Workchain)
            ? contractBasechainAddress(initOf JettonWallet(msg.ownerAddress, myAddress(), 0))
            : emptyBasechainAddress();

        message(MessageParameters {
            body: makeTakeWalletAddressMsg(targetJettonWallet, msg),
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
        });
    }

    receive(msg: JettonUpdateContent) {
        throwUnless(73, sender() == self.owner);
        self.jettonContent = msg.content;
    }

    receive(msg: Mint) {
        throwUnless(73, sender() == self.owner);
        self.totalSupply += msg.mintMessage.amount;

        deploy(DeployParameters {
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: msg.mintMessage.toCell(),
            init: getJettonWalletInit(msg.receiver),
        });
    }

    receive(msg: ChangeOwner) {
        throwUnless(73, sender() == self.owner);
        self.owner = msg.newOwner;
    }

    receive(_: Slice) { throw(0xffff) }

    get fun get_jetton_data(): JettonMasterState {
        return JettonMasterState {
            totalSupply: self.totalSupply,
            mintable: true,
            adminAddress: self.owner,
            jettonContent: self.jettonContent,
            jettonWalletCode: codeOf JettonWallet,
        };
    }

    get fun get_wallet_address(ownerAddress: Address): Address {
        return getJettonWalletByOwner(ownerAddress);
    }
}

asm fun emptyAddress(): Address { b{00} PUSHSLICE }

inline fun makeTakeWalletAddressMsg(targetJettonWallet: BasechainAddress, msg: ProvideWalletAddress): Cell {
    return beginCell()
        .storeUint(TakeWalletAddress.opcode(), 32)
        .storeUint(msg.queryId, 64)
        .storeBasechainAddress(targetJettonWallet)
        .storeMaybeRef(msg.includeAddress ? beginCell().storeAddress(msg.ownerAddress).endCell() : null)
        .endCell();
}

inline fun getJettonWalletInit(address: Address): StateInit {
    return initOf JettonWallet(address, myAddress(), 0);
}

inline fun getJettonWalletByOwner(jettonWalletOwner: Address): Address {
    return contractAddress(getJettonWalletInit(jettonWalletOwner));
}

inline fun getJettonBasechainWalletByOwner(jettonWalletOwner: Address): BasechainAddress {
    return contractBasechainAddress(getJettonWalletInit(jettonWalletOwner));
}

inline extends fun isNotNone(self: Address): Bool { return self.asSlice().preloadUint(2) != 0 }



================================================
FILE: src/benchmarks/jetton/tact/wallet.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/jetton/tact/wallet.tact
================================================
import "./messages";

contract JettonWallet(
    owner: Address,
    master: Address,
    balance: Int as coins,
) {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.015");

    receive(msg: JettonTransfer) {
        forceBasechain(msg.destination);
        throwUnless(705, sender() == self.owner);

        self.balance -= msg.amount;
        throwUnless(706, self.balance >= 0);
        throwUnless(708, msg.forwardPayload.bits() >= 1);

        let ctx = context();

        // srcWallet -> destWallet
        // destWallet -> owner (this one is optional and won't be send if msg.forwardTonAmount == 0)
        let fwdCount = 1 + sign(msg.forwardTonAmount); // msg.forwardTonAmount is coins, so it's not negative

        throwUnless(709, ctx.value >
                         msg.forwardTonAmount +
                         fwdCount * ctx.readForwardFee() +
                         (2 * self.gasConsumption + self.minTonsForStorage));

        deploy(DeployParameters {
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonTransferInternal {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload,
            }.toCell(),
            init: initOf JettonWallet(msg.destination, self.master, 0),
        });
    }

    receive(msg: JettonTransferInternal) {
        self.balance += msg.amount;

        // This message should come only from master, or from other JettonWallet
        let wallet: StateInit = initOf JettonWallet(msg.sender, self.master, 0);
        if (!wallet.hasSameBasechainAddress(sender())) {
            throwUnless(707, self.master == sender());
        }

        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg = myBalance() - msgValue;
        let storageFee = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue -= (storageFee + self.gasConsumption);

        if (msg.forwardTonAmount > 0) {
            let fwdFee: Int = ctx.readForwardFee();
            msgValue -= msg.forwardTonAmount + fwdFee;
            message(MessageParameters {
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayFwdFeesSeparately,
                bounce: false,
                body: JettonNotification { // 0x7362d09c -- Remind the new Owner
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.sender,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }

        // 0xd53276db -- Cashback to the original Sender
        if (msg.responseDestination != null && msgValue > 0) {
            message(MessageParameters {
                to: msg.responseDestination!!,
                value: msgValue,
                mode: SendIgnoreErrors,
                bounce: false,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
            });
        }
    }

    receive(msg: JettonBurn) {
        throwUnless(705, sender() == self.owner);

        self.balance -= msg.amount;
        throwUnless(706, self.balance >= 0);

        let ctx = context();
        let fwdFee: Int = ctx.readForwardFee();
        throwUnless(707, ctx.value > (fwdFee + 2 * self.gasConsumption));

        message(MessageParameters {
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonBurnNotification {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
            }.toCell(),
        });
    }

    receive(_: Slice) { throw(0xffff) }

    bounced(msg: bounced<JettonTransferInternal>) {
        self.balance += msg.amount;
    }

    bounced(msg: bounced<JettonBurnNotification>) {
        self.balance += msg.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData {
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            code: myCode(),
        };
    }
}



================================================
FILE: src/benchmarks/nft/func/nft-collection.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/func/nft-collection.fc
================================================
#include "params.fc";
#include "op-codes.fc";

;; NFT collection smart contract

;; storage scheme
;; default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
;; storage#_ owner_address:MsgAddress next_item_index:uint64
;;           ^[collection_content:^Cell common_content:^Cell]
;;           nft_item_code:^Cell
;;           royalty_params:^RoyaltyParams
;;           = Storage;

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

() save_data(slice owner_address, int next_item_index, cell content, cell nft_item_code, cell royalty_params) impure inline {
  set_data(begin_cell()
    .store_slice(owner_address)
    .store_uint(next_item_index, 64)
    .store_ref(content)
    .store_ref(nft_item_code)
    .store_ref(royalty_params)
    .end_cell());
}

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

    throw_unless(401, equal_slices_bits(sender_address, owner_address));
    
  
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
    if (op == 3) { ;; change owner
      slice new_owner = in_msg_body~load_msg_addr();
      save_data(new_owner, next_item_index, content, nft_item_code, royalty_params);
      return ();
    }
    throw(0xffff);
}

;; Get methods

(int, cell, slice) get_collection_data() method_id {
  var (owner_address, next_item_index, content, _, _) = load_data();
  slice cs = content.begin_parse();
  return (next_item_index, cs~load_ref(), owner_address);
}

slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(workchain(), state_init);
}

(int, int, slice) royalty_params() method_id {
     var (_, _, _, _, royalty) = load_data();
     slice rs = royalty.begin_parse();
     return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

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


================================================
FILE: src/benchmarks/nft/func/nft-item.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/func/nft-item.fc
================================================
#include "params.fc";
#include "op-codes.fc";

;;
;;  TON NFT Item Smart Contract
;;

{-

    NOTE that this tokens can be transferred within the same workchain.

    This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

    1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

    2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;

(int, int, slice, slice, cell) load_data() {
    slice ds = get_data().begin_parse();
    var (index, collection_address) = (ds~load_uint(64), ds~load_msg_addr());
    if (ds.slice_bits() > 0) {
      return (-1, index, collection_address, ds~load_msg_addr(), ds~load_ref());
    } else {  
      return (0, index, collection_address, null(), null()); ;; nft not initialized yet
    }
}

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

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
  var msg = begin_cell()
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
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

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
    throw_unless(401, equal_slices_bits(sender_address, owner_address));

    slice new_owner_address = in_msg_body~load_msg_addr();
    force_chain(new_owner_address);
    slice response_destination = in_msg_body~load_msg_addr();
    in_msg_body~load_int(1); ;; this nft don't use custom_payload
    int forward_amount = in_msg_body~load_coins();
    throw_unless(708, slice_bits(in_msg_body) >= 1);

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
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs


    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    if (~ init?) {
      throw_unless(405, equal_slices_bits(collection_address, sender_address));
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

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
  (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
  return (init?, index, collection_address, owner_address, content);
}


================================================
FILE: src/benchmarks/nft/func/op-codes.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/func/op-codes.fc
================================================
int op::transfer() asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned() asm "0x05138d91 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::get_static_data() asm "0x2fcb26a2 PUSHINT";
int op::report_static_data() asm "0x8b771735 PUSHINT";
int op::get_royalty_params() asm "0x693d3950 PUSHINT";
int op::report_royalty_params() asm "0xa8cb00ad PUSHINT";

;; NFTEditable
int op::edit_content() asm "0x1a0b9d51 PUSHINT";
int op::transfer_editorship() asm "0x1c04412a PUSHINT";
int op::editorship_assigned() asm "0x511a4463 PUSHINT";


================================================
FILE: src/benchmarks/nft/func/params.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/func/params.fc
================================================
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}


================================================
FILE: src/benchmarks/nft/tact/collection.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/tact/collection.tact
================================================
import "./constants";
import "./messages";
import "./item";

contract NFTCollection {
    owner: Address;
    nextItemIndex: Int as uint64; // IndexSizeBits = 64
    content: Cell;
    royaltyParams: RoyaltyParams;

    commonCode: Cell;
    commonData: Builder;

    init(owner: Address, nextItemIndex: Int as uint64, collectionContent: Cell, royaltyParams: RoyaltyParams) {
        self.owner = owner;
        self.nextItemIndex = nextItemIndex;
        self.content = collectionContent;
        self.royaltyParams = royaltyParams;

        self.commonCode = codeOf NFTItem;
        self.commonData = beginCell()
            .storeUint(0, 3) // 0b00 - null address and 0b0 - null content cell
            .storeAddress(myAddress());
    }

    receive() {} // ignore empty messages

    receive(msg: DeployNFT) {
        throwUnless(IncorrectSender, sender() == self.owner);
        throwUnless(IncorrectIndex, msg.itemIndex <= self.nextItemIndex);

        deployNFTItem(self.commonCode, msg.itemIndex, msg.amount, msg.initNFTBody, self.commonData);

        if (msg.itemIndex == self.nextItemIndex) {
            self.nextItemIndex += 1;
        }
    }

    receive(msg: GetRoyaltyParams) {
        message(MessageParameters {
            bounce: false,
            to: sender(),
            value: 0,
            body: ReportRoyaltyParams {
                queryId: msg.queryId,
                params: self.royaltyParams,
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    receive(msg: BatchDeploy) {
        throwUnless(IncorrectSender, sender() == self.owner);

        let currNFTItem: DictGet = dictGetMin(msg.deployList, IndexSizeBits);
        let counter: Int = 0;

        while (currNFTItem.flag != 0) {
            counter += 1;
            // we can check outside the loop, but for benchmark place it here
            throwIf(IncorrectAmount, counter >= 250); // implementation detail

            throwUnless(IncorrectIndexes + counter, currNFTItem.itemIndex!! <= self.nextItemIndex);

            let dictItem: DictItem = DictItem.fromSlice(currNFTItem.item!!);

            deployNFTItem(self.commonCode, currNFTItem.itemIndex!!, dictItem.amount, dictItem.initNFTBody, self.commonData);

            if (currNFTItem.itemIndex!! == self.nextItemIndex) {
                self.nextItemIndex += 1;
            }

            currNFTItem = dictGetNext(currNFTItem.itemIndex!!, msg.deployList, IndexSizeBits);
        }
    }

    receive(msg: ChangeOwner) {
        throwUnless(IncorrectSender, sender() == self.owner);
        self.owner = msg.newOwner;
    }

    get fun get_collection_data(): CollectionData {
        let cs: Slice = self.content.beginParse();
        return CollectionData {
            nextItemIndex: self.nextItemIndex,
            collectionContent: cs.loadRef(),
            owner: self.owner,
        };
    }

    get fun get_nft_address_by_index(index: Int): Address {
        let stateInit = initOf NFTItem(null, null, myAddress(), index);
        return contractAddress(stateInit);
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royaltyParams;
    }

    get fun get_nft_content(index: Int, individualNFTContent: Cell): Cell {
        let cs = self.content.beginParse();
        cs.skipRef();
        let commonContent = cs.loadRef().beginParse();
        return beginCell()
            .storeUint(1, 8) // off-chain tag
            .storeSlice(commonContent)
            .storeRef(individualNFTContent)
            .endCell();
    }
}

inline fun deployNFTItem(commonCode: Cell, itemIndex: Int, amount: Int, initNFTBody: Cell, commonData: Builder) {
    let data: Cell = commonData.storeUint(itemIndex, 64).endCell(); // IndexSizeBits = 64

    deploy(DeployParameters {
        value: amount,
        body: initNFTBody,
        init: StateInit { code: commonCode, data },
        mode: SendPayFwdFeesSeparately,
    });
}

struct DictGet {
    itemIndex: Int? as uint64; // IndexSizeBits = 64
    item: Slice?;
    flag: Int;
}

struct DictItem {
    amount: Int as coins;
    initNFTBody: Cell;
}

// (int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
asm(-> 1 0 2) fun dictGetMin(dict: Cell, keySize: Int): DictGet { DICTUMIN NULLSWAPIFNOT2 }

// (int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
asm(-> 1 0 2) fun dictGetNext(pivot: Int, dict: Cell, keySize: Int): DictGet { DICTUGETNEXT NULLSWAPIFNOT2 }



================================================
FILE: src/benchmarks/nft/tact/constants.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/tact/constants.tact
================================================
// Opcodes
const OwnershipAssigned: Int = 0x05138d91;
const Excesses: Int = 0xd53276db;
const ReportStaticData: Int = 0x8b771735;
// ExitCodes
const IncorrectDeployer: Int = 405;
const IncorrectIndex: Int = 402;
const IncorrectAmount: Int = 399;
const IncorrectIndexes: Int = 403;
const IncorrectForwardPayload: Int = 708;

const IncorrectSender: Int = 401;
const InvalidDestinationWorkchain: Int = 333;
const InvalidData: Int = 65535; // not handled
const NotInit: Int = 9;
const InvalidFees: Int = 402;
// GasConstants
const minTonsForStorage: Int = ton("0.05");
// SizeConstants
const IndexSizeBits: Int = 64;



================================================
FILE: src/benchmarks/nft/tact/item.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/tact/item.tact
================================================
import "./constants";
import "./messages";

struct NFTItemInit {
    owner: Address;
    content: Cell;
}

contract NFTItem(
    owner: Address?,
    content: Cell?,
    collectionAddress: Address,
    itemIndex: Int as uint64,
) {
    receive() {} // ignore empty messages

    receive(msg: GetStaticData) {
        throwUnless(NotInit, self.owner != null);

        sendMsg(
            sender(),
            0,
            ReportStaticData,
            msg.queryId,
            beginCell()
                .storeUint(self.itemIndex, 256)
                .storeAddress(self.collectionAddress),
            SendRemainingValue,
        ); // implementation detail
    }

    receive(msg: Slice) {
        // Check if owner == null, which means the contract hasn't been initialized yet
        // owner is used as an initialization flag: if null - contract is not initialized,
        // if not null - contract has been initialized before
        // This prevents contract re-initialization since initialization should happen only once
        // We use similar checks in other methods (e.g., Transfer, GetStaticData) with throwUnless(NotInit, self.owner != null)
        // to ensure the contract is properly initialized before executing any operations
        throwUnless(InvalidData, self.owner == null);
        throwUnless(IncorrectDeployer, sender() == self.collectionAddress);

        let nftItemInit = NFTItemInit.fromSlice(msg);

        self.owner = nftItemInit.owner;
        self.content = nftItemInit.content;
    }

    receive(msg: Transfer) {
        throwUnless(NotInit, self.owner != null);
        throwUnless(IncorrectSender, sender() == self.owner);
        throwUnless(IncorrectForwardPayload, msg.forwardPayload.bits() >= 1);
        forceBasechain(msg.newOwner);

        let fwdFees = context().readForwardFee();

        let restAmount = myBalance() - minTonsForStorage;
        if (msg.forwardAmount > 0) {
            restAmount -= msg.forwardAmount + fwdFees;
        }

        // when we load addr_none$00 in tact we got null
        let needResponse = msg.responseDestination != null;
        if (needResponse) {
            restAmount -= fwdFees;
        }

        throwUnless(InvalidFees, restAmount >= 0);

        if (msg.forwardAmount > 0) {
            sendMsg(
                msg.newOwner,
                msg.forwardAmount,
                OwnershipAssigned,
                msg.queryId,
                beginCell()
                    .storeAddress(self.owner!!)
                    .storeSlice(msg.forwardPayload),
                SendPayFwdFeesSeparately,
            );
        }

        if (needResponse) {
            forceBasechain(msg.responseDestination!!);
            sendMsg(
                msg.responseDestination!!,
                restAmount,
                Excesses,
                msg.queryId,
                beginCell(),
                SendPayFwdFeesSeparately,
            );
        }

        self.owner = msg.newOwner;
    }

    get fun get_nft_data(): NFTData {
        return NFTData {
            init: self.owner != null ? -1 : 0, // -1 is true
            itemIndex: self.itemIndex,
            collectionAddress: self.collectionAddress,
            owner: self.owner,
            content: self.content,
        };
    }
}

inline fun sendMsg(toAddress: Address, amount: Int, op: Int, queryId: Int, payload: Builder, sendMode: Int) {
    message(MessageParameters {
        bounce: false,
        to: toAddress,
        value: amount,
        body: beginCell()
            .storeUint(op, 32)
            .storeUint(queryId, 64)
            .storeBuilder(payload)
            .endCell(),
        mode: sendMode,
    });
}



================================================
FILE: src/benchmarks/nft/tact/messages.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/nft/tact/messages.tact
================================================
//transfer#5fcc3d14 queryId:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody;
message(0x5fcc3d14) Transfer {
    queryId: Int as uint64;
    newOwner: Address;
    responseDestination: Address?; // can be addr_none$00 without storing MayBe bit 
    customPayload: Cell?;
    forwardAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x2fcb26a2) GetStaticData {
    queryId: Int as uint64;
}

struct NFTData {
    init: Int;
    itemIndex: Int as uint64;
    collectionAddress: Address;
    owner: Address?;
    content: Cell?;
}

struct InitNFTData {
    collectionAddress: Address;
    itemIndex: Int as uint64;
}

struct InitNFTBody {
    owner: Address;
    content: Cell;
}

// issue blocker for this is https://github.com/tact-lang/tact/issues/2275
// struct InitNFTBodyDict {
//     amount: Int as coins;
//     initNFTBody: Cell; // ^InitNFTBody
// }

struct CollectionData {
    nextItemIndex: Int as uint64;
    collectionContent: Cell;
    owner: Address;
}

struct RoyaltyParams {
    nominator: Int as uint16;
    dominator: Int as uint16;
    owner: Address;
}

message(0x693d3950) GetRoyaltyParams {
    queryId: Int as uint64;
}

message(1) DeployNFT {
    queryId: Int as uint64;
    itemIndex: Int as uint64;
    amount: Int as coins;
    initNFTBody: Cell; // ^InitNFTBody
}

message(2) BatchDeploy {
    queryId: Int as uint64;
    deployList: Cell; // map<Int as uint64, InitNFTBodyDict> 
}

message(3) ChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    queryId: Int as uint64;
    params: RoyaltyParams;
}



================================================
FILE: src/benchmarks/notcoin/func/gas.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/func/gas.fc
================================================
#include "workchain.fc";

const ONE_TON = 1000000000;

const MIN_STORAGE_DURATION = 5 * 365 * 24 * 3600; ;; 5 years

;;# Precompiled constants
;;
;;All of the contents are result of contract emulation tests
;;

;;## Minimal fees
;;
;;- Transfer [/sandbox_tests/JettonWallet.spec.ts#L935](L935) `0.028627415` TON
;;- Burn [/sandbox_tests/JettonWallet.spec.ts#L1185](L1185) `0.016492002` TON


;;## Storage
;;
;;Get calculated in a separate test file [/sandbox_tests/StateInit.spec.ts](StateInit.spec.ts)

;;- `JETTON_WALLET_BITS` [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_BITS  = 1033;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS = 3;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS  = 931;
;;- `JETTON_WALLET_INITSTATE_CELLS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_CELLS = 3;

;; jetton-wallet.fc#L163 - maunal bits counting
const BURN_NOTIFICATION_BITS = 754; ;; body = 32+64+124+(3+8+256)+(3+8+256)
const BURN_NOTIFICATION_CELLS = 1; ;; body always in ref

;;## Gas
;;
;;Gas constants are calculated in the main test suite.
;;First the related transaction is found, and then it's
;;resulting gas consumption is printed to the console.

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L853](L853)
const SEND_TRANSFER_GAS_CONSUMPTION    = 10065;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L862](L862)
const RECEIVE_TRANSFER_GAS_CONSUMPTION = 10435;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1154](L1154)
const SEND_BURN_GAS_CONSUMPTION    = 5891;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1155](L1155)
const RECEIVE_BURN_GAS_CONSUMPTION = 6757;


int calculate_jetton_wallet_min_storage_fee() inline {
    return get_storage_fee(MY_WORKCHAIN, MIN_STORAGE_DURATION, JETTON_WALLET_BITS, JETTON_WALLET_CELLS);
}

int forward_init_state_overhead() inline {
    return get_simple_forward_fee(MY_WORKCHAIN, JETTON_WALLET_INITSTATE_BITS, JETTON_WALLET_INITSTATE_CELLS);
}

() check_amount_is_enough_to_transfer(int msg_value, int forward_ton_amount, int fwd_fee) impure inline {
    int fwd_count = forward_ton_amount ? 2 : 1; ;; second sending (forward) will be cheaper that first

    int jetton_wallet_gas_consumption = get_precompiled_gas_consumption();
    int send_transfer_gas_consumption = null?(jetton_wallet_gas_consumption) ? SEND_TRANSFER_GAS_CONSUMPTION : jetton_wallet_gas_consumption;
    int receive_transfer_gas_consumption = null?(jetton_wallet_gas_consumption) ? RECEIVE_TRANSFER_GAS_CONSUMPTION : jetton_wallet_gas_consumption;

    throw_unless(error::not_enough_gas, msg_value >
    forward_ton_amount +
    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
    fwd_count * fwd_fee +
    forward_init_state_overhead() + ;; additional fwd fees related to initstate in internal_transfer
    get_compute_fee(MY_WORKCHAIN, send_transfer_gas_consumption) +
    get_compute_fee(MY_WORKCHAIN, receive_transfer_gas_consumption) +
    calculate_jetton_wallet_min_storage_fee() );
}



() check_amount_is_enough_to_burn(int msg_value) impure inline {
    int jetton_wallet_gas_consumption = get_precompiled_gas_consumption();
    int send_burn_gas_consumption = null?(jetton_wallet_gas_consumption) ? SEND_BURN_GAS_CONSUMPTION : jetton_wallet_gas_consumption;

    throw_unless(error::not_enough_gas, msg_value > get_forward_fee(MY_WORKCHAIN, BURN_NOTIFICATION_BITS, BURN_NOTIFICATION_CELLS) + get_compute_fee(MY_WORKCHAIN, send_burn_gas_consumption) + get_compute_fee(MY_WORKCHAIN, RECEIVE_BURN_GAS_CONSUMPTION));
}



================================================
FILE: src/benchmarks/notcoin/func/jetton-minter-not.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/func/jetton-minter-not.fc
================================================
;; Jetton minter smart contract

#pragma version >=0.4.3;

#include "stdlib-custom.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

;; storage#_ total_supply:Coins admin_address:MsgAddress next_admin_address:MsgAddress jetton_wallet_code:^Cell metadata_uri:^Cell = Storage;
(int, slice, slice, cell, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_coins(), ;; total_supply
        ds~load_msg_addr(), ;; admin_address
        ds~load_msg_addr(), ;; next_admin_address
        ds~load_ref(),  ;; jetton_wallet_code
        ds~load_ref()  ;; metadata url (contains snake slice without 0x0 prefix)
    );
    ds.end_parse();
    return data;
}

() save_data(int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) impure inline {
    set_data(
        begin_cell()
        .store_coins(total_supply)
        .store_slice(admin_address)
        .store_slice(next_admin_address)
        .store_ref(jetton_wallet_code)
        .store_ref(metadata_uri)
        .end_cell()
    );
}

() send_to_jetton_wallet(slice to_address, cell jetton_wallet_code, int ton_amount, cell master_msg, int need_state_init) impure inline {
    raw_reserve(ONE_TON / 100, RESERVE_REGULAR); ;; reserve for storage fees

    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    var msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_slice(to_wallet_address) ;; dest
    .store_coins(ton_amount);

    if (need_state_init) {
        msg = msg.store_statinit_ref_and_body_ref(state_init, master_msg);
    } else {
        msg = msg.store_only_body_ref(master_msg);
    }

    send_raw_message(msg.end_cell(), SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
}

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice in_msg_full_slice = in_msg_full.begin_parse();
    int msg_flags = in_msg_full_slice~load_msg_flags();

    if (is_bounced(msg_flags)) {
        in_msg_body~skip_bounced_prefix();
        ;; process only mint bounces
        ifnot (in_msg_body~load_op() == op::internal_transfer) {
            return ();
        }
        in_msg_body~skip_query_id();
        int jetton_amount = in_msg_body~load_coins();
        (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
        save_data(total_supply - jetton_amount, admin_address, next_admin_address, jetton_wallet_code, metadata_uri);
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();
    int fwd_fee_from_in_msg = in_msg_full_slice~retrieve_fwd_fee();
    int fwd_fee = get_original_fwd_fee(MY_WORKCHAIN, fwd_fee_from_in_msg); ;; we use message fwd_fee for estimation of forward_payload costs

    (int op, int query_id) = in_msg_body~load_op_and_query_id();

    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();

    if (op == op::mint) {
        throw_unless(error::not_owner, equal_slices_bits(sender_address, admin_address));
        slice to_address = in_msg_body~load_msg_addr();
        check_same_workchain(to_address);
        int ton_amount = in_msg_body~load_coins();
        cell master_msg = in_msg_body~load_ref();
        in_msg_body.end_parse();

        ;; see internal_transfer TL-B layout in jetton.tlb
        slice master_msg_slice = master_msg.begin_parse();
        throw_unless(error::invalid_op, master_msg_slice~load_op() == op::internal_transfer);
        master_msg_slice~skip_query_id();
        int jetton_amount = master_msg_slice~load_coins();
        master_msg_slice~load_msg_addr(); ;; from_address
        master_msg_slice~load_msg_addr(); ;; response_address
        int forward_ton_amount = master_msg_slice~load_coins(); ;; forward_ton_amount
        check_either_forward_payload(master_msg_slice); ;; either_forward_payload

        ;; a little more than needed, it’s ok since it’s sent by the admin and excesses will return back
        check_amount_is_enough_to_transfer(ton_amount, forward_ton_amount, fwd_fee);

        send_to_jetton_wallet(to_address, jetton_wallet_code, ton_amount, master_msg, TRUE);
        save_data(total_supply + jetton_amount, admin_address, next_admin_address, jetton_wallet_code, metadata_uri);
        return ();
    }

    if (op == op::burn_notification) {
        ;; see burn_notification TL-B layout in jetton.tlb
        int jetton_amount = in_msg_body~load_coins();
        slice from_address = in_msg_body~load_msg_addr();
        throw_unless(error::not_valid_wallet,
            equal_slices_bits(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
        );
        save_data(total_supply - jetton_amount, admin_address, next_admin_address, jetton_wallet_code, metadata_uri);
        slice response_address = in_msg_body~load_msg_addr();
        in_msg_body.end_parse();

        if (~ is_address_none(response_address)) {
            ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
            var msg = begin_cell()
            .store_msg_flags_and_address_none(NON_BOUNCEABLE)
            .store_slice(response_address) ;; dest
            .store_coins(0)
            .store_prefix_only_body()
            .store_op(op::excesses)
            .store_query_id(query_id);
            send_raw_message(msg.end_cell(), SEND_MODE_IGNORE_ERRORS | SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }
        return ();
    }

    if (op == op::provide_wallet_address) {
        ;; see provide_wallet_address TL-B layout in jetton.tlb
        slice owner_address = in_msg_body~load_msg_addr();
        int include_address? = in_msg_body~load_bool();
        in_msg_body.end_parse();

        cell included_address = include_address?
        ? begin_cell().store_slice(owner_address).end_cell()
        : null();

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        var msg = begin_cell()
        .store_msg_flags_and_address_none(NON_BOUNCEABLE)
        .store_slice(sender_address)
        .store_coins(0)
        .store_prefix_only_body()
        .store_op(op::take_wallet_address)
        .store_query_id(query_id);

        if (is_same_workchain(owner_address)) {
            msg = msg.store_slice(calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code));
        } else {
            msg = msg.store_address_none();
        }

        cell msg_cell = msg.store_maybe_ref(included_address).end_cell();

        send_raw_message(msg_cell, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
        return ();
    }

    if (op == op::change_admin) {
        throw_unless(error::not_owner, equal_slices_bits(sender_address, admin_address));
        next_admin_address = in_msg_body~load_msg_addr();
        in_msg_body.end_parse();
        save_data(total_supply, admin_address, next_admin_address, jetton_wallet_code, metadata_uri);
        return ();
    }

    if (op == op::claim_admin) {
        in_msg_body.end_parse();
        throw_unless(error::not_owner, equal_slices_bits(sender_address, next_admin_address));
        save_data(total_supply, next_admin_address, address_none(), jetton_wallet_code, metadata_uri);
        return ();
    }

    if (op == op::drop_admin) {
        throw_unless(error::not_owner, equal_slices_bits(sender_address, admin_address));
        in_msg_body.end_parse();
        save_data(total_supply, address_none(), address_none(), jetton_wallet_code, metadata_uri);
        return ();
    }

    if (op == op::change_metadata_uri) {
        throw_unless(error::not_owner, equal_slices_bits(sender_address, admin_address));
        save_data(total_supply, admin_address, next_admin_address, jetton_wallet_code, begin_cell().store_slice(in_msg_body).end_cell());
        return ();
    }

    if (op == op::upgrade) {
        throw_unless(error::not_owner, equal_slices_bits(sender_address, admin_address));
        (cell new_data, cell new_code) = (in_msg_body~load_ref(), in_msg_body~load_ref());
        in_msg_body.end_parse();
        set_data(new_data);
        set_code(new_code);
        return ();
    }

    if (op == op::top_up) {
        return (); ;; just accept tons
    }

    throw(error::wrong_op);
}

cell build_content_cell(slice metadata_uri) inline {
    cell content_dict = new_dict();
    content_dict~set_token_snake_metadata_entry("uri"H, metadata_uri);
    content_dict~set_token_snake_metadata_entry("decimals"H, "9");
    return create_token_onchain_metadata(content_dict);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return (total_supply, TRUE, admin_address, build_content_cell(metadata_uri.begin_parse()), jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}

slice get_next_admin_address() method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return next_admin_address;
}



================================================
FILE: src/benchmarks/notcoin/func/jetton-utils.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/func/jetton-utils.fc
================================================
#include "stdlib-custom.fc";
#include "workchain.fc";

const int STATUS_SIZE = 4;

builder pack_jetton_wallet_data_builder(int status, int balance, slice owner_address, slice jetton_master_address) inline {
    return begin_cell()
        .store_uint(status, STATUS_SIZE)
        .store_coins(balance)
        .store_slice(owner_address)
        .store_slice(jetton_master_address);
}

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address) inline {
    return pack_jetton_wallet_data_builder(status, balance, owner_address, jetton_master_address)
           .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    return begin_cell()
    .store_uint(0, 2) ;; 0b00 - No split_depth; No special
    .store_maybe_ref(jetton_wallet_code)
    .store_maybe_ref(
        pack_jetton_wallet_data(
            0, ;; status
            0, ;; balance
            owner_address,
            jetton_master_address)
    )
    .store_uint(0, 1) ;; Empty libraries
    .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}
    return begin_cell()
    .store_uint(4, 3) ;; 0b100 = addr_std$10 tag; No anycast
    .store_int(MY_WORKCHAIN, 8)
    .store_uint(cell_hash(state_init), 256)
    .end_cell()
    .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}

() check_either_forward_payload(slice s) impure inline {
    if (s.preload_uint(1)) {
        ;; forward_payload in ref
        (int remain_bits, int remain_refs) = slice_bits_refs(s);
        throw_unless(error::invalid_message, (remain_refs == 1) & (remain_bits == 1)); ;; we check that there is no excess in the slice
    }
    ;; else forward_payload in slice - arbitrary bits and refs
}


================================================
FILE: src/benchmarks/notcoin/func/jetton-wallet-not.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/func/jetton-wallet-not.fc
================================================
;; Jetton Wallet Smart Contract

#pragma version >=0.4.3;

#include "stdlib-custom.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

{-
  Storage

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt = Storage;
-}

(int, int, slice, slice) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_uint(STATUS_SIZE), ;; status
        ds~load_coins(), ;; balance
        ds~load_msg_addr(), ;; owner_address
        ds~load_msg_addr() ;; jetton_master_address
    );
    ds.end_parse();
    return data;
}

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline {
    builder data_builder = pack_jetton_wallet_data_builder(status, balance, owner_address, jetton_master_address);
    set_data(data_builder.end_cell());
}


() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    ;; int outgoing_transfers_unlocked = ((status & 1) == 0);
    ;;throw_unless(error::contract_locked, outgoing_transfers_unlocked);
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address));

    balance -= jetton_amount;
    throw_unless(error::balance_error, balance >= 0);

    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, my_code());
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    int forward_ton_amount = in_msg_body~load_coins();
    check_either_forward_payload(in_msg_body);
    slice either_forward_payload = in_msg_body;

    ;; see internal TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
    .store_op(op::internal_transfer)
    .store_query_id(query_id)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .store_coins(forward_ton_amount)
    .store_slice(either_forward_payload)
    .end_cell();

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    cell msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_slice(to_wallet_address)
    .store_coins(0)
    .store_statinit_ref_and_body_ref(state_init, msg_body)
    .end_cell();

    check_amount_is_enough_to_transfer(msg_value, forward_ton_amount, fwd_fee);

    send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);

    save_data(status, balance, owner_address, jetton_master_address);
}

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    ;; int incoming_transfers_locked = ((status & 2) == 2);
    ;; throw_if(error::contract_locked, incoming_transfers_locked);
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    throw_unless(error::not_valid_wallet,
        equal_slices_bits(jetton_master_address, sender_address)
        |
        equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, my_code()), sender_address)
    );
    balance += jetton_amount;

    int forward_ton_amount = in_msg_body~load_coins();

    if (forward_ton_amount) {
        slice either_forward_payload = in_msg_body;

        ;; see transfer_notification TL-B layout in jetton.tlb
        cell msg_body = begin_cell()
        .store_op(op::transfer_notification)
        .store_query_id(query_id)
        .store_coins(jetton_amount)
        .store_slice(from_address)
        .store_slice(either_forward_payload)
        .end_cell();

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        cell msg = begin_cell()
        .store_msg_flags_and_address_none(NON_BOUNCEABLE)
        .store_slice(owner_address)
        .store_coins(forward_ton_amount)
        .store_only_body_ref(msg_body)
        .end_cell();

        send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
    }

    if (~ is_address_none(response_address)) {
        int to_leave_on_balance = my_ton_balance - msg_value + my_storage_due();
        raw_reserve(max(to_leave_on_balance, calculate_jetton_wallet_min_storage_fee()), RESERVE_AT_MOST);

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        cell msg = begin_cell()
        .store_msg_flags_and_address_none(NON_BOUNCEABLE)
        .store_slice(response_address)
        .store_coins(0)
        .store_prefix_only_body()
        .store_op(op::excesses)
        .store_query_id(query_id)
        .end_cell();
        send_raw_message(msg, SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_IGNORE_ERRORS);
    }

    save_data(status, balance, owner_address, jetton_master_address);
}

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    in_msg_body.end_parse();

    balance -= jetton_amount;
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address));
    throw_unless(error::balance_error, balance >= 0);

    ;; see burn_notification TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
    .store_op(op::burn_notification)
    .store_query_id(query_id)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .end_cell();

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    cell msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_slice(jetton_master_address)
    .store_coins(0)
    .store_only_body_ref(msg_body)
    .end_cell();

    check_amount_is_enough_to_burn(msg_value);

    send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);

    save_data(status, balance, owner_address, jetton_master_address);
}

() on_bounce(slice in_msg_body) impure inline {
    in_msg_body~skip_bounced_prefix();
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int op = in_msg_body~load_op();
    throw_unless(error::wrong_op, (op == op::internal_transfer) | (op == op::burn_notification));
    in_msg_body~skip_query_id();
    int jetton_amount = in_msg_body~load_coins();
    save_data(status, balance + jetton_amount, owner_address, jetton_master_address);
}

() recv_internal(int my_ton_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice in_msg_full_slice = in_msg_full.begin_parse();
    int msg_flags = in_msg_full_slice~load_msg_flags();
    if (is_bounced(msg_flags)) {
        on_bounce(in_msg_body);
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();
    int fwd_fee_from_in_msg = in_msg_full_slice~retrieve_fwd_fee();
    int fwd_fee = get_original_fwd_fee(MY_WORKCHAIN, fwd_fee_from_in_msg); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_op();

    ;; outgoing transfer
    if (op == op::transfer) {
        send_jettons(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    ;; incoming transfer
    if (op == op::internal_transfer) {
        receive_jettons(in_msg_body, sender_address, my_ton_balance, msg_value);
        return ();
    }

    ;; burn
    if (op == op::burn) {
        burn_jettons(in_msg_body, sender_address, msg_value);
        return ();
    }

    if (op == op::top_up) {
        return (); ;; just accept tons
    }

    throw(error::wrong_op);
}

(int, slice, slice, cell) get_wallet_data() method_id {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    return (balance, owner_address, jetton_master_address, my_code());
}

int get_status() method_id {
    (int status, _, _, _) = load_data();
    return status;
}


================================================
FILE: src/benchmarks/notcoin/func/op-codes.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/func/op-codes.fc
================================================
;; common

const op::transfer = 0xf8a7ea5;
const op::transfer_notification = 0x7362d09c;
const op::internal_transfer = 0x178d4519;
const op::excesses = 0xd53276db;
const op::burn = 0x595f07bc;
const op::burn_notification = 0x7bdd97de;

const op::provide_wallet_address = 0x2c76b973;
const op::take_wallet_address = 0xd1735400;

const op::top_up = 0xd372158c;

const error::invalid_op = 72;
const error::wrong_op = 0xffff;
const error::not_owner = 73;
const error::not_valid_wallet = 74;
const error::wrong_workchain = 333;

;; jetton-minter

const op::mint = 21;
const op::change_admin = 0x6501f354;
const op::claim_admin = 0xfb88e119;
const op::drop_admin = 0x7431f221;
const op::upgrade = 0x2508d66a;
const op::change_metadata_uri = 0xcb862902;

;; jetton-wallet

const op::set_status = 0xeed236d3;

const error::contract_locked = 45;
const error::balance_error = 47;
const error::not_enough_gas = 48;
const error::invalid_message = 49;



================================================
FILE: src/benchmarks/notcoin/func/stdlib-custom.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/func/stdlib-custom.fc
================================================
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorphism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vice versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm(-> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm(-> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm(-> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm(-> 1 0) "LDVARUINT16";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm(-> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm(-> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STVARUINT16";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm(-> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coincide
int equal_slices_bits(slice a, slice b) asm "SDEQ";
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
int builder_null?(builder b) asm "ISNULL";
;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code() asm "MYCODE";

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
int send_message(cell msg, int mode) impure asm "SENDMSG";

int gas_consumed() asm "GASCONSUMED";

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int get_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEE";
int get_precompiled_gas_consumption() asm "GETPRECOMPILEDGAS";

int get_simple_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEESIMPLE";
int get_simple_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEESIMPLE";
int get_original_fwd_fee(int workchain, int fwd_fee) asm(fwd_fee workchain) "GETORIGINALFWDFEE";
int my_storage_due() asm "DUEPAYMENT";

tuple get_fee_cofigs() asm "UNPACKEDCONFIGTUPLE";

;; BASIC

const int TRUE = -1;
const int FALSE = 0;

const int MASTERCHAIN = -1;
const int BASECHAIN = 0;

;;; skip (Maybe ^Cell) from `slice` [s].
(slice, ()) ~skip_maybe_ref(slice s) asm "SKIPOPTREF";

(slice, int) ~load_bool(slice s) inline {
    return s.load_int(1);
}

builder store_bool(builder b, int value) inline {
    return b.store_int(value, 1);
}

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline {
    return b.store_uint(0, 2);
}

slice address_none() asm "<b 0 2 u, b> <s PUSHSLICE";

int is_address_none(slice s) inline {
    return s.preload_uint(2) == 0;
}

;; MESSAGE

;; The message header info is organized as follows:

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L126
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddressInt dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfo;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L135
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddress dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;


;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L123C1-L124C33
;; currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;

;; MSG FLAGS

const int BOUNCEABLE = 0x18; ;; 0b011000 tag - 0, ihr_disabled - 1, bounce - 1, bounced - 0, src = adr_none$00
const int NON_BOUNCEABLE = 0x10; ;; 0b010000 tag - 0, ihr_disabled - 1, bounce - 0, bounced - 0, src = adr_none$00

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flags) inline {
    return b.store_uint(msg_flags, 6);
}

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline {
    return s.load_uint(4);
}
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline {
    return msg_flags & 1;
}

(slice, ()) ~skip_bounced_prefix(slice s) inline {
    return (s.skip_bits(32), ()); ;; skip 0xFFFFFFFF prefix
}

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS = 1 + 4 + 4 + 64 + 32;

;; MSG

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L155
;; message$_ {X:Type} info:CommonMsgInfo
;;  init:Maybe (Either StateInit ^StateInit)
;;  body:(Either X ^X) = Message X;
;;
;;message$_ {X:Type} info:CommonMsgInfoRelaxed
;;  init:(Maybe (Either StateInit ^StateInit))
;;  body:(Either X ^X) = MessageRelaxed X;
;;
;;_ (Message Any) = MessageAny;

;; if have StateInit (always place StateInit in ref):
;; 0b11 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1 + 1;
const int MSG_HAVE_STATE_INIT = 4;
const int MSG_STATE_INIT_IN_REF = 2;
const int MSG_BODY_IN_REF = 1;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1;

builder store_statinit_ref_and_body_ref(builder b, cell state_init, cell body) inline {
    return b
    .store_uint(MSG_HAVE_STATE_INIT + MSG_STATE_INIT_IN_REF + MSG_BODY_IN_REF, MSG_WITH_STATE_INIT_AND_BODY_SIZE)
    .store_ref(state_init)
    .store_ref(body);
}

builder store_only_body_ref(builder b, cell body) inline {
    return b
    .store_uint(MSG_BODY_IN_REF, MSG_ONLY_BODY_SIZE)
    .store_ref(body);
}

builder store_prefix_only_body(builder b) inline {
    return b
    .store_uint(0, MSG_ONLY_BODY_SIZE);
}

;; parse after sender_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline {
    in_msg_full_slice~load_msg_addr(); ;; skip dst
    in_msg_full_slice~load_coins(); ;; skip value
    in_msg_full_slice~skip_dict(); ;; skip extracurrency collection
    in_msg_full_slice~load_coins(); ;; skip ihr_fee
    int fwd_fee = in_msg_full_slice~load_coins();
    return (in_msg_full_slice, fwd_fee);
}

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE = 32;
const int MSG_QUERY_ID_SIZE = 64;

(slice, int) ~load_op(slice s) inline {
    return s.load_uint(MSG_OP_SIZE);
}
(slice, ()) ~skip_op(slice s) inline {
    return (s.skip_bits(MSG_OP_SIZE), ());
}
builder store_op(builder b, int op) inline {
    return b.store_uint(op, MSG_OP_SIZE);
}

(slice, int) ~load_query_id(slice s) inline {
    return s.load_uint(MSG_QUERY_ID_SIZE);
}
(slice, ()) ~skip_query_id(slice s) inline {
    return (s.skip_bits(MSG_QUERY_ID_SIZE), ());
}
builder store_query_id(builder b, int query_id) inline {
    return b.store_uint(query_id, MSG_QUERY_ID_SIZE);
}

(slice, (int, int)) ~load_op_and_query_id(slice s) inline {
    int op = s~load_op();
    int query_id = s~load_query_id();
    return (s, (op, query_id));
}

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the sending amount; action phase should NOT be ignored.
const int SEND_MODE_REGULAR = 0;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE_PAY_FEES_SEPARATELY = 1;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE_IGNORE_ERRORS = 2;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE_DESTROY = 32;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE_CARRY_ALL_BALANCE = 128;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_BOUNCE_ON_ACTION_FAIL = 16;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_ESTIMATE_FEE_ONLY = 1024;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST = 2;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte
(cell, ()) ~set_token_snake_metadata_entry(cell content_dict, int key, slice value) impure {
    content_dict~udict_set_ref(256, key, begin_cell().store_uint(0, 8).store_slice(value).end_cell());
    return (content_dict, ());
}

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline {
    return begin_cell().store_uint(0, 8).store_dict(content_dict).end_cell();
}


================================================
FILE: src/benchmarks/notcoin/func/workchain.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/func/workchain.fc
================================================
#include "stdlib-custom.fc";
#include "op-codes.fc";

const MY_WORKCHAIN = BASECHAIN;

int is_same_workchain(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);
    return wc == MY_WORKCHAIN;
}

() check_same_workchain(slice addr) impure inline {
    throw_unless(error::wrong_workchain, is_same_workchain(addr));
}


================================================
FILE: src/benchmarks/notcoin/tact/messages.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/tact/messages.tact
================================================
struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    jettonWalletCode: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

struct MaybeAddress {
    address: Address?;
}

message(0xcb862902) JettonUpdateContent {
    queryId: Int as uint64;
    content: Cell;
}

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x178d4519) JettonTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x7362d09c) JettonNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    customPayload: Cell?;
}

message(0x7bdd97de) JettonBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address;
}

message(0xd53276db) JettonExcesses {
    queryId: Int as uint64;
}

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}

message(0xd1735400) TakeWalletAddress {
    queryId: Int as uint64;
    walletAddress: Address;
    ownerAddress: Cell?; //It is Maybe ^Address, just encoded it like this
}

message(21) Mint {
    queryId: Int as uint64;
    receiver: Address;
    tonAmount: Int as coins;
    mintMessage: JettonTransferInternal;
}

message(3) ChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}

// notcoin
message(0xd372158c) TopUp {
    queryId: Int as uint64;
}

message(0x6501f354) ChangeAdmin {
    queryId: Int as uint64;
    nextAdmin: Address;
}

message(0xfb88e119) ClaimAdmin {
    queryId: Int as uint64;
}

message(0x7431f221) DropAdmin {
    queryId: Int as uint64;
}



================================================
FILE: src/benchmarks/notcoin/tact/minter.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/tact/minter.tact
================================================
import "./messages";
import "./wallet";

const Workchain: Int = 0;

struct JettonMasterState {
    totalSupply: Int as coins;
    mintable: Bool;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
}

contract JettonMinterNotcoin(
    totalSupply: Int as coins,
    owner: Address,
    nextOwner: Address,
    jettonContent: Cell,
) {
    receive(msg: JettonBurnNotification) {
        let sender = parseStdAddress(sender().asSlice());
        let wallet = getJettonBasechainWalletByOwner(msg.sender);

        throwUnless(74, sender.workchain == Workchain && sender.address == wallet.hash!!);

        self.totalSupply -= msg.amount;

        if (msg.responseDestination.isNotNone()) {
            message(MessageParameters {
                to: msg.responseDestination,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors, // ignore errors, because supply has already been updated
            });
        }
    }

    receive(msg: ProvideWalletAddress) {
        let ownerWorkchain: Int = parseStdAddress(msg.ownerAddress.asSlice()).workchain;

        let targetJettonWallet: BasechainAddress = (ownerWorkchain == Workchain)
            ? contractBasechainAddress(initOf JettonWalletNotcoin(0, msg.ownerAddress, myAddress()))
            : emptyBasechainAddress();

        message(MessageParameters {
            body: makeTakeWalletAddressMsg(targetJettonWallet, msg),
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendBounceIfActionFail,
        });
    }

    receive(msg: Mint) {
        let ctx = context();
        throwUnless(73, ctx.sender == self.owner);
        self.totalSupply += msg.mintMessage.amount;

        forceBasechain(msg.receiver);
        checkAmountIsEnoughToTransfer(ctx.value, msg.mintMessage.forwardTonAmount, ctx.readForwardFee());

        deploy(DeployParameters {
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: msg.mintMessage.toCell(),
            init: getJettonWalletInit(msg.receiver),
        });
    }

    receive(msg: JettonUpdateContent) {
        throwUnless(73, sender() == self.owner);
        self.jettonContent = msg.content;
    }

    receive(msg: ChangeAdmin) {
        throwUnless(73, sender() == self.owner);
        self.nextOwner = msg.nextAdmin;
    }

    receive(msg: ClaimAdmin) {
        throwUnless(73, sender() == self.nextOwner);
        self.owner = self.nextOwner;
        self.nextOwner = emptyAddress();
    }

    receive(msg: DropAdmin) {
        throwUnless(73, sender() == self.owner);
        self.owner = emptyAddress();
        self.nextOwner = emptyAddress();
    }

    // accept tons
    receive(msg: TopUp) {}

    receive(_: Slice) { throw(0xffff) }

    get fun get_jetton_data(): JettonMasterState {
        return JettonMasterState {
            totalSupply: self.totalSupply,
            mintable: true,
            adminAddress: self.owner,
            jettonContent: self.jettonContent,
            jettonWalletCode: codeOf JettonWalletNotcoin,
        };
    }

    get fun get_wallet_address(ownerAddress: Address): Address {
        return getJettonWalletByOwner(ownerAddress);
    }
}

asm fun emptyAddress(): Address { b{00} PUSHSLICE }

inline fun makeTakeWalletAddressMsg(targetJettonWallet: BasechainAddress, msg: ProvideWalletAddress): Cell {
    return beginCell()
        .storeUint(TakeWalletAddress.opcode(), 32)
        .storeUint(msg.queryId, 64)
        .storeBasechainAddress(targetJettonWallet)
        .storeMaybeRef(msg.includeAddress ? beginCell().storeAddress(msg.ownerAddress).endCell() : null)
        .endCell();
}

inline fun getJettonWalletInit(address: Address): StateInit {
    return initOf JettonWalletNotcoin(0, address, myAddress());
}

inline fun getJettonWalletByOwner(jettonWalletOwner: Address): Address {
    return contractAddress(getJettonWalletInit(jettonWalletOwner));
}

inline fun getJettonBasechainWalletByOwner(jettonWalletOwner: Address): BasechainAddress {
    return contractBasechainAddress(getJettonWalletInit(jettonWalletOwner));
}

inline extends fun isNotNone(self: Address): Bool { return self.asSlice().preloadUint(2) != 0 }



================================================
FILE: src/benchmarks/notcoin/tact/wallet.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/notcoin/tact/wallet.tact
================================================
import "./messages";

// gas
const SEND_TRANSFER_GAS_CONSUMPTION: Int = 10065;
const RECEIVE_TRANSFER_GAS_CONSUMPTION: Int = 10435;
const SEND_BURN_GAS_CONSUMPTION: Int = 5891;
const RECEIVE_BURN_GAS_CONSUMPTION: Int = 6757;

// storage
const MIN_STORAGE_DURATION: Int = 5 * 365 * 24 * 3600; // 5 years

const JETTON_WALLET_BITS: Int = 1033;
const JETTON_WALLET_CELLS: Int = 3;

const JETTON_WALLET_INIT_STATE_BITS: Int = 931;
const JETTON_WALLET_INIT_STATE_CELLS: Int = 3;

const BURN_NOTIFICATION_BITS: Int = 754;
const BURN_NOTIFICATION_CELLS: Int = 1;

asm fun getPrecompiledGasConsumption(): Int? { GETPRECOMPILEDGAS }

inline fun checkAmountIsEnoughToTransfer(msgValue: Int, forwardTonAmount: Int, fwdFee: Int) {
    let fwdCount = 1 + sign(forwardTonAmount);

    let precompiledGas = getPrecompiledGasConsumption();
    let sendGas = precompiledGas == null ? getComputeFee(SEND_TRANSFER_GAS_CONSUMPTION, false) : precompiledGas!!;
    let receiveGas = precompiledGas == null ? getComputeFee(RECEIVE_TRANSFER_GAS_CONSUMPTION, false) : precompiledGas!!;

    throwUnless(
        705,
        msgValue > fwdCount * fwdFee +
                   forwardTonAmount +
                   getSimpleForwardFee(JETTON_WALLET_INIT_STATE_CELLS, JETTON_WALLET_INIT_STATE_BITS, false) +
                   sendGas +
                   receiveGas +
                   getStorageFee(JETTON_WALLET_CELLS, JETTON_WALLET_BITS, MIN_STORAGE_DURATION, false),
    );
}

inline fun checkAmountIsEnoughToBurn(msgValue: Int) {
    let precompiledGas = getPrecompiledGasConsumption();

    let sendGas = precompiledGas == null ? getComputeFee(SEND_BURN_GAS_CONSUMPTION, false) : precompiledGas!!;
    let receiveGas = precompiledGas == null ? getComputeFee(RECEIVE_BURN_GAS_CONSUMPTION, false) : precompiledGas!!;

    throwUnless(
        705,
        msgValue >
        getForwardFee(BURN_NOTIFICATION_CELLS, BURN_NOTIFICATION_BITS, false) +
        sendGas +
        receiveGas,
    );
}

contract JettonWalletNotcoin(
    balance: Int as coins,
    owner: Address,
    master: Address,
) {
    receive(msg: JettonTransfer) {
        forceBasechain(msg.destination);
        throwUnless(705, sender() == self.owner);

        self.balance -= msg.amount;
        throwUnless(706, self.balance >= 0);
        throwUnless(708, msg.forwardPayload.bits() >= 1);

        let ctx = context();
        checkAmountIsEnoughToTransfer(ctx.value, msg.forwardTonAmount, ctx.readForwardFee());

        deploy(DeployParameters {
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonTransferInternal {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload,
            }.toCell(),
            init: initOf JettonWalletNotcoin(0, msg.destination, self.master),
        });
    }

    receive(msg: JettonTransferInternal) {
        self.balance += msg.amount;

        // This message should come only from master, or from other JettonWallet
        let wallet: StateInit = initOf JettonWalletNotcoin(0, msg.sender, self.master);
        if (!wallet.hasSameBasechainAddress(sender())) {
            throwUnless(707, self.master == sender());
        }

        if (msg.forwardTonAmount > 0) {
            message(MessageParameters {
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayFwdFeesSeparately,
                bounce: false,
                body: JettonNotification { // 0x7362d09c -- Remind the new Owner
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.sender,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }

        // 0xd53276db -- Cashback to the original Sender
        if (msg.responseDestination != null) {
            let leaveOnBalance: Int = myBalance() - context().value + myStorageDue();
            nativeReserve(
                max(leaveOnBalance, getStorageFee(JETTON_WALLET_CELLS, JETTON_WALLET_BITS, MIN_STORAGE_DURATION, false)),
                2,
            );

            message(MessageParameters {
                to: msg.responseDestination!!,
                value: 0,
                mode: SendRemainingBalance | SendIgnoreErrors,
                bounce: false,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
            });
        }
    }

    receive(msg: JettonBurn) {
        throwUnless(705, sender() == self.owner);

        self.balance -= msg.amount;
        throwUnless(706, self.balance >= 0);

        checkAmountIsEnoughToBurn(context().value);

        message(MessageParameters {
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonBurnNotification {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
            }.toCell(),
        });
    }

    receive(_: Slice) { throw(0xffff) }

    bounced(msg: bounced<JettonTransferInternal>) {
        self.balance += msg.amount;
    }

    bounced(msg: bounced<JettonBurnNotification>) {
        self.balance += msg.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData {
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            code: myCode(),
        };
    }
}



================================================
FILE: src/benchmarks/sbt/func/op-codes.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/sbt/func/op-codes.fc
================================================
int op::transfer() asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned() asm "0x05138d91 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::get_static_data() asm "0x2fcb26a2 PUSHINT";
int op::report_static_data() asm "0x8b771735 PUSHINT";
int op::get_royalty_params() asm "0x693d3950 PUSHINT";
int op::report_royalty_params() asm "0xa8cb00ad PUSHINT";

;; NFTEditable
int op::edit_content() asm "0x1a0b9d51 PUSHINT";
int op::transfer_editorship() asm "0x1c04412a PUSHINT";
int op::editorship_assigned() asm "0x511a4463 PUSHINT";

;; SBT
int op::request_owner() asm "0xd0c3bfea PUSHINT";
int op::owner_info() asm "0x0dd607e3 PUSHINT";

int op::prove_ownership() asm "0x04ded148 PUSHINT";
int op::ownership_proof() asm "0x0524c7ae PUSHINT";
int op::ownership_proof_bounced() asm "0xc18e86d2 PUSHINT";

int op::destroy() asm "0x1f04537a PUSHINT";
int op::revoke() asm "0x6f89f5e3 PUSHINT";
int op::take_excess() asm "0xd136d3b3 PUSHINT";

int jetton::transfer_notification() asm "0x7362d09c PUSHINT";
int jetton::transfer() asm "0xf8a7ea5 PUSHINT";



================================================
FILE: src/benchmarks/sbt/func/params.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/sbt/func/params.fc
================================================
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}

slice null_addr() asm "b{00} PUSHSLICE";
int flag::regular() asm "0x10 PUSHINT";
int flag::bounce() asm "0x8 PUSHINT";



================================================
FILE: src/benchmarks/sbt/func/sbt-item.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/sbt/func/sbt-item.fc
================================================
#include "op-codes.fc";
#include "params.fc";

;;
;;  TON SBT Item Smart Contract
;;

int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  MsgAddressInt authority_address
;;  uint64 revoked_at
;;

global int storage::index;
global int init?;
global slice storage::collection_address;
global slice storage::owner_address;
global slice storage::authority_address;
global cell storage::content;
global int storage::revoked_at;

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::index              = ds~load_uint(64);
    storage::collection_address = ds~load_msg_addr();
    init?                       = false;

    if (ds.slice_bits() > 0) {
        init?                      = true;
        storage::owner_address     = ds~load_msg_addr();
        storage::content           = ds~load_ref();
        storage::authority_address = ds~load_msg_addr();
        storage::revoked_at        = ds~load_uint(64);
    }
}

() store_data() impure {
    set_data(
        begin_cell()
            .store_uint(storage::index, 64)
            .store_slice(storage::collection_address)
            .store_slice(storage::owner_address)
            .store_ref(storage::content)
            .store_slice(storage::authority_address)
            .store_uint(storage::revoked_at, 64)
            .end_cell()
    );
}

() send_msg(int flag, slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
    var body = begin_cell().store_uint(op, 32).store_uint(query_id, 64);
    if (~ builder_null?(payload)) {
        body = body.store_builder(payload);
    }

    var msg = begin_cell()
        .store_uint(flag, 6)
        .store_slice(to_address)
        .store_coins(amount)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(body.end_cell());

    send_raw_message(msg.end_cell(), send_mode);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    slice sender_address = cs~load_msg_addr();

    load_data();

    if (~ init?) {
        throw_unless(405, equal_slices_bits(storage::collection_address, sender_address));

        storage::owner_address     = in_msg_body~load_msg_addr();
        storage::content           = in_msg_body~load_ref();
        storage::authority_address = in_msg_body~load_msg_addr();
        storage::revoked_at        = 0;

        store_data();
        return ();
    }

    int op = in_msg_body~load_uint(32);

    if (flags & 1) { ;; route all prove_ownership bounced messages to owner
        ;; first op was 0xffffffff, because of bounced, now we need to read real one
        op = in_msg_body~load_uint(32);

        if (op == op::ownership_proof()) {
            int query_id = in_msg_body~load_uint(64);
            ;; mode 64 = carry all the remaining value of the inbound message
            send_msg(flag::regular(), storage::owner_address, 0, op::ownership_proof_bounced(), query_id, null(), 64);
        }
        return ();
    }

    int query_id = in_msg_body~load_uint(64);

    if (op == op::request_owner()) {
        slice dest = in_msg_body~load_msg_addr();
        cell body = in_msg_body~load_ref();
        int with_content = in_msg_body~load_uint(1);

        var msg = begin_cell()
            .store_uint(storage::index, 256)
            .store_slice(sender_address)
            .store_slice(storage::owner_address)
            .store_ref(body)
            .store_uint(storage::revoked_at, 64)
            .store_uint(with_content, 1);

        if (with_content != 0) {
            msg = msg.store_ref(storage::content);
        }

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular() | flag::bounce(), dest, 0, op::owner_info(), query_id, msg, 64);
        return ();
    }
    if (op == op::prove_ownership()) {
        throw_unless(401, equal_slices_bits(storage::owner_address, sender_address));

        slice dest = in_msg_body~load_msg_addr();
        cell body = in_msg_body~load_ref();
        int with_content = in_msg_body~load_uint(1);

        var msg = begin_cell()
            .store_uint(storage::index, 256)
            .store_slice(storage::owner_address)
            .store_ref(body)
            .store_uint(storage::revoked_at, 64)
            .store_uint(with_content, 1);

        if (with_content != 0) {
            msg = msg.store_ref(storage::content);
        }

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular() | flag::bounce(), dest, 0, op::ownership_proof(), query_id, msg, 64);
        return ();
    }
    if (op == op::get_static_data()) {
        var msg = begin_cell().store_uint(storage::index, 256).store_slice(storage::collection_address);

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular(), sender_address, 0, op::report_static_data(), query_id, msg, 64);
        return ();
    }
    if (op == op::destroy()) {
        throw_unless(401, equal_slices_bits(storage::owner_address, sender_address));

        send_msg(flag::regular(), sender_address, 0, op::excesses(), query_id, null(), 128);

        storage::owner_address = null_addr();
        storage::authority_address = null_addr();
        store_data();
        return ();
    }
    if (op == op::revoke()) {
        throw_unless(401, equal_slices_bits(storage::authority_address, sender_address));
        throw_unless(403, storage::revoked_at == 0);

        storage::revoked_at = now();
        store_data();
        return ();
    }
    if (op == op::take_excess()) {
        throw_unless(401, equal_slices_bits(storage::owner_address, sender_address));

        ;; reserve amount for storage
        raw_reserve(min_tons_for_storage(), 0);

        send_msg(flag::regular(), sender_address, 0, op::excesses(), query_id, null(), 128);
        return ();
    }
    if (op == op::transfer()) {
        throw(413);
    }
    throw(0xffff);
}

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
    load_data();
    return (init?, storage::index, storage::collection_address, storage::owner_address, storage::content);
}

slice get_authority_address() method_id {
    load_data();
    return storage::authority_address;
}

int get_revoked_time() method_id {
    load_data();
    return storage::revoked_at;
}



================================================
FILE: src/benchmarks/sbt/tact/constants.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/sbt/tact/constants.tact
================================================
// ExitCodes
const IncorrectDeployer: Int = 405;
const InvalidMethod: Int = 413;

const AlreadyRevoked: Int = 403;
const IncorrectSender: Int = 401;
const InvalidData: Int = 65535; // not handled
const NotInit: Int = 9;

// GasConstants
const minTonsForStorage: Int = ton("0.05");



================================================
FILE: src/benchmarks/sbt/tact/item.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/sbt/tact/item.tact
================================================
import "./constants";
import "./messages";

struct SBTItemInit {
    owner: Address;
    content: Cell;
    authorityAddress: Address;
    revokedAt: Int as uint64;
}

contract SBTItem(
    itemIndex: Int as uint64,
    collectionAddress: Address,
    owner: Address?,
    content: Cell?,
    authorityAddress: Address?,
    revokedAt: Int as uint64,
) {
    receive() {} //to ignore empty messages

    receive(msg: Slice) {
        // Check if owner == null, which means the contract hasn't been initialized yet
        // owner is used as an initialization flag: if null - contract is not initialized,
        // if not null - contract has been initialized before
        // This prevents contract re-initialization since initialization should happen only once
        // We use similar checks in other methods (e.g., Transfer, GetStaticData) with throwUnless(NotInit, self.owner != null)
        // to ensure the contract is properly initialized before executing any operations
        throwUnless(InvalidData, self.owner == null);
        throwUnless(IncorrectDeployer, sender() == self.collectionAddress);

        let itemInit = SBTItemInit.fromSlice(msg);
        self.owner = itemInit.owner;
        self.content = itemInit.content;
        self.authorityAddress = itemInit.authorityAddress;
        self.revokedAt = itemInit.revokedAt;
    }

    receive(msg: RequestOwner) {
        throwUnless(NotInit, self.owner != null);

        let content: Cell? = msg.withContent ? self.content!! : null;

        let msgBody = RequestOwnerOut {
            queryId: msg.queryId,
            index: self.itemIndex,
            senderAddress: sender(),
            ownerAddress: self.owner!!,
            body: msg.body,
            revokedAt: self.revokedAt,
            content,
        };

        message(MessageParameters {
            to: msg.destination,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: msgBody.toCell(),
        });
    }

    receive(msg: ProveOwnership) {
        throwUnless(NotInit, null != self.owner);
        throwUnless(IncorrectSender, self.owner == sender());

        let content: Cell? = msg.withContent ? self.content!! : null;

        let msgBody = ProveOwnershipOut {
            queryId: msg.queryId,
            index: self.itemIndex,
            ownerAddress: self.owner!!,
            body: msg.body,
            revokedAt: self.revokedAt,
            content,
        };

        message(MessageParameters {
            to: msg.destination,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: msgBody.toCell(),
        });
    }

    bounced(msg: bounced<ProveOwnershipOut>) {
        message(MessageParameters {
            to: self.owner!!,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: ProveOwnershipBounced {
                queryId: msg.queryId,
            }.toCell(),
        });
    }

    receive(msg: GetStaticData) {
        throwUnless(NotInit, self.owner != null);

        let msgBody = ReportStaticData {
            queryId: msg.queryId,
            index: self.itemIndex,
            collectionAddress: self.collectionAddress,
        };

        message(MessageParameters {
            bounce: false,
            to: sender(),
            value: 0,
            body: msgBody.toCell(),
            mode: SendRemainingValue,
        });
    }

    receive(msg: TakeExcess) {
        throwUnless(NotInit, self.owner != null);
        throwUnless(IncorrectSender, self.owner == sender());

        nativeReserve(minTonsForStorage, ReserveExact);

        let msgBody = ExcessOut { queryId: msg.queryId };

        message(MessageParameters {
            bounce: false,
            to: sender(),
            value: 0,
            body: msgBody.toCell(),
            mode: SendRemainingBalance,
        });
    }

    receive(msg: Destroy) {
        throwUnless(NotInit, self.owner != null);
        throwUnless(IncorrectSender, self.owner == sender());

        let msgBody = ExcessOut { queryId: msg.queryId };

        message(MessageParameters {
            bounce: false,
            to: sender(),
            value: 0,
            body: msgBody.toCell(),
            mode: SendRemainingBalance,
        });

        self.owner = null;
        self.authorityAddress = null;
    }

    receive(msg: Revoke) {
        throwUnless(NotInit, self.owner != null);
        throwUnless(IncorrectSender, self.authorityAddress == sender());
        throwUnless(AlreadyRevoked, self.revokedAt == 0);

        self.revokedAt = now();
    }

    receive(msg: Transfer) {
        throwUnless(NotInit, self.owner != null);
        throw(InvalidMethod);
    }

    get fun get_nft_data(): NFTData {
        return NFTData {
            init: self.owner != null ? -1 : 0, // -1 is true
            itemIndex: self.itemIndex,
            collectionAddress: self.collectionAddress,
            owner: self.owner,
            content: self.content,
        };
    }

    get fun get_authority_address(): Address? {
        return self.authorityAddress;
    }

    get fun get_revoked_time(): Int {
        return self.revokedAt;
    }
}



================================================
FILE: src/benchmarks/sbt/tact/messages.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/sbt/tact/messages.tact
================================================
message(0x5fcc3d14) Transfer {
    queryId: Int as uint64;
}

struct NFTData {
    init: Int;
    itemIndex: Int as uint64;
    collectionAddress: Address;
    owner: Address?;
    content: Cell?;
}

message(0xd0c3bfea) RequestOwner {
    queryId: Int as uint64;
    destination: Address;
    body: Cell;
    withContent: Bool;
}

message(0x0dd607e3) RequestOwnerOut {
    queryId: Int as uint64;
    index: Int as uint256;
    senderAddress: Address;
    ownerAddress: Address;
    body: Cell;
    revokedAt: Int as uint64;
    content: Cell?;
}

message(0x04ded148) ProveOwnership {
    queryId: Int as uint64;
    destination: Address;
    body: Cell;
    withContent: Bool;
}

message(0x0524c7ae) ProveOwnershipOut {
    queryId: Int as uint64;
    index: Int as uint256;
    ownerAddress: Address;
    body: Cell;
    revokedAt: Int as uint64;
    content: Cell?;
}

message(0xc18e86d2) ProveOwnershipBounced {
    queryId: Int as uint64;
}

message(0x2fcb26a2) GetStaticData {
    queryId: Int as uint64;
}

message(0x8b771735) ReportStaticData {
    queryId: Int as uint64;
    index: Int as uint256;
    collectionAddress: Address;
}

message(0xd136d3b3) TakeExcess {
    queryId: Int as uint64;
}

message(0xd53276db) ExcessOut {
    queryId: Int as uint64;
}

message(0x1f04537a) Destroy {
    queryId: Int as uint64;
}

message(0x6f89f5e3) Revoke {
    queryId: Int as uint64;
}



================================================
FILE: src/benchmarks/wallet-v4/func/wallet-v4.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/wallet-v4/func/wallet-v4.fc
================================================
;; Wallet smart contract with plugins

(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";
(cell, int) dict_add_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDB";
(cell, int) dict_delete?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDEL";

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
  var cs = in_msg_cell.begin_parse();
  var flags = cs~load_uint(4);  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  if (flags & 1) {
    ;; ignore all bounced messages
    return ();
  }
  if (in_msg.slice_bits() < 32) {
    ;; ignore simple transfers
    return ();
  }
  int op = in_msg~load_uint(32);
  if (op != 0x706c7567) & (op != 0x64737472) { ;; "plug" & "dstr"
    ;; ignore all messages not related to plugins
    return ();
  }
  slice s_addr = cs~load_msg_addr();
  (int wc, int addr_hash) = parse_std_addr(s_addr);
  slice wc_n_address = begin_cell().store_int(wc, 8).store_uint(addr_hash, 256).end_cell().begin_parse();
  var ds = get_data().begin_parse().skip_bits(32 + 32 + 256);
  var plugins = ds~load_dict();
  var (_, success?) = plugins.dict_get?(8 + 256, wc_n_address);
  if ~(success?) {
    ;; it may be a transfer
    return ();
  }
  int query_id = in_msg~load_uint(64);
  var msg = begin_cell();
  if (op == 0x706c7567) { ;; request funds

    (int r_toncoins, cell r_extra) = (in_msg~load_grams(), in_msg~load_dict());

    [int my_balance, _] = get_balance();
    throw_unless(80, my_balance - msg_value >= r_toncoins);

    msg = msg.store_uint(0x18, 6)
             .store_slice(s_addr)
             .store_grams(r_toncoins)
             .store_dict(r_extra)
             .store_uint(0, 4 + 4 + 64 + 32 + 1 + 1)
             .store_uint(0x706c7567 | 0x80000000, 32)
             .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 64);

  }

  if (op == 0x64737472) { ;; remove plugin by its request

    plugins~dict_delete?(8 + 256, wc_n_address);
    var ds = get_data().begin_parse().first_bits(32 + 32 + 256);
    set_data(begin_cell().store_slice(ds).store_dict(plugins).end_cell());
    ;; return coins only if bounce expected
    if (flags & 2) {
      msg = msg.store_uint(0x18, 6)
               .store_slice(s_addr)
               .store_grams(0)
               .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
               .store_uint(0x64737472 | 0x80000000, 32)
               .store_uint(query_id, 64);
      send_raw_message(msg.end_cell(), 64);
    }
  }
}

() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512);
  var cs = in_msg;
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
  throw_if(36, valid_until <= now());
  var ds = get_data().begin_parse();
  var (stored_seqno, stored_subwallet, public_key, plugins) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256), ds~load_dict());
  ds.end_parse();
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  accept_message();
  set_data(begin_cell()
    .store_uint(stored_seqno + 1, 32)
    .store_uint(stored_subwallet, 32)
    .store_uint(public_key, 256)
    .store_dict(plugins)
    .end_cell());
  commit();
  cs~touch();
  int op = cs~load_uint(8);

  if (op == 0) { ;; simple send
    while (cs.slice_refs()) {
      var mode = cs~load_uint(8);
      send_raw_message(cs~load_ref(), mode);
    }
    return (); ;; have already saved the storage
  }

  if (op == 1) { ;; deploy and install plugin
    int plugin_workchain = cs~load_int(8);
    int plugin_balance = cs~load_grams();
    (cell state_init, cell body) = (cs~load_ref(), cs~load_ref());
    int plugin_address = cell_hash(state_init);
    slice wc_n_address = begin_cell().store_int(plugin_workchain, 8).store_uint(plugin_address, 256).end_cell().begin_parse();
    var msg = begin_cell()
      .store_uint(0x18, 6)
      .store_uint(4, 3).store_slice(wc_n_address)
      .store_grams(plugin_balance)
      .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
      .store_ref(state_init)
      .store_ref(body);
    send_raw_message(msg.end_cell(), 3);
    (plugins, int success?) = plugins.dict_add_builder?(8 + 256, wc_n_address, begin_cell());
    throw_unless(39, success?);
  }

  if (op == 2) { ;; install plugin
    slice wc_n_address = cs~load_bits(8 + 256);
    int amount = cs~load_grams();
    int query_id = cs~load_uint(64);

    (plugins, int success?) = plugins.dict_add_builder?(8 + 256, wc_n_address, begin_cell());
    throw_unless(39, success?);

    builder msg = begin_cell()
      .store_uint(0x18, 6)
      .store_uint(4, 3).store_slice(wc_n_address)
      .store_grams(amount)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(0x6e6f7465, 32) ;; op
      .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 3);
  }

  if (op == 3) { ;; remove plugin
    slice wc_n_address = cs~load_bits(8 + 256);
    int amount = cs~load_grams();
    int query_id = cs~load_uint(64);

    (plugins, int success?) = plugins.dict_delete?(8 + 256, wc_n_address);
    throw_unless(39, success?);

    builder msg = begin_cell()
      .store_uint(0x18, 6)
      .store_uint(4, 3).store_slice(wc_n_address)
      .store_grams(amount)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(0x64737472, 32) ;; op
      .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 3);
  }

  set_data(begin_cell()
    .store_uint(stored_seqno + 1, 32)
    .store_uint(stored_subwallet, 32)
    .store_uint(public_key, 256)
    .store_dict(plugins)
    .end_cell());
}

;; Get methods

int seqno() method_id {
  return get_data().begin_parse().preload_uint(32);
}

int get_subwallet_id() method_id {
  return get_data().begin_parse().skip_bits(32).preload_uint(32);
}

int get_public_key() method_id {
  var cs = get_data().begin_parse().skip_bits(64);
  return cs.preload_uint(256);
}

int is_plugin_installed(int wc, int addr_hash) method_id {
  var ds = get_data().begin_parse().skip_bits(32 + 32 + 256);
  var plugins = ds~load_dict();
  var (_, success?) = plugins.dict_get?(8 + 256, begin_cell().store_int(wc, 8).store_uint(addr_hash, 256).end_cell().begin_parse());
  return success?;
}

tuple get_plugin_list() method_id {
  var list = null();
  var ds = get_data().begin_parse().skip_bits(32 + 32 + 256);
  var plugins = ds~load_dict();
  do {
    var (wc_n_address, _, f) = plugins~dict::delete_get_min(8 + 256);
    if (f) {
      (int wc, int addr) = (wc_n_address~load_int(8), wc_n_address~load_uint(256));
      list = cons(pair(wc, addr), list);
    }
  } until (~ f);
  return list;
}



================================================
FILE: src/benchmarks/wallet-v4/tact/wallet-v4.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/wallet-v4/tact/wallet-v4.tact
================================================
message(0x64737472) RemovePlugin {
    queryId: Int as uint64;
}

message(0x706c7567) PluginRequestFunds {
    queryId: Int as uint64;
    amount: Int as coins;
    extra: Cell?;
}

struct ExtRequest {
    bundle: SignedBundle;
    walletId: Int as int32;
    validUntil: Int as uint32;
    seqno: Int as uint32;
    op: Int as uint8;
    payload: Slice as remaining;
}

struct RawMsg {
    bits: Int as uint6 = 0x18;
    receiver: Address;
    amount: Int as coins;
    extra: Cell?;
    bits2: Int as uint106 = 0; // 4 + 4 + 64 + 32 + 1 + 1
    op: Int as uint32;
    queryId: Int as uint64;
}

struct RawMsgWithDeploy {
    bits: Int as uint6 = 0x18;
    receiver: Address;
    amount: Int as coins;
    bits2: Int as uint108 = 4 + 2 + 1; // 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1
    stateInit: Cell;
    body: Cell;
}

struct DeployPlugin {
    wc: Int as uint8;
    amount: Int as coins;
    stateInit: Cell;
    body: Cell;
}

struct AddPlugin {
    wc: Int as uint8;
    addrHash: Int as uint256;
    amount: Int as coins;
    queryId: Int as uint64;
}

struct RemovePluginStruct {
    wc: Int as uint8;
    addrHash: Int as uint256;
    amount: Int as coins;
    queryId: Int as uint64;
}

// Exit codes
const LowBalance: Int = 80;
const Expired: Int = 36;
const SeqnoMismatch: Int = 33;
const WalletIdMismatch: Int = 34;
const SignatureMismatch: Int = 35;
const PluginWasNotDeleted: Int = 39;

// Op
const PluginTakeFunds: Int = 0x706c7567 | 0x80000000;
const PluginRemove: Int = 0x64737472 | 0x80000000;
const AddPluginAction: Int = 0x6e6f7465;
const RemovePluginAction: Int = 0x64737472;

contract WalletV4(
    seqno: Int as uint32,
    walletId: Int as int32,
    publicKey: Int as uint256,
    extensions: map<Address, Bool>,
) {
    receive(msg: PluginRequestFunds) {
        let addr = sender(); // check gas for ctx

        if (!self.extensions.exists(addr)) {
            return;
        }

        throwUnless(LowBalance, myBalance() - context().value >= msg.amount);

        // NOTE: Here and later we use RawMsg with sendRawMessage because
        // in v4 wallet implementation message bodies are stored as slices in the same cell
        // instead of separate cell with ref. Our send built-ins (message, send) doesn't support such serialization
        sendRawMessage(
            RawMsg {
                queryId: msg.queryId,
                op: PluginTakeFunds,
                extra: msg.extra,
                amount: msg.amount,
                receiver: addr,
            }.toCell(),
            64,
        );
    }

    receive(msg: RemovePlugin) {
        let addr = sender(); // check gas for ctx

        if (!self.extensions.exists(addr)) {
            return;
        }

        let _ = self.extensions.del(addr);

        if (context().bounceable) {
            sendRawMessage(
                RawMsg {
                    queryId: msg.queryId,
                    op: PluginRemove,
                    extra: null,
                    amount: 0,
                    receiver: addr,
                }.toCell(),
                64,
            );
        }
    }

    external(msgSlice: Slice) {
        let msg = ExtRequest.fromSlice(msgSlice);
        throwIf(Expired, msg.validUntil < now());
        throwUnless(SeqnoMismatch, msg.seqno == self.seqno);
        throwUnless(WalletIdMismatch, msg.walletId == self.walletId);
        throwUnless(SignatureMismatch, msg.bundle.verifySignature(self.publicKey));

        acceptMessage();
        self.seqno += 1;
        setData(self.toCell());
        commit();

        // simple transfer
        if (msg.op == 0) {
            let payload = msg.payload;
            /*
            foreach (ref in payload.refs) {
                let mode = payload.loadUint(8);
                sendRawMessage(ref, mode);
            }
            */

            while (payload.refs() != 0) {
                let mode = payload.loadUint(8);
                sendRawMessage(payload.loadRef(), mode);
            }

            // throw(0) is idiom to successfully exit current transaction without saving state
            throw(0);
        }

        // deploy and add plugin
        if (msg.op == 1) {
            let deployPlugin = DeployPlugin.fromSlice(msg.payload);

            let addr = newAddress(deployPlugin.wc, deployPlugin.stateInit.hash());
            // can't use deploy here because of only basechain support
            sendRawMessage(
                RawMsgWithDeploy {
                    stateInit: deployPlugin.stateInit,
                    body: deployPlugin.body,
                    amount: deployPlugin.amount,
                    receiver: addr,
                }.toCell(),
                3,
            );

            self.extensions.set(addr, true);
        } else if (msg.op == 2) {
            let addPlugin = AddPlugin.fromSlice(msg.payload);

            let addr = newAddress(addPlugin.wc, addPlugin.addrHash);

            self.extensions.set(addr, true);

            sendRawMessage(
                RawMsg {
                    queryId: addPlugin.queryId,
                    op: AddPluginAction,
                    extra: null,
                    amount: addPlugin.amount,
                    receiver: addr,
                }.toCell(),
                64,
            );
        } else if (msg.op == 3) {
            // remove plugin
            let removePlugin = RemovePluginStruct.fromSlice(msg.payload);

            let addr = newAddress(removePlugin.wc, removePlugin.addrHash);
            throwUnless(PluginWasNotDeleted, self.extensions.del(addr));

            sendRawMessage(
                RawMsg {
                    queryId: removePlugin.queryId,
                    op: RemovePluginAction,
                    extra: null,
                    amount: removePlugin.amount,
                    receiver: addr,
                }.toCell(),
                64,
            );
        }
    }

    receive(_: Slice) {
        // Fallback
    }

    get fun seqno(): Int {
        return self.seqno;
    }

    get fun get_subwallet_id(): Int {
        return self.walletId;
    }

    get fun get_public_key(): Int {
        return self.publicKey;
    }

    get fun is_plugin_installed(wc: Int, hash: Int): Bool {
        return self.extensions.exists(newAddress(wc, hash));
    }

    // this is different from FunC version, awaiting unbounded tuple impl in Tact
    // also we need to return it as map of <wc, hash> instead of Address (skip first 4 bytes)
    get fun get_plugin_list(): map<Address, Bool> {
        return self.extensions;
    }
}



================================================
FILE: src/benchmarks/wallet-v5/func/wallet-v5.fc
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/wallet-v5/func/wallet-v5.fc
================================================
const int error::signature_disabled = 132;
const int error::invalid_seqno = 133;
const int error::invalid_wallet_id = 134;
const int error::invalid_signature = 135;
const int error::expired = 136;
const int error::external_send_message_must_have_ignore_errors_send_mode = 137;
const int error::invalid_message_operation = 138;
const int error::add_extension = 139;
const int error::remove_extension = 140;
const int error::unsupported_action = 141;
const int error::disable_signature_when_extensions_is_empty = 142;
const int error::this_signature_mode_already_set = 143;
const int error::remove_last_extension_when_signature_disabled = 144;
const int error::extension_wrong_workchain = 145;
const int error::only_extension_can_change_signature_mode = 146;
const int error::invalid_c5 = 147;

const int size::bool = 1;
const int size::seqno = 32;
const int size::wallet_id = 32;
const int size::public_key = 256;
const int size::valid_until = 32;
const int size::message_flags = 4;
const int size::signature = 512;
const int size::message_operation_prefix = 32;
const int size::address_hash_size = 256;
const int size::query_id = 64;

const int prefix::signed_external = 0x7369676E;
const int prefix::signed_internal = 0x73696E74;
const int prefix::extension_action = 0x6578746E;

(slice, int) check_and_remove_add_extension_prefix(slice body) impure asm "x{02} SDBEGINSQ";
(slice, int) check_and_remove_remove_extension_prefix(slice body) impure asm "x{03} SDBEGINSQ";
(slice, int) check_and_remove_set_signature_allowed_prefix(slice body) impure asm "x{04} SDBEGINSQ";

;;; returns the number of trailing zeroes in slice s.
int count_trailing_zeroes(slice s) asm "SDCNTTRAIL0";

;;; returns the last 0 ≤ l ≤ 1023 bits of s.
slice get_last_bits(slice s, int l) asm "SDCUTLAST";
;;; returns all but the last 0 ≤ l ≤ 1023 bits of s.
slice remove_last_bits(slice s, int l) asm "SDSKIPLAST";

;; `action_send_msg` has 0x0ec3c86d prefix
;; https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/block.tlb#L380
slice enforce_and_remove_action_send_msg_prefix(slice body) impure asm "x{0ec3c86d} SDBEGINS";

;;; put raw list of OutActions to C5 register.
;;; OutList TLB-schema - https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/block.tlb#L378
;;; C5 register - https://docs.ton.org/tvm.pdf, page 11
() set_c5_actions(cell action_list) impure asm "c5 POP";

;;; transforms an ordinary or exotic cell into a Slice, as if it were an ordinary cell. A flag is returned indicating whether c is exotic. If that be the case, its type can later be deserialized from the first eight bits of s.
(slice, int) begin_parse_raw(cell c) asm "XCTOS";

cell verify_c5_actions(cell c5, int is_external) inline {
  ;; XCTOS doesn't automatically load exotic cells (unlike CTOS `begin_parse`).
  ;; we use it in `verify_c5_actions` because during action phase processing exotic cells in c5 won't be unfolded too.
  ;; exotic cell starts with 0x02, 0x03 or 0x04 so it will not pass action_send_msg prefix check
  (slice cs, _) = c5.begin_parse_raw();

  int count = 0;

  while (~ cs.slice_empty?()) {
    ;; only `action_send_msg` is allowed; `action_set_code`, `action_reserve_currency` or `action_change_library` are not.
    cs = cs.enforce_and_remove_action_send_msg_prefix();

    throw_unless(error::invalid_c5, cs.slice_bits() == 8); ;; send_mode uint8
    throw_unless(error::invalid_c5, cs.slice_refs() == 2); ;; next-action-ref and MessageRelaxed ref

    ;; enforce that send_mode has +2 bit (ignore errors) set for external message.
    ;; if such send_mode is not set and sending fails at the action phase (for example due to insufficient balance) then the seqno will not be increased and the external message will be processed again and again.

    ;; action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;
    ;; https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/block.tlb#L380
    ;; load 7 bits and make sure that they end with 1
    throw_if(error::external_send_message_must_have_ignore_errors_send_mode, is_external & (count_trailing_zeroes(cs.preload_bits(7)) > 0));

    (cs, _) = cs.preload_ref().begin_parse_raw();
    count += 1;
  }
  throw_unless(error::invalid_c5, count <= 255);
  throw_unless(error::invalid_c5, cs.slice_refs() == 0);

  return c5;
}

() process_actions(slice cs, int is_external, int is_extension) impure inline_ref {
  cell c5_actions = cs~load_maybe_ref();
  ifnot (cell_null?(c5_actions)) {
    ;; Simply set the C5 register with all pre-computed actions after verification:
    set_c5_actions(c5_actions.verify_c5_actions(is_external));
  }
  if (cs~load_int(1) == 0) { ;; has_other_actions
    return ();
  }

  ;; Loop extended actions
  while (true) {
    int is_add_extension = cs~check_and_remove_add_extension_prefix();
    int is_remove_extension = is_add_extension ? 0 : cs~check_and_remove_remove_extension_prefix();
    ;; Add/remove extensions
    if (is_add_extension | is_remove_extension) {
      (int address_wc, int address_hash) = parse_std_addr(cs~load_msg_addr());
      (int my_address_wc, _) = parse_std_addr(my_address());

      throw_unless(error::extension_wrong_workchain, my_address_wc == address_wc); ;; the extension must be in the same workchain as the wallet.

      slice data_slice = get_data().begin_parse();
      slice data_slice_before_extensions = data_slice~load_bits(size::bool + size::seqno + size::wallet_id + size::public_key);
      cell extensions = data_slice.preload_dict();

      ;; Add extension
      if (is_add_extension) {
        (extensions, int is_success) = extensions.udict_add_builder?(size::address_hash_size, address_hash, begin_cell().store_int(-1, 1));
        throw_unless( error::add_extension, is_success);
      } else { ;; Remove extension
        (extensions, int is_success) = extensions.udict_delete?(size::address_hash_size, address_hash);
        throw_unless(error::remove_extension, is_success);
        int is_signature_allowed = data_slice_before_extensions.preload_int(size::bool);
        throw_if(error::remove_last_extension_when_signature_disabled, null?(extensions) & (~ is_signature_allowed));
      }

      set_data(begin_cell()
              .store_slice(data_slice_before_extensions)
              .store_dict(extensions)
              .end_cell());

    } elseif (cs~check_and_remove_set_signature_allowed_prefix()) { ;; allow/disallow signature
      throw_unless(error::only_extension_can_change_signature_mode, is_extension);
      int allow_signature = cs~load_int(1);
      slice data_slice = get_data().begin_parse();
      int is_signature_allowed = data_slice~load_int(size::bool);
      throw_if(error::this_signature_mode_already_set, is_signature_allowed == allow_signature);
      is_signature_allowed = allow_signature;

      slice data_tail = data_slice; ;; seqno, wallet_id, public_key, extensions
      ifnot (allow_signature) { ;; disallow
        int is_extensions_not_empty = data_slice.skip_bits(size::seqno + size::wallet_id + size::public_key).preload_int(1);
        throw_unless(error::disable_signature_when_extensions_is_empty, is_extensions_not_empty);
      }

      set_data(begin_cell()
        .store_int(is_signature_allowed, size::bool)
        .store_slice(data_tail) ;; seqno, wallet_id, public_key, extensions
        .end_cell());
    } else {
      throw(error::unsupported_action);
    }
    ifnot (cs.slice_refs()) {
      return ();
    }
    cs = cs.preload_ref().begin_parse();
  }
}

;; ------------------------------------------------------------------------------------------------

() process_signed_request(slice in_msg_body, int is_external) impure inline {
  slice signature = in_msg_body.get_last_bits(size::signature);
  slice signed_slice = in_msg_body.remove_last_bits(size::signature);

  slice cs = signed_slice.skip_bits(size::message_operation_prefix); ;; skip signed_internal or signed_external prefix
  (int wallet_id, int valid_until, int seqno) = (cs~load_uint(size::wallet_id), cs~load_uint(size::valid_until), cs~load_uint(size::seqno));

  slice data_slice = get_data().begin_parse();
  int is_signature_allowed = data_slice~load_int(size::bool);
  int stored_seqno = data_slice~load_uint(size::seqno);
  slice data_tail = data_slice; ;; wallet_id, public_key, extensions
  int stored_wallet_id = data_slice~load_uint(size::wallet_id);
  int public_key = data_slice~load_uint(size::public_key);
  int is_extensions_not_empty = data_slice.preload_int(1);

  int is_signature_valid = check_signature(slice_hash(signed_slice), signature, public_key);
  ifnot (is_signature_valid) {
    if (is_external) {
      throw(error::invalid_signature);
    } else {
      return ();
    }
  }
  ;; In case the wallet application has initially, by mistake, deployed a contract with the wrong bit (signature is forbidden and extensions are empty) - we allow such a contract to work.
  throw_if(error::signature_disabled, (~ is_signature_allowed) & is_extensions_not_empty);
  throw_unless(error::invalid_seqno, seqno == stored_seqno);
  throw_unless(error::invalid_wallet_id, wallet_id == stored_wallet_id);
  throw_if(error::expired, valid_until <= now());

  if (is_external) {
    accept_message();
  }

  stored_seqno = stored_seqno + 1;
  set_data(begin_cell()
    .store_int(true, size::bool) ;; is_signature_allowed
    .store_uint(stored_seqno, size::seqno)
    .store_slice(data_tail) ;; wallet_id, public_key, extensions
    .end_cell());

  if (is_external) {
    ;; For external messages we commit seqno changes, so that even if an exception occurs further on, the reply-protection will still work.
    commit();
  }

  process_actions(cs, is_external, false);
}

() recv_external(slice in_msg_body) impure inline {
  throw_unless(error::invalid_message_operation, in_msg_body.preload_uint(size::message_operation_prefix) == prefix::signed_external);
  process_signed_request(in_msg_body, true);
}

;; ------------------------------------------------------------------------------------------------

() recv_internal(cell in_msg_full, slice in_msg_body) impure inline {
  if (in_msg_body.slice_bits() < size::message_operation_prefix) {
    return (); ;; just receive Toncoins
  }
  int op = in_msg_body.preload_uint(size::message_operation_prefix);
  if ((op != prefix::extension_action) & (op != prefix::signed_internal)) {
    return (); ;; just receive Toncoins
  }

  ;; bounced messages has 0xffffffff prefix and skipped by op check

  if (op == prefix::extension_action) {
    in_msg_body~skip_bits(size::message_operation_prefix);

    slice in_msg_full_slice = in_msg_full.begin_parse();
    in_msg_full_slice~skip_bits(size::message_flags);
    ;; Authenticate extension by its address.
    (int sender_address_wc, int sender_address_hash) = parse_std_addr(in_msg_full_slice~load_msg_addr());
    (int my_address_wc, _) = parse_std_addr(my_address());

    if (my_address_wc != sender_address_wc) {
      return ();
    }

    cell extensions = get_data().begin_parse()
      .skip_bits(size::bool + size::seqno + size::wallet_id + size::public_key)
      .preload_dict();

    ;; Note that some random contract may have deposited funds with this prefix,
    ;; so we accept the funds silently instead of throwing an error (wallet v4 does the same).
    (_, int extension_found) = extensions.udict_get?(size::address_hash_size, sender_address_hash);
    ifnot (extension_found) {
      return ();
    }

    in_msg_body~skip_bits(size::query_id); ;; skip query_id

    process_actions(in_msg_body, false, true);
    return ();

  }

  ;; Before signature checking we handle errors silently (return), after signature checking we throw exceptions.

  ;; Check to make sure that there are enough bits for reading before signature check
  if (in_msg_body.slice_bits() < size::message_operation_prefix + size::wallet_id + size::valid_until + size::seqno + size::signature) {
    return ();
  }
  process_signed_request(in_msg_body, false);
}

;; ------------------------------------------------------------------------------------------------
;; Get methods

int is_signature_allowed() method_id {
  return get_data().begin_parse()
    .preload_int(size::bool);
}

int seqno() method_id {
  return get_data().begin_parse()
    .skip_bits(size::bool)
    .preload_uint(size::seqno);
}

int get_subwallet_id() method_id {
  return get_data().begin_parse()
    .skip_bits(size::bool + size::seqno)
    .preload_uint(size::wallet_id);
}

int get_public_key() method_id {
  return get_data().begin_parse()
    .skip_bits(size::bool + size::seqno + size::wallet_id)
    .preload_uint(size::public_key);
}

;; Returns raw dictionary (or null if empty) where keys are address hashes. Workchains of extensions are same with wallet smart contract workchain.
cell get_extensions() method_id {
  return get_data().begin_parse()
    .skip_bits(size::bool + size::seqno + size::wallet_id + size::public_key)
    .preload_dict();
}


================================================
FILE: src/benchmarks/wallet-v5/tact/constants.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/wallet-v5/tact/constants.tact
================================================
// exit codes
const signatureDisabled: Int = 132;
const invalidSeqno: Int = 133;
const invalidWalletId: Int = 134;
const invalidSignature: Int = 135;
const expired: Int = 136;
const externalSendMessageMustHaveIgnoreErrorsSendMode: Int = 137;
const invalidMessageOperation: Int = 138;
const addExtension: Int = 139;
const removeExtension: Int = 140;
const unsupportedAction: Int = 141;
const disableSignatureWhenExtensionsIsEmpty: Int = 142;
const thisSignatureModeAlreadySet: Int = 143;
const removeLastExtensionWhenSignatureDisabled: Int = 144;
const extensionWrongWorkchain: Int = 145;
const onlyExtensionCanChangeSignatureMode: Int = 146;
const invalidC5: Int = 147;



================================================
FILE: src/benchmarks/wallet-v5/tact/wallet-v5.tact
URL: https://github.com/tact-lang/tact/blob/main/src/benchmarks/wallet-v5/tact/wallet-v5.tact
================================================
import "./constants";

message(0x7369676e) ExternalSignedRequest {
    walletId: Int as uint32;
    validUntil: Int as uint32;
    seqno: Int as uint32;
    outActions: Cell?;
    hasOtherActions: Bool;
    data: Slice as remaining;
}

message(0x73696e74) InternalSignedRequest {
    walletId: Int as uint32;
    validUntil: Int as uint32;
    seqno: Int as uint32;
    outActions: Cell?;
    hasOtherActions: Bool;
    data: Slice as remaining;
}

message(0x6578746e) InternalExtensionRequest {
    queryId: Int as uint64;
    actions: Slice as remaining;
}

contract WalletV5(
    isSignatureAllowed: Bool,
    seqno: Int as uint32,
    walletId: Int as int32,
    publicKey: Int as uint256,
    extensions: map<Int as uint256, Bool>,
) {
    receive(msg: InternalExtensionRequest) {
        let myAddr = parseStdAddress(myAddress().asSlice());
        let addr = parseStdAddress(sender().asSlice());

        // Before signature checking we handle errors silently (return), after signature checking we throw exceptions.
        if (addr.workchain != myAddr.workchain) {
            // throw(0) is idiom to successfully exit current continuation without saving state
            throw(0);
        }
        if (!self.extensions.exists(addr.address)) {
            throw(0);
        }

        self.processActions(msg.actions, false, true);
    }

    receive(msg: InternalSignedRequest) {
        let msgSlice = inMsg();
        let signature = msgSlice.lastBits(512);
        let signedSlice = msgSlice.skipLastBits(512);

        let isSignatureValid = checkSignature(signedSlice.hash(), signature, self.publicKey);
        if (!isSignatureValid) {
            throw(0);
        }

        throwIf(signatureDisabled, !self.isSignatureAllowed && self.extensions.isEmpty());
        throwUnless(invalidSeqno, msg.seqno == self.seqno);
        throwUnless(invalidWalletId, msg.walletId == self.walletId);
        throwIf(expired, msg.validUntil <= now());

        self.seqno += 1;
        commit();

        signedSlice.skipBits(32 + 32 + 32 + 32); // skip opcode, walletId, validUntil, seqno
        self.processActions(signedSlice, false, false);
    }

    receive(_: Slice) {
        // Fallback
    }

    external(msg: ExternalSignedRequest) {
        let msgSlice = inMsg();
        let signature = msgSlice.lastBits(512);
        let signedSlice = msgSlice.skipLastBits(512);

        let isSignatureValid = checkSignature(signedSlice.hash(), signature, self.publicKey);
        if (!isSignatureValid) {
            throw(135);
        }

        throwIf(signatureDisabled, !self.isSignatureAllowed && self.extensions.isEmpty());
        throwUnless(invalidSeqno, msg.seqno == self.seqno);
        throwUnless(invalidWalletId, msg.walletId == self.walletId);
        throwIf(expired, msg.validUntil <= now());

        acceptMessage();

        self.seqno += 1;
        setData(self.toCell());
        commit();

        signedSlice.skipBits(32 + 32 + 32 + 32); // skip opcode, walletId, validUntil, seqno
        self.processActions(signedSlice, true, false);
    }

    /// Actions has the following structure:
    ///
    /// ```tact
    /// struct Action {
    ///     outActions: Cell?;
    ///     hasOtherActions: Bool;
    ///     actions: Slice as remaining; // tl-b for ext actions
    /// }
    /// ```
    ///
    /// TL-B:
    ///
    /// ```tlb
    /// out_list_empty$_ = OutList 0;
    /// out_list$_ {n:#} prev:^(OutList n) action:OutAction = OutList (n + 1);
    /// action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;
    ///
    /// // Extended actions in W5:
    /// action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
    /// action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);
    ///
    /// action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
    /// action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
    /// action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;
    /// ```
    inline fun processActions(actions: Slice, isExternal: Bool, isExtension: Bool) {
        let outActions = actions.loadMaybeRef();
        if (outActions != null) {
            setC5(processSendMessages(outActions!!, isExternal));
        }

        if (!actions.loadBool()) {
            return;
        }

        while (true) {
            // check tag, process action, try to load next ref while we can
            let isAddExt = actions.checkAndRemoveAddExtensionPrefix();
            let isDeleteExt = isAddExt ? false : actions.checkAndRemoveDeleteExtensionPrefix();

            if (isAddExt || isDeleteExt) {
                let addr = parseStdAddress(actions.loadAddress().asSlice());
                let myAddr = parseStdAddress(myAddress().asSlice());

                throwUnless(extensionWrongWorkchain, addr.workchain == myAddr.workchain); // force_workchain optimization

                if (isAddExt) {
                    // blocked by https://github.com/tact-lang/tact/issues/2842
                    // throwUnless(139, self.extensions.add(addr.address, true));
                    throwIf(addExtension, self.extensions.exists(addr.address));
                    self.extensions.set(addr.address, true);
                } else if (isDeleteExt) {
                    throwUnless(removeExtension, self.extensions.del(addr.address));
                    throwIf(removeLastExtensionWhenSignatureDisabled, self.extensions.isEmpty() && !self.isSignatureAllowed);
                }
            } else if (actions.checkAndRemoveSetSignAllowedPrefix()) {
                throwUnless(onlyExtensionCanChangeSignatureMode, isExtension);
                let newSignMode = actions.loadBool();
                throwIf(thisSignatureModeAlreadySet, newSignMode == self.isSignatureAllowed);
                self.isSignatureAllowed = newSignMode;

                if (!self.isSignatureAllowed && self.extensions.isEmpty()) {
                    throw(disableSignatureWhenExtensionsIsEmpty);
                }
            } else {
                throw(unsupportedAction);
            }

            if (actions.refsEmpty()) {
                return;
            }

            actions = actions.preloadRef().beginParse();
        }
    }

    get fun seqno(): Int {
        return self.seqno;
    }

    get fun get_subwallet_id(): Int {
        return self.walletId;
    }

    get fun get_public_key(): Int {
        return self.publicKey;
    }

    get fun get_extensions(): map<Int as uint256, Bool> {
        return self.extensions;
    }
}

inline fun processSendMessages(outActions: Cell, isExternal: Bool): Cell {
    let cs = outActions.beginParseExotic().data;
    let count = 0;

    while (!cs.empty()) {
        cs.enforceAndRemoveActionSendMsgPrefix();

        throwUnless(invalidC5, cs.bits() == 8);
        throwUnless(invalidC5, cs.refs() == 2);
        throwIf(externalSendMessageMustHaveIgnoreErrorsSendMode, isExternal && (countTrailingZeroes(cs.preloadBits(7)) > 0));

        cs = cs.preloadRef().beginParseExotic().data;
        count += 1;
    }

    throwUnless(invalidC5, count <= 255);
    throwUnless(invalidC5, cs.refs() == 0);

    return outActions;
}

asm fun countTrailingZeroes(s: Slice): Int { SDCNTTRAIL0 }
struct SliceFlag {
    data: Slice;
    flag: Bool;
}
asm extends fun beginParseExotic(self: Cell): SliceFlag { XCTOS }
asm extends mutates fun enforceAndRemoveActionSendMsgPrefix(self: Slice) { x{0ec3c86d} SDBEGINS }
asm fun setC5(outActions: Cell) { c5 POP }

asm extends mutates fun checkAndRemoveAddExtensionPrefix(self: Slice): Bool { x{02} SDBEGINSQ }
asm extends mutates fun checkAndRemoveDeleteExtensionPrefix(self: Slice): Bool { x{03} SDBEGINSQ }
asm extends mutates fun checkAndRemoveSetSignAllowedPrefix(self: Slice): Bool { x{04} SDBEGINSQ }



================================================
FILE: src/func/__testdata__/small.fc
URL: https://github.com/tact-lang/tact/blob/main/src/func/__testdata__/small.fc
================================================
int main(int a, int b) impure {
    return a + b;
}


================================================
FILE: src/func/stdlib/stdlib.fc
URL: https://github.com/tact-lang/tact/blob/main/src/func/stdlib/stdlib.fc
================================================
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorphism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vice versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm(-> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm(-> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^120 - 1`).
(slice, int) load_grams(slice s) asm(-> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm(-> 1 0) "LDVARUINT16";

(slice, int) load_varint16(slice s) asm(-> 1 0) "LDVARINT16";
(slice, int) load_varint32(slice s) asm(-> 1 0) "LDVARINT32";
(slice, int) load_varuint16(slice s) asm(-> 1 0) "LDVARUINT16";
(slice, int) load_varuint32(slice s) asm(-> 1 0) "LDVARUINT32";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm(-> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm(-> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^120 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STVARUINT16";

builder store_varint16(builder b, int x) asm "STVARINT16";
builder store_varint32(builder b, int x) asm "STVARINT32";
builder store_varuint16(builder b, int x) asm "STVARUINT16";
builder store_varuint32(builder b, int x) asm "STVARUINT32";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm(-> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, cell, int) idict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~idict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~udict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGETREF" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) udict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEREF";
(cell, slice, int) udict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACEGET" "NULLSWAPIFNOT";
(cell, cell, int) udict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEGETREF" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACEGET" "NULLSWAPIFNOT";
(cell, (cell, int)) ~udict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEGETREF" "NULLSWAPIFNOT";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
(cell, int) idict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEREF";
(cell, slice, int) idict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACEGET" "NULLSWAPIFNOT";
(cell, cell, int) idict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEGETREF" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACEGET" "NULLSWAPIFNOT";
(cell, (cell, int)) ~idict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEGETREF" "NULLSWAPIFNOT";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) dict_replace_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEB";
(cell, builder, int) dict_replaceget_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEGETB" "NULLSWAPIFNOT";
(cell, slice, int) dict_replaceget?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACEGET" "NULLSWAPIFNOT";
(cell, (builder, int)) ~dict_replaceget_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~dict_replaceget?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACEGET" "NULLSWAPIFNOT";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, builder, int) udict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEGETB" "NULLSWAPIFNOT";
(cell, (builder, int)) ~udict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEGETB" "NULLSWAPIFNOT";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, builder, int) idict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEGETB" "NULLSWAPIFNOT";
(cell, (builder, int)) ~idict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEGETB" "NULLSWAPIFNOT";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coincide
int equal_slices_bits(slice a, slice b) asm "SDEQ";
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
int builder_null?(builder b) asm "ISNULL";
;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7

cell my_code() asm "MYCODE";



================================================
FILE: src/grammar/test/1265-asm-instruction-no-whitespace-1.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/1265-asm-instruction-no-whitespace-1.tact
================================================
asm fun Bar(): Address { b{00} PUSHSLICE}

contract Foo { }


================================================
FILE: src/grammar/test/1265-asm-instruction-no-whitespace-2.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/1265-asm-instruction-no-whitespace-2.tact
================================================
asm fun push42(): Int {
    42 PUSHINT}
    
contract Foo { }



================================================
FILE: src/grammar/test/1265-asm-instruction-no-whitespace-3.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/1265-asm-instruction-no-whitespace-3.tact
================================================
asm fun Bar(): Int {-ROT ADD MUL}

contract Foo { }


================================================
FILE: src/grammar/test/332-abstract-const.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/332-abstract-const.tact
================================================
trait t {
    abstract const c: Int;
}




================================================
FILE: src/grammar/test/abstract-const-without-modifier.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/abstract-const-without-modifier.fail.tact
================================================
trait t {
    const c: Int;
}



================================================
FILE: src/grammar/test/asm-function-in-contract.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/asm-function-in-contract.fail.tact
================================================
contract AssemblyTest {
    asm fun depth(): Int { DEPTH }

    receive() {
        dump(self.depth());
    }
}



================================================
FILE: src/grammar/test/asm-function-in-trait.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/asm-function-in-trait.fail.tact
================================================
trait AssemblyTest {
    asm fun depth(): Int { DEPTH }
}



================================================
FILE: src/grammar/test/asm-getter.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/asm-getter.fail.tact
================================================
primitive Int;
primitive Bool;

trait BaseTrait {}

contract Foo {
    asm get fun illegalGetter(): Int {
        DEPTH
    }
}



================================================
FILE: src/grammar/test/augmented-assign-with-space.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/augmented-assign-with-space.fail.tact
================================================
primitive Int;

trait BaseTrait {}

contract Foo {
    fun foo() {
        a << = 10;
    }
}



================================================
FILE: src/grammar/test/block-statements.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/block-statements.tact
================================================
fun foo() {
    let x = 100;
    {
        let y = 200;
    }
}



================================================
FILE: src/grammar/test/codeOf.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/codeOf.tact
================================================
contract Foo {
    init() {
        let code = codeOf Foo;
    }
}



================================================
FILE: src/grammar/test/const-abstract-abstract.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/const-abstract-abstract.fail.tact
================================================
primitive Int;
trait BaseTrait { }

abstract abstract const Foo: Int = 42;



================================================
FILE: src/grammar/test/const-override-override.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/const-override-override.fail.tact
================================================
primitive Int;
trait BaseTrait { }

override override const Foo: Int = 42;



================================================
FILE: src/grammar/test/const-override-virtual.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/const-override-virtual.fail.tact
================================================
primitive Int;
trait BaseTrait { }

override virtual const Foo: Int = 42;



================================================
FILE: src/grammar/test/const-override.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/const-override.fail.tact
================================================
primitive Int;
trait BaseTrait { }

override const Foo: Int = 42;



================================================
FILE: src/grammar/test/const-virtual-override.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/const-virtual-override.fail.tact
================================================
primitive Int;
trait BaseTrait { }

virtual override const Foo: Int = 42;



================================================
FILE: src/grammar/test/const-virtual-virtual.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/const-virtual-virtual.fail.tact
================================================
primitive Int;
trait BaseTrait { }

virtual virtual const Foo: Int = 42;



================================================
FILE: src/grammar/test/const-virtual.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/const-virtual.fail.tact
================================================
primitive Int;
trait BaseTrait { }

virtual const Foo: Int = 42;



================================================
FILE: src/grammar/test/contract-const-abstract-abstract.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-const-abstract-abstract.fail.tact
================================================
primitive Int;
trait BaseTrait { }

contract TestContract {
  abstract abstract const Foo: Int = 42;
}



================================================
FILE: src/grammar/test/contract-const-abstract-with-initializer.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-const-abstract-with-initializer.fail.tact
================================================
primitive Int;
trait BaseTrait { }

contract TestContract {
  abstract const Foo: Int = 42;
}



================================================
FILE: src/grammar/test/contract-const-abstract.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-const-abstract.fail.tact
================================================
primitive Int;
trait BaseTrait { }

contract TestContract {
  abstract const Foo: Int;
}



================================================
FILE: src/grammar/test/contract-const-override-override.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-const-override-override.fail.tact
================================================
primitive Int;
trait BaseTrait { }

contract TestContract {
  override override const Foo: Int = 42;
}



================================================
FILE: src/grammar/test/contract-const-virtual-virtual.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-const-virtual-virtual.fail.tact
================================================
primitive Int;
trait BaseTrait { }

contract TestContract {
  virtual virtual const Foo: Int = 42;
}



================================================
FILE: src/grammar/test/contract-duplicate-attribute.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-duplicate-attribute.fail.tact
================================================
primitive Int;
contract Test {
    override override const Foo: Int = 42;
}


================================================
FILE: src/grammar/test/contract-empty-traits-list-with-keyword.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-empty-traits-list-with-keyword.fail.tact
================================================
contract Name with {}



================================================
FILE: src/grammar/test/contract-getter-parens-no-method-id.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-getter-parens-no-method-id.fail.tact
================================================
contract Test {
    get() fun test(): Int {
        return 0
    }
}



================================================
FILE: src/grammar/test/contract-getter-with-method-id.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-getter-with-method-id.tact
================================================
contract Test {
    get(crc32("crc32") + 42 & 0x3ffff | 0x4000) fun test(): Int {
        return 0
    }
}



================================================
FILE: src/grammar/test/contract-init-trailing-comma-empty-params.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-init-trailing-comma-empty-params.fail.tact
================================================
contract Name {
    init(,) {}
}



================================================
FILE: src/grammar/test/contract-optional-semicolon-for-last-const-def.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-optional-semicolon-for-last-const-def.tact
================================================
contract Test { const foo: Int = 42 }



================================================
FILE: src/grammar/test/contract-optional-semicolon-for-last-storage-var.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-optional-semicolon-for-last-storage-var.tact
================================================
contract Test { m: map<Int, Int> }



================================================
FILE: src/grammar/test/contract-trailing-comma-empty-traits-list.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-trailing-comma-empty-traits-list.fail.tact
================================================
contract Name with, {}



================================================
FILE: src/grammar/test/contract-with-const-override.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-with-const-override.tact
================================================
contract Contract {
    override const Test: Int = 0;
}


================================================
FILE: src/grammar/test/contract-with-imports.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-with-imports.fail.tact
================================================
import "@stdlib/deploy";

primitive Int;

// all imports must be at the very top of the file
import "@stdlib/not-allowed";

contract Test with Deploy { }



================================================
FILE: src/grammar/test/contract-with-imports.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-with-imports.tact
================================================
import "@stdlib/deploy";

contract Test with Deploy { }



================================================
FILE: src/grammar/test/contract-with-init.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-with-init.tact
================================================
contract Sample {
    a: Int;
    b: Int;
    
    init(a: Int, b: Int) {
        self.a = a;
        self.b = b;
    }
}


================================================
FILE: src/grammar/test/contract-with-trait-string-literal.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-with-trait-string-literal.tact
================================================
primitive Int;

trait SomeTrait {
    a: Int;

    virtual fun a(): Int {
        return a;
    }
}

contract Main with SomeTrait {
    b: Int;

    override fun a(): Int {
        return "hello world!";
    }
}


================================================
FILE: src/grammar/test/contract-with-trait.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/contract-with-trait.tact
================================================
primitive Int;

trait SomeTrait {
    a: Int;

    virtual fun a(): Int {
        return a;
    }
}

contract Main with SomeTrait {
    b: Int;

    override fun a(): Int {
        return b;
    }
}


================================================
FILE: src/grammar/test/destructuring-duplicate-source-id.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/destructuring-duplicate-source-id.fail.tact
================================================
primitive Int;

trait BaseTrait {
    
}

struct S {
    a: Int;
    b: Int;
    c: Int;
}

fun testFunc(): Int {
    let s = S{ a: 1, b: 2, c: 3 };
    let S { a: x, a: y } = s;
    return x + y;
}


================================================
FILE: src/grammar/test/empty-bounced-receiver.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/empty-bounced-receiver.fail.tact
================================================
contract Test {
    bounced() {}
}



================================================
FILE: src/grammar/test/expr-arith-and-cmp.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-arith-and-cmp.tact
================================================
fun testFunc(): Int {
    return (0 + 1) * 10 / 20 != 10;
}


================================================
FILE: src/grammar/test/expr-arith-bool-cmp-method-call.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-arith-bool-cmp-method-call.tact
================================================
fun testFunc(): Int {
    return (0 + 1) * 10 / 20 != 10 * someId || some2 > 10 && some3 < 123.add(10);
}


================================================
FILE: src/grammar/test/expr-arith-bool-var.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-arith-bool-var.tact
================================================
fun testFunc(): Int {
    return (0 + 1) * 10 / 20 != 10 * someId || some2 > 10 && some3 < 10;
}


================================================
FILE: src/grammar/test/expr-arith.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-arith.tact
================================================
fun testFunc(): Int {
    return (0 + 1) * 10 / 20;
}


================================================
FILE: src/grammar/test/expr-binary-chained-operators-1.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-binary-chained-operators-1.tact
================================================
contract Foo {
    a: Int as coins = 123 + -456 + +789;
    b: Int as coins = 123 + -456 +- 789;
}


================================================
FILE: src/grammar/test/expr-binary-chained-operators-2.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-binary-chained-operators-2.tact
================================================
contract Foo {
    a: Int as coins = 123 + -456 + +(987 * -654);
    b: Int as coins = 123 + -456 - -(987 / +654);
}


================================================
FILE: src/grammar/test/expr-binary-operators.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-binary-operators.tact
================================================
contract Foo {
    a: Int as coins = 123 - -456;
    b: Int as coins = 123 + -456;
}


================================================
FILE: src/grammar/test/expr-chaining-unbox.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-chaining-unbox.tact
================================================
fun testFunc(m: map<Int, Int>): Int {
    return m.asCell()!!.hash();
}


================================================
FILE: src/grammar/test/expr-condition-with-or.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-condition-with-or.tact
================================================
fun testFunc(a: Int): Int {
    return a == 123 || a == 456 ? a + 1 : a + 2;
}


================================================
FILE: src/grammar/test/expr-conditional-with-let.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-conditional-with-let.tact
================================================
fun testFunc(a: Int): Int {
    let b: Int = a == 123 ? 1 : 2;
    return b;
}


================================================
FILE: src/grammar/test/expr-conditional.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-conditional.tact
================================================
fun testFunc(a: Int): Int {
    return a == 123 ? 1 : 2;
}


================================================
FILE: src/grammar/test/expr-fun-call-trailing-comma-no-args.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-fun-call-trailing-comma-no-args.fail.tact
================================================
fun a(): Int { 
    return 42;
}

fun b(): Int {
    return a(,);
}



================================================
FILE: src/grammar/test/expr-fun-call.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-fun-call.tact
================================================
fun testFunc(): Int {
    return (0 + 1) * 10 / 20 != 10 * someId || some2 > 10 && some3 < abs(123.add(10));
}


================================================
FILE: src/grammar/test/expr-int-literal.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-int-literal.tact
================================================
fun testFunc(): Int {
    return 0;
}


================================================
FILE: src/grammar/test/expr-method-call-trailing-comma-no-args.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-method-call-trailing-comma-no-args.fail.tact
================================================
fun another() {
    return 42.toString(,);
}



================================================
FILE: src/grammar/test/expr-nested-conditional.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-nested-conditional.tact
================================================
fun testFunc(a: Int): Int {
    return a == 123 || a == 456 ? (a == 10 ? a : a * 2) : a + 2;
}


================================================
FILE: src/grammar/test/expr-parens.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-parens.tact
================================================
fun testFunc(): Int {
    return 1 + 2 + (123 + 3)!! > 123;
}


================================================
FILE: src/grammar/test/expr-with-unbox.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-with-unbox.tact
================================================
fun testFunc(): Int {
    return 1 + 2 + 3!! > 123;
}


================================================
FILE: src/grammar/test/expr-with-var.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/expr-with-var.tact
================================================
fun testFunc(): Int {
    return (0 + 1) * 10 / 20 != 10 * someId;
}


================================================
FILE: src/grammar/test/funcid-native-fun-arith-operator.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-arith-operator.fail.tact
================================================
@name(/)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-assign-operator.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-assign-operator.fail.tact
================================================
@name(^>>=)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-bitwise-operator.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-bitwise-operator.fail.tact
================================================
@name(~)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-comma.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-comma.fail.tact
================================================
@name(send_message,then_terminate)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-comparison-operator.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-comparison-operator.fail.tact
================================================
@name(<=>)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-control-keyword.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-control-keyword.fail.tact
================================================
@name(elseifnot)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-delimiter.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-delimiter.fail.tact
================================================
@name([)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-directive.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-directive.fail.tact
================================================
@name(#include)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-dot.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-dot.fail.tact
================================================
@name(msg.sender)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-keyword.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-keyword.fail.tact
================================================
@name(global)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-multiline-comments.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-multiline-comments.fail.tact
================================================
@name({-aaa-})
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-number-decimal.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-number-decimal.fail.tact
================================================
@name(0)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-number-hexadecimal-2.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-number-hexadecimal-2.fail.tact
================================================
@name(0xDEADBEEF)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-number-hexadecimal.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-number-hexadecimal.fail.tact
================================================
@name(0x0)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-number-neg-decimal.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-number-neg-decimal.fail.tact
================================================
@name(-1)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-number-neg-hexadecimal.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-number-neg-hexadecimal.fail.tact
================================================
@name(-0x0)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-number.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-number.fail.tact
================================================
@name(123)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-only-underscore.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-only-underscore.fail.tact
================================================
@name(_)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-parens.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-parens.fail.tact
================================================
@name(take(first)Entry)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-semicolons.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-semicolons.fail.tact
================================================
@name(pa;;in"`aaa`")
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-space.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-space.fail.tact
================================================
@name(foo foo)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-square-brackets.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-square-brackets.fail.tact
================================================
@name(take[some]entry)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-string.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-string.fail.tact
================================================
@name("not_a_string)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-type-keyword.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-type-keyword.fail.tact
================================================
@name(->)
native idTest();



================================================
FILE: src/grammar/test/funcid-native-fun-unclosed-parens.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/funcid-native-fun-unclosed-parens.fail.tact
================================================
@name(aa(bb)
native idTest();



================================================
FILE: src/grammar/test/ident-cannot-be-if-reserved-word.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-cannot-be-if-reserved-word.fail.tact
================================================
fun hello(): Int {
    let if: Int = 0;
}


================================================
FILE: src/grammar/test/ident-contract-cannot-start-with-__gen.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-contract-cannot-start-with-__gen.fail.tact
================================================
contract __gen_a {

}


================================================
FILE: src/grammar/test/ident-fun-cannot-start-with-__gen.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-fun-cannot-start-with-__gen.fail.tact
================================================
fun __gen_hello(): Int {
    
}


================================================
FILE: src/grammar/test/ident-fun-param-cannot-start-with-__gen.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-fun-param-cannot-start-with-__gen.fail.tact
================================================
fun main(__gen: Int): Int {
    return 0;
}


================================================
FILE: src/grammar/test/ident-fun-param-cannot-start-with-__tact.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-fun-param-cannot-start-with-__tact.fail.tact
================================================
contract A {
    fun b(__tact: Int) {
        
    }
}


================================================
FILE: src/grammar/test/ident-init-param-cannot-start-with-__tact.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-init-param-cannot-start-with-__tact.fail.tact
================================================
contract A {
    init(__tact: Int) {
        
    }
}


================================================
FILE: src/grammar/test/ident-let-cannot-start-with-__gen.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-let-cannot-start-with-__gen.fail.tact
================================================
fun hello(): Int {
    let __gen_a: Int = 0;
}


================================================
FILE: src/grammar/test/ident-let-cannot-start-with-__tact.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-let-cannot-start-with-__tact.fail.tact
================================================
fun hello(): Int {
    let __tact_a: Int = 0;
}


================================================
FILE: src/grammar/test/ident-struct-cannot-start-with-__gen.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/ident-struct-cannot-start-with-__gen.fail.tact
================================================
struct __genA {
    a: Int;
}


================================================
FILE: src/grammar/test/incomplete-return.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/incomplete-return.fail.tact
================================================
fun f(): Int {
    return



================================================
FILE: src/grammar/test/item-fun-non-void-trailing-comma-no-params.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/item-fun-non-void-trailing-comma-no-params.fail.tact
================================================
fun function(,) : Int {
    return 42;
}



================================================
FILE: src/grammar/test/item-fun-void-trailing-comma-no-params.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/item-fun-void-trailing-comma-no-params.fail.tact
================================================
fun function(,) {}



================================================
FILE: src/grammar/test/item-fun-without-body.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/item-fun-without-body.fail.tact
================================================
fun testFunc(): Int;


================================================
FILE: src/grammar/test/item-native-fun-not-void-decl-trailing-comma-no-params.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/item-native-fun-not-void-decl-trailing-comma-no-params.fail.tact
================================================
@name(native_name_2)
native testNativeFuncWithType(,): Int;


================================================
FILE: src/grammar/test/item-native-fun-void-decl-trailing-comma-no-params.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/item-native-fun-void-decl-trailing-comma-no-params.fail.tact
================================================
@name(native_name_1)
native testNativeFunc(,);


================================================
FILE: src/grammar/test/items-asm-fun-1.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-asm-fun-1.fail.tact
================================================
asm(1 0) extends fun loadCoins(self: Slice): Int {
    LDVARUINT16
}




================================================
FILE: src/grammar/test/items-asm-fun-2.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-asm-fun-2.fail.tact
================================================
asm(c b 42) extends fun storeDict(b: Builder, c: Cell) {
    STDICT
}




================================================
FILE: src/grammar/test/items-asm-fun-3.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-asm-fun-3.fail.tact
================================================
asm(s len -> len 1 0) extends fun loadInt(self: Slice, len: Int): Int {
    LDIX
}




================================================
FILE: src/grammar/test/items-asm-fun-4.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-asm-fun-4.fail.tact
================================================
asm(->) extends fun loadInt(self: Slice, len: Int): Int {
    LDIX
}



================================================
FILE: src/grammar/test/items-asm-fun-5.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-asm-fun-5.fail.tact
================================================
asm fun shadowingAttempt() {
    { INC } : }
    5 }
}



================================================
FILE: src/grammar/test/items-asm-funs.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-asm-funs.tact
================================================
asm fun keccak256(s: Slice): Int {
    1
    INT
    HASHEXT_KECCAK256
}

asm( -> 1 0) extends fun loadCoins(self: Slice): Int {
    LDVARUINT16
}

asm(c b) extends fun storeDict(b: Builder, c: Cell) {
    STDICT
}

asm(s len -> 1 0) extends fun loadInt(self: Slice, len: Int): Int {
    LDIX
}

asm fun checkAndRemoveAddExtensionPrefix(self: Slice): Int {
    x{02} SDBEGINSQ
}

asm fun checkAndRemoveAddExtensionPrefix() {
    -ROT
}

asm fun debugStr1() {
    "Works!" DEBUGSTR
}

asm fun debugStr2() { "Works!" }

asm fun createWord() {
    { INC }
}

/// Tests list and binding to a new regular word
asm fun createAndUseWord1(): Int {
    { INC } : incinc
    41 incinc
}

/// Tests weird formatting
asm fun createAndUseWord2(): Int { { INC
}
: incinc 41 incinc
}

/// Tests weird formatting
asm fun createAndUseWord3(): Int {
{
INC
}
:
incinc
41
incinc
}

/// Tests words with } inside of them
asm fun isIntAnInt(x: Int): Int {
    <{
        TRY:<{
            0 PUSHINT ADD DROP -1 PUSHINT
        }>CATCH<{
            2DROP 0 PUSHINT
        }>
    }>CONT 1 1 CALLXARGS
}



================================================
FILE: src/grammar/test/items-method-def-initof-trailing-comma-shifts.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-method-def-initof-trailing-comma-shifts.tact
================================================
fun function(a: Int, b: Int): Int {
    return (a >> b) || (a << (32 - b));
}

fun anotherFunction(
    a: Int,
    b: Int,
    ): Int {
    return (a >> b) || (a << (32 - b));
}

extends fun extension(self: Int, c: Int, d: Int) {
    return self + c + d;
}

fun coverage(a: Int, b: Int) {
    let k: Int = a.extension(
        b,
        4,
    );

    let c: Int = anotherFunction(
        a,
        b,
    );
}

fun oneMoreFunction(
    a: Int,
    b: Int,
    ): Int {
    return anotherFunction(
        a,
        b,
    );
}

contract TestContract {
    init(
        arg1: Int,
        arg2: Int,
    ) {}
}

fun test() {
    let k: StateInit = initOf TestContract(
        2,
        3,
    );
}



================================================
FILE: src/grammar/test/items-multi-funs.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-multi-funs.tact
================================================
fun testFunc() {
    return 0;
}

fun testFunc(): Int {
    return 0;
}

fun testFunc(): Bool {
    return 0;
}


================================================
FILE: src/grammar/test/items-native-fun-decls.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-native-fun-decls.tact
================================================
@name(native_name_1)
native testFunc();

@name(native_name_2)
native testFunc(): Int;

@name(native_name_3)
native testFunc(): Bool;



================================================
FILE: src/grammar/test/items-native-fun-funcid.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-native-fun-funcid.tact
================================================
@name(query')
native idTest1();

@name(query'')
native idTest2();

@name(CHECK)
native idTest3();

@name(_internal_val)
native idTest4();

@name(message_found?)
native idTest5();

@name(get_pubkeys&signatures)
native idTest6();

@name(dict::udict_set_builder)
native idTest7();

@name(_+_)
native idTest8();

@name(__)
native idTest9();

@name(fatal!)
native idTest10();

@name(123validname)
native idTest11();

@name(2+2=2*2)
native idTest12();

@name(-alsovalidname)
native idTest13();

@name(0xefefefhahaha)
native idTest14();

@name({hehehe})
native idTest15();

@name(pa{--}in"`aaa`")
native idTest16();

@name(`I'm a function too`)
native idTest17();

@name(`any symbols ; ~ () are allowed here...`)
native idTest18();

@name(C4)
native idTest19();

@name(C4g)
native idTest20();

@name(4C)
native idTest21();

// Fun fact:
// Individually, _0x0 and _0 are totally valid identifiers in FunC, and the resulting Fift works fine too.
// But if they're together, FunC still compiles, but Fift interpreter cannot deal with that and crashes.
// Same goes for identifiers using hashes # or emojis.
// I.e., you can have a function with any of those combinations of characters, but only one.

@name(_0x0)
native idTest22();

@name(_0)
native idTest23();

@name(0x_)
native idTest24();

@name(0x0_)
native idTest25();

@name(0_)
native idTest26();

@name(hash#256)
native idTest27();

@name(💀💀💀0xDEADBEEF💀💀💀)
native idTest28();

@name(__tact_verify_address)
native idTest29();

@name(__tact_pow2)
native idTest30();

@name(randomize_lt)
native idTest31();

@name(fixed248::asin)
native idTest32();

@name(fixed248::nrand_fast)
native idTest33();

@name(atan_f261_inlined)
native idTest34();

@name(~impure_touch)
native idTest35();

@name(~udict::delete_get_min)
native idTest36();

@name(.something)
native idTest37();

@name(f̷̨͈͚́͌̀i̵̩͔̭̐͐̊n̸̟̝̻̩̎̓͋̕e̸̝̙̒̿͒̾̕)
native idTest38();

@name(❤️❤️❤️thanks❤️❤️❤️)
native idTest39();

@name(intslice)
native idTest40();

@name(int2)
native idTest40();



================================================
FILE: src/grammar/test/items-struct-msg-fun-const.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/items-struct-msg-fun-const.tact
================================================
struct A {
    x: Int;
    y: Int;
}

const a: A = A { x: 1 };

fun getA(): A {
    return A {
        x: 1,
        y: 2,
    };
}

message B {
    x: Int;
    y: Int;
}

const b: B = B {
    x: 2,
    y: 3,
};

fun getB(): B {
    return B { x: 1, y: 5, };
}



================================================
FILE: src/grammar/test/literal-dec-trailing-underscore.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-dec-trailing-underscore.fail.tact
================================================
fun test_fun(): Int {
    return 123_;
}


================================================
FILE: src/grammar/test/literal-double-underscore.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-double-underscore.fail.tact
================================================
fun test_fun(): Int {
    return 123_123__123;
}


================================================
FILE: src/grammar/test/literal-hex-trailing-underscore.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-hex-trailing-underscore.fail.tact
================================================
fun test_fun(): Int {
    return 0x123_;
}


================================================
FILE: src/grammar/test/literal-no-underscore-after-0b.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-no-underscore-after-0b.fail.tact
================================================
fun test_fun(): Int {
    return 0b_00101010;
}


================================================
FILE: src/grammar/test/literal-no-underscores-if-leading-zero.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-no-underscores-if-leading-zero.fail.tact
================================================
fun test_fun(): Int {
    return 012_3;
}


================================================
FILE: src/grammar/test/literal-non-binary-digits.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-non-binary-digits.fail.tact
================================================
fun test_fun(): Int {
    return 0b123;
}


================================================
FILE: src/grammar/test/literal-string-undefined-unicode-codepoint.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-string-undefined-unicode-codepoint.fail.tact
================================================
const S: String = "\u{11ffff}";




================================================
FILE: src/grammar/test/literal-underscore-after-leading-zero.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literal-underscore-after-leading-zero.fail.tact
================================================
fun test_fun(): Int {
    return 0_123;
}


================================================
FILE: src/grammar/test/literals-int-underscores-bin-dec-hex-oct.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/literals-int-underscores-bin-dec-hex-oct.tact
================================================
fun test_fun(): Int {
    let a: Int = 123;
    let b: Int = -123;
    let c: Int = 1_0123_00_000;
    let d: Int = 0x123;
    let e: Int = -0x123;
    let f: Int = 0x1_0123_00_000;
    let g: Int = 0b101010;
    let h: Int = -0b101010;
    let i: Int = 0b1_0101_00_000;
    let j: Int = 0o123;
    let k: Int = -0o123;
    let l: Int = 0o1_0123_00_000;
    return a + b + c + d + e + f + g + h + i + j + k + l;
}


================================================
FILE: src/grammar/test/nested-block-statements.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/nested-block-statements.tact
================================================
fun foo() {
    let x = 100;
    {
        {
            {
                {
                    let y = 200;
                }
            }
        }
    }
}



================================================
FILE: src/grammar/test/optional-map-key.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/optional-map-key.fail.tact
================================================
contract TestContract {
    m: map<Int?, Int>; // Int? is invalid for keys

    receive () {}
}



================================================
FILE: src/grammar/test/optional-map-value.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/optional-map-value.fail.tact
================================================
contract TestContract {
    m: map<Int, Int?>; // Int? is invalid for values

    receive () {}
}



================================================
FILE: src/grammar/test/several-as-for-init-param-type.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/several-as-for-init-param-type.fail.tact
================================================
contract Test {
    init(x: Int as uint32 as int8) {}
}



================================================
FILE: src/grammar/test/stmt-augmented-assign-arith.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-augmented-assign-arith.tact
================================================
fun testFunc(): Int {
    let a: Int = 1;
    let b: Int = 2;
    a += b;
    b += a;
    a += 3;
    a += b + 4;
    b -= 1;
    a -= b;
    a -= b - 1;
    b *= 2;
    a *= b;
    a *= b * 2;
    b /= 2;
    a /= b;
    a /= b / 2;
    a %= 2;
    a %= b;
    a %= b % 2;
    a <<= 2;
    a <<= b;
    a <<= b << 2;
    a >>= 2;
    a >>= b;
    a >>= b >> 2;
    return a;
}


================================================
FILE: src/grammar/test/stmt-augmented-assign-bitwise.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-augmented-assign-bitwise.tact
================================================
fun testFunc(): Int {
    let a: Int = 1;
    let b: Int = 2;
    a |= b;
    b |= a;
    a |= 3;
    a |= b | 4;
    b &= 1;
    a &= b;
    b &= a;
    a &= b & 1;
    b ^= 2;
    a ^= b;
    b ^= a;
    a ^= b ^ 2;
    return a;
}



================================================
FILE: src/grammar/test/stmt-augmented-assign-logic.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-augmented-assign-logic.tact
================================================
fun testFunc(): Bool {
    let a: Bool = true;
    let b: Bool = false;
    a ||= true;
    a ||= b;
    a ||= b || true;
    a &&= true;
    a &&= b;
    a &&= b && true;
    return a;
}


================================================
FILE: src/grammar/test/stmt-destructuring-fields-non-existing-underscore.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-destructuring-fields-non-existing-underscore.fail.tact
================================================
primitive Int;

trait BaseTrait {
    
}

struct S {
    a: Int;
    b: Int;
    c: Int;
}

fun testFunc(): Int {
    let s = S{ a: 1, b: 2, c: 3 };
    let S {_, b, c} =  s;
    return b + c;
}


================================================
FILE: src/grammar/test/stmt-destructuring.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-destructuring.tact
================================================
struct S {
    a: Int;
    b: Int;
    c: Int;
}

message M {
    a: Int;
    b: Int;
}

fun testFunc(): Int {
    let s = S{ a: 1, b: 2, c: 3 };
    let S { a, b, c } = s;
    let S { a: a1, .. } = s;
    let S { b: b1, .. } = s;
    let S { c: c1, .. } = s;
    let S { a: a2, b: b2, .. } = s;
    let S { a: a3, c: c3, .. } = s;
    let S { b: b4, c: c4, .. } = s;

    let m = M{ a: 1, b: 2 };
    let M { a: a_m, b: b_m } = m;

    return a + b + c + a1 + b1 + c1 + a2 + b2 + a3 + c3 + b4 + c4 + a_m + b_m;
}


================================================
FILE: src/grammar/test/stmt-if-else.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-if-else.tact
================================================
fun testFunc(src: Int?): Int {
    if (src != null) {
        return src;
    } else {
        return 10;
    }
}


================================================
FILE: src/grammar/test/stmt-if.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-if.tact
================================================
fun testFunc(src: Int?): Int {
    if (src != null) {
        return src;
    }
    return 0;
}


================================================
FILE: src/grammar/test/stmt-optional-semicolon-for-last-statement.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-optional-semicolon-for-last-statement.tact
================================================
// what is covered: assignment, let
fun test1() {
    let i: Int = 1;
    while(i >= 10 || i <= 100) { i += 1 }
    let i = 42
}

// what is covered: return without expression
fun test2() { return }

// what is covered: return with expression
fun test3(): Int { return 42 }

// what is covered: do-until, expression statement
fun test4(): Int {
    do { 21 + 21 } until (true && true)
}


================================================
FILE: src/grammar/test/stmt-while-loop.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-while-loop.tact
================================================
fun main() {
    let i: Int = 1;
    while(i >= 10 || i <= 100) {
        i = i + 1;
    }
}


================================================
FILE: src/grammar/test/stmt-while-repeat-do-loops.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/stmt-while-repeat-do-loops.tact
================================================
fun main() {
    let i: Int = 1;
    while(true) {
        i = i + 1;
    }
    repeat(10) {
        i = i * 10;
    }
    do {
        i = i - 1;
    } until(false);
}


================================================
FILE: src/grammar/test/string-bounced-receiver.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/string-bounced-receiver.fail.tact
================================================
contract Test {
    bounced("hello") {}
}



================================================
FILE: src/grammar/test/struct-double-semicolon.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/struct-double-semicolon.fail.tact
================================================
// too many semicolons
struct A { x: Int;; }



================================================
FILE: src/grammar/test/struct-field-punning.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/struct-field-punning.tact
================================================
struct A {
    x: Int;
    y: Int;
}

const x: Int = 5;
const y: Int = 6;

const D: A = A { x, y };



================================================
FILE: src/grammar/test/struct-missing-semicolon-between-fields-with-initializer.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/struct-missing-semicolon-between-fields-with-initializer.fail.tact
================================================
// missing ; between fields
struct B { x: Int = 42 y: Int }



================================================
FILE: src/grammar/test/struct-missing-semicolon-between-fields.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/struct-missing-semicolon-between-fields.fail.tact
================================================
// missing ; between fields
struct B { x: Int y: Int }



================================================
FILE: src/grammar/test/struct-msg-as.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/struct-msg-as.tact
================================================
struct A {
    x: Int;
}

message B {
    x: Int as coin;
}


================================================
FILE: src/grammar/test/struct-msg-initializers.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/struct-msg-initializers.tact
================================================
struct A {
    x: Int = 1000;
}

message B {
    x: Int as coins = 1000;
    y: Bool = true;
}


================================================
FILE: src/grammar/test/struct-msg-trailing-semicolon.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/struct-msg-trailing-semicolon.tact
================================================
// optional trailing semicolon
struct A { x: Int }

struct B { x: Int; y: Int }

struct C { x: Int; y: Int = 42 }

struct D { x: Int = 42; y: Int }

message E { x: Int }

message F { x: Int; y: Int }

message G { x: Int; y: Int = 42 }

message G { x: Int = 42; y: Int }



================================================
FILE: src/grammar/test/trait-const-abstract-with-initializer.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-const-abstract-with-initializer.fail.tact
================================================
primitive Int;
trait BaseTrait { }

trait TestContract {
  abstract const Foo: Int = 42;
}



================================================
FILE: src/grammar/test/trait-duplicate-attribute.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-duplicate-attribute.fail.tact
================================================
primitive Int;
trait Test {
    abstract abstract const Foo: Int = 42;
}


================================================
FILE: src/grammar/test/trait-empty-traits-list-with-keyword.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-empty-traits-list-with-keyword.fail.tact
================================================
trait Name with {}



================================================
FILE: src/grammar/test/trait-fun-non-void-trailing-comma-no-params.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-fun-non-void-trailing-comma-no-params.fail.tact
================================================
trait Test {
    abstract fun testAbstractWithType(,): Int;
}



================================================
FILE: src/grammar/test/trait-fun-void-trailing-comma-no-params.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-fun-void-trailing-comma-no-params.fail.tact
================================================
trait Test {
    abstract fun testAbstract(,);
}



================================================
FILE: src/grammar/test/trait-optional-semicolon-for-last-const-decl.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-optional-semicolon-for-last-const-decl.tact
================================================
trait Test { abstract const foo: Int }



================================================
FILE: src/grammar/test/trait-optional-semicolon-for-last-fun-decl.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-optional-semicolon-for-last-fun-decl.tact
================================================
trait Test { abstract fun foo() }



================================================
FILE: src/grammar/test/trait-trailing-comma-empty-traits-list.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/trait-trailing-comma-empty-traits-list.fail.tact
================================================
trait Name with, {}



================================================
FILE: src/grammar/test/traits-inheritance-trailing-comma.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/traits-inheritance-trailing-comma.tact
================================================
primitive Int;

trait OtherTrait {
    c: Int;
}

trait SomeTrait with OtherTrait, {
    a: Int;
}

contract Main with SomeTrait, {
    b: Int;
}



================================================
FILE: src/grammar/test/type-ident-msg-should-be-capitalized.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/type-ident-msg-should-be-capitalized.fail.tact
================================================
message(123) foo {
    signature: Slice;
}



================================================
FILE: src/grammar/test/type-ident-struct-should-be-capitalized.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/type-ident-struct-should-be-capitalized.fail.tact
================================================
struct lowercaseIdForType {
    a: Int;
}



================================================
FILE: src/grammar/test/type-struct-with-map.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/type-struct-with-map.tact
================================================
struct A {
    y: map<Int, Int>;
}

message B {
    x: map<Int, Int>;
}


================================================
FILE: src/grammar/test/types-optional.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/types-optional.tact
================================================
fun testFunc(src: Int?): Int {
    return 1 + 2 + (123 + 3)!! > 123;
}


================================================
FILE: src/grammar/test/var-underscore-name-access.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/var-underscore-name-access.fail.tact
================================================
primitive Int;

fun test(): Int {
    let m: map<Int, Int> = emptyMap();
    foreach (_, _ in m) {
        return _;
    }
    return 0;
}



================================================
FILE: src/grammar/test/var-underscore-name-access2.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/var-underscore-name-access2.fail.tact
================================================
primitive Int;

fun test(): Int {
    let m: map<Int, Int> = emptyMap();
    let x: Int = 0;
    foreach (_, v in m) {
        x += _;
    }
    return x;
}



================================================
FILE: src/grammar/test/var-underscore-name-access3.fail.tact
URL: https://github.com/tact-lang/tact/blob/main/src/grammar/test/var-underscore-name-access3.fail.tact
================================================
primitive Int;

fun someImpureFunction(): Int {
    return 123;
}

fun test(): Int {
    let _: Int = someImpureFunction();
    return _;
}



================================================
FILE: src/imports/__testdata/project/imported.tact
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/project/imported.tact
================================================



================================================
FILE: src/imports/__testdata/project/imported_from_subfolder.tact
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/project/imported_from_subfolder.tact
================================================



================================================
FILE: src/imports/__testdata/project/main.tact
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/project/main.tact
================================================
import "./imported"; import "./subfolder/import_from_parent";


================================================
FILE: src/imports/__testdata/project/subfolder/import_from_parent.tact
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/project/subfolder/import_from_parent.tact
================================================
import "../imported_from_subfolder";


================================================
FILE: src/imports/__testdata/stdlib/lib/config.tact
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/stdlib/lib/config.tact
================================================
import "./config/import2.tact"


================================================
FILE: src/imports/__testdata/stdlib/lib/config/import2.tact
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/stdlib/lib/config/import2.tact
================================================



================================================
FILE: src/imports/__testdata/stdlib/std/stdlib.fc
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/stdlib/std/stdlib.fc
================================================



================================================
FILE: src/imports/__testdata/stdlib/std/stdlib.tact
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/stdlib/std/stdlib.tact
================================================
import "./stdlib2.fc";


================================================
FILE: src/imports/__testdata/stdlib/std/stdlib2.fc
URL: https://github.com/tact-lang/tact/blob/main/src/imports/__testdata/stdlib/std/stdlib2.fc
================================================



================================================
FILE: src/optimizer/test/failed/short-circuit-constant-init-and.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-constant-init-and.tact
================================================
primitive Bool;
primitive Int;

const A: Bool = true && exception(0);

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}


================================================
FILE: src/optimizer/test/failed/short-circuit-constant-init-or.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-constant-init-or.tact
================================================
primitive Bool;
primitive Int;

const A: Bool = false || exception(0);

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}


================================================
FILE: src/optimizer/test/failed/short-circuit-contract-constant-init-and.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-contract-constant-init-and.tact
================================================
primitive Bool;
primitive Int;

trait BaseTrait { }

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}

contract CTest {
    const A: Bool = true && exception(0);
}



================================================
FILE: src/optimizer/test/failed/short-circuit-contract-constant-init-or.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-contract-constant-init-or.tact
================================================
primitive Bool;
primitive Int;

trait BaseTrait { }

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}

contract CTest {
    const A: Bool = false || exception(0);
}



================================================
FILE: src/optimizer/test/failed/short-circuit-contract-init-and.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-contract-init-and.tact
================================================
primitive Bool;
primitive Int;

trait BaseTrait { }

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}

contract CTest {
    A: Bool = true && exception(0);
}



================================================
FILE: src/optimizer/test/failed/short-circuit-contract-init-or.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-contract-init-or.tact
================================================
primitive Bool;
primitive Int;

trait BaseTrait { }

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}

contract CTest {
    A: Bool = false || exception(0);
}



================================================
FILE: src/optimizer/test/failed/short-circuit-struct-init-and.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-struct-init-and.tact
================================================
primitive Bool;
primitive Int;

struct STest {
    A: Bool = true && exception(0);
}

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}


================================================
FILE: src/optimizer/test/failed/short-circuit-struct-init-or.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/short-circuit-struct-init-or.tact
================================================
primitive Bool;
primitive Int;

struct STest {
    A: Bool = false || exception(0);
}

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}


================================================
FILE: src/optimizer/test/failed/stack-deepness-big-input.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/stack-deepness-big-input.tact
================================================
primitive Int;

const A: Int = multiplyByTwo(1000);

fun multiplyByTwo(n: Int): Int {
    if (n < 0) {
        return -multiplyByTwo(-n);
    } else if (n == 0) {
        return 0;
    } else {
        return 2 + multiplyByTwo(n - 1);   
    }                                      
}                                   


================================================
FILE: src/optimizer/test/failed/stack-deepness-deep-call.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/stack-deepness-deep-call.tact
================================================
primitive Int;

const A: Int = multiplyByTwoDeepBlocks(1000);

fun multiplyByTwoDeepBlocks(n: Int): Int {
    if (n < 0) {
        return -multiplyByTwoDeepBlocks(-n);
    } else if (n == 0) {
        return 0;
    } else {     
        {        
            { 
                {
                    {
                        {
                            {
                                {
                                    {
                                        {
                                            {
                                                {
                                                    {
                                                        {
                                                            {
                                                                {
                                                                    {
                                                                        {
                                                                            return 2 + multiplyByTwoDeepBlocks(n - 1);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} 


================================================
FILE: src/optimizer/test/failed/stack-deepness-infinite-recursion.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/failed/stack-deepness-infinite-recursion.tact
================================================
primitive Int;

const A: Int = recurse();

fun recurse(): Int {
    return recurse();
}



================================================
FILE: src/optimizer/test/success/short-circuit-initializations.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/success/short-circuit-initializations.tact
================================================
primitive Bool;
primitive Int;

trait BaseTrait { }

const COL: Bool = true || loop();
const COE: Bool = true || exception(0);

const CAL: Bool = false && loop();
const CAE: Bool = false && exception(0);

fun loop(): Bool {
    while(true) {
    }
    return true;
}

// Div by zero when v = 0
fun exception(v: Int): Bool {
    return 1 / v == 0;
}

struct STest {
    sOL: Bool = true || loop();
    sOE: Bool = true || exception(0);
    sAL: Bool = false && loop();
    sAE: Bool = false && exception(0);
}

contract CTest {
    cOL: Bool = true || loop();
    cOE: Bool = true || exception(0);
    cAL: Bool = false && loop();
    cAE: Bool = false && exception(0);

    const ccOL: Bool = true || loop();
    const ccOE: Bool = true || exception(0);
    const ccAL: Bool = false && loop();
    const ccAE: Bool = false && exception(0);
}


================================================
FILE: src/optimizer/test/success/stack-deepness-recursion.tact
URL: https://github.com/tact-lang/tact/blob/main/src/optimizer/test/success/stack-deepness-recursion.tact
================================================
primitive Int;

const A: Int = multiplyByTwo(200);

fun multiplyByTwo(n: Int): Int {
    if (n < 0) {
        return -multiplyByTwo(-n);
    } else if (n == 0) {
        return 0;
    } else {
        return 2 + multiplyByTwo(n - 1);   
    }                                      
}                                          


================================================
FILE: src/pipeline/test-contracts/packaging.tact
URL: https://github.com/tact-lang/tact/blob/main/src/pipeline/test-contracts/packaging.tact
================================================
message(0x7ba20dc1) EchoMessage {}

contract Echo {
    receive(msg: EchoMessage) {
        self.reply(msg.toCell());
    }
    
    receive(msg: String) {
        self.reply(msg.asComment());
    }
    
    receive(msg: Slice) {
        self.reply(msg.asCell());
    }

    get fun hello(src: String): String {
        let builder: StringBuilder = beginString();
        builder.append("Hello, ");
        builder.append(src);
        return builder.toString();
    }

    get fun hello2(src: Int): Int {
        return src << 10 & 32;
    }
}


================================================
FILE: src/stdlib/stdlib/libs/config.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/config.tact
================================================
/// Retrieves config parameter `0` as an `Address`.
///
/// See: https://docs.tact-lang.org/ref/stdlib-config#getconfigaddress
///
fun getConfigAddress(): Address {
    let cell: Cell = getConfigParam(0)!!;
    let sc: Slice = cell.beginParse();
    return newAddress(-1, sc.loadUint(256));
}

/// Retrieves config parameter `1` as an `Address`.
///
/// See: https://docs.tact-lang.org/ref/stdlib-config#getelectoraddress
///
fun getElectorAddress(): Address {
    let cell: Cell = getConfigParam(1)!!;
    let sc: Slice = cell.beginParse();
    return newAddress(-1, sc.loadUint(256));
}



================================================
FILE: src/stdlib/stdlib/libs/content.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/content.tact
================================================
/// Encodes an off-chain `link` from a `String` to a `Cell`.
///
/// See: https://docs.tact-lang.org/ref/stdlib-content#createoffchaincontent
///
fun createOffchainContent(link: String): Cell {
    let builder: StringBuilder = beginStringFromBuilder(beginCell().storeUint(0x01, 8));
    builder.append(link);
    return builder.toCell();
}



================================================
FILE: src/stdlib/stdlib/libs/deploy.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/deploy.tact
================================================
/// Message struct used in a receiver of the **deprecated** `Deployable` trait.
///
/// See: https://docs.tact-lang.org/ref/stdlib-deploy#deploy
///
message(0x946a98b6) Deploy {
    /// Unique identifier for tracking transactions across multiple contracts.
    queryId: Int as uint64;
}

/// Forwarded message struct used in **deprecated**
/// `Deployable` and `FactoryDeployable` traits.
///
/// See: https://docs.tact-lang.org/ref/stdlib-deploy#deployok
///
message(0xaff90f57) DeployOk {
    /// Unique identifier for tracking transactions across multiple contracts.
    queryId: Int as uint64;
}

/// Message struct used in a receiver of the **deprecated** `FactoryDeployable` trait.
///
/// See: https://docs.tact-lang.org/ref/stdlib-deploy#factorydeploy
///
message(0x6d0ff13b) FactoryDeploy {
    /// Unique identifier for tracking transactions across multiple contracts.
    queryId: Int as uint64;

    /// Address to forward `DeployOk` message to.
    cashback: Address;
}

/// **Deprecated** since Tact 1.6.0. Unless you need the `queryId`,
/// use a `null` message body receiver instead of this trait.
///
/// Provides a convenient unified mechanism for deployments by implementing a
/// simple receiver for the `Deploy` message.
///
/// All contracts are deployed by sending them a message. While any message
/// can be used for this purpose, the best practice is to use the special
/// `Deploy` message.
///
/// This message has a single field, `queryId`, provided by the deployer
/// and is usually set to zero. If the deployment succeeds, the contract will
/// reply with a `DeployOk` message and echo the same `queryId` in the response.
///
/// Beware that the receiver handling the `Deploy` message sends the `DeployOk` reply
/// using the `self.reply()` function, which returns all excessive funds
/// from the incoming message back to the sender. That is, contracts deployed
/// using the `Deployable` trait have a balance of 0 Toncoin
/// after the deployment is completed.
///
/// ```tact
/// import "@stdlib/deploy";
///
/// contract ExampleContract with Deployable {
///     // Now, this contract has a receiver for the Deploy message
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/stdlib-deploy#deployable
///
trait Deployable with BaseTrait {
    receive(deploy: Deploy) {
        self.notify(DeployOk { queryId: deploy.queryId }.toCell());
    }
}

/// **Deprecated** since Tact 1.6.0. Unless you need the `queryId`,
/// use a `null` message body receiver instead of this trait.
///
/// Provides a convenient unified mechanism for chained deployments.
///
/// ```tact
/// import "@stdlib/deploy";
///
/// contract ExampleContract with FactoryDeployable {
///     // Now, this contract has a receiver for the FactoryDeploy message
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/stdlib-deploy#factorydeployable
///
trait FactoryDeployable with BaseTrait {
    receive(deploy: FactoryDeploy) {
        self.forward(deploy.cashback, DeployOk { queryId: deploy.queryId }.toCell(), false, null);
    }
}



================================================
FILE: src/stdlib/stdlib/libs/dns.fc
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/dns.fc
================================================
slice dns_string_to_internal(slice domain) inline_ref {

    ;; Special case for root domain
    if ((domain.slice_bits() == 8) & (domain.slice_refs() == 0)) {
        if (domain.preload_uint(8) == 46) {
            return begin_cell().store_uint(0, 8).end_cell().begin_parse();
        }
    }
    
    ;; Split domain into segments
    tuple segments = null();
    builder current = begin_cell();
    int isCurrentEmpty = true;
    int isFirst = true;
    int isHyphen = false;
    slice cs = domain;
    int continue = true;
    do {

        ;; Prepare for loading next character
        if (cs.slice_bits() == 0) {
            int refs = cs.slice_refs();
            if (refs == 1) {
                cs = cs~load_ref().begin_parse();
            } elseif (refs > 1) {
                return null();
            } else {
                continue = false;
            }
            continue = false;
        }

        ;; Continue loading next character
        if (continue) {
            int char = cs~load_uint(8);
            ;; we can do it because additional UTF-8 character's octets >= 128 -- https://www.ietf.org/rfc/rfc3629.txt
            int is_hyphen = (char == 45);
            int is_dot  = (char == 46);
            int valid_char = is_hyphen | is_dot | ((char >= 48) & (char <= 57)) | ((char >= 97) & (char <= 122)); ;; '-' or 0-9 or a-z
            if (~ valid_char | (isFirst & is_hyphen)) {
                return null();
            }
            isHyphen = is_hyphen;
            if (is_dot) {
                if (isFirst | isHyphen) { ;; Empty or ends with hyphen
                    return null();
                }
                segments = cons(current, segments);
                current = begin_cell();
                isHyphen = false;
                isFirst = true;
                isCurrentEmpty = true;
            } else {
                isFirst = false;
                isCurrentEmpty = false;
                current~store_uint(char, 8);
            }
        }

    } until (~ continue);
    if (isHyphen) { ;; ends with hyphen
        return null();
    }
    if (~ isCurrentEmpty) {
        segments = cons(current, segments);
    }

    ;; Concatenate segments
    builder res = begin_cell();
    (builder b, tuple tail) = uncons(segments);
    res = res.store_builder(b);
    while(~ null?(tail)) {
        (b, tail) = uncons(tail);
        res = res.store_uint(0, 8); ;; Add \0 separator
        res = res.store_builder(b);
    }
    res = res.store_uint(0, 8); ;; Add \0 separator
    return res.end_cell().begin_parse();
}

int dns_internal_verify(slice sc) inline_ref {
    if (sc.slice_refs() != 0) {
        return false;
    }
    int bits = sc.slice_bits();
    if (bits % 8 != 0) {
        return false;
    }
    if (bits == 0) { ;; Case for root domain
        return true;
    }
    int len = bits / 8;
    int counter = 0;
    int isFirst = true;
    int isHyphen = false;
    repeat(len) {
        int char = sc~load_uint(8);
        if (char == 0) {
            if (counter == 0) {
                return false;
            }
            if (isHyphen) {
                return false;
            }
            counter = 0;
            isHyphen = false;
            isFirst = true;
        } else {
            int charIsHyphen = (char == 45);
            int isValid = charIsHyphen | ((char >= 48) & (char <= 57)) | ((char >= 97) & (char <= 122));
            if (~ isValid) {
                return false;
            }
            if (charIsHyphen & isFirst)  {
                return false;
            }
            isHyphen = charIsHyphen;
            isFirst = false;
            counter = counter + 1;
        }
    }
    return counter == 0 & ~ isHyphen;
}

slice dns_internal_normalize(slice src) impure inline_ref {
    throw_unless(134, src.slice_refs() == 0); ;; Invalid argument error
    builder target = begin_cell();
    repeat(src.slice_bits() / 8) {
        int char = src~load_uint(8);

        ;; b => 6
        if (char == 98) {
            char = 54;
        }

        ;; g, q => 9
        if ((char == 103) | (char == 113)) {
            char = 57;    
        }

        ;; l => 1
        if (char == 108) {
            char = 49;
        }

        ;; o => 0
        if (char == 111) {
            char = 48;
        }

        ;; s => 5
        if (char == 115) {
            char = 53;
        }

        ;; u => v
        if (char == 117) {
            char = 118;
        }

        ;; z => 2
        if (char == 122) {
            char = 50;
        }

        target = target.store_uint(char, 8);
    }
    return target.end_cell().begin_parse();
}



================================================
FILE: src/stdlib/stdlib/libs/dns.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/dns.tact
================================================
import "./dns.fc";

/// A struct that contains the result of DNS resolution.
struct DNSResolveResult {
    /// The prefix of the DNS resolution.
    prefix: Int;
    /// The record of the DNS resolution.
    record: Cell?;
}

/// Converts a DNS string to a `Slice` or `null` if conversion is impossible.
@name(dns_string_to_internal)
native dnsStringToInternal(str: String): Slice?;

/// Normalizes the internal DNS representation of the `Slice`.
/// The provided `Slice` must not have any references; otherwise, an exception with
/// [exit code 134] will be thrown: `Invalid argument`.
///
/// [exit code 134]: https://docs.tact-lang.org/book/exit-codes#134
@name(dns_internal_normalize)
native dnsInternalNormalize(src: Slice): Slice;

/// Verifies the internal DNS representation of the subdomain `Slice`.
@name(dns_internal_verify)
native dnsInternalVerify(subdomain: Slice): Bool;

/// Calculates the length of the top domain in the `subdomain` `Slice`.
fun dnsExtractTopDomainLength(subdomain: Slice): Int {
    let i: Int = 0;
    let needBreak: Bool = false;
    do {
        let char: Int = subdomain.loadUint(8); // we do not check domain.length because it MUST contains \0 character
        needBreak = char == 0;
        if (!needBreak) {
            i = i + 8;
        }
    } until (needBreak);
    require(i != 0, "Invalid DNS name");
    return i;
}

/// Extracts the top domain from a `subdomain` `Slice`.
fun dnsExtractTopDomain(subdomain: Slice): Slice {
    let len: Int = dnsExtractTopDomainLength(subdomain);
    return subdomain.loadBits(len);
}

/// Resolves an `address` `Address` into a `Cell`.
fun dnsResolveNext(address: Address): Cell {
    return beginCell()
        .storeUint(0xba93, 16)
        .storeAddress(address)
        .endCell();
}

/// Resolves a wallet `address` `Address` into a `Cell`.
fun dnsResolveWallet(address: Address): Cell {
    return beginCell()
        .storeUint(0x9fd3, 16)
        .storeAddress(address)
        .storeUint(0, 8)
        .endCell();
}

/// Provides two helper functions for DNS resolution:
///
/// 1. A getter function `dnsresolve()`, which corresponds to its FunC variant.
/// 2. A virtual function `doResolveDNS()`, which creates a struct `DNSResolveResult` from subdomain `Slice` bits.
///
/// ```tact
/// import "@stdlib/dns";
///
/// contract ExampleContract with DNSResolver {
///     // Now, this contract has:
///     // 1. A dnsresolve getter function.
///     // 2. A doResolveDNS virtual function.
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/stdlib-dns#dnsresolver
///
trait DNSResolver {
    /// Creates a struct `DNSResolveResult` from subdomain `Slice` bits.
    get fun dnsresolve(subdomain: Slice, category: Int): DNSResolveResult {
        // Normalize
        let delta: Int = 0;
        if (subdomain.preloadUint(8) == 0) {
            subdomain.loadUint(8); // Skip first byte
            delta += 8;
        }

        // Checks correctness
        require(dnsInternalVerify(subdomain), "Invalid DNS name");

        // Resolve
        let res: DNSResolveResult = self.doResolveDNS(subdomain, category);
        return DNSResolveResult { prefix: res.prefix + delta, record: res.record };
    }

    /// Creates a struct `DNSResolveResult` from subdomain `Slice` bits.
    virtual fun doResolveDNS(subdomain: Slice, category: Int): DNSResolveResult {
        return DNSResolveResult { prefix: subdomain.bits(), record: null };
    }
}



================================================
FILE: src/stdlib/stdlib/libs/ownable.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/ownable.tact
================================================
/// Message sent by the owner to transfer ownership of a contract.
///
/// See: https://docs.tact-lang.org/ref/stdlib-ownable#changeowner
///
message(0x819dbe99) ChangeOwner {
    /// Query ID of the change owner request.
    queryId: Int as uint64;
    /// New owner.
    newOwner: Address;
}

/// Message sent by the contract to the owner to confirm the ownership transfer.
///
/// See: https://docs.tact-lang.org/ref/stdlib-ownable#changeownerok
///
message(0x327b2b4a) ChangeOwnerOk {
    /// Query ID of the change owner request.
    queryId: Int as uint64;
    /// New owner that was set.
    newOwner: Address;
}

/// Declares the owner (non-editable) of a contract and provides a helper
/// function `requireOwner()`, which checks that a message was sent by the owner.
///
/// This trait requires a field `owner: Address` to be declared and exposes
/// a getter function `owner()`, which reads it from the contract.
///
/// ```tact
/// import "@stdlib/ownable";
///
/// contract ExampleContract with Ownable {
///     owner: Address;
///
///     init(owner: Address) {
///         self.owner = owner;
///     }
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/stdlib-ownable#ownable
///
@interface("org.ton.ownable")
trait Ownable with BaseTrait {
    /// The owner of the contract.
    owner: Address;

    /// Requires that the sender is the owner of the contract.
    ///
    /// #### Exit codes
    ///
    /// * 132: [Access denied] — Thrown when the sender is not the owner of the contract.
    ///
    /// [Access denied]: https://docs.tact-lang.org/book/exit-codes#132
    ///
    fun requireOwner() {
        throwUnless(TactExitCodeAccessDenied, sender() == self.owner);
    }

    /// Returns the owner of the contract.
    get fun owner(): Address {
        return self.owner;
    }
}

/// Extension of `Ownable` that allows transferring ownership of a contract
/// to another address. It provides a secure handler for the message `ChangeOwner`
/// that can be called by the owner to transfer ownership.
///
/// If the ownership transfer request succeeds, the contract will reply with a
/// `ChangeOwnerOk` message.
///
/// ```tact
/// import "@stdlib/ownable";
///
/// contract ExampleContract with OwnableTransferable {
///     owner: Address;
///
///     init(owner: Address) {
///         self.owner = owner;
///     }
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/stdlib-ownable#ownabletransferable
///
@interface("org.ton.ownable.transferable.v2")
trait OwnableTransferable with Ownable {
    /// The owner of the contract.
    owner: Address;

    /// Receiver for the `ChangeOwner` message body, which
    /// can only be processed when sent by the current owner.
    ///
    /// #### Exit codes
    ///
    /// * 132: [Access denied] — Thrown when the sender is not the owner of the contract.
    ///
    /// [Access denied]: https://docs.tact-lang.org/book/exit-codes#132
    ///
    receive(msg: ChangeOwner) {
        // Check if the sender is the owner
        self.requireOwner();

        // Update owner
        self.owner = msg.newOwner;

        // Reply result
        self.reply(ChangeOwnerOk { queryId: msg.queryId, newOwner: msg.newOwner }.toCell());
    }
}



================================================
FILE: src/stdlib/stdlib/libs/stoppable.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/stoppable.tact
================================================
import "./ownable";

/// Implements a receiver for the message `"Stop"` that can be sent by the owner.
///
/// Trait implements the `stopped()` [getter function] that returns `true` if the contract
/// is stopped (or `false` otherwise) and provides private (non-getter) functions
/// `requireNotStopped()` and `requireStopped()`.
///
/// ```tact
/// import "@stdlib/ownable";
/// import "@stdlib/stoppable";
///
/// contract MyContract with Stoppable {
///    owner: Address;
///    stopped: Bool;
///
///    init(owner: Address) {
///        self.owner = owner;
///        self.stopped = false;
///    }
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/stdlib-stoppable#stoppable
///
/// [getter function]: https://docs.tact-lang.org/book/functions#getter-functions
///
@interface("org.ton.stoppable")
trait Stoppable with Ownable {
    /// Whether the contract is stopped.
    stopped: Bool;

    /// The owner of the contract.
    owner: Address;

    /// Requires the contract to be not stopped.
    ///
    /// #### Exit codes
    ///
    /// * 133: [Contract stopped] — if the contract is stopped.
    ///
    /// [Contract stopped]: https://docs.tact-lang.org/book/exit-codes#133
    ///
    fun requireNotStopped() {
        throwUnless(TactExitCodeContractStopped, !self.stopped);
    }

    /// Requires the contract to be stopped.
    fun requireStopped() {
        require(self.stopped, "Contract not stopped");
    }

    /// Receiver for the message `"Stop"` that stops the contract.
    ///
    /// Can only be called by the owner and if the contract is not stopped already.
    receive("Stop") {
        self.requireOwner();
        self.requireNotStopped();
        self.stopped = true;
        self.reply("Stopped".asComment());
    }

    /// Returns `true` if the contract is stopped (or `false` otherwise).
    get fun stopped(): Bool {
        return self.stopped;
    }
}

/// Extends the `Stoppable` trait and allows resuming contract execution.
///
/// Trait implements a receiver for the message `"Resume"` that resumes the contract execution.
///
/// ```tact
/// import "@stdlib/ownable";
/// import "@stdlib/stoppable";
///
/// contract MyContract with Resumable {
///     owner: Address;
///     stopped: Bool;
///
///     init(owner: Address) {
///         self.owner = owner;
///         self.stopped = false;
///     }
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/stdlib-stoppable#resumable
///
@interface("org.ton.resumable")
trait Resumable with Stoppable {
    /// Whether the contract is stopped.
    stopped: Bool;

    /// The owner of the contract.
    owner: Address;

    /// Receiver for the message `"Resume"` that resumes the contract execution.
    ///
    /// Can only be called by the owner and if the contract is stopped.
    receive("Resume") {
        self.requireOwner();
        self.requireStopped();
        self.stopped = false;
        self.reply("Resumed".asComment());
    }
}



================================================
FILE: src/stdlib/stdlib/std/internal/address.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/address.tact
================================================
/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Casts the `Slice` to an `Address` in a given `chain` ID and returns it. The inverse of `Address.asSlice()` and a safe but more gas-expensive version of `Slice.asAddressUnsafe()`.
///
/// ```tact
/// fun example() {
///     let a: Address = myAddress(); // let's assume we're in a basechain
///     let a2: Address = a.asSlice().asAddress(0); // so the chain ID is 0
///
///     a == a2; // true
/// }
/// ```
///
/// #### Exit codes
///
/// * 136: [Invalid standard address] — Thrown when the given `Slice` contains an invalid
///   tag prefix (not `0b100`) or an invalid account ID length (not 256 bits).
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceasaddress
/// * https://docs.tact-lang.org/ref/core-cells#sliceasaddressunsafe
/// * https://docs.tact-lang.org/ref/core-addresses#addressasslice
///
/// [Invalid standard address]: https://docs.tact-lang.org/book/exit-codes#136
///
extends fun asAddress(self: Slice, chain: Int): Address {
    // 11 bits for the prefix,
    // 256 bits for the address itself
    throwUnless(TactExitCodeInvalidStandardAddress, self.bits() == 267);

    if (chain == -1) {
        // 1279 = 0b100_1111_1111,
        // i.e. internal address prefix and chain ID -1
        throwUnless(TactExitCodeInvalidStandardAddress, self.preloadUint(11) == 1279);
    } else {
        // Only check the correct internal address prefix,
        // but do not verify the chain ID
        throwUnless(TactExitCodeInvalidStandardAddress, self.preloadUint(3) == 4);
    }

    // Proceed with the cast
    return self.asAddressUnsafe();
}

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Unsafely casts the `Slice` to an `Address` and returns it. The inverse of `Address.asSlice()`.
///
/// This function does **not** perform any checks on the contents of the `Slice`.
///
/// ```tact
/// fun example() {
///     let a: Address = myAddress();
///     let a2: Address = a.asSlice().asAddressUnsafe();
///
///     a == a2; // true
/// }
/// ```
///
/// Use it only if you want to optimize the code for gas and can guarantee in advance that the `Slice` contains the data of an `Address`.
///
/// Otherwise, use a safer but more gas-expensive `Slice.asAddress()` function.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceasaddressunsafe
/// * https://docs.tact-lang.org/ref/core-cells#sliceasaddress
/// * https://docs.tact-lang.org/ref/core-addresses#addressasslice
///
asm extends fun asAddressUnsafe(self: Slice): Address {}

/// Extension function for the `Address` type.
///
/// Casts `self` back to the underlying `Slice` and returns it. The inverse of `Slice.asAddressUnsafe()`.
///
/// ```tact
/// fun example() {
///     let a: Address = myAddress();
///     let fizz: Slice = beginCell().storeAddress(a).asSlice();
///     let buzz: Slice = a.asSlice(); // cheap, unlike the previous statement
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-addresses#addressasslice
/// * https://docs.tact-lang.org/ref/core-cells#sliceasaddressunsafe
///
asm extends fun asSlice(self: Address): Slice {}

/// Global function.
///
/// Creates a new `Address` based on the `chain` ID and the SHA-256 encoded `hash` value (account ID).
///
/// This function tries to resolve constant values in compile-time whenever possible.
///
/// Attempts to specify an uncommon `chain` ID (not -1 or 0) that can be detected in compile-time will result in a compilation error.
///
/// ```tact
/// fun example() {
///     let oldTonFoundationAddr: Address =
///         newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
///         //         ↑  ↑
///         //         |  sha-256 hash of contract's init package (StateInit)
///         //         chain id: 0 is a workchain, -1 is a masterchain
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-addresses#newaddress
///
inline fun newAddress(chain: Int, hash: Int): Address {
    return beginCell()
        .storeUint(0b10_0, 3)
        .storeInt(chain, 8)
        .storeUint(hash, 256)
        .endCell()
        .asSlice()
        .asAddressUnsafe();
}

/// Struct representing the standard address on TON Blockchain with signed 8-bit `workchain` ID and an unsigned 256-bit `address` in the specified `workchain`. Available since Tact 1.5.0.
///
/// At the moment, only `workchain` IDs used on TON are 0 of the basechain and -1 of the masterchain.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-addresses#parsestdaddress
/// * https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L105-L106
///
struct StdAddress {
    workchain: Int as int8;
    address: Int as uint256;
}

/// Deprecated since Tact 1.6.8. Any usages of this structure will be reported as an error.
///
/// Struct representing the address of variable length with signed 32-bit `workchain` ID and a `Slice` containing unsigned `address` in the specified `workchain`. Available since Tact 1.5.0.
///
/// Variable-length addresses are intended for future extensions, and while validators must be ready to accept them in inbound messages, the standard (non-variable) addresses are used whenever possible.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-addresses#parsevaraddress
/// * https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L107-L108
///
struct VarAddress {
    workchain: Int as int32;
    address: Slice;
}

/// Global function. Available since Tact 1.5.0.
///
/// Converts a `slice` containing an address into the `StdAddress` struct and returns it.
///
/// ```tact
/// fun example() {
///     let addr = address("EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2");
///     let parsedAddr = parseStdAddress(addr.asSlice());
///
///     parsedAddr.workchain; // 0
///     parsedAddr.address;   // 107...287
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when the specified `slice` cannot be parsed as a `StdAddress`.
///
/// See: https://docs.tact-lang.org/ref/core-addresses#parsestdaddress
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm fun parseStdAddress(slice: Slice): StdAddress { REWRITESTDADDR }

/// Global function. Available since Tact 1.5.0.
///
/// Deprecated since Tact 1.6.8. Any usages of this function will be reported as an error.
///
/// Converts a `slice` containing an address of variable length into the `VarAddress` struct and returns it.
///
/// ```tact
/// fun example() {
///     let varAddrSlice = beginCell()
///         .storeUint(6, 3)     // to recognize the following as a VarAddress
///         .storeUint(123, 9)   // make address occupy 123 bits
///         .storeUint(234, 32)  // specify workchain ID of 234
///         .storeUint(345, 123) // specify address of 345
///         .asSlice();
///     let parsedVarAddr = parseVarAddress(varAddrSlice);
///
///     parsedVarAddr.workchain;             // 234
///     parsedVarAddr.address;               // CS{Cell{002...2b3} bits: 44..167; refs: 0..0}
///     parsedVarAddr.address.loadUint(123); // 345
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when the specified `slice` cannot be parsed as a `VarAddress`.
///
/// See: https://docs.tact-lang.org/ref/core-addresses#parsevaraddress
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm fun parseVarAddress(slice: Slice): VarAddress { REWRITEVARADDR }

/// Extension mutation function for the `Slice` type.
///
/// Loads and returns an `Address` from the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeAddress(myAddress()).asSlice();
///     let fizz: Address = s.loadAddress();
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceloadaddress
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadAddress(self: Slice): Address { LDMSGADDR }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Skips an `Address` from the `Slice`.
///
/// ```tact
/// fun example() {
///     let s1: Slice = beginCell()
///         .storeAddress(myAddress())
///         .storeUint(42, 32)
///         .asSlice();
///
///     s1.skipAddress();
///     let fizz: Int = s1.loadUint(32); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceskipaddress
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipAddress(self: Slice) { LDMSGADDR NIP }

/// Extension function for the `Builder` type.
///
/// Stores the `address` in the copy of the `Builder`. Returns that copy.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeAddress(myAddress());
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store an `address` into the `Builder` when it cannot fit it.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstoreaddress
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeAddress(self: Builder, address: Address): Builder { STSLICER }

/// Struct representing a basechain address. Available since Tact 1.6.0.
///
/// A basechain address (workchain 0) can be either empty (null hash) or contain a 256-bit hash value.
///
/// See: https://docs.tact-lang.org/ref/core-addresses#basechainaddress
///
struct BasechainAddress {
    hash: Int?;
}

/// Global function. Available since Tact 1.6.0.
///
/// Creates and returns an empty basechain address with a null hash.
///
/// When serialized, an empty basechain address is represented as `addr_none`.
///
/// ```tact
/// fun example() {
///     let emptyAddr: BasechainAddress = emptyBasechainAddress();
///     emptyAddr.hash == null; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-addresses#emptybasechainaddress
///
inline fun emptyBasechainAddress(): BasechainAddress {
    return BasechainAddress { hash: null };
}

/// Global function. Available since Tact 1.6.0.
///
/// Creates and returns a new basechain address with the specified hash value.
///
/// ```tact
/// fun example() {
///     let addr: BasechainAddress = newBasechainAddress(0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-addresses#newbasechainaddress
///
inline fun newBasechainAddress(hash: Int): BasechainAddress {
    return BasechainAddress { hash };
}

/// Global function. Available since Tact 1.6.0.
///
/// Creates and returns a basechain address derived from a contract's `StateInit` (code and data).
///
/// ```tact
/// fun example() {
///     let code: Cell = loadCell(); // load contract code
///     let data: Cell = loadCell(); // load contract data
///     let state: StateInit = StateInit { code, data };
///     let addr: BasechainAddress = contractBasechainAddress(state);
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-addresses#contractbasechainaddress
///
inline fun contractBasechainAddress(s: StateInit): BasechainAddress {
    let hash = contractHash(s.code, s.data);
    return newBasechainAddress(hash);
}

/// Extension function for the `Builder` type. Available since Tact 1.6.0.
///
/// Stores the basechain address in the copy of the Builder and returns that copy.
///
/// If the address has a `null` hash, stores two zero bits `0b00` (`addr_none`). Otherwise,
/// stores the full address with the three-bit prefix `0b100`,
/// followed by the 8-bit workchain ID set to 0 and the 256-bit hash.
///
/// ```tact
/// fun example() {
///     let addr: BasechainAddress = newBasechainAddress(0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
///     let b: Builder = beginCell();
///     let b2: Builder = b.storeBasechainAddress(addr);
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store an `address` into the `Builder` when it cannot fit it.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorebasechainaddress
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
extends fun storeBasechainAddress(self: Builder, address: BasechainAddress): Builder {
    if (address.hash == null) {
        return self.storeUint(0, 2); // 0b00
    }

    return self
        .storeUint(0b10_0_00000000, 3 + 8)
        .storeUint(address.hash!!, 256);
}

/// Global function. Available since Tact 1.6.3.
///
/// Checks whether the `address` is in the basechain, i.e., its chain ID is 0.
///
/// ```tact
/// fun examples() {
///     let someBasechainAddress: Address =
///         newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
///
///     let someMasterchainAddress: Address =
///         newAddress(-1, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
///
///     // Does not throw because the chain ID is 0
///     forceBasechain(someBasechainAddress);
///
///     try {
///         // Throws because the chain ID is -1 (masterchain)
///         forceBasechain(someMasterchainAddress);
///     } catch (exitCode) {
///         // exitCode is 138
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 138: [Not a basechain address] — Thrown when the given `address` is not in the basechain (chain ID is not 0).
///
/// See: https://docs.tact-lang.org/ref/core-addresses#forcebasechain
///
/// [Not a basechain address]: https://docs.tact-lang.org/book/exit-codes#138
///
asm fun forceBasechain(address: Address) { REWRITESTDADDR DROP 138 THROWIF }

/// Global function. Available since Tact 1.6.4.
///
/// Checks whether the `address` is in the `workchain`, i.e., its chain ID is equal to `workchain`.
///
/// ```tact
/// fun examples() {
///     let someBasechainAddress: Address =
///         newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
///
///     let someMasterchainAddress: Address =
///         newAddress(-1, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
///
///     // Does not throw because the chain ID matches workchain parameter
///     forceWorkchain(someBasechainAddress, 0, 593);
///     forceWorkchain(someMasterchainAddress, -1, 593);
///
///     try {
///         // Throws because the chain ID is 0 which doesn't match the workchain parameter, -1
///         forceWorkchain(someBasechainAddress, -1, 593);
///     } catch (exitCode) {
///         // exitCode is 593
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * `errorCode` — Thrown when the given `address` is not in the specified `workchain` (chain ID is not equal to `workchain`).
///
/// See: https://docs.tact-lang.org/ref/core-addresses#forceworkchain
///
asm(errorCode workchain address) fun forceWorkchain(address: Address, workchain: Int, errorCode: Int) {
    REWRITESTDADDR
    DROP
    CMP
    THROWANYIF
}



================================================
FILE: src/stdlib/stdlib/std/internal/base.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/base.tact
================================================
/// Describes the base logic that is available in all contracts and traits by default.
///
/// This trait is implicitly inherited by every other contract and trait.
/// It contains a number of the most useful internal functions for any kind of contract,
/// and a constant `self.storageReserve` aimed at advanced users of Tact.
///
/// See: https://docs.tact-lang.org/ref/core-base/
trait BaseTrait {
    /// The amount of nanoToncoins to reserve before forwarding a message with
    /// `SendRemainingBalance` mode. Default is 0 (no reserve).
    ///
    /// ```tact
    /// contract AllYourStorageBelongsToUs {
    ///     // This would change the behavior of `self.forward()` function,
    ///     // causing it to try reserving this amount of nanoToncoins before
    ///     // forwarding a message with `SendRemainingBalance` mode
    ///     override const storageReserve: Int = ton("0.1");
    /// }
    /// ```
    ///
    /// See: https://docs.tact-lang.org/ref/core-base#self-forward
    ///
    virtual const storageReserve: Int = 0;

    /// Sends a bounceable message back to the sender of the current message.
    /// A similar but more gas-efficient version of calling the `self.forward()`
    /// function with the following arguments:
    ///
    /// ```tact
    /// self.forward(sender(), body, true, null);
    /// //           ↑         ↑     ↑     ↑
    /// //           |         |     |     init: StateInit?
    /// //           |         |     bounce: Bool
    /// //           |         body: Cell?
    /// //           to: Address
    /// ```
    ///
    /// See: https://docs.tact-lang.org/ref/core-base#self-forward
    ///
    virtual inline fun reply(body: Cell?) {
        let to: Address = sender();
        let bounce: Bool = true;
        if (self.storageReserve > 0) { // Optimized in compile-time
            let balance: Int = myBalance();
            let balanceBeforeMessage: Int = balance - context().value;
            if (balanceBeforeMessage < self.storageReserve) {
                nativeReserve(self.storageReserve, ReserveExact);
                message(MessageParameters {
                    bounce,
                    to,
                    value: 0,
                    mode: SendRemainingBalance | SendIgnoreErrors,
                    body,
                });
                return;
            }
        }

        // Just send with remaining balance
        message(MessageParameters {
            bounce,
            to,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body,
        });
    }

    /// Sends a non-bounceable message back to the sender of the current message.
    /// A similar but more gas-efficient version of calling the `self.forward()`
    /// function with the following arguments:
    ///
    /// ```tact
    /// self.forward(sender(), body, false, null);
    /// //           ↑         ↑     ↑     ↑
    /// //           |         |     |     init: StateInit?
    /// //           |         |     bounce: Bool
    /// //           |         body: Cell?
    /// //           to: Address
    /// ```
    ///
    /// See: https://docs.tact-lang.org/ref/core-base#self-forward
    ///
    virtual inline fun notify(body: Cell?) {
        let to: Address = sender();
        let bounce: Bool = false;
        if (self.storageReserve > 0) { // Optimized in compile-time
            let balance: Int = myBalance();
            let balanceBeforeMessage: Int = balance - context().value;
            if (balanceBeforeMessage < self.storageReserve) {
                nativeReserve(self.storageReserve, ReserveExact);
                message(MessageParameters {
                    bounce,
                    to,
                    value: 0,
                    mode: SendRemainingBalance | SendIgnoreErrors,
                    body,
                });
                return;
            }
        }

        // Just send with remaining balance
        message(MessageParameters {
            bounce,
            to,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body,
        });
    }

    /// Queues the message (bounceable or non-bounceable) to be sent to the specified address `to`.
    /// Optionally, you may provide a `body` of the message and the `init` package with `initOf`.
    ///
    /// When `self.storageReserve` constant is overwritten to be greater than zero, before sending a
    /// message it also tries to reserve the `self.storageReserve` amount of nanoToncoins from the
    /// remaining balance before making the send in the `SendRemainingBalance` (128) mode.
    ///
    /// In case reservation attempt fails and in the default case without the attempt, the message
    /// is sent with the `SendRemainingValue` (64) mode instead.
    ///
    /// > Note that `self.forward()` never sends additional nanoToncoins on top of what’s available on the balance.
    /// > To be able to send more nanoToncoins with a single message, use the the `send` function.
    ///
    /// See: https://docs.tact-lang.org/ref/core-base#self-forward
    ///
    virtual fun forward(to: Address, body: Cell?, bounce: Bool, init: StateInit?) {
        if (init == null) {
            // Lock storage if needed
            if (self.storageReserve > 0) { // Optimized in compile-time
                let ctx: Context = context();
                let balance: Int = myBalance();
                let balanceBeforeMessage: Int = balance - ctx.value;
                if (balanceBeforeMessage < self.storageReserve) {
                    nativeReserve(self.storageReserve, ReserveExact);
                    message(MessageParameters {
                        bounce,
                        to,
                        value: 0,
                        mode: SendRemainingBalance | SendIgnoreErrors,
                        body,
                    });
                    return;
                }
            }

            // Just send with remaining balance
            message(MessageParameters {
                bounce,
                to,
                value: 0,
                mode: SendRemainingValue | SendIgnoreErrors,
                body,
            });
            return;
        }

        // Lock storage if needed
        if (self.storageReserve > 0) { // Optimized in compile-time
            let ctx: Context = context();
            let balance: Int = myBalance();
            let balanceBeforeMessage: Int = balance - ctx.value;
            if (balanceBeforeMessage < self.storageReserve) {
                nativeReserve(self.storageReserve, ReserveExact);
                send(SendParameters {
                    to,
                    mode: SendRemainingBalance | SendIgnoreErrors,
                    body,
                    value: 0,
                    bounce,
                    code: init!!.code,
                    data: init!!.data,
                });
                return;
            }
        }

        // Just send with remaining balance
        send(SendParameters {
            bounce,
            to,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body,
            code: init!!.code,
            data: init!!.data,
        });
    }
}



================================================
FILE: src/stdlib/stdlib/std/internal/cells.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/cells.tact
================================================
//
// Builder
//

/// Creates a new empty `Builder`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#begincell
///
asm fun beginCell(): Builder { NEWC }

/// Extension function for the `Builder` type.
///
/// Stores a signed `bits`-bit `value` into the copy of the `Builder` for 0 ≤ `bits` ≤ 257.
/// Returns that copy of the `Builder`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeInt(42, 7);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to provide an insufficient or out-of-bounds `bits` number.
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstoreint
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
@name(store_int) // special treatment in Func compiler, so not replaced with asm "STIX"
extends native storeInt(self: Builder, value: Int, bits: Int): Builder;

/// Extension function for the `Builder` type.
///
/// Stores an unsigned `bits`-bit `value` into the copy of the `Builder` for 0 ≤ `bits` ≤ 256.
/// Returns that copy of the `Builder`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeUint(42, 6);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to store a negative `value` or provide an insufficient or out-of-bounds `bits` number.
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstoreuint
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
@name(store_uint) // special treatment in Func compiler, so not replaced with asm "STUX"
extends native storeUint(self: Builder, value: Int, bits: Int): Builder;

/// Extension function for the `Builder` type.
///
/// Stores a `Bool` `value` into the copy of the `Builder`.
/// Writes 1 as a single bit if `value` is `true`, and writes 0 otherwise.
/// Returns that copy of the `Builder`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeBool(true);  // writes 1
///     let buzz: Builder = b.storeBool(false); // writes 0
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorebool
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm(value self) extends fun storeBool(self: Builder, value: Bool): Builder { 1 STI }

/// Extension function for the `Builder` type. Available since Tact 1.5.0.
///
/// Alias to `Builder.storeBool()`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeBit(true);  // writes 1
///     let buzz: Builder = b.storeBit(false); // writes 0
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorebit
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm(value self) extends fun storeBit(self: Builder, value: Bool): Builder { 1 STI }

/// Extension function for the `Builder` type.
///
/// Stores (serializes) an unsigned `Int` `value` in the range from 0 to 2^120 − 1
/// inclusive into the copy of the `Builder`. The serialization of `value` consists
/// of a 4-bit unsigned big-endian integer `l`, which is the smallest integer `l` ≥ 0,
/// such that `value` < 2^(8 * `l`), followed by an 8 * `l`-bit unsigned big-endian
/// representation of `value`. Returns that copy of the `Builder`.
///
/// This is the most common way of storing nanoToncoins.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeCoins(42);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to store an out-of-bounds `value`.
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorecoins
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeCoins(self: Builder, value: Int): Builder { STVARUINT16 }

/// Extension function for the `Builder` type. Available since Tact 1.6.0.
///
/// Alias to `Builder.storeCoins()`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeVarUint16(42);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to store an out-of-bounds `value`.
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#builderstorevaruint16
/// * https://docs.tact-lang.org/ref/core-cells#builderstorecoins
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeVarUint16(self: Builder, value: Int): Builder { STVARUINT16 }

/// Extension function for the `Builder` type. Available since Tact 1.6.0.
///
/// Similar to `Builder.storeCoins()`, but with a different `value` range: from -2^119 to 2^119 - 1 inclusive.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeVarInt16(-42);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to store an out-of-bounds `value`.
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorevarint16
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeVarInt16(self: Builder, value: Int): Builder { STVARINT16 }

/// Extension function for the `Builder` type. Available since Tact 1.6.0.
///
/// Stores (serializes) an unsigned `Int` `value` in the range from 0 to 2^248 − 1 inclusive into the copy of the `Builder`. The serialization of `value` consists of a 5-bit unsigned big-endian integer `l`, which is the smallest integer `l` ≥ 0, such that `value` < 2^8 * `l`, followed by an 8 * `l`-bit unsigned big-endian representation of `value`. Returns that copy of the `Builder`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeVarUint32(420000);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to store an out-of-bounds `value`.
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorevaruint32
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeVarUint32(self: Builder, value: Int): Builder { STVARUINT32 }

/// Extension function for the `Builder` type. Available since Tact 1.6.0.
///
/// Similar to `Builder.storeVarUint32()`, but with a different `value` range: from -2^247 to 2^247 - 1 inclusive.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeVarInt32(-420000);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to store an out-of-bounds `value`.
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorevarint32
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeVarInt32(self: Builder, value: Int): Builder { STVARINT32 }

/// Extension function for the `Builder` type.
///
/// Stores a reference `cell` into a copy of the `Builder`.
/// Returns that copy of the `Builder`.
///
/// Note that a single `Cell` can contain up to 4 references.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b.storeRef(emptyCell());
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store more than 4 references in a single `Cell`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#builderstoreref
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm(cell self) extends fun storeRef(self: Builder, cell: Cell): Builder { STREF }

/// Extension function for the `Builder` type.
///
/// Stores a `slice` into a copy of the `Builder`.
/// Returns that copy of the `Builder`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let s: Slice = emptyCell().asSlice();
///     let fizz: Builder = b.storeSlice(s);
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#builderstoreslice
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeSlice(self: Builder, slice: Slice): Builder { STSLICER }

/// Extension function for the `Builder` type. Available since Tact 1.5.0.
///
/// Appends all data from the `other` builder to the copy of the `self` builder. Returns that copy.
///
/// ```tact
/// fun example(op: Int, queryId: Int, payload: Builder) {
///    let msgBody = beginCell().storeUint(op, 32).storeUint(queryId, 64);
///    if (payload.bits() != 0) {
///        msgBody = msgBody.storeBuilder(payload); // assignment is important here
///    }
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store more data than the Builder can fit.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstorebuilder
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun storeBuilder(self: Builder, other: Builder): Builder { STBR }

/// Extension function for the `Builder` type. Available since Tact 1.5.0.
///
/// If the `cell` is not `null`, stores 1 as a single bit and then reference `cell` into the copy of the `Builder`. Returns that copy.
///
/// If the `cell` is `null`, only stores 0 as a single bit into the copy of the `Builder`. Returns that copy.
///
/// Note that a single `Cell` can contain up to 4 references.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Builder = b
///         .storeMaybeRef(emptyCell()) // 1, then empty cell
///         .storeMaybeRef(null);       // 0
/// }
/// ```
///
/// #### Exit codes
///
/// * 8: [Cell overflow] — Thrown when attempting to store more than 4 references in a single `Cell`.
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderstoremayberef
///
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm(cell self) extends fun storeMaybeRef(self: Builder, cell: Cell?): Builder { STOPTREF }

/// Extension function for the `Builder` type.
///
/// Converts a `Builder` into an ordinary `Cell`.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let c: Cell = b.endCell();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderendcell
///
asm extends fun endCell(self: Builder): Cell { ENDC }

/// Extension function for the `Builder` type.
///
/// Returns the number of cell references already stored in the `Builder` as an `Int`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let refs: Int = b.refs(); // 0
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderrefs
///
asm extends fun refs(self: Builder): Int { BREFS }

/// Extension function for the `Builder` type.
///
/// Returns the number of data bits already stored in the `Builder` as an `Int`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let bits: Int = b.bits(); // 0
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderbits
///
asm extends fun bits(self: Builder): Int { BBITS }

/// Extension function for the `Builder` type. Available since Tact 1.6.0.
///
/// Computes and returns the `Int` depth of the `Builder`. Produces 0 if the `Builder` has no references stored so far, otherwise 1 plus the maximum of the depths of the referenced cells.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell().storeInt(42, 7);
///     let depth: Int = b.depth(); // 0
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderdepth
///
asm extends fun depth(self: Builder): Int { BDEPTH }

//
// Slice
//

/// Extension function for the `Cell` type.
///
/// Opens the `Cell` for parsing and returns it as a `Slice`.
///
/// ```tact
/// fun example() {
///     let c: Cell = beginCell();
///     let s: Slice = c.beginParse();
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#cellbeginparse
///
asm extends fun beginParse(self: Cell): Slice { CTOS }

/// Extension mutation function for the `Slice` type.
///
/// Loads the next reference from the `Slice` as a `Cell`.
///
/// ```tact
/// fun example() {
///     let s1: Slice = beginCell().storeRef(emptyCell()).asSlice();
///     let fizz: Cell = s1.loadRef();
///
///     let s2: Slice = beginCell()
///         .storeRef(emptyCell())
///         .storeRef(s1.asCell())
///         .asSlice();
///     let ref1: Cell = s2.loadRef();
///     let ref2: Cell = s2.loadRef();
///     ref1 == ref2; // false
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadref
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadRef(self: Slice): Cell { LDREF }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Skips the next reference from the `Slice`. Similar to discarding the return value of `Slice.loadRef()`.
///
/// ```tact
/// fun example() {
///     let s1: Slice = beginCell()
///         .storeRef(emptyCell())
///         .storeUint(42, 32)
///         .asSlice();
///
///     s1.skipRef();
///     let fizz: Int = s1.loadUint(32); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipref
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipRef(self: Slice) { LDREF NIP }

/// Extension function for the `Slice` type. Available since Tact 1.5.0.
///
/// Preloads the next reference from the `Slice` as a `Cell`. Doesn't modify the original `Slice`.
///
/// ```tact
/// fun examples() {
///     let s1: Slice = beginCell().storeRef(emptyCell()).asSlice();
///     let fizz: Cell = s1.preloadRef(); // didn't modify s1
///
///     let s2: Slice = beginCell()
///         .storeRef(emptyCell())
///         .storeRef(s1.asCell())
///         .asSlice();
///
///     let ref1: Cell = s2.preloadRef();
///     let ref2: Cell = s2.preloadRef();
///     ref1 == ref2; // true
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#slicepreloadref
/// * https://docs.tact-lang.org/book/exit-codes
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun preloadRef(self: Slice): Cell { PLDREF }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.0.
///
/// Loads a single bit from the `Slice`: if it's 1, then the referenced `Cell` is loaded
/// and returned. If the loaded bit is 0, then nothing else is loaded and `null` is returned.
///
/// ```tact
/// fun example() {
///     let s = msg.asSlice();
///     let outActions = s.loadMaybeRef();
///
///     if (outActions != null) {
///         let actions = outActions!!;
///         // ...process actions...
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadmayberef
/// * https://docs.tact-lang.org/book/exit-codes
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadMaybeRef(self: Slice): Cell? { LDOPTREF }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Skips `Cell?` from the `Slice`. Similar to discarding the return value of `Slice.loadMaybeRef()`.
///
/// ```tact
/// fun example() {
///     let s1: Slice = beginCell()
///         .storeMaybeRef(emptyCell())
///         .storeUint(42, 32)
///         .asSlice();
///
///     s1.skipMaybeRef();
///     let fizz: Int = s1.loadUint(32); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipmayberef
/// * https://docs.tact-lang.org/book/exit-codes
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipMaybeRef(self: Slice) { LDOPTREF NIP }

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Preloads a single bit from the `Slice`: if it's 1, then the referenced `Cell` is
/// preloaded and returned. If the preloaded bit is 0, then `null` is returned. Doesn't modify the original `Slice`.
///
/// ```tact
/// fun examples() {
///     let s1: Slice = beginCell().storeMaybeRef(emptyCell()).asSlice();
///     let fizz: Cell = s1.preloadMaybeRef(); // returns emptyCell() and doesn't modify s1
///
///     let s2: Slice = beginCell()
///         .storeMaybeRef(null)
///         .storeMaybeRef(s1.asCell())
///         .asSlice();
///
///     let ref1: Cell = s2.preloadMaybeRef(); // returns null and doesn't modify s2
///     let ref2: Cell = s2.preloadMaybeRef(); // same effect
///     ref1 == null; // true
///     ref1 == ref2; // true
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#slicepreloadmayberef
/// * https://docs.tact-lang.org/book/exit-codes
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun preloadMaybeRef(self: Slice): Cell? { PLDOPTREF }

/// Extension mutation function for the `Slice` type.
///
/// Loads `0 ≤ l ≤ 1023` bits from the `Slice` and returns them as a separate `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let fizz: Slice = s.loadBits(7);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `l` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceloadbits
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
@name(load_bits) // special treatment in Func compiler, so not replaced with asm "LDSLICEX"
extends mutates native loadBits(self: Slice, l: Int): Slice;

/// Extension function for the `Slice` type.
///
/// Preloads `0 ≤ l ≤ 1023` bits from the `Slice` and returns them as a separate `Slice`.
/// Doesn't modify the original `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let fizz: Slice = s.preloadBits(7);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `l` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicepreloadbits
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
@name(preload_bits) // special treatment in Func compiler, so not replaced with asm "PLDSLICEX"
extends native preloadBits(self: Slice, l: Int): Slice;

/// Extension mutation function for the `Slice` type.
///
/// Loads and returns a signed `l`-bit `Int` from the `Slice`, for `0 ≤ l ≤ 257`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let fizz: Int = s.loadInt(7);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `l` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceloadint
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
@name(load_int) // special treatment in Func compiler, so not replaced with asm "LDIX"
extends mutates native loadInt(self: Slice, l: Int): Int;

/// Extension function for the `Slice` type.
///
/// Preloads and returns a signed `l`-bit `Int` from the `Slice`, for `0 ≤ l ≤ 257`.
/// Doesn't modify the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let fizz: Int = s.preloadInt(7);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `l` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicepreloadint
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
@name(preload_int) // special treatment in Func compiler, so not replaced with asm "PLDIX"
extends native preloadInt(self: Slice, l: Int): Int;

/// Extension mutation function for the `Slice` type.
///
/// Loads and returns an unsigned `l`-bit `Int` from the `Slice`, for `0 ≤ l ≤ 256`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeUint(42, 7).asSlice();
///     let fizz: Int = s.loadUint(7);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `l` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceloaduint
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
@name(load_uint) // special treatment in Func compiler, so not replaced with asm "LDUX"
extends mutates native loadUint(self: Slice, l: Int): Int;

/// Extension function for the `Slice` type.
///
/// Preloads and returns an unsigned `l`-bit `Int` from the `Slice`, for `0 ≤ l ≤ 256`.
/// Doesn't modify the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeUint(42, 7).asSlice();
///     let fizz: Int = s.preloadUint(7);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `l` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicepreloaduint
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
@name(preload_uint) // special treatment in Func compiler, so not replaced with asm "PLDUX"
extends native preloadUint(self: Slice, l: Int): Int;

/// Extension mutation function for the `Slice` type.
///
/// Loads a single bit and returns a `Bool` value from the `Slice`.
/// Reads `true` if the loaded bit is equal to 1, and reads `false` otherwise.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeBool(true).asSlice();
///     let fizz: Bool = s.loadBool(); // true
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceloadint
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadBool(self: Slice): Bool { 1 LDI }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Skips a single bit from the `Slice`. Similar to discarding the return value of `Slice.loadBool()`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell()
///         .storeBool(true)
///         .storeUint(42, 7)
///         .asSlice();
///
///     s.skipBool();
///     let fizz: Int = s.loadUint(7); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than the `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipbool
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipBool(self: Slice) { 1 LDI NIP }

/// Extension mutation function for the `Slice` type. Available since Tact 1.5.0.
///
/// Alias to `Slice.loadBool()`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeBool(true).asSlice();
///     let fizz: Bool = s.loadBit(); // true
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than the `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadbit
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadBit(self: Slice): Bool { 1 LDI }

/// Extension mutation function for the `Slice` type.
///
/// Loads and returns a serialized unsigned `Int` value in the range from 0 to 2^120 - 1
/// inclusive from the `Slice`. This value usually represents the amount in nanoToncoins.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeCoins(42).asSlice();
///     let fizz: Int = s.loadCoins(); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadcoins
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadCoins(self: Slice): Int { LDVARUINT16 }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Skips a serialized unsigned `Int` value in the range from 0 to 2^120 - 1
/// inclusive from the `Slice`. Similar to discarding the return value of `Slice.loadCoins()`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell()
///         .storeCoins(239)
///         .storeUint(42, 7)
///         .asSlice();
///
///     s.skipCoins();
///     let fizz: Int = s.loadUint(7); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipcoins
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipCoins(self: Slice) { LDVARUINT16 NIP }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.0.
///
/// Alias to `Slice.loadCoins()`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeVarUint16(42).asSlice();
///     let fizz: Int = s.loadVarUint16(); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadvaruint16
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadcoins
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadVarUint16(self: Slice): Int { LDVARUINT16 }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Alias to `Slice.skipCoins()`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell()
///         .storeVarUint16(239)
///         .storeUint(42, 7)
///         .asSlice();
///
///     s.skipVarUint16();
///     let fizz: Int = s.loadUint(7); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipvaruint16
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipcoins
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipVarUint16(self: Slice) { LDVARUINT16 NIP }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.0.
///
/// Similar to `Slice.loadCoins()`, but with a different `value` range: from -2^119 to 2^119 - 1 inclusive.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeVarInt16(-42).asSlice();
///     let fizz: Int = s.loadVarInt16(); // -42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadvarint16
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadVarInt16(self: Slice): Int { LDVARINT16 }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Similar to `Slice.skipCoins()`, but with a different `value` range: from -2^119 to 2^119 - 1 inclusive.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell()
///         .storeVarInt16(-239)
///         .storeUint(42, 7)
///         .asSlice();
///
///     s.skipVarInt16();
///     let fizz: Int = s.loadUint(7); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipvarint16
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipVarInt16(self: Slice) { LDVARINT16 NIP }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.0.
///
/// Loads and returns a serialized unsigned `Int` value in the range from 0 to 2^248 − 1 inclusive from the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeVarUint32(420000).asSlice();
///     let fizz: Int = s.loadVarUint32(); // 420000
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadvaruint32
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadVarUint32(self: Slice): Int { LDVARUINT32 }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Skips a serialized unsigned `Int` value in the range from 0 to 2^248 − 1 inclusive
/// from the `Slice`. Similar to discarding the return value of `Slice.loadVarUint32()`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell()
///         .storeVarUint32(239)
///         .storeUint(42, 7)
///         .asSlice();
///
///     s.skipVarUint32();
///     let fizz: Int = s.loadUint(7); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipvaruint32
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipVarUint32(self: Slice) { LDVARUINT32 NIP }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.0.
///
/// Similar to `Slice.loadVarUint32()`, but with a different `value` range:
/// from -2^247 to 2^247 - 1 inclusive.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeVarInt32(-420000).asSlice();
///     let fizz: Int = s.loadVarInt32(); // -420000
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to load more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceloadvarint32
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm(-> 1 0) extends mutates fun loadVarInt32(self: Slice): Int { LDVARINT32 }

/// Extension mutation function for the `Slice` type. Available since Tact 1.6.2.
///
/// Similar to `Slice.skipVarUint32()`, but with a different `value` range:
/// from -2^247 to 2^247 - 1 inclusive.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell()
///         .storeVarInt32(-239)
///         .storeUint(42, 7)
///         .asSlice();
///
///     s.skipVarInt32();
///     let fizz: Int = s.loadUint(7); // 42
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to skip more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipvaruint32
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipVarInt32(self: Slice) { LDVARINT32 NIP }

/// Extension mutation function for the `Slice` type.
///
/// Loads all but the first `0 ≤ l ≤ 1023` bits from the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     s.skipBits(5);                   // all but first 5 bits
///     let fizz: Slice = s.loadBits(1); // load only 1 bit
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `l` value.
/// * 9: [Cell underflow] — Thrown when attempting to load more data than the `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#sliceskipbits
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends mutates fun skipBits(self: Slice, l: Int) { SDSKIPFIRST }

/// Extension function for the `Slice` type.
///
/// Checks whether the `Slice` is empty (i.e., contains no bits of data and no cell references).
/// If it is not, it throws an exception with [exit code 9]: `Cell underflow`.
///
/// ```tact
/// fun example() {
///     let emptyOne: Slice = emptySlice();
///     emptyOne.endParse(); // nothing, as it's empty
///
///     let paul: Slice = "Fear is the mind-killer".asSlice();
///     try {
///         paul.endParse(); // throws exit code 9
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when the `Slice` is not empty.
///
/// [exit code 9]: https://docs.tact-lang.org/book/exit-codes#9
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun endParse(self: Slice) { ENDS }

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Preloads all but the last `0 ≤ len ≤ 1023` bits from the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let allButLastFive: Slice = s.skipLastBits(5); // all but last 5 bits,
///                                                    // i.e. only first 2
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `len` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceskiplastbits
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun skipLastBits(self: Slice, len: Int): Slice { SDSKIPLAST }

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Preloads the first `0 ≤ len ≤ 1023` bits from the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let firstFive: Slice = s.firstBits(5); // first 5 bits
/// }
/// ```
///
/// In order to reduce gas usage, prefer calling `Slice.preloadBits()` over using this function since the former is more optimized.
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `len` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#slicefirstbits
/// * https://docs.tact-lang.org/ref/core-cells#slicepreloadbits
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun firstBits(self: Slice, len: Int): Slice { SDCUTFIRST }

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Preloads the last `0 ≤ len ≤ 1023` bits from the `Slice`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let lastFive: Slice = s.lastBits(5); // last 5 bits
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify an out-of-bounds `len` value.
/// * 9: [Cell underflow] — Thrown when attempting to preload more data than `Slice` contains.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#slicelastbits
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun lastBits(self: Slice, len: Int): Slice { SDCUTLAST }

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Computes and returns the `Int` depth of the `Slice`. Produces 0 if
/// the `Slice` has no references, otherwise 1 plus the maximum of the depths of the referenced cells.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).asSlice();
///     let depth: Int = s.depth(); // 0
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicedepth
///
asm extends fun depth(self: Slice): Int { SDEPTH }

//
// Slice size
//

/// Extension function for the `Slice` type.
///
/// Returns the number of references in the `Slice` as an `Int`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
///     let fizz: Int = s.refs();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicerefs
///
asm extends fun refs(self: Slice): Int { SREFS }

/// Extension function for the `Slice` type.
///
/// Returns the number of data bits in the `Slice` as an `Int`.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
///     let fizz: Int = s.bits();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicebits
///
asm extends fun bits(self: Slice): Int { SBITS }

/// Extension function for the `Slice` type.
///
/// Checks whether the `Slice` is empty (i.e., contains no bits of data and no cell references).
/// Returns `true` if it is empty, `false` otherwise.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
///     let fizz: Bool = s.empty();                     // false
///     let buzz: Bool = beginCell().asSlice().empty(); // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceempty
///
asm extends fun empty(self: Slice): Bool { SEMPTY }

/// Extension function for the `Slice` type.
///
/// Checks whether the `Slice` has no bits of data.
/// Returns `true` if it has no data, `false` otherwise.
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
///     let fizz: Bool = s.dataEmpty();  // true
///
///     let s2: Slice = beginCell().storeInt(42, 7).asSlice();
///     let buzz: Bool = s2.dataEmpty(); // false
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicedataempty
///
asm extends fun dataEmpty(self: Slice): Bool { SDEMPTY }

/// Extension function for the `Slice` type.
///
/// Checks whether the `Slice` has no references.
/// Returns `true` if it has no references, `false` otherwise.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
///     let fizz: Bool = s.refsEmpty();                     // false
///     let buzz: Bool = beginCell().asSlice().refsEmpty(); // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicerefsempty
///
asm extends fun refsEmpty(self: Slice): Bool { SREMPTY }

//
// Conversions
//

/// Extension function for the `Builder` type.
///
/// Converts the `Builder` into a `Slice` and returns it.
/// An alias to `self.endCell().beginParse()`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Slice = b.asSlice();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderasslice
///
inline extends fun asSlice(self: Builder): Slice {
    return self.endCell().beginParse();
}

/// Extension function for the `Cell` type.
///
/// Converts the `Cell` to a `Slice` and returns it.
/// An alias to `self.beginParse()`.
///
/// ```tact
/// fun example() {
///     let c: Cell = emptyCell();
///     let fizz: Slice = c.asSlice();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#cellasslice
///
inline extends fun asSlice(self: Cell): Slice {
    return self.beginParse();
}

/// Extension function for the `Slice` type.
///
/// Converts the `Slice` to a `Cell` and returns it.
/// An alias to `beginCell().storeSlice(self).endCell()`.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().asSlice();
///     let fizz: Cell = s.asCell();
///     let buzz: Cell = beginCell().storeSlice(s).endCell();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceascell
///
inline extends fun asCell(self: Slice): Cell {
    return beginCell()
        .storeSlice(self)
        .endCell();
}

/// Extension function for the `Builder` type.
///
/// Converts the `Builder` into a `Cell` and returns it.
/// An alias to `self.endCell()`.
///
/// ```tact
/// fun example() {
///     let b: Builder = beginCell();
///     let fizz: Cell = b.asCell();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#builderascell
///
inline extends fun asCell(self: Builder): Cell {
    return self.endCell();
}

/// Creates and returns an empty `Cell` (without data and references).
/// An alias to `beginCell().endCell()`.
///
/// ```tact
/// fun example() {
///     let fizz: Cell = emptyCell();
///     let buzz: Cell = beginCell().endCell();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#emptycell
///
asm fun emptyCell(): Cell {
    <b b> PUSHREF // Pure Fift: "<b" creates a builder, "b>" turns it into a cell at compile time
}

/// Creates and returns an empty `Slice` (without data and references).
/// An alias to `emptyCell().asSlice()`.
///
/// ```tact
/// fun example() {
///     let fizz: Slice = emptySlice();
///     let buzz: Slice = emptyCell().asSlice();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#emptyslice
///
asm fun emptySlice(): Slice {
    b{} PUSHSLICE
}

/// Struct for holding values computed by the `Cell.computeDataSize()` and `Slice.computeDataSize()` extension functions. Available since Tact 1.6.0.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-cells#cellcomputedatasize
/// * https://docs.tact-lang.org/ref/core-cells#slicecomputedatasize
///
struct DataSize {
    /// The total number of nested cells, including the starting one.
    cells: Int;

    /// The total number of bits in all nested cells, including the starting one.
    bits: Int;

    /// The total number of refs in all nested cells, including the starting one.
    refs: Int;
}

/// Extension function for the `Cell` type. Available since Tact 1.6.0.
///
/// Computes and returns the number of distinct cells, bits and refs in the `Cell` by using a depth-first search (DFS) algorithm, recursively traversing each referenced cell. This function is computationally expensive and can consume a lot of gas. If `self` is `null`, returns `DataSize` with all fields set to 0.
///
/// The results are packed into a `DataSize` struct consisting of:
/// * `cells: Int`, the total number of nested cells, including the starting one
/// * `bits: Int`, the total number of bits in all nested cells, including the starting one
/// * `refs: Int`, the total number of refs in all nested cells, including the starting one
///
/// ```tact
/// fun example() {
///     let c: Cell = beginCell().storeInt(42, 7).storeRef(emptyCell()).endCell();
///     try {
///         let dataSize: DataSize = c.computeDataSize(2);
///         dataSize.cells; // 2
///         dataSize.bits;  // 7
///         dataSize.refs;  // 1
///     } catch (exitCode) {
///         // if maxCells was insufficient to traverse the cell
///         // and all of its references, the exitCode here would be 8
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify a negative value of `maxCells`.
/// * 8: [Cell overflow] — Thrown when the specified `maxCells` value isn't enough to traverse all cells including the starting one.
///
/// See: https://docs.tact-lang.org/ref/core-cells#cellcomputedatasize
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun computeDataSize(self: Cell?, maxCells: Int): DataSize { CDATASIZE }

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Similar to `Cell.computeDataSize()`, but doesn't take into account the cell that contains the `Slice` itself. However, accounts for its bits and refs.
///
/// The results are packed into a `DataSize` struct consisting of:
/// * `cells: Int`, the total number of nested cells, including the starting one
/// * `bits: Int`, the total number of bits in all nested cells, including the starting one
/// * `refs: Int`, the total number of refs in all nested cells, including the starting one
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().storeInt(42, 7).storeRef(emptyCell()).asSlice();
///     try {
///         let dataSize: DataSize = s.computeDataSize(1);
///         dataSize.cells; // 1
///         dataSize.bits;  // 7
///         dataSize.refs;  // 1
///     } catch (exitCode) {
///         // if maxCells was insufficient to traverse the cell
///         // and all of its references, the exitCode here would be 8
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify a negative value of `maxCells`.
/// * 8: [Cell overflow] — Thrown when the specified `maxCells` value isn't enough to traverse all cells **not** including the starting one.
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicecomputedatasize
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Cell overflow]: https://docs.tact-lang.org/book/exit-codes#8
///
asm extends fun computeDataSize(self: Slice, maxCells: Int): DataSize { SDATASIZE }

/// Extension function for the `Cell` type. Available since Tact 1.6.0.
///
/// Computes and returns the `Int` depth of the `Cell`. Produces 0 if the `Cell` has no references, otherwise 1 plus the maximum of the depths of the referenced cells. If c is null, returns zero.
///
/// ```tact
/// fun example() {
///     let c: Cell = beginCell().storeInt(42, 7).endCell();
///     let depth: Int = c.depth(); // 0
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#celldepth
///
asm extends fun depth(self: Cell?): Int { CDEPTH }



================================================
FILE: src/stdlib/stdlib/std/internal/config.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/config.tact
================================================
/// Loads a [configuration parameter] of TON Blockchain by its `id` number.
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#getconfigparam
///
/// [configuration parameter]: https://docs.ton.org/develop/howto/blockchain-configs
///
asm fun getConfigParam(id: Int): Cell? { CONFIGOPTPARAM }



================================================
FILE: src/stdlib/stdlib/std/internal/context.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/context.tact
================================================
/// Represents the context of the current message.
struct Context {
    /// Indicates whether the received message can
    /// [bounce back](https://docs.ton.org/v3/documentation/smart-contracts/message-management/non-bounceable-messages).
    bounceable: Bool;

    /// Internal address of the sender on the TON Blockchain.
    sender: Address;

    /// Amount of [nanoToncoin](https://docs.tact-lang.org/book/integers#nanotoncoin) in the received message.
    value: Int;

    /// The remainder of the received message as a `Slice`. It follows the [internal message layout]
    /// of TON, starting from the destination `Address` (`MsgAddressInt` in [TL-B notation]).
    ///
    /// [internal message layout]: https://docs.ton.org/develop/smart-contracts/messages#message-layout
    /// [TL-B notation]: https://docs.ton.org/develop/data-formats/tl-b-language
    raw: Slice;
}

/// Returns `Context` struct, which consists of:
///
/// * `bounceable` — Indicates whether the received message can [bounce back].
/// * `sender` — Internal address of the sender on the TON blockchain.
/// * `value` — Amount of [nanoToncoin] in the received message.
/// * `raw` — The remainder of the received message as a `Slice`. It follows the [internal message layout] of TON, starting from the destination `Address` (`MsgAddressInt` in [TL-B notation]).
///
/// ```tact
/// fun test() {
///     let ctx: Context = context();
///     require(ctx.value != 68 + 1, "Invalid amount of nanoToncoins, bye!");
/// }
/// ```
///
/// Note: If you only need to know who sent the message, use the `sender()` function,
/// as it is less gas-consuming.
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#context
///
/// [bounce back]: https://docs.ton.org/v3/documentation/smart-contracts/message-management/non-bounceable-messages
/// [nanoToncoin]: https://docs.tact-lang.org/book/integers#nanotoncoin
/// [internal message layout]: https://docs.ton.org/develop/smart-contracts/messages#message-layout
/// [TL-B notation]: https://docs.ton.org/develop/data-formats/tl-b-language
///
@name(__tact_context_get)
native context(): Context;

/// Global function. Available since Tact 1.6.7.
///
/// Returns the `Slice` with the original, raw body of the received message.
///
/// That `Slice` can:
///
/// * be empty, which means the contract has received an empty message body that is handled in the empty receiver `receive()` or the catch-all slice receiver `receive(msg: Slice)`;
/// * start with 4 zero bytes, which means the contract has received a text message that is handled in the relevant receiver:
///   * the exact text receiver `receive("message")`,
///   * the catch-all string receiver `receive(msg: String)`,
///   * or the catch-all slice receiver `receive(msg: Slice)`;
/// * start with 4 bytes of a non-zero message opcode that the corresponding binary receiver `receive(msg: MessageStruct)` or the catch-all slice receiver `receive(msg: Slice)` would handle.
///
/// ```tact
/// // This contract defines various kinds of receivers in their
/// // order of handling the corresponding incoming messages.
/// contract OrderOfReceivers() {
///     receive() {
///         let body = inMsg();
///         body.bits(); // 0
///     }
///
///     receive("yeehaw!") {
///         let body = inMsg();
///         body.loadUint(32); // 0
///         body.hash() == "yeehaw!".asSlice().hash(); // true
///     }
///
///     receive(str: String) {
///         let body = inMsg();
///         body.loadUint(32); // 0
///         body == str.asSlice(); // true
///     }
///
///     receive(msg: Emergency) {
///         let body = inMsg();
///         body.preloadUint(32); // 911
///     }
///
///     receive(rawMsg: Slice) {
///         let body = inMsg();
///         body == rawMsg; // true
///     }
/// }
///
/// message(911) Emergency {}
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#inmsg
///
@name(__tact_in_msg_get)
native inMsg(): Slice;

/// Returns the `Address` of the sender of the current message.
///
/// ```tact
/// contract MeSee {
///     receive() {
///         let whoSentMeMessage: Address = sender();
///     }
/// }
/// ```
///
/// Note: Behavior is undefined for [getter functions], because they cannot have a sender
/// nor can they send messages.
///
/// Tip: To reduce gas usage, prefer using this function over calling `context().sender`
/// when you only need to know the sender of the message.
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#sender
///
/// [getter functions]: https://docs.tact-lang.org/book/contracts#getter-functions
///
@name(__tact_context_get_sender)
native sender(): Address;

/// Extension function for the `Context` structure.
///
/// Reads forward fee and returns it as `Int` amount of nanoToncoins.
///
/// ```tact
/// fun example() {
///     let fwdFee: Int = context().readForwardFee();
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-contextstate#contextreadforwardfee
/// * https://docs.tact-lang.org/ref/core-gas#getoriginalfwdfee
///
asm extends fun readForwardFee(self: Context): Int {
    // Only the self.raw (Context.raw) is important,
    // so all the other fields and loaded values will be dropped by `BLKDROP2`
    //
    // Context.raw starts at the dest:MsgAddressInt, following this TL-B scheme:
    // int_msg_info$0
    //   ihr_disabled:Bool
    //   bounce:Bool
    //   bounced:Bool
    //   src:MsgAddress
    //   dest:MsgAddressInt ← here is the start
    //   value:CurrencyCollection
    //   ihr_fee:Grams
    //   fwd_fee:Grams
    //   created_lt:uint64
    //   created_at:uint32
    // = CommonMsgInfoRelaxed;

    LDMSGADDR   // load dest:MsgAddressInt
    LDGRAMS     // load value:CurrencyCollection
    ONE
    SDSKIPFIRST // skip extra currency collection
    LDGRAMS     // load ihr_fee
    LDGRAMS     // load fwd_fee, we'll be using this!
    DROP        // drop remaining Slice (with created_lt and created_at)

    // There are 7 entries on the stack — first 3 fields of Context plus 4 loaded ones.
    // The topmost is fwd_fee, which is the only one we're after, so let's drop 6 entries below:
    6 1 BLKDROP2 // drop the loaded values as well as the first 3 fields of Context

    ZERO              // not masterchain
    GETORIGINALFWDFEE // floor(fwd_fee * 2^16 / (2^16 - first_frac)), where
                      // first_frac is a value listed in config param 25
                      // of the blockchain: https://tonviewer.com/config#25
                      // this instruction effectively multiplies the fwd_fee by 1.5,
                      // at least for the current value of first_frac, which is 21845
}



================================================
FILE: src/stdlib/stdlib/std/internal/contract.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/contract.tact
================================================
/// Global function. Available since Tact 1.6.0.
///
/// Computes and returns an `Int` value of the SHA-256 hash of the `code` and `data` of the given contract. To assemble the `code` and `data` cells together for hashing, the standard `Cell` representation is used.
///
/// This hash is commonly called account ID. Together with the workchain ID it deterministically forms the address of the contract on TON Blockchain.
///
/// ```tact
/// fun example() {
///     let initPkg: StateInit = initOf SomeContract();
///     let accountId: Int = contractHash(initPkg.code, initPkg.data);
///     let basechainAddr: Address = newAddress(0, accountId);
///     let basechainAddr2: Address = contractAddressExt(0, initPkg.code, initPkg.data);
///
///     basechainAddr == basechainAddr2; // true
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-addresses#contracthash
/// * https://docs.tact-lang.org/ref/core-addresses#newaddress
/// * https://docs.tact-lang.org/ref/core-addresses#contractaddressext
///
asm fun contractHash(code: Cell, data: Cell): Int {
    // According to the https://docs.tact-lang.org/book/cells#cells-representation,
    // the layout for the Builder to hash goes as follows:
    // 1) refs_descriptor:bits8 | bits_descriptor:bits8 | data:bitsN
    //
    //  refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
    //                   2 refs (code + data), non-exotic, zero-mask
    //
    //  bits_descriptor: floor(bit_count / 8) + ceil(bit_count, 8)
    //                   floor (5 bits / 8) + ceil(5 bits / 8) = 0 + 1 = 1
    //
    //  data: [0b00110] + [0b100] = [0b00110100] = 0x34 (data + augmented bits)
    //        0b00110 - data (split_depth, special, code, data, Library)
    //        0b100 - augmented bits (Leading 1 + zeroes to make section multiple of eight)
    //
    //  That is: (2 << 16) | (1 << 8) | 0x34 = 131380 for all three.
    //
    // 2) and 3) depth_descriptors: CDEPTH of `code` and CDEPTH of `data`
    // 4) and 5) ref hashes: HASHCU of `code` and HASHCU of `data`

    // Group 1: Computations and arrangements
    s0 PUSH HASHCU // `data` hash
    s2 PUSH HASHCU // `code` hash
    SWAP2
    CDEPTH         // `data` depth
    SWAP
    CDEPTH         // `code` depth
    131380 INT     // (2 << 16) | (1 << 8) | 0x34

    // Group 2: Composition of the Builder
    NEWC
    24 STU  // store refs_descriptor | bits_descriptor | data
    16 STU  // store depth_descriptor for `code`
    16 STU  // store depth_descriptor for `data`
    256 STU // store `code` hash
    256 STU // store `data` hash

    // Group 3: SHA256 hash of the resulting Builder
    ONE HASHEXT_SHA256
}

/// Global function.
///
/// Computes smart contract's `Address` in the `chain` ID using the contract's `code` and the contract's initial state `data`. Use the `initOf` expression to obtain the initial `code` and initial `data` of a given contract.
///
/// This function lets you specify arbitrary `chain` IDs, including the common -1 (masterchain) and 0 (basechain) ones.
///
/// ```tact
/// fun example() {
///     let initPkg: StateInit = initOf SomeContract();
///     let hereBeDragons: Address = contractAddressExt(0, initPkg.code, initPkg.data);
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-addresses#contractaddressext
/// * https://docs.tact-lang.org/book/expressions#initof
///
inline fun contractAddressExt(chain: Int, code: Cell, data: Cell): Address {
    let hash = contractHash(code, data);
    return newAddress(chain, hash);
}

/// Struct containing the initial state, i.e. initial code and initial data of the given contract upon its deployment.
///
/// See: https://docs.tact-lang.org/book/expressions#initof
///
struct StateInit {
    /// Initial code of the contract (compiled bitcode)
    code: Cell;

    /// Initial data of the contract (parameters of `init()` function or contract parameters)
    data: Cell;
}

/// Global function. Available since Tact 1.6.1.
///
/// Checks if the given `address` corresponds to the contract address in the workchain ID 0 (basechain) derived from the `StateInit` `self`. Returns `true` if the addresses match and `false` otherwise.
///
/// This function works correctly only for basechain addresses. It may produce false positives or negatives if the specified `address` or the address derived from the `StateInit` `self` has a non-zero workchain ID.
///
/// #### Usage
///
/// ```tact
/// contract Parent() {
///     receive() {
///         let childContract = initOf Child(myAddress());
///
///         // If you are working with contracts on the basechain, this
///         let expensiveCheck = contractAddress(childContract) == sender();
///
///         // is more expensive than doing this
///         let cheaperCheck = childContract.hasSameBasechainAddress(sender());
///
///         // while the results are the same
///         expensiveCheck == cheaperCheck; // true
///     }
/// }
///
/// contract Child(parentAddr: Address) {
///     receive() {
///         // Forwards surplus to the parent address by sending a message
///         // with an empty body and all remaining funds from the received message
///         cashback(self.parentAddr);
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when the specified `address` cannot be parsed as a `StdAddress`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-addresses#stateinithassamebasechainaddress
/// * https://docs.tact-lang.org/ref/core-addresses#contractaddress
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
inline extends fun hasSameBasechainAddress(self: StateInit, address: Address): Bool {
    let addressHash = parseStdAddress(address.asSlice()).address;
    let baseAddress = contractBasechainAddress(self);
    return baseAddress.hash!! == addressHash;
}

/// Global function.
///
/// Computes smart contract's `Address` in the workchain ID 0 (basechain) using the `StateInit` `s` of the contract. Alias to `contractAddressExt(0, s.code, s.data)`.
///
/// ```tact
/// fun example() {
///     let s: StateInit = initOf SomeContract();
///     let foundMeSome: Address = contractAddress(s);
///     let andSomeMore: Address = contractAddressExt(0, s.code, s.data);
///
///     foundMeSome == andSomeMore; // true
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-addresses#contractaddress
/// * https://docs.tact-lang.org/ref/core-addresses#contractaddressext
/// * https://docs.tact-lang.org/book/expressions#initof
///
inline fun contractAddress(s: StateInit): Address {
    return contractAddressExt(0, s.code, s.data);
}

/// Global function.
///
/// Returns the address of the current smart contract as an `Address`.
///
/// ```tact
/// fun example() {
///     let meMyselfAndI: Address = myAddress();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#myaddress
///
asm fun myAddress(): Address { MYADDR }

/// Global function.
///
/// Returns the nanoToncoin `Int` balance of the smart contract as it was at the start of the compute phase of the current transaction.
///
/// ```tact
/// fun example() {
///     let iNeedADolla: Int = myBalance();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#mybalance
///
asm fun myBalance(): Int { BALANCE FIRST }

/// Global function. Available since Tact 1.5.0.
///
/// Returns the nanoToncoin `Int` amount of gas consumed by TVM in the current transaction so far. The resulting value includes the cost of calling this function.
///
/// ```tact
/// fun example() {
///     let gas: Int = gasConsumed();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#gasconsumed
///
asm fun gasConsumed(): Int { GASCONSUMED }

/// Global function. Available since Tact 1.5.0.
///
/// Returns the nanoToncoin `Int` amount of the accumulated storage fee debt. Storage fees are deducted from the incoming message value before the new contract balance is calculated.
///
/// ```tact
/// fun example() {
///     let debt: Int = myStorageDue();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#mystoragedue
///
asm fun myStorageDue(): Int { DUEPAYMENT }

/// Global function. Available since Tact 1.5.0.
///
/// Calculates and returns the storage fee in nanoToncoins `Int` for storing a contract with a given number of `cells` and `bits` for a number of `seconds`. Uses the prices of the masterchain if `isMasterchain` is `true`, otherwise the prices of the basechain. The current prices are obtained from the config param 18 of TON Blockchain.
///
/// Note, that specifying values of `cells` and `bits` higher than their maximum values listed in account state limits (`max_acc_state_cells` and `max_acc_state_bits`) will have the same result as with specifying the exact limits. In addition, make sure you take into account the deduplication of cells with the same hash.
///
/// ```tact
/// fun example() {
///     let fee: Int = getStorageFee(1_000, 1_000, 1_000, false);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify negative number of `cells`, `bits` or `seconds`.
///
/// See: https://docs.tact-lang.org/ref/core-gas#getstoragefee
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun getStorageFee(cells: Int, bits: Int, seconds: Int, isMasterchain: Bool): Int { GETSTORAGEFEE }

/// Global function. Available since Tact 1.5.0.
///
/// Calculates and returns the compute fee in nanoToncoins `Int` for a transaction that consumed `gasUsed` amount of gas. Uses the prices of the masterchain if `isMasterchain` is `true`, otherwise the prices of the basechain. The current prices are obtained from the config param 20 for the masterchain and config param 21 for the basechain of TON Blockchain.
///
/// When the `gasUsed` is less than a certain threshold called `flat_gas_limit`, there's a minimum price to pay based on the value of `flat_gas_price`. The less gas is used below this threshold, the higher the minimum price will be. See the example for `getSimpleComputeFee()` to derive that threshold.
///
/// ```tact
/// fun example() {
///     let fee: Int = getComputeFee(1_000, false);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify negative value of `gasUsed`.
///
/// See: https://docs.tact-lang.org/ref/core-gas#getcomputefee
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun getComputeFee(gasUsed: Int, isMasterchain: Bool): Int { GETGASFEE }

/// Global function. Available since Tact 1.5.0.
///
/// Similar to `getComputeFee()`, but without the `flat_gas_price`, i.e. without a minimum price to pay if the `gasUsed` is less than a certain threshold called `flat_gas_limit`. Calculates and returns only the `gasUsed` times the current gas price.
///
/// ```tact
/// fun example() {
///     let fee = getComputeFee(0, false);
///     let feeNoFlat = getSimpleComputeFee(0, false);
///     let maxFlatPrice = fee - feeNoFlat;
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify negative number of `cells`, `bits` or `seconds`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-gas#getsimplecomputefee
/// * https://docs.tact-lang.org/ref/core-gas#getcomputefee
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun getSimpleComputeFee(gasUsed: Int, isMasterchain: Bool): Int { GETGASFEESIMPLE }

/// Global function. Available since Tact 1.5.0.
///
/// Calculates and returns the forward fee in nanoToncoins `Int` for an outgoing message consisting of a given number of `cells` and `bits`. Uses the prices of the masterchain if `isMasterchain` is `true`, otherwise the prices of the basechain. The current prices are obtained from the config param 24 for the masterchain and config param 25 for the basechain of TON Blockchain.
///
/// If both the source and the destination addresses are in the basechain, then specify `isMasterchain` as `false`. Otherwise, specify `true`.
///
/// Note, that specifying values of `cells` and `bits` higher than their maximum values listed in account state limits (`max_msg_cells` and `max_msg_bits`) will have the same result as with specifying the exact limits.
///
/// However, regardless of the values of `cells` and `bits`, this function always adds the minimum price based on the value of `lump_price`. See the example for `getSimpleForwardFee()` to derive it. In addition, make sure you take into account the deduplication of cells with the same hash, since for example the root cell and its data bits don't count towards the forward fee and are covered by the `lump_price`.
///
/// ```tact
/// fun example() {
///     let fee: Int = getForwardFee(1_000, 1_000, false);
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify negative number of `cells` or `bits`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-gas#getforwardfee
/// * https://docs.tact-lang.org/ref/core-gas#getsimpleforwardfee
/// * https://docs.tact-lang.org/ref/core-gas#getoriginalfwdfee
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun getForwardFee(cells: Int, bits: Int, isMasterchain: Bool): Int { GETFORWARDFEE }

/// Global function. Available since Tact 1.5.0.
///
/// Similar to `getForwardFee()`, but without the `lump_price`, i.e. without the minimum price to pay regardless of the amount of `cells` or `bits`. Calculates and returns only the `cells` times the current cell price plus `bits` times the current bit price.
///
/// ```tact
/// fun example() {
///     let fee = getForwardFee(1_000, 1_000, false);
///     let feeNoLump = getSimpleForwardFee(1_000, 1_000, false);
///     let lumpPrice = fee - feeNoLump;
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify negative number of `cells` or `bits`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-gas#getsimpleforwardfee
/// * https://docs.tact-lang.org/ref/core-gas#getforwardfee
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun getSimpleForwardFee(cells: Int, bits: Int, isMasterchain: Bool): Int { GETFORWARDFEESIMPLE }

/// Global function. Available since Tact 1.5.0.
///
/// Calculates and returns the so-called _original_ forward fee in nanoToncoin `Int` for a message based on the given `fwdFee` of this message, which can be obtained by calling `getForwardFee()`. If both the source and the destination addresses are in the basechain, specify `isMasterchain` as `false`. Otherwise, specify `true`.
///
/// The result is computed using the `first_frac` value, which is obtained from config param 24 for the masterchain and config param 25 for the basechain of TON Blockchain. Due to the current value of `first_frac` for all workchains, this function performs a cheaper equivalent calculation of `fwdFee * 3 / 2`. This ratio might change, so it is better not to hardcode it and use this function instead.
///
/// This function can be useful when the outgoing message depends heavily on the structure of the incoming message, so you can try to approximate the forward fee for your outgoing message based on the fee the sender paid. Calculating the exact fee with nanoToncoin-level precision can be very expensive, so the approximation given by this function is often good enough.
///
/// ```tact
/// fun example() {
///     // Context.readForwardFee() applies getOriginalFwdFee() at the end
///     let origFwdFee: Int = context().readForwardFee();
///
///     // Therefore, calling getOriginalFwdFee() on that value is redundant
///     let origFwdFee2: Int = getOriginalFwdFee(origFwdFee, false);
///
///     // ⌈(2 * origFwdFee2) / origFwdFee⌉ is equal to 3
///     muldivc(2, origFwdFee2, origFwdFee) == 3; // true, but this relation
///                                               // can change in the future
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify a negative value of `fwdFee`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-gas#getoriginalfwdfee
/// * https://docs.tact-lang.org/ref/core-gas#getforwardfee
/// * https://docs.tact-lang.org/ref/core-contextstate#contextreadforwardfee
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun getOriginalFwdFee(fwdFee: Int, isMasterchain: Bool): Int { GETORIGINALFWDFEE }

/// Global function. Available since Tact 1.6.0.
///
/// Sets the `gas_limit` to the `Int` `limit` and resets the `gas_credit` to 0. Note that specifying the `limit` higher than the maximum allowed value of 2^63 - 1 will have the same result as with specifying that exact maximum or calling `acceptMessage()`.
///
/// ```tact
/// fun example() {
///     setGasLimit(42000);
/// }
/// ```
///
/// #### Exit codes
///
/// * -14: [Out of gas error] — Thrown when attempting to specify a negative or insufficient value of `limit`.
///
/// See: https://docs.tact-lang.org/ref/core-gas#setgaslimit
///
/// [Out of gas error]: https://docs.tact-lang.org/book/exit-codes#-14
///
asm fun setGasLimit(limit: Int) { SETGASLIMIT }

/// Global function. Available since Tact 1.6.0.
///
/// Generates and returns an unsigned 256-bit `Int` seed for the random number generator. The resulting seed is commonly used with the `setSeed()` and `nativeRandomize()` functions.
///
/// ```tact
/// fun example() {
///     let seed: Int = getSeed();
///     setSeed(seed); // from now on the results of pseudorandom number generator
///                    // are completely determined by the seed, which can be handy in tests,
///                    // but must not be used in production code!
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-random#getseed
/// * https://docs.tact-lang.org/ref/core-random#setseed
/// * https://docs.tact-lang.org/ref/core-random#nativerandomize
///
asm fun getSeed(): Int { RANDSEED }

/// Global function. Available since Tact 1.6.0.
///
/// Sets the seed of the random number generator to the unsigned 256-bit `Int` `seed` which can be obtained with the `getSeed()` function.
///
/// ```tact
/// fun example() {
///     let seed: Int = getSeed();
///     setSeed(seed); // from now on the results of pseudorandom number generator
///                    // are completely determined by the seed, which can be handy in tests,
///                    // but must not be used in production code!
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify a negative value of `seed`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-random#setseed
/// * https://docs.tact-lang.org/ref/core-random#getseed
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun setSeed(seed: Int) { SETRAND }

/// Global function. Available since Tact 1.6.0.
///
/// Returns the smart contract code `Cell` obtained from the `c7` register.
///
/// ```tact
/// fun example() {
///     let code: Cell = myCode();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#mycode
///
asm fun myCode(): Cell { MYCODE }

/// Global function. Available since Tact 1.7.0. DANGEROUS: Applies irreversible modifications to the contract — use only when you know what you are doing!
///
/// Replaces the current contract's state data [`Cell`][cell] with the new `data`. It is useful only in exceptional cases, such as contract upgrades, data migrations, or when processing external messages with a catch-all [`Slice`][slice] receiver for maximum efficiency. Otherwise, do **not** use this function, as it immediately and permanently overrides the state with no ability to recover, which can result in the loss of funds and partial or full corruption of the contract's data.
///
/// #### Caution
///
/// When using this function, make sure that all logical code branches within your receiver end with a call to the [`throw(0)`][throw] function to terminate the execution of the contract early and prevent the automatic contract's data save implicitly added by Tact after the end of each receiver. Conversely, your manual changes to data made with this function will be lost.
///
/// #### Usage example
///
/// ```tact {13}
/// contract WalletV4(
///     seqno: Int as uint32,
///     // ...other parameters...
/// ) {
///     // ...
///     external(_: Slice) {
///         // ...various prior checks...
///
///         acceptMessage();
///         self.seqno += 1;
///
///         // Manually saving the contract's state
///         setData(self.toCell());
///
///         // And halting the transaction to prevent a secondary save implicitly
///         // added by Tact after the main execution logic of the receiver
///         throw(0);
///     }
/// }
/// ```
///
/// #### Note
///
/// Tact automatically saves the contract's state after the end of each receiver's logic even when `return` statements are used for early termination. Thus, this function is almost never needed in regular contracts.
///
/// However, if you intend to use the `throw(0)` pattern to terminate the compute phase and save the state yourself or you want to replace the data when upgrading the contract, this function becomes useful. That said, make sure to double-check and test cover your every move such that the contract's data won't become corrupt or inadvertently gone.
///
/// #### See also
///
/// - https://docs.tact-lang.org/ref/core-contextstate#setdata
/// - https://docs.tact-lang.org/ref/core-debug#throw
///
/// [cell]: https://docs.tact-lang.org/book/cells#cells
/// [slice]: https://docs.tact-lang.org/book/cells#slices
/// [throw]: https://docs.tact-lang.org/ref/core-debug#throw
///
asm fun setData(data: Cell) { c4 POP }



================================================
FILE: src/stdlib/stdlib/std/internal/crypto.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/crypto.tact
================================================
/// Extension function for the `Cell` type.
///
/// Calculates and returns an `Int` value of the [SHA-256] hash of the
/// [standard `Cell` representation][std-representation] of the given `Cell`.
///
/// ```tact
/// fun example() {
///     let c: Cell = emptyCell();
///     let fizz: Int = c.hash();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#cellhash
///
/// [SHA-256]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard
/// [std-representation]: https://docs.tact-lang.org/book/cells#cells-representation
///
asm extends fun hash(self: Cell): Int { HASHCU }

/// Extension function for the `Slice` type.
///
/// Calculates and returns an `Int` value of the [SHA-256] hash of the
/// [standard `Slice` representation][std-representation] of the given `Slice`.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let s: Slice = beginCell().asSlice();
///     let fizz: Int = s.hash();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicehash
///
/// [SHA-256]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard
/// [std-representation]: https://docs.tact-lang.org/book/cells#cells-representation
///
asm extends fun hash(self: Slice): Int { HASHSU }

/// Extension function for the `Slice` type. Available since Tact 1.6.0.
///
/// Calculates and returns an `Int` value of the SHA-256 hash of the data bits from the given `Slice`, which should have a number of bits divisible by 8.
///
/// Unlike `sha256()`, this function is gas-efficient and **only** hashes the data of the given `Slice`, i.e. up to 1023 bits, ignoring the refs.
///
/// ```tact
/// fun examples() {
///     // Base64-encoded BoC with "Hello, World!"
///     let short: Slice = slice("te6cckEBAQEADgAAGEhlbGxvIHdvcmxkIXgtxbw=");
///
///     // It's enough to only take the hash of the data
///     sha256(short) == short.hashData(); // true
///
///     // But if we construct a slice larger than 1023 bits with all refs combined,
///     // we must use sha256() or we'll get skewed results or even collisions
///
///     let tmp: Builder = beginCell();
///     repeat (127) { tmp = tmp.storeUint(69, 8) } // storing 127 bytes
///     let ref: Cell = beginCell().storeUint(33, 8).endCell();
///     let long: Slice = tmp.storeRef(ref).asSlice(); // plus a ref with a single byte
///
///     // Hashing just the data bits in the current slice isn't enough
///     sha256(long) == long.hashData(); // false!
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to specify a `Slice` with number of bits **not** divisible by 8.
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicehashdata
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun hashData(self: Slice): Int { ONE HASHEXT_SHA256 }

/// Extension function for the `String` type. Available since Tact 1.6.0.
///
/// Calculates and returns an `Int` value of the SHA-256 hash of the data bits from the given `String`, which should have a number of bits divisible by 8.
///
/// Unlike `sha256()`, this function is gas-efficient and **only** hashes up to 127 bytes of the given string. Using longer strings would cause collisions if their first 127 bytes are the same.
///
/// ```tact
/// fun example() {
///     let roll: Int = "Never gonna give you up!".hashData(); // just the hash of the data
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to specify a `String` with number of bits **not** divisible by 8.
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringhashdata
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm extends fun hashData(self: String): Int { ONE HASHEXT_SHA256 }

/// Checks the [Ed25519] `signature` of the 256-bit unsigned `Int` `hash` using a `publicKey`,
/// represented by a 256-bit unsigned `Int`. The signature must contain at least 512 bits of data, but
/// only the first 512 bits are used.
///
/// Returns `true` if the signature is valid, `false` otherwise.
///
/// ```tact
/// message ExtMsg {
///     signature: Slice;
///     data: Cell;
/// }
///
/// contract Showcase {
///     /// Persistent state variables
///     pub: Int as uint256; // public key as a 256-bit unsigned Int
///
///     /// Constructor function init(), where all variables are initialized
///     init(pub: Int) {
///         self.pub = pub; // storing the public key upon contract initialization
///     }
///
///     /// External message receiver, which accepts message ExtMsg
///     external(msg: ExtMsg) {
///         let hash: Int = beginCell().storeRef(msg.data).endCell().hash();
///         let check: Bool = checkSignature(hash, msg.signature, self.pub);
///         //                               ----  -------------  --------
///         //                               ↑     ↑              ↑
///         //                               |     |              publicKey stored in our contract
///         //                               |     signature obtained from the received message
///         //                               hash calculated using the data from the received message
///         // ... follow-up logic ...
///     }
/// }
/// ```
///
/// NOTE: The first 10 calls of this function are very cheap regarding gas usage. However,
/// the 11th call and onward consume more than 4 thousand gas units.
///
/// See: https://docs.tact-lang.org/ref/core-crypto#checksignature
///
/// [Ed25519]: https://en.wikipedia.org/wiki/EdDSA#Ed25519
///
asm fun checkSignature(hash: Int, signature: Slice, publicKey: Int): Bool { CHKSIGNU }

/// Checks the [Ed25519] `signature` of the `data` using a `publicKey`, similar to `checkSignature()`.
/// Verification itself is done indirectly on a [SHA-256] hash of the `data`.
///
/// Returns `true` if the signature is valid, `false` otherwise.
///
/// ```tact
/// fun example() {
///     let data: Slice = someData;
///     let signature: Slice = someSignature;
///     let publicKey: Int = 42;
///
///     let check: Bool = checkDataSignature(data, signature, publicKey);
/// }
/// ```
///
/// NOTE: The first 10 calls of this function are very cheap regarding gas usage. However,
/// the 11th call and onward consume more than 4 thousand gas units.
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when the bit length of `data` is **not** divisible by 8.
///
/// See: https://docs.tact-lang.org/ref/core-crypto#checkdatasignature
///
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
/// [Ed25519]: https://en.wikipedia.org/wiki/EdDSA#Ed25519
/// [SHA-256]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard
///
asm fun checkDataSignature(data: Slice, signature: Slice, publicKey: Int): Bool { CHKSIGNS }

/// A struct that contains a 512-bit [Ed25519] signature and the data it signs.
///
/// ```tact
/// message MessageWithSignedData {
///     // The `bundle.signature` contains the 512-bit Ed25519 signature
///     // of the remaining data fields of this message struct,
///     // while `bundle.signedData` references those data fields.
///     // In this case, the fields are `walletId` and `seqno`.
///     bundle: SignedBundle;
///
///     // These fields are common to external messages to user wallets.
///     walletId: Int as int32;
///     seqno: Int as uint32;
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-crypto#signedbundle
/// * https://docs.tact-lang.org/ref/core-crypto#signedbundleverifysignature
///
/// [Ed25519]: https://en.wikipedia.org/wiki/EdDSA#Ed25519
///
struct SignedBundle {
    /// A 512-bit Ed25519 signature of the `signedData`.
    signature: Slice as bytes64;

    /// The remaining non-serialized data of the enclosing struct or message struct,
    /// which was used to obtain the 512-bit Ed25519 `signature`.
    signedData: Slice as remaining;
}

/// Extension function for the `SignedBundle` struct. Available since Tact 1.6.6.
///
/// Checks whether `self.signedData` was signed by the 512-bit [Ed25519] signature `self.signature`,
/// using the given `publicKey`. Returns `true` if the signature is valid, `false` otherwise.
///
/// ```tact
/// contract Example(publicKey: Int as uint256) {
///     external(msg: MessageWithSignedData) {
///         // Checks that the signature of the SignedBundle from the incoming external
///         // message wasn't forged and made by the owner of this self.publicKey with
///         // its respective private key managed elsewhere.
///         throwUnless(35, msg.bundle.verifySignature(self.publicKey));
///
///         // ...rest of the checks and code...
///     }
/// }
///
/// message MessageWithSignedData {
///     // The `bundle.signature` contains the 512-bit Ed25519 signature
///     // of the remaining data fields of this message struct,
///     // while `bundle.signedData` references those data fields.
///     // In this case, the fields are `walletId` and `seqno`.
///     bundle: SignedBundle;
///
///     // These fields are common to external messages to user wallets.
///     walletId: Int as int32;
///     seqno: Int as uint32;
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-crypto#signedbundleverifysignature
///
/// [Ed25519]: https://en.wikipedia.org/wiki/EdDSA#Ed25519
///
inline extends fun verifySignature(self: SignedBundle, publicKey: Int): Bool {
    return checkSignature(self.signedData.hash(), self.signature, publicKey);
}

/// Global function. Available since Tact 1.6.6.
///
/// Computes and returns the Ethereum-compatible [Keccak-256] hash as a 256-bit unsigned `Int` from the passed `Slice` `data`.
///
/// The `data` slice should have a number of bits divisible by 8 and no more than a single reference per cell, because only the first reference of each nested cell will be taken into account.
///
/// #### Usage
///
/// ```tact
/// contract Examples() {
///     receive(rawMsg: Slice) {
///         // Hash incoming message body Slice
///         let hash: Int = keccak256(rawMsg);
///
///         // Process data that spans multiple cells
///         let b: Builder = beginCell()
///             .storeUint(123456789, 32)
///             .storeRef(beginCell().storeString("Extra data in a ref").endCell());
///         let largeDataHash: Int = keccak256(b.asSlice());
///
///         // Match Ethereum's hash format
///         let ethAddress: String = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
///         let ethAddressHash: Int = keccak256(ethAddress.asSlice());
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to specify a `Slice` with a number of bits **not** divisible by 8.
///
/// #### See also
///
/// * https://docs.tact-lang.org/ref/core-crypto#keccak256
///
/// [Keccak-256]: https://en.wikipedia.org/wiki/SHA-3
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
///
asm fun keccak256(data: Slice): Int {
    <{
        <{ DUP SREFS }> PUSHCONT
        <{ LDREFRTOS }> PUSHCONT
        WHILE
        DEPTH
        HASHEXT_KECCAK256
    }> PUSHCONT
    1 1 CALLXARGS
}



================================================
FILE: src/stdlib/stdlib/std/internal/debug.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/debug.tact
================================================
// these are builtin functions, these get special treatment from FunC
// hence, no asm here

/// Global function.
///
/// Unconditionally throws an exception with an error `code`.
///
/// Execution of the current context stops, statements after `throw` are not executed, and control is passed to the first `try...catch` block on the call stack. If there is no `try` or `try...catch` block among the calling functions, TVM will terminate the transaction.
///
/// ```tact
/// fun thisWillTerminateAbruptly() {
///     throw(1042); // throwing with exit code 1042
/// }
///
/// fun butThisWont() {
///     try {
///         throw(1042); // throwing with exit code 1042
///     }
///
///     // ... follow-up logic ...
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify the `code` outside of 0-65535 range.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug#throw
/// * https://docs.tact-lang.org/book/statements#try-catch
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
@name(throw)
native throw(code: Int);

/// Global function. Available since Tact 1.6.0.
///
/// Similar to `throw()`, but throws an error `code` only if `condition` holds, i.e. `condition` is equal to `true`. Doesn't throw otherwise.
///
/// ```tact
/// contract Ownership {
///     owner: Address;
///
///     init() {
///         self.owner = myAddress();
///     }
///
///     receive() {
///         // Check the sender is the owner of the contract,
///         // and throw exit code 1024 if it's not
///         throwIf(1024, sender() != self.owner);
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify the `code` outside of 0-65535 range.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug#throwif
/// * https://docs.tact-lang.org/book/statements#try-catch
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
@name(throw_if)
native throwIf(code: Int, condition: Bool);

/// Global function. Available since Tact 1.6.0.
///
/// Similar to `throw()`, but throws an error `code` only if `condition` does **not** hold, i.e. `condition` is equal to `true`. Doesn't throw otherwise.
///
/// This function is also similar to `require()`, but uses the specified `code` directly instead of generating one based on the given error message `String`.
///
/// ```tact
/// contract Ownership {
///     owner: Address;
///
///     init() {
///         self.owner = myAddress();
///     }
///
///     receive() {
///         // Check the sender is the owner of the contract,
///         // and throw exit code 1024 if it's not
///         throwUnless(1024, sender() == self.owner);
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify the `code` outside of 0-65535 range.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug#throwunless
/// * https://docs.tact-lang.org/ref/core-debug#require
/// * https://docs.tact-lang.org/book/statements#try-catch
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
@name(throw_unless)
native throwUnless(code: Int, condition: Bool);

/// Global function. **Deprecated** since Tact 1.6.0.
///
/// Use `throw()` instead.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug#throw
/// * https://docs.tact-lang.org/ref/core-debug#nativethrow
///
@name(throw)
native nativeThrow(code: Int);

/// Global function. **Deprecated** since Tact 1.6.0.
///
/// Use `throwIf()` instead.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug#throwif
/// * https://docs.tact-lang.org/ref/core-debug#nativethrowif
///
@name(throw_if)
native nativeThrowIf(code: Int, condition: Bool);

/// Global function. **Deprecated** since Tact 1.6.0.
///
/// Use `throwUnless()` instead.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug#throwunless
/// * https://docs.tact-lang.org/ref/core-debug#nativethrowunless
///
@name(throw_unless)
native nativeThrowUnless(code: Int, condition: Bool);



================================================
FILE: src/stdlib/stdlib/std/internal/exit-codes.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/exit-codes.tact
================================================
/// Configurable since Tact 1.6.
///
/// Thrown when a null reference exception occurs during the compute phase.
///
/// See: https://docs.tact-lang.org/book/exit-codes#128
///
const TactExitCodeNullReferenceException: Int = 128;

/// Thrown when there is a failed deserialization attempt:
/// a certain opcode prefix was expected, but a different one was parsed.
///
/// See: https://docs.tact-lang.org/book/exit-codes#129
///
const TactExitCodeInvalidSerializationPrefix: Int = 129;

/// Thrown when there is no receiver for the opcode of the received message.
///
/// See: https://docs.tact-lang.org/book/exit-codes#130
///
const TactExitCodeInvalidIncomingMessage: Int = 130;

/// Constraints error. Reserved, but never thrown.
///
/// See: https://docs.tact-lang.org/book/exit-codes#131
///
const TactExitCodeConstraintsError: Int = 131;

/// Thrown when the sender is not the owner of the contract inheriting
/// the `Ownable` trait and there has been a mismatch of the `self.owner`
/// and the sender's address.
///
/// See: https://docs.tact-lang.org/book/exit-codes#132
///
const TactExitCodeAccessDenied: Int = 132;

/// Thrown when a message has been sent to a contract inheriting the `Stoppable`
/// trait and has the `self.stopped` flag set to `true`.
///
/// See: https://docs.tact-lang.org/book/exit-codes#133
///
const TactExitCodeContractStopped: Int = 133;

/// Thrown when an invalid or unexpected argument is passed to a function or method.
///
/// See: https://docs.tact-lang.org/book/exit-codes#134
///
const TactExitCodeInvalidArgument: Int = 134;

/// Thrown when a contract's code is missing.
///
/// See: https://docs.tact-lang.org/book/exit-codes#135
///
const TactExitCodeContractCodeNotFound: Int = 135;

/// Thrown when an address does not conform to the expected standard format.
///
/// See: https://docs.tact-lang.org/book/exit-codes#136
///
const TactExitCodeInvalidStandardAddress: Int = 136;

/// Available since Tact 1.6.3.
///
/// Thrown when the address does not belong to a basechain (chain ID 0).
///
/// See: https://docs.tact-lang.org/book/exit-codes#138
///
const TactExitCodeNotBasechainAddress: Int = 138;



================================================
FILE: src/stdlib/stdlib/std/internal/math.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/math.tact
================================================
// Prepare random

/// Global function.
///
/// Randomizes the pseudorandom number generator with the specified unsigned 256-bit `Int` `x` by mixing it with the current seed. The new seed is the unsigned 256-bit `Int` value of the SHA-256 hash of concatenated old seed and `x` in their 32-byte strings big-endian representation.
///
/// ```tact
/// fun example() {
///     nativeRandomize(42);        // now, random numbers are less predictable
///     let idk: Int = randomInt(); // ???, it's random,
///                                 // but the seed was adjusted deterministically!
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify a negative value of `x`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-random#nativerandomize
/// * https://docs.tact-lang.org/ref/core-random#randomint
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun nativeRandomize(x: Int) { ADDRAND }

/// Global function.
///
/// Randomizes the random number generator with the logical time of the current transaction. Equivalent to calling `nativeRandomize(curLt())`.
///
/// ```tact
/// fun example() {
///     nativeRandomizeLt();        // now, random numbers are unpredictable for users,
///                                 // but still may be affected by validators or collators
///                                 // as they determine the seed of the current block.
///     let idk: Int = randomInt(); // ???, it's random!
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-random#nativerandomizelt
/// * https://docs.tact-lang.org/ref/core-random#nativerandomize
/// * https://docs.tact-lang.org/ref/core-contextstate#curlt
/// * https://docs.tact-lang.org/ref/core-random#randomint
///
asm fun nativeRandomizeLt() { LTIME ADDRAND }

/// Global function.
///
/// Prepares a random number generator by using `nativeRandomizeLt()`. Automatically called by `randomInt()` and `random()` functions.
///
/// ```tact
/// fun example() {
///     nativePrepareRandom(); // prepare the RNG
///     // ... do your random things ...
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-random#nativepreparerandom
/// * https://docs.tact-lang.org/ref/core-random#nativerandomizelt
/// * https://docs.tact-lang.org/ref/core-random#randomint
/// * https://docs.tact-lang.org/ref/core-random#random
///
@name(__tact_prepare_random)
native nativePrepareRandom();

// Random

// Generates a new pseudo-random unsigned 256-bit integer x.
// The algorithm is as follows: if r is the old value of the random seed,
// considered as a 32-byte array (by constructing the big-endian representation
// of an unsigned 256-bit integer), then its sha512(r) is computed;
// the first 32 bytes of this hash are stored as the new value r' of the random seed,
// and the remaining 32 bytes are returned as the next random value x.
asm fun nativeRandom(): Int { RANDU256 }

// Generates a new pseudo-random integer z in the range 0..range−1
// (or range..−1, if range < 0).
// More precisely, an unsigned random value x is generated as in `nativeRandom`;
// then z := x * range / 2^256 is computed.
asm fun nativeRandomInterval(max: Int): Int { RAND }

/// Generates a new pseudo-random unsigned 256-bit `Int` value `x`.
///
/// The algorithm works as follows: first, the `sha512(r)` is computed. There, `r` is an old
/// value of the random seed, which is taken as a 32-byte array constructed from the big-endian
/// representation of an unsigned 256-bit `Int`. The first 32 bytes of this hash are stored as the new
/// value `r'` of the random seed, and the remaining 32 bytes are returned as the next random value `x`.
///
/// ```tact
/// fun example() {
///     let allYourRandomBelongToUs: Int = randomInt(); // ???, it's random :)
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-random#randomint
///
inline fun randomInt(): Int {
    nativePrepareRandom();
    return nativeRandom();
}

/// Generates a new pseudo-random unsigned `Int` value `x` in the provided semi-closed
/// interval: `min` ≤ `x` < `max`, or `min` ≥ `x` > `max` if both `min` and `max` are negative.
///
/// Note that the `max` value is never included in the interval.
///
/// ```tact
/// fun example() {
///     random(42, 43); // 42, always
///     random(0, 42);  // 0-41, but never 42
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-random#random
///
inline fun random(min: Int, max: Int): Int {
    nativePrepareRandom();
    return min + nativeRandomInterval(max - min);
}

// Math

/// Global function.
///
/// Computes the minimum of two `Int` values `x` and `y`.
///
/// ```tact
/// fun examples() {
///     min(1, 2);        // 1
///     min(2, 2);        // 2
///     min(007, 3);      // 3
///     min(0x42, 3_0_0); // 66, nice
///     //  ↑     ↑
///     //  66    300
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-math#min
///
asm fun min(x: Int, y: Int): Int { MIN }

/// Global function.
///
/// Computes the maximum of two `Int` values `x` and `y`.
///
/// ```tact
/// fun examples() {
///     max(1, 2);        // 2
///     max(2, 2);        // 2
///     max(007, 3);      // 7
///     max(0x45, 3_0_0); // 300
///     //  ↑     ↑
///     //  69    300
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-math#max
///
asm fun max(x: Int, y: Int): Int { MAX }

/// Global function.
///
/// Computes the absolute value of the `Int` value `x`.
///
/// ```tact
/// fun examples() {
///     abs(42);        // 42
///     abs(-42);       // 42
///     abs(-(-(-42))); // 42
/// }
/// ```
///
/// /// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when the argument equals the minimum representable integer, -2^256.
///
/// See: https://docs.tact-lang.org/ref/core-math#abs
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
///
asm fun abs(x: Int): Int { ABS }

/// Global function.
///
/// Computes the logarithm of a number `num` > 0 to the base `base` ≥ 2. Results are rounded down.
///
/// ```tact
/// fun examples() {
///     log(1000, 10); // 3, as 10^3 is 1000
///     //  ↑     ↑             ↑       ↑
///     //  num   base          base    num
///
///     log(1001, 10);  // 3
///     log(999, 10);   // 2
///     try {
///         log(-1000, 10); // exit code 5 because of the non-positive num
///     }
///     log(1024, 2);   // 10
///     try {
///         log(1024, -2);  // exit code 5 because the base is less than 2
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when the given `num` value is non-positive
///   or the given `base` value is less than 2.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-math#log
/// * https://docs.tact-lang.org/ref/core-math#log2
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
inline fun log(num: Int, base: Int): Int {
    throwUnless(5, num > 0);
    throwUnless(5, base > 1);
    if (num < base) {
        return 0;
    }

    let result = 0;
    while (num >= base) {
        num /= base;
        result += 1;
    }
    return result;
}

/// Global function.
///
/// Similar to `log()`, but sets the `base` to 2.
///
/// ```tact
/// fun example() {
///     log2(1024); // 10, as 2^10 is 1024
///     //   ↑                ↑       ↑
///     //   num              base₂   num
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when the given `num` value is non-positive.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-math#log2
/// * https://docs.tact-lang.org/ref/core-math#log.
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes/#5
///
asm fun log2(num: Int): Int { DUP 5 THROWIFNOT UBITSIZE DEC }

/// Global function.
///
/// Computes the exponentiation involving two numbers: the `base` and the exponent (or _power_) `exp`.
///
/// This function tries to resolve constant values in compile-time whenever possible.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     p23: Int = pow(2, 3); // raises 2 to the 3rd power, which is 8
///     one: Int = pow(5, 0); // raises 5 to the power 0, which always produces 1
///                           // works at compile-time!
///
///     // Internal message receiver
///     receive() {
///         pow(self.p23, self.one + 1); // 64, works at run-time too!
///         try {
///             pow(0, -1); // exit code 5: Integer out of expected range
///         }
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when the result exceeds the range of representable integers, i.e. [-2^256; 2^256 - 1].
/// * 5: [Integer out of expected range] — Thrown when the given `exp` value is negative.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-math#pow
/// * https://docs.tact-lang.org/ref/core-math#pow2
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes/#5
///
inline fun pow(base: Int, exp: Int): Int {
    throwUnless(5, exp >= 0);
    let result = 1;
    repeat (exp) {
        result *= base;
    }
    return result;
}

/// Global function.
///
/// Similar to `pow()`, but sets the `base` to 2.
///
/// This function tries to resolve constant values in compile-time whenever possible.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     p23: Int = pow2(3); // raises 2 to the 3rd power, which is 8
///     one: Int = pow2(0); // raises 2 to the power 0, which always produces 1
///                         // works at compile-time!
///
///     // Internal message receiver, which accepts message ExtMsg
///     receive() {
///         pow2(self.one + 1); // 4, works at run-time too!
///         try {
///             pow(-1); // exit code 5: Integer out of expected range
///         }
///     }
/// }
/// ```
///
/// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when the result exceeds the range of representable integers, i.e. [-2^256; 2^256 - 1].
/// * 5: [Integer out of expected range] — Thrown when attempting to specify a negative value of `exp`.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-math#pow2
/// * https://docs.tact-lang.org/ref/core-math#pow
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
asm fun pow2(exp: Int): Int { POW2 }

/// Global function. Available since Tact 1.6.0.
///
/// Computes the sign of the `Int` value `x`. Produces 1 if the `x` is positive, -1 if the `x` is negative, and 0 if the `x` is 0.
///
/// ```tact
/// fun examples() {
///     sign(42);        // 1
///     sign(-42);       // -1
///     sign(-(-42));    // 1
///     sign(-(-(-42))); // -1
///     sign(0);         // 0
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-math#sign
///
asm fun sign(x: Int): Int { SGN }

/// Global function. Available since Tact 1.6.0.
///
/// Computes the rounded up result of division of the numbers `x` and `y`.
///
/// ```tact
/// fun examples() {
///     divc(4, 2);  // 2
///     divc(3, 2);  // 2
///     divc(-4, 2); // -2
///     divc(-3, 2); // -1
/// }
/// ```
///
/// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when division by zero is attempted or -2^256 is divided by -1.
///
/// See: https://docs.tact-lang.org/ref/core-math#divc
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
///
asm fun divc(x: Int, y: Int): Int { DIVC }

/// Global function. Available since Tact 1.6.0.
///
/// Computes the rounded up result of `(x * y) / z`.
///
/// ```tact
/// fun examples() {
///     muldivc(4, 1, 2);  // 2
///     muldivc(3, 1, 2);  // 2
///     muldivc(-4, 1, 2); // -2
///     muldivc(-3, 1, 2); // -1
///     muldivc(-3, 0, 2); // 0
///     muldivc(-3, 0, 0); // ERROR! Exit code 4: Integer overflow
/// }
/// ```
///
/// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when the value in calculation goes beyond
///   the range from -2^256 to 2^256 - 1 inclusive, or if there's an attempt to
///   divide by zero.
///
/// See: https://docs.tact-lang.org/ref/core-math#muldivc
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
///
asm fun muldivc(x: Int, y: Int, z: Int): Int { MULDIVC }

/// Global function. Available since Tact 1.6.0.
///
/// Computes the rounded down result of `(x * y) / 2^z`. It is a more gas-efficient equivalent of doing the bitwise shift right on the result of multiplication of `x` and `y`, where `z` is the right operand of the shift.
///
/// ```tact
/// fun examples() {
///     mulShiftRight(5, 5, 2);  // 6
///     mulShiftRight(5, 5, 1);  // 12
///     mulShiftRight(5, 5, 0);  // 25
///     mulShiftRight(5, 5, -1); // ERROR! Exit code 5: Integer out of expected range
/// }
/// ```
///
/// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when the value in calculation goes beyond
///   the range from -2^256 to 2^256 - 1 inclusive.
///
/// * 5: [Integer out of expected range] — Thrown when the given `z` value is
///   outside the inclusive range from 0 to 256.
///
/// See: https://docs.tact-lang.org/ref/core-math#mulshiftright
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes/#5
///
asm fun mulShiftRight(x: Int, y: Int, z: Int): Int { MULRSHIFT }

/// Global function. Available since Tact 1.6.0.
///
/// Computes `floor((x * y) / 2^z + 0.5)`. It is similar to `mulShiftRight`, but instead of rounding down, the result value is rounded to the nearest integer with results like 42.5 rounded to 43.
///
/// ```tact
/// fun examples() {
///     mulShiftRightRound(5, 5, 2);  // 6
///     mulShiftRightRound(5, 5, 1);  // 13
///     mulShiftRightRound(5, 5, 0);  // 25
///     mulShiftRightRound(5, 5, -1); // ERROR! Exit code 5: Integer out of expected range
/// }
/// ```
///
/// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when the value in calculation goes beyond
///   the range from -2^256 to 2^256 - 1 inclusive.
///
/// * 5: [Integer out of expected range] — Thrown when the given `z` value is
///   outside the inclusive range from 0 to 256.
///
/// See: https://docs.tact-lang.org/ref/core-math#mulshiftrightround
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes/#5
///
asm fun mulShiftRightRound(x: Int, y: Int, z: Int): Int { MULRSHIFTR }

/// Global function. Available since Tact 1.6.0.
///
/// Computes `ceil((x * y) / 2^z)`. Similar to `mulShiftRight()`, but instead of rounding down, the result value is rounded up.
///
/// ```tact
/// fun examples() {
///     mulShiftRightCeil(5, 5, 2);  // 7
///     mulShiftRightCeil(5, 5, 1);  // 13
///     mulShiftRightCeil(5, 5, 0);  // 25
///     mulShiftRightCeil(5, 5, -1); // ERROR! Exit code 5: Integer out of expected range
/// }
/// ```
///
/// #### Exit codes
///
/// * 4: [Integer overflow] — Thrown when the value in calculation goes beyond
///   the range from -2^256 to 2^256 - 1 inclusive.
///
/// * 5: [Integer out of expected range] — Thrown when the given `z` value is
///   outside the inclusive range from 0 to 256.
///
/// See: https://docs.tact-lang.org/ref/core-math#mulshiftrightceil
///
/// [Integer overflow]: https://docs.tact-lang.org/book/exit-codes/#4
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes/#5
///
asm fun mulShiftRightCeil(x: Int, y: Int, z: Int): Int { MULRSHIFTC }

/// Global function. Available since Tact 1.6.0.
///
/// Computes the square root of the `Int` value `num`. Returns the result rounded to the nearest integer.
///
/// ```tact
/// fun examples() {
///     sqrt(4);  // 2
///     sqrt(3);  // 2
///     sqrt(2);  // 1
///     sqrt(1);  // 1
///     sqrt(0);  // 0
///     sqrt(-1); // ERROR! Exit code 5: Integer out of expected range
/// }
/// ```
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] — Thrown when attempting to specify a negative value of `num`.
///
/// See: https://docs.tact-lang.org/ref/core-math#sqrt
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
///
fun sqrt(num: Int): Int {
    if (num == 0) {
        return 0;
    }

    let s: Int = log2(num);
    let x: Int = (s == 1 ? (num - 1) / 2 + 1 : 1 << ((s + 1) / 2));

    let q: Int = 0;

    do {
        q = (divc(num, x) - x) / 2;
        x += q;
    } until (q == 0);

    return x;
}



================================================
FILE: src/stdlib/stdlib/std/internal/primitives.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/primitives.tact
================================================
/// `Int` is the primitive 257-bit signed integer type.
///
/// See: https://docs.tact-lang.org/book/integers
///
primitive Int;

/// `Bool` is the classical boolean type, which can hold only two values: `true` and `false`.
/// It is convenient for boolean and logical operations, as well as for storing flags.
///
/// There are no implicit type conversions in Tact, so addition `+` of two boolean values is
/// not possible. However, many comparison operators are available.
///
/// Persisting bools to state is very space-efficient, as they only occupy 1 bit.
/// Storing 1000 bools in state [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees)
/// about 0.00072 TON per year.
///
/// See: https://docs.tact-lang.org/book/types#booleans
///
primitive Bool;

/// `Builder` is a cell manipulation primitive used for cell creation instructions.
/// They are immutable just like cells and allow constructing new cells from previously
/// stored values and cells.
///
/// Unlike cells, values of type `Builder` appear only on the [TVM] stack and cannot
/// be stored in persistent storage. This means, for example, that persistent storage
/// fields with type `Builder` are actually stored as cells under the hood.
///
/// The `Builder` type represents partially composed cells, for which fast operations
/// to append integers, other cells, references to other cells, and many other operations
/// are defined.
///
/// See:
/// * https://docs.tact-lang.org/book/cells#builders
/// * https://docs.tact-lang.org/ref/core-cells
///
/// [TVM]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
primitive Builder;

/// `Slice` is a cell manipulation primitive used for cell parsing instructions.
/// Unlike cells, slices are mutable and allow extraction or loading of data previously
/// stored in cells via serialization instructions. Also unlike cells, values of type `Slice`
/// appear only on the [TVM] stack and cannot be stored in persistent storage.
/// This means, for example, that persistent storage fields with type `Slice` would actually
/// be stored as cells under the hood.
///
/// The `Slice` type represents either the remainder of a partially parsed cell or a value (subcell)
/// residing inside such a cell, extracted from it by a parsing instruction.
///
/// See:
/// * https://docs.tact-lang.org/book/cells#slices
/// * https://docs.tact-lang.org/ref/core-cells
///
/// [TVM]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
primitive Slice;

/// `Cell` is a primitive and a data structure, which ordinarily consists of up to 1023 continuously
/// laid out bits and up to 4 references (refs) to other cells. Circular references are forbidden and
/// cannot be created by means of [TVM], which means cells can be viewed as [quadtrees]
/// or [directed acyclic graphs (DAGs)][dag] of themselves.
///
/// Contract code itself is represented by a tree of cells.
///
/// Cells and cell primitives are bit-oriented, not byte-oriented: [TVM] regards data kept in cells
/// as sequences (strings or streams) of up to 1023 bits, not bytes. If necessary, contracts are
/// free to use, for example, 21-bit integer fields serialized into [TVM] cells, thus using fewer
/// persistent storage bytes to represent the same data.
///
/// See:
/// * https://docs.tact-lang.org/book/cells#cells
/// * https://docs.tact-lang.org/ref/core-cells
///
/// [TVM]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
/// [quadtrees]: https://en.wikipedia.org/wiki/Quadtree
/// [dag]: https://en.wikipedia.org/wiki/Directed_acyclic_graph
primitive Cell;

/// `Address` is a primitive type that represents a [smart contract address] in TON Blockchain.
///
/// See: https://docs.tact-lang.org/book/types#primitive-types
///
/// [smart contract address]: https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract
primitive Address;

/// `String` is an immutable sequence of characters, which means that once a `String` is created,
/// it cannot be changed. Strings are useful for storing text, so they can be converted to a `Cell`
/// type to be used as message bodies.
///
/// To concatenate strings, use a `StringBuilder`.
///
/// To use `String` literals directly, see: [String literals].
///
/// See:
/// * https://docs.tact-lang.org/book/types#primitive-types
/// * https://docs.tact-lang.org/ref/core-strings
///
/// [String literals]: https://docs.tact-lang.org/book/expressions#string-literals
///
primitive String;

/// `StringBuilder` is a primitive used for efficient string concatenation.
///
/// See:
/// * https://docs.tact-lang.org/book/types#primitive-types
/// * https://docs.tact-lang.org/ref/core-strings
///
primitive StringBuilder;



================================================
FILE: src/stdlib/stdlib/std/internal/reserve.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/reserve.tact
================================================
/// Executes the `RAWRESERVE` instruction with the specified `amount` and `mode`.
/// It queues the reservation of the specific `amount` of [nanoToncoin] from the remaining
/// account balance per the given `mode`.
///
/// The reservation action is queued to the _output action list_, which contains other actions
/// such as message sends. In fact, the `RAWRESERVE` instruction is roughly equivalent
/// to creating an outbound message carrying the specified `amount` of nanoToncoin
/// or `b - amount` of nanoToncoin, where `b` is the remaining balance, to oneself. This
/// ensures that subsequent output actions cannot spend more money than the remainder.
///
/// It is possible to use raw `Int` values and manually provide them for the `mode`,
/// but for your convenience, there is a set of constants you may use to construct
/// the compound `mode` with ease.
///
/// NOTE: Currently, `amount` must be a non-negative integer, and `mode` must be in the
/// range `0..31`, inclusive.
///
/// Additionally, attempts to queue more than 255 reservations in one transaction throw an
/// exception with [exit code 33]: `Action list is too long`.
///
/// NOTE: This function is gas-expensive and uses 500 gas units or more.
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#nativereserve
///
/// [exit code 33]: https://docs.tact-lang.org/book/exit-codes#33
/// [nanoToncoin]: https://docs.tact-lang.org/book/integers#nanotoncoin
asm fun nativeReserve(amount: Int, mode: Int) { RAWRESERVE }

/// Reserves exactly the specified `amount` of
/// [nanoToncoin](https://docs.tact-lang.org/book/integers#nanotoncoin).
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#nativereserve-base-modes
///
const ReserveExact: Int = 0;

/// Reserves all but the specified `amount` of
/// [nanoToncoin](https://docs.tact-lang.org/book/integers#nanotoncoin).
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#nativereserve-base-modes
///
const ReserveAllExcept: Int = 1;

/// Reserves at most the specified `amount` of
/// [nanoToncoin](https://docs.tact-lang.org/book/integers#nanotoncoin).
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#nativereserve-base-modes
///
const ReserveAtMost: Int = 2;

/// Increases the `amount` by the original balance of the current account
/// (before the compute phase), including all extra currencies.
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#nativereserve-optional-flags
///
const ReserveAddOriginalBalance: Int = 4;

/// Negates the `amount` value before performing the reservation.
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#nativereserve-optional-flags
///
const ReserveInvertSign: Int = 8;

/// Bounces the transaction if the reservation fails.
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#nativereserve-optional-flags
///
const ReserveBounceIfActionFail: Int = 16;



================================================
FILE: src/stdlib/stdlib/std/internal/send.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/send.tact
================================================
/// Ordinary message (default).
///
/// This constant is available since Tact 1.6.0.
///
/// See: https://docs.tact-lang.org/book/message-mode#base-modes
///
const SendDefaultMode: Int = 0;

/// Carry all the remaining value of the inbound message in addition
/// to the value initially indicated in the new message.
///
/// See: https://docs.tact-lang.org/book/message-mode#base-modes
///
const SendRemainingValue: Int = 64;

/// Carry **all the remaining balance** of the current smart contract instead
/// of the value originally indicated in the message.
///
/// See: https://docs.tact-lang.org/book/message-mode#base-modes
///
const SendRemainingBalance: Int = 128;

/// Doesn't send the message, only estimates the forward fees
/// if the message-sending function computes those.
///
/// This constant is available since Tact 1.5.0.
///
/// See:
/// * https://docs.tact-lang.org/book/message-mode#base-modes
/// * https://docs.tact-lang.org/book/send#message-sending-functions
///
const SendOnlyEstimateFee: Int = 1024;

/// **Deprecated** since Tact 1.6.5. Use `SendPayFwdFeesSeparately` instead.
///
/// Pay forward fees separately from the message value.
///
/// See: https://docs.tact-lang.org/book/message-mode#optional-flags
///
const SendPayGasSeparately: Int = 1;

/// Pay forward fees separately from the message value.
///
/// See: https://docs.tact-lang.org/book/message-mode#optional-flags
///
const SendPayFwdFeesSeparately: Int = 1;

/// Ignore any errors arising while processing this message during the action phase.
///
/// See: https://docs.tact-lang.org/book/message-mode#optional-flags
///
const SendIgnoreErrors: Int = 2;

/// Bounce transaction in case of any errors during action phase.
/// Has no effect if flag +2, `SendIgnoreErrors` is used.
///
/// See: https://docs.tact-lang.org/book/message-mode#optional-flags
///
const SendBounceIfActionFail: Int = 16;

/// Current account (contract) will be destroyed if its resulting balance is zero.
/// This flag is often used with mode 128, `SendRemainingBalance`.
///
/// See: https://docs.tact-lang.org/book/message-mode#optional-flags
///
const SendDestroyIfZero: Int = 32;

/// Struct for specifying the message parameters of the `send()` function.
///
/// See: https://docs.tact-lang.org/ref/core-send#send
///
struct SendParameters {
    /// An 8-bit value that configures how to send a message, defaults to 0.
    /// See: https://docs.tact-lang.org/book/message-mode
    mode: Int = SendDefaultMode;

    /// Optional message body as a `Cell`.
    body: Cell? = null;

    /// Optional initial code of the contract (compiled bitcode).
    code: Cell? = null;

    /// Optional initial data of the contract (arguments of `init()` function or values of contract parameters).
    data: Cell? = null;

    /// The amount of nanoToncoins you want to send with
    /// the message. This value is used to cover forward fees,
    /// unless the optional flag `SendPayFwdFeesSeparately` is used.
    value: Int;

    /// Recipient internal `Address` on TON Blockchain.
    to: Address;

    /// When set to `true` (default) message bounces back to the sender if
    /// the recipient contract doesn't exist or wasn't able to process the message.
    bounce: Bool = true;
}

/// Struct for specifying the message parameters of the `message()` function. Available since Tact 1.6.0.
///
/// See: https://docs.tact-lang.org/ref/core-send#message
///
struct MessageParameters {
    /// An 8-bit value that configures how to send a message, defaults to 0.
    /// See: https://docs.tact-lang.org/book/message-mode
    mode: Int = SendDefaultMode;

    /// Optional message body as a `Cell`.
    body: Cell? = null;

    /// The amount of nanoToncoins you want to send with
    /// the message. This value is used to cover forward fees,
    /// unless the optional flag `SendPayFwdFeesSeparately` is used.
    value: Int;

    /// Recipient internal `Address` on TON Blockchain.
    to: Address;

    /// When set to `true` (default) message bounces back to the sender if
    /// the recipient contract doesn't exist or wasn't able to process the message.
    bounce: Bool = true;
}

/// Global function. Available since Tact 1.6.0.
///
/// Queues the message to be sent using the `MessageParameters` struct. Allows for cheaper non-deployment, regular messages compared to the `send()` function.
///
/// The `MessageParameters` struct is similar to `SendParameters` struct, but without the `code` and `data` fields.
///
/// ```tact
/// fun example() {
///     message(MessageParameters{
///         to: sender(),    // back to the sender,
///         value: ton("1"), // with 1 Toncoin (1_000_000_000 nanoToncoin),
///                          // and no message body
///     });
/// }
/// ```
///
/// #### Exit codes
///
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-send#message
/// * https://docs.tact-lang.org/book/message-mode
///
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun message(params: MessageParameters) {
    NEWC
    b{01} STSLICECONST  // store tag = $0 and ihr_disabled = true
    1 STI               // store `bounce`
    b{000} STSLICECONST // store bounced = false and src = addr_none
    STSLICE             // store `to`
    SWAP
    STGRAMS             // store `value`
    106 PUSHINT         // 1 + 4 + 4 + 64 + 32 + 1
    STZEROES
    // → Stack state
    // s0: Builder
    // s1: `body`
    // s2: `mode`
    STDICT
    ENDC
    SWAP
    SENDRAWMSG
}

/// Global function. Queues the message to be sent using a `SendParameters` struct.
///
/// ```tact
/// fun example() {
///     send(SendParameters{
///         to: sender(),    // back to the sender,
///         value: ton("1"), // with 1 Toncoin (1_000_000_000 nanoToncoin),
///                          // and no message body
///     });
/// }
/// ```
///
/// #### Exit codes
///
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See: https://docs.tact-lang.org/ref/core-send#send
///
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun send(params: SendParameters) {
    // Instructions are grouped, and the stack states they produce as a group are shown right after.
    // In the end, our message Cell should have the following TL-B structure:
    // message$_ {X:Type}
    //   info:CommonMsgInfoRelaxed
    //   init:(Maybe (Either StateInit ^StateInit))
    //   body:(Either X ^X)
    // = MessageRelaxed X;

    // → Stack state
    // s0: `params.bounce`
    // s1: `params.to`
    // s2: `params.value`
    // s3: `params.data`
    // s4: `params.code`
    // s5: `params.body`
    // s6: `params.mode`
    // For brevity, the "params" prefix will be omitted from now on.

    // Group 1: Storing the `bounce`, `to` and `value` into a Builder
    NEWC
    b{01} STSLICECONST  // store tag = $0 and ihr_disabled = true
    1 STI               // store `bounce`
    b{000} STSLICECONST // store bounced = false and src = addr_none
    STSLICE             // store `to`
    SWAP
    STGRAMS             // store `value`
    105 PUSHINT         // 1 + 4 + 4 + 64 + 32
    STZEROES            // store currency_collection, ihr_fee, fwd_fee, created_lt and created_at
    // → Stack state
    // s0: Builder
    // s1: `data`
    // s2: `code`
    // s3: `body`
    // s4: `mode`

    // Group 2: Placing the Builder after code and data, then checking those for nullability
    s2 XCHG0
    DUP2
    ISNULL
    SWAP
    ISNULL
    AND
    // → Stack state
    // s0: -1 (true) if `data` and `code` are both null, 0 (false) otherwise
    // s1: `code`
    // s2: `data`
    // s3: Builder
    // s4: `body`
    // s5: `mode`

    // Group 3: Left branch of the IFELSE, executed if s0 is -1 (true)
    <{
        DROP2 // drop `data` and `code`, since either of those is null
        b{0} STSLICECONST
    }> PUSHCONT

    // Group 3: Right branch of the IFELSE, executed if s0 is 0 (false)
    <{
        // _ split_depth:(Maybe (## 5))
        //   special:(Maybe TickTock)
        //   code:(Maybe ^Cell)
        //   data:(Maybe ^Cell)
        //   library:(Maybe ^Cell)
        // = StateInit;
        ROT                // place message Builder on top
        b{10} STSLICECONST // store Maybe = true, Either = false
        // Start composing inlined StateInit
        b{00} STSLICECONST // store split_depth and special first
        STDICT             // store code
        STDICT             // store data
        b{0} STSLICECONST  // store library
    }> PUSHCONT

    // Group 3: IFELSE that does the branching shown above
    IFELSE
    // → Stack state
    // s0: Builder
    // s1: null or StateInit
    // s2: `body`
    // s3: `mode`

    // Group 4: Finalizing the message
    STDICT // store `body` as ref with an extra Maybe bit, since `body` might be null
    ENDC
    // → Stack state
    // s0: Cell
    // s1: `mode`

    // Group 5: Sending the message, with `mode` on top
    SWAP
    SENDRAWMSG // https://github.com/tact-lang/tact/issues/1558
}

/// Struct for specifying the deployment message parameters of the `deploy()` function. Available since Tact 1.6.0.
///
/// See: https://docs.tact-lang.org/ref/core-send#deploy
///
struct DeployParameters {
    /// An 8-bit value that configures how to send a message, defaults to 0.
    /// See: https://docs.tact-lang.org/book/message-mode
    mode: Int = SendDefaultMode;

    /// Optional message body as a `Cell`.
    body: Cell? = null;

    /// The amount of nanoToncoins you want to send with
    /// the message. This value is used to cover forward fees,
    /// unless the optional flag `SendPayFwdFeesSeparately` is used.
    value: Int;

    /// When set to `true` (default) message bounces back to the sender if
    /// the recipient contract doesn't exist or wasn't able to process the message.
    bounce: Bool = true;

    /// Initial package of the contract (initial code and initial data).
    /// See: https://docs.tact-lang.org/book/expressions#initof
    init: StateInit;
}

/// Global function. Available since Tact 1.6.0.
///
/// Queues the contract deployment message to be sent using the `DeployParameters` struct. Allows for cheaper on-chain deployments compared to the `send()` function.
///
/// The `DeployParameters` struct consists of the following fields:
/// * `mode: Int`, an 8-bit value that configures how to send a message, defaults to 0.
/// * `body: Cell?`, optional message body as a `Cell`.
/// * `value: Int`, the amount of nanoToncoins you want to send with the message.
///   This value is used to cover forward fees, unless the optional flag `SendPayFwdFeesSeparately` is used.
/// * `bounce: Bool`, when set to `true` (default) message bounces back to the sender
///    if the recipient contract doesn't exist or wasn't able to process the message.
/// * `init: StateInit`, init package of the contract (initial code and initial data).
///
/// ```tact
/// fun example() {
///     deploy(DeployParameters{
///         init: initOf SomeContract(), // with initial code and data of SomeContract
///                                      // and no additional message body
///         mode: SendIgnoreErrors,      // skip the message in case of errors
///         value: ton("1"),             // send 1 Toncoin (1_000_000_000 nanoToncoin)
///     });
/// }
/// ```
///
/// #### Exit codes
///
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-send#deploy
/// * https://docs.tact-lang.org/book/message-mode
///
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun deploy(params: DeployParameters) {
    // Instructions are grouped, and the stack states they produce as a group are shown right after.
    //
    // → Stack state
    // s0: `params.init.data`
    // s1: `params.init.code`
    // s2: `params.bounce`
    // s3: `params.value`
    // s4: `params.body`
    // s5: `params.mode`
    // For brevity, the "params" prefix will be omitted from now on.

    // Group 1: Preparation of needed params
    // For almost identical logic and instructions,
    // see comments inside `contractHash()` function in contract.tact
    4 1 BLKPUSH // pushes 2 copies of `init.code` and `init.data`
    HASHCU // `init.data` hash
    SWAP
    HASHCU // `init.code` hash
    SWAP2
    CDEPTH // `init.data` depth
    SWAP
    CDEPTH // `init.code` depth

    // Group 2: Calculating destination address
    // For almost identical logic and instructions,
    // see comments inside `contractHash()` function in contract.tact
    131380 INT // (2 << 16) | (1 << 8) | 0x34
    NEWC
    24 STU
    16 STU
    16 STU
    256 STU
    256 STU
    ONE HASHEXT_SHA256 // obtains hash part (account id) of the address
    // → Stack state
    // s0: destAddr(hash part)
    // s1: `init.data`
    // s2: `init.code`
    // s3 and below: `bounce`, `value`, `body`, `mode`

    // Group 3: Building a message (CommonMsgInfoRelaxed)
    s3 XCHG0           // swaps `bounce` with destAddr(hash part)
    NEWC
    b{01} STSLICECONST // store tag = $0 and ihr_disabled = true
    1 STI              // store `bounce`
    s1 s2 XCHG         // swap `init.data` with `init.code`, placing code on s1
    STREF              // store `init.code`
    STREF              // store `init.data`
    // Inline StateInit:
    b{00010000000000} STSLICECONST
    // 0 + 00 + 10 + 0 + 00000000
    // 1) 0 - bounced = false
    // 2) 00 - src = addr_none
    // 3) 10 - tag of addr_std (part of dest)
    // 4) 0 - Maybe Anycast = false
    // 5) 00000000 - workchain_id (part of dest)
    //
    256 STU     // store destAddr(hash part)
    SWAP        // Builder on top, `value` below
    STGRAMS     // store `value`
    105 PUSHINT // 1 + 4 + 4 + 64 + 32
    STZEROES    // store currency_collection, ihr_fee, fwd_fee, created_lt and created_at

    // Group 4: Continue building a message (CommonMsgInfoRelaxed into MessageRelaxed)
    // Remaining bits of MessageRelaxed:
    b{1000110} STSLICECONST
    // 10 + 0 + 0 + 1 + 1 + 0
    // 10 - Maybe (Either StateInit ^StateInit) = true false
    // 0 - split_depth:(Maybe (## 5)) = false
    // 0 = special:(Maybe TickTock) = false
    // 1 = code:(Maybe ^Cell) = true
    // 1 = data:(Maybe ^Cell) = true
    // 0 = library:(Maybe ^Cell) = false
    //
    STDICT // store `body` as ref with an extra Maybe bit, since `body` might be null
    ENDC   // finalize the message
    // → Stack state
    // s0: Cell
    // s1: params.`mode`

    // Group 5: Sending the message, with `mode` on top
    SWAP
    SENDRAWMSG
}

/// Global function. Available since Tact 1.6.1.
///
/// Queues an empty message to be sent with the `SendRemainingValue` mode and the `SendIgnoreErrors` flag to the destination address `to`.
/// This is the most gas-efficient way to send the remaining value from the incoming message to the given address.
///
/// This function won't forward excess values if any other message-sending functions were called in the same receiver before.
///
/// ```tact
/// fun examples() {
///     // Forward the remaining value back to the sender
///     cashback(sender());
///
///     // The cashback() function above is cheaper, but functionally
///     // equivalent to the following call to the message() function
///     message(MessageParameters{
///         mode: SendRemainingValue | SendIgnoreErrors,
///         body: null,
///         value: 0,
///         to: sender(),
///         bounce: false,
///     });
/// }
/// ```
///
/// #### Exit codes
///
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See: https://docs.tact-lang.org/ref/core-send#cashback
///
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun cashback(to: Address) {
    NEWC
    x{42_} STSLICECONST // .storeUint(0x10, 6)
    STSLICE          // .storeAddress(to)
    0 PUSHINT        // 0
    111 STUR         // .storeUint(0, 111)
                     // 4 zeros for coins and 107 zeros for lt, fees, etc.
    ENDC
    66 PUSHINT       // SendRemainingValue | SendIgnoreErrors
    SENDRAWMSG
}

/// Global function. **Deprecated** since Tact 1.6.6. Use `sendRawMessage()` instead.
///
/// Queues the message to be sent by specifying the complete `msg` cell and the message `mode`.
///
/// #### Exit codes
///
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-send#sendrawmessage
/// * https://docs.tact-lang.org/ref/core-send#nativesendmessage
///
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun nativeSendMessage(msg: Cell, mode: Int) { SENDRAWMSG }

/// Global function. Available since Tact 1.6.6.
///
/// Queues the message to be sent by specifying the complete `msg` cell and the message `mode`.
///
/// Prefer using the more user-friendly `message()`, `deploy()`, or `send()` functions unless you have a complex logic that cannot be expressed otherwise.
///
/// #### Exit codes
///
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-send#sendrawmessage
/// * https://docs.tact-lang.org/ref/core-send#message
/// * https://docs.tact-lang.org/ref/core-send#deploy
/// * https://docs.tact-lang.org/ref/core-send#send
///
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun sendRawMessage(msg: Cell, mode: Int) { SENDRAWMSG }

/// Global function. **Deprecated** since Tact 1.6.6. Use `sendRawMessageReturnForwardFee()` instead.
///
/// Similar to `sendRawMessage()`, but also calculates and returns the forward fee in nanoToncoin.
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] - Thrown if the message mode is invalid.
/// * 7: [Type check error] - Thrown if any of the blockchain config, contract balance or incoming message value are invalid.
/// * 9: [Cell underflow] - Thrown if the blockchain config is invalid.
/// * 11: ["Unknown" error] - Thrown if the message cell is ill-formed or the blockchain config is invalid.
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-send#nativesendmessagereturnforwardfee
/// * https://docs.tact-lang.org/ref/core-send#sendrawmessage
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Type check error]: https://docs.tact-lang.org/book/exit-codes#7
/// [Cell underflow]: https://docs.tact-lang.org/book/exit-codes#9
/// ["Unknown" error]: https://docs.tact-lang.org/book/exit-codes#11
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun nativeSendMessageReturnForwardFee(msg: Cell, mode: Int): Int { SENDMSG }

/// Global function. Available since Tact 1.6.6.
///
/// Similar to `sendRawMessage()`, but also calculates and returns the forward fee in nanoToncoin.
///
/// #### Exit codes
///
/// * 5: [Integer out of expected range] - Thrown if the message mode is invalid.
/// * 7: [Type check error] - Thrown if any of the blockchain config, contract balance or incoming message value are invalid.
/// * 11: ["Unknown" error] - Thrown if the message cell is ill-formed or the TVM config is invalid.
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See:
/// * https://docs.tact-lang.org/ref/core-send#sendrawmessagereturnforwardfee
/// * https://docs.tact-lang.org/ref/core-send#sendrawmessage
///
/// [Integer out of expected range]: https://docs.tact-lang.org/book/exit-codes#5
/// [Type check error]: https://docs.tact-lang.org/book/exit-codes#7
/// ["Unknown" error]: https://docs.tact-lang.org/book/exit-codes#11
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
asm fun sendMessageReturnForwardFee(msg: Cell, mode: Int): Int { SENDMSG }

/// Global function.
///
/// Queues the message `body` to be sent to the outer world with the purpose of logging and analyzing it later off-chain. The message does not have a recipient and is more gas-efficient compared to using any other message-sending functions of Tact.
///
/// The message is sent with the default mode: `SendDefaultMode` (0).
///
/// ```tact
/// fun example() {
///     emit("Catch me if you can, Mr. Holmes".asComment()); // asComment() converts a String to a Cell
/// }
/// ```
///
/// #### Exit codes
///
/// * 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.
///
/// See: https://docs.tact-lang.org/ref/core-send#emit
///
/// [Action list is too long]: https://docs.tact-lang.org/book/exit-codes#33
///
inline fun emit(body: Cell) {
    // ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt created_lt:uint64 created_at:uint32
    //                     maybe: stateInit (false) bodyRef: bool (true)
    let c: Cell = beginCell()
        .storeUint(15211807202738752817960438464513, 104)
        .storeRef(body)
        .endCell();
    sendRawMessage(c, 0);
}

/// Global function.
///
/// Agrees to buy some gas to finish the current transaction by setting the `gas_limit` to its maximum allowed value of 2^63 - 1 and resetting the `gas_credit` to 0. This action is required to process external messages, which bring no value (hence no gas) with themselves.
///
/// ```tact
/// contract Timeout {
///     timeout: Int;
///
///     init() {
///         self.timeout = now() + 5 * 60; // 5 minutes from now
///     }
///
///     external("timeout") {
///         if (now() > self.timeout) {
///             acceptMessage(); // start accepting external messages once timeout went out
///         }
///     }
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-gas#acceptmessage
///
asm fun acceptMessage() { ACCEPT }

/// Global function.
///
/// Commits the current state of registers `c4` (persistent data) and `c5` (actions), so that the current execution is considered "successful" with the saved values even if an exception in compute phase is thrown later.
///
/// ```tact
/// contract WalletV4(
///     seqno: Int as uint32,
///     // ...other parameters...
/// ) {
///     // ...
///     external(_: Slice) {
///         // ...various prior checks...
///
///         acceptMessage();
///         self.seqno += 1;
///         setData(self.toCell());
///         commit(); //  now, transaction is considered "successful"
///         throw(42); // and this won't fail it
///     }
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#commit
///
asm fun commit() { COMMIT }



================================================
FILE: src/stdlib/stdlib/std/internal/text.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/text.tact
================================================
//
// String builder
//

/// Global function.
///
/// Creates and returns an empty `StringBuilder`.
///
/// ```tact
/// fun example(): String {
///     let fizz: StringBuilder = beginString();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#beginstring
///
@name(__tact_string_builder_start_string)
native beginString(): StringBuilder;

/// Global function.
///
/// Creates and returns an empty `StringBuilder` for building a comment string, which prefixes
/// the resulting `String` with four null bytes. This format is used for passing text comments
/// as message bodies.
///
/// ```tact
/// fun example(): String {
///     let fizz: StringBuilder = beginComment();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#begincomment
///
@name(__tact_string_builder_start_comment)
native beginComment(): StringBuilder;

/// Global function.
///
/// Creates and returns an empty `StringBuilder` for building a tail string, which prefixes
/// the resulting `String` with a single null byte. This format is used in various standards
/// such as NFT or Jetton.
///
/// ```tact
/// fun example(): String {
///     let fizz: StringBuilder = beginTailString();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#begintailstring
///
@name(__tact_string_builder_start_tail_string)
native beginTailString(): StringBuilder;

/// Global function.
///
/// Creates and returns a new `StringBuilder` from an existing `StringBuilder` `b`. Useful when
/// you need to serialize an existing `String` to a `Cell` along with other data.
///
/// ```tact
/// fun example(): String {
///     let fizz: StringBuilder = beginStringFromBuilder(beginString());
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#beginstringfrombuilder
///
@name(__tact_string_builder_start)
native beginStringFromBuilder(b: Builder): StringBuilder;

/// Extension mutation function for the `StringBuilder` type.
///
/// Appends a `String` `s` to the `StringBuilder`.
///
/// ```tact
/// fun example() {
///     let fizz: StringBuilder = beginString();
///     fizz.append("oh");
///     fizz.append("my");
///     fizz.append("Tact!");
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringbuilderappend
///
@name(__tact_string_builder_append)
extends mutates native append(self: StringBuilder, s: String);

/// Extension function for the `StringBuilder` type.
///
/// Returns a new `StringBuilder` after concatenating it with a `String` `s`. It can be chained,
/// unlike `StringBuilder.append()`.
///
/// ```tact
/// fun example() {
///     let fizz: StringBuilder = beginString()
///         .concat("oh")
///         .concat("my")
///         .concat("Tact!");
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringbuilderconcat
///
@name(__tact_string_builder_append_not_mut)
extends native concat(self: StringBuilder, s: String): StringBuilder;

/// Extension function for the `StringBuilder` type.
///
/// Returns an assembled `Cell` from a `StringBuilder`.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let fizz: StringBuilder = beginString();
///     let buzz: Cell = fizz.toCell();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringbuildertocell
///
@name(__tact_string_builder_end)
extends native toCell(self: StringBuilder): Cell;

/// Extension function for the `StringBuilder` type.
///
/// Returns a built `String` from a `StringBuilder`.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let fizz: StringBuilder = beginString();
///     let buzz: String = fizz.toString();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringbuildertostring
///
@name(__tact_string_builder_end_slice)
extends native toString(self: StringBuilder): String;

/// Extension function for the `StringBuilder` type.
///
/// Returns an assembled `Cell` as a `Slice` from a `StringBuilder`.
/// An alias to `self.toCell().asSlice()`.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let s: StringBuilder = beginString();
///     let fizz: Slice = s.toSlice();
///     let buzz: Slice = s.toCell().asSlice();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringbuildertoslice
///
@name(__tact_string_builder_end_slice)
extends native toSlice(self: StringBuilder): Slice;

//
// String conversion
//

/// Extension function for the `Int` type.
///
/// Returns a `String` from an `Int` value.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let fizz: String = (84 - 42).toString();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#inttostring
///
asm extends fun toString(self: Int): String {
    // x

    <{
        // x
        NEWC // x b
        OVER // x b x
        0 LESSINT // x b <0?
        <{
            // x b
            45 PUSHINT // x b 45
            SWAP // x 45 b
            8 STU // x b
            SWAP // b x
            NEGATE // b -x
            SWAP // -x b
        }>CONT IF
        // x b

        SWAP // b x

        <{
            // b x
            10 PUSHINT DIVMOD // b x/10 x%10
            48 ADDCONST // b x/10 (x%10+48)
            s2 s2 s0 XC2PU ISZERO // (x%10+48) b x/10 x/10==0?
        }>CONT UNTIL
        // ... b x

        DROP // ... b
        DEPTH DEC // ... b n
        <{ 8 STU }>CONT REPEAT // b
    }>CONT 1 1 CALLXARGS
    // b

    ENDC CTOS // s
}

/// Extension function for the `Int` type.
///
/// Returns a `String` from an `Int` value using a [fixed-point representation] of a fractional
/// number, where `self` is the significant part of the number and `digits` is the number
/// of digits in the fractional part.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let fizz: String = (42).toFloatString(9); // "0.000000042"
/// }
/// ```
///
/// #### Exit codes
///
/// * 134: [Invalid argument] — Thrown when the given `digits` value is out of range.
///
/// See: https://docs.tact-lang.org/ref/core-strings#inttofloatstring
///
/// [fixed-point representation]: https://en.wikipedia.org/wiki/Fixed-point_arithmetic
/// [Invalid argument]: https://docs.tact-lang.org/book/exit-codes#134
///
asm extends fun toFloatString(self: Int, digits: Int): String {
    // x digits

    DUP // x digits digits
    1 LESSINT // x digits digits<=0
    134 THROWIF // x digits
    DUP // x digits digits
    77 GTINT // x digits digits>77
    134 THROWIF // x digits

    NEWC // x digits b
    ROTREV // b x digits
    s1 PUSH // b x digits x
    0 LESSINT // b x digits x<0?

    <{
        // b x digits
        ROT // x digits b
        x{2d} STSLICECONST // x digits b
        ROT // digits b x
        NEGATE // digits b -x
        ROT // b -x digits
    }>CONT IF

    // b x digits
    ONE // b x digits 1
    OVER // b x digits 1 digits

    <{ 10 MULCONST }>CONT REPEAT // b x digits 10^digits

    s1 s2 XCHG // b digits x 10^digits
    DIVMOD // b digits left right
    s3 s3 XCHG2 // right digits b left

    <{
        // b x

        <{
            // b x
            10 PUSHINT DIVMOD // b x/10 x%10
            48 ADDCONST // b x/10 (x%10+48)
            s2 s2 s0 XC2PU ISZERO // (x%10+48) b x/10 x/10==0?
        }>CONT UNTIL
        // ... b x

        DROP // ... b
        DEPTH DEC // ... b n
        <{ 8 STU }>CONT REPEAT // b
    }>CONT 2 1 CALLXARGS

    // right digits "left"

    ROT // digits "left" right
    DUP // digits "left" right right
    ISZERO // digits "left" right right==0?

    <{
        // digits "left" right
        DROP // digits "left"
        NIP // "left"
    }>CONT

    <{
        // digits "left" right
        ZERO // digits "left" right 0
        SWAP // digits "left" 0 right

        <{
            // digits "left" i right
            DUP // digits "left" i right right
            10 PUSHINT // digits "left" i right right 10
            MOD // digits "left" i right right%10
            ISZERO // digits "left" i right right%10==0?
        }>CONT

        <{
            // digits "left" i right
            10 PUSHINT // digits "left" i right 10
            DIV // digits "left" i right/10
            SWAP // digits "left" right/10 i
            INC // digits "left" right/10 i+1
            SWAP // digits "left" i+1 right/10
        }>CONT

        WHILE // digits "left" i right

        <{
            // x
            NEWC // x b
            SWAP // b x

            <{
                // b x
                10 PUSHINT DIVMOD // b x/10 x%10
                48 ADDCONST // b x/10 (x%10+48)
                s2 s2 s0 XC2PU ISZERO // (x%10+48) b x/10 x/10==0?
            }>CONT UNTIL
            // ... b x

            DROP // ... b
            DEPTH DEC DUP // ... b n n
            ROTREV // ... n b n
            <{
                // ... c n b
                s1 s2 XCHG // ... n c b
                8 STU // ... n b
            }>CONT REPEAT // n b
        }>CONT 1 2 CALLXARGS
        // digits "left" i right_digits "right"
        ROTREV // digits "left" "right" i right_digits
        ADD // digits "left" "right" right_digits

        s3 s1 XCHG // "right" "left" digits right_digits
        SUB // "right" "left" digits_diff
        SWAP // "right" digits_diff "left"
        x{2e} STSLICECONST // "right" digits_diff "left."
        SWAP // "right" "left." digits_diff

        <{
            // "right" "left."
            x{30} STSLICECONST // "right" "left.0"
        }>CONT REPEAT // "right" "left.000"

        STB // "left.000right"
    }>CONT

    IFELSE // b

    ENDC CTOS // s
}

/// Extension function for the `Int` type.
///
/// Returns a `String` from an `Int` value using a [fixed-point representation] of a fractional number.
/// An alias to `self.toFloatString(9)`.
///
/// This is used to represent [nanoToncoin] `Int` values using strings.
///
/// ```tact
/// fun example() {
///     let nanotons: Int = 42;
///     let fizz: String = nanotons.toCoinsString();
///     let buzz: String = nanotons.toFloatString(9);
///
///     fizz == buzz; // true, both store "0.000000042"
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#inttocoinsstring
///
/// [fixed-point representation]: https://en.wikipedia.org/wiki/Fixed-point_arithmetic
/// [nanoToncoin]: https://docs.tact-lang.org/book/integers#nanotoncoin
///
inline extends fun toCoinsString(self: Int): String {
    return self.toFloatString(9);
}

/// Extension function for the `String` type.
///
/// Returns a `Cell` from a `String` by prefixing the latter with four null bytes.
/// This format is used for passing text comments as message bodies.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let s: String = "When life gives you lemons, call them 'yellow oranges' and sell them for double the price.";
///     let fizz: Cell = s.asComment();
///
///     let b: StringBuilder = beginComment();
///     b.append(s);
///     let buzz: Cell = b.toCell();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringascomment
///
extends fun asComment(self: String): Cell {
    let b: StringBuilder = beginComment();
    b.append(self);
    return b.toCell();
}

/// Extension function for the `String` type.
///
/// Casts the `String` back to the underlying `Slice` and returns it. The inverse of `Slice.asString()`.
///
/// ```tact
/// fun example() {
///     let s: String = "It's alive! It's alive!!!";
///     let fizz: Slice = s.asSlice();
///     let buzz: Slice = s.asSlice().asString().asSlice();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringasslice
///
///
asm extends fun asSlice(self: String): Slice {}

/// Extension function for the `Slice` type.
///
/// Casts the `Slice` to a `String` and returns it. The inverse of `String.asSlice()`.
///
/// ```tact
/// fun example() {
///     let s: String = "Keep your Slices close, but your Strings closer.";
///     let fizz: String = s;
///     let buzz: String = s.asSlice().asString();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells#sliceasstring
///
asm extends fun asString(self: Slice): String {}

/// Extension function for the `Slice` type.
///
/// Returns a new `Slice` from the decoded [base64] `Slice`.
///
/// Note that this function is limited and only takes the first 1023 bits of data from
/// the given `Slice`, without throwing an exception if the `Slice` has more data
/// (i.e., when it has any references).
///
/// If the given `Slice` contains characters not from the base64 set, an exception with
/// [exit code 134] will be thrown: `Invalid argument`.
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let s: Slice = "SSBhbSBHcm9vdC4=".asSlice();
///     let fizz: Slice = s.fromBase64();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-strings#stringfrombase64
///
/// [exit code 134]: https://docs.tact-lang.org/book/exit-codes#134
/// [base64]: https://en.wikipedia.org/wiki/Base64
inline extends fun fromBase64(self: String): Slice {
    return self.asSlice().fromBase64();
}

/// Extension function for the `String` type.
///
/// Returns a `Slice` from the decoded [base64] `String`.
/// An alias to `self.asSlice().fromBase64()`.
///
/// Note that this function is limited and only takes the first 1023 bits of data from
/// the given `String`, without throwing an exception when the `String` is larger
/// (i.e., contains more than 1023 bits of data).
///
/// NOTE: **Gas expensive!** This function uses 500 gas units or more.
///
/// ```tact
/// fun example() {
///     let s: String = "SGVyZSdzIEpvaG5ueSE=";
///     let fizz: Slice = s.fromBase64();
///     let buzz: Slice = s.asSlice().fromBase64();
///
///     fizz == buzz; // true
/// }
/// ```
///
/// #### Exit codes
///
/// * 134: [Invalid argument] — Thrown when the given `String` contains characters not from the base64 set.
///
/// See: https://docs.tact-lang.org/ref/core-cells#slicefrombase64
///
/// [Invalid argument]: https://docs.tact-lang.org/book/exit-codes#134
/// [base64]: https://en.wikipedia.org/wiki/Base64
///
extends fun fromBase64(self: Slice): Slice {
    let size: Int = self.bits() / 8;
    let result: Builder = beginCell();

    repeat (size) {
        let code: Int = self.loadUint(8);
        if (code >= 65 && code <= 90) { // A-Z
            result = result.storeUint(code - 65, 6);
        } else if (code >= 97 && code <= 122) { // a-z
            result = result.storeUint(code - (97 - 26), 6);
        } else if (code >= 48 && code <= 57) { // 0-9
            result = result.storeUint(code + (52 - 48), 6);
        } else if (code == 45 || code == 43) { // - or +
            result = result.storeUint(62, 6);
        } else if (code == 95 || code == 47) { // _ or /
            result = result.storeUint(63, 6);
        } else if (code == 61) { // =
            // Skip
        } else {
            throw(TactExitCodeInvalidArgument);
        }
    }

    // Padding
    let total: Int = result.bits();
    let padding: Int = total % 8;
    if (padding != 0) {
        let s: Slice = result.asSlice();
        return s.loadBits(total - padding);
    } else {
        return result.asSlice();
    }
}

//
// Address conversion
//

/// Extension function for the `Address` type.
///
/// Returns a `String` from an `Address`.
///
/// ```tact
/// fun example() {
///     let community: Address = address("UQDpXLZKrkHsOuE_C1aS69C697wE568vTnqSeRfBXZfvmVOo");
///     let fizz: String = community.toString();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-addresses#addresstostring
///
@name(__tact_address_to_user_friendly)
extends native toString(self: Address): String;



================================================
FILE: src/stdlib/stdlib/std/internal/time.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/internal/time.tact
================================================
/// Global function.
///
/// Returns the current Unix time.
///
/// ```tact
/// fun example() {
///     let timeOffset: Int = now() + 1000; // thousand seconds from now()
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#now
///
asm fun now(): Int { NOW }

/// Global function. Available since Tact 1.6.0.
///
/// Returns the `Int` value of the logical time of the current transaction.
///
/// ```tact
/// fun example() {
///     let lt: Int = curLt();
///     nativeRandomize(lt); // equivalent to calling nativeRandomizeLt()
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-contextstate#curlt
/// * https://docs.tact-lang.org/ref/core-random#nativerandomize
/// * https://docs.tact-lang.org/ref/core-random#nativerandomizelt
///
asm fun curLt(): Int { LTIME }

/// Global function. Available since Tact 1.6.0.
///
/// Returns the `Int` value of the starting logical time of the current block.
///
/// ```tact
/// fun example() {
///     let time: Int = blockLt();
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-contextstate#blocklt
///
asm fun blockLt(): Int { BLOCKLT }



================================================
FILE: src/stdlib/stdlib/std/stdlib.fc
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/stdlib.fc
================================================
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorphism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vice versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm(-> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm(-> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^120 - 1`).
(slice, int) load_grams(slice s) asm(-> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm(-> 1 0) "LDVARUINT16";

(slice, int) load_varint16(slice s) asm(-> 1 0) "LDVARINT16";
(slice, int) load_varint32(slice s) asm(-> 1 0) "LDVARINT32";
(slice, int) load_varuint16(slice s) asm(-> 1 0) "LDVARUINT16";
(slice, int) load_varuint32(slice s) asm(-> 1 0) "LDVARUINT32";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm(-> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm(-> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm(s b) "STSLICE";

;;; Stores (serializes) an integer [x] in the range `0..2^120 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STVARUINT16";

builder store_varint16(builder b, int x) asm "STVARINT16";
builder store_varint32(builder b, int x) asm "STVARINT32";
builder store_varuint16(builder b, int x) asm "STVARUINT16";
builder store_varuint32(builder b, int x) asm "STVARUINT32";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm(-> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, cell, int) idict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~idict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~udict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGETREF" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) udict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEREF";
(cell, slice, int) udict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACEGET" "NULLSWAPIFNOT";
(cell, cell, int) udict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEGETREF" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACEGET" "NULLSWAPIFNOT";
(cell, (cell, int)) ~udict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEGETREF" "NULLSWAPIFNOT";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
(cell, int) idict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEREF";
(cell, slice, int) idict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACEGET" "NULLSWAPIFNOT";
(cell, cell, int) idict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEGETREF" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_replaceget?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACEGET" "NULLSWAPIFNOT";
(cell, (cell, int)) ~idict_replaceget_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEGETREF" "NULLSWAPIFNOT";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) dict_replace_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEB";
(cell, builder, int) dict_replaceget_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEGETB" "NULLSWAPIFNOT";
(cell, slice, int) dict_replaceget?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACEGET" "NULLSWAPIFNOT";
(cell, (builder, int)) ~dict_replaceget_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~dict_replaceget?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACEGET" "NULLSWAPIFNOT";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, builder, int) udict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEGETB" "NULLSWAPIFNOT";
(cell, (builder, int)) ~udict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEGETB" "NULLSWAPIFNOT";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, builder, int) idict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEGETB" "NULLSWAPIFNOT";
(cell, (builder, int)) ~idict_replaceget_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEGETB" "NULLSWAPIFNOT";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coincide
int equal_slices_bits(slice a, slice b) asm "SDEQ";
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
int builder_null?(builder b) asm "ISNULL";
;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";
builder store_builder_ref(builder to, builder from) asm "STBREFR";

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code() asm "MYCODE";

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
int send_message(cell msg, int mode) impure asm "SENDMSG";

int gas_consumed() asm "GASCONSUMED";

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int get_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEE";
int get_precompiled_gas_consumption() asm "GETPRECOMPILEDGAS";

int get_simple_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEESIMPLE";
int get_simple_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEESIMPLE";
int get_original_fwd_fee(int workchain, int fwd_fee) asm(fwd_fee workchain) "GETORIGINALFWDFEE";
int my_storage_due() asm "DUEPAYMENT";

tuple get_fee_configs() asm "UNPACKEDCONFIGTUPLE";

;;; Quiet versions of ~load_uint. Returns (null, 0) if load has failed and (x, -1) on success
(slice, (int, int)) ~load_uint_quiet(slice s, int len) asm( -> 1 0 2) "LDUXQ NULLROTRIFNOT";



================================================
FILE: src/stdlib/stdlib/std/stdlib.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/stdlib.tact
================================================
import "./internal/exit-codes";
import "./internal/primitives";
import "./internal/cells";
import "./internal/crypto";
import "./internal/text";
import "./internal/math";
import "./internal/contract";
import "./internal/debug";
import "./internal/context";
import "./internal/reserve";
import "./internal/send";
import "./internal/config";
import "./internal/base";
import "./internal/address";
import "./internal/time";



================================================
FILE: src/stdlib/stdlib/std/stubs.tact
URL: https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/stubs.tact
================================================
// This file contains the definitions of the built-in functions that are available in the Tact language.

/// Checks the condition and throws an error with an exit code generated from
/// the error message if the condition is false. Does nothing otherwise.
///
/// The generated exit code is guaranteed to be outside the common 0−255 range reserved
/// for TVM and Tact contract errors, which makes it possible to distinguish exit codes
/// from `require()` and any other standard exit codes.
///
/// ```tact
/// fun examples() {
///     // now() has to return a value greater than 1000,
///     // otherwise an error message will be thrown
///     require(now() > 1000, "We're in the first 1000 seconds of 1 January 1970!");
///
///     try {
///         // The following will never be true, so this require would always throw
///         require(now() < -1, "Time is an illusion. Lunchtime doubly so.");
///     } catch (e) {
///         // e will be outside of range 0-255
///         dump(e);
///     }
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug/#require
/// * https://docs.tact-lang.org/book/compile/#report
///
fun require(that: Bool, msg: String);

/// Prints the argument `arg` to the contract's debug console. Evaluated only if
/// the `debug` option in the configuration file is set to `true`, otherwise does nothing.
///
/// This function is computationally expensive and consumes a lot of gas because
/// it prints the location from which it was called, i.e. the filename,
/// line and column numbers, and the original expression that was the `arg` argument.
///
/// Can be applied to the following list of types and values:
/// * `Int`
/// * `Bool`
/// * `Address`
/// * `Cell`, `Builder` or `Slice`
/// * `String`
/// * `map<K, V>`
/// * Optionals and `null` value
/// * `void`, which is implicitly returned when a function doesn't have return value defined
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug/#dump
/// * https://docs.tact-lang.org/book/config/#options-debug
///
fun dump(arg: T);

/// Prints the total stack depth and up to 255 of its values from the top to the contract's
/// debug console. The values are positioned bottom-up: from the deepest value on the left
/// to the topmost value on the right. Evaluated only if the `debug` option
/// in the configuration file is set to `true`, otherwise does nothing.
///
/// ```tact
/// fun example() {
///     dumpStack(); // prints:
///                  // File filename.tact:1:1
///                  // dumpStack()
///                  // stack(3 values) : 100000000 C{96...C7} 0
/// }
/// ```
///
/// See:
/// * https://docs.tact-lang.org/ref/core-debug/#dumpstack
/// * https://docs.tact-lang.org/book/config/#options-debug
///
fun dumpStack();

/// Computes and returns the SHA-256 hash as a 256-bit unsigned `Int`
/// from a passed `Slice` `data`, which should have a number of bits
/// divisible by 8 and no more than a single reference per the cell level.
///
/// This function tries to resolve constant string values at compile-time whenever possible.
///
/// ```tact
/// fun example() {
///     sha256(beginCell().asSlice());
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-math/#sha256
///
fun sha256(data: Slice): Int;

/// Computes and returns the SHA-256 hash as a 256-bit unsigned `Int`
/// from a passed `String` `data`.
///
/// This function tries to resolve constant string values at compile-time whenever possible.
///
/// ```tact
/// fun example() {
///     sha256("Hello, world!");
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-math/#sha256
///
fun sha256(data: String): Int;

/// Compile-time function.
///
/// Converts a `String` with an address into the `Address` type
/// and embeds it into the contract.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     addr: Address =
///         // Works at compile-time!
///         address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-comptime/#address
///
fun address(s: String): Address;

/// Compile-time function.
///
/// Embeds a base64-encoded BoC `bocBase64` as a `Cell` into the contract.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     stored: Cell =
///         // Init package for Wallet V3R1 as a base64-encoded BoC
///         cell("te6cckEBAQEAYgAAwP8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVD++buA="); // works at compile-time!
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-comptime/#cell
///
fun cell(bocBase64: String): Cell;

/// Compile-time function. Available since Tact 1.5.0.
///
/// Embeds a base64-encoded BoC `bocBase64` as a `Slice` into the contract.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     stored: Slice =
///         // Works at compile-time!
///         slice("te6cckEBAQEADgAAGEhlbGxvIHdvcmxkIXgtxbw="); // Hello world!
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-comptime/#slice
///
fun slice(bocBase64: String): Slice;

/// Compile-time function. Available since Tact 1.5.0.
///
/// Converts `hex` `String` with hex-encoded and optionally bit-padded
/// contents as a `Slice` and embeds it into the contract.
///
/// Contents are bit-padded if there's an underscore `_` at the very end of
/// `String`. The padding removes all the trailing zeros and the
/// last 1 bit before them:
///
/// ```tact
/// fun padding() {
///     // Not bit-padded
///     rawSlice("4a").loadUint(8); // 74, or 1001010 in binary
///
///     // Bit-padded
///     rawSlice("4a_").loadUint(6); // 18, or 10010 in binary
/// }
/// ```
///
/// Note that this function is limited and only allows to specify up to 1023 bits.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     stored: Slice =
///         rawSlice("000DEADBEEF000");  // CS{Cell{03f...430} bits: 588..644; refs: 1..1}
///     bitPadded: Slice =
///         rawSlice("000DEADBEEF000_"); // CS{Cell{03f...e14} bits: 36..79; refs: 0..0}
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-comptime/#rawslice
///
fun rawSlice(hex: String): Slice;

/// Compile-time function. Available since Tact 1.5.0.
///
/// Concatenates the hexadecimal values of the characters in `str` into one
/// and embeds the resulting `Int` into the contract. Only works for
/// strings that occupy up to 32 bytes, which allows to represent
/// up to 32 ASCII codes or up to 8 4-byte Unicode code points.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     a: Int = ascii("a");            // 97 or 0x61, one byte in total
///     zap: Int = ascii("⚡");         // 14850721 or 0xE29AA1, 3 bytes in total
///     doubleZap: Int = ascii("⚡⚡"); // 249153768823457 or 0xE29AA1E29AA1,
//                                      // 6 bytes in total
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-comptime/#ascii
///
fun ascii(str: String): Int;

/// Compile-time function. Available since Tact 1.5.0.
///
/// Computes a checksum using CRC-32 algorithm and embeds
/// the resulting `Int` value into the contract.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     checksum: Int = crc32("000DEADBEEF000"); // 1821923098
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-comptime/#crc32
///
fun crc32(str: String): Int;

/// Compile-time function.
///
/// Converts the given Toncoins `value` from a human-readable
/// format `String` to the nanoToncoin `Int` format.
///
/// ```tact
/// contract Example {
///     // Persistent state variables
///     one: Int = ton("1");            // one Toncoin, which is equivalent to 10^9 nanoToncoins
///     pointOne: Int = ton("0.1");     // 0.1 Toncoin, which is equivalent to 10^8 nanoToncoins
///     nano: Int = ton("0.000000001"); // 10^-9 Toncoins, which is equivalent to 1 nanoToncoin
///                                     // works at compile-time!
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-comptime/#ton
///
fun ton(value: String): Int;

/// Pseudo-type that represents any struct type.
primitive AnyStruct;

/// Pseudo-type that represents any Message.
primitive AnyMessage;

/// Pseudo-type that represents any Contract.
primitive AnyContract;

/// Extension function for any struct type.
///
/// Converts a `Cell` into the specified struct and returns that struct.
///
/// ```tact
/// struct GuessCoin {
///     probably: Int as coins;
///     nothing: Int as coins;
/// }
///
/// fun directParse(payload: Cell): GuessCoin {
///     return GuessCoin.fromCell(payload);
/// }
///
/// fun cautiousParse(payload: Cell): GuessCoin? {
///     let coin: GuessCoin? = null;
///     try {
///         coin = GuessCoin.fromCell(payload);
///     } catch (e) {
///         dump("Cell payload doesn't match GuessCoin struct!");
///     }
///     return coin;
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to pass a `Cell` with a layout different
///   from the specified struct or to load more data than `Cell` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells/#structfromcell
///
/// [exit code 9]: https://docs.tact-lang.org/book/exit-codes#9
///
fun AnyStruct_fromCell(cell: Cell): S;

/// Extension function for any struct type.
///
/// Converts a `Slice` into the specified struct and returns that struct.
///
/// ```tact
/// struct GuessCoin {
///     probably: Int as coins;
///     nothing: Int as coins;
/// }
///
/// fun directParse(payload: Slice): GuessCoin {
///     return GuessCoin.fromSlice(payload);
/// }
///
/// fun cautiousParse(payload: Slice): GuessCoin? {
///     let coin: GuessCoin? = null;
///     try {
///         coin = GuessCoin.fromSlice(payload);
///     } catch (e) {
///         dump("Slice payload doesn't match GuessCoin struct!");
///     }
///     return coin;
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to pass a `Slice` with a layout different
///   from the specified struct or to load more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells/#structfromslice
///
/// [exit code 9]: https://docs.tact-lang.org/book/exit-codes#9
///
fun AnyStruct_fromSlice(slice: Slice): S;

/// Extension function for any Message type.
///
/// Converts a `Cell` into the specified `Message` and returns that `Message`.
///
/// ```tact
/// message(0x777) TripleAxe {
///     prize: Int as uint32;
/// }
///
/// fun directParse(payload: Cell): TripleAxe {
///     return TripleAxe.fromCell(payload);
/// }
///
/// fun cautiousParse(payload: Cell): TripleAxe? {
///     let coin: TripleAxe? = null;
///     try {
///         coin = TripleAxe.fromCell(payload);
///     } catch (e) {
///         dump("Cell payload doesn't match TripleAxe Message!");
///     }
///     return coin;
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to pass a `Cell` with a layout different
///   from the specified `Message` or to load more data than `Cell` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells/#messagefromcell
///
/// [exit code 9]: https://docs.tact-lang.org/book/exit-codes#9
///
fun AnyMessage_fromCell(cell: Cell): M;

/// Extension function for any Message type.
///
/// Converts a `Slice` into the specified `Message` and returns that `Message`.
///
/// ```tact
/// message(0x777) TripleAxe {
///     prize: Int as uint32;
/// }
///
/// fun directParse(payload: Slice): TripleAxe {
///     return TripleAxe.fromSlice(payload);
/// }
///
/// fun cautiousParse(payload: Slice): TripleAxe? {
///     let coin: TripleAxe? = null;
///     try {
///         coin = TripleAxe.fromSlice(payload);
///     } catch (e) {
///         dump("Slice payload doesn't match TripleAxe Message!");
///     }
///     return coin;
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to pass a `Slice` with a layout different
/// from the specified `Message` or to load more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells/#messagefromslice
///
/// [exit code 9]: https://docs.tact-lang.org/book/exit-codes#9
///
fun AnyMessage_fromSlice(slice: Slice): M;

/// Extension function for any contract type. Available since Tact 1.6.13.
///
/// Converts a `Cell` into the specified contract struct and returns it.
///
/// ```tact
/// contract GuessCoinContract {
///     probably: Int as coins = 42;
///     nothing: Int as coins = 27;
///
///     receive() { cashback(sender()) }
/// }
///
/// fun directParse(payload: Cell): GuessCoinContract {
///     return GuessCoinContract.fromCell(payload);
/// }
///
/// fun cautiousParse(payload: Cell): GuessCoinContract? {
///     let coin: GuessCoinContract? = null;
///     try {
///         coin = GuessCoinContract.fromCell(payload);
///     } catch (e) {
///         dump("Cell payload doesn't match GuessCoinContract struct!");
///     }
///     return coin;
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to pass a `Cell` with a layout different
///   from the specified contract or to load more data than `Cell` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells/#contractfromcell
///
/// [exit code 9]: https://docs.tact-lang.org/book/exit-codes#9
///
fun AnyContract_fromCell(cell: Cell): C;

/// Extension function for any contract type. Available since Tact 1.6.13.
///
/// Converts a `Slice` into the specified contract struct and returns it.
///
/// ```tact
/// contract GuessCoinContract {
///     probably: Int as coins = 42;
///     nothing: Int as coins = 27;
///
///     receive() { cashback(sender()) }
/// }
///
/// fun directParse(payload: Slice): GuessCoinContract {
///     return GuessCoinContract.fromSlice(payload);
/// }
///
/// fun cautiousParse(payload: Slice): GuessCoinContract? {
///     let coin: GuessCoinContract? = null;
///     try {
///         coin = GuessCoinContract.fromSlice(payload);
///     } catch (e) {
///         dump("Slice payload doesn't match GuessCoinContract struct!");
///     }
///     return coin;
/// }
/// ```
///
/// #### Exit codes
///
/// * 9: [Cell underflow] — Thrown when attempting to pass a `Slice` with a layout different
///   from the specified contract or to load more data than `Slice` contains.
///
/// See: https://docs.tact-lang.org/ref/core-cells/#contractfromslice
///
/// [exit code 9]: https://docs.tact-lang.org/book/exit-codes#9
///
fun AnyContract_fromSlice(slice: Slice): C;

/// Extension function for any Message type. Available since Tact 1.6.7.
///
/// Returns the message opcode.
///
/// ```tact
/// message(0x777) TripleAxe {
///     prize: Int as uint32;
/// }
///
/// contract Example {
///     receive(msg: TripleAxe) {
///         dump(TripleAxe.opcode()); // 0x777
///    }
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells/#messageopcode
///
fun AnyMessage_opcode(): Int;

/// Extension function for any struct type.
///
/// Converts the struct to a `Cell` and returns it.
///
/// ```tact
/// struct GuessCoin {
///     probably: Int as coins;
///     nothing: Int as coins;
/// }
///
/// fun coinCell(): Cell {
///     let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
///     let fizz: Cell = s.toCell();
///
///     return fizz; // "x{12A11B}"
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells/#structtocell
///
extends fun toCell(self: AnyStruct): Cell;

/// Extension function for any struct type. Available since Tact 1.5.0.
///
/// Converts the struct to a `Slice` and returns it. Alias to `self.toCell().asSlice()`.
///
/// ```tact
/// struct GuessCoin {
///     probably: Int as coins;
///     nothing: Int as coins;
/// }
///
/// fun coinSlice(): Slice {
///     let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
///     let fizz: Slice = s.toSlice();
///
///     return fizz; // "CS{Cell{000612a11b} bits: 0..24; refs: 0..0}"
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells/#structtoslice
///
extends fun toSlice(self: AnyStruct): Slice;

/// Extension function for any Message.
///
/// Converts the Message to a `Cell` and returns it.
///
/// ```tact
/// message GuessCoin {
///     probably: Int as coins;
///     nothing: Int as coins;
/// }
///
/// fun coinCell(): Cell {
///     let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
///     let fizz: Cell = s.toCell();
///
///     return fizz; // "x{AB37107712A11B}"
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells/#messagetocell
///
extends fun toCell(self: AnyMessage): Cell;

/// Extension function for any Message. Available since Tact 1.5.0.
///
/// Converts the Message to a `Slice` and returns it. Alias to `self.toCell().asSlice()`.
///
/// ```tact
/// message GuessCoin {
///     probably: Int as coins;
///     nothing: Int as coins;
/// }
///
/// fun coinSlice(): Slice {
///     let s: GuessCoin = GuessCoin{ probably: 42, nothing: 27 };
///     let fizz: Slice = s.toSlice();
///
///     return fizz; // "CS{Cell{000eab37107712a11b} bits: 0..56; refs: 0..0}"
/// }
/// ```
///
/// See: https://docs.tact-lang.org/ref/core-cells/#messagetoslice
///
extends fun toSlice(self: AnyMessage): Slice;

/// Extension function for any contract type. Available since Tact 1.6.12.
///
/// Converts the contract data to a `Cell` and returns it.
///
/// ```tact
/// contract Example {
///     probably: Int as coins = 42;
///     nothing: Int as coins = 27;
///
///     get fun asCell(): Cell {
///         return self.toCell();
///     }
/// }
/// ```
///
/// If a contract doesn't use [contract parameters], the resulting `Cell`
/// or `Slice` will contain a leading one bit representing the [lazy initialization bit].
///
/// See: https://docs.tact-lang.org/ref/core-cells/#contracttocell
///
/// [contract parameters]: https://docs.tact-lang.org/book/contracts#parameters
/// [lazy initialization bit]: https://docs.tact-lang.org/book/functions/#init
///
extends fun toCell(self: AnyContract): Cell;

/// Extension function for any contract type. Available since Tact 1.6.12.
///
/// Converts the contract data to a `Slice` and returns it. Alias to `self.toCell().asSlice()`.
///
/// ```tact
/// contract Example {
///     probably: Int as coins = 42;
///     nothing: Int as coins = 27;
///
///     get fun asSlice(): Slice {
///         return self.toSlice();
///     }
/// }
/// ```
///
/// If a contract doesn't use [contract parameters], the resulting `Cell`
/// or `Slice` will contain a leading one bit representing the [lazy initialization bit].
///
/// See: https://docs.tact-lang.org/ref/core-cells/#contracttoslice
///
/// [contract parameters]: https://docs.tact-lang.org/book/contracts#parameters
/// [lazy initialization bit]: https://docs.tact-lang.org/book/functions/#init
///
extends fun toSlice(self: AnyContract): Slice;

/// Creates an empty map of type `map<K, V>`, initially set to `null`.
///
/// ```tact
/// fun example() {
///     let entries: map<Int, String> = emptyMap();
///     //           ^^^^^^^^^^^^^^^^ note that you need to specify the key and
///     //                            value types in the type annotation when
///     //                            declaring the map variable
/// }
/// ```
///
/// On TVM, maps are represented as a `Cell` type, which is very gas-intensive.
///
/// See: https://docs.tact-lang.org/book/maps/#emptymap
///
fun emptyMap(): map<K, V>;

/// Sets or replaces a value `val` under a `key` in the map.
///
/// See: https://docs.tact-lang.org/book/maps/#set
///
extends mutates fun set(self: map<K, V>, key: K, val: V?);

/// Gets a value by its `key` from the map. Returns `null` if the `key` is missing,
/// or the value if the `key` is found.
///
/// See: https://docs.tact-lang.org/book/maps/#get
///
extends fun get(self: map<K, V>, key: K): V?;

/// Replaces a value `val` under the specified `key`
/// if such key exists. Returns `true` on successful replacement and `false` otherwise.
///
/// See: https://docs.tact-lang.org/book/maps/#replace
///
extends mutates fun replace(self: map<K, V>, key: K, val: V?): Bool;

/// Like `replace()`, but returns the old (pre-replacement) value
/// on successful replacement and `null` otherwise.
///
/// See: https://docs.tact-lang.org/book/maps/#replaceget
///
extends mutates fun replaceGet(self: map<K, V>, key: K, val: V?): V?;

/// Deletes a single key-value pair (single entry) by its `key`
/// from the map. Returns `true` in case of successful deletion and `false` otherwise.
///
/// See: https://docs.tact-lang.org/book/maps/#del
///
extends mutates fun del(self: map<K, V>, key: K): Bool;

/// Returns `true` if the value under the given `key` exists in the map and `false` otherwise.
///
/// This function is more gas-efficient than checking `self.get(key) != null`.
///
/// See: https://docs.tact-lang.org/book/maps/#exists
///
extends fun exists(self: map<K, V>, key: K): Bool;

/// Returns `true` if the map is empty and `false` otherwise.
///
/// See: https://docs.tact-lang.org/book/maps/#isempty
///
extends fun isEmpty(self: map<K, V>): Bool;

/// Returns `true` if all entries of the map match corresponding entries of another map,
/// ignoring possible differences in the underlying serialization logic. Returns `false` otherwise.
///
/// This function is very gas expensive, prefer `==` operator for simple comparisons.
///
/// See: https://docs.tact-lang.org/book/maps/#deepequals
///
extends fun deepEquals(self: map<K, V>, other: map<K, V>): Bool;

/// Converts the map to its underlying `Cell` representation.
///
/// Since maps are initialized to `null`, calling `asCell()` on a map
/// with no values assigned will return `null` and **not** an empty `Cell`.
///
/// See: https://docs.tact-lang.org/book/maps/#ascell
///
extends fun asCell(self: map<K, V>): Cell?;



================================================
FILE: src/test/codegen-check/contracts/main.tact
URL: https://github.com/tact-lang/tact/blob/main/src/test/codegen-check/contracts/main.tact
================================================
message(0b10) Bin {}

struct A {
    a: Int;
    b: Int;
    c: Int?;
    d: Bool;
    e: Bool?;
    f: Int;
    g: Int;
}

struct B {
    a: Int;
    b: Int;
    c: Int?;
    d: Bool;
    e: Bool?;
    f: Int;
    g: Int;
}

struct C {
    a: Cell;
    b: Cell?;
    c: Slice?;
    d: Slice?;
    e: Bool;
    f: Int;
    g: Int;
    h: Address;
}

message Message1 {
    a: Int;
}

message Message2 {
    value: Cell;
    value2: Slice;
}

message Message3 {
    val1: Int;
    val2: Int;
    val3: Int;
    val4: Int;
    val5: Int;
    val6: Int;
}

const EXIT_CODE: Int = 1000;

contract MainContract {
    field: Int as uint8;
    value: Int as int256;
    data: Slice as bytes64;
    mapping: map<Int as uint8, Int as int256>;

    receive("Text\x00receiver\x01.\nThis \x07 is \x0D a \x1F test \x7F comment \x9F with \x08 bad \x0C chars") {}

    receive(m: Bin) { require(m.opcode() == 2, "Incorrect message opcode: binary literal") }

    init(field: Int as uint8, value: Int as int256, data: Slice as bytes64, mapping: map<Int as uint8, Int as int256>) {
        self.field = field;
        self.value = value;
        self.data = data;
        self.mapping = mapping;
    }

    receive(msg: Message1) {
        throw(msg.a);
    }

    receive(msg: Message2) {
        let sc_1 = 10;
        let sc_2 = 20;
        let in_msg = sc_1 + sc_2;
        if (in_msg == 0) {
            throw(in_msg);
        }

        throw(msg.value.depth() + msg.value2.depth());
    }

    receive(msg: Message3) {
        throw(msg.val1 + msg.val2 + msg.val3 + msg.val4 + msg.val5 + msg.val6);
    }

    get fun testAugmentedAssignOperators(intVal: Int, intVal2: Int, boolVal: Bool, boolVal2: Bool): Int {
        let a = intVal;

        a += intVal2;
        a -= intVal2;

        let b = boolVal;

        b &&= boolVal2;
        b ||= boolVal2;

        return a + (b ? 10 : 20);
    }

    get fun writeSerializationForA(): A {
        return A {
            a: 1,
            b: 2,
            c: null,
            d: false,
            e: true,
            f: 3,
            g: 4
        }
    }

    get fun writeSerializationForB(): B {
        return B {
            a: 1,
            b: 2,
            c: null,
            d: false,
            e: null,
            f: 3,
            g: 4
        }
    }

    get fun writeSerializationForC(): C {
        return C {
            a: beginCell().storeInt(0, 32).endCell(),
            b: null,
            c: null,
            d: null,
            e: true,
            f: 1,
            g: 2,
            h: myAddress()
        }
    }

    const FOO_ZERO: Int = 0;
    const FOO_ONE: Int = 1;
    const EXIT_CODE: Int = 999;

    get fun testIfOptimizationPositive(a: Int,  b: Int?) {
        if (a == 0) {
            return;
        }

        if (a != 0) {
            return;
        }

        if (0 == a) {
            return;
        }

        if (0 != a) {
            return;
        }

        if (a == self.FOO_ZERO) {
            return;
        }

        if (a != self.FOO_ZERO) {
            return;
        }

        if (self.FOO_ZERO == a) {
            return;
        }

        if (self.FOO_ZERO != a) {
            return;
        }

        if (a == self.FOO_ONE - 1) {
            return;
        }

        if (a != self.FOO_ONE - 1) {
            return;
        }

        if (self.FOO_ONE - 1 == a) {
            return;
        }

        if (self.FOO_ONE - 1 != a) {
            return;
        }

        if (b!! == 0) {
            return;
        }

        if (b!! != 0) {
            return;
        }
    }

    get fun testIfOptimizationComplexPositive(a: Int) {
        if (a == 0) {
            return;
        } else if (a != 0) {
            return;
        }

        if (a == 0) {
            if (a == 0) {
                return;
            } else if (0 != a) {
                return;
            }
        } else if (a != 0) {
            if (0 == a) {
                return;
            } else if (a == 0) {
                return;
            }
        }
    }

    get fun testIfOptimizationNegative(a: Int, b: Int?) {
        if (a == self.FOO_ONE) {
            return;
        }

        if (a != self.FOO_ONE) {
            return;
        }

        if (self.FOO_ONE == a) {
            return;
        }

        if (self.FOO_ONE != a) {
            return;
        }

        if (b == 0) {
            return;
        }

        if (b != 0) {
            return;
        }
    }

    get fun testDumpCall(a: Int) {
        dump(a);
        dumpStack();
    }

    get fun testIfThrowOptimization(a: Int) {
        if (a == self.FOO_ONE) {
            throw(10);
        }

        let cond = a == self.FOO_ONE;
        if (!cond) {
            throw(10);
        }

        if (a == self.FOO_ONE) {
            throw(EXIT_CODE);
        }

        if (a == self.FOO_ONE) {
            throw(EXIT_CODE + 11);
        }

        if (a == self.FOO_ONE) {
            throw(self.EXIT_CODE / 2);
        }
    }

    get fun testIfThrowOptimizationNegative(a: Int) {
        if (a == self.FOO_ONE) {
            throwIf(10, true);
        }

        let cond = a == self.FOO_ONE;
        if (!cond) {
            dump(10);
            throw(10);
        }

        if (a != self.FOO_ONE) {
            dump(10);
            return;
        }

        if (cond) {} else if (a == self.FOO_ONE) {
            throw(10);
        }

        let x: Int = 42;
        if (x.inc() == 0) {
            throw(x.inc());
        }

        if (a == self.FOO_ONE) {
            throw(bar());
        }

        if (a == self.FOO_ONE) {
            throw(10);
        } else {
            throw(11);
        }
    }

    get fun testOrder(): Bool {
        return left() == right();
    }

    get fun asCell(): Cell {
        return self.toCell();
    }

    get fun asSlice(): Slice {
        return self.toSlice();
    }
}

extends mutates fun inc(self: Int): Int { self += 1; return self }
fun bar(): Int { return 10 }

fun left(): Address { dump(1); return myAddress(); }
fun right(): Address { dump(2); return myAddress(); }



================================================
FILE: src/test/codegen/all-contracts.tact
URL: https://github.com/tact-lang/tact/blob/main/src/test/codegen/all-contracts.tact
================================================
import "./empty-message.tact";
import "./large-contract.tact";
import "./struct-field-storage-annotation.tact";
import "./struct-field-func-keywords-name-clash";
import "./message-opcode-parsing.tact";
import "./struct-with-default-and-optional-fields";
import "./mutating-method-on-non-lvalues";
import "./var-scope-global-fun-shadowing-allowed";
import "./map-uint-bool-get";
import "./emptyMap-in-equality";
import "./struct-field-to-cell-in-receiver";
import "./ternary-with-struct-construction";
import "./func.func";



================================================
FILE: src/test/codegen/empty-message.tact
URL: https://github.com/tact-lang/tact/blob/main/src/test/codegen/empty-message.tact
================================================
message MyMessage {
}

contract Issue74 {
    receive("send") {
        send(SendParameters {
            to: context().sender, 
            value: 0, 
            bounce: false,
            mode: SendIgnoreErrors,
            body: MyMessage {}.toCell()
        });
    }
}


================================================
FILE: src/test/codegen/emptyMap-in-equality.tact
URL: https://github.com/tact-lang/tact/blob/main/src/test/codegen/emptyMap-in-equality.tact
================================================
contract TestContract {
    get fun testEq(s: map<Int,Int>): Bool {
        return s == emptyMap();
    }
    get fun testNeq(s: map<Int,Int>): Bool {
        return s != emptyMap();
    }
}



================================================
FILE: src/test/codegen/func.func
URL: https://github.com/tact-lang/tact/blob/main/src/test/codegen/func.func
================================================
;; an empty FunC file to test imports of files with .func extension



================================================
FILE: src/test/codegen/large-contract.tact
URL: https://github.com/tact-lang/tact/blob/main/src/test/codegen/large-contract.tact
================================================
contract LargeContract {

    init() {

    }

    testMap0: map<Int, Int>;
    testMap1: map<Int, Int>;
    testMap2: map<Int, Int>;
    testMap3: map<Int, Int>;
    testMap4: map<Int, Int>;
    testMap5: map<Int, Int>;
    testMap6: map<Int, Int>;
    testMap7: map<Int, Int>;
    testMap8: map<Int, Int>;
    testMap9: map<Int, Int>;
    testMap10: map<Int, Int>;
    testMap11: map<Int, Int>;
    testMap12: map<Int, Int>;
    testMap13: map<Int, Int>;
    testMap14: map<Int, Int>;
    testMap15: map<Int, Int>;
    testMap16: map<Int, Int>;
    testMap17: map<Int, Int>;
    testMap18: map<Int, Int>;
    testMap19: map<Int, Int>;
    testMap20: map<Int, Int>;
    testMap21: map<Int, Int>;
    testMap22: map<Int, Int>;
    testMap23: map<Int, Int>;
    testMap24: map<Int, Int>;
    testMap25: map<Int, Int>;
    testMap26: map<Int, Int>;
    testMap27: map<Int, Int>;
    testMap28: map<Int, Int>;
    testMap29: map<Int, Int>;
    testMap30: map<Int, Int>;
    testMap31: map<Int, Int>;
    testMap32: map<Int, Int>;
    testMap33: map<Int, Int>;
    testMap34: map<Int, Int>;
    testMap35: map<Int, Int>;
    testMap36: map<Int, Int>;
    testMap37: map<Int, Int>;
    testMap38: map<Int, Int>;
    testMap39: map<Int, Int>;
    testMap40: map<Int, Int>;
    testMap41: map<Int, Int>;
    testMap42: map<Int, Int>;
    testMap43: map<Int, Int>;
    testMap44: map<Int, Int>;
    testMap45: map<Int, Int>;
    testMap46: map<Int, Int>;
    testMap47: map<Int, Int>;
    testMap48: map<Int, Int>;
    testMap49: map<Int, Int>; 
    testMap50: map<Int, Int>;
    testMap51: map<Int, Int>;
    testMap52: map<Int, Int>;
    testMap53: map<Int, Int>;
    testMap54: map<Int, Int>;
    testMap55: map<Int, Int>;
    testMap56: map<Int, Int>;
    testMap57: map<Int, Int>;
    testMap58: map<Int, Int>;
    testMap59: map<Int, Int>; 
    testMap60: map<Int, Int>;
    testMap61: map<Int, Int>;
    testMap62: map<Int, Int>;

    get fun getTest0(index: Int): Int? {
        let val: Int = self.testMap0.get(index)!!;
        val = val + self.testMap1.get(index)!!;
        val = val + self.testMap2.get(index)!!;
        val = val + self.testMap3.get(index)!!;
        val = val + self.testMap4.get(index)!!;
        val = val + self.testMap5.get(index)!!;
        val = val + self.testMap6.get(index)!!;
        val = val + self.testMap7.get(index)!!; // error
        val = val + self.testMap8.get(index)!!;
        val = val + self.testMap9.get(index)!!;
        val = val + self.testMap10.get(index)!!;
        return val;
    }

    get fun getTest1(index: Int): Int? {
        let val: Int = self.testMap1.get(index)!!;
        return val;
    }

    get fun getTest2(index: Int): Int? {
        let val: Int = self.testMap2.get(index)!!;
        return val;
    }

    get fun getTest3(index: Int): Int? {
        let val: Int = self.testMap3.get(index)!!;
        return val;
    }

    get fun getTest4(index: Int): Int? {
        let val: Int = self.testMap4.get(index)!!;
        return val;
    }

    get fun getTest5(index: Int): Int? {
        let val: Int = self.testMap5.get(index)!!;
        return val;
    }

    get fun getTest6(index: Int): Int? {
        let val: Int = self.testMap6.get(index)!!;
        return val;
    }

    get fun getTest7(index: Int): Int? {
        let val: Int = self.testMap7.get(index)!!;
        return val;
    }

    get fun getTest8(index: Int): Int? {
        let val: Int = self.testMap8.get(index)!!;
        return val;
    }

    get fun getTest9(index: Int): Int? {
        let val: Int = self.testMap9.get(index)!!;
        return val;
    }

    get fun getTest10(index: Int): Int? {
        let val: Int = self.testMap10.get(index)!!;
        return val;
    }

    get fun getTest11(index: Int): Int? {
        let val: Int = self.testMap11.get(index)!!;
        return val;
    }

    get fun getTest12(index: Int): Int? {
        let val: Int = self.testMap12.get(index)!!;
        return val;
    }

    get fun getTest13(index: Int): Int? {
        let val: Int = self.testMap13.get(index)!!;
        return val;
    }

    get fun getTest14(index: Int): Int? {
        let val: Int = self.testMap14.get(index)!!;
        return val;
    }

    get fun getTest15(index: Int): Int? {
        let val: Int = self.testMap15.get(index)!!;
        return val;
    }

    get fun getTest16(index: Int): Int? {
        let val: Int = self.testMap16.get(index)!!;
        return val;
    }

    get fun getTest17(index: Int): Int? {
        let val: Int = self.testMap17.get(index)!!;
        return val;
    }

    get fun getTest18(index: Int): Int? {
        let val: Int = self.testMap18.get(index)!!;
        return val;
    }

    get fun getTest19(index: Int): Int? {
        let val: Int = self.testMap19.get(index)!!;
        return val;
    }

    get fun getTest20(index: Int): Int? {
        let val: Int = self.testMap20.get(index)!!;
        return val;
    }

    get fun getTest21(index: Int): Int? {
        let val: Int = self.testMap21.get(index)!!;
        return val;
    }

    get fun getTest22(index: Int): Int? {
        let val: Int = self.testMap22.get(index)!!;
        return val;
    }

    get fun getTest23(index: Int): Int? {
        let val: Int = self.testMap23.get(index)!!;
        return val;
    }

    get fun getTest24(index: Int): Int? {
        let val: Int = self.testMap24.get(index)!!;
        return val;
    }

    get fun getTest25(index: Int): Int? {
        let val: Int = self.testMap25.get(index)!!;
        return val;
    }

    get fun getTest26(index: Int): Int? {
        let val: Int = self.testMap26.get(index)!!;
        return val;
    }

    get fun getTest27(index: Int): Int? {
        let val: Int = self.testMap27.get(index)!!;
        return val;
    }

    get fun getTest28(index: Int): Int? {
        let val: Int = self.testMap28.get(index)!!;
        return val;
    }

    get fun getTest29(index: Int): Int? {
        let val: Int = self.testMap29.get(index)!!;
        return val;
    }

    get fun getTest30(index: Int): Int? {
        let val: Int = self.testMap30.get(index)!!;
        return val;
    }

    get fun getTest31(index: Int): Int? {
        let val: Int = self.testMap31.get(index)!!;
        return val;
    }

    get fun getTest32(index: Int): Int? {
        let val: Int = self.testMap32.get(index)!!;
        return val;
    }

    get fun getTest33(index: Int): Int? {
        let val: Int = self.testMap33.get(index)!!;
        return val;
    }

    get fun getTest34(index: Int): Int? {
        let val: Int = self.testMap34.get(index)!!;
        return val;
    }

    get fun getTest35(index: Int): Int? {
        let val: Int = self.testMap35.get(index)!!;
        return val;
    }

    get fun getTest36(index: Int): Int? {
        let val: Int = self.testMap36.get(index)!!;
        return val;
    }

    get fun getTest37(index: Int): Int? {
        let val: Int = self.testMap37.get(index)!!;
        return val;
    }

    get fun getTest38(index: Int): Int? {