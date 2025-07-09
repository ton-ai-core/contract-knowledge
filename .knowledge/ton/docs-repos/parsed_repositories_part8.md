# GitHub Docs Parser - Part 8

        return ();
    }
}
```

在操作智能合约后，您发现缺少了减表功能。您必须复制智能合约 "CounterV1 "的代码，并在 "增加 "函数旁边添加一个新的 "减少 "函数。现在您的代码如下

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::decrease) {
        int decrease_by = in_msg_body~load_uint(32);
        ctx_counter -= increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

一旦智能合约 "CounterV2 "准备就绪，你必须将其编译到链外的 "cell "中，并向 "CounterV1 "智能合约发送升级消息。

```javascript
await contractV1.sendUpgrade(provider.sender(), {
    code: await compile('ContractV2'),
    value: toNano('0.05'),
});
```

> 💡 Useful links
>
> [是否可以将代码重新部署到现有地址，还是必须将其作为新合约部署？](/v3/documentation/faq#is-it-possible-to-re-deploy-code-to-an-existing-address-or-does-it-have-to-be-deployed-as-a-new-contract)
>
> [文档中的 "set_code()"](/v3/documentation/smart-contracts/func/docs/stdlib#set_code)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/builtins.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/builtins.md
================================================
# 内置功能

本节描述了一些比之前文章中描述的语言结构更不基础的构造。它们可以在 [stdlib.fc](/develop/func/stdlib) 中定义，但这样会减少 FunC 优化器的操作空间。

## 抛出异常

可以通过条件原语 `throw_if`、`throw_unless` 和无条件的 `throw` 来抛出异常。第一个参数是错误代码；第二个是条件（`throw` 只有一个参数）。这些原语有参数化版本 `throw_arg_if`、`throw_arg_unless` 和 `throw_arg`。第一个参数是任何类型的异常参数；第二个是错误代码；第三个是条件（`throw_arg` 只有两个参数）。

## 布尔值

- `true` 是 `-1` 的别名
- `false` 是 `0` 的别名

## 变量转储

变量可以通过 `~dump` 函数转储到调试日志。

## 字符串转储

字符串可以通过 `~strdump` 函数转储到调试日志。

## 整数操作

- `muldiv` 是一个先乘后除的操作。中间结果存储在 513 位整数中，因此如果实际结果适合于 257 位整数，它不会溢出。
- `divmod` 是一个取两个数字作为参数并给出它们除法的商和余数的操作。

## 其他原语

- `null?` 检查参数是否为 `null`。对于 TVM 类型的 `null` 值，FunC 的 `Null` 表示某些原子类型值的缺失；参见 [null 值](/develop/func/types#null-values)。
- `touch` 和 `~touch` 将变量移至栈顶
- `at` 获取指定位置上的元组组件的值



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/comments.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/comments.md
================================================
# 注释

FunC 有单行注释，以 `;;`（双分号）开始。例如：

```func
int x = 1; ;; assign 1 to x
```

它还有多行注释，以 `{-` 开始并以 `-}` 结束。请注意，与许多其他语言不同的是，FunC 的多行注释可以嵌套。例如：

```func
{- This is a multi-line comment
    {- this is a comment in the comment -}
-}
```

此外，多行注释中可以有单行注释，且单行注释 `;;` 比多行注释 `{- -}`“更强”。换句话说，在以下示例中：

```func
{-
  Start of the comment

;; this comment ending is itself commented -> -}

const a = 10;
;; this comment begining is itself commented -> {-

  End of the comment
-}
```

`const a = 10;` 在多行注释内，因此被注释掉了。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/compiler_directives.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/compiler_directives.md
================================================
# 编译指令

这些是以 `#` 开始的关键字，指示编译器执行某些动作、检查或更改参数。

这些指令只能在最外层使用（不在任何函数定义内部）。

## #include

`#include` 指令允许包含另一个 FunC 源代码文件，该文件将代替 include 处进行解析。

语法为 `#include "filename.fc";`。文件会自动检查是否重复包含，且默认情况下，尝试多次包含同一文件将被忽略，并在详细级别不低于 2 时发出警告。

如果在解析包含的文件期间发生错误，此外，将打印包含的堆栈，其中包含链中每个包含的文件的位置。

## #pragma

`#pragma` 指令用于向编译器提供超出语言本身所传达的附加信息。

### #pragma version

版本编译指令用于在编译文件时强制使用特定版本的 FunC 编译器。

版本以 semver 格式指定，即 *a.b.c*，其中 *a* 是主版本号，*b* 是次版本号，*c* 是修订号。

开发者可用的比较运算符有几种：

- *a.b.c* 或 *=a.b.c* — 要求编译器版本正好为 *a.b.c*
- *>a.b.c* — 要求编译器版本高于 *a.b.c*
  - *>=a.b.c* — 要求编译器版本高于或等于 *a.b.c*
- *\<a.b.c* — 要求编译器版本低于 *a.b.c*
  - *\<=a.b.c* — 要求编译器版本低于或等于 *a.b.c*
- *^a.b.c* — 要求主编译器版本等于 'a' 部分且次版本不低于 'b' 部分
  - *^a.b* — 要求主编译器版本等于 *a* 部分且次版本不低于 *b* 部分
  - *^a* — 要求主编译器版本不低于 *a* 部分

对于其他比较运算符（*=*, *>*, *>=*, *\<*, *\<=*）简略格式假定省略部分为零，即：

- *>a.b* 等同于 *>a.b.0*（因此不匹配 *a.b.0* 版本）
- *\<=a* 等同于 *\<=a.0.0*（因此不匹配 *a.0.1* 版本）
- *^a.b.0* **不** 等同于 *^a.b*

例如，*^a.1.2* 匹配 *a.1.3* 但不匹配 *a.2.3* 或 *a.1.0*，然而，*^a.1* 匹配它们所有。

可以多次使用此指令；编译器版本必须满足所有提供的条件。

### #pragma not-version

此编译指令的语法与版本编译指令相同，但如果条件满足则会失败。

例如，它可以用于将已知有问题的特定版本列入黑名单。

### #pragma allow-post-modification

*funC v0.4.1*

默认情况下，禁止在同一表达式中先使用变量后修改它。换句话说，表达式 `(x, y) = (ds, ds~load_uint(8))` 无法编译，而 `(x, y) = (ds~load_uint(8), ds)` 是有效的。

可以通过 `#pragma allow-post-modification` 覆盖此规则，允许在批量赋值和函数调用中在使用后修改变量；如常规，子表达式将从左到右计算：`(x, y) = (ds, ds~load_bits(8))` 将导致 `x` 包含初始 `ds`；`f(ds, ds~load_bits(8))` `f` 的第一个参数将包含初始 `ds`，第二个参数 - `ds` 的 8 位。

`#pragma allow-post-modification` 仅适用于编译指令之后的代码。

### #pragma compute-asm-ltr

*funC v0.4.1*

Asm 声明可以覆盖参数的顺序，例如在以下表达式中

```func
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref())
```

解析顺序将是：`load_ref()`、`load_uint(256)`、`load_dict()` 和 `load_uint(8)`，由于以下 asm 声明（注意 `asm(value index dict key_len)`）：

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
```

可以通过 `#pragma compute-asm-ltr` 更改为严格的从左到右的计算顺序

因此，在

```func
#pragma compute-asm-ltr
...
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref());
```

中解析顺序将是 `load_dict()`、`load_uint(8)`、`load_uint(256)`、`load_ref()`，所有 asm 排列将在计算之后发生。

`#pragma compute-asm-ltr` 仅适用于编译指令之后的代码。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/dictionaries.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/dictionaries.md
================================================
# TON 字典

智能合约可以使用字典--有序的键值映射。它们在内部由 cell 树表示。

:::warning
Working with potentially large trees of cells creates a couple of considerations:

1. 每次更新操作都会构建相当数量的 cell （每个构建的 cell 需要消耗 500 gas，详情请查看 [TVM 说明](/v3/documentation/tvm/instructions#gas-prices) 页面），这意味着如果不小心使用，这些操作可能会耗尽 gas。
   - 特别是，钱包机器人在使用 highload-v2 钱包时遇到过一次这样的问题。无限制循环加上每次迭代时昂贵的字典更新导致 gas 耗尽，最终导致重复交易，如 [fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6](https://tonviewer.com/transaction/fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6)，耗尽了余额。
2. N 个键值对的二叉树包含 N-1 个分叉，因此总共至少有 2N-1 个 cell 。智能合约的存储空间仅限于 65536 个唯一 cell ，因此字典中的最大条目数为 32768，如果有重复 cell ，条目数会稍多一些。
   :::

## 词典种类

### "Hash"map

显而易见，TON 中最著名、使用最多的字典是 hashmap。它有一整节的 TVM 操作码（[TVM Instructions](/v3/documentation/tvm/instructions#quick-search) - Dictionary Manipulation），通常用于智能合约。

这些字典是同长度键（所述长度作为参数提供给所有函数）与值片段的映射。与名称中的 "散列 "不同，字典中的条目是有序的，可以通过键、上一个或下一个键值对方便地提取元素。值与内部节点标记以及可能的关键部分放置在同一 cell 中，因此不能使用全部 1023 位；`~udict_set_ref` 通常用于这种情况。

空 hashmap 在 TVM 中表示为 "空"，因此不是 cell 。要在 cell 中存储字典，首先要保存一个比特（空为 0，否则为 1），然后在 hashmap 不为空的情况下添加引用。因此，`store_maybe_ref` 和 `store_dict` 是可以互换的，一些智能合约作者使用 `load_dict` 从传入的消息或存储中加载 `Maybe ^Cell`。

hashmaps的可能操作

- 从 slice 加载，存储到构建器
- 按key 获取/设置/删除 value
- 替换值（如果键已存在，则设置新值）/添加一个值（如果键未存在）
- 按键的顺序移动到下一个/上一个键值对（如果不考虑 gas 限制，可用于[遍历字典](/v3/documentation/smart-contracts/func/cookbook#how-to-iterate-dictionaries)
- 检索最小/最大键及其值
- 按 键 获取函数（延续）并立即执行

为了使合约不会因 gas 超限而中断，在处理一个事务时，只能进行有限次数的字典更新。如果合约的余额被用于根据开发者的条件维护地图，合约可以向自己发送继续清理的消息。

:::info
有检索子字典的说明：给定键范围内条目子集。这些指令尚未经过测试，因此只能以 TVM 汇编形式查看：`SUBDICTGET` 和类似的指令。
:::

#### Hashmap 示例

让我们看看 Hashmap 是什么样的，特别是 257 位整数键与空值片段的映射（这样的映射只表示元素的存在或不存在）。

快速检查的方法是在 Python 中运行以下脚本（可酌情用其他 SDK 替换 `pytoniq`）：

```python
import pytoniq
k = pytoniq.HashMap(257)
em = pytoniq.begin_cell().to_slice()
k.set(5, em)
k.set(7, em)
k.set(5 - 2**256, em)
k.set(6 - 2**256, em)
print(str(pytoniq.begin_cell().store_maybe_ref(k.serialize()).end_cell()))
```

该结构是二叉树，如果我们忽略根 cell ，它甚至是一棵平衡的树。

```
1[80] -> {
	2[00] -> {
		265[9FC00000000000000000000000000000000000000000000000000000000000000080] -> {
			4[50],
			4[50]
		},
		266[9FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF40] -> {
			2[00],
			2[00]
		}
	}
}
```

文档中有 [更多关于 hashmap 解析的示例](/v3/documentation/data-formats/tlb/tl-b-types#hashmap-parsing-example)。

### 增强地图（每个节点都有附加数据）

TON 验证器内部使用这些映射来计算分片中所有合约的总余额（使用每个节点的总子树余额映射可以让它们快速验证更新）。目前还没有 TVM 原语来处理这些映射。

### 前缀字典

:::info
测试表明，创建前缀字典的文档不足。除非完全了解相关操作码 `PFXDICTSET` 和类似代码的工作原理，否则不应在生产合约中使用它们。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/functions.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/functions.md
================================================
# 函数

FunC 程序本质上是一系列函数声明/定义和全局变量声明。本节涵盖了第一个主题。

任何函数声明或定义都以一个共同的模式开始，接下来有三种情况之一：

- 单个 `;`，表示函数已声明但尚未定义。它可能会在同一文件中的后面或在传递给 FunC 编译器的其他文件中定义。例如，
  ```func
  int add(int x, int y);
  ```
  是一个名为 `add` 类型为 `(int, int) -> int` 的函数的简单声明。

- 汇编函数体定义。这是通过低层级 TVM 原语定义函数以便在 FunC 程序中后续使用的方法。例如，
  ```func
  int add(int x, int y) asm "ADD";
  ```
  是同一个 `add` 函数的汇编定义，类型为 `(int, int) -> int`，将转换为 TVM 操作码 `ADD`。

- 常规块语句函数体定义。这是定义函数的常用方式。例如，
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  是 `add` 函数的常规定义。

## 函数声明

如前所述，任何函数声明或定义都以一个共同的模式开始。以下是该模式：

```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```

其中 `[ ... ]` 对应于可选条目。

### 函数名

函数名可以是任何[标识符](/develop/func/literals_identifiers#identifiers)，也可以以 `.` 或 `~` 符号开头。这些符号的含义在[声明](/develop/func/statements#methods-calls)部分解释。

例如，`udict_add_builder?`、`dict_set` 和 `~dict_set` 都是有效且不同的函数名。（它们在 [stdlib.fc](/develop/func/stdlib) 中定义。）

#### 特殊函数名

FunC（实际上是 Fift 汇编器）有几个预定义的保留函数名，具有预定义的[id](/develop/func/functions#method_id)。

- `main` 和 `recv_internal` 的 id 为 0
- `recv_external` 的 id 为 -1
- `run_ticktock` 的 id 为 -2

每个程序必须有一个 id 为 0 的函数，即 `main` 或 `recv_internal` 函数。
`run_ticktock` 在特殊智能合约的 ticktock 交易中被调用。

#### 接收内部消息

`recv_internal` 在智能合约接收到内部入站消息时被调用。
当 [TVM 初始化](/learn/tvm-instructions/tvm-overview#initialization-of-tvm) 时，栈上有一些变量，通过在 `recv_internal` 中设置参数，我们使智能合约代码能够了解其中的一些变量。那些代码不知道的变量将永远躺在栈底，从未被触及。

因此，以下每个 `recv_internal` 声明都是正确的，但具有较少变量的声明将稍微节省一些gas（每个未使用的参数都会增加额外的 `DROP` 指令）

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```

#### 接收外部消息

`recv_external` 用于入站外部消息。

### 返回类型

返回类型可以是[类型](/develop/func/types.md)部分中描述的任何原子或复合类型。例如，

```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int -> int) foo'''();
() foo''''();
```

都是有效的函数声明。

也允许类型推断。例如，

```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```

是 `pyth` 函数的有效定义，类型为 `(int, int) -> (int, int, int)`，用于计算勾股数。

### 函数参数

函数参数由逗号分隔。以下是参数的有效声明方式：

- 普通声明：类型 + 名称。例如，`int x` 是函数声明 `() foo(int x);` 中类型为 `int`、名称为 `x` 的参数声明。
- 未使用的参数声明：只有类型。例如，
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  是类型为 `(int, int) -> int` 的有效函数定义。
- 推断类型的参数声明：只有名称。例如，
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  是类型为 `int -> int` 的有效函数定义。`x` 的 `int` 类型由类型检查器推断。

请注意，尽管函数可能看起来像是多个参数的函数，实际上它是一个单一[张量类型](/develop/func/types#tensor-types)参数的函数。要了解差异，请参阅[函数应用](/develop/func/statements#function-application)。然而，参数张量的组成部分通常被称为函数参数。

### 函数调用

#### 非修改方法

:::info
非修改函数支持使用 `.` 的简短函数调用形式
:::

```func
example(a);
a.example();
```

如果函数至少有一个参数，它可以作为非修改方法被调用。例如，`store_uint` 的类型为 `(builder, int, int) -> builder`（第二个参数是要存储的值，第三个是位长度）。`begin_cell` 是创建新构建器的函数。以下代码等效：

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```

```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

因此，函数的第一个参数可以在函数名前传递给它，如果用 `.` 分隔。代码可以进一步简化：

```func
builder b = begin_cell().store_uint(239, 8);
```

也可以进行多次方法调用：

```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### 修改函数

:::info
修改函数支持使用 `~` 和 `.` 运算符的简短形式。
:::

如果函数的第一个参数的类型为 `A`，并且函数的返回值形状为 `(A, B)`，其中 `B` 是某种任意类型，则该函数可以作为修改方法被调用。

修改函数调用可以接受一些参数并返回一些值，但它们会修改第一个参数，即将返回值的第一个组件分配给第一个参数中的变量。

```func
a~example();
a = example(a);
```

例如，假设 `cs` 是一个cell slice ，`load_uint` 的类型为 `(slice, int) -> (slice, int)`：它接受一个cell slice 和要加载的位数，然后返回 slice 的剩余部分和加载的值。以下代码等效：

```func
(cs, int x) = load_uint(cs, 8);
```

```func
(cs, int x) = cs.load_uint(8);
```

```func
int x = cs~load_uint(8);
```

在某些情况下，我们希望将不返回任何值并且只修改第一个参数的函数用作修改方法。可以使用cell类型如下操作：假设我们想定义类型为 `int -> int` 的函数 `inc`，它用于递增一个整数，并将其用作修改方法。然后我们应该将 `inc` 定义为类型为 `int -> (int, ())` 的函数：

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

这样定义后，它可以用作修改方法。以下将递增 `x`。

```func
x~inc();
```

#### `.` 和 `~` 在函数名中

假设我们还想将 `inc` 用作非修改方法。我们可以写类似的东西：

```func
(int y, _) = inc(x);
```

但可以重写 `inc` 作为修改方法的定义。

```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```

然后像这样调用它：

```func
x~inc();
int y = inc(x);
int z = x.inc();
```

第一个调用将修改 x；第二个和第三个不会。

总结一下，当以非修改或修改方法（即使用 `.foo` 或 `~foo` 语法）调用名为 `foo` 的函数时，如果存在 `.foo` 或 `~foo` 的定义，FunC 编译器将分别使用 `.foo` 或 `~foo` 的定义，如果没有，则使用 `foo` 的定义。

### 修饰符

有三种类型的修饰符：`impure`，`inline`/`inline_ref` 和 `method_id`。可以在函数声明中放置一种、几种或不放置任何修饰符，但目前它们必须以正确的顺序呈现。例如，不允许在 `inline` 之后放置 `impure`。

#### 非纯修饰符(Impure specifier)

`impure` 修饰符意味着函数可能有一些不可忽略的副作用。例如，如果函数可以修改合约存储、发送消息或在某些数据无效时抛出异常，并且函数旨在验证这些数据，那么我们应该放置 `impure` 修饰符。

如果未指定 `impure`，并且未使用函数调用的结果，则 FunC 编译器可能会并将删除此函数调用。

例如，在 [stdlib.fc](/develop/func/stdlib) 函数中

```func
int random() impure asm "RANDU256";
```

被定义。使用 `impure` 是因为 `RANDU256` 改变了随机数生成器的内部状态。

#### 内联修饰符(Inline specifier)

如果函数具有 `inline` 修饰符，则其代码实际上在调用该函数的每个地方都被替换。不言而喻，递归调用内联函数是不可能的。

例如，您可以在此示例中像这样使用 `inline`：[ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16)

```func
(int) add(int a, int b) inline {
    return a + b;
}
```

因为 `add` 函数使用了 `inline` 指定符。编译器会尝试用实际代码 `a + b` 替换对 `add` 的调用，从而避免函数调用开销。

带有 `inline_ref` 修饰符的函数代码放在单独的cell中，每次调用该函数时，TVM 都会执行 `CALLREF` 命令。因此，它与 `inline` 类似，但因为cell可以在没有重复的情况下在多个地方重复使用，所以几乎总是更有效率地使用 `inline_ref` 修饰符而不是 `inline`，除非该函数确实只被调用一次。`inline_ref` 函数的递归调用仍然不可能，因为 TVM cell中没有循环引用。

```func
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

#### Inline_ref 修饰符(Inline_ref specifier)

例如，

#### method_id

是多重签名合约的 get 方法。

例如，

```func
(int, int) get_n_k() method_id {
  (_, int n, int k, _, _, _, _) = unpack_state();
  return (n, k);
}
```

是多重签名合约的 get 方法。

### 使用 forall 的多态性

例如，

```func
forall <comma_separated_type_variables_names> ->
```

是一个接受长度恰好为 2 的元组的函数，但组件中的值可以是任何（单个堆栈条目）类型，并将它们互换。

`pair_swap([2, 3])` 将产生 `[3, 2]`，而 `pair_swap([1, [2, 3, 4]])` 将产生 `[[2, 3, 4], 1]`。

```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```

另外，值得注意的是，`X` 和 `Y` 的类型宽度假定为 1；也就是说，`X` 或 `Y` 的值必须占据单个堆栈条目。因此，您实际上不能在类型为 `[(int, int), int]` 的元组上调用函数 `pair_swap`，因为类型 `(int, int)` 的宽度为 2，即它占据 2 个堆栈条目。

`pair_swap([2, 3])` 将产生 `[3, 2]`，而 `pair_swap([1, [2, 3, 4]])` 将产生 `[[2, 3, 4], 1]`。

如上所述，可以通过汇编代码定义函数。语法是 `asm` 关键字，后跟一个或多个表示为字符串的汇编命令。
例如，可以定义：

另外，值得注意的是，`X` 和 `Y` 的类型宽度假定为 1；也就是说，`X` 或 `Y` 的值必须占据单个堆栈条目。因此，您实际上不能在类型为 `[(int, int), int]` 的元组上调用函数 `pair_swap`，因为类型 `(int, int)` 的宽度为 2，即它占据 2 个堆栈条目。

## 汇编函数体定义

如上所述，可以通过汇编代码定义函数。语法是 `asm` 关键字，后跟一个或多个表示为字符串的汇编命令。
例如，可以定义：

```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```

– 一个递增整数然后取反的函数。对这个函数的调用将被转换为两个汇编命令 `INC` 和 `NEGATE`。定义该函数的另一种方式是：

```func
int inc_then_negate'(int x) asm "INC NEGATE";
```

在某些情况下，我们希望以与汇编函数所需的顺序不同的顺序传递参数，或/和以不同于命令返回的堆栈条目顺序获取结果。我们可以通过添加相应的堆栈原语来手动重新排列堆栈，但 FunC 可以自动完成此操作。

:::info
请注意，在手动重新排列的情况下，参数将按重新排列的顺序计算。要覆盖此行为，请使用 `#pragma compute-asm-ltr`：[compute-asm-ltr](compiler_directives#pragma-compute-asm-ltr)
:::

### 重新排列堆栈条目

在某些情况下，我们希望以与汇编函数所需的顺序不同的顺序传递参数，或/和以不同于命令返回的堆栈条目顺序获取结果。我们可以通过添加相应的堆栈原语来手动重新排列堆栈，但 FunC 可以自动完成此操作。

:::info
注意，在手动重新排列的情况下，参数将按重新排列的顺序计算。要覆盖这种行为，请使用 `#pragma compute-asm-ltr`：[compute-asm-ltr](/v3/documentation/smartcontracts/func/docs/compiler_directives#pragma-compute-asm-ltr)
:::

例如，假设汇编命令 STUXQ 接受一个整数、构建器和整数；然后返回构建器以及表示操作成功或失败的整数标志。
我们可以定义函数：

```func
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```

我们还可以像这样重新排列返回值：

```func
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```

数字对应于返回值的索引（0 是返回值中最深的堆栈条目）。

这些技术的组合也是可能的。

```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```

数字对应于返回值的索引（0 是返回值中最深的堆栈条目）。

多行汇编命令甚至 Fift 代码片段可以通过以 `"""` 开始和结束的多行字符串定义。

```func
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### 多行 asms

多行汇编命令甚至 Fift 代码片段可以通过以 `"""` 开始和结束的多行字符串定义。

```func
slice hello_world() asm """
  "Hello"
  " "
  "World"
  $+ $+ $>s
  PUSHSLICE
""";
```



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/global_variables.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/global_variables.md
================================================
# 全局变量

FunC 程序本质上是函数声明/定义和全局变量声明的列表。本节涵盖了第二个主题。

可以使用 `global` 关键字，后跟变量类型和变量名来声明全局变量。例如，

```func
global ((int, int) -> int) op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

是一个简单的程序，它将加法运算符 `_+_` 写入全局函数变量 `op`，并检查三个样本整数的加法关联性；2、3和9。。

在内部，全局变量存储在 TVM 的 c7 控制寄存器中。

可以省略全局变量的类型。如果省略，将根据变量的使用推断类型。例如，我们可以重写程序如下：

```func
global op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

可以在同一个 `global` 关键字后声明多个变量。以下代码等效：

```func
global int A;
global cell B;
global C;
```

```func
global int A, cell B, C;
```

不允许声明与已声明的全局变量同名的局部变量。例如，此代码将无法编译：

```func
global cell C;

int main() {
  int C = 3;
  return C;
}
```

请注意，以下代码是正确的：

```func
global int C;

int main() {
  int C = 3;
  return C;
}
```

但这里的 `int C = 3;` 等同于 `C = 3;`，即这是对全局变量 `C` 的赋值，而不是局部变量 `C` 的声明（您可以在[声明](/develop/func/statements#variable-declaration)中找到此效果的解释）。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/literals_identifiers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/literals_identifiers.md
================================================
# 字面量和标识符

## 数字字面量

FunC 支持十进制和十六进制整数字面量（允许前导零）。

例如，`0`、`123`、`-17`、`00987`、`0xef`、`0xEF`、`0x0`、`-0xfFAb`、`0x0001`、`-0`、`-0x0` 都是有效的数字字面量。

## 字符串字面量

FunC 中的字符串使用双引号 `"` 包裹，如 `"this is a string"`。不支持特殊符号如 `\n` 和多行字符串。
可选地，字符串字面量后可以指定类型，如 `"string"u`。

支持以下字符串类型：

- 无类型 —— 用于 asm 函数定义和通过 ASCII 字符串定义 slice 常量
- `s` —— 通过其内容（十六进制编码并可选地位填充）定义原始 slice 常量
- `a` —— 从指定地址创建包含 `MsgAddressInt` 结构的 slice 常量
- `u` —— 创建对应于提供的 ASCII 字符串的十六进制值的 int 常量
- `h` —— 创建字符串的 SHA256 哈希的前 32 位的 int 常量
- `H` —— 创建字符串的 SHA256 哈希的所有 256 位的 int 常量
- `c` —— 创建字符串的 crc32 值的 int 常量

例如，以下值会生成对应的常量：

- `"string"` 变成 `x{737472696e67}` slice 常量
- `"abcdef"s` 变成 `x{abcdef}` slice 常量
- `"Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a` 变成 `x{9FE6666666666666666666666666666666666666666666666666666666666666667_}` slice 常量（`addr_std$10 anycast:none$0 workchain_id:int8=0xFF address:bits256=0x33...33`）
- `"NstK"u` 变成 `0x4e73744b` int 常量
- `"transfer(slice, int)"h` 变成 `0x7a62e8a8` int 常量
- `"transfer(slice, int)"H` 变成 `0x7a62e8a8ebac41bd6de16c65e7be363bc2d2cbc6a0873778dead4795c13db979` int 常量
- `"transfer(slice, int)"c` 变成 `2235694568` int 常量

## 标识符

FunC 允许使用非常广泛的标识符类别（函数和变量名）。具体来说，任何不包含特殊符号 `;`、`,`、`(`、`)`、` `（空格或制表符）、`~` 和 `.`，不以注释或字符串字面量（以 `"` 开头）开始，不是数字字面量，不是下划线 `_`，也不是关键字的单行字符串都是有效的标识符（唯一的例外是，如果它以 `` ` `` 开头，则必须以相同的 `` ` `` 结尾，并且不能包含除这两个外的任何其他 `` ` ``）。

此外，函数定义中的函数名可以以 `.` 或 `~` 开头。

例如，以下是有效的标识符：

- `query`、`query'`、`query''`
- `elem0`、`elem1`、`elem2`
- `CHECK`
- `_internal_value`
- `message_found?`
- `get_pubkeys&signatures`
- `dict::udict_set_builder`
- `_+_`（标准加法运算符，类型为 `(int, int) -> int`，虽然已被定义）
- `fatal!`

变量名末尾的 `'` 通常用于表示某个旧值的修改版本。例如，几乎所有用于 hashmap 操作的内置修改原语（除了以 `~` 为前缀的原语）都会接收一个 hashmap 并返回新版本的 hashmap 及必要时的其他数据。将这些值命名为相同名称后加 `'` 很方便。

后缀 `?` 通常用于布尔变量（TVM 没有内置的 bool 类型；bools 由整数表示：0 为 false，-1 为 true）或返回某些标志位的函数，通常表示操作的成功（如 [stdlib.fc](/develop/func/stdlib) 中的 `udict_get?`）。

以下是无效的标识符：

- `take(first)Entry`
- `"not_a_string`
- `msg.sender`
- `send_message,then_terminate`
- `_`

一些不太常见的有效标识符示例：

- `123validname`
- `2+2=2*2`
- `-alsovalidname`
- `0xefefefhahaha`
- `{hehehe}`
- ``pa{--}in"`aaa`"``

这些也是无效的标识符：

- ``pa;;in"`aaa`"``（因为禁止使用 `;`）
- `{-aaa-}`
- `aa(bb`
- `123`（它是一个数字）

此外，FunC 有一种特殊类型的标识符，用反引号 `` ` `` 引用。
在引号内，任何符号都是允许的，除了 `\n` 和引号本身。

例如，`` `I'm a variable too` `` 是一个有效的标识符，`` `any symbols ; ~ () are allowed here...` `` 也是。

## 常量

FunC 允许定义编译时的常量，这些常量在编译期间被替换和预计算。

常量的定义格式为 `const optional-type identifier = value-or-expression;`

`optional-type` 可用于强制指定常量的特定类型，也用于更好的可读性。

目前，支持 `int` 和 `slice` 类型。

`value-or-expression` 可以是字面量或由字面量和常量组成的可预计算表达式。

例如，可以这样定义常量：

- `const int101 = 101;` 定义等同于数字字面量 `101` 的 `int101` 常量
- `const str1 = "const1", str2 = "aabbcc"s;` 定义两个等于其对应字符串的常量
- `const int int240 = ((int1 + int2) * 10) << 3;` 定义等于计算结果的 `int240` 常量
- `const slice str2r = str2;` 定义等于 `str2` 常量值的 `str2r` 常量

由于数字常量在编译期间被替换，所有在编译期间进行的优化和预计算都能成功执行（与旧方法通过内联 asm `PUSHINT` 定义常量不同）。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/statements.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/statements.md
================================================
# 语句

本节简要讨论构成普通函数体代码的 FunC 语句。

## 表达式语句

最常见的语句类型是表达式语句。它是一个表达式后跟 `;`。表达式的描述相当复杂，因此这里只提供一个概述。通常所有子表达式都是从左到右计算的，唯一的例外是[汇编堆栈重排](functions#rearranging-stack-entries)，它可能手动定义顺序。

### 变量声明

不可能声明一个局部变量而不定义其初始值。

以下是一些变量声明的示例：

```func
int x = 2;
var x = 2;
(int, int) p = (1, 2);
(int, var) p = (1, 2);
(int, int, int) (x, y, z) = (1, 2, 3);
(int x, int y, int z) = (1, 2, 3);
var (x, y, z) = (1, 2, 3);
(int x = 1, int y = 2, int z = 3);
[int, int, int] [x, y, z] = [1, 2, 3];
[int x, int y, int z] = [1, 2, 3];
var [x, y, z] = [1, 2, 3];
```

变量可以在同一作用域内“重新声明”。例如，以下是正确的代码：

```func
int x = 2;
int y = x + 1;
int x = 3;
```

事实上，`int x` 的第二次出现不是声明，而只是编译时确认 `x` 的类型为 `int`。因此第三行实际上等同于简单的赋值 `x = 3;`。

在嵌套作用域中，变量可以像在 C 语言中一样真正重新声明。例如，考虑以下代码：

```func
int x = 0;
int i = 0;
while (i < 10) {
  (int, int) x = (i, i + 1);
  ;; here x is a variable of type (int, int)
  i += 1;
}
;; here x is a (different) variable of type int
```

但如在全局变量[章节](/develop/func/global_variables.md)中提到的，不允许重新声明全局变量。

请注意，变量声明**是**表达式语句，因此像 `int x = 2` 这样的结构实际上是完整的表达式。例如，以下是正确的代码：

```func
int y = (int x = 3) + 1;
```

它声明了两个变量 `x` 和 `y`，分别等于 `3` 和 `4`。

#### 下划线

下划线 `_` 用于表示不需要的值。例如，假设函数 `foo` 的类型为 `int -> (int, int, int)`。我们可以获取第一个返回值并忽略第二个和第三个，如下所示：

```func
(int fst, _, _) = foo(42);
```

### 函数应用

函数调用看起来像在常规语言中那样。函数调用的参数在函数名之后列出，用逗号分隔。

```func
;; suppose foo has type (int, int, int) -> int
int x = foo(1, 2, 3);
```

但请注意，`foo` 实际上是**一个**参数类型为 `(int, int, int)` 的函数。为了看到区别，假设 `bar` 是类型为 `int -> (int, int, int)` 的函数。与常规语言不同，你可以这样组合函数：

```func
int x = foo(bar(42));
```

而不是类似但更长的形式：

```func
(int a, int b, int c) = bar(42);
int x = foo(a, b, c);
```

也可以进行 Haskell 类型的调用，但不总是可行（稍后修复）：

```func
;; suppose foo has type int -> int -> int -> int
;; i.e. it's carried
(int a, int b, int c) = (1, 2, 3);
int x = foo a b c; ;; ok
;; int y = foo 1 2 3; wouldn't compile
int y = foo (1) (2) (3); ;; ok
```

### Lambda 表达式

暂不支持 Lambda 表达式。

### 方法调用

#### 非修改方法

如果函数至少有一个参数，它可以作为非修改方法调用。例如，`store_uint` 的类型为 `(builder, int, int) -> builder`（第二个参数是要存储的值，第三个是位长度）。`begin_cell` 是创建新构建器的函数。以下代码是等价的：

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```

```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

因此，函数的第一个参数可以在函数名前传递给它，如果用 `.` 分隔。代码可以进一步简化：

```func
builder b = begin_cell().store_uint(239, 8);
```

也可以进行多次方法调用：

```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### 修改方法

如果函数的第一个参数的类型为 `A`，并且函数的返回值的形状为 `(A, B)`，其中 `B` 是某种任意类型，那么该函数可以作为修改方法调用。修改方法调用可以接受一些参数并返回一些值，但它们会修改其第一个参数，即将返回值的第一个组件赋值给第一个参数的变量。例如，假设 `cs` 是一个cell slice ，`load_uint` 的类型为 `(slice, int) -> (slice, int)`：它接受一个cell slice 和要加载的位数，并返回 slice 的剩余部分和加载的值。以下代码是等价的：

```func
(cs, int x) = load_uint(cs, 8);
```

```func
(cs, int x) = cs.load_uint(8);
```

```func
int x = cs~load_uint(8);
```

在某些情况下，我们希望将不返回任何值且只修改第一个参数的函数用作修改方法。可以使用cell类型如下操作：假设我们想定义类型为 `int -> int` 的函数 `inc`，它用于递增整数，并将其用作修改方法。然后我们应该将 `inc` 定义为类型为 `int -> (int, ())` 的函数：

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

像这样定义时，它可以用作修改方法。以下将递增 `x`。

```func
x~inc();
```

#### 函数名中的 `.` 和 `~`

假设我们也想将 `inc` 用作非修改方法。我们可以写类似以下内容：

```func
(int y, _) = inc(x);
```

但可以覆盖 `inc` 作为修改方法的定义。

```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```

然后这样调用它：

```func
x~inc();
int y = inc(x);
int z = x.inc();
```

第一次调用将修改 x；第二次和第三次调用不会。

总结一下，当以非修改或修改方法（即使用 `.foo` 或 `~foo` 语法）调用名为 `foo` 的函数时，如果存在 `.foo` 或 `~foo` 的定义，FunC 编译器将分别使用 `.foo` 或 `~foo` 的定义，如果没有，则使用 `foo` 的定义。

### 运算符

请注意，目前所有的一元和二元运算符都是整数运算符。逻辑运算符表示为位整数运算符（参见[没有布尔类型](/develop/func/types#absence-of-boolean-type)）。

#### 一元运算符

有两个一元运算符：

- `~` 是按位非（优先级 75）
- `-` 是整数取反（优先级 20）

它们应该与参数分开：

- `- x` 是可以的。
- `-x` 不可以（它是单个标识符）

#### 二元运算符

优先级为 30（左结合性）：

- `*` 是整数乘法
- `/` 是整数除法（向下取整）
- `~/` 是整数除法（四舍五入）
- `^/` 是整数除法（向上取整）
- `%` 是整数取模运算（向下取整）
- `~%` 是整数取模运算（四舍五入）
- `^%` 是整数取模运算（向上取整）
- `/%` 返回商和余数
- `&` 是按位与

优先级为 20（左结合性）：

- `+` 是整数加法
- `-` 是整数减法
- `|` 是按位或
- `^` 是按位异或

优先级为 17（左结合性）：

- `<<` 是按位左移
- `>>` 是按位右移
- `~>>` 是按位右移（四舍五入）
- `^>>` 是按位右移（向上取整）

优先级为 15（左结合性）：

- `==` 是整数等值检查
- `!=` 是整数不等检查
- `<` 是整数比较
- `<=` 是整数比较
- `>` 是整数比较
- `>=` 是整数比较
- `<=>` 是整数比较（返回 -1、0 或 1）

它们也应该与参数分开：

- `x + y` 是可以的
- `x+y` 不可以（它是单个标识符）

#### 条件运算符

它具有通常的语法。

```func
<condition> ? <consequence> : <alternative>
```

例如：

```func
x > 0 ? x * fac(x - 1) : 1;
```

优先级为 13。

#### 赋值

优先级 10。

简单赋值 `=` 以及二元运算的对应项：`+=`、`-=`、`*=`、`/=`、`~/=`、`^/=`、`%=`、`~%=`、`^%=`、`<<=`、`>>=`、`~>>=`、`^>>=`、`&=`、`|=`、`^=`。

## 循环

FunC 支持 `repeat`、`while` 和 `do { ... } until` 循环。不支持 `for` 循环。

### Repeat 循环

语法是 `repeat` 关键字后跟一个类型为 `int` 的表达式。指定次数重复代码。示例：

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

```func
int x = 1, y = 10;
repeat(y + 6) {
  x *= 2;
}
;; x = 65536
```

```func
int x = 1;
repeat(-1) {
  x *= 2;
}
;; x = 1
```

如果次数小于 `-2^31` 或大于 `2^31 - 1`，将抛出范围检查异常。

### While 循环

具有通常的语法。示例：

```func
int x = 2;
while (x < 100) {
  x = x * x;
}
;; x = 256
```

请注意，条件 `x < 100` 的真值是类型为 `int` 的（参见[没有布尔类型](/develop/func/types#absence-of-boolean-type)）。

### Until 循环

具有以下语法：

```func
int x = 0;
do {
  x += 3;
} until (x % 17 == 0);
;; x = 51
```

## If 语句

示例：

```func
;; usual if
if (flag) {
  do_something();
}
```

```func
;; equivalent to if (~ flag)
ifnot (flag) {
  do_something();
}
```

```func
;; usual if-else
if (flag) {
  do_something();
}
else {
  do_alternative();
}
```

```func
;; Some specific features
if (flag1) {
  do_something1();
} else {
  do_alternative4();
}
```

花括号是必需的。以下代码将无法编译：

```func
if (flag1)
  do_something();
```

## Try-Catch 语句

*自 func v0.4.0 起可用*

执行 `try` 块中的代码。如果失败，完全回滚在 `try` 块中所做的更改，并执行 `catch` 块；`catch` 接收两个参数：任何类型的异常参数（`x`）和错误代码（`n`，整数）。

与许多其他语言不同，在 FunC 的 try-catch 语句中，try 块中所做的更改，特别是局部和全局变量的修改，所有寄存器的更改（即 `c4` 存储寄存器、`c5` 操作/消息寄存器、`c7` 上下文寄存器等）**被丢弃**，如果 try 块中有错误，因此所有合约存储更新和消息发送将被撤销。需要注意的是，一些 TVM 状态参数，如 *codepage* 和gas计数器不会回滚。这意味着，尤其是，try 块中花费的所有gas将被计入，以及改变gas限制的操作（`accept_message` 和 `set_gas_limit`）的效果将被保留。

请注意，异常参数可以是任何类型（可能在不同异常情况下不同），因此 funC 无法在编译时预测它。这意味着开发者需要通过将异常参数转换为某种类型来“帮助”编译器（请参见下面的示例 2）：

示例：

```func
try {
  do_something();
} catch (x, n) {
  handle_exception();
}
```

```func
forall X -> int cast_to_int(X x) asm "NOP";
...
try {
  throw_arg(-1, 100);
} catch (x, n) {
  x.cast_to_int();
  ;; x = -1, n = 100
  return x + 1;
}
```

```func
int x = 0;
try {
  x += 1;
  throw(100);
} catch (_, _) {
}
;; x = 0 (not 1)
```

## 区块语句

也允许使用区块语句。它们打开一个新的嵌套作用域：

```func
int x = 1;
builder b = begin_cell();
{
  builder x = begin_cell().store_uint(0, 8);
  b = x;
}
x += 1;
```



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/stdlib.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/stdlib.mdx
================================================
---
toc_min_heading_level: 2
toc_max_heading_level: 6
---

# FunC 标准库

:::info
本节讨论了 [stdlib.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) 库，它包含了在 FunC 中使用的标准函数。
:::

目前，该库只是最常用的 TVM 命令的汇编器的包装，这些命令不是内置的。库中使用的每个 TVM 命令的描述都可以在 [TVM 文档](/learn/tvm-instructions/tvm-overview)部分找到。本文档也借用了一些描述。

文件中的一些函数被注释掉了。这意味着它们已经成为了优化目的的内置函数。然而，类型签名和语义保持不变。

请注意，stdlib 中没有呈现一些不太常见的命令。总有一天它们也会被添加。

## 元组操作原语

名称和类型大多是自解释的。有关多态函数的更多信息，请参见 [多态性与 forall](/develop/func/functions#polymorphism-with-forall)。

请注意，目前原子类型 `tuple` 的值不能转换为复合元组类型（例如 `[int, cell]`），反之亦然。

### Lisp 类型列表

列表可以表示为嵌套的 2 元组。空列表通常表示为 TVM `null` 值（可以通过调用 `null()` 获得）。例如，元组 `(1, (2, (3, null)))` 表示列表 `[1, 2, 3]`。列表的元素可以是不同类型。

#### cons

```func
forall X -> tuple cons(X head, tuple tail) asm "CONS";
```

在 Lisp 类型列表的开头添加一个元素。

#### uncons

```func
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
```

提取 Lisp 类型列表的头和尾。

#### list_next

```func
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
```

提取 Lisp 类型列表的头和尾。可用作 [(非)修改方法](/develop/func/statements#methods-calls)。

```func
() foo(tuple xs) {
    (_, int x) = xs.list_next(); ;; get the first element, `_` means do not use tail list
    int y = xs~list_next(); ;; pop the first element
    int z = xs~list_next(); ;; pop the second element
}
```

#### car

```func
forall X -> X car(tuple list) asm "CAR";
```

返回 Lisp 类型列表的头部。

#### cdr

```func
tuple cdr(tuple list) asm "CDR";
```

返回 Lisp 类型列表的尾部。

### 其他元组原语

#### empty_tuple

```func
tuple empty_tuple() asm "NIL";
```

创建 0 元素元组。

#### tpush

```func
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
```

将值 `x` 追加到 `Tuple t = (x1, ..., xn)`，但只有在结果 `Tuple t' = (x1, ..., xn, x)` 不超过 255 个字符时才有效。否则，会抛出类型检查异常。

#### single

```func
forall X -> [X] single(X x) asm "SINGLE";
```

创建单例，即长度为一的元组。

#### unsingle

```func
forall X -> X unsingle([X] t) asm "UNSINGLE";
```

解包单例。

#### pair

```func
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
```

创建一对。

#### unpair

```func
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
```

解包一对。

#### triple

```func
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
```

创建三元组。

#### untriple

```func
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
```

解包三元组。

#### tuple4

```func
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
```

创建四元组。

#### untuple4

```func
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
```

解包四元组。

#### first

```func
forall X -> X first(tuple t) asm "FIRST";
```

返回元组的第一个元素。

#### second

```func
forall X -> X second(tuple t) asm "SECOND";
```

返回元组的第二个元素。

#### third

```func
forall X -> X third(tuple t) asm "THIRD";
```

返回元组的第三个元素。

#### fourth

```func
forall X -> X fourth(tuple t) asm "3 INDEX";
```

返回元组的第四个元素。

#### pair_first

```func
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
```

返回一对的第一个元素。

#### pair_second

```func
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
```

返回一对的第二个元素。

#### triple_first

```func
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
```

返回三元组的第一个元素。

#### triple_second

```func
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
```

返回三元组的第二个元素。

#### triple_third

```func
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
```

返回三元组的第三个元素。

## 特定领域原语

### 从 c7 提取信息

关于智能合约调用的一些有用信息可以在 [c7 特殊寄存器](/learn/tvm-instructions/tvm-overview#control-registers)中找到。这些原语用于方便地提取数据。

#### now

```func
int now() asm "NOW";
```

返回当前 Unix 时间作为整数。

#### my_address

```func
slice my_address() asm "MYADDR";
```

以 Slice 形式返回当前智能合约的内部地址，其中包含 `MsgAddressInt`。如果需要，可以进一步使用诸如 `parse_std_addr` 之类的原语进行解析。

#### get_balance

```func
[int, cell] get_balance() asm "BALANCE";
```

以 `tuple` 形式返回智能合约的剩余余额，其中包括 `int`（剩余余额，以nanoton计）和 `cell`（一个包含 32 位键的字典，代表“额外代币”的余额）。注意，RAW 原语（如 `send_raw_message`）不会更新此字段。

#### cur_lt

```func
int cur_lt() asm "LTIME";
```

返回当前交易的逻辑时间。

#### block_lt

```func
int block_lt() asm "BLOCKLT";
```

返回当前区块的起始逻辑时间。

#### config_param

```func
cell config_param(int x) asm "CONFIGOPTPARAM";
```

以 `cell` 或 `null` 值的形式返回全局配置参数的值，其中整数索引为 `i`。

### 哈希

#### cell_hash

```func
int cell_hash(cell c) asm "HASHCU";
```

计算`cell c`的 representation hash ，并将其作为一个256位无符号整数`x`返回。用于签名和检查由cell树表示的任意实体的签名。

#### slice_hash

```func
int slice_hash(slice s) asm "HASHSU";
```

计算`slice s`的哈希，并将其作为一个256位无符号整数`x`返回。结果与创建一个只包含`s`的数据和引用的普通cell，并通过`cell_hash`计算其哈希的情况相同。

#### string_hash

```func
int string_hash(slice s) asm "SHA256U";
```

计算`slice s`数据位的sha256。如果`s`的位长度不能被八整除，则抛出一个cell下溢异常。哈希值作为一个256位无符号整数`x`返回。

### 签名检查

#### check_signature

```func
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
```

使用`public_key`（也表示为一个256位无符号整数）检查`hash`（通常作为某些数据的哈希计算得出的256位无符号整数）的Ed25519 `signature`。签名必须包含至少512个数据位；只使用前512位。如果签名有效，结果为`-1`；否则，为`0`。请注意，`CHKSIGNU`创建一个包含哈希的256位 slice ，并调用`CHKSIGNS`。也就是说，如果`hash`是作为某些数据的哈希计算的，这些数据会被_两次_哈希，第二次哈希发生在`CHKSIGNS`内部。

#### check_data_signature

```func
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";
```

检查`signature`是否是使用`public_key`的`slice data`数据部分的有效Ed25519签名，类似于`check_signature`。如果`data`的位长度不能被八整除，则抛出一个cell下溢异常。Ed25519签名的验证是标准的，使用sha256将`data`简化为实际签名的256位数字。

### 计算boc大小

下面的原语可能对于计算用户提供数据的存储费用有用。

#### compute_data_size?

```func
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
```

返回`(x, y, z, -1)`或`(null, null, null, 0)`。递归地计算以`cell c`为根的DAG中不同cell的数量`x`、数据位`y`和cell引用`z`，有效地返回此DAG使用的总存储量，同时考虑到相等cell的识别。`x`、`y`和`z`的值通过对此DAG进行深度优先遍历来计算，并使用访问过的cell哈希的哈希表来防止已访问cell的重复访问。访问的cell总数`x`不能超过非负的`max_cells`；否则，在访问第`(max_cells + 1)`个cell之前，计算将被中止，并返回零标志以指示失败。如果`c`为`null`，则返回`x = y = z = 0`。

#### slice_compute_data_size?

```func
(int, int, int, int) slice_compute_data_size?(slice s, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
```

类似于`compute_data_size?`，但接受的是`slice s`而不是`cell`。返回的`x`值不考
虑包含 slice `s`本身的cell；然而，`s`的数据位和cell引用在`y`和`z`中要被考虑。

#### compute_data_size

```func
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
```

`compute_data_size?`的非静默版本，失败时抛出cell溢出异常（8）。

#### slice_compute_data_size

```func
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
```

`slice_compute_data_size?`的非静默版本，失败时抛出cell溢出异常（8）。

### 持久存储保存和加载

#### get_data

```func
cell get_data() asm "c4 PUSH";
```

返回持久化合约存储cell。稍后可以使用 slice 和构建器原语对其进行解析或修改。

#### set_data

```func
() set_data(cell c) impure asm "c4 POP";
```

将cell`c`设置为持久化合约数据。您可以使用这个原语更新持久化合约存储。

### Continuation 原语

#### get_c3

```func
cont get_c3() impure asm "c3 PUSH";
```

通常`c3`有一个由合约的整个代码初始化的continuation。它用于函数调用。原语返回`c3`的当前值。

#### set_c3

```func
() set_c3(cont c) impure asm "c3 POP";
```

更新`c3`的当前值。通常，它用于实时更新智能合约代码。请注意，在执行此原语之后，当前代码（以及递归函数调用堆栈）不会改变，但任何其他函数调用将使用新代码中的函数。

#### bless

```func
cont bless(slice s) impure asm "BLESS";
```

将`slice s`转换为一个简单的普通 continuation `c`，其中`c.code = s`，堆栈和保存列表为空。

### 与 gas 相关的原语

#### accept_message

```func
() accept_message() impure asm "ACCEPT";
```

将当前 gas 限制`gl`设置为其允许的最大值`gm`，并将 gas 信用`gc`重置为零，同时减少`gr`的值`gc`。换句话说，当前智能合约同意购买一些 gas 以完成当前交易。这个动作是处理不携带价值（因此不含 gas ）的外部消息所必需的。

有关更多详细信息，请查看[accept_message effects](/develop/smart-contracts/guidelines/accept)

#### set_gas_limit

```func
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
```

将当前 gas 限制`gl`设置为`limit`和`gm`的最小值，并将 gas 信用`gc`重置为零。此时，如果消耗的 gas 量（包括当前指令）超过`gl`的结果值，则在设置新 gas 限制之前会抛出（未处理的） gas 不足异常。请注意，带有`limit ≥ 2^63 − 1`参数的`set_gas_limit`等同于`accept_message`。

有关更多详细信息，请查看[accept_message effects](/develop/smart-contracts/guidelines/accept)

#### commit

```func
() commit() impure asm "COMMIT";
```

提交寄存器`c4`（“持久数据”）和`c5`（“动作”）的当前状态，以便即使稍后抛出异常，当前执行也被视为“成功”，并保存这些值。

#### buy_gas

```func
() buy_gas(int gram) impure asm "BUYGAS";
```

:::caution
`BUYGAS`操作码目前尚未实现
:::

计算可以用`gram`nanoton币购买的gas 量，并以与`set_gas_limit`相同的方式相应地设置`gl`。

### 动作原语

#### raw_reserve

```func
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
```

创建一个输出动作，该动作将准确地预留`amount` nanoton 币（如果`mode = 0`），最多`amount` nanoton 币（如果`mode = 2`），或除`amount` nanoton 币以外的所有 nanoton 币（如果`mode = 1`或`mode = 3`）从账户的剩余余额中。它大致等同于创建一个携带`amount` nanoton 币（或`b − amount` nanoton 币，其中`b`是剩余余额）的出站消息发送给自己，这样随后的输出动作就不会花费超过剩余部分的金额。`mode`中的+2位意味着外部动作在无法预留指定金额时不会失败；相反，将预留所有剩余余额。`mode`中的+8位意味着`amount <- -amount`在进行任何进一步的动作之前。`mode`中的+4位意味着在进行任何其他检查和动作之前，`amount`会增加当前账户的原始余额（在 Compute Phase 之前），包括所有额外代币。目前，`amount`必须是非负整数，`mode`必须在`0..15`范围内。

#### raw_reserve_extra

```func
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
```

类似于`raw_reserve`，但还接受一个由`cell`或`null`表示的额外代币字典`extra_amount`。这样，除了Toncoin以外的其他代币也可以被预留。

#### send_raw_message

```func
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
```

发送包含在`msg`中的原始消息，它应该包含一个正确序列化的消息对象X，唯一的例外是源地址可以有一个虚拟值`addr_none`（自动替换为当前智能合约地址），以及`ihr_fee`、`fwd_fee`、`created_lt`和`created_at`字段可以有任意值（在当前交易的 Action Phase 期间用正确的值重写）。整数参数`mode`包含标志。

目前有3种消息Modes和3种消息Flags。您可以将单一Mode与多个（也许没有）标志组合以获得所需的`mode`。组合只是意味着获取它们值的总和。下面给出了Modes和Flags的描述表格。

| Mode  | 描述                             |
| :---- | :----------------------------- |
| `0`   | 普通消息                           |
| `64`  | 除了最初在新消息中指示的值之外，还携带入站消息的所有剩余价值 |
| `128` | 携带当前智能合约的所有剩余余额，而不是最初在消息中指示的值  |

| Flag  | 描述                                               |
| :---- | :----------------------------------------------- |
| `+1`  | 单独支付消息价值之外的转移费用                                  |
| `+2`  | 忽略在 Action Phase 处理此消息时出现的任何错误                   |
| `+16` | 在动作失败的情况下 - 弹回交易。如果使用`+2`，则无效。                   |
| `+32` | 如果当前账户的最终余额为零，则必须销毁该账户（通常与模式128一起使用）             |

:::info +2 flag

1. Toncoins 不足：
   - 没有足够的值与报文一起传输（所有输入的报文值都已消耗）。
   - 处理信息的资金不足。
   - 信息的价值不足以支付转发费用。
   - 没有足够的额外货币来发送信息。
   - 没有足够的资金支付对外信息。
2. 信息过大（请查看 [Message size](/v3/documentation/smart-contracts/message-management/sending-messages#message-size)，了解更多信息）。
3. 信息的 Merkle 深度太大。

但在以下情况下，它不会忽略错误：

1. 报文格式无效。
2. 信息模式包括 64 和 128 两种模式。
3. 出站报文的 StateInit 库无效。
4. 外部报文不是普通报文，或包含 +16 或 +32 标志，或两者兼有。
   :::

:::warning

1. **+16 标志** - 不要在外部报文（如发给钱包的报文）中使用，因为没有发件人接收被退回的报文。
2. **+2 标志** - 这在外部消息（例如，发送到钱包）中非常重要。
   :::

伪随机数生成器使用随机种子（一个无符号的256位整数）和（有时）[c7](/learn/tvm-instructions/tvm-overview#control-registers)中保存的其他数据。在TON区块链中执行智能合约之前，随机种子的初始值是智能合约地址和全局区块随机种子的哈希。如果在一个区块内有多次运行相同的智能合约，那么所有这些运行都将具有相同的随机种子。例如，可以通过在第一次使用伪随机数生成器之前运行`randomize_lt`来解决这个问题。

#### set_code

```func
() set_code(cell new_code) impure asm "SETCODE";
```

创建一个输出操作，将此智能合约代码更改为 cell  `new_code` 给出的代码。请注意，只有在成功终止智能合约的当前运行后，该更改才会生效。(参见 [set_c3](/v3/documentation/smart-contracts/func/docs/stdlib#set_c3))

### 随机数发生器基元

生成一个新的伪随机无符号256位整数`x`。算法如下：如果`r`是旧的随机种子值，被视为一个32字节的数组（通过构造一个无符号256位整数的大端表示），那么计算其`sha512(r)`；这个哈希的前32字节被存储为随机种子的新值`r'`，剩余的32字节作为下一个随机值`x`返回。

:::caution
Keep in mind that random numbers generated by the functions below can be predicted if you do not use additional tricks.

- [随机数生成](/v3/guidelines/smart-contracts/security/random-number-generation)

:::

#### get_seed

```func
int random() impure asm "RANDU256";
```

以一个无符号的256位整数返回当前随机种子。

#### set_seed

```func
int rand(int range) impure asm "RAND";
```

将随机种子设置为一个无符号的256位`seed`。

#### randomize

```func
int get_seed() impure asm "RANDSEED";
```

通过将随机种子设置为两个32字节字符串的串联的sha256来将一个无符号的256位整数`x`混合到随机种子`r`中，这两个32字节字符串：第一个包含旧种子`r`的大端表示，第二个包含`x`的大端表示。

#### randomize_lt

```func
int set_seed(int seed) impure asm "SETRAND";
```

相当于`randomize(cur_lt());`。

#### 地址操作原语

```func
() randomize(int x) impure asm "ADDRAND";
```

将无符号 256 位整数 `x` 混合到随机种子 `r` 中，方法是将随机种子设置为两个 32 字节字符串连接的 sha256：第一个字符串是旧种子 `r` 的大二进制表示，第二个字符串是 `x` 的大二进制表示。

#### randomize_lt

```func
() randomize_lt() impure asm "LTIME" "ADDRAND";
```

等价于 `randomize(cur_lt());`。

### 地址操作基元

从 `slice s` 加载唯一有效的 `MsgAddress` 前缀，并返回此前缀 `s'` 及 `s` 的其余部分 `s''` 作为 slice 。

```func
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

反序列化后的 `MsgAddress` 由元组 `t` 表示，如下所示：

- `addr_none` 用 `t = (0)` 表示，即一个元组恰好包含
  一个等于零的整数
- `addr_extern` 表示为 `t = (1, s)`，其中片段 `s` 包含
  字段 `external_address`。换句话说，`t` 是一对（由两个条目组成的元组），包含一个等于 1 的整数和片段 `s`。
- `addr_std` 表示为 `t = (2, u, x, s)`，其中 `u` 为 `null` （如果不存在 `anycast` ）或包含 `rewrite_pfx` 的片段 `s'` （如果存在 `anycast` ）。接下来，整数 `x` 是 `workchain_id` ，片段 `s` 包含地址
- `addr_var` 用 `t = (3，u，x，s)` 表示，其中 `u`、`x` 和 `s` 的含义与 `addr_std `相同。

#### parse_std_addr

```func
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
```

解析包含有效 `MsgAddressInt`（通常为 `msg_addr_std`）的 slice  `s`，将重写 `anycast`（如果存在）应用到地址相同长度前缀，并返回工作链和256位地址作为整数。如果地址不是256位，或者 `s` 不是 `MsgAddressInt` 的有效序列化，抛出cell `deserialization` 异常。

#### parse_var_addr

```func
tuple parse_addr(slice s) asm "PARSEMSGADDR";
```

`parse_std_addr` 的变体，即使地址不是正好256位长（由 `msg_addr_var` 表示），也以 slice  `s` 返回（重写后的）地址。

#### 调试原语

```func
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
```

解析包含有效的 `MsgAddressInt`（通常为 `msg_addr_std`）的片段 `s`，将 `anycast` （如果存在）重写应用于地址的同长度前缀，然后以整数形式返回工作链和 256 位地址。如果地址不是 256 位或 `s` 不是 `MsgAddressInt` 的有效序列化，则会抛出 cell  `反序列化`异常。

#### parse_var_addr

```func
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";
```

`parse_std_addr` 的一个变体，以片段 `s` 的形式返回（重写的）地址，即使它不是精确的 256 位长（由 `msg_addr_var` 表示）。

## 调试原语

据说，如果原语仅返回数据，则称其为_预加载_数据（可用作[非修改方法](/develop/func/statements#non-modifying-methods)）。

#### ~dump

```func
forall X -> () ~dump(X value) impure asm "s0 DUMP";
```

输出一个值。多个值可以作为一个元组转储，例如`~dump([v1, v2, v3])`。

#### ~strdump

```func
() ~strdump(slice str) impure asm "STRDUMP";
```

转存字符串。 slice 参数位长必须能被 8 整除。

#### dump_stack

```func
() dump_stack() impure asm "DUMPSTK";
```

转出堆栈（最多转出顶部 255 个值）并显示堆栈总深度。

##  slice 基元

如果一个基元返回数据和片段的剩余部分（因此也可用作[修改方法](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)），那么就可以说它 _加载_ 了某些数据。

如果一个基元只返回某些数据，那么就可以说它 _预加载_ 了这些数据（它可以用作[非修改方法](/v3/documentation/smart-contracts/func/docs/statements#non-modifying-methods)）。

从 slice 中预加载第一个引用。

#### load_int

```func
slice begin_parse(cell c) asm "CTOS";
```

从 slice 中加载一个有符号的 `len` 位整数。

#### load_uint

```func
() end_parse(slice s) impure asm "ENDS";
```

从 slice 中加载一个无符号的 `len` 位整数。

#### preload_int

```func
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
```

从 slice 中预加载一个有符号的 `len` 位整数。

#### preload_uint

```func
cell preload_ref(slice s) asm "PLDREF";
```

从 slice 中预加载一个无符号的 `len` 位整数。

#### load_bits

```func
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
```

从 slice  `s` 中加载前 `0 ≤ len ≤ 1023` 位到一个单独的 slice  `s''`。

#### preload_bits

```func
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
```

从 slice  `s` 中预加载前 `0 ≤ len ≤ 1023` 位到一个单独的 slice  `s''`。

#### load_coins

```func
;; int preload_int(slice s, int len) asm "PLDIX";
```

加载序列化的 Toncoins 数量（任何最高为 `2^120 - 1` 的无符号整数）。

#### skip_bits

```func
;; int preload_uint(slice s, int len) asm "PLDUX";
```

返回 `s` 的前 `0 ≤ len ≤ 1023` 位以外的所有值。

#### first_bits

```func
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
```

返回 `s` 的前 `0 ≤ len ≤ 1023` 位。

#### skip_last_bits

```func
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
```

返回 `s` 中除最后 `0 ≤ len ≤ 1023` 位之外的所有值。

#### slice_last

```func
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";
```

返回 `s` 的最后 `0 ≤ len ≤ 1023` 位。

#### load_dict

```func
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
```

从 slice  `s` 中加载字典 `D`。可应用于字典或任意 `Maybe ^Y` 类型的值（如果使用 `nothing` 构造器，则返回 `null`）。

#### preload_dict

```func
slice first_bits(slice s, int len) asm "SDCUTFIRST";
```

从 slice  `s` 中预加载字典 `D`。

#### skip_dict

```func
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
```

像 `load_dict` 一样加载字典，但只返回 slice 的其余部分。

####  slice 大小原语

```func
slice slice_last(slice s, int len) asm "SDCUTLAST";
```

返回 `s` 的最后 `0 ≤ len ≤ 1023` 位。

#### load_dict

```func
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
```

从片段 `s` 中加载字典 `D`。可用于字典或任意 `Maybe ^Y` 类型的值（如果使用了 `nothing` 构造函数，则返回 `null`）。

#### preload_dict

```func
cell preload_dict(slice s) asm "PLDDICT";
```

从片段 `s` 中预载字典 `D`。

#### skip_dict

```func
slice skip_dict(slice s) asm "SKIPDICT";
```

像 `load_dict` 一样加载字典，但只返回片段的剩余部分。

###  slice 尺寸基元

#### slice_data_empty?

```func
int slice_refs(slice s) asm "SREFS";
```

检查 slice  `s` 是否没有数据位。

#### slice_refs_empty?

```func
int slice_bits(slice s) asm "SBITS";
```

检查 slice  `s` 是否没有引用。

#### slice_depth

```func
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
```

返回 slice  `s` 的深度。如果 `s` 没有引用，则返回 `0`；否则，返回值是 `s` 中引用的 cell 的深度最大值加一。

#### 构建器原语

```func
int slice_empty?(slice s) asm "SEMPTY";
```

下面列出的所有原语首先检查构建器中是否有足够的空间，然后是被序列化值的范围。

#### begin_cell

```func
int slice_data_empty?(slice s) asm "SDEMPTY";
```

创建一个新的空 `builder`。

#### end_cell

```func
int slice_refs_empty?(slice s) asm "SREMPTY";
```

将 `builder` 转换为普通的 `cell`。

#### store_ref

```func
int slice_depth(slice s) asm "SDEPTH";
```

将对 cell  `c` 的引用存储到构建器 `b` 中。

## store_uint

如果一个基元返回的构建器 `b` 的修改版本中，`b` 的末尾存储了值 `x`，那么这个基元就可以说是在构建器 `b` 中存储了值 `x`。它可以作为[非修改方法](/v3/documentation/smart-contracts/func/docs/statements#non-modifying-methods)使用。

将无符号的 `len` 位整数 `x` 存储到 `b` 中，`0 ≤ len ≤ 256`。

#### store_int

```func
builder begin_cell() asm "NEWC";
```

将有符号的 `len` 位整数 `x` 存储到 `b` 中，`0 ≤ len ≤ 257`。

#### store_slice

```func
cell end_cell(builder b) asm "ENDC";
```

将 slice  `s` 存储到构建器 `b` 中。

#### store_grams

```func
builder store_ref(builder b, cell c) asm(c b) "STREF";
```

将 cell  `c` 的引用存储到构造函数 `b`。

#### store_uint

```func
builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
```

这是存储 Toncoins 的最常见方法。

#### store_dict

```func
builder store_int(builder b, int x, int len) asm(x b len) "STIX";
```

将由 cell `c` 或 `null` 表示的字典 `D` 存储到构建器 `b` 中。换句话说，如果 `c` 不是 `null`，则存储1位和对 `c` 的引用；否则存储0位。

#### store_maybe_ref

```func
builder store_slice(builder b, slice s) asm "STSLICER";
```

等同于 `store_dict`。

#### 构建器大小原语

```func
builder store_grams(builder b, int x) asm "STGRAMS";
```

#### store_coins

```func
builder store_coins(builder b, int x) asm "STGRAMS";
```

将范围为 `0..2^120 - 1` 的整数 `x` 存储（序列化）到生成器 `b` 中。`x` 的序列化由一个 4 位无符号大端整数 `l`（即 `x < 2^8l` 的最小整数 `l ≥ 0`）和一个 `x` 的 `8l` 位无符号大端表示组成。如果 `x` 不属于支持的范围，将产生范围检查异常。

这是储存Toncoins的最常见方式。

#### store_dict

```func
builder store_dict(builder b, cell c) asm(c b) "STDICT";
```

将 cell  `c` 或 `null` 所代表的字典 `D` 存储到构造函数 `b`。换句话说，如果 `c` 不是 `null` 则存储 `1` 位和对 `c` 的引用，否则存储 `0` 位。

#### store_maybe_ref

```func
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";
```

等同于 `store_dict`。

### 生成器尺寸基元

#### builder_refs

```func
int builder_refs(builder b) asm "BREFS";
```

返回已存储在构建器 `b` 中的 cell 引用的数量。

#### builder_bits

```func
int builder_bits(builder b) asm "BBITS";
```

返回已存储在构建器 `b` 中的数据位的数量。

#### builder_depth

```func
int builder_depth(builder b) asm "BDEPTH";
```

在 FunC 中，字典也由 `cell` 类型表示，隐含假设它可能是 `null` 值。字典没有不同键长或值类型的单独类型（毕竟，这是 FunC，不是 FunC++）。

## 分类说明

#### cell_depth

```func
int cell_depth(cell c) asm "CDEPTH";
```

标题中使用了空前缀。

#### cell_null?

```func
int cell_null?(cell c) asm "ISNULL";
```

字典中的值可以直接存储为内部字典 cell 的子 slice ，也可以作为对单独 cell 的引用存储。在第一种情况下，不能保证一个足够小以适应 cell 格的值也将适应字典 ，则适合字典（因为内部 cell 的一部分可能已经被对应键的一部分占用）。另一方面，第二种存储方式的 gas 效率较低。使用第二种方法存储一个值等同于在第一种方法中插入一个没有数据位的 slice 和一个对该值的单一引用。

## dict_set

:::caution
下面的字典原语是低级的，不会检查所应用的 cell 结构是否与操作签名相匹配。将字典操作应用于 "非字典"，或将与一种键长/符号相对应的操作应用于具有不同种类键的字典，例如同时向一个字典写入具有 8 位有符号键和 7 位无符号键的键值，都是**未定义行为**。在这种情况下，通常会出现异常，但在极少数情况下，可能会写入/读取错误的值。强烈建议开发人员避免使用此类代码。
:::

在字典 `dict` 中设置与 `key_len` 位键 `index` 关联的值 `value`（一个 slice ），并返回结果字典。

> 字典作为 TVM 堆栈值有两种不同的表示方法：
>
> - slice `s` 的序列化类型为 `HashmapE(n, X)` 的 TL-B 值。换句话说，`s` 包含一个等于零的比特（如果字典为空），或者一个等于一的比特和对包含二叉树根的 cell 的引用，即`Hashmap(n, X)`类型的序列化值。
> - 一个 "Maybe  cell" `c^?`，即一个 cell 值（包含一个类型为`Hashmap(n, X)`的序列化值）或一个`null`（对应于一个空字典，参见 [null values](/v3/documentation/smart-contracts/funcs/docs/types#null-values)）。当使用 "Maybe  cell " `c^?` 来表示字典时，我们通常用`D`来表示。
>
> 下面列出的大多数字典原语都接受并返回第二种形式的字典，因为第二种形式更便于堆栈操作。不过，较大的 TL-B 对象中的序列化字典使用第一种表示法。

在 FunC 中，字典也由 `cell` 类型表示，并隐含假设它可能是一个 `null` 值。对于具有不同键长度或值类型的字典，没有单独的类型（毕竟，这是 FunC，而不是 FunC++）。

### 分类说明

字典基元可以将字典的键解释为无符号 `l` 位整数、有符号 `l` 位整数或 `l` 位 slice 。下面列出的基元因其名称中 `dict` 前的前缀而不同。i "代表有符号整数键，"u "代表无符号整数键，空前缀代表 slice 键。

字典原语可能将字典的键解释为无符号 `l` 位整数、有符号 `l` 位整数或 `l` 位 slice 。下面列出的原语名称中的前缀不同。`i` 表示有符号整数键，`u` 表示无符号整数键，空前缀表示 slice 键。

在字典 `dict` 中查找 `key_len` 位键 `index`。成功时，返回找到的值作为 slice 以及表示成功的 `-1` 标志位。如果失败，则返回 `(null, 0)`。

此外，某些基元的对应前缀为`~`。这样就可以将它们用作[修改方法](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)。

### 字典的值

类似于 `dict_get?`，但返回找到的值的第一个引用。

#### dict_get_ref

```func
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
```

`dict_get_ref?` 的变体，如果键 `index` 不在字典 `dict` 中，则返回 `null` 而不是值。

#### dict_set_get_ref

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
```

将与 `index` 关联的值设置为 `value`（如果 `value` 为 `null`，则删除键），并返回旧值（如果值不存在，则为 `null`）。

#### dict_delete?

```func
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
```

从字典 `dict` 中删除 `key_len` 位键 `index`。如果键存在，则返回修改后的字典 `dict'` 和成功标志位 `−1`。否则，返回原始字典 `dict` 和 `0`。

#### dict_delete_get?

```func
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
```

从字典 `dict` 中删除 `key_len` 位键 `index`。如果键存在，则返回修改后的字典 `dict'`、与键 k 关联的原始值 `x`（由一个 slice 表示），以及成功标志位 `−1`。否则，返回 `(dict, null, 0)`。

#### dict_add?

```func
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
```

`dict_set` 的 `add` 对应项，将字典 `dict` 中与键 `index` 关联的值设置为 `value`，但仅当它尚未出现在 `D` 中时。返回修改后的字典和 `-1` 标志位或 `(dict, 0)`。

#### dict_replace?

```func
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
```

类似于 `dict_set` 的 `replace` 操作，但只有在键 `index` 已经出现在 `dict` 中时才将字典 `dict` 中键 `index` 的值设置为 `value`。返回修改后的字典和 `-1` 标志位或 `(dict, 0)`。

#### 构建器对应项

```func
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
```

从字典`dict`中删除`key_len`位键`index`。如果键存在，则返回修改后的字典 `dict'` 和成功标志 `-1`。否则，返回原始字典 `dict` 和 `0`。

#### dict_delete_get?

```func
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
```

从字典`dict`中删除`key_len`位键`index`。如果键存在，则返回修改后的 dictionary `dict'`、与键 k 相关的原始值 `x`（用 Slice 表示）和成功标志 `-1`。否则，返回 `(dict,null,0)`。

#### dict_add?

```func
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
```

与 `dict_set` 相对应的 `add` 将字典 `dict` 中与键 `index` 相关的值设置为 `value`，但前提是 `D` 中还没有这个值。返回字典的修改版本和`-1`标志或`(dict, 0)`。

#### dict_replace?

```func
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
```

与`dict_set`类似的`replace`操作，但只有在`dict`中已经存在键`index`的情况下，才会将字典`dict`中键`index`的值设置为`value`。返回字典的修改版本和`-1`标志或`(dict, 0)`。

### 构建器对应项

计算字典 `dict` 中的最小键 `k`，将其移除，并返回 `(dict', k, x, -1)`，其中 `dict'` 是修改后的 `dict`，`x` 是与 `k` 关联的值。如果字典为空，则返回 `(dict, null, null, 0)`。

#### dict_set_builder

```func
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
```

与 `dict_set` 类似，但接受一个构造函数。

#### dict_add_builder?

```func
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
```

与 `dict_add?` 类似，但接受一个生成器。

#### dict_replace_builder?

```func
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
```

与 `dict_replace?` 类似，但接受一个生成器。

#### dict_delete_get_min

```func
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
```

计算字典 "dict "中最小键 "k"，删除它并返回"(dict', k, x, -1)"，其中 "dict'"是 "dict "的修改版本，"x "是与 "k "相关的值。如果 dict 为空，则返回 `(dict,null,null,0)`。

类似于 `dict_get_min?`，但返回值中唯一的引用作为引用。

#### dict_get_max_ref?

```func
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
```

类似于 `dict_get_max?`，但返回值中唯一的引用作为引用。

#### dict_get_next?

```func
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
```

计算字典 `dict` 中大于 `pivot` 的最小键 `k`；返回 `k`、关联值和表示成功的标志位。如果字典为空，则返回 `(null, null, 0)`。

#### dict_get_nexteq?

```func
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
```

类似于 `dict_get_next?`，但计算大于或等于 `pivot` 的最小键 `k`。

#### dict_get_prev?

```func
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
```

类似于 `dict_get_next?`，但计算小于 `pivot` 的最大键 `k`。

#### dict_get_preveq?

```func
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
```

类似于 `dict_get_prev?`，但计算小于或等于 `pivot` 的最大键 `k`。

#### new_dict

```func
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
```

创建一个空字典，实际上是一个 `null` 值。`null()` 的特例。

#### dict_empty?

```func
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
```

检查字典是否为空。等同于 `cell_null?`。

#### 前缀字典原语

```func
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
```

与 `dict_get_next?` 类似，但计算比 `pivot` 小的最大 key `k`。

#### dict_get_preveq?

```func
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
```

类似于 `dict_get_prev?`，但计算小于或等于 `pivot` 的最大 key `k`。

#### new_dict

```func
cell new_dict() asm "NEWDICT";
```

创建一个空字典，实际上是一个 `null` 值。null()\` 的特例。

#### dict_empty?

```func
int dict_empty?(cell c) asm "DICTEMPTY";
```

检查字典是否为空。等同于 `cell_null?`。

## null

TVM 还支持具有非固定长度键的字典，这些键构成前缀码（即没有任何键是另一个键的前缀）。有关它们的更多信息，请参阅 [TVM 说明](/v3/documentation/tvm/tvm-overview) 部分。

#### pfxdict_get?

```func
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
```

返回 `(s',x,s'',-1)`或 `(null,null,s,0)`。
查找前缀代码字典 "dict "中片段 "key "的唯一前缀。如果找到，则以 `s'` 的形式返回 `s` 的前缀，以 `x` 的形式返回相应的值（也是片段）。s "的剩余部分将作为片段 "s''"返回。如果前缀代码字典 `dict` 中没有 `s` 的前缀，则返回不变的 `s` 和表示失败的 0 标志。

#### pfxdict_set?

```func
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
```

与 `dict_set` 类似，但如果键是字典中另一个键的前缀，则可能失败。返回一个标志表示成功。

#### pfxdict_delete?

```func
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";
```

类似于 `dict_delete?`。

## 特殊基元

#### null

```func
forall X -> X null() asm "PUSHNULL";
```

通过 TVM 类型 `Null`, FunC 表示不存在某个原子类型的值。因此，`null` 实际上可以有任何原子类型。

#### ~impure_touch

```func
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";
```

将变量标记为使用过的变量，这样产生该变量的代码即使不是不纯的也不会被删除。(参见 [impure specifier](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier)）。

## 其他基元

#### min

```func
int min(int x, int y) asm "MIN";
```

计算两个整数 `x` 和 `y` 的最小值。

#### max

```func
int max(int x, int y) asm "MAX";
```

计算两个整数 `x` 和 `y` 的最大值。

#### minmax

```func
(int, int) minmax(int x, int y) asm "MINMAX";
```

对两个整数进行排序。

#### abs

```func
int abs(int x) asm "ABS";
```

计算整数 `x` 的绝对值。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/types.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/docs/types.md
================================================
# 类型

:::info

FunC 文档最初由 [@akifoq](https://github.com/akifoq) 编写。

:::

FunC 有以下内置类型。

## 原子类型

- `int` 是 257 位有符号整数的类型。默认情况下，启用溢出检查，会导致整数溢出异常。
- `cell` 是 TVM cell的类型。TON 区块链中的所有持久数据都存储在cell树中。每个cell最多有 1023 位任意数据和最多四个对其他cell的引用。cell在基于堆栈的 TVM 中用作内存。
- `slice` 是cell slice 的类型。cell可以转换成 slice ，然后可以通过从 slice 加载数据位和对其他cell的引用来获得cell中的数据。
- `builder` 是cell构建器的类型。数据位和对其他cell的引用可以存储在构建器中，然后构建器可以最终化为新cell。
- `tuple` 是 TVM 元组的类型。元组是有序集合，最多包含 255 个组件，这些组件的值类型可能不同。
- `cont` 是 TVM continuation的类型。Continuations 用于控制 TVM 程序执行的流程。从 FunC 的角度来看，它是相当低层级的对象，尽管从概念上讲相当通用。

请注意，上述任何类型都只占用 TVM 堆栈中的单个条目。

### 没有布尔类型

在 FunC 中，布尔值被表示为整数；`false` 表示为 `0`，`true` 表示为 `-1`（二进制表示为 257 个一）。逻辑运算作为位运算执行。当检查条件时，每个非零整数都被视为 `true` 值。

### Null值

通过 TVM 类型 `Null` 的值 `null`，FunC 表示某些原子类型的值缺失。标准库中的一些原语可能被类型化为返回原子类型，并在某些情况下实际返回 `null`。其他原语可能被类型化为接受原子类型的值，但也可以与 `null` 值一起正常工作。这种行为在原语规范中明确说明。默认情况下，禁止 `null` 值，这会导致运行时异常。

这样，原子类型 `A` 可能被隐式转换为类型 `A^?`，也就是 `Maybe A`（类型检查器对这种转换无感知）。

## Hole类型

FunC 支持类型推断。类型 `_` 和 `var` 表示类型“holes”，稍后可以在类型检查期间用某些实际类型填充。例如，`var x = 2;` 是变量 `x` 等于 `2` 的定义。类型检查器可以推断出 `x` 的类型为 `int`，因为 `2` 的类型为 `int`，赋值的左右两边必须类型相等。

## 复合类型

类型可以组合成更复杂的类型。

### 函数类型

形式为 `A -> B` 的类型表示具有指定域和陪域的函数。例如，`int -> cell` 是一个函数类型，它接受一个整数参数并返回一个 TVM cell。

在内部，这种类型的值被表示为continuations。

### 张量类型

形式为 `(A, B, ...)` 的类型本质上表示有序的值集合，这些值的类型为 `A`、`B`、`...`，它们一起占用多个 TVM 堆栈条目。

例如，如果函数 `foo` 的类型为 `int -> (int, int)`，这意味着该函数接受一个整数并返回一对整数。

调用此函数可能看起来像 `(int a, int b) = foo(42);`。在内部，该函数消耗一个堆栈条目并留下两个。

请注意，从低层级角度来看，类型 `(int, (int, int))` 的值 `(2, (3, 9))` 和类型 `(int, int, int)` 的值 `(2, 3, 9)`，在内部以三个堆栈条目 `2`、`3` 和 `9` 的形式表示。对于 FunC 类型检查器，它们是**不同**类型的值。例如，代码 `(int a, int b, int c) = (2, (3, 9));` 将无法编译。

张量类型的特殊情况是**cell类型** `()`。它通常用于表示函数不返回任何值或没有参数。例如，函数 `print_int` 的类型将为 `int -> ()`，而函数 `random` 的类型为 `() -> int`。它有一个唯一的inhabitant `()`，它占用 0 个堆栈条目。

类型 `(A)` 被类型检查器视为与 `A` 相同的类型。

### 元组类型

形式为 `[A, B, ...]` 的类型表示在编译时已知长度和组件类型的 TVM 元组。例如，`[int, cell]` 是一个元组类型，其长度恰好为 2，其中第一个组件是整数，第二个是cell。`[]` 是空元组的类型（具有唯一的inhabitant——空元组）。请注意，与cell类型 `()` 相反，`[]` 的值占用一个堆栈条目。

## 带有类型变量的多态

FunC拥有支持多态函数的 Miller-Rabin 类型系统。例如，以下是一个函数：

```func
forall X -> (X, X) duplicate(X value) {
  return (value, value);
}
```

是一个多态函数，它接受一个（单堆栈条目）值并返回这个值的两个副本。`duplicate(6)` 将产生值 `6 6`，而 `duplicate([])` 将产生两个空元组 `[] []` 的副本。

在这个例子中，`X` 是一个类型变量。

有关此主题的更多信息，请参阅[函数](/develop/func/functions#polymorphism-with-forall)部分。

## 用户定义类型

目前，FunC 不支持定义除上述类型构造之外的类型。

## 类型宽度

您可能已经注意到，每种类型的值都占用一定数量的堆栈条目。如果所有该类型的值都占用相同数量的条目，则该数字称为**类型宽度(type width)**。目前只能为具有固定且预先知道的类型宽度的类型定义多态函数。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/libraries.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/libraries.md
================================================
# FunC SDK和库

## 标准库

- [stdlib](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) — FunC的标准库
- [mathlib](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/mathlib.fc) — 固定点数学库

## 社区库

- [continuation-team/openlib.func](https://github.com/continuation-team/openlib.func) - 在常见场景中减少交易费用。
- [open-contracts/utils](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils) — 实用工具库
- [open-contracts/strings](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings) — 提供字符串操作
- [open-contracts/math](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math) — 扩展FunC算术运算的数学库
- [open-contracts/tuples](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples) — 为FunC收集与元组相关的函数
- [open-contracts/crypto](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto) — 提供secp256k1曲线的操作
- [toncli/test-libs](https://github.com/disintar/toncli/tree/master/src/toncli/lib/test-libs) - 对TLB的操作，生成和解析典型消息和类型
- [ston-fi/funcbox](https://github.com/ston-fi/funcbox) - FunC片段和实用工具的集合。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/overview.mdx
================================================
import Button from '@site/src/components/button'

# 概述

高级语言 FunC 用于在 TON 上编程智能合约。

FunC 是一种领域特定的、类 C 语言的、静态类型语言。
这是一个用 FunC 编写的发送资金的简单示例方法：

```func
() send_money(slice address, int amount) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce
        .store_slice(address)
        .store_coins(amount)
        .end_cell();

    send_raw_message(msg, 64);
}
```

FunC 程序被编译成 Fift 汇编代码，生成对应的 [TON 虚拟机](/learn/tvm-instructions/tvm-overview) 字节码。

进一步地，这个字节码（实际上是 [cell树](/learn/overviews/cells)，就像 TON 区块链中的任何其他数据一样）可以用于在区块链中创建智能合约，或者可以在 TVM 的本地实例上运行。

<Button href="/develop/func/cookbook" colorType={'primary'} sizeType={'sm'}>

FunC 语言指南

</Button>

<Button href="/develop/func/types" colorType={'secondary'} sizeType={'sm'}>

FunC 文档

</Button>

## 编译器

### 用 JS 编译

开始开发和编译智能合约最方便快捷的方式是使用 Blueprint 框架。更多信息请参阅 [Blueprint](/develop/smart-contracts/sdk/javascript) 部分。

```bash
npm create ton@latest
```

### 使用原始二进制文件编译

如果您想在本地使用原生 TON 编译器 FunC，您需要在机器上设置二进制文件。可以从以下位置下载 FunC 编译器二进制文件，适用于 Windows、MacOS（Intel/M1）和 Ubuntu：

- [环境设置页面](/develop/smart-contracts/environment/installation)

:::info
同时，您始终可以从源代码构建二进制文件，如：
[FunC 编译器源代码](https://github.com/ton-blockchain/ton/tree/master/crypto/func)（阅读[如何从源代码编译](/develop/howto/compile#func) FunC 编译器）。
:::

## TON 课程：FunC

[TON 区块链课程](https://stepik.org/course/201638/) 是关于 TON 区块链开发的全面指南。

第 4 模块完整覆盖了 FunC 语言和智能合约开发。

<Button href="https://stepik.org/course/201638/promo"
        colorType={'primary'} sizeType={'sm'}>

查看 TON 区块链课程

</Button>

<Button href="https://stepik.org/course/176754/promo"
        colorType={'secondary'} sizeType={'sm'}>

EN

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## 教程

:::tip 新手提示
开始使用 FunC 进行开发的最佳起点：[入门介绍](/develop/smart-contracts/)
:::

社区专家提供的其他材料：
  - [🚩 挑战 1：简单 NFT 部署](https://github.com/romanovichim/TONQuest1)
  - [🚩 挑战 2：聊天机器人合约](https://github.com/romanovichim/TONQuest2)
  - [🚩 挑战 3：Jetton 自动售卖机](https://github.com/romanovichim/TONQuest3)
  - [🚩 挑战 4：彩票/抽奖](https://github.com/romanovichim/TONQuest4)
  - [🚩 挑战 5：5 分钟内创建与合约交互的 UI](https://github.com/romanovichim/TONQuest5)
  - [🚩 挑战 6：分析 Getgems 市场上的 NFT 销售](https://github.com/romanovichim/TONQuest6)
- [Func & Blueprint](https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa) 由 **@MarcoDaTr0p0je** 提供
- [TON Hello World：编写您的第一个智能合约的逐步指南](https://helloworld.tonstudio.io/02-contract/)
- [TON Hello World：测试您的第一个智能合约的逐步指南](https://helloworld.tonstudio.io/04-testing/)
- [10 FunC 课程](https://github.com/romanovichim/TonFunClessons_Eng) 由 **@romanovichim** 提供，使用 blueprint
- [10 FunC 课程（俄文版）](https://github.com/romanovichim/TonFunClessons_ru) 由 **@romanovichim** 提供，使用 blueprint
- [FunC 测验](https://t.me/toncontests/60) 由 **Vadim**提供—适合自我检查。这将需要 10-15 分钟。问题主要关于 FunС，以及一些关于 TON 的常规问题
- [FunC 测验（俄文版）](https://t.me/toncontests/58?comment=14888) 由 **Vadim** 提供 —— 俄文版 FunC 测验

## 竞赛

参加 [竞赛](https://t.me/toncontests) 是学习 FunC 的绝佳方式。

参加 [竞赛](https://t.me/toncontests) 是学习 FunC 的绝佳方式。

#### 竞赛传承

| 竞赛描述             | 任务                                                       | 解决方案                                                                                            |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| TSC #5（2023年12月） | [Tasks](https://github.com/ton-community/tsc5)           |                                                                                                 |
| TSC #4（2023年9月）  | [Tasks](https://github.com/ton-community/tsc4)           | [Solutions](/v3/documentation/smart-contracts/contracts-specs/examples#ton-smart-challenge-4)   |
| TSC #3（2022年12月） | [Tasks](https://github.com/ton-blockchain/func-contest3) | [Solutions](https://github.com/nns2009/TON-FunC-contest-3)                                      |
| TSC #2（2022年7月）  | [Tasks](https://github.com/ton-blockchain/func-contest2) | [Solutions](https://github.com/ton-blockchain/func-contest2-solutions)                          |
| TSC #1（2022年3月）  | [Tasks](https://github.com/ton-blockchain/func-contest1) | [Solutions](https://github.com/ton-blockchain/func-contest1-solutions)                          |

## 智能合约示例

标准的基本智能合约，如钱包、选举人（在 TON 上管理验证）、多签名钱包等，都可以作为学习时的参考。

- [智能合约示例](/v3/documentation/smart-contracts/contracts-specs/examples)

## 更新日志

[funcC 更新历史](/v3/documentation/smart-contracts/func/changelog)。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/getting-started/ide-plugins.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/getting-started/ide-plugins.md
================================================
# IDE 插件

## IntelliJ IDEs 插件

![](/img/docs/ton-jetbrains-plugin.png)

:::info
此插件可与任何 JetBrains 产品一起使用。
（IntelliJ IDEA、WebStorm、PyCharm、CLion 等）
:::

有几种安装插件的方法：

- 在 IDE 插件部分直接搜索带有 "**TON**" 关键词的插件
- [Marketplace 链接](https://plugins.jetbrains.com/plugin/23382-ton)
- [GitHub 代码库](https://github.com/ton-blockchain/intellij-ton)

## VS Code 插件

Visual Studio Code 是开发者的免费且受欢迎的 IDE。

- [Marketplace 链接](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)
- [GitHub 代码库](https://github.com/ton-foundation/vscode-func)

## FunC Sublime Text 插件

- [GitHub 代码库](https://github.com/savva425/func_plugin_sublimetext3)

## Neovim

要在 Neovim 中启用语法高亮，请按照 [nvim-treesitter 快速入门指南](https://github.com/nvim-treesitter/nvim-treesitter#quickstart) 中的安装说明进行操作。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/getting-started/javascript.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/getting-started/javascript.mdx
================================================
import Button from '@site/src/components/button'

# Blueprint SDK

![Blueprint](\img\blueprint\logo.svg)

一个用于TON的开发环境，用于编写、测试和部署智能合约。

## 快速开始 🚀

在终端中运行以下命令以创建一个新项目，并按照屏幕上的指示操作：

```bash
npm create ton@latest
```

<Button href="https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa" colorType={'secondary'} sizeType={'sm'}>

观看视频教程

</Button>

### 核心特性

- 构建、测试和部署智能合约的流畅工作流
- 使用您最喜欢的钱包（例如Tonkeeper）轻松部署到主网/测试网
- 在进程中运行的隔离区块链上快速测试多个智能合约

### 技术栈

- 编译FunC https://github.com/ton-community/func-js (无需 cli)
- 测试智能合约 https://github.com/ton-org/sandbox
- 使用TON Connect 2.0兼容钱包或`ton://`深层链接部署智能合约

### 要求

- [Node.js](https://nodejs.org/) 使用像v18这样的近期版本，用`node -v`验证版本
- 支持TypeScript和FunC的IDE，如[Visual Studio Code](https://code.visualstudio.com/)，配合[FunC插件](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

## 参考资料

### GitHub

- https://github.com/ton-org/blueprint

### 资料

- [在DoraHacks直播中使用Blueprint](https://www.youtube.com/watch?v=5ROXVM-Fojo)
- [创建一个新项目](https://github.com/ton-org/blueprint#create-a-new-project)
- [开发一个新的智能合约](https://github.com/ton-org/blueprint#develop-a-new-contract)
- [\[YouTube\] 使用Blueprint EN 的FunC](https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa) ([俄文版](https://youtube.com/playlist?list=PLyDBPwv9EPsA5vcUM2vzjQOomf264IdUZ))

## 参阅

- [开发智能合约介绍](/develop/smart-contracts/)
- [如何使用钱包智能合约工作](/develop/smart-contracts/tutorials/wallet)
- [使用toncli](/develop/smart-contracts/sdk/toncli)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/getting-started/testnet.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/getting-started/testnet.md
================================================
# 了解测试网络

在开发和测试过程中使用 TON 测试网络。

:::info
测试网络中的代币没有价值，测试网络可以被重置。
:::

- 测试网络全局配置: https://ton.org/testnet-global.config.json
- 您可以在 [@test_giver_ton_bot](https://t.me/testgiver_ton_bot) 获取免费的测试代币
- 在这个 Telegram 频道中查看测试网络的状态: [@testnetstatus](https://t.me/testnetstatus)

## 服务

为了方便起见，几乎整个主网的基础设施（钱包、API、桥接等）都已在测试网络中重建。

- 浏览器: https://testnet.tonscan.org
- Web 钱包: https://wallet.ton.org?testnet=true
- 浏览器扩展: 使用 [mainnet browser extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) 并 [进行此操作](https://github.com/toncenter/ton-wallet#switch-between-mainnettestnet-in-extension)。
- 测试网 TON Center API: https://testnet.toncenter.com
- 测试网 HTTP API: https://testnet.tonapi.io/
- 测试网桥接: https://ton.org/bridge?testnet=true
- Testnet dTON GraphQL: https://testnet.dton.io/

## 一些第三方工具

- 要切换到 [Tonkeeper's testnet](https://tonkeeper.com/)，在设置中点击版本 5 次。
- 测试网 CryptoBot: https://t.me/CryptoTestnetBot



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/guidelines.mdx
================================================
import Button from '@site/src/components/button'

# 概览

本页面收集了一些建议和最佳实践，可在开发TON区块链上的新智能合约时遵循。

- [内部消息](/develop/smart-contracts/guidelines/internal-messages)
- [外部消息](/develop/smart-contracts/guidelines/external-messages)
- [使用不可弹回消息](/develop/smart-contracts/guidelines/non-bouncable-messages)
- [Get方法](/develop/smart-contracts/guidelines/get-methods)
- ["accept_message"作用](/develop/smart-contracts/guidelines/accept)
- [支付处理查询和发送响应的费用](/develop/smart-contracts/guidelines/processing)
- [如何及为何对您的TON智能合约进行分片。研究TON的Jettons结构](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)
- [TON Keeper创始人Oleg Andreev和Oleg Illarionov关于TON jettons的谈话](https://www.youtube.com/watch?v=oEO29KmOpv4)

## TON 课程：合约开发

[TON区块链课程](https://stepik.org/course/201638/)是关于TON区块链开发的全面指南。

- 第2模块专注于**TVM、交易、可扩展性和商业案例**。
- 第3模块专注于**智能合约开发的全过程**。


<Button href="https://stepik.org/course/201638/promo"
        colorType={'primary'} sizeType={'sm'}>

查看TON区块链课程

</Button>


<Button href="https://stepik.org/course/176754/promo"
        colorType={'secondary'} sizeType={'sm'}>

EN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>




================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/ecosystem-messages-layout.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/ecosystem-messages-layout.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# 生态系统信息布局

## 发送信息

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 部署合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 销毁 jetton

- [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton/blob/master/contracts/op-codes.func)智能合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 申请 jetton 钱包地址

- [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton/blob/master/contracts/op-codes.func)智能合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 传输 jettons

- [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton/blob/master/contracts/op-codes.func)智能合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 铸造 jettons

- [minter-contract](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/imports/op-codes.fc) smart contract

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6.png?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6_dark.png?raw=true',
  }}
/>
</div>
<br></br>

## 根据合约证明 SBT 的所有权

- [nft_contracts](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) 智能合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 转账 NFT

- [nft_contracts](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) 智能合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 铸造NFT

:::info
NFT 标准未指定 /ton-blockchain /token-contract
:::  

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 批量铸造NFT

:::info
NFT 标准未指定 /ton-blockchain /token-contract
:::   

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 按用户销毁 SBT

- [nft_contracts](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) 智能合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

## 由管理员销毁 SBT

- [nft_contracts](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) 智能合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12_dark.svg?raw=true',
  }}
/>
</div>
<br></br>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/external-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/external-messages.md
================================================
# 外部消息

外部消息是`从外部发送`到 TON 区块链中的智能合约，以使它们执行特定操作。

例如，钱包智能合约期望接收包含钱包所有者签名的订单的外部消息（例如，从钱包智能合约发送的内部消息）。当这样的外部消息被钱包智能合约接收时，它首先检查签名，然后接受消息（通过运行 TVM 原语 `ACCEPT`），然后执行所需的任何操作。

:::danger
请注意，所有外部消息`必须受到保护`，以防止重放攻击。验证者通常会从建议的外部消息池中移除一条外部消息（从网络接收）；然而，在某些情况下，`另一个验证者`可能会两次处理同一个外部消息（从而为同一个外部消息创建第二个交易，导致原始操作的重复）。更糟糕的是，`恶意行为者可以从`包含要处理的交易的区块中提取外部消息并稍后重新发送。这可能会迫使钱包智能合约重复付款，例如。
:::

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#4a080b',
padding: '0.2rem',
}}>
{children} </span>
);

<Highlight color="#ffeced">保护智能合约免受与外部消息相关的重放攻击的最简单方法</Highlight> 是在智能合约的持久数据中存储一个 32 位计数器 `cur-seqno`，并在任何入站外部消息的（已签名部分）中获取一个 `req-seqno` 值。然后只有在签名有效且 `req-seqno` 等于 `cur-seqno` 时，才接受外部消息。在成功处理后，持久数据中的 `cur-seqno` 值增加一，因此<Highlight color="#ffeced">相同的外部消息将不再被接受</Highlight>。

而且<Highlight color="#ffeced">也可以</Highlight>在外部消息中包含一个 `expire-at` 字段，并且只有在当前 Unix 时间小于此字段的值时，才接受外部消息。这种方法可以与 `seqno` 结合使用；或者，接收信息的智能合约可以在其持久数据中存储所有最近（未过期）接受的外部消息的（哈希）集合，如果它是存储消息之一的副本会拒绝新的外部消息。此集合中对过期消息的一些垃圾回收也应该执行，以避免持久数据膨胀。

:::note
一般来说，外部消息以一个 256 位签名（如果需要）、一个 32 位 `req-seqno`（如果需要）、一个 32 位 `expire-at`（如果需要），以及可能的 32 位 `op` 和其他根据 `op` 所需的参数开始。外部消息的布局不需要像内部消息那样标准化，因为外部消息不用于不同（由不同开发者编写和不同所有者管理）智能合约之间的互动。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/internal-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/internal-messages.md
================================================
# 内部消息

## 概览

智能合约通过发送所谓的**内部消息**来相互交互。当内部消息到达其预定目的地时，会代表目的地账户创建一个普通交易，并按照该账户（智能合约）的代码和持久数据的所指定的去处理内部消息。

:::info
特别地，这个处理交易可以创建一个或多个出站内部消息，其中一些可能被发送到正在处理内部消息的来源地址。这可以用于创建简单的“客户端-服务器应用程序”，当查询被封装在一个内部消息中并发送到另一个智能合约，该智能合约处理查询并再次作为内部消息发送响应。
:::

这种方法导致需要区分内部消息是作为“查询”、“响应”，还是不需要任何额外处理的（如“简单的资金转移”）。此外，当收到响应时，必须有办法理解它对应于哪个查询。

为了实现这一目标，可以使用以下方法进行内部消息布局（注意TON区块链不对消息体施加任何限制，因此这些确实只是建议）。

### 内部消息结构

消息体可以嵌入到消息本身中，或者存储在消息引用的单独cell中，如TL-B方案片段所示：

```tlb
message$_ {X:Type} ... body:(Either X ^X) = Message X;
```

接收智能合约应至少接受嵌入消息体的内部消息（只要它们适合包含消息的 cell）。如果它接受单独cell中的消息体（使用`(Either X ^X)`的`right`构造函数），那么入站消息的处理不应依赖于消息体的特定嵌入选项。另一方面，对于更简单的查询和响应来说，完全可以不支持单独cell中的消息体。

### 内部消息体

消息体通常以以下字段开始：

```
* A 32-bit (big-endian) unsigned integer `op`, identifying the `operation` to be performed, or the `method` of the smart contract to be invoked.
* A 64-bit (big-endian) unsigned integer `query_id`, used in all query-response internal messages to indicate that a response is related to a query (the `query_id` of a response must be equal to the `query_id` of the corresponding query). If `op` is not a query-response method (e.g., it invokes a method that is not expected to send an answer), then `query_id` may be omitted.
* The remainder of the message body is specific for each supported value of `op`.
```

### 带评论的简单消息

如果`op`为零，则消息是一个“带评论的简单转移消息”。评论包含在消息体的其余部分中（没有任何`query_id`字段，即从第五个字节开始）。如果它不是以字节`0xff`开头的，则评论是一个文本评论；它可以“原样”显示给钱包的最终用户（在过滤掉无效和控制字符并检查它是一个有效的UTF-8字符串之后）。

当评论足够长，以至于不适合在一个cell中，不适合的行尾被放置在cell的第一个引用中。这个过程递归地继续，来描述不适合在两个或更多cell中的评论：

```
root_cell("0x00000000" - 32 bit, "string" up to 123 bytes)
         ↳1st_ref("string continuation" up to 127 bytes)
                 ↳1st_ref("string continuation" up to 127 bytes)
                         ↳....
```

同样的格式用于NFT和[jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format)转移的评论。

例如，用户可以在此文本字段中指明从他们的钱包向另一个用户的钱包进行简单转移的目的。另一方面，如果评论以字节`0xff`开头，则其余部分是一个“二进制评论”，不应将其作为文本显示给最终用户（如有必要，只能作为十六进制转储显示）。"二进制评论"的预期用途是，例如，包含商店支付中的购买标识符，由商店的软件自动生成和处理。

大多数智能合约在收到“简单转移消息”时不应执行非平凡的操作或拒绝入站消息。这样，一旦发现`op`为零，用于处理入站内部消息的智能合约函数（通常称为`recv_internal()`）应立即终止，并显示exit code 0，表示成功终止（例如，如果智能合约没有安装自定义异常处理程序，则会抛出异常`0`）。这将导致接收账户被记入消息转移的价，没有任何进一步的影响。

### 带加密评论的消息

如果`op`是`0x2167da4b`，那么消息是一个“带加密评论的转移消息”。此消息的序列化方式如下：

输入：

- `pub_1`和`priv_1` - 发送者的Ed25519公钥和私钥，各32字节。
- `pub_2` - 接收者的Ed25519公钥，32字节。
- `msg` - 要加密的消息，任意字节字符串。`len(msg) <= 960`。

加密算法如下：

1. 使用`priv_1`和`pub_2`计算`shared_secret`。
2. 让`salt`是发送者钱包地址的[bas64url表示](https://docs.ton.org/learn/overviews/addresses#user-friendly-address)，`isBounceable=1`和`isTestnetOnly=0`。
3. 选择长度在16到31之间的字节字符串`prefix`，使得`len(prefix+msg)`可以被16整除。`prefix`的第一个字节等于`len(prefix)`，其它字节是随机的。让`data = prefix + msg`。
4. 让`msg_key`是`hmac_sha512(salt, data)`的前16字节。
5. 计算`x = hmac_sha512(shared_secret, msg_key)`。让`key=x[0:32]`和`iv=x[32:48]`。
6. 使用AES-256在CBC模式下，`key`和`iv`加密`data`。
7. 构造加密评论：
   1. `pub_xor = pub_1 ^ pub_2` - 32字节。这允许每一方在不查询对方公钥的情况下解密消息。
   2. `msg_key` - 16字节。
   3. 加密的`data`。
8. 消息体以4字节标签`0x2167da4b`开始。然后存储这个加密评论：
   1. 字节字符串被分成段，并存储在一系列cell`c_1,...,c_k`中（`c_1`是消息体的根）。每个cell（除了最后一个）都有一个对下一个的引用。
   2. `c_1`包含多达35字节（不包括4字节标签），其他所有cell包含多达127字节。
   3. 这种格式有以下限制：`k <= 16`，最大字符串长度为1024。

同样的格式用于NFT和jetton转移的评论，注意应使用发送者地址和接收者地址（不是jetton-钱包地址）的公钥。

:::info
Learn from examples of the message encryption algorithm:

- [encryption.js](https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js)
- [SimpleEncryption.cpp](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/keys/SimpleEncryption.cpp)
  :::

### 不带评论的简单转移消息

“不带评论的简单转移消息”具有空的body（甚至没有`op`字段）。上述考虑也适用于此类消息。注意，此类消息应将其body嵌入到消息cell中。

### 区分查询和响应消息

我们期望“查询”消息具有高位清零的`op`，即在范围`1 .. 2^31-1`内，而“响应”消息具有设置了高位的`op`，即在范围`2^31 .. 2^32-1`内。如果方法既不是查询也不是响应（因此相应的消息体不包含`query_id`字段），则应使用“查询”范围内的`op`，即`1 .. 2^31 - 1`。

### 处理标准响应消息

有一些带有`op`等于`0xffffffff`和`0xfffffffe`的“标准”响应消息。一般来说，`op`的值从`0xfffffff0`到`0xffffffff`是为这类标准响应保留的。

```
* `op` = `0xffffffff` means "operation not supported". It is followed by the 64-bit `query_id` extracted from the original query, and the 32-bit `op` of the original query. All but the simplest smart contracts should return this error when they receive a query with an unknown `op` in the range `1 .. 2^31-1`.
* `op` = `0xfffffffe` means "operation not allowed". It is followed by the 64-bit `query_id` of the original query, followed by the 32-bit `op` extracted from the original query.
```

请注意，未知的“响应”（其`op`在范围`2^31 .. 2^32-1`内）应被忽略（特别是，不应生成`op`等于`0xffffffff`的响应来回应它们），就像意外的弹回消息（带有“弹回”标志位设置）一样。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/message-modes-cookbook.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/message-modes-cookbook.mdx
================================================
# 消息模式 Cookbook

了解发送消息的不同模式和标记对于确保智能合约的正确运行非常重要。 
[消息模式](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)部分对这些模式和标记进行了详细描述，而在本节中，我们将通过具体示例来说明它们的实际应用。

:::info 重要事项

**Note**：这些示例中使用的交易费用（如 3 Toncoin）是假设的，仅供参考。实际交易费用会因网络条件和其他因素而有所不同。
:::

## 1. 发送常规信息

我们的智能合约余额中目前有 100  Toncoin 。在收到一条含有 50  Toncoin 的内部信息后，我们发送一条含有 20  Toncoin 的普通信息，交易费为 3  Toncoin ，将从信息中扣除。

![](/img/docs/message-modes-cookbook/send_regular_message_1.png)

| Mode and Flags        | Code                       |
| :-------------------- | :------------------------- |
| `mode` = 0, no `flag` | `send_raw_message(msg, 0)` |

## 2. 发送普通信息，错误时不跳转信息并忽略它

我们的智能合约余额中目前有 100  Toncoin 。在收到 50  Toncoin 的内部信息后，我们发送一条 20  Toncoin 的普通信息，交易费为 3  Toncoin ，将从信息中扣除。
如果在交易处理过程中出现错误，消息将不会跳转并被忽略。

![](/img/docs/message-modes-cookbook/send_regular_message_2.png)

| Mode and Flags         | Code                       |
| :--------------------- | :------------------------- |
| `mode` = 0, `flag` = 2 | `send_raw_message(msg, 2)` |

## 3. 发送常规信息并在出错时跳转信息

我们的智能合约余额中目前有 100  Toncoin 。在收到 50  Toncoin 的内部信息后，我们发送一条 20  Toncoin 的普通信息，交易费为 3  Toncoin ，将从信息中扣除， 
，如果在操作处理过程中出现错误--除了回滚交易外，还将退订信息。

![](/img/docs/message-modes-cookbook/send_regular_message_3_error.png)

| Mode and Flags          | Code                        |
| :---------------------- | :-------------------------- |
| `mode` = 0, `flag` = 16 | `send_raw_message(msg, 16)` |

## 4. 发送普通邮件，单独收费

我们的智能合约余额为 100  Toncoin ，我们收到一条内部信息，金额为 50  Toncoin ，发送一条普通信息，金额为 20  Toncoin ，总费用为 3  Toncoin ，我们单独支付转账费用（从合约余额中扣除）。

![](/img/docs/message-modes-cookbook/send_regular_message_4.png)

| Mode and Flags         | Code                       |
| :--------------------- | :------------------------- |
| `mode` = 0, `flag` = 1 | `send_raw_message(msg, 1)` |

## 5. 发送包含单独费用的普通邮件，并在出错时跳转邮件

我们的智能合约余额为 100  Toncoin ，我们收到一条内部信息，金额为 50  Toncoin ，并发送一条普通信息，金额为 20  Toncoin ，总费用为 3  Toncoin ，我们单独支付转账费用（从合约余额中支付）， 
，如果在操作处理过程中出现错误--除了回滚交易外，还将信息退回。

![](/img/docs/message-modes-cookbook/send_regular_message_5_error.png)

| Mode and Flags                   | Code                        |
| :------------------------------- | :-------------------------- |
| `mode` = 0, `flag` = 1 + 16 = 17 | `send_raw_message(msg, 17)` |

## 6. 随新信息携带余值

我们的智能合约余额中目前有 100  Toncoin 。在收到一条含有 50  Toncoin 的内部信息后，除了新信息中最初显示的价值外，我们还将携带入站信息的所有剩余价值，
，交易费为 3  Toncoin ，将从信息中扣除。

![](/img/docs/message-modes-cookbook/carry_remaining_value_6.png)

| Mode and Flags         | Code                        |
| :--------------------- | :-------------------------- |
| `mode` = 64, no `flag` | `send_raw_message(msg, 64)` |

## 7. 将剩余价值转入新信息，单独收费

我们的智能合约余额中目前有 100  Toncoin 。在收到 50  Toncoin 的内部信息后，除了新信息中最初显示的价值外，我们还将携带所有入站信息的剩余价值，
，交易费为 3  Toncoin ，将单独支付（从智能合约余额中支付）。

![](/img/docs/message-modes-cookbook/carry_remaining_value_7.png)

| Mode and Flags          | Code                        |
| :---------------------- | :-------------------------- |
| `mode` = 64, `flag` = 1 | `send_raw_message(msg, 65)` |

## 8. 结转剩余值并跳转错误信息

我们的智能合约余额中目前有 100  Toncoin 。
交易费为 3  Toncoin ，将从信息中扣除，如果在行动处理过程中出现错误--除了回滚交易外，还要退回信息。

![](/img/docs/message-modes-cookbook/carry_remaining_value_8_error.png)

| Mode and Flags           | Code                        |
| :----------------------- | :-------------------------- |
| `mode` = 64, `flag` = 16 | `send_raw_message(msg, 80)` |

## 9. 将剩余价值与新信息一起单独收费，并在出错时跳转信息

我们的智能合约余额中目前有 100  Toncoin 。在收到 50  Toncoin 的内部消息后，我们会发送一条消息，除了收到的原始金额外，我们会转移整个合约余额，交易费为 3  Toncoin ，将单独支付（从智能合约余额中支付），
，如果在行动处理过程中发生错误--除了回滚交易外，还会退还消息。

![](/img/docs/message-modes-cookbook/carry_remaining_value_9_error.png)

| Mode and Flags               | Code                        |
| :--------------------------- | :-------------------------- |
| `mode` = 64, `flag` = 16 + 1 | `send_raw_message(msg, 81)` |

## 10. 发送所有收到的代币和合约余额

目前，我们的智能合约余额为 100  Toncoin 。在收到 50  Toncoin 的内部信息后，我们发送了一条信息，除了收到的原始金额外，我们还转移了整个合约余额， 
，交易费为 3  Toncoin ，将从信息中扣除。

![](/img/docs/message-modes-cookbook/carry_remaining_value_10.png)

| Mode and Flags          | Code                         |
| :---------------------- | :--------------------------- |
| `mode` = 128, no `flag` | `send_raw_message(msg, 128)` |

## 11. 发送所有收到的代币和合约余额，并跳出错误信息

目前我们的智能合约余额为 100  Toncoin 。在收到 50  Toncoin 的内部信息后，我们会发送一条信息，除了收到的原始金额外，我们会转移整个合约余额，交易费为 3  Toncoin ，并将从信息中扣除， 
，如果在处理操作过程中出现错误--除了回滚交易外，还会退订信息。

![](/img/docs/message-modes-cookbook/carry_remaining_value_11_error.png)

| Mode and Flags            | Code                         |
| :------------------------ | :--------------------------- |
| `mode` = 128, `flag` = 16 | `send_raw_message(msg, 144)` |

## 12. 发送所有收到的代币和合约余额，并销毁智能合约

我们的智能合约余额中目前有 100  Toncoin 。在收到一条含有 50  Toncoin 的内部信息后，我们发送了一条信息，除了收到的原始金额外，还转走了整个合约余额，并销毁了合约，
，交易费为 3  Toncoin ，将从信息中扣除。

![](/img/docs/message-modes-cookbook/carry_remaining_value_12.png)

| Mode and Flags            | Code                         |
| :------------------------ | :--------------------------- |
| `mode` = 128, `flag` = 32 | `send_raw_message(msg, 160)` |



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/messages-and-transactions.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/messages-and-transactions.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# 消息概览

TON 是一个异步区块链，其结构与其他区块链非常不同。因此，新开发者经常对 TON 中的低级事物有疑问。在本文中，我们将探讨与消息传递相关的一个问题。

## 什么是消息？

消息是在actor（用户、应用程序、智能合约）之间发送的数据包。它通常包含指导接收方执行某种操作的信息，如更新存储或发送新消息。

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_1.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_1.png?raw=true',
  }}
/>
</div>
<br></br>

这种通信方式让人想起将卫星发射到太空。我们知道我们构成的消息，但在发射后，需要进行单独的观察来找出我们将获得什么结果。

## 什么是交易？

TON 中的一笔交易包括以下内容：

- 最初触发合约的传入消息（存在特殊的触发方式）
- 由传入消息引起的合约行动，例如更新合约的存储（可选）
- 发送给其他参与者的所生成的传出消息（可选）

> 技术上，合约可以通过特殊功能如 [Tick-Tock](/develop/data-formats/transaction-layout#tick-tock) 触发，但这个功能更多用于 TON 内部的区块链核心合约。
>
> 并非每笔交易都会导致传出消息或对合约存储的更新——这取决于合约代码所定义的操作。

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
  }}
/>
<br></br>

在异步系统中，您无法在同一笔交易中从目标智能合约获得响应。合约调用可能需要几个区块来处理，具体取决于来源和目的地之间的路由长度。

为了实现无限分片范式，必须确保完全并行化，这意味着每笔交易的执行都独立于其他交易。因此，与其进行影响和改变多个合约状态的交易，不如每笔 TON 交易只在单个智能合约上执行，智能合约通过消息进行通信。这样，智能合约只能通过调用它们的函数与特殊消息相互作用，并稍后通过其他消息获得响应。

为了实现无限分片范式，必须确保完全并行化，这意味着每笔交易的执行都独立于其他交易。因此，与其进行影响和改变多个合约状态的交易，不如每笔 TON 交易只在单个智能合约上执行，智能合约通过消息进行通信。这样，智能合约只能通过调用它们的函数与特殊消息相互作用，并稍后通过其他消息获得响应。

:::info
[交易布局](/v3/documentation/data-formats/tlb/transaction-layout) 页面上有更详细准确的说明。
:::

### 交易结果

严格保证由消息产生的交易将具有大于消息的 _lt_ 的 _lt_。同样，某笔交易中发送的消息的 _lt_ 严格大于引起它的交易的 _lt_。此外，从一个账户发送的消息和在一个账户上发生的交易也是严格有序的。

:::info 用于 toncenter api v3
要确定交易是否成功，应使用 tx.description.action.success && tx.description.compute_ph.success：
:::

```json
"transactions": [
    {
      "description": {
        . . . . . . . .
        "action": {
          "valid": true,
          "success": true,
         . . . . . . . .
          },
. . . . . . . .
        "destroyed": false,
        "compute_ph": {
          "mode": 0,
          "type": "vm",
          "success": true,
```

由此，对于每个账户，我们总是知道交易、接收消息和发送消息的顺序。

- 成功，退出代码为 0 或 1
- 失败，`aborted: true` 未执行
- Fail， [exit code](/v3/documentation/tvm/tvm-exit-codes), `aborted: true`.

:::info 用于 toncenter api v3
`aborted: true` 是 TON 中心字段，事务中没有此类字段
:::

## 什么是逻辑时间？

否则，尝试同步交付将需要在处理一个分片之前知道所有其他的状态，从而破坏了并行并破坏有效的分片。

对于每个区块，我们可以将 _lt_ 范围定义为从第一笔交易开始，到区块中最后一个事件（消息或交易）的 _lt_ 结束。区块的排序方式与 TON 中的其他事件相同，因此如果一个区块依赖于另一个区块，它具有更高的 _lt_。一个分片中的子区块的 _lt_ 高于其父区块。一个主链区块的 _lt_ 高于它所列出的分片区块的 _lts_，因为主区块依赖于所列分片区块。每个分片区块包含对创建分片区块时最新（创建分片区块时）主区块的有序引用，因此分片区块的 _lt_ 高于引用的主区块的 _lt_。

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_3.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_3.png?raw=true',
  }}
/>
<br></br>

幸运的是，TON 的工作方式是任何内部消息都一定会被目标账户接收。消息不会在来源和目的地之间的任何地方丢失。外部消息有点不同，因为它们被接受到区块中是由验证者自行决定的，但是，一旦消息被接受进入传入消息队列，它将被传递。

此外，如果账户 _A_ 向账户 _B_ 发送了两条消息，可以保证具有较低 _lt_ 的消息将被更早处理：

因此，看起来 _lt_ 解决了消息传递顺序的问题，因为我们知道具有较低 _lt_ 的交易将首先被处理。但这并不适用于每个场景。

假设有两个合约 - _A_ 和 _B_。_A_ 收到一个外部消息，触发它向 _B_ 发送两个内部消息，我们称这些消息为 _1_ 和 _2_。在这个简单的情况下，我们可以 100% 确定 _1_ 将在 _2_ 之前被 _B_ 处理，因为它具有较低的 _lt_。

<ConceptImage src="/img/docs/msg-delivery-1.png" />

但这只是一个简单的案例，当我们只有两个合约时。我们的系统在更复杂的情况下是如何工作的？

对于每个区块，我们可以将 _lt_ 范围定义为从第一笔交易开始，到区块中最后一个事件（消息或交易）的 _lt_ 结束。区块的排序方式与 TON 中的其他事件相同，因此如果一个区块依赖于另一个区块，它具有更高的 _lt_。一个分片中的子区块的 _lt_ 高于其父区块。一个主链区块的 _lt_ 高于它所列出的分片区块的 _lts_，因为主区块依赖于所列分片区块。每个分片区块包含对创建分片区块时最新（创建分片区块时）主区块的有序引用，因此分片区块的 _lt_ 高于引用的主区块的 _lt_。

## 消息传递

为了更清晰，假设我们的合约在 `msg1` 和 `msg2` 由 `B` 和 `C` 合约执行后发送回消息 `msg1'` 和 `msg2'`。结果将在合约 `A` 上实现 `tx2'` 和 `tx1'`。我们有两种可能的交易路径，

### 传递顺序

假设有两个合约 - _A_ 和 _B_。_A_ 收到一个外部消息，触发它向 _B_ 发送两个内部消息，我们称这些消息为 _1_ 和 _2_。在这个简单的情况下，我们可以 100% 确定 _1_ 将在 _2_ 之前被 _B_ 处理，因为它具有较低的 _lt_。

假设有两个合约 - _A_ 和 _B_。_A_ 收到一个外部消息，触发它向 _B_ 发送两个内部消息，我们称这些消息为 _1_ 和 _2_。在这个简单的情况下，我们可以 100% 确定 _1_ 将在 _2_ 之前被 _B_ 处理，因为它具有较低的 _lt_。

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_7.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_7.png?raw=true',
  }}
/>
</div>
<br></br>

同样，当两个合约 _B_ 和 _C_ 向一个合约 _A_ 发送消息时，情况也是如此。即使 `B -> A` 的消息在 `C -> A` 之前发送，我们也无法知道哪一个将先被送达。`B -> A` 的路由可能需要更多的分片链转运。

### 多个智能合约

在多个智能合约互动的许多可能的场景中，消息传递顺序可能是任意的。唯一的保证是，来自任何合约 _A_ 到任何合约 _B_ 的消息将按照它们的逻辑时间顺序处理。下面是一些示例。

为了更清楚起见，假设在 `B` 和 `C` 合约执行了 `msg1` 和 `msg2` 之后，我们的合约发回了 `msg1'` 和 `msg2'` 消息。因此，它将在 `A` 合约上应用 `tx2'` 和 `tx1'`。
我们有两种可能的交易跟踪、

1. 第一种可能的顺序是 `tx1'_lt < tx2'_lt`：

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_6.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_6.png?raw=true',
  }}
/>
</div>
<br></br>

2. 第二种可能的顺序是 `tx2'_lt < tx1'_lt`：

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_7.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_7.png?raw=true',
  }}
/>
</div>
<br></br>

同样，当两个合约 _B_ 和 _C_ 向一个合约 _A_ 发送消息时，情况也是如此。即使 `B -> A` 的消息在 `C -> A` 之前发送，我们也无法知道哪一个将先被送达。`B -> A` 的路由可能需要更多的分片链转运。

<ConceptImage src="/img/docs/msg-delivery-3.png" />

在多个智能合约互动的许多可能的场景中，消息传递顺序可能是任意的。唯一的保证是，来自任何合约 _A_ 到任何合约 _B_ 的消息将按照它们的逻辑时间顺序处理。下面是一些示例。

<ConceptImage src="/img/docs/msg-delivery-4.png" />
<ConceptImage src="/img/docs/msg-delivery-5.png" />
<ConceptImage src="/img/docs/msg-delivery-6.png" />

## 结论

TON 区块链的异步结构为消息传递保证带来挑战。逻辑时间有助于确定事件和交易顺序，但由于分片链中的路由不同，它并不能保证多个智能合约之间的消息传递顺序。尽管存在这些复杂性，TON 仍然能够确保内部消息的传递，维护网络的可靠性。开发人员必须适应这些细微差别，以充分利用 TON 的潜力构建创新的去中心化应用程序。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/non-bounceable-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/non-bounceable-messages.md
================================================
# 非弹回消息

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children} </span>
);

几乎所有在智能合约之间发送的内部消息都应该是可弹回的，即应该设置它们的“bounce”位。然后，如果目标智能合约不存在，或者在处理此消息时抛出未处理的异常，消息将被“bounced”，携带原始值的剩余部分（减去所有消息传输和gas费用）。弹回消息的主体将包含32位的`0xffffffff`，紧接着是原始消息的256位，但是“bounce”标志位被清除，“bounced”标志位被设置。因此，所有智能合约都应检查所有入站消息的“bounced”标志，并且要么默默接受它们（通过立即以exit code 0终止），要么执行一些特殊处理来检测哪个出站查询失败了。弹回消息主体中包含的查询永远不应执行。

:::info
弹回消息主体中包含的查询<Highlight color="#186E8A">永远不应执行</Highlight>。
:::

在某些情况下，必须使用`不可弹回内部消息`。例如，没有发送至少一条不可弹回内部消息给它们，就无法创建新账户。除非这条消息包含一个带有新智能合约的代码和数据的`StateInit`，否则在不可弹回内部消息中拥有非空主体是没有意义的。

:::tip
不允许最终用户（例如，钱包的用户）发送包含大量价值（例如，超过五个Toncoin）的不可弹回消息是一个好主意，或者如果他们这样做了就警告他们。更好的做法是先发送少量金额，接着初始化新的智能合约，然后再发送更大的金额。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/sending-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/message-management/sending-messages.md
================================================
# 发送消息

消息的组成、解析和发送位于[TL-B schemas](/develop/data-formats/tl-b-language)、[交易阶段和TVM](/learn/tvm-instructions/tvm-overview)的交汇处。

事实上，FunC有[send_raw_message](/develop/func/stdlib#send_raw_message)函数，该函数期望一个序列化消息作为参数。

由于TON是一个功能广泛的系统，支持所有这些功能的消息可能看起来相当复杂。尽管如此，大多数情况下并不使用那么多功能，消息序列化在大多数情况下可以简化为：

```func
  cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_slice(message_body)
  .end_cell();
```

因此，开发者不用担忧，如果这份文档中的某些内容在第一次阅读时看起来难以理解，没有关系。只需把握总体思路即可。

有时文档中可能会提到\*\*'gram'**这个词，但大多是在代码示例中，它只是**toncoin\*\*的一个过时名称。

让我们深入了解！

## 消息类型

有三种类型的消息：

- 外部消息 — 从区块链外部发送到区块链内部智能合约的消息。这类消息应该在所谓的`credit_gas`阶段被智能合约明确接受。如果消息未被接受，节点不应该将其纳入进区块或转发给其他节点。
- 内部消息 — 从一个区块链实体发送到另一个区块链实体的消息。与外部消息不同，这类消息可以携带一些TON并为自己支付费用。接收此类消息的智能合约可能没有接受它，在这种情况下，消息价值中的gas将被扣除。
- 日志 — 从区块链实体发送到外部世界的消息。一般来说，没有将这类消息发送出区块链的机制。实际上，尽管网络中的所有节点对是否创建了消息达成共识，但没有关于如何处理它们的规则。日志可能被直接发送到`/dev/null`，记录到磁盘，保存到索引数据库，甚至通过非区块链手段（电子邮件/Telegram/短信）发送，所有这些都取决于给定节点的自行决定。

## 消息布局

我们将从内部消息布局开始。

描述智能合约可以发送的消息的TL-B方案如下：

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed 
  init:(Maybe (Either StateInit ^StateInit))
  body:(Either X ^X) = MessageRelaxed X;
```

让我们用语言来描述。任何消息的序列化都包括三个字段：info（某种标题，描述来源、目的地和其他元数据）、init（仅在消息初始化时需要的字段）和body（消息有效载荷）。

`Maybe`、`Either`和其他类型的表达式意味着以下内容：

- 当我们有字段`info:CommonMsgInfoRelaxed`时，意味着`CommonMsgInfoRelaxed`的序列化直接注入到序列化cell中。
- 当我们有字段`body:(Either X ^X)`时，意味着当我们(反)序列化某种类型`X`时，我们首先放置一个`either`位，如果`X`被序列化到同一cell，则为`0`，如果它被序列化到单独的cell，则为`1`。
- 当我们有字段`init:(Maybe (Either StateInit ^StateInit))`时，意味着我们首先放置`0`或`1`，要取决于这个字段是否为空；如果不为空，我们序列化`Either StateInit ^StateInit`（再次，放置一个`either`位，如果`StateInit`被序列化到同一cell则为`0`，如果被序列化到单独的cell则为`1`）。

`CommonMsgInfoRelaxed`的布局如下：

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt 
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

让我们现在专注于`int_msg_info`。
它以1位的前缀`0`开始，然后有三个1位的标志位，分别表示是否禁用即时超立方路由（目前始终为真）、是否在处理过程中出错时弹回消息，以及消息本身是否是弹回的结果。然后序列化来源和目的地址，接着是消息值和四个与消息转发费用和时间有关的整数。

如果消息是从智能合约发送的，其中一些字段将被重写为正确的值。特别是，验证者将重写`bounced`、`src`、`ihr_fee`、`fwd_fee`、`created_lt`和`created_at`。这意味着两件事：首先，另一个智能合约在处理消息时可以信任这些字段（发送者无法伪造来源地址、`bounced`标志位等）；其次，在序列化时我们可以将任何有效值放入这些字段中（无论如何这些值都将被重写）。

消息的直接序列化如下所示：

```func
  var msg = begin_cell()
    .store_uint(0, 1) ;; tag
    .store_uint(1, 1) ;; ihr_disabled
    .store_uint(1, 1) ;; allow bounces
    .store_uint(0, 1) ;; not bounced itself
    .store_slice(source)
    .store_slice(destination)
    ;; serialize CurrencyCollection (see below)
    .store_coins(amount)
    .store_dict(extra_currencies)
    .store_coins(0) ;; ihr_fee
    .store_coins(fwd_value) ;; fwd_fee 
    .store_uint(cur_lt(), 64) ;; lt of transaction
    .store_uint(now(), 32) ;; unixtime of transaction
    .store_uint(0,  1) ;; no init-field flag (Maybe)
    .store_uint(0,  1) ;; inplace message body flag (Either)
    .store_slice(msg_body)
  .end_cell();
```

然而，开发者通常使用快捷方式而不是逐步序列化所有字段。因此，让我们考虑如何使用[elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153)中的示例从智能合约发送消息。

```func
() send_message_back(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(ans_tag, 32)
    .store_uint(query_id, 64);
  if (body >= 0) {
    msg~store_uint(body, 32);
  }
  send_raw_message(msg.end_cell(), mode);
}
```

首先，它将`0x18`值放入6位，即放入`0b011000`。这是什么？

- 第一位是`0` — 1位前缀，表示它是`int_msg_info`。

- 然后有3位`1`、`1`和`0`，表示即时超立方路由被禁用，消息可以在处理过程中出错时回弹，消息本身不是回弹的结果。

- 然后应该是发送者地址，但由于它无论如何都会被重写，因此可以存储任何有效地址。最短的有效地址序列化是`addr_none`的序列化，它序列化为两位字符串`00`。

因此，`.store_uint(0x18, 6)`是序列化标签和前4个字段的优化后的方式。

下一行序列化目的地址。

然后我们应该序列化值。一般来说，消息值是一个`CurrencyCollection`对象，其方案如下：

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) 
                 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection 
           = CurrencyCollection;
```

这个方案意味着除了TON值之外，消息可能还携带了extra-currencies的字典。然而，目前我们可以忽略它，只假设消息值被序列化为“作为变量整数的nanotons数量”和“`0` - 空字典位”。

事实上，在上面的选举人代码中，我们通过`.store_coins(toncoins)`序列化代币数量，但接着只放置了长度等于`1 + 4 + 4 + 64 + 32 + 1 + 1`的零字符串。这代表着什么？

- 第一个位表示空的extra-currencies字典。
- 然后我们有两个长度为4位的字段。它们以`VarUInteger 16`编码为0。事实上，由于`ihr_fee`和`fwd_fee`将被重写，我们同样可以在那里放置零。
- 然后我们将零放入`created_lt`和`created_at`字段。这些字段也将被重写；然而，与费用不同，这些字段有固定长度，因此被编码为64位和32位长的字符串。
- *（我们已经序列化了消息头并传递到init/body）*
- 接下来的零位表示没有`init`字段。
- 最后一个零位表示消息体将就地序列化。
- 之后，消息体（具有任意布局）就完成了编码。

这样，我们执行了4个序列化原语，而不是单独序列化了14个参数。

## 完整方案

消息布局和所有构成字段的完整方案（以及TON中所有对象的方案）在[block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)中呈现。

## 消息大小

:::info cell大小
请注意，任何[Cell](/learn/overviews/cells)最多可包含`1023`位。如果您需要存储更多数据，您应该将其分割成块并存储在引用cell中。
:::

例如，如果您的消息体大小为900位长，您无法将其存储在与消息头相同的cell中。
实际上，除了消息头字段外，cell的总大小将超过1023位，在序列化过程中将出现`cell溢出`异常。在这种情况下，原本代表“就地消息体标志位（Either）”的`0`应该变成`1`，消息体应该存储在引用cell中。

由于某些字段具有可变大小，因此应小心处理这些事项。

例如，`MsgAddress`可以由四个构造器表示：`addr_none`、`addr_std`、`addr_extern`、`addr_var`，长度从2位（对于`addr_none`）到586位（对于最大形式的`addr_var`）。nanotons的数量也是如此，它被序列化为`VarUInteger 16`。这意味着，4位指示整数的字节长度，然后指示整数本身的较前面的字节。这样，0 nanotons将被序列化为`0b0000`（4位编码着零字节长度字符串，然后是零字节），而100,000,000 TON（或100000000000000000 nanotons）将被序列化为`0b10000000000101100011010001010111100001011101100010100000000000000000`（`0b1000`表示8个字节长度，然后是8个字节其本身）。

:::info 消息大小

更多配置参数及其值可在 [这里](/develop/howto/blockchain-configs#param-43) 找到。
:::

## 消息模式

如您可能已经注意到，我们使用`send_raw_message`发送消息，除了消耗消息本身外，还接受mode（模式）。要了解最适合您需求的模式，请查看以下表格：

- mode：定义发送报文时的基本行为，如是否携带余额、是否等待报文处理结果等。不同的模式值代表不同的发送特性，不同的值可以组合使用，以满足特定的发送要求。
- flag：作为模式的附加功能，用于配置特定的报文行为，如单独支付转账费用或忽略处理错误。将标记添加到模式中可创建最终的报文发送模式。

使用`send_raw_message`函数时，根据需要选择合适的模式和标记组合非常重要。要找出最适合您需要的模式，请参阅下表：

| Mode  | 描述                            |
| :---- | :---------------------------- |
| `0`   | 普通消息                          |
| `64`  | 除了新消息中最初指示的值之外，携带来自入站消息的所有剩余值 |
| `128` | 携带当前智能合约的所有余额，而不是消息中最初指示的值    |

| Flag  | 描述                                       |
| :---- | :--------------------------------------- |
| `+1`  | 单独支付转账费用                                 |
| `+2`  | 忽略在 Action Phase 处理该信息时出现的一些错误（请查看下面的注释） |
| `+16` | 在action失败的情况下 - 弹回交易。如果使用了`+2`则无效。       |
| `+32` | 如果当前账户的结果余额为零，则必须销毁该账户（通常与Mode 128一起使用）  |

:::info +2 flag

1. 消息的格式无效。
   - 没有足够的值与消息一起传送(所有入站消息值都已消耗)。
   - 没有足够的资金来处理消息。
   - 没有足够的信息附加值来支付转发费用。
   - 没有足够的额外货币与消息一起发送。
   - 没有足够的资金支付出站外部消息。
2. 消息模式包括 64 和128 modes。
3. 出站消息在 StateInit 中有无效的库。

要为`send_raw_message`构建一个模式，您只需通过将Mode和Flag结合来组合它们。例如，如果您想发送常规消息并单独支付转账费用，请使用Mode`0`和Flag`+1`得到`mode = 1`。如果您想发送整个合约余额并立即销毁它，请使用Mode`128`和Flag`+32`得到`mode = 160`。

1. 消息的格式无效。
2. 消息模式包括 64 和128 modes。
3. 出站消息在 StateInit 中有无效的库。
4. 外部消息不是普通消息，或包含 +16 或 +32 标志，或两者兼有。
   :::

:::info +16 flag

否则，它将在 `storage` 阶段 **之前** 处理`credit` 阶段。

[检查`bounce-enable` flag的源代码](https://github.com/ton-blockchain/ton/blob/master/validator/impl/collator.cpp#L2810)。
:::

:::warning

1. **+16 flag** - 不要在外部报文（如发给钱包的报文）中使用，因为没有发件人接收被退回的报文。
2. **+2 flag** - 这在外部消息（例如，发送到钱包）中非常重要。
   :::

### 用例示例

让我们看一个例子来更清楚地说明这一点。假设我们的智能合约余额为 100  Toncoin ，我们收到一条 50  Toncoin 的内部信息，并发送一条 20  Toncoin 的信息，总费用为 3  Toncoin 。

`重要`：说明错误发生时的错误结果。

| Case                                                                            | Mode and Flags                 | Code                         | Result                                                                                                   |
| :------------------------------------------------------------------------------ | :----------------------------- | :--------------------------- | :------------------------------------------------------------------------------------------------------- |
| 发送常规信息                                                                          | `mode` = 0, no `flag`          | `send_raw_message(msg, 0)`   | `balance` - 100 + 50 - 20 = 130, `send` - 20 - 3 = 17                                                    |
| 如果在处理操作过程中出现错误，则发送常规信息，不要回滚事务而忽略它                                               | `mode` = 0, `flag` = 2         | `send_raw_message(msg, 2)`   | `balance` - 100 + 50, `send` - 0                                                                         |
| 如果在处理操作过程中出现错误，则发送常规信息 - 除了回滚事务外，还弹出信息                                          | `mode` = 0, `flag` = 16        | `send_raw_message(msg, 16)`  | `balance` - 100 + 50 = 167 + 17 (bounced), `send` - 20 - 3 = `bounce` message with 17 |
| 发送普通信息并单独支付转账费用                                                                 | `mode` = 0, `flag` = 1         | `send_raw_message(msg, 1)`   | `balance` - 100 + 50 - 20 - 3 = 127, `send` - 20                                                         |
| 如果在处理操作过程中出现错误，则发送常规信息并单独支付转账费用 - 除退回交易外，还退回信息                                  | `mode` = 0, `flags` = 1 + 16   | `send_raw_message(msg, 17)`  | `balance` - 100 + 50 - 20 - 3 = 127 + `20 (bounced)`, `send` - 20 = `bounce` message with 20             |
| 除了新信息中最初显示的值外，还携带所有入站信息的剩余值                                                     | `mode` = 64, `flag` = 0        | `send_raw_message(msg, 64)`  | `balance` - 100 - 20 = 80, `send` - 20 + 50 - 3 = 67                                                     |
| 除了新电文中最初标明的价值外，携带入站电文的所有剩余价值，并单独支付转账费用                                          | `mode` = 64, `flag` = 1        | `send_raw_message(msg, 65)`  | `balance` - 100 - 20 - 3 = 77, `send` - 20 + 50 = 70                                                     |
| 如果在处理操作过程中出现错误，则除新信息中最初显示的价值外，携带入站信息的所有剩余价值，并单独支付转账费用 - 除退回交易外，还退回信息            | `mode` = 64, `flags` = 1 + 16  | `send_raw_message(msg, 81)`  | `balance` - 100 - 20 - 3 = 77 + `70 (bounced)`, `send` - 20 + 50 = `bounce` message with 70              |
| 发送所有收到的代币和合约余额                                                                  | `mode` = 128, `flag` = 0       | `send_raw_message(msg, 128)` | `balance` - 0, `send` - 100 + 50 - 3 = 147                                                               |
| 如果在处理操作过程中出现错误，则发送所有收到的代币和合约余额 - 除了回滚交易外，还弹出消息                                  | `mode` = 128, `flag` = 16      | `send_raw_message(msg, 144)` | `balance` - 0 + `147 (bounced)`, `send` - 100 + 50 - 3 = `bounce` message with 147                       |
| 发送所有收到的代币和合约余额，并销毁智能合约                                                          | `mode` = 128, `flag` = 32      | `send_raw_message(msg, 160)` | `balance` - 0, `send` - 100 + 50 - 3 = 147                                                               |
| 发送所有收到的代币和合约余额，并销毁智能合约，如果在处理操作过程中出现错误--除了回滚交易外，还弹出消息。重要提示：避免这种行为，因为退款将转入已删除的合约。 | `mode` = 128, `flag` = 32 + 16 | `send_raw_message(msg, 176)` | `balance` - 0 + `147 (bounced)`, `send` - 100 + 50 - 3 = `bounce` message with 147                       |



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/overview.mdx
================================================
import Button from '@site/src/components/button'

# 简介

TON区块链上的智能合约是利用[TON虚拟机（TVM）]（/v3/documentation/smart-contracts/overview#ton-virtual-machine-tvm）和以下编程语言之一创建、开发和部署的：

* [Tact](/v3/documentation/smart-contracts/overview#-tact)
* [FunC](/v3/documentation/smart-contracts/overview#-func)

## 快速开始：您的第一个智能合约

使用_Blueprint_框架编写并部署您的第一个智能合约。

Blueprint 是一个用于编写、测试和部署智能合约的开发环境。
要创建一个新的演示项目，请使用以下命令：

```bash
npm create ton@latest
```

<Button href="/v3/documentation/smart-contracts/getting-started/javascript" colorType="primary" sizeType={'sm'}>

阅读更多

</Button>

<Button href="https://stepik.org/course/176754/" colorType={'secondary'} sizeType={'sm'}>

TON区块链课程

</Button>

## 开始

### 有趣且简单的教程

通过我们的新手指南开启您的旅程：

- [TON Hello World：逐步指导编写您的第一个智能合约](https://helloworld.tonstudio.io/02-contract/)
  - [🚩 挑战1：简单NFT部署](https://github.com/romanovichim/TONQuest1)
  - [🚩 挑战2：聊天机器人合约](https://github.com/romanovichim/TONQuest2)
  - [🚩 挑战3：Jetton自动售卖机](https://github.com/romanovichim/TONQuest3)
  - [🚩 挑战4：彩票/抽奖](https://github.com/romanovichim/TONQuest4)
  - [🚩 挑战5：在5分钟内创建与合约互动的UI](https://github.com/romanovichim/TONQuest5)
  - [🚩 挑战6：分析Getgems市场上的NFT销售](https://github.com/romanovichim/TONQuest6)

### TON 课程

:::tip
在开始课程之前，请确保您已经对区块链技术的基础知识有了扎实的了解。如果您在知识方面存在差距，我们建议您参加[**区块链基础知识与TON**](https://stepik.org/course/201294/promo) （[RU版](https://stepik.org/course/202221/), [CHN版](https://stepik.org/course/200976/)）课程。
:::

我们隆重推出 **TON区块链课程** ，这是一本关于TON区块链的综合指南。该课程专为想要学习如何在 TON 区块链上创建智能合约和去中心化应用程序的开发人员设计。

它由 **九个模块** 组成，涵盖 TON 区块链基础知识、智能合约开发生命周期、FunC 编程语言和 TON 虚拟机（TVM）。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

查看TON课程

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

### 综合指南

打开示例

- [如何使用钱包智能合约](/v3/guidelines/smart-contracts/howto/wallet)

## 智能合约最佳实践

TON提供了无限可能性。来了解如何在遵循推荐指南的同时进行充分利用。

:::info 小提示
随意关注用 FunC 编写的智能合约。通常，专注于用 FunC (.fc) 编写的智能合约，而不是用较低级的 Fift (.fif) 语言编写的智能合约会更好。
:::

TON 上智能合约的标准示例包括钱包、选举人（在 TON 上管理验证）和多签名钱包，这些都可以在学习时作为参考。

<Button href="/v3/documentation/smart-contracts/contracts-specs/examples" colorType={'primary'} sizeType={'sm'}>

打开示例

</Button>

## 📘 FunC

TON 提供了无限的可能性。了解如何在遵守建议准则的同时充分利用它们。

- [智能合约指南](/v3/guidelines/smart-contracts/guidelines)

## TON 虚拟机（TVM）

探索运行您智能合约的引擎。

- [TVM 概览](/v3/文档/tvm/tvm-overview)

## 编程语言

### 📘 FunC

为TON智能合约量身定制的语言。

<Button href="/v3/documentation/smart-contracts/func/overview" colorType={'primary'} sizeType={'sm'}>

FunC概览

</Button>

### 📒 Tact

Tact 是适用于 TON 区块链的全新编程语言，注重开发的效率和简便性。它非常适合复杂的智能合约、快速入门和快速原型开发。

由 [TON Studio](https://tonstudio.io) 推出，由社区推动。

<Button href="https://tact-lang.org/"
        colorType={'primary'} sizeType={'sm'}>

官方网站

</Button>

<Button href="https://docs.tact-lang.org/"
        colorType={'secondary'} sizeType={'sm'}>

Tact 文档

</Button>

<Button href="https://tact-by-example.org/"
        colorType="secondary" sizeType={'sm'}>

Tact 实例

</Button>

### 📗 Tolk

用 TON 编写智能合约的新语言。将 Tolk 视为 "**下一代 FunC**"

:::caution
正在积极开发中。
:::

<Button href="/v3/documentation/smart-contracts/tolk/overview" colorType={'primary'} sizeType={'sm'}>

Tolk 概述

</Button>

### 进一步阅读

:::caution 高级水平
只适用于勇敢者！
:::

<Button href="/v3/documentation/smart-contracts/fift/overview" colorType={'primary'} sizeType={'sm'}>

Fift概览

</Button>

## 社区工具

- [MyLocalTON](/v3/guidelines/nodes/running-nodes/running-a-local-ton) - MyLocalTON 用于在本地环境中运行私有 TON 区块链。
- [tonwhales.com/tools/boc](https://tonwhales.com/tools/boc) — BOC解析器
- [tonwhales.com/tools/introspection-id](https://tonwhales.com/tools/introspection-id) — crc32生成器
- [@orbs-network/ton-access](https://www.orbs.com/ton-access/) — 去中心化API网关

## 进一步阅读

通过这些社区驱动的教育资源提高您的技能。

- [智能合约指南](/v3/guidelines/smart-contracts/guidelines)
- [TON FunC学习路径](https://blog.ton.org/func-journey) ([俄文版](https://github.com/romanovichim/TonFunClessons_ru))
- [YouTube教程](https://www.youtube.com/@TONDevStudy) [[俄文版]](https://www.youtube.com/@WikiMar)

## 额外资源

- [什么是区块链？什么是智能合约？什么是gas？](https://blog.ton.org/what-is-blockchain)
- [了解交易费用](/v3/guidelines/smart-contracts/fee-calculation)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm.mdx
================================================
# 无限分片范式

## 理解TON区块链中的拆分合并

TON（Telegram Open Network）区块链引入了一些创新概念来提高区块链的可扩展性和效率。其中一个概念是拆分合并功能，这是其区块链架构的一个组成部分。本短文探讨了TON区块链中拆分合并的关键方面，重点讨论其在无限分片范式（ISP,Infinity Sharding Paradigm）中的作用。

#### 无限分片范式（ISP）及其应用

ISP是TON区块链设计的基础，将每个账户视为其独立的“账户链”的一部分。这些账户链然后被聚合到分片链块中以提高效率。一个分片链的状态包括其所有账户链的状态。因此，一个分片链区块本质上是一系列分配给它的虚拟账户区块的集合。

- **ShardState**：近似表示为 Hashmap(n, AccountState)，其中n是account_id的位长度。
- **ShardBlock**：近似表示为 Hashmap(n, AccountBlock)。

每个分片链，或更准确地说，每个分片链区块，由`workchain_id`和账户id的二进制前缀`s`的组合来标识。

## 分片示例

![](/img/docs/blockchain-fundamentals/split-merge.svg)

1. 对每个区块的区块大小(Block size estimation) 、gas消耗量(Gasconsumption)和区块的起始点和终点点点之间的差异( lt delta)去计算它们的变化量
2. 使用这些值，可将区块视为超载或欠载。
3. 每个分片都会保存欠载和过载历史。如果最近有足够多的区块被欠载或超载，就会设置 `want_merge` 或 `want_split` 标志。
4. 验证器使用这些标志合并或拆分分片。

### 1. 对当前区块状态评估

总之，TON区块链中的拆分合并是一个复杂但高效的机制，增强了区块链网络的可扩展性和交互性。它体现了TON解决常见区块链挑战的方法，强调效率和全局一致性。

1. _Block size estimation_ - 不是实际的块大小，而是在整理过程中计算出的估计值。
2. _Gas consumption_ - 所有交易中消耗的 gas 总量（不包括 ticktock 和造币/回收特殊交易）。
3. _Lt delta_ -- 区块起始和结束时长之差。

### 分片链的拆分和非拆分部分

一个分片链块和状态分为两部分：

1. **拆分部分**：符合ISP形式，包含特定于账户的数据。
2. **非拆分部分**：涉及区块与其他区块和外部世界的交互相关的数据。
3. _Lt delta_：`1000/5000/10000`.
   此外，还有一个中等限制，等于 `(soft + hard) / 2`。

我们将三个参数 (大小(size) 、gas和 lt delta) 分类为类别：

- `0` - 未达到欠载限制。
- `1` - 超过欠载限制。
- `2` - 超过软限制。
- `3` - 超过介质限制。
- `4` - 超过硬限制。

区块分类最终的标准以最大值为主，在 (“size”、“gas”、“lt delta” ) 中取最大值
。 例如，如果尺寸分类为2，气体分类为3， lt delta的分类是。据此可以判断出最后的区块分类是3。

- 当块的分类是0 (underload) 时，该块倾向于与其他合并。
- 当块的分类为 2  轻微 (soft) 限制已经达到时，整理器停止处理内部消息。该块倾向于分裂。
- 当块的分类为 3 达到中等 (medium) 限制时，整理器停止处理外部消息。

### 3. 过载或欠载的判定

在对数据块进行分类后，整理器会检查过载和欠载情况。
出站报文队列的大小和调度队列的处理状态也在考虑之列。

- 如果区块类别大于等于“2” (soft) 并且消息队列大小没有超过“SPLIT_MAX_QUEUE_SIZE = 100000”，则该块过载。
- 如果达到了调度队列中已处理消息总数的限制，并且消息队列大小没有超过`SPLIT_MAX_QUEUE_SIZE = 100000`，则该区块判定为过载。
- 如果区块类别为“0” (欠载) 且消息队列大小没有超过“MERGE_MAX_QUEUE_SIZE = 2047”，则该块欠载。
- 如果消息队列尺寸大于等于`FORCE_SPLIT_QUEUE_SIZE = 4096`且没有超过`SPLIT_MAX_QUEUE_SIZE = 100000`，则该区块将被当作超载。

### 4. 决定区块的拆分还是合并

每个区块都保存着过载和欠载的历史记录——这是一个64位的掩码，记录了最近64个区块的过载/欠载状态 ，它被用来决定是否要进行分割或合并。

分片链状态中的OutMsgQueue是一个关键的非拆分部分。它保存OutMsgDescr中的未处理消息，直到它们被处理或发送到目的地。

当欠载或过载的历史记录具有非负权重时，会设置 `want_merge` 或 `want_split` 标志。

### 5. 区块分割合并的最后决定

验证者 (Validators ) 使用 `want_split`和 `want_merge`标志以及`工作链配置参数`[workchain configuration parameters](/v3/documentation/network/configs/blockchain-configs#param-12).来决定是否要分割或合并分片(shards)。

- [区块布局](/develop/data-formats/block-layout)
- [白皮书](/learn/docs)
- 深度为 `min_split` 的分片不能合并，深度为 `max_split` 的分片不能分割。
- 如果区块有`want_split`标志，分片将会分割。
- 如果区块及其兄弟区块都设置了 `want_merge` 标志，则这些分片将会合并。

分片将在做出决定后的 `split_merge_delay = 100` 秒内进行分割和合并。

## 消息和即时超立方路由（即时超立方路由）

在无限分片模式中，每个账户（或智能合约）都被视为独立的分片链。
账户之间的交互仅通过发送消息来实现，这也是账户作为行为体的行为体模型的一部分。分片链之间高效的消息传递系统对 TON 区块链的运行至关重要。 
TON 的一项功能是即时超立方路由（Instant Hypercube Routing），它可以在分片链之间快速传递和处理消息，确保在一个分片链的一个区块中创建的消息在目标分片链的下一个区块中得到处理，而不管它们在系统中的编号如何。

## 分片示例

![](/img/docs/blockchain-fundamentals/shardchains.jpg)

在提供的图形方案中：

- 工作链的分片按时间划分，用虚线表示。
- 区块 222、223 和 224 与 seqno=102 的主链区块有关。在这里，222 位于一个分片中，而 223 和 224 位于另一个分片中。
- 如果发生拆分或合并事件，受影响的分片会暂停，直到下一个主链块。

总之，TON区块链中的拆分合并是一个复杂但高效的机制，增强了区块链网络的可扩展性和交互性。它体现了TON解决常见区块链挑战的方法，强调效率和全局一致性。

## 分片细节

#### 分片链的拆分和非拆分部分

一个分片链块和状态分为两部分：

1. **拆分部分**：符合ISP形式，包含特定于账户的数据。
2. **非拆分部分**：涉及区块与其他区块和外部世界的交互相关的数据。

#### 与其他块的交互

非拆分部分对于确保全局一致性至关重要，简化为内部和外部的局部一致性条件。它们对以下方面非常重要：

- 分片链之间的消息转发。
- 涉及多个分片链的交易。
- 交付保证和验证，关于区块的初始状态与其前一个区块的一致性。

#### 入站和出站消息

分片链区块的非拆分部分的关键组成部分包括：

- **InMsgDescr**：导入到区块的所有消息的描述(例如，由包含在区块中的交易处理或转发到输出队列， 如果是沿着\`Hypercube Routing'指定的路径路由的中转消息，则是如此) 。
- **OutMsgDescr**：区块输出或生成的所有消息的描述（即由区块中包含的交易生成的消息，或目的地不属于当前分片链的中转消息，由 `InMsgDescr` 转发）。

#### 区块头和验证者签名

区块头是另一个非拆分组件，包含 `workchain_id`、`account_ids` 的二进制前缀、区块序列号（定义为大于其前代序列号的最小非负整数）、逻辑时间和时间戳生成等基本信息。它还包含该区块的直接前置区块的哈希值（或其两个直接前置区块的哈希值，如果之前发生了
分片链合并事件）、其初始状态和最终状态（即处理当前区块之前和之后的分片链状态）的哈希值，以及生成该分片链区块时已知的最新主链区块的哈希值。验证者签名被附加到未签名区块上，形成被签名的区块。

#### 出站消息队列

分片链状态中的 "OutMsgQueue "是一个关键的非拆分部分。它包含了`OutMsgDescr`中的未交付消息，这些消息可能是由导致此状态的最后一个分片链区块或其前一个分片链区块发出的。 
最初，每条发出的消息都会被包含在 "OutMsgQueue "中并存储在那里，直到它们被处理或传递到目的地。

#### 分片的拆分和合并机制

在动态分片的背景下，分片配置可能因拆分和合并事件而变化。这些事件与主链区块同步。例如，如果发生拆分或合并，受影响的分片会等待下一个主链区块之后再继续。

## 参阅

- [区块布局](/v3/documentation/data-formats/tlb/block-layout)
- [白皮书](/v3/documentation/whitepapers/overview)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/shards/shards-intro.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/shards/shards-intro.mdx
================================================
# 分片

分片是一个成熟的概念，起源于[数据库设计](https://en.wikipedia.org/wiki/Shard_(database_architecture))。它是指将一个逻辑数据集拆分并分布到多个数据库中，这些数据库不共享任何内容，并可跨多个服务器部署。 
简单地说，分片允许横向扩展--将数据分割成可以并行处理的不同独立片段。这是世界从数据向[大数据](https://en.wikipedia.org/wiki/Big_data)过渡的一个关键概念。 
当数据集变得太大，无法用传统方法处理时，除了将其分解成更小的片段外，就没有其他扩展方法了。

分片是TON区块链中的一种机制，它允许处理大量交易。TON中分片的主要思想是，当账户A向账户B发送消息，同时账户C向账户D发送消息时，这两个操作都可以异步进行。

默认情况下，在基本链（`workchain=0`）中只有一个分片，其分片号为 `0x8000000000000000`（或二进制表示为 `1000000000000000000000000000000000000000000000000000000000000000`）。主链（`workchain=-1`）始终只有一个分片。

## 拆分

每个分片负责一些具有某些共同二进制前缀的账户子集。这个前缀出现在分片ID中，由一个64位整数表示，其结构为：`<二进制前缀>100000...`。例如，ID为 `1011100000...` 的分片包含所有以前缀 `1011` 开头的账户。

当某个分片中的交易数量增长时，它会分裂成两个分片。新分片获得以下ID：`<父前缀>01000...` 和 `<父前缀>11000...`，分别负责以 `<父前缀>0` 和 `<父前缀>1` 开头的账户。分片中的区块序列号从父区块的最后一个序列号加1开始连续。拆分后，分片独立进行，可能会有不同的序列号。

## 工作链

示例：

## 独特性

在设计 TON 区块链时，我们做出了两个关键决定，使其在其他使用分片技术的区块链中独树一帜。

当分片负载下降时，它们可以按如下方式合并回去：

TON 与众不同的第二个解决方案是分片数量不固定的原则。与以太坊 2.0 等支持固定分片数量（64 个分片）的系统不同，TON 允许根据网络需要添加越来越多的分片，每个工作链的理论上限为 2<sup>60</sup> 个分片。
这个数字大到几乎是无限的，可以为地球上的每个人提供超过 1 亿个分片，而且还有剩余。这种方法是满足难以提前预测的动态扩展要求的唯一途径。

示例：

## 分割

在TON区块链中，单个账户的交易序列（例如 `Tx1 -> Tx2 -> Tx3 -> ...` ）被称为账户交易链或账户链（<b>AccountChain</b>）。这强调了它是与单个账户相关联的交易序列。
单个分区内的多个此类<b>账户</b>交易<b>链</b>组合在一起就形成了<b>分区链</b>。<b>ShardChain</b>（以下简称 "分片"）负责存储和处理分块内的所有交易，其中每个交易链都由特定的账户组定义。

这些账户组由一个共同的二进制前缀表示，作为将它们聚类到同一分片的标准。
前缀出现在分片 id 中，分片 id 是一个 64 位整数，结构如下：`<binary prefix>100000...`。例如，id 为 `1011100000...` 的分片包含所有以前缀 `1011` 开头的账户。

当某个分片的交易数量增加时，该分片就会分裂成两个分片。新分片获得以下 id：`<parent prefix>01000...`和`<parent prefix>11000...`，并负责相应的以`<parent prefix>0`和`<parent prefix>1`开头的账户。分片中区块的序列号从父代最后一个序列号加 1 开始连续变化。拆分后，分片独立运行，可能会有不同的序列号。

举个简单的例子：
![](/img/docs/blockchain-fundamentals/shardchains-split.jpg)

主链区块的头部包含分片信息。分片区块出现在主链头部后，可视为已完成（不能回滚）。

一个真实的例子：

- 主链区块 `seqno=34607821` 有 2 个分片：`(0,4000000000000000,40485798)` and `(0,c000000000000000,40485843)` (https://toncenter.com/api/v2/shards?seqno=34607821).
- 分片`shard=4000000000000000`被拆分成`shard=2000000000000000`和`shard=6000000000000000`，主链区块`seqno=34607822`得到3个分片：`(0,c000000000000000,40485844)`, `(0,2000000000000000,40485799)` and `(0,6000000000000000,40485799)`.请注意，这两个新分片的序列号相同，但分片 ID 不同 (https://toncenter.com/api/v2/shards?seqno=34607822)。
- 新分片独立运行，100 个主链区块后（在主链区块 `seqno=34607921` 中），一个分片拥有最后一个区块 `(0,2000000000000000,40485901)`，另一个分片拥有 `(0,6000000000000000,40485897)`（https://toncenter.com/api/v2/shards?seqno=34607921）。

## 合并

如果分片的负载下降，它们就可以合并回来：

- 两个分片可以合并，如果它们有一个共同的父分片，因此，它们的分片id是`<parent prefix>010...` 和`<父前缀110...`。合并后的分片将拥有分片 ID `<parent prefix>10...` （例如 `10010...` + `10110...` = `1010...`）。合并分片的第一个区块将具有 `seqno=max(seqno1, seqno2) + 1`。

举个简单的例子：
![](/img/docs/blockchain-fundamentals/shardchains-merge.jpg)

一个真实的例子：

- 在主链区块 "seqno=34626306 "中，最后一个区块"(0,a000000000000000,40492030) "和"(0,e000000000000000,40492216) "的五个分片中的两个合并为一个区块"(0,c000000000000000,40492217)"（https://toncenter.com/api/v2/shards?seqno=34626306 和 https://toncenter.com/api/v2/shards?seqno=34626307）。

## 另请参见

- [无限分片范式](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm)
- [白皮书](/v3/documentation/whitepapers/overview)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/changelog.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/changelog.md
================================================
# Tolk 的历史

当 Tolk 发布新版本时，我们将在此提及。

## v0.6

首次公开发布。以下是关于其起源的一些说明：

## Tolk 是如何诞生的

2024 年 6 月，我创建了一个拉取请求 [FunC v0.5.0](https://github.com/ton-blockchain/ton/pull/1026)。
除了这份 PR 之外，我还写了一份路线图--FunC 在语法和语义上有哪些可以改进的地方。

总而言之，与其合并 v0.5.0，继续开发 FunC，我们决定 **fork** 它。
让 FunC 保持原样。一如既往。并开发一种新的语言，由一个全新的名称来驱动。

几个月来，我一直在私下开发 Tolk。我进行了大量的修改。
这不仅仅是语法的问题。例如，Tolk 拥有 FunC 完全没有的内部 AST 表示法。

在 11 月 1-2 日于迪拜举行的 TON Gateway 上，我发表了演讲，向公众介绍了 Tolk，并在当天发布了视频。
一旦有了视频，我会把它附在这里。

这是第一个拉取请求：["Tolk Language: next-generation FunC"](https://github.com/ton-blockchain/ton/pull/1345)。

Tolk 语言的第一个版本是 v0.6，它是 FunC v0.5 的一个隐喻，错过了出现的机会。

## 名字 "Tolk "的含义

我将在 TON Gateway 上公布 Tolk 之后更新本节内容。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/overview.mdx
================================================
---
title: 概述
---

import Button from '@site/src/components/button'

# Tolk 语言：概述

**Tolk** 是一种在TON中编写智能合约的新语言。可以将 Tolk 视为 "**下一代 FunC**"。
Tolk 编译器是 FunC 编译器的分叉，引入了类似于 TypeScript 的熟悉语法，
，但保留了所有底层优化。

```tolk
import "storage.tolk"

fun loadData() {
    ctxCounter = getContractData().beginParse().loadUint(32);
}

fun onInternalMessage(msgValue: int, msgFull: cell, msgBody: slice) {
    var cs = msgFull.beginParse();
    var flags = cs.loadMessageFlags();
    if (isMessageBounced(flags)) {
        return;
    }
    ...
}

get currentCounter(): int {
    loadData(); // fills global variables
    return ctxCounter;
}
```

<details>
  <summary><b>参见用 FunC 实现的相同逻辑</b></summary>

```func
#include "storage.fc";

() load_data() impure {
  slice cs = get_data().begin_parse();
  ctx_counter = cs~load_uint(32);
}

() recv_internal(int msg_value, cell msg_full, slice msg_body) impure {
  slice cs = msg_full.begin_parse();
  int flags = cs.load_uint(4);
  if (flags & 1) {
    return ();
  }
  ...
}

int currentCounter() method_id {
  load_data(); ;; fills global variables
  return ctx_counter;
}
```

</details>

<Button href="https://github.com/ton-blockchain/convert-func-to-tolk" colorType={'primary'} sizeType={'sm'}>
  尝试使用 FunC → Tolk 转换器
</Button>
<Button href="/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short" colorType={'secondary'} sizeType={'sm'}>
  阅读 "Tolk vs FunC 的区别"
</Button>
<div style={{height: '2em'}}></div>

## Tolk 背后的动机

FunC 太棒了。
它非常底层，鼓励程序员思考编译器内部问题。
它提供了对 TVM 汇编程序的完全控制，允许程序员尽可能有效地执行合约。
如果你习惯了它，你就会爱上它。

但有一个问题。
FunC 是 "函数式 C"，是为忍者设计的。
如果你热衷于 Lisp 和 Haskell，你会很高兴。
但如果你是一名 JavaScript / Go / Kotlin 开发者，它的语法对你来说很特别，会导致你偶尔犯错。
语法上的困难可能会降低您钻研 TON 的动力。

想象一下，如果有一种语言，同样智能，同样低级，但不是函数式的，也不像 C 语言，那会怎样？
撇开所有的美感和复杂性不谈，如果它乍一看更像流行语言呢？

这就是 Tolk 的意义所在。

## 从 FunC 迁移到 Tolk

如果您了解 FunC 并想尝试新的语法，您的方法是

1. 阅读 [Tolk vs FunC: in short](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short)。
2. 使用 blueprint ，创建一个新的 Tolk 合约（例如，一个计数器）并进行实验。请记住，几乎所有的 stdlib 函数都被重命名为 ~~verbose~~ 清晰的名称。下面是 [映射](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)。
3. 请尝试使用[转换器](https://github.com/ton-blockchain/convert-func-to-tolk)或[FunC 合约](/v3/documentation/smart-contracts/contracts-specs/examples)中的转换器。请记住，用 Tolk 从头开始编写的合约肯定比自动转换的合约更美观。例如，使用逻辑运算符而不是按位运算符可以大大提高代码的可读性。

## 如果不了解 FunC，如何尝试 Tolk

:::tip 目前，本文档假定您知道 FunC
文档介绍了 "Tolk 与 FunC" 的区别。
稍后，它将进行调整，以适应新用户的需要。此外，FunC 最终将被弃用，
，整个文档中的所有代码片段都将改写为 Tolk。
:::

如果您是 TON 的新用户，您的方法是

1. 阅读[本文档](/v3/documentation/smart-contracts/overview)，掌握TON开发的基本知识。无论使用哪种语言，您都需要了解 cell 、 slice 和 TON 的异步特性。
2. 面对 FunC 代码段，您仍然可以使用 FunC，或者尝试用 Tolk 来表达同样的意思。如果您觉得 FunC 语法很奇怪，不用担心：Tolk 的目标正是解决这个问题。
3. 一旦您对发生的事情有了一定的了解，请尝试使用 Tolk 和 [ blueprint ](https://github.com/ton-org/blueprint)。

## 围绕 Tolk 的工具

Tolk 编译器的源代码是 `ton-blockchain` [repo](https://github.com/ton-blockchain/ton) 的一部分。
除了编译器，我们还有

1. [tolk-js](https://github.com/ton-blockchain/tolk-js) - Tolk 编译器的 WASM 封装。
2. [JetBrains IDE 插件](https://github.com/ton-blockchain/intellij-ton) 除支持 FunC、Fift、TL/B 和 Tact 外，还支持 Tolk。
3. [VS 代码扩展](https://github.com/ton-blockchain/tolk-vscode) 启用 Tolk 语言支持。
4. [从 FunC 到 Tolk 的转换器](https://github.com/ton-blockchain/convert-func-to-tolk) - 使用一条 `npx` 命令将 `.fc` 文件转换为 `.tolk` 文件。
5. Tolk 可在 [ blueprint ](https://github.com/ton-org/blueprint)中使用。

## Tolk 可以生产吗？

Tolk编译器是FunC编译器的一个分叉，尽管目前还处于试验阶段，但已经可以投入生产。

可能存在未被发现的错误，这些错误可能是从 FunC 继承下来的，也可能是 TVM 特性造成的。
总之，无论使用哪种语言，都应该对合约进行测试，以达到高可靠性。

## 路线图

Tolk 的第一个发布版本是 v0.6，强调 [missing](/v3/documentation/smart-contracts/tolk/changelog#how-tolk-was-born) FunC v0.5。

以下是需要调查的一些要点（但不是全部，也没有任何顺序）：

- 类型系统改进：布尔类型、无效性、字典
- 结构，在 cell 之间自动打包，可能与消息处理程序集成在一起
- 有方法的结构，可能还包括内置类型
- 在语法上或通过代码生成与 TL 方案进行一些整合
- 人类可读的编译器错误
- 更轻松地发送信息
- 为常见的使用情况提供更好的体验（jettons、nft 等）。
-  gas 和堆栈优化、AST 内联
- 扩展和维护 stdlib
- 考虑某种 ABI（探索者如何 "看到 "字节码）
- 从总体上考虑 gas 和收费管理问题

请注意，上述大部分要点的实现都是一个挑战。
首先，必须对 FunC 内核进行全面重构，使其与非设计用途的能力 "杂交"。

此外，我认为 Tolk 的发展部分是以社区需求为导向的。
如果能与创建了互联 FunC 合约的开发者进行交流，
，了解他们的痛点，并讨论如何以不同的方式完成工作，那将会非常好。

## 问题和联系方式

如果遇到问题，请登录 [TON Dev Chats](https://t.me/addlist/1r5Vcb8eljk5Yzcy) 或创建 GitHub 问题。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail.mdx
================================================
# Tolk vs FunC：详细介绍

下面是一份非常庞大的清单。有人有足够的耐心读到最后吗？

:::tip 有一个紧凑型版本
这里：[Tolk vs FunC：简而言之](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short)
:::

<h3 className="cmp-func-tolk-header">
  ✅ Traditional comments :)
</h3>

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{';; comment'}</code></td>
    <td><code>{'// comment'}</code></td>
  </tr>
  <tr>
    <td><code>{'{- multiline comment -}'}</code></td>
    <td><code>{'/* multiline comment */'}</code></td>
  </tr>
  </tbody>
</table>

<h3 className="cmp-func-tolk-header">
  ✅ `2+2` 是 4，不是标识符。标识符只能是字母数字
</h3>

在 FunC 中，几乎所有字符都可以作为标识符的一部分。
例如，`2+2`（不含空格）就是一个标识符。
你甚至可以用这样的名称声明一个变量。

在 Tolk 中，空格不是必须的。`2+2` 是 4，如所料。`3+~x` 是 `3 + (~ x)`，以此类推。

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'return 2+2;  ;; undefined function `2+2`'}</code></td>
    <td><code>{'return 2+2;  // 4'}</code></td>
  </tr>
  </tbody>
</table>

更确切地说，一个标识符可以从 <code style={{display: 'inline-block'}}>{'[a-zA-Z$_]'}</code>
开始，并由 <code style={{display: 'inline-block'}}>{'[a-zA-Z0-9$_]'}</code> 继续。请注意，`?`、`:` 和其他符号都不是有效的符号，`found?` 和 `op::increase` 也不是有效的标识符。

您可以使用反标包围标识符，然后它可以包含任何符号（类似于 Kotlin 和其他一些语言）。它的潜在用途是允许将关键字用作标识符，例如在使用方案生成代码时。

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'const op::increase = 0x1234;'}</code></td>
    <td><code>{'const OP_INCREASE = 0x1234;'}</code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: ';; even 2%&!2 is valid<br>int 2+2 = 5;'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '// don\'t do like this :)<br>var \`2+2\` = 5;'}}></code></td>
  </tr>
  </tbody>
</table>

<h3 className="cmp-func-tolk-header">
  ✅ 默认情况下不纯净，编译器不会放弃用户函数调用
</h3>

FunC 有一个 `impure` 函数指定符。如果没有，函数将被视为纯函数。如果其结果未被使用，则编译器删除了其调用。

虽然这种行为已经记录在案，但对于新手来说，还是非常出乎意料。
例如，各种不返回任何内容的函数（如在不匹配时抛出异常），
，都会被默默删除。FunC 不检查和验证函数体，
允许在纯函数内部进行不纯净的操作，从而破坏了这种情况。

在 Tolk，默认所有功能都是不纯洁的。 你可以用注释标记纯函数,
然后禁止其身体中的不纯操作(异常、全局修改、 调用非纯函数等)。

<h3 className="cmp-func-tolk-header">
  ✅ 新函数语法：`fun` 关键字、`@` 属性、右侧的类型（如 TypeScript、Kotlin、Python 等）
</h3>

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'cell parse_data(slice cs) { }'}</code></td>
    <td><code>{'fun parse_data(cs: slice): cell { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'(cell, int) load_storage() { }'}</code></td>
    <td><code>{'fun load_storage(): (cell, int) { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'() main() { ... }'}</code></td>
    <td><code>{'fun main() { ... }'}</code></td>
  </tr>
  </tbody>
</table>

变量类型 - 也在右侧：

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'slice cs = ...;'}</code></td>
    <td><code>{'var cs: slice = ...;'}</code></td>
  </tr>
  <tr>
    <td><code>{'(cell c, int n) = parse_data(cs);'}</code></td>
    <td><code>{'var (c: cell, n: int) = parse_data(cs);'}</code></td>
  </tr>
  <tr>
    <td><code>{'global int stake_at;'}</code></td>
    <td><code>{'global stake_at: int;'}</code></td>
  </tr>
  </tbody>
</table>

修改器 `inline` 及其他 - 带注释：

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: '<br>int f(cell s) inline {'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '@inline<br>fun f(s: cell): int {'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: '<br>() load_data() impure inline_ref {'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '@inline_ref<br>fun load_data() {'}}></code></td>
  </tr>
  <tr>
    <td><code>{'global int stake_at;'}</code></td>
    <td><code>{'global stake_at: int;'}</code></td>
  </tr>
  </tbody>
</table>

`forall` - 是这样的：

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'forall X -> tuple cons(X head, tuple tail)'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'fun cons&amp;lt;X&amp;gt;(head: X, tail: tuple): tuple'}}></code></td>
  </tr>
  </tbody>
</table>

`asm` 实现--与 FunC 中一样，但由于正确对齐，看起来更漂亮：

```tolk
@pure
fun third<X>(t: tuple): X
    asm "THIRD";

@pure
fun iDictDeleteGet(dict: cell, keyLen: int, index: int): (cell, slice, int)
    asm(index dict keyLen) "DICTIDELGET NULLSWAPIFNOT";

@pure
fun mulDivFloor(x: int, y: int, z: int): int
    builtin;
```

还有一个 `@deprecated` 属性，不影响编译，但可用于人和 IDE。

<h3 className="cmp-func-tolk-header">
  ✅ `get` 代替 `method_id`
</h3>

在 FunC 中，`method_id`（不含参数）实际上声明了一个 get 方法。而在 Tolk 中，使用的是简单明了的语法：

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int seqno() method_id { ... }'}</code></td>
    <td><code>{'get seqno(): int { ... }'}</code></td>
  </tr>
  </tbody>
</table>

`get methodName()` 和 `get fun methodName()` 都是可以接受的。

对于 `method_id(xxx)`（在实践中不常见，但有效），有一个属性：

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: '<br>() after_code_upgrade(cont old_code) impure method_id(1666)'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '@method_id(1666)<br>fun afterCodeUpgrade(oldCode: continuation)'}}></code></td>
  </tr>
  </tbody>
</table>

<h3 className="cmp-func-tolk-header">
  ✅ 必须声明参数类型（尽管本地参数可有可无）
</h3>

```tolk
// not allowed
fun do_smth(c, n)
// types are mandatory
fun do_smth(c: cell, n: int)
```

有一种 `auto` 类型，因此 `fun f(a: auto)` 是有效的，但不推荐使用。

如果参数类型是强制性的，则返回类型不是（这通常是显而易见的啰嗦）。如果省略，则表示 "自动"：

```tolk
fun x() { ... }  // auto infer return
```

对于局部变量，类型也是可选的：

```tolk
var i = 10;                      // ok, int
var b = beginCell();             // ok, builder
var (i, b) = (10, beginCell());  // ok, two variables, int and builder

// types can be specified manually, of course:
var b: builder = beginCell();
var (i: int, b: builder) = (10, beginCell());
```

<h3 className="cmp-func-tolk-header">
  ✅ 不允许在同一作用域中重新声明变量
</h3>

```tolk
var a = 10;
...
var a = 20;  // error, correct is just `a = 20`
if (1) {
    var a = 30;  // it's okay, it's another scope
}
```

因此，不允许部分重新分配：

```tolk
var a = 10;
...
var (a, b) = (20, 30);  // error, releclaration of a
```

请注意，这对 `loadUint()` 和其他方法来说不是问题。在 FunC 中，它们返回一个修改后的对象，因此 `var (cs, int value) = cs.load_int(32)` 这种模式非常常见。在 Tolk 中，此类方法会改变对象：`var value = cs.loadInt(32)`，因此不太可能需要重新声明。

```tolk
fun send(msg: cell) {
    var msg = ...;  // error, redeclaration of msg

    // solution 1: intruduce a new variable
    var msgWrapped = ...;
    // solution 2: use `redef`, though not recommended
    var msg redef = ...;
```

<h3 className="cmp-func-tolk-header">
  ✅ 类型系统的变化
</h3>

Tolk 第一个版本中的类型系统与 FunC 中的相同，但做了以下修改：

- `void` 实际上是一个空张量（命名为 `unit` 更规范，但 `void` 更可靠）；另外，`return`（不含表达式）实际上是 `return()`，是从 void 函数返回的一种方便方式。

```tolk
fun setContractData(c: cell): void
    asm "c4 POP";
```

- `auto` 表示 "自动推断"；在 FunC 中，`_` 用于此目的；注意，如果函数没有指定返回类型，它就是 `auto`，而不是 `void`。
- `self`，以创建可链式方法，如下所述；实际上，它不是一种类型，它只能出现在函数中，而不是函数的返回类型中
- `cont` 更名为 `continuation`

<h3 className="cmp-func-tolk-header">
  ✅ recv_internal / recv_external 的另一种命名方式
</h3>

```tolk
fun onInternalMessage
fun onExternalMessage
fun onTickTock
fun onSplitPrepare
fun onSplitInstall
```

所有参数类型及其顺序重命名不变，只是命名有所改变。`fun main` 也可用。

<h3 className="cmp-func-tolk-header">
  ✅ #include → import.严格导入
</h3>

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'#include "another.fc";'}</code></td>
    <td><code>{'import "another.tolk"'}</code></td>
  </tr>
  </tbody>
</table>

在 Tolk 中，如果不导入该文件，就无法使用 `a.tolk` 中的符号。换句话说，就是 `用什么导入什么`。

所有 stdlib 函数开箱即用，无需下载 stdlib 和 `#include "stdlib.fc"`。有关嵌入式 stdlib，请参阅下文。

命名仍有全局范围。如果 `f` 在两个不同的文件中声明，就会出错。我们 "导入 "的是整个文件，而不是每个文件的可见性，`export` 关键字现在还不支持，但将来可能会支持。

<h3 className="cmp-func-tolk-header">
  ✅ #pragma → 编译器选项
</h3>

在 FunC 中，"允许事后修改"（allow-post-modifications）等 "试验性 "功能是通过 .fc 文件中的一个 pragma 打开的（导致有些文件包含，有些不包含的问题）。事实上，这不是文件的 pragma，而是编译选项。

在 Tolk 中，所有实用程序都被移除。`allow-post-modification` 和 `compute-asm-ltr` 被合并到 Tolk 源中（就像它们在 FunC 中一直处于开启状态一样）。现在可以传递实验选项来代替语法标记。

目前，我们引入了一个实验性选项-- `remove-unused-functions`（删除未使用的函数），它不会将未使用的符号包含到 Fift 输出中。

`#pragma version xxx` 被 `tolk xxx` 代替（没有 >=，只有严格版本）。注释您正在使用的编译器版本是一个很好的做法。如果不匹配，Tolk 会发出警告。

```tolk
tolk 0.6
```

<h3 className="cmp-func-tolk-header">
  ✅ 后期符号解析。AST 表示
</h3>

在 FunC 中（如在 С 中），不能访问下面声明的函数：

```func
int b() { a(); }   ;; error
int a() { ... }    ;; since it's declared below
```

为避免出错，程序员应首先创建一个正向声明。因为符号解析是在解析时进行的。

Tolk 编译器将这两个步骤分开。首先是解析，然后是符号解析。因此，上述代码段不会出错。

听起来很简单，但在内部却是一项非常艰巨的工作。为了实现这一点，我引入了 FunC 完全没有的中间 AST 表示法。这是未来修改和执行语义代码分析的关键点。

<h3 className="cmp-func-tolk-header">
  ✅ `null` 关键字
</h3>

创建空值和检查变量是否为空现在看起来非常漂亮。

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'a = null()'}</code></td>
    <td><code>{'a = null'}</code></td>
  </tr>
  <tr>
    <td><code>{'if (null?(a))'}</code></td>
    <td><code>{'if (a == null)'}</code></td>
  </tr>
  <tr>
    <td><code>{'if (~ null?(b))'}</code></td>
    <td><code>{'if (b != null)'}</code></td>
  </tr>
  <tr>
    <td><code>{'if (~ cell_null?(c))'}</code></td>
    <td><code>{'if (c != null)'}</code></td>
  </tr>
  </tbody>
</table>

请注意，这并不意味着 Tolk 语言具有可空性。不，你仍然可以为一个整数变量赋值 `null` --就像在 FunC 中一样，只是在语法上更友好而已。经过对类型系统的努力，真正的可空性总有一天会实现。

<h3 className="cmp-func-tolk-header">
  ✅`throw` 和 `assert` 关键字
</h3>

Tolk 大大简化了处理异常的工作。

如果 FunC 有 `throw()`、`throw_if()`、`throw_arg_if()`，unless 也一样，那么 Tolk 就只有两个原语：`throw` 和 `assert`。

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'throw(excNo)'}</code></td>
    <td><code>{'throw excNo'}</code></td>
  </tr>
  <tr>
    <td><code>{'throw_arg(arg, excNo)'}</code></td>
    <td><code>{'throw (excNo, arg)'}</code></td>
  </tr>
  <tr>
    <td><code>{'throw_unless(excNo, condition)'}</code></td>
    <td><code>{'assert(condition, excNo)'}</code></td>
  </tr>
  <tr>
    <td><code>{'throw_if(excNo, condition)'}</code></td>
    <td><code>{'assert(!condition, excNo)'}</code></td>
  </tr>
  </tbody>
</table>

注意，`!condition` 是可能的，因为逻辑 NOT 可用，见下文。

`assert(condition,excNo)` 语法较长（冗长）：

```tolk
assert(condition) throw excNo;
// with possibility to include arg to throw
```

此外，Tolk 交换了 `catch` 参数：它是 `catch (excNo, arg)`，两个参数都是可选的（因为 arg 很可能是空的）。

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'try { } catch (_, _) { }'}</code></td>
    <td><code>{'try { } catch { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'try { } catch (_, excNo) { }'}</code></td>
    <td><code>{'try { } catch(excNo) { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'try { } catch (arg, excNo) { }'}</code></td>
    <td><code>{'try { } catch(excNo, arg) { }'}</code></td>
  </tr>
  </tbody>
</table>

<h3 className="cmp-func-tolk-header">
  ✅ `do ... until` → `do ... while`
</h3>

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'do { ... } until (~ condition);'}</code></td>
    <td><code>{'do { ... } while (condition);'}</code></td>
  </tr>
  <tr>
    <td><code>{'do { ... } until (condition);'}</code></td>
    <td><code>{'do { ... } while (!condition);'}</code></td>
  </tr>
  </tbody>
</table>

注意，`!condition` 是可能的，因为逻辑 NOT 可用，见下文。

<h3 className="cmp-func-tolk-header">
  ✅ 运算符优先级变得与 C++ / JavaScript相同 
</h3>

在 FunC 中，`if (slices_equal() & status == 1)` 会被解析为 `if( (slices_equal()&status) == 1 )`。这也是实际合约中出现各种错误的原因。

在 Tolk 中，`&` 的优先级较低，与 C++ 和 JavaScript 相同。

此外，Tolk 还会对可能错误的操作符用法进行错误触发，以彻底消除此类错误：

```tolk
if (flags & 0xFF != 0)
```

将导致编译错误（类似于 gcc/clang）：

```
& has lower precedence than ==, probably this code won't work as you expected.  Use parenthesis: either (... & ...) to evaluate it first, or (... == ...) to suppress this error.
```

因此，应该重写代码：

```tolk
// either to evaluate it first (our case)
if ((flags & 0xFF) != 0)
// or to emphasize the behavior (not our case here)
if (flags & (0xFF != 0))
```

我还为位移运算符中的一个常见错误添加了诊断功能：`a << 8 + 1` 等同于 `a << 9`，可能出乎意料。

```
int result = a << 8 + low_mask;

error: << has lower precedence than +, probably this code won't work as you expected.  Use parenthesis: either (... << ...) to evaluate it first, or (... + ...) to suppress this error.
```

操作符 `~% ^% /% ~/= ^/= ~%= ^%= ~>>= ^>>=` 不再存在。

<h3 className="cmp-func-tolk-header">
  ✅ 不可变变量，通过 `val` 声明
</h3>

就像在 Kotlin 中一样：`var` 表示可变，`val` 表示不可变，可选择在后面加上类型。FunC 没有类似的 `val`。

```tolk
val flags = msgBody.loadMessageFlags();
flags &= 1;         // error, modifying an immutable variable

val cs: slice = c.beginParse();
cs.loadInt(32);     // error, since loadInt() mutates an object
cs.preloadInt(32);  // ok, it's a read-only method
```

函数的参数是可变的，但由于它们是按值复制的，因此被调用的参数不会改变。这一点与 FunC 完全相同，只是为了说明一下。

```tolk
fun some(x: int) {
    x += 1;
}

val origX = 0;
some(origX);      // origX remains 0

fun processOpIncrease(msgBody: slice) {
    val flags = msgBody.loadInt(32);
    ...
}

processOpIncrease(msgBody);  // by value, not modified
```

在 Tolk 中，函数可以声明 `mutate` 参数。它是对 FunC `~` tilda 函数的概括，请阅读下文。

<h3 className="cmp-func-tolk-header">
  ✅ 删除过时的命令行选项
</h3>

删除了命令行标志 `-A`、`-P` 和其他标志。默认行为

```
/path/to/tolk {inputFile}
```

就足够了。使用 `-v` 打印版本并退出。使用 `-h` 查看所有可用的命令行标志。

只能传递一个输入文件，其他文件应 `import` 。

<h3 className="cmp-func-tolk-header">
  ✅ stdlib 函数重命名为 ~~verbose~~ 清晰名称，驼峰式
</h3>

重新考虑了标准库中的所有命名。现在，函数的命名更长但更清晰。

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'cur_lt()<br>car(l)<br>get_balance().pair_first()<br>raw_reserve(count)<br>dict~idict_add?(...)<br>dict~udict::delete_get_max()<br>t~tpush(triple(x, y, z))<br>s.slice_bits()<br>~dump(x)<br>...'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'getLogicalTime()<br>listGetHead(l)<br>getMyOriginalBalance()<br>reserveToncoinsOnBalance(count)<br>dict.iDictSetIfNotExists(...)<br>dict.uDictDeleteLastAndGet()<br>t.tuplePush([x, y, z])<br>s.getRemainingBitsCount()<br>debugPrint(x)<br>...'}}></code></td>
  </tr>
  </tbody>
</table>

以前的 "stdlib.fc "被拆分成多个文件：common.tlk、tvm-dicts.tlk 和其他文件。

继续此处：[Tolk vs FunC：标准库](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)。

<h3 className="cmp-func-tolk-header">
  ✅ stdlib 现在是嵌入式的，而不是从 GitHub 下载
</h3>

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>
      <ol style={{margin: 0}}>
        <li>Download stdlib.fc from GitHub</li>
        <li>Save into your project</li>
        <li>`#include "stdlib.fc";`</li>
        <li>Use standard functions</li>
      </ol>
    </td>
    <td>
      <ol style={{margin: 0}}>
        <li>Use standard functions</li>
      </ol>
    </td>
  </tr>
  </tbody>
</table>

在 Tolk 中，stdlib 是发行版的一部分。标准库是不可分割的，因为将 `语言、编译器、stdlib` 三者保持在一起是保持发布周期的唯一正确方法。

它是这样工作的。Tolk 编译器知道如何定位标准库。如果用户安装了 apt 软件包，stdlib 源也会被下载并存在硬盘上，因此编译器会通过系统路径找到它们。如果用户使用的是 WASM 封装器，则由 tolk-js 提供。以此类推。

标准库分为多个文件：`common.tolk`（最常用的函数）、`gas-payments.tolk`（计算 gas 费）、`tvm-dicts.tolk` 和其他文件。`common.tolk` 中的函数始终可用（编译器会隐式导入）。其他文件则需要明确导入：

```tolk
import "@stdlib/tvm-dicts"   // ".tolk" optional

...
var dict = createEmptyDict();
dict.iDictSet(...);
```

注意 "用什么导入什么" 的规则，它也适用于 `@stdlib/...` 文件（"common.tolk "是唯一的例外）。

JetBrains IDE 插件会自动发现 stdlib 文件夹，并在输入时插入必要的导入。

<h3 className="cmp-func-tolk-header">
  ✅ 逻辑运算符 `&& ||`, 逻辑非 `!`
</h3>

在 FunC 中，只有位运算符 `~ & | ^`。开发人员在进行第一步开发时，如果认为 "好吧，没有逻辑，我就用同样的方式使用位运算符"，往往会出错，因为运算符的行为是完全不同的：

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>`a & b`</th>
    <th>`a && b`</th>
  </tr>
  </thead>
  <tbody>
  <tr><td colSpan={2}>sometimes, identical:</td></tr>
  <tr>
    <td><code>{'0 & X = 0'}</code></td>
    <td><code>{'0 & X = 0'}</code></td>
  </tr>
  <tr>
    <td><code>{'-1 & X = -1'}</code></td>
    <td><code>{'-1 & X = -1'}</code></td>
  </tr>
  <tr><td colSpan={2}>but generally, not:</td></tr>
  <tr>
    <td><code>{'1 & 2 = 0'}</code></td>
    <td><code>{'1 && 2 = -1 (true)'}</code></td>
  </tr>
  </tbody>
</table>

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>`~ found`</th>
    <th>`!found`</th>
  </tr>
  </thead>
  <tbody>
  <tr><td colSpan={2}>sometimes, identical:</td></tr>
  <tr>
    <td><code>{'true (-1) → false (0)'}</code></td>
    <td><code>{'-1 → 0'}</code></td>
  </tr>
  <tr>
    <td><code>{'false (0) → true (-1)'}</code></td>
    <td><code>{'0 → -1'}</code></td>
  </tr>
  <tr><td colSpan={2}>but generally, not:</td></tr>
  <tr>
    <td><code>{'1 → -2'}</code></td>
    <td><code>{'1 → 0 (false)'}</code></td>
  </tr>
  </tbody>
</table>

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th><code>condition & f()</code></th>
    <th><code>condition && f()</code></th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code className="inline">f()</code> is called always</td>
    <td><code className="inline">f()</code> is called only if <code className="inline">condition</code></td>
  </tr>
  </tbody>
</table>

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th><code>condition | f()</code></th>
    <th><code>condition || f()</code></th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code className="inline">f()</code> is called always</td>
    <td><code className="inline">f()</code> is called only if <code className="inline">condition</code> is false</td>
  </tr>
  </tbody>
</table>

Tolk 支持逻辑运算符。它们的行为与您习惯的完全一样（右列）。目前，`&&` 和 `||` 有时会产生不理想的 Fift 代码，但将来 Tolk 编译器在这种情况下会变得更聪明。这可以忽略不计，只需像使用其他语言一样使用它们即可。

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'if (~ found?)'}</code></td>
    <td><code>{'if (!found)'}</code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'if (~ found?) {<br>    if (cs~load_int(32) == 0) {<br>        ...<br>    }<br>}'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'if (!found && cs.loadInt(32) == 0) {<br>    ...<br>}'}}></code></td>
  </tr>
  <tr>
    <td><code>{'ifnot (cell_null?(signatures))'}</code></td>
    <td><code>{'if (signatures != null)'}</code></td>
  </tr>
  <tr>
    <td><code>{'elseifnot (eq_checksum)'}</code></td>
    <td><code>{'else if (!eqChecksum)'}</code></td>
  </tr>
  </tbody>
</table>

删除了关键字 `ifnot` 和 `elseifnot` ，因为现在我们有了逻辑 not（为了优化，Tolk 编译器会生成 `IFNOTJMP`）。关键字 `elseif` 被传统的 `else if` 取代。

请注意，这并不意味着 Tolk 语言具有 `bool` 类型。不，比较运算符仍然返回整数。经过对类型系统的努力，总有一天会支持 `bool` 类型。

请记住，`true` 是-1，而不是 1。在 FunC 和 Tolk 中都是如此。这是一种 TVM 表示法。

<h3 className="cmp-func-tolk-header">
  ✅ 不使用 `~` 方法，改用 `mutate` 关键字
</h3>

这一改动非常巨大，因此在单独的页面上进行了描述：[Tolk 突变性](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)。

<hr />

<h3>Tolk vs FunC  gas 消耗量</h3>

:::caution TLDR
Tolk 的耗气量可能会更高一些，因为它可以解决 FunC 中意外的争论洗牌问题。实际上，这可以忽略不计。\
将来，Tolk 编译器会变得足够聪明，可以对参数重新排序，减少堆栈操作，
，但仍能避免洗牌问题。
:::

在调用汇编函数时，FunC 编译器可能会意外更改参数：

```
some_asm_function(f1(), f2());
```

有时，`f2()` 可能会在 `f1()` 之前被调用，这是意料之外的。
要解决这个问题，可以指定 `#pragma compute-asm-ltr`，强制参数总是按 ltr 顺序求值。
这只是试验性的，因此默认关闭。

这个 pragma 会对堆栈中的参数重新排序，通常会导致比不使用它时更多的堆栈操作。
换句话说，它可以修复意外行为，但会增加耗气量。

Tolk 将参数放入堆栈的方式与开启此实用程序完全相同。
因此，如果不使用该实用程序，其耗气量有时会高于 FunC。
当然，在 Tolk 中不存在洗牌问题。

未来，Tolk 编译器将变得足够智能，可以对参数重新排序，减少堆栈操作，
，但仍能避免洗牌问题。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short.md
================================================
# Tolk vs FunC：简而言之

与 C 和 Lisp 相比，Tolk 与 TypeScript 和 Kotlin 更为相似。
但它仍然可以让你完全控制 TVM 汇编程序，因为它内部有一个 FunC 内核。

1. 函数通过 `fun` 声明，获取方法通过 `get` 声明，变量通过 `var` 声明（不可变变量通过 `val` 声明），类型放在右边；参数类型是强制性的；返回类型可以省略（自动推断），本地类型也可以省略；`inline` 和其他指定符是 `@` 属性。

```tolk
global storedV: int;

fun parseData(cs: slice): cell {
    var flags: int = cs.loadMessageFlags();
    ...
}

@inline
fun sum(a: int, b: int) {   // auto inferred int
    val both = a + b;       // same
    return both;
}

get currentCounter(): int { ... }
```

2. 没有 `impure`，这是默认情况，编译器不会放弃用户函数调用
3. 不是 `recv_internal` 和 `recv_external`，而是 `onInternalMessage` 和 `onExternalMessage` 。
4. `2+2` 是 4，不是标识符；标识符是字母数字；使用命名 `const OP_INCREASE` 而不是 `const op::increase`
5. 支持逻辑运算符 AND `&&`、OR `||`、NOT `!`
6. 语法改进
   - `;; comment` → `// comment`
   - `{- comment -}` → `/* comment */`
   - `#include` → `import`，严格规定 "用什么导入什么"
   - `~ found` → `!found`（显然只适用于真/假）（"true "为-1，就像在 FunC 中一样）
   - `v = null()` → `v = null`
   - `null?(v)` → `v == null`，`builder_null?` 等也是如此
   - `~ null?(v)` → `c != null`
   - `throw(excNo)` → `throw excNo`
   - `catch(_, _)` → `catch`
   - `catch(_, excNo)` → `catch(excNo)`
   - `throw_unless(excNo, cond)` → `assert(cond, excNo)`
   - `throw_if(excNo, cond)` → `assert(!cond, excNo)`
   - `return ()` → `return`
   - `do ... until (cond)` → `do ... while (!cond)`
   - `elseif` → `else if`
   - `ifnot (cond)` → `if (!cond)`
7. 即使函数在下面声明，也可以被调用；不需要正向声明；编译器首先进行解析，然后进行符号解析；现在有了源代码的 AST 表示法
8. stdlib函数重命名为 ~~verbose~~ 清晰的名称，驼峰字体；现在是嵌入式的，而不是从GitHub下载的；它被分成几个文件；常用函数始终可用，更具体的可用 `import "@stdlib/tvm-dicts"`，IDE会建议您使用；这里是[一个映射](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)
9. 没有使用 `~`（波浪号）方法；例如，`cs.loadInt(32)` 会修改切片并返回一个整数；`b.storeInt(x, 32)` 会修改构建器；`b = b.storeInt()` 也是可行的，因为它不仅会修改构建器，还会返回自身；链式方法的工作方式与 JavaScript 完全一致，返回的是 `self`；整体行为完全符合预期，与 JavaScript 类似；没有运行时开销，使用的指令与 Fift 完全相同；自定义方法的创建非常简单；Tolk 中完全没有波浪号 `~` 的概念。详细信息请参考：[链接](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)。

#### 周边工具

- JetBrains 插件已存在
- VS 代码扩展 [已存在](https://github.com/ton-blockchain/tolk-vscode)
- blueprint 的 WASM 封装器 [已存在](https://github.com/ton-blockchain/tolk-js)
- 甚至还有从 FunC 到 Tolk 的转换器 [已存在](https://github.com/ton-blockchain/convert-func-to-tolk)

#### 下一步行动

[Tolk vs FunC：详细](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability.mdx
================================================
---
title: Tolk vs FunC：可变性
---

# Tolk 与 FunC 中 tilda 函数的可变性对比

:::tip TLDR

- 无 `~` tilda 方法
- `cs.loadInt(32)` 修改片段并返回整数
- `b.storeInt(x,32)` 修改了构建器
- `b = b.storeInt()` 也能正常工作，因为它不仅修改，而且返回
- 链式方法的工作原理与 JS 相同，它们返回 `self`
- 一切如预期运行，与 JS 类似
- 无运行时开销，完全相同的 Fift 指令
- 轻松创建自定义方法
- tilda `~` 在 Tolk 中根本不存在
  :::

这是一个巨大的变化。如果 FunC 有 `.methods()` 和 `~methods()`，那么 Tolk 就只有 dot，一种也是唯一一种调用`.methods()`的方法。一个方法可以_mutate_ 一个对象，也可以不 _mutate_ 一个对象。与列表中的 "简而言之 "不同，这是与 FunC 在行为和语义上的区别。

目标是实现与 JS 和其他语言相同的调用：

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int flags = cs~load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'(cs, int flags) = cs.load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'(slice cs2, int flags) = cs.load_uint(32);'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'var cs2 = cs;<br>var flags = cs2.loadUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'slice data = get_data()<br>             .begin_parse();<br>int flag = data~load_uint(32);'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'val flag = getContractData()<br>           .beginParse()<br>           .loadUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code>{'dict~udict_set(...);'}</code></td>
    <td><code>{'dict.uDictSet(...);'}</code></td>
  </tr>
  <tr>
    <td><code>{'b~store_uint(x, 32);'}</code></td>
    <td><code>{'b.storeInt(x, 32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'b = b.store_int(x, 32);'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'b.storeInt(x, 32);<br><br>// also works<br>b = b.storeUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'b = b.store_int(x, 32)<br>     .store_int(y, 32);'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'b.storeInt(x, 32)<br> .storeInt(y, 32);<br><br>// b = ...; also works'}}></code></td>
  </tr>
  </tbody>
</table>

为了实现这一点，Tolk 提供了一种可变性概念，它是对 FunC 中 tilda 含义的概括。

<h3 className="cmp-func-tolk-header">
  默认情况下，所有参数都按值复制（与 FunC 相同）
</h3>

```tolk
fun someFn(x: int) {
    x += 1;
}

var origX = 0;
someFn(origX);  // origX remains 0
someFn(10);     // ok, just int
origX.someFn(); // still allowed (but not recommended), origX remains 0
```

 cells、 slices 等也是如此：

```tolk
fun readFlags(cs: slice) {
    return cs.loadInt(32);
}

var flags = readFlags(msgBody);  // msgBody is not modified
// msgBody.loadInt(32) will read the same flags
```

这意味着，在调用函数时，可以确保原始数据不会被修改。

<h3 className="cmp-func-tolk-header">
  `突变` 关键字和突变函数
</h3>

但如果在参数中添加 `mutate` 关键字，传递的参数就会发生变化。为了避免意外突变，在调用它时也必须指定 `mutate` ：

```tolk
fun increment(mutate x: int) {
    x += 1;
}

// it's correct, simple and straightforward
var origX = 0;
increment(mutate origX);  // origX becomes 1

// these are compiler errors
increment(origX);         // error, unexpected mutation
increment(10);            // error, not lvalue
origX.increment();        // error, not a method, unexpected mutation
val constX = getSome();
increment(mutate constX); // error, it's immutable, since `val`
```

 slices 和其他类型也是如此：

```tolk
fun readFlags(mutate cs: slice) {
    return cs.loadInt(32);
}

val flags = readFlags(mutate msgBody);
// msgBody.loadInt(32) will read the next integer
```

这是一种概括。一个函数可能有多个突变参数：

```tolk
fun incrementXY(mutate x: int, mutate y: int, byValue: int) {
    x += byValue;
    y += byValue;
}

incrementXY(mutate origX, mutate origY, 10);   // both += 10
```

_你可以询问 — — 它是否只是通过引用？ 它实际上是有效的，但由于“ref”在TON中是一个过载的术语(ells and slices have refs)，选择了一个关键词`mutate`。_

<h3 className="cmp-func-tolk-header">
  将函数转化为方法的 `self` 参数
</h3>

当第一个参数被命名为 `self` 时，它强调函数（仍然是全局函数）是一个方法，应通过 dot 来调用。

```tolk
fun assertNotEq(self: int, throwIfEq: int) {
    if (self == throwIfEq) {
        throw 100;
    }
}

someN.assertNotEq(10);
10.assertNotEq(10);      // also ok, since self is not mutating
assertNotEq(someN, 10);  // still allowed (but not recommended)
```

`self` 在没有 `mutate` 的情况下是 **不可变的**（与所有其他参数不同）。可以把它想象成 "只读方法"。

```tolk
fun readFlags(self: slice) {
    return self.loadInt(32);  // error, modifying immutable variable
}

fun preloadInt32(self: slice) {
    return self.preloadInt(32);  // ok, it's a read-only method
}
```

将 `mutate` 和 `self` 结合起来，我们就得到了突变方法。

<h3 className="cmp-func-tolk-header">
  `mutate self` 是一个通过点调用的方法，用于改变一个对象
</h3>

具体如下

```tolk
fun readFlags(mutate self: slice) {
    return self.loadInt(32);
}

val flags = msgBody.readFlags(); // pretty obvious

fun increment(mutate self: int) {
    self += 1;
}

var origX = 10;
origX.increment();    // 11
10.increment();       // error, not lvalue

// even this is possible
fun incrementWithY(mutate self: int, mutate y: int, byValue: int) {
    self += byValue;
    y += byValue;
}

origX.incrementWithY(mutate origY, 10);   // both += 10
```

如果查看一下 stdlib，你会发现很多函数实际上都是 `mutate self`，也就是说，它们是修改对象的方法。元组、字典等等。在 FunC 中，它们通常通过 tilda 调用。

```tolk
@pure
fun tuplePush<X>(mutate self: tuple, value: X): void
    asm "TPUSH";

t.tuplePush(1);
```

<h3 className="cmp-func-tolk-header">
  `return self` 使方法可链式运行
</h3>

就像 Python 中的 `return self` 或 JavaScript 中的 `return this` 一样。这也是 `storeInt()` 等方法可以链式处理的原因。

```tolk
fun storeInt32(mutate self: builder, x: int): self {
    self.storeInt(x, 32);
    return self;

    // this would also work as expected (the same Fift code)
    // return self.storeInt(x, 32);
}

var b = beginCell().storeInt(1, 32).storeInt32(2).storeInt(3, 32);
b.storeInt32(4);     // works without assignment, since mutates b
b = b.storeInt32(5); // and works with assignment, since also returns
```

请注意返回类型，它是 `self`。目前，您应该指定它。如果不指定，编译就会失败。也许将来会正确。

<h3 className="cmp-func-tolk-header">
  `mutate self` 和 asm 函数
</h3>

对于用户定义的函数来说，这一点显而易见，但人们可能会感兴趣，如何制作一个具有这种行为的 `asm` 函数？要回答这个问题，我们应该先了解一下编译器内部的突变工作原理。

当一个函数有 `mutate` 参数时，它实际上是隐式返回参数，并将参数隐式赋值给参数。举例说明效果更好：

```tolk
// actually returns (int, void)
fun increment(mutate x: int): void { ... }

// actually does: (x', _) = increment(x); x = x'
increment(mutate x);

// actually returns (int, int, (slice, cell))
fun f2(mutate x: int, mutate y: int): (slice, cell) { ... }

// actually does: (x', y', r) = f2(x, y); x = x'; y = y'; someF(r)
someF(f2(mutate x, mutate y));

// when `self`, it's exactly the same
// actually does: (cs', r) = loadInt(cs, 32); cs = cs'; flags = r
flags = cs.loadInt(32);
```

因此，`asm` 函数应将 `self` 放在返回值之前的堆栈中：

```tolk
// "TPUSH" pops (tuple) and pushes (tuple')
// so, self' = tuple', and return an empty tensor
// `void` is a synonym for an empty tensor
fun tuplePush<X>(mutate self: tuple, value: X): void
    asm "TPUSH";

// "LDU" pops (slice) and pushes (int, slice')
// with asm(-> 1 0), we make it (slice', int)
// so, self' = slice', and return int
fun loadMessageFlags(mutate self: slice): int
    asm(-> 1 0) "4 LDU";
```

请注意，要返回 self，无需做任何特殊处理，只需指定返回类型即可。剩下的就交给编译器吧。

```tolk
// "STU" pops (int, builder) and pushes (builder')
// with asm(op self), we put arguments to correct order
// so, self' = builder', and return an empty tensor
// but to make it chainable, `self` instead of `void`
fun storeMessageOp(mutate self: builder, op: int): self
    asm(op self) "32 STU";
```

您不太可能需要使用这些技巧。最有可能的情况是，您只需为现有函数编写封装程序：

```tolk
// just do like this, without asm, it's the same effective

@inline
fun myLoadMessageFlags(mutate self: slice): int {
    return self.loadUint(4);
}

@inline
fun myStoreMessageOp(mutate self: builder, flags: int): self {
    return self.storeUint(32, flags);
}
```

<h3 className="cmp-func-tolk-header">
  简单函数/方法是否需要 `@inline`？
</h3>

现在，最好这样做，没错。在上述大多数示例中，为了清晰起见，省略了 `@inline`。目前，如果没有 `@inline`，它将是一个单独的 TVM 续程，有跳入/跳出。如果使用 `@inline`，就会生成一个函数，但会被 Fift 内联（就像 FunC 中的 `inline` specifer）。

未来，Tolk 将自动检测简单函数，并在 AST 层面上执行真正的内联。这样的函数甚至都不需要编入 Fift。编译器将比人类更好地决定是否内联、是否进行 ref 等。但 Tolk 要变得如此聪明还需要一些时间:)现在，请指定 `@inline` 属性。

<h3 className="cmp-func-tolk-header">
  但 `self` 不是方法，它仍然是函数！我觉得我被骗了
</h3>

当然可以。与 FunC 一样，Tolk 也只有全局函数（截至 v0.6）。没有带方法的类/结构。没有针对 `slice` 的 `hash()` 方法和针对 `cell` 的 `hash()`方法。取而代之的是函数 `sliceHash()` 和 `cellHash()`，它们可以像函数一样调用，也可以用点调用（首选）：

```tolk
fun f(s: slice, c: cell) {
    // not like this
    s.hash();
    c.hash();
    // but like this
    s.sliceHash();
    c.cellHash();
    // since it's the same as
    sliceHash(s);
    cellHash(s);
}
```

未来，在对类型系统进行了大量工作，并对 FunC 内核进行了全面重构之后，Tolk 可能会具备用真正的方法声明结构的能力，其通用性足以覆盖内置类型。但这还需要很长的路要走。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib.md
================================================
# Tolk vs FunC：标准库

FunC 有一个丰富的 [标准库](/v3/documentation/smart-contracts/func/docs/stdlib)，
，称为 *"stdlib.fc "* 文件。它相当低级，包含大量与 TVM 命令命名非常接近的 `asm` 函数
。

Tolk 也有一个基于 FunC 的标准库。三个主要区别

1. 它分为多个文件：`common.tlk`、`tvm-dicts.tlk` 和其他文件。来自 `common.tolk` 的函数始终可用。其他文件中的函数在导入后可用：

```tolk
import "@stdlib/tvm-dicts"

beginCell()          // available always
createEmptyDict()    // available due to import
```

2. 您无需从 GitHub 下载，它是 Tolk 发行版的一部分。
3. 几乎所有 FunC 函数都被重命名为 ~~verbose~~ 清晰的名称。这样，当您编写合约或阅读示例时，就能更好地理解发生了什么。

## 重命名函数列表

如果 "Required import（需要导入）"列为空，则表示函数无需导入即可使用。

请注意，有些函数被删除，因为它们要么可以用语法表达，
，要么在实践中非常不常见。

| FunC name                                                                                       | Tolk name                               | Required import |
| ----------------------------------------------------------------------------------------------- | --------------------------------------- | --------------- |
| empty_tuple                                                                | createEmptyTuple                        |                 |
| tpush                                                                                           | tuplePush                               |                 |
| first                                                                                           | tupleFirst                              |                 |
| at                                                                                              | tupleAt                                 |                 |
| touch                                                                                           | stackMoveToTop                          | tvm-lowlevel    |
| impure_touch                                                               | *(deleted)*          |                 |
| single                                                                                          | *(deleted)*          |                 |
| unsingle                                                                                        | *(deleted)*          |                 |
| pair                                                                                            | *(deleted)*          |                 |
| unpair                                                                                          | *(deleted)*          |                 |
| triple                                                                                          | *(deleted)*          |                 |
| untriple                                                                                        | *(deleted)*          |                 |
| tuple4                                                                                          | *(deleted)*          |                 |
| untuple4                                                                                        | *(deleted)*          |                 |
| second                                                                                          | *(deleted)*          |                 |
| third                                                                                           | *(deleted)*          |                 |
| fourth                                                                                          | *(deleted)*          |                 |
| pair_first                                                                 | *(deleted)*          |                 |
| pair_second                                                                | *(deleted)*          |                 |
| triple_first                                                               | *(deleted)*          |                 |
| triple_second                                                              | *(deleted)*          |                 |
| triple_third                                                               | *(deleted)*          |                 |
| minmax                                                                                          | minMax                                  |                 |
| my_address                                                                 | getMyAddress                            |                 |
| get_balance                                                                | getMyOriginalBalanceWithExtraCurrencies |                 |
| cur_lt                                                                     | getLogicalTime                          |                 |
| block_lt                                                                   | getCurrentBlockLogicalTime              |                 |
| cell_hash                                                                  | cellHash                                |                 |
| slice_hash                                                                 | sliceHash                               |                 |
| string_hash                                                                | stringHash                              |                 |
| check_signature                                                            | isSignatureValid                        |                 |
| check_data_signature                                  | isSliceSignatureValid                   |                 |
| compute_data_size                                     | calculateCellSizeStrict                 |                 |
| slice_compute_data_size          | calculateSliceSizeStrict                |                 |
| compute_data_size?                                    | calculateCellSize                       |                 |
| slice_compute_data_size?         | calculateSliceSize                      |                 |
| ~dump                                                                           | debugPrint                              |                 |
| ~strdump                                                                        | debugPrintString                        |                 |
| dump_stack                                                                 | debugDumpStack                          |                 |
| get_data                                                                   | getContractData                         |                 |
| set_data                                                                   | setContractData                         |                 |
| get_c3                                                                     | getTvmRegisterC3                        | tvm-lowlevel    |
| set_c3                                                                     | setTvmRegisterC3                        | tvm-lowlevel    |
| bless                                                                                           | transformSliceToContinuation            | tvm-lowlevel    |
| accept_message                                                             | acceptExternalMessage                   |                 |
| set_gas_limit                                         | setGasLimit                             |                 |
| buy_gas                                                                    | *(deleted)*          |                 |
| commit                                                                                          | commitContractDataAndActions            |                 |
| divmod                                                                                          | divMod                                  |                 |
| moddiv                                                                                          | modDiv                                  |                 |
| muldiv                                                                                          | mulDivFloor                             |                 |
| muldivr                                                                                         | mulDivRound                             |                 |
| muldivc                                                                                         | mulDivCeil                              |                 |
| muldivmod                                                                                       | mulDivMod                               |                 |
| begin_parse                                                                | beginParse                              |                 |
| end_parse                                                                  | assertEndOfSlice                        |                 |
| load_ref                                                                   | loadRef                                 |                 |
| preload_ref                                                                | preloadRef                              |                 |
| load_int                                                                   | loadInt                                 |                 |
| load_uint                                                                  | loadUint                                |                 |
| preload_int                                                                | preloadInt                              |                 |
| preload_uint                                                               | preloadUint                             |                 |
| load_bits                                                                  | loadBits                                |                 |
| preload_bits                                                               | preloadBits                             |                 |
| load_grams                                                                 | loadCoins                               |                 |
| load_coins                                                                 | loadCoins                               |                 |
| skip_bits                                                                  | skipBits                                |                 |
| first_bits                                                                 | getFirstBits                            |                 |
| skip_last_bits                                        | removeLastBits                          |                 |
| slice_last                                                                 | getLastBits                             |                 |
| load_dict                                                                  | loadDict                                |                 |
| preload_dict                                                               | preloadDict                             |                 |
| skip_dict                                                                  | skipDict                                |                 |
| load_maybe_ref                                        | loadMaybeRef                            |                 |
| preload_maybe_ref                                     | preloadMaybeRef                         |                 |
| cell_depth                                                                 | getCellDepth                            |                 |
| slice_refs                                                                 | getRemainingRefsCount                   |                 |
| slice_bits                                                                 | getRemainingBitsCount                   |                 |
| slice_bits_refs                                       | getRemainingBitsAndRefsCount            |                 |
| slice_empty?                                                               | isEndOfSlice                            |                 |
| slice_data_empty?                                     | isEndOfSliceBits                        |                 |
| slice_refs_empty?                                     | isEndOfSliceRefs                        |                 |
| slice_depth                                                                | getSliceDepth                           |                 |
| equal_slice_bits                                      | isSliceBitsEqual                        |                 |
| builder_refs                                                               | getBuilderRefsCount                     |                 |
| builder_bits                                                               | getBuilderBitsCount                     |                 |
| builder_depth                                                              | getBuilderDepth                         |                 |
| begin_cell                                                                 | beginCell                               |                 |
| end_cell                                                                   | endCell                                 |                 |
| store_ref                                                                  | storeRef                                |                 |
| store_uint                                                                 | storeUint                               |                 |
| store_int                                                                  | storeInt                                |                 |
| store_slice                                                                | storeSlice                              |                 |
| store_grams                                                                | storeCoins                              |                 |
| store_coins                                                                | storeCoins                              |                 |
| store_dict                                                                 | storeDict                               |                 |
| store_maybe_ref                                       | storeMaybeRef                           |                 |
| store_builder                                                              | storeBuilder                            |                 |
| load_msg_addr                                         | loadAddress                             |                 |
| parse_addr                                                                 | parseAddress                            |                 |
| parse_std_addr                                        | parseStandardAddress                    |                 |
| parse_var_addr                                        | *(deleted)*          |                 |
| config_param                                                               | getBlockchainConfigParam                |                 |
| raw_reserve                                                                | reserveToncoinsOnBalance                |                 |
| raw_reserve_extra                                     | reserveExtraCurrenciesOnBalance         |                 |
| send_raw_message                                      | sendRawMessage                          |                 |
| set_code                                                                   | setContractCodePostponed                |                 |
| rand                                                                                            | randomRange                             |                 |
| get_seed                                                                   | randomGetSeed                           |                 |
| set_seed                                                                   | randomSetSeed                           |                 |
| randomize                                                                                       | randomizeBy                             |                 |
| randomize_lt                                                               | randomizeByLogicalTime                  |                 |
| dump                                                                                            | debugPrint                              |                 |
| strdump                                                                                         | debugPrintString                        |                 |
| dump_stk                                                                   | debugDumpStack                          |                 |
| empty_list                                                                 | createEmptyList                         | lisp-lists      |
| cons                                                                                            | listPrepend                             | lisp-lists      |
| uncons                                                                                          | listSplit                               | lisp-lists      |
| list_next                                                                  | listNext                                | lisp-lists      |
| car                                                                                             | listGetHead                             | lisp-lists      |
| cdr                                                                                             | listGetTail                             | lisp-lists      |
| new_dict                                                                   | createEmptyDict                         | tvm-dicts       |
| dict_empty?                                                                | dictIsEmpty                             | tvm-dicts       |
| idict_set_ref                                         | iDictSetRef                             | tvm-dicts       |
| udict_set_ref                                         | uDictSetRef                             | tvm-dicts       |
| idict_get_ref                                         | iDictGetRefOrNull                       | tvm-dicts       |
| idict_get_ref?                                        | iDictGetRef                             | tvm-dicts       |
| udict_get_ref?                                        | uDictGetRef                             | tvm-dicts       |
| idict_set_get_ref                | iDictSetAndGetRefOrNull                 | tvm-dicts       |
| udict_set_get_ref                | iDictSetAndGetRefOrNull                 | tvm-dicts       |
| idict_delete?                                                              | iDictDelete                             | tvm-dicts       |
| udict_delete?                                                              | uDictDelete                             | tvm-dicts       |
| idict_get?                                                                 | iDictGet                                | tvm-dicts       |
| udict_get?                                                                 | uDictGet                                | tvm-dicts       |
| idict_delete_get?                                     | iDictDeleteAndGet                       | tvm-dicts       |
| udict_delete_get?                                     | uDictDeleteAndGet                       | tvm-dicts       |
| udict_set                                                                  | uDictSet                                | tvm-dicts       |
| idict_set                                                                  | iDictSet                                | tvm-dicts       |
| dict_set                                                                   | sDictSet                                | tvm-dicts       |
| udict_add?                                                                 | uDictSetIfNotExists                     | tvm-dicts       |
| udict_replace?                                                             | uDictSetIfExists                        | tvm-dicts       |
| idict_add?                                                                 | iDictSetIfNotExists                     | tvm-dicts       |
| idict_replace?                                                             | iDictSetIfExists                        | tvm-dicts       |
| udict_set_builder                                     | uDictSetBuilder                         | tvm-dicts       |
| idict_set_builder                                     | iDictSetBuilder                         | tvm-dicts       |
| dict_set_builder                                      | sDictSetBuilder                         | tvm-dicts       |
| udict_add_builder?                                    | uDictSetBuilderIfNotExists              | tvm-dicts       |
| udict_replace_builder?                                | uDictSetBuilderIfExists                 | tvm-dicts       |
| idict_add_builder?                                    | iDictSetBuilderIfNotExists              | tvm-dicts       |
| idict_replace_builder?                                | iDictSetBuilderIfExists                 | tvm-dicts       |
| udict_delete_get_min             | uDictDeleteFirstAndGet                  | tvm-dicts       |
| idict_delete_get_min             | iDictDeleteFirstAndGet                  | tvm-dicts       |
| dict_delete_get_min              | sDictDeleteFirstAndGet                  | tvm-dicts       |
| udict_delete_get_max             | uDictDeleteLastAndGet                   | tvm-dicts       |
| idict_delete_get_max             | iDictDeleteLastAndGet                   | tvm-dicts       |
| dict_delete_get_max              | sDictDeleteLastAndGet                   | tvm-dicts       |
| udict_get_min?                                        | uDictGetFirst                           | tvm-dicts       |
| udict_get_max?                                        | uDictGetLast                            | tvm-dicts       |
| udict_get_min_ref?               | uDictGetFirstAsRef                      | tvm-dicts       |
| udict_get_max_ref?               | uDictGetLastAsRef                       | tvm-dicts       |
| idict_get_min?                                        | iDictGetFirst                           | tvm-dicts       |
| idict_get_max?                                        | iDictGetLast                            | tvm-dicts       |
| idict_get_min_ref?               | iDictGetFirstAsRef                      | tvm-dicts       |
| idict_get_max_ref?               | iDictGetLastAsRef                       | tvm-dicts       |
| udict_get_next?                                       | uDictGetNext                            | tvm-dicts       |
| udict_get_nexteq?                                     | uDictGetNextOrEqual                     | tvm-dicts       |
| udict_get_prev?                                       | uDictGetPrev                            | tvm-dicts       |
| udict_get_preveq?                                     | uDictGetPrevOrEqual                     | tvm-dicts       |
| idict_get_next?                                       | iDictGetNext                            | tvm-dicts       |
| idict_get_nexteq?                                     | iDictGetNextOrEqual                     | tvm-dicts       |
| idict_get_prev?                                       | iDictGetPrev                            | tvm-dicts       |
| idict_get_preveq?                                     | iDictGetPrevOrEqual                     | tvm-dicts       |
| udict::delete_get_min | uDictDeleteFirstAndGet                  | tvm-dicts       |
| idict::delete_get_min | iDictDeleteFirstAndGet                  | tvm-dicts       |
| dict::delete_get_min  | sDictDeleteFirstAndGet                  | tvm-dicts       |
| udict::delete_get_max | uDictDeleteLastAndGet                   | tvm-dicts       |
| idict::delete_get_max | iDictDeleteLastAndGet                   | tvm-dicts       |
| dict::delete_get_max  | sDictDeleteLastAndGet                   | tvm-dicts       |
| pfxdict_get?                                                               | prefixDictGet                           | tvm-dicts       |
| pfxdict_set?                                                               | prefixDictSet                           | tvm-dicts       |
| pfxdict_delete?                                                            | prefixDictDelete                        | tvm-dicts       |

## 新增功能列表

Tolk 标准库中有一些 FunC 中没有的函数，但在日常工作中却很常用。

由于 Tolk 正在积极开发，其标准库也在不断变化，因此最好考虑使用源代码 [此处](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont/tolk-stdlib) 中的 `tolk-stdlib/` 文件夹
。
除了函数，这里还添加了一些常量：`SEND_MODE_*`、`RESERVE_MODE_*` 等。

一旦 FunC 被弃用，有关 Tolk stdlib 的文档将全部重写。

请记住，上述所有函数实际上都是 TVM 汇编程序的封装器。如果缺少什么，
，你可以很容易地自己封装任何 TVM 指令。

## 某些函数变得易变，不返回副本

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int flags = cs~load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'dict~udict_set(...);'}</code></td>
    <td><code>{'dict.uDictSet(...);'}</code></td>
  </tr>
  <tr>
    <td>...</td>
    <td>...</td>
  </tr>
  </tbody>
</table>

大多数在实践中使用 `~`（波浪号）的 FunC 函数，现在会直接修改对象，详见上述示例。

例如，如果您使用了 `dict~udict_set(…)`，只需使用 `dict.uDictSet(…)`，一切都会好起来。
但如果使用 `dict.udict_set(…)` 来获取副本，则需要用其他方式来表达。

[了解可变性](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)。

## 嵌入式 stdlib 在引擎盖下如何工作

如上所述，所有标准功能都是开箱即用的。
是的，对于非通用函数，你需要 "导入"（这是有意为之），但仍然不需要外部下载。

其工作原理如下。

Tolk 编译器启动后做的第一件事就是通过搜索相对于可执行二进制文件的预定义路径来定位 stdlib 文件夹。
例如，如果从安装的软件包启动 Tolk 编译器 (如 `/usr/bin/tolk`)，则将 stdlib 定位在 `/usr/share/ton/smartcont`。
如果是非标准安装，可以通过 `TOLK_STDLIB` 环境变量。这是编译器的标准做法。

WASM wrapper [tolk-js](https://github.com/ton-blockchain/tolk-js) 也包含 stdlib。
因此，当你使用 tolk-js 或 blueprint 时，所有 stdlib 函数仍然是开箱即用的。

集成开发环境插件（JetBrains 和 VS Code）也会自动定位 stdlib 以提供自动完成功能。
如果使用 blueprint，它会自动安装 tolk-js，因此项目文件结构中会出现 `node_modules/@ton/tolk-js/` 文件夹。
里面有 `common.tolk`, `tvm-dicts.tolk` 等文件。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/accept-message-effects.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/accept-message-effects.md
================================================
# 接受消息的影响

`accept_message` 和 `set_gas_limit` 在执行[stdlib参考](/develop/func/stdlib#accept_message)中所说的操作时，可能会产生一些不那么直接的影响。

## 外部消息

外部消息的处理流程如下：

- `gas_limit`被设置为`gas_credit`（ConfigParam 20和ConfigParam 21），等于10k gas。
- 在使用这些信用额度期间，合约应该调用`accept_message`来`set_gas_limit`，表明它准备支付消息处理费用。
- 如果`gas_credit`被消耗完或计算结束，并且没有调用`accept_message`，消息将被完全丢弃（就好像它从未存在过一样）。
- 否则，将设置一个新的gas限制，等于`contract_balance/gas_price`（在`accept_message`的情况下）或自定义数字（在`set_gas_limit`的情况下）；在交易结束后，将从合约余额中扣除完整的计算费用（这样，`gas_credit`实际上是**信用**，而不是免费gas）。

请注意，如果在`accept_message`之后抛出某些错误（无论是在Compute Phase还是Action Phase），交易将被写入区块链，并且费用将从合约余额中扣除。然而，存储不会被更新，操作不会被应用，就像任何带有错误退出代码的交易一样。

因此，如果合约接受外部消息然后由于消息数据中的错误或发送错误序列化的消息而抛出异常，它将支付处理费用，但无法阻止消息重放。**同一消息将被合约反复接受，直到消耗完整个余额。**

## 内部消息

默认情况下，当合约接收到内部消息时，gas限制被设置为`message_balance`/`gas_price`。换句话说，消息为其处理支付。通过使用`accept_message`/`set_gas_limit`，合约可以在执行期间更改gas限制。

请注意，手动设置的gas限制不会干扰弹回行为；如果消息以可弹回模式发送，并且包含足够的钱来支付其处理和创建弹回消息的费用，消息将被弹回。

:::info 示例

如果在同一示例中，计算成本为0.5（而不是0.005），则不会发生弹回（消息余额将是`0.1 - 0.5 - 0.001 = -0.401`，因此没有弹回），合约余额将是`1 + 0.1 - 0.5` = `0.6` TON。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/fees-low-level.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/fees-low-level.md
================================================
# 低层级费用概述

:::caution
This section describes instructions and manuals for interacting with TON at a low level.

在这里，您可以找到计算 TON 佣金和费用的**原始公式**。

不过，其中大部分**已通过操作码**实现！因此，您可以**使用它们来代替手工计算**。
:::

如[TVM概述](/learn/tvm-instructions/tvm-overview)中所述，交易执行包括几个阶段(phase)。在这些阶段期间，可能会扣除相应的费用。

## 交易及其阶段

如[TVM 概述](/v3/documentation/tvm/tvm-overview)所述，交易执行由几个阶段组成。在这些阶段中，可能会扣除相应的费用。有一个 [高级费用概述](/v3/documentation/smart-contracts/transaction-fees/fees)。

## 存储费

TON 校验器从智能合约中收取存储费。

在任何交易的**存储阶段**，都会从智能合约余额中收取存储费，用于支付截至当前的账户状态
（包括智能合约代码和数据（如有））的存储费用。智能合约可能因此被冻结。

重要的是要记住，在 TON 上，你既要为智能合约的执行付费，也要为**使用的存储**付费（查看 [@thedailyton 文章](https://telegra.ph/Commissions-on-TON-07-22)）。存储费 "取决于合约大小： cell 数和 cell 位数之和。**存储和转发费用只计算唯一的哈希 cell ，即 3 个相同的哈希 cell 算作一个**。这意味着拥有 TON 钱包（即使非常小）也需要支付存储费。

所有计算成本都以gas单位标明。gas单位的价格由链配置（主链的Config 20和基本链的Config 21）决定，只能通过验证者的共识更改。请注意，与其他系统不同，用户不能设置自己的gas价格，也没有费用市场。

### 计算公式

您可以使用此公式大致计算智能合约的存储费用：

```cpp
  storage_fee = (cells_count * cell_price + bits_count * bit_price)
  * time_delta / 2^16 
```

除了这些基本费用外，还有以下费用：

- `storage_fee` -- `time_delta` 秒内的存储价格
- `cells_count` - 智能合约使用的 cell 数量
- `bits_count` - 智能合约使用的比特数
- `cell_price` -- 单个 cell 的价格
- `bit_price` -- 单个比特的价格

`cell_price` 和 `bit_price` 均可从网络配置[参数 18](/v3/documentation/network/configs/blockchain-configs#param-18)中获取。

FunC中使用的几乎所有函数都在[stdlib.func](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)中定义，它将FunC函数映射到Fift汇编指令。反过来，Fift汇编指令在[asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif)中映射到位序列指令。因此，如果你想了解指令调用的确切成本，你需要在`stdlib.func`中找到`asm`表示，然后在`asm.fif`中找到位序列并计算指令长度（以位为单位）。

- 工作链。
  ```cpp
  bit_price_ps:1
  cell_price_ps:500
  ```
- 主链
  ```cpp
  mc_bit_price_ps:1000
  mc_cell_price_ps:500000
  ```

### 计算器示例

您可以使用此 JS 脚本计算工作链中 1 MB 1 年的存储价格

```js live

// Welcome to LIVE editor!
// feel free to change any variables
// Source code uses RoundUp for the fee amount, so does the calculator

function storageFeeCalculator() {
  
  const size = 1024 * 1024 * 8        // 1MB in bits  
  const duration = 60 * 60 * 24 * 365 // 1 Year in secs

  const bit_price_ps = 1
  const cell_price_ps = 500

  const pricePerSec = size * bit_price_ps +
  + Math.ceil(size / 1023) * cell_price_ps

  let fee = Math.ceil(pricePerSec * duration / 2**16) * 10**-9
  let mb = (size / 1024 / 1024 / 8).toFixed(2)
  let days = Math.floor(duration / (3600 * 24))
  
  let str = `Storage Fee: ${fee} TON (${mb} MB for ${days} days)`
  
  return str
}


```

## Inline和inline_refs

### Gas

所有计算成本均以 gas 单位计算。 gas 单位的价格由[链配置](/v3/documentation/network/configs/blockchain-configs#param-20and-21)决定（配置 20 用于主链，配置 21 用于基链），只有在验证者达成共识后才能更改。需要注意的是，与其他系统不同，用户不能设定自己的 gas 价格，也没有收费市场。

TON中的字典是作为cell的树（更准确地说是DAG）被引入的。这意味着如果你搜索、读取或写入字典，你需要解析树的相应分支的所有cell。这意味着

### TVM 指令成本

在最低层级（TVM指令执行），大多数原语的gas价格等于_基本gas价格_，计算为`P_b := 10 + b + 5r`，其中`b`是指令长度（以位为单位），`r`是包含在指令中的cell引用数。

注意FunC在底层操作堆栈条目。这意味着代码：

| 指令       | GAS价格   | 描述                                                                              |
| -------- | ------- | ------------------------------------------------------------------------------- |
| 创建cell   | **500** | 将构建器转换为cell的操作。                                                                 |
| 首次解析cell | **100** | 在当前交易期间首次将cell转换为 slice 的操作。                                                    |
| 重复解析cell | **25**  | 在同一交易期间已解析过的cell转换为 slice 的操作。                                                  |
| 抛出异常     | **50**  |                                                                                 |
| 与元组操作    | **1**   | 此价格将乘以元组元素的数量。                                                                  |
| 隐式跳转     | **10**  | 当当前continuation cell中的所有指令执行时会进行支付。然而，如果该continuation cell中存在引用，并且执行流跳转到了第一个引用。 |
| 隐式回跳     | **5**   | 当当前continuation中的所有指令执行完毕，并且执行流回跳到刚刚完成的continuation被调用的那个continuation时，将会进行支付。  |
| 移动堆栈元素   | **1**   | 在continuations之间移动堆栈元素的价格。每个元素都将收取相应的gas价格。然而，前32个元素的移动是免费的。                    |

### FunC 构造的 gas 费用

当堆栈条目数量大（10+），并且它们以不同的顺序被积极使用时，堆栈操作费用可能变得不可忽视。

然而，通常，与位长度相关的费用与cell解析和创建以及跳转和执行指令数量的费用相比是次要的。

因此，如果你试图优化你的代码，首先从架构优化开始，减少cell解析/创建操作的数量，然后减少跳转的数量。

### 与 cell 进行的操作

一个关于如何通过适当的cell工作显著降低gas成本的示例。

假设你想在出站消息中添加一些编码的有效负载。直接实现将如下：

```cpp
slice payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8)
    .end_cell().begin_parse();
}

() send_message(slice destination) impure {
  slice payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_slice(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

这段代码的问题是什么？`payload_encoding`为了生成 slice 位字符串，首先通过`end_cell()`创建一个cell（+500 gas单位）。然后解析它`begin_parse()`（+100 gas单位）。通过改变一些常用类型，可以不使用这些不必要的操作来重写相同的代码：

```cpp
;; we add asm for function which stores one builder to the another, which is absent from stdlib
builder store_builder(builder to, builder what) asm(what to) "STB";

builder payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8);
}

() send_message(slice destination) impure {
  builder payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_builder(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

通过以另一种形式（构建器而不是 slice ）传递位字符串，我们通过非常轻微的代码更改显著降低了计算成本。

### Inline和inline_refs

默认情况下，当你有一个FunC函数时，它会获得自己的`id`，存储在id->function字典的单独叶子中，当你在程序的某个地方调用它时，会在字典中搜索函数并随后跳转。如果函数从代码中的许多地方调用，这种行为是合理的，因为跳转允许减少代码大小（通过一次存储函数体）。然而，如果该函数只在一个或两个地方使用，通常更便宜的做法是将该函数声明为`inline`或`inline_ref`。`inline`修饰符将函数体直接放入父函数的代码中，而`inline_ref`将函数代码放入引用中（跳转到引用仍然比搜索和跳转到字典条目便宜得多）。

### 字典

\*2022年7月24日，基于@thedailyton [文章](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) \*

- a) 字典操作的成本不是固定的（因为分支中节点的大小和数量取决于给定的字典和键）
- b) 优化字典使用是明智的，使用特殊指令如`replace`而不是`delete`和`add`
- c) 开发者应该注意迭代操作（如next和prev）以及`min_key`/`max_key`操作，以避免不必要地遍历整个字典

### 堆栈操作

注意FunC在底层操作堆栈条目。这意味着代码：

```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```

将被翻译成几个指令，这些指令改变堆栈上元素的顺序。

当堆栈条目数量大（10+），并且它们以不同的顺序被积极使用时，堆栈操作费用可能变得不可忽视。

## 预付费

内部消息会定义一个以 Toncoins 为单位的 `ihr_fee`（转发费），如果目的地分片链通过 IHR 机制收录消息，就会从消息附加值中减去该费用，并将其奖励给目的地分片链的验证者。`fwd_fee` 是使用HR机制所支付的原始转发费用总额；它是根据[24和25配置参数](/v3/documentation/network/configs/blockchain-configs#param-24and-25)和信息生成时的大小自动计算得出的。请注意，新创建的内部出站消息所携带的总值等于 值、`hr_fee` 和 `fwd_fee` 之和。该总和从源账户余额中扣除。在这些部分中，只有值会在信息发送时记入目的地账户。`fwd_fee` 由从源到目的地的HR路径上的验证者收取，而 `ihr_fee` 要么由目的地分片链的验证者收取（如果信息是通过IHR传递的），要么记入目的地账户。

:::tip

目前（2024年11月），[IHR](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm#messages-and-instant-hypercube-routing-instant-hypercube-routing)尚未实现，如果将 `ihr_fee` 设置为非零值，那么在收到消息时，它将始终被添加到消息值中。就目前而言，这样做没有实际意义。

:::

```cpp
msg_fwd_fees = (lump_price
             + ceil(
                (bit_price * msg.bits + cell_price * msg.cells) / 2^16)
             );

ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor) / 2^16);

total_fwd_fees = msg_fwd_fees + ihr_fwd_fees; // ihr_fwd_fees - is 0 for external messages
```

## 操作费

操作费在计算阶段之后处理操作列表时从源账户余额中扣除。实际上，唯一需要支付操作费的操作是 `SENDRAWMSG`。其他操作，如 `RAWRESERVE` 或 `SETCODE`，在操作阶段不产生任何费用。

```cpp
action_fee = floor((msg_fwd_fees * first_frac)/ 2^16);  //internal

action_fee = msg_fwd_fees;  //external
```

[`first_frac`](/v3/documentation/network/configs/blockchain-configs#param-24and-25)是TON区块链的24和25参数（主链和工作链）的一部分。目前，这两个参数的值都设置为 21845，这意味着 `action_fee` 约为 `msg_fwd_fees` 的三分之一。如果是外部消息操作 `SENDRAWMSG`，`action_fee` 等于 `msg_fwd_fees`。

:::tip
Remember that an action register can contain up to 255 actions, which means that all formulas related to `fwd_fee` and `action_fee` will be computed for each `SENDRAWMSG` action, resulting in the following sum:

```cpp
total_fees = sum(action_fee) + sum(total_fwd_fees);
```

:::

从 TON 的第四个[全球版本](https://github.com/ton-blockchain/ton/blob/master/doc/GlobalVersions.md)开始，如果 "发送消息 " 操作失败，账户需要支付处理消息单元的费用，称为 `action_fine`。

```cpp
fine_per_cell = floor((cell_price >> 16) / 4)

max_cells = floor(remaining_balance / fine_per_cell)

action_fine = fine_per_cell * min(max_cells, cells_in_msg);
```

## 费用计算公式

### storage_fees

```cpp
storage_fees = ceil(
                    (account.bits * bit_price
                    + account.cells * cell_price)
               * period / 2 ^ 16)
```

:::info
Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one.

特别是，它可以重复数据：如果在不同分支中引用了多个等效子 cell ，则其内容只需存储一次。

阅读有关 [重复数据删除](/v3/documentation/data-formats/ltb/library-cells) 的更多信息。
:::

// 消息的根cell中的位不包括在msg.bits中（lump_price支付它们）

## 费用配置文件

所有费用均以纳元或纳元乘以 2^16 来表示[在使用整数时保持准确性](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#forward-fees)，并且可以更改。配置文件表示当前的费用成本。

- storage_fees = [p18](https://tonviewer.com/config#18)
- in_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- computation_fees = [p20](https://tonviewer.com/config#20), [p21](https://tonviewer.com/config#21)
- action_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- out_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)

:::info
[指向主网实时配置文件的直接链接](https://tonviewer.com/config)

出于教育目的：[旧版本示例](https://explorer.toncoin.org/config?workchain=-1\&shard=8000000000000000\&seqno=22185244\&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382\&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05)
:::

## 参考资料

- 基于 @thedailyton [文章](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) 24.07\*

## 另请参见

- [ TON 收费概述](/v3/documentation/smart-contracts/transaction-fees/fees)
- [事务和阶段](/v3/documentation/tvm/tvm-overview#transactions-and-phases)
- [费用计算](/v3/guidelines/smart-contracts/fee-calculation)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/fees.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/fees.md
================================================
# 交易费用

每个TON用户都应该记住，*手续费取决于许多因素*。

## Gas

所有费用都以Gas计算。这是TON中用作费用的特殊货币。

所有费用都以一定数量的gas来指定和固定，但gas价格本身并不固定。今天的gas价格为：

当前的基础链设置如下：1 单位 gas 耗费 400  nanotons  。

```cpp
1 gas = 26214400 / 2^16 nanotons = 0,000 000 4 TON
```

主链的当前设置如下：1 单位 gas 耗费 10000  nanotons  。

```cpp
1 gas = 655360000 / 2^16 nanotons = 0,000 01 TON
```

### 平均交易成本

> **TLDR：** 今天，每笔交易的成本约为 **~0.005  TON**

像TON的许多其他参数一样，gas费用是可配置的，可以通过主网上的特殊投票来更改。

:::info
当前 gas 量分别写入主链和基链的网络配置 [param 20](https://tonviewer.com/config#20) 和 [param 21](https://tonviewer.com/config#21)。
:::

### Gas 的成本会更高吗？

与 TON 的许多其他参数一样， gas 费也是可配置的，可以通过主网的特别投票进行更改。

从技术上讲，是的；但实际上，不会。

#### gas 价格会更贵吗？

> *这是否意味着有一天gas价格可能会上涨1000倍甚至更多？*

TON上的费用难以提前计算，因为它们的数量取决于交易运行时间、账户状态、消息内容和大小、区块链网络设置以及无法在交易发送之前计算的其他许多变量。阅读关于[计算费用](/develop/howto/fees-low-level#computation-fees)的低层级文章概述。

这就是为什么即使NFT市场通常会额外收取大约1 TON的TON，并在稍后返还(*`1 - transaction_fee`*)。

### 如何计算费用？

TON 的费用很难提前计算，因为其金额取决于交易运行时间、账户状态、信息内容和大小、区块链网络设置以及其他一些变量，在交易发送之前无法计算。

根据[低层级费用概述](/develop/howto/fees-low-level)，TON上的费用按照以下公式计算：

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

查看[低级收费概述](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)，了解更多佣金计算公式；查看[收费计算](/v3/guidelines/smart-contracts/fee-calculation)，了解如何使用新的 TVM 操作码计算 FunC 合约中的收费。
:::

不过，让我们进一步了解一下 TON 的收费功能。

## 存储费

TON验证者从智能合约收取存储费用。

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

## 交易费要素

- `storage_fees`是您为在区块链上存储智能合约而支付的金额。实际上，您支付的是智能合约在区块链上存储的每一秒钟。
  - *示例*：您的TON钱包也是一个智能合约，每次您接收或发送交易时都会支付存储费用。阅读更多关于[如何计算存储费用](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee)。
- `in_fwd_fees` 是只从区块链之外导入消息的收费，如`external` 消息。 每次您进行交易时，它都必须递交给将处理它的验证器。 对于从合同到订约的普通信息，这笔费用不适用。请阅读[TON Blockchain paper](https://docs.ton.org/tblkch.pdf) 了解更多关于入站信息的信息。
  - *示例*：您使用的每个钱包应用程序（如Tonkeeper）进行的每笔交易都需要首先在验证节点之间分发。
- `computation_fees` 是您为在虚拟机中执行代码而支付的金额。代码越大，必须支付的费用就越多。
  - *示例*：每次您使用钱包（即智能合约）发送交易时，您都会执行钱包合约的代码并为此付费。
- `action_fees` 是发送智能合约发出的消息的费用，更新智能合约代码，更新库等。
- `out_fwd_fees` 代表从TON区块链发送消息到外部服务（例如，日志）和外部区块链的费用。

## 常见问题

如果您在相当长的时间内（1年）没有使用您的TON钱包，*您将不得不支付比平常更大的手续费，因为钱包在发送和接收交易时支付手续费*。

### 公式

您可以使用以下公式大致计算智能合约的存储费用：

### 发送 Jettons 的费用？

让我们更仔细地检查每个值：

### 铸造 NFT 的成本？

`cell_price`和`bit_price`都可以从网络配置[参数18](https://explorer.toncoin.org/config?workchain=-1\&shard=8000000000000000\&seqno=22185244\&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382\&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam18)中获得。

### 在 TON 上保存数据的成本？

在TON上保存1 MB数据一年的成本为6.01 TON。请注意，您通常不需要在链上存储大量数据。如果您需要去中心化存储，请考虑[TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon)。

### 计算器示例

您可以使用此JS脚本计算工作链中1 MB存储1年的存储价格

### 如何计算？

TON Blockchain中有一篇关于 [费用计算](/v3/guidelines/smart-contracts/fee-calculation) 的文章。

## 参考文献

- 根据[@thedailyton文章](https://telegra.ph/Commissions-on-TON-07-22)改编，原作者[menschee](https://github.com/menschee)\*

## 参阅

- ["低级收费概述"](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)--了解佣金计算公式。
- [在 FunC 中计算远期费用的智能合约函数](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/forward-fees.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/transaction-fees/forward-fees.md
================================================
# 转发费用

一般来说，如果智能合约想向另一个智能合约发送查询，它应该支付发送内部消息到目标智能合约的费用（消息转发费），在目的地处理这条消息的费用（Gas费），以及在需要时发送回复的费用（消息转发费）。

:::note
在大多数情况下，发送者会附加少量的Toncoin（例如，一个Toncoin）到内部消息中（足以支付这条消息的处理费用），并设置其“弹回”标志（即，发送一个可弹回的内部消息）；接收者将在回答中返回收到的剩余价值（从中扣除消息转发费用）。这通常是通过调用`SENDRAWMSG`并设置`mode = 64`来实现的（参见TON VM文档的附录A）。
:::

如果接收者无法解析收到的消息并以非零exit code终止（例如，因为未处理的cell反序列化异常），消息将自动“弹回”到其发送者，清除“bounce”标志位并设置“bounced”标志。被弹回消息的主体将包含32位的`0xffffffff`，紧接着是原始消息的256位。在智能合约中解析`op`字段并处理相应查询之前，检查传入内部消息的“bounced”标志很重要（否则有风险，包含在被弹回消息中的查询将被其原始发送者处理为新的单独查询）。如果设置了“bounced”标志，特殊代码可以找出哪个查询失败了（例如，通过从被弹回消息中反序列化`op`和`query_id`）并采取适当行动。一个更简单的智能合约可能只是忽略所有被弹回的消息（如果设置了“bounced”标志则以exit code 0终止）。注意，“bounced”标志在发送时被重写，因此不能伪造，并且可以安全地假设如果消息带有“bounced”标志，那么它是从接收者发送的某个消息的弹回结果。

另一方面，接收者可能成功解析了传入的查询，并发现所请求的方法`op`不受支持，或者遇到了另一个错误条件。然后应该发送一个`op`等于`0xffffffff`或其他适当值的响应，如上所述，使用`SENDRAWMSG`并设置`mode = 64`。

在某些情况下，发送者希望既传输一些值给接收者，又接收确认消息或错误消息。例如，验证者选举智能合约接收选举参与请求以及作为附加值的注资。在这种情况下，附加额外的Toncoin（例如，一个Toncoin）到预期价值上是有意义的。如果出现错误（例如，出于任何原因可能不接受注资），应该将收到的全部金额（扣除处理费用）连同错误消息一起返回给发送者（例如，使用`SENDRAWMSG`并设置`mode = 64`，如前所述）。在成功的情况下，创建确认消息并精确地退还一个Toncoin（从这个值中扣除消息传输费用；这是`SENDRAWMSG`的`mode = 1`）。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/ton-documentation.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/ton-documentation.mdx
================================================
import Button from '@site/src/components/button'
import Player from '@site/src/components/player'

# TON 文档

欢迎来到官方TON区块链开发文档！

这个资源旨在为您提供在TON区块链上构建、测试和部署应用程序所需的所有必要信息。

这是一个协作的开源计划，我们始终欢迎贡献。所有文档都可以通过GitHub进行编辑，只需[遵循这些指示](/contribute)。

- _TON Hello World_ 系列提供了钱包、智能合约、小型应用程序以及在TON上测试和调试智能合约的详细逐步指南。
- _开始使用TON_ 是一个逐步指导与TON区块链互动的指南。（包括视频教程）

<Button href="https://helloworld.tonstudio.io/01-wallet/"
        colorType="primary" sizeType={'sm'}>

TON Hello World

</Button>

<Button href="/develop/get-started-with-ton" colorType={'secondary'} sizeType={'sm'}>

开始使用TON

</Button>

### TON 区块链基础

本课程介绍区块链基础知识，特别关注TON生态系统中的实践技能。您将了解区块链的运作方式及其多样化的应用。


<Button href="https://stepik.org/course/201294/promo"
        colorType={'primary'} sizeType={'sm'}>

查看区块链基础课程

</Button>


<Button href="https://stepik.org/course/200976/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/202221/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

### TON 课程

我们隆重推出 **TON区块链课程** ，这是一本关于TON区块链的综合指南。该课程专为想要学习如何以引人入胜的互动方式在 TON 区块链上创建智能合约和去中心化应用程序的开发人员而设计。

如果您刚开始接触TON区块链开发，建议您从头开始，并逐步学习这些主题。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

查看 TON 区块链课程

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

中文

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

俄语

</Button>

## 开发模块

如果您是 TON 区块链开发的新手，建议您从头开始学习这些主题。

### 基础概念

- [开放网络](/v3/concepts/dive-into-ton/introduction) - TON 区块链的高级概述。
- [区块链中的区块链](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) --对TON区块链脚踏实地的解释。
- [智能合约地址](/v3/documentation/smart-contracts/addresses) - 地址的详细解释。
- [ cell 作为一种数据结构](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) - 数据结构的高级解释。
- [TON 网络](/v3/concepts/dive-into-ton/ton-blockchain/ton-networking) - TON 点对点协议的高级概述。
- [TON 虚拟机 (TVM)](/v3/documentation/tvm/tvm-overview) - TON 虚拟机的高级概述。
- [事务和阶段](/v3/documentation/tvm/tvm-overview#transactions-and-phases) - 有关事务和阶段的详细解释。
- [交易费用](/v3/documentation/smart-contracts/transaction-fees/fees) - 交易费用的高级解释。

### 基础设施

- [节点类型](/v3/documentation/infra/nodes/node-types) - 节点类型的详细解释。
- [运行完整节点](/v3/guidelines/nodes/running-nodes/full-node) - 有关如何运行节点的详细说明。
- [TON DNS & Sites](/v3/guidelines/web3/ton-dns/dns) - TON DNS & Sites 的详细说明。
- [TON 存储](/v3/guidelines/web3/ton-storage/storage-daemon) - TON 存储的详细说明。

### 其他资源

- [TON Hello World: 逐步指导编写您的第一个智能合约](https://helloworld.tonstudio.io/02-contract/) - 使用JS的基础的简易解释。
- [如何使用钱包智能合约](/develop/smart-contracts/tutorials/wallet) - 使用JS和GO详细解释智能合约的基础知识。
- [通过示例学习智能合约](/develop/smart-contracts/examples)(FunC，Fift)

## DApp 开发

去中心化应用程序（DApps）是在点对点计算机网络上运行的应用程序，而不是单台计算机（TON区块链）。它们类似于传统的网络应用程序，但它们是建立在区块链网络之上的。这意味着DApps是去中心化的，即没有单一实体控制它们。

<Button href="/develop/dapps/" colorType={'primary'} sizeType={'sm'}>

开始

</Button>

<Button href="/v3/documentation/smart-contracts/getting-started/javascript" colorType={'secondary'} sizeType={'sm'}>

使用 Blueprint 

</Button>

<br></br><br></br>

以下资源为 TON 智能合约开发提供了宝贵信息：

- [API](/v3/guidelines/dapps/apis-sdks/api-types)
- [SDK](/develop/dapps/apis/sdk)
- [通过示例学习智能合约](/v3/documentation/smart-contracts/contracts-specs/examples) (FunC, Fift)
- [Speed Run TON](/v3/documentation/smart-contracts/contracts-specs/examples) -- 6个互动挑战和分步教程，学习智能合约开发。

## 常见问题解答

转到[常见问题解答](/develop/howto/faq)部分。

<Button href="/v3/guidelines/dapps/overview/" colorType={'primary'} sizeType={'sm'}>

入门

</Button>

### DeFi 开发公司

- [TON Connect](/v3/guidelines/ton-connect/overview) - DApps 的集成和验证。
- [链下支付处理](/v3/guidelines/dapps/asset-processing/payments-processing) — 支付处理的示例和概念。
- [TON Jetton处理](/v3/guidelines/dapps/asset-processing/jettons) — Jettons处理的示例和概念。
- [可替代（FT）/ 不可替代（NFT）代币](/v3/documentation/dapps/defi/tokens) — 相应的智能合约、示例和工具

通过全面的 DApps 构建指南，迈出 DApps 开发的第一步：

- [TON Hello World: Step by step guide for building your first web client](https://helloworld.tonstudio.io/03-client/)

### 应用程序接口和 SDK

- [APIs](/v3/guidelines/dapps/apis-sdks/api-types)
- [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)

## 常见问题

转到 [常见问题](/v3/documentation/faq) 部分。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/changelog/tvm-upgrade-2023-07.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/changelog/tvm-upgrade-2023-07.md
================================================
# TVM 升级 2023.07

:::tip
此升级于 2023 年 12 月在主网上启动，详细信息请参考 [run](https://t.me/tonblockchain/223)。
:::

# c7

**c7** 是存储有关合约执行所需的本地 context 信息的寄存器
（如时间、lt、网络配置等）。

**c7** 元组从 10 扩展到 14 个元素：

- **10**: 存储智能合约本身的 `cell`。
- **11**: `[integer, maybe_dict]`：传入消息的 TON 值，额外代币。
- **12**: `integer`，存储阶段收取的费用。
- **13**: `tuple` 包含有关先前区块的信息。

**10** 当前智能合约的代码仅以可执行继续的形式在 TVM 级别呈现，无法转换为cell。这段代码通常用于授权相同类型的 neighbor 合约，例如 Jetton 钱包授权 Jetton 钱包。目前我们需要显式地代码cell存储在存储器中，这使得存储和 init_wrapper 变得更加麻烦。
使用 **10** 作为代码对于 tvm 的 Everscale 更新兼容。

**11** 当前，传入消息的值在 TVM 初始化后以堆栈形式呈现，因此如果在执行过程中需要，
则需要将其存储到全局变量或通过本地变量传递（在 funC 级别看起来像所有函数中的额外 `msg_value` 参数）。通过将其放在 **11** 元素中，我们将重复合约余额的行为：它既出现在堆栈中，也出现在 c7 中。

**12** 目前计算存储费用的唯一方法是在先前的交易中存储余额，以某种方式计算 prev 交易中的 gas 用量，然后与当前余额减去消息值进行比较。与此同时，经常希望考虑存储费用。

**13** 目前没有办法检索先前区块的数据。TON 的一个关键特性是每个结构都是 Merkle 证明友好的cell（树），此外，TVM 也是cell和 Merkle 证明友好的。通过在 TVM context中包含区块信息，将能够实现许多不信任的情景：合约 A 可以检查合约 B 上的交易（无需 B 的合作），可以恢复中断的消息链（当恢复合约获取并检查某些事务发生但被还原的证明时），还需要了解主链区块哈希以在链上进行某些验证 fisherman 函数功能。

区块 id 的表示如下：

```
[ wc:Integer shard:Integer seqno:Integer root_hash:Integer file_hash:Integer ] = BlockId;
[ last_mc_blocks:[BlockId0, BlockId1, ..., BlockId15]
  prev_key_block:BlockId ] : PrevBlocksInfo
```

包括主链的最后 16 个区块的 id（如果主链 seqno 小于 16，则为少于 16 个），以及最后的关键区块。包含有关分片区块的数据可能会导致一些数据可用性问题（由于合并/拆分事件），这并非必需（因为可以使用主链区块来证明任何事件/数据），因此我们决定不包含。

# 新的操作码

在选择新操作码的 gas 成本时的经验法则是它不应少于正常成本（从操作码长度计算）且不应超过每个 gas 单位 20 ns。

## 用于处理新 c7 值的操作码

每个操作码消耗 26 gas，除了 `PREVMCBLOCKS` 和 `PREVKEYBLOCK`（34 gas）。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                |
| :--------------------------------- | :--------------- | :-------------------------------------------------------------------------- |
| `MYCODE`                           | *`- c`*          | 从 c7 检索智能合约的代码                                                              |
| `INCOMINGVALUE`                    | *`- t`*          | 从 c7 检索传入消息的值                                                               |
| `STORAGEFEES`                      | *`- i`*          | 从 c7 检索存储阶段费用的值                                                             |
| `PREVBLOCKSINFOTUPLE`              | *`- t`*          | 从 c7 中检索 PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` |
| `PREVMCBLOCKS`                     | *`- t`*          | 仅检索 `last_mc_blocks`                                                        |
| `PREVKEYBLOCK`                     | *`- t`*          | 仅检索 `prev_key_block`                                                        |
| `GLOBALID`                         | *`- i`*          | 从网络配置的第 19 项检索 `global_id`                                                  |

## Gas

| xxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
| :------------------------- | :-------------- | :-------------------------------------------- |
| `GASCONSUMED`              | *`- g_c`*       | 返回到目前为止 VM 消耗的 gas（包括此指令）。<br/>*26 gas*       |

## 算术

New variants of [the division opcode](https://docs.ton.org/learn/tvm-instructions/instructions#52-division) (`A9mscdf`) are added:
`d=0` takes one additional integer from stack and adds it to the intermediate value before division/rshift. These operations return both the quotient and the remainder (just like `d=3`).

还提供了静默变体（例如 `QMULADDDIVMOD` 或 `QUIET MULADDDIVMOD`）。

如果返回值不适应 257 位整数或除数为零，非静默操作会引发整数溢出异常。静默操作返回 `NaN` 而不是不适应的值（如果除数为零则返回两个 `NaN`）。

Gas 成本等于 10 加上操作码长度：大多数操作码为 26 gas，`LSHIFT#`/`RSHIFT#` 额外加 8，静默额外加 8。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>堆栈       |
| :--------------------------------- | :------------------------------------------------ |
| `MULADDDIVMOD`                     | *`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`*       |
| `MULADDDIVMODR`                    | *`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`*       |
| `MULADDDIVMODC`                    | *`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`*        |
| `ADDDIVMOD`                        | *`x w z - q=floor((x+w)/z) r=(x+w)-zq`*           |
| `ADDDIVMODR`                       | *`x w z - q=round((x+w)/z) r=(x+w)-zq`*           |
| `ADDDIVMODC`                       | *`x w y - q=ceil((x+w)/z) r=(x+w)-zq`*            |
| `ADDRSHIFTMOD`                     | *`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`*      |
| `ADDRSHIFTMODR`                    | *`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`*      |
| `ADDRSHIFTMODC`                    | *`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`*       |
| `z ADDRSHIFT#MOD`                  | *`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`*        |
| `z ADDRSHIFTR#MOD`                 | *`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`*        |
| `z ADDRSHIFTC#MOD`                 | *`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`*         |
| `MULADDHIFTMOD`                    | *`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`*  |
| `MULADDRSHIFTRMOD`                 | *`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`*  |
| `MULADDHIFTCMOD`                   | *`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`*   |
| `z MULADDRSHIFT#MOD`               | *`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`*    |
| `z MULADDRSHIFTR#MOD`              | *`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`*    |
| `z MULADDRSHIFTC#MOD`              | *`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`*     |
| `LSHIFTADDDIVMOD`                  | *`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`* |
| `LSHIFTADDDIVMODR`                 | *`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`* |
| `LSHIFTADDDIVMODC`                 | *`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`*  |
| `y LSHIFT#ADDDIVMOD`               | *`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`*   |
| `y LSHIFT#ADDDIVMODR`              | *`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`*   |
| `y LSHIFT#ADDDIVMODC`              | *`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`*    |

## 堆栈操作

目前，所有堆栈操作的参数都以 256 为界。
这意味着如果堆栈深度超过 256，就很难管理深堆栈元素。
在大多数情况下，这种限制并没有安全方面的原因，也就是说，限制参数并不是为了防止过于昂贵的操作。
对于某些大规模堆栈操作，如 `ROLLREV`（计算时间与参数值成线性关系），气体成本也与参数值成线性关系。

- 现在，`PICK`、`ROLL`、`ROLLREV`、`BLKSWX`、`REVX`、`DROPX`、`XCHGX`、`CHKDEPTH`、`ONLYTOPX`、`ONLYX` 的参数不受限制。
- 当参数较大时，`ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX` 耗气量更大：额外耗气量为 `max(arg-255,0)`（参数小于 256 时，耗气量不变，与当前行为一致）
- 对于 `BLKSWX`，额外费用为 `max(arg1+arg2-255,0)`（这与当前行为不符，因为当前 `arg1` 和 `arg2` 都限制为 255）。

## 哈希值

目前，TVM 只提供两种散列操作：计算 cell /片的表示散列和数据的 sha256，但最多只能计算 127 字节（一个 cell 只能容纳这么多数据）。

`HASHEXT[A][R]_(HASH)` 系列操作被添加：

| xxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明 |
| :------------------------------ | :---------------------------- | :-------------------------------------------- |
| `HASHEXT_(HASH)`                | *`s_1 ... s_n n - h`*         | 计算并返回片段（或构建器）`s_1...s_n`的连接哈希值。               |
| `HASHEXTR_(HASH)`               | *`s_n ... s_1 n - h`*         | 同理，但参数顺序相反。                                   |
| `HASHEXTA_(HASH)`               | *`b s_1 ... s_n n - b'`*      | 将生成的哈希值追加到构造函数 `b` 中，而不是推送到堆栈中。               |
| `HASHEXTAR_(HASH)`              | *`b s_n ... s_1 n - b'`*      | 参数以相反顺序给出，并将哈希值追加到生成器中。                       |

仅使用 `s_i` 的根cell的位。

每个块 `s_i` 可能包含非整数数量的字节。但所有块的位的和应该是 8 的倍数。注意 TON 使用最高位优先顺序，因此当连接两个具有非整数字节的 slice 时，第一个 slice 的位变为最高位。

Gas 消耗取决于哈希字节数和所选算法。每个块额外消耗 1 gas 单位。

如果未启用 `[A]`，则哈希的结果将作为无符号整数返回，如果适应 256 位，否则返回整数的元组。

可用以下算法：

- `SHA256` - openssl 实现，每字节 1/33 gas，哈希为 256 位。
- `SHA512` - openssl 实现，每字节 1/16 gas，哈希为 512 位。
- `BLAKE2B` - openssl 实现，每字节 1/19 gas，哈希为 512 位。
- `KECCAK256` - [以太坊兼容实现](http://keccak.noekeon.org/)，每字节 1/11 gas，哈希为 256 位。
- `KECCAK512` - [以太坊兼容实现](http://keccak.noekeon.org/)，每字节 1/6 gas，哈希为 512 位。

Gas 用量四舍五入。

## 加密货币

目前唯一可用的加密算法是 "CCHKSIGN"：检查哈希 "h "与公钥 "k "的 Ed25519 签名。

- 为了与比特币和以太坊等上一代区块链兼容，我们还需要检查 `secp256k1` 签名。
- 对于现代密码算法，最低要求是曲线的加法和乘法。
- 为了与以太坊 2.0 PoS 和其他现代密码学的兼容性，我们需要在 bls12-381 曲线上进行 BLS 签名方案。
- 对于某些安全硬件，需要 `secp256r1 == P256 == prime256v1`。

### secp256k1

比特币/以太坊签名。使用 [libsecp256k1 实现](https://github.com/bitcoin-core/secp256k1)。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈         | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                      |
| :------------------------ | :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ECRECOVER`               | *`hash v r s - 0 or h x1 x2 -1`* | 从签名恢复公钥，与比特币/以太坊操作相同。<br/>以 32 字节哈希作为 uint256 `hash`；以 65 字节签名作为 uint8 `v` 和 uint256 `r`、`s`。<br/>失败返回 `0`，成功返回公钥和 `-1`。<br/>以 65 字节公钥返回为 uint8 `h`，uint256 `x1`、`x2`。<br/>*1526 gas* |

### secp256r1

使用 OpenSSL 实现。界面类似于 `CHKSIGNS`/`CHKSIGNU`。与 Apple Secure Enclave 兼容。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                                             |
| :------------------------ | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `P256_CHKSIGNS`           | *`d sig k - ?`*          | 检查片段 `d` 的数据部分和公钥 `k` 的 seck256r1-signature `sig`。成功时返回-1，失败时返回 0。<br/>公钥是一个 33 字节的片段（根据 [SECG SEC 1](https://www.secg.org/sec1-v2.pdf) 第 2.3.4 节第 2 点编码）。<br/>签名 `sig` 是一个 64 字节的片段（两个 256 位无符号整数 `r` 和 `s`）。<br/>*3526 gas* |
| `P256_CHKSIGNU`           | *`h sig k - ?`*          | 相同，但签名的数据是 32 字节对 256 位无符号整数 `h` 的编码。<br/>*3526 gas*                                                                                                                                                                                                          |

### Ristretto

扩展文档 [此处](https://ristretto.group/)。简而言之，Curve25519 在开发时考虑到了性能，但由于组元素有多种表示形式，因此它具有对称性。较简单的协议（如 Schnorr 签名或 Diffie-Hellman 协议）在协议层面采用了一些技巧来缓解某些问题，但却破坏了密钥推导和密钥保密方案。这些技巧无法扩展到更复杂的协议，如防弹协议。Ristretto 是 Curve25519 的算术抽象，每个组元素对应一个唯一的点，这是大多数加密协议的要求。Ristretto 本质上是 Curve25519 的压缩/解压缩协议，提供了所需的算术抽象。因此，加密协议很容易正确编写，同时还能受益于 Curve25519 的高性能。

Ristretto 操作允许在 Curve25519 上计算曲线操作（反之则不行），因此我们可以认为我们在一个步骤中同时添加了 Ristretto 和 Curve25519 曲线操作。

[libsodium](https://github.com/jedisct1/libsodium/) 实现已被使用。

所有 ristretto-255 点都在TVM中表示为 256 位无符号整数。非静默操作在参数无效的情况下引发 `range_chk`。零点表示为整数 `0`。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                         |
| :------------------------ | :----------------------- | :------------------------------------------------------------------------ |
| `RIST255_FROMHASH`        | *`h1 h2 - x`*            | 从 512 位哈希（由两个 256 位整数给出）确定性生成有效点 `x`。<br/>*626 gas*                       |
| `RIST255_VALIDATE`        | *`x -`*                  | 检查整数 `x` 是否是某个曲线点的有效表示。出错时会抛出 `range_chk`。<br/>*226 gas*                  |
| `RIST255_ADD`             | *`x y - x+y`*            | 在曲线上两个点的相加。<br/>*626 gas*                                                 |
| `RIST255_SUB`             | *`x y - x-y`*            | 在曲线上两个点的相减。<br/>*626 gas*                                                 |
| `RIST255_MUL`             | *`x n - x*n`*            | 将点 `x` 乘以标量 `n`。<br/>任何 `n` 都有效，包括负数。<br/>*2026 gas*                      |
| `RIST255_MULBASE`         | *`n - g*n`*              | 将生成器点 `g` 乘以标量 `n`。<br/>任何 `n` 都有效，包括负数。<br/>*776 gas*                    |
| `RIST255_PUSHL`           | *`- l`*                  | 推送整数 `l=2^252+27742317777372353535851937790883648493`，这是群的阶。<br/>*26 gas* |
| `RIST255_QVALIDATE`       | *`x - 0 或 -1`*           | `RIST255_VALIDATE` 的静默版本。<br/>*234 gas*                                   |
| `RIST255_QADD`            | *`x y - 0 或 x+y -1`*     | `RIST255_ADD` 的静默版本。<br/>*634 gas*                                        |
| `RIST255_QSUB`            | *`x y - 0 或 x-y -1`*     | `RIST255_SUB` 的静默版本。<br/>*634 gas*                                        |
| `RIST255_QMUL`            | *`x n - 0 或 x*n -1`*     | `RIST255_MUL` 的静默版本。<br/>*2034 gas*                                       |
| `RIST255_QMULBASE`        | *`n - 0 或 g*n -1`*       | `RIST255_MULBASE` 的静默版本。<br/>*784 gas*                                    |

### BLS12-381

在配对友好的 BLS12-381 曲线上进行操作。使用 [BLST](https://github.com/supranational/blst) 实现。此外，还对基于该曲线的 BLS 签名方案进行了操作。

BLS 值在 TVM 中的表示方法如下：

- G1点和公钥：48字节 slice 。
- G2点和签名：96字节 slice 。
- 字段FP的元素：48字节 slice 。
- 字段FP2的元素：96字节 slice 。
- 信息： slice 。位数应能被 8 整除。

当输入值是一个点或一个字段元素时，片段的长度可能超过 48/96 字节。在这种情况下，只取前 48/96 字节。如果片段的字节数少于 48/96（或信息大小不能被 8 整除），则会出现 cell 下溢异常。

#### 高级操作

这些是验证 BLS 签名的高级操作。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈                   | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                 |
| :------------------------ | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `BLS_VERIFY`              | *`pk msg sgn - bool`*                      | 检查 BLS 签名，成功时返回 true，否则返回 false。<br/>*61034 gas*                                                                  |
| `BLS_AGREGATE`            | *`sig_1 ... sig_n n - sig`*                | 聚合签名。`n>0`.如果 `n=0` 或某些 `sig_i` 不是有效签名，则抛出异常。<br/>*`gas=n*4350-2616`*                             |
| `BLS_FASTAGREGATEVERIFY`- | *`pk_1 ... pk_n n msg sig - bool`*         | 检查密钥 `pk_1...pk_n` 和信息 `msg` 的聚合 BLS 签名。成功时返回 true，否则返回 false。如果 `n=0` 则返回 false。<br/>*`gas=58034+n*3000`*        |
| `BLS_AGREGATEVERIFY`      | *`pk_1 msg_1 ... pk_n msg_n n sgn - bool`* | 检查密钥-消息对 `pk_1 msg_1...pk_n msg_n` 的聚合 BLS 签名。成功时返回 true，否则返回 false。如果 `n=0` 则返回 false。<br/>*`gas=38534+n*22500`* |

`VERIFY` 指令不会对无效签名和公钥抛出异常（ cell 下溢异常除外），而是返回 false。

#### 低级操作

这些是对组元素的算术操作。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈                        | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                          |
| :------------------------ | :---------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLS_G1_ADD`              | *`x y - x+y`*                                   | G1上的加法。<br/>*3934 gas*                                                                                                                                     |
| `BLS_G1_SUB`              | *`x y - x-y`*                                   | G1上的减法。<br/>*3934 gas*                                                                                                                                     |
| `BLS_G1_NEG`              | *`x - -x`*                                      | G1上的取反。<br/>*784 gas*                                                                                                                                      |
| `BLS_G1_MUL`              | *`x s - x*s`*                                   | 将G1点`x`乘以标量`s`。<br/>任何`s`都是有效的，包括负数。<br/>*5234 gas*                                                                                                        |
| `BLS_G1_MULTIEXP`         | *`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`* | 计算G1点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。&#xA<br/>任何`s_i`都是有效的，包括负数。<br/>`gas=11409+n*630+n/floor(max(log2(n),4))*8820`   |
| `BLS_G1_ZERO`             | *`- zero`*                                      | 推送零点到G1中。<br/>*34 gas*                                                                                                                                     |
| `BLS_MAP_TO_G1`           | *`f - x`*                                       | 将FP元素`f`转换为G1点。<br/>*2384 gas*                                                                                                                             |
| `BLS_G1_INTROUP`          | *`x - bool`*                                    | 检查 slice `x`是否表示有效的G1元素。<br/>*2984 gas*                                                                                                                    |
| `BLS_G1_ISZERO`           | *`x - bool`*                                    | 检查G1点`x`是否等于零。<br/>*34 gas*                                                                                                                                |
| `BLS_G2_ADD`              | *`x y - x+y`*                                   | G2上的加法。<br/>*6134 gas*                                                                                                                                     |
| `BLS_G2_SUB`              | *`x y - x-y`*                                   | G2上的减法。<br/>*6134 gas*                                                                                                                                     |
| `BLS_G2_NEG`              | *`x - -x`*                                      | G2上的取反。<br/>*1584 gas*                                                                                                                                     |
| `BLS_G2_MUL`              | *`x s - x*s`*                                   | 将G2点`x`乘以标量`s`。<br/>任何`s`都是有效的，包括负数。<br/>*10584 gas*                                                                                                       |
| `BLS_G2_MULTIEXP`         | *`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`* | 计算G2点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。&#xA<br/>任何`s_i`都是有效的，包括负数。<br/>`gas=30422+n*1280+n/floor(max(log2(n),4))*22840` |
| `BLS_G2_ZERO`             | *`- zero`*                                      | 推送零点到G2中。<br/>*34 gas*                                                                                                                                     |
| `BLS_MAP_TO_G2`           | *`f - x`*                                       | 将FP2元素`f`转换为G2点。<br/>*7984 gas*                                                                                                                            |
| `BLS_G2_INTROUP`          | *`x - bool`*                                    | 检查 slice `x`是否表示有效的G2元素。<br/>*4284 gas*                                                                                                                    |
| `BLS_G2_ISZERO`           | *`x - bool`*                                    | 检查G2点`x`是否等于零。<br/>*34 gas*                                                                                                                                |
| `BLS_PAIRING`             | *`x_1 y_1 ... x_n y_n n - bool`*                | 给定 G1 点 `x_i` 和 G2 点 `y_i`，计算并乘以 `x_i,y_i` 的配对。如果结果是 FP12 中的乘法同一性，则返回 true，否则返回 false。如果 `n=0` 则返回 false。<br/>*`gas=20034+n*11800`*                        |
| `BLS_PUSHR`               | *`- r`*                                         | 推送G1和G2的阶（约为`2^255`）。<br/>*34 gas*                                                                                                                         |

`INGROUP`，`ISZERO`在无效的点上（除了cell下溢异常）不会引发异常，而是返回false。

其他算术操作在无效的曲线点上引发异常。请注意，它们不检查给定的曲线点是否属于G1/G2群。使用 `INGROUP` 指令来检查这一点。

## RUNVM

Currently there is no way for code in TVM to call external untrusted code "in sandbox". In other words, external code always can irreversibly update code, data of contract, or set actions (such as sending all money).
`RUNVM` instruction allows to spawn an independent VM instance, run desired code and get needed data (stack, registers, gas consumption etc) without risks of polluting caller's state. Running arbitrary code in a safe way may be useful for [v4-style plugins](/participate/wallets/contracts#wallet-v4), Tact's `init` style subcontract calculation etc.

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈                                                                                 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                          |
| :------------------------ | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `flags RUNVM`             | *`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`*       | 以代码 `code` 和堆栈 `x_1...x_n` 运行子虚拟机。返回生成的堆栈 `x'_1...x'_m` 和 exitcode。<br/>其他参数和返回值由标志启用，见下文。 |
| `RUNVMX`                  | *`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`* | 相同，但会从堆栈中弹出标志。                                                                             |

标志类似于 fift 中的 `runvmx`：

- `+1`：将c3设置为代码
- `+2`：在运行代码之前推送一个隐式的0
- `+4`：从堆栈中取`c4`（持久性数据），返回其最终值
- `+8`：从堆栈中取gas限制`g_l`，返回消耗的gas `g_c`
- `+16`: 从堆栈中取出 `c7` （智能合约上下文）
- `+32`：返回`c5`的最终值（操作）
- `+64`：从堆栈中弹出硬gas限制（由ACCEPT启用）`g_m`
- `+128`:"孤立的 gas 消耗"。子虚拟机将有一组单独的访问 cell 和一个单独的 chksgn 计数器。
- `+256`: pop integer `r`, return exactly `r` values from the top of the stack (only if `exitcode=0 or 1`; if not enough then `exitcode=stk_und`)

gas成本：

- 66 Gas
- 每向子虚拟机提供一个堆栈元素，就产生 1 个 gas（前 32 个免费）
- 子虚拟机每返回一个堆栈元素，就产生 1 个 gas（前 32 个免费）

## 发送信息

目前在合约中难以计算发送消息的成本（导致了一些近似，比如在[jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94)中）并且如果 Action Phase 不正确，则无法将请求反弹回。精确减去传入消息的“合约逻辑的常量费用”和“gas费用”是不可能的。

- `SENDMSG` 将 cell 和模式作为输入。创建一个输出操作，并返回创建信息的费用。模式的作用与 SENDRAWMSG 相同。此外，`+1024` 表示不创建操作，只估算费用。其他模式对费用计算的影响如下：+64 "替换接收信息的全部余额作为接收值（略微不准确，因为计算完成前无法估算的 gas 费用未被考虑在内），"+128 "替换计算阶段开始前合同的全部余额值（略微不准确，因为计算完成前无法估算的 gas 费用未被考虑在内）。
- `SENDRAWMSG`，`RAWRESERVE`，`SETLIBCODE`，`CHANGELIB` - 添加了`+16`标志位，这意味着在操作失败时反弹交易。如果使用了`+2`，则没有效果。

## 安全审计

对 TON 虚拟机 (TVM) 的升级进行了安全和潜在漏洞分析。

**审计公司**：Trail of Bits\
**审计报告**：

- [Trail of Bits  审计报告 - TVM 升级](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/changelog/tvm-upgrade-2024-04.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/changelog/tvm-upgrade-2024-04.md
================================================
# 新指令介绍，用于计算廉价手续费

## 新指令介绍，用于计算廉价手续费

:::tip
此更新已在测试网激活，预计将于4月在主网激活。此更新的预览版本可在`@ton-community/sandbox@0.16.0-tvmbeta.3`、`@ton-community/func-js@0.6.3-tvmbeta.3`与`@ton-community/func-js-bin@0.4.5-tvmbeta.3`包中找到。
:::

此更新通过Config8 `version` >= 6进行激活。

## c7

**c7** 元组从 14 个元素扩展到 16 个元素：

- **14**：元组，包含一些作为 cell  slice 的配置参数。如果配置中没有该参数，则其值为空。
  - **0**: 来自 `ConfigParam 18` 的 `StoragePrices` 条目。不是整个 dict，而只是与当前时间相对应的一个 StoragePrices 条目。
  - **1**: `ConfigParam 19` (global id).
  - **2**: `ConfigParam 20` (mc gas prices).
  - **3**: `ConfigParam 21` (gas prices).
  - **4**: `ConfigParam 24` (mc fwd fees).
  - **5**: `ConfigParam 25` (fwd fees).
  - **6**: `ConfigParam 43` (size limits).
- **15**: "[due payment](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L237)" - 当前存储费债务（ nanotons  ）。Asm 操作码：`DUEPAYMENT`。
- **16**: "precompiled gas usage" - 当前合约的 gas 用量（如果是预编译合约，请参阅 ConfigParam 45），否则为空。Asm 操作码：`GETPRECOMPILEDGAS`。

需要到期支付，以便合约能够正确评估存储费用。

需要进行到期支付，合约才能正确评估存储费用：当信息以默认（可跳转）模式发送到智能合约时，存储费用会被扣除（或添加到包含存储费用相关债务的到期支付字段），之前的信息值会添加到余额中。因此，如果合约在处理完信息后，以 mode=64 发送 gas 超量信息，这就意味着如果合约余额为 0，下一笔交易的存储费就会开始在 due_payment 中累积（而不是从收到的信息中扣除）。这样债务就会无声无息地累积，直到账户冻结。`DUEPAYMENT` 允许开发者明确记账/扣留存储佣金，从而防止出现任何问题。

## 用于处理新c7值的操作码

### 操作码与新的 c7 值配合使用

每个操作码使用26 gas，`SENDMSG`除外（因为涉及cell操作）。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx <br/>说明                                  |
| :--------------------------------- | :--------------- | :----------------------------------------------------------------------------- |
| `UNPACKEDCONFIGTUPLE`              | *`- c`*          | 从 c7 读取配置 slice 的元组                                                            |
| `DUEPAYMENT`                       | *`- i`*          | 从 c7 中读取应付款项的值                                                                 |
| `GLOBALID`                         | *`- i`*          | 现在从c7检索`ConfigParam 19`，而不是直接从配置字典。                                            |
| `SENDMSG`                          | *`msg mode - i`* | 现在从c7检索`ConfigParam 24/25`（消息价格）和`ConfigParam 43`（`max_msg_cells`），而不是直接从配置字典。 |

### 处理配置参数的操作码

每个操作码使用26 gas。

每个操作码使用26 gas。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxx<br/>堆栈                     | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                                                                          |
| :--------------------------------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GETGASFEE`                        | *`gas_used is_mc - price`*           | 为消耗_`gas_used`_ gas 的交易计算计算成本（nanotons）。                                                                                                                                                                                                    |
| `GETSTORAGEFEE`                    | *`cells bits seconds is_mc - price`* | 基于当前存储价格为合约计算存储费用（nanotons）。`cells`与`bits`是 [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) 的大小（包括去重，包含根cell）。                                                                                      |
| `GETFORWARDFEE`                    | *`cells bits is_mc - price`*         | 计算发出报文的转发费用（以 nanotons  为单位）。如果信息源或目的地都在主链中，*`is_mc`* 为 true；如果都在基链中，则为 false。注意，计算报文中的 cell 和比特时应考虑重复数据删除和_root-is-not-counted_规则。                                                                                                         |
| `GETPRECOMPILEDGAS`                | *`- null`*                           | 保留，目前返回 `null`。如果该合约是 *预编译* ，将以 gas 单位返回合约执行成本。                                                                                                                                                                                                                                       |
| `GETORIGINALFWDFEE`                | *`fwd_fee is_mc - orig_fwd_fee`*     | 计算 `fwd_fee * 2^16 / first_frac`。可用于从输入信息中解析出的 `fwd_fee` 中获取信息的原始 `fwd_fee`（作为 [这个](https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-wallet.fc#L224C17-L224C46) 等硬编码值的替代）。如果信息源或目的地在主链中，*`is_mc`*  为 true；如果两者都在基链中，则为 false。 |
| `GETGASFEESIMPLE`                  | *`gas_used is_mc - price`*           | 计算消耗额外 *`gas_used`* 的交易的额外计算成本（以 nanotons  为单位）。换句话说，与 `GETGASFEE` 相同，但没有统一价格（就是 `(gas_used * price) / 2^16`）。                                                                                                                                                                        |
| `GETFORWARDFEESIMPLE`              | *`cells bits is_mc - price`*         | 计算包含额外的 *`cells`* 和 *`bits`* 的消息的额外转发成本 换言之，与`GETFORWARDFEEE` 相同，但没有总价(只是 `(bits*bit_price + cells*cell_price) / 2^16`)。                                                                                                                                           |

`gas_used`, `cells`, `bits`, `time_delta` 是范围为 `0..2^63-1` 的整数。

### cell 级操作

每个操作码使用26 gas。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift语法 | xxxxxxxxx<br/>堆栈      | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
| :-------------------------------- | :-------------------- | :------------------------------------------- |
| `CLEVEL`                          | *`cell - level`*      | 返回cell的级别                                    |
| `CLEVELMASK`                      | *`cell - level_mask`* | 返回cell的级别掩码                                  |
| `i CHASHI`                        | *`cell - hash`*       | 返回cell的`i`th哈希                               |
| `i CDEPTHI`                       | *`cell - depth`*      | 返回cell的`i`th深度                               |
| `CHASHIX`                         | *`cell i - depth`*    | 返回cell的`i`th哈希                               |
| `CDEPTHIX`                        | *`cell i - depth`*    | 返回cell的`i`th深度                               |

`i`的范围是`0..3`。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/specification/runvm.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/specification/runvm.mdx
================================================
# RUNVM 规格

目前，TVM 中的代码无法调用 "沙盒 "中的外部不信任代码。换句话说，外部代码始终可以不可逆地更新代码、合约数据或设置操作（如发送所有资金）。 

`RUNVM` 指令允许生成一个独立的虚拟机实例，运行所需的代码并获取所需的数据（堆栈、寄存器、耗气量等），而没有污染调用者状态的风险。以安全的方式运行任意代码可能对 [v4 风格插件](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4)、Tact 的`init`风格子合约计算等有用。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈                                                                                 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                                                                                     |
| :------------------------ | :------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flags RUNVM`             | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_       | 以代码 `code` 和堆栈 `x_1...x_n` 运行子虚拟机。返回生成的堆栈 `x'_1...x'_m` 和 exitcode。<br/>其他参数和返回值由标志启用，见下文。                                                                                                                                                                                                            |
| `RUNVMX`                  | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | 相同，但会从堆栈中弹出标志。                                                                                                                                                                                                                                                                                        |

标志类似于 fift 中的 `runvmx`：

- `+1`：设置 c3 为代码
- `+2`：运行代码前推送一个隐式 0
- \+4"： 从堆栈中取出 `c4`（持久数据），返回其最终值
- `+8`：从堆栈中取gas限制`g_l`，返回消耗的gas `g_c`
- `+16`：从堆栈中取出 `c7` （智能合约上下文）
- `+32`：返回`c5`的最终值（操作）
- `+64`：从堆栈中弹出硬gas限制（由ACCEPT启用）`g_m`
- `+128`："孤立的 gas 消耗"。子虚拟机将有一组单独的访问 cell 和一个单独的 chksgn 计数器。
- `+256`：弹出整数 `r`，从顶部返回整数 `r` 值：
- 如果 RUNVM 调用成功且 r 已设置，则返回 r 个元素。如果 r 未设置，则返回所有元素；
- 如果 RUNVM 成功，但堆栈中没有足够的元素（堆栈深度小于 r），则在子虚拟机中视为异常，exit_code=-3，exit_arg=0（因此 0 将作为唯一的堆栈元素返回）；
- 如果 RUNVM 异常失败 - 只返回一个元素 - exit arg（不要误认成 exit_code ）；
- 如果是 OOG，exit_code = -14，exit_arg 为 gas 量。

gas成本：

- 66 gas
- 每向子虚拟机提供一个堆栈元素，就产生 1 个 gas （前 32 个免费）
- 子虚拟机每返回一个堆栈元素，就产生 1 个 gas （前 32 个免费）

## 另请参见

- [TVM 说明](/v3/documentation/tvm/instructions)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/tvm-exit-codes.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/tvm-exit-codes.md
================================================
# TVM Exit codes (TVM退出代码)

If TVM exits with an arbitrary 16-bit unsigned integer `exit_code`. `exit_code` higher than 1, it is considered to be an *error code*, therefore an exit with such a code may cause the transaction to revert/bounce.

## 标准退出码

:::info
The list of standard exit codes contains all universal TVM exit codes defined for TON Blockchain. Alternative exit codes should be sought in the source code of corresponded contract.
:::

| Exit code | TVM Phase     | 描述                                                                                                                                                                                                         |
| --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`       | Compute Phase | 标准成功执行退出码。                                                                                                                                                                                                 |
| `1`       | Compute Phase | 备选成功执行退出码。                                                                                                                                                                                                 |
| `2`       | Compute Phase | Stack underflow. Last op-code consumed more elements than there are on the stacks. <sup>1</sup>                                                                            |
| `3`       | Compute Phase | Stack overflow. More values have been stored on a stack than allowed by this version of TVM.                                                                               |
| `4`       | Compute Phase | 整数溢出。整数不适应于 −2<sup>256</sup> ≤ x < 2<sup>256</sup> 或发生了除零操作。                                                                                                                      |
| `5`       | Compute Phase | Integer out of expected range.                                                                                                                                                             |
| `6`       | Compute Phase | Invalid opcode. Instruction is unknown in the current TVM version.                                                                                                         |
| `7`       | Compute Phase | Type check error. An argument to a primitive is of an incorrect value type. <sup>1</sup>                                                                                   |
| `8`       | Compute Phase | Cell overflow. Writing to builder is not possible since after operation there would be more than 1023 bits or 4 references.                                                |
| `9`       | Compute Phase | Cell underflow. Read from slice primitive tried to read more bits or references than there are.                                                                            |
| `10`      | Compute Phase | Dictionary error. Error during manipulation with dictionary (hashmaps).                                                                                 |
| `11`      | Compute Phase | 最常见的原因是尝试调用在代码中未找到其 ID 的 get 方法（在调用时未找到 `method_id` 修饰符，或者在尝试调用时指定的 get 方法名不正确）。在[TVM文档](https://ton.org/tvm.pdf)中描述为"未知错误，可能由用户程序抛出"。                                                                     |
| `12`      | Compute Phase | Thrown by TVM in situations deemed impossible.                                                                                                                                             |
| `13`      | Compute Phase | Out of gas error. Thrown by TVM when the remaining gas becomes negative.                                                                                                   |
| `-14`     | Compute Phase | It means out of gas error, same as `13`. Negative, because it [cannot be faked](https://github.com/ton-blockchain/ton/blob/20758d6bdd0c1327091287e8a620f660d1a9f4da/crypto/vm/vm.cpp#L492) |
| `32`      | Action Phase  | Action list is invalid. Set during action phase if c5 register after execution contains unparsable object.                                                                 |
| `-32`     | Action Phase  | （与前面的 32 相同）- 未找到方法 ID。在尝试执行不存在的 get 方法时，TonLib 返回此值。                                                                                                                                                      |
| `33`      | Action Phase  | Action list is too long.                                                                                                                                                                   |
| `34`      | Action Phase  | Action is invalid or not supported. Set during action phase if current action cannot be applied.                                                                           |
| `35`      | Action Phase  | Invalid Source address in outbound message.                                                                                                                                                |
| `36`      | Action Phase  | Invalid Destination address in outbound message.                                                                                                                                           |
| `37`      | Action Phase  | Not enough TON. Message sends too much TON (or there is not enough TON after deducting fees).                                                           |
| `38`      | Action Phase  | 额外代币不足。                                                                                                                                                                                                    |
| `40`      | Action Phase  | Not enough funds to process a message. This error is thrown when there is only enough gas to cover part of the message, but does not cover it completely.                  |
| `43`      | Action Phase  | The maximum number of cells in the library is exceeded or the maximum depth of the Merkle tree is exceeded.                                                                                |

<sup>1</sup> 如果在 func 合约中遇到此类异常，这可能意味着汇编声明中存在类型错误。

:::info
通常，您会看到Exit code `0xffff`（十进制形式为 65535）。这通常意味着合约不认识接收到的操作码。在编写合约时，开发人员自己设置的此代码。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/tvm-initialization.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/tvm-initialization.md
================================================
# TVM 初始化

:::info
To maximize your comprehension of this page, familiarizing yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc) is highly recommended.

- [TVM Retracer](https://retracer.ton.org/)
  :::

TVM 在普通和/或其他事务的计算阶段被调用。

## 初始状态

在执行智能合约之前，TVM 的新实例会按如下方式初始化：

- 使用从智能合约的 `code` 部分创建的cell切片初始化原始 **cc**（当前continuation）。如果账户处于冻结或未初始化状态，必须在传入消息的 `init` 字段中提供代码。

- **cp**（当前 TVM codepage）设置为默认值，即 0。如果智能合约想使用另一个 TVM codepage *x*，则必须在其代码的第一条指令中使用 `SETCODEPAGE` *x* 切换到该codepage。

- 按照 Credit Phase 的结果初始化 **gas** 值（*gas 限制*）。

- 计算 **libraries**（*库 context*）。[下文描述](#library-context)。

- **stack** 初始化过程取决于引发交易的事件，其内容在[下文描述](#stack)。

- 控制寄存器 **c0**（返回 continuation）由参数为 0 的特殊 continuation `ec_quit` 初始化。 执行该 continuation 后，TVM 终止，退出代码为 0。

- 控制寄存器 **c1**（备用返回 continuation ）由带有参数 1 的特殊 continuation  `ec_quit` 初始化。当调用时，它导致 TVM 以 exit code  1 终止。请注意， exit code  0 和 1 都被视为 TVM 的成功终止。

- 控制寄存器 **c2**（异常处理程序）由特殊 continuation  `ec_quit_exc` 初始化。调用时，它从栈顶获取整数（等于异常编号）并以等于该整数的 exit code 终止 TVM。这样， 默认情况下，所有异常都以等于异常编号的 exit code 终止智能合约执行。

- 控制寄存器 **c3**（代码字典）由类似于上述 **cc**（当前 continuation ）的智能合约代码的cell初始化。

- 控制寄存器 **c4**（持久数据的根）由智能合约的持久数据初始化，存储在其 `data` 部分中。如果账户处于冻结或未初始化状态，必须在传入消息的 `init` 字段中提供数据。请注意，智能合约的持久数据不需要在其全部加载，而是加载根，当引用从根仅在访问时加载时，TVM 可能加载其他cell，从而提供一种虚拟内存形式。

- 控制寄存器 **c5**（动作的根）由空cell初始化。TVM 的“输出动作”原语，如 `SENDMSG`，在此寄存器中累积 *输出动作*（例如，出站消息），以在智能合约成功终止后执行。其序列化的 TL-B 方案如下[下文描述](#control-register-c5)。

- 控制寄存器 **c7**（临时数据的根）初始化为元组，其结构如下  [下文描述](#control-register-c7)。

## 库 context

智能合约的 *库 context*（库环境）是将 256 位cell（表示）哈希映射到相应cell本身的哈希映射。在执行智能合约期间访问外部cell引用时，会在库环境中查找所引用的cell，并通过找到的cell透明地替换外部cell引用。

调用智能合约的库环境计算如下：

1. 取当前主链状态的当前工作链的全局库环境。
2. 然后，它由智能合约的本地库环境增强，存储在智能合约状态的 `library` 字段中。仅考虑 256 位密钥等于相应值cell的哈希。如果密钥同时存在于全局和本地库环境中，则本地环境在合并中占优势。
3. 最后，由传入消息的 `init` 字段（如果有）的 `library` 字段增强。请注意，如果账户处于冻结或未初始化状态，则消息的 `library` 字段将覆盖先前步骤中的本地库环境。消息库的优先级低于本地和全局库环境。

为 TVM 创建共享库的最常见方式是在主链中发布对库的根cell的引用。

## 堆栈

TVM 栈的初始化在 TVM 的初始状态形成之后进行，具体取决于引发交易的事件：

- 内部消息
- 外部消息
- tick-tock
- 拆分准备
- 合并安装

推送到堆栈的最后一项总是 *function selector*（函数选择器），它是一个 *Integer*（整数），用于标识引起事务的事件。

### 内部消息

在内部消息的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将智能合约的余额 *b*（将入站消息的值记入后的余额）作为 nanotons 的 *Integer* 金额传递。
- 将入站消息 *m* 的余额 *b*<sub>m</sub> 作为 nanotons 的 *Integer* 金额传递。
- 将入站消息 *m* 作为包含类型 *Message X* 的序列化值的cell传递，其中 *X* 是消息体的类型。
- 将入站消息的主体 *m*<sub>b</sub>，等于字段主体 *m* 的值，并作为cell slice传递。
- 函数选择器 *s*，通常等于 0。

之后，智能合约的代码，即其初始值 **c3**，将被执行。根据 *s*，它选择正确的函数来处理函数的其余参数，然后终止。

### 外部消息

入站外部消息的处理类似于[上述内部消息](#internal-message)，但有以下修改：

- 函数选择器 *s* 设置为 -1。
- 入站消息的余额 *b*<sub>m</sub> 总是为 0。
- 初始的当前 gas 限制 *g*<sub>l</sub> 总是为 0。但是，初始 gas 信用 *g*<sub>c</sub> > 0。

智能合约必须以 *g*<sub>c</sub> = 0 或 *g*<sub>r</sub> ≥ *g*<sub>c</sub> 终止；否则，交易及其中包含的块将无效。建议块候选人的验证者或 collator 绝不能包含处理无效的外部传入消息的交易。

### Tick 和 Tock

在 tick 和 tock 交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将当前账户的余额 *b* 作为 nanotons 的 *Integer* 金额传递。
- 将当前账户在主链内的 256 位地址作为无符号 *Integer* 传递。
- 对于 Tick 交易，传递的整数等于 0；对于 Tock 交易，传递的整数等于 -1。
- 函数选择器 *s*，等于 -2。

### 拆分准备

在拆分准备交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将当前账户的余额 *b* 作为 nanotons 的 *Integer* 金额传递。
- 包含 *SplitMergeInfo* 的 *Slice*。
- 当前账户的 256 位地址。
- 兄弟账户的 256 位地址。
- 0 ≤ *d* ≤ 63 的整数，表示当前账户和兄弟账户地址不同的唯一位的位置。
- 函数选择器 *s*，等于 -3。

### 合并安装

在合并安装交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 当前账户的余额 *b*（已与兄弟账户的 nanotons 余额合并）作为 nanotons 的 *Integer* 金额传递。
- 从入站消息 *m* 中获取的兄弟账户的余额 *b'* 作为 nanotons 的 *Integer* 金额传递。
- 由合并准备交易自动生成的兄弟账户的消息 *m*。其 `init` 字段包含兄弟账户的最终状态。将消息作为包含类型 *Message X* 的序列化值的cell传递，其中 *X* 是消息体的类型。
- 由兄弟账户表示的状态，由 *StateInit* 表示。
- 包含 *SplitMergeInfo* 的 *Slice*。
- 当前账户的 256 位地址。
- 兄弟账户的 256 位地址。
- 0 ≤ *d* ≤ 63 的整数，等于当前账户和同级账户地址唯一不同位的位置。
- 函数选择器 *s*，等于 -4。

## 控制寄存器 c5

智能合约的 *输出动作* 被累积在存储在控制寄存器  **c5** 中的cell中：cell本身包含列表中的最后一个动作和对先前动作的引用，从而形成一个链接列表。

该列表也可以序列化为类型 *OutList n* 的值，其中 *n* 是列表的长度：

```tlb
out_list_empty$_ = OutList 0;

out_list$_ {n:#}
  prev:^(OutList n)
  action:OutAction
  = OutList (n + 1);

out_list_node$_
  prev:^Cell
  action:OutAction = OutListNode;
```

可能动作的列表包括：

- `action_send_msg` — 用于发送出站消息
- `action_set_code` — 用于设置操作码
- `action_reserve_currency` — 用于存储代币集合
- `action_change_library` — 用于更改库

如下所述，可以从这些操作中得到的 TL-B 方案：

```tlb
action_send_msg#0ec3c86d
  mode:(## 8) 
  out_msg:^(MessageRelaxed Any) = OutAction;
  
action_set_code#ad4de08e
  new_code:^Cell = OutAction;
  
action_reserve_currency#36e6b809
  mode:(## 8)
  currency:CurrencyCollection = OutAction;

libref_hash$0
  lib_hash:bits256 = LibRef;
libref_ref$1
  library:^Cell = LibRef;
action_change_library#26fa1dd4
  mode:(## 7) { mode <= 2 }
  libref:LibRef = OutAction;
```

## 控制寄存器 c7

控制寄存器 **c7** 包含临时数据的根，其形式为元组，由包含一些基本区块链 context 数据的 *SmartContractInfo* 类型组成，例如时间、全局配置等。以下是其 TL-B 方案的描述：

```tlb
smc_info#076ef1ea
  actions:uint16 msgs_sent:uint16
  unixtime:uint32 block_lt:uint64 trans_lt:uint64 
  rand_seed:bits256 balance_remaining:CurrencyCollection
  myself:MsgAddressInt global_config:(Maybe Cell) = SmartContractInfo;
```

此元组的第一个组件是一个 *Integer* 值，始终等于 0x076ef1ea，然后是 9 个命名字段：

| 字段                  | 类型                                                                                  | 描述                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `actions`           | uint16                                                                              | 初始值为0，但每当由非 RAW 输出动作原语安装输出动作时递增一次                                                                                                       |
| `msgs_sent`         | uint16                                                                              | 发送的消息数量                                                                                                                                 |
| `unixtime`          | uint32                                                                              | Unix 时间戳（秒）                                                                                                                             |
| `block_lt`          | uint64                                                                              | 代表该账户上一个区块的 *逻辑时间*。[关于逻辑时间的更多信息](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time) |
| `trans_lt`          | uint64                                                                              | 代表该账户上次交易的逻辑时间                                                                                                                          |
| `rand_seed`c        | bits256                                                                             | 从块的 `rand_seed`、账户地址、正在处理的传入消息的哈希（如果有的话）和交易逻辑时间 `trans_lt` 开始确定性地初始化                                                                    |
| `balance_remaining` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 智能合约余额                                                                                                                                  |
| `myself`            | [MsgAddressInt](/v3/documentation/data-formats/tlb/msg-tlb#msgaddressint-tl-b)      | 该智能合约的地址                                                                                                                                |
| `global_config`     | (Maybe Cell)                                                     | 包含有关全局配置的信息                                                                                                                             |

请注意，在即将到来的 TVM 升级中，**c7** 元组已从 10 个元素扩展到 14 个元素。请点击 [此处](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07) 阅读更多相关信息。

## 另见

- 白皮书中 [TVM 初始化](https://docs.ton.org/tblkch.pdf#page=89\&zoom=100) 的原始描述



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/tvm-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/tvm/tvm-overview.mdx
================================================
import Button from '@site/src/components/button'

# TVM 概览

本文提供了TVM如何执行交易的概览。

本文档提供 TVM 如何执行事务的鸟瞰图。

:::tip

- TVM 源 - [**TVM C++ 实现**](https://github.com/ton-blockchain/ton/tree/master/crypto/vm)
- [TVM Retracer](https://retracer.ton.org/)
  :::

## TON 课程：TVM

:::tip
在开始课程之前，请确保您已充分了解区块链技术的基础知识。如果您的知识有缺口，我们建议您参加[区块链基础知识与 TON](https://stepik.org/course/201294/promo)（[RU 版本](https://stepik.org/course/202221/), [CHN 版本](https://stepik.org/course/200976/)）课程。
:::

[TON Blockchain 课程](https://stepik.org/course/176754/)是TON Blockchain 开发的综合指南。

模块 2 完全涵盖 **TVM**、事务、可扩展性和业务案例。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

检查 TON 区块链课程

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

中文

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

以及四种不同的cell类型：

</Button>

## 控制寄存器

当某个 TON 链上的账户发生某些事件时，就会引起**交易**。最常见的事件是 "某些信息的到达"，但一般来说也可能有 "滴答"、"合并"、"拆分 "和其他事件。

每个交易最多由 5 个阶段组成：

1. **Storage phase** - in this phase, storage fees accumulated by the contract due to the occupation of some space in the chain state are calculated. Read more in [Storage Fees](/develop/smart-contracts/fees#storage-fee).
2. **Credit phase** - 在这一阶段，将计算与（可能的）接收信息值有关的合约余额和收取的存储费。
3. **Compute phase** - 在此阶段，TVM 正在执行合约（见下文），合约执行的结果是`exit_code`、`actions`（序列化的操作列表）、`gas_details`、`new_storage`和一些其他信息的集合。
4. **Action phase** - 如果计算阶段成功，则在此阶段处理计算阶段的 "行动"。具体而言，行动可能包括发送消息、更新智能合约代码、更新库等。请注意，某些操作在处理过程中可能会失败（例如，如果我们尝试发送的消息的 TON 超过合约所拥有的 TON），在这种情况下，整个交易可能会回退或跳过该操作（这取决于操作的模式，换句话说，合约可能会发送 "发送或回退 "或 "尝试发送-如果不忽略 "类型的消息）。
5. **Bounce phase** - 如果计算阶段失败（返回 `exit_code >=2`），在此阶段，将为由传入报文启动的事务生成_反弹报文_。

## Compute phase

在此阶段，执行 TVM。

:::tip

- TVM 4.3.5 - [**TON 区块链论文**](https://docs.ton.org/assets/files/tblkch-6aaf006b94ee2843a982ebf21d7c1247.pdf)
  :::

### 计算阶段跳过

计算阶段包括用正确的输入调用 TVM。在某些情况下，TVM 根本无法调用（例如，账户不存在、未初始化或冻结，正在处理的入站报文没有代码或数据字段，或者这些字段的哈希值不正确）。

相应的 [构造函数](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/block.tlb#L314) 反映了这一点：

- `cskip_no_state$00` - 帐户（不存在、未初始化或冻结）和报文中的[无状态](https://testnet.tonviewer.com/transaction/7e78394d082882375a5d21affa6397dec60fc5a3ecbea87f401b0e460fb5c80c)（即智能合约代码和数据）。

- `cskip_bad_state$01` - 信息中传递的无效状态（即状态的哈希值与预期值不同）到冻结或未初始化的帐户。

- `cskip_no_gas$10` - [没有资金](https://testnet.tonviewer.com/transaction/a1612cde7fd66139a7d04b30f38db192bdb743a8b12054feba3c16061a4cb9a6) 购买 gas 。(大约 < 0.00004 TON by [08.2024](https://testnet.tonviewer.com/transaction/9789306d7b29318c90477aa3df6599ee4a897031162ad41a24decb87db65402b))

### TVM 状态

在任何给定时刻，TVM 的状态完全由 6 种属性决定：

- 堆栈（见下文）
- Control registers --（见下文）简单地说，这意味着在执行过程中最多可直接设置和读取 16 个变量
- Current continuation - 描述当前执行的指令序列的对象
- Current codepage - 简单地说，就是当前运行的 TVM 版本
- Gas limits - 一组 4 个整数值；当前 gas 限值 g<sub>l</sub>、最大 gas 限值 g<sub>m</sub>、剩余 gas 限值 g<sub>r</sub>和 gas credit g<sub>c</sub>
- Library context - 可以由 TVM 调用的库的哈希映射

### TVM 的初始化

所有其他寄存器值都将被忽略。

- Integer(整数) - 有符号的 257 位整数
- Tuple(元组) - 由最多 255 个元素组成的有序集合，具有任意值类型，可能是不同的。
- Null(空)

还有四种截然不同的 cell ：

- [TVM 指令](/learn/tvm-instructions/instructions)
- [TON TVM](https://ton.org/tvm.pdf) TVM 概念（可能包含过时的信息）
- Builder(构建器) - 一种特殊的对象，允许您创建新的cell
- Continuation - 一种特殊对象，可将Cell用作 TVM 指令源

### 控制寄存器

- `c0` — 包含下一个 continuation 或返回 continuation（类似于常规设计中的子例程返回地址）。此值必须是一个 Continuation。
- `c1` — 包含备用（返回） continuation ；此值必须是一个 Continuation。
- `c2` — 包含异常处理程序。该值是一个 Continuation，每当异常触发时就会调用。
- `c3` — 支持寄存器，包含当前字典，本质上是一个包含程序中使用的所有函数的代码的哈希映射。此值必须是一个 Continuation。
- `c4` — 包含持久数据的根，或简单地说，合约的 `data` 部分。此值是一个 Cell。
- `c5` — 包含输出操作。该值是一个 cell 。
- `c7` — 包含临时数据的根。它是一个 Tuple。

### TVM 的初始化

所有其他寄存器值都将被忽略。

Detailed description of the initialization process can be found here: [TVM Initialization](/learn/tvm-instructions/tvm-initialization.md)

## 参见

The list of TVM instructions can be found here: [TVM instructions](/learn/tvm-instructions/instructions).

### TVM 执行结果

除了退出代码和消耗的 gas 数据外，TVM 还间接输出以下数据：

- c4 寄存器 - 将作为智能合约的新 `data` 存储的cell（如果执行不会在此阶段或以后的阶段回滚）
- c5 寄存器 - （输出动作列表）列表中最后一个动作和对先前动作的引用的cell（递归）

所有其他寄存器的值都将被忽略。

请注意，由于最大 cell 深度有限制 `<1024`，特别是 c4 和 c5 深度有限制 `<=512`，因此一个 tx 中的输出操作数量也有限制 `<=255`。如果一个合约需要发送的信息超过了这个数量，它可以向自己发送一条带有 `continue_sending` 请求的信息，并在随后的事务中发送所有必要的信息。

## 参阅

- [TVM Instructions](/learn/tvm-instructions/instructions)
- [TON TVM](https://ton.org/tvm.pdf) TVM 概念（可能包含过期信息）



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/whitepapers/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/whitepapers/overview.md
================================================
# 白皮书

本节介绍了由尼古拉伊·杜罗夫博士编写的原始文档，全面描述了TON的所有部分。

## 原始文档

:::info
请注意，此处及以后的代码、注释和/或文档可能包含“gram”，“nanogram”，等的参数、方法和定义，这是Telegram公司开发的原始TON代码的遗留。Gram加密货币从未发行。TON的货币是Toncoin，TON测试网络的货币是Test Toncoin。
:::

- [TON 白皮书](https://docs.ton.org/ton.pdf)

  TON白皮书 - 对TON（The Open Network）区块链的概括性描述。

- [TON虚拟机](https://docs.ton.org/tvm.pdf)

  关于TON虚拟机的描述（可能包含关于OP代码的过时信息，实际在[TVM指令](https://docs.ton.org/learn/tvm-instructions/tvm-overview)这一部分）。

- [TON区块链](https://docs.ton.org/tblkch.pdf)

  关于Telegram开放网络区块链描述（可能包含过时信息）。

- [Catchain共识协议](https://docs.ton.org/catchain.pdf)

  描述了TON区块链在创建新区块时采用的拜占庭容错（BFT）共识协议。

- [Fift文档](https://docs.ton.org/fiftbase.pdf)

  关于Fift语言的描述以及在TON中如何使用它的说明。

## 翻译

- **\[RU]** [korolyow/ton_docs_ru](https://github.com/Korolyow/TON_docs_ru) — 俄文版TON白皮书。 (*此版本由社区制作，TON基金会无法保证翻译质量*)
- **\[繁体中文]** [awesome-doge/the-open-network-whitepaper](https://github.com/awesome-doge/TON_Paper/blob/main/zh_ton.pdf) — 繁体中文版TON白皮书。 (*由社区制作，TON基金会无法保证翻译质量*)
- **\[简体中文]** [kojhliang/Ton_White_Paper_SC](https://github.com/kojhliang/Ton_White_Paper_SC/blob/main/Ton%E5%8C%BA%E5%9D%97%E9%93%BE%E7%99%BD%E7%9A%AE%E4%B9%A6_%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E7%89%88.pdf) — 简体中文版TON白皮书。 (*由社区制作，TON基金会无法保证翻译质量*)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/README.mdx
================================================
import Button from '@site/src/components/button'

# 入门指南

在深入研究DApps之前，请确保您理解底层的区块链原理。我们的[The Open Network](/learn/introduction)和[Blockchain of Blockchains](/learn/overviews/ton-blockchain)文章可能会对您有所帮助。

与单纯的[智能合约](/develop/smart-contracts/)开发相比，DApps开发更为复杂。您需要了解[如何使用APIs](/develop/dapps/apis/)，如何使用[TON Connect](/develop/dapps/ton-connect/overview)进行用户认证，以及如何使用[SDKs](/develop/dapps/apis/sdk)与区块链交互。

DApp 通常可以用任何具有 TON SDK 的编程语言编写。实际上，最常见的选择是网站，其次是 Telegram 小应用程序。

<Button href="/develop/dapps/telegram-apps/" colorType={'primary'} sizeType={'sm'}>

构建一个TMA

</Button>

<Button href="/develop/dapps/apis/sdk" colorType="secondary" sizeType={'sm'}>

选择 SDK

</Button>

## TON 课程：DApps

[TON Blockchain 课程](https://stepik.org/course/201638/)是TON Blockchain 开发的综合指南。

模块 5 和 6 完全涵盖 DApps 开发。您将学习如何创建 DApp、如何使用 TON Connect、如何使用 SDK 以及如何使用区块链。


<Button href="https://stepik.org/course/201638/promo"
        colorType={'primary'} sizeType={'sm'}>

查看 TON 区块链课程

</Button>


<Button href="https://stepik.org/course/176754/promo"
        colorType={'secondary'} sizeType={'sm'}>

EN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>


## 基本工具和资源

以下是您在 DApp 开发过程中需要的一些关键资源：

1. [开发者钱包](/participate/wallets/apps)
2. [区块链浏览器](/participate/explorers)
3. [API 文档](/develop/dapps/apis/)
4. [各种语言的 SDK](/develop/dapps/apis/sdk)
5. [使用测试网](/develop/smart-contracts/environment/testnet)
6. [TON解冻器](https://unfreezer.ton.org/)

### 资产管理

使用资产？这些指南涵盖了基本要素：

- [支付处理](/develop/dapps/asset-processing/)
- [代币（Jetton）处理](/develop/dapps/asset-processing/jettons)
- [处理NFTs](/develop/dapps/asset-processing/nft)
- [解析元数据](/develop/dapps/asset-processing/metadata)

### DeFi 入门

对去中心化金融（DeFi）感兴趣？下面介绍如何处理不同类型的资产：

- [理解Toncoin](/develop/dapps/defi/coins)
- [代币：Jettons 和 NFT](/develop/dapps/defi/tokens)
- [TON 支付](/develop/dapps/defi/ton-payments)
- [设置订阅](/develop/dapps/defi/subscriptions)

## 教程 & 案例

### DeFi 基础知识

- 创建您的第一个代币：[铸造您的第一个Jetton](/develop/dapps/tutorials/jetton-minter)
- 逐步操作：[NFT系列铸造](/develop/dapps/tutorials/collection-minting)

### JavaScript

#### JavaScript

- [付款流程](https://github.com/toncenter/examples)
- [TON Bridge](https://github.com/ton-blockchain/bridge)
- [网络钱包](https://github.com/toncenter/ton-wallet)
- [饺子销售机器人](/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-js)

#### Python

- [项目示例](https://github.com/psylopunk/pytonlib/tree/main/examples)
- [商店前端机器人](/develop/dapps/tutorials/accept-payments-in-a-telegram-bot)

#### GO

- [示例](https://github.com/xssnick/tonutils-go/tree/master/example)

### 高级主题

- [零知识证明](/develop/dapps/tutorials/simple-zk-on-ton)

### 钱包实例

- [桌面标准钱包（C++ 和 Qt）](https://github.com/ton-blockchain/wallet-desktop)
- [Android标准钱包（Java）](https://github.com/ton-blockchain/wallet-android)
- [iOS标准钱包（Swift）](https://github.com/ton-blockchain/wallet-ios)
- [TonLib CLI（C++）](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/tonlib-cli.cpp)

## 👨‍💻 贡献

缺少某些关键材料？您可以自己编写教程，或者为社区描述问题。

<Button href="/contribute/participate" colorType="primary" sizeType={'sm'}>

贡献

</Button>

<Button href="https://github.com/ton-community/ton-docs/issues/new?assignees=&labels=feature+%3Asparkles%3A%2Ccontent+%3Afountain_pen%3A&template=suggest_tutorial.yaml&title=Suggest+a+tutorial" colorType={'secondary'} sizeType={'sm'}>

提出一个教程

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/api-keys.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/api-keys.mdx
================================================
# Api keys

## 概述

使用 TON HTTP API时，通常不需要一个 `token` (`key`)，但它解锁了请求限制。 有几个可用的计划，都可以在 Toncentry mini 应用程序中查看

## 如何获取 Key

若要获取 key，请访问 [@tonapibot](https://t.me/tonapibot), 按下 "start" 按钮，并按照说明操作。

![Telegram Bot](/img/registration-process/telegram-bot.png)

按 `Manage API Keys` 或 `Toncenter` 按钮打开 Telegram 小程序。

![Toncenter Main Mini App](/img/registration-process/toncenter-main-miniapp.png)

按下 `Create API Key`.

![Create API Key](/img/registration-process/create-api-key.png)

填写必填字段，然后按 `Create`。就这样！现在就可以使用该 key 发送请求了。

## 如何更新订阅计划

要更新订阅计划，请按照以下步骤操作：

- 单击应用程序顶部的 `MANAGE`（管理）按钮，打开一个包含计划的窗口。
- 选择所需的计划，然后单击 `Purchase Subscription`。
- 将所需的 TON 数发送到建议的地址。

## 故障排除

如果您的 Telegram 应用程序已过期，小程序可能无法正常工作。请尝试更新 Telegram 应用程序。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/api-types.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/api-types.md
================================================
# API 类型

**高可用性区块链API是在TON上安全、便捷、快速开发有效应用程序的核心元素。**

- [TON HTTP API](/develop/dapps/apis/toncenter) — 允许处理_索引化区块链信息_的API。
- [TON ADNL API](/develop/dapps/apis/adnl) — 基于ADNL协议的与TON通信的安全API。

## Toncenter APIs

- [TON Index](https://toncenter.com/api/v3/) - TON Index从全节点收集数据到PostgreSQL数据库，并提供方便的API来访问索引化的区块链。
- [toncenter/v2](https://toncenter.com/) - 此API通过HTTP访问TON区块链 - 获取账户和钱包信息，查询区块和交易，向区块链发送消息，调用智能合约的get方法等。

## 第三方 APIs

- [tonapi.io](https://docs.tonconsole.com/tonapi/api-v2) - 快速索引API，提供关于账户、交易、区块的基本数据，以及NFT、拍卖、Jettons、TON DNS、订阅等应用特定数据。它还提供交易链的注释数据。
- [dton.io](https://dton.io/graphql/) - GraphQL API，可以提供关于账户、交易和区块的数据，以及关于NFT、拍卖、Jettons和TON DNS的应用特定数据。
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) - 另一个专注于通过CDN的积极缓存以提高速度的轻量级API。
- [docs.nftscan.com](https://docs.nftscan.com/reference/ton/model/asset-model) - TON区块链的NFT API。
- [evercloud.dev](https://ton-mainnet.evercloud.dev/graphql) - 用于TON的基本查询的GraphQL API。
- [everspace.center](https://everspace.center/toncoin) - 用于访问TON区块链的简单RPC API。

## 其他 API

### Toncoin 汇率 API

- https://tonapi.io/v2/rates?tokens=ton&currencies=ton%2Cusd%2Crub
- https://coinmarketcap.com/api/documentation/v1/
- https://apiguide.coingecko.com/getting-started

### 地址转换 APIs

:::info
最好通过本地算法转换地址，更多信息请阅读文档中的[地址](/learn/overviews/addresses)部分。
:::

#### 从友好形式到原始形式

/api/v2/unpackAddress

Curl

```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/unpackAddress?address=EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB' \
-H 'accept: application/json'
```

响应正文

```curl
{
"ok": true,
"result": "0:29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563"
}
```

#### 从友好形式到原始形式

/api/v2/packAddress

Curl

```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/packAddress?address=0%3A29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563' \
-H 'accept: application/json'
```

响应正文

```json
{
  "ok": true,
  "result": "EQApAj3rEnJJSxEjEHVKrH3QZgto/MQMOmk8l72azaXlY1zB"
}
```

## 参阅

- [TON HTTP API](/develop/dapps/apis/toncenter)
- [SDK列表](/develop/dapps/apis/sdk)
- [TON 开发手册](/develop/dapps/cookbook)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/getblock-ton-api.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/getblock-ton-api.md
================================================
# GetBlock 的 TON API

本指南将介绍获取和使用 GetBlock 私有 RPC 端点访问 TON 区块链的基本步骤。

:::info
[GetBlock](https://getblock.io/)是一家 Web3 基础设施提供商，为客户与包括 TON 在内的各种区块链网络交互提供基于 HTTP 的 API 端点。
:::

## 如何访问 TON 区块链终端

要开始使用 GetBlock 端点，用户需要登录自己的账户，获取一个 TON 端点 URL，然后就可以开始使用了。更多详细指导，敬请关注。

### 1.创建 GetBlock 账户

访问 [GetBlock 网站](https://getblock.io/?utm_source=external\&utm_medium=article\&utm_campaign=ton_docs)，找到主页上的 "免费开始 "按钮。使用电子邮件地址或连接 MetaMask 钱包注册账户。

![GetBlock.io\_main\_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2.选择 TON 区块链

登录后，您将被重定向到仪表板。找到 "My Endpoints" 部分，在 "Protocols" 下拉菜单中选择 "TON"。

选择所需的网络和 API 类型（JSON-RPC 或 JSON-RPC(v2)）。

![GetBlock\_account\_\_dashboard](/img/docs/getblock-img/unnamed-4.png)

### 3. 生成您的端点URL

点击 “Get” 按钮生成 TON 区块链端点 URL。

GetBlock API 中的所有端点都遵循一致的结构：`https://go.getblock.io/[ACCESS TOKEN]/`。

这些访问令牌可作为每个用户或应用程序的唯一标识符，并包含将请求路由到适当端点所需的信息，而不会泄露敏感细节。它基本上取代了对单独授权头或 API 密钥的需求。

用户可以灵活地生成多个端点、在令牌受损时滚动令牌或删除未使用的端点。

![GetBlock\_account\_endpoints](/img/docs/getblock-img/unnamed-3.png)

现在，您可以使用这些 URL 与 TON 区块链进行交互、查询数据、发送交易以及构建去中心化应用程序，而无需进行繁琐的基础设施设置和维护。

### 免费申请和用户限制

请注意，每个 GetBlock 注册用户都会收到 40,000 个免费请求，上限为 60 RPS（每秒请求数）。请求余额每日更新，可在受支持区块链的任何共享端点上使用。

如需增强功能和性能，用户可以选择付费选项，下文将对此进行概述。

GetBlock.io 提供两种计划：共享节点和专用节点。客户可根据自己的要求和预算选择资费。

### 共享节点

- 多个客户同时使用同一节点的初级机会；
- 速率限制增至 200 RPS；
- 非常适合个人使用，或与全面扩展的生产应用相比，交易量和资源需求较低的应用；
- 对于预算有限的个人开发者或小型团队来说，这是一个更经济实惠的选择。

共享节点为访问 TON 区块链基础设施提供了一个具有成本效益的解决方案，无需大量的前期投资或承诺。

当开发人员扩展其应用程序并需要更多资源时，他们可以轻松升级订阅计划，或在必要时过渡到专用节点。

### 专用节点

- 一个节点专门分配给一个客户；
  没有请求限制；
- 打开对存档节点、各种服务器位置和自定义设置的访问；
- 保证为客户提供优质服务和支持。

这是针对开发人员和去中心化应用程序（dApp）的下一代解决方案，这些应用程序需要增强吞吐量、提高节点连接速度，并在扩展时保证资源。

## 如何使用 GetBlock 的 TON HTTP API

在本节中，我们将深入探讨 GetBlock 提供的 TON HTTP API 的实际用法。我们将通过实例来展示如何有效利用生成的端点进行区块链交互。

### 常见应用程序接口调用示例

让我们从一个简单的例子开始，使用 ‘/getAddressBalance’ 方法，使用 curl 命令检索特定地址的余额。

```
curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \

--header 'Content-Type: application/json'
```

确保将 `ACCESS-TOKEN` 替换为 GetBlock 提供的实际访问令牌。

这将以 nanotons 为单位输出余额。

![getAddressBalance\_response\_on\_TON\_blockchain](/img/docs/getblock-img/unnamed-2.png)

查询 TON 区块链的其他一些可用方法：

| # | 方法   | Endpoint           | 说明                                 |
| - | ---- | ------------------ | ---------------------------------- |
| 1 | GET  | getAddressState    | 返回 TON 区块链上指定地址的当前状态（未初始化、激活或冻结）。  |
| 2 | GET  | getMasterchainInfo | 获取有关主链状态的信息                        |
| 3 | GET  | getTokenData       | 检索与指定 TON 帐户相关的 NFT 或 Jetton 的详细信息 |
| 4 | GET  | packAddress        | 将 TON 地址从原始格式转换为人类可读格式             |
| 5 | POST | sendBoc            | 将序列化的 BOC 文件和外部信息一起发送到区块链以供执行      |

请参阅 GetBlock 的 [文档](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/)，以获取包含示例和附加方法列表的全面 API 参考。

### 部署智能合约

开发人员可以利用相同的端点 URL，使用 TON 库将合约无缝部署到 TON 区块链上。

该库将初始化一个客户端，通过 GetBlock HTTP API 端点连接到网络。

![Image from TON Blueprint IDE](/img/docs/getblock-img/unnamed-6.png)

本教程将为希望有效利用 GetBlock API 和 TON 区块链的开发人员提供全面指导。

欢迎通过 [网站](https://getblock.io/?utm_source=external\&utm_medium=article\&utm_campaign=ton_docs) 了解更多信息，或通过即时聊天、[Telegram](https://t.me/GetBlock_Support_Bot)或网站表格向 GetBlock 支持人员留言。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/overview.md
================================================
# 概览

本文旨在帮助您在 TON 生态系统中选择合适的应用程序开发工具。

## TMA 开发

- 使用 [Mini Apps SDKs](/v3/guidelines/dapps/tma/overview#mini-apps-sdks) 进行 [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview) 开发。
- 选择 [基于 JS/TS 的 SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript) 与 TON 区块链进行交互。

## DApps 开发

- 如果需要，使用 Tolk、FunC 或 Tact [编程语言](/v3/documentation/smart-contracts/overview#programming-languages) 为您的 [DApp](/v3/guidelines/dapps/overview) 开发 TON 区块链智能合约。
- 要与 TON 区块链交互并处理其数据，请选择列出的 [SDK](/v3/guidelines/dapps/apis-sdks/sdk)。为此目的，最常用的语言之一是
  - [JS/TS](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)
  - [Go](/v3/guidelines/dapps/apis-sdks/sdk#go)
  - [Python](/v3/guidelines/dapps/apis-sdks/sdk#python)
- 要将用户身份验证与其 TON 钱包（以及支付处理逻辑）整合到您的 DApp 中，请使用 [TON Connect](/v3/guidelines/ton-connect/overview) 。

## TON 统计分析仪

您可能需要与 TON 区块链进行快速交互，或收集和分析其数据。为此，运行自己的 [Ton Node](/v3/documentation/infra/nodes/node-types) 可能会有所帮助。

- [Liteserver 节点](/v3/guidelines/nodes/running-nodes/liteserver-node) - 仅用于与区块链交互。
- [存档节点](/v3/guidelines/nodes/running-nodes/archive-node) - 收集区块链的扩展历史数据。

使用支持本地 [ADNL](/v3/documentation/network/protocols/adnl/adnl-tcp)的 SDK：

- [Go](https://github.com/xssnick/tonutils-go)
- [Python](https://github.com/yungwine/pytoniq)

## 另请参见

- [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
- [TMA教程](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
- [TON Connect 教程](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
- [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/sdk.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/sdk.mdx
================================================
# SDKs

通过右侧边栏即时导航首选语言。

## 概览

有不同的方式连接到区块链：

1. RPC 数据提供程序或其他应用程序接口：在大多数情况下，您必须\*依赖于其稳定性和安全性。
2. ADNL 连接：您正在连接一个 [liteserver](/participate/run-nodes/liteserver）。它们可能无法访问，但通过一定程度的验证（在库中实现），无法作恶。
3. Tonlib 二进制：您也在连接 liteserver，因此所有优点和缺点都适用，但您的应用程序还包含一个外部编译的动态加载库。
4. 仅链下。此类 SDK 可以创建 cell 并将其序列化，然后发送给 API。

### TypeScript / JavaScript

| 库                                               | 区块链连接                                                                                                                 | 说明                                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [ton](https://github.com/ton-org/ton)           | 通过 RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / 等)                    | 方便的客户端库，带有钱包包装器，用于在 TON 区块链上开发 dApp。                                                |
| [tonweb](https://github.com/toncenter/tonweb)   | 通过 RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / 等)                    | 旧式 TON JS SDK，外部依赖性极低，已在生产中进行过广泛测试。                                                 |
| [tonkite/adnl](https://github.com/tonkite/adnl) | [ADNL](/develop/network/adnl-tcp) 本地/通过 WebSocket                                                                     | ADNL TypeScript 实现。                                                                 |
| [tonutils](https://github.com/thekiba/tonutils) | 本地 [ADNL](/develop/network/adnl-tcp)                                                                                  | 基于 TypeScript 的界面，用于构建 TON 生态系统中的应用程序并与之交互。由于依赖于本地 ADNL，因此不能用于浏览器中的区块链交互。           |
| [foton](https://foton.sh/)                      | 通过 RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / 等)                    | 用于与 TON 钱包和整个区块链交互的 TypeScript 工具包。该库将现有的解决方案（Blueprint 和 TON Connect）封装成一个舒适的 API。 |

### Java

| 库                                          | 区块链连接      | 说明                                     |
| ------------------------------------------ | ---------- | -------------------------------------- |
| [ton4j](https://github.com/neodix42/ton4j) | Tonlib 二进制 | 开放网络 (TON) Java SDK                    |

### Pythonc

<!-- tonsdk dropped due to invalid cells serialization -->

| 库                                                             | 区块链连接                                                                                                                 | 说明                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [pytoniq](https://github.com/yungwine/pytoniq)                | 本地 ADNL                                                                                                               | 带有本地 LiteClient 和其他基于 ADNL 协议实现的 Python SDK。              |
| [pytoniq-core](https://github.com/yungwine/pytoniq-core)      | _仅链下_                                                                                                                 | Python 强大的免传输 SDK                                         |
| [pytonlib](https://github.com/toncenter/pytonlib)             | Tonlib 二进制                                                                                                            | 这是一个基于 libtonlibjson 的独立 Python 库，是 TON monorepo 的二进制依赖库。 |
| [mytonlib](https://github.com/igroman787/mytonlib)            | 本地 ADNL                                                                                                               | 用于使用开放网络的本地 Python SDK 库                                  |
| [TonTools](https://github.com/yungwine/TonTools)              | 通过 RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / 等)                    | TonTools 是 Python 的高级 OOP 库，可用于与 TON 区块链交互。               |
| [tonpy](https://github.com/disintar/tonpy)                    | 本地 ADNL                                                                                                               | Python 软件包提供与 TON 区块链交互的数据结构和应用程序接口。                      |
| [tvm_valuetypes](https://github.com/toncenter/tvm_valuetypes) | _仅链下_                                                                                                                 | 库是处理 TVM 类型的工具集合。                                         |
| [pytvm](https://github.com/yungwine/pytvm)                    | _链下_                                                                                                                  | 使用与 C++ 标准模拟器绑定的 Python TVM 模拟器                           |
| [pytvm](https://github.com/yungwine/pytvm)                    | _offchain_                                                                                                            | 使用与 C++ 标准模拟器绑定的 Python TVM 模拟器                           |

### C#

| 库                                                                 | 区块链连接         | 说明                                                            |
| ----------------------------------------------------------------- | ------------- | ------------------------------------------------------------- |
| [TonSdk.NET](https://github.com/continuation-team/TonSdk.NET)     | 本地 ADNL 或 RPC | 开放网络的本地 C# SDK。                                               |
| [justdmitry/TonLib.NET](https://github.com/justdmitry/TonLib.NET) | Tonlib 二进制    | 开放网络的 .NET SDK，通过 libtonlibjson 作为 TON monorepo 的二进制依赖关系进行连接。 |

### Rust

| 库                                                             | 区块链连接      | 说明                                                           |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| [tonlib-rs](https://github.com/ston-fi/tonlib-rs)             | Tonlib 二进制 | 开放网络的 Rust SDK，带来 TON monorepo 的二进制依赖性。                      |
| [getgems-io/ton-grpc](https://github.com/getgems-io/ton-grpc) | Tonlib 二进制 | tonlibjson 的 Rust 绑定（因此取决于 TON monorepo 中的二进制文件）以及在其基础上构建的服务 |

### Go

| 库                                                        | 区块链连接      | 说明                      |
| -------------------------------------------------------- | ---------- | ----------------------- |
| [tonutils-go](https://github.com/xssnick/tonutils-go)    | 本地 ADNL    | 用于与 TON 区块链交互的 Golang 库 |
| [tongo](https://github.com/tonkeeper/tongo)              | 本地 ADNL    | TON 区块链库的 Go 实现         |
| [tonlib-go](https://github.com/ton-blockchain/tonlib-go) | Tonlib 二进制 | libtonlibjson 的官方绑定     |

### 其他语言的 SDK

| 库                                                                           | 语言     | 区块链连接                                                                                              | 说明                                           |   |
| --------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------- | - |
| [ton-kotlin](https://github.com/ton-community/ton-kotlin)                   | Kotlin | 本地 ADNL                                                                                            | 开放网络的 Kotlin/多平台 SDK。                        |   |
| [tonlib-java](https://github.com/ton-blockchain/tonlib-java)                | Java   | Tonlib bin	                                                                                        | TonLib 的 JVM 封装器，可与 Java/Scala/Kotlin 等一起使用。 |   |
| [ayrat555/ton](https://github.com/ayrat555/ton)                             | Elixir | _仅链下_                                                                                              | 用于 Elixir 的 TON SDK                          |   |
| [C++ Tonlib](https://github.com/ton-blockchain/ton/tree/master/example/cpp) | C++    | Tonlib 二进制                                                                                         | TON monorepo 中智能合约交互的正式示例                    | . |
| [Java Tonlib](https://github.com/ton-blockchain/tonlib-java)                | Java   | Tonlib 二进制                                                                                         | TON monorepo 中智能合约交互的官方示例。                   |   |
| [labraburn/SwiftyTON](https://github.com/labraburn/SwiftyTON)               | Swift  | Tonlib 二进制                                                                                         | 使用 async/await 对 tonlib 进行本地 Swift 封装。       |   |
| [tonlib-xcframework](https://github.com/labraburn/tonlib-xcframework)       | Swift  | Tonlib 二进制                                                                                         | 适用于 iOS 所有架构的 Tonlib 构建助手。                   |   |
| [labraburn/node-tonlib](https://github.com/labraburn/node-tonlib)           | NodeJS | Tonlib 二进制                                                                                         | 用于 NodeJS 的 C++ 附加组件，可与 tonlibjson 协同工作。     |   |
| [olifanton/ton](https://github.com/olifanton/ton)                           | PHP    | 通过 RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / 等) | PHP SDK 包含一套标准基元和合约。                         |   |



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/ton-adnl-apis.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/ton-adnl-apis.md
================================================
# TON ADNL API

:::tip

有不同的方式连接到区块链：

1. RPC 数据提供商或另一个 API: 在大多数情况下，您必须依赖它的稳定性和安全性。
2. **ADNL连接**：您正在连接一个[liteserver](/participate/run-nodes/liteserver)。它们可能无法访问，但通过一定程度的验证（在库中实现），它们无法作恶。
3. Tonlib 二进制: 您也在连接到liteserver，因此所有的好处和不足都适用，但您的应用程序还包含了一个在外部编译的动态加载库。
4. 链下解决。这种SDK允许创建和序列化 cell ，然后您可以发送到 API。

:::

客户端使用二进制协议直接连接到 Liteservers（节点）。

客户端下载密钥块、帐户的当前状态以及他们的 **Merkle 证明**，保证收到数据的有效性。

读取操作 (如get-methods 调用) 是通过启动本地TVM 并下载和验证状态进行的。 值得注意的是，无需下载区块链的完整状态， 客户端只下载操作所需的内容。

您可以从全局配置（[Mainnet](https://ton.org/global-config.json) 或 [Testnet](https://ton.org/testnet-global.config.json) ）连接到公共 Liteservers，也可以运行自己的 [Liteserver](/participate/nodes/node-types) 并使用 [ADNL SDKs](/develop/dapps/apis/sdk#adnl-based-sdks) 进行处理。

阅读更多关于 [Merkle 证明](/develop/data-formuls/proofs)的信息[TON白皮书](https://ton.org/ton.pdf) 2.3.10, 2.3.11。

公共 liteservers（来自全局配置）的存在是为了让你快速开始使用 TON。它可用于学习 TON 编程，或用于不需要 100% 正常运行时间的应用程序和脚本。

建设生产基础设施――建议使用准备完善的基础设施：

- [设置自己的 liteserver](https://docs.ton.org/participate/run-nodes/fullnode#enable-liteserver-mode),
- 使用 Liteserver 高级提供商 [@liteserver_bot](https://t.me/liteserver_bot)

## 优缺点

- ✅ 可靠。使用带有Merkle证明哈希的API来验证传入的二进制数据。

- ✅ 安全。由于它检查Merkle证明，即使使用不受信任的轻节点也可以。

- ✅ 快速。直接连接到TON区块链节点，而不是使用HTTP中间件。

- ❌ 重复。需要更多时间才能找出问题。

- ❌ 后端优先。与 web 前端不兼容（为非 HTTP 协议构建），或需要 HTTP-ADNL 代理。

## API 参考

请求和对服务器的响应在 [TL](/develop/data-forms/tl) schema 中描述，它允许您为某个编程语言生成一个输入的接口。

[TonLib TL Schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/ton-http-apis.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/apis-sdks/ton-http-apis.md
================================================
# 基于 TON HTTP 的APIs

:::tip

有不同的方式连接到区块链：

1. **RPC 数据提供商或其他方 API**：在大多数情况下，您不得不*依赖*其稳定性和安全性。
2. ADNL 连接：您需要连接到一个 [轻服务器](/participate/run-nodes/liteserver)。它们可能有些难懂，但其中的内容经过了一定程度的验证 (已在库实现)，可以保证其真实性。
3. Tonlib 库: 同样是连接到轻服务器，因此所有优点和缺点都存在，此外您的应用程序还包含一个外部编译的动态加载库。
4. 仅链下。此类 SDK 可以创建cells并将其序列化，然后发送给 API。

:::

## 优点和缺点

- ✅ 习惯性且适合快速入门，这对于每个想要尝试TON的新手来说是完美的。

- ✅ 面向Web。非常适合与TON交易、智能合约进行Web交互。

- ❌ 简化。无法接收需要索引TON API的信息。

- ❌ HTTP中间件。您不能完全信任服务器响应，因为它们不包含_Merkle证明_来验证您的数据是真实的。

## RPC 节点

- [GetBlock节点](https://getblock.io/nodes/ton/) — 使用GetBlocks节点连接和测试您的dApps。
- [TON Access](https://www.orbs.com/ton-access/) - 开放网络(TON)的 HTTP API。

## Indexer

- [QuickNode](https://www.quicknode.com/chains/ton?utm_source=ton-docs) -- 领先的区块链节点提供商，通过智能 DNS 路由提供最快的访问速度，实现优化的全球覆盖和负载平衡的可扩展性。
- [Chainstack](https://chainstack.com/build-better-with-ton/) -- 多个地区的 RPC 节点和索引器，具有地理和负载平衡功能。
- [Tatum](https://docs.tatum.io/reference/rpc-ton) — 一个简单易用的平台访问 TON RPC 节点，上面拥有强大的开发者工具。
- [GetBlock节点](https://getblock.io/nodes/ton/) — 使用GetBlocks节点连接和测试您的dApps。
- [TON Access](https://www.orbs.com/ton-access/) - 开放网络(TON)的 HTTP API。
- [Toncenter](https://toncenter.com/api/v2/) - 由社区主办的关于API的快速启动项目(获得一个API密钥 [@tonapibot](https://t.me/tonapibot))。
- [ton-node-docker](https://github.com/fmira21/ton-node-docker) - 使用了Docker全节点和Toncenter API。
- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — 运行您自己的RPC节点。
- [nownodes.io](https://nownodes.io/nodes) — 通过API使用NOWNodes全节点和blockbook Explorers。
- [Chainbase](https://chainbase.com/chainNetwork/TON) — 为TON设计开发了对应的节点API和数据基础设施。

## Indexer

### Toncenter TON Index

索引器允许列出jetton钱包、NFT、某些过滤器的交易，而不仅仅是检索特定的交易。

- 使用公共TON Index: 用其进行开发和测试完全免费，[高级版](https://t.me/tonapibot)可用于生产环境 - [toncenter.com/api/v3/](https://toncenter.com/api/v3/)。
- 使用[Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba)和[TON Index API wrapper](https://github.com/toncenter/ton-indexer)运行您自己的TON Index。

### Anton

Anton 采用 Go 语言编写，是一款开源的开放网络区块链索引器，采用 Apache License 2.0 许可。Anton 旨在为开发人员访问和分析区块链数据提供可扩展的灵活解决方案。我们的目标是帮助开发者和用户了解区块链是如何被使用的，并让开发者可以在我们的索引器中添加他们自己的合约和自定义消息模式。

- [TonAPI](https://docs.tonconsole.com/tonapi/api-v2)--旨在为用户提供简化体验的应用程序接口，无需担心智能合约的低层级细节。
- [Swagger API 文档](https://github.com/tonindexer/anton)，[API 查询示例](https://github.com/tonindexer/anton/blob/main/docs/API.md) - 要使用，请学习文档和示例
- [Apache Superset](https://github.com/tonindexer/anton) - 用于查看数据

### GraphQL Nodes

GraphQL 节点也可充当索引器。

- [dton.io](https://dton.io/graphql) - 不仅为合约数据提供了一系列诸如"is jetton"、"is NFT"的标记参数，还可以模拟交易和对接收执行进行追踪。

## 其他APIs

- [TonAPI](https://docs.tonconsole.com/tonapi) -- 旨在为用户提供简化体验的应用程序接口，无需担心智能合约的低级细节。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/README.mdx
================================================
import Button from '@site/src/components/button'

# 支付处理

本页面包含了关于在TON区块链上处理（发送和接收）数字资产的概览和具体细节。

关于Toncoin处理的最佳实践和评论：

- [创建密钥对、钱包并获取钱包地址](https://github.com/toncenter/examples/blob/main/common.js)

- [JS代码接受Toncoin存款](https://github.com/toncenter/examples/blob/main/deposits.js)

- [JS代码从钱包中提取（发送）Toncoins](https://github.com/toncenter/examples/blob/main/withdrawals.js)

- [详细信息](https://docs.ton.org/develop/dapps/asset-processing#global-overview)

关于处理jettons的最佳实践：

- [JS代码接受jettons存款](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)

- [JS代码从钱包中提取（发送）jettons](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

- [详细信息](https://docs.ton.org/develop/dapps/asset-processing/jettons)

## 其他示例

### 自托管服务

#### 社区制作

[Gobicycle](https://github.com/gobicycle/bicycle) 服务专注于补充用户余额和向区块链账户发送支付。支持TONs和Jettons。该服务考虑了开发人员可能遇到的许多陷阱（所有jettons的检查、正确的操作状态检查、消息重发、区块链被分片时的高负载性能）。提供简单的HTTP API、rabbit和webhook通知新支付。

### JavaScript

#### 社区制作

使用TON社区支持的ton.js SDK：

- [创建钱包，获取余额，进行转账](https://github.com/ton-community/ton#usage)

### Python

#### 社区制作

使用psylopunk/pytonlib（The Open Network的简单Python客户端）：

- [发送交易](https://github.com/psylopunk/pytonlib/blob/main/examples/transactions.py)

使用tonsdk库（类似于tonweb）：

- [初始化钱包，创建外部消息部署钱包](https://github.com/tonfactory/tonsdk#create-mnemonic-init-wallet-class-create-external-message-to-deploy-the-wallet)

### Golang

#### 社区制作

- [查看完整示例列表](https://github.com/xssnick/tonutils-go#how-to-use)

## 全局概览
TON区块链采用完全异步的方法，涉及一些与传统区块链不同的概念。特别是，任何参与者与区块链的每次互动都包括在智能合约和/或外部世界之间异步传输消息。任何互动的常见路径始于向`钱包`智能合约发送外部消息，该合约使用公钥密码学认证消息发送者，负责支付费用，并发送内部区块链消息。因此，在TON网络上的交易不等同于用户与区块链的互动，而仅是消息图的节点：智能合约接受和处理消息的结果，可能会或可能不会产生新消息。互动可能包括任意数量的消息和交易，并持续一段较长的时间。技术上，带有消息队列的交易被聚合到由验证者处理的区块中。TON区块链的异步性质**不允许在发送消息阶段预测交易的哈希和lt（逻辑时间）**。被接受到区块中的交易是最终的，且不能被修改。

**每个内部区块链消息都是从一个智能合约到另一个智能合约的消息，携带一定数量的数字资产以及任意部分数据。**



智能合约指南建议将以32个二进制零开头的数据负载视为可读文本消息。大多数软件，如钱包和库，支持此规范，并允许在Toncoin中发送文本评论以及显示其他消息中的评论。

智能合约**支付交易费用**（通常来自输入消息的余额）以及**存储合约存储的代码和数据的存储费用**。费用取决于workchain配置，`masterchain`上的最大费用明显低于`basechain`。

## TON 上的数字资产
TON拥有三种类型的数字资产。
- Toncoin，网络的主要代币。它用于区块链上的所有基本操作，例如支付gas费或用于验证的质押。
- 本地代币，这是可以附加到网络上任何消息的特殊类型资产。由于发行新本地代币的功能已关闭，这些资产目前未被使用。
- 合约资产，如代币和NFT，类似于ERC-20/ERC-721标准，由任意合约管理，因此可能需要自定义处理规则。你可以在[处理NFTs](/develop/dapps/asset-processing/nfts)和[处理Jettons](/develop/dapps/asset-processing/jettons)文章中找到更多信息。

### 简单的 Toncoin 转账
要发送Toncoin，用户需要通过外部消息发送请求，即从外部世界到区块链的消息，到一个特殊的`钱包`智能合约（见下文）。接收到此请求后，`钱包`将发送带有所需资产量和可选数据负载的内部消息，例如文本评论。

## 钱包智能合约
钱包智能合约是TON网络上的合约，其任务是允许区块链外的参与者与区块链实体互动。通常，它解决三个挑战：
* 认证所有者：拒绝处理和支付非所有者请求的费用。
* 重放保护：禁止重复执行一个请求，例如向某个智能合约发送资产。
* 启动与其他智能合约的任意互动。

解决第一个挑战的标准解决方案是公钥密码学：`钱包`存储公钥并检查传入消息是否由相应的私钥签名，而该私钥仅由所有者知晓。第三个挑战的解决方案也很常见；通常，请求包含`钱包`向网络发送的完整内部消息。然而，对于重放保护，有几种不同的方法。

### 基于 Seqno 的钱包
基于Seqno的钱包采用最简单的消息排序方法。每条消息都有一个特殊的`seqno`整数，必须与`钱包`智能合约中存储的计数器相符。`钱包`在每个请求上更新其计数器，从而确保一个请求不会被重复处理。有几个`钱包`版本在公开可用方法方面有所不同：限制请求的过期时间的能力，以及拥有相同公钥的多个钱包的能力。然而，这种方法的固有要求是逐一发送请求，因为`seqno`序列中的任何间隙都将导致无法处理所有后续请求。

### 高负载钱包
这种类型的`钱包`采用基于存储智能合约存储中非过期处理请求的标识符的方法。在这种方法中，任何请求都会被检查是否是已处理请求的重复，如果检测到重放，则丢弃。由于过期，合约可能不会永远存储所有请求，但它会删除由于过期限制而无法处理的请求。向此`钱包`发送请求可以并行进行，彼此不干扰；然而，这种方法需要更复杂的请求处理监控。

## 与区块链的互动
可以通过TonLib在TON区块链上进行基本操作。TonLib是一个共享库，可以与TON节点一起编译，并通过所谓的lite服务器（轻客户端服务器）公开API以与区块链互动。TonLib通过检查所有传入数据的证明采取无信任方法；因此，不需要可信数据提供者。TonLib的可用方法列在[TL方案中](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234)。它们可以通过像[pyTON](https://github.com/EmelyanenkoK/pyTON)或[tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2)（技术上这些是`tonlibjson`的包装器）这样的包装器或通过`tonlib-cli`使用共享库。

## 钱包部署
要通过TonLib部署钱包，需要：
1. 通过[createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L213)或其包装函数生成私钥/公钥对（例如在[tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)中）。注意，私钥是在本地生成的，不会离开主机。
2. 形成对应于已启用`钱包`之一的[InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L60)结构。目前可用的`wallet.v3`、`wallet.highload.v1`、`wallet.highload.v2`。
3. 通过[getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L249)方法计算新`钱包`智能合约的地址。我们建议使用默认修订版`0`，并且还在`basechain` `workchain=0`中部署钱包，以降低处理和存储费用。
4. 向计算出的地址发送一些Toncoin。注意，您需要以`non-bounce`模式发送它们，因为该地址尚无代码，因此无法处理传入消息。`non-bounce`标志表示，即使处理失败，资金也不应通过反弹消息返回。我们不建议对其他交易使用`non-bounce`标志，尤其是在处理大笔资金时，因为反弹机制提供了一定程度的防错保护。
5. 形成所需的[action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L148)，例如仅用于部署的`actionNoop`。然后使用[createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L255)和[sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L260)启动与区块链的互动。
6. 几秒钟后使用[getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L254)方法检查合约。

:::tip
在[钱包教程](/develop/smart-contracts/tutorials/wallet#-deploying-a-wallet)中阅读更多
:::

## 接收消息价值
要计算消息带给合约的接收值，需要解析交易。这发生在消息触及合约时。可以使用[getTransactions](https://github.com/ton-blockchain/ton/blob/master

/tl/generate/scheme/tonlib_api.tl#L236)获得交易。对于传入钱包的交易，正确的数据包括一个传入消息和零个传出消息。否则，要么是外部消息发送到钱包，在这种情况下，所有者会花费Toncoin，要么钱包未部署，传入交易会反弹回去。

无论如何，一般来说，消息带给合约的金额可以计算为传入消息的价值减去传出消息的价值总和减去费用：`value_{in_msg} - SUM(value_{out_msg}) - fee`。技术上，交易表示包含三个不同的带有`费用`名称的字段：`费用`、`存储费用`和`其他费用`，即总费用、与存储成本相关的费用部分和与交易处理相关的费用部分。只应使用第一个。

## 检查合约的交易
可以使用[getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L236)获取合约的交易。此方法允许从某个`transactionId`和更早的时间获取10笔交易。要处理所有传入交易，应遵循以下步骤：
1. 最新的`last_transaction_id`可以使用[getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L235)获得
2. 应通过`getTransactions`方法加载10笔交易。
3. 应处理此列表中未见过的交易。
4. 传入支付是传入消息具有来源地址的交易；传出支付是传入消息没有来源地址并且还存在传出消息的交易。这些交易应相应处理。
5. 如果这10笔交易都是未见过的，应加载接下来的10笔交易，重复步骤2、3、4、5。

## 接受支付
接受支付有几种方法，它们在区分用户的方法上有所不同。

### 基于发票的方法
要基于附加评论接受支付，服务应：
1. 部署`钱包`合约。
2. 为每个用户生成唯一的`发票`。uuid32的字符串表示形式就足够了。
3. 用户应被指示向服务的`钱包`合约发送Toncoin，并附加`发票`作为评论。
4. 服务应定期轮询`钱包`合约的getTransactions方法。
5. 对于新交易，应提取传入消息，将`评论`与数据库匹配，并将值（见**接收消息价值**段落）存入用户账户。

## 发票

### 带有ton://链接的发票

如果您需要为简单用户流程进行简便集成，使用ton://链接是合适的。
最适合一次性支付和发票。

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>]
```

- ✅ 简单集成
- ✅ 无需连接钱包

- ❌ 用户需要为每次支付扫描新的二维码
- ❌ 无法追踪用户是否已签署交易
- ❌ 关于用户地址的信息
- ❌ 在某些平台不可点击此类链接（例如Telegram桌面客户端的机器人消息）时需要变通方法


<Button href="https://github.com/tonkeeper/wallet-api#payment-urls"
colorType="primary" sizeType={'lg'}>

了解更多

</Button>


### 带有 TON Connect 的发票

最适合需要在会话中签署多个支付/交易的dApps，或需要一段时间保持与钱包的连接。

- ✅ 与钱包有永久通信

渠道，关于用户地址的信息
- ✅ 用户只需扫描一次二维码
- ✅ 可以了解用户在钱包中是否确认了交易，通过返回的BOC追踪交易
- ✅ 不同平台的现成SDK和UI工具包

- ❌ 如果您只需要发送一次支付，用户需要进行两个操作：连接钱包和确认交易
- ❌ 集成比ton://链接更复杂


<Button href="/develop/dapps/ton-connect/"
colorType="primary" sizeType={'lg'}>
了解更多

</Button>

## 发送支付

1. 服务应部署`钱包`并保持其资金，以防止合约因存储费用而被销毁。注意，存储费通常少于每年1 Toncoin。
2. 服务应从用户获取`destination_address`和可选的`comment`。注意，目前我们建议要么禁止未完成的同一(`destination_address`、`value`、`comment`)集合的传出支付，要么适当安排这些支付；这样，下一个支付只有在前一个确认后才启动。
3. 用`comment`作为文本形成[msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L98)。
4. 形成包含`destination_address`、空`public_key`、`amount`和`msg.dataText`的[msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L108)。
5. 形成包含一组传出消息的[Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L149)。
6. 使用[createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L255)和[sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L260)查询发送传出支付。
7. 服务应定期轮询`钱包`合约的getTransactions方法。通过(`destination_address`、`value`、`comment`)匹配确认的交易与传出支付，可以将支付标记为完成；检测并向用户显示相应的交易哈希和lt（逻辑时间）。
8. 对`v3`或`high-load`钱包的请求默认有60秒的过期时间。在此时间后，未处理的请求可以安全地重新发送到网络（见步骤3-6）。

## 浏览器

区块链浏览器是https://tonscan.org。

要在浏览器中生成交易链接，服务需要获取lt（逻辑时间）、交易哈希和账户地址（通过getTransactions方法检索到的用于lt和txhash的账户地址）。然后https://tonscan.org和https://explorer.toncoin.org/可以以以下格式显示该tx的页面：

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/jettons.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/jettons.md
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# 处理 TON Jetton

## Jetton实践最佳做法

Jettons 是 TON 区块链上的代币--可以将其视为类似于以太坊上的 ERC-20 代币。

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验/用户界面，请避免额外等待。
:::

#### 提款

[Highload Wallet v3](/v3/documentation/smart-contracts/contracts-specs/highload-wallet#highload-wallet-v3) - 这是 TON 区块链的最新解决方案，是 jetton 提款的黄金标准。它允许您利用分批提款的优势。

[分批提款](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js) - 指分批发送多笔提款，从而实现快速、廉价的提款。

#### 存款

:::info
建议设置多个 MEMO 存款钱包，以提高性能。
:::

[Memo Deposits](https://github.com/toncenter/examples/blob/main/deposits-jettons.js) - 这可以让你保留一个存款钱包，用户添加 memo 以便被你的系统识别。这意味着您不需要扫描整个区块链，但对用户来说稍显不便。

[Memo-less deposits](https://github.com/gobicycle/bicycle) - 这种解决方案也存在，但整合起来比较困难。不过，如果您希望采用这种方法，我们可以提供协助。请在决定采用这种方法之前通知我们。

### 其他信息

:::caution 交易通知
在进行 jetton 提取时，生态系统中的每项服务都应将 `forward_ton_amount` 设置为 0.000000001  TON （1  nanotons  ），以便在[成功转账](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407) 时发送 Jetton 通知，否则转账将不符合标准，其他 CEX 和服务将无法处理。
:::

- 请参见 JS 库示例 - [tonweb](https://github.com/toncenter/tonweb)  - 这是 TON 基金会的官方 JS 库。

- 如果您想使用 Java，可以参考 [ton4j](https://github.com/neodix42/ton4j/tree/main)。

- 对于 Go，应考虑 [tonutils-go](https://github.com/xssnick/tonutils-go)。目前，我们推荐使用 JS lib.

## 内容列表

:::tip
以下文档详细介绍了 Jettons 架构的总体情况，以及 TON 的核心概念，这些概念可能与 EVM 类区块链和其他区块链不同。要想很好地理解 TON，阅读这些文档至关重要，会对你有很大帮助。
:::

本文件依次介绍了以下内容：

1. 概述
2. 架构
3. Jetton 主合约 (Token Minter)
4. Jetton 钱包合约 (User Wallet)
5. 信息布局
6. Jetton 处理（链下）
7. Jetton 处理（链上）
8. 钱包处理
9. 最佳做法

## 概述

:::info
TON 交易只需确认一次就不可逆转。
为了清楚理解，读者应熟悉[本节文档](/v3/documentation/dapps/assets/overview) 中描述的资产处理基本原则。尤其要熟悉[合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)、[钱包](/v3/guidelines/smart-contracts/howto/wallet)、[消息](/v3/documentation/smart-contracts/message-management/messages-and-transactions) 和部署流程。
:::

:::info
为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参阅 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

快速跳转到 jetton 处理的核心描述：

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>
集中处理
</Button>

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
colorType="secondary" sizeType={'sm'}>
链上处理 
</Button>

<br></br><br></br>

TON 区块链及其底层生态系统将可替代代币（FT）归类为 jetton 。由于分片应用于 TON 区块链，与类似的区块链模型相比，我们对可替代代币的实现是独一无二的。

在本分析中，我们将深入探讨详细说明 jetton [行为](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) 和 [元数据](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 的正式标准。
关于 jetton 架构不那么正式的分片概述，请参阅我们的
[anatomy of jettons 博客文章](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)。

我们还提供了讨论我们的第三方开源 TON 支付处理器（[bicycle](https://github.com/gobicycle/bicycle)）的具体细节，该处理器允许用户使用单独的存款地址存取 Toncoin 和 Jettons，而无需使用文本 memo 。

## Jetton 架构

TON 上的标准化代币是通过一套智能合约实现的，其中包括

- [Jetton master](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) 智能合约
- [Jetton wallet](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc) 智能合约

<p align="center">
  <br />
    <img width="420" src="/img/docs/asset-processing/jetton_contracts.png" alt="contracts scheme" />
      <br />
</p>

## Jetton 主智能合约

jetton 主智能合约存储有关 jetton 的一般信息（包括总供应量、元数据链接或元数据本身）。

:::warning 谨防 Jetton 骗局

具有 `symbol` 等于 `TON` 的 Jetton，或者包含系统通知消息（如 `ERROR`、`SYSTEM` 等）的 Jetton，务必确保这些 Jetton 在界面中以明确的方式显示，以避免它们与 TON 转账、系统通知等混淆。有时，甚至 `symbol`、`name` 和 `image` 都会被设计得与原版极为相似，试图误导用户。

为了消除 TON 用户被骗的可能性，请查询特定 Jetton 类型的**原始 Jetton 地址**（Jetton 主合约地址），或者**关注项目的官方社交媒体渠道或网站**以获取**正确信息**。您还可以通过 [Tonkeeper ton-assets 列表](https://github.com/tonkeeper/ton-assets) 检查资产，进一步降低被骗的风险。
:::

### 检索 Jetton 数据

要检索更具体的 Jetton 数据，请使用合约的 *get* 方法 `get_jetton_data()`。

该方法返回以下数据：

| 名称                   | 类型      | 说明                                                                                                                                                                                                     |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `total_supply`       | `int`   | 以不可分割单位计量的已发行净 TON 总数。                                                                                                                                                                                 |
| `mintable`           | `int`   | 详细说明是否可以铸造新 jetton。该值为-1（可以铸造）或 0（不能铸造）。                                                                                                                                                               |
| `admin_address`      | `slice` |                                                                                                                                                                                                        |
| `jetton_content`     | `cell`  | 根据 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)，您可以查看 [jetton 元数据解析页面](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing) 获取更多信息。 |
| `jetton_wallet_code` | `cell`  |                                                                                                                                                                                                        |

还可以使用  [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) 中的 `/jetton/masters` 方法来检索已解码的 Jetton 数据和元数据。我们还为 (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) 和 (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) 还有 (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) 以及许多其他  [SDKs](/v3/guidelines/dapps/apis-sdks/sdk) 开发了方法。

使用 [Tonweb](https://github.com/toncenter/tonweb) 运行获取方法和获取链外元数据的 URL 的示例：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

### Jetton minter

如前所述，jettons 既可以是 `可铸 (minable)` 也可以是 `不可铸 (non-mintable)` 。

如果它们是不可铸币的，逻辑就变得很简单--没有办法铸入更多代币。要首次铸造代币，请参阅[铸造第一个代币](/v3/guidelines/dapps/tutorials/mint-your-first-token) 页面。

如果是可铸币，[铸币者合约](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc) 中会有一个特殊函数来铸造额外的铸币。可以通过从管理员地址发送带有指定操作码的 "内部信息 "来调用该函数。

如果 jetton 管理员希望限制 jetton 的创建，有三种方法：

1. 如果您不能或不想更新合约代码，则需要将当前管理员的所有权转移到零地址。这将使合约失去一个有效的管理员，从而阻止任何人铸币。不过，这也会阻止对 jetton 元数据的任何更改。
2. 如果您可以访问源代码并对其进行修改，您可以在合约中创建一个方法，设置一个标志，在调用该方法后中止任何造币过程，并在造币函数中添加一条语句来检查该标志。
3. 如果可以更新合约的代码，就可以通过更新已部署合约的代码来添加限制。

## Jetton 钱包智能合约

`Jetton wallet` 合约用于**发送**、**接收** 和 **销毁** jetton 。每个 `Jetton wallet` 合约都存储了特定用户的钱包余额信息。
在特定情况下， jetton  TON 钱包用于每种 jetton  TON 类型的单个 jetton  TON 持有者。

`Jetton wallets` **不应该与钱包**混淆，钱包是为了区块链交互和存储
Toncoin 资产（例如，v3R2钱包，高负载钱包和其他），它只负责支持和管理**特定的 jetton 类型**。

### 部署 Jetton 钱包

在钱包之间 `传输 jettons` 时，交易（消息）需要一定数量的 TON
作为网络 **gas fees** 和根据 jetton 钱包合约代码执行操作的付款。
这意味着**接收方在接收 jetton 之前无需部署 jetton 钱包**。
只要发送方的 Jetton 钱包中持有足够的 TON
来支付所需的 gas 费，接收方的 Jetton 钱包就会自动部署。

### 检索指定用户的 Jetton 钱包地址

要使用 "所有者地址"（TON 钱包地址）检索 "jetton 钱包 "的 "地址"，
，`Jetton master contract` 提供了获取方法 `get_wallet_address(slice owner_address)`。

<Tabs groupId="retrieve-wallet-address">
<TabItem value="api" label="API">

> 通过 [Toncenter API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post) 中的 `/runGetMethod` 方法运行 `get_wallet_address(slice owner_address)`。在实际情况下（而非测试情况下），必须始终检查钱包是否确实归属于所需的 Jetton Master。请查看代码示例了解更多信息。

</TabItem>
<TabItem value="js" label="js">

```js
import TonWeb from 'tonweb';
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: '<JETTON_MASTER_ADDRESS>' });
const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address('<OWNER_WALLET_ADDRESS>'));

// It is important to always check that wallet indeed is attributed to desired Jetton Master:
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== jettonMinter.address.toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('Jetton wallet address:', jettonWalletAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

:::tip
更多示例请阅读 [TON Cookbook](/v3/guidelines/dapps/cookbook#tep-74-jettons-standard)。
:::

### 检索特定 Jetton 钱包的数据

要检索钱包的账户余额、所有者身份信息以及与特定 jetton 钱包合约相关的其他信息，请使用 jetton 钱包合约中的 `get_wallet_data()` 获取方法。

该方法返回以下数据：

| 名称                   | 类型    |
| -------------------- | ----- |
| `balance`            | int   |
| `owner`              | slice |
| `jetton`             | slice |
| `jetton_wallet_code` | cell  |

<Tabs groupId="retrieve-jetton-wallet-data">
<TabItem value="api" label="API">

> 使用 [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) 中的 `/jetton/wallets` 获取方法，检索先前解码的 jetton 钱包数据。

</TabItem>

<TabItem value="js" label="js">

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('Jetton balance:', data.balance.toString());
console.log('Jetton owner address:', data.ownerAddress.toString(true, true, true));
// It is important to always check that Jetton Master indeed recognize wallet
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.jettonMinterAddress.toString(false)});
const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));
if (expectedJettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('Jetton master address:', data.jettonMinterAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

## 信息布局

:::tip 信息
[点击此处](/v3/documentation/smart-contracts/message-management/messages-and-transactions) 阅读更多信息。
:::

Jetton 钱包和 TON 钱包之间通过以下通信顺序进行通信：

![](/img/docs/asset-processing/jetton_transfer.png)

#### Message 0

`发件人 -> 发件人' jetton 钱包` 意味着 *转移* 消息体包含以下数据：

| 名称                     | 类型         | 说明                                                                                                           |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `query_id`             | uint64     | 允许应用程序链接三种消息类型 `Transfer`, `Transfer notification` 和 `Excesses` 。 为了正确执行此进程，建议**总是使用唯一的查询id**。               |
| `amount`               | coins      | 将与信息一起发送的 " TON coin "总量。                                                                                    |
| `destination`          | address    | 新所有者的地址                                                                                                      |
| `response_destination` | address    | 钱包地址，用于返还带有超额信息的剩余 TON 币。                                                                                    |
| `custom_payload`       | maybe cell | 大小始终 >= 1 bit。自定义数据（用于发送方或接收方 jetton 钱包的内部逻辑）。                                                               |
| `forward_ton_amount`   | coins      | 如果您想要发送 `transfer notification message` 与 `forward payload` ，则必须大于0。 它是 **一部分`amount`值** 和 **必须小于 `amount`** |
| `forward_payload`      | maybe cell | 大小总是 >= 1 位。如果前 32 位 = 0x0，这只是一条简单的信息。                                                                       |

#### Message 2'

`收款人的 jetton 钱包 -> 收款人`。  转账通知信息 (Transfer notification message)。**仅在**`forward_ton_amount`**不为零**时发送。包含以下数据：

| 名称                | 类型      |
| ----------------- | ------- |
| `query_id`        | uint64  |
| `amount`          | coins   |
| `sender`          | address |
| `forward_payload` | cell    |

这里的 `发送者` 地址是Alice的`Jeton wallet`的地址。

#### Message 2''

`收款人的 jetton 钱包 -> 发件人`。多余信息正文 (Excess message body)。**仅在支付费用后剩余 TON 币时发送**。包含以下数据：

| 名称         | 类型     |
| ---------- | ------ |
| `query_id` | uint64 |

:::tip Jettons 标准
关于 jetton 钱包合约字段的详细说明，请参阅 [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) `Jetton 标准`接口说明。
:::

## 如何发送附带评论和通知的 Jetton 转账

这次转账需要一些 TON 币作为 **费用** 和 **转账通知信息**。

要发送**评论**，您需要设置 "转发有效载荷"。将 **前 32 位设置为 0x0**，并附加 **您的文本**，"前向有效载荷 "将在 `jetton notify 0x7362d09c` 内部信息中发送。只有当 `forward_ton_amount` > 0 时才会生成。
:::info
建议带注释的 jetton 传输的 `forward_ton_amount` 为 1  nanotons  。
:::

最后，要获取 `Excess 0xd53276db` 信息，必须设置 `response destination`。

有时，您在发送 jetton 时可能会遇到 `709` 错误。该错误表示信息所附的 Toncoin 数量不足以发送信息。请确保 `Toncoin > to_nano(TRANSFER_CONSUMPTION) + forward_ton_amount`，这通常>0.04，除非转发的有效载荷非常大。佣金取决于多种因素，包括 Jetton 代码详情以及是否需要为收款人部署新的 Jetton 钱包。
建议在消息中添加一定数量的 Toncoin 作为余量，并将您的地址设置为 `response_destination`，以便接收 `Excess 0xd53276db` 消息。例如，您可以向消息中添加 0.05 TON，同时将 `forward_ton_amount` 设置为 1 nanoton（此 TON 数量将附加到 `jetton notify 0x7362d09c` 消息中）。

你也可能会遇到 [`cskip_no_gas`](/v3/documentation/tvm/tvm-overview#compute-phase-skipped) 错误，它表示成功转移了 jetton，但没有执行其他计算。当 `forward_ton_amount` 的值等于 1  nanotons  时，这种情况很常见。

:::tip
查看 [最佳实践](/v3/guidelines/dapps/asset-processing/jettons#best-practices) 中的 *"发送带注释的 jettons"* 示例。
:::

## Jetton 链下处理

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参见 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

接受 jetton 有两种方式：

- 在**集中式热钱包**内。
- 使用为每个用户**独立地址**的钱包。

出于安全考虑，最好为**个独立的 jetton **拥有**个独立的热钱包**（每种资产都有许多钱包）。

在处理资金时，还建议提供一个冷钱包，用于存储不参与自动存取款流程的多余资金。

### 为资产处理和初步核实添加新的 jetton

1. 查找正确的 [智能合约地址](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract)。
2. 获取 [元数据](/v3/guidelines/dapps/asset-processing/jettons#retrieving-jetton-data)。
3. 检查是否存在 [骗局](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract)。

### 接收转账通知信息时识别未知 Jetton

如果您的钱包中收到有关未知 Jetton 的转账通知消息，则表示您的钱包
已创建用于保存特定 Jetton。

包含 "转账通知" 正文的内部信息的发件人地址是新 Jetton 钱包的地址。
它不应与 "转账通知"[正文](/v3/guidelines/dapps/asset-processing/jettons#message-2) 中的 "发件人 "字段混淆。

1. 通过 [获取钱包数据](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet)，读取新 Jetton 钱包的 Jetton 主地址。
2. 使用 Jetton 主合约为您的钱包地址（作为所有者）找回 Jetton 钱包地址：[如何为指定用户找回 Jetton 钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. 比较主合约返回的地址和钱包令牌的实际地址。
   如果它们匹配，那就很理想。如果不匹配，则很可能收到的是伪造的诈骗令牌。
4. 检索 Jetton 元数据：[如何接收 Jetton 元数据](#retrieving-jetton-data)。
5. 检查 `symbol` 和 `name` 字段是否有欺诈迹象。必要时警告用户。[添加新的 jetton 进行处理和初始检查](#adding-new-jettons-for-asset-processing-and-initial-verification)。

### 通过中央钱包接收用户的 jetton

:::info
为防止单个钱包的入账交易出现瓶颈，建议通过多个钱包接受存款，并根据需要扩大这些钱包的数量。
:::

:::caution 交易通知
在进行 jetton 提取时，生态系统中的每项服务都应将 `forward_ton_amount` 设置为 0.000000001  TON （1  nanotons  ），以便在[成功转账](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407) 时发送 Jetton 通知，否则转账将不符合标准，其他 CEX 和服务将无法处理。
:::

在这种情况下，支付服务会为每个发件人创建一个唯一的 memo 标识符，披露集中钱包的地址和发送的金额。发送方将代币
发送到指定的集中地址，并在注释中附上必须的 memo 。

**这种方法的优点：** 这种方法非常简单，因为在接受代币时无需支付额外费用，而且代币可以直接在热钱包中找回。

**这种方法的缺点：** 这种方法要求所有用户在转账时附上注释，这可能会导致更多的存款错误（忘记 memo 、 memo 错误等），意味着支持人员的工作量增加。

Tonweb 示例：

1. [接受 Jetton 存款至个人 HOT 钱包并附评论（ memo ）](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)
2. [ jetton 提款实例](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

#### 准备工作

1. [准备已接受的 jetton 列表](/v3/guidelines/dapps/asset-processing/jettons#adding-new-jettons-for-asset-processing-and-initial-verification) （ jetton 主地址）。
2. 部署热钱包（如果不需要 Jetton 取款，则使用 v3R2；如果需要 Jetton 取款，则使用高负载 v3）。[钱包部署](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)。
3. 使用热钱包地址执行 Jetton 传输测试，初始化钱包。

#### 处理收到的 Jettons

1. 加载已接受的 jetton 列表。
2. [为已部署的热钱包获取 Jetton 钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)。
3. 使用 [获取钱包数据](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet)，为每个 Jetton 钱包读取 Jetton 主地址。
4. 比较步骤 1 和步骤 3（正上方）中的 Jetton 主合约地址。
   如果地址不匹配，必须报告 Jetton 地址验证错误。
5. 读取使用热钱包账户的最新未处理交易列表，并
   进行迭代（对每笔交易逐一排序）。参见：  [检查合约交易](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)。
6. 检查输入信息 (in_msg) 中的事务，并从输入信息中检索源地址。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. 如果源地址与 Jetton 钱包内的地址一致，则需要继续处理交易。
   如果不匹配，则跳过该交易，检查下一笔交易。
8. 确保报文正文不是空的，且报文的前 32 位与 "转移通知 "操作码 "0x7362d09c "匹配。
   [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91)
   如果报文体为空或操作码无效，则跳过该事务。
9. 读取报文正文的其他数据，包括`query_id`、`amount`、`sender`、`forward_payload`。
   [Jetton合约消息布局](/v3/guidelines/dapps/asset-processing/jettons#message-layouts)，[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. 尝试从 `forward_payload` 数据中检索文本注释。前 32 位必须与
    文本注释操作码 `0x00000000` 匹配，其余为 UTF-8 编码文本。
    [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. 如果 `forward_payload` 数据为空或操作码无效，则跳过该事务。
12. 将收到的注释与保存的 memo 进行比较。如果匹配（始终可以识别用户），则存入转账。
13. 从第 5 步重新开始，重复该过程，直到完成整个交易列表。

### 从用户存款地址接收 jetton

为了接受来自用户存款地址的 Jettons，支付服务必须为每个发送资金的参与者创建
自己的独立地址（存款）。在这种情况下，服务提供涉及
多个并行流程的执行，包括创建新存款、扫描交易区块、
从存款中提取资金到热钱包等。

由于热钱包可以为每种 Jetton 类型使用一个 Jetton 钱包，因此有必要创建多个
钱包来启动存款。为了创建大量钱包，同时用
一个种子短语（或私钥）来管理它们，有必要在创建钱包时指定不同的 `subwallet_id `。
在 TON 上，v3 及更高版本的钱包支持创建子钱包所需的功能。

#### 在 Tonweb 中创建子钱包

```js
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### 准备工作

1. [准备一份已接受的 jetton 清单](#adding-new-jettons-for-asset-processing-and-initial-verification)。
2. 部署热钱包（如果不需要 Jetton 取款，则使用 v3R2；如果需要 Jetton 取款，则使用高负载 v3）。[钱包部署](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)。

#### 创建存款

1. 接受为用户创建新存款的请求。
2. 根据热钱包种子生成新的子钱包 (/v3R2) 地址。[在 Tonweb 中创建子钱包](#creating-a-subwallet-in-tonweb)
3. 接收地址可作为 Jetton 存款使用的地址提供给用户（这是存款 Jetton 钱包所有者
   的地址）。无需进行钱包初始化，这一步可以在从存款中提取 jetton  时完成
   。
4. 要获取该地址，必须通过 Jetton 主合约计算 Jetton 钱包的地址。
   [如何获取指定用户的 Jetton 钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)。
5. 将 Jetton 钱包地址添加到地址池，用于交易监控，并保存子钱包地址。

#### 处理交易

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参见 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

由于 Jetton
钱包可能不会发送 `transfer notification`、`excesses` 和 `internal transfer` 消息，因此并非总能确定从消息中收到的 Jettons 的确切数量。它们没有标准化。这意味着
无法保证 `internal transfer` 消息可以被解码。

因此，要确定钱包中收到的金额，需要使用 get 方法请求余额。
请求余额时，根据账户在链上特定区块的状态，使用区块来检索关键数据。
[使用 Tonweb 接受区块的准备工作](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js)。

这一过程如下：

1. 准备接受区块（使系统做好接受新区块的准备）。
2. 读取新区块并保存前一个区块 ID。
3. 接收来自区块的交易。
4. 过滤仅用于 Jetton 钱包存款池地址的交易。
5. 使用 `transfer notification` 正文对信息进行解码，以接收更详细的数据，包括
   `sender` 地址、Jetton `amount` 和注释。(请参阅：[处理收到的 jetton ](#processing-incoming-jettons))
6. 如果在
   账户内至少有一笔交易有不可解码的转出信息（信息体不包含
   `transfer notification` 的操作码和`excesses`的操作码）或没有转出信息，则必须使用当前区块的 get 方法请求 Jetton 余额，同时使用上一个
   区块计算余额差额。现在，由于
   区块内正在进行的交易，总余额存款的变化就会显现出来。
7. 作为未识别Jetton转账的标识符（没有`transfer notification`），如果有这样一个交易或区块数据存在（如果一个区块内有几个存在），则可以使用交易数据。
8. 现在需要检查以确保存款余额是正确的。如果存款余额足够发起热钱包和现有Jetton钱包之间的转账，则需要提取Jettons以确保钱包余额减少。
9. 从步骤 2 重新启动，重复整个过程。

#### 存款提款

不应从每次存款充值时都将存款转至热钱包，因为转账操作会收取TON手续费（以网络gas费支付）。
重要的是确定一定数量的Jettons，这些Jettons是必需的，才能使转账变得划算（从而存入）。

默认情况下，Jetton 存款钱包的钱包所有者不会被初始化。这是因为
没有支付存储费用的预定要求。Jetton 存款钱包可以在发送带有
`transfer` 主体的消息时部署，然后立即销毁。为此，工程师必须使用一种特殊的
机制来发送信息：[128 + 32](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)。

1. 检索标记为将提取到热钱包的存款清单
2. 检索已保存的每笔存款的所有者地址
3. 然后，从高负载
   钱包向每个所有者地址发送信息（通过将若干此类信息合并为一个批次），并附加 TON Jetton 金额。这由以下因素决定：v3R2 钱包
   初始化的费用 + 发送带有 `transfer` 主体的信息的费用 + 与 `forward_ton_amount`
   相关的任意 TON 金额（如有必要）。所附的 TON 金额由 v3R2 钱包初始化费用（值） +
   与 `transfer` 主体一起发送信息的费用（值） + 与 `forward_ton_amount` 相关的任意 TON 金额
   （如有必要）相加得出。
4. 当地址上的余额变为非零时，账户状态就会改变。等待几秒钟并查看账户的状态
   ，它很快就会从 "不存在 "状态变为 "未启动 "状态。
5. 对于每个所有者地址（具有 `uninit` 状态），必须发送外部消息，其中包含 v3R2 钱包
   init 和 `transfer` 消息正文，以便存入 Jetton 钱包 = 128 + 32。对于 `transfer`，用户必须指定热钱包地址作为 `destination` 和 `response destination`。
   可添加文本注释，以便更简单地识别转账。
6. 可以通过
   验证使用存款地址向热钱包地址发送的 Jetton，同时考虑到[在此处找到的接收 Jettons 信息处理](#processing-incoming-jettons)。

### jetton 提款

:::info 重要

以下是处理 Jetton 提现的分步指南。
:::

要提取 Jettons，钱包会向相应的 Jetton 钱包发送带有 `transfer` 主体的信息。
然后，Jetton 钱包会将 Jettons 发送给收件人。必须附加一些 TON （至少 1  nanotons  ）
作为`forward_ton_amount`（以及`forward_payload`的可选注释），以触发`transfer notification`（转账通知）。
请参阅：[Jetton 合约信息布局](/v3/guidelines/dapps/asset-processing/jettons#message-layouts)

#### 准备工作

1. 准备一份供提取的 jetton 清单：[添加新 jetton 供处理和初步核实](#adding-new-jettons-for-asset-processing-and-initial-verification)。
2. 启动热钱包部署。建议使用高负载 v3。[钱包部署](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
3. 使用热钱包地址进行 Jetton 转账，以初始化 Jetton 钱包并补充其余额。

#### 处理提款

1. 加载已处理的 jetton 列表
2. 检索部署的热钱包的Jetton钱包地址：[如何为给定用户检索Jetton钱包地址](#为给定用户检索-jetton-钱包地址)
3. 检索每个 Jetton 钱包的 Jetton 主地址：[如何检索 Jetton 钱包的数据](#retrieving-data-for-a-specific-jetton-wallet)。
   需要一个 `jetton` 参数（实际上是 Jetton 主合约的地址）。
4. 比较步骤 1 和步骤 3 中 Jetton 主合约的地址。如果地址不匹配，则应报告 Jetton 地址验证错误。
5. 收到的取款请求会显示 Jetton 类型、转账金额和收款人钱包地址。
6. 检查 Jetton 钱包的余额，确保有足够的资金进行提款。
7. 生成 [信息](/v3/guidelines/dapps/asset-processing/jettons#message-0)。
8. 使用高负载钱包时，建议收集一批信息，一次发送一批，以优化费用。
9. 保存外发外部信息的过期时间（这是钱包成功
   处理信息之前的时间，处理完毕后，钱包将不再接受信息）
10. 发送单条信息或多条信息（批量发送信息）。
11. 读取热钱包账户中最新的未处理交易列表并进行迭代。
    点击此处了解更多：[检查合约的交易](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)，
    [Tonweb 示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) 或
    使用 Toncenter API `/getTransactions`方法。
12. 查看账户中发出的信息。
13. 如果存在带有 `transfer` 操作码的报文，则应对其进行解码，以获取 `query_id` 值。
    检索到的 `query_id` 需要标记为发送成功。
14. 如果当前扫描事务的处理时间大于
    过期时间，且未找到带有给定 `query_id`
    的传出消息，则应将该请求（可选）标记为过期，并安全地重新发送。
15. 在账户中查找收到的信息。
16. 如果存在使用 `Excess 0xd53276db` 操作码的报文，则应解码该报文并检索 `query_id`
    值。找到的 `query_id` 必须标记为成功传送。
17. 转至步骤 5。未成功发送的过期申请应推回到撤回列表中。

## Jetton 链上处理

一般来说，为了接受和处理 jettons，负责内部消息的消息处理程序会使用 `op=0x7362d09c` 操作码。

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参见 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

### 链上处理建议

下面是一个“建议列表”，**在链上处理 jetton 时**必须考虑：

1. 使用钱包类型，而不是 Jetton 主合约，**识别进入的 jetton**。换句话说，您的合约应该与特定的 jetton 钱包（而不是使用特定 Jetton 主合约的未知钱包）交互（接收和发送信息）。
2. 连接 Jetton 钱包和 Jetton 主合约时，**检查**此**连接是否双向**，即钱包识别主合约，反之亦然。例如，如果您的合约系统收到 jetton 钱包的通知（该钱包将 MySuperJetton 视为其主合约），则必须向用户显示其转移信息，在显示 MySuperJetton 合约的 `symbol`、`name` 和 `image`
   之前，请检查 MySuperJetton 钱包是否使用了正确的合约系统。反过来，如果您的合约系统由于某种原因需要使用 MySuperJetton 或 MySuperJetton 主合约发送捷径，请确认 X 钱包与使用相同合约参数的钱包一样。
   此外，在向 X 发送 `transfer` 请求之前，请确保它将 MySuperJetton 识别为主合约。
3. 去中心化金融（DeFi）的**真正力量**在于它能够像乐高积木一样将协议堆叠在一起。例如，将 jetton A 交换为 jetton B，然后将 jetton B 用作借贷协议中的杠杆（当用户提供流动性时），再将 jetton B 用于购买 NFT .... 等等。因此，考虑一下合约如何通过将标记化价值附加到转账通知上，添加一个可与转账通知一起发送的自定义有效载荷，不仅为链下用户提供服务，也为链上实体提供服务。
4. **请注意**，并非所有合约都遵循相同的标准。不幸的是，有些 jetton 可能是敌对的（使用基于攻击的载体），其创建的唯一目的就是攻击毫无戒心的用户。为了安全起见，如果相关协议由许多合约组成，请勿创建大量相同类型的 jetton 钱包。特别是，不要在协议内部的存款合约、金库合约或用户账户合约等之间发送 jetton。攻击者可能会通过伪造转账通知、jetton 金额或有效载荷参数来故意干扰合约逻辑。每个 jetton（用于所有存款和取款）在系统中只使用一个钱包，从而降低潜在的攻击可能性。
5. 为每个个性化的 jetton 创建分包合约也是一个**好的办法**，这样可以减少地址欺骗的机会（例如，当使用针对 jetton A 的合约向 jetton B 发送传输信息时）。
6. **强烈建议**在合约层面使用不可分割的 jetton 单位。与小数有关的逻辑通常用于增强用户界面 (UI)，与链上的数字记录保存无关。

要了解有关[Secure Smart Contract Programming in FunC by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func)的**更多**信息，请随时阅读本资源。建议开发人员\*\*处理所有智能合约异常，\*\*这样在应用程序开发过程中就不会跳过这些异常。

## Jetton 钱包处理建议

一般来说，用于链外 Jetton 处理的所有验证程序也适用于钱包。对于 Jetton 钱包处理，我们最重要的建议如下：

1. 当钱包收到来自未知 Jetton 钱包的转账通知时，**信任**该 Jetton 钱包及其主合约地址是至关重要的，因为它可能是一个恶意伪造的钱包。为了保护自己，请通过提供的地址检查 Jetton Master（主合约），以确保您的验证流程能够确认该 Jetton 钱包的合法性。在确认钱包可信且合法后，您可以允许其访问您的账户余额及其他钱包内的数据。如果 Jetton Master 无法识别该钱包，建议完全避免发起或披露您的 Jetton 转账，并仅显示附加在转账通知中的 TON 转账（Toncoin）信息。
2. 在实践中，如果用户想与 Jetton 而不是 jetton 钱包进行交互。换句话说，用户发送 wTON/oUSDT/jUSDT, jUSDC, jDAI 而不是 `EQAjN...`/`EQBLE...`
   等。通常情况下，这意味着当用户发起 jetton 转账时，钱包会询问相应的 jetton 主钱包（用户拥有）哪个 jetton 钱包应该发起转账请求。**切勿盲目相信**管理员（主合约）提供的数据，这一点**非常重要**。在向 jetton 钱包发送转账请求之前，请务必确保 jetton 钱包确实属于其声称的 Jetton Master。
3. **请注意**，恶意的 Jetton Masters/jetton 钱包**可能会随着时间的推移而改变**他们的钱包/Masters。因此，用户必须尽职尽责，并在每次使用前检查与之互动的任何钱包的合法性。
4. **始终确保**在界面中以明确的方式显示 Jetton，避免与 TON 转账、系统通知等混淆。即使是 `symbol`、`name` 和 `image` 参数，也可能被伪造来误导用户，使其成为潜在的诈骗受害者。曾经发生多起案例，恶意 Jetton 被用来冒充 TON 转账、错误通知、奖励收益或资产冻结公告。
5. **始终警惕可能的恶意行为者**创建伪造的 Jetton，为用户提供功能以在主界面中移除不需要的 Jetton 是一个明智的选择。

作者：[kosrk](https://github.com/kosrk)、[krigga](https://github.com/krigga)、[EmelyanenkoK](https://github.com/EmelyanenkoK/)和[tolya-yanot](https://github.com/tolya-yanot/)。

## 最佳实践

如果您想要测试示例，请查看 [SDKs](/v3/guidelines/dapps/asset-processing/jettons#sdks)并尝试运行它们。以下代码片段将通过代码示例帮助您了解 jetton 处理。

### 发送带有评论的 Jettons

<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
源代码
</summary>

```js
// first 4 bytes are tag of text comment
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: JETTON_WALLET_ADDRESS, // address of Jetton wallet of Jetton sender
  amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message
  seqno: seqno,
  payload: await jettonWallet.createTransferBody({
    jettonAmount: TonWeb.utils.toNano('500'), // Jetton amount (in basic indivisible units)
    toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recepient user's wallet address (not Jetton wallet)
    forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message
    forwardPayload: comment, // text comment for Transfer notification message
    responseAddress: walletAddress // return the TONs after deducting commissions back to the sender's wallet address
  }),
  sendMode: 3,
}).send()
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
源代码
</summary>

```go
client := liteclient.NewConnectionPool()

// connect to testnet lite server
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// initialize ton api lite connection wrapper
api := ton.NewAPIClient(client)

// seed words of account, you can generate them with any wallet or using wallet.NewSeed() method
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// find our jetton wallet
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// address of receiver's wallet (not token wallet, just usual)
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// your TON balance must be > 0.05 to send
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("sending transaction...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("transaction confirmed, hash:", base64.StdEncoding.EncodeToString(tx.Hash))
```

</details>

</TabItem>
<TabItem value="TonTools" label="Python">

<details>
<summary>
源代码
</summary>

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# for TonCenterClient and LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# for all clients
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```

</details>

</TabItem>

<TabItem value="pytoniq" label="Python">

<details>
<summary>
源代码
</summary>

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # Jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</details>

</TabItem>
</Tabs>

### 接受带注释解析的 Jetton 交易

<Tabs groupId="parse-code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
源代码
</summary>

```ts
import {
    Address,
    TonClient,
    Cell,
    beginCell,
    storeMessage,
    JettonMaster,
    OpenedContract,
    JettonWallet,
    Transaction
} from '@ton/ton';


export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function tryProcessJetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
    });

    interface JettonInfo {
        address: string;
        decimals: number;
    }

    interface Jettons {
        jettonMinter : OpenedContract<JettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<JettonWallet>
    }

    const MY_WALLET_ADDRESS = 'INSERT-YOUR-HOT-WALLET-ADDRESS'; // your HOT wallet

    const JETTONS_INFO : Record<string, JettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', //
            decimals: 6
        },
        'jUSDT': {
            address: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
            decimals: 6
        },
    }
    const jettons: Record<string, Jettons> = {};

    const prepare = async () => {
        for (const name in JETTONS_INFO) {
            const info = JETTONS_INFO[name];
            const jettonMaster = client.open(JettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

            const jettonWallet = client.open(JettonWallet.create(jettonUserAddress));

            //const jettonData = await jettonWallet;
            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); //skip balance
            jettonData.stack.pop(); //skip owneer address
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton minter address from jetton wallet doesnt match config');
            }

            jettons[name] = {
                jettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressToJettonName = (jettonWalletAddress : Address) => {
        const jettonWalletAddressString = jettonWalletAddress.toString();
        for (const name in jettons) {
            const jetton = jettons[name];

            if (jetton.jettonWallet.address.toString() === jettonWalletAddressString) {
                return name;
            }
        }
        return null;
    }

    // Subscribe
    const Subscription = async ():Promise<Transaction[]> =>{

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
      });

        const myAddress = Address.parse('INSERT-YOUR-HOT-WALLET'); // Address of receiver TON wallet
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
    }

    return retry(async () => {

        await prepare();
        const Transactions = await Subscription();

        for (const tx of Transactions) {

            const sourceAddress = tx.inMessage?.info.src;
            if (!sourceAddress) {
                // external message - not related to jettons
                continue;
            }

            if (!(sourceAddress instanceof Address)) {
                continue;
            }

            const in_msg = tx.inMessage;

            if (in_msg?.info.type !== 'internal') {
                // external message - not related to jettons
                continue;
            }

            // jetton master contract address check
            const jettonName = jettonWalletAddressToJettonName(sourceAddress);
            if (!jettonName) {
                // unknown or fake jetton transfer
                continue;
            }

            if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
                // no in_msg or in_msg body
                continue;
            }

            const msgBody = tx.inMessage;
            const sender = tx.inMessage?.info.src;
            const originalBody = tx.inMessage?.body.beginParse();
            let body = originalBody?.clone();
            const op = body?.loadUint(32);
            if (!(op == 0x7362d09c)) {
                continue; // op != transfer_notification
            }

            console.log('op code check passed', tx.hash().toString('hex'));

            const queryId = body?.loadUint(64);
            const amount = body?.loadCoins();
            const from = body?.loadAddress();
            const maybeRef = body?.loadBit();
            const payload = maybeRef ? body?.loadRef().beginParse() : body;
            const payloadOp = payload?.loadUint(32);
            if (!(payloadOp == 0)) {
                console.log('no text comment in transfer_notification');
                continue;
            }

            const comment = payload?.loadStringTail();
            if (!(comment == orderId)) {
                continue;
            }
            
            console.log('Got ' + jettonName + ' jetton deposit ' + amount?.toString() + ' units with text comment "' + comment + '"');
            const txHash = tx.hash().toString('hex');
            return (txHash);
        }
        throw new Error('Transaction not found');
    }, {retries: 30, delay: 1000});
}
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
源代码
</summary>

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

const (
	MainnetConfig   = "https://ton.org/global.config.json"
	TestnetConfig   = "https://ton.org/global.config.json"
	MyWalletAddress = "INSERT-YOUR-HOT-WALLET-ADDRESS"
)

type JettonInfo struct {
	address  string
	decimals int
}

type Jettons struct {
	jettonMinter        *jetton.Client
	jettonWalletAddress string
	jettonWallet        *jetton.WalletClient
}

func prepare(api ton.APIClientWrapped, jettonsInfo map[string]JettonInfo) (map[string]Jettons, error) {
	userAddress := address.MustParseAddr(MyWalletAddress)
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		return nil, err
	}

	jettons := make(map[string]Jettons)

	for name, info := range jettonsInfo {
		jettonMaster := jetton.NewJettonMasterClient(api, address.MustParseAddr(info.address))
		jettonWallet, err := jettonMaster.GetJettonWallet(context.Background(), userAddress)
		if err != nil {
			return nil, err
		}

		jettonUserAddress := jettonWallet.Address()

		jettonData, err := api.RunGetMethod(context.Background(), block, jettonUserAddress, "get_wallet_data")
		if err != nil {
			return nil, err
		}

		slice := jettonData.MustCell(0).BeginParse()
		slice.MustLoadCoins() // skip balance
		slice.MustLoadAddr()  // skip owneer address
		adminAddress := slice.MustLoadAddr()

		if adminAddress.String() != info.address {
			return nil, fmt.Errorf("jetton minter address from jetton wallet doesnt match config")
		}

		jettons[name] = Jettons{
			jettonMinter:        jettonMaster,
			jettonWalletAddress: jettonUserAddress.String(),
			jettonWallet:        jettonWallet,
		}
	}

	return jettons, nil
}

func jettonWalletAddressToJettonName(jettons map[string]Jettons, jettonWalletAddress string) string {
	for name, info := range jettons {
		if info.jettonWallet.Address().String() == jettonWalletAddress {
			return name
		}
	}
	return ""
}

func GetTransferTransactions(orderId string, foundTransfer chan<- *tlb.Transaction) {
	jettonsInfo := map[string]JettonInfo{
		"jUSDC": {address: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728", decimals: 6},
		"jUSDT": {address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA", decimals: 6},
	}

	client := liteclient.NewConnectionPool()

	cfg, err := liteclient.GetConfigFromUrl(context.Background(), MainnetConfig)
	if err != nil {
		log.Fatalln("get config err: ", err.Error())
	}

	// connect to lite servers
	err = client.AddConnectionsFromConfig(context.Background(), cfg)
	if err != nil {
		log.Fatalln("connection err: ", err.Error())
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client, ton.ProofCheckPolicySecure).WithRetry()
	master, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	// address on which we are accepting payments
	treasuryAddress := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")

	acc, err := api.GetAccount(context.Background(), master, treasuryAddress)
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	jettons, err := prepare(api, jettonsInfo)
	if err != nil {
		log.Fatalln("can't prepare jettons data: ", err.Error())
	}

	lastProcessedLT := acc.LastTxLT

	transactions := make(chan *tlb.Transaction)

	go api.SubscribeOnTransactions(context.Background(), treasuryAddress, lastProcessedLT, transactions)

	log.Println("waiting for transfers...")

	// listen for new transactions from channel
	for tx := range transactions {
		if tx.IO.In == nil || tx.IO.In.MsgType != tlb.MsgTypeInternal {
			// external message - not related to jettons
			continue
		}

		msg := tx.IO.In.Msg
		sourceAddress := msg.SenderAddr()

		// jetton master contract address check
		jettonName := jettonWalletAddressToJettonName(jettons, sourceAddress.String())
		if len(jettonName) == 0 {
			// unknown or fake jetton transfer
			continue
		}

		if msg.Payload() == nil || msg.Payload() == cell.BeginCell().EndCell() {
			// no in_msg body
			continue
		}

		msgBodySlice := msg.Payload().BeginParse()

		op := msgBodySlice.MustLoadUInt(32)
		if op != 0x7362d09c {
			continue // op != transfer_notification
		}

		// just skip bits
		msgBodySlice.MustLoadUInt(64)
		amount := msgBodySlice.MustLoadCoins()
		msgBodySlice.MustLoadAddr()

		payload := msgBodySlice.MustLoadMaybeRef()
		payloadOp := payload.MustLoadUInt(32)
		if payloadOp == 0 {
			log.Println("no text comment in transfer_notification")
			continue
		}

		comment := payload.MustLoadStringSnake()
		if comment != orderId {
			continue
		}

		// process transaction
		log.Printf("Got %s jetton deposit %d units with text comment %s\n", jettonName, amount, comment)
		foundTransfer <- tx
	}
}
```

</details>
</TabItem>

<TabItem value="pythoniq" label="Python">

<details>
<summary>
源代码
</summary>

```py
import asyncio

from pytoniq import LiteBalancer, begin_cell

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


async def parse_transactions(provider: LiteBalancer, transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
            continue

        body_slice = transaction.in_msg.body.begin_parse()
        op_code = body_slice.load_uint(32)
        if op_code != 0x7362D09C:
            continue

        body_slice.load_bits(64)  # skip query_id
        jetton_amount = body_slice.load_coins() / 1e9
        jetton_sender = body_slice.load_address().to_str(1, 1, 1)
        if body_slice.load_bit():
            forward_payload = body_slice.load_ref().begin_parse()
        else:
            forward_payload = body_slice

        jetton_master = (
            await provider.run_get_method(
                address=sender, method="get_wallet_data", stack=[]
            )
        )[2].load_address()
        jetton_wallet = (
            (
                await provider.run_get_method(
                    address=jetton_master,
                    method="get_wallet_address",
                    stack=[
                        begin_cell()
                        .store_address(MY_WALLET_ADDRESS)
                        .end_cell()
                        .begin_parse()
                    ],
                )
            )[0]
            .load_address()
            .to_str(1, 1, 1)
        )

        if jetton_wallet != sender:
            print("FAKE Jetton Transfer")
            continue

        if len(forward_payload.bits) < 32:
            print(
                f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton"
            )
        else:
            forward_payload_op_code = forward_payload.load_uint(32)
            if forward_payload_op_code == 0:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and comment: {forward_payload.load_snake_string()}"
                )
            else:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and unknown payload: {forward_payload} "
                )

        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")


async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(provider, transactions)
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</details>
</TabItem>
</Tabs>

## SDK

您可以在 [此处](/v3/guidelines/dapps/apis-sdks/sdk) 找到各种语言（js、python、golang、C#、Rust 等）的 SDK 列表。

## 另请参见

- [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)
- [TON 上的 NFT 处理](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [在 TON 上解析元数据](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/jettons.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/jettons.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# 处理 TON Jetton

处理 jettons 的最佳实践及注释：

- [接受 jettons 存款的 JS 算法](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)

- [jettons 提款的 JS 算法](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

在大多数情况下，这应该足够你使用，如果不够，你可以在下面找到详细信息。

## 内容列表

本文档依次描述了以下内容：
1. 概览
2. 架构
3. Jetton 主合约（代币铸造）
4. Jetton 钱包合约（用户钱包）
5. 消息布局
6. Jetton 处理（链下）
7. Jetton 处理（链上）
8. 钱包处理
9. 最佳实践

## 概览

:::info
为了清晰理解，读者应该熟悉在[我们的文档的这一部分](/develop/dapps/asset-processing/)描述的资产处理的基本原理。特别重要的是要熟悉[合约](/learn/overviews/addresses#everything-is-a-smart-contract)、[钱包](/develop/smart-contracts/tutorials/wallet)、[消息](/develop/smart-contracts/guidelines/message-delivery-guarantees)和部署过程。
:::

快速跳转到 jetton 处理的核心描述：


<Button href="/develop/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>

集中处理

</Button>


<Button href="/develop/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
        colorType="secondary" sizeType={'sm'}>

链上处理

</Button>


<br></br><br></br>


TON 区块链及其底层生态系统将可替代代币（FTs）分类为 jettons。因为 TON 区块链应用了分片，我们对可替代代币的实现在与类似的区块链模型相比时是独特的。

在这项分析中，我们深入探讨了详细规定 jetton [行为](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)和[元数据](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)的正式标准。
我们还在我们的[分片聚焦的 jetton 架构概述博客文章](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)中提供了关于 jetton 架构的非正式详情。
我们还讨论了我们的第三方开源 TON 支付处理程序（[bicycle](https://github.com/gobicycle/bicycle)）的特定详情，该处理程序允许用户使用单独的存款地址存取 Toncoin 和 jettons，无需使用文本备注。


## Jetton 架构

TON 上的标准化代币使用一组智能合约来实现，包括：
* [Jetton 主智能合约](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc)
* [Jetton 钱包智能合约](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc)

<p align="center">
  <br />
    <img width="420" src="/img/docs/asset-processing/jetton_contracts.svg" alt="contracts scheme" />
      <br />
</p>

## Jetton 主智能合约
Jetton 主智能合约存储了有关 jetton 的常见信息（包括总供应量、元数据链接或元数据本身）。

任何用户都可能创建一个伪造的、与原始 jetton 几乎相同的有价值的 jetton 克隆（使用任意名称、票证、图像等）。幸运的是，伪造的 jettons 可以通过它们的地址轻松识别。

为了消除 TON 用户的欺诈可能性，请查找特定 jetton 类型的原始 jetton 地址（Jetton 主合约），或关注项目的官方社交媒体频道或网站以找到正确信息。检查资产以消除 [Tonkeeper ton-assets list](https://github.com/tonkeeper/ton-assets)的欺诈可能性。

### 检索 Jetton 数据

要检索更具体的 Jetton 数据，使用 `get_jetton_data()` 获取方法。

此方法返回以下数据：

| 名称               | 类型  | 描述 |
|--------------------|-------|-------------------- |
| `total_supply`       | `int`  | 以不可分割的单位衡量的发行的 jettons 总数。 |
| `mintable`          | `int`   | 详情是否可以铸造新的 jettons。此值为 -1（可以铸造）或 0（不能铸造）。 |
| `admin_address`      | `slice` |   |
| `jetton_content`     | `cell` | 根据 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 的数据。 |
| `jetton_wallet_code` | `cell`  |  |



也可以使用 [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) 中的方法 `/jetton/masters` 来检索已解码的 Jetton 数据和元数据。我们还为 (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) 和 (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28)，(go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) 和 (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79)，(python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) 以及许多其他 SDK 开发了方法。

使用 [Tonweb](https://github.com/toncenter/tonweb) 运行 get 方法并获取链下元数据的 url 的示例：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

#### Jetton 元数据
[这里](/develop/dapps/asset-processing/metadata)提供了有关解析元数据的更多信息。

## Jetton 钱包智能合约
Jetton 钱包合约用于发送、接收和销毁 jettons。每个 _jetton 钱包合约_ 存储特定用户的钱包余额信息。
在特定情况下，jetton 钱包用于每种 jetton 类型的个别 jetton 持有者。

Jetton 钱包不应与仅用于区块链交互和只存储 Toncoin 资产（例如，v3R2 钱包、高负载钱包等）的钱包混淆，它负责支持和管理只有特定 jetton 类型的。

Jetton 钱包使用智能合约，并通过所有者钱包和 jetton 钱包之间的内部消息进行管理。例如，如果 Alice 管理着一个内有 jettons 的钱包，方案如下：Alice 拥有一个专门用于 jetton 使用的钱包（例如钱包版本 v3r2）。当 Alice 启动在她管理的钱包中发送 jettons 时，她向她的钱包发送外部消息，因此，_她的钱包_ 向 _她的 jetton 钱包_ 发送内部消息，然后 jetton 钱包实际执行代币转移。

### 检索给定用户的 Jetton 钱包地址
要使用所有者地址（TON 钱包地址）检索 jetton 钱包地址，
Jetton 主合约提供了 get 方法 `get_wallet_address(slice owner_address)`。

#### 使用 API 检索
应用程序使用 [Toncenter API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post) 的 `/runGetMethod` 方法，通过将所有者的地址序列化到 cell 中。

#### 使用 SDK 检索
也可以通过使用我们各种 SDK 中的现成方法启动此过程，例如，使用 Tonweb SDK，可以通过输入以下字符串启动此过程：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const address = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address("<OWNER_WALLET_ADDRESS>"));
// 检查钱包是否真的属于所需的 Jetton 主要非常重要：
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== new TonWeb.utils.Address(info.address).toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('Jetton 钱包地址:', address.toString(true, true, true));
```
:::tip
要了解更多示例，请阅读 [TON 开发手册](/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address)。
:::

### 检索特定 Jetton 钱包的数据

要检索钱包的账户余额、所有者识别信息以及与特定 jetton 钱包合约相关的其他信息，jetton 钱包合约内使用 `get_wallet_data()` get 方法。


此方法返回以下数据：

| 名称               | 类型  |
|--------------------|-------|
| balance            | int   |
| owner              | slice |
| jetton             | slice |
| jetton_wallet_code | cell  |

也可以使用 [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) 的 `/jetton/wallets` get 方法来检索先前解码的 jetton 钱包数据（或 SDK 中的方法）。例如，使用 Tonweb：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('Jetton 余额:', data.balance.toString());
console.log('Jetton 所有者地址:', data.ownerAddress.toString(true, true, true));
// 检查 Jetton 主是否真的识别钱包非常重要
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.jettonMinterAddress.toString(false)});
const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));
if (expectedJettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('Jetton 主地址:', data.jettonMinterAddress.toString(true, true, true));
```

### Jetton 钱包部署
在钱包之间转移 jettons 时，交易（消息）需要一定量的 TON作为网络gas费和根据 Jetton 钱包合约代码执行操作的支付。这意味着接收者在接收 jettons 之前不需要部署 jetton 钱包。只要发送方的钱包中有足够的 TON支付所需的gas费，接收者的 jetton 钱包将自动部署。

## 消息布局

:::tip 消息
阅读更多关于消息的信息[这里](/develop/smart-contracts/guidelines/message-delivery-guarantees)。
:::

Jetton 钱包和 TON 钱包之间的通信是通过以下通信序列进行的：

![](/img/docs/asset-processing/jetton_transfer.svg)


`发件人 -> 发件人' jetton 钱包` 意味着 _转移_ 消息体包含以下数据：


| 名称                 | 类型    |
|----------------------|---------|
| `query_id `            | uint64  |
| `amount  `             | coins   |
| `destination  `        | address |
| `response_destination` | address |
| `custom_payload  `     | cell    |
| `forward_ton_amount`   | coins   |
| `forward_payload`      | cell    |

`收款人' jetton 钱包 -> 收款人`  意味着消息通知体包含以下数据：


| 名称            | 类型    |
|-----------------|---------|
| query_id    `    | uint64  |
| amount   `       | coins   |
| sender  `        | address |
| forward_payload` | cell    |

`收款人' jetton 钱包 -> 发件人` 意味着剩余消息体包含以下数据：


| 名称                 | 类型           |
|----------------------|----------------|
| `query_id`             | uint64         |

有关 jetton 钱包合约字段的详细说明可以在 [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) Jetton 标准接口描述中找到。

使用 `Transfer notification` 和 `Excesses` 参数的消息是可选的，取决于附着在 `Transfer` 消息上的 TON 的数量以及 `forward_ton_amount` 字段的值。

`query_id` 标识符允许应用程序将三种消息类型 `Transfer`、 `Transfer notification` 和 `Excesses` 相互关联。为了正确执行此过程，建议始终使用唯一的查询 id。

### 如何发送附带评论和通知的 Jetton 转账

为了进行附带通知的转账（随后在钱包内用于通知目的），必须通过设置非零的 `forward_ton_amount` 值附加足够数量的TON到发送的消息中，并且如有必要，将文本评论附加到 `forward_payload`。文本评论的编码方式与发送Toncoin时的文本评论类似。

[发送Jettons的费用](https://docs.ton.org/develop/smart-contracts/fees#fees-for-sending-jettons)

然而，佣金取决于几个因素，包括Jetton代码详情和为接收者部署新的Jetton钱包的需要。因此，建议附加多一些Toncoin，并且然后将地址设置为 `response_destination` 以检索 `Excesses` 消息。例如，可以在将 `forward_ton_amount` 值设置为0.01 TON的同时，向消息附加0.05 TON（这个TON的数量将被附加到 `Transfer notification` 消息中）。

[使用Tonweb SDK的Jetton带评论转账示例](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/test-jetton.js#L128):

```js
// 前4个字节是文本评论的标签
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: JETTON_WALLET_ADDRESS, // Jetton发送者的Jetton钱包地址
    amount: TonWeb.utils.toNano('0.05'), // 附加到转账消息的TON总量
    seqno: seqno,
    payload: await jettonWallet.createTransferBody({
        jettonAmount: TonWeb.utils.toNano('500'), // Jetton数量（以最基本的不可分割单位计）
        toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // 接收用户的钱包地址（非Jetton钱包）
        forwardAmount: TonWeb.utils.toNano('0.01'), // 用于触发Transfer notification消息的一些TONs数量
        forwardPayload: comment, // Transfer notification消息的文本评论
        responseAddress: walletAddress // 扣除手续费后将TON退回给发件人的钱包地址
    }),
    sendMode: 3,
}).send()
```

:::tip
要获得更多示例，请阅读 [TON 开发手册](/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment)。
:::


## Jetton 链下处理

:::info 交易确认
TON交易在仅一次确认后就不可逆转。为了最佳用户体验，建议在TON区块链上的交易一旦完成后，不要等待额外的区块。在 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) 中阅读更多信息。
:::

可以有几种允许用户接收Jettons的场景。Jettons可以在一个中心化的热钱包内被接受；同样，它们也可以通过为每个独立用户设置分离地址的钱包来接受。

为了处理Jettons，与处理个体化的TON不同，需要一个热钱包（一个v3R2，高负载钱包）以及一个或多个Jetton钱包。Jetton热钱包的部署在我们的文档[钱包部署](/develop/dapps/asset-processing/#wallet-deployment)中有描述。就是说，不需要根据 [Jetton钱包部署](#jetton-wallet-deployment) 标准部署Jetton钱包。然而，当接收到Jettons时，会自动部署Jetton钱包，这意味着当Jettons被提取时，假定它们已经在用户的资产中。

出于安全原因，最好拥有对不同Jettons持有分开的热钱包（每种资产类型的多个钱包）。

在处理资金时，也建议提供一个冷钱包用于存储不参与自动存款和提款过程的额外资金。

### 添加新的 Jettons 进行资产处理和初步验证

1. 要找到正确的智能合约代币主地址，请参见以下来源：[如何找到正确的Jetton master合约](#jetton-master-smart-contract)
2. 此外，要检索特定Jetton的元数据，请参见以下来源：[如何接收Jetton元数据](#retrieving-jetton-data)。
   为了正确向用户展示新的Jettons，需要正确的 `decimals` 和 `symbol`。

为了确保所有用户的安全，至关重要的是避免可能被伪造（假冒）的Jettons。例如，`symbol`==`TON` 的Jettons或那些包含系统通知消息的Jettons，例如：`ERROR`、`SYSTEM` 等。务必确保jettons以这样的方式在你的界面中显示，以便它们不能与TON转账、系统通知等混淆。有时，即使`symbol`、`name`和`image`被设计得几乎与原始的一模一样，也是只是希望误导用户的。

### 在收到转账通知消息时识别未知的 Jetton

1. 如果在你的钱包内收到了关于未知Jetton的转账通知消息，那么你的钱包就被创建为持有特定Jetton的钱包。接下来，进行几个验证过程很重要。
2. 包含 `Transfer notification` 体的内部消息的发送地址是新的Jetton钱包的地址。不要与 `Transfer notification` 体内的 `sender` 字段混淆，Jetton钱包的地址是消息来源的地址。
3. 检索新的Jetton钱包的Jetton master地址：[如何检索Jetton钱包的数据](#retrieving-jetton-data)。
   要执行此过程，需要 `jetton` 参数，即Jetton master合约的地址。
4. 使用Jetton master合约检索你的钱包地址（作为拥有者）的Jetton钱包地址：[如何检索特定用户的Jetton钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)
5. 将master合约返回的地址与钱包代币的实际地址进行比较。如果它们匹配，那是理想的。如果不匹配，那么你可能收到了一个假冒的欺诈代币。
6. 检索Jetton元数据：[如何接收Jetton元数据](#retrieving-jetton-data)。
7. 检查 `symbol` 和 `name` 字段是否为欺诈的迹象。如有必要，警告用户。[为处理和初步检查添加新的Jettons](#adding-new-jettons-for-asset-processing-and-initial-verification)。


### 通过中心化钱包接收用户的 Jettons

在这种情况下，支付服务为每个发送者创建一个唯一的备忘录标识符，公开中心化钱包的地址和发送的金额。发送者将代币发送到指定的中心化地址，并且必须在评论中包含备忘录。

**这种方法的优点：**这种方法非常简单，因为接受代币时没有额外的费用，并且它们直接检索到热钱包中。

**这种方法的缺点：**这种方法要求所有用户在转账时附加评论，这可能导致更多的存款错误（遗忘备忘录、备忘录错误等），意味着更多的支持工作量。

Tonweb示例：

1. [使用评论（备忘录）接受到个人热钱包的Jetton存款](https://github.com/toncenter/examples/blob/main/deposits-jettons-single-wallet.js)
2. [Jettons提款示例](https://github.com/toncenter/examples/blob/main/jettons-withdrawals.js)

#### 准备

1. 准备一个接受的Jettons列表：[添加新的Jettons以进行处理和初步验证](#adding-new-jettons-for-asset-processing-and-initial-verification)。
2. 热钱包部署（如果预期没有Jetton提款，则使用v3R2；如果预期有Jetton提款，则使用高负载v2）[钱包部署](/develop/dapps/asset-processing/#wallet-deployment)。
3. 使用热钱包地址执行测试Jetton转账以初始化钱包。

#### 处理收到的 Jettons
1. 加载接受的Jettons列表
2. 检索你部署的热钱包的Jetton钱包地址：[如何检索特定用户的Jetton钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. 为每个Jetton钱包检索Jetton master地址：[如何检索特定Jetton钱包的信息](#retrieving-data-for-a-specific-jetton-wallet)。
   要执行此过程，需要 `jetton` 参数（实际上是Jetton master合约的地址）。
4. 比较步骤1和步骤3（直接上方）中的Jetton master合约地址。如果地址不匹配，则必须报告Jetton地址验证错误。
5. 使用热钱包帐户检索最近未处理的交易列表，并对其进行迭代（逐一排序每个交易）。参见：[检查合约的交易](https://docs.ton.org/develop/dapps/asset-processing/#checking-contracts-transactions)，
或使用 [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43)
或使用Toncenter API `/getTransactions` 方法。
6. 检查交易中的输入消息（in_msg）并从输入消息中检索源地址。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. 如果源地址与Jetton钱包内的地址匹配，则需要继续处理交易。如果不是，则跳过处理该交易并检查下一个交易。
8. 确保消息体不为空，并且消息的前32位与 `transfer notification` op码 `0x7362d09c` 匹配。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91)
   如果消息体为空或op码无效 - 跳过交易。
9. 读取消息体的其他数据，包括 `query_id`、`amount`、`sender`、`forward_payload`。[Jetton合约消息布局](#jetton-contract-message-layouts)，[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. 试图从 `forward_payload` 数据中检索文本评论。前32位必须与文本评论op码 `0x00000000` 匹配，剩余部分 - UTF-8编码文本。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. 如果 `forward_payload` 数据为空或op码无效 - 跳过交易。
12. 将接收到的评论与保存的备忘录比较。如果有匹配（始终可以识别用户）- 存入转账。
13. 从步骤5重新开始并重复该过程，直到遍历完所有交易的整个列表。

### 通过用户存款地址接收 Jettons

要从用户存款地址接收Jettons，支付服务需要为发送资金的每位参与者创建其自己的个人地址（存款）。在这种情况下提供的服务涉及执行几个并行过程，包括创建新的存款、扫描区块中的交易、将资金从存款中提到热钱包，等等。

因为一个热钱包可以使用一个Jetton钱包为每种Jetton类型，因此需要为初始化存款创建多个钱包。为了创建大量的钱包，同时用一个种子短语（或私钥）管理它们，创建钱包时需要指定不同的 `subwallet_id`。TON上创建子钱包的功能由v3钱包及更高版本支持。


#### 在 Tonweb 中创建子钱包

```Tonweb
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### 准备

1. 准备一个被接受的Jettons列表：[为处理和初步检查添加新的Jettons](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. 热钱包 [钱包部署](/develop/dapps/asset-processing/#wallet-deployment)

#### 创建存款

1. 接受为用户创建新存款的请求。
2. 根据热钱包种子生成一个新的子钱包（v3R2）地址。[在Tonweb中创建子钱包](#creating-a-subwallet-in-tonweb)
3. 接收地址可以给用户当做用于Jetton存款的地址（这是存款Jetton钱包的所有者地址）。钱包初始化不是必需的，这可以在从存款中提取Jettons时完成。
4. 对于此地址，需要通过Jetton master合约计算Jetton钱包的地址。[如何检索特定用户的Jetton钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)。
5. 将Jetton钱包地址添加到交易监控的地址池中，并保存子钱包地址。

#### 处理交易

:::info 交易确认
TON交易在仅一次确认后就不可逆转。为了最佳用户体验，建议在TON区块链上的交易一旦完成后，不要等待额外的区块。在 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) 中阅读更多信息。
:::

并不总是能够从消息中确定收到的Jettons的确切数量，因为Jetton钱包可能不会发送 `transfer notification`、`excesses`，而且`internal transfer`消息不是标准化的。这意味着不能保证可以解码 `internal transfer` 消息。

因此，要确定钱包中接收到的金额，需要使用get方法请求余额。在为特定区块链上的账户状态请求余额时，使用区块来检索关键数据。[使用Tonweb准备接收区块](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js)。

该过程如下进行：

1. 准备接受区块（通过准备系统接受新区块）。
2. 检索新区块并保存前一个区块ID。
3. 从区块中接收交易。
4. 筛选仅使用来自存款Jetton钱包pool地址的交易。
5. 使用`transfer notification`正文解码消息，以接收更多详细数据，包括
   `sender`地址，Jetton `amount` 和评论。 (参见：[处理传入Jettons](#处理传入-jettons))
6. 如果至少有一个交易包含无法解码的外部消息（消息体不包含用于
   `transfer notification`的操作码和用于`excesses`的操作码）或帐户中没有外部消息，则必须使用当前区块的get方法请求Jetton余额，同时使用前一个区块来计算余额差异。现在由于区块内进行的交易，存款总余额变动被揭示出来。
7. 作为未识别Jetton转账的标识符（没有`transfer notification`），如果有这样一个交易或区块数据存在（如果一个区块内有几个存在），则可以使用交易数据。
8. 现在需要检查以确保存款余额是正确的。如果存款余额足够发起热钱包和现有Jetton钱包之间的转账，则需要提取Jettons以确保钱包余额减少。
9. 从第2步重新开始并重复整个过程。

#### 从存款中提款

不应从每次存款充值时都将存款转至热钱包，因为转账操作会收取TON手续费（以网络gas费支付）。
重要的是确定一定数量的Jettons，这些Jettons是必需的，才能使转账变得划算（从而存入）。

默认情况下，Jetton存款钱包的所有者不会初始化。这是因为没有预定的必须支付存储费。在发送带有
`transfer`正文的消息时，可以部署Jetton存款钱包，然后立即销毁它。为此，工程师必须使用发送消息的特殊机制：128 + 32。


1. 检索标记为要提取到热钱包的存款列表
2. 为每个存款检索保存的所有者地址
3. 然后将消息发送到每个所有者地址（通过将几条这样的消息组合成一批），从高负载钱包附加TON Jetton数量。这是通过添加用于v3R2钱包初始化的费用+发送带有`transfer`正文的消息的费用+任意TON数量的`forward_ton_amount`
（如有必要）。附加的TON数量是通过添加用于v3R2钱包初始化的费用（值）+ 发送带有`transfer`正文的消息的费用（值）+ 任意TON数量的
`forward_ton_amount`（值）（如果需要）来确定的。
4. 当地址上的余额变为非零时，帐户状态发生改变。等待几秒钟，然后检查帐户状态，它很快会从`nonexists`状态变为`uninit`。
5. 对于每个所有者地址（处于`uninit`状态），需要发送一条带有v3R2钱包
   init和带有`transfer`消息的正文进行存入Jetton钱包的外部消息= 128 + 32。对于`transfer`，
   用户必须将热钱包地址指定为`destination`和`response destination`。
   可以添加文字评论以简化转账识别。
6. 可以使用存款地址到热钱包地址的Jetton传送进行验证，通过考虑
   [这里找到的处理传入Jettons信息](#处理传入-jettons)。

### Jetton 提款

要提取Jettons，钱包发送带有`transfer`正文的消息到其对应的Jetton钱包。
然后Jetton钱包将Jettons发送给收件人。本着诚信，重要的是要附上一些TON
作为`forward_ton_amount`（并选择性附上评论到`forward_payload`）以触发`transfer notification`。
参见：[Jetton合约消息布局](#jetton-合约消息布局)

#### 准备

1. 准备用于提款的Jettons列表：[为处理和初步验证添加新的Jettons](#为资产处理和初始验证添加新的-jettons)
2. 启动热钱包部署。推荐使用Highload v2。[钱包部署](/develop/dapps/asset-processing/#wallet-deployment)
3. 使用热钱包地址进行Jetton转账，以初始化Jetton钱包并补充其余额。

#### 处理提款

1. 加载已处理的Jettons列表
2. 检索部署的热钱包的Jetton钱包地址：[如何为给定用户检索Jetton钱包地址](#为给定用户检索-jetton-钱包地址)
3. 检索每个Jetton钱包的Jetton主地址：[如何检索Jetton钱包的数据](#检索特定-jetton-钱包的数据)。
   需要`jetton`参数（实际上是Jetton主合约的地址）。
4. 比较第1步和第3步中来自Jetton主合约的地址。如果地址不匹配，则应报告Jetton地址验证错误。
5. 收到提款请求，实际上指明了Jetton的类型，转移的金额，以及收件人钱包地址。
6. 检查Jetton钱包的余额，以确保有足够的资金进行提款。
7. 使用Jetton `transfer`正文生成消息，并填写所需字段，包括：query_id，发出的金额，
   目的地（收件人的非Jetton钱包地址），response_destination（建议指定用户的热钱包），
   forward_ton_amount（建议将其设置为至少0.05 TON以调用`transfer notification`），`forward_payload`
   （可选，如果需要发送评论）。[Jetton合约消息布局](#jetton-合约消息布局)，
   [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/jettons-withdrawals.js#L69)
   为了检查交易的成功验证，每条消息的`query_id`必须分配一个唯一值。
8. 当使用高负载钱包时，建议收集一批消息，并一次性发送一批以优化费用。
9. 保存外部发出消息的过期时间（这是钱包成功
   处理消息的时间，在此之后，钱包将不再接受该消息）
10. 发送单条消息或多条消息（批量消息）。
11. 检索热钱包帐户中最新未处理的交易列表，并迭代它。
    了解更多：[检查合约的交易](/develop/dapps/asset-processing/#checking-contracts-transactions)，
    [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) 或
    使用Toncenter API `/getTransactions`方法。
12. 查看帐户中的外部消息。
13. 如果存在带有`transfer`操作码的消息，则应解码以检索`query_id`值。
    检索到的`query_id`需要标记为成功发送。
14. 如果扫描到当前交易的处理时间大于
    过期时间，并且未找到带有给定`query_id`的外部消息，
    则请求应（可选）标记为过期，并且应安全地重新发送。
15. 查找帐户中的传入消息。
16. 如果存在使用`excesses`操作码的消息，应解码该消息并检索`query_id`
    值。找到的`query_id`必须标记为成功传送。
17. 转到第5步。未成功发送的过期请求应重新加入提款列表。

## 在链上处理 Jetton

:::info 交易确认
TON交易在仅一次确认后即不可逆转。为了最佳用户体验，建议一旦交易在TON区块链上最终确定后就不再等待其他区块。在[catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)中阅读更多。
:::

通常，接受和处理jettons时，一个负责内部消息的消息处理程序使用`op=0x7362d09c`操作码。

以下是在进行链上jetton处理时必须考虑的一些建议：

1. 使用它们的钱包类型而不是Jetton主合约来识别传入的jettons。换句话说，您的合约应该与特定的jetton钱包进行交互（与使用特定Jetton主合约的某个未知钱包交互）。
2. 当链接Jetton钱包和Jetton主合约时，检查这种连接是否是双向的，即钱包识别主合约，反之亦然。例如，如果您的合约系统从jetton钱包（将其MySuperJetton视为其主合约）收到通知，其转账信息必须向用户显示，然后显示MySuperJetton合约的`symbol`、`name`和`image`
之前，请检查MySuperJetton钱包是否使用正确的合约系统。反过来，如果您的合约系统由于某种原因需要使用MySuperJetton或MySuperJetton主合约发送jettons，请验证钱包X是否是使用相同合约参数的钱包。
另外，在向X发送`transfer`请求之前，请确保它将MySuperJetton识别为其主合约。
3. 去中心化金融（DeFi）的真正力量基于能够像乐高积木一样将协议叠加在彼此之上的能力。举例来说，假设jetton A被换成jetton B，然后又在借贷协议中用作杠杆（当用户提供流动性时），然后用来购买NFT....以此类推。因此，请考虑合约如何能够服务于非链上用户以及链上实体，方法是通过附加token化的价值到转账通知中，添加可以与转账通知一起发送的自定义有效负载。
4. 请注意，并非所有合约都遵循相同的标准。不幸的是，一些jettons可能是敌对的（使用基于攻击的向量）并且仅为攻击毫无戒心的用户而创建。出于安全考虑，如果协议涉及多个合约，请不要创建大量相同类型的jetton钱包。特别是，不要在协议内部的存款合约、保管库合约或用户帐户合约等之间发送jettons。攻击者可能会通过伪造转账通知、jetton数量或有效负载参数来故意干扰合约逻辑。通过在系统中只使用每个jetton的一个钱包（用于所有存款和提款），来降低潜在的攻击风险。
5. 同样，为了减少地址欺骗的机会（例如，使用为jetton A设计的合约发送给jetton B的转账消息），为每个个别jetton创建子合约通常是个好主意。
6. 强烈建议在合约级别使用不可分割的jetton单位。十进制相关逻辑通常用于增强用户界面（UI）的显示，并与链上数值记录无关。
7. 欲了解更多关于[在FunC中安全智能合约编程 by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func)，请随时阅读此资源。建议开发者处理所有智能合约异常，以便在应用开发期间永远不会被忽略。

## Jetton 钱包处理
通常，用于链下jetton处理的所有验证程序都适用于钱包。对于Jetton钱包处理，我们最重要的建议如下：

1. 当钱包从未知的jetton钱包收到转账通知时，信任jetton钱包及其主地址至关重要，因为它可能是恶意伪造的。为了保护自己，请检查Jetton主（主合约）使用其提供的地址，以确保您的验证过程将jetton钱包视为合法的。在您信任钱包并验证其为合法后，您可以允许它访问您的帐户余额和其他钱包内数据。如果Jetton主不识别此钱包，建议不启动或公开您的jetton转账，只显示传入的TON转账（即附加到转账通知的Toncoin）。
2. 实际操作中，如果用户想与Jetton而不是jetton钱包互动。换句话说，用户发送wTON/oUSDT/jUSDT, jUSDC, jDAI而不是`EQAjN...`/`EQBLE...`
   等。通常这意味着，当用户启动jetton转账时，钱包会询问相应的jetton主，哪个由用户拥有的jetton钱包应启动转账请求。重要的是永远不要盲目信任来自主合约（主合约）的这些数据。在将转账请求发送至jetton钱包之前，请始终确保jetton钱包确实属于它声称所属的Jetton主。
3. 请注意，敌对的Jetton Masters/jetton钱包可能会随时间更改其钱包/Masters。因此，对与用户进行交互的任何钱包进行尽职调查和验证至关重要，请在每次使用前检查。
4. 始终确保您以不会与TON转账、系统通知等混淆的方式在界面中显示jettons。即使是`symbol`，`name`和`image`
   参数也可以设计用来误导用户，留下受骗的潜在受害者。有几个实例，恶意jettons被用来冒充TON转账、通知错误、奖励收入或资产冻结公告。
5. 始终警惕可能创建假冒jettons的恶意行为者，提供给用户消除主界面中不需要的jettons的功能总是个好主意。


由[kosrk](https://github.com/kosrk)、[krigga](https://github.com/krigga)、[EmelyanenkoK](https://github.com/EmelyanenkoK/) 和 [tolya-yanot](https://github.com/tolya-yanot/)编写。


## 最佳实践
在此我们提供了一些由TON社区成员创建的jetton代码处理的示例：

<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

```js
const transfer = await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: jettonWalletAddress,
  amount: 0,
  seqno: seqno,
  sendMode: 128 + 32, // 模式128用于携带所有剩余余额的消息；模式32表示如果当前账户的结果余额为零，则必须销毁该账户；
  payload: await jettonWallet.createTransferBody({
    queryId: seqno, // 任意数字
    jettonAmount: jettonBalance, // jetton数量（单位）
    toAddress: new TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS),
    responseAddress: new TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS),
  }),
});
await transfer.send();
```

</TabItem>
<TabItem value="tonutils-go" label="Golang">

```go
client := liteclient.NewConnectionPool()

// 连接到测试网lite服务器
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// 初始化ton api lite连接包装器
api := ton.NewAPIClient(client)

// 账户的种子词，你可以使用任何钱包或使用wallet.NewSeed()方法生成它们
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// 寻找我们的jetton钱包
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// 接收者钱包的地址（非token钱包，只是常规钱包）
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// 你的TON余额必须大于0.05才能发送
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("发送交易...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("交易确认，哈希：", base64.StdEncoding.EncodeToString(tx.Hash))
```

</TabItem>
<TabItem value="TonTools" label="Python">

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# 对于TonCenterClient和LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15)

# 对于所有客户端
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)
```

</TabItem>
</Tabs>



## 参阅

* [支付处理](/develop/dapps/asset-processing/)
* [TON上的NFT处理](/develop/dapps/asset-processing/nfts)
* [TON上的元数据解析](/develop/dapps/asset-processing/metadata)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mass-mint-tools.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mass-mint-tools.mdx
================================================
# 大量造币工具

在推出拥有数百万用户的大型链上项目的时代，峰值负载会导致整个 TON 生态系统的用户体验出现问题。

为避免出现这种情况并确保顺利启动，我们建议使用本页面提供的高负载分配系统。

### 群发器

:::info
9 月代币空投推荐方法
在 Notcoin 和 DOGS 上进行了实战测试
:::

访问：[Masse Sender](https://docs.tonconsole.com/tonconsole/jettons/mass-sending)

技术说明

- 直接分发代币时，项目需要在用户领取时支付 Gas 费用。
- 网络负载低（最新版本已优化）
- 负载自我调节（如果网络上的活动过多，则会减慢分发速度）

### 免铸造 Jetton

访问：[Mintless Jettons](/v3/guidelines/dapps/asset-processing/mintless-jettons)

:::info
  在 HAMSTER 上经过实战检验
:::

技术说明

- 用户在没有交易的情况下申领空投代币
- 项目不从领取中获利
- 将网络负荷降至最低

### TokenTable v4

:::info
  在 Avacoin、DOGS 上进行了实战测试
:::

访问：[www.tokentable.xyz](https://www.tokentable.xyz/)

- 网络负载比群发器高，用户在申请时进行交易
- 项目还可从用户领取中获利
- 项目向 TokenTable 支付设置费用

### Gigadrop

:::info
  在 HAMSTER 上经过实战检验
:::

访问：[gigadrop.io](https://gigadrop.io/)

- 网络负载比群发器高，用户可以在领取时进行交易
- 灵活的负载控制
- 将奖励领取纳入您的应用程序
- 项目还可从用户领取中获利



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mintless-jettons.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mintless-jettons.mdx
================================================
# 免铸造 jetton 处理

## 简介

:::info
读者应熟悉 [支付处理部分](/v3/guidelines/dapps/asset-processing/payments-processing) 和 [jetton 处理](/v3/guidelines/dapps/asset-processing/jettons) 中描述的资产处理基本原则，以便清楚理解。
:::

TON区块链生态系统推出了对Jetton标准的创新扩展，名为 [Mintless Jettons](https://github.com/ton-community/mintless-jetton?tab=readme-ov-file)。

该扩展可实现去中心化的 [Merkle-proof](/v3/documentation/data-formats/tlb/exotic-cells#merkle-proof) 空投，而无需传统的铸币过程。

## 概览

免铸造 jetton  - 是 TON 区块链上标准 jetton 实现（[TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)）的扩展（[TEP-177](https://github.com/ton-blockchain/TEPs/pull/177) 和 [TEP-176](https://github.com/ton-blockchain/TEPs/pull/176)）。

这种实现方式可以向数百万用户进行大规模、去中心化的空投，而不会产生大量成本或给区块链增加过多负载。

### 基本功能

- **可扩展性**：在向大量用户分发代币时，传统的铸币过程可能会耗费大量资源和成本。
- **效率**：通过利用默克尔树，免铸造 jetton 只存储代表所有空投数量的单一哈希值，从而降低了存储需求。
- **方便用户的空投**：用户无需任何准备步骤（如提款或索赔），即可立即使用他们的空投--发送、交换等。它就是这么好用！

## 在链上协议中支持 免铸造 jetton 

由于免铸造 jetton是标准套币的延伸，因此不需要额外的步骤。只需像使用 USDT、NOT、Scale 或 STON 一样与它们互动即可。

## 在钱包应用中支持无 免铸造 jetton 

钱包应用程序在增强用户对免铸造 jetton的体验方面发挥着重要作用：

- **显示未领取的Jettons**: 钱包应该向用户展示他们根据Merkle树数据有资格领取的jettons。
- **自动领取过程**：在发起向外转账时，钱包应自动在 `transfer` 信息的自定义有效载荷中包含必要的 Merkle 证明。

这可以通过以下两种方式实现

- 与 **[自定义有效载荷 API](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain)** 中指定的链外 API 集成：
  - 检查每个 jetton 是否是免铸造的。
  - 如果是免铸造的，请检查钱包的主人是否已经认领。
  - 如果还未认领，则从自定义负载 API 获取数据，并将链下余额添加到链上余额中。
  - 在向外转账时，如果用户尚未领取空投，则从自定义有效载荷 API 获取自定义有效载荷和初始状态，并将其包含在发送至 jetton 钱包的 `transfer` 信息中。

- 自定义 API：
  - 从 jetton 元数据中的 `mintless_merkle_dump_uri` 下载空投的树。
  - 对其进行解析（见下文第 6 节），并通过应用程序接口提供解析结果。

:::info
支持免铸造领取（特别是空投树索引）并非钱包的强制性要求。预计钱包应用程序可能会向 jetton 发行商收取此项服务费用。
:::

## 支持 dApp（DEX/借贷平台）中的免铸造 jetton 

由于认领是在钱包应用程序中自动进行的，因此 dApp 不需要任何特定的逻辑。它们可以使用应用程序接口（如 Tonapi 或 Toncenter）显示还未领取的余额。

为提升用户体验，dApp 可检查用户用于连接 dApp 的钱包应用程序是否支持特定的免铸造 jetton。如果不支持，dApp 可从 jetton 应用程序接口获取空投证明和初始化数据，并将其添加到 dApp 端的 `transfer` 消息中。

## 部署 免铸造 jetton

部署 免铸造 jetton 涉及几个步骤：

1. 准备默克尔树

- 生成一棵 Merkle 树，其中包含所有空投接收者及其各自的金额。
- 计算根 `merkle_hash`.

2. 部署 Jetton 主合约：

- 将 `merkle_hash` 包含在合约存储中。
- 确保合约符合扩展的 Jetton 标准；您可以使用 [免铸造 Jetton 标准实施](https://github.com/ton-community/mintless-jetton) 作为范例。

3. 提供默克尔证明：

- 在链外托管默克尔树数据。
- 实施自定义有效载荷 API，允许钱包获取必要的证明。

4. 更新元数据：

- 根据[元数据标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)，在令牌的元数据中添加 `mintless_merkle_dump_uri` 和 `custom_payload_api_uri`。

5. 请求钱包支持：

- 要求所需的钱包应用程序支持（索引）您的免铸造 Jetton。

按照这些步骤，您就可以部署一个用户可以在日常操作中无缝领取的免铸造 Jetton。

## 检索空投信息

审核空投和核实总供应量包括几个步骤。

### 访问默克尔数据集

- 首先从元数据中提供的 `mintless_merkle_dump_uri` 下载 Merkle 树数据。它可以存储在 TON 存储器、IPFS、Web 2.0 资源或其他方式中。该文件包含作为 BoC 文件的 `HashMap{address -> airdrop_data}`。空投数据 "包括领取金额、可领取开始时间的 Unix 时间戳（`start_from`）和领取关闭的 Unix 时间戳（`expired_at`）。

### 检查完整性

- 这可以通过比较免铸造默克尔转储 cell 哈希值和存储在 jetton minter中的哈希值来实现（后者可以通过 minter 合约的 `get_mintless_airdrop_hashmap_root` 获取方法在链上检索）。

### 核实余额

- 使用默克尔树来验证单个余额，并确保它们的总和与预期的总供应量一致。

## 工具

有几种实用程序可用于上述步骤。

### mintless-proof-generator (from Core)

1. **编译工具**

```bash
git clone https://github.com/ton-blockchain/ton
```

```bash
cd ton
```

```bash
git checkout testnet
```

```bash
mkdir build && cd build
```

```bash
cmake ../
```

```bash
make mintless-proof-generator
```

- 编译后的文件保存为 `build/crypto/mintless-proof-generator`。

2. **运行检查**：

```bash
build/crypto/mintless-proof-generator parse <input-boc> <output-file>
```

此实用程序将打印免铸造 Merkle dump  cell 哈希值，并以 `<address> <amount> <start_from> <expired_at>` 格式（每行一个空投）将所有空投列表存储到 `<output-file>`。

你还可以通过 `mintless-proof-generator make_all_proofs <input-boc> 
 <output-file>` 命令生成所有默克尔证明（需要 `custom_payload_api_uri`）。

### mintless-toolbox (from Tonkeeper)

1. **编译程序**：

```bash
git clone https://github.com/tonkeeper/mintless-toolbox.git
```

```bash
cd mintless-toolbox
```

```bash
make
```

2. **运行检查**：

```bash
./bin/mintless-cli dump <airdrop-filename>
```

- 该实用程序读取空投文件，并以 `address,amount,start_from,expire_at` 格式将其转储到控制台。

通过审核 Merkle 树和合约数据，利益相关者可以验证空投和代币供应的完整性。

## 结论

免铸造 jetton 为 TON 区块链上的大规模代币空投提供了一种高效、可扩展的解决方案。通过扩展标准 Jetton 实现，它们降低了成本和区块链负载，同时保持了安全性和去中心化。在智能合约、钱包应用和 dApp 中支持 免铸造 Jettons 可确保用户获得无缝体验，并促进更广泛的应用。部署和审核免铸造 Jettons 需要仔细实施Merkle树并遵守扩展标准，从而为建立一个强大而透明的代币生态系统做出贡献。

## 另请参见

- [了解免铸造 jetton ：综合指南](https://gist.github.com/EmelyanenkoK/bfe633bdf8e22ca92a5138e59134988f) - 原帖。
- [免铸造 jetton 标准实施](https://github.com/ton-community/mintless-jetton)
- [Jetton 链下有效载荷TEP](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain)
- [Jetton元数据标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing.md
================================================
# TON 元数据解析

元数据标准涵盖了 NFT、NFT 集合和 Jettons，在 TON 增强提案 64 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 中有所描述。

在 TON 上，实体可以有三种类型的元数据：链上、半链上和链下。

- **链上元数据：** 存储在区块链内部，包括名称、属性和图像。
- **链下元数据：** 使用链接存储到链外托管的元数据文件。
- **半链上元数据：** 两者之间的混合体，允许在区块链上存储小字段，如名称或属性，而将图像托管在链外，并仅存储指向它的链接。

## 蛇形数据编码

蛇形编码格式允许部分数据存储在标准cell内，而剩余部分存储在子cell内（以递归方式）。蛇形编码格式必须使用 0x00 字节作为前缀。TL-B 方案：

```
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

当单个cell无法存储的数据超过最大大小时，使用 蛇形格式存储额外数据。这是通过在根cell中存储部分数据，其余部分存储在第一个子cell中，并继续递归进行，直到所有数据都被存储。

以下是 TypeScript 中 蛇形格式编码和解码的示例：

```typescript
export function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127)

  if (chunks.length === 0) {
    return beginCell().endCell()
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell()
  }

  let curCell = beginCell()

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i]

    curCell.storeBuffer(chunk)

    if (i - 1 >= 0) {
      const nextCell = beginCell()
      nextCell.storeRef(curCell)
      curCell = nextCell
    }
  }

  return curCell.endCell()
}

export function flattenSnakeCell(cell: Cell): Buffer {
  let c: Cell | null = cell;

  const bitResult = new BitBuilder();
  while (c) {
    const cs = c.beginParse();
    if (cs.remainingBits === 0) {
      break;
    }

    const data = cs.loadBits(cs.remainingBits);
    bitResult.writeBits(data);
    c = c.refs && c.refs[0];
  }

  const endBits = bitResult.build();
  const reader = new BitReader(endBits);

  return reader.loadBuffer(reader.remaining / 8);
}
```

应该注意，使用 蛇形格式时在根cell中并不总是需要 `0x00` 字节前缀，就像链下 NFT 内容的情况一样。此外，cell中以字节而非位填充，以简化解析。为了避免在其父cell已经写入后再向下一个子cell添加引用的问题，snake cell是以反向顺序构造的。

## 分片编码

分片编码格式使用字典数据结构存储数据，从 chunk_index 到 chunk。分片编码必须使用 `0x01` 字节作为前缀。TL-B 方案：

```
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

以下是使用 TypeScript 解码分片数据的示例：

```typescript
interface ChunkDictValue {
  content: Buffer;
}
export const ChunkDictValueSerializer = {
  serialize(src: ChunkDictValue, builder: Builder) {},
  parse(src: Slice): ChunkDictValue {
    const snake = flattenSnakeCell(src.loadRef());
    return { content: snake };
  },
};

export function ParseChunkDict(cell: Slice): Buffer {
  const dict = cell.loadDict(
    Dictionary.Keys.Uint(32),
    ChunkDictValueSerializer
  );

  let buf = Buffer.alloc(0);
  for (const [_, v] of dict) {
    buf = Buffer.concat([buf, v.content]);
  }
  return buf;
}
```

## NFT 元数据属性

| 属性            | 类型        | 要求 | 描述                                    |
| ------------- | --------- | -- | ------------------------------------- |
| `uri`         | ASCII 字符串 | 可选 | 指向由 "半链上内容布局" 使用的带有元数据的 JSON 文档的 URI。 |
| `name`        | UTF8 字符串  | 可选 | 标识资产。                                 |
| `description` | UTF8 字符串  | 可选 | 描述资产。                                 |
| `image`       | ASCII 字符串 | 可选 | 指向带有图像 mime 类型的资源的 URI。               |
| `image_data`  | 二进制\*     | 可选 | 链上布局的图像的二进制表示，或链下布局的 base64。          |

## Jetton 元数据属性

1. `uri` - 可选。由 "半链上内容布局" 使用。ASCII 字符串。指向带有元数据的 JSON 文档的 URI。
2. `name` - 可选。UTF8 字符串。标识资产。
3. `description` - 可选。UTF8 字符串。描述资产。
4. `image` - 可选。ASCII 字符串。指向带有图像 mime 类型的资源的 URI。
5. `image_data` - 可选。链上布局的图像的二进制表示，或链下布局的 base64。
6. `symbol` - 可选。UTF8 字符串。代币的符号，例如 "XMPL"。使用格式 "你收到了 99 XMPL"。
7. `decimals` - 可选。如未指定，默认使用 9。从 0 到 255 的数字的 UTF8 编码字符串。代币使用的小数位数，例如 8，意味着将代币数量除以 100000000 以获得其用户表示。
8. `amount_style` - 可选。需要由外部应用程序来理解显示jettons数量的格式。

- "n" - jettons数量（默认值）。如果用户拥有 0 小数的 100 个代币，则显示用户拥有 100 个代币
- "n-of-total" - 总发行jettons数量中的jettons数量。例如，totalSupply Jetton = 1000。用户在jettons钱包中有 100 个jettons。例如，必须在用户的钱包中显示为 100 of 1000 或以任何其他文本或图形方式来表现从整体中的特定部分。
- "%" - 从总发行jettons数量中的百分比。例如，totalSupply Jetton = 1000。用户在jettons钱包中有 100 个jettons。例如，应该在用户的钱包中显示为 10%。

9. `render_type` - 可选。需要由外部应用程序来理解jettons属于哪个组，以及如何显示它。

- "currency" - 作为代币显示（默认值）。
- "game" - 游戏显示。应该显示为 NFT，但同时显示jettons的数量，考虑到 `amount_style`。

| 属性             | 类型        | 要求 | 描述                                                                                                                                       |
| -------------- | --------- | -- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `uri`          | ASCII 字符串 | 可选 | 指向用于“半链上内容布局”的元数据的 JSON 文档的 URI。                                                                                                         |
| `name`         | UTF8 字符串  | 可选 | 标识资产。                                                                                                                                    |
| `description`  | UTF8 字符串  | 可选 | 描述资产。                                                                                                                                    |
| `image`        | ASCII 字符串 | 可选 | 指向资源的 URI，该资源具有图像的 mime 类型。                                                                                                              |
| `image_data`   | 二进制\*     | 可选 | 链上布局的图像的二进制表示，或链外布局的 base64。                                                                                                             |
| `symbol`       | UTF8 字符串  | 可选 | 代币的符号 - 例如 "XMPL"，使用形式 "您收到了 99 XMPL"。                                                                                                   |
| `decimals`     | UTF8 字符串  | 可选 | 代币使用的小数位数。如果未指定，默认使用 9。UTF8 编码的字符串，数字在 0 到 255 之间。 - 例如，8，意味着代币数量必须除以 100000000 来获取其用户表示形式。                                              |
| `amount_style` |           | 可选 | 外部应用需要了解显示什么样的 jettons 格式。定义为 *n*，*n-of-total*，*%*。                                                                                      |
| `render_type`  |           | 可选 | 外部应用需要了解 jetton 属于哪个组并如何显示它。"currency" - 作为货币显示（默认值）。“game” - 用于游戏的显示，显示为 NFT，但同时显示 jettons 的数量并考虑 amount_style 的值。 |

> `amount_style` 参数:

- *n* - jettons 的数量（默认值）。如果用户拥有 0 小数的 100 个代币，则显示用户拥有 100 个代币。
- *n-of-total* - 用户拥有的 jettons 数量与发行的总 jettons 数量之比。例如，如果 Jettons 的 totalSupply 是 1000，用户的钱包中有 100 jettons，那么它必须以用户钱包中的 100/1000 或以其他文字或图形方式显示，以展示用户代币与可用代币总量的比例。
- *%* - 从发行的总 jettons 数量中 jettons 的百分比。例如，如果 Jettons 的 totalSupply 是 1000，用户持有 100 jettons，百分比应在用户钱包余额显示 10%（100 ÷ 1000 = 0.1 或 10%）。

> `render_type` 参数:

- *currency* - 作为货币显示（默认值）。
- *game* - 用于游戏的显示，显示为 NFT，但同时显示 jettons 的数量并考虑 `amount_style` 值。

## 解析元数据

要解析元数据，首先必须从区块链获取 NFT 数据。为了更好地理解这个过程，请考虑阅读我们的 TON 资产处理文档章节中的[获取 NFT 数据](/develop/dapps/asset-processing/nfts#getting-nft-data)部分。

在获得链上 NFT 数据后，必须对其进行解析。要执行此过程，必须通过读取构成 NFT 内部结构的第一个字节来确定 NFT 的内容类型。

### 链下

如果元数据字节字符串以 `0x01` 开始，它表示链外 NFT 内容类型。NFT 内容的其余部分使用Snake编码格式解码为 ASCII 字符串。在正确的 NFT URL 被实现，并且检索到 NFT 标识数据后，过程即完成。以下是使用链下 NFT 内容元数据解析的 URL 示例：
`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

URL 内容（从上面直接引用）:

```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

### 链上和半链上

如果元数据字节字符串以 `0x00` 开始，它表示 NFT 使用链上或半链上格式。

我们的 NFT 元数据存储在一个字典中，其中键是属性名称的 SHA256 哈希，值是以Snake或分片格式存储的数据。

为了确定正在使用哪种类型的 NFT，开发者需要读取已知的 NFT 属性，例如 `uri`、`name`、`image`、`description` 和 `image_data`。如果元数据中存在 `uri` 字段，则表示半链上布局。在这种情况下，应该下载 uri 字段中指定的链外内容，并与字典值合并。

链上 NFT 的示例：[EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

半链上 NFT 的示例： [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

链上 Jetton Master 的示例：[EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

链上 NFT 解析器的示例：[stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## NFT 元数据的重要说明

1. 对于 NFT 元数据，`name`、`description` 和 `image`（或 `image_data`）字段是显示 NFT 所必需的。
2. 对于 Jetton 元数据，`name`、`symbol`、`decimals` 和 `image`（或 `image_data`）是主要的。
3. 重要的是要意识到，任何人都可以使用任何 `name`、`description` 或 `image` 创建 NFT 或 Jetton。为避免混淆和潜在的骗局，用户应始终以一种清晰区分于其应用其他部分的方式显示他们的 NFT。恶意 NFT 和 Jettons 可以带有误导性或虚假信息被发送到用户的钱包。
4. 一些项目可能有一个 `video` 字段，链接到与 NFT 或 Jetton 相关联的视频内容。

## 参考文献

- [TON 增强提案 64（TEP-64）](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

## 参阅

- [TON NFT 处理](/develop/dapps/asset-processing/nfts)
- [TON Jetton 处理](/develop/dapps/asset-processing/jettons)
- [首次打造你的 Jetton](/develop/dapps/tutorials/jetton-minter)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/nfts.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/nfts.md
================================================
# TON NFT 处理

## 概述

在本文档部分中，我们将向读者提供对 NFT 的更深刻理解。这将教导读者如何与 NFT 交互，并如何通过在 TON 区块链上发送的交易接收 NFT。

下面提供的信息假定读者已经深入了解了我们之前的[有关 Toncoin 支付处理的部分](/develop/dapps/asset-processing)，同时也假设他们具备通过编程与钱包智能合约交互的基本知识。

## 理解 NFT 的基础

在 TON 区块链上运行的 NFT 由 [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) 和 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 标准表示。

Open Network (TON) 区块链设计考虑了高性能，并包括了一个功能，该功能基于 TON 上的合约地址使用自动分片（用于帮助配置特定 NFT 设计）。为了实现最佳性能，单个 NFT 必须使用自己的智能合约。这使得可以创建任意大小（数量大或小）的 NFT 集合，同时也降低了开发成本和性能问题。然而，这种方法也为 NFT 集合的开发引入了新的考虑因素。

因为每个 NFT 都使用自己的智能合约，所以使用单个合约无法获取 NFT 集合中每个个体化 NFT 的信息。为了检索整个集合以及集合中每个 NFT 的信息，需要分别查询集合合约和每个个体 NFT 合约。出于同样的原因，要跟踪 NFT 转移，需要跟踪特定集合中每个个体化 NFT 的所有交易。

### NFT 集合

NFT 集合是一个用于索引和存储 NFT 内容的合约，并应包含以下接口：

#### 获取方法 `get_collection_data`

```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```

获取关于集合的一般信息，表示如下：

1. `next_item_index` - 如果集合是有序的，此分类指示集合中 NFT 的总数，以及用于铸造的下一个索引。对于无序的集合，`next_item_index` 的值是 -1，意味着集合使用独特机制来跟踪 NFT（例如，TON DNS 域的哈希）。
2. `collection_content` - 一个以 TEP-64 兼容格式表示集合内容的 cell。
3. `owner_address` - 包含集合所有者地址的 slice（此值也可以为空）。

#### 获取方法 `get_nft_address_by_index`

```
(slice nft_address) get_nft_address_by_index(int index)
```

此方法可用于验证 NFT 的真实性，并确认它是否确实属于特定集合。它还使用户能够通过提供其在集合中的索引来检索 NFT 地址。该方法应返回包含与提供的索引对应的 NFT 地址的 slice。

#### 获取方法 `get_nft_content`

```
(cell full_content) get_nft_content(int index, cell individual_content)
```

由于集合充当 NFT 的公共数据存储，因此需要此方法来完善 NFT 内容。要使用此方法，首先需要通过调用相应的 `get_nft_data()` 方法获取 NFT 的 `individual_content`。获取 `individual_content` 后，可以使用 NFT 索引和 `individual_content` cell 调用 `get_nft_content()` 方法。该方法应返回一个包含 NFT 全部内容的 TEP-64 cell。

### NFT 项

基本 NFT 应实现：

#### 获取方法 `get_nft_data()`

```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### 内联消息处理器 `transfer`

```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```

让我们看一下您需要在消息中填充的每个参数：

1. `OP` - `0x5fcc3d14` - 由 TEP-62 标准在转移消息中定义的常量。
2. `queryId` - `uint64` - 用于跟踪消息的 uint64 数字。
3. `newOwnerAddress` - `MsgAddress` - 用于将 NFT 转移至的合约地址。
4. `responseAddress` - `MsgAddress` - 用于转移余额的地址。通常，额外的 TON 数量（例如，1 TON）被发送到 NFT 合约以确保它有足够的资金支付交易费用并创建新的转移（如果需要）。交易中的所有未使用资金都发送到 `responseAddress`。
5. `forwardAmount` - `Coins` - 与转发消息一起使用的 TON 金额（通常设置为 0.01 TON）。由于 TON 使用异步架构，新所有者在成功接收交易后不会立即收到通知。为了通知新所有者，一个内部消息从 NFT 智能合约发送到 `newOwnerAddress`，使用 `forwardAmount` 表示的值。转发消息将以 `ownership_assigned` OP（`0x05138d91`）开始，紧随其后的是之前所有者的地址和 `forwardPayload`（如果存在）。
6. `forwardPayload` - `Slice | Cell` - 作为 `ownership_assigned` 通知消息的一部分发送。

如上所述，这个消息是与 NFT 交互的主要方式，用于在收到上述消息的通知后改变所有权。

例如，这种消息类型通常用于将 NFT Item 智能合约从 Wallet 智能合约发送。当 NFT 智能合约接收到此消息并执行它时，NFT 合约的存储（内部合约数据）将随着所有者 ID 的更新而更新。通过这种方式，NFT Item（合约）正确地更换所有者。此过程详细说明了标准 NFT 转移

在这种情况下，转发金额应设置为适当的值（对于常规钱包为 0.01 TON 或在您希望通过转移 NFT 来执行合约时更多），以确保新所有者接收到关于所有权转移的通知。除了以上述方式通知新所有者，如果不采取这一步骤，新所有者将不会知道他们已收到 NFT。

## 检索 NFT 数据

大多数 SDK 使用现成的处理器来检索 NFT 数据，包括：[tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L38)、[tonutils-go](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)、[pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L771)等。

要接收 NFT 数据，需要使用 `get_nft_data()` 检索机制。例如，我们必须验证以下 NFT 项地址 `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e`(也称为 [foundation.ton](https://tonscan.org/address/EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e) 域)。

首先需要按照如下方式使用 toncenter.com API 执行 get 方法。:

```
curl -X 'POST' \
  'https://toncenter.com/api/v2/runGetMethod' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e",
  "method": "get_nft_data",
  "stack": []
}'
```

响应通常类似于如下内容：

```json
{
  "ok": true,
  "result": {
    "@type": "smc.runResult",
    "gas_used": 1581,
    "stack": [
      // init
      [ "num", "-0x1" ],
      // index
      [ "num", "0x9c7d56cc115e7cf6c25e126bea77cbc3cb15d55106f2e397562591059963faa3" ],
      // collection_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4AW7psr1kCofjDYDWbjVxFa4J78SsJhlfLDEm0U+hltmfDtDcL7" } ],
      // owner_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4ATtS415xpeB1e+YRq/IsbVL8tFYPTNhzrjr5dcdgZdu5BlgvLe" } ],
      // content
      [ "cell", { "bytes": "te6cckEBCQEA7AABAwDAAQIBIAIDAUO/5NEvz/d9f/ZWh+aYYobkmY5/xar2cp73sULgTwvzeuvABAIBbgUGAER0c3/qevIyXwpbaQiTnJ1y+S20wMpSzKjOLEi7Jwi/GIVBAUG/I1EBQhz26hlqnwXCrTM5k2Qg5o03P1s9x0U4CBUQ7G4HAUG/LrgQbAsQe0P2KTvsDm8eA3Wr0ofDEIPQlYa5wXdpD/oIAEmf04AQe/qqXMblNo5fl5kYi9eYzSLgSrFtHY6k/DdIB0HmNQAQAEatAVFmGM9svpAE9og+dCyaLjylPtAuPjb0zvYqmO4eRJF0AIDBvlU=" } ]
    ],
    "exit_code": 0,
    "@extra": "1679535187.3836682:8:0.06118075068995321"
  }
}
```

返回参数：

- `init` - `boolean` - -1 表示 NFT 已初始化并可使用
- `index` - `uint256` - 集合中 NFT 的索引。可以是顺序的或以其他方式派生。例如，这可以表示使用 TON DNS 合约的 NFT 域哈希，而集合应该只在给定索引内拥有唯一的 NFT。
- `collection_address` - `Cell` - 包含 NFT 集合地址的 cell（可以为空）。
- `owner_address` - `Cell` - 包含当前所有者 NFT 地址的 cell（可以为空）。
- `content` - `Cell` - 包含 NFT 项内容的 cell（如果需要解析，需要参考 TEP-64 标准）。

## 检索集合内的所有 NFT

检索集合内所有 NFT 的过程取决于集合是否有序。我们在下面概述了两种过程。

### 有序集合

检索有序集合中的所有 NFT 相对简单，因为已经知道了检索所需的 NFT 数量，且可以轻松获取它们的地址。为了完成这一过程，应按顺序执行以下步骤：

1. 使用 TonCenter API 调用集合合约中的 `get_collection_data` 方法，并从响应中检索 `next_item_index` 值。
2. 使用 `get_nft_address_by_index` 方法，传入索引值 `i`（最初设置为 0），以检索集合中第一个 NFT 的地址。
3. 使用上一步获得的地址检索 NFT 项数据。接下来，验证初始 NFT Collection 智能合约是否与 NFT 项本身报告的 NFT Collection 智能合约一致（以确保集合没有挪用其他用户的 NFT 智能合约）。
4. 使用来自上一步的 `i` 和 `individual_content` 调用 `get_nft_content` 方法。
5. `i` 增加 1 并重复步骤 2-5，直到 `i` 等于 `next_item_index`。
6. 此时，您将拥有来自集合及其各个项目所需的信息。

### 无序集合

检索无序集合中的 NFT 列表更为困难，因为没有固有的方式来获取属于集合的 NFT 的地址。因此，需要解析集合合约中的所有交易并检查所有发出的消息以识别属于集合的 NFT 对应的消息。

为此，必须检索 NFT 数据，并在集合中使用 NFT 返回的 ID 调用 `get_nft_address_by_index` 方法。如果 NFT 合约地址与 `get_nft_address_by_index` 方法返回的地址匹配，这表明该 NFT 属于当前集合。但是，解析集合到所有消息可能是一个漫长的过程，并且可能需要归档节点。

## 在 TON 之外的 NFT 处理

### 发送 NFT

要转移 NFT 所有权，需要从 NFT 所有者的钱包向 NFT 合约发送一条包含转移消息的 cell。这可以通过使用特定语言的库（例如 [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65)、[ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102)、[tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)）来完成。

一旦创建了转移消息，就必须从所有者的钱包合约地址发送到 NFT 项合约地址，并附带足够的 TON 以支付关联的交易费用。

要将 NFT 从另一个用户转移到您自己，需要使用 TON Connect 2.0 或包含 ton:// 链接的简单二维码。例如：
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`

### 接收 NFTs

跟踪发送到某个智能合约地址（即用户的钱包）的 NFT 的过程类似于跟踪支付的机制。这是通过监听钱包中的所有新交易并解析它们来完成的。

下一步可能会根据具体情况而有所不同。让我们下面看几个不同的场景。

#### 等待已知 NFT 地址转移的服务:

- 验证从 NFT 项目智能合约地址发送的新交易。
- 读取消息体的前 32 位作为使用 `uint` 类型，并验证它是否等于 `op::ownership_assigned()`(`0x05138d91`)
- 从消息体中读取接下来的 64 位作为 `query_id`。
- 将消息体中的地址读作 `prev_owner_address`。
- 现在可以管理您的新 NFT 了。

#### 监听所有类型的 NFT 转移的服务:

- 检查所有新交易，忽略那些消息体长度小于 363 位（OP - 32，QueryID - 64，地址 - 267）的交易。
- 重复上面列表中详细介绍的步骤。
- 如果流程工作正常，则需要通过解析 NFT 及其所属的集合来验证 NFT 的真实性。接下来，需要确保 NFT 属于指定的集合。有关此过程的更多信息可以在 `获取所有集合 NFTs` 部分找到。可以通过使用 NFT 或集合的白名单来简化此过程。
- 现在可以管理您的新 NFT 了。

#### 将 NFT 转移绑定到内部交易:

当接收到这种类型的交易时，需要重复前面列表中的步骤。完成此过程后，可以通过在读取 `prev_owner_address` 值之后从消息体中读取一个 uint32 来检索 `RANDOM_ID` 参数。

#### 未发送通知信息的 NFT 发送:

以上概述的所有策略都依赖于服务在 NFT 转移时正确创建转发消息。如果他们不这样做，我们不会知道他们是否已经将 NFT 转移到我们这边。但是，有一些可能的解决方法：

以上概述的所有策略都依赖于服务正确在 NFT 转移中创建转发消息。如果不执行此过程，就无法清楚 NFT 是否已转移到正确的一方。但是，在这种情况下有几种可能的解决方案：

- 如果预计 NFT 数量较少，可以定期解析它们并验证所有者是否已更改为相应的合约类型。
- 如果预计 NFT 数量较多，可以解析所有新块并验证是否有任何调用发送到使用 `op::transfer` 方法的 NFT 目的地。如果启动了这样的交易，可以验证 NFT 的所有者并接收转移。
- 如果在转移过程中无法解析新块，用户可以自行触发 NFT 所有权验证过程。这样，在转移没有通知的 NFT 之后，就可以触发 NFT 所有权验证过程。

## 从智能合约与 NFTs 交互

既然我们已经涵盖了发送和接收 NFTs 的基础，现在让我们探讨如何使用 [NFT Sale](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc) 合约示例从智能合约接收和转移 NFTs。

### 发送 NFTs

在这个例子中，NFT 转移信息位于 [第 67 行](https://www.google.com/url?q=https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc%23L67\\&sa=D\\&source=docs\\&ust=1685436161341866\\&usg=AOvVaw1yuoIzcbEuvqMS4xQMqfXE):

```
var nft_msg = begin_cell()
  .store_uint(0x18, 6)
  .store_slice(nft_address)
  .store_coins(0)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  .store_uint(op::transfer(), 32)
  .store_uint(query_id, 64)
  .store_slice(sender_address) ;; new_owner_address
  .store_slice(sender_address) ;; response_address
  .store_int(0, 1) ;; empty custom_payload
  .store_coins(0) ;; forward amount to new_owner_address
  .store_int(0, 1); ;; empty forward_payload


send_raw_message(nft_msg.end_cell(), 128 + 32);
```

让我们仔细检查每行代码：

- `store_uint(0x18, 6)` - 存储消息标志。
- `store_slice(nft_address)` - 存储消息目标（NFT 地址）。
- `store_coins(0)` - 发送随消息发送的 TON 数量设置为 0，因为使用 `128` [消息模式](/develop/smart-contracts/messages#message-modes) 以其余余额发送消息。要发送非用户全部余额的金额，必须更改此数字。请注意，它应足够大以支付gas费以及任何转发金额。
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)` - 剩余构成消息头的部分被留空。
- `store_uint(op::transfer(), 32)` - 这是 msg_body 的开始。在这里，我们首先使用 transfer OP 代码，以便接收者理解其转移所有权消息。
- `store_uint(query_id, 64)` - 存储查询 ID。
- `store_slice(sender_address) ;; new_owner_address` - 第一个存储的地址是用于转移 NFTs 和发送通知的地址。
- `store_slice(sender_address) ;; response_address` - 第二个存储的地址是响应地址。
- `store_int(0, 1)` - 自定义有效载荷标志设置为 0，表示不需要自定义有效载荷。
- `store_coins(0)` - 随消息转发的 TON 数量。在这个例子中设置为 0，但是，建议将此值设置为更高的金额（如至少 0.01 TON），以便创建转发消息并通知新所有者他们已经收到了 NFT。金额应足以覆盖任何相关费用和成本。
- `.store_int(0, 1)` - 自定义有效载荷标志。如果您的服务应该作为 ref 传递有效载荷，则必须将其设置为 `1`。

### 接收 NFTs

一旦我们发送了 NFT，就至关重要的是确定新所有者何时收到了它。一个好的例子可以在同一个 NFT 销售智能合约中找到：

```
slice cs = in_msg_full.begin_parse();
int flags = cs~load_uint(4);

if (flags & 1) {  ;; ignore all bounced messages
    return ();
}
slice sender_address = cs~load_msg_addr();
throw_unless(500, equal_slices(sender_address, nft_address));
int op = in_msg_body~load_uint(32);
throw_unless(501, op == op::ownership_assigned());
int query_id = in_msg_body~load_uint(64);
slice prev_owner_address = in_msg_body~load_msg_addr();
```

让我们再次检查每行代码：

- `slice cs = in_msg_full.begin_parse();` - 用于解析传入消息。
- `int flags = cs~load_uint(4);` - 用于从消息的前 4 位加载标志。
- `if (flags & 1) { return (); } ;; 忽略所有弹回消息` - 用于验证消息是否没有被弹回。对于所有您的传入消息，如果没有理由反之，就很重要进行此过程。弹回的消息是那些在尝试接收交易时遇到错误并被退回给发件人的消息。
- `slice sender_address = cs~load_msg_addr();` - 接下来加载消息发送者。在这种特殊情况下，通过使用 NFT 地址完成。
- `throw_unless(500, equal_slices(sender_address, nft_address));` - 用于验证发送者确实是应该通过合约转移的 NFT。从智能合约解析 NFT 数据相当困难，因此在大多数情况下，NFT 地址在合约创建时预定义。
- `int op = in_msg_body~load_uint(32);` - 加载消息 OP 代码。
- `throw_unless(501, op == op::ownership_assigned());` - 确保接收的 OP 代码与所有权分配的常量值匹配。
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - 从传入消息体中提取的前所有者地址，并加载到 `prev_owner_address`  slice 变量中。如果前所有者选择取消合约并将 NFT 归还给他们，这一点可能很有用。

现在我们已经成功地解析并验证了通知消息，我们可以继续我们的业务逻辑，这用于启动销售智能合约（它旨在处理 NFT 物品业务销售过程，例如 NFT 拍卖，如 getgems.io）



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/payments-processing.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/payments-processing.md
================================================

import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 付款处理

本页面包含了关于在TON区块链上处理（发送和接收）数字资产的概览和具体细节。

:::tip
建议在阅读本教程之前先熟悉一下 [资产处理概述](/v3/documentation/dapps/assets/overview)。
:::

## 钱包智能合约

TON 网络上的钱包智能合约允许外部参与者与区块链实体互动。

- 验证所有者身份：拒绝试图代表非所有者处理或支付费用的请求。
- 提供重放保护：防止重复执行同一请求，如向另一个智能合约发送资产。
- 启动与其他智能合约的任意交互。

第一个挑战的标准解决方案是公钥加密法：`钱包` 存储公钥，并检查传入的请求信息是否由相应的私钥签名，而该私钥只有所有者知道。

第三个挑战的解决方案也很常见；一般来说，请求包含一个完整的内部信息，由 `钱包` 发送到网络。不过，对于重放保护，有几种不同的方法。

### 自托管服务

基于 Seqno 的钱包使用最简单的方法对消息进行排序。每条信息都有一个特殊的 "seqno "整数，必须与存储在 `wallet`智能合约中的计数器一致。`钱包` 会在每次请求时更新计数器，从而确保一个请求不会被处理两次。有几个 `钱包` 版本在公开可用的方法上有所不同：可以通过过期时间限制请求，也可以使用相同的公钥拥有多个钱包。不过，这种方法的一个固有要求是逐个发送请求，因为 `seqno` 序列中的任何间隙都会导致无法处理所有后续请求。

### 高负载钱包

这种 `钱包` 类型采用的方法是在智能合约存储中存储已处理的未过期请求的标识符。在这种方法中，任何请求都会被检查是否与已处理的请求重复，如果检测到重复请求，就会丢弃。由于过期，合约可能不会永久存储所有请求，但会删除因过期限制而无法处理的请求。向该 `钱包` 发出的请求可以并行发送，不会受到干扰，但这种方法需要对请求处理进行更复杂的监控。

### 社区制作

要通过 TonLib 部署钱包，您需要

1. [创建钱包，获取余额，进行转账](https://github.com/ton-community/ton#usage)
2. 形成与已启用的`钱包`之一相对应的 [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62) 结构。目前可用的有：`wallet.v3`、`wallet.v4`、`wallet.highload.v1`、`wallet.highload.v2`。
3. 通过 [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283) 方法计算新的 `wallet` 智能合约的地址。我们建议使用默认版本`0`，并在基链`workchain=0`中部署钱包，以降低处理和存储费用。
4. 向计算出的地址发送一些 Toncoin。请注意，您需要在 `non-bounce` 模式下发送，因为该地址还没有代码，无法处理收到的信息。`non-bounce` 标志表示即使处理失败，也不会通过退回消息返还钱款。我们不建议在其他交易中使用 `non-bounce` 标记，尤其是在携带大额资金时，因为退回机制在一定程度上可以防止错误。
5. 形成所需的 [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154)，例如只用于部署的 `actionNoop`。然后使用 [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) 和 [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) 启动与区块链的交互。
6. 使用 [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288) 方法在几秒钟内检查合约。

:::tip
在[钱包教程](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet)中阅读更多内容。
:::

### 社区制作

使用psylopunk/pytonlib（The Open Network的简单Python客户端）：

<Tabs groupId="address-examples">

  <TabItem value="Tonweb" label="JS (Tonweb)">

```js
  const TonWeb = require("tonweb")
  TonWeb.utils.Address.isValid('...')
```

  </TabItem>
  <TabItem value="GO" label="tonutils-go">

```python
package main

import (
  "fmt"
  "github.com/xssnick/tonutils-go/address"
)

if _, err := address.ParseAddr("EQCD39VS5j...HUn4bpAOg8xqB2N"); err != nil {
  return errors.New("invalid address")
}
```

  </TabItem>
  <TabItem value="Java" label="Ton4j">

```javascript
try {
  Address.of("...");
  } catch (e) {
  // not valid address
}
```

  </TabItem>
  <TabItem value="Kotlin" label="ton-kotlin">

```javascript
  try {
    AddrStd("...")
  } catch(e: IllegalArgumentException) {
      // not valid address
  }
```

  </TabItem>
</Tabs>

:::tip
[智能合约地址](/v3/documentation/smart-contracts/addresses) 页面上的完整地址描述。
:::

## TON 上的数字资产

### 检查合约交易

可以使用 [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) 获取合约的交易。该方法允许从某个 `last_transaction_id`和更早的交易中获取 10 个交易。要处理所有收到的交易，应遵循以下步骤：

1. 可以使用 [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get) 获取最新的 `last_transaction_id`。
2. 应通过 `getTransactions` 方法加载10笔交易。
3. 处理输入信息中来源不为空且目的地等于账户地址的交易。
4. 应加载接下来的 10 笔交易，然后重复步骤 2、3、4、5，直到处理完所有收到的交易。

### 检索传入/传出交易

可以在事务处理过程中跟踪消息流。由于消息流是一个 DAG，因此只需使用 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法获取当前事务，并使用 [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) 通过 `out_msg` 找到传入事务，或使用 [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get) 通过 `in_msg` 找到传出事务。

<Tabs groupId="example-outgoing-transaction">
<TabItem value="JS" label="JS">

```ts
import { TonClient, Transaction } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { CommonMessageInfoInternal } from '@ton/core';

async function findIncomingTransaction(client: TonClient, transaction: Transaction): Promise<Transaction | null> {
  const inMessage = transaction.inMessage?.info;
  if (inMessage?.type !== 'internal') return null;
  return client.tryLocateSourceTx(inMessage.src, inMessage.dest, inMessage.createdLt.toString());
}

async function findOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<Transaction[]> {
  const outMessagesInfos = transaction.outMessages.values()
    .map(message => message.info)
    .filter((info): info is CommonMessageInfoInternal => info.type === 'internal');
  
  return Promise.all(
    outMessagesInfos.map((info) => client.tryLocateResultTx(info.src, info.dest, info.createdLt.toString())),
  );
}

async function traverseIncomingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const inTx = await findIncomingTransaction(client, transaction);
  // now you can traverse this transaction graph backwards
  if (!inTx) return;
  await traverseIncomingTransactions(client, inTx);
}

async function traverseOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const outTxs = await findOutgoingTransactions(client, transaction);
  // do smth with out txs
  for (const out of outTxs) {
    await traverseOutgoingTransactions(client, out);
  }
}

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({
    endpoint,
    apiKey: '[API-KEY]',
  });
  
  const transaction: Transaction = ...; // Obtain first transaction to start traversing
  await traverseIncomingTransactions(client, transaction);
  await traverseOutgoingTransactions(client, transaction);
}

main();
```

</TabItem>
</Tabs>

### 基于 Seqno 的钱包

:::tip
从 [TMA USDT 支付演示](https://github.com/ton-community/tma-usdt-payments-demo) 了解支付处理的基本示例
:::

1. 服务应部署一个 `钱包`，并保持其资金充足，以防止因存储费用而导致合约毁坏。请注意，存储费一般每年少于 1  Toncoin 。
2. 服务应从用户处获取 `destination_address` 和可选的 `comment`。请注意，在此期间，我们建议禁止未完成的、具有相同（`destination_address`, `value`, `comment`）设置的外发付款，或适当安排这些付款的时间；这样，只有在上一笔付款得到确认后，才会启动下一笔付款。
3. 用`comment`作为文本形成 [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103)。
4. 形成包含 `destination_address`、空`public_key`、`amount`和`msg.dataText`的[msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113)。
5. 形成包含一组传出消息的[Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154)。
6. 使用 [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) 和 [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) 查询向外发送付款。
7. 服务应定期轮询  `wallet` 合约的 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法。通过（`destination_address`, `value`, `comment`）匹配已确认的交易和已发出的付款，可以将付款标记为已完成；检测并向用户显示相应的交易哈希值和逻辑时间。
8. 对 `v3` 高负载钱包的请求默认有 60 秒的过期时间。在此时间之后，未处理的请求可以安全地重新发送到网络（参见步骤 3-6）。

:::caution
如果附加的 `value` 太小，交易会因错误 `cskip_no_gas` 而中止。在这种情况下， Toncoin 将被成功转移，但另一方的逻辑不会被执行（TVM 甚至不会启动）。关于 gas 限制，您可以在 [此处](/v3/documentation/network/configs/blockchain-configs#param-20and-21) 阅读更多信息。
:::

### 高负载钱包

可以看出，要获取更多的交易信息，用户必须通过 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 函数扫描区块链。
发送信息后不可能立即获取交易 ID，因为交易必须首先由区块链网络确认。
要了解所需的流水线，请仔细阅读 [发送付款](/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments)，尤其是第 7 点。

## 与区块链的互动

可以通过TonLib在TON区块链上进行基本操作。TonLib是一个共享库，可以与TON节点一起编译，并通过所谓的lite服务器（轻客户端服务器）公开API以与区块链互动。TonLib通过检查所有传入数据的证明采取无信任方法；因此，不需要可信数据提供者。TonLib的可用方法列在[TL方案中](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234)。它们可以通过像[pyTON](https://github.com/EmelyanenkoK/pyTON)或[tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2)（技术上这些是`tonlibjson`的包装器）这样的包装器或通过`tonlib-cli`使用共享库。

1. 部署 `wallet` 合约。
2. 为每个用户生成一个唯一的 **`invoice`（发票）**。使用 uuid32 的字符串表示形式即可满足需求。
3. 应指示用户向服务的 `wallet`合约发送 Toncoin，并附上 "发票 "作为注释。
4. 服务应定期轮询 `wallet`合约的 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法。
5. 对于新交易，应提取收到的信息，将 `comment` 与数据库匹配，并将 **收到的信息值** 存入用户账户。

要通过TonLib部署钱包，需要：

无论如何，一般来说，消息带给合约的金额可以计算为传入消息的价值减去传出消息的价值总和减去费用：`value_{in_msg} - SUM(value_{out_msg}) - fee`。技术上，交易表示包含三个不同的带有 `fee` 名称的字段：`fee`、 `storage_fee` 和 `other_fee`，即总费用、与存储成本相关的费用部分和与交易处理相关的费用部分。只应使用第一个。

### 发票 (invoice) 与 TON Connect

最适合需要在一个会话中签署多个付款/交易或需要与钱包保持一段时间连接的应用程序。

- ✅ 与钱包有永久的通信渠道，用户地址信息

- ✅ 用户只需扫描一次 QR 码

- ✅ 可以了解用户是否在钱包中确认了交易，通过返回的 BOC 跟踪交易。

- ✅ 可为不同平台提供现成的 SDK 和 UI 工具包

- ❌ 如果只需发送一笔付款，用户需要执行两个操作：连接钱包和确认交易。

- ❌ 整合比 ton:// 链接更复杂

<Button href="/v3/guidelines/ton-connect/overview/"
colorType="primary" sizeType={'lg'}>

无论如何，一般来说，消息带给合约的金额可以计算为传入消息的价值减去传出消息的价值总和减去费用：`value_{in_msg} - SUM(value_{out_msg}) - fee`。技术上，交易表示包含三个不同的带有`费用`名称的字段：`费用`、`存储费用`和`其他费用`，即总费用、与存储成本相关的费用部分和与交易处理相关的费用部分。只应使用第一个。

</Button>

### 带有 ton:// 链接的发票

:::warning
Ton 链接已被弃用，请避免使用该链接
:::

如果您需要轻松集成简单的用户流程，则适合使用 ton:// 链接。
最适合一次性付款和发票。

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ 易于集成

- ✅ 无需连接钱包

- ❌ 用户每次付款都需要扫描新的 QR 码

- ❌ 无法跟踪用户是否已签署交易

- ❌ 没有关于用户地址的信息

- ❌ 在无法点击此类链接的平台上需要采用变通方法（例如，Telegram 桌面客户端的机器人消息）。

要基于附加评论接受支付，服务应：

## 浏览器

区块链浏览器是 https://tonscan.org。

要在资源管理器中生成交易链接，服务需要获取逻辑时间、交易哈希值和账户地址（通过 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法获取了逻辑时间和交易哈希值的账户地址）。然后，https://tonscan.org 和 https://explorer.toncoin.org/ 可按以下格式显示该交易的页面：

如果您需要为简单用户流程进行简便集成，使用ton://链接是合适的。
最适合一次性支付和发票。

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

请注意，tonviewer 和 tonscan 支持外部信息哈希值，而不是资源管理器中链接的事务哈希值。
当您生成外部信息并希望即时生成链接时，这将非常有用。
有关事务和消息哈希值的更多信息 [此处](/v3/guidelines/dapps/cookbook#how-to-find-transaction-or-message-hash)

## 最佳实践

### 创建钱包

<Tabs groupId="example-create_wallet">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [创建钱包 + 获取钱包地址](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [创建钱包 + 获取余额](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [创建钱包 + 获取余额](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [创建钱包 + 获取钱包地址](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)
- **yungwine/pytoniq:**

```py
import asyncio

from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


async def main():
    provider = LiteBalancer.from_mainnet_config(2)
    await provider.start_up()

    mnemonics, wallet = await WalletV4R2.create(provider)
    print(f"{wallet.address=} and {mnemonics=}")

    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>

### 为不同分片创建钱包

当负载过重时，TON区块链可能会分裂成 [分片](/v3/documentation/smart-contracts/shards/shards-intro)。在 Web3 世界中，分片可以简单地比喻为网段。

正如我们在 Web2 世界中分发服务基础设施时尽可能靠近终端用户一样，在 TON 中，我们可以将合约部署在与用户钱包或任何其他与之交互的合约相同的分片中。

例如，一个为未来的空投服务向用户收取费用的 DApp 可能会为每个分片准备单独的钱包，以提高高峰负载日的用户体验。为了达到最高的处理速度，您需要为每个分片部署一个收集器钱包。

合约的分片前缀 `SHARD_INDEX` 由其地址哈希值的前 4 位定义。
为了将钱包部署到特定的分片，可以使用基于以下代码片段的逻辑：

```javascript

import { NetworkProvider, sleep } from '@ton/blueprint';
import { Address, toNano } from "@ton/core";
import {mnemonicNew, mnemonicToPrivateKey} from '@ton/crypto';
import { WalletContractV3R2 } from '@ton/ton';

export async function run(provider?: NetworkProvider) {
  if(!process.env.SHARD_INDEX) {
    throw new Error("Shard index is not specified");
  }

    const shardIdx = Number(process.env.SHARD_INDEX);
    let testWallet: WalletContractV3R2;
    let mnemonic:  string[];
    do {
        mnemonic   = await mnemonicNew(24);
        const keyPair = await mnemonicToPrivateKey(mnemonic);
        testWallet = WalletContractV3R2.create({workchain: 0, publicKey: keyPair.publicKey});
    } while(testWallet.address.hash[0] >> 4 !== shardIdx);

    console.log("Mnemonic for shard found:", mnemonic);
    console.log("Wallet address:",testWallet.address.toRawString());
}

if(require.main === module) {
run();
}

```

如果是钱包合约，可以使用 `subwalletId` 代替助记符，但 [钱包应用程序](https://ton.org/wallets) 不支持 `subwalletId`。

部署完成后，您可以使用以下算法进行处理：

1. 用户来到 DApp 页面并请求操作。
2. DApp 挑选离用户最近的钱包（通过 4 位前缀匹配）
3. DApp 为用户提供付费载荷，将其费用发送到所选钱包。

这样，无论当前的网络负载如何，您都能提供最佳的用户体验。

### 浏览器

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [处理 Toncoin 存款](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [处理 Toncoin 存款多钱包](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**

<details>
<summary>检查存款</summary>

```go
package main 

import (
	"context"
	"encoding/base64"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

const (
	num = 10
)

func main() {
	client := liteclient.NewConnectionPool()
	err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client, ton.ProofCheckPolicyFast).WithRetry()

	accountAddr := address.MustParseAddr("0QA__NJI1SLHyIaG7lQ6OFpAe9kp85fwPr66YwZwFc0p5wIu")

	// we need fresh block info to run get methods
	b, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	// we use WaitForBlock to make sure block is ready,
	// it is optional but escapes us from liteserver block not ready errors
	res, err := api.WaitForBlock(b.SeqNo).GetAccount(context.Background(), b, accountAddr)
	if err != nil {
		log.Fatal(err)
	}

	lastTransactionId := res.LastTxHash
	lastTransactionLT := res.LastTxLT

	headSeen := false

	for {
		trxs, err := api.ListTransactions(context.Background(), accountAddr, num, lastTransactionLT, lastTransactionId)
		if err != nil {
			log.Fatal(err)
		}

		for i, tx := range trxs {
			// should include only first time lastTransactionLT
			if !headSeen {
				headSeen = true
			} else if i == 0 {
				continue
			}

			if tx.IO.In == nil || tx.IO.In.Msg.SenderAddr().IsAddrNone() {
				// external message should be omitted
				continue
			}

      if tx.IO.Out != nil {
				// no outgoing messages - this is incoming Toncoins
				continue
			}

			// process trx
			log.Printf("found in transaction hash %s", base64.StdEncoding.EncodeToString(tx.Hash))
		}

		if len(trxs) == 0 || (headSeen && len(trxs) == 1) {
			break
		}

		lastTransactionId = trxs[0].Hash
		lastTransactionLT = trxs[0].LT
	}
}
```

</details>
</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

<summary>检查存款</summary>

```python
import asyncio

from pytoniq_core import Transaction

from pytoniq import LiteClient, Address

MY_ADDRESS = Address("kf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM_BP")


async def main():
    client = LiteClient.from_mainnet_config(ls_i=0, trust_level=2)

    await client.connect()

    last_block = await client.get_trusted_last_mc_block()

    _account, shard_account = await client.raw_get_account_state(MY_ADDRESS, last_block)
    assert shard_account

    last_trans_lt, last_trans_hash = (
        shard_account.last_trans_lt,
        shard_account.last_trans_hash,
    )

    while True:
        print(f"Waiting for{last_block=}")

        transactions = await client.get_transactions(
            MY_ADDRESS, 1024, last_trans_lt, last_trans_hash
        )
        toncoin_deposits = [tx for tx in transactions if filter_toncoin_deposit(tx)]
        print(f"Got {len(transactions)=} with {len(toncoin_deposits)=}")

        for deposit_tx in toncoin_deposits:
            # Process toncoin deposit transaction
            print(deposit_tx.cell.hash.hex())

        last_trans_lt = transactions[0].lt
        last_trans_hash = transactions[0].cell.hash


def filter_toncoin_deposit(tx: Transaction):
    if tx.out_msgs:
        return False

    if tx.in_msg:
        return False

    return True


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>
</Tabs>

### 提取 Toncoin （发送 toncoin ）

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [分批从钱包中提取 Toncoin](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [从钱包中提取 Toncoin](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [从钱包中提取 Toncoin](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [从钱包中提取 Toncoin](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

```python
import asyncio

from pytoniq_core import Address
from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


MY_MNEMONICS = "one two tree ..."
DESTINATION_WALLET = Address("Destination wallet address")


async def main():
    provider = LiteBalancer.from_mainnet_config()
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider, MY_MNEMONICS)

    await wallet.transfer(DESTINATION_WALLET, 5)
    
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>

### 获取合约交易

<Tabs groupId="example-get_transactions">
<TabItem value="JS" label="JS">

- **ton-community/ton:**
  - [使用 getTransaction 方法的客户端](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [获取交易](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**
  - [获取交易](https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)

</TabItem>

</Tabs>

## SDK

各种编程语言（JS、Python、Golang 等）的 SDK 完整列表 [此处](/v3/guidelines/dapps/apis-sdks/sdk)。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/cookbook.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/cookbook.md
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TON 开发手册

在产品开发过程中，关于如何与不同的合约进行交互，常常会出现各种问题。

此文档旨在收集所有开发者的最佳实践，并与大家分享。

### 如何转换（用户友好型 \<-> 原始格式）、组装和从字符串提取地址？

在 TON 上，根据服务的不同，地址可以以两种格式出现：`用户友好型` 和 `原始格式`。

```bash
用户友好型: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
原始格式: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

用户友好型地址采用 base64 编码，而原始格式地址采用 hex 编码。在原始格式中，地址所在的工作链单独写在“:”字符之前，字符的大小写不重要。

要从字符串中获取地址，可以使用以下代码：

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address } from "@ton/core";


const address1 = Address.parse('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');
const address2 = Address.parse('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e');

// toStrings 参数：urlSafe, bounceable, testOnly
// 默认值：true, true, false

console.log(address1.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address1.toRawString()); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

console.log(address2.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address2.toRawString()); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require('tonweb');

const address1 = new TonWeb.utils.Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');
const address2 = new TonWeb.utils.Address('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e');

// toString 参数：isUserFriendly, isUrlSafe, isBounceable, isTestOnly

console.log(address1.toString(true, true, true)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address1.toString(isUserFriendly = false)); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

console.log(address1.toString(true, true, true)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address2.toString(isUserFriendly = false)); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"fmt"
	"github.com/xssnick/tonutils-go/address"
)

// 在这里，我们需要手动实现对原始地址的处理，因为库不支持。

func main() {
	address1 := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF")
	address2 := mustParseRawAddr("0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e", true, false)

	fmt.Println(address1.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	fmt.Println(printRawAddr(address1)) // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

	fmt.Println(address2.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	fmt.Println(printRawAddr(address2)) // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
}

func mustParseRawAddr(s string, bounceable bool, testnet bool) *address.Address {
	addr, err := parseRawAddr(s, bounceable, testnet)
	if err != nil {
		panic(err)
	}
	return addr
}

func parseRawAddr(s string, bounceable bool, testnet bool) (*address.Address, error) {
	var (
		workchain int32
		data      []byte
	)
	_, err := fmt.Sscanf(s, "%d:%x", &workchain, &data)
	if err != nil {
		return nil, err
	}
	if len(data) != 32 {
		return nil, fmt.Errorf("地址长度必须为 32 字节")
	}

	var flags byte = 0b00010001
	if !bounceable {
		setBit(&flags, 6)
	}
	if testnet {
		setBit(&flags, 7)
	}

	return address.NewAddress(flags, byte(workchain), data), nil
}

func printRawAddr(addr *address.Address) string {
	return fmt.Sprintf("%v:%x", addr.Workchain, addr.Data())
}

func setBit(n *byte, pos uint) {
	*n |= 1 << pos
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
from pytoniq_core import Address

address1 = Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')
address2 = Address('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e')

# to_str() 参数：is_user_friendly, is_url_safe, is_bounceable, is_test_only

print(address1.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address1.to_str(is_user_friendly=False))  # 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

print(address2.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address2.to_str(is_user_friendly=False))  # 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
</Tabs>

### 如何获得不同类型的地址并确定地址类型？

地址有三种格式：**可弹回的（bounceable）**、**不可弹回的（non-bounceable）**和**测试网络的（testnet）**。可以通过查看地址的第一个字母来轻松理解，因为它是第一个字节（8位）包含的标志根据 [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses)：

| 字母 | 二进制形式 | 可弹回 | 测试网络 |
|:----:|:---------:|:------:|:-------:|
|  E   |  00010001 |   是   |   否    |
|  U   |  01010001 |   否   |   否    |
|  k   |  10010001 |   是   |   是    |
|  0   |  11010001 |   否   |   是    |

值得注意的是，在 base64 编码中，每个字符代表了 **6位** 的信息。正如你所观察到的，在所有情况下，最后 2 位保持不变，所以在这种情况下，我们可以关注第一个字母。如果它们改变了，会影响地址中的下一个字符。

此外，在某些库中，你可能会注意到一个称为“url safe”的字段。事实是，base64 格式不是 url 安全的，这意味着在链接中传输这个地址时可能会出现问题。当 urlSafe = true 时，所有的 `+` 符号被替换为 `-`，所有的 `/` 符号被替换为 `_`。您可以使用以下代码获得这些地址格式：

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address } from "@ton/core";

const address = Address.parse('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');

// toStrings 参数：urlSafe, bounceable, testOnly
// 默认值：true, true, false

console.log(address.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHFэ
console.log(address.toString({urlSafe: false})) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
console.log(address.toString({bounceable: false})) // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
console.log(address.toString({testOnly: true})) // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
console.log(address.toString({bounceable: false, testOnly: true})) // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require('tonweb');

const address = new TonWeb.utils.Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');

// toString 参数：isUserFriendly, isUrlSafe, isBounceable, isTestOnly

console.log(address.toString(true, true, true, false)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address.toString(true, false, true, false)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
console.log(address.toString(true, true, false, false)); // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
console.log(address.toString(true, true, true, true)); // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
console.log(address.toString(true, true, false, true)); // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"fmt"
	"github.com/xssnick/tonutils-go/address"
)

func main() {
	address := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF")

	fmt.Println(address.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	address.SetBounce(false)
	fmt.Println(address.String()) // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
	address.SetBounce(true)
	address.SetTestnetOnly(true) // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
	fmt.Println(address.String())
	address.SetBounce(false) // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
	fmt.Println(address.String())
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
from pytoniq_core import Address

address = Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')

# to_str() 参数：is_user_friendly, is_url_safe, is_bounceable, is_test_only

print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True, is_test_only=False))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=False, is_test_only=False))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
print(address.to_str(is_user_friendly=True, is_bounceable=False, is_url_safe=True, is_test_only=False))  # UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True, is_test_only=True))  # kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
print(address.to_str(is_user_friendly=True, is_bounceable=False, is_url_safe=True, is_test_only=True))  # 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
</Tabs>

### 如何发送标准 TON 转账消息？

要发送标准TON转账消息，首先需要打开您的钱包合约，之后获取您的钱包序列号（seqno）。只有完成这些步骤之后，您才能发送您的TON转账。请注意，如果您使用的是非V4版本的钱包，您需要将WalletContractV4重命名为WalletContract{您的钱包版本}，例如，WalletContractV3R2。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
});

// 将助记词转换成私钥
let mnemonics = "word1 word2 ...".split(" ");
let keyPair = await mnemonicToPrivateKey(mnemonics);

// 创建钱包合约
let workchain = 0; // 通常你需要一个workchain 0
let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
let contract = client.open(wallet);

// 创建转账
let seqno: number = await contract.getSeqno();
await contract.sendTransfer({
  seqno,
  secretKey: keyPair.secretKey,
  messages: [internal({
    value: '1',
    to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
    body: '转账示例内容',
  })]
});
```

</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

```kotlin
// 设置liteClient
val context: CoroutineContext = Dispatchers.Default
val json = Json { ignoreUnknownKeys = true }
val config = json.decodeFromString<LiteClientConfigGlobal>(
    URI("https://ton.org/global-config.json").toURL().readText()
)
val liteClient = LiteClient(context, config)

val WALLET_MNEMONIC = "word1 word2 ...".split(" ")

val pk = PrivateKeyEd25519(Mnemonic.toSeed(WALLET_MNEMONIC))
val walletAddress = WalletV3R2Contract.address(pk, 0)
println(walletAddress.toString(userFriendly = true, bounceable = false))

val wallet = WalletV3R2Contract(liteClient, walletAddress)
runBlocking {
    wallet.transfer(pk, WalletTransfer {
        destination = AddrStd("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
        bounceable = true
        coins = Coins(100000000) // 1 ton 的 nanotons
        messageData = org.ton.contract.wallet.MessageData.raw(
            body = buildCell {
                storeUInt(0, 32)
                storeBytes("Comment".toByteArray())
            }
        )
        sendMode = 0
    })
}
```
</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, WalletV4R2
import asyncio

mnemonics = ["你的", "助记词", "在这里"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    DESTINATION_ADDRESS = "目的地址在这里"


    await wallet.transfer(destination=DESTINATION_ADDRESS, amount=int(0.05*1e9), body="转账示例内容")
	await client.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>

### 如何计算用户的 Jetton 钱包地址？

为了计算用户的Jetton钱包地址，我们需要调用jetton主合约的"get_wallet_address" get方法，并实际传入用户地址。对于这项任务，我们可以轻松使用JettonMaster的getWalletAddress方法或者自行调用主合约。

<Tabs groupId="code-examples">
<TabItem value="user-jetton-wallet-method-js" label="使用getWalletAddress方法">

```js
const { Address, beginCell } = require("@ton/core")
const { TonClient, JettonMaster } = require("@ton/ton")

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

const jettonMasterAddress = Address.parse('...') // 例如 EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE
const userAddress = Address.parse('...')

const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress))
console.log(await jettonMaster.getWalletAddress(userAddress))
```
</TabItem>

<TabItem value="user-jetton-wallet-get-method-js" label="亲自调用get方法">

```js
const { Address, beginCell } = require("@ton/core")
const { TonClient } = require("@ton/ton")

async function getUserWalletAddress(userAddress, jettonMasterAddress) {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });
    const userAddressCell = beginCell().storeAddress(userAddress).endCell()

    const response = await client.runMethod(jettonMasterAddress, "get_wallet_address", [{type: "slice", cell: userAddressCell}])
    return response.stack.readAddress()
}
const jettonMasterAddress = Address.parse('...') // 例如 EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE
const userAddress = Address.parse('...')

getUserWalletAddress(userAddress, jettonMasterAddress)
    .then((userJettonWalletAddress) => {
        console.log(userJettonWalletAddress)
    }
)
```
</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

```kotlin
// 设置liteClient
val context: CoroutineContext = Dispatchers.Default
val json = Json { ignoreUnknownKeys = true }
val config = json.decodeFromString<LiteClientConfigGlobal>(
    URI("https://ton.org/global-config.json").toURL().readText()
)
val liteClient = LiteClient(context, config)

val USER_ADDR = AddrStd("钱包地址")
val JETTON_MASTER = AddrStd("Jetton主合约地址") // 例如 EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE

// 我们需要以切片形式发送常规钱包地址
val userAddressSlice = CellBuilder.beginCell()
    .storeUInt(4, 3)
    .storeInt(USER_ADDR.workchainId, 8)
    .storeBits(USER_ADDR.address)
    .endCell()
    .beginParse()

val response = runBlocking {
    liteClient.runSmcMethod(
        LiteServerAccountId(JETTON_MASTER.workchainId, JETTON_MASTER.address),
        "get_wallet_address",
        VmStackValue.of(userAddressSlice)
    )
}

val stack = response.toMutableVmStack()
val jettonWalletAddress = stack.popSlice().loadTlb(MsgAddressInt) as AddrStd
println("计算的Jetton钱包:")
println(jettonWalletAddress.toString(userFriendly = true))

```
</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, begin_cell
import asyncio

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    USER_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


    result_stack = await provider.run_get_method(address=JETTON_MASTER_ADDRESS, method="get_wallet_address",
                                                   stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()])
    jetton_wallet = result_stack[0].load_address()
    print(f"用户{USER_ADDRESS}的Jetton钱包地址: {jetton_wallet.to_str(1, 1, 1)}")
	await provider.close_all()

asyncio.run(main())
```
</TabItem>

</Tabs>

### 如何构建带有评论的 jetton 转账消息？

为了理解如何构建 token 转账消息，我们使用 [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)，该标准描述了 token 标准。需要注意的是，每个 token 可以有自己的 `decimals`，默认值为 `9`。因此，在下面的示例中，我们将数量乘以 10^9。如果小数位数不同，您**需要乘以不同的值**。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const jettonWalletAddress = Address.parse('put your jetton wallet address');
    const destinationAddress = Address.parse('put destination wallet address');

    const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode 意味着我们有一个评论
        .storeStringTail('Hello, TON!')
        .endCell();

    const messageBody = beginCell()
        .storeUint(0x0f8a7ea5, 32) // jetton 转账的 opcode
        .storeUint(0, 64) // query id
        .storeCoins(toNano(5)) // jetton 数量，数量 * 10^9
        .storeAddress(destinationAddress)
        .storeAddress(destinationAddress) // 响应目的地
        .storeBit(0) // 无自定义有效负载
        .storeCoins(toNano('0.02')) // 转发金额
        .storeBit(1) // 我们将 forwardPayload 作为引用存储
        .storeRef(forwardPayload)
        .endCell();

    const internalMessage = internal({
        to: jettonWalletAddress,
        value: toNano('0.1'),
        bounce: true,
        body: messageBody
    });
    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const destinationAddress = new TonWeb.Address('put destination wallet address');

    const forwardPayload = new TonWeb.boc.Cell();
    forwardPayload.bits.writeUint(0, 32); // 0 opcode 意味着我们有一个评论
    forwardPayload.bits.writeString('Hello, TON!');

    /*
        Tonweb 有一个内置的用于与 jettons 互动的类(class)，它有一个创建转账的方法。
        然而，它有缺点，所以我们手动创建消息体。此外，这种方式让我们更好地理解了
        存储的内容和它的功能是什么。
     */

    const jettonTransferBody = new TonWeb.boc.Cell();
    jettonTransferBody.bits.writeUint(0xf8a7ea5, 32); // jetton 转账的 opcode
    jettonTransferBody.bits.writeUint(0, 64); // query id
    jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN('5')); // jetton 数量，数量 * 10^9
    jettonTransferBody.bits.writeAddress(destinationAddress);
    jettonTransferBody.bits.writeAddress(destinationAddress); // 响应目的地
    jettonTransferBody.bits.writeBit(false); // 无自定义有效载荷
    jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0.02')); // 转发金额
    jettonTransferBody.bits.writeBit(true); // 我们将 forwardPayload 作为引用存储
    jettonTransferBody.refs.push(forwardPayload);

    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {
        address: 'put your jetton wallet address'
    });

    // 可用钱包类型：simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // 工作链
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: jettonWallet.address,
        amount: tonweb.utils.toNano('0.1'),
        seqno: await wallet.methods.seqno().call(),
        payload: jettonTransferBody,
        sendMode: 3
    }).send(); // 创建转账并发送
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0]
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # 文本评论 op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton 转账 op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1)                     # 要转账的 Jetton 数量，以 nanojetton 计
                    .store_address(DESTINATION_ADDRESS) # 目标地址
                    .store_address(USER_ADDRESS)        # 响应地址
                    .store_bit(0)                       # 自定义有效负载为空
                    .store_coins(1)                     # TON 转发金额，以 nanoton 计
                    .store_bit(1)                       # 将 forward_payload 作为引用存储
                    .store_ref(forward_payload)         # 转发有效负载
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
	await client.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>


为了表示我们想要包含一个评论，我们指定了 32 个零位，然后写下我们的评论。我们还指定了`响应目的地`，这意味着关于成功转账的响应将发送到这个地址。如果我们不想要响应，我们可以指定 2 个零位而不是一个地址。

### 如何向 DEX(DeDust)发送交换(swap)信息？

DEX使用不同的协议来进行交易。在这个例子中，我们将与**DeDust**交互。
* [DeDust文档](https://docs.dedust.io/)。

DeDust有两种交换路径：jetton <-> jetton 或 toncoin <-> jetton。每种都有不同的方案。要进行交换，您需要将jettons（或toncoin）发送到特定的**vault**并提供特殊的有效负载。以下是将jetton交换为jetton或jetton交换为toncoin的方案：

```tlb
swap#e3a0d482 _:SwapStep swap_params:^SwapParams = ForwardPayload;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```
此方案显示了您的jettons转账消息（`transfer#0f8a7ea5`）的`forward_payload`中应包含的内容。

以及toncoin到jetton交换的方案：
```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```
这是向toncoin **vault**转账的方案。

首先，您需要知道您要交换的jettons的**vault**地址或toncoin **vault**地址。可以通过合约[**Factory**](https://docs.dedust.io/reference/factory)的`get_vault_address`方法来完成。您需要按照下面的方案传递一个切片：
```tlb
native$0000 = Asset; // 用于ton
jetton$0001 workchain_id:int8 address:uint256 = Asset; // 用于jetton
```
此外，对于交换本身，我们需要**pool**地址 - 可以通过get方法`get_pool_address`获得。至于参数 - 根据上述方案的资产切片。作为响应，这两个方法都将返回所请求的**vault** / **pool**地址的切片。

这足以构建消息。

<Tabs groupId="code-examples">

 <TabItem value="js-ton" label="JS (@ton)">
DEX使用不同的协议来执行它们的工作，我们需要了解关键概念和一些重要组件，还需要知道涉及我们正确执行交换过程的TL-B模式。在这个教程中，我们处理DeDust，TON中已构建完成的著名DEX之一。
在DeDust中，我们有一个抽象的Asset概念，它包括任何可交换的资产类型。对资产类型的抽象化简化了交换过程，因为资产类型无关紧要，即使是来自其他链的额外代币或资产，在这种方法中也能轻松覆盖。



以下是DeDust为Asset概念引入的TL-B模式。

```tlb
native$0000 = Asset; // 用于ton

jetton$0001 workchain_id:int8 address:uint256 = Asset; // 用于任何jetton，地址指的是jetton主地址

// 即将推出，尚未实现。
extra_currency$0010 currency_id:int32 = Asset;
```

接下来，DeDust引入了三个组件，Vault，Pool和Factory。这些组件是合约或合约组，并且负责j交换过程的部分。Factory充当寻找其他组件地址（如vault和pool）的角色，并且还构建其他组件。
Vault负责接收转账消息，持有资产，只是通知相应的Pool，"用户A想要将100 X换成Y"。


另一方面，Pool负责根据预定义公式计算交换金额，通知负责资产Y的其他Vault，并告诉它支付给用户计算出的金额。
交换金额的计算基于数学公式，这意味着到目前为止我们有两种不同的pool，一种被称为Volatile，它基于常用的“恒定产品”公式运作：x * y = k，另一种被称为Stable-Swap - 为近等值资产（例如USDT / USDC，TON / stTON）优化。它使用公式：x3 * y + y3 * x = k。
所以对于每次交换，我们需要相应的Vault，它只需要实现一个为与特定资产类型交互而定制的特定API。DeDust有三种Vault的实现，Native Vault - 处理原生代币（Toncoin）。Jetton Vault - 管理jettons和Extra-Currency Vault（即将推出）- 为TON额外代币设计。


DeDust提供了一个特殊的SDk来处理合约、组件和API，它是用typescript编写的。
足够的理论，让我们设置环境以交换一个jetton和TON。

```bash
npm install --save @ton/core @ton/ton @ton/crypt

```

我们还需要引入DeDust SDK。

```bash
npm install --save @dedust/sdk
```

现在我们需要初始化一些对象。

```typescript
import { Factory, MAINNET_FACTORY_ADDR } from "@dedust/sdk";
import { Address, TonClient4 } from "@ton/ton";

const tonClient = new TonClient4({
  endpoint: "https://mainnet-v4.tonhubapi.com",
});
const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
//Factory合约用于定位其他合约。
```

交换过程有一些步骤，例如，要用Jetton交换一些TON，我们首先需要找到相应的Vault和Pool
然后确保它们已部署。对于我们的示例TON和SCALE，代码如下：

```typescript
import { Asset, VaultNative } from "@dedust/sdk";

//Native vault是用于TON的
const tonVault = tonClient.open(await factory.getNativeVault());
//我们使用factory来找到我们的原生代币（Toncoin）Vault。
```

下一步是找到相应的Pool，这里是（TON和SCALE）

```typescript
import { PoolType } from "@dedust/sdk";

const SCALE_ADDRESS = Address.parse(
  "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE",
);
// SCALE jetton的主地址
const TON = Asset.native();
const SCALE = Asset.jetton(SCALE_ADDRESS);

const pool = tonClient.open(
  await factory.getPool(PoolType.VOLATILE, [TON, SCALE]),
);
```

现在我们应该确保这些合约存在，因为向一个未激活的合约发送资金可能导致无法找回的损失。

```typescript
import { ReadinessStatus } from "@dedust/sdk";

// 检查pool是否存在：
if ((await pool.getReadinessStatus()) !== ReadinessStatus.READY) {
  throw new Error("Pool (TON, SCALE) 不存在。");
}

// 检查vault是否存在：
if ((await tonVault.getReadinessStatus()) !== ReadinessStatus.READY) {
  throw new Error("Vault (TON) 不存在。");
}
```

之后，我们可以发送带有TON数量的转账消息

```typescript
import { toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";

  if (!process.env.MNEMONIC) {
    throw new Error("需要环境变量MNEMONIC。");
  }

  const mnemonic = process.env.MNEMONIC.split(" ");

  const keys = await mnemonicToPrivateKey(mnemonic);
  const wallet = tonClient.open(
    WalletContractV3R2.create({
      workchain: 0,
      publicKey: keys.publicKey,
    }),
  );

const sender = wallet.sender(keys.secretKey);

const amountIn = toNano("5"); // 5 TON

await tonVault.sendSwap(sender, {
  poolAddress: pool.address,
  amount: amountIn,
  gasAmount: toNano("0.25"),
});
```

要用Y交换Token X，流程相同，例如，我们向Vault X发送X token的数量，Vault X接收我们的资产，持有它，并通知（X，Y）pool这个地址请求交换，然后Pool根据计算通知另一个Vault，这里Vault Y向请求交换的用户释放等价的Y。

资产之间的差异只是关于转账方法的问题，例如，对于jettons，我们使用转账消息将它们转入Vault，并附加特定的forward_payload，但对于原生代币，我们发送交换消息到Vault，附加相应数量的TON。

这是TON和jetton的模式：

```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
```

因此，每个vault和相应的Pool都针对特定的交换设计，并具有为特定资产量身定做的特殊API。

这是使用jetton SCALE交换TON的过程。jetton与jetton交换的过程是相同的，唯一的区别是我们应提供TL-B模式中描述的有效负载。

```TL-B
swap#e3a0d482 _:SwapStep swap_params:^SwapParams = ForwardPayload;
```

```typescript
//寻找Vault
const scaleVault = tonClient.open(await factory.getJettonVault(SCALE_ADDRESS));
```

```typescript
//寻找jetton地址
import { JettonRoot, JettonWallet } from '@dedust/sdk';

const scaleRoot = tonClient.open(JettonRoot.createFromAddress(SCALE_ADDRESS));
const scaleWallet = tonClient.open(await scaleRoot.getWallet(sender.address);

// 将jettons转移到Vault（SCALE）并附上相应的有效负载

const amountIn = toNano('50'); // 50 SCALE

await scaleWallet.sendTransfer(sender, toNano("0.3"), {
  amount: amountIn,
  destination: scaleVault.address,
  responseAddress: sender.address, // 将gas返回给用户
  forwardAmount: toNano("0.25"),
  forwardPayload: VaultJetton.createSwapPayload({ poolAddress }),
});
```
</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

构建资源片段：
```kotlin
val assetASlice = buildCell {
    storeUInt(1,4)
    storeInt(JETTON_MASTER_A.workchainId, 8)
    storeBits(JETTON_MASTER_A.address)
}.beginParse()
```

执行获取方法：
```kotlin
val responsePool = runBlocking {
    liteClient.runSmcMethod(
        LiteServerAccountId(DEDUST_FACTORY.workchainId, DEDUST_FACTORY.address),
        "get_pool_address",
        VmStackValue.of(0),
        VmStackValue.of(assetASlice),
        VmStackValue.of(assetBSlice)
    )
}
stack = responsePool.toMutableVmStack()
val poolAddress = stack.popSlice().loadTlb(MsgAddressInt) as AddrStd
```

构建并传输消息：
```kotlin
runBlocking {
    wallet.transfer(pk, WalletTransfer {
        destination = JETTON_WALLET_A // 你现有的jettons钱包
        bounceable = true
        coins = Coins(300000000) // 0.3 ton 的 nanotons
        messageData = MessageData.raw(
            body = buildCell {
                storeUInt(0xf8a7ea5, 32) // op 转账
                storeUInt(0, 64) // 查询_id
                storeTlb(Coins, Coins(100000000)) // jettons的数量
                storeSlice(addrToSlice(jettonAVaultAddress)) // 目的地地址
                storeSlice(addrToSlice(walletAddress))  // 响应地址
                storeUInt(0, 1)  // 自定义载荷
                storeTlb(Coins, Coins(250000000)) // forward_ton_amount // 0.25 ton 的 nanotons
                storeUInt(1, 1)
                // 前送载荷
                storeRef {
                    storeUInt(0xe3a0d482, 32) // op 交换
                    storeSlice(addrToSlice(poolAddress)) // pool_addr
                    storeUInt(0, 1) // 类型
                    storeTlb(Coins, Coins(0)) // 限制
                    storeUInt(0, 1) // next (用于multihop)
                    storeRef {
                        storeUInt(System.currentTimeMillis() / 1000 + 60 * 5, 32) // 截止日期
                        storeSlice(addrToSlice(walletAddress)) // 收件人地址
                        storeSlice(buildCell { storeUInt(0, 2) }.beginParse()) // 转发人（空地址）
                        storeUInt(0, 1)
                        storeUInt(0, 1)
                        endCell()
                    }
                }
            }
        )
        sendMode = 3
    })
}
```
</TabItem>

<TabItem value="py" label="Python">

此示例展示如何将Ton币兑换为Jetton。

```py
from pytoniq import Address, begin_cell, LiteBalancer, WalletV4R2
import time
import asyncio

DEDUST_FACTORY = "EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67"
DEDUST_NATIVE_VAULT = "EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)

    JETTON_MASTER = Address("EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE")  # 想要兑换的jettons地址
    TON_AMOUNT = 10**9  # 1 ton - 兑换数量
    GAS_AMOUNT = 10**9 // 4  # 0.25 ton作为gas
    
    pool_type = 0 # Volatile pool类型

    asset_native = (begin_cell()
                   .store_uint(0, 4) # 资产类型是原生代币
                   .end_cell().begin_parse())
    asset_jetton = (begin_cell()
                   .store_uint(1, 4) # 资产类型是jettons
                   .store_uint(JETTON_MASTER.wc, 8)
                   .store_bytes(JETTON_MASTER.hash_part)
                   .end_cell().begin_parse())

    stack = await provider.run_get_method(
        address=DEDUST_FACTORY, method="get_pool_address",
        stack=[pool_type, asset_native, asset_jetton]
    )
    pool_address = stack[0].load_address()
    
    swap_params = (begin_cell()
                  .store_uint(int(time.time() + 60 * 5), 32) # 截止时间
                  .store_address(wallet.address) # 收件人地址
                  .store_address(None) # 转发人地址
                  .store_maybe_ref(None) # 完成载荷
                  .store_maybe_ref(None) # 拒绝载荷
                  .end_cell())
    swap_body = (begin_cell()
                .store_uint(0xea06185d, 32) # 交换操作码
                .store_uint(0, 64) # 查询id
                .store_coins(int(1*1e9)) # 交换数量
                .store_address(pool_address)
                .store_uint(0, 1) # 交换类型
                .store_coins(0) # 交换限制
                .store_maybe_ref(None) # 下一步，multi-hop的交换
                .store_ref(swap_params)
                .end_cell())

    await wallet.transfer(destination=DEDUST_NATIVE_VAULT,
                          amount=TON_AMOUNT + GAS_AMOUNT, # 交换数量+gas
                          body=swap_body)
    
    await provider.close_all()

asyncio.run(main())

```
</TabItem>
</Tabs>




### 如何使用 NFT 批量部署?

集合的智能合约允许在单个交易中部署多达250个NFT。但是，实际上，由于1ton的计算费用限制，这个最大数量在100到130个NFT之间。为此，我们需要在字典中存储有关新NFT的信息。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, Cell, Dictionary, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
   	const nftMinStorage = '0.05';
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' // 对于Testnet
    });
    const ownersAddress = [
        Address.parse('EQBbQljOpEM4Z6Hvv8Dbothp9xp2yM-TFYVr01bSqDQskHbx'),
        Address.parse('EQAUTbQiM522Y_XJ_T98QPhPhTmb4nV--VSPiha8kC6kRfPO'),
        Address.parse('EQDWTH7VxFyk_34J1CM6wwEcjVeqRQceNwzPwGr30SsK43yo')
    ];
    const nftsMeta = [
        '0/meta.json',
        '1/meta.json',
        '2/meta.json'
    ];

    const getMethodResult = await client.runMethod(collectionAddress, 'get_collection_data');
    let nextItemIndex = getMethodResult.stack.readNumber();
```

</TabItem>
</Tabs>

首先，我们假设每存储费用的TON最小金额为`0.05`。这意味着部署一个NFT后，集合的智能合约将向其余额发送这么多TON。接下来，我们获取新NFT所有者和内容的数组。之后，我们通过GET方法`get_collection_data`获取`next_item_index`。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
	let counter = 0;
    const nftDict = Dictionary.empty<number, Cell>();
    for (let index = 0; index < 3; index++) {
        const metaCell = beginCell()
            .storeStringTail(nftsMeta[index])
            .endCell();
        const nftContent = beginCell()
            .storeAddress(ownersAddress[index])
            .storeRef(metaCell)
            .endCell();
        nftDict.set(nextItemIndex, nftContent);
        nextItemIndex++;
        counter++;
    }

	/*
		我们需要编写自定义的序列化和反序列化
		函数来正确地在字典中存储数据，因为库中的
		内置函数不适合我们的案例。
	*/
    const messageBody = beginCell()
        .storeUint(2, 32)
        .storeUint(0, 64)
        .storeDict(nftDict, Dictionary.Keys.Uint(64), {
            serialize: (src, builder) => {
                builder.storeCoins(toNano(nftMinStorage));
                builder.storeRef(src);
            },
            parse: (src) => {
                return beginCell()
                    .storeCoins(src.loadCoins())
                    .storeRef(src.loadRef())
                    .endCell();
            }
        })
        .endCell();

    const totalValue = String(
        (counter * parseFloat(nftMinStorage) + 0.015 * counter).toFixed(6)
    );

    const internalMessage = internal({
        to: collectionAddress,
        value: totalValue,
        bounce: true,
        body: messageBody
    });
    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>

接下来，我们需要正确计算总交易费用。通过测试得知`0.015`值，但每个案例可能会有所不同。主要取决于NFT的内容，内容的增加导致更高的**转发费**（交付费）。

### 如何更改集合的智能合约所有者？

更改集合的所有者非常简单。要做到这一点，你需要指定 **opcode = 3**，任何 query_id，以及新所有者的地址：

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
    const newOwnerAddress = Address.parse('put new owner wallet address');

    const messageBody = beginCell()
        .storeUint(3, 32) // 改变所有者的opcode
        .storeUint(0, 64) // query id
        .storeAddress(newOwnerAddress)
        .endCell();

    const internalMessage = internal({
        to: collectionAddress,
        value: toNano('0.05'),
        bounce: true,
        body: messageBody
    });
    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const collectionAddress  = new TonWeb.Address('put your collection address');
    const newOwnerAddress = new TonWeb.Address('put new owner wallet address');

    const messageBody  = new TonWeb.boc.Cell();
    messageBody.bits.writeUint(3, 32); // 改变所有者的opcode
    messageBody.bits.writeUint(0, 64); // query id
    messageBody.bits.writeAddress(newOwnerAddress);

    // 可选的钱包类型有: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // 工作链
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: collectionAddress,
        amount: tonweb.utils.toNano('0.05'),
        seqno: await wallet.methods.seqno().call(),
        payload: messageBody,
        sendMode: 3
    }).send(); // 创建并发送转账
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>

### 如何更改集合智能合约中的内容？

要更改智能合约集合的内容，我们需要了解它是如何存储的。集合将所有内容存储在一个单一的cell中，其中包含两个cell：**集合内容** 和 **NFT 通用内容**。第一个cell包含集合的元数据，而第二个cell包含NFT元数据的基本URL。

通常，集合的元数据存储格式类似于 `0.json` 并且继续递增，而这个文件之前的地址保持不变。正是这个地址应该存储在NFT通用内容中。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
    const newCollectionMeta = 'put url fol collection meta';
    const newNftCommonMeta = 'put common url for nft meta';
    const royaltyAddress = Address.parse('put royalty address');

    const collectionMetaCell = beginCell()
        .storeUint(1, 8) // 我们拥有链下元数据
        .storeStringTail(newCollectionMeta)
        .endCell();
    const nftCommonMetaCell = beginCell()
        .storeUint(1, 8) // 我们拥有链下元数据
        .storeStringTail(newNftCommonMeta)
        .endCell();

    const contentCell = beginCell()
        .storeRef(collectionMetaCell)
        .storeRef(nftCommonMetaCell)
        .endCell();

    const royaltyCell = beginCell()
        .storeUint(5, 16) // factor
        .storeUint(100, 16) // base
        .storeAddress(royaltyAddress) // 该地址将接收每次销售金额的5%
        .endCell();

    const messageBody = beginCell()
        .storeUint(4, 32) // 更改内容的 opcode
        .storeUint(0, 64) // query id
        .storeRef(contentCell)
        .storeRef(royaltyCell)
        .endCell();

    const internalMessage = internal({
        to: collectionAddress,
        value: toNano('0.05'),
        bounce: true,
        body: messageBody
    });

    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://testnet.toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const collectionAddress  = new TonWeb.Address('put your collection address');
    const newCollectionMeta = 'put url fol collection meta';
    const newNftCommonMeta = 'put common url for nft meta';
    const royaltyAddress = new TonWeb.Address('put royalty address');

    const collectionMetaCell = new TonWeb.boc.Cell();
    collectionMetaCell.bits.writeUint(1, 8); // 我们拥有链下元数据
    collectionMetaCell.bits.writeString(newCollectionMeta);
    const nftCommonMetaCell = new TonWeb.boc.Cell();
    nftCommonMetaCell.bits.writeUint(1, 8); // 我们拥有链下元数据
    nftCommonMetaCell.bits.writeString(newNftCommonMeta);

    const contentCell = new TonWeb.boc.Cell();
    contentCell.refs.push(collectionMetaCell);
    contentCell.refs.push(nftCommonMetaCell);

    const royaltyCell = new TonWeb.boc.Cell();
    royaltyCell.bits.writeUint(5, 16); // factor
    royaltyCell.bits.writeUint(100, 16); // base
    royaltyCell.bits.writeAddress(royaltyAddress); // 该地址将接收每次销售金额的5%

    const messageBody = new TonWeb.boc.Cell();
    messageBody.bits.writeUint(4, 32);
    messageBody.bits.writeUint(0, 64);
    messageBody.refs.push(contentCell);
    messageBody.refs.push(royaltyCell);

    // 可选的钱包类型有: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // 工作链
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: collectionAddress,
        amount: tonweb.utils.toNano('0.05'),
        seqno: await wallet.methods.seqno().call(),
        payload: messageBody,
        sendMode: 3
    }).send(); // 创建并发送转账
}

main().finally(() => console.log("Exiting..."));
```
</TabItem>
</Tabs>

另外，我们需要在消息中包含版权信息，因为使用这个 opcode 时，它们也会改变。需要注意的是，不是一定要在所有地方指定新值。例如，如果只需要更改NFT通用内容，则所有其他值可以按照之前的指定。

### 处理蛇形Cells

有时候，在cell最多可以包含 **1023位** 的情况下，需要存储长字符串（或其他大型信息）。这种情况下，我们可以使用 蛇形cells。蛇形cells 是包含对另一个cell的引用的cell，而该cell又包含对另一个cell的引用，依此类推。

<Tabs groupId="code-examples">
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");

function writeStringTail(str, cell) {
    const bytes = Math.floor(cell.bits.getFreeBits() / 8); // 1字符 = 8位
    if(bytes < str.length) { // 如果我们不能写下所有字符串
        cell.bits.writeString(str.substring(0, bytes)); // 写入字符串的一部分
        const newCell = writeStringTail(str.substring(bytes), new TonWeb.boc.Cell()); // 创建新cell
        cell.refs.push(newCell); // 将新cell添加到当前cell的引用中
    } else {
        cell.bits.writeString(str); // 写下所有字符串
    }

    return cell;
}

function readStringTail(cell) {
    const slice = cell.beginParse(); // 将cell转换为切片
    if(cell.refs.length > 0) {
        const str = new TextDecoder('ascii').decode(slice.array); // 解码 uint8array 为字符串
        return str + readStringTail(cell.refs[0]); // 读取下一个cell
    } else {
        return new TextDecoder('ascii').decode(slice.array);
    }
}

let cell = new TonWeb.boc.Cell();
const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod, ligula vel lobortis hendrerit, lectus sem efficitur enim, vel efficitur nibh dui a elit. Quisque augue nisi, vulputate vitae mauris sit amet, iaculis lobortis nisi. Aenean molestie ultrices massa eu fermentum. Cras rhoncus ipsum mauris, et egestas nibh interdum in. Maecenas ante ipsum, sodales eget suscipit at, placerat ut turpis. Nunc ac finibus dui. Donec sit amet leo id augue tempus aliquet. Vestibulum eu aliquam ex, sit amet suscipit odio. Vestibulum et arcu dui.";
cell = writeStringTail(str, cell);
const text = readStringTail(cell);
console.log(text);
```

</TabItem>
</Tabs>

这个示例将帮助你了解如何使用递归来处理这类cell。

### 如何解析账户的交易记录（转账、Jettons、NFTs）？

通过 `getTransactions` API方法可以获取到一个账户上的交易记录列表。它返回一个`Transaction`对象的数组，其中每个项都有很多属性。然而，最常用的字段有：
 - 初始化这笔交易的消息的Sender, Body和Value
 - 交易的哈希和逻辑时间（LT）

_Sender_ 和 _Body_ 字段可用于确定消息的类型（常规转账、jetton转账、nft转账等等）。

以下是一个例子，展示了如何获取任何区块链账户上最近的5笔交易，根据类型解析它们，并在循环中打印出来。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, TonClient, beginCell, fromNano } from '@ton/ton';

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
    });

    const myAddress = Address.parse('EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN'); // 你想要从中获取交易记录的地址

    const transactions = await client.getTransactions(myAddress, {
        limit: 5,
    });

    for (const tx of transactions) {
        const inMsg = tx.inMessage;

        if (inMsg?.info.type == 'internal') {
            // 我们在这里只处理内部消息，因为它们最常用
            // 对于外部消息，一些字段是空的，但主要结构是相似的
            const sender = inMsg?.info.src;
            const value = inMsg?.info.value.coins;

            const originalBody = inMsg?.body.beginParse();
            let body = originalBody.clone();
            if (body.remainingBits < 32) {
                // 如果正文没有操作码：这是一条没有评论的简单消息
                console.log(`Simple transfer from ${sender} with value ${fromNano(value)} TON`);
            } else {
                const op = body.loadUint(32);
                if (op == 0) {
                    // 如果操作码是0：这是一条有评论的简单消息
                    const comment = body.loadStringTail();
                    console.log(
                        `Simple transfer from ${sender} with value ${fromNano(value)} TON and comment: "${comment}"`
                    );
                } else if (op == 0x7362d09c) {
                    // 如果操作码是0x7362d09c：这是一个Jetton转账通知

                    body.skip(64); // 跳过query_id
                    const jettonAmount = body.loadCoins();
                    const jettonSender = body.loadAddressAny();
                    const originalForwardPayload = body.loadBit() ? body.loadRef().beginParse() : body;
                    let forwardPayload = originalForwardPayload.clone();

                    // 重要：我们必须验证这条消息的来源，因为它可能被伪造
                    const runStack = (await client.runMethod(sender, 'get_wallet_data')).stack;
                    runStack.skip(2);
                    const jettonMaster = runStack.readAddress();
                    const jettonWallet = (
                        await client.runMethod(jettonMaster, 'get_wallet_address', [
                            { type: 'slice', cell: beginCell().storeAddress(myAddress).endCell() },
                        ])
                    ).stack.readAddress();
                    if (!jettonWallet.equals(sender)) {
                        // 如果发送者不是我们真正的JettonWallet：这条消息被伪造了
                        console.log(`FAKE Jetton transfer`);
                        continue;
                    }

                    if (forwardPayload.remainingBits < 32) {
                        // 如果forward payload没有操作码：这是一个简单的Jetton转账
                        console.log(`Jetton transfer from ${jettonSender} with value ${fromNano(jettonAmount)} Jetton`);
                    } else {
                        const forwardOp = forwardPayload.loadUint(32);
                        if (forwardOp == 0) {
                            // 如果forward payload的操作码是0：这是一次带有评论的简单Jetton转账
                            const comment = forwardPayload.loadStringTail();
                            console.log(
                                `Jetton transfer from ${jettonSender} with value ${fromNano(
                                    jettonAmount
                                )} Jetton and comment: "${comment}"`
                            );
                        } else {
                            // 如果forward payload的操作码是其他：这是一条具有任意结构的消息
                            // 如果你知道其他操作码，你可以手动解析它，或者直接以十六进制形式打印
                            console.log(
                                `Jetton transfer with unknown payload structure from ${jettonSender} with value ${fromNano(
                                    jettonAmount
                                )} Jetton and payload: ${originalForwardPayload}`
                            );
                        }

                        console.log(`Jetton Master: ${jettonMaster}`);
                    }
                } else if (op == 0x05138d91) {
                    // 如果操作码是0x05138d91：这是一个NFT转账通知

                    body.skip(64); // 跳过query_id
                    const prevOwner = body.loadAddress();
                    const originalForwardPayload = body.loadBit() ? body.loadRef().beginParse() : body;
                    let forwardPayload = originalForwardPayload.clone();

                    // 重要：我们必须验证这条消息的来源，因为它可能被伪造
                    const runStack = (await client.runMethod(sender, 'get_nft_data')).stack;
                    runStack.skip(1);
                    const index = runStack.readBigNumber();
                    const collection = runStack.readAddress();
                    const itemAddress = (
                        await client.runMethod(collection, 'get_nft_address_by_index', [{ type: 'int', value: index }])
                    ).stack.readAddress();

                    if (!itemAddress.equals(sender)) {
                        console.log(`FAKE NFT Transfer`);
                        continue;
                    }

                    if (forwardPayload.remainingBits < 32) {
                        // 如果forward payload没有操作码：这是一个简单的NFT转账
                        console.log(`NFT transfer from ${prevOwner}`);
                    } else {
                        const forwardOp = forwardPayload.loadUint(32);
                        if (forwardOp == 0) {
                            // 如果forward payload的操作码是0：这是一次带有评论的简单NFT转账
                            const comment = forwardPayload.loadStringTail();
                            console.log(`NFT transfer from ${prevOwner} with comment: "${comment}"`);
                        } else {
                            // 如果forward payload的操作码是其他：这是一条具有任意结构的消息
                            // 如果你知道其他操作码，你可以手动解析它，或者直接以十六进制形式打印
                            console.log(
                                `NFT transfer with unknown payload structure from ${prevOwner} and payload: ${originalForwardPayload}`
                            );
                        }
                    }

                    console.log(`NFT Item: ${itemAddress}`);
                    console.log(`NFT Collection: ${collection}`);
                } else {
                    // 如果操作码是其他的：这是一条具有任意结构的消息
                    // 如果你知道其他操作码，你可以手动解析它，或者直接以十六进制形式打印
                    console.log(
                        `Message with unknown structure from ${sender} with value ${fromNano(
                            value
                        )} TON and body: ${originalBody}`
                    );
                }
            }
        }
        console.log(`Transaction Hash: ${tx.hash().toString('hex')}`);
        console.log(`Transaction LT: ${tx.lt}`);
        console.log();
    }
}

main().finally(() => console.log('Exiting...'));
```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, begin_cell
import asyncio

async def parse_transactions(transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9
        
        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
        else:
            body_slice = transaction.in_msg.body.begin_parse()
            op_code = body_slice.load_uint(32)
            
            # TextComment
            if op_code == 0:
                print(f"TON transfer from {sender} with value {value} TON and comment: {body_slice.load_snake_string()}")
            
            # Jetton Transfer Notification
            elif op_code == 0x7362d09c:
                body_slice.load_bits(64) # skip query_id
                jetton_amount = body_slice.load_coins() / 1e9
                jetton_sender = body_slice.load_address().to_str(1, 1, 1)
                if body_slice.load_bit():
                    forward_payload = body_slice.load_ref().begin_parse()
                else:
                    forward_payload = body_slice
                
                jetton_master = (await provider.run_get_method(address=sender, method="get_wallet_data", stack=[]))[2].load_address()
                jetton_wallet = (await provider.run_get_method(address=jetton_master, method="get_wallet_address",
                                                               stack=[
                                                                        begin_cell().store_address(MY_WALLET_ADDRESS).end_cell().begin_parse()
                                                                     ]))[0].load_address().to_str(1, 1, 1)

                if jetton_wallet != sender:
                    print("FAKE Jetton Transfer")
                    continue
                
                if len(forward_payload.bits) < 32:
                    print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton")
                else:
                    forward_payload_op_code = forward_payload.load_uint(32)
                    if forward_payload_op_code == 0:
                        print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and comment: {forward_payload.load_snake_string()}")
                    else:
                        print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and unknown payload: {forward_payload} ")
            
            # NFT 转移通知
            elif op_code == 0x05138d91:
                body_slice.load_bits(64) # skip query_id
                prev_owner = body_slice.load_address().to_str(1, 1, 1)
                if body_slice.load_bit():
                    forward_payload = body_slice.load_ref().begin_parse()
                else:
                    forward_payload = body_slice

                stack = await provider.run_get_method(address=sender, method="get_nft_data", stack=[])
                index = stack[1]
                collection = stack[2].load_address()
                item_address = (await provider.run_get_method(address=collection, method="get_nft_address_by_index",
                                                              stack=[index]))[0].load_address().to_str(1, 1, 1)

                if item_address != sender:
                    print("FAKE NFT Transfer")
                    continue

                if len(forward_payload.bits) < 32:
                    print(f"NFT transfer from {prev_owner}")
                else:
                    forward_payload_op_code = forward_payload.load_uint(32)
                    if forward_payload_op_code == 0:
                        print(f"NFT transfer from {prev_owner} with comment: {forward_payload.load_snake_string()}")
                    else:
                        print(f"NFT transfer from {prev_owner} with unknown payload: {forward_payload}")

                print(f"NFT Item: {item_address}")
                print(f"NFT Collection: {collection}")
        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"
provider = LiteBalancer.from_mainnet_config(1)

async def main():
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(transactions)
    await provider.close_all()

asyncio.run(main())
```
</TabItem>

</Tabs>

请注意，这个示例只涵盖了入站消息的最简单情况，其中只需在单个账户上获取交易记录即可。如果你想进一步深入并处理更复杂的交易和消息链，你应该考虑`tx.outMessages`字段。它包含了这笔交易所产生的输出消息的列表。为了更好地理解整个逻辑，你可以阅读这些文章：
* [消息概览](/develop/smart-contracts/guidelines/message-delivery-guarantees)
* [内部消息](/develop/smart-contracts/guidelines/internal-messages)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/cookbook.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/cookbook.mdx
================================================
import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TON Cookbook

在产品开发过程中，经常会出现有关与 TON 上不同合约交互的各种问题。

本文档旨在收集所有开发人员的最佳实践，并与大家分享。

## 使用合约地址

### 如何转换（用户友好 \<-\> 原始）、组装和从字符串中提取地址？

TON地址在区块链中唯一标识合约，指示其工作链和原始状态哈希。使用两种常见格式[详见](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)：原始（工作链和用":"字符分隔的HEX编码哈希）和用户友好（带有特定标志的base64编码）。

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

要从 SDK 中的字符串获取地址对象，可以使用以下代码：

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address } from "@ton/core";


const address1 = Address.parse('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');
const address2 = Address.parse('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e');

// toStrings arguments: urlSafe, bounceable, testOnly
// defaults values: true, true, false

console.log(address1.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address1.toRawString()); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

console.log(address2.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address2.toRawString()); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require('tonweb');

const address1 = new TonWeb.utils.Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');
const address2 = new TonWeb.utils.Address('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e');

// toString arguments: isUserFriendly, isUrlSafe, isBounceable, isTestOnly

console.log(address1.toString(true, true, true)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address1.toString(isUserFriendly = false)); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

console.log(address1.toString(true, true, true)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address2.toString(isUserFriendly = false)); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"fmt"

	"github.com/xssnick/tonutils-go/address"
)

func main() {
	address1 := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF")
	address2 := address.MustParseRawAddr("0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e")

	fmt.Println(address1.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	fmt.Println(rawAddr(address1)) // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

	fmt.Println(address2.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	fmt.Println(rawAddr(address2)) // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
}

func rawAddr(addr *address.Address) string {
	return fmt.Sprintf("%v:%x", addr.Workchain(), addr.Data())
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
from pytoniq_core import Address

address1 = Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')
address2 = Address('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e')

# to_str() arguments: is_user_friendly, is_url_safe, is_bounceable, is_test_only

print(address1.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address1.to_str(is_user_friendly=False))  # 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

print(address2.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address2.to_str(is_user_friendly=False))  # 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
</Tabs>

### 用户友好型地址有哪些标志？

我们通过定义两个标志（flags）：**bounceable**/**non-bounceable** 和 **testnet**/**any-net**。它代表地址编码中的前 6 位，并且标志根据 [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses) 使得我们只查看地址的第一个字母去轻松检测到它们：

|    地址开头    |    二进制形式   | 可返回（Bounceable） |    仅测试网    |
| :--------: | :--------: | :-------------: | :--------: |
| E...       | 000100.01  |     yes         | no         |
| U...       | 010100.01  |      no         | no         |
| k...       | 100100.01  |     yes         | yes        |
| 0...       | 110100.01  |      no         | yes        |

:::tip
Testnet-only 标志在区块链中没有任何表示。Non-bounceable 标志仅在用作转账的目标地址时才有所不同：在这种情况下，它[不允许消息回弹](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)；区块链中的地址同样不包含此标志。
:::

此外，在某些库中，你可能会注意到一个名为 `urlSafe` 的序列化参数。base64 格式不是 URL 安全格式，这意味着在链接中传输地址时，某些字符（即 `+` 和 `/`）可能会引起问题。当 `urlSafe = true` 时，所有 `+` 符号都会被替换为 `-`，所有 `/` 符号都会被替换为 `_`。您可以使用以下代码获取这些地址格式：

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address } from "@ton/core";

const address = Address.parse('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');

// toStrings arguments: urlSafe, bounceable, testOnly
// defaults values: true, true, false

console.log(address.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHFэ
console.log(address.toString({urlSafe: false})) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
console.log(address.toString({bounceable: false})) // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
console.log(address.toString({testOnly: true})) // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
console.log(address.toString({bounceable: false, testOnly: true})) // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require('tonweb');

const address = new TonWeb.utils.Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');

// toString arguments: isUserFriendly, isUrlSafe, isBounceable, isTestOnly

console.log(address.toString(true, true, true, false)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address.toString(true, false, true, false)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
console.log(address.toString(true, true, false, false)); // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
console.log(address.toString(true, true, true, true)); // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
console.log(address.toString(true, true, false, true)); // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"fmt"
	"github.com/xssnick/tonutils-go/address"
)

func main() {
	address := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF")

	fmt.Println(address.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	address.SetBounce(false)
	fmt.Println(address.String()) // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
	address.SetBounce(true)
	address.SetTestnetOnly(true) // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
	fmt.Println(address.String())
	address.SetBounce(false) // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
	fmt.Println(address.String())
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
from pytoniq_core import Address

address = Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')

# to_str() arguments: is_user_friendly, is_url_safe, is_bounceable, is_test_only

print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True, is_test_only=False))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=False, is_test_only=False))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
print(address.to_str(is_user_friendly=True, is_bounceable=False, is_url_safe=True, is_test_only=False))  # UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True, is_test_only=True))  # kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
print(address.to_str(is_user_friendly=True, is_bounceable=False, is_url_safe=True, is_test_only=True))  # 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
</Tabs>

### 如何检查 TON 地址的有效性？

<Tabs groupId="address-examples">

<TabItem value="Tonweb" label="JS (Tonweb)">

```js

const TonWeb = require("tonweb")

TonWeb.utils.Address.isValid('...')
```

</TabItem>
<TabItem value="GO" label="tonutils-go">

```python
package main

import (
    "fmt"
    "github.com/xssnick/tonutils-go/address"
)

if _, err := address.ParseAddr("EQCD39VS5j...HUn4bpAOg8xqB2N"); err != nil {
 return errors.New("invalid address")
}
```

</TabItem>
<TabItem value="Java" label="ton4j">

```javascript
  /* Maven
  <dependency>
    <groupId>io.github.neodix42</groupId>
    <artifactId>address</artifactId>
    <version>0.3.2</version>
  </dependency>
  */

  try {
  Address.of("...");
  } catch (Exception e) {
  // not valid address
  }
```

</TabItem>
<TabItem value="Kotlin" label="ton-kotlin">

```javascript
try {
    AddrStd("...")
} catch(e: IllegalArgumentException) {
   // not valid address
}
```

</TabItem>
</Tabs>

## TON 生态系统中的标准钱包

### 如何转账 TON？如何向另一个钱包发送短信？

#### 发送信息

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

#### 部署合约

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

大多数 SDK 都提供以下从钱包发送信息的流程：

- 使用秘钥和工作链（通常为 0，代表 [basechain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules)）创建正确版本（大多数情况下为 v3r2；另请参阅  [wallet versions](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts)）的钱包包装器（程序中的对象）。
- 您还可以创建区块链封装器或 "客户端 "对象，将请求路由到 API 或 liteservers（任选其一）。
- 然后，在区块链封装器中 _打开_ 合约。这意味着合约对象不再是抽象的，而是代表 TON 主网或测试网中的实际账户。
- 之后，您就可以编写自己想要的信息并发送它们。根据[高级手册](/v3/guidelines/smart-contracts/howto/wallet#sending-multiple-messages-simultaneously) 中的说明，每次请求最多可发送 4 条信息。

<Tabs groupId="code-examples">
<TabItem value="js-ton-v4" label="JS (@ton) for Wallet V4">

```js
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: 'your-api-key', // Optional, but note that without api-key you need to send requests once per second, and with 0.25 seconds
});

// Convert mnemonics to private key
let mnemonics = "word1 word2 ...".split(" ");
let keyPair = await mnemonicToPrivateKey(mnemonics);

// Create wallet contract
let workchain = 0; // Usually you need a workchain 0
let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
let contract = client.open(wallet);

// Create a transfer
let seqno: number = await contract.getSeqno();
await contract.sendTransfer({
  seqno,
  secretKey: keyPair.secretKey,
  messages: [internal({
    value: '1',
    to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
    body: 'Example transfer body',
  })]
});
```

</TabItem>

<TabItem value="js-ton-v5" label="JS (@ton) for Wallet V5">

```js
import { TonClient, WalletContractV5R1, internal, SendMode } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: 'your-api-key', // Optional, but note that without api-key you need to send requests once per second, and with 0.25 seconds
});

// Convert mnemonics to private key
let mnemonics = "word1 word2 ...".split(" ");
let keyPair = await mnemonicToPrivateKey(mnemonics);

// Create wallet contract
let wallet = WalletContractV5R1.create({
  publicKey: keyPair.publicKey,
  workChain: 0, // Usually you need a workchain 0
});
let contract = client.open(wallet);

// Create a transfer
let seqno: number = await contract.getSeqno();
await contract.sendTransfer({
  secretKey: keyPair.secretKey,
  seqno,
  sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
  messages: [
    internal({
      to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
      value: '0.05',
      body: 'Example transfer body',
    }),
  ],
});
```

</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

```kotlin
// Setup liteClient
val context: CoroutineContext = Dispatchers.Default
val json = Json { ignoreUnknownKeys = true }
val config = json.decodeFromString<LiteClientConfigGlobal>(
    URI("https://ton.org/global-config.json").toURL().readText()
)
val liteClient = LiteClient(context, config)

val WALLET_MNEMONIC = "word1 word2 ...".split(" ")

val pk = PrivateKeyEd25519(Mnemonic.toSeed(WALLET_MNEMONIC))
val walletAddress = WalletV3R2Contract.address(pk, 0)
println(walletAddress.toString(userFriendly = true, bounceable = false))

val wallet = WalletV3R2Contract(liteClient, walletAddress)
runBlocking {
    wallet.transfer(pk, WalletTransfer {
        destination = AddrStd("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
        bounceable = true
        coins = Coins(100000000) // 1 ton in nanotons
        messageData = org.ton.contract.wallet.MessageData.raw(
            body = buildCell {
                storeUInt(0, 32)
                storeBytes("Comment".toByteArray())
            }
        )
        sendMode = 0
    })
}
```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, WalletV4R2
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)

    transfer = {
        "destination": "DESTINATION ADDRESS HERE",    # please remember about bounceable flags
        "amount":      int(10**9 * 0.05),             # amount sent, in nanoTON
        "body":        "Example transfer body",       # may contain a cell; see next examples
    }

    await wallet.transfer(**transfer)
    await provider.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>

### 编写注释：蛇形格式长字符串

有时需要存储长字符串（或其他大型信息），而 cell **最多只能容纳 1023 位**。在这种情况下，我们可以使用蛇形 cell 。蛇形 cell 是包含对另一个 cell 引用的 cell ，而另一个 cell 又包含对另一个 cell 的引用，以此类推。

<Tabs groupId="code-examples">
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");

function writeStringTail(str, cell) {
    const bytes = Math.floor(cell.bits.getFreeBits() / 8); // 1 symbol = 8 bits
    if(bytes < str.length) { // if we can't write all string
        cell.bits.writeString(str.substring(0, bytes)); // write part of string
        const newCell = writeStringTail(str.substring(bytes), new TonWeb.boc.Cell()); // create new cell
        cell.refs.push(newCell); // add new cell to current cell's refs
    } else {
        cell.bits.writeString(str); // write all string
    }

    return cell;
}

function readStringTail(slice) {
    const str = new TextDecoder('ascii').decode(slice.array); // decode uint8array to string
    if (cell.refs.length > 0) {
        return str + readStringTail(cell.refs[0].beginParse()); // read next cell
    } else {
        return str;
    }
}

let cell = new TonWeb.boc.Cell();
const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod, ligula vel lobortis hendrerit, lectus sem efficitur enim, vel efficitur nibh dui a elit. Quisque augue nisi, vulputate vitae mauris sit amet, iaculis lobortis nisi. Aenean molestie ultrices massa eu fermentum. Cras rhoncus ipsum mauris, et egestas nibh interdum in. Maecenas ante ipsum, sodales eget suscipit at, placerat ut turpis. Nunc ac finibus dui. Donec sit amet leo id augue tempus aliquet. Vestibulum eu aliquam ex, sit amet suscipit odio. Vestibulum et arcu dui.";
cell = writeStringTail(str, cell);
const text = readStringTail(cell.beginParse());
console.log(text);
```

</TabItem>
</Tabs>

许多 SDK 已经有了负责解析和存储长字符串的函数。在其他 SDK 中，您可以使用递归方法处理此类 cell ，或者对其进行优化（称为 "尾部调用 "的技巧）。

别忘了，注释报文有 32 个零位（可以说其操作码为 0）！

## TEP-74（ jetton 标准）

### 如何计算用户的 Jetton 钱包地址（链下）？

要计算用户的 jetton 钱包地址，我们需要调用 jetton 主合约中包含用户地址的 "get_wallet_address" get 方法。为此，我们可以使用 JettonMaster 中的 getWalletAddress 方法或自己调用主合约。

:::info
`@ton/ton` 中的 `JettonMaster` 缺少很多功能，但幸运的是有 _这个_ 功能。
:::

<Tabs groupId="code-examples">
<TabItem value="user-jetton-wallet-method-js" label="@ton/ton">

```js
const { Address, beginCell } = require("@ton/core")
const { TonClient, JettonMaster } = require("@ton/ton")

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

const jettonMasterAddress = Address.parse('...') // for example EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE
const userAddress = Address.parse('...')

const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress))
console.log(await jettonMaster.getWalletAddress(userAddress))
```

</TabItem>

<TabItem value="user-jetton-wallet-get-method-js" label="Manually call get-method">

```js
const { Address, beginCell } = require("@ton/core")
const { TonClient } = require("@ton/ton")

async function getUserWalletAddress(userAddress, jettonMasterAddress) {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });
    const userAddressCell = beginCell().storeAddress(userAddress).endCell()
    const response = await client.runMethod(jettonMasterAddress, "get_wallet_address", [
        {type: "slice", cell: userAddressCell}
    ])
    return response.stack.readAddress()
}
const jettonMasterAddress = Address.parse('...') // for example EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE
const userAddress = Address.parse('...')

getUserWalletAddress(userAddress, jettonMasterAddress)
    .then((jettonWalletAddress) => {console.log(jettonWalletAddress)})
```

</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

```kotlin
// Setup liteClient
val context: CoroutineContext = Dispatchers.Default
val json = Json { ignoreUnknownKeys = true }
val config = json.decodeFromString<LiteClientConfigGlobal>(
    URI("https://ton.org/global-config.json").toURL().readText()
)
val liteClient = LiteClient(context, config)

val USER_ADDR = AddrStd("Wallet address")
val JETTON_MASTER = AddrStd("Jetton Master contract address") // for example EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE

// we need to send regular wallet address as a slice
val userAddressSlice = CellBuilder.beginCell()
    .storeUInt(4, 3)
    .storeInt(USER_ADDR.workchainId, 8)
    .storeBits(USER_ADDR.address)
    .endCell()
    .beginParse()

val response = runBlocking {
    liteClient.runSmcMethod(
        LiteServerAccountId(JETTON_MASTER.workchainId, JETTON_MASTER.address),
        "get_wallet_address",
        VmStackValue.of(userAddressSlice)
    )
}

val stack = response.toMutableVmStack()
val jettonWalletAddress = stack.popSlice().loadTlb(MsgAddressInt) as AddrStd
println("Calculated Jetton wallet:")
println(jettonWalletAddress.toString(userFriendly = true))

```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, begin_cell
import asyncio

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    USER_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


    result_stack = await provider.run_get_method(address=JETTON_MASTER_ADDRESS, method="get_wallet_address",
                                                   stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()])
    jetton_wallet = result_stack[0].load_address()
    print(f"Jetton wallet address for {USER_ADDRESS}: {jetton_wallet.to_str(1, 1, 1)}")
    await provider.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>

### 如何计算用户的 Jetton 钱包地址（链下）？

每次调用 GET 方法获取钱包地址都会耗费大量时间和资源。如果我们事先知道 Jetton 钱包的代码及其存储结构，就可以在不进行任何网络请求的情况下获取钱包地址。

您可以使用Tonviewer获取代码。以`jUSDT`为例，Jetton Master的地址是`EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA`。如果我们[访问这个地址](https://tonviewer.com/EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA?section=method) 并打开Methods标签，我们可以看到那里已经有一个 `get_jetton_data` 方法。通过调用它，我们可以得到Jetton钱包代码的十六进制形式的 cell：

```
b5ee9c7201021301000385000114ff00f4a413f4bcf2c80b0102016202030202cb0405001ba0f605da89a1f401f481f481a9a30201ce06070201580a0b02f70831c02497c138007434c0c05c6c2544d7c0fc07783e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7c076cf16cc8d0d0d09208403e29fa96ea68c1b088d978c4408fc06b809208405e351466ea6cc1b08978c840910c03c06f80dd6cda0841657c1ef2ea7c09c6c3cb4b01408eebcb8b1807c073817c160080900113e910c30003cb85360005c804ff833206e953080b1f833de206ef2d29ad0d30731d3ffd3fff404d307d430d0fa00fa00fa00fa00fa00fa00300008840ff2f00201580c0d020148111201f70174cfc0407e803e90087c007b51343e803e903e903534544da8548b31c17cb8b04ab0bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032481c007e401d3232c084b281f2fff274013e903d010c7e800835d270803cb8b13220060072c15401f3c59c3e809dc072dae00e02f33b51343e803e903e90353442b4cfc0407e80145468017e903e9014d771c1551cdbdc150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0325c007e401d3232c084b281f2fff2741403f1c147ac7cb8b0c33e801472a84a6d8206685401e8062849a49b1578c34975c2c070c00870802c200f1000aa13ccc88210178d4519580a02cb1fcb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25007a813a008aa005004a017a014bcf2e2c501c98040fb004300c85004fa0258cf1601cf16ccc9ed5400725269a018a1c882107362d09c2902cb1fcb3f5007fa025004cf165007cf16c9c8801001cb0527cf165004fa027101cb6a13ccc971fb0050421300748e23c8801001cb055006cf165005fa027001cb6a8210d53276db580502cb1fcb3fc972fb00925b33e24003c85004fa0258cf1601cf16ccc9ed5400eb3b51343e803e903e9035344174cfc0407e800870803cb8b0be903d01007434e7f440745458a8549631c17cb8b049b0bffcb8b0b220841ef765f7960100b2c7f2cfc07e8088f3c58073c584f2e7f27220060072c148f3c59c3e809c4072dab33260103ec01004f214013e809633c58073c5b3327b55200087200835c87b51343e803e903e9035344134c7c06103c8608405e351466e80a0841ef765f7ae84ac7cbd34cfc04c3e800c04e81408f214013e809633c58073c5b3327b5520
```

现在，知道了Jetton钱包的代码、Jetton Master地址和金库结构，我们可以手动计算钱包地址：

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton/ton)">

```js
import { Address, Cell, beginCell, storeStateInit } from '@ton/core';

const JETTON_WALLET_CODE = Cell.fromBoc(Buffer.from('b5ee9c7201021301000385000114ff00f4a413f4bcf2c80b0102016202030202cb0405001ba0f605da89a1f401f481f481a9a30201ce06070201580a0b02f70831c02497c138007434c0c05c6c2544d7c0fc07783e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7c076cf16cc8d0d0d09208403e29fa96ea68c1b088d978c4408fc06b809208405e351466ea6cc1b08978c840910c03c06f80dd6cda0841657c1ef2ea7c09c6c3cb4b01408eebcb8b1807c073817c160080900113e910c30003cb85360005c804ff833206e953080b1f833de206ef2d29ad0d30731d3ffd3fff404d307d430d0fa00fa00fa00fa00fa00fa00300008840ff2f00201580c0d020148111201f70174cfc0407e803e90087c007b51343e803e903e903534544da8548b31c17cb8b04ab0bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032481c007e401d3232c084b281f2fff274013e903d010c7e800835d270803cb8b13220060072c15401f3c59c3e809dc072dae00e02f33b51343e803e903e90353442b4cfc0407e80145468017e903e9014d771c1551cdbdc150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0325c007e401d3232c084b281f2fff2741403f1c147ac7cb8b0c33e801472a84a6d8206685401e8062849a49b1578c34975c2c070c00870802c200f1000aa13ccc88210178d4519580a02cb1fcb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25007a813a008aa005004a017a014bcf2e2c501c98040fb004300c85004fa0258cf1601cf16ccc9ed5400725269a018a1c882107362d09c2902cb1fcb3f5007fa025004cf165007cf16c9c8801001cb0527cf165004fa027101cb6a13ccc971fb0050421300748e23c8801001cb055006cf165005fa027001cb6a8210d53276db580502cb1fcb3fc972fb00925b33e24003c85004fa0258cf1601cf16ccc9ed5400eb3b51343e803e903e9035344174cfc0407e800870803cb8b0be903d01007434e7f440745458a8549631c17cb8b049b0bffcb8b0b220841ef765f7960100b2c7f2cfc07e8088f3c58073c584f2e7f27220060072c148f3c59c3e809c4072dab33260103ec01004f214013e809633c58073c5b3327b55200087200835c87b51343e803e903e9035344134c7c06103c8608405e351466e80a0841ef765f7ae84ac7cbd34cfc04c3e800c04e81408f214013e809633c58073c5b3327b5520', 'hex'))[0];
const JETTON_MASTER_ADDRESS = Address.parse('EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA');
const USER_ADDRESS = Address.parse('UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA');

const jettonWalletStateInit = beginCell().store(storeStateInit({
    code: JETTON_WALLET_CODE,
    data: beginCell()
        .storeCoins(0)
        .storeAddress(USER_ADDRESS)
        .storeAddress(JETTON_MASTER_ADDRESS)
        .storeRef(JETTON_WALLET_CODE)
        .endCell()
}))
.endCell();
const userJettonWalletAddress = new Address(0, jettonWalletStateInit.hash());

console.log('User Jetton Wallet address:', userJettonWalletAddress.toString());
```

</TabItem>

<TabItem value="Python" label="Python">

```python

from pytoniq_core import Address, Cell, begin_cell

def calculate_jetton_address(
    owner_address: Address, jetton_master_address: Address, jetton_wallet_code: str
):
    # Recreate from jetton-utils.fc calculate_jetton_wallet_address()
    # https://tonscan.org/jetton/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs#source

    data_cell = (
        begin_cell()
        .store_uint(0, 4)
        .store_coins(0)
        .store_address(owner_address)
        .store_address(jetton_master_address)
        .end_cell()
    )

    code_cell = Cell.one_from_boc(jetton_wallet_code)

    state_init = (
        begin_cell()
        .store_uint(0, 2)
        .store_maybe_ref(code_cell)
        .store_maybe_ref(data_cell)
        .store_uint(0, 1)
        .end_cell()
    )
    state_init_hex = state_init.hash.hex()
    jetton_address = Address(f'0:{state_init_hex}')

    return jetton_address

```

阅读整个示例 [此处](/example-code-snippets/pythoniq/jetton-offline-address-calc-wrapper.py)。

</TabItem>
</Tabs>

大多数主要代币并没有不同的存储结构，因为它们使用了 [TEP-74 标准的标准实现](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc)。例外情况是用于中心化稳定币的新型 [带治理功能的 Jetton 合约](https://github.com/ton-blockchain/stablecoin-contract)。在这些合约中，差异体现在 [拥有一个钱包状态字段，并且金库中缺少代码单元](https://github.com/ton-blockchain/stablecoin-contract/blob/7a22416d4de61336616960473af391713e100d7b/contracts/jetton-utils.fc#L3-L12)。

### 如何为带有注释的 jetton 转送构建信息？

为了了解如何构建令牌传输信息，我们使用了描述令牌标准的 [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)。

#### 传输 jettons

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

:::warning
When displayed, token doesn't usually show count of indivisible units user has; rather, amount is divided by `10 ^ decimals`. This value is commonly set to `9`, and this allows us to use `toNano` function. If decimals were different, we would **need to multiply by a different value** (for instance, if decimals are 6, then we would end up transferring thousand times the amount we wanted).

当然，我们总是在用不可分割的单位来进行计算。
:::

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const jettonWalletAddress = Address.parse('put your jetton wallet address');
    const destinationAddress = Address.parse('put destination wallet address');

    const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail('Hello, TON!')
        .endCell();

    const messageBody = beginCell()
        .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
        .storeUint(0, 64) // query id
        .storeCoins(toNano(5)) // jetton amount, amount * 10^9
        .storeAddress(destinationAddress)
        .storeAddress(destinationAddress) // response destination
        .storeBit(0) // no custom payload
        .storeCoins(toNano('0.02')) // forward amount - if >0, will send notification message
        .storeBit(1) // we store forwardPayload as a reference
        .storeRef(forwardPayload)
        .endCell();

    const internalMessage = internal({
        to: jettonWalletAddress,
        value: toNano('0.1'),
        bounce: true,
        body: messageBody
    });
    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const destinationAddress = new TonWeb.Address('put destination wallet address');

    const forwardPayload = new TonWeb.boc.Cell();
    forwardPayload.bits.writeUint(0, 32); // 0 opcode means we have a comment
    forwardPayload.bits.writeString('Hello, TON!');

    /*
        Tonweb has a built-in class for interacting with jettons, which has
        a method for creating a transfer. However, it has disadvantages, so
        we manually create the message body. Additionally, this way we have a
        better understanding of what is stored and how it functions.
     */

    const jettonTransferBody = new TonWeb.boc.Cell();
    jettonTransferBody.bits.writeUint(0xf8a7ea5, 32); // opcode for jetton transfer
    jettonTransferBody.bits.writeUint(0, 64); // query id
    jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN('5')); // jetton amount, amount * 10^9
    jettonTransferBody.bits.writeAddress(destinationAddress);
    jettonTransferBody.bits.writeAddress(destinationAddress); // response destination
    jettonTransferBody.bits.writeBit(false); // no custom payload
    jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0.02')); // forward amount
    jettonTransferBody.bits.writeBit(true); // we store forwardPayload as a reference
    jettonTransferBody.refs.push(forwardPayload);

    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {
        address: 'put your jetton wallet address'
    });

    // available wallet types: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // workchain
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: jettonWallet.address,
        amount: tonweb.utils.toNano('0.1'),
        seqno: await wallet.methods.seqno().call(),
        payload: jettonTransferBody,
        sendMode: 3
    }).send(); // create transfer and send it
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # Jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>

如果 `forward_amount` 非零，则有关 jetton 接收的通知将发送到目标合约，如本节顶部的方案所示。如果 `response_destination` 地址不为空，则剩余的toncoins（多余的一些）将被发送到该地址。

:::tip
Explorer 支持 jetton 通知中的注释以及常见的 TON 传输中的注释。它们的格式是 32 个零位，然后是文本，最好是 UTF-8。
:::

:::tip
Jetton Transfers需要仔细考虑外发消息背后的费用和金额。例如，如果您以0.2TON的`调用（call）`转移，则无法转发0.1TON并收到0.1TON的多余返回消息。
:::

## TEP-62（NFT标准）

NFT 收藏品有很大不同。实际上，TON 上的 NFT 合约可以定义为“具有适当 get 方法并返回有效元数据的合约”。转账操作是标准化的，与 [jetton 的操作](/v3/guidelines/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment) 非常相似，所以我们不会深入探讨进入其中，看看您可能遇到的大多数集合提供的附加功能！

:::warning
提醒：以下所有关于 NFT 的方法都不受 TEP-62 的约束。在尝试之前，请检查您的 NFT 或程序集是否能以预期方式处理这些信息。在这种情况下，钱包应用程序模拟可能会很有用。
:::

### 如何使用 NFT 批量部署？

收藏品的智能合约允许在单笔交易中部署最多 250 个 NFT。然而，必须考虑到，在实践中，由于计算费用限制为 1 TON，这个最大值约为 100-130 个 NFT。为了实现这一目标，我们需要将有关新 NFT 的信息存储在字典中。

#### 批量铸造NFT

:::info
NFT 标准未指定 /ton-blockchain /token-contract
:::

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, Cell, Dictionary, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
   	const nftMinStorage = '0.05';
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' // for Testnet
    });
    const ownersAddress = [
        Address.parse('EQBbQljOpEM4Z6Hvv8Dbothp9xp2yM-TFYVr01bSqDQskHbx'),
        Address.parse('EQAUTbQiM522Y_XJ_T98QPhPhTmb4nV--VSPiha8kC6kRfPO'),
        Address.parse('EQDWTH7VxFyk_34J1CM6wwEcjVeqRQceNwzPwGr30SsK43yo')
    ];
    const nftsMeta = [
        '0/meta.json',
        '1/meta.json',
        '2/meta.json'
    ];

    const getMethodResult = await client.runMethod(collectionAddress, 'get_collection_data');
    let nextItemIndex = getMethodResult.stack.readNumber();
```

</TabItem>
</Tabs>

首先，我们假设存储费的最小 TON 金额为`0.05`。这意味着在部署 NFT 后，收藏品的智能合约将向其余额发送这么多 TON。接下来，我们获得包含新 NFT 所有者及其内容的数组。之后，我们使用 GET 方法 `get_collection_data` 获取 `next_item_index`。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
	let counter = 0;
    const nftDict = Dictionary.empty<number, Cell>();
    for (let index = 0; index < 3; index++) {
        const metaCell = beginCell()
            .storeStringTail(nftsMeta[index])
            .endCell();
        const nftContent = beginCell()
            .storeAddress(ownersAddress[index])
            .storeRef(metaCell)
            .endCell();
        nftDict.set(nextItemIndex, nftContent);
        nextItemIndex++;
        counter++;
    }

	/*
		We need to write our custom serialization and deserialization
		functions to store data correctly in the dictionary since the
		built-in functions in the library are not suitable for our case.
	*/
    const messageBody = beginCell()
        .storeUint(2, 32)
        .storeUint(0, 64)
        .storeDict(nftDict, Dictionary.Keys.Uint(64), {
            serialize: (src, builder) => {
                builder.storeCoins(toNano(nftMinStorage));
                builder.storeRef(src);
            },
            parse: (src) => {
                return beginCell()
                    .storeCoins(src.loadCoins())
                    .storeRef(src.loadRef())
                    .endCell();
            }
        })
        .endCell();

    const totalValue = String(
        (counter * parseFloat(nftMinStorage) + 0.015 * counter).toFixed(6)
    );

    const internalMessage = internal({
        to: collectionAddress,
        value: totalValue,
        bounce: true,
        body: messageBody
    });
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>

接下来，我们需要正确计算总交易成本。 `0.015` 的值是通过测试获得的，但它可能因情况而异。这主要取决于 NFT 的内容，因为内容大小的增加会导致更高的**forward fee**（传递费用）。

### 如何更改收藏智能合约的所有者？

更改集合的所有者非常简单。为此，您需要指定 **opcode = 3**、任何查询 ID 和新所有者的地址：

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
    const newOwnerAddress = Address.parse('put new owner wallet address');

    const messageBody = beginCell()
        .storeUint(3, 32) // opcode for changing owner
        .storeUint(0, 64) // query id
        .storeAddress(newOwnerAddress)
        .endCell();

    const internalMessage = internal({
        to: collectionAddress,
        value: toNano('0.05'),
        bounce: true,
        body: messageBody
    });
    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const collectionAddress  = new TonWeb.Address('put your collection address');
    const newOwnerAddress = new TonWeb.Address('put new owner wallet address');

    const messageBody  = new TonWeb.boc.Cell();
    messageBody.bits.writeUint(3, 32); // opcode for changing owner
    messageBody.bits.writeUint(0, 64); // query id
    messageBody.bits.writeAddress(newOwnerAddress);

    // available wallet types: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // workchain
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: collectionAddress,
        amount: tonweb.utils.toNano('0.05'),
        seqno: await wallet.methods.seqno().call(),
        payload: messageBody,
        sendMode: 3
    }).send(); // create transfer and send it
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>

### 如何更改收藏智能合约的内容？

要更改智能合约集合的内容，我们需要了解它是如何存储的。集合将所有内容存储在一个 cell 中，其中有两个 cell ：**集合内容**和**NFT 公共内容**。第一个 cell 包含集合的元数据，第二个 cell 包含 NFT 元数据的基础 URL。

通常，收藏集的元数据以类似于 `0.json` 的格式存储，并持续递增，而该文件之前的地址保持不变。NFT 公共内容中应存储的就是这个地址。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
    const newCollectionMeta = 'put url fol collection meta';
    const newNftCommonMeta = 'put common url for nft meta';
    const royaltyAddress = Address.parse('put royalty address');

    const collectionMetaCell = beginCell()
        .storeUint(1, 8) // we have offchain metadata
        .storeStringTail(newCollectionMeta)
        .endCell();
    const nftCommonMetaCell = beginCell()
        .storeUint(1, 8) // we have offchain metadata
        .storeStringTail(newNftCommonMeta)
        .endCell();

    const contentCell = beginCell()
        .storeRef(collectionMetaCell)
        .storeRef(nftCommonMetaCell)
        .endCell();

    const royaltyCell = beginCell()
        .storeUint(5, 16) // factor
        .storeUint(100, 16) // base
        .storeAddress(royaltyAddress) // this address will receive 5% of each sale
        .endCell();

    const messageBody = beginCell()
        .storeUint(4, 32) // opcode for changing content
        .storeUint(0, 64) // query id
        .storeRef(contentCell)
        .storeRef(royaltyCell)
        .endCell();

    const internalMessage = internal({
        to: collectionAddress,
        value: toNano('0.05'),
        bounce: true,
        body: messageBody
    });

    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://testnet.toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const collectionAddress  = new TonWeb.Address('put your collection address');
    const newCollectionMeta = 'put url fol collection meta';
    const newNftCommonMeta = 'put common url for nft meta';
    const royaltyAddress = new TonWeb.Address('put royalty address');

    const collectionMetaCell = new TonWeb.boc.Cell();
    collectionMetaCell.bits.writeUint(1, 8); // we have offchain metadata
    collectionMetaCell.bits.writeString(newCollectionMeta);
    const nftCommonMetaCell = new TonWeb.boc.Cell();
    nftCommonMetaCell.bits.writeUint(1, 8); // we have offchain metadata
    nftCommonMetaCell.bits.writeString(newNftCommonMeta);

    const contentCell = new TonWeb.boc.Cell();
    contentCell.refs.push(collectionMetaCell);
    contentCell.refs.push(nftCommonMetaCell);

    const royaltyCell = new TonWeb.boc.Cell();
    royaltyCell.bits.writeUint(5, 16); // factor
    royaltyCell.bits.writeUint(100, 16); // base
    royaltyCell.bits.writeAddress(royaltyAddress); // this address will receive 5% of each sale

    const messageBody = new TonWeb.boc.Cell();
    messageBody.bits.writeUint(4, 32);
    messageBody.bits.writeUint(0, 64);
    messageBody.refs.push(contentCell);
    messageBody.refs.push(royaltyCell);

    // available wallet types: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // workchain
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: collectionAddress,
        amount: tonweb.utils.toNano('0.05'),
        seqno: await wallet.methods.seqno().call(),
        payload: messageBody,
        sendMode: 3
    }).send(); // create transfer and send it
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>

此外，我们需要在消息中包含版税信息，因为它们也会使用此操作码进行更改。需要注意的是，没有必要在所有地方都指定新值。例如，如果仅需要更改 NFT 公共内容，则可以像以前一样指定所有其他值。

## 第三方：去中心化交易所（DEX）

### 如何向 DEX (DeDust) 发送交换信息？

DEX 的工作使用不同的协议。在本例中，我们将与**DeDust**进行交互。

- [DeDust 文档](https://docs.dedust.io/).

DeDust 有两种交换路径：jetton \<-> jetton 或 TON \<-> jetton。每种都有不同的方案。要进行交换，您需要发送 jetton（或 toncoin）到一个特定的 **保险库**，并提供一个特殊的有效载荷。以下是交换 jetton 到 jetton 或 jetton 到 toncoin 的方案：

```tlb
swap#e3a0d482 _:SwapStep swap_params:^SwapParams = ForwardPayload;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```

此方案显示了你的jettons传输消息(`transfer#0f8a7ea5`)的 `forward_payload` 中的内容。

以及toncoin转jetton的方案：

```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```

这是将主体转移到 toncoin **金库 (vault)**的方案。

首先，您需要知道您要交换的 jetton 的 **vault** 地址或toncoin的 **vault** 地址。这可以通过合约 [**Factory**](https://docs.dedust.io/reference/factory) 的 `get_vault_address` 获取方法来实现。作为参数，您需要根据方案传递一个 slice ：

```tlb
native$0000 = Asset; // for ton
jetton$0001 workchain_id:int8 address:uint256 = Asset; // for jetton
```

此外，对于交换本身，我们需要 **pool** 地址 - 从get方法 `get_pool_address` 获取。作为参数--根据上述方案获得的资产 slice。作为回应，这两种方法都将返回所请求的 **vault** / **pool** 地址的 slice。

这就足以建立信息。

<Tabs groupId="code-examples">

<TabItem value="js-ton" label="JS (@ton)">
DEX 的工作使用不同的协议，我们需要熟悉关键概念和一些重要组件，并了解正确执行交换过程所涉及的 TL-B 模式。在本教程中，我们将讨论 DeDust，这是完全在 TON 中实现的著名 DEX 之一。
在 DeDust 中，我们有一个抽象的资产概念，其中包括任何可交换的资产类型。对资产类型的抽象简化了交换过程，因为资产的类型并不重要，并且通过这种方法可以轻松覆盖额外的货币甚至来自其他链的资产。

以下是 DeDust 为资产概念引入的 TL-B 模式。

```tlb
native$0000 = Asset; // for ton

jetton$0001 workchain_id:int8 address:uint256 = Asset; // for any jetton,address refer to jetton master address

// Upcoming, not implemented yet.
extra_currency$0010 currency_id:int32 = Asset;
```

接下来，DeDust 引入了三个组件：Vault、Pool 和 Factory。这些组件是合约或合约组，负责部分交换过程。factory充当查找其他组件地址（例如保管库和池）
以及构建其他组件。
Vault负责接收转账消息，持有资产，只是通知对应的矿池“用户A想要将100 X兑换成Y”。

另一方面，池（Pool）负责根据预定义的公式计算交换金额，并通知负责资产Y的其他金库（Vault），告诉它向用户支付计算出的金额。
交换金额的计算基于数学公式，这意味着到目前为止我们有两种不同的池。一种是称为“不稳定”（Volatile）的池，它基于常用的“恒定乘积”公式操作：x _ y = k。另一种称为“稳定交换”（Stable-Swap），专为价值接近的资产设计（例如USDT/USDC，TON/stTON）。它使用的公式是：x3 _ y + y3 \* x = k。
因此，对于每次交换，我们都需要相应的金库，它只需要实现一个特定的API，以便与不同资产类型进行交互。DeDust有三个金库实现：原生金库（Native Vault）- 处理原生币（Toncoin）。Jetton金库 - 管理Jetton。额外货币金库（Extra-Currency Vault）（即将推出）- 为TON额外货币设计。

DeDust 提供了一个特殊的软件开发工具包（SDK），用于与合约、组件和 API 进行交互，它是用 TypeScript 编写的。
理论已经足够了，让我们设置环境以将一台 jetton 与 TON 交换。

```bash
npm install --save @ton/core @ton/ton @ton/crypto

```

我们还需要构建DeDust SDK。

```bash
npm install --save @dedust/sdk
```

现在我们需要初始化一些对象。

```typescript
import { Factory, MAINNET_FACTORY_ADDR } from "@dedust/sdk";
import { Address, TonClient4 } from "@ton/ton";

const tonClient = new TonClient4({
  endpoint: "https://mainnet-v4.tonhubapi.com",
});
const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
//The Factory contract  is used to  locate other contracts.
```

交换的过程有一些步骤，比如把一些TON交换到Jetton我们首先需要找到对应的Vault和Pool
然后确保它们已部署。对于我们的例子TON和SCALE，代码如下：

```typescript
import { Asset, VaultNative } from "@dedust/sdk";

//Native vault is for TON
const tonVault = tonClient.open(await factory.getNativeVault());
//We use the factory to find our native coin (Toncoin) Vault.
```

接下来就是找到对应的Pool，这里（TON和SCALE）

```typescript
import { PoolType } from "@dedust/sdk";

const SCALE_ADDRESS = Address.parse(
  "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE",
);
// master address of SCALE jetton
const TON = Asset.native();
const SCALE = Asset.jetton(SCALE_ADDRESS);

const pool = tonClient.open(
  await factory.getPool(PoolType.VOLATILE, [TON, SCALE]),
);
```

现在我们应该确保这些合约存在，因为将资金发送到不活跃的合约可能会导致无法挽回的损失。

```typescript
import { ReadinessStatus } from "@dedust/sdk";

// Check if the pool exists:
if ((await pool.getReadinessStatus()) !== ReadinessStatus.READY) {
  throw new Error("Pool (TON, SCALE) does not exist.");
}

// Check if the vault exits:
if ((await tonVault.getReadinessStatus()) !== ReadinessStatus.READY) {
  throw new Error("Vault (TON) does not exist.");
}
```

之后我们就可以发送TON数量的转账消息了.

```typescript
import { toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";

  if (!process.env.MNEMONIC) {
    throw new Error("Environment variable MNEMONIC is required.");
  }

  const mnemonic = process.env.MNEMONIC.split(" ");

  const keys = await mnemonicToPrivateKey(mnemonic);
  const wallet = tonClient.open(
    WalletContractV3R2.create({
      workchain: 0,
      publicKey: keys.publicKey,
    }),
  );

const sender = wallet.sender(keys.secretKey);

const amountIn = toNano("5"); // 5 TON

await tonVault.sendSwap(sender, {
  poolAddress: pool.address,
  amount: amountIn,
  gasAmount: toNano("0.25"),
});
```

将X代币换成Y代币，过程是一样的，比如我们发送一定数量的X代币到金库X，金库X
接收我们的资产，持有它，并通知 (X, Y) 的 Pool 该地址要求交换，现在 Pool 基于
计算通知另一个 Vault，这里 Vault Y 向请求交换的用户释放等值的 Y。

资产之间的区别仅在于转移方式，例如，对于jettons，我们使用转移消息将其转移到Vault并附加特定的forward_payload，但对于原生硬币，我们向Vault发送交换消息，附加相应的的TON数量。

这是 TON 和 jetton 的架构：

```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
```

因此，每个金库和相应的池都是为特定的交换而设计的，并且具有针对特殊资产量身定制的特殊 API。

这是用 jetton SCALE 替换 TON。将 jetton 替换为 jetton 的过程是相同的，唯一的区别是我们应该提供 TL-B 模式中描述的有效负载。

```TL-B
swap#e3a0d482 _:SwapStep swap_params:^SwapParams = ForwardPayload;
```

```typescript
//find Vault
const scaleVault = tonClient.open(await factory.getJettonVault(SCALE_ADDRESS));
```

```typescript
//find jetton address
import { JettonRoot, JettonWallet } from '@dedust/sdk';

const scaleRoot = tonClient.open(JettonRoot.createFromAddress(SCALE_ADDRESS));
const scaleWallet = tonClient.open(await scaleRoot.getWallet(sender.address);

// Transfer jettons to the Vault (SCALE) with corresponding payload

const amountIn = toNano('50'); // 50 SCALE

await scaleWallet.sendTransfer(sender, toNano("0.3"), {
  amount: amountIn,
  destination: scaleVault.address,
  responseAddress: sender.address, // return gas to user
  forwardAmount: toNano("0.25"),
  forwardPayload: VaultJetton.createSwapPayload({ poolAddress }),
});
```

</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

构建资产切片（slice）

```kotlin
val assetASlice = buildCell {
    storeUInt(1,4)
    storeInt(JETTON_MASTER_A.workchainId, 8)
    storeBits(JETTON_MASTER_A.address)
}.beginParse()
```

运行获取（get）方法：

```kotlin
val responsePool = runBlocking {
    liteClient.runSmcMethod(
        LiteServerAccountId(DEDUST_FACTORY.workchainId, DEDUST_FACTORY.address),
        "get_pool_address",
        VmStackValue.of(0),
        VmStackValue.of(assetASlice),
        VmStackValue.of(assetBSlice)
    )
}
stack = responsePool.toMutableVmStack()
val poolAddress = stack.popSlice().loadTlb(MsgAddressInt) as AddrStd
```

构建并传输消息：

```kotlin
runBlocking {
    wallet.transfer(pk, WalletTransfer {
        destination = JETTON_WALLET_A // yours existing jetton wallet
        bounceable = true
        coins = Coins(300000000) // 0.3 ton in nanotons
        messageData = MessageData.raw(
            body = buildCell {
                storeUInt(0xf8a7ea5, 32) // op Transfer
                storeUInt(0, 64) // query_id
                storeTlb(Coins, Coins(100000000)) // amount of jettons
                storeSlice(addrToSlice(jettonAVaultAddress)) // destination address
                storeSlice(addrToSlice(walletAddress))  // response address
                storeUInt(0, 1)  // custom payload
                storeTlb(Coins, Coins(250000000)) // forward_ton_amount // 0.25 ton in nanotons
                storeUInt(1, 1)
                // forward_payload
                storeRef {
                    storeUInt(0xe3a0d482, 32) // op swap
                    storeSlice(addrToSlice(poolAddress)) // pool_addr
                    storeUInt(0, 1) // kind
                    storeTlb(Coins, Coins(0)) // limit
                    storeUInt(0, 1) // next (for multihop)
                    storeRef {
                        storeUInt(System.currentTimeMillis() / 1000 + 60 * 5, 32) // deadline
                        storeSlice(addrToSlice(walletAddress)) // recipient address
                        storeSlice(buildCell { storeUInt(0, 2) }.beginParse()) // referral (null address)
                        storeUInt(0, 1)
                        storeUInt(0, 1)
                        endCell()
                    }
                }
            }
        )
        sendMode = 3
    })
}
```

</TabItem>

<TabItem value="py" label="Python">

此示例展示了如何将 Toncoin 兑换为 Jettons。

```py
from pytoniq import Address, begin_cell, LiteBalancer, WalletV4R2
import time
import asyncio

DEDUST_FACTORY = "EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67"
DEDUST_NATIVE_VAULT = "EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)

    JETTON_MASTER = Address("EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE")  # jetton address swap to
    TON_AMOUNT = 10**9  # 1 ton - swap amount
    GAS_AMOUNT = 10**9 // 4  # 0.25 ton for gas

    pool_type = 0 # Volatile pool type

    asset_native = (begin_cell()
                   .store_uint(0, 4) # Asset type is native
                   .end_cell().begin_parse())
    asset_jetton = (begin_cell()
                   .store_uint(1, 4) # Asset type is jetton
                   .store_uint(JETTON_MASTER.wc, 8)
                   .store_bytes(JETTON_MASTER.hash_part)
                   .end_cell().begin_parse())

    stack = await provider.run_get_method(
        address=DEDUST_FACTORY, method="get_pool_address",
        stack=[pool_type, asset_native, asset_jetton]
    )
    pool_address = stack[0].load_address()

    swap_params = (begin_cell()
                  .store_uint(int(time.time() + 60 * 5), 32) # Deadline
                  .store_address(wallet.address) # Recipient address
                  .store_address(None) # Referall address
                  .store_maybe_ref(None) # Fulfill payload
                  .store_maybe_ref(None) # Reject payload
                  .end_cell())
    swap_body = (begin_cell()
                .store_uint(0xea06185d, 32) # Swap op-code
                .store_uint(0, 64) # Query id
                .store_coins(int(1*1e9)) # Swap amount
                .store_address(pool_address)
                .store_uint(0, 1) # Swap kind
                .store_coins(0) # Swap limit
                .store_maybe_ref(None) # Next step for multi-hop swaps
                .store_ref(swap_params)
                .end_cell())

    await wallet.transfer(destination=DEDUST_NATIVE_VAULT,
                          amount=TON_AMOUNT + GAS_AMOUNT, # swap amount + gas
                          body=swap_body)

    await provider.close_all()

asyncio.run(main())

```

</TabItem>
</Tabs>

## 消息处理基础知识

### 如何解析账户交易（转账、Jettons、NFT）？

帐户上的交易列表可以通过 `getTransactions` API 方法获取。它返回一个`Transaction`对象数组，每个项目都有很多属性。然而，最常用的字段是：

- 发起此交易的消息的发送者、正文和值
- 交易的哈希值和逻辑时间 (LT)

_Sender_ 和 _Body_ 字段可用于确定报文类型（常规传输、jetton 传输、nft 传输等）。

以下是一个例子，展示了如何获取任何区块链账户上最近的5笔交易，根据类型解析它们，并在循环中打印出来。

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, TonClient, beginCell, fromNano } from '@ton/ton';

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
    });

    const myAddress = Address.parse('EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN'); // address that you want to fetch transactions from

    const transactions = await client.getTransactions(myAddress, {
        limit: 5,
    });

    for (const tx of transactions) {
        const inMsg = tx.inMessage;

        if (inMsg?.info.type == 'internal') {
            // we only process internal messages here because they are used the most
            // for external messages some of the fields are empty, but the main structure is similar
            const sender = inMsg?.info.src;
            const value = inMsg?.info.value.coins;

            const originalBody = inMsg?.body.beginParse();
            let body = originalBody.clone();
            if (body.remainingBits < 32) {
                // if body doesn't have opcode: it's a simple message without comment
                console.log(`Simple transfer from ${sender} with value ${fromNano(value)} TON`);
            } else {
                const op = body.loadUint(32);
                if (op == 0) {
                    // if opcode is 0: it's a simple message with comment
                    const comment = body.loadStringTail();
                    console.log(
                        `Simple transfer from ${sender} with value ${fromNano(value)} TON and comment: "${comment}"`
                    );
                } else if (op == 0x7362d09c) {
                    // if opcode is 0x7362d09c: it's a Jetton transfer notification

                    body.skip(64); // skip query_id
                    const jettonAmount = body.loadCoins();
                    const jettonSender = body.loadAddressAny();
                    const originalForwardPayload = body.loadBit() ? body.loadRef().beginParse() : body;
                    let forwardPayload = originalForwardPayload.clone();

                    // IMPORTANT: we have to verify the source of this message because it can be faked
                    const runStack = (await client.runMethod(sender, 'get_wallet_data')).stack;
                    runStack.skip(2);
                    const jettonMaster = runStack.readAddress();
                    const jettonWallet = (
                        await client.runMethod(jettonMaster, 'get_wallet_address', [
                            { type: 'slice', cell: beginCell().storeAddress(myAddress).endCell() },
                        ])
                    ).stack.readAddress();
                    if (!jettonWallet.equals(sender)) {
                        // if sender is not our real JettonWallet: this message was faked
                        console.log(`FAKE Jetton transfer`);
                        continue;
                    }

                    if (forwardPayload.remainingBits < 32) {
                        // if forward payload doesn't have opcode: it's a simple Jetton transfer
                        console.log(`Jetton transfer from ${jettonSender} with value ${fromNano(jettonAmount)} Jetton`);
                    } else {
                        const forwardOp = forwardPayload.loadUint(32);
                        if (forwardOp == 0) {
                            // if forward payload opcode is 0: it's a simple Jetton transfer with comment
                            const comment = forwardPayload.loadStringTail();
                            console.log(
                                `Jetton transfer from ${jettonSender} with value ${fromNano(
                                    jettonAmount
                                )} Jetton and comment: "${comment}"`
                            );
                        } else {
                            // if forward payload opcode is something else: it's some message with arbitrary structure
                            // you may parse it manually if you know other opcodes or just print it as hex
                            console.log(
                                `Jetton transfer with unknown payload structure from ${jettonSender} with value ${fromNano(
                                    jettonAmount
                                )} Jetton and payload: ${originalForwardPayload}`
                            );
                        }

                        console.log(`Jetton Master: ${jettonMaster}`);
                    }
                } else if (op == 0x05138d91) {
                    // if opcode is 0x05138d91: it's a NFT transfer notification

                    body.skip(64); // skip query_id
                    const prevOwner = body.loadAddress();
                    const originalForwardPayload = body.loadBit() ? body.loadRef().beginParse() : body;
                    let forwardPayload = originalForwardPayload.clone();

                    // IMPORTANT: we have to verify the source of this message because it can be faked
                    const runStack = (await client.runMethod(sender, 'get_nft_data')).stack;
                    runStack.skip(1);
                    const index = runStack.readBigNumber();
                    const collection = runStack.readAddress();
                    const itemAddress = (
                        await client.runMethod(collection, 'get_nft_address_by_index', [{ type: 'int', value: index }])
                    ).stack.readAddress();

                    if (!itemAddress.equals(sender)) {
                        console.log(`FAKE NFT Transfer`);
                        continue;
                    }

                    if (forwardPayload.remainingBits < 32) {
                        // if forward payload doesn't have opcode: it's a simple NFT transfer
                        console.log(`NFT transfer from ${prevOwner}`);
                    } else {
                        const forwardOp = forwardPayload.loadUint(32);
                        if (forwardOp == 0) {
                            // if forward payload opcode is 0: it's a simple NFT transfer with comment
                            const comment = forwardPayload.loadStringTail();
                            console.log(`NFT transfer from ${prevOwner} with comment: "${comment}"`);
                        } else {
                            // if forward payload opcode is something else: it's some message with arbitrary structure
                            // you may parse it manually if you know other opcodes or just print it as hex
                            console.log(
                                `NFT transfer with unknown payload structure from ${prevOwner} and payload: ${originalForwardPayload}`
                            );
                        }
                    }

                    console.log(`NFT Item: ${itemAddress}`);
                    console.log(`NFT Collection: ${collection}`);
                } else {
                    // if opcode is something else: it's some message with arbitrary structure
                    // you may parse it manually if you know other opcodes or just print it as hex
                    console.log(
                        `Message with unknown structure from ${sender} with value ${fromNano(
                            value
                        )} TON and body: ${originalBody}`
                    );
                }
            }
        }
        console.log(`Transaction Hash: ${tx.hash().toString('hex')}`);
        console.log(`Transaction LT: ${tx.lt}`);
        console.log();
    }
}

main().finally(() => console.log('Exiting...'));
```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, begin_cell
import asyncio

async def parse_transactions(transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
        else:
            body_slice = transaction.in_msg.body.begin_parse()
            op_code = body_slice.load_uint(32)

            # TextComment
            if op_code == 0:
                print(f"TON transfer from {sender} with value {value} TON and comment: {body_slice.load_snake_string()}")

            # Jetton Transfer Notification
            elif op_code == 0x7362d09c:
                body_slice.load_bits(64) # skip query_id
                jetton_amount = body_slice.load_coins() / 1e9
                jetton_sender = body_slice.load_address().to_str(1, 1, 1)
                if body_slice.load_bit():
                    forward_payload = body_slice.load_ref().begin_parse()
                else:
                    forward_payload = body_slice

                jetton_master = (await provider.run_get_method(address=sender, method="get_wallet_data", stack=[]))[2].load_address()
                jetton_wallet = (await provider.run_get_method(address=jetton_master, method="get_wallet_address",
                                                               stack=[
                                                                        begin_cell().store_address(MY_WALLET_ADDRESS).end_cell().begin_parse()
                                                                     ]))[0].load_address().to_str(1, 1, 1)

                if jetton_wallet != sender:
                    print("FAKE Jetton Transfer")
                    continue

                if len(forward_payload.bits) < 32:
                    print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton")
                else:
                    forward_payload_op_code = forward_payload.load_uint(32)
                    if forward_payload_op_code == 0:
                        print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and comment: {forward_payload.load_snake_string()}")
                    else:
                        print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and unknown payload: {forward_payload} ")

            # NFT Transfer Notification
            elif op_code == 0x05138d91:
                body_slice.load_bits(64) # skip query_id
                prev_owner = body_slice.load_address().to_str(1, 1, 1)
                if body_slice.load_bit():
                    forward_payload = body_slice.load_ref().begin_parse()
                else:
                    forward_payload = body_slice

                stack = await provider.run_get_method(address=sender, method="get_nft_data", stack=[])
                index = stack[1]
                collection = stack[2].load_address()
                item_address = (await provider.run_get_method(address=collection, method="get_nft_address_by_index",
                                                              stack=[index]))[0].load_address().to_str(1, 1, 1)

                if item_address != sender:
                    print("FAKE NFT Transfer")
                    continue

                if len(forward_payload.bits) < 32:
                    print(f"NFT transfer from {prev_owner}")
                else:
                    forward_payload_op_code = forward_payload.load_uint(32)
                    if forward_payload_op_code == 0:
                        print(f"NFT transfer from {prev_owner} with comment: {forward_payload.load_snake_string()}")
                    else:
                        print(f"NFT transfer from {prev_owner} with unknown payload: {forward_payload}")

                print(f"NFT Item: {item_address}")
                print(f"NFT Collection: {collection}")
        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"
provider = LiteBalancer.from_mainnet_config(1)

async def main():
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(transactions)
    await provider.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>

请注意，此示例仅涵盖传入消息的最简单情况，其中足以获取单个帐户上的交易。如果您想更深入地处理更复杂的交易和消息链，您应该将`tx.outMessages` 字段放入帐户中。它包含此交易结果中智能合约发送的输出消息的列表。为了更好地理解整个逻辑，您可以阅读以下文章：

- [消息概述](/v3/documentation/smart-contracts/message-management/messages-and-transactions)
- [内部信息](/v3/documentation/smart-contracts/message-management/internal-messages)

[支付处理](/v3/guidelines/dapps/asset-processing/payments-processing) 一文对该主题进行了更深入的探讨。

### 如何查找特定 TON Connect 结果的交易?

TON Connect 2 仅返回发送到区块链的单元，而不返回生成的交易哈希（因为如果外部消息丢失或超时，该交易可能不会通过）。不过，如果 BOC 允许我们在帐户历史记录中搜索该确切消息。

:::tip
您可以使用索引器来简化搜索。它提供的实现用于连接到 RPC 的`TonClient`。
:::

`retry`函数的预加载以尝试监听区块链：

```typescript

export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
  }
  throw lastError;
}

```

创建侦听器函数，该函数将使用特定的传入的外部消息的方式（等于 boc 中的正文消息）来断言特定帐户上的特定交易：

<Tabs>
<TabItem value="ts" label="@ton/ton">

```typescript

import {Cell, Address, beginCell, storeMessage, TonClient} from "@ton/ton";

const res = tonConnectUI.send(msg); // exBoc in the result of sending message
const exBoc = res.boc;
const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'INSERT YOUR API-KEY', // https://t.me/tonapibot
    });

export async function getTxByBOC(exBoc: string): Promise<string> {

    const myAddress = Address.parse('INSERT TON WALLET ADDRESS'); // Address to fetch transactions from

    return retry(async () => {
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        for (const tx of transactions) {
            const inMsg = tx.inMessage;
            if (inMsg?.info.type === 'external-in') {

                const inBOC = inMsg?.body;
                if (typeof inBOC === 'undefined') {

                    reject(new Error('Invalid external'));
                    continue;
                }
                const extHash = Cell.fromBase64(exBoc).hash().toString('hex')
                const inHash = beginCell().store(storeMessage(inMsg)).endCell().hash().toString('hex')

                console.log(' hash BOC', extHash);
                console.log('inMsg hash', inHash);
                console.log('checking the tx', tx, tx.hash().toString('hex'));


                // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
                if (extHash === inHash) {
                    console.log('Tx match');
                    const txHash = tx.hash().toString('hex');
                    console.log(`Transaction Hash: ${txHash}`);
                    console.log(`Transaction LT: ${tx.lt}`);
                    return (txHash);
                }
            }
        }
        throw new Error('Transaction not found');
    }, {retries: 30, delay: 1000});
}

 txRes = getTxByBOC(exBOC);
 console.log(txRes);
```

</TabItem>

</Tabs>

### 如何查找交易或信息哈希值？

:::info
请注意哈希值的定义。它可以是交易哈希值，也可以是信息哈希值。这两者是不同的。
:::

要获取交易哈希，需要使用交易的 `hash` 方法。要获取外部消息哈希值，需要
使用 `storeMessage` 方法建立消息 cell ，然后使用该 cell 的 `hash` 方法。

<Tabs>
  <TabItem value="ts" label="@ton/ton">

```typescript
import { storeMessage, TonClient } from '@ton/ton';
import { Address, beginCell } from '@ton/core';

const tonClient = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' });

const transactions = await tonClient.getTransactions(Address.parse('[ADDRESS]'), { limit: 10 });
for (const transaction of transactions) {
  // ful transaction hash
  const transactionHash = transaction.hash();

  const inMessage = transaction.inMessage;
  if (inMessage?.info.type === 'external-in') {
    const inMessageCell = beginCell().store(storeMessage(inMessage)).endCell();
    // external-in message hash
    const inMessageHash = inMessageCell.hash();
  }

  // also you can get hash of out messages if needed
  for (const outMessage of transaction.outMessages.values()) {
    const outMessageCell = beginCell().store(storeMessage(outMessage)).endCell();
    const outMessageHash = outMessageCell.hash();
  }
}
```

</TabItem>

</Tabs>

此外，在创建信息时，还可以获取信息的哈希值。请注意，这个哈希值与上一个示例中为初始化交易
而发送的消息的哈希值相同。

<Tabs>
  <TabItem value="ts" label="@ton/ton">

```typescript
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import { internal, TonClient, WalletContractV4 } from '@ton/ton';
import { toNano } from '@ton/core';

const tonClient = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' });

const mnemonic = await mnemonicNew();
const keyPair = await mnemonicToPrivateKey(mnemonic);
const wallet = tonClient.open(WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 }));
const transfer = await wallet.createTransfer({
  secretKey: keyPair.secretKey,
  seqno: 0,
  messages: [
    internal({
      to: wallet.address,
      value: toNano(1)
    })
  ]
});
const inMessageHash = transfer.hash();
```

</TabItem>

</Tabs>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/overview.mdx
================================================
import Button from '@site/src/components/button'

# 入门指南

在深入研究 DApps 之前，请确保您了解区块链的基本原理。您可能会发现我们的 [The Open Network](/v3/concepts/dive-into-ton/introduction) 和 [Blockchain of Blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) 文章很有用。

TON DApps 是与区块链交互的无后台应用程序。在大多数情况下，它们与自定义的 [智能合约](/v3/documentation/smart-contracts/overview) 交互；本文档提供了处理 TON 中可用的标准资产的方法，既可作为示例，也可用于快速开发 DApp。

DApp 通常可以用任何具有 TON SDK 的编程语言编写。实际上，最常见的选择是网站，其次是 Telegram 小应用程序。

<Button href="/v3/guidelines/dapps/tma/overview" colorType={'primary'} sizeType={'sm'}>

构建一个TMA

</Button>

<Button href="/v3/guidelines/dapps/apis-sdks/sdk" colorType="secondary" sizeType={'sm'}>

选择 SDK

</Button>

## TON 课程：DApps

:::tip
在开始课程之前，请确保您已充分了解区块链技术的基础知识。如果您的知识有缺口，我们建议您学习[区块链基础知识与TON](https://stepik.org/course/201294/promo) （[俄语版](https://stepik.org/course/202221/), [中文版](https://stepik.org/course/200976/))课程。
模块 3 涵盖 Dapp 的基础知识。
:::

模块 5 和 6 完全涵盖 DApps 开发。您将学习如何创建 DApp、如何使用 TON Connect、如何使用 SDK 以及如何使用区块链。

模块 5 和 6 完全涵盖 DApps 开发。您将学习如何创建 DApp、如何使用 TON Connect、如何使用 SDK 以及如何使用区块链。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

查看 TON 区块链课程

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

中文

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

俄文

</Button>

## 基本工具和资源

以下是您在 DApp 开发过程中需要的一些关键资源：

1. [开发者钱包](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps)
2. [区块链浏览器](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton)
3. [API 文档](/v3/guidelines/dapps/apis-sdks/api-types)
4. [各种语言的 SDK](/v3/guidelines/dapps/apis-sdks/sdk)
5. [使用测试网](/v3/documentation/smart-contracts/getting-started/testnet)
6. [TON解冻器](https://unfreezer.ton.org/)

### 资产管理

使用资产？这些指南涵盖了基本要素：

- [支付处理](/v3/指南/应用程序/资产处理/支付处理)
- [Token (Jetton) 处理](/v3/guidelines/dapps/asset-processing/jettons)
- [处理 NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [解析元数据](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

### DeFi 入门

对去中心化金融（DeFi）感兴趣？下面介绍如何处理不同类型的资产：

- [了解 Toncoin](/v3/documentation/dapps/defi/coins)
- [代币：Jettons 和 NFT](/v3/documentation/dapps/defi/tokens)
- [ TON 支付](/v3/documentation/dapps/defi/ton-payments)
- [设置订阅](/v3/documentation/dapps/defi/subscriptions)

## DeFi 基础知识

### DeFi 基础知识

- 创建第一个Token：[铸造第一个Token](/v3/guidelines/dapps/tutorials/mint-your-first-token)
- 循序渐进：[NFT 藏品铸造](/v3/guidelines/dapps/tutorials/nft-minting-guide)

### JavaScript

#### JavaScript

- [付款流程](https://github.com/toncenter/examples)
- [TON Bridge](https://github.com/ton-blockchain/bridge)
- [网络钱包](https://github.com/toncenter/ton-wallet)
- [饺子销售机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

#### Python

- [项目示例](https://github.com/psylopunk/pytonlib/tree/main/examples)
- [店面机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)

#### GO

- [示例](https://github.com/xssnick/tonutils-go/tree/master/example)

### 高级主题

- [零知识证明](/v3/guidelines/dapps/tutorials/zero-knowledge-proofs)

### 钱包实例

- [桌面标准钱包（C++ 和 Qt）](https://github.com/ton-blockchain/wallet-desktop)
- [Android标准钱包（Java）](https://github.com/ton-blockchain/wallet-android)
- [iOS标准钱包（Swift）](https://github.com/ton-blockchain/wallet-ios)
- [TonLib CLI（C++）](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/tonlib-cli.cpp)

## 👨‍💻 贡献

缺少某些关键材料？您可以自己编写教程，或者为社区描述问题。

<Button href="/v3/contribute/participate" colorType="primary" sizeType={'sm'}>

贡献

</Button>

<Button href="https://github.com/ton-community/ton-docs/issues/new?assignees=&labels=feature+%3Asparkles%3A%2Ccontent+%3Afountain_pen%3A&template=suggest_tutorial.yaml&title=Suggest+a+tutorial" colorType={'secondary'} sizeType={'sm'}>

提出一个教程

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/README.mdx
================================================
---
description: Telegram 小程序（或 TMA）是在 Telegram 信使中运行的 Web 应用。它们使用 Web 技术构建 —— HTML、CSS 和 JavaScript。
---
import Button from '@site/src/components/button'

# 什么是小程序？

<div style={{width: '100%', textAlign:'center', margin: '10pt auto'}}>
  <video style={{width: '100%',maxWidth: '600px', borderRadius: '10pt'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/twa.mp4" type="video/mp4" />

您的浏览器不支持视频标签。

  </video>
</div>

Telegram 小程序（或 TMA）是在 Telegram 信使中运行的 Web 应用。它们使用 Web 技术构建 —— HTML、CSS 和 JavaScript。

解锁通往 **8 亿 Telegram 用户** 的大门。想象一下，仅通过一次点击就能将您的应用或服务提供给这庞大的用户基础。


<Button href="/develop/dapps/telegram-apps/step-by-step-guide" colorType={'primary'} sizeType={'sm'}>

逐步指导

</Button>


<Button href="/develop/dapps/telegram-apps/app-examples" colorType={'secondary'} sizeType={'sm'}>

查看示例

</Button>


## 概览

Telegram 机器人可以完全替代任何网站。它们支持无缝授权、通过 20 个支付提供商（包括开箱即用的 Google Pay 和 Apple Pay）进行集成支付、向用户发送定制的推送通知，以及更多功能。

通过小程序，机器人获取了全新的维度。机器人开发者可以使用 JavaScript（世界上使用最广泛的编程语言）创建灵活多变的界面。

以下是有关 Telegram 小程序的一些关键点：

- **在 Telegram 内集成**：Telegram 小程序旨在无缝集成到 Telegram 应用中，为用户提供一致的体验。它们可以从 Telegram 聊天或群组对话中访问。
- **增强功能**：Telegram 小程序可以提供广泛的功能。它们可用于各种目的，如游戏、内容分享、生产力工具等。这些应用扩展了 Telegram 平台超出基本消息传递的能力。
- **跨平台兼容性**：由于 Telegram 小程序基于 Web，它们可在 Android、iOS、PC、Mac 和 Linux 的 Telegram 应用上使用。用户可以一键访问它们，无需额外安装。
- **机器人互动**：Telegram 小程序通常利用 Telegram 机器人提供交互式和自动化的体验。机器人可以响应用户输入、执行任务，并在小程序内促进互动。
- **开发框架**：开发者可以使用 HTML、CSS 和 JavaScript 等 Web 开发技术构建 Telegram 小程序。此外，Telegram 提供了开发者工具和 API 用于创建这些应用并将其与 Telegram 平台集成。
- **变现机会**：Telegram 小程序可以通过各种方式变现，如应用内购买、订阅模型或广告，使其对开发者和企业具有吸引力。
- **Web3 准备就绪**：TON SDK；TON Connect 是钱包和 TON 中应用之间的通信协议；代币
- **社区发展**：Telegram 拥有一个蓬勃发展的开发者社区，许多第三方开发者创建并与用户分享他们的 Telegram 小程序。这种社区驱动的方法促进了可用应用的创新和多样性。

总体而言，Telegram 小程序作为增强 Telegram 体验的手段，提供额外的功能和服务，同时为开发者提供在 Telegram 生态系统内创建和分发应用的机会。

## 入门

### TMA 文档

- [Telegram 小程序文档](https://docs.telegram-mini-apps.com) —— TWA 的社区驱动文档。
- [Telegram 提供的 TMA 文档](https://core.telegram.org/bots/webapps) —— Telegram 网站上的完整描述。

### Telegram 开发者社区

加入专门的 Telegram 开发者聊天群，讨论小程序的开发并获得支持：


<Button href="https://t.me/+1mQMqTopB1FkNjIy" colorType={'primary'} sizeType={'sm'}>

加入聊天

</Button>


### 小程序 SDK

- [twa-dev/sdk](https://github.com/twa-dev/sdk) —— TMA SDK 的 NPM 包
- [twa-dev/boilerplate](https://github.com/twa-dev/Boilerplate) —— TWA 的另一个样板。
- [twa-dev/Mark42](https://github.com/twa-dev/Mark42) —— Mark42 是 TWA 的一个简单轻量级可抖动 UI 库。
- [ton-defi-org/tonstarter-twa](https://github.com/ton-defi-org/tonstarter-twa) —— 与 TON 互动的新 TWA 模板。

## 与 TON Connect 集成

借助 TON Connect 协议与用户钱包连接。在此了解更多信息：


<Button href="/develop/dapps/ton-connect/overview" colorType={'primary'} sizeType={'sm'}>

探索 TON Connect

</Button>




================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/grants.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/grants.mdx
================================================
import Button from '@site/src/components/button'

# 资助

## Telegram Web3 Grants

为了进一步推动创新，[TON Foundation](https://ton.foundation/en) 推出了 [Telegram Web3 Grants](http://t.me/toncoin/991) 计划。这项倡议旨在激励更多的开发者创造新平台或将现有平台迁移到 TON 和 Telegram。

## 如何参与？

无论您是成熟的企业、新创公司，还是个人开发者，现在都是参与的最佳时机。通过 [这个机器人](https://t.me/app_moderation_bot) 提交您的 Telegram 应用，并考虑参与 [Grants计划](https://t.me/trendingapps/33)。让我们一起开拓未来。

<Button href="https://t.me/app_moderation_bot" colorType={'primary'} sizeType={'sm'}>

提交应用

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/monetization.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/monetization.mdx
================================================
import Button from '@site/src/components/button'
import ThemedImage from '@theme/ThemedImage';

# 支付

## Wallet Pay

<br></br>
<img src="https://storage.googleapis.com/ton-strapi/reason_Card5_19eeac1401/reason_Card5_19eeac1401.png" alt="Wallet Pay illustration"/>
<br></br>
Wallet Pay 是 Telegram 小程序的主要支付系统，支持加密货币和法币交易。监控您的订单统计数据并轻松提款。
Wallet Pay 嵌入于 Wallet 生态系统内，便于商家和客户之间的无缝金融交易。

相关链接

- [Wallet Pay 商业支持](https://t.me/WalletPay_supportbot) 是一个 Telegram 机器人，用于联系 Wallet Pay 支持团队。
- [Demo Store Bot](https://t.me/PineAppleDemoWPStoreBot) 是一个 Telegram 机器人，用于介绍 Wallet Pay 功能。（注意：所有支付都是用真实资产进行的）
- [商户社区](https://t.me/+6TReWBEyZxI5Njli) 是一个 Telegram 群组，用于群组成员之间分享经验和解决方案。

## TON Connect

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ton-connect/ton-connect_1.svg?raw=true',
    dark: '/img/docs/ton-connect/ton-connect_1-dark.svg?raw=true',
  }}
/>
<br></br>

TON Connect 是 **钱包** 与 **应用** 在 TON 上的通信协议。

**应用** 建立在 TON 上的能够提供丰富的功能和高性能，并旨在通过智能合约保护用户资金。因为应用程序采用了区块链等去中心化技术构建，通常被称为去中心化应用（dApps）。

**钱包** 提供批准交易的用户界面，并在用户的个人设备上安全地保存用户的加密密钥。这种关注点的分离使得创新迅速且安全性高：钱包无需自己构建封闭生态系统，而应用程序不需要承担持有终端用户帐户的风险。

TON Connect 旨在提供钱包与应用程序之间无缝的用户体验。

<Button href="/develop/dapps/ton-connect/overview" colorType={'primary'} sizeType={'sm'}>

了解 TON Connect

</Button>

## 集成代币

您可以在 TON 区块链上创建自己的代币并将其集成到您的应用程序中。您也可以将现有的代币集成到您的应用程序中。

<Button href="/develop/dapps/defi/tokens" colorType={'primary'} sizeType={'sm'}>

了解 DeFi

</Button>

## TON 上的订阅

由于 TON 区块链上的交易快速且网络费用低廉，您可以通过智能合约处理链上的周期性付款。

例如，用户可以订阅数字内容（或其他任何东西）并被收取每月 1 TON 的费用。

<Button href="/develop/dapps/defi/subscriptions" colorType={'primary'} sizeType={'sm'}>

了解更多

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/publishing.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/publishing.mdx
================================================
import Button from '@site/src/components/button'

# 发布小程序

作为开发者，了解我们所处的生态系统是非常重要的。Telegram 为小程序开发者提供了独特的机会，得益于其强大的平台和广泛的用户基础。本文将指导您通过 Telegram 可用的渠道发布您的小程序。

## tApps 中心

**什么是 tApps 中心？** TON 基金会引入了 Telegram 应用中心，以创建 Telegram 机器人和小程序 (TMAs) 的集中式库。这个平台旨在通过提供一个类似于您已经熟悉的知名应用商店的界面来增强用户体验。

**广泛的生态系统支持**。Telegram 应用中心不仅仅关注 TON 生态系统；它还欢迎来自其他区块链的应用。您甚至不需要 web3 集成就可以成为这个目录的一部分。这种包容性的做法旨在将 Telegram 建立成一个“一切皆应用”的超级应用，类似于微信等平台，用户可以在一个界面访问多种服务。

<Button href="https://www.tapps.center/" colorType={'primary'} sizeType={'sm'}>

打开 tApps 中心

</Button>

### 为什么在 tApps 中心发布？

**更大的曝光度**。Telegram 应用中心为开发者提供了一个展示他们项目给广泛受众的绝佳机会，使得吸引用户和投资者变得更加容易。

**社区精神**。该平台采取了以社区为中心的方法，鼓励合作以及资源和知识的共享。

<Button href="https://blog.ton.org/ton-ecosystem-evolved-introducing-telegram-apps-center-t-apps-center" colorType={'secondary'} sizeType={'sm'}>

在 TON 博客中阅读更多

</Button>

## 在 Telegram 内启动

Telegram 目前支持六种不同的方式来启动小程序：从 [键盘按钮](https://core.telegram.org/bots/webapps#keyboard-button-web-apps)、从 [内联按钮](https://core.telegram.org/bots/webapps#inline-button-web-apps)、从 [机器人菜单按钮](https://core.telegram.org/bots/webapps#launching-web-apps-from-the-menu-button)、通过 [内联模式](https://core.telegram.org/bots/webapps#inline-mode-web-apps)、从 [直接链接](https://core.telegram.org/bots/webapps#direct-link-web-apps) 启动 — 甚至从 [附件菜单](https://core.telegram.org/bots/webapps#launching-web-apps-from-the-attachment-menu) 中启动。

![](/img/docs/telegram-apps/publish-tg-1.jpeg)

### 键盘按钮小程序

**简而言之：** 从 **web_app** 类型的 [键盘按钮](https://core.telegram.org/bots/api#keyboardbutton) 启动的小程序可以使用 [Telegram.WebApp.sendData](https://core.telegram.org/bots/webapps#initializing-web-apps) 将数据以 _服务消息_ 的形式发送回机器人。这使得机器人能够在不与任何外部服务器通信的情况下产生响应。

用户可以使用 [自定义键盘](https://core.telegram.org/bots#keyboards)、[机器人消息下的按钮](https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating)，以及发送自由格式的 **文本消息** 或 Telegram 支持的任何 **附件类型** 与机器人互动：照片和视频、文件、地点、联系人和投票。为了更多的灵活性，机器人可以利用 **HTML5** 的全部功能来创建用户友好的输入接口。

您可以发送一个 **web_app** 类型的 [KeyboardButton](https://core.telegram.org/bots/api#keyboardbutton)，以从指定的 URL 打开一个小程序。

要将数据从用户传回机器人，小程序可以调用 [Telegram.WebApp.sendData](https://core.telegram.org/bots/webapps#initializing-web-apps) 方法。数据将以字符串形式通过服务消息传输给机器人。机器人在接收到数据后可以继续与用户通信。

**适合：**

- **自定义数据输入界面**（用于选择日期的个性化日历；带高级搜索选项的列表选择数据；让用户“转动轮盘”并从可用选项中选择一个的随机器等等。）
- **可复用组件**，不依赖于特定的机器人。

### 内联按钮小程序

**简而言之：** 对于像 [@DurgerKingBot](https://t.me/durgerkingbot) 这样更互动的小程序，使用 **web_app** 类型的 [内联键盘按钮](https://core.telegram.org/bots/api#inlinekeyboardbutton)，它可以获取基本用户信息，并可用于代表用户向机器人聊天发送消息。

如果仅接收文本数据不足够，或者您需要更高级和个性化的界面，您可以使用 **web_app** 类型的 [内联键盘按钮](https://core.telegram.org/bots/api#inlinekeyboardbutton) 打开一个小程序。

从按钮中打开的小程序会和按钮中指定的 URL 一样。除了用户的 [主题设置](https://core.telegram.org/bots/webapps#color-schemes)，它还会收到基本的用户信息（ID、名称、用户名、语言代码）和一个唯一的会话标识符，**query_id**，这允许代表用户的消息被发送回机器人。

机器人可以调用 Bot API 方法 [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 来发送内联消息从用户返回到机器人并关闭小程序。接收到消息后，机器人可以继续与用户通信。

**适合：**

- 完全成熟的 Web 服务和任何类型的集成。
- 使用案例实际上是 **无限的**。

### 从菜单按钮启动小程序

**简而言之：** 小程序可以从定制的菜单按钮启动。这仅仅提供了一种更快访问应用的方式，并且与 [从内联按钮启动小程序](https://core.telegram.org/bots/webapps#inline-button-web-apps) 没有区别。

默认情况下，与机器人的聊天总是显示一个方便的 **菜单按钮**，提供快速访问所有列出的 [命令](https://core.telegram.org/bots#commands)。使用 [Bot API 6.0](https://core.telegram.org/bots/api-changelog#april-16-2022)，这个按钮可以用来 **启动一个小程序** 代替。

要配置菜单按钮，您必须指定它应该显示的文本和小程序的 URL。有两种设置这些参数的方法：

- 为了为 **所有用户** 自定义按钮，请使用 [@BotFather](https://t.me/botfather)（/setmenubutton 命令或 _Bot 设置 > 菜单按钮_）。
- 为了为 **所有用户** 和 **特定用户** 自定义按钮，请使用 Bot API 中的 [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton) 方法。例如，根据用户的语言更改按钮文本，或根据用户在您的机器人中的设置显示不同的 Web 应用链接。

除此之外，通过菜单按钮打开的 Web 应用与 [使用内联按钮时](https://core.telegram.org/bots/webapps#inline-button-web-apps) 的工作方式完全相同。

[@DurgerKingBot](https://t.me/durgerkingbot) 允许从内联按钮和菜单按钮启动其小程序。

### 内联模式小程序

**简而言之：** 通过 **web_app** 类型的 [InlineQueryResultsButton](https://core.telegram.org/bots/api#inlinequeryresultsbutton) 启动的小程序可以在内联模式中的任何地方使用。用户可以在 Web 界面中创建内容，然后通过内联模式无缝发送到当前聊天。

您可以在 [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery) 方法中使用 _button_ 参数来显示一个特殊的“切换到小程序”的按钮，它可以在内联结果的上方或者代替内联结果显示。这个按钮将 **打开一个指定 URL 的小程序**。完成后，您可以调用 [Telegram.WebApp.switchInlineQuery](https://core.telegram.org/bots/webapps#initializing-web-apps) 方法将用户送回内联模式。

内联小程序 **无法访问** 聊天 - 它们不能读取消息或代表用户发送新消息。要发送消息，用户必须被重定向到 **内联模式** 并主动选择一个结果。

**适合：**

- 在内联模式中的完全成熟的 Web 服务和集成。

### 直接链接小程序

**简而言之：** 小程序机器人可以从任何聊天中的直接链接启动。它们支持 _startapp_ 参数并且知道当前聊天上下文。

NEW 您可以使用直接链接在当前聊天中 **直接打开一个小程序**。如果链接中包含非空的 _startapp_ 参数，它将在 _start_param_ 字段和 GET 参数 _tgWebAppStartParam_ 中传递给小程序。

在这种模式下，小程序可以使用 _chat_type_ 和 _chat_instance_ 参数来跟踪当前聊天上下文。这引入了对多个聊天成员的 **并发** 和 **共享** 使用的支持 - 创建实时白板、团体订购、多人游戏和类似应用。

从直接链接打开的小程序 **无法访问** 聊天 - 它们不能读取消息或代表用户发送新消息。要发送消息，用户必须被重定向到 **内联模式** 并主动选择一个结果。

**示例**

- https://t.me/botusername/appname
- https://t.me/botusername/appname?startapp=command

**适合：**

- 任何用户都可以一键打开的完全成熟的 Web 服务和集成。
- 协作、多人或团队合作导向的聊天上下文中的服务。

使用案例实际上是 **无限的**。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/testing-apps.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/testing-apps.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage'

# 测试小程序

## 在测试环境中使用机器人

要登录测试环境，请使用以下任一方式：

- **iOS：** 在设置图标上点击 10 次 > 账号 > 登录另一个账户 > 测试。
- **Telegram 桌面版：** 打开 ☰ 设置 > Shift + Alt + 右键点击“添加账号”并选择“测试服务器”。
- **macOS：** 点击设置图标 10 次以打开调试菜单，⌘ + 点击“添加账号”并通过电话号码登录。

测试环境与主环境完全分开，因此你需要创建一个**新的用户账号**和一个与 @BotFather 的**新机器人**。

收到你的机器人令牌后，你可以按照此格式向 Bot API 发送请求：

`https://api.telegram.org/bot<token>/test/METHOD_NAME`

**注意：** 在使用测试环境时，你可以使用未启用 TLS 的 HTTP 链接来测试你的小程序。

## 小程序的调试模式

使用这些工具在你的小程序中找到特定于应用程序的问题：

### 安卓

- 在你的设备上[启用 USB-调试](https://developer.chrome.com/docs/devtools/remote-debugging/)。
- 在 Telegram 设置中，一直滚动到底部，两次按住**版本号**。
- 在调试设置中选择_启用 WebView 调试_。
- 将手机连接到电脑并在 Chrome 中打开 chrome://inspect/#devices - 当你在手机上启动时，你会在那里看到你的小程序。

### Telegram 桌面版（Windows 和 Linux）

iOS 网络视图调试需要 Safari 桌面浏览器，因此需要 macOS。

**在 iOS 设备上：**

- 下载并启动 Telegram macOS 的[测试版](https://telegram.org/dl/macos/beta)。
- 快速点击设置图标 5 次以打开调试菜单并启用“调试小程序”。
- 向下滚动并按下 _Advanced_。
- 启用 _Web Inspector_ 选项。

在小程序中点击右键并选择 _检查元素_。

- 打开 Safari 浏览器。
- 打开 _Settings_ （⌘ + ，）。
- 选择 _Advanced_ 选项卡。
- 选中底部的 _Show features for web developers_ 选项。

[Eruda](https://github.com/liriliri/eruda) 是一个提供基于 Web 的控制台的工具，用于在移动设备和桌面浏览器上调试和检查网页。以下是在 Telegram 小程序项目中使用 Eruda 的逐步指南。

- 通过数据线将 iOS 设备连接到 Mac。
- 在 iOS Telegram 客户端中打开 Mini App。
- 在 macOS 的 Safari 菜单栏中打开 _Develop_ 标签。
- 选择已连接的 iPhone。
- 可选项：选择 _Connect via network_ 并拔掉电缆。
- 在 _Telegram_ 块下选择已打开的网络视图 URL。

### 步骤 1：包含 Eruda 库

- 在 **Windows**、**Linux** 或 **macOS** 上下载并启动最新版本的 Telegram Desktop（目前版本为 5.0.1）。
- 转到 _设置 > 高级 > 实验性设置 > 启用 webview 检查_。
- 在 Windows 和 Linux 上，右键单击 WebView 并选择 _Inspect_。
- 在 macOS 上，您需要通过 [Safari 开发者菜单](https://support.apple.com/en-gb/guide/safari/sfri20948/mac)
  访问 Inspect，右键单击上下文菜单中无法使用 Inspect。

### Telegram macOS

- 下载并启动 Telegram macOS 的[测试版](https://telegram.org/dl/macos/beta)。
- 快速点击设置图标 5 次以打开调试菜单并启用“调试小程序”。

在小程序中点击右键并选择 _检查元素_。

## 步骤 2：初始化 Eruda

接下来，你需要初始化 Eruda。你通常在网页加载时执行此操作。如果你通过 CDN 运行 Eruda。

![1](/img/docs/telegram-apps/eruda-1.png)

### 步骤 1：包含 Eruda 库

首先，在 HTML 文件中包含 Eruda 库。您可以从 CDN 加载它：

```html
<!-- Include Eruda from CDN (Recommended) -->
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
```

部署你的小程序，启动它，然后只需按 Eruda 图标即可开始调试！

```bash npm2yarn
npm install eruda --save
```

### 步骤 2：初始化 Eruda

接下来，在网页加载时初始化 Eruda。如果您从 CDN 使用 Eruda，请执行此操作：

```html
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>
  // Initialize Eruda
  eruda.init();
</script>

```

如果你喜欢新的工具和包，则将此脚本添加到你的项目中：

```jsx
import eruda from 'eruda'

eruda.init()
```

### 步骤 3：启动 Eruda

部署好 Mini App 后，启动它，只需按下 Eruda 图标即可开始调试！

<ConceptImage style={{maxWidth:'200pt', margin: '10pt 20pt 0 0', display: 'flex-box'}} src="/img/docs/telegram-apps/eruda-2.png" />
<ConceptImage style={{maxWidth:'200pt', margin: '10pt 20pt', display: 'flex-box'}}  src="/img/docs/telegram-apps/eruda-3.png" />



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/tips-and-tricks.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/tips-and-tricks.mdx
================================================
# 小贴士和技巧

在本页中，您将找到一系列与TMA中常见问题相关的常见问题解答。

### 如何解决 TMA 中的缓存溢出问题？

:::tip
只有重新安装Telegram应用程序可能会有所帮助。
:::

### 有关 HTML 文件的缓存头部是否有任何推荐？

:::tip
It's preferable to switch off cache in the HTML. To ensure your cache switched off, specify headers in your request according the following:

```curl
Cache-Control: no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

:::

### 推荐用于 TMA 开发的 IDE 是什么？

在Google Chrome中进行开发过程更加方便，因为有熟悉的开发工具。

您可以检索小程序的启动参数并在Chrome中打开此链接。在我们的案例中，最简单的方法是从Telegram的Web版本检索启动参数：https://web.telegram.org/

### 结束行为

在许多Web应用程序中，用户在向上滚动时可能会无意中关闭应用。如果他们将应用程序的一个部分拖得太远，无意中触发了应用关闭，就会发生这种情况。

<p align="center">
    <br />
    <img width="240" src="/img/docs/telegram-apps/closing-behaviour.svg" alt="closing_behaviour_durgerking" />
    <br />
</p>

为了防止这种意外关闭，启用TMA中的`closing_behavior`。这个方法会添加一个对话框，用户可以批准或拒绝关闭Web应用。

```typescript
window.Telegram.WebApp.enableClosingConfirmation()
```

## 如何为 TMA 中特定语言指定描述？

:::tip
You can configure your description with following methods:

- https://core.telegram.org/bots/api#setmydescription
- https://core.telegram.org/bots/api#setmyshortdescription

:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/notcoin.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/notcoin.mdx
================================================
# Notcoin

## 链接

- [Notcoin telegram 小程序](https://t.me/notcoin_bot/click)
- [GitHub团队](https://github.com/OpenBuilders)
- [Notcoin clicker 前端](https://github.com/OpenBuilders/notcoin-clicker)
- [Notcoin 智能合约](https://github.com/OpenBuilders/notcoin-contract)

## 项目说明

Notcoin 由 TON 区块链的开发者 Open Builders 创建。它是一种开创性的数字资产，迅速吸引了网络社区的关注，玩家数量达到了令人印象深刻的 400 万。与传统的加密货币不同，NotCoin 的设计采用了一种独特的方法，将游戏化、社交互动和数字稀缺性等元素结合在一起，创造出一种引人入胜的用户体验。这一创新不仅挑战了人们对数字货币的传统看法，还展示了数字资产病毒式增长的潜力。

### 主要功能

- **游戏化**：NotCoin 在其生态系统中融入了游戏元素，通过挑战、成就和奖励鼓励用户参与。这种方法与其他加密货币基于交易的典型模式大相径庭，让更多的人更容易接触到它，也更喜欢它。
- **社会动态**：该平台利用社交网络和社区建设作为其战略的核心部分。用户会主动邀请朋友并参与社区活动，从而培养归属感，并极大地促进其病毒式传播。
- **数字稀缺性和奖励**：NotCoin 采用数字稀缺性机制，确保资产的价值和追捧度。此外，还采用奖励制度，鼓励积极参与并为社区做出贡献。
- **创新技术**：NotCoin 的底层技术旨在实现可扩展性、安全性和易用性。这就确保了随着平台的发展，它仍能保持高效，并为全球用户所使用。
- **环境因素**：NotCoin 采取有意识的方式来应对环境影响，在运营中使用节能方法，并在社区内推广可持续发展实践。

### 摘要

NotCoin 的玩家数量增至 400 万，证明了其在数字资产方面的创新做法。通过将游戏化、社会动力、数字稀缺性和尖端技术结合起来，NotCoin 在加密货币领域建立了一种新的模式。它对社区和环境可持续发展的关注进一步使其与众不同，使其不仅仅是一种数字货币，而是一场迈向更具参与性和责任感的数字经济的运动。该平台的成功预示着人们对另类数字货币的兴趣与日俱增，也预示着这一领域病毒式增长的潜力，对数字时代传统的价值和社区概念提出了挑战。

## 前端

该项目功能非常简单。Notcoin 组件是一个交互式按钮，可通过动画和动态更新对用户的触摸做出反应。该组件可用于需要动画和用户操作反馈的各种交互式应用程序（游戏）中。

## 智能合约

### Notcoin Jetton

Jetton 分叉自 https://github.com/ton-blockchain/stablecoin-contract，但去除了治理功能。

### 详细信息

Notcoin 代表了一种具有附加功能的标准 TON jetton 智能合约：

- jetton 管理员可以更改 jetton-minter 代码及其全部数据。

:::warning
发行方必须非常谨慎地管理管理员账户的私钥，以避免潜在的被黑客攻击的风险。强烈建议使用多签名钱包作为管理员账户，并将私钥分别存储在不同的隔离设备或硬件钱包中。
:::

:::warning
合约不会检查升级信息中的代码和数据，因此，如果您发送了无效数据或代码，就有可能破坏合约。因此，您应该始终在测试网络中检查升级。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/overview.mdx
================================================
---
description: Telegram 小程序（或 TMA）是在 Telegram 信使中运行的网络应用程序。它们使用网页技术（HTML、CSS 和 JavaScript）构建。
---

import Button from '@site/src/components/button'

# 什么是小程序？

<div style={{width: '100%', textAlign:'center', margin: '10pt auto'}}>
  <video style={{width: '100%',maxWidth: '600px', borderRadius: '10pt'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/twa.mp4" type="video/mp4" />

```
Your browser does not support the video tag.
```

</video>
</div>

Telegram 小程序（或 TMA）是在 Telegram 信使中运行的 Web 应用。它们使用 Web 技术构建 —— HTML、CSS 和 JavaScript。

:::tip
由于 TMA 是网页并使用 JavaScript，因此需要选择 [JS/TS-based SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)。
:::

打开通向**9 亿 Telegram 用户的大门**。想象一下，只需轻轻一点，就能向这一庞大的用户群提供您的应用程序或服务。

<Button href="/v3/guidelines/dapps/tma/tutorials/step-by-step-guide" colorType={'primary'} sizeType={'sm'}>

分步指南

</Button>

<Button href="/v3/guidelines/dapps/tma/tutorials/app-examples" colorType={'secondary'} sizeType={'sm'}>

参见示例

</Button>

## 概述

Telegram 机器人可以完全取代任何网站。它们支持无缝授权、通过 20 个支付提供商进行集成支付（包括谷歌支付和苹果支付）、向用户提供定制的推送通知等。 

有了 Mini Apps，机器人有了全新的维度。机器人开发人员可以使用世界上使用最广泛的编程语言 JavaScript 创建无限灵活的界面。

以下是有关 Telegram 小程序的一些关键点：

- **整合到 Telegram 中**：Telegram 小程序旨在无缝集成到 Telegram 应用程序中，为用户提供连贯的体验。您可以在 Telegram 聊天或群组对话中访问它们。
- **增强功能**：Telegram 小程序可提供多种功能。它们可用于各种用途，如游戏、内容共享、生产力工具等。这些应用程序将 Telegram 平台的功能扩展到了基本信息之外。
- **跨平台兼容性**：由于 Telegram 小程序基于网络，因此可在 Android、iOS、PC、Mac 和 Linux Telegram 应用程序上使用。用户无需额外安装，只需一键点击即可访问。
- **机器人互动**：Telegram 小程序通常使用 Telegram 机器人来提供互动和自动化体验。机器人可以响应用户输入、执行任务并促进小程序内的互动。
- **开发框架**：开发人员可以使用 HTML、CSS 和 JavaScript 等网络开发技术构建 Telegram 小程序。此外，Telegram 还提供开发工具和应用程序接口，用于创建这些应用程序并将其与 Telegram 平台集成。
- **货币化机会**：Telegram 小程序可以通过各种方式盈利，如应用内购买、订阅模式或广告，因此对开发人员和企业具有吸引力。
- **Web3就绪**：TON SDK；TON Connect 是一种通信协议，可促进钱包与 TON 区块链上的应用程序之间的通信；代币
- **社区开发**：Telegram 拥有一个蓬勃发展的开发者社区，许多第三方开发者创建并与用户分享他们的 Telegram 小程序。这种社区驱动的方式促进了可用应用程序的创新和多样性。

总之，Telegram 小程序通过提供额外的功能和服务来增强 Telegram 体验，同时也为开发者提供了在 Telegram 生态系统中创建和发布应用程序的机会。

## 入门

### TMA 文档

- [Telegram 小程序文档](https://docs.telegram-mini-apps.com) - 由社区驱动的 TWA 文档。
- [Telegram 提供的 TMA 文档](https://core.telegram.org/bots/webapps) - Telegram 网站上的完整说明。

### Telegram 开发人员社区

加入 Telegram 开发者特别聊天室，讨论小程序的开发并获得支持：

<Button href="https://t.me/+1mQMqTopB1FkNjIy" colorType={'primary'} sizeType={'sm'}>

加入聊天

</Button>

### 小程序 SDK

- [twa-dev/sdk](https://github.com/twa-dev/sdk) - TMA SDK 的 NPM 软件包
- [twa-dev/boilerplate](https://github.com/twa-dev/Boilerplate) - 新 TWA 的另一个模板。
- [twa-dev/Mark42](https://github.com/twa-dev/Mark42) - Mark42 是一个用于 TWA 的简单轻量级树形可抖用户界面库。
- [ton-defi-org/tonstarter-twa](https://github.com/ton-defi-org/tonstarter-twa) - 新 TWA 与 TON 交互作用的模板。

## 与 TON Connect 集成

借助 TON Connect 协议连接用户钱包。点击此处了解更多信息：

<Button href="/v3/guidelines/ton-connect/overview" colorType={'primary'} sizeType={'sm'}>

了解 TON Connect

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/app-examples.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/app-examples.mdx
================================================
import Button from '@site/src/components/button'

# TMA 示例

查看下面的示例，了解如何创建您自己的 Telegram 小程序。

## 基础 TMA 示例

<p align="center">
  <br />
    <img width="240" src="/img/docs/telegram-apps/tapps.png" alt="logo of telegram mini apps" />
      <br />
</p>

这是一个使用纯 JavaScript、HTML 和 CSS 实现的基础且直接的 Telegram 小程序（TMA）。该项目旨在提供一个创建简单 TMA 并在 Telegram 内启动它的最简化示例，无需依赖复杂的构建工具或前沿库。

- 可通过直接链接访问应用：[t.me/simple_telegram_mini_app_bot/app](https://t.me/simple_telegram_mini_app_bot/app)
- 或者您可以通过机器人菜单按钮启动应用：[t.me/simple_telegram_mini_app_bot](https://t.me/simple_telegram_mini_app_bot)
- 部署 URL：https://telegram-mini-apps-dev.github.io/vanilla-js-boilerplate

<Button href="https://t.me/simple_telegram_mini_app_bot/app" colorType={'primary'} sizeType={'sm'}>

打开演示

</Button>

<Button href="https://github.com/Telegram-Mini-Apps-Dev/vanilla-js-boilerplate.git" colorType={'secondary'} sizeType={'sm'}>

GitHub

</Button>

### 特点

- 极简用户界面。
- 未使用外部库或框架。
- 易于理解和修改。

### 入门

#### 必要条件

要运行此示例，您需要一个支持 JavaScript 的现代 web 浏览器。

#### 安装

1. 克隆此库到您的本地机器：

```bash
git clone https://github.com/Telegram-Mini-Apps-Dev/vanilla-js-boilerplate.git
```

2. 导航至项目目录：

```bash
cd vanilla-js-boilerplate
```

在您偏好的代码编辑器或 IDE 中打开 index.html。

### 使用

1. 在您偏好的代码编辑器或 IDE 中打开 index.html。
2. 做出您的改动
3. 创建您自己的 GitHub 库，提交并推送您的更新。
4. 转到您的 GitHub 库页面并打开设置。检查“页面”选项卡和“构建与部署”部分。如果选择了 GitHub Actions 选项，资产应该被部署到页面上，并且会有像 `https://<username>.github.io/vanilla-js-boilerplate/` 这样的 URL。您可以复制此 URL，并使用 [BotFather](https://tg.me/BotFather) 机器人创建您自己的 TWA。

## 当前 TMA 示例

### 介绍

Vite（在法语中意味着“快”）是一个前端构建工具和开发服务器，旨在为现代 web 项目提供更快、更精简的开发体验。我们将利用 Vite 创建 Telegram 小程序示例。

您可以在这里找到示例项目 https://github.com/Telegram-Mini-Apps-Dev/vite-boilerplate 或者您可以按照以下说明操作。

### 必要条件

我们将从搭建您的 Vite 项目开始。

使用 NPM：

```bash
$ npm create vite@latest
```

使用 Yarn：

```bash
$ yarn create vite
```

然后按照提示操作！

或者您可以直接运行以下命令创建带有 TypeScript 支持的 React 项目：

```bash
# npm 7+, extra double-dash is needed:
npm create vite my-react-telegram-web-app -- --template react-ts

# or yarn
yarn create vite my-react-telegram-web-app --template react-ts

# this will change the directory to recently created project
cd my-react-telegram-web-app
```

### 小程序的开发

现在我们需要开始项目的开发模式，请在终端运行以下命令：

```bash
# npm
npm install
npm run dev --host

# or yarn
yarn
yarn dev --host
```

`--host` 选项允许获取带有 IP 地址的 URL，您可以在开发过程中用于测试。重要说明：在开发模式下，我们将使用自签名 SSL 证书，这将使我们能够仅在 Telegram 的 web 版本 [https://web.telegram.org](https://web.telegram.org/a/#6549734463)/ 中测试我们的应用，由于其他平台（iOS、Android、MacOS）的政策。

我们需要添加 `@vitejs/plugin-basic-ssl` 插件：

```bash npm2yarn
npm install @vitejs/plugin-basic-ssl
```

现在我们需要更改 `vite.config.ts`。添加导入：

```jsx
import basicSsl from '@vitejs/plugin-basic-ssl';
```

并添加插件

```jsx
export default defineConfig({
   plugins: [react(), basicSsl()]
});
```

您可以使用 `ngrok` 将您的本地服务器暴露给互联网并附加 SSL 证书。您将能够在所有 Telegram 平台上使用热模块替换进行开发。打开新的终端窗口并运行：

```bash
# where 5173 is the port number from npm/yarn dev --host
ngrok http 5173
```

此外，我们将准备我们的项目以部署到 GitHub Pages：

```jsx
export default defineConfig({
   plugins: [react(), basicSsl()],
	 build: {
	   outDir: './docs'
	 },
   base: './'
});
```

我们将使用 GitHub Actions 部署脚本，该脚本将在针对 master 分支的推送上运行。从您的项目根目录开始：

```bash
# we are going to create GitHub Actions config for deployment
mkdir .github
cd .github
mkdir workflows
cd workflows
touch static.yml
```

现在将此配置添加到 `static.yml`：

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['master']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: './'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          # Upload dist repository
          path: './docs'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

别忘了在您的 GitHub 库的设置→页面中为构建和部署选择 GitHub Actions 选项。现在，每次推送后，您的代码将被部署到页面。

![Screenshot 2023-09-11 at 22.07.44.png](/img/docs/telegram-apps/modern-1.png)

现在我们将添加 `@twa-dev/sdk`。Telegram 通过[链接](https://core.telegram.org/bots/webapps#initializing-web-apps)分发 SDK。这是一种处理库的旧时方式。`@twa-dev/sdk` 包允许像处理 npm 包一样使用 SDK，并支持 TypeScript。

```bash npm2yarn
npm install @twa-dev/sdk
```

打开 `/src/main.tsx` 文件并添加以下内容：

```tsx
import WebApp from '@twa-dev/sdk'

WebApp.ready();

ReactDOM.createRoot...
```

`WebApp.ready()` - 是一个方法，向 Telegram 应用程序通知小程序已准备好显示。建议尽可能早地调用此方法，一旦加载了所有必要的接口元素。一旦调用此方法，加载的占位符将被隐藏，小程序将被显示。

然后我们将添加与用户的一些交互。进入 `src/App.tsx`，我们将添加带有警告的按钮。

```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import WebApp from '@twa-dev/sdk'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
		{/* Here we add our button with alert callback */}
      <div className="card">
        <button onClick={() => WebApp.showAlert(`Hello World! Current count is ${count}`)}>
            Show Alert
        </button>
      </div>
    </>
  )
}

export default App
```

现在我们需要创建 Telegram 机器人，这样我们就可以在Telegram应用程序中启动 Telegram 小程序。

### 为应用设置机器人

要将您的小程序连接到 Telegram，您需要创建一个机器人并为其设置小程序。按照以下步骤设置新的 Telegram 机器人：

<Button href="/develop/dapps/telegram-apps/step-by-step-guide#setting-up-a-bot-for-the-app" colorType={'primary'} sizeType={'sm'}>

设置机器人

</Button>

### 提示

使用自签名 SSL 证书，您可以遇到此类警告的问题。点击“Advanced”按钮，然后点击 `Proceed <local dev server address here>`。未采取这些步骤，您将无法在 Telegram 的 web 版本中进行调试

![Screenshot 2023-09-11 at 18.58.24.png](/img/docs/telegram-apps/modern-2.png)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/design-guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/design-guidelines.mdx
================================================
# TMA 设计指南

:::info
从 **6.10** 版本开始，Telegram 更新了小程序的配色方案：修正了一些旧的配色，同时添加了新的配色。
:::

为了更好地理解背景，让我们回顾一下历史上的更新。

更新日志。

1. `bg_color` 和 `secondary_bg_color` 已更新。

![](/img/docs/tma-design-guidelines/tma-design_1.png)

原因是：

• 最初，这些颜色是为页面背景而不是UI控制项设计的。

• 因此，为了保持一致性，这些颜色已经被更新。

• 为了给不同部分和卡片着色，添加了 `section_bg_color`。

为了提高应用程序的外观，您应该稍微调整颜色变量的使用。

上述是一个清晰的例子，准确解释了iOS上会发生什么变化。在Android上不应有任何变化。

新颜色。
此外，还增加了许多新颜色。它们中的大多数在Android上最为明显。因此，下面的示例将基于Android展示，但适用于所有平台。



2. 对于小程序，现在可以使用Telegram header的颜色。



3. 已经提供了 token accent_text_color，它适用于应用程序中的任何突出元素。以前，大家都使用了不太合适的 dark link_color。

![](/img/docs/tma-design-guidelines/tma-design_4.png)

4. 对于所有次要cell标签，现在最好使用 `subtitle_text_color`。这将提供更高对比度的标签，提高应用程序的可访问性。

![](/img/docs/tma-design-guidelines/tma-design_5.png)

5. 对于卡片的节的header，现在有了专用的token：`section_header_text_color`。

![](/img/docs/tma-design-guidelines/tma-design_6.png)

6. 对于按下会导致破坏性行动的cell，现在可以使用 `destructive_text_color` 而不是自定义颜色。

<p align="center">
    <br />
    <img width="360" src="/img/docs/tma-design-guidelines/tma-design_7.png" alt="" />
    <br />
</p>

7. [原始来源](https://telegra.ph/Changes-in-Color-Variables-for-Telegram-Mini-Apps-11-20)

我建议将它们用作部分下方的提示部分的颜色，以及 `secondary_bg_color` 这类背景的链接颜色。

## 参阅

- [原始来源](https://telegra.ph/Changes-in-Color-Variables-for-Telegram-Mini-Apps-11-20)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/step-by-step-guide.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/step-by-step-guide.mdx
================================================
# TMA 启动教程

Telegram Mini Apps（TMA）是在 Telegram 消息传递应用程序内运行的 Web 应用程序。它们是使用 Web 技术构建的 —— HTML、CSS 和 JavaScript。Telegram Mini Apps 可用于创建 DApps、游戏以及其他可以在 Telegram 内运行的应用程序类型。

## 创建你的应用程序

1. 要将你的小程序连接到 Telegram，请使用此代码放置 SDK 脚本 `telegram-web-app.js`：

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

:::tip
It's preferable to switch off cache in the HTML. To ensure your cache is switched off, specify headers in your request according to the following:

```curl
Cache-Control: no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

:::

2. 脚本连接后，一个 **[window.Telegram.WebApp](https://core.telegram.org/bots/webapps#initializing-web-apps)** 对象就变得可用。你可以在此阅读更多有关利用 [`telegram-web-app.js`](https://docs.ton.org/develop/dapps/telegram-apps/app-examples#basic-twa-example) 创建小程序的信息。

3. 连接 SDK 的现代方式是 Telegram Mini Apps SDK 的 npm 包：

```bash npm2yarn
npm i @twa-dev/sdk
```

你可以在此处找到 [`@twa-dev/sdk`](https://docs.ton.org/develop/dapps/telegram-apps/app-examples#modern-twa-example) 的指南。

5. 当你的小程序准备就绪并部署到 Web 服务器时，进行下一步。

## 为应用程序设置机器人

要将你的小程序连接到 Telegram，你需要创建一个机器人并为其设置一个小程序。按照这些步骤设置一个新的 Telegram 机器人：

### 1. 与 BotFather 启动对话

- 打开 Telegram 应用程序或网页版本。
- 在搜索栏中搜索 `@BotFather` 或跟随链接 https://t.me/BotFather。
- 通过点击 `START` 按钮来开始与 BotFather 的聊天。

### 2. 创建一个新机器人

- 向 BotFather 发送 `/newbot` 命令。
- BotFather 将要求你为你的机器人选择一个名字。这是一个显示名称，可以包含空格。
- 接下来，你将被要求为你的机器人选择一个用户名。这必须以 `bot` 结尾（例如，`sample_bot`）并且是唯一的。

### 3. 设置机器人小程序

- 向 BotFather 发送 `/mybots` 命令。
- 从列表中选择你的机器人并选择 **Bot 设置** 选项
- 选择 **菜单按钮** 选项
- 选择 **编辑菜单按钮 URL** 选项并发送你的 Telegram 小程序的 URL，例如从 GitHub Pages 部署的链接。

### 4. 访问机器人

- 现在你可以在 Telegram 的搜索栏中使用其用户名搜索你的机器人。
- 按下紧挨附件选择器旁边的按钮来在消息传递应用程序中启动你的 Telegram 小程序
- 你太棒了！



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/mint-your-first-token.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/mint-your-first-token.md
================================================
# 铸造你的第一个 Jetton

欢迎，开发者！很高兴你能来到这里。👋

在这篇文章中，我们将告诉你如何在TON上创建你的第一个可替代代币（Jetton）。

为了铸造Jettons，我们将使用[TON Minter](https://minter.ton.org/)浏览器服务。

## 📖 你将学到什么

在这篇文章中，你将学会如何：

- 使用浏览器部署Jetton
- 自定义你的代币
- 管理和使用你的代币
- 编辑代币参数

## 📌 在开始之前准备

1. 首先你需要有一个[Tonhub](https://ton.app/wallets/tonhub-wallet) / [Tonkeeper](https://ton.app/wallets/tonkeeper)钱包或[Chrome扩展](https://ton.app/wallets/chrome-plugin)或任何其他该服务支持的钱包。
2. 你的余额上必须有超过0.25 Toncoin + 覆盖区块链手续费的资金。

:::tip 新手提示
~0.5 TON 对这个教程来说绝对足够了。
:::

## 🚀 开始吧！

使用你的网络浏览器打开服务[TON Minter](https://minter.ton.org/)。

![image](/img/tutorials/jetton/jetton-main-page.png)

### 使用浏览器部署 Jetton

#### 连接钱包

点击`Connect Wallet`按钮连接你的[Tonhub](https://ton.app/wallets/tonhub-wallet)钱包或[Chrome扩展](https://ton.app/wallets/chrome-plugin)或以下的其他钱包。

#### ![image](/img/tutorials/jetton/jetton-connect-wallet.png)

在[移动钱包(Tonhub等)](https://ton.app/wallets/tonhub-wallet)**扫描二维码**或通过[Chrome扩展](https://ton.app/wallets/chrome-plugin)**登录**到钱包。

#### 填写相关信息

1. 名称（通常1-3个词）。
2. 符号（通常3-5个大写字符）。
3. 数量（例如，1,000,000）。
4. 代币描述（可选）。

#### 代币标志URL（可选）

![image](/img/tutorials/jetton/jetton-token-logo.png)

如果你想拥有一个吸引人的Jetton代币，你需要一个存放在某处的漂亮标志。例如：

- https://bitcoincash-example.github.io/website/logo.png

:::info
You can easily find out  about url placement of the logo in the [repository](https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices) in paragraph "Where is this metadata stored".

- 链上。
- 链下IPFS。
- 链下网站。
  :::

#### 如何创建你的标志URL？

1. 准备一个256x256像素的代币标志PNG图片，带有透明背景。
2. 获取你的标志链接。一个好的解决方案是[GitHub页面](https://pages.github.com/)。我们就用它吧。
3. [创建一个名为`website`的新公共代码库](https://docs.github.com/en/get-started/quickstart/create-a-repo)。
4. 上传你准备好的图片到git并启用`GitHub页面`。
   1. [为你的库添加GitHub页面](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
   2. [上传你的图片并获取链接](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。
5. 如果你有自己的域名，那么最好使用`.org`而不是`github.io`。

## 💸 发送Jettons

在屏幕的右侧，你可以**发送代币**到多货币钱包，如[Tonkeeper](https://tonkeeper.com/)或[Tonhub](https://ton.app/wallets/tonhub-wallet)。

![image](/img/tutorials/jetton/jetton-send-tokens.png)

:::info
You always also **burn** your Jettons to reduce their amount.

![image](/img/tutorials/jetton/jetton-burn-tokens.png)
:::

### 📱 使用 Tonkeeper 从手机发送代币

必要条件：

1. 你的余额上必须已经有代币，才能发送它们。
2. 必须有至少0.1 Toncoin来支付交易费。

#### 分步指南

然后回到**你的代币**，设置要发送的**数量**，并输入**接收者地址**。

![image](/img/tutorials/jetton/jetton-send-tutorial.png)

## 📚 在网站上使用代币

通过在网站顶端的**搜索框**输入代币地址，你可以访问并使用所有者权限来管理。

:::info
The address can be found on the right side if you are already in the owner panel, or you can find the token address when receiving an airdrop.

![image](/img/tutorials/jetton/jetton-wallet-address.png)
:::

## ✏️ Jetton（代币）定制

使用[FunC](/develop/func/overview)语言，你可以根据你的喜好更改代币的行为。

要进行任何更改，请从这里开始：

- https://github.com/ton-blockchain/minter-contract

### 开发者的分步指南

1. 确保你有[tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts)库中的所有"依赖和要求"。
2. 克隆[minter-contract库](https://github.com/ton-blockchain/minter-contract)并重命名该项目。
3. 要安装，你需要在根目录下打开一个终端并运行：

```bash npm2yarn
npm install
```

4. 以同样的方式编辑原始智能合约文件，所有合约文件都在`contracts/*.fc`

5. 使用下面的命令构建项目：

```bash npm2yarn
npm run build
```

构建结果将描述创建所需文件的过程，以及查找智能合约的过程。

:::info
阅读控制台，那里有很多提示！
:::

6. 你可以使用以下命令测试你的更改：

```bash npm2yarn
npm run test
```

7. 通过更改`build/jetton-minter.deploy.ts`中的JettonParams对象，编辑**名称**和其它代币元数据。

```js
// This is example data - Modify these params for your own jetton!
// - Data is stored on-chain (except for the image data itself)
// - Owner should usually be the deploying wallet's address.
  
const jettonParams = {
 owner: Address.parse("EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2"),
 name: "MyJetton",
 symbol: "JET1",
 image: "https://www.linkpicture.com/q/download_183.png", // Image url
 description: "My jetton",
};
```

8. 使用以下命令部署一个代币：

```bash npm2yarn
npm run deploy
```

运行你的项目的结果：

````
```js
> @ton-defi.org/jetton-deployer-contracts@0.0.2 deploy
> ts-node ./build/_deploy.ts

=================================================================
Deploy script running, let's find some contracts to deploy..

* We are working with 'mainnet'

* Config file '.env' found and will be used for deployment!
 - Wallet address used to deploy from is: YOUR-ADDRESS
 - Wallet balance is YOUR-BALANCE TON, which will be used for gas

* Found root contract 'build/jetton-minter.deploy.ts - let's deploy it':
 - Based on your init code+data, your new contract address is: YOUR-ADDRESS
 - Let's deploy the contract on-chain..
 - Deploy transaction sent successfully
 - Block explorer link: https://tonwhales.com/explorer/address/YOUR-ADDRESS
 - Waiting up to 20 seconds to check if the contract was actually deployed..
 - SUCCESS! Contract deployed successfully to address: YOUR-ADDRESS
 - New contract balance is now YOUR-BALANCE TON, make sure it has enough to pay rent
 - Running a post deployment test:
{
  name: 'MyJetton',
  description: 'My jetton',
  image: 'https://www.linkpicture.com/q/download_183.png',
  symbol: 'JET1'
}
```
````

## 接下来

如果你想更深入地了解，请阅读Tal Kol的这篇文章：

- [如何以及为什么要分片你的智能合约——研究TON Jettons的解剖学](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)

## 参考资料

- 项目：https://github.com/ton-blockchain/minter-contract
- 作者Slava：（[Telegram @delovoyslava](https://t.me/delovoyslava)，[GitHub上的delovoyhomie](https://github.com/delovoyhomie)）
- [ jetton 处理](/v3/guidelines/dapps/asset-processing/jettons)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/nft-minting-guide.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/nft-minting-guide.md
================================================
# 逐步创建 NFT 集合的教程

## 👋 引言

非同质化代币（NFT）已成为数字艺术和收藏品世界中最热门的话题之一。NFT是使用区块链技术验证所有权和真实性的独特数字资产。它们为创作者和收藏家提供了将数字艺术、音乐、视频和其他形式的数字内容货币化和交易的新可能性。近年来，NFT市场爆炸性增长，一些高调的销售额达到了数百万美元。在本文中，我们将逐步在TON上构建我们的NFT集合。

**这是你在本教程结束时将创建的鸭子集合的精美图片：**

![](/img/tutorials/nft/collection.png)

## 🦄 你将会学到什么

1. 你将在TON上铸造NFT集合
2. 你将理解TON上的NFT是如何工作的
3. 你将把NFT出售
4. 你将把元数据上传到[pinata.cloud](https://pinata.cloud)

## 💡 必要条件

你必须已经有一个测试网钱包，里面至少有2 TON。可以从[@testgiver_ton_bot](https://t.me/testgiver_ton_bot)获取测试网币。

:::info 如何打开我的Tonkeeper钱包的测试网版本？\
要在tonkeeper中打开测试网网络，请转到设置并点击位于底部的tonkeeper logo 5次，之后选择测试网而不是主网。
:::

我们将使用Pinata作为我们的IPFS存储系统，因此你还需要在[pinata.cloud](https://pinata.cloud)上创建一个帐户并获取api_key & api_secreat。官方Pinata [文档教程](https://docs.pinata.cloud/pinata-api/authentication)可以帮助完成这一点。只要你拿到这些api令牌，我就在这里等你！！！

## 💎 什么是 TON 上的 NFT?

在开始我们教程的主要部分之前，我们需要了解一下通常意义上TON中NFT是如何工作的。出乎意料的是，我们将从解释ETH中NFT的工作原理开始，为了理解TON中NFT实现的特殊性，与行业中常见的区块链相比。

### ETH 上的 NFT 实现

ETH中NFT的实现极其简单 - 存在1个主要的集合合约，它存储一个简单的哈希映射，该哈希映射反过来存储此集合中NFT的数据。所有与此集合相关的请求（如果任何用户想要转移NFT、将其出售等）都特别发送到此1个集合合约。

![](/img/tutorials/nft/eth-collection.png)

### 在 TON 中如此实现可能出现的问题

在TON的上下文中，此类实现的问题由[TON的NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)完美描述：

- 不可预测的燃料消耗。在TON中，字典操作的燃料消耗取决于确切的键集。此外，TON是一个异步区块链。这意味着，如果你向一个智能合约发送一个消息，那么你不知道有多少来自其他用户的消息会在你的消息之前到达智能合约。因此，你不知道当你的消息到达智能合约时字典的大小会是多少。这对于简单的钱包 -> NFT智能合约交互是可以的，但对于智能合约链，例如钱包 -> NFT智能合约 -> 拍卖 -> NFT智能合约，则不可接受。如果我们不能预测燃料消耗，那么可能会出现这样的情况：NFT智能合约上的所有者已经更改，但拍卖操作没有足够的Toncoin。不使用字典的智能合约可以提供确定性的燃料消耗。

- 不可扩展（成为瓶颈）。TON的扩展性基于分片的概念，即在负载下自动将网络划分为分片链。流行NFT的单个大智能合约与这一概念相矛盾。在这种情况下，许多交易将引用一个单一的智能合约。TON架构为分片的智能合约提供了设施（参见白皮书），但目前尚未实现。

*简而言之，ETH的解决方案不可扩展且不适用于像TON这样的异步区块链。*

### TON 上的 NFT 实现

在TON中，我们有1个主合约-我们集合的智能合约，它存储它的元数据和它所有者的地址，以及最重要的 - 如果我们想要创建（"铸造"）新的NFT项目 - 我们只需要向这个集合合约发送消息。而这个集合合约将为我们部署新NFT项目的合约，并提供我们提供的数据。

![](/img/tutorials/nft/ton-collection.png)

:::info
如果你想更深入地了解这个话题，可以查看[TON上的NFT处理](/develop/dapps/asset-processing/nfts)文章或阅读[NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
:::

## ⚙ 设置开发环境

让我们从创建一个空项目开始：

1. 创建新文件夹
   `mkdir MintyTON`

```bash
mkdir MintyTON
```

2. 将以下配置复制到tsconfig.json中

```bash
cd MintyTON
```

3. 向package.json添加脚本以构建并启动我们的应用程序

```bash
yarn init -y
```

4. 安装所需的库

```bash
yarn add typescript @types/node -D
```

5. 创建`.env`文件并根据此模板添加你自己的数据

```bash
tsc --init
```

6. 将以下配置复制到tsconfig.json中

```json
{
    "compilerOptions": {
      "module": "commonjs",
      "target": "es6",
      "lib": ["ES2022"],
      "moduleResolution": "node",
      "sourceMap": true,
      "outDir": "dist",
      "baseUrl": "src",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "strict": true,
      "esModuleInterop": true,
      "strictPropertyInitialization": false
    },
    "include": ["src/**/*"]
}
```

7. 在 `package.json` 中添加脚本以构建和启动我们的应用程序

```json
"scripts": {
    "start": "tsc --skipLibCheck && node dist/app.js"
  },
```

8. 安装所需的库

```bash
yarn add @pinata/sdk dotenv @ton/ton @ton/crypto @ton/core buffer
```

9. 创建`.env`文件并根据此模板添加你自己的数据

```
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_secret_api_key
MNEMONIC=word1 word2 word3 word4
TONCENTER_API_KEY=aslfjaskdfjasasfas
```

最后打开我们的钱包：

太好了！现在我们准备好开始为我们的项目编写代码了。

### 编写辅助函数

首先，让我们在 `src/utils.ts` 中创建函数 `openWallet`，它将通过助记符打开我们的钱包，并返回钱包的公钥/密钥。

最后，让我们创建`delay.ts`文件，在这个文件中，我们将创建一个函数来等待`seqno`增加。

```ts
import { KeyPair, mnemonicToPrivateKey } from "@ton/crypto";
import { beginCell, Cell, OpenedContract} from "@ton/core";
import { TonClient, WalletContractV4 } from "@ton/ton";

export type OpenedWallet = {
  contract: OpenedContract<WalletContractV4>;
  keyPair: KeyPair;
};

export async function openWallet(mnemonic: string[], testnet: boolean) {
  const keyPair = await mnemonicToPrivateKey(mnemonic);
```

创建一个类实例以与toncenter交互：

```ts
  const toncenterBaseEndpoint: string = testnet
    ? "https://testnet.toncenter.com"
    : "https://toncenter.com";

  const client = new TonClient({
    endpoint: `${toncenterBaseEndpoint}/api/v2/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  });
```

元数据 - 只是一些简单的信息，将描述我们的NFT或集合。例如它的名称、它的描述等。

```ts
  const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });

  const contract = client.open(wallet);
  return { contract, keyPair };
}
```

很好，之后我们将创建项目的主入口点 - `src/app.ts`。
这里将使用刚刚创建的函数 `openWallet` 并调用我们的主函数 `init`。
现在就到此为止。

```ts
import * as dotenv from "dotenv";

import { openWallet } from "./utils";
import { readdir } from "fs/promises";

dotenv.config();

async function init() {
  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);  
}

void init();
```

最后，让我们在 `src` 目录中创建 `delay.ts` 文件，在该文件中，我们将创建一个函数来等待 `seqno` 的增加。

```ts
import { OpenedWallet } from "./utils";

export async function waitSeqno(seqno: number, wallet: OpenedWallet) {
  for (let attempt = 0; attempt < 10; attempt++) {
    await sleep(2000);
    const seqnoAfter = await wallet.contract.getSeqno();
    if (seqnoAfter == seqno + 1) break;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

:::info 什么是seqno?
简单来说，seqno就是由钱包发送的外部交易的计数器。
Seqno用于预防重放攻击。当交易发送到钱包智能合约时，它将交易的seqno字段与其存储中的字段进行比较。如果它们匹配，交易被接受并且存储的seqno增加一。如果它们不匹配，交易被丢弃。这就是为什么我们需要在每次发送外部交易后稍等一会儿。
:::

## 🖼 准备元数据

请注意，我们没有写"image"参数，稍后你会知道原因，请稍等！

在创建了集合的元数据文件之后，我们需要创建我们NFT的元数据。

### NFT 规范

TON 上的大多数产品都支持此类元数据规范，以存储有关 NFT 收集的信息：

| 名称                                | 解释                                          |
| --------------------------------- | ------------------------------------------- |
| name                              | 集合名称                                        |
| description                       | 集合描述                                        |
| image                             | 将显示为头像的图片链接。支持的链接格式：https、ipfs、TON Storage。 |
| cover_image  | 将显示为集合封面图片的图片链接。                            |
| social_links | 项目社交媒体配置文件的链接列表。使用不超过10个链接。                 |

![image](/img/tutorials/nft/collection-metadata.png)

之后，你可以根据需要创建尽可能多的NFT项目及其元数据文件。

```json
{
  "name": "Ducks on TON",
  "description": "This collection is created for showing an example of minting NFT collection on TON. You can support creator by buying one of this NFT.",
  "social_links": ["https://t.me/DucksOnTON"]
}
```

现在让我们编写一些代码，将我们的元数据文件上传到IPFS。创建 `metadata.ts` 文件并添加所需的导入：

在创建了集合的元数据文件之后，我们需要创建我们NFT的元数据。

之后，我们需要创建一个函数，这个函数将把我们文件夹中的所有文件实际上传到IPFS：

| 名称                                | 解释                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| name                              | NFT名称。推荐长度：不超过15-30个字符                                                                                        |
| description                       | NFT描述。推荐长度：不超过500个字符                                                                                          |
| image                             | NFT图片链接。                                                                                                      |
| attributes                        | NFT属性。属性列表，其中指定了trait_type (属性名称)和value (属性的简短描述)。 |
| lottie                            | Lottie动画的json文件链接。如果指定，在NFT页面将播放来自此链接的Lottie动画。                                                               |
| content_url  | 额外内容的链接。                                                                                                      |
| content_type | 通过content_url链接添加的内容的类型。例如，视频/mp4文件。                                                     |

太棒了！让我们回到之前的问题：为什么我们在元数据文件中留下了“image”字段为空？想象一下你想在你的集合中创建1000个NFT，并且你必须手动遍历每个项目并手动插入图片链接。
这真的很不方便，所以让我们编写一个函数来自动完成这个操作！

```json
{
  "name": "Duck #00",
  "description": "What about a round of golf?",
  "attributes": [{ "trait_type": "Awesomeness", "value": "Super cool" }]
}
```

这里我们首先读取指定文件夹中的所有文件：

### 上传元数据

遍历每个文件并获取其内容

```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
```

之后，如果不是文件夹中的最后一个文件，我们将图像字段的值分配为 `ipfs://{IpfsHash}/{index}.jpg`，否则为 `ipfs://{imagesIpfsHash}/logo.jpg` 并实际用新数据重写我们的文件。

```ts
export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}
```

太棒了！让我们回到之前的问题：为什么我们在元数据文件中留下了“image”字段为空？想象一下你想在你的集合中创建1000个NFT，并且你必须手动遍历每个项目并手动插入图片链接。
这真的很不方便，所以让我们编写一个函数来自动完成这个操作！

```ts
export async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
  const files = readdirSync(metadataFolderPath);

  await Promise.all(files.map(async (filename, index) => {
    const filePath = path.join(metadataFolderPath, filename)
    const file = await readFile(filePath);
    
    const metadata = JSON.parse(file.toString());
    metadata.image =
      index != files.length - 1
        ? `ipfs://${imagesIpfsHash}/${index}.jpg`
        : `ipfs://${imagesIpfsHash}/logo.jpg`;
    
    await writeFile(filePath, JSON.stringify(metadata));
  }));
}
```

这里我们首先读取指定文件夹中的所有文件：

```ts
const files = readdirSync(metadataFolderPath);
```

遍历每个文件并获取其内容

```ts
const filePath = path.join(metadataFolderPath, filename)
const file = await readFile(filePath);

const metadata = JSON.parse(file.toString());
```

之后，如果不是文件夹中的最后一个文件，我们将图像字段的值分配为 `ipfs://{IpfsHash}/{index}.jpg`，否则为 `ipfs://{imagesIpfsHash}/logo.jpg` 并实际用新数据重写我们的文件。

我们如何将链接到智能合约中存储的元数据文件？这个问题可以通过[Token Data 标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)得到完全回答。在某些情况下，仅仅提供所需的标志并以ASCII字符提供链接是不够的，这就是为什么我们考虑使用蛇形格式将我们的链接分成几个部分的选项。

```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}

export async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
  const files = readdirSync(metadataFolderPath);

  files.forEach(async (filename, index) => {
    const filePath = path.join(metadataFolderPath, filename)
    const file = await readFile(filePath);
    
    const metadata = JSON.parse(file.toString());
    metadata.image =
      index != files.length - 1
        ? `ipfs://${imagesIpfsHash}/${index}.jpg`
        : `ipfs://${imagesIpfsHash}/logo.jpg`;
    
    await writeFile(filePath, JSON.stringify(metadata));
  });
}
```

太好了，让我们在我们的 app.ts 文件中调用这些方法。
添加我们函数的导入：

```ts
import { updateMetadataFiles, uploadFolderToIPFS } from "./src/metadata";
```

保存元数据/图片文件夹路径变量并调用我们的函数上传元数据。

```ts
async function init() {
  const metadataFolderPath = "./data/metadata/";
  const imagesFolderPath = "./data/images/";

  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);

  console.log("Started uploading images to IPFS...");
  const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);
  console.log(
    `Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`
  );

  console.log("Started uploading metadata files to IPFS...");
  await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);
  const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);
  console.log(
    `Successfully uploaded the metadata to ipfs: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
  );
}
```

之后你可以运行 `yarn start` 并查看部署的元数据链接！

### 🚢 部署 NFT 集合

当我们的元数据已经准备好并且已经上传到IPFS时，我们可以开始部署我们的集合了！

我们将在 `/contracts/NftCollection.ts` 文件中创建一个文件，该文件将存储与我们的集合相关的所有逻辑。我们将从导入开始：

```ts
function bufferToChunks(buff: Buffer, chunkSize: number) {
  const chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.subarray(0, chunkSize));
    buff = buff.subarray(chunkSize);
  }
  return chunks;
}
```

并声明一个类型，它将描述我们集合所需的初始化数据：

```ts
function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127);

  if (chunks.length === 0) {
    return beginCell().endCell();
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell();
  }

  let curCell = beginCell();

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];

    curCell.storeBuffer(chunk);

    if (i - 1 >= 0) {
      const nextCell = beginCell();
      nextCell.storeRef(curCell);
      curCell = nextCell;
    }
  }

  return curCell.endCell();
}
```

最后，我们需要创建一个函数，使用这些函数将离线内容编码为cell：

```ts
export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  const offChainPrefix = Buffer.from([0x01]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}
```

## 🚢 部署 NFT 集合

在这段代码中，我们只是从集合智能合约的base64表示中读取cell。

剩下的只有我们集合初始化数据的cell了。

```ts
import {
  Address,
  Cell,
  internal,
  beginCell,
  contractAddress,
  StateInit,
  SendMode,
} from "@ton/core";
import { encodeOffChainContent, OpenedWallet } from "../utils";
```

并声明一个类型，它将描述我们集合所需的初始化数据：

```ts
export type collectionData = {
  ownerAddress: Address;
  royaltyPercent: number;
  royaltyAddress: Address;
  nextItemIndex: number;
  collectionContentUrl: string;
  commonContentUrl: string;
}
```

| 名称                   | 解释                             |
| -------------------- | ------------------------------ |
| ownerAddress         | 将被设置为我们集合的所有者的地址。只有所有者能够铸造新NFT |
| royaltyPercent       | 每次销售金额的百分比，将转到指定地址             |
| royaltyAddress       | 将从这个NFT集合的销售中接收版税的钱包地址         |
| nextItemIndex        | 下一个NFT项目应该有的索引                 |
| collectionContentUrl | 集合元数据的URL                      |
| commonContentUrl     | NFT项目元数据的基础URL                 |

之后，我们只是创建NFT项目的代码cell，这些项目将在我们的收藏中被创建，并在dataCell中存储对这个cell的引用。

```ts
export class NftCollection {
  private collectionData: collectionData;

  constructor(collectionData: collectionData) {
    this.collectionData = collectionData;
  }

  private createCodeCell(): Cell {
    const NftCollectionCodeBoc =
      "te6cckECFAEAAh8AART/APSkE/S88sgLAQIBYgkCAgEgBAMAJbyC32omh9IGmf6mpqGC3oahgsQCASAIBQIBIAcGAC209H2omh9IGmf6mpqGAovgngCOAD4AsAAvtdr9qJofSBpn+pqahg2IOhph+mH/SAYQAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgLNDwoCASAMCwA9Ra8ARwIfAFd4AYyMsFWM8WUAT6AhPLaxLMzMlx+wCAIBIA4NABs+QB0yMsCEsoHy//J0IAAtAHIyz/4KM8WyXAgyMsBE/QA9ADLAMmAE59EGOASK3wAOhpgYC42Eit8H0gGADpj+mf9qJofSBpn+pqahhBCDSenKgpQF1HFBuvgoDoQQhUZYBWuEAIZGWCqALnixJ9AQpltQnlj+WfgOeLZMAgfYBwGyi544L5cMiS4ADxgRLgAXGBEuAB8YEYGYHgAkExIREAA8jhXU1DAQNEEwyFAFzxYTyz/MzMzJ7VTgXwSED/LwACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UAKY1cAPUMI43gED0lm+lII4pBqQggQD6vpPywY/egQGTIaBTJbvy9AL6ANQwIlRLMPAGI7qTAqQC3gSSbCHis+YwMlBEQxPIUAXPFhPLP8zMzMntVABgNQLTP1MTu/LhklMTugH6ANQwKBA0WfAGjhIBpENDyFAFzxYTyz/MzMzJ7VSSXwXiN0CayQ==";
    return Cell.fromBase64(NftCollectionCodeBoc);
  }
}
```

版税参数通过royaltyFactor、royaltyBase、royaltyAddress在智能合约中存储。版税百分比可以用公式`(royaltyFactor / royaltyBase) * 100%`计算。因此，如果我们知道royaltyPercent，获取royaltyFactor就不是问题。

好了，现在只剩下含有我们的集合的初始数据的 cell 了。
基本上，我们只需要以正确的方式存储 collectionData 中的数据。首先，我们需要创建一个空 cell ，并在其中存储集合所有者地址和下一个要生成的项目的索引。让我们编写下一个私有方法：

```ts
private createDataCell(): Cell {
  const data = this.collectionData;
  const dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex, 64);
```

之后，我们创建一个空 cell 来存储我们的集合内容，然后将 ref 保存到包含集合编码内容的 cell 中。然后将 ref 保存到主数据 cell 中的 contentCell。

```ts
const contentCell = beginCell();

const collectionContent = encodeOffChainContent(data.collectionContentUrl);

const commonContent = beginCell();
commonContent.storeBuffer(Buffer.from(data.commonContentUrl));

contentCell.storeRef(collectionContent);
contentCell.storeRef(commonContent.asCell());
dataCell.storeRef(contentCell);
```

之后，我们只需创建 NFT 项目代码的 cell （将在我们的集合中创建），并将该 cell 的引用存储在 dataCell 中。

```ts
const NftItemCodeCell = Cell.fromBase64(
  "te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu"
);
dataCell.storeRef(NftItemCodeCell);
```

智能合约中存储的版税参数包括 royaltyFactor、royaltyBase 和 royaltyAddress。版税百分比可以用公式 `(royaltyFactor / royaltyBase) * 100%` 计算。因此，如果我们知道 royaltyPercent，那么获取 royaltyFactor 就不成问题了。

```ts
const royaltyBase = 1000;
const royaltyFactor = Math.floor(data.royaltyPercent * royaltyBase);
```

计算完成后，我们需要在单独的 cell 中存储版税数据，并在 dataCell 中提供该 cell 的引用。

```ts
const royaltyCell = beginCell();
royaltyCell.storeUint(royaltyFactor, 16);
royaltyCell.storeUint(royaltyBase, 16);
royaltyCell.storeAddress(data.royaltyAddress);
dataCell.storeRef(royaltyCell);

return dataCell.endCell();
}
```

当所有者铸造新的NFT时，集合接受所有者的消息并向创建的NFT智能合约发送新消息（这需要支付费用），所以让我们编写一个方法，该方法将根据铸造的nfts数量来补充集合的余额：

```ts
public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}
```

完美，现在让我们在`app.ts`中添加几行，部署新的收藏：

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

现在只剩下编写将智能合约部署到区块链上的方法了！

```ts
public async deploy(wallet: OpenedWallet) {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: this.address,
          init: this.stateInit,
        }),
      ],
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    });
    return seqno;
  }
```

意外地，但现在我们需要回到`NftCollection.ts`。并在文件顶部的`collectionData`附近添加此类型。

当所有者铸币一个新的 NFT 时，集合会接受所有者的信息，并向创建的 NFT 智能合约发送一个新信息（这需要支付一定的费用），所以我们来写一个方法，根据铸币的 NFT 数量来补充集合的余额：

```ts
public async topUpBalance(
    wallet: OpenedWallet,
    nftAmount: number
  ): Promise<number> {
    const feeAmount = 0.026 // approximate value of fees for 1 transaction in our case 
    const seqno = await wallet.contract.getSeqno();
    const amount = nftAmount * feeAmount;

    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: amount.toString(),
          to: this.address.toString({ bounceable: false }),
          body: new Cell(),
        }),
      ],
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    });

    return seqno;
  }
```

并在NftCollection类中创建一个方法，该方法将构建部署我们NFT项目的主体。首先存储一个位，该位将指示给集合智能合约我们想要创建新的NFT。之后只存储此NFT项目的queryId和索引。

```ts
import { waitSeqno } from "./delay";
import { NftCollection } from "./contracts/NftCollection";
```

随后创建一个空cell并在其中存储这个NFT的所有者地址：

```ts
console.log("Start deploy of nft collection...");
const collectionData = {
  ownerAddress: wallet.contract.address,
  royaltyPercent: 0.05, // 0.05 = 5%
  royaltyAddress: wallet.contract.address,
  nextItemIndex: 0,
  collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
  commonContentUrl: `ipfs://${metadataIpfsHash}/`,
};
const collection = new NftCollection(collectionData);
let seqno = await collection.deploy(wallet);
console.log(`Collection deployed: ${collection.address}`);
await waitSeqno(seqno, wallet);
```

## 🚢 部署 NFT 项目

当我们的集合准备就绪时，我们就可以开始铸造我们的 NFT 了！我们将在 `src/contracts/NftItem.ts` 中存储代码

在我们的主体cell中存储对带有项目内容的cell的引用：

```ts
export type mintParams = {
  queryId: number | null,
  itemOwnerAddress: Address,
  itemIndex: number,
  amount: bigint,
  commonContentUrl: string
}
```

| 名称               | 说明                                                          |
| ---------------- | ----------------------------------------------------------- |
| itemOwnerAddress | 将被设置为物品所有者的地址                                               |
| itemIndex        | NFT 项目索引                                                    |
| amount           | 将发送到 NFT 的 TON 位数量，并进行部署                                    |
| commonContentUrl | 项目 URL 的完整链接可显示为集合的 "commonContentUrl" + 此 commonContentUrl |

然后在 NftCollection 类中创建方法，该方法将构建部署 NFT 项目的主体。首先存储位，向集合智能合约表明我们要创建新的 NFT。然后，只需存储此 NFT 项目的 queryId 和索引。

```ts
public createMintBody(params: mintParams): Cell {
    const body = beginCell();
    body.storeUint(1, 32);
    body.storeUint(params.queryId || 0, 64);
    body.storeUint(params.itemIndex, 64);
    body.storeCoins(params.amount);
```

从创建客户端变量开始，它将帮助我们调用集合的get方法。

```ts
    const nftItemContent = beginCell();
    nftItemContent.storeAddress(params.itemOwnerAddress);
```

然后我们将调用集合的get方法，该方法将返回此集合中具有该索引的NFT的地址

```ts
    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(params.commonContentUrl));
    nftItemContent.storeRef(uriContent.endCell());
```

... 并解析这个地址！

```ts
    body.storeRef(nftItemContent.endCell());
    return body.endCell();
}
```

现在，让我们在`app.ts`中添加一些代码，以自动化每个NFT的铸造过程。首先读取包含我们元数据的文件夹中的所有文件：

```ts
import { internal, SendMode, Address, beginCell, Cell, toNano } from "@ton/core";
import { OpenedWallet } from "utils";
import { NftCollection, mintParams } from "./NftCollection";
import { TonClient } from "@ton/ton";

export class NftItem {
  private collection: NftCollection;

  constructor(collection: NftCollection) {
    this.collection = collection;
  }

  public async deploy(
    wallet: OpenedWallet,
    params: mintParams
  ): Promise<number> {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: this.collection.address,
          body: this.collection.createMintBody(params),
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
}
```

其次，为我们的收藏充值：

最后，我们将编写简短方法，该方法将通过其索引获取NFT的地址。

```ts
static async getAddressByIndex(
  collectionAddress: Address,
  itemIndex: number
): Promise<Address> {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: process.env.TONCENTER_API_KEY,
  });
```

然后，我们将调用集合的 get-method，该方法将返回该集合中 NFT 的地址，其索引为

```ts
  const response = await client.runMethod(
    collectionAddress,
    "get_nft_address_by_index",
    [{ type: "int", value: BigInt(itemIndex) }]
  );
```

为了将nft出售，我们需要两个智能合约。

```ts
    return response.stack.readAddress();
}
```

现在，让我们在 `app.ts` 中添加一些代码，以自动执行每个 NFT 的造币过程：

```ts
  import { NftItem } from "./contracts/NftItem";
  import { toNano } from '@ton/core';
```

首先读取文件夹中带有元数据的所有文件：

```ts
const files = await readdir(metadataFolderPath);
files.pop();
let index = 0;
```

其次，为我们的收藏充值：

```ts
seqno = await collection.topUpBalance(wallet, files.length);
await waitSeqno(seqno, wallet);
console.log(`Balance top-upped`);
```

最后，通过元数据检查每个文件，创建 `NftItem` 实例并调用部署方法。之后，我们需要等待一段时间，直到 seqno 增加：

```ts
for (const file of files) {
    console.log(`Start deploy of ${index + 1} NFT`);
    const mintParams = {
      queryId: 0,
      itemOwnerAddress: wallet.contract.address,
      itemIndex: index,
      amount: toNano("0.05"),
      commonContentUrl: file,
    };

    const nftItem = new NftItem(collection);
    seqno = await nftItem.deploy(wallet, mintParams);
    console.log(`Successfully deployed ${index + 1} NFT`);
    await waitSeqno(seqno, wallet);
    index++;
  }
```

## 🏷 出售 NFT

为了出售 nft，我们需要两个智能合约。

- 市场，只负责创建新销售的逻辑
- 销售合约，负责购买/取消销售的逻辑关系

### 部署市场

首先让我们声明新类型，该类型将描述我们销售智能合约的数据：

```ts
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  internal,
  SendMode,
  StateInit,
} from "@ton/core";
import { OpenedWallet } from "../utils";

export class NftMarketplace {
  public ownerAddress: Address;

  constructor(ownerAddress: Address) {
    this.ownerAddress = ownerAddress;
  }


  public get stateInit(): StateInit {
    const code = this.createCodeCell();
    const data = this.createDataCell();

    return { code, data };
  }

  private createDataCell(): Cell {
    const dataCell = beginCell();

    dataCell.storeAddress(this.ownerAddress);

    return dataCell.endCell();
  }

  private createCodeCell(): Cell {
    const NftMarketplaceCodeBoc = "te6cckEBBAEAbQABFP8A9KQT9LzyyAsBAgEgAgMAqtIyIccAkVvg0NMDAXGwkVvg+kDtRND6QDASxwXy4ZEB0x8BwAGOK/oAMAHU1DAh+QBwyMoHy//J0Hd0gBjIywXLAljPFlAE+gITy2vMzMlx+wCRW+IABPIwjvfM5w==";
    return Cell.fromBase64(NftMarketplaceCodeBoc)
  }
}
```

现在让我们创建类，并创建一个基本方法，用于为我们的智能合约创建初始化数据cell。

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

之后，我们需要创建一个方法，用于部署我们的市场：

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.5",
          to: this.address,
          init: this.stateInit,
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
```

正如您所看到的，这段代码与部署其他智能合约（nft-item 智能合约、部署新的集合）并无不同。唯一不同的是，你可以看到我们最初补充市场的数量不是 0.05  TON ，而是 0.5  TON 。这是什么原因呢？  当部署新的智能销售合约时，市场会接受请求、处理请求并向新合约发送信息（是的，这种情况与 NFT 集合的情况类似）。这就是为什么我们需要一点额外的语气来支付费用。

像往常一样添加方法，获取stateInit，初始化代码cell和我们智能合约的地址。

```ts
import { NftMarketplace } from "./contracts/NftMarketplace";
```

只剩下创建我们将发送到我们市场的消息以部署销售合约，并实际发送此消息

```ts
console.log("Start deploy of new marketplace  ");
const marketplace = new NftMarketplace(wallet.contract.address);
seqno = await marketplace.deploy(wallet);
await waitSeqno(seqno, wallet);
console.log("Successfully deployed new marketplace");
```

### 部署销售合约

创建一个带有消息主体的cell。首先我们需要设置操作码为1（以指示市场，我们想要部署新的销售智能合约）。之后我们需要存储将发送到我们新销售智能合约的币值。最后我们需要存储对新智能合约的stateInit和将发送到这个新智能合约的主体的2个引用。

在 `/contracts/NftSale.ts` 中创建新文件。首先，让我们声明新类型，它将描述我们的销售智能合约的数据：

```ts
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  internal,
  SendMode,
  StateInit,
  storeStateInit,
  toNano,
} from "@ton/core";
import { OpenedWallet } from "utils";

export type GetGemsSaleData = {
  isComplete: boolean;
  createdAt: number;
  marketplaceAddress: Address;
  nftAddress: Address;
  nftOwnerAddress: Address | null;
  fullPrice: bigint;
  marketplaceFeeAddress: Address;
  marketplaceFee: bigint;
  royaltyAddress: Address;
  royaltyAmount: bigint;
};
```

现在，让我们创建类和基本方法，为智能合约创建初始数据 cell 。

```ts
export class NftSale {
  private data: GetGemsSaleData;

  constructor(data: GetGemsSaleData) {
    this.data = data;
  }
}
```

现在让我们创建类，并创建一个基本方法，用于为我们的智能合约创建初始化数据cell。

```ts
private createDataCell(): Cell {
  const saleData = this.data;

  const feesCell = beginCell();

  feesCell.storeAddress(saleData.marketplaceFeeAddress);
  feesCell.storeCoins(saleData.marketplaceFee);
  feesCell.storeAddress(saleData.royaltyAddress);
  feesCell.storeCoins(saleData.royaltyAmount);
```

转到`NftItem.ts`，并在NftItem类中创建一个新的静态方法，用于创建此类消息的主体：

```ts
  const dataCell = beginCell();

  dataCell.storeUint(saleData.isComplete ? 1 : 0, 1);
  dataCell.storeUint(saleData.createdAt, 32);
  dataCell.storeAddress(saleData.marketplaceAddress);
  dataCell.storeAddress(saleData.nftAddress);
  dataCell.storeAddress(saleData.nftOwnerAddress);
  dataCell.storeCoins(saleData.fullPrice);
  dataCell.storeRef(feesCell.endCell());

  return dataCell.endCell();
}
```

一如既往，添加方法来获取智能合约的 stateInit、init 代码 cell 和地址。

```ts
public get address(): Address {
  return contractAddress(0, this.stateInit);
}

public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}

private createCodeCell(): Cell {
  const NftFixPriceSaleV2CodeBoc =
    "te6cckECDAEAAikAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEAFGgOFnaiaGmAaY/9IH0gfSB9AGoYaH0gfQB9IH0AGEEIIySsKAVgAKrAQICzQgGAfdmCEDuaygBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkHCAEMjLBVADzxYB+gLLaslx+wAlwgAl10nCArCOF1BFcIAQyMsFUAPPFgH6AstqyXH7ABAjkjQ04lpwgBDIywVQA88WAfoCy2rJcfsAcCCCEF/MPRSBwCCIYAYyMsFKs8WIfoCy2rLHxPLPyPPFlADzxbKACH6AsoAyYMG+wBxVVAGyMsAFcsfUAPPFgHPFgHPFgH6AszJ7VQC99AOhpgYC42EkvgnB9IBh2omhpgGmP/SB9IH0gfQBqGBNgAPloyhFrpOEBWccgGRwcKaDjgskvhHAoomOC+XD6AmmPwQgCicbIiV15cPrpn5j9IBggKwNkZYAK5Y+oAeeLAOeLAOeLAP0BZmT2qnAbE+OAcYED6Y/pn5gQwLCQFKwAGSXwvgIcACnzEQSRA4R2AQJRAkECPwBeA6wAPjAl8JhA/y8AoAyoIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxnLPyfPFifPFhjKACf6AhfKAMmAQPsAcQZQREUVBsjLABXLH1ADzxYBzxYBzxYB+gLMye1UABY3EDhHZRRDMHDwBTThaBI=";

  return Cell.fromBase64(NftFixPriceSaleV2CodeBoc);
}
```

剩下的就是我们要向市场发送一条信息，以部署销售合约，并实际发送以下信息

并创建一个转移NFT的函数。

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const stateInit = beginCell()
      .store(storeStateInit(this.stateInit))
      .endCell();
```

很好，现在我们已经非常接近结束了。回到`app.ts`，让我们获取我们想要出售的nft的地址：

```ts
  const payload = beginCell();
  payload.storeUint(1, 32);
  payload.storeCoins(toNano("0.05"));
  payload.storeRef(stateInit);
  payload.storeRef(new Cell());
```

创建一个将存储我们销售信息的变量：

```ts
  const seqno = await wallet.contract.getSeqno();
  await wallet.contract.sendTransfer({
    seqno,
    secretKey: wallet.keyPair.secretKey,
    messages: [
      internal({
        value: "0.05",
        to: this.data.marketplaceAddress,
        body: payload.endCell(),
      }),
    ],
    sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
  });
  return seqno;
}
```

请注意，我们将nftOwnerAddress设置为null，因为如果这样做，我们的销售合约将只接受我们部署时的币值。

### 转移物品

转让物品意味着什么？只需从所有者的钱包向智能合约发送一条信息，告知物品的新所有者是谁即可。

... 并进行转移！

转到`NftItem.ts`，并在NftItem类中创建一个新的静态方法，用于创建此类消息的主体：

```ts
static createTransferBody(params: {
    newOwner: Address;
    responseTo?: Address;
    forwardAmount?: bigint;
  }): Cell {
    const msgBody = beginCell();
    msgBody.storeUint(0x5fcc3d14, 32); // op-code 
    msgBody.storeUint(0, 64); // query-id
    msgBody.storeAddress(params.newOwner);
```

除了操作码、查询 ID 和新所有者的地址外，我们还必须存储确认转账成功的回复地址和其他传入信息的币值。新所有者将收到的 TON 数量以及他是否会收到文本有效载荷。

```ts
  msgBody.storeAddress(params.responseTo || null);
  msgBody.storeBit(false); // no custom payload
  msgBody.storeCoins(params.forwardAmount || 0);
  msgBody.storeBit(0); // no forward_payload 

  return msgBody.endCell();
}
```

并创建一个转移函数来转移 NFT。

```ts
static async transfer(
    wallet: OpenedWallet,
    nftAddress: Address,
    newOwner: Address
  ): Promise<number> {
    const seqno = await wallet.contract.getSeqno();

    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: nftAddress,
          body: this.createTransferBody({
            newOwner,
            responseTo: wallet.contract.address,
            forwardAmount: toNano("0.02"),
          }),
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
```

很好，现在我们已经接近尾声了。回到 `app.ts`，找到我们要出售的 nft 的地址：

```ts
const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
```

创建变量，用于存储我们的销售信息。

添加到 `app.ts` 的开头：

```ts
import { GetGemsSaleData, NftSale } from "./contracts/NftSale";
```

然后

```ts
const saleData: GetGemsSaleData = {
  isComplete: false,
  createdAt: Math.ceil(Date.now() / 1000),
  marketplaceAddress: marketplace.address,
  nftAddress: nftToSaleAddress,
  nftOwnerAddress: null,
  fullPrice: toNano("10"),
  marketplaceFeeAddress: wallet.contract.address,
  marketplaceFee: toNano("1"),
  royaltyAddress: wallet.contract.address,
  royaltyAmount: toNano("0.5"),
};
```

请注意，我们将 `nftOwnerAddress` 设置为 null，因为这样设置后，我们的销售合约在部署时就会直接接收我们的代币。

请注意，我们将nftOwnerAddress设置为null，因为如果这样做，我们的销售合约将只接受我们部署时的币值。

```ts
const nftSaleContract = new NftSale(saleData);
seqno = await nftSaleContract.deploy(wallet);
await waitSeqno(seqno, wallet);
```

... 并将其转移！

```ts
await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
```

现在，我们可以启动我们的项目，享受这个过程！

```
yarn start
```

请访问 https://testnet.getgems.io/collection/{YOUR_COLLECTION_ADDRESS_HERE}
，看看这只完美的鸭子！

## 结语

今天，您已经学到了很多关于 TON 的新知识，甚至还在 testnet 中创建了自己漂亮的 NFT 套件！如果您仍有任何疑问或发现错误，请随时发消息给作者 - [@coalus](https://t.me/coalus)

## 参考资料

- [GetGems NFT-contracts](https://github.com/getgems-io/nft-contracts)
- [NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)

## 关于作者

- Coalus：[Telegram](https://t.me/coalus) 或 [GitHub](https://github.com/coalus)

## 另请参见

- [NFT 用例](/v3/documentation/dapps/defi/nft)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2.md
================================================
---
description: 在本文中，我们将创建一个简单的Telegram机器人，用于接收TON支付。
---

# 带有自己余额的机器人

在本文中，我们将创建一个简单的Telegram机器人，用于接收TON支付。

## 🦄 外观

机器人将如下所示：

![image](/img/tutorials/bot1.png)

### 源代码

源代码可在GitHub上获得：

- https://github.com/Gusarich/ton-bot-example

## 📖 你将学到什么

你将学会：

- 使用Aiogram在Python3中创建一个Telegram机器人
- 使用SQLITE数据库
- 使用公共TON API

## ✍️ 开始之前你需要

如果还没有安装[Python](https://www.python.org/)，请先安装。

还需要以下PyPi库：

- aiogram
- requests

你可以在终端中用一条命令安装它们。

```bash
pip install aiogram==2.21 requests
```

## 🚀 开始吧！

为我们的机器人创建一个目录，其中包含四个文件：

- `bot.py`—运行Telegram机器人的程序
- `config.py`—配置文件
- `db.py`—与sqlite3数据库交互的模块
- `ton.py`—处理TON支付的模块

目录应该看起来像这样：

```
my_bot
├── bot.py
├── config.py
├── db.py
└── ton.py
```

现在，让我们开始编写代码吧！

## 配置

我们先从`config.py`开始，因为它是最小的一个。我们只需要在其中设置一些参数。

**config.py**

```python
BOT_TOKEN = 'YOUR BOT TOKEN'
DEPOSIT_ADDRESS = 'YOUR DEPOSIT ADDRESS'
API_KEY = 'YOUR API KEY'
RUN_IN_MAINNET = True  # Switch True/False to change mainnet to testnet

if RUN_IN_MAINNET:
    API_BASE_URL = 'https://toncenter.com'
else:
    API_BASE_URL = 'https://testnet.toncenter.com'
```

这里你需要在前三行填入值：

- `BOT_TOKEN`是你的Telegram机器人令牌，可以在[创建机器人](https://t.me/BotFather)后获得。
- `DEPOSIT_ADDRESS`是你的项目钱包地址，将接受所有支付。你可以简单地创建一个新的TON钱包并复制其地址。
- `API_KEY`是你从TON Center获得的API密钥，可以在[这个机器人](https://t.me/tonapibot)中获得。

你还可以选择你的机器人是运行在测试网上还是主网上（第4行）。

配置文件就是这些了，我们可以继续向前了！

## 数据库

现在让我们编辑`db.py`文件，该文件将处理我们机器人的数据库。

导入sqlite3库。

```python
import sqlite3
```

初始化数据库连接和游标（你可以选择任何文件名，而不仅限于`db.sqlite`）。

```python
con = sqlite3.connect('db.sqlite')
cur = con.cursor()
```

为了存储关于用户的信息（在我们的案例中是他们的余额），创建一个名为"Users"的表，包含用户ID和余额行。

```python
cur.execute('''CREATE TABLE IF NOT EXISTS Users (
                uid INTEGER,
                balance INTEGER
            )''')
con.commit()
```

现在我们需要声明一些函数来处理数据库。

`add_user`函数将用于将新用户插入数据库。

```python
def add_user(uid):
    # new user always has balance = 0
    cur.execute(f'INSERT INTO Users VALUES ({uid}, 0)')
    con.commit()
```

`check_user`函数将用于检查用户是否存在于数据库中。

```python
def check_user(uid):
    cur.execute(f'SELECT * FROM Users WHERE uid = {uid}')
    user = cur.fetchone()
    if user:
        return True
    return False
```

`add_balance`函数将用于增加用户的余额。

```python
def add_balance(uid, amount):
    cur.execute(f'UPDATE Users SET balance = balance + {amount} WHERE uid = {uid}')
    con.commit()
```

`get_balance`函数将用于检索用户的余额。

```python
def get_balance(uid):
    cur.execute(f'SELECT balance FROM Users WHERE uid = {uid}')
    balance = cur.fetchone()[0]
    return balance
```

`db.py`文件的内容就这些了！

现在，我们可以在机器人的其他组件中使用这四个函数来处理数据库。

## TON Center API

在`ton.py`文件中，我们将声明一个函数，该函数将处理所有新的存款，增加用户余额，并通知用户。

### getTransactions 方法

我们将使用TON Center API。他们的文档在这里：
https://toncenter.com/api/v2/

我们需要[getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get)方法来获取某个账户最新交易的信息。

让我们看看这个方法作为输入参数需要什么以及它返回了什么。

只有一个必填的输入字段`address`，但我们还需要`limit`字段来指定我们想要返回多少个交易。

现在让我们尝试在[TON Center 网站](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get)上运行这个方法，使用任何一个已存在的钱包地址，以了解我们应该从输出中得到什么。

```json
{
  "ok": true,
  "result": [
    {
      ...
    },
    {
      ...
    }
  ]
}
```

好的，所以当一切正常时，`ok`字段被设置为`true`，并且我们有一个数组`result`，列出了`limit`最近的交易。现在让我们看看单个交易：

```json
{
    "@type": "raw.transaction",
    "utime": 1666648337,
    "data": "...",
    "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32294193000003",
        "hash": "ez3LKZq4KCNNLRU/G4YbUweM74D9xg/tWK0NyfuNcxA="
    },
    "fee": "105608",
    "storage_fee": "5608",
    "other_fee": "100000",
    "in_msg": {
        "@type": "raw.message",
        "source": "EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL",
        "destination": "EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN",
        "value": "100000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32294193000002",
        "body_hash": "tDJM2A4YFee5edKRfQWLML5XIJtb5FLq0jFvDXpv0xI=",
        "msg_data": {
            "@type": "msg.dataText",
            "text": "SGVsbG8sIHdvcmxkIQ=="
        },
        "message": "Hello, world!"
    },
    "out_msgs": []
}
```

我们可以看到可以帮助我们识别确切交易的信息存储在`transaction_id`字段中。我们需要从中获取`lt`字段，以了解哪个交易先发生，哪个后发生。

关于coin转移的信息在`in_msg`字段中。我们需要从中获取`value`和`message`。

现在我们准备好创建支付处理程序了。

### 从代码中发送 API 请求

让我们从导入所需的库和之前的两个文件`config.py`和`db.py`开始。

```python
import requests
import asyncio

# Aiogram
from aiogram import Bot
from aiogram.types import ParseMode

# We also need config and database here
import config
import db
```

让我们考虑如何可以实现支付处理。

我们可以每隔几秒调用API，并检查我们的钱包地址是否有任何新交易。

为此，我们需要知道最后处理的交易是什么。最简单的方法是只将该交易的信息保存在某个文件中，并在我们处理新交易时更新它。

我们需要将哪些交易信息存储在文件中？实际上，我们只需要存储`lt`值——逻辑时间。有了这个值，我们就能知道需要处理哪些交易。

所以我们需要定义一个新的异步函数；让我们称之为`start`。为什么这个函数需要是异步的？因为Telegram机器人的Aiogram库也是异步的，稍后使用异步函数会更容易。

这是我们的`start`函数应该看起来的样子：

```python
async def start():
    try:
        # Try to load last_lt from file
        with open('last_lt.txt', 'r') as f:
            last_lt = int(f.read())
    except FileNotFoundError:
        # If file not found, set last_lt to 0
        last_lt = 0

    # We need the Bot instance here to send deposit notifications to users
    bot = Bot(token=config.BOT_TOKEN)

    while True:
        # Here we will call API every few seconds and fetch new transactions.
        ...
```

现在让我们编写while循环的主体。我们需要每隔几秒在这里调用TON Center API。

```python
while True:
    # 2 Seconds delay between checks
    await asyncio.sleep(2)

    # API call to TON Center that returns last 100 transactions of our wallet
    resp = requests.get(f'{config.API_BASE_URL}/api/v2/getTransactions?'
                        f'address={config.DEPOSIT_ADDRESS}&limit=100&'
                        f'archival=true&api_key={config.API_KEY}').json()

    # If call was not successful, try again
    if not resp['ok']:
        continue
    
    ...
```

在使用`requests.get`调用后，我们有一个变量`resp`包含了API的响应。`resp`是一个对象，`resp['result']`是一个列表，包含了我们地址的最后100笔交易。

现在我们只需遍历这些交易，找到新的交易即可。

```python
while True:
    ...

    # Iterating over transactions
    for tx in resp['result']:
        # LT is Logical Time and Hash is hash of our transaction
        lt, hash = int(tx['transaction_id']['lt']), tx['transaction_id']['hash']

        # If this transaction's logical time is lower than our last_lt,
        # we already processed it, so skip it

        if lt <= last_lt:
            continue
        
        # at this moment, `tx` is some new transaction that we haven't processed yet
        ...
```

我们如何处理一笔新的交易呢？我们需要：

- 理解哪个用户发送了它
- 增加该用户的余额
- 通知用户他们的存款

下面是将完成所有这些操作的代码：

```python
while True:
    ...

    for tx in resp['result']:
        ...
        # at this moment, `tx` is some new transaction that we haven't processed yet

        value = int(tx['in_msg']['value'])
        if value > 0:
            uid = tx['in_msg']['message']

            if not uid.isdigit():
                continue

            uid = int(uid)

            if not db.check_user(uid):
                continue

            db.add_balance(uid, value)

            await bot.send_message(uid, 'Deposit confirmed!\n'
                                    f'*+{value / 1e9:.2f} TON*',
                                    parse_mode=ParseMode.MARKDOWN)
```

让我们看看它做了什么。

所有有关coin转移的信息都在`tx['in_msg']`中。我们只需要其中的'value'和'message'字段。

首先，我们检查值是否大于零，如果是，才继续。

然后我们期望转移有一个评论（`tx['in_msg']['message']`），以有我们机器人的用户ID，所以我们验证它是否是一个有效的数字，以及该UID是否存在于我们的数据库中。

经过这些简单的检查，我们有了一个变量`value`，它是存款金额，和一个变量`uid`，它是进行此次存款的用户ID。所以我们可以直接给他们的账户增加资金，并发送通知消息。

同时注意值默认是以nanotons为单位的，所以我们需要将其除以10亿。我们在通知消息中这样做：
`{value / 1e9:.2f}`
这里我们将值除以`1e9`（10亿），并保留小数点后两位数字，以便以用户友好的格式显示给用户。

太棒了！程序现在可以处理新交易并通知用户存款情况。但我们不应忘记之前我们使用过的`lt`，我们必须更新最后的`lt`，因为处理了一个更新的交易。

这很简单：

```python
while True:
    ...
    for tx in resp['result']:
        ...
        # we have processed this tx

        # lt variable here contains LT of the last processed transaction
        last_lt = lt
        with open('last_lt.txt', 'w') as f:
            f.write(str(last_lt))
```

`ton.py`文件的内容就这些了！
我们的机器人现在已完成3/4；我们只需要在机器人自身创建一个包含几个按钮的用户界面。

## Telegram 机器人

### 初始化

打开`bot.py`文件并导入我们所需的所有模块。

```python
# Logging module
import logging

# Aiogram imports
from aiogram import Bot, Dispatcher, types
from aiogram.dispatcher.filters import Text
from aiogram.types import ParseMode, ReplyKeyboardMarkup, KeyboardButton, \
                          InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor

# Local modules to work with the Database and TON Network
import config
import ton
import db
```

让我们设置日志记录，以便我们以后可以看到发生的事情以便调试。

```python
logging.basicConfig(level=logging.INFO)
```

现在我们需要使用Aiogram初始化机器人对象及其调度器。

```python
bot = Bot(token=config.BOT_TOKEN)
dp = Dispatcher(bot)
```

这里我们使用了教程开始时我们创建的配置中的`BOT_TOKEN`。

我们初始化了机器人，但它仍然是空的。我们必须添加一些与用户交互的功能。

### 消息处理器

#### /start 命令

我们首先处理`/start`和`/help`命令。当用户第一次启动机器人、重新启动它或使用`/help`命令时，将调用此函数。

```python
@dp.message_handler(commands=['start', 'help'])
async def welcome_handler(message: types.Message):
    uid = message.from_user.id  # Not neccessary, just to make code shorter

    # If user doesn't exist in database, insert it
    if not db.check_user(uid):
        db.add_user(uid)

    # Keyboard with two main buttons: Deposit and Balance
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.row(KeyboardButton('Deposit'))
    keyboard.row(KeyboardButton('Balance'))

    # Send welcome text and include the keyboard
    await message.answer('Hi!\nI am example bot '
                         'made for [this article](docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2).\n'
                         'My goal is to show how simple it is to receive '
                         'payments in Toncoin with Python.\n\n'
                         'Use keyboard to test my functionality.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

欢迎消息可以是你想要的任何内容。键盘按钮可以是任何文本，但在这个示例中，它们被标记为我们的机器人最清晰的方式：`Deposit`和`Balance`。

#### 余额(Balance)按钮

现在用户可以启动机器人并看到带有两个按钮的键盘。但在调用其中一个后，用户不会收到任何响应，因为我们还没有为它们创建任何功能。

所以让我们添加一个请求余额的功能。

```python
@dp.message_handler(commands='balance')
@dp.message_handler(Text(equals='balance', ignore_case=True))
async def balance_handler(message: types.Message):
    uid = message.from_user.id

    # Get user balance from database
    # Also don't forget that 1 TON = 1e9 (billion) Nanoton
    user_balance = db.get_balance(uid) / 1e9

    # Format balance and send to user
    await message.answer(f'Your balance: *{user_balance:.2f} TON*',
                         parse_mode=ParseMode.MARKDOWN)
```

这非常简单。我们只需从数据库获取余额并向用户发送消息。

#### 存款(Deposit)按钮

那第二个`Deposit`按钮呢？这是它的函数：

```python
@dp.message_handler(commands='deposit')
@dp.message_handler(Text(equals='deposit', ignore_case=True))
async def deposit_handler(message: types.Message):
    uid = message.from_user.id

    # Keyboard with deposit URL
    keyboard = InlineKeyboardMarkup()
    button = InlineKeyboardButton('Deposit',
                                  url=f'ton://transfer/{config.DEPOSIT_ADDRESS}&text={uid}')
    keyboard.add(button)

    # Send text that explains how to make a deposit into bot to user
    await message.answer('It is very easy to top up your balance here.\n'
                         'Simply send any amount of TON to this address:\n\n'
                         f'`{config.DEPOSIT_ADDRESS}`\n\n'
                         f'And include the following comment: `{uid}`\n\n'
                         'You can also deposit by clicking the button below.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

这里我们要做的也很容易理解。

还记得在`ton.py`文件中，我们是如何通过评论确定哪个用户进行了存款吗？现在在机器人中，我们需要请求用户发送包含他们UID的交易。

### 启动机器人

现在在`bot.py`中我们要做的最后一件事是启动机器人本身，同时也运行`ton.py`中的`start`函数。

```python
if __name__ == '__main__':
    # Create Aiogram executor for our bot
    ex = executor.Executor(dp)

    # Launch the deposit waiter with our executor
    ex.loop.create_task(ton.start())

    # Launch the bot
    ex.start_polling()
```

此时，我们已经编写了我们机器人所需的所有代码。如果你按照教程正确完成，当你使用`python my-bot/bot.py`命令在终端运行时，它应该会工作。

如果你的机器人不能正确工作，请与[这个库](https://github.com/Gusarich/ton-bot-example)的代码进行对比。

## 参考资料

- 作为[ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)的一部分
- 由Gusarich提供（[Telegram @Gusarich](https://t.me/Gusarich), [Gusarich on GitHub](https://github.com/Gusarich)）



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js.md
================================================
---
description: 在本教程结束时，你将编写一个美观的机器人，能够直接用TON接受你的产品的支付。
---

# 出售饺子的机器人

在本文中，我们将创建一个简单的Telegram机器人，用于接收TON支付。

## 🦄 外观

在教程结束时，你将编写一个美观的机器人，能够直接用TON接受你的产品的支付。

机器人将如下所示：

![bot preview](/img/tutorials/js-bot-preview.jpg)

## 📖 你将学到什么

你将学会如何：

- 使用grammY在NodeJS中创建一个Telegram机器人
- 使用公共TON Center API

> 我们为什么使用grammY？
> 因为grammY是一个现代化、年轻的、高级框架，适用于在JS/TS/Deno上快速舒适地开发telegram机器人，此外，grammY拥有优秀的[文档](https://grammy.dev)和一个能够始终帮助你的活跃社群。

## ✍️ 开始之前你需要

如果还没有安装[NodeJS](https://nodejs.org/en/download/)，请先安装。

你还需要以下库：

- grammy
- ton
- dotenv

你可以在终端中用一条命令安装它们。

```bash npm2yarn
npm install ton dotenv grammy @grammyjs/conversations
```

## 🚀 开始吧！

我们项目的结构将如下所示：

```
src
    ├── bot
        ├── start.js
        ├── payment.js
    ├── services 
        ├── ton.js
    ├── app.js
.env
```

- `bot/start.js` & `bot/payment.js` - 用于telegram机器人的处理程序文件
- `src/ton.js` - 与TON相关的业务逻辑文件
- `app.js` - 用于初始化并启动机器人的文件

现在让我们开始编写代码吧！

## 配置

我们从`.env`开始。我们只需要在其中设置一些参数。

**.env**

```
BOT_TOKEN=
TONCENTER_TOKEN=
NETWORK=
OWNER_WALLET= 
```

这里你需要填写前四行的值：

- `BOT_TOKEN`是你的Telegram机器人令牌，可以在[创建机器人](https://t.me/BotFather)后获得。
- `OWNER_WALLET`是你的项目钱包地址，将接受所有支付。你可以简单地创建一个新的TON钱包并复制其地址。
- `API_KEY`是你从 TON Center 获得的API密钥，分别针对主网和测试网，可以通过[@tonapibot](https://t.me/tonapibot)/[@tontestnetapibot](https://t.me/tontestnetapibot)获得。
- `NETWORK`是关于你的机器人将运行在哪个网络上 - 测试网或主网

配置文件就这些了，我们可以继续前进！

## TON Center API

在`src/services/ton.js`文件中，我们将声明一些函数，用于验证交易的存在并生成快速跳转到钱包应用进行支付的链接。

### 获取最新的钱包交易

我们的任务是从特定钱包中检查我们需要的交易是否存在。

我们将这样解决它：

1. 我们将接收到发往我们钱包的最后一批交易。为什么是我们的？在这种情况下，我们不必担心用户的钱包地址是什么，我们不必确认它是他的钱包，我们也不必将这个钱包存储在任何地方。
2. 排序并只保留入账交易
3. 我们将检查所有交易，每次都会校验注释和金额是否与我们拥有的数据相等
4. 庆祝我们的问题解决🎉

#### 获取最新交易

如果我们使用TON Center API，那么我们可以参考他们的[文档](https://toncenter.com/api/v2/)，找到一个理想解决我们问题的方法 - [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get)

我们只需要一个参数就能获取交易 - 接受支付的钱包地址，但我们也会使用limit参数来限制交易发放到100条。

让我们尝试调用`EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N`地址的测试请求（顺带一提，这是TON基金会的地址）

```bash
curl -X 'GET' \
  'https://toncenter.com/api/v2/getTransactions?address=EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N&limit=100' \
  -H 'accept: application/json'
```

很好，现在我们手头有了一份交易列表在["result"]中，现在让我们仔细看看1笔交易

```json
{
      "@type": "raw.transaction",
      "utime": 1667148685,
      "data": "*data here*",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32450206000003",
        "hash": "rBHOq/T3SoqWta8IXL8THxYqTi2tOkBB8+9NK0uKWok="
      },
      "fee": "106508",
      "storage_fee": "6508",
      "other_fee": "100000",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG",
        "destination": "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
        "value": "1000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32450206000002",
        "body_hash": "Fl+2CzHNgilBE4RKhfysLU8VL8ZxYWciCRDva2E19QQ=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "aGVsbG8g8J+Riw=="
        },
        "message": "hello 👋"
      },
      "out_msgs": []
    }
```

从这个json文件中，我们可以了解一些对我们有用的信息：

- 这是一笔入账交易，因为"out_msgs"字段为空
- 我们还可以获取交易的评论、发送者和交易金额

现在我们准备好创建一个交易检查器了

### 使用 TON

让我们先导入所需的TON库

```js
import { HttpApi, fromNano, toNano } from "ton";
```

让我们考虑如何检查用户是否发送了我们需要的交易。

一切都异常简单。我们只需排序我们钱包的入账交易，然后遍历最后100笔交易，如果找到一笔符合相同注释和金额的交易，那么我们就找到了我们需要的交易！

首先，让我们初始化http客户端，以方便使用TON

```js
export async function verifyTransactionExistance(toWallet, amount, comment) {
  const endpoint =
    process.env.NETWORK === "mainnet"
      ? "https://toncenter.com/api/v2/jsonRPC"
      : "https://testnet.toncenter.com/api/v2/jsonRPC";
  const httpClient = new HttpApi(
    endpoint,
    {},
    { apiKey: process.env.TONCENTER_TOKEN }
  );
```

这里我们根据配置中选择的网络简单地生成endpoint url。然后我们初始化http客户端。

所以，现在我们可以从所有者的钱包中获取最后100笔交易

```js
const transactions = await httpClient.getTransactions(toWallet, {
    limit: 100,
  });
```

并过滤，仅保留入账交易（如果交易的out_msgs为空，我们保留它）

```js
let incomingTransactions = transactions.filter(
    (tx) => Object.keys(tx.out_msgs).length === 0
  );
```

现在我们只需遍历所有交易，只要comment和交易值匹配，我们就返回true。

```js
  for (let i = 0; i < incomingTransactions.length; i++) {
    let tx = incomingTransactions[i];
    // Skip the transaction if there is no comment in it
    if (!tx.in_msg.msg_data.text) {
      continue;
    }

    // Convert transaction value from nano
    let txValue = fromNano(tx.in_msg.value);
    // Get transaction comment
    let txComment = tx.in_msg.message

    if (txComment === comment && txValue === value.toString()) {
      return true;
    }
  }

  return false;
```

注意，值默认是以nanotons为单位，所以我们需要将其除以10亿，或者我们可以直接使用TON库中的`fromNano`方法。`verifyTransactionExistance`函数就是这些了！

现在我们可以创建生成快速跳转到钱包应用进行支付的链接的函数了。

```js
export function generatePaymentLink(toWallet, amount, comment, app) {
  if (app === "tonhub") {
    return `https://tonhub.com/transfer/${toWallet}?amount=${toNano(
      amount
    )}&text=${comment}`;
  }
  return `https://app.tonkeeper.com/transfer/${toWallet}?amount=${toNano(
    amount
  )}&text=${comment}`;
}
```

我们所需的只是将交易参数代入URL中。不要忘记将交易值转换为nano。

## Telegram 机器人

### 初始化

打开`app.js`文件并导入我们需要的所有处理程序和模块。

```js
import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import {
  startPaymentProcess,
  checkTransaction,
} from "./bot/handlers/payment.js";
import handleStart from "./bot/handlers/start.js";
```

让我们设置dotenv模块，以便舒适地使用我们在.env文件中设置的环境变量。

```js
dotenv.config();
```

之后我们创建一个将运行我们项目的函数。为了防止出现任何错误时我们的机器人停止，我们添加了这段代码。

```js
async function runApp() {
  console.log("Starting app...");

  // Handler of all errors, in order to prevent the bot from stopping
  process.on("uncaughtException", function (exception) {
    console.log(exception);
  });
```

现在初始化机器人和必要的插件。

```js
  // Initialize the bot
  const bot = new Bot(process.env.BOT_TOKEN);

  // Set the initial data of our session
  bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
  // Install the conversation plugin
  bot.use(conversations());

  bot.use(createConversation(startPaymentProcess));
```

这里我们使用了教程开始时我们创建的配置中的`BOT_TOKEN`。

我们初始化了机器人，但它还是空的。我们必须添加一些用于与用户互动的功能。

```js
  // Register all handelrs
  bot.command("start", handleStart);
  bot.callbackQuery("buy", async (ctx) => {
    await ctx.conversation.enter("startPaymentProcess");
  });
  bot.callbackQuery("check_transaction", checkTransaction);
```

对于命令/start，将执行handleStart函数。如果用户点击callback_data等于"buy"的按钮，我们将启动我们刚刚注册的"对话"。当我们点击callback_data等于"check_transaction"的按钮时，将执行checkTransaction函数。

我们所剩的就是启动我们的机器人并输出有关成功启动的日志。

```js
  // Start bot
  await bot.init();
  bot.start();
  console.info(`Bot @${bot.botInfo.username} is up and running`);
```

### 消息处理

#### /start 命令

我们从处理`/start`命令开始。当用户首次启动机器人或重新启动它时，将调用此函数。

```js
import { InlineKeyboard } from "grammy";

export default async function handleStart(ctx) {
  const menu = new InlineKeyboard()
    .text("Buy dumplings🥟", "buy")
    .row()
    .url("Article with a detailed explanation of the bot's work", "docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js");

  await ctx.reply(
    `Hello stranger!
Welcome to the best Dumplings Shop in the world <tg-spoiler>and concurrently an example of accepting payments in TON</tg-spoiler>`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```

这里我们首先从grammy模块导入InlineKeyboard。之后，在处理程序中我们创建了内联键盘，提供购买饺子的选项和文章链接（这里有点递归😁）。.row()代表将下一个按钮转移到新行。
之后，我们带着创建的键盘发送欢迎消息，文本中（重要的是，我在我的消息中使用HTML标记来装饰它）
欢迎消息可以是任何你想要的内容。

#### 支付过程

像往常一样，我们将从必要的导入开始我们的文件。

```js
import { InlineKeyboard } from "grammy";

import {
  generatePaymentLink,
  verifyTransactionExistance,
} from "../../services/ton.js";
```

之后，我们将创建一个startPaymentProcess处理程序，我们已经在app.js中注册了它以在按下某个按钮时执行。

在Telegram中，当你点击内联按钮时，会出现一个旋转的手表，为了移除它，我们响应回调。

```js
  await ctx.answerCallbackQuery();
```

之后，我们需要向用户发送一张饺子图片，询问他想要购买的饺子数量。并等待他输入这个数字。

```js
  await ctx.replyWithPhoto(
    "https://telegra.ph/file/bad2fd69547432e16356f.jpg",
    {
      caption:
        "Send the number of portions of yummy dumplings you want buy\nP.S. Current price for 1 portion: 3 TON",
    }
  );

  // Wait until the user enters the number
  const count = await conversation.form.number();
```

现在我们计算订单的总金额并生成一个随机字符串，我们将用该字符串来评论交易，并添加饺子后缀。

```js
  // Get the total cost: multiply the number of portions by the price of the 1 portion
  const amount = count * 3;
  // Generate random comment
  const comment = Math.random().toString(36).substring(2, 8) + "dumplings";
```

我们将结果数据保存到会话中，以便我们可以在下一个处理程序中获取这些数据。

```js
  conversation.session.amount = amount;
  conversation.session.comment = comment;
```

我们生成快速支付的链接并创建一个内联键盘。

```js
const tonhubPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonhub"
  );
  const tonkeeperPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonkeeper"
  );

  const menu = new InlineKeyboard()
    .url("Click to pay in TonHub", tonhubPaymentLink)
    .row()
    .url("Click to pay in Tonkeeper", tonkeeperPaymentLink)
    .row()
    .text(`I sent ${amount} TON`, "check_transaction");
```

我们发送带有键盘的消息，在其中我们请求用户将交易发送到我们的钱包地址并附上随机生成的评论。

```js
  await ctx.reply(
    `
Fine, all you have to do is transfer ${amount} TON to the wallet <code>${process.env.OWNER_WALLET}</code> with the comment <code>${comment}</code>.

<i>WARNING: I am currently working on ${process.env.NETWORK}</i>

P.S. You can conveniently make a transfer by clicking on the appropriate button below and confirm the transaction in the offer`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```

现在我们所需要做的就是创建一个检查交易是否存在的处理程序。

```js
export async function checkTransaction(ctx) {
  await ctx.answerCallbackQuery({
    text: "Wait a bit, I need to check the availability of your transaction",
  });

  if (
    await verifyTransactionExistance(
      process.env.OWNER_WALLET,
      ctx.session.amount,
      ctx.session.comment
    )
  ) {
    const menu = new InlineKeyboard().text("Buy more dumplings🥟", "buy");

    await ctx.reply("Thank you so much. Enjoy your meal!", {
      reply_markup: menu,
    });

    // Reset the session data
    ctx.session.amount = 0;
    ctx.session.comment = "";
  } else {
    await ctx.reply("I didn't receive your transaction, wait a bit");
  }
}
```

这里我们所做的就是检查交易是否存在，如果存在，我们就告诉用户这个消息并重置会话中的数据。

### 启动机器人

要启动，请使用这个命令：

```bash npm2yarn
npm run app
```

如果你的机器人不能正确工作，与[此库](https://github.com/coalus/DumplingShopBot)的代码进行对比。如果无法解决，请随时写信给我。我的Telegram账号见下方。

## 参考资料

- 作为[ton-footsteps/58](https://github.com/ton-society/ton-footsteps/issues/58)的一部分
- 作者 Coalus（[Telegram @coalus](https://t.me/coalus), [Coalus on GitHub](https://github.com/coalus)）
- [机器人源码](https://github.com/coalus/DumplingShopBot)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot.md
================================================
---
description: 在这篇文章中，我们将引导你完成在 Telegram 机器人中接受付款的过程。
---

# 使用 TON 的商店机器人

在这篇文章中，我们将引导你完成在 Telegram 机器人中接受付款的过程。

## 📖 你将学到什么

在这篇文章中，你将学习如何：

- 使用 Python + Aiogram 创建一个 Telegram 机器人
- 使用公开的 TON API（TON Center）
- 使用 SQlite 数据库

最后：通过前面步骤的知识，在 Telegram 机器人中接受付款。

## 📚 在我们开始之前

确保你已经安装了最新版本的 Python，并且已经安装了以下包：

- aiogram
- requests
- sqlite3

## 🚀 我们开始吧！

我们将按照以下顺序操作：

1. 使用 SQlite 数据库
2. 使用公开的 TON API（TON Center）
3. 使用 Python + Aiogram 创建一个 Telegram 机器人
4. 盈利！

让我们在项目目录中创建以下四个文件：

```
telegram-bot
├── config.json
├── main.py
├── api.py
└── db.py
```

## 配置

在 `config.json` 中，我们将存储我们的机器人令牌和我们的公开 TON API 密钥。

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

在 `config.json` 中，我们决定我们将使用哪个网络：`testnet` 或 `mainnet`。

## 数据库

### 创建数据库

这个示例使用本地 Sqlite 数据库。

创建 `db.py`。

开始使用数据库，我们需要导入 sqlite3 模块和一些用于处理时间的模块。

```python
import sqlite3
import datetime
import pytz
```

- `sqlite3`—用于操作 sqlite 数据库的模块
- `datetime`—用于处理时间的模块
- `pytz`—用于处理时区的模块

接下来，我们需要创建一个数据库的连接和一个用于操作它的游标：

```python
locCon = sqlite3.connect('local.db', check_same_thread=False)
cur = locCon.cursor()
```

如果数据库不存在，将会自动创建。

现在我们可以创建表格了。我们有两个表格。

#### 交易：

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

- `source`—付款人的钱包地址
- `hash`—交易哈希
- `value`—交易价值
- `comment`—交易备注

#### 用户：

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

- `id`—Telegram 用户 ID
- `username`—Telegram 用户名
- `first_name`—Telegram 用户的名字
- `wallet`—用户钱包地址

在 `users` 表中，我们存储用户 :) 他们的 Telegram ID、@username、
名字和钱包。第一次成功付款时，钱包将被添加到数据库中。

`transactions` 表存储已验证的交易。
要验证交易，我们需要哈希、来源、值和备注。

要创建这些表格，我们需要运行以下函数：

```python
cur.execute('''CREATE TABLE IF NOT EXISTS transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                        NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
)''')
locCon.commit()

cur.execute('''CREATE TABLE IF NOT EXISTS users (
    id         INTEGER       UNIQUE
                            NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
)''')
locCon.commit()
```

如果这些表格还没有被创建，这段代码将会创建它们。

### 使用数据库

让我们分析一种情况：
用户进行了一笔交易。我们如何验证它？我们如何确保同一笔交易不被二次确认？

交易中有一个 body_hash，通过它我们可以轻松地了解数据库中是否存在该交易。

我们只添加我们确定的交易到数据库。`check_transaction` 函数检查数据库中是否存在找到的交易。

`add_v_transaction` 将交易添加到交易表。

```python
def add_v_transaction(source, hash, value, comment):
    cur.execute("INSERT INTO transactions (source, hash, value, comment) VALUES (?, ?, ?, ?)",
                (source, hash, value, comment))
    locCon.commit()
```

```python
def check_transaction(hash):
    cur.execute(f"SELECT hash FROM transactions WHERE hash = '{hash}'")
    result = cur.fetchone()
    if result:
        return True
    return False
```

`check_user` 检查用户是否在数据库中，并且如果不在，则添加他。

```python
def check_user(user_id, username, first_name):
    cur.execute(f"SELECT id FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()

    if not result:
        cur.execute("INSERT INTO users (id, username, first_name) VALUES (?, ?, ?)",
                    (user_id, username, first_name))
        locCon.commit()
        return False
    return True
```

用户可以在表中存储一个钱包。它是在第一次成功购买时添加的。`v_wallet` 函数检查用户是否有关联的钱包。如果有，则返回它。如果没有，则添加。

```python
def v_wallet(user_id, wallet):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    if result[0] == "none":
        cur.execute(
            f"UPDATE users SET wallet = '{wallet}' WHERE id = '{user_id}'")
        locCon.commit()
        return True
    else:
        return result[0]
```

`get_user_wallet` 简单地返回用户的钱包。

```python
def get_user_wallet(user_id):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    return result[0]
```

`get_user_payments` 返回用户的支付列表。
这个函数检查用户是否有钱包。如果有，则返回支付列表。

```python
def get_user_payments(user_id):
    wallet = get_user_wallet(user_id)

    if wallet == "none":
        return "You have no wallet"
    else:
        cur.execute(f"SELECT * FROM transactions WHERE source = '{wallet}'")
        result = cur.fetchall()
        tdict = {}
        tlist = []
        try:
            for transaction in result:
                tdict = {
                    "value": transaction[2],
                    "comment": transaction[3],
                }
                tlist.append(tdict)
            return tlist

        except:
            return False
```

## API

*我们有能力使用一些网络成员提供的第三方 API 与区块链进行交互。通过这些服务，开发者可以跳过运行自己的节点和自定义 API 的步骤。*

### 需要的请求

实际上，我们需要确认用户已经向我们转账了所需金额吗？

我们只需要查看我们钱包的最新进账转账，并在其中找到一笔来自正确地址、正确金额的交易（可能还有一个独特的备注）。
为了所有这一切，TON Center 有一个 `getTransactions` 方法。

### getTransactions

默认情况下，如果我们使用它，我们将获得最后 10 条交易。然而，我们也可以表示我们需要更多，但这会略微增加响应时间。而且，很有可能，你不需要那么多。

如果您想要更多，那么每笔交易都有 `lt` 和 `hash`。您可以查看例如 30 条交易，如果没在其中找到正确的一笔，那么取最后一笔的 `lt` 和 `hash` 添加到请求中。

这样您就可以得到下一个 30 条交易，以此类推。

例如，测试网络中有一个钱包 `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5`，它有一些交易：

使用[查询](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5\\&limit=2\\&to_lt=0\\&archival=true) 我们将得到包含两笔交易的响应（现在不需要的一些信息已经被隐藏，完整答案可以在上面的链接中看到）。

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1944556000003",
        // highlight-next-line
        "hash": "swpaG6pTBXwYI2024NAisIFp59Fw3k1DRQ5fa5SuKAE="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "kBfGYBTkBaooeZ+NTVR0EiVGSybxQdb/ifXCRX5O7e0=",
        "message": "Sea breeze 🌊"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1943166000003",
        // highlight-next-line
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    }
  ]
}
```

我们从这个地址收到了最后两笔交易。当添加 `lt` 和 `hash` 到查询中时，我们将再次收到两笔交易。然而，第二笔将成为下一笔连续的交易。也就是说，我们将获得这个地址的第二笔和第三笔交易。

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        "lt": "1943166000003",
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        "lt": "1845458000003",
        "hash": "k5U9AwIRNGhC10hHJ3MBOPT//bxAgW5d9flFiwr1Sao="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "XpTXquHXP64qN6ihHe7Tokkpy88tiL+5DeqIrvrNCyo=",
        "message": "Second"
      },
      "out_msgs": []
    }
  ]
}
```

请求将看起来像[这样。](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5\\&limit=2\\&lt=1943166000003\\&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D\\&to_lt=0\\&archival=true)

我们还需要一个方法 `detectAddress`。

这是测试网上的 Tonkeeper 钱包地址的一个例子：`kQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aCTb`。如果我们在浏览器中查找交易，代替上述地址，有：`EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R`。

这个方法返回给我们“正确”的地址。

```json
{
  "ok": true,
  "result": {
    "raw_form": "0:b3409241010f85ac415cbf13b9b0dc6157d09a39d2bd0827eadb20819f067868",
    "bounceable": {
      "b64": "EQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
      // highlight-next-line
      "b64url": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R"
    },
    "non_bounceable": {
      "b64": "UQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU",
      "b64url": "UQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU"
    }
  }
}
```

我们需要 `b64url`。

这个方法让我们能够验证用户的地址。

大部分而言，这就是我们所需要的。

### API 请求及其处理方法

让我们回到 IDE。创建文件 `api.py`。

导入所需的库。

```python
import requests
import json
# We import our db module, as it will be convenient to add from here
# transactions to the database
import db
```

- `requests`—用来向 API 发送请求
- `json`—用来处理 json
- `db`—用来处理我们的 sqlite 数据库

让我们创建两个变量来存储请求的开头。

```python
# This is the beginning of our requests
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"
```

从 config.json 文件中获取所有 API 令牌和钱包。

```python
# Find out which network we are working on
with open('config.json', 'r') as f:
    config_json = json.load(f)
    MAINNET_API_TOKEN = config_json['MAINNET_API_TOKEN']
    TESTNET_API_TOKEN = config_json['TESTNET_API_TOKEN']
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']
```

根据网络，我们取所需的数据。

```python
if WORK_MODE == "mainnet":
    API_BASE = MAINNET_API_BASE
    API_TOKEN = MAINNET_API_TOKEN
    WALLET = MAINNET_WALLET
else:
    API_BASE = TESTNET_API_BASE
    API_TOKEN = TESTNET_API_TOKEN
    WALLET = TESTNET_WALLET
```

我们的第一个请求函数 `detectAddress`。

```python
def detect_address(address):
    url = f"{API_BASE}detectAddress?address={address}&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    try:
        return response['result']['bounceable']['b64url']
    except:
        return False
```

在输入中，我们有预计的地址，输出要么是我们需要的“正确”地址，以便进行进一步的工作，要么是 False。

你可能会注意到请求末尾出现了 API 密钥。它是为了移除对 API 请求数量的限制。没有它，我们被限制为每秒一个请求。

这里是 `getTransactions` 的下一个函数：

```python
def get_address_transactions():
    url = f"{API_BASE}getTransactions?address={WALLET}&limit=30&archival=true&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    return response['result']
```

此函数返回最后 30 次对我们 `WALLET` 的交易。

这里可以看到 `archival=true`。这是因为我们只需要从具有完整区块链历史记录的节点获取交易。

在输出中，我们获得一个交易列表—[{0},{1},…,{29}]。简而言之，是字典列表。

最后一个函数：

```python
def find_transaction(user_wallet, value, comment):
		# Get the last 30 transactions
    transactions = get_address_transactions()
    for transaction in transactions:
				# Select the incoming "message" - transaction
        msg = transaction['in_msg']
        if msg['source'] == user_wallet and msg['value'] == value and msg['message'] == comment:
						# If all the data match, we check that this transaction
						# we have not verified before
            t = db.check_transaction(msg['body_hash'])
            if t == False:
								# If not, we write in the table to the verified
								# and return True
                db.add_v_transaction(
                    msg['source'], msg['body_hash'], msg['value'], msg['message'])
                print("find transaction")
                print(
                    f"transaction from: {msg['source']} \nValue: {msg['value']} \nComment: {msg['message']}")
                return True
						# If this transaction is already verified, we check the rest, we can find the right one
            else:
                pass
		# If the last 30 transactions do not contain the required one, return False
		# Here you can add code to see the next 29 transactions
		# However, within the scope of the Example, this would be redundant.
    return False
```

输入是“正确”的钱包地址、金额和评论。如果找到预期的进账交易，输出为 True；否则为 False。

## Telegram 机器人

首先，让我们为机器人创建基础。

### 导入

在这部分，我们将导入所需的库。

来自 `aiogram`，我们需要 `Bot`、`Dispatcher`、`types` 和 `executor`。

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage` 是用于临时存储信息的。

`FSMContext`, `State`, 和 `StatesGroup` 用于与状态机工作。

```python
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
```

`json` 用来处理 json 文件。`logging` 用来记录错误。

```python
import json
import logging
```

`api` 和 `db` 是我们自己的文件，稍后我们将填充内容。

```python
import db
import api
```

### 配置设置

建议您将如 `BOT_TOKEN` 和接收付款的钱包等数据存储在一个名为 `config.json` 的单独文件中，以便于使用。

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

#### 机器人令牌

`BOT_TOKEN` 是你的 Telegram 机器人令牌，来自 [@BotFather](https://t.me/BotFather)

#### 工作模式

在 `WORK_MODE` 键中，我们将定义机器人的工作模式—在测试网或主网；分别为 `testnet` 或 `mainnet`。

#### API 令牌

`*_API_TOKEN` 的 API 令牌可以在 [TON Center](https://toncenter.com/) 机器人处获取：

- 对于主网 — [@tonapibot](https://t.me/tonapibot)
- 对于测试网 — [@tontestnetapibot](https://t.me/tontestnetapibot)

#### 将配置连接到我们的机器人

接下来，我们完成机器人设置。

从 `config.json` 获取机器人工作所需的令牌：

```python
with open('config.json', 'r') as f:
    config_json = json.load(f)
    # highlight-next-line
    BOT_TOKEN = config_json['BOT_TOKEN']
		# put wallets here to receive payments
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']

if WORK_MODE == "mainnet":
    WALLET = MAINNET_WALLET
else:
		# By default, the bot will run on the testnet
    WALLET = TESTNET_WALLET
```

### 日志记录和机器人设置

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
```

### 状态

我们需要使用状态将机器人工作流程划分为阶段。我们可以将每个阶段专门用于特定任务。

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

详情和示例请参见 [Aiogram 文档](https://docs.aiogram.dev/en/latest/)。

### 消息处理器(Message handlers)

这是我们将编写机器人交互逻辑的部分。

我们将使用两种类型的处理器：

- `message_handler` 用于处理用户消息。
- `callback_query_handler` 用于处理来自内联键盘的回调。

如果我们想处理用户的消息，我们将使用 `message_handler` 并在函数上方放置 `@dp.message_handler` 装饰器。在这种情况下，当用户向机器人发送消息时，将调用该函数。

在装饰器中，我们可以指定将在何种条件下调用该函数。例如，如果我们想要在用户发送文本 `/start` 的消息时调用函数，那么我们将编写以下内容：

```
@dp.message_handler(commands=['start'])
```

处理器需要分配给一个异步函数。在这种情况下，我们将使用 `async def` 语法。`async def` 语法用于定义将异步调用的函数。

#### /start

让我们从 `/start` 命令处理器开始。

```python
@dp.message_handler(commands=['start'], state='*')
async def cmd_start(message: types.Message):
    await message.answer(f"WORKMODE: {WORK_MODE}")
    # check if user is in database. if not, add him
    isOld = db.check_user(
        message.from_user.id, message.from_user.username, message.from_user.first_name)
    # if user already in database, we can address him differently
    if isOld == False:
        await message.answer(f"You are new here, {message.from_user.first_name}!")
        await message.answer(f"to buy air send /buy")
    else:
        await message.answer(f"Welcome once again, {message.from_user.first_name}!")
        await message.answer(f"to buy more air send /buy")
    await DataInput.firstState.set()
```

在此处理器的装饰器中，我们看到 `state='*'`。这意味着无论机器人的状态如何，该处理器都将被调用。如果我们希望处理器仅在机器人处于特定状态时调用，我们将编写 `state=DataInput.firstState`。在这种情况下，处理器仅在机器人处于 `firstState` 状态时被调用。

用户发送 `/start` 命令后，机器人将使用 `db.check_user` 函数检查用户是否在数据库中。如果不是，它将添加他。此函数还将返回布尔值，我们可以使用它以不同的方式对待用户。之后，机器人将设置状态为 `firstState`。

#### /cancel

接下来是 /cancel 命令处理器。它需要返回到 `firstState` 状态。

```python
@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("Canceled")
    await message.answer("/start to restart")
    await DataInput.firstState.set()
```

#### /buy

当然还有 `/buy` 命令处理器。在这个示例中我们将出售不同类型的空气。我们将使用reply keyboard来选择air types。

```python
# /buy command handler
@dp.message_handler(commands=['buy'], state=DataInput.firstState)
async def cmd_buy(message: types.Message):
    # reply keyboard with air types
    keyboard = types.ReplyKeyboardMarkup(
        resize_keyboard=True, one_time_keyboard=True)
    keyboard.add(types.KeyboardButton('Just pure 🌫'))
    keyboard.add(types.KeyboardButton('Spring forest 🌲'))
    keyboard.add(types.KeyboardButton('Sea breeze 🌊'))
    keyboard.add(types.KeyboardButton('Fresh asphalt 🛣'))
    await message.answer(f"Choose your air: (or /cancel)", reply_markup=keyboard)
    await DataInput.secondState.set()
```

所以，当用户发送 `/buy` 命令时，机器人发送一个reply keyboard给他，上面有air type。用户选择air type后，机器人将设置状态为 `secondState`。

此处理器将仅在 `secondState` 被设置时工作，并将等待用户发送air type的消息。在这种情况下，我们需要存储用户选择的air type，因此我们将 FSMContext 作为参数传递给函数。

FSMContext 用于在机器人的内存中存储数据。我们可以在其中存储任何数据，但这个内存不是持久的，所以如果机器人重启，数据将会丢失。但它很适合存储临时数据。

```python
# handle air type
@dp.message_handler(state=DataInput.secondState)
async def air_type(message: types.Message, state: FSMContext):
    if message.text == "Just pure 🌫":
        await state.update_data(air_type="Just pure 🌫")
    elif message.text == "Fresh asphalt 🛣":
        await state.update_data(air_type="Fresh asphalt 🛣")
    elif message.text == "Spring forest 🌲":
        await state.update_data(air_type="Spring forest 🌲")
    elif message.text == "Sea breeze 🌊":
        await state.update_data(air_type="Sea breeze 🌊")
    else:
        await message.answer("Wrong air type")
        await DataInput.secondState.set()
        return
    await DataInput.WalletState.set()
    await message.answer(f"Send your wallet address")
```

使用...

```python
await state.update_data(air_type="Just pure 🌫")
```

...在 FSMContext 中存储air type之后，我们设置状态为 `WalletState` 并要求用户发送他的钱包地址。

此处理器将仅在 `WalletState` 被设置时工作，并将等待用户发送钱包地址的消息。

下一个处理器看起来可能非常复杂，但实际上并不难。首先，我们使用 `len(message.text) == 48` 检查消息是否是有效的钱包地址，因为钱包地址长 48 个字符。之后，我们使用 `api.detect_address` 函数检查地址是否有效。如你从 API 部分记得的那样，这个函数还返回 "正确" 地址，它将被存储在数据库中。

之后，我们使用 `await state.get_data()` 从 FSMContext 获取air type并将其存储在 `user_data` 变量中。

现在我们有了付款过程所需的所有数据。我们只需要生成一个付款链接并发送给用户。让我们使用inline keyboard。

在此示例中，将为付款创建三个按钮：

- 官方 TON Wallet
- Tonhub
- Tonkeeper

对于钱包的特殊按钮的优点是，如果用户尚未拥有钱包，则网站将提示他安装一个。

你可以随意使用你想要的内容。

我们还需要一个用户付款后按下的按钮，这样我们就可以检查支付是否成功。

```python
@dp.message_handler(state=DataInput.WalletState)
async def user_wallet(message: types.Message, state: FSMContext):
    if len(message.text) == 48:
        res = api.detect_address(message.text)
        if res == False:
            await message.answer("Wrong wallet address")
            await DataInput.WalletState.set()
            return
        else:
            user_data = await state.get_data()
            air_type = user_data['air_type']
            # inline button "check transaction"
            keyboard2 = types.InlineKeyboardMarkup(row_width=1)
            keyboard2.add(types.InlineKeyboardButton(
                text="Check transaction", callback_data="check"))
            keyboard1 = types.InlineKeyboardMarkup(row_width=1)
            keyboard1.add(types.InlineKeyboardButton(
                text="Ton Wallet", url=f"ton://transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonkeeper", url=f"https://app.tonkeeper.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonhub", url=f"https://tonhub.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            await message.answer(f"You choose {air_type}")
            await message.answer(f"Send <code>1</code> toncoin to address \n<code>{WALLET}</code> \nwith comment \n<code>{air_type}</code> \nfrom your wallet ({message.text})", reply_markup=keyboard1)
            await message.answer(f"Click the button after payment", reply_markup=keyboard2)
            await DataInput.PayState.set()
            await state.update_data(wallet=res)
            await state.update_data(value_nano="1000000000")
    else:
        await message.answer("Wrong wallet address")
        await DataInput.WalletState.set()
```

#### /me

我们需要的最后一个消息处理器是 `/me` 命令。它显示用户的支付信息。

```python
# /me command handler
@dp.message_handler(commands=['me'], state="*")
async def cmd_me(message: types.Message):
    await message.answer(f"Your transactions")
    # db.get_user_payments returns list of transactions for user
    transactions = db.get_user_payments(message.from_user.id)
    if transactions == False:
        await message.answer(f"You have no transactions")
    else:
        for transaction in transactions:
            # we need to remember that blockchain stores value in nanotons. 1 toncoin = 1000000000 in blockchain
            await message.answer(f"{int(transaction['value'])/1000000000} - {transaction['comment']}")
```

### 回调处理器(Callback handlers)

我们可以在按钮中设置回调数据，当用户按下按钮时，这些数据将被发送给机器人。在用户交易后按下的按钮中，我们设置回调数据为 "check"。因此，我们需要处理这个回调。

回调处理器与消息处理器非常相似，但它们有 `types.CallbackQuery` 作为参数，而不是 `message`。函数装饰器也有所不同。

```python
@dp.callback_query_handler(lambda call: call.data == "check", state=DataInput.PayState)
async def check_transaction(call: types.CallbackQuery, state: FSMContext):
    # send notification
    user_data = await state.get_data()
    source = user_data['wallet']
    value = user_data['value_nano']
    comment = user_data['air_type']
    result = api.find_transaction(source, value, comment)
    if result == False:
        await call.answer("Wait a bit, try again in 10 seconds. You can also check the status of the transaction through the explorer (tonscan.org/)", show_alert=True)
    else:
        db.v_wallet(call.from_user.id, source)
        await call.message.edit_text("Transaction is confirmed \n/start to restart")
        await state.finish()
        await DataInput.firstState.set()
```

在此处理器中，我们从 FSMContext 获取用户数据并使用 `api.find_transaction` 函数检查交易是否成功。如果成功，我们将钱包地址存储在数据库中，并向用户发送通知。此后，用户可以使用 `/me` 命令查找他的交易。

### main.py 的最后一部分

最后，别忘了：

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

这部分需要启动机器人。
在 `skip_updates=True` 中，我们指定我们不想处理旧消息。但如果您想处理所有消息，可以将其设置为 `False`。

:::info

`main.py` 的所有代码可以在[这里](https://github.com/LevZed/ton-payments-in-telegram-bot/blob/main/bot/main.py)找到。

:::

## 机器人动起来

我们终于做到了！现在你应该有一个工作中的机器人。你可以测试它！

运行机器人的步骤：

1. 填写 `config.json` 文件。
2. 运行 `main.py`。

所有文件必须在同一个文件夹中。要启动机器人，您需要运行 `main.py` 文件。您可以在 IDE 或终端中这样做：

```
python main.py
```

如果您遇到任何错误，可以在终端中检查。也许您在代码中漏掉了一些东西。

工作中的机器人示例[@AirDealerBot](https://t.me/AirDealerBot)

![bot](/img/tutorials/apiatb-bot.png)

## 参考资料

- 作为 [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8) 的一部分
- 由 Lev 制作（[Telegram @Revuza](https://t.me/revuza), [LevZed on GitHub](https://github.com/LevZed)）



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/web3-game-example.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/web3-game-example.md
================================================
# TON 区块链适用于游戏

## 教程内容

在本教程中，我们将探讨如何将 TON 区块链添加到游戏中。作为示例，我们将使用 Phaser 编写的 Flappy Bird 克隆游戏，并逐步添加 GameFi 功能。在教程中，我们将使用短代码片段和伪代码来增加可读性。同时，我们还将提供指向真实代码块的链接，以帮助您更好地理解。完整的实现可以在[演示库](https://github.com/ton-community/flappy-bird)中找到。

![没有 GameFi 功能的 Flappy Bird 游戏](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

我们将实现以下功能：

- 成就奖励。让我们用 [SBTs](https://docs.ton.org/learn/glossary#sbt) 奖励我们的用户。成就系统是增加用户参与度的绝佳工具。
- 游戏货币。在 TON 区块链上，启动自己的代币（jetton）很容易。代币可以用来创建游戏内经济。我们的用户将能够赚取游戏币并在之后消费它们。
- 游戏商店。我们将为用户提供使用游戏货币或 TON 代币购买游戏内物品的可能性。

## 准备工作

### 安装 GameFi SDK

首先，我们将设置游戏环境。为此，我们需要安装 `assets-sdk`。该包旨在准备开发者集成区块链到游戏中所需的一切。该库可以从 CLI 或 Node.js 脚本中使用。在本教程中，我们选择 CLI 方法。

```sh
npm install -g @ton-community/assets-sdk@beta
```

### 创建主钱包

接下来，我们需要创建一个主钱包。主钱包是我们将用来铸造 jetton、收藏品、NFT、SBT 和接收支付的钱包。

```sh
assets-cli setup-env
```

您将被问及几个问题：

| 字段      | 提示                                                                                                         |
| :------ | :--------------------------------------------------------------------------------------------------------- |
| 网络      | 选择 `testnet`，因为它是测试游戏。                                                                                     |
| 类型      | 选择 `highload-v2` 类型的钱包，因为它是用作主钱包的最佳、最高性能选项。                                                                |
| 存储      | 用于存储 `NFT`/`SBT` 文件的存储。可以选择 `Amazon S3`（集中式）或 `Pinata`（去中心化）。 对于本教程，让我们使用 `Pinata`，因为去中心化存储对 Web3 游戏更具说明性。 |
| IPFS 网关 | 从中加载资产元数据的服务：`pinata`、`ipfs.io` 或输入其他服务 URL。                                                               |

脚本输出您可以打开的链接，以查看创建的钱包状态。

![新钱包处于 Nonexist 状态](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

如您所见，钱包实际上还没有创建。要想钱包真正创建，我们需要往里面存一些资金。在现实世界场景中，您可以使用任何喜欢的方式通过钱包地址存入钱包。在我们的案例中，我们将使用 [Testgiver TON Bot](https://t.me/testgiver_ton_bot)。请打开它领取 5 个测试 TON 代币。

稍后您将看到钱包中有 5 个 TON，并且其状态变为 `Uninit`。钱包准备就绪。首次使用后，其状态会变为 `Active`。

![充值后的钱包状态](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### 铸造游戏货币

我们打算创建游戏货币，以奖励用户：

```sh
assets-cli deploy-jetton
```

您将被问及几个问题：

| 字段  | 提示                                                                                                                                                                            |
| :-- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 名称  | 代币名称，例如 `Flappy Jetton`。                                                                                                                                                      |
| 描述  | 代币描述，例如：来自 Flappy Bird 宇宙的生动数字代币。                                                                                                                                             |
| 图片  | 下载预备好的 [jetton 标志](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) 并指定文件路径。当然，您也可以使用任何图片。 |
| 符号  | `FLAP` 或输入您想使用的任何缩写。                                                                                                                                                          |
| 小数位 | 货币小数点后将有多少个零。在我们的案例中，让它为 `0`。                                                                                                                                                 |

脚本输出您可以打开的链接，以查看创建的 jetton 状态。它将具有 `Active` 状态。钱包状态将从 `Uninit` 变为 `Active`。

![游戏货币 / jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### 为 SBT 创建收藏品

仅作为示例，演示游戏中我们将奖励用户玩第一次和第五次游戏。因此，我们将铸造两个收藏品，以便在用户达到相关条件（第一次和第五次玩游戏）时将 SBT 放入其中：

```sh
assets-cli deploy-nft-collection
```

| 字段 | 第一次游戏                                                                                                                    | 第五次游戏                                                                                                                    |
| :- | :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| 类型 | `sbt`                                                                                                                    | `sbt`                                                                                                                    |
| 名称 | Flappy First Flight                                                                                                      | Flappy High Fiver                                                                                                        |
| 描述 | 纪念您在 Flappy Bird 游戏中的首次旅行！                                                                                               | 以 Flappy High Fiver NFT 庆祝您的持续游戏！                                                                                        |
| 图片 | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png) |

我们已经做好充分准备。接下来，让我们进入逻辑实现。

## 连接钱包

一切从用户连接其钱包开始。因此，让我们添加钱包连接集成。要从客户端操作区块链，我们需要为 Phaser 安装 GameFi SDK：

```sh
npm install --save @ton/phaser-sdk@beta
```

现在，让我们设置 GameFi SDK 并创建它的实例：

```typescript
import { GameFi } from '@ton/phaser-sdk'

const gameFi = await GameFi.create({
    network: 'testnet'
    connector: {
        // if tonconnect-manifest.json is placed in the root you can skip this option
        manifestUrl: '/assets/tonconnect-manifest.json',
        actionsConfiguration: {
            // address of your Telegram Mini App to return to after the wallet is connected
            // url you provided to BothFather during the app creation process
            // to read more please read https://github.com/ton-community/flappy-bird#telegram-bot--telegram-web-app
            twaReturnUrl: URL_YOU_ASSIGNED_TO_YOUR_APP
        },
        contentResolver: {
            // some NFT marketplaces don't support CORS, so we need to use a proxy
            // you are able to use any format of the URL, %URL% will be replaced with the actual URL
            urlProxy: `${YOUR_BACKEND_URL}/${PROXY_URL}?url=%URL%`
        },
        // where in-game purchases come to
        merchant: {
            // in-game jetton purchases (FLAP)
            // use address you got running `assets-cli deploy-jetton`
            jettonAddress: FLAP_ADDRESS,
            // in-game TON purchases
            // use master wallet address you got running `assets-cli setup-env`
            tonAddress: MASTER_WALLET_ADDRESS
        }
    },

})
```

> 要了解更多关于初始化选项，请阅读[库文档](https://github.com/ton-org/game-engines-sdk)。

> 要了解什么是 `tonconnect-manifest.json`，请查看 ton-connect [manifest描述](https://docs.ton.org/develop/dapps/ton-connect/manifest)。

现在我们准备创建一个连接钱包按钮。让我们在 Phaser 中创建一个 UI 场景，该场景将包含连接按钮：

```typescript
class UiScene extends Phaser.Scene {
    // receive gameFi instance via constructor
    private gameFi: GameFi;

    create() {
        this.button = this.gameFi.createConnectButton({
            scene: this,
            // you can calculate the position for the button in your UI scene
            x: 0,
            y: 0,
            button: {
                onError: (error) => {
                    console.error(error)
                }
                // other options, read the docs
            }
        })
    }
}
```

> 阅读如何创建[连接按钮](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82)和 [UI 场景](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45)。

要监控用户何时连接或断开其钱包，让我们使用以下代码片段：

```typescript
function onWalletChange(wallet: Wallet | null) {
    if (wallet) {
        // wallet is ready to use
    } else {
        // wallet is disconnected
    }
}
const unsubscribe = gameFi.onWalletChange(onWalletChange)
```

> 要了解更多复杂场景，请查看[钱包连接流程](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16)的完整实现。

阅读如何实现[游戏 UI 管理](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50)。

现在我们已经连接了用户钱包，可以继续进行了。

![连接钱包按钮](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![确认钱包连接](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![钱包已连接](/img/tutorials/gamefi-flappy/wallet-connected.png)

## 实现成就和奖励

为了实现成就和奖励系统，我们需要准备一个端点，每个用户尝试时都会请求该端点。

### `/played` 端点

我们需要创建一个 `/played` 端点，该端点必须完成以下操作：

- 接收带有用户钱包地址和 Mini App 启动时传递给 Mini App 的 Telegram 初始数据的正文。需要解析初始数据以提取认证数据，并确保用户只代表其自身发送请求。
- 该端点必须计算并存储用户玩的游戏数。
- 该端点必须检查是否是用户的第一次或第五次游戏，如果是，便使用相关的 SBT 奖励用户。
- 该端点必须为每次游戏奖励用户 1 FLAP。

> 阅读[/played 端点](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197)的代码。

### 请求 `/played` 端点

每次小鸟撞到管道或掉落时，客户端代码必须调用 `/played` 端点并传递正确的正文：

```typescript
async function submitPlayed(endpoint: string, walletAddress: string) {
    return await (await fetch(endpoint + '/played', {
        body: JSON.stringify({
            tg_data: (window as any).Telegram.WebApp.initData,
            wallet: walletAddress
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })).json()
}

const playedInfo = await submitPlayed('http://localhost:3001', wallet.account.address);
```

> 阅读[submitPlayer 函数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10)的代码。

让我们玩第一次，确保我们将获得 FLAP 代币和 SBT 的奖励。点击 Play 按钮，穿过一个或两个管道，然后撞到一个管道上。好的，一切都在工作！

![被奖励的代币和 SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

再次玩 4 次以获得第二个 SBT，然后打开您的钱包，TON Space。这里是您的收藏品：

![钱包中的成就 SBT](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## 实现游戏商店

要拥有游戏内商店，我们需要两个组件。第一个是提供关于用户购买的信息的端点。第二个是全局循环，以监视用户交易并为其所有者分配游戏属性。

### `/purchases` 端点

该端点执行以下操作：

- 接收带有 Telegram Mini Apps 初始数据的 `auth` get 参数。
- 该端点获取用户购买的物品并以物品列表的形式做出响应。

> 阅读[/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303)端点的代码。

### 购买循环

要知道用户何时进行支付，我们需要监视主钱包的交易记录。每笔交易都必须包含消息 `userId`：`itemId`。我们将记住最后处理的交易，只获取新的交易，使用 `userId` 和 `itemId` 为用户分配他们购买的属性，重写最后一笔交易的哈希。这将在无限循环中工作。

> 阅读[购买循环](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110)的代码。

### 客户端的商店

在客户端，我们有进入商店的按钮。

![进入商店按钮](/img/tutorials/gamefi-flappy/shop-enter-button.png)

当用户点击按钮时，将打开商店场景。商店场景包含用户可以购买的物品列表。每个物品都有价格和购买按钮。当用户点击购买按钮时，将进行购买。

打开商店会触发购买商品的加载，并每 10 秒更新一次：

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> 阅读[showShop 函数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191)的代码。

现在我们需要实现购买本身。为此，我们首先将创建 GameFi SDK 实例，然后使用 `buyWithJetton` 方法：

```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![要购买的游戏道具](/img/tutorials/gamefi-flappy/purchase-item.png)
![购买确认](/img/tutorials/gamefi-flappy/purchase-confirmation.png)
![道具准备使用](/img/tutorials/gamefi-flappy/purchase-done.png)

也可以用 TON 代币支付：

```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## 后记

本教程到此结束！我们考虑了基本的 GameFi 功能，但 SDK 提供了更多功能，如玩家之间的转账、操作 NFT 和收藏品的工具等。将来我们会提供更多功能。

要了解所有可用的 GameFi 功能，请阅读 [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) 和 [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk) 的文档。

所以，请在[讨论区](https://github.com/ton-org/game-engines-sdk/discussions)告诉我们您的想法！

完整的实现可在 [flappy-bird](https://github.com/ton-community/flappy-bird) 库中找到。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/zero-knowledge-proofs.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/zero-knowledge-proofs.md
================================================
# 在 TON 上构建一个简单的 ZK 项目

## 👋 介绍

**零知识**（ZK）证明是一种基本的密码学原语，它允许一方（证明者）向另一方（验证者）证明一个陈述是真实的，而不泄露除了该陈述本身的有效性之外的任何信息。零知识证明是构建隐私保护系统的强大工具，已在多种应用中使用，包括匿名支付、匿名消息系统和无信任桥接。

:::tip TVM 升级 2023.07
在 2023 年 6 月之前，不能在 TON 上验证加密证明。由于配对算法背后复杂计算的普遍性，有必要通过添加 TVM 操作码来增加 TVM 的功能以执行证明验证。该功能已在 [2023 年 6 月更新](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381)中添加，截至本文撰写时仅在测试网上可用。
:::

## 🦄 本教程将覆盖

1. 零知识密码学的基础知识，特别是 zk-SNARKs（零知识简洁非互动式知识论证）
2. 启动受信任设置仪式（使用 Tau 力量）
3. 编写和编译一个简单的 ZK 电路（使用 Circom 语言）
4. 生成、部署和测试一个 FunC 合约来验证样本 ZK 证明

## 🟥🟦 以颜色为重点的 ZK 证明解释

在我们深入了解零知识之前，让我们从一个简单的问题开始。假设你想向一个色盲人证明，可以区分不同颜色是可能的。我们将使用一种互动解决方案来解决这个问题。假设色盲人（验证者）找到两张相同的纸，一张为红色 🟥 一张为蓝色 🟦。

验证者向你（证明者）展示其中一张纸并要求你记住颜色。然后验证者将那张特定的纸放在背后，保持不变或更换它，并询问你颜色是否有变化。如果你能够分辨出颜色的区别，那么你可以看到颜色（或者你只是幸运地猜对了正确的颜色）。

现在，如果验证者完成这个过程 10 次，而你每次都能分辨出颜色的区别，那么验证者对正确颜色的使用有 ~99.90234% 的把握（1 - (1/2)^10）。因此，如果验证者完成这个过程 30 次，那么验证者将有 99.99999990686774% 的把握（1 - (1/2)^30）。

尽管如此，这是一个互动式解决方案，让 DApp 要求用户发送 30 笔交易来证明特定数据是不高效的。因此，需要一个非互动式解决方案；这就是 Zk-SNARKs 和 Zk-STARKs 的用武之地。

出于本教程的目的，我们只会涵盖 Zk-SNARKs。然而，你可以在 [StarkWare 网站](https://starkware.co/stark/) 上阅读更多关于 Zk-STARKs 如何工作的信息，而关于 Zk-SNARKs 和 Zk-STARKs 之间差异的信息可以在这篇 [Panther Protocol 博客文章](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/) 上找到。

### 🎯 Zk-SNARK: 零知识简洁非互动式知识论证

Zk-SNARK 是一个非互动式证明系统，其中证明者可以向验证者展示一个证明，以证明一个陈述是真实的。同时，验证者能够在非常短的时间内验证证明。通常，处理 Zk-SNARK 包括三个主要阶段：

- 使用 [多方计算（MPC）](https://en.wikipedia.org/wiki/Secure_multi-party_computation) 协议进行受信任设置，以生成证明和验证密钥（使用 Tau 力量）
- 使用证明者密钥、公开输入和私密输入（见证）生成证明
- 验证证明

让我们设置我们的开发环境并开始编码！

## ⚙ 开发环境设置

我们开始这个过程的步骤如下：

1. 使用 [Blueprint](https://github.com/ton-org/blueprint) 创建一个名为 "simple-zk" 的新项目，执行以下命令后，输入你的合约名称（例如 ZkSimple），然后选择第一个选项（使用一个空合约）。

```bash
npm create ton@latest simple-zk
```

2. 接下来我们会克隆被调整以支持 FunC 合约的 [snarkjs 库](https://github.com/kroist/snarkjs)

```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. 然后我们将安装 ZkSNARKs 所需的库

```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```

4. 接下来我们将下面的部分添加到 package.json 中（请注意，我们将使用的一些操作码在主网版本中尚未可用）

```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. 另外，我们需要更改 @ton-community/sandbox 的版本，以便使用[最新的 TVM 更新](https://t.me/thetontech/56)

```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```

太好了！现在我们准备好开始在 TON 上编写我们的第一个 ZK 项目了！

我们当前有两个主要文件夹构成了我们的 ZK 项目：

- `simple-zk` 文件夹：包含我们的 Blueprint 模板，这将使我们能够编写我们的电路和合约以及测试
- `snarkjs` 文件夹：包含我们在第 2 步中克隆的 snarkjs 库

## Circom 电路

首先让我们创建一个文件夹 `simple-zk/circuits` 并在其中创建一个文件并添加以下代码：

```circom
template Multiplier() {
   signal private input a;
   signal private input b;
   //private input means that this input is not public and will not be revealed in the proof

   signal output c;

   c <== a*b;
 }

component main = Multiplier();
```

上面我们添加了一个简单的乘法器电路。通过使用这个电路，我们可以证明我们知道两个数字相乘的结果是特定的数字（c）而不泄露这些对应的数字（a 和 b）本身。

要了解更多关于 circom 语言的信息，请考虑查看[这个网站](https://docs.circom.io/)。

接下来我们将创建一个文件夹来存放我们的构建文件，并通过执行以下操作将数据移动到那里（在 `simple-zk` 文件夹中）：

```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 使用 Powers of TAU 创建受信任设置

现在是时候进行受信任设置了。要完成这个过程，我们将使用 [Powers of Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) 方法（可能需要几分钟时间来完成）。让我们开始吧：

```bash
echo 'prepare phase1'
node ../../../snarkjs/build/cli.cjs powersoftau new bls12-381 14 pot14_0000.ptau -v
echo 'contribute phase1 first'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="some random text"
echo 'contribute phase1 second'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0001.ptau pot14_0002.ptau --name="Second contribution" -v -e="some random text"
echo 'apply a random beacon'
node ../../../snarkjs/build/cli.cjs powersoftau beacon pot14_0002.ptau pot14_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
echo 'prepare phase2'
node ../../../snarkjs/build/cli.cjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v
echo 'Verify the final ptau'
node ../../../snarkjs/build/cli.cjs powersoftau verify pot14_final.ptau
```

完成上述过程后，它将在 build/circuits 文件夹中创建 pot14_final.ptau 文件，该文件可用于编写未来相关电路。

:::caution 约束大小
如果编写了具有更多约束的更复杂电路，则需要使用更大参数生成您的 PTAU 设置。
:::

你可以删除不必要的文件：

```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```

### 📜 电路编译

现在让我们通过在 `build/circuits` 文件夹下运行以下命令来编译电路：

```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

现在我们的电路被编译到了 `build/circuits/circuit.sym`、`build/circuits/circuit.r1cs` 和 `build/circuits/circuit.wasm` 文件中。

:::info altbn-128 和 bls12-381 曲线
altbn-128 和 bls12-381 椭圆曲线目前被 snarkjs 支持。[altbn-128](https://eips.ethereum.org/EIPS/eip-197) 曲线仅在 Ethereum 上支持。然而，在 TON 上只支持 bls12-381 曲线。
:::

让我们通过输入以下命令来检查我们电路的约束大小：

```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

因此，正确的结果应该是：

```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

现在我们可以通过执行以下操作来生成参考 zkey：

```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

然后我们将以下贡献添加到 zkey 中：

```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

接下来，让我们导出最终的 zkey：

```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

现在我们的最终 zkey 存在于 `build/circuits/circuit_final.zkey` 文件中。然后通过输入以下内容来验证 zkey：

```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

最后，是时候生成验证密钥了：

```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

然后我们将删除不必要的文件：

```bash
rm circuit_0000.zkey circuit_0001.zkey
```

在完成上述过程后，`build/circuits` 文件夹应如下显示：

```
build
└── circuits
        ├── circuit_final.zkey
        ├── circuit.r1cs
        ├── circuit.sym
        ├── circuit.wasm
        ├── pot14_final.ptau
        └── verification_key.json

```

### ✅ 导出验证器合约

本节的最后一步是生成 FunC 验证器合约，我们将在我们的 ZK 项目中使用它。

```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
```

然后在 `contracts` 文件夹中生成了 `verifier.fc` 文件。

## 🚢 验证器合约部署

让我们逐步回顾 `contracts/verifier.fc` 文件，因为它包含了 ZK-SNARKs 的魔法：

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

以上是验证器合约必须使用的常量，以实现证明验证。这些参数可以在 `build/circuits/verification_key.json` 文件中找到。

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```

以上行是新的 [TVM 操作码](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#bls12-381)（BLS12-381），使得可以在 TON 区块链上进行配对检查。

load_data 和 save_data 函数仅用于加载和保存证明验证结果（仅用于测试目的）。

```func
() load_data() impure {

    var ds = get_data().begin_parse();

    ctx_res = ds~load_uint(32);

    ds.end_parse();
}

() save_data() impure {
    set_data(
            begin_cell()
                    .store_uint(ctx_res, 32)
                    .end_cell()
    );
}
```

接下来，有几个简单的实用函数，用于加载发送到合约的证明数据：

```func
(slice, slice) load_p1(slice body) impure {
    ...
}

(slice, slice) load_p2(slice body) impure {
    ...
}

(slice, int) load_newint(slice body) impure {
    ...
}
```

最后一部分是 groth16Verify 函数，该函数需要检查发送到合约的证明的有效性。

```func
() groth16Verify(
        slice pi_a,
        slice pi_b,
        slice pi_c,

        int pubInput0

) impure {

    slice cpub = bls_g1_multiexp(

            IC1, pubInput0,

            1
    );


    cpub = bls_g1_add(cpub, IC0);
    slice pi_a_neg = bls_g1_neg(pi_a);
    int a = bls_pairing(
            cpub, vk_gamma_2,
            pi_a_neg, pi_b,
            pi_c, vk_delta_2,
            vk_alpha_1, vk_beta_2,
            4);
    ;; ctx_res = a;
    if (a == 0) {
        ctx_res = 0;
    } else {
        ctx_res = 1;
    }
    save_data();
}
```

现在需要编辑 `wrappers` 文件夹中的两个文件。需要注意的第一个文件是 `ZkSimple.compile.ts` 文件（如果在第 1 步中为合约设置了其他名称，其名称将不同）。我们将 `verifier.fc` 文件放入必须编译的合约列表中。

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

需要注意的另一个文件是 `ZkSimple.ts`。我们首先需要将 `verify` 操作码添加到 `Opcodes` 枚举中：

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

接下来，需要向 `ZkSimple` 类中添加 `sendVerify` 函数。此函数用于将证明发送到合约并进行测试，如下所示：

```ts
async sendVerify(
  provider: ContractProvider,
  via: Sender,
  opts: {
  pi_a: Buffer;
  pi_b: Buffer;
  pi_c: Buffer;
  pubInputs: bigint[];
  value: bigint;
  queryID?: number;
}
) {
  await provider.internal(via, {
    value: opts.value,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    body: beginCell()
      .storeUint(Opcodes.verify, 32)
      .storeUint(opts.queryID ?? 0, 64)
      .storeRef(
        beginCell()
          .storeBuffer(opts.pi_a)
          .storeRef(
            beginCell()
              .storeBuffer(opts.pi_b)
              .storeRef(
                beginCell()
                  .storeBuffer(opts.pi_c)
                  .storeRef(
                    this.cellFromInputList(opts.pubInputs)
                  )
              )
          )
      )
      .endCell(),
  });
}
```

接下来，我们将 `cellFromInputList` 函数添加到 `ZkSimple` 类中。此函数用于从公开输入创建一个cell，它将被发送到合约。

```ts
 cellFromInputList(list: bigint[]) : Cell {
  var builder = beginCell();
  builder.storeUint(list[0], 256);
  if (list.length > 1) {
    builder.storeRef(
      this.cellFromInputList(list.slice(1))
    );
  }
  return builder.endCell()
}
```

最后，我们将添加到 `ZkSimple` 类中的最后一个函数是 `getRes` 函数。此函数用于接收证明验证结果。

```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

现在我们可以运行所需的测试来部署合约。为了实现这一点，合约应该能够成功通过部署测试。在 `simple-zk` 文件夹的根目录下运行此命令：

```bash
npx blueprint test
```

## 🧑‍💻 编写验证器的测试

让我们打开 `tests` 文件夹中的 `ZkSimple.spec.ts` 文件，并为 `verify` 函数编写一个测试。测试按如下方式进行：

```ts
describe('ZkSimple', () => {
  let code: Cell;

  beforeAll(async () => {
    code = await compile('ZkSimple');
  });

  let blockchain: Blockchain;
  let zkSimple: SandboxContract<ZkSimple>;

  beforeEach(async () => {
    // deploy contract
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and zkSimple are ready to use
  });

  it('should verify', async () => {
    // todo write the test
  });
});
```

首先，我们需要导入我们将在测试中使用的几个包：

````ts
import * as snarkjs from "snarkjs";
import path from "path";
import {buildBls12381, utils} from "ffjavascript";
const {unstringifyBigInts} = utils;

* If you run the test, the result will be a TypeScript error, because we don't have a declaration file for the module 'snarkjs' & ffjavascript. This can be addressed by editing the `tsconfig.json` file in the root of the `simple-zk` folder. We'll need to change the _**strict**_ option to **_false_** in that file
* 
We'll also need to import the `circuit.wasm` and `circuit_final.zkey` files which will be used to generate the proof to send to the contract. 
```ts
const wasmPath = path.join(__dirname, "../build/circuits", "circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits", "circuit_final.zkey");
````

让我们填写 `should verify` 测试。我们首先需要生成证明。

```ts
it('should verify', async () => {
  // proof generation
  let input = {
    "a": "123",
    "b": "456",
  }
  let {proof, publicSignals} = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
  let curve = await buildBls12381();
  let proofProc = unstringifyBigInts(proof);
  var pi_aS = g1Compressed(curve, proofProc.pi_a);
  var pi_bS = g2Compressed(curve, proofProc.pi_b);
  var pi_cS = g1Compressed(curve, proofProc.pi_c);
  var pi_a = Buffer.from(pi_aS, "hex");
  var pi_b = Buffer.from(pi_bS, "hex");
  var pi_c = Buffer.from(pi_cS, "hex");
  
  // todo send the proof to the contract
});
```

为了进行下一个步骤，需要定义 `g1Compressed`、`g2Compressed` 和 `toHexString` 函数。它们将用于将密码学证明转换为合约期望的格式。

```ts
function g1Compressed(curve, p1Raw) {
  let p1 = curve.G1.fromObject(p1Raw);

  let buff = new Uint8Array(48);
  curve.G1.toRprCompressed(buff, 0, p1);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function g2Compressed(curve, p2Raw) {
  let p2 = curve.G2.fromObject(p2Raw);

  let buff = new Uint8Array(96);
  curve.G2.toRprCompressed(buff, 0, p2);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte: any) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join("");
}
```

现在我们可以将密码学证明发送到合约。我们将使用 sendVerify 函数来完成这个操作。`sendVerify` 函数需要 5 个参数：`pi_a`、`pi_b`、`pi_c`、`pubInputs` 和 `value`。

```ts
it('should verify', async () => {
  // proof generation
  
  
  // send the proof to the contract
  const verifier = await blockchain.treasury('verifier');
  const verifyResult = await zkSimple.sendVerify(verifier.getSender(), {
    pi_a: pi_a,
    pi_b: pi_b,
    pi_c: pi_c,
    pubInputs: publicSignals,
    value: toNano('0.15'), // 0.15 TON for fee
  });
  expect(verifyResult.transactions).toHaveTransaction({
    from: verifier.address,
    to: zkSimple.address,
    success: true,
  });

  const res = await zkSimple.getRes();

  expect(res).not.toEqual(0); // check proof result

  return;
  
});
```

准备好在 TON 区块链上验证您的第一个证明了吗？开始此过程，请输入以下命令运行 Blueprint 测试：

```bash
npx blueprint test
```

结果应如下所示：

```bash
 PASS  tests/ZkSimple.spec.ts
  ZkSimple
    ✓ should deploy (857 ms)
    ✓ should verify (1613 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.335 s, estimated 5 s
Ran all test suites.
```

要查看包含本教程代码的库，请点击[此处](https://github.com/SaberDoTcodeR/zk-ton-doc)找到的链接。

## 🏁 结论

在本教程中，您学习了以下技能：

- 零知识的复杂性，特别是 ZK-SNARKs
- 编写和编译 Circom 电路
- 对多方计算和 Tau 力量的熟悉度增加，这些被用于为电路生成验证密钥
- 熟悉了Snarkjs 库用于导出电路 FunC 验证器
- 熟悉了Blueprint用于验证器部署和测试编写

注意：上述示例教我们如何构建一个简单的 ZK 用例。尽管如此，可以在各种行业中实现一系列高度复杂的以 ZK 为中心的用例。这些包括：

- 隐私投票系统 🗳
- 隐私彩票系统 🎰
- 隐私拍卖系统 🤝
- 隐私交易💸（对于 Toncoin 或 Jettons）

如果您有任何问题或发现错误 - 请随时写信给作者 - [@saber_coder](https://t.me/saber_coder)

## 📌 参考资料

- 隐私投票系统 🗳
- 隐私彩票系统 🎰
- 隐私拍卖系统 🤝
- 隐私交易💸（对于 Toncoin 或 Jettons）
- [Blueprint](https://github.com/ton-org/blueprint)

## 📖 参阅

- [TON 无信任桥接 EVM 合约](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel Network：TON 上的隐私协议](http://github.com/saberdotcoder/tonnel-network)
- [TVM 挑战](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)

## 📬 关于作者

- Saber的链接: [Telegram](https://t.me/saber_coder), [Github](https://github.com/saberdotcoder) 和 [LinkedIn](https://www.linkedin.com/in/szafarpoor/)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/get-started-with-ton.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/get-started-with-ton.mdx
================================================
import ThemedImage from '@theme/ThemedImage';
import ConceptImage from '@site/src/components/conceptImage'
import Player from '@site/src/components/player'

# 开始使用 TON

从零开始在 TON 区块链上建立您的第一个应用程序，了解其速度、可靠性和异步思维的基本概念。

:::tip 新手友好指南
如果您是编程新手，本指南将是您的最佳选择。
:::

本学习路径包含 **5 个模块**，大约需要 **45 分钟**。

## 🛳 你将学到什么

在本教程中，您将学习如何使用 JavaScript 轻松进行区块链交易。虽然不通过本教程也能学会，但这种方法既方便又友好。

1. 您将使用 Tonkeeper 制作自己的 TON 钱包
2. 您将使用 Testnet faucet为钱包充值，以便进行测试。
3. 您将了解 TON 智能合约的基本概念 (Addresses, Cells)
4. 您将学习如何使用 TypeScript SDK 和 API 提供商与 TON 交互
5. 您将使用 NFT Miner 控制台应用程序编译第一笔交易

_你要去开采一个 NFT 火箭成就！！_

作为 TON 的第一批矿工，你们将通过工作证明智能合约，最终为你们的 TON 钱包挖出秘密奖励。看看吧

<div style={{width: '100%', maxWidth:'250pt',  textAlign: 'center', margin: '0 auto' }}>
  <video width={'300'} style={{width: '100%', maxWidth:'250pt',  borderRadius: '10pt', margin: '15pt auto' }} muted={true} autoPlay={true} loop={true}>
    <source src="/files/onboarding-nft.mp4" type="video/mp4" />
Your browser does not support the video tag.
  </video>
</div>

我们今天的目标是挖掘一个 NFT！这个成就将与您 _永远_ 同在。

最后，即使在主网中，您也能挖掘到这一 NFT 成就。(_成本仅为 0.05  TON ！_）。

### 在 TON 区块链上挖矿

今天，我们将教我们的潜在建设者如何在 TON 区块链上挖矿。这次体验将让大家了解挖矿的意义，以及为什么比特币挖矿有助于彻底改变这个行业。

PoW Giver 智能合约框架定义了最初的挖矿流程，为 TON 奠定了基础，虽然该框架在发布时已经完成，但最后一个 TON 于 2022 年 6 月挖出，结束了 TON 的工作证明（PoW）代币分配机制。尽管如此，随着我们最近过渡到权益证明（PoS），TON 的权益证明时代才刚刚开始。 

- [深入了解我们的经济模型和 TON 矿开采](https://ton.org/mining)

现在，让我们专注于成为**TON 开发者**的第一步，学习如何在 TON 上挖掘 NFT！以下是我们的目标示例。

<div style={{ width: '100%', textAlign: 'center', margin: '0 auto' }}>
  <video style={{ width: '100%', borderRadius: '10pt', margin: '15pt auto', maxWidth: '90%' }} muted={true} autoPlay={true}
         loop={true}>
    <source src="/files/onboarding.mp4" type="video/mp4" />

您的浏览器不支持视频标记。

</video>
</div>

如果我们专注于手头的工作，大约半小时就能创建一个矿工。

## 🦄 入门

要开始工作，所有开发人员都将使用以下组件：

- **钱包**：在 Testnet 模式下，您需要一个非托管钱包来存储 NFT。
- **仓库**：我们将使用专门为您设计的现成模板。
- **开发环境**：  开发人员需要确定是使用本地环境还是云环境进行挖矿。

### 下载并创建钱包

首先，您需要一个可以接收和存储 TON 的非托管钱包。在本指南中，我们使用 Tonkeeper。您需要在钱包中启用Testnet模式，以便接收Testnet通证。这些代币稍后将用于向智能合约发送最后的铸币交易。

:::info
对于非托管钱包，用户自己拥有钱包和私钥。
:::

要下载和创建 TON 钱包，请按以下简单步骤操作：

1. 在智能手机上安装 Tonkeeper 应用程序。可在 [此处](https://Tonkeeper.com/) 下载。
2. 接下来，您需要在 Tonkeeper 中 [启用测试模式](/v3/concepts/dive-into-ton/tonecosystem/wallet-apps#tonkeeper-test-environment)。

简单！现在我们开始开发。

### 项目设置

为了简化您的工作，跳过日常的低级任务，我们将使用一个模板。

:::tip
请注意，您需要 [登录](https://github.com/login) 到 GitHub 才能继续工作。
:::

请使用 [ton-on-boarding-challenge](https://github.com/ton-community/ton-onboarding-challenge) 模板创建您的项目，方法是点击 “Use this template” 按钮，然后选择 “Create a new repository” 选项卡，如下图所示：

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/1.png?raw=true',
        dark: '/img/tutorials/onboarding/1-dark.png?raw=true',
    }}
/>
<br></br>

完成此步骤后，您将获得一个高性能的仓库，作为您的矿工核心。祝贺您！✨

### 开发环境

下一步是选择最适合您的需求、经验水平和整体技能的开发人员环境。正如您所看到的，使用云环境或本地环境都可以完成这一过程。云开发通常被认为更简单、更容易上手。下面，我们将概述这两种方法所需的步骤。

:::tip
确保已在 GitHub 配置文件中打开了上一步中根据模板生成的仓库。
:::

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/3.png?raw=true',
        dark: '/img/tutorials/onboarding/3-dark.png?raw=true',
    }}
/>
<br></br>

#### 本地和云开发环境

- 对于不熟悉 JavaScript 的用户来说，使用 JavaScript 集成开发环境可能具有挑战性，特别是如果您的计算机和工具系统不是为此目的而配置的。

- 不过，如果你熟悉 NodeJS 和 Git，知道如何使用 `npm`，你可能会发现使用 **本地环境** 会更方便。

#### 云代码空间

如果选择云开发环境，首先选择 _Code_ 选项卡，然后点击 GitHub 仓库中的 _Create codespace on master_ 按钮，就可以轻松开始了，如下图所示：

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/2.png?raw=true',
        dark: '/img/tutorials/onboarding/2-dark.png?raw=true',
    }}
/>
<br></br>

完成这一步后，GitHub 将创建一个特殊的云工作区，允许你访问 VSCode Online IDE（Visual Studio Code 在线集成开发环境）。

一旦访问权限被授予（代码空间通常在 30 秒内启动），您就拥有了开始工作所需的一切，而无需安装 Git、Node.js 或其他开发工具。

#### 本地开发环境

要建立本地开发环境，您需要访问这三个基本工具：

- **Git**：Git 是每个开发人员处理软件源时必不可少的工具。可在 [此处](https://git-scm.com/downloads) 下载。
- **NodeJS**：Node.js 是 JavaScript 和 TypeScript 运行时环境，通常用于在 TON 上进行应用程序开发。可在 [此处](https://nodejs.org/en/download/) 下载。
- **JavaScript集成开发环境**。JavaScript IDE 通常用于在本地开发环境中进行开发。Visual Studio Code（[VSCode](https://code.visualstudio.com/download)）就是一个例子。

要开始使用，您需要克隆 GitHub 仓库模板，并在集成开发环境 (IDE) 中打开正确的仓库。

#### 运行脚本

在本指南中，您需要运行 TypeScript 脚本。运行脚本或安装模块等所有命令都通过命令行执行，命令行位于集成开发环境的终端工作区中。该工作区通常位于集成开发环境的底部。

例如，在云代码空间中，应打开终端工作区（如果尚未打开）：

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/6.png?raw=true',
        dark: '/img/tutorials/onboarding/6-dark.png?raw=true',
    }}
/>
<br></br><br></br>

在该窗口中输入命令，并用 _Enter_ 键执行：

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/4.png?raw=true',
        dark: '/img/tutorials/onboarding/4-dark.png?raw=true',
    }}
/>
<br></br><br></br>

终端也可作为单独的应用程序使用。请根据您的集成开发环境和操作系统选择合适的版本。

太好了！完成这些步骤后，您就可以深入了解 TON 区块链的秘密了。👀

## 🎯 连接到 TON

好了，连接 TON 区块链需要什么？

- **智能合约地址** 作为目的地。我们的目标是从 **工作防伪智能合约** 中挖掘一个 NFT，因此我们需要一个地址来获取当前的挖矿复杂度。
- **API provider** 向 TON 区块链提出请求。TON 有多种 [API 类型](/v3/guidelines/dapps/apis-sdks/api-types)，用于不同目的。我们将使用 [toncenter.com](https://toncenter.com/) API 的 testnet 版本。
- **JavaScript SDK**：需要使用 JavaScript SDK（请注意，SDK 是软件开发工具包）来解析正在使用的智能合约地址，并为创建 API 请求做好准备。为了更好地理解 TON 地址以及为什么需要对其进行解析以执行此过程，请参阅此 [资源](/v3/documentation/smart-contracts/addresses)，以了解我们为什么要对其进行解析。为了执行此过程，我们将使用 [`@ton/ton`](https://github.com/ton-org/ton)。

下一节我们将介绍用户如何使用 TONCenter API 和`@ton/ton`向TON区块链发送初始请求，以便从PoW智能合约接收数据。

### 智能合约地址

为了让矿工正常工作，我们需要添加两种不同的智能合约地址类型。其中包括

1. **钱包地址**：需要一个钱包地址，因为这是矿工获得挖矿奖励的必要条件（在这种情况下，我们必须使用 [Tonkeeper Testnet 模式](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment)）。
2. **收集地址**：需要一个收集地址作为智能合约，以正确挖掘 NFT（要执行此过程，请从 [Getgems 网站](https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX) 复制 TON onboarding challenge collection name 下的 NFT 收集地址）。

接下来，我们将打开矿工程序中的 `./scripts/mine.ts` 文件，并创建一个由初始常量组成的 `mine()` 函数，如下所示：

```ts title="./scripts/mine.ts"
import {Address} from '@ton/ton';

const walletAddress = Address.parse('YOUR_WALLET_ADDRESS');
const collectionAddress = Address.parse('COLLECTION_ADDRESS');

async function mine () {


}

mine();
```

#### 使用异步 mine() 函数

在创建 TON NFT 矿工的后期过程中，将向公共应用程序接口执行若干请求，以中继响应正确的代码串，换取所需的指令。通过利用 async/await 函数，代码的简洁性得到了显著提高。

#### 地址解析

在 TON 上，智能合约地址有不同的形式，可以使用多种标志类型。在这里，我们将使用_用户友好地址形式。也就是说，如果您想了解更多关于不同智能合约地址类型的信息，请随时查看我们文档中的附加 [资源](/v3/documentation/smart-contracts/addresses)。

为了让矿工正常工作，我们需要添加两种不同的智能合约地址类型。其中包括

位于 `@ton/ton` SDK 中的 `Address.parse()` 方法允许开发人员创建地址对象，以简化方式将地址从一种形式转换为另一种形式。

### 连接到 API 提供商

在这一步中，我们将使用脚本中的特定命令，通过 TONCenter（托管在 toncenter.com）API 提供商连接 TON。

最简单的方法是直接指定 testnet 端点 `https://testnet.toncenter.com/api/v2/jsonRPC`。

<br></br>

<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/5.png?raw=true',
        dark: '/img/tutorials/onboarding/5-dark.png?raw=true',
    }}
/>

<br></br>

我们正在通过 _TonClient_ 在 `./scripts/mine.ts` 脚本中添加 `client` 和 `endpoint`，并使用测试网 Toncenter 端点 `https://testnet.toncenter.com/api/v2/jsonRPC`：

```ts title="./scripts/mine.ts"
import {Address, TonClient} from "@ton/ton"

// ... previous code

// specify endpoint for Testnet
const endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC"

// initialize ton library
const client = new TonClient({ endpoint });
```

:::info 在生产中该做些什么？
最好使用 RPC 节点提供程序，或运行自己的 ton-http-api 实例。更多信息请访问 [TonCenter API 页面](/v3/guidelines/dapps/apis-sdks/ton-http-apis)。
:::

### 从 TON 区块链接收采矿数据

最后，该流程的下一步是从 TON 区块链中检索特定的采矿数据。

通过查阅完成 TON 上机挑战所需的[README 文件](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive)，运行 `get_mining_data` 方法可获得最新的 TON 挖掘数据。启动后，结果如下：

因此，我们应该收到一个包含这些字段的数组：

```bash
(
	int pow_complexity,
	int last_success,
	int seed,
	int target_delta,
	int min_cpl,
	int max_cpl
)
```

#### 在 TON 上运行智能合约获取方法

使用 `@ton/ton` 可以运行 `client.runMethod(SMART_CONTRACT_ADDRESS, METHOD)` 函数。
运行这段代码将导致以下控制台输出：

```ts title="./scripts/mine.ts"
// ... previous code

const miningData = await client.runMethod(collectionAddress, 'get_mining_data');

console.log(miningData.stack);
```

此外，要运行脚本，必须[在终端](/v3/guidelines/get-started-with-ton#running-scripts)输入以下命令：

```bash
npm run start:script
```

:::tip
为避免意外问题，请确保您已完成之前的所有步骤，包括输入合约地址。
:::

很好！只要正确执行了上述过程，就能成功连接到 API 并在控制台中显示必要的数据。正确的控制台输出应该如下所示：

```bash
TupleReader {
  items: [
    {
      type: 'int',
      value: 7237005577332262213973186563042994240829374041602535252466099000494570602496n
    },
    { type: 'int', value: 1730818693n },
    { type: 'int', value: 281644526620911853868912633959724884177n },
    { type: 'int', value: 30n },
    { type: 'int', value: 171n },
    { type: 'int', value: 252n }
  ]
}

```

上面的输出显示了与进程执行相关的数据，以及一系列数值（_int_）。目前的重点是将这种数值输出转换成更实用的格式。

我们需要将十六进制输出转换成有用的信息。

:::info  TON  gas 参数

1. 要更好地了解 TON 虚拟机（TVM）的运行方式以及 TON 如何处理事务，请查阅 [TVM 概述部分](/v3/documentation/tvm/tvm-overview)。
2. 其次，如果您有兴趣了解更多有关 TON 交易费和 gas 费如何运作的信息，请考虑阅读我们文档中的[本节](/v3/documentation/smart-contracts/transaction-fees/fees)。
3. 最后，要更好地了解执行 TVM 指令所需的确切 gas 值，请参阅我们文档中的 [本节](/v3/documentation/tvm/instructions#gas-prices)。
   :::

现在，让我们回到教程上来！

#### 用户友好格式的数字采矿数据

上文讨论了接收采矿数据所需的数值（_int_）。在进一步处理接收到的数据之前，必须将其转换为更易于理解和使用的格式。

通过查看给定的输出结果可以清楚地看到，数字的大小可能相当可观。为了处理它们，我们将使用 `bigint`（JavaScript 中的大数实现）。`BigInt` 用于处理大于最大 `number` 整数值的大数字。让我们通过这个示例更好地了解这一过程所需的 _挖掘数据_ ：

```ts title="./scripts/mine.ts"
// ... previous code

const { stack } = miningData;

const complexity = stack.readBigNumber();
const lastSuccess = stack.readBigNumber();
const seed = stack.readBigNumber();
const targetDelta = stack.readBigNumber();
const minCpl = stack.readBigNumber();
const maxCpl = stack.readBigNumber();

console.log({ complexity, lastSuccess, seed, targetDelta, minCpl, maxCpl });
```

如上所示，_miningData_ 的不同组件使用基于堆栈的数字来表示不同的参数（将在下文介绍）。为了实现所需的数值结果，我们使用了 `stack.readBigNumber()` 函数从堆栈中读取一个 `bigint`。

完成此过程后，我们可以将数值打印到控制台。尝试再次运行命令来运行脚本：

```bash
npm run start:script
```

下面是一个输出示例：

```bash
{
  complexity: 7237005577332262213973186563042994240829374041602535252466099000494570602496n,
  lastSuccess: 1730818693n,
  seed: 281644526620911853868912633959724884177n,
  targetDelta: 30n,
  minCpl: 171n,
  maxCpl: 252n
}
```

让我们来了解一下采矿数据命令，在将采矿数据编程到 TON 区块链时，该命令用于转换不同的数据参数。这些参数包括

- `complexity` 对于矿工来说是最重要的数字。这代表值的工作量证明复杂性。如果最终哈希小于复杂性，那么你就成功了。
- `lastSuccess` 是一个 [Unix 时间戳](https://www.unixtimestamp.com/) 的日期和时间表示，用于跟踪 TON 上最后一次挖矿交易。每当 `last_success` 指标更改时，需要再次运行挖矿程序，因为在此过程中 `seed` 也会更改。
- `seed` 表示由智能合约生成的唯一值，用于计算所需的哈希值。要更好地理解这个过程以及seed如何更改以及为什么更改的原因，请使用ctx_seed关键字（Ctrl+F，带关键字“ctx_seed”）查看项目文件夹。
- `targetDelta`、`minCpl` 和 `maxCpl` 在我们的教程中不会被使用。但是你可以在项目集合的源文件中阅读更多关于它们如何在智能合约中用于计算工作量证明复杂性的信息。

现在，我们理解了上述不同的参数，我们将在下一章中使用这些值（`complexity`、`lastSuccess `、`seed`）在我们的 NFT 挖矿中。

## 🛠 准备一个 NFT Miner

嘿，你干得不错！

在连接到TON并从区块链检索创建NFT Miner所需的必要挖矿数据后，让我们专注于实现我们目标的下一步。

在本章中，您将 _准备一个挖矿消息_ 并 _计算消息的哈希_。之后，您将 _寻找一个小于(`<`)智能合约给出的复杂度_ 的哈希。

这就是Miner所做的！简单，不是吗？

### 准备挖矿消息

首先，我们必须通过确保正确的参数来准备一个挖矿消息，以确保此过程的有效性和数据完整性。

幸运的是，[README文件](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive)允许我们检索给出正确指导来实现此目标。正如您所看到的，上面的README文件包括一个表格，其中包含某些字段和cell类型（标题为“Layout of Proof of Work Cell”），来帮助实现我们期望的结果。

:::info 什么是 cell ？
cell是TON上的数据存储结构，用于多种目的，包括提高网络可扩展性和智能合约交易速度。我们不会在这里详细讨论，但如果您对cell的复杂性及其工作方式感兴趣，可以考虑深入了解[我们文档的这一部分](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage)。
:::

幸运的是，本教程中使用的所有数据结构已经用TypeScript编写。请使用 _NftGiver.data.ts_ 中的 `MineMessageParams` 对象来构建一个 _Queries_ 交易：

```ts title="./scripts/mine.ts"
import { unixNow } from '../lib/utils';
import { MineMessageParams, Queries } from '../wrappers/NftGiver';

// ... previous code

const mineParams: MineMessageParams = {
    expire: unixNow() + 300, // 5 min is enough to make a transaction
    mintTo: walletAddress, // your wallet
    data1: 0n, // temp variable to increment in the miner
    seed // unique seed from get_mining_data
};

let msg = Queries.mine(mineParams); // transaction builder
```

可能您会有疑问：[表格](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive)中的 _op_ 和 _data2_ 在哪里？

- 在表中，data1的数值必须等于data2的数值。为了省略填写data2值，交易构建器执行了一个低级别过程（参见Queries.mine()源代码）。
- 由于 `op` 分类始终是常量，它已经在交易构建器 _Queries_ 和 _OpCodes_ 中实现。您可以通过查看 `mine()` 方法的源代码来找到op代码。

:::tip
虽然查看源代码 (`../wrappers/NftGiver.ts`) 可能很有趣，但不是必须的。
:::

### 创建 TON NFT Miners

现在我们已经完成了为我们的TON Miner准备消息的过程，让我们开始实际创建Miner的初始过程。首先，让我们考虑这行代码：

```ts
let msg = Queries.mine(mineParams);
```

上面我们编译了一个 `msg` 值。挖矿的想法是找到一个哈希 `msg.hash()`，它将小于最后接收到的 _get_mining_data()_ 中的 `complexity`。我们可以根据需要多次递增 `data1`。

Miner可能将无限期地运行，只要 `msg.hash()` 大于 `complexity`（消息哈希大于工作证明挖矿复杂度）。

这是一个与TypeScript中的 `BigInt` 相关的代码运行示例：

```ts title="./scripts/mine.ts"
let msg = Queries.mine(mineParams);

const bufferToBigint = (buffer: Buffer) => BigInt('0x' + buffer.toString('hex'));

while (bufferToBigint(msg.hash()) > complexity) {
    mineParams.expire = unixNow() + 300;
    mineParams.data1 += 1n;
    msg = Queries.mine(mineParams);
}

console.log('Yoo-hoo, you found something!');
```

我们使用 `bufferToBigint()` 函数将 `msg.hash()` 中的哈希值转换为 `bigint`。这样做的目的是将哈希值与 `复杂度 (complexity)` 进行比较。

虽然完成上述步骤后Miner将正常工作，但它的视觉上看起来不够好（尝试 `npm run start:script`）。因此，我们必须解决这个问题。让我们开始吧。

#### 改善 TON Miner 的外观 ✨

我们现在想让Miner看起来性感！我们该怎么做？

跟着我，我的朋友，跟着我。

为了实现目标，我们将添加这些命令：

```ts title="./scripts/mine.ts"
let msg = Queries.mine(mineParams); // transaction builder
let progress = 0;

const bufferToBigint = (buffer: Buffer) => BigInt('0x' + buffer.toString('hex'));

while (bufferToBigint(msg.hash()) > complexity) {
    console.clear()
    console.log(`Mining started: please, wait for 30-60 seconds to mine your NFT!`)
    console.log()
    console.log(`⛏ Mined ${progress} hashes! Last: `, bufferToBigint(msg.hash()))

    mineParams.expire = unixNow() + 300;
    mineParams.data1 += 1n;
    msg = Queries.mine(mineParams);
}

console.log()
console.log('💎 Mission completed: msg_hash less than pow_complexity found!');
console.log()
console.log('msg_hash:       ', bufferToBigint(msg.hash()))
console.log('pow_complexity: ', complexity)
console.log('msg_hash < pow_complexity: ', bufferToBigint(msg.hash()) < complexity);

return msg;
```

来看看！让我们执行命令：

```bash
npm run start:script
```

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/7.png?raw=true',
        dark: '/img/tutorials/onboarding/7-dark.png?raw=true',
    }}
/>
<br></br>

很酷吧？

正确执行这些命令后，我们将拥有一个外观更易读的NFT Miner。在下一部分，我们将专注于将钱包连接到Miner，以创建一个可以接受和发送TON区块链交易的支付通道。

## 🎨 准备交易

接下来，我们将概述编译消息并使用您的[Tonkeeper钱包](https://Tonkeeper.com/)将其发送到区块链的步骤。
接下来的步骤将指导您完成在TON上**挖掘NFT**的过程。

#### 通过代币水龙头充值钱包余额

为了进行下一步，我们需要获取一些TON测试网代币。这可以通过使用[测试网水龙头](https://t.me/testgiver_ton_bot)来实现。

### 利用 Blueprint 交易机会

为了确保 NFT 挖矿过程正确进行，并确保用户能够正确存储其 NFT，我们将使用 [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript) 同时与 TON 区块链和 Tonkeeper 钱包进行交互。

为了实现这一目标，我们将使用标准的 `run()` 函数来运行并发送创建的事务：

```ts title="./scripts/mine.ts"
import { toNano } from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

async function mine() {
  // code from previous steps
}

export async function run(provider: NetworkProvider) {
    // Do not forget to return `msg` from `mine()` function
    const msg = await mine();

    await provider.sender().send({
        to: collectionAddress,
        value: toNano(0.05),
        body: msg
    });
}
```

让我们运行上述脚本发送交易：

```bash
npm start
```

请注意，我们使用的是 `npm start` 而不是 `npm run start:script`。这是因为我们需要利用 blueprint 的优势（在引擎盖下会调用 `blueprint run`）。

运行该命令后，回答下图所示问题即可连接 Tonkeeper 钱包：

```
? Which network do you want to use?
> testnet
? Which wallet are you using?
> TON Connect compatible mobile wallet (example: Tonkeeper)
? Choose your wallet (Use arrow keys)
> Tonkeeper
```

用您的 Tonkeeper 钱包扫描终端机上显示的二维码，建立连接。
连接后，在 Tonkeeper 中确认交易。

你感受到空气中弥漫的 _经验_ 了吗？这就是你，正在成为一名 TON 开发人员的路上。

## ⛏ 使用钱包挖掘 NFT

在TON上挖掘NFT有两种主要方式：

- [简单：NFT 测试网挖掘](/v3/guidelines/get-started-with-ton#simple-nft-testnet-mining)
- [真正的：NFT 主网挖掘](/v3/guidelines/get-started-with-ton#genuine-nft-mainnet-mining)

### 简单的：测试网 NFT 挖掘

以下是启动您的第一个测试网交易以挖掘NFT所需的步骤：

1. 激活[Tonkeeper 钱包内的测试网络模式](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment)
2. 将 Tonkeeper 中的 testnet 钱包地址输入到 `./scripts/mine.ts` 中的 `walletAddress` 变量中
3. 在 `./scripts/mine.ts` 中的 `collectionAddress` 变量中输入 [NFT collection from Testnet](https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX) 的地址。

#### 挖掘测试网 NFT Rocket

为了在测试网上成功挖掘NFT Rocket，必须遵循以下步骤：

1. _打开_ 您的手机上的Tonkeeper钱包（应该持有了一些新接收的TON测试网代币）。
2. 在钱包中选择扫描模式，扫描二维码。
3. _运行_ 您的Miner以获取正确的哈希（这个过程需要30至60秒）。
4. _按照_ blueprint 对话框中的步骤进行操作。
5. _扫描_ 矿工生成的二维码。
6. 在 Tonkeeper 钱包中 _确认_ 交易。

:::tip 最后的提示
因为可能有其他开发者正在尝试进行相同的过程来挖掘他们自己的NFT，您可能需要尝试几次才能成功（因为另一个用户可能在您之前挖掘到下一个可用的NFT）。
:::

在开始这个过程后不久，您将成功挖掘到您在TON上的第一个NFT（它应该出现在您的Tonkeeper钱包中）。

![](/img/tutorials/onboarding/8.svg)

欢迎加入，**真正的 TON 位开发者**！你做到了🛳

### 真正的：主网 NFT 挖掘

嘿！对于那些希望在TON主网上挖掘NFT的人来说，应该遵循以下指示：

1. 您已在Tonkeeper中激活了 _主网_ 模式（应该至少持有0.1 TON）。
2. 将 Tonkeeper 中的 _mainnet_ 钱包地址输入到 `./scripts/mine.ts` 中的 `walletAddress` 变量中
3. 在`./scripts/mine.ts`中的`collectionAddress`变量中输入[来自主网的 NFT 集合](https://getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX)的地址。
4. 将 **endpoint** 替换为 _Mainnet_：

```ts title="./scripts/mine.ts"
// specify endpoint for Mainnet
const endpoint = "https://toncenter.com/api/v2/jsonRPC"
```

#### 挖掘主网 NFT Rocket

就像我们在测试网NFT Rocket挖掘过程中概述的那样，为了在主网上成功挖掘NFT Rocket，必须遵循以下步骤：

1. _打开_ 手机上的 Tonkeeper 钱包（记住，里面应该有一些 TON 代币）。
2. 在钱包中 _选择_ 扫描模式，扫描二维码。
3. _运行_ 矿工以获取正确的哈希值（此过程需要 30 到 60 秒）。
4. _按照_ blueprint 对话框中的步骤进行操作。
5. _扫描_ 矿工生成的二维码。
6. 在 Tonkeeper 钱包中 _确认_ 交易。

:::tip 最后的提示
因为可能有其他开发者正在尝试进行相同的过程来挖掘他们自己的NFT，您可能需要尝试几次才能成功（因为另一个用户可能在您之前挖掘到下一个可用的NFT）。
:::

一段时间后，您将 **挖掘出您的 NFT**，并成为 TON 区块链中的 TON 开发者。仪式完成。在 Tonkeeper 中查看您的 NFT。

<div style={{ width: '100%', textAlign: 'center', margin: '0 auto' }}>
  <video width={'300'} style={{ width: '100%', borderRadius: '10pt', margin: '15pt auto' }} muted={true} autoPlay={true} loop={true}>
    <source src="/files/onboarding-nft.mp4" type="video/mp4" />

您的浏览器不支持视频标记。

</video>
</div>

欢迎加入，**真正的 TON 位开发者**！你做到了🛳

## 🧙 接下来是什么？

先休息一下你完成了一项重大任务！你现在是一个 TON 级的开发者。但这只是万里长征的开始。

## 另请参见

在完成TON入门挑战并成功挖掘NFT后，考虑看看这些详细介绍TON生态系统不同部分的材料：

- [什么是区块链？ 什么是智能合约？ 什么是 gas ？](https://blog.ton.org/what-is-blockchain)
- [TON Hello World：编写首个智能合约的分步指南](https://helloworld.tonstudio.io/02-contract/)
- [开发智能合约：简介](/v3/documentation/smart-contracts/overview)
- [[YouTube] Ton Dev Study - FunC & Blueprint](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg)
- [如何使用钱包智能合约](/v3/guidelines/smart-contracts/howto/wallet)
- [FunC之旅：第一部分](https://blog.ton.org/func-journey)
- [饺子销售机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)
- [铸造你的第一个令牌](/v3/guidelines/dapps/tutorials/mint-your-first-token)
- [逐步铸造 NFT 藏品](/v3/guidelines/dapps/tutorials/nft-minting-guide)
- [如何运行 TON 站点](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site)

:::info 有什么反馈意见吗？
您是这里的第一批探索者之一。如果您发现任何错误或感觉有堆叠，请将反馈发送至 [@SwiftAdviser](https://t.me/SwiftAdviser)。我会尽快修复！:)
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/custom-overlays.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/custom-overlays.md
================================================
# 自定义 overlays

TON 节点通过形成称为 *Overlays* 的子网进行通信。节点通常会参与一些常见的 Overlay，例如：每个分片的公共 Overlay，验证者参与的通用验证者 Overlay，以及特定验证者集合的专用 Overlay。

节点还可以配置为加入自定义overlays。
目前，这些overlays有两种用途：

- 广播外部信息
- 广播区块候选人。

参与定制 overlays 可以避免公共 overlays 的不确定性，提高交付可靠性和延迟。

每个自定义 overlays 都有严格确定的参与方列表，这些参与方具有预定义的权限，尤其是发送外部信息和块的权限。所有参与节点上的 overlay 配置都应相同。

如果您控制着多个节点，最好将它们合并到自定义 overlays 中，这样所有验证器都能发送候选块，所有 LS 都能发送外部信息。这样，LS 的同步速度会更快，同时外部信息的发送率也会更高（一般来说，发送能力也会更强）。需要注意的是，额外的 overlays 会导致额外的网络流量。

## 默认自定义 overlays

Mytonctrl 使用 https://ton-blockchain.github.io/fallback_custom_overlays.json 上的默认自定义overlays。这种 overlays 在大多数情况下都不会使用，而是在公共overlays连接出现问题时应急使用。
要停止参与默认自定义overlays，请运行命令

```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```

## 创建自定义 overlays

### 收集 adnl 地址

要在自定义 overlays 中添加验证器，可以使用 `fullnode adnl id`（可通过`validator-console -c getconfig`
获取）或`validator adnl id`（可在 mytonctrl 的状态中找到）。
要将 liteservers 添加到自定义overlays中，必须使用它们的 `fullnode adnl id`。

### 创建配置文件

创建格式为

```json
{
    "adnl_address_hex_1": {
        "msg_sender": true,
        "msg_sender_priority": 1
    },
    "adnl_address_hex_2": {
        "msg_sender": false
    },

    "adnl_address_hex_2": {
        "block_sender": true
    },
  ...
}
```

`msg_sender_priority` 决定将外部信息纳入区块的顺序：首先处理来自优先级较高来源的信息。来自公共overlays和本地 LS 的信息优先级为 0。

**注意，配置中列出的所有节点都应参与 overlays （换句话说，它们需要使用此配置添加 overlays ），否则连接性会很差，广播也会失败**

有一个特殊字符 `@validators` 可以创建一个动态自定义 overlays ，mytonctrl 会在每一轮自动生成
，并添加所有当前验证器。

### 添加自定义 overlay

使用 mytonctrl 命令添加自定义 overlay ：

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

请注意，所有 overlay. 层成员的名称和配置文件 \*\* 必须\*\*相同。使用
mytonctrl `list_custom_overlays` 命令检查 overlay 是否已创建。

### 调试

您可以将节点的冗余级别设置为 4，并使用 "CustomOverlay"（自定义 overlays ）字样对日志进行 grep 处理。

## 删除自定义 overlay

要删除节点上的自定义 overlay 层，请使用 mytonctrl 命令 `delete_custom_overlay<name>`。
如果overlays层是动态的（即配置中有 `@validators` 字样），则会在一分钟内删除，否则会立即删除。
要确保节点已删除自定义overlays层，请检查 `list_custom_overlays` mytonctrl 和 `showcustomoverlays` validator-console 命令。

## 低层级

用于使用自定义 overlays 层的验证器控制台命令列表：

- `addcustomoverlay<path_to_config>` - 为本地节点添加自定义overlay。请注意，此配置的格式必须与 mytonctrl 的配置格式不同：
  ```json
  {
    "name": "OverlayName",
    "nodes": [
      {
        "adnl_id": "adnl_address_b64_1",
        "msg_sender": true,
        "msg_sender_priority": 1
      },
      {
        "adnl_id": "adnl_address_b64_2",
        "msg_sender": false
      }, ...
    ]
  }
  ```
- `delcustomoverlay<name>` - 删除节点上的自定义 overlay 。
- `showcustomoverlays` - 显示节点知道的自定义 overlay 列表。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/faq.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/faq.mdx
================================================
# 常见问题

## MyTonCtrl 目录用法

MyTonCtrl 是一个包装器，它将文件存储在两个地方：

1. `~/.local/share/mytonctrl/` - 日志等长期文件存储在这里。
2. `/tmp/mytonctrl/` - 临时文件存储在这里。

MyTonCtrl 还包括另一个脚本，即 mytoncore，它将文件存储在以下位置：

1. `~/.local/share/mytoncore/` - 永久文件，主要配置将存储在这里。
2. `/tmp/mytoncore/` - 临时文件，用于选举的参数将保存在这里。

MyTonCtrl 会将自身和验证器的源代码下载到以下目录中：

1. `/usr/src/mytonctrl/`
2. `/usr/src/ton/`

MyTonCtrl 将验证器组件编译到以下目录中：

1. `/usr/bin/ton/`

MyTonCtrl 会在此处为验证器创建一个工作目录：

1. `/var/ton/`

---

## 如果 MyTonCtrl 是以 root 用户身份安装的

配置将以不同方式存储：

1. `/usr/local/bin/mytonctrl/`
2. `/usr/local/bin/mytoncore/`

---

## 如何删除 MyTonCtrl

以管理员身份运行脚本，删除编译后的 TON 组件：

```bash
sudo bash /usr/src/mytonctrl/scripts/uninstall.sh
sudo rm -rf /usr/bin/ton
```

在此过程中，请确保您有足够的权限来删除或修改这些文件或目录。

## 使用 MyTonCtrl 更改目录

### 安装前更改验证器工作目录

如果想在安装前更改验证器的工作目录，有两种方法：

1. **分叉项目** - 您可以分叉项目并在其中进行修改。了解如何使用 `man git-fork` fork 项目。
2. ** 创建符号链接** - 也可以使用以下命令创建符号链接：

   ````
   ```bash
   ln -s /opt/ton/var/ton
   ```
   ````

   此命令将创建指向 `/opt/ton` 的链接 `/var/ton`。

### 安装后更改验证器工作目录

如果想在安装后将验证器的工作目录从 `/var/ton/` 改为 `/var/ton/`，请执行以下步骤：

1. ** 停止服务** - 您需要使用这些命令停止服务：

   ```bash
   systemctl stop validator.service
   systemctl stop mytoncore.service
   ```

2. ** 移动验证程序文件** - 然后，您需要使用该命令移动验证程序文件：

   ```bash
   mv /var/ton/* /opt/ton/
   ```

3. **更新配置路径** - 替换位于 `~/.local/share/mytoncore/mytoncore.db` 的配置路径。

4. **关于经验的说明** - 没有进行过这种转移的经验，因此在进行转移时要考虑到这一点。

请确保您有足够的权限进行这些更改或运行这些命令。

## 在 MyTonCtrl 中了解验证程序状态并重启验证程序

本文档将帮助您了解如何确认 MyTonCtrl 是否已成为正式验证程序，以及如何重新启动验证程序。

## 重启校验器

如果需要重启验证器，可以运行以下命令：

```bash
systemctl restart validator.service
```

确保您有足够的权限执行这些命令并进行必要的调整。在执行可能影响验证程序的操作前，请务必备份重要数据。

## 另请参见

- [故障排除](/v3/guidelines/nodes/nodes-troubleshooting)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/monitoring/performance-monitoring.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/monitoring/performance-monitoring.mdx
================================================
# 性能监测

## 监控 TON 服务器性能

`htop`, `iotop`, `iftop`, `dstat`, `nmon` 等工具是测量实时性能的好帮手，但它们缺乏对过去性能进行故障排除的功能。

本指南推荐并解释如何使用 Linux sar（系统活动报告）实用程序进行 TON 服务器性能监控。

:::tip
该指南有助于确定服务器是否出现资源短缺，而不是验证引擎是否表现不佳。
:::

### 安装

#### SAR 安装

```bash
sudo apt-get install sysstat
```

#### 启用自动收集统计数据功能

```bash
sudo sed -i 's/false/true/g' /etc/default/sysstat
```

#### 启用服务

```bash
sudo systemctl enable sysstat sysstat-collect.timer sysstat-summary.timer
```

#### 启动服务

```bash
sudo systemctl start sysstat sysstat-collect.timer sysstat-summary.timer
```

### 使用方法

默认情况下，sar 每 10 分钟收集一次统计数据，并从午夜开始显示当天的统计数据。您可以不带参数运行 sar 来查看：

```bash
sar
```

如果您想查看前一天或前两天的统计数据，请将数字作为选项：

```bash
sar -1   # previous day
sar -2   # two days ago
```

如需精确日期，应使用 f 选项指向一个月内某一天的 sa 文件。因此，9 月 23 日应该是

```bash
sar -f /var/log/sysstat/sa23
```

要运行哪些 sar 报告，如何读取这些报告以识别性能问题？

以下是可用于收集不同系统统计信息的 sar 命令列表。您可以使用上述选项对其进行补充，以快速获取所需日期的报告。

### 内存报告

```bash
sar -rh
```

由于 TON 验证器引擎使用了 jemalloc 功能，它缓存了大量数据，这就是 sar -rh 命令大多数时候在 `%memused` 列中返回较低数字的原因。

同时，`kbcached` 列中的数字总是很高。出于同样的原因，你也不必担心 `kbmemfree` 列中显示的可用内存数量过低。重要的指标是来自 `%memused`列的数字。

如果超过 90%，则应考虑增加内存，并注意验证引擎是否因 OOM（内存不足）原因而异常停止--检查的最佳方法是 grep `/var/ton-work/log` 文件中的信号信息。

SWAP使用情况

```bash
sar -Sh
```

如果你发现swap被使用，就应该考虑增加内存。TON Core 团队的一般建议是禁用swap。

### CPU 报告

```bash
sar -u
```

如果服务器的 CPU 平均使用率不超过 70%（请参阅 "%user" 一栏），则应视为良好。

### 磁盘使用报告

```bash
sar -dh
```

注意 "%util" 一栏，如果某个磁盘的这一比例超过 90%，就做出相应的反应。

### 网络报告

```bash
sar -n DEV -h
```

或

```bash
sar -n DEV -h --iface=<interface name>
```

如果要按网络接口名称过滤结果。

查看 `%ifutil` 列的结果--它显示了接口在最大链路速度下的使用情况。

执行以下命令可以检查网卡支持的速度：

```bash
cat /sys/class/net/<interface>/speed
```

:::info
这不是提供商为您提供的链接速度。
:::

如果 `%ifutil` 显示使用率超过 70%，或 rxkB/s 和 txkB/s 列报告值接近提供商提供的带宽，请考虑升级链接速度。

### 报告性能问题

在报告任何性能问题之前，请确保满足节点的最低要求。然后执行以下命令：

```bash
sar -rudh | cat && sar -n DEV -h --iface=eno1 | cat > report_today.txt
```

昨天的报告请执行：

```bash
sar -rudh -1 | cat && sar -n DEV -h --iface=eno1 -1 | cat > report_yesterday.txt
```

另外，停止 TON 节点，测量磁盘 IO 和网络速度。

```bash
sudo fio --randrepeat=1 --ioengine=io_uring --direct=1 --gtod_reduce=1 --name=test --filename=/var/ton-work/testfile --bs=4096 --iodepth=1 --size=40G --readwrite=randread --numjobs=1 --group_reporting
```

查找 `read：IOPS=` 并将其与报告一起发送。超过 10k IOPS 的值应视为良好值。

```bash
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 -
```

下载和上传速度超过 700 Mbit/s 即为良好。

报告时，请将 SAR 报告以及 IOPS 和网络速度结果发送至 [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot) 。

初始版本由 [@neodix](https://t.me/neodix) - Ton 核心团队提供，2024 年 9 月 23 日



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/node-maintenance-and-security.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/node-maintenance-and-security.md
================================================
# 维护与安全

## <a id="introduction"></a>介绍

本指南提供了关于维护和保护TON验证节点的一些基本信息。

本文档假设使用\*\*[TON基金会推荐](/participate/run-nodes/full-node)\*\*的配置和工具安装了验证者，但通用概念也适用于其他场景，并且对于精通的系统管理员也很有用。

## <a id="maintenance"></a>维护

### <a id="database-grooming"></a>数据库整理

TON节点/验证者将其数据库保存在`--db`标志指定的路径下，通常是`/var/ton-work/db`，这个目录由节点创建和管理，但建议每月进行一次数据库整理/清理任务，以移除一些残留物。

**重要**：在执行以下步骤之前，您**必须**停止验证者进程，否则很可能会导致数据库损坏。

### archive-ttl

`archive-ttl` 是一个参数，用于定义数据块的存活时间。默认值为 604800 秒（7 天）。可以通过减少该值来缩小数据库大小。

```bash
MyTonCtrl> installer set_node_argument --archive-ttl <value>
```

如果不使用 MyTonCtrl，则可以编辑节点服务文件。

### state-ttl

`state-ttl` 是一个参数，用于定义块状态的生存时间。默认值为 86400 秒（24 小时）。您可以减少该值以减小数据库大小，但强烈建议验证器使用默认值（保持标记未设置）。
此外，该值应大于验证周期的长度（该值可在 [15th config param](https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-15) 中找到）。

```bash
MyTonCtrl> installer set_node_argument --state-ttl <value>
```

如果不使用 MyTonCtrl，则可以编辑节点服务文件。

### <a id="backups"></a>备份

备份验证者的最简单和最有效的方法是复制关键节点配置文件、密钥和mytonctrl设置：

- 节点配置文件：`/var/ton-work/db/config.json`
- 节点私钥环：`/var/ton-work/db/keyring`
- 节点公钥：`/var/ton-work/keys`
- mytonctrl配置和钱包：`$HOME/.local/share/myton*`，其中$HOME是启动mytonctrl安装的用户的主目录 **或者** `/usr/local/bin/mytoncore`，如果您以root用户安装了mytonctrl的话。

通过分析进程和日志来验证验证者进程是否运行。验证者应该在几分钟内与网络重新同步。

#### <a id="backups"></a>备份

备份验证者的最简单和最有效的方法是复制关键节点配置文件、密钥和mytonctrl设置：

两种方法的问题是，您必须在进行快照之前停止节点，否则很可能导致数据库损坏并带来意想不到的后果。许多云提供商在进行快照之前也要求您关闭机器。

这组文件是您从头恢复节点所需的全部内容。

### 快照

现代文件系统如ZFS提供快照功能，大多数云提供商也允许他们的客户在快照期间保留整个磁盘以备将来使用。

#### 安装mytonctrl / 节点

这样的停机不应该频繁进行，如果您每周对节点进行一次快照，那么在最坏的情况下，恢复后您将拥有一个一周旧的数据库，节点赶上网络的时间将比使用mytonctrl的“从转储安装”功能（在调用`install.sh`脚本时添加-d标志）进行新安装更长。

#### <a id="disaster-recovery"></a>灾难恢复

```sh
sudo -s
```

#### 安装mytonctrl / 节点

```sh
systemctl stop validator
systemctl stop mytoncore
```

#### 切换到root用户

- 节点配置文件：`/var/ton-work/db/config.json`
- 节点私钥环：`/var/ton-work/db/keyring`
- 节点公钥：`/var/ton-work/keys`

#### 停止mytoncore和验证者进程

如果您的新节点有不同的IP地址，则必须编辑节点配置文件`/var/ton-work/db/config.json`，并将leaf`.addrs[0].ip`设置为新IP地址的**十进制**表示。您可以使用\*\*[这个](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)\*\* python脚本将您的IP转换为十进制。

#### 应用备份的节点配置文件

```sh
chown -R validator:validator /var/ton-work/db
```

#### <a id="set-node-ip"></a>设置节点IP地址

如果您的新节点有不同的IP地址，则必须编辑节点配置文件`/var/ton-work/db/config.json`，并将leaf`.addrs[0].ip`设置为新IP地址的**十进制**表示。您可以使用\*\*[这个](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)\*\* python脚本将您的IP转换为十进制。

#### 确保数据库权限正确

```sh
systemctl start validator
systemctl start mytoncore
```

## 应用备份的mytonctrl配置文件

### <a id="host-security"></a>主机级安全

主机级安全是一个庞大的话题，超出了本文档的范围，但我们建议您永远不要在root用户下安装mytonctrl，使用服务账户以确保权限分离。

### <a id="network-security"></a>网络级安全

TON验证者是高价值资产，应该被保护以抵御外部威胁，您应该采取的第一步是尽可能使您的节点不可见，这意味着锁定所有网络连接。在验证者节点上，只有用于节点操作的UDP端口应该对互联网公开。

#### <a id="host-security"></a>主机级安全

主机级安全是一个庞大的话题，超出了本文档的范围，但我们建议您永远不要在root用户下安装mytonctrl，使用服务账户以确保权限分离。

#### <a id="network-security"></a>网络级安全

TON验证者是高价值资产，应该被保护以抵御外部威胁，您应该采取的第一步是尽可能使您的节点不可见，这意味着锁定所有网络连接。在验证者节点上，只有用于节点操作的UDP端口应该对互联网公开。

我们还建议您设置一个带有固定 IP 地址的小型“跳板机”VPS，如果您的家庭/办公室没有固定 IP 或者在您丢失主要 IP 地址时，可以作为访问受保护机器的备用方式供您使用。

#### 安装ufw和jq1

```sh
sudo apt install -y ufw jq
```

#### ufw规则集的基本锁定

```sh
sudo ufw default deny incoming; sudo ufw default allow outgoing
```

#### 安装ufw和jq1

```sh
sudo sed -i 's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g' /etc/ufw/before.rules
```

#### ufw规则集的基本锁定

```sh
sudo ufw insert 1 allow from <MANAGEMENT_NETWORK>
```

对每个管理网络/地址重复上述命令。

#### 向公众公开节点/验证者UDP端口

```sh
sudo ufw allow proto udp from any to any port `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```

#### 仔细检查您的管理网络

对每个管理网络/地址重复上述命令。

#### 向公众公开节点/验证者UDP端口

```sh
sudo ufw enable
```

#### 仔细检查您的管理网络

<mark>重要</mark>：在启用防火墙之前，请仔细检查您是否添加了正确的管理地址！

```sh
    sudo ufw status numbered
```

以下是具有两个管理网络/地址的锁定节点的示例输出：

```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_A>/28
[ 2] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_B>/32
[ 3] <NODE_PORT>/udp            ALLOW IN    Anywhere
[ 4] <NODE_PORT>/udp (v6)       ALLOW IN    Anywhere (v6)
```

#### 公开LiteServer端口

```sh
sudo ufw allow proto tcp from any to any port `sudo jq -r '.liteservers[0].port' /var/ton-work/db/config.json`
```

以下是具有两个管理网络/地址的锁定节点的示例输出：

#### 更多关于UFW的信息

参见Digital Ocean提供的这篇优秀的\*\*[ufw教程](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)\*\*，了解更多ufw的魔法。

### <a id="ip-switch"></a>IP切换

请注意，验证者上不应公开LiteServer端口。

无论如何，请确保在节点配置文件中 **[设置新 IP 地址](/v3/guidelines/nodes/node-maintenance-and-security#-set-node-ip-address)**！



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/nodes-troubleshooting.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/nodes-troubleshooting.md
================================================
# 故障排除

本节回答了有关运行节点的最常见问题。

## 获取账户状态失败

```
Failed to get account state
```

该错误意味着在分片状态下搜索该账户时出现了问题。
很可能是 liteserver 节点同步速度太慢，特别是主链同步超过了分片链（底层链）同步。在这种情况下，节点知道最近的主链区块，但无法检查最近的分片链区块中的账户状态，因此会返回 "获取账户状态失败"（Failed to get account state）。

## 解压账户状态失败

```
Failed to unpack account state
```

该错误表示请求的账户在当前状态下不存在。这意味着该账户同时未部署且余额为零

## 大约 3 小时内节点同步没有进展

尝试执行以下检查：

1. 进程是否正在运行而没有崩溃？
2. 节点和互联网之间有防火墙吗？如果有，它会将传入的 UDP 流量传输到 `/var/ton-work/db/config.json` 文件中的 `addrs[0].port` 字段指定的端口吗？
3. 机器与互联网之间是否存在 NAT？如果是，请确保 `/var/ton-work/db/config.json` 文件中的 `addrs[0].ip` 字段定义的 IP 地址与机器的真实公共 IP 相对应。请注意，该字段的值指定为带符号的 INT。可使用 [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node) 中的 `ip2dec` 和 `dec2ip` 脚本执行转换。

## 存档节点在同步过程进行了 5 天后仍不同步

查看 [本节中的](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours) 检查清单。

## 同步缓慢的潜在原因

磁盘相对较弱。建议检查磁盘的 IOPS（尽管有时托管服务提供商会夸大这些数字）。

## 无法将外部信息应用到当前状态：外部信息未被接受

```
Cannot apply external message to current state : External message was not accepted
```

此错误表示合约未接受外部信息。您需要在跟踪中找到退出代码。-13 表示账户没有足够的 TON 来接受信息（或它需要超过 gas_credit）。如果是钱包合约，exitcode=33 表示 seqno 错误（可能您使用的 seqno 数据过时了），exitcode=34 表示 subwallet_id 错误（对于旧钱包 v1/v2，这表示签名错误），exitcode=35 表示消息过期或签名错误。

## 错误 651 是什么意思？

`[Error : 651 : no nodes]` 表示您的节点无法在TON区块链中找到另一个节点。

有时，这一过程可能需要 24 小时。但是，如果您连续几天都收到这个错误，那就意味着您的节点无法通过当前网络连接进行同步。

:::tip 解决方案

它应允许一个特定端口的入站连接，以及任意端口的出站连接。
:::

## 验证器控制台未设置

如果遇到 `Validator console is not settings`（验证器控制台未设置）错误，则表明您正在从安装时使用的用户以外的用户运行 "MyTonCtrl"。

:::tip 解决方案

```bash
mytonctrl
```

:::

\###以不同用户身份运行 MyTonCtrl

以不同用户身份运行 MyTonCtrl 可能会引发以下错误：

```bash
Error: expected str, bytes or os.PathLike object, not NoneType
```

要解决这个问题，应该以安装 MyTonCtrl 的用户身份运行 MyTonCtrl。

## "block is not applied" 是什么意思？

**问：** 有时我们收到各种请求的 `block is not applied` 或 `block is not ready`，这正常吗？

**答：** 这是正常现象，通常这意味着您试图检索的数据块没有到达您要求的节点。

**问：** 如果出现比较频繁，是否意味着某个地方出现了问题？

你需要检查 mytonctrl 中的 "Local validator out of sync" 值。如果少于 20 秒，则一切正常。

但需要注意的是，节点是在不断同步的。有时，您可能会尝试接收一个尚未到达您请求的节点的数据块。

您需要略微延迟后重复请求。

## 与 -d 标志不同步的问题

如果在使用 `-d` 标志下载 `MyTonCtrl` 后遇到 `out of sync` 等于时间戳的问题，可能是转储没有正确安装（或已经过时）。

:::tip 解决方案
推荐的解决方案是重新安装 `MyTonCtrl` 并使用新的转储。
:::

如果同步时间异常长，可能是转储出现了问题。请 [联系我们](https://t.me/SwiftAdviser) 寻求帮助。

请从安装它的用户运行 `mytonctrl`。

## 错误命令......3 秒后超时

该错误表示本地节点尚未同步（同步时间少于 20 秒），正在使用公共节点。
公共节点并不总是响应，最终会出现超时错误。

:::tip 解决方案
解决问题的办法是等待本地节点同步或多次执行同一命令后再执行。
:::

## 状态命令不显示本地节点部分

![](/img/docs/full-node/local-validator-status-absent.png)

如果节点状态中没有本地节点部分，通常意味着安装过程中出了问题，跳过了创建/指定验证器钱包的步骤。
请同时检查是否指定了验证器钱包。

直接检查以下内容：

```bash
mytonctrl> get validatorWalletName
```

如果 validatorWalletName 为空，则执行以下操作：

```bash
mytonctrl> set validatorWalletName validator_wallet_001
```

## 在新服务器上转移验证器

:::info
将旧节点上的所有密钥和配置转移到工作节点上，然后启动它。万一在新节点上出了问题，还有一切都已设置好的源节点。
:::

最好的方法（虽然暂时不验证的惩罚很小，但可以不间断地进行）：

1. 使用 `mytonctrl` 在新服务器上进行简洁安装，并等待一切同步。

2. 停止两台机器上的 `mytoncore` 和验证器 `services`，备份源程序和新程序：

- 2.1 `/usr/local/bin/mytoncore/...`
- 2.2 `/home/${user}/.local/share/mytoncore/...`
- 2.3 `/var/ton-work/db/config.json`
- 2.4 `/var/ton-work/db/config.json.backup`
- 2.5 `/var/ton-work/db/keyring`
- 2.6 `/var/ton-work/keys`

3. 从源文件转移到新文件（替换内容）：

- 3.1 `/usr/local/bin/mytoncore/...`
- 3.2 `/home/${user}/.local/share/mytoncore/...`
- 3.3 `/var/ton-work/db/config.json`
- 3.4 `/var/ton-work/db/keyring`
- 3.5 `/var/ton-work/keys`

4. 在 `/var/ton-work/db/config.json`中编辑 `addrs[0].ip` 为安装后的当前值（可在备份 `/ton-work/db/config.json.backup` 中查看）。

5. 检查所有被替换文件的权限

6. 在新节点上，启动 `mytoncore` 和 `validator` 服务，检查节点是否同步，然后验证

7. 在新电脑上做一个备份：

```bash
cp var/ton-work/db/config.json var/ton-work/db/config.json.backup
```

## Mytonctrl 由其他用户安装。您可能需要用 ...用户启动 mtc。

使用安装用户运行 MyTonCtrl。

例如，最常见的情况是，尽管 MyTonCtrl 是以不同用户的身份安装的，但用户却试图以 root 用户身份运行 MyTonCtrl。在这种情况下，您需要登录安装 MyTonCtrl 的用户，并从该用户运行 MyTonCtrl。

### Mytonctrl 由其他用户安装。您可能需要使用 `validator` 用户启动 mtc

运行命令 `sudo chown<user_name>:<user_name> /var/ton-work/keys/*` 其中 `<user_name>` 是安装了 mytonctrl 的用户。

### Mytonctrl 是由其他用户安装的。您可能需要用 `ubuntu` 用户启动 mtc

此外，如果出现此错误，`mytonctrl` 可能无法正常工作。例如，`status` 命令可能返回空结果。

检查 `mytonctrl` 所有者：

```bash
ls -lh /var/ton-work/keys/
```

如果所有者是 `root` 用户，请先 [卸载](/v3/guidelines/nodes/running-nodes/full-node#uninstall-mytonctrl) `mytonctrl`，然后以 **非 root 用户** [重新安装](/v3/guidelines/nodes/running-nodes/full-node#run-a-node-text)。

否则，注销当前用户（如果使用 ssh 连接，则中断该连接），然后以正确的用户身份登录。

信息必须消失。

## MyTonCtrl 的控制台在显示 "Found new version of mytonctrl! Migrating!"

出现这种错误有两种已知情况：

### 更新 MytonCtrl 后出现错误

- 如果 MyTonCtrl 是由 root 用户安装的：删除文件 `/usr/local/bin/mytonctrl/VERSION`。
- 如果 MyTonCtrl 是由非 root 用户安装的：删除文件 `~/.local/share/mytonctrl/VERSION`.

### MytonCtrl 安装过程中出现错误

`MytonCtrl` 可以打开，但节点无法正常工作。请从计算机中删除 `MytonCtrl`，然后重新安装，确保解决以前遇到的任何错误。

## 另请参见

- [MyTonCtrl FAQ](/v3/guidelines/nodes/faq)
- [MyTonCtrl错误](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/overview.md
================================================
# 概览

本页收集了一些可用于管理 TON 区块链节点的建议。

- [TON 节点类型](/v3/documentation/infra/nodes/node-types)

## 运行 TON 节点

- [运行验证器节点](/v3/guidelines/nodes/running-nodes/validator-node)
- [运行全节点](/v3/guidelines/nodes/running-nodes/full-node)
- [运行中的 liteserver 节点](/v3/guidelines/nodes/running-nodes/liteserver-node)
- [运行中的存档节点](/v3/guidelines/nodes/running-nodes/archive-node)

## 维护

如果您在运行节点时遇到问题，建议您阅读以下文章。

- [故障排除](/v3/guidelines/nodes/nodes-troubleshooting)
- [维护与安全](/v3/guidelines/nodes/node-maintenance-and-security)
- [常见问题](/v3/guidelines/nodes/faq)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/persistent-states.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/persistent-states.md
================================================
# 持久状态

节点定期存储区块链状态的快照。每个状态都在某个主链区块创建，并且具有一定的TTL（生存时间）。区块和TTL的选择使用以下算法：

只有关键区块可以被选择。一个区块有一个时间戳`ts`。时间段的长度为`2^17`秒（大约1.5天）。时间戳`ts`的区块的时间段为`x = floor(ts / 2^17)`。每个时间段的第一个关键区块被选择用来创建持久状态。

时间段`x`的状态的TTL等于`2^(18 + ctz(x))`，其中`ctz(x)`是`x`的二进制表示中的尾随零的数量（即最大的`y`使得`x`可以被`2^y`整除）。

这意味着每1.5天会创建一个持久状态，其中一半的状态具有`2^18`秒（3天）的TTL，剩余状态的一半具有`2^19`秒（6天）的TTL，依此类推。

2022年有以下长期（至少3个月）的持久状态（未来的时间是大致的）：

|                                                                                                区块序列号 |                                                区块时间 |  TTL |                                                过期时间 |
| ---------------------------------------------------------------------------------------------------: | --------------------------------------------------: | ---: | --------------------------------------------------: |
|   [8930706](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=8930706) | 2022-02-07 01:31:53 | 777天 | 2024-03-24 18:52:57 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=27747086) | 2022-03-27 14:36:58 |  97天 | 2022-07-02 16:47:06 |
| [32638387](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=32638387) | 2022-05-14 20:00:00 | 194天 | 2022-11-24 23:00:00 |
| [34835953](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=34835953) | 2022-07-02 09:00:00 |  97天 | 2022-10-07 10:00:00 |
| [35893070](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=35893070) | 2022-08-19 22:00:00 | 388天 | 2023-09-12 06:00:00 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=36907647) | 2022-10-07 11:00:00 |  97天 | 2023-01-12 12:00:00 |

当节点第一次启动时，它必须下载一个持久状态。这在[validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp)中实现。

从初始化区块开始，节点下载所有更新的关键区块。它选择最近的具有仍然存在的持久状态的关键区块（使用上述公式），然后下载相应的主链状态和所有分片的状态（或仅下载此节点所需的分片）。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/archive-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/archive-node.md
================================================
# 运行归档节点

:::info
阅读本文之前，请先阅读 [全节点](/v3/guidelines/nodes/running-nodes/full-node)
:::

## 概述

存档节点是一种[完整节点](/participate/run-nodes/fullnode)类型，存储区块链的扩展历史数据。 如果您正在创建一个需要访问历史数据的 blockchain 浏览器或类似的应用程序， 建议使用归档节点作为索引器。

## 先决条件

我们强烈建议使用支持的操作系统安装 mytonctrl：

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## 硬件要求

- 16 x 内核 CPU
- 128GB ECC 内存
- 9TB SSD *OR* 配置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 峰值流量为每月 16 TB
- 公共 IP 地址（固定 IP 地址）

:::info 数据压缩
未压缩数据需要 9 TB。6TB 是基于使用已启用压缩功能的 ZFS 卷。
数据量每月大约增加 0.5TB 和 0.25TB，最近一次更新是在 2024 年 11 月。
:::

## 安装

### 安装

一般来说，运行存档节点需要以下步骤：

通常，在专用 SSD 驱动器上为节点创建一个单独的 ZFS 池是个好主意，这样可以方便管理存储空间和备份节点。

1. 安装 [zfs](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview)

```shell
sudo apt install zfsutils-linux
```

2. 在专用的 4TB `<disk>` 上 [创建池](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool)，并将其命名为 `data`

```shell
sudo zpool create data <disk>
```

3. 在还原之前，我们强烈建议在父 ZFS 文件系统上启用压缩功能，这将为您节省 [大量空间](https://www.servethehome.com/the-case-for-using-zfs-compression/)。要启用 "数据 "卷的压缩功能，请使用 root 账户输入：

```shell
sudo zfs set compression=lz4 data
```

### 安装 MyTonCtrl

请根据 [运行全节点](/v3/guidelines/nodes/running-nodes/full-node) 来 **安装** 和 **运行** mytonctrl。

### 准备节点

#### 安装 MyTonCtrl

1. 执行还原之前，必须使用 root 账户停止验证器：

```shell
sudo -s
systemctl stop validator.service
```

2. 备份 `ton-work` 配置文件（我们需要 `/var/ton-work/db/config.json`、`/var/ton-work/keys` 和 `/var/ton-work/db/keyring`）。

```shell
mv /var/ton-work /var/ton-work.bak
```

#### 下载转储

1. 备份 `ton-work` 配置文件（我们需要 `/var/ton-work/db/config.json`、`/var/ton-work/keys` 和 `/var/ton-work/db/keyring`）。
2. 下面是一个从 ton.org 服务器下载和恢复 **mainnet** 转储的命令示例：

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

要安装 **testnet** 转储，请使用

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest_testnet.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

转储的大小约为 **4TB**，因此下载和恢复可能需要几天（最多 4 天）。转储大小会随着网络的增长而增加。

转储大小为__~1.5TB__，因此下载和恢复需要一些时间。

1. 必要时安装工具(`pv`, `plzip`)
2. 将 `<usr>` 和 `<pwd>` 替换为您的凭据
3. 告诉 `plzip` 在机器允许的范围内使用尽可能多的内核，以加快提取速度 (`-n`)

#### 安装转储

1. 挂载 zfs：

```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```

2. 将`db/config.json`、`keys`和`db/keyring`从备份恢复到`/var/ton-work`。

```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```

3. 请确保`/var/ton-work`和`/var/ton-work/keys`目录的权限提升正确：

- 请确保`/var/ton-work`和`/var/ton-work/keys`目录的权限提升正确：

```shell
chown -R validator:validator /var/ton-work/db
```

- /var/ton-work/keys "目录的所有者应为 "ubuntu "用户：

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

#### 更新配置

更新存档节点的节点配置。

1. 打开节点配置文件 \`/etc/systemd/system/validator.service

```shell
nano /etc/systemd/system/validator.service
```

2. 在 `ExecStart` 行中添加节点的存储设置：

```shell
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
```

:::info
启动节点并观察日志后，请耐心等待。
快照不带 DHT 缓存，因此您的节点需要一些时间才能找到其他节点并与之同步。
根据快照的时间和互联网连接速度，您的节点可能需要**几个小时到几天**才能赶上网络。
**在最低设置条件下，这一过程可能需要 5 天。**
这是正常现象。
:::

:::caution
启动节点并观察日志后，请耐心等待。转储不带 DHT 缓存，因此您的节点需要一些时间才能找到其他节点，然后与它们同步。根据快照的时间，您的节点可能需要几个小时到几天的时间才能赶上网络。这是正常现象。
:::

#### 启动节点

1. 运行命令启动验证器：

```shell
systemctl start validator.service
```

2. 从 *local user* 打开 `mytonctrl` 并使用 `status` 检查节点状态。

## 节点维护

节点数据库需要不时清理（我们建议每周清理一次），为此请以 root 身份执行以下步骤：

1. 停止验证程序（切勿跳过！）。

```shell
sudo -s
systemctl stop validator.service
```

2. 删除旧日志

```shell
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```

4. 删除临时文件

```shell
rm -r /var/ton-work/db/files/packages/temp.archive.*
```

5. 启动验证程序

```shell
systemctl start validator.service
```

## 故障排除和备份

如果由于某种原因，某些程序无法运行或发生故障，你可以随时 [roll back](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) 到 ZFS 文件系统上的 @archstate 快照，这是转储的原始状态。

1. 停止验证程序（切勿跳过！）。

```shell
sudo -s
systemctl stop validator.service
```

2. 检查快照名称

```shell
zfs list -t snapshot
```

3. 回滚到快照

```shell
zfs rollback data/ton-work@dumpstate
```

如果您的节点运行良好，您可以删除该快照以节省存储空间，但我们确实建议您定期为文件系统拍摄快照，以便回滚，因为验证器节点在某些情况下会损坏数据和 config.json。[zfsnap](https://www.zfsnap.org/docs.html)是一个自动轮换快照的好工具。

:::tip 需要帮助吗？
有问题或需要帮助？请在 [TON dev 聊天室](https://t.me/tondev_eng) 中提问，以获得社区的帮助。MyTonCtrl 开发人员也会在那里交流。
:::

## 参阅

### 强制归档节点不存储数据块

要强制节点不存储归档块，请使用 86400。请查看 [set_node_argument 部分](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#set_node_argument) 了解更多信息。

```bash
installer set_node_argument --archive-ttl 86400
```

## 支持

通过 [@mytonctrl_help](https://t.me/mytonctrl_help) 联系技术支持。

## 参阅

- [TON 节点类型](/v3/documentation/infra/nodes/node-types)
- [运行全节点](/v3/guidelines/nodes/running-nodes/full-node)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/full-node.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/full-node.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 运行全节点

## 操作系统要求

[MyTonCtrl](https://github.com/ton-blockchain/mytonctrl)是一个控制台应用程序，它是fift、lite-client和validator-engine-console的方便包装器。它专门开发用于简化在Linux操作系统上的钱包、域和验证者管理任务。

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## 必要条件

:::caution 个人本地计算机的节点使用情况
即使符合要求，也不应在个人本地计算机上长时间运行任何类型的节点。节点会主动使用磁盘，并可能迅速损坏磁盘。
:::

### 含验证器

- 16 cores CPU
- 128 GB RAM
- 1TB NVME SSD _OR_ Provisioned 64+k IOPS storage
- 1 Gbit/s 网络连接
- 公共 IP 地址（_固定 IP 地址）
- 64 TB/月流量（峰值负载时为 100 TB/月）

:::info 为高峰负荷做好准备
通常情况下，您需要至少 1 Gbit/s 的连接才能可靠地满足峰值负载（平均负载预计约为 100 Mbit/s）。
:::

### 端口转发

所有类型的节点都需要一个静态外部 IP 地址，一个 UDP 端口用于转发传入连接，所有传出连接都是开放的 - 节点使用随机端口进行新的传出连接。节点必须通过 NAT 对外可见。

您需要一台具有**固定IP地址**和**高带宽网络连接**的机器来运行TON区块链全节点。

:::info
您可以使用 `netstat -tulpn` 命令查看哪个 UDP 端口已打开。
:::

### 推荐供应商

TON基金会推荐以下供应商运行验证者：

| 云提供商                          | 实例类型                            | CPU                     | RAM     | 存储                                | 网络              | 公共IP                                    | 流量            |
| ----------------------------- | ------------------------------- | ----------------------- | ------- | --------------------------------- | --------------- | --------------------------------------- | ------------- |
| GCP                           | `n2-standard-16`                | 32 个 vCPU               | `128GB` | `1TB NVMe SSD`                    | `16 Gbps`       | Reserve a static external IP            | `64 TB/month` |
| 阿里云                           | `ecs.g6.4xlarge`                | `32 vCPUs`              | `128GB` | `1TB NVMe SSD`                    | `Up to 10 Gbps` | Bind an Elastic IP                      | `64 TB/month` |
| 腾讯云                           | `M5.4XLARGE`                    | `32 vCPUs`              | `128GB` | `1TB NVMe SSD`                    | `Up to 10 Gbps` | Associate an Elastic IP                 | `64 TB/month` |
| Vultr                         | `bare metal Intel E-2388G`      | `16 Cores / 32 Threads` | `128GB` | `1.92TB NVMe SSD`                 | `10 Gbps`       | Fixed IP address included with instance | `64 TB/month` |
| DigitalOcean                  | `general purpose premium Intel` | `32 vCPUs`              | `128GB` | `1TB NVMe SSD`                    | `10 Gbps`       | Fixed IP address included with instance | `64 TB/month` |
| Latitude                      | `c3.medium.x86`                 | `16 Cores / 32 Threads` | `128GB` | `1.9TB NVMe SSD`                  | `10 Gbps`       | Fixed IP address included with instance | `64 TB/month` |
| AWS                           | `i4i.8xlarge`                   | `32 vCPUs`              | `256GB` | `2 x 3,750 AWS Nitro SSD (fixed)` | `Up to 25 Gbps` | Bind an Elastic IP                      | `64 TB/month` |

:::info
**注：** 价格、配置和可用性可能有所不同。建议您在做出任何决定之前，始终查看各云提供商的官方文档和定价页面。
:::

## GCP (谷歌云平台)

[//]: # "<ReactPlayer controls={true} style={{borderRadius:'10pt', margin:'15pt auto', maxWidth: '100%'}} url='/docs/files/TON_nodes.mp4' />"

请查看本视频的分步教程，以便及时开始：

<video style={{borderRadius:'10pt', margin:'auto', width: '100%', maxWidth: '100%'}} controls={true}>
    <source src="/files/TON_nodes.mp4" type="video/mp4" />
</video>

## 腾讯云

### 切换到您的非root用户：

:::warning
这一步是成功安装和使用 mytonctrl 的**必要**，不要忽略**非 root 用户创建**。没有这一步，安装过程中不会出错，但 mytonctrl 将无法正常工作。
:::

如果没有 **非 root** 用户，可以通过以下步骤创建一个（否则跳过前两个步骤，进入第三个步骤）。

1. 以root用户身份登录并创建新用户：

```bash
sudo adduser <username>
```

2. 将用户添加到 sudo 组：

```bash
sudo usermod -aG sudo <username>
```

3. 登录新用户（如果使用 ssh，**需要停止当前会话，然后使用正确的用户重新连接**）。

```bash
ssh <username>@<server-ip-address>
```

### 安装 MyTonCtrl

从具有 **sudo** 权限的 **非root** 用户账户下载并运行安装脚本：

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu">

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh
```

<video style={{borderRadius:'10pt', margin:'auto', width: '100%', maxWidth: '100%'}} controls={true}>
    <source src="/files/TON_nodes.mp4" type="video/mp4" />
</video>

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
su root -c 'bash install.sh'
```

</TabItem>
</Tabs>

- 以具有**sudo**权限的**非root**用户身份登录您的服务器。
- 如果您没有非root用户，请以root身份登录并创建一个：
- `-i` - 忽略最低要求，只有在不使用实际节点的情况下检查编译过程时才使用。
- `-m` - 模式，可以是 `validator` 或 `liteserver`。
- `-t` - 禁用遥测功能。

** 要使用 testnet**，应在 `-c` 标志中加入 `https://ton.org/testnet-global.config.json` 值。

默认的 `-c` 标志值为 `https://ton-blockchain.github.io/global.config.json`，这是默认的主网配置。

### 运行 mytonctrl

1. 切换到您的非root用户：

```sh
mytonctrl
```

2. 使用 `status` 命令检查 `MyTonCtrl` 的状态：

```sh
status
```

**在 testnet** 中，必须使用  `status fast` 命令，而不是 `status`。

应显示以下状态：

- **mytoncore status**：应为绿色。
- **local validator status**：也应为绿色。
- **local validator out of sync**：最初显示的是一个 `n/a` 字符串。新创建的验证器与其他验证器连接后，数字将达到 250k 左右。随着同步的进行，这个数字会逐渐减少。当该数字低于 20 时，验证程序将被同步。

**status** 命令输出示例：

![status](/img/docs/nodes-validator/mytonctrl-status.png)

:::caution 确保状态输出相同
所有节点都应显示 **Local Validator status** 部分。
否则，[检查故障排除部分](/v3/guidelines/nodes/nodes-troubleshooting#status-command-displays-without-local-node-section) 和 [检查节点日志](/v3/guidelines/nodes/running-nodes/full-node#check-the-node-logs)。
:::

等待直到 `Local validator out of sync` 变为少于 20 秒。

当一个新节点启动时，即使是从转储开始，**也需要等待长达 3 个小时，不同步的数量才会开始减少**。这是因为节点仍需要在网络中建立自己的位置，通过 DHT 表传播自己的地址等。

### 卸载 mytonctrl

下载脚本并运行：

```bash
sudo bash /usr/src/mytonctrl/uninstall.sh
```

### 检查 mytonctrl 所有者

运行：

```bash
ls -lh /var/ton-work/keys/
```

## 技巧与窍门

### 可用命令列表

- 您可以使用 `help` 获取可用命令列表：

![Help command](/img/docs/full-node/help.jpg)

### 查看钱包列表

- 要检查 **mytonctrl** 日志，请打开本地用户的 `~/.local/share/mytoncore/mytoncore.log` 或 Root 的 `/usr/local/bin/mytoncore/mytoncore.log`。

![logs](/img/docs/nodes-validator/manual-ubuntu_mytoncore-log.png)

### 检查节点日志

![wallet list](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

```bash
tail -f /var/ton-work/log.thread*
```

## 支持

最近（_在2023年底_），大致数字为最低质押代币约**340K TON**，最高约**1M TON**。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/liteserver-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/liteserver-node.md
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Liteserver 节点

:::info
阅读本文之前，请先阅读 [全节点](/v3/guidelines/nodes/running-nodes/full-node)
:::

当在全节点上激活端点时，节点将承担 **Liteserver** 的角色。这种节点类型可以处理并响应来自轻客户端的请求，允许与TON区块链无缝互动。

## 硬件要求

与 [validator](/v3/guidelines/nodes/running-nodes/full-node#hardware-requirements) 相比，liteserver 模式所需的资源较少。不过，我们仍然建议使用功能强大的机器来运行 liteserver。

- 至少 16 核 CPU
- 至少 128GB 内存
- 至少 1TB GB NVMe SSD *或* Provisioned 64+k IOPS storage
- 1 Gbit/s 网络连接
- 峰值流量为每月 16 TB
- 公共 IP 地址（*固定 IP 地址*）

### 推荐供应商

请使用 [推荐提供商](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) 部分中列出的云提供商。

Hetzner 和 OVH 被禁止运行验证器，但您可以使用它们运行点服务器：

- **Hetzner**: EX101, AX102
- **OVH**: RISE-4

## 安装 liteserver

如果没有 mytonctrl，请使用 `-m liteserver` 标志安装：

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu">

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash ./install.sh -m liteserver
```

  </TabItem>
  <TabItem value={'debian'} label={'Debian'}>

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
su root -c 'bash ./install.sh -m liteserver'
```

  </TabItem>
</Tabs>

- `-d` - **mytonctrl**将下载最新区块链状态的[dump](https://dump.ton.org/)。
  这将使同步时间缩短数倍。
- `-c<path>` - 如果要使用非公共 liteservers 进行同步。*（非必填）*
- `-i` - 忽略最低要求，只有在不使用实际节点的情况下检查编译过程时才使用。
- `-m` - 模式，可以是 `validator` 或 `liteserver`。

**要使用 testnet**，应在 `-c` 标志中加入 `https://ton.org/testnet-global.config.json` 值。

默认的 `-c` 标志值为 `https://ton-blockchain.github.io/global.config.json`，这是默认的主网配置。

如果已经安装了 mytonctrl，请运行

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## 检查防火墙设置

首先，确认在 `/var/ton-work/db/config.json` 文件中指定的 Liteserver 端口。每次新安装 `MyTonCtrl` 时，该端口都会改变。它位于 `port` 字段：

```json
{
  ...
  "liteservers": [
    {
      "ip": 1605600994,
      "port": LITESERVER_PORT
      ...
    }
  ]
}
```

如果使用的是云提供商，则需要在防火墙设置中打开该端口。例如，如果使用 AWS，则需要在[安全组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)中打开该端口。

以下是在裸机服务器防火墙中打开端口的示例。

### 在防火墙中打开一个端口

我们将使用 `ufw` 工具（[cheatsheet](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)）。您可以使用自己喜欢的工具。

1. 如果未安装 `ufw` 则安装：

```bash
sudo apt update
sudo apt install ufw
```

2. 允许 ssh 连接：

```bash
sudo ufw allow ssh
```

3. 允许使用 `config.json` 文件中指定的端口：

```bash
sudo ufw allow <port>
```

4. 启用防火墙：

```bash
sudo ufw enable
```

5. 检查防火墙状态：

```bash
sudo ufw status
```

这样，您就可以在服务器的防火墙设置中打开端口。

## 与 Lites 服务器（lite-client）交互

0. 在机器上创建一个空项目，并在项目目录中粘贴 `config.json`。该配置可通过以下命令获取：

```bash
installer clcf # in mytonctrl
```

它将在安装了 mytonctrl 的机器上创建 `/usr/bin/ton/local.config.json`。查看 [mytonctrl 文档了解更多信息](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#clcf)。

1. 安装库。

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

```bash
npm i --save ton-core ton-lite-
```

  </TabItem>
  <TabItem value="python" label="Python">

```bash
pip install pytonlib
```

  </TabItem>
  <TabItem value="go" label="Golang">

```bash
go get github.com/xssnick/tonutils-go
go get github.com/xssnick/tonutils-go/lite
go get github.com/xssnick/tonutils-go/ton
```

  </TabItem>
</Tabs>

2. 初始化主链并请求主链信息，以确保 liteserver 正在运行。

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

在 `package.json` 文件中将项目类型更改为 `module`：

```json
{
    "type": "module"
}
```

创建包含以下内容的 `index.js` 文件：

```js
import { LiteSingleEngine } from 'ton-lite-/dist/engines/single.js'
import { LiteRoundRobinEngine } from 'ton-lite-/dist/engines/roundRobin.js'
import { Lite } from 'ton-lite-/dist/.js'
import config from './config.json' assert {type: 'json'};


function intToIP(int ) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = config.liteservers[0];

async function main() {
    const engines = [];
    engines.push(new LiteSingleEngine({
        host: `tcp://${intToIP(server.ip)}:${server.port}`,
        publicKey: Buffer.from(server.id.key, 'base64'),
    }));

    const engine = new LiteRoundRobinEngine(engines);
    const  = new Lite({ engine });
    const master = await .getMasterchainInfo()
    console.log('master', master)

}

main()

```

  </TabItem>
  <TabItem value="python" label="Python">

```python
  from pytoniq import LiteClient

  async def main():
      client = LiteClient.from_mainnet_config(  # choose mainnet, testnet or custom config dict
          ls_i=0,  # index of liteserver from config
          trust_level=2,  # trust level to liteserver
          timeout=15  # timeout not includes key blocks synchronization as it works in pytonlib
      )
  
      await client.connect()
  
      await client.get_masterchain_info()
  
      await client.reconnect()  # can reconnect to an exising object if had any errors
  
      await client.close()
  
      """ or use it with context manager: """
      async with LiteClient.from_mainnet_config(ls_i=0, trust_level=2, timeout=15) as client:
          await client.get_masterchain_info()

```

  </TabItem>
  <TabItem value="go" label="Golang">

```go
package main

import (
    "context"
    "encoding/json"
    "io/ioutil"
    "log"
    "github.com/xssnick/tonutils-go/liteclient"
    "github.com/xssnick/tonutils-go/ton"
)

func main() {
    client := liteclient.NewConnectionPool()

    content, err := ioutil.ReadFile("./config.json")
    if err != nil {
        log.Fatal("Error when opening file: ", err)
    }

    config := liteclient.GlobalConfig{}
    err = json.Unmarshal(content, &config)
    if err != nil {
        log.Fatal("Error during Unmarshal(): ", err)
    }

    err = client.AddConnectionsFromConfig(context.Background(), &config)
    if err != nil {
        log.Fatalln("connection err: ", err.Error())
        return
    }

    // initialize ton API lite connection wrapper
    api := ton.NewAPIClient(client)

    master, err := api.GetMasterchainInfo(context.Background())
    if err != nil {
        log.Fatalln("get masterchain info err: ", err.Error())
        return
    }

    log.Println(master)
}

```

  </TabItem>
</Tabs>

3. 现在，你可以与自己的 liteserver 交互了。

## 另见

- [[YouTube]教程如何启动liteserver](https://youtu.be/p5zPMkSZzPc)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/liteserver.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/liteserver.mdx
================================================
# 运行Liteserver

:::info 已弃用
此文章已与运行全节点文章合并。
:::

[启用Liteserver模式](/participate/run-nodes/full-node#enable-liteserver-mode)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/run-mytonctrl-docker.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/run-mytonctrl-docker.md
================================================
# 在 Docker 中运行 MyTonCtrl

## 硬件要求

- 16 核 CPU
- 128 GB 内存
- 1TB NVME SSD 或预置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 公共 IP 地址（固定 IP 地址）
- 峰值流量为每月 16 TB

***不建议使用！***  ***仅供测试！***

变量 **IGNORE_MINIMAL_REQS=true** 关闭 CPU/RAM 需求验证。

## 软件要求：

- docker-ce
- docker-ce-cli
- containerd.io
- docker-buildx-plugin
- docker-compose-plugin

  *官方 [Docker](https://docs.docker.com/engine/install/)中的安装指南*

## 测试运行系统：

- Ubuntu 20.04
- Ubuntu 22.04
- Ubuntu 24.04
- Debian 11
- Debian 12

## 使用官方 docker 镜像运行 MyTonCtrl v2：

- 使用 MyTonCtrl 提取镜像并运行节点

````bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-community/ton-docker-ctrl:latest


## Install and start MyTonCtrl from sources:

1. Clone the last version of the repository
```bash
git clone https://github.com/ton-community/ton-docker-ctrl.git
````

2. 转到目录

```bash
cd ./ton-docker-ctrl
```

3. 在 .env 文件中指明必要的值

```bash
vi .env
```

4. 开始组装 docker 镜像。这一步包括编译最新版本的 fift、validator-engine、lite-client 等，以及安装和初始设置 MyTonCtrl。

```bash
docker compose build ton-node
```

5. MyTonCtrl 的开始

```bash
docker compose up -d
```

## 将非 docker fullnode 或验证器迁移到 docker 化的 MyTonCtrl v2

指定 TON 二进制文件和源代码的路径，以及 TON 工作目录的路径，但最重要的是 MyTonCtrl 设置和钱包的路径。

```bash
docker run -d --name ton-node --restart always \
-v <EXISTING_TON_WORK_FOLDER>:/var/ton-work \
-v /usr/bin/ton:/usr/bin/ton \
-v /usr/src/ton:/usr/src/ton \
-v /home/<USER>/.local/share:/usr/local/bin \
ghcr.io/ton-community/ton-docker-ctrl:latest
```

## 变量设置：

.env 文件中的变量

- **GLOBAL_CONFIG_URL** - TON 区块链的网络配置（默认值：[Testnet](https://ton.org/testnet-global.config.json)）
- **MYTONCTRL_VERSION** - 编译 MyTonCtrl 时的 Git 分支
- **TELEMETRY** - 启用/禁用遥测功能
- **MODE** - 将 MyTonCtrl 设置为指定模式（验证器(validator) 或 liteserver ）
- **IGNORE_MINIMAL_REQS** - 忽略硬件要求

## 停止并删除 MyTonCtrl：

1. 停止容器

```bash
docker compose stop
```

2. 删除容器

```bash
docker compose down
```

3. 删除包含数据的容器

```bash
docker compose down --volumes
```

## 连接到 MyTonCtrl：

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

一旦连接成功，就可以使用命令 `status` 检查状态

```bash
MyTonCtrl> status
```

![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

反映可访问的命令列表 `help`

```bash
MyTonCtrl> help
```

## 查看 MyTonCtrl 日志：

```bash
docker compose logs
```

## 更新 MyTonCtrl 和 TON：

要获得最新版本的 TON 验证器和 MyTonCtrl，需要使用 docker-compose.yml 进入目录，然后进行编译。

```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```

完成后，再次启动 Docker Compose

```bash
docker compose up -d
```

连接到 MyTonCtrl 时，将自动进行更新验证。如果检测到任何更新，则会显示一条信息"*MyTonCtrl 更新可用。请使用 `update` 命令进行更新。*"

更新可使用更新命令，通过指定必要的分支来完成

```bash
MyTonCtrl> update mytonctrl2
```

## 更改数据存储路径：

默认情况下，TON 和 Mytoncore 作品存储在 **/var/lib/docker/volumes/** 中。

你可以在文件 docker-compose.yml 中进行修改，方法是在 **volumes** 部分指出所需的路由



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/running-a-local-ton.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/running-a-local-ton.md
================================================
# 运行本地TON

## MyLocalTon

使用 **MyLocalTon**，您甚至可以在笔记本电脑上运行自己的TON区块链。

![MyLocalTon](/img/docs/mylocalton.jpeg)

## 资源

MyLocalTon 具有方便的用户界面，并且兼容多个平台。

- [MyLocalTon 二进制文件](https://github.com/neodiX42/MyLocalTon/releases)
- [MyLocalTon 源代码](https://github.com/neodiX42/MyLocalTon)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/secure-guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/secure-guidelines.md
================================================
# 节点安全准则

确保节点的安全性，尤其是在区块链或分布式系统等去中心化网络中，对于维护数据的完整性、保密性和可用性至关重要。节点安全指南应涉及从网络通信到硬件和软件配置的各个层面。下面是一套节点安全指南：

### 1. 仅使用服务器运行 TON 节点

- 使用服务器执行其他任务会带来潜在的安全风险

### 2. 定期更新和打补丁

- 确保您的系统始终使用最新的安全补丁。
- 使用软件包管理工具，如 apt（适用于 Debian/Ubuntu）或 yum/dnf（适用于 CentOS/Fedora），定期更新：

```bash
sudo apt update && sudo apt upgrade -y
```

- 考虑通过启用无人值守升级来自动进行安全更新。

### 3. 使用强 SSH 配置

- 禁用 Root 登录：防止通过 SSH 进行 root 访问。编辑 /etc/ssh/sshd_config 文件：

```bash
PermitRootLogin no
```

- 使用 SSH 密钥：避免使用密码验证，改用 SSH 密钥。

```bash
PasswordAuthentication no
```

- 更改 SSH 默认端口：将 SSH 改为非标准端口可减少自动暴力破解攻击。例如

```bash
Port 2222
```

- 限制 SSH 访问：使用防火墙规则，只允许来自受信任 IP 的 SSH 访问

### 4. 安装防火墙

- 配置防火墙，只允许必要的服务。常用的工具有 ufw（简易防火墙）或 iptables：

```bash
sudo ufw allow 22/tcp   # Allow SSH
sudo ufw allow 80/tcp   # Allow HTTP
sudo ufw allow 443/tcp  # Allow HTTPS
sudo ufw enable         # Enable firewall
```

### 5. 监控日志

- 定期监控系统日志，识别可疑活动：
  - */var/log/auth.log*（用于验证尝试）
  - */var/log/syslog* 或 */var/log/messages*。
- 考虑集中登录

### 6. 限制用户权限

- 只为受信任的用户提供 root 或 sudo 权限。谨慎使用 sudo 命令，并审计 */etc/sudoers*，以尽量减少访问权限。
- 定期检查用户账户，删除不必要或不活跃的用户。

### 7. 配置 SELinux 或 AppArmor

- **SELinux**（在 RHEL/CentOS 上）和**AppArmor**（在 Ubuntu/Debian 上）提供强制访问控制，通过限制程序访问特定系统资源，增加了一层额外的安全性。

### 8. 安装安全工具

- 使用 Lynis 等工具定期进行安全审计，找出潜在漏洞：

```bash
sudo apt install lynis
sudo lynis audit system
```

### 9. 停用不必要的服务

- 禁用或删除不使用的服务，以尽量减少攻击面。例如，如果您不需要 FTP 或邮件服务，请禁用它们：

```bash
sudo systemctl disable service_name
```

### 10. 使用入侵检测和防御系统（IDS/IPS）

- 安装 Fail2ban 等工具，在尝试登录失败次数过多后阻止 IP 地址：

```bash
sudo apt install fail2ban
```

- 使用 AIDE（高级入侵检测环境）监控文件完整性并检测未经授权的更改。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/staking-with-nominator-pools.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/staking-with-nominator-pools.md
================================================
# 使用提名者池进行质押

## 概述

使用TON智能合约，您可以实现任何您想要的质押和存款机制。

然而，在TON区块链中存在“原生质押”——您可以将Toncoin借给验证者进行质押，并分享验证的奖励。

将Toncoin借给验证者的人称为**提名者**。

一个称为**提名者池**的智能合约，为一个或多个提名者提供了将Toncoin贷给验证者质押的能力，并确保验证者只能用该Toncoin进行验证。此外，智能合约保证了奖励的分配。

## 验证者与提名者

如果您熟悉加密货币，您一定听说过**验证者**和**提名者**。这些词经常出现在加密货币相关渠道中（我们的频道也不例外）。现在，是时候了解一下它们是什么了——区块链的两个主要参与者。

### 验证者

首先，让我们谈谈验证者。验证者是网络节点，通过验证（或确认）建议的区块并将其记录在区块链上来帮助维持区块链的运行。

要成为验证者，您必须满足两个要求：拥有高性能服务器并获得大量的TON（600,000）以进行质押。在撰写本文时，TON上有227个验证者。

### 提名者

:::info
提名者池的新版本已发布，更多信息请阅读单一提名者和归属合约页面。
:::

很明显，并不是每个人都能负担得起在余额上拥有100,000s的Toncoin——这就是提名者发挥作用的地方。简单来说，提名者是将其TON借给验证者的用户。每次验证者通过验证区块获得奖励时，奖励就会在参与者之间分配。

不久前，Ton Whales在TON上运行了第一个质押池，最低存款为50 TON。后来，TON基金会推出了第一个开放的提名者池。现在，用户可以以**10,000 TON**开始，以完全去中心化的方式质押Toncoin。

*来自[TON社区帖子](https://t.me/toncoin/543)。*

余额池应始终为 \*\*10  TON \*\* - 这是网络存储费的最低余额。

## 每月费用

由于验证轮次持续约 **18 小时**，每轮验证需要大约 **5 TON**，且一个提名池会参与奇数和偶数轮次的验证，因此运行该提名池每月大约需要 **105 TON**。

## 如何参与？

- [TON提名者池列表](https://tonvalidators.org/)

## 源代码

- [提名者池智能合约源代码](https://github.com/ton-blockchain/nominator-pool)

:::info
提名者的理论在[TON白皮书](https://docs.ton.org/ton.pdf)中有描述，章节2.6.3, 2.6.25。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/validator-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/validator-node.md
================================================
# 验证器节点

## 最低硬件要求

- 16 核 CPU
- 128 GB 内存
- 1TB NVME 固态硬盘 *或* 预配置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 公共 IP 地址（*固定 IP 地址*）
- 峰值流量为每月 100 TB

> 通常情况下，您需要至少 1 Gbit/s 的连接才能可靠地满足峰值负载（平均负载预计约为 100 Mbit/s）。

> 我们请验证人员特别注意磁盘的 IOPS 要求，这对网络的平稳运行至关重要。

## 端口转发

所有类型的节点都需要一个静态外部 IP 地址，一个 UDP 端口用于转发传入连接，所有传出连接都是开放的 - 节点使用随机端口进行新的传出连接。节点必须通过 NAT 对外可见。

可以通过网络提供商或 [租用服务器](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers)来运行节点。

:::info
可以使用 `netstat -tulpn` 命令来查找打开的 UDP 端口。
:::

## 先决条件

### 了解惩罚政策：

如果验证者在验证轮次中处理的区块数量少于预期数量的 90%，该验证者将被罚款 **101 TON**。\
详细信息请参阅：[惩罚政策](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties)。

### 运行 Fullnode

在阅读本文之前，请先启动 [Full Node](/v3/guidelines/nodes/running-nodes/full-node)。

使用 `status_modes` 命令检查验证模式是否启用。如果未启用，请参阅 [mytonctrl enable_mode 命令](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#enable_mode)。

## 架构

![image](/img/nominator-pool/hot-wallet.png)

## 查看钱包列表

使用 `wl` 命令查看 **MyTonCtrl** 控制台中的可用钱包列表：

```sh
wl
```

在安装 **mytonctrl** 时，会创建 **validator_wallet_001** 钱包：

![wallet list](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

## 激活钱包

1. 向钱包发送必要数量的硬币并激活它。

   最近（**2023 年底**），大致数据为最低质押约 **34 万 TON**，最高约 **100 万 TON**。

   通过 [toncan.com](https://tonscan.com/validation)查看当前质押，了解所需的金币数量。

   阅读更多内容[最大和最小质押的计算方法](/v3/documentation/infra/nodes/validation/staking-incentives#values-of-stakes-max-effective-stake)。

2. 使用 `vas` 命令显示传输历史：

   ```sh
   vas [wallet name]
   ```

3. 使用 `aw` 命令激活钱包（"钱包名称 "是可选项，如果没有提供参数，将激活所有可用的钱包）

   ```sh
   aw [wallet name]
   ```

![account history](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## 您的验证器已准备就绪

**Mytoncore** 将自动参加选举。它会将钱包余额分成两部分，并将其作为参加选举的质押。您也可以手动设置质押大小：

```sh
set stake 50000
```

`set stake 50000` - 将质押设置为 5 万个代币。如果质押被接受，我们的节点成为验证者，则只能在第二次选举中撤销质押（根据选民规则）。

![setting stake](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png)

## 维护指南

:::caution 削减不良验证机

了解有关 [slashing policy](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties) 的更多信息。
:::

作为 TON 验证器，请确保您遵循这些关键步骤，以确保网络的稳定性，并避免将来受到削减处罚。

基本行动：

1. 关注 [@tonstatus](https://t.me/tonstatus)，打开通知，并准备在必要时应用紧急更新。
2. 确保您的硬件满足或超过 [最低系统要求](/v3/guidelines/nodes/running-nodes/validator-node#minimal-hardware-requirements)。
3. 我们强烈要求您使用 [mytonctrl](https://github.com/ton-blockchain/mytonctrl)。
   - 在 `mytonctrl` 中保持更新通知并启用遥测功能： `set sendTelemetry true`.
4. 设置内存、磁盘、网络和 CPU 使用率的监控仪表板。如需技术援助，请联系 @mytonctrl_help_bot。
5. 利用仪表板监控验证器的效率。
   - 通过 `check_ef` 与 `mytonctrl` 检查。
   - [使用 API 构建仪表板](/v3/guidelines/nodes/running-nodes/validator-node#validation-and-effectiveness-apis)。

:::info
`mytonctrl` 允许通过 `check_ef` 命令检查验证器的效率，该命令会输出上一轮和本轮的验证器效率数据。
该命令通过调用 `checkloadall` 工具获取数据。
确保您的效率大于 90%（整轮期间）。
:::

:::info
如果效率低 - 采取措施解决问题。如有必要，请联系技术支持 [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot)。
:::

## 验证和有效性 API

:::info
请使用这些 API 设置仪表板以监控您的验证器。
:::

#### 受罚验证器跟踪器

您可以使用 [@tonstatus_notifications](https://t.me/tonstatus_notifications) 跟踪每轮受罚的验证器。

#### 验证 API

https://elections.toncenter.com/docs - 使用此 API 可获取当前和过去验证轮次（周期）的信息--轮次时间、哪些验证者参与了这些轮次、他们的质押等。

还提供有关当前和以往选举（验证轮）的信息。

#### 效率API

https://toncenter.com/api/qos/index.html#/ - 使用此 API 获取验证器在一段时间内的效率信息。

该应用程序接口会分析来自 catchain 的信息，并对验证器的效率做出估计。此 API 不使用 checkloadall 工具，而是其替代工具。
与只在验证轮次上工作的 `checkloadall` 不同，在此 API 中，您可以设置任何时间间隔来分析验证器的效率。

工作流程：

1. 将验证器的 ADNL 地址和时间间隔（`from_ts`, `to_ts`）传递给 API。为了获得准确的结果，需要足够长的时间间隔，例如从 18 小时前到当前时刻。

2. 读取结果。如果您的效率百分比字段小于 80%，说明您的验证器工作不正常。

3. 重要的是，您的验证员必须参与验证，并在指定时间内使用相同的 ADNL 地址。

例如，如果验证员每两轮就参加一次验证，那么您只需要指定他参加验证的时间间隔。否则，您将得到错误的低估结果。

该功能不仅适用于 Masterchain 验证者（索引 < 100），也适用于其他验证者（索引 > 100）。

## 支持

请联系技术支持 [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot)。该机器人仅适用于验证器，不会帮助解决常规节点的问题。

如果您有一个常规节点，请联系该小组：[@mytonctrl_help](https://t.me/mytonctrl_help).

## 另请参见

- [运行全节点](/v3/guidelines/nodes/running-nodes/full-node)
- [故障排除](/v3/guidelines/nodes/nodes-troubleshooting)
- [激励机制](/v3/documentation/infra/nodes/validation/staking-incentives)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/overview.md
================================================
# 概览

// TODO：需要编写



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/fee-calculation.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/fee-calculation.md
================================================
# 费用计算

当您的合约开始处理收到的报文时，您应该检查报文所附的 TON 数，以确保它们足以支付[所有类型的费用](/v3/documentation/smart-contracts/transaction-fees/fees#elements-of-transaction-fee)。为此，您需要计算（或预测）当前交易的费用。

本文档描述了如何使用新的 TVM 操作码 (opcode) 计算FunC 合约的费用。

:::info 有关操作码的更多信息
有关 TVM 操作码（包括下面提到的操作码）的完整列表，请查看 [TVM 指令页面](/v3/documentation/tvm/instructions)。
:::

## 存储费

### 概述

简而言之，`存储费` 是您为在区块链上存储智能合约而支付的费用。智能合约在区块链上存储的每一秒都需要付费。

使用带有以下参数的 `GETSTORAGEFEE` 操作码：

| 参数名称                       | 说明                  |
| :------------------------- | :------------------ |
| cells                      | 合约 cell 数           |
| bits                       | 合约位数                |
| is_mc | 如果源或目标位于主链中，则为 True |

:::info 存储和转发费用只计算唯一的哈希 cell ，即 3 个相同的哈希 cell 算作一个。

特别是，它可以重复数据：如果在不同分支中引用了多个等效子 cell ，则其内容只需存储一次。

[有关重复数据删除的更多信息](/v3/documentation/data-formats/ltb/library-cells)。
:::

### 计算流程

每份合约都有余额。您可以使用函数计算在指定的 "秒 "时间内，您的合约需要多少 TON 才能继续有效：

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

然后，您可以将该值硬编码到合约中，并使用该值计算当前的存储费用：

```func
;; functions from func stdlib (not presented on mainnet)
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int my_storage_due() asm "DUEPAYMENT";

;; constants from stdlib
;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST = 2;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

() calculate_and_reserve_at_most_storage_fee(int balance, int msg_value, int workchain, int seconds, int bits, int cells) inline {
    int on_balance_before_msg = my_ton_balance - msg_value;
    int min_storage_fee = get_storage_fee(workchain, seconds, bits, cells); ;; can be hardcoded IF CODE OF THE CONTRACT WILL NOT BE UPDATED
    raw_reserve(max(on_balance_before_msg, min_storage_fee + my_storage_due()), RESERVE_AT_MOST);
}
```

如果 `storage_fee` 是硬编码，**记得在合约更新过程中更新它**。并非所有合约都支持更新，因此这是一个可选要求。

## 计算费

### 概述

在大多数情况下，使用带有以下参数的 `GETGASFEE` 操作码：

| 参数         | 说明                  |
| :--------- | :------------------ |
| `gas_used` | gas 量，在测试中计算并硬编码    |
| `is_mc`    | 如果源或目标位于主链中，则为 True |

### 计算流程

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

但如何获取 `gas_used` 呢？通过测试！

要计算 `gas_used`，您应该为合约编写一个测试：

1. 进行转账。
2. 检查是否成功，并检索传输信息。
3. 检查该传输实际使用的 gas 量，以便计算。

合约的计算流程可能取决于输入数据。您应该以这种方式运行合约，以尽可能多地使用 gas 。确保使用最昂贵的计算方式来计算合约

```ts
// Just Init code
const deployerJettonWallet = await userWallet(deployer.address);
let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
const notDeployerJettonWallet = await userWallet(notDeployer.address);
let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
let sentAmount = toNano('0.5');
let forwardAmount = toNano('0.05');
let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
// Make sure payload is different, so cell load is charged for each individual payload.
let customPayload = beginCell().storeUint(0xfedcba0987654321n, 128).endCell();

// Let's use this case for fees calculation
// Put the forward payload into custom payload, to make sure maximum possible gas is used during computation
const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.17'), // tons
    sentAmount, notDeployer.address,
    deployer.address, customPayload, forwardAmount, forwardPayload);
expect(sendResult.transactions).toHaveTransaction({ //excesses
    from: notDeployerJettonWallet.address,
    to: deployer.address,
});
/*
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                              sender:MsgAddress forward_payload:(Either Cell ^Cell)
                              = InternalMsgBody;
*/
expect(sendResult.transactions).toHaveTransaction({ // notification
    from: notDeployerJettonWallet.address,
    to: notDeployer.address,
    value: forwardAmount,
    body: beginCell().storeUint(Op.transfer_notification, 32).storeUint(0, 64) // default queryId
        .storeCoins(sentAmount)
        .storeAddress(deployer.address)
        .storeUint(1, 1)
        .storeRef(forwardPayload)
        .endCell()
});
const transferTx = findTransactionRequired(sendResult.transactions, {
    on: deployerJettonWallet.address,
    from: deployer.address,
    op: Op.transfer,
    success: true
});

let computedGeneric: (transaction: Transaction) => TransactionComputeVm;
computedGeneric = (transaction) => {
  if(transaction.description.type !== "generic")
    throw("Expected generic transactionaction");
  if(transaction.description.computePhase.type !== "vm")
    throw("Compute phase expected")
  return transaction.description.computePhase;
}

let printTxGasStats: (name: string, trans: Transaction) => bigint;
printTxGasStats = (name, transaction) => {
    const txComputed = computedGeneric(transaction);
    console.log(`${name} used ${txComputed.gasUsed} gas`);
    console.log(`${name} gas cost: ${txComputed.gasFees}`);
    return txComputed.gasFees;
}

send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
```

## 预付费

### 概述

转发费是针对发出的信息收取的。

一般来说，预付费处理有三种情况：

1. 信息结构是确定的，您可以预测费用。
2. 报文结构在很大程度上取决于接收到的报文结构。
3. 你根本无法预测传出信息的结构。

### 计算流程

如果报文结构是确定的，则使用带有以下参数的 `GETFORWARDFEE` 操作码：

| 参数名称                       | 说明                  |
| :------------------------- | :------------------ |
| cells                      | cell 数              |
| bits                       | 位数                  |
| is_mc | 如果源或目标位于主链中，则为 True |

:::info 存储和转发费用只计算唯一的哈希 cell ，即 3 个相同的哈希 cell 算作一个。

特别是，它可以重复数据：如果在不同分支中引用了多个等效 sub-cells，则其内容只需存储一次。

[有关重复数据删除的更多信息](/v3/documentation/data-formats/ltb/library-cells)。
:::

但是，有时发出的报文在很大程度上取决于收到的结构，在这种情况下，您无法完全预测费用。请尝试使用带有以下参数的 `GETORIGINALFWDFEE` 操作码：

| 参数名称                         | 说明                  |
| :--------------------------- | :------------------ |
| fwd_fee | 从接收到的信息中解析出来        |
| is_mc   | 如果源或目标位于主链中，则为 True |

:::caution 小心使用 `SENDMSG` 操作码

它使用的 gas 量**无法预测**。

非必要不使用
:::

如果连 `GETORIGINALFWDFEE` 都无法使用，还有一个选择。使用带有以下参数的 `SENDMSG` 操作码：

| 参数名称  | 说明     |
| :---- | :----- |
| cells | cell 数 |
| mode  | 信息模式   |

模式对费用计算的影响如下：

- `+1024` 不创建行动，只估算费用。其他模式将在行动阶段发送信息。
- `+128` 代替了计算阶段开始前合约全部余额的价值（略有不准确，因为在计算阶段结束前无法估算的 gas 费用没有考虑在内）。
- `+64` 将接收信息的全部余额替换为输出值（略有误差，因为计算完成前无法估算的 gas 费用不会计算在内）。
- 其他模式见 [信息模式页面](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)。

它创建一个输出操作，并返回创建信息的费用。但是，它使用的 gas 量无法预测，无法用公式计算，那么如何计算呢？使用 `GASCONSUMED`：

```func
int send_message(cell msg, int mode) impure asm "SENDMSG";
int gas_consumed() asm "GASCONSUMED";
;; ... some code ...

() calculate_forward_fee(cell msg, int mode) inline {
  int gas_before = gas_consumed();
  int forward_fee = send_message(msg, mode);
  int gas_usage = gas_consumed() - gas_before;
  
  ;; forward fee -- fee value
  ;; gas_usage -- amount of gas, used to send msg
}
```

## 另请参见

- [带费用计算的稳定币合约](https://github.com/ton-blockchain/stablecoin-contract)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/get-methods.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/get-methods.md
================================================
# Get 方法

:::note
在继续之前，建议读者对[FunC编程语言](/develop/func/overview)和TON区块链上的[智能合约开发](/develop/smart-contracts)有基本的了解。这将有助于您更有效地理解这里提供的信息。
:::

## 介绍

Get方法是智能合约中用于查询特定数据的特殊函数。它们的执行不需要任何费用，并且在区块链之外进行。

这些函数对于大多数智能合约来说都非常常见。例如，默认的[钱包合约](/participate/wallets/contracts)有几个get方法，如`seqno()`、`get_subwallet_id()`和`get_public_key()`。它们被钱包、SDK和API用来获取有关钱包的数据。

## Get 方法的设计模式

### 基本 get 方法设计模式

1. **单一数据点检索**：一种基本设计模式是创建返回合约状态中单个数据点的方法。这些方法没有参数，并返回单个值。

   示例：

   ```func
   int get_balance() method_id {
       return get_data().begin_parse().preload_uint(64);
   }
   ```

2. **聚合数据检索**：另一种常见的模式是创建一次返回合约状态中多个数据点的方法。这通常在某些数据点一起使用时采用。这些在[Jetton](#jettons)和[NFT](#nfts)合约中非常常见。

   示例：

   ```func
   (int, slice, slice, cell) get_wallet_data() method_id {
       return load_data();
   }
   ```

### 高级 get 方法设计模式

1. **计算数据检索**：在某些情况下，需要检索的数据并不直接存储在合约的状态中，而是根据状态和输入参数计算得出的。

   示例：

   ```func
   slice get_wallet_address(slice owner_address) method_id {
       (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
       return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
   }
   ```

2. **条件数据检索**：有时需要检索的数据取决于某些条件，如当前时间。

   示例：

   ```func
   (int) get_ready_to_be_used() method_id {
       int ready? = now() >= 1686459600;
       return ready?;
   }
   ```

## 最常见的 get 方法

### 标准钱包

#### seqno()

```func
int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}
```

返回特定钱包中交易的序列号。这个方法主要用于[重放保护](/develop/smart-contracts/tutorials/wallet#replay-protection---seqno)。

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
    return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

- [什么是Subwallet ID？](/develop/smart-contracts/tutorials/wallet#what-is-subwallet-id)

#### get_public_key()

```func
int get_public_key() method_id {
    var cs = get_data().begin_parse().skip_bits(64);
    return cs.preload_uint(256);
}
```

检索与钱包关联的公钥。

### Jettons

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}
```

这个方法返回与Jetton钱包相关的完整数据集：

- (int) 余额
- (slice) 持有者地址
- (slice) Jetton主合约地址
- (cell) Jetton钱包代码

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

返回Jetton主合约的数据，包括其总供应量、管理员地址、Jetton内容和钱包代码。

#### get_wallet_address(slice owner_address)

```func
slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

根据所有者的地址，此方法计算并返回所有者的Jetton钱包合约地址。

### NFTs

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    return (init?, index, collection_address, owner_address, content);
}
```

返回与非同质化代币相关的数据，包括是否已初始化、在集合中的索引、集合地址、所有者地址和个体内容。

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
    var (owner_address, next_item_index, content, _, _) = load_data();
    slice cs = content.begin_parse();
    return (next_item_index, cs~load_ref(), owner_address);
}
```

返回NFT集合的数据，包括下一个要铸造的项目索引、集合内容和所有者地址。

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(workchain(), state_init);
}
```

给定索引，此方法计算并返回该集合的相应NFT项目合约地址。

#### royalty_params()

```func
(int, int, slice) royalty_params() method_id {
    var (_, _, _, _, royalty) = load_data();
    slice rs = royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

获取NFT的版税参数。这些参数包括原始创作者在NFT被出售时应支付的版税百分比。

#### get_nft_content(int index, cell individual_nft_content)

```func
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

给定索引和[个体NFT内容](#get_nft_data)，此方法获取并返回NFT的常见内容和个体内容。

## 如何使用 get 方法

### 在流行的浏览器上调用 get 方法

#### Tonviewer

您可以在页面底部的"Methods"标签中调用get方法。

- https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=method

####

您可以在"Get methods"标签中调用get方法。

-

### 从代码中调用 get 方法

我们将使用以下Javascript库和工具来提供以下示例：

- [ton](https://github.com/ton-core/ton)库
- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript) SDK

假设有一个合约，其中有以下get方法：

```func
(int) get_total() method_id {
    return get_data().begin_parse().preload_uint(32); ;; load and return the 32-bit number from the data
}
```

这个方法从合约数据中返回一个单一的数字。

下面的代码片段可以用来在已知地址的某个合约上调用这个get方法：

```ts
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

async function main() {
    // Create Client
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    // Call get method
    const result = await client.runMethod(
        Address.parse('EQD4eA1SdQOivBbTczzElFmfiKu4SXNL4S29TReQwzzr_70k'),
        'get_total'
    );
    const total = result.stack.readNumber();
    console.log('Total:', total);
}

main();
```

这段代码将输出`Total: 123`。数字可能会有所不同，这只是一个例子。

### 测试 get 方法

对于我们创建的智能合约的测试，我们可以使用[沙盒](https://github.com/ton-community/sandbox)，它默认安装在新的Blueprint项目中。

首先，您需要在合约包装器中添加一个特殊方法，以执行get方法并返回类型化的结果。假设您的合约叫做_Counter_，您已经实现了更新存储数字的方法。那打开`wrappers/Counter.ts`并添加以下方法：

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

它执行get方法并获取结果堆栈。堆栈在get方法的情况下基本上就是它所返回的东西。在这个片段中，我们从中读取一个单一的数字。在更复杂的情况下，一次返回多个值时，您可以多次调用`readSomething`类型的方法来从堆栈中解析整个执行结果。

最后，我们可以在测试中使用这个方法。导航到`tests/Counter.spec.ts`并添加一个新的测试：

```ts
it('should return correct number from get method', async () => {
    const caller = await blockchain.treasury('caller');
    await counter.sendNumber(caller.getSender(), toNano('0.01'), 123);
    expect(await counter.getTotal()).toEqual(123);
});
```

通过在终端运行`npx blueprint test`来检查，如果您做得正确，这个测试应该被标记为通过！

## 从其他合约调用 get 方法

与直觉相反，从其他合约调用get方法在链上是不可能的，主要是由于区块链技术的性质和需要达成共识。

首先，从另一个分片链获取数据可能需要时间。这种延迟可能很容易中断合约执行流程，因为区块链操作需要以确定和及时的方式执行。

其次，达成验证者之间的共识将是有问题的。为了验证交易的正确性，验证者也需要调用相同的get方法。然而，如果目标合约的状态在这些多次调用之间发生变化，验证者可能会得到不同的交易结果版本。

最后，TON中的智能合约被设计为纯函数：对于相同的输入，它们总是产生相同的输出。这一原则使得消息处理过程中的共识变得简单直接。引入运行时获取任意动态变化数据的能力将打破这种确定性属性。

### 对开发者的影响

这些限制意味着一个合约不能通过其get方法直接访问另一个合约的状态。无法在确定性的合约流程中纳入实时外部数据可能看起来有限制。然而，正是这些约束确保了区块链技术的完整性和可靠性。

### 解决方案和变通方法

在TON区块链中，智能合约通过消息进行通信，而不是直接从另一个合约调用方法。向目标合约发送请求执行特定方法的消息。这些请求通常以特殊的[操作码](/develop/smart-contracts/guidelines/internal-messages)开头。

被设计为接受这些请求的合约将执行所需的方法，并在单独的消息中发送结果。虽然这可能看起来很复杂，但它实际上简化了合约之间的通信，并提高了区块链网络的可扩展性和性能。

这种消息传递机制是TON区块链运作的一个整体部分，为可扩展网络增长铺平了道路，而无需在分片之间进行广泛的同步。

为了有效的合约间通信，至关重要的是您的合约被设计为正确接受和响应请求。这包括指定可以在链上调用以返回响应的方法。

让我们考虑一个简单的例子：

```func
#include "imports/stdlib.fc";

int get_total() method_id {
    return get_data().begin_parse().preload_uint(32);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_bits() < 32) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    cs~skip_bits(4);
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32); ;; load the operation code

    if (op == 1) { ;; increase and update the number
        int number = in_msg_body~load_uint(32);
        int total = get_total();
        total += number;
        set_data(begin_cell().store_uint(total, 32).end_cell());
    }
    elseif (op == 2) { ;; query the number
        int total = get_total();
        send_raw_message(begin_cell()
            .store_uint(0x18, 6)
            .store_slice(sender)
            .store_coins(0)
            .store_uint(0, 107) ;; default message headers (see sending messages page)
            .store_uint(3, 32) ;; response operation code
            .store_uint(total, 32) ;; the requested number
        .end_cell(), 64);
    }
}
```

在这个示例中，合约接收并处理内部消息，通过解读操作码、执行特定方法和适当地返回响应：

- 操作码`1`表示更新合约数据中的数字的请求。
- 操作码`2`表示从合约数据中查询数字的请求。
- 操作码`3`用于响应消息，发起调用的智能合约必须处理以接收结果。

为了简单起见，我们只是使用了简单的小数字1、2和3作为操作码。但对于真实项目，请根据标准设置它们：

- [用于操作码的CRC32哈希](/develop/data-formats/crc32)

## 常见陷阱及如何避免

1. **误用 get 方法**：如前所述，get方法被设计用于从合约的状态返回数据，不是用来更改合约的状态。尝试在get方法中更改合约的状态实际上不会这样做。

2. **忽略返回类型**：每个get方法都应该有一个明确定义的返回类型，与检索的数据相匹配。如果一个方法预期返回特定类型的数据，请确保该方法的所有路径都返回此类型。避免使用不一致的返回类型，因为这可能导致与合约交互时出现错误和困难。

3. **假设跨合约调用**：一个常见的误解是可以从链上的其他合约调用get方法。然而，如我们所讨论的，这是不可能的，因为区块链技术的性质和需要达成共识的需求。始终记住，get方法旨在链下使用，合约间的链上交互是通过内部消息完成的。

## 结论

Get方法是TON区块链中查询智能合约数据的重要工具。尽管它们有其局限性，但了解这些限制并知道如何克服它们是有效使用智能合约中的get方法的关键。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/guidelines.mdx
================================================
import Button from '@site/src/components/button'

# 概览

本页面收集了一些建议和最佳实践，可在开发TON区块链上的新智能合约时遵循。

- [内部消息](/develop/smart-contracts/guidelines/internal-messages)
- [外部消息](/develop/smart-contracts/guidelines/external-messages)
- [使用不可弹回消息](/develop/smart-contracts/guidelines/non-bouncable-messages)
- [Get方法](/develop/smart-contracts/guidelines/get-methods)
- ["accept_message"作用](/develop/smart-contracts/guidelines/accept)
- [支付处理查询和发送响应的费用](/develop/smart-contracts/guidelines/processing)
- [如何及为何对您的TON智能合约进行分片。研究TON的Jettons结构](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)
- [TON Keeper创始人Oleg Andreev和Oleg Illarionov关于TON jettons的谈话](https://www.youtube.com/watch?v=oEO29KmOpv4)

此外，还有一份有用的智能合约 [文档](/v3/documentation/smart-contracts/overview)。

## TON 课程：合约开发

[TON区块链课程](https://stepik.org/course/201638/)是关于TON区块链开发的全面指南。

- 第2模块专注于**TVM、交易、可扩展性和商业案例**。
- 第3模块专注于**智能合约开发的全过程**。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

查看TON区块链课程

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice.mdx
================================================
# 空投领取指南

在本文中，我们将研究假想的领取解决方案，尝试找出其性能问题并加以解决。
本文的重点是合约交互及其对整体性能的影响。
代码、安全方面和其他细微差别暂且不提。

## 领取机

:::info
几乎所有的领取解决方案都是如何运作的？
让我们想一想。
:::

用户发送某种证明，证明他有资格领取
解决方案对其进行检查，并发送回 jetton 。
在当前情况下，"证明" 指的是[merkle 证明](/v3/documentation/data-formats/tlb/exotic-cells#merkle-proof)，但也可以是签名数据或其他任何授权方法。
发送 jetton，因此会有一个 jetton 钱包和矿工。
我们还得确保这些鬼鬼祟祟的用户不能申请两次--双花消费保护合约。
哦，我们可能还想赚点钱，对吧？
所以至少要有一个申领钱包。
总结一下

### Distributor

从用户处获取证明，对其进行检查，并释放 jetton。
状态初始化：`(merkle_root、admin、fee_wallet_address)`。

### 双花

接收信息，如果已使用则跳转，否则继续传递信息

### Jetton

_Distributor_ 发送代币的 Jetton 钱包。
Jetton 矿工不在本文讨论范围之内。

### 收费钱包

任何类型的钱包合约

## 架构

### V1

我首先想到的设计是这样的：

- 用户向 distributor 发送证明
-  distributor 检查证明并部署 `双花` 合约
- distributor 将信息传递给双花。 
- 如果之前没有部署，双倍花费会向分发者发送 `claim_ok` 文件
- distributor 将领取费用发送到费用钱包。
- distributor 向用户发放 jetton。

**NAIVE ART AHEAD!**

这有什么问题吗？
看来循环在这里是多余的。

### V2

线性设计要好得多：

- 用户部署 "双重花费"，并将证明代理给 distributor
- distributor 通过状态 init `(distributor_address, user_address?)` 检查发送 "双倍花费 "的地址
- distributor 检查校样，在这种情况下，用户索引应是校样的一部分，然后放行。
-  distributor 将费用发送至费用钱包
  **MORE NAIVE ART**

## 分片优化

好了，我们有了一些进展，但分片优化呢？

### 这些是什么？

为了获得一些非常基本的理解，请参阅 [为不同分片创建钱包](/v3/guidelines/dapps/asset-processing/payments-processing/#wallet-creation-for-different-shards)
长话短说--分片是一个 4 位地址前缀。有点像网络。
当合约处于同一网段时，信息处理无需路由，因此速度更快。

### 确定我们可以控制的地址

#### distributor 地址

我们完全控制着分发者的数据，因此我们必须能够将其放到任何分片中。
怎么放？
请记住，合约地址是 [由其状态定义](/v3/documentation/smart-contracts/addresses#account-id) 。
我们应该使用合约的某些数据字段作为 nonce，并不断尝试，直到得到想要的结果。
在真实合约中，一个好的 nonce 例子可以是钱包合约的（subwalletId/publicKey）。
任何可以在部署后修改或不影响合约逻辑（如 subwalletId）的字段都能满足要求。
我们甚至可以为此明确创建未使用的字段，就像 [vanity-contract](https://github.com/ton-community/vanity-contract) 所做的那样

#### distributor jetton 钱包

我们无法直接控制生成的 jetton 钱包地址。
但是，如果我们控制了 distributor 地址，我们就可以选择它，这样它所产生的 jetton 钱包就会在同一个分片中。
但如何做到这一点呢？有一个 [lib](https://github.com/Trinketer22/turbo-wallet)可以解决这个问题！
它目前只支持钱包，但添加任意合约支持相对容易。
看看 [HighloadV3](https://github.com/Trinketer22/turbo-wallet/blob/44fe7ee4300e37e052871275be8dd41035d45c3a/src/lib/contracts/HighloadWalletV3.ts#L20) 是怎么做的吧。

### 双花合约

双花合约应该是每个证明都独一无二的，所以我们很难对它进行分片调整？
让我们好好想想。
仔细想想，这取决于证明的结构。
我首先想到的是与 [免铸造 jetton](https://github.com/tonkeeper/TEPs2/blob/mintles/text/0177-mintless-jetton-standard.md#handlers) 相同的结构。

```
_ amount:Coins start_from:uint48 expired_at:uint48 = AirdropItem;

_ _(HashMap 267 AirdropItem) = Airdrop;

```

在这种情况下，当然是无法调整的，因为地址分布是随机的，而且所有数据字段都是有意义的。
但没有什么能阻止我们这样做：

```
_ amount:Coins start_from:uint48 expired_at:uint48 nonce:uint64 = AirdropItem;

_ _(HashMap 267 AirdropItem) = Airdrop;
```

甚至

```
_ amount:Coins start_from:uint48 expired_at:uint48 addr_hash: uint256 = AirdropItem;

_ _(HashMap 64 AirdropItem) = Airdrop;

```

其中，64 位索引可用作 nonce，而地址则成为数据有效载荷的一部分，用于验证。
因此，如果由 `(distributor_address, index)` 构建双花数据，其中索引是数据的一部分，我们仍然可以获得初始可靠性，但现在地址分片可以通过索引参数进行调整。

#### 用户地址

显然，我们无法控制用户地址，不是吗？
是的，**但**我们可以将它们分组，使用户地址分片与分发者分片相匹配。
在这种情况下，每个分发者都将处理 _merkle root_ ，它完全由来自其分片的用户组成。

#### 总结 

我们可以把链中的 `double_spend->dist->dist_jetton` 部分放在同一个分片中。
留给其他分片的就是`dist_jetton->user_jetton->user_wallet`。

### 我们如何实际部署这种设置

让我们一步步来看看。
其中一个要求是 _distributor_ 合约必须有可更新的 _merkle root_ 文件。

- 使用初始 `merkle_root` 作为 nonce，在每个分片（0-15）内部署分发器，与其 jetton 钱包位于同一分片内
- 按地区分片对用户进行分组
- 为每个用户找到这样的索引，这样就可以 _双花_ 合约 `(distributor, index)` 最终与用户地址在同一分片中。
- 用上面步骤中的索引生成 _默克尔根_
- 根据 _默克尔根_ 更新_ distributor _

现在应该没问题了！

### V3

- 用户使用索引调整功能在同一分片部署 _双花_ 合约
- 用户分片中的分发器通过状态 init `(distributor_address, index)` 检查发送 "双花 "的地址
-  distributor 将费用发送至费用钱包
- Distributor 检查证明，在这种情况下，用户索引应是证明的一部分，并通过同一分片中的 jetton 钱包释放 jetton 。

**MORE NAIVE ART**
这有什么不对吗？让我们好好看看。
....
太对了！只有一个收费钱包，而费用都排到了一个分片上。这可能是一场灾难！(想知道这是否真的发生过吗？）

### V4

- 与 V3 相同，但现在有 16 个钱包，每个钱包与其 _distributor_ 在同一个分片。
- 必须使 _收费钱包_ 地址可更新

**Bit more art**

现在怎么样？LGTM。

## 下一步是什么？

我们总能更进一步。
来看看内置分片优化功能的自定义 [jetton 钱包](https://github.com/ton-community/mintless-jetton/blob/main/contracts/jetton-utils.fc#L142)。
因此，用户的 jetton 钱包最终会以 87% 的概率与用户在同一个分片中。
但这还只是一个未知领域，所以你只能靠自己了。
祝你在 TGE 中好运！



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/compilation-instructions.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/compilation-instructions.md
================================================
# 从源代码编译

您可以[在此处](/develop/smart-contracts/environment/installation#1-download)下载预构建的二进制文件。

如果您仍然想自己编译源代码，请按照以下说明操作。

:::caution
This is a simplified quick build guide.

如果您是为生产而不是家庭使用而构建，最好使用[自动构建脚本](https://github.com/ton-blockchain/ton/tree/master/.github/workflows)。
:::

## 通用

该软件可能在大多数Linux系统上都能正确编译和工作。它应该适用于macOS甚至Windows。

1. 在GitHub库 https://github.com/ton-blockchain/ton/ 下载TON区块链源代码的最新版本：

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2. 安装最新版本的：
   - `make`
   - `cmake` 版本 3.0.2 或更高
   - `g++` 或 `clang`（或适用于您的操作系统的另一种C++14兼容编译器）。
   - OpenSSL（包括C头文件）版本 1.1.1 或更高
   - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`

### 关于 Ubuntu

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3. 假设您已经将源代码树获取到 `~/ton` 目录，其中 `~` 是您的主目录，并且您已经创建了一个空的 `~/ton-build` 目录：

```bash
mkdir ton-build
```

然后在 Linux 或 MacOS 终端运行以下程序：

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### 在 MacOS 上

然后需要检查`/usr/local/opt`：

```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

找到`openssl@3`库并导出本地变量：

```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

编译 secp256k1

```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```

和 lz4：

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```

从 https://ton-blockchain.github.io/global.config.json 下载主网的最新配置文件：

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

或从 https://ton-blockchain.github.io/testnet-global.config.json 下载测试网的配置文件：

```zsh
cmake -GNinja -DCMAKE_BUILD_TYPE=Release .. \
-DCMAKE_CXX_FLAGS="-stdlib=libc++" \
-DSECP256K1_FOUND=1 \
-DSECP256K1_INCLUDE_DIR=$secp256k1Path/include \
-DSECP256K1_LIBRARY=$secp256k1Path/.libs/libsecp256k1.a \
-DLZ4_FOUND=1 \
-DLZ4_LIBRARIES=$lz4Path/lib/liblz4.a \
-DLZ4_INCLUDE_DIRS=$lz4Path/lib
```

:::

:::tip
如果您在内存较低的计算机上编译（例如 1GB 内存），请不要忘记 [创建交换分区](/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory)。
:::

## 下载全局配置

使用配置运行轻客户端：

从 https://ton-blockchain.github.io/global.config.json 下载主网的最新配置文件：

```bash
wget https://ton-blockchain.github.io/global.config.json
```

或从 https://ton-blockchain.github.io/testnet-global.config.json 下载测试网的配置文件：

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## FunC

要从源代码构建FunC编译器，请执行上面描述的[通用部分](/develop/howto/compile#common)，然后：

```bash
cmake --build . --target lite-client
```

要编译FunC智能合约：

```bash
./lite-client/lite-client -C global.config.json
```

如果一切安装成功，轻客户端将连接到一个特殊的服务器（TON区块链网络的完整节点）并向服务器发送一些查询。如果您向客户端指示一个可写的“数据库”目录作为额外参数，它将下载并保存与最新的主链块相对应的块和状态：

```bash
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

通过在轻客户端中输入`help`可以获得基本帮助信息。输入`quit`或按`Ctrl-C`退出。

## FunC

要从源代码编译 FunC 编译器，请执行上述 [common part](/v3/guidelines/smart-contracts/howto/compile/compile-instructions#common)，然后：

```bash
cmake --build . --target func
```

要构建tonlib-cli，请执行[通用部分](/develop/howto/compile#common)，[下载配置](/develop/howto/compile#download-global-config)，然后执行：

```bash
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

要从源代码编译 Fift 编译器，请执行上述 [common part](/v3/guidelines/smart-contracts/howto/compile/compile-instructions#common)，然后：

```bash
cmake --build . --target fift
```

要运行Fift脚本：

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

代理二进制文件将位于：

```bash
cmake --build . --target tonlib-cli
```

使用配置运行tonlib-cli：

```bash
./tonlib/tonlib-cli -C global.config.json
```

通过在tonlib-cli中输入`help`可以获得基本帮助信息。输入`quit`或按`Ctrl-C`退出。

## RLDP-HTTP-Proxy

要构建 rldp-http-proxy，请执行 [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common)、[download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config)，然后执行：

```bash
cmake --build . --target rldp-http-proxy
```

要构建storage-daemon和storage-daemon-cli，请执行[通用部分](/develop/howto/compile#common)，然后执行：

```bash
./rldp-http-proxy/rldp-http-proxy
```

## generate-random-id

要编译 generate-random-id，请执行 [common part](/v3/guidelines/smart-contracts/howto/compile/compile-instructions#common)，然后执行：

```bash
cmake --build . --target generate-random-id
```

TON版本发布：https://github.com/ton-blockchain/ton/tags

```bash
./utils/generate-random-id
```

## 在Apple M1上编译旧版本：

TON从2022年6月11日开始支持Apple M1（[添加apple m1支持 (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430)提交）。

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

二进制文件将位于：

```bash
./storage/storage-daemon/
```

# 编译旧版本的TON

TON版本发布：https://github.com/ton-blockchain/ton/tags

```bash
git clone https://github.com/ton-blockchain/ton.git
cd ton
# git checkout <TAG> for example checkout func-0.2.0
git checkout func-0.2.0
git submodule update --init --recursive 
cd ..
mkdir ton-build
cd ton-build
cmake ../ton
# build func 0.2.0
cmake --build . --target func
```

## 在Apple M1上编译旧版本：

TON从2022年6月11日开始支持Apple M1（[添加apple m1支持 (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430)提交）。

在 Apple M1 上编译 TON 旧版本：

1. 将RocksDb子模块更新到6.27.3
   ```bash
   cd ton/third-party/rocksdb/
   git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
   ```

2. 用https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt 替换根目录的`CMakeLists.txt`



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory.md
================================================
# 在低内存机器上编译TON

:::caution
本节描述了与TON进行低层级交互的说明和手册。
:::

在内存较小（小于1GB）的计算机上创建交换分片以编译TON。

## 必要条件

在Linux系统中进行C++编译时出现以下错误，导致编译中止：

```
C++: fatal error: Killed signal terminated program cc1plus compilation terminated.
```

## 解决方案

这是由于内存不足引起的，通过创建交换分片来解决。

```bash
# Create the partition path
sudo mkdir -p /var/cache/swap/
# Set the size of the partition
# bs=64M is the block size, count=64 is the number of blocks, so the swap space size is bs*count=4096MB=4GB
sudo dd if=/dev/zero of=/var/cache/swap/swap0 bs=64M count=64
# Set permissions for this directory
sudo chmod 0600 /var/cache/swap/swap0
# Create the SWAP file
sudo mkswap /var/cache/swap/swap0
# Activate the SWAP file
sudo swapon /var/cache/swap/swap0
# Check if SWAP information is correct
sudo swapon -s
```

删除交换分片的命令：

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

释放空间命令：

```bash
sudo swapoff -a
#Detailed usage: swapoff --help
#View current memory usage: --swapoff: free -m
```



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig-js.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig-js.md
================================================
---
description: 在本指南结束时，您将部署多重签名钱包并使用ton库发送一些交易
---

# 使用 TypeScript 与多重签名钱包交互

## 引言

如果您不知道TON中的多重签名钱包是什么，可以在[此处](/develop/smart-contracts/tutorials/multisig)查看。

按照以下步骤操作，您将学习如何：

- 创建并部署多重签名钱包
- 使用该钱包创建、签名并发送交易

我们将创建一个TypeScript项目，并使用[ton](https://www.npmjs.com/package/ton)库，因此您需要首先安装它。我们还将使用[ton-access](https://www.orbs.com/ton-access/)：

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

本指南的完整代码可在此处查看：

- https://github.com/Gusarich/multisig-ts-example

## 创建并部署多重签名钱包

首先创建一个源文件，例如`main.ts`。在您喜欢的代码编辑器中打开它，然后按照本指南操作！

首先我们需要导入所有重要的东西

```js
import { Address, beginCell, MessageRelaxed, toNano, TonClient, WalletContractV4, MultisigWallet, MultisigOrder, MultisigOrderBuilder } from "ton";
import { KeyPair, mnemonicToPrivateKey } from 'ton-crypto';
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

创建`TonClient`实例：

```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```

然后我们需要一些密钥对来操作：

```js
let keyPairs: KeyPair[] = [];

let mnemonics[] = [
    ['orbit', 'feature', ...], //this should be the seed phrase of 24 words
    ['sing', 'pattern',  ...],
    ['piece', 'deputy', ...],
    ['toss', 'shadow',  ...],
    ['guard', 'nurse',   ...]
];

for (let i = 0; i < mnemonics.length; i++) keyPairs[i] = await mnemonicToPrivateKey(mnemonics[i]);
```

创建`MultisigWallet`对象有两种方式：

- 从地址导入现有钱包

```js
let addr: Address = Address.parse('EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE');
let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
```

- 创建一个新的

```js
let mw: MultisigWallet = new MultisigWallet([keyPairs[0].publicKey, keyPairs[1].publicKey], 0, 0, 1, { client });
```

部署它也有两种方式

- 通过内部消息

```js
let wallet: WalletContractV4 = WalletContractV4.create({ workchain: 0, publicKey: keyPairs[4].publicKey });
//wallet should be active and have some balance
await mw.deployInternal(wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey), toNano('0.05'));
```

- 通过外部消息

```js
await mw.deployExternal();
```

## 创建、签名并发送订单

我们需要一个`MultisigOrderBuilder`对象来创建新订单。

```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```

然后我们可以向它添加一些消息。

```js
let msg: MessageRelaxed = {
    body: beginCell().storeUint(0, 32).storeBuffer(Buffer.from('Hello, world!')).endCell(),
    info: {
        bounce: true,
        bounced: false,
        createdAt: 0,
        createdLt: 0n,
        dest: Address.parse('EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx'),
        forwardFee: 0n,
        ihrDisabled: true,
        ihrFee: 0n,
        type: "internal",
        value: { coins: toNano('0.01') }
    }
};

order1.addMessage(msg, 3);
```

添加消息后，通过调用`build()`方法将`MultisigOrderBuilder`转换为`MultisigOrder`。

```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```

现在让我们创建另一个订单，向其中添加消息，使用另一组密钥对其进行签名，并合并这些订单的签名。

```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); //Now order1b have also have all signatures from order2b
```

最后，发送已签名的订单：

```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

现在构建项目

```bash
yarn tsc
```

运行编译后的文件

```bash
node main.js
```

如果没有抛出任何错误，您就做对了！现在使用任何浏览器或钱包检查您的交易是否成功。

## 其他方法和属性

您可以轻松地从`MultisigOrderBuilder`对象中清除消息：

```js
order2.clearMessages();
```

您还可以从`MultisigOrder`对象中清除签名：

```js
order2b.clearSignatures();
```

当然，您还可以从`MultisigWallet`、`MultisigOrderBuilder`和`MultisigOrder`对象中获取公共属性

- MultisigWallet：
  - `owners` - 签名的`Dictionary<number, Buffer>` *ownerId => signature*
  - `workchain` - 钱包部署的工作链
  - `walletId` - 钱包ID
  - `k` - 确认交易所需的签名数量
  - `address` - 钱包地址
  - `provider` - `ContractProvider`实例

- MultisigOrderBuilder
  - `messages` - 要添加到订单的`MessageWithMode`数组
  - `queryId` - 订单有效的全局时间

- MultisigOrder
  - `payload` - 带有订单有效载荷的`Cell`
  - `signatures` - 签名的`Dictionary<number, Buffer>` *ownerId => signature*

## 参考资料

- [低层级多重签名指南](/develop/smart-contracts/tutorials/multisig)
- [ton.js文档](https://ton-community.github.io/ton/)
- [多重签名合约源代码](https://github.com/ton-blockchain/multisig-contract)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig.md
================================================
---
description: 本教程结束时，您将在TON区块链上部署了多签合约。
---

# 如何制作一个简单的多签合约

:::caution 高级模式
这些信息是**非常低级的**。新手可能难以理解，专为希望了解 [fift](/v3/documentation/smart-contracts/fift/overview) 的高级人员设计。日常工作中不需要使用 fift。
:::

## 💡 概览

基于akifoq对原始多签合约代码的更新：

基于akifoq对原始多签合约代码的更新：

- [原始TON区块链多签代码.multisig-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig)，带有fift库以使用多签。

:::tip 初学者提示
对多签不熟悉的人可以看：[什么是多签技术？(视频)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 您将学到什么

- 如何创建和定制一个简单的多签钱包。
- 如何使用轻客户端部署多签钱包。
- 如何签署请求并以信息形式发送到区块链。

## ⚙ 设置您的环境

在我们开始之前，检查并准备您的环境。

- 从 [Installation](/v3/documentation/archive/precompiled-binaries) 部分安装 `func`、`fift`、`lite-client` 二进制文件和 `fiftlib`。
- 克隆[库](https://github.com/akifoq/multisig)并在CLI中打开其目录。

```bash
git clone https://github.com/akifoq/multisig.git
cd ~/multisig
```

## 🚀 开始吧！

1. 将代码编译为fift。
2. 准备多签所有者的密钥。
3. 部署您的合约。
4. 与区块链中部署的多签钱包进行交互。

### 编译合约

使用以下命令将合约编译为Fift：

```cpp
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```

### 创建参与者密钥

#### 创建参与者密钥

要创建一个密钥，您需要运行：

```cpp
fift -s new-key.fif $KEY_NAME$
```

- 其中`KEY_NAME`是将写入私钥的文件的名称。

例如：

```cpp
fift -s new-key.fif multisig_key
```

我们将收到一个包含私钥的`multisig_key.pk`文件。

#### 收集公钥

此外，脚本还会以以下格式发出一个公钥：

```
Public key = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

让我们将其存储在`keys.txt`文件中。每行一个公钥，这很重要。

让我们将其存储在`keys.txt`文件中。每行一个公钥，这很重要。

### 通过轻客户端部署

#### 通过轻客户端部署

例如：

例如：

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

之后，您需要运行：

```cpp
fift -s new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

- `$WALLET_ID$` - 分配给当前密钥的钱包号。对于每个使用相同密钥的新钱包，建议使用唯一的`$WALLET_ID$`。
- `$KEYS_COUNT$` - 确认所需的密钥数量，通常等于公钥数量

:::info wallet_id 解释
使用相同的密钥（Alice密钥，Bob密钥）可以创建许多钱包。如果Alice和Bob已经有treasure怎么办？这就是为什么`$WALLET_ID$`在这里至关重要。
:::

脚本将输出类似于以下的内容：

```bash
new wallet address = 0:4bbb2660097db5c72dd5e9086115010f0f8c8501e0b8fef1fe318d9de5d0e501

(Saving address to file wallet.addr)

Non-bounceable address (for init): 0QBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAbel

Bounceable address (for later access): kQBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAepg

(Saved wallet creating query to file wallet-create.boc)
```

:::info
最好保留可弹回地址 - 这是钱包的地址。
:::

:::tip
最好保留可弹回地址 - 这是钱包的地址。
:::

#### 激活您的合约

之后，您需要运行轻客户端：

之后，您需要运行轻客户端：

```bash
lite-client -C global.config.json
```

:::info 如何获取`global.config.json`？
您可以为[主网](https://ton.org/global-config.json)或[测试网](https://ton.org/testnet-global.config.json)获取最新的配置文件`global.config.json`。
:::

启动轻客户端后，最好在轻客户端控制台运行`time`命令，以确保连接成功：

```bash
time
```

之后，您需要部署钱包。运行命令：

之后，您需要部署钱包。运行命令：

```
sendfile ./wallet-create.boc
```

之后，钱包将在一分钟内准备好可供使用。

### 创建请求

#### 创建请求

首先，您需要创建一个消息请求：

```cpp
fift -s create-msg.fif $ADDRESS$ $AMOUNT$ $MESSAGE$
```

- `$ADDRESS$` - 发送代币的地址
- `$AMOUNT$` - 代币的数量
- `$MESSAGE$` - 被编译消息的文件名。

例如：

```cpp
fift -s create-msg.fif EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB 0.1 message
```

:::tip
要为您的交易添加评论，请使用`-C comment`属性。要获取更多信息，请在没有参数的情况下运行_create-msg.fif_文件。
:::

#### 选择钱包

接下来，您需要选择一个要发送代币的钱包：

```
fift -s create-order.fif $WALLET_ID$ $MESSAGE$ -t $AWAIT_TIME$
```

其中

- `$WALLET_ID$` — 是由此多签合约支持的钱包的ID。
- `$AWAIT_TIME$` — 智能合约将等待多签钱包所有者对请求签名的时间（以秒为单位）。
- `$MESSAGE$` — 上一步中创建的消息boc文件的名称。

:::info
如果在请求得到签名之前，时间等于`$AWAIT_TIME$`这样的条件已经过去了，请求将过期。通常，$AWAIT_TIME$等于几个小时（7200秒）
:::

例如：

```
fift -s create-order.fif 0 message -t 7200
```

准备好的文件将保存在`order.boc`中

:::info
`order.boc`需要与密钥持有者共享，他们必须对其进行签名。
:::

#### 签署您的部分

要签名，您需要执行：

```bash
fift -s add-signature.fif $KEY$ $KEY_INDEX$
```

- `$KEY$` - 包含签名私钥的文件的名称，不带扩展名。
- `$KEY_INDEX$` - `keys.txt`中给定密钥的索引（从零开始）

例如，对于我们的`multisig_key.pk`文件：

```
fift -s add-signature.fif multisig_key 0
```

#### 创建消息

在每个人都签署了订单后，需要将其转换为钱包的消息，并再次使用以下命令进行签名：

```
fift -s create-external-message.fif wallet $KEY$ $KEY_INDEX$
```

例如：

例如：

```
fift -s create-external-message.fif wallet multisig_key 0
```

#### 将签名发送到TON区块链

之后，您需要再次启动轻客户端：

```bash
lite-client -C global.config.json
```

最后，我们要发送我们的签名！只需运行：

```bash
sendfile wallet-query.boc
```

您做到了，哈哈！🚀🚀🚀

您做到了，哈哈！🚀🚀🚀

## 接下来

- [阅读更多关于TON中多签钱包的信息](https://github.com/akifoq/multisig)，来自akifoq。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/nominator-pool.mdx
================================================
# 如何使用提名池？

:::tip
建议在阅读本教程之前先熟悉一下 [提名池](/v3/documentation/smart-contracts/contracts-specs/nominator-pool)。
:::

## 在提名池模式下运行验证器

1. 为验证器设置硬件：需要 8 个 vCPU、128GB 内存、1TB SSD、固定 IP 地址和 1Gb/s 网速。

   为了保持网络的稳定性，建议将验证器节点分布在全球不同的地理位置，而不是集中在一个数据中心。您可以使用 [this site](https://status.toncenter.com/) 来评估不同地点的负载情况。地图显示，欧洲的数据中心利用率很高，尤其是芬兰、德国和巴黎。因此，不建议使用 Hetzner 和 OVH 等提供商。

   > 确保您的硬件符合或超过上述规格。在硬件不足的情况下运行验证器会对网络造成负面影响，并可能导致处罚。
   >
   > 请注意，自 2021 年 5 月起，Hetzner 已禁止在其服务器上挖矿，该禁令包括 PoW 和 PoS 算法。即使安装普通节点也可能被视为违反其服务条款。
   >
   > **推荐的提供商包括：** [Amazon](https://aws.amazon.com/), [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/), [Alibaba Cloud](https://alibabacloud.com/), [Latitude](https://www.latitude.sh/).

2. 按照指南 [此处](/v3/guidelines/nodes/running-nodes/full-node#install-the-mytonctrl) 所述，安装并同步**mytonctrl**。

   您还可以参考此 [Video Instruction](/v3/guidelines/nodes/running-nodes/full-node#run-a-node-video)，以获得更多帮助。

3. 向 "wl "列表中显示的验证器钱包地址转账 1  TON 。

4. 使用 `aw` 命令激活验证器钱包。

5. 激活池模式：

   ```bash
   enable_mode nominator-pool
   set stake null
   ```

6. 创建两个池（用于偶数和奇数验证轮）：

   ```bash
   new_pool p1 0 1 1000 300000
   new_pool p2 0 1 1001 300000
   ```

   其中：

   - `p1` 为池名称；
   - `0` % 是验证器的奖励份额（例如，用 40 表示 40%）；
   - `1` 是提名池中提名人的最大数量（应 \<= 40）；
   - `1000`  TON 是最小验证器质押（应 >= 1K  TON ）；
   - `300000`  TON 是最低提名人质押（应 >= 10K  TON ）；

   > (!) 池配置不一定要完全相同，您可以在一个池的最低质押额上加 1，使其有所不同。
   >
   > (!) 使用 https://tonmon.xyz/ 确定当前的最小验证器质押。

7. 键入 `pools_list` 显示池地址：

   ```bash
   pools_list
   Name  Status  Balance  Address
   p1    empty   0        0f98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780qIT
   p2    empty   0        0f9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV5jL
   ```

8. 向每个池发送 1  TON 并激活池：

   ```bash
   mg validator_wallet_001 0f98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780qIT 1
   mg validator_wallet_001 0f9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV5jL 1
   activate_pool p1
   activate_pool p2
   ```

9. 键入 `pools_list` 显示池：

   ```bash
   pools_list
   Name  Status  Balance      Address
   p1    active  0.731199733  kf98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780v_W
   p2    active  0.731199806  kf9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV8UO
   ```

10. 通过链接 "https://tonscan.org/nominator/{address_of_pool}" 打开每个池，并验证池配置。

11. 继续将验证器存入每个池：

    ```bash
    deposit_to_pool validator_wallet_001 <address_of_pool_1> 1005
    deposit_to_pool validator_wallet_001 <address_of_pool_2> 1005
    ```

   在这些命令中，`1005` TON 是存款金额。请注意，资金池在处理存款时将扣除 1  TON 。

12. 继续向每个提名池交存提名人押金：

    访问池链接（来自**步骤 9**）并点击**添加质押**。
    您也可以使用 **mytonctrl**，使用以下命令存款：

    ```bash
    mg nominator_wallet_001 <address_of_pool_1> 300001 -C d
    mg nominator_wallet_001 <address_of_pool_2> 300001 -C d
    ```

> (提名人钱包必须在基链（工作链 0）中初始化。）
>
> (!) 请注意，验证者钱包和提名者钱包必须分开存储！验证者钱包应与验证者节点一起存储在服务器上，以确保处理所有系统交易。同时，提名者钱包应存储在您的冷加密货币钱包中。
>
> 要提取提名人存款，请向资金池地址发送带注释 `w` 的交易（附加 1  TON 以处理交易）。您也可以使用 **mytonctrl** 执行此操作。

13. 邀请提名者存入您的池。参与验证将自动开始。

    > (!) 确保您的验证器钱包中至少有 200  TON /月的操作费。

## 池配置

如果你打算借给自己，请使用 `new_pool p1 0 1 1000 300000`（最多 1 个提名人，0% 验证人份额）。

如果要为众多提名者创建一个奖池，可以使用类似下面的方法：`new_pool p1 40 40 10000 10000`（最多 40 个提名者，40% 验证者份额，最小参与者质押为 10K TON）。

## 将常规校验器过渡到提名器池模式

1. 输入 `set stake 0`，停止参与选举。

2. 等待选举人归还你们的质押。

3. 从 **第 4 步** 开始，继续执行 "在提名池模式下运行验证器" 下的步骤。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/shard-optimization.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/shard-optimization.mdx
================================================
# TON 分片优化

## 架构基础知识

TON 可以并行处理无数个事务。这种功能基于[无限分片范式](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm)，这意味着一旦一组验证器的负载接近其吞吐量极限，就会被分割（分片）。然后，两组验证器独立并行处理这些负载。这些拆分是确定发生的，交易是否由特定组处理取决于与交易相关的合约地址。彼此相近（共享相同前缀）的地址将在同一个分片中处理。

当信息从一个合约发送到另一个合约时，有两种可能：一种是两个合约都在同一个分片中，另一种是两个合约在不同的分片中。在前一种情况下，当前组已经拥有所有必要的数据，可以立即处理信息。在后一种情况下，信息必须从一个组路由到另一个组。为避免信息丢失或重复处理，需要进行适当的核算。具体做法是在主链区块中注册发送者分片的传出信息队列，然后接收者分片必须明确确认它已处理了该队列。这样的开销使得跨分片消息传递的速度变慢；在发送消息的区块和接收消息的区块之间至少需要一个主链区块。这种延迟通常约为 12-13 秒。

由于一个账户的交易总是在一个分片中处理，因此单个账户的每秒交易速度（TPS）是有限的。这意味着，在为新的大规模协议开发架构时，应尽量避免中心点。此外，如果一连串的交易遵循相同的路径，也不会因为分片而得到更快的处理速度：链中每个合约的 TPS 限制相同，但由于交付延迟，整个链的处理时间会更长。

在大规模系统中，延迟和吞吐量之间的权衡是区分优秀协议和卓越协议的关键。

## 要分片还是不要分片

为了改善用户体验和处理时间，协议需要了解其系统中哪些部分可以并行处理，因此应该分片以提高吞吐量，哪些部分是严格按顺序处理的，因此如果放在一个分片中，会降低延迟。

 jetton 就是吞吐量优化的一个很好的例子。由于从 A 到 B 和从 C 到 D 的转账互不依赖，因此可以并行处理。通过将所有 Jetton-wallet 随机、均匀地分布在地址空间中，我们可以在区块链上实现负载的完美分布，并在适当延迟的情况下实现每秒数百次（未来可达数千次）的吞吐量。

相反，如果另一个处理 jetton 的智能合约（比方说合约 A）在收到 jetton  X 时做了什么（而 A 的 jetton 钱包合约是 B），将合约 A 及其钱包 B 放在不同的分片中并不会提高吞吐量。事实上，每笔转账都会经过相同的地址链，每个地址都会成为瓶颈。在这种情况下，最好将 A 和 B 放在同一个分片中，从而缩短整个链的时间，以改善延迟。

## 智能合约开发人员的实用结论

如果你有一个执行业务逻辑的智能合约，可以考虑部署多个这样的合约，以享受 TON 的并行性。如果无法做到这一点，而且您的智能合约与一组预定义的其他智能合约（比方说 jetton-wallets ）交互，则可以考虑将它们放在同一个分片中。这通常可以在链外完成（通过暴力破解特定合约地址，使所有需要的 jetton-wallet 都有相邻地址），有时链上暴力破解也是可以接受的。

即将到来的节点和网络性能改进有望提高分片的吞吐量并减少交付延迟，但同时用户数量也会增加。随着越来越多的用户加入，分片优化将变得越来越重要。最终，这将成为大规模应用的一个决定性因素：用户会选择对他们来说最方便的应用，也就是延迟较低的应用。因此，不要再犹豫了，从整体网络改善的角度出发，对应用程序进行分片优化吧。现在就做！在很多情况下，这甚至比 gas 优化更重要。

## 服务的实际结论

### 存款

如果您希望存款速度高于每秒 30 笔转账，建议您拥有多个地址，这样您就可以并行接受存款，享受高吞吐量。如果您知道用户将从哪个地址入金，例如通过 TON Connect 发起的交易，请选择离用户钱包地址最近的入金地址。用于选择最近地址的现成 Typescript 代码可以如下所示：

```typescript

import { Address } from '@ton/ton';

function findMatchingBits (a: number, b: number, start_from: number) {
    let bitPos    = start_from;
    let keepGoing = true;
    do {
        const bitCount = bitPos + 1;
        const mask     = (1 << (bitCount)) - 1;
        const shift    = 8 - bitCount;
        if(((a >> shift) & mask) == ((b >> shift) & mask)) {
            bitPos++;
        }
        else {
            keepGoing = false;
        }
    } while(keepGoing && bitPos < 7);

    return bitPos;
}

function chooseAddress(user: Address, contracts: Address[]) {
    const maxBytes = 32;
    let byteIdx = 0;
    let bitIdx  = 0;
    let bestMatch: Address | undefined;

    if(user.workChain !== 0) {
        throw new TypeError(`Only basechain user address allowed:${user}`);
    }
    for(let testContract of contracts) {
        if(testContract.workChain !== 0) {
            throw new TypeError(`Only basechain deposit address allowed:${testContract}`);
        }
        if(byteIdx >= maxBytes) {
            break;
        }
        if(byteIdx == 0 || testContract.hash.subarray(0, byteIdx).equals(user.hash.subarray(0, byteIdx))) {
            let keepGoing  = true;
            do {
                if(keepGoing && testContract.hash[byteIdx] == user.hash[byteIdx]) {
                    bestMatch = testContract;
                    byteIdx++;
                    bitIdx = 0;
                    if(byteIdx == maxBytes) {
                        break;
                    }
                }
                else {
                    keepGoing = false;
                    if(bitIdx < 7) {
                        const resIdx = findMatchingBits(user.hash[byteIdx], testContract.hash[byteIdx], bitIdx);
                        if(resIdx > bitIdx) {
                            bitIdx = resIdx;
                            bestMatch = testContract;
                        }
                    }
                }
            } while(keepGoing);
        }
    }
    return {
        match: bestMatch,
        prefixLength: byteIdx * 8 + bitIdx
    }
}
```

如果你希望存入 jetton ，除了创建多个存款地址外，最好还对这些地址进行分片优化：选择这样的地址，使每个存款地址与其 jetton 钱包位于同一分片。可在 [此处](https://github.com/Trinketer22/turbo-wallet) 找到此类地址的生成器。选择离用户最近的地址也是一种权宜之计。

### 提款

取款也是如此；如果您需要每秒发送大量转账，建议您拥有多个发送地址，必要时使用 jetton-wallets 对它们进行 shard 优化。

## 分片优化 101

### 向 web 2 用户解释分片

TON 区块链与其他任何区块链一样是一个网络，因此尝试用 web 2（ipv4）网络术语来解释它是有意义的。

#### 终点

在一般网络中，终端是一个物理设备，而在区块链中，终端是一个智能合约。

#### 分片

按照这种逻辑，shard 只不过是一个子网。从这个角度看，唯一不同的是，ipv4 采用的是 32 位寻址方案，而 TON 采用的是 256 位。
因此，合约地址分片前缀是合约地址的一部分，它标识了将计算所收到的信息结果的验证者群体。
从网络的角度看，很明显，同一网段上的请求会比其他网段上的请求处理得更快，对吗？
这有点像使用 CDN 将内容托管在离最终用户更近的地方，而在 TON 中，我们将合约部署在离最终用户更近的地方。

如果分片上的负载超过[一定水平](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm#algorithm-for-deciding-whether-to-split-or-merge)，分片就会分裂。这样做的目的是为承受负载的合约提供专用计算资源，并隔离其对整个网络的影响。
目前最大的分片前缀长度仅为 4 位，因此区块链从前缀 0 到 15 最多可以分成 16 个分片。

### 分片优化过程中的问题

让我们更加务实

#### 检查两个地址是否属于同一分片

由于我们知道分片前缀最多为 4 位，因此其代码片段可以如下所示：

```typescript
import { Address } from '@ton/core';
const addressA = Address.parse(...);
const addressB = Address.parse(...);

if((addressA.hash[0] >> 4) == (addressb.hash[0] >> 4)) {
  console.log("Same shard");
} else {
  console.log("Nope");
}
```

从人类的角度来看，检查地址分片的最简单方法是查看地址 [原始格式](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses#raw-address)。
可以使用 [address page](https://ton.org/address/)。
让我们以 USDT 地址为例进行测试：`EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs`。
您将看到 `0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe` 的原始表示，前 4 位基本上是第一个十六进制符号 - `b`。
现在我们知道，USDT 矿机位于 `b`（十六进制）或 `11`（十进制）分片。

### 如何将合约部署到某个分片

为了理解其工作原理，我们应该了解合约地址 [depends](/v3/documentation/smart-contracts/addresses#account-id) 是如何依赖于其代码和数据的。
从本质上讲，这是在部署时对代码和数据进行的 SHA256 加密。
因此，要在不同的分片中部署具有相同代码的合约，唯一的办法就是处理初始数据。
用于操作生成的合约地址的数据字段称为 _nonce_。
任何字段，只要能在部署后安全更新，或者不直接影响合约的执行，都可以用于此类目的。
最早使用这一原则的已知合约之一是 [vanity contract](https://github.com/ton-community/vanity-contract)。
它有一个 "salt" 数据字段，唯一的目的就是_强制_它的值，从而得到所需的地址模式。
将合约放入特定分片的方法完全相同，只是需要匹配的前缀要短得多。
最简单的例子之一就是钱包合约。

- [为不同分片创建钱包](/v3/guidelines/dapps/asset-processing/payments-processing/#wallet-creation-for-different-shards) 这篇文章说明了使用公钥作为非密钥将钱包放入特定分片的情况。
- 另一个例子是[turbo-wallet](https://github.com/Trinketer22/turbo-wallet/blob/d239c1a1ac31c7f5545c2ef3ddc909d6cbdafe24/src/lib/contracts/HighloadWalletV3.ts#L44)使用 subwalletId 实现[相同](https://github.com/Trinketer22/turbo-wallet/blob/d239c1a1ac31c7f5545c2ef3ddc909d6cbdafe24/src/lib/turboWallet.ts#L80)的目的。
  你也可以使用合约构造函数快速扩展[ShardedContract](https://github.com/Trinketer22/turbo-wallet/blob/main/src/lib/ShardedContract.ts)接口，使其成为_sharded_。

## 大规模 jetton 配送解决方案

如果您需要在数万/数十万或数百万用户中分发数据包，请查看此 [帖子](/v3/guidelines/dapps/asset-processing/mintless-jettons)。我们建议您考虑现有的经过实战检验的服务。有些服务已经过深度优化，不仅可以优化分片，而且比手工制作的解决方案更便宜：

- **免铸造 Jettons：** 当你需要在代币生成活动（TGE）期间分发代币时，你可以允许用户直接从代币钱包合约中领取预定义的空投。这种方法很便宜，不需要额外的交易，而且按需提供（只有现在需要花费代币的用户才能领取）。
- **用于 jetton  群发的Tonapi解决方案：** 允许通过直接发送到用户钱包的方式分发现有 jetton  。经过 Notcoin 和 DOGS 的实战测试（各有几百万次传输），经过优化以减少延迟、吞吐量和成本。[大量发送 jetton](https://docs.tonconsole.com/tonconsole/jettons/mass-sending)
- **去中心化申领的代币表解决方案：** 允许用户从特定的申领交易中申领 jetton （用户支付费用）。经过 Avacoin 和 DOGS 的实战测试（几百万次转账），经过优化以提高吞吐量和成本。[介绍](https://docs.tokentable.xyz/for-tvm-developers/introduction)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/single-nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/single-nominator-pool.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 使用 mytonctrl

:::tip
建议在阅读本教程之前先熟悉一下 [单一提名池](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool)。
:::

### 准备验证者

:::caution
开始前，请确保已充值并 [激活](/v3/guidelines/nodes/running-nodes/validator-node#activate-the-wallets) 验证器的钱包。
:::

1. 下载安装脚本：

```bash
MyTonCtrl> enable_mode single-nominator
```

2. 运行安装脚本：

```bash
MyTonCtrl> status_modes
Name              Status             Description
single-nominator  enabled   Orbs's single nominator pools.
```

3. 创建池

```bash
MyTonCtrl> new_single_pool <pool-name> <owner_address>
```

如果您已经创建了池，可以导入它：

```bash
MyTonCtrl> import_pool <pool-name> <pool-addr>
```

4. 创建池

```bash
MyTonCtrl> pools_list
Name       Status  Balance  Version   Address
test-pool  empty   0.0      spool_r2  kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

5. 输入 `pools_list` 以显示池地址

```bash
MyTonCtrl> activate_single_pool <pool-name>
```

现在，你可以通过 mytonctrl 像使用标准提名池一样使用这个提名池。

```bash
MyTonCtrl> pools_list
Name       Status  Balance  Version   Address
test-pool  active  0.99389  spool_r2  kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

现在，你可以通过 mytonctrl 像使用标准提名池一样使用这个提名池。

:::info
如果资金池的余额足以参加两轮投票 (`balance > min_stake_amount * 2`) ，那么 MyTonCtrl 将使用 `stake = balance / 2` 自动参加两轮投票，除非用户使用命令`set stake`手动设置质押。这种行为与使用提名池不同，但与使用验证器钱包设置质押类似。
:::

## 不使用 mytonctrl 启动

#### 从一开始就做好准备

  如果之前没有验证器，请执行以下操作：

1. [运行验证器](/participate/run-nodes/full-node)并确保同步。

#### 准备single_nominator

  如果之前没有验证器，请执行以下操作：

1. [运行验证器](/v3/guidelines/nodes/running-nodes/full-node) 并确保同步。
2. 停止验证并提取所有资金。

### 准备单一提名人

1. 安装 [nodejs](https://nodejs.org/en) v.16 及更高版本和 npm ( [详细说明](https://github.com/nodesource/distributions#debian-and-ubuntu-based-distributions) )

2. 安装 `ts-node` 和 `arg` 模块

```bash
$ sudo apt install ts-node
$ sudo npm i arg -g
```

4. 为编译器创建符号链接：

```bash
$ sudo ln -s /usr/bin/ton/crypto/fift /usr/local/bin/fift
$ sudo ln -s /usr/bin/ton/crypto/func /usr/local/bin/func
```

5. 运行测试，确保一切设置正确：

```bash
$ npm run test
```

6. 替换 mytonctrl 提名池脚本： https://raw.githubusercontent.com/orbs-network/single-nominator/main/mytonctrl-scripts/install-pool-scripts.sh

### 创建单一提名库

1. 从 Telegram [@tonapibot](https://t.me/tonapibot) 获取 Toncenter API 密钥
2. 设置环境变量：

```bash
export OWNER_ADDRESS=<owner_address>
export VALIDATOR_ADDRESS=<validator_wallet_address>
export TON_ENDPOINT=https://toncenter.com/api/v2/jsonRPC
export TON_API_KEY=<toncenter api key>
```

2. 创建部署者地址：

```bash
$ npm run init-deploy-wallet
Insufficient Deployer [EQAo5U...yGgbvR] funds 0
```

3. 为部署者地址充值 2.1 TON
4. 部署池合约，您将获得池地址：`Ef-kC0..._WLqgs`：

```
$ npm run deploy
```

5. 备份部署器私钥"./build/deploy.config.json "和 "single-nominator.addr "文件

```
$ fift -s ./scripts/fift/str-to-addr.fif Ef-kC0..._WLqgs
```

使用钱包从single_nominator提取
Fift:

6. 创建包含金额的 "withdraw.boc "申请：
7. 将 "single-nominator.addr "复制到 "mytoncore/spool/single-nominator-1.addr"。
8. 将质押从所有者地址发送至单一提名人地址

### 单一提名人的提款

使用钱包从单一提名人
Fift 提取资金：

1. 创建包含金额的 "withdraw.boc" 申请：

```bash
$ fift -s ./scripts/fift/withdraw.fif <withdraw_amount>
```

2. 从所有者的钱包创建和签署请求：

```bash
$ fift -s wallet-v3.fif <my-wallet> <single_nominator_address> <sub_wallet_id> <seqno> <amount=1> -B withdraw.boc
```

3. 广播查询：

```bash
$ lite-client -C global.config.json -c 'sendfile wallet-query.boc'
tons
```

1. 创建包含金额的 "withdraw.boc" 申请：

```bash
$ fift -s ./scripts/fift/withdraw.fif <withdraw_amount>
```

2. 将申请发送至单一提名人地址：

a.

```bash
$ tons wallet transfer <my-wallet> <single_nominator_address> <amount=1> --body withdraw.boc
tonkeeper
```

b.

```
npm link typescript
```

c.

```
npx ts-node scripts/ts/withdraw-deeplink.ts <single-nominator-addr> <withdraw-amount>
```

d. 打开机主手机上的 deeplink

## 存款池

您可以使用 **MyTonCtrl**，使用以下命令存款：

```sh
MyTonCtrl> mg <from-wallet-name> <pool-account-addr> <amount>
```

或

```sh
MyTonCtrl> deposit_to_pool <pool-addr> <amount>
```

从验证器钱包中存入资金池。

或者使用以下步骤：

1. 请访问池的网页 https://tonscan.org/nominator/{pool_address}。

2. 确保完全显示池的相关信息，如果池中的智能合约不对，就不会有任何信息。

3. 按 `ADD STAKE` 按钮，或使用 Tonkeeper 或任何其他 TON 钱包扫描 QR 码。

4. 转入钱包后，请输入 TON 的金额，然后发送交易。之后，TON 币将被添加到质押中。

如果钱包没有自动打开，您可以通过复制池地址手动发送交易。通过任何 TON 钱包发送。从发送的交易中，将扣除 1 TON 作为处理存款的佣金。

## 提取资金

您还可以使用以下命令提取资金：

```sh
MyTonCtrl> withdraw_from_pool <pool-addr> <amount>
```

您也可以手动创建和发送交易：

<Tabs groupId="code-examples">
<TabItem value="toncore" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const single_nominator_address = Address.parse('single nominator address');
    const WITHDRAW_OP = 0x1000
    const amount = 50000

    const messageBody = beginCell()
        .storeUint(WITHDRAW_OP, 32) // op code for withdrawal
        .storeUint(0, 64)           // query_id
        .storeCoins(amount)         // amount to withdraw
        .endCell();

    const internalMessage = internal({
        to: single_nominator_address,
        value: toNano('1'),
        bounce: true,
        body: messageBody
    });
}
```

</TabItem>

<TabItem value="tonconnect" label="Golang">

```go
func WithdrawSingleNominatorMessage(single_nominator_address string, query_id, amount uint64) (*tonconnect.Message, error) {

	const WITHDRAW_OP = 0x1000

	payload, _ := cell.BeginCell().
		MustStoreUInt(WITHDRAW_OP, 32). // op code for withdrawal
		MustStoreUInt(query_id, 64).    // query_id
		MustStoreCoins(amount).         // amount to withdraw
		EndCell().MarshalJSON()

	msg, err := tonconnect.NewMessage(
		single_nominator_address,
		tlb.MustFromTON("1").Nano().String(), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

</TabItem>

</Tabs>

## 选举过程

### 建立单一提名库

使用 [如下](/v3/guidelines/smart-contracts/howto/single-nominator-pool#set-up-single-nominator) 说明配置单一提名人资料库合约。

### 参加选举

[存款](/v3/guidelines/smart-contracts/howto/single-nominator-pool#deposit-pool) 向单一提名人奖池注入的最低投注额。

**MyTonCtrl** 将自动加入选举。您可以设置 mytonctrl 发送给 [Elector 合约](/v3/documentation/smart-contracts/contracts-specs/governance#elector) 的质押金额 ~ 在 Mainnet 上每 18 小时发送一次，在 Testnet 上每 2 小时发送一次。

```sh
MyTonCtrl> set stake 90000
```

使用 `status` 命令可以找到**最低质押**金额。

![](/img/docs/single-nominator/tetsnet-conf.png)

您可以将 `stake` 设置为 `null`，它将根据 `stakePercent` 值计算（可以用 `status_settings` 命令检查）。

可以查看选举是否已经开始：

```bash
MyTonCtrl> status
```

和 Testnet：

```bash
MyTonCtrl> status fast
```

例如

![](/img/docs/single-nominator/election-status.png)

如果选举已经开始，且单提名池已激活，验证器应在下一轮选举开始时**自动**向选举人合约发送**选举人新投票**信息。

检查验证器钱包：

```sh
MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  995.828585374     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
```

然后查看交易记录：

```sh
MyTonCtrl> vas kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
Address                                           Status  Balance        Version
kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct  active  995.828585374  v1r3

Code hash
c3b9bb03936742cfbb9dcdd3a5e1f3204837f613ef141f273952aa41235d289e

Time                 Coins   From/To
39 minutes ago  >>>  1.3     kf_hz3BIXrn5npis1cPX5gE9msp1nMTYKZ3l4obzc8phrBfF
```

在 Tonviewer 的单一提名人合约历史记录中，该 **ElectorNewStake** 交易：

![](/img/docs/single-nominator/new-stake.png)

在上述示例中，**MyTonCtrl** 会自动在 Elector 合约上投入 90000 个 Toncoin 。

### 检查校验器状态

在下一轮开始时，使用 `status` 命令（Testnet 上的 `status fast` 命令）检查 **MyTonCtrl** 验证器的状态。

![](/img/docs/single-nominator/status-validator.png)

您可以通过检查以下条件来确认您的节点是否已成为完全验证器：

1. ** 验证器效率** - 本地验证器的效率应为绿色，而不是 "n/a"。
2. ** 验证器索引** - 验证器索引应大于-1。

### 检查利润

在回合结束时，**MyTonCtrl** 向选举人合约发送 **ElectorRecoverStakeRequest** 消息。它将向您的单个提名人池回复 `stake + profit` 数额的 Toncoin 。

![](/img/docs/single-nominator/validator-profit.png)

您还可以使用 `vas` 命令查看池的事务历史记录：

![](/img/docs/single-nominator/validator-profit-vas.png)

### 停止参与

如果用户不想再参与验证：

1. 禁用验证模式：

```bash
MyTonCtrl> disable_mode validator
```

2. [提取](/v3/guidelines/smart-contracts/howto/single-nominator-pool#withdraw-funds) 单一提名人合约中的所有资金到所有者钱包。

## 将常规校验器过渡到提名器池模式

1. 禁用 "验证器 "模式，停止参与选举。
2. 等待选举人归还你们的质押。
3. 执行以下 [步骤](/v3/guidelines/smart-contracts/howto/single-nominator-pool#set-up-single-nominator) 。

## 单一提名池客户端

- 有一个简单的开源客户端可用于部署合约并与之交互 - https://github.com/orbs-network/single-nominator-client
- 如果遇到困难，可以通过 [Telegram](https://t.me/single_nominator) 向团队寻求支持。

## 使用 Vesting 合约运行单个提名池。

从一开始，归属合约的所有者就可以用自己的钱包合约来管理它。
在此方案中，我们将管理多个合约的交互。

| 合约                      | 管理界面                                        |
| ----------------------- | ------------------------------------------- |
| `validator_wallet`      | Mytonctrl                                   |
| `vesting`               | [vesting.ton.org](https://vesting.ton.org/) |
| `owner_wallet`          | 应用程序，例如：Tonkeeper、MyTonWallet               |
| `single_nominator_pool` | MyTonctrl                                   |

- `owners_wallet` - 拥有 `vesting` 的TON Wallet

:::caution
请确保您已完全备份了 Vesting `owner_wallet` 的恢复解析。一旦 `owner_wallet` 的访问权限丢失，管理 `vesting` 资金的访问权限也会丢失，并且无法恢复。
:::

1. 运行全节点，等待同步节点。
2. 启用验证器模式，获取安装时创建的 wallet_v1 地址 - 通过 `Mytonctrl wl` 获取。
3. 向 `validator_wallet` 发送 200  TON （每月支出）。
4. 创建 `single_nominator_pool`：

```bash
MyTonCtrl> new_single_pool <pool-name> <vesting>
```

例如

```
MyTonCtrl> new_single_pool my_s_pool EQD...lme-D
```

5. 激活 `single_nominator_pool`：

```bash
MyTonCtrl> activate_single_pool <pool-name>
```

例如

```
MyTonCtrl> activate_single_pool my_s_pool
```

6. 收到链上的 `single_nominator_pool` 地址后，请求将向您发送 Vesting 合约的 `single_nominator_pool` 人员列入白名单。
7. 一旦您的 `single_nominator_pool` 列入白名单，您就可以通过 [vesting.ton.org](https://vesting.ton.org/) 从 `vesting` 合约向 `single_nominator_pool` 发送锁定的代币。
   - a.在 [vesting.ton.org](https://vesting.ton.org/) 连接 `owner_wallet` 
   - b.从 `vesting` 中进行测试存款 向 `single_nominator_pool` 发送 10  TON 。
   - c.从[vesting.ton.org](https://vesting.ton.org/)接口将剩余(~8 TON)资金返还给 "vesting"，并发送信息 [金额为 0，注释为`w`]。
   - d.确保您已收到 `vesting` 中的剩余资金。
8. 将两个周期所需的 TON 数从 `vesting` 合约转入 `single_nominator_pool`。
9. 等待验证者投票。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/wallet.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/wallet.md
================================================
---
description: 在本教程中，您将学习如何完全使用钱包、交易和智能合约进行工作。
---

import Tabs from'@theme/Tabs';
import TabItem from'@theme/TabItem';

# 使用钱包智能合约的工作

## 👋 介绍

在开始智能合约开发之前，学习 TON 上的钱包和交易如何工作是必不可少的。这些知识将帮助开发者了解钱包、交易和智能合约之间的交互，以实现特定的开发任务。

:::tip
建议在阅读本教程之前先熟悉一下 [钱包合约类型](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) 一文。
:::

在本节中，我们将学习如何创建操作，而不使用预配置的函数，以了解开发工作流程。本教程的所有必要参考资料都位于参考章节。

## 💡 必要条件

本教程要求掌握 JavaScript 和 TypeScript 或 Golang 的基本知识。此外，还需要持有至少 3 TON（可以存储在交易所账户、非托管钱包或使用 Telegram 机器人钱包）。要理解本教程，需要对 [cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage)、[address in TON](/v3/documentation/smart-contracts/addresses)、[blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)有基本了解。

:::info 主网开发至关重要
在 TON 测试网上工作往往会导致部署错误、难以跟踪交易以及不稳定的网络功能。因此，完成大部分开发工作时间可能好处是建议在 TON Mainnet 上完成，以避免这些问题，这可能需要减少交易数量，从而可能减小费用。
:::

## 源代码

本教程中使用的所有代码示例都可以在以下 [GitHub 存储库](https://github.com/aSpite/wallet-tutorial) 中找到。

## ✍️ 您开始所需的内容

- 确保 NodeJS 已安装。
- 需要特定的 Ton 库，包括：@ton/ton 13.5.1+、@ton/core 0.49.2+ 和 @ton/crypto 3.2.0+。

\*\* 可选\*\*：如果您喜欢使用 Go 而不是 JS，则必须安装 [tonutils-go](https://github.com/xssnick/tonutils-go) 库和 GoLand IDE 才能在 TON 上进行开发。本教程将在 GO 版本中使用该库。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```bash
npm i --save @ton/ton @ton/core @ton/crypto
```

</TabItem>
<TabItem value="go" label="Golang">

```bash
go get github.com/xssnick/tonutils-go
go get github.com/xssnick/tonutils-go/adnl
go get github.com/xssnick/tonutils-go/address
```

</TabItem>
</Tabs>

## ⚙ 设置您的环境

为了创建一个 TypeScript 项目，必须按照以下步骤进行操作：

1. 创建一个空文件夹（我们将其命名为 WalletsTutorial）。
2. 使用 CLI 打开项目文件夹。
3. 使用以下命令来设置项目：

```bash
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init --rootDir src --outDir build \ --esModuleInterop --target es2020 --resolveJsonModule --lib es6 \ --module commonjs --allowJs true --noImplicitAny false --allowSyntheticDefaultImports true --strict false
```

:::info
为了帮助我们完成下一个流程，我们使用了 `ts-node` 来直接执行 TypeScript 代码，而无需预编译。当检测到目录中的文件更改时，`nodemon` 会自动重新启动节点应用程序。
:::

```json
  "files": [
    "\\",
    "\\"
  ]
```

5. 然后，在项目根目录中创建 `nodemon.json` 配置文件，内容如下：

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```

6. 在 `package.json` 中添加以下脚本到 "test" 脚本的位置：

```json
"start:dev": "npx nodemon"
```

7. 在项目根目录中创建 `src` 文件夹，然后在该文件夹中创建 `index.ts` 文件。
8. 接下来，添加以下代码：

```ts
async function main() {
  console.log("Hello, TON!");
}

main().finally(() => console.log("Exiting..."));
```

9. 使用终端运行以下代码：

```bash
npm run start:dev
```

10. 最后，控制台将输出以下内容。

![](/img/docs/how-to-wallet/wallet_1.png)

:::tip Blueprint
TON 社区创建了一个优秀的工具来自动化所有开发过程（部署、合约编写、测试）称为 [Blueprint](https://github.com/ton-org/blueprint)。然而，我们在本教程中不需要这么强大的工具，所以建议遵循上述说明。
:::

**可选:** 当使用 Golang 时，请按照以下说明进行操作：

1. 安装 GoLand IDE。
2. 使用以下内容创建项目文件夹和 `go.mod` 文件（如果使用的当前版本已过时，则可能需要更改 Go 版本）：

```
module main

go 1.20
```

3. 在终端中输入以下命令：

```bash
go get github.com/xssnick/tonutils-go
```

4. 在项目根目录中创建 `main.go` 文件，内容如下：

```go
package main

import (
	"log"
)

func main() {
	log.Println("Hello, TON!")
}
```

5. 将 `go.mod` 中的模块名称更改为 `main`。
6. 运行上述代码，直到在终端中显示输出。

:::info
也可以使用其他 IDE，因为 GoLand 不是免费的，但建议使用 GoLand。
:::

:::warning 注意

另外，下面的每个新部分将指定每个新部分所需的特定代码部分，并且需要将新的导入与旧导入合并起来。\
:::

## 🚀 让我们开始！

我们的主要任务是使用 @ton/ton、@ton/core、@ton/crypto 的各种对象和函数构建交易，以了解大规模交易是怎样的。为了完成这个过程，我们将使用两个主要的钱包版本（v3 和 v4），因为交易所、非托管钱包和大多数用户仅使用这些特定版本。

我们的主要任务是使用 @ton/ton、@ton/core、@ton/crypto（ExternalMessage、InternalMessage、Signing 等）的各种对象和函数构建消息，以了解消息在更大范围内的样子。为了完成这一过程，我们将使用两个主要的钱包版本（v3 和 v4），因为事实上交易所、非托管钱包和大多数用户都只使用这些特定版本。

:::note
There may be occasions in this tutorial when there is no explanation for particular details. In these cases, more details will be provided in later stages of this tutorial.

**重要:** 在本教程中，我们使用了 [wallet v3 代码](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) 来更好地理解钱包开发过程。需要注意的是，v3 版本有两个子版本：r1 和 r2。目前，只使用第二个版本，这意味着当我们在本文档中提到 v3 时，它指的是 v3r2。
:::

## 💎 TON 区块链钱包

在 TON 区块链上运行的所有钱包实际上都是智能合约，与 TON 上的一切都是智能合约的方式相同。与大多数区块链一样，可以在网络上部署智能合约并根据不同的用途自定义它们。由于这个特性，**完全自定义的钱包是可能的**。
在 TON 上，钱包智能合约帮助平台与其他智能合约类型进行通信。然而，重要的是要考虑钱包通信是如何进行的。

### 钱包通信

一般来说，TON区块链上有两种消息类型： `internal` 和  `external` 。外部消息允许从外部世界向区块链发送消息，从而允许与接受此类消息的智能合约进行通信。负责执行这一过程的功能如下：

```func
() recv_external(slice in_msg) impure {
    ;; some code
}
```

在深入了解有关钱包的更多细节之前，我们先来看看钱包是如何接受外部信息的。在 TON 上，所有钱包都持有所有者的 "公钥 (public key)"、"序列号 (seqno)"和 "子钱包 ID (subwallet_id)"。收到外部信息时，钱包会使用 `get_data()` 方法从钱包的存储部分检索数据。然后，它会执行几个验证程序，并决定是否接受信息。这个过程如下：

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));  ;; get rest values from the message body
  throw_if(35, valid_until <= now()); ;; check the relevance of the message
  var ds = get_data().begin_parse(); ;; get data from storage and convert it into a slice to be able to read values
  var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256)); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds variable
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  accept_message();
```

> 💡 有用的链接:
>
> [文档中的"load_bits()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> [文档中的"get_data()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> [文档中的"begin_parse()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> [文档中的"end_parse()"](/v3/documentation/smart-contracts/func/docs/stdlib/#end_parse)
>
> [文档中的"load_int()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> [文档中的"load_uint()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> [文档中的"check_signature()"](/v3/documentation/smart-contracts/func/docs/stdlib/#check_signature)
>
> [文档中的"slice_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
>
> [文档中的"accept_message()"](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects)

接下来，我们来详细看一下。

### 重放保护 - Seqno

钱包智能合约中的消息重放保护与消息序列号（seqno，Sequence Number）直接相关，该序列号可追踪消息的发送顺序。钱包中的单条信息不能重复发送，这一点非常重要，因为这会完全破坏系统的完整性。如果我们进一步检查钱包内的智能合约代码，`seqno` 通常会按以下方式处理：

```func
throw_unless(33, msg_seqno == stored_seqno);
```

上面这行代码检查消息中的 `seqno` 并与存储在智能合约中的 `seqno` 进行核对。如果两者不匹配，合约就会返回一个带有 `33 exit code` 的错误。因此，如果发送者传递了无效的 seqno，这意味着他在信息序列中犯了某些错误，而合约可以防止这种情况发生。

:::note
还需要确认外部消息可以由任何人发送。这意味着如果您向某人发送 1 TON，其他人也可以重复该消息。但是，当 seqno 增加时，以前的外部消息失效，并且没有人可以重复该消息，从而防止窃取您的资金。
:::

### 签名

要执行此过程，首先钱包需要从传入消息中获取签名，从存储中加载公钥，并使用以下过程验证签名：

要执行此过程，首先钱包需要从传入消息中获取签名，从存储中加载公钥，并使用以下过程验证签名：

```func
var signature = in_msg~load_bits(512);
var ds = get_data().begin_parse();
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
```

如果所有验证流程都顺利完成，智能合约接受消息并对其进行处理：

```func
accept_message();
```

:::info accept_message()
由于消息来自外部世界，它不包含支付交易费用所需的 Toncoin。在使用 accept_message() 函数发送 TON 时，应用gas_credit（在写入时其值为10,000 gas单位），并且只要gas不超过 gas_credit 值，就允许免费进行必要的计算。使用 accept_message() 函数后，从智能合约的账户余额中收取所有已花费的gas（以 TON 计）。可以在[此处](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects)了解有关此过程的更多信息。
:::

### 交易过期

用于检查外部报文有效性的另一个步骤是 `valid_until` 字段。从变量名可以看出，在 UNIX 中，这是报文生效前的时间。如果验证过程失败，合约将完成事务处理，并返回如下的 35 退出码：

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
throw_if(35, valid_until <= now());
```

当信息不再有效，但由于不明原因仍被发送到区块链上时，这种算法可以防止出现各种错误。

### 钱包 v3 和钱包 v4 的区别

钱包 v3 和钱包 v4 之间的唯一区别是钱包 v4 使用可以安装和删除的 `插件`。插件是特殊的智能合约，可以从钱包智能合约请求在特定时间从指定数量的 TON 中。钱包智能合约将相应地发送所需数量的 TON，而无需所有者参与。这类似于为插件创建的 **订阅模型**。我们不会在本教程中详细介绍这些细节，因为这超出了本教程的范围。

正如我们之前讨论的那样，钱包智能合约接受外部交易，验证它们，如果通过了所有检查，则接受它们。然后，合约开始从外部消息的主体中检索消息，然后创建内部消息并将其发送到区块链，如下所示：

### 钱包如何促进与智能合约的通信

正如我们前面所讨论的，钱包智能合约会接受外部信息，对其进行验证，并在所有检查都通过的情况下接受它们。然后，合约开始从外部信息正文中检索信息的循环，然后创建内部信息并将其发送到区块链，如下所示：

```func
cs~touch();
while (cs.slice_refs()) {
    var mode = cs~load_uint(8); ;; load message mode
    send_raw_message(cs~load_ref(), mode); ;; get each new internal message as a cell with the help of load_ref() and send it
}
```

:::tip touch()
在 TON 上，所有智能合约都在基于堆栈的 TON 虚拟机（TVM）上运行。~ touch() 将变量 `cs` 放在栈顶，以优化代码运行，减少 gas 。
:::

由于一个 cell 中 **最多可存储 4 个引用**，因此每个外部信息最多可发送 4 个内部信息。

> 💡 Useful links:
>
> [文档中的 "slice_refs()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)
>
> [文档中的 "send_raw_message() 和消息模式"](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)
>
> [文档中的 "load_ref()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_ref)

## 📬 外部和内部信息

在本节中，我们将进一步了解  `internal` 和  `external` 消息，并创建消息和将其发送到网络，以尽量减少使用预制函数。

这样，Tonkeeper 钱包应用程序将部署钱包合约，我们可以在以下步骤中使用它。

1. 安装 [钱包应用程序](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps) （例如，作者使用的是 Tonkeeper）
2. 将钱包应用程序切换到 v3r2 地址版本
3. 向钱包存入 1  TON
4. 将信息发送到另一个地址（可以发送给自己，发送到同一个钱包）。

这样，Tonkeeper 钱包应用程序就会部署钱包合约，我们就可以在下面的步骤中使用它了。

:::note
在编写本教程时，TON 上的大多数钱包应用程序默认使用钱包 v4 版本。本教程不需要插件，我们将使用钱包 v3 提供的功能。在使用过程中，Tonkeeper 允许用户选择所需的钱包版本。因此，建议部署钱包版本 3（钱包 v3）。
:::

### TL-B

在本节中，我们将详细研究 [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)。在将来的开发中，此文件将非常有用，因为它描述了不同cell的组装方式。在我们的情况下，它详细描述了内部和外部交易的复杂性。

在本节中，我们将研究 [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)。该文件将在未来的开发过程中非常有用，因为它描述了不同 cell 应如何组装。具体到我们的例子，它详细说明了内部和外部信息的复杂性。

:::info
本指南将提供基本信息。如需了解更多详情，请参阅我们的 TL-B [文档](/v3/documentation/data-formats/tlb/tl-b-language)，了解有关 TL-B 的更多信息。
:::

### CommonMsgInfo

您可以从 [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128) 中看到，**仅在与 ext_in_msg_info 类型一起使用时才可以使用 CommonMsgInfo**。因为交易类型字段，如 `src`、`created_lt`、`created_at` 等，由验证者在交易处理期间进行重写。在这种情况下，`src` 交易类型最重要，因为当发送交易时，发送者是未知的，验证者在验证期间对其在 `src` 字段中的地址进行重写。这样确保 `src` 字段中的地址是正确的，并且不能被操纵。

但是，`CommonMsgInfo` 结构仅支持 `MsgAddress` 规格，但通常情况下发送方的地址是未知的，并且需要写入 `addr_none`（两个零位 `00`）。在这种情况下，使用 `CommonMsgInfoRelaxed` 结构，该结构支持 `addr_none` 地址。对于 `ext_in_msg_info`（用于传入的外部消息），使用 `CommonMsgInfo` 结构，因为这些消息类型不使用sender，始终使用 [MsgAddressExt](https://hub.com/ton/ton.blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100) 结构（`addr_none$00` 表示两个零位），因此无需覆盖数据。

[查看 TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128)，您会注意到**当与 ext_in_msg_info 类型**一起使用时，只有 CommonMsgInfo 可用。这是因为诸如 `src`、`created_lt`、`created_at` 等消息字段会在事务处理过程中被验证器重写。在这种情况下，消息中的 `src` 字段最为重要，因为在发送消息时，发件人是未知的，验证程序在验证时会写入该字段。这样可以确保 `src` 字段中的地址是正确的，不会被篡改。

但是，`CommonMsgInfo` 结构只支持 `MsgAddress` 规格，但发件人地址通常是未知的，因此需要写入 "addr_none"（两个零位 "00"）。在这种情况下，使用支持 `addr_none` 地址的 `CommonMsgInfoRelaxed` 结构。对于 `ext_in_msg_info`（用于传入的外部报文），则使用 `CommonMsgInfo` 结构，因为这些消息类型不使用 sender，始终使用[MsgAddressExt](https://hub.com/ton/ton.blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100) 结构（`addr_none$00` 表示两个零位），这意味着无需覆盖数据。

:::note
`$`符号后面的数字是在某个结构的开始处所要求存储的位，以便在读取时（反序列化）可进一步识别这些结构。
:::

### 创建内部信息

让我们首先考虑 `0x18` 和 `0x10`（x - 16 进制），这些十六进制数是按以下方式排列的（考虑到我们分配了 6 个位）：`011000` 和 `010000`。这意味着，可以将上述代码重写为以下内容：

```func
var msg = begin_cell()
  .store_uint(0x18, 6) ;; or 0x10 for non-bounce
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  ;; store something as a body
```

现在我们来详细解释每个选项：

```func
var msg = begin_cell()
  .store_uint(0, 1) ;; this bit indicates that we send an internal message according to int_msg_info$0  
  .store_uint(1, 1) ;; IHR Disabled
  .store_uint(1, 1) ;; or .store_uint(0, 1) for 0x10 | bounce
  .store_uint(0, 1) ;; bounced
  .store_uint(0, 2) ;; src -> two zero bits for addr_none
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  ;; store something as a body
```

现在，让我们详细了解每个选项：

|      选项      |                                                                                                                                           说明                                                                                                                                           |
| :----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| IHR Disabled | 目前，由于即时超立方路由（Instant Hypercube Routing）尚未完全实现，因此该选项被禁用（即存储 1）。此外，当网络上有大量 [Shardchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards) 时，也需要使用该选项。有关禁用 IHR 选项的更多信息，请参阅 [tblkch.pdf](https://ton.org/tblkch.pdf)（第 2 章）。 |
|    Bounce    |                              在发送信息时，智能合约处理过程中可能会出现各种错误。为避免损失 TON，有必要将 Bounce 选项设置为 1（true）。在这种情况下，如果在交易处理过程中出现任何合约错误，信息将被退回给发送方，同时会收到扣除费用后的相同数量的 TON。关于不可反弹报文的更多信息，请参阅 [此处](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)。                             |
|    Bounced   |                                                                                                                   退回信息是指由于智能合约处理交易时发生错误而退回给发件人的信息。该选项会告诉你收到的信息是否被退回。                                                                                                                   |
|      Src     |                                                                                                                     Src 是发件人地址。在这种情况下，会写入两个 0 位来表示 `addr_none` 地址。                                                                                                                     |

最后，我们来看剩下的代码行：

```func
...
.store_slice(to_address)
.store_coins(amount)
...
```

- 我们指定收件人和要发送的 TON 数。

上述值（包括 Src）具有以下特征，但不包括 State Init 和 Message Body 位，由验证者重写。

```func
...
  .store_uint(0, 1) ;; Extra currency
  .store_uint(0, 4) ;; IHR fee
  .store_uint(0, 4) ;; Forwarding fee
  .store_uint(0, 64) ;; Logical time of creation
  .store_uint(0, 32) ;; UNIX time of creation
  .store_uint(0, 1) ;; State Init
  .store_uint(0, 1) ;; Message body
  ;; store something as a body
```

|            选项            |                                                                       说明                                                                      |
| :----------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|      Extra currency      |                                                           这是现有 jetton 的本机实现，目前尚未使用。                                                           |
|          IHR fee         | 如前所述，目前 IHR 尚未启用，因此该费用始终为零。您可以在 [tblkch.pdf](https://ton.org/tblkch.pdf)（第 3.1.8 节）中了解更多相关信息。 |
|      Forwarding fee      |                转发信息费用。更多信息请参阅[费用文档](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#transactions-and-phases)。               |
| Logical time of creation |                                                                 用于创建正确信息队列的时间。                                                                |
|   UNIX time of creation  |                                                                信息在 UNIX 中创建的时间。                                                               |
|        State Init        |               部署智能合约的代码和源代码。如果该位被设置为 `0`，则表示我们没有 State Init。但如果该位被设置为 `1`，则需要写入另一位，该位表示 State Init 是存储在同一 cell 中（0）还是作为引用写入（1）。               |
|       Message body       |                   这部分定义了如何存储报文正文。有时，信息正文太大，无法放入信息本身。在这种情况下，应将其存储为 **引用**，将该位设置为 `1` ，表示正文被用作引用。如果该位为 `0`，则正文与信息存放在同一 cell 中。                  |

接下来，我们将开始准备一个交易，该交易将向另一个钱包 v3 发送 Toncoins。首先，假设用户想要向自己发送 0.5 TON，并附带文本“**你好，TON！**”，请参阅本文档的这一部分来了解[如何发送带有评论的消息](/develop/func/cookbook#how-to-send-a-simple-message)。

:::note
如果数字值适合的比特数少于指定的比特数，那么缺失的零将被添加到数值的左边。例如，0x18 适合 5 位 -> `11000`。但是，由于指定的是 6 位，最终结果就变成了 `011000`。
:::

接下来，我们开始准备一条消息，将 Toncoin 发送到另一个钱包 v3。
首先，假设用户想给自己发送 0.5 TON，并附上文字  "**Hello, TON!**"，请参考我们文档中的这部分内容（[如何发送带注释的消息](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-simple-message)）。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from '@ton/core';

let internalMessageBody = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32). // write 32 zero bits to indicate that a text comment will follow
  MustStoreStringSnake("Hello, TON!"). // write our text comment
  EndCell()
```

</TabItem>
</Tabs>

上面我们创建了一个 `InternalMessageBody`（内部消息体），消息的正文就存储在其中。请注意，当存储的文本不适合单个 cell （1023 位）时，有必要**根据 [以下文档](/v3/documentation/smart-contracts/message-management/internal-messages) 将数据分割成多个 cell**。不过，在这种情况下，高级库会根据要求创建 cell ，因此现阶段无需担心这个问题。

接下来，我们将根据之前研究的信息创建 `内部消息`（InternalMessage），具体如下：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { toNano, Address } from '@ton/ton';

const walletAddress = Address.parse('put your wallet address');

let internalMessage = beginCell()
  .storeUint(0, 1) // indicate that it is an internal message -> int_msg_info$0
  .storeBit(1) // IHR Disabled
  .storeBit(1) // bounce
  .storeBit(0) // bounced
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress)
  .storeCoins(toNano("0.2")) // amount
  .storeBit(0) // Extra currency
  .storeCoins(0) // IHR Fee
  .storeCoins(0) // Forwarding Fee
  .storeUint(0, 64) // Logical time of creation
  .storeUint(0, 32) // UNIX time of creation
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(internalMessageBody) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

walletAddress := address.MustParseAddr("put your address")

internalMessage := cell.BeginCell().
  MustStoreUInt(0, 1). // indicate that it is an internal message -> int_msg_info$0
  MustStoreBoolBit(true). // IHR Disabled
  MustStoreBoolBit(true). // bounce
  MustStoreBoolBit(false). // bounced
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress).
  MustStoreCoins(tlb.MustFromTON("0.2").NanoTON().Uint64()).   // amount
  MustStoreBoolBit(false). // Extra currency
  MustStoreCoins(0). // IHR Fee
  MustStoreCoins(0). // Forwarding Fee
  MustStoreUInt(0, 64). // Logical time of creation
  MustStoreUInt(0, 32). // UNIX time of creation
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

### 创建信息

有必要检索我们钱包智能合约的 `seqno`（序列号）。为此，需要创建一个 `Client`，用来发送请求，运行钱包的获取方法 `seqno`。此外，还需要添加一个种子短语（在创建钱包 [此处](#--external-and-internal-messages) 时保存），以便通过以下步骤签署我们的信息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC", // you can replace it on https://testnet.toncenter.com/api/v2/jsonRPC for testnet
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "strings"
)

mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection) // create client

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

// The next three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. With the tonutils-go library, this is all implemented, but we’re doing it again to get a full understanding.
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys

privateKey := ed25519.NewKeyFromSeed(k)
```

</TabItem>
</Tabs>

因此，需要发送 `seqno`、`keys` 和 `internal message`。现在，我们需要为钱包创建一个 [消息](/v3/documentation/smart-contracts/message-management/sending-messages)，并按照教程开头使用的序列将数据存储在该消息中。具体步骤如下

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id | We consider this further
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32) // store seqno
  .storeUint(3, 8) // store mode of our internal message
  .storeRef(internalMessage); // store our internalMessage as a reference

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "time"
)

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // Message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32). // store seqno
  MustStoreUInt(uint64(3), 8). // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()
```

</TabItem>
</Tabs>

要从外部世界将任何内部消息传递到区块链中，需要将其包含在外部交易中发送。正如我们之前讨论的那样，仅需要使用 `ext_in_msg_info$10` 结构，因为目标是将外部消息发送到我们的合约中。现在，我们创建一个外部消息，将发送到我们的钱包：

:::tip Wallet V4
除了基本的验证过程外，我们还了解到 Wallet V3、Wallet V4 智能合约 [提取操作码以确定是简单翻译还是与插件相关的消息](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L94-L100) 是必需的。为了与该版本相匹配，有必要在写入 seqno（序列号）之后和指定交易模式之前添加 `storeUint(0, 8).` (JS/TS), `MustStoreUInt(0, 8).` (Golang)函数。
:::

### 创建外部信息

要从外部世界向区块链传递任何内部消息，都必须在外部消息中发送。正如我们之前所考虑的，只需使用 `ext_in_msg_info$10` 结构即可，因为我们的目标是向我们的合约发送外部消息。现在，让我们创建一条将发送到钱包的外部消息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
let externalMessage = beginCell()
  .storeUint(0b10, 2) // 0b10 -> 10 in binary
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress) // Destination address
  .storeCoins(0) // Import Fee
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // 0b10 -> 10 in binary
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

|      选项      |                                                                                              说明                                                                                             |
| :----------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Src     | 发件人地址。由于收到的外部报文不可能有发件人，因此总是有 2 个零位（addr_none [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100)）。 |
|  Import Fee  |                                                                                        用于支付导入外部信息的费用。                                                                                       |
|  State Init  |                                                         与内部信息不同，外部信息中的 State Init 是 **从外部世界** 部署合约所必需的。状态初始与内部报文结合使用，可以让一个合约部署另一个合约。                                                        |
| Message Body |                                                                                       必须发送给合约进行处理的信息。                                                                                       |

:::tip 0b10
0b10（b - 二进制）表示二进制记录。在此过程中，会存储两个比特：`1` 和 `0`。因此，我们指定为 `ext_in_msg_info$10`。
:::

现在，我们有了一条已完成的消息，可以发送给我们的合约了。要做到这一点，首先应将其序列化为`BOC`（[Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)），然后使用以下代码发送：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
console.log(externalMessage.toBoc().toString("base64"))

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tl"
)

log.Println(base64.StdEncoding.EncodeToString(externalMessage.ToBOCWithFlags(false)))

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

> 💡 Useful link:
>
> [Bag of Cells 的更多信息](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)

在本节中，我们将介绍如何从头开始创建钱包（钱包v3）。您将学习如何为钱包智能合约编译代码，生成助记词短语，获得钱包地址，并使用外部交易和State Init部署钱包。

## 生成助记词

正确定义钱包所需的第一件事是检索`private`和`public`密钥。为了完成这个任务，需要生成助记词种子短语，然后使用加密库提取私钥和公钥。

通过以下方式实现：

### 生成助记符

要正确创建钱包，首先需要获取 "私钥 "和 "公钥"。要完成这项任务，需要生成一个助记种子短语，然后使用加密库提取私钥和公钥。

具体做法如下

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { mnemonicToWalletKey, mnemonicNew } from '@ton/crypto';

// const mnemonicArray = 'put your mnemonic'.split(' ') // get our mnemonic as array
const mnemonicArray = await mnemonicNew(24); // 24 is the number of words in a seed phrase
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic
console.log(mnemonicArray) // if we want, we can print our mnemonic
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"log"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"golang.org/x/crypto/pbkdf2"
	"strings"
)

// mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array
mnemonic := wallet.NewSeed() // get new mnemonic

// The following three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. It has all been implemented in the tonutils-go library, but it immediately returns the finished object of the wallet with the address and ready methods. So we’ll have to write the lines to get the key separately. Goland IDE will automatically import all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " "))) 
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len 

privateKey := ed25519.NewKeyFromSeed(k) // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key
log.Println(publicKey) // print publicKey so that at this stage the compiler does not complain that we do not use our variable
log.Println(mnemonic) // if we want, we can print our mnemonic
```

</TabItem>
</Tabs>

钱包作为智能合约的最显着优势之一是能够仅使用一个私钥创建**大量的钱包**。这是因为TON区块链上的智能合约地址是使用多个因素计算出来的，其中包括`stateInit`。stateInit包含了`代码`和`初始数据`，这些数据存储在区块链的智能合约存储中。

:::danger 重要事项
有必要将生成的助记符种子短语输出到控制台，然后保存并使用（如上一节所述），以便每次运行钱包代码时使用相同的配对密钥。
:::

### 子钱包 ID

根据TON区块链的源代码中的[代码行](https://github.com/ton-blockchain/ton/blob/4b940f8bad9c2d3bf44f196f6995963c7cee9cc3/tonlib/tonlib/TonlibClient.cpp#L2420)，默认的`subwallet_id`值为`698983191`：

可以从[配置文件](https://ton.org/global-config.json)中获取创世块信息（zero_state）。了解其复杂性和细节并非必要，但重要的是要记住`subwallet_id`的默认值为`698983191`。

每个钱包合约都会检查外部交易的subwallet_id字段，以避免将请求发送到具有不同ID的钱包的情况：

```cpp
res.wallet_id = td::as<td::uint32>(res.config.zero_state_id.root_hash.as_slice().data());
```

我们需要将以上的值添加到合约的初始数据中，所以变量需要保存如下：

每个钱包合约都会检查外部信息的 subwallet_id 字段，以避免请求被发送到另一个 ID 的钱包：

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(34, subwallet_id == stored_subwallet);
```

我们需要将上述值添加到合约的初始数据中，因此需要按如下方式保存变量：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subWallet = 698983191;
```

</TabItem>
<TabItem value="go" label="Golang">

```go
var subWallet uint64 = 698983191
```

</TabItem>
</Tabs>

### 编译钱包代码

我们将仅使用JavaScript来编译代码，因为用于编译代码的库基于JavaScript。
但是，一旦编译完成，只要我们拥有编译后的cell的**base64输出**，就可以在其他编程语言（如Go等）中使用这些编译后的代码。

首先，我们需要创建两个文件：`wallet_v3.fc`和`stdlib.fc`。编译器和stdlib.fc库一起使用。库中创建了所有必需的基本函数，这些函数对应于`asm`指令。可以从[这里](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)下载stdlib.fc文件。在`wallet_v3.fc`文件中，需要复制上面的代码。

```bash
npm i --save @ton-community/func-js
```

现在，我们为我们正在创建的项目有了以下结构：

首先，我们需要创建两个文件：`wallet_v3.fc` 和 `stdlib.fc`。编译器使用 stdlib.fc 库。库中创建了与 `asm` 指令相对应的所有必要的基本函数。可下载 stdlib.fc 文件 [此处](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)。在 `wallet_v3.fc` 文件中，需要复制上述代码。

请记住，在`wallet_v3.fc`文件的开头添加以下行，以指示将在下面使用stdlib中的函数：

```
.
├── src/
│   ├── main.ts
│   ├── wallet_v3.fc
│   └── stdlib.fc
├── nodemon.json
├── package-lock.json
├── package.json
└── tsconfig.json
```

:::info
如果您的 IDE 插件与 `stdlib.fc` 文件中的 `() set_seed(int) impure asm "SETRAND";`冲突，也没关系。
:::

现在，让我们编写代码来编译我们的智能合约并使用`npm run start:dev`来运行它：

```func
#include "stdlib.fc";
```

终端的输出结果如下：

```js
import { compileFunc } from '@ton-community/func-js';
import fs from 'fs'; // we use fs for reading content of files
import { Cell } from '@ton/core';

const result = await compileFunc({
targets: ['wallet_v3.fc'], // targets of your project
sources: {
    "stdlib.fc": fs.readFileSync('./src/stdlib.fc', { encoding: 'utf-8' }),
    "wallet_v3.fc": fs.readFileSync('./src/wallet_v3.fc', { encoding: 'utf-8' }),
}
});

if (result.status === 'error') {
console.error(result.message)
return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0]; // get buffer from base64 encoded BOC and get cell from this buffer

// now we have base64 encoded BOC with compiled code in result.codeBoc
console.log('Code BOC: ' + result.codeBoc);
console.log('\nHash: ' + codeCell.hash().toString('base64')); // get the hash of cell and convert in to base64 encoded string. We will need it further
```

完成后，可以使用其他库和语言使用我们的钱包代码检索相同的cell（使用base64编码的输出）：

```text
Code BOC: te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==

Hash: idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

一旦完成，就可以使用其他库和语言，用我们的钱包代码检索相同的 cell （使用 base64 编码输出）：

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

base64BOC := "te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there are any error
  panic(err) 
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type and output to the terminal
```

</TabItem>
</Tabs>

完成上述过程后，确认我们的cell中正在使用正确的代码，因为哈希值相匹配。

```text
idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

在构建交易之前，了解State Init非常重要。首先让我们了解[TL-B方案](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143)：

### 为部署创建状态初始

在创建信息之前，了解什么是 State Init 是非常重要的。首先让我们来了解一下 [TL-B 方案](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143)：

|                选项                |                                                                                                                                                     说明                                                                                                                                                     |
| :------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| split_depth | 该选项适用于高负载智能合约，这些合约可以拆分并位于多个 [shardchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards)。  有关其工作原理的详细信息，请参阅 [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6)。  由于只在钱包智能合约中使用，因此只存储`0`位。 |
|              special             |                   用于 TicTok。每个区块都会自动调用这些智能合约，普通智能合约不需要。相关信息可参见 [此章节](/v3/documentation/data-formats/tlb/transaction-layout#tick-tock) 或 [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6)。本规范中只存储了 `0` 位，因为我们不需要这样的函数。                   |
|               code               |                                                                                                                                            `1` 位表示存在智能合约代码作为参考。                                                                                                                                            |
|               data               |                                                                                                                                            `1` 位表示存在智能合约数据作为参考。                                                                                                                                            |
|              library             |             在 [主链](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) 上运行的库，可用于不同的智能合约。它不会用于钱包，因此其位设置为 `0`。相关信息可参见 [tblkch.pdf](https://ton.org/tblkch.pdf) (1.8.4)。            |

接下来，我们将准备 `initial data`，这些数据将在部署后立即出现在我们的合约存储中：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from '@ton/core';

const dataCell = beginCell()
  .storeUint(0, 32) // Seqno
  .storeUint(698983191, 32) // Subwallet ID
  .storeBuffer(keyPair.publicKey) // Public Key
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32). // Seqno
  MustStoreUInt(698983191, 32). // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()
```

</TabItem>
</Tabs>

在这个阶段，合约的 `code` 和 `initial data` 都已存在。有了这些数据，我们就可以生成**钱包地址**。钱包地址取决于 State Init，其中包括代码和初始数据。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from '@ton/core';

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
)

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true). // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String()) // Output contract address to console
```

</TabItem>
</Tabs>

现在，我们可以使用 State Init 创建信息并将其发送到区块链上。

:::warning
To carry out this process, **a minimum wallet balance of 0.1 TON** is required (the balance can be less, but this amount is guaranteed to be sufficient). To accomplish this, we’ll need to run the code mentioned earlier in the tutorial, obtain the correct wallet address, and send 0.1 TON to this address. Alternatively, you can send this sum manually via your wallet app before sending the deployment message itself.

这里介绍的通过外部消息部署主要是出于教育目的；实际上，[通过钱包部署智能合约](/v3/guidelines/smart-contracts/howto/wallet#contract-deployment-via-wallet) 要方便得多，这将在后面介绍。
:::

首先，让我们创建一个与 **上一节** 中类似的信息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';
import { toNano } from '@ton/core';

const internalMessageBody = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x10, 6) // no bounce
  .storeAddress(Address.parse("put your first wallet address from were you sent 0.1 TON"))
  .storeCoins(toNano("0.03"))
  .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1 that means we have body as a reference
  .storeRef(internalMessageBody)
  .endCell();

// message for our wallet
const toSign = beginCell()
  .storeUint(subWallet, 32)
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32)
  .storeUint(0, 32) // We put seqno = 0, because after deploying wallet will store 0 as seqno
  .storeUint(3, 8)
  .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), keyPair.secretKey);
const body = beginCell()
  .storeBuffer(signature)
  .storeBuilder(toSign)
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tlb"
  "time"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(address.MustParseAddr("put your first wallet address from were you sent 0.1 TON")).
  MustStoreBigCoins(tlb.MustFromTON("0.03").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(internalMessageBody).
  EndCell()

// message for our wallet
toSign := cell.BeginCell().
  MustStoreUInt(subWallet, 32).
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32).
  MustStoreUInt(0, 32). // We put seqno = 0, because after deploying wallet will store 0 as seqno
  MustStoreUInt(3, 8).
  MustStoreRef(internalMessage)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash())
body := cell.BeginCell().
  MustStoreSlice(signature, 512).
  MustStoreBuilder(toSign).
	EndCell()
```

</TabItem>
</Tabs>

主要的区别将在外部消息的存在上，因为State Init被存储用于正确的合约部署。由于合约尚无自己的代码，因此无法处理任何内部消息。因此，接下来，我们将在成功部署后发送其代码和初始数据，以便可处理我们带有“Hello, TON！”评论的消息：

### 发送外部信息

**主要区别**在于外部信息的存在，因为 state Init 的存储是为了帮助正确部署合约。由于合约还没有自己的代码，因此无法处理任何内部信息。因此，接下来我们将在它成功部署后**发送它的代码和初始数据，以便它能处理我们的消息**，并注释为 "Hello, TON!"：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const externalMessage = beginCell()
  .storeUint(0b10, 2) // indicate that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(contractAddress)
  .storeCoins(0) // Import fee
  .storeBit(1) // We have State Init
  .storeBit(1) // We store State Init as a reference
  .storeRef(stateInit) // Store State Init as a reference
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // indicate that it is an incoming external message
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(contractAddress).
  MustStoreCoins(0). // Import fee
  MustStoreBoolBit(true). // We have State Init
  MustStoreBoolBit(true).  // We store State Init as a reference
  MustStoreRef(stateInit). // Store State Init as a reference
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

最后，我们可以向区块链发送信息，部署我们的钱包并使用它。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)
if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

请注意，我们使用 `3` 模式发送了内部信息。如果需要重复部署同一个钱包，**可以销毁智能合约**。为此，请正确设置模式，添加 128（取走智能合约的全部余额）+ 32（销毁智能合约），即 = `160`，以取回剩余的 TON 余额并再次部署钱包。

正如您可能已经知道的，[一个cell可以存储最多1023位的数据和最多4个指向其他cells的引用](/develop/data-formats/cell-boc#cell)。在本教程的第一部分中，我们详细介绍了内部消息是如何以“整体”循环作为链接发送的。这意味着可以**在外部消息内存储多达4条内部消息**。这允许同时发送四笔交易。

:::info
我们使用的合约代码是 [已验证](https://tonscan.org/tx/BL9T1i5DjX1JRLUn4z9JOgOWRKWQ80pSNevis26hGvc=)，因此您可以在 [这里](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX#source) 看到一个示例。
:::

## 同时发送多条消息

正如您可能已经知道的，[一个cell可以存储最多1023位的数据和最多4个指向其他cells的引用](/develop/data-formats/cell-boc#cell)。在本教程的第一部分中，我们详细介绍了内部消息是如何以“整体”循环作为链接发送的。这意味着可以**在外部消息内存储多达4条内部消息**。这允许同时发送四笔交易。

### 同时发送多条信息

您可能已经知道，[一个 cell 最多可存储 1023 位数据和 4 个引用](/v3/documentation/data-formats/tlb/cell-boc#cell) 到其他 cell 。在本教程的第一部分，我们详细介绍了内部信息如何作为链接在 `整体` 循环中传递和发送。这意味着可以在外部**信息中**存储多达 4 条内部信息。这样就可以同时发送四条信息。

为此，有必要创建 4 条不同的内部信息。我们可以手动创建，也可以通过 "循环 "创建。我们需要定义 3 个数组：TON 数量数组、注释数组、消息数组。对于消息，我们需要准备另一个数组 - internalMessages。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from '@ton/core';

const internalMessagesAmount = ["0.01", "0.02", "0.03", "0.04"];
const internalMessagesComment = [
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4" 
]
const destinationAddresses = [
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you"
] // All 4 addresses can be the same

let internalMessages:Cell[] = []; // array for our internal messages
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessagesAmount := [4]string{"0.01", "0.02", "0.03", "0.04"}
internalMessagesComment := [4]string{
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4",
}
destinationAddresses := [4]string{
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
} // All 4 addresses can be the same

var internalMessages [len(internalMessagesAmount)]*cell.Cell // array for our internal messages
```

</TabItem>
</Tabs>

所有信息的[发送模式](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)都设置为 `mode 3`。  不过，如果需要不同的模式，可以创建一个数组来实现不同的目的。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from '@ton/core';

for (let index = 0; index < internalMessagesAmount.length; index++) {
  const amount = internalMessagesAmount[index];
  
  let internalMessage = beginCell()
      .storeUint(0x18, 6) // bounce
      .storeAddress(Address.parse(destinationAddresses[index]))
      .storeCoins(toNano(amount))
      .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1);
      
  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if(internalMessagesComment[index] != "") {
    internalMessage.storeBit(1) // we store Message Body as a reference

    let internalMessageBody = beginCell()
      .storeUint(0, 32)
      .storeStringTail(internalMessagesComment[index])
      .endCell();

    internalMessage.storeRef(internalMessageBody);
  } 
  else 
    /*
        Since we do not have a message body, we indicate that 
        the message body is in this message, but do not write it, 
        which means it is absent. In that case, just set the bit to 0.
    */
    internalMessage.storeBit(0);
  
  internalMessages.push(internalMessage.endCell());
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

for i := 0; i < len(internalMessagesAmount); i++ {
  amount := internalMessagesAmount[i]

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(address.MustParseAddr(destinationAddresses[i])).
    MustStoreBigCoins(tlb.MustFromTON(amount).NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32+1)

  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if internalMessagesComment[i] != "" {
    internalMessage.MustStoreBoolBit(true) // we store Message Body as a reference

    internalMessageBody := cell.BeginCell().
      MustStoreUInt(0, 32).
      MustStoreStringSnake(internalMessagesComment[i]).
      EndCell()

    internalMessage.MustStoreRef(internalMessageBody)
  } else {
    /*
        Since we do not have a message body, we indicate that
        the message body is in this message, but do not write it,
        which means it is absent. In that case, just set the bit to 0.
    */
    internalMessage.MustStoreBoolBit(false)
  }
  internalMessages[i] = internalMessage.EndCell()
}
```

</TabItem>
</Tabs>

现在，让我们利用 [第二章](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet) 中的知识，为我们的钱包创建一个可以同时发送 4 条信息的钱包：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

const walletAddress = Address.parse('put your wallet address');
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32); // store seqno
  // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"context"
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"golang.org/x/crypto/pbkdf2"
	"log"
	"strings"
	"time"
)

walletAddress := address.MustParseAddr("put your wallet address")

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

mnemonic := strings.Split("put your mnemonic", " ") // word1 word2 word3
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8). 
```

</TabItem>
</Tabs>

接下来，我们将在循环中添加之前创建的信息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
for (let index = 0; index < internalMessages.length; index++) {
  const internalMessage = internalMessages[index];
  toSign.storeUint(3, 8) // store mode of our internal message
  toSign.storeRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
for i := 0; i < len(internalMessages); i++ {
		internalMessage := internalMessages[i]
		toSign.MustStoreUInt(3, 8) // store mode of our internal message
		toSign.MustStoreRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
</Tabs>

现在，上述过程已经完成，让我们 **签署** 我们的信息，**构建外部信息**（如本教程前几节所述），然后 **发送** 到区块链：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

let externalMessage = beginCell()
    .storeUint(0b10, 2) // ext_in_msg_info$10
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(walletAddress) // Destination address
    .storeCoins(0) // Import Fee
    .storeBit(0) // No State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tl"
)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

:::info 连接错误
如果出现与 lite-server 连接（Golang）相关的错误，则必须运行代码，直到信息可以发送为止。这是因为 tonutils-go 库通过代码中指定的全局配置使用了多个不同的 lite-server。然而，并非所有 Lite 服务器都能接受我们的连接。
:::

现在让我们构建交易本身：

### NFT 转账

除了普通信息，用户之间还经常发送 NFT。遗憾的是，并非所有的库都包含专门用于这种智能合约的方法。因此，有必要创建代码，让我们能够构建用于发送 NFT 的消息。首先，让我们进一步熟悉 TON NFT [标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)。

现在让我们构建交易本身：

- `query_id`：Query ID 在消息处理方面没有价值。NFT 合约不会验证它，只会读取它。当服务希望为其每条报文分配一个特定的查询 ID 以供识别时，这个值可能会很有用。因此，我们将其设置为 0。

- `response_destination`：处理所有权变更信息后，将产生额外的 TON。如果指定了该地址，它们将被发送到该地址，否则将保留在 NFT 余额中。

- `custom_payload`：custom_payload 用于执行特定任务，不与普通 NFT 一起使用。

- `forward_amount`：如果 forward_amount 不为零，指定的 TON 数将发送给新的所有者。这样，新的所有者就会知道他们收到了一些东西。

- `forward_payload`：forward_payload 是附加数据，可与 forward_amount 一起发送给新的所有者。例如，使用 forward_payload，用户可以[在 NFT 转移过程中添加注释](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#forward_payload-format)，如前面的教程所示。不过，虽然 forward_payload 是在 TON 的 NFT 标准中编写的，但区块链探索者并不完全支持显示各种详细信息。在显示 Jettons 时也存在同样的问题。

现在，让我们来构建信息本身：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from '@ton/core';

const destinationAddress = Address.parse("put your wallet where you want to send NFT");
const walletAddress = Address.parse("put your wallet which is the owner of NFT")
const nftAddress = Address.parse("put your nft address");

// We can add a comment, but it will not be displayed in the explorers, 
// as it is not supported by them at the time of writing the tutorial.
const forwardPayload = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const transferNftBody = beginCell()
  .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
  .storeUint(0, 64) // query_id
  .storeAddress(destinationAddress) // new_owner
  .storeAddress(walletAddress) // response_destination for excesses
  .storeBit(0) // we do not have custom_payload
  .storeCoins(toNano("0.01")) // forward_amount
  .storeBit(1) // we store forward_payload as a reference
  .storeRef(forwardPayload) // store forward_payload as a .reference
  .endCell();

const internalMessage = beginCell().
  storeUint(0x18, 6). // bounce
  storeAddress(nftAddress).
  storeCoins(toNano("0.05")).
  storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  storeRef(transferNftBody).
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

destinationAddress := address.MustParseAddr("put your wallet where you want to send NFT")
walletAddress := address.MustParseAddr("put your wallet which is the owner of NFT")
nftAddress := address.MustParseAddr("put your nft address")

// We can add a comment, but it will not be displayed in the explorers,
// as it is not supported by them at the time of writing the tutorial.
forwardPayload := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

transferNftBody := cell.BeginCell().
  MustStoreUInt(0x5fcc3d14, 32). // Opcode for NFT transfer
  MustStoreUInt(0, 64). // query_id
  MustStoreAddr(destinationAddress). // new_owner
  MustStoreAddr(walletAddress). // response_destination for excesses
  MustStoreBoolBit(false). // we do not have custom_payload
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()). // forward_amount
  MustStoreBoolBit(true). // we store forward_payload as a reference
  MustStoreRef(forwardPayload). // store forward_payload as a reference
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x18, 6). // bounce
  MustStoreAddr(nftAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.05").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(transferNftBody).
  EndCell()
```

</TabItem>
</Tabs>

NFT 传输操作码来自 [同一标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema)。
现在，让我们按照本教程前几节的内容完成报文。完成信息所需的正确代码可在 [GitHub 代码库](/v3/guidelines/smart-contracts/howto/wallet#-source-code) 中找到。

现在，我们转向只有 V4 钱包使用的方法：

### Wallet v3 和 Wallet v4 获取方法

让我们考虑 `get_public_key` 和 `is_plugin_installed` 方法。选择这两种方法是因为，首先我们需要从 256 位数据中获取公钥，然后我们需要学习如何向 GET 方法传递 slice 和不同类型的数据。这对于我们正确使用这些方法非常有用。

首先，我们需要一个能够发送请求的客户端。因此，我们将使用特定的钱包地址（[EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF)）作为例子：

|                                                                方法                                                                |                                                         说明                                                        |
| :------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: |
|                        int get_subwallet_id()                       |                                 需要使用该方法接收当前的 seqno，并以正确的值发送信息。在本教程的前几节中，该方法经常被调用。                                 |
| int is_plugin_installed(int wc, int addr_hash) | 让我们知道插件是否已安装。调用此方法时，需要传递 [工作链](/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules) 和插件地址哈希。 |

让我们考虑 `get_public_key` 和 `is_plugin_installed` 方法。选择这两种方法是因为，首先我们需要从 256 位数据中获取公钥，然后我们需要学习如何向 GET 方法传递 slice 和不同类型的数据。这对于我们正确使用这些方法非常有用。

|                                                                方法                                                                |                                                                              说明                                                                              |
| :------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                        int get_subwallet_id()                       |                                             在本教程的前面部分，我们已经讨论过这个问题。通过这种方法可以重新获取 subwallet_id。                                            |
| int is_plugin_installed(int wc, int addr_hash) | 让我们知道插件是否已安装。要调用此方法，必须传递 [workchain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules) 和插件地址哈希值。 |
|                       tuple get_plugin_list()                       |                                                                        此方法返回已安装插件的地址。                                                                        |

让我们来看看 `get_public_key` 和 `is_plugin_installed` 方法。之所以选择这两个方法，是因为一开始我们必须从 256 位数据中获取公钥，之后我们必须学习如何向 GET 方法传递 slice 和不同类型的数据。这对我们学习如何正确使用这些方法非常有用。

首先，我们需要一个能够发送请求的客户端。因此，我们将以一个特定的钱包地址（[EQDKbjIcfM6ezt8KjKJLshZJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF) ）为例：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const walletAddress = Address.parse("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"); // my wallet address as an example
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "log"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletAddress := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF") // my wallet address as an example
```

</TabItem>
</Tabs>

现在，我们需要调用 GET 方法钱包。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
// I always call runMethodWithError instead of runMethod to be able to check the exit_code of the called method. 
let getResult = await client.runMethodWithError(walletAddress, "get_public_key"); // run get_public_key GET Method
const publicKeyUInt = getResult.stack.readBigNumber(); // read answer that contains uint256
const publicKey = publicKeyUInt.toString(16); // get hex string from bigint (uint256)
console.log(publicKey)
```

</TabItem>
<TabItem value="go" label="Golang">

```go
getResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "get_public_key") // run get_public_key GET Method
if err != nil {
	log.Fatalln("RunGetMethod err:", err.Error())
	return
}

// We have a response as an array with values and should specify the index when reading it
// In the case of get_public_key, we have only one returned value that is stored at 0 index
publicKeyUInt := getResult.MustInt(0) // read answer that contains uint256
publicKey := publicKeyUInt.Text(16)   // get hex string from bigint (uint256)
log.Println(publicKey)
```

</TabItem>
</Tabs>

调用成功后，最终结果是一个极大的 256 位数字，必须将其转换为十六进制字符串。上面提供的钱包地址的十六进制字符串如下：`430db39b13cf3cb76bfa818b6b13417b82be2c6c389170fbe06795c71996b1f8`.
接下来，我们利用 [TonAPI](https://docs.tonconsole.com/tonapi/rest-api) (/v1/wallet/findByPubkey 方法)，将获得的十六进制字符串输入系统，答案中数组的第一个元素将立即识别我的钱包。

然后切换到 `is_plugin_installed` 方法。例如，我们将再次使用之前使用过的钱包（[EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k](https://tonscan.org/address/EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k) 和插件（[EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ](https://tonscan.org/address/EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ)）：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const oldWalletAddress = Address.parse("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k"); // my old wallet address
const subscriptionAddress = Address.parseFriendly("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ"); // subscription plugin address which is already installed on the wallet
```

</TabItem>
<TabItem value="go" label="Golang">

```go
oldWalletAddress := address.MustParseAddr("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k")
subscriptionAddress := address.MustParseAddr("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ") // subscription plugin address which is already installed on the wallet
```

</TabItem>
</Tabs>

现在，我们需要获取插件的哈希地址，以便将地址转换为数字并发送到 GET 方法。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const hash = BigInt(`0x${subscriptionAddress.address.hash.toString("hex")}`) ;

getResult = await client.runMethodWithError(oldWalletAddress, "is_plugin_installed", 
[
    {type: "int", value: BigInt("0")}, // pass workchain as int
    {type: "int", value: hash} // pass plugin address hash as int
]);
console.log(getResult.stack.readNumber()); // -1
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "math/big"
)

hash := big.NewInt(0).SetBytes(subscriptionAddress.Data())
// runGetMethod will automatically identify types of passed values
getResult, err = client.RunGetMethod(context.Background(), block, oldWalletAddress,
  "is_plugin_installed",
  0,    // pass workchain
  hash) // pass plugin address
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}

log.Println(getResult.MustInt(0)) // -1
```

</TabItem>
</Tabs>

在第三章中，我们部署了一个钱包。为此，我们最初发送了一些TON，然后从钱包发送了一笔交易以部署一个智能合约。然而，这个过程并不常用于外部交易，通常主要用于钱包。在开发合约时，部署过程是通过发送内部消息来初始化的。

### 通过钱包部署合约

在第三章中，我们部署了一个钱包。为此，我们首先发送了一些 TON，然后从钱包中发送了一条部署智能合约的消息。不过，这个过程并不广泛用于外部消息，通常只主要用于钱包。在开发合约时，部署流程是通过发送内部消息来初始化的。

为此，我们将使用 [第三章](/v3/guidelines/smart-contracts/howto/wallet#compiling-wallet-code) 中使用的 V3R2 钱包智能合约。
在这种情况下，我们将把 `subwallet_id` 设置为 `3` 或其他任何需要的数字，以便在使用相同私钥（可更改）时检索另一个地址：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, Cell } from '@ton/core';
import { mnemonicToWalletKey } from '@ton/crypto';

const mnemonicArray = 'put your mnemonic'.split(" ");
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic

const codeCell = Cell.fromBase64('te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==');
const dataCell = beginCell()
    .storeUint(0, 32) // Seqno
    .storeUint(3, 32) // Subwallet ID
    .storeBuffer(keyPair.publicKey) // Public Key
    .endCell();

const stateInit = beginCell()
    .storeBit(0) // No split_depth
    .storeBit(0) // No special
    .storeBit(1) // We have code
    .storeRef(codeCell)
    .storeBit(1) // We have data
    .storeRef(dataCell)
    .storeBit(0) // No library
    .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "golang.org/x/crypto/pbkdf2"
  "strings"
)

mnemonicArray := strings.Split("put your mnemonic", " ")
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key

BOCBytes, _ := base64.StdEncoding.DecodeString("te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==")
codeCell, _ := cell.FromBOC(BOCBytes)
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32).           // Seqno
  MustStoreUInt(3, 32).           // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()
```

</TabItem>
</Tabs>

接下来，我们将从合约中获取地址，并创建 InternalMessage。此外，我们还要在消息中添加 "Deploying..." 注释。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, toNano } from '@ton/core';

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console

const internalMessageBody = beginCell()
    .storeUint(0, 32)
    .storeStringTail('Deploying...')
    .endCell();

const internalMessage = beginCell()
    .storeUint(0x10, 6) // no bounce
    .storeAddress(contractAddress)
    .storeCoins(toNano('0.01'))
    .storeUint(0, 1 + 4 + 4 + 64 + 32)
    .storeBit(1) // We have State Init
    .storeBit(1) // We store State Init as a reference
    .storeRef(stateInit) // Store State Init as a reference
    .storeBit(1) // We store Message Body as a reference
    .storeRef(internalMessageBody) // Store Message Body Init as a reference
    .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "log"
)

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())   // Output contract address to console

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Deploying...").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(contractAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()).
  MustStoreUInt(0, 1+4+4+64+32).
  MustStoreBoolBit(true).            // We have State Init
  MustStoreBoolBit(true).            // We store State Init as a reference
  MustStoreRef(stateInit).           // Store State Init as a reference
  MustStoreBoolBit(true).            // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
  EndCell()
```

</TabItem>
</Tabs>

:::info
请注意，上面已经指定了位，stateInit 和 internalMessageBody 已作为引用保存。由于链接是单独保存的，我们可以写 4 (0b100) + 2 (0b10) + 1 (0b1) -> (4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1) 即 (0b111, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)，然后保存两个引用。
:::

接下来，我们将为钱包准备一条信息并发送：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { sign } from '@ton/crypto';

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const walletAddress = Address.parse('put your wallet address with which you will deploy');
const getMethodResult = await client.runMethod(walletAddress, 'seqno'); // run "seqno" GET method from your wallet contract
const seqno = getMethodResult.stack.readNumber(); // get seqno from response

// message for our wallet
const toSign = beginCell()
    .storeUint(698983191, 32) // subwallet_id
    .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
    .storeUint(seqno, 32) // store seqno
    // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
    .storeUint(3, 8)
    .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), walletKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
const body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

const external = beginCell()
    .storeUint(0b10, 2) // indicate that it is an incoming external message
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(walletAddress)
    .storeCoins(0) // Import fee
    .storeBit(0) // We do not have State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

console.log(external.toBoc().toString('base64'));
client.sendFile(external.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
  "time"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletMnemonicArray := strings.Split("put your mnemonic", " ")
mac = hmac.New(sha512.New, []byte(strings.Join(walletMnemonicArray, " ")))
hash = mac.Sum(nil)
k = pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
walletPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
walletAddress := address.MustParseAddr("put your wallet address with which you will deploy")

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32).                          // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32).                     // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8).
  MustStoreUInt(3, 8).          // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(walletPrivateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign).       // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2).       // ext_in_msg_info$10
  MustStoreUInt(0, 2).          // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0).            // Import Fee
  MustStoreBoolBit(false).      // No State Init
  MustStoreBoolBit(true).       // We store Message Body as a reference
  MustStoreRef(body).           // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

首先，让我们查看[高负载钱包智能合约的代码结构](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc)：

## 🔥 高负载钱包 V3

在短时间内处理大量信息时，需要使用名为 "高负载钱包 "的特殊钱包。在很长一段时间里，高负载钱包 V2 是 TON 的主要钱包，但使用时必须非常小心。否则，您可能会被 [锁定所有资金](https://t.me/tonstatus/88)。

您会发现与普通钱包有些不同。现在让我们更详细地看看高负载钱包在TON上的工作原理（除了子钱包，因为我们之前已经讨论过了）。

:::note
我们将[使用稍作修改的 Wrapper 版本](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts)来签订合约，因为它可以防止一些不明显的错误。
:::

### 存储结构

如果相同的交易请求已经存在，合约将不会接受它，因为它已经被处理过了：

```
storage$_ public_key:bits256 subwallet_id:uint32 old_queries:(HashmapE 14 ^Cell)
          queries:(HashmapE 14 ^Cell) last_clean_time:uint64 timeout:uint22
          = Storage;
```

:::tip TL-B
您可以 [在此](/v3/documentation/data-formats/tlb/tl-b-language) 阅读有关 TL-B 的更多信息。
:::

在合约存储中，我们可以找到以下字段：

|                           Field                           |                                                                          说明                                                                          |
| :-------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------: |
|              public_key              |                                                                       合约的公开密钥。                                                                       |
|             subwallet_id             |                                                       [钱包 ID](#subwallet-ids)。它允许你使用同一公钥创建多个钱包。                                                      |
|              old_queries             |                                                              已经处理过的过时查询。每次超时后，它们都会被移至此处。                                                             |
|                          queries                          |                                                                     已处理但尚未过时的查询。                                                                     |
| last_clean_time | 上次清理的时间。如果 `last_clean_time < (now() - timeout)`，旧查询将被移至 `old_queries`。如果 `last_clean_time < (now() - 2 * timeout)`，则同时清除 `old_queries` 和 `queries`。 |
|                          timeout                          |                                                                查询转到 `old_queries` 的时间。                                                               |

我们将在 [重放保护](#replay-protection) 中进一步讨论如何处理已处理的查询。

### Shifts 和 Bits 数字作为 Query ID

请注意，如果找到一个值，`f` 永远等于 -1（真）。`~ -1` 操作（位非）将始终返回 0 的值，意味着应该继续循环。与此同时，当字典填充了交易时，需要开始计算那些**大于 -1** 的值（例如，0），并且每次交易都将值递增 1。这个结构允许以正确的顺序发送交易。

```func.
int shift = msg_inner_slice~load_uint(KEY_SIZE);
int bit_number = msg_inner_slice~load_uint(BIT_NUMBER_SIZE);
```

通常情况下，[TON上的智能合约需要为自己的存储付费](/develop/smart-contracts/fees#storage-fee)。这意味着智能合约可以存储的数据量是有限的，以防止高网络交易费用。为了让系统更高效，超过 64 秒的交易将从存储中移除。按照以下方式进行：

首先，合约会使用 shift 命令，尝试从  `old_queries` 字典中获取位于该索引处的 cell ：

```func
(cell value, int found) = old_queries.udict_get_ref?(KEY_SIZE, shift);
```

请注意，必须多次与 `f` 变量进行交互。由于 [TVM 是一个堆栈机器](/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine)，在每次与 `f` 变量交互时，必须弹出所有值以获得所需的变量。`f~touch()` 操作将 f 变量放在堆栈顶部，以优化代码执行。

```func
if (found) {
    slice value_slice = value.begin_parse();
    value_slice~skip_bits(bit_number);
    throw_if(error::already_executed, value_slice.preload_int(1));
}
```

如果您之前没有使用过位运算，那么这个部分可能会显得有些复杂。在智能合约代码中可以看到以下代码行：

```func
(cell value, int found) = queries.udict_get_ref?(KEY_SIZE, shift);
```

结果，在右侧的数字上添加了 32 位。这意味着 **现有值向左移动 32 位**。举例来说，让我们考虑数字 3 并将其翻译成二进制形式，结果是 11。应用 `3 << 2` 操作，11 移动了 2 位。这意味着在字符串的右侧添加了两位。最后，我们得到了 1100，即 12。

```func
builder new_value = null();
if (found) {
    slice value_slice = value.begin_parse();
    (slice tail, slice head) = value_slice.load_bits(bit_number);
    throw_if(error::already_executed, tail~load_int(1));
    new_value = begin_cell().store_slice(head).store_true().store_slice(tail);
} else {
    new_value = begin_cell().store_zeroes(bit_number).store_true().store_zeroes(CELL_BITS_SIZE - bit_number - 1);
}
```

:::note
If you [familiarize yourself](/v3/documentation/tvm/instructions) with the operation of the `LDSLICEX` opcode (the load\_bits function uses this opcode), you will notice that the read data is returned first (head) and only then the remaining data (tail), but they are in reverse order in the contract code.

事实上，它们的顺序是相反的，因为在 stdlib 的函数签名中，返回的数据[顺序相反](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/contracts/imports/stdlib.fc#L321)：`(slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";`。这里 `-> 1 0` 表示先返回索引为 1（尾部）的参数，然后返回索引为 0（头部）的参数。
:::

在上面，我们执行了一个操作，将数字 64 向左移动 32 位，以**减去 64 秒**的时间戳。这样我们就可以比较过去的 query_ids，看看它们是否小于接收到的值。如果是这样，它们就超过了 64 秒：

这种方法允许每次超时存储大量请求（1023 \* 8192 = 8,380,416），但你可能会注意到[类 HighloadQueryId 支持 8,380,415](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadQueryId.ts#L32)。这是为了确保在整个限制耗尽的情况下，总有 1 个比特可用于一个紧急超时请求。之所以设置这个值，是因为区块链上有[账户堆栈中可能存在的最大 cell 数限制](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/mc-config.h#L395)（截至本文撰写时）。

为了更好地理解，让我们使用 `1625918400` 作为时间戳的示例。它的二进制表示（左侧添加零以得到 32 位）是 01100000111010011000101111000000。执行 32 位位左移操作后，我们数字的二进制表示末尾会出现 32 个零。

:::info
在高负载 V2 的早期版本中，每个 Query ID（64 位）都存储在字典中的单独 cell 中，并且是 32 位字段 `expire_at` 和 `query_id` 的组合。这导致在清除旧查询时， gas 消耗量增长非常快。
:::

### 存储更新

所有操作完成后，剩下的唯一任务就是将新的值保存在存储中：

当合约从其存储空间中完全检索到所需的所有数据后，它会检查上次查询字典清理的时间。如果超过了 `timeout` 时间，合约会将所有查询从 queries 移到 old_queries。如果上次清理时间超过 `timeout * 2` 次，合约会额外清理 old_queries：

```func
if (last_clean_time < (now() - timeout)) {
    (old_queries, queries) = (queries, null());
    if (last_clean_time < (now() - (timeout * 2))) {
        old_queries = null();
    }
    last_clean_time = now();
}
```

在我们深入了解钱包部署和交易创建之前，我们必须考虑的最后一件事是高负载钱包的 GET 方法：

理论上，查询的生命周期从 `timeout` 到 `timeout * 2`，这意味着在跟踪哪些查询过时时，最好至少等待 `timeout * 2` 次，以确定查询是否过时。

### 保证无差错行动阶段

一旦完成所有检查和清理工作，合约就可以接受信息，对其存储空间进行更改，并调用提交函数，即使接下来出现错误，也会认为计算阶段已经成功：

```func
accept_message();

queries~udict_set_ref(KEY_SIZE, shift, new_value.end_cell());

set_data(begin_cell()
    .store_uint(public_key, PUBLIC_KEY_SIZE)
    .store_uint(subwallet_id, SUBWALLET_ID_SIZE)
    .store_dict(old_queries)
    .store_dict(queries)
    .store_uint(last_clean_time, TIMESTAMP_SIZE)
    .store_uint(timeout, TIMEOUT_SIZE)
    .end_cell());


commit();
```

这意味着，如果传递给方法的 query_id 小于 last_cleaned 值，就无法确定它是否曾在合约中。因此 `query_id <= last_cleaned` 返回 -1，而表达式前面的减号将答案改为 1。如果 query_id 大于 last_cleaned 方法，则表示它尚未被处理。

不过，还有一个问题必须解决，那就是在 **行动阶段** 可能出现的错误。虽然我们在发送消息时有一个忽略错误（2）的标记，但它并不是在所有情况下都有效，因此我们需要确保在这个阶段不会发生错误，因为错误可能会导致状态回滚，使 `commit()` 失去意义。

为了部署高负载钱包，必须提前生成一个助记词密钥，用户将使用此密钥。可以使用在本教程之前部分中使用的相同密钥。

```func
throw_if(error::invalid_message_to_send, message_slice~load_uint(1)); ;; int_msg_info$0
int msg_flags = message_slice~load_uint(3); ;; ihr_disabled:Bool bounce:Bool bounced:Bool
if (is_bounced(msg_flags)) {
    return ();
}
slice message_source_adrress = message_slice~load_msg_addr(); ;; src
throw_unless(error::invalid_message_to_send, is_address_none(message_source_adrress));
message_slice~load_msg_addr(); ;; dest
message_slice~load_coins(); ;; value.coins
message_slice = message_slice.skip_dict(); ;; value.other extra-currencies
message_slice~load_coins(); ;; ihr_fee
message_slice~load_coins(); ;; fwd_fee
message_slice~skip_bits(64 + 32); ;; created_lt:uint64 created_at:uint32
int maybe_state_init = message_slice~load_uint(1);
throw_if(error::invalid_message_to_send, maybe_state_init); ;; throw if state-init included (state-init not supported)
int either_body = message_slice~load_int(1);
if (either_body) {
    message_slice~load_ref();
    message_slice.end_parse();
}
```

如果在读取数据时出现任何问题，仍将处于计算阶段。不过，由于存在 `commit()` 这不是问题，事务仍将被视为成功。如果所有数据都已成功读取，这就保证了操作阶段将无差错地通过，因为这些检查涵盖了 `IGNORE_ERRORS` (2) 标志失败的所有情况。然后，合约就可以通过发送消息来完成工作：

```func
;; send message with IGNORE_ERRORS flag to ignore errors in the action phase

send_raw_message(message_to_send, send_mode | SEND_MODE_IGNORE_ERRORS);
```

### 内部转账

在终端中的输出将如下所示：

```func
if (op == op::internal_transfer) {
    in_msg_body~skip_query_id();
    cell actions = in_msg_body.preload_ref();
    cell old_code = my_code();
    set_actions(actions);
    set_code(old_code); ;; prevent to change smart contract code
    return ();
}
```

在上述结果的基础上，我们可以使用base64编码的输出，在其他库和语言中检索包含我们钱包代码的cell，具体操作如下：

在官方版本库的包装器中，这个字段是可选的，如果用户不指定，[mode就会变成 128](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadWalletV3.ts#L115)，这意味着会发送全部余额。问题是，在这种情况下存在**边缘情况**。

假设我们要发送大量代币。由于我们在 `response_destination` 字段中设置了我们的地址，所以在发送后，剩余的 TON 会返回到我们的钱包。我们开始同时发送多个外部代币，就会出现以下情况：

1. 接收并处理外部信息 A，并通过 `response_destination` 发送全部合约余额。
2. 在外部信息 B 到达之前，已发送完毕的代币的部分佣金已经到达。因此，非空合约余额允许再次向内部报文 B 发送全部余额，但这次发送的代币数量很少。
3. 接收并处理内部报文 A。发送 token 信息。
4. 在内部信息 B 到达之前，外部信息 C 成功到达，并再次发送了整个余额。
5. 当收到内部信息 B 时，即使从发送代币中得到一些额外的 TON，合约的 TON 也很少，因此请求失败，行动阶段的退出代码 = 37（资金不足）。

现在我们需要检索由其初始数据组成的cell，构建一个State Init，并计算一个高负载钱包地址。经过研究智能合约代码后，我们发现subwallet_id、last_cleaned、public_key和old_queries是顺序存储在存储中的：

高负载钱包 V3 可以发送超过 254 条信息，[将剩余信息放入第 254 条信息中](https://github.com/aSpite/highload-wallet-contract-v3/blob/d4c1752d00b5303782f121a87eb0620d403d9544/wrappers/HighloadWalletV3.ts#L169-L176)。这样，`internal_transfer` 将被处理多次。封装程序会自动执行此操作，我们无需担心，但**建议每次接收不超过 150 条信息**，以确保即使是复杂的信息也能放入外部信息中。

:::info
虽然外部信息限制为 64KB，但外部信息越大，在发送过程中丢失的可能性就越大，因此 150 条信息是最佳解决方案。
:::

### GET 方法

高负载钱包 V3 支持 5 种 GET 方法：

|                                                      方法                                                     |                                                                                              说明                                                                                              |
| :---------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|              int get_public_key()              |                                                                                           返回合约的公钥。                                                                                           |
|             int get_subwallet_id()             |                                                                                           返回子钱包 ID。                                                                                          |
| int get_last_clean_time() |                                                                                          返回上次清理的时间。                                                                                          |
|                          int get_timeout()                          |                                                                                            返回超时值。                                                                                            |
|  int processed?(int query_id, int need_clean)  | 返回 query_id 是否已被处理。如果 need_clean 设置为 1，那么将首先根据 `last_clean_time` 和 `timeout` 进行清理，然后检查 `old_queries` 和 `queries` 中的 query_id。 |

:::tip
除非情况另有要求，否则建议为 `need_clean` 传递 `true`，因为这样会返回最新的字典状态。
:::

由于高负载钱包 V3 采用了查询 ID 的组织方式，因此如果查询 ID 没有到达，我们可以再次发送具有相同查询 ID 的信息，而不必担心请求会被处理两次。

现在，让我们编程高负载钱包同时发送多条消息。例如，让我们每条消息发送12笔交易，这样gas费用就很小。

### 部署高负载钱包 V3

每条消息携带其自己的含代码的评论，目的地址将是我们部署的钱包：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from "@ton/core";

const HIGHLOAD_V3_CODE = Cell.fromBoc(Buffer.from('b5ee9c7241021001000228000114ff00f4a413f4bcf2c80b01020120020d02014803040078d020d74bc00101c060b0915be101d0d3030171b0915be0fa4030f828c705b39130e0d31f018210ae42e5a4ba9d8040d721d74cf82a01ed55fb04e030020120050a02027306070011adce76a2686b85ffc00201200809001aabb6ed44d0810122d721d70b3f0018aa3bed44d08307d721d70b1f0201200b0c001bb9a6eed44d0810162d721d70b15800e5b8bf2eda2edfb21ab09028409b0ed44d0810120d721f404f404d33fd315d1058e1bf82325a15210b99f326df82305aa0015a112b992306dde923033e2923033e25230800df40f6fa19ed021d721d70a00955f037fdb31e09130e259800df40f6fa19cd001d721d70a00937fdb31e0915be270801f6f2d48308d718d121f900ed44d0d3ffd31ff404f404d33fd315d1f82321a15220b98e12336df82324aa00a112b9926d32de58f82301de541675f910f2a106d0d31fd4d307d30cd309d33fd315d15168baf2a2515abaf2a6f8232aa15250bcf2a304f823bbf2a35304800df40f6fa199d024d721d70a00f2649130e20e01fe5309800df40f6fa18e13d05004d718d20001f264c858cf16cf8301cf168e1030c824cf40cf8384095005a1a514cf40e2f800c94039800df41704c8cbff13cb1ff40012f40012cb3f12cb15c9ed54f80f21d0d30001f265d3020171b0925f03e0fa4001d70b01c000f2a5fa4031fa0031f401fa0031fa00318060d721d300010f0020f265d2000193d431d19130e272b1fb00b585bf03', 'hex'))[0];
```

</TabItem>
</Tabs> 

与其他示例不同的是，这里我们将[使用现成的封装器](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts)，因为手动创建每条信息将相当困难和耗时。要创建 HighloadWalletV3 类的实例，我们需要传递 `publicKey`、`subwalletId` 和 `timeout` 以及代码：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3"; 
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(HighloadWalletV3.createFromConfig({
    publicKey: walletKeyPair.publicKey,
    subwalletId: 0x10ad,
    timeout: 60 * 60, // 1 hour
}, HIGHLOAD_V3_CODE));

console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs> 

现在我们需要一个普通钱包，我们将从这个钱包中部署合约：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { WalletContractV3R2 } from "@ton/ton";

const deployerWalletMnemonicArray = 'put your mnemonic'.split(' ');
const deployerWalletKeyPair = await mnemonicToWalletKey(deployerWalletMnemonicArray); // extract private and public keys from mnemonic
const deployerWallet = client.open(WalletContractV3R2.create({
    publicKey: deployerWalletKeyPair.publicKey,
    workchain: 0
}));
console.log(`Deployer wallet address: ${deployerWallet.address.toString()}`);
```

</TabItem>
</Tabs> 

如果你有一个 V4 版本的钱包，你可以使用 `WalletContractV4` 类。现在，我们要做的就是部署合约：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
await wallet.sendDeploy(deployerWallet.sender(deployerWalletKeyPair.secretKey), toNano(0.05));
```

</TabItem>
</Tabs> 

通过在资源管理器中查看输出到控制台的地址，我们可以验证钱包是否已部署。

### 发送高负载钱包 V3 信息

发送信息也是通过包装器完成的，但在这种情况下，我们需要额外保持查询 ID 的最新状态。首先，让我们获取一个钱包类的实例：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from "@ton/core";
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3";
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(HighloadWalletV3.createFromAddress(Address.parse('put your high-load wallet address')));
console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs> 

这有助于我们独立于使用库，并以更深入的方式理解TON区块链的结构。我们还学习了如何使用高负载钱包，并分析了许多与不同数据类型和各种操作相关的细节。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { HighloadQueryId } from "./wrappers/HighloadQueryId";

const queryHandler = HighloadQueryId.fromShiftAndBitNumber(0n, 0n);
```

</TabItem>
</Tabs> 

由于这是第一次请求，所以我们在这里输入零。但是，如果您之前发送过任何信息，则需要选择这些值中未使用的组合。现在，让我们创建一个数组来存储所有操作，并在其中添加一个操作来获取 TONs 返回值：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, internal, OutActionSendMsg, SendMode, toNano } from "@ton/core";

const actions: OutActionSendMsg[] = [];
actions.push({
    type: 'sendMsg',
    mode: SendMode.CARRY_ALL_REMAINING_BALANCE,
    outMsg: internal({
        to: Address.parse('put address of deployer wallet'),
        value: toNano(0),
        body: beginCell()
            .storeUint(0, 32)
            .storeStringTail('Hello, TON!')
            .endCell()
    })
});
```

</TabItem>
</Tabs> 

代码的主要来源：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subwalletId = 0x10ad;
const timeout = 60 * 60; // must be same as in the contract
const internalMessageValue = toNano(0.01); // in real case it is recommended to set the value to 1 TON
const createdAt = Math.floor(Date.now() / 1000) - 60; // LiteServers have some delay in time
await wallet.sendBatch(
    walletKeyPair.secretKey,
    actions,
    subwalletId,
    queryHandler,
    timeout,
    internalMessageValue,
    SendMode.PAY_GAS_SEPARATELY,
    createdAt
);
```

</TabItem>
</Tabs> 

外部参考：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
queryHandler.getNext();
```

</TabItem>
</Tabs> 

## 🔥 高负载钱包 V2（已过时）

在某些情况下，每笔交易可能需要发送大量信息。如前所述，普通钱包通过在单个 cell 中存储 [最多 4 个引用](/v3/documentation/data-formats/tlb/cell-boc#cell)，一次最多支持发送 4 条信息。高负载钱包只允许同时发送 255 条信息。之所以存在这一限制，是因为区块链配置设置中的最大发送消息（操作）数被设置为 255。

交易所可能是大规模使用高负载钱包的最佳例子。像 Binance 这样的老牌交易所拥有极其庞大的用户群，这意味着需要在短时间内处理大量的取款信息。高负载钱包有助于处理这些取款请求。

### 高负载钱包 FunC 代码

首先，我们来看看 [高负载钱包智能合约的代码结构](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)：

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, query_id) = (cs~load_uint(32), cs~load_uint(64)); ;; get rest values from the message body
  var bound = (now() << 32); ;; bitwise left shift operation
  throw_if(35, query_id < bound); ;; throw an error if message has expired
  var ds = get_data().begin_parse();
  var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds
  (_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
  throw_if(32, found?); ;; if yes throw an error
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  var dict = cs~load_dict(); ;; get dictionary with messages
  cs.end_parse(); ;; make sure we do not have anything in cs
  accept_message();
```

> 💡 Useful links:
>
> [文档中的 "位运算"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)
>
> [文档中的"load_dict()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
>
> [文档中的"udict_get?()"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)

如我们之前讨论的，普通钱包在每次交易后 seqno 增加 `1`。在使用钱包序列时，我们必须等待这个值更新，然后使用 GET 方法检索它并发送新的交易。
这个过程需要很长时间，高负载钱包不是为此设计的（如上所述，它们旨在快速发送大量交易）。因此，TON上的高负载钱包使用了 `query_id`。

### 使用 Query ID 代替 Seqno

正如我们之前讨论过的，普通钱包 seqno 在每次交易后都会增加 `1`。在使用钱包序列时，我们必须等待该值更新，然后使用 GET 方法检索该值并发送新消息。
这个过程需要花费大量时间，而高负载钱包的设计并不适合这个过程（如上所述，它们的目的是快速发送大量信息）。因此，TON 上的高负载钱包使用了 `query_id`。

如果同一信息请求已经存在，合约将不会接受它，因为它已经被处理过了：

```func
var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
ds.end_parse(); ;; make sure we do not have anything in ds
(_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
throw_if(32, found?); ;; if yes throw an error
```

这样，我们就能**防止重复信息**，而这正是 seqno 在普通钱包中的作用。

### 发送信息

合约接受外部报文后，就会开始一个循环，在循环中提取字典中存储的 `slices`。这些片段存储消息的模式和消息本身。发送新信息直到字典清空为止。

```func
int i = -1; ;; we write -1 because it will be the smallest value among all dictionary keys
do {
  (i, var cs, var f) = dict.idict_get_next?(16, i); ;; get the key and its corresponding value with the smallest key, which is greater than i
  if (f) { ;; check if any value was found
    var mode = cs~load_uint(8); ;; load message mode
    send_raw_message(cs~load_ref(), mode); ;; load message itself and send it
  }
} until (~ f); ;; if any value was found continue
```

> 💡 Useful link:
>
> [文档中的"idict_get_next()"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)

请注意，如果找到一个值，`f` 总是等于-1（true）。`~ -1` 操作（比特非 (bitwise not)）总是返回值为 0，这意味着循环应该继续。同时，当字典中充满了信息时，有必要开始计算那些 **值大于-1**（例如 0）的信息，并随着每条信息继续增加 1。这种结构可以使报文按照正确的顺序发送。

### 删除过期查询

通常情况下，[TON 上的智能合约为自己的存储付费](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee)。这意味着智能合约可存储的数据量是有限的，以防止出现高网络负载。为了提高系统效率，存储时间超过 64 秒的信息会被删除。具体操作如下

```func
bound -= (64 << 32);   ;; clean up records that have expired more than 64 seconds ago
old_queries~udict_set_builder(64, query_id, begin_cell()); ;; add current query to dictionary
var queries = old_queries; ;; copy dictionary to another variable
do {
  var (old_queries', i, _, f) = old_queries.udict_delete_get_min(64);
  f~touch();
  if (f) { ;; check if any value was found
    f = (i < bound); ;; check if more than 64 seconds have elapsed after expiration
  }
  if (f) { 
    old_queries = old_queries'; ;; if yes save changes in our dictionary
    last_cleaned = i; ;; save last removed query
  }
} until (~ f);
```

> 💡 Useful link:
>
> [文档中的"udict_delete_get_min()"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_delete_get_min)

请注意，有必要多次与 `f` 变量交互。由于 [TVM 是堆栈机器](/v3/documentation/tvm/tvm-overview#tvm-is-a-stack-machine)，在每次与 `f` 变量交互时，都需要弹出所有值以获得所需的变量。f~touch()\` 操作

[Content truncated due to size limit]


================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/overview.mdx
================================================
import Button from '@site/src/components/button'

# 概览

:::info
本文需要更新。请帮助我们改进它。
:::

**本页包含了可以帮助您确保智能合约安全的建议。**

如果您正在创建智能合约，那么在这里您可以看到一些示例，这些错误可能导致您丢失资金：

- [TON Hack挑战赛#1](https://github.com/ton-blockchain/hack-challenge-1)
  - [从TON Hack挑战赛中得出的结论](/develop/smart-contracts/security/ton-hack-challenge-1)

## TON 课程：安全性

:::tip
在深入学习开发人员层面的安全知识之前，请确保您已充分了解用户层面的主题。为此，建议您学习 [Blockchain Basics with TON](https://stepik.org/course/201294/promo) （[RU 版本](https://stepik.org/course/202221/), [CHN 版本](https://stepik.org/course/200976/)）课程，其中模块 5 涵盖用户安全基础知识。
:::

第8模块完全涵盖了TON区块链上智能合约的安全性。

第8模块完全涵盖了TON区块链上智能合约的安全性。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

查看TON区块链课程

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

中文

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random-number-generation.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random-number-generation.md
================================================
# 随机数生成

生成随机数是许多不同项目中常见的任务。你可能已经在FunC文档中看到过`random()`函数，但请注意，除非你采用一些额外的技巧，否则其结果很容易被预测。

## 如何预测随机数？

计算机在生成随机信息方面非常糟糕，因为它们只是遵循用户的指令。然而，由于人们经常需要随机数，他们设计了各种方法来生成_伪随机_数。

这些算法通常要求你提供一个_seed_值，该值将被用来生成一系列_伪随机_数。因此，如果你多次运行相同的程序并使用相同的_seed_，你将始终得到相同的结果。在TON中，每个区块的_seed_是不同的。

- [区块随机seed的生成](/develop/smart-contracts/security/random)

因此，要预测智能合约中`random()`函数的结果，你只需要知道当前区块的`seed`，如果你不是验证者，这是不可能的。

## 只需使用`randomize_lt()`

为了使随机数生成不可预测，你可以将当前的[逻辑时间](/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)添加到seed中，这样不同的交易将具有不同的seed和结果。

只需在生成随机数之前调用`randomize_lt()`，你的随机数就会变得不可预测：

```func
randomize_lt();
int x = random(); ;; users can't predict this number
```

然而，你应该注意验证者或协作者仍然可能影响随机数的结果，因为他们决定了当前区块的seed。

## 有没有办法防止验证者操纵？

为了防止（或至少复杂化）验证者替换seed，你可以使用更复杂的方案。例如，你可以在生成随机数之前跳过一个区块。如果我们跳过一个区块，seed将以不太可预测的方式改变。

跳过区块并不是一个复杂的任务。你可以通过简单地将消息发送到主链，然后再发送回你合约的工作链来完成。让我们来看一个简单的例子！

:::caution
不要在真实项目中使用此示例合约，请自己编写。
:::

### 任何工作链中的主合约

让我们以一个简单的彩票合约为例。用户将向它发送1 TON，有50%的机会会得到2 TON回报。

```func
;; set the echo-contract address
const echo_address = "Ef8Nb7157K5bVxNKAvIWreRcF0RcUlzcCA7lwmewWVNtqM3s"a;

() recv_internal (int msg_value, cell in_msg_full, slice in_msg_body) impure {
    var cs = in_msg_full.begin_parse();
    var flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore bounced messages
        return ();
    }
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    if ((op == 0) & equal_slice_bits(in_msg_body, "bet")) { ;; bet from user
        throw_unless(501, msg_value == 1000000000); ;; 1 TON

        send_raw_message(
            begin_cell()
                .store_uint(0x18, 6)
                .store_slice(echo_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
                .store_uint(1, 32) ;; let 1 be echo opcode in our contract
                .store_slice(sender) ;; forward user address
            .end_cell(),
            64 ;; send the remaining value of an incoming msg
        );
    }
    elseif (op == 1) { ;; echo
        throw_unless(502, equal_slice_bits(sender, echo_address)); ;; only accept echoes from our echo-contract

        slice user = in_msg_body~load_msg_addr();

        {-
            at this point we have skipped 1+ blocks
            so let's just generate the random number
        -}
        randomize_lt();
        int x = rand(2); ;; generate a random number (either 0 or 1)
        if (x == 1) { ;; user won
            send_raw_message(
                begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(user)
                    .store_coins(2000000000) ;; 2 TON
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
                .end_cell(),
                3 ;; ignore errors & pay fees separately
            );
        }
    }
}
```

在你需要的任何工作链（可能是基本链）部署这个合约，就完成了！

## 这种方法100%安全吗？

虽然它确实有所帮助，但如果入侵者同时控制了几个验证者，仍然有可能被操纵。在这种情况下，他们可能会以某种概率[影响](/develop/smart-contracts/security/random#conclusion)依赖的_seed_。即使这种可能性极小，仍然值得考虑。

随着最新的TVM升级，向`c7`寄存器中引入新值可以进一步提高随机数生成的安全性。具体来说，升级在`c7`寄存器中添加了关于最近16个主链区块的信息。

由于主链区块信息的不断变化性质，它可以作为随机数生成的额外熵源。通过将这些数据纳入你的随机算法中，你可以创建出更难以被潜在对手预测的数字。

有关此TVM升级的更多详细信息，请参考[TVM升级](/learn/tvm-instructions/tvm-upgrade-2023-07)。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random.md
================================================
# 区块随机 seed 的生成

:::caution
此信息在撰写时是最新的。它可能会在任何网络升级时发生变化。
:::

偶尔，在TON上会创建一个彩票合约。通常它使用不安全的方法来处理随机性，因此生成的值可以被用户预测，彩票可能被耗尽。

但是，利用随机数生成中的弱点通常涉及使用代理合约，如果随机值正确，代理合约会转发消息。存在有关钱包合约的提案，这些合约将能够执行链上任意代码（当然由用户指定和签名），但大多数流行的钱包版本不支持这样做。那么，如果彩票检查赌徒是否通过钱包合约参与，它是否安全？

或者，这个问题可以这样表述。外部消息能否被包含在随机值正好符合发送者需求的区块中？

当然，发送者无法以任何方式影响随机性。但是生成区块并包含提议的外部消息的验证者可以。

## 验证者如何影响seed

即使在白皮书中，关于这一点的信息也不多，所以大多数开发者都感到困惑。这是关于区块随机的唯一提及，在 [TON白皮书](https://docs.ton.org/ton.pdf) 中：

> 为每个分片(w, s)选择验证者任务组的算法是确定性伪随机的。**它使用验证者嵌入到每个主链区块中的伪随机数（通过使用阈值签名达成共识）来创建随机seed**，然后为每个验证者计算例如Hash(code(w). code(s).validator_id.rand_seed)。

然而，唯一被保证真实且最新的是代码。所以让我们看看 [collator.cpp](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/validator/impl/collator.cpp#L1590)：

```cpp
  {
    // generate rand seed
    prng::rand_gen().strong_rand_bytes(rand_seed->data(), 32);
    LOG(DEBUG) << "block random seed set to " << rand_seed->to_hex();
  }
```

这是生成区块随机seed的代码。它位于协作者代码中，因为它由生成区块的一方需要（并且对轻量级验证者不是必需的）。

所以，我们可以看到，seed是由单个验证者或协作者与区块一起生成的。下一个问题是：

## 在知道seed后是否可以决定包含外部消息？

是的，可以。证据如下：如果外部消息被导入，它的执行必须成功。执行可以依赖于随机值，所以保证seed事先已知。

因此，如果发送者可以与验证者合作，那么确实**存在**一种方法来攻击"不安全"（让我们称之为单区块，因为它不使用发送消息后的任何区块信息）随机。即使使用了`randomize_lt()`。验证者可以生成适合发送者的seed，或者将提议的外部消息包含在将满足所有条件的区块中。这样做的验证者仍然被认为是公平的。这就是去中心化的本质。

为了让这篇文章完全覆盖随机性，这里还有一个问题。

## 区块seed如何影响合约中的随机数？

验证者生成的seed并不直接用于所有合约。相反，它是[与账户地址一起哈希](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/crypto/block/transaction.cpp#L876)的。

```cpp
bool Transaction::prepare_rand_seed(td::BitArray<256>& rand_seed, const ComputePhaseConfig& cfg) const {
  // we might use SHA256(block_rand_seed . addr . trans_lt)
  // instead, we use SHA256(block_rand_seed . addr)
  // if the smart contract wants to randomize further, it can use RANDOMIZE instruction
  td::BitArray<256 + 256> data;
  data.bits().copy_from(cfg.block_rand_seed.cbits(), 256);
  (data.bits() + 256).copy_from(account.addr_rewrite.cbits(), 256);
  rand_seed.clear();
  data.compute_sha256(rand_seed);
  return true;
}
```

然后，伪随机数是使用 [TVM指令](/learn/tvm-instructions/instructions#112-pseudo-random-number-generator-primitives) 页面上描述的过程生成的：

> **x\{F810} RANDU256**\
> 生成一个新的伪随机无符号256位整数x。算法如下：如果r是随机seed的旧值，被视为一个32字节的数组（通过构造无符号256位整数的大端表示），那么计算它的sha512(r)；这个哈希的前32字节被存储为随机seed的新值r'，剩余的32字节作为下一个随机值x返回。

我们可以通过查看 [准备c7合约](https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.cpp#L903) 的代码（c7是存储临时数据的元组，存储合约地址、起始余额、随机seed等）和 [随机值本身的生成](https://github.com/ton-blockchain/ton/blob/master/crypto/vm/tonops.cpp#L217-L268) 来确认这一点。

## 结论

TON中没有随机是完全安全的，就不可预测性而言。这意味着**这里不可能存在完美的彩票**，也不可能相信任何彩票是公平的。

PRNG的典型用途可能包括`randomize_lt()`，但是可以通过选择正确的区块向它发送消息来欺骗这样的合约。提出的解决方案是向其他工作链发送消息，接收回答，从而跳过区块等...但这只是推迟了威胁。事实上，任何验证者（即TON区块链的1/250）都可以在正确的时间选择发送请求给彩票合约，以便来自其他工作链的回复在他生成的区块中到达，然后他可以选择他希望的任何区块seed。一旦协作者出现在主网，危险将会增加，因为他们永远不会因为标准投诉而被罚款，因为他们不会向Elector合约注入任何资金。

<!-- TODO: find an example contract using random without any additions, show how to find result of RANDU256 knowing block random seed (implies link on dton.io to show generated value) -->

<!-- TODO: next article. "Let's proceed to writing tool that will exploit this. It will be attached to validator and put proposed external messages in blocks satisfying some conditions - provided some fee is paid." -->



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/secure-programming.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/secure-programming.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# 安全智能合约编程

在本节中，我们将介绍 TON 区块链最有趣的几个功能，然后介绍开发人员在 FunC 上编写智能合约的最佳实践清单。

## 合约分片

在为 EVM 开发合约时，为了方便起见，通常会将项目拆分为多个合约。在某些情况下，可以在一份合约中实现所有功能，即使在有必要拆分合约的情况下（例如，自动做市商中的流动性对），也不会造成任何特殊困难。交易全部执行：要么全部成功，要么全部失败。

在 TON 中，强烈建议避免 "无界数据结构 (unbounded data structures)" 和[将单个逻辑合约分割成小块](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)，每个小块管理少量数据。基本的例子是 TON Jettons 的实现。这是 TON 版本的以太坊 ERC-20 代币标准。简而言之，我们有

1. 一个 `jetton-minter`，用于存储 `total_supply`、`minter_address` 和几个引用：令牌描述（元数据）和 `jetton_wallet_code`。
2. 还有大量的 jetton 钱包，每个 jetton 的所有者都有一个。每个钱包只存储所有者的地址、余额、jetton-minter 地址和 jetton_wallet_code 的链接。

这样做是必要的，因为这样可以在钱包之间直接传输 Jettons，而不会影响任何高负载地址，这对并行处理交易至关重要。

也就是说，做好准备，让你的合约变成 "一组合约"，而且它们之间会积极互动。

## 可以部分执行交易

合约逻辑中出现了一个新的独特属性：部分执行交易。

例如，考虑一下标准 TON Jetton 的信息流：

![smart1.png](/img/docs/security-measures/secure-programming/smart1.png)

如图所示：

1. 发送者会向其钱包 (`sender_wallet`)发送一条`op::transfer`信息；
2. `sender_wallet` 减少令牌余额；
3. 发送方钱包向接收方钱包（目的地钱包）发送 `op::internal_transfer` 消息；
4. `destination_wallet` 增加其令牌余额；
5. `destination_wallet` 向其所有者 (`destination`)发送 `op::transfer_notification` ；
6. `destination_wallet` 在 `response_destination` （通常是 `sender`）上返回带有 `op::excesses` 信息的多余 gas 。

请注意，如果 `destination_wallet` 无法处理 `op::internal_transfer` 消息（出现异常或 gas 耗尽），则不会执行此部分和后续步骤。但第一步（减少 `sender_wallet` 中的余额）将会完成。结果是部分执行了交易，`Jetton`的状态不一致，在这种情况下，钱会丢失。

在最坏的情况下，所有代币都可能以这种方式被盗。试想一下，你先给用户累积奖金，然后向他们的 Jetton 钱包发送 `op::burn` 消息，但你不能保证  `op::burn` 会被成功处理。

## TON 智能合约开发者必须控制 gas 

在 Solidity 中，合约开发人员不太关心 gas 问题。如果用户提供的 gas 太少，一切都会恢复原状，就像什么都没发生过一样（但 gas 不会退还）。如果用户提供了足够的 gas ，实际成本将自动计算并从余额中扣除。

在 TON，情况有所不同：

1. 如果没有足够的 gas ，交易将被部分执行；
2. 如果 gas 过多，多余部分必须退还。这是开发商的责任；
3. 如果 "一组合约" 交换信息，则必须在每条信息中进行控制和计算。

TON 无法自动计算 gas 。交易的完整执行及其所有后果可能需要很长时间，到最后，用户钱包里可能没有足够的 TON 币。这里再次使用了携带价值原则。

## TON 智能合约开发人员必须管理存储空间

TON 中典型的消息处理程序就是采用这种方法：

```func
() handle_something(...) impure {
    (int total_supply, <a lot of vars>) = load_data();
    ... ;; do something, change data
    save_data(total_supply, <a lot of vars>);
}
```

不幸的是，我们注意到一种趋势：`<a lot of vars>` 是对所有合约数据字段的真正枚举。例如

```func
(
    int total_supply, int swap_fee, int min_amount, int is_stopped, int user_count, int max_user_count,
    slice admin_address, slice router_address, slice jettonA_address, slice jettonA_wallet_address,
    int jettonA_balance, int jettonA_pending_balance, slice jettonB_address, slice jettonB_wallet_address,
    int jettonB_balance, int jettonB_pending_balance, int mining_amount, int datetime_amount, int minable_time,
    int half_life, int last_index, int last_mined, cell mining_rate_cell, cell user_info_dict, cell operation_gas,
    cell content, cell lp_wallet_code
) = load_data();
```

这种方法有许多缺点。

首先，如果您决定添加另一个字段，例如 `is_paused`，那么您就需要更新整个合约中的 `load_data()/save_data()` 语句。这不仅耗费大量人力，还会导致难以捕捉的错误。

在最近的一次 CertiK 审核中，我们注意到开发人员在某些地方混淆了两个参数，并写道：

```func
save_data(total_supply, min_amount, swap_fee, ...)
```

在没有专家团队进行外部审计的情况下，很难发现这样的漏洞。这个函数很少被使用，而且两个混淆的参数值通常都为零。要发现这样的错误，你必须知道自己在寻找什么。

其次是 "命名空间污染"。让我们用审计中的另一个例子来解释问题所在。在函数的中间部分，输入参数为

```func
int min_amount = in_msg_body~load_coins();
```

也就是说，存储字段被局部变量遮蔽（shadowing），在函数末尾，被覆盖的值被写回了存储中。攻击者因此有机会篡改合约的状态。这一问题更为严重的是，FunC 允许[变量重新声明](/v3/documentation/smart-contracts/func/docs/statements#variable-declaration)：“这不是一次声明，而仅仅是一次编译时的类型检查，确保 `min_amount` 的类型为 `int`。”

最后，每次调用每个函数时都要解析整个存储空间并打包回去，这也增加了 gas 成本。

## 小贴士

### 1.始终绘制信息流程图

即使是在像 TON Jetton 这样的简单合约中，也已经有相当多的消息、发送方、接收方以及消息中包含的数据块。现在想象一下，当你在开发一些更复杂的东西时，比如去中心化交易所（DEX），一个工作流中的消息数量可能会超过十条，你会怎么想？

![smart2.png](/img/docs/security-measures/secure-programming/smart2.png)

在 CertiK，我们使用 [DOT](https://en.wikipedia.org/wiki/DOT_(graph_description_language))语言在审计过程中描述和更新此类图表。我们的审计人员发现，这有助于他们直观地理解合约内部和合约之间复杂的互动关系。

### 2.避免失败并捕捉被退回的信息

使用信息流，首先定义入口点。这是在您的合约组（"后果"）中启动一连串信息的信息。在这里，一切都需要检查（有效载荷、 gas 供应等），以尽量减少后续阶段出现故障的可能性。

如果您不能确定是否能完成所有计划（例如，用户是否有足够的代币来完成交易），这意味着信息流的构建可能不正确。

在随后的信息（后果）中，所有 `throw_if()/throw_unless()` 都将扮演断言的角色，而不是实际检查什么。

许多合约还会处理退回的邮件，以防万一。

例如，在 TON Jetton 中，如果收件人的钱包无法接受任何代币（这取决于接收逻辑），那么发件人的钱包将处理退回的消息，并将代币返还到自己的余额中。

```func
() on_bounce (slice in_msg_body) impure {
    in_msg_body~skip_bits(32);  ;;0xFFFFFFFF

    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();

    int op = in_msg_body~load_op();

    throw_unless(error::unknown_op, (op == op::internal_transfer) | (op == op::burn_notification));

    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();

    balance += jetton_amount;
    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

一般情况下，我们建议处理被退回的报文，但不能将其作为完全防止报文处理失败和执行不完整的手段。

发送和处理被退回的消息需要消耗 gas ，如果发件人没有提供足够的 gas ，那么就没有被退回的消息。

其次，TON 不提供跳转链。这意味着被跳转的信息不能再被跳转。例如，如果第二条信息是在入口报文之后发送的，而第二条信息触发了第三条信息，那么入口合约将不会知道第三条信息处理失败。同样，如果第一条信息的处理发送了第二条和第三条信息，那么第二条信息的处理失败也不会影响第三条信息的处理。

### 3.预计会出现信息流中间人

信息级联可在多个区块中处理。假设在一个信息流运行时，攻击者可以并行启动第二个信息流。也就是说，如果在一开始就检查了某个属性（如用户是否有足够的代币），就不要假定在同一合约的第三阶段，用户仍然满足该属性。

### 4.使用携带值 (Carry-Value) 模式

由上一段可以看出，合约之间的消息必须携带有值的内容。

在同一个 TON Jetton 中，这一点得到了证明：`sender_wallet` 减去余额并将其与 `op::internal_transfer` 消息一起发送到 `destination_wallet`，反过来，它收到余额并将其与消息一起添加到自己的余额中（或将其弹回）。

下面就是一个错误执行的例子。为什么不能在链上查询 Jetton 余额？因为这个问题不符合模式。当 `op::get_balance` 消息的响应到达请求者时，余额可能已经被别人花掉了。

在这种情况下，您可以采用另一种方法：
![smart3.png](/img/docs/security-measures/secure-programming/smart3.png)

1. 主账户向钱包发送信息 `op::provide_balance` ；
2. 钱包将余额清零，并发回 `op::take_balance`；
3. 主人收到钱后，判断钱是否够用，要么使用（借钱还钱），要么把钱送回钱包。

### 5.返回值而不是拒绝

从前面的观察中可以看出，你的合约组经常收到的不仅仅是一个请求，而是一个请求和一个值。因此，我们不能拒绝执行请求（通过 `throw_unless()`），而必须将 Jettons 发送回发送者。

例如，一个典型的流程启动（见 TON Jetton 报文流程）：

1. `sender` 通过 `sender_wallet` 向 `your_contract_wallet` 发送 `op::transfer` 消息，并为您的合约指定 `forward_ton_amount` 和 `forward_payload`；
2. `sender_wallet` 向 `your_contract_wallet` 发送 `op::internal_transfer` 信息；
3. `your_contract_wallet` 向 `your_contract` 发送 `op::transfer_notification` 消息，传递 `forward_ton_amount`, `forward_payload`, 以及 `sender_address` 和 `jetton_amount` ；
4. 在合约的 `handle_transfer_notification()` 中，流程开始了。

在这里，你需要弄清楚这是一个什么样的请求，是否有足够的 gas 来完成它，以及有效载荷中的所有内容是否正确。在这一阶段，不应使用`throw_if()/throw_unless()`，因为这样会导致 Jettons 丢失，请求无法执行。值得使用 try-catch 语句[从 FunC v0.4.0 开始可用](/v3/documentation/smart-contracts/funcs/docs/statements#try-catch-statements)。

如果不符合合约规定，则必须退回 jetton 。

在最近的一次审计中，我们发现了这种脆弱的执行方式的一个例子。

```func
() handle_transfer_notification(...) impure {
...
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    slice from_jetton_address = in_msg_body~load_msg_addr();

    if (msg_value < gas_consumption) { ;; not enough gas provided
        if (equal_slices(from_jetton_address, jettonA_address)) {
            var msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(jettonA_wallet_address)
                .store_coins(0)
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            ...
        }
    ...
}
```

正如您所看到的，这里的 "return" 是发送到 `jettonA_wallet_address`，而不是 `sender_address`。由于所有决定都是根据对`in_msg_body`的分析做出的，因此攻击者可以伪造虚假信息并套取资金。请始终将回执发送至`sender_address`。

如果您的合约接受 Jetton，那么就不可能知道来的确实是预期的 Jetton，还是只是某个人的 `op::transfer_notification`。

如果您的合约收到了意外或未知的 Jettons，也必须退回。

### 6.计算 gas 并检查 msg_value

根据消息流程图，我们可以估算出每种情况下每个处理程序的成本，并插入 msg_value 的充分性检查。

您不能只要求保证金，例如 1  TON （本文撰写之日主网上的 gas 限额），因为这些 gas 必须在 "后果(consequences)" 中分配。假设您的合约发送了三条信息，那么每条信息只能发送 0.33  TON 。这意味着他们应该 "要求 "更少。仔细计算整个合约的 gas 需求量非常重要。

如果在开发过程中，您的代码开始发送更多信息，情况就会变得更加复杂。需要重新检查和更新 gas 要求。

### 7.小心退回多余 gas 

如果不将多余的 gas 退还给寄件人，这些资金就会在您的合约中长期累积。从原则上讲，这并不可怕，只是一种次优做法。您可以添加一个功能来清除多余的 gas ，但像 TON Jetton 这样的流行合约仍会以信息 `op::excesses` 返回发送者。

TON 有一个有用的机制：`SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64`。在 `send_raw_message()` 中使用这种模式时，其余的 gas 将与消息一起（或返回）转发给新的收件人。如果消息流是线性的：每个消息处理程序只发送一条消息，那么这种模式就很方便。但在某些情况下，不建议使用这种机制：

1. 如果合约中没有其他非线性处理程序，存储费将从合约余额中扣除，而不是从输入的 gas 中扣除。这意味着随着时间的推移，储存费会消耗掉整个余额，因为所有进入的 gas 都必须用完；
2. 如果您的合约发出事件，即向外部地址发送信息。该操作的费用将从合约余额中扣除，而不是从 msg_value 中扣除。

```func
() emit_log_simple (int event_id, int query_id) impure inline {
    var msg = begin_cell()
        .store_uint (12, 4)             ;; ext_out_msg_info$11 addr$00
        .store_uint (1, 2)              ;; addr_extern$01
        .store_uint (256, 9)            ;; len:(## 9)
        .store_uint(event_id, 256);     ;; external_address:(bits len)
        .store_uint(0, 64 + 32 + 1 + 1) ;; lt, at, init, body
        .store_query_id(query_id)
        .end_cell();

    send_raw_message(msg, SEND_MODE_REGULAR);
}
```

3. 如果您的合约在发送信息时附加了值或使用了 `SEND_MODE_PAY_FEES_SEPARETELY = 1`。这些操作会从合约余额中扣除，这意味着未使用的返回是 "亏本工作"。

在上述情况下，采用人工近似计算盈余：

```func
int ton_balance_before_msg = my_ton_balance - msg_value;
int storage_fee = const::min_tons_for_storage - min(ton_balance_before_msg, const::min_tons_for_storage);
msg_value -= storage_fee + const::gas_consumption;

if(forward_ton_amount) {
    msg_value -= (forward_ton_amount + fwd_fee);
...
}

if (msg_value > 0) {    ;; there is still something to return

var msg = begin_cell()
    .store_uint(0x10, 6)
    .store_slice(response_address)
    .store_coins(msg_value)
...
}
```

请记住，如果合约余额用完，交易将被部分执行，这是不允许的。

### 8.使用嵌套存储

我们建议采用以下存储组织方法：

```func
() handle_something(...) impure {
    (slice swap_data, cell liquidity_data, cell mining_data, cell discovery_data) = load_data();
    (int total_supply, int swap_fee, int min_amount, int is_stopped) = swap_data.parse_swap_data();
    …
    swap_data = pack_swap_data(total_supply + lp_amount, swap_fee, min_amount, is_stopped);
    save_data(swap_data, liquidity_data, mining_data, discovery_data);
}
```

存储由相关数据块组成。如果每个函数都使用一个参数，例如 `is_paused`，那么 `load_data()` 会立即提供该参数。如果一个参数组只在一种情况下需要使用，那么它就不需要解压缩，也不需要打包，更不会堵塞命名空间。

如果存储结构需要更改（通常是添加一个新字段），那么需要进行的编辑就会大大减少。

此外，这种方法还可以重复使用。如果我们的合约中有 30 个存储字段，那么一开始你可以得到四组，然后从第一组中得到几个变量和另一个子组。最主要的是不要做得太过分。

请注意，由于一个 cell 最多可存储 1023 位数据和 4 个引用，因此无论如何都必须将数据分割到不同的 cell 中。

分层数据是 TON 的主要功能之一，让我们将其用于预期目的。

可以使用全局变量，尤其是在原型设计阶段，因为在这个阶段，合约中存储的内容并不完全明确。

```func
global int var1;
global cell var2;
global slice var3;

() load_data() impure {
    var cs = get_data().begin_parse();
    var1 = cs~load_coins();
    var2 = cs~load_ref();
    var3 = cs~load_bits(512);
}

() save_data() impure {
    set_data(
        begin_cell()
            .store_coins(var1)
            .store_ref(var2)
            .store_bits(var3)
            .end_cell()
        );
}
```

这样，如果发现需要另一个变量，只需添加一个新的全局变量并修改 `load_data()` 和 `save_data()`。整个合约无需任何改动。不过，由于全局变量的数量有限制（不超过 31 个），这种模式可以与上文推荐的 "嵌套存储 "相结合。

全局变量通常也比将所有内容都存储在堆栈中更昂贵。不过，这取决于堆栈排列的数量，因此使用全局变量作为原型是个不错的主意，当存储结构完全清晰后，再改用具有 "嵌套 "模式的堆栈变量。

### 9.使用 end_parse()

从存储器和消息有效载荷读取数据时，尽可能使用 `end_parse()`。由于 TON 使用的是数据格式可变的比特流，因此确保读取的数据量与写入的数据量相等是很有帮助的。这可以节省一个小时的调试时间。

### 10. 使用更多的辅助函数，避免魔法数字

这个技巧并非 FunC 独有，但在这里尤其适用。编写更多的封装器和辅助函数，并声明更多的常量。

FunC 最初包含了大量的魔法数字。如果开发者不加以限制其使用，最终的结果可能就会像这样：

```func
var msg = begin_cell()
    .store_uint(0xc4ff, 17)         ;; 0 11000100 0xff
    .store_uint(config_addr, 256)
    .store_grams(1 << 30)           ;; ~1 gram of value
    .store_uint(0, 107)
    .store_uint(0x4e565354, 32)
    .store_uint(query_id, 64)
    .store_ref(vset);

send_raw_message(msg.end_cell(), 1);
```

这是来自真实项目的代码，会吓跑新手。

幸运的是，在 FunC 的最新版本中，一些标准声明可以使代码更清晰、更有表现力。例如

```func
const int SEND_MODE_REGULAR = 0;
const int SEND_MODE_PAY_FEES_SEPARETELY = 1;
const int SEND_MODE_IGNORE_ERRORS = 2;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;

builder store_msgbody_prefix_stateinit(builder b) inline {
    return b.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1);
}

builder store_body_header(builder b, int op, int query_id) inline {
    return b.store_uint(op, 32).store_uint(query_id, 64);
}

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
    slice to_wallet_address = calculate_address_by_state_init(state_init);

    var msg = begin_cell()
        .store_msg_flags(BOUNCEABLE)
        .store_slice(to_wallet_address)
        .store_coins(amount)
        .store_msgbody_prefix_stateinit()
        .store_ref(state_init)
        .store_ref(master_msg);

    send_raw_message(msg.end_cell(), SEND_MODE_REGULAR);
}
```

## 参考资料

原文作者：CertiK

- [原文](https://blog.ton.org/secure-smart-contract-programming-in-func)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/things-to-focus.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/things-to-focus.md
================================================
# 使用 TON 区块链时应注意的事项

在本文中，我们将回顾和讨论希望开发 TON 应用程序的人员需要考虑的要素。

## 检查清单

### 1.名称碰撞

Func 变量和函数几乎可以包含任何合法字符。例如，`var++`、`~bits`、`foo-bar+baz`（包括逗号）都是有效的变量和函数名。

在编写和检查 Func 代码时，应使用 Linter。

- [集成开发环境插件](/v3/documentation/smart-contracts/getting-started/ide-plugins/)

### 2. 检查抛出值

TVM 的执行每次正常停止时，都会以退出代码 `0` 或 `1` 停止。虽然 TVM 是自动执行的，但如果通过 `throw(0)` 或 `throw(1)` 命令直接抛出退出代码 `0` 和 `1`，TVM 的执行可能会被意外直接中断。

- [如何处理错误](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- [TVM 退出代码](/v3/documentation/tvm/tvm-exit-codes)

### 3. Func 是一种严格类型化的语言，其数据结构存储的正是它们应该存储的内容

跟踪代码的操作和可能返回的结果至关重要。请记住，编译器只关心代码，而且只关心代码的初始状态。在某些操作之后，某些变量的存储值可能会发生变化。

读取意外变量值和调用不应该有此类方法的数据类型的方法（或其返回值未正确存储）都是错误，不会作为 "警告 "或 "通知 "跳过，而是会导致代码无法运行。请记住，存储意外值可能没有问题，但读取意外值可能会导致问题，例如，对于整数变量，可能会抛出错误代码 5（整数超出预期范围）。

### 4.信息具有模式(modes)

必须检查报文模式，特别是它与之前发送的报文和费用之间的相互关系。可能出现的故障是没有考虑存储费用，在这种情况下，合约可能会耗尽 TON，导致发送信息时出现意外故障。您可以查看消息模式 [此处](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)。

### 5. TON完全实现演员模型

这意味着合约的代码可以更改。既可以使用 [`SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code)TVM 指令永久更改代码，也可以在运行时将 TVM 代码注册表设置为新的 cell 值，直到执行结束。

### 6.TON 区块链有几个交易阶段：计算阶段、行动阶段和反弹阶段。

计算阶段会执行智能合约的代码，然后才会执行操作（发送消息、修改代码、更改库等）。因此，与基于以太坊的区块链不同的是，如果你预计发送的消息会失败，就不会看到计算阶段的退出代码，因为它不是在计算阶段执行的，而是在之后的操作阶段执行的。

- [事务和阶段](/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 7. TON 合约是自治的

区块链中的合约可以驻留在不同的分片中，由其他验证器处理，这意味着开发者无法按需从其他合约中获取数据。因此，任何通信都是异步的，通过发送消息来完成。

- [从智能合约发送信息](/v3/documentation/smart-contracts/message-management/sending-messages)
- [从 DApp 发送信息](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 8. 与其他区块链不同，TON 不包含还原信息，只包含退出代码

在开始编写 TON 智能合约之前，考虑清楚代码流的退出代码路线图（并将其记录在案）是很有帮助的。

### 9. 具有 `method_id` 标识符的 Func 函数具有方法 ID

它们可以显式地设置为 `"method_id(5)"`，也可以由 func 编译器隐式地设置为 "method_id(5)"。在这种情况下，可以在 .fift 汇编文件的方法声明中找到它们。其中两个是预定义的：一个用于接收区块链内部的信息，通常称为 `recv_internal` ；另一个用于接收外部的信息，称为 `recv_external` 。

### 10. TON Crypto 地址可能没有任何代币或代码

TON 区块链中的智能合约地址是确定的，可以预先计算。与地址相关联的 Ton 账户甚至可能不包含任何代码，这意味着如果发送了带有特殊标志的消息，这些账户将被取消初始化（如果未部署）或冻结，同时不再拥有存储空间或 TON coins。

### 11. TON 地址可以有三种表示形式

TON 地址可以有三种表示法。
完整的表示法可以是 "原始"（`workchain:address`）的，也可以是 "用户友好 "的。最后一种是用户最常遇到的。它包含一个标签字节，表示地址是 "可跳转 "还是 "不可跳转"，以及一个工作链 id 字节。应注意这些信息。

- [原始地址和用户友好地址](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 12. 跟踪代码执行中的缺陷

与 Solidity 不同，在 Solidity 中，方法的可见性由用户自行设置，而在 Func 中，可见性则通过显示错误或 `if` 语句以更复杂的方式加以限制。

### 13. 在发送被退回的信息之前，请留意 gas 情况

如果智能合约用用户提供的值发送退回的信息，确保从退回的金额中减去相应的 gas 费用。

### 14. 监控回调及其失败

TON 区块链是异步的。这意味着信息不必先后到达。例如，当某个操作的失败通知到达时，应妥善处理。

### 15. 检查退信标志是否在接收内部邮件时发出

您可能会收到退回的信息（错误通知），应及时处理。

- [标准响应信息的处理](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

### 16. 为外部信息提供重放保护：

钱包（智能合约，存储用户资金）有两种自定义解决方案：`基于序列号(seqno-based)`（检查计数器，不重复处理消息）和 "高负载"（存储进程标识符及其过期时间）。

- [基于序列号的钱包](/v3/guidelines/apps/asset-processing/payments-processing/#seqno-based-wallets)
- [高负载钱包](/v3/guidelines/apps/asset-processing/payments-processing/#high-load-wallets)

## 参考资料

原文作者：0xguard

- [原文](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/ton-hack-challenge-1.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/ton-hack-challenge-1.md
================================================
# 从 TON Hack 挑战赛中得出结论

TON Hack挑战赛于10月23日举行。在TON主网上部署了几个带有人为安全漏洞的智能合约。每个合约都有3000或5000 TON的余额，允许参与者攻击它并立即获得奖励。

源代码和比赛规则托管在Github [这里](https://github.com/ton-blockchain/hack-challenge-1)。

## 合约

### 1. 互助基金

:::note 安全规则
始终检查函数是否有[`impure`](/develop/func/functions#impure-specifier)修饰符。
:::

第一个任务非常简单。攻击者可以发现`authorize`函数没有`impure`。这个修饰符的缺失允许编译器在函数不返回任何内容或返回值未使用时跳过对该函数的调用。

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. 银行

:::note 安全规则
始终检查[修改/非修改](/develop/func/statements#methods-calls)方法。
:::

使用`.`而不是`~`调用了`udict_delete_get?`，所以真正的 dict 没有被触及。

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note 安全规则
如果你真的需要，使用符号整数。
:::

投票权在消息中以整数形式存储。所以攻击者可以在转移投票权时发送一个负值，并获得无限投票权。

```func
(cell,()) transfer_voting_power (cell votes, slice from, slice to, int amount) impure {
  int from_votes = get_voting_power(votes, from);
  int to_votes = get_voting_power(votes, to);

  from_votes -= amount;
  to_votes += amount;

  ;; No need to check that result from_votes is positive: set_voting_power will throw for negative votes
  ;; throw_unless(998, from_votes > 0);

  votes~set_voting_power(from, from_votes);
  votes~set_voting_power(to, to_votes);
  return (votes,());
}
```

### 4. 彩票

:::note 安全规则
在执行[`rand()`](/develop/func/stdlib#rand)之前，始终随机化seed。
:::

seed来自交易的逻辑时间，黑客可以通过暴力破解当前区块中的逻辑时间来赢得比赛（因为lt在一个区块的边界内是连续的）。

```func
int seed = cur_lt();
int seed_size = min(in_msg_body.slice_bits(), 128);

if(in_msg_body.slice_bits() > 0) {
    seed += in_msg_body~load_uint(seed_size);
}
set_seed(seed);
var balance = get_balance().pair_first();
if(balance > 5000 * 1000000000) {
    ;; forbid too large jackpot
    raw_reserve( balance - 5000 * 1000000000, 0);
}
if(rand(10000) == 7777) { ...send reward... }
```

### 5. 钱包

:::note 安全规则
记住区块链上存储的一切。
:::

钱包受密码保护，其哈希存储在合约数据中。然而，区块链记住一切——密码在交易历史中。

### 6. 资金库

:::note 安全规则
始终检查[bounced](/develop/smart-contracts/guidelines/non-bouncable-messages)消息。
不要忘记由[标准](/develop/func/stdlib/)函数引起的错误。
尽可能使条件严格。
:::

资金库在数据库消息处理程序中有以下代码：

```func
int mode = null();
if (op == op_not_winner) {
    mode = 64; ;; Refund remaining check-TONs
               ;; addr_hash corresponds to check requester
} else {
     mode = 128; ;; Award the prize
                 ;; addr_hash corresponds to the withdrawal address from the winning entry
}
```

如果用户发送“支票”，资金库没有弹回处理程序或代理消息到数据库。在数据库中，我们可以设置`msg_addr_none`作为奖励地址，因为`load_msg_address`允许它。我们向资金库请求支票，数据库尝试解析`msg_addr_none`使用[`parse_std_addr`](/develop/func/stdlib#parse_std_addr)，并失败。消息从数据库弹回到金库，并且op不是`op_not_winner`。

### 7. 更好的银行

:::note 安全规则
永远不要为了好玩而销毁账户。做[`raw_reserve`](/develop/func/stdlib#raw_reserve)而不是把钱发给自己。考虑可能的竞争条件。小心哈希映射的gas费用消耗。
:::

合约中存在竞争条件：你可以存入钱，然后尝试在并发消息中两次提取它。无法保证保留有资金的消息会被处理，所以银行在第二次提款后可能会关闭。之后，合约可以被重新部署，任何人都可以提取未领取的资金。

### 8. 驱逐者

:::note 安全规则
避免在合约中执行第三方代码。
:::

```func
slice try_execute(int image, (int -> slice) dehasher) asm "<{ TRY:<{ EXECUTE DEPTH 2 THROWIFNOT }>CATCH<{ 2DROP NULL }> }>CONT"   "2 1 CALLXARGS";

slice safe_execute(int image, (int -> slice) dehasher) inline {
  cell c4 = get_data();

  slice preimage = try_execute(image, dehasher);

  ;; restore c4 if dehasher spoiled it
  set_data(c4);
  ;; clean actions if dehasher spoiled them
  set_c5(begin_cell().end_cell());

  return preimage;
}
```

在合约中安全执行第三方代码是不可能的，因为[`out of gas`](/learn/tvm-instructions/tvm-exit-codes#standard-exit-codes)异常不能被`CATCH`处理。攻击者可以简单地[`COMMIT`](/learn/tvm-instructions/instructions#11-application-specific-primitives)合约的任何状态，并引发`out of gas`。

## 结论

希望这篇文章能对FunC开发者揭示一些不明显的规则。

## 参考资料

原文作者 Dan Volkov

- [dvlkv on Github](https://github.com/dvlkv)
- [原文链接](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/overview.mdx
================================================
# 使用 Blueprint 编写测试

## 概览

测试工具包（通常是沙盒）已经包含在名为[Blueprint](/develop/smart-contracts/sdk/javascript)的TypeScript SDK中。您可以创建一个演示项目并通过两个步骤启动默认测试：

1. 创建一个新的Blueprint项目：

```bash
npm create ton@latest MyProject
```

2. 运行测试：

```bash
cd MyProject
npx blueprint test
```

然后，您将在终端窗口中看到相应的输出：

```bash
% npx blueprint test

> MyProject@0.0.1 test
> jest

 PASS  tests/Main.spec.ts
  Main
    ✓ should deploy (127 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.224 s, estimated 2 s
Ran all test suites.
```

## 基本用法

测试智能合约可以涵盖安全性、优化Gas支出和检查极端情况。
在Blueprint（基于[Sandbox](https://github.com/ton-org/sandbox)）中编写测试是通过定义与合约的任意操作并将测试结果与预期结果进行比较来实现的，例如：

```typescript
it('should execute with success', async () => {                              // description of the test case
    const res = await main.sendMessage(sender.getSender(), toNano('0.05'));  // performing an action with contract main and saving result in res

    expect(res.transactions).toHaveTransaction({                             // configure the expected result with expect() function
        from: main.address,                                                  // set expected sender for transaction we want to test matcher properties from
        success: true                                                        // set the desirable result using matcher property success
    });

    printTransactionFees(res.transactions);                                  // print table with details on spent fees
});
```

### 编写复杂Assertion的测试

创建测试的基本流程是：

1. 使用`blockchain.openContract()`创建特定的wrapped`Contract`实体。
2. 描述您的`Contract`应执行的操作并将执行结果保存在`res`变量中。
3. 使用`expect()`函数和匹配器`toHaveTransaction()`验证属性。

`toHaveTransaction`匹配器所期望的对象包含以下属性中的任意组合，这些属性来自`FlatTransaction`类型

| 名称                   | 类型             | 描述                                                                                                                                                         |
| -------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from                 | Address?       | 消息发送者的合约地址                                                                                                                                                 |
| on                   | Address        | 消息目的地的合约地址  （属性`to`的替代名称）。                                                                                                                                 |
| value                |                | 消息中Toncoin的数量，以nanotons计算                                                                                                                                  |
| body                 | Cell           | 定义为Cell的消息体                                                                                                                                                |
| op                   | number?        | op是操作标识符号码（通常为TL-B的crc32）。在消息体的前32位中。                                                                                                                      |
| success              | boolean?       | 自定义沙盒标志，定义特定交易的结果状态。如果计算和行动阶段都成功，则为True。否则为False。                                                                                                          |

您可以省略您不感兴趣的字段，并传递接受类型并返回布尔值的函数（true表示可以），以检查例如数字范围、消息操作码等。请注意，如果字段是可选的（如`from?: Address`），那么函数也需要接受可选类型。

:::tip
您可以从[Sandbox文档](https://github.com/ton-org/sandbox#test-a-transaction-with-matcher)中查看所有匹配器字段的完整列表。
:::

### 特定测试套件

#### 提取发送模式

要提取发送消息的发送模式，您可以使用以下代码：

```ts
const re = await blockchain.executor.runTransaction({
    message: beginCell().endCell(),
    config: blockchain.configBase64,
    libs: null,
    verbosity: 'short',
    shardAccount: beginCell().storeAddress(address).endCell().toBoc().toString('base64'),
    now: Math. floor (Date.now()) / 1000,
    lt: BigInt(Date.now()),
    randomSeed: null,
    ignoreChksig: false,
    debugEnabled: true
});

if (!re.result.success || !re.result.actions) {
    throw new Error('fail');
}

const actions = loadOutList(Cell.fromBase64(re.result.actions).beginParse());
for (const act of actions) {
    if (act.type === "sendMsg") {
        // process action
        console.log(act.mode)
    }
}
```

## 教程

从TON社区最有价值的教程中了解更多关于测试的信息：

- [第2课：为智能合约测试FunC](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/2lesson/secondlesson.md)
- [TON Hello World第4部分：逐步指导测试您的第一个智能合约](https://helloworld.tonstudio.io/04-testing/)
- [TON智能合约传递途径](https://dev.to/roma_i_m/ton-smart-contract-pipeline-write-simple-contract-and-compile-it-4pnh)
- [\[YouTube\]第六课 FunC & Blueprint。Gas，费用，测试。](https://youtu.be/3XIpKZ6wNcg)

## 示例

查看用于TON生态系统合约的测试套件，并通过示例进行学习。

- [liquid-staking-contract沙盒测试](https://github.com/ton-blockchain/liquid-staking-contract/tree/main/tests)
- [governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/config_tests/tests/)
- [JettonWallet.spec.ts](https://github.com/EmelyanenkoK/modern_jetton/blob/master/tests/JettonWallet.spec.ts)
- [governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/elector_tests/tests/complaint-test.fc)