# GitHub Docs Parser - Part 9

- [MassSender.spec.ts](https://github.com/Gusarich/ton-mass-sender/blob/main/tests/MassSender.spec.ts)
- [TonForwarder.spec.ts](https://github.com/TrueCarry/ton-contract-forwarder/blob/main/src/contracts/ton-forwarder/TonForwarder.spec.ts)

## 参阅

- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/writing-test-examples.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/writing-test-examples.mdx
================================================
# 编写测试示例

此页面展示了如何为在[Blueprint SDK](https://github.com/ton-org/blueprint)（[Sandbox](https://github.com/ton-org/sandbox)）中创建的FunC合约编写测试。
测试套件为演示合约[fireworks](https://github.com/ton-community/fireworks-func)构建。Fireworks是一个通过`set_first`消息初始化运行的智能合约。

通过`npm create ton@latest`创建一个新的FunC项目后，测试文件`tests/contract.spec.ts`将自动生成在项目目录中，用于测试合约：

```typescript
import ...

describe('Fireworks', () => {
...


        expect(deployResult.transactions).toHaveTransaction({
...
        });

});

it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and fireworks are ready to use
});
```

使用以下命令运行测试：

```bash
npx blueprint test
```

可以通过`blockchain.verbosity`指定附加选项和vmLogs：

```typescript
blockchain.verbosity = {
    ...blockchain.verbosity,
    blockchainLogs: true,
    vmLogs: 'vm_logs_full',
    debugLogs: true,
    print: false,
}
```

## 直接 cell 测试

Fireworks演示了在TON区块链中发送消息的不同操作。

![](/img/docs/writing-test-examples/test-examples-schemes.svg)

一旦你有足够TON金额并通过`set_first`消息部署它，它将使用主要和可用的发送模式组合自动执行。

Fireworks重新部署自己，结果将创建3个Fireworks实体，每个实体都有自己的ID（被保存在存储中），因此有不同的智能合约地址。

为了清晰起见，我们定义不同ID的Fireworks实例（不同的`state_init`）并以下列名称命名：

- 1 - Fireworks setter - 传播不同启动操作码的实体。可以扩展到四种不同的操作码。
- 2 - Fireworks launcher-1 - 启动第一个firework的Fireworks实例，意味着消息将被发送给launcher。
- 3 - Fireworks launcher-2 - 启动第二个firework的Fireworks实例，意味着消息将被发送给launcher。

<details>
    <summary>展开交易细节</summary>

index - 是`launchResult`数组中交易的ID。

- `0` - 对资金库(the Launcher)的外部请求，导致向fireworks发送2.5 TON的出站消息`op::set_first`
- `1` - 在Fireworks setter合约中使用`op::set_first`调用的交易，并执行了两个出站消息到Fireworks Launcher-1和Fireworks Launcher-2
- `2` - 在Fireworks launcher 1中使用`op::launch_first`调用的交易，并执行了四个出站消息到the Launcher。
- `3` - 在Fireworks launcher 2中使用`op::launch_second`调用的交易，并执行了一个出站消息到the Launcher。
- `4` - 在the Launcher中来自Fireworks launcher 1的入站消息的交易。此消息以`send mode = 0`发送。
- `5` - 在the Launcher中来自Fireworks launcher 1的入站消息的交易。此消息以`send mode = 1`发送。
- `6` - 在the Launcher中来自Fireworks launcher 1的入站消息的交易。此消息以`send mode = 2`发送。
- `7` - 在the Launcher中来自Fireworks launcher 1的入站消息的交易。此消息以`send mode = 128 + 32`发送。
- `8` - 在the Launcher中来自Fireworks launcher 2的入站消息的交易。此消息以`send mode = 64`发送。

</details>

每个“firework” - 是交易ID:3和ID:4中出现的带有独特消息体的出站消息。

以下是每个预期成功执行的交易的测试列表。交易[ID:0]是对资金库(the Launcher)的外部请求，导致向fireworks发送2.5 TON的出站消息`op::set_first`。如果您将Fireworks部署到区块链，launcher会是您的钱包。

### 交易ID:1 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L75)检查是否通过发送2.5 TON的交易成功设置了fireworks。
这是最简单的情况，主要目的是确认交易成功属性为true。

要从`launhcResult.transactions`数组中过滤出特定交易，我们可以使用最方便的字段。
通过`from`（合约发送方地址）、`to`（合约目的地地址）、`op`（操作码值） - 我们将仅检索此组合的一个交易。

![](/img/docs/writing-test-examples/test-examples-schemes_id1.svg)

交易[ID:1]在Fireworks Setter合约中被`op::set_first`调用，并执行了两个出站消息到Fireworks Launcher-1和Fireworks Launcher-2。

```typescript

    it('first transaction[ID:1] should set fireworks successfully', async () => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));


        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: true,
            op: Opcodes.set_first
        })

    });

```

### 交易ID:2 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L92)检查交易[ID:2]是否成功执行。

![](/img/docs/writing-test-examples/test-examples-schemes_id2.svg)

交易[ID:2]在Fireworks launcher 1中进行，用`op::launch_first`调用，并执行了四个出站消息到the Launcher。

```typescript
    it('should exist a transaction[ID:2] which launch first fireworks successfully', async () => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: fireworks.address,
            to: launched_f1.address,
            success: true,
            op: Opcodes.launch_first,
            outMessagesCount: 4,
            destroyed: true,
            endStatus: "non-existing",
        })

        printTransactionFees(launchResult.transactions);

    });
```

在交易要影响合约状态的情况下，可以使用`destroyed`、`endStatus`字段指定。

完整的账户状态相关字段列表：

- `destroyed` - `true` - 如果现有合约因执行某个交易而被销毁。否则 - `false`。
- `deploy` - 自定义沙盒标志位，表明合约在此交易期间是否部署。如果合约在此交易前未初始化，而在此交易后变为已初始化，则为`true`。否则 - `false`。
- `oldStatus` - 交易执行前的账户状态。值：`'uninitialized'`, `'frozen'`, `'active'`, `'non-existing'`。
- `endStatus` - 交易执行后的账户状态。值：`'uninitialized'`, `'frozen'`, `'active'`, `'non-existing'`。

### 交易ID:3 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L113)检查交易[ID:3]是否成功执行。

![](/img/docs/writing-test-examples/test-examples-schemes_id3.svg)

交易[ID:3]在Fireworks launcher 1中进行，用`op::launch_first`调用，并执行了四个出站消息到the Launcher。

```typescript

    it('should exist a transaction[ID:3] which launch second fireworks successfully', async () => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: fireworks.address,
            to: launched_f2.address,
            success: true,
            op: Opcodes.launch_second,
            outMessagesCount: 1
        })

        printTransactionFees(launchResult.transactions);

    });




```

### 交易ID:4 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L133)检查交易[ID:4]是否成功执行。

![](/img/docs/writing-test-examples/test-examples-schemes_id4.svg)

收到来自Fireworks launcher 1的入站消息，交易[ID:4]在the Launcher（部署钱包）中进行。此消息以`send mode = 0`发送。

```typescript
 it('should exist a transaction[ID:4] with a comment send mode = 0', async() => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(
            launcher.getSender(),
            toNano('2.5'),
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("send mode = 0").endCell() // 0x00000000 comment opcode and encoded comment

        });
    })
```

### 交易ID:5 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L152)检查交易[ID:5]是否成功执行。

![](/img/docs/writing-test-examples/test-examples-schemes_id5.svg)

收到来自Fireworks launcher 1的入站消息，交易[ID:5]在the Launcher中进行。此消息以`send mode = 1`发送。

```typescript
     it('should exist a transaction[ID:5] with a comment send mode = 1', async() => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(
            launcher.getSender(),
            toNano('2.5'),
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("send mode = 1").endCell() // 0x00000000 comment opcode and encoded comment
        });

    })


```

### 交易ID:6 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L170)检查交易[ID:6]是否成功执行。

![](/img/docs/writing-test-examples/test-examples-schemes_id6.svg)

收到来自Fireworks launcher 1的入站消息，交易[ID:6]在the Launcher中进行。此消息以`send mode = 2`发送。

```typescript
    it('should exist a transaction[ID:6] with a comment send mode = 2', async() => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(
            launcher.getSender(),
            toNano('2.5'),
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("send mode = 2").endCell() // 0x00000000 comment opcode and encoded comment
        });

    })
```

### 交易ID:7 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L188)检查交易[ID:7]是否成功执行。

![](/img/docs/writing-test-examples/test-examples-schemes_id7.svg)

收到来自Fireworks launcher 1的入站消息，交易[ID:7]在the Launcher中进行。此消息以`send mode = 128 + 32`发送。

```typescript
     it('should exist a transaction[ID:7] with a comment send mode = 32 + 128', async() => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(
            launcher.getSender(),
            toNano('2.5'),
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("send mode = 32 + 128").endCell() // 0x00000000 comment opcode and encoded comment
        });
    })
```

### 交易ID:8 成功测试

[此测试](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L188)检查交易[ID:8]是否成功执行。

![](/img/docs/writing-test-examples/test-examples-schemes_id8.svg)

收到来自Fireworks launcher 2的入站消息，交易[ID:8]在the Launcher中进行。此消息以`send mode = 64`发送。

```typescript
  it('should exist a transaction[ID:8] with a comment send mode = 64', async() => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(
            launcher.getSender(),
            toNano('2.5'),
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f2.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("send_mode = 64").endCell() // 0x00000000 comment opcode and encoded comment

        });

    })

```

## 打印和阅读交易费用

在测试期间，阅读有关费用的详细信息对优化合约很有用。printTransactionFees函数以一种方便的方式打印整个交易链。"

```typescript

    it('should be executed and print fees', async() => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(
            launcher.getSender(),
            toNano('2.5'),
        );

        console.log(printTransactionFees(launchResult.transactions));

    });

```

例如，在`launchResult`的情况下，将打印以下表格：

| (index)                    | op           | valueIn        | valueOut       | totalFees      | outActions |
| -------------------------- | ------------ | -------------- | -------------- | -------------- | ---------- |
| 0                          | 'N/A'        | 'N/A'          | '2.5 TON'      | '0.010605 TON' | 1          |
| 1                          | '0x5720cfeb' | '2.5 TON'      | '2.185812 TON' | '0.015836 TON' | 2          |
| 2                          | '0x6efe144b' | '1.092906 TON' | '1.081142 TON' | '0.009098 TON' | 4          |
| 3                          | '0xa2e2c2dc' | '1.092906 TON' | '1.088638 TON' | '0.003602 TON' | 1          |
| 4                          | '0x0'        | '0.099 TON'    | '0 TON'        | '0.000309 TON' | 0          |
| 5                          | '0x0'        | '0.1 TON'      | '0 TON'        | '0.000309 TON' | 0          |
| 6                          | '0x0'        | '0.099 TON'    | '0 TON'        | '0.000309 TON' | 0          |
| 7                          | '0x0'        | '0.783142 TON' | '0 TON'        | '0.000309 TON' | 0          |
| 8                          | '0x0'        | '1.088638 TON' | '0 TON'        | '0.000309 TON' | 0          |

![](/img/docs/writing-test-examples/fireworks_trace_tonviewer.png?=RAW)

index - 是`launchResult`数组中交易的ID。

- `0` - 对资金库(the Launcher)的外部请求，导致发送消息`op::set_first`到Fireworks
- `1` - 导致发送4条消息到the Launcher的Fireworks交易
- `2` - 在Launched Fireworks - 1中从the Launcher收到消息，消息使用`op::launch_first`操作码发送。
- `2` - 在Launched Fireworks - 2中从the Launcher收到消息，消息使用`op::launch_second`操作码发送。
- `4` - 在the Launcher中收到来自Launched Fireworks - 1的消息的交易，消息以`send mode = 0`发送
- `5` - 在the Launcher中收到来自Launched Fireworks - 1的消息的交易，消息以`send mode = 1`发送
- `6` - 在the Launcher中收到来自Launched Fireworks - 1的消息的交易，消息以`send mode = 2`发送
- `7` - 在the Launcher中收到来自Launched Fireworks - 1的消息的交易，消息以`send mode = 128 + 32`发送
- `8` - 在the Launcher中收到来自Launched Fireworks - 2的消息的交易，消息以`send mode = 64`发送

## 交易费用测试

此测试验证启动fireworks的交易费用是否符合预期。可以为佣金费用的不同部分进行自定义定价。

```typescript

  it('should be executed with expected fees', async() => {

        const launcher = await blockchain.treasury('launcher');

        const launchResult = await fireworks.sendDeployLaunch(
            launcher.getSender(),
            toNano('2.5'),
        );

        //totalFee
        console.log('total fees = ', launchResult.transactions[1].totalFees);

        const tx1 = launchResult.transactions[1];
        if (tx1.description.type !== 'generic') {
            throw new Error('Generic transaction expected');
        }

        //computeFee
        const computeFee = tx1.description.computePhase.type === 'vm' ? tx1.description.computePhase.gasFees : undefined;
        console.log('computeFee = ', computeFee);

        //actionFee
        const actionFee = tx1.description.actionPhase?.totalActionFees;
        console.log('actionFee = ', actionFee);


        if ((computeFee == null || undefined) ||
            (actionFee == null || undefined)) {
            throw new Error('undefined fees');
        }

        //The check, if Compute Phase and Action Phase fees exceed 1 TON
        expect(computeFee + actionFee).toBeLessThan(toNano('1'));


    });

```

## 极端情况测试

在本节中，将提供在交易处理期间可能发生的TVM [exit codes（退出代码）](/learn/tvm-instructions/tvm-exit-codes)的测试用例。这些exit codes在区块链代码本身中。同时，必须区分在[Compute Phase（ Compute Phase ）](/learn/tvm-instructions/tvm-overview#compute-phase)和Action Phase（行动阶段）期间的exit code。

Compute Phase期间执行合约逻辑（其代码）。在处理期间，可以创建不同的action（动作）。这些action将在下一阶段 - Action Phase处理。如果Compute Phase不成功，则Action Phase不开始。然而，如果Compute Phase成功，这并不保证Action Phase也会成功结束。

### Compute Phase | exit code = 0

此exit code表示交易的Compute Phase已成功完成。

### Compute Phase | exit code = 1

标记Compute Phase成功的另一种exit code是`1`。要获得此exit code，您需要使用[RETALT](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L20)。

值得注意的是，这个操作码应该在主函数中调用（例如，recv_internal）。如果在另一个函数中调用，则该函数的exit将为`1`，但总体exit code将为`0`。

### Compute Phase | exit code = 2

TVM是[堆栈机](/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine)。与不同值交互时，它们会出现在堆栈上。如果突然堆栈上没有元素，但某些操作码需要它们，那么将抛出此错误。

这可能发生在直接使用操作码时，因为[stdlib.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)（FunC的库）假设不会有这样的问题。

### Compute Phase | exit code = 3

任何代码在执行前都变成了`continuation`。这是一种特殊的数据类型，包含有代码的 slice 、堆栈、寄存器和其他执行代码所需的数据。如果需要，这种continuation可以在稍后运行，来传递开始执行堆栈的必要参数。

首先，我们[构建](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L31-L32)这样的continuation。在这种情况下，这只是一个空的continuation，什么也不做。接下来，使用操作码`0 SETNUMARGS`，我们指示在执行开始时堆栈中不应有值。然后，使用操作码`1 -1 SETCONTARGS`，我们调用continuation，传递1个值。由于本来应该没有值，因此我们得到了StackOverflow错误。

### Compute Phase | exit code = 4

在TVM中，`integer`可以在-2<sup>256</sup> \< x \< 2<sup>256</sup>范围内。如果在计算过程中值超出此范围，则抛出exit code 4。

### Compute Phase | exit code = 5

如果`integer`值超出预期范围，则抛出exit code 5。例如，如果在`.store_uint()`函数中使用了负值。

### Compute Phase | exit code = 6

在较低层级，使用操作码而不是熟悉的函数名称，可以在[此表](/learn/archive/tvm-instructions)中以HEX形式看到。在这个例子中，我们[使用](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L25)`@addop`，添加了一个不存在的操作码。

模拟器在尝试处理此操作码时无法识别它，并抛出 6。

### Compute Phase | exit code = 7

这是一个发生在接收到错误的数据类型时的很常见的错误。在[示例](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L79-L80)中，`tuple`包含3个元素，但在解包时尝试获取4个。

还有许多其他情况会抛出此错误。其中一些：

- [not a null](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L433)
- [not an integer](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L441)
- [not a cell](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L478)
- [not a cell builder](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L500)
- [not a cell slice](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L509)
- [not a string](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L518)
- [not a bytes chunk](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L527)
- [not a continuation](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L536)
- [not a box](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L545)
- [not a tuple](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L554)
- [not an atom](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L598)

### Compute Phase | exit code = 8

TON 中的所有数据都存储在 [cells](/develop/data-formats/cell-boc#cell) 中。一个 cell 可存储 1023 位数据和 4 个指向其他 cell 的引用。如果尝试写入超过 1023 位的数据或超过 4 个引用，将抛出 exit code 8。

### Compute Phase | exit code = 9

如果尝试从 slice 中读取比它包含的更多数据（从cell中读取数据时，必须将其转换为 slice 数据类型），则抛出exit code 9。例如，如果 slice 中有10位，而读取了11位，或者如果没有对其他引用的链接，但尝试加载引用。

### Compute Phase | exit code = 10

此错误在处理[字典](/develop/func/stdlib/#dictionaries-primitives)时抛出。例如，当值属于键时[存储在另一个cell中](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L100-L110)作为引用。在这种情况下，您需要使用`.udict_get_ref()`函数来获取这样的值。

然而，另一个cell中的链接[应该只有1个](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/dict.cpp#L454)，而不是2个，如我们的例子：

```
root_cell
├── key
│   ├── value
│   └── value - second reference for one key
└── key
    └── value
```

这就是为什么在尝试读取数值时，我们会得到 exit code 10。

**附加：** 您还可以在字典中存储键旁的值：

```
root_cell
├── key-value
└── key-value
```

**注意：** 实际上，字典的结构（数据如何放置在cell中）比上面的示例更复杂。因此，它们被简化了，以便理解示例。

### Compute Phase | exit code = 11

此错误发生在未知情况。例如，在使用[SENDMSG](/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages)操作码时，如果传递了[错误](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L116)（例如，空的）的消息cell，那么就会发生这种错误。

此外，它还在尝试调用不存在的方法时发生。开发人员通常是在调用不存在的GET方法时面临这种情况。

### Compute Phase | exit code = -14 (13)

如果处理Compute Phase的TON不足，则抛出此错误。在枚举类`Excno`中，其中指示了Compute Phase中各种错误的exit code，[指示的值为13](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/excno.hpp#L39)。

然而，在处理过程中，对此值应用了[NOT操作](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1574)，将此值更改为`-14`。这样做是为了这个exit code不能被伪造，例如使用`throw`函数，因为所有这些函数只接受exit code是正值。

### Action Phase | exit code = 32

Action Phase在Compute Phase之后开始，它处理在Compute Phase期间写入[寄存器c5](/learn/tvm-instructions/tvm-initialization#control-register-c5)的动作。如果此寄存器中的数据写入不正确，则抛出exit code 32。

### Action Phase | exit code = 33

目前，一个交易中最多可以有`255`个动作。如果超过这个值，则Action Phase将以exit code 33 结束。

### Action Phase | exit code = 34

Exit code是造成处理action时的大部分错误的原因：无效消息、不正确动作等。

### Action Phase | exit code = 35

在构建消息的 [CommonMsgInfo](/develop/smart-contracts/tutorials/wallet#commonmsginfo) 部分时，必须指定正确的源地址。它必须等于[addr_none](/develop/data-formats/msg-tlb#addr_none00) 或发送消息的账户地址。

在区块链代码中，这由[check_replace_src_addr](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1985)处理。

### Action Phase | exit code = 36

如果目的地地址无效，则抛出exit code 36。一些可能的原因是不存在的工作链或不正确的地址。所有检查都可以在[check_rewrite_dest_addr](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L2014-L2113)中看到。

### Action Phase | exit code = 37

此exit code类似于Compute Phase的`-14`。在这里，它意味着余额不足以发送指定金额的TON。

### Action Phase | exit code = 38

与exit code 37相同，但指的是余额中缺乏[ExtraCurrency](/develop/research-and-development/minter-flow#extracurrency)。

### Action Phase | exit code = 40

在这种情况下，有足够的TON来处理消息的某个部分（比如说5个cell），而消息中有10个cell，将抛出exit code 40。

### Action Phase | exit code = 43

可能发生的情况是超过了库中cell的最大数量或超过了Merkle树的最大深度。

库是存储在[Masterchain](/learn/overviews/ton-blockchain#masterchain-blockchain-of-blockchains)中的cell，如果它是[公开的](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1844)，可以被所有智能合约使用。

:::info
由于更新代码时行的顺序可能会改变，一些链接变得不相关。因此，所有链接都将使用提交[9728bc65b75defe4f9dcaaea0f62a22f198abe96](https://github.com/ton-blockchain/ton/tree/9728bc65b75defe4f9dcaaea0f62a22f198abe96)时的代码库状态。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-comparison.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-comparison.md
================================================
# TON Connect 2.0 与 1.0 对比

TON Connect 2.0 解决了 TON Connect 1.0 中存在的许多问题。

TON Connect 2.0 协议提供了最高级别的安全性，为分散式应用程序（dApps）的开发提供了一个对开发者友好的环境，并由实时UX驱动，提供了流畅的用户体验。

请参阅以下两个版本之间的对比：

|                   | TON&amp;amp;nbsp;Connect&amp;amp;nbsp;v1 |         TON&amp;amp;nbsp;Connect&amp;amp;nbsp;v2        |
| :---------------: | :------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
| 连接到基于 web 的 dApps |                                        ✔︎                                        |                                                ✔︎                                               |
|        发送交易       |                                        ✔︎                                        |                                                ✔︎                                               |
|    在钱包内连接 dapps   |                                                                                  |                                                ✔︎                                               |
|       扫描二维码       |                                      每次操作都需要                                     |                                             连接时只需一次                                             |
|     无服务器 dApps    |                                                                                  |                                                ✔︎                                               |
|        实时UX       |                                                                                  |                                                ✔︎                                               |
|        切换账户       |                                                                                  |                                               即将推出                                              |
|    应用和用户之间发送消息    |                                                                                  |                                               即将推出                                              |
|       钱包兼容性       |                                     Tonkeeper                                    | Tonkeeper, OpenMask, MyTonWallet, TonHub （即将推出）和[其他](/participate/wallets/apps#basics-features) |



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-business.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-business.md
================================================
# TON Connect 企业版

TON Connect 旨在通过提供吸引流量和增加用户留存的强大功能，为企业定制化服务。

## 产品特性

- 安全私密的认证，可控的个人数据公开
- 在单个用户会话内的 TON 上进行任意事务签名
- 应用程序与用户钱包之间的即时连通性
- 钱包内直接自动可用的应用程序

## 采用 TON Connect

### 基本步骤

为了让开发者将 TON Connect 集成到他们的应用中，使用了专门的 TON Connect SDK。这个过程相当简单，可以在需要时访问正确的文档进行操作。

TON Connect 允许用户通过二维码或通用连接链接将他们的应用与众多钱包连接。应用程序还可以使用内置浏览器扩展在钱包内打开，因此了解添加到TON Connect中的附加功能至关重要。

### TON Connect 的开发者集成协助

1. 描述您的应用的现有用户流程
2. 确定所需的操作（例如，事务授权，消息签名）
3. 向我们的团队描述您的技术栈

如果您想了解更多关于 TON Connect 及其各种服务和功能，欢迎通过 [developer](https://t.me/tonrostislav) 与 TON Connect 业务团队联系，讨论您想要的解决方案。

### 常见的实现案例

通过使用 [TON Connect SDK](https://github.com/ton-connect/sdk)，详细的集成说明让开发者能够：

- 将他们的应用与各种 TON 钱包类型连接
- 通过相应钱包的地址进行后端登录
- 发送请求事务和在钱包内签名（接受请求）

为了更好地了解这个解决方案的可能性，请查看我们在 Github 上可用的示例应用：[https://github.com/ton-connect/](https://github.com/ton-connect/demo-dapp)

### 目前支持的技术栈：

- 所有 web 应用 —— 无服务器的和后端的
- React-Native 移动应用
- 即将推出：Swift、Java、Kotlin 的移动应用 SDK

TON Connect 是一个开放协议，可用于使用任何编程语言或开发环境开发 dapps。

对于 JavaScript (JS) 应用，TON 开发者社区创建了一个 JavaScript SDK，使开发者能够在几分钟内无缝集成 TON Connect。将来，将提供设计用于其他编程语言的 SDK。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-security.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-security.md
================================================
# TON Connect 的安全性

TON Connect 确保用户对他们分享的数据有明确的控制权，这意味着在应用程序和钱包传输期间数据不会泄露。为了加强这一设计，钱包和应用采用了强大的加密身份验证系统，这些系统相互协作。

## 用户数据和资金的安全性

- 在 TON Connect 上，当用户数据通过bridge被传输到钱包时，是端到端加密的。这允许应用和钱包使用第三方bridge服务器，减少数据被盗和被篡改的可能性，在此过程中显著提高数据的完整性和安全性。
- 通过 TON Connect，安全参数被设置以允许用户数据直接与他们的钱包地址进行认证。这允许用户使用多个钱包，并选择在特定应用内使用哪一个。
- TON Connect 协议允许分享个人数据项（如联系方式和 KYC 信息等），这意味着用户明确确认了这些数据的分享。

有关 TON Connect 及其以安全为重点的设计的具体细节和相关代码示例，可以通过 [TON Connect Github](https://github.com/ton-connect/) 找到。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/react.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/react.mdx
================================================
# 用于 React 的 TON Connect

推荐用于React应用程序的SDK是[UI React SDK](/develop/dapps/ton-connect/developers#ton-connect-react)。它是一个React组件，提供了与TON Connect交互的高级方式。

## 实现

### 1. 安装

要开始将TON Connect集成到您的DApp中，您需要安装`@tonconnect/ui-react`包。您可以使用npm或yarn来实现这一目的：

```bash npm2yarn
npm i @tonconnect/ui-react
```

### 2. TON Connect初始化

安装包之后，您应该为您的应用程序创建一个`manifest.json`文件。有关如何创建manifest.json文件的更多信息，请参阅[此处](/develop/dapps/ton-connect/manifest)。

创建manifest文件后，将TonConnectUIProvider导入到您的Mini App的根目录，并传入manifest URL：

```tsx
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function App() {
    return (
        <TonConnectUIProvider manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json">
            { /* Your app */ }
        </TonConnectUIProvider>
    );
}

```

### 3. 连接到钱包

添加`TonConnectButton`。TonConnect按钮是初始化连接的通用UI组件。连接钱包后，它会变成钱包菜单。建议将其放置在应用程序的右上角。

```tsx
export const Header = () => {
  return (
    <header>
      <span>My App with React UI</span>
      <TonConnectButton />
    </header>
  );
};
```

您还可以为按钮添加className和style属性。请注意，您不能给TonConnectButton传递子组件：

```js
<TonConnectButton className="my-button-class" style={{ float: "right" }}/>
```

此外，您始终可以使用`useTonConnectUI`hook和[connectWallet](https://github.com/ton-connect/sdk/tree/main/packages/ui#call-connect)方法手动初始化连接。

```tsx
export const Header = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  return (
    <header>
      <span>My App with React UI</span>
      <button onClick={() => tonConnectUI.openModal()}>
        Connect Wallet
      </button>
    </header>
  );
};
```

#### 连接特定钱包

要打开特定钱包的模态窗口，请使用 `openSingleWalletModal()` 方法。该方法将钱包的 `app_name` 作为参数（请参阅 [wallets-list.json](https://github.com/ton-blockchain/wallets-list/blob/main/wallets-v2.json) 文件），并打开相应的钱包模态窗口。一旦模式窗口成功打开，它将返回一个解析的 promise。

```tsx
<button onClick={() => tonConnectUI.openSingleWalletModal('tonwallet')}>
  Connect Wallet
</button>
```

### 重定向

[在GitHub上查看示例](https://github.com/ton-connect/demo-dapp-with-wallet/blob/master/src/App.tsx)

#### 5. UI自定义

要[定制模态窗口的UI](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)，您可以使用`useTonConnectUI`hook和`setOptions`函数。详见[Hooks](#hooks)部分中关于useTonConnectUIhook的更多信息。

```tsx
      <TonConnectUIProvider
            // ... other parameters
          actionsConfiguration={{
              twaReturnUrl: 'https://t.me/<YOUR_APP_NAME>'
          }}
      >
      </TonConnectUIProvider>
```

如果您想在React应用程序中使用一些低级TON Connect UI SDK的特性，您可以使用`@tonconnect/ui-react`包中的hook。

### useTonAddress

使用它来获取用户当前的ton钱包地址。传递布尔参数isUserFriendly来选择地址的格式。如果钱包未连接，hook将返回空字符串。

## 钩子（Hooks）

如果您想在 React 应用程序中使用一些底层 TON Connect UI SDK 功能，可以使用 `@tonconnect/uii-react` 包中的钩子。

### useTonAddress

查看所有钱包属性

```tsx
import { useTonAddress } from '@tonconnect/ui-react';

export const Address = () => {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);

  return (
    userFriendlyAddress && (
      <div>
        <span>User-friendly address: {userFriendlyAddress}</span>
        <span>Raw address: {rawAddress}</span>
      </div>
    )
  );
};
```

### useTonConnectModal

使用此钩子可访问打开和关闭模态窗口的功能。钩子会返回一个对象，其中包含当前模式窗口状态以及打开和关闭模式窗口的方法。

```tsx
import { useTonConnectModal } from '@tonconnect/ui-react';

export const ModalControl = () => {
    const { state, open, close } = useTonConnectModal();

    return (
      <div>
          <div>Modal state: {state?.status}</div>
          <button onClick={open}>Open modal</button>
          <button onClick={close}>Close modal</button>
      </div>
    );
};
```

### useTonWallet

[了解更多关于setOptions函数](https://github.com/ton-connect/sdk/tree/main/packages/ui#change-options-if-needed)

此外，您还可以访问所连接钱包的更多具体细节，如名称、图像和其他属性（请参阅 [WalletInfo 接口](https://ton-connect.github.io/sdk/types/_tonconnect_sdk.WalletInfo.html)）。

```tsx
import { useTonWallet } from '@tonconnect/ui-react';

export const Wallet = () => {
  const wallet = useTonWallet();

  return (
    wallet && (
      <div>
        <span>Connected wallet address: {wallet.account.address}</span>
        <span>Device: {wallet.device.appName}</span>
        <span>Connected via: {wallet.provider}</span>
        {wallet.connectItems?.tonProof?.proof && <span>Ton proof: {wallet.connectItems.tonProof.proof}</span>}

        <div>Connected wallet info:</div>
        <div>
          {wallet.name} <img src={wallet.imageUrl} />
        </div>
      </div>
    )
  );
};

```

### useTonConnectUI

使用它可访问 `TonConnectUI` 实例和用户界面选项更新功能。

[查看有关 TonConnectUI 实例方法的更多信息](https://github.com/ton-connect/sdk/tree/main/packages/ui#send-transaction)

让我们来看看如何在实践中使用React UI SDK。

```tsx
import { Locales, useTonConnectUI } from '@tonconnect/ui-react';

export const Settings = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const onLanguageChange = (language: Locales) => {
    setOptions({ language });
  };

  return (
    <div>
      <label>language</label>
      <select onChange={(e) => onLanguageChange(e.target.value as Locales)}>
        <option value="en">en</option>
        <option value="ru">ru</option>
      </select>
    </div>
  );
};
```

### useIsConnectionRestored

表示连接恢复进程的当前状态。
您可以用它来检测连接恢复进程是否已完成。

```tsx
import { useIsConnectionRestored } from '@tonconnect/ui-react';

export const EntrypointPage = () => {
  const connectionRestored = useIsConnectionRestored();

  if (!connectionRestored) {
    return <Loader>Please wait...</Loader>;
  }

  return <MainPage />;
};
```

## 通过哈希理解交易状态

位于支付处理中（使用tonweb）的原理。[了解更多](/develop/dapps/asset-processing/#checking-contracts-transactions)

### 后端的可选检查（tonproof）

向指定地址发送 TON 硬币（以 nanotons  为单位）：

```js
import { useTonConnectUI } from '@tonconnect/ui-react';

const transaction: SendTransactionRequest = {
  validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
  messages: [
    {
      address:
        "0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-", // message destination in user-friendly format
      amount: "20000000", // Toncoin in nanotons
    },
  ],
};

export const Settings = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  return (
    <div>
      <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
        Send transaction
      </button>
    </div>
  );
};

```

- 在此获取更多示例：[准备信息](/v3/guidelines/ton-connect/guidelines/preparing-messages)

### 通过哈希值了解交易状态

该原理位于支付处理部分（使用 tonweb）。[查看更多](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)

### 后台可选检查 (ton_proof)

:::tip
了解如何签署和验证信息：[签名和验证](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
:::

要确保用户真正拥有声明的地址，可以使用 `ton_proof`。

或

- 加载状态：在等待后台响应时显示加载状态。
- 带有 tonProof 的就绪状态：将状态设置为 'ready'，并包含 tonProof 值。
- 如果出现错误，请移除加载器，然后创建不带附加参数的连接请求。

```ts
const [tonConnectUI] = useTonConnectUI();

// Set loading state
tonConnectUI.setConnectRequestParameters({ state: "loading" });

// Fetch tonProofPayload from backend
const tonProofPayload: string | null =
  await fetchTonProofPayloadFromBackend();

if (tonProofPayload) {
  // Set ready state with tonProof
  tonConnectUI.setConnectRequestParameters({
    state: "ready",
    value: { tonProof: tonProofPayload },
  });
} else {
  // Remove loader
  tonConnectUI.setConnectRequestParameters(null);
}
```

#### 处理 ton_proof 结果

连接钱包后，您可以在钱包对象中找到 `ton_proof` 结果：

```ts
useEffect(() => {
    tonConnectUI.onStatusChange((wallet) => {
      if (
        wallet.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        checkProofInYourBackend(
          wallet.connectItems.tonProof.proof,
          wallet.account.address
        );
      }
    });
  }, [tonConnectUI]);
```

#### ton_proof 的结构

```ts
type TonProofItemReplySuccess = {
  name: "ton_proof";
  proof: {
    timestamp: string; // Unix epoch time (seconds)
    domain: {
      lengthBytes: number; // Domain length
      value: string;  // Domain name
    };
    signature: string; // Base64-encoded signature
    payload: string; // Payload from the request
  }
}
```

断开钱包的调用：

### 钱包断线

调用以断开钱包连接：

```js
const [tonConnectUI] = useTonConnectUI();

await tonConnectUI.disconnect();
```

#### 示例

使用 TonConnect 部署合约非常简单。您只需获取合约代码和状态初始值，将其存储为 cell ，然后使用提供的 `stateInit` 字段发送事务。

请注意，`CONTRACT_CODE` 和 `CONTRACT_INIT_DATA` 可以在 wrappers 中找到。

```typescript
import { beginCell, Cell, contractAddress, StateInit, storeStateInit } from '@ton/core';

const [tonConnectUI] = useTonConnectUI();

const init = {
    code: Cell.fromBase64('<CONTRACT_CODE>'),
    data: Cell.fromBase64('<CONTRACT_INIT_DATA>')
} satisfies StateInit;

const stateInit = beginCell()
    .store(storeStateInit(init))
    .endCell();

const address = contractAddress(0, init);

await tonConnectUI.sendTransaction({
    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
    messages: [
        {
            address: address.toRawString(),
            amount: '5000000',
            stateInit: stateInit.toBoc().toString('base64')
        }
    ]
});

```

## Wrappers

封装器是简化与合约交互的类，让你无需关心底层细节即可工作。

- 在 FunC 中开发合约时，您需要自己编写封装器。
- 使用 [Tact language](https://docs.tact-lang.org)时，系统会自动为您生成包装器。

:::tip
查看 [blueprint](https://github.com/ton-org/blueprint) 文档，了解如何开发和部署合约
:::

让我们看看默认的 `Blueprint` 计数器封装器示例以及如何使用它：

<details>
<summary>包装器使用</summary>
计数器包装器类：

```ts
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type CounterConfig = {
    id: number;
    counter: number;
};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32).endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class Counter implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
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

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}

```

然后，您就可以在您的 react 组件中使用该类：

```ts

import "buffer";
import {
  TonConnectUI,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  Address,
  beginCell,
  Sender,
  SenderArguments,
  storeStateInit,
  toNano,
  TonClient,
} from "@ton/ton";

class TonConnectProvider implements Sender {
  /**
   * The TonConnect UI instance.
   * @private
   */
  private readonly provider: TonConnectUI;

  /**
   * The address of the current account.
   */
  public get address(): Address | undefined {
    const address = this.provider.account?.address;
    return address ? Address.parse(address) : undefined;
  }

  /**
   * Creates a new TonConnectProvider.
   * @param provider
   */
  public constructor(provider: TonConnectUI) {
    this.provider = provider;
  }

  /**
   * Sends a message using the TonConnect UI.
   * @param args
   */
  public async send(args: SenderArguments): Promise<void> {
    // The transaction is valid for 10 minutes.
    const validUntil = Math.floor(Date.now() / 1000) + 600;

    // The address of the recipient, should be in bounceable format for all smart contracts.
    const address = args.to.toString({ urlSafe: true, bounceable: true });

    // The address of the sender, if available.
    const from = this.address?.toRawString();

    // The amount to send in nano tokens.
    const amount = args.value.toString();

    // The state init cell for the contract.
    let stateInit: string | undefined;
    if (args.init) {
      // State init cell for the contract.
      const stateInitCell = beginCell()
        .store(storeStateInit(args.init))
        .endCell();
      // Convert the state init cell to boc base64.
      stateInit = stateInitCell.toBoc().toString("base64");
    }

    // The payload for the message.
    let payload: string | undefined;
    if (args.body) {
      // Convert the message body to boc base64.
      payload = args.body.toBoc().toString("base64");
    }

    // Send the message using the TonConnect UI and wait for the message to be sent.
    await this.provider.sendTransaction({
      validUntil: validUntil,
      from: from,
      messages: [
        {
          address: address,
          amount: amount,
          stateInit: stateInit,
          payload: payload,
        },
      ],
    });
  }
}

const CONTRACT_ADDRESS = "EQAYLhGmznkBlPxpnOaGXda41eEkliJCTPF6BHtz8KXieLSc";

const getCounterInstance = async () => {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  });

  // OR you can use createApi from @ton-community/assets-sdk
  // import {
  //   createApi,
  // } from "@ton-community/assets-sdk";

  // const NETWORK = "testnet";
  // const client = await createApi(NETWORK);


  const address = Address.parse(CONTRACT_ADDRESS);
  const counterInstance = client.open(Counter.createFromAddress(address));

  return counterInstance;
};

export const Header = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();

  const increaseCount = async () => {
    const counterInstance = await getCounterInstance();
    const sender = new TonConnectProvider(tonConnectUI);

    await counterInstance.sendIncrease(sender, {
      increaseBy: 1,
      value: toNano("0.05"),
    });
  };

  const getCount = async () => {
    const counterInstance = await getCounterInstance();

    const count = await counterInstance.getCounter();
    console.log("count", count);
  };

  return (
    <main>
      {!wallet && (
        <button onClick={() => tonConnectUI.openModal()}>Connect Wallet</button>
      )}
      {wallet && (
        <>
          <button onClick={increaseCount}>Increase count</button>
          <button onClick={getCount}>Get count</button>
        </>
      )}
    </main>
  );
};

```

</details>

### 用于 Jettons 和 NFT 的包装器

若要与 jettons 或 NFT 进行交互，可以使用 [assets-sdk](https://github.com/ton-community/assets-sdk)。
该 SDK 提供了包装器，可简化与这些资产的交互。有关实用示例，请查看我们的 [examples](https://github.com/ton-community/assets-sdk/tree/main/examples) 部分。

## API 文档

[最新的API文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)

## 实例

- 一步步 [TON Hello World 指南](https://helloworld.tonstudio.io/03-client/) 用 React UI 创建一个简单的 DApp。
- [Demo dApp](https://github.com/ton-connect/demo-dapp-with-react-ui) - 使用 `@tonconnect/ui-react` 的 DApp 示例。
- [ton.vote](https://github.com/orbs-network/ton-vote) - 使用 TON Connect 实现的 React 网站示例。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/vue.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/vue.mdx
================================================
# 用于 Vue 的 TON Connect

为 Vue 应用程序推荐的 SDK 是 [UI Vue SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-vue)。它是一个 Vue 组件，提供了与 TON Connect 交互的高级方法。

## 实现

### 1. 安装

要开始将 TON Connect 集成到您的 DApp 中，您需要安装 `@townsquarelabs/ui-vue` 软件包。为此，您可以使用 npm 或 yarn：

```bash npm2yarn
npm i @townsquarelabs/ui-vue
```

### 2. TON Connect初始化

将 TonConnectUIProvider 添加到应用程序的根目录。您可以使用道具指定用户界面选项。

<!-- [See all available options](https://github.com/TownSquareXYZ/tonconnect-ui-vue/blob/aa7439073dae5f7ccda3ab10291fc4658f5d3588/src/utils/UIProvider.ts#L11) -->

所有 TonConnect 用户界面钩子调用和 `<TonConnectButton />` 组件必须置于 `<TonConnectUIProvider>` 内。

```html
<template>
  <TonConnectUIProvider :options="options">
    <!-- Your app -->
  </TonConnectUIProvider>
</template>

<script>
import { TonConnectUIProvider } from '@townsquarelabs/ui-vue';

export default {
  components: {
    TonConnectUIProvider
  },
  setup(){
    const options = {
      manifestUrl:"https://<YOUR_APP_URL>/tonconnect-manifest.json",
    };
    return {
      options
    }
  }
}
</script>
```

### 连接到钱包

TonConnect Button 是用于初始化连接的通用 UI 组件。连接钱包后，它将转换为钱包菜单。
建议将它放在应用程序的右上角。

```html
<template>
  <header>
    <span>My App with Vue UI</span>
    <TonConnectButton/>
  </header>
</template>

<script>
import { TonConnectButton } from '@townsquarelabs/ui-vue';

export default {
  components: {
    TonConnectButton
  }
}
</script>
```

您还可以为按钮添加 `class` 和 `:style` 属性。请注意，您不能向 TonConnectButton 传递子按钮。
`<TonConnectButton class="my-button-class" :style="{ float: 'right' }"/>`

### 重定向

如果想在钱包连接后将用户重定向到特定页面，可以使用 `useTonConnectUI` 钩子和 [自定义返回策略](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy)。

#### Telegram 小程序

如果您想在钱包连接后将用户重定向到[Telegram 迷你应用](/v3/guidelines/dapps/tma/overview)，您可以自定义 "TonConnectUIProvider "元素：

```html
<template>
  <TonConnectUIProvider :options="options">
    <!-- Your app -->
  </TonConnectUIProvider>
</template>

<script>
import { TonConnectUIProvider } from '@townsquarelabs/ui-vue';

export default {
  components: {
    TonConnectUIProvider,
  },
  setup() {
    const options = {
      actionsConfiguration: { twaReturnUrl: 'https://t.me/<YOUR_APP_NAME>' },
    };
    return {
      options,
    };
  },
};
</script>
```

[在 SDK 文档中阅读更多内容](https://github.com/ton-connect/sdk/tree/main/packages/ui#use-inside-twa-telegram-web-app)

### 用户界面定制

要[自定义用户界面](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)，您可以使用`useTonConnectUI`钩子和`setOptions`函数。有关 useTonConnectUI 钩子的更多信息，请参阅 [钩子](#usetonconnectui) 部分。

## 钩子（Hooks）

### useTonAddress

用它来获取用户当前的 ton 钱包地址。通过布尔参数 isUserFriendly 来选择地址格式。如果钱包未连接，钩子将返回空字符串。

```html
<template>
  <div v-if="address">
    <span>User-friendly address: {{ userFriendlyAddress }}</span>
    <span>Raw address: {{ rawAddress }}</span>
  </div>
</template>

<script>
import { useTonAddress } from '@townsquarelabs/ui-vue';

export default {
  setup() {
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);

    return {
      userFriendlyAddress,
      rawAddress
    }
  }
}
</script>
```

### useTonWallet

用它来获取用户当前的 ton 钱包。如果钱包未连接，钩子将返回空值。

查看钱包的所有属性
// todo

<!-- [Wallet interface](https://ton-connect.github.io/sdk/interfaces/_tonconnect_sdk.Wallet.html) -->

<!-- [WalletInfo interface](https://ton-connect.github.io/sdk/types/_tonconnect_sdk.WalletInfo.html) -->

```html
<template>
  <div v-if="wallet">
    <span>Connected wallet: {{ wallet.name }}</span>
    <span>Device: {{ wallet.device.appName }}</span>
  </div>
</template>

<script>
import { useTonWallet } from '@townsquarelabs/ui-vue';

export default {
  setup() {
    const wallet = useTonWallet();

    return {
      wallet
    }
  }

}
</script>
```

### useTonConnectModal

使用此钩子可访问打开和关闭模态窗口的功能。钩子会返回一个对象，其中包含当前模式窗口状态以及打开和关闭模式窗口的方法。

```html
<template>
  <div>
    <div>Modal state: {{ state?.status }}</div>
    <button @click="open">Open modal</button>
    <button @click="close">Close modal</button>
  </div>
</template>

<script>
import { useTonConnectModal } from '@townsquarelabs/ui-vue';

export default {
  setup() {
    const { state, open, close } = useTonConnectModal();
    return { state, open, close };
  }
};
</script>
```

### useTonConnectUI

使用它可访问 `TonConnectUI` 实例和用户界面选项更新功能。

[查看有关 TonConnectUI 实例方法的更多信息](https://github.com/ton-connect/sdk/tree/main/packages/ui#send-transaction)

[查看有关 setOptions 函数的更多信息](https://github.com/ton-connect/sdk/tree/main/packages/ui#change-options-if-needed)

```html
<template>
  <div>
    <button @click="sendTransaction">Send transaction</button>
    <div>
      <label>language</label>
      <select @change="onLanguageChange($event.target.value)">
        <option value="en">en</option>
        <option value="ru">ru</option>
        <option value="zh">zh</option>
      </select>
    </div>
  </div>
</template>

<script>
import { Locales, useTonConnectUI } from '@townsquarelabs/ui-vue';

export default {
  name: 'Settings',
  setup() {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    const onLanguageChange = (lang) => {
      setOptions({ language: lang as Locales });
    };

    const myTransaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
          amount: "20000000",
          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
        {
          address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
          amount: "60000000",
          // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
        }
      ]
    }

    const sendTransaction = () => {
      tonConnectUI.sendTransaction(myTransaction);
    };

    return { onLanguageChange, sendTransaction };
  }
};
</script>
```

### useIsConnectionRestored

表示连接恢复进程的当前状态。
您可以用它来检测连接恢复进程是否已完成。

```html
<template>
  <div>
    <div v-if="!connectionRestored">Please wait...</div>
    <MainPage v-else />
  </div>
</template>

<script>
import { useIsConnectionRestored } from '@townsquarelabs/ui-vue';

export default {
  name: 'EntrypointPage',
  setup() {
    const connectionRestored = useIsConnectionRestored();
    return { connectionRestored };
  }
};
</script>
```

## 使用方法

让我们看看如何在实践中使用 Vue UI SDK。

### 发送交易

向指定地址发送 TON 硬币（以 nanotons  为单位）：

```html
<template>
  <div>
    <button @click="sendTransaction">Send transaction</button>
  </div>
</template>

<script>
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

export default {
  name: 'Settings',
  setup() {
    const [tonConnectUI, setOptions] = useTonConnectUI();


    const myTransaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
          amount: "20000000",
          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
        {
          address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
          amount: "60000000",
          // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
        }
      ]
    }

    const sendTransaction = () => {
      tonConnectUI.sendTransaction(myTransaction);
    };

    return { sendTransaction };
  }
};
</script>
```

### 通过哈希值了解交易状态

该原理位于支付处理部分（使用 tonweb）。[查看更多](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)

### 添加连接请求参数（ton_proof）

:::tip
了解如何签署和验证信息：[签名和验证](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
:::

使用 `tonConnectUI.setConnectRequestParameters` 函数传递连接请求参数。

该函数需要一个参数：

在等待后台响应时，将状态设置为 'loading'。如果用户此时打开连接钱包模式，他将看到一个加载器。

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const tonConnectUI = useTonConnectUI();

tonConnectUI.setConnectRequestParameters({
    state: 'loading'
});
```

或

将状态设为 `ready` 并定义 `tonProof` 值。传递的参数将应用于连接请求（QR 和通用链接）。

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const tonConnectUI = useTonConnectUI();

tonConnectUI.setConnectRequestParameters({
    state: 'ready',
    value: {
        tonProof: '<your-proof-payload>'
    }
});
```

或

如果已通过 `state：'loading'`（例如，您从后端收到的是错误而不是响应）。创建的连接请求将不带任何附加参数。

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const tonConnectUI = useTonConnectUI();

tonConnectUI.setConnectRequestParameters(null);
```

如果您的 tonProof 有效载荷有一定的生命周期，您可以多次调用 `tonConnectUI.setConnectRequestParameters` （例如，您可以每 10 分钟刷新一次连接请求参数）。

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const tonConnectUI = useTonConnectUI();

// enable ui loader
tonConnectUI.setConnectRequestParameters({ state: 'loading' });

// fetch you tonProofPayload from the backend
const tonProofPayload: string | null = await fetchTonProofPayloadFromBackend();

if (!tonProofPayload) {
    // remove loader, connect request will be without any additional parameters
    tonConnectUI.setConnectRequestParameters(null);
} else {
    // add tonProof to the connect request
    tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: { tonProof: tonProofPayload }
    });
}

```

连接钱包后，您可以在钱包对象中找到 `ton_proof` 结果：

```ts
import { ref, onMounted } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const tonConnectUI = useTonConnectUI();

onMounted(() =>
    tonConnectUI.onStatusChange(wallet => {
        if (wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
            checkProofInYourBackend(wallet.connectItems.tonProof.proof, wallet.account);
        }
}));
```

### 钱包断线

调用以断开钱包连接：

```js
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const [tonConnectUI] = useTonConnectUI();

await tonConnectUI.disconnect();
```

## 故障排除

### 动画不工作

如果您遇到动画无法在您的环境中运行的问题，可能是因为缺乏对 Web Animations API 的支持。要解决这个问题，您可以使用 `web-animations-js` 填充。

#### 使用 npm

要安装 polyfill，请运行以下命令：

```shell
npm install web-animations-js
```

然后，在项目中导入 polyfill：

```typescript
import 'web-animations-js';
```

#### 使用 CDN

或者，您也可以通过 CDN 添加以下脚本标签到 HTML 中，从而包含 polyfill 功能：

```html
<script src="https://www.unpkg.com/web-animations-js@latest/web-animations.min.js"></script>
```

这两种方法都将提供 Web Animations API 的后备实现，并应能解决您所面临的动画问题。

## 实例

- [Demo dApp](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui) - 使用 `@townsquarelabs/ui-vue`的 DApp 示例。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/web.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/web.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 用于 JS 的 TON Connect

本指南将帮助您把 TON Connect 集成到您的 Javascript 应用程序中，用于用户身份验证和交易。

如果您的 DApp 使用 React，请查看 [TON Connect UI React SDK](/v3/guidelines/ton-connect/frameworks/react)。

如果您的 DApp 使用 Vue，请参阅 [TON Connect UI Vue SDK](/v3/guidelines/ton-connect/frameworks/vue)。

## 实现

### 安装

<Tabs groupId="Installation">
  <TabItem value="CDN" label="CDN">
将脚本添加到网站的 HEAD 元素中：
    <br/>
    <br/>

```html
<script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
```

</TabItem>
  <TabItem value="NPM" label="NPM">
    要开始将 TON Connect 集成到您的应用程序中，请安装 @tonconnect/ui 软件包：

```bash npm2yarn
npm i @tonconnect/ui
```

</TabItem>
</Tabs>

### TON 连接启动

安装软件包后，请为您的应用程序创建一个 `manifest.json` 文件。有关如何创建 manifest.json 文件的更多信息，请参阅 [此处](/v3/guidelines/ton-connect/guidelines/creating-manifest)。

添加一个 ID 为 `ton-connect` 的按钮，用于连接到钱包：

```html
<div id="ton-connect"></div>
```

_在此标记_后，在应用程序页面的 `<body>` 部分添加 `tonConnectUI` 脚本：

```html
<script>
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
        buttonRootId: 'ton-connect'
    });
</script>
```

### 连接到钱包

“ Connect” 按钮（添加在 `buttonRootId` 位置）会自动处理点击事件。

但您可以通过编程打开 "connect modal"，例如在点击自定义按钮后：

```html
<script>
    async function connectToWallet() {
        const connectedWallet = await tonConnectUI.connectWallet();
        // Do something with connectedWallet if needed
        console.log(connectedWallet);
    }

    // Call the function
    connectToWallet().catch(error => {
        console.error("Error connecting to wallet:", error);
    });
</script>
```

### 重定向

#### 定制回报策略

要在连接后将用户重定向到特定 URL，可以[自定义返回策略](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy)。

#### Telegram 小程序

要在钱包连接后将用户重定向到 [Telegram 小程序](/v3/guidelines/dapps/tma/overview)，请使用`twaReturnUrl`选项：

```tsx
tonConnectUI.uiOptions = {
      twaReturnUrl: 'https://t.me/YOUR_APP_NAME'
  };
```

[在 SDK 文档中阅读更多内容](https://github.com/ton-connect/sdk/tree/main/packages/ui#use-inside-twa-telegram-web-app)

### 用户界面定制

TonConnect UI 提供的界面应是用户在使用各种应用程序时熟悉和可识别的。不过，应用程序开发人员可以修改该界面，使其与应用程序的界面保持一致。

- [TonConnect用户界面文档](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)

## SDK 文档

- [SDK文档](https://github.com/ton-connect/sdk/blob/main/packages/ui/README.md)
- [最新的API文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

## 使用方法

让我们看看在应用程序中使用 TON Connect UI 的示例。

### 发送信息

下面是使用 TON Connect UI 发送交易的示例：

```js
import TonConnectUI from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({ //connect application
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: '<YOUR_CONNECT_BUTTON_ANCHOR_ID>'
});

const transaction = {
    messages: [
        {
            address: "EQABa48hjKzg09hN_HjxOic7r8T1PleIy1dRd8NvZ3922MP0", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

- 在此获取更多示例：[准备信息](/v3/guidelines/ton-connect/guidelines/preparing-messages)。

### 通过哈希值了解交易状态

该原理位于支付处理部分（使用 tonweb）。[查看更多](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)

### 签名和验证

了解如何使用 TON Connect 签署和验证信息：

- [签名和验证](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
- [GitHub 上的 TON Connect UI 实现](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-connect-request-parameters-ton_proof)

### 钱包断线

调用以断开钱包连接：

```js
await tonConnectUI.disconnect();
```

## 另请参见

- [用户界面定制](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)
- [[YouTube]TON Connect UI React [RU]](https://youtu.be/wIMbkJHv0Fs?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_&t=1747)
- [[YouTube]连接 TON 将用户界面连接到网站 [RU]](https://www.youtube.com/watch?v=HUQ1DPfFxG4&list=PLyDBPwv9EPsAIWi8vgic9kiV3KF_wvIcz&index=4)。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/creating-manifest.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/creating-manifest.md
================================================
# 创建 manifest.json

每个应用都需要有它的 manifest 文件，用以向钱包传递元信息。Manifest 是一个名为 `tonconnect-manifest.json` 的 JSON 文件，遵循以下格式：

```json
{
    "url": "<app-url>",                        // required
    "name": "<app-name>",                      // required
    "iconUrl": "<app-icon-url>",               // required
    "termsOfUseUrl": "<terms-of-use-url>",     // optional
    "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

## 示例

您可以在下面找到一个 manifest 的示例：

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```

## 最佳实践

- 最佳实践是将 manifest 放置在您应用和库的根目录，例如 `https://myapp.com/tonconnect-manifest.json`。这样可以让钱包更好地处理您的应用，并提升与您应用相关的用户体验。
- 确保 `manifest.json` 文件通过其 URL 可以被 GET 访问。

## 字段描述

| 字段                 | 要求 | 描述                                                                                                                                                                          |
| ------------------ | -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`              | 必需 | 应用 URL。将被用作 DApp 标识符。点击钱包中的图标后，将用来打开 DApp。推荐传递不带关闭斜杠的 url，例如 'https://mydapp.com' 而非 'https://mydapp.com/'。 |
| `name`             | 必需 | 应用名称。可以简单，不会被用作标识符。                                                                                                                                                         |
| `iconUrl`          | 必需 | 应用图标的 URL。必须是 PNG、ICO 等格式，不支持 SVG 图标。最好传递指向 180x180px PNG 图标的 url。                                                                                                          |
| `termsOfUseUrl`    | 可选 | 使用条款文档的 url。普通应用为可选，但对于放在 Tonkeeper 推荐应用列表中的应用则为必填。                                                                                                                         |
| `privacyPolicyUrl` | 可选 | 隐私政策文档的 url。普通应用为可选，但对于放在 Tonkeeper 推荐应用列表中的应用则为必填。                                                                                                                         |



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/developers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/developers.md
================================================
# TON Connect SDKs

## SDK 列表

:::info
如果可能，建议您为您的 dApps 使用 [@tonconnect/ui-react](/develop/dapps/ton-connect/developers#ton-connect-ui-react) 工具包。仅当您的产品确实需要时，才切换到 SDK 的更低层级或重新实现协议版本。
:::

本页内容包括 TON Connect 的有用的库列表。

- [TON Connect React](/develop/dapps/ton-connect/developers#ton-connect-react)
- [TON Connect JS SDK](/develop/dapps/ton-connect/developers#ton-connect-js-sdk)
- [TON Connect Python SDK](/develop/dapps/ton-connect/developers#ton-connect-python)
- [TON Connect Dart](/develop/dapps/ton-connect/developers#ton-connect-dart)
- [TON Connect C#](/develop/dapps/ton-connect/developers#ton-connect-c)
- [TON Connect Unity](/develop/dapps/ton-connect/developers#ton-connect-unity)
- [TON Connect Go](/develop/dapps/ton-connect/developers#ton-connect-go)
- [TON Connect Go](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](/develop/dapps/ton-connect/developers#ton-connect-ui-react) - 适用于 React 应用的 TON Connect 用户界面（UI）

TonConnect UI React 是一个 React UI 工具包，用于在 React 应用中通过 TonConnect 协议连接您的应用程序至 TON 钱包。

- 包含 `@tonconnect/ui-react` 的 DApp 示例：[GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
- 部署的 `demo-dapp-with-react-ui` 示例：[GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API 文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)

## TON Connect JS SDK

TON Connect 存储库包含以下主要包：

- [@tonconnect/ui](/develop/dapps/ton-connect/developers#ton-connect-ui) - TON Connect 用户界面（UI）
- [@tonconnect/sdk](/develop/dapps/ton-connect/developers#ton-connect-sdk)  - TON Connect SDK
- [@tonconnect/protocol](/develop/dapps/ton-connect/developers#ton-connect-protocol-models) - TON Connect 协议规范

### TON Connect UI

TonConnect UI 是 TonConnect SDK 的一个 UI 工具包。使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。它允许您使用我们的 UI 元素（如“连接钱包按钮”、“选择钱包对话框”和确认modals）更轻松地将 TonConnect 集成到您的应用中。

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API 文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

TON Connect 用户界面（UI）是一个框架，允许开发者提高应用用户的用户体验（UX）。

TON Connect 可以通过简单的 UI 元素（如“连接钱包按钮”、“选择钱包对话框”和确认模态）轻松地与应用集成。这里有三个主要示例，展示了 TON Connect 如何在应用中提升 UX：

- DApp 浏览器中的应用功能示例：[GitHub](https://ton-connect.github.io/demo-dapp/)
- 上述 DApp 的后端部分示例：[GitHub](https://github.com/ton-connect/demo-dapp-backend)
- 使用 Go 的 Bridge 服务器：[GitHub](https://github.com/ton-connect/bridge)

此工具包将简化用 TON Connect 实现到 TON 区块链为目标平台所构建的应用中。它支持标准的前端框架，以及不使用预定框架的应用。

### TON Connect SDK

这三个框架中最底层的一个是 TON Connect SDK，它帮助开发者将 TON Connect 集成到他们的应用程序中。它主要用于通过 TON Connect 协议将应用程序连接到 TON 钱包。

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### TON Connect 协议模型

该包含协议请求、协议响应、事件模型以及编码和解码功能。它可用于将 TON Connect 集成到用 TypeScript 编写的钱包应用中。为了将 TON Connect 集成到 DApp 中，应该使用 [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk)。

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)

## TON Connect Python

TonConnect UI Vue 是用于 TonConnect SDK 的 Vue UI 工具包。使用它可以在 Vue 应用程序中通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

- 使用 `@townsquarelabs/ui-vue` 的 DApp 示例：[GitHub](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui)
- 已部署的 `demo-dapp-with-vue-ui` 示例：[GitHub](https://townsquarexyz.github.io/demo-dapp-with-vue-ui/)

```bash
npm i @townsquarelabs/ui-vue
```

- [GitHub](https://github.com/TownSquareXYZ/tonconnect-ui-vue)
- [NPM](https://www.npmjs.com/package/@townsquarelabs/ui-vue)

## TON 连接 Python

### ClickoTON-Foundation tonconnect

用于将 TON Connect 连接到 Python 应用的库

使用它可通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
pip3 install pytonconnect
```

- [GitHub](https://github.com/XaBbl4/pytonconnect)

### ClickoTON-Foundation tonconnect

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
git clone https://github.com/ClickoTON-Foundation/tonconnect.git
pip install -e tonconnect
```

[GitHub](https://github.com/ClickoTON-Foundation/tonconnect)

## TON Connect C\\#

TON Connect 2.0 的 C# SDK。相当于 `@tonconnect/sdk` 库。

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
 $ dart pub add darttonconnect
```

- [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)

## TON Connect Go

TON Connect 2.0 的 Go SDK。

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
 $ dotnet add package TonSdk.Connect
```

- [GitHub](https://github.com/cameo-engineering/tonconnect)

## 常见问题和关注点

如果我们的开发者或社区成员在使用 TON Connect 2.0 期间遇到任何额外问题，请联系 [Tonkeeper 开发者](https://t.me/tonkeeperdev) 频道。

如果您遇到任何额外的问题，或者想提出有关如何改进 TON Connect 2.0 的提议，请通过适当的 [GitHub 目录](https://github.com/ton-connect/) 直接联系我们。

```bash
 go get github.com/cameo-engineering/tonconnect
```

- [GitHub](https://github.com/cameo-engineering/tonconnect)

## 常见问题和关注点

如果我们的任何开发人员或社区成员在 TON Connect 2.0 的实施过程中遇到任何其他问题，请联系 [Tonkeeper developer](https://t.me/tonkeeperdev) 频道。

如果您遇到其他问题，或希望就如何改进 TON Connect 2.0 提出建议，请通过相应的 [GitHub 目录](https://github.com/ton-connect/) 直接联系我们。

## TON 连接统一

TON Connect 2.0 的 Unity 资产。使用`continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`。

使用它可将 TonConnect 协议与您的游戏集成。

- [GitHub](https://github.com/continuation-team/unity-ton-connect)
- [文档](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)

## 另请参见

- [建立第一个网络客户端的分步指南](https://helloworld.tonstudio.io/03-client/)
- [[YouTube] TON Smart Contracts | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU\&t=254s\&ab_channel=AlefmanVladimir%5BEN%5D)
- [Ton Connect 入门](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [集成手册](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)
- [[YouTube] TON Dev Study TON Connect Protocol [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/how-ton-connect-works.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/how-ton-connect-works.mdx
================================================
import Button from '@site/src/components/button'
import ThemedImage from '@theme/ThemedImage';

# TON Connect的工作原理

TON Connect是TON中**钱包**和**应用**之间的通信协议。

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/ton-connect/ton-connect_1.svg?raw=true',
        dark: '/img/docs/ton-connect/ton-connect_1-dark.svg?raw=true',
    }}
/>
<br></br>

## 概览

基于TON构建的**应用**提供丰富的功能和高性能，并旨在通过智能合约保护用户资金。由于应用程序使用了区块链等去中心化技术进行构建，它们通常被称为去中心化应用程序（dApps）。

**钱包**提供了批准交易的用户界面，并在个人设备上安全地持有用户的加密密钥。
这种关注点的分离使得用户能够实现快速创新和高水平的安全性：钱包不需要自行构建封闭的生态系统，而应用程序也不需要承担持有最终用户账户的风险。

TON Connect旨在提供钱包和应用之间的无缝用户体验。

## 另请参见

- [TON Connect 企业版](/develop/dapps/ton-connect/business)
- [TON Connect安全](/develop/dapps/ton-connect/security)
- [TON Connect2.0与1.0的对比](/develop/dapps/ton-connect/comparison)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk.md
================================================
# 与 JavaScript SDK 的集成手册

在本教程中，我们将创建一个示例网页应用，支持 TON Connect 2.0 认证。这将允许进行签名验证，以消除在各方之间未建立协议时的身份冒用的可能性。

## 文档链接

1. [@tonconnect/sdk 文档](https://www.npmjs.com/package/@tonconnect/sdk)
2. [钱包应用消息交换协议](https://github.com/ton-connect/docs/blob/main/requests-responses.md)
3. [Tonkeeper 钱包端实现](https://github.com/tonkeeper/wallet/tree/main/src/tonconnect)

## 必要条件

为了使应用和钱包之间的连接流畅，网页应用必须使用可通过钱包应用访问的 manifest。完成此项的必要条件通常是静态文件的主机。例如，假如开发者想利用 GitHub 页面，或使用托管在他们电脑上的 TON Sites 部署他们的网站。这将意味着他们的网页应用站点是公开可访问的。

## 获取钱包支持列表

为了提高 TON 区块链的整体采用率，TON Connect 2.0 需要能够促进大量应用和钱包连接集成。近期，TON Connect 2.0 的持续开发使得连接 Tonkeeper、TonHub、MyTonWallet 和其他钱包与各种 TON 生态系统应用成为可能。我们的使命是最终允许通过 TON Connect 协议在基于 TON 构建的所有钱包类型与应用之间交换数据。目前，这是通过为TON Connect提供加载当前在TON生态系统中运行的可用钱包的广泛列表的能力来实现的。

目前我们的示例网页应用能够实现以下功能：

1. 加载 TON Connect SDK（旨在简化集成的库），
2. 创建一个连接器（当前没有应用 manifest），
3. 加载支持的钱包列表（来自 [GitHub 上的 wallets.json](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json)）。

为了学习目的，让我们来看看以下代码描述的 HTML 页面：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>  <!-- (1) -->
  </head>
  <body>
    <script>
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();  // (2)
        const walletsList = await connector.getWallets();  // (3)
        
        console.log(walletsList);
      }
    </script>
  </body>
</html>
```

如果您在浏览器中加载此页面并查看控制台，可能会得到类似以下内容：

```bash
> Array [ {…}, {…} ]

0: Object { name: "Tonkeeper", imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png", aboutUrl: "https://tonkeeper.com", … }
  aboutUrl: "https://tonkeeper.com"
  bridgeUrl: "https://bridge.tonapi.io/bridge"
  deepLink: undefined
  embedded: false
  imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png"
  injected: false
  jsBridgeKey: "tonkeeper"
  name: "Tonkeeper"
  tondns: "tonkeeper.ton"
  universalLink: "https://app.tonkeeper.com/ton-connect"
```

根据 TON Connect 2.0 规范，钱包应用信息总是使用以下格式：

```js
{
    name: string;
    imageUrl: string;
    tondns?: string;
    aboutUrl: string;
    universalLink?: string;
    deepLink?: string;
    bridgeUrl?: string;
    jsBridgeKey?: string;
    injected?: boolean; // true if this wallet is injected to the webpage
    embedded?: boolean; // true if the DAppis opened inside this wallet's browser
}
```

## 不同钱包应用的按钮显示

按钮可能会根据您的网页应用设计而变化。
当前页面产生以下结果：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>

    // highlight-start
    <style>
      body {
        width: 1000px;
        margin: 0 auto;
        font-family: Roboto, sans-serif;
      }
      .section {
        padding: 20px; margin: 20px;
        border: 2px #AEFF6A solid; border-radius: 8px;
      }
      #tonconnect-buttons>button {
        display: block;
        padding: 8px; margin-bottom: 8px;
        font-size: 18px; font-family: inherit;
      }
      .featured {
        font-weight: 800;
      }
    </style>
    // highlight-end
  </head>
  <body>
    // highlight-start
    <div class="section" id="tonconnect-buttons">
    </div>
    // highlight-end
    
    <script>
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();

        // highlight-start
        let buttonsContainer = $('#tonconnect-buttons');
        
        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          if (!wallet.bridgeUrl && !wallet.injected && !wallet.embedded) {
            // no `bridgeUrl` means this wallet app is injecting JS code
            // no `injected` and no `embedded` -> app is inaccessible on this page
            connectButton.disabled = true;
          }
          
          buttonsContainer.appendChild(connectButton);
        }
	// highlight-end
      };
    </script>
  </body>
</html>
```

请注意以下几点：

1. 如果网页通过钱包应用显示，它会将 `embedded` 选项设置为 `true`。这意味着标记这个登录选项很重要，因为它是最常使用的。
2. 如果一个特定的钱包只使用 JavaScript 构建（它没有 `bridgeUrl`），并且它没有设置 `injected` 属性（或 `embedded`，为了安全），那么它显然是不可访问的，按钮应该被禁用。

## 无应用 manifest 的连接

在没有应用 manifest 的情况下进行连接时，脚本应该如下更改：

```js
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
        
        let buttonsContainer = $('#tonconnect-buttons');

        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          // highlight-start
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }));
            };
          } else {
            // wallet app does not provide any auth method
            connectButton.disabled = true;
          }
	  // highlight-end
          
          buttonsContainer.appendChild(connectButton);
        }
      };
```

现在已经进行了上述操作，正在记录状态变化（以查看 TON Connect 是否工作）。展示用于连接的 QR 代码的modals超出了本手册的范围。为了测试目的，可以使用浏览器扩展或通过任何必要的手段将连接请求链接发送到用户的手机（例如，使用 Telegram）。
注意：我们还没有创建应用 manifest。目前，如果未满足此要求，最佳做法是分析最终结果。

### 使用 Tonkeeper 登录

为了用 Tonkeeper 登录，创建了以下用于认证的链接（下面提供参考）：

```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```

当解码时，`r` 参数产生以下 JSON 格式：

```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

点击手机链接后，Tonkeeper 自动打开然后关闭，忽略请求。此外，在网页应用页面的控制台出现以下错误：
`Error: [TON_CONNECT_SDK_ERROR] Can't get null/tonconnect-manifest.json`。

这意味着应用 manifest 必须可供下载。

## 使用应用清单连接

从现在开始，需要在某处托管用户文件（主要是tonconnect-manifest.json）。在这个例子中，我们将使用另一个Web应用程序的清单。然而，这不推荐用于生产环境，但允许用于测试目的。

以下代码片段：

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
```

必须被这个版本替换：

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect({manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'});
        // highlight-next-line
        window.connector = connector;  // for experimenting in browser console
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
	// highlight-next-line
        connector.restoreConnection();
```

在上方的新版本中，添加了将 `connector` 变量存储在 `window` 中，使其在浏览器控制台中可以访问。此外，添加了 `restoreConnection`，这样用户就不必在每个Web应用程序页面都登录。

### 用Tonkeeper登录

如果我们拒绝钱包的请求，控制台显示的结果将是`Error: [TON_CONNECT_SDK_ERROR] Wallet declined the request`。

因此，如果保存了链接，用户能够接受相同的登录请求。这意味着Web应用程序应该能够将认证拒绝视为非最终状态，以确保其正确工作。

之后，接受登录请求，浏览器控制台立即反映如下：

```bash
22:40:13.887 Connection status:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

以上结果考虑了以下内容：

1. **账户**：包含地址（工作链+哈希）、网络（主网/测试网）以及用于提取公钥的walletStateInit的信息。
2. **设备**：包含请求时的名称和钱包应用程序版本（名称应该与最初请求的相同，但这可以进行验证以确保真实性），以及平台名称和支持功能列表。
3. **提供者**：包含http -- 这允许钱包与Web应用程序之间进行的所有请求与响应通过bridge进行服务。

## 登出并请求TonProof

现在我们已经登录了我们的Mini App，但是...后端如何知道它是正确的一方呢？为了验证这一点，我们必须请求钱包所有权证明。

这只能通过认证来完成，所以我们必须登出。因此，我们在控制台中运行以下代码：

```js
connector.disconnect();
```

当断开连接过程完成时，将显示 `Connection status: null`。

在添加TonProof之前，让我们更改代码以表明当前实现是不安全的：

```js
let connHandler = connector.statusChangeSubscriptions[0];
connHandler({
  device: {
    appName: "Uber Singlesig Cold Wallet App",
    appVersion: "4.0.1",
    features: [],
    maxProtocolVersion: 3,
    platform: "ios"
  },
  account: {
    /* TON Foundation address */
    address: '0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8',
    chain: '-239',
    walletStateInit: 'te6ccsEBAwEAoAAFcSoCATQBAgDe/wAg3SCCAUyXuiGCATOcurGfcbDtRNDTH9MfMdcL/+ME4KTyYIMI1xgg0x/TH9Mf+CMTu/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOjRAaTIyx/LH8v/ye1UAFAAAAAAKamjF3LJ7WtipuLroUqTuQRi56Nnd3vrijj7FbnzOETSLOL/HqR30Q=='
  },
  provider: 'http'
});
```

控制台显示的代码行几乎与最初启动连接时显示的一样。因此，如果后端不按预期正确执行用户认证，需要一个方法来测试它是否工作正确。为了实现这一点，可以在控制台中充当TON Foundation，以便可以测试令牌余额和令牌所有权参数的合法性。自然，提供的代码不会更改连接器中的任何变量，但是用户可以根据自己的意愿使用应用程序，除非该连接器受到闭包的保护。即使是这种情况，使用调试器和编码断点也不难提取它。

现在用户的认证已经得到验证，让我们继续写代码。

## 使用TonProof连接

根据TON Connect的SDK文档，第二个参数指的是`connect()`方法，其中包含将由钱包warp并签名的有效载荷。因此，结果是新的连接代码：

```js
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey},
                                {tonProof: 'doc-example-<BACKEND_AUTH_ID>'});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }, {tonProof: 'doc-example-<BACKEND_AUTH_ID>'}));
            };
```

连接链接：

```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```

展开并简化的`r`参数：

```js
{
  "manifestUrl":
    "https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json",
  "items": [
    {"name": "ton_addr"},
    {"name": "ton_proof", "payload": "doc-example-<BACKEND_AUTH_ID>"}
  ]
}
```

接下来，将url地址链接发送到移动设备并使用Tonkeeper打开。

完成此过程后，接收到以下特定于钱包的信息：

```js
{
  "device": {
    "platform": "android",
    "appName": "Tonkeeper",
    "appVersion": "2.8.0.261",
    "maxProtocolVersion": 2,
    "features": [
      "SendTransaction"
    ]
  },
  "provider": "http",
  "account": {
    "address": "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
    "chain": "-239",
    "walletStateInit": "te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c="
  },
  "connectItems": {
    "tonProof": {
      "name": "ton_proof",
      "proof": {
        "timestamp": 1674392728,
        "domain": {
          "lengthBytes": 28,
          "value": "ratingers.pythonanywhere.com"
        },
        "signature": "trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ==",
        "payload": "doc-example-<BACKEND_AUTH_ID>"
      }
    }
  }
}
```

让我们验证接收到的签名。为了完成这一点，签名验证使用Python，因为它可以轻松地与后端交互。要进行这个过程所需的库是`tonsdk`和`pynacl`。

接下来，需要检索钱包的公钥。为了完成这一任务，不使用`tonapi.io`或类似服务，因为最终结果不能可靠地被信任。取而代之，这是通过解析`walletStateInit`完成的。

确保`address`和`walletStateInit`匹配也至关重要，否则，如果他们在`stateInit`字段中提供自己的钱包，并在`address`字段中提供另一个钱包，则可以用他们的钱包密钥签名有效载荷。

`StateInit`由两种引用类型组成：一个用于代码，一个用于数据。在这个上下文中，目的是检索公钥，因此加载第二个引用（数据引用）。然后跳过8字节（在所有现代钱包合约中，4字节用于`seqno`字段和4字节用于`subwallet_id`），然后加载下一个32字节（256位）——公钥。

```python
import nacl.signing
import pytoniq

import hashlib
import base64

received_state_init = 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c='
received_address = '0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad'

state_init = pytoniq.Cell.one_from_boc(base64.b64decode(received_state_init))

address_hash_part = state_init.hash.hex()
assert received_address.endswith(address_hash_part)

public_key = state_init.refs[1].bits.tobytes()[8:][:32]

# bytearray(b'#:\xd3\x1d\xa6\xb7\x97\x9b\xa0\xdc\x8eLO\xb9Dc\x9e\xf4G\xb6\xac\xadPq\xbf\xb4f\xe8\x8f\xf6\xf6\xfb')

verify_key = nacl.signing.VerifyKey(bytes(public_key))
```

在实现了上述代码后，需要查阅正确的文档来检查使用钱包密钥验证和签名了哪些参数：

> ```
> message = utf8_encode("ton-proof-item-v2/") ++  
>           Address ++  
>           AppDomain ++  
>           Timestamp ++  
>           Payload
>
> signature = Ed25519Sign(
>   privkey,
>   sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message))
> )
> ```

> 其中：
>
> - `Address` 表示钱包地址编码为序列：
>   - `workchain`：32位有符号整数大端序；
>   - `hash`：256位无符号整数大端序；
> - `AppDomain` 是  Length ++ EncodedDomainName
>   - `Length` 使用32位值表示utf-8编码的app域名长度（以字节为单位）
>   - `EncodedDomainName` 是 `Length` 字节的utf-8编码的域名
> - `Timestamp` 表示签名操作的64位 unix epoch 时间
> - `Payload` 表示可变长度的二进制字符串
> - `utf8_encode` 生成一个没有长度前缀的纯字节字符串。

接下来用Python重实现这一部分。上述部分整数的端序没有详细说明，因此需要考虑几个示例。请参阅以下Tonkeeper实现，详细了解相关示例：： [ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42)。

```python
received_timestamp = 1674392728
signature = 'trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ=='

message = (b'ton-proof-item-v2/'
         + 0 .to_bytes(4, 'big') + si.bytes_hash()
         + 28 .to_bytes(4, 'little') + b'ratingers.pythonanywhere.com'
         + received_timestamp.to_bytes(8, 'little')
         + b'doc-example-<BACKEND_AUTH_ID>')
# b'ton-proof-item-v2/\x00\x00\x00\x00\xb2\xa1\xec\xf5T^\x07l\xd3j\xe5\x16\xea~\xbd\xf3*\xea\x00\x8c\xaa+\x84\xaf\x98f\xbe\xcb \x88\x95\xad\x1c\x00\x00\x00ratingers.pythonanywhere.com\x984\xcdc\x00\x00\x00\x00doc-example-<BACKEND_AUTH_ID>'

signed = b'\xFF\xFF' + b'ton-connect' + hashlib.sha256(message).digest()
# b'\xff\xffton-connectK\x90\r\xae\xf6\xb0 \xaa\xa9\xbd\xd1\xaa\x96\x8b\x1fp\xa9e\xff\xdf\x81\x02\x98\xb0)E\t\xf6\xc0\xdc\xfdx'

verify_key.verify(hashlib.sha256(signed).digest(), base64.b64decode(signature))
# b'\x0eT\xd6\xb5\xd5\xe8HvH\x0b\x10\xdc\x8d\xfc\xd3#n\x93\xa8\xe9\xb9\x00\xaaH%\xb5O\xac:\xbd\xcaM'
```

在实现上述参数后，如果有攻击者试图冒充用户并且没有提供有效的签名，将会显示以下错误：`nacl.exceptions.BadSignatureError: Signature was forged or corrupt`。

```bash
nacl.exceptions.BadSignatureError: Signature was forged or corrupt.
```

## 下一步工作

在编写 dApp 时，还应考虑以下几点：

- 在成功完成连接后（无论是恢复连接还是新连接），应显示 "断开连接" 按钮，而不是多个 "连接 "按钮
- 用户断开连接后，"断开连接" 按钮需要重新创建
- 应检查钱包代码，因为
  - 更新的钱包版本可能会将公钥放在不同的位置，从而产生问题
  - 当前用户可以使用其他类型的合约而不是钱包来登录。值得庆幸的是，这将在预期位置包含公钥

祝你好运，祝你编写 dApp 玩得开心！



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/preparing-messages.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/preparing-messages.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 准备消息

在使用TON Connect时，您应该为在各种交易中使用的Payload构造消息体。在此页面上，您可以找到与TON Connect SDK一起使用的payload的最相关示例。

:::info
期望您学习了创建TON Connect连接的基础知识。了解更多请参阅[集成手册](/develop/dapps/ton-connect/integration)。
:::

## TON Connect JS SDK 示例

在深入研究构建消息之前，我们先来介绍一下 cell 的概念，消息体就是由 cell 组成的。

### 什么是 cell ？

 cell 是 TON 区块链中的基本数据结构。它可以存储多达 `1023` 位的数据，并持有多达 `4` 个指向其他 cell 的引用，从而允许您存储更复杂的数据结构。
像 `@ton/core` 和 `@ton-community/assets-sdk`这样的库提供了处理 cell 的有效方法。

您可以在 [此处](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) 了解有关 cell 的更多信息。

### 创建 cell 

要创建 cell ，需要使用 `beginCell()` 函数。当 cell  "打开" 时，您可以使用 `store...()` 函数存储各种数据类型。
完成后，使用 `endCell()` 函数关闭 cell 。

```ts
import { Address, beginCell } from "@ton/ton";

const cell = beginCell()
  .storeUint(99, 64) // Stores uint 99 in 64 bits
  .storeAddress(Address.parse('[SOME_ADDR]')) // Stores an address
  .storeCoins(123) // Stores 123 as coins
  .endCell() // Closes the cell
```

### 解析 cell 

要从 cell 中读取或解析数据，需要调用 `beginParse()` 函数。使用类似的`load...()` 函数，读取数据的顺序与存储数据的顺序相同：

```ts
const slice = cell.beginParse();
const uint = slice.loadUint(64);
const address = slice.loadAddress();
const coins = slice.loadCoins();
```

### 数据量更大

每个 cell 都有 1023 位的限制。如果超过上限，就会发生错误：

```ts
// This will fail due to overflow
const cell = beginCell()
  .storeUint(1, 256)
  .storeUint(2, 256)
  .storeUint(3, 256)
  .storeUint(4, 256) // Exceeds 1023-bit limit (256 + 256 + 256 + 256 = 1024)
  .endCell()
```

使用TON Connect JS SDK执行常规TON转账如下所示：

```ts
const cell = beginCell()
  .storeUint(1, 256)
  .storeUint(2, 256)
  .storeRef(beginCell()
    .storeUint(3, 256)
    .storeUint(4, 256)
    .endCell())
  .endCell()
```

要加载引用（嵌套） cell ，请使用 `loadRef()`：

```ts
const slice = cell.beginParse();
const uint1 = slice.loadUint(256);
const uint2 = slice.loadUint(256);
const innerSlice = slice.loadRef().beginParse(); // Load and parse nested cell
const uint3 = innerSlice.loadUint(256);
const uint4 = innerSlice.loadUint(256);
```

### 可选引用和值

 cell 可以存储可选值（可能为空）。这些值使用 `storeMaybe...()` 函数存储：

```ts
const cell = beginCell()
  .storeMaybeInt(null, 64) // Optionally stores an int
  .storeMaybeInt(1, 64)
  .storeMaybeRef(null) // Optionally stores a reference
  .storeMaybeRef(beginCell()
    .storeCoins(123)
    .endCell());
```

您可以使用相应的 loadMaybe...() 函数解析可选值。返回值可以为空，因此不要忘记检查它们是否为空！

```ts
const slice = cell.beginParse();
const maybeInt = slice.loadMaybeUint(64);
const maybeInt1 = slice.loadMaybeUint(64);
const maybeRef = slice.loadMaybeRef();
const maybeRef1 = slice.loadMaybeRef();
if (maybeRef1) {
  const coins = maybeRef1.beginParse().loadCoins();
}
```

### 使用 assets sdk 实现更简单的序列化和反序列化

手动处理 cell 可能很繁琐，因此 `@ton-community/assets-sdk` 提供了序列化和反序列化信息的便捷方法。

对于特定的自定义交易，必须定义特定的载荷。

<Tabs groupId="Serialization/Deserialization">

<TabItem value="@ton-community/assets-sdk" label="@ton-community/assets-sdk">

```ts
import {Address, beginCell} from "@ton/core";
import {storeJettonTransferMessage, loadJettonTransferMessage} from "@ton-community/assets-sdk";

// serialization
const cell = beginCell()
  .store(storeJettonTransferMessage({
    queryId: 42n,
    amount: 100n,
    destination: Address.parse('[DESTINATION]'),
    responseDestination: Address.parse('[RESPONSE_DESTINATION]'),
    customPayload: null,
    forwardAmount: 1n,
    forwardPayload: null,
  }))
  .endCell()

// deserialization
const transferMessage = loadJettonTransferMessage(cell.beginParse());
```

</TabItem>

<TabItem value="@ton/ton" label="@ton/ton">

```ts
import {Address, beginCell} from "@ton/core";

// serialization
const cell = beginCell()
  .storeUint(260734629, 32)
  .storeUint(42, 64)
  .storeCoins(100)
  .storeAddress(Address.parse('[DESTINATION]'))
  .storeAddress(Address.parse('[RESPONSE_DESTINATION]'))
  .storeMaybeRef(null)
  .storeCoins(1)
  .storeMaybeRef(null)
  .endCell();

// deserialization
const slice = cell.beginParse();
const op = slice.loadUint(32);
const queryId = slice.loadUint(64);
const amount = slice.loadCoins();
const destination = slice.loadAddress();
const responseDestination = slice.loadAddress();
const customPayload = slice.loadMaybeRef();
const fwdAmount = slice.loadCoins();
const fwdPayload = slice.loadMaybeRef();

const transferMessage = { op, queryId, amount, destination, responseDestination, customPayload, fwdAmount, fwdPayload };
```

</TabItem>
</Tabs>

## TON Connect JS SDK 示例

### 交易模板

无论开发者解决的是哪个层级的任务，通常都需要使用来自 `@tonconnect/sdk` 或 `@tonconnect/ui` 的连接器实体。\
以下是基于 `@tonconnect/sdk` 和 `@tonconnect/ui` 创建的示例：

<Tabs groupId="TON Connect template">

<TabItem value="tonconnect-react" label="@tonconnect/ui-react">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';

const transaction = {
    //transaction body
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>
<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({ //connect application
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: '<YOUR_CONNECT_BUTTON_ANCHOR_ID>'
});

const transaction = {
    //transaction body
}

const result = await tonConnectUI.sendTransaction(transaction)

```

</TabItem>
<TabItem value="tonconnect-js" label="@tonconnect/sdk">

```js
import TonConnect from '@tonconnect/sdk';
const connector = new TonConnect();

await connector.sendTransaction({
    //transaction body
})

```

</TabItem>

</Tabs>

### 常规 TON 转账

TON Connect SDK提供了发送消息的封装器，使准备两个钱包之间的Toncoin的常规转账作为默认交易无需载荷变得容易。

使用TON Connect JS SDK执行常规TON转账如下所示：

<Tabs groupId="Regular Transfer">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
const [tonConnectUI] = useTonConnectUI();

const transaction = {
    messages: [
        {
            address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]

}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({ //connect application
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: '<YOUR_CONNECT_BUTTON_ANCHOR_ID>'
});

const transaction = {
    messages: [
        {
            address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
import TonConnect from '@tonconnect/sdk';
const connector = new TonConnect();

await connector.sendTransaction({
    messages: [
        {
            address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]
})

```

</TabItem>
</Tabs>

:::tip
了解有关 [TON 智能合约地址](/v3/documentation/smart-contracts/addresses) 的更多信息。
:::

对于特定的自定义交易，必须定义特定的载荷。

### 添加评论的转账

最简单的示例涉及添加一个带有注释的负载。更多细节请参见[此页面](/v3/documentation/smart-contracts/message-management/internal-messages#simple-message-with-comment)。在交易之前，需要通过[@ton/ton](https://github.com/ton-org/ton) JavaScript 库准备一个 `body` [cell](/v3/documentation/data-formats/tlb/cell-boc)。

```js
import { beginCell } from '@ton/ton'

const body = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
```

通过以下方式创建交易体：

<Tabs groupId="Transfer With a Comment">

<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: destination,
            amount: toNano("0.05").toString(),
            payload: body.toBoc().toString("base64") // payload with comment in body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: destination,
            amount: toNano("0.05").toString(),
            payload: body.toBoc().toString("base64") // payload with comment in body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
import TonConnect from '@tonconnect/sdk';
import { toNano } from '@ton/ton'

const connector = new TonConnect();

await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: destination,
      amount: toNano("0.05").toString(),
      payload: body.toBoc().toString("base64") // payload with comment in body
    }
  ]
})
```

</TabItem>
</Tabs>

### Jetton 转账

`WALLET_DST` - 地址 - 初始 NFT 持有者地址，用于接收超额资金
将 `NFTitem` 转移给新所有者 `NEW_OWNER_WALLET`。

:::info
您可以在开箱即用的方法中使用 `assets-sdk` 库（甚至可以使用 `ton-connect`)
:::

<Tabs groupId="Jetton Transfer">
<TabItem value="@ton/ton" label="@ton/ton">

```js
    import { beginCell, toNano, Address } from '@ton/ton'
    // transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
    // response_destination:MsgAddress custom_payload:(Maybe ^Cell)
    // forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
    // = InternalMsgBody;

    const body = beginCell()
        .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code
        .storeUint(0, 64)                         // query_id:uint64
        .storeCoins(toNano("0.001"))              // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
        .storeAddress(Address.parse(Wallet_DST))  // destination:MsgAddress
        .storeAddress(Address.parse(Wallet_SRC))  // response_destination:MsgAddress
        .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)
        .storeCoins(toNano("0.05"))                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
        .storeUint(0,1)                           // forward_payload:(Either Cell ^Cell)
        .endCell();
```

然后，将带有此 body 的交易发送到发送者的 jettonWalletContract 执行：

<Tabs groupId="Jetton Transfer">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract, // sender jetton wallet
            amount: toNano("0.05").toString(), // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with jetton transfer body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract,  // sender jetton wallet
            amount: toNano("0.05").toString(),         // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with jetton transfer body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
import TonConnect from '@tonconnect/sdk';
import { toNano } from '@ton/ton'

const connector = new TonConnect();
//...
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: jettonWalletContract,            // sender jetton wallet
      amount: toNano("0.05").toString(),                   // for commission fees, excess will be returned
      payload: body.toBoc().toString("base64")  // payload with jetton transfer body
    }
  ]
})
```

</TabItem>
</Tabs>

- `validUntil` - 消息有效的 UNIX 时间
- `jettonWalletAddress` - 地址，基于 JettonMaser 和 Wallet 合约定义的 JettonWallet 地址
- `balance` - 整数，用于gas费用的 Toncoin 金额，以 nanotons 计。
- `body` - 用于 jettonContract 的载荷

<details>
    <summary>Jetton 钱包状态初始化和地址准备示例</summary>

```js
import { Address, TonClient, beginCell, StateInit, storeStateInit } from '@ton/ton'

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'put your api key'
    })

    const jettonWalletAddress = Address.parse('Sender_Jetton_Wallet');
    let jettonWalletDataResult = await client.runMethod(jettonWalletAddress, 'get_wallet_data');
    jettonWalletDataResult.stack.readNumber();
    const ownerAddress = jettonWalletDataResult.stack.readAddress();
    const jettonMasterAddress = jettonWalletDataResult.stack.readAddress();
    const jettonCode = jettonWalletDataResult.stack.readCell();
    const jettonData = beginCell()
        .storeCoins(0)
        .storeAddress(ownerAddress)
        .storeAddress(jettonMasterAddress)
        .storeRef(jettonCode)
        .endCell();

    const stateInit: StateInit = {
        code: jettonCode,
        data: jettonData
    }

    const stateInitCell = beginCell()
        .store(storeStateInit(stateInit))
        .endCell();

    console.log(new Address(0, stateInitCell.hash()));
}
```

</details>
</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
注意：对于浏览器，您需要为 `Buffer` 设置一个 polyfill。
:::

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const jetton = sdk.openJettonWallet(Address.parse("JETTON_ADDRESS"));
const RECEIVER_ADDRESS = Address.parse("RECIEVER_ADDRESS");

jetton.send(sender, RECEIVER_ADDRESS, toNano(10));
```

或者，您也可以使用 Jetton Contract 的内置方法：

```ts
const provider = tonConnectUi;

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

const jettonMaster = client.open(
  JettonMinter.createFromAddress(
    Address.parse("[JETTON_WALLET]"),
    new DefaultContentResolver()
  )
);

const jettonWalletAddress = await jettonMaster.getWalletAddress(
  sender.address!
);
const jettonContent = await jettonMaster.getContent();
const jettonDecimals = jettonContent.decimals ?? 9;

const jetton = client.open(JettonWallet.createFromAddress(jettonWalletAddress));

await jetton.send(
  sender,
  Address.parse("[SENDER_WALLET]"),
  BigInt(1 * 10 ** jettonDecimals)
);

```

</TabItem>
</Tabs>

### Jetton 销毁

<Tabs groupId="Jetton Transfer with Comment">
<TabItem value="@ton/ton" label="@ton/ton">

Jetton 转账（[TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)）的 `messageBody` 带有注释，我们应在常规转账的 `body` 之外将注释序列化，并将其打包到 `forwardPayload` 中。请注意，不同代币的小数位数可能不同：例如，USDT 使用 6 个小数位 (1 USDT = 1 _ 10\*\*9)，而 TON 使用 9 个小数位 (1 TON = 1 _ 10\*\*9)。

```js
    import { beginCell, toNano, Address } from '@ton/ton'
    // transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
    // response_destination:MsgAddress custom_payload:(Maybe ^Cell)
    // forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
    // = InternalMsgBody;

    const destinationAddress = Address.parse('put destination wallet address');

    const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail('Hello, TON!')
        .endCell();

    const body = beginCell()
        .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer
        .storeUint(0, 64) // query id
        .storeCoins(toNano("5")) // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
        .storeAddress(destinationAddress) // TON wallet destination address
        .storeAddress(destinationAddress) // response excess destination
        .storeBit(0) // no custom payload
        .storeCoins(toNano("0.02")) // forward amount (if >0, will send notification message)
        .storeBit(1) // we store forwardPayload as a reference
        .storeRef(forwardPayload)
        .endCell();

```

消息放入以下请求中：

<Tabs groupId="Jetton Transfer">
  <TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
    import { useTonConnectUI } from '@tonconnect/ui-react';
	import { toNano } from '@ton/ton'


    const jettonWalletContract = Address.parse('put your jetton wallet address');

    const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
  {
    address: jettonWalletContract, // sender jetton wallet
    amount: toNano("0.05").toString(), // for commission fees, excess will be returned
    payload: body.toBoc().toString("base64") // payload with jetton transfer and comment body
  }
    ]
  }

    export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
    <div>
    <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
    Send transaction
  </button>
</div>
);
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
  import TonConnectUI from '@tonconnect/ui'
  import { toNano } from '@ton/ton'

  const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
{
  address: jettonWalletContract,  // sender jetton wallet
  amount: toNano("0.05").toString(),         // for commission fees, excess will be returned
  payload: body.toBoc().toString("base64") // payload with jetton transfer and comment body
}
  ]
}

  const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
  import TonConnect from '@tonconnect/sdk';
  import { toNano } from '@ton/ton'

  const connector = new TonConnect();
  //...
  await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
{
  address: jettonWalletContract,            // sender jetton wallet
  amount: toNano("0.05").toString(),                   // for commission fees, excess will be returned
  payload: body.toBoc().toString("base64")  // payload with jetton transfer and comment body
}
  ]
})
```

</TabItem>
</Tabs>

- `jettonWalletAddress` - Jetton 钱包合约地址，基于 JettonMaser 和 Wallet 合约定义
- `amount` - 整数，用于gas费用的 Toncoin 金额，以 nanotons 计。
- `body` - 带有 `burn#595f07bc` 操作码的 Jetton 钱包载荷
- `body` - jettonContract 的有效载荷

<details>
  <summary>Jetton 钱包状态初始化和地址准备示例</summary>

```js
  import { Address, TonClient, beginCell, StateInit, storeStateInit } from '@ton/ton'

  async function main() {
  const client = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: 'put your api key'
})

  const jettonWalletAddress = Address.parse('Sender_Jetton_Wallet');
  let jettonWalletDataResult = await client.runMethod(jettonWalletAddress, 'get_wallet_data');
  jettonWalletDataResult.stack.readNumber();
  const ownerAddress = jettonWalletDataResult.stack.readAddress();
  const jettonMasterAddress = jettonWalletDataResult.stack.readAddress();
  const jettonCode = jettonWalletDataResult.stack.readCell();
  const jettonData = beginCell()
  .storeCoins(0)
  .storeAddress(ownerAddress)
  .storeAddress(jettonMasterAddress)
  .storeRef(jettonCode)
  .endCell();

  const stateInit: StateInit = {
  code: jettonCode,
  data: jettonData
}

  const stateInitCell = beginCell()
  .store(storeStateInit(stateInit))
  .endCell();

  console.log(new Address(0, stateInitCell.hash()));
}
```

</details>
</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
阅读示例 [源码](https://github.com/yungwine/ton-connect-examples/blob/master/main.py)。
:::

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const jetton = sdk.openJettonWallet(Address.parse("JETTON_ADDRESS"));

const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail('Hello, TON!')
        .endCell();

jetton.send(sender, RECEIVER_ADDRESS, toNano(10), { notify: { payload: forwardPayload } });
```

</TabItem>
</Tabs>

### 附带评论的转账

<Tabs groupId="Jetton Burn">
<TabItem value="@ton/ton" label="@ton/ton">

Jetton Burn 的 `body` 以 ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)) 标准为基础。请注意，不同代币的小数位数可能不同：例如，USDT 使用 6 个小数位 (1 USDT = 1 _ 10\*\*9)，而 TON 使用 9 个小数位 (1 TON = 1 _ 10\*\*9)。

```js
    import { beginCell, Address } from '@ton/ton'
// burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
//               response_destination:MsgAddress custom_payload:(Maybe ^Cell)
//               = InternalMsgBody;

    const body = beginCell()
        .storeUint(0x595f07bc, 32)                // jetton burn op code
        .storeUint(0, 64)                         // query_id:uint64
        .storeCoins(toNano("0.001"))              // amount:(VarUInteger 16) - Jetton amount in decimal (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
        .storeAddress(Address.parse(Wallet_SRC))  // response_destination:MsgAddress - owner's wallet
        .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell) - w/o payload typically
        .endCell();
```

信息内容如下

<Tabs groupId="Jetton Burn">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract, // owner's jetton wallet
            amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a jetton burn body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract,  // owner's jetton wallet
            amount: toNano("0.05").toString(),         // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a jetton burn body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: jettonWalletContract, // owner's jetton wallet
      amount: toNano("0.05").toString(), // for commission fees, excess will be returned
      payload: body.toBoc().toString("base64") // payload with a jetton burn body
    }
  ]
})
```

</TabItem>
</Tabs>

- `jettonWalletAddress` - 基于 JettonMaser 和钱包合约定义的 Jetton 钱包合约地址
- `amount` - 整数，用于支付 gas 的 Toncoin 数量，单位为 nanotons  。
- `body` - 带有 "burn#595f07bc "操作代码的 jetton 钱包有效载荷

</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
注意：对于浏览器，您需要为 `Buffer` 设置一个 polyfill。
:::

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const jetton = sdk.openJettonWallet(Address.parse("JETTON_ADDRESS"));

jetton.sendBurn(sender, toNano(10));
```

或者，您也可以使用 Jetton Contract 的内置方法：

```ts
const provider = tonConnectUi;

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

const jettonMaster = client.open(
  JettonMinter.createFromAddress(
    Address.parse("[JETTON_WALLET]"),
    new DefaultContentResolver()
  )
);

const jettonWalletAddress = await jettonMaster.getWalletAddress(
  sender.address!
);
const jettonContent = await jettonMaster.getContent();
const jettonDecimals = jettonContent.decimals ?? 9;

const jetton = client.open(JettonWallet.createFromAddress(jettonWalletAddress));

await jetton.sendBurn(
  sender,
  BigInt(1 * 10 ** jettonDecimals)
);

```

</TabItem>
</Tabs>

### NFT 销售 (GetGems)

<Tabs groupId="NFT Transfer">
<TabItem value="@ton/ton" label="@ton/ton">
`正文`一般应按以下方式编写：

```js
import { beginCell, toNano } from '@ton/ton'

//  transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell)
//   forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody;

    const body = beginCell()
        .storeUint(0x5fcc3d14, 32)               // NFT transfer op code 0x5fcc3d14
        .storeUint(0, 64)                        // query_id:uint64
        .storeAddress(Address.parse(NEW_OWNER_WALLET)) // new_owner:MsgAddress
        .storeAddress(Address.parse(Wallet_DST))       // response_destination:MsgAddress
        .storeUint(0, 1)                         // custom_payload:(Maybe ^Cell)
        .storeCoins(1)                           // forward_amount:(VarUInteger 16) (1 nanoTon = toNano("0.000000001"))
        .storeUint(0,1)                          // forward_payload:(Either Cell ^Cell)
        .endCell();
```

`WALLET_DST` - 地址 - 接收多余
的初始 NFT 所有者的地址 将 `NFTitem` 转移给新的所有者 `NEW_OWNER_WALLET`。

<Tabs groupId="NFT Transfer">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract, // NFT Item address, which will be transferred
            amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a NFT transfer body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: NFTitem,  // NFT Item address, which will be transferred
            amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a NFT transfer body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: NFTitem, // NFT Item address, which will be transferred
      amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
      payload: body.toBoc().toString("base64") // payload with a NFT transfer body
    }
  ]
})
```

</TabItem>
</Tabs>

- `NFTitem` - 地址 - NFT 项目智能合约的地址，我们希望将其转移给新的所有者 `NEW_OWNER_WALLET`。
- `balance` - 整数，用于支付 gas 费用的 Toncoin 数量（单位： nanotons  ）。
- `body` - NFT 合约的有效载荷

</TabItem>

<TabItem value="assets/sdk" label="assets/sdk">

:::tip
注意：对于浏览器，您需要为 `Buffer` 设置一个 polyfill。
:::

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const nft = sdk.openNftItem(Address.parse("NFT_ADDRESS"));
const RECEIVER_ADDRESS = Address.parse("RECIEVER_ADDRESS");

nft.send(sender, RECEIVER_ADDRESS);
```

或者，您也可以使用内置方法的 NFT 合约：

```ts
const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});
const provider = tonConnectUi;
const nftItem = client.open(
  NftItem.createFromAddress(Address.parse("[NFT_WALLET]"))
);

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);
await nftItem.send(sender, Address.parse("[SENDER_WALLET]"));

// TIP: NFTs can include royalties, allowing creators to earn a percentage from each sale.
// Here is an example of how to get it.
const royalty = await nftItem.getRoyaltyParams();
const royaltyPercent =
  Number(royalty.numerator) / Number(royalty.denominator);
```

</TabItem>
</Tabs>

### NFT 特卖会 (GetGems)

以下是根据 [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) 合约在 GetGems 市场上准备出售信息和交易的示例。

购买 [nft-fixprice-sale-v3r2](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r2.fc) 销售合约的 NFT 的过程可以通过常规转账进行，无需负荷，唯一重要的是准确的 TON 数量，按如下计算：
`buyAmount = Nftprice TON + 1.0 TON`。

```js
    const transferNftBody = beginCell()
        .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
        .storeUint(0, 64) // query_id
        .storeAddress(Address.parse(destinationAddress)) // new_owner - GetGems sale contracts deployer, should never change for this operation
        .storeAddress(Address.parse(walletAddress)) // response_destination for excesses
        .storeBit(0) // we do not have custom_payload
        .storeCoins(toNano("0.2")) // forward_amount
        .storeBit(0) // we store forward_payload is this cell
        .storeUint(0x0fe0ede, 31) // not 32, because previous 0 will be read as do_sale opcode in deployer
        .storeRef(stateInitCell)
        .storeRef(saleBody)
        .endCell();
```

由于消息需要很多步骤，整个算法非常庞大，可以在这里找到：

<details>  
    <summary>显示创建 NFT 销售消息正文的完整算法</summary>

```js
import { Address, beginCell, StateInit, storeStateInit, toNano, Cell } from '@ton/ton'

async function main() {
    // func:0.4.4 src:op-codes.fc, imports/stdlib.fc, nft-fixprice-sale-v3r3.fc
    // If GetGems updates its sale smart contract, you will need to obtain the new smart contract from https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/nft-fixprice-sale-v3/NftFixpriceSaleV3.source.ts.
    const NftFixPriceSaleV3R3CodeBoc = 'te6ccgECDwEAA5MAART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgL30A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppj+mfmBg4KYVjgGAASpiFaY+F7xDhgEoYBWmfxwjFsxsLcxsrZBZjgsk5mW8oBfEV4ADJL4dwEuuk4QEWQIEV3RXgAJFZ2Ngp5OOC2HGBFWAA+WjKFkEINjYQQF1AYHAdFmCEAX14QBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkCH6RFtwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhtQRSH6RFtwgBDIywVQA88WAfoCy2rJcfsAECOSNDTiWoMAGQwMWyy1DDQ0wchgCCw8tGVIsMAjhSBAlj4I1NBobwE+CMCoLkTsPLRlpEy4gHUMAH7AATwU8fHBbCOXRNfAzI3Nzc3BPoA+gD6ADBTIaEhocEB8tGYBdD6QPoA+kD6ADAwyDICzxZY+gIBzxZQBPoCyXAgEEgQNxBFEDQIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVOCz4wIwMTcowAPjAijAAOMCCMACCAkKCwCGNTs7U3THBZJfC+BRc8cF8uH0ghAFE42RGLry4fX6QDAQSBA3VTIIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVADiODmCEAX14QAYvvLhyVNGxwVRUscFFbHy4cpwIIIQX8w9FCGAEMjLBSjPFiH6Astqyx8Vyz8nzxYnzxYUygAj+gITygDJgwb7AHFwVBcAXjMQNBAjCMjLABfLH1AFzxZQA88WAc8WAfoCzMsfyz/J7VQAGDY3EDhHZRRDMHDwBQAgmFVEECQQI/AF4F8KhA/y8ADsIfpEW3CAEMjLBVADzxYB+gLLaslx+wBwIIIQX8w9FMjLH1Iwyz8kzxZQBM8WE8oAggnJw4D6AhLKAMlxgBjIywUnzxZw+gLLaswl+kRbyYMG+wBxVWD4IwEIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVACHvOFnaiaGmAaY/9IH0gfSB9AGppj+mfmC3ofSB9AH0gfQAYKaFQkNDggPlozJP9Ii2TfSItkf0iLcEIIySsKAVgAKrAQAgb7l72omhpgGmP/SB9IH0gfQBqaY/pn5gBaH0gfQB9IH0AGCmxUJDQ4ID5aM0U/SItlH0iLZH9Ii2F4ACFiBqqiU'
    const NftFixPriceSaleV3R3CodeCell = Cell.fromBoc(Buffer.from(NftFixPriceSaleV3R3CodeBoc, 'base64'))[0]

    const marketplaceAddress = Address.parse('EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS'); // GetGems Address
    const marketplaceFeeAddress = Address.parse('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS'); // GetGems Address for Fees
    const destinationAddress = Address.parse("EQAIFunALREOeQ99syMbO6sSzM_Fa1RsPD5TBoS0qVeKQ-AR"); // GetGems sale contracts deployer

    const walletAddress = Address.parse('EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162');
    const royaltyAddress = Address.parse('EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162');
    const nftAddress = Address.parse('EQCUWoe7hLlklVxH8gduCf45vPNocsjRP4wbX42UJ0Ja0S2f');
    const price = toNano("5"); // 5 TON

    const feesData = beginCell()
        .storeAddress(marketplaceFeeAddress)
        // 5% - GetGems fee
        .storeCoins(price / BigInt(100) * BigInt(5))
        .storeAddress(royaltyAddress)
        // 5% - Royalty, can be changed
        .storeCoins(price / BigInt(100) * BigInt(5))
        .endCell();

    const saleData = beginCell()
        .storeBit(0) // is_complete
        .storeUint(Math.round(Date.now() / 1000), 32) // created_at
        .storeAddress(marketplaceAddress) // marketplace_address
        .storeAddress(nftAddress) // nft_address
        .storeAddress(walletAddress) // previous_owner_address
        .storeCoins(price) // full price in nanotons
        .storeRef(feesData) // fees_cell
        .storeUint(0, 32) // sold_at
        .storeUint(0, 64) // query_id
        .endCell();

    const stateInit: StateInit = {
        code: NftFixPriceSaleV3R3CodeCell,
        data: saleData
    };
    const stateInitCell = beginCell()
        .store(storeStateInit(stateInit))
        .endCell();

    // not needed, just for example
    const saleContractAddress = new Address(0, stateInitCell.hash());

    const saleBody = beginCell()
        .storeUint(1, 32) // just accept coins on deploy
        .storeUint(0, 64)
        .endCell();

    const transferNftBody = beginCell()
        .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
        .storeUint(0, 64) // query_id
        .storeAddress(destinationAddress) // new_owner
        .storeAddress(walletAddress) // response_destination for excesses
        .storeBit(0) // we do not have custom_payload
        .storeCoins(toNano("0.2")) // forward_amount
        .storeBit(0) // we store forward_payload is this cell
        .storeUint(0x0fe0ede, 31) // not 32, because we stored 0 bit before | do_sale opcode for deployer
        .storeRef(stateInitCell)
        .storeRef(saleBody)
        .endCell();
}
```

</details>

准备好的 `transferNftBody` 应发送到 NFT 项目合约，至少要有 `1.08`  TON ，这是成功处理的预期。超出部分将退回发件人钱包。

<Tabs groupId="NFT Sale Fix Price">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: NFTitem, //address of the NFT Item contract, that should be placed on market
            amount: toNano("0.3").toString(), // amount that will require on gas fees, excess will be return
            payload: transferNftBody.toBoc().toString("base64") // payload with the transferNftBody message
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: NFTitem, //address of NFT Item contract, that should be placed on market
            amount: toNano("0.3").toString(), // amount that will require on gas fees, excess will be return
            payload: transferNftBody.toBoc().toString("base64") // payload with the transferNftBody message
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: NFTitem, //address of NFT Item contract, that should be placed on market
      amount: toNano("0.3").toString(), // amount that will require on gas fees, excess will be return
      payload: transferNftBody.toBoc().toString("base64") // payload with the transferNftBody message
    }
  ]
})
```

</TabItem>
</Tabs>

### 购买 NFT (GetGems)

<Tabs groupId="NFT Buy tabs">
<TabItem value="@ton/ton" label="@ton/ton">

[nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) 销售合约的买入 NFT 过程可以通过常规转账进行，无需付费，唯一重要的是准确的 TON 数，计算公式如下：
`buyAmount = Nftprice TON + 1.0 TON`。

<Tabs groupId="NFT Buy">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: nftSaleContract,  // NFT Sale contract, that is current desired NFT Item
            amount: toNano(buyAmount).toString(), // NFT Price + exactly 1 TON, excess will be returned
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: nftSaleContract,  // NFT Sale contract, that is current desired NFT Item
            amount: toNano(buyAmount).toString(), // NFT Price + exactly 1 TON, excess will be returned
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>
<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
validUntil: Math.floor(Date.now() / 1000) + 360,
messages: [
    {
        address: nftSaleContract,  // NFT Sale contract, that is current desired NFT Item
        amount: toNano(buyAmount).toString(), // NFT Price + exactly 1 TON, excess will be returned
    }
]
})
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
注意：对于浏览器，您需要为 `Buffer` 设置一个 polyfill。
:::

```js
const nft = sdk.openNftSale(Address.parse("NFT_ADDRESS"));
nft.sendBuy(sdk.sender!, { queryId: BigInt(1) })
```

</TabItem>
</Tabs>

## TON Connect Python SDK

Python 示例使用 [PyTonConnect](https://github.com/XaBbl4/pytonconnect) 和 [pytoniq](https://github.com/yungwine/pytoniq)。

```python
    from pytoniq_core import Address
    from pytonconnect import TonConnect
```

:::tip
阅读示例 [资料来源](https://github.com/yungwine/ton-connect-examples/blob/master/main.py)。
:::

### NFT 转账

```python
connector = TonConnect(
    manifest_url='https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json')
is_connected = await connector.restore_connection()

transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        {
            'address' :'0:0000000000000000000000000000000000000000000000000000000000000000', # destination address
            'amount' : 1000000000,  # amount should be specified in nanocoins, 1 TON
        }
    ]
}
```

### 带评论的转让

最终的交易体：

```python
    def get_comment_message(destination_address: str, amount: int, comment: str) -> dict:

        data = {
            'address': destination_address,
            'amount': str(amount),
            'payload': urlsafe_b64encode(
                begin_cell()
                .store_uint(0, 32)  # op code for comment message
                .store_string(comment)  # store comment
                .end_cell()  # end cell
                .to_boc()  # convert it to boc
            )
            .decode()  # encode it to urlsafe base64
        }

        return data
```

带评论的转账最终交易正文：

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_comment_message(
            destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            amount=int(0.01 * 10**9),  # amount should be specified in nanocoins
            comment='hello world!'
        )
    ]
}
```

:::tip
了解有关 [TON 智能合约地址](/v3/documentation/smart-contracts/addresses) 的更多信息。
:::

### Jetton Transfer

建立 jetton 转帐交易的函数示例。请注意，不同代币的小数位数可能不同：例如，USDT 使用 6 个小数位 (1 USDT = 1 _ 10\*\*9)，而 TON 使用 9 个小数位 (1 TON = 1 _ 10\*\*9)。

```python
from pytoniq_core import begin_cell
from base64 import urlsafe_b64encode

def get_jetton_transfer_message(jetton_wallet_address: str, recipient_address: str, transfer_fee: int, jettons_amount: int, response_address: str = None) -> dict:
    data = {
        'address': jetton_wallet_address,
        'amount': str(transfer_fee),
        'payload': urlsafe_b64encode(
        begin_cell()
        .store_uint(0xf8a7ea5, 32)  # op code for jetton transfer message
        .store_uint(0, 64)  # query_id
        .store_coins(jettons_amount) # Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Exapmple: 1 USDT = 1 * 10**6 and 1 TON = 1 * 10**9
        .store_address(recipient_address)  # destination address
        .store_address(response_address or recipient_address)  # address send excess to
        .store_uint(0, 1)  # custom payload
        .store_coins(1)  # forward amount
        .store_uint(0, 1)  # forward payload
        .end_cell()  # end cell
        .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }

    return data
```

最终交易体：

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_jetton_transfer_message(
        jetton_wallet_address='EQCXsVvdxTVmSIvYv4tTQoQ-0Yq9mERGTKfbsIhedbN5vTVV',
        recipient_address='0:0000000000000000000000000000000000000000000000000000000000000000',
        transfer_fee=int(0.07 * 10**9),
        jettons_amount=int(0.01 * 10**9),  # replace 9 for jetton decimal. For example for USDT it should be (amount * 10**6)
        response_address=wallet_address
        ),
    ]
}

```

### NFT 购买 (GetGems)

建立 jetton 刻录交易的函数示例。请注意，不同代币的小数位数可能不同：例如，USDT 使用 6 个小数位 (1 USDT = 1 _ 10\*\*9)，而 TON 使用 9 个小数位 (1 TON = 1 _ 10\*\*9)。

```python
from pytoniq_core import begin_cell
from base64 import urlsafe_b64encode

def get_jetton_burn_message(jetton_wallet_address: str, transfer_fee: int, jettons_amount: int, response_address: str = None) -> dict:
    data = {
        'address': jetton_wallet_address,
        'amount': str(transfer_fee),
        'payload': urlsafe_b64encode(
            begin_cell()
            .store_uint(0x595f07bc, 32)  # op code for jetton burn message
            .store_uint(0, 64)  # query_id
            .store_coins(jettons_amount) # Jetton amount in decimal (decimals = 6 - USDT, 9 - default)
            .store_address(response_address)  # address send excess to
            .end_cell()  # end cell
            .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }
    return data
```

最终交易正文：

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_jetton_burn_message(
            jetton_wallet_address='EQCXsVvdxTVmSIvYv4tTQoQ-0Yq9mERGTKfbsIhedbN5vTVV',
            transfer_fee=int(0.07 * 10 ** 9),
            jettons_amount=int(0.01 * 10 ** 9),  # replace 9 for jetton decimal. For example for jUSDT it should be (amount * 10**6)
            response_address=wallet_address
        ),
    ]
}
```

### 参阅

NFT 转账交易功能示例：

```python
from pytoniq_core import begin_cell
from base64 import urlsafe_b64encode


def get_nft_transfer_message(nft_address: str, recipient_address: str, transfer_fee: int, response_address: str = None) -> dict:
    data = {
        'address': nft_address,
        'amount': str(transfer_fee),
        'payload': urlsafe_b64encode(
            begin_cell()
            .store_uint(0x5fcc3d14, 32)  # op code for nft transfer message
            .store_uint(0, 64)  # query_id
            .store_address(recipient_address)  # new owner
            .store_address(response_address or recipient_address)  # address send excess to
            .store_uint(0, 1)  # custom payload
            .store_coins(1)  # forward amount (0.000000001 * 10 ** 9) = 1 nanoTon
            .store_uint(0, 1)  # forward payload
            .end_cell()  # end cell
            .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }
    return data

```

最终交易正文：

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_nft_transfer_message(
            nft_address='EQDrA-3zsJXTfGo_Vdzg8d07Da4vSdHZllc6W9qvoNoMstF-',
            recipient_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            transfer_fee=int(0.07 * 10**9),
            response_address=wallet_address
        ),
    ]
}
```

### NFT 特卖会 (GetGems)

以下是根据合约 [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) 在 GetGems 市场上准备出售信息和交易的示例。

要在 GetGems 销售合约上放置 NFT，我们应准备特殊的信息体 `transferNftBody`，将 NFT 转移到特殊的 NFT 销售合约上。

<details>
<summary>创建 NFT Sale Body 的示例</summary>

```python
import time
from base64 import urlsafe_b64encode

from pytoniq_core.boc import Cell, begin_cell, Address
from pytoniq_core.tlb import StateInit


def get_sale_body(wallet_address: str, royalty_address: str, nft_address: str, price: int, amount: int):
    # func:0.4.4 src:op-codes.fc, imports/stdlib.fc, nft-fixprice-sale-v3r3.fc
    # If GetGems updates its sale smart contract, you will need to obtain the new smart contract from https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/nft-fixprice-sale-v3/NftFixpriceSaleV3.source.ts.
    nft_sale_code_cell = Cell.one_from_boc('te6ccgECDwEAA5MAART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgL30A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppj+mfmBg4KYVjgGAASpiFaY+F7xDhgEoYBWmfxwjFsxsLcxsrZBZjgsk5mW8oBfEV4ADJL4dwEuuk4QEWQIEV3RXgAJFZ2Ngp5OOC2HGBFWAA+WjKFkEINjYQQF1AYHAdFmCEAX14QBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkCH6RFtwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhtQRSH6RFtwgBDIywVQA88WAfoCy2rJcfsAECOSNDTiWoMAGQwMWyy1DDQ0wchgCCw8tGVIsMAjhSBAlj4I1NBobwE+CMCoLkTsPLRlpEy4gHUMAH7AATwU8fHBbCOXRNfAzI3Nzc3BPoA+gD6ADBTIaEhocEB8tGYBdD6QPoA+kD6ADAwyDICzxZY+gIBzxZQBPoCyXAgEEgQNxBFEDQIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVOCz4wIwMTcowAPjAijAAOMCCMACCAkKCwCGNTs7U3THBZJfC+BRc8cF8uH0ghAFE42RGLry4fX6QDAQSBA3VTIIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVADiODmCEAX14QAYvvLhyVNGxwVRUscFFbHy4cpwIIIQX8w9FCGAEMjLBSjPFiH6Astqyx8Vyz8nzxYnzxYUygAj+gITygDJgwb7AHFwVBcAXjMQNBAjCMjLABfLH1AFzxZQA88WAc8WAfoCzMsfyz/J7VQAGDY3EDhHZRRDMHDwBQAgmFVEECQQI/AF4F8KhA/y8ADsIfpEW3CAEMjLBVADzxYB+gLLaslx+wBwIIIQX8w9FMjLH1Iwyz8kzxZQBM8WE8oAggnJw4D6AhLKAMlxgBjIywUnzxZw+gLLaswl+kRbyYMG+wBxVWD4IwEIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVACHvOFnaiaGmAaY/9IH0gfSB9AGppj+mfmC3ofSB9AH0gfQAYKaFQkNDggPlozJP9Ii2TfSItkf0iLcEIIySsKAVgAKrAQAgb7l72omhpgGmP/SB9IH0gfQBqaY/pn5gBaH0gfQB9IH0AGCmxUJDQ4ID5aM0U/SItlH0iLZH9Ii2F4ACFiBqqiU')

    # fees cell

    marketplace_address = Address('EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS')
    marketplace_fee_address = Address('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS')
    destination_address = Address('EQAIFunALREOeQ99syMbO6sSzM_Fa1RsPD5TBoS0qVeKQ-AR')

    wallet_address = Address(wallet_address)
    royalty_address = Address(royalty_address)
    nft_address = Address(nft_address)

    marketplace_fee = int(price * 5 / 100)  # 5%
    royalty_fee = int(price * 5 / 100)  # 5%

    fees_data_cell = (begin_cell()
                      .store_address(marketplace_fee_address)
                      .store_coins(marketplace_fee)
                      .store_address(royalty_address)
                      .store_coins(royalty_fee)
                      .end_cell())


    sale_data_cell = (begin_cell()
                      .store_bit_int(0) # is_complete
                      .store_uint(int(time.time()), 32) # created_at
                      .store_address(marketplace_address)
                      .store_address(nft_address)
                      .store_address(wallet_address)
                      .store_coins(price)
                      .store_ref(fees_data_cell)
                      .store_uint(0, 32) # sold_at
                      .store_uint(0, 64) # query_id
                      .end_cell())

    # not needed, just for example
    state_init_cell = StateInit(code=nft_sale_code_cell, data=sale_data_cell).serialize()

    sale_body = (begin_cell()
                 .store_uint(1, 32) # just accept coins on deploy
                 .store_uint(0, 64)
                 .end_cell())

    transfer_nft_body = (begin_cell()
                         .store_uint(0x5fcc3d14, 32) # Opcode for NFT transfer
                         .store_uint(0, 64) # query_id
                         .store_address(destination_address)
                         .store_address(wallet_address)
                         .store_bit_int(0) # we do not have custom_payload
                         .store_coins(int(0.2 * 10**9)) # forward_amount
                         .store_bit_int(0) # we store forward_payload is this cell
                         .store_uint(0x0fe0ede, 31) # not 32, because we stored 0 bit before | do_sale opcode for deployer
                         .store_ref(state_init_cell)
                         .store_ref(sale_body)
                         .end_cell())

    data = {
        'address': nft_address.to_str(),
        'amount': str(amount),
        'payload': urlsafe_b64encode(transfer_nft_body.to_boc()).decode()
    }

    return data
```

</details>

最终交易正文：

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_sale_body(
            nft_address='EQDrA-3zsJXTfGo_Vdzg8d07Da4vSdHZllc6W9qvoNoMstF-',
            wallet_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            royalty_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            price=int(5 * 10**9),
            amount=int(0.3 * 10**9)
        ),
    ]
}
```

### 购买 NFT (GetGems)

[nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) 销售合约的 NFT 购买流程可以通过常规转账进行，无需支付载荷，唯一重要的是准确的 TON 数，计算公式如下：
`buyAmount = Nftprice TON + 1.0 TON`。

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        {
            'address': nft_address,
            'amount': buyAmount,
        }
    ]
}
```

## TON Connect Go SDK

Go 示例使用 [tonconnect](https://github.com/cameo-engineering/tonconnect) 和 [tonutils-go](https://github.com/xssnick/tonutils-go)。

```go
import "github.com/cameo-engineering/tonconnect"
import "github.com/xssnick/tonutils-go/address"
```

:::tip
请阅读 [tonconnect](https://github.com/cameo-engineering/tonconnect/blob/master/examples/basic/main.go) 和 [tonutils-go](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#how-to-use) 示例。
:::

在这里，您可以找到如何创建 tonconnect 会话和发送构建了消息的事务。

```go
s, _ := tonconnect.NewSession()
// create ton links
// ...
// create new message msg and transaction
boc, _ := s.SendTransaction(ctx, *tx)
```

在其他示例中，将只创建消息和事务。

### 常规 TON 转账

建立普通 TON 转账信息的功能示例：

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
)

func Transfer(dest string, amount uint64) (*tonconnect.Message, error) {
	msg, err := tonconnect.NewMessage(
		dest,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
	)
	return msg, err
}
```

最终交易主体：

```go
msg, err := Transfer("0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbLZ", uint64(math.Pow(10, 9)))
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### 带评论的转账

建立带评论信息的转账功能示例：

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func TransferWithComment(dest string, amount uint64, comment string) (*tonconnect.Message, error) {
	payload, _ := cell.BeginCell().
		MustStoreUInt(0, 32).
		MustStoreStringSnake(comment).
		EndCell().MarshalJSON()
	msg, err := tonconnect.NewMessage(
		dest,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))
	return msg, err
}
```

最终交易主体：

```go
msg, err := TransferWithComment("0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbLZ", uint64(math.Pow(10, 9)), "new comment")
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### Jetton 转账

jetton 转帐信息函数示例。请注意，不同代币的小数位数可能不同：例如，USDT 使用 6 个小数位 (1 USDT = 1 _ 10\*\*6)，而 TON 使用 9 个小数位(1 TON = 1 _ 10\*\*9)。

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func JettonTransferMessage(jetton_wallet_address string, amount uint64,
	jettons_amount uint64, recipient_address, response_address string,
	fwd_amount uint64, fwd_payload *cell.Cell) (*tonconnect.Message, error) {
	payload, _ := cell.BeginCell().
		MustStoreUInt(0xf8a7ea5, 32). // op code for jetton transfer message (op::transfer)
		MustStoreUInt(0, 64).         // query_id
		MustStoreCoins(jettons_amount). // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Exapmple: 1 USDT = 1 * 10**6 and 1 TON = 1 * 10**9
		MustStoreAddr(address.MustParseAddr(recipient_address)). // address send excess to
		MustStoreAddr(address.MustParseAddr(response_address)).
		MustStoreUInt(0, 1).        // custom payload
		MustStoreCoins(fwd_amount). // set 0 if don't want transfer notification
		MustStoreMaybeRef(fwd_payload).
		EndCell().MarshalJSON()

	msg, err := tonconnect.NewMessage(
		jetton_wallet_address,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

最终交易主体：

```go
msg, err := JettonTransferMessage("kQA8Q7m_pSNPr6FcqRYxllpAZv-0ieXy_KYER2iP195hBXiX",
                                    uint64(math.Pow(10, 9)),
                                    uint64(10),
                                    "0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbL2",
                                    "EQBuObr2M7glm08w6cBGjIuuCbmvBFGwuVs6qb3AQpac9XpX",
                                    uint64(0), nil)
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

###  jetton 销毁

Jetton 销毁消息的函数示例。请注意，不同代币的小数位数可能会有所不同：例如，USDT 使用 6 位小数（1 USDT = 1 _ 10\*\*9），而 TON 使用 9 位小数（1 TON = 1 _ 10\*\*9）。

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func JettonBurnMessage(jetton_wallet_address string, amount uint64,
	jettons_amount uint64, response_address string) (*tonconnect.Message, error) {

	payload, _ := cell.BeginCell().
		MustStoreUInt(0xf8a7ea5, 32).                           // op code for jetton burn message (op::burn)
		MustStoreUInt(0, 64).                                   // query_id
		MustStoreCoins(jettons_amount).                         // Jetton amount in decimal (decimals = 6 - USDT, 9 - default)
		MustStoreAddr(address.MustParseAddr(response_address)). // address send excess to
		EndCell().MarshalJSON()

	msg, err := tonconnect.NewMessage(
		jetton_wallet_address,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

最终交易主体：

```go
msg, err := JettonBurnMessage("kQA8Q7m_pSNPr6FcqRYxllpAZv-0ieXy_KYER2iP195hBXiX",
                                uint64(math.Pow(10, 9)),
                                uint64(10),
                                "EQBuObr2M7glm08w6cBGjIuuCbmvBFGwuVs6qb3AQpac9XpX")
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### NFT 转移

NFT 转移消息的函数示例：

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func NftTransferMessage(nft_address string, amount uint64, recipient_address, response_address string,
	fwd_amount uint64, fwd_payload *cell.Cell) (*tonconnect.Message, error) {

	payload, _ := cell.BeginCell().
		MustStoreUInt(0x5fcc3d14, 32).                           // op code for nft transfer message (op::transfer())
		MustStoreUInt(0, 64).                                    // query_id
		MustStoreAddr(address.MustParseAddr(recipient_address)). // new owner
		MustStoreAddr(address.MustParseAddr(response_address)).  // address send excess to
		MustStoreUInt(0, 1).                                     // custom payload
		MustStoreCoins(fwd_amount).                              // set 0 if don't want transfer notification
		MustStoreMaybeRef(fwd_payload).
		EndCell().MarshalJSON()

	msg, err := tonconnect.NewMessage(
		nft_address,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

最终交易主体：

```go
msg, err := NftTransferMessage("EQDrA-3zsJXTfGo_Vdzg8d07Da4vSdHZllc6W9qvoNoMstF-",
                                uint64(math.Pow(10, 9)),
                                "0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbL2",
                                "0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbL2",
                                uint64(0), nil)
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### NFT 特卖会 (GetGems)

以下是根据 [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) 合约在 GetGems 市场上准备出售信息和交易的示例。

要在 GetGems 销售合约上放置 NFT，我们应准备特殊的信息体 `transferNftBody`，将 NFT 转移到特殊的 NFT 销售合约上。

```go
transferNftBody := cell.BeginCell().
    MustStoreUInt(0x5fcc3d14, 32).        // opcode for NFT transfer
    MustStoreUInt(0, 64).                 // query_id
    MustStoreAddress(destinationAddress). // new_owner - GetGems sale contracts deployer, should never change for this operation
    MustStoreAddress(walletAddress).      // response_destination for excesses
    MustStoreUInt(0, 1).                  // we do not have custom_payload
    MustStoreCoins(0.2*math.Pow(10, 9)).  // forward_amount
    MustStoreUInt(0, 1).                  // we store forward_payload is this cell
    MustStoreUInt(0x0fe0ede, 31).         // not 32, because previous 0 will be read as do_sale opcode in deployer (op::do_sale)
    MustStoreRef(stateInitCell).
    MustStoreRef(saleBody).
    EndCell()
```

由于消息需要很多步骤，整个算法非常庞大，可以在这里找到：

<details>  
    <summary>显示创建 NFT 销售消息正文的完整算法</summary>

```go
import (
	"fmt"
	"math"
	"time"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func NftSaleMessage(wallet, royalty, nft string, amount, price uint64) (*tonconnect.Message, error) {
    // func:0.4.4 src:op-codes.fc, imports/stdlib.fc, nft-fixprice-sale-v3r3.fc
    // If GetGems updates its sale smart contract, you will need to obtain the new smart contract from https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/nft-fixprice-sale-v3/NftFixpriceSaleV3.source.ts.
	fixPriceV3R3Code := new(cell.Cell)
	fixPriceV3R3Code.UnmarshalJSON([]byte("te6ccgECDwEAA5MAART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgL30A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppj+mfmBg4KYVjgGAASpiFaY+F7xDhgEoYBWmfxwjFsxsLcxsrZBZjgsk5mW8oBfEV4ADJL4dwEuuk4QEWQIEV3RXgAJFZ2Ngp5OOC2HGBFWAA+WjKFkEINjYQQF1AYHAdFmCEAX14QBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkCH6RFtwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhtQRSH6RFtwgBDIywVQA88WAfoCy2rJcfsAECOSNDTiWoMAGQwMWyy1DDQ0wchgCCw8tGVIsMAjhSBAlj4I1NBobwE+CMCoLkTsPLRlpEy4gHUMAH7AATwU8fHBbCOXRNfAzI3Nzc3BPoA+gD6ADBTIaEhocEB8tGYBdD6QPoA+kD6ADAwyDICzxZY+gIBzxZQBPoCyXAgEEgQNxBFEDQIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVOCz4wIwMTcowAPjAijAAOMCCMACCAkKCwCGNTs7U3THBZJfC+BRc8cF8uH0ghAFE42RGLry4fX6QDAQSBA3VTIIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVADiODmCEAX14QAYvvLhyVNGxwVRUscFFbHy4cpwIIIQX8w9FCGAEMjLBSjPFiH6Astqyx8Vyz8nzxYnzxYUygAj+gITygDJgwb7AHFwVBcAXjMQNBAjCMjLABfLH1AFzxZQA88WAc8WAfoCzMsfyz/J7VQAGDY3EDhHZRRDMHDwBQAgmFVEECQQI/AF4F8KhA/y8ADsIfpEW3CAEMjLBVADzxYB+gLLaslx+wBwIIIQX8w9FMjLH1Iwyz8kzxZQBM8WE8oAggnJw4D6AhLKAMlxgBjIywUnzxZw+gLLaswl+kRbyYMG+wBxVWD4IwEIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVACHvOFnaiaGmAaY/9IH0gfSB9AGppj+mfmC3ofSB9AH0gfQAYKaFQkNDggPlozJP9Ii2TfSItkf0iLcEIIySsKAVgAKrAQAgb7l72omhpgGmP/SB9IH0gfQBqaY/pn5gBaH0gfQB9IH0AGCmxUJDQ4ID5aM0U/SItlH0iLZH9Ii2F4ACFiBqqiU"))

	marketplaceAddress := address.MustParseAddr("EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS")    // GetGems Address
	marketplaceFeeAddress := address.MustParseAddr("EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS") // GetGems Address for Fees
	destinationAddress := address.MustParseAddr("EQAIFunALREOeQ99syMbO6sSzM_Fa1RsPD5TBoS0qVeKQ-AR")    // GetGems sale contracts deployer

	walletAddress := address.MustParseAddr(wallet)
	royaltyAddress := address.MustParseAddr(royalty)
	nftAddress := address.MustParseAddr(nft)

	feesData := cell.BeginCell().
		MustStoreAddr(marketplaceFeeAddress).
		// 5% - GetGems fee
		MustStoreCoins(price * 100 * 5).
		MustStoreAddr(royaltyAddress).
		// 5% - Royalty, can be changed
		MustStoreCoins(price / 100 * 5).
		EndCell()

	saleData := cell.BeginCell().
		MustStoreUInt(0, 1).                                // is_complete
		MustStoreUInt(uint64(time.Now().UTC().Unix()), 32). // created_at
		MustStoreAddr(marketplaceAddress).                  // marketplace_address
		MustStoreAddr(nftAddress).                          // nft_address
		MustStoreAddr(walletAddress).                       // previous_owner_address
		MustStoreCoins(price).                              // full price in nanotons
		MustStoreRef(feesData).                             // fees_cell
		MustStoreUInt(0, 32).                               // sold_at
        MustStoreUInt(0, 64).                               // query_id
		EndCell()

	stateInit := &tlb.StateInit{
		Data: saleData,
		Code: fixPriceV3R3Code,
	}

	stateInitCell, err := tlb.ToCell(stateInit)
	if err != nil {
		return nil, err
	}

	// not needed, just for example
	// saleContractAddress := address.NewAddress(0, 0, stateInitCell.Hash())

	saleBody := cell.BeginCell().
		MustStoreUInt(1, 32). // just accept coins on deploy
		MustStoreUInt(0, 64).
		EndCell()

	transferNftBody, err := cell.BeginCell().
		MustStoreUInt(0x5fcc3d14, 32).             // opcode for NFT transfer
		MustStoreUInt(0, 64).                      // query_id
		MustStoreAddr(destinationAddress).         // new_owner - GetGems sale contracts deployer, should never change for this operation
		MustStoreAddr(walletAddress).              // response_destination for excesses
		MustStoreUInt(0, 1).                       // we do not have custom_payload
		MustStoreCoins(uint64(0.2*math.Pow(10, 9))). // forward_amount
		MustStoreUInt(0, 1).                       // we store forward_payload is this cell
		MustStoreUInt(0x0fe0ede, 31).              // not 32, because previous 0 will be read as do_sale opcode in deployer (op::do_sale)
		MustStoreRef(stateInitCell).
		MustStoreRef(saleBody).
		EndCell().MarshalJSON()

	if err != nil {
		return nil, err
	}

	msg, err := tonconnect.NewMessage(
		nftAddress.String(),
		fmt.Sprintf("%d", amount),
		tonconnect.WithPayload(transferNftBody))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

最终交易正文：

```go
msg, err := NftSaleMessage("EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162",
                            "EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162",
                            "EQCUWoe7hLlklVxH8gduCf45vPNocsjRP4wbX42UJ0Ja0S2f",
                            uint64(0.3*math.Pow(10, 9)), uint64(5*math.Pow(10, 9)))
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

</details>

### 购买 NFT (GetGems)

[nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) 销售合约的买入 NFT 过程可以通过常规转账进行，无需付费，唯一重要的是准确的 TON 数，计算公式如下：
`buyAmount = Nftprice TON + 1.0 TON`。

```go
msg, err := tonconnect.NewMessage(nftAddress, buyAmount)
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

## 作者

- 由 [@aSpite](https://t.me/aspite) 提供的 JavaScript 示例
- 由 [@yunwine](https://t.me/yungwine) 提供的 Python 示例
- 由 [@gleb498](https://t.me/gleb498) 提供的 Go 示例

## 另请参见

- [TON Connect SDKs](/v3/guidelines/ton-connect/guidelines/developers)
- [TON Connect - 发送信息](/v3/guidelines/ton-connect/guidelines/sending-messages)
- [智能合约开发 - 发送消息（低级）](/v3/documentation/smart-contracts/message-management/sending-messages)
- [TON jetton 处理](/v3/guidelines/dapps/asset-processing/jettons)
- [TON 上的 NFT 处理](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/sending-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/sending-messages.md
================================================
# 发送消息

TON Connect 2.0 不仅仅提供了在 dApp 中认证用户的强大选项：它还可以通过已连接的钱包发送外部消息！

您将了解到：

- 如何从 DApp 发送消息到区块链
- 如何在一次交易中发送多条消息
- 如何使用 TON Connect 部署合约

## 演示页面

我们将使用 JavaScript 的低级 [TON Connect SDK](https://github.com/ton-connect/sdk/tree/main/packages/sdk) 。我们将在钱包已连接的页面上的浏览器控制台上做实验。以下是示例页面：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js"></script>
    <script src="https://unpkg.com/tonweb@0.0.41/dist/tonweb.js"></script>
  </head>
  <body>
    <script>
      window.onload = async () => {
        window.connector = new TonConnectSDK.TonConnect({
          manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'
        });
        connector.restoreConnection();
      }
    </script>
  </body>
</html>
```

随意将其复制粘贴到您的浏览器控制台并运行。

## 发送多条消息

### 1. 了解任务

我们将在一次交易中发送两条独立的消息：一条发送到您自己的地址，携带 0.2 TON，另一条发送到其他钱包地址，携带 0.1 TON。

顺便说一下，一次交易中发送的消息有限制：

- 标准 ([v3](/participate/wallets/contracts#wallet-v3)/[v4](/participate/wallets/contracts#wallet-v4)) 钱包：4 条传出消息；
- 高负载钱包：255 条传出消息（接近区块链限制）。

### 2. 发送消息

运行以下代码：

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: connector.wallet.account.address,
      amount: "200000000"
    },
    {
      address: "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
      amount: "100000000"
    }
  ]
}));
```

您会注意到这个命令没有在控制台打印任何东西，像返回无内容的函数一样，`null` 或 `undefined`。这意味着 `connector.sendTransaction` 不会立即退出。

打开您的钱包应用，您会看到原因。有一个请求，显示您要发送的内容以及coin将会去向哪里。请接受它。

### 3. 获取结果

函数将退出，并且区块链的输出将被打印：

```json
{
  boc: "te6cckEBAwEA4QAC44gBZUPZ6qi8Dtmm1cot1P175lXUARlUVwlfMM19lkERK1oCUB3RqDxAFnPpeo191X/jiimn9Bwnq3zwcU/MMjHRNN5sC5tyymBV3SJ1rjyyscAjrDDFAIV/iE+WBySEPP9wCU1NGLsfcvVgAAACSAAYHAECAGhCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWoAmJaAAAAAAAAAAAAAAAAAAAAGZCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWnMS0AAAAAAAAAAAAAAAAAAADkk4U"
}
```

BOC 是 [Bag of Cells](/learn/overviews/cells)，这是 TON 中存储数据的方式。现在我们可以解码它。

在您选择的工具中解码这个 BOC，您将得到以下cell树：

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D9641112B5A02501DD1A83C401673E97A8D7DD57FE38A29A7F41C27AB7CF0714FCC3231D134DE6C0B9B72CA6055DD2275AE3CB2B1C023AC30C500857F884F960724843CFF70094D4D18BB1F72F5600000024800181C_}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD6A00989680000000000000000000000000000}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD69CC4B40000000000000000000000000000}
```

返回发送交易的 BOC 的目的是跟踪它。

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D964111...
  $10       ext_in_msg_info
  $00       src:MsgAddressExt (null address)
  "EQ..."a  dest:MsgAddressInt (your wallet)
  0         import_fee:Grams
  $0        (no state_init)
  $0        (body starts in this cell)
  ...
```

返回发送交易的 BOC 的目的是跟踪它。

## 发送复杂的交易

### cell 的序列化

构建消息后，您可以将其序列化为 BOC。

- **payload** (string base64, 可选): 以 Base64 编码的单cell BoC。
  - 我们将使用它来存储转账上的文本评论
- **stateInit** (string base64, 可选): 以 Base64 编码的单cell BoC。
  - 我们将用它来部署智能合约

创建信息后，可以将其序列化到 BOC 中。

```js
TonWeb.utils.bytesToBase64(await payloadCell.toBoc())
```

### 有评论的转让

您可以使用 [toncenter/tonweb](https://github.com/toncenter/tonweb) JS SDK 或您喜欢的工具将 cell 序列化为 BOC。

传输的文本注释编码为操作码 0（32 个零位）+ UTF-8 注释字节。下面是一个如何将其转换为 cell 包的示例。

```js
let a = new TonWeb.boc.Cell();
a.bits.writeUint(0, 32);
a.bits.writeString("TON Connect 2 tutorial!");
let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

console.log(payload);
// te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw
```

### 智能合约部署

现在，是时候发送我们的交易了！

```js
let code = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes('te6cckEBAgEARAABFP8A9KQT9LzyyAsBAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AN4uuM8='));
let data = new TonWeb.boc.Cell();
data.bits.writeUint(Math.floor(new Date()), 64);

let state_init = new TonWeb.boc.Cell();
state_init.bits.writeUint(6, 5);
state_init.refs.push(code);
state_init.refs.push(data);

let state_init_boc = TonWeb.utils.bytesToBase64(await state_init.toBoc());
console.log(state_init_boc);
//  te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd

let doge_address = '0:' + TonWeb.utils.bytesToHex(await state_init.hash());
console.log(doge_address);
//  0:1c7c35ed634e8fa796e02bbbe8a2605df0e2ab59d7ccb24ca42b1d5205c735ca
```

是时候发送我们的交易了！

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: "0:1c7c35ed634e8fa796e02bbbe8a2605df0e2ab59d7ccb24ca42b1d5205c735ca",
      amount: "69000000",
      payload: "te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw",
      stateInit: "te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd"
    }
  ]
}));
```

:::info
更多示例请参阅传输 NFT 和 Jettons 的 [准备信息](/v3/guidelines/ton-connect/guidelines/preparing-messages) 页面。
:::

处理请求拒绝相当简单，但当您正在开发某个项目时，最好提前知道会发生什么。

## 如果用户拒绝交易请求会发生什么情况？

处理请求被拒绝的情况很容易，但在开发项目时，最好事先知道会发生什么。

当用户点击钱包应用程序弹出窗口中的 "取消" 时，会出现一个异常：`Error: [TON_CONNECT_SDK_ERROR] Wallet declined the request`。该错误可视为最终错误（与取消连接不同）-- 如果该错误被触发，那么在下一个请求发送之前，请求的交易肯定不会发生。

## 另请参见

- [准备信息](/v3/guidelines/ton-connect/guidelines/preparing-messages)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# 签名与验证

本页描述了一种让后台确保用户真正拥有所声明地址的方法。
请注意，并非所有 DApp 都需要用户验证。

请注意，并非所有DApps都需要 ton_proof 验证。
这对于后端的授权是必要的，以确保用户确实拥有声明的地址，因此可以推断出用户有权访问其在后端的数据。

## 它是如何工作的？

- 用户启动登录程序。
- 后台生成一个 ton_proof 实体并发送给前台。
- 前端使用 ton_proof 登录钱包，并接收已签名的 ton_proof 返回。
- 前台将已签名的 ton_proof 发送到后台进行验证。

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/ton-connect/ton_proof_scheme.svg?raw=true',
        dark: '/img/docs/ton-connect/ton_proof_scheme-dark.svg?raw=true',
    }}
/>
<br></br>

## ton_proof 的结构

我们将使用在连接器中实现的 TonProof 实体。

```js
type TonProofItemReply = TonProofItemReplySuccess | TonProofItemReplyError;

type TonProofItemReplySuccess = {
  name: "ton_proof";
  proof: {
    timestamp: string; // 64-bit unix epoch time of the signing operation (seconds)
    domain: {
      lengthBytes: number; // AppDomain Length
      value: string;  // app domain name (as url part, without encoding)
    };
    signature: string; // base64-encoded signature
    payload: string; // payload from the request
  }
}

```

## 在服务器端检查 ton_proof

1. 读取用户的 `TonProofItemReply` 信息。
2. 验证接收的域是否与应用程序的域一致。
3. 检查 `TonProofItemReply.payload` 是否为原始服务器所允许，是否仍处于活动状态。
4. 检查 `timestamp` 是否为当前实际值。
5. 根据 [信息方案](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users#concept-explanation) 组装信息。
6. 从应用程序接口 (a) 或通过后端逻辑 (b) 获取 `public_key`

- 从用户处检索 `TonProofItemReply`。
  - 使用 [TON API](https://docs.tonconsole.com/tonapi#:~:text=/v2/-,tonconnect,-/stateinit) 方法 `POST /v2/tonconnect/stateinit` 从 `walletStateInit` 获取 `{public_key, address}`。
  - 检查从 `walletStateInit` 提取的 `address` 是否与用户声明的钱包 `address` 一致。
- 验证接收到的域是否对应于应用程序的域。
  - 通过钱包合约 [get method](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc#L174) 获取钱包的 `public_key`。
  - 如果合约未激活，或者缺少旧版本钱包（v1-v3）中的 get_method，则无法通过这种方式获取密钥。相反，您需要解析前端提供的 walletStateInit。确保 TonAddressItemReply.walletStateInit.hash() 等于 TonAddressItemReply.address.hash()，表明是 BoC 哈希值。

7. 6a:

## React 示例

1. 将 token 提供者添加到应用的根目录：

```tsx
function App() {
    const [token, setToken] = useState<string | null>(null);

  return (
      <BackendTokenContext.Provider value={{token, setToken}}>
            { /* Your app */ }
      </BackendTokenContext.Provider>
  )
}
```

2. 通过后台集成在前端实施身份验证：

<details>
<summary>示例</summary>

```tsx
import {useContext, useEffect, useRef} from "react";
import {BackendTokenContext} from "./BackendTokenContext";
import {useIsConnectionRestored, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {backendAuth} from "./backend-auth";

const localStorageKey = 'my-dapp-auth-token';
const payloadTTLMS = 1000 * 60 * 20;

export function useBackendAuth() {
    const { setToken } = useContext(BackendTokenContext);
    const isConnectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const interval = useRef<ReturnType<typeof setInterval> | undefined>();

    useEffect(() => {
        if (!isConnectionRestored || !setToken) {
            return;
        }

        clearInterval(interval.current);

        if (!wallet) {
            localStorage.removeItem(localStorageKey);
            setToken(null);

            const refreshPayload = async () => {
                tonConnectUI.setConnectRequestParameters({ state: 'loading' });

                const value = await backendAuth.generatePayload();
                if (!value) {
                    tonConnectUI.setConnectRequestParameters(null);
                } else {
                    tonConnectUI.setConnectRequestParameters({state: 'ready', value});
                }
            }

            refreshPayload();
            setInterval(refreshPayload, payloadTTLMS);
            return;
        }

        const token = localStorage.getItem(localStorageKey);
        if (token) {
            setToken(token);
            return;
        }

        if (wallet.connectItems?.tonProof && !('error' in wallet.connectItems.tonProof)) {
            backendAuth.checkProof(wallet.connectItems.tonProof.proof, wallet.account).then(result => {
                if (result) {
                    setToken(result);
                    localStorage.setItem(localStorageKey, result);
                } else {
                    alert('Please try another wallet');
                    tonConnectUI.disconnect();
                }
            })
        } else {
            alert('Please try another wallet');
            tonConnectUI.disconnect();
        }

    }, [wallet, isConnectionRestored, setToken])
}
```

</details>

## 后台示例

<details>
<summary>检查证明是否有效（Next.js）</summary>

```tsx
'use server'
import {Address, Cell, contractAddress, loadStateInit, TonClient4} from '@ton/ton'


export async function isValid(proof, account) {
    const payload = {
					address: account.address,
					public_key: account.publicKey,
					proof: {
						...proof,
						state_init: account.walletStateInit
					}
	  }
    const stateInit = loadStateInit(Cell.fromBase64(payload.proof.state_init).beginParse())
	  const client = new TonClient4({
		  endpoint: 'https://mainnet-v4.tonhubapi.com'
	  })
	  const masterAt = await client.getLastBlock()
	  const result = await client.runMethod(masterAt.last.seqno, Address.parse(payload.address), 'get_public_key', [])
	  const publicKey = Buffer.from(result.reader.readBigNumber().toString(16).padStart(64, '0'), 'hex')
	  if (!publicKey) {
		  return false
	  }
	  const wantedPublicKey = Buffer.from(payload.public_key, 'hex')
	  if (!publicKey.equals(wantedPublicKey)) {
		  return false
	  }
	  const wantedAddress = Address.parse(payload.address)
	  const address = contractAddress(wantedAddress.workChain, stateInit)
	  if (!address.equals(wantedAddress)) {
		  return false
	  }
	  const now = Math.floor(Date.now() / 1000)
	  if (now - (60 * 15) > payload.proof.timestamp) {
		  return false
	  }
    return true
  }

```

</details>

您可以查看我们展示主要方法的 [示例](https://github.com/ton-connect/demo-dapp-with-react-ui/tree/master/src/server)：

- [generatePayload](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/api/generate-payload.ts)：为 TON 证明生成有效载荷
- [checkProof](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/api/check-proof.ts)：检查证明并返回访问令牌。

## 概念解释

如果请求 `TonProofItem`，钱包会证明所选账户密钥的所有权。签名信息绑定到

- `Timestamp` 是签名操作的64位unix时代时间
- `Payload` 是一个可变长度的二进制字符串。
- 应用域名
- 签署时间戳
- 应用程序的自定义有效载荷（服务器可在其中放置非密钥、cookie id 和过期时间）

```
message = utf8_encode("ton-proof-item-v2/") ++
          Address ++
          AppDomain ++
          Timestamp ++
          Payload

signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
```

公钥必须验证签名：

- 首先，尝试通过在 `Address` 部署的智能合约上的 `get_public_key` get-method 获得公钥。
- 如果智能合约尚未部署，或缺少get-method，您需要：
- `hash`：256 位无符号整数，大端位；
- `AppDomain` 是 Length ++ EncodedDomainName

<!---->

- `Length` 是 utf-8 编码的应用域名长度，以字节为单位的 32 位值。
- `EncodedDomainName` 是一个 `Length` 字节的 utf-8 编码应用域名。

<!---->

- [GO 演示应用](https://github.com/ton-connect/demo-dapp-backend/blob/master/proof.go)
- [TS 示例](https://gist.github.com/TrueCarry/cac00bfae051f7028085aa018c2a05c6)

注意：有效载荷是长度可变的非信任数据。我们将其放在最后，以避免使用不必要的长度前缀。

必须使用公钥验证签名：

1. [GO 演示应用](https://github.com/ton-connect/demo-dapp-backend/blob/master/proof.go)

2. [TS 示例](https://gist.github.com/TrueCarry/cac00bfae051f7028085aa018c2a05c6)

   1. 解析 `TonAddressItemReply.walletStateInit` 并从 stateInit 获取公钥。您可以将 `walletStateInit.code` 与标准钱包合约的代码进行比较，并根据找到的钱包版本解析数据。

   2. 检查 `TonAddressItemReply.publicKey` 是否等于获取的公钥

   3. 检查 `TonAddressItemReply.walletStateInit.hash()` 是否等于 `TonAddressItemReply.address`。`.hash()`表示 BoC 哈希值。

### 参阅

- [[YouTube] 为 @tonconnect/react-ui 检查 ton_proof [RU]](https://youtu.be/wIMbkJHv0Fs?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_&t=2971)
- [准备消息](/develop/dapps/ton-connect/message-builders)
- [发送消息](/develop/dapps/ton-connect/transactions)
- [Python示例](https://github.com/XaBbl4/pytonconnect/blob/main/examples/check_proof.py)
- [PHP示例](https://github.com/vladimirfokingithub/Ton-Connect-Proof-Php-Check)
- [C# 演示应用程序](https://github.com/WinoGarcia/TonProof.NET)

## 另请参见

- [[YouTube]为 @tonconnect/react-ui 检查 ton_proof [RU]](https://youtu.be/wIMbkJHv0Fs?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_&t=2971)
- [准备信息](/v3/guidelines/ton-connect/guidelines/preparing-messages)
- [发送信息](/v3/guidelines/ton-connect/guidelines/sending-messages)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/overview.mdx
================================================
import Button from '@site/src/components/button'

# 关于 TON Connect

使用TON Connect，在[TON](/learn/introduction)中实现钱包之间的无缝连接。

<div style={{width: '100%', textAlign:'center', margin: '10pt auto'}}>
  <video style={{width: '100%',maxWidth: '600px', borderRadius: '10pt'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/TonConnect.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

随意使用以下流程之一，以集成您的应用程序：

<Button href="/v3/guidelines/ton-connect/frameworks/react" colorType={'primary'} sizeType={'sm'}>
React Apps
</Button>
<Button href="/v3/guidelines/ton-connect/frameworks/web"
        colorType="secondary" sizeType={'sm'}>
HTML/JS Apps
</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo"
        colorType="secondary" sizeType={'sm'}>
TMA USDT Payments Demo
</Button>

## 概述

TonConnect 允许用户毫不费力地使用自己的钱包与各种 dApps 进行交互，从而增强了 TON 生态系统。该协议旨在提供一种安全、用户友好和高效的连接方法，促进基于 TON 的应用程序和服务的更广泛采用。

### TonConnect 的主要功能：

- **无缝集成**。TonConnect 旨在与 TON 钱包和 dApps 平滑集成。用户只需点击几下，就能将钱包连接到 dApp，享受无摩擦体验。

- **增强安全性**。安全是 TON 生态系统中最重要的问题。TonConnect 采用强大的加密和安全通信方法，确保用户数据和交易始终受到保护。

- **用户友好体验**。TonConnect 注重简便性，使用户无需丰富的技术知识即可轻松与 dApps 交互。该协议的直观界面可确保用户从连接到完成交易的整个过程顺畅无阻。

- **跨平台兼容性**。TonConnect 支持各种平台，包括网络、手机和桌面应用程序。这种广泛的兼容性确保用户无论使用哪种设备，都能将钱包连接到 dApp。

- **开发人员友好型工具**。TonConnect 为开发人员提供了一套工具和应用程序接口，可将协议无缝集成到他们的 dApp 中。这些资源使开发人员能够在不同的应用程序中提供一致、安全的连接体验。

- **社区驱动开发**。TON 生态系统得益于一个充满活力的开发者社区。TonConnect 利用这种社区驱动的方法，鼓励开发人员贡献和分享他们的创新成果，从而丰富整个生态系统。

## 应用程序的使用案例

探索 TON 生态系统为卓越的 DApp 集成提供的这些可交付成果。

- **流量**。通过支持 TON Connect 的加密钱包推动更多用户访问。
- **真实性**。利用 TON 用户的钱包作为现成账户，无需额外的身份验证步骤，从而提升用户体验。
- **支付**。通过 TON 区块链使用 Toncoin 或 USD₮ 迅速安全地处理交易。
- **保留**。通过应用内的列表保存功能，用户可以跟踪最近打开和收藏的应用，从而提高用户留存率。

## 面向钱包开发人员

如果您是钱包开发者，您可以将您的钱包连接到 TON Connect，让您的用户以安全、便捷的方式与 TON 应用程序进行交互，请阅读如何[将 TON Connect 集成到您的钱包](/v3/guidelines/ton-connect/wallet/)。

## 成功案例

- **流量**。通过支持TON Connect的加密钱包，推动额外用户访问。
- **真实**。利用TON用户的钱包作为现成账户，无需额外的身份验证步骤，从而提升用户体验。
- **支付**。通过TON区块链使用Toncoin或封装的稳定币（jUSDC/jUSDT）快速安全地处理交易。

<details>
  <summary><b>显示整个列表</b></summary>

- [getgems.io](https://getgems.io/)
- [fragment.com](https://fragment.com/) (Ton Connect v.1)
- [ston.fi](https://ston.fi/)
- [ton.diamonds](https://ton.diamonds/)
- [tegro.finance](https://tegro.finance/liquidity)
- [minter.ton.org](https://minter.ton.org/)
- [libermall.com](https://libermall.com/)
- [dedust.io](https://dedust.io/swap)
- [toncap.net](https://toncap.net/)
- [cryptomus.com](https://cryptomus.com/)
- [avanchange.com](https://avanchange.com/)
- [wton.dev](https://wton.dev/)
- [vk.com/vk_nft_hub](https://vk.com/vk_nft_hub)
- [tonverifier.live](https://verifier.ton.org/)
- [tonstarter.com](https://tonstarter.com/)
- [megaton.fi](https://megaton.fi/)
- [dns.ton.org](https://dns.ton.org/)
- [coinpaymaster.com](https://coinpaymaster.com/)
- [daolama.co](https://daolama.co/)
- [ton.vote](https://ton.vote/)
- [business.thetonpay.app](https://business.thetonpay.app/)
- [bridge.orbitchain.io](https://bridge.orbitchain.io/)
- [app.fanz.ee/staking](https://app.fanz.ee/staking)
- [testnet.pton.fi](https://testnet.pton.fi/)
- [cardify.casino](https://cardify.casino/)
- [soquest.xyz](https://soquest.xyz/)
- [app.evaa.finance](https://app.evaa.finance/)

</details>

## 加入 TON 生态系统

要将您的服务与 TON 生态系统连接起来，您需要执行以下操作：

- [getgems.io](https://getgems.io/)
- [fragment.com](https://fragment.com/) (Ton Connect v.1)
- [ston.fi](https://ston.fi/)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/wallet.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/wallet.mdx
================================================
import Button from '@site/src/components/button'

# 连接钱包

如果您是一名钱包开发者，您可以将您的钱包连接到TON Connect，并使您的用户能够以安全便捷的方式与TON应用程序进行交互。

## 集成

使用以下步骤将您的钱包连接到TON Connect：

1. 仔细阅读[协议规范](/develop/dapps/ton-connect/protocol/)。
2. 使用其中一个[SDK](/develop/dapps/ton-connect/developers)实现协议。
3. 通过拉取请求将您的钱包添加到[钱包列表](https://github.com/ton-blockchain/wallets-list)中。

<Button href="/develop/dapps/ton-connect/protocol/" colorType={'primary'} sizeType={'sm'}>

开始集成

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/overview.mdx
================================================
# 概览

## 概念

阅读更多关于思想的内容：

- [TON上的支付](https://blog.ton.org/ton-payments)
- [TON DNS和域名](/participate/web3/dns)
- [TON网站、TON WWW和TON代理](https://blog.ton.org/ton-sites)

## 用例

- [为任何智能合约提供\*.ton用户友好域名](/participate/web3/dns)
- [使用TON代理连接到TON网站](/participate/web3/setting-proxy)
- [运行自己的TON代理以连接到TON网站](/participate/web3/sites-and-proxy)
- [将您的TON钱包或TON网站链接到一个域名](/participate/web3/site-management)
- [如何使用TON DNS智能合约创建子域名](/participate/web3/site-management#how-to-set-up-subdomains)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/dns.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/dns.md
================================================
# TON DNS和域名

TON DNS是一项服务，用于将易于人类阅读的域名（如`test.ton`或`mysite.temp.ton`）转换为TON智能合约地址、TON网络上运行的服务（如TON网站）所使用的ADNL地址等。

## 标准

[TON DNS标准](https://github.com/ton-blockchain/TIPs/issues/81)描述了域名的格式、解析域的过程、DNS智能合约的接口以及DNS记录的格式。

## SDK

在JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) 和 [TonLib](https://ton.org/#/apis/?id=_2-ton-api)中实现了与TON DNS的交互。

```js
const address: Address = await tonweb.dns.getWalletAddress('test.ton');

// or 

const address: Address = await tonweb.dns.resolve('test.ton', TonWeb.dns.DNS_CATEGORY_WALLET);
```

`lite-client` 和 `tonlib-cli` 也支持DNS查询。

## 一级域名

目前，只有以`.ton`结尾的域名被认为是有效的TON DNS域名。

根DNS智能合约源代码 - https://github.com/ton-blockchain/dns-contract/blob/main/func/root-dns.fc。

将来这可能会改变。添加新的一级域名将需要新的根智能合约和改变[网络配置#4](https://ton.org/#/smart-contracts/governance?id=config)的通用投票。

## \*.ton域名

\*.ton域名以NFT的形式实现。由于它们实现了NFT标准，因此与常规NFT服务（例如NFT市场）和可以显示NFT的钱包兼容。

\*.ton域名源代码 - https://github.com/ton-blockchain/dns-contract。

.ton域名解析器实现了NFT集合接口，而.ton域名实现了NFT项接口。

\*.ton域名的首次销售通过https://dns.ton.org上的去中心化公开拍卖进行。源代码 - https://github.com/ton-blockchain/dns。

## 子域名

域名所有者可以通过在DNS记录`sha256("dns_next_resolver")`中设置负责解析子域名的智能合约地址来创建子域名。

它可以是任何实现DNS标准的智能合约。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/subresolvers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/subresolvers.md
================================================
# TON DNS 解析器

## 介绍

TON DNS 是一个强大的工具。它不仅允许将 TON 网站/存储包分配给域名，还可以设置子域名解析。

## 相关链接

1. [TON 智能合约地址系统](/learn/overviews/addresses)
2. [TEP-0081 - TON DNS 标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md)
3. [.ton DNS 集合的源代码](https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz#source)
4. [.t.me DNS 集合的源代码](https://tonscan.org/address/EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi#source)
5. [域名合约搜索器](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source)
6. [简单子域名管理器代码](https://github.com/Gusarich/simple-subdomain/blob/198485bbc9f7f6632165b7ab943902d4e125d81a/contracts/subdomain-manager.fc)

## 域名合约搜索器

子域名具有实际用途。例如，区块链浏览器目前没有提供通过名称查找域名合约的方法。让我们探索如何创建一个合约，提供查找这类域名的机会。

:::info
This contract is deployed at [EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH\_Zp](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source) and linked to `resolve-contract.ton`. To test it, you may write `<your-domain.ton>.resolve-contract.ton` in the address bar of your favourite TON explorer and get to the page of TON DNS domain contract. Subdomains and .t.me domains are supported as well.

您可以尝试通过访问 `resolve-contract.ton.resolve-contract.ton` 来查看解析器代码。不幸的是，这将不会显示子解析器（那是不同的智能合约），您将看到域名合约本身的页面。
:::

### dnsresolve() 代码

部分重复部分已省略。

```func
(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; assuming that 'subdomain' is not empty
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; current contract has no DNS records by itself
      return (8, null());
    }
  }
  
  ;; we are loading some subdomain
  ;; supported subdomains are "ton\\0", "me\\0t\\0" and "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; we're resolving
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; we want the resolve result to point at contract of 'ratelance.ton', not its owner
    ;; so we must answer that resolution is complete + "wallet"H is address of 'ratelance.ton' contract
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; we want to pass \\0 further, so that next resolver has opportunity to process only one byte
    
    ;; next resolver is contract of 'resolve-contract<.ton>'
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}
```

### dnsresolve() 解释

- 用户请求 `"stabletimer.ton.resolve-contract.ton"`。
- 应用程序将其转换为 `"\0ton\0resolve-contract\0ton\0stabletimer\0"`（第一个零字节是可选的）。
- 根 DNS 解析器将请求定向到 TON DNS 集合，剩余部分为 `"\0resolve-contract\0ton\0stabletimer\0"`。
- TON DNS 集合将请求委托给特定域名，留下 `"\0ton\0stabletimer\0"`。
- .TON DNS 域名合约将解析传递给编辑器指定的子解析器，子域名为 `"ton\0stabletimer\0"`。

**这是 dnsresolve() 被调用的点。** 分步解释其工作方式：

1. 它将子域名和类别作为输入。
2. 如果开头有零字节，则跳过。
3. 检查子域名是否以 `"ton\0"` 开头。如果是，
   1. 跳过前32位（子域名 = `"resolve-contract\0"`）
   2. 设置 `subdomain_sfx` 的值为 `subdomain`，并读取直到零字节的字节
   3. （子域名 = `"resolve-contract\0"`，subdomain_sfx = `""`）
   4. 从子域名 slice 的末尾裁剪零字节和 subdomain_sfx（子域名 = `"resolve-contract"`）
   5. 使用 slice_hash 和 get_ton_dns_nft_address_by_index 函数将域名转换为合约地址。您可以在 [[Subresolvers#Appendix 1. resolve-contract.ton 的代码|附录 1]] 中看到它们。
4. 否则，dnsresolve() 检查子域名是否以 `"address\0"` 开头。如果是，它跳过该前缀并读取 base64 地址。
5. 如果提供的用于解析的子域名与这些前缀都不匹配，函数通过返回 `(0, null())`（零字节前缀解析无 DNS 条目）表示失败。
6. 然后检查子域名后缀是否为空。空后缀表示请求已完全满足。如果后缀为空：
   1. dnsresolve() 为域名的 "wallet" 子部分创建一个 DNS 记录，使用它检索到的 TON 域名合约地址。
   2. 如果请求类别 0（所有 DNS 条目），则将记录包装在字典中并返回。
   3. 如果请求类别为 "wallet"H，则按原样返回记录。
   4. 否则，指定类别没有 DNS 条目，因此函数表示解析成功但未找到任何结果。
7. 如果后缀不为空：
   1. 之前获得的合约地址用作下一个解析器。函数构建指向它的下一个解析器记录。
   2. `"\0ton\0stabletimer\0"` 被传递给该合约：处理的位是子域名的位。

总结来说，dnsresolve() 要么：

- 将子域名完全解析为 DNS 记录
- 部分解析为解析器记录，以将解析传递给另一个合约
- 为未知子域名返回“未找到域名”的结果

:::warning
实际上，base64 地址解析不起作用：如果您尝试输入 `<some-address>.address.resolve-contract.ton`，您将收到一个错误，表明域名配置错误或不存在。原因是域名不区分大小写（从真实 DNS 继承的功能），因此会转换为小写，将您带到不存在的工作链的某个地址。
:::

### 绑定解析器

现在子解析器合约已部署，我们需要将域名指向它，即更改域名的 `dns_next_resolver` 记录。我们可以通过将以下 TL-B 结构的消息发送到域名合约来实现。

1. `change_dns_record#4eb1f0f9 query_id:uint64 record_key#19f02441ee588fdb26ee24b2568dd035c3c9206e11ab979be62e55558a1d17ff record:^[dns_next_resolver#ba93 resolver:MsgAddressInt]`

## 创建自己的子域名管理器

子域名对普通用户来说可能有用 - 例如，将几个项目链接到单个域名，或链接到朋友的钱包。

### 合约数据

我们需要在合约数据中存储所有者的地址和 *域名*->*记录哈希*->*记录值* 字典。

```func
global slice owner;
global cell domains;

() load_data() impure {
  slice ds = get_data().begin_parse();
  owner = ds~load_msg_addr();
  domains = ds~load_dict();
}
() save_data() impure {
  set_data(begin_cell().store_slice(owner).store_dict(domains).end_cell());
}
```

### 处理记录更新

```func
const int op::update_record = 0x537a3491;
;; op::update_record#537a3491 domain_name:^Cell record_key:uint256
;;     value:(Maybe ^Cell) = InMsgBody;

() recv_internal(cell in_msg, slice in_msg_body) {
  if (in_msg_body.slice_empty?()) { return (); }   ;; simple money transfer

  slice in_msg_full = in_msg.begin_parse();
  if (in_msg_full~load_uint(4) & 1) { return (); } ;; bounced message

  slice sender = in_msg_full~load_msg_addr();
  load_data();
  throw_unless(501, equal_slices(sender, owner));
  
  int op = in_msg_body~load_uint(32);
  if (op == op::update_record) {
    slice domain = in_msg_body~load_ref().begin_parse();
    (cell records, _) = domains.udict_get_ref?(256, string_hash(domain));

    int key = in_msg_body~load_uint(256);
    throw_if(502, key == 0);  ;; cannot update "all records" record

    if (in_msg_body~load_uint(1) == 1) {
      cell value = in_msg_body~load_ref();
      records~udict_set_ref(256, key, value);
    } else {
      records~udict_delete?(256, key);
    }

    domains~udict_set_ref(256, string_hash(domain), records);
    save_data();
  }
}
```

我们检查传入消息是否包含某些请求，不是弹回的，来自所有者，且请求为 `op::update_record`。

然后，我们从消息中加载域名。我们不能将域名按原样存储在字典中：它们可能有不同的长度，但 TVM 非前缀字典只能包含等长的键。因此，我们计算 `string_hash(domain)` - 域名的 SHA-256；域名保证有整数个八位字节，因此这是有效的。

之后，我们为指定域名更新记录，并将新数据保存到合约存储中。

### 解析域名

```func
(slice, slice) ~parse_sd(slice subdomain) {
  ;; "test\0qwerty\0" -> "test" "qwerty\0"
  slice subdomain_sfx = subdomain;
  while (subdomain_sfx~load_uint(8)) { }  ;; searching zero byte
  subdomain~skip_last_bits(slice_bits(subdomain_sfx));
  return (subdomain, subdomain_sfx);
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, subdomain_bits % 8 == 0);
  if (subdomain.preload_uint(8) == 0) { subdomain~skip_bits(8); }
  
  slice subdomain_suffix = subdomain~parse_sd();  ;; "test\0" -> "test" ""
  int subdomain_suffix_bits = slice_bits(subdomain_suffix);

  load_data();
  (cell records, _) = domains.udict_get_ref?(256, string_hash(subdomain));

  if (subdomain_suffix_bits > 0) { ;; more than "<SUBDOMAIN>\0" requested
    category = "dns_next_resolver"H;
  }

  int resolved = subdomain_bits - subdomain_suffix_bits;

  if (category == 0) { ;; all categories are requested
    return (resolved, records);
  }

  (cell value, int found) = records.udict_get_ref?(256, category);
  return (resolved, value);
}
```

`dnsresolve` 函数检查请求的子域名是否包含整数个八位字节，跳过子域名 slice 开头的可选零字节，然后将其分割为最高级别的域和其他部分（`test\0qwerty\0` 被分割为 `test` 和 `qwerty\0`）。加载与请求的域名对应的记录字典。

如果存在非空子域名后缀，函数返回已解析的字节数和在 `"dns_next_resolver"H` 键下找到的下一个解析器记录。否则，函数返回已解析的字节数（即整个 slice 长度）和请求的记录。

可以通过更优雅地处理错误来改进此函数，但这不是绝对必需的。

## 附录 1. resolve-contract.ton 的代码

<details>

```func showLineNumbers
(builder, ()) ~store_slice(builder to, slice s) asm "STSLICER";
int starts_with(slice a, slice b) asm "SDPFXREV";

const slice ton_dns_minter = "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"a;
cell ton_dns_domain_code() asm """
  B{<TON DNS NFT code in HEX format>}
  B>boc
  PUSHREF
""";

const slice tme_minter = "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"a;
cell tme_domain_code() asm """
  B{<T.ME NFT code in HEX format>}
  B>boc
  PUSHREF
""";

cell calculate_ton_dns_nft_item_state_init(int item_index) inline {
  cell data = begin_cell().store_uint(item_index, 256).store_slice(ton_dns_minter).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(ton_dns_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

cell calculate_tme_nft_item_state_init(int item_index) inline {
  cell config = begin_cell().store_uint(item_index, 256).store_slice(tme_minter).end_cell();
  cell data = begin_cell().store_ref(config).store_maybe_ref(null()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(tme_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

builder calculate_nft_item_address(int wc, cell state_init) inline {
  return begin_cell()
      .store_uint(4, 3)
      .store_int(wc, 8)
      .store_uint(cell_hash(state_init), 256);
}

builder get_ton_dns_nft_address_by_index(int index) inline {
  cell state_init = calculate_ton_dns_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

builder get_tme_nft_address_by_index(int index) inline {
  cell state_init = calculate_tme_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

(slice, builder) decode_base64_address_to(slice readable, builder target) inline {
  builder addr_with_flags = begin_cell();
  repeat(48) {
    int char = readable~load_uint(8);
    if (char >= "a"u) {
      addr_with_flags~store_uint(char - "a"u + 26, 6);
    } elseif ((char == "_"u) | (char == "/"u)) {
      addr_with_flags~store_uint(63, 6);
    } elseif (char >= "A"u) {
      addr_with_flags~store_uint(char - "A"u, 6);
    } elseif (char >= "0"u) {
      addr_with_flags~store_uint(char - "0"u + 52, 6);
    } else {
      addr_with_flags~store_uint(62, 6);
    }
  }
  
  slice addr_with_flags = addr_with_flags.end_cell().begin_parse();
  addr_with_flags~skip_bits(8);
  addr_with_flags~skip_last_bits(16);
  
  target~store_uint(4, 3);
  target~store_slice(addr_with_flags);
  return (readable, target);
}

slice decode_base64_address(slice readable) method_id {
  (slice _remaining, builder addr) = decode_base64_address_to(readable, begin_cell());
  return addr.end_cell().begin_parse();
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);

  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; assuming that 'subdomain' is not empty
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; current contract has no DNS records by itself
      return (8, null());
    }
  }
  
  ;; we are loading some subdomain
  ;; supported subdomains are "ton\\0", "me\\0t\\0" and "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; we're resolving
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6D65007400"s)) {
    ;; "t" \\0 "me" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(40);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_tme_nft_address_by_index(string_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; we want the resolve result to point at contract of 'ratelance.ton', not its owner
    ;; so we must answer that resolution is complete + "wallet"H is address of 'ratelance.ton' contract
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; and we want to pass \\0 further, so that next resolver has opportunity to process only one byte
    
    ;; next resolver is contract of 'resolve-contract<.ton>'
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}

() recv_internal() {
  return ();
}
```

</details>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy.md
================================================
# 通过 TON 代理连接

TON代理与常规HTTP代理兼容，因此您可以直接在浏览器或操作系统设置中使用它。

## Google Chrome

根据您的操作系统，遵循Windows、macOS、Linux、iOS或Android的说明。

## Firefox

设置 -> 常规 -> 网络设置 -> 配置 -> 手动代理设置 -> HTTP代理

根据您的操作系统，遵循Windows、macOS、Linux、iOS或Android的说明。

点击“确定”。

## Safari

在“HTTP代理”字段中，输入其中一个公共入口代理的地址，在“端口”字段中，输入“8080”（不带引号）。

## iOS

设置 -> WiFi -> 点击当前连接的网络 -> 代理设置 -> 手动

根据您的操作系统，遵循Windows、macOS、Linux、iOS或Android的说明。

点击“保存”。

## Android

在“服务器”字段中，输入其中一个公共入口代理的地址，在“端口”字段中，输入“8080”（不带引号）。

点击“保存”。

点击“保存”。

## Windows

在“服务器”字段中，输入其中一个公共入口代理的地址，在“端口”字段中，输入“8080”（不带引号）。

点击“保存”。

在“编辑代理服务器对话框”中，执行以下操作：

点击“开始”按钮，然后选择设置 > 网络和互联网 > 代理。

在“手动代理设置”下，旁边的“使用代理服务器”选择“设置”。

在“编辑代理服务器对话框”中，执行以下操作：

## MacOS

输入其中一个公共入口代理的地址，在“端口”字段中，输入“8080”（不带引号）。

点击“保存”。

点击“确定”。

## Ubuntu

在“网络代理服务器”字段中，输入其中一个公共入口代理的地址，冒号后面输入“8080”（不带引号）。

点击“确定”。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site.md
================================================
# 如何打开任何 TON 网站？

在这篇文章中，我们将看看从不同设备访问TON网站的最常用方法。

每种方法都有其优缺点，我们将在这里分析。

我们将从最简单的方法开始，最后介绍最高级的方法。

## 😄 简单方法

### 通过ton.run浏览

打开TON网站最简单的方法是通过[ton.run](https://ton.run)。您无需在设备上安装或设置任何东西 - 只需打开**ton.run**，您就可以探索TON网站。

对于偶尔浏览TON网站或进行一些检查，这种方法可能适合，但不适合常规使用，因为它也有缺点：

- 您信任您的互联网流量给**ton.run**
- 它可能随时离线或出故障
- 它可能被您的互联网提供商封锁

### TON Wallet 和 MyTonWallet 扩展

稍微困难一点但更好的方法是使用某些浏览器扩展，它将连接您到TON代理，并允许您在没有任何中间服务（如ton.run）的情况下浏览TON网站。

目前，TON代理已经在[MyTonWallet](https://mytonwallet.io/)扩展中可用，并且很快也将在[TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)扩展中可用。

这种方法也相当简单，但您需要在浏览器中安装一个扩展才能使其工作。它适合大多数用户。

## 连接到公共代理

### 使用Tonutils-Proxy

此方法在此处描述：

1. [通过TON代理连接](/participate/web3/setting-proxy/)

2. 启动它并按“启动网关”

3. 完成！

## 🤓 高级方法

- [运行 C++ 实现](/v3/guidelines/web3/ton-proxy-sites/running-your-your-ton-proxy)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site.md
================================================
# 如何运行 TON 网站

## 👋 引言

[TON 网站](https://blog.ton.org/ton-sites)的工作方式几乎与普通网站相同，除了它们的安装。需要执行一些额外的操作来启动它们。在这篇教程中，我将向您展示如何做到这一点。

## 🖥 运行 TON 网站

安装 [Tonutils 反向代理](https://github.com/tonutils/reverse-proxy) 来使用 TON 代理为您的网站服务。

### 在任何 Linux 上的安装

##### 下载

```bash
wget https://github.com/ton-utils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### 运行

用域配置运行，并按步骤操作：

```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```

使用 Tonkeeper、Tonhub 或任何其他钱包扫描你的终端中的 QR 码，执行交易。您的域将会链接到您的网站上。

###### 无域运行

作为替代，如果你没有 .ton 或 .t.me 域，你可以以简单模式运行，使用 .adnl 域：

```
./tonutils-reverse-proxy-linux-amd64
```

##### 使用

现在任何人都可以访问您的 TON 网站了！使用 ADNL 地址或域名。

如果您想更改一些设置，如代理pass url - 打开 `config.json` 文件，编辑后重启代理。默认的代理pass url是 `http://127.0.0.1:80/`

代理添加了额外的头部：
`X-Adnl-Ip` - 客户端的 IP 和 `X-Adnl-Id` - 客户端的 ADNL ID

### 在任何其他操作系统上的安装

使用 `./build.sh` 从源代码构建，然后如第 2 步中的 Linux 一样运行。构建需要 Go 环境。

```bash
git clone https://github.com/tonutils/reverse-proxy.git
cd reverse-proxy
make build
```

要为其他操作系统构建程序，请运行 `make all` 。

## 👀 进一步的步骤

### 🔍 检查网站的可用性

完成所选方法的所有步骤后，TON 代理服务器应已启动。如果一切顺利，您的网站将在相应步骤中收到的 ADNL 地址上可用。

您可以使用域名 `.adnl`打开该地址，查看网站是否可用。另外请注意，为了打开该网站，您必须在浏览器中运行 TON 代理，例如通过扩展 [MyTonWallet](https://mytonwallet.io/)。

## 📌 参考资料

- [TON 站点、TON WWW 和 TON 代理](https://blog.ton.org/ton-sites)
- [Tonutils反向代理](https://github.com/tonutils/reverse-proxy)
- 作者：[Andrew Burnosov](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [Daniil Sedov](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [George Imedashvili](https://github.com/drforse)

## 参阅

- [运行 C++ 实现](/v3/guidelines/web3/ton-proxy-sites/running-your-your-ton-proxy)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy.md
================================================
# 运行自己的 TON 代理

本文档旨在简要地介绍TON网站，即通过TON网络访问的网站。TON网站可以方便地作为进入其他TON服务的入口。特别是，从TON网站下载的HTML页面可能包含指向`ton://...` URI的链接，用户点击这些链接后，如果用户设备上安装了TON钱包，就可以执行支付操作。

从技术角度看，TON网站非常类似于标准网站，但它们是通过[TON网络](/learn/networking/overview)（互联网内的一个覆盖网络）而不是互联网访问的。更具体地说，它们拥有一个[ADNL](/learn/networking/adnl)地址（而不是更常见的IPv4或IPv6地址），并通过[RLDP](/learn/networking/rldp)协议（这是建立在ADNL之上的高级RPC协议，ADNL是TON网络的主要协议）接受HTTP查询，而不是常规的TCP/IP。所有加密由ADNL处理，所以如果入口代理托管在用户设备上，就没有必要使用HTTPS（即TLS）。

为了访问现有的网站和创建新的TON网站，需要特殊的网关来连接“普通”互联网和TON网络。本质上，通过在客户端机器上本地运行的HTTP->RLDP代理访问TON网站，并通过在远程Web服务器上运行的RLDP->HTTP代理来创建它们。

[了解更多关于TON网站、WWW和代理的信息](https://blog.ton.org/ton-sites)

## 运行入口代理

为了访问现有的TON网站，你需要在你的电脑上运行一个RLDP-HTTP代理。

1. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**rldp-http-proxy**。

   或者你可以按照这些[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 运行**rldp-http-proxy**

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```

在上面的例子中，`8080`是将在本地主机上监听传入HTTP查询的TCP端口，而`3333`是将用于所有出站和入站RLDP和ADNL活动的UDP端口（即通过TON网络连接到TON网站）。`global.config.json`是TON全局配置的文件名。

如果一切正确，入口代理将不会终止，而是会继续在终端运行。现在可以用它来访问TON网站。当你不再需要它时，可以通过按`Ctrl-C`或简单地关闭终端窗口来终止它。

你的入口代理将通过HTTP在`localhost`端口`8080`上可用。

## 在远程计算机上运行入口代理

1. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**rldp-http-proxy**。

   或者你可以按照这些[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**generate-random-id**。

   或者你可以按照这些[指示](/develop/howto/compile#generate-random-id)自己编译**generate-random-id**。

4. 为你的入口代理生成一个持久的ANDL地址

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   你会看到类似于

   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   这是你新生成的持久ADNL地址，以十六进制和用户友好形式显示。相应的私钥保存在当前目录的文件`45061...2DB`中。将密钥移动到keyring目录

   ```bash
   mv 45061C1* keyring/
   ```

5. 运行**rldp-http-proxy**

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

   其中`<your_public_ip>`是你的公共IPv4地址，`<your_adnl_address>`是在上一步中生成的ADNL地址。

   示例：

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   在上面的示例中，`8080`是将在本地主机上监听传入HTTP查询的TCP端口，而`3333`是将用于所有出站和入站RLDP和ADNL活动的UDP端口（即通过TON网络连接到TON网站）。`global.config.json`是TON全局配置的文件名。

如果你做得都对，代理不会终止，而是会继续在终端运行。现在可以用它来访问TON网站。当你不再需要它时，可以通过按`Ctrl-C`或简单地关闭终端窗口来终止它。你可以将这个运行为一个unix服务以永久运行。

你的入口代理将通过HTTP在`<your_public_ip>`端口`8080`上可用。

## 访问TON网站

现在假设你在电脑上运行了一个RLDP-HTTP代理的实例，并且正在`localhost:8080`上监听传入的TCP连接，如[上面](#running-entry-proxy)所解释的。

使用诸如`curl`或`wget`之类的程序进行简单测试以确认一切正常运行是可行的。例如，

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

尝试使用代理`127.0.0.1:8080`下载(TON)站点`just-for-test.ton`的主页。如果代理正常运行，你将看到类似于

```html

<html>
<head>
<title>TON Site</title>
</head>
<body>
<h1>TON Proxy Works!</h1>
</body>
</html>

```

你还可以通过使用假域名`<adnl-addr>.adnl`通过它们的ADNL地址访问TON网站

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```

目前获取的是同一个TON网页。

或者，你可以在浏览器中将`localhost:8080`设置为HTTP代理。例如，如果你使用Firefox，请访问[设置] -> 通用 -> 网络设置 -> 设置 -> 配置代理访问 -> 手动代理配置，并在“HTTP代理”字段中输入“127.0.0.1”，在“端口”字段中输入“8080”。

一旦你在浏览器中设置了`localhost:8080`作为HTTP代理，你就可以在浏览器的导航

## 运行TON网站

:::tip 教程找到了！
嘿！不要从初学者友好的教程[如何运行TON网站？](/develop/dapps/tutorials/how-to-run-ton-site)开始
:::

大多数人只需要访问现有的TON网站，而不是创建新的。然而，如果你想创建一个，你需要在你的服务器上运行RLDP-HTTP代理，以及像Apache或Nginx这样的常规Web服务器软件。

我们假设您已经知道如何建立一个普通网站，并且已经在服务器上配置了一个网站，接受 TCP 端口 `<your-server-ip>:80` 的 HTTP 连接，并在网络服务器配置中定义了所需的 TON 网络域名（例如 `example.ton`）作为网站的主域名或别名。

1. 从 [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) 下载 **rldp-http-proxy** 。

   或者你可以按照这个[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**generate-random-id**。

   或者你可以按照这些[指示](/develop/howto/compile#generate-random-id)自己编译**generate-random-id**。

4. 为你的服务器生成一个持久的ANDL地址

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   你会看到类似于

   ```bash
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   这是你新生成的持久ADNL地址，以十六进制和用户友好形式显示。相应的私钥保存在当前目录的文件`45061...2DB`中。将密钥移动到keyring目录

   ```bash
   mv 45061C1* keyring/
   ```

5. 确保你的Web服务器接受带有`.ton`和`.adnl`域名的HTTP请求。

   例如，如果你使用带有配置`server_name example.com;`的nginx，你需要将其更改为`server_name _;`或`server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;`。

6. 以反向模式运行代理

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

   其中`<your_public_ip>`是你的服务器公共IPv4地址，`<your_adnl_address>`是在上一步中生成的ADNL地址。

如果你想让你的TON网站永久运行，你将不得不使用选项`-d`和`-l <log-file>`。

示例:

```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -L '*' -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

如果一切正常工作，RLDP-HTTP代理将接受来自TON网络的传入HTTP查询，通过运行在UDP端口3333的IPv4地址`<your-server-ip>`（特别是，如果你使用防火墙，请不要忘记允许`rldp-http-proxy`从该端口接收和发送UDP数据包）的RLDP/ADNL，它将把这些HTTP查询转发到所有主机（如果你只想转发特定主机，请将`-L '*'`更改为`-L <your hostname>`）的`127.0.0.1`TCP端口`80`（即你的常规Web服务器）。

你可以在客户端机器上的浏览器中访问TON网站`http://<your-adnl-address>.adnl`（在这个示例中是`http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl`），如“访问TON网站”部分所解释的，并检查你的TON网站是否真的对公众开放。

如果你愿意，你可以[注册](/participate/web3/site-management)一个TON DNS域名，比如'example.ton'，并为这个域名创建一个指向你TON网站的持久ADNL地址的`site`记录。然后，在客户端模式下运行的RLDP-HTTP代理将会解析http://example.ton为指向你的ADNL地址，并访问你的TON网站。

你还可以在一个单独的服务器上运行反向代理，并将你的Web服务器设置为远程地址。在这种情况下，请使用`-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>`替代`-L '*'`。

示例:

```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

在这种情况下，你的常规Web服务器应该在 `http://333.333.333.333:80` 上可用（这个IP不会对外暴露）。

### 建议

由于匿名功能将只在TON Proxy 2.0中可用，如果你不想公开你的Web服务器的IP地址，你可以通过以下两种方式实现：

- 在单独的服务器上运行反向代理，并使用`-R`标志，如上所述。

- 制作一个带有你网站副本的重复服务器，并在本地运行反向代理。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management.md
================================================
# 网站和域名管理

## 如何打开域名进行编辑

1. 在您的电脑上打开Google Chrome浏览器。

2. 从此[链接](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)安装Google Chrome的TON扩展。

3. 打开扩展，点击“导入钱包”，并导入存储域名的钱包。

> 恢复短语
>
> 您的恢复短语是您在创建钱包时写下的24个单词。
>
> 如果您丢失了短语，可以使用任何TON钱包进行恢复。
> 在Tonkeeper中：设置 > 钱包保护 > 您的私钥。
>
> 请务必记下这24个单词，并将它们保存在安全的地方。在紧急情况下，您只能通过恢复短语来恢复对钱包的访问。
> 请严格保密您的恢复短语。任何获得您恢复短语的人都将完全控制您的资金。

4. 现在在https://dns.ton.org打开您的域名并点击“编辑”按钮。

## 如何将钱包链接到域名

您可以将钱包链接到域名，这样用户将能够通过输入域名作为接收地址来向该钱包发送币，而不是钱包地址。

1. 按上述方法打开域名进行编辑。

2. 将您的钱包地址复制到“Wallet address”字段中，然后点击“保存”。

3. 在扩展中确认发送交易。

## 如何将 TON 网站链接到域名

1. 按上述方法打开域名进行编辑。

2. 将您的TON网站的ADNL地址以HEX格式复制到“Site”字段中，然后点击“保存”。

3. 在扩展中确认发送交易。

## 如何设置子域名

1. 在网络上创建一个智能合约，用于管理您网站或服务的子域名。您可以使用现成的[manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc)或[auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc)智能合约，或任何实现TON DNS接口的其他智能合约。

2. 按上述方法打开域名进行编辑。

3. 将子域名的智能合约地址复制到“Subdomains”字段中，然后点击“保存”。

4. 在扩展中确认发送交易。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications.mdx
================================================
# TON 应用站点

## 如何在应用程序中支持 TON 站点？

您可以通过将本地入口代理集成到您的产品中，从您的应用程序中启动 TON 站点。

现有一个库和以下示例：

- [Andriod](https://github.com/andreypfau/tonutils-proxy-android-example)
- [iOS](https://github.com/ton-blockchain/ton-proxy-swift)

:::caution
公共入口代理仅用于熟悉和测试，请勿使用。
:::

## 另请参见

- [使用 TON 代理连接](/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-daemon.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-daemon.md
================================================
# 存储守护程序

*存储守护程序是用于在TON网络中下载和共享文件的程序。`storage-daemon-cli`控制台程序用于管理正在运行的存储守护程序。*

当前版本的存储守护程序可以在[Testnet](https://github.com/ton-blockchain/ton/tree/testnet)分支中找到。

## 硬件要求

- 至少1GHz和2核CPU
- 至少2 GB RAM
- 至少2 GB SSD（不计算种子文件占用空间）
- 10 Mb/s网络带宽，具有静态IP

## 二进制文件

您可以从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载适用于Linux/Windows/MacOS的`storage-daemon`和`storage-daemon-cli`二进制文件。

## 从源代码编译

您可以使用此[说明](/develop/howto/compile#storage-daemon)从源代码编译`storage-daemon`和`storage-daemon-cli`。

## 关键概念

- *文件包*或*包* - 通过TON存储分发的文件集合
- TON存储的网络部分基于类似于种子的技术，因此术语*种子*、*文件包*和*包*将互换使用。但重要的是要注意一些区别：TON存储通过[ADNL](/learn/networking/adnl)通过[RLDP](/learn/networking/rldp)协议传输数据，每个*包*通过其自己的网络覆盖层分发，merkle结构可以存在两个版本 - 用于高效下载的大块和用于高效所有权证明的小块，以及[TON DHT](/learn/networking/ton-dht)网络用于查找节点。
- *文件包*由*种子信息*和数据块组成。
- 数据块以*种子头*开头 - 包含文件列表及其名称和大小的结构。文件本身紧随在数据块中。
- 数据块被划分为块（默认为128 KB），并且在这些块的 SHA256 散列上构建了一个 *merkle 树*（由 TVM cell构成）。这允许构建和验证单个块的 *merkle 证明*，以及通过仅交换修改块的证明来高效重建 *包*。
- *种子信息*包含*merkle根*：
  - 块大小（数据块）
  - 块大小列表
  - Hash *merkle树*
  - 描述 - 种子创建者指定的任何文本
- *种子信息*被序列化为TVM cell。此cell的哈希称为*BagID*，它唯一标识*包*。
- *包元数据*是一个包含*种子信息*和*种子头*的文件。\*这是`.torrent`文件的类比。

## 启动存储守护程序和storage-daemon-cli

### 启动存储守护程序的示例命令：

`storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db`

- `-v` - 详细程度（INFO）
- `-C` - 全局网络配置（[下载全局配置](/develop/howto/compile#download-global-config)）
- `-I` - ADNL的IP地址和端口
- `-p` - 控制台接口的TCP端口
- `-D` - 存储守护程序数据库的目录

### storage-daemon-cli管理

它的启动方式如下：

```
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

- `-I` - 守护程序的IP地址和端口（端口与上面的`-p`参数相同）
- `-k` 和 `-p`- 这是客户端的私钥和服务器的公钥（类似于`validator-engine-console`）。这些密钥在守护程序第一次运行时生成，并放置在`<db>/cli-keys/`中。

### 命令列表

`storage-daemon-cli`命令列表可以使用`help`命令获取。

命令有位置参数和标志。带空格的参数应用引号（`'`或`"`）括起来，也可以转义空格。还可以使用其他转义，例如：

```
create filename\ with\ spaces.txt -d "Description\nSecond line of \"description\"\nBackslash: \\"
```

`--`后的所有参数都是位置参数。可以用它来指定以破折号开头的文件名：

```
create -d "Description" -- -filename.txt
```

`storage-daemon-cli` 可以通过传递要执行的命令来以非交互模式运行：

```
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## 添加文件包

要下载 *文件包*，您需要知道其 `BagID` 或拥有一个元文件。以下命令可用于添加下载 *包*：

```
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```

*包* 将被下载到指定的目录。您可以省略它，然后它将被保存到存储守护程序目录中。

:::info
哈希以十六进制形式指定（长度 - 64个字符）。
:::

通过元文件添加 *包* 时，有关 *包* 的信息将立即可用：大小，描述，文件列表。通过哈希添加时，您将必须等待这些信息被加载。

## 管理添加的包

- `list` 命令输出 *包* 列表。
- `list --hashes` 输出带有完整哈希的列表。

在所有后续命令中，`<BagID>` 要么是哈希（十六进制），要么是会话中 *包* 的序号（可以在 `list` 命令中看到的数字）。*包* 的序号不会在 storage-daemon-cli 重启之间保存，并且在非交互模式下不可用。

### 方法

- `get <BagID>` - 输出有关 *包* 的详细信息：描述，大小，下载速度，文件列表。
- `get-peers <BagID>` - 输出对方节点列表。
- `download-pause <BagID>`、`download-resume <BagID>` - 暂停或恢复下载。
- `upload-pause <BagID>`、`upload-resume <BagID>` - 暂停或恢复上传。
- `remove <BagID>` - 移除 *包*。`remove --remove-files` 还会删除 *包* 的所有文件。请注意，如果 *包* 保存在内部存储守护程序目录中，无论如何都会删除文件。

## 部分下载，优先级

:::info
添加 *包* 时，您可以指定您想从中下载哪些文件：
:::

```
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### 优先级

*包文件* 中的每个文件都有一个优先级，从 0 到 255 的数字。优先级 0 表示文件不会被下载。`--partial` 标志位将指定的文件设置为优先级 1，其余文件设置为 0。

可以使用以下命令更改已添加 *包* 中的优先级：

- `priority-all <BagID> <priority>` - 对所有文件。
- `priority-idx <BagID> <idx> <priority>` - 根据数字为单个文件设置（见 `get` 命令）。
- `priority-name <BagID> <name> <priority>` - 根据名称为单个文件设置。
  即使在文件列表下载之前，也可以设置优先级。

## 创建文件包

要创建 *包* 并开始分发它，请使用 `create` 命令：

```
create <path>
```

`<path>` 可以指向单个文件或目录。创建 *包* 时，您可以指定描述：

```
create <path> -d "Bag of Files description"
```

创建 *包* 后，控制台将显示有关它的详细信息（包括哈希，即通过该哈希标识 *包* 的 `BagID`），并且守护程序将开始分发种子。`create` 的额外选项：

- `--no-upload` - 守护程序不会向对方节点分发文件。可以使用 `upload-resume` 启动上传。
- `--copy` - 文件将被复制到存储守护程序的内部目录中。

要下载 *包*，其他用户只需知道其哈希即可。您还可以保存种子元文件：

```
get-meta <BagID> <meta-file>
```



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-faq.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-faq.md
================================================
# TON存储常见问题解答

## 如何将TON域名分配给TON存储的文件包

1. [上传](/participate/ton-storage/storage-daemon#creating-a-bag-of-files)文件包到网络并获取Bag ID。

2. 在您的电脑上打开Google Chrome浏览器。

3. 为Google Chrome安装[TON扩展](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)。
   您也可以使用[MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc)。

4. 打开扩展，点击“导入钱包”，使用恢复短语导入拥有该域名的钱包。

5. 现在在https://dns.ton.org打开您的域名并点击“编辑”。

6. 将您的Bag ID复制到“存储”字段并点击“保存”。

## 如何在TON存储中托管静态TON网站

1. [创建](/participate/ton-storage/storage-daemon#creating-a-bag-of-files)一个文件夹的包，其中包含网站文件，将其上传到网络并获取Bag ID。文件夹必须包含`index.html`文件。

2. 在您的电脑上打开Google Chrome浏览器。

3. 为Google Chrome安装[TON扩展](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)。
   您也可以使用[MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc)。

4. 打开扩展，点击“导入钱包”，使用恢复短语导入拥有该域名的钱包。

5. 现在在https://dns.ton.org打开您的域名并点击“编辑”。

6. 将您的Bag ID复制到“网站”字段，选中“在TON存储中托管”复选框并点击“保存”。

## 如何将TON NFT内容迁移到TON存储

如果您为您的收藏使用了[标准NFT智能合约](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection-editable.fc)，您需要从收藏所有者的钱包向收藏智能合约发送[消息](https://github.com/ton-blockchain/token-contract/blob/2d411595a4f25fba43997a2e140a203c140c728a/nft/nft-collection-editable.fc#L132)，带有新的URL前缀。

例如，如果URL前缀曾经是`https://mysite/my_collection/`，新前缀将是`tonstorage://my_bag_id/`。

## 如何将TON域名分配给TON存储的文件包（低层级）

您需要将以下值分配给TON域的sha256("storage") DNS记录：

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

## 如何在TON存储中托管静态TON网站（低层级）

[创建](/participate/ton-storage/storage-daemon#creating-a-bag-of-files)一个文件夹的包，其中包含网站文件，将其上传到网络并获取Bag ID。文件夹必须包含`index.html`文件。

您需要将以下值分配给您TON域的 sha256("site") DNS 记录：

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-provider.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-provider.md
================================================
# 存储提供商

*存储提供商*是一项服务，用于收费存储文件。

## 二进制文件

您可以从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载适用于Linux/Windows/MacOS的`storage-daemon`和`storage-daemon-cli`二进制文件。

## 从源代码编译

您可以使用此[说明](/develop/howto/compile#storage-daemon)从源代码编译`storage-daemon`和`storage-damon-cli`。

## 关键概念

它由一个智能合约组成，该合约接受存储请求并管理来自客户的支付，以及一个上传和向客户提供文件的应用程序。以下是它的工作原理：

1. 提供商的所有者启动`storage-daemon`，部署主智能合约，并设置参数。合约的地址与潜在客户共享。
2. 使用`storage-daemon`，客户端创建一个包含其文件的包并向提供商的智能合约发送特殊的内部消息。
3. 提供商的智能合约创建一个存储合约来处理这个特定包。
4. 提供商在区块链中找到请求后，下载包并激活存储合约。
5. 客户端可以向存储合约转账支付存储费用。为了接收支付，提供商定期向合约提供证明，证明他们仍在存储该包。
6. 如果存储合约上的资金用尽，合约将被视为非活动状态，提供商不再需要存储该包。客户端可以重新填充合约或检索其文件。

:::info
客户端也可以随时通过向存储合约提供所有权证明来检索其文件。合约随后将文件释放给客户端并停用自身。
:::

## 智能合约

[智能合约源代码](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont)。

## 客户使用提供商

要使用存储提供商，您需要知道其智能合约的地址。客户端可以使用`storage-daemon-cli`中的以下命令获取提供商的参数：

```
get-provider-params <address>
```

### 提供商的参数：

- 是否接受新的存储合约。
- 单个包的最小和最大大小（以字节为单位）。
- 价格 - 存储费用。以每天每兆字节nanoTON计。
- 最大间隔 - 提供商应该多久提交一次包存储证明。

### 存储请求

您需要创建一个包并生成以下命令的消息：

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### 信息：

执行此命令可能需要一些时间来处理大型包。消息正文将保存到`<file>`（不是整个内部消息）。查询ID可以是0到`2^64-1`的任何数字。消息包含提供商的参数（价格和最大间隔）。这些参数将在执行命令后打印出来，因此应在发送前进行双重检查。如果提供商的所有者更改参数，消息将被拒绝，因此新存储合约的条件将完全符合客户的预期。

然后，客户端必须将带有此 body 的消息发送到提供商的地址。如果出现错误，消息将返回给发件人（弹回）。否则，将创建一个新的存储合约，客户端将收到来自它的消息，其中包含[`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3)和相同的查询ID。

此时，合约尚未激活。一旦提供商下载了包，它将激活存储合约，客户端将收到来自存储合约的[`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4)消息。

存储合约有一个“客户端余额” - 这是客户端转移给合约的资金，尚未支付给提供商。资金以每天每兆字节的速率逐渐从此余额中扣除。初始余额是客户端随创建存储合约的请求一起转移的金额。然后，客户端可以通过对存储合约进行简单转账来补充余额（可以从任何地址进行）。剩余客户端余额可通过[`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) get方法返回，作为第二个值（`balance`）。

### 合约可能因以下情况关闭：

:::info
如果存储合约关闭，客户端将收到带有剩余余额的消息和[`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6)。
:::

- 在创建后立即，激活前，如果提供商拒绝接受合约（提供商的限额超出或其他错误）。
- 客户端余额降至0。
- 提供商可以自愿关闭合约。
- 客户端可以通过从其地址发送带有[`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2)的消息和任何查询ID来自愿关闭合约。

## 运行和配置提供商

存储提供商是`storage-daemon`的一部分，并由`storage-daemon-cli`管理。需要以`-P`标志启动`storage-daemon`。

### 创建主智能合约

您可以在`storage-daemon-cli`中执行此操作：

```
deploy-provider
```

:::info 重要！
您将被要求向指定地址发送1 TON的不可弹回消息以初始化提供商。您可以使用`get-provider-info`命令检查合约是否已创建。
:::

默认情况下，合约设置为不接受新的存储合约。在激活它之前，您需要配置提供商。提供商的设置由配置（存储在`storage-daemon`中）和合约参数（存储在区块链中）组成。

### 配置：

- `max contracts` - 同时可以存在的最大存储合约数量。
- `max total size` - 存储合约中*包*的最大总大小。
  您可以使用`get-provider-info`查看配置值，并使用以下命令更改它们：

```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### 合约参数：

- `accept` - 是否接受新的存储合约。
- `max file size`、`min file size` - 单个*包*的大小限制。
- `rate` - 存储成本（以每天每兆字节nanoTON计）。
- `max span` - 提供商将不得不提交存储证明的频率。

您可以使用`get-provider-info`查看参数，并使用以下命令更改它们：

```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

### 值得注意的是

注意：在`set-provider-params`命令中，您可以仅指定部分参数。其他参数将从当前参数中获取。由于区块链中的数据不是立即更新的，因此连续几个`set-provider-params`命令可能导致意外结果。

建议最初在提供商的余额上放置超过1 TON，以便有足够的资金支付与存储合约相关的手续费。但不要在第一个不可反弹消息中发送太多TON。

在将`accept`参数设置为`1`后，智能合约将开始接受客户端的请求并创建存储合约，同时存储守护程序将自动处理它们：下载和分发*包*，生成存储证明。

## 进一步使用提供商

### 现有存储合约列表

```
get-provider-info --contracts --balances
```

每个存储合约的`Client$`和`Contract$`余额都列出来了；差额可以通过`withdraw <address>`命令提取到主提供商合约。

命令`withdraw-all`将从所有至少有`1 TON`可用的合约中提取资金。

可以使用`close-contract <address>`命令关闭任何存储合约。这也将把资金转移到主合约。当客户端余额耗尽时，也会自动发生这种情况。这种情况下，*包*文件将被删除（除非有其他合约使用相同的*包*）。

### 转账

您可以将资金从主智能合约转移到任何地址（金额以nanoTON指定）：

```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
提供商存储的所有*包*都可以通过命令`list`获得，并且可以像往常一样使用。为避免干扰提供商的运营，请不要删除它们或使用此存储守护程序处理任何其他*包*。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/features.js
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/features.js
================================================
export const firstRow = [
  {
    title: "什么是TON?",
    linkUrl: "/learn/introduction",
    imageUrl: "img/mainPageCards/what_is_ton.svg",
    description: "了解区块链和TON的基础知识以及如何入门。"
  },
  {
    title: "开发",
    linkUrl: "/develop/overview",
    imageUrl: "img/mainPageCards/developer.svg",
    description: "使用TON构建智能合约、web应用或者机器人。"
  },
  {
    title: "参与",
    linkUrl: "/participate/",
    imageUrl: "img/mainPageCards/participate.svg",
    description: "通过质押、运行节点或者成为验证者参与TON!"
  },
];




================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/index.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/index.module.css
================================================
/**
 * CSS files with the .module.css suffix will be treated as CSS modules
 * and scoped locally.
 */

.heroBanner {
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

@media screen and (max-width: 996px) {
  .heroBanner {
    padding: 2rem;
  }
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/index.tsx
================================================
import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import {firstRow} from "./features";
import ContentBlock from "../../../src/components/contentBlock";
import './index.module.css'

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={"Start"}
      description={
        "Learn about the basics of blockchain and TON and how to get started. TON is blockchain of blockchains with a masterchain to rule them all. You can learn more about general architecture in Basic Concepts section."
      }
    >
      <div className="bootstrap-wrapper">
        <br />
        <h1
          style={{ fontWeight: "650", textAlign: "center", padding: "0 10px" }}
        >
          <span>
            欢迎来到 <br /> TON区块链文档
          </span>{" "}
          <span className="mobile-view">
            欢迎来到 <br /> TON区块链文档
          </span>
        </h1>
        <p style={{ textAlign: "center", fontWeight: "400", fontSize: "18px" }}>
          选择你的路径开始旅程
        </p>

        <div className="container">
          <div id="Get Started" className="row">
            {firstRow &&
              firstRow.length &&
              firstRow.map((props, idx) => (
                <ContentBlock key={idx} {...props} />
              ))}{" "}
          </div>

          <br />
          <p
            style={{
              fontWeight: "300",
              textAlign: "center",
              padding: "10px 0",
              fontSize: "16px",
            }}
          >
            提示：使用<code>Ctrl+K</code>快捷键在任何地方进行搜索
          </p>
        </div>
      </div>
    </Layout>
  );
}



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/archive/tvm-instructions.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/archive/tvm-instructions.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { opcodes } from '@site/src/data/opcodes';

# TVM 指令

:::caution advanced level
此信息是**非常底层的**，对于新手来讲可能很难理解。
:::

## 介绍
本文档提供了TVM指令的列表，包括它们的操作码和助记符。

:::info
[**TVM.pdf**](https://ton.org/tvm.pdf) 最初概念 TON 虚拟机（可能包含过时的信息）。
:::

Fift 是一种基于栈的编程语言，旨在管理 TON 智能合约。Fift 汇编器是一个能够将 TVM 指令的助记符转换为它们的二进制表示形式的 Fift 库。

关于 Fift 的描述，包括介绍 Fift 汇编器，可在[此处](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md)找到。

本文档为每个指令指定了对应的助记符。

请注意以下几点：

1. Fift 是一种基于栈的语言，因此任何指令的所有参数都写在它之前（例如，[`5 PUSHINT`](#instr-pushint-4)，[`s0 s4 XCHG`](#instr-xchg-ij)）。
2. 栈寄存器由 `s0, s1, ..., s15` 表示。其他栈寄存器（最多255个）由 `i s()` 表示（例如，`100 s()`）。
3. 控制寄存器由 `c0, c1, ..., c15` 表示。

### Gas 价格

本文档中指定了每个指令的 gas 价格。一个指令的基本 gas 价格是 `10 + b`，其中 `b` 是指令长度（以位为单位）。某些操作有附加费用：
1. _解析cell_：将一个cell转换成一个片段的成本是 **100 gas 单位**，如果是在同一交易中首次加载该cell，则为 **25**。对于此类指令，会指定两个 gas 价格（例如，[`CTOS`](#instr-ctos): `118/43`）。
2. _cell创建_：**500 gas 单位**。
3. _抛出异常_：**50 gas 单位**。在本文档中，仅对其主要用途为抛出异常的指令指定异常费（例如，[`THROWIF`](#instr-throwif-short)，[`FITS`](#instr-fits)）。如果指令在某些情况下只抛出异常，则会指定两个 gas 价格（例如，[`FITS`](#instr-fits): `26/76`）。
4. _元组创建_：每个元组元素 **1 gas 单位**。
5. _隐式跳转_：对于一个隐式跳转，**10 gas 单位**；对于隐式后跳，**5 gas 单位**。这项费用不属于任何指令的一部分。
6. _在continuations之间移动栈元素_：每个元素 **1 gas 单位**，但是移动前32个元素是免费的。

### 快速搜索

:::info

一份完整的机器可读的 TVM 指令列表可在[此处](https://github.com/ton-community/ton-docs/blob/main/docs/learn/tvm-instructions/instructions.csv)获取。
:::

随意使用下面的搜索字段来查找特定的指令：

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

## 2 堆栈操作原语

这里 `0 <= i,j,k <= 15` 除非另有说明。

### 2.1 基本堆栈操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`00`** | `NOP` | _`-`_ | 无操作。 | `18` |
| **`01`** | `SWAP` | _`x y - y x`_ | 等同于 [`s1 XCHG0`](#instr-xchg-0i)。 | `18` |
| **`0i`** | `s[i] XCHG0` |  | 交换 `s0` 与 `s[i]`，`1 <= i <= 15`。 | `18` |
| **`10ij`** | `s[i] s[j] XCHG` |  | 交换 `s[i]` 与 `s[j]`，`1 <= i < j <= 15`。 | `26` |
| **`11ii`** | `s0 [ii] s() XCHG` |  | 交换 `s0` 与 `s[ii]`，`0 <= ii <= 255`。 | `26` |
| **`1i`** | `s1 s[i] XCHG` |  | 交换 `s1` 与 `s[i]`，`2 <= i <= 15`。 | `18` |
| **`2i`** | `s[i] PUSH` |  | 将旧的 `s[i]` 的一个副本推入堆栈。 | `18` |
| **`20`** | `DUP` | _`x - x x`_ | 等同于 [`s0 PUSH`](#instr-push)。 | `18` |
| **`21`** | `OVER` | _`x y - x y x`_ | 等同于 [`s1 PUSH`](#instr-push)。 | `18` |
| **`3i`** | `s[i] POP` |  | 将旧的 `s0` 值弹出到旧的 `s[i]` 中。等同于 [`s[i] XCHG0`](#instr-xchg-0i) [`DROP`](#instr-drop) | `18` |
| **`30`** | `DROP` | _`x -`_ | 等同于 [`s0 POP`](#instr-pop)，丢弃堆栈顶部值。 | `18` |
| **`31`** | `NIP` | _`x y - y`_ | 等同于 [`s1 POP`](#instr-pop)。 | `18` |
### 2.2 复杂堆栈操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`4ijk`** | `s[i] s[j] s[k] XCHG3` |  | 等同于 [`s2 s[i] XCHG`](#instr-xchg-ij) [`s1 s[j] XCHG`](#instr-xchg-ij) [`s[k] XCHG0`](#instr-xchg-0i)。 | `26` |
| **`50ij`** | `s[i] s[j] XCHG2` |  | 等同于 [`s1 s[i] XCHG`](#instr-xchg-ij) [`s[j] XCHG0`](#instr-xchg-0i)。 | `26` |
| **`51ij`** | `s[i] s[j] XCPU` |  | 等同于 [`s[i] XCHG0`](#instr-xchg-0i) [`s[j] PUSH`](#instr-push)。 | `26` |
| **`52ij`** | `s[i] s[j-1] PUXC` |  | 等同于 [`s[i] PUSH`](#instr-push) [`SWAP`](#instr-swap) [`s[j] XCHG0`](#instr-xchg-0i)。 | `26` |
| **`53ij`** | `s[i] s[j] PUSH2` |  | 等同于 [`s[i] PUSH`](#instr-push) [`s[j+1] PUSH`](#instr-push)。 | `26` |
| **`540ijk`** | `s[i] s[j] s[k] XCHG3_l` |  | [`XCHG3`](#instr-xchg3) 的长格式。 | `34` |
| 541ijk | `s[i] s[j] s[k] XC2PU` |  | 等同于 [`s[i] s[j] XCHG2`](#instr-xchg2) [`s[k] PUSH`](#instr-push)。 | `34` |
| **`542ijk`** | `s[i] s[j] s[k-1] XCPUXC` |  | 等同于 [`s1 s[i] XCHG`](#instr-xchg-ij) [`s[j] s[k-1] PUXC`](#instr-puxc)。 | `34` |
| **`543ijk`** | `s[i] s[j] s[k] XCPU2` |  | 等同于 [`s[i] XCHG0`](#instr-xchg-0i) [`s[j] s[k] PUSH2`](#instr-push2)。 | `34` |
| **`544ijk`** | `s[i] s[j-1] s[k-1] PUXC2` |  | 等同于 [`s[i] PUSH`](#instr-push) [`s2 XCHG0`](#instr-xchg-0i) [`s[j] s[k] XCHG2`](#instr-xchg2)。 | `34` |
| **`545ijk`** | `s[i] s[j-1] s[k-1] PUXCPU` |  | 等同于 [`s[i] s[j-1] PUXC`](#instr-puxc) [`s[k] PUSH`](#instr-push)。 | `34` |
| **`546ijk`** | `s[i] s[j-1] s[k-2] PU2XC` |  | 等同于 [`s[i] PUSH`](#instr-push) [`SWAP`](#instr-swap) [`s[j] s[k-1] PUXC`](#instr-puxc)。 | `34` |
| **`547ijk`** | `s[i] s[j] s[k] PUSH3` |  | 等同于 [`s[i] PUSH`](#instr-push) [`s[j+1] s[k+1] PUSH2`](#instr-push2)。 | `34` |
| **`55ij`** | `[i+1] [j+1] BLKSWAP` |  | 交换两个块 `s[j+i+1] … s[j+1]` 和 `s[j] … s0`。<br/> `0 <= i,j <= 15`<br/>等同于 [`[i+1] [j+1] REVERSE`](#instr-reverse) [`[j+1] 0 REVERSE`](#instr-reverse) [`[i+j+2] 0 REVERSE`](#instr-reverse)。 | `26` |
| **`5513`** | `ROT2`<br/>`2ROT` | _`a b c d e f - c d e f a b`_ | 旋转三对堆栈最顶部的条目。 | `26` |
| **`550i`** | `[i+1] ROLL` |  | 旋转顶部 `i+1` 个堆栈条目。<br/>等同于 [`1 [i+1] BLKSWAP`](#instr-blkswap)。 | `26` |
| **`55i0`** | `[i+1] -ROLL`<br/>`[i+1] ROLLREV` |  | 以相反方向旋转顶部 `i+1` 个堆栈条目。<br/>等同于 [`[i+1] 1 BLKSWAP`](#instr-blkswap)。 | `26` |
| **`56ii`** | `[ii] s() PUSH` |  | 将旧的 `s[ii]` 的一个副本推入堆栈。<br/>`0 <= ii <= 255` | `26` |
| **`57ii`** | `[ii] s() POP` |  | 将旧的 `s0` 值弹出到旧的 `s[ii]` 中。<br/>`0 <= ii <= 255` | `26` |
| **`58`** | `ROT` | _`a b c - b c a`_ | 等同于 [`1 2 BLKSWAP`](#instr-blkswap) 或 [`s2 s1 XCHG2`](#instr-xchg2)。 | `18` |
| **`59`** | `ROTREV`<br/>`-ROT` | _`a b c - c a b`_ | 等同于 [`2 1 BLKSWAP`](#instr-blkswap) 或 [`s2 s2 XCHG2`](#instr-xchg2)。 | `18` |
| **`5A`** | `SWAP2`<br/>`2SWAP` | _`a b c d - c d a b`_ | 等同于 [`2 2 BLKSWAP`](#instr-blkswap) 或 [`s3 s2 XCHG2`](#instr-xchg2)。 | `18` |
| **`5B`** | `DROP2`<br/>`2DROP` | _`a b - `_ | 等同于两次执行 [`DROP`](#instr-drop)。 | `18` |
| **`5C`** | `DUP2`<br/>`2DUP` | _`a b - a b a b`_ | 等同于 [`s1 s0 PUSH2`](#instr-push2)。 | `18` |
| **`5D`** | `OVER2`<br/>`2OVER` | _`a b c d - a b c d a b`_ | 等同于 [`s3 s2 PUSH2`](#instr-push2)。 | `18` |
| **`5Eij`** | `[i+2] [j] REVERSE` |  | 反转 `s[j+i+1] … s[j]` 的顺序。 | `26` |
| **`5F0i`** | `[i] BLKDROP` |  | 执行 `i` 次 [`DROP`](#instr-drop)。 | `26` |
| **`5Fij`** | `[i] [j] BLKPUSH` |  | 执行 `i` 次 `PUSH s(j)`。<br/>`1 <= i <= 15`, `0 <= j <= 15`。 | `26` |
| **`60`** | `PICK`<br/>`PUSHX` |  | 从堆栈弹出整数 `i`，然后执行 [`s[i] PUSH`](#instr-push)。 | `18` |
| **`61`** | `ROLLX` |  | 从堆栈弹出整数 `i`，然后执行 [`1 [i] BLKSWAP`](#instr-blkswap)。 | `18` |
| **`62`** | `-ROLLX`<br/>`ROLLREVX` |  | 从堆栈弹出整数 `i`，然后执行 [`[i] 1 BLKSWAP`](#instr-blkswap)。 | `18` |
| **`63`** | `BLKSWX` |  | 从堆栈弹出整数 `i`、`j`，然后执行 [`[i] [j] BLKSWAP`](#instr-blkswap)。 | `18` |
| **`64`** | `REVX` |  | 从堆栈弹出整数 `i`、`j`，然后执行 [`[i] [j] REVERSE`](#instr-reverse)。 | `18` |
| **`65`** | `DROPX` |  | 从堆栈弹出整数 `i`，然后执行 [`[i] BLKDROP`](#instr-blkdrop)。 | `18` |
| **`66`** | `TUCK` | _`a b - b a b`_ | 等同于 [`SWAP`](#instr-swap) [`OVER`](#instr-over) 或 [`s1 s1 XCPU`](#instr-xcpu)。 | `18` |
| **`67`** | `XCHGX` |  | 从堆栈弹出整数 `i`，然后执行 [`s[i] XCHG`](#instr-xchg-ij)。 | `18` |
| **`68`** | `DEPTH` | _`- depth`_ | 推入当前堆栈深度。 | `18` |
| **`69`** | `CHKDEPTH` | _`i -`_ | 从堆栈弹出整数 `i`，然后检查是否至少有 `i` 个元素，否则生成堆栈下溢异常。 | `18/58` |
| **`6A`** | `ONLYTOPX` |  | 从堆栈弹出整数 `i`，然后移除除顶部 `i` 个元素之外的所有元素。 | `18` |
| **`6B`** | `ONLYX` |  | 从堆栈弹出整数 `i`，然后仅保留底部 `i` 个元素。大致等同于 [`DEPTH`](#instr-depth) [`SWAP`](#instr-swap) [`SUB`](#instr-sub) [`DROPX`](#instr-dropx)。 | `18` |
| **`6Cij`** | `[i] [j] BLKDROP2` |  | 在顶部 `j` 个元素下方丢弃 `i` 个堆栈元素。<br/>`1 <= i <= 15`, `0 <= j <= 15`<br/>等同于 [`[i+j] 0 REVERSE`](#instr-reverse) [`[i] BLKDROP`](#instr-blkdrop) [`[j] 0 REVERSE`](#instr-reverse)。 | `26` |

## 3 元组、列表和 Null 原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`6D`** | `NULL`<br/>`PUSHNULL` | _` - null`_ | 推入类型为 _Null_ 的唯一值。 | `18` |
| **`6E`** | `ISNULL` | _`x - ?`_ | 检查 `x` 是否为 _Null_，根据情况分别返回 `-1` 或 `0`。 | `18` |
| **`6F0n`** | `[n] TUPLE` | _`x_1 ... x_n - t`_ | 创建包含 `n` 值 `x_1`,..., `x_n` 的新 _Tuple_ `t=(x_1, … ,x_n)`。<br/>`0 <= n <= 15` | `26+n` |
| **`6F00`** | `NIL` | _`- t`_ | 推入长度为零的唯一 _Tuple_ `t=()`。 | `26` |
| **`6F01`** | `SINGLE` | _`x - t`_ | 创建单例 `t:=(x)`，即长度为一的 _Tuple_。 | `27` |
| **`6F02`** | `PAIR`<br/>`CONS` | _`x y - t`_ | 创建对 `t:=(x,y)`。 | `28` |
| **`6F03`** | `TRIPLE` | _`x y z - t`_ | 创建三元组 `t:=(x,y,z)`。 | `29` |
| **`6F1k`** | `[k] INDEX` | _`t - x`_ | 返回 _Tuple_ `t` 的第 `k` 个元素。<br/>`0 <= k <= 15`。 | `26` |
| **`6F10`** | `FIRST`<br/>`CAR` | _`t - x`_ | 返回 _Tuple_ 的第一个元素。 | `26` |
| **`6F11`** | `SECOND`<br/>`CDR` | _`t - y`_ | 返回 _Tuple_ 的第二个元素。 | `26` |
| **`6F12`** | `THIRD` | _`t - z`_ | 返回 _Tuple_ 的第三个元素。 | `26` |
| **`6F2n`** | `[n] UNTUPLE` | _`t - x_1 ... x_n`_ | 解包长度等于 `0 <= n <= 15` 的 _Tuple_ `t=(x_1,...,x_n)`。<br/>如果 `t` 不是 _Tuple_ 或 `\|t\| != n`，则抛出类型检查异常。 | `26+n` |
| **`6F21`** | `UNSINGLE` | _`t - x`_ | 解包单例 `t=(x)`。 | `27` |
| **`6F22`** | `UNPAIR`<br/>`UNCONS` | _`t - x y`_ | 解包对 `t=(x,y)`。 | `28` |
| **`6F23`** | `UNTRIPLE` | _`t - x y z`_ | 解包三元组 `t=(x,y,z)`。 | `29` |
| **`6F3k`** | `[k] UNPACKFIRST` | _`t - x_1 ... x_k`_ | 解包 _Tuple_ `t` 的前 `0 <= k <= 15` 个元素。<br/>如果 `\|t\|<k`，抛出类型检查异常。 | `26+k` |
| **`6F30`** | `CHKTUPLE` | _`t -`_ | 检查 `t` 是否为 _Tuple_。如果不是，则抛出类型检查异常。 | `26` |
| **`6F4n`** | `[n] EXPLODE` | _`t - x_1 ... x_m m`_ | 解包 _Tuple_ `t=(x_1,...,x_m)` 并返回其长度 `m`，但仅当 `m <= n <= 15`。否则抛出类型检查异常。 | `26+m` |
| **`6F5k`** | `[k] SETINDEX` | _`t x - t'`_ | 计算 _Tuple_ `t'`，它与 `t` 仅在位置 `t'_{k+1}` 上不同，该位置被设置为 `x`。<br/>`0 <= k <= 15`<br/>如果 `k >= \|t\|`，则抛出范围检查异常。 | `26+\|t\|` |
| **`6F50`** | `SETFIRST` | _`t x - t'`_ | 将 _Tuple_ `t` 的第一个组件设置为 `x` 并返回结果 _Tuple_ `t'`。 | `26+\|t\|` |
| **`6F51`** | `SETSECOND` | _`t x - t'`_ | 将 _Tuple_ `t` 的第二个组件设置为 `x` 并返回结果 _Tuple_ `t'`。 | `26+\|t\|` |
| **`6F52`** | `SETTHIRD` | _`t x - t'`_ | 将 _Tuple_ `t` 的第三个组件设置为 `x` 并返回结果 _Tuple_ `t'`。 | `26+\|t\|` |
| **`6F6k`** | `[k] INDEXQ` | _`t - x`_ | 返回 _Tuple_ `t` 的第 `k` 个元素，其中 `0 <= k <= 15`。换句话说，如果 `t=(x_1,...,x_n)`，则返回 `x_{k+1}`。如果 `k>=n` 或 `t` 为 _Null_，则返回 _Null_ 而不是 `x`。 | `26` |
| **`6F60`** | `FIRSTQ`<br/>`CARQ` | _`t - x`_ | 返回 _Tuple_ 的第一个元素。 | `26` |
| **`6F61`** | `SECONDQ`<br/>`CDRQ` | _`t - y`_ | 返回 _Tuple_ 的第二个元素。 | `26` |
| **`6F62`** | `THIRDQ` | _`t - z`_ | 返回 _Tuple_ 的第三个元素。 | `26` |
| **`6F7k`** | `[k] SETINDEXQ` | _`t x - t'`_ | 在 _Tuple_ `t` 中设置第 `k` 个组件为 `x`，其中 `0 <= k < 16`，并返回结果 _Tuple_ `t'`。<br/>如果 `\|t\| <= k`，首先通过将所有新组件设置为 _Null_ 来将原始 _Tuple_ 扩展到长度 `n’=k+1`。如果原始值 `t` 为 _Null_，则将其视为空 _Tuple_。如果 `t` 既不是 _Null_ 也不是 _Tuple_，抛出异常。如果 `x` 为 _Null_ 且 `\|t\| <= k` 或 `t` 为 _Null_，则总是返回 `t'=t`（并且不消耗元组创建 gas）。 | `26+\|t’\|` |
| **`6F70`** | `SETFIRSTQ` | _`t x - t'`_ | 将 _Tuple_ `t` 的第一个组件设置为 `x` 并返回结果 _元组_ `t'`。 | `26+\|t’\|` |
| **`6F71`** | `SETSECONDQ` | _`t x - t'`_ | 将 _Tuple_ `t` 的第二个组件设置为 `x` 并返回结果 _元组_ `t'`。 | `26+\|t’\|` |
| **`6F72`** | `SETTHIRDQ` | _`t x - t'`_ | 将 _Tuple组_ `t` 的第三个组件设置为 `x` 并返回结果 _元组_ `t'`。 | `26+\|t’\|` |
| **`6F80`** | `TUPLEVAR` | _`x_1 ... x_n n - t`_ | 以类似于 [`TUPLE`](#instr-tuple) 的方式创建长度为 `n` 的新 _Tuple_ `t`，但 `0 <= n <= 255` 从堆栈获取。 | `26+n` |
| **`6F81`** | `INDEXVAR` | _`t k - x`_ | 类似于 [`k INDEX`](#instr-index)，但 `0 <= k <= 254` 从堆栈获取。 | `26` |
| **`6F82`** | `UNTUPLEVAR` | _`t n - x_1 ... x_n`_ | 类似于 [`n UNTUPLE`](#instr-untuple)，但 `0 <= n <= 255` 从堆栈获取。 | `26+n` |
| **`6F83`** | `UNPACKFIRSTVAR` | _`t n - x_1 ... x_n`_ | 类似于 [`n UNPACKFIRST`](#instr-unpackfirst)，但 `0 <= n <= 255` 从堆栈获取。 | `26+n` |
| **`6F84`** | `EXPLODEVAR` | _`t n - x_1 ... x_m m`_ | 类似于 [`n EXPLODE`](#instr-explode)，但 `0 <= n <= 255` 从堆栈获取。 | `26+m` |
| **`6F85`** | `SETINDEXVAR` | _`t x k - t'`_ | 类似于 [`k SETINDEX`](#instr-setindex)，但 `0 <= k <= 254` 从堆栈获取。 | `26+\|t’\|` |
| **`6F86`** | `INDEXVARQ` | _`t k - x`_ | 类似于 [`n INDEXQ`](#instr-indexq)，但 `0 <= k <= 254` 从堆栈获取。 | `26` |
| **`6F87`** | `SETINDEXVARQ` | _`t x k - t'`_ | 类似于 [`k SETINDEXQ`](#instr-setindexq)，但 `0 <= k <= 254` 从堆栈获取。 | `26+\|t’\|` |
| **`6F88`** | `TLEN` | _`t - n`_ | 返回 _Tuple_ 的长度。 | `26` |
| **`6F89`** | `QTLEN` | _`t - n or -1`_ | 类似于 [`TLEN`](#instr-tlen)，但如果 `t` 不是 _Tuple_，则返回 `-1`。 | `26` |
| **`6F8A`** | `ISTUPLE` | _`t - ?`_ | 根据 `t` 是否为 _Tuple_，分别返回 `-1` 或 `0`。 | `26` |
| **`6F8B`** | `LAST` | _`t - x`_ | 返回非空 _Tuple_ `t` 的最后一个元素。 | `26` |
| **`6F8C`** | `TPUSH`<br/>`COMMA` | _`t x - t'`_ | 将值 `x` 附加到 _Tuple_ `t=(x_1,...,x_n)`，但仅当结果 _Tuple_ `t'=(x_1,...,x_n,x)` 的长度最多为 255 时。否则抛出类型检查异常。 | `26+\|t’\|` |
| **`6F8D`** | `TPOP` | _`t - t' x`_ | 从非空 _Tuple_ `t=(x_1,...,x_n)` 分离最后一个元素 `x=x_n`，并返回结果 _Tuple_ `t'=(x_1,...,x_{n-1})` 和原始的最后一个元素 `x`。 | `26+\|t’\|` |
| **`6FA0`** | `NULLSWAPIF` | _`x - x or null x`_ | 在顶部的 _Integer_ `x` 下推入一个 _Null_，但仅当 `x!=0` 时。 | `26` |
| **`6FA1`** | `NULLSWAPIFNOT` | _`x - x or null x`_ | 在顶部的 _Integer_ `x` 下推入一个 _Null_，但仅当 `x=0` 时。可用于在类似于 [`PLDUXQ`](#instr-plduxq) 这样的静默原语后进行堆栈对齐。 | `26` |
| **`6FA2`** | `NULLROTRIF` | _`x y - x y or null x y`_ | 在顶部第二个堆栈条目下推入一个 _Null_，但仅当顶部的 _Integer_ `y` 非零时。 | `26` |
| **`6FA3`** | `NULLROTRIFNOT` | _`x y - x y or null x y`_ | 在顶部第二个堆栈条目下推入一个 _Null_，但仅当顶部的 _Integer_ `y` 为零时。可用于在类似于 [`LDUXQ`](#instr-lduxq) 这样的静默原语后进行堆栈对齐。 | `26` |
| **`6FA4`** | `NULLSWAPIF2` | _`x - x or null null x`_ | 在顶部的 _Integer_ `x` 下推入两个 _Null_，但仅当 `x!=0` 时。<br/>等同于 [`NULLSWAPIF`](#instr-nullswapif) [`NULLSWAPIF`](#instr-nullswapif)。 | `26` |
| **`6FA5`** | `NULLSWAPIFNOT2` | _`x - x or null null x`_ | 在顶部的 _Integer_ `x` 下推入两个 _Null_，但仅当 `x=0` 时。<br/>等同于 [`NULLSWAPIFNOT`](#instr-nullswapifnot) [`NULLSWAPIFNOT`](#instr-nullswapifnot)。 | `26` |
| **`6FA6`** | `NULLROTRIF2` | _`x y - x y or null null x y`_ | 在顶部第二个堆栈条目下推入两个 _Null_，但仅当顶部的 _Integer_ `y` 非零时。<br/>等同于 [`NULLROTRIF`](#instr-nullrotrif) [`NULLROTRIF`](#instr-nullrotrif)。 | `26` |
| **`6FA7`** | `NULLROTRIFNOT2` | _`x y - x y 或 null null x y`_ | 仅当最顶部的 _Integer_ `y` 为零时，才在顶部第二个堆栈条目下推入两个 _Null_。<br/>等同于两次 [`NULLROTRIFNOT`](#instr-nullrotrifnot)。 | `26` |
| **`6FBij`** | `[i] [j] INDEX2` | _`t - x`_ | 对于 `0 <= i,j <= 3`，恢复 `x=(t_{i+1})_{j+1}`。<br/>等同于 [`[i] INDEX`](#instr-index) [`[j] INDEX`](#instr-index)。 | `26` |
| **`6FB4`** | `CADR` | _`t - x`_ | 恢复 `x=(t_2)_1`。 | `26` |
| **`6FB5`** | `CDDR` | _`t - x`_ | 恢复 `x=(t_2)_2`。 | `26` |
| **`6FE_ijk`** | `[i] [j] [k] INDEX3` | _`t - x`_ | 恢复 `x=t_{i+1}_{j+1}_{k+1}`。<br/>`0 <= i,j,k <= 3`<br/>等同于 [`[i] [j] INDEX2`](#instr-index2) [`[k] INDEX`](#instr-index)。 | `26` |
| **`6FD4`** | `CADDR` | _`t - x`_ | 恢复 `x=t_2_2_1`。 | `26` |
| **`6FD5`** | `CDDDR` | _`t - x`_ | 恢复 `x=t_2_2_2`。 | `26` |

## 4 常量或字面量原语
### 4.1 整数和布尔常量
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`7i`** | `[x] PUSHINT`<br/>`[x] INT` | _`- x`_ | 将整数 `x` 压入栈。`-5 <= x <= 10`。<br/>这里的 `i` 等于 `x` 的四个低阶位 (`i=x mod 16`)。 | `18` |
| **`70`** | `ZERO`<br/>`FALSE` | _`- 0`_ |  | `18` |
| **`71`** | `ONE` | _`- 1`_ |  | `18` |
| **`72`** | `TWO` | _`- 2`_ |  | `18` |
| **`7A`** | `TEN` | _`- 10`_ |  | `18` |
| **`7F`** | `TRUE` | _`- -1`_ |  | `18` |
| **`80xx`** | `[xx] PUSHINT`<br/>`[xx] INT` | _`- xx`_ | 将整数 `xx` 压入栈。`-128 <= xx <= 127`。 | `26` |
| **`81xxxx`** | `[xxxx] PUSHINT`<br/>`[xxxx] INT` | _`- xxxx`_ | 将整数 `xxxx` 压入栈。`-2^15 <= xx < 2^15`。 | `34` |
| **`82lxxx`** | `[xxx] PUSHINT`<br/>`[xxx] INT` | _`- xxx`_ | 将整数 `xxx` 压入栈。<br/>_细节:_ 5位的 `0 <= l <= 30` 决定了有符号大端整数 `xxx` 的长度 `n=8l+19`。<br/>此指令的总长度为 `l+4` 字节或 `n+13=8l+32` 位。 | `23` |
| **`83xx`** | `[xx+1] PUSHPOW2` | _`- 2^(xx+1)`_ | （静默地）推送 `2^(xx+1)`，对于 `0 <= xx <= 255`。<br/>`2^256` 是一个 `NaN`。 | `26` |
| **`83FF`** | `PUSHNAN` | _`- NaN`_ | 推送一个 `NaN`。 | `26` |
| **`84xx`** | `[xx+1] PUSHPOW2DEC` | _`- 2^(xx+1)-1`_ | 推送 `2^(xx+1)-1`，对于 `0 <= xx <= 255`。 | `26` |
| **`85xx`** | `[xx+1] PUSHNEGPOW2` | _`- -2^(xx+1)`_ | 推送 `-2^(xx+1)`，对于 `0 <= xx <= 255`。 | `26` |
### 4.2 常量切片、continuation、cell和引用
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`88`** | `[ref] PUSHREF` | _`- c`_ | 将引用 `ref` 推送到栈中。<br/>_细节:_ 将 `cc.code` 的第一个引用作为 _cell_ 推入栈（并从当前continuation中移除此引用）。 | `18` |
| **`89`** | `[ref] PUSHREFSLICE` | _`- s`_ | 类似于 [`PUSHREF`](#instr-pushref)，但将cell转换为 _切片_。 | `118/43` |
| **`8A`** | `[ref] PUSHREFCONT` | _`- cont`_ | 类似于 [`PUSHREFSLICE`](#instr-pushrefslice)，但将cell制作成一个简单的普通 _continuation_。 | `118/43` |
| **`8Bxsss`** | `[slice] PUSHSLICE`<br/>`[slice] SLICE` | _`- s`_ | 将切片 `slice` 推入栈。<br/>_细节:_ 推送 `cc.code` 的 (前缀) 子切片，其由其前 `8x+4` 位和零个引用组成（即，基本上是一个位串），其中 `0 <= x <= 15`。<br/>假设有一个完成标记，意味着所有尾随零和最后一个二进制一（如果存在）都从这个位串中被移除。<br/>如果原始位串仅由零组成，则会推入一个空切片。 | `22` |
| **`8Crxxssss`** | `[slice] PUSHSLICE`<br/>`[slice] SLICE` | _`- s`_ | 将切片 `slice` 推入栈。<br/>_细节:_ 推送 `cc.code` 的 (前缀) 子切片，其由其前 `1 <= r+1 <= 4` 个引用和最多前 `8xx+1` 位数据组成，其中 `0 <= xx <= 31`。<br/>也假设有一个完成标记。 | `25` |
| **`8Drxxsssss`** | `[slice] PUSHSLICE`<br/>`[slice] SLICE` | _`- s`_ | 将切片 `slice` 推入栈。<br/>_细节:_ 推送 `cc.code` 的子切片，其由 `0 <= r <= 4` 个引用和最多 `8xx+6` 位数据组成，其中 `0 <= xx <= 127`。<br/>假设有一个完成标记。 | `28` |
|  | `x{} PUSHSLICE`<br/>`x{ABCD1234} PUSHSLICE`<br/>`b{01101} PUSHSLICE` | _`- s`_ | [`PUSHSLICE`](#instr-pushslice) 的示例。<br/>`x{}` 是一个空切片。`x{...}` 是一个十六进制字面量。`b{...}` 是一个二进制字面量。<br/>关于切片字面量的更多信息[在这里](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-51-slice-literals)。<br/>注意，汇编程序可以在某些情况下（例如，如果当前continuation中没有足够的空间）将 [`PUSHSLICE`](#instr-pushslice) 替换为 [`PUSHREFSLICE`](#instr-pushrefslice)。 |  |
|  | `<b x{AB12} s, b> PUSHREF`<br/>`<b x{AB12} s, b> PUSHREFSLICE` | _`- c/s`_ | [`PUSHREF`](#instr-pushref) 和 [`PUSHREFSLICE`](#instr-pushrefslice) 的示例。<br/>关于在 fift 中构建cell的更多信息[在这里](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-52-builder-primitives)。 |  |
| **`8F_rxxcccc`** | `[builder] PUSHCONT`<br/>`[builder] CONT` | _`- c`_ | 从 `builder` 中推送continuation。<br/>_细节:_ 推送由 `cc.code` 的前 `0 <= r <= 3` 个引用和前 `0 <= xx <= 127` 字节制成的简单普通continuation `cccc`。 | `26` |
| **`9xccc`** | `[builder] PUSHCONT`<br/>`[builder] CONT` | _`- c`_ | 从 `builder` 中推送continuation。<br/>_细节:_ 推送一个 `x` 字节的continuation，对于 `0 <= x <= 15`。 | `18` |
|  | `<{ code }> PUSHCONT`<br/>`<{ code }> CONT`<br/>`CONT:<{ code }>` | _`- c`_ | 用代码 `code` 推送continuation。<br/>注意，汇编程序可以在某些情况下（例如，如果当前continuation中没有足够的空间）将 [`PUSHCONT`](#instr-pushcont) 替换为 [`PUSHREFCONT`](#instr-pushrefcont)。 |  |

## 5 算术原语
### 5.1 加法、减法、乘法
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`A0`** | `ADD` | _`x y - x+y`_ |  | `18` |
| **`A1`** | `SUB` | _`x y - x-y`_ |  | `18` |
| **`A2`** | `SUBR` | _`x y - y-x`_ | 等同于 [`SWAP`](#instr-swap) [`SUB`](#instr-sub)。 | `18` |
| **`A3`** | `NEGATE` | _`x - -x`_ | 等同于 [`-1 MULCONST`](#instr-mulconst) 或 [`ZERO SUBR`](#instr-subr)。<br/>注意，如果 `x=-2^256` 时会触发整数溢出异常。 | `18` |
| **`A4`** | `INC` | _`x - x+1`_ | 等同于 [`1 ADDCONST`](#instr-addconst)。 | `18` |
| **`A5`** | `DEC` | _`x - x-1`_ | 等同于 [`-1 ADDCONST`](#instr-addconst)。 | `18` |
| **`A6cc`** | `[cc] ADDCONST`<br/>`[cc] ADDINT`<br/>`[-cc] SUBCONST`<br/>`[-cc] SUBINT` | _`x - x+cc`_ | `-128 <= cc <= 127`。 | `26` |
| **`A7cc`** | `[cc] MULCONST`<br/>`[cc] MULINT` | _`x - x*cc`_ | `-128 <= cc <= 127`。 | `26` |
| **`A8`** | `MUL` | _`x y - x*y`_ |  | `18` |
### 5.2 除法
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`A9mscdf`** |  |  | 这是除法的通用编码，可选进行预乘和用移位替换除法或乘法。变量字段如下：<br/>`0 <= m <= 1`  -  表示是否有预乘（[`MULDIV`](#instr-muldiv) 及其变体），可能被左移替换。<br/>`0 <= s <= 2`  -  表示乘法或除法中的哪一个被移位替换：`s=0` - 无替换，`s=1` - 除法被右移替换，`s=2` - 乘法被左移替换（仅当 `m=1` 时可能）。<br/>`0 <= c <= 1`  -  表示是否有移位操作符的一个字节常量参数 `tt`（如果 `s!=0`）。对于 `s=0`，`c=0`。如果 `c=1`，则 `0 <= tt <= 255`，并且移位由 `tt+1` 位执行。如果 `s!=0` 且 `c=0`，则移位量作为栈顶的 _整数_在 `0...256` 范围内提供。<br/>`1 <= d <= 3`  -  表示需要哪些除法结果：`1` - 仅商，`2` - 仅余数，`3` - 商和余数。<br/>`0 <= f <= 2`  -  舍入模式：`0` - 向下取整，`1` - 最近整数，`2` - 向上取整。<br/>下列所有指令均为此变体。 | `26` |
| **`A904`** | `DIV` | _`x y - q`_ | `q=floor(x/y)`，`r=x-y*q` | `26` |
| **`A905`** | `DIVR` | _`x y - q’`_ | `q’=round(x/y)`，`r’=x-y*q’` | `26` |
| **`A906`** | `DIVC` | _`x y - q''`_ | `q’’=ceil(x/y)`，`r’’=x-y*q’’` | `26` |
| **`A908`** | `MOD` | _`x y - r`_ |  | `26` |
| **`A90C`** | `DIVMOD` | _`x y - q r`_ |  | `26` |
| **`A90D`** | `DIVMODR` | _`x y - q' r'`_ |  | `26` |
| **`A90E`** | `DIVMODC` | _`x y - q'' r''`_ |  | `26` |
| **`A925`** | `RSHIFTR` | _`x y - round(x/2^y)`_ |  | `26` |
| **`A926`** | `RSHIFTC` | _`x y - ceil(x/2^y)`_ |  | `34` |
| **`A935tt`** | `[tt+1] RSHIFTR#` | _`x y - round(x/2^(tt+1))`_ |  | `34` |
| **`A936tt`** | `[tt+1] RSHIFTC#` | _`x y - ceil(x/2^(tt+1))`_ |  | `34` |
| **`A938tt`** | `[tt+1] MODPOW2#` | _`x - x mod 2^(tt+1)`_ |  | `34` |
| **`A98`** | `MULDIV` | _`x y z - q`_ | `q=floor(x*y/z)` | `26` |
| **`A985`** | `MULDIVR` | _`x y z - q'`_ | `q'=round(x*y/z)` | `26` |
| **`A98C`** | `MULDIVMOD` | _`x y z - q r`_ | `q=floor(x*y/z)`，`r=x*y-z*q` | `26` |
| **`A9A4`** | `MULRSHIFT` | _`x y z - floor(x*y/2^z)`_ | `0 <= z <= 256` | `26` |
| **`A9A5`** | `MULRSHIFTR` | _`x y z - round(x*y/2^z)`_ | `0 <= z <= 256` | `26` |
| **`A9A6`** | `MULRSHIFTC` | _`x y z - ceil(x*y/2^z)`_ | `0 <= z <= 256` | `34` |
| **`A9B4tt`** | `[tt+1] MULRSHIFT#` | _`x y - floor(x*y/2^(tt+1))`_ |  | `34` |
| **`A9B5tt`** | `[tt+1] MULRSHIFTR#` | _`x y - round(x*y/2^(tt+1))`_ |  | `34` |
| **`A9B6tt`** | `[tt+1] MULRSHIFTC#` | _`x y - ceil(x*y/2^(tt+1))`_ |  | `26` |
| **`A9C4`** | `LSHIFTDIV` | _`x y z - floor(2^z*x/y)`_ | `0 <= z <= 256` | `26` |
| **`A9C5`** | `LSHIFTDIVR` | _`x y z - round(2^z*x/y)`_ | `0 <= z <= 256` | `26` |
| **`A9C6`** | `LSHIFTDIVC` | _`x y z - ceil(2^z*x/y)`_ | `0 <= z <= 256` | `34` |
| **`A9D4tt`** | `[tt+1] LSHIFT#DIV` | _`x y - floor(2^(tt+1)*x/y)`_ |  | `34` |
| **`A9D5tt`** | `[tt+1] LSHIFT#DIVR` | _`x y - round(2^(tt+1)*x/y)`_ |  | `34` |
| **`A9D6tt`** | `[tt+1] LSHIFT#DIVC` | _`x y - ceil(2^(tt+1)*x/y)`_ |  | `26` |
### 5.3 移位、逻辑操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`AAcc`** | `[cc+1] LSHIFT#` | _`x - x*2^(cc+1)`_ | `0 <= cc <= 255` | `26` |
| **`ABcc`** | `[cc+1] RSHIFT#` | _`x - floor(x/2^(cc+1))`_ | `0 <= cc <= 255` | `18` |
| **`AC`** | `LSHIFT` | _`x y - x*2^y`_ | `0 <= y <= 1023` | `18` |
| **`AD`** | `RSHIFT` | _`x y - floor(x/2^y)`_ | `0 <= y <= 1023` | `18` |
| **`AE`** | `POW2` | _`y - 2^y`_ | `0 <= y <= 1023`<br/>等同于 [`ONE`](#instr-one) [`SWAP`](#instr-swap) [`LSHIFT`](#instr-lshift-var)。 | `18` |
| **`B0`** | `AND` | _`x y - x&y`_ | 对两个有符号整数 `x` 和 `y` 进行按位与运算，符号扩展到无限。 | `18` |
| **`B1`** | `OR` | _`x y - x\|y`_ | 对两个整数进行按位或运算。 | `18` |
| **`B2`** | `XOR` | _`x y - x xor y`_ | 对两个整数进行按位异或运算。 | `18` |
| **`B3`** | `NOT` | _`x - ~x`_ | 一个整数的按位非运算。 | `26` |
| **`B4cc`** | `[cc+1] FITS` | _`x - x`_ | 检查 `x` 是否为 `cc+1` 位有符号整数，对于 `0 <= cc <= 255`（即 `-2^cc <= x < 2^cc`）。<br/>如果不是，要么触发整数溢出异常，要么用 `NaN` 替换 `x`（静默版本）。 | `26/76` |
| **`B400`** | `CHKBOOL` | _`x - x`_ | 检查 `x` 是否为“布尔值”（即 0 或 -1）。 | `26/76` |
| **`B5cc`** | `[cc+1] UFITS` | _`x - x`_ | 检查 `x` 是否为 `cc+1` 位无符号整数，对于 `0 <= cc <= 255`（即 `0 <= x < 2^(cc+1)`）。 | `26/76` |
| **`B500`** | `CHKBIT` | _`x - x`_ | 检查 `x` 是否为二进制数字（即零或一）。 | `26/76` |
| **`B600`** | `FITSX` | _`x c - x`_ | 检查 `x` 是否为 `c` 位有符号整数，对于 `0 <= c <= 1023`。 | `26/76` |
| **`B601`** | `UFITSX` | _`x c - x`_ | 检查 `x` 是否为 `c` 位无符号整数，对于 `0 <= c <= 1023`。 | `26/76` |
| **`B602`** | `BITSIZE` | _`x - c`_ | 计算最小的 `c >= 0` 使得 `x` 适合于 `c` 位有符号整数（`-2^(c-1) <= c < 2^(c-1)`）。 | `26` |
| **`B603`** | `UBITSIZE` | _`x - c`_ | 计算最小的 `c >= 0` 使得 `x` 适合于 `c` 位无符号整数（`0 <= x < 2^c`），或抛出范围检查异常。 | `26` |
| **`B608`** | `MIN` | _`x y - x or y`_ | 计算两个整数 `x` 和 `y` 的最小值。 | `26` |
| **`B609`** | `MAX` | _`x y - x or y`_ | 计算两个整数 `x` 和 `y` 的最大值。 | `26` |
| **`B60A`** | `MINMAX`<br/>`INTSORT2` | _`x y - x y or y x`_ | 排序两个整数。如果任一参数为 `NaN`s，静默版本的此操作返回两个 `NaN`s。 | `26` |
| **`B60B`** | `ABS` | _`x - \|x\|`_ | 计算整数 `x` 的绝对值。 | `26` |
### 5.4 静默算术原语
静默操作在其参数之一为 `NaN` 或在整数溢出的情况下返回 `NaN`，而不是抛出异常。
静默操作如下所示带有 `Q` 前缀。另一种使操作变为静默的方法是在其前添加 `QUIET`（即可以写 [`QUIET ADD`](#instr-add) 而不是 [`QADD`](#instr-qadd)）。
整数比较原语的静默版本也可用（[`QUIET SGN`](#instr-sgn)，[`QUIET LESS`](#instr-less) 等）。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`B7A0`** | `QADD` | _`x y - x+y`_ |  | `26` |
| **`B7A1`** | `QSUB` | _`x y - x-y`_ |  | `26` |
| **`B7A2`** | `QSUBR` | _`x y - y-x`_ |  | `26` |
| **`B7A3`** | `QNEGATE` | _`x - -x`_ |  | `26` |
| **`B7A4`** | `QINC` | _`x - x+1`_ |  | `26` |
| **`B7A5`** | `QDEC` | _`x - x-1`_ |  | `26` |
| **`B7A8`** | `QMUL` | _`x y - x*y`_ |  | `26` |
| **`B7A904`** | `QDIV` | _`x y - q`_ | 如果 `y=0` 则除法返回 `NaN`。 | `34` |
| **`B7A905`** | `QDIVR` | _`x y - q’`_ |  | `34` |
| **`B7A906`** | `QDIVC` | _`x y - q''`_ |  | `34` |
| **`B7A908`** | `QMOD` | _`x y - r`_ |  | `34` |
| **`B7A90C`** | `QDIVMOD` | _`x y - q r`_ |  | `34` |
| **`B7A90D`** | `QDIVMODR` | _`x y - q' r'`_ |  | `34` |
| **`B7A90E`** | `QDIVMODC` | _`x y - q'' r''`_ |  | `34` |
| **`B7A985`** | `QMULDIVR` | _`x y z - q'`_ |  | `34` |
| **`B7A98C`** | `QMULDIVMOD` | _`x y z - q r`_ |  | `34` |
| **`B7AC`** | `QLSHIFT` | _`x y - x*2^y`_ |  | `26` |
| **`B7AD`** | `QRSHIFT` | _`x y - floor(x/2^y)`_ |  | `26` |
| **`B7AE`** | `QPOW2` | _`y - 2^y`_ |  | `26` |
| **`B7B0`** | `QAND` | _`x y - x&y`_ |  | `26` |
| **`B7B1`** | `QOR` | _`x y - x\|y`_ |  | `26` |
| **`B7B2`** | `QXOR` | _`x y - x xor y`_ |  | `26` |
| **`B7B3`** | `QNOT` | _`x - ~x`_ |  | `26` |
| **`B7B4cc`** | `[cc+1] QFITS` | _`x - x`_ | 如果 `x` 不是 `cc+1` 位有符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |
| **`B7B5cc`** | `[cc+1] QUFITS` | _`x - x`_ | 如果 `x` 不是 `cc+1` 位无符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |
| **`B7B600`** | `QFITSX` | _`x c - x`_ | 如果 `x` 不是 `c` 位有符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |
| **`B7B601`** | `QUFITSX` | _`x c - x`_ | 如果 `x` 不是 `c` 位无符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |

## 6 比较原语
### 6.1 整数比较
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`B8`** | `SGN` | _`x - sgn(x)`_ | 计算整数 `x` 的符号：<br/>`x<0` 时为 `-1`，`x=0` 时为 `0`，`x>0` 时为 `1`。 | `18` |
| **`B9`** | `LESS` | _`x y - x<y`_ | 如 `x<y`，返回 `-1`，否则返回 `0`。 | `18` |
| **`BA`** | `EQUAL` | _`x y - x=y`_ | 如 `x=y`，返回 `-1`，否则返回 `0`。 | `18` |
| **`BB`** | `LEQ` | _`x y - x<=y`_ |  | `18` |
| **`BC`** | `GREATER` | _`x y - x>y`_ |  | `18` |
| **`BD`** | `NEQ` | _`x y - x!=y`_ | 等同于 [`EQUAL`](#instr-equal) [`NOT`](#instr-not)。 | `18` |
| **`BE`** | `GEQ` | _`x y - x>=y`_ | 等同于 [`LESS`](#instr-less) [`NOT`](#instr-not)。 | `18` |
| **`BF`** | `CMP` | _`x y - sgn(x-y)`_ | 计算 `x-y` 的符号：<br/>`x<y` 时为 `-1`，`x=y` 时为 `0`，`x>y` 时为 `1`。<br/>除非 `x` 或 `y` 为 `NaN`，否则不会发生整数溢出。 | `18` |
| **`C0yy`** | `[yy] EQINT` | _`x - x=yy`_ | 如 `x=yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C000`** | `ISZERO` | _`x - x=0`_ | 检查一个整数是否为零。对应 Forth 的 `0=`。 | `26` |
| **`C1yy`** | `[yy] LESSINT`<br/>`[yy-1] LEQINT` | _`x - x<yy`_ | 如 `x<yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C100`** | `ISNEG` | _`x - x<0`_ | 检查一个整数是否为负数。对应 Forth 的 `0<`。 | `26` |
| **`C101`** | `ISNPOS` | _`x - x<=0`_ | 检查一个整数是否非正。 | `26` |
| **`C2yy`** | `[yy] GTINT`<br/>`[yy+1] GEQINT` | _`x - x>yy`_ | 如 `x>yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C200`** | `ISPOS` | _`x - x>0`_ | 检查一个整数是否为正数。对应 Forth 的 `0>`。 | `26` |
| **`C2FF`** | `ISNNEG` | _`x - x >=0`_ | 检查一个整数是否非负。 | `26` |
| **`C3yy`** | `[yy] NEQINT` | _`x - x!=yy`_ | 如 `x!=yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C4`** | `ISNAN` | _`x - x=NaN`_ | 检查 `x` 是否为 `NaN`。 | `18` |
| **`C5`** | `CHKNAN` | _`x - x`_ | 如果 `x` 为 `NaN`，抛出算术溢出异常。 | `18/68` |
### 6.2 其他比较
这些“其他比较”原语中的大多数实际上将_Slice_的数据部分作为位串进行比较（如果没有另外声明，忽略引用）。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`C700`** | `SEMPTY` | _`s - ?`_ | 检查切片 `s` 是否为空（即，不包含任何数据位和cell引用）。 | `26` |
| **`C701`** | `SDEMPTY` | _`s - ?`_ | 检查切片 `s` 是否没有数据位。 | `26` |
| **`C702`** | `SREMPTY` | _`s - ?`_ | 检查切片 `s` 是否没有引用。 | `26` |
| **`C703`** | `SDFIRST` | _`s - ?`_ | 检查切片 `s` 的第一个位是否为一。 | `26` |
| **`C704`** | `SDLEXCMP` | _`s s' - x`_ | 字典序比较 `s` 和 `s'` 的数据，根据结果返回 `-1`、0 或 1。 | `26` |
| **`C705`** | `SDEQ` | _`s s' - ?`_ | 检查 `s` 和 `s'` 的数据部分是否一致，等同于 [`SDLEXCMP`](#instr-sdlexcmp) [`ISZERO`](#instr-iszero)。 | `26` |
| **`C708`** | `SDPFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的前缀。 | `26` |
| **`C709`** | `SDPFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的前缀，等同于 [`SWAP`](#instr-swap) [`SDPFX`](#instr-sdpfx)。 | `26` |
| **`C70A`** | `SDPPFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的真前缀（即，一个与 `s'` 不同的前缀）。 | `26` |
| **`C70B`** | `SDPPFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的真前缀。 | `26` |
| **`C70C`** | `SDSFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的后缀。 | `26` |
| **`C70D`** | `SDSFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的后缀。 | `26` |
| **`C70E`** | `SDPSFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的真后缀。 | `26` |
| **`C70F`** | `SDPSFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的真后缀。 | `26` |
| **`C710`** | `SDCNTLEAD0` | _`s - n`_ | 返回 `s` 中前导零的数量。 | `26` |
| **`C711`** | `SDCNTLEAD1` | _`s - n`_ | 返回 `s` 中前导一的数量。 | `26` |
| **`C712`** | `SDCNTTRAIL0` | _`s - n`_ | 返回 `s` 中末尾零的数量。 | `26` |
| **`C713`** | `SDCNTTRAIL1` | _`s - n`_ | 返回 `s` 中末尾一的数量。 | `26` |

## 7 Cell 原语
### 7.1 Cell 序列化原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`C8`** | `NEWC` | _`- b`_ | 创建一个新的空 _构建器_。 | `18` |
| **`C9`** | `ENDC` | _`b - c`_ | 将 _构建器_ 转换为普通的 _cell_。 | `518` |
| **`CAcc`** | `[cc+1] STI` | _`x b - b'`_ | 将 `0 <= cc <= 255` 的有符号 `cc+1`-位整数 `x` 存入 _构建器_ `b` 中，如果 `x` 不适合于 `cc+1` 位，则抛出范围检查异常。 | `26` |
| **`CBcc`** | `[cc+1] STU` | _`x b - b'`_ | 将无符号的 `cc+1`-位整数 `x` 存入 _构建器_ `b` 中。在其他方面，它与 [`STI`](#instr-sti) 类似。 | `26` |
| **`CC`** | `STREF` | _`c b - b'`_ | 将 _cell_ `c` 的引用存入 _构建器_ `b` 中。 | `18` |
| **`CD`** | `STBREFR`<br/>`ENDCST` | _`b b'' - b`_ | 等同于 [`ENDC`](#instr-endc) [`SWAP`](#instr-swap) [`STREF`](#instr-stref)。 | `518` |
| **`CE`** | `STSLICE` | _`s b - b'`_ | 将 _分片_ `s` 存入 _构建器_ `b` 中。 | `18` |
| **`CF00`** | `STIX` | _`x b l - b'`_ | 为 `0 <= l <= 257`，将有符号 `l`-位整数 `x` 存入 `b` 中。 | `26` |
| **`CF01`** | `STUX` | _`x b l - b'`_ | 为 `0 <= l <= 256`，将无符号 `l`-位整数 `x` 存入 `b` 中。 | `26` |
| **`CF02`** | `STIXR` | _`b x l - b'`_ | 与 [`STIX`](#instr-stix) 类似，但参数顺序不同。 | `26` |
| **`CF03`** | `STUXR` | _`b x l - b'`_ | 与 [`STUX`](#instr-stux) 类似，但参数顺序不同。 | `26` |
| **`CF04`** | `STIXQ` | _`x b l - x b f or b' 0`_ | [`STIX`](#instr-stix) 的静默版本。如果 `b` 中没有空间，将 `b'=b` 和 `f=-1`。<br/>如果 `x` 不适合于 `l` 位，将 `b'=b` 和 `f=1`。<br/>如果操作成功，`b'` 是新的 _构建器_ 和 `f=0`。<br/>然而，`0 <= l <= 257`，如果不是这样，则抛出范围检查异常。 | `26` |
| **`CF05`** | `STUXQ` | _`x b l - x b f or b' 0`_ | [`STUX`](#instr-stux) 的静默版本。 | `26` |
| **`CF06`** | `STIXRQ` | _`b x l - b x f or b' 0`_ | [`STIXR`](#instr-stixr) 的静默版本。 | `26` |
| **`CF07`** | `STUXRQ` | _`b x l - b x f or b' 0`_ | [`STUXR`](#instr-stuxr) 的静默版本。 | `26` |
| **`CF08cc`** | `[cc+1] STI_l` | _`x b - b'`_ | [`[cc+1] STI`](#instr-sti) 的更长版本。 | `34` |
| **`CF09cc`** | `[cc+1] STU_l` | _`x b - b'`_ | [`[cc+1] STU`](#instr-stu) 的更长版本。 | `34` |
| **`CF0Acc`** | `[cc+1] STIR` | _`b x - b'`_ | 等同于 [`SWAP`](#instr-swap) [`[cc+1] STI`](#instr-sti)。 | `34` |
| **`CF0Bcc`** | `[cc+1] STUR` | _`b x - b'`_ | 等同于 [`SWAP`](#instr-swap) [`[cc+1] STU`](#instr-stu)。 | `34` |
| **`CF0Ccc`** | `[cc+1] STIQ` | _`x b - x b f or b' 0`_ | [`STI`](#instr-sti) 的静默版本。 | `34` |
| **`CF0Dcc`** | `[cc+1] STUQ` | _`x b - x b f or b' 0`_ | [`STU`](#instr-stu) 的静默版本。 | `34` |
| **`CF0Ecc`** | `[cc+1] STIRQ` | _`b x - b x f or b' 0`_ | [`STIR`](#instr-stir) 的静默版本。 | `34` |
| **`CF0Fcc`** | `[cc+1] STURQ` | _`b x - b x f or b' 0`_ | [`STUR`](#instr-stur) 的静默版本。 | `34` |
| **`CF10`** | `STREF_l` | _`c b - b'`_ | [`STREF`](#instr-stref) 的更长版本。 | `26` |
| **`CF11`** | `STBREF` | _`b' b - b''`_ | 等同于 [`SWAP`](#instr-swap) [`STBREFR`](#instr-stbrefr)。 | `526` |
| **`CF12`** | `STSLICE_l` | _`s b - b'`_ | [`STSLICE`](#instr-stslice) 的更长版本。 | `26` |
| **`CF13`** | `STB` | _`b' b - b''`_ | 将 _构建器_ `b'` 中的所有数据附加到 _构建器_ `b` 中。 | `26` |
| **`CF14`** | `STREFR` | _`b c - b'`_ | 等同于 [`SWAP`](#instr-swap) [`STREF`](#instr-stref)。 | `26` |
| **`CF15`** | `STBREFR_l` | _`b b' - b''`_ | [`STBREFR`](#instr-stbrefr) 的更长编码。 | `526` |
| **`CF16`** | `STSLICER` | _`b s - b'`_ | 等同于 [`SWAP`](#instr-swap) [`STSLICE`](#instr-stslice)。 | `26` |
| **`CF17`** | `STBR`<br/>`BCONCAT` | _`b b' - b''`_ | 连接两个构建器。<br/>等同于 [`SWAP`](#instr-swap) [`STB`](#instr-stb)。 | `26` |
| **`CF18`** | `STREFQ` | _`c b - c b -1 or b' 0`_ | [`STREF`](#instr-stref) 的静默版本。 | `26` |
| **`CF19`** | `STBREFQ` | _`b' b - b' b -1 or b'' 0`_ | [`STBREF`](#instr-stbref) 的静默版本。 | `526` |
| **`CF1A`** | `STSLICEQ` | _`s b - s b -1 or b' 0`_ | [`STSLICE`](#instr-stslice) 的静默版本。 | `26` |
| **`CF1B`** | `STBQ` | _`b' b - b' b -1 or b'' 0`_ | [`STB`](#instr-stb) 的静默版本。 | `26` |
| **`CF1C`** | `STREFRQ` | _`b c - b c -1 or b' 0`_ | [`STREFR`](#instr-strefr) 的静默版本。 | `26` |
| **`CF1D`** | `STBREFRQ` | _`b b' - b b' -1 or b'' 0`_ | [`STBREFR`](#instr-stbrefr) 的静默版本。 | `526` |
| **`CF1E`** | `STSLICERQ` | _`b s - b s -1 or b'' 0`_ | [`STSLICER`](#instr-stslicer) 的静默版本。 | `26` |
| **`CF1F`** | `STBRQ`<br/>`BCONCATQ` | _`b b' - b b' -1 or b'' 0`_ | [`STBR`](#instr-stbr) 的静默版本。 | `26` |
| **`CF20`** | `[ref] STREFCONST` | _`b - b’`_ | 等同于 [`PUSHREF`](#instr-pushref) [`STREFR`](#instr-strefr)。 | `26` |
| **`CF21`** | `[ref] [ref] STREF2CONST` | _`b - b’`_ | 等同于 [`STREFCONST`](#instr-strefconst) [`STREFCONST`](#instr-strefconst)。 | `26` |
| **`CF23`** |  | _`b x - c`_ | 如果 `x!=0`，从 _构建器_ `b` 创建一个 _特殊_ 或 _异类_ cell。<br/>异类cell的类型必须存储在 `b` 的前 8 位中。<br/>如果 `x=0`，它相当于 [`ENDC`](#instr-endc)。否则，将在创建异类cell之前对 `b` 的数据和引用执行一些有效性检查。 | `526` |
| **`CF28`** | `STILE4` | _`x b - b'`_ | 存储一个小端有符号 32 位整数。 | `26` |
| **`CF29`** | `STULE4` | _`x b - b'`_ | 存储一个小端无符号 32 位整数。 | `26` |
| **`CF2A`** | `STILE8` | _`x b - b'`_ | 存储一个小端有符号 64 位整数。 | `26` |
| **`CF2B`** | `STULE8` | _`x b - b'`_ | 存储一个小端无符号 64 位整数。 | `26` |
| **`CF30`** | `BDEPTH` | _`b - x`_ | 返回 _构建器_ `b` 的深度。如果 `b` 中没有存储cell引用，则 `x=0`；否则 `x` 是对 `b` 中引用的cell的深度的最大值加 1。 | `26` |
| **`CF31`** | `BBITS` | _`b - x`_ | 返回已经存储在 _构建器_ `b` 中的数据位数。 | `26` |
| **`CF32`** | `BREFS` | _`b - y`_ | 返回已经存储在 `b` 中的cell引用数。 | `26` |
| **`CF33`** | `BBITREFS` | _`b - x y`_ | 返回 `b` 中数据位数和cell引用数。 | `26` |
| **`CF35`** | `BREMBITS` | _`b - x'`_ | 返回仍然可以存储在 `b` 中的数据位数。 | `26` |
| **`CF36`** | `BREMREFS` | _`b - y'`_ | 返回仍然可以存储在 `b` 中的引用数。 | `26` |
| **`CF37`** | `BREMBITREFS` | _`b - x' y'`_ | 返回仍然可以存储在 `b` 中的数据位数和引用数。 | `26` |
| **`CF38cc`** | `[cc+1] BCHKBITS#` | _`b -`_ | 检查是否能将 `cc+1` 位存储到 `b` 中，其中 `0 <= cc <= 255`。 | `34/84` |
| **`CF39`** | `BCHKBITS` | _`b x - `_ | 检查是否能将 `x` 位存储到 `b` 中，`0 <= x <= 1023`。如果 `b` 中没有足够空间存储 `x` 更多位，或者 `x` 不在范围 `0...1023` 内，则抛出异常。 | `26/76` |
| **`CF3A`** | `BCHKREFS` | _`b y - `_ | 检查是否能将 `y` 引用存储到 `b` 中，`0 <= y <= 7`。 | `26/76` |
| **`CF3B`** | `BCHKBITREFS` | _`b x y - `_ | 检查是否能将 `x` 位和 `y` 引用存储到 `b` 中，`0 <= x <= 1023`，`0 <= y <= 7`。 | `26/76` |
| **`CF3Ccc`** | `[cc+1] BCHKBITSQ#` | _`b - ?`_ | 检查是否能将 `cc+1` 位存储到 `b` 中，其中 `0 <= cc <= 255`。 | `34` |
| **`CF3D`** | `BCHKBITSQ` | _`b x - ?`_ | 检查是否能将 `x` 位存储到 `b` 中，`0 <= x <= 1023`。 | `26` |
| **`CF3E`** | `BCHKREFSQ` | _`b y - ?`_ | 检查是否能将 `y` 引用存储到 `b` 中，`0 <= y <= 7`。 | `26` |
| **`CF3F`** | `BCHKBITREFSQ` | _`b x y - ?`_ | 检查是否能将 `x` 位和 `y` 引用存储到 `b` 中，`0 <= x <= 1023`，`0 <= y <= 7`。 | `26` |
| **`CF40`** | `STZEROES` | _`b n - b'`_ | 将 `n` 个二进制零存储到 _构建器_ `b` 中。 | `26` |
| **`CF41`** | `STONES` | _`b n - b'`_ | 将 `n` 个二进制一存储到 _构建器_ `b` 中。 | `26` |
| **`CF42`** | `STSAME` | _`b n x - b'`_ | 将 `n` 个二进制 `x`（`0 <= x <= 1`）存储到 _构建器_ `b` 中。 | `26` |
| **`CFC0_xysss`** | `[slice] STSLICECONST` | _`b - b'`_ | 存储一个常量子切片 `sss`。<br/>_详情：_ `sss` 由 `0 <= x <= 3` 个引用和最多 `8y+2` 个数据位组成，其中 `0 <= y <= 7`。假定有完成位。<br/>注意，如果切片过大，汇编器可以将 [`STSLICECONST`](#instr-stsliceconst) 替换为 [`PUSHSLICE`](#instr-pushslice) [`STSLICER`](#instr-stslicer)。 | `24` |
| **`CF81`** | `STZERO` | _`b - b'`_ | 存储一个二进制零。 | `24` |
| **`CF83`** | `STONE` | _`b - b'`_ | 存储一个二进制一。 | `24` |
### 7.2 Cell 反序列化原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`D0`** | `CTOS` | _`c - s`_ | 将 _cell_ 转换为 _切片_。请注意，`c` 必须是普通cell，或者是自动 _加载_ 以产生普通cell `c'` 的异类cell，然后转换为 _切片_。 | `118/43` |
| **`D1`** | `ENDS` | _`s - `_ | 从堆栈中移除 _切片_ `s`，如果不为空则抛出异常。 | `18/68` |
| **`D2cc`** | `[cc+1] LDI` | _`s - x s'`_ | 从 _切片_ `s` 中加载（即解析）一个有符号的 `cc+1`-位整数 `x`，并返回 `s` 的剩余部分作为 `s'`。 | `26` |
| **`D3cc`** | `[cc+1] LDU` | _`s - x s'`_ | 从 _切片_ `s` 中加载一个无符号 `cc+1`-位整数 `x`。 | `26` |
| **`D4`** | `LDREF` | _`s - c s'`_ | 从 `s` 中加载一个cell引用 `c`。 | `18` |
| **`D5`** | `LDREFRTOS` | _`s - s' s''`_ | 等效于 [`LDREF`](#instr-ldref) [`SWAP`](#instr-swap) [`CTOS`](#instr-ctos)。 | `118/43` |
| **`D6cc`** | `[cc+1] LDSLICE` | _`s - s'' s'`_ | 将 `s` 的接下来的 `cc+1` 位切割为一个独立的 _切片_ `s''`。 | `26` |
| **`D700`** | `LDIX` | _`s l - x s'`_ | 从 _切片_ `s` 中加载一个有符号的 `l`-位（`0 <= l <= 257`）整数 `x`，并返回 `s` 的剩余部分作为 `s'`。 | `26` |
| **`D701`** | `LDUX` | _`s l - x s'`_ | 从 `s` 的前 `l` 位（`0 <= l <= 256`）加载一个无符号 `l`-位整数 `x`。 | `26` |
| **`D702`** | `PLDIX` | _`s l - x`_ | 从 _切片_ `s` 中预加载一个有符号 `l`-位整数，`0 <= l <= 257`。 | `26` |
| **`D703`** | `PLDUX` | _`s l - x`_ | 从 `s` 中预加载一个无符号 `l`-位整数，`0 <= l <= 256`。 | `26` |
| **`D704`** | `LDIXQ` | _`s l - x s' -1 or s 0`_ | [`LDIX`](#instr-ldix) 的静默版本：类似地从 `s` 中加载一个有符号 `l`-位整数，但在成功时返回一个成功标志位 `-1`，失败时（如果 `s` 没有 `l` 位）返回 `0`，而不是抛出cell下溢异常。 | `26` |
| **`D705`** | `LDUXQ` | _`s l - x s' -1 or s 0`_ | [`LDUX`](#instr-ldux) 的静默版本。 | `26` |
| **`D706`** | `PLDIXQ` | _`s l - x -1 or 0`_ | [`PLDIX`](#instr-pldix) 的静默版本。 | `26` |
| **`D707`** | `PLDUXQ` | _`s l - x -1 or 0`_ | [`PLDUX`](#instr-pldux) 的静默版本。 | `26` |
| **`D708cc`** | `[cc+1] LDI_l` | _`s - x s'`_ | [`LDI`](#instr-ldi) 的更长编码。 | `34` |
| **`D709cc`** | `[cc+1] LDU_l` | _`s - x s'`_ | [`LDU`](#instr-ldu) 的更长编码。 | `34` |
| **`D70Acc`** | `[cc+1] PLDI` | _`s - x`_ | 从 _切片_ `s` 中预加载一个有符号 `cc+1`-位整数。 | `34` |
| **`D70Bcc`** | `[cc+1] PLDU` | _`s - x`_ | 从 `s` 中预加载一个无符号 `cc+1`-位整数。 | `34` |
| **`D70Ccc`** | `[cc+1] LDIQ` | _`s - x s' -1 or s 0`_ | [`LDI`](#instr-ldi) 的静默版本。 | `34` |
| **`D70Dcc`** | `[cc+1] LDUQ` | _`s - x s' -1 or s 0`_ | [`LDU`](#instr-ldu) 的静默版本。 | `34` |
| **`D70Ecc`** | `[cc+1] PLDIQ` | _`s - x -1 or 0`_ | [`PLDI`](#instr-pldi) 的静默版本。 | `34` |
| **`D70Fcc`** | `[cc+1] PLDUQ` | _`s - x -1 or 0`_ | [`PLDU`](#instr-pldu) 的静默版本。 | `34` |
| **`D714_c`** | `[32(c+1)] PLDUZ` | _`s - s x`_ | 从 _切片_ `s` 中预加载前 `32(c+1)` 位到无符号整数 `x` 中，`0 <= c <= 7`。如果 `s` 比必要的短，缺失的位假定为零。此操作旨在与 [`IFBITJMP`](#instr-ifbitjmp) 及类似指令一起使用。 | `26` |
| **`D718`** | `LDSLICEX` | _`s l - s'' s'`_ | 从 _切片_ `s` 中加载前 `0 <= l <= 1023` 位到一个单独的 _切片_ `s''` 中，返回 `s` 的剩余部分作为 `s'`。 | `26` |
| **`D719`** | `PLDSLICEX` | _`s l - s''`_ | 返回 `s` 的前 `0 <= l <= 1023` 位作为 `s''`。 | `26` |
| **`D71A`** | `LDSLICEXQ` | _`s l - s'' s' -1 or s 0`_ | [`LDSLICEX`](#instr-ldslicex) 的静默版本。 | `26` |
| **`D71B`** | `PLDSLICEXQ` | _`s l - s' -1 or 0`_ | [`LDSLICEXQ`](#instr-ldslicexq) 的静默版本。 | `26` |
| **`D71Ccc`** | `[cc+1] LDSLICE_l` | _`s - s'' s'`_ | [`LDSLICE`](#instr-ldslice) 的更长编码。 | `34` |
| **`D71Dcc`** | `[cc+1] PLDSLICE` | _`s - s''`_ | 返回 `s` 的前 `0 < cc+1 <= 256` 位作为 `s''`。 | `34` |
| **`D71Ecc`** | `[cc+1] LDSLICEQ` | _`s - s'' s' -1 or s 0`_ | [`LDSLICE`](#instr-ldslice) 的静默版本。 | `34` |
| **`D71Fcc`** | `[cc+1] PLDSLICEQ` | _`s - s'' -1 or 0`_ | [`PLDSLICE`](#instr-pldslice) 的静默版本。 | `34` |
| **`D720`** | `SDCUTFIRST` | _`s l - s'`_ | 返回 `s` 的前 `0 <= l <= 1023` 位。与 [`PLDSLICEX`](#instr-pldslicex) 等效。 | `26` |
| **`D721`** | `SDSKIPFIRST` | _`s l - s'`_ | 返回除了 `s` 的前 `0 <= l <= 1023` 位以外的所有位。与 [`LDSLICEX`](#instr-ldslicex) [`NIP`](#instr-nip) 等效。 | `26` |
| **`D722`** | `SDCUTLAST` | _`s l - s'`_ | 返回 `s` 的后 `0 <= l <= 1023` 位。 | `26` |
| **`D723`** | `SDSKIPLAST` | _`s l - s'`_ | 返回除了 `s` 的后 `0 <= l <= 1023` 位以外的所有位。 | `26` |
| **`D724`** | `SDSUBSTR` | _`s l l' - s'`_ | 返回 `s` 的从偏移量 `0 <= l <= 1023` 开始的 `0 <= l' <= 1023` 位，从 `s` 的数据中提取出一个位子字符串。 | `26` |
| **`D726`** | `SDBEGINSX` | _`s s' - s''`_ | 检查 `s` 是否以 `s'`（数据位）开始，并在成功时从 `s` 中移除 `s'`。失败抛出cell反序列化异常。原语 [`SDPFXREV`](#instr-sdpfxrev) 可以认为是 [`SDBEGINSX`](#instr-sdbeginsx) 的静默版本。 | `26` |
| **`D727`** | `SDBEGINSXQ` | _`s s' - s'' -1 or s 0`_ | [`SDBEGINSX`](#instr-sdbeginsx) 的静默版本。 | `26` |
| **`D72A_xsss`** | `[slice] SDBEGINS` | _`s - s''`_ | 检查 `s` 是否以常量位串 `sss` 开始，`sss` 的长度为 `8x+3`（假定有完成位），其中 `0 <= x <= 127`，并在成功时从 `s` 中移除 `sss`。 | `31` |
| **`D72E_xsss`** | `[slice] SDBEGINSQ` | _`s - s'' -1 or s 0`_ | [`SDBEGINS`](#instr-sdbegins) 的静默版本。 | `31` |
| **`D730`** | `SCUTFIRST` | _`s l r - s'`_ | 返回 `s` 的前 `0 <= l <= 1023` 位和前 `0 <= r <= 4` 个引用。 | `26` |
| **`D731`** | `SSKIPFIRST` | _`s l r - s'`_ | 返回除了 `s` 的前 `l` 位和 `r` 个引用以外的所有内容。 | `26` |
| **`D732`** | `SCUTLAST` | _`s l r - s'`_ | 返回 `s` 的后 `0 <= l <= 1023` 个数据位和后 `0 <= r <= 4` 个引用。 | `26` |
| **`D733`** | `SSKIPLAST` | _`s l r - s'`_ | 返回除了 `s` 的后 `l` 位和 `r` 个引用以外的所有内容。 | `26` |
| **`D734`** | `SUBSLICE` | _`s l r l' r' - s'`_ | 在跳过 `s` 的前 `0 <= l <= 1023` 位和前 `0 <= r <= 4` 个引用后，返回来自 _切片_ `s` 的 `0 <= l' <= 1023` 位和 `0 <= r' <= 4` 个引用。 | `26` |
| **`D736`** | `SPLIT` | _`s l r - s' s''`_ | 将 `s` 的前 `0 <= l <= 1023` 个数据位和前 `0 <= r <= 4` 个引用分割成 `s'`，并返回 `s` 的剩余部分作为 `s''`。 | `26` |
| **`D737`** | `SPLITQ` | _`s l r - s' s'' -1 或 s 0`_ | [`SPLIT`](#instr-split) 的静默版本。 | `26` |
| **`D739`** |  | _`c - s？`_ | 将普通或异类cell转换为 _切片_，就好像它是一个普通cell一样。返回一个标志位，指示 `c` 是否是异类的。如果是这样，其类型可以稍后从 `s` 的前八位中反序列化。 |  |
| **`D73A`** |  | _`c - c'`_ | 加载异类cell `c` 并返回一个普通cell `c'`。如果 `c` 已经是普通的，则不执行任何操作。如果 `c` 无法加载，抛出异常。 |  |
| **`D73B`** |  | _`c - c' -1 或 c 0`_ | 加载异类cell `c` 并返回一个普通cell `c'`。如果 `c` 已经是普通的，则不执行任何操作。如果 `c` 无法加载，返回 0。 |  |
| **`D741`** | `SCHKBITS` | _`s l - `_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位。如果不是这种情况，抛出cell反序列化（即cell下溢）异常。 | `26/76` |
| **`D742`** | `SCHKREFS` | _`s r - `_ | 检查 _切片_ `s` 中是否至少有 `r` 个引用。 | `26/76` |
| **`D743`** | `SCHKBITREFS` | _`s l r - `_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位和 `r` 个引用。 | `26/76` |
| **`D745`** | `SCHKBITSQ` | _`s l - ?`_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位。 | `26` |
| **`D746`** | `SCHKREFSQ` | _`s r - ?`_ | 检查 _切片_ `s` 中是否至少有 `r` 个引用。 | `26` |
| **`D747`** | `SCHKBITREFSQ` | _`s l r - ?`_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位和 `r` 个引用。 | `26` |
| **`D748`** | `PLDREFVAR` | _`s n - c`_ | 返回 _切片_ `s` 的第 `n` 个cell引用，`0 <= n <= 3`。 | `26` |
| **`D749`** | `SBITS` | _`s - l`_ | 返回 _切片_ `s` 中的数据位数。 | `26` |
| **`D74A`** | `SREFS` | _`s - r`_ | 返回 _切片_ `s` 中的引用数。 | `26` |
| **`D74B`** | `SBITREFS` | _`s - l r`_ | 返回 `s` 中的数据位数和引用数。 | `26` |
| **`D74E_n`** | `[n] PLDREFIDX` | _`s - c`_ | 返回 _切片_ `s` 的第 `n` 个cell引用，`0 <= n <= 3`。 | `26` |
| **`D74C`** | `PLDREF` | _`s - c`_ | 预加载 _切片_ 的第一个cell引用。 | `26` |
| **`D750`** | `LDILE4` | _`s - x s'`_ | 加载一个小端有符号 32 位整数。 | `26` |
| **`D751`** | `LDULE4` | _`s - x s'`_ | 加载一个小端无符号 32 位整数。 | `26` |
| **`D752`** | `LDILE8` | _`s - x s'`_ | 加载一个小端有符号 64 位整数。 | `26` |
| **`D753`** | `LDULE8` | _`s - x s'`_ | 加载一个小端无符号 64 位整数。 | `26` |
| **`D754`** | `PLDILE4` | _`s - x`_ | 预加载一个小端有符号 32 位整数。 | `26` |
| **`D755`** | `PLDULE4` | _`s - x`_ | 预加载一个小端无符号 32 位整数。 | `26` |
| **`D756`** | `PLDILE8` | _`s - x`_ | 预加载一个小端有符号 64 位整数。 | `26` |
| **`D757`** | `PLDULE8` | _`s - x`_ | 预加载一个小端无符号 64 位整数。 | `26` |
| **`D758`** | `LDILE4Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端有符号 32 位整数。 | `26` |
| **`D759`** | `LDULE4Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端无符号 32 位整数。 | `26` |
| **`D75A`** | `LDILE8Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端有符号 64 位整数。 | `26` |
| **`D75B`** | `LDULE8Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端无符号 64 位整数。 | `26` |
| **`D75C`** | `PLDILE4Q` | _`s - x -1 或 0`_ | 静默预加载一个小端有符号 32 位整数。 | `26` |
| **`D75D`** | `PLDULE4Q` | _`s - x -1 或 0`_ | 静默预加载一个小端无符号 32 位整数。 | `26` |
| **`D75E`** | `PLDILE8Q` | _`s - x -1 或 0`_ | 静默预加载一个小端有符号 64 位整数。 | `26` |
| **`D75F`** | `PLDULE8Q` | _`s - x -1 或 0`_ | 静默预加载一个小端无符号 64 位整数。 | `26` |
| **`D760`** | `LDZEROES` | _`s - n s'`_ | 返回 `s` 中前导零位的计数 `n`，并从 `s` 中移除这些位。 | `26` |
| **`D761`** | `LDONES` | _`s - n s'`_ | 返回 `s` 中前导一位的计数 `n`，并从 `s` 中移除这些位。 | `26` |
| **`D762`** | `LDSAME` | _`s x - n s'`_ | 返回 `s` 中与 `0 <= x <= 1` 相等的前导位的计数 `n`，并从 `s` 中移除这些位。 | `26` |
| **`D764`** | `SDEPTH` | _`s - x`_ | 返回 _切片_ `s` 的深度。如果 `s` 没有引用，则 `x=0`；否则 `x` 是从 `s` 引用的cell的最大深度加 1。 | `26` |
| **`D765`** | `CDEPTH` | _`c - x`_ | 返回 _cell_ `c` 的深度。如果 `c` 没有引用，则 `x=0`；否则 `x` 是从 `c` 引用的cell的最大深度加 1。如果 `c` 是 _空（Null）_ 而不是 _cell_，返回零。 | `26` |

## 8 Continuation 和控制流原语
### 8.1 无条件控制流原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`D8`** | `EXECUTE`<br/>`CALLX` | _`c - `_ | _调用_ 或 _执行_ Continuation `c`。 | `18` |
| **`D9`** | `JMPX` | _`c - `_ | _跳转_ 或 控制转移到 Continuation `c`。<br/>之前当前continuation `cc`的剩余部分被丢弃。 | `18` |
| **`DApr`** | `[p] [r] CALLXARGS` | _`c - `_ | 用 `p` 参数 _调用_ continuation `c` 并期待 `r` 返回值<br/>`0 <= p <= 15`, `0 <= r <= 15` | `26` |
| **`DB0p`** | `[p] -1 CALLXARGS` | _`c - `_ | 用 `0 <= p <= 15` 参数 _调用_ continuation `c`, 期望任意数量的返回值。 | `26` |
| **`DB1p`** | `[p] JMPXARGS` | _`c - `_ | _跳转_ 到 continuation `c`, 只将当前栈顶的 `0 <= p <= 15` 个值传递给它（当前栈的其余部分被丢弃）。 | `26` |
| **`DB2r`** | `[r] RETARGS` |  | _返回_ 到 `c0`, 携带 `0 <= r <= 15` 个从当前栈中取得的返回值。 | `26` |
| **`DB30`** | `RET`<br/>`RETTRUE` |  | _返回_ 到 continuation `c0`。当前 continuation `cc`的剩余部分被丢弃。<br/>大致相当于 [`c0 PUSHCTR`](#instr-pushctr) [`JMPX`](#instr-jmpx)。 | `26` |
| **`DB31`** | `RETALT`<br/>`RETFALSE` |  | _返回_ 到 continuation `c1`。<br/>大致相当于 [`c1 PUSHCTR`](#instr-pushctr) [`JMPX`](#instr-jmpx)。 | `26` |
| **`DB32`** | `BRANCH`<br/>`RETBOOL` | _`f - `_ | 如果整数 `f!=0`, 执行 [`RETTRUE`](#instr-ret)，如果 `f=0`，执行 [`RETFALSE`](#instr-retalt)。 | `26` |
| **`DB34`** | `CALLCC` | _`c - `_ | _带当前 continuation 调用_，控制权转移到 `c`，将旧的 `cc` 值推入 `c` 的栈中（而不是丢弃它或将其写入新的 `c0`中）。 | `26` |
| **`DB35`** | `JMPXDATA` | _`c - `_ | 类似于 [`CALLCC`](#instr-callcc)，但是当前 continuation 的剩余部分（旧的 `cc` 值）在推入 `c` 的栈之前被转换成一个 _Slice_。 | `26` |
| **`DB36pr`** | `[p] [r] CALLCCARGS` | _`c - `_ | 类似于 [`CALLXARGS`](#instr-callxargs)，但是将旧的 `cc` 值（连同最初栈顶的 `0 <= p <= 15` 个值）推入被调用 continuation `c` 的栈中，设置 `cc.nargs` 为 `-1 <= r <= 14`。 | `34` |
| **`DB38`** | `CALLXVARARGS` | _`c p r - `_ | 类似于 [`CALLXARGS`](#instr-callxargs)，但从栈中取 `-1 <= p,r <= 254`。接下来的三个操作也从栈中取 `p` 和 `r`，范围都是 `-1...254`。 | `26` |
| **`DB39`** | `RETVARARGS` | _`p r - `_ | 类似于 [`RETARGS`](#instr-retargs)。 | `26` |
| **`DB3A`** | `JMPXVARARGS` | _`c p r - `_ | 类似于 [`JMPXARGS`](#instr-jmpxargs)。 | `26` |
| **`DB3B`** | `CALLCCVARARGS` | _`c p r - `_ | 类似于 [`CALLCCARGS`](#instr-callccargs)。 | `26` |
| **`DB3C`** | `[ref] CALLREF` |  | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`CALLX`](#instr-execute)。 | `126/51` |
| **`DB3D`** | `[ref] JMPREF` |  | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`JMPX`](#instr-jmpx)。 | `126/51` |
| **`DB3E`** | `[ref] JMPREFDATA` |  | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`JMPXDATA`](#instr-jmpxdata)。 | `126/51` |
| **`DB3F`** | `RETDATA` |  | 等同于 [`c0 PUSHCTR`](#instr-pushctr) [`JMPXDATA`](#instr-jmpxdata)。这样，当前 continuation 的剩余部分被转换成一个 _Slice_ 并返回给调用者。 | `26` |
### 8.2 条件控制流原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`DC`** | `IFRET`<br/>`IFNOT:` | _`f - `_ | 如果整数 `f` 非零，则执行 [`RET`](#instr-ret)。如果 `f` 是 `NaN`, 抛出一个整数溢出异常。 | `18` |
| **`DD`** | `IFNOTRET`<br/>`IF:` | _`f - `_ | 如果整数 `f` 为零，则执行 [`RET`](#instr-ret)。 | `18` |
| **`DE`** | `IF` | _`f c - `_ | 如果整数 `f` 非零，执行 `c`（即，_执行_ `c`），否则简单地丢弃两个值。 | `18` |
| **`DE`** | `IF:<{ code }>`<br/>`<{ code }>IF` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IF`](#instr-if)。 |  |
| **`DF`** | `IFNOT` | _`f c - `_ | 如果整数 `f` 为零，则执行 continuation `c`，否则简单地丢弃两个值。 | `18` |
| **`DF`** | `IFNOT:<{ code }>`<br/>`<{ code }>IFNOT` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IFNOT`](#instr-ifnot)。 |  |
| **`E0`** | `IFJMP` | _`f c - `_ | 只有当 `f` 非零时，跳转到 `c`（类似于 [`JMPX`](#instr-jmpx)）。 | `18` |
| **`E0`** | `IFJMP:<{ code }>` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IFJMP`](#instr-ifjmp)。 |  |
| **`E1`** | `IFNOTJMP` | _`f c - `_ | 只有当 `f` 为零时，跳转到 `c`（类似于 [`JMPX`](#instr-jmpx)）。 | `18` |
| **`E1`** | `IFNOTJMP:<{ code }>` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IFNOTJMP`](#instr-ifnotjmp)。 |  |
| **`E2`** | `IFELSE` | _`f c c' - `_ | 如果整数 `f` 非零，执行 `c`，否则执行 `c'`。等同于 [`CONDSELCHK`](#instr-condselchk) [`EXECUTE`](#instr-execute)。 | `18` |
| **`E2`** | `IF:<{ code1 }>ELSE<{ code2 }>` | _`f -`_ | 等同于 [`<{ code1 }> CONT`](#instr-pushcont) [`<{ code2 }> CONT`](#instr-pushcont) [`IFELSE`](#instr-ifelse)。 |  |
| **`E300`** | `[ref] IFREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IF`](#instr-if)，但优化了cell引用不实际加载入一个 _Slice_ 再转换成一个普通 _Continuation_ 如果 `f=0`。<br/>这个原语的 Gas 消耗取决于 `f=0` 以及引用是否之前加载过。<br/>类似的评论适用于接受 continuation 作为引用的其他原语。 | `26/126/51` |
| **`E301`** | `[ref] IFNOTREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFNOT`](#instr-ifnot)。 | `26/126/51` |
| **`E302`** | `[ref] IFJMPREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFJMP`](#instr-ifjmp)。 | `26/126/51` |
| **`E303`** | `[ref] IFNOTJMPREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFNOTJMP`](#instr-ifnotjmp)。 | `26/126/51` |
| **`E304`** | `CONDSEL` | _`f x y - x 或 y`_ | 如果整数 `f` 非零，返回 `x`，否则返回 `y`。注意 `x` 和 `y` 上不执行类型检查；因此，它更像是一个条件栈操作。大致等同于 [`ROT`](#instr-rot) [`ISZERO`](#instr-iszero) [`INC`](#instr-inc) [`ROLLX`](#instr-rollx) [`NIP`](#instr-nip)。 | `26` |
| **`E305`** | `CONDSELCHK` | _`f x y - x 或 y`_ | 与 [`CONDSEL`](#instr-condsel) 相同，但首先检查 `x` 和 `y` 是否类型相同。 | `26` |
| **`E308`** | `IFRETALT` | _`f -`_ | 如果整数 `f!=0` 执行 [`RETALT`](#instr-retalt)。 | `26` |
| **`E309`** | `IFNOTRETALT` | _`f -`_ | 如果整数 `f=0` 执行 [`RETALT`](#instr-retalt)。 | `26` |
| **`E30D`** | `[ref] IFREFELSE` | _`f c -`_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`SWAP`](#instr-swap) [`IFELSE`](#instr-ifelse)，但优化了在 `f=0` 时，实际上并不需要将cell引用加载进一个_Slice_，然后再转换成普通的 _Continuation_。对接下来的两个原语也适用类似的备注：只有在必要时，才将cell转换成 continuations。 | `26/126/51` |
| **`E30E`** | `[ref] IFELSEREF` | _`f c -`_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFELSE`](#instr-ifelse)。 | `26/126/51` |
| **`E30F`** | `[ref] [ref] IFREFELSEREF` | _`f -`_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`PUSHREFCONT`](#instr-pushrefcont) [`IFELSE`](#instr-ifelse)。 | `126/51` |
| **`E39_n`** | `[n] IFBITJMP` | _`x c - x`_ | 检查整数 `x` 中是否设置了位 `0 <= n <= 31`，如果是，则执行 [`JMPX`](#instr-jmpx) 跳转到 continuation `c`。值 `x` 保留在栈中。 | `26` |
| **`E3B_n`** | `[n] IFNBITJMP` | _`x c - x`_ | 如果整数 `x` 中位 `0 <= n <= 31` 未设置，跳转到 `c`。 | `26` |
| **`E3D_n`** | `[ref] [n] IFBITJMPREF` | _`x - x`_ | 如果整数 `x` 中设置了位 `0 <= n <= 31`，执行 [`JMPREF`](#instr-jmpref)。 | `126/51` |
| **`E3F_n`** | `[ref] [n] IFNBITJMPREF` | _`x - x`_ | 如果整数 `x` 中未设置位 `0 <= n <= 31`，执行 [`JMPREF`](#instr-jmpref)。 | `126/51` |
### 8.3 控制流原语：循环
| xxxxxxx<br />操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`E4`** | `REPEAT` | _`n c - `_ | 如果整数 `n` 为非负数，则执行 continuation `c` `n` 次。如果 `n>=2^31` 或 `n<-2^31`，会生成一个范围检查异常。<br/>注意，在 `c` 的代码内部的 [`RET`](#instr-ret) 作为 `continue` 使用，而不是 `break`。应使用另一种（实验性的）循环或者 [`RETALT`](#instr-retalt)（循环前与 [`SETEXITALT`](#instr-setexitalt) 一起使用）来从循环中 `break` 出去。 | `18` |
| **`E4`** | `REPEAT:<{ code }>`<br/>`<{ code }>REPEAT` | _`n -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`REPEAT`](#instr-repeat)。 |  |
| **`E5`** | `REPEATEND`<br/>`REPEAT:` | _`n - `_ | 类似于 [`REPEAT`](#instr-repeat)，但它应用于当前 continuation `cc`。 | `18` |
| **`E6`** | `UNTIL` | _`c - `_ | 执行 continuation `c`，然后从结果栈中弹出一个整数 `x`。如果 `x` 为零，执行此循环的另一次迭代。这个原语的实际实现涉及一个特殊的 continuation `ec_until`，其参数设置为循环体（continuation `c`）和原始的当前 continuation `cc`。然后这个特殊的 continuation 被保存到 `c` 的 savelist 作为 `c.c0`，然后执行修改后的 `c`。其他循环原语也类似地借助适当的特殊 continuations 实现。 | `18` |
| **`E6`** | `UNTIL:<{ code }>`<br/>`<{ code }>UNTIL` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`UNTIL`](#instr-until)。 |  |
| **`E7`** | `UNTILEND`<br/>`UNTIL:` | _`-`_ | 类似于 [`UNTIL`](#instr-until)，但在循环中执行当前 continuation `cc`。当满足循环退出条件时，执行 [`RET`](#instr-ret)。 | `18` |
| **`E8`** | `WHILE` | _`c' c - `_ | 执行 `c'` 并从结果栈中弹出一个整数 `x`。如果 `x` 为零，则退出循环并将控制权转移给原始 `cc`。如果 `x` 非零，则执行 `c`，然后开始新的迭代。 | `18` |
| **`E8`** | `WHILE:<{ cond }>DO<{ code }>` | _`-`_ | 等同于 [`<{ cond }> CONT`](#instr-pushcont) [`<{ code }> CONT`](#instr-pushcont) [`WHILE`](#instr-while)。 |  |
| **`E9`** | `WHILEEND` | _`c' - `_ | 类似于 [`WHILE`](#instr-while)，但使用当前 continuation `cc` 作为循环体。 | `18` |
| **`EA`** | `AGAIN` | _`c - `_ | 类似于 [`REPEAT`](#instr-repeat)，但无限次执行 `c`。一个 [`RET`](#instr-ret) 只是开始一个无限循环的新迭代，只能通过异常或 [`RETALT`](#instr-retalt)（或显式的 [`JMPX`](#instr-jmpx)）退出。 | `18` |
| **`EA`** | `AGAIN:<{ code }>`<br/>`<{ code }>AGAIN` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`AGAIN`](#instr-again)。 |  |
| **`EB`** | `AGAINEND`<br/>`AGAIN:` | _`-`_ | 类似于 [`AGAIN`](#instr-again)，但相对于当前 continuation `cc` 执行。 | `18` |
| **`E314`** | `REPEATBRK` | _`n c -`_ | 类似于 [`REPEAT`](#instr-repeat)，但在将旧的 `c1` 值保存到原始 `cc`的 savelist 后，还将 `c1` 设置为原始 `cc`。这样，[`RETALT`](#instr-retalt) 可以用来退出循环体。 | `26` |
| **`E314`** | `REPEATBRK:<{ code }>`<br/>`<{ code }>REPEATBRK` | _`n -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`REPEATBRK`](#instr-repeatbrk)。 |  |
| **`E315`** | `REPEATENDBRK` | _`n -`_ | 类似于 [`REPEATEND`](#instr-repeatend)，但在将旧的 `c1` 值保存到原始 `c0`的 savelist 后，还将 `c1` 设置为原始 `c0`。等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`REPEATEND`](#instr-repeatend)。 | `26` |
| **`E316`** | `UNTILBRK` | _`c -`_ | 类似于 [`UNTIL`](#instr-until)，但也以与 [`REPEATBRK`](#instr-repeatbrk) 相同的方式修改 `c1`。 | `26` |
| **`E316`** | `UNTILBRK:<{ code }>` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`UNTILBRK`](#instr-untilbrk)。 |  |
| **`E317`** | `UNTILENDBRK`<br/>`UNTILBRK:` | _`-`_ | 等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`UNTILEND`](#instr-untilend)。 | `26` |
| **`E318`** | `WHILEBRK` | _`c' c -`_ | 类似于 [`WHILE`](#instr-while)，但也以与 [`REPEATBRK`](#instr-repeatbrk) 相同的方式修改 `c1`。 | `26` |
| **`E318`** | `WHILEBRK:<{ cond }>DO<{ code }>` | _`-`_ | 等同于 [`<{ cond }> CONT`](#instr-pushcont) [`<{ code }> CONT`](#instr-pushcont) [`WHILEBRK`](#instr-whilebrk)。 |  |
| **`E319`** | `WHILEENDBRK` | _`c -`_ | 等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`WHILEEND`](#instr-whileend)。 | `26` |
| **`E31A`** | `AGAINBRK` | _`c -`_ | 类似于 [`AGAIN`](#instr-again)，但也以与 [`REPEATBRK`](#instr-repeatbrk) 相同的方式修改 `c1`。 | `26` |
| **`E31A`** | `AGAINBRK:<{ code }>` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`AGAINBRK`](#instr-againbrk)。 |  |
| **`E31B`** | `AGAINENDBRK`<br/>`AGAINBRK:` | _`-`_ | 等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`AGAINEND`](#instr-againend)。 | `26` |
### 8.4 操作 continuation 栈
这里的 `s"` 是[在 continuations 之间移动栈元素的费用](#11-gas-prices)。它等于结果栈的大小减去32（如果栈大小小于32，则为0）。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`ECrn`** | `[r] [n] SETCONTARGS` | _`x_1 x_2...x_r c - c'`_ | 类似于 [`[r] -1 SETCONTARGS`](#instr-setcontargs-n)，但将 `c.nargs` 设置为 `c'` 的栈的最终大小加上 `n`。换句话说，将 `c` 转换成一个_闭包_或_部分应用函数_，缺少 `0 <= n <= 14` 个参数。 | `26+s”` |
| **`EC0n`** | `[n] SETNUMARGS` | _`c - c'`_ | 设置 `c.nargs` 为 `n` 加上 `c` 的当前栈的深度，其中 `0 <= n <= 14`。如果 `c.nargs` 已经设置为非负值，则不进行任何操作。 | `26` |
| **`ECrF`** | `[r] -1 SETCONTARGS` | _`x_1 x_2...x_r c - c'`_ | 将 `0 <= r <= 15` 个值 `x_1...x_r` 推入（复制的）continuation `c` 的栈中，从 `x_1` 开始。如果 `c` 的栈最终深度超过了 `c.nargs`，将生成栈溢出异常。 | `26+s”` |
| **`ED0p`** | `[p] RETURNARGS` | _`-`_ | 仅保留当前栈顶的 `0 <= p <= 15` 个值（类似于 [`ONLYTOPX`](#instr-onlytopx)），所有未使用的底部值不被丢弃，而是以与 [`SETCONTARGS`](#instr-setcontargs-n) 相同的方式保存到 continuation `c0` 中。 | `26+s”` |
| **`ED10`** | `RETURNVARARGS` | _`p -`_ | 类似于 [`RETURNARGS`](#instr-returnargs)，但从栈中取整数 `0 <= p <= 255`。 | `26+s”` |
| **`ED11`** | `SETCONTVARARGS` | _`x_1 x_2...x_r c r n - c'`_ | 类似于 [`SETCONTARGS`](#instr-setcontargs-n)，但从栈中取 `0 <= r <= 255` 和 `-1 <= n <= 255`。 | `26+s”` |
| **`ED12`** | `SETNUMVARARGS` | _`c n - c'`_ | `-1 <= n <= 255`<br/>如果 `n=-1`，此操作不进行任何操作（`c'=c`）。<br/>否则其行为类似于 [`[n] SETNUMARGS`](#instr-setnumargs)，但 `n` 是从栈中取得的。 | `26` |
### 8.5 创建简单的 continuations 和 闭包
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`ED1E`** | `BLESS` | _`s - c`_ | 将 _Slice_ `s` 转换为简单的普通 continuation `c`，其中 `c.code=s`，并且栈和 savelist 为空。 | `26` |
| **`ED1F`** | `BLESSVARARGS` | _`x_1...x_r s r n - c`_ | 等同于 [`ROT`](#instr-rot) [`BLESS`](#instr-bless) [`ROTREV`](#instr-rotrev) [`SETCONTVARARGS`](#instr-setcontvarargs)。 | `26+s”` |
| **`EErn`** | `[r] [n] BLESSARGS` | _`x_1...x_r s - c`_ | `0 <= r <= 15`, `-1 <= n <= 14`<br/>等同于 [`BLESS`](#instr-bless) [`[r] [n] SETCONTARGS`](#instr-setcontargs-n)。<br/>`n` 的值由 4 位整数 `n mod 16` 内部表示。 | `26` |
| **`EE0n`** | `[n] BLESSNUMARGS` | _`s - c`_ | 也将 _Slice_ `s` 转换为 _Continuation_ `c`，但将 `c.nargs` 设置为 `0 <= n <= 14`。 | `26` |
### 8.6 Continuation 保存列表和控制寄存器的操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`ED4i`** | `c[i] PUSHCTR`<br/>`c[i] PUSH` | _`- x`_ | 推送控制寄存器 `c(i)` 的当前值。如果当前代码页不支持该控制寄存器，或者它没有值，则触发异常。 | `26` |
| **`ED44`** | `c4 PUSHCTR`<br/>`c4 PUSH` | _`- x`_ | 推送“全局数据根”cell引用，从而使访问持久智能合约数据成为可能。 | `26` |
| **`ED5i`** | `c[i] POPCTR`<br/>`c[i] POP` | _`x - `_ | 从栈中弹出一个值 `x` 并存储到控制寄存器 `c(i)` 中（如果当前代码页支持）。注意，如果控制寄存器仅接受特定类型的值，则可能发生类型检查异常。 | `26` |
| **`ED54`** | `c4 POPCTR`<br/>`c4 POP` | _`x -`_ | 设置“全局数据根”cell引用，从而允许修改持久智能合约数据。 | `26` |
| **`ED6i`** | `c[i] SETCONT`<br/>`c[i] SETCONTCTR` | _`x c - c'`_ | 将 `x` 存储到 continuation `c` 的 savelist 中作为 `c(i)`，并返回结果 continuation `c'`。几乎所有与 continuations 的操作都可以用 [`SETCONTCTR`](#instr-setcontctr)、[`POPCTR`](#instr-popctr) 和 [`PUSHCTR`](#instr-pushctr) 来表达。 | `26` |
| **`ED7i`** | `c[i] SETRETCTR` | _`x - `_ | 等同于 [`c0 PUSHCTR`](#instr-pushctr) [`c[i] SETCONTCTR`](#instr-setcontctr) [`c0 POPCTR`](#instr-popctr)。 | `26` |
| **`ED8i`** | `c[i] SETALTCTR` | _`x - `_ | 等同于 [`c1 PUSHCTR`](#instr-pushctr) [`c[i] SETCONTCTR`](#instr-setcontctr) [`c0 POPCTR`](#instr-popctr)。 | `26` |
| **`ED9i`** | `c[i] POPSAVE`<br/>`c[i] POPCTRSAVE` | _`x -`_ | 类似于 [`c[i] POPCTR`](#instr-popctr)，但还将 `c[i]` 的旧值保存到 continuation `c0` 中。<br/>等同于（直到异常）[`c[i] SAVECTR`](#instr-save) [`c[i] POPCTR`](#instr-popctr)。 | `26` |
| **`EDAi`** | `c[i] SAVE`<br/>`c[i] SAVECTR` |  | 将 `c(i)` 的当前值保存到 continuation `c0` 的 savelist 中。如果 `c0` 的 savelist 中已存在 `c[i]` 的条目，则不做任何操作。等同于 [`c[i] PUSHCTR`](#instr-pushctr) [`c[i] SETRETCTR`](#instr-setretctr)。 | `26` |
| **`EDBi`** | `c[i] SAVEALT`<br/>`c[i] SAVEALTCTR` |  | 类似于 [`c[i] SAVE`](#instr-save)，但将 `c[i]` 的当前值保存到 `c1`（而不是 `c0`）的 savelist 中。 | `26` |
| **`EDCi`** | `c[i] SAVEBOTH`<br/>`c[i] SAVEBOTHCTR` |  | 等同于 [`DUP`](#instr-dup) [`c[i] SAVE`](#instr-save) [`c[i] SAVEALT`](#instr-savealt)。 | `26` |
| **`EDE0`** | `PUSHCTRX` | _`i - x`_ | 类似于 [`c[i] PUSHCTR`](#instr-pushctr)，但 `i`, `0 <= i <= 255`, 来自栈。<br/>注意，这个原语是少数“异乎寻常”的原语之一，它们不像栈操作原语那样是多态的，同时参数和返回值的类型也没有良好定义，因为 `x` 的类型取决于 `i`。 | `26` |
| **`EDE1`** | `POPCTRX` | _`x i - `_ | 类似于 [`c[i] POPCTR`](#instr-popctr)，但 `0 <= i <= 255` 来自栈。 | `26` |
| **`EDE2`** | `SETCONTCTRX` | _`x c i - c'`_ | 类似于 [`c[i] SETCONTCTR`](#instr-setcontctr)，但 `0 <= i <= 255` 来自栈。 | `26` |
| **`EDF0`** | `COMPOS`<br/>`BOOLAND` | _`c c' - c''`_ | 计算组合 `compose0(c, c’)`，它的意义为“执行 `c`，如果成功，执行 `c'`”（如果 `c` 是布尔电路）或简单地“执行 `c`，然后执行 `c'`”。等同于 [`SWAP`](#instr-swap) [`c0 SETCONT`](#instr-setcontctr)。 | `26` |
| **`EDF1`** | `COMPOSALT`<br/>`BOOLOR` | _`c c' - c''`_ | 计算替代组合 `compose1(c, c’)`，它的意义为“执行 `c`，如果不成功，执行 `c'`”（如果 `c` 是布尔电路）。等同于 [`SWAP`](#instr-swap) [`c1 SETCONT`](#instr-setcontctr)。 | `26` |
| **`EDF2`** | `COMPOSBOTH` | _`c c' - c''`_ | 计算组合 `compose1(compose0(c, c’), c’)`，它的意义为“计算布尔电路 `c`，然后无论 `c` 的结果如何，都计算 `c'`”。 | `26` |
| **`EDF3`** | `ATEXIT` | _`c - `_ | 将 `c0` 设置为 `compose0(c, c0)`。换句话说，`c` 将在退出当前子程序之前执行。 | `26` |
| **`EDF3`** | `ATEXIT:<{ code }>`<br/>`<{ code }>ATEXIT` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`ATEXIT`](#instr-atexit)。 |  |
| **`EDF4`** | `ATEXITALT` | _`c - `_ | 将 `c1` 设置为 `compose1(c, c1)`。换句话说，`c` 将在通过其替代返回路径退出当前子程序之前执行。 | `26` |
| **`EDF4`** | `ATEXITALT:<{ code }>`<br/>`<{ code }>ATEXITALT` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`ATEXITALT`](#instr-atexitalt)。 |  |
| **`EDF5`** | `SETEXITALT` | _`c - `_ | 将 `c1` 设置为 `compose1(compose0(c, c0), c1)`，<br/>这样，后续的 [`RETALT`](#instr-retalt) 将首先执行 `c`，然后将控制权转移给原始的 `c0`。例如，这可以用来从嵌套循环中退出。 | `26` |
| **`EDF6`** | `THENRET` | _`c - c'`_ | 计算 `compose0(c, c0)`。 | `26` |
| **`EDF7`** | `THENRETALT` | _`c - c'`_ | 计算 `compose0(c, c1)` | `26` |
| **`EDF8`** | `INVERT` | _`-`_ | 交换 `c0` 和 `c1`。 | `26` |
| **`EDF9`** | `BOOLEVAL` | _`c - ?`_ | 执行 `cc:=compose1(compose0(c, compose0(-1 PUSHINT, cc)), compose0(0 PUSHINT, cc))`。如果 `c` 代表一个布尔电路，其最终效果是评估它，并在继续执行之前将 `-1` 或 `0` 推入栈中。 | `26` |
| **`EDFA`** | `SAMEALT` | _`-`_ | 将 `c1` 设置为 `c0`。等同于 [`c0 PUSHCTR`](#instr-pushctr) [`c1 POPCTR`](#instr-popctr)。 | `26` |
| **`EDFB`** | `SAMEALTSAVE` | _`-`_ | 将 `c1` 设置为 `c0`，但首先将 `c1` 的旧值保存到 `c0` 的 savelist 中。<br/>等同于 [`c1 SAVE`](#instr-save) [`SAMEALT`](#instr-samealt)。 | `26` |
### 8.7 字典子程序调用和跳转
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F0nn`** | `[nn] CALL`<br/>`[nn] CALLDICT` | _`- nn`_ | 调用 `c3` 中的 continuation，将整数 `0 <= nn <= 255` 作为参数推入其栈。<br/>大致相当于 [`[nn] PUSHINT`](#instr-pushint-4) [`c3 PUSHCTR`](#instr-pushctr) [`EXECUTE`](#instr-execute)。 |  |
| **`F12_n`** | `[n] CALL`<br/>`[n] CALLDICT` | _`- n`_ | 对于 `0 <= n < 2^14`，这是更大值的 `n` 的 [`[n] CALL`](#instr-calldict) 的编码。 |  |
| **`F16_n`** | `[n] JMP` | _` - n`_ | 跳转到 `c3` 中的 continuation，将整数 `0 <= n < 2^14` 作为其参数推入。<br/>大致相当于 [`n PUSHINT`](#instr-pushint-4) [`c3 PUSHCTR`](#instr-pushctr) [`JMPX`](#instr-jmpx)。 |  |
| **`F1A_n`** | `[n] PREPARE`<br/>`[n] PREPAREDICT` | _` - n c`_ | 等同于 [`n PUSHINT`](#instr-pushint-4) [`c3 PUSHCTR`](#instr-pushctr)，适用于 `0 <= n < 2^14`。<br/>这样，[`[n] CALL`](#instr-calldict) 大致等同于 [`[n] PREPARE`](#instr-preparedict) [`EXECUTE`](#instr-execute)，而 [`[n] JMP`](#instr-jmpdict) 大致等同于 [`[n] PREPARE`](#instr-preparedict) [`JMPX`](#instr-jmpx)。<br/>例如，这里可以使用 [`CALLXARGS`](#instr-callxargs) 或 [`CALLCC`](#instr-callcc) 代替 [`EXECUTE`](#instr-execute)。 |  |

## 9 异常产生与处理原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F22_n`** | `[n] THROW` | _` - 0 n`_ | 抛出参数为零的 `0 <= n <= 63` 异常。<br/>换句话说，它将控制权转移到 `c2` 中的continuation，将 `0` 和 `n` 推入其堆栈，并彻底丢弃旧堆栈。 | `76` |
| **`F26_n`** | `[n] THROWIF` | _`f - `_ | 只有当整数 `f!=0` 时，才抛出参数为零的 `0 <= n <= 63` 异常。 | `26/76` |
| **`F2A_n`** | `[n] THROWIFNOT` | _`f - `_ | 只有当整数 `f=0` 时，才抛出参数为零的 `0 <= n <= 63` 异常。 | `26/76` |
| **`F2C4_n`** | `[n] THROW` | _`- 0 nn`_ | 对于 `0 <= n < 2^11`，是 [`[n] THROW`](#instr-throw-short) 的编码，用于 `n` 的较大值。 | `84` |
| **`F2CC_n`** | `[n] THROWARG` | _`x - x nn`_ | 抛出带有参数 `x` 的 `0 <= n <  2^11` 异常，通过将 `x` 和 `n` 复制到 `c2` 的堆栈并将控制权转移给 `c2`。 | `84` |
| **`F2D4_n`** | `[n] THROWIF` | _`f - `_ | 对于 `0 <= n < 2^11`，是 [`[n] THROWIF`](#instr-throwif-short) 的编码，用于 `n` 的较大值。 | `34/84` |
| **`F2DC_n`** | `[n] THROWARGIF` | _`x f - `_ | 只有当整数 `f!=0` 时，才抛出带有参数 `x` 的 `0 <= nn < 2^11` 异常。 | `34/84` |
| **`F2E4_n`** | `[n] THROWIFNOT` | _`f - `_ | 对于 `0 <= n < 2^11`，是 [`[n] THROWIFNOT`](#instr-throwifnot-short) 的编码，用于 `n` 的较大值。 | `34/84` |
| **`F2EC_n`** | `[n] THROWARGIFNOT` | _`x f - `_ | 只有当整数 `f=0` 时，才抛出带有参数 `x` 的 `0 <= n < 2^11` 异常。 | `34/84` |
| **`F2F0`** | `THROWANY` | _`n - 0 n`_ | 抛出参数为零的 `0 <= n < 2^16` 异常。<br/>大致相当于 [`ZERO`](#instr-zero) [`SWAP`](#instr-swap) [`THROWARGANY`](#instr-throwargany)。 | `76` |
| **`F2F1`** | `THROWARGANY` | _`x n - x n`_ | 抛出带有参数 `x` 的 `0 <= n < 2^16` 异常，将控制权转移到 `c2` 中。<br/>大致相当于 [`c2 PUSHCTR`](#instr-pushctr) [`2 JMPXARGS`](#instr-jmpxargs)。 | `76` |
| **`F2F2`** | `THROWANYIF` | _`n f - `_ | 只有当 `f!=0` 时，才抛出参数为零的 `0 <= n < 2^16` 异常。 | `26/76` |
| **`F2F3`** | `THROWARGANYIF` | _`x n f - `_ | 只有当 `f!=0` 时，才抛出带有参数 `x` 的 `0 <= n<2^16` 异常。 | `26/76` |
| **`F2F4`** | `THROWANYIFNOT` | _`n f - `_ | 只有当 `f=0` 时，才抛出参数为零的 `0 <= n<2^16` 异常。 | `26/76` |
| **`F2F5`** | `THROWARGANYIFNOT` | _`x n f - `_ | 只有当 `f=0` 时，才抛出带有参数 `x` 的 `0 <= n<2^16` 异常。 | `26/76` |
| **`F2FF`** | `TRY` | _`c c' - `_ | 设置 `c2` 为 `c'`，首先将 `c2` 的旧值同时保存到 `c'` 的保存列表和当前continuation的保存列表中，该当前continuation存储到 `c.c0` 和 `c'.c0` 中。然后类似于 [`EXECUTE`](#instr-execute) 运行 `c`。如果 `c` 没有引发任何异常，从 `c` 返回时会自动恢复 `c2` 的原始值。如果发生异常，则执行权转移到 `c'`，但在此过程中恢复了 `c2` 的原始值，以便 `c'` 可以通过 [`THROWANY`](#instr-throwany) 重新抛出异常（如果它自己无法处理）。 | `26` |
| **`F2FF`** | `TRY:<{ code1 }>CATCH<{ code2 }>` | _`-`_ | 等效于 [`<{ code1 }> CONT`](#instr-pushcont) [`<{ code2 }> CONT`](#instr-pushcont) [`TRY`](#instr-try)。 |  |
| **`F3pr`** | `[p] [r] TRYARGS` | _`c c' - `_ | 类似于 [`TRY`](#instr-try)，但内部使用的是 [`[p] [r] CALLXARGS`](#instr-callxargs) 而不是 [`EXECUTE`](#instr-execute)。<br/>这样，顶部 `0 <= p <= 15` 堆栈元素以外的所有元素将保存到当前continuation的堆栈中，然后从 `c` 或 `c'` 返回时恢复，并将 `c` 或 `c'` 的结果堆栈的顶部 `0 <= r <= 15` 值作为返回值复制。 | `26` |

## 10 字典操作原语
大多数字典操作的燃气消耗不是固定的，它取决于给定字典的内容。
### 10.1 字典创建
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`6D`** | `NEWDICT` | _` - D`_ | 返回一个新的空字典。<br/>它是 [`PUSHNULL`](#instr-null) 的另一种助记符。 | `18` |
| **`6E`** | `DICTEMPTY` | _`D - ?`_ | 检查字典 `D` 是否为空，并相应地返回 `-1` 或 `0`。<br/>它是 [`ISNULL`](#instr-isnull) 的另一种助记符。 | `18` |
### 10.2 字典序列化与反序列化
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`CE`** | `STDICTS`<br/>`` | _`s b - b'`_ | 将以_切片_表示的字典 `s` 存储进_构建器_ `b`中。<br/>实际上，这是 [`STSLICE`](#instr-stslice) 的同义词。 | `18` |
| **`F400`** | `STDICT`<br/>`STOPTREF` | _`D b - b'`_ | 将字典 `D` 存入_构建器_ `b`，返回结果 _构建器_ `b'`。<br/>换言之，如果 `D` 是一个cell，执行 [`STONE`](#instr-stone) 和 [`STREF`](#instr-stref)；如果 `D` 是 _Null_，执行 [`NIP`](#instr-nip) 和 [`STZERO`](#instr-stzero)；否则抛出类型检查异常。 | `26` |
| **`F401`** | `SKIPDICT`<br/>`SKIPOPTREF` | _`s - s'`_ | 相当于 [`LDDICT`](#instr-lddict) [`NIP`](#instr-nip)。 | `26` |
| **`F402`** | `LDDICTS` | _`s - s' s''`_ | 从_切片_ `s`中加载（解析）以_切片_表示的字典 `s'`，并将 `s`的剩余部分作为 `s''` 返回。<br/>这是所有 `HashmapE(n,X)` 类型字典的“分裂函数”。 | `26` |
| **`F403`** | `PLDDICTS` | _`s - s'`_ | 从_切片_ `s`中预加载以_切片_表示的字典 `s'`。<br/>大致相当于 [`LDDICTS`](#instr-lddicts) [`DROP`](#instr-drop)。 | `26` |
| **`F404`** | `LDDICT`<br/>`LDOPTREF` | _`s - D s'`_ | 从_切片_ `s`中加载（解析）字典 `D`，并将 `s`的剩余部分作为 `s'` 返回。可应用于字典或任意 `(^Y)?` 类型的值。 | `26` |
| **`F405`** | `PLDDICT`<br/>`PLDOPTREF` | _`s - D`_ | 从_切片_ `s`中预加载字典 `D`。<br/>大致相当于 [`LDDICT`](#instr-lddict) [`DROP`](#instr-drop)。 | `26` |
| **`F406`** | `LDDICTQ` | _`s - D s' -1或 s 0`_ | [`LDDICT`](#instr-lddict) 的静默版本。 | `26` |
| **`F407`** | `PLDDICTQ` | _`s - D -1或0`_ | [`PLDDICT`](#instr-plddict) 的静默版本。 | `26` |
### 10.3 获取字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F40A`** | `DICTGET` | _`k D n - x -1或0`_ | 在类型为 `HashmapE(n,X)` 且拥有 `n`-位键的字典 `D` 中查找键 `k`（由_切片_表示，其前 `0 <= n <= 1023` 数据位被用作键）。<br/>成功时，以_切片_ `x` 的形式返回找到的值。 |  |
| **`F40B`** | `DICTGETREF` | _`k D n - c -1或0`_ | 与 [`DICTGET`](#instr-dictget) 类似，但在成功时对 `x` 应用 [`LDREF`](#instr-ldref) [`ENDS`](#instr-ends)。<br/>此操作对于类型为 `HashmapE(n,^Y)` 的字典很有用。 |  |
| **`F40C`** | `DICTIGET` | _`i D n - x -1或0`_ | 与 [`DICTGET`](#instr-dictget) 类似，但使用带符号的（大端）`n`-位 _整型_ `i` 作为键。如果 `i` 不能放入 `n` 位，则返回 `0`。如果 `i` 是 `NaN`，抛出整数溢出异常。 |  |
| **`F40D`** | `DICTIGETREF` | _`i D n - c -1或0`_ | 组合 [`DICTIGET`](#instr-dictiget) 与 [`DICTGETREF`](#instr-dictgetref)：它使用带符号的 `n`-位 _整型_ `i` 作为键，并在成功时返回 _cell_ 而不是_切片_。 |  |
| **`F40E`** | `DICTUGET` | _`i D n - x -1或0`_ | 与 [`DICTIGET`](#instr-dictiget) 类似，但使用_无符号_的（大端）`n`-位 _整型_ `i` 作为键。 |  |
| **`F40F`** | `DICTUGETREF` | _`i D n - c -1或0`_ | 与 [`DICTIGETREF`](#instr-dictigetref) 类似，但使用一个无符号 `n`-位 _整型_ 键 `i`。 |  |
### 10.4 设置/替换/添加字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F412`** | `DICTSET` | _`x k D n - D'`_ | 在字典 `D`（同样用_切片_表示）中设置 `n`-位键 `k`（如 [`DICTGET`](#instr-dictget) 中用_切片_表示）关联的值为 `x`（再次是_切片_），并返回结果字典 `D'`。 |  |
| **`F413`** | `DICTSETREF` | _`c k D n - D'`_ | 类似于 [`DICTSET`](#instr-dictset)，但设置的值为对_cell_ `c` 的引用。 |  |
| **`F414`** | `DICTISET` | _`x i D n - D'`_ | 类似于 [`DICTSET`](#instr-dictset)，但键由（大端）有符号 `n`-位整数 `i` 表示。如果 `i` 不能放入 `n` 位，则生成范围检查异常。 |  |
| **`F415`** | `DICTISETREF` | _`c i D n - D'`_ | 类似于 [`DICTSETREF`](#instr-dictsetref)，但键由 [`DICTISET`](#instr-dictiset) 中的有符号 `n`-位整数表示。 |  |
| **`F416`** | `DICTUSET` | _`x i D n - D'`_ | 类似于 [`DICTISET`](#instr-dictiset)，但 `i` 为 _无符号_ `n`-位整数。 |  |
| **`F417`** | `DICTUSETREF` | _`c i D n - D'`_ | 类似于 [`DICTISETREF`](#instr-dictisetref)，但 `i` 为无符号。 |  |
| **`F41A`** | `DICTSETGET` | _`x k D n - D' y -1或 D' 0`_ | 结合 [`DICTSET`](#instr-dictset) 和 [`DICTGET`](#instr-dictget)：它将键 `k` 对应的值设置为 `x`，但也返回该键原有的旧值 `y`（如果存在）。 |  |
| **`F41B`** | `DICTSETGETREF` | _`c k D n - D' c' -1或 D' 0`_ | 类似于 [`DICTSETGET`](#instr-dictsetget) 的 [`DICTSETREF`](#instr-dictsetref) 与 [`DICTGETREF`](#instr-dictgetref) 的组合。 |  |
| **`F41C`** | `DICTISETGET` | _`x i D n - D' y -1或 D' 0`_ | [`DICTISETGET`](#instr-dictisetget)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F41D`** | `DICTISETGETREF` | _`c i D n - D' c' -1或 D' 0`_ | [`DICTISETGETREF`](#instr-dictisetgetref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F41E`** | `DICTUSETGET` | _`x i D n - D' y -1或 D' 0`_ | [`DICTISETGET`](#instr-dictisetget)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F41F`** | `DICTUSETGETREF` | _`c i D n - D' c' -1或 D' 0`_ | [`DICTISETGETREF`](#instr-dictisetgetref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F422`** | `DICTREPLACE` | _`x k D n - D' -1或 D 0`_ | 一个 _替换_ 操作，类似于 [`DICTSET`](#instr-dictset)，但只有当键 `k` 已经存在于 `D` 中时才会将 `D` 中键 `k` 的值设置为 `x`。 |  |
| **`F423`** | `DICTREPLACEREF` | _`c k D n - D' -1或 D 0`_ | [`DICTSETREF`](#instr-dictsetref) 的 _替换_ 对应操作。 |  |
| **`F424`** | `DICTIREPLACE` | _`x i D n - D' -1或 D 0`_ | [`DICTREPLACE`](#instr-dictreplace)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F425`** | `DICTIREPLACEREF` | _`c i D n - D' -1或 D 0`_ | [`DICTREPLACEREF`](#instr-dictreplaceref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F426`** | `DICTUREPLACE` | _`x i D n - D' -1或 D 0`_ | [`DICTREPLACE`](#instr-dictreplace)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F427`** | `DICTUREPLACEREF` | _`c i D n - D' -1或 D 0`_ | [`DICTREPLACEREF`](#instr-dictreplaceref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F42A`** | `DICTREPLACEGET` | _`x k D n - D' y -1或 D 0`_ | [`DICTSETGET`](#instr-dictsetget) 的 _替换_ 对应操作：成功时，还会返回与该键相关的旧值。 |  |
| **`F42B`** | `DICTREPLACEGETREF` | _`c k D n - D' c' -1或 D 0`_ | [`DICTSETGETREF`](#instr-dictsetgetref) 的 _替换_ 对应操作。 |  |
| **`F42C`** | `DICTIREPLACEGET` | _`x i D n - D' y -1或 D 0`_ | [`DICTREPLACEGET`](#instr-dictreplaceget)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F42D`** | `DICTIREPLACEGETREF` | _`c i D n - D' c' -1或 D 0`_ | [`DICTREPLACEGETREF`](#instr-dictreplacegetref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F42E`** | `DICTUREPLACEGET` | _`x i D n - D' y -1或 D 0`_ | [`DICTREPLACEGET`](#instr-dictreplaceget)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F42F`** | `DICTUREPLACEGETREF` | _`c i D n - D' c' -1或 D 0`_ | [`DICTREPLACEGETREF`](#instr-dictreplacegetref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F432`** | `DICTADD` | _`x k D n - D' -1或 D 0`_ | [`DICTSET`](#instr-dictset) 的 _添加_ 对应操作：在字典 `D` 中将与键 `k` 关联的值设置为 `x`，但只有当它还未在 `D` 中存在时。 |  |
| **`F433`** | `DICTADDREF` | _`c k D n - D' -1或 D 0`_ | [`DICTSETREF`](#instr-dictsetref) 的 _添加_ 对应操作。 |  |
| **`F434`** | `DICTIADD` | _`x i D n - D' -1或 D 0`_ | [`DICTADD`](#instr-dictadd)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F435`** | `DICTIADDREF` | _`c i D n - D' -1或 D 0`_ | [`DICTADDREF`](#instr-dictaddref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F436`** | `DICTUADD` | _`x i D n - D' -1或 D 0`_ | [`DICTADD`](#instr-dictadd)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F437`** | `DICTUADDREF` | _`c i D n - D' -1或 D 0`_ | [`DICTADDREF`](#instr-dictaddref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F43A`** | `DICTADDGET` | _`x k D n - D' -1或 D y 0`_ | [`DICTSETGET`](#instr-dictsetget) 的 _添加_ 对应操作：在字典 `D` 中将与键 `k` 关联的值设置为 `x`，但只有当键 `k` 还未在 `D` 中存在时。否则，仅返回旧值 `y`，不更改字典。 |  |
| **`F43B`** | `DICTADDGETREF` | _`c k D n - D' -1或 D c' 0`_ | [`DICTSETGETREF`](#instr-dictsetgetref) 的 _添加_ 对应操作。 |  |
| **`F43C`** | `DICTIADDGET` | _`x i D n - D' -1或 D y 0`_ | [`DICTADDGET`](#instr-dictaddget)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F43D`** | `DICTIADDGETREF` | _`c i D n - D' -1或 D c' 0`_ | [`DICTADDGETREF`](#instr-dictaddgetref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F43E`** | `DICTUADDGET` | _`x i D n - D' -1或 D y 0`_ | [`DICTADDGET`](#instr-dictaddget)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F43F`** | `DICTUADDGETREF` | _`c i D n - D' -1或 D c' 0`_ | [`DICTADDGETREF`](#instr-dictaddgetref)，但 `i` 为无符号 `n`-位整数。 |  |
### 10.5 接受构建器的字典设置操作变体
以下操作接受新值作为_构建器_ `b`，而不是_切片_ `x`。
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F441`** | `DICTSETB` | _`b k D n - D'`_ |  |  |
| **`F442`** | `DICTISETB` | _`b i D n - D'`_ |  |  |
| **`F443`** | `DICTUSETB` | _`b i D n - D'`_ |  |  |
| **`F445`** | `DICTSETGETB` | _`b k D n - D' y -1或 D' 0`_ |  |  |
| **`F446`** | `DICTISETGETB` | _`b i D n - D' y -1或 D' 0`_ |  |  |
| **`F447`** | `DICTUSETGETB` | _`b i D n - D' y -1或 D' 0`_ |  |  |
| **`F449`** | `DICTREPLACEB` | _`b k D n - D' -1或 D 0`_ |  |  |
| **`F44A`** | `DICTIREPLACEB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F44B`** | `DICTUREPLACEB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F44D`** | `DICTREPLACEGETB` | _`b k D n - D' y -1或 D 0`_ |  |  |
| **`F44E`** | `DICTIREPLACEGETB` | _`b i D n - D' y -1或 D 0`_ |  |  |
| **`F44F`** | `DICTUREPLACEGETB` | _`b i D n - D' y -1或 D 0`_ |  |  |
| **`F451`** | `DICTADDB` | _`b k D n - D' -1或 D 0`_ |  |  |
| **`F452`** | `DICTIADDB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F453`** | `DICTUADDB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F455`** | `DICTADDGETB` | _`b k D n - D' -1或 D y 0`_ |  |  |
| **`F456`** | `DICTIADDGETB` | _`b i D n - D' -1或 D y 0`_ |  |  |
| **`F457`** | `DICTUADDGETB` | _`b i D n - D' -1或 D y 0`_ |  |  |
### 10.6 删除字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F459`** | `DICTDEL` | _`k D n - D' -1或 D 0`_ | 从字典 `D` 中删除由_切片_ `k` 表示的 `n`-位键。如果键存在，返回修改后的字典 `D'` 和成功标志位 `-1`。否则，返回原始字典 `D` 和 `0`。 |  |
| **`F45A`** | `DICTIDEL` | _`i D n - D' ?`_ | [`DICTDEL`](#instr-dictdel) 的一个版本，键由有符号的 `n`-位 _整数_ `i` 表示。如果 `i` 不能放入 `n` 位，简单地返回 `D` `0`（“键未找到，字典未修改”）。 |  |
| **`F45B`** | `DICTUDEL` | _`i D n - D' ?`_ | 类似于 [`DICTIDEL`](#instr-dictidel)，但 `i` 为无符号的 `n`-位整数。 |  |
| **`F462`** | `DICTDELGET` | _`k D n - D' x -1或 D 0`_ | 从字典 `D` 中删除由_切片_ `k` 表示的 `n`-位键。如果键存在，返回修改后的字典 `D'`、与键 `k` 关联的原始值 `x`（由_切片_表示），和成功标志位 `-1`。否则，返回原始字典 `D` 和 `0`。 |  |
| **`F463`** | `DICTDELGETREF` | _`k D n - D' c -1或 D 0`_ | 类似于 [`DICTDELGET`](#instr-dictdelget)，但成功时对 `x` 应用 [`LDREF`](#instr-ldref) [`ENDS`](#instr-ends)，以便返回的值 `c` 是一个_cell_。 |  |
| **`F464`** | `DICTIDELGET` | _`i D n - D' x -1或 D 0`_ | [`DICTDELGET`](#instr-dictdelget)，但 `i` 为有符号的 `n`-位整数。 |  |
| **`F465`** | `DICTIDELGETREF` | _`i D n - D' c -1或 D 0`_ | [`DICTDELGETREF`](#instr-dictdelgetref)，但 `i` 为有符号的 `n`-位整数。 |  |
| **`F466`** | `DICTUDELGET` | _`i D n - D' x -1或 D 0`_ | [`DICTDELGET`](#instr-dictdelget)，但 `i` 为无符号的 `n`-位整数。 |  |
| **`F467`** | `DICTUDELGETREF` | _`i D n - D' c -1或 D 0`_ | [`DICTDELGETREF`](#instr-dictdelgetref)，但 `i` 为无符号的 `n`-位整数。 |  |
### 10.7 “可能是引用”的字典操作
以下操作假设使用字典存储类型为_可能是cell（Maybe Cell）_的值 `c?`。表示如下：如果 `c?` 是一个_cell_，它作为一个没有数据位且恰好有一个对这个_cell_的引用的值存储。如果 `c?` 是_Null_，则对应的键必须从字典中缺失。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F469`** | `DICTGETOPTREF` | _`k D n - c^?`_ | [`DICTGETREF`](#instr-dictgetref) 的一个变体，如果键 `k` 不存在于字典 `D` 中，则返回 _Null_ 而不是值 `c^?`。 |  |
| **`F46A`** | `DICTIGETOPTREF` | _`i D n - c^?`_ | [`DICTGETOPTREF`](#instr-dictgetoptref) 的版本，但 `i` 为有符号的 `n`-位整数。如果键 `i` 超出范围，也返回 _Null_。 |  |
| **`F46B`** | `DICTUGETOPTREF` | _`i D n - c^?`_ | [`DICTGETOPTREF`](#instr-dictgetoptref) 的版本，但 `i` 为无符号的 `n`-位整数。如果键 `i` 超出范围，也返回 _Null_。 |  |
| **`F46D`** | `DICTSETGETOPTREF` | _`c^? k D n - D' ~c^?`_ | [`DICTGETOPTREF`](#instr-dictgetoptref) 和 [`DICTSETGETREF`](#instr-dictsetgetref) 的一个变体，将字典 `D` 中键 `k` 对应的值设置为 `c^?`（如果 `c^?` 是_Null_，则删除该键），并返回旧值 `~c^?`（如果键 `k` 之前缺失，返回_Null_）。 |  |
| **`F46E`** | `DICTISETGETOPTREF` | _`c^? i D n - D' ~c^?`_ | 类似于 [`DICTSETGETOPTREF`](#instr-dictsetgetoptref) 的原语，但使用有符号的 `n`-位 _整数_ `i` 作为键。如果 `i` 不能放入 `n` 位，抛出范围检查异常。 |  |
| **`F46F`** | `DICTUSETGETOPTREF` | _`c^? i D n - D' ~c^?`_ | 类似于 [`DICTSETGETOPTREF`](#instr-dictsetgetoptref) 的原语，但使用无符号的 `n`-位 _整数_ `i` 作为键。 |  |
### 10.8 前缀码字典操作
构建前缀码字典的一些基本操作。
这些原语与它们非前缀码（[`DICTSET`](#instr-dictset) 等）的对应操作完全相同，不过在前缀码字典中，即使是 _Set_ 也可能失败，因此 [`PFXDICTSET`](#instr-pfxdictset) 也必须返回成功标志位。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F470`** | `PFXDICTSET` | _`x k D n - D' -1或 D 0`_ |  |  |
| **`F471`** | `PFXDICTREPLACE` | _`x k D n - D' -1或 D 0`_ |  |  |
| **`F472`** | `PFXDICTADD` | _`x k D n - D' -1或 D 0`_ |  |  |
| **`F473`** | `PFXDICTDEL` | _`k D n - D' -1或 D 0`_ |  |  |
### 10.9 GetNext 和 GetPrev 操作的变体
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F474`** | `DICTGETNEXT` | _`k D n - x' k' -1或 0`_ | 计算字典 `D` 中字典序大于 `k` 的最小键 `k'`，并返回 `k'`（由_切片_表示）及其关联的值 `x'`（也由_切片_表示）。 |  |
| **`F475`** | `DICTGETNEXTEQ` | _`k D n - x' k' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但计算字典序大于或等于 `k` 的最小键 `k'`。 |  |
| **`F476`** | `DICTGETPREV` | _`k D n - x' k' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但计算字典序小于 `k` 的最大键 `k'`。 |  |
| **`F477`** | `DICTGETPREVEQ` | _`k D n - x' k' -1或 0`_ | 类似于 [`DICTGETPREV`](#instr-dictgetprev)，但计算字典序小于或等于 `k` 的最大键 `k'`。 |  |
| **`F478`** | `DICTIGETNEXT` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但将字典 `D` 中的所有键解释为大端有符号的 `n`-位整数，并计算大于整数 `i` 的最小键 `i'`（`i` 不一定能放入 `n` 位）。 |  |
| **`F479`** | `DICTIGETNEXTEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXTEQ`](#instr-dictgetnexteq)，但将键解释为有符号的 `n`-位整数。 |  |
| **`F47A`** | `DICTIGETPREV` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREV`](#instr-dictgetprev)，但将键解释为有符号的 `n`-位整数。 |  |
| **`F47B`** | `DICTIGETPREVEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREVEQ`](#instr-dictgetpreveq)，但将键解释为有符号的 `n`-位整数。 |  |
| **`F47C`** | `DICTUGETNEXT` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但将字典 `D` 中的所有键解释为大端无符号的 `n`-位整数，并计算大于整数 `i` 的最小键 `i'`（`i` 不一定能放入 `n` 位，也不一定是非负的）。 |  |
| **`F47D`** | `DICTUGETNEXTEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXTEQ`](#instr-dictgetnexteq)，但将键解释为无符号的 `n`-位整数。 |  |
| **`F47E`** | `DICTUGETPREV` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREV`](#instr-dictgetprev)，但将键解释为无符号的 `n`-位整数。 |  |
| **`F47F`** | `DICTUGETPREVEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREVEQ`](#instr-dictgetpreveq)，但将键解释为无符号的 `n`-位整数。 |  |
### 10.10 GetMin, GetMax, RemoveMin, RemoveMax 操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F482`** | `DICTMIN` | _`D n - x k -1或 0`_ | 计算字典 `D` 中的最小键 `k`（由拥有 `n` 数据位的_切片_表示），并返回 `k` 及其关联的值 `x`。 |  |
| **`F483`** | `DICTMINREF` | _`D n - c k -1或 0`_ | 类似于 [`DICTMIN`](#instr-dictmin)，但返回值中唯一的引用作为_cell_ `c`。 |  |
| **`F484`** | `DICTIMIN` | _`D n - x i -1或 0`_ | 类似于 [`DICTMIN`](#instr-dictmin)，但在假设所有键为大端有符号的 `n`-位整数的情况下计算最小键 `i`。注意，返回的键和值可能与 [`DICTMIN`](#instr-dictmin) 和 [`DICTUMIN`](#instr-dictumin) 计算出的不同。 |  |
| **`F485`** | `DICTIMINREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTIMIN`](#instr-dictimin)，但返回值中唯一的引用。 |  |
| **`F486`** | `DICTUMIN` | _`D n - x i -1或 0`_ | 类似于 [`DICTMIN`](#instr-dictmin)，但以无符号 `n`-位 _整数_ `i` 的形式返回键。 |  |
| **`F487`** | `DICTUMINREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTUMIN`](#instr-dictumin)，但返回值中唯一的引用。 |  |
| **`F48A`** | `DICTMAX` | _`D n - x k -1或 0`_ | 计算字典 `D` 中的最大键 `k`（由拥有 `n` 数据位的_切片_表示），并返回 `k` 及其关联的值 `x`。 |  |
| **`F48B`** | `DICTMAXREF` | _`D n - c k -1或 0`_ | 类似于 [`DICTMAX`](#instr-dictmax)，但返回值中唯一的引用。 |  |
| **`F48C`** | `DICTIMAX` | _`D n - x i -1或 0`_ | 类似于 [`DICTMAX`](#instr-dictmax)，但在假设所有键为大端有符号的 `n`-位整数的情况下计算最大键 `i`。注意，返回的键和值可能与 [`DICTMAX`](#instr-dictmax) 和 [`DICTUMAX`](#instr-dictumax) 计算出的不同。 |  |
| **`F48D`** | `DICTIMAXREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTIMAX`](#instr-dictimax)，但返回值中唯一的引用。 |  |
| **`F48E`** | `DICTUMAX` | _`D n - x i -1或 0`_ | 类似于 [`DICTMAX`](#instr-dictmax)，但以无符号 `n`-位 _整数_ `i` 的形式返回键。 |  |
| **`F48F`** | `DICTUMAXREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTUMAX`](#instr-dictumax)，但返回值中唯一的引用。 |  |
| **`F492`** | `DICTREMMIN` | _`D n - D' x k -1或D 0`_ | 计算字典 `D` 中的最小键 `k`（以_n_数据位的_切片_形式表示），从字典中移除 `k`，并返回 `k` 及其关联的值 `x` 和修改后的字典 `D'`。 |  |
| **`F493`** | `DICTREMMINREF` | _`D n - D' c k -1或D 0`_ | 类似于 [`DICTREMMIN`](#instr-dictremmin)，但返回值中唯一的引用作为_cell_ `c`。 |  |
| **`F494`** | `DICTIREMMIN` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMIN`](#instr-dictremmin)，但计算最小键 `i`，假设所有键都是大端有符号的_n_-位整数。请注意，返回的键和值可能与[`DICTREMMIN`](#instr-dictremmin) 和 [`DICTUREMMIN`](#instr-dicturemmin)计算的不同。 |  |
| **`F495`** | `DICTIREMMINREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTIREMMIN`](#instr-dictiremmin)，但返回值中唯一的引用。 |  |
| **`F496`** | `DICTUREMMIN` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMIN`](#instr-dictremmin)，但以无符号_n_-位_整数_ `i` 形式返回键。 |  |
| **`F497`** | `DICTUREMMINREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTUREMMIN`](#instr-dicturemmin)，但返回值中唯一的引用。 |  |
| **`F49A`** | `DICTREMMAX` | _`D n - D' x k -1或D 0`_ | 计算字典 `D` 中的最大键 `k`（以_n_数据位的_切片_形式表示），从字典中移除 `k`，并返回 `k` 及其关联的值 `x` 和修改后的字典 `D'`。 |  |
| **`F49B`** | `DICTREMMAXREF` | _`D n - D' c k -1或D 0`_ | 类似于 [`DICTREMMAX`](#instr-dictremmax)，但返回值中唯一的引用作为_cell_ `c`。 |  |
| **`F49C`** | `DICTIREMMAX` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMAX`](#instr-dictremmax)，但计算最大键 `i`，假设所有键都是大端有符号的_n_-位整数。请注意，返回的键和值可能与[`DICTREMMAX`](#instr-dictremmax) 和 [`DICTUREMMAX`](#instr-dicturemmax)计算的不同。 |  |
| **`F49D`** | `DICTIREMMAXREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTIREMMAX`](#instr-dictiremmax)，但返回值中唯一的引用。 |  |
| **`F49E`** | `DICTUREMMAX` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMAX`](#instr-dictremmax)，但以无符号_n_-位_整数_ `i` 形式返回键。 |  |
| **`F49F`** | `DICTUREMMAXREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTUREMMAX`](#instr-dicturemmax)，但返回值中唯一的引用。 |  |
### 10.11 特殊的获取字典和前缀码字典操作以及常量字典
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F4A0`** | `DICTIGETJMP` | _`i D n - `_ | 类似于 [`DICTIGET`](#instr-dictiget)，但在成功时将 `x` [`BLESS`](#instr-bless) 成一个continuation，并随后执行对其的 [`JMPX`](#instr-jmpx)。失败时不执行任何操作。这对于实现 `switch`/`case` 结构很有用。 |  |
| **`F4A1`** | `DICTUGETJMP` | _`i D n - `_ | 类似于 [`DICTIGETJMP`](#instr-dictigetjmp)，但执行 [`DICTUGET`](#instr-dictuget) 而非 [`DICTIGET`](#instr-dictiget)。 |  |
| **`F4A2`** | `DICTIGETEXEC` | _`i D n - `_ | 类似于 [`DICTIGETJMP`](#instr-dictigetjmp)，但使用 [`EXECUTE`](#instr-execute) 而非 [`JMPX`](#instr-jmpx)。 |  |
| **`F4A3`** | `DICTUGETEXEC` | _`i D n - `_ | 类似于 [`DICTUGETJMP`](#instr-dictugetjmp)，但使用 [`EXECUTE`](#instr-execute) 而非 [`JMPX`](#instr-jmpx)。 |  |
| **`F4A6_n`** | `[ref] [n] DICTPUSHCONST` | _` - D n`_ | 推送非空常量字典 `D`（作为`Cell^?`）和其键长 `0 <= n <= 1023`，存储为指令的一部分。字典本身是从当前continuation的剩余引用中的第一个创建的。通过这种方式，完整的 [`DICTPUSHCONST`](#instr-dictpushconst) 指令可以通过首先序列化 `xF4A4_`，然后是非空字典本身（一个 `1` 位和一个cell引用），然后是无符号的 10 位整数 `n`（仿佛通过 `STU 10` 指令）获得。空字典可以通过 [`NEWDICT`](#instr-newdict) 原语推送。 | `34` |
| **`F4A8`** | `PFXDICTGETQ` | _`s D n - s' x s'' -1或s 0`_ | 在前缀码字典中查找切片 `s` 的唯一前缀，该字典由 `Cell^?` `D` 和 `0 <= n <= 1023` 表示。如果找到，作为 `s'` 返回 `s` 的前缀，并作为切片 `x` 返回相应的值。`s` 的剩余部分作为切片 `s''` 返回。如果 `s` 的任何前缀不是前缀码字典 `D` 中的键，则返回未更改的 `s` 和零标志位以表示失败。 |  |
| **`F4A9`** | `PFXDICTGET` | _`s D n - s' x s''`_ | 类似于 [`PFXDICTGET`](#instr-pfxdictget)，但在失败时抛出cell反序列化失败异常。 |  |
| **`F4AA`** | `PFXDICTGETJMP` | _`s D n - s' s''或s`_ | 类似于 [`PFXDICTGETQ`](#instr-pfxdictgetq)，但成功时将值 `x` [`BLESS`](#instr-bless) 成一个_continuation_，并像执行 [`JMPX`](#instr-jmpx) 一样转移控制权。失败时，返回未改变的 `s` 并继续执行。 |  |
| **`F4AB`** | `PFXDICTGETEXEC` | _`s D n - s' s''`_ | 类似于 [`PFXDICTGETJMP`](#instr-pfxdictgetjmp)，但执行找到的continuation而非跳转它。失败时，抛出cell反序列化异常。 |  |
| **`F4AE_n`** | `[ref] [n] PFXDICTCONSTGETJMP`<br/>`[ref] [n] PFXDICTSWITCH` | _`s - s' s''或s`_ | 将 [`[n] DICTPUSHCONST`](#instr-dictpushconst) 和 [`PFXDICTGETJMP`](#instr-pfxdictgetjmp) 结合起来，用于 `0 <= n <= 1023`。 |  |
| **`F4BC`** | `DICTIGETJMPZ` | _`i D n - i或nothing`_ | [`DICTIGETJMP`](#instr-dictigetjmp) 的一个变种，在失败时返回索引 `i`。 |  |
| **`F4BD`** | `DICTUGETJMPZ` | _`i D n - i或nothing`_ | [`DICTUGETJMP`](#instr-dictugetjmp) 的一个变种，在失败时返回索引 `i`。 |  |
| **`F4BE`** | `DICTIGETEXECZ` | _`i D n - i或nothing`_ | [`DICTIGETEXEC`](#instr-dictigetexec) 的一个变种，在失败时返回索引 `i`。 |  |
| **`F4BF`** | `DICTUGETEXECZ` | _`i D n - i或nothing`_ | [`DICTUGETEXEC`](#instr-dictugetexec) 的一个变种，在失败时返回索引 `i`。 |  |
### 10.12 SubDict 字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F4B1`** | `SUBDICTGET` | _`k l D n - D'`_ | 构建一个由所有以前缀 `k`（由一个_切片_表示，其前 `0 <= l <= n <= 1023` 个数据位用作键）为前缀的字典 `D` 中的键组成的子字典。这里的 `D` 是类型为 `HashmapE(n,X)` 的字典，拥有 `n` 位的键。成功时，返回同类型 `HashmapE(n,X)` 的新子字典作为一个_切片_ `D'`。 |  |
| **`F4B2`** | `SUBDICTIGET` | _`x l D n - D'`_ | [`SUBDICTGET`](#instr-subdictget) 的变体，前缀由有符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 257`。 |  |
| **`F4B3`** | `SUBDICTUGET` | _`x l D n - D'`_ | [`SUBDICTGET`](#instr-subdictget) 的变体，前缀由无符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 256`。 |  |
| **`F4B5`** | `SUBDICTRPGET` | _`k l D n - D'`_ | 类似于 [`SUBDICTGET`](#instr-subdictget)，但从新字典 `D'` 的所有键中移除公共前缀 `k`，它变为 `HashmapE(n-l,X)` 类型。 |  |
| **`F4B6`** | `SUBDICTIRPGET` | _`x l D n - D'`_ | [`SUBDICTRPGET`](#instr-subdictrpget) 的变体，前缀由有符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 257`。 |  |
| **`F4B7`** | `SUBDICTURPGET` | _`x l D n - D'`_ | [`SUBDICTRPGET`](#instr-subdictrpget) 的变体，前缀由无符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 256`。 |  |

## 11 应用特定原语
### 11.1 与 Gas 相关的原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F800`** | `ACCEPT` | _`-`_ | 将当前的 Gas 限制 `g_l` 设置为其允许的最大值 `g_m`，并将 Gas 信用 `g_c` 重置为零，同时减少 `g_r` 的值 `g_c`。<br/>换句话说，当前的智能合约同意购买一些 Gas 以完成当前交易。此操作是处理外部消息所必需的，这些消息本身不携带价值（因而没有 Gas）。 | `26` |
| **`F801`** | `SETGASLIMIT` | _`g - `_ | 将当前的 Gas 限制 `g_l` 设置为 `g` 与 `g_m` 的最小值，并将 Gas 信用 `g_c` 重置为零。如果到目前为止所消耗的 Gas（包括当前指令）超过了所得的 `g_l` 值，则在设置新的 Gas 限制之前抛出（未处理的）Gas 超限异常。请注意，带有参数 `g >= 2^63-1` 的 [`SETGASLIMIT`](#instr-setgaslimit) 等同于 [`ACCEPT`](#instr-accept)。 | `26` |
| **`F80F`** | `COMMIT` | _`-`_ | 提交寄存器 `c4`（“持久数据”）和 `c5`（“操作”）的当前状态，以便即使后来抛出异常，当前执行也被视为“成功”，并保存了这些值。 | `26` |
### 11.2 伪随机数生成器原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F810`** | `RANDU256` | _`- x`_ | 生成一个新的伪随机的无符号 256 位 _整数_ `x`。算法如下: 如果 `r` 是旧的随机种子值，被视为一个 32 字节的数组（通过构造一个无符号 256 位整数的大端表示），则计算其 `sha512(r)`；这个哈希的前 32 字节被存储为新的随机种子值 `r'`，剩下的 32 字节作为下一个随机值 `x` 返回。 | `26+\|c7\|+\|c1_1\|` |
| **`F811`** | `RAND` | _`y - z`_ | 在 `0...y-1`（或 `y...-1`, 如果 `y<0`）范围内生成一个新的伪随机整数 `z`。更确切地说，生成一个无符号随机值 `x`，如同在 `RAND256U` 中；然后计算 `z:=floor(x*y/2^256)`。<br/>等同于 [`RANDU256`](#instr-randu256) [`256 MULRSHIFT`](#instr-mulrshift-var). | `26+\|c7\|+\|c1_1\|` |
| **`F814`** | `SETRAND` | _`x - `_ | 将随机种子设置为无符号 256 位 _整数_ `x`。 | `26+\|c7\|+\|c1_1\|` |
| **`F815`** | `ADDRAND`<br/>`RANDOMIZE` | _`x - `_ | 将无符号 256 位 _整数_ `x` 混入随机种子 `r` 中，通过将随机种子设为两个 32 字节字符串的连结的 `Sha`，第一个字符串以旧种子 `r` 的大端表示，第二个字符串以 `x` 的大端表示。 | `26` |
### 11.3 配置原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F82i`** | `[i] GETPARAM` | _` - x`_ | 从提供于 `c7` 的 _元组_ 中返回第 `i` 个参数，对于 `0 <= i <= 15`。等同于 [`c7 PUSHCTR`](#instr-pushctr) [`FIRST`](#instr-first) [`[i] INDEX`](#instr-index).<br/>如果这些内部操作之一失败，则抛出相应的类型检查或范围检查异常。 | `26` |
| **`F823`** | `NOW` | _` - x`_ | 返回当前 Unix 时间作为一个 _整数_。如果从 `c7` 开始无法恢复请求的值，则抛出类型检查或范围检查异常。<br/>等同于 [`3 GETPARAM`](#instr-getparam). | `26` |
| **`F824`** | `BLOCKLT` | _` - x`_ | 返回当前区块的开始逻辑时间。<br/>等同于 [`4 GETPARAM`](#instr-getparam). | `26` |
| **`F825`** | `LTIME` | _` - x`_ | 返回当前交易的逻辑时间。<br/>等同于 [`5 GETPARAM`](#instr-getparam). | `26` |
| **`F826`** | `RANDSEED` | _` - x`_ | 以无符号 256 位 _整数_ 的形式返回当前的随机种子。<br/>等同于 [`6 GETPARAM`](#instr-getparam). | `26` |
| **`F827`** | `BALANCE` | _` - t`_ | 以 _元组_ 形式返回智能合约剩余的余额，_元组_ 包含一个 _整数_（剩余的Gram余额，以nanograms为单位）和一个 _可能的cell_（以 32 位键表示的“额外代币”的余额字典）。<br/>等同于 [`7 GETPARAM`](#instr-getparam).<br/>请注意，如 [`SENDRAWMSG`](#instr-sendrawmsg) 等 `RAW` 原语不会更新此字段。 | `26` |
| **`F828`** | `MYADDR` | _` - s`_ | 以 _分片_ 形式返回当前智能合约的内部地址，包含一个 `MsgAddressInt`。如果必要，可以使用诸如 [`PARSEMSGADDR`](#instr-parsemsgaddr) 或 [`REWRITESTDADDR`](#instr-rewritestdaddr) 之类的原语进一步解析它。<br/>等同于 [`8 GETPARAM`](#instr-getparam). | `26` |
| **`F829`** | `CONFIGROOT` | _` - D`_ | 以 _可能的cell_ `D` 形式返回当前全局配置字典。等同于 `9 GETPARAM `。 | `26` |
| **`F830`** | `CONFIGDICT` | _` - D 32`_ | 返回全局配置字典及其键长（32）。<br/>等同于 [`CONFIGROOT`](#instr-configroot) [`32 PUSHINT`](#instr-pushint-4). | `26` |
| **`F832`** | `CONFIGPARAM` | _`i - c -1 或 0`_ | 以 _cell_ `c` 的形式返回整数索引 `i` 的全局配置参数的值，以及指示成功的标志位。<br/>等同于 [`CONFIGDICT`](#instr-configdict) [`DICTIGETREF`](#instr-dictigetref). |  |
| **`F833`** | `CONFIGOPTPARAM` | _`i - c^?`_ | 以 _可能的cell_ `c^?` 的形式返回整数索引 `i` 的全局配置参数的值。<br/>等同于 [`CONFIGDICT`](#instr-configdict) [`DICTIGETOPTREF`](#instr-dictigetoptref). |  |
### 11.4 全局变量原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F840`** | `GETGLOBVAR` | _`k - x`_ | 返回第 `k` 个全局变量，对于 `0 <= k < 255`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`SWAP`](#instr-swap) [`INDEXVARQ`](#instr-indexvarq)。 | `26` |
| **`F85_k`** | `[k] GETGLOB` | _` - x`_ | 返回第 `k` 个全局变量，对于 `1 <= k <= 31`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`[k] INDEXQ`](#instr-indexq)。 | `26` |
| **`F860`** | `SETGLOBVAR` | _`x k - `_ | 将 `x` 分配给第 `k` 个全局变量，对于 `0 <= k < 255`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`ROTREV`](#instr-rotrev) [`SETINDEXVARQ`](#instr-setindexvarq) [`c7 POPCTR`](#instr-popctr)。 | `26+\|c7’\|` |
| **`F87_k`** | `[k] SETGLOB` | _`x - `_ | 将 `x` 分配给第 `k` 个全局变量，对于 `1 <= k <= 31`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`SWAP`](#instr-swap) [`k SETINDEXQ`](#instr-setindexq) [`c7 POPCTR`](#instr-popctr)。 | `26+\|c7’\|` |
### 11.5 哈希和密码学原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F900`** | `HASHCU` | _`c - x`_ | 计算 _cell_ `c` 的表示哈希，并将其作为 256 位无符号整数 `x` 返回。用于对由cell树表示的任意实体进行签名和检查签名。 | `26` |
| **`F901`** | `HASHSU` | _`s - x`_ | 计算 _分片_ `s` 的哈希，并将其作为 256 位无符号整数 `x` 返回。结果与如果创建了一个仅包含 `s` 的数据和引用的普通cell并通过 [`HASHCU`](#instr-hashcu) 计算其哈希相同。 | `526` |
| **`F902`** | `SHA256U` | _`s - x`_ | 对 _分片_ `s` 的数据位计算 `Sha`。如果 `s` 的位长度不能被八整除，抛出一个cell下溢异常。哈希值作为 256 位无符号整数 `x` 返回。 | `26` |
| **`F910`** | `CHKSIGNU` | _`h s k - ?`_ | 使用公钥 `k`（也用一个 256 位无符号整数表示）检查哈希 `h`（通常作为某些数据的哈希，为一个 256 位无符号整数）的 Ed25519 签名 `s`。<br/>签名 `s` 必须是至少包含 512 位数据的 _分片_；仅使用前 512 位。结果为 `-1` 则签名有效，否则为 `0`。<br/>请注意，[`CHKSIGNU`](#instr-chksignu) 相当于 [`ROT`](#instr-rot) [`NEWC`](#instr-newc) [`256 STU`](#instr-stu) [`ENDC`](#instr-endc) [`ROTREV`](#instr-rotrev) [`CHKSIGNS`](#instr-chksigns)，即，相当于用第一个参数 `d` 设置为包含 `h` 的 256 位 _分片_ 的 [`CHKSIGNS`](#instr-chksigns)。因此，如果 `h` 是作为某些数据的哈希计算的，这些数据会被 _两次_ 哈希，第二次哈希发生在 [`CHKSIGNS`](#instr-chksigns) 内部。 | `26` |
| **`F911`** | `CHKSIGNS` | _`d s k - ?`_ | 检查 `s` 是否是使用公钥 `k` 对 _分片_ `d` 的数据部分的有效 Ed25519 签名，类似于 [`CHKSIGNU`](#instr-chksignu)。如果 _分片_ `d` 的位长度不能被八整除，抛出一个cell下溢异常。Ed25519 签名的验证是标准的，使用 `Sha` 将 `d` 缩减为实际签名的 256 位数字。 | `26` |
### 11.6 其他原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F940`** | `CDATASIZEQ` | _`c n - x y z -1 或 0`_ | 递归计算以 _cell_ `c` 为根的 dag 中不同cell `x`、数据位 `y` 和cell引用 `z` 的计数，有效地返回考虑等价cell标识时该 dag 使用的总存储量。`x`、`y` 和 `z` 的值通过该 dag 的深度优先遍历来计算，使用访问过的cell哈希表来防止已访问cell的重复访问。访问的cell总数 `x` 不能超过非负 _整数_ `n`；否则，在访问第 `(n+1)` 个cell之前计算被中断，并返回零表示失败。如果 `c` 为 _空_，则返回 `x=y=z=0`。 |  |
| **`F941`** | `CDATASIZE` | _`c n - x y z`_ | [`CDATASIZEQ`](#instr-cdatasizeq) 的非静默版本，失败时抛出cell溢出异常（8）。 |  |
| **`F942`** | `SDATASIZEQ` | _`s n - x y z -1 或 0`_ | 类似于 [`CDATASIZEQ`](#instr-cdatasizeq)，但接受一个 _分片_ `s` 而非 _cell_。返回的 `x` 值不包括包含切片 `s` 本身的cell；然而，`s` 的数据位和cell引用在 `y` 和 `z` 中被计算在内。 |  |
| **`F943`** | `SDATASIZE` | _`s n - x y z`_ | [`SDATASIZEQ`](#instr-sdatasizeq) 的非静默版本，失败时抛出cell溢出异常（8）。 |  |
### 11.7 代币操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FA00`** | `LDGRAMS`<br/>`LDVARUINT16` | _`s - x s'`_ | 从 _分片_ `s` 中加载（反序列化）一个 `Gram` 或 `VarUInteger 16` 数量，并以 _整数_ `x` 形式返回数量及 `s` 的剩余部分 `s'`。`x` 的预期序列化格式包括一个 4 位无符号大端整数 `l`，随后是 `x` 的一个 `8l` 位无符号大端表示。<br/>其效果大致等同于 [`4 LDU`](#instr-ldu) [`SWAP`](#instr-swap) [`3 LSHIFT#`](#instr-lshift) [`LDUX`](#instr-ldux)。 | `26` |
| **`FA01`** | `LDVARINT16` | _`s - x s'`_ | 与 [`LDVARUINT16`](#instr-ldgrams) 相似，但加载一个 _有符号_ _整数_ `x`。<br/>大致等同于 [`4 LDU`](#instr-ldu) [`SWAP`](#instr-swap) [`3 LSHIFT#`](#instr-lshift) [`LDIX`](#instr-ldix)。 | `26` |
| **`FA02`** | `STGRAMS`<br/>`STVARUINT16` | _`b x - b'`_ | 将范围为 `0...2^120-1` 内的 _整数_ `x` 存储（序列化）到 _构建器_ `b` 中，并返回 _构建器_ `b'`的结果。`x` 的序列化格式包括一个 4 位无符号大端整数 `l`，这是满足 `x<2^(8l)` 的最小的 `l>=0` 整数，随后是 `x` 的一个 `8l` 位无符号大端表示。如果 `x` 不在支持的范围内，则抛出范围检查异常。 | `26` |
| **`FA03`** | `STVARINT16` | _`b x - b'`_ | 类似于 [`STVARUINT16`](#instr-stgrams)，但序列化一个范围为 `-2^119...2^119-1` 的 _有符号_ _整数_ `x`。 | `26` |
### 11.8 消息和地址操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FA40`** | `LDMSGADDR` | _`s - s' s''`_ | 从 _分片_ `s` 中加载唯一有效的 `MsgAddress` 前缀，并将该前缀 `s'` 和 `s` 的剩余部分 `s''` 作为分片返回。 | `26` |
| **`FA41`** | `LDMSGADDRQ` | _`s - s' s'' -1 或 s 0`_ | [`LDMSGADDR`](#instr-ldmsgaddr) 的静默版本：成功时额外推送 `-1`；失败时推送原始 `s` 和零。 | `26` |
| **`FA42`** | `PARSEMSGADDR` | _`s - t`_ | 将包含有效 `MsgAddress` 的 _分片_ `s` 分解为一个具有此 `MsgAddress` 独立字段的 _元组_ `t`。如果 `s` 不是有效的 `MsgAddress`，则抛出cell反序列化异常。 | `26` |
| **`FA43`** | `PARSEMSGADDRQ` | _`s - t -1 或 0`_ | [`PARSEMSGADDR`](#instr-parsemsgaddr) 的静默版本：错误时返回零而不是抛出异常。 | `26` |
| **`FA44`** | `REWRITESTDADDR` | _`s - x y`_ | 解析包含有效 `MsgAddressInt`（通常是 `msg_addr_std`）的 _分片_ `s`，应用从 `anycast`（如果存在）到地址的相同长度前缀的重写，并以整数形式返回工作链 `x` 和 256 位地址 `y`。如果地址不是 256 位的，或者如果 `s` 不是有效的 `MsgAddressInt` 序列化，则抛出cell反序列化异常。 | `26` |
| **`FA45`** | `REWRITESTDADDRQ` | _`s - x y -1 或 0`_ | 原语 [`REWRITESTDADDR`](#instr-rewritestdaddr) 的静默版本。 | `26` |
| **`FA46`** | `REWRITEVARADDR` | _`s - x s'`_ | [`REWRITESTDADDR`](#instr-rewritestdaddr) 的变体，即使地址不是完全为 256 位长（由 `msg_addr_var` 表示），也返回（重写的）地址作为 _分片_ `s`。 | `26` |
| **`FA47`** | `REWRITEVARADDRQ` | _`s - x s' -1 或 0`_ | 原语 [`REWRITEVARADDR`](#instr-rewritevaraddr) 的静默版本。 | `26` |
### 11.9 出站消息和输出操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FB00`** | `SENDRAWMSG` | _`c x - `_ | 发送包含在 _cell_ `c` 中的原始消息，其中应包含正确序列化的对象 `Message X`，唯一的例外是源地址允许有虚拟值 `addr_none`（将自动替换为当前智能合约地址），且 `ihr_fee`、`fwd_fee`、`created_lt` 和 `created_at` 字段可以有任意值（在当前交易的操作阶段将被正确值重写）。整数参数 `x` 包含标志位。当前 `x=0` 用于普通消息；`x=128` 用于携带当前智能合约所有剩余余额的消息（而非消息最初指示的值）；`x=64` 用于携带除初始指示的新消息值外，入站消息的所有剩余值的消息（如果未设置位 0，则此金额中扣除 gas 费用）；`x'=x+1` 表示发送者想要单独支付转账费用；`x'=x+2` 表示在操作阶段处理此消息时发生的任何错误都应被忽略。最后，`x'=x+32` 意味着如果当前账户的最终余额为零，则必须销毁该账户。这个标志位通常与 `+128` 一起使用。 | `526` |
| **`FB02`** | `RAWRESERVE` | _`x y - `_ | 创建一个输出操作，该操作将从账户的剩余余额中准确预留 `x` nanograms（如果 `y=0`），最多 `x` nanograms（如果 `y=2`），或除 `x` nanograms外的所有nanograms（如果 `y=1` 或 `y=3`）。这大致相当于创建一个携带 `x` nanograms（或 `b-x` nanograms，其中 `b` 是剩余余额）到自己的出站消息，以便后续输出操作无法花费超过剩余金额的资金。`y` 中的位 `+2` 表明，如果无法预留指定金额，外部操作不会失败；相反，将预留所有剩余余额。`y` 中的位 `+8` 表示在执行任何进一步操作之前 `x:=-x`。`y` 中的位 `+4` 表示在执行任何其他检查和操作之前，`x` 会增加当前帐户（在计算阶段之前）的原始余额，包括所有额外货币。当前 `x` 必须是非负整数，且 `y` 必须在 `0...15` 范围内。 | `526` |
| **`FB03`** | `RAWRESERVEX` | _`x D y - `_ | 类似于 [`RAWRESERVE`](#instr-rawreserve)，但也接受一个代表额外代币的字典 `D`（由 _cell_ 或 _空_ 表示）。这种方式可以预留Grams以外的货币。 | `526` |
| **`FB04`** | `SETCODE` | _`c - `_ | 创建一个输出操作，该操作将此智能合约代码更改为由 _cell_ `c` 给出的代码。请注意，此更改仅在当前智能合约运行成功终止后生效。 | `526` |
| **`FB06`** | `SETLIBCODE` | _`c x - `_ | 创建一个输出操作，用于修改此智能合约库的集合，通过添加或移除在 _cell_ `c` 中给定代码的库。如果 `x=0`，若库先前存在于集合中，则实际上会被移除（如果不存在，则此操作无效）。如果 `x=1`，则库被作为私有库添加；如果 `x=2`，则库被作为公共库添加（如果当前智能合约位于主链中，则变得对所有智能合约可用）；如果库之前已存在于集合中，则其公共/私有状态将根据 `x` 改变。另外，`16` 可以加到 `x` 上，以在失败时启用弹回交易。`x` 的值除了 `0...2 (+16 可能)` 之外都是无效的。 | `526` |
| **`FB07`** | `CHANGELIB` | _`h x - `_ | 类似于 [`SETLIBCODE`](#instr-setlibcode)，创建一个输出操作，但它接受库的哈希而非库代码，哈希以无符号 256 位整数 `h` 的形式给出。如果 `x!=0` 且该智能合约的库集合中不存在哈希值为 `h` 的库，此输出操作将失败。 | `526` |

## 12 调试原语
以 `FE` 开头的操作码保留给调试原语使用。这些原语具有已知的固定操作长度，并且作为（多字节）[`NOP`](#instr-nop) 操作行为。

然而，当在启用调试模式的 TVM 实例中调用时，这些原语可以产生特定输出到 TVM 实例的文本调试日志中，不影响 TVM 状态。

[`DEBUG`](#instr-debug) 和 [`DEBUGSTR`](#instr-debugstr) 是两个调试原语，它们涵盖了所有以 `FE` 开头的操作码。当调试启用时，这里列出的其他原语具有其指定的效果。当调试禁用时，它们表现为 [`NOP`](#instr-nop)。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxx

[Content truncated due to size limit]


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { InstructionSearch } from '@site/src/components/Instructions';
import { cp0 } from '@site/src/data/opcodes';

# TVM 指令

:::caution 高级模式
因 Docusaurus 的限制，单页版本已移至[此处](/learn/archive/tvm-instructions)。
:::

- [退出 TVM 指令全屏模式](/learn/tvm-instructions/tvm-overview)

## 引言

本文档提供了一份TVM指令以及它们的操作码和助记符列表。

:::info
TON 虚拟机 (TVM) 的概念文档 [**TVM.pdf**](https://ton.org/tvm.pdf)（可能包含过时信息）。
:::

Fift 是一种基于堆栈的编程语言，旨在管理 TON 智能合约。Fift 汇编器是一个 Fift 库，可将 TVM 指令的助记符转换为二进制表示法。

Fift 是一种基于栈的编程语言，旨在管理 TON 智能合约。Fift 汇编器是一个能够将 TVM 指令的助记符转换为它们的二进制表示形式的 Fift 库。

关于 Fift 的描述，包括介绍 Fift 汇编器，可在[此处](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md)找到。

本文档为每个指令指定了对应的助记符。

1. Fift 是一种基于堆栈的语言，因此任何指令的所有参数都写在指令之前（例如 [`5 PUSHINT`](#instr-pushint-4), [`s0 s4 XCHG`](#instr-xchg-ij)).
2. 堆栈寄存器用 `s0, s1, ..., s15` 表示。其他堆栈寄存器（最多 255 个）用 `i s()` 表示（如 `100 s()`）。
3. 控制寄存器由 `c0, c1, ..., c15` 表示。

### Gas 价格

本文档中指定了每个指令的 gas 价格。一个指令的基本 gas 价格是 `10 + b`，其中 `b` 是指令长度（以位为单位）。某些操作有附加费用：

1. _解析cell_：将一个cell转换成一个片段的成本是 **100 gas 单位**，如果是在同一交易中首次加载该cell，则为 **25**。对于此类指令，会指定两个 gas 价格（例如，[`CTOS`](#instr-ctos): `118/43`）。
2. _cell创建_：**500 gas 单位**。
3. _抛出异常_：**50 gas 单位**。在本文档中，仅对其主要用途为抛出异常的指令指定异常费（例如，[`THROWIF`](#instr-throwif-short)，[`FITS`](#instr-fits)）。如果指令在某些情况下只抛出异常，则会指定两个 gas 价格（例如，[`FITS`](#instr-fits): `26/76`）。
4. _元组创建_：每个元组元素 **1 gas 单位**。
5. _隐式跳转_：对于一个隐式跳转，**10 gas 单位**；对于隐式后跳，**5 gas 单位**。这项费用不属于任何指令的一部分。
6. _在continuations之间移动栈元素_：每个元素 **1 gas 单位**，但是移动前32个元素是免费的。

### 快速搜索

:::info
完整的机器可读 TVM 指令列表 [此处](https://github.com/ton-community/ton-docs/blob/main/docs/learn/tvm-instructions/instructions.csv)。
:::

TVM Instructions 的每个部分都包含一个内置搜索组件，用于查找该部分的特定操作码。

但在这个页面，搜索涵盖所有现有的opcodes，提供了一个在整个opcode 范围内的全面搜索选项。

请随时使用下面的搜索字段来查找特定的指令：

<InstructionSearch instructions={cp0.instructions} aliases={cp0.aliases}/>

- [退出 TVM 指令全屏模式](/learn/tvm-instructions/tvm-overview)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/app-specific.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/app-specific.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { appSpecificOpcodes as opcodes } from '@site/src/data/opcodes';

# 应用特定原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和 Null](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和文字](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [其他](/learn/tvm-instructions/instructions/miscellaneous)

...
* [退出 TVM 指令全屏模式](/learn/tvm-instructions/tvm-overview)

## 应用特定原语
### 与 Gas 相关的原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F800`** | `ACCEPT` | _`-`_ | 将当前的 Gas 限制 `g_l` 设置为其允许的最大值 `g_m`，并将 Gas 信用 `g_c` 重置为零，同时减少 `g_r` 的值 `g_c`。<br/>换句话说，当前的智能合约同意购买一些 Gas 以完成当前交易。此操作是处理外部消息所必需的，这些消息本身不携带价值（因而没有 Gas）。 | `26` |
| **`F801`** | `SETGASLIMIT` | _`g - `_ | 将当前的 Gas 限制 `g_l` 设置为 `g` 与 `g_m` 的最小值，并将 Gas 信用 `g_c` 重置为零。如果到目前为止所消耗的 Gas（包括当前指令）超过了所得的 `g_l` 值，则在设置新的 Gas 限制之前抛出（未处理的）Gas 超限异常。请注意，带有参数 `g >= 2^63-1` 的 [`SETGASLIMIT`](#instr-setgaslimit) 等同于 [`ACCEPT`](#instr-accept)。 | `26` |
| **`F80F`** | `COMMIT` | _`-`_ | 提交寄存器 `c4`（“持久数据”）和 `c5`（“操作”）的当前状态，以便即使后来抛出异常，当前执行也被视为“成功”，并保存了这些值。 | `26` |

### 伪随机数生成器原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F810`** | `RANDU256` | _`- x`_ | 生成一个新的伪随机的无符号 256 位 _整数_ `x`。算法如下: 如果 `r` 是旧的随机种子值，被视为一个 32 字节的数组（通过构造一个无符号 256 位整数的大端表示），则计算其 `sha512(r)`；这个哈希的前 32 字节被存储为新的随机种子值 `r'`，剩下的 32 字节作为下一个随机值 `x` 返回。 | `26+\|c7\|+\|c1_1\|` |
| **`F811`** | `RAND` | _`y - z`_ | 在 `0...y-1`（或 `y...-1`, 如果 `y<0`）范围内生成一个新的伪随机整数 `z`。更确切地说，生成一个无符号随机值 `x`，如同在 `RAND256U` 中；然后计算 `z:=floor(x*y/2^256)`。<br/>等同于 [`RANDU256`](#instr-randu256) [`256 MULRSHIFT`](#instr-mulrshift-var). | `26+\|c7\|+\|c1_1\|` |
| **`F814`** | `SETRAND` | _`x - `_ | 将随机种子设置为无符号 256 位 _整数_ `x`。 | `26+\|c7\|+\|c1_1\|` |
| **`F815`** | `ADDRAND`<br/>`RANDOMIZE` | _`x - `_ | 将无符号 256 位 _整数_ `x` 混入随机种子 `r` 中，通过将随机种子设为两个 32 字节字符串的连结的 `Sha`，第一个字符串以旧种子 `r` 的大端表示，第二个字符串以 `x` 的大端表示。 | `26` |

### 配置原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F82i`** | `[i] GETPARAM` | _` - x`_ | 从提供于 `c7` 的 _元组_ 中返回第 `i` 个参数，对于 `0 <= i <= 15`。等同于 [`c7 PUSHCTR`](#instr-pushctr) [`FIRST`](#instr-first) [`[i] INDEX`](#instr-index).<br/>如果这些内部操作之一失败，则抛出相应的类型检查或范围检查异常。 | `26` |
| **`F823`** | `NOW` | _` - x`_ | 返回当前 Unix 时间作为一个 _整数_。如果从 `c7` 开始无法恢复请求的值，则抛出类型检查或范围检查异常。<br/>等同于 [`3 GETPARAM`](#instr-getparam). | `26` |
| **`F824`** | `BLOCKLT` | _` - x`_ | 返回当前区块的开始逻辑时间。<br/>等同于 [`4 GETPARAM`](#instr-getparam). | `26` |
| **`F825`** | `LTIME` | _` - x`_ | 返回当前交易的逻辑时间。<br/>等同于 [`5 GETPARAM`](#instr-getparam). | `26` |
| **`F826`** | `RANDSEED` | _` - x`_ | 以无符号 256 位 _整数_ 的形式返回当前的随机种子。<br/>等同于 [`6 GETPARAM`](#instr-getparam). | `26` |
| **`F827`** | `BALANCE` | _` - t`_ | 以 _元组_ 形式返回智能合约剩余的余额，_元组_ 包含一个 _整数_（剩余的Gram余额，以nanograms为单位）和一个 _可能的cell_（以 32 位键表示的“额外代币”的余额字典）。<br/>等同于 [`7 GETPARAM`](#instr-getparam).<br/>请注意，如 [`SENDRAWMSG`](#instr-sendrawmsg) 等 `RAW` 原语不会更新此字段。 | `26` |
| **`F828`** | `MYADDR` | _` - s`_ | 以 _分片_ 形式返回当前智能合约的内部地址，包含一个 `MsgAddressInt`。如果必要，可以使用诸如 [`PARSEMSGADDR`](#instr-parsemsgaddr) 或 [`REWRITESTDADDR`](#instr-rewritestdaddr) 之类的原语进一步解析它。<br/>等同于 [`8 GETPARAM`](#instr-getparam). | `26` |
| **`F829`** | `CONFIGROOT` | _` - D`_ | 以 _可能的cell_ `D` 形式返回当前全局配置字典。等同于 `9 GETPARAM `。 | `26` |
| **`F830`** | `CONFIGDICT` | _` - D 32`_ | 返回全局配置字典及其键长（32）。<br/>等同于 [`CONFIGROOT`](#instr-configroot) [`32 PUSHINT`](#instr-pushint-4). | `26` |
| **`F832`** | `CONFIGPARAM` | _`i - c -1 或 0`_ | 以 _cell_ `c` 的形式返回整数索引 `i` 的全局配置参数的值，以及指示成功的标志位。<br/>等同于 [`CONFIGDICT`](#instr-configdict) [`DICTIGETREF`](#instr-dictigetref). |  |
| **`F833`** | `CONFIGOPTPARAM` | _`i - c^?`_ | 以 _可能的cell_ `c^?` 的形式返回整数索引 `i` 的全局配置参数的值。<br/>等同于 [`CONFIGDICT`](#instr-configdict) [`DICTIGETOPTREF`](#instr-dictigetoptref). |  |

### 全局变量原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F840`** | `GETGLOBVAR` | _`k - x`_ | 返回第 `k` 个全局变量，对于 `0 <= k < 255`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`SWAP`](#instr-swap) [`INDEXVARQ`](#instr-indexvarq)。 | `26` |
| **`F85_k`** | `[k] GETGLOB` | _` - x`_ | 返回第 `k` 个全局变量，对于 `1 <= k <= 31`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`[k] INDEXQ`](#instr-indexq)。 | `26` |
| **`F860`** | `SETGLOBVAR` | _`x k - `_ | 将 `x` 分配给第 `k` 个全局变量，对于 `0 <= k < 255`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`ROTREV`](#instr-rotrev) [`SETINDEXVARQ`](#instr-setindexvarq) [`c7 POPCTR`](#instr-popctr)。 | `26+\|c7’\|` |
| **`F87_k`** | `[k] SETGLOB` | _`x - `_ | 将 `x` 分配给第 `k` 个全局变量，对于 `1 <= k <= 31`。<br/>相当于 [`c7 PUSHCTR`](#instr-pushctr) [`SWAP`](#instr-swap) [`k SETINDEXQ`](#instr-setindexq) [`c7 POPCTR`](#instr-popctr)。 | `26+\|c7’\|` |

### 哈希和密码学原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F900`** | `HASHCU` | _`c - x`_ | 计算 _cell_ `c` 的表示哈希，并将其作为 256 位无符号整数 `x` 返回。用于对由cell树表示的任意实体进行签名和检查签名。 | `26` |
| **`F901`** | `HASHSU` | _`s - x`_ | 计算 _分片_ `s` 的哈希，并将其作为 256 位无符号整数 `x` 返回。结果与如果创建了一个仅包含 `s` 的数据和引用的普通cell并通过 [`HASHCU`](#instr-hashcu) 计算其哈希相同。 | `526` |
| **`F902`** | `SHA256U` | _`s - x`_ | 对 _分片_ `s` 的数据位计算 `Sha`。如果 `s` 的位长度不能被八整除，抛出一个cell下溢异常。哈希值作为 256 位无符号整数 `x` 返回。 | `26` |
| **`F910`** | `CHKSIGNU` | _`h s k - ?`_ | 使用公钥 `k`（也用一个 256 位无符号整数表示）检查哈希 `h`（通常作为某些数据的哈希，为一个 256 位无符号整数）的 Ed25519 签名 `s`。<br/>签名 `s` 必须是至少包含 512 位数据的 _分片_；仅使用前 512 位。结果为 `-1` 则签名有效，否则为 `0`。<br/>请注意，[`CHKSIGNU`](#instr-chksignu) 相当于 [`ROT`](#instr-rot) [`NEWC`](#instr-newc) [`256 STU`](#instr-stu) [`ENDC`](#instr-endc) [`ROTREV`](#instr-rotrev) [`CHKSIGNS`](#instr-chksigns)，即，相当于用第一个参数 `d` 设置为包含 `h` 的 256 位 _分片_ 的 [`CHKSIGNS`](#instr-chksigns)。因此，如果 `h` 是作为某些数据的哈希计算的，这些数据会被 _两次_ 哈希，第二次哈希发生在 [`CHKSIGNS`](#instr-chksigns) 内部。 | `26` |
| **`F911`** | `CHKSIGNS` | _`d s k - ?`_ | 检查 `s` 是否是使用公钥 `k` 对 _分片_ `d` 的数据部分的有效 Ed25519 签名，类似于 [`CHKSIGNU`](#instr-chksignu)。如果 _分片_ `d` 的位长度不能被八整除，抛出一个cell下溢异常。Ed25519 签名的验证是标准的，使用 `Sha` 将 `d` 缩减为实际签名的 256 位数字。 | `26` |

### 其他原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F940`** | `CDATASIZEQ` | _`c n - x y z -1 或 0`_ | 递归计算以 _cell_ `c` 为根的 dag 中不同cell `x`、数据位 `y` 和cell引用 `z` 的计数，有效地返回考虑等价cell标识时该 dag 使用的总存储量。`x`、`y` 和 `z` 的值通过该 dag 的深度优先遍历来计算，使用访问过的cell哈希表来防止已访问cell的重复访问。访问的cell总数 `x` 不能超过非负 _整数_ `n`；否则，在访问第 `(n+1)` 个cell之前计算被中断，并返回零表示失败。如果 `c` 为 _空_，则返回 `x=y=z=0`。 |  |
| **`F941`** | `CDATASIZE` | _`c n - x y z`_ | [`CDATASIZEQ`](#instr-cdatasizeq) 的非静默版本，失败时抛出cell溢出异常（8）。 |  |
| **`F942`** | `SDATASIZEQ` | _`s n - x y z -1 或 0`_ | 类似于 [`CDATASIZEQ`](#instr-cdatasizeq)，但接受一个 _分片_ `s` 而非 _cell_。返回的 `x` 值不包括包含切片 `s` 本身的cell；然而，`s` 的数据位和cell引用在 `y` 和 `z` 中被计算在内。 |  |
| **`F943`** | `SDATASIZE` | _`s n - x y z`_ | [`SDATASIZEQ`](#instr-sdatasizeq) 的非静默版本，失败时抛出cell溢出异常（8）。 |  |

### 代币操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FA00`** | `LDGRAMS`<br/>`LDVARUINT16` | _`s - x s'`_ | 从 _分片_ `s` 中加载（反序列化）一个 `Gram` 或 `VarUInteger 16` 数量，并以 _整数_ `x` 形式返回数量及 `s` 的剩余部分 `s'`。`x` 的预期序列化格式包括一个 4 位无符号大端整数 `l`，随后是 `x` 的一个 `8l` 位无符号大端表示。<br/>其效果大致等同于 [`4 LDU`](#instr-ldu) [`SWAP`](#instr-swap) [`3 LSHIFT#`](#instr-lshift) [`LDUX`](#instr-ldux)。 | `26` |
| **`FA01`** | `LDVARINT16` | _`s - x s'`_ | 与 [`LDVARUINT16`](#instr-ldgrams) 相似，但加载一个 _有符号_ _整数_ `x`。<br/>大致等同于 [`4 LDU`](#instr-ldu) [`SWAP`](#instr-swap) [`3 LSHIFT#`](#instr-lshift) [`LDIX`](#instr-ldix)。 | `26` |
| **`FA02`** | `STGRAMS`<br/>`STVARUINT16` | _`b x - b'`_ | 将范围为 `0...2^120-1` 内的 _整数_ `x` 存储（序列化）到 _构建器_ `b` 中，并返回 _构建器_ `b'`的结果。`x` 的序列化格式包括一个 4 位无符号大端整数 `l`，这是满足 `x<2^(8l)` 的最小的 `l>=0` 整数，随后是 `x` 的一个 `8l` 位无符号大端表示。如果 `x` 不在支持的范围内，则抛出范围检查异常。 | `26` |
| **`FA03`** | `STVARINT16` | _`b x - b'`_ | 类似于 [`STVARUINT16`](#instr-stgrams)，但序列化一个范围为 `-2^119...2^119-1` 的 _有符号_ _整数_ `x`。 | `26` |

### 消息和地址操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FA40`** | `LDMSGADDR` | _`s - s' s''`_ | 从 _分片_ `s` 中加载唯一有效的 `MsgAddress` 前缀，并将该前缀 `s'` 和 `s` 的剩余部分 `s''` 作为分片返回。 | `26` |
| **`FA41`** | `LDMSGADDRQ` | _`s - s' s'' -1 或 s 0`_ | [`LDMSGADDR`](#instr-ldmsgaddr) 的静默版本：成功时额外推送 `-1`；失败时推送原始 `s` 和零。 | `26` |
| **`FA42`** | `PARSEMSGADDR` | _`s - t`_ | 将包含有效 `MsgAddress` 的 _分片_ `s` 分解为一个具有此 `MsgAddress` 独立字段的 _元组_ `t`。如果 `s` 不是有效的 `MsgAddress`，则抛出cell反序列化异常。 | `26` |
| **`FA43`** | `PARSEMSGADDRQ` | _`s - t -1 或 0`_ | [`PARSEMSGADDR`](#instr-parsemsgaddr) 的静默版本：错误时返回零而不是抛出异常。 | `26` |
| **`FA44`** | `REWRITESTDADDR` | _`s - x y`_ | 解析包含有效 `MsgAddressInt`（通常是 `msg_addr_std`）的 _分片_ `s`，应用从 `anycast`（如果存在）到地址的相同长度前缀的重写，并以整数形式返回工作链 `x` 和 256 位地址 `y`。如果地址不是 256 位的，或者如果 `s` 不是有效的 `MsgAddressInt` 序列化，则抛出cell反序列化异常。 | `26` |
| **`FA45`** | `REWRITESTDADDRQ` | _`s - x y -1 或 0`_ | 原语 [`REWRITESTDADDR`](#instr-rewritestdaddr) 的静默版本。 | `26` |
| **`FA46`** | `REWRITEVARADDR` | _`s - x s'`_ | [`REWRITESTDADDR`](#instr-rewritestdaddr) 的变体，即使地址不是完全为 256 位长（由 `msg_addr_var` 表示），也返回（重写的）地址作为 _分片_ `s`。 | `26` |
| **`FA47`** | `REWRITEVARADDRQ` | _`s - x s' -1 或 0`_ | 原语 [`REWRITEVARADDR`](#instr-rewritevaraddr) 的静默版本。 | `26` |

### 出站消息和输出操作原语
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FB00`** | `SENDRAWMSG` | _`c x - `_ | 发送包含在 _cell_ `c` 中的原始消息，其中应包含正确序列化的对象 `Message X`，唯一的例外是源地址允许有虚拟值 `addr_none`（将自动替换为当前智能合约地址），且 `ihr_fee`、`fwd_fee`、`created_lt` 和 `created_at` 字段可以有任意值（在当前交易的操作阶段将被正确值重写）。整数参数 `x` 包含标志位。当前 `x=0` 用于普通消息；`x=128` 用于携带当前智能合约所有剩余余额的消息（而非消息最初指示的值）；`x=64` 用于携带除初始指示的新消息值外，入站消息的所有剩余值的消息（如果未设置位 0，则此金额中扣除 gas 费用）；`x'=x+1` 表示发送者想要单独支付转账费用；`x'=x+2` 表示在操作阶段处理此消息时发生的任何错误都应被忽略。最后，`x'=x+32` 意味着如果当前账户的最终余额为零，则必须销毁该账户。这个标志位通常与 `+128` 一起使用。 | `526` |
| **`FB02`** | `RAWRESERVE` | _`x y - `_ | 创建一个输出操作，该操作将从账户的剩余余额中准确预留 `x` nanograms（如果 `y=0`），最多 `x` nanograms（如果 `y=2`），或除 `x` nanograms外的所有nanograms（如果 `y=1` 或 `y=3`）。这大致相当于创建一个携带 `x` nanograms（或 `b-x` nanograms，其中 `b` 是剩余余额）到自己的出站消息，以便后续输出操作无法花费超过剩余金额的资金。`y` 中的位 `+2` 表明，如果无法预留指定金额，外部操作不会失败；相反，将预留所有剩余余额。`y` 中的位 `+8` 表示在执行任何进一步操作之前 `x:=-x`。`y` 中的位 `+4` 表示在执行任何其他检查和操作之前，`x` 会增加当前帐户（在计算阶段之前）的原始余额，包括所有额外货币。当前 `x` 必须是非负整数，且 `y` 必须在 `0...15` 范围内。 | `526` |
| **`FB03`** | `RAWRESERVEX` | _`x D y - `_ | 类似于 [`RAWRESERVE`](#instr-rawreserve)，但也接受一个代表额外代币的字典 `D`（由 _cell_ 或 _空_ 表示）。这种方式可以预留Grams以外的货币。 | `526` |
| **`FB04`** | `SETCODE` | _`c - `_ | 创建一个输出操作，该操作将此智能合约代码更改为由 _cell_ `c` 给出的代码。请注意，此更改仅在当前智能合约运行成功终止后生效。 | `526` |
| **`FB06`** | `SETLIBCODE` | _`c x - `_ | 创建一个输出操作，用于修改此智能合约库的集合，通过添加或移除在 _cell_ `c` 中给定代码的库。如果 `x=0`，若库先前存在于集合中，则实际上会被移除（如果不存在，则此操作无效）。如果 `x=1`，则库被作为私有库添加；如果 `x=2`，则库被作为公共库添加（如果当前智能合约位于主链中，则变得对所有智能合约可用）；如果库之前已存在于集合中，则其公共/私有状态将根据 `x` 改变。另外，`16` 可以加到 `x` 上，以在失败时启用弹回交易。`x` 的值除了 `0...2 (+16 可能)` 之外都是无效的。 | `526` |
| **`FB07`** | `CHANGELIB` | _`h x - `_ | 类似于 [`SETLIBCODE`](#instr-setlibcode)，创建一个输出操作，但它接受库的哈希而非库代码，哈希以无符号 256 位整数 `h` 的形式给出。如果 `x!=0` 且该智能合约的库集合中不存在哈希值为 `h` 的库，此输出操作将失败。 | `526` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和 Null](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和文字](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [其他](/learn/tvm-instructions/instructions/miscellaneous)

...
* [退出 TVM 指令全屏模式](/learn/tvm-instructions/tvm-overview)


## 参阅

- [TVM 概览](/learn/tvm-instructions/tvm-overview)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/arithmetic.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/arithmetic.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { arithmeticOpcodes as opcodes } from '@site/src/data/opcodes';

# 算术原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和 Null](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和文字](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [其他](/learn/tvm-instructions/instructions/miscellaneous)

## 算术原语
### 加法、减法、乘法

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`A0`** | `ADD` | _`x y - x+y`_ |  | `18` |
| **`A1`** | `SUB` | _`x y - x-y`_ |  | `18` |
| **`A2`** | `SUBR` | _`x y - y-x`_ | 等同于 [`SWAP`](#instr-swap) [`SUB`](#instr-sub)。 | `18` |
| **`A3`** | `NEGATE` | _`x - -x`_ | 等同于 [`-1 MULCONST`](#instr-mulconst) 或 [`ZERO SUBR`](#instr-subr)。<br/>注意，如果 `x=-2^256` 时会触发整数溢出异常。 | `18` |
| **`A4`** | `INC` | _`x - x+1`_ | 等同于 [`1 ADDCONST`](#instr-addconst)。 | `18` |
| **`A5`** | `DEC` | _`x - x-1`_ | 等同于 [`-1 ADDCONST`](#instr-addconst)。 | `18` |
| **`A6cc`** | `[cc] ADDCONST`<br/>`[cc] ADDINT`<br/>`[-cc] SUBCONST`<br/>`[-cc] SUBINT` | _`x - x+cc`_ | `-128 <= cc <= 127`。 | `26` |
| **`A7cc`** | `[cc] MULCONST`<br/>`[cc] MULINT` | _`x - x*cc`_ | `-128 <= cc <= 127`。 | `26` |
| **`A8`** | `MUL` | _`x y - x*y`_ |  | `18` |

### 除法

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`A9mscdf`** |  |  | 这是除法的通用编码，可选进行预乘和用移位替换除法或乘法。变量字段如下：<br/>`0 <= m <= 1`  -  表示是否有预乘（[`MULDIV`](#instr-muldiv) 及其变体），可能被左移替换。<br/>`0 <= s <= 2`  -  表示乘法或除法中的哪一个被移位替换：`s=0` - 无替换，`s=1` - 除法被右移替换，`s=2` - 乘法被左移替换（仅当 `m=1` 时可能）。<br/>`0 <= c <= 1`  -  表示是否有移位操作符的一个字节常量参数 `tt`（如果 `s!=0`）。对于 `s=0`，`c=0`。如果 `c=1`，则 `0 <= tt <= 255`，并且移位由 `tt+1` 位执行。如果 `s!=0` 且 `c=0`，则移位量作为栈顶的 _整数_在 `0...256` 范围内提供。<br/>`1 <= d <= 3`  -  表示需要哪些除法结果：`1` - 仅商，`2` - 仅余数，`3` - 商和余数。<br/>`0 <= f <= 2`  -  舍入模式：`0` - 向下取整，`1` - 最近整数，`2` - 向上取整。<br/>下列所有指令均为此变体。 | `26` |
| **`A904`** | `DIV` | _`x y - q`_ | `q=floor(x/y)`，`r=x-y*q` | `26` |
| **`A905`** | `DIVR` | _`x y - q’`_ | `q’=round(x/y)`，`r’=x-y*q’` | `26` |
| **`A906`** | `DIVC` | _`x y - q''`_ | `q’’=ceil(x/y)`，`r’’=x-y*q’’` | `26` |
| **`A908`** | `MOD` | _`x y - r`_ |  | `26` |
| **`A90C`** | `DIVMOD` | _`x y - q r`_ |  | `26` |
| **`A90D`** | `DIVMODR` | _`x y - q' r'`_ |  | `26` |
| **`A90E`** | `DIVMODC` | _`x y - q'' r''`_ |  | `26` |
| **`A925`** | `RSHIFTR` | _`x y - round(x/2^y)`_ |  | `26` |
| **`A926`** | `RSHIFTC` | _`x y - ceil(x/2^y)`_ |  | `34` |
| **`A935tt`** | `[tt+1] RSHIFTR#` | _`x y - round(x/2^(tt+1))`_ |  | `34` |
| **`A936tt`** | `[tt+1] RSHIFTC#` | _`x y - ceil(x/2^(tt+1))`_ |  | `34` |
| **`A938tt`** | `[tt+1] MODPOW2#` | _`x - x mod 2^(tt+1)`_ |  | `34` |
| **`A98`** | `MULDIV` | _`x y z - q`_ | `q=floor(x*y/z)` | `26` |
| **`A985`** | `MULDIVR` | _`x y z - q'`_ | `q'=round(x*y/z)` | `26` |
| **`A98C`** | `MULDIVMOD` | _`x y z - q r`_ | `q=floor(x*y/z)`，`r=x*y-z*q` | `26` |
| **`A9A4`** | `MULRSHIFT` | _`x y z - floor(x*y/2^z)`_ | `0 <= z <= 256` | `26` |
| **`A9A5`** | `MULRSHIFTR` | _`x y z - round(x*y/2^z)`_ | `0 <= z <= 256` | `26` |
| **`A9A6`** | `MULRSHIFTC` | _`x y z - ceil(x*y/2^z)`_ | `0 <= z <= 256` | `34` |
| **`A9B4tt`** | `[tt+1] MULRSHIFT#` | _`x y - floor(x*y/2^(tt+1))`_ |  | `34` |
| **`A9B5tt`** | `[tt+1] MULRSHIFTR#` | _`x y - round(x*y/2^(tt+1))`_ |  | `34` |
| **`A9B6tt`** | `[tt+1] MULRSHIFTC#` | _`x y - ceil(x*y/2^(tt+1))`_ |  | `26` |
| **`A9C4`** | `LSHIFTDIV` | _`x y z - floor(2^z*x/y)`_ | `0 <= z <= 256` | `26` |
| **`A9C5`** | `LSHIFTDIVR` | _`x y z - round(2^z*x/y)`_ | `0 <= z <= 256` | `26` |
| **`A9C6`** | `LSHIFTDIVC` | _`x y z - ceil(2^z*x/y)`_ | `0 <= z <= 256` | `34` |
| **`A9D4tt`** | `[tt+1] LSHIFT#DIV` | _`x y - floor(2^(tt+1)*x/y)`_ |  | `34` |
| **`A9D5tt`** | `[tt+1] LSHIFT#DIVR` | _`x y - round(2^(tt+1)*x/y)`_ |  | `34` |
| **`A9D6tt`** | `[tt+1] LSHIFT#DIVC` | _`x y - ceil(2^(tt+1)*x/y)`_ |  | `26` |

### 移位、逻辑操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`AAcc`** | `[cc+1] LSHIFT#` | _`x - x*2^(cc+1)`_ | `0 <= cc <= 255` | `26` |
| **`ABcc`** | `[cc+1] RSHIFT#` | _`x - floor(x/2^(cc+1))`_ | `0 <= cc <= 255` | `18` |
| **`AC`** | `LSHIFT` | _`x y - x*2^y`_ | `0 <= y <= 1023` | `18` |
| **`AD`** | `RSHIFT` | _`x y - floor(x/2^y)`_ | `0 <= y <= 1023` | `18` |
| **`AE`** | `POW2` | _`y - 2^y`_ | `0 <= y <= 1023`<br/>等同于 [`ONE`](#instr-one) [`SWAP`](#instr-swap) [`LSHIFT`](#instr-lshift-var)。 | `18` |
| **`B0`** | `AND` | _`x y - x&y`_ | 对两个有符号整数 `x` 和 `y` 进行按位与运算，符号扩展到无限。 | `18` |
| **`B1`** | `OR` | _`x y - x\|y`_ | 对两个整数进行按位或运算。 | `18` |
| **`B2`** | `XOR` | _`x y - x xor y`_ | 对两个整数进行按位异或运算。 | `18` |
| **`B3`** | `NOT` | _`x - ~x`_ | 一个整数的按位非运算。 | `26` |
| **`B4cc`** | `[cc+1] FITS` | _`x - x`_ | 检查 `x` 是否为 `cc+1` 位有符号整数，对于 `0 <= cc <= 255`（即 `-2^cc <= x < 2^cc`）。<br/>如果不是，要么触发整数溢出异常，要么用 `NaN` 替换 `x`（静默版本）。 | `26/76` |
| **`B400`** | `CHKBOOL` | _`x - x`_ | 检查 `x` 是否为“布尔值”（即 0 或 -1）。 | `26/76` |
| **`B5cc`** | `[cc+1] UFITS` | _`x - x`_ | 检查 `x` 是否为 `cc+1` 位无符号整数，对于 `0 <= cc <= 255`（即 `0 <= x < 2^(cc+1)`）。 | `26/76` |
| **`B500`** | `CHKBIT` | _`x - x`_ | 检查 `x` 是否为二进制数字（即零或一）。 | `26/76` |
| **`B600`** | `FITSX` | _`x c - x`_ | 检查 `x` 是否为 `c` 位有符号整数，对于 `0 <= c <= 1023`。 | `26/76` |
| **`B601`** | `UFITSX` | _`x c - x`_ | 检查 `x` 是否为 `c` 位无符号整数，对于 `0 <= c <= 1023`。 | `26/76` |
| **`B602`** | `BITSIZE` | _`x - c`_ | 计算最小的 `c >= 0` 使得 `x` 适合于 `c` 位有符号整数（`-2^(c-1) <= c < 2^(c-1)`）。 | `26` |
| **`B603`** | `UBITSIZE` | _`x - c`_ | 计算最小的 `c >= 0` 使得 `x` 适合于 `c` 位无符号整数（`0 <= x < 2^c`），或抛出范围检查异常。 | `26` |
| **`B608`** | `MIN` | _`x y - x or y`_ | 计算两个整数 `x` 和 `y` 的最小值。 | `26` |
| **`B609`** | `MAX` | _`x y - x or y`_ | 计算两个整数 `x` 和 `y` 的最大值。 | `26` |
| **`B60A`** | `MINMAX`<br/>`INTSORT2` | _`x y - x y or y x`_ | 排序两个整数。如果任一参数为 `NaN`s，静默版本的此操作返回两个 `NaN`s。 | `26` |
| **`B60B`** | `ABS` | _`x - \|x\|`_ | 计算整数 `x` 的绝对值。 | `26` |

### 静默算术原语

静默操作在其参数之一为 `NaN` 或在整数溢出的情况下返回 `NaN`，而不是抛出异常。
静默操作如下所示带有 `Q` 前缀。另一种使操作变为静默的方法是在其前添加 `QUIET`（即可以写 [`QUIET ADD`](#instr-add) 而不是 [`QADD`](#instr-qadd)）。
整数比较原语的静默版本也可用（[`QUIET SGN`](#instr-sgn)，[`QUIET LESS`](#instr-less) 等）。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`B7A0`** | `QADD` | _`x y - x+y`_ |  | `26` |
| **`B7A1`** | `QSUB` | _`x y - x-y`_ |  | `26` |
| **`B7A2`** | `QSUBR` | _`x y - y-x`_ |  | `26` |
| **`B7A3`** | `QNEGATE` | _`x - -x`_ |  | `26` |
| **`B7A4`** | `QINC` | _`x - x+1`_ |  | `26` |
| **`B7A5`** | `QDEC` | _`x - x-1`_ |  | `26` |
| **`B7A8`** | `QMUL` | _`x y - x*y`_ |  | `26` |
| **`B7A904`** | `QDIV` | _`x y - q`_ | 如果 `y=0` 则除法返回 `NaN`。 | `34` |
| **`B7A905`** | `QDIVR` | _`x y - q’`_ |  | `34` |
| **`B7A906`** | `QDIVC` | _`x y - q''`_ |  | `34` |
| **`B7A908`** | `QMOD` | _`x y - r`_ |  | `34` |
| **`B7A90C`** | `QDIVMOD` | _`x y - q r`_ |  | `34` |
| **`B7A90D`** | `QDIVMODR` | _`x y - q' r'`_ |  | `34` |
| **`B7A90E`** | `QDIVMODC` | _`x y - q'' r''`_ |  | `34` |
| **`B7A985`** | `QMULDIVR` | _`x y z - q'`_ |  | `34` |
| **`B7A98C`** | `QMULDIVMOD` | _`x y z - q r`_ |  | `34` |
| **`B7AC`** | `QLSHIFT` | _`x y - x*2^y`_ |  | `26` |
| **`B7AD`** | `QRSHIFT` | _`x y - floor(x/2^y)`_ |  | `26` |
| **`B7AE`** | `QPOW2` | _`y - 2^y`_ |  | `26` |
| **`B7B0`** | `QAND` | _`x y - x&y`_ |  | `26` |
| **`B7B1`** | `QOR` | _`x y - x\|y`_ |  | `26` |
| **`B7B2`** | `QXOR` | _`x y - x xor y`_ |  | `26` |
| **`B7B3`** | `QNOT` | _`x - ~x`_ |  | `26` |
| **`B7B4cc`** | `[cc+1] QFITS` | _`x - x`_ | 如果 `x` 不是 `cc+1` 位有符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |
| **`B7B5cc`** | `[cc+1] QUFITS` | _`x - x`_ | 如果 `x` 不是 `cc+1` 位无符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |
| **`B7B600`** | `QFITSX` | _`x c - x`_ | 如果 `x` 不是 `c` 位有符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |
| **`B7B601`** | `QUFITSX` | _`x c - x`_ | 如果 `x` 不是 `c` 位无符号整数，则用 `NaN` 替换 `x`，否则保持不变。 | `34` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和 Null](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和文字](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [其他](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/cell-manipulation.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/cell-manipulation.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { cellManipulationOpcodes as opcodes } from '@site/src/data/opcodes';

# Cell原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和 Null](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和文字](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [其他](/learn/tvm-instructions/instructions/miscellaneous)

## Cell 原语
### Cell 序列化原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`C8`** | `NEWC` | _`- b`_ | 创建一个新的空 _构建器_。 | `18` |
| **`C9`** | `ENDC` | _`b - c`_ | 将 _构建器_ 转换为普通的 _cell_。 | `518` |
| **`CAcc`** | `[cc+1] STI` | _`x b - b'`_ | 将 `0 <= cc <= 255` 的有符号 `cc+1`-位整数 `x` 存入 _构建器_ `b` 中，如果 `x` 不适合于 `cc+1` 位，则抛出范围检查异常。 | `26` |
| **`CBcc`** | `[cc+1] STU` | _`x b - b'`_ | 将无符号的 `cc+1`-位整数 `x` 存入 _构建器_ `b` 中。在其他方面，它与 [`STI`](#instr-sti) 类似。 | `26` |
| **`CC`** | `STREF` | _`c b - b'`_ | 将 _cell_ `c` 的引用存入 _构建器_ `b` 中。 | `18` |
| **`CD`** | `STBREFR`<br/>`ENDCST` | _`b b'' - b`_ | 等同于 [`ENDC`](#instr-endc) [`SWAP`](#instr-swap) [`STREF`](#instr-stref)。 | `518` |
| **`CE`** | `STSLICE` | _`s b - b'`_ | 将 _分片_ `s` 存入 _构建器_ `b` 中。 | `18` |
| **`CF00`** | `STIX` | _`x b l - b'`_ | 为 `0 <= l <= 257`，将有符号 `l`-位整数 `x` 存入 `b` 中。 | `26` |
| **`CF01`** | `STUX` | _`x b l - b'`_ | 为 `0 <= l <= 256`，将无符号 `l`-位整数 `x` 存入 `b` 中。 | `26` |
| **`CF02`** | `STIXR` | _`b x l - b'`_ | 与 [`STIX`](#instr-stix) 类似，但参数顺序不同。 | `26` |
| **`CF03`** | `STUXR` | _`b x l - b'`_ | 与 [`STUX`](#instr-stux) 类似，但参数顺序不同。 | `26` |
| **`CF04`** | `STIXQ` | _`x b l - x b f or b' 0`_ | [`STIX`](#instr-stix) 的静默版本。如果 `b` 中没有空间，将 `b'=b` 和 `f=-1`。<br/>如果 `x` 不适合于 `l` 位，将 `b'=b` 和 `f=1`。<br/>如果操作成功，`b'` 是新的 _构建器_ 和 `f=0`。<br/>然而，`0 <= l <= 257`，如果不是这样，则抛出范围检查异常。 | `26` |
| **`CF05`** | `STUXQ` | _`x b l - x b f or b' 0`_ | [`STUX`](#instr-stux) 的静默版本。 | `26` |
| **`CF06`** | `STIXRQ` | _`b x l - b x f or b' 0`_ | [`STIXR`](#instr-stixr) 的静默版本。 | `26` |
| **`CF07`** | `STUXRQ` | _`b x l - b x f or b' 0`_ | [`STUXR`](#instr-stuxr) 的静默版本。 | `26` |
| **`CF08cc`** | `[cc+1] STI_l` | _`x b - b'`_ | [`[cc+1] STI`](#instr-sti) 的更长版本。 | `34` |
| **`CF09cc`** | `[cc+1] STU_l` | _`x b - b'`_ | [`[cc+1] STU`](#instr-stu) 的更长版本。 | `34` |
| **`CF0Acc`** | `[cc+1] STIR` | _`b x - b'`_ | 等同于 [`SWAP`](#instr-swap) [`[cc+1] STI`](#instr-sti)。 | `34` |
| **`CF0Bcc`** | `[cc+1] STUR` | _`b x - b'`_ | 等同于 [`SWAP`](#instr-swap) [`[cc+1] STU`](#instr-stu)。 | `34` |
| **`CF0Ccc`** | `[cc+1] STIQ` | _`x b - x b f or b' 0`_ | [`STI`](#instr-sti) 的静默版本。 | `34` |
| **`CF0Dcc`** | `[cc+1] STUQ` | _`x b - x b f or b' 0`_ | [`STU`](#instr-stu) 的静默版本。 | `34` |
| **`CF0Ecc`** | `[cc+1] STIRQ` | _`b x - b x f or b' 0`_ | [`STIR`](#instr-stir) 的静默版本。 | `34` |
| **`CF0Fcc`** | `[cc+1] STURQ` | _`b x - b x f or b' 0`_ | [`STUR`](#instr-stur) 的静默版本。 | `34` |
| **`CF10`** | `STREF_l` | _`c b - b'`_ | [`STREF`](#instr-stref) 的更长版本。 | `26` |
| **`CF11`** | `STBREF` | _`b' b - b''`_ | 等同于 [`SWAP`](#instr-swap) [`STBREFR`](#instr-stbrefr)。 | `526` |
| **`CF12`** | `STSLICE_l` | _`s b - b'`_ | [`STSLICE`](#instr-stslice) 的更长版本。 | `26` |
| **`CF13`** | `STB` | _`b' b - b''`_ | 将 _构建器_ `b'` 中的所有数据附加到 _构建器_ `b` 中。 | `26` |
| **`CF14`** | `STREFR` | _`b c - b'`_ | 等同于 [`SWAP`](#instr-swap) [`STREF`](#instr-stref)。 | `26` |
| **`CF15`** | `STBREFR_l` | _`b b' - b''`_ | [`STBREFR`](#instr-stbrefr) 的更长编码。 | `526` |
| **`CF16`** | `STSLICER` | _`b s - b'`_ | 等同于 [`SWAP`](#instr-swap) [`STSLICE`](#instr-stslice)。 | `26` |
| **`CF17`** | `STBR`<br/>`BCONCAT` | _`b b' - b''`_ | 连接两个构建器。<br/>等同于 [`SWAP`](#instr-swap) [`STB`](#instr-stb)。 | `26` |
| **`CF18`** | `STREFQ` | _`c b - c b -1 or b' 0`_ | [`STREF`](#instr-stref) 的静默版本。 | `26` |
| **`CF19`** | `STBREFQ` | _`b' b - b' b -1 or b'' 0`_ | [`STBREF`](#instr-stbref) 的静默版本。 | `526` |
| **`CF1A`** | `STSLICEQ` | _`s b - s b -1 or b' 0`_ | [`STSLICE`](#instr-stslice) 的静默版本。 | `26` |
| **`CF1B`** | `STBQ` | _`b' b - b' b -1 or b'' 0`_ | [`STB`](#instr-stb) 的静默版本。 | `26` |
| **`CF1C`** | `STREFRQ` | _`b c - b c -1 or b' 0`_ | [`STREFR`](#instr-strefr) 的静默版本。 | `26` |
| **`CF1D`** | `STBREFRQ` | _`b b' - b b' -1 or b'' 0`_ | [`STBREFR`](#instr-stbrefr) 的静默版本。 | `526` |
| **`CF1E`** | `STSLICERQ` | _`b s - b s -1 or b'' 0`_ | [`STSLICER`](#instr-stslicer) 的静默版本。 | `26` |
| **`CF1F`** | `STBRQ`<br/>`BCONCATQ` | _`b b' - b b' -1 or b'' 0`_ | [`STBR`](#instr-stbr) 的静默版本。 | `26` |
| **`CF20`** | `[ref] STREFCONST` | _`b - b’`_ | 等同于 [`PUSHREF`](#instr-pushref) [`STREFR`](#instr-strefr)。 | `26` |
| **`CF21`** | `[ref] [ref] STREF2CONST` | _`b - b’`_ | 等同于 [`STREFCONST`](#instr-strefconst) [`STREFCONST`](#instr-strefconst)。 | `26` |
| **`CF23`** |  | _`b x - c`_ | 如果 `x!=0`，从 _构建器_ `b` 创建一个 _特殊_ 或 _异类_ cell。<br/>异类cell的类型必须存储在 `b` 的前 8 位中。<br/>如果 `x=0`，它相当于 [`ENDC`](#instr-endc)。否则，将在创建异类cell之前对 `b` 的数据和引用执行一些有效性检查。 | `526` |
| **`CF28`** | `STILE4` | _`x b - b'`_ | 存储一个小端有符号 32 位整数。 | `26` |
| **`CF29`** | `STULE4` | _`x b - b'`_ | 存储一个小端无符号 32 位整数。 | `26` |
| **`CF2A`** | `STILE8` | _`x b - b'`_ | 存储一个小端有符号 64 位整数。 | `26` |
| **`CF2B`** | `STULE8` | _`x b - b'`_ | 存储一个小端无符号 64 位整数。 | `26` |
| **`CF30`** | `BDEPTH` | _`b - x`_ | 返回 _构建器_ `b` 的深度。如果 `b` 中没有存储cell引用，则 `x=0`；否则 `x` 是对 `b` 中引用的cell的深度的最大值加 1。 | `26` |
| **`CF31`** | `BBITS` | _`b - x`_ | 返回已经存储在 _构建器_ `b` 中的数据位数。 | `26` |
| **`CF32`** | `BREFS` | _`b - y`_ | 返回已经存储在 `b` 中的cell引用数。 | `26` |
| **`CF33`** | `BBITREFS` | _`b - x y`_ | 返回 `b` 中数据位数和cell引用数。 | `26` |
| **`CF35`** | `BREMBITS` | _`b - x'`_ | 返回仍然可以存储在 `b` 中的数据位数。 | `26` |
| **`CF36`** | `BREMREFS` | _`b - y'`_ | 返回仍然可以存储在 `b` 中的引用数。 | `26` |
| **`CF37`** | `BREMBITREFS` | _`b - x' y'`_ | 返回仍然可以存储在 `b` 中的数据位数和引用数。 | `26` |
| **`CF38cc`** | `[cc+1] BCHKBITS#` | _`b -`_ | 检查是否能将 `cc+1` 位存储到 `b` 中，其中 `0 <= cc <= 255`。 | `34/84` |
| **`CF39`** | `BCHKBITS` | _`b x - `_ | 检查是否能将 `x` 位存储到 `b` 中，`0 <= x <= 1023`。如果 `b` 中没有足够空间存储 `x` 更多位，或者 `x` 不在范围 `0...1023` 内，则抛出异常。 | `26/76` |
| **`CF3A`** | `BCHKREFS` | _`b y - `_ | 检查是否能将 `y` 引用存储到 `b` 中，`0 <= y <= 7`。 | `26/76` |
| **`CF3B`** | `BCHKBITREFS` | _`b x y - `_ | 检查是否能将 `x` 位和 `y` 引用存储到 `b` 中，`0 <= x <= 1023`，`0 <= y <= 7`。 | `26/76` |
| **`CF3Ccc`** | `[cc+1] BCHKBITSQ#` | _`b - ?`_ | 检查是否能将 `cc+1` 位存储到 `b` 中，其中 `0 <= cc <= 255`。 | `34` |
| **`CF3D`** | `BCHKBITSQ` | _`b x - ?`_ | 检查是否能将 `x` 位存储到 `b` 中，`0 <= x <= 1023`。 | `26` |
| **`CF3E`** | `BCHKREFSQ` | _`b y - ?`_ | 检查是否能将 `y` 引用存储到 `b` 中，`0 <= y <= 7`。 | `26` |
| **`CF3F`** | `BCHKBITREFSQ` | _`b x y - ?`_ | 检查是否能将 `x` 位和 `y` 引用存储到 `b` 中，`0 <= x <= 1023`，`0 <= y <= 7`。 | `26` |
| **`CF40`** | `STZEROES` | _`b n - b'`_ | 将 `n` 个二进制零存储到 _构建器_ `b` 中。 | `26` |
| **`CF41`** | `STONES` | _`b n - b'`_ | 将 `n` 个二进制一存储到 _构建器_ `b` 中。 | `26` |
| **`CF42`** | `STSAME` | _`b n x - b'`_ | 将 `n` 个二进制 `x`（`0 <= x <= 1`）存储到 _构建器_ `b` 中。 | `26` |
| **`CFC0_xysss`** | `[slice] STSLICECONST` | _`b - b'`_ | 存储一个常量子切片 `sss`。<br/>_详情：_ `sss` 由 `0 <= x <= 3` 个引用和最多 `8y+2` 个数据位组成，其中 `0 <= y <= 7`。假定有完成位。<br/>注意，如果切片过大，汇编器可以将 [`STSLICECONST`](#instr-stsliceconst) 替换为 [`PUSHSLICE`](#instr-pushslice) [`STSLICER`](#instr-stslicer)。 | `24` |
| **`CF81`** | `STZERO` | _`b - b'`_ | 存储一个二进制零。 | `24` |
| **`CF83`** | `STONE` | _`b - b'`_ | 存储一个二进制一。 | `24` |

### Cell 反序列化原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`D0`** | `CTOS` | _`c - s`_ | 将 _cell_ 转换为 _切片_。请注意，`c` 必须是普通cell，或者是自动 _加载_ 以产生普通cell `c'` 的异类cell，然后转换为 _切片_。 | `118/43` |
| **`D1`** | `ENDS` | _`s - `_ | 从堆栈中移除 _切片_ `s`，如果不为空则抛出异常。 | `18/68` |
| **`D2cc`** | `[cc+1] LDI` | _`s - x s'`_ | 从 _切片_ `s` 中加载（即解析）一个有符号的 `cc+1`-位整数 `x`，并返回 `s` 的剩余部分作为 `s'`。 | `26` |
| **`D3cc`** | `[cc+1] LDU` | _`s - x s'`_ | 从 _切片_ `s` 中加载一个无符号 `cc+1`-位整数 `x`。 | `26` |
| **`D4`** | `LDREF` | _`s - c s'`_ | 从 `s` 中加载一个cell引用 `c`。 | `18` |
| **`D5`** | `LDREFRTOS` | _`s - s' s''`_ | 等效于 [`LDREF`](#instr-ldref) [`SWAP`](#instr-swap) [`CTOS`](#instr-ctos)。 | `118/43` |
| **`D6cc`** | `[cc+1] LDSLICE` | _`s - s'' s'`_ | 将 `s` 的接下来的 `cc+1` 位切割为一个独立的 _切片_ `s''`。 | `26` |
| **`D700`** | `LDIX` | _`s l - x s'`_ | 从 _切片_ `s` 中加载一个有符号的 `l`-位（`0 <= l <= 257`）整数 `x`，并返回 `s` 的剩余部分作为 `s'`。 | `26` |
| **`D701`** | `LDUX` | _`s l - x s'`_ | 从 `s` 的前 `l` 位（`0 <= l <= 256`）加载一个无符号 `l`-位整数 `x`。 | `26` |
| **`D702`** | `PLDIX` | _`s l - x`_ | 从 _切片_ `s` 中预加载一个有符号 `l`-位整数，`0 <= l <= 257`。 | `26` |
| **`D703`** | `PLDUX` | _`s l - x`_ | 从 `s` 中预加载一个无符号 `l`-位整数，`0 <= l <= 256`。 | `26` |
| **`D704`** | `LDIXQ` | _`s l - x s' -1 or s 0`_ | [`LDIX`](#instr-ldix) 的静默版本：类似地从 `s` 中加载一个有符号 `l`-位整数，但在成功时返回一个成功标志位 `-1`，失败时（如果 `s` 没有 `l` 位）返回 `0`，而不是抛出cell下溢异常。 | `26` |
| **`D705`** | `LDUXQ` | _`s l - x s' -1 or s 0`_ | [`LDUX`](#instr-ldux) 的静默版本。 | `26` |
| **`D706`** | `PLDIXQ` | _`s l - x -1 or 0`_ | [`PLDIX`](#instr-pldix) 的静默版本。 | `26` |
| **`D707`** | `PLDUXQ` | _`s l - x -1 or 0`_ | [`PLDUX`](#instr-pldux) 的静默版本。 | `26` |
| **`D708cc`** | `[cc+1] LDI_l` | _`s - x s'`_ | [`LDI`](#instr-ldi) 的更长编码。 | `34` |
| **`D709cc`** | `[cc+1] LDU_l` | _`s - x s'`_ | [`LDU`](#instr-ldu) 的更长编码。 | `34` |
| **`D70Acc`** | `[cc+1] PLDI` | _`s - x`_ | 从 _切片_ `s` 中预加载一个有符号 `cc+1`-位整数。 | `34` |
| **`D70Bcc`** | `[cc+1] PLDU` | _`s - x`_ | 从 `s` 中预加载一个无符号 `cc+1`-位整数。 | `34` |
| **`D70Ccc`** | `[cc+1] LDIQ` | _`s - x s' -1 or s 0`_ | [`LDI`](#instr-ldi) 的静默版本。 | `34` |
| **`D70Dcc`** | `[cc+1] LDUQ` | _`s - x s' -1 or s 0`_ | [`LDU`](#instr-ldu) 的静默版本。 | `34` |
| **`D70Ecc`** | `[cc+1] PLDIQ` | _`s - x -1 or 0`_ | [`PLDI`](#instr-pldi) 的静默版本。 | `34` |
| **`D70Fcc`** | `[cc+1] PLDUQ` | _`s - x -1 or 0`_ | [`PLDU`](#instr-pldu) 的静默版本。 | `34` |
| **`D714_c`** | `[32(c+1)] PLDUZ` | _`s - s x`_ | 从 _切片_ `s` 中预加载前 `32(c+1)` 位到无符号整数 `x` 中，`0 <= c <= 7`。如果 `s` 比必要的短，缺失的位假定为零。此操作旨在与 [`IFBITJMP`](#instr-ifbitjmp) 及类似指令一起使用。 | `26` |
| **`D718`** | `LDSLICEX` | _`s l - s'' s'`_ | 从 _切片_ `s` 中加载前 `0 <= l <= 1023` 位到一个单独的 _切片_ `s''` 中，返回 `s` 的剩余部分作为 `s'`。 | `26` |
| **`D719`** | `PLDSLICEX` | _`s l - s''`_ | 返回 `s` 的前 `0 <= l <= 1023` 位作为 `s''`。 | `26` |
| **`D71A`** | `LDSLICEXQ` | _`s l - s'' s' -1 or s 0`_ | [`LDSLICEX`](#instr-ldslicex) 的静默版本。 | `26` |
| **`D71B`** | `PLDSLICEXQ` | _`s l - s' -1 or 0`_ | [`LDSLICEXQ`](#instr-ldslicexq) 的静默版本。 | `26` |
| **`D71Ccc`** | `[cc+1] LDSLICE_l` | _`s - s'' s'`_ | [`LDSLICE`](#instr-ldslice) 的更长编码。 | `34` |
| **`D71Dcc`** | `[cc+1] PLDSLICE` | _`s - s''`_ | 返回 `s` 的前 `0 < cc+1 <= 256` 位作为 `s''`。 | `34` |
| **`D71Ecc`** | `[cc+1] LDSLICEQ` | _`s - s'' s' -1 or s 0`_ | [`LDSLICE`](#instr-ldslice) 的静默版本。 | `34` |
| **`D71Fcc`** | `[cc+1] PLDSLICEQ` | _`s - s'' -1 or 0`_ | [`PLDSLICE`](#instr-pldslice) 的静默版本。 | `34` |
| **`D720`** | `SDCUTFIRST` | _`s l - s'`_ | 返回 `s` 的前 `0 <= l <= 1023` 位。与 [`PLDSLICEX`](#instr-pldslicex) 等效。 | `26` |
| **`D721`** | `SDSKIPFIRST` | _`s l - s'`_ | 返回除了 `s` 的前 `0 <= l <= 1023` 位以外的所有位。与 [`LDSLICEX`](#instr-ldslicex) [`NIP`](#instr-nip) 等效。 | `26` |
| **`D722`** | `SDCUTLAST` | _`s l - s'`_ | 返回 `s` 的后 `0 <= l <= 1023` 位。 | `26` |
| **`D723`** | `SDSKIPLAST` | _`s l - s'`_ | 返回除了 `s` 的后 `0 <= l <= 1023` 位以外的所有位。 | `26` |
| **`D724`** | `SDSUBSTR` | _`s l l' - s'`_ | 返回 `s` 的从偏移量 `0 <= l <= 1023` 开始的 `0 <= l' <= 1023` 位，从 `s` 的数据中提取出一个位子字符串。 | `26` |
| **`D726`** | `SDBEGINSX` | _`s s' - s''`_ | 检查 `s` 是否以 `s'`（数据位）开始，并在成功时从 `s` 中移除 `s'`。失败抛出cell反序列化异常。原语 [`SDPFXREV`](#instr-sdpfxrev) 可以认为是 [`SDBEGINSX`](#instr-sdbeginsx) 的静默版本。 | `26` |
| **`D727`** | `SDBEGINSXQ` | _`s s' - s'' -1 or s 0`_ | [`SDBEGINSX`](#instr-sdbeginsx) 的静默版本。 | `26` |
| **`D72A_xsss`** | `[slice] SDBEGINS` | _`s - s''`_ | 检查 `s` 是否以常量位串 `sss` 开始，`sss` 的长度为 `8x+3`（假定有完成位），其中 `0 <= x <= 127`，并在成功时从 `s` 中移除 `sss`。 | `31` |
| **`D72E_xsss`** | `[slice] SDBEGINSQ` | _`s - s'' -1 or s 0`_ | [`SDBEGINS`](#instr-sdbegins) 的静默版本。 | `31` |
| **`D730`** | `SCUTFIRST` | _`s l r - s'`_ | 返回 `s` 的前 `0 <= l <= 1023` 位和前 `0 <= r <= 4` 个引用。 | `26` |
| **`D731`** | `SSKIPFIRST` | _`s l r - s'`_ | 返回除了 `s` 的前 `l` 位和 `r` 个引用以外的所有内容。 | `26` |
| **`D732`** | `SCUTLAST` | _`s l r - s'`_ | 返回 `s` 的后 `0 <= l <= 1023` 个数据位和后 `0 <= r <= 4` 个引用。 | `26` |
| **`D733`** | `SSKIPLAST` | _`s l r - s'`_ | 返回除了 `s` 的后 `l` 位和 `r` 个引用以外的所有内容。 | `26` |
| **`D734`** | `SUBSLICE` | _`s l r l' r' - s'`_ | 在跳过 `s` 的前 `0 <= l <= 1023` 位和前 `0 <= r <= 4` 个引用后，返回来自 _切片_ `s` 的 `0 <= l' <= 1023` 位和 `0 <= r' <= 4` 个引用。 | `26` |
| **`D736`** | `SPLIT` | _`s l r - s' s''`_ | 将 `s` 的前 `0 <= l <= 1023` 个数据位和前 `0 <= r <= 4` 个引用分割成 `s'`，并返回 `s` 的剩余部分作为 `s''`。 | `26` |
| **`D737`** | `SPLITQ` | _`s l r - s' s'' -1 或 s 0`_ | [`SPLIT`](#instr-split) 的静默版本。 | `26` |
| **`D739`** |  | _`c - s？`_ | 将普通或异类cell转换为 _切片_，就好像它是一个普通cell一样。返回一个标志位，指示 `c` 是否是异类的。如果是这样，其类型可以稍后从 `s` 的前八位中反序列化。 |  |
| **`D73A`** |  | _`c - c'`_ | 加载异类cell `c` 并返回一个普通cell `c'`。如果 `c` 已经是普通的，则不执行任何操作。如果 `c` 无法加载，抛出异常。 |  |
| **`D73B`** |  | _`c - c' -1 或 c 0`_ | 加载异类cell `c` 并返回一个普通cell `c'`。如果 `c` 已经是普通的，则不执行任何操作。如果 `c` 无法加载，返回 0。 |  |
| **`D741`** | `SCHKBITS` | _`s l - `_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位。如果不是这种情况，抛出cell反序列化（即cell下溢）异常。 | `26/76` |
| **`D742`** | `SCHKREFS` | _`s r - `_ | 检查 _切片_ `s` 中是否至少有 `r` 个引用。 | `26/76` |
| **`D743`** | `SCHKBITREFS` | _`s l r - `_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位和 `r` 个引用。 | `26/76` |
| **`D745`** | `SCHKBITSQ` | _`s l - ?`_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位。 | `26` |
| **`D746`** | `SCHKREFSQ` | _`s r - ?`_ | 检查 _切片_ `s` 中是否至少有 `r` 个引用。 | `26` |
| **`D747`** | `SCHKBITREFSQ` | _`s l r - ?`_ | 检查 _切片_ `s` 中是否至少有 `l` 个数据位和 `r` 个引用。 | `26` |
| **`D748`** | `PLDREFVAR` | _`s n - c`_ | 返回 _切片_ `s` 的第 `n` 个cell引用，`0 <= n <= 3`。 | `26` |
| **`D749`** | `SBITS` | _`s - l`_ | 返回 _切片_ `s` 中的数据位数。 | `26` |
| **`D74A`** | `SREFS` | _`s - r`_ | 返回 _切片_ `s` 中的引用数。 | `26` |
| **`D74B`** | `SBITREFS` | _`s - l r`_ | 返回 `s` 中的数据位数和引用数。 | `26` |
| **`D74E_n`** | `[n] PLDREFIDX` | _`s - c`_ | 返回 _切片_ `s` 的第 `n` 个cell引用，`0 <= n <= 3`。 | `26` |
| **`D74C`** | `PLDREF` | _`s - c`_ | 预加载 _切片_ 的第一个cell引用。 | `26` |
| **`D750`** | `LDILE4` | _`s - x s'`_ | 加载一个小端有符号 32 位整数。 | `26` |
| **`D751`** | `LDULE4` | _`s - x s'`_ | 加载一个小端无符号 32 位整数。 | `26` |
| **`D752`** | `LDILE8` | _`s - x s'`_ | 加载一个小端有符号 64 位整数。 | `26` |
| **`D753`** | `LDULE8` | _`s - x s'`_ | 加载一个小端无符号 64 位整数。 | `26` |
| **`D754`** | `PLDILE4` | _`s - x`_ | 预加载一个小端有符号 32 位整数。 | `26` |
| **`D755`** | `PLDULE4` | _`s - x`_ | 预加载一个小端无符号 32 位整数。 | `26` |
| **`D756`** | `PLDILE8` | _`s - x`_ | 预加载一个小端有符号 64 位整数。 | `26` |
| **`D757`** | `PLDULE8` | _`s - x`_ | 预加载一个小端无符号 64 位整数。 | `26` |
| **`D758`** | `LDILE4Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端有符号 32 位整数。 | `26` |
| **`D759`** | `LDULE4Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端无符号 32 位整数。 | `26` |
| **`D75A`** | `LDILE8Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端有符号 64 位整数。 | `26` |
| **`D75B`** | `LDULE8Q` | _`s - x s' -1 或 s 0`_ | 静默加载一个小端无符号 64 位整数。 | `26` |
| **`D75C`** | `PLDILE4Q` | _`s - x -1 或 0`_ | 静默预加载一个小端有符号 32 位整数。 | `26` |
| **`D75D`** | `PLDULE4Q` | _`s - x -1 或 0`_ | 静默预加载一个小端无符号 32 位整数。 | `26` |
| **`D75E`** | `PLDILE8Q` | _`s - x -1 或 0`_ | 静默预加载一个小端有符号 64 位整数。 | `26` |
| **`D75F`** | `PLDULE8Q` | _`s - x -1 或 0`_ | 静默预加载一个小端无符号 64 位整数。 | `26` |
| **`D760`** | `LDZEROES` | _`s - n s'`_ | 返回 `s` 中前导零位的计数 `n`，并从 `s` 中移除这些位。 | `26` |
| **`D761`** | `LDONES` | _`s - n s'`_ | 返回 `s` 中前导一位的计数 `n`，并从 `s` 中移除这些位。 | `26` |
| **`D762`** | `LDSAME` | _`s x - n s'`_ | 返回 `s` 中与 `0 <= x <= 1` 相等的前导位的计数 `n`，并从 `s` 中移除这些位。 | `26` |
| **`D764`** | `SDEPTH` | _`s - x`_ | 返回 _切片_ `s` 的深度。如果 `s` 没有引用，则 `x=0`；否则 `x` 是从 `s` 引用的cell的最大深度加 1。 | `26` |
| **`D765`** | `CDEPTH` | _`c - x`_ | 返回 _cell_ `c` 的深度。如果 `c` 没有引用，则 `x=0`；否则 `x` 是从 `c` 引用的cell的最大深度加 1。如果 `c` 是 _空（Null）_ 而不是 _cell_，返回零。 | `26` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和 Null](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和文字](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [其他](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/constant.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/constant.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { constantOpcodes as opcodes } from '@site/src/data/opcodes';

# 常量或字面量原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概述](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常数和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [特定于应用的原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)

## 常量或字面量原语
### 整数和布尔常量

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`7i`** | `[x] PUSHINT`<br/>`[x] INT` | _`- x`_ | 将整数 `x` 压入栈。`-5 <= x <= 10`。<br/>这里的 `i` 等于 `x` 的四个低阶位 (`i=x mod 16`)。 | `18` |
| **`70`** | `ZERO`<br/>`FALSE` | _`- 0`_ |  | `18` |
| **`71`** | `ONE` | _`- 1`_ |  | `18` |
| **`72`** | `TWO` | _`- 2`_ |  | `18` |
| **`7A`** | `TEN` | _`- 10`_ |  | `18` |
| **`7F`** | `TRUE` | _`- -1`_ |  | `18` |
| **`80xx`** | `[xx] PUSHINT`<br/>`[xx] INT` | _`- xx`_ | 将整数 `xx` 压入栈。`-128 <= xx <= 127`。 | `26` |
| **`81xxxx`** | `[xxxx] PUSHINT`<br/>`[xxxx] INT` | _`- xxxx`_ | 将整数 `xxxx` 压入栈。`-2^15 <= xx < 2^15`。 | `34` |
| **`82lxxx`** | `[xxx] PUSHINT`<br/>`[xxx] INT` | _`- xxx`_ | 将整数 `xxx` 压入栈。<br/>_细节:_ 5位的 `0 <= l <= 30` 决定了有符号大端整数 `xxx` 的长度 `n=8l+19`。<br/>此指令的总长度为 `l+4` 字节或 `n+13=8l+32` 位。 | `23` |
| **`83xx`** | `[xx+1] PUSHPOW2` | _`- 2^(xx+1)`_ | （静默地）推送 `2^(xx+1)`，对于 `0 <= xx <= 255`。<br/>`2^256` 是一个 `NaN`。 | `26` |
| **`83FF`** | `PUSHNAN` | _`- NaN`_ | 推送一个 `NaN`。 | `26` |
| **`84xx`** | `[xx+1] PUSHPOW2DEC` | _`- 2^(xx+1)-1`_ | 推送 `2^(xx+1)-1`，对于 `0 <= xx <= 255`。 | `26` |
| **`85xx`** | `[xx+1] PUSHNEGPOW2` | _`- -2^(xx+1)`_ | 推送 `-2^(xx+1)`，对于 `0 <= xx <= 255`。 | `26` |

### 常量切片、continuation、cell和引用

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`88`** | `[ref] PUSHREF` | _`- c`_ | 将引用 `ref` 推送到栈中。<br/>_细节:_ 将 `cc.code` 的第一个引用作为 _cell_ 推入栈（并从当前continuation中移除此引用）。 | `18` |
| **`89`** | `[ref] PUSHREFSLICE` | _`- s`_ | 类似于 [`PUSHREF`](#instr-pushref)，但将cell转换为 _切片_。 | `118/43` |
| **`8A`** | `[ref] PUSHREFCONT` | _`- cont`_ | 类似于 [`PUSHREFSLICE`](#instr-pushrefslice)，但将cell制作成一个简单的普通 _continuation_。 | `118/43` |
| **`8Bxsss`** | `[slice] PUSHSLICE`<br/>`[slice] SLICE` | _`- s`_ | 将切片 `slice` 推入栈。<br/>_细节:_ 推送 `cc.code` 的 (前缀) 子切片，其由其前 `8x+4` 位和零个引用组成（即，基本上是一个位串），其中 `0 <= x <= 15`。<br/>假设有一个完成标记，意味着所有尾随零和最后一个二进制一（如果存在）都从这个位串中被移除。<br/>如果原始位串仅由零组成，则会推入一个空切片。 | `22` |
| **`8Crxxssss`** | `[slice] PUSHSLICE`<br/>`[slice] SLICE` | _`- s`_ | 将切片 `slice` 推入栈。<br/>_细节:_ 推送 `cc.code` 的 (前缀) 子切片，其由其前 `1 <= r+1 <= 4` 个引用和最多前 `8xx+1` 位数据组成，其中 `0 <= xx <= 31`。<br/>也假设有一个完成标记。 | `25` |
| **`8Drxxsssss`** | `[slice] PUSHSLICE`<br/>`[slice] SLICE` | _`- s`_ | 将切片 `slice` 推入栈。<br/>_细节:_ 推送 `cc.code` 的子切片，其由 `0 <= r <= 4` 个引用和最多 `8xx+6` 位数据组成，其中 `0 <= xx <= 127`。<br/>假设有一个完成标记。 | `28` |
|  | `x{} PUSHSLICE`<br/>`x{ABCD1234} PUSHSLICE`<br/>`b{01101} PUSHSLICE` | _`- s`_ | [`PUSHSLICE`](#instr-pushslice) 的示例。<br/>`x{}` 是一个空切片。`x{...}` 是一个十六进制字面量。`b{...}` 是一个二进制字面量。<br/>关于切片字面量的更多信息[在这里](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-51-slice-literals)。<br/>注意，汇编程序可以在某些情况下（例如，如果当前continuation中没有足够的空间）将 [`PUSHSLICE`](#instr-pushslice) 替换为 [`PUSHREFSLICE`](#instr-pushrefslice)。 |  |
|  | `<b x{AB12} s, b> PUSHREF`<br/>`<b x{AB12} s, b> PUSHREFSLICE` | _`- c/s`_ | [`PUSHREF`](#instr-pushref) 和 [`PUSHREFSLICE`](#instr-pushrefslice) 的示例。<br/>关于在 fift 中构建cell的更多信息[在这里](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-52-builder-primitives)。 |  |
| **`8F_rxxcccc`** | `[builder] PUSHCONT`<br/>`[builder] CONT` | _`- c`_ | 从 `builder` 中推送continuation。<br/>_细节:_ 推送由 `cc.code` 的前 `0 <= r <= 3` 个引用和前 `0 <= xx <= 127` 字节制成的简单普通continuation `cccc`。 | `26` |
| **`9xccc`** | `[builder] PUSHCONT`<br/>`[builder] CONT` | _`- c`_ | 从 `builder` 中推送continuation。<br/>_细节:_ 推送一个 `x` 字节的continuation，对于 `0 <= x <= 15`。 | `18` |
|  | `<{ code }> PUSHCONT`<br/>`<{ code }> CONT`<br/>`CONT:<{ code }>` | _`- c`_ | 用代码 `code` 推送continuation。<br/>注意，汇编程序可以在某些情况下（例如，如果当前continuation中没有足够的空间）将 [`PUSHCONT`](#instr-pushcont) 替换为 [`PUSHREFCONT`](#instr-pushrefcont)。 |  |


### TVM 指令内容列表

* [概述](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常数和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [特定于应用的原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/control-flow.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/control-flow.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { continuationOpcodes as opcodes } from '@site/src/data/opcodes';

# Continuation 和控制流原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [特定应用原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)

## Continuation 和控制流原语
### 无条件控制流原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`D8`** | `EXECUTE`<br/>`CALLX` | _`c - `_ | _调用_ 或 _执行_ Continuation `c`。 | `18` |
| **`D9`** | `JMPX` | _`c - `_ | _跳转_ 或 控制转移到 Continuation `c`。<br/>之前当前continuation `cc`的剩余部分被丢弃。 | `18` |
| **`DApr`** | `[p] [r] CALLXARGS` | _`c - `_ | 用 `p` 参数 _调用_ continuation `c` 并期待 `r` 返回值<br/>`0 <= p <= 15`, `0 <= r <= 15` | `26` |
| **`DB0p`** | `[p] -1 CALLXARGS` | _`c - `_ | 用 `0 <= p <= 15` 参数 _调用_ continuation `c`, 期望任意数量的返回值。 | `26` |
| **`DB1p`** | `[p] JMPXARGS` | _`c - `_ | _跳转_ 到 continuation `c`, 只将当前栈顶的 `0 <= p <= 15` 个值传递给它（当前栈的其余部分被丢弃）。 | `26` |
| **`DB2r`** | `[r] RETARGS` |  | _返回_ 到 `c0`, 携带 `0 <= r <= 15` 个从当前栈中取得的返回值。 | `26` |
| **`DB30`** | `RET`<br/>`RETTRUE` |  | _返回_ 到 continuation `c0`。当前 continuation `cc`的剩余部分被丢弃。<br/>大致相当于 [`c0 PUSHCTR`](#instr-pushctr) [`JMPX`](#instr-jmpx)。 | `26` |
| **`DB31`** | `RETALT`<br/>`RETFALSE` |  | _返回_ 到 continuation `c1`。<br/>大致相当于 [`c1 PUSHCTR`](#instr-pushctr) [`JMPX`](#instr-jmpx)。 | `26` |
| **`DB32`** | `BRANCH`<br/>`RETBOOL` | _`f - `_ | 如果整数 `f!=0`, 执行 [`RETTRUE`](#instr-ret)，如果 `f=0`，执行 [`RETFALSE`](#instr-retalt)。 | `26` |
| **`DB34`** | `CALLCC` | _`c - `_ | _带当前 continuation 调用_，控制权转移到 `c`，将旧的 `cc` 值推入 `c` 的栈中（而不是丢弃它或将其写入新的 `c0`中）。 | `26` |
| **`DB35`** | `JMPXDATA` | _`c - `_ | 类似于 [`CALLCC`](#instr-callcc)，但是当前 continuation 的剩余部分（旧的 `cc` 值）在推入 `c` 的栈之前被转换成一个 _Slice_。 | `26` |
| **`DB36pr`** | `[p] [r] CALLCCARGS` | _`c - `_ | 类似于 [`CALLXARGS`](#instr-callxargs)，但是将旧的 `cc` 值（连同最初栈顶的 `0 <= p <= 15` 个值）推入被调用 continuation `c` 的栈中，设置 `cc.nargs` 为 `-1 <= r <= 14`。 | `34` |
| **`DB38`** | `CALLXVARARGS` | _`c p r - `_ | 类似于 [`CALLXARGS`](#instr-callxargs)，但从栈中取 `-1 <= p,r <= 254`。接下来的三个操作也从栈中取 `p` 和 `r`，范围都是 `-1...254`。 | `26` |
| **`DB39`** | `RETVARARGS` | _`p r - `_ | 类似于 [`RETARGS`](#instr-retargs)。 | `26` |
| **`DB3A`** | `JMPXVARARGS` | _`c p r - `_ | 类似于 [`JMPXARGS`](#instr-jmpxargs)。 | `26` |
| **`DB3B`** | `CALLCCVARARGS` | _`c p r - `_ | 类似于 [`CALLCCARGS`](#instr-callccargs)。 | `26` |
| **`DB3C`** | `[ref] CALLREF` |  | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`CALLX`](#instr-execute)。 | `126/51` |
| **`DB3D`** | `[ref] JMPREF` |  | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`JMPX`](#instr-jmpx)。 | `126/51` |
| **`DB3E`** | `[ref] JMPREFDATA` |  | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`JMPXDATA`](#instr-jmpxdata)。 | `126/51` |
| **`DB3F`** | `RETDATA` |  | 等同于 [`c0 PUSHCTR`](#instr-pushctr) [`JMPXDATA`](#instr-jmpxdata)。这样，当前 continuation 的剩余部分被转换成一个 _Slice_ 并返回给调用者。 | `26` |

### 条件控制流原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`DC`** | `IFRET`<br/>`IFNOT:` | _`f - `_ | 如果整数 `f` 非零，则执行 [`RET`](#instr-ret)。如果 `f` 是 `NaN`, 抛出一个整数溢出异常。 | `18` |
| **`DD`** | `IFNOTRET`<br/>`IF:` | _`f - `_ | 如果整数 `f` 为零，则执行 [`RET`](#instr-ret)。 | `18` |
| **`DE`** | `IF` | _`f c - `_ | 如果整数 `f` 非零，执行 `c`（即，_执行_ `c`），否则简单地丢弃两个值。 | `18` |
| **`DE`** | `IF:<{ code }>`<br/>`<{ code }>IF` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IF`](#instr-if)。 |  |
| **`DF`** | `IFNOT` | _`f c - `_ | 如果整数 `f` 为零，则执行 continuation `c`，否则简单地丢弃两个值。 | `18` |
| **`DF`** | `IFNOT:<{ code }>`<br/>`<{ code }>IFNOT` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IFNOT`](#instr-ifnot)。 |  |
| **`E0`** | `IFJMP` | _`f c - `_ | 只有当 `f` 非零时，跳转到 `c`（类似于 [`JMPX`](#instr-jmpx)）。 | `18` |
| **`E0`** | `IFJMP:<{ code }>` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IFJMP`](#instr-ifjmp)。 |  |
| **`E1`** | `IFNOTJMP` | _`f c - `_ | 只有当 `f` 为零时，跳转到 `c`（类似于 [`JMPX`](#instr-jmpx)）。 | `18` |
| **`E1`** | `IFNOTJMP:<{ code }>` | _`f -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`IFNOTJMP`](#instr-ifnotjmp)。 |  |
| **`E2`** | `IFELSE` | _`f c c' - `_ | 如果整数 `f` 非零，执行 `c`，否则执行 `c'`。等同于 [`CONDSELCHK`](#instr-condselchk) [`EXECUTE`](#instr-execute)。 | `18` |
| **`E2`** | `IF:<{ code1 }>ELSE<{ code2 }>` | _`f -`_ | 等同于 [`<{ code1 }> CONT`](#instr-pushcont) [`<{ code2 }> CONT`](#instr-pushcont) [`IFELSE`](#instr-ifelse)。 |  |
| **`E300`** | `[ref] IFREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IF`](#instr-if)，但优化了cell引用不实际加载入一个 _Slice_ 再转换成一个普通 _Continuation_ 如果 `f=0`。<br/>这个原语的 Gas 消耗取决于 `f=0` 以及引用是否之前加载过。<br/>类似的评论适用于接受 continuation 作为引用的其他原语。 | `26/126/51` |
| **`E301`** | `[ref] IFNOTREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFNOT`](#instr-ifnot)。 | `26/126/51` |
| **`E302`** | `[ref] IFJMPREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFJMP`](#instr-ifjmp)。 | `26/126/51` |
| **`E303`** | `[ref] IFNOTJMPREF` | _`f - `_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFNOTJMP`](#instr-ifnotjmp)。 | `26/126/51` |
| **`E304`** | `CONDSEL` | _`f x y - x 或 y`_ | 如果整数 `f` 非零，返回 `x`，否则返回 `y`。注意 `x` 和 `y` 上不执行类型检查；因此，它更像是一个条件栈操作。大致等同于 [`ROT`](#instr-rot) [`ISZERO`](#instr-iszero) [`INC`](#instr-inc) [`ROLLX`](#instr-rollx) [`NIP`](#instr-nip)。 | `26` |
| **`E305`** | `CONDSELCHK` | _`f x y - x 或 y`_ | 与 [`CONDSEL`](#instr-condsel) 相同，但首先检查 `x` 和 `y` 是否类型相同。 | `26` |
| **`E308`** | `IFRETALT` | _`f -`_ | 如果整数 `f!=0` 执行 [`RETALT`](#instr-retalt)。 | `26` |
| **`E309`** | `IFNOTRETALT` | _`f -`_ | 如果整数 `f=0` 执行 [`RETALT`](#instr-retalt)。 | `26` |
| **`E30D`** | `[ref] IFREFELSE` | _`f c -`_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`SWAP`](#instr-swap) [`IFELSE`](#instr-ifelse)，但优化了在 `f=0` 时，实际上并不需要将cell引用加载进一个_Slice_，然后再转换成普通的 _Continuation_。对接下来的两个原语也适用类似的备注：只有在必要时，才将cell转换成 continuations。 | `26/126/51` |
| **`E30E`** | `[ref] IFELSEREF` | _`f c -`_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`IFELSE`](#instr-ifelse)。 | `26/126/51` |
| **`E30F`** | `[ref] [ref] IFREFELSEREF` | _`f -`_ | 等同于 [`PUSHREFCONT`](#instr-pushrefcont) [`PUSHREFCONT`](#instr-pushrefcont) [`IFELSE`](#instr-ifelse)。 | `126/51` |
| **`E39_n`** | `[n] IFBITJMP` | _`x c - x`_ | 检查整数 `x` 中是否设置了位 `0 <= n <= 31`，如果是，则执行 [`JMPX`](#instr-jmpx) 跳转到 continuation `c`。值 `x` 保留在栈中。 | `26` |
| **`E3B_n`** | `[n] IFNBITJMP` | _`x c - x`_ | 如果整数 `x` 中位 `0 <= n <= 31` 未设置，跳转到 `c`。 | `26` |
| **`E3D_n`** | `[ref] [n] IFBITJMPREF` | _`x - x`_ | 如果整数 `x` 中设置了位 `0 <= n <= 31`，执行 [`JMPREF`](#instr-jmpref)。 | `126/51` |
| **`E3F_n`** | `[ref] [n] IFNBITJMPREF` | _`x - x`_ | 如果整数 `x` 中未设置位 `0 <= n <= 31`，执行 [`JMPREF`](#instr-jmpref)。 | `126/51` |

### 控制流原语：循环

| xxxxxxx<br />操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`E4`** | `REPEAT` | _`n c - `_ | 如果整数 `n` 为非负数，则执行 continuation `c` `n` 次。如果 `n>=2^31` 或 `n<-2^31`，会生成一个范围检查异常。<br/>注意，在 `c` 的代码内部的 [`RET`](#instr-ret) 作为 `continue` 使用，而不是 `break`。应使用另一种（实验性的）循环或者 [`RETALT`](#instr-retalt)（循环前与 [`SETEXITALT`](#instr-setexitalt) 一起使用）来从循环中 `break` 出去。 | `18` |
| **`E4`** | `REPEAT:<{ code }>`<br/>`<{ code }>REPEAT` | _`n -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`REPEAT`](#instr-repeat)。 |  |
| **`E5`** | `REPEATEND`<br/>`REPEAT:` | _`n - `_ | 类似于 [`REPEAT`](#instr-repeat)，但它应用于当前 continuation `cc`。 | `18` |
| **`E6`** | `UNTIL` | _`c - `_ | 执行 continuation `c`，然后从结果栈中弹出一个整数 `x`。如果 `x` 为零，执行此循环的另一次迭代。这个原语的实际实现涉及一个特殊的 continuation `ec_until`，其参数设置为循环体（continuation `c`）和原始的当前 continuation `cc`。然后这个特殊的 continuation 被保存到 `c` 的 savelist 作为 `c.c0`，然后执行修改后的 `c`。其他循环原语也类似地借助适当的特殊 continuations 实现。 | `18` |
| **`E6`** | `UNTIL:<{ code }>`<br/>`<{ code }>UNTIL` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`UNTIL`](#instr-until)。 |  |
| **`E7`** | `UNTILEND`<br/>`UNTIL:` | _`-`_ | 类似于 [`UNTIL`](#instr-until)，但在循环中执行当前 continuation `cc`。当满足循环退出条件时，执行 [`RET`](#instr-ret)。 | `18` |
| **`E8`** | `WHILE` | _`c' c - `_ | 执行 `c'` 并从结果栈中弹出一个整数 `x`。如果 `x` 为零，则退出循环并将控制权转移给原始 `cc`。如果 `x` 非零，则执行 `c`，然后开始新的迭代。 | `18` |
| **`E8`** | `WHILE:<{ cond }>DO<{ code }>` | _`-`_ | 等同于 [`<{ cond }> CONT`](#instr-pushcont) [`<{ code }> CONT`](#instr-pushcont) [`WHILE`](#instr-while)。 |  |
| **`E9`** | `WHILEEND` | _`c' - `_ | 类似于 [`WHILE`](#instr-while)，但使用当前 continuation `cc` 作为循环体。 | `18` |
| **`EA`** | `AGAIN` | _`c - `_ | 类似于 [`REPEAT`](#instr-repeat)，但无限次执行 `c`。一个 [`RET`](#instr-ret) 只是开始一个无限循环的新迭代，只能通过异常或 [`RETALT`](#instr-retalt)（或显式的 [`JMPX`](#instr-jmpx)）退出。 | `18` |
| **`EA`** | `AGAIN:<{ code }>`<br/>`<{ code }>AGAIN` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`AGAIN`](#instr-again)。 |  |
| **`EB`** | `AGAINEND`<br/>`AGAIN:` | _`-`_ | 类似于 [`AGAIN`](#instr-again)，但相对于当前 continuation `cc` 执行。 | `18` |
| **`E314`** | `REPEATBRK` | _`n c -`_ | 类似于 [`REPEAT`](#instr-repeat)，但在将旧的 `c1` 值保存到原始 `cc`的 savelist 后，还将 `c1` 设置为原始 `cc`。这样，[`RETALT`](#instr-retalt) 可以用来退出循环体。 | `26` |
| **`E314`** | `REPEATBRK:<{ code }>`<br/>`<{ code }>REPEATBRK` | _`n -`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`REPEATBRK`](#instr-repeatbrk)。 |  |
| **`E315`** | `REPEATENDBRK` | _`n -`_ | 类似于 [`REPEATEND`](#instr-repeatend)，但在将旧的 `c1` 值保存到原始 `c0`的 savelist 后，还将 `c1` 设置为原始 `c0`。等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`REPEATEND`](#instr-repeatend)。 | `26` |
| **`E316`** | `UNTILBRK` | _`c -`_ | 类似于 [`UNTIL`](#instr-until)，但也以与 [`REPEATBRK`](#instr-repeatbrk) 相同的方式修改 `c1`。 | `26` |
| **`E316`** | `UNTILBRK:<{ code }>` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`UNTILBRK`](#instr-untilbrk)。 |  |
| **`E317`** | `UNTILENDBRK`<br/>`UNTILBRK:` | _`-`_ | 等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`UNTILEND`](#instr-untilend)。 | `26` |
| **`E318`** | `WHILEBRK` | _`c' c -`_ | 类似于 [`WHILE`](#instr-while)，但也以与 [`REPEATBRK`](#instr-repeatbrk) 相同的方式修改 `c1`。 | `26` |
| **`E318`** | `WHILEBRK:<{ cond }>DO<{ code }>` | _`-`_ | 等同于 [`<{ cond }> CONT`](#instr-pushcont) [`<{ code }> CONT`](#instr-pushcont) [`WHILEBRK`](#instr-whilebrk)。 |  |
| **`E319`** | `WHILEENDBRK` | _`c -`_ | 等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`WHILEEND`](#instr-whileend)。 | `26` |
| **`E31A`** | `AGAINBRK` | _`c -`_ | 类似于 [`AGAIN`](#instr-again)，但也以与 [`REPEATBRK`](#instr-repeatbrk) 相同的方式修改 `c1`。 | `26` |
| **`E31A`** | `AGAINBRK:<{ code }>` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`AGAINBRK`](#instr-againbrk)。 |  |
| **`E31B`** | `AGAINENDBRK`<br/>`AGAINBRK:` | _`-`_ | 等同于 [`SAMEALTSAVE`](#instr-samealtsave) [`AGAINEND`](#instr-againend)。 | `26` |

### 操作 continuation 栈

这里的 `s"` 是[在 continuations 之间移动栈元素的费用](#11-gas-prices)。它等于结果栈的大小减去32（如果栈大小小于32，则为0）。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`ECrn`** | `[r] [n] SETCONTARGS` | _`x_1 x_2...x_r c - c'`_ | 类似于 [`[r] -1 SETCONTARGS`](#instr-setcontargs-n)，但将 `c.nargs` 设置为 `c'` 的栈的最终大小加上 `n`。换句话说，将 `c` 转换成一个_闭包_或_部分应用函数_，缺少 `0 <= n <= 14` 个参数。 | `26+s”` |
| **`EC0n`** | `[n] SETNUMARGS` | _`c - c'`_ | 设置 `c.nargs` 为 `n` 加上 `c` 的当前栈的深度，其中 `0 <= n <= 14`。如果 `c.nargs` 已经设置为非负值，则不进行任何操作。 | `26` |
| **`ECrF`** | `[r] -1 SETCONTARGS` | _`x_1 x_2...x_r c - c'`_ | 将 `0 <= r <= 15` 个值 `x_1...x_r` 推入（复制的）continuation `c` 的栈中，从 `x_1` 开始。如果 `c` 的栈最终深度超过了 `c.nargs`，将生成栈溢出异常。 | `26+s”` |
| **`ED0p`** | `[p] RETURNARGS` | _`-`_ | 仅保留当前栈顶的 `0 <= p <= 15` 个值（类似于 [`ONLYTOPX`](#instr-onlytopx)），所有未使用的底部值不被丢弃，而是以与 [`SETCONTARGS`](#instr-setcontargs-n) 相同的方式保存到 continuation `c0` 中。 | `26+s”` |
| **`ED10`** | `RETURNVARARGS` | _`p -`_ | 类似于 [`RETURNARGS`](#instr-returnargs)，但从栈中取整数 `0 <= p <= 255`。 | `26+s”` |
| **`ED11`** | `SETCONTVARARGS` | _`x_1 x_2...x_r c r n - c'`_ | 类似于 [`SETCONTARGS`](#instr-setcontargs-n)，但从栈中取 `0 <= r <= 255` 和 `-1 <= n <= 255`。 | `26+s”` |
| **`ED12`** | `SETNUMVARARGS` | _`c n - c'`_ | `-1 <= n <= 255`<br/>如果 `n=-1`，此操作不进行任何操作（`c'=c`）。<br/>否则其行为类似于 [`[n] SETNUMARGS`](#instr-setnumargs)，但 `n` 是从栈中取得的。 | `26` |

### 创建简单的 continuations 和 闭包
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`ED1E`** | `BLESS` | _`s - c`_ | 将 _Slice_ `s` 转换为简单的普通 continuation `c`，其中 `c.code=s`，并且栈和 savelist 为空。 | `26` |
| **`ED1F`** | `BLESSVARARGS` | _`x_1...x_r s r n - c`_ | 等同于 [`ROT`](#instr-rot) [`BLESS`](#instr-bless) [`ROTREV`](#instr-rotrev) [`SETCONTVARARGS`](#instr-setcontvarargs)。 | `26+s”` |
| **`EErn`** | `[r] [n] BLESSARGS` | _`x_1...x_r s - c`_ | `0 <= r <= 15`, `-1 <= n <= 14`<br/>等同于 [`BLESS`](#instr-bless) [`[r] [n] SETCONTARGS`](#instr-setcontargs-n)。<br/>`n` 的值由 4 位整数 `n mod 16` 内部表示。 | `26` |
| **`EE0n`** | `[n] BLESSNUMARGS` | _`s - c`_ | 也将 _Slice_ `s` 转换为 _Continuation_ `c`，但将 `c.nargs` 设置为 `0 <= n <= 14`。 | `26` |

### Continuation 保存列表和控制寄存器的操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`ED4i`** | `c[i] PUSHCTR`<br/>`c[i] PUSH` | _`- x`_ | 推送控制寄存器 `c(i)` 的当前值。如果当前代码页不支持该控制寄存器，或者它没有值，则触发异常。 | `26` |
| **`ED44`** | `c4 PUSHCTR`<br/>`c4 PUSH` | _`- x`_ | 推送“全局数据根”cell引用，从而使访问持久智能合约数据成为可能。 | `26` |
| **`ED5i`** | `c[i] POPCTR`<br/>`c[i] POP` | _`x - `_ | 从栈中弹出一个值 `x` 并存储到控制寄存器 `c(i)` 中（如果当前代码页支持）。注意，如果控制寄存器仅接受特定类型的值，则可能发生类型检查异常。 | `26` |
| **`ED54`** | `c4 POPCTR`<br/>`c4 POP` | _`x -`_ | 设置“全局数据根”cell引用，从而允许修改持久智能合约数据。 | `26` |
| **`ED6i`** | `c[i] SETCONT`<br/>`c[i] SETCONTCTR` | _`x c - c'`_ | 将 `x` 存储到 continuation `c` 的 savelist 中作为 `c(i)`，并返回结果 continuation `c'`。几乎所有与 continuations 的操作都可以用 [`SETCONTCTR`](#instr-setcontctr)、[`POPCTR`](#instr-popctr) 和 [`PUSHCTR`](#instr-pushctr) 来表达。 | `26` |
| **`ED7i`** | `c[i] SETRETCTR` | _`x - `_ | 等同于 [`c0 PUSHCTR`](#instr-pushctr) [`c[i] SETCONTCTR`](#instr-setcontctr) [`c0 POPCTR`](#instr-popctr)。 | `26` |
| **`ED8i`** | `c[i] SETALTCTR` | _`x - `_ | 等同于 [`c1 PUSHCTR`](#instr-pushctr) [`c[i] SETCONTCTR`](#instr-setcontctr) [`c0 POPCTR`](#instr-popctr)。 | `26` |
| **`ED9i`** | `c[i] POPSAVE`<br/>`c[i] POPCTRSAVE` | _`x -`_ | 类似于 [`c[i] POPCTR`](#instr-popctr)，但还将 `c[i]` 的旧值保存到 continuation `c0` 中。<br/>等同于（直到异常）[`c[i] SAVECTR`](#instr-save) [`c[i] POPCTR`](#instr-popctr)。 | `26` |
| **`EDAi`** | `c[i] SAVE`<br/>`c[i] SAVECTR` |  | 将 `c(i)` 的当前值保存到 continuation `c0` 的 savelist 中。如果 `c0` 的 savelist 中已存在 `c[i]` 的条目，则不做任何操作。等同于 [`c[i] PUSHCTR`](#instr-pushctr) [`c[i] SETRETCTR`](#instr-setretctr)。 | `26` |
| **`EDBi`** | `c[i] SAVEALT`<br/>`c[i] SAVEALTCTR` |  | 类似于 [`c[i] SAVE`](#instr-save)，但将 `c[i]` 的当前值保存到 `c1`（而不是 `c0`）的 savelist 中。 | `26` |
| **`EDCi`** | `c[i] SAVEBOTH`<br/>`c[i] SAVEBOTHCTR` |  | 等同于 [`DUP`](#instr-dup) [`c[i] SAVE`](#instr-save) [`c[i] SAVEALT`](#instr-savealt)。 | `26` |
| **`EDE0`** | `PUSHCTRX` | _`i - x`_ | 类似于 [`c[i] PUSHCTR`](#instr-pushctr)，但 `i`, `0 <= i <= 255`, 来自栈。<br/>注意，这个原语是少数“异乎寻常”的原语之一，它们不像栈操作原语那样是多态的，同时参数和返回值的类型也没有良好定义，因为 `x` 的类型取决于 `i`。 | `26` |
| **`EDE1`** | `POPCTRX` | _`x i - `_ | 类似于 [`c[i] POPCTR`](#instr-popctr)，但 `0 <= i <= 255` 来自栈。 | `26` |
| **`EDE2`** | `SETCONTCTRX` | _`x c i - c'`_ | 类似于 [`c[i] SETCONTCTR`](#instr-setcontctr)，但 `0 <= i <= 255` 来自栈。 | `26` |
| **`EDF0`** | `COMPOS`<br/>`BOOLAND` | _`c c' - c''`_ | 计算组合 `compose0(c, c’)`，它的意义为“执行 `c`，如果成功，执行 `c'`”（如果 `c` 是布尔电路）或简单地“执行 `c`，然后执行 `c'`”。等同于 [`SWAP`](#instr-swap) [`c0 SETCONT`](#instr-setcontctr)。 | `26` |
| **`EDF1`** | `COMPOSALT`<br/>`BOOLOR` | _`c c' - c''`_ | 计算替代组合 `compose1(c, c’)`，它的意义为“执行 `c`，如果不成功，执行 `c'`”（如果 `c` 是布尔电路）。等同于 [`SWAP`](#instr-swap) [`c1 SETCONT`](#instr-setcontctr)。 | `26` |
| **`EDF2`** | `COMPOSBOTH` | _`c c' - c''`_ | 计算组合 `compose1(compose0(c, c’), c’)`，它的意义为“计算布尔电路 `c`，然后无论 `c` 的结果如何，都计算 `c'`”。 | `26` |
| **`EDF3`** | `ATEXIT` | _`c - `_ | 将 `c0` 设置为 `compose0(c, c0)`。换句话说，`c` 将在退出当前子程序之前执行。 | `26` |
| **`EDF3`** | `ATEXIT:<{ code }>`<br/>`<{ code }>ATEXIT` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`ATEXIT`](#instr-atexit)。 |  |
| **`EDF4`** | `ATEXITALT` | _`c - `_ | 将 `c1` 设置为 `compose1(c, c1)`。换句话说，`c` 将在通过其替代返回路径退出当前子程序之前执行。 | `26` |
| **`EDF4`** | `ATEXITALT:<{ code }>`<br/>`<{ code }>ATEXITALT` | _`-`_ | 等同于 [`<{ code }> CONT`](#instr-pushcont) [`ATEXITALT`](#instr-atexitalt)。 |  |
| **`EDF5`** | `SETEXITALT` | _`c - `_ | 将 `c1` 设置为 `compose1(compose0(c, c0), c1)`，<br/>这样，后续的 [`RETALT`](#instr-retalt) 将首先执行 `c`，然后将控制权转移给原始的 `c0`。例如，这可以用来从嵌套循环中退出。 | `26` |
| **`EDF6`** | `THENRET` | _`c - c'`_ | 计算 `compose0(c, c0)`。 | `26` |
| **`EDF7`** | `THENRETALT` | _`c - c'`_ | 计算 `compose0(c, c1)` | `26` |
| **`EDF8`** | `INVERT` | _`-`_ | 交换 `c0` 和 `c1`。 | `26` |
| **`EDF9`** | `BOOLEVAL` | _`c - ?`_ | 执行 `cc:=compose1(compose0(c, compose0(-1 PUSHINT, cc)), compose0(0 PUSHINT, cc))`。如果 `c` 代表一个布尔电路，其最终效果是评估它，并在继续执行之前将 `-1` 或 `0` 推入栈中。 | `26` |
| **`EDFA`** | `SAMEALT` | _`-`_ | 将 `c1` 设置为 `c0`。等同于 [`c0 PUSHCTR`](#instr-pushctr) [`c1 POPCTR`](#instr-popctr)。 | `26` |
| **`EDFB`** | `SAMEALTSAVE` | _`-`_ | 将 `c1` 设置为 `c0`，但首先将 `c1` 的旧值保存到 `c0` 的 savelist 中。<br/>等同于 [`c1 SAVE`](#instr-save) [`SAMEALT`](#instr-samealt)。 | `26` |

### 字典子程序调用和跳转
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F0nn`** | `[nn] CALL`<br/>`[nn] CALLDICT` | _`- nn`_ | 调用 `c3` 中的 continuation，将整数 `0 <= nn <= 255` 作为参数推入其栈。<br/>大致相当于 [`[nn] PUSHINT`](#instr-pushint-4) [`c3 PUSHCTR`](#instr-pushctr) [`EXECUTE`](#instr-execute)。 |  |
| **`F12_n`** | `[n] CALL`<br/>`[n] CALLDICT` | _`- n`_ | 对于 `0 <= n < 2^14`，这是更大值的 `n` 的 [`[n] CALL`](#instr-calldict) 的编码。 |  |
| **`F16_n`** | `[n] JMP` | _` - n`_ | 跳转到 `c3` 中的 continuation，将整数 `0 <= n < 2^14` 作为其参数推入。<br/>大致相当于 [`n PUSHINT`](#instr-pushint-4) [`c3 PUSHCTR`](#instr-pushctr) [`JMPX`](#instr-jmpx)。 |  |
| **`F1A_n`** | `[n] PREPARE`<br/>`[n] PREPAREDICT` | _` - n c`_ | 等同于 [`n PUSHINT`](#instr-pushint-4) [`c3 PUSHCTR`](#instr-pushctr)，适用于 `0 <= n < 2^14`。<br/>这样，[`[n] CALL`](#instr-calldict) 大致等同于 [`[n] PREPARE`](#instr-preparedict) [`EXECUTE`](#instr-execute)，而 [`[n] JMP`](#instr-jmpdict) 大致等同于 [`[n] PREPARE`](#instr-preparedict) [`JMPX`](#instr-jmpx)。<br/>例如，这里可以使用 [`CALLXARGS`](#instr-callxargs) 或 [`CALLCC`](#instr-callcc) 代替 [`EXECUTE`](#instr-execute)。 |  |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [特定应用原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/data-comparison.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/data-comparison.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { comparisonOpcodes as opcodes } from '@site/src/data/opcodes';

# 比较原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [词典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定的原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)

## 比较原语
### 整数比较

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`B8`** | `SGN` | _`x - sgn(x)`_ | 计算整数 `x` 的符号：<br/>`x<0` 时为 `-1`，`x=0` 时为 `0`，`x>0` 时为 `1`。 | `18` |
| **`B9`** | `LESS` | _`x y - x<y`_ | 如 `x<y`，返回 `-1`，否则返回 `0`。 | `18` |
| **`BA`** | `EQUAL` | _`x y - x=y`_ | 如 `x=y`，返回 `-1`，否则返回 `0`。 | `18` |
| **`BB`** | `LEQ` | _`x y - x<=y`_ |  | `18` |
| **`BC`** | `GREATER` | _`x y - x>y`_ |  | `18` |
| **`BD`** | `NEQ` | _`x y - x!=y`_ | 等同于 [`EQUAL`](#instr-equal) [`NOT`](#instr-not)。 | `18` |
| **`BE`** | `GEQ` | _`x y - x>=y`_ | 等同于 [`LESS`](#instr-less) [`NOT`](#instr-not)。 | `18` |
| **`BF`** | `CMP` | _`x y - sgn(x-y)`_ | 计算 `x-y` 的符号：<br/>`x<y` 时为 `-1`，`x=y` 时为 `0`，`x>y` 时为 `1`。<br/>除非 `x` 或 `y` 为 `NaN`，否则不会发生整数溢出。 | `18` |
| **`C0yy`** | `[yy] EQINT` | _`x - x=yy`_ | 如 `x=yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C000`** | `ISZERO` | _`x - x=0`_ | 检查一个整数是否为零。对应 Forth 的 `0=`。 | `26` |
| **`C1yy`** | `[yy] LESSINT`<br/>`[yy-1] LEQINT` | _`x - x<yy`_ | 如 `x<yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C100`** | `ISNEG` | _`x - x<0`_ | 检查一个整数是否为负数。对应 Forth 的 `0<`。 | `26` |
| **`C101`** | `ISNPOS` | _`x - x<=0`_ | 检查一个整数是否非正。 | `26` |
| **`C2yy`** | `[yy] GTINT`<br/>`[yy+1] GEQINT` | _`x - x>yy`_ | 如 `x>yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C200`** | `ISPOS` | _`x - x>0`_ | 检查一个整数是否为正数。对应 Forth 的 `0>`。 | `26` |
| **`C2FF`** | `ISNNEG` | _`x - x >=0`_ | 检查一个整数是否非负。 | `26` |
| **`C3yy`** | `[yy] NEQINT` | _`x - x!=yy`_ | 如 `x!=yy`，返回 `-1`，否则返回 `0`。<br/>`-2^7 <= yy < 2^7`。 | `26` |
| **`C4`** | `ISNAN` | _`x - x=NaN`_ | 检查 `x` 是否为 `NaN`。 | `18` |
| **`C5`** | `CHKNAN` | _`x - x`_ | 如果 `x` 为 `NaN`，抛出算术溢出异常。 | `18/68` |

### 其他比较

这些“其他比较”原语中的大多数实际上将_Slice_的数据部分作为位串进行比较（如果没有另外声明，忽略引用）。

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`C700`** | `SEMPTY` | _`s - ?`_ | 检查切片 `s` 是否为空（即，不包含任何数据位和cell引用）。 | `26` |
| **`C701`** | `SDEMPTY` | _`s - ?`_ | 检查切片 `s` 是否没有数据位。 | `26` |
| **`C702`** | `SREMPTY` | _`s - ?`_ | 检查切片 `s` 是否没有引用。 | `26` |
| **`C703`** | `SDFIRST` | _`s - ?`_ | 检查切片 `s` 的第一个位是否为一。 | `26` |
| **`C704`** | `SDLEXCMP` | _`s s' - x`_ | 字典序比较 `s` 和 `s'` 的数据，根据结果返回 `-1`、0 或 1。 | `26` |
| **`C705`** | `SDEQ` | _`s s' - ?`_ | 检查 `s` 和 `s'` 的数据部分是否一致，等同于 [`SDLEXCMP`](#instr-sdlexcmp) [`ISZERO`](#instr-iszero)。 | `26` |
| **`C708`** | `SDPFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的前缀。 | `26` |
| **`C709`** | `SDPFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的前缀，等同于 [`SWAP`](#instr-swap) [`SDPFX`](#instr-sdpfx)。 | `26` |
| **`C70A`** | `SDPPFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的真前缀（即，一个与 `s'` 不同的前缀）。 | `26` |
| **`C70B`** | `SDPPFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的真前缀。 | `26` |
| **`C70C`** | `SDSFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的后缀。 | `26` |
| **`C70D`** | `SDSFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的后缀。 | `26` |
| **`C70E`** | `SDPSFX` | _`s s' - ?`_ | 检查 `s` 是否是 `s'` 的真后缀。 | `26` |
| **`C70F`** | `SDPSFXREV` | _`s s' - ?`_ | 检查 `s'` 是否是 `s` 的真后缀。 | `26` |
| **`C710`** | `SDCNTLEAD0` | _`s - n`_ | 返回 `s` 中前导零的数量。 | `26` |
| **`C711`** | `SDCNTLEAD1` | _`s - n`_ | 返回 `s` 中前导一的数量。 | `26` |
| **`C712`** | `SDCNTTRAIL0` | _`s - n`_ | 返回 `s` 中末尾零的数量。 | `26` |
| **`C713`** | `SDCNTTRAIL1` | _`s - n`_ | 返回 `s` 中末尾一的数量。 | `26` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [词典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定的原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/dictionary-manipulation.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/dictionary-manipulation.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { dictionaryManipulationOpcodes as opcodes } from '@site/src/data/opcodes';

# 字典操作原语

大部分字典操作的Gas消耗不是固定的，它依赖于给定字典的内容。

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定的原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)

## 字典操作原语

### 字典创建
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`6D`** | `NEWDICT` | _` - D`_ | 返回一个新的空字典。<br/>它是 [`PUSHNULL`](#instr-null) 的另一种助记符。 | `18` |
| **`6E`** | `DICTEMPTY` | _`D - ?`_ | 检查字典 `D` 是否为空，并相应地返回 `-1` 或 `0`。<br/>它是 [`ISNULL`](#instr-isnull) 的另一种助记符。 | `18` |

### 字典序列化与反序列化
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`CE`** | `STDICTS`<br/>`` | _`s b - b'`_ | 将以_切片_表示的字典 `s` 存储进_构建器_ `b`中。<br/>实际上，这是 [`STSLICE`](#instr-stslice) 的同义词。 | `18` |
| **`F400`** | `STDICT`<br/>`STOPTREF` | _`D b - b'`_ | 将字典 `D` 存入_构建器_ `b`，返回结果 _构建器_ `b'`。<br/>换言之，如果 `D` 是一个cell，执行 [`STONE`](#instr-stone) 和 [`STREF`](#instr-stref)；如果 `D` 是 _Null_，执行 [`NIP`](#instr-nip) 和 [`STZERO`](#instr-stzero)；否则抛出类型检查异常。 | `26` |
| **`F401`** | `SKIPDICT`<br/>`SKIPOPTREF` | _`s - s'`_ | 相当于 [`LDDICT`](#instr-lddict) [`NIP`](#instr-nip)。 | `26` |
| **`F402`** | `LDDICTS` | _`s - s' s''`_ | 从_切片_ `s`中加载（解析）以_切片_表示的字典 `s'`，并将 `s`的剩余部分作为 `s''` 返回。<br/>这是所有 `HashmapE(n,X)` 类型字典的“分裂函数”。 | `26` |
| **`F403`** | `PLDDICTS` | _`s - s'`_ | 从_切片_ `s`中预加载以_切片_表示的字典 `s'`。<br/>大致相当于 [`LDDICTS`](#instr-lddicts) [`DROP`](#instr-drop)。 | `26` |
| **`F404`** | `LDDICT`<br/>`LDOPTREF` | _`s - D s'`_ | 从_切片_ `s`中加载（解析）字典 `D`，并将 `s`的剩余部分作为 `s'` 返回。可应用于字典或任意 `(^Y)?` 类型的值。 | `26` |
| **`F405`** | `PLDDICT`<br/>`PLDOPTREF` | _`s - D`_ | 从_切片_ `s`中预加载字典 `D`。<br/>大致相当于 [`LDDICT`](#instr-lddict) [`DROP`](#instr-drop)。 | `26` |
| **`F406`** | `LDDICTQ` | _`s - D s' -1或 s 0`_ | [`LDDICT`](#instr-lddict) 的静默版本。 | `26` |
| **`F407`** | `PLDDICTQ` | _`s - D -1或0`_ | [`PLDDICT`](#instr-plddict) 的静默版本。 | `26` |

### 获取字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F40A`** | `DICTGET` | _`k D n - x -1或0`_ | 在类型为 `HashmapE(n,X)` 且拥有 `n`-位键的字典 `D` 中查找键 `k`（由_切片_表示，其前 `0 <= n <= 1023` 数据位被用作键）。<br/>成功时，以_切片_ `x` 的形式返回找到的值。 |  |
| **`F40B`** | `DICTGETREF` | _`k D n - c -1或0`_ | 与 [`DICTGET`](#instr-dictget) 类似，但在成功时对 `x` 应用 [`LDREF`](#instr-ldref) [`ENDS`](#instr-ends)。<br/>此操作对于类型为 `HashmapE(n,^Y)` 的字典很有用。 |  |
| **`F40C`** | `DICTIGET` | _`i D n - x -1或0`_ | 与 [`DICTGET`](#instr-dictget) 类似，但使用带符号的（大端）`n`-位 _整型_ `i` 作为键。如果 `i` 不能放入 `n` 位，则返回 `0`。如果 `i` 是 `NaN`，抛出整数溢出异常。 |  |
| **`F40D`** | `DICTIGETREF` | _`i D n - c -1或0`_ | 组合 [`DICTIGET`](#instr-dictiget) 与 [`DICTGETREF`](#instr-dictgetref)：它使用带符号的 `n`-位 _整型_ `i` 作为键，并在成功时返回 _cell_ 而不是_切片_。 |  |
| **`F40E`** | `DICTUGET` | _`i D n - x -1或0`_ | 与 [`DICTIGET`](#instr-dictiget) 类似，但使用_无符号_的（大端）`n`-位 _整型_ `i` 作为键。 |  |
| **`F40F`** | `DICTUGETREF` | _`i D n - c -1或0`_ | 与 [`DICTIGETREF`](#instr-dictigetref) 类似，但使用一个无符号 `n`-位 _整型_ 键 `i`。 |  |

### 设置/替换/添加字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F412`** | `DICTSET` | _`x k D n - D'`_ | 在字典 `D`（同样用_切片_表示）中设置 `n`-位键 `k`（如 [`DICTGET`](#instr-dictget) 中用_切片_表示）关联的值为 `x`（再次是_切片_），并返回结果字典 `D'`。 |  |
| **`F413`** | `DICTSETREF` | _`c k D n - D'`_ | 类似于 [`DICTSET`](#instr-dictset)，但设置的值为对_cell_ `c` 的引用。 |  |
| **`F414`** | `DICTISET` | _`x i D n - D'`_ | 类似于 [`DICTSET`](#instr-dictset)，但键由（大端）有符号 `n`-位整数 `i` 表示。如果 `i` 不能放入 `n` 位，则生成范围检查异常。 |  |
| **`F415`** | `DICTISETREF` | _`c i D n - D'`_ | 类似于 [`DICTSETREF`](#instr-dictsetref)，但键由 [`DICTISET`](#instr-dictiset) 中的有符号 `n`-位整数表示。 |  |
| **`F416`** | `DICTUSET` | _`x i D n - D'`_ | 类似于 [`DICTISET`](#instr-dictiset)，但 `i` 为 _无符号_ `n`-位整数。 |  |
| **`F417`** | `DICTUSETREF` | _`c i D n - D'`_ | 类似于 [`DICTISETREF`](#instr-dictisetref)，但 `i` 为无符号。 |  |
| **`F41A`** | `DICTSETGET` | _`x k D n - D' y -1或 D' 0`_ | 结合 [`DICTSET`](#instr-dictset) 和 [`DICTGET`](#instr-dictget)：它将键 `k` 对应的值设置为 `x`，但也返回该键原有的旧值 `y`（如果存在）。 |  |
| **`F41B`** | `DICTSETGETREF` | _`c k D n - D' c' -1或 D' 0`_ | 类似于 [`DICTSETGET`](#instr-dictsetget) 的 [`DICTSETREF`](#instr-dictsetref) 与 [`DICTGETREF`](#instr-dictgetref) 的组合。 |  |
| **`F41C`** | `DICTISETGET` | _`x i D n - D' y -1或 D' 0`_ | [`DICTISETGET`](#instr-dictisetget)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F41D`** | `DICTISETGETREF` | _`c i D n - D' c' -1或 D' 0`_ | [`DICTISETGETREF`](#instr-dictisetgetref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F41E`** | `DICTUSETGET` | _`x i D n - D' y -1或 D' 0`_ | [`DICTISETGET`](#instr-dictisetget)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F41F`** | `DICTUSETGETREF` | _`c i D n - D' c' -1或 D' 0`_ | [`DICTISETGETREF`](#instr-dictisetgetref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F422`** | `DICTREPLACE` | _`x k D n - D' -1或 D 0`_ | 一个 _替换_ 操作，类似于 [`DICTSET`](#instr-dictset)，但只有当键 `k` 已经存在于 `D` 中时才会将 `D` 中键 `k` 的值设置为 `x`。 |  |
| **`F423`** | `DICTREPLACEREF` | _`c k D n - D' -1或 D 0`_ | [`DICTSETREF`](#instr-dictsetref) 的 _替换_ 对应操作。 |  |
| **`F424`** | `DICTIREPLACE` | _`x i D n - D' -1或 D 0`_ | [`DICTREPLACE`](#instr-dictreplace)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F425`** | `DICTIREPLACEREF` | _`c i D n - D' -1或 D 0`_ | [`DICTREPLACEREF`](#instr-dictreplaceref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F426`** | `DICTUREPLACE` | _`x i D n - D' -1或 D 0`_ | [`DICTREPLACE`](#instr-dictreplace)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F427`** | `DICTUREPLACEREF` | _`c i D n - D' -1或 D 0`_ | [`DICTREPLACEREF`](#instr-dictreplaceref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F42A`** | `DICTREPLACEGET` | _`x k D n - D' y -1或 D 0`_ | [`DICTSETGET`](#instr-dictsetget) 的 _替换_ 对应操作：成功时，还会返回与该键相关的旧值。 |  |
| **`F42B`** | `DICTREPLACEGETREF` | _`c k D n - D' c' -1或 D 0`_ | [`DICTSETGETREF`](#instr-dictsetgetref) 的 _替换_ 对应操作。 |  |
| **`F42C`** | `DICTIREPLACEGET` | _`x i D n - D' y -1或 D 0`_ | [`DICTREPLACEGET`](#instr-dictreplaceget)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F42D`** | `DICTIREPLACEGETREF` | _`c i D n - D' c' -1或 D 0`_ | [`DICTREPLACEGETREF`](#instr-dictreplacegetref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F42E`** | `DICTUREPLACEGET` | _`x i D n - D' y -1或 D 0`_ | [`DICTREPLACEGET`](#instr-dictreplaceget)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F42F`** | `DICTUREPLACEGETREF` | _`c i D n - D' c' -1或 D 0`_ | [`DICTREPLACEGETREF`](#instr-dictreplacegetref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F432`** | `DICTADD` | _`x k D n - D' -1或 D 0`_ | [`DICTSET`](#instr-dictset) 的 _添加_ 对应操作：在字典 `D` 中将与键 `k` 关联的值设置为 `x`，但只有当它还未在 `D` 中存在时。 |  |
| **`F433`** | `DICTADDREF` | _`c k D n - D' -1或 D 0`_ | [`DICTSETREF`](#instr-dictsetref) 的 _添加_ 对应操作。 |  |
| **`F434`** | `DICTIADD` | _`x i D n - D' -1或 D 0`_ | [`DICTADD`](#instr-dictadd)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F435`** | `DICTIADDREF` | _`c i D n - D' -1或 D 0`_ | [`DICTADDREF`](#instr-dictaddref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F436`** | `DICTUADD` | _`x i D n - D' -1或 D 0`_ | [`DICTADD`](#instr-dictadd)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F437`** | `DICTUADDREF` | _`c i D n - D' -1或 D 0`_ | [`DICTADDREF`](#instr-dictaddref)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F43A`** | `DICTADDGET` | _`x k D n - D' -1或 D y 0`_ | [`DICTSETGET`](#instr-dictsetget) 的 _添加_ 对应操作：在字典 `D` 中将与键 `k` 关联的值设置为 `x`，但只有当键 `k` 还未在 `D` 中存在时。否则，仅返回旧值 `y`，不更改字典。 |  |
| **`F43B`** | `DICTADDGETREF` | _`c k D n - D' -1或 D c' 0`_ | [`DICTSETGETREF`](#instr-dictsetgetref) 的 _添加_ 对应操作。 |  |
| **`F43C`** | `DICTIADDGET` | _`x i D n - D' -1或 D y 0`_ | [`DICTADDGET`](#instr-dictaddget)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F43D`** | `DICTIADDGETREF` | _`c i D n - D' -1或 D c' 0`_ | [`DICTADDGETREF`](#instr-dictaddgetref)，但 `i` 为有符号 `n`-位整数。 |  |
| **`F43E`** | `DICTUADDGET` | _`x i D n - D' -1或 D y 0`_ | [`DICTADDGET`](#instr-dictaddget)，但 `i` 为无符号 `n`-位整数。 |  |
| **`F43F`** | `DICTUADDGETREF` | _`c i D n - D' -1或 D c' 0`_ | [`DICTADDGETREF`](#instr-dictaddgetref)，但 `i` 为无符号 `n`-位整数。 |  |

### 接受构建器的字典设置操作变体
以下操作接受新值作为_构建器_ `b`，而不是_切片_ `x`。
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F441`** | `DICTSETB` | _`b k D n - D'`_ |  |  |
| **`F442`** | `DICTISETB` | _`b i D n - D'`_ |  |  |
| **`F443`** | `DICTUSETB` | _`b i D n - D'`_ |  |  |
| **`F445`** | `DICTSETGETB` | _`b k D n - D' y -1或 D' 0`_ |  |  |
| **`F446`** | `DICTISETGETB` | _`b i D n - D' y -1或 D' 0`_ |  |  |
| **`F447`** | `DICTUSETGETB` | _`b i D n - D' y -1或 D' 0`_ |  |  |
| **`F449`** | `DICTREPLACEB` | _`b k D n - D' -1或 D 0`_ |  |  |
| **`F44A`** | `DICTIREPLACEB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F44B`** | `DICTUREPLACEB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F44D`** | `DICTREPLACEGETB` | _`b k D n - D' y -1或 D 0`_ |  |  |
| **`F44E`** | `DICTIREPLACEGETB` | _`b i D n - D' y -1或 D 0`_ |  |  |
| **`F44F`** | `DICTUREPLACEGETB` | _`b i D n - D' y -1或 D 0`_ |  |  |
| **`F451`** | `DICTADDB` | _`b k D n - D' -1或 D 0`_ |  |  |
| **`F452`** | `DICTIADDB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F453`** | `DICTUADDB` | _`b i D n - D' -1或 D 0`_ |  |  |
| **`F455`** | `DICTADDGETB` | _`b k D n - D' -1或 D y 0`_ |  |  |
| **`F456`** | `DICTIADDGETB` | _`b i D n - D' -1或 D y 0`_ |  |  |
| **`F457`** | `DICTUADDGETB` | _`b i D n - D' -1或 D y 0`_ |  |  |

### 删除字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F459`** | `DICTDEL` | _`k D n - D' -1或 D 0`_ | 从字典 `D` 中删除由_切片_ `k` 表示的 `n`-位键。如果键存在，返回修改后的字典 `D'` 和成功标志位 `-1`。否则，返回原始字典 `D` 和 `0`。 |  |
| **`F45A`** | `DICTIDEL` | _`i D n - D' ?`_ | [`DICTDEL`](#instr-dictdel) 的一个版本，键由有符号的 `n`-位 _整数_ `i` 表示。如果 `i` 不能放入 `n` 位，简单地返回 `D` `0`（“键未找到，字典未修改”）。 |  |
| **`F45B`** | `DICTUDEL` | _`i D n - D' ?`_ | 类似于 [`DICTIDEL`](#instr-dictidel)，但 `i` 为无符号的 `n`-位整数。 |  |
| **`F462`** | `DICTDELGET` | _`k D n - D' x -1或 D 0`_ | 从字典 `D` 中删除由_切片_ `k` 表示的 `n`-位键。如果键存在，返回修改后的字典 `D'`、与键 `k` 关联的原始值 `x`（由_切片_表示），和成功标志位 `-1`。否则，返回原始字典 `D` 和 `0`。 |  |
| **`F463`** | `DICTDELGETREF` | _`k D n - D' c -1或 D 0`_ | 类似于 [`DICTDELGET`](#instr-dictdelget)，但成功时对 `x` 应用 [`LDREF`](#instr-ldref) [`ENDS`](#instr-ends)，以便返回的值 `c` 是一个_cell_。 |  |
| **`F464`** | `DICTIDELGET` | _`i D n - D' x -1或 D 0`_ | [`DICTDELGET`](#instr-dictdelget)，但 `i` 为有符号的 `n`-位整数。 |  |
| **`F465`** | `DICTIDELGETREF` | _`i D n - D' c -1或 D 0`_ | [`DICTDELGETREF`](#instr-dictdelgetref)，但 `i` 为有符号的 `n`-位整数。 |  |
| **`F466`** | `DICTUDELGET` | _`i D n - D' x -1或 D 0`_ | [`DICTDELGET`](#instr-dictdelget)，但 `i` 为无符号的 `n`-位整数。 |  |
| **`F467`** | `DICTUDELGETREF` | _`i D n - D' c -1或 D 0`_ | [`DICTDELGETREF`](#instr-dictdelgetref)，但 `i` 为无符号的 `n`-位整数。 |  |

### “可能是引用”的字典操作
以下操作假设使用字典存储类型为_可能是cell（Maybe Cell）_的值 `c?`。表示如下：如果 `c?` 是一个_cell_，它作为一个没有数据位且恰好有一个对这个_cell_的引用的值存储。如果 `c?` 是_Null_，则对应的键必须从字典中缺失。
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F469`** | `DICTGETOPTREF` | _`k D n - c^?`_ | [`DICTGETREF`](#instr-dictgetref) 的一个变体，如果键 `k` 不存在于字典 `D` 中，则返回 _Null_ 而不是值 `c^?`。 |  |
| **`F46A`** | `DICTIGETOPTREF` | _`i D n - c^?`_ | [`DICTGETOPTREF`](#instr-dictgetoptref) 的版本，但 `i` 为有符号的 `n`-位整数。如果键 `i` 超出范围，也返回 _Null_。 |  |
| **`F46B`** | `DICTUGETOPTREF` | _`i D n - c^?`_ | [`DICTGETOPTREF`](#instr-dictgetoptref) 的版本，但 `i` 为无符号的 `n`-位整数。如果键 `i` 超出范围，也返回 _Null_。 |  |
| **`F46D`** | `DICTSETGETOPTREF` | _`c^? k D n - D' ~c^?`_ | [`DICTGETOPTREF`](#instr-dictgetoptref) 和 [`DICTSETGETREF`](#instr-dictsetgetref) 的一个变体，将字典 `D` 中键 `k` 对应的值设置为 `c^?`（如果 `c^?` 是_Null_，则删除该键），并返回旧值 `~c^?`（如果键 `k` 之前缺失，返回_Null_）。 |  |
| **`F46E`** | `DICTISETGETOPTREF` | _`c^? i D n - D' ~c^?`_ | 类似于 [`DICTSETGETOPTREF`](#instr-dictsetgetoptref) 的原语，但使用有符号的 `n`-位 _整数_ `i` 作为键。如果 `i` 不能放入 `n` 位，抛出范围检查异常。 |  |
| **`F46F`** | `DICTUSETGETOPTREF` | _`c^? i D n - D' ~c^?`_ | 类似于 [`DICTSETGETOPTREF`](#instr-dictsetgetoptref) 的原语，但使用无符号的 `n`-位 _整数_ `i` 作为键。 |  |

### 前缀码字典操作
构建前缀码字典的一些基本操作。
这些原语与它们非前缀码（[`DICTSET`](#instr-dictset) 等）的对应操作完全相同，不过在前缀码字典中，即使是 _Set_ 也可能失败，因此 [`PFXDICTSET`](#instr-pfxdictset) 也必须返回成功标志位。
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F470`** | `PFXDICTSET` | _`x k D n - D' -1或 D 0`_ |  |  |
| **`F471`** | `PFXDICTREPLACE` | _`x k D n - D' -1或 D 0`_ |  |  |
| **`F472`** | `PFXDICTADD` | _`x k D n - D' -1或 D 0`_ |  |  |
| **`F473`** | `PFXDICTDEL` | _`k D n - D' -1或 D 0`_ |  |  |

### GetNext 和 GetPrev 操作的变体
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F474`** | `DICTGETNEXT` | _`k D n - x' k' -1或 0`_ | 计算字典 `D` 中字典序大于 `k` 的最小键 `k'`，并返回 `k'`（由_切片_表示）及其关联的值 `x'`（也由_切片_表示）。 |  |
| **`F475`** | `DICTGETNEXTEQ` | _`k D n - x' k' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但计算字典序大于或等于 `k` 的最小键 `k'`。 |  |
| **`F476`** | `DICTGETPREV` | _`k D n - x' k' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但计算字典序小于 `k` 的最大键 `k'`。 |  |
| **`F477`** | `DICTGETPREVEQ` | _`k D n - x' k' -1或 0`_ | 类似于 [`DICTGETPREV`](#instr-dictgetprev)，但计算字典序小于或等于 `k` 的最大键 `k'`。 |  |
| **`F478`** | `DICTIGETNEXT` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但将字典 `D` 中的所有键解释为大端有符号的 `n`-位整数，并计算大于整数 `i` 的最小键 `i'`（`i` 不一定能放入 `n` 位）。 |  |
| **`F479`** | `DICTIGETNEXTEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXTEQ`](#instr-dictgetnexteq)，但将键解释为有符号的 `n`-位整数。 |  |
| **`F47A`** | `DICTIGETPREV` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREV`](#instr-dictgetprev)，但将键解释为有符号的 `n`-位整数。 |  |
| **`F47B`** | `DICTIGETPREVEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREVEQ`](#instr-dictgetpreveq)，但将键解释为有符号的 `n`-位整数。 |  |
| **`F47C`** | `DICTUGETNEXT` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXT`](#instr-dictgetnext)，但将字典 `D` 中的所有键解释为大端无符号的 `n`-位整数，并计算大于整数 `i` 的最小键 `i'`（`i` 不一定能放入 `n` 位，也不一定是非负的）。 |  |
| **`F47D`** | `DICTUGETNEXTEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETNEXTEQ`](#instr-dictgetnexteq)，但将键解释为无符号的 `n`-位整数。 |  |
| **`F47E`** | `DICTUGETPREV` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREV`](#instr-dictgetprev)，但将键解释为无符号的 `n`-位整数。 |  |
| **`F47F`** | `DICTUGETPREVEQ` | _`i D n - x' i' -1或 0`_ | 类似于 [`DICTGETPREVEQ`](#instr-dictgetpreveq)，但将键解释为无符号的 `n`-位整数。 |  |

### GetMin, GetMax, RemoveMin, RemoveMax 操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F482`** | `DICTMIN` | _`D n - x k -1或 0`_ | 计算字典 `D` 中的最小键 `k`（由拥有 `n` 数据位的_切片_表示），并返回 `k` 及其关联的值 `x`。 |  |
| **`F483`** | `DICTMINREF` | _`D n - c k -1或 0`_ | 类似于 [`DICTMIN`](#instr-dictmin)，但返回值中唯一的引用作为_cell_ `c`。 |  |
| **`F484`** | `DICTIMIN` | _`D n - x i -1或 0`_ | 类似于 [`DICTMIN`](#instr-dictmin)，但在假设所有键为大端有符号的 `n`-位整数的情况下计算最小键 `i`。注意，返回的键和值可能与 [`DICTMIN`](#instr-dictmin) 和 [`DICTUMIN`](#instr-dictumin) 计算出的不同。 |  |
| **`F485`** | `DICTIMINREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTIMIN`](#instr-dictimin)，但返回值中唯一的引用。 |  |
| **`F486`** | `DICTUMIN` | _`D n - x i -1或 0`_ | 类似于 [`DICTMIN`](#instr-dictmin)，但以无符号 `n`-位 _整数_ `i` 的形式返回键。 |  |
| **`F487`** | `DICTUMINREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTUMIN`](#instr-dictumin)，但返回值中唯一的引用。 |  |
| **`F48A`** | `DICTMAX` | _`D n - x k -1或 0`_ | 计算字典 `D` 中的最大键 `k`（由拥有 `n` 数据位的_切片_表示），并返回 `k` 及其关联的值 `x`。 |  |
| **`F48B`** | `DICTMAXREF` | _`D n - c k -1或 0`_ | 类似于 [`DICTMAX`](#instr-dictmax)，但返回值中唯一的引用。 |  |
| **`F48C`** | `DICTIMAX` | _`D n - x i -1或 0`_ | 类似于 [`DICTMAX`](#instr-dictmax)，但在假设所有键为大端有符号的 `n`-位整数的情况下计算最大键 `i`。注意，返回的键和值可能与 [`DICTMAX`](#instr-dictmax) 和 [`DICTUMAX`](#instr-dictumax) 计算出的不同。 |  |
| **`F48D`** | `DICTIMAXREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTIMAX`](#instr-dictimax)，但返回值中唯一的引用。 |  |
| **`F48E`** | `DICTUMAX` | _`D n - x i -1或 0`_ | 类似于 [`DICTMAX`](#instr-dictmax)，但以无符号 `n`-位 _整数_ `i` 的形式返回键。 |  |
| **`F48F`** | `DICTUMAXREF` | _`D n - c i -1或 0`_ | 类似于 [`DICTUMAX`](#instr-dictumax)，但返回值中唯一的引用。 |  |
| **`F492`** | `DICTREMMIN` | _`D n - D' x k -1或D 0`_ | 计算字典 `D` 中的最小键 `k`（以_n_数据位的_切片_形式表示），从字典中移除 `k`，并返回 `k` 及其关联的值 `x` 和修改后的字典 `D'`。 |  |
| **`F493`** | `DICTREMMINREF` | _`D n - D' c k -1或D 0`_ | 类似于 [`DICTREMMIN`](#instr-dictremmin)，但返回值中唯一的引用作为_cell_ `c`。 |  |
| **`F494`** | `DICTIREMMIN` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMIN`](#instr-dictremmin)，但计算最小键 `i`，假设所有键都是大端有符号的_n_-位整数。请注意，返回的键和值可能与[`DICTREMMIN`](#instr-dictremmin) 和 [`DICTUREMMIN`](#instr-dicturemmin)计算的不同。 |  |
| **`F495`** | `DICTIREMMINREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTIREMMIN`](#instr-dictiremmin)，但返回值中唯一的引用。 |  |
| **`F496`** | `DICTUREMMIN` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMIN`](#instr-dictremmin)，但以无符号_n_-位_整数_ `i` 形式返回键。 |  |
| **`F497`** | `DICTUREMMINREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTUREMMIN`](#instr-dicturemmin)，但返回值中唯一的引用。 |  |
| **`F49A`** | `DICTREMMAX` | _`D n - D' x k -1或D 0`_ | 计算字典 `D` 中的最大键 `k`（以_n_数据位的_切片_形式表示），从字典中移除 `k`，并返回 `k` 及其关联的值 `x` 和修改后的字典 `D'`。 |  |
| **`F49B`** | `DICTREMMAXREF` | _`D n - D' c k -1或D 0`_ | 类似于 [`DICTREMMAX`](#instr-dictremmax)，但返回值中唯一的引用作为_cell_ `c`。 |  |
| **`F49C`** | `DICTIREMMAX` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMAX`](#instr-dictremmax)，但计算最大键 `i`，假设所有键都是大端有符号的_n_-位整数。请注意，返回的键和值可能与[`DICTREMMAX`](#instr-dictremmax) 和 [`DICTUREMMAX`](#instr-dicturemmax)计算的不同。 |  |
| **`F49D`** | `DICTIREMMAXREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTIREMMAX`](#instr-dictiremmax)，但返回值中唯一的引用。 |  |
| **`F49E`** | `DICTUREMMAX` | _`D n - D' x i -1或D 0`_ | 类似于 [`DICTREMMAX`](#instr-dictremmax)，但以无符号_n_-位_整数_ `i` 形式返回键。 |  |
| **`F49F`** | `DICTUREMMAXREF` | _`D n - D' c i -1或D 0`_ | 类似于 [`DICTUREMMAX`](#instr-dicturemmax)，但返回值中唯一的引用。 |  |

### 特殊的获取字典和前缀码字典操作以及常量字典
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F4A0`** | `DICTIGETJMP` | _`i D n - `_ | 类似于 [`DICTIGET`](#instr-dictiget)，但在成功时将 `x` [`BLESS`](#instr-bless) 成一个continuation，并随后执行对其的 [`JMPX`](#instr-jmpx)。失败时不执行任何操作。这对于实现 `switch`/`case` 结构很有用。 |  |
| **`F4A1`** | `DICTUGETJMP` | _`i D n - `_ | 类似于 [`DICTIGETJMP`](#instr-dictigetjmp)，但执行 [`DICTUGET`](#instr-dictuget) 而非 [`DICTIGET`](#instr-dictiget)。 |  |
| **`F4A2`** | `DICTIGETEXEC` | _`i D n - `_ | 类似于 [`DICTIGETJMP`](#instr-dictigetjmp)，但使用 [`EXECUTE`](#instr-execute) 而非 [`JMPX`](#instr-jmpx)。 |  |
| **`F4A3`** | `DICTUGETEXEC` | _`i D n - `_ | 类似于 [`DICTUGETJMP`](#instr-dictugetjmp)，但使用 [`EXECUTE`](#instr-execute) 而非 [`JMPX`](#instr-jmpx)。 |  |
| **`F4A6_n`** | `[ref] [n] DICTPUSHCONST` | _` - D n`_ | 推送非空常量字典 `D`（作为`Cell^?`）和其键长 `0 <= n <= 1023`，存储为指令的一部分。字典本身是从当前continuation的剩余引用中的第一个创建的。通过这种方式，完整的 [`DICTPUSHCONST`](#instr-dictpushconst) 指令可以通过首先序列化 `xF4A4_`，然后是非空字典本身（一个 `1` 位和一个cell引用），然后是无符号的 10 位整数 `n`（仿佛通过 `STU 10` 指令）获得。空字典可以通过 [`NEWDICT`](#instr-newdict) 原语推送。 | `34` |
| **`F4A8`** | `PFXDICTGETQ` | _`s D n - s' x s'' -1或s 0`_ | 在前缀码字典中查找切片 `s` 的唯一前缀，该字典由 `Cell^?` `D` 和 `0 <= n <= 1023` 表示。如果找到，作为 `s'` 返回 `s` 的前缀，并作为切片 `x` 返回相应的值。`s` 的剩余部分作为切片 `s''` 返回。如果 `s` 的任何前缀不是前缀码字典 `D` 中的键，则返回未更改的 `s` 和零标志位以表示失败。 |  |
| **`F4A9`** | `PFXDICTGET` | _`s D n - s' x s''`_ | 类似于 [`PFXDICTGET`](#instr-pfxdictget)，但在失败时抛出cell反序列化失败异常。 |  |
| **`F4AA`** | `PFXDICTGETJMP` | _`s D n - s' s''或s`_ | 类似于 [`PFXDICTGETQ`](#instr-pfxdictgetq)，但成功时将值 `x` [`BLESS`](#instr-bless) 成一个_continuation_，并像执行 [`JMPX`](#instr-jmpx) 一样转移控制权。失败时，返回未改变的 `s` 并继续执行。 |  |
| **`F4AB`** | `PFXDICTGETEXEC` | _`s D n - s' s''`_ | 类似于 [`PFXDICTGETJMP`](#instr-pfxdictgetjmp)，但执行找到的continuation而非跳转它。失败时，抛出cell反序列化异常。 |  |
| **`F4AE_n`** | `[ref] [n] PFXDICTCONSTGETJMP`<br/>`[ref] [n] PFXDICTSWITCH` | _`s - s' s''或s`_ | 将 [`[n] DICTPUSHCONST`](#instr-dictpushconst) 和 [`PFXDICTGETJMP`](#instr-pfxdictgetjmp) 结合起来，用于 `0 <= n <= 1023`。 |  |
| **`F4BC`** | `DICTIGETJMPZ` | _`i D n - i或nothing`_ | [`DICTIGETJMP`](#instr-dictigetjmp) 的一个变种，在失败时返回索引 `i`。 |  |
| **`F4BD`** | `DICTUGETJMPZ` | _`i D n - i或nothing`_ | [`DICTUGETJMP`](#instr-dictugetjmp) 的一个变种，在失败时返回索引 `i`。 |  |
| **`F4BE`** | `DICTIGETEXECZ` | _`i D n - i或nothing`_ | [`DICTIGETEXEC`](#instr-dictigetexec) 的一个变种，在失败时返回索引 `i`。 |  |
| **`F4BF`** | `DICTUGETEXECZ` | _`i D n - i或nothing`_ | [`DICTUGETEXEC`](#instr-dictugetexec) 的一个变种，在失败时返回索引 `i`。 |  |

### SubDict 字典操作
| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F4B1`** | `SUBDICTGET` | _`k l D n - D'`_ | 构建一个由所有以前缀 `k`（由一个_切片_表示，其前 `0 <= l <= n <= 1023` 个数据位用作键）为前缀的字典 `D` 中的键组成的子字典。这里的 `D` 是类型为 `HashmapE(n,X)` 的字典，拥有 `n` 位的键。成功时，返回同类型 `HashmapE(n,X)` 的新子字典作为一个_切片_ `D'`。 |  |
| **`F4B2`** | `SUBDICTIGET` | _`x l D n - D'`_ | [`SUBDICTGET`](#instr-subdictget) 的变体，前缀由有符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 257`。 |  |
| **`F4B3`** | `SUBDICTUGET` | _`x l D n - D'`_ | [`SUBDICTGET`](#instr-subdictget) 的变体，前缀由无符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 256`。 |  |
| **`F4B5`** | `SUBDICTRPGET` | _`k l D n - D'`_ | 类似于 [`SUBDICTGET`](#instr-subdictget)，但从新字典 `D'` 的所有键中移除公共前缀 `k`，它变为 `HashmapE(n-l,X)` 类型。 |  |
| **`F4B6`** | `SUBDICTIRPGET` | _`x l D n - D'`_ | [`SUBDICTRPGET`](#instr-subdictrpget) 的变体，前缀由有符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 257`。 |  |
| **`F4B7`** | `SUBDICTURPGET` | _`x l D n - D'`_ | [`SUBDICTRPGET`](#instr-subdictrpget) 的变体，前缀由无符号的大端 `l`-位_整数_ `x` 表示，必须满足 `l <= 256`。 |  |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面值](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常生成和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定的原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/exception-gen-and-handling.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/exception-gen-and-handling.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { exceptionOpcodes as opcodes } from '@site/src/data/opcodes';

# 异常的产生与处理原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [堆栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常产生和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)

## 异常产生与处理原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`F22_n`** | `[n] THROW` | _` - 0 n`_ | 抛出参数为零的 `0 <= n <= 63` 异常。<br/>换句话说，它将控制权转移到 `c2` 中的continuation，将 `0` 和 `n` 推入其堆栈，并彻底丢弃旧堆栈。 | `76` |
| **`F26_n`** | `[n] THROWIF` | _`f - `_ | 只有当整数 `f!=0` 时，才抛出参数为零的 `0 <= n <= 63` 异常。 | `26/76` |
| **`F2A_n`** | `[n] THROWIFNOT` | _`f - `_ | 只有当整数 `f=0` 时，才抛出参数为零的 `0 <= n <= 63` 异常。 | `26/76` |
| **`F2C4_n`** | `[n] THROW` | _`- 0 nn`_ | 对于 `0 <= n < 2^11`，是 [`[n] THROW`](#instr-throw-short) 的编码，用于 `n` 的较大值。 | `84` |
| **`F2CC_n`** | `[n] THROWARG` | _`x - x nn`_ | 抛出带有参数 `x` 的 `0 <= n <  2^11` 异常，通过将 `x` 和 `n` 复制到 `c2` 的堆栈并将控制权转移给 `c2`。 | `84` |
| **`F2D4_n`** | `[n] THROWIF` | _`f - `_ | 对于 `0 <= n < 2^11`，是 [`[n] THROWIF`](#instr-throwif-short) 的编码，用于 `n` 的较大值。 | `34/84` |
| **`F2DC_n`** | `[n] THROWARGIF` | _`x f - `_ | 只有当整数 `f!=0` 时，才抛出带有参数 `x` 的 `0 <= nn < 2^11` 异常。 | `34/84` |
| **`F2E4_n`** | `[n] THROWIFNOT` | _`f - `_ | 对于 `0 <= n < 2^11`，是 [`[n] THROWIFNOT`](#instr-throwifnot-short) 的编码，用于 `n` 的较大值。 | `34/84` |
| **`F2EC_n`** | `[n] THROWARGIFNOT` | _`x f - `_ | 只有当整数 `f=0` 时，才抛出带有参数 `x` 的 `0 <= n < 2^11` 异常。 | `34/84` |
| **`F2F0`** | `THROWANY` | _`n - 0 n`_ | 抛出参数为零的 `0 <= n < 2^16` 异常。<br/>大致相当于 [`ZERO`](#instr-zero) [`SWAP`](#instr-swap) [`THROWARGANY`](#instr-throwargany)。 | `76` |
| **`F2F1`** | `THROWARGANY` | _`x n - x n`_ | 抛出带有参数 `x` 的 `0 <= n < 2^16` 异常，将控制权转移到 `c2` 中。<br/>大致相当于 [`c2 PUSHCTR`](#instr-pushctr) [`2 JMPXARGS`](#instr-jmpxargs)。 | `76` |
| **`F2F2`** | `THROWANYIF` | _`n f - `_ | 只有当 `f!=0` 时，才抛出参数为零的 `0 <= n < 2^16` 异常。 | `26/76` |
| **`F2F3`** | `THROWARGANYIF` | _`x n f - `_ | 只有当 `f!=0` 时，才抛出带有参数 `x` 的 `0 <= n<2^16` 异常。 | `26/76` |
| **`F2F4`** | `THROWANYIFNOT` | _`n f - `_ | 只有当 `f=0` 时，才抛出参数为零的 `0 <= n<2^16` 异常。 | `26/76` |
| **`F2F5`** | `THROWARGANYIFNOT` | _`x n f - `_ | 只有当 `f=0` 时，才抛出带有参数 `x` 的 `0 <= n<2^16` 异常。 | `26/76` |
| **`F2FF`** | `TRY` | _`c c' - `_ | 设置 `c2` 为 `c'`，首先将 `c2` 的旧值同时保存到 `c'` 的保存列表和当前continuation的保存列表中，该当前continuation存储到 `c.c0` 和 `c'.c0` 中。然后类似于 [`EXECUTE`](#instr-execute) 运行 `c`。如果 `c` 没有引发任何异常，从 `c` 返回时会自动恢复 `c2` 的原始值。如果发生异常，则执行权转移到 `c'`，但在此过程中恢复了 `c2` 的原始值，以便 `c'` 可以通过 [`THROWANY`](#instr-throwany) 重新抛出异常（如果它自己无法处理）。 | `26` |
| **`F2FF`** | `TRY:<{ code1 }>CATCH<{ code2 }>` | _`-`_ | 等效于 [`<{ code1 }> CONT`](#instr-pushcont) [`<{ code2 }> CONT`](#instr-pushcont) [`TRY`](#instr-try)。 |  |
| **`F3pr`** | `[p] [r] TRYARGS` | _`c c' - `_ | 类似于 [`TRY`](#instr-try)，但内部使用的是 [`[p] [r] CALLXARGS`](#instr-callxargs) 而不是 [`EXECUTE`](#instr-execute)。<br/>这样，顶部 `0 <= p <= 15` 堆栈元素以外的所有元素将保存到当前continuation的堆栈中，然后从 `c` 或 `c'` 返回时恢复，并将 `c` 或 `c'` 的结果堆栈的顶部 `0 <= r <= 15` 值作为返回值复制。 | `26` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [堆栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常产生和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/miscellaneous.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/miscellaneous.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { miscellaneousOpcodes as opcodes } from '@site/src/data/opcodes';

# 调试与代码页原语

以 `FE` 开头的操作码保留给调试原语使用。这些原语具有已知的固定操作长度，并且作为（多字节）[`NOP`](#instr-nop) 操作行为。

然而，当在启用调试模式的 TVM 实例中调用时，这些原语可以产生特定输出到 TVM 实例的文本调试日志中，不影响 TVM 状态。

[`DEBUG`](#instr-debug) 和 [`DEBUGSTR`](#instr-debugstr) 是两个调试原语，它们涵盖了所有以 `FE` 开头的操作码。当调试启用时，这里列出的其他原语具有其指定的效果。当调试禁用时，它们表现为 [`NOP`](#instr-nop)。

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### 调试原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FEnn`** | `{nn} DEBUG` | _`-`_ | `0 <= nn < 240` | `26` |
| **`FEFnssss`** | `{string} DEBUGSTR`<br/>`{string} {x} DEBUGSTRI` | _`-`_ | `0 <= n < 16`。`ssss` 的长度为 `n+1` 字节。<br/>`{string}` 是一个[字符串字面量](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-29-string-literals)。<br/>[`DEBUGSTR`](#instr-debugstr): `ssss` 是给定的字符串。<br/>[`DEBUGSTRI`](#instr-debugstr): `ssss` 是由一个字节的整数 `0 <= x <= 255` 加上给定字符串组成。| `26` |
| **`FE00`** | `DUMPSTK` | _`-`_ | 转储堆栈（最多顶部 255 个值）并显示总堆栈深度。 | `26` |
| **`FE2i`** | `s[i] DUMP` | _`-`_ | 转储 `s[i]`。| `26` |


### 代码页原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`FFnn`** | `[nn] SETCP` | _`-`_ | 选择 TVM 代码页 `0 <= nn < 240`。如果不支持代码页，则抛出无效的操作码异常。| `26` |
| **`FF00`** | `SETCP0` | _`-`_ | 选择本文档描述的 TVM（测试）代码页零。| `26` |
| **`FFFz`** | `[z-16] SETCP` | _`-`_ | 选择 TVM 代码页 `z-16`，适用于 `1 <= z <= 15`。负代码页 `-13...-1` 保留用于验证其他代码页中 TVM 运行所需的限制性 TVM 版本。负代码页 `-14` 保留用于实验性代码页，不一定在不同 TVM 实现之间兼容，并且应在 TVM 的生产版本中禁用。 | `26` |
| **`FFF0`** | `SETCPX` | _`c - `_ | 选择通过栈顶传入的代码页 `c`，`-2^15 <= c < 2^15`。 | `26` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [堆栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常产生和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/stack-manipulation.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/stack-manipulation.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { stackManipulationOpcodes as opcodes } from '@site/src/data/opcodes';

# 堆栈操作

这里 `0 <= i,j,k <= 15`，除非另有说明。

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>

### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [堆栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常产生和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


### 基本堆栈操作原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`00`** | `NOP` | _`-`_ | 无操作。 | `18` |
| **`01`** | `SWAP` | _`x y - y x`_ | 等同于 [`s1 XCHG0`](#instr-xchg-0i)。 | `18` |
| **`0i`** | `s[i] XCHG0` |  | 交换 `s0` 与 `s[i]`，`1 <= i <= 15`。 | `18` |
| **`10ij`** | `s[i] s[j] XCHG` |  | 交换 `s[i]` 与 `s[j]`，`1 <= i < j <= 15`。 | `26` |
| **`11ii`** | `s0 [ii] s() XCHG` |  | 交换 `s0` 与 `s[ii]`，`0 <= ii <= 255`。 | `26` |
| **`1i`** | `s1 s[i] XCHG` |  | 交换 `s1` 与 `s[i]`，`2 <= i <= 15`。 | `18` |
| **`2i`** | `s[i] PUSH` |  | 将旧的 `s[i]` 的一个副本推入堆栈。 | `18` |
| **`20`** | `DUP` | _`x - x x`_ | 等同于 [`s0 PUSH`](#instr-push)。 | `18` |
| **`21`** | `OVER` | _`x y - x y x`_ | 等同于 [`s1 PUSH`](#instr-push)。 | `18` |
| **`3i`** | `s[i] POP` |  | 将旧的 `s0` 值弹出到旧的 `s[i]` 中。等同于 [`s[i] XCHG0`](#instr-xchg-0i) [`DROP`](#instr-drop) | `18` |
| **`30`** | `DROP` | _`x -`_ | 等同于 [`s0 POP`](#instr-pop)，丢弃堆栈顶部值。 | `18` |
| **`31`** | `NIP` | _`x y - y`_ | 等同于 [`s1 POP`](#instr-pop)。 | `18` |

### 复杂堆栈操作原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`4ijk`** | `s[i] s[j] s[k] XCHG3` |  | 等同于 [`s2 s[i] XCHG`](#instr-xchg-ij) [`s1 s[j] XCHG`](#instr-xchg-ij) [`s[k] XCHG0`](#instr-xchg-0i)。 | `26` |
| **`50ij`** | `s[i] s[j] XCHG2` |  | 等同于 [`s1 s[i] XCHG`](#instr-xchg-ij) [`s[j] XCHG0`](#instr-xchg-0i)。 | `26` |
| **`51ij`** | `s[i] s[j] XCPU` |  | 等同于 [`s[i] XCHG0`](#instr-xchg-0i) [`s[j] PUSH`](#instr-push)。 | `26` |
| **`52ij`** | `s[i] s[j-1] PUXC` |  | 等同于 [`s[i] PUSH`](#instr-push) [`SWAP`](#instr-swap) [`s[j] XCHG0`](#instr-xchg-0i)。 | `26` |
| **`53ij`** | `s[i] s[j] PUSH2` |  | 等同于 [`s[i] PUSH`](#instr-push) [`s[j+1] PUSH`](#instr-push)。 | `26` |
| **`540ijk`** | `s[i] s[j] s[k] XCHG3_l` |  | [`XCHG3`](#instr-xchg3) 的长格式。 | `34` |
| 541ijk | `s[i] s[j] s[k] XC2PU` |  | 等同于 [`s[i] s[j] XCHG2`](#instr-xchg2) [`s[k] PUSH`](#instr-push)。 | `34` |
| **`542ijk`** | `s[i] s[j] s[k-1] XCPUXC` |  | 等同于 [`s1 s[i] XCHG`](#instr-xchg-ij) [`s[j] s[k-1] PUXC`](#instr-puxc)。 | `34` |
| **`543ijk`** | `s[i] s[j] s[k] XCPU2` |  | 等同于 [`s[i] XCHG0`](#instr-xchg-0i) [`s[j] s[k] PUSH2`](#instr-push2)。 | `34` |
| **`544ijk`** | `s[i] s[j-1] s[k-1] PUXC2` |  | 等同于 [`s[i] PUSH`](#instr-push) [`s2 XCHG0`](#instr-xchg-0i) [`s[j] s[k] XCHG2`](#instr-xchg2)。 | `34` |
| **`545ijk`** | `s[i] s[j-1] s[k-1] PUXCPU` |  | 等同于 [`s[i] s[j-1] PUXC`](#instr-puxc) [`s[k] PUSH`](#instr-push)。 | `34` |
| **`546ijk`** | `s[i] s[j-1] s[k-2] PU2XC` |  | 等同于 [`s[i] PUSH`](#instr-push) [`SWAP`](#instr-swap) [`s[j] s[k-1] PUXC`](#instr-puxc)。 | `34` |
| **`547ijk`** | `s[i] s[j] s[k] PUSH3` |  | 等同于 [`s[i] PUSH`](#instr-push) [`s[j+1] s[k+1] PUSH2`](#instr-push2)。 | `34` |
| **`55ij`** | `[i+1] [j+1] BLKSWAP` |  | 交换两个块 `s[j+i+1] … s[j+1]` 和 `s[j] … s0`。<br/> `0 <= i,j <= 15`<br/>等同于 [`[i+1] [j+1] REVERSE`](#instr-reverse) [`[j+1] 0 REVERSE`](#instr-reverse) [`[i+j+2] 0 REVERSE`](#instr-reverse)。 | `26` |
| **`5513`** | `ROT2`<br/>`2ROT` | _`a b c d e f - c d e f a b`_ | 旋转三对堆栈最顶部的条目。 | `26` |
| **`550i`** | `[i+1] ROLL` |  | 旋转顶部 `i+1` 个堆栈条目。<br/>等同于 [`1 [i+1] BLKSWAP`](#instr-blkswap)。 | `26` |
| **`55i0`** | `[i+1] -ROLL`<br/>`[i+1] ROLLREV` |  | 以相反方向旋转顶部 `i+1` 个堆栈条目。<br/>等同于 [`[i+1] 1 BLKSWAP`](#instr-blkswap)。 | `26` |
| **`56ii`** | `[ii] s() PUSH` |  | 将旧的 `s[ii]` 的一个副本推入堆栈。<br/>`0 <= ii <= 255` | `26` |
| **`57ii`** | `[ii] s() POP` |  | 将旧的 `s0` 值弹出到旧的 `s[ii]` 中。<br/>`0 <= ii <= 255` | `26` |
| **`58`** | `ROT` | _`a b c - b c a`_ | 等同于 [`1 2 BLKSWAP`](#instr-blkswap) 或 [`s2 s1 XCHG2`](#instr-xchg2)。 | `18` |
| **`59`** | `ROTREV`<br/>`-ROT` | _`a b c - c a b`_ | 等同于 [`2 1 BLKSWAP`](#instr-blkswap) 或 [`s2 s2 XCHG2`](#instr-xchg2)。 | `18` |
| **`5A`** | `SWAP2`<br/>`2SWAP` | _`a b c d - c d a b`_ | 等同于 [`2 2 BLKSWAP`](#instr-blkswap) 或 [`s3 s2 XCHG2`](#instr-xchg2)。 | `18` |
| **`5B`** | `DROP2`<br/>`2DROP` | _`a b - `_ | 等同于两次执行 [`DROP`](#instr-drop)。 | `18` |
| **`5C`** | `DUP2`<br/>`2DUP` | _`a b - a b a b`_ | 等同于 [`s1 s0 PUSH2`](#instr-push2)。 | `18` |
| **`5D`** | `OVER2`<br/>`2OVER` | _`a b c d - a b c d a b`_ | 等同于 [`s3 s2 PUSH2`](#instr-push2)。 | `18` |
| **`5Eij`** | `[i+2] [j] REVERSE` |  | 反转 `s[j+i+1] … s[j]` 的顺序。 | `26` |
| **`5F0i`** | `[i] BLKDROP` |  | 执行 `i` 次 [`DROP`](#instr-drop)。 | `26` |
| **`5Fij`** | `[i] [j] BLKPUSH` |  | 执行 `i` 次 `PUSH s(j)`。<br/>`1 <= i <= 15`, `0 <= j <= 15`。 | `26` |
| **`60`** | `PICK`<br/>`PUSHX` |  | 从堆栈弹出整数 `i`，然后执行 [`s[i] PUSH`](#instr-push)。 | `18` |
| **`61`** | `ROLLX` |  | 从堆栈弹出整数 `i`，然后执行 [`1 [i] BLKSWAP`](#instr-blkswap)。 | `18` |
| **`62`** | `-ROLLX`<br/>`ROLLREVX` |  | 从堆栈弹出整数 `i`，然后执行 [`[i] 1 BLKSWAP`](#instr-blkswap)。 | `18` |
| **`63`** | `BLKSWX` |  | 从堆栈弹出整数 `i`、`j`，然后执行 [`[i] [j] BLKSWAP`](#instr-blkswap)。 | `18` |
| **`64`** | `REVX` |  | 从堆栈弹出整数 `i`、`j`，然后执行 [`[i] [j] REVERSE`](#instr-reverse)。 | `18` |
| **`65`** | `DROPX` |  | 从堆栈弹出整数 `i`，然后执行 [`[i] BLKDROP`](#instr-blkdrop)。 | `18` |
| **`66`** | `TUCK` | _`a b - b a b`_ | 等同于 [`SWAP`](#instr-swap) [`OVER`](#instr-over) 或 [`s1 s1 XCPU`](#instr-xcpu)。 | `18` |
| **`67`** | `XCHGX` |  | 从堆栈弹出整数 `i`，然后执行 [`s[i] XCHG`](#instr-xchg-ij)。 | `18` |
| **`68`** | `DEPTH` | _`- depth`_ | 推入当前堆栈深度。 | `18` |
| **`69`** | `CHKDEPTH` | _`i -`_ | 从堆栈弹出整数 `i`，然后检查是否至少有 `i` 个元素，否则生成堆栈下溢异常。 | `18/58` |
| **`6A`** | `ONLYTOPX` |  | 从堆栈弹出整数 `i`，然后移除除顶部 `i` 个元素之外的所有元素。 | `18` |
| **`6B`** | `ONLYX` |  | 从堆栈弹出整数 `i`，然后仅保留底部 `i` 个元素。大致等同于 [`DEPTH`](#instr-depth) [`SWAP`](#instr-swap) [`SUB`](#instr-sub) [`DROPX`](#instr-dropx)。 | `18` |
| **`6Cij`** | `[i] [j] BLKDROP2` |  | 在顶部 `j` 个元素下方丢弃 `i` 个堆栈元素。<br/>`1 <= i <= 15`, `0 <= j <= 15`<br/>等同于 [`[i+j] 0 REVERSE`](#instr-reverse) [`[i] BLKDROP`](#instr-blkdrop) [`[j] 0 REVERSE`](#instr-reverse)。 | `26` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [堆栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常产生和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/tuple-list-null.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-pages/learn/tvm-instructions/instructions/tuple-list-null.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { SearchField } from '@site/src/components/SearchField';
import { tupleOpcodes as opcodes } from '@site/src/data/opcodes';

# 元组、列表和 Null 原语

<SearchField
  data={opcodes}
  searchBy="doc_fift"
  placeholder="搜索操作码"
  showKeys={[
    { key: 'doc_opcode', name: '操作码', isGrouped: true },
    { key: 'doc_fift', name: 'Fift 语法', isGrouped: true },
    { key: 'doc_stack', name: '堆栈', isGrouped: true },
    { key: 'doc_gas', name: 'Gas', isGrouped: true },
    { key: 'doc_description', name: '描述' },
  ]}
/>


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [堆栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常产生和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)

### 元组、列表和 Null 原语

| xxxxxxx<br/>操作码 | xxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 | xxxx<br/>Gas |
|:-|:-|:-|:-|:-|
| **`6D`** | `NULL`<br/>`PUSHNULL` | _` - null`_ | 推入类型为 _Null_ 的唯一值。 | `18` |
| **`6E`** | `ISNULL` | _`x - ?`_ | 检查 `x` 是否为 _Null_，根据情况分别返回 `-1` 或 `0`。 | `18` |
| **`6F0n`** | `[n] TUPLE` | _`x_1 ... x_n - t`_ | 创建包含 `n` 值 `x_1`,..., `x_n` 的新 _Tuple_ `t=(x_1, … ,x_n)`。<br/>`0 <= n <= 15` | `26+n` |
| **`6F00`** | `NIL` | _`- t`_ | 推入长度为零的唯一 _Tuple_ `t=()`。 | `26` |
| **`6F01`** | `SINGLE` | _`x - t`_ | 创建单例 `t:=(x)`，即长度为一的 _Tuple_。 | `27` |
| **`6F02`** | `PAIR`<br/>`CONS` | _`x y - t`_ | 创建对 `t:=(x,y)`。 | `28` |
| **`6F03`** | `TRIPLE` | _`x y z - t`_ | 创建三元组 `t:=(x,y,z)`。 | `29` |
| **`6F1k`** | `[k] INDEX` | _`t - x`_ | 返回 _Tuple_ `t` 的第 `k` 个元素。<br/>`0 <= k <= 15`。 | `26` |
| **`6F10`** | `FIRST`<br/>`CAR` | _`t - x`_ | 返回 _Tuple_ 的第一个元素。 | `26` |
| **`6F11`** | `SECOND`<br/>`CDR` | _`t - y`_ | 返回 _Tuple_ 的第二个元素。 | `26` |
| **`6F12`** | `THIRD` | _`t - z`_ | 返回 _Tuple_ 的第三个元素。 | `26` |
| **`6F2n`** | `[n] UNTUPLE` | _`t - x_1 ... x_n`_ | 解包长度等于 `0 <= n <= 15` 的 _Tuple_ `t=(x_1,...,x_n)`。<br/>如果 `t` 不是 _Tuple_ 或 `\|t\| != n`，则抛出类型检查异常。 | `26+n` |
| **`6F21`** | `UNSINGLE` | _`t - x`_ | 解包单例 `t=(x)`。 | `27` |
| **`6F22`** | `UNPAIR`<br/>`UNCONS` | _`t - x y`_ | 解包对 `t=(x,y)`。 | `28` |
| **`6F23`** | `UNTRIPLE` | _`t - x y z`_ | 解包三元组 `t=(x,y,z)`。 | `29` |
| **`6F3k`** | `[k] UNPACKFIRST` | _`t - x_1 ... x_k`_ | 解包 _Tuple_ `t` 的前 `0 <= k <= 15` 个元素。<br/>如果 `\|t\|<k`，抛出类型检查异常。 | `26+k` |
| **`6F30`** | `CHKTUPLE` | _`t -`_ | 检查 `t` 是否为 _Tuple_。如果不是，则抛出类型检查异常。 | `26` |
| **`6F4n`** | `[n] EXPLODE` | _`t - x_1 ... x_m m`_ | 解包 _Tuple_ `t=(x_1,...,x_m)` 并返回其长度 `m`，但仅当 `m <= n <= 15`。否则抛出类型检查异常。 | `26+m` |
| **`6F5k`** | `[k] SETINDEX` | _`t x - t'`_ | 计算 _Tuple_ `t'`，它与 `t` 仅在位置 `t'_{k+1}` 上不同，该位置被设置为 `x`。<br/>`0 <= k <= 15`<br/>如果 `k >= \|t\|`，则抛出范围检查异常。 | `26+\|t\|` |
| **`6F50`** | `SETFIRST` | _`t x - t'`_ | 将 _Tuple_ `t` 的第一个组件设置为 `x` 并返回结果 _Tuple_ `t'`。 | `26+\|t\|` |
| **`6F51`** | `SETSECOND` | _`t x - t'`_ | 将 _Tuple_ `t` 的第二个组件设置为 `x` 并返回结果 _Tuple_ `t'`。 | `26+\|t\|` |
| **`6F52`** | `SETTHIRD` | _`t x - t'`_ | 将 _Tuple_ `t` 的第三个组件设置为 `x` 并返回结果 _Tuple_ `t'`。 | `26+\|t\|` |
| **`6F6k`** | `[k] INDEXQ` | _`t - x`_ | 返回 _Tuple_ `t` 的第 `k` 个元素，其中 `0 <= k <= 15`。换句话说，如果 `t=(x_1,...,x_n)`，则返回 `x_{k+1}`。如果 `k>=n` 或 `t` 为 _Null_，则返回 _Null_ 而不是 `x`。 | `26` |
| **`6F60`** | `FIRSTQ`<br/>`CARQ` | _`t - x`_ | 返回 _Tuple_ 的第一个元素。 | `26` |
| **`6F61`** | `SECONDQ`<br/>`CDRQ` | _`t - y`_ | 返回 _Tuple_ 的第二个元素。 | `26` |
| **`6F62`** | `THIRDQ` | _`t - z`_ | 返回 _Tuple_ 的第三个元素。 | `26` |
| **`6F7k`** | `[k] SETINDEXQ` | _`t x - t'`_ | 在 _Tuple_ `t` 中设置第 `k` 个组件为 `x`，其中 `0 <= k < 16`，并返回结果 _Tuple_ `t'`。<br/>如果 `\|t\| <= k`，首先通过将所有新组件设置为 _Null_ 来将原始 _Tuple_ 扩展到长度 `n’=k+1`。如果原始值 `t` 为 _Null_，则将其视为空 _Tuple_。如果 `t` 既不是 _Null_ 也不是 _Tuple_，抛出异常。如果 `x` 为 _Null_ 且 `\|t\| <= k` 或 `t` 为 _Null_，则总是返回 `t'=t`（并且不消耗元组创建 gas）。 | `26+\|t’\|` |
| **`6F70`** | `SETFIRSTQ` | _`t x - t'`_ | 将 _Tuple_ `t` 的第一个组件设置为 `x` 并返回结果 _元组_ `t'`。 | `26+\|t’\|` |
| **`6F71`** | `SETSECONDQ` | _`t x - t'`_ | 将 _Tuple_ `t` 的第二个组件设置为 `x` 并返回结果 _元组_ `t'`。 | `26+\|t’\|` |
| **`6F72`** | `SETTHIRDQ` | _`t x - t'`_ | 将 _Tuple组_ `t` 的第三个组件设置为 `x` 并返回结果 _元组_ `t'`。 | `26+\|t’\|` |
| **`6F80`** | `TUPLEVAR` | _`x_1 ... x_n n - t`_ | 以类似于 [`TUPLE`](#instr-tuple) 的方式创建长度为 `n` 的新 _Tuple_ `t`，但 `0 <= n <= 255` 从堆栈获取。 | `26+n` |
| **`6F81`** | `INDEXVAR` | _`t k - x`_ | 类似于 [`k INDEX`](#instr-index)，但 `0 <= k <= 254` 从堆栈获取。 | `26` |
| **`6F82`** | `UNTUPLEVAR` | _`t n - x_1 ... x_n`_ | 类似于 [`n UNTUPLE`](#instr-untuple)，但 `0 <= n <= 255` 从堆栈获取。 | `26+n` |
| **`6F83`** | `UNPACKFIRSTVAR` | _`t n - x_1 ... x_n`_ | 类似于 [`n UNPACKFIRST`](#instr-unpackfirst)，但 `0 <= n <= 255` 从堆栈获取。 | `26+n` |
| **`6F84`** | `EXPLODEVAR` | _`t n - x_1 ... x_m m`_ | 类似于 [`n EXPLODE`](#instr-explode)，但 `0 <= n <= 255` 从堆栈获取。 | `26+m` |
| **`6F85`** | `SETINDEXVAR` | _`t x k - t'`_ | 类似于 [`k SETINDEX`](#instr-setindex)，但 `0 <= k <= 254` 从堆栈获取。 | `26+\|t’\|` |
| **`6F86`** | `INDEXVARQ` | _`t k - x`_ | 类似于 [`n INDEXQ`](#instr-indexq)，但 `0 <= k <= 254` 从堆栈获取。 | `26` |
| **`6F87`** | `SETINDEXVARQ` | _`t x k - t'`_ | 类似于 [`k SETINDEXQ`](#instr-setindexq)，但 `0 <= k <= 254` 从堆栈获取。 | `26+\|t’\|` |
| **`6F88`** | `TLEN` | _`t - n`_ | 返回 _Tuple_ 的长度。 | `26` |
| **`6F89`** | `QTLEN` | _`t - n or -1`_ | 类似于 [`TLEN`](#instr-tlen)，但如果 `t` 不是 _Tuple_，则返回 `-1`。 | `26` |
| **`6F8A`** | `ISTUPLE` | _`t - ?`_ | 根据 `t` 是否为 _Tuple_，分别返回 `-1` 或 `0`。 | `26` |
| **`6F8B`** | `LAST` | _`t - x`_ | 返回非空 _Tuple_ `t` 的最后一个元素。 | `26` |
| **`6F8C`** | `TPUSH`<br/>`COMMA` | _`t x - t'`_ | 将值 `x` 附加到 _Tuple_ `t=(x_1,...,x_n)`，但仅当结果 _Tuple_ `t'=(x_1,...,x_n,x)` 的长度最多为 255 时。否则抛出类型检查异常。 | `26+\|t’\|` |
| **`6F8D`** | `TPOP` | _`t - t' x`_ | 从非空 _Tuple_ `t=(x_1,...,x_n)` 分离最后一个元素 `x=x_n`，并返回结果 _Tuple_ `t'=(x_1,...,x_{n-1})` 和原始的最后一个元素 `x`。 | `26+\|t’\|` |
| **`6FA0`** | `NULLSWAPIF` | _`x - x or null x`_ | 在顶部的 _Integer_ `x` 下推入一个 _Null_，但仅当 `x!=0` 时。 | `26` |
| **`6FA1`** | `NULLSWAPIFNOT` | _`x - x or null x`_ | 在顶部的 _Integer_ `x` 下推入一个 _Null_，但仅当 `x=0` 时。可用于在类似于 [`PLDUXQ`](#instr-plduxq) 这样的静默原语后进行堆栈对齐。 | `26` |
| **`6FA2`** | `NULLROTRIF` | _`x y - x y or null x y`_ | 在顶部第二个堆栈条目下推入一个 _Null_，但仅当顶部的 _Integer_ `y` 非零时。 | `26` |
| **`6FA3`** | `NULLROTRIFNOT` | _`x y - x y or null x y`_ | 在顶部第二个堆栈条目下推入一个 _Null_，但仅当顶部的 _Integer_ `y` 为零时。可用于在类似于 [`LDUXQ`](#instr-lduxq) 这样的静默原语后进行堆栈对齐。 | `26` |
| **`6FA4`** | `NULLSWAPIF2` | _`x - x or null null x`_ | 在顶部的 _Integer_ `x` 下推入两个 _Null_，但仅当 `x!=0` 时。<br/>等同于 [`NULLSWAPIF`](#instr-nullswapif) [`NULLSWAPIF`](#instr-nullswapif)。 | `26` |
| **`6FA5`** | `NULLSWAPIFNOT2` | _`x - x or null null x`_ | 在顶部的 _Integer_ `x` 下推入两个 _Null_，但仅当 `x=0` 时。<br/>等同于 [`NULLSWAPIFNOT`](#instr-nullswapifnot) [`NULLSWAPIFNOT`](#instr-nullswapifnot)。 | `26` |
| **`6FA6`** | `NULLROTRIF2` | _`x y - x y or null null x y`_ | 在顶部第二个堆栈条目下推入两个 _Null_，但仅当顶部的 _Integer_ `y` 非零时。<br/>等同于 [`NULLROTRIF`](#instr-nullrotrif) [`NULLROTRIF`](#instr-nullrotrif)。 | `26` |
| **`6FA7`** | `NULLROTRIFNOT2` | _`x y - x y 或 null null x y`_ | 仅当最顶部的 _Integer_ `y` 为零时，才在顶部第二个堆栈条目下推入两个 _Null_。<br/>等同于两次 [`NULLROTRIFNOT`](#instr-nullrotrifnot)。 | `26` |
| **`6FBij`** | `[i] [j] INDEX2` | _`t - x`_ | 对于 `0 <= i,j <= 3`，恢复 `x=(t_{i+1})_{j+1}`。<br/>等同于 [`[i] INDEX`](#instr-index) [`[j] INDEX`](#instr-index)。 | `26` |
| **`6FB4`** | `CADR` | _`t - x`_ | 恢复 `x=(t_2)_1`。 | `26` |
| **`6FB5`** | `CDDR` | _`t - x`_ | 恢复 `x=(t_2)_2`。 | `26` |
| **`6FE_ijk`** | `[i] [j] [k] INDEX3` | _`t - x`_ | 恢复 `x=t_{i+1}_{j+1}_{k+1}`。<br/>`0 <= i,j,k <= 3`<br/>等同于 [`[i] [j] INDEX2`](#instr-index2) [`[k] INDEX`](#instr-index)。 | `26` |
| **`6FD4`** | `CADDR` | _`t - x`_ | 恢复 `x=t_2_2_1`。 | `26` |
| **`6FD5`** | `CDDDR` | _`t - x`_ | 恢复 `x=t_2_2_2`。 | `26` |


### TVM 指令内容列表

* [概览](/learn/tvm-instructions/instructions)
* [堆栈操作](/learn/tvm-instructions/instructions/stack-manipulation)
* [元组、列表和空值](/learn/tvm-instructions/instructions/tuple-list-null)
* [常量和字面量](/learn/tvm-instructions/instructions/constant)
* [算术操作](/learn/tvm-instructions/instructions/arithmetic)
* [数据比较](/learn/tvm-instructions/instructions/data-comparison)
* [Cell操作](/learn/tvm-instructions/instructions/cell-manipulation)
* [Continuation 和控制流](/learn/tvm-instructions/instructions/control-flow)
* [异常产生和处理](/learn/tvm-instructions/instructions/exception-gen-and-handling)
* [字典操作](/learn/tvm-instructions/instructions/dictionary-manipulation)
* [应用特定原语](/learn/tvm-instructions/instructions/app-specific)
* [杂项](/learn/tvm-instructions/instructions/miscellaneous)


================================================
FILE: old-docs/full-node.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/old-docs/full-node.mdx
================================================
import Button from '@site/src/components/button'

# Old full-node tutorial (low-level)

:::caution
This section describes instructions and manuals for interacting with TON at a low level.
:::

The aim of this document is to provide step-by-step instructions for setting up a full node for TON Blockchain. We assume some familiarity with TON Blockchain Lite Client, at least to the extent explained in the Getting Started section.

Note that you will need a machine with a public IP address and a high-bandwidth network connection to run a TON Blockchain Full Node. Typically you'll need a sufficiently powerful server in a data center with good network connectivity, using at least a 1 Gbit/s connection to reliably accommodate peak loads (the average load is expected to be approximately 100 Mbit/s).

It is a bad idea to run a Full Node on your home computer; instead, you could run a Full Node on a remote server and use TON Blockchain Lite Client to connect to it from home.


<Button href="/v3/guidelines/nodes/running-nodes/full-node"
        colorType="primary" sizeType={'sm'}>

Running a Full Node (with video)

</Button>


## 0. Downloading and compiling

The complete the TON Blockchain Library and Validator software is downloaded and compiled similarly to the Lite Client. This process is outlined in the Getting Started page. The most important difference is that you have to download the complete sources from the public GitHub repository https://github.com/ton-blockchain/ton (e.g. by running `git clone https://github.com/ton-blockchain/ton` and `git submodule update --init` afterwards) instead of downloading the smaller Lite Client source archive. You should also build all goals defined in `CMakeLists.txt` (e.g. by running `cmake <path-to-source-directory>` and `make` in your build directory), not only those specifically related to the Lite Client (which is also included in the larger distribution; you don't have to download and build it separately). We strongly recommend building a "release" or a "release with debug information" version of TON Blockchain Library and especially of the Validator/Full Node bypassing `-DCMAKE_BUILD_TYPE=Release` or `-DCMAKE_BUILD_TYPE=RelWithDebInfo` as an extra argument to `cmake` during its first run (if you forgot to do this, you can later delete the `CMakeCache.txt` file from your build directory and re-run `cmake` with the appropriate options).

## 1. Full Node binaries

After the sources have been compiled successfully, you should obtain executable files `validator-engine/validator-engine` and `validator-engine-console/validator-engine-console` in your build directory. These are the most important files you need to run and control a TON Blockchain Full Node (or even a Validator). You might wish to install them into your `/usr/bin` or similar directory. You are also likely to need the `generate-random-id` utility during setup.

## 2. Working directory of the Full Node

The Full Node (also known as the "validator-engine") stores its data in the subdirectories of its working directory (e.g. `/var/ton-work/db`). It requires write access to this directory. If you want to use another directory as the working directory of the Full Node, you can use the command line option `--db <path-to-work-dir>`:

```
$ validator-engine --db ${DB_ROOT}
```

where `${DB_ROOT}` is `/var/ton-work/db` or any other directory where the validator-engine has write permissions.

## 3. Working directory layout

An approximate layout of the working directory of the TON Blockchain Full Node software is as follows:

* `${DB_ROOT}/config.json` -- Automatically generated configuration file. It is automatically regenerated by the validator-engine on some occasions. When the validator-engine is not running, you can edit this file in a text editor because it is a JSON file.
* `${DB_ROOT}/static` -- A directory with files that cannot be downloaded from the network, such as the "zerostate" (corresponding to the Genesis block of other blockchain architectures) of the masterchain and active workchains. Normally you don't have to initialize this directory unless you want to run your own instance of TON Blockchain (for example, for testing or development purposes). Full nodes of existing instances of the TON Blockchain (such as the "testnet" and the "mainnet") will be able to download all required files from already running full nodes.
* `${DB_ROOT}/keyring` -- Stores public and private keys known to the validator-engine. For example, if your full node runs as a validator for some TON Blockchain shardchains, the validator block signing key is kept here. You may wish to set more restrictive permissions for this directory, such as 0700 (in *nix systems), so that only the user under which the validator-engine is running would have access to this directory.
* `${DB_ROOT}/error` -- A directory where the validator-engine copies files related to severe error conditions (e.g. invalid block candidates) for further study. It is normally empty and the validator-engine never deletes files from this directory.
* `${DB_ROOT}/archive` -- A directory where old and rarely used blocks are kept until their storage period expires. You can mount a larger but slower disk partition at this directory, or make this directory a symlink to a directory in such a partition. We recommend locating the remainder of `${DB_ROOT}` in a fast storage device such as an SSD.
* `${DB_ROOT}/etc` -- (Non-automatic) configuration files may be kept here, or in any other directory read-accessible to the validator-engine.
* Other subdirectories of `${DB_ROOT}` are used to keep ADNL cache data, recent blocks and states, and so on. They are not relevant to the purposes of this document.

## 4. Global configuration of TON Blockchain

In order to set up your Full Node, you'll need a special JSON file called the "global configuration (file)". It is called this because it is the same for all full nodes and even nodes participating in different instances of TON Blockchain (e.g. "testnet" vs. "mainnet") share an almost identical global configuration.

The "mainnet" global configuration can be downloaded at https://ton.org/global.config.json as follows:

```
$ wget https://ton.org/global.config.json
```

You may wish to put this file into `/var/ton-work/etc/ton-global.config.json` .

We'll discuss the structure of this file later in more detail. For now, let us remark that the bulk of this file consists of a list of known TON DHT nodes required for the bootstrapping of the TON Network. A smaller section near the end of this file describes the particular instance of TON Blockchain that we wish to connect to.

All instances of TON Blockchain use the same "global" TON Network (i.e. the TON Network is not fragmented into several instances for each blockchain instance). While the global network configuration is therefore independent of the particular the TON Blockchain instance chosen, the Full Nodes belonging to different instances will later connect to different overlay subnetworks inside the TON Network.

It is important to distinguish this "global configuration file", used for setting up a TON Blockchain Full Node and the "local" or "automatic configuration file" which is automatically updated by the validator-engine and usually stored in `${DB_ROOT}/config.json`. The global configuration is used to generate the initial automatic configuration file, which is thereafter updated by the validator-engine itself (e.g. by adding new DHT nodes or storing hashes of newer masterchain blocks).

## 5. Initializing the local configuration

Once the global configuration file is downloaded, it can be used to create the initial local configuration in `${DB_ROOT}/config.json`. To do this, the execute the validator-engine once:

```
$ validator-engine -C /var/ton-work/etc/ton-global.config.json --db /var/ton-work/db/ --ip <IP>:<PORT> -l /var/ton-work/log
```

Here `/var/ton-work/log` is the log directory of the `validator-engine`, where it will create its log files. The argument to the `-C` command-line option is the global configuration file downloaded from https://ton.org/ as explained above, and `/var/ton-work/db/` is the working directory `${DB_ROOT}`. Finally, `<IP>:<PORT>` are the global IP address of this full node (you need to indicate a public IPv4 address here) and the UDP port used to run TON Network protocols such as ADNL and RLDP. Make sure that your firewall is configured to pass UDP packets with source or destination `<IP>:<PORT>` at least for the `validator-engine` binary.

When the validator-engine is invoked as above, and `${DB_ROOT}/config.json` does not exist, it creates a new local configuration file `${DB_ROOT}/config.json` using the information from the global configuration file and from the command-line options such as `--ip`, and then exits. If `${DB_ROOT}/config.json` already exists, it is not rewritten; instead the validator-engine starts up as a daemon using both the local and the global configuration.

If you need to change the local configuration afterwards, you'll need to either delete this file and regenerate it from the global configuration (potentially forgetting other important information accumulated in the local configuration) or edit the local configuration in a text editor (when the validator-engine is not running).

## 6. Setting up remote control CLI

You will almost certainly want to enable validator-engine-console in the local configuration to be able to control your Full Node (i.e. validator-engine daemon) when it is running. For this, you'll need to generate two keypairs, one for the server (validator-engine) and one for the client (validator-engine-console). In the examples below we assume that validator-engine-console runs on the same machine and connects to the validator-engine through the loopback network interface. (This is not necessarily so; you can use validator-engine-console for remote control as well.)

As a first step, use the `generate-random-id` executable to create two keypairs, one for the server (on the machine running `validator-engine`) and one for the client (on the machine running `validator-engine-console`):

```
$ ./generate-random-id -m keys -n server
6E9FD109F76E08B5710445C72D2C5FEDE04A96357DAA4EC0DDAEA025ED3AC3F7 bp/RCfduCLVxBEXHLSxf7eBKljV9qk7A3a6gJe06w/c=
```

This utility generates a new keypair and saves the private key into file `server` and the public key into `server.pub`. The hexadecimal (`6E9F...F7`) and the base64 (`bp/RC...6wc/=`) representations of the public key are displayed in the standard output and are used henceforth to identify this key.

We have to install the private key `server` into the keyring of the Full Node (validator-engine):

```
$ mv server /var/ton-work/db/keyring/6E9FD109F76E08B5710445C72D2C5FEDE04A96357DAA4EC0DDAEA025ED3AC3F7
```

Notice that the file name to store this private key inside the keyring equals the hexadecimal identifier (which essentially is a hash of the public key) of this key.

Next, we generate the client keypair:

```
$ ./generate-random-id -m keys -n client
8BBA4F8FCD7CC4EF573B9FF48DC63B212A8E9292B81FC0359B5DBB8719C44656 i7pPj818xO9XO5/0jcY7ISqOkpK4H8A1m127hxnERlY=
```

We obtain a client keypair, saved into files `client` and `client.pub`. This second operation should be run in the working directory of the client (validator-engine-console) possibly on another machine.

Now we have to list the client's public key in the server's local configuration file `${DB_ROOT}/config.json`. To do this, open the local configuration file in a text editor (after terminating the validator-engine if it was running) and find the empty `control` section:

```
"control": [
]
```

Replace it with the following:

```
"control" : [
  { "id" : "bp/RCfduCLVxBEXHLSxf7eBKljV9qk7A3a6gJe06w/c=",
    "port" : <CONSOLE-PORT>,
    "allowed" : [
      { "id" : "i7pPj818xO9XO5/0jcY7ISqOkpK4H8A1m127hxnERlY=",
        "permissions" : 15
      }
    ]
  }
],
```

`control.0.id` is set to the base64 identifier of the server's public key and `control.0.allowed.0.id` is the base64 identifier of the client's public key. `<CONSOLE-PORT>` is the TCP port the server will listen to for console commands.

## 7. Running the Full Node

To run the full node, simply run the validator-engine binary in a console:

```
$ validator-engine --db ${DB_ROOT} -C /var/ton-work/etc/ton-global.config.json  -l /var/ton-work/log
```

It will read the global configuration from `/var/ton-work/etc/ton-global.config.json`, the local configuration from `${DB_ROOT}/config.json` and continue running silently. You should write suitable scripts for invoking the validator-engine as a daemon (so that it does not terminate when the console is closed), but we'll skip these considerations for simplicity. (The command-line option `-d` of the validator-engine should be sufficient for this on most *nix systems.)

If the configuration is invalid, the validator-engine will terminate immediately and, in most cases, output nothing. You'll have to study the log files under `/var/ton-work/log` to find out what went wrong. Otherwise, validator-engine will keep working silently. Again, you can understand what's going on by inspecting the log files, and by looking into subdirectories of the `${DB_ROOT}` directory.

If everything works as expected, validator-engine will locate other full nodes participating in the same instance of TON Blockchain and download recent blocks of the masterchain and all shardchains. (You can actually control the number of recent blocks to be downloaded, or even download them all starting from the zerostate---but this topic is outside the scope of this document; try running the validator-engine with command-line option `-h` to find out the list of all available options with brief explanations).

## 8. Using the Console CLI

If the validator-engine-console has been set up as explained in Section 6., you can use it to connect to the running validator-engine (i.e. your Full Node) and run simple status and key management queries:

```
$ ./validator-engine-console -k client -p server.pub -a <IP>:<CLIENT-PORT>

connecting to [<IP>:<CLIENT-PORT>]
local key: 8BBA4F8FCD7CC4EF573B9FF48DC63B212A8E9292B81FC0359B5DBB8719C44656
remote key: 6E9FD109F76E08B5710445C72D2C5FEDE04A96357DAA4EC0DDAEA025ED3AC3F7
conn ready
> gettime
received validator time: time=1566568904
```

The `gettime` command obtains the current Unix time at the validator. If everything has been configured properly, you'll see an output similar to the one above. Notice that you need both the client's private key (`client`) and the server's public key (`server.pub`) for the console to work. You might wish to move them (especially the client's private key) into a separate directory with suitable permissions.

Other console commands are available in the validator-engine-console. For instance, `help` displays a list of all console commands with short descriptions. In particular, they are used to set up the Full Node as a Validator for TON Blockchain, as explained in the separate **Validator page**.

## 9. Setting up the Full Node as a Lite Server

You can set up your Full Node to function as a Lite Server, so that you can use the Lite Client to connect to it from the same or a remote host. For instance, sending the command `last` in a Lite Client connected to your Full Node will display the identifier of the most recent masterchain block known to your Full Node, so that you can inspect the progress of block downloading. You can also inspect the state of all smart contracts, send external messages (e.g. wallet queries) and so on as explained in the **Step-by-Step page**.

In order to set up your Full Node as a Lite Server, you have to generate another keypair and install the private key into the server's keyring, it is similar to what we did to enable the remote console:

```
$ utils/generate-random-id -m keys -n liteserver
BDFEA84525ADB3B16D0192488837C04883C10FF1F4031BB6DEECDD17544F5347 vf6oRSWts7FtAZJIiDfASIPBD/H0Axu23uzdF1RPU0c=

mv liteserver ${DB_ROOT}/keyring/BDFEA84525ADB3B16D0192488837C04883C10FF1F4031BB6DEECDD17544F5347
```

After that, stop the validator-engine if it is running and open the local configuration file` ${TON_DB}/config.json` in a text editor. Find the empty section

```
"liteservers" : [
]
```

and replace it with a record containing the TCP port for listening to inbound Lite Client connections and the lite server's public key:

```
"liteservers" : [
{
"id" : "vf6oRSWts7FtAZJIiDfASIPBD/H0Axu23uzdF1RPU0c=",
"port" : <TCP-PORT>
}
],
```

Now start `validator-engine` again. If it does not terminate immediately, it is likely that you have re-configured it properly. Now you can use the lite-client binary (usually located as `lite-client/lite-client` with respect to the build directory) to connect to the Lite Server running as a part of your Full Node:

```
$ lite-client -a <IP>:<TCP-PORT> -p liteserver.pub
```

Again, `help` lists all commands available in the Lite Client. The **Step-by-Step page** contains some examples of what can be done with the Lite Client.



================================================
FILE: old-docs/lite-client.md
URL: https://github.com/ton-community/ton-docs/blob/main/old-docs/lite-client.md
================================================
# Lite Client

## Overview

Lite Client is a native software that allows you to read information from TON Blockchain.
Clients, such as wallets, do not store the full state of the blockchain but instead request only the necessary information from full nodes.

Lite Client is a standalone utility that can run without any dependencies. It can be downloaded from [precompiled binaries](/v3/documentation/archive/precompiled-binaries#1-download) or [compiled from sources](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#lite-client).

## Hardware requirements

Recommendations to run a Lite Client:

- 32MB RAM 
- 1 core CPU 
- 64 MB disk space
- an internet connection

:::info
Lite Client's memory and disk usage can vary depending on how it is used. It caches blocks during the session, and if the session is prolonged and requires multiple requests to different blocks, then it will store all the results on the disk. This may lead to an increase in memory and disk space usage.
:::



================================================
FILE: old-docs/validator.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/old-docs/validator.mdx
================================================
import Button from '@site/src/components/button'

# Validator setup (low-level)

## Overview

:::caution
This section describes instructions and manuals for interacting with TON at a low level.
:::

The aim of this document is to provide step-by-step instructions for setting up a full node for TON Blockchain as a validator. We assume that a TON Blockchain Full Node is already up and running as explained in [Running a Full Node](/v3/guidelines/nodes/running-nodes/full-node). We also assume some familiarity with the TON Blockchain Lite Client.

Note that a validator must be run on a dedicated high-performance server with high network bandwidth installed in a reliable data center, and that you'll need a large amount of TON (test TON, if you want to run a validator in the "testnet") as stakes for your validator. If your validator works incorrectly or is not available for prolonged periods of time, you may lose part or all of your stake, so it makes sense to use high-performance, reliable servers.


<Button href="/v3/guidelines/nodes/running-nodes/full-node"
        colorType="primary" sizeType={'lg'}>

Running a Full Node (video)

</Button>



## 0. Downloading and compiling

The basic instructions are the same as for a TON Blockchain Full Node, as explained in the [FullNode-HOWTO](/participate/nodes/full-node). In fact, any Full Node will automatically work as a validator if it discovers that the public key corresponding to its private key appears as a member of the current validator set for the currently selected TON Blockchain instance. In particular, the Full Node and the Validator use the same binary file `validator-engine`, and are controlled by means of the same `validator-engine-console`.

## 1. Controlling smart contract of validator

In order to run a Validator, you'll need a Full Node that is already up and running (and completely synchronized with the current blockchain state) and a wallet in the masterchain holding a large amount of TON (or test TON, if you want to run a validator in the "testnet" TON Blockchain instance). Typically, you'll need at least 100,001 TON in the production network and at least 10,001 test TON in the test network. The actual value (in nanotons) can be found as the value of `min_stake` in configuration parameter `#17` (available by typing `getconfig 17` into the Lite Client), plus one Toncoin.

Each validator is identified by its (Ed25519) public key. During the validator elections, the validator (or rather its public key) is also associated with a smart contract residing in the masterchain. For simplicity, we say that the validator is "controlled" by this smart contract (e.g., a wallet smart contract). Stakes are accepted on behalf of this validator only if they arrive from its associated smart contract, and only that associated smart contract is entitled to collect the validator's stake after it is unfrozen, along with the validator's share of bonuses (e.g., block mining fees, transaction and message forwarding fees collected from the users of TON Blockchain by the validator pool). Typically, the bonuses are distributed proportionally to the (effective) stakes of the validators. On the other hand, validators with higher stakes are assigned a larger amount of work to perform (i.e., they have to create and validate blocks for more shardchains), so it is important not to stake an amount that will yield more validation work than your node is capable of handling.

Notice that each validator (identified by its public key) can be associated with at most one controlling smart contract (residing in the masterchain), but the same controlling smart contract may be associated with several validators. In this way, you can run several validators (on different physical servers) and make stakes for them from the same smart contract. If one of these validators stops functioning and you lose its stake, the other validators should continue operating and will keep their stakes and potentially receive bonuses.

## 2. Creating the controlling smart contract

If you don't have a controlling smart contract, you can simply create a wallet in the masterchain. A simple wallet can be created with the aid of the script `new-wallet.fif`, located in the subdirectory `crypto/smartcont` of the source tree. In what follows, we assume that you have configured the environment variable `FIFTPATH` to include `<source-root>/crypto/fift/lib:<source-root>/crypto/smartcont`, and that your `PATH` includes a directory with the Fift binary (located as `<build-directory>/crypto/fift`). Then you can simply run:

```sh
$ fift -s new-wallet.fif -1 my_wallet_id
```

where `my_wallet_id` is any identifier you want to assign to your new wallet, and `-1` is the workchain identifier for the masterchain. If you have not set up `FIFTPATH` and `PATH`, then you'll have to run a longer version of this command in your build directory as follows:

```sh
$ crypto/fift -I <source-dir>/crypto/fift/lib:<source-dir>/crypto/smartcont -s new-wallet.fif -1 my_wallet_id
```

Once you run this script, the address of the new smart contract is displayed:

```
...
new wallet address = -1:af17db43f40b6aa24e7203a9f8c8652310c88c125062d1129fe883eaa1bd6763
(Saving address to file my_wallet_id.addr)
Non-bounceable address (for init): 0f-vF9tD9Atqok5yA6n4yGUjEMiMElBi0RKf6IPqob1nYzqK
Bounceable address (for later access): kf-vF9tD9Atqok5yA6n4yGUjEMiMElBi0RKf6IPqob1nY2dP
...
(Saved wallet creating query to file my_wallet_id-query.boc)
```

Now `my_wallet_id.pk` is a new file containing the private key for controlling this wallet (you must keep it secret), and `my_wallet_id.addr` is a (not so secret) file containing the address of this wallet. Once this is done, you have to transfer some (test) TON to the non-bounceable address of your wallet and run `sendfile my_wallet_id-query.boc` in the Lite Client to finish creating the new wallet. This process is explained in more detail in the [Wallets page](https://ton.org/start).

If you are running a validator in the mainnet, it is a good idea to use more sophisticated wallet smart contracts (e.g., multi-signature wallet). For the testnet a simple wallet should be enough.

## 3. Elector smart contract

The elector smart contract is a special smart contract residing in the masterchain. Its full address is `-1:xxx..xxx` where `-1` is the workchain identifier (`-1` corresponds to the masterchain), and `xxx..xxx` is the hexadecimal representation of its 256-bit address inside the masterchain. In order to find out this address, you have to read the configuration parameter `#1` from a recent state of the blockchain. This is easily done by means of the command `getconfig 1` in the Lite Client:

```
> getconfig 1
ConfigParam(1) = ( elector_addr:xA4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA)
x{A4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA}
```

In this case, the complete elector address is `-1:A4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA`.

We assume familiarity with the Lite Client and that you know how to run it and obtain a global configuration file for it. Notice that the above command can be run in the batch mode by using the `-c` command-line option of the Lite Client:

```sh
$ lite-client -C <global-config-file> -c 'getconfig 1'
...
ConfigParam(1) = ( elector_addr:xA4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA)
x{A4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA}
...
```

The elector smart contract has several uses. Most importantly, you can participate in validator elections or collect unfrozen stakes and bonuses by sending messages from the controlling smart contract of your validator to the elector smart contract. You can also learn about current validator elections and their participants by invoking the so-called `get-methods` of the elector smart contract, namely running:

```sh
> runmethod -1:A4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA active_election_id
...
arguments:  [ 86535 ]
result:  [ 1567633899 ]
```

(or `lite-client -C <global-config> -c "runmethod -1:<elector-addr> active_election_id"` in batch mode) will return the identifier of the currently active elections (a non-zero integer, typically the Unix time of the start of the service term of the validator group being elected) or `0` if no elections are currently active. In this example, the identifier of the active elections is `1567633899`.

You can also recover the list of all active participants (pairs of 256-bit validator public keys and their corresponding stakes expressed in nanotons) by running the method `participant_list` instead of `active_election_id`.

## 4. Creating a validator public key and ADNL address

In order to participate in validator elections, you need to know the elections identifier (obtained by running get-method `active_elections_id` of the elector smart contract), and also the public key of your validator. The public key is created by running validator-engine-console (as explained in the [FullNode-HOWTO](/participate/nodes/full-node)) and running the following commands:

```
$ validator-engine-console ...
...
conn ready
> newkey
created new key BCA335626726CF2E522D287B27E4FAFFF82D1D98615957DB8E224CB397B2EB67
> exportpub BCA335626726CF2E522D287B27E4FAFFF82D1D98615957DB8E224CB397B2EB67
got public key: xrQTSIQEsqZkWnoADMiBnyBFRUUweXTvzRQFqb5nHd5xmeE6
> addpermkey BCA335626726CF2E522D287B27E4FAFFF82D1D98615957DB8E224CB397B2EB67 1567633899 1567733900
success
```

Now the full node (validator-engine) has generated a new keypair, exported the base64 representation of the public key (`xrQT...E6`), and registered it as a persistent key for signing blocks starting from Unix time `1567633899` (equal to the election identifier) until `1567733900` (equal to the previous number plus the term duration of the validator set to be elected, available in configuration parameter `#15`, which can be learned by typing `getconfig 15` in the Lite Client, plus a safety margin in case elections actually happen later than intended).

You also need to define a temporary key to be used by the validator to participate in the network consensus protocol. The simplest way (sufficient for testing purposes) is to set this key equal to the persistent (block signing) key:

```
> addtempkey BCA335626726CF2E522D287B27E4FAFFF82D1D98615957DB8E224CB397B2EB67 BCA335626726CF2E522D287B27E4FAFFF82D1D98615957DB8E224CB397B2EB67 1567733900
success
```

It is also a good idea to create a dedicated ADNL address to be used exclusively for validator purposes:

```
> newkey
created new key C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C
> addadnl C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C 0
success
> addvalidatoraddr BCA335626726CF2E522D287B27E4FAFFF82D1D98615957DB8E224CB397B2EB67 C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C 1567733900
success
```

Now `C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C` is the new ADNL address which will be used by the Full Node for running as a validator with the public key `BCA...B67` with the expiration time set to `1567733900`.

## 5. Creating an election participation request

The special script `validator-elect-req.fif` (located in `<source-dir>/crypto/smartcont`) is used to create a message that has to be signed by the validator in order to participate in the elections. It runs as follows:

```
$ fift -s validator-elect-req.fif <wallet-addr> <elect-utime> <max-factor> <adnl-addr> [<savefile>]
```

For example:

```
$ fift -s validator-elect-req.fif kf-vF9tD9Atqok5yA6n4yGUjEMiMElBi0RKf6IPqob1nY2dP 1567633899 2.7 C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C
```

or if you have created the controlling wallet by means of `new-wallet.fif` you can use `@my_wallet_id.addr` instead of copying the wallet address `kf-vF...dP`.

```
$ fift -s validator-elect-req.fif @my_wallet_id.addr 1567633899 2.7 C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C

Creating a request to participate in validator elections at time 1567633899 from smart contract Uf+vF9tD9Atqok5yA6n4yGUjEMiMElBi0RKf6IPqob1nY4EA = -1:af17db43f40b6aa24e7203a9f8c8652310c88c125062d1129fe883eaa1bd6763  with maximal stake factor with respect to the minimal stake 176947/65536 and validator ADNL address c5c2b94529405fb07d1ddfb4c42bfb07727e7ba07006b2db569fbf23060b9e5c
654C50745D7031EB0002B333AF17DB43F40B6AA24E7203A9F8C8652310C88C125062D1129FE883EAA1BD6763C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C
ZUxQdF1wMesAArMzrxfbQ_QLaqJOcgOp-MhlIxDIjBJQYtESn-iD6qG9Z2PFwrlFKUBfsH0d37TEK_sHcn57oHAGsttWn78jBgueXA==
```

Here, `<max-factor> = 2.7` is the maximum ratio allowed between your stake and the minimal validator stake in the elected validator group. In this way, you can be sure that your stake will be no more than 2.7 times the smallest stake, so the workload of your validator is at most 2.7 times the lowest one. If your stake is too large compared to the stakes of other validators, then it will be clipped to this value (2.7 times the smallest stake), and the remainder will be returned to you (i.e., to the controlling smart contract of your validator) immediately after the elections.

Now you obtain a binary string in hexadecimal (`654C...9E5C`) and base64 form to be signed by the validator. This can be done in `validator-engine-console`:

```
> sign BCA335626726CF2E522D287B27E4FAFFF82D1D98615957DB8E224CB397B2EB67 654C50745D7031EB0002B333AF17DB43F40B6AA24E7203A9F8C8652310C88C125062D1129FE883EAA1BD6763C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C
got signature ovf9cmr2J/speJEtMU+tZm6zH/GBEyZCPpaukqL3mmNH9Wipyoys63VFh0yR386bARHKMPpfKAYBYslOjdSjCQ
```

Here `BCA...B67` is the identifier of the signing key of our validator, and `654...E5C` is the message generated by `validator-elect-req.fif`. The signature is `ovf9...jCQ` (this is the base64 representation of 64-byte Ed25519 signature).

Now you have to run another script `validator-elect-signed.fif` which also requires the public key and the signature of the validator.

```
$ fift -s validator-elect-signed.fif @my_wallet_id.addr 1567633899 2.7 C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C xrQTSIQEsqZkWnoADMiBnyBFRUUweXTvzRQFqb5nHd5xmeE6 ovf9cmr2J/speJEtMU+tZm6zH/GBEyZCPpaukqL3mmNH9Wipyoys63VFh0yR386bARHKMPpfKAYBYslOjdSjCQ==
Creating a request to participate in validator elections at time 1567633899 from smart contract Uf+vF9tD9Atqok5yA6n4yGUjEMiMElBi0RKf6IPqob1nY4EA = -1:af17db43f40b6aa24e7203a9f8c8652310c88c125062d1129fe883eaa1bd6763  with maximal stake factor with respect to the minimal stake 176947/65536 and validator ADNL address c5c2b94529405fb07d1ddfb4c42bfb07727e7ba07006b2db569fbf23060b9e5c
String to sign is: 654C50745D7031EB0002B333AF17DB43F40B6AA24E7203A9F8C8652310C88C125062D1129FE883EAA1BD6763C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C
Provided a valid Ed25519 signature A2F7FD726AF627FB2978912D314FAD666EB31FF1811326423E96AE92A2F79A6347F568A9CA8CACEB7545874C91DFCE9B0111CA30FA5F28060162C94E8DD4A309 with validator public key 8404B2A6645A7A000CC8819F20454545307974EFCD1405A9BE671DDE7199E13A
query_id set to 1567632790

Message body is x{4E73744B000000005D702D968404B2A6645A7A000CC8819F20454545307974EFCD1405A9BE671DDE7199E13A5D7031EB0002B333C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C}
 x{A2F7FD726AF627FB2978912D314FAD666EB31FF1811326423E96AE92A2F79A6347F568A9CA8CACEB7545874C91DFCE9B0111CA30FA5F28060162C94E8DD4A309}

Saved to file validator-query.boc
```

Alternatively, if you are running `validator-engine-console` on the same machine as your wallet, you can skip the above steps and instead use the `createelectionbid` command in the Validator Console to directly create a file (e.g., `validator-query.boc`) with the message body containing your signed elections participation request. For this command to work, you have to run `validator-engine` with the `-f <fift-dir>` command-line option, where `<fift-dir>` is a directory containing copies of all required Fift source files (such as `Fift.fif`, `TonUtil.fif`, `validator-elect-req.fif`, and `validator-elect-signed.fif`), even though these files normally reside in different source directories (`<source-dir>/crypto/fift/lib and <source-dir>/crypto/smartcont`).

Now you have a message body containing your election participation request. You must send it from the controlling smart contract, carrying the stake as its value (plus one extra TON for sending confirmation). If you use the simple wallet smart contract, this can be done by using the `-B` command-line argument to `wallet.fif`:

```
$ fift -s wallet.fif my_wallet_id -1:A4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA 1 100001. -B validator-query.boc
Source wallet address = -1:af17db43f40b6aa24e7203a9f8c8652310c88c125062d1129fe883eaa1bd6763
kf-vF9tD9Atqok5yA6n4yGUjEMiMElBi0RKf6IPqob1nY2dP
Loading private key from file my_wallet_id.pk
Transferring GR$100001. to account kf-kwsfAWwk9Rw3iMW26CJ-g3Xdf2bHr_J3J0EtJjTot2lHQ = -1:a4c2c7c05b093d470de2316dba089fa0dd775fd9b1ebfc9dc9d04b498d3a2dda seqno=0x1 bounce=-1
Body of transfer message is x{4E73744B000000005D702D968404B2A6645A7A000CC8819F20454545307974EFCD1405A9BE671DDE7199E13A5D7031EB0002B333C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C}
 x{A2F7FD726AF627FB2978912D314FAD666EB31FF1811326423E96AE92A2F79A6347F568A9CA8CACEB7545874C91DFCE9B0111CA30FA5F28060162C94E8DD4A309}

signing message: x{0000000101}
 x{627FD26163E02D849EA386F118B6DD044FD06EBBAFECD8F5FE4EE4E825A4C69D16ED32D79A60A8500000000000000000000000000001}
  x{4E73744B000000005D702D968404B2A6645A7A000CC8819F20454545307974EFCD1405A9BE671DDE7199E13A5D7031EB0002B333C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C}
   x{A2F7FD726AF627FB2978912D314FAD666EB31FF1811326423E96AE92A2F79A6347F568A9CA8CACEB7545874C91DFCE9B0111CA30FA5F28060162C94E8DD4A309}

resulting external message: x{89FF5E2FB687E816D5449CE40753F190CA4621911824A0C5A2253FD107D5437ACEC6049CF8B8EA035B0446E232DB8C1DFEA97738076162B2E053513310D2A3A66A2A6C16294189F8D60A9E33D1E74518721B126A47DA3A813812959BD0BD607923B010000000080C_}
 x{627FD26163E02D849EA386F118B6DD044FD06EBBAFECD8F5FE4EE4E825A4C69D16ED32D79A60A8500000000000000000000000000001}
  x{4E73744B000000005D702D968404B2A6645A7A000CC8819F20454545307974EFCD1405A9BE671DDE7199E13A5D7031EB0002B333C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C}
   x{A2F7FD726AF627FB2978912D314FAD666EB31FF1811326423E96AE92A2F79A6347F568A9CA8CACEB7545874C91DFCE9B0111CA30FA5F28060162C94E8DD4A309}

B5EE9C7241040401000000013D0001CF89FF5E2FB687E816D5449CE40753F190CA4621911824A0C5A2253FD107D5437ACEC6049CF8B8EA035B0446E232DB8C1DFEA97738076162B2E053513310D2A3A66A2A6C16294189F8D60A9E33D1E74518721B126A47DA3A813812959BD0BD607923B010000000080C01016C627FD26163E02D849EA386F118B6DD044FD06EBBAFECD8F5FE4EE4E825A4C69D16ED32D79A60A85000000000000000000000000000010201A84E73744B000000005D702D968404B2A6645A7A000CC8819F20454545307974EFCD1405A9BE671DDE7199E13A5D7031EB0002B333C5C2B94529405FB07D1DDFB4C42BFB07727E7BA07006B2DB569FBF23060B9E5C030080A2F7FD726AF627FB2978912D314FAD666EB31FF1811326423E96AE92A2F79A6347F568A9CA8CACEB7545874C91DFCE9B0111CA30FA5F28060162C94E8DD4A309062A7721
(Saved to file wallet-query.boc)
```

Now you just have to send `wallet-query.boc` from the Lite Client (not the Validator Console):

```
> sendfile wallet-query.boc
```

or you can use the Lite Client in batch mode.

```
$ lite-client -C <config-file> -c "sendfile wallet-query.boc"
```

This is an external message signed by your private key (which controls your wallet); it instructs your wallet smart contract to send an internal message to the elector smart contract with the prescribed payload (containing the validator bid and signed by its key) and transfer the specified amount of TON. When the elector smart contract receives this internal message, it registers your bid (with the stake equal to the specified amount of TON minus one) and sends you (i.e., the wallet smart contract) a confirmation (carrying 1 TON minus message forwarding fees back) or a rejection message with an error code (carrying back almost all of the original stake amount minus processing fees).

You can check whether your stake has been accepted by running the get-method `participant_list` of the elector smart contract.

## 6. Recovering stakes and bonuses

If your stake is only partially accepted (because of `<max-factor>`) during the elections, or after your stake is unfrozen (this happens some time after the expiration of the term of the validator group to which your validator has been elected), you may want to collect all or part of your stake, along with whatever share of bonuses is due to your validator. The elector smart contract does not send the stake and bonuses to you (i.e., the controlling smart contract) in a message. Instead, it credits the amount to be returned to you inside a special table, which can be inspected with the aid of get-method `compute_returned_stake` (which expects the address of the controlling smart contract as an argument).

```
$ lite-client -C <config> -rc 'runmethod -1:A4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA compute_returned_stake 0xaf17db43f40b6aa24e7203a9f8c8652310c88c125062d1129fe883eaa1bd6763'
arguments:  [ 79196899299028790296381692623119733846152089453039582491866112477478757689187 130944 ]
result: [ 0 ]
```

If the result is zero, nothing is due to you. Otherwise, you'll see a part or all of your stake, perhaps with some bonuses. In that case, you can create a stake recovery request by using `recover-stake.fif`.

```
$ fift -s recover-stake.fif
query_id for stake recovery message is set to 1567634299

Message body is x{47657424000000005D70337B}

Saved to file recover-query.boc
```

Again, you have to send `recover-query.boc` as the payload of a message from the controlling smart contract (i.e., your wallet) to the elector smart contract.

```
$ fift -s wallet.fif my_wallet_id <dest-addr> <my-wallet-seqno> <coin-amount> -B recover-query.boc
```

For example:

```
$ fift -s wallet.fif my_wallet_id -1:A4C2C7C05B093D470DE2316DBA089FA0DD775FD9B1EBFC9DC9D04B498D3A2DDA 2 1. -B recover-query.boc
...
(Saved to file wallet-query.boc)
```

Notice that this message carries a small value (one TON) just to pay the message forwarding and processing fees. If you indicate a value equal to zero, the message will not be processed by the election smart contract (a message with exactly zero value is almost useless in the TON Blockchain context).

Once `wallet-query.boc` is ready, you can send it from the Lite Client:

```
$ liteclient -C <config> -c 'sendfile wallet-query.boc'
```

If you have done everything correctly (indicated the correct seqno of your wallet instead of `2` in the example above), you'll obtain a message from the elector smart contract containing the change from the small value you sent with your request (1 TON in this example) plus the recovered portion of your stake and bonuses.

## 7. Participating in the next elections

Notice that even before the term of the validator group containing your elected validator finishes, new elections for the next validator group will be announced. You'll probably want to participate in them as well. For this, you can use the same validator, but you must generate a new validator key and new ADNL address. You'll also have to make a new stake before your previous stake is returned (because your previous stake will be unfrozen and returned only sometime after the next validator group becomes active), so if you want to participate in concurrent elections, it likely does not make sense to stake more than half of your Toncoin.


## See Also

* [TON Validators and staking-incentives](/v3/documentation/infra/nodes/validation/staking-incentives)
* [Nominator Pools](/participate/network-maintenance/nominators)
* [TON Node Types](/v3/documentation/infra/nodes/node-types)



================================================
FILE: sidebars/concepts.js
URL: https://github.com/ton-community/ton-docs/blob/main/sidebars/concepts.js
================================================
/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/concepts/dive-into-ton/introduction',
  {
    type: 'category',
    label: 'TON Ecosystem',
    items: [
      'v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps',
      'v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton',
      'v3/concepts/dive-into-ton/ton-ecosystem/nft',
    ],
  },
  {
    type: 'category',
    label: 'TON Blockchain',
    items: [
      'v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains',
      'v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses',
      'v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage',
      'v3/concepts/dive-into-ton/ton-blockchain/ton-networking',
      'v3/concepts/dive-into-ton/ton-blockchain/sharding',
      'v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison',
      'v3/concepts/dive-into-ton/ton-blockchain/security-measures',
    ],
  },
  {
    type: 'category',
    label: 'Newcomers from Ethereum',
    items: [
      'v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services',
      'v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains',
      'v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func',
      'v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm',
    ],
  },
  'v3/concepts/educational-resources',
  'v3/concepts/glossary',
  //'v3/concepts/qa-outsource/auditors'
];



================================================
FILE: sidebars/contribute.js
URL: https://github.com/ton-community/ton-docs/blob/main/sidebars/contribute.js
================================================
/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/contribute/README',
  {
    'type': 'category',
    'label': 'Contribute guidelines',
    'items': [
      'v3/contribute/style-guide',
      'v3/contribute/content-standardization',
      'v3/contribute/typography',
    ],
  },
  // {
  //   'type': 'category',
  //   'label': 'Documentation',
  //   'items': [
  //     'v3/contribute/docs/guidelines',
  //     'v3/contribute/docs/schemes-guidelines',
  //   ],
  // },
  // {
  //   'type': 'category',
  //   'label': 'Tutorials',
  //   'items': [
  //     'v3/contribute/tutorials/guidelines',
  //     'v3/contribute/tutorials/principles-of-a-good-tutorial',
  //     'v3/contribute/tutorials/sample-tutorial',
  //   ],
  // },
  {
    type: 'category',
    label: 'Localization program',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'v3/contribute/localization-program/overview',
      },
      {
        type: 'doc',
        label: 'How it works',
        id: 'v3/contribute/localization-program/how-it-works',
      },
      {
        type: 'doc',
        label: 'How to contribute',
        id: 'v3/contribute/localization-program/how-to-contribute',
      },
      {
        type: 'doc',
        label: 'Translation style guide',
        id: 'v3/contribute/localization-program/translation-style-guide',
      },
    ],
  },
  'v3/contribute/maintainers',
];



================================================
FILE: sidebars/documentation.js
URL: https://github.com/ton-community/ton-docs/blob/main/sidebars/documentation.js
================================================
/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/documentation/ton-documentation',
  'v3/documentation/faq',
  {
    type: 'category',
    label: 'Smart contracts',
    items: [
      'v3/documentation/smart-contracts/overview',
      'v3/documentation/smart-contracts/addresses',
      {
        type: 'category',
        label: 'Getting started',
        items: [
          'v3/documentation/smart-contracts/getting-started/javascript',
          'v3/documentation/smart-contracts/getting-started/ide-plugins',
          'v3/documentation/smart-contracts/getting-started/testnet',
        ],
      },
      {
        type: 'category',
        label: 'Contracts specification',
        items: [
          'v3/documentation/smart-contracts/contracts-specs/wallet-contracts',
          'v3/documentation/smart-contracts/contracts-specs/highload-wallet',
          'v3/documentation/smart-contracts/contracts-specs/vesting-contract',
          'v3/documentation/smart-contracts/contracts-specs/governance',
          'v3/documentation/smart-contracts/contracts-specs/nominator-pool',
          'v3/documentation/smart-contracts/contracts-specs/single-nominator-pool',
          'v3/documentation/smart-contracts/contracts-specs/precompiled-contracts',
          'v3/documentation/smart-contracts/contracts-specs/examples',

          {
            type: 'link',
            label: 'TON enhancement proposals (TEPs)',
            href: 'https://github.com/ton-blockchain/TEPs/tree/master',
          },

        ],
      },
      'v3/documentation/smart-contracts/limits',
      {
        type: 'category',
        label: 'Message management',
        items: [
          'v3/documentation/smart-contracts/message-management/messages-and-transactions',
          'v3/documentation/smart-contracts/message-management/sending-messages',
          'v3/documentation/smart-contracts/message-management/internal-messages',
          'v3/documentation/smart-contracts/message-management/external-messages',
          'v3/documentation/smart-contracts/message-management/non-bounceable-messages',
          'v3/documentation/smart-contracts/message-management/message-modes-cookbook',
          'v3/documentation/smart-contracts/message-management/ecosystem-messages-layout',
        ],
      },
      {
        type: 'category',
        label: 'Transaction fees',
        items: [
          'v3/documentation/smart-contracts/transaction-fees/fees',
          'v3/documentation/smart-contracts/transaction-fees/fees-low-level',
          'v3/documentation/smart-contracts/transaction-fees/accept-message-effects',
          'v3/documentation/smart-contracts/transaction-fees/forward-fees',
        ],
      },
      {
        type: 'category',
        label: 'Sharding',
        items: [
          'v3/documentation/smart-contracts/shards/shards-intro',
          'v3/documentation/smart-contracts/shards/infinity-sharding-paradigm',
        ],
      },
      'v3/documentation/smart-contracts/tact',
      {
        type: 'category',
        label: 'Tolk language',
        items: [
          'v3/documentation/smart-contracts/tolk/overview',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/pack-to-from-cells',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/create-message',
          'v3/documentation/smart-contracts/tolk/changelog',
        ],
      },
      {
        type: 'category',
        label: 'FunC language',
        items: [
          {
            type: 'doc',
            id: 'v3/documentation/smart-contracts/func/overview',
          },
          {
            type: 'doc',
            id: 'v3/documentation/smart-contracts/func/cookbook',
          },
          {
            type: 'category',
            label: 'Documentation',
            items: [
              'v3/documentation/smart-contracts/func/docs/types',
              'v3/documentation/smart-contracts/func/docs/comments',
              'v3/documentation/smart-contracts/func/docs/literals_identifiers',
              'v3/documentation/smart-contracts/func/docs/functions',
              'v3/documentation/smart-contracts/func/docs/global_variables',
              'v3/documentation/smart-contracts/func/docs/compiler_directives',
              'v3/documentation/smart-contracts/func/docs/statements',
              'v3/documentation/smart-contracts/func/docs/builtins',
              'v3/documentation/smart-contracts/func/docs/dictionaries',
              'v3/documentation/smart-contracts/func/docs/stdlib',
            ],
          },
          'v3/documentation/smart-contracts/func/libraries',
          'v3/documentation/smart-contracts/func/changelog',
        ],
      },
      {
        type: 'category',
        label: 'Fift language',
        items: [
          'v3/documentation/smart-contracts/fift/overview',
          'v3/documentation/smart-contracts/fift/fift-and-tvm-assembly',
          'v3/documentation/smart-contracts/fift/fift-deep-dive',
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'DApps',
    items: [
      'v3/documentation/dapps/dapps-overview',
      {
        type: 'category',
        label: 'DeFi principles',
        items: [
          'v3/documentation/dapps/defi/coins',
          'v3/documentation/dapps/defi/tokens',
          {
            type: 'doc',
            label: 'NFT use cases in TON',
            id: 'v3/documentation/dapps/defi/nft',
          },
          'v3/documentation/dapps/defi/subscriptions',
          'v3/documentation/dapps/defi/ton-payments',
        ],
      },
      {
        type: 'category',
        label: 'Assets',
        items: [
          'v3/documentation/dapps/assets/overview',
          'v3/documentation/dapps/assets/usdt',
        ],
      },
      {
        type: 'category',
        label: 'Oracles',
        items: [
          'v3/documentation/dapps/oracles/about_blockchain_oracles',
          {
            type: 'category',
            label: 'Oracles in TON',
            items: [
              'v3/documentation/dapps/oracles/pyth',
              'v3/documentation/dapps/oracles/red_stone',
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'Infrastructure',
    items: [
      {
        type: 'category',
        label: 'Blockchain nodes',
        items: [
          'v3/documentation/infra/nodes/node-types',
          {
            type: 'category',
            label: 'MyTonCtrl',
            items: [
              'v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview',
              'v3/documentation/infra/nodes/mytonctrl/mytonctrl-status',
              'v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors',
            ],
          },
          'v3/documentation/infra/nodes/node-commands',
          {
            type: 'category',
            label: 'Validation',
            items: [
              {
                type: 'doc',
                label: 'Proof-of-stake',
                id: 'v3/documentation/infra/nodes/validation/staking-incentives',
              },
              'v3/documentation/infra/nodes/validation/collators',
            ],
          },
        ],
      },
      'v3/documentation/infra/minter-flow',
      {
        type: 'category',
        label: 'Cross-chain bridges',
        items: [
          {
            type: 'doc',
            label: 'Overview',
            id: 'v3/documentation/infra/crosschain/overview',
          },
          {
            type: 'doc',
            label: 'Bridges addresses',
            id: 'v3/documentation/infra/crosschain/bridge-addresses',
          },
        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'Network protocols',
    items: [
      {
        type: 'category',
        label: 'Network configurations',
        items: [
          'v3/documentation/network/configs/network-configs',
          'v3/documentation/network/configs/blockchain-configs',
          'v3/documentation/network/configs/config-params',
        ],
      },
      {
        type: 'category',
        label: 'Network protocols',
        items: [
          {
            type: 'category',
            label: 'ADNL',
            items: [
              {
                type: 'doc',
                label: 'Overview',
                id: 'v3/documentation/network/protocols/adnl/overview',
              },
              'v3/documentation/network/protocols/adnl/low-level-adnl', // TODO: MERGE ADNL
              'v3/documentation/network/protocols/adnl/adnl-tcp',
              'v3/documentation/network/protocols/adnl/adnl-udp',
            ],
          },
          {
            type: 'category',
            label: 'DHT',
            items: [
              {
                type: 'doc',
                label: 'Overview',
                id: 'v3/documentation/network/protocols/dht/ton-dht',
              },
              'v3/documentation/network/protocols/dht/dht-deep-dive',
            ]
          },
          'v3/documentation/network/protocols/rldp',
          'v3/documentation/network/protocols/overlay',
        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'Data formats',
    items: [
      {
        type: 'category',
        label: 'TL-B',
        items: [
          'v3/documentation/data-formats/tlb/tl-b-language',
          'v3/documentation/data-formats/tlb/cell-boc',
          'v3/documentation/data-formats/tlb/exotic-cells',
          'v3/documentation/data-formats/tlb/library-cells',
          'v3/documentation/data-formats/tlb/proofs',
          'v3/documentation/data-formats/tlb/tl-b-types',
          'v3/documentation/data-formats/tlb/canonical-cell-serialization',
          'v3/documentation/data-formats/tlb/msg-tlb',
          'v3/documentation/data-formats/tlb/block-layout',
          'v3/documentation/data-formats/tlb/transaction-layout',
          'v3/documentation/data-formats/tlb/crc32',
          'v3/documentation/data-formats/tlb/tlb-ide',
          'v3/documentation/data-formats/tlb/tlb-tools',
        ],
      },
      'v3/documentation/data-formats/tl',
    ],
  },
  {
    type: 'category',
    label: 'TON Virtual Machine (TVM)',
    items: [
      'v3/documentation/tvm/tvm-overview',
      'v3/documentation/tvm/tvm-initialization',
      'v3/documentation/tvm/tvm-exit-codes',
      {
        type: 'link',
        label: 'TVM instructions',
        href: '/v3/documentation/tvm/instructions',
      },
      {
        type: 'category',
        label: 'TVM specification',
        items: [
          'v3/documentation/tvm/specification/runvm',
        ],
      },
      {
        type: 'category',
        label: 'TVM changelog',
        items: [
          'v3/documentation/tvm/changelog/tvm-upgrade-2025-02',
          'v3/documentation/tvm/changelog/tvm-upgrade-2024-04',
          'v3/documentation/tvm/changelog/tvm-upgrade-2023-07',

        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'TON whitepapers',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'v3/documentation/whitepapers/overview',
      },
      {
        type: 'link',
        label: 'TON',
        href: 'https://docs.ton.org/ton.pdf',
      },
      {
        type: 'link',
        label: 'TON Virtual Machine',
        href: 'https://docs.ton.org/tvm.pdf',
      },
      {
        type: 'link',
        label: 'TON Blockchain',
        href: 'https://docs.ton.org/tblkch.pdf',
      },
      {
        type: 'link',
        label: 'Catchain consensus protocol',
        href: 'https://docs.ton.org/catchain.pdf',
      },
    ],
  },

];



================================================
FILE: sidebars/guidelines.js
URL: https://github.com/ton-community/ton-docs/blob/main/sidebars/guidelines.js
================================================
/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  {
    type: 'category',
    label: `Quick start`,
    items: [
      'v3/guidelines/quick-start/getting-started',
      {
        type: 'category',
        label: 'Blockchain interaction',
        items: [
          'v3/guidelines/quick-start/blockchain-interaction/reading-from-network',
          'v3/guidelines/quick-start/blockchain-interaction/writing-to-network',
        ],
      },
      {
        type: 'category',
        label: 'Developing smart contracts',
        items: [
          'v3/guidelines/quick-start/developing-smart-contracts/setup-environment',

          {
            type: 'category',
            label: 'FunC & Tolk implementation',

            items: [
              'v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview',
              'v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/storage-and-get-methods',
              'v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages',
              'v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network',
            ],
          },


          {
            type: 'category',
            label: 'Tact implementation',
            items: [
              'v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview',
              'v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-storage-and-get-methods',
              'v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network',
            ],
          }
        ],
      }
    ]
  },
  'v3/guidelines/get-started-with-ton',
  {
    type: 'category',
    label: 'TON Hello World series',
    link: {
      type: 'generated-index',
      title: 'TON Hello World series',
      slug: '/guidelines/hello-world',
      keywords: ['HelloWorld'],
    },
    items: [
      {
        type: 'link',
        label: 'Working with your wallet',
        href: 'https://helloworld.tonstudio.io/01-wallet',
      },
      {
        type: 'link',
        label: 'Writing first smart contract',
        href: 'https://helloworld.tonstudio.io/02-contract',
      },
      {
        type: 'link',
        label: 'Building first web client',
        href: 'https://helloworld.tonstudio.io/03-client',
      },
      {
        type: 'link',
        label: 'Testing your smart contract',
        href: 'https://helloworld.tonstudio.io/04-testing',
      },
    ],
  },
  {
    type: 'category',
    label: 'Smart contracts guidelines',
    link: {
      type: 'generated-index',
      title: 'Smart contracts guidelines',
      slug: '/guidelines/smat-contracts-guidelines',
      keywords: ['smart contracts guidelines'],
    },
    items: [
      'v3/guidelines/smart-contracts/guidelines',
      'v3/guidelines/smart-contracts/get-methods',
      {
        type: 'doc',
        label: 'Transaction fees calculation',
        id: 'v3/guidelines/smart-contracts/fee-calculation',
      },
      {
        type: 'category',
        label: 'Testing',
        link: {
          type: 'generated-index',
          title: 'Testing',
          slug: '/guidelines/testing',
          keywords: ['testing'],
        },
        items: [
          'v3/guidelines/smart-contracts/testing/overview',
          'v3/guidelines/smart-contracts/testing/writing-test-examples',
        ],
      },
      {
        type: 'category',
        label: 'Security measures',
        link: {
          type: 'generated-index',
          title: 'Security measures',
          slug: '/guidelines/security-measures',
          keywords: ['security'],
        },
        items: [
          'v3/guidelines/smart-contracts/security/overview',
          'v3/guidelines/smart-contracts/security/secure-programming',
          'v3/guidelines/smart-contracts/security/things-to-focus',
          'v3/guidelines/smart-contracts/security/ton-hack-challenge-1',
          'v3/guidelines/smart-contracts/security/random-number-generation',
          'v3/guidelines/smart-contracts/security/random',
        ],
      },
      {
        type: 'category',
        label: 'How to',
        link: {
          type: 'generated-index',
          title: 'How to',
          slug: '/guidelines/how-to',
          keywords: ['how to'],
        },
        items: [
          {
            type: 'category',
            label: 'Compile from sources',
            link: {
              type: 'generated-index',
              title: 'Compile from sources',
              slug: '/guidelines/compile-from-sources',
              keywords: ['compile'],
            },
            items: [
              {
                type: 'doc',
                label: 'Compilation instructions',
                id: 'v3/guidelines/smart-contracts/howto/compile/compilation-instructions',
              },
              {
                type: 'doc',
                label: 'Instructions for low-memory machines',
                id: 'v3/guidelines/smart-contracts/howto/compile/instructions-low-memory',
              },
            ],
          },
          'v3/guidelines/smart-contracts/howto/multisig',
          'v3/guidelines/smart-contracts/howto/multisig-js',
          'v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice',
          'v3/guidelines/smart-contracts/howto/shard-optimization',
          'v3/guidelines/smart-contracts/howto/wallet',
          'v3/guidelines/smart-contracts/howto/nominator-pool',
          'v3/guidelines/smart-contracts/howto/single-nominator-pool',
          {
            type: 'link',
            label: 'How to shard your TON smart contract and why',
            href: 'https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons',
          },
        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'DApps guidelines',
    link: {
      type: 'generated-index',
      title: 'DApps guidelines',
      slug: '/guidelines/dapps',
      keywords: ['dapps'],
    },
    items: [
      'v3/guidelines/dapps/overview',
      'v3/guidelines/dapps/cookbook',
      {
        type: 'category',
        label: 'APIs and SDKs',
        link: {
          type: 'generated-index',
          title: 'APIs and SDKs',
          slug: '/guidelines/api-sdk',
          keywords: ['api', 'sdk'],
        },
        items: [
          'v3/guidelines/dapps/apis-sdks/overview',
          'v3/guidelines/dapps/apis-sdks/sdk',
          'v3/guidelines/dapps/apis-sdks/api-types',
          'v3/guidelines/dapps/apis-sdks/ton-http-apis',
          'v3/guidelines/dapps/apis-sdks/ton-adnl-apis',
        ],
      },
      {
        type: 'category',
        label: 'Tutorials & examples',
        link: {
          type: 'generated-index',
          title: 'Tutorials & examples',
          slug: '/guidelines/tutorials-and-examples',
          keywords: ['tutorials', 'examples'],
        },
        items: [
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/jetton-airdrop',
            label: 'How to launch a jetton airdrop',
          },
          'v3/guidelines/dapps/apis-sdks/api-keys',
          'v3/guidelines/dapps/apis-sdks/getblock-ton-api',
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/nft-minting-guide',
            label: 'NFT minting guide',
          },
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/mint-your-first-token',
            label: 'Mint your first token',
          },
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/zero-knowledge-proofs',
            label: 'Zero-Knowledge proofs',
          },
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/web3-game-example',
            label: 'Web3 game example',
          },
          {
            type: 'category',
            label: 'Telegram bot examples',
            link: {
              type: 'generated-index',
              title: 'Telegram bot examples',
              slug: '/guidelines/tg-bot-examples',
              keywords: ['bots', 'examples'],
            },
            items: [
              'v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot',
              'v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2',
              'v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js',

              {
                type: 'link',
                label: 'TMA USD₮ payments demo',
                href: 'https://github.com/ton-community/tma-usdt-payments-demo',
              },

            ],
          },
        ],
      },
      {
        type: 'category',
        label: 'Telegram Mini Apps',
        link: {
          type: 'generated-index',
          title: 'Telegram Mini Apps',
          slug: '/guidelines/tma',
          keywords: ['tma', 'mini apps'],
        },
        items: [
          'v3/guidelines/dapps/tma/overview',
          {
            type: 'category',
            label: 'Guidelines',
            link: {
              type: 'generated-index',
              title: 'TMA guidelines',
              slug: '/guidelines/tma-guidelines',
              keywords: ['tma'],
            },
            items: [
              'v3/guidelines/dapps/tma/guidelines/testing-apps',
              'v3/guidelines/dapps/tma/guidelines/publishing',
              'v3/guidelines/dapps/tma/guidelines/monetization',
              'v3/guidelines/dapps/tma/guidelines/tips-and-tricks',
            ],
          },
          {
            type: 'category',
            label: 'Tutorials & examples',
            link: {
              type: 'generated-index',
              title: 'TMA tutorials & examples',
              slug: '/guidelines/tma-tutorials-and-examples',
              keywords: ['tma', 'tutorials', 'examples'],
            },
            items: [
              'v3/guidelines/dapps/tma/tutorials/step-by-step-guide',
              'v3/guidelines/dapps/tma/tutorials/app-examples',
              'v3/guidelines/dapps/tma/tutorials/design-guidelines',
            ],
          },
          'v3/guidelines/dapps/tma/notcoin',
          'v3/guidelines/dapps/tma/grants',
        ],
      },
      {
        type: 'category',
        label: 'Advanced asset processing',
        link: {
          type: 'generated-index',
          title: 'Advanced asset processing',
          slug: '/guidelines/advanced-asset-processing',
          keywords: ['assets'],
        },
        items: [
          'v3/guidelines/dapps/asset-processing/payments-processing',
          'v3/guidelines/dapps/asset-processing/jettons',
          'v3/guidelines/dapps/asset-processing/mintless-jettons',
          'v3/guidelines/dapps/asset-processing/compressed-nfts',
          'v3/guidelines/dapps/asset-processing/mass-mint-tools',
          {
            type: 'category',
            label: 'NFT processing',
            link: {
              type: 'generated-index',
              title: 'NFT processing',
              slug: '/guidelines/nft-processing',
              keywords: ['nft'],
            },
            items: [
              'v3/guidelines/dapps/asset-processing/nft-processing/nfts',
              'v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing',
            ],
          },
        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'Blockchain nodes guidelines',
    link: {
      type: 'generated-index',
      title: 'Blockchain nodes guidelines',
      slug: '/guidelines/nodes-guidelines',
      keywords: ['nodes'],
    },
    items: [
      'v3/guidelines/nodes/overview',
      {
        type: 'category',
        label: 'Running nodes',
        link: {
          type: 'generated-index',
          title: 'Running nodes',
          slug: '/guidelines/running-nodes',
          keywords: ['running nodes'],
        },
        items: [
          'v3/guidelines/nodes/running-nodes/archive-node',
          'v3/guidelines/nodes/running-nodes/full-node',
          'v3/guidelines/nodes/running-nodes/liteserver-node',
          'v3/guidelines/nodes/running-nodes/validator-node',
          'v3/guidelines/nodes/running-nodes/staking-with-nominator-pools',
          'v3/guidelines/nodes/running-nodes/run-mytonctrl-docker',
          'v3/guidelines/nodes/running-nodes/running-a-local-ton',
          'v3/guidelines/nodes/running-nodes/secure-guidelines',
        ],
      },
      {
        type: 'category',
        label: 'Maintenance guidelines',
        link: {
          type: 'generated-index',
          title: 'Maintenance guidelines',
          slug: '/guidelines/maintenance-guidelines',
          keywords: ['maintenance'],
        },
        items: [
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-backup-restore',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-validator-standby',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-private-alerting',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-prometheus',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-remote-controller'
        ],
      },
      'v3/guidelines/nodes/custom-overlays',
      'v3/guidelines/nodes/nodes-troubleshooting',
      'v3/guidelines/nodes/node-maintenance-and-security',
      'v3/guidelines/nodes/monitoring/performance-monitoring',
      'v3/guidelines/nodes/persistent-states',
      'v3/guidelines/nodes/faq',
    ]
  },
  {
    label: 'Integrate with TON',
    type: 'category',
    link: {
      type: 'generated-index',
      title: 'Integrate with TON',
      slug: '/guidelines/integrate-with-ton',
    },

    items: [
      'v3/guidelines/ton-connect/overview',
      {
        type: 'category',
        label: 'Integrate a dApp',
        link: {
          type: 'generated-index',
          title: 'Integrate a dApp',
          slug: '/guidelines/integrate-dapp',
          keywords: ['dapp'],
        },
        items: [
          'v3/guidelines/ton-connect/guidelines/how-ton-connect-works',
          'v3/guidelines/ton-connect/guidelines/creating-manifest',
          {
            type: 'category',
            label: 'Install TON Connect',
            link: {
              type: 'generated-index',
              title: 'Install TON Connect',
              slug: '/guidelines/install-ton-connect',
              keywords: ['TON Connect'],
            },
            items: [
              {
                type: 'doc',
                id: 'v3/guidelines/ton-connect/frameworks/react',
                label: 'React apps',
              },
              {
                type: 'doc',
                id: 'v3/guidelines/ton-connect/frameworks/vue',
                label: 'Vue apps',
              },
              {
                type: 'doc',
                id: 'v3/guidelines/ton-connect/frameworks/web',
                label: 'HTML/JS apps',
              },
            ],
          },
          'v3/guidelines/ton-connect/guidelines/preparing-messages',
          'v3/guidelines/ton-connect/guidelines/sending-messages',
          'v3/guidelines/ton-connect/guidelines/verifying-signed-in-users',
        ],
      },
      {
        type: 'doc',
        label: 'Integrate a wallet',
        id: 'v3/guidelines/ton-connect/wallet',
      },
      'v3/guidelines/ton-connect/guidelines/developers',
      {
        type: 'category',
        label: 'Advanced',
        link: {
          type: 'generated-index',
          title: 'Advanced',
          slug: '/guidelines/advanced',
        },
        items: [
          {
            type: 'link',
            label: 'Protocol specification',
            href: 'https://github.com/ton-blockchain/ton-connect',
          },
          {
            type: 'link',
            label: 'Wallets list',
            href: 'https://github.com/ton-blockchain/wallets-list',
          },
        ],
      },
      {
        type: 'category',
        label: 'Business',
        link: {
          type: 'generated-index',
          title: 'Business',
          slug: '/guidelines/business',
          keywords: ['business'],
        },
        items: [
          'v3/guidelines/ton-connect/business/ton-connect-for-business',
          'v3/guidelines/ton-connect/business/ton-connect-for-security'
        ],
      }
    ],

  },
  {
    type: 'category',
    label: 'Web3 guidelines',
    link: {
      type: 'generated-index',
      title: 'Web3 guidelines',
      slug: '/guidelines/web3-guidelines',
      keywords: ['web3'],
    },
    items: [
      'v3/guidelines/web3/overview',
      {
        type: 'category',
        label: 'TON DNS',
        link: {
          type: 'generated-index',
          title: 'TON DNS',
          slug: '/guidelines/ton-dns',
          keywords: ['dns'],
        },
        items: [
          'v3/guidelines/web3/ton-dns/dns',
          'v3/guidelines/web3/ton-dns/subresolvers',
        ],
      },
      {
        type: 'category',
        label: 'Proxy & sites',
        link: {
          type: 'generated-index',
          title: 'Proxy & sites',
          slug: '/guidelines/proxy-and-sites',
          keywords: ['proxy-and-sites'],
        },
        items: [
          'v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site',
          'v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications',
          'v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy',
          'v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site',
          'v3/guidelines/web3/ton-proxy-sites/site-and-domain-management',
          'v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy',
        ],
      },
      {
        type: 'category',
        label: 'TON Storage',
        link: {
          type: 'generated-index',
          title: 'TON Storage',
          slug: '/guidelines/ton-storage',
          keywords: ['storage'],
        },
        items: [
          'v3/guidelines/web3/ton-storage/storage-daemon',
          'v3/guidelines/web3/ton-storage/storage-provider',
          'v3/guidelines/web3/ton-storage/storage-faq',
        ],
      },
    ]
  },
];



================================================
FILE: src/assets/icons/coinmarketcap.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/coinmarketcap.svg
================================================
[Binary file blocked: coinmarketcap.svg]


================================================
FILE: src/assets/icons/dislike-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/dislike-dark.svg
================================================
[Binary file blocked: dislike-dark.svg]


================================================
FILE: src/assets/icons/dislike-light.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/dislike-light.svg
================================================
[Binary file blocked: dislike-light.svg]


================================================
FILE: src/assets/icons/github.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/github.svg
================================================
[Binary file blocked: github.svg]


================================================
FILE: src/assets/icons/index.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/index.ts
================================================
import IconLogo from "./logo.svg";
import IconLogoSmall from "./logo_small.svg";
import Icon24MailCircle from "./mail.svg";
import Icon24GithubCircle from "./github.svg";
import Icon24LinkedInCircle from "./linked_in.svg";
import Icon24TelegramCircle from "./telegram_circle.svg";
import Icon24TwitterCircle from "./twitter.svg";
import Icon24CoinMakertCap from "./coinmarketcap.svg";
import IconLikeLight from "./like-light.svg";
import IconDislikeLight from "./dislike-light.svg";
import IconLikeDark from "./like-dark.svg";
import IconDislikeDark from "./dislike-dark.svg";

export {
  IconLogo,
  IconLogoSmall,
  Icon24MailCircle,
  Icon24GithubCircle,
  Icon24LinkedInCircle,
  Icon24TelegramCircle,
  Icon24TwitterCircle,
  Icon24CoinMakertCap,
  IconLikeLight,
  IconDislikeLight,
  IconLikeDark,
  IconDislikeDark,
};



================================================
FILE: src/assets/icons/like-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/like-dark.svg
================================================
[Binary file blocked: like-dark.svg]


================================================
FILE: src/assets/icons/like-light.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/like-light.svg
================================================
[Binary file blocked: like-light.svg]


================================================
FILE: src/assets/icons/linked_in.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/linked_in.svg
================================================
[Binary file blocked: linked_in.svg]


================================================
FILE: src/assets/icons/logo.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/logo.svg
================================================
[Binary file blocked: logo.svg]


================================================
FILE: src/assets/icons/logo_small.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/logo_small.svg
================================================
[Binary file blocked: logo_small.svg]


================================================
FILE: src/assets/icons/mail.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/mail.svg
================================================
[Binary file blocked: mail.svg]


================================================
FILE: src/assets/icons/telegram_circle.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/telegram_circle.svg
================================================
[Binary file blocked: telegram_circle.svg]


================================================
FILE: src/assets/icons/twitter.svg
URL: https://github.com/ton-community/ton-docs/blob/main/src/assets/icons/twitter.svg
================================================
[Binary file blocked: twitter.svg]


================================================
FILE: src/components/Feedback/Button.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Feedback/Button.module.css
================================================
.container {
  position: relative;
  display: inline-block;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  border-radius: 40px;
  border: 0px;
  gap: 6px;
  background: rgba(118, 152, 187, 0.09);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
}

[data-theme=dark] .button {
  background: rgba(255, 255, 255, 0.09);
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button:hover:not(:disabled) {
  background: rgba(118, 152, 187, 0.16);
  cursor: pointer;
}

[data-theme=dark] .button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
  cursor: pointer;
}



================================================
FILE: src/components/Feedback/Button.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Feedback/Button.tsx
================================================
import React from "react";
import { useLocation } from "@docusaurus/router";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "./Button.module.css";
import { Tooltip } from "react-tooltip";

type Event = "like" | "dislike";

type Props = {
  children?: React.ReactNode;
  event: Event;
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const tooltipFadeoutTimeMs = 3500;

function Button({ children, event, isDisabled, setIsDisabled }: Props) {
  const location = useLocation();
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClick = () => {
    setIsOpen(true);
    setIsDisabled(true);
    const eventType = `docs-${event}`;
    if (window.gtag) {
      window.gtag("event", eventType, {
        event_category: "Feedback",
        event_label: location.pathname,
      });
    }
    const key = `user-feedback:${location.pathname}`;
    localStorage.setItem(key, "true");
    setTimeout(() => setIsOpen(false), tooltipFadeoutTimeMs);
  };

  return (
    <>
      <button
        data-tooltip-id={`btn-${event}`}
        aria-label={`page-${event}-button`}
        className={`${styles.button} ${isDisabled && styles.disabled}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {children}
      </button>
      <Tooltip
        id={`btn-${event}`}
        // this component doesn"t allow to set styles via className 
        style={{
          width: "200px",
          height: "80px",
          padding: "12px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "500",
          lineHeight: "18px",
          backgroundColor: colorMode === "dark" && "#232328",
          color: colorMode === "dark" && "#FFF",
        }}
        border="1px solid rgba(118, 152, 187, 0.35)"
        openOnClick={true}
        isOpen={isOpen}
        variant="light"
        content="Thank you! Your answer helps us make the docs better."
      />
    </>
  );
}

export default Button;


================================================
FILE: src/components/Feedback/index.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Feedback/index.module.css
================================================
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 24px;
  gap: 16px;
  border-radius: 10px;
  background-color: var(--background-content-light);
}

.text {
  color: #04060B;
}

[data-theme=dark] .text {
  color: #F3F3F6;
}

[data-theme=dark] .container {
  background-color: var(--background-content-dark);
}

.label {
  text-align: center;
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}

@media (min-width: 600px) {
  .container {
    flex-direction: row;
    justify-content: flex-start;
    padding: 16px 27px;
  }
}

.buttons{
  display: flex;
  flex-direction: row;
  gap: 6px;
}



================================================
FILE: src/components/Feedback/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Feedback/index.tsx
================================================
import React from "react";
import { useLocation } from "@docusaurus/router";
import { useColorMode } from "@docusaurus/theme-common";
import { IconLikeLight, IconLikeDark, IconDislikeLight, IconDislikeDark } from "../../assets/icons";
import styles from "./index.module.css";
import Button from "./Button";

function Feedback() {
  const location = useLocation();
  const [isFeedbackDisabled, setIsFeedbackDisabled] = React.useState(false);
  const { colorMode } = useColorMode();
  const opacity = isFeedbackDisabled ? 0.56 : 1.0;

  React.useEffect(() => {
    const key = `user-feedback:${location.pathname}`;
    const alreadyClicked = localStorage.getItem(key);
    if (alreadyClicked === "true") {
      setIsFeedbackDisabled(true);
    }
  }, [setIsFeedbackDisabled, location.pathname])

  return (
    <div className={styles.container}>
      <span className={styles.label}>Was this article useful?</span>
      <div className={styles.buttons}>
        <Button event="like" isDisabled={isFeedbackDisabled} setIsDisabled={setIsFeedbackDisabled}>
          {colorMode === "light" ?
            <IconLikeLight style={{ opacity }} /> :
            <IconLikeDark style={{ opacity }} />}
          <span className={styles.text}>Yes</span>
        </Button>
        <Button event="dislike" isDisabled={isFeedbackDisabled} setIsDisabled={setIsFeedbackDisabled}>
          {colorMode === "light" ?
            <IconDislikeLight style={{ opacity }} /> :
            <IconDislikeDark style={{ opacity }} />}
          <span className={styles.text}>No</span>
        </Button>
      </div>
    </div>
  );
}

export default Feedback;


================================================
FILE: src/components/Instructions/DisplayableInstruction.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/DisplayableInstruction.ts
================================================
export interface DisplayableInstruction {
  opcode?: string;
  fift?: string;
  stack?: string;
  description?: string;
  gas?: string;
}



================================================
FILE: src/components/Instructions/InstructionGroups.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/InstructionGroups.tsx
================================================
import React, { useMemo } from 'react';
import { Alias, Instruction } from './types';
import { InstructionTable } from './InstructionTable';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

type InstructionGroupsProps = {
  instructions: Instruction[];
  aliases?: Alias[];
  search?: string;
}

const sections = [
  { label: 'Overview', types: null, value: 'all' },
  { label: 'Stack Manipulation', types: ['stack_basic', 'stack_complex'], value: 'stack' },
  { label: 'Tuple, List and Null', types: ['tuple'], value: 'tuple' },
  { label: 'Constants and Literals', types: ['const_int', 'const_data'], value: 'const' },
  {
    label: 'Arithmetic Operations',
    types: ['arithm_basic', 'arithm_div', 'arithm_logical', 'arithm_quiet'],
    value: 'arithm',
  },
  { label: 'Data Comparison', types: ['compare_int', 'compare_other'], value: 'compare' },
  { label: 'Cell Manipulation', types: ['cell_build', 'cell_parse'], value: 'cell' },
  {
    label: 'Continuation and Control Flow',
    types: ['cont_basic', 'cont_conditional', 'cont_create', 'cont_dict', 'cont_loops', 'cont_registers', 'cont_stack'],
    value: 'cont',
  },
  { label: 'Exception Generation and Handling', types: ['exceptions'], value: 'exception' },
  {
    label: 'Dictionary Manipulation',
    types: ['dict_create', 'dict_serial', 'dict_get', 'dict_set', 'dict_set_builder', 'dict_delete', 'dict_mayberef', 'dict_prefix', 'dict_next', 'dict_min', 'dict_special', 'dict_sub'],
    value: 'dict',
  },
  {
    label: 'Application-specific Primitives',
    types: ['app_gas', 'app_rnd', 'app_config', 'app_global', 'app_crypto', 'app_misc', 'app_currency', 'app_addr', 'app_actions'],
    value: 'app',
  },
  { label: 'Miscellaneous', types: ['debug', 'codepage'], value: 'miscellaneous' },
  { label: 'Aliases', types: null, value: 'alias' },
];

export const InstructionGroups = React.memo(({ instructions, aliases, search }: InstructionGroupsProps) => {
  const aliasesWithInstructions = useMemo(() => {
    const instructionsByMnemonic = instructions.reduce((acc, instruction) => {
      acc[instruction.mnemonic] = instruction;
      return acc;
    }, {});
    return aliases.map((alias) => ({ ...alias, instruction: instructionsByMnemonic[alias.alias_of] }));
  }, [instructions, aliases]);

  const searchValue = search.toLowerCase();

  const filteredInstructions = useMemo(() => instructions.filter(
    (item) =>
      item.doc?.opcode?.toLowerCase()?.includes(searchValue) ||
      item.doc?.fift?.toLowerCase()?.includes(searchValue) ||
      item?.doc?.description?.toLowerCase()?.includes(searchValue),
  ), [instructions, searchValue]);

  const filteredAliases = useMemo(() => aliasesWithInstructions.filter(
    (item) =>
      item.mnemonic?.toLowerCase()?.includes(searchValue) ||
      item.description?.toLowerCase()?.includes(searchValue) ||
      item.doc_fift?.toLowerCase()?.includes(searchValue),
  ), [aliasesWithInstructions, searchValue]);

  const activeTab = useMemo(() => {
    if (filteredAliases.length > 0 && filteredInstructions.length === 0) {
      return 'alias';
    }
    return 'all';
  }, [filteredAliases, filteredInstructions]);

  return (
    <Tabs key={activeTab} defaultValue={activeTab}>
      {sections.map(({ label, types, value }) => {
        if (value === 'alias') {
          if (!filteredAliases.length) return null;
          return (
            <TabItem label={label} value={value} key={value}>
              <InstructionTable
                instructions={filteredAliases.map((alias) => ({
                  opcode: alias.instruction?.doc.opcode,
                  fift: alias.doc_fift,
                  gas: alias.instruction?.doc.gas,
                  description: alias.description,
                  stack: alias.doc_stack,
                }))}
              />
            </TabItem>
          );
        }

        const tabInstructions = types
          ? filteredInstructions.filter((inst) => types.includes(inst.doc.category))
          : filteredInstructions;

        if (!tabInstructions.length) return null;
        return (
          <TabItem label={label} value={value} key={value}>
            <InstructionTable
              instructions={tabInstructions.map((inst) => ({
                opcode: inst.doc.opcode,
                fift: inst.doc.fift,
                gas: inst.doc.gas,
                description: inst.doc.description,
                stack: inst.doc.stack,
              }))}
            />
          </TabItem>
        );
      })}
    </Tabs>
  );
});



================================================
FILE: src/components/Instructions/InstructionHead.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/InstructionHead.tsx
================================================
import React from 'react';

export function InstructionHead() {
  return (
    <tr>
      <th>Opcode</th>
      <th>Fift syntax</th>
      <th>Stack</th>
      <th>Description</th>
      <th>Gas</th>
    </tr>
  );
}



================================================
FILE: src/components/Instructions/InstructionRow.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/InstructionRow.module.css
================================================
.anchorWithStickyNavbar {
  scroll-margin-top: calc(var(--ifm-navbar-height) + 0.5rem);
}

.anchorWithStickyNavbar:target {
  background-color: rgba(0, 136, 204, 0.15)
}



================================================
FILE: src/components/Instructions/InstructionRow.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/InstructionRow.tsx
================================================
import React from 'react';
import Markdown from 'markdown-to-jsx';
import { DisplayableInstruction } from './DisplayableInstruction';
import styles from './InstructionRow.module.css';

type InstructionRowProps = {
  instruction: DisplayableInstruction;
}

export function InstructionRow({ instruction }: InstructionRowProps) {
  return (
    <tr className={styles.anchorWithStickyNavbar} id={instruction.opcode}>
      <td><code>{instruction.opcode ?? ''}</code></td>
      <td className={styles.anchorWithStickyNavbar} id={instruction.fift}><code>{instruction.fift}</code></td>
      <td><code>{instruction.stack ?? ''}</code></td>
      <td><Markdown>{instruction.description ?? ''}</Markdown></td>
      <td><code>{instruction.gas ?? ''}</code></td>
    </tr>
  );
}



================================================
FILE: src/components/Instructions/InstructionSearch.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/InstructionSearch.module.css
================================================
.searchField {
  outline: none;
  border: none;
  background: var(--gray-9);
  height: 56px;
  width: 100%;
  border-radius: 4px;
  font-size: 1.2em;
  padding: 0 12px;
  margin-bottom: 1rem;
}

[data-theme=dark] .searchField {
  background: var(--gray-1);
}

.searchField:focus {
  background: #FFFFFF;
  box-shadow: inset 0 0 0 2px var(--ifm-color-primary);
}

[data-theme=dark] .searchField:focus {
  background: #000000;
}



================================================
FILE: src/components/Instructions/InstructionSearch.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/InstructionSearch.tsx
================================================
import React, { ChangeEvent, KeyboardEvent, useCallback, useMemo, useState } from 'react';
import { Alias, Instruction } from './types';
import styles from './InstructionSearch.module.css';
import { useDebounce } from '@site/src/hooks';
import { InstructionGroups } from './InstructionGroups';

type InstructionSearchProps = {
  instructions: Instruction[];
  aliases?: Alias[];
}

export function InstructionSearch({ instructions, aliases }: InstructionSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }, []);

  return (
    <div style={{ margin: '0 calc((105% - 100vw)/2)' }}>
      <input
        className={styles.searchField}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        value={inputValue}
        type="text"
        placeholder={'Search'}
      />
      <InstructionGroups instructions={instructions} aliases={aliases ?? []} search={debouncedValue} />
    </div>
  );
}



================================================
FILE: src/components/Instructions/InstructionTable.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/InstructionTable.tsx
================================================
import React from 'react';
import { InstructionHead } from './InstructionHead';
import { InstructionRow } from './InstructionRow';
import { DisplayableInstruction } from './DisplayableInstruction';

type InstructionTableProps = {
  instructions: DisplayableInstruction[];
}

export function InstructionTable({ instructions }: InstructionTableProps) {
  return (
    <table>
      <thead>
        <InstructionHead/>
      </thead>
      <tbody>
        {instructions.map(instruction => <InstructionRow instruction={instruction} key={instruction.opcode + instruction.fift}/>)}
      </tbody>
    </table>
  );
}




================================================
FILE: src/components/Instructions/index.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/index.ts
================================================
export * from './InstructionSearch';



================================================
FILE: src/components/Instructions/types.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/Instructions/types.ts
================================================
/**
 * How instruction is named in [original TVM implementation](https://github.com/ton-blockchain/ton/blob/master/crypto/vm). Not necessarily unique (currently only DEBUG is not unique).
 */
export type InstructionName = string
/**
 * Global version (ConfigParam 8) which enables this instruction. Version 9999 means that instruction has no global version and currently unavailable in mainnet.
 */
export type SinceGlobalVersion = number
/**
 * Free-form bytecode format description.
 */
export type OpcodeFormatDocumentation = string
/**
 * Free-form description of stack inputs and outputs. Usually the form is `[inputs] - [outputs]` where `[inputs]` are consumed stack values and `outputs` are produced stack values (top of stack is the last value).
 */
export type StackUsageDescription = string
export type CategoryOfInstruction = string
/**
 * Free-form markdown description of instruction.
 */
export type InstructionDescription = string
/**
 * Free-form description of gas amount used by instruction.
 */
export type GasUsageInfo = string
/**
 * Free-form fift usage description.
 */
export type FiftUsageDoc = string
export type FiftSnippet = string
export type ExampleDescription = string
/**
 * TL-b bytecode format description.
 */
export type TLBSchema = string
/**
 * Prefix to determine next instruction to parse. It is a hex bitstring as in TL-b (suffixed with `_` if bit length is not divisible by 4, trailing `'1' + '0' * x` must be removed).
 */
export type InstructionPrefix = string
/**
 * Static instruction parameter serialized to bytecode.
 */
export type Operand =
  | {
  name: VariableName
  type: "uint"
  display_hints: DisplayHints
  size: IntegerSizeBits
  max_value: MaximumIntegerValue
  min_value: MinimumIntegerValue
}
  | {
  name: VariableName
  type: "int"
  display_hints: DisplayHints
  size: IntegerSizeBits1
  max_value: MaximumIntegerValue1
  min_value: MinimumIntegerValue1
}
  | {
  name: VariableName
  type: "pushint_long"
}
  | {
  name: VariableName
  type: "ref"
  display_hints: DisplayHints
}
  | {
  name: VariableName
  type: "subslice"
  display_hints: DisplayHints
  bits_length_var_size: SizeOfBitLengthOperand
  bits_padding: ConstantIntegerValueToAddToLengthOfBitstringToLoad
  refs_length_var_size?: SizeOfRefCountOperand
  refs_add?: ConstantIntegerValueToAddToRefCount
  completion_tag: CompletionTagFlag
  max_bits: MaxBitSize
  min_bits: MinBitSize
  max_refs: MaxRefSize
  min_refs: MinRefSize
}
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName = string
/**
 * Hint for converting operands between raw values and Asm.fif display format
 */
export type DisplayHint =
  | {
  type: "continuation"
}
  | {
  type: "dictionary"
  size_var: VariableName
}
  | {
  type: "add"
  value: number
}
  | {
  type: "stack"
}
  | {
  type: "register"
}
  | {
  type: "pushint4"
}
  | {
  type: "optional_nargs"
}
  | {
  type: "plduz"
}
/**
 * Set of hints to convert between Asm.fif representation and raw bytecode
 */
export type DisplayHints = DisplayHint[]
export type IntegerSizeBits = number
export type MaximumIntegerValue = number
export type MinimumIntegerValue = number
export type IntegerSizeBits1 = number
export type MaximumIntegerValue1 = number
export type MinimumIntegerValue1 = number
export type SizeOfBitLengthOperand = number
export type ConstantIntegerValueToAddToLengthOfBitstringToLoad = number
/**
 * Optional, no refs in this operand in case of absence.
 */
export type SizeOfRefCountOperand = number
export type ConstantIntegerValueToAddToRefCount = number
/**
 * Determines completion tag presense: trailing `'1' + '0' * x` in bitstring
 */
export type CompletionTagFlag = boolean
/**
 * Hint for maximum bits available to store for this operand
 */
export type MaxBitSize = number
/**
 * Hint for minimum bits available to store for this operand
 */
export type MinBitSize = number
/**
 * Hint for maximum refs available to store for this operand
 */
export type MaxRefSize = number
/**
 * Hint for minimum refs available to store for this operand
 */
export type MinRefSize = number
/**
 * Describes how to parse operands. Order of objects in this array represents the actual order of operands in instruction.
 */
export type InstructionOperands = Operand[]
/**
 * Representation of stack entry or group of stack entries
 */
export type StackEntry =
  | {
  type: "simple"
  name: VariableName
  value_types?: PossibleValueTypes
}
  | {
  type: "const"
  value_type: ConstantType
  value: ConstantValue
}
  | {
  type: "conditional"
  name: VariableName1
  match: MatchArm[]
  else?: StackValues
}
  | {
  type: "array"
  name: VariableName
  length_var: VariableName2
  array_entry: ArraySingleEntryDefinition
}
export type PossibleValueTypes = (
  | "Integer"
  | "Cell"
  | "Builder"
  | "Slice"
  | "Tuple"
  | "Continuation"
  | "Null"
  )[]
export type ConstantType = "Integer" | "Null"
export type ConstantValue = number | null
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName1 = string
export type ArmValue = number
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName2 = string
/**
 * Array is a structure like `x1 y1 z1 x2 y2 z2 ... x_n y_n z_n n` which contains `n` entries of `x_i y_i z_i`. This property defines the structure of a single entry.
 */
export type ArraySingleEntryDefinition = StackValues
/**
 * Stack constraints. Top of stack is the last value.
 */
export type StackValues = StackEntry[]
/**
 * Represents read/write access to a register
 */
export type Register =
  | {
  type: "constant"
  index: number
}
  | {
  type: "variable"
  var_name: VariableName
}
  | {
  type: "special"
  name: "gas" | "cstate"
}
export type RegisterValues = Register[]
/**
 * Description of a continuation with static savelist
 */
export type Continuation =
  | {
  type: "cc"
  save?: ContinuationSavelist
}
  | {
  type: "variable"
  var_name: VariableName3
  save?: ContinuationSavelist
}
  | {
  type: "register"
  index: RegisterNumber03
  save?: ContinuationSavelist
}
  | {
  type: "special"
  name: "until"
  args: {
    body: Continuation
    after: Continuation
  }
}
  | {
  type: "special"
  name: "while"
  args: {
    cond: Continuation
    body: Continuation
    after: Continuation
  }
}
  | {
  type: "special"
  name: "again"
  args: {
    body: Continuation
  }
}
  | {
  type: "special"
  name: "repeat"
  args: {
    count: VariableName4
    body: Continuation
    after: Continuation
  }
}
  | {
  type: "special"
  name: "pushint"
  args: {
    value: IntegerToPushToStack
    next: Continuation
  }
}
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName3 = string
export type RegisterNumber03 = number
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName4 = string
export type IntegerToPushToStack = number
/**
 * Array of current continuation possible values after current instruction execution
 */
export type PossibleBranchesOfAnInstruction = Continuation[]
/**
 * Can this instruction not perform any of specified branches in certain cases (do not modify cc)?
 */
export type NoBranchPossibility = boolean
export type AliasName = string
export type MnemonicOfAliasedInstruction = string
/**
 * Free-form fift usage description.
 */
export type FiftUsageDoc1 = string
/**
 * Free-form description of stack inputs and outputs. Usually the form is `[inputs] - [outputs]` where `[inputs]` are consumed stack values and `outputs` are produced stack values (top of stack is the last value).
 */
export type StackUsageDescription1 = string
/**
 * Free-form markdown description of alias.
 */
export type AliasDescription = string

export interface Instruction {
  mnemonic: InstructionName
  since_version: SinceGlobalVersion
  doc: Documentation
  bytecode: BytecodeFormat
  value_flow: ValueFlowOfInstruction
  control_flow: ControlFlowOfInstruction
}
/**
 * Free-form human-friendly information which should be used for documentation purposes only.
 */
export interface Documentation {
  opcode?: OpcodeFormatDocumentation
  stack?: StackUsageDescription
  category: CategoryOfInstruction
  description: InstructionDescription
  gas: GasUsageInfo
  fift: FiftUsageDoc
  fift_examples: {
    fift: FiftSnippet
    description: ExampleDescription
  }[]
}
/**
 * Information related to bytecode format of an instruction. Assuming that each instruction has format `prefix || operand_1 || operand_2 || ...` (also some operands may be refs, not bitstring part).
 */
export interface BytecodeFormat {
  tlb: TLBSchema
  prefix: InstructionPrefix
  operands_range_check?: OperandsRangeCheck
  operands: InstructionOperands
}
/**
 * In TVM, it is possible for instructions to have overlapping prefixes, so to determine actual instruction it is required to read next `length` bits after prefix as uint `i` and check `from <= i <= to`. Optional, there is no operands check in case of absence.
 */
export interface OperandsRangeCheck {
  length: number
  from: number
  to: number
}
/**
 * Information related to usage of stack and registers by instruction.
 */
export interface ValueFlowOfInstruction {
  inputs: InstructionInputs
  outputs: InstructionOutputs
}
/**
 * Incoming values constraints.
 */
export interface InstructionInputs {
  stack?: StackValues
  registers: RegisterValues
}
export interface MatchArm {
  value: ArmValue
  stack: StackValues
}
/**
 * Outgoing values constraints.
 */
export interface InstructionOutputs {
  stack?: StackValues
  registers: RegisterValues
}
/**
 * Information related to current cc modification by instruction
 */
export interface ControlFlowOfInstruction {
  branches: PossibleBranchesOfAnInstruction
  nobranch: NoBranchPossibility
}
/**
 * Values of saved control flow registers c0-c3
 */
export interface ContinuationSavelist {
  c0?: Continuation
  c1?: Continuation
  c2?: Continuation
  c3?: Continuation
}
export interface Alias {
  mnemonic: AliasName
  alias_of: MnemonicOfAliasedInstruction
  doc_fift?: FiftUsageDoc1
  doc_stack?: StackUsageDescription1
  description?: AliasDescription
  operands: FixedOperandsOfAlias
}
/**
 * Values of original instruction operands which are fixed in this alias. Currently it can be integer or slice without references which is represented by string of '0' and '1's. Type should be inferred from original instruction operand loaders.
 */
export interface FixedOperandsOfAlias {
  [k: string]: unknown
}



================================================
FILE: src/components/MDXPage/index.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/MDXPage/index.js
================================================
import React from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import MDXContent from '@theme/MDXContent';
import TOC from '@theme/TOC';
import styles from './styles.module.css';
export default function MDXPage(props) {
  const {content: MDXPageContent} = props;
  const {
    metadata: {title, description, frontMatter},
  } = MDXPageContent;
  const {wrapperClassName, hide_table_of_contents: hideTableOfContents} =
    frontMatter;
  return (
    <HtmlClassNameProvider
      className={clsx(
        wrapperClassName ?? ThemeClassNames.wrapper.mdxPages,
        ThemeClassNames.page.mdxPage,
      )}>
      <PageMetadata title={title} description={description} />
      <Layout>
        <main className="container container--fluid margin-vert--lg">
          <div className={clsx('row', styles.mdxPageWrapper)}>
            <div className={clsx('col', !hideTableOfContents && 'col--8')}>
              <article className={styles.contentWrapper}>
                <MDXContent>
                  <MDXPageContent />
                </MDXContent>
              </article>
            </div>
            {!hideTableOfContents && MDXPageContent.toc.length > 0 && (
              <div className="col col--2">
                <TOC
                  toc={MDXPageContent.toc}
                  minHeadingLevel={frontMatter.toc_min_heading_level}
                  maxHeadingLevel={frontMatter.toc_max_heading_level}
                />
              </div>
            )}
          </div>
        </main>
      </Layout>
    </HtmlClassNameProvider>
  );
}



================================================
FILE: src/components/MDXPage/styles.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/MDXPage/styles.module.css
================================================
.mdxPageWrapper {
  justify-content: center;
}

.contentWrapper {
  max-width: none;
  margin-left: 0;
  margin-right: 0;
}


================================================
FILE: src/components/MnemonicGenerator.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/MnemonicGenerator.tsx
================================================
import React, { useEffect, useState } from "react";
import { generateMnemonic } from "tonweb-mnemonic";
import Markdown from "markdown-to-jsx";

const MnemonicGenerator = () => {
  const [mnemonic, setMnemonic] = useState(['s']);
  const [mnemonicCount, setMnemonicCount] = useState(0);

  useEffect(() => {
    generateMnemonic().then(setMnemonic);
  }, [mnemonicCount]);


  return <>
    <Markdown>**Your mnemonic**:</Markdown>
    <br/>
    <code>{mnemonic.join(' ')}</code>
    <br/>
    <br/>
    <button className="button button--primary button--sm"
      onClick={() => setMnemonicCount((oldCount) => oldCount + 1)}>Regenerate mnemonic
    </button>
  </>;
};

export default MnemonicGenerator;



================================================
FILE: src/components/RedirectPage.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/RedirectPage.tsx
================================================
import React, { useEffect } from 'react'

const RedirectPage = ({ redirectUrl}: { redirectUrl: string }) => {
  // redirect here because current version of docusaurus doesn't support redirect for external links
  useEffect(() => {
    window.location.href = redirectUrl;
  }, [])
    
  return (
    <div />
  )
}

export default RedirectPage


================================================
FILE: src/components/SearchField/SearchField.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/SearchField/SearchField.module.css
================================================
.searchField {
  outline: none;
  border: none;
  background: var(--gray-9);
  height: 56px;
  width: 100%;
  border-radius: 4px;
  font-size: 1.2em;
  padding: 0 12px;
  margin-bottom: 1rem;
}

[data-theme=dark] .searchField {
  background: var(--gray-1);
}

.searchField:focus {
  background: #FFFFFF;
  box-shadow: inset 0 0 0 2px var(--ifm-color-primary);
}

[data-theme=dark] .searchField:focus {
  background: #000000;
}



================================================
FILE: src/components/SearchField/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/SearchField/index.tsx
================================================
import React, {
  ChangeEvent,
  KeyboardEvent,
  HTMLAttributes,
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react';
import styles from './SearchField.module.css';
import Markdown from "markdown-to-jsx";

type DataKey<Key> = {
  key: Key;
  name: string;
  hasMarkdown?: boolean;
}

type Props<DataItem> = {
  /**
   * An array of entities that will be filtered during the search
   * */
  data: DataItem[];
  /**
   * Property that determines a key that will be used for searching
   * */
  searchBy: keyof DataItem;
  /**
   * Decides which keys will be shown in the results
   * */
  showKeys: DataKey<keyof DataItem>[];
} & HTMLAttributes<HTMLInputElement>;

const uniq = <T,>(data: T[]): T[] => Array.from(new Set(data));

export const SearchField = <T extends Record<string, string>>({ data, searchBy, showKeys, ...props }: Props<T>) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [filteredData, setFilteredData] = useState<T[]>([]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500)

    return () => {
      clearTimeout(timeout);
    }
  }, [inputValue])

  useEffect(() => {
    const searchValue = debouncedValue.toLowerCase();

    const dataByKey = data.filter((item) => item[searchBy].toLowerCase().includes(searchValue));
    const dataByValues = data.filter((item) => JSON.stringify(Object.values(item)).toLowerCase().includes(searchValue));

    setFilteredData(uniq<T>([...dataByKey, ...dataByValues]));
  }, [data, debouncedValue, searchBy])

  useEffect(() => () => {
    clearTimeout(timeout.current);
  }, [timeout.current])

  return (
    <>
      <input
        className={styles.searchField}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        value={inputValue}
        type="text"
        {...props}
      />

      <table>
        <thead>
          <tr>
            {showKeys.map((keyEntity) => (
              <th style={{textAlign: "left"}} key={keyEntity.name}>{keyEntity.name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {debouncedValue.length === 0 && (
            <tr>
              <td colSpan={showKeys.length}>
                Please enter a search query
              </td>
            </tr>
          )}

          {filteredData.length === 0 && (
            <tr>
              <td colSpan={showKeys.length}>
                No results found
              </td>
            </tr>
          )}

          {filteredData.length !== 0 && filteredData.map((item, index) => (
            <tr key={index}>
              {showKeys.map((keyEntity) => {
                const value = item[keyEntity.key];

                return (
                  <td key={keyEntity.name}>
                    {keyEntity.hasMarkdown ? <Markdown>{value}</Markdown> : <code>{value}</code>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
}



================================================
FILE: src/components/button.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/button.tsx
================================================
import Link from '@docusaurus/Link'
import React from 'react'

// <Link
// className="button button--secondary button--lg"
//
//
//     to="/docs/intro">
//     Серая
// </Link>

interface IButtonProps {
    sizeType: 'lg' | 'sm'
    href: string
    colorType: 'primary' | 'secondary'
    children: string
}

const Button = (props: IButtonProps) => {
  const classNames = `button button--${props.colorType} button--${props.sizeType}`

  return (
    <Link
      className={classNames}
      to={props.href}
    >
      {props.children}
    </Link>
  )
}

export default Button



================================================
FILE: src/components/conceptImage.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/conceptImage.tsx
================================================
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import React from "react";

function ConceptImage({src, style}) {

  let imgUrl = src;
  let imgStyle = style;

  if (imgStyle === undefined) {
    imgStyle = {maxWidth: '80%',textAlign: 'center', margin: '10pt auto', display: 'block'}
  }

  if (src.indexOf('http') === -1)
    imgUrl = useBaseUrl(src);

  return (
    <img style={imgStyle} src={imgUrl}  alt={'concept image'}/>
  );
}

// @ts-ignore
export default ConceptImage



================================================
FILE: src/components/contentBlock.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/contentBlock.tsx
================================================
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import React from "react";

function ContentBlock({title, status, description, linkUrl, imageUrl}) {
  // const imgUrl = useBaseUrl(imageUrl);
  return (

    <div className="col-md-4 p-8">
      <Link to={useBaseUrl(linkUrl)} activeClassName="active">
        <div className="show-card">
          <div className="icon-wrapper">
            <ThemedImage alt={title} className="icon" sources={{
              light: useBaseUrl(imageUrl.replace('.svg', '-light.svg')),
              dark: useBaseUrl(imageUrl.replace('.svg', '-dark.svg'))
            }} />
          </div>
          <div className="status">{status}</div>
          <div className="title">{title}</div>
          <div className="descriptions">{description}</div>
        </div>
      </Link>
    </div>

  );
}

// @ts-ignore
export default ContentBlock


================================================
FILE: src/components/player.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/components/player.tsx
================================================
import React from "react";
import ReactPlayer from "react-player";

const Player = (props) => (

  <div className="player-wrapper">
    <ReactPlayer
      url={props.url}
      className="react-player"
      width="100%"
      height="100%"
      playing={props.playing}
      controls={props.controls}
    />
  </div>
);

export default Player;



================================================
FILE: src/css/bootstrap-only-grid.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/css/bootstrap-only-grid.css
================================================
@-ms-viewport{width:device-width}html{-webkit-box-sizing:border-box;box-sizing:border-box;-ms-overflow-style:scrollbar}*,::after,::before{-webkit-box-sizing:inherit;box-sizing:inherit}.bootstrap-wrapper .container{width:100%;padding-right:8px;padding-left:8px;margin-right:auto;margin-left:auto}@media (min-width:576px){.bootstrap-wrapper .container{max-width:540px}}@media (min-width:768px){.bootstrap-wrapper .container{max-width:720px}}@media (min-width:992px){.bootstrap-wrapper .container{max-width:960px}}@media (min-width:1200px){.bootstrap-wrapper .container{max-width:1140px}}.bootstrap-wrapper .container-fluid{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}.bootstrap-wrapper .row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-8px;margin-left:-8px}.bootstrap-wrapper .no-gutters{margin-right:0;margin-left:0}.bootstrap-wrapper .no-gutters>.col,.bootstrap-wrapper .no-gutters>[class*=col-]{padding-right:0;padding-left:0}.bootstrap-wrapper .col,.bootstrap-wrapper .col-1,.bootstrap-wrapper .col-10,.bootstrap-wrapper .col-11,.bootstrap-wrapper .col-12,.bootstrap-wrapper .col-2,.bootstrap-wrapper .col-3,.bootstrap-wrapper .col-4,.bootstrap-wrapper .col-5,.bootstrap-wrapper .col-6,.bootstrap-wrapper .col-7,.bootstrap-wrapper .col-8,.bootstrap-wrapper .col-9,.bootstrap-wrapper .col-auto,.bootstrap-wrapper .col-lg,.bootstrap-wrapper .col-lg-1,.bootstrap-wrapper .col-lg-10,.bootstrap-wrapper .col-lg-11,.bootstrap-wrapper .col-lg-12,.bootstrap-wrapper .col-lg-2,.bootstrap-wrapper .col-lg-3,.bootstrap-wrapper .col-lg-4,.bootstrap-wrapper .col-lg-5,.bootstrap-wrapper .col-lg-6,.bootstrap-wrapper .col-lg-7,.bootstrap-wrapper .col-lg-8,.bootstrap-wrapper .col-lg-9,.bootstrap-wrapper .col-lg-auto,.bootstrap-wrapper .col-md,.bootstrap-wrapper .col-md-1,.bootstrap-wrapper .col-md-10,.bootstrap-wrapper .col-md-11,.bootstrap-wrapper .col-md-12,.bootstrap-wrapper .col-md-2,.bootstrap-wrapper .col-md-3,.bootstrap-wrapper .col-md-4,.bootstrap-wrapper .col-md-5,.bootstrap-wrapper .col-md-6,.bootstrap-wrapper .col-md-7,.bootstrap-wrapper .col-md-8,.bootstrap-wrapper .col-md-9,.bootstrap-wrapper .col-md-auto,.bootstrap-wrapper .col-sm,.bootstrap-wrapper .col-sm-1,.bootstrap-wrapper .col-sm-10,.bootstrap-wrapper .col-sm-11,.bootstrap-wrapper .col-sm-12,.bootstrap-wrapper .col-sm-2,.bootstrap-wrapper .col-sm-3,.bootstrap-wrapper .col-sm-4,.bootstrap-wrapper .col-sm-5,.bootstrap-wrapper .col-sm-6,.bootstrap-wrapper .col-sm-7,.bootstrap-wrapper .col-sm-8,.bootstrap-wrapper .col-sm-9,.bootstrap-wrapper .col-sm-auto,.bootstrap-wrapper .col-xl,.bootstrap-wrapper .col-xl-1,.bootstrap-wrapper .col-xl-10,.bootstrap-wrapper .col-xl-11,.bootstrap-wrapper .col-xl-12,.bootstrap-wrapper .col-xl-2,.bootstrap-wrapper .col-xl-3,.bootstrap-wrapper .col-xl-4,.bootstrap-wrapper .col-xl-5,.bootstrap-wrapper .col-xl-6,.bootstrap-wrapper .col-xl-7,.bootstrap-wrapper .col-xl-8,.bootstrap-wrapper .col-xl-9,.bootstrap-wrapper .col-xl-auto{position:relative;width:100%;padding-right:8px;padding-left:8px}.bootstrap-wrapper .col{-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.bootstrap-wrapper .col-auto{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.bootstrap-wrapper .col-1{-webkit-box-flex:0;-webkit-flex:0 0 8.3333333333%;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.bootstrap-wrapper .col-2{-webkit-box-flex:0;-webkit-flex:0 0 16.6666666667%;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.bootstrap-wrapper .col-3{-webkit-box-flex:0;-webkit-flex:0 0 25%;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.bootstrap-wrapper .col-4{-webkit-box-flex:0;-webkit-flex:0 0 33.3333333333%;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.bootstrap-wrapper .col-5{-webkit-box-flex:0;-webkit-flex:0 0 41.6666666667%;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.bootstrap-wrapper .col-6{-webkit-box-flex:0;-webkit-flex:0 0 50%;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.bootstrap-wrapper .col-7{-webkit-box-flex:0;-webkit-flex:0 0 58.3333333333%;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.bootstrap-wrapper .col-8{-webkit-box-flex:0;-webkit-flex:0 0 66.6666666667%;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.bootstrap-wrapper .col-9{-webkit-box-flex:0;-webkit-flex:0 0 75%;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.bootstrap-wrapper .col-10{-webkit-box-flex:0;-webkit-flex:0 0 83.3333333333%;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.bootstrap-wrapper .col-11{-webkit-box-flex:0;-webkit-flex:0 0 91.6666666667%;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.bootstrap-wrapper .col-12{-webkit-box-flex:0;-webkit-flex:0 0 100%;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}@media (min-width:576px){.bootstrap-wrapper .col-sm{-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.bootstrap-wrapper .col-sm-auto{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.bootstrap-wrapper .col-sm-1{-webkit-box-flex:0;-webkit-flex:0 0 8.3333333333%;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.bootstrap-wrapper .col-sm-2{-webkit-box-flex:0;-webkit-flex:0 0 16.6666666667%;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.bootstrap-wrapper .col-sm-3{-webkit-box-flex:0;-webkit-flex:0 0 25%;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.bootstrap-wrapper .col-sm-4{-webkit-box-flex:0;-webkit-flex:0 0 33.3333333333%;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.bootstrap-wrapper .col-sm-5{-webkit-box-flex:0;-webkit-flex:0 0 41.6666666667%;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.bootstrap-wrapper .col-sm-6{-webkit-box-flex:0;-webkit-flex:0 0 50%;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.bootstrap-wrapper .col-sm-7{-webkit-box-flex:0;-webkit-flex:0 0 58.3333333333%;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.bootstrap-wrapper .col-sm-8{-webkit-box-flex:0;-webkit-flex:0 0 66.6666666667%;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.bootstrap-wrapper .col-sm-9{-webkit-box-flex:0;-webkit-flex:0 0 75%;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.bootstrap-wrapper .col-sm-10{-webkit-box-flex:0;-webkit-flex:0 0 83.3333333333%;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.bootstrap-wrapper .col-sm-11{-webkit-box-flex:0;-webkit-flex:0 0 91.6666666667%;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.bootstrap-wrapper .col-sm-12{-webkit-box-flex:0;-webkit-flex:0 0 100%;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}}@media (min-width:768px){.bootstrap-wrapper .col-md{-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.bootstrap-wrapper .col-md-auto{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.bootstrap-wrapper .col-md-1{-webkit-box-flex:0;-webkit-flex:0 0 8.3333333333%;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.bootstrap-wrapper .col-md-2{-webkit-box-flex:0;-webkit-flex:0 0 16.6666666667%;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.bootstrap-wrapper .col-md-3{-webkit-box-flex:0;-webkit-flex:0 0 25%;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.bootstrap-wrapper .col-md-4{-webkit-box-flex:0;-webkit-flex:0 0 33.3333333333%;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.bootstrap-wrapper .col-md-5{-webkit-box-flex:0;-webkit-flex:0 0 41.6666666667%;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.bootstrap-wrapper .col-md-6{-webkit-box-flex:0;-webkit-flex:0 0 50%;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.bootstrap-wrapper .col-md-7{-webkit-box-flex:0;-webkit-flex:0 0 58.3333333333%;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.bootstrap-wrapper .col-md-8{-webkit-box-flex:0;-webkit-flex:0 0 66.6666666667%;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.bootstrap-wrapper .col-md-9{-webkit-box-flex:0;-webkit-flex:0 0 75%;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.bootstrap-wrapper .col-md-10{-webkit-box-flex:0;-webkit-flex:0 0 83.3333333333%;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.bootstrap-wrapper .col-md-11{-webkit-box-flex:0;-webkit-flex:0 0 91.6666666667%;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.bootstrap-wrapper .col-md-12{-webkit-box-flex:0;-webkit-flex:0 0 100%;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}}@media (min-width:992px){.bootstrap-wrapper .col-lg{-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.bootstrap-wrapper .col-lg-auto{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.bootstrap-wrapper .col-lg-1{-webkit-box-flex:0;-webkit-flex:0 0 8.3333333333%;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.bootstrap-wrapper .col-lg-2{-webkit-box-flex:0;-webkit-flex:0 0 16.6666666667%;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.bootstrap-wrapper .col-lg-3{-webkit-box-flex:0;-webkit-flex:0 0 25%;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.bootstrap-wrapper .col-lg-4{-webkit-box-flex:0;-webkit-flex:0 0 33.3333333333%;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.bootstrap-wrapper .col-lg-5{-webkit-box-flex:0;-webkit-flex:0 0 41.6666666667%;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.bootstrap-wrapper .col-lg-6{-webkit-box-flex:0;-webkit-flex:0 0 50%;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.bootstrap-wrapper .col-lg-7{-webkit-box-flex:0;-webkit-flex:0 0 58.3333333333%;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.bootstrap-wrapper .col-lg-8{-webkit-box-flex:0;-webkit-flex:0 0 66.6666666667%;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.bootstrap-wrapper .col-lg-9{-webkit-box-flex:0;-webkit-flex:0 0 75%;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.bootstrap-wrapper .col-lg-10{-webkit-box-flex:0;-webkit-flex:0 0 83.3333333333%;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.bootstrap-wrapper .col-lg-11{-webkit-box-flex:0;-webkit-flex:0 0 91.6666666667%;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.bootstrap-wrapper .col-lg-12{-webkit-box-flex:0;-webkit-flex:0 0 100%;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}}@media (min-width:1200px){.bootstrap-wrapper .col-xl{-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.bootstrap-wrapper .col-xl-auto{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.bootstrap-wrapper .col-xl-1{-webkit-box-flex:0;-webkit-flex:0 0 8.3333333333%;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.bootstrap-wrapper .col-xl-2{-webkit-box-flex:0;-webkit-flex:0 0 16.6666666667%;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.bootstrap-wrapper .col-xl-3{-webkit-box-flex:0;-webkit-flex:0 0 25%;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.bootstrap-wrapper .col-xl-4{-webkit-box-flex:0;-webkit-flex:0 0 33.3333333333%;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.bootstrap-wrapper .col-xl-5{-webkit-box-flex:0;-webkit-flex:0 0 41.6666666667%;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.bootstrap-wrapper .col-xl-6{-webkit-box-flex:0;-webkit-flex:0 0 50%;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.bootstrap-wrapper .col-xl-7{-webkit-box-flex:0;-webkit-flex:0 0 58.3333333333%;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.bootstrap-wrapper .col-xl-8{-webkit-box-flex:0;-webkit-flex:0 0 66.6666666667%;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.bootstrap-wrapper .col-xl-9{-webkit-box-flex:0;-webkit-flex:0 0 75%;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.bootstrap-wrapper .col-xl-10{-webkit-box-flex:0;-webkit-flex:0 0 83.3333333333%;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.bootstrap-wrapper .col-xl-11{-webkit-box-flex:0;-webkit-flex:0 0 91.6666666667%;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.bootstrap-wrapper .col-xl-12{-webkit-box-flex:0;-webkit-flex:0 0 100%;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}}.d-flex{display:flex!important}


================================================
FILE: src/css/custom.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/css/custom.css
================================================
:root {
  --ifm-color-primary: #0088cc;
  --ifm-color-primary-dark: #0088CC;
  --ifm-color-primary-darker: #0074ad;
  --ifm-color-primary-darkest: #005f8f;
  --ifm-color-primary-light: #0088CC;
  --ifm-color-primary-lighter: #009ceb;
  --ifm-color-primary-lightest: #0aadff;
  --ifm-color-success-dark: #47C58A;
  --ifm-color-info-dark: #0088cc;
  --ifm-color-success-contrast-background: rgba(50, 213, 131, 0.1);
  --ifm-color-info-contrast-background: rgba(0, 153, 229, 0.1);
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
  --ifm-navbar-search-input-icon: url('data:image/svg+xml;utf8,<svg fill="rgb(152, 178, 191)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16px" width="16px"><path d="M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609,0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021,0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338,4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z" /></svg>');
  --ifm-navbar-search-input-background-color: #F7F9FB;
  --ifm-heading-font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont,
  'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
  'Segoe UI Emoji', 'Segoe UI Symbol';
  --ifm-font-weight-bold: 800;
  --ifm-font-family-base: system-ui, -apple-system, Roboto, Segoe UI, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont,
  'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
  'Segoe UI Emoji', 'Segoe UI Symbol';
  --ifm-font-family-monospace: 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas,
  'Liberation Mono', 'Courier New', monospace;
  --ifm-hr-height: .5px;
  --ifm-hr-background-color: #DFE5E8;
  --ifm-toc-border-color: #DFE5E8;
  --ifm-toc-border-size: 0.5px;
  --ifm-global-border-width: 0.5px;
  --ifm-heading-margin-top: 120px
}

@media (max-width:576px) {
  :root {
    --ifm-heading-margin-top: 40px
  }
}

[data-theme=dark] {
  --ifm-color-primary: #019BE9;
  --ifm-color-primary-dark: #0690d4;
  --ifm-color-primary-darker: #0688c9;
  --ifm-color-primary-darkest: #0570a5;
  --ifm-color-primary-light: #13acf8;
  --ifm-color-primary-lighter: #1fb0f8;
  --ifm-color-primary-lightest: #42bdf9;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
  --button_light_primary: #01A4F5;
  --ifm-navbar-search-input-icon: url('data:image/svg+xml;utf8,<svg fill="rgb(96, 96, 105)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16px" width="16px"><path d="M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609,0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021,0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338,4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z" /></svg>');
  --ifm-navbar-search-input-background-color: #2D2D32
}

html[data-theme=dark] {
  --ifm-background-color: #232328;
  --ifm-background-surface-color: #232328
}

/* Common colors for all themes */
body {
  --ton_blue: #0098EA;
  --ton_dark_blue: #07ACFF;
  --ton_purple: #B588FF;
  --default_white: #FFFFFF;
  --default_black: #161C28;
  --toncoin_header: #353538;
  --toncoin_gradient: linear-gradient(297.97deg, #232328 9.93%, #343437 76.88%);
}

body {
  --accent-light: #0098EA;
  --accent-dark: #07ACFF;
  --accent-hover-light: #00A6FF;
  --accent-hover-dark: #34BCFF;

  --background-page-light: #FFFFFF;
  --background-page-dark: #232328;
  --background-page-hover-light: #F7F9FB;
  --background-page-hover-dark: #2D2D32;

  --background-content-light: #F7F9FB;
  --background-content-dark: #2D2D32;
  --background-content-hover-light: #F0F4F8;
  --background-content-hover-dark: #36363C;

  --text-primary-light: #04060B;
  --text-primary-dark: #F3F3F6;
  --text-secondary-light: #191F2F;
  --text-secondary-dark: #D5D5D8;
  --text-tertiary-light: #728A96;
  --text-tertiary-dark: #ACACAF;

  --icon-primary-light: #232328;
  --icon-primary-dark: #E5E5EA;
  --icon-secondary-light: #98B2BF;
  --icon-secondary-dark: #606069;
  --icon-tertiary-light: #C0D1D9;
  --icon-tertiary-dark: #45454B;

  --button-primary-light: var(--accent-light);
  --button-primary-dark: var(--accent-light);
  --button-primary-text-light: var(--accent-light);
  --button-primary-text-dark: var(--accent-dark);
  --button-secondary-stroke-light: #E9EEF1;
  --button-secondary-stroke-dark: #303035;

  --segment-background-light: #F2F5F8;
  --segment-background-dark: #232328;
  --segment-active-light: #FFFFFF;
  --segment-active-dark: #2D2D32;
  --segment-active-content-dark: #3F3F46;

  --card-border-light: #DDE3E6;
  --card-border-dark: #44444A;

  --separator-alpha-light: #DFE5E8;
  --separator-alpha-dark: #4F4F53;

  --gradient-text: linear-gradient(68deg, #2B82EB 0.63%, #1AC8FF 90%);
  --gradient-text-mobile: linear-gradient(68deg, #2B82EB 0.63%, #1AC8FF 50%);
  --gradient-purple: linear-gradient(182.79deg, #9A98F2 -28.73%, #8AC0FF 133.77%);
  --gradient-green: linear-gradient(186.6deg, #7BAEFF -13.27%, #C1EDD1 128.74%);
  --gradient-light-blue: linear-gradient(88.93deg, #2B83EC 18.91%, #1AC9FF 79.91%);
  --gradient-splash: linear-gradient(
    to top left,
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, 0.0) 45%,
    rgba(255, 255, 255, 0.72) 50%,
    rgba(255, 255, 255, 0.0) 57%,
    rgba(255, 255, 255, 0.0) 100%
  );

  --basic-white: #FFFFFF;
  --basic-white-overlay: rgba(255, 255, 255, 0.70);
  --basic-white-overlay-86: rgba(255, 255, 255, 0.86);
  --basic-white-overlay-50: rgba(255, 255, 255, 0.50);
  --basic-black: #000000;
  --basic-overlay-24: rgba(0, 0, 0, 0.24);
  --basic-overlay-48: rgba(0, 0, 0, 0.70);
  --basic-dark-overlay-86: rgba(0, 0, 0, 0.70);

  --dark-shimmer-card: linear-gradient(90deg, rgba(45, 45, 50, 0.80) 0%, #3F3F47 48.16%, #2D2D32 98.44%);
  --light-shimmer-card: linear-gradient(90deg, #F5F7FA 0%, #FAFDFF 50.98%, #F5F7FA 100%);

  --feedback-error-light: #ED6767;
  --feedback-error-dark: #FF5C5C;
  --feedback-success-light: #47C58A;
  --feedback-success-dark: #32D583;

  --header-item-hover: rgba(118, 152, 187, 0.06);

  --card-hover-box-shadow: 0px 2px 24px rgba(114, 138, 150, 0.12);
  --card-box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.08);
  --ligth-green: rgba(255, 92, 92, 0.08);
  --ligth-red: rgba(71, 197, 138, 0.1);

  --dark-selection: rgba(1, 164, 245, 0.1);
  --light-selection: rgba(0, 136, 204, 0.1);

  --basic-white-hover: #F1F4F7;

  --float-shadow-color: #00000014;
}

.navbar .navbar__items[data-theme=light] {
  flex: auto;
  background: rgba(35,35,40,.9)
}

.dropdown__link {
  font-size: inherit
}

:root {
  --ifm-global-shadow-md: 0 5px 40px rgb(0 0 0 / 20%)
}

@media screen and (max-width:996px) {
  :root {
    --ifm-font-size-base: 18px
  }

  article header h1 {
    font-size: 1.5rem!important
  }

  .hero .hero__title {
    font-size: 2.5rem
  }
}

@media screen and (min-width:997px) {
  :root {
    --ifm-font-size-base: 17px
  }

  article header h1 {
    font-size: 2rem!important
  }

  code {
    font-size: 15px!important
  }
}

article {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto
}

html {
  -ms-overflow-style: scrollbar;
  --html-font-size: 17px;
  --line-height: 1.5;
  --form-field-line-height: 1.3;
  --focus-size: 0.1875em;
  --button-top-padding: 0.55em;
  --button-bottom-padding: 0.65em;
  --button-horizontal-padding: 0.9em;
  --button-line-height: var(--form-field-line-height);
  --button-border-radius: 0.375em;
  --section-vertical-padding: 6em;
  --header-height: 4.5rem;
  --code-font-size: 0.9em;
  --inline-code-font-size: 0.85em;
  --orange-rgb: var(--blue-rgb);
  --orange: rgb(var(--orange-rgb));
  --orange-for-use-as-selection-color: var(--ifm-color-primary-dark);
  --light-blue-rgb: 79, 140, 200;
  --light-blue: rgb(var(--light-blue-rgb));
  --blue-rgb: 0, 81, 127;
  --blue: rgb(var(--blue-rgb));
  --red-0: #430c15;
  --red-0-rgb: 67, 12, 21;
  --red-1: #711423;
  --red-1-rgb: 113, 20, 35;
  --red-2: #a01c32;
  --red-2-rgb: 160, 28, 50;
  --red-3: #bf223c;
  --red-3-rgb: 191, 34, 60;
  --red-4: #da304c;
  --red-4-rgb: 218, 48, 76;
  --red-5: #e35f75;
  --red-5-rgb: 227, 95, 117;
  --red-6: #ec93a2;
  --red-6-rgb: 236, 147, 162;
  --red-7: #f3bac3;
  --red-7-rgb: 243, 186, 195;
  --red-8: #f9dce1;
  --red-8-rgb: 249, 220, 225;
  --red-9: #fcf0f2;
  --red-9-rgb: 252, 240, 242;
  --orange-0: #341a04;
  --orange-0-rgb: 52, 26, 4;
  --orange-1: #5b2c06;
  --orange-1-rgb: 91, 44, 6;
  --orange-2: #813f09;
  --orange-2-rgb: 129, 63, 9;
  --orange-3: #a24f0b;
  --orange-3-rgb: 162, 79, 11;
  --orange-4: #b6590d;
  --orange-4-rgb: 182, 89, 13;
  --orange-5: #e06d10;
  --orange-5-rgb: 224, 109, 16;
  --orange-6: #f4a15d;
  --orange-6-rgb: 244, 161, 93;
  --orange-7: #f8c296;
  --orange-7-rgb: 248, 194, 150;
  --orange-8: #fbdbc1;
  --orange-8-rgb: 251, 219, 193;
  --orange-9: #fdf1e7;
  --orange-9-rgb: 253, 241, 231;
  --gold-0: #2c1c02;
  --gold-0-rgb: 44, 28, 2;
  --gold-1: #573905;
  --gold-1-rgb: 87, 57, 5;
  --gold-2: #744c06;
  --gold-2-rgb: 116, 76, 6;
  --gold-3: #8e5c07;
  --gold-3-rgb: 142, 92, 7;
  --gold-4: #a26a09;
  --gold-4-rgb: 162, 106, 9;
  --gold-5: #c7820a;
  --gold-5-rgb: 199, 130, 10;
  --gold-6: #f4a929;
  --gold-6-rgb: 244, 169, 41;
  --gold-7: #f8cd81;
  --gold-7-rgb: 248, 205, 129;
  --gold-8: #fbe2b6;
  --gold-8-rgb: 251, 226, 182;
  --gold-9: #fdf3e2;
  --gold-9-rgb: 253, 243, 226;
  --green-0: #0f2417;
  --green-0-rgb: 15, 36, 23;
  --green-1: #1c422b;
  --green-1-rgb: 28, 66, 43;
  --green-2: #285d3d;
  --green-2-rgb: 40, 93, 61;
  --green-3: #31724b;
  --green-3-rgb: 49, 114, 75;
  --green-4: #398557;
  --green-4-rgb: 57, 133, 87;
  --green-5: #46a46c;
  --green-5-rgb: 70, 164, 108;
  --green-6: #79c698;
  --green-6-rgb: 121, 198, 152;
  --green-7: #b0ddc2;
  --green-7-rgb: 176, 221, 194;
  --green-8: #d8eee1;
  --green-8-rgb: 216, 238, 225;
  --green-9: #eff8f3;
  --green-9-rgb: 239, 248, 243;
  --cyan-0: #0c2427;
  --cyan-0-rgb: 12, 36, 39;
  --cyan-1: #164249;
  --cyan-1-rgb: 22, 66, 73;
  --cyan-2: #1d5962;
  --cyan-2-rgb: 29, 89, 98;
  --cyan-3: #26727e;
  --cyan-3-rgb: 38, 114, 126;
  --cyan-4: #2b818e;
  --cyan-4-rgb: 43, 129, 142;
  --cyan-5: #35a0b1;
  --cyan-5-rgb: 53, 160, 177;
  --cyan-6: #66c3d1;
  --cyan-6-rgb: 102, 195, 209;
  --cyan-7: #a5dce4;
  --cyan-7-rgb: 165, 220, 228;
  --cyan-8: #d0edf1;
  --cyan-8-rgb: 208, 237, 241;
  --cyan-9: #e9f7f9;
  --cyan-9-rgb: 233, 247, 249;
  --blue-0: #0c2231;
  --blue-0-rgb: 12, 34, 49;
  --blue-1: #163d57;
  --blue-1-rgb: 22, 61, 87;
  --blue-2: #1f567a;
  --blue-2-rgb: 31, 86, 122;
  --blue-3: #276d9b;
  --blue-3-rgb: 39, 109, 155;
  --blue-4: #2c7cb0;
  --blue-4-rgb: 44, 124, 176;
  --blue-5: #479ad1;
  --blue-5-rgb: 71, 154, 209;
  --blue-6: #7cb7de;
  --blue-6-rgb: 124, 183, 222;
  --blue-7: #add2eb;
  --blue-7-rgb: 173, 210, 235;
  --blue-8: #d6e9f5;
  --blue-8-rgb: 214, 233, 245;
  --blue-9: #ebf4fa;
  --blue-9-rgb: 235, 244, 250;
  --indigo-0: #181e34;
  --indigo-0-rgb: 24, 30, 52;
  --indigo-1: #2c365e;
  --indigo-1-rgb: 44, 54, 94;
  --indigo-2: #404e88;
  --indigo-2-rgb: 64, 78, 136;
  --indigo-3: #5062aa;
  --indigo-3-rgb: 80, 98, 170;
  --indigo-4: #6373b6;
  --indigo-4-rgb: 99, 115, 182;
  --indigo-5: #8794c7;
  --indigo-5-rgb: 135, 148, 199;
  --indigo-6: #a5aed5;
  --indigo-6-rgb: 165, 174, 213;
  --indigo-7: #c8cde5;
  --indigo-7-rgb: 200, 205, 229;
  --indigo-8: #e0e3f0;
  --indigo-8-rgb: 224, 227, 240;
  --indigo-9: #f1f3f8;
  --indigo-9-rgb: 241, 243, 248;
  --violet-0: #2d1832;
  --violet-0-rgb: 45, 24, 50;
  --violet-1: #502b5a;
  --violet-1-rgb: 80, 43, 90;
  --violet-2: #753f83;
  --violet-2-rgb: 117, 63, 131;
  --violet-3: #8e4c9e;
  --violet-3-rgb: 142, 76, 158;
  --violet-4: #9f5bb0;
  --violet-4-rgb: 159, 91, 176;
  --violet-5: #b683c3;
  --violet-5-rgb: 182, 131, 195;
  --violet-6: #c9a2d2;
  --violet-6-rgb: 201, 162, 210;
  --violet-7: #dbc1e1;
  --violet-7-rgb: 219, 193, 225;
  --violet-8: #ebddee;
  --violet-8-rgb: 235, 221, 238;
  --violet-9: #f7f1f8;
  --violet-9-rgb: 247, 241, 248;
  --gray-00-rgb: 23, 23, 24;
  --gray-00: rgb(var(--gray-00-rgb));
  --gray-0F-rgb: 25, 27, 29;
  --gray-0F: rgb(var(--gray-0F-rgb));
  --gray-0-rgb: 29, 31, 32;
  --gray-0: rgb(var(--gray-0-rgb));
  --gray-05-rgb: 36, 38, 40;
  --gray-05: rgb(var(--gray-05-rgb));
  --gray-1-rgb: 54, 57, 58;
  --gray-1: rgb(var(--gray-1-rgb));
  --gray-2-rgb: 78, 82, 85;
  --gray-2: rgb(var(--gray-2-rgb));
  --gray-3-rgb: 98, 103, 106;
  --gray-3: rgb(var(--gray-3-rgb));
  --gray-4-rgb: 114, 119, 123;
  --gray-4: rgb(var(--gray-4-rgb));
  --gray-5-rgb: 146, 151, 155;
  --gray-5: rgb(var(--gray-5-rgb));
  --gray-6-rgb: 183, 187, 189;
  --gray-6: rgb(var(--gray-6-rgb));
  --gray-7-rgb: 213, 215, 216;
  --gray-7: rgb(var(--gray-7-rgb));
  --gray-8-rgb: 234, 235, 235;
  --gray-8: rgb(var(--gray-8-rgb));
  --gray-9-rgb: 243, 243, 244;
  --gray-9: rgb(var(--gray-9-rgb));
  --gray-A-rgb: 247, 247, 248;
  --gray-A: rgb(var(--gray-A-rgb));
  --code-gray: #a7a7a3;
  --code-red: #ed8978;
  --code-orange: #fba056;
  --code-gold: #fdda68;
  --code-green: #57c78f;
  --code-blue: #78c0ed;
  --code-cyan: #71e4f4;
  --code-indigo: #7b99ea;
  --code-lilac: #d188dd;
  --code-violet: #a68adb;
  --code-gray-light-theme: var(--gray-3);
  --code-red-light-theme: #8f1500;
  --code-orange-light-theme: #b35000;
  --code-gold-light-theme: #b35300;
  --code-green-light-theme: #007a3d;
  --code-blue-light-theme: #00588f;
  --code-cyan-light-theme: #006c7a;
  --code-indigo-light-theme: #00268f;
  --code-lilac-light-theme: #7c008f;
  --code-violet-light-theme: #32008f;
  --diff-indicator-red: var(--code-red);
  --diff-indicator-green: var(--code-green);
  --diff-indicator-red-light-theme: #eb0052;
  --diff-indicator-green-light-theme: #0c6
}

*,::after,::before,html {
  -webkit-box-sizing: border-box;
  box-sizing: border-box
}

a,a:after,a:hover {
  text-decoration: none
}

.bootstrap-wrapper {
  height: 100%
}

.bootstrap-wrapper .container {
  width: 100%;
  margin-right: auto;
  margin-left: auto
}

@media (min-width:576px) {
  .bootstrap-wrapper .container {
    max-width: 540px
  }
}

@media (min-width:768px) {
  .bootstrap-wrapper .container {
    max-width: 720px
  }
}

@media (min-width:992px) {
  .bootstrap-wrapper .container {
    max-width: 960px
  }
}

@media (min-width:1200px) {
  .bootstrap-wrapper .container {
    max-width: 1140px
  }
}

.bootstrap-wrapper .container-fluid {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto
}

.bootstrap-wrapper .row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0
}

.row {
  margin: 0
}

.bootstrap-wrapper .no-gutters {
  margin-right: 0;
  margin-left: 0
}

.bootstrap-wrapper .no-gutters>.col,.bootstrap-wrapper .no-gutters>[class*=col-] {
  padding-right: 0;
  padding-left: 0
}

.bootstrap-wrapper .col,.bootstrap-wrapper .col-1,.bootstrap-wrapper .col-10,.bootstrap-wrapper .col-11,.bootstrap-wrapper .col-12,.bootstrap-wrapper .col-2,.bootstrap-wrapper .col-3,.bootstrap-wrapper .col-4,.bootstrap-wrapper .col-5,.bootstrap-wrapper .col-6,.bootstrap-wrapper .col-7,.bootstrap-wrapper .col-8,.bootstrap-wrapper .col-9 {
  position: relative;
  width: 100%;
  padding-right: 16px;
  padding-left: 16px
}

.bootstrap-wrapper .col-auto {
  position: relative;
  padding-right: 16px;
  padding-left: 16px
}

.bootstrap-wrapper .col-lg,.bootstrap-wrapper .col-lg-1,.bootstrap-wrapper .col-lg-10,.bootstrap-wrapper .col-lg-11,.bootstrap-wrapper .col-lg-12,.bootstrap-wrapper .col-lg-2,.bootstrap-wrapper .col-lg-3,.bootstrap-wrapper .col-lg-4,.bootstrap-wrapper .col-lg-5,.bootstrap-wrapper .col-lg-6,.bootstrap-wrapper .col-lg-7,.bootstrap-wrapper .col-lg-8,.bootstrap-wrapper .col-lg-9,.bootstrap-wrapper .col-lg-auto,.bootstrap-wrapper .col-md,.bootstrap-wrapper .col-md-1,.bootstrap-wrapper .col-md-10,.bootstrap-wrapper .col-md-11,.bootstrap-wrapper .col-md-12,.bootstrap-wrapper .col-md-2,.bootstrap-wrapper .col-md-3,.bootstrap-wrapper .col-md-4,.bootstrap-wrapper .col-md-5,.bootstrap-wrapper .col-md-6,.bootstrap-wrapper .col-md-7,.bootstrap-wrapper .col-md-8,.bootstrap-wrapper .col-md-9,.bootstrap-wrapper .col-md-auto,.bootstrap-wrapper .col-sm,.bootstrap-wrapper .col-sm-1,.bootstrap-wrapper .col-sm-10,.bootstrap-wrapper .col-sm-11,.bootstrap-wrapper .col-sm-12,.bootstrap-wrapper .col-sm-2,.bootstrap-wrapper .col-sm-3,.bootstrap-wrapper .col-sm-4,.bootstrap-wrapper .col-sm-5,.bootstrap-wrapper .col-sm-6,.bootstrap-wrapper .col-sm-7,.bootstrap-wrapper .col-sm-8,.bootstrap-wrapper .col-sm-9,.bootstrap-wrapper .col-sm-auto,.bootstrap-wrapper .col-xl,.bootstrap-wrapper .col-xl-1,.bootstrap-wrapper .col-xl-10,.bootstrap-wrapper .col-xl-11,.bootstrap-wrapper .col-xl-12,.bootstrap-wrapper .col-xl-2,.bootstrap-wrapper .col-xl-3,.bootstrap-wrapper .col-xl-4,.bootstrap-wrapper .col-xl-5,.bootstrap-wrapper .col-xl-6,.bootstrap-wrapper .col-xl-7,.bootstrap-wrapper .col-xl-8,.bootstrap-wrapper .col-xl-9,.bootstrap-wrapper .col-xl-auto {
  position: relative;
  width: 100%;
  padding-right: 16px;
  padding-left: 16px
}

.bootstrap-wrapper .col {
  -webkit-flex-basis: 0;
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%
}

.header-github-link:hover {
  opacity: .6
}

.header-github-link:before {
  content: "";
  width: 24px;
  height: 24px;
  display: flex;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/%3E%3C/svg%3E")no-repeat
}

html[data-theme=dark] .header-github-link:before {
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='white' d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/%3E%3C/svg%3E")no-repeat
}

.header-contribute-link:hover {
  opacity: 0.6;
}

.header-contribute-link:before {
  content: "";
  width: 24px;
  height: 24px;
  display: flex;
  background: url("/static/svg/wrench-24px-dark.svg") no-repeat;
}

@media (max-width: 1060px) and (min-width: 997px) {
  .header-contribute-link:before, .header-github-link:before {
    width: 20px;
    height: 20px;
    background-size: contain;
  }

  .navbar__items .clean-btn svg {
    width: 20px;
    height: 20px;
  }

  .navbar__items [class^="toggle"] {
    width: 20px !important;
    height: 20px !important;
  }
  
  .navbar__items [class^="navbarSearchContainer"] {
    padding-left: 6px;
  }
}


html[data-theme=dark] .header-contribute-link:before {
  background: url("/static/svg/wrench-24px-light.svg") no-repeat;
  background-size: contain;
}

.bootstrap-wrapper .col-auto {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  width: auto;
  max-width: 100%
}

.bootstrap-wrapper .col-1 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 8.3333333333%;
  -ms-flex: 0 0 8.3333333333%;
  flex: 0 0 8.3333333333%;
  max-width: 8.3333333333%
}

.bootstrap-wrapper .col-2 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 16.6666666667%;
  -ms-flex: 0 0 16.6666666667%;
  flex: 0 0 16.6666666667%;
  max-width: 16.6666666667%
}

.bootstrap-wrapper .col-3 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 25%;
  -ms-flex: 0 0 25%;
  flex: 0 0 25%;
  max-width: 25%
}

.bootstrap-wrapper .col-4 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 33.3333333333%;
  -ms-flex: 0 0 33.3333333333%;
  flex: 0 0 33.3333333333%;
  max-width: 33.3333333333%
}

.bootstrap-wrapper .col-5 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 41.6666666667%;
  -ms-flex: 0 0 41.6666666667%;
  flex: 0 0 41.6666666667%;
  max-width: 41.6666666667%
}

.bootstrap-wrapper .col-6 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 50%;
  -ms-flex: 0 0 50%;
  flex: 0 0 50%;
  max-width: 50%
}

.bootstrap-wrapper .col-7 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 58.3333333333%;
  -ms-flex: 0 0 58.3333333333%;
  flex: 0 0 58.3333333333%;
  max-width: 58.3333333333%
}

.bootstrap-wrapper .col-8 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 66.6666666667%;
  -ms-flex: 0 0 66.6666666667%;
  flex: 0 0 66.6666666667%;
  max-width: 66.6666666667%
}

.bootstrap-wrapper .col-9 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 75%;
  -ms-flex: 0 0 75%;
  flex: 0 0 75%;
  max-width: 75%
}

.bootstrap-wrapper .col-10 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 83.3333333333%;
  -ms-flex: 0 0 83.3333333333%;
  flex: 0 0 83.3333333333%;
  max-width: 83.3333333333%
}

.bootstrap-wrapper .col-11 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 91.6666666667%;
  -ms-flex: 0 0 91.6666666667%;
  flex: 0 0 91.6666666667%;
  max-width: 91.6666666667%
}

.bootstrap-wrapper .col-12 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 100%;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%
}

@media (min-width:576px) {
  .bootstrap-wrapper .col-sm {
    -webkit-flex-basis: 0;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%
  }

  .bootstrap-wrapper .col-sm-auto {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 auto;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: auto;
    max-width: 100%
  }

  .bootstrap-wrapper .col-sm-1 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 8.3333333333%;
    -ms-flex: 0 0 8.3333333333%;
    flex: 0 0 8.3333333333%;
    max-width: 8.3333333333%
  }

  .bootstrap-wrapper .col-sm-2 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 16.6666666667%;
    -ms-flex: 0 0 16.6666666667%;
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%
  }

  .bootstrap-wrapper .col-sm-3 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 25%;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%
  }

  .bootstrap-wrapper .col-sm-4 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 33.3333333333%;
    -ms-flex: 0 0 33.3333333333%;
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%
  }

  .bootstrap-wrapper .col-sm-5 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 41.6666666667%;
    -ms-flex: 0 0 41.6666666667%;
    flex: 0 0 41.6666666667%;
    max-width: 41.6666666667%
  }

  .bootstrap-wrapper .col-sm-6 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 50%;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%
  }

  .bootstrap-wrapper .col-sm-7 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 58.3333333333%;
    -ms-flex: 0 0 58.3333333333%;
    flex: 0 0 58.3333333333%;
    max-width: 58.3333333333%
  }

  .bootstrap-wrapper .col-sm-8 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 66.6666666667%;
    -ms-flex: 0 0 66.6666666667%;
    flex: 0 0 66.6666666667%;
    max-width: 66.6666666667%
  }

  .bootstrap-wrapper .col-sm-9 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 75%;
    -ms-flex: 0 0 75%;
    flex: 0 0 75%;
    max-width: 75%
  }

  .bootstrap-wrapper .col-sm-10 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 83.3333333333%;
    -ms-flex: 0 0 83.3333333333%;
    flex: 0 0 83.3333333333%;
    max-width: 83.3333333333%
  }

  .bootstrap-wrapper .col-sm-11 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 91.6666666667%;
    -ms-flex: 0 0 91.6666666667%;
    flex: 0 0 91.6666666667%;
    max-width: 91.6666666667%
  }

  .bootstrap-wrapper .col-sm-12 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 100%;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%
  }
}

@media (min-width:768px) {
  .bootstrap-wrapper .col-md {
    -webkit-flex-basis: 0;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%
  }

  .bootstrap-wrapper .col-md-auto {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 auto;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: auto;
    max-width: 100%
  }

  .bootstrap-wrapper .col-md-1 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 8.3333333333%;
    -ms-flex: 0 0 8.3333333333%;
    flex: 0 0 8.3333333333%;
    max-width: 8.3333333333%
  }

  .bootstrap-wrapper .col-md-2 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 16.6666666667%;
    -ms-flex: 0 0 16.6666666667%;
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%
  }

  .bootstrap-wrapper .col-md-3 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 25%;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%
  }

  .bootstrap-wrapper .col-md-4 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 33.3333333333%;
    -ms-flex: 0 0 33.3333333333%;
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%
  }

  .bootstrap-wrapper .col-md-5 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 41.6666666667%;
    -ms-flex: 0 0 41.6666666667%;
    flex: 0 0 41.6666666667%;
    max-width: 41.6666666667%
  }

  .bootstrap-wrapper .col-md-6 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 50%;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%
  }

  .bootstrap-wrapper .col-md-7 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 58.3333333333%;
    -ms-flex: 0 0 58.3333333333%;
    flex: 0 0 58.3333333333%;
    max-width: 58.3333333333%
  }

  .bootstrap-wrapper .col-md-8 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 66.6666666667%;
    -ms-flex: 0 0 66.6666666667%;
    flex: 0 0 66.6666666667%;
    max-width: 66.6666666667%
  }

  .bootstrap-wrapper .col-md-9 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 75%;
    -ms-flex: 0 0 75%;
    flex: 0 0 75%;
    max-width: 75%
  }

  .bootstrap-wrapper .col-md-10 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 83.3333333333%;
    -ms-flex: 0 0 83.3333333333%;
    flex: 0 0 83.3333333333%;
    max-width: 83.3333333333%
  }

  .bootstrap-wrapper .col-md-11 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 91.6666666667%;
    -ms-flex: 0 0 91.6666666667%;
    flex: 0 0 91.6666666667%;
    max-width: 91.6666666667%
  }

  .bootstrap-wrapper .col-md-12 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 100%;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%
  }
}

@media (min-width:992px) {
  .bootstrap-wrapper .col-lg {
    -webkit-flex-basis: 0;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%
  }

  .bootstrap-wrapper .col-lg-auto {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 auto;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: auto;
    max-width: 100%
  }

  .bootstrap-wrapper .col-lg-1 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 8.3333333333%;
    -ms-flex: 0 0 8.3333333333%;
    flex: 0 0 8.3333333333%;
    max-width: 8.3333333333%
  }

  .bootstrap-wrapper .col-lg-2 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 16.6666666667%;
    -ms-flex: 0 0 16.6666666667%;
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%
  }

  .bootstrap-wrapper .col-lg-3 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 25%;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%
  }

  .bootstrap-wrapper .col-lg-4 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 33.3333333333%;
    -ms-flex: 0 0 33.3333333333%;
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%
  }

  .bootstrap-wrapper .col-lg-5 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 41.6666666667%;
    -ms-flex: 0 0 41.6666666667%;
    flex: 0 0 41.6666666667%;
    max-width: 41.6666666667%
  }

  .bootstrap-wrapper .col-lg-6 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 50%;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%
  }

  .bootstrap-wrapper .col-lg-7 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 58.3333333333%;
    -ms-flex: 0 0 58.3333333333%;
    flex: 0 0 58.3333333333%;
    max-width: 58.3333333333%
  }

  .bootstrap-wrapper .col-lg-8 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 66.6666666667%;
    -ms-flex: 0 0 66.6666666667%;
    flex: 0 0 66.6666666667%;
    max-width: 66.6666666667%
  }

  .bootstrap-wrapper .col-lg-9 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 75%;
    -ms-flex: 0 0 75%;
    flex: 0 0 75%;
    max-width: 75%
  }

  .bootstrap-wrapper .col-lg-10 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 83.3333333333%;
    -ms-flex: 0 0 83.3333333333%;
    flex: 0 0 83.3333333333%;
    max-width: 83.3333333333%
  }

  .bootstrap-wrapper .col-lg-11 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 91.6666666667%;
    -ms-flex: 0 0 91.6666666667%;
    flex: 0 0 91.6666666667%;
    max-width: 91.6666666667%
  }

  .bootstrap-wrapper .col-lg-12 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 100%;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%
  }
}

@media (min-width:1200px) {
  .bootstrap-wrapper .col-xl {
    -webkit-flex-basis: 0;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%
  }

  .bootstrap-wrapper .col-xl-auto {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 auto;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: auto;
    max-width: 100%
  }

  .bootstrap-wrapper .col-xl-1 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 8.3333333333%;
    -ms-flex: 0 0 8.3333333333%;
    flex: 0 0 8.3333333333%;
    max-width: 8.3333333333%
  }

  .bootstrap-wrapper .col-xl-2 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 16.6666666667%;
    -ms-flex: 0 0 16.6666666667%;
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%
  }

  .bootstrap-wrapper .col-xl-3 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 25%;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%
  }

  .bootstrap-wrapper .col-xl-4 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 33.3333333333%;
    -ms-flex: 0 0 33.3333333333%;
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%
  }

  .bootstrap-wrapper .col-xl-5 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 41.6666666667%;
    -ms-flex: 0 0 41.6666666667%;
    flex: 0 0 41.6666666667%;
    max-width: 41.6666666667%
  }

  .bootstrap-wrapper .col-xl-6 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 50%;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%
  }

  .bootstrap-wrapper .col-xl-7 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 58.3333333333%;
    -ms-flex: 0 0 58.3333333333%;
    flex: 0 0 58.3333333333%;
    max-width: 58.3333333333%
  }

  .bootstrap-wrapper .col-xl-8 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 66.6666666667%;
    -ms-flex: 0 0 66.6666666667%;
    flex: 0 0 66.6666666667%;
    max-width: 66.6666666667%
  }

  .bootstrap-wrapper .col-xl-9 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 75%;
    -ms-flex: 0 0 75%;
    flex: 0 0 75%;
    max-width: 75%
  }

  .bootstrap-wrapper .col-xl-10 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 83.3333333333%;
    -ms-flex: 0 0 83.3333333333%;
    flex: 0 0 83.3333333333%;
    max-width: 83.3333333333%
  }

  .bootstrap-wrapper .col-xl-11 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 91.6666666667%;
    -ms-flex: 0 0 91.6666666667%;
    flex: 0 0 91.6666666667%;
    max-width: 91.6666666667%
  }

  .bootstrap-wrapper .col-xl-12 {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 100%;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%
  }
}

.d-flex {
  display: flex!important
}

.banner {
  border-radius: 12px;
  width: 100%;
  height: 100%;
  padding: 40px
}

.banner .icon-wrapper {
  width: 100%;
  height: 62px;
  padding: 0
}

.banner .icon-wrapper .icon {
  height: 58px;
  width: 62px
}

.details {
  margin-left: 12px
}

.banner .title {
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -.02em;
  color: #061024
}

.banner .description {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #3b465c
}

.show-card {
  background: #f7f9fb;
  border-radius: 24px;
  width: 100%;
  height: 100%;
  padding: 28px 32px;
  transition: all .3s;
  position: relative
}

.icon-wrapper .icon {
  height: 62px
}

.show-card .title {
  margin-top: 24px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -.02em;
  color: #061024
}

.show-card .descriptions {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #3b465c
}

[data-theme=light] .show-card:hover {
  background: #f0f4f8
}

[data-theme=dark] .show-card {
  background: #2d2d32
}

.navbar__search-input::placeholder {
  color: #728a96
}

[data-theme=dark] .navbar__search-input::placeholder {
  color: #acacaf
}

[data-theme=dark] .show-card .status {
  color: #727887
}

[data-theme=dark] .show-card .descriptions,[data-theme=dark] .show-card .title {
  color: #fff
}

.pt-40 {
  padding-top: 40px!important
}

.p-8 {
  padding: 8px
}

.background-img {
  position: absolute
}

.background-img.right {
  right: 0;
  top: 0
}

.background-img.left {
  left: 0;
  bottom: 0
}

header>h1 {
  font-size: 2rem!important
}

strong {
  font-weight: 700
}

.btn {
  cursor: pointer;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 20px;
  border: 0;
  outline: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,.08)
}

.btn-primary {
  background-color: var(--ifm-color-primary-darker);
  color: #fff
}

.mx-4 {
  margin: 0 4px
}

.show-card .status {
  font-size: .8rem;
  position: absolute;
  top: 20px;
  color: #3b465c;
  right: 20px;
  padding: 5px 10px;
  border-radius: 10px;
  -webkit-transition: color 2s;
  transition: color 2s
}

.show-card .status:hover {
  color: #003cb2
}

h3.cmp-func-tolk-header {
  display: block;
  font-weight: bold;
  font-size: 120%;
  margin: 3em 0 1em;
  color: #0000CC;
}

h3.cmp-func-tolk-header code {
  font-size: 100% !important;
}

[data-theme=dark] h3.cmp-func-tolk-header {
  color: #d1fff7;
}

table.cmp-func-tolk-table thead tr {
  --ifm-table-background: #e9e9e9;
  --ifm-table-border-color: #c0c0c0;
}

table.cmp-func-tolk-table tbody tr {
  --ifm-table-background: #f9f9f9;
  --ifm-table-stripe-background: #f9f9f9;
  --ifm-table-border-color: #b0b0b0;
  vertical-align: top;
}

[data-theme=dark] table.cmp-func-tolk-table thead tr {
  --ifm-table-background: transparent;
  --ifm-table-border-color: #606060;
}

[data-theme=dark] table.cmp-func-tolk-table tbody tr {
  --ifm-table-background: #0f0f0f;
  --ifm-table-stripe-background: #0f0f0f;
  --ifm-table-border-color: #606060;
}

table.cmp-func-tolk-table:not(.different-col-widths) th {
  width: 50%;
}

table.cmp-func-tolk-table code:not(.inline) {
  display: block;
  padding: 0 3px;
  background: transparent;
  border: transparent;
}

.markdown a {
  font-weight: 500
}
a{
  color: #0088CC;
}
a:hover {
  color: #0099E5
}
article a{
  background-color: rgba(0,136,204,.05);
  border-bottom: 0.75px rgb(0 136 204 / 60%) solid;
}

.theme-edit-this-page{
  display: inline-flex;
  max-width: max-content;
}

[data-theme=dark] article a {
  background-color: rgba(0,136,204, 0.15);
}
[data-theme=dark] a:hover {
  color: #04A2F0
}

[data-theme=dark] .navbar a:hover,[data-theme=dark] a:hover {
  color: #04a2f0
}

.DocsMarkdown--button-group-content {
  display: flex;
  flex-wrap: wrap;
  margin: -.375em
}

.DocsMarkdown--button-group-content>a,.DocsMarkdown--button-group-content>button {
  margin: .375em
}

html[theme=light] {
  --gray-0-rgb: 29, 31, 32;
  --gray-0: rgb(var(--gray-0-rgb));
  --color-rgb: var(--gray-0-rgb);
  --color: rgb(var(--color-rgb));
  --background-color-rgb: 255, 255, 255;
  --background-color: rgb(var(--background-color-rgb));
  --selection-background-color: var(--ifm-color-primary-darkest);
  --selection-color: #fff;
  --code-block-color: #fff;
  --code-block-background-color: var(--color);
  --code-block-background-color-light-theme: var(--gray-9);
  --code-block-scrollbar-color: hsla(0, 0%, 100%, 0.25);
  --tab-background-color: var(--ifm-color-primary-darkest);
  --shadow-color-rgb: var(--color-rgb);
  --section-tiger-stripe-background-color: var(--gray-9);
  --deemphasized-color: var(--gray-1)
}

.Button {
  cursor: pointer;
  display: inline-block;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  position: relative;
  border: 0;
  background: 0 0;
  color: inherit;
  margin-right: 10px;
  line-height: var(--button-line-height);
  padding: var(--button-top-padding) var(--button-horizontal-padding) var(--button-bottom-padding);
  border-radius: var(--button-border-radius);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  --active-box-shadow-color: transparent;
  --active-box-shadow: inset 0 0.0625em 0.1875em var(--active-box-shadow-color);
  --active-overlay-box-shadow-color: transparent;
  --active-overlay-box-shadow: inset 0 0 0 9999em var(--active-overlay-box-shadow-color);
  --hover-box-shadow-color: transparent;
  --hover-box-shadow: inset 0 0 0 9999em var(--hover-box-shadow-color);
  --focus-box-shadow: 0 0 0 var(--focus-size) var(--focus-color);
  --border-color: transparent;
  --border-box-shadow: inset 0 0 0 1px var(--border-color);
  --shadow-box-shadow: 0 1px 1px rgba(var(--shadow-color-rgb), 0.075),
  0 0.1333em 0.26667em rgba(var(--shadow-color-rgb), 0.075),
  0 0.2222em 0.66667em 0 rgba(var(--shadow-color-rgb), 0.075),
  0 0.4444em 1.3333em 0 rgba(var(--shadow-color-rgb), 0.075);
  --box-shadow: 0 0 0 0 transparent;
  box-shadow: var(--active-box-shadow),var(--active-overlay-box-shadow),var(--hover-box-shadow),var(--focus-box-shadow),var(--border-box-shadow),var(--box-shadow);
  --box-shadow-transition-duration: 0.3s!important;
  transition: all .2s ease!important
}

.Button[disabled] {
  cursor: not-allowed;
  opacity: .5
}

@media (hover:hover) {
  .Button:hover {
    --hover-box-shadow-color: hsla(0, 0%, 100%, 0.2)
  }

  [theme=dark] .Button:hover {
    --hover-box-shadow-color: hsla(0, 0%, 100%, 0.05)
  }
}

.Button:not([disabled]):active {
  --box-shadow-transition-duration: 0s;
  --hover-box-shadow-color: transparent;
  --box-shadow: 0 0 0 0 transparent;
  --active-overlay-box-shadow-color: rgba(0, 0, 0, 0.08);
  --active-box-shadow-color: rgba(0, 0, 0, 0.2)
}

@media (hover:none) {
  .Button:not([disabled]):active {
    --active-overlay-box-shadow-color: rgba(0, 0, 0, 0.3)
  }
}

[js-focus-visible-polyfill-available] .Button:focus {
  outline: 0
}

.Button[is-focus-visible] {
  --box-shadow-transition-duration: 0s
}

.Button:not([is-focus-visible]) {
  --focus-size: 0
}

@-moz-document url-prefix() {
  .Button:not([is-focus-visible]) {
    --focus-color: transparent
  }
}

.Button-is-docs-primary {
  background: var(--ifm-color-primary-light)!important;
  color: #fff;
  border: 0!important
}

.Button-is-docs-primary:hover {
  color: #fff!important;
  background: var(--ifm-color-primary)!important
}

.Button-is-docs-primary:active {
  color: #fff!important;
  background: var(--ifm-color-primary-darkest)!important
}

[data-theme=dark] .Button-is-docs-primary {
  background: 0 0!important;
  border: 1px solid var(--ifm-color-primary)!important;
  color: #fff
}

[data-theme=dark] .Button-is-docs-primary:hover {
  color: #fff!important;
  border: 1px solid var(--ifm-color-primary-lightest)!important;
  background: rgba(49,149,231,.1)!important
}

[data-theme=dark] .Button-is-docs-primary:active {
  color: #fff!important;
  border: 1px solid var(--ifm-color-primary-dark)!important
}

.Button-is-docs-secondary {
  background: rgba(var(--gray-9-rgb),.7)!important;
  border: 1px solid var(--gray-7)!important
}

.Button-is-docs-secondary:hover {
  background: rgba(var(--gray-9-rgb),.9)!important;
  color: inherit;
  border: 1px solid var(--gray-6)!important
}

.Button-is-docs-secondary:active {
  background: rgba(var(--gray-7-rgb),.7)!important;
  color: inherit!important
}

[data-theme=dark] .Button-is-docs-secondary {
  background: 0 0!important;
  border: 1px solid var(--gray-7)!important
}

[data-theme=dark] .Button-is-docs-secondary:hover {
  color: inherit;
  background: rgba(77,77,77,.3)!important;
  border: 1px solid var(--gray-9)!important
}

[data-theme=dark] .Button-is-docs-secondary:active {
  background: rgba(var(--gray-7-rgb),.7)!important;
  color: inherit!important
}

.table-of-contents__left-border {
  border-left: .5px solid var(--ifm-toc-border-color)!important
}

.theme-doc-sidebar-container {
  border-right: .5px solid var(--ifm-toc-border-color)!important
}

a,button {
  transition: all .3s!important
}

.NetworkIcon--large {
  display: block!important
}

.navbar a:hover {
  color: #0099e5;
  background: unset;
  opacity: unset!important
}

.navbar .clean-btn:hover,.navbar .header-github-link:hover {
  opacity: .3;
  background: unset
}

.navbar__search-input {
  transition: all .3s;
  border: 0;
  box-shadow: none;
  outline: 1px solid transparent!important
}

.navbar__brand {
  margin-right: 0;
}

.navbar__logo {
  display: flex;
  align-items: center;
}

.navbar__logo img {
  height: initial;
}

@media (max-width: 1280px) {
  .navbar__logo img {
    width: 73px;
    height: 24px;
  }
}

[class*=focused_node_modules] input {
  border: 0;
  box-shadow: none;
  outline-color: #08c!important
}

[data-theme=dark] [class*=focused_node_modules] input {
  outline-color: #01a4f5!important
}

[data-theme=dark] .navbar__search-input {
  outline-color: #01a4f5
}

[data-theme=light] {
  --ifm-footer-background-color: white
}

[data-theme=dark] {
  --ifm-footer-background-color: #232328
}

[data-theme=dark] .Logo--dark,[data-theme=dark] .table-of-contents>li>.table-of-contents__link,[data-theme=dark] .theme-doc-sidebar-item-link b {
  color: #fff
}

[id="Get Started"] a:hover {
  opacity: unset
}

[data-theme=dark] [id="Get Started"] a:hover .show-card {
  background: #36363c;
  box-shadow: none
}

.container,[role=banner]>div {
  padding: 0
}

.show-card .icon-wrapper {
  width: 48px;
  height: 48px
}

.show-card .icon-wrapper img {
  width: 100%;
  height: 100%
}

.bootstrap-wrapper h1:first-of-type,.markdown h1:first-of-type {
  font-weight: 700!important;
  font-size: 56px!important;
  line-height: 64px!important
}

.bootstrap-wrapper h1:first-of-type span:first-of-type,[role=banner] span:first-of-type {
  display: none
}

@media (max-width:577px) {
  body {
    --ifm-heading-margin-bottom: 0px;
    --ifm-paragraph-margin-bottom: 40px
  }

  .bootstrap-wrapper h1:first-of-type {
    line-height: 54px!important
  }
}

@media (min-width:577px) {
  .bootstrap-wrapper h1:first-of-type span:first-of-type {
    display: inline
  }
}

@media (max-width:576px) {
  .bootstrap-wrapper h1:first-of-type,.markdown h1:first-of-type {
    font-size: 32px!important;
    line-height: 40px!important
  }
}

.bootstrap-wrapper p:first-of-type {
  color: #728a96
}

[data-theme=dark] .bootstrap-wrapper p:first-of-type {
  color: #acacaf
}

.menu__link--sublist-caret:after {
  background: url(/static/img/arrow.svg);
  background-position: center center;
  transform: rotate(270deg)
}

li::marker {
  color: #08c
}

img {
  border-radius: 24px
}

a img,button img {
  border-radius: 0
}

.theme-doc-sidebar-item-link b {
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  transition: .3s all;
  color: #111
}

.menu__list-item-collapsible a {
  font-weight: 400;
  font-size: 18px;
  line-height: 28px
}

.menu__list-item-collapsible:hover {
  background: #f7f9fb
}
.menu__link{
  --ifm-menu-color-background-hover: transparent;
}
.theme-doc-sidebar-item-link b{
  font-size: 22px;
}
[data-theme=dark] .menu__list-item-collapsible:hover {
  background: #2d2d32
}

.table-of-contents>li:hover>.table-of-contents__link {
  color: #0099e5
}

[data-theme=ligth] .menu__list-item-collapsible a,[data-theme=ligth] .table-of-contents__link {
  color: #111
}

.table-of-contents>li>.table-of-contents__link {
  font-size: 16px;
  line-height: 24px;
  color: #111
}

.navbar-sidebar {
  margin-top: 0
}

[role=banner] {
  background-image: url(/static/img/banner-bg.svg),linear-gradient(90deg,#9997f3 -.76%,#69aeff 93.89%)!important;
  background-repeat: no-repeat;
  background-position: center center;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  min-height: 44px
}

@media (max-width:577px) {
  [role=banner] {
    min-height: 34px
  }
}

.mobile-view {
  display: none
}

[role=banner] a:hover {
  opacity: .7;
  color: unset
}

@media (min-width:577px) {
  [role=banner] span:first-of-type {
    display: inline
  }
}

@media (max-width:576px) {
  .mobile-view {
    display: inline
  }
}

[role=banner] a {
  text-decoration: none!important
}

[role=banner] a span {
  position: relative
}

[role=banner] a span::after {
  content: "";
  position: absolute;
  top: -2px;
  right: -18px;
  width: 18px;
  height: 18px;
  color: red;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguNzAzNjEgOC43MDI4MkM4LjMxMzgzIDguMzEzMDMgOC4zMTU5NSA3LjY3ODkzIDguNzAzOTIgNy4yOTA5N0w4Ljc5MTc2IDcuMjAzMTJDOS4xODE3MiA2LjgxMzE2IDkuODExMzUgNi44MTA1NSAxMC4yMDU4IDcuMjA1MDNMMTUuMjg5OSAxMi4yODkxQzE1LjY4MDkgMTIuNjgwMSAxNS42ODQzIDEzLjMxMDYgMTUuMjg5OSAxMy43MDVMMTAuMjA1OCAxOC43ODkxQzkuODE0ODIgMTkuMTgwMSA5LjE3OTczIDE5LjE3ODkgOC43OTE3NiAxOC43OTFMOC43MDM5MiAxOC43MDMxQzguMzEzOTYgMTguMzEzMiA4LjMxMDYxIDE3LjY4NDMgOC43MDM2MSAxNy4yOTEzTDEyLjk5NzggMTIuOTk3TDguNzAzNjEgOC43MDI4MloiIGZpbGw9IiNGM0YzRjYiLz4KPC9zdmc+Cg==);
  background-size: contain
}

.alert{
  --ifm-link-color: var(--ifm-color-primary);
}

.player-wrapper {
  position: relative;
  padding-top: 56.25%; /* 720 / 1280 = 0.5625 */
}

.react-player {
  position: absolute;
  top: 0;
  left: 0;
}

.button--primary, .button--secondary{
  border-radius: 40px;
  margin-right: 10px;
}

.button--primary > p,
.button--secondary > p {
  margin-bottom: 0;
}

.button--primary{

}
.button--secondary{
  border: none;
}

[data-theme=light] .button--primary  {
  background-color: #0088CC;
  color: #FFF;
}

[data-theme=light] .button--primary:hover  {
  background-color: #0099e5;
  color: #FFF;
}

[data-theme=dark] .button--primary  {
  background-color: #0088CC;
  color: #FFF;
}

[data-theme=dark] .button--primary:hover  {
  background-color: #00AAFF;
  color: #FFF;
}

[data-theme=light] .button--secondary  {
  background-color: #F7F9FB;
  color: #04060B;
}

[data-theme=light] .button--secondary:hover  {
  background-color: #F0F4F8;
  color: #04060B;
}

[data-theme=dark] .button--secondary  {
  background-color: #2D2D32;
  color: #FFFFFF;
}

[data-theme=dark] .button--secondary:hover  {
  background-color: #36363C;
  color: #FFFFFF;
}
.button--sm {
  --ifm-button-size-multiplier: 1.1 !important;
}

.navbar__item {
  flex-shrink: 0;
}

@media (max-width: 1560px) {
  .navbar__item {
    font-size: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }
}

@media (max-width: 1380px) {
  .navbar__item {
    font-size: 14px;
    padding-left: 6px;
    padding-right: 6px;
  }

  .navbar__item .navbar__link::after {
    margin-left: 2px;
    border-width: 0.25em 0.25em 0;
    top: 0;
  }
}

@media (max-width: 1380px) {
  .DocSearch .DocSearch-Button-Keys {
    display: none;  
  }

  .DocSearch-Button-Placeholder {
    display: none;
  }
}

@media (max-width: 1060px) and (min-width: 997px) {
  .navbar {
    padding-left: 10px;
    padding-right: 10px;
  }
}



================================================
FILE: src/data/features.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/features.js
================================================
export const firstRow = [
  {
    title: "What is TON?",
    linkUrl: "/v3/concepts/dive-into-ton/introduction",
    imageUrl: "img/mainPageCards/what_is_ton.svg",
    description: "Learn about the basics of blockchain and TON and how to get started."
  },
  {
    title: "Documents",
    linkUrl: "/v3/documentation/ton-documentation",
    imageUrl: "img/mainPageCards/developer.svg",
    description: "Learn all the technical aspects of TON."
  },
  {
    title: "Guidelines",
    linkUrl: "/v3/guidelines/quick-start/getting-started",
    imageUrl: "img/mainPageCards/participate.svg",
    description: "Build smart contracts, web applications or bots using TON."
  },
  // {
  //   title: "Participate",
  //   linkUrl: "/participate/",
  //   imageUrl: "img/mainPageCards/participate.svg",
  //   description: "Take part in TON by staking, running node or even become a Validator!"
  // },
  // {
  //   title: "Integrator",
  //   status: "Intermediate",
  //   linkUrl: "/integrate/quickstart",
  //   imageUrl: "img/logo.svg",
  //   description: "Integrate an application, tool, wallet, oracle, and more with Polygon."
  // },
];




================================================
FILE: src/data/opcodes/app_specific.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/app_specific.json
================================================
[
  {
    "name": "ACCEPT",
    "alias_of": "",
    "tlb": "#F800",
    "doc_category": "app_gas",
    "doc_opcode": "F800",
    "doc_fift": "ACCEPT",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Sets current gas limit `g_l` to its maximal allowed value `g_m`, and resets the gas credit `g_c` to zero, decreasing the value of `g_r` by `g_c` in the process.\nIn other words, the current smart contract agrees to buy some gas to finish the current transaction. This action is required to process external messages, which bring no value (hence no gas) with themselves."
  },
  {
    "name": "SETGASLIMIT",
    "alias_of": "",
    "tlb": "#F801",
    "doc_category": "app_gas",
    "doc_opcode": "F801",
    "doc_fift": "SETGASLIMIT",
    "doc_stack": "g -",
    "doc_gas": 26,
    "doc_description": "Sets current gas limit `g_l` to the minimum of `g` and `g_m`, and resets the gas credit `g_c` to zero. If the gas consumed so far (including the present instruction) exceeds the resulting value of `g_l`, an (unhandled) out of gas exception is thrown before setting new gas limits. Notice that `SETGASLIMIT` with an argument `g >= 2^63-1` is equivalent to `ACCEPT`."
  },
  {
    "name": "COMMIT",
    "alias_of": "",
    "tlb": "#F80F",
    "doc_category": "app_gas",
    "doc_opcode": "F80F",
    "doc_fift": "COMMIT",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Commits the current state of registers `c4` (“persistent data'') and `c5` (“actions'') so that the current execution is considered “successful'' with the saved values even if an exception is thrown later."
  },
  {
    "name": "RANDU256",
    "alias_of": "",
    "tlb": "#F810",
    "doc_category": "app_rnd",
    "doc_opcode": "F810",
    "doc_fift": "RANDU256",
    "doc_stack": "- x",
    "doc_gas": "26+|c7|+|c1_1|",
    "doc_description": "Generates a new pseudo-random unsigned 256-bit _Integer_ `x`. The algorithm is as follows: if `r` is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its `sha512(r)` is computed; the first 32 bytes of this hash are stored as the new value `r'` of the random seed, and the remaining 32 bytes are returned as the next random value `x`."
  },
  {
    "name": "RAND",
    "alias_of": "",
    "tlb": "#F811",
    "doc_category": "app_rnd",
    "doc_opcode": "F811",
    "doc_fift": "RAND",
    "doc_stack": "y - z",
    "doc_gas": "26+|c7|+|c1_1|",
    "doc_description": "Generates a new pseudo-random integer `z` in the range `0...y-1` (or `y...-1`, if `y<0`). More precisely, an unsigned random value `x` is generated as in `RAND256U`; then `z:=floor(x*y/2^256)` is computed.\nEquivalent to `RANDU256` `256 MULRSHIFT`."
  },
  {
    "name": "SETRAND",
    "alias_of": "",
    "tlb": "#F814",
    "doc_category": "app_rnd",
    "doc_opcode": "F814",
    "doc_fift": "SETRAND",
    "doc_stack": "x -",
    "doc_gas": "26+|c7|+|c1_1|",
    "doc_description": "Sets the random seed to unsigned 256-bit _Integer_ `x`."
  },
  {
    "name": "ADDRAND",
    "alias_of": "",
    "tlb": "#F815",
    "doc_category": "app_rnd",
    "doc_opcode": "F815",
    "doc_fift": "ADDRAND\nRANDOMIZE",
    "doc_stack": "x -",
    "doc_gas": 26,
    "doc_description": "Mixes unsigned 256-bit _Integer_ `x` into the random seed `r` by setting the random seed to `Sha` of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed `r`, and the second with the big-endian representation of `x`."
  },
  {
    "name": "GETPARAM",
    "alias_of": "",
    "tlb": "#F82 i:uint4",
    "doc_category": "app_config",
    "doc_opcode": "F82i",
    "doc_fift": "[i] GETPARAM",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Returns the `i`-th parameter from the _Tuple_ provided at `c7` for `0 <= i <= 15`. Equivalent to `c7 PUSHCTR` `FIRST` `[i] INDEX`.\nIf one of these internal operations fails, throws an appropriate type checking or range checking exception."
  },
  {
    "name": "NOW",
    "alias_of": "GETPARAM",
    "tlb": "#F823",
    "doc_category": "app_config",
    "doc_opcode": "F823",
    "doc_fift": "NOW",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Returns the current Unix time as an _Integer_. If it is impossible to recover the requested value starting from `c7`, throws a type checking or range checking exception as appropriate.\nEquivalent to `3 GETPARAM`."
  },
  {
    "name": "BLOCKLT",
    "alias_of": "GETPARAM",
    "tlb": "#F824",
    "doc_category": "app_config",
    "doc_opcode": "F824",
    "doc_fift": "BLOCKLT",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Returns the starting logical time of the current block.\nEquivalent to `4 GETPARAM`."
  },
  {
    "name": "LTIME",
    "alias_of": "GETPARAM",
    "tlb": "#F825",
    "doc_category": "app_config",
    "doc_opcode": "F825",
    "doc_fift": "LTIME",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Returns the logical time of the current transaction.\nEquivalent to `5 GETPARAM`."
  },
  {
    "name": "RANDSEED",
    "alias_of": "GETPARAM",
    "tlb": "#F826",
    "doc_category": "app_config",
    "doc_opcode": "F826",
    "doc_fift": "RANDSEED",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Returns the current random seed as an unsigned 256-bit _Integer_.\nEquivalent to `6 GETPARAM`."
  },
  {
    "name": "BALANCE",
    "alias_of": "GETPARAM",
    "tlb": "#F827",
    "doc_category": "app_config",
    "doc_opcode": "F827",
    "doc_fift": "BALANCE",
    "doc_stack": "- t",
    "doc_gas": 26,
    "doc_description": "Returns the remaining balance of the smart contract as a _Tuple_ consisting of an _Integer_ (the remaining Gram balance in nanograms) and a _Maybe Cell_ (a dictionary with 32-bit keys representing the balance of “extra currencies'').\nEquivalent to `7 GETPARAM`.\nNote that `RAW` primitives such as `SENDRAWMSG` do not update this field."
  },
  {
    "name": "MYADDR",
    "alias_of": "GETPARAM",
    "tlb": "#F828",
    "doc_category": "app_config",
    "doc_opcode": "F828",
    "doc_fift": "MYADDR",
    "doc_stack": "- s",
    "doc_gas": 26,
    "doc_description": "Returns the internal address of the current smart contract as a _Slice_ with a `MsgAddressInt`. If necessary, it can be parsed further using primitives such as `PARSEMSGADDR` or `REWRITESTDADDR`.\nEquivalent to `8 GETPARAM`."
  },
  {
    "name": "CONFIGROOT",
    "alias_of": "GETPARAM",
    "tlb": "#F829",
    "doc_category": "app_config",
    "doc_opcode": "F829",
    "doc_fift": "CONFIGROOT",
    "doc_stack": "- D",
    "doc_gas": 26,
    "doc_description": "Returns the _Maybe Cell_ `D` with the current global configuration dictionary. Equivalent to `9 GETPARAM `."
  },
  {
    "name": "CONFIGDICT",
    "alias_of": "",
    "tlb": "#F830",
    "doc_category": "app_config",
    "doc_opcode": "F830",
    "doc_fift": "CONFIGDICT",
    "doc_stack": "- D 32",
    "doc_gas": 26,
    "doc_description": "Returns the global configuration dictionary along with its key length (32).\nEquivalent to `CONFIGROOT` `32 PUSHINT`."
  },
  {
    "name": "CONFIGPARAM",
    "alias_of": "",
    "tlb": "#F832",
    "doc_category": "app_config",
    "doc_opcode": "F832",
    "doc_fift": "CONFIGPARAM",
    "doc_stack": "i - c -1 or 0",
    "doc_gas": "",
    "doc_description": "Returns the value of the global configuration parameter with integer index `i` as a _Cell_ `c`, and a flag to indicate success.\nEquivalent to `CONFIGDICT` `DICTIGETREF`."
  },
  {
    "name": "CONFIGOPTPARAM",
    "alias_of": "",
    "tlb": "#F833",
    "doc_category": "app_config",
    "doc_opcode": "F833",
    "doc_fift": "CONFIGOPTPARAM",
    "doc_stack": "i - c^?",
    "doc_gas": "",
    "doc_description": "Returns the value of the global configuration parameter with integer index `i` as a _Maybe Cell_ `c^?`.\nEquivalent to `CONFIGDICT` `DICTIGETOPTREF`."
  },
  {
    "name": "GETGLOBVAR",
    "alias_of": "",
    "tlb": "#F840",
    "doc_category": "app_global",
    "doc_opcode": "F840",
    "doc_fift": "GETGLOBVAR",
    "doc_stack": "k - x",
    "doc_gas": 26,
    "doc_description": "Returns the `k`-th global variable for `0 <= k < 255`.\nEquivalent to `c7 PUSHCTR` `SWAP` `INDEXVARQ`."
  },
  {
    "name": "GETGLOB",
    "alias_of": "",
    "tlb": "#F85_ k:(## 5) {1 <= k}",
    "doc_category": "app_global",
    "doc_opcode": "F85_k",
    "doc_fift": "[k] GETGLOB",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Returns the `k`-th global variable for `1 <= k <= 31`.\nEquivalent to `c7 PUSHCTR` `[k] INDEXQ`."
  },
  {
    "name": "SETGLOBVAR",
    "alias_of": "",
    "tlb": "#F860",
    "doc_category": "app_global",
    "doc_opcode": "F860",
    "doc_fift": "SETGLOBVAR",
    "doc_stack": "x k -",
    "doc_gas": "26+|c7’|",
    "doc_description": "Assigns `x` to the `k`-th global variable for `0 <= k < 255`.\nEquivalent to `c7 PUSHCTR` `ROTREV` `SETINDEXVARQ` `c7 POPCTR`."
  },
  {
    "name": "SETGLOB",
    "alias_of": "",
    "tlb": "#F87_ k:(## 5) {1 <= k}",
    "doc_category": "app_global",
    "doc_opcode": "F87_k",
    "doc_fift": "[k] SETGLOB",
    "doc_stack": "x -",
    "doc_gas": "26+|c7’|",
    "doc_description": "Assigns `x` to the `k`-th global variable for `1 <= k <= 31`.\nEquivalent to `c7 PUSHCTR` `SWAP` `k SETINDEXQ` `c7 POPCTR`."
  },
  {
    "name": "HASHCU",
    "alias_of": "",
    "tlb": "#F900",
    "doc_category": "app_crypto",
    "doc_opcode": "F900",
    "doc_fift": "HASHCU",
    "doc_stack": "c - x",
    "doc_gas": 26,
    "doc_description": "Computes the representation hash of a _Cell_ `c` and returns it as a 256-bit unsigned integer `x`. Useful for signing and checking signatures of arbitrary entities represented by a tree of cells."
  },
  {
    "name": "HASHSU",
    "alias_of": "",
    "tlb": "#F901",
    "doc_category": "app_crypto",
    "doc_opcode": "F901",
    "doc_fift": "HASHSU",
    "doc_stack": "s - x",
    "doc_gas": 526,
    "doc_description": "Computes the hash of a _Slice_ `s` and returns it as a 256-bit unsigned integer `x`. The result is the same as if an ordinary cell containing only data and references from `s` had been created and its hash computed by `HASHCU`."
  },
  {
    "name": "SHA256U",
    "alias_of": "",
    "tlb": "#F902",
    "doc_category": "app_crypto",
    "doc_opcode": "F902",
    "doc_fift": "SHA256U",
    "doc_stack": "s - x",
    "doc_gas": 26,
    "doc_description": "Computes `Sha` of the data bits of _Slice_ `s`. If the bit length of `s` is not divisible by eight, throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`."
  },
  {
    "name": "CHKSIGNU",
    "alias_of": "",
    "tlb": "#F910",
    "doc_category": "app_crypto",
    "doc_opcode": "F910",
    "doc_fift": "CHKSIGNU",
    "doc_stack": "h s k - ?",
    "doc_gas": 26,
    "doc_description": "Checks the Ed25519-signature `s` of a hash `h` (a 256-bit unsigned integer, usually computed as the hash of some data) using public key `k` (also represented by a 256-bit unsigned integer).\nThe signature `s` must be a _Slice_ containing at least 512 data bits; only the first 512 bits are used. The result is `-1` if the signature is valid, `0` otherwise.\nNotice that `CHKSIGNU` is equivalent to `ROT` `NEWC` `256 STU` `ENDC` `ROTREV` `CHKSIGNS`, i.e., to `CHKSIGNS` with the first argument `d` set to 256-bit _Slice_ containing `h`. Therefore, if `h` is computed as the hash of some data, these data are hashed _twice_, the second hashing occurring inside `CHKSIGNS`."
  },
  {
    "name": "CHKSIGNS",
    "alias_of": "",
    "tlb": "#F911",
    "doc_category": "app_crypto",
    "doc_opcode": "F911",
    "doc_fift": "CHKSIGNS",
    "doc_stack": "d s k - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a valid Ed25519-signature of the data portion of _Slice_ `d` using public key `k`, similarly to `CHKSIGNU`. If the bit length of _Slice_ `d` is not divisible by eight, throws a cell underflow exception. The verification of Ed25519 signatures is the standard one, with `Sha` used to reduce `d` to the 256-bit number that is actually signed."
  },
  {
    "name": "CDATASIZEQ",
    "alias_of": "",
    "tlb": "#F940",
    "doc_category": "app_misc",
    "doc_opcode": "F940",
    "doc_fift": "CDATASIZEQ",
    "doc_stack": "c n - x y z -1 or 0",
    "doc_gas": "",
    "doc_description": "Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z` in the dag rooted at _Cell_ `c`, effectively returning the total storage used by this dag taking into account the identification of equal cells. The values of `x`, `y`, and `z` are computed by a depth-first traversal of this dag, with a hash table of visited cell hashes used to prevent visits of already-visited cells. The total count of visited cells `x` cannot exceed non-negative _Integer_ `n`; otherwise the computation is aborted before visiting the `(n+1)`-st cell and a zero is returned to indicate failure. If `c` is _Null_, returns `x=y=z=0`."
  },
  {
    "name": "CDATASIZE",
    "alias_of": "",
    "tlb": "#F941",
    "doc_category": "app_misc",
    "doc_opcode": "F941",
    "doc_fift": "CDATASIZE",
    "doc_stack": "c n - x y z",
    "doc_gas": "",
    "doc_description": "A non-quiet version of `CDATASIZEQ` that throws a cell overflow exception (8) on failure."
  },
  {
    "name": "SDATASIZEQ",
    "alias_of": "",
    "tlb": "#F942",
    "doc_category": "app_misc",
    "doc_opcode": "F942",
    "doc_fift": "SDATASIZEQ",
    "doc_stack": "s n - x y z -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `CDATASIZEQ`, but accepting a _Slice_ `s` instead of a _Cell_. The returned value of `x` does not take into account the cell that contains the slice `s` itself; however, the data bits and the cell references of `s` are accounted for in `y` and `z`."
  },
  {
    "name": "SDATASIZE",
    "alias_of": "",
    "tlb": "#F943",
    "doc_category": "app_misc",
    "doc_opcode": "F943",
    "doc_fift": "SDATASIZE",
    "doc_stack": "s n - x y z",
    "doc_gas": "",
    "doc_description": "A non-quiet version of `SDATASIZEQ` that throws a cell overflow exception (8) on failure."
  },
  {
    "name": "LDGRAMS",
    "alias_of": "",
    "tlb": "#FA00",
    "doc_category": "app_currency",
    "doc_opcode": "FA00",
    "doc_fift": "LDGRAMS\nLDVARUINT16",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads (deserializes) a `Gram` or `VarUInteger 16` amount from _Slice_ `s`, and returns the amount as _Integer_ `x` along with the remainder `s'` of `s`. The expected serialization of `x` consists of a 4-bit unsigned big-endian integer `l`, followed by an `8l`-bit unsigned big-endian representation of `x`.\nThe net effect is approximately equivalent to `4 LDU` `SWAP` `3 LSHIFT#` `LDUX`."
  },
  {
    "name": "LDVARINT16",
    "alias_of": "",
    "tlb": "#FA01",
    "doc_category": "app_currency",
    "doc_opcode": "FA01",
    "doc_fift": "LDVARINT16",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Similar to `LDVARUINT16`, but loads a _signed_ _Integer_ `x`.\nApproximately equivalent to `4 LDU` `SWAP` `3 LSHIFT#` `LDIX`."
  },
  {
    "name": "STGRAMS",
    "alias_of": "",
    "tlb": "#FA02",
    "doc_category": "app_currency",
    "doc_opcode": "FA02",
    "doc_fift": "STGRAMS\nSTVARUINT16",
    "doc_stack": "b x - b'",
    "doc_gas": 26,
    "doc_description": "Stores (serializes) an _Integer_ `x` in the range `0...2^120-1` into _Builder_ `b`, and returns the resulting _Builder_ `b'`. The serialization of `x` consists of a 4-bit unsigned big-endian integer `l`, which is the smallest integer `l>=0`, such that `x<2^(8l)`, followed by an `8l`-bit unsigned big-endian representation of `x`. If `x` does not belong to the supported range, a range check exception is thrown."
  },
  {
    "name": "STVARINT16",
    "alias_of": "",
    "tlb": "#FA03",
    "doc_category": "app_currency",
    "doc_opcode": "FA03",
    "doc_fift": "STVARINT16",
    "doc_stack": "b x - b'",
    "doc_gas": 26,
    "doc_description": "Similar to `STVARUINT16`, but serializes a _signed_ _Integer_ `x` in the range `-2^119...2^119-1`."
  },
  {
    "name": "LDMSGADDR",
    "alias_of": "",
    "tlb": "#FA40",
    "doc_category": "app_addr",
    "doc_opcode": "FA40",
    "doc_fift": "LDMSGADDR",
    "doc_stack": "s - s' s''",
    "doc_gas": 26,
    "doc_description": "Loads from _Slice_ `s` the only prefix that is a valid `MsgAddress`, and returns both this prefix `s'` and the remainder `s''` of `s` as slices."
  },
  {
    "name": "LDMSGADDRQ",
    "alias_of": "",
    "tlb": "#FA41",
    "doc_category": "app_addr",
    "doc_opcode": "FA41",
    "doc_fift": "LDMSGADDRQ",
    "doc_stack": "s - s' s'' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `LDMSGADDR`: on success, pushes an extra `-1`; on failure, pushes the original `s` and a zero."
  },
  {
    "name": "PARSEMSGADDR",
    "alias_of": "",
    "tlb": "#FA42",
    "doc_category": "app_addr",
    "doc_opcode": "FA42",
    "doc_fift": "PARSEMSGADDR",
    "doc_stack": "s - t",
    "doc_gas": 26,
    "doc_description": "Decomposes _Slice_ `s` containing a valid `MsgAddress` into a _Tuple_ `t` with separate fields of this `MsgAddress`. If `s` is not a valid `MsgAddress`, a cell deserialization exception is thrown."
  },
  {
    "name": "PARSEMSGADDRQ",
    "alias_of": "",
    "tlb": "#FA43",
    "doc_category": "app_addr",
    "doc_opcode": "FA43",
    "doc_fift": "PARSEMSGADDRQ",
    "doc_stack": "s - t -1 or 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `PARSEMSGADDR`: returns a zero on error instead of throwing an exception."
  },
  {
    "name": "REWRITESTDADDR",
    "alias_of": "",
    "tlb": "#FA44",
    "doc_category": "app_addr",
    "doc_opcode": "FA44",
    "doc_fift": "REWRITESTDADDR",
    "doc_stack": "s - x y",
    "doc_gas": 26,
    "doc_description": "Parses _Slice_ `s` containing a valid `MsgAddressInt` (usually a `msg_addr_std`), applies rewriting from the `anycast` (if present) to the same-length prefix of the address, and returns both the workchain `x` and the 256-bit address `y` as integers. If the address is not 256-bit, or if `s` is not a valid serialization of `MsgAddressInt`, throws a cell deserialization exception."
  },
  {
    "name": "REWRITESTDADDRQ",
    "alias_of": "",
    "tlb": "#FA45",
    "doc_category": "app_addr",
    "doc_opcode": "FA45",
    "doc_fift": "REWRITESTDADDRQ",
    "doc_stack": "s - x y -1 or 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of primitive `REWRITESTDADDR`."
  },
  {
    "name": "REWRITEVARADDR",
    "alias_of": "",
    "tlb": "#FA46",
    "doc_category": "app_addr",
    "doc_opcode": "FA46",
    "doc_fift": "REWRITEVARADDR",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "A variant of `REWRITESTDADDR` that returns the (rewritten) address as a _Slice_ `s`, even if it is not exactly 256 bit long (represented by a `msg_addr_var`)."
  },
  {
    "name": "REWRITEVARADDRQ",
    "alias_of": "",
    "tlb": "#FA47",
    "doc_category": "app_addr",
    "doc_opcode": "FA47",
    "doc_fift": "REWRITEVARADDRQ",
    "doc_stack": "s - x s' -1 or 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of primitive `REWRITEVARADDR`."
  },
  {
    "name": "SENDRAWMSG",
    "alias_of": "",
    "tlb": "#FB00",
    "doc_category": "app_actions",
    "doc_opcode": "FB00",
    "doc_fift": "SENDRAWMSG",
    "doc_stack": "c x -",
    "doc_gas": 526,
    "doc_description": "Sends a raw message contained in _Cell `c`_, which should contain a correctly serialized object `Message X`, with the only exception that the source address is allowed to have dummy value `addr_none` (to be automatically replaced with the current smart-contract address), and `ihr_fee`, `fwd_fee`, `created_lt` and `created_at` fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter `x` contains the flags. Currently `x=0` is used for ordinary messages; `x=128` is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); `x=64` is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); `x'=x+1` means that the sender wants to pay transfer fees separately; `x'=x+2` means that any errors arising while processing this message during the action phase should be ignored. Finally, `x'=x+32` means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with `+128`."
  },
  {
    "name": "RAWRESERVE",
    "alias_of": "",
    "tlb": "#FB02",
    "doc_category": "app_actions",
    "doc_opcode": "FB02",
    "doc_fift": "RAWRESERVE",
    "doc_stack": "x y -",
    "doc_gas": 526,
    "doc_description": "Creates an output action which would reserve exactly `x` nanograms (if `y=0`), at most `x` nanograms (if `y=2`), or all but `x` nanograms (if `y=1` or `y=3`), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying `x` nanograms (or `b-x` nanograms, where `b` is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit `+2` in `y` means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit `+8` in `y` means `x:=-x` before performing any further actions. Bit `+4` in `y` means that `x` is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently `x` must be a non-negative integer, and `y` must be in the range `0...15`."
  },
  {
    "name": "RAWRESERVEX",
    "alias_of": "",
    "tlb": "#FB03",
    "doc_category": "app_actions",
    "doc_opcode": "FB03",
    "doc_fift": "RAWRESERVEX",
    "doc_stack": "x D y -",
    "doc_gas": 526,
    "doc_description": "Similar to `RAWRESERVE`, but also accepts a dictionary `D` (represented by a _Cell_ or _Null_) with extra currencies. In this way currencies other than Grams can be reserved."
  },
  {
    "name": "SETCODE",
    "alias_of": "",
    "tlb": "#FB04",
    "doc_category": "app_actions",
    "doc_opcode": "FB04",
    "doc_fift": "SETCODE",
    "doc_stack": "c -",
    "doc_gas": 526,
    "doc_description": "Creates an output action that would change this smart contract code to that given by _Cell_ `c`. Notice that this change will take effect only after the successful termination of the current run of the smart contract."
  },
  {
    "name": "SETLIBCODE",
    "alias_of": "",
    "tlb": "#FB06",
    "doc_category": "app_actions",
    "doc_opcode": "FB06",
    "doc_fift": "SETLIBCODE",
    "doc_stack": "c x -",
    "doc_gas": 526,
    "doc_description": "Creates an output action that would modify the collection of this smart contract libraries by adding or removing library with code given in _Cell_ `c`. If `x=0`, the library is actually removed if it was previously present in the collection (if not, this action does nothing). If `x=1`, the library is added as a private library, and if `x=2`, the library is added as a public library (and becomes available to all smart contracts if the current smart contract resides in the masterchain); if the library was present in the collection before, its public/private status is changed according to `x`. Also, `16` can be added to `x` to enable bounce transaction on failure. Values of `x` other than `0...2 (+16 possible)` are invalid."
  },
  {
    "name": "CHANGELIB",
    "alias_of": "",
    "tlb": "#FB07",
    "doc_category": "app_actions",
    "doc_opcode": "FB07",
    "doc_fift": "CHANGELIB",
    "doc_stack": "h x -",
    "doc_gas": 526,
    "doc_description": "Creates an output action similarly to `SETLIBCODE`, but instead of the library code accepts its hash as an unsigned 256-bit integer `h`. If `x!=0` and the library with hash `h` is absent from the library collection of this smart contract, this output action will fail."
  },
  {
    "name": "MYCODE",
    "alias_of": "GETPARAM",
    "tlb": "#F8210",
    "doc_category": "app_config",
    "doc_opcode": "F8210",
    "doc_fift": "MYCODE",
    "doc_stack": "- c",
    "doc_gas": 26,
    "doc_description": "Retrieves code of smart-contract from c7. Equivalent to `10 GETPARAM`."
  },
  {
    "name": "INCOMINGVALUE",
    "alias_of": "GETPARAM",
    "tlb": "#F8211",
    "doc_category": "app_config",
    "doc_opcode": "F8211",
    "doc_fift": "INCOMINGVALUE",
    "doc_stack": "- t",
    "doc_gas": 26,
    "doc_description": "Retrieves value of incoming message from c7.  Equivalent to `11 GETPARAM`."
  },
  {
    "name": "STORAGEFEES",
    "alias_of": "GETPARAM",
    "tlb": "#F8212",
    "doc_category": "app_config",
    "doc_opcode": "F8212",
    "doc_fift": "STORAGEFEES",
    "doc_stack": "- i",
    "doc_gas": 26,
    "doc_description": "Retrieves value of storage phase fees from c7. Equivalent to `12 GETPARAM`."
  },
  {
    "name": "PREVBLOCKSINFOTUPLE",
    "alias_of": "GETPARAM",
    "tlb": "#F8213",
    "doc_category": "app_config",
    "doc_opcode": "F8213",
    "doc_fift": "PREVBLOCKSINFOTUPLE",
    "doc_stack": "- t",
    "doc_gas": 26,
    "doc_description": "Retrives PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` from c7. Equivalent to `13 GETPARAM`."
  },
  {
    "name": "PREVMCBLOCKS",
    "alias_of": "",
    "tlb": "#F83400",
    "doc_category": "app_config",
    "doc_opcode": "F83400",
    "doc_fift": "PREVMCBLOCKS",
    "doc_stack": "- t",
    "doc_gas": 34,
    "doc_description": "Retrives `last_mc_blocks` part of PrevBlocksInfo from c7 (parameter 13)."
  },
  {
    "name": "PREVKEYBLOCK",
    "alias_of": "",
    "tlb": "#F83401",
    "doc_category": "app_config",
    "doc_opcode": "F83401",
    "doc_fift": "PREVKEYBLOCK",
    "doc_stack": "- t",
    "doc_gas": 34,
    "doc_description": "Retrives `prev_key_block` part of PrevBlocksInfo from c7 (parameter 13)."
  },
  {
    "name": "GLOBALID",
    "alias_of": "",
    "tlb": "#F835",
    "doc_category": "app_config",
    "doc_opcode": "F835",
    "doc_fift": "GLOBALID",
    "doc_stack": "- i",
    "doc_gas": 26,
    "doc_description": "Retrieves global_id from 19 network config"
  },
  {
    "name": "GETGASFEE",
    "alias_of": "",
    "tlb": "#F836",
    "doc_category": "app_config",
    "doc_opcode": "F836",
    "doc_fift": "GETGASFEE",
    "doc_stack": "gas_used is_mc - price",
    "doc_gas": "",
    "doc_description": "Calculates gas fee"
  },
  {
    "name": "GETSTORAGEFEE",
    "alias_of": "",
    "tlb": "#F837",
    "doc_category": "app_config",
    "doc_opcode": "F837",
    "doc_fift": "GETSTORAGEFEE",
    "doc_stack": "cells bits seconds is_mc - price",
    "doc_gas": "",
    "doc_description": "Calculates storage fees in nanotons for contract based on current storage prices. `cells` and `bits` are the size of the [AccountState](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) (with deduplication, including root cell)."
  },
  {
    "name": "GETFORWARDFEE",
    "alias_of": "",
    "tlb": "#F838",
    "doc_category": "app_config",
    "doc_opcode": "F838",
    "doc_fift": "GETFORWARDFEE",
    "doc_stack": "cells bits is_mc - price",
    "doc_gas": "",
    "doc_description": "Calculates forward fees in nanotons for outgoing message. `is_mc` is true if the source or the destination is in masterchain, false if both are in basechain. Note, cells and bits in Message should be counted with account for deduplication and root-is-not-counted rules."
  },
  {
    "name": "GETPRECOMPILEDGAS",
    "alias_of": "",
    "tlb": "#F839",
    "doc_category": "app_config",
    "doc_opcode": "F839",
    "doc_fift": "GETPRECOMPILEDGAS",
    "doc_stack": "- x",
    "doc_gas": "",
    "doc_description": "reserved, currently returns null. Will return cost of contract execution in gas units if this contract is precompiled"
  },
  {
    "name": "GETORIGINALFWDFEE",
    "alias_of": "",
    "tlb": "#F83A",
    "doc_category": "app_config",
    "doc_opcode": "F83A",
    "doc_fift": "GETORIGINALFWDFEE",
    "doc_stack": "fwd_fee is_mc - orig_fwd_fee",
    "doc_gas": "",
    "doc_description": "calculate `fwd_fee * 2^16 / first_frac`. Can be used to get the original `fwd_fee` of the message (as replacement for hardcoded values like [this](https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-wallet.fc#L224C17-L224C46)) from `fwd_fee` parsed from incoming message. `is_mc` is true if the source or the destination is in masterchain, false if both are in basechain."
  },
  {
    "name": "GETGASFEESIMPLE",
    "alias_of": "",
    "tlb": "#F83B",
    "doc_category": "app_config",
    "doc_opcode": "F83B",
    "doc_fift": "GETGASFEESIMPLE",
    "doc_stack": "gas_used is_mc - price",
    "doc_gas": "",
    "doc_description": "Same as `GETGASFEE`, but without flat price (just `(gas_used * price) / 2^16)`."
  },
  {
    "name": "GETFORWARDFEESIMPLE",
    "alias_of": "",
    "tlb": "#F83C",
    "doc_category": "app_config",
    "doc_opcode": "F83C",
    "doc_fift": "GETFORWARDFEESIMPLE",
    "doc_stack": "cells bits is_mc - price",
    "doc_gas": "",
    "doc_description": "Calculates additional forward cost in nanotons for message that contains additional `cells` and `bits`. In other words, same as `GETFORWARDFEE`, but without lump price (just `(bits*bit_price + cells*cell_price) / 2^16`)."
  },
  {
    "name": "UNPACKEDCONFIGTUPLE",
    "alias_of": "",
    "tlb": "#F82E",
    "doc_category": "app_config",
    "doc_opcode": "F82E",
    "doc_fift": "UNPACKEDCONFIGTUPLE",
    "doc_stack": "- c",
    "doc_gas": 26,
    "doc_description": "Retrieves tuple of configs slices from c7"
  },
  {
    "name": "DUEPAYMENT",
    "alias_of": "",
    "tlb": "#F82F",
    "doc_category": "app_config",
    "doc_opcode": "F82F",
    "doc_fift": "DUEPAYMENT",
    "doc_stack": "- i",
    "doc_gas": 26,
    "doc_description": "Retrieves value of due payment from c7"
  },
  {
    "name": "GLOBALID",
    "alias_of": "",
    "tlb": "#F835",
    "doc_category": "app_config",
    "doc_opcode": "F835",
    "doc_fift": "GLOBALID",
    "doc_stack": "- i",
    "doc_gas": 26,
    "doc_description": "Now retrieves `ConfigParam 19` from from c7, ton form config dict."
  },
  {
    "name": "SENDMSG",
    "alias_of": "",
    "tlb": "#FB08",
    "doc_category": "app_config",
    "doc_opcode": "FB08",
    "doc_fift": "SENDMSG",
    "doc_stack": "msg mode - i",
    "doc_gas": "",
    "doc_description": "Now retrieves `ConfigParam 24/25` (message prices) and `ConfigParam 43` (`max_msg_cells`) from c7, not from config dict."
  },
  {
    "name": "GASCONSUMED",
    "alias_of": "",
    "tlb": "#F802",
    "doc_category": "app_gas",
    "doc_opcode": "F802",
    "doc_fift": "GASCONSUMED",
    "doc_stack": "- g_c",
    "doc_gas": 26,
    "doc_description": "Returns gas consumed by VM so far (including this instruction)."
  },
  {
    "name": "HASHEXT_SHA256",
    "alias_of": "",
    "tlb": "#F90400",
    "doc_category": "app_crypto",
    "doc_opcode": "F90400",
    "doc_fift": "HASHEXT_SHA256",
    "doc_stack": "s_1 ... s_n n - h",
    "doc_gas": "1/33 gas per byte",
    "doc_description": "Calculates and returns hash of the concatenation of slices (or builders) `s_1...s_n`."
  },
  {
    "name": "HASHEXT_SHA512",
    "alias_of": "",
    "tlb": "#F90401",
    "doc_category": "app_crypto",
    "doc_opcode": "F90401",
    "doc_fift": "HASHEXT_SHA512",
    "doc_stack": "s_1 ... s_n n - h",
    "doc_gas": "1/16 gas per byte",
    "doc_description": "Calculates and returns hash of the concatenation of slices (or builders) `s_1...s_n`."
  },
  {
    "name": "HASHEXT_BLAKE2B",
    "alias_of": "",
    "tlb": "#F90402",
    "doc_category": "app_crypto",
    "doc_opcode": "F90402",
    "doc_fift": "HASHEXT_BLAKE2B",
    "doc_stack": "s_1 ... s_n n - h",
    "doc_gas": "1/19 gas per byte",
    "doc_description": "Calculates and returns hash of the concatenation of slices (or builders) `s_1...s_n`."
  },
  {
    "name": "HASHEXT_KECCAK256",
    "alias_of": "",
    "tlb": "#F90403",
    "doc_category": "app_crypto",
    "doc_opcode": "F90403",
    "doc_fift": "HASHEXT_KECCAK256",
    "doc_stack": "s_1 ... s_n n - h",
    "doc_gas": "1/11 gas per byte",
    "doc_description": "Calculates and returns hash of the concatenation of slices (or builders) `s_1...s_n`."
  },
  {
    "name": "HASHEXT_KECCAK512",
    "alias_of": "",
    "tlb": "#F90404",
    "doc_category": "app_crypto",
    "doc_opcode": "F90404",
    "doc_fift": "HASHEXT_KECCAK512",
    "doc_stack": "s_1 ... s_n n - h",
    "doc_gas": "1/19 gas per byte",
    "doc_description": "Calculates and returns hash of the concatenation of slices (or builders) `s_1...s_n`."
  },
  {
    "name": "HASHEXTR_SHA256",
    "alias_of": "",
    "tlb": "#F90500",
    "doc_category": "app_crypto",
    "doc_opcode": "F90500",
    "doc_fift": "HASHEXTR_SHA256",
    "doc_stack": "s_n ... s_1 n - h",
    "doc_gas": "1/33 gas per byte",
    "doc_description": "Same as `HASHEXT_`, but arguments are given in reverse order."
  },
  {
    "name": "HASHEXTR_SHA512",
    "alias_of": "",
    "tlb": "#F90501",
    "doc_category": "app_crypto",
    "doc_opcode": "F90501",
    "doc_fift": "HASHEXTR_SHA512",
    "doc_stack": "s_n ... s_1 n - h",
    "doc_gas": "1/16 gas per byte",
    "doc_description": "Same as `HASHEXT_`, but arguments are given in reverse order."
  },
  {
    "name": "HASHEXTR_BLAKE2B",
    "alias_of": "",
    "tlb": "#F90502",
    "doc_category": "app_crypto",
    "doc_opcode": "F90502",
    "doc_fift": "HASHEXTR_BLAKE2B",
    "doc_stack": "s_n ... s_1 n - h",
    "doc_gas": "1/19 gas per byte",
    "doc_description": "Same as `HASHEXT_`, but arguments are given in reverse order."
  },
  {
    "name": "HASHEXTR_KECCAK256",
    "alias_of": "",
    "tlb": "#F90503",
    "doc_category": "app_crypto",
    "doc_opcode": "F90503",
    "doc_fift": "HASHEXTR_SHA256",
    "doc_stack": "s_n ... s_1 n - h",
    "doc_gas": "1/11 gas per byte",
    "doc_description": "Same as `HASHEXT_`, but arguments are given in reverse order."
  },
  {
    "name": "HASHEXTR_KECCAK512",
    "alias_of": "",
    "tlb": "#F90504",
    "doc_category": "app_crypto",
    "doc_opcode": "F90504",
    "doc_fift": "HASHEXTR_KECCAK512",
    "doc_stack": "s_n ... s_1 n - h",
    "doc_gas": "1/19 gas per byte",
    "doc_description": "Same as `HASHEXT_`, but arguments are given in reverse order."
  },
  {
    "name": "HASHEXTA_SHA256",
    "alias_of": "",
    "tlb": "#F90600",
    "doc_category": "app_crypto",
    "doc_opcode": "F90600",
    "doc_fift": "HASHEXTA_SHA256",
    "doc_stack": "b s_1 ... s_n n - b'",
    "doc_gas": "1/33 gas per byte",
    "doc_description": "Appends the resulting hash to a builder `b` instead of pushing it to the stack."
  },
  {
    "name": "HASHEXTA_SHA512",
    "alias_of": "",
    "tlb": "#F90601",
    "doc_category": "app_crypto",
    "doc_opcode": "F90601",
    "doc_fift": "HASHEXTA_SHA512",
    "doc_stack": "b s_1 ... s_n n - b'",
    "doc_gas": "1/16 gas per byte",
    "doc_description": "Appends the resulting hash to a builder `b` instead of pushing it to the stack."
  },
  {
    "name": "HASHEXTA_BLAKE2B",
    "alias_of": "",
    "tlb": "#F90602",
    "doc_category": "app_crypto",
    "doc_opcode": "F90602",
    "doc_fift": "HASHEXTA_BLAKE2B",
    "doc_stack": "b s_1 ... s_n n - b'",
    "doc_gas": "1/19 gas per byte",
    "doc_description": "Appends the resulting hash to a builder `b` instead of pushing it to the stack."
  },
  {
    "name": "HASHEXTA_KECCAK256",
    "alias_of": "",
    "tlb": "#F90603",
    "doc_category": "app_crypto",
    "doc_opcode": "F90603",
    "doc_fift": "HASHEXTA_KECCAK256",
    "doc_stack": "b s_1 ... s_n n - b'",
    "doc_gas": "1/11 gas per byte",
    "doc_description": "Appends the resulting hash to a builder `b` instead of pushing it to the stack."
  },
  {
    "name": "HASHEXTA_KECCAK512",
    "alias_of": "",
    "tlb": "#F90604",
    "doc_category": "app_crypto",
    "doc_opcode": "F90604",
    "doc_fift": "HASHEXTA_KECCAK512",
    "doc_stack": "b s_1 ... s_n n - b'",
    "doc_gas": "1/6 gas per byte",
    "doc_description": "Appends the resulting hash to a builder `b` instead of pushing it to the stack."
  },
  {
    "name": "HASHEXTAR_SHA256",
    "alias_of": "",
    "tlb": "#F90700",
    "doc_category": "app_crypto",
    "doc_opcode": "F90700",
    "doc_fift": "HASHEXTAR_SHA256",
    "doc_stack": "b s_n ... s_1 n - b'",
    "doc_gas": "1/33 gas per byte",
    "doc_description": "Arguments are given in reverse order, appends hash to builder."
  },
  {
    "name": "HASHEXTAR_SHA512",
    "alias_of": "",
    "tlb": "#F90701",
    "doc_category": "app_crypto",
    "doc_opcode": "F90701",
    "doc_fift": "HASHEXTAR_SHA512",
    "doc_stack": "b s_n ... s_1 n - b'",
    "doc_gas": "1/16 gas per byte",
    "doc_description": "Arguments are given in reverse order, appends hash to builder."
  },
  {
    "name": "HASHEXTAR_BLAKE2B",
    "alias_of": "",
    "tlb": "#F90702",
    "doc_category": "app_crypto",
    "doc_opcode": "F90702",
    "doc_fift": "HASHEXTAR_BLAKE2B",
    "doc_stack": "b s_n ... s_1 n - b'",
    "doc_gas": "1/19 gas per byte",
    "doc_description": "Arguments are given in reverse order, appends hash to builder."
  },
  {
    "name": "HASHEXTAR_KECCAK256",
    "alias_of": "",
    "tlb": "#F90703",
    "doc_category": "app_crypto",
    "doc_opcode": "F90703",
    "doc_fift": "HASHEXTAR_KECCAK256",
    "doc_stack": "b s_n ... s_1 n - b'",
    "doc_gas": "1/11 gas per byte",
    "doc_description": "Arguments are given in reverse order, appends hash to builder."
  },
  {
    "name": "HASHEXTAR_KECCAK512",
    "alias_of": "",
    "tlb": "#F90704",
    "doc_category": "app_crypto",
    "doc_opcode": "F90704",
    "doc_fift": "HASHEXTAR_KECCAK512",
    "doc_stack": "b s_n ... s_1 n - b'",
    "doc_gas": "1/6 gas per byte",
    "doc_description": "Arguments are given in reverse order, appends hash to builder."
  },
  {
    "name": "ECRECOVER",
    "alias_of": "",
    "tlb": "#F912",
    "doc_category": "app_crypto",
    "doc_opcode": "F912",
    "doc_fift": "ECRECOVER",
    "doc_stack": "hash v r s - 0 or h x1 x2 -1",
    "doc_gas": 1526,
    "doc_description": "Recovers public key from signature, identical to Bitcoin/Ethereum operations.\nTakes 32-byte `hash` as uint256 hash; 65-byte signature as uint8 `v` and uint256 `r`, `s`.\nReturns `0` on failure, public key and `-1` on success.\n65-byte public key is returned as uint8 `h`, uint256 `x1`, `x2`."
  },
  {
    "name": "P256_CHKSIGNS",
    "alias_of": "",
    "tlb": "#F915",
    "doc_category": "app_crypto",
    "doc_opcode": "F915",
    "doc_fift": "P256_CHKSIGNS",
    "doc_stack": "d sig k - ?",
    "doc_gas": 3526,
    "doc_description": "Checks seck256r1-signature `sig` of data portion of slice `d` and public key `k`. Returns -1 on success, 0 on failure.\nPublic key is a 33-byte slice (encoded according to Sec. 2.3.4 point 2 of [SECG SEC 1](https://www.secg.org/sec1-v2.pdf)).\nSignature `sig` is a 64-byte slice (two 256-bit unsigned integers `r` and `s`)."
  },
  {
    "name": "P256_CHKSIGNU",
    "alias_of": "",
    "tlb": "#F914",
    "doc_category": "app_crypto",
    "doc_opcode": "F914",
    "doc_fift": "P256_CHKSIGNU",
    "doc_stack": "h sig k - ?",
    "doc_gas": 3526,
    "doc_description": "Same as P256_CHKSIGNS, but the signed data is 32-byte encoding of 256-bit unsigned integer h."
  },
  {
    "name": "RIST255_FROMHASH",
    "alias_of": "",
    "tlb": "#F920",
    "doc_category": "app_crypto",
    "doc_opcode": "F920",
    "doc_fift": "RIST255_FROMHASH",
    "doc_stack": "h1 h2 - x",
    "doc_gas": 626,
    "doc_description": "Deterministically generates a valid point `x` from a 512-bit hash (given as two 256-bit integers)."
  },
  {
    "name": "RIST255_VALIDATE",
    "alias_of": "",
    "tlb": "#F921",
    "doc_category": "app_crypto",
    "doc_opcode": "F921",
    "doc_fift": "RIST255_VALIDATE",
    "doc_stack": "x - ",
    "doc_gas": 226,
    "doc_description": "Checks that integer `x` is a valid representation of some curve point. Throws `range_chk` on error."
  },
  {
    "name": "RIST255_ADD",
    "alias_of": "",
    "tlb": "#F922",
    "doc_category": "app_crypto",
    "doc_opcode": "F922",
    "doc_fift": "RIST255_ADD",
    "doc_stack": "x y - x+y",
    "doc_gas": 626,
    "doc_description": "Addition of two points on a curve."
  },
  {
    "name": "RIST255_SUB",
    "alias_of": "",
    "tlb": "#F923",
    "doc_category": "app_crypto",
    "doc_opcode": "F923",
    "doc_fift": "RIST255_SUB",
    "doc_stack": "x y - x-y",
    "doc_gas": 626,
    "doc_description": "Subtraction of two points on curve."
  },
  {
    "name": "RIST255_MUL",
    "alias_of": "",
    "tlb": "#F924",
    "doc_category": "app_crypto",
    "doc_opcode": "F924",
    "doc_fift": "RIST255_MUL",
    "doc_stack": "x n - x*n",
    "doc_gas": 2026,
    "doc_description": "Multiplies point `x` by a scalar `n`. Any `n` is valid, including negative."
  },
  {
    "name": "RIST255_MULBASE",
    "alias_of": "",
    "tlb": "#F925",
    "doc_category": "app_crypto",
    "doc_opcode": "F925",
    "doc_fift": "RIST255_MULBASE",
    "doc_stack": "n - g*n",
    "doc_gas": 776,
    "doc_description": "Multiplies the generator point `g` by a scalar `n`. Any `n` is valid, including negative."
  },
  {
    "name": "RIST255_PUSHL",
    "alias_of": "",
    "tlb": "#F926",
    "doc_category": "app_crypto",
    "doc_opcode": "F926",
    "doc_fift": "RIST255_PUSHL",
    "doc_stack": "- l",
    "doc_gas": 26,
    "doc_description": "Pushes integer `l=2^252+27742317777372353535851937790883648493`, which is the order of the group."
  },
  {
    "name": "RIST255_QVALIDATE",
    "alias_of": "",
    "tlb": "#B7F921",
    "doc_category": "app_crypto",
    "doc_opcode": "B7F921",
    "doc_fift": "RIST255_QVALIDATE",
    "doc_stack": "x - 0 or -1",
    "doc_gas": 234,
    "doc_description": "Quiet version of `RIST255_VALIDATE`."
  },
  {
    "name": "RIST255_QADD",
    "alias_of": "",
    "tlb": "#B7F922",
    "doc_category": "app_crypto",
    "doc_opcode": "B7F922",
    "doc_fift": "RIST255_QADD",
    "doc_stack": "x y - 0 or x+y -1",
    "doc_gas": 634,
    "doc_description": "Quiet version of `RIST255_ADD`."
  },
  {
    "name": "RIST255_QSUB",
    "alias_of": "",
    "tlb": "#B7F923",
    "doc_category": "app_crypto",
    "doc_opcode": "B7F923",
    "doc_fift": "RIST255_QSUB",
    "doc_stack": "x y - 0 or x-y -1",
    "doc_gas": 634,
    "doc_description": "Quiet version of `RIST255_SUB`."
  },
  {
    "name": "RIST255_QMUL",
    "alias_of": "",
    "tlb": "#B7F924",
    "doc_category": "app_crypto",
    "doc_opcode": "B7F924",
    "doc_fift": "RIST255_QMUL",
    "doc_stack": "x n - 0 or x*n -1",
    "doc_gas": 2034,
    "doc_description": "Quiet version of `RIST255_MUL`."
  },
  {
    "name": "RIST255_QMULBASE",
    "alias_of": "",
    "tlb": "#B7F925",
    "doc_category": "app_crypto",
    "doc_opcode": "B7F925",
    "doc_fift": "RIST255_QMULBASE",
    "doc_stack": "n - 0 or g*n -1",
    "doc_gas": 784,
    "doc_description": "Quiet version of `RIST255_MULBASE`."
  },
  {
    "name": "BLS_VERIFY",
    "alias_of": "",
    "tlb": "#F93000",
    "doc_category": "app_crypto",
    "doc_opcode": "F93000",
    "doc_fift": "BLS_VERIFY",
    "doc_stack": "pk msg sgn - bool",
    "doc_gas": 61034,
    "doc_description": "Checks BLS signature, return true on success, false otherwise."
  },
  {
    "name": "BLS_AGGREGATE",
    "alias_of": "",
    "tlb": "#F93001",
    "doc_category": "app_crypto",
    "doc_opcode": "F93001",
    "doc_fift": "BLS_AGGREGATE",
    "doc_stack": "sig_1 ... sig_n n - sig",
    "doc_gas": "n*4350-2616",
    "doc_description": "Aggregates signatures. `n>0`. Throw exception if `n=0` or if some `sig_i` is not a valid signature."
  },
  {
    "name": "BLS_FASTAGGREGATEVERIFY",
    "alias_of": "",
    "tlb": "#F93002",
    "doc_category": "app_crypto",
    "doc_opcode": "F93002",
    "doc_fift": "BLS_FASTAGGREGATEVERIFY",
    "doc_stack": "pk_1 ... pk_n n msg sig - bool",
    "doc_gas": "58034+n*3000",
    "doc_description": "Checks aggregated BLS signature for keys `pk_1...pk_n` and message `msg`. Return true on success, false otherwise. Return false if `n=0`."
  },
  {
    "name": "BLS_AGGREGATEVERIFY",
    "alias_of": "",
    "tlb": "#F93003",
    "doc_category": "app_crypto",
    "doc_opcode": "F93003",
    "doc_fift": "BLS_AGGREGATEVERIFY",
    "doc_stack": "pk_1 msg_1 ... pk_n msg_n n sgn - bool",
    "doc_gas": "38534+n*22500",
    "doc_description": "Checks aggregated BLS signature for key-message pairs `pk_1 msg_1...pk_n msg_n`. Return true on success, false otherwise. Return false if `n=0`."
  },
  {
    "name": "BLS_G1_ADD",
    "alias_of": "",
    "tlb": "#F93010",
    "doc_category": "app_crypto",
    "doc_opcode": "F93010",
    "doc_fift": "BLS_G1_ADD",
    "doc_stack": "x y - x+y",
    "doc_gas": 3934,
    "doc_description": "Addition on G1."
  },
  {
    "name": "BLS_G1_SUB",
    "alias_of": "",
    "tlb": "#F93011",
    "doc_category": "app_crypto",
    "doc_opcode": "F93011",
    "doc_fift": "BLS_G1_SUB",
    "doc_stack": "x y - x-y",
    "doc_gas": 3934,
    "doc_description": "Subtraction on G1."
  },
  {
    "name": "BLS_G1_NEG",
    "alias_of": "",
    "tlb": "#F93012",
    "doc_category": "app_crypto",
    "doc_opcode": "F93012",
    "doc_fift": "BLS_G1_NEG",
    "doc_stack": "x - -x",
    "doc_gas": 784,
    "doc_description": "Negation on G1."
  },
  {
    "name": "BLS_G1_MUL",
    "alias_of": "",
    "tlb": "#F93013",
    "doc_category": "app_crypto",
    "doc_opcode": "F93013",
    "doc_fift": "BLS_G1_MUL",
    "doc_stack": "x s - x*s",
    "doc_gas": 5234,
    "doc_description": "Multiplies G1 point `x` by scalar `s`. Any `s` is valid, including negative."
  },
  {
    "name": "BLS_G1_MULTIEXP",
    "alias_of": "",
    "tlb": "#F93014",
    "doc_category": "app_crypto",
    "doc_opcode": "F93014",
    "doc_fift": "BLS_G1_MULTIEXP",
    "doc_stack": "x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n",
    "doc_gas": "11409+n*630+n/floor(max(log2(n),4))*8820",
    "doc_description": "Calculates `x_1*s_1+...+x_n*s_n` for G1 points `x_i` and scalars `s_i`. Returns zero point if `n=0`. Any `s_i` is valid, including negative."
  },
  {
    "name": "BLS_G1_ZERO",
    "alias_of": "",
    "tlb": "#F93015",
    "doc_category": "app_crypto",
    "doc_opcode": "F93015",
    "doc_fift": "BLS_G1_ZERO",
    "doc_stack": "- zero",
    "doc_gas": 34,
    "doc_description": "Pushes zero point in G1."
  },
  {
    "name": "BLS_MAP_TO_G1",
    "alias_of": "",
    "tlb": "#F93016",
    "doc_category": "app_crypto",
    "doc_opcode": "F93016",
    "doc_fift": "BLS_MAP_TO_G1",
    "doc_stack": "f - x",
    "doc_gas": 2384,
    "doc_description": "Converts FP element `f` to a G1 point."
  },
  {
    "name": "BLS_G1_INGROUP",
    "alias_of": "",
    "tlb": "#F93017",
    "doc_category": "app_crypto",
    "doc_opcode": "F93017",
    "doc_fift": "BLS_G1_INGROUP",
    "doc_stack": "x - bool",
    "doc_gas": 2984,
    "doc_description": "Checks that slice `x` represents a valid element of G1."
  },
  {
    "name": "BLS_G1_ISZERO",
    "alias_of": "",
    "tlb": "#F93018",
    "doc_category": "app_crypto",
    "doc_opcode": "F93018",
    "doc_fift": "BLS_G1_ISZERO",
    "doc_stack": "x - bool",
    "doc_gas": 34,
    "doc_description": "Checks that G1 point `x` is equal to zero."
  },
  {
    "name": "BLS_G2_ADD",
    "alias_of": "",
    "tlb": "#F93020",
    "doc_category": "app_crypto",
    "doc_opcode": "F93020",
    "doc_fift": "BLS_G2_ADD",
    "doc_stack": "x y - x+y",
    "doc_gas": 6134,
    "doc_description": "Addition on G2."
  },
  {
    "name": "BLS_G2_SUB",
    "alias_of": "",
    "tlb": "#F93021",
    "doc_category": "app_crypto",
    "doc_opcode": "F93021",
    "doc_fift": "BLS_G2_SUB",
    "doc_stack": "x y - x-y",
    "doc_gas": 6134,
    "doc_description": "Subtraction on G2."
  },
  {
    "name": "BLS_G2_NEG",
    "alias_of": "",
    "tlb": "#F93022",
    "doc_category": "app_crypto",
    "doc_opcode": "F93022",
    "doc_fift": "BLS_G2_NEG",
    "doc_stack": "x - -x",
    "doc_gas": 1584,
    "doc_description": "Negation on G2."
  },
  {
    "name": "BLS_G2_MUL",
    "alias_of": "",
    "tlb": "#F93023",
    "doc_category": "app_crypto",
    "doc_opcode": "F93023",
    "doc_fift": "BLS_G2_MUL",
    "doc_stack": "x s - x*s",
    "doc_gas": 10584,
    "doc_description": "Multiplies G2 point `x` by scalar `s`. Any `s` is valid, including negative."
  },
  {
    "name": "BLS_G2_MULTIEXP",
    "alias_of": "",
    "tlb": "#F93024",
    "doc_category": "app_crypto",
    "doc_opcode": "F93024",
    "doc_fift": "BLS_G2_MULTIEXP",
    "doc_stack": "x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n",
    "doc_gas": "30422+n*1280+n/floor(max(log2(n),4))*22840",
    "doc_description": "Calculates `x_1*s_1+...+x_n*s_n` for G2 points `x_i` and scalars `s_i`. Returns zero point if `n=0`. Any `s_i` is valid, including negative."
  },
  {
    "name": "BLS_G2_ZERO",
    "alias_of": "",
    "tlb": "#F93025",
    "doc_category": "app_crypto",
    "doc_opcode": "F93025",
    "doc_fift": "BLS_G2_ZERO",
    "doc_stack": "- zero",
    "doc_gas": 34,
    "doc_description": "Pushes zero point in G2."
  },
  {
    "name": "BLS_MAP_TO_G2",
    "alias_of": "",
    "tlb": "#F93026",
    "doc_category": "app_crypto",
    "doc_opcode": "F93026",
    "doc_fift": "BLS_MAP_TO_G2",
    "doc_stack": "f - x",
    "doc_gas": 7984,
    "doc_description": "Converts FP2 element `f` to a G2 point."
  },
  {
    "name": "BLS_G2_INGROUP",
    "alias_of": "",
    "tlb": "#F93027",
    "doc_category": "app_crypto",
    "doc_opcode": "F93027",
    "doc_fift": "BLS_G2_INGROUP",
    "doc_stack": "x - bool",
    "doc_gas": 4284,
    "doc_description": "Checks that slice `x` represents a valid element of G2."
  },
  {
    "name": "BLS_G2_ISZERO",
    "alias_of": "",
    "tlb": "#F93028",
    "doc_category": "app_crypto",
    "doc_opcode": "F93028",
    "doc_fift": "BLS_G2_ISZERO",
    "doc_stack": "x - bool",
    "doc_gas": 34,
    "doc_description": "Checks that G2 point `x` is equal to zero."
  },
  {
    "name": "BLS_PAIRING",
    "alias_of": "",
    "tlb": "#F93030",
    "doc_category": "app_crypto",
    "doc_opcode": "F93030",
    "doc_fift": "BLS_PAIRING",
    "doc_stack": "x_1 y_1 ... x_n y_n n - bool",
    "doc_gas": "20034+n*11800",
    "doc_description": "Given G1 points `x_i` and G2 points `y_i`, calculates and multiply pairings of `x_i`,`y_i`. Returns true if the result is the multiplicative identity in FP12, false otherwise. Returns false if `n=0`."
  },
  {
    "name": "BLS_PUSHR",
    "alias_of": "",
    "tlb": "#F93031",
    "doc_category": "app_crypto",
    "doc_opcode": "F93031",
    "doc_fift": "BLS_PUSHR",
    "doc_stack": "- r",
    "doc_gas": 34,
    "doc_description": "Pushes the order of G1 and G2 (approx. `2^255`)."
  }
]



================================================
FILE: src/data/opcodes/arithmetic.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/arithmetic.json
================================================
[
  {
    "name": "ADD",
    "alias_of": "",
    "tlb": "#A0",
    "doc_category": "arithm_basic",
    "doc_opcode": "A0",
    "doc_fift": "ADD",
    "doc_stack": "x y - x+y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "SUB",
    "alias_of": "",
    "tlb": "#A1",
    "doc_category": "arithm_basic",
    "doc_opcode": "A1",
    "doc_fift": "SUB",
    "doc_stack": "x y - x-y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "SUBR",
    "alias_of": "",
    "tlb": "#A2",
    "doc_category": "arithm_basic",
    "doc_opcode": "A2",
    "doc_fift": "SUBR",
    "doc_stack": "x y - y-x",
    "doc_gas": 18,
    "doc_description": "Equivalent to `SWAP` `SUB`."
  },
  {
    "name": "NEGATE",
    "alias_of": "",
    "tlb": "#A3",
    "doc_category": "arithm_basic",
    "doc_opcode": "A3",
    "doc_fift": "NEGATE",
    "doc_stack": "x - -x",
    "doc_gas": 18,
    "doc_description": "Equivalent to `-1 MULCONST` or to `ZERO SUBR`.\nNotice that it triggers an integer overflow exception if `x=-2^256`."
  },
  {
    "name": "INC",
    "alias_of": "",
    "tlb": "#A4",
    "doc_category": "arithm_basic",
    "doc_opcode": "A4",
    "doc_fift": "INC",
    "doc_stack": "x - x+1",
    "doc_gas": 18,
    "doc_description": "Equivalent to `1 ADDCONST`."
  },
  {
    "name": "DEC",
    "alias_of": "",
    "tlb": "#A5",
    "doc_category": "arithm_basic",
    "doc_opcode": "A5",
    "doc_fift": "DEC",
    "doc_stack": "x - x-1",
    "doc_gas": 18,
    "doc_description": "Equivalent to `-1 ADDCONST`."
  },
  {
    "name": "ADDCONST",
    "alias_of": "",
    "tlb": "#A6 cc:int8",
    "doc_category": "arithm_basic",
    "doc_opcode": "A6cc",
    "doc_fift": "[cc] ADDCONST\n[cc] ADDINT\n[-cc] SUBCONST\n[-cc] SUBINT",
    "doc_stack": "x - x+cc",
    "doc_gas": 26,
    "doc_description": "`-128 <= cc <= 127`."
  },
  {
    "name": "MULCONST",
    "alias_of": "",
    "tlb": "#A7 cc:int8",
    "doc_category": "arithm_basic",
    "doc_opcode": "A7cc",
    "doc_fift": "[cc] MULCONST\n[cc] MULINT",
    "doc_stack": "x - x*cc",
    "doc_gas": 26,
    "doc_description": "`-128 <= cc <= 127`."
  },
  {
    "name": "MUL",
    "alias_of": "",
    "tlb": "#A8",
    "doc_category": "arithm_basic",
    "doc_opcode": "A8",
    "doc_fift": "MUL",
    "doc_stack": "x y - x*y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "DIV_BASE",
    "alias_of": "",
    "tlb": "#A9 m:uint1 s:uint2 cdft:(Either [ d:uint2 f:uint2 ] [ d:uint2 f:uint2 tt:uint8 ])",
    "doc_category": "arithm_div",
    "doc_opcode": "A9mscdf",
    "doc_fift": "",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "This is the general encoding of division, with an optional pre-multiplication and an optional replacement of the division or multiplication by a shift. Variable fields are as follows:\n`0 <= m <= 1`  -  Indicates whether there is pre-multiplication (`MULDIV` and its variants), possibly replaced by a left shift.\n`0 <= s <= 2`  -  Indicates whether either the multiplication or the division have been replaced by shifts: `s=0` - no replacement, `s=1` - division replaced by a right shift, `s=2` - multiplication replaced by a left shift (possible only for `m=1`).\n`0 <= c <= 1`  -  Indicates whether there is a constant one-byte argument `tt` for the shift operator (if `s!=0`). For `s=0`, `c=0`. If `c=1`, then `0 <= tt <= 255`, and the shift is performed by `tt+1` bits. If `s!=0` and `c=0`, then the shift amount is provided to the instruction as a top-of-stack _Integer_ in range `0...256`.\n`1 <= d <= 3`  -  Indicates which results of division are required: `1` - only the quotient, `2` - only the remainder, `3` - both.\n`0 <= f <= 2`  -  Rounding mode: `0` - floor, `1` - nearest integer, `2` - ceiling.\nAll instructions below are variants of this."
  },
  {
    "name": "DIV",
    "alias_of": "DIV_BASE",
    "tlb": "#A904",
    "doc_category": "arithm_div",
    "doc_opcode": "A904",
    "doc_fift": "DIV",
    "doc_stack": "x y - q",
    "doc_gas": 26,
    "doc_description": "`q=floor(x/y)`, `r=x-y*q`"
  },
  {
    "name": "DIVR",
    "alias_of": "DIV_BASE",
    "tlb": "#A905",
    "doc_category": "arithm_div",
    "doc_opcode": "A905",
    "doc_fift": "DIVR",
    "doc_stack": "x y - q’",
    "doc_gas": 26,
    "doc_description": "`q’=round(x/y)`, `r’=x-y*q’`"
  },
  {
    "name": "DIVC",
    "alias_of": "DIV_BASE",
    "tlb": "#A906",
    "doc_category": "arithm_div",
    "doc_opcode": "A906",
    "doc_fift": "DIVC",
    "doc_stack": "x y - q''",
    "doc_gas": 26,
    "doc_description": "`q’’=ceil(x/y)`, `r’’=x-y*q’’`"
  },
  {
    "name": "MOD",
    "alias_of": "DIV_BASE",
    "tlb": "#A908",
    "doc_category": "arithm_div",
    "doc_opcode": "A908",
    "doc_fift": "MOD",
    "doc_stack": "x y - r",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "DIVMOD",
    "alias_of": "DIV_BASE",
    "tlb": "#A90C",
    "doc_category": "arithm_div",
    "doc_opcode": "A90C",
    "doc_fift": "DIVMOD",
    "doc_stack": "x y - q r",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "DIVMODR",
    "alias_of": "DIV_BASE",
    "tlb": "#A90D",
    "doc_category": "arithm_div",
    "doc_opcode": "A90D",
    "doc_fift": "DIVMODR",
    "doc_stack": "x y - q' r'",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "DIVMODC",
    "alias_of": "DIV_BASE",
    "tlb": "#A90E",
    "doc_category": "arithm_div",
    "doc_opcode": "A90E",
    "doc_fift": "DIVMODC",
    "doc_stack": "x y - q'' r''",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "RSHIFTR_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A925",
    "doc_category": "arithm_div",
    "doc_opcode": "A925",
    "doc_fift": "RSHIFTR",
    "doc_stack": "x y - round(x/2^y)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "RSHIFTC_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A926",
    "doc_category": "arithm_div",
    "doc_opcode": "A926",
    "doc_fift": "RSHIFTC",
    "doc_stack": "x y - ceil(x/2^y)",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "RSHIFTR",
    "alias_of": "DIV_BASE",
    "tlb": "#A935 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A935tt",
    "doc_fift": "[tt+1] RSHIFTR#",
    "doc_stack": "x y - round(x/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "RSHIFTC",
    "alias_of": "DIV_BASE",
    "tlb": "#A936 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A936tt",
    "doc_fift": "[tt+1] RSHIFTC#",
    "doc_stack": "x y - ceil(x/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "MODPOW2",
    "alias_of": "DIV_BASE",
    "tlb": "#A938 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A938tt",
    "doc_fift": "[tt+1] MODPOW2#",
    "doc_stack": "x - x mod 2^(tt+1)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "MULDIV",
    "alias_of": "DIV_BASE",
    "tlb": "#A984",
    "doc_category": "arithm_div",
    "doc_opcode": "A98",
    "doc_fift": "MULDIV",
    "doc_stack": "x y z - q",
    "doc_gas": 26,
    "doc_description": "`q=floor(x*y/z)`"
  },
  {
    "name": "MULDIVR",
    "alias_of": "DIV_BASE",
    "tlb": "#A985",
    "doc_category": "arithm_div",
    "doc_opcode": "A985",
    "doc_fift": "MULDIVR",
    "doc_stack": "x y z - q'",
    "doc_gas": 26,
    "doc_description": "`q'=round(x*y/z)`"
  },
  {
    "name": "MULDIVMOD",
    "alias_of": "DIV_BASE",
    "tlb": "#A98C",
    "doc_category": "arithm_div",
    "doc_opcode": "A98C",
    "doc_fift": "MULDIVMOD",
    "doc_stack": "x y z - q r",
    "doc_gas": 26,
    "doc_description": "`q=floor(x*y/z)`, `r=x*y-z*q`"
  },
  {
    "name": "MULRSHIFT_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9A4",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A4",
    "doc_fift": "MULRSHIFT",
    "doc_stack": "x y z - floor(x*y/2^z)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "MULRSHIFTR_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9A5",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A5",
    "doc_fift": "MULRSHIFTR",
    "doc_stack": "x y z - round(x*y/2^z)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "MULRSHIFTC_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9A6",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A6",
    "doc_fift": "MULRSHIFTC",
    "doc_stack": "x y z - ceil(x*y/2^z)",
    "doc_gas": 34,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "MULRSHIFT",
    "alias_of": "DIV_BASE",
    "tlb": "#A9B4 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9B4tt",
    "doc_fift": "[tt+1] MULRSHIFT#",
    "doc_stack": "x y - floor(x*y/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "MULRSHIFTR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9B5 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9B5tt",
    "doc_fift": "[tt+1] MULRSHIFTR#",
    "doc_stack": "x y - round(x*y/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "MULRSHIFTC",
    "alias_of": "DIV_BASE",
    "tlb": "#A9B6 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9B6tt",
    "doc_fift": "[tt+1] MULRSHIFTC#",
    "doc_stack": "x y - ceil(x*y/2^(tt+1))",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "LSHIFTDIV_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9C4",
    "doc_category": "arithm_div",
    "doc_opcode": "A9C4",
    "doc_fift": "LSHIFTDIV",
    "doc_stack": "x y z - floor(2^z*x/y)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "LSHIFTDIVR_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9C5",
    "doc_category": "arithm_div",
    "doc_opcode": "A9C5",
    "doc_fift": "LSHIFTDIVR",
    "doc_stack": "x y z - round(2^z*x/y)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "LSHIFTDIVC_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9C6",
    "doc_category": "arithm_div",
    "doc_opcode": "A9C6",
    "doc_fift": "LSHIFTDIVC",
    "doc_stack": "x y z - ceil(2^z*x/y)",
    "doc_gas": 34,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "LSHIFTDIV",
    "alias_of": "DIV_BASE",
    "tlb": "#A9D4 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D4tt",
    "doc_fift": "[tt+1] LSHIFT#DIV",
    "doc_stack": "x y - floor(2^(tt+1)*x/y)",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "LSHIFTDIVR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9D5 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D5tt",
    "doc_fift": "[tt+1] LSHIFT#DIVR",
    "doc_stack": "x y - round(2^(tt+1)*x/y)",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "LSHIFTDIVC",
    "alias_of": "DIV_BASE",
    "tlb": "#A9D6 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D6tt",
    "doc_fift": "[tt+1] LSHIFT#DIVC",
    "doc_stack": "x y - ceil(2^(tt+1)*x/y)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "LSHIFT",
    "alias_of": "",
    "tlb": "#AA cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "AAcc",
    "doc_fift": "[cc+1] LSHIFT#",
    "doc_stack": "x - x*2^(cc+1)",
    "doc_gas": 26,
    "doc_description": "`0 <= cc <= 255`"
  },
  {
    "name": "RSHIFT",
    "alias_of": "",
    "tlb": "#AB cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "ABcc",
    "doc_fift": "[cc+1] RSHIFT#",
    "doc_stack": "x - floor(x/2^(cc+1))",
    "doc_gas": 18,
    "doc_description": "`0 <= cc <= 255`"
  },
  {
    "name": "LSHIFT_VAR",
    "alias_of": "",
    "tlb": "#AC",
    "doc_category": "arithm_logical",
    "doc_opcode": "AC",
    "doc_fift": "LSHIFT",
    "doc_stack": "x y - x*2^y",
    "doc_gas": 18,
    "doc_description": "`0 <= y <= 1023`"
  },
  {
    "name": "RSHIFT_VAR",
    "alias_of": "",
    "tlb": "#AD",
    "doc_category": "arithm_logical",
    "doc_opcode": "AD",
    "doc_fift": "RSHIFT",
    "doc_stack": "x y - floor(x/2^y)",
    "doc_gas": 18,
    "doc_description": "`0 <= y <= 1023`"
  },
  {
    "name": "POW2",
    "alias_of": "",
    "tlb": "#AE",
    "doc_category": "arithm_logical",
    "doc_opcode": "AE",
    "doc_fift": "POW2",
    "doc_stack": "y - 2^y",
    "doc_gas": 18,
    "doc_description": "`0 <= y <= 1023`\nEquivalent to `ONE` `SWAP` `LSHIFT`."
  },
  {
    "name": "AND",
    "alias_of": "",
    "tlb": "#B0",
    "doc_category": "arithm_logical",
    "doc_opcode": "B0",
    "doc_fift": "AND",
    "doc_stack": "x y - x&y",
    "doc_gas": 18,
    "doc_description": "Bitwise and of two signed integers `x` and `y`, sign-extended to infinity."
  },
  {
    "name": "OR",
    "alias_of": "",
    "tlb": "#B1",
    "doc_category": "arithm_logical",
    "doc_opcode": "B1",
    "doc_fift": "OR",
    "doc_stack": "x y - x|y",
    "doc_gas": 18,
    "doc_description": "Bitwise or of two integers."
  },
  {
    "name": "XOR",
    "alias_of": "",
    "tlb": "#B2",
    "doc_category": "arithm_logical",
    "doc_opcode": "B2",
    "doc_fift": "XOR",
    "doc_stack": "x y - x xor y",
    "doc_gas": 18,
    "doc_description": "Bitwise xor of two integers."
  },
  {
    "name": "NOT",
    "alias_of": "",
    "tlb": "#B3",
    "doc_category": "arithm_logical",
    "doc_opcode": "B3",
    "doc_fift": "NOT",
    "doc_stack": "x - ~x",
    "doc_gas": 26,
    "doc_description": "Bitwise not of an integer."
  },
  {
    "name": "FITS",
    "alias_of": "",
    "tlb": "#B4 cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "B4cc",
    "doc_fift": "[cc+1] FITS",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `cc+1`-bit signed integer for `0 <= cc <= 255` (i.e., whether `-2^cc <= x < 2^cc`).\nIf not, either triggers an integer overflow exception, or replaces `x` with a `NaN` (quiet version)."
  },
  {
    "name": "CHKBOOL",
    "alias_of": "FITS",
    "tlb": "#B400",
    "doc_category": "arithm_logical",
    "doc_opcode": "B400",
    "doc_fift": "CHKBOOL",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a “boolean value'' (i.e., either 0 or -1)."
  },
  {
    "name": "UFITS",
    "alias_of": "",
    "tlb": "#B5 cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "B5cc",
    "doc_fift": "[cc+1] UFITS",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `cc+1`-bit unsigned integer for `0 <= cc <= 255` (i.e., whether `0 <= x < 2^(cc+1)`)."
  },
  {
    "name": "CHKBIT",
    "alias_of": "UFITS",
    "tlb": "#B500",
    "doc_category": "arithm_logical",
    "doc_opcode": "B500",
    "doc_fift": "CHKBIT",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a binary digit (i.e., zero or one)."
  },
  {
    "name": "FITSX",
    "alias_of": "",
    "tlb": "#B600",
    "doc_category": "arithm_logical",
    "doc_opcode": "B600",
    "doc_fift": "FITSX",
    "doc_stack": "x c - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `c`-bit signed integer for `0 <= c <= 1023`."
  },
  {
    "name": "UFITSX",
    "alias_of": "",
    "tlb": "#B601",
    "doc_category": "arithm_logical",
    "doc_opcode": "B601",
    "doc_fift": "UFITSX",
    "doc_stack": "x c - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `c`-bit unsigned integer for `0 <= c <= 1023`."
  },
  {
    "name": "BITSIZE",
    "alias_of": "",
    "tlb": "#B602",
    "doc_category": "arithm_logical",
    "doc_opcode": "B602",
    "doc_fift": "BITSIZE",
    "doc_stack": "x - c",
    "doc_gas": 26,
    "doc_description": "Computes smallest `c >= 0` such that `x` fits into a `c`-bit signed integer (`-2^(c-1) <= c < 2^(c-1)`)."
  },
  {
    "name": "UBITSIZE",
    "alias_of": "",
    "tlb": "#B603",
    "doc_category": "arithm_logical",
    "doc_opcode": "B603",
    "doc_fift": "UBITSIZE",
    "doc_stack": "x - c",
    "doc_gas": 26,
    "doc_description": "Computes smallest `c >= 0` such that `x` fits into a `c`-bit unsigned integer (`0 <= x < 2^c`), or throws a range check exception."
  },
  {
    "name": "MIN",
    "alias_of": "",
    "tlb": "#B608",
    "doc_category": "arithm_logical",
    "doc_opcode": "B608",
    "doc_fift": "MIN",
    "doc_stack": "x y - x or y",
    "doc_gas": 26,
    "doc_description": "Computes the minimum of two integers `x` and `y`."
  },
  {
    "name": "MAX",
    "alias_of": "",
    "tlb": "#B609",
    "doc_category": "arithm_logical",
    "doc_opcode": "B609",
    "doc_fift": "MAX",
    "doc_stack": "x y - x or y",
    "doc_gas": 26,
    "doc_description": "Computes the maximum of two integers `x` and `y`."
  },
  {
    "name": "MINMAX",
    "alias_of": "",
    "tlb": "#B60A",
    "doc_category": "arithm_logical",
    "doc_opcode": "B60A",
    "doc_fift": "MINMAX\nINTSORT2",
    "doc_stack": "x y - x y or y x",
    "doc_gas": 26,
    "doc_description": "Sorts two integers. Quiet version of this operation returns two `NaN`s if any of the arguments are `NaN`s."
  },
  {
    "name": "ABS",
    "alias_of": "",
    "tlb": "#B60B",
    "doc_category": "arithm_logical",
    "doc_opcode": "B60B",
    "doc_fift": "ABS",
    "doc_stack": "x - |x|",
    "doc_gas": 26,
    "doc_description": "Computes the absolute value of an integer `x`."
  },
  {
    "name": "QADD",
    "alias_of": "",
    "tlb": "#B7A0",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A0",
    "doc_fift": "QADD",
    "doc_stack": "x y - x+y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QSUB",
    "alias_of": "",
    "tlb": "#B7A1",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A1",
    "doc_fift": "QSUB",
    "doc_stack": "x y - x-y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QSUBR",
    "alias_of": "",
    "tlb": "#B7A2",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A2",
    "doc_fift": "QSUBR",
    "doc_stack": "x y - y-x",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QNEGATE",
    "alias_of": "",
    "tlb": "#B7A3",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A3",
    "doc_fift": "QNEGATE",
    "doc_stack": "x - -x",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QINC",
    "alias_of": "",
    "tlb": "#B7A4",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A4",
    "doc_fift": "QINC",
    "doc_stack": "x - x+1",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QDEC",
    "alias_of": "",
    "tlb": "#B7A5",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A5",
    "doc_fift": "QDEC",
    "doc_stack": "x - x-1",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QMUL",
    "alias_of": "",
    "tlb": "#B7A8",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A8",
    "doc_fift": "QMUL",
    "doc_stack": "x y - x*y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QDIV",
    "alias_of": "",
    "tlb": "#B7A904",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A904",
    "doc_fift": "QDIV",
    "doc_stack": "x y - q",
    "doc_gas": 34,
    "doc_description": "Division returns `NaN` if `y=0`."
  },
  {
    "name": "QDIVR",
    "alias_of": "",
    "tlb": "#B7A905",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A905",
    "doc_fift": "QDIVR",
    "doc_stack": "x y - q’",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVC",
    "alias_of": "",
    "tlb": "#B7A906",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A906",
    "doc_fift": "QDIVC",
    "doc_stack": "x y - q''",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QMOD",
    "alias_of": "",
    "tlb": "#B7A908",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A908",
    "doc_fift": "QMOD",
    "doc_stack": "x y - r",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVMOD",
    "alias_of": "",
    "tlb": "#B7A90C",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A90C",
    "doc_fift": "QDIVMOD",
    "doc_stack": "x y - q r",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVMODR",
    "alias_of": "",
    "tlb": "#B7A90D",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A90D",
    "doc_fift": "QDIVMODR",
    "doc_stack": "x y - q' r'",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVMODC",
    "alias_of": "",
    "tlb": "#B7A90E",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A90E",
    "doc_fift": "QDIVMODC",
    "doc_stack": "x y - q'' r''",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QMULDIVR",
    "alias_of": "",
    "tlb": "#B7A985",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A985",
    "doc_fift": "QMULDIVR",
    "doc_stack": "x y z - q'",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QMULDIVMOD",
    "alias_of": "",
    "tlb": "#B7A98C",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A98C",
    "doc_fift": "QMULDIVMOD",
    "doc_stack": "x y z - q r",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QLSHIFT",
    "alias_of": "",
    "tlb": "#B7AC",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7AC",
    "doc_fift": "QLSHIFT",
    "doc_stack": "x y - x*2^y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QRSHIFT",
    "alias_of": "",
    "tlb": "#B7AD",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7AD",
    "doc_fift": "QRSHIFT",
    "doc_stack": "x y - floor(x/2^y)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QPOW2",
    "alias_of": "",
    "tlb": "#B7AE",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7AE",
    "doc_fift": "QPOW2",
    "doc_stack": "y - 2^y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QAND",
    "alias_of": "",
    "tlb": "#B7B0",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B0",
    "doc_fift": "QAND",
    "doc_stack": "x y - x&y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QOR",
    "alias_of": "",
    "tlb": "#B7B1",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B1",
    "doc_fift": "QOR",
    "doc_stack": "x y - x|y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QXOR",
    "alias_of": "",
    "tlb": "#B7B2",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B2",
    "doc_fift": "QXOR",
    "doc_stack": "x y - x xor y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QNOT",
    "alias_of": "",
    "tlb": "#B7B3",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B3",
    "doc_fift": "QNOT",
    "doc_stack": "x - ~x",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QFITS",
    "alias_of": "",
    "tlb": "#B7B4 cc:uint8",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B4cc",
    "doc_fift": "[cc+1] QFITS",
    "doc_stack": "x - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a `cc+1`-bit signed integer, leaves it intact otherwise."
  },
  {
    "name": "QUFITS",
    "alias_of": "",
    "tlb": "#B7B5 cc:uint8",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B5cc",
    "doc_fift": "[cc+1] QUFITS",
    "doc_stack": "x - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a `cc+1`-bit unsigned integer, leaves it intact otherwise."
  },
  {
    "name": "QFITSX",
    "alias_of": "",
    "tlb": "#B7B600",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B600",
    "doc_fift": "QFITSX",
    "doc_stack": "x c - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a c-bit signed integer, leaves it intact otherwise."
  },
  {
    "name": "QUFITSX",
    "alias_of": "",
    "tlb": "#B7B601",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B601",
    "doc_fift": "QUFITSX",
    "doc_stack": "x c - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a c-bit unsigned integer, leaves it intact otherwise."
  },
  {
    "name": "MULADDDIVMOD",
    "alias_of": "",
    "tlb": "#A980",
    "doc_category": "arithm_div",
    "doc_opcode": "A980",
    "doc_fift": "MULADDDIVMOD",
    "doc_stack": "x y w z - q=floor((xy+w)/z) r=(xy+w)-zq",
    "doc_gas": 26,
    "doc_description": "Performs multiplication, addition, division, and modulo in one step. Calculates q as floor((xy+w)/z) and r as (xy+w)-zq."
  },
  {
    "name": "MULADDDIVMODR",
    "alias_of": "",
    "tlb": "#A981",
    "doc_category": "arithm_div",
    "doc_opcode": "A981",
    "doc_fift": "MULADDDIVMODR",
    "doc_stack": "x y w z - q=round((xy+w)/z) r=(xy+w)-zq",
    "doc_gas": 26,
    "doc_description": "Similar to MULADDDIVMOD but calculates q as round((xy+w)/z)."
  },
  {
    "name": "MULADDDIVMODC",
    "alias_of": "",
    "tlb": "#A982",
    "doc_category": "arithm_div",
    "doc_opcode": "A982",
    "doc_fift": "MULADDDIVMODC",
    "doc_stack": "x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq",
    "doc_gas": 26,
    "doc_description": "Similar to MULADDDIVMOD but calculates q as ceil((xy+w)/z)."
  },
  {
    "name": "ADDDIVMOD",
    "alias_of": "",
    "tlb": "#A900",
    "doc_category": "arithm_div",
    "doc_opcode": "A900",
    "doc_fift": "ADDDIVMOD",
    "doc_stack": "x w z - q=floor((x+w)/z) r=(x+w)-zq",
    "doc_gas": 26,
    "doc_description": "Performs addition, division, and modulo in one step. Calculates q as floor((x+w)/z) and r as (x+w)-zq."
  },
  {
    "name": "ADDDIVMODR",
    "alias_of": "",
    "tlb": "#A901",
    "doc_category": "arithm_div",
    "doc_opcode": "A901",
    "doc_fift": "ADDDIVMODR",
    "doc_stack": "x w z - q=round((x+w)/z) r=(x+w)-zq",
    "doc_gas": 26,
    "doc_description": "Similar to ADDDIVMOD but calculates q as round((x+w)/z)."
  },
  {
    "name": "ADDDIVMODC",
    "alias_of": "",
    "tlb": "#A902",
    "doc_category": "arithm_div",
    "doc_opcode": "A902",
    "doc_fift": "ADDDIVMODC",
    "doc_stack": "x w y - q=ceil((x+w)/z) r=(x+w)-zq",
    "doc_gas": 26,
    "doc_description": "Similar to ADDDIVMOD but calculates q as ceil((x+w)/z). Incorrect stack description in the provided data; assumed typo for 'z' instead of 'y' in the input stack."
  },
  {
    "name": "ADDRSHIFTMOD",
    "alias_of": "",
    "tlb": "#A920",
    "doc_category": "arithm_div",
    "doc_opcode": "A920",
    "doc_fift": "ADDRSHIFTMOD",
    "doc_stack": "x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z",
    "doc_gas": 26,
    "doc_description": "Performs addition, right shift, and modulo in one step. Calculates q as floor((x+w)/2^z) and r as (x+w)-q*2^z."
  },
  {
    "name": "ADDRSHIFTMODR",
    "alias_of": "",
    "tlb": "#A921",
    "doc_category": "arithm_div",
    "doc_opcode": "A921",
    "doc_fift": "ADDRSHIFTMODR",
    "doc_stack": "x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z",
    "doc_gas": 26,
    "doc_description": "Similar to ADDRSHIFTMOD but calculates q as round((x+w)/2^z)."
  },
  {
    "name": "ADDRSHIFTMODC",
    "alias_of": "",
    "tlb": "#A922",
    "doc_category": "arithm_div",
    "doc_opcode": "A922",
    "doc_fift": "ADDRSHIFTMODC",
    "doc_stack": "x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z",
    "doc_gas": 26,
    "doc_description": "Similar to ADDRSHIFTMOD but calculates q as ceil((x+w)/2^z)."
  },
  {
    "name": "MULADDRSHIFTMOD",
    "alias_of": "",
    "tlb": "#A9A0",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A0",
    "doc_fift": "MULADDRSHIFTMOD",
    "doc_stack": "x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z",
    "doc_gas": 26,
    "doc_description": "Combines multiplication, addition, right shift, and modulo. Calculates q as floor((xy+w)/2^z) and r as (xy+w)-q*2^z."
  },
  {
    "name": "MULADDRSHIFTRMOD",
    "alias_of": "",
    "tlb": "#A9A1",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A1",
    "doc_fift": "MULADDRSHIFTRMOD",
    "doc_stack": "x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z",
    "doc_gas": 26,
    "doc_description": "Similar to MULADDRSHIFTMOD but calculates q as round((xy+w)/2^z)."
  },
  {
    "name": "MULADDRSHIFTCMOD",
    "alias_of": "",
    "tlb": "#A9A2",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A2",
    "doc_fift": "MULADDRSHIFTCMOD",
    "doc_stack": "x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z",
    "doc_gas": 26,
    "doc_description": "Similar to MULADDRSHIFTMOD but calculates q as ceil((xy+w)/2^z)."
  },
  {
    "name": "LSHIFTADDDIVMOD",
    "alias_of": "",
    "tlb": "#A9D0 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D0tt",
    "doc_fift": "[tt+1] LSHIFT#ADDDIVMOD",
    "doc_stack": "x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq",
    "doc_gas": 34,
    "doc_description": "Performs left shift on x, adds w, then divides by z, rounding down for q and calculates remainder r."
  },
  {
    "name": "LSHIFTADDDIVMODR",
    "alias_of": "",
    "tlb": "#A9D1 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D1tt",
    "doc_fift": "[tt+1] LSHIFT#ADDDIVMODR",
    "doc_stack": "x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq",
    "doc_gas": 34,
    "doc_description": "Similar to LSHIFTADDDIVMOD but rounds q to the nearest integer."
  },
  {
    "name": "LSHIFTADDDIVMODC",
    "alias_of": "",
    "tlb": "#A9D2 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D2tt",
    "doc_fift": "[tt+1] LSHIFT#ADDDIVMODC",
    "doc_stack": "x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq",
    "doc_gas": 34,
    "doc_description": "Similar to LSHIFTADDDIVMOD but rounds q up to the nearest integer."
  }
]



================================================
FILE: src/data/opcodes/cell_manipulation.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/cell_manipulation.json
================================================
[
  {
    "name": "NEWC",
    "alias_of": "",
    "tlb": "#C8",
    "doc_category": "cell_build",
    "doc_opcode": "C8",
    "doc_fift": "NEWC",
    "doc_stack": "- b",
    "doc_gas": 18,
    "doc_description": "Creates a new empty _Builder_."
  },
  {
    "name": "ENDC",
    "alias_of": "",
    "tlb": "#C9",
    "doc_category": "cell_build",
    "doc_opcode": "C9",
    "doc_fift": "ENDC",
    "doc_stack": "b - c",
    "doc_gas": 518,
    "doc_description": "Converts a _Builder_ into an ordinary _Cell_."
  },
  {
    "name": "STI",
    "alias_of": "",
    "tlb": "#CA cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CAcc",
    "doc_fift": "[cc+1] STI",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a signed `cc+1`-bit integer `x` into _Builder_ `b` for `0 <= cc <= 255`, throws a range check exception if `x` does not fit into `cc+1` bits."
  },
  {
    "name": "STU",
    "alias_of": "",
    "tlb": "#CB cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CBcc",
    "doc_fift": "[cc+1] STU",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores an unsigned `cc+1`-bit integer `x` into _Builder_ `b`. In all other respects it is similar to `STI`."
  },
  {
    "name": "STREF",
    "alias_of": "",
    "tlb": "#CC",
    "doc_category": "cell_build",
    "doc_opcode": "CC",
    "doc_fift": "STREF",
    "doc_stack": "c b - b'",
    "doc_gas": 18,
    "doc_description": "Stores a reference to _Cell_ `c` into _Builder_ `b`."
  },
  {
    "name": "STBREFR",
    "alias_of": "",
    "tlb": "#CD",
    "doc_category": "cell_build",
    "doc_opcode": "CD",
    "doc_fift": "STBREFR\nENDCST",
    "doc_stack": "b b'' - b",
    "doc_gas": 518,
    "doc_description": "Equivalent to `ENDC` `SWAP` `STREF`."
  },
  {
    "name": "STSLICE",
    "alias_of": "",
    "tlb": "#CE",
    "doc_category": "cell_build",
    "doc_opcode": "CE",
    "doc_fift": "STSLICE",
    "doc_stack": "s b - b'",
    "doc_gas": 18,
    "doc_description": "Stores _Slice_ `s` into _Builder_ `b`."
  },
  {
    "name": "STIX",
    "alias_of": "",
    "tlb": "#CF00",
    "doc_category": "cell_build",
    "doc_opcode": "CF00",
    "doc_fift": "STIX",
    "doc_stack": "x b l - b'",
    "doc_gas": 26,
    "doc_description": "Stores a signed `l`-bit integer `x` into `b` for `0 <= l <= 257`."
  },
  {
    "name": "STUX",
    "alias_of": "",
    "tlb": "#CF01",
    "doc_category": "cell_build",
    "doc_opcode": "CF01",
    "doc_fift": "STUX",
    "doc_stack": "x b l - b'",
    "doc_gas": 26,
    "doc_description": "Stores an unsigned `l`-bit integer `x` into `b` for `0 <= l <= 256`."
  },
  {
    "name": "STIXR",
    "alias_of": "",
    "tlb": "#CF02",
    "doc_category": "cell_build",
    "doc_opcode": "CF02",
    "doc_fift": "STIXR",
    "doc_stack": "b x l - b'",
    "doc_gas": 26,
    "doc_description": "Similar to `STIX`, but with arguments in a different order."
  },
  {
    "name": "STUXR",
    "alias_of": "",
    "tlb": "#CF03",
    "doc_category": "cell_build",
    "doc_opcode": "CF03",
    "doc_fift": "STUXR",
    "doc_stack": "b x l - b'",
    "doc_gas": 26,
    "doc_description": "Similar to `STUX`, but with arguments in a different order."
  },
  {
    "name": "STIXQ",
    "alias_of": "",
    "tlb": "#CF04",
    "doc_category": "cell_build",
    "doc_opcode": "CF04",
    "doc_fift": "STIXQ",
    "doc_stack": "x b l - x b f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STIX`. If there is no space in `b`, sets `b'=b` and `f=-1`.\nIf `x` does not fit into `l` bits, sets `b'=b` and `f=1`.\nIf the operation succeeds, `b'` is the new _Builder_ and `f=0`.\nHowever, `0 <= l <= 257`, with a range check exception if this is not so."
  },
  {
    "name": "STUXQ",
    "alias_of": "",
    "tlb": "#CF05",
    "doc_category": "cell_build",
    "doc_opcode": "CF05",
    "doc_fift": "STUXQ",
    "doc_stack": "x b l - x b f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STUX`."
  },
  {
    "name": "STIXRQ",
    "alias_of": "",
    "tlb": "#CF06",
    "doc_category": "cell_build",
    "doc_opcode": "CF06",
    "doc_fift": "STIXRQ",
    "doc_stack": "b x l - b x f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STIXR`."
  },
  {
    "name": "STUXRQ",
    "alias_of": "",
    "tlb": "#CF07",
    "doc_category": "cell_build",
    "doc_opcode": "CF07",
    "doc_fift": "STUXRQ",
    "doc_stack": "b x l - b x f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STUXR`."
  },
  {
    "name": "STI_ALT",
    "alias_of": "",
    "tlb": "#CF08 cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF08cc",
    "doc_fift": "[cc+1] STI_l",
    "doc_stack": "x b - b'",
    "doc_gas": 34,
    "doc_description": "A longer version of `[cc+1] STI`."
  },
  {
    "name": "STU_ALT",
    "alias_of": "",
    "tlb": "#CF09 cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF09cc",
    "doc_fift": "[cc+1] STU_l",
    "doc_stack": "x b - b'",
    "doc_gas": 34,
    "doc_description": "A longer version of `[cc+1] STU`."
  },
  {
    "name": "STIR",
    "alias_of": "",
    "tlb": "#CF0A cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Acc",
    "doc_fift": "[cc+1] STIR",
    "doc_stack": "b x - b'",
    "doc_gas": 34,
    "doc_description": "Equivalent to `SWAP` `[cc+1] STI`."
  },
  {
    "name": "STUR",
    "alias_of": "",
    "tlb": "#CF0B cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Bcc",
    "doc_fift": "[cc+1] STUR",
    "doc_stack": "b x - b'",
    "doc_gas": 34,
    "doc_description": "Equivalent to `SWAP` `[cc+1] STU`."
  },
  {
    "name": "STIQ",
    "alias_of": "",
    "tlb": "#CF0C cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Ccc",
    "doc_fift": "[cc+1] STIQ",
    "doc_stack": "x b - x b f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STI`."
  },
  {
    "name": "STUQ",
    "alias_of": "",
    "tlb": "#CF0D cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Dcc",
    "doc_fift": "[cc+1] STUQ",
    "doc_stack": "x b - x b f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STU`."
  },
  {
    "name": "STIRQ",
    "alias_of": "",
    "tlb": "#CF0E cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Ecc",
    "doc_fift": "[cc+1] STIRQ",
    "doc_stack": "b x - b x f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STIR`."
  },
  {
    "name": "STURQ",
    "alias_of": "",
    "tlb": "#CF0F cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Fcc",
    "doc_fift": "[cc+1] STURQ",
    "doc_stack": "b x - b x f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STUR`."
  },
  {
    "name": "STREF_ALT",
    "alias_of": "",
    "tlb": "#CF10",
    "doc_category": "cell_build",
    "doc_opcode": "CF10",
    "doc_fift": "STREF_l",
    "doc_stack": "c b - b'",
    "doc_gas": 26,
    "doc_description": "A longer version of `STREF`."
  },
  {
    "name": "STBREF",
    "alias_of": "",
    "tlb": "#CF11",
    "doc_category": "cell_build",
    "doc_opcode": "CF11",
    "doc_fift": "STBREF",
    "doc_stack": "b' b - b''",
    "doc_gas": 526,
    "doc_description": "Equivalent to `SWAP` `STBREFR`."
  },
  {
    "name": "STSLICE_ALT",
    "alias_of": "",
    "tlb": "#CF12",
    "doc_category": "cell_build",
    "doc_opcode": "CF12",
    "doc_fift": "STSLICE_l",
    "doc_stack": "s b - b'",
    "doc_gas": 26,
    "doc_description": "A longer version of `STSLICE`."
  },
  {
    "name": "STB",
    "alias_of": "",
    "tlb": "#CF13",
    "doc_category": "cell_build",
    "doc_opcode": "CF13",
    "doc_fift": "STB",
    "doc_stack": "b' b - b''",
    "doc_gas": 26,
    "doc_description": "Appends all data from _Builder_ `b'` to _Builder_ `b`."
  },
  {
    "name": "STREFR",
    "alias_of": "",
    "tlb": "#CF14",
    "doc_category": "cell_build",
    "doc_opcode": "CF14",
    "doc_fift": "STREFR",
    "doc_stack": "b c - b'",
    "doc_gas": 26,
    "doc_description": "Equivalent to `SWAP` `STREF`."
  },
  {
    "name": "STBREFR_ALT",
    "alias_of": "",
    "tlb": "#CF15",
    "doc_category": "cell_build",
    "doc_opcode": "CF15",
    "doc_fift": "STBREFR_l",
    "doc_stack": "b b' - b''",
    "doc_gas": 526,
    "doc_description": "A longer encoding of `STBREFR`."
  },
  {
    "name": "STSLICER",
    "alias_of": "",
    "tlb": "#CF16",
    "doc_category": "cell_build",
    "doc_opcode": "CF16",
    "doc_fift": "STSLICER",
    "doc_stack": "b s - b'",
    "doc_gas": 26,
    "doc_description": "Equivalent to `SWAP` `STSLICE`."
  },
  {
    "name": "STBR",
    "alias_of": "",
    "tlb": "#CF17",
    "doc_category": "cell_build",
    "doc_opcode": "CF17",
    "doc_fift": "STBR\nBCONCAT",
    "doc_stack": "b b' - b''",
    "doc_gas": 26,
    "doc_description": "Concatenates two builders.\nEquivalent to `SWAP` `STB`."
  },
  {
    "name": "STREFQ",
    "alias_of": "",
    "tlb": "#CF18",
    "doc_category": "cell_build",
    "doc_opcode": "CF18",
    "doc_fift": "STREFQ",
    "doc_stack": "c b - c b -1 or b' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STREF`."
  },
  {
    "name": "STBREFQ",
    "alias_of": "",
    "tlb": "#CF19",
    "doc_category": "cell_build",
    "doc_opcode": "CF19",
    "doc_fift": "STBREFQ",
    "doc_stack": "b' b - b' b -1 or b'' 0",
    "doc_gas": 526,
    "doc_description": "Quiet version of `STBREF`."
  },
  {
    "name": "STSLICEQ",
    "alias_of": "",
    "tlb": "#CF1A",
    "doc_category": "cell_build",
    "doc_opcode": "CF1A",
    "doc_fift": "STSLICEQ",
    "doc_stack": "s b - s b -1 or b' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STSLICE`."
  },
  {
    "name": "STBQ",
    "alias_of": "",
    "tlb": "#CF1B",
    "doc_category": "cell_build",
    "doc_opcode": "CF1B",
    "doc_fift": "STBQ",
    "doc_stack": "b' b - b' b -1 or b'' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STB`."
  },
  {
    "name": "STREFRQ",
    "alias_of": "",
    "tlb": "#CF1C",
    "doc_category": "cell_build",
    "doc_opcode": "CF1C",
    "doc_fift": "STREFRQ",
    "doc_stack": "b c - b c -1 or b' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STREFR`."
  },
  {
    "name": "STBREFRQ",
    "alias_of": "",
    "tlb": "#CF1D",
    "doc_category": "cell_build",
    "doc_opcode": "CF1D",
    "doc_fift": "STBREFRQ",
    "doc_stack": "b b' - b b' -1 or b'' 0",
    "doc_gas": 526,
    "doc_description": "Quiet version of `STBREFR`."
  },
  {
    "name": "STSLICERQ",
    "alias_of": "",
    "tlb": "#CF1E",
    "doc_category": "cell_build",
    "doc_opcode": "CF1E",
    "doc_fift": "STSLICERQ",
    "doc_stack": "b s - b s -1 or b'' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STSLICER`."
  },
  {
    "name": "STBRQ",
    "alias_of": "",
    "tlb": "#CF1F",
    "doc_category": "cell_build",
    "doc_opcode": "CF1F",
    "doc_fift": "STBRQ\nBCONCATQ",
    "doc_stack": "b b' - b b' -1 or b'' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STBR`."
  },
  {
    "name": "STREFCONST",
    "alias_of": "",
    "tlb": "#CF20 c:^Cell",
    "doc_category": "cell_build",
    "doc_opcode": "CF20",
    "doc_fift": "[ref] STREFCONST",
    "doc_stack": "b - b’",
    "doc_gas": 26,
    "doc_description": "Equivalent to `PUSHREF` `STREFR`."
  },
  {
    "name": "STREF2CONST",
    "alias_of": "",
    "tlb": "#CF21 c1:^Cell c2:^Cell",
    "doc_category": "cell_build",
    "doc_opcode": "CF21",
    "doc_fift": "[ref] [ref] STREF2CONST",
    "doc_stack": "b - b’",
    "doc_gas": 26,
    "doc_description": "Equivalent to `STREFCONST` `STREFCONST`."
  },
  {
    "name": "ENDXC",
    "alias_of": "",
    "tlb": "#CF23",
    "doc_category": "cell_build",
    "doc_opcode": "CF23",
    "doc_fift": "",
    "doc_stack": "b x - c",
    "doc_gas": 526,
    "doc_description": "If `x!=0`, creates a _special_ or _exotic_ cell from _Builder_ `b`.\nThe type of the exotic cell must be stored in the first 8 bits of `b`.\nIf `x=0`, it is equivalent to `ENDC`. Otherwise some validity checks on the data and references of `b` are performed before creating the exotic cell."
  },
  {
    "name": "STILE4",
    "alias_of": "",
    "tlb": "#CF28",
    "doc_category": "cell_build",
    "doc_opcode": "CF28",
    "doc_fift": "STILE4",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian signed 32-bit integer."
  },
  {
    "name": "STULE4",
    "alias_of": "",
    "tlb": "#CF29",
    "doc_category": "cell_build",
    "doc_opcode": "CF29",
    "doc_fift": "STULE4",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian unsigned 32-bit integer."
  },
  {
    "name": "STILE8",
    "alias_of": "",
    "tlb": "#CF2A",
    "doc_category": "cell_build",
    "doc_opcode": "CF2A",
    "doc_fift": "STILE8",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian signed 64-bit integer."
  },
  {
    "name": "STULE8",
    "alias_of": "",
    "tlb": "#CF2B",
    "doc_category": "cell_build",
    "doc_opcode": "CF2B",
    "doc_fift": "STULE8",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian unsigned 64-bit integer."
  },
  {
    "name": "BDEPTH",
    "alias_of": "",
    "tlb": "#CF30",
    "doc_category": "cell_build",
    "doc_opcode": "CF30",
    "doc_fift": "BDEPTH",
    "doc_stack": "b - x",
    "doc_gas": 26,
    "doc_description": "Returns the depth of _Builder_ `b`. If no cell references are stored in `b`, then `x=0`; otherwise `x` is one plus the maximum of depths of cells referred to from `b`."
  },
  {
    "name": "BBITS",
    "alias_of": "",
    "tlb": "#CF31",
    "doc_category": "cell_build",
    "doc_opcode": "CF31",
    "doc_fift": "BBITS",
    "doc_stack": "b - x",
    "doc_gas": 26,
    "doc_description": "Returns the number of data bits already stored in _Builder_ `b`."
  },
  {
    "name": "BREFS",
    "alias_of": "",
    "tlb": "#CF32",
    "doc_category": "cell_build",
    "doc_opcode": "CF32",
    "doc_fift": "BREFS",
    "doc_stack": "b - y",
    "doc_gas": 26,
    "doc_description": "Returns the number of cell references already stored in `b`."
  },
  {
    "name": "BBITREFS",
    "alias_of": "",
    "tlb": "#CF33",
    "doc_category": "cell_build",
    "doc_opcode": "CF33",
    "doc_fift": "BBITREFS",
    "doc_stack": "b - x y",
    "doc_gas": 26,
    "doc_description": "Returns the numbers of both data bits and cell references in `b`."
  },
  {
    "name": "BREMBITS",
    "alias_of": "",
    "tlb": "#CF35",
    "doc_category": "cell_build",
    "doc_opcode": "CF35",
    "doc_fift": "BREMBITS",
    "doc_stack": "b - x'",
    "doc_gas": 26,
    "doc_description": "Returns the number of data bits that can still be stored in `b`."
  },
  {
    "name": "BREMREFS",
    "alias_of": "",
    "tlb": "#CF36",
    "doc_category": "cell_build",
    "doc_opcode": "CF36",
    "doc_fift": "BREMREFS",
    "doc_stack": "b - y'",
    "doc_gas": 26,
    "doc_description": "Returns the number of references that can still be stored in `b`."
  },
  {
    "name": "BREMBITREFS",
    "alias_of": "",
    "tlb": "#CF37",
    "doc_category": "cell_build",
    "doc_opcode": "CF37",
    "doc_fift": "BREMBITREFS",
    "doc_stack": "b - x' y'",
    "doc_gas": 26,
    "doc_description": "Returns the numbers of both data bits and references that can still be stored in `b`."
  },
  {
    "name": "BCHKBITS",
    "alias_of": "",
    "tlb": "#CF38 cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF38cc",
    "doc_fift": "[cc+1] BCHKBITS#",
    "doc_stack": "b -",
    "doc_gas": "34/84",
    "doc_description": "Checks whether `cc+1` bits can be stored into `b`, where `0 <= cc <= 255`."
  },
  {
    "name": "BCHKBITS_VAR",
    "alias_of": "",
    "tlb": "#CF39",
    "doc_category": "cell_build",
    "doc_opcode": "CF39",
    "doc_fift": "BCHKBITS",
    "doc_stack": "b x -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` bits can be stored into `b`, `0 <= x <= 1023`. If there is no space for `x` more bits in `b`, or if `x` is not within the range `0...1023`, throws an exception."
  },
  {
    "name": "BCHKREFS",
    "alias_of": "",
    "tlb": "#CF3A",
    "doc_category": "cell_build",
    "doc_opcode": "CF3A",
    "doc_fift": "BCHKREFS",
    "doc_stack": "b y -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `y` references can be stored into `b`, `0 <= y <= 7`."
  },
  {
    "name": "BCHKBITREFS",
    "alias_of": "",
    "tlb": "#CF3B",
    "doc_category": "cell_build",
    "doc_opcode": "CF3B",
    "doc_fift": "BCHKBITREFS",
    "doc_stack": "b x y -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` bits and `y` references can be stored into `b`, `0 <= x <= 1023`, `0 <= y <= 7`."
  },
  {
    "name": "BCHKBITSQ",
    "alias_of": "",
    "tlb": "#CF3C cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF3Ccc",
    "doc_fift": "[cc+1] BCHKBITSQ#",
    "doc_stack": "b - ?",
    "doc_gas": 34,
    "doc_description": "Checks whether `cc+1` bits can be stored into `b`, where `0 <= cc <= 255`."
  },
  {
    "name": "BCHKBITSQ_VAR",
    "alias_of": "",
    "tlb": "#CF3D",
    "doc_category": "cell_build",
    "doc_opcode": "CF3D",
    "doc_fift": "BCHKBITSQ",
    "doc_stack": "b x - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `x` bits can be stored into `b`, `0 <= x <= 1023`."
  },
  {
    "name": "BCHKREFSQ",
    "alias_of": "",
    "tlb": "#CF3E",
    "doc_category": "cell_build",
    "doc_opcode": "CF3E",
    "doc_fift": "BCHKREFSQ",
    "doc_stack": "b y - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `y` references can be stored into `b`, `0 <= y <= 7`."
  },
  {
    "name": "BCHKBITREFSQ",
    "alias_of": "",
    "tlb": "#CF3F",
    "doc_category": "cell_build",
    "doc_opcode": "CF3F",
    "doc_fift": "BCHKBITREFSQ",
    "doc_stack": "b x y - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `x` bits and `y` references can be stored into `b`, `0 <= x <= 1023`, `0 <= y <= 7`."
  },
  {
    "name": "STZEROES",
    "alias_of": "",
    "tlb": "#CF40",
    "doc_category": "cell_build",
    "doc_opcode": "CF40",
    "doc_fift": "STZEROES",
    "doc_stack": "b n - b'",
    "doc_gas": 26,
    "doc_description": "Stores `n` binary zeroes into _Builder_ `b`."
  },
  {
    "name": "STONES",
    "alias_of": "",
    "tlb": "#CF41",
    "doc_category": "cell_build",
    "doc_opcode": "CF41",
    "doc_fift": "STONES",
    "doc_stack": "b n - b'",
    "doc_gas": 26,
    "doc_description": "Stores `n` binary ones into _Builder_ `b`."
  },
  {
    "name": "STSAME",
    "alias_of": "",
    "tlb": "#CF42",
    "doc_category": "cell_build",
    "doc_opcode": "CF42",
    "doc_fift": "STSAME",
    "doc_stack": "b n x - b'",
    "doc_gas": 26,
    "doc_description": "Stores `n` binary `x`es (`0 <= x <= 1`) into _Builder_ `b`."
  },
  {
    "name": "STSLICECONST",
    "alias_of": "",
    "tlb": "#CFC0_ x:(## 2) y:(## 3) c:(x * ^Cell) sss:((8 * y + 2) * Bit)",
    "doc_category": "cell_build",
    "doc_opcode": "CFC0_xysss",
    "doc_fift": "[slice] STSLICECONST",
    "doc_stack": "b - b'",
    "doc_gas": 24,
    "doc_description": "Stores a constant subslice `sss`.\n_Details:_ `sss` consists of `0 <= x <= 3` references and up to `8y+2` data bits, with `0 <= y <= 7`. Completion bit is assumed.\nNote that the assembler can replace `STSLICECONST` with `PUSHSLICE` `STSLICER` if the slice is too big."
  },
  {
    "name": "STZERO",
    "alias_of": "STSLICECONST",
    "tlb": "#CF81",
    "doc_category": "cell_build",
    "doc_opcode": "CF81",
    "doc_fift": "STZERO",
    "doc_stack": "b - b'",
    "doc_gas": 24,
    "doc_description": "Stores one binary zero."
  },
  {
    "name": "STONE",
    "alias_of": "STSLICECONST",
    "tlb": "#CF83",
    "doc_category": "cell_build",
    "doc_opcode": "CF83",
    "doc_fift": "STONE",
    "doc_stack": "b - b'",
    "doc_gas": 24,
    "doc_description": "Stores one binary one."
  },
  {
    "name": "CTOS",
    "alias_of": "",
    "tlb": "#D0",
    "doc_category": "cell_parse",
    "doc_opcode": "D0",
    "doc_fift": "CTOS",
    "doc_stack": "c - s",
    "doc_gas": "118/43",
    "doc_description": "Converts a _Cell_ into a _Slice_. Notice that `c` must be either an ordinary cell, or an exotic cell which is automatically _loaded_ to yield an ordinary cell `c'`, converted into a _Slice_ afterwards."
  },
  {
    "name": "ENDS",
    "alias_of": "",
    "tlb": "#D1",
    "doc_category": "cell_parse",
    "doc_opcode": "D1",
    "doc_fift": "ENDS",
    "doc_stack": "s -",
    "doc_gas": "18/68",
    "doc_description": "Removes a _Slice_ `s` from the stack, and throws an exception if it is not empty."
  },
  {
    "name": "LDI",
    "alias_of": "",
    "tlb": "#D2 cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D2cc",
    "doc_fift": "[cc+1] LDI",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads (i.e., parses) a signed `cc+1`-bit integer `x` from _Slice_ `s`, and returns the remainder of `s` as `s'`."
  },
  {
    "name": "LDU",
    "alias_of": "",
    "tlb": "#D3 cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D3cc",
    "doc_fift": "[cc+1] LDU",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads an unsigned `cc+1`-bit integer `x` from _Slice_ `s`."
  },
  {
    "name": "LDREF",
    "alias_of": "",
    "tlb": "#D4",
    "doc_category": "cell_parse",
    "doc_opcode": "D4",
    "doc_fift": "LDREF",
    "doc_stack": "s - c s'",
    "doc_gas": 18,
    "doc_description": "Loads a cell reference `c` from `s`."
  },
  {
    "name": "LDREFRTOS",
    "alias_of": "",
    "tlb": "#D5",
    "doc_category": "cell_parse",
    "doc_opcode": "D5",
    "doc_fift": "LDREFRTOS",
    "doc_stack": "s - s' s''",
    "doc_gas": "118/43",
    "doc_description": "Equivalent to `LDREF` `SWAP` `CTOS`."
  },
  {
    "name": "LDSLICE",
    "alias_of": "",
    "tlb": "#D6 cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D6cc",
    "doc_fift": "[cc+1] LDSLICE",
    "doc_stack": "s - s'' s'",
    "doc_gas": 26,
    "doc_description": "Cuts the next `cc+1` bits of `s` into a separate _Slice_ `s''`."
  },
  {
    "name": "LDIX",
    "alias_of": "",
    "tlb": "#D700",
    "doc_category": "cell_parse",
    "doc_opcode": "D700",
    "doc_fift": "LDIX",
    "doc_stack": "s l - x s'",
    "doc_gas": 26,
    "doc_description": "Loads a signed `l`-bit (`0 <= l <= 257`) integer `x` from _Slice_ `s`, and returns the remainder of `s` as `s'`."
  },
  {
    "name": "LDUX",
    "alias_of": "",
    "tlb": "#D701",
    "doc_category": "cell_parse",
    "doc_opcode": "D701",
    "doc_fift": "LDUX",
    "doc_stack": "s l - x s'",
    "doc_gas": 26,
    "doc_description": "Loads an unsigned `l`-bit integer `x` from (the first `l` bits of) `s`, with `0 <= l <= 256`."
  },
  {
    "name": "PLDIX",
    "alias_of": "",
    "tlb": "#D702",
    "doc_category": "cell_parse",
    "doc_opcode": "D702",
    "doc_fift": "PLDIX",
    "doc_stack": "s l - x",
    "doc_gas": 26,
    "doc_description": "Preloads a signed `l`-bit integer from _Slice_ `s`, for `0 <= l <= 257`."
  },
  {
    "name": "PLDUX",
    "alias_of": "",
    "tlb": "#D703",
    "doc_category": "cell_parse",
    "doc_opcode": "D703",
    "doc_fift": "PLDUX",
    "doc_stack": "s l - x",
    "doc_gas": 26,
    "doc_description": "Preloads an unsigned `l`-bit integer from `s`, for `0 <= l <= 256`."
  },
  {
    "name": "LDIXQ",
    "alias_of": "",
    "tlb": "#D704",
    "doc_category": "cell_parse",
    "doc_opcode": "D704",
    "doc_fift": "LDIXQ",
    "doc_stack": "s l - x s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `LDIX`: loads a signed `l`-bit integer from `s` similarly to `LDIX`, but returns a success flag, equal to `-1` on success or to `0` on failure (if `s` does not have `l` bits), instead of throwing a cell underflow exception."
  },
  {
    "name": "LDUXQ",
    "alias_of": "",
    "tlb": "#D705",
    "doc_category": "cell_parse",
    "doc_opcode": "D705",
    "doc_fift": "LDUXQ",
    "doc_stack": "s l - x s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `LDUX`."
  },
  {
    "name": "PLDIXQ",
    "alias_of": "",
    "tlb": "#D706",
    "doc_category": "cell_parse",
    "doc_opcode": "D706",
    "doc_fift": "PLDIXQ",
    "doc_stack": "s l - x -1 or 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `PLDIX`."
  },
  {
    "name": "PLDUXQ",
    "alias_of": "",
    "tlb": "#D707",
    "doc_category": "cell_parse",
    "doc_opcode": "D707",
    "doc_fift": "PLDUXQ",
    "doc_stack": "s l - x -1 or 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `PLDUX`."
  },
  {
    "name": "LDI_ALT",
    "alias_of": "",
    "tlb": "#D708 cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D708cc",
    "doc_fift": "[cc+1] LDI_l",
    "doc_stack": "s - x s'",
    "doc_gas": 34,
    "doc_description": "A longer encoding for `LDI`."
  },
  {
    "name": "LDU_ALT",
    "alias_of": "",
    "tlb": "#D709 cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D709cc",
    "doc_fift": "[cc+1] LDU_l",
    "doc_stack": "s - x s'",
    "doc_gas": 34,
    "doc_description": "A longer encoding for `LDU`."
  },
  {
    "name": "PLDI",
    "alias_of": "",
    "tlb": "#D70A cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D70Acc",
    "doc_fift": "[cc+1] PLDI",
    "doc_stack": "s - x",
    "doc_gas": 34,
    "doc_description": "Preloads a signed `cc+1`-bit integer from _Slice_ `s`."
  },
  {
    "name": "PLDU",
    "alias_of": "",
    "tlb": "#D70B cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D70Bcc",
    "doc_fift": "[cc+1] PLDU",
    "doc_stack": "s - x",
    "doc_gas": 34,
    "doc_description": "Preloads an unsigned `cc+1`-bit integer from `s`."
  },
  {
    "name": "LDIQ",
    "alias_of": "",
    "tlb": "#D70C cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D70Ccc",
    "doc_fift": "[cc+1] LDIQ",
    "doc_stack": "s - x s' -1 or s 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `LDI`."
  },
  {
    "name": "LDUQ",
    "alias_of": "",
    "tlb": "#D70D cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D70Dcc",
    "doc_fift": "[cc+1] LDUQ",
    "doc_stack": "s - x s' -1 or s 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `LDU`."
  },
  {
    "name": "PLDIQ",
    "alias_of": "",
    "tlb": "#D70E cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D70Ecc",
    "doc_fift": "[cc+1] PLDIQ",
    "doc_stack": "s - x -1 or 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `PLDI`."
  },
  {
    "name": "PLDUQ",
    "alias_of": "",
    "tlb": "#D70F cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D70Fcc",
    "doc_fift": "[cc+1] PLDUQ",
    "doc_stack": "s - x -1 or 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `PLDU`."
  },
  {
    "name": "PLDUZ",
    "alias_of": "",
    "tlb": "#D714_ c:uint3",
    "doc_category": "cell_parse",
    "doc_opcode": "D714_c",
    "doc_fift": "[32(c+1)] PLDUZ",
    "doc_stack": "s - s x",
    "doc_gas": 26,
    "doc_description": "Preloads the first `32(c+1)` bits of _Slice_ `s` into an unsigned integer `x`, for `0 <= c <= 7`. If `s` is shorter than necessary, missing bits are assumed to be zero. This operation is intended to be used along with `IFBITJMP` and similar instructions."
  },
  {
    "name": "LDSLICEX",
    "alias_of": "",
    "tlb": "#D718",
    "doc_category": "cell_parse",
    "doc_opcode": "D718",
    "doc_fift": "LDSLICEX",
    "doc_stack": "s l - s'' s'",
    "doc_gas": 26,
    "doc_description": "Loads the first `0 <= l <= 1023` bits from _Slice_ `s` into a separate _Slice_ `s''`, returning the remainder of `s` as `s'`."
  },
  {
    "name": "PLDSLICEX",
    "alias_of": "",
    "tlb": "#D719",
    "doc_category": "cell_parse",
    "doc_opcode": "D719",
    "doc_fift": "PLDSLICEX",
    "doc_stack": "s l - s''",
    "doc_gas": 26,
    "doc_description": "Returns the first `0 <= l <= 1023` bits of `s` as `s''`."
  },
  {
    "name": "LDSLICEXQ",
    "alias_of": "",
    "tlb": "#D71A",
    "doc_category": "cell_parse",
    "doc_opcode": "D71A",
    "doc_fift": "LDSLICEXQ",
    "doc_stack": "s l - s'' s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `LDSLICEX`."
  },
  {
    "name": "PLDSLICEXQ",
    "alias_of": "",
    "tlb": "#D71B",
    "doc_category": "cell_parse",
    "doc_opcode": "D71B",
    "doc_fift": "PLDSLICEXQ",
    "doc_stack": "s l - s' -1 or 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `LDSLICEXQ`."
  },
  {
    "name": "LDSLICE_ALT",
    "alias_of": "",
    "tlb": "#D71C cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D71Ccc",
    "doc_fift": "[cc+1] LDSLICE_l",
    "doc_stack": "s - s'' s'",
    "doc_gas": 34,
    "doc_description": "A longer encoding for `LDSLICE`."
  },
  {
    "name": "PLDSLICE",
    "alias_of": "",
    "tlb": "#D71D cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D71Dcc",
    "doc_fift": "[cc+1] PLDSLICE",
    "doc_stack": "s - s''",
    "doc_gas": 34,
    "doc_description": "Returns the first `0 < cc+1 <= 256` bits of `s` as `s''`."
  },
  {
    "name": "LDSLICEQ",
    "alias_of": "",
    "tlb": "#D71E cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D71Ecc",
    "doc_fift": "[cc+1] LDSLICEQ",
    "doc_stack": "s - s'' s' -1 or s 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `LDSLICE`."
  },
  {
    "name": "PLDSLICEQ",
    "alias_of": "",
    "tlb": "#D71F cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D71Fcc",
    "doc_fift": "[cc+1] PLDSLICEQ",
    "doc_stack": "s - s'' -1 or 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `PLDSLICE`."
  },
  {
    "name": "SDCUTFIRST",
    "alias_of": "",
    "tlb": "#D720",
    "doc_category": "cell_parse",
    "doc_opcode": "D720",
    "doc_fift": "SDCUTFIRST",
    "doc_stack": "s l - s'",
    "doc_gas": 26,
    "doc_description": "Returns the first `0 <= l <= 1023` bits of `s`. It is equivalent to `PLDSLICEX`."
  },
  {
    "name": "SDSKIPFIRST",
    "alias_of": "",
    "tlb": "#D721",
    "doc_category": "cell_parse",
    "doc_opcode": "D721",
    "doc_fift": "SDSKIPFIRST",
    "doc_stack": "s l - s'",
    "doc_gas": 26,
    "doc_description": "Returns all but the first `0 <= l <= 1023` bits of `s`. It is equivalent to `LDSLICEX` `NIP`."
  },
  {
    "name": "SDCUTLAST",
    "alias_of": "",
    "tlb": "#D722",
    "doc_category": "cell_parse",
    "doc_opcode": "D722",
    "doc_fift": "SDCUTLAST",
    "doc_stack": "s l - s'",
    "doc_gas": 26,
    "doc_description": "Returns the last `0 <= l <= 1023` bits of `s`."
  },
  {
    "name": "SDSKIPLAST",
    "alias_of": "",
    "tlb": "#D723",
    "doc_category": "cell_parse",
    "doc_opcode": "D723",
    "doc_fift": "SDSKIPLAST",
    "doc_stack": "s l - s'",
    "doc_gas": 26,
    "doc_description": "Returns all but the last `0 <= l <= 1023` bits of `s`."
  },
  {
    "name": "SDSUBSTR",
    "alias_of": "",
    "tlb": "#D724",
    "doc_category": "cell_parse",
    "doc_opcode": "D724",
    "doc_fift": "SDSUBSTR",
    "doc_stack": "s l l' - s'",
    "doc_gas": 26,
    "doc_description": "Returns `0 <= l' <= 1023` bits of `s` starting from offset `0 <= l <= 1023`, thus extracting a bit substring out of the data of `s`."
  },
  {
    "name": "SDBEGINSX",
    "alias_of": "",
    "tlb": "#D726",
    "doc_category": "cell_parse",
    "doc_opcode": "D726",
    "doc_fift": "SDBEGINSX",
    "doc_stack": "s s' - s''",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` begins with (the data bits of) `s'`, and removes `s'` from `s` on success. On failure throws a cell deserialization exception. Primitive `SDPFXREV` can be considered a quiet version of `SDBEGINSX`."
  },
  {
    "name": "SDBEGINSXQ",
    "alias_of": "",
    "tlb": "#D727",
    "doc_category": "cell_parse",
    "doc_opcode": "D727",
    "doc_fift": "SDBEGINSXQ",
    "doc_stack": "s s' - s'' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `SDBEGINSX`."
  },
  {
    "name": "SDBEGINS",
    "alias_of": "",
    "tlb": "#D72A_ x:(## 7) sss:((8 * x + 3) * Bit)",
    "doc_category": "cell_parse",
    "doc_opcode": "D72A_xsss",
    "doc_fift": "[slice] SDBEGINS",
    "doc_stack": "s - s''",
    "doc_gas": 31,
    "doc_description": "Checks whether `s` begins with constant bitstring `sss` of length `8x+3` (with continuation bit assumed), where `0 <= x <= 127`, and removes `sss` from `s` on success."
  },
  {
    "name": "SDBEGINSQ",
    "alias_of": "",
    "tlb": "#D72E_ x:(## 7) sss:((8 * x + 3) * Bit)",
    "doc_category": "cell_parse",
    "doc_opcode": "D72E_xsss",
    "doc_fift": "[slice] SDBEGINSQ",
    "doc_stack": "s - s'' -1 or s 0",
    "doc_gas": 31,
    "doc_description": "A quiet version of `SDBEGINS`."
  },
  {
    "name": "SCUTFIRST",
    "alias_of": "",
    "tlb": "#D730",
    "doc_category": "cell_parse",
    "doc_opcode": "D730",
    "doc_fift": "SCUTFIRST",
    "doc_stack": "s l r - s'",
    "doc_gas": 26,
    "doc_description": "Returns the first `0 <= l <= 1023` bits and first `0 <= r <= 4` references of `s`."
  },
  {
    "name": "SSKIPFIRST",
    "alias_of": "",
    "tlb": "#D731",
    "doc_category": "cell_parse",
    "doc_opcode": "D731",
    "doc_fift": "SSKIPFIRST",
    "doc_stack": "s l r - s'",
    "doc_gas": 26,
    "doc_description": "Returns all but the first `l` bits of `s` and `r` references of `s`."
  },
  {
    "name": "SCUTLAST",
    "alias_of": "",
    "tlb": "#D732",
    "doc_category": "cell_parse",
    "doc_opcode": "D732",
    "doc_fift": "SCUTLAST",
    "doc_stack": "s l r - s'",
    "doc_gas": 26,
    "doc_description": "Returns the last `0 <= l <= 1023` data bits and last `0 <= r <= 4` references of `s`."
  },
  {
    "name": "SSKIPLAST",
    "alias_of": "",
    "tlb": "#D733",
    "doc_category": "cell_parse",
    "doc_opcode": "D733",
    "doc_fift": "SSKIPLAST",
    "doc_stack": "s l r - s'",
    "doc_gas": 26,
    "doc_description": "Returns all but the last `l` bits of `s` and `r` references of `s`."
  },
  {
    "name": "SUBSLICE",
    "alias_of": "",
    "tlb": "#D734",
    "doc_category": "cell_parse",
    "doc_opcode": "D734",
    "doc_fift": "SUBSLICE",
    "doc_stack": "s l r l' r' - s'",
    "doc_gas": 26,
    "doc_description": "Returns `0 <= l' <= 1023` bits and `0 <= r' <= 4` references from _Slice_ `s`, after skipping the first `0 <= l <= 1023` bits and first `0 <= r <= 4` references."
  },
  {
    "name": "SPLIT",
    "alias_of": "",
    "tlb": "#D736",
    "doc_category": "cell_parse",
    "doc_opcode": "D736",
    "doc_fift": "SPLIT",
    "doc_stack": "s l r - s' s''",
    "doc_gas": 26,
    "doc_description": "Splits the first `0 <= l <= 1023` data bits and first `0 <= r <= 4` references from `s` into `s'`, returning the remainder of `s` as `s''`."
  },
  {
    "name": "SPLITQ",
    "alias_of": "",
    "tlb": "#D737",
    "doc_category": "cell_parse",
    "doc_opcode": "D737",
    "doc_fift": "SPLITQ",
    "doc_stack": "s l r - s' s'' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `SPLIT`."
  },
  {
    "name": "XCTOS",
    "alias_of": "",
    "tlb": "#D739",
    "doc_category": "cell_parse",
    "doc_opcode": "D739",
    "doc_fift": "",
    "doc_stack": "c - s ?",
    "doc_gas": "",
    "doc_description": "Transforms an ordinary or exotic cell into a _Slice_, as if it were an ordinary cell. A flag is returned indicating whether `c` is exotic. If that be the case, its type can later be deserialized from the first eight bits of `s`."
  },
  {
    "name": "XLOAD",
    "alias_of": "",
    "tlb": "#D73A",
    "doc_category": "cell_parse",
    "doc_opcode": "D73A",
    "doc_fift": "",
    "doc_stack": "c - c'",
    "doc_gas": "",
    "doc_description": "Loads an exotic cell `c` and returns an ordinary cell `c'`. If `c` is already ordinary, does nothing. If `c` cannot be loaded, throws an exception."
  },
  {
    "name": "XLOADQ",
    "alias_of": "",
    "tlb": "#D73B",
    "doc_category": "cell_parse",
    "doc_opcode": "D73B",
    "doc_fift": "",
    "doc_stack": "c - c' -1 or c 0",
    "doc_gas": "",
    "doc_description": "Loads an exotic cell `c` and returns an ordinary cell `c'`. If `c` is already ordinary, does nothing. If `c` cannot be loaded, returns 0."
  },
  {
    "name": "SCHKBITS",
    "alias_of": "",
    "tlb": "#D741",
    "doc_category": "cell_parse",
    "doc_opcode": "D741",
    "doc_fift": "SCHKBITS",
    "doc_stack": "s l -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether there are at least `l` data bits in _Slice_ `s`. If this is not the case, throws a cell deserialisation (i.e., cell underflow) exception."
  },
  {
    "name": "SCHKREFS",
    "alias_of": "",
    "tlb": "#D742",
    "doc_category": "cell_parse",
    "doc_opcode": "D742",
    "doc_fift": "SCHKREFS",
    "doc_stack": "s r -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether there are at least `r` references in _Slice_ `s`."
  },
  {
    "name": "SCHKBITREFS",
    "alias_of": "",
    "tlb": "#D743",
    "doc_category": "cell_parse",
    "doc_opcode": "D743",
    "doc_fift": "SCHKBITREFS",
    "doc_stack": "s l r -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether there are at least `l` data bits and `r` references in _Slice_ `s`."
  },
  {
    "name": "SCHKBITSQ",
    "alias_of": "",
    "tlb": "#D745",
    "doc_category": "cell_parse",
    "doc_opcode": "D745",
    "doc_fift": "SCHKBITSQ",
    "doc_stack": "s l - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether there are at least `l` data bits in _Slice_ `s`."
  },
  {
    "name": "SCHKREFSQ",
    "alias_of": "",
    "tlb": "#D746",
    "doc_category": "cell_parse",
    "doc_opcode": "D746",
    "doc_fift": "SCHKREFSQ",
    "doc_stack": "s r - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether there are at least `r` references in _Slice_ `s`."
  },
  {
    "name": "SCHKBITREFSQ",
    "alias_of": "",
    "tlb": "#D747",
    "doc_category": "cell_parse",
    "doc_opcode": "D747",
    "doc_fift": "SCHKBITREFSQ",
    "doc_stack": "s l r - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether there are at least `l` data bits and `r` references in _Slice_ `s`."
  },
  {
    "name": "PLDREFVAR",
    "alias_of": "",
    "tlb": "#D748",
    "doc_category": "cell_parse",
    "doc_opcode": "D748",
    "doc_fift": "PLDREFVAR",
    "doc_stack": "s n - c",
    "doc_gas": 26,
    "doc_description": "Returns the `n`-th cell reference of _Slice_ `s` for `0 <= n <= 3`."
  },
  {
    "name": "SBITS",
    "alias_of": "",
    "tlb": "#D749",
    "doc_category": "cell_parse",
    "doc_opcode": "D749",
    "doc_fift": "SBITS",
    "doc_stack": "s - l",
    "doc_gas": 26,
    "doc_description": "Returns the number of data bits in _Slice_ `s`."
  },
  {
    "name": "SREFS",
    "alias_of": "",
    "tlb": "#D74A",
    "doc_category": "cell_parse",
    "doc_opcode": "D74A",
    "doc_fift": "SREFS",
    "doc_stack": "s - r",
    "doc_gas": 26,
    "doc_description": "Returns the number of references in _Slice_ `s`."
  },
  {
    "name": "SBITREFS",
    "alias_of": "",
    "tlb": "#D74B",
    "doc_category": "cell_parse",
    "doc_opcode": "D74B",
    "doc_fift": "SBITREFS",
    "doc_stack": "s - l r",
    "doc_gas": 26,
    "doc_description": "Returns both the number of data bits and the number of references in `s`."
  },
  {
    "name": "PLDREFIDX",
    "alias_of": "",
    "tlb": "#D74E_ n:uint2",
    "doc_category": "cell_parse",
    "doc_opcode": "D74E_n",
    "doc_fift": "[n] PLDREFIDX",
    "doc_stack": "s - c",
    "doc_gas": 26,
    "doc_description": "Returns the `n`-th cell reference of _Slice_ `s`, where `0 <= n <= 3`."
  },
  {
    "name": "PLDREF",
    "alias_of": "PLDREFIDX",
    "tlb": "#D74C",
    "doc_category": "cell_parse",
    "doc_opcode": "D74C",
    "doc_fift": "PLDREF",
    "doc_stack": "s - c",
    "doc_gas": 26,
    "doc_description": "Preloads the first cell reference of a _Slice_."
  },
  {
    "name": "LDILE4",
    "alias_of": "",
    "tlb": "#D750",
    "doc_category": "cell_parse",
    "doc_opcode": "D750",
    "doc_fift": "LDILE4",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads a little-endian signed 32-bit integer."
  },
  {
    "name": "LDULE4",
    "alias_of": "",
    "tlb": "#D751",
    "doc_category": "cell_parse",
    "doc_opcode": "D751",
    "doc_fift": "LDULE4",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads a little-endian unsigned 32-bit integer."
  },
  {
    "name": "LDILE8",
    "alias_of": "",
    "tlb": "#D752",
    "doc_category": "cell_parse",
    "doc_opcode": "D752",
    "doc_fift": "LDILE8",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads a little-endian signed 64-bit integer."
  },
  {
    "name": "LDULE8",
    "alias_of": "",
    "tlb": "#D753",
    "doc_category": "cell_parse",
    "doc_opcode": "D753",
    "doc_fift": "LDULE8",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads a little-endian unsigned 64-bit integer."
  },
  {
    "name": "PLDILE4",
    "alias_of": "",
    "tlb": "#D754",
    "doc_category": "cell_parse",
    "doc_opcode": "D754",
    "doc_fift": "PLDILE4",
    "doc_stack": "s - x",
    "doc_gas": 26,
    "doc_description": "Preloads a little-endian signed 32-bit integer."
  },
  {
    "name": "PLDULE4",
    "alias_of": "",
    "tlb": "#D755",
    "doc_category": "cell_parse",
    "doc_opcode": "D755",
    "doc_fift": "PLDULE4",
    "doc_stack": "s - x",
    "doc_gas": 26,
    "doc_description": "Preloads a little-endian unsigned 32-bit integer."
  },
  {
    "name": "PLDILE8",
    "alias_of": "",
    "tlb": "#D756",
    "doc_category": "cell_parse",
    "doc_opcode": "D756",
    "doc_fift": "PLDILE8",
    "doc_stack": "s - x",
    "doc_gas": 26,
    "doc_description": "Preloads a little-endian signed 64-bit integer."
  },
  {
    "name": "PLDULE8",
    "alias_of": "",
    "tlb": "#D757",
    "doc_category": "cell_parse",
    "doc_opcode": "D757",
    "doc_fift": "PLDULE8",
    "doc_stack": "s - x",
    "doc_gas": 26,
    "doc_description": "Preloads a little-endian unsigned 64-bit integer."
  },
  {
    "name": "LDILE4Q",
    "alias_of": "",
    "tlb": "#D758",
    "doc_category": "cell_parse",
    "doc_opcode": "D758",
    "doc_fift": "LDILE4Q",
    "doc_stack": "s - x s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "Quietly loads a little-endian signed 32-bit integer."
  },
  {
    "name": "LDULE4Q",
    "alias_of": "",
    "tlb": "#D759",
    "doc_category": "cell_parse",
    "doc_opcode": "D759",
    "doc_fift": "LDULE4Q",
    "doc_stack": "s - x s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "Quietly loads a little-endian unsigned 32-bit integer."
  },
  {
    "name": "LDILE8Q",
    "alias_of": "",
    "tlb": "#D75A",
    "doc_category": "cell_parse",
    "doc_opcode": "D75A",
    "doc_fift": "LDILE8Q",
    "doc_stack": "s - x s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "Quietly loads a little-endian signed 64-bit integer."
  },
  {
    "name": "LDULE8Q",
    "alias_of": "",
    "tlb": "#D75B",
    "doc_category": "cell_parse",
    "doc_opcode": "D75B",
    "doc_fift": "LDULE8Q",
    "doc_stack": "s - x s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "Quietly loads a little-endian unsigned 64-bit integer."
  },
  {
    "name": "PLDILE4Q",
    "alias_of": "",
    "tlb": "#D75C",
    "doc_category": "cell_parse",
    "doc_opcode": "D75C",
    "doc_fift": "PLDILE4Q",
    "doc_stack": "s - x -1 or 0",
    "doc_gas": 26,
    "doc_description": "Quietly preloads a little-endian signed 32-bit integer."
  },
  {
    "name": "PLDULE4Q",
    "alias_of": "",
    "tlb": "#D75D",
    "doc_category": "cell_parse",
    "doc_opcode": "D75D",
    "doc_fift": "PLDULE4Q",
    "doc_stack": "s - x -1 or 0",
    "doc_gas": 26,
    "doc_description": "Quietly preloads a little-endian unsigned 32-bit integer."
  },
  {
    "name": "PLDILE8Q",
    "alias_of": "",
    "tlb": "#D75E",
    "doc_category": "cell_parse",
    "doc_opcode": "D75E",
    "doc_fift": "PLDILE8Q",
    "doc_stack": "s - x -1 or 0",
    "doc_gas": 26,
    "doc_description": "Quietly preloads a little-endian signed 64-bit integer."
  },
  {
    "name": "PLDULE8Q",
    "alias_of": "",
    "tlb": "#D75F",
    "doc_category": "cell_parse",
    "doc_opcode": "D75F",
    "doc_fift": "PLDULE8Q",
    "doc_stack": "s - x -1 or 0",
    "doc_gas": 26,
    "doc_description": "Quietly preloads a little-endian unsigned 64-bit integer."
  },
  {
    "name": "LDZEROES",
    "alias_of": "",
    "tlb": "#D760",
    "doc_category": "cell_parse",
    "doc_opcode": "D760",
    "doc_fift": "LDZEROES",
    "doc_stack": "s - n s'",
    "doc_gas": 26,
    "doc_description": "Returns the count `n` of leading zero bits in `s`, and removes these bits from `s`."
  },
  {
    "name": "LDONES",
    "alias_of": "",
    "tlb": "#D761",
    "doc_category": "cell_parse",
    "doc_opcode": "D761",
    "doc_fift": "LDONES",
    "doc_stack": "s - n s'",
    "doc_gas": 26,
    "doc_description": "Returns the count `n` of leading one bits in `s`, and removes these bits from `s`."
  },
  {
    "name": "LDSAME",
    "alias_of": "",
    "tlb": "#D762",
    "doc_category": "cell_parse",
    "doc_opcode": "D762",
    "doc_fift": "LDSAME",
    "doc_stack": "s x - n s'",
    "doc_gas": 26,
    "doc_description": "Returns the count `n` of leading bits equal to `0 <= x <= 1` in `s`, and removes these bits from `s`."
  },
  {
    "name": "SDEPTH",
    "alias_of": "",
    "tlb": "#D764",
    "doc_category": "cell_parse",
    "doc_opcode": "D764",
    "doc_fift": "SDEPTH",
    "doc_stack": "s - x",
    "doc_gas": 26,
    "doc_description": "Returns the depth of _Slice_ `s`. If `s` has no references, then `x=0`; otherwise `x` is one plus the maximum of depths of cells referred to from `s`."
  },
  {
    "name": "CDEPTH",
    "alias_of": "",
    "tlb": "#D765",
    "doc_category": "cell_parse",
    "doc_opcode": "D765",
    "doc_fift": "CDEPTH",
    "doc_stack": "c - x",
    "doc_gas": 26,
    "doc_description": "Returns the depth of _Cell_ `c`. If `c` has no references, then `x=0`; otherwise `x` is one plus the maximum of depths of cells referred to from `c`. If `c` is a _Null_ instead of a _Cell_, returns zero."
  },
  {
    "name": "CLEVEL",
    "alias_of": "",
    "tlb": "#D766",
    "doc_category": "cell_parse",
    "doc_opcode": "D766",
    "doc_fift": "CLEVEL",
    "doc_stack": "cell - level",
    "doc_gas": 26,
    "doc_description": "Returns level of the cell"
  },
  {
    "name": "CLEVELMASK",
    "alias_of": "",
    "tlb": "#D767",
    "doc_category": "cell_parse",
    "doc_opcode": "D767",
    "doc_fift": "CLEVELMASK",
    "doc_stack": "cell - level_mask",
    "doc_gas": 26,
    "doc_description": "Returns level mask of the cell"
  },
  {
    "name": "CHASHIX",
    "alias_of": "",
    "tlb": "#D770",
    "doc_category": "cell_parse",
    "doc_opcode": "D770",
    "doc_fift": "CHASHIX",
    "doc_stack": "cell i - depth",
    "doc_gas": 26,
    "doc_description": "Returns ith hash of the cell (i is in range 0..3)"
  },
  {
    "name": "CDEPTHIX",
    "alias_of": "",
    "tlb": "#D771",
    "doc_category": "cell_parse",
    "doc_opcode": "D771",
    "doc_fift": "CDEPTHIX",
    "doc_stack": "cell i - depth",
    "doc_gas": 26,
    "doc_description": "Returns ith depth of the cell (i is in range 0..3)"
  }
]



================================================
FILE: src/data/opcodes/comparison.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/comparison.json
================================================
[
  {
    "name": "SGN",
    "alias_of": "",
    "tlb": "#B8",
    "doc_category": "compare_int",
    "doc_opcode": "B8",
    "doc_fift": "SGN",
    "doc_stack": "x - sgn(x)",
    "doc_gas": 18,
    "doc_description": "Computes the sign of an integer `x`:\n`-1` if `x<0`, `0` if `x=0`, `1` if `x>0`."
  },
  {
    "name": "LESS",
    "alias_of": "",
    "tlb": "#B9",
    "doc_category": "compare_int",
    "doc_opcode": "B9",
    "doc_fift": "LESS",
    "doc_stack": "x y - x<y",
    "doc_gas": 18,
    "doc_description": "Returns `-1` if `x<y`, `0` otherwise."
  },
  {
    "name": "EQUAL",
    "alias_of": "",
    "tlb": "#BA",
    "doc_category": "compare_int",
    "doc_opcode": "BA",
    "doc_fift": "EQUAL",
    "doc_stack": "x y - x=y",
    "doc_gas": 18,
    "doc_description": "Returns `-1` if `x=y`, `0` otherwise."
  },
  {
    "name": "LEQ",
    "alias_of": "",
    "tlb": "#BB",
    "doc_category": "compare_int",
    "doc_opcode": "BB",
    "doc_fift": "LEQ",
    "doc_stack": "x y - x<=y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "GREATER",
    "alias_of": "",
    "tlb": "#BC",
    "doc_category": "compare_int",
    "doc_opcode": "BC",
    "doc_fift": "GREATER",
    "doc_stack": "x y - x>y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "NEQ",
    "alias_of": "",
    "tlb": "#BD",
    "doc_category": "compare_int",
    "doc_opcode": "BD",
    "doc_fift": "NEQ",
    "doc_stack": "x y - x!=y",
    "doc_gas": 18,
    "doc_description": "Equivalent to `EQUAL` `NOT`."
  },
  {
    "name": "GEQ",
    "alias_of": "",
    "tlb": "#BE",
    "doc_category": "compare_int",
    "doc_opcode": "BE",
    "doc_fift": "GEQ",
    "doc_stack": "x y - x>=y",
    "doc_gas": 18,
    "doc_description": "Equivalent to `LESS` `NOT`."
  },
  {
    "name": "CMP",
    "alias_of": "",
    "tlb": "#BF",
    "doc_category": "compare_int",
    "doc_opcode": "BF",
    "doc_fift": "CMP",
    "doc_stack": "x y - sgn(x-y)",
    "doc_gas": 18,
    "doc_description": "Computes the sign of `x-y`:\n`-1` if `x<y`, `0` if `x=y`, `1` if `x>y`.\nNo integer overflow can occur here unless `x` or `y` is a `NaN`."
  },
  {
    "name": "EQINT",
    "alias_of": "",
    "tlb": "#C0 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C0yy",
    "doc_fift": "[yy] EQINT",
    "doc_stack": "x - x=yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x=yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISZERO",
    "alias_of": "EQINT",
    "tlb": "#C000",
    "doc_category": "compare_int",
    "doc_opcode": "C000",
    "doc_fift": "ISZERO",
    "doc_stack": "x - x=0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is zero. Corresponds to Forth's `0=`."
  },
  {
    "name": "LESSINT",
    "alias_of": "",
    "tlb": "#C1 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C1yy",
    "doc_fift": "[yy] LESSINT\n[yy-1] LEQINT",
    "doc_stack": "x - x<yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x<yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISNEG",
    "alias_of": "LESSINT",
    "tlb": "#C100",
    "doc_category": "compare_int",
    "doc_opcode": "C100",
    "doc_fift": "ISNEG",
    "doc_stack": "x - x<0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is negative. Corresponds to Forth's `0<`."
  },
  {
    "name": "ISNPOS",
    "alias_of": "LESSINT",
    "tlb": "#C101",
    "doc_category": "compare_int",
    "doc_opcode": "C101",
    "doc_fift": "ISNPOS",
    "doc_stack": "x - x<=0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is non-positive."
  },
  {
    "name": "GTINT",
    "alias_of": "",
    "tlb": "#C2 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C2yy",
    "doc_fift": "[yy] GTINT\n[yy+1] GEQINT",
    "doc_stack": "x - x>yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x>yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISPOS",
    "alias_of": "GTINT",
    "tlb": "#C200",
    "doc_category": "compare_int",
    "doc_opcode": "C200",
    "doc_fift": "ISPOS",
    "doc_stack": "x - x>0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is positive. Corresponds to Forth's `0>`."
  },
  {
    "name": "ISNNEG",
    "alias_of": "GTINT",
    "tlb": "#C2FF",
    "doc_category": "compare_int",
    "doc_opcode": "C2FF",
    "doc_fift": "ISNNEG",
    "doc_stack": "x - x >=0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is non-negative."
  },
  {
    "name": "NEQINT",
    "alias_of": "",
    "tlb": "#C3 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C3yy",
    "doc_fift": "[yy] NEQINT",
    "doc_stack": "x - x!=yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x!=yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISNAN",
    "alias_of": "",
    "tlb": "#C4",
    "doc_category": "compare_int",
    "doc_opcode": "C4",
    "doc_fift": "ISNAN",
    "doc_stack": "x - x=NaN",
    "doc_gas": 18,
    "doc_description": "Checks whether `x` is a `NaN`."
  },
  {
    "name": "CHKNAN",
    "alias_of": "",
    "tlb": "#C5",
    "doc_category": "compare_int",
    "doc_opcode": "C5",
    "doc_fift": "CHKNAN",
    "doc_stack": "x - x",
    "doc_gas": "18/68",
    "doc_description": "Throws an arithmetic overflow exception if `x` is a `NaN`."
  },
  {
    "name": "SEMPTY",
    "alias_of": "",
    "tlb": "#C700",
    "doc_category": "compare_other",
    "doc_opcode": "C700",
    "doc_fift": "SEMPTY",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether a _Slice_ `s` is empty (i.e., contains no bits of data and no cell references)."
  },
  {
    "name": "SDEMPTY",
    "alias_of": "",
    "tlb": "#C701",
    "doc_category": "compare_other",
    "doc_opcode": "C701",
    "doc_fift": "SDEMPTY",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether _Slice_ `s` has no bits of data."
  },
  {
    "name": "SREMPTY",
    "alias_of": "",
    "tlb": "#C702",
    "doc_category": "compare_other",
    "doc_opcode": "C702",
    "doc_fift": "SREMPTY",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether _Slice_ `s` has no references."
  },
  {
    "name": "SDFIRST",
    "alias_of": "",
    "tlb": "#C703",
    "doc_category": "compare_other",
    "doc_opcode": "C703",
    "doc_fift": "SDFIRST",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether the first bit of _Slice_ `s` is a one."
  },
  {
    "name": "SDLEXCMP",
    "alias_of": "",
    "tlb": "#C704",
    "doc_category": "compare_other",
    "doc_opcode": "C704",
    "doc_fift": "SDLEXCMP",
    "doc_stack": "s s' - x",
    "doc_gas": 26,
    "doc_description": "Compares the data of `s` lexicographically with the data of `s'`, returning `-1`, 0, or 1 depending on the result."
  },
  {
    "name": "SDEQ",
    "alias_of": "",
    "tlb": "#C705",
    "doc_category": "compare_other",
    "doc_opcode": "C705",
    "doc_fift": "SDEQ",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether the data parts of `s` and `s'` coincide, equivalent to `SDLEXCMP` `ISZERO`."
  },
  {
    "name": "SDPFX",
    "alias_of": "",
    "tlb": "#C708",
    "doc_category": "compare_other",
    "doc_opcode": "C708",
    "doc_fift": "SDPFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a prefix of `s'`."
  },
  {
    "name": "SDPFXREV",
    "alias_of": "",
    "tlb": "#C709",
    "doc_category": "compare_other",
    "doc_opcode": "C709",
    "doc_fift": "SDPFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a prefix of `s`, equivalent to `SWAP` `SDPFX`."
  },
  {
    "name": "SDPPFX",
    "alias_of": "",
    "tlb": "#C70A",
    "doc_category": "compare_other",
    "doc_opcode": "C70A",
    "doc_fift": "SDPPFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a proper prefix of `s'` (i.e., a prefix distinct from `s'`)."
  },
  {
    "name": "SDPPFXREV",
    "alias_of": "",
    "tlb": "#C70B",
    "doc_category": "compare_other",
    "doc_opcode": "C70B",
    "doc_fift": "SDPPFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a proper prefix of `s`."
  },
  {
    "name": "SDSFX",
    "alias_of": "",
    "tlb": "#C70C",
    "doc_category": "compare_other",
    "doc_opcode": "C70C",
    "doc_fift": "SDSFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a suffix of `s'`."
  },
  {
    "name": "SDSFXREV",
    "alias_of": "",
    "tlb": "#C70D",
    "doc_category": "compare_other",
    "doc_opcode": "C70D",
    "doc_fift": "SDSFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a suffix of `s`."
  },
  {
    "name": "SDPSFX",
    "alias_of": "",
    "tlb": "#C70E",
    "doc_category": "compare_other",
    "doc_opcode": "C70E",
    "doc_fift": "SDPSFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a proper suffix of `s'`."
  },
  {
    "name": "SDPSFXREV",
    "alias_of": "",
    "tlb": "#C70F",
    "doc_category": "compare_other",
    "doc_opcode": "C70F",
    "doc_fift": "SDPSFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a proper suffix of `s`."
  },
  {
    "name": "SDCNTLEAD0",
    "alias_of": "",
    "tlb": "#C710",
    "doc_category": "compare_other",
    "doc_opcode": "C710",
    "doc_fift": "SDCNTLEAD0",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of leading zeroes in `s`."
  },
  {
    "name": "SDCNTLEAD1",
    "alias_of": "",
    "tlb": "#C711",
    "doc_category": "compare_other",
    "doc_opcode": "C711",
    "doc_fift": "SDCNTLEAD1",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of leading ones in `s`."
  },
  {
    "name": "SDCNTTRAIL0",
    "alias_of": "",
    "tlb": "#C712",
    "doc_category": "compare_other",
    "doc_opcode": "C712",
    "doc_fift": "SDCNTTRAIL0",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of trailing zeroes in `s`."
  },
  {
    "name": "SDCNTTRAIL1",
    "alias_of": "",
    "tlb": "#C713",
    "doc_category": "compare_other",
    "doc_opcode": "C713",
    "doc_fift": "SDCNTTRAIL1",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of trailing ones in `s`."
  }
]



================================================
FILE: src/data/opcodes/constant.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/constant.json
================================================
[
  {
    "name": "PUSHINT_4",
    "alias_of": "",
    "tlb": "#7 i:uint4",
    "doc_category": "const_int",
    "doc_opcode": "7i",
    "doc_fift": "[x] PUSHINT\n[x] INT",
    "doc_stack": "- x",
    "doc_gas": 18,
    "doc_description": "Pushes integer `x` into the stack. `-5 <= x <= 10`.\nHere `i` equals four lower-order bits of `x` (`i=x mod 16`)."
  },
  {
    "name": "ZERO",
    "alias_of": "PUSHINT_4",
    "tlb": "#70",
    "doc_category": "const_int",
    "doc_opcode": 70,
    "doc_fift": "ZERO\nFALSE",
    "doc_stack": "- 0",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "ONE",
    "alias_of": "PUSHINT_4",
    "tlb": "#71",
    "doc_category": "const_int",
    "doc_opcode": 71,
    "doc_fift": "ONE",
    "doc_stack": "- 1",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "TWO",
    "alias_of": "PUSHINT_4",
    "tlb": "#72",
    "doc_category": "const_int",
    "doc_opcode": 72,
    "doc_fift": "TWO",
    "doc_stack": "- 2",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "TEN",
    "alias_of": "PUSHINT_4",
    "tlb": "#7A",
    "doc_category": "const_int",
    "doc_opcode": "7A",
    "doc_fift": "TEN",
    "doc_stack": "- 10",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "TRUE",
    "alias_of": "PUSHINT_4",
    "tlb": "#7F",
    "doc_category": "const_int",
    "doc_opcode": "7F",
    "doc_fift": "TRUE",
    "doc_stack": "- -1",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "PUSHINT_8",
    "alias_of": "",
    "tlb": "#80 xx:int8",
    "doc_category": "const_int",
    "doc_opcode": "80xx",
    "doc_fift": "[xx] PUSHINT\n[xx] INT",
    "doc_stack": "- xx",
    "doc_gas": 26,
    "doc_description": "Pushes integer `xx`. `-128 <= xx <= 127`."
  },
  {
    "name": "PUSHINT_16",
    "alias_of": "",
    "tlb": "#81 xxxx:int16",
    "doc_category": "const_int",
    "doc_opcode": "81xxxx",
    "doc_fift": "[xxxx] PUSHINT\n[xxxx] INT",
    "doc_stack": "- xxxx",
    "doc_gas": 34,
    "doc_description": "Pushes integer `xxxx`. `-2^15 <= xx < 2^15`."
  },
  {
    "name": "PUSHINT_LONG",
    "alias_of": "",
    "tlb": "#82 l:(## 5) xxx:(int (8 * l + 19))",
    "doc_category": "const_int",
    "doc_opcode": "82lxxx",
    "doc_fift": "[xxx] PUSHINT\n[xxx] INT",
    "doc_stack": "- xxx",
    "doc_gas": 23,
    "doc_description": "Pushes integer `xxx`.\n_Details:_ 5-bit `0 <= l <= 30` determines the length `n=8l+19` of signed big-endian integer `xxx`.\nThe total length of this instruction is `l+4` bytes or `n+13=8l+32` bits."
  },
  {
    "name": "PUSHPOW2",
    "alias_of": "",
    "tlb": "#83 xx:uint8",
    "doc_category": "const_int",
    "doc_opcode": "83xx",
    "doc_fift": "[xx+1] PUSHPOW2",
    "doc_stack": "- 2^(xx+1)",
    "doc_gas": 26,
    "doc_description": "(Quietly) pushes `2^(xx+1)` for `0 <= xx <= 255`.\n`2^256` is a `NaN`."
  },
  {
    "name": "PUSHNAN",
    "alias_of": "PUSHPOW2",
    "tlb": "#83FF",
    "doc_category": "const_int",
    "doc_opcode": "83FF",
    "doc_fift": "PUSHNAN",
    "doc_stack": "- NaN",
    "doc_gas": 26,
    "doc_description": "Pushes a `NaN`."
  },
  {
    "name": "PUSHPOW2DEC",
    "alias_of": "",
    "tlb": "#84 xx:uint8",
    "doc_category": "const_int",
    "doc_opcode": "84xx",
    "doc_fift": "[xx+1] PUSHPOW2DEC",
    "doc_stack": "- 2^(xx+1)-1",
    "doc_gas": 26,
    "doc_description": "Pushes `2^(xx+1)-1` for `0 <= xx <= 255`."
  },
  {
    "name": "PUSHNEGPOW2",
    "alias_of": "",
    "tlb": "#85 xx:uint8",
    "doc_category": "const_int",
    "doc_opcode": "85xx",
    "doc_fift": "[xx+1] PUSHNEGPOW2",
    "doc_stack": "- -2^(xx+1)",
    "doc_gas": 26,
    "doc_description": "Pushes `-2^(xx+1)` for `0 <= xx <= 255`."
  },
  {
    "name": "PUSHREF",
    "alias_of": "",
    "tlb": "#88 c:^Cell",
    "doc_category": "const_data",
    "doc_opcode": 88,
    "doc_fift": "[ref] PUSHREF",
    "doc_stack": "- c",
    "doc_gas": 18,
    "doc_description": "Pushes the reference `ref` into the stack.\n_Details:_ Pushes the first reference of `cc.code` into the stack as a _Cell_ (and removes this reference from the current continuation)."
  },
  {
    "name": "PUSHREFSLICE",
    "alias_of": "",
    "tlb": "#89 c:^Cell",
    "doc_category": "const_data",
    "doc_opcode": 89,
    "doc_fift": "[ref] PUSHREFSLICE",
    "doc_stack": "- s",
    "doc_gas": "118/43",
    "doc_description": "Similar to `PUSHREF`, but converts the cell into a _Slice_."
  },
  {
    "name": "PUSHREFCONT",
    "alias_of": "",
    "tlb": "#8A c:^Cell",
    "doc_category": "const_data",
    "doc_opcode": "8A",
    "doc_fift": "[ref] PUSHREFCONT",
    "doc_stack": "- cont",
    "doc_gas": "118/43",
    "doc_description": "Similar to `PUSHREFSLICE`, but makes a simple ordinary _Continuation_ out of the cell."
  },
  {
    "name": "PUSHSLICE",
    "alias_of": "",
    "tlb": "#8B x:(## 4) sss:((8 * x + 4) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8Bxsss",
    "doc_fift": "[slice] PUSHSLICE\n[slice] SLICE",
    "doc_stack": "- s",
    "doc_gas": 22,
    "doc_description": "Pushes the slice `slice` into the stack.\n_Details:_ Pushes the (prefix) subslice of `cc.code` consisting of its first `8x+4` bits and no references (i.e., essentially a bitstring), where `0 <= x <= 15`.\nA completion tag is assumed, meaning that all trailing zeroes and the last binary one (if present) are removed from this bitstring.\nIf the original bitstring consists only of zeroes, an empty slice will be pushed."
  },
  {
    "name": "PUSHSLICE_REFS",
    "alias_of": "",
    "tlb": "#8C r:(## 2) xx:(## 5) c:((r + 1) * ^Cell) ssss:((8 * xx + 1) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8Crxxssss",
    "doc_fift": "[slice] PUSHSLICE\n[slice] SLICE",
    "doc_stack": "- s",
    "doc_gas": 25,
    "doc_description": "Pushes the slice `slice` into the stack.\n_Details:_ Pushes the (prefix) subslice of `cc.code` consisting of its first `1 <= r+1 <= 4` references and up to first `8xx+1` bits of data, with `0 <= xx <= 31`.\nA completion tag is also assumed."
  },
  {
    "name": "PUSHSLICE_LONG",
    "alias_of": "",
    "tlb": "#8D r:(#<= 4) xx:(## 7) c:(r * ^Cell) ssss:((8 * xx + 6) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8Drxxsssss",
    "doc_fift": "[slice] PUSHSLICE\n[slice] SLICE",
    "doc_stack": "- s",
    "doc_gas": 28,
    "doc_description": "Pushes the slice `slice` into the stack.\n_Details:_ Pushes the subslice of `cc.code` consisting of `0 <= r <= 4` references and up to `8xx+6` bits of data, with `0 <= xx <= 127`.\nA completion tag is assumed."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "const_data",
    "doc_opcode": "",
    "doc_fift": "x{} PUSHSLICE\nx{ABCD1234} PUSHSLICE\nb{01101} PUSHSLICE",
    "doc_stack": "- s",
    "doc_gas": "",
    "doc_description": "Examples of `PUSHSLICE`.\n`x{}` is an empty slice. `x{...}` is a hexadecimal literal. `b{...}` is a binary literal.\nMore on slice literals [here](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-51-slice-literals).\nNote that the assembler can replace `PUSHSLICE` with `PUSHREFSLICE` in certain situations (e.g. if there’s not enough space in the current continuation)."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "const_data",
    "doc_opcode": "",
    "doc_fift": "<b x{AB12} s, b> PUSHREF\n<b x{AB12} s, b> PUSHREFSLICE",
    "doc_stack": "- c/s",
    "doc_gas": "",
    "doc_description": "Examples of `PUSHREF` and `PUSHREFSLICE`.\nMore on building cells in fift [here](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-52-builder-primitives)."
  },
  {
    "name": "PUSHCONT",
    "alias_of": "",
    "tlb": "#8F_ r:(## 2) xx:(## 7) c:(r * ^Cell) ssss:((8 * xx) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8F_rxxcccc",
    "doc_fift": "[builder] PUSHCONT\n[builder] CONT",
    "doc_stack": "- c",
    "doc_gas": 26,
    "doc_description": "Pushes a continuation made from `builder`.\n_Details:_ Pushes the simple ordinary continuation `cccc` made from the first `0 <= r <= 3` references and the first `0 <= xx <= 127` bytes of `cc.code`."
  },
  {
    "name": "PUSHCONT_SHORT",
    "alias_of": "",
    "tlb": "#9 x:(## 4) ssss:((8 * x) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "9xccc",
    "doc_fift": "[builder] PUSHCONT\n[builder] CONT",
    "doc_stack": "- c",
    "doc_gas": 18,
    "doc_description": "Pushes a continuation made from `builder`.\n_Details:_ Pushes an `x`-byte continuation for `0 <= x <= 15`."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "const_data",
    "doc_opcode": "",
    "doc_fift": "<{ code }> PUSHCONT\n<{ code }> CONT\nCONT:<{ code }>",
    "doc_stack": "- c",
    "doc_gas": "",
    "doc_description": "Pushes a continuation with code `code`.\nNote that the assembler can replace `PUSHCONT` with `PUSHREFCONT` in certain situations (e.g. if there’s not enough space in the current continuation)."
  }
]



================================================
FILE: src/data/opcodes/continuation.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/continuation.json
================================================
[
  {
    "name": "EXECUTE",
    "alias_of": "",
    "tlb": "#D8",
    "doc_category": "cont_basic",
    "doc_opcode": "D8",
    "doc_fift": "EXECUTE\nCALLX",
    "doc_stack": "c -",
    "doc_gas": 18,
    "doc_description": "_Calls_, or _executes_, continuation `c`."
  },
  {
    "name": "JMPX",
    "alias_of": "",
    "tlb": "#D9",
    "doc_category": "cont_basic",
    "doc_opcode": "D9",
    "doc_fift": "JMPX",
    "doc_stack": "c -",
    "doc_gas": 18,
    "doc_description": "_Jumps_, or transfers control, to continuation `c`.\nThe remainder of the previous current continuation `cc` is discarded."
  },
  {
    "name": "CALLXARGS",
    "alias_of": "",
    "tlb": "#DA p:uint4 r:uint4",
    "doc_category": "cont_basic",
    "doc_opcode": "DApr",
    "doc_fift": "[p] [r] CALLXARGS",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "_Calls_ continuation `c` with `p` parameters and expecting `r` return values\n`0 <= p <= 15`, `0 <= r <= 15`"
  },
  {
    "name": "CALLXARGS_VAR",
    "alias_of": "",
    "tlb": "#DB0 p:uint4",
    "doc_category": "cont_basic",
    "doc_opcode": "DB0p",
    "doc_fift": "[p] -1 CALLXARGS",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "_Calls_ continuation `c` with `0 <= p <= 15` parameters, expecting an arbitrary number of return values."
  },
  {
    "name": "JMPXARGS",
    "alias_of": "",
    "tlb": "#DB1 p:uint4",
    "doc_category": "cont_basic",
    "doc_opcode": "DB1p",
    "doc_fift": "[p] JMPXARGS",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "_Jumps_ to continuation `c`, passing only the top `0 <= p <= 15` values from the current stack to it (the remainder of the current stack is discarded)."
  },
  {
    "name": "RETARGS",
    "alias_of": "",
    "tlb": "#DB2 r:uint4",
    "doc_category": "cont_basic",
    "doc_opcode": "DB2r",
    "doc_fift": "[r] RETARGS",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "_Returns_ to `c0`, with `0 <= r <= 15` return values taken from the current stack."
  },
  {
    "name": "RET",
    "alias_of": "",
    "tlb": "#DB30",
    "doc_category": "cont_basic",
    "doc_opcode": "DB30",
    "doc_fift": "RET\nRETTRUE",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "_Returns_ to the continuation at `c0`. The remainder of the current continuation `cc` is discarded.\nApproximately equivalent to `c0 PUSHCTR` `JMPX`."
  },
  {
    "name": "RETALT",
    "alias_of": "",
    "tlb": "#DB31",
    "doc_category": "cont_basic",
    "doc_opcode": "DB31",
    "doc_fift": "RETALT\nRETFALSE",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "_Returns_ to the continuation at `c1`.\nApproximately equivalent to `c1 PUSHCTR` `JMPX`."
  },
  {
    "name": "BRANCH",
    "alias_of": "",
    "tlb": "#DB32",
    "doc_category": "cont_basic",
    "doc_opcode": "DB32",
    "doc_fift": "BRANCH\nRETBOOL",
    "doc_stack": "f -",
    "doc_gas": 26,
    "doc_description": "Performs `RETTRUE` if integer `f!=0`, or `RETFALSE` if `f=0`."
  },
  {
    "name": "CALLCC",
    "alias_of": "",
    "tlb": "#DB34",
    "doc_category": "cont_basic",
    "doc_opcode": "DB34",
    "doc_fift": "CALLCC",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "_Call with current continuation_, transfers control to `c`, pushing the old value of `cc` into `c`'s stack (instead of discarding it or writing it into new `c0`)."
  },
  {
    "name": "JMPXDATA",
    "alias_of": "",
    "tlb": "#DB35",
    "doc_category": "cont_basic",
    "doc_opcode": "DB35",
    "doc_fift": "JMPXDATA",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Similar to `CALLCC`, but the remainder of the current continuation (the old value of `cc`) is converted into a _Slice_ before pushing it into the stack of `c`."
  },
  {
    "name": "CALLCCARGS",
    "alias_of": "",
    "tlb": "#DB36 p:uint4 r:uint4",
    "doc_category": "cont_basic",
    "doc_opcode": "DB36pr",
    "doc_fift": "[p] [r] CALLCCARGS",
    "doc_stack": "c -",
    "doc_gas": 34,
    "doc_description": "Similar to `CALLXARGS`, but pushes the old value of `cc` (along with the top `0 <= p <= 15` values from the original stack) into the stack of newly-invoked continuation `c`, setting `cc.nargs` to `-1 <= r <= 14`."
  },
  {
    "name": "CALLXVARARGS",
    "alias_of": "",
    "tlb": "#DB38",
    "doc_category": "cont_basic",
    "doc_opcode": "DB38",
    "doc_fift": "CALLXVARARGS",
    "doc_stack": "c p r -",
    "doc_gas": 26,
    "doc_description": "Similar to `CALLXARGS`, but takes `-1 <= p,r <= 254` from the stack. The next three operations also take `p` and `r` from the stack, both in the range `-1...254`."
  },
  {
    "name": "RETVARARGS",
    "alias_of": "",
    "tlb": "#DB39",
    "doc_category": "cont_basic",
    "doc_opcode": "DB39",
    "doc_fift": "RETVARARGS",
    "doc_stack": "p r -",
    "doc_gas": 26,
    "doc_description": "Similar to `RETARGS`."
  },
  {
    "name": "JMPXVARARGS",
    "alias_of": "",
    "tlb": "#DB3A",
    "doc_category": "cont_basic",
    "doc_opcode": "DB3A",
    "doc_fift": "JMPXVARARGS",
    "doc_stack": "c p r -",
    "doc_gas": 26,
    "doc_description": "Similar to `JMPXARGS`."
  },
  {
    "name": "CALLCCVARARGS",
    "alias_of": "",
    "tlb": "#DB3B",
    "doc_category": "cont_basic",
    "doc_opcode": "DB3B",
    "doc_fift": "CALLCCVARARGS",
    "doc_stack": "c p r -",
    "doc_gas": 26,
    "doc_description": "Similar to `CALLCCARGS`."
  },
  {
    "name": "CALLREF",
    "alias_of": "",
    "tlb": "#DB3C c:^Cell",
    "doc_category": "cont_basic",
    "doc_opcode": "DB3C",
    "doc_fift": "[ref] CALLREF",
    "doc_stack": "",
    "doc_gas": "126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `CALLX`."
  },
  {
    "name": "JMPREF",
    "alias_of": "",
    "tlb": "#DB3D c:^Cell",
    "doc_category": "cont_basic",
    "doc_opcode": "DB3D",
    "doc_fift": "[ref] JMPREF",
    "doc_stack": "",
    "doc_gas": "126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `JMPX`."
  },
  {
    "name": "JMPREFDATA",
    "alias_of": "",
    "tlb": "#DB3E c:^Cell",
    "doc_category": "cont_basic",
    "doc_opcode": "DB3E",
    "doc_fift": "[ref] JMPREFDATA",
    "doc_stack": "",
    "doc_gas": "126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `JMPXDATA`."
  },
  {
    "name": "RETDATA",
    "alias_of": "",
    "tlb": "#DB3F",
    "doc_category": "cont_basic",
    "doc_opcode": "DB3F",
    "doc_fift": "RETDATA",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `c0 PUSHCTR` `JMPXDATA`. In this way, the remainder of the current continuation is converted into a _Slice_ and returned to the caller."
  },
  {
    "name": "IFRET",
    "alias_of": "",
    "tlb": "#DC",
    "doc_category": "cont_conditional",
    "doc_opcode": "DC",
    "doc_fift": "IFRET\nIFNOT:",
    "doc_stack": "f -",
    "doc_gas": 18,
    "doc_description": "Performs a `RET`, but only if integer `f` is non-zero. If `f` is a `NaN`, throws an integer overflow exception."
  },
  {
    "name": "IFNOTRET",
    "alias_of": "",
    "tlb": "#DD",
    "doc_category": "cont_conditional",
    "doc_opcode": "DD",
    "doc_fift": "IFNOTRET\nIF:",
    "doc_stack": "f -",
    "doc_gas": 18,
    "doc_description": "Performs a `RET`, but only if integer `f` is zero."
  },
  {
    "name": "IF",
    "alias_of": "",
    "tlb": "#DE",
    "doc_category": "cont_conditional",
    "doc_opcode": "DE",
    "doc_fift": "IF",
    "doc_stack": "f c -",
    "doc_gas": 18,
    "doc_description": "Performs `EXECUTE` for `c` (i.e., _executes_ `c`), but only if integer `f` is non-zero. Otherwise simply discards both values."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_conditional",
    "doc_opcode": "DE",
    "doc_fift": "IF:<{ code }>\n<{ code }>IF",
    "doc_stack": "f -",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `IF`."
  },
  {
    "name": "IFNOT",
    "alias_of": "",
    "tlb": "#DF",
    "doc_category": "cont_conditional",
    "doc_opcode": "DF",
    "doc_fift": "IFNOT",
    "doc_stack": "f c -",
    "doc_gas": 18,
    "doc_description": "Executes continuation `c`, but only if integer `f` is zero. Otherwise simply discards both values."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_conditional",
    "doc_opcode": "DF",
    "doc_fift": "IFNOT:<{ code }>\n<{ code }>IFNOT",
    "doc_stack": "f -",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `IFNOT`."
  },
  {
    "name": "IFJMP",
    "alias_of": "",
    "tlb": "#E0",
    "doc_category": "cont_conditional",
    "doc_opcode": "E0",
    "doc_fift": "IFJMP",
    "doc_stack": "f c -",
    "doc_gas": 18,
    "doc_description": "Jumps to `c` (similarly to `JMPX`), but only if `f` is non-zero."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_conditional",
    "doc_opcode": "E0",
    "doc_fift": "IFJMP:<{ code }>",
    "doc_stack": "f -",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `IFJMP`."
  },
  {
    "name": "IFNOTJMP",
    "alias_of": "",
    "tlb": "#E1",
    "doc_category": "cont_conditional",
    "doc_opcode": "E1",
    "doc_fift": "IFNOTJMP",
    "doc_stack": "f c -",
    "doc_gas": 18,
    "doc_description": "Jumps to `c` (similarly to `JMPX`), but only if `f` is zero."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_conditional",
    "doc_opcode": "E1",
    "doc_fift": "IFNOTJMP:<{ code }>",
    "doc_stack": "f -",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `IFNOTJMP`."
  },
  {
    "name": "IFELSE",
    "alias_of": "",
    "tlb": "#E2",
    "doc_category": "cont_conditional",
    "doc_opcode": "E2",
    "doc_fift": "IFELSE",
    "doc_stack": "f c c' -",
    "doc_gas": 18,
    "doc_description": "If integer `f` is non-zero, executes `c`, otherwise executes `c'`. Equivalent to `CONDSELCHK` `EXECUTE`."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_conditional",
    "doc_opcode": "E2",
    "doc_fift": "IF:<{ code1 }>ELSE<{ code2 }>",
    "doc_stack": "f -",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code1 }> CONT` `<{ code2 }> CONT` `IFELSE`."
  },
  {
    "name": "IFREF",
    "alias_of": "",
    "tlb": "#E300 c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E300",
    "doc_fift": "[ref] IFREF",
    "doc_stack": "f -",
    "doc_gas": "26/126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `IF`, with the optimization that the cell reference is not actually loaded into a _Slice_ and then converted into an ordinary _Continuation_ if `f=0`.\nGas consumption of this primitive depends on whether `f=0` and whether the reference was loaded before.\nSimilar remarks apply other primitives that accept a continuation as a reference."
  },
  {
    "name": "IFNOTREF",
    "alias_of": "",
    "tlb": "#E301 c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E301",
    "doc_fift": "[ref] IFNOTREF",
    "doc_stack": "f -",
    "doc_gas": "26/126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `IFNOT`."
  },
  {
    "name": "IFJMPREF",
    "alias_of": "",
    "tlb": "#E302 c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E302",
    "doc_fift": "[ref] IFJMPREF",
    "doc_stack": "f -",
    "doc_gas": "26/126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `IFJMP`."
  },
  {
    "name": "IFNOTJMPREF",
    "alias_of": "",
    "tlb": "#E303 c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E303",
    "doc_fift": "[ref] IFNOTJMPREF",
    "doc_stack": "f -",
    "doc_gas": "26/126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `IFNOTJMP`."
  },
  {
    "name": "CONDSEL",
    "alias_of": "",
    "tlb": "#E304",
    "doc_category": "cont_conditional",
    "doc_opcode": "E304",
    "doc_fift": "CONDSEL",
    "doc_stack": "f x y - x or y",
    "doc_gas": 26,
    "doc_description": "If integer `f` is non-zero, returns `x`, otherwise returns `y`. Notice that no type checks are performed on `x` and `y`; as such, it is more like a conditional stack operation. Roughly equivalent to `ROT` `ISZERO` `INC` `ROLLX` `NIP`."
  },
  {
    "name": "CONDSELCHK",
    "alias_of": "",
    "tlb": "#E305",
    "doc_category": "cont_conditional",
    "doc_opcode": "E305",
    "doc_fift": "CONDSELCHK",
    "doc_stack": "f x y - x or y",
    "doc_gas": 26,
    "doc_description": "Same as `CONDSEL`, but first checks whether `x` and `y` have the same type."
  },
  {
    "name": "IFRETALT",
    "alias_of": "",
    "tlb": "#E308",
    "doc_category": "cont_conditional",
    "doc_opcode": "E308",
    "doc_fift": "IFRETALT",
    "doc_stack": "f -",
    "doc_gas": 26,
    "doc_description": "Performs `RETALT` if integer `f!=0`."
  },
  {
    "name": "IFNOTRETALT",
    "alias_of": "",
    "tlb": "#E309",
    "doc_category": "cont_conditional",
    "doc_opcode": "E309",
    "doc_fift": "IFNOTRETALT",
    "doc_stack": "f -",
    "doc_gas": 26,
    "doc_description": "Performs `RETALT` if integer `f=0`."
  },
  {
    "name": "IFREFELSE",
    "alias_of": "",
    "tlb": "#E30D c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E30D",
    "doc_fift": "[ref] IFREFELSE",
    "doc_stack": "f c -",
    "doc_gas": "26/126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `SWAP` `IFELSE`, with the optimization that the cell reference is not actually loaded into a _Slice_ and then converted into an ordinary _Continuation_ if `f=0`. Similar remarks apply to the next two primitives: cells are converted into continuations only when necessary."
  },
  {
    "name": "IFELSEREF",
    "alias_of": "",
    "tlb": "#E30E c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E30E",
    "doc_fift": "[ref] IFELSEREF",
    "doc_stack": "f c -",
    "doc_gas": "26/126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `IFELSE`."
  },
  {
    "name": "IFREFELSEREF",
    "alias_of": "",
    "tlb": "#E30F c1:^Cell c2:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E30F",
    "doc_fift": "[ref] [ref] IFREFELSEREF",
    "doc_stack": "f -",
    "doc_gas": "126/51",
    "doc_description": "Equivalent to `PUSHREFCONT` `PUSHREFCONT` `IFELSE`."
  },
  {
    "name": "IFBITJMP",
    "alias_of": "",
    "tlb": "#E39_ n:uint5",
    "doc_category": "cont_conditional",
    "doc_opcode": "E39_n",
    "doc_fift": "[n] IFBITJMP",
    "doc_stack": "x c - x",
    "doc_gas": 26,
    "doc_description": "Checks whether bit `0 <= n <= 31` is set in integer `x`, and if so, performs `JMPX` to continuation `c`. Value `x` is left in the stack."
  },
  {
    "name": "IFNBITJMP",
    "alias_of": "",
    "tlb": "#E3B_ n:uint5",
    "doc_category": "cont_conditional",
    "doc_opcode": "E3B_n",
    "doc_fift": "[n] IFNBITJMP",
    "doc_stack": "x c - x",
    "doc_gas": 26,
    "doc_description": "Jumps to `c` if bit `0 <= n <= 31` is not set in integer `x`."
  },
  {
    "name": "IFBITJMPREF",
    "alias_of": "",
    "tlb": "#E3D_ n:uint5 c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E3D_n",
    "doc_fift": "[ref] [n] IFBITJMPREF",
    "doc_stack": "x - x",
    "doc_gas": "126/51",
    "doc_description": "Performs a `JMPREF` if bit `0 <= n <= 31` is set in integer `x`."
  },
  {
    "name": "IFNBITJMPREF",
    "alias_of": "",
    "tlb": "#E3F_ n:uint5 c:^Cell",
    "doc_category": "cont_conditional",
    "doc_opcode": "E3F_n",
    "doc_fift": "[ref] [n] IFNBITJMPREF",
    "doc_stack": "x - x",
    "doc_gas": "126/51",
    "doc_description": "Performs a `JMPREF` if bit `0 <= n <= 31` is not set in integer `x`."
  },
  {
    "name": "BLESS",
    "alias_of": "",
    "tlb": "#ED1E",
    "doc_category": "cont_create",
    "doc_opcode": "ED1E",
    "doc_fift": "BLESS",
    "doc_stack": "s - c",
    "doc_gas": 26,
    "doc_description": "Transforms a _Slice_ `s` into a simple ordinary continuation `c`, with `c.code=s` and an empty stack and savelist."
  },
  {
    "name": "BLESSVARARGS",
    "alias_of": "",
    "tlb": "#ED1F",
    "doc_category": "cont_create",
    "doc_opcode": "ED1F",
    "doc_fift": "BLESSVARARGS",
    "doc_stack": "x_1...x_r s r n - c",
    "doc_gas": "26+s”",
    "doc_description": "Equivalent to `ROT` `BLESS` `ROTREV` `SETCONTVARARGS`."
  },
  {
    "name": "BLESSARGS",
    "alias_of": "",
    "tlb": "#EE r:uint4 n:uint4",
    "doc_category": "cont_create",
    "doc_opcode": "EErn",
    "doc_fift": "[r] [n] BLESSARGS",
    "doc_stack": "x_1...x_r s - c",
    "doc_gas": 26,
    "doc_description": "`0 <= r <= 15`, `-1 <= n <= 14`\nEquivalent to `BLESS` `[r] [n] SETCONTARGS`.\nThe value of `n` is represented inside the instruction by the 4-bit integer `n mod 16`."
  },
  {
    "name": "BLESSNUMARGS",
    "alias_of": "BLESSARGS",
    "tlb": "#EE0 n:uint4",
    "doc_category": "cont_create",
    "doc_opcode": "EE0n",
    "doc_fift": "[n] BLESSNUMARGS",
    "doc_stack": "s - c",
    "doc_gas": 26,
    "doc_description": "Also transforms a _Slice_ `s` into a _Continuation_ `c`, but sets `c.nargs` to `0 <= n <= 14`."
  },
  {
    "name": "CALLDICT",
    "alias_of": "",
    "tlb": "#F0 n:uint8",
    "doc_category": "cont_dict",
    "doc_opcode": "F0nn",
    "doc_fift": "[nn] CALL\n[nn] CALLDICT",
    "doc_stack": "- nn",
    "doc_gas": "",
    "doc_description": "Calls the continuation in `c3`, pushing integer `0 <= nn <= 255` into its stack as an argument.\nApproximately equivalent to `[nn] PUSHINT` `c3 PUSHCTR` `EXECUTE`."
  },
  {
    "name": "CALLDICT_LONG",
    "alias_of": "",
    "tlb": "#F12_ n:uint14",
    "doc_category": "cont_dict",
    "doc_opcode": "F12_n",
    "doc_fift": "[n] CALL\n[n] CALLDICT",
    "doc_stack": "- n",
    "doc_gas": "",
    "doc_description": "For `0 <= n < 2^14`, an encoding of `[n] CALL` for larger values of `n`."
  },
  {
    "name": "JMPDICT",
    "alias_of": "",
    "tlb": "#F16_ n:uint14",
    "doc_category": "cont_dict",
    "doc_opcode": "F16_n",
    "doc_fift": "[n] JMP",
    "doc_stack": "- n",
    "doc_gas": "",
    "doc_description": "Jumps to the continuation in `c3`, pushing integer `0 <= n < 2^14` as its argument.\nApproximately equivalent to `n PUSHINT` `c3 PUSHCTR` `JMPX`."
  },
  {
    "name": "PREPAREDICT",
    "alias_of": "",
    "tlb": "#F1A_ n:uint14",
    "doc_category": "cont_dict",
    "doc_opcode": "F1A_n",
    "doc_fift": "[n] PREPARE\n[n] PREPAREDICT",
    "doc_stack": "- n c",
    "doc_gas": "",
    "doc_description": "Equivalent to `n PUSHINT` `c3 PUSHCTR`, for `0 <= n < 2^14`.\nIn this way, `[n] CALL` is approximately equivalent to `[n] PREPARE` `EXECUTE`, and `[n] JMP` is approximately equivalent to `[n] PREPARE` `JMPX`.\nOne might use, for instance, `CALLXARGS` or `CALLCC` instead of `EXECUTE` here."
  },
  {
    "name": "REPEAT",
    "alias_of": "",
    "tlb": "#E4",
    "doc_category": "cont_loops",
    "doc_opcode": "E4",
    "doc_fift": "REPEAT",
    "doc_stack": "n c -",
    "doc_gas": 18,
    "doc_description": "Executes continuation `c` `n` times, if integer `n` is non-negative. If `n>=2^31` or `n<-2^31`, generates a range check exception.\nNotice that a `RET` inside the code of `c` works as a `continue`, not as a `break`. One should use either alternative (experimental) loops or alternative `RETALT` (along with a `SETEXITALT` before the loop) to `break` out of a loop."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "E4",
    "doc_fift": "REPEAT:<{ code }>\n<{ code }>REPEAT",
    "doc_stack": "n -",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `REPEAT`."
  },
  {
    "name": "REPEATEND",
    "alias_of": "",
    "tlb": "#E5",
    "doc_category": "cont_loops",
    "doc_opcode": "E5",
    "doc_fift": "REPEATEND\nREPEAT:",
    "doc_stack": "n -",
    "doc_gas": 18,
    "doc_description": "Similar to `REPEAT`, but it is applied to the current continuation `cc`."
  },
  {
    "name": "UNTIL",
    "alias_of": "",
    "tlb": "#E6",
    "doc_category": "cont_loops",
    "doc_opcode": "E6",
    "doc_fift": "UNTIL",
    "doc_stack": "c -",
    "doc_gas": 18,
    "doc_description": "Executes continuation `c`, then pops an integer `x` from the resulting stack. If `x` is zero, performs another iteration of this loop. The actual implementation of this primitive involves an extraordinary continuation `ec_until` with its arguments set to the body of the loop (continuation `c`) and the original current continuation `cc`. This extraordinary continuation is then saved into the savelist of `c` as `c.c0` and the modified `c` is then executed. The other loop primitives are implemented similarly with the aid of suitable extraordinary continuations."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "E6",
    "doc_fift": "UNTIL:<{ code }>\n<{ code }>UNTIL",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `UNTIL`."
  },
  {
    "name": "UNTILEND",
    "alias_of": "",
    "tlb": "#E7",
    "doc_category": "cont_loops",
    "doc_opcode": "E7",
    "doc_fift": "UNTILEND\nUNTIL:",
    "doc_stack": "-",
    "doc_gas": 18,
    "doc_description": "Similar to `UNTIL`, but executes the current continuation `cc` in a loop. When the loop exit condition is satisfied, performs a `RET`."
  },
  {
    "name": "WHILE",
    "alias_of": "",
    "tlb": "#E8",
    "doc_category": "cont_loops",
    "doc_opcode": "E8",
    "doc_fift": "WHILE",
    "doc_stack": "c' c -",
    "doc_gas": 18,
    "doc_description": "Executes `c'` and pops an integer `x` from the resulting stack. If `x` is zero, exists the loop and transfers control to the original `cc`. If `x` is non-zero, executes `c`, and then begins a new iteration."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "E8",
    "doc_fift": "WHILE:<{ cond }>DO<{ code }>",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ cond }> CONT` `<{ code }> CONT` `WHILE`."
  },
  {
    "name": "WHILEEND",
    "alias_of": "",
    "tlb": "#E9",
    "doc_category": "cont_loops",
    "doc_opcode": "E9",
    "doc_fift": "WHILEEND",
    "doc_stack": "c' -",
    "doc_gas": 18,
    "doc_description": "Similar to `WHILE`, but uses the current continuation `cc` as the loop body."
  },
  {
    "name": "AGAIN",
    "alias_of": "",
    "tlb": "#EA",
    "doc_category": "cont_loops",
    "doc_opcode": "EA",
    "doc_fift": "AGAIN",
    "doc_stack": "c -",
    "doc_gas": 18,
    "doc_description": "Similar to `REPEAT`, but executes `c` infinitely many times. A `RET` only begins a new iteration of the infinite loop, which can be exited only by an exception, or a `RETALT` (or an explicit `JMPX`)."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "EA",
    "doc_fift": "AGAIN:<{ code }>\n<{ code }>AGAIN",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `AGAIN`."
  },
  {
    "name": "AGAINEND",
    "alias_of": "",
    "tlb": "#EB",
    "doc_category": "cont_loops",
    "doc_opcode": "EB",
    "doc_fift": "AGAINEND\nAGAIN:",
    "doc_stack": "-",
    "doc_gas": 18,
    "doc_description": "Similar to `AGAIN`, but performed with respect to the current continuation `cc`."
  },
  {
    "name": "REPEATBRK",
    "alias_of": "",
    "tlb": "#E314",
    "doc_category": "cont_loops",
    "doc_opcode": "E314",
    "doc_fift": "REPEATBRK",
    "doc_stack": "n c -",
    "doc_gas": 26,
    "doc_description": "Similar to `REPEAT`, but also sets `c1` to the original `cc` after saving the old value of `c1` into the savelist of the original `cc`. In this way `RETALT` could be used to break out of the loop body."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "E314",
    "doc_fift": "REPEATBRK:<{ code }>\n<{ code }>REPEATBRK",
    "doc_stack": "n -",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `REPEATBRK`."
  },
  {
    "name": "REPEATENDBRK",
    "alias_of": "",
    "tlb": "#E315",
    "doc_category": "cont_loops",
    "doc_opcode": "E315",
    "doc_fift": "REPEATENDBRK",
    "doc_stack": "n -",
    "doc_gas": 26,
    "doc_description": "Similar to `REPEATEND`, but also sets `c1` to the original `c0` after saving the old value of `c1` into the savelist of the original `c0`. Equivalent to `SAMEALTSAVE` `REPEATEND`."
  },
  {
    "name": "UNTILBRK",
    "alias_of": "",
    "tlb": "#E316",
    "doc_category": "cont_loops",
    "doc_opcode": "E316",
    "doc_fift": "UNTILBRK",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Similar to `UNTIL`, but also modifies `c1` in the same way as `REPEATBRK`."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "E316",
    "doc_fift": "UNTILBRK:<{ code }>",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `UNTILBRK`."
  },
  {
    "name": "UNTILENDBRK",
    "alias_of": "",
    "tlb": "#E317",
    "doc_category": "cont_loops",
    "doc_opcode": "E317",
    "doc_fift": "UNTILENDBRK\nUNTILBRK:",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Equivalent to `SAMEALTSAVE` `UNTILEND`."
  },
  {
    "name": "WHILEBRK",
    "alias_of": "",
    "tlb": "#E318",
    "doc_category": "cont_loops",
    "doc_opcode": "E318",
    "doc_fift": "WHILEBRK",
    "doc_stack": "c' c -",
    "doc_gas": 26,
    "doc_description": "Similar to `WHILE`, but also modifies `c1` in the same way as `REPEATBRK`."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "E318",
    "doc_fift": "WHILEBRK:<{ cond }>DO<{ code }>",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ cond }> CONT` `<{ code }> CONT` `WHILEBRK`."
  },
  {
    "name": "WHILEENDBRK",
    "alias_of": "",
    "tlb": "#E319",
    "doc_category": "cont_loops",
    "doc_opcode": "E319",
    "doc_fift": "WHILEENDBRK",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Equivalent to `SAMEALTSAVE` `WHILEEND`."
  },
  {
    "name": "AGAINBRK",
    "alias_of": "",
    "tlb": "#E31A",
    "doc_category": "cont_loops",
    "doc_opcode": "E31A",
    "doc_fift": "AGAINBRK",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Similar to `AGAIN`, but also modifies `c1` in the same way as `REPEATBRK`."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_loops",
    "doc_opcode": "E31A",
    "doc_fift": "AGAINBRK:<{ code }>",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `AGAINBRK`."
  },
  {
    "name": "AGAINENDBRK",
    "alias_of": "",
    "tlb": "#E31B",
    "doc_category": "cont_loops",
    "doc_opcode": "E31B",
    "doc_fift": "AGAINENDBRK\nAGAINBRK:",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Equivalent to `SAMEALTSAVE` `AGAINEND`."
  },
  {
    "name": "PUSHCTR",
    "alias_of": "",
    "tlb": "#ED4 i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "ED4i",
    "doc_fift": "c[i] PUSHCTR\nc[i] PUSH",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Pushes the current value of control register `c(i)`. If the control register is not supported in the current codepage, or if it does not have a value, an exception is triggered."
  },
  {
    "name": "PUSHROOT",
    "alias_of": "PUSHCTR",
    "tlb": "#ED44",
    "doc_category": "cont_registers",
    "doc_opcode": "ED44",
    "doc_fift": "c4 PUSHCTR\nc4 PUSH",
    "doc_stack": "- x",
    "doc_gas": 26,
    "doc_description": "Pushes the “global data root'' cell reference, thus enabling access to persistent smart-contract data."
  },
  {
    "name": "POPCTR",
    "alias_of": "",
    "tlb": "#ED5 i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "ED5i",
    "doc_fift": "c[i] POPCTR\nc[i] POP",
    "doc_stack": "x -",
    "doc_gas": 26,
    "doc_description": "Pops a value `x` from the stack and stores it into control register `c(i)`, if supported in the current codepage. Notice that if a control register accepts only values of a specific type, a type-checking exception may occur."
  },
  {
    "name": "POPROOT",
    "alias_of": "POPCTR",
    "tlb": "#ED54",
    "doc_category": "cont_registers",
    "doc_opcode": "ED54",
    "doc_fift": "c4 POPCTR\nc4 POP",
    "doc_stack": "x -",
    "doc_gas": 26,
    "doc_description": "Sets the “global data root'' cell reference, thus allowing modification of persistent smart-contract data."
  },
  {
    "name": "SETCONTCTR",
    "alias_of": "",
    "tlb": "#ED6 i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "ED6i",
    "doc_fift": "c[i] SETCONT\nc[i] SETCONTCTR",
    "doc_stack": "x c - c'",
    "doc_gas": 26,
    "doc_description": "Stores `x` into the savelist of continuation `c` as `c(i)`, and returns the resulting continuation `c'`. Almost all operations with continuations may be expressed in terms of `SETCONTCTR`, `POPCTR`, and `PUSHCTR`."
  },
  {
    "name": "SETRETCTR",
    "alias_of": "",
    "tlb": "#ED7 i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "ED7i",
    "doc_fift": "c[i] SETRETCTR",
    "doc_stack": "x -",
    "doc_gas": 26,
    "doc_description": "Equivalent to `c0 PUSHCTR` `c[i] SETCONTCTR` `c0 POPCTR`."
  },
  {
    "name": "SETALTCTR",
    "alias_of": "",
    "tlb": "#ED8 i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "ED8i",
    "doc_fift": "c[i] SETALTCTR",
    "doc_stack": "x -",
    "doc_gas": 26,
    "doc_description": "Equivalent to `c1 PUSHCTR` `c[i] SETCONTCTR` `c1 POPCTR`."
  },
  {
    "name": "POPSAVE",
    "alias_of": "",
    "tlb": "#ED9 i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "ED9i",
    "doc_fift": "c[i] POPSAVE\nc[i] POPCTRSAVE",
    "doc_stack": "x -",
    "doc_gas": 26,
    "doc_description": "Similar to `c[i] POPCTR`, but also saves the old value of `c[i]` into continuation `c0`.\nEquivalent (up to exceptions) to `c[i] SAVECTR` `c[i] POPCTR`."
  },
  {
    "name": "SAVE",
    "alias_of": "",
    "tlb": "#EDA i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "EDAi",
    "doc_fift": "c[i] SAVE\nc[i] SAVECTR",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Saves the current value of `c(i)` into the savelist of continuation `c0`. If an entry for `c[i]` is already present in the savelist of `c0`, nothing is done. Equivalent to `c[i] PUSHCTR` `c[i] SETRETCTR`."
  },
  {
    "name": "SAVEALT",
    "alias_of": "",
    "tlb": "#EDB i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "EDBi",
    "doc_fift": "c[i] SAVEALT\nc[i] SAVEALTCTR",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Similar to `c[i] SAVE`, but saves the current value of `c[i]` into the savelist of `c1`, not `c0`."
  },
  {
    "name": "SAVEBOTH",
    "alias_of": "",
    "tlb": "#EDC i:uint4",
    "doc_category": "cont_registers",
    "doc_opcode": "EDCi",
    "doc_fift": "c[i] SAVEBOTH\nc[i] SAVEBOTHCTR",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `c[i] SAVE` `c[i] SAVEALT`."
  },
  {
    "name": "PUSHCTRX",
    "alias_of": "",
    "tlb": "#EDE0",
    "doc_category": "cont_registers",
    "doc_opcode": "EDE0",
    "doc_fift": "PUSHCTRX",
    "doc_stack": "i - x",
    "doc_gas": 26,
    "doc_description": "Similar to `c[i] PUSHCTR`, but with `i`, `0 <= i <= 255`, taken from the stack.\nNotice that this primitive is one of the few “exotic'' primitives, which are not polymorphic like stack manipulation primitives, and at the same time do not have well-defined types of parameters and return values, because the type of `x` depends on `i`."
  },
  {
    "name": "POPCTRX",
    "alias_of": "",
    "tlb": "#EDE1",
    "doc_category": "cont_registers",
    "doc_opcode": "EDE1",
    "doc_fift": "POPCTRX",
    "doc_stack": "x i -",
    "doc_gas": 26,
    "doc_description": "Similar to `c[i] POPCTR`, but with `0 <= i <= 255` from the stack."
  },
  {
    "name": "SETCONTCTRX",
    "alias_of": "",
    "tlb": "#EDE2",
    "doc_category": "cont_registers",
    "doc_opcode": "EDE2",
    "doc_fift": "SETCONTCTRX",
    "doc_stack": "x c i - c'",
    "doc_gas": 26,
    "doc_description": "Similar to `c[i] SETCONTCTR`, but with `0 <= i <= 255` from the stack."
  },
  {
    "name": "COMPOS",
    "alias_of": "",
    "tlb": "#EDF0",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF0",
    "doc_fift": "COMPOS\nBOOLAND",
    "doc_stack": "c c' - c''",
    "doc_gas": 26,
    "doc_description": "Computes the composition `compose0(c, c’)`, which has the meaning of “perform `c`, and, if successful, perform `c'`'' (if `c` is a boolean circuit) or simply “perform `c`, then `c'`''. Equivalent to `SWAP` `c0 SETCONT`."
  },
  {
    "name": "COMPOSALT",
    "alias_of": "",
    "tlb": "#EDF1",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF1",
    "doc_fift": "COMPOSALT\nBOOLOR",
    "doc_stack": "c c' - c''",
    "doc_gas": 26,
    "doc_description": "Computes the alternative composition `compose1(c, c’)`, which has the meaning of “perform `c`, and, if not successful, perform `c'`'' (if `c` is a boolean circuit). Equivalent to `SWAP` `c1 SETCONT`."
  },
  {
    "name": "COMPOSBOTH",
    "alias_of": "",
    "tlb": "#EDF2",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF2",
    "doc_fift": "COMPOSBOTH",
    "doc_stack": "c c' - c''",
    "doc_gas": 26,
    "doc_description": "Computes composition `compose1(compose0(c, c’), c’)`, which has the meaning of “compute boolean circuit `c`, then compute `c'`, regardless of the result of `c`''."
  },
  {
    "name": "ATEXIT",
    "alias_of": "",
    "tlb": "#EDF3",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF3",
    "doc_fift": "ATEXIT",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Sets `c0` to `compose0(c, c0)`. In other words, `c` will be executed before exiting current subroutine."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF3",
    "doc_fift": "ATEXIT:<{ code }>\n<{ code }>ATEXIT",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `ATEXIT`."
  },
  {
    "name": "ATEXITALT",
    "alias_of": "",
    "tlb": "#EDF4",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF4",
    "doc_fift": "ATEXITALT",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Sets `c1` to `compose1(c, c1)`. In other words, `c` will be executed before exiting current subroutine by its alternative return path."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF4",
    "doc_fift": "ATEXITALT:<{ code }>\n<{ code }>ATEXITALT",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code }> CONT` `ATEXITALT`."
  },
  {
    "name": "SETEXITALT",
    "alias_of": "",
    "tlb": "#EDF5",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF5",
    "doc_fift": "SETEXITALT",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Sets `c1` to `compose1(compose0(c, c0), c1)`,\nIn this way, a subsequent `RETALT` will first execute `c`, then transfer control to the original `c0`. This can be used, for instance, to exit from nested loops."
  },
  {
    "name": "THENRET",
    "alias_of": "",
    "tlb": "#EDF6",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF6",
    "doc_fift": "THENRET",
    "doc_stack": "c - c'",
    "doc_gas": 26,
    "doc_description": "Computes `compose0(c, c0)`."
  },
  {
    "name": "THENRETALT",
    "alias_of": "",
    "tlb": "#EDF7",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF7",
    "doc_fift": "THENRETALT",
    "doc_stack": "c - c'",
    "doc_gas": 26,
    "doc_description": "Computes `compose0(c, c1)`"
  },
  {
    "name": "INVERT",
    "alias_of": "",
    "tlb": "#EDF8",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF8",
    "doc_fift": "INVERT",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Interchanges `c0` and `c1`."
  },
  {
    "name": "BOOLEVAL",
    "alias_of": "",
    "tlb": "#EDF9",
    "doc_category": "cont_registers",
    "doc_opcode": "EDF9",
    "doc_fift": "BOOLEVAL",
    "doc_stack": "c - ?",
    "doc_gas": 26,
    "doc_description": "Performs `cc:=compose1(compose0(c, compose0(-1 PUSHINT, cc)), compose0(0 PUSHINT, cc))`. If `c` represents a boolean circuit, the net effect is to evaluate it and push either `-1` or `0` into the stack before continuing."
  },
  {
    "name": "SAMEALT",
    "alias_of": "",
    "tlb": "#EDFA",
    "doc_category": "cont_registers",
    "doc_opcode": "EDFA",
    "doc_fift": "SAMEALT",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Sets `c1` to `c0`. Equivalent to `c0 PUSHCTR` `c1 POPCTR`."
  },
  {
    "name": "SAMEALTSAVE",
    "alias_of": "",
    "tlb": "#EDFB",
    "doc_category": "cont_registers",
    "doc_opcode": "EDFB",
    "doc_fift": "SAMEALTSAVE",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Sets `c1` to `c0`, but first saves the old value of `c1` into the savelist of `c0`.\nEquivalent to `c1 SAVE` `SAMEALT`."
  },
  {
    "name": "SETCONTARGS_N",
    "alias_of": "",
    "tlb": "#EC r:uint4 n:(#<= 14)",
    "doc_category": "cont_stack",
    "doc_opcode": "ECrn",
    "doc_fift": "[r] [n] SETCONTARGS",
    "doc_stack": "x_1 x_2...x_r c - c'",
    "doc_gas": "26+s”",
    "doc_description": "Similar to `[r] -1 SETCONTARGS`, but sets `c.nargs` to the final size of the stack of `c'` plus `n`. In other words, transforms `c` into a _closure_ or a _partially applied function_, with `0 <= n <= 14` arguments missing."
  },
  {
    "name": "SETNUMARGS",
    "alias_of": "SETCONTARGS_N",
    "tlb": "#EC0 n:(#<= 14)",
    "doc_category": "cont_stack",
    "doc_opcode": "EC0n",
    "doc_fift": "[n] SETNUMARGS",
    "doc_stack": "c - c'",
    "doc_gas": 26,
    "doc_description": "Sets `c.nargs` to `n` plus the current depth of `c`'s stack, where `0 <= n <= 14`. If `c.nargs` is already set to a non-negative value, does nothing."
  },
  {
    "name": "SETCONTARGS",
    "alias_of": "",
    "tlb": "#EC r:uint4 n:(## 4) {n = 15}",
    "doc_category": "cont_stack",
    "doc_opcode": "ECrF",
    "doc_fift": "[r] -1 SETCONTARGS",
    "doc_stack": "x_1 x_2...x_r c - c'",
    "doc_gas": "26+s”",
    "doc_description": "Pushes `0 <= r <= 15` values `x_1...x_r` into the stack of (a copy of) the continuation `c`, starting with `x_1`. If the final depth of `c`'s stack turns out to be greater than `c.nargs`, a stack overflow exception is generated."
  },
  {
    "name": "RETURNARGS",
    "alias_of": "",
    "tlb": "#ED0 p:uint4",
    "doc_category": "cont_stack",
    "doc_opcode": "ED0p",
    "doc_fift": "[p] RETURNARGS",
    "doc_stack": "-",
    "doc_gas": "26+s”",
    "doc_description": "Leaves only the top `0 <= p <= 15` values in the current stack (somewhat similarly to `ONLYTOPX`), with all the unused bottom values not discarded, but saved into continuation `c0` in the same way as `SETCONTARGS` does."
  },
  {
    "name": "RETURNVARARGS",
    "alias_of": "",
    "tlb": "#ED10",
    "doc_category": "cont_stack",
    "doc_opcode": "ED10",
    "doc_fift": "RETURNVARARGS",
    "doc_stack": "p -",
    "doc_gas": "26+s”",
    "doc_description": "Similar to `RETURNARGS`, but with Integer `0 <= p <= 255` taken from the stack."
  },
  {
    "name": "SETCONTVARARGS",
    "alias_of": "",
    "tlb": "#ED11",
    "doc_category": "cont_stack",
    "doc_opcode": "ED11",
    "doc_fift": "SETCONTVARARGS",
    "doc_stack": "x_1 x_2...x_r c r n - c'",
    "doc_gas": "26+s”",
    "doc_description": "Similar to `SETCONTARGS`, but with `0 <= r <= 255` and `-1 <= n <= 255` taken from the stack."
  },
  {
    "name": "SETNUMVARARGS",
    "alias_of": "",
    "tlb": "#ED12",
    "doc_category": "cont_stack",
    "doc_opcode": "ED12",
    "doc_fift": "SETNUMVARARGS",
    "doc_stack": "c n - c'",
    "doc_gas": 26,
    "doc_description": "`-1 <= n <= 255`\nIf `n=-1`, this operation does nothing (`c'=c`).\nOtherwise its action is similar to `[n] SETNUMARGS`, but with `n` taken from the stack."
  },
  {
    "name": "RUNVM",
    "alias_of": "",
    "tlb": "#DB4 flags:(## 12)",
    "doc_category": "cont_basic",
    "doc_opcode": "DB4fff",
    "doc_fift": "RUNVM",
    "doc_stack": "x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]",
    "doc_gas": "66+x",
    "doc_description": "Runs child VM with code `code` and stack `x_1...x_n`. Returns the resulting stack `x'_1...x'_m` and exitcode. Other arguments and return values are enabled by flags."
  },
  {
    "name": "RUNVMX",
    "alias_of": "",
    "tlb": "#DB50",
    "doc_category": "cont_basic",
    "doc_opcode": "DB50",
    "doc_fift": "RUNVMX",
    "doc_stack": "x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]",
    "doc_gas": "66+x",
    "doc_description": "Same as `RUNVM`, but pops flags from stack."
  }
]



================================================
FILE: src/data/opcodes/dictionaries.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/dictionaries.json
================================================
[
  {
    "name": "NEWDICT",
    "alias_of": "NULL",
    "tlb": "#6D",
    "doc_category": "dict_create",
    "doc_opcode": "6D",
    "doc_fift": "NEWDICT",
    "doc_stack": "- D",
    "doc_gas": 18,
    "doc_description": "Returns a new empty dictionary.\nIt is an alternative mnemonics for `PUSHNULL`."
  },
  {
    "name": "DICTEMPTY",
    "alias_of": "ISNULL",
    "tlb": "#6E",
    "doc_category": "dict_create",
    "doc_opcode": "6E",
    "doc_fift": "DICTEMPTY",
    "doc_stack": "D - ?",
    "doc_gas": 18,
    "doc_description": "Checks whether dictionary `D` is empty, and returns `-1` or `0` accordingly.\nIt is an alternative mnemonics for `ISNULL`."
  },
  {
    "name": "STDICTS",
    "alias_of": "STSLICE",
    "tlb": "#CE",
    "doc_category": "dict_serial",
    "doc_opcode": "CE",
    "doc_fift": "STDICTS",
    "doc_stack": "s b - b'",
    "doc_gas": 18,
    "doc_description": "Stores a _Slice_-represented dictionary `s` into _Builder_ `b`.\nIt is actually a synonym for `STSLICE`."
  },
  {
    "name": "STDICT",
    "alias_of": "",
    "tlb": "#F400",
    "doc_category": "dict_serial",
    "doc_opcode": "F400",
    "doc_fift": "STDICT\nSTOPTREF",
    "doc_stack": "D b - b'",
    "doc_gas": 26,
    "doc_description": "Stores dictionary `D` into _Builder_ `b`, returing the resulting _Builder_ `b'`.\nIn other words, if `D` is a cell, performs `STONE` and `STREF`; if `D` is _Null_, performs `NIP` and `STZERO`; otherwise throws a type checking exception."
  },
  {
    "name": "SKIPDICT",
    "alias_of": "",
    "tlb": "#F401",
    "doc_category": "dict_serial",
    "doc_opcode": "F401",
    "doc_fift": "SKIPDICT\nSKIPOPTREF",
    "doc_stack": "s - s'",
    "doc_gas": 26,
    "doc_description": "Equivalent to `LDDICT` `NIP`."
  },
  {
    "name": "LDDICTS",
    "alias_of": "",
    "tlb": "#F402",
    "doc_category": "dict_serial",
    "doc_opcode": "F402",
    "doc_fift": "LDDICTS",
    "doc_stack": "s - s' s''",
    "doc_gas": 26,
    "doc_description": "Loads (parses) a (_Slice_-represented) dictionary `s'` from _Slice_ `s`, and returns the remainder of `s` as `s''`.\nThis is a “split function'' for all `HashmapE(n,X)` dictionary types."
  },
  {
    "name": "PLDDICTS",
    "alias_of": "",
    "tlb": "#F403",
    "doc_category": "dict_serial",
    "doc_opcode": "F403",
    "doc_fift": "PLDDICTS",
    "doc_stack": "s - s'",
    "doc_gas": 26,
    "doc_description": "Preloads a (_Slice_-represented) dictionary `s'` from _Slice_ `s`.\nApproximately equivalent to `LDDICTS` `DROP`."
  },
  {
    "name": "LDDICT",
    "alias_of": "",
    "tlb": "#F404",
    "doc_category": "dict_serial",
    "doc_opcode": "F404",
    "doc_fift": "LDDICT\nLDOPTREF",
    "doc_stack": "s - D s'",
    "doc_gas": 26,
    "doc_description": "Loads (parses) a dictionary `D` from _Slice_ `s`, and returns the remainder of `s` as `s'`. May be applied to dictionaries or to values of arbitrary `(^Y)?` types."
  },
  {
    "name": "PLDDICT",
    "alias_of": "",
    "tlb": "#F405",
    "doc_category": "dict_serial",
    "doc_opcode": "F405",
    "doc_fift": "PLDDICT\nPLDOPTREF",
    "doc_stack": "s - D",
    "doc_gas": 26,
    "doc_description": "Preloads a dictionary `D` from _Slice_ `s`.\nApproximately equivalent to `LDDICT` `DROP`."
  },
  {
    "name": "LDDICTQ",
    "alias_of": "",
    "tlb": "#F406",
    "doc_category": "dict_serial",
    "doc_opcode": "F406",
    "doc_fift": "LDDICTQ",
    "doc_stack": "s - D s' -1 or s 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `LDDICT`."
  },
  {
    "name": "PLDDICTQ",
    "alias_of": "",
    "tlb": "#F407",
    "doc_category": "dict_serial",
    "doc_opcode": "F407",
    "doc_fift": "PLDDICTQ",
    "doc_stack": "s - D -1 or 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `PLDDICT`."
  },
  {
    "name": "DICTGET",
    "alias_of": "",
    "tlb": "#F40A",
    "doc_category": "dict_get",
    "doc_opcode": "F40A",
    "doc_fift": "DICTGET",
    "doc_stack": "k D n - x -1 or 0",
    "doc_gas": "",
    "doc_description": "Looks up key `k` (represented by a _Slice_, the first `0 <= n <= 1023` data bits of which are used as a key) in dictionary `D` of type `HashmapE(n,X)` with `n`-bit keys.\nOn success, returns the value found as a _Slice_ `x`."
  },
  {
    "name": "DICTGETREF",
    "alias_of": "",
    "tlb": "#F40B",
    "doc_category": "dict_get",
    "doc_opcode": "F40B",
    "doc_fift": "DICTGETREF",
    "doc_stack": "k D n - c -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGET`, but with a `LDREF` `ENDS` applied to `x` on success.\nThis operation is useful for dictionaries of type `HashmapE(n,^Y)`."
  },
  {
    "name": "DICTIGET",
    "alias_of": "",
    "tlb": "#F40C",
    "doc_category": "dict_get",
    "doc_opcode": "F40C",
    "doc_fift": "DICTIGET",
    "doc_stack": "i D n - x -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGET`, but with a signed (big-endian) `n`-bit _Integer_ `i` as a key. If `i` does not fit into `n` bits, returns `0`. If `i` is a `NaN`, throws an integer overflow exception."
  },
  {
    "name": "DICTIGETREF",
    "alias_of": "",
    "tlb": "#F40D",
    "doc_category": "dict_get",
    "doc_opcode": "F40D",
    "doc_fift": "DICTIGETREF",
    "doc_stack": "i D n - c -1 or 0",
    "doc_gas": "",
    "doc_description": "Combines `DICTIGET` with `DICTGETREF`: it uses signed `n`-bit _Integer_ `i` as a key and returns a _Cell_ instead of a _Slice_ on success."
  },
  {
    "name": "DICTUGET",
    "alias_of": "",
    "tlb": "#F40E",
    "doc_category": "dict_get",
    "doc_opcode": "F40E",
    "doc_fift": "DICTUGET",
    "doc_stack": "i D n - x -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIGET`, but with _unsigned_ (big-endian) `n`-bit _Integer_ `i` used as a key."
  },
  {
    "name": "DICTUGETREF",
    "alias_of": "",
    "tlb": "#F40F",
    "doc_category": "dict_get",
    "doc_opcode": "F40F",
    "doc_fift": "DICTUGETREF",
    "doc_stack": "i D n - c -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIGETREF`, but with an unsigned `n`-bit _Integer_ key `i`."
  },
  {
    "name": "DICTSET",
    "alias_of": "",
    "tlb": "#F412",
    "doc_category": "dict_set",
    "doc_opcode": "F412",
    "doc_fift": "DICTSET",
    "doc_stack": "x k D n - D'",
    "doc_gas": "",
    "doc_description": "Sets the value associated with `n`-bit key `k` (represented by a _Slice_ as in `DICTGET`) in dictionary `D` (also represented by a _Slice_) to value `x` (again a _Slice_), and returns the resulting dictionary as `D'`."
  },
  {
    "name": "DICTSETREF",
    "alias_of": "",
    "tlb": "#F413",
    "doc_category": "dict_set",
    "doc_opcode": "F413",
    "doc_fift": "DICTSETREF",
    "doc_stack": "c k D n - D'",
    "doc_gas": "",
    "doc_description": "Similar to `DICTSET`, but with the value set to a reference to _Cell_ `c`."
  },
  {
    "name": "DICTISET",
    "alias_of": "",
    "tlb": "#F414",
    "doc_category": "dict_set",
    "doc_opcode": "F414",
    "doc_fift": "DICTISET",
    "doc_stack": "x i D n - D'",
    "doc_gas": "",
    "doc_description": "Similar to `DICTSET`, but with the key represented by a (big-endian) signed `n`-bit integer `i`. If `i` does not fit into `n` bits, a range check exception is generated."
  },
  {
    "name": "DICTISETREF",
    "alias_of": "",
    "tlb": "#F415",
    "doc_category": "dict_set",
    "doc_opcode": "F415",
    "doc_fift": "DICTISETREF",
    "doc_stack": "c i D n - D'",
    "doc_gas": "",
    "doc_description": "Similar to `DICTSETREF`, but with the key a signed `n`-bit integer as in `DICTISET`."
  },
  {
    "name": "DICTUSET",
    "alias_of": "",
    "tlb": "#F416",
    "doc_category": "dict_set",
    "doc_opcode": "F416",
    "doc_fift": "DICTUSET",
    "doc_stack": "x i D n - D'",
    "doc_gas": "",
    "doc_description": "Similar to `DICTISET`, but with `i` an _unsigned_ `n`-bit integer."
  },
  {
    "name": "DICTUSETREF",
    "alias_of": "",
    "tlb": "#F417",
    "doc_category": "dict_set",
    "doc_opcode": "F417",
    "doc_fift": "DICTUSETREF",
    "doc_stack": "c i D n - D'",
    "doc_gas": "",
    "doc_description": "Similar to `DICTISETREF`, but with `i` unsigned."
  },
  {
    "name": "DICTSETGET",
    "alias_of": "",
    "tlb": "#F41A",
    "doc_category": "dict_set",
    "doc_opcode": "F41A",
    "doc_fift": "DICTSETGET",
    "doc_stack": "x k D n - D' y -1 or D' 0",
    "doc_gas": "",
    "doc_description": "Combines `DICTSET` with `DICTGET`: it sets the value corresponding to key `k` to `x`, but also returns the old value `y` associated with the key in question, if present."
  },
  {
    "name": "DICTSETGETREF",
    "alias_of": "",
    "tlb": "#F41B",
    "doc_category": "dict_set",
    "doc_opcode": "F41B",
    "doc_fift": "DICTSETGETREF",
    "doc_stack": "c k D n - D' c' -1 or D' 0",
    "doc_gas": "",
    "doc_description": "Combines `DICTSETREF` with `DICTGETREF` similarly to `DICTSETGET`."
  },
  {
    "name": "DICTISETGET",
    "alias_of": "",
    "tlb": "#F41C",
    "doc_category": "dict_set",
    "doc_opcode": "F41C",
    "doc_fift": "DICTISETGET",
    "doc_stack": "x i D n - D' y -1 or D' 0",
    "doc_gas": "",
    "doc_description": "`DICTISETGET`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTISETGETREF",
    "alias_of": "",
    "tlb": "#F41D",
    "doc_category": "dict_set",
    "doc_opcode": "F41D",
    "doc_fift": "DICTISETGETREF",
    "doc_stack": "c i D n - D' c' -1 or D' 0",
    "doc_gas": "",
    "doc_description": "`DICTISETGETREF`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTUSETGET",
    "alias_of": "",
    "tlb": "#F41E",
    "doc_category": "dict_set",
    "doc_opcode": "F41E",
    "doc_fift": "DICTUSETGET",
    "doc_stack": "x i D n - D' y -1 or D' 0",
    "doc_gas": "",
    "doc_description": "`DICTISETGET`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTUSETGETREF",
    "alias_of": "",
    "tlb": "#F41F",
    "doc_category": "dict_set",
    "doc_opcode": "F41F",
    "doc_fift": "DICTUSETGETREF",
    "doc_stack": "c i D n - D' c' -1 or D' 0",
    "doc_gas": "",
    "doc_description": "`DICTISETGETREF`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTREPLACE",
    "alias_of": "",
    "tlb": "#F422",
    "doc_category": "dict_set",
    "doc_opcode": "F422",
    "doc_fift": "DICTREPLACE",
    "doc_stack": "x k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "A _Replace_ operation, which is similar to `DICTSET`, but sets the value of key `k` in dictionary `D` to `x` only if the key `k` was already present in `D`."
  },
  {
    "name": "DICTREPLACEREF",
    "alias_of": "",
    "tlb": "#F423",
    "doc_category": "dict_set",
    "doc_opcode": "F423",
    "doc_fift": "DICTREPLACEREF",
    "doc_stack": "c k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "A _Replace_ counterpart of `DICTSETREF`."
  },
  {
    "name": "DICTIREPLACE",
    "alias_of": "",
    "tlb": "#F424",
    "doc_category": "dict_set",
    "doc_opcode": "F424",
    "doc_fift": "DICTIREPLACE",
    "doc_stack": "x i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACE`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTIREPLACEREF",
    "alias_of": "",
    "tlb": "#F425",
    "doc_category": "dict_set",
    "doc_opcode": "F425",
    "doc_fift": "DICTIREPLACEREF",
    "doc_stack": "c i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACEREF`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTUREPLACE",
    "alias_of": "",
    "tlb": "#F426",
    "doc_category": "dict_set",
    "doc_opcode": "F426",
    "doc_fift": "DICTUREPLACE",
    "doc_stack": "x i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACE`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTUREPLACEREF",
    "alias_of": "",
    "tlb": "#F427",
    "doc_category": "dict_set",
    "doc_opcode": "F427",
    "doc_fift": "DICTUREPLACEREF",
    "doc_stack": "c i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACEREF`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTREPLACEGET",
    "alias_of": "",
    "tlb": "#F42A",
    "doc_category": "dict_set",
    "doc_opcode": "F42A",
    "doc_fift": "DICTREPLACEGET",
    "doc_stack": "x k D n - D' y -1 or D 0",
    "doc_gas": "",
    "doc_description": "A _Replace_ counterpart of `DICTSETGET`: on success, also returns the old value associated with the key in question."
  },
  {
    "name": "DICTREPLACEGETREF",
    "alias_of": "",
    "tlb": "#F42B",
    "doc_category": "dict_set",
    "doc_opcode": "F42B",
    "doc_fift": "DICTREPLACEGETREF",
    "doc_stack": "c k D n - D' c' -1 or D 0",
    "doc_gas": "",
    "doc_description": "A _Replace_ counterpart of `DICTSETGETREF`."
  },
  {
    "name": "DICTIREPLACEGET",
    "alias_of": "",
    "tlb": "#F42C",
    "doc_category": "dict_set",
    "doc_opcode": "F42C",
    "doc_fift": "DICTIREPLACEGET",
    "doc_stack": "x i D n - D' y -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACEGET`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTIREPLACEGETREF",
    "alias_of": "",
    "tlb": "#F42D",
    "doc_category": "dict_set",
    "doc_opcode": "F42D",
    "doc_fift": "DICTIREPLACEGETREF",
    "doc_stack": "c i D n - D' c' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACEGETREF`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTUREPLACEGET",
    "alias_of": "",
    "tlb": "#F42E",
    "doc_category": "dict_set",
    "doc_opcode": "F42E",
    "doc_fift": "DICTUREPLACEGET",
    "doc_stack": "x i D n - D' y -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACEGET`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTUREPLACEGETREF",
    "alias_of": "",
    "tlb": "#F42F",
    "doc_category": "dict_set",
    "doc_opcode": "F42F",
    "doc_fift": "DICTUREPLACEGETREF",
    "doc_stack": "c i D n - D' c' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTREPLACEGETREF`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTADD",
    "alias_of": "",
    "tlb": "#F432",
    "doc_category": "dict_set",
    "doc_opcode": "F432",
    "doc_fift": "DICTADD",
    "doc_stack": "x k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "An _Add_ counterpart of `DICTSET`: sets the value associated with key `k` in dictionary `D` to `x`, but only if it is not already present in `D`."
  },
  {
    "name": "DICTADDREF",
    "alias_of": "",
    "tlb": "#F433",
    "doc_category": "dict_set",
    "doc_opcode": "F433",
    "doc_fift": "DICTADDREF",
    "doc_stack": "c k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "An _Add_ counterpart of `DICTSETREF`."
  },
  {
    "name": "DICTIADD",
    "alias_of": "",
    "tlb": "#F434",
    "doc_category": "dict_set",
    "doc_opcode": "F434",
    "doc_fift": "DICTIADD",
    "doc_stack": "x i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTADD`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTIADDREF",
    "alias_of": "",
    "tlb": "#F435",
    "doc_category": "dict_set",
    "doc_opcode": "F435",
    "doc_fift": "DICTIADDREF",
    "doc_stack": "c i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTADDREF`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTUADD",
    "alias_of": "",
    "tlb": "#F436",
    "doc_category": "dict_set",
    "doc_opcode": "F436",
    "doc_fift": "DICTUADD",
    "doc_stack": "x i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTADD`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTUADDREF",
    "alias_of": "",
    "tlb": "#F437",
    "doc_category": "dict_set",
    "doc_opcode": "F437",
    "doc_fift": "DICTUADDREF",
    "doc_stack": "c i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTADDREF`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTADDGET",
    "alias_of": "",
    "tlb": "#F43A",
    "doc_category": "dict_set",
    "doc_opcode": "F43A",
    "doc_fift": "DICTADDGET",
    "doc_stack": "x k D n - D' -1 or D y 0",
    "doc_gas": "",
    "doc_description": "An _Add_ counterpart of `DICTSETGET`: sets the value associated with key `k` in dictionary `D` to `x`, but only if key `k` is not already present in `D`. Otherwise, just returns the old value `y` without changing the dictionary."
  },
  {
    "name": "DICTADDGETREF",
    "alias_of": "",
    "tlb": "#F43B",
    "doc_category": "dict_set",
    "doc_opcode": "F43B",
    "doc_fift": "DICTADDGETREF",
    "doc_stack": "c k D n - D' -1 or D c' 0",
    "doc_gas": "",
    "doc_description": "An _Add_ counterpart of `DICTSETGETREF`."
  },
  {
    "name": "DICTIADDGET",
    "alias_of": "",
    "tlb": "#F43C",
    "doc_category": "dict_set",
    "doc_opcode": "F43C",
    "doc_fift": "DICTIADDGET",
    "doc_stack": "x i D n - D' -1 or D y 0",
    "doc_gas": "",
    "doc_description": "`DICTADDGET`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTIADDGETREF",
    "alias_of": "",
    "tlb": "#F43D",
    "doc_category": "dict_set",
    "doc_opcode": "F43D",
    "doc_fift": "DICTIADDGETREF",
    "doc_stack": "c i D n - D' -1 or D c' 0",
    "doc_gas": "",
    "doc_description": "`DICTADDGETREF`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTUADDGET",
    "alias_of": "",
    "tlb": "#F43E",
    "doc_category": "dict_set",
    "doc_opcode": "F43E",
    "doc_fift": "DICTUADDGET",
    "doc_stack": "x i D n - D' -1 or D y 0",
    "doc_gas": "",
    "doc_description": "`DICTADDGET`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTUADDGETREF",
    "alias_of": "",
    "tlb": "#F43F",
    "doc_category": "dict_set",
    "doc_opcode": "F43F",
    "doc_fift": "DICTUADDGETREF",
    "doc_stack": "c i D n - D' -1 or D c' 0",
    "doc_gas": "",
    "doc_description": "`DICTADDGETREF`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTSETB",
    "alias_of": "",
    "tlb": "#F441",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F441",
    "doc_fift": "DICTSETB",
    "doc_stack": "b k D n - D'",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTISETB",
    "alias_of": "",
    "tlb": "#F442",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F442",
    "doc_fift": "DICTISETB",
    "doc_stack": "b i D n - D'",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTUSETB",
    "alias_of": "",
    "tlb": "#F443",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F443",
    "doc_fift": "DICTUSETB",
    "doc_stack": "b i D n - D'",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTSETGETB",
    "alias_of": "",
    "tlb": "#F445",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F445",
    "doc_fift": "DICTSETGETB",
    "doc_stack": "b k D n - D' y -1 or D' 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTISETGETB",
    "alias_of": "",
    "tlb": "#F446",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F446",
    "doc_fift": "DICTISETGETB",
    "doc_stack": "b i D n - D' y -1 or D' 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTUSETGETB",
    "alias_of": "",
    "tlb": "#F447",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F447",
    "doc_fift": "DICTUSETGETB",
    "doc_stack": "b i D n - D' y -1 or D' 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTREPLACEB",
    "alias_of": "",
    "tlb": "#F449",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F449",
    "doc_fift": "DICTREPLACEB",
    "doc_stack": "b k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTIREPLACEB",
    "alias_of": "",
    "tlb": "#F44A",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F44A",
    "doc_fift": "DICTIREPLACEB",
    "doc_stack": "b i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTUREPLACEB",
    "alias_of": "",
    "tlb": "#F44B",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F44B",
    "doc_fift": "DICTUREPLACEB",
    "doc_stack": "b i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTREPLACEGETB",
    "alias_of": "",
    "tlb": "#F44D",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F44D",
    "doc_fift": "DICTREPLACEGETB",
    "doc_stack": "b k D n - D' y -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTIREPLACEGETB",
    "alias_of": "",
    "tlb": "#F44E",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F44E",
    "doc_fift": "DICTIREPLACEGETB",
    "doc_stack": "b i D n - D' y -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTUREPLACEGETB",
    "alias_of": "",
    "tlb": "#F44F",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F44F",
    "doc_fift": "DICTUREPLACEGETB",
    "doc_stack": "b i D n - D' y -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTADDB",
    "alias_of": "",
    "tlb": "#F451",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F451",
    "doc_fift": "DICTADDB",
    "doc_stack": "b k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTIADDB",
    "alias_of": "",
    "tlb": "#F452",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F452",
    "doc_fift": "DICTIADDB",
    "doc_stack": "b i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTUADDB",
    "alias_of": "",
    "tlb": "#F453",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F453",
    "doc_fift": "DICTUADDB",
    "doc_stack": "b i D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTADDGETB",
    "alias_of": "",
    "tlb": "#F455",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F455",
    "doc_fift": "DICTADDGETB",
    "doc_stack": "b k D n - D' -1 or D y 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTIADDGETB",
    "alias_of": "",
    "tlb": "#F456",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F456",
    "doc_fift": "DICTIADDGETB",
    "doc_stack": "b i D n - D' -1 or D y 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTUADDGETB",
    "alias_of": "",
    "tlb": "#F457",
    "doc_category": "dict_set_builder",
    "doc_opcode": "F457",
    "doc_fift": "DICTUADDGETB",
    "doc_stack": "b i D n - D' -1 or D y 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTDEL",
    "alias_of": "",
    "tlb": "#F459",
    "doc_category": "dict_delete",
    "doc_opcode": "F459",
    "doc_fift": "DICTDEL",
    "doc_stack": "k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": "Deletes `n`-bit key, represented by a _Slice_ `k`, from dictionary `D`. If the key is present, returns the modified dictionary `D'` and the success flag `-1`. Otherwise, returns the original dictionary `D` and `0`."
  },
  {
    "name": "DICTIDEL",
    "alias_of": "",
    "tlb": "#F45A",
    "doc_category": "dict_delete",
    "doc_opcode": "F45A",
    "doc_fift": "DICTIDEL",
    "doc_stack": "i D n - D' ?",
    "doc_gas": "",
    "doc_description": "A version of `DICTDEL` with the key represented by a signed `n`-bit _Integer_ `i`. If `i` does not fit into `n` bits, simply returns `D` `0` (“key not found, dictionary unmodified'')."
  },
  {
    "name": "DICTUDEL",
    "alias_of": "",
    "tlb": "#F45B",
    "doc_category": "dict_delete",
    "doc_opcode": "F45B",
    "doc_fift": "DICTUDEL",
    "doc_stack": "i D n - D' ?",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIDEL`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTDELGET",
    "alias_of": "",
    "tlb": "#F462",
    "doc_category": "dict_delete",
    "doc_opcode": "F462",
    "doc_fift": "DICTDELGET",
    "doc_stack": "k D n - D' x -1 or D 0",
    "doc_gas": "",
    "doc_description": "Deletes `n`-bit key, represented by a _Slice_ `k`, from dictionary `D`. If the key is present, returns the modified dictionary `D'`, the original value `x` associated with the key `k` (represented by a _Slice_), and the success flag `-1`. Otherwise, returns the original dictionary `D` and `0`."
  },
  {
    "name": "DICTDELGETREF",
    "alias_of": "",
    "tlb": "#F463",
    "doc_category": "dict_delete",
    "doc_opcode": "F463",
    "doc_fift": "DICTDELGETREF",
    "doc_stack": "k D n - D' c -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTDELGET`, but with `LDREF` `ENDS` applied to `x` on success, so that the value returned `c` is a _Cell_."
  },
  {
    "name": "DICTIDELGET",
    "alias_of": "",
    "tlb": "#F464",
    "doc_category": "dict_delete",
    "doc_opcode": "F464",
    "doc_fift": "DICTIDELGET",
    "doc_stack": "i D n - D' x -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTDELGET`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTIDELGETREF",
    "alias_of": "",
    "tlb": "#F465",
    "doc_category": "dict_delete",
    "doc_opcode": "F465",
    "doc_fift": "DICTIDELGETREF",
    "doc_stack": "i D n - D' c -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTDELGETREF`, but with `i` a signed `n`-bit integer."
  },
  {
    "name": "DICTUDELGET",
    "alias_of": "",
    "tlb": "#F466",
    "doc_category": "dict_delete",
    "doc_opcode": "F466",
    "doc_fift": "DICTUDELGET",
    "doc_stack": "i D n - D' x -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTDELGET`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTUDELGETREF",
    "alias_of": "",
    "tlb": "#F467",
    "doc_category": "dict_delete",
    "doc_opcode": "F467",
    "doc_fift": "DICTUDELGETREF",
    "doc_stack": "i D n - D' c -1 or D 0",
    "doc_gas": "",
    "doc_description": "`DICTDELGETREF`, but with `i` an unsigned `n`-bit integer."
  },
  {
    "name": "DICTGETOPTREF",
    "alias_of": "",
    "tlb": "#F469",
    "doc_category": "dict_mayberef",
    "doc_opcode": "F469",
    "doc_fift": "DICTGETOPTREF",
    "doc_stack": "k D n - c^?",
    "doc_gas": "",
    "doc_description": "A variant of `DICTGETREF` that returns _Null_ instead of the value `c^?` if the key `k` is absent from dictionary `D`."
  },
  {
    "name": "DICTIGETOPTREF",
    "alias_of": "",
    "tlb": "#F46A",
    "doc_category": "dict_mayberef",
    "doc_opcode": "F46A",
    "doc_fift": "DICTIGETOPTREF",
    "doc_stack": "i D n - c^?",
    "doc_gas": "",
    "doc_description": "`DICTGETOPTREF`, but with `i` a signed `n`-bit integer. If the key `i` is out of range, also returns _Null_."
  },
  {
    "name": "DICTUGETOPTREF",
    "alias_of": "",
    "tlb": "#F46B",
    "doc_category": "dict_mayberef",
    "doc_opcode": "F46B",
    "doc_fift": "DICTUGETOPTREF",
    "doc_stack": "i D n - c^?",
    "doc_gas": "",
    "doc_description": "`DICTGETOPTREF`, but with `i` an unsigned `n`-bit integer. If the key `i` is out of range, also returns _Null_."
  },
  {
    "name": "DICTSETGETOPTREF",
    "alias_of": "",
    "tlb": "#F46D",
    "doc_category": "dict_mayberef",
    "doc_opcode": "F46D",
    "doc_fift": "DICTSETGETOPTREF",
    "doc_stack": "c^? k D n - D' ~c^?",
    "doc_gas": "",
    "doc_description": "A variant of both `DICTGETOPTREF` and `DICTSETGETREF` that sets the value corresponding to key `k` in dictionary `D` to `c^?` (if `c^?` is _Null_, then the key is deleted instead), and returns the old value `~c^?` (if the key `k` was absent before, returns _Null_ instead)."
  },
  {
    "name": "DICTISETGETOPTREF",
    "alias_of": "",
    "tlb": "#F46E",
    "doc_category": "dict_mayberef",
    "doc_opcode": "F46E",
    "doc_fift": "DICTISETGETOPTREF",
    "doc_stack": "c^? i D n - D' ~c^?",
    "doc_gas": "",
    "doc_description": "Similar to primitive `DICTSETGETOPTREF`, but using signed `n`-bit _Integer_ `i` as a key. If `i` does not fit into `n` bits, throws a range checking exception."
  },
  {
    "name": "DICTUSETGETOPTREF",
    "alias_of": "",
    "tlb": "#F46F",
    "doc_category": "dict_mayberef",
    "doc_opcode": "F46F",
    "doc_fift": "DICTUSETGETOPTREF",
    "doc_stack": "c^? i D n - D' ~c^?",
    "doc_gas": "",
    "doc_description": "Similar to primitive `DICTSETGETOPTREF`, but using unsigned `n`-bit _Integer_ `i` as a key."
  },
  {
    "name": "PFXDICTSET",
    "alias_of": "",
    "tlb": "#F470",
    "doc_category": "dict_prefix",
    "doc_opcode": "F470",
    "doc_fift": "PFXDICTSET",
    "doc_stack": "x k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "PFXDICTREPLACE",
    "alias_of": "",
    "tlb": "#F471",
    "doc_category": "dict_prefix",
    "doc_opcode": "F471",
    "doc_fift": "PFXDICTREPLACE",
    "doc_stack": "x k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "PFXDICTADD",
    "alias_of": "",
    "tlb": "#F472",
    "doc_category": "dict_prefix",
    "doc_opcode": "F472",
    "doc_fift": "PFXDICTADD",
    "doc_stack": "x k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "PFXDICTDEL",
    "alias_of": "",
    "tlb": "#F473",
    "doc_category": "dict_prefix",
    "doc_opcode": "F473",
    "doc_fift": "PFXDICTDEL",
    "doc_stack": "k D n - D' -1 or D 0",
    "doc_gas": "",
    "doc_description": ""
  },
  {
    "name": "DICTGETNEXT",
    "alias_of": "",
    "tlb": "#F474",
    "doc_category": "dict_next",
    "doc_opcode": "F474",
    "doc_fift": "DICTGETNEXT",
    "doc_stack": "k D n - x' k' -1 or 0",
    "doc_gas": "",
    "doc_description": "Computes the minimal key `k'` in dictionary `D` that is lexicographically greater than `k`, and returns `k'` (represented by a _Slice_) along with associated value `x'` (also represented by a _Slice_)."
  },
  {
    "name": "DICTGETNEXTEQ",
    "alias_of": "",
    "tlb": "#F475",
    "doc_category": "dict_next",
    "doc_opcode": "F475",
    "doc_fift": "DICTGETNEXTEQ",
    "doc_stack": "k D n - x' k' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETNEXT`, but computes the minimal key `k'` that is lexicographically greater than or equal to `k`."
  },
  {
    "name": "DICTGETPREV",
    "alias_of": "",
    "tlb": "#F476",
    "doc_category": "dict_next",
    "doc_opcode": "F476",
    "doc_fift": "DICTGETPREV",
    "doc_stack": "k D n - x' k' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETNEXT`, but computes the maximal key `k'` lexicographically smaller than `k`."
  },
  {
    "name": "DICTGETPREVEQ",
    "alias_of": "",
    "tlb": "#F477",
    "doc_category": "dict_next",
    "doc_opcode": "F477",
    "doc_fift": "DICTGETPREVEQ",
    "doc_stack": "k D n - x' k' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETPREV`, but computes the maximal key `k'` lexicographically smaller than or equal to `k`."
  },
  {
    "name": "DICTIGETNEXT",
    "alias_of": "",
    "tlb": "#F478",
    "doc_category": "dict_next",
    "doc_opcode": "F478",
    "doc_fift": "DICTIGETNEXT",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETNEXT`, but interprets all keys in dictionary `D` as big-endian signed `n`-bit integers, and computes the minimal key `i'` that is larger than _Integer_ `i` (which does not necessarily fit into `n` bits)."
  },
  {
    "name": "DICTIGETNEXTEQ",
    "alias_of": "",
    "tlb": "#F479",
    "doc_category": "dict_next",
    "doc_opcode": "F479",
    "doc_fift": "DICTIGETNEXTEQ",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETNEXTEQ`, but interprets keys as signed `n`-bit integers."
  },
  {
    "name": "DICTIGETPREV",
    "alias_of": "",
    "tlb": "#F47A",
    "doc_category": "dict_next",
    "doc_opcode": "F47A",
    "doc_fift": "DICTIGETPREV",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETPREV`, but interprets keys as signed `n`-bit integers."
  },
  {
    "name": "DICTIGETPREVEQ",
    "alias_of": "",
    "tlb": "#F47B",
    "doc_category": "dict_next",
    "doc_opcode": "F47B",
    "doc_fift": "DICTIGETPREVEQ",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETPREVEQ`, but interprets keys as signed `n`-bit integers."
  },
  {
    "name": "DICTUGETNEXT",
    "alias_of": "",
    "tlb": "#F47C",
    "doc_category": "dict_next",
    "doc_opcode": "F47C",
    "doc_fift": "DICTUGETNEXT",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETNEXT`, but interprets all keys in dictionary `D` as big-endian unsigned `n`-bit integers, and computes the minimal key `i'` that is larger than _Integer_ `i` (which does not necessarily fit into `n` bits, and is not necessarily non-negative)."
  },
  {
    "name": "DICTUGETNEXTEQ",
    "alias_of": "",
    "tlb": "#F47D",
    "doc_category": "dict_next",
    "doc_opcode": "F47D",
    "doc_fift": "DICTUGETNEXTEQ",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETNEXTEQ`, but interprets keys as unsigned `n`-bit integers."
  },
  {
    "name": "DICTUGETPREV",
    "alias_of": "",
    "tlb": "#F47E",
    "doc_category": "dict_next",
    "doc_opcode": "F47E",
    "doc_fift": "DICTUGETPREV",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETPREV`, but interprets keys as unsigned `n`-bit integers."
  },
  {
    "name": "DICTUGETPREVEQ",
    "alias_of": "",
    "tlb": "#F47F",
    "doc_category": "dict_next",
    "doc_opcode": "F47F",
    "doc_fift": "DICTUGETPREVEQ",
    "doc_stack": "i D n - x' i' -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTGETPREVEQ`, but interprets keys a unsigned `n`-bit integers."
  },
  {
    "name": "DICTMIN",
    "alias_of": "",
    "tlb": "#F482",
    "doc_category": "dict_min",
    "doc_opcode": "F482",
    "doc_fift": "DICTMIN",
    "doc_stack": "D n - x k -1 or 0",
    "doc_gas": "",
    "doc_description": "Computes the minimal key `k` (represented by a _Slice_ with `n` data bits) in dictionary `D`, and returns `k` along with the associated value `x`."
  },
  {
    "name": "DICTMINREF",
    "alias_of": "",
    "tlb": "#F483",
    "doc_category": "dict_min",
    "doc_opcode": "F483",
    "doc_fift": "DICTMINREF",
    "doc_stack": "D n - c k -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTMIN`, but returns the only reference in the value as a _Cell_ `c`."
  },
  {
    "name": "DICTIMIN",
    "alias_of": "",
    "tlb": "#F484",
    "doc_category": "dict_min",
    "doc_opcode": "F484",
    "doc_fift": "DICTIMIN",
    "doc_stack": "D n - x i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTMIN`, but computes the minimal key `i` under the assumption that all keys are big-endian signed `n`-bit integers. Notice that the key and value returned may differ from those computed by `DICTMIN` and `DICTUMIN`."
  },
  {
    "name": "DICTIMINREF",
    "alias_of": "",
    "tlb": "#F485",
    "doc_category": "dict_min",
    "doc_opcode": "F485",
    "doc_fift": "DICTIMINREF",
    "doc_stack": "D n - c i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIMIN`, but returns the only reference in the value."
  },
  {
    "name": "DICTUMIN",
    "alias_of": "",
    "tlb": "#F486",
    "doc_category": "dict_min",
    "doc_opcode": "F486",
    "doc_fift": "DICTUMIN",
    "doc_stack": "D n - x i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTMIN`, but returns the key as an unsigned `n`-bit _Integer_ `i`."
  },
  {
    "name": "DICTUMINREF",
    "alias_of": "",
    "tlb": "#F487",
    "doc_category": "dict_min",
    "doc_opcode": "F487",
    "doc_fift": "DICTUMINREF",
    "doc_stack": "D n - c i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTUMIN`, but returns the only reference in the value."
  },
  {
    "name": "DICTMAX",
    "alias_of": "",
    "tlb": "#F48A",
    "doc_category": "dict_min",
    "doc_opcode": "F48A",
    "doc_fift": "DICTMAX",
    "doc_stack": "D n - x k -1 or 0",
    "doc_gas": "",
    "doc_description": "Computes the maximal key `k` (represented by a _Slice_ with `n` data bits) in dictionary `D`, and returns `k` along with the associated value `x`."
  },
  {
    "name": "DICTMAXREF",
    "alias_of": "",
    "tlb": "#F48B",
    "doc_category": "dict_min",
    "doc_opcode": "F48B",
    "doc_fift": "DICTMAXREF",
    "doc_stack": "D n - c k -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTMAX`, but returns the only reference in the value."
  },
  {
    "name": "DICTIMAX",
    "alias_of": "",
    "tlb": "#F48C",
    "doc_category": "dict_min",
    "doc_opcode": "F48C",
    "doc_fift": "DICTIMAX",
    "doc_stack": "D n - x i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTMAX`, but computes the maximal key `i` under the assumption that all keys are big-endian signed `n`-bit integers. Notice that the key and value returned may differ from those computed by `DICTMAX` and `DICTUMAX`."
  },
  {
    "name": "DICTIMAXREF",
    "alias_of": "",
    "tlb": "#F48D",
    "doc_category": "dict_min",
    "doc_opcode": "F48D",
    "doc_fift": "DICTIMAXREF",
    "doc_stack": "D n - c i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIMAX`, but returns the only reference in the value."
  },
  {
    "name": "DICTUMAX",
    "alias_of": "",
    "tlb": "#F48E",
    "doc_category": "dict_min",
    "doc_opcode": "F48E",
    "doc_fift": "DICTUMAX",
    "doc_stack": "D n - x i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTMAX`, but returns the key as an unsigned `n`-bit _Integer_ `i`."
  },
  {
    "name": "DICTUMAXREF",
    "alias_of": "",
    "tlb": "#F48F",
    "doc_category": "dict_min",
    "doc_opcode": "F48F",
    "doc_fift": "DICTUMAXREF",
    "doc_stack": "D n - c i -1 or 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTUMAX`, but returns the only reference in the value."
  },
  {
    "name": "DICTREMMIN",
    "alias_of": "",
    "tlb": "#F492",
    "doc_category": "dict_min",
    "doc_opcode": "F492",
    "doc_fift": "DICTREMMIN",
    "doc_stack": "D n - D' x k -1 or D 0",
    "doc_gas": "",
    "doc_description": "Computes the minimal key `k` (represented by a _Slice_ with `n` data bits) in dictionary `D`, removes `k` from the dictionary, and returns `k` along with the associated value `x` and the modified dictionary `D'`."
  },
  {
    "name": "DICTREMMINREF",
    "alias_of": "",
    "tlb": "#F493",
    "doc_category": "dict_min",
    "doc_opcode": "F493",
    "doc_fift": "DICTREMMINREF",
    "doc_stack": "D n - D' c k -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTREMMIN`, but returns the only reference in the value as a _Cell_ `c`."
  },
  {
    "name": "DICTIREMMIN",
    "alias_of": "",
    "tlb": "#F494",
    "doc_category": "dict_min",
    "doc_opcode": "F494",
    "doc_fift": "DICTIREMMIN",
    "doc_stack": "D n - D' x i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTREMMIN`, but computes the minimal key `i` under the assumption that all keys are big-endian signed `n`-bit integers. Notice that the key and value returned may differ from those computed by `DICTREMMIN` and `DICTUREMMIN`."
  },
  {
    "name": "DICTIREMMINREF",
    "alias_of": "",
    "tlb": "#F495",
    "doc_category": "dict_min",
    "doc_opcode": "F495",
    "doc_fift": "DICTIREMMINREF",
    "doc_stack": "D n - D' c i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIREMMIN`, but returns the only reference in the value."
  },
  {
    "name": "DICTUREMMIN",
    "alias_of": "",
    "tlb": "#F496",
    "doc_category": "dict_min",
    "doc_opcode": "F496",
    "doc_fift": "DICTUREMMIN",
    "doc_stack": "D n - D' x i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTREMMIN`, but returns the key as an unsigned `n`-bit _Integer_ `i`."
  },
  {
    "name": "DICTUREMMINREF",
    "alias_of": "",
    "tlb": "#F497",
    "doc_category": "dict_min",
    "doc_opcode": "F497",
    "doc_fift": "DICTUREMMINREF",
    "doc_stack": "D n - D' c i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTUREMMIN`, but returns the only reference in the value."
  },
  {
    "name": "DICTREMMAX",
    "alias_of": "",
    "tlb": "#F49A",
    "doc_category": "dict_min",
    "doc_opcode": "F49A",
    "doc_fift": "DICTREMMAX",
    "doc_stack": "D n - D' x k -1 or D 0",
    "doc_gas": "",
    "doc_description": "Computes the maximal key `k` (represented by a _Slice_ with `n` data bits) in dictionary `D`, removes `k` from the dictionary, and returns `k` along with the associated value `x` and the modified dictionary `D'`."
  },
  {
    "name": "DICTREMMAXREF",
    "alias_of": "",
    "tlb": "#F49B",
    "doc_category": "dict_min",
    "doc_opcode": "F49B",
    "doc_fift": "DICTREMMAXREF",
    "doc_stack": "D n - D' c k -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTREMMAX`, but returns the only reference in the value as a _Cell_ `c`."
  },
  {
    "name": "DICTIREMMAX",
    "alias_of": "",
    "tlb": "#F49C",
    "doc_category": "dict_min",
    "doc_opcode": "F49C",
    "doc_fift": "DICTIREMMAX",
    "doc_stack": "D n - D' x i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTREMMAX`, but computes the minimal key `i` under the assumption that all keys are big-endian signed `n`-bit integers. Notice that the key and value returned may differ from those computed by `DICTREMMAX` and `DICTUREMMAX`."
  },
  {
    "name": "DICTIREMMAXREF",
    "alias_of": "",
    "tlb": "#F49D",
    "doc_category": "dict_min",
    "doc_opcode": "F49D",
    "doc_fift": "DICTIREMMAXREF",
    "doc_stack": "D n - D' c i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIREMMAX`, but returns the only reference in the value."
  },
  {
    "name": "DICTUREMMAX",
    "alias_of": "",
    "tlb": "#F49E",
    "doc_category": "dict_min",
    "doc_opcode": "F49E",
    "doc_fift": "DICTUREMMAX",
    "doc_stack": "D n - D' x i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTREMMAX`, but returns the key as an unsigned `n`-bit _Integer_ `i`."
  },
  {
    "name": "DICTUREMMAXREF",
    "alias_of": "",
    "tlb": "#F49F",
    "doc_category": "dict_min",
    "doc_opcode": "F49F",
    "doc_fift": "DICTUREMMAXREF",
    "doc_stack": "D n - D' c i -1 or D 0",
    "doc_gas": "",
    "doc_description": "Similar to `DICTUREMMAX`, but returns the only reference in the value."
  },
  {
    "name": "DICTIGETJMP",
    "alias_of": "",
    "tlb": "#F4A0",
    "doc_category": "dict_special",
    "doc_opcode": "F4A0",
    "doc_fift": "DICTIGETJMP",
    "doc_stack": "i D n -",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIGET`, but with `x` `BLESS`ed into a continuation with a subsequent `JMPX` to it on success. On failure, does nothing. This is useful for implementing `switch`/`case` constructions."
  },
  {
    "name": "DICTUGETJMP",
    "alias_of": "",
    "tlb": "#F4A1",
    "doc_category": "dict_special",
    "doc_opcode": "F4A1",
    "doc_fift": "DICTUGETJMP",
    "doc_stack": "i D n -",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIGETJMP`, but performs `DICTUGET` instead of `DICTIGET`."
  },
  {
    "name": "DICTIGETEXEC",
    "alias_of": "",
    "tlb": "#F4A2",
    "doc_category": "dict_special",
    "doc_opcode": "F4A2",
    "doc_fift": "DICTIGETEXEC",
    "doc_stack": "i D n -",
    "doc_gas": "",
    "doc_description": "Similar to `DICTIGETJMP`, but with `EXECUTE` instead of `JMPX`."
  },
  {
    "name": "DICTUGETEXEC",
    "alias_of": "",
    "tlb": "#F4A3",
    "doc_category": "dict_special",
    "doc_opcode": "F4A3",
    "doc_fift": "DICTUGETEXEC",
    "doc_stack": "i D n -",
    "doc_gas": "",
    "doc_description": "Similar to `DICTUGETJMP`, but with `EXECUTE` instead of `JMPX`."
  },
  {
    "name": "DICTPUSHCONST",
    "alias_of": "",
    "tlb": "#F4A6_ d:^Cell n:uint10",
    "doc_category": "dict_special",
    "doc_opcode": "F4A6_n",
    "doc_fift": "[ref] [n] DICTPUSHCONST",
    "doc_stack": "- D n",
    "doc_gas": 34,
    "doc_description": "Pushes a non-empty constant dictionary `D` (as a `Cell^?`) along with its key length `0 <= n <= 1023`, stored as a part of the instruction. The dictionary itself is created from the first of remaining references of the current continuation. In this way, the complete `DICTPUSHCONST` instruction can be obtained by first serializing `xF4A4_`, then the non-empty dictionary itself (one `1` bit and a cell reference), and then the unsigned 10-bit integer `n` (as if by a `STU 10` instruction). An empty dictionary can be pushed by a `NEWDICT` primitive instead."
  },
  {
    "name": "PFXDICTGETQ",
    "alias_of": "",
    "tlb": "#F4A8",
    "doc_category": "dict_special",
    "doc_opcode": "F4A8",
    "doc_fift": "PFXDICTGETQ",
    "doc_stack": "s D n - s' x s'' -1 or s 0",
    "doc_gas": "",
    "doc_description": "Looks up the unique prefix of _Slice_ `s` present in the prefix code dictionary represented by `Cell^?` `D` and `0 <= n <= 1023`. If found, the prefix of `s` is returned as `s'`, and the corresponding value (also a _Slice_) as `x`. The remainder of `s` is returned as a _Slice_ `s''`. If no prefix of `s` is a key in prefix code dictionary `D`, returns the unchanged `s` and a zero flag to indicate failure."
  },
  {
    "name": "PFXDICTGET",
    "alias_of": "",
    "tlb": "#F4A9",
    "doc_category": "dict_special",
    "doc_opcode": "F4A9",
    "doc_fift": "PFXDICTGET",
    "doc_stack": "s D n - s' x s''",
    "doc_gas": "",
    "doc_description": "Similar to `PFXDICTGET`, but throws a cell deserialization failure exception on failure."
  },
  {
    "name": "PFXDICTGETJMP",
    "alias_of": "",
    "tlb": "#F4AA",
    "doc_category": "dict_special",
    "doc_opcode": "F4AA",
    "doc_fift": "PFXDICTGETJMP",
    "doc_stack": "s D n - s' s'' or s",
    "doc_gas": "",
    "doc_description": "Similar to `PFXDICTGETQ`, but on success `BLESS`es the value `x` into a _Continuation_ and transfers control to it as if by a `JMPX`. On failure, returns `s` unchanged and continues execution."
  },
  {
    "name": "PFXDICTGETEXEC",
    "alias_of": "",
    "tlb": "#F4AB",
    "doc_category": "dict_special",
    "doc_opcode": "F4AB",
    "doc_fift": "PFXDICTGETEXEC",
    "doc_stack": "s D n - s' s''",
    "doc_gas": "",
    "doc_description": "Similar to `PFXDICTGETJMP`, but `EXEC`utes the continuation found instead of jumping to it. On failure, throws a cell deserialization exception."
  },
  {
    "name": "PFXDICTCONSTGETJMP",
    "alias_of": "",
    "tlb": "#F4AE_ d:^Cell n:uint10",
    "doc_category": "dict_special",
    "doc_opcode": "F4AE_n",
    "doc_fift": "[ref] [n] PFXDICTCONSTGETJMP\n[ref] [n] PFXDICTSWITCH",
    "doc_stack": "s - s' s'' or s",
    "doc_gas": "",
    "doc_description": "Combines `[n] DICTPUSHCONST` for `0 <= n <= 1023` with `PFXDICTGETJMP`."
  },
  {
    "name": "DICTIGETJMPZ",
    "alias_of": "",
    "tlb": "#F4BC",
    "doc_category": "dict_special",
    "doc_opcode": "F4BC",
    "doc_fift": "DICTIGETJMPZ",
    "doc_stack": "i D n - i or nothing",
    "doc_gas": "",
    "doc_description": "A variant of `DICTIGETJMP` that returns index `i` on failure."
  },
  {
    "name": "DICTUGETJMPZ",
    "alias_of": "",
    "tlb": "#F4BD",
    "doc_category": "dict_special",
    "doc_opcode": "F4BD",
    "doc_fift": "DICTUGETJMPZ",
    "doc_stack": "i D n - i or nothing",
    "doc_gas": "",
    "doc_description": "A variant of `DICTUGETJMP` that returns index `i` on failure."
  },
  {
    "name": "DICTIGETEXECZ",
    "alias_of": "",
    "tlb": "#F4BE",
    "doc_category": "dict_special",
    "doc_opcode": "F4BE",
    "doc_fift": "DICTIGETEXECZ",
    "doc_stack": "i D n - i or nothing",
    "doc_gas": "",
    "doc_description": "A variant of `DICTIGETEXEC` that returns index `i` on failure."
  },
  {
    "name": "DICTUGETEXECZ",
    "alias_of": "",
    "tlb": "#F4BF",
    "doc_category": "dict_special",
    "doc_opcode": "F4BF",
    "doc_fift": "DICTUGETEXECZ",
    "doc_stack": "i D n - i or nothing",
    "doc_gas": "",
    "doc_description": "A variant of `DICTUGETEXEC` that returns index `i` on failure."
  },
  {
    "name": "SUBDICTGET",
    "alias_of": "",
    "tlb": "#F4B1",
    "doc_category": "dict_sub",
    "doc_opcode": "F4B1",
    "doc_fift": "SUBDICTGET",
    "doc_stack": "k l D n - D'",
    "doc_gas": "",
    "doc_description": "Constructs a subdictionary consisting of all keys beginning with prefix `k` (represented by a _Slice_, the first `0 <= l <= n <= 1023` data bits of which are used as a key) of length `l` in dictionary `D` of type `HashmapE(n,X)` with `n`-bit keys. On success, returns the new subdictionary of the same type `HashmapE(n,X)` as a _Slice_ `D'`."
  },
  {
    "name": "SUBDICTIGET",
    "alias_of": "",
    "tlb": "#F4B2",
    "doc_category": "dict_sub",
    "doc_opcode": "F4B2",
    "doc_fift": "SUBDICTIGET",
    "doc_stack": "x l D n - D'",
    "doc_gas": "",
    "doc_description": "Variant of `SUBDICTGET` with the prefix represented by a signed big-endian `l`-bit _Integer_ `x`, where necessarily `l <= 257`."
  },
  {
    "name": "SUBDICTUGET",
    "alias_of": "",
    "tlb": "#F4B3",
    "doc_category": "dict_sub",
    "doc_opcode": "F4B3",
    "doc_fift": "SUBDICTUGET",
    "doc_stack": "x l D n - D'",
    "doc_gas": "",
    "doc_description": "Variant of `SUBDICTGET` with the prefix represented by an unsigned big-endian `l`-bit _Integer_ `x`, where necessarily `l <= 256`."
  },
  {
    "name": "SUBDICTRPGET",
    "alias_of": "",
    "tlb": "#F4B5",
    "doc_category": "dict_sub",
    "doc_opcode": "F4B5",
    "doc_fift": "SUBDICTRPGET",
    "doc_stack": "k l D n - D'",
    "doc_gas": "",
    "doc_description": "Similar to `SUBDICTGET`, but removes the common prefix `k` from all keys of the new dictionary `D'`, which becomes of type `HashmapE(n-l,X)`."
  },
  {
    "name": "SUBDICTIRPGET",
    "alias_of": "",
    "tlb": "#F4B6",
    "doc_category": "dict_sub",
    "doc_opcode": "F4B6",
    "doc_fift": "SUBDICTIRPGET",
    "doc_stack": "x l D n - D'",
    "doc_gas": "",
    "doc_description": "Variant of `SUBDICTRPGET` with the prefix represented by a signed big-endian `l`-bit _Integer_ `x`, where necessarily `l <= 257`."
  },
  {
    "name": "SUBDICTURPGET",
    "alias_of": "",
    "tlb": "#F4B7",
    "doc_category": "dict_sub",
    "doc_opcode": "F4B7",
    "doc_fift": "SUBDICTURPGET",
    "doc_stack": "x l D n - D'",
    "doc_gas": "",
    "doc_description": "Variant of `SUBDICTRPGET` with the prefix represented by an unsigned big-endian `l`-bit _Integer_ `x`, where necessarily `l <= 256`."
  }
]



================================================
FILE: src/data/opcodes/exceptions.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/exceptions.json
================================================
[{
  "name": "THROW_SHORT",
  "alias_of": "",
  "tlb": "#F22_ n:uint6",
  "doc_category": "exceptions",
  "doc_opcode": "F22_n",
  "doc_fift": "[n] THROW",
  "doc_stack": "- 0 n",
  "doc_gas": 76,
  "doc_description": "Throws exception `0 <= n <= 63` with parameter zero.\nIn other words, it transfers control to the continuation in `c2`, pushing `0` and `n` into its stack, and discarding the old stack altogether."
},
  {
    "name": "THROWIF_SHORT",
    "alias_of": "",
    "tlb": "#F26_ n:uint6",
    "doc_category": "exceptions",
    "doc_opcode": "F26_n",
    "doc_fift": "[n] THROWIF",
    "doc_stack": "f -",
    "doc_gas": "26/76",
    "doc_description": "Throws exception `0 <= n <= 63` with  parameter zero only if integer `f!=0`."
  },
  {
    "name": "THROWIFNOT_SHORT",
    "alias_of": "",
    "tlb": "#F2A_ n:uint6",
    "doc_category": "exceptions",
    "doc_opcode": "F2A_n",
    "doc_fift": "[n] THROWIFNOT",
    "doc_stack": "f -",
    "doc_gas": "26/76",
    "doc_description": "Throws exception `0 <= n <= 63` with parameter zero only if integer `f=0`."
  },
  {
    "name": "THROW",
    "alias_of": "",
    "tlb": "#F2C4_ n:uint11",
    "doc_category": "exceptions",
    "doc_opcode": "F2C4_n",
    "doc_fift": "[n] THROW",
    "doc_stack": "- 0 nn",
    "doc_gas": 84,
    "doc_description": "For `0 <= n < 2^11`, an encoding of `[n] THROW` for larger values of `n`."
  },
  {
    "name": "THROWARG",
    "alias_of": "",
    "tlb": "#F2CC_ n:uint11",
    "doc_category": "exceptions",
    "doc_opcode": "F2CC_n",
    "doc_fift": "[n] THROWARG",
    "doc_stack": "x - x nn",
    "doc_gas": 84,
    "doc_description": "Throws exception `0 <= n <  2^11` with parameter `x`, by copying `x` and `n` into the stack of `c2` and transferring control to `c2`."
  },
  {
    "name": "THROWIF",
    "alias_of": "",
    "tlb": "#F2D4_ n:uint11",
    "doc_category": "exceptions",
    "doc_opcode": "F2D4_n",
    "doc_fift": "[n] THROWIF",
    "doc_stack": "f -",
    "doc_gas": "34/84",
    "doc_description": "For `0 <= n < 2^11`, an encoding of `[n] THROWIF` for larger values of `n`."
  },
  {
    "name": "THROWARGIF",
    "alias_of": "",
    "tlb": "#F2DC_ n:uint11",
    "doc_category": "exceptions",
    "doc_opcode": "F2DC_n",
    "doc_fift": "[n] THROWARGIF",
    "doc_stack": "x f -",
    "doc_gas": "34/84",
    "doc_description": "Throws exception `0 <= nn < 2^11` with parameter `x` only if integer `f!=0`."
  },
  {
    "name": "THROWIFNOT",
    "alias_of": "",
    "tlb": "#F2E4_ n:uint11",
    "doc_category": "exceptions",
    "doc_opcode": "F2E4_n",
    "doc_fift": "[n] THROWIFNOT",
    "doc_stack": "f -",
    "doc_gas": "34/84",
    "doc_description": "For `0 <= n < 2^11`, an encoding of `[n] THROWIFNOT` for larger values of `n`."
  },
  {
    "name": "THROWARGIFNOT",
    "alias_of": "",
    "tlb": "#F2EC_ n:uint11",
    "doc_category": "exceptions",
    "doc_opcode": "F2EC_n",
    "doc_fift": "[n] THROWARGIFNOT",
    "doc_stack": "x f -",
    "doc_gas": "34/84",
    "doc_description": "Throws exception `0 <= n < 2^11` with parameter `x` only if integer `f=0`."
  },
  {
    "name": "THROWANY",
    "alias_of": "",
    "tlb": "#F2F0",
    "doc_category": "exceptions",
    "doc_opcode": "F2F0",
    "doc_fift": "THROWANY",
    "doc_stack": "n - 0 n",
    "doc_gas": 76,
    "doc_description": "Throws exception `0 <= n < 2^16` with parameter zero.\nApproximately equivalent to `ZERO` `SWAP` `THROWARGANY`."
  },
  {
    "name": "THROWARGANY",
    "alias_of": "",
    "tlb": "#F2F1",
    "doc_category": "exceptions",
    "doc_opcode": "F2F1",
    "doc_fift": "THROWARGANY",
    "doc_stack": "x n - x n",
    "doc_gas": 76,
    "doc_description": "Throws exception `0 <= n < 2^16` with parameter `x`, transferring control to the continuation in `c2`.\nApproximately equivalent to `c2 PUSHCTR` `2 JMPXARGS`."
  },
  {
    "name": "THROWANYIF",
    "alias_of": "",
    "tlb": "#F2F2",
    "doc_category": "exceptions",
    "doc_opcode": "F2F2",
    "doc_fift": "THROWANYIF",
    "doc_stack": "n f -",
    "doc_gas": "26/76",
    "doc_description": "Throws exception `0 <= n < 2^16` with parameter zero only if `f!=0`."
  },
  {
    "name": "THROWARGANYIF",
    "alias_of": "",
    "tlb": "#F2F3",
    "doc_category": "exceptions",
    "doc_opcode": "F2F3",
    "doc_fift": "THROWARGANYIF",
    "doc_stack": "x n f -",
    "doc_gas": "26/76",
    "doc_description": "Throws exception `0 <= n<2^16` with parameter `x` only if `f!=0`."
  },
  {
    "name": "THROWANYIFNOT",
    "alias_of": "",
    "tlb": "#F2F4",
    "doc_category": "exceptions",
    "doc_opcode": "F2F4",
    "doc_fift": "THROWANYIFNOT",
    "doc_stack": "n f -",
    "doc_gas": "26/76",
    "doc_description": "Throws exception `0 <= n<2^16` with parameter zero only if `f=0`."
  },
  {
    "name": "THROWARGANYIFNOT",
    "alias_of": "",
    "tlb": "#F2F5",
    "doc_category": "exceptions",
    "doc_opcode": "F2F5",
    "doc_fift": "THROWARGANYIFNOT",
    "doc_stack": "x n f -",
    "doc_gas": "26/76",
    "doc_description": "Throws exception `0 <= n<2^16` with parameter `x` only if `f=0`."
  },
  {
    "name": "TRY",
    "alias_of": "",
    "tlb": "#F2FF",
    "doc_category": "exceptions",
    "doc_opcode": "F2FF",
    "doc_fift": "TRY",
    "doc_stack": "c c' -",
    "doc_gas": 26,
    "doc_description": "Sets `c2` to `c'`, first saving the old value of `c2` both into the savelist of `c'` and into the savelist of the current continuation, which is stored into `c.c0` and `c'.c0`. Then runs `c` similarly to `EXECUTE`. If `c` does not throw any exceptions, the original value of `c2` is automatically restored on return from `c`. If an exception occurs, the execution is transferred to `c'`, but the original value of `c2` is restored in the process, so that `c'` can re-throw the exception by `THROWANY` if it cannot handle it by itself."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "exceptions",
    "doc_opcode": "F2FF",
    "doc_fift": "TRY:<{ code1 }>CATCH<{ code2 }>",
    "doc_stack": "-",
    "doc_gas": "",
    "doc_description": "Equivalent to `<{ code1 }> CONT` `<{ code2 }> CONT` `TRY`."
  },
  {
    "name": "TRYARGS",
    "alias_of": "",
    "tlb": "#F3 p:uint4 r:uint4",
    "doc_category": "exceptions",
    "doc_opcode": "F3pr",
    "doc_fift": "[p] [r] TRYARGS",
    "doc_stack": "c c' -",
    "doc_gas": 26,
    "doc_description": "Similar to `TRY`, but with `[p] [r] CALLXARGS` internally used instead of `EXECUTE`.\nIn this way, all but the top `0 <= p <= 15` stack elements will be saved into current continuation's stack, and then restored upon return from either `c` or `c'`, with the top `0 <= r <= 15` values of the resulting stack of `c` or `c'` copied as return values."
  }
]



================================================
FILE: src/data/opcodes/index.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/index.ts
================================================
import opcodes from './opcodes.json';
import appSpecificOpcodes from './app_specific.json';
import arithmeticOpcodes from './arithmetic.json';
import cellManipulationOpcodes from './cell_manipulation.json';
import comparisonOpcodes from './comparison.json';
import constantOpcodes from './constant.json';
import continuationOpcodes from './continuation.json';
import dictionaryManipulationOpcodes from './dictionaries.json';
import exceptionOpcodes from './exceptions.json';
import miscellaneousOpcodes from './miscellaneous.json';
import stackManipulationOpcodes from './stack_manipulation.json';
import tupleOpcodes from './tuple.json';
import cp0 from '../../../3rd/tvm-spec/cp0.json';

type Opcode = {
  name: string;
  alias_of: string;
  tlb: string;
  doc_category: string;
  doc_opcode: string | number;
  doc_fift: string;
  doc_stack: string;
  doc_gas: number;
  doc_description: string;
}

export {
  opcodes,
  appSpecificOpcodes,
  arithmeticOpcodes,
  cellManipulationOpcodes,
  comparisonOpcodes,
  constantOpcodes,
  continuationOpcodes,
  dictionaryManipulationOpcodes,
  exceptionOpcodes,
  miscellaneousOpcodes,
  stackManipulationOpcodes,
  tupleOpcodes,
  Opcode,
  cp0
};



================================================
FILE: src/data/opcodes/miscellaneous.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/miscellaneous.json
================================================
[
  {
    "name": "DEBUG",
    "alias_of": "",
    "tlb": "#FE nn:(#<= 239)",
    "doc_category": "debug",
    "doc_opcode": "FEnn",
    "doc_fift": "{nn} DEBUG",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "`0 <= nn < 240`"
  },
  {
    "name": "DEBUGSTR",
    "alias_of": "",
    "tlb": "#FEF n:(## 4) ssss:((n * 8 + 8) * Bit)",
    "doc_category": "debug",
    "doc_opcode": "FEFnssss",
    "doc_fift": "{string} DEBUGSTR\n{string} {x} DEBUGSTRI",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "`0 <= n < 16`. Length of `ssss` is `n+1` bytes.\n`{string}` is a [string literal](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-29-string-literals).\n`DEBUGSTR`: `ssss` is the given string.\n`DEBUGSTRI`: `ssss` is one-byte integer `0 <= x <= 255` followed by the given string."
  },
  {
    "name": "DUMPSTK",
    "alias_of": "DEBUG",
    "tlb": "#FE00",
    "doc_category": "debug",
    "doc_opcode": "FE00",
    "doc_fift": "DUMPSTK",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Dumps the stack (at most the top 255 values) and shows the total stack depth."
  },
  {
    "name": "DUMP",
    "alias_of": "DEBUG",
    "tlb": "#FE2 i:uint4",
    "doc_category": "debug",
    "doc_opcode": "FE2i",
    "doc_fift": "s[i] DUMP",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Dumps `s[i]`."
  },
  {
    "name": "SETCP",
    "alias_of": "",
    "tlb": "#FF nn:(#<= 239)",
    "doc_category": "codepage",
    "doc_opcode": "FFnn",
    "doc_fift": "[nn] SETCP",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Selects TVM codepage `0 <= nn < 240`. If the codepage is not supported, throws an invalid opcode exception."
  },
  {
    "name": "SETCP0",
    "alias_of": "SETCP",
    "tlb": "#FF00",
    "doc_category": "codepage",
    "doc_opcode": "FF00",
    "doc_fift": "SETCP0",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Selects TVM (test) codepage zero as described in this document."
  },
  {
    "name": "SETCP_SPECIAL",
    "alias_of": "",
    "tlb": "#FFF z:(## 4) {1 <= z}",
    "doc_category": "codepage",
    "doc_opcode": "FFFz",
    "doc_fift": "[z-16] SETCP",
    "doc_stack": "-",
    "doc_gas": 26,
    "doc_description": "Selects TVM codepage `z-16` for `1 <= z <= 15`. Negative codepages `-13...-1` are reserved for restricted versions of TVM needed to validate runs of TVM in other codepages. Negative codepage `-14` is reserved for experimental codepages, not necessarily compatible between different TVM implementations, and should be disabled in the production versions of TVM."
  },
  {
    "name": "SETCPX",
    "alias_of": "",
    "tlb": "#FFF0",
    "doc_category": "codepage",
    "doc_opcode": "FFF0",
    "doc_fift": "SETCPX",
    "doc_stack": "c -",
    "doc_gas": 26,
    "doc_description": "Selects codepage `c` with `-2^15 <= c < 2^15` passed in the top of the stack."
  }
]



================================================
FILE: src/data/opcodes/opcodes.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/opcodes.json
================================================
[
  {
    "name": "NOP",
    "alias_of": "",
    "tlb": "#00",
    "doc_category": "stack_basic",
    "doc_opcode": "00",
    "doc_fift": "NOP",
    "doc_stack": "-",
    "doc_gas": 18,
    "doc_description": "Does nothing."
  },
  {
    "name": "SWAP",
    "alias_of": "XCHG_0I",
    "tlb": "#01",
    "doc_category": "stack_basic",
    "doc_opcode": "01",
    "doc_fift": "SWAP",
    "doc_stack": "x y - y x",
    "doc_gas": 18,
    "doc_description": "Same as `s1 XCHG0`."
  },
  {
    "name": "XCHG_0I",
    "alias_of": "",
    "tlb": "#0 i:(## 4) {1 <= i}",
    "doc_category": "stack_basic",
    "doc_opcode": "0i",
    "doc_fift": "s[i] XCHG0",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Interchanges `s0` with `s[i]`, `1 <= i <= 15`."
  },
  {
    "name": "XCHG_IJ",
    "alias_of": "",
    "tlb": "#10 i:(## 4) j:(## 4) {1 <= i} {i + 1 <= j}",
    "doc_category": "stack_basic",
    "doc_opcode": "10ij",
    "doc_fift": "s[i] s[j] XCHG",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Interchanges `s[i]` with `s[j]`, `1 <= i < j <= 15`."
  },
  {
    "name": "XCHG_0I_LONG",
    "alias_of": "",
    "tlb": "#11 ii:uint8",
    "doc_category": "stack_basic",
    "doc_opcode": "11ii",
    "doc_fift": "s0 [ii] s() XCHG",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Interchanges `s0` with `s[ii]`, `0 <= ii <= 255`."
  },
  {
    "name": "XCHG_1I",
    "alias_of": "",
    "tlb": "#1 i:(## 4) {2 <= i}",
    "doc_category": "stack_basic",
    "doc_opcode": "1i",
    "doc_fift": "s1 s[i] XCHG",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Interchanges `s1` with `s[i]`, `2 <= i <= 15`."
  },
  {
    "name": "PUSH",
    "alias_of": "",
    "tlb": "#2 i:uint4",
    "doc_category": "stack_basic",
    "doc_opcode": "2i",
    "doc_fift": "s[i] PUSH",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pushes a copy of the old `s[i]` into the stack."
  },
  {
    "name": "DUP",
    "alias_of": "PUSH",
    "tlb": "#20",
    "doc_category": "stack_basic",
    "doc_opcode": 20,
    "doc_fift": "DUP",
    "doc_stack": "x - x x",
    "doc_gas": 18,
    "doc_description": "Same as `s0 PUSH`."
  },
  {
    "name": "OVER",
    "alias_of": "PUSH",
    "tlb": "#21",
    "doc_category": "stack_basic",
    "doc_opcode": 21,
    "doc_fift": "OVER",
    "doc_stack": "x y - x y x",
    "doc_gas": 18,
    "doc_description": "Same as `s1 PUSH`."
  },
  {
    "name": "POP",
    "alias_of": "",
    "tlb": "#3 i:uint4",
    "doc_category": "stack_basic",
    "doc_opcode": "3i",
    "doc_fift": "s[i] POP",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops the old `s0` value into the old `s[i]`."
  },
  {
    "name": "DROP",
    "alias_of": "POP",
    "tlb": "#30",
    "doc_category": "stack_basic",
    "doc_opcode": 30,
    "doc_fift": "DROP",
    "doc_stack": "x -",
    "doc_gas": 18,
    "doc_description": "Same as `s0 POP`, discards the top-of-stack value."
  },
  {
    "name": "NIP",
    "alias_of": "POP",
    "tlb": "#31",
    "doc_category": "stack_basic",
    "doc_opcode": 31,
    "doc_fift": "NIP",
    "doc_stack": "x y - y",
    "doc_gas": 18,
    "doc_description": "Same as `s1 POP`."
  },
  {
    "name": "XCHG3",
    "alias_of": "",
    "tlb": "#4 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "4ijk",
    "doc_fift": "s[i] s[j] s[k] XCHG3",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s2 s[i] XCHG` `s1 s[j] XCHG` `s[k] XCHG0`."
  },
  {
    "name": "XCHG2",
    "alias_of": "",
    "tlb": "#50 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "50ij",
    "doc_fift": "s[i] s[j] XCHG2",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s1 s[i] XCHG` `s[j] XCHG0`."
  },
  {
    "name": "XCPU",
    "alias_of": "",
    "tlb": "#51 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "51ij",
    "doc_fift": "s[i] s[j] XCPU",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s[i] XCHG0` `s[j] PUSH`."
  },
  {
    "name": "PUXC",
    "alias_of": "",
    "tlb": "#52 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "52ij",
    "doc_fift": "s[i] s[j-1] PUXC",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s[i] PUSH` `SWAP` `s[j] XCHG0`."
  },
  {
    "name": "PUSH2",
    "alias_of": "",
    "tlb": "#53 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "53ij",
    "doc_fift": "s[i] s[j] PUSH2",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s[i] PUSH` `s[j+1] PUSH`."
  },
  {
    "name": "XCHG3_ALT",
    "alias_of": "",
    "tlb": "#540 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "540ijk",
    "doc_fift": "s[i] s[j] s[k] XCHG3_l",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Long form of `XCHG3`."
  },
  {
    "name": "XC2PU",
    "alias_of": "",
    "tlb": "#541 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "541ijk",
    "doc_fift": "s[i] s[j] s[k] XC2PU",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] s[j] XCHG2` `s[k] PUSH`."
  },
  {
    "name": "XCPUXC",
    "alias_of": "",
    "tlb": "#542 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "542ijk",
    "doc_fift": "s[i] s[j] s[k-1] XCPUXC",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s1 s[i] XCHG` `s[j] s[k-1] PUXC`."
  },
  {
    "name": "XCPU2",
    "alias_of": "",
    "tlb": "#543 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "543ijk",
    "doc_fift": "s[i] s[j] s[k] XCPU2",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] XCHG0` `s[j] s[k] PUSH2`."
  },
  {
    "name": "PUXC2",
    "alias_of": "",
    "tlb": "#544 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "544ijk",
    "doc_fift": "s[i] s[j-1] s[k-1] PUXC2",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] PUSH` `s2 XCHG0` `s[j] s[k] XCHG2`."
  },
  {
    "name": "PUXCPU",
    "alias_of": "",
    "tlb": "#545 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "545ijk",
    "doc_fift": "s[i] s[j-1] s[k-1] PUXCPU",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] s[j-1] PUXC` `s[k] PUSH`."
  },
  {
    "name": "PU2XC",
    "alias_of": "",
    "tlb": "#546 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "546ijk",
    "doc_fift": "s[i] s[j-1] s[k-2] PU2XC",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] PUSH` `SWAP` `s[j] s[k-1] PUXC`."
  },
  {
    "name": "PUSH3",
    "alias_of": "",
    "tlb": "#547 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "547ijk",
    "doc_fift": "s[i] s[j] s[k] PUSH3",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] PUSH` `s[j+1] s[k+1] PUSH2`."
  },
  {
    "name": "BLKSWAP",
    "alias_of": "",
    "tlb": "#55 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "55ij",
    "doc_fift": "[i+1] [j+1] BLKSWAP",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Permutes two blocks `s[j+i+1] … s[j+1]` and `s[j] … s0`.\n`0 <= i,j <= 15`\nEquivalent to `[i+1] [j+1] REVERSE` `[j+1] 0 REVERSE` `[i+j+2] 0 REVERSE`."
  },
  {
    "name": "ROT2",
    "alias_of": "BLKSWAP",
    "tlb": "#5513",
    "doc_category": "stack_complex",
    "doc_opcode": 5513,
    "doc_fift": "ROT2\n2ROT",
    "doc_stack": "a b c d e f - c d e f a b",
    "doc_gas": 26,
    "doc_description": "Rotates the three topmost pairs of stack entries."
  },
  {
    "name": "ROLL",
    "alias_of": "BLKSWAP",
    "tlb": "#550 i:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "550i",
    "doc_fift": "[i+1] ROLL",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Rotates the top `i+1` stack entries.\nEquivalent to `1 [i+1] BLKSWAP`."
  },
  {
    "name": "ROLLREV",
    "alias_of": "BLKSWAP",
    "tlb": "#55 i:uint4 zero:(## 4) {zero = 0}",
    "doc_category": "stack_complex",
    "doc_opcode": "55i0",
    "doc_fift": "[i+1] -ROLL\n[i+1] ROLLREV",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Rotates the top `i+1` stack entries in the other direction.\nEquivalent to `[i+1] 1 BLKSWAP`."
  },
  {
    "name": "PUSH_LONG",
    "alias_of": "",
    "tlb": "#56 ii:uint8",
    "doc_category": "stack_complex",
    "doc_opcode": "56ii",
    "doc_fift": "[ii] s() PUSH",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Pushes a copy of the old `s[ii]` into the stack.\n`0 <= ii <= 255`"
  },
  {
    "name": "POP_LONG",
    "alias_of": "",
    "tlb": "#57 ii:uint8",
    "doc_category": "stack_complex",
    "doc_opcode": "57ii",
    "doc_fift": "[ii] s() POP",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Pops the old `s0` value into the old `s[ii]`.\n`0 <= ii <= 255`"
  },
  {
    "name": "ROT",
    "alias_of": "",
    "tlb": "#58",
    "doc_category": "stack_complex",
    "doc_opcode": 58,
    "doc_fift": "ROT",
    "doc_stack": "a b c - b c a",
    "doc_gas": 18,
    "doc_description": "Equivalent to `1 2 BLKSWAP` or to `s2 s1 XCHG2`."
  },
  {
    "name": "ROTREV",
    "alias_of": "",
    "tlb": "#59",
    "doc_category": "stack_complex",
    "doc_opcode": 59,
    "doc_fift": "ROTREV\n-ROT",
    "doc_stack": "a b c - c a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `2 1 BLKSWAP` or to `s2 s2 XCHG2`."
  },
  {
    "name": "SWAP2",
    "alias_of": "",
    "tlb": "#5A",
    "doc_category": "stack_complex",
    "doc_opcode": "5A",
    "doc_fift": "SWAP2\n2SWAP",
    "doc_stack": "a b c d - c d a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `2 2 BLKSWAP` or to `s3 s2 XCHG2`."
  },
  {
    "name": "DROP2",
    "alias_of": "",
    "tlb": "#5B",
    "doc_category": "stack_complex",
    "doc_opcode": "5B",
    "doc_fift": "DROP2\n2DROP",
    "doc_stack": "a b -",
    "doc_gas": 18,
    "doc_description": "Equivalent to `DROP` `DROP`."
  },
  {
    "name": "DUP2",
    "alias_of": "",
    "tlb": "#5C",
    "doc_category": "stack_complex",
    "doc_opcode": "5C",
    "doc_fift": "DUP2\n2DUP",
    "doc_stack": "a b - a b a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `s1 s0 PUSH2`."
  },
  {
    "name": "OVER2",
    "alias_of": "",
    "tlb": "#5D",
    "doc_category": "stack_complex",
    "doc_opcode": "5D",
    "doc_fift": "OVER2\n2OVER",
    "doc_stack": "a b c d - a b c d a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `s3 s2 PUSH2`."
  },
  {
    "name": "REVERSE",
    "alias_of": "",
    "tlb": "#5E i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "5Eij",
    "doc_fift": "[i+2] [j] REVERSE",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Reverses the order of `s[j+i+1] … s[j]`."
  },
  {
    "name": "BLKDROP",
    "alias_of": "",
    "tlb": "#5F0 i:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "5F0i",
    "doc_fift": "[i] BLKDROP",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `DROP` performed `i` times."
  },
  {
    "name": "BLKPUSH",
    "alias_of": "",
    "tlb": "#5F i:(## 4) j:uint4 {1 <= i}",
    "doc_category": "stack_complex",
    "doc_opcode": "5Fij",
    "doc_fift": "[i] [j] BLKPUSH",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `PUSH s(j)` performed `i` times.\n`1 <= i <= 15`, `0 <= j <= 15`."
  },
  {
    "name": "PICK",
    "alias_of": "",
    "tlb": "#60",
    "doc_category": "stack_complex",
    "doc_opcode": 60,
    "doc_fift": "PICK\nPUSHX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `s[i] PUSH`."
  },
  {
    "name": "ROLLX",
    "alias_of": "",
    "tlb": "#61",
    "doc_category": "stack_complex",
    "doc_opcode": 61,
    "doc_fift": "ROLLX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `1 [i] BLKSWAP`."
  },
  {
    "name": "-ROLLX",
    "alias_of": "",
    "tlb": "#62",
    "doc_category": "stack_complex",
    "doc_opcode": 62,
    "doc_fift": "-ROLLX\nROLLREVX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `[i] 1 BLKSWAP`."
  },
  {
    "name": "BLKSWX",
    "alias_of": "",
    "tlb": "#63",
    "doc_category": "stack_complex",
    "doc_opcode": 63,
    "doc_fift": "BLKSWX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integers `i`,`j` from the stack, then performs `[i] [j] BLKSWAP`."
  },
  {
    "name": "REVX",
    "alias_of": "",
    "tlb": "#64",
    "doc_category": "stack_complex",
    "doc_opcode": 64,
    "doc_fift": "REVX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integers `i`,`j` from the stack, then performs `[i] [j] REVERSE`."
  },
  {
    "name": "DROPX",
    "alias_of": "",
    "tlb": "#65",
    "doc_category": "stack_complex",
    "doc_opcode": 65,
    "doc_fift": "DROPX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `[i] BLKDROP`."
  },
  {
    "name": "TUCK",
    "alias_of": "",
    "tlb": "#66",
    "doc_category": "stack_complex",
    "doc_opcode": 66,
    "doc_fift": "TUCK",
    "doc_stack": "a b - b a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `SWAP` `OVER` or to `s1 s1 XCPU`."
  },
  {
    "name": "XCHGX",
    "alias_of": "",
    "tlb": "#67",
    "doc_category": "stack_complex",
    "doc_opcode": 67,
    "doc_fift": "XCHGX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `s[i] XCHG`."
  },
  {
    "name": "DEPTH",
    "alias_of": "",
    "tlb": "#68",
    "doc_category": "stack_complex",
    "doc_opcode": 68,
    "doc_fift": "DEPTH",
    "doc_stack": "- depth",
    "doc_gas": 18,
    "doc_description": "Pushes the current depth of the stack."
  },
  {
    "name": "CHKDEPTH",
    "alias_of": "",
    "tlb": "#69",
    "doc_category": "stack_complex",
    "doc_opcode": 69,
    "doc_fift": "CHKDEPTH",
    "doc_stack": "i -",
    "doc_gas": "18/58",
    "doc_description": "Pops integer `i` from the stack, then checks whether there are at least `i` elements, generating a stack underflow exception otherwise."
  },
  {
    "name": "ONLYTOPX",
    "alias_of": "",
    "tlb": "#6A",
    "doc_category": "stack_complex",
    "doc_opcode": "6A",
    "doc_fift": "ONLYTOPX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then removes all but the top `i` elements."
  },
  {
    "name": "ONLYX",
    "alias_of": "",
    "tlb": "#6B",
    "doc_category": "stack_complex",
    "doc_opcode": "6B",
    "doc_fift": "ONLYX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then leaves only the bottom `i` elements. Approximately equivalent to `DEPTH` `SWAP` `SUB` `DROPX`."
  },
  {
    "name": "BLKDROP2",
    "alias_of": "",
    "tlb": "#6C i:(## 4) j:uint4 {1 <= i}",
    "doc_category": "stack_complex",
    "doc_opcode": "6Cij",
    "doc_fift": "[i] [j] BLKDROP2",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Drops `i` stack elements under the top `j` elements.\n`1 <= i <= 15`, `0 <= j <= 15`\nEquivalent to `[i+j] 0 REVERSE` `[i] BLKDROP` `[j] 0 REVERSE`."
  },
  {
    "name": "NULL",
    "alias_of": "",
    "tlb": "#6D",
    "doc_category": "tuple",
    "doc_opcode": "6D",
    "doc_fift": "NULL\nPUSHNULL",
    "doc_stack": "- null",
    "doc_gas": 18,
    "doc_description": "Pushes the only value of type _Null_."
  },
  {
    "name": "ISNULL",
    "alias_of": "",
    "tlb": "#6E",
    "doc_category": "tuple",
    "doc_opcode": "6E",
    "doc_fift": "ISNULL",
    "doc_stack": "x - ?",
    "doc_gas": 18,
    "doc_description": "Checks whether `x` is a _Null_, and returns `-1` or `0` accordingly."
  },
  {
    "name": "TUPLE",
    "alias_of": "",
    "tlb": "#6F0 n:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F0n",
    "doc_fift": "[n] TUPLE",
    "doc_stack": "x_1 ... x_n - t",
    "doc_gas": "26+n",
    "doc_description": "Creates a new _Tuple_ `t=(x_1, … ,x_n)` containing `n` values `x_1`,..., `x_n`.\n`0 <= n <= 15`"
  },
  {
    "name": "NIL",
    "alias_of": "TUPLE",
    "tlb": "#6F00",
    "doc_category": "tuple",
    "doc_opcode": "6F00",
    "doc_fift": "NIL",
    "doc_stack": "- t",
    "doc_gas": 26,
    "doc_description": "Pushes the only _Tuple_ `t=()` of length zero."
  },
  {
    "name": "SINGLE",
    "alias_of": "TUPLE",
    "tlb": "#6F01",
    "doc_category": "tuple",
    "doc_opcode": "6F01",
    "doc_fift": "SINGLE",
    "doc_stack": "x - t",
    "doc_gas": 27,
    "doc_description": "Creates a singleton `t:=(x)`, i.e., a _Tuple_ of length one."
  },
  {
    "name": "PAIR",
    "alias_of": "TUPLE",
    "tlb": "#6F02",
    "doc_category": "tuple",
    "doc_opcode": "6F02",
    "doc_fift": "PAIR\nCONS",
    "doc_stack": "x y - t",
    "doc_gas": 28,
    "doc_description": "Creates pair `t:=(x,y)`."
  },
  {
    "name": "TRIPLE",
    "alias_of": "TUPLE",
    "tlb": "#6F03",
    "doc_category": "tuple",
    "doc_opcode": "6F03",
    "doc_fift": "TRIPLE",
    "doc_stack": "x y z - t",
    "doc_gas": 29,
    "doc_description": "Creates triple `t:=(x,y,z)`."
  },
  {
    "name": "INDEX",
    "alias_of": "",
    "tlb": "#6F1 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F1k",
    "doc_fift": "[k] INDEX",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the `k`-th element of a _Tuple_ `t`.\n`0 <= k <= 15`."
  },
  {
    "name": "FIRST",
    "alias_of": "INDEX",
    "tlb": "#6F10",
    "doc_category": "tuple",
    "doc_opcode": "6F10",
    "doc_fift": "FIRST\nCAR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the first element of a _Tuple_."
  },
  {
    "name": "SECOND",
    "alias_of": "INDEX",
    "tlb": "#6F11",
    "doc_category": "tuple",
    "doc_opcode": "6F11",
    "doc_fift": "SECOND\nCDR",
    "doc_stack": "t - y",
    "doc_gas": 26,
    "doc_description": "Returns the second element of a _Tuple_."
  },
  {
    "name": "THIRD",
    "alias_of": "INDEX",
    "tlb": "#6F12",
    "doc_category": "tuple",
    "doc_opcode": "6F12",
    "doc_fift": "THIRD",
    "doc_stack": "t - z",
    "doc_gas": 26,
    "doc_description": "Returns the third element of a _Tuple_."
  },
  {
    "name": "UNTUPLE",
    "alias_of": "",
    "tlb": "#6F2 n:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F2n",
    "doc_fift": "[n] UNTUPLE",
    "doc_stack": "t - x_1 ... x_n",
    "doc_gas": "26+n",
    "doc_description": "Unpacks a _Tuple_ `t=(x_1,...,x_n)` of length equal to `0 <= n <= 15`.\nIf `t` is not a _Tuple_, or if `|t| != n`, a type check exception is thrown."
  },
  {
    "name": "UNSINGLE",
    "alias_of": "UNTUPLE",
    "tlb": "#6F21",
    "doc_category": "tuple",
    "doc_opcode": "6F21",
    "doc_fift": "UNSINGLE",
    "doc_stack": "t - x",
    "doc_gas": 27,
    "doc_description": "Unpacks a singleton `t=(x)`."
  },
  {
    "name": "UNPAIR",
    "alias_of": "UNTUPLE",
    "tlb": "#6F22",
    "doc_category": "tuple",
    "doc_opcode": "6F22",
    "doc_fift": "UNPAIR\nUNCONS",
    "doc_stack": "t - x y",
    "doc_gas": 28,
    "doc_description": "Unpacks a pair `t=(x,y)`."
  },
  {
    "name": "UNTRIPLE",
    "alias_of": "UNTUPLE",
    "tlb": "#6F23",
    "doc_category": "tuple",
    "doc_opcode": "6F23",
    "doc_fift": "UNTRIPLE",
    "doc_stack": "t - x y z",
    "doc_gas": 29,
    "doc_description": "Unpacks a triple `t=(x,y,z)`."
  },
  {
    "name": "UNPACKFIRST",
    "alias_of": "",
    "tlb": "#6F3 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F3k",
    "doc_fift": "[k] UNPACKFIRST",
    "doc_stack": "t - x_1 ... x_k",
    "doc_gas": "26+k",
    "doc_description": "Unpacks first `0 <= k <= 15` elements of a _Tuple_ `t`.\nIf `|t|<k`, throws a type check exception."
  },
  {
    "name": "CHKTUPLE",
    "alias_of": "UNPACKFIRST",
    "tlb": "#6F30",
    "doc_category": "tuple",
    "doc_opcode": "6F30",
    "doc_fift": "CHKTUPLE",
    "doc_stack": "t -",
    "doc_gas": 26,
    "doc_description": "Checks whether `t` is a _Tuple_. If not, throws a type check exception."
  },
  {
    "name": "EXPLODE",
    "alias_of": "",
    "tlb": "#6F4 n:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F4n",
    "doc_fift": "[n] EXPLODE",
    "doc_stack": "t - x_1 ... x_m m",
    "doc_gas": "26+m",
    "doc_description": "Unpacks a _Tuple_ `t=(x_1,...,x_m)` and returns its length `m`, but only if `m <= n <= 15`. Otherwise throws a type check exception."
  },
  {
    "name": "SETINDEX",
    "alias_of": "",
    "tlb": "#6F5 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F5k",
    "doc_fift": "[k] SETINDEX",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Computes _Tuple_ `t'` that differs from `t` only at position `t'_{k+1}`, which is set to `x`.\n`0 <= k <= 15`\nIf `k >= |t|`, throws a range check exception."
  },
  {
    "name": "SETFIRST",
    "alias_of": "SETINDEX",
    "tlb": "#6F50",
    "doc_category": "tuple",
    "doc_opcode": "6F50",
    "doc_fift": "SETFIRST",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Sets the first component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETSECOND",
    "alias_of": "SETINDEX",
    "tlb": "#6F51",
    "doc_category": "tuple",
    "doc_opcode": "6F51",
    "doc_fift": "SETSECOND",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Sets the second component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETTHIRD",
    "alias_of": "SETINDEX",
    "tlb": "#6F52",
    "doc_category": "tuple",
    "doc_opcode": "6F52",
    "doc_fift": "SETTHIRD",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Sets the third component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "INDEXQ",
    "alias_of": "",
    "tlb": "#6F6 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F6k",
    "doc_fift": "[k] INDEXQ",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the `k`-th element of a _Tuple_ `t`, where `0 <= k <= 15`. In other words, returns `x_{k+1}` if `t=(x_1,...,x_n)`. If `k>=n`, or if `t` is _Null_, returns a _Null_ instead of `x`."
  },
  {
    "name": "FIRSTQ",
    "alias_of": "INDEXQ",
    "tlb": "#6F60",
    "doc_category": "tuple",
    "doc_opcode": "6F60",
    "doc_fift": "FIRSTQ\nCARQ",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the first element of a _Tuple_."
  },
  {
    "name": "SECONDQ",
    "alias_of": "INDEXQ",
    "tlb": "#6F61",
    "doc_category": "tuple",
    "doc_opcode": "6F61",
    "doc_fift": "SECONDQ\nCDRQ",
    "doc_stack": "t - y",
    "doc_gas": 26,
    "doc_description": "Returns the second element of a _Tuple_."
  },
  {
    "name": "THIRDQ",
    "alias_of": "INDEXQ",
    "tlb": "#6F62",
    "doc_category": "tuple",
    "doc_opcode": "6F62",
    "doc_fift": "THIRDQ",
    "doc_stack": "t - z",
    "doc_gas": 26,
    "doc_description": "Returns the third element of a _Tuple_."
  },
  {
    "name": "SETINDEXQ",
    "alias_of": "",
    "tlb": "#6F7 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F7k",
    "doc_fift": "[k] SETINDEXQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the `k`-th component of _Tuple_ `t` to `x`, where `0 <= k < 16`, and returns the resulting _Tuple_ `t'`.\nIf `|t| <= k`, first extends the original _Tuple_ to length `n’=k+1` by setting all new components to _Null_. If the original value of `t` is _Null_, treats it as an empty _Tuple_. If `t` is not _Null_ or _Tuple_, throws an exception. If `x` is _Null_ and either `|t| <= k` or `t` is _Null_, then always returns `t'=t` (and does not consume tuple creation gas)."
  },
  {
    "name": "SETFIRSTQ",
    "alias_of": "SETINDEXQ",
    "tlb": "#6F70",
    "doc_category": "tuple",
    "doc_opcode": "6F70",
    "doc_fift": "SETFIRSTQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the first component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETSECONDQ",
    "alias_of": "SETINDEXQ",
    "tlb": "#6F71",
    "doc_category": "tuple",
    "doc_opcode": "6F71",
    "doc_fift": "SETSECONDQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the second component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETTHIRDQ",
    "alias_of": "SETINDEXQ",
    "tlb": "#6F72",
    "doc_category": "tuple",
    "doc_opcode": "6F72",
    "doc_fift": "SETTHIRDQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the third component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "TUPLEVAR",
    "alias_of": "",
    "tlb": "#6F80",
    "doc_category": "tuple",
    "doc_opcode": "6F80",
    "doc_fift": "TUPLEVAR",
    "doc_stack": "x_1 ... x_n n - t",
    "doc_gas": "26+n",
    "doc_description": "Creates a new _Tuple_ `t` of length `n` similarly to `TUPLE`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "INDEXVAR",
    "alias_of": "",
    "tlb": "#6F81",
    "doc_category": "tuple",
    "doc_opcode": "6F81",
    "doc_fift": "INDEXVAR",
    "doc_stack": "t k - x",
    "doc_gas": 26,
    "doc_description": "Similar to `k INDEX`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "UNTUPLEVAR",
    "alias_of": "",
    "tlb": "#6F82",
    "doc_category": "tuple",
    "doc_opcode": "6F82",
    "doc_fift": "UNTUPLEVAR",
    "doc_stack": "t n - x_1 ... x_n",
    "doc_gas": "26+n",
    "doc_description": "Similar to `n UNTUPLE`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "UNPACKFIRSTVAR",
    "alias_of": "",
    "tlb": "#6F83",
    "doc_category": "tuple",
    "doc_opcode": "6F83",
    "doc_fift": "UNPACKFIRSTVAR",
    "doc_stack": "t n - x_1 ... x_n",
    "doc_gas": "26+n",
    "doc_description": "Similar to `n UNPACKFIRST`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "EXPLODEVAR",
    "alias_of": "",
    "tlb": "#6F84",
    "doc_category": "tuple",
    "doc_opcode": "6F84",
    "doc_fift": "EXPLODEVAR",
    "doc_stack": "t n - x_1 ... x_m m",
    "doc_gas": "26+m",
    "doc_description": "Similar to `n EXPLODE`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "SETINDEXVAR",
    "alias_of": "",
    "tlb": "#6F85",
    "doc_category": "tuple",
    "doc_opcode": "6F85",
    "doc_fift": "SETINDEXVAR",
    "doc_stack": "t x k - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Similar to `k SETINDEX`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "INDEXVARQ",
    "alias_of": "",
    "tlb": "#6F86",
    "doc_category": "tuple",
    "doc_opcode": "6F86",
    "doc_fift": "INDEXVARQ",
    "doc_stack": "t k - x",
    "doc_gas": 26,
    "doc_description": "Similar to `n INDEXQ`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "SETINDEXVARQ",
    "alias_of": "",
    "tlb": "#6F87",
    "doc_category": "tuple",
    "doc_opcode": "6F87",
    "doc_fift": "SETINDEXVARQ",
    "doc_stack": "t x k - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Similar to `k SETINDEXQ`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "TLEN",
    "alias_of": "",
    "tlb": "#6F88",
    "doc_category": "tuple",
    "doc_opcode": "6F88",
    "doc_fift": "TLEN",
    "doc_stack": "t - n",
    "doc_gas": 26,
    "doc_description": "Returns the length of a _Tuple_."
  },
  {
    "name": "QTLEN",
    "alias_of": "",
    "tlb": "#6F89",
    "doc_category": "tuple",
    "doc_opcode": "6F89",
    "doc_fift": "QTLEN",
    "doc_stack": "t - n or -1",
    "doc_gas": 26,
    "doc_description": "Similar to `TLEN`, but returns `-1` if `t` is not a _Tuple_."
  },
  {
    "name": "ISTUPLE",
    "alias_of": "",
    "tlb": "#6F8A",
    "doc_category": "tuple",
    "doc_opcode": "6F8A",
    "doc_fift": "ISTUPLE",
    "doc_stack": "t - ?",
    "doc_gas": 26,
    "doc_description": "Returns `-1` or `0` depending on whether `t` is a _Tuple_."
  },
  {
    "name": "LAST",
    "alias_of": "",
    "tlb": "#6F8B",
    "doc_category": "tuple",
    "doc_opcode": "6F8B",
    "doc_fift": "LAST",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the last element of a non-empty _Tuple_ `t`."
  },
  {
    "name": "TPUSH",
    "alias_of": "",
    "tlb": "#6F8C",
    "doc_category": "tuple",
    "doc_opcode": "6F8C",
    "doc_fift": "TPUSH\nCOMMA",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Appends a value `x` to a _Tuple_ `t=(x_1,...,x_n)`, but only if the resulting _Tuple_ `t'=(x_1,...,x_n,x)` is of length at most 255. Otherwise throws a type check exception."
  },
  {
    "name": "TPOP",
    "alias_of": "",
    "tlb": "#6F8D",
    "doc_category": "tuple",
    "doc_opcode": "6F8D",
    "doc_fift": "TPOP",
    "doc_stack": "t - t' x",
    "doc_gas": "26+|t’|",
    "doc_description": "Detaches the last element `x=x_n` from a non-empty _Tuple_ `t=(x_1,...,x_n)`, and returns both the resulting _Tuple_ `t'=(x_1,...,x_{n-1})` and the original last element `x`."
  },
  {
    "name": "NULLSWAPIF",
    "alias_of": "",
    "tlb": "#6FA0",
    "doc_category": "tuple",
    "doc_opcode": "6FA0",
    "doc_fift": "NULLSWAPIF",
    "doc_stack": "x - x or null x",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the topmost _Integer_ `x`, but only if `x!=0`."
  },
  {
    "name": "NULLSWAPIFNOT",
    "alias_of": "",
    "tlb": "#6FA1",
    "doc_category": "tuple",
    "doc_opcode": "6FA1",
    "doc_fift": "NULLSWAPIFNOT",
    "doc_stack": "x - x or null x",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the topmost _Integer_ `x`, but only if `x=0`. May be used for stack alignment after quiet primitives such as `PLDUXQ`."
  },
  {
    "name": "NULLROTRIF",
    "alias_of": "",
    "tlb": "#6FA2",
    "doc_category": "tuple",
    "doc_opcode": "6FA2",
    "doc_fift": "NULLROTRIF",
    "doc_stack": "x y - x y or null x y",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the second stack entry from the top, but only if the topmost _Integer_ `y` is non-zero."
  },
  {
    "name": "NULLROTRIFNOT",
    "alias_of": "",
    "tlb": "#6FA3",
    "doc_category": "tuple",
    "doc_opcode": "6FA3",
    "doc_fift": "NULLROTRIFNOT",
    "doc_stack": "x y - x y or null x y",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the second stack entry from the top, but only if the topmost _Integer_ `y` is zero. May be used for stack alignment after quiet primitives such as `LDUXQ`."
  },
  {
    "name": "NULLSWAPIF2",
    "alias_of": "",
    "tlb": "#6FA4",
    "doc_category": "tuple",
    "doc_opcode": "6FA4",
    "doc_fift": "NULLSWAPIF2",
    "doc_stack": "x - x or null null x",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the topmost _Integer_ `x`, but only if `x!=0`.\nEquivalent to `NULLSWAPIF` `NULLSWAPIF`."
  },
  {
    "name": "NULLSWAPIFNOT2",
    "alias_of": "",
    "tlb": "#6FA5",
    "doc_category": "tuple",
    "doc_opcode": "6FA5",
    "doc_fift": "NULLSWAPIFNOT2",
    "doc_stack": "x - x or null null x",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the topmost _Integer_ `x`, but only if `x=0`.\nEquivalent to `NULLSWAPIFNOT` `NULLSWAPIFNOT`."
  },
  {
    "name": "NULLROTRIF2",
    "alias_of": "",
    "tlb": "#6FA6",
    "doc_category": "tuple",
    "doc_opcode": "6FA6",
    "doc_fift": "NULLROTRIF2",
    "doc_stack": "x y - x y or null null x y",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the second stack entry from the top, but only if the topmost _Integer_ `y` is non-zero.\nEquivalent to `NULLROTRIF` `NULLROTRIF`."
  },
  {
    "name": "NULLROTRIFNOT2",
    "alias_of": "",
    "tlb": "#6FA7",
    "doc_category": "tuple",
    "doc_opcode": "6FA7",
    "doc_fift": "NULLROTRIFNOT2",
    "doc_stack": "x y - x y or null null x y",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the second stack entry from the top, but only if the topmost _Integer_ `y` is zero.\nEquivalent to `NULLROTRIFNOT` `NULLROTRIFNOT`."
  },
  {
    "name": "INDEX2",
    "alias_of": "",
    "tlb": "#6FB i:uint2 j:uint2",
    "doc_category": "tuple",
    "doc_opcode": "6FBij",
    "doc_fift": "[i] [j] INDEX2",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=(t_{i+1})_{j+1}` for `0 <= i,j <= 3`.\nEquivalent to `[i] INDEX` `[j] INDEX`."
  },
  {
    "name": "CADR",
    "alias_of": "INDEX2",
    "tlb": "#6FB4",
    "doc_category": "tuple",
    "doc_opcode": "6FB4",
    "doc_fift": "CADR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=(t_2)_1`."
  },
  {
    "name": "CDDR",
    "alias_of": "INDEX2",
    "tlb": "#6FB5",
    "doc_category": "tuple",
    "doc_opcode": "6FB5",
    "doc_fift": "CDDR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=(t_2)_2`."
  },
  {
    "name": "INDEX3",
    "alias_of": "",
    "tlb": "#6FE_ i:uint2 j:uint2 k:uint2",
    "doc_category": "tuple",
    "doc_opcode": "6FE_ijk",
    "doc_fift": "[i] [j] [k] INDEX3",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=t_{i+1}_{j+1}_{k+1}`.\n`0 <= i,j,k <= 3`\nEquivalent to `[i] [j] INDEX2` `[k] INDEX`."
  },
  {
    "name": "CADDR",
    "alias_of": "INDEX3",
    "tlb": "#6FD4",
    "doc_category": "tuple",
    "doc_opcode": "6FD4",
    "doc_fift": "CADDR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=t_2_2_1`."
  },
  {
    "name": "CDDDR",
    "alias_of": "INDEX3",
    "tlb": "#6FD5",
    "doc_category": "tuple",
    "doc_opcode": "6FD5",
    "doc_fift": "CDDDR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=t_2_2_2`."
  },
  {
    "name": "PUSHINT_4",
    "alias_of": "",
    "tlb": "#7 i:uint4",
    "doc_category": "const_int",
    "doc_opcode": "7i",
    "doc_fift": "[x] PUSHINT\n[x] INT",
    "doc_stack": "- x",
    "doc_gas": 18,
    "doc_description": "Pushes integer `x` into the stack. `-5 <= x <= 10`.\nHere `i` equals four lower-order bits of `x` (`i=x mod 16`)."
  },
  {
    "name": "ZERO",
    "alias_of": "PUSHINT_4",
    "tlb": "#70",
    "doc_category": "const_int",
    "doc_opcode": 70,
    "doc_fift": "ZERO\nFALSE",
    "doc_stack": "- 0",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "ONE",
    "alias_of": "PUSHINT_4",
    "tlb": "#71",
    "doc_category": "const_int",
    "doc_opcode": 71,
    "doc_fift": "ONE",
    "doc_stack": "- 1",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "TWO",
    "alias_of": "PUSHINT_4",
    "tlb": "#72",
    "doc_category": "const_int",
    "doc_opcode": 72,
    "doc_fift": "TWO",
    "doc_stack": "- 2",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "TEN",
    "alias_of": "PUSHINT_4",
    "tlb": "#7A",
    "doc_category": "const_int",
    "doc_opcode": "7A",
    "doc_fift": "TEN",
    "doc_stack": "- 10",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "TRUE",
    "alias_of": "PUSHINT_4",
    "tlb": "#7F",
    "doc_category": "const_int",
    "doc_opcode": "7F",
    "doc_fift": "TRUE",
    "doc_stack": "- -1",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "PUSHINT_8",
    "alias_of": "",
    "tlb": "#80 xx:int8",
    "doc_category": "const_int",
    "doc_opcode": "80xx",
    "doc_fift": "[xx] PUSHINT\n[xx] INT",
    "doc_stack": "- xx",
    "doc_gas": 26,
    "doc_description": "Pushes integer `xx`. `-128 <= xx <= 127`."
  },
  {
    "name": "PUSHINT_16",
    "alias_of": "",
    "tlb": "#81 xxxx:int16",
    "doc_category": "const_int",
    "doc_opcode": "81xxxx",
    "doc_fift": "[xxxx] PUSHINT\n[xxxx] INT",
    "doc_stack": "- xxxx",
    "doc_gas": 34,
    "doc_description": "Pushes integer `xxxx`. `-2^15 <= xx < 2^15`."
  },
  {
    "name": "PUSHINT_LONG",
    "alias_of": "",
    "tlb": "#82 l:(## 5) xxx:(int (8 * l + 19))",
    "doc_category": "const_int",
    "doc_opcode": "82lxxx",
    "doc_fift": "[xxx] PUSHINT\n[xxx] INT",
    "doc_stack": "- xxx",
    "doc_gas": 23,
    "doc_description": "Pushes integer `xxx`.\n_Details:_ 5-bit `0 <= l <= 30` determines the length `n=8l+19` of signed big-endian integer `xxx`.\nThe total length of this instruction is `l+4` bytes or `n+13=8l+32` bits."
  },
  {
    "name": "PUSHPOW2",
    "alias_of": "",
    "tlb": "#83 xx:uint8",
    "doc_category": "const_int",
    "doc_opcode": "83xx",
    "doc_fift": "[xx+1] PUSHPOW2",
    "doc_stack": "- 2^(xx+1)",
    "doc_gas": 26,
    "doc_description": "(Quietly) pushes `2^(xx+1)` for `0 <= xx <= 255`.\n`2^256` is a `NaN`."
  },
  {
    "name": "PUSHNAN",
    "alias_of": "PUSHPOW2",
    "tlb": "#83FF",
    "doc_category": "const_int",
    "doc_opcode": "83FF",
    "doc_fift": "PUSHNAN",
    "doc_stack": "- NaN",
    "doc_gas": 26,
    "doc_description": "Pushes a `NaN`."
  },
  {
    "name": "PUSHPOW2DEC",
    "alias_of": "",
    "tlb": "#84 xx:uint8",
    "doc_category": "const_int",
    "doc_opcode": "84xx",
    "doc_fift": "[xx+1] PUSHPOW2DEC",
    "doc_stack": "- 2^(xx+1)-1",
    "doc_gas": 26,
    "doc_description": "Pushes `2^(xx+1)-1` for `0 <= xx <= 255`."
  },
  {
    "name": "PUSHNEGPOW2",
    "alias_of": "",
    "tlb": "#85 xx:uint8",
    "doc_category": "const_int",
    "doc_opcode": "85xx",
    "doc_fift": "[xx+1] PUSHNEGPOW2",
    "doc_stack": "- -2^(xx+1)",
    "doc_gas": 26,
    "doc_description": "Pushes `-2^(xx+1)` for `0 <= xx <= 255`."
  },
  {
    "name": "PUSHREF",
    "alias_of": "",
    "tlb": "#88 c:^Cell",
    "doc_category": "const_data",
    "doc_opcode": 88,
    "doc_fift": "[ref] PUSHREF",
    "doc_stack": "- c",
    "doc_gas": 18,
    "doc_description": "Pushes the reference `ref` into the stack.\n_Details:_ Pushes the first reference of `cc.code` into the stack as a _Cell_ (and removes this reference from the current continuation)."
  },
  {
    "name": "PUSHREFSLICE",
    "alias_of": "",
    "tlb": "#89 c:^Cell",
    "doc_category": "const_data",
    "doc_opcode": 89,
    "doc_fift": "[ref] PUSHREFSLICE",
    "doc_stack": "- s",
    "doc_gas": "118/43",
    "doc_description": "Similar to `PUSHREF`, but converts the cell into a _Slice_."
  },
  {
    "name": "PUSHREFCONT",
    "alias_of": "",
    "tlb": "#8A c:^Cell",
    "doc_category": "const_data",
    "doc_opcode": "8A",
    "doc_fift": "[ref] PUSHREFCONT",
    "doc_stack": "- cont",
    "doc_gas": "118/43",
    "doc_description": "Similar to `PUSHREFSLICE`, but makes a simple ordinary _Continuation_ out of the cell."
  },
  {
    "name": "PUSHSLICE",
    "alias_of": "",
    "tlb": "#8B x:(## 4) sss:((8 * x + 4) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8Bxsss",
    "doc_fift": "[slice] PUSHSLICE\n[slice] SLICE",
    "doc_stack": "- s",
    "doc_gas": 22,
    "doc_description": "Pushes the slice `slice` into the stack.\n_Details:_ Pushes the (prefix) subslice of `cc.code` consisting of its first `8x+4` bits and no references (i.e., essentially a bitstring), where `0 <= x <= 15`.\nA completion tag is assumed, meaning that all trailing zeroes and the last binary one (if present) are removed from this bitstring.\nIf the original bitstring consists only of zeroes, an empty slice will be pushed."
  },
  {
    "name": "PUSHSLICE_REFS",
    "alias_of": "",
    "tlb": "#8C r:(## 2) xx:(## 5) c:((r + 1) * ^Cell) ssss:((8 * xx + 1) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8Crxxssss",
    "doc_fift": "[slice] PUSHSLICE\n[slice] SLICE",
    "doc_stack": "- s",
    "doc_gas": 25,
    "doc_description": "Pushes the slice `slice` into the stack.\n_Details:_ Pushes the (prefix) subslice of `cc.code` consisting of its first `1 <= r+1 <= 4` references and up to first `8xx+1` bits of data, with `0 <= xx <= 31`.\nA completion tag is also assumed."
  },
  {
    "name": "PUSHSLICE_LONG",
    "alias_of": "",
    "tlb": "#8D r:(#<= 4) xx:(## 7) c:(r * ^Cell) ssss:((8 * xx + 6) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8Drxxsssss",
    "doc_fift": "[slice] PUSHSLICE\n[slice] SLICE",
    "doc_stack": "- s",
    "doc_gas": 28,
    "doc_description": "Pushes the slice `slice` into the stack.\n_Details:_ Pushes the subslice of `cc.code` consisting of `0 <= r <= 4` references and up to `8xx+6` bits of data, with `0 <= xx <= 127`.\nA completion tag is assumed."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "const_data",
    "doc_opcode": "",
    "doc_fift": "x{} PUSHSLICE\nx{ABCD1234} PUSHSLICE\nb{01101} PUSHSLICE",
    "doc_stack": "- s",
    "doc_gas": "",
    "doc_description": "Examples of `PUSHSLICE`.\n`x{}` is an empty slice. `x{...}` is a hexadecimal literal. `b{...}` is a binary literal.\nMore on slice literals [here](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-51-slice-literals).\nNote that the assembler can replace `PUSHSLICE` with `PUSHREFSLICE` in certain situations (e.g. if there’s not enough space in the current continuation)."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "const_data",
    "doc_opcode": "",
    "doc_fift": "<b x{AB12} s, b> PUSHREF\n<b x{AB12} s, b> PUSHREFSLICE",
    "doc_stack": "- c/s",
    "doc_gas": "",
    "doc_description": "Examples of `PUSHREF` and `PUSHREFSLICE`.\nMore on building cells in fift [here](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md#user-content-52-builder-primitives)."
  },
  {
    "name": "PUSHCONT",
    "alias_of": "",
    "tlb": "#8F_ r:(## 2) xx:(## 7) c:(r * ^Cell) ssss:((8 * xx) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "8F_rxxcccc",
    "doc_fift": "[builder] PUSHCONT\n[builder] CONT",
    "doc_stack": "- c",
    "doc_gas": 26,
    "doc_description": "Pushes a continuation made from `builder`.\n_Details:_ Pushes the simple ordinary continuation `cccc` made from the first `0 <= r <= 3` references and the first `0 <= xx <= 127` bytes of `cc.code`."
  },
  {
    "name": "PUSHCONT_SHORT",
    "alias_of": "",
    "tlb": "#9 x:(## 4) ssss:((8 * x) * Bit)",
    "doc_category": "const_data",
    "doc_opcode": "9xccc",
    "doc_fift": "[builder] PUSHCONT\n[builder] CONT",
    "doc_stack": "- c",
    "doc_gas": 18,
    "doc_description": "Pushes a continuation made from `builder`.\n_Details:_ Pushes an `x`-byte continuation for `0 <= x <= 15`."
  },
  {
    "name": "",
    "alias_of": "",
    "tlb": "",
    "doc_category": "const_data",
    "doc_opcode": "",
    "doc_fift": "<{ code }> PUSHCONT\n<{ code }> CONT\nCONT:<{ code }>",
    "doc_stack": "- c",
    "doc_gas": "",
    "doc_description": "Pushes a continuation with code `code`.\nNote that the assembler can replace `PUSHCONT` with `PUSHREFCONT` in certain situations (e.g. if there’s not enough space in the current continuation)."
  },
  {
    "name": "ADD",
    "alias_of": "",
    "tlb": "#A0",
    "doc_category": "arithm_basic",
    "doc_opcode": "A0",
    "doc_fift": "ADD",
    "doc_stack": "x y - x+y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "SUB",
    "alias_of": "",
    "tlb": "#A1",
    "doc_category": "arithm_basic",
    "doc_opcode": "A1",
    "doc_fift": "SUB",
    "doc_stack": "x y - x-y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "SUBR",
    "alias_of": "",
    "tlb": "#A2",
    "doc_category": "arithm_basic",
    "doc_opcode": "A2",
    "doc_fift": "SUBR",
    "doc_stack": "x y - y-x",
    "doc_gas": 18,
    "doc_description": "Equivalent to `SWAP` `SUB`."
  },
  {
    "name": "NEGATE",
    "alias_of": "",
    "tlb": "#A3",
    "doc_category": "arithm_basic",
    "doc_opcode": "A3",
    "doc_fift": "NEGATE",
    "doc_stack": "x - -x",
    "doc_gas": 18,
    "doc_description": "Equivalent to `-1 MULCONST` or to `ZERO SUBR`.\nNotice that it triggers an integer overflow exception if `x=-2^256`."
  },
  {
    "name": "INC",
    "alias_of": "",
    "tlb": "#A4",
    "doc_category": "arithm_basic",
    "doc_opcode": "A4",
    "doc_fift": "INC",
    "doc_stack": "x - x+1",
    "doc_gas": 18,
    "doc_description": "Equivalent to `1 ADDCONST`."
  },
  {
    "name": "DEC",
    "alias_of": "",
    "tlb": "#A5",
    "doc_category": "arithm_basic",
    "doc_opcode": "A5",
    "doc_fift": "DEC",
    "doc_stack": "x - x-1",
    "doc_gas": 18,
    "doc_description": "Equivalent to `-1 ADDCONST`."
  },
  {
    "name": "ADDCONST",
    "alias_of": "",
    "tlb": "#A6 cc:int8",
    "doc_category": "arithm_basic",
    "doc_opcode": "A6cc",
    "doc_fift": "[cc] ADDCONST\n[cc] ADDINT\n[-cc] SUBCONST\n[-cc] SUBINT",
    "doc_stack": "x - x+cc",
    "doc_gas": 26,
    "doc_description": "`-128 <= cc <= 127`."
  },
  {
    "name": "MULCONST",
    "alias_of": "",
    "tlb": "#A7 cc:int8",
    "doc_category": "arithm_basic",
    "doc_opcode": "A7cc",
    "doc_fift": "[cc] MULCONST\n[cc] MULINT",
    "doc_stack": "x - x*cc",
    "doc_gas": 26,
    "doc_description": "`-128 <= cc <= 127`."
  },
  {
    "name": "MUL",
    "alias_of": "",
    "tlb": "#A8",
    "doc_category": "arithm_basic",
    "doc_opcode": "A8",
    "doc_fift": "MUL",
    "doc_stack": "x y - x*y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "DIV_BASE",
    "alias_of": "",
    "tlb": "#A9 m:uint1 s:uint2 cdft:(Either [ d:uint2 f:uint2 ] [ d:uint2 f:uint2 tt:uint8 ])",
    "doc_category": "arithm_div",
    "doc_opcode": "A9mscdf",
    "doc_fift": "",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "This is the general encoding of division, with an optional pre-multiplication and an optional replacement of the division or multiplication by a shift. Variable fields are as follows:\n`0 <= m <= 1`  -  Indicates whether there is pre-multiplication (`MULDIV` and its variants), possibly replaced by a left shift.\n`0 <= s <= 2`  -  Indicates whether either the multiplication or the division have been replaced by shifts: `s=0` - no replacement, `s=1` - division replaced by a right shift, `s=2` - multiplication replaced by a left shift (possible only for `m=1`).\n`0 <= c <= 1`  -  Indicates whether there is a constant one-byte argument `tt` for the shift operator (if `s!=0`). For `s=0`, `c=0`. If `c=1`, then `0 <= tt <= 255`, and the shift is performed by `tt+1` bits. If `s!=0` and `c=0`, then the shift amount is provided to the instruction as a top-of-stack _Integer_ in range `0...256`.\n`1 <= d <= 3`  -  Indicates which results of division are required: `1` - only the quotient, `2` - only the remainder, `3` - both.\n`0 <= f <= 2`  -  Rounding mode: `0` - floor, `1` - nearest integer, `2` - ceiling.\nAll instructions below are variants of this."
  },
  {
    "name": "DIV",
    "alias_of": "DIV_BASE",
    "tlb": "#A904",
    "doc_category": "arithm_div",
    "doc_opcode": "A904",
    "doc_fift": "DIV",
    "doc_stack": "x y - q",
    "doc_gas": 26,
    "doc_description": "`q=floor(x/y)`, `r=x-y*q`"
  },
  {
    "name": "DIVR",
    "alias_of": "DIV_BASE",
    "tlb": "#A905",
    "doc_category": "arithm_div",
    "doc_opcode": "A905",
    "doc_fift": "DIVR",
    "doc_stack": "x y - q’",
    "doc_gas": 26,
    "doc_description": "`q’=round(x/y)`, `r’=x-y*q’`"
  },
  {
    "name": "DIVC",
    "alias_of": "DIV_BASE",
    "tlb": "#A906",
    "doc_category": "arithm_div",
    "doc_opcode": "A906",
    "doc_fift": "DIVC",
    "doc_stack": "x y - q''",
    "doc_gas": 26,
    "doc_description": "`q’’=ceil(x/y)`, `r’’=x-y*q’’`"
  },
  {
    "name": "MOD",
    "alias_of": "DIV_BASE",
    "tlb": "#A908",
    "doc_category": "arithm_div",
    "doc_opcode": "A908",
    "doc_fift": "MOD",
    "doc_stack": "x y - r",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "DIVMOD",
    "alias_of": "DIV_BASE",
    "tlb": "#A90C",
    "doc_category": "arithm_div",
    "doc_opcode": "A90C",
    "doc_fift": "DIVMOD",
    "doc_stack": "x y - q r",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "DIVMODR",
    "alias_of": "DIV_BASE",
    "tlb": "#A90D",
    "doc_category": "arithm_div",
    "doc_opcode": "A90D",
    "doc_fift": "DIVMODR",
    "doc_stack": "x y - q' r'",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "DIVMODC",
    "alias_of": "DIV_BASE",
    "tlb": "#A90E",
    "doc_category": "arithm_div",
    "doc_opcode": "A90E",
    "doc_fift": "DIVMODC",
    "doc_stack": "x y - q'' r''",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "RSHIFTR_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A925",
    "doc_category": "arithm_div",
    "doc_opcode": "A925",
    "doc_fift": "RSHIFTR",
    "doc_stack": "x y - round(x/2^y)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "RSHIFTC_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A926",
    "doc_category": "arithm_div",
    "doc_opcode": "A926",
    "doc_fift": "RSHIFTC",
    "doc_stack": "x y - ceil(x/2^y)",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "RSHIFTR",
    "alias_of": "DIV_BASE",
    "tlb": "#A935 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A935tt",
    "doc_fift": "[tt+1] RSHIFTR#",
    "doc_stack": "x y - round(x/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "RSHIFTC",
    "alias_of": "DIV_BASE",
    "tlb": "#A936 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A936tt",
    "doc_fift": "[tt+1] RSHIFTC#",
    "doc_stack": "x y - ceil(x/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "MODPOW2",
    "alias_of": "DIV_BASE",
    "tlb": "#A938 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A938tt",
    "doc_fift": "[tt+1] MODPOW2#",
    "doc_stack": "x - x mod 2^(tt+1)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "MULDIV",
    "alias_of": "DIV_BASE",
    "tlb": "#A984",
    "doc_category": "arithm_div",
    "doc_opcode": "A98",
    "doc_fift": "MULDIV",
    "doc_stack": "x y z - q",
    "doc_gas": 26,
    "doc_description": "`q=floor(x*y/z)`"
  },
  {
    "name": "MULDIVR",
    "alias_of": "DIV_BASE",
    "tlb": "#A985",
    "doc_category": "arithm_div",
    "doc_opcode": "A985",
    "doc_fift": "MULDIVR",
    "doc_stack": "x y z - q'",
    "doc_gas": 26,
    "doc_description": "`q'=round(x*y/z)`"
  },
  {
    "name": "MULDIVMOD",
    "alias_of": "DIV_BASE",
    "tlb": "#A98C",
    "doc_category": "arithm_div",
    "doc_opcode": "A98C",
    "doc_fift": "MULDIVMOD",
    "doc_stack": "x y z - q r",
    "doc_gas": 26,
    "doc_description": "`q=floor(x*y/z)`, `r=x*y-z*q`"
  },
  {
    "name": "MULRSHIFT_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9A4",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A4",
    "doc_fift": "MULRSHIFT",
    "doc_stack": "x y z - floor(x*y/2^z)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "MULRSHIFTR_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9A5",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A5",
    "doc_fift": "MULRSHIFTR",
    "doc_stack": "x y z - round(x*y/2^z)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "MULRSHIFTC_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9A6",
    "doc_category": "arithm_div",
    "doc_opcode": "A9A6",
    "doc_fift": "MULRSHIFTC",
    "doc_stack": "x y z - ceil(x*y/2^z)",
    "doc_gas": 34,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "MULRSHIFT",
    "alias_of": "DIV_BASE",
    "tlb": "#A9B4 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9B4tt",
    "doc_fift": "[tt+1] MULRSHIFT#",
    "doc_stack": "x y - floor(x*y/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "MULRSHIFTR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9B5 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9B5tt",
    "doc_fift": "[tt+1] MULRSHIFTR#",
    "doc_stack": "x y - round(x*y/2^(tt+1))",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "MULRSHIFTC",
    "alias_of": "DIV_BASE",
    "tlb": "#A9B6 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9B6tt",
    "doc_fift": "[tt+1] MULRSHIFTC#",
    "doc_stack": "x y - ceil(x*y/2^(tt+1))",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "LSHIFTDIV_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9C4",
    "doc_category": "arithm_div",
    "doc_opcode": "A9C4",
    "doc_fift": "LSHIFTDIV",
    "doc_stack": "x y z - floor(2^z*x/y)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "LSHIFTDIVR_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9C5",
    "doc_category": "arithm_div",
    "doc_opcode": "A9C5",
    "doc_fift": "LSHIFTDIVR",
    "doc_stack": "x y z - round(2^z*x/y)",
    "doc_gas": 26,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "LSHIFTDIVC_VAR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9C6",
    "doc_category": "arithm_div",
    "doc_opcode": "A9C6",
    "doc_fift": "LSHIFTDIVC",
    "doc_stack": "x y z - ceil(2^z*x/y)",
    "doc_gas": 34,
    "doc_description": "`0 <= z <= 256`"
  },
  {
    "name": "LSHIFTDIV",
    "alias_of": "DIV_BASE",
    "tlb": "#A9D4 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D4tt",
    "doc_fift": "[tt+1] LSHIFT#DIV",
    "doc_stack": "x y - floor(2^(tt+1)*x/y)",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "LSHIFTDIVR",
    "alias_of": "DIV_BASE",
    "tlb": "#A9D5 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D5tt",
    "doc_fift": "[tt+1] LSHIFT#DIVR",
    "doc_stack": "x y - round(2^(tt+1)*x/y)",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "LSHIFTDIVC",
    "alias_of": "DIV_BASE",
    "tlb": "#A9D6 tt:uint8",
    "doc_category": "arithm_div",
    "doc_opcode": "A9D6tt",
    "doc_fift": "[tt+1] LSHIFT#DIVC",
    "doc_stack": "x y - ceil(2^(tt+1)*x/y)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "LSHIFT",
    "alias_of": "",
    "tlb": "#AA cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "AAcc",
    "doc_fift": "[cc+1] LSHIFT#",
    "doc_stack": "x - x*2^(cc+1)",
    "doc_gas": 26,
    "doc_description": "`0 <= cc <= 255`"
  },
  {
    "name": "RSHIFT",
    "alias_of": "",
    "tlb": "#AB cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "ABcc",
    "doc_fift": "[cc+1] RSHIFT#",
    "doc_stack": "x - floor(x/2^(cc+1))",
    "doc_gas": 18,
    "doc_description": "`0 <= cc <= 255`"
  },
  {
    "name": "LSHIFT_VAR",
    "alias_of": "",
    "tlb": "#AC",
    "doc_category": "arithm_logical",
    "doc_opcode": "AC",
    "doc_fift": "LSHIFT",
    "doc_stack": "x y - x*2^y",
    "doc_gas": 18,
    "doc_description": "`0 <= y <= 1023`"
  },
  {
    "name": "RSHIFT_VAR",
    "alias_of": "",
    "tlb": "#AD",
    "doc_category": "arithm_logical",
    "doc_opcode": "AD",
    "doc_fift": "RSHIFT",
    "doc_stack": "x y - floor(x/2^y)",
    "doc_gas": 18,
    "doc_description": "`0 <= y <= 1023`"
  },
  {
    "name": "POW2",
    "alias_of": "",
    "tlb": "#AE",
    "doc_category": "arithm_logical",
    "doc_opcode": "AE",
    "doc_fift": "POW2",
    "doc_stack": "y - 2^y",
    "doc_gas": 18,
    "doc_description": "`0 <= y <= 1023`\nEquivalent to `ONE` `SWAP` `LSHIFT`."
  },
  {
    "name": "AND",
    "alias_of": "",
    "tlb": "#B0",
    "doc_category": "arithm_logical",
    "doc_opcode": "B0",
    "doc_fift": "AND",
    "doc_stack": "x y - x&y",
    "doc_gas": 18,
    "doc_description": "Bitwise and of two signed integers `x` and `y`, sign-extended to infinity."
  },
  {
    "name": "OR",
    "alias_of": "",
    "tlb": "#B1",
    "doc_category": "arithm_logical",
    "doc_opcode": "B1",
    "doc_fift": "OR",
    "doc_stack": "x y - x|y",
    "doc_gas": 18,
    "doc_description": "Bitwise or of two integers."
  },
  {
    "name": "XOR",
    "alias_of": "",
    "tlb": "#B2",
    "doc_category": "arithm_logical",
    "doc_opcode": "B2",
    "doc_fift": "XOR",
    "doc_stack": "x y - x xor y",
    "doc_gas": 18,
    "doc_description": "Bitwise xor of two integers."
  },
  {
    "name": "NOT",
    "alias_of": "",
    "tlb": "#B3",
    "doc_category": "arithm_logical",
    "doc_opcode": "B3",
    "doc_fift": "NOT",
    "doc_stack": "x - ~x",
    "doc_gas": 26,
    "doc_description": "Bitwise not of an integer."
  },
  {
    "name": "FITS",
    "alias_of": "",
    "tlb": "#B4 cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "B4cc",
    "doc_fift": "[cc+1] FITS",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `cc+1`-bit signed integer for `0 <= cc <= 255` (i.e., whether `-2^cc <= x < 2^cc`).\nIf not, either triggers an integer overflow exception, or replaces `x` with a `NaN` (quiet version)."
  },
  {
    "name": "CHKBOOL",
    "alias_of": "FITS",
    "tlb": "#B400",
    "doc_category": "arithm_logical",
    "doc_opcode": "B400",
    "doc_fift": "CHKBOOL",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a “boolean value'' (i.e., either 0 or -1)."
  },
  {
    "name": "UFITS",
    "alias_of": "",
    "tlb": "#B5 cc:uint8",
    "doc_category": "arithm_logical",
    "doc_opcode": "B5cc",
    "doc_fift": "[cc+1] UFITS",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `cc+1`-bit unsigned integer for `0 <= cc <= 255` (i.e., whether `0 <= x < 2^(cc+1)`)."
  },
  {
    "name": "CHKBIT",
    "alias_of": "UFITS",
    "tlb": "#B500",
    "doc_category": "arithm_logical",
    "doc_opcode": "B500",
    "doc_fift": "CHKBIT",
    "doc_stack": "x - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a binary digit (i.e., zero or one)."
  },
  {
    "name": "FITSX",
    "alias_of": "",
    "tlb": "#B600",
    "doc_category": "arithm_logical",
    "doc_opcode": "B600",
    "doc_fift": "FITSX",
    "doc_stack": "x c - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `c`-bit signed integer for `0 <= c <= 1023`."
  },
  {
    "name": "UFITSX",
    "alias_of": "",
    "tlb": "#B601",
    "doc_category": "arithm_logical",
    "doc_opcode": "B601",
    "doc_fift": "UFITSX",
    "doc_stack": "x c - x",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` is a `c`-bit unsigned integer for `0 <= c <= 1023`."
  },
  {
    "name": "BITSIZE",
    "alias_of": "",
    "tlb": "#B602",
    "doc_category": "arithm_logical",
    "doc_opcode": "B602",
    "doc_fift": "BITSIZE",
    "doc_stack": "x - c",
    "doc_gas": 26,
    "doc_description": "Computes smallest `c >= 0` such that `x` fits into a `c`-bit signed integer (`-2^(c-1) <= c < 2^(c-1)`)."
  },
  {
    "name": "UBITSIZE",
    "alias_of": "",
    "tlb": "#B603",
    "doc_category": "arithm_logical",
    "doc_opcode": "B603",
    "doc_fift": "UBITSIZE",
    "doc_stack": "x - c",
    "doc_gas": 26,
    "doc_description": "Computes smallest `c >= 0` such that `x` fits into a `c`-bit unsigned integer (`0 <= x < 2^c`), or throws a range check exception."
  },
  {
    "name": "MIN",
    "alias_of": "",
    "tlb": "#B608",
    "doc_category": "arithm_logical",
    "doc_opcode": "B608",
    "doc_fift": "MIN",
    "doc_stack": "x y - x or y",
    "doc_gas": 26,
    "doc_description": "Computes the minimum of two integers `x` and `y`."
  },
  {
    "name": "MAX",
    "alias_of": "",
    "tlb": "#B609",
    "doc_category": "arithm_logical",
    "doc_opcode": "B609",
    "doc_fift": "MAX",
    "doc_stack": "x y - x or y",
    "doc_gas": 26,
    "doc_description": "Computes the maximum of two integers `x` and `y`."
  },
  {
    "name": "MINMAX",
    "alias_of": "",
    "tlb": "#B60A",
    "doc_category": "arithm_logical",
    "doc_opcode": "B60A",
    "doc_fift": "MINMAX\nINTSORT2",
    "doc_stack": "x y - x y or y x",
    "doc_gas": 26,
    "doc_description": "Sorts two integers. Quiet version of this operation returns two `NaN`s if any of the arguments are `NaN`s."
  },
  {
    "name": "ABS",
    "alias_of": "",
    "tlb": "#B60B",
    "doc_category": "arithm_logical",
    "doc_opcode": "B60B",
    "doc_fift": "ABS",
    "doc_stack": "x - |x|",
    "doc_gas": 26,
    "doc_description": "Computes the absolute value of an integer `x`."
  },
  {
    "name": "QADD",
    "alias_of": "",
    "tlb": "#B7A0",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A0",
    "doc_fift": "QADD",
    "doc_stack": "x y - x+y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QSUB",
    "alias_of": "",
    "tlb": "#B7A1",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A1",
    "doc_fift": "QSUB",
    "doc_stack": "x y - x-y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QSUBR",
    "alias_of": "",
    "tlb": "#B7A2",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A2",
    "doc_fift": "QSUBR",
    "doc_stack": "x y - y-x",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QNEGATE",
    "alias_of": "",
    "tlb": "#B7A3",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A3",
    "doc_fift": "QNEGATE",
    "doc_stack": "x - -x",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QINC",
    "alias_of": "",
    "tlb": "#B7A4",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A4",
    "doc_fift": "QINC",
    "doc_stack": "x - x+1",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QDEC",
    "alias_of": "",
    "tlb": "#B7A5",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A5",
    "doc_fift": "QDEC",
    "doc_stack": "x - x-1",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QMUL",
    "alias_of": "",
    "tlb": "#B7A8",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A8",
    "doc_fift": "QMUL",
    "doc_stack": "x y - x*y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QDIV",
    "alias_of": "",
    "tlb": "#B7A904",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A904",
    "doc_fift": "QDIV",
    "doc_stack": "x y - q",
    "doc_gas": 34,
    "doc_description": "Division returns `NaN` if `y=0`."
  },
  {
    "name": "QDIVR",
    "alias_of": "",
    "tlb": "#B7A905",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A905",
    "doc_fift": "QDIVR",
    "doc_stack": "x y - q’",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVC",
    "alias_of": "",
    "tlb": "#B7A906",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A906",
    "doc_fift": "QDIVC",
    "doc_stack": "x y - q''",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QMOD",
    "alias_of": "",
    "tlb": "#B7A908",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A908",
    "doc_fift": "QMOD",
    "doc_stack": "x y - r",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVMOD",
    "alias_of": "",
    "tlb": "#B7A90C",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A90C",
    "doc_fift": "QDIVMOD",
    "doc_stack": "x y - q r",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVMODR",
    "alias_of": "",
    "tlb": "#B7A90D",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A90D",
    "doc_fift": "QDIVMODR",
    "doc_stack": "x y - q' r'",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QDIVMODC",
    "alias_of": "",
    "tlb": "#B7A90E",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A90E",
    "doc_fift": "QDIVMODC",
    "doc_stack": "x y - q'' r''",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QMULDIVR",
    "alias_of": "",
    "tlb": "#B7A985",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A985",
    "doc_fift": "QMULDIVR",
    "doc_stack": "x y z - q'",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QMULDIVMOD",
    "alias_of": "",
    "tlb": "#B7A98C",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7A98C",
    "doc_fift": "QMULDIVMOD",
    "doc_stack": "x y z - q r",
    "doc_gas": 34,
    "doc_description": ""
  },
  {
    "name": "QLSHIFT",
    "alias_of": "",
    "tlb": "#B7AC",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7AC",
    "doc_fift": "QLSHIFT",
    "doc_stack": "x y - x*2^y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QRSHIFT",
    "alias_of": "",
    "tlb": "#B7AD",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7AD",
    "doc_fift": "QRSHIFT",
    "doc_stack": "x y - floor(x/2^y)",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QPOW2",
    "alias_of": "",
    "tlb": "#B7AE",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7AE",
    "doc_fift": "QPOW2",
    "doc_stack": "y - 2^y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QAND",
    "alias_of": "",
    "tlb": "#B7B0",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B0",
    "doc_fift": "QAND",
    "doc_stack": "x y - x&y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QOR",
    "alias_of": "",
    "tlb": "#B7B1",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B1",
    "doc_fift": "QOR",
    "doc_stack": "x y - x|y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QXOR",
    "alias_of": "",
    "tlb": "#B7B2",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B2",
    "doc_fift": "QXOR",
    "doc_stack": "x y - x xor y",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QNOT",
    "alias_of": "",
    "tlb": "#B7B3",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B3",
    "doc_fift": "QNOT",
    "doc_stack": "x - ~x",
    "doc_gas": 26,
    "doc_description": ""
  },
  {
    "name": "QFITS",
    "alias_of": "",
    "tlb": "#B7B4 cc:uint8",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B4cc",
    "doc_fift": "[cc+1] QFITS",
    "doc_stack": "x - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a `cc+1`-bit signed integer, leaves it intact otherwise."
  },
  {
    "name": "QUFITS",
    "alias_of": "",
    "tlb": "#B7B5 cc:uint8",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B5cc",
    "doc_fift": "[cc+1] QUFITS",
    "doc_stack": "x - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a `cc+1`-bit unsigned integer, leaves it intact otherwise."
  },
  {
    "name": "QFITSX",
    "alias_of": "",
    "tlb": "#B7B600",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B600",
    "doc_fift": "QFITSX",
    "doc_stack": "x c - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a c-bit signed integer, leaves it intact otherwise."
  },
  {
    "name": "QUFITSX",
    "alias_of": "",
    "tlb": "#B7B601",
    "doc_category": "arithm_quiet",
    "doc_opcode": "B7B601",
    "doc_fift": "QUFITSX",
    "doc_stack": "x c - x",
    "doc_gas": 34,
    "doc_description": "Replaces `x` with a `NaN` if x is not a c-bit unsigned integer, leaves it intact otherwise."
  },
  {
    "name": "SGN",
    "alias_of": "",
    "tlb": "#B8",
    "doc_category": "compare_int",
    "doc_opcode": "B8",
    "doc_fift": "SGN",
    "doc_stack": "x - sgn(x)",
    "doc_gas": 18,
    "doc_description": "Computes the sign of an integer `x`:\n`-1` if `x<0`, `0` if `x=0`, `1` if `x>0`."
  },
  {
    "name": "LESS",
    "alias_of": "",
    "tlb": "#B9",
    "doc_category": "compare_int",
    "doc_opcode": "B9",
    "doc_fift": "LESS",
    "doc_stack": "x y - x<y",
    "doc_gas": 18,
    "doc_description": "Returns `-1` if `x<y`, `0` otherwise."
  },
  {
    "name": "EQUAL",
    "alias_of": "",
    "tlb": "#BA",
    "doc_category": "compare_int",
    "doc_opcode": "BA",
    "doc_fift": "EQUAL",
    "doc_stack": "x y - x=y",
    "doc_gas": 18,
    "doc_description": "Returns `-1` if `x=y`, `0` otherwise."
  },
  {
    "name": "LEQ",
    "alias_of": "",
    "tlb": "#BB",
    "doc_category": "compare_int",
    "doc_opcode": "BB",
    "doc_fift": "LEQ",
    "doc_stack": "x y - x<=y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "GREATER",
    "alias_of": "",
    "tlb": "#BC",
    "doc_category": "compare_int",
    "doc_opcode": "BC",
    "doc_fift": "GREATER",
    "doc_stack": "x y - x>y",
    "doc_gas": 18,
    "doc_description": ""
  },
  {
    "name": "NEQ",
    "alias_of": "",
    "tlb": "#BD",
    "doc_category": "compare_int",
    "doc_opcode": "BD",
    "doc_fift": "NEQ",
    "doc_stack": "x y - x!=y",
    "doc_gas": 18,
    "doc_description": "Equivalent to `EQUAL` `NOT`."
  },
  {
    "name": "GEQ",
    "alias_of": "",
    "tlb": "#BE",
    "doc_category": "compare_int",
    "doc_opcode": "BE",
    "doc_fift": "GEQ",
    "doc_stack": "x y - x>=y",
    "doc_gas": 18,
    "doc_description": "Equivalent to `LESS` `NOT`."
  },
  {
    "name": "CMP",
    "alias_of": "",
    "tlb": "#BF",
    "doc_category": "compare_int",
    "doc_opcode": "BF",
    "doc_fift": "CMP",
    "doc_stack": "x y - sgn(x-y)",
    "doc_gas": 18,
    "doc_description": "Computes the sign of `x-y`:\n`-1` if `x<y`, `0` if `x=y`, `1` if `x>y`.\nNo integer overflow can occur here unless `x` or `y` is a `NaN`."
  },
  {
    "name": "EQINT",
    "alias_of": "",
    "tlb": "#C0 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C0yy",
    "doc_fift": "[yy] EQINT",
    "doc_stack": "x - x=yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x=yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISZERO",
    "alias_of": "EQINT",
    "tlb": "#C000",
    "doc_category": "compare_int",
    "doc_opcode": "C000",
    "doc_fift": "ISZERO",
    "doc_stack": "x - x=0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is zero. Corresponds to Forth's `0=`."
  },
  {
    "name": "LESSINT",
    "alias_of": "",
    "tlb": "#C1 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C1yy",
    "doc_fift": "[yy] LESSINT\n[yy-1] LEQINT",
    "doc_stack": "x - x<yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x<yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISNEG",
    "alias_of": "LESSINT",
    "tlb": "#C100",
    "doc_category": "compare_int",
    "doc_opcode": "C100",
    "doc_fift": "ISNEG",
    "doc_stack": "x - x<0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is negative. Corresponds to Forth's `0<`."
  },
  {
    "name": "ISNPOS",
    "alias_of": "LESSINT",
    "tlb": "#C101",
    "doc_category": "compare_int",
    "doc_opcode": "C101",
    "doc_fift": "ISNPOS",
    "doc_stack": "x - x<=0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is non-positive."
  },
  {
    "name": "GTINT",
    "alias_of": "",
    "tlb": "#C2 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C2yy",
    "doc_fift": "[yy] GTINT\n[yy+1] GEQINT",
    "doc_stack": "x - x>yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x>yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISPOS",
    "alias_of": "GTINT",
    "tlb": "#C200",
    "doc_category": "compare_int",
    "doc_opcode": "C200",
    "doc_fift": "ISPOS",
    "doc_stack": "x - x>0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is positive. Corresponds to Forth's `0>`."
  },
  {
    "name": "ISNNEG",
    "alias_of": "GTINT",
    "tlb": "#C2FF",
    "doc_category": "compare_int",
    "doc_opcode": "C2FF",
    "doc_fift": "ISNNEG",
    "doc_stack": "x - x >=0",
    "doc_gas": 26,
    "doc_description": "Checks whether an integer is non-negative."
  },
  {
    "name": "NEQINT",
    "alias_of": "",
    "tlb": "#C3 yy:int8",
    "doc_category": "compare_int",
    "doc_opcode": "C3yy",
    "doc_fift": "[yy] NEQINT",
    "doc_stack": "x - x!=yy",
    "doc_gas": 26,
    "doc_description": "Returns `-1` if `x!=yy`, `0` otherwise.\n`-2^7 <= yy < 2^7`."
  },
  {
    "name": "ISNAN",
    "alias_of": "",
    "tlb": "#C4",
    "doc_category": "compare_int",
    "doc_opcode": "C4",
    "doc_fift": "ISNAN",
    "doc_stack": "x - x=NaN",
    "doc_gas": 18,
    "doc_description": "Checks whether `x` is a `NaN`."
  },
  {
    "name": "CHKNAN",
    "alias_of": "",
    "tlb": "#C5",
    "doc_category": "compare_int",
    "doc_opcode": "C5",
    "doc_fift": "CHKNAN",
    "doc_stack": "x - x",
    "doc_gas": "18/68",
    "doc_description": "Throws an arithmetic overflow exception if `x` is a `NaN`."
  },
  {
    "name": "SEMPTY",
    "alias_of": "",
    "tlb": "#C700",
    "doc_category": "compare_other",
    "doc_opcode": "C700",
    "doc_fift": "SEMPTY",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether a _Slice_ `s` is empty (i.e., contains no bits of data and no cell references)."
  },
  {
    "name": "SDEMPTY",
    "alias_of": "",
    "tlb": "#C701",
    "doc_category": "compare_other",
    "doc_opcode": "C701",
    "doc_fift": "SDEMPTY",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether _Slice_ `s` has no bits of data."
  },
  {
    "name": "SREMPTY",
    "alias_of": "",
    "tlb": "#C702",
    "doc_category": "compare_other",
    "doc_opcode": "C702",
    "doc_fift": "SREMPTY",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether _Slice_ `s` has no references."
  },
  {
    "name": "SDFIRST",
    "alias_of": "",
    "tlb": "#C703",
    "doc_category": "compare_other",
    "doc_opcode": "C703",
    "doc_fift": "SDFIRST",
    "doc_stack": "s - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether the first bit of _Slice_ `s` is a one."
  },
  {
    "name": "SDLEXCMP",
    "alias_of": "",
    "tlb": "#C704",
    "doc_category": "compare_other",
    "doc_opcode": "C704",
    "doc_fift": "SDLEXCMP",
    "doc_stack": "s s' - x",
    "doc_gas": 26,
    "doc_description": "Compares the data of `s` lexicographically with the data of `s'`, returning `-1`, 0, or 1 depending on the result."
  },
  {
    "name": "SDEQ",
    "alias_of": "",
    "tlb": "#C705",
    "doc_category": "compare_other",
    "doc_opcode": "C705",
    "doc_fift": "SDEQ",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether the data parts of `s` and `s'` coincide, equivalent to `SDLEXCMP` `ISZERO`."
  },
  {
    "name": "SDPFX",
    "alias_of": "",
    "tlb": "#C708",
    "doc_category": "compare_other",
    "doc_opcode": "C708",
    "doc_fift": "SDPFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a prefix of `s'`."
  },
  {
    "name": "SDPFXREV",
    "alias_of": "",
    "tlb": "#C709",
    "doc_category": "compare_other",
    "doc_opcode": "C709",
    "doc_fift": "SDPFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a prefix of `s`, equivalent to `SWAP` `SDPFX`."
  },
  {
    "name": "SDPPFX",
    "alias_of": "",
    "tlb": "#C70A",
    "doc_category": "compare_other",
    "doc_opcode": "C70A",
    "doc_fift": "SDPPFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a proper prefix of `s'` (i.e., a prefix distinct from `s'`)."
  },
  {
    "name": "SDPPFXREV",
    "alias_of": "",
    "tlb": "#C70B",
    "doc_category": "compare_other",
    "doc_opcode": "C70B",
    "doc_fift": "SDPPFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a proper prefix of `s`."
  },
  {
    "name": "SDSFX",
    "alias_of": "",
    "tlb": "#C70C",
    "doc_category": "compare_other",
    "doc_opcode": "C70C",
    "doc_fift": "SDSFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a suffix of `s'`."
  },
  {
    "name": "SDSFXREV",
    "alias_of": "",
    "tlb": "#C70D",
    "doc_category": "compare_other",
    "doc_opcode": "C70D",
    "doc_fift": "SDSFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a suffix of `s`."
  },
  {
    "name": "SDPSFX",
    "alias_of": "",
    "tlb": "#C70E",
    "doc_category": "compare_other",
    "doc_opcode": "C70E",
    "doc_fift": "SDPSFX",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s` is a proper suffix of `s'`."
  },
  {
    "name": "SDPSFXREV",
    "alias_of": "",
    "tlb": "#C70F",
    "doc_category": "compare_other",
    "doc_opcode": "C70F",
    "doc_fift": "SDPSFXREV",
    "doc_stack": "s s' - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `s'` is a proper suffix of `s`."
  },
  {
    "name": "SDCNTLEAD0",
    "alias_of": "",
    "tlb": "#C710",
    "doc_category": "compare_other",
    "doc_opcode": "C710",
    "doc_fift": "SDCNTLEAD0",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of leading zeroes in `s`."
  },
  {
    "name": "SDCNTLEAD1",
    "alias_of": "",
    "tlb": "#C711",
    "doc_category": "compare_other",
    "doc_opcode": "C711",
    "doc_fift": "SDCNTLEAD1",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of leading ones in `s`."
  },
  {
    "name": "SDCNTTRAIL0",
    "alias_of": "",
    "tlb": "#C712",
    "doc_category": "compare_other",
    "doc_opcode": "C712",
    "doc_fift": "SDCNTTRAIL0",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of trailing zeroes in `s`."
  },
  {
    "name": "SDCNTTRAIL1",
    "alias_of": "",
    "tlb": "#C713",
    "doc_category": "compare_other",
    "doc_opcode": "C713",
    "doc_fift": "SDCNTTRAIL1",
    "doc_stack": "s - n",
    "doc_gas": 26,
    "doc_description": "Returns the number of trailing ones in `s`."
  },
  {
    "name": "NEWC",
    "alias_of": "",
    "tlb": "#C8",
    "doc_category": "cell_build",
    "doc_opcode": "C8",
    "doc_fift": "NEWC",
    "doc_stack": "- b",
    "doc_gas": 18,
    "doc_description": "Creates a new empty _Builder_."
  },
  {
    "name": "ENDC",
    "alias_of": "",
    "tlb": "#C9",
    "doc_category": "cell_build",
    "doc_opcode": "C9",
    "doc_fift": "ENDC",
    "doc_stack": "b - c",
    "doc_gas": 518,
    "doc_description": "Converts a _Builder_ into an ordinary _Cell_."
  },
  {
    "name": "STI",
    "alias_of": "",
    "tlb": "#CA cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CAcc",
    "doc_fift": "[cc+1] STI",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a signed `cc+1`-bit integer `x` into _Builder_ `b` for `0 <= cc <= 255`, throws a range check exception if `x` does not fit into `cc+1` bits."
  },
  {
    "name": "STU",
    "alias_of": "",
    "tlb": "#CB cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CBcc",
    "doc_fift": "[cc+1] STU",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores an unsigned `cc+1`-bit integer `x` into _Builder_ `b`. In all other respects it is similar to `STI`."
  },
  {
    "name": "STREF",
    "alias_of": "",
    "tlb": "#CC",
    "doc_category": "cell_build",
    "doc_opcode": "CC",
    "doc_fift": "STREF",
    "doc_stack": "c b - b'",
    "doc_gas": 18,
    "doc_description": "Stores a reference to _Cell_ `c` into _Builder_ `b`."
  },
  {
    "name": "STBREFR",
    "alias_of": "",
    "tlb": "#CD",
    "doc_category": "cell_build",
    "doc_opcode": "CD",
    "doc_fift": "STBREFR\nENDCST",
    "doc_stack": "b b'' - b",
    "doc_gas": 518,
    "doc_description": "Equivalent to `ENDC` `SWAP` `STREF`."
  },
  {
    "name": "STSLICE",
    "alias_of": "",
    "tlb": "#CE",
    "doc_category": "cell_build",
    "doc_opcode": "CE",
    "doc_fift": "STSLICE",
    "doc_stack": "s b - b'",
    "doc_gas": 18,
    "doc_description": "Stores _Slice_ `s` into _Builder_ `b`."
  },
  {
    "name": "STIX",
    "alias_of": "",
    "tlb": "#CF00",
    "doc_category": "cell_build",
    "doc_opcode": "CF00",
    "doc_fift": "STIX",
    "doc_stack": "x b l - b'",
    "doc_gas": 26,
    "doc_description": "Stores a signed `l`-bit integer `x` into `b` for `0 <= l <= 257`."
  },
  {
    "name": "STUX",
    "alias_of": "",
    "tlb": "#CF01",
    "doc_category": "cell_build",
    "doc_opcode": "CF01",
    "doc_fift": "STUX",
    "doc_stack": "x b l - b'",
    "doc_gas": 26,
    "doc_description": "Stores an unsigned `l`-bit integer `x` into `b` for `0 <= l <= 256`."
  },
  {
    "name": "STIXR",
    "alias_of": "",
    "tlb": "#CF02",
    "doc_category": "cell_build",
    "doc_opcode": "CF02",
    "doc_fift": "STIXR",
    "doc_stack": "b x l - b'",
    "doc_gas": 26,
    "doc_description": "Similar to `STIX`, but with arguments in a different order."
  },
  {
    "name": "STUXR",
    "alias_of": "",
    "tlb": "#CF03",
    "doc_category": "cell_build",
    "doc_opcode": "CF03",
    "doc_fift": "STUXR",
    "doc_stack": "b x l - b'",
    "doc_gas": 26,
    "doc_description": "Similar to `STUX`, but with arguments in a different order."
  },
  {
    "name": "STIXQ",
    "alias_of": "",
    "tlb": "#CF04",
    "doc_category": "cell_build",
    "doc_opcode": "CF04",
    "doc_fift": "STIXQ",
    "doc_stack": "x b l - x b f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STIX`. If there is no space in `b`, sets `b'=b` and `f=-1`.\nIf `x` does not fit into `l` bits, sets `b'=b` and `f=1`.\nIf the operation succeeds, `b'` is the new _Builder_ and `f=0`.\nHowever, `0 <= l <= 257`, with a range check exception if this is not so."
  },
  {
    "name": "STUXQ",
    "alias_of": "",
    "tlb": "#CF05",
    "doc_category": "cell_build",
    "doc_opcode": "CF05",
    "doc_fift": "STUXQ",