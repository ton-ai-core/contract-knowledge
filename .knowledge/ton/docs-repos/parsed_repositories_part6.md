# GitHub Docs Parser - Part 6

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
Исходный код
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

Список SDK для различных языков (js, python, golang, C#, Rust и т. д.) можно найти [здесь](/v3/guidelines/dapps/apis-sdks/sdk).

## См. также

- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)
- [Обработка TON NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [Разбор метаданных на TON](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mass-mint-tools.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mass-mint-tools.mdx
================================================
# Инструменты массового выпуска

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В эпоху запуска крупных on-chain-проектов с миллионами пользователей пиковые нагрузки могут привести к проблемам в пользовательском опыте во всей экосистеме TON.

Чтобы предотвратить эту ситуацию и обеспечить плавный запуск, мы предлагаем использовать представленную на этой странице систему распределения высокой нагрузки.

### Массовая отправка

:::info
Рекомендуемый подход к эйрдропам токенов в сентябре, проверен в бою на Notcoin, DOGS
:::

Доступ: [Массовая отправка](https://docs.tonconsole.com/tonconsole/jettons/mass-sending)

Спецификация:

- Прямое распределение токенов, проект тратит деньги на газ во время выпуска
- Минимальная нагрузка на сеть (последние версии оптимизированы)
- Автоматическая регулировка нагрузки (замедляет распределение в случае перегрузки сети)

### Mintless Jettons

Доступ: [Mintless Jettons](/v3/guidelines/dapps/asset-processing/mintless-jettons)

:::info
  Проверено в бою на HAMSTER
:::

Спецификация:

- Пользователи претендуют на эйрдроп токены без транзакций
- Проекты не зарабатывают на запросах
- Минимальная нагрузка на сеть

### TokenTable v4

:::info
  Проверено в бою на Avacoin, DOGS
:::

Доступ: [www.tokentable.xyz](https://www.tokentable.xyz/)

- Более высокая нагрузка на сеть, чем у массовой отправки, пользователи совершают транзакции при запросе
- Проекты также могут зарабатывать на запросах пользователей
- Проекты оплачивают TokenTable за настройку

### Gigadrop

:::info
  Проверено в бою на HAMSTER
:::

Доступ: [gigadrop.io](https://gigadrop.io/)

- Более высокая нагрузка на сеть, чем у массовой отправки, пользователи совершают транзакции при запросе
- Гибкое управление нагрузкой
- Интеграция запроса в ваше приложение
- Проекты также могут зарабатывать на запросах пользователей



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mintless-jettons.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/mintless-jettons.mdx
================================================
# Обработка Mintless Jettons

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Введение

:::info
Для полного понимания следует быть знакомым с основными принципами обработки активов, описанными в разделах [обработки платежей](/v3/guidelines/dapps/asset-processing/payments-processing) и [обработки Jetton](/v3/guidelines/dapps/asset-processing/jettons).
:::

Экосистема блокчейна TON представила инновационное расширение стандарта Jetton под названием [Mintless Jettons](https://github.com/ton-community/mintless-jetton?tab=readme-ov-file).

Это расширение позволяет проводить децентрализованные, доказуемые с помощью [доказательства Меркла](/v3/documentation/data-formats/tlb/exotic-cells#merkle-proof) эирдропы без необходимости традиционных процессов чеканки.

## Общие сведения

Mintless Jettons - это расширение ([TEP-177](https://github.com/ton-blockchain/TEPs/pull/177) и [TEP-176](https://github.com/ton-blockchain/TEPs/pull/176)) стандартной реализации Jetton ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)) на блокчейне TON.

Эта реализация обеспечивает крупномасштабные децентрализованные эирдропы миллионам пользователей без значительных затрат или чрезмерной нагрузки на блокчейн.

### Основные характеристики

- **Масштабируемость**: традиционные процессы чеканки могут быть ресурсоемкими и дорогостоящими при распространении токенов среди большого количества пользователей.
- **Эффективность**: используя деревья Меркла, Mintless Jettons хранят один хэш, представляющий все суммы эирдропов, что снижает требования к хранилищу.
- **Удобные эирдропы**: пользователи могут немедленно использовать свои — отправлять, обменивать и т. д. — без каких-либо подготовительных шагов, таких как вывод или запрос!

## Поддержка Mintless Jettons в On-Chain протоколах

Поскольку Mintless Jettons являются расширением стандартных Jetton, никаких дополнительных шагов не требуется. Просто взаимодействуйте с ними так же, как с USDT, NOT, Scale или STON.

## Поддержка Mintless Jettons в приложениях кошельков

Приложения кошельков играют важную роль в улучшении пользовательского опыта с использованием Mintless Jettons:

- **Отображение невостребованных Jetton**: кошельки должны показывать пользователям Jetton, которые они имеют право запросить, на основе данных дерева Меркла.
- **Автоматизированный процесс запроса**: при инициировании исходящего перевода кошелек должен автоматически включать необходимое доказательство Меркла в пользовательскую полезную нагрузку сообщения `transfer`.

Это можно сделать одним из следующих способов:

- Интеграция с API Off-Chain, указанным в API [Custom Payload](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain)\*\*:
  - Для каждого jetton проверьте, является ли он Mintless.
  - Если это Mintless, проверьте, заявил ли его владелец кошелька.
  - Если он не заявлен, получите данные из API Custom Payload и добавьте баланс off-chain к балансу on-chain.
  - При исходящих переводах, если пользователь еще не запросил эирдроп, извлеките пользовательскую полезную нагрузку и состояние init из API Custom Payload и включите их в сообщение `transfer` в кошелек jetton.

- Пользовательский API:
  - Скачайте дерево airdrops с использованием `mintless_merkle_dump_uri` в метаданных jetton.
  - Проанализируйте его (см. раздел 6 ниже) и предоставьте разобранный результат доступным через API.

:::info
Поддержка Mintless-заявок (в частности, индексация эирдроп деревьев) не является обязательной для кошельков. Ожидается, что приложения кошельков могут взимать плату с эмитента jetton за этот сервис.
:::

## Поддержка Mintless Jettons в dApps (DEX/Lending платформы)

Поскольку заявка происходит автоматически в приложениях кошелька, dApps не нуждаются в специальной логике. Они могут использовать API (например, Tonapi или Toncenter), которые показывают невостребованные балансы.

Для улучшения пользовательского опыта dApps могут проверять, поддерживает ли приложение кошелка, с которым пользователь подключился к dApp, конкретный тип Mintless Jetton. Если он не поддерживается, dApp может получить доказательство и данные инициализации эирдропа из API jetton и добавить их в сообщение `transfer` на стороне dApp.

## Развертывание Mintless Jettons

Развертывание Mintless Jetton включает несколько шагов:

1. Подготовьте дерево Меркла:

- Создайте дерево Меркла, содержащего всех получателей эирдропа и их суммы.
- Вычислите корневой `merkle_hash`.

2. Разверните контракт Jetton Master:

- Включите `merkle_hash` в хранилище контракта.
- Убедитесь, что контракт соответствует расширенному стандарту Jetton; вы можете использовать [реализацию стандартного интерфейса Mintless Jetton](https://github.com/ton-community/mintless-jetton).

3. Предоставьте доказательства Меркла:

- Разместите данные дерева Меркл off-chain.
- Реализуйте API Custom Payload, чтобы кошельки могли извлекать необходимые доказательства.

4. Обновите метаданные:

- Добавьте `mintless_merkle_dump_uri` и `custom_payload_api_uri` в метаданные токена в соответствии со [стандартом метаданных](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

5. Запросите поддержку из кошельков:

- Попросите нужные приложения кошельков поддерживать (индексировать) ваш Mintless Jetton.

Выполнив эти шаги, вы можете развернуть Mintless Jetton, который пользователи могут легко запросить во время обычных операций.

## Получение информации о эирдропе

Аудит аирдропа и проверка общего предложения состоит из нескольких шагов.

### Доступ к дампу Меркл

- Начните с загрузки данных дерева Меркл из `mintless_merkle_dump_uri`, предоставленного в метаданных. Эти данные могут храниться в TON Storage, IPFS, ресурсах web 2.0 или другими способами. Этот файл содержит `HashMap{address -> airdrop_data}` как BoC-файл. `Airdrop_data` включает сумму, временную метку Unix, с которой доступен запрос (`start_from`), и временную метку Unix, когда запрос закрыт (`expired_at`).

### Проверка целостности

- Это можно сделать, сравнив хэш ячейки дампа Меркл без mintless с хешем, хранящимся в minter jetton (последний можно получить on-chain с помощью метода `get_mintless_airdrop_hashmap_root` контракта minter).

### Проверка балансов

- Используйте дерево Меркл для проверки отдельных балансов и убедитесь, что их сумма соответствуют ожидаемому общему предложению.

## Инструменты

Существует несколько утилит, которые можно использовать для описанных выше шагов.

### mintless-proof-generator (из Core)

1. **Компиляция утилиты**:

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

- Скомпилированный файл сохраняется как `build/crypto/mintless-proof-generator`.

2. **Запустите проверку**:

```bash
build/crypto/mintless-proof-generator parse <input-boc> <output-file>
```

Эта утилита выведет хэш ячейки дампа Меркл mintless и сохранит в `<output-file>` список всех эирдропов в формате  `<address> <amount> <start_from> <expired_at>` (по одному эирдропу на строку).

Вы также можете сгенерировать все доказательства Меркл (необходимые для `custom_payload_api_uri`) через команду `mintless-proof-generator make_all_proofs <input-boc> <output-file>`.

### mintless-toolbox (из Tonkeeper)

1. **Компиляция утилиты**:

```bash
git clone https://github.com/tonkeeper/mintless-toolbox.git
```

```bash
cd mintless-toolbox
```

```bash
make
```

2. **Запустите проверку**:

```bash
./bin/mintless-cli dump <airdrop-filename>
```

- Эта утилита считывает файл эирдроп и выводит его на консоль в формате `address,amount,start_from,expire_at`.

Проверяя дерево Меркл и данные контракта, заинтересованные стороны могут проверить целостность эирдропа и общего объема токенов.

## Заключение

Mintless Jettons предлагает эффективное и масштабируемое решение для крупномасштабных эирдропов токенов на блокчейне TON. Расширяя стандартную реализацию Jetton, они снижают затраты и нагрузку на блокчейн, сохраняя при этом безопасность и децентрализацию. Поддержка Mintless Jettons в смарт-контрактах, приложениях кошельков и dApps обеспечивает бесперебойный опыт для пользователей и способствует более широкому использованию. Развертывание и аудит Mintless Jettons включает в себя тщательную реализацию деревьев Меркла и соблюдение расширенных стандартов, что способствует созданию надежной и прозрачной экосистемы токенов.

## См. также

- [Понимание Mintless Jettons: Полное руководство](https://gist.github.com/EmelyanenkoK/bfe633bdf8e22ca92a5138e59134988f) - исходная публикация.
- [Стандартная реализация Mintless Jetton](https://github.com/ton-community/mintless-jetton)
- [Jetton Offchain Payloads TEP](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain)
- [Стандарт метаданных для Jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing.md
================================================
# Разбор метаданных

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Стандарт метаданных, который включает NFT, коллекции NFT и Jettons, описан в TON Enhancement Proposal 64 [TEP-64] (https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

В TON сущности могут иметь три типа метаданных: on-chain, semi-chain, и off-chain.

- **On-chain метаданные:** хранятся внутри блокчейна, включая название, атрибуты и изображение.
- **Off-chain метаданные:** хранятся с помощью ссылки на файл метаданных, размещенного вне блокчейна.
- **Semi-chain метаданные:** гибрид между этими двумя способами, который позволяет хранить небольшие поля, такие как имена или атрибуты, внутри блокчейне, в то время как изображение хранятся за пределами блокчейна и при этом только ссылка на него.

## Кодирование данных Snake

Формат кодирования Snake позволяет часть данных хранить в стандартной ячейке, а оставшуюся часть - в дочерней ячейке (рекурсивно). Формат кодирования Snake должен иметь префикс в виде байта 0x00. Схема TL-B:

```
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

Формат Snake используется для хранения дополнительных данных в ячейке, когда данные превышают максимальный размер, который можно хранить в одной ячейке. Это достигается путем хранения части данных в корневой ячейке, а оставшиеся части - в первой дочерней ячейке, и так продолжается рекурсивно до тех пор, пока все данные не будут сохранены.

Вот пример кодирования и декодирования формата Snake в TypeScript:

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

Следует отметить, что префикс `0x00` байт в корневой ячейке не всегда требуется при использовании формата snake, как в случае с off-chain содержимым NFT. Также ячейки заполняются байтами вместо битов для упрощения анализа. Чтобы избежать проблемы добавления ссылки (в пределах следующей дочерней ячейки) на ссылку после того, как она уже была записана в родительскую ячейку, snake ячейка строится в обратном порядке.

## Кодирование Chunked

Формат кодирования chunked используется для хранения данных с помощью словарной структуры данных, начиная с chunk_index и заканчивая chunk. Кодировка chunked должна иметь префикс из байта `0x01`. Схема TL-B:

```
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

Вот пример декодирования данных в формате chunked с помощью TypeScript:

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

## Атрибуты метаданных NFT

| Атрибут       | Тип          | Условие                 | Описание                                                                                                                     |
| ------------- | ------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `uri`         | ASCII string | необязательный параметр | URI, указывающий на JSON-документ с метаданными, который используется в формате "Semi-chain content layout". |
| `name`        | UTF8 string  | необязательный параметр | идентифицирует asset                                                                                                         |
| `description` | UTF8 string  | необязательный параметр | описывает актив                                                                                                              |
| `image`       | ASCII string | необязательный параметр | URI, указывающий на ресурс с типом mime image                                                                                |
| `image_data`  | binary\*     | необязательный параметр | либо двоичное представление изображения для on-chain размещения, либо base64 для off-chain размещения                        |

## Атрибуты метаданных Jetton

1. `uri` - Необязательный параметр. Используется в формате "Semi-chain content layout". Строка ASCII. URI, указывающий на JSON-документ с метаданными.
2. `Имя` - Необязательный параметр. Строка в формате UTF8. Идентифицирует asset.
3. `description` - Необязательный параметр. Строка в формате UTF8. Описывает asset.
4. `image` - Необязательный параметр. Строка ASCII. URI, указывающий на ресурс с типом mime image.
5. `image_data` - Необязательный параметр. Либо двоичное представление изображения для onchain размещения, либо base64 для offchain размещения.
6. `symbol` - Необязательный параметр. Строка в формате UTF8. Символ токена - например, "XMPL". Используется в форме "Вы получили 99 XMPL".
7. `decimals` - Необязательный параметр. Если не указано, по умолчанию используется значение 9. Строковое значение с числом от 0 до 255, кодированное в UTF8. Количество десятичных знаков, которые использует токен — например, 8, означает разделить количество токенов на 100000000 для получения его пользовательского представления.
8. `amount_style` - Необязательный параметр. Необходим для внешних приложений, чтобы они понимали формат отображения количества jetton.

- "n" - количество jetton (значение по умолчанию). Если у пользователя 100 токенов с десятичным числом 0, то отображается, что у пользователя 100 токенов
- "n-of-total" - количество jetton из общего количества выпущенных jetton. Например, totalSupply Jetton = 1000. У пользователя есть 100 jetton в jetton wallet. Например, должно отображаться в кошельке пользователя как 100 из 1000 или любым другим текстовым или графическим способом, чтобы показать конкретное значение в общем контексте.
- "%" - процент от общего количества выпускаемых jetton. Например, totalSupply Jetton = 1000. У пользователя есть 100 jetton в jetton wallet. Например, должно отображаться в кошельке пользователя как 10%.

9. `render_type` - Необязательный параметр. Необходим для внешних приложений, чтобы они понимали к какой группе относится jetton и как его отображать.

- "currency" - отображать как валюту (значение по умолчанию).
- "game" - отображать для игр. Будет отображаться как NFT, но при этом отображать количество jetton, учитывая параметр `amount_style`

| Атрибут        | Тип          | Условие                 | Описание                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uri`          | ASCII string | необязательный параметр | URI, указывающий на JSON-документ с метаданными, который используется в формате "Semi-chain content layout".                                                                                                                                                                                                                                                                                     |
| `name`         | UTF8 string  | необязательный параметр | идентифицирует asset                                                                                                                                                                                                                                                                                                                                                                                             |
| `description`  | UTF8 string  | необязательный параметр | описывает asset                                                                                                                                                                                                                                                                                                                                                                                                  |
| `image`        | ASCII string | необязательный параметр | URI, указывающий на ресурс с типом mime image                                                                                                                                                                                                                                                                                                                                                                    |
| `image_data`   | binary\*     | необязательный параметр | либо двоичное представление изображения для on-chain размещения, либо base64 для off-chain размещения                                                                                                                                                                                                                                                                                                            |
| `symbol`       | UTF8 string  | необязательный параметр | символ токена - например, "XMPL" и используется в форме "Вы получили 99 XMPL"                                                                                                                                                                                                                                                                                                                                    |
| `decimals`     | UTF8 string  | необязательный параметр | количество десятичных знаков, которые использует токен. Если не указано, по умолчанию используется значение 9. Строковое значение с числом от 0 до 255, например 8, означает, что количество токенов должно быть разделено на 100000000 для получения его пользовательского представления.                                                                       |
| `amount_style` |              | необязательный параметр | необходим внешним приложениям, чтобы они понимали формат отображения количества jetton. Определяется с помощью *n*, *n-of-total*, *%*.                                                                                                                                                                                                                                           |
| `render_type`  |              | необязательный параметр | Необходим для внешних приложений, чтобы они понимали в какую группу относится jetton и как его отображать. "currency" — отображается как валюта (значение по умолчанию). "game" — используется для игр, которые отображаются как NFT, но также показывают количество jetton и учитывают значение параметра amount_style. |

> Параметры `amount_style`:

- *n* — количество jetton (значение по умолчанию). Если пользователь имеет 100 токенов с 0 десятичных знаков, то отображается, что у пользователя 100 токенов.
- *n-of-total* — количество jetton от общего количества выпущенных jetton. Например, если totalSupply выпускаемых jetton равно 1000 и у пользователя есть 100 jetton в кошельке, то должно отображаться в кошельке пользователя как 100 из 1000 или другим текстовым или графическим способом, чтобы показать соотношение токенов пользователя к общему количеству доступных токенов.
- *%* — процент от общего количества выпущенных jetton. Например, если общее количество выпускаемых jetton равно 1000 и у пользователя есть 100 jetton, то процент должен быть отображен как 10% от баланса кошелька пользователя (100 ÷ 1000 = 0,1 или 10%).

> Параметры `render_type`:

- *currency* - отображается как валюта (значение по умолчанию).
- *game* - используется для игр, которые отображаются как NFT, но также показывают количество jetton и учитывают значение параметра `amount_style`.

## Разбор метаданных

Чтобы разобрать метаданные, сначала необходимо получить данные NFT из блокчейна. Чтобы лучше понять этот процесс, рекомендуем ознакомиться с разделом [Получение данных NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts#retrieving-nft-data) нашей документации по обработке активов в TON.

После того, как данные NFT в блокчейне получены, их необходимо разобрать. Чтобы выполнить этот процесс, необходимо определить тип содержимого NFT, прочитав первый байт, составляющий внутреннюю структуру NFT.

### Off-chain

Если строка байтов метаданных начинается с `0x01`, это означает, что тип содержимого NFT находится off-chain. Оставшаяся часть содержимого NFT декодируется с помощью формата кодирования Snake как ASCII-строка. После того, как правильно будет отпределен NFT URL и получены данные идентификации NFT, процесс завершен. Ниже приведен пример URL, который использует разбор метаданных содержимого NFT off-chain:
`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

Содержимое URL (сверху):

```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

### On-chain и Semi-chain

Если строка байтов метаданных начинается с `0x00`, это указывает на то, что NFT использует либо on-chain, либо semi-chain формат.

Метаданные для нашего NFT хранятся в словаре, где ключ - это SHA256-хэш имени атрибута, а значение - данные, хранящиеся либо в формате Snake, либо в формате Chunked.

Чтобы определить тип используемого NFT, разработчик должен прочитать известные атрибуты NFT, такие как `uri`, `name`, `image`, `description` и `image_data`. Если поле `uri` присутствует в метаданных, это указывает на semi-chain расположение. В таких случаях off-chain содержимое, указанное в поле uri, должно быть загружено и объединено со значениями словаря.

Пример on-chain NFT: [EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

Пример semi-chain NFT: [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

Пример on-chain Jetton Master: [EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

Пример разбора on-chain NFT: [stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## Важные замечания по метаданным NFT

1. Для метаданных NFT обязательными являются поля `name`, `description` и `image` (или `image_data`), чтобы отображать NFT.
2. Для метаданных Jetton обязательными являются поля `name`, `symbol`, `decimals` и `image`(или `image_data`).
3. Важно помнить, что любой может создать NFT или jetton с любым `name`, `description` или `image`. Чтобы избежать путаницы и потенциального мошенничества, пользователи всегда должны отображать свои NFT так, чтобы они четко отличались от других частей приложения. Вредоносные NFT и jetton могут быть отправлены в кошелек пользователя с вводящей в заблуждение или ложной информацией.
4. Некоторые элементы могут иметь поле `video`, которое ссылается на видео-содержимое, связанное с NFT или Jetton.

## Ссылки

- [TON Enhancement Proposal 64 (TEP-64)](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

## См. также

- [Обработка TON NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [Обработка TON Jetton](/v3/guidelines/dapps/asset-processing/jettons)
- [Создайте свой первый jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/nfts.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/nft-processing/nfts.md
================================================
# Обработка NFT

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Обзор

В этом разделе нашей документации мы предоставим читателям более полное представление о NFT. Это научит читателя взаимодействовать с NFT и как принимать их через транзакции, отправленные в блокчейн TON.

Информация, представленная ниже, предполагает, что читатель уже глубоко изучил наш предыдущий [раздел, подробно описывающий обработку платежей в Toncoin] (/v3/guidelines/dapps/asset-processing/payments-processing), и что он также обладает базовым пониманием того, как программно взаимодействовать с смарт-контрактами кошелька.

## Понимание основ NFT

NFT, работающие на блокчейне TON, представлены стандартами [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) и [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

Блокчейн The Open Network (TON) разработан с учетом высокой производительности и включает в себя функцию автоматического сегментирование на основе адресов контрактов на TON (которые используются для предоставления конкретных проектов NFT). Чтобы достичь оптимальной производительности, отдельные NFT должны использовать свой собственный смарт-контракт. Это позволяет создавать коллекции NFT любого размера (как большие, так и маленькие), а также снижает затраты на разработку и проблемы с производительностью. Однако такой подход также вносит новые соображения в разработку коллекций NFT.

Поскольку каждый NFT использует собственный смарт-контракт, невозможно получить информацию об отдельных NFT в коллекции, используя один контракт. Чтобы извлечь информацию о всей коллекции в целом, а также о каждом индивидуальном NFT внутри коллекции, необходимо запросить как контракт коллекции, так и контракт каждого отдельного NFT в отдельности. По той же причине для отслеживания переводов NFT необходимо отслеживать все транзакции для каждого отдельного NFT в рамках конкретной коллекции.

### NFT Collections

NFT Collection - это контракт, который служит для индексирования и хранения содержимого NFT и должен содержать следующие интерфейсы:

#### Get method `get_collection_data`

```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```

Получает общую информацию о коллекции, которая представлена следующим образом:

1. `next_item_index` - если коллекция упорядочена, эта классификация указывает на общее количество NFT в коллекции, а также на следующий индекс, используемый для выпуска. Для неупорядоченных коллекций значение `next_item_index` равно -1, что означает, что коллекция использует уникальные механизмы для отслеживания NFT (например, хэш или домены TON DNS).
2. `collection_content` - ячейка, представляющая содержимое коллекции в формате, совместимом с TEP-64.
3. `owner_address` - фрагмент, содержащий адрес владельца коллекции (это значение также может быть пустым).

#### Get method `get_nft_address_by_index`

```
(slice nft_address) get_nft_address_by_index(int index)
```

Этот метод можно использовать для проверки достоверности NFT и подтверждения, действительно ли он принадлежит определенной коллекции. Он также позволяет пользователям извлекать адрес NFT, указав его индекс в коллекции. Метод должен вернуть фрагмент, содержащий адрес NFT, соответствующий указанному индексу.

#### Get method `get_nft_content`

```
(cell full_content) get_nft_content(int index, cell individual_content)
```

Поскольку коллекция служит общим хранилищем данных для NFT, этот метод необходим для заполнения содержимого NFT. Чтобы использовать этот метод, сначала необходимо получить `individual_content` NFT, вызвав соответствующий метод `get_nft_data()`. После получения `individual_content` можно вызвать метод `get_nft_content()` с индексом NFT и ячейкой `individual_content`. Метод должен вернуть ячейку TEP-64, содержащую полное содержимое NFT.

### NFT Items

Основные NFT должны быть реализованы:

#### Get method `get_nft_data()`

```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### Обработчик встроенных сообщений для `transfer`

```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```

Давайте посмотрим на каждый параметр, который нужно заполнить в вашем сообщении:

1. `OP` - `0x5fcc3d14` - константа, определенная стандартом TEP-62 в рамках сообщения о передаче.
2. `queryId` - `uint64` - число uint64, используемое для отслеживания сообщения.
3. `newOwnerAddress` - `MsgAddress` - адрес контракта, на который переводится NFT.
4. `responseAddress` - `MsgAddress` - адрес, на который будут переведены лишние средства. Как правило, в контракт NFT отправляется дополнительная сумма в TON (например, 1 TON), чтобы обеспечить наличие достаточного количества средств для оплаты комиссии за транзакцию и создания нового перевода в случае необходимости. Все неиспользованные средства в рамках транзакции отправляются на `responseAddress`.
5. `forwardAmount` - `Coins` - количество TON, используемое вместе с сообщением о пересылке (обычно устанавливается 0,01 TON). Поскольку TON использует асинхронную архитектуру, новый владелец NFT не будет уведомлен сразу после успешного получения транзакции. Чтобы уведомить нового владельца, смарт-контракт NFT отправляет внутреннее сообщение на адрес `newOwnerAddress` со значением, указанным с помощью `forwardAmount`. Сообщение о пересылке начнется с операции `ownership_assigned` OP (`0x05138d91`), за которым следует адрес предыдущего владельца `forwardPayload` (если он присутствует).
6. `forwardPayload` - `Slice | Cell` - отправляется как часть сообщения уведомления `ownership_assigned`.

Это сообщение (как было объяснено выше) является основным способом взаимодействия с NFT, который изменяет свой владелец после получения уведомления в результате указанного ранее сообщения.

Например, этот тип сообщения часто используется для отправки смарт-контракта NFT Item из смарт-контракта Wallet. Когда смарт-контракт NFT получает это сообщение и выполняет его, хранилище (внутренние данные контракта) NFT-контракта обновляется вместе с ID владельца. Таким образом, NFT Item (контракт) правильно меняет своего владельца. Этот процесс описывает стандартную передачу NFT

В этом случае сумма пересылки должна быть установлена в подходящее значение (0,01 TON для обычного кошелька или больше, если вы хотите выполнить контракт, передавая NFT), чтобы обеспечить новому владельцу уведомление о передаче собственности. Это важно, поскольку без этого уведомления новый владелец не получит уведомления о том, что он получил NFT.

## Получение данных NFT

Большинство SDK используют готовые обработчики для извлечения данных NFT, включая: [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L38), [tonutils-go](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132), [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L771) и другие.

Чтобы получить данные NFT, необходимо использовать механизм извлечения `get_nft_data()`. Например, мы должны проверить следующий адрес NFT Item `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e` (также известный как домен [foundation.ton](https://tonscan.org/address/EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e)).

Сначала необходимо выполнить get метод извлечения, используя API toncenter.com следующим образом:.

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

Ответ обычно что-то вроде следующего:

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

Возвращаемые параметры:

- `init` - `boolean` — значение -1 означает, что NFT инициализирован и может быть использован
- `index` - `uint256` - индекс NFT в коллекции. Может быть последовательным или полученным каким-либо другим способом. Например, он может обозначать хэш домена NFT, используемый с контрактами TON DNS, тогда как коллекции должны иметь только один уникальный NFT для данного индекса.
- `collection_address` - `Cell` - ячейка, содержащая адрес коллекции NFT (может быть пустой).
- `owner_address` - `Cell` - ячейка, содержащая адрес текущего владельца NFT (может быть пустой).
- `content` - `Cell` - ячейка, содержащая содержимое элемента NFT (если требуется синтаксический разбор, необходимо обратиться к стандарту TEP-64).

## Получение всех NFT в коллекции

Процесс извлечения всех NFT в коллекции зависит от того, упорядочена ли коллекция или нет. Давайте рассмотрим оба процесса ниже.

### Упорядоченные коллекции

Извлечь все NFT из упорядоченной коллекции относительно просто, поскольку количество NFT, необходимых для извлечения, уже известно, и их адреса можно легко получить. Чтобы завершить этот процесс, необходимо выполнить следующие шаги по порядку:

1. Вызовите метод `get_collection_data` используя TonCenter API в контракте коллекции, и извлеките значение `next_item_index` из ответа.
2. Используйте метод `get_nft_address_by_index`, передав в него значение индекса `i` (изначально установив его на 0), чтобы получить адрес первого NFT в коллекции.
3. Используйте полученный в предыдущем шаге адрес для извлечения данных NFT Item. Далее проверьте, что начальный адрес умного контракта NFT Collection совпадает со адресом контракта NFT Collection, о котором сообщил NFT Item(чтобы убедиться, что Collection не присвоил адрес умного контракта NFT другого пользователя).
4. Вызовите метод `get_nft_content`, передав в него значение `i` и `individual_content` из предыдущего шага.
5. Увеличьте значение `i` на 1 и повторите шаги 2-5, пока `i` не станет равным `next_item_index`.
6. На этом этапе у вас будет доступна необходимая информация о коллекции и ее отдельных элементах.

### Неупорядоченные коллекции

Получение списка NFT в неупорядоченной коллекции сложнее, так как нет встроенного способа получить адреса NFT, принадлежащих коллекции. Поэтому необходимо разобрать все транзакции в контракте коллекции и проверить все исходящие сообщения, чтобы определить те, которые соответствуют NFT, принадлежащим коллекции.

Для этого необходимо извлечь данные NFT и вызвать метод `get_nft_address_by_index` в коллекции с ID, возвращенным NFT контрактом. Если адрес NFT контракта и адрес, возвращенный методом `get_nft_address_by_index`, совпадают, это указывает на то, что NFT принадлежит текущей коллекции. Однако разбор всех сообщений для коллекции может быть длительным процессом и может потребовать доступа к архивному узлу.

## Работа с NFT вне сети TON

### Отправка NFT

Чтобы передать право собственности на NFT, необходимо отправить внутреннее сообщение из кошелька владельца NFT в контракт NFT, создавая ячейку, содержащую сообщение об передаче. Это можно сделать с помощью библиотек (например, [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65), [ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102), [tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)) для конкретного языка.

После создания сообщения об передаче его необходимо отправить на адрес контракта NFT item из кошелька владельца, с достаточным количеством TON, чтобы покрыть соответствующую комиссию за транзакцию.

Чтобы передать NFT от другого пользователя себе, необходимо использовать TON Connect 2.0 или простой QR-код, содержащий ссылку ton://. Например:
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`.

### Получение NFT

Процесс отслеживания отправленных на определенный адрес умного контракта NFT (то есть кошелек пользователя) аналогичен механизму, используемому для отслеживания платежей. Это выполняется путем прослушивания всех новых транзакций в вашем кошельке и их анализа.

Следующие шаги могут отличаться в зависимости от конкретного случая использования. Давайте рассмотрим несколько различных сценариев ниже.

#### Сервис ожидает передачи известных адресов NFT:

- Проверьте новые транзакции, отправленные с адреса умного контракта NFT item.
- Прочитайте первые 32 бита тела сообщения как тип `uint`, и убедитесь, что они равны `op::ownership_assigned()`(`0x05138d91`)
- Посчитайте следующие 64 бита из тела сообщения как `query_id`.
- Прочитайте адрес из тела сообщения как `prev_owner_address`.
- Теперь вы можете управлять своим новым NFT.

#### Сервис прослушивает все типы передачи NFT:

- Проверьте все новые транзакции и игнорируйте те, у которых длина тела меньше 363 бит (OP - 32, QueryID - 64, Address - 267).
- Повторите шаги, описанные в предыдущем списке выше.
- Если процесс работает правильно, необходимо проверить подлинность NFT путем его анализа и коллекции, к которой он принадлежит. Затем необходимо убедиться, что NFT принадлежит указанной коллекции. Подробнее об этом процессе можно узнать в разделе `Получение всех NFT в коллекции`. Этот процесс может быть упрощен с помощью белого списка NFT или коллекций.
- Теперь вы можете управлять своим новым NFT.

#### Привязка переводов NFT к внутренним транзакциям:

При получении транзакции такого типа необходимо повторить действия из предыдущего списка. После завершения этого процесса можно получить параметр `RANDOM_ID`, считав uint32 из тела сообщения после чтения значения `prev_owner_address`.

#### NFT, отправленные без уведомления:

Все вышеуказанные стратегии основываются на том, что упомянутые службы правильно создают переадресованное сообщение с передачей NFT. Если они этого не делают, мы не узнаем, что они передали нам NFT. Однако есть несколько обходных путей:

Все вышеуказанные стратегии основываются на том, что упомянутые службы правильно создают сообщение о пересылке в рамках передачи NFT. Если этот процесс не выполняется, не будет ясно, была ли передана NFT правильной стороне. Однако есть несколько возможных обходных путей в этом сценарии:

- Если предполагается небольшое количество NFT, можно периодически их анализировать и проверять, изменился ли владелец на соответствующий тип контракта.
- Если предполагается большое количество NFT, можно разобрать все новые блоки и проверить наличие вызовов, отправленных в адрес назначения NFT с использованием метода `op::transfer`. Если такая транзакция инициирована, можно проверить владельца NFT и получить передачу.
- Если разбор новых блоков в процессе передачи невозможен, пользователи могут сами запустить процесс проверки владения NFT. Таким образом, можно запустить процесс проверки владения NFT после передачи NFT без уведомления.

## Взаимодействие с NFT через смарт-контракты

Теперь, когда мы рассмотрели основы отправки и получения NFT, давайте рассмотрим, как получать и передавать NFT из смарт-контрактов с помощью примера контракта [NFT Sale](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc).

### Отправка NFT

В этом примере сообщение о передаче NFT находится на строке 67:

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

Давайте рассмотрим каждую строку кода:

- `store_uint(0x18, 6)` - хранит флаги сообщения.
- `store_slice(nft_address)` - хранит адреса назначения сообщений (адреса NFT).
- `store_coins(0)` - количество TON для отправки с сообщением устанавливается равным 0, так как `128` [режим сообщения](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) используется для отправки сообщения с оставшимся балансом. Чтобы отправить сумму, отличную от всего баланса пользователя, необходимо изменить число. Обратите внимание, что оно должно быть достаточно большим, чтобы оплатить бензин, а также сумму пересылки.
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)` - оставшиеся компоненты заголовка сообщения остаются пустыми.
- `store_uint(op::transfer(), 32)` - это начало msg_body. Здесь мы начинаем с использования операции передачи, чтобы получатель понял сообщение о передаче собственности.
- `store_uint(query_id, 64)` - хранит query_id
- `store_slice(sender_address) ;; new_owner_address` - первый сохраненный адрес используется для передачи NFT и отправки уведомлений.
- `store_slice(sender_address) ;; response_address` - второй сохраненный адрес является адресом ответа.
- `store_int(0, 1)` - флаг пользовательской полезной нагрузки устанавливается на 0, указывая на то, что пользовательская полезная нагрузка не требуется.
- `store_coins(0)` - количество TON, которое будет переслано вместе с сообщением. В данном примере установлено значение 0, однако рекомендуется установить это значение на большую сумму (например, не менее 0,01 TON), чтобы создать сообщение о пересылке и уведомить нового владельца о том, что он получил NFT. Сумма должна быть достаточной для покрытия любых сопутствующих сборов и расходов.
- `.store_int(0, 1)` - пользовательский флаг полезной нагрузки. Необходимо установить значение `1`, если ваш сервис должен передавать нагрузку как ссылку на данные ref.

### Получение NFT

Как только мы отправили NFT, становится крайне важно определить, когда он был получен новым владельцем. Хороший пример того, как это сделать, можно найти в том же умном контракте продажи NFT:

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

Давайте еще раз проанализируем каждую строку кода:

- `slice cs = in_msg_full.begin_parse();` - используется для парсинга входящего сообщения.
- `int flags = cs~load_uint(4);` - используется для загрузки флагов из первых 4 битов сообщения.
- `if (flags & 1) { return (); } ;; ignore all bounced messages` - используется для проверки того, что сообщение не было отклонено. Важно выполнять этот процесс для всех Ваших входящих сообщений, если нет причин поступать иначе. Отклоненные сообщения - это сообщения, которые столкнулись с ошибками при попытке получить транзакцию и были возвращены отправителю.
- `slice sender_address = cs~load_msg_addr();` - далее загружается адрес отправителя сообщения. В данном случае специально с помощью адреса NFT.
- `throw_unless(500, equal_slices(sender_address, nft_address));` - используется для проверки того, что отправителем действительно является NFT, который должен был быть передан через контракт. Очень сложно разбирать данные NFT из умных контрактов, поэтому в большинстве случаев адрес NFT предопределяется при создании контракта.
- `int op = in_msg_body~load_uint(32);` - загружает код операции (OP code) сообщения.
- `throw_unless(501, op == op::ownership_assigned());` - гарантирует, что полученный код операции (OP code) соответствует значению константы присвоение владения.
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - адрес предыдущего владельца, который извлекается из тела входящего сообщения и загружается в переменную `prev_owner_address` типа slice. Это может быть полезно, если предыдущий владелец решит отменить контракт и вернуть NFT себе.

Теперь, когда мы успешно проанализировали и проверили сообщение уведомления, мы можем перейти к реализации нашей бизнес-логики, которая используется для инициализации умного контракта продажи (который служит для обработки процессов продажи NFT item на аукционах, таких как getgems.io).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/payments-processing.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/asset-processing/payments-processing.md
================================================
import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Обработка платежей

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

На этой странице **объясняется, как обрабатывать** (отправлять и принимать) `цифровые активы` в блокчейне TON. В **основном** она описывает, как работать с `TON coins`, но **теоретическая часть важна**, даже если вы хотите обрабатывать только `жетоны`.

:::tip
Рекомендуется ознакомиться с [Обзором обработки активов](/v3/documentation/dapps/assets/overview) перед прочтением этого руководства.
:::

## Смарт-контракт кошелька

Смарт-контракты кошелька в сети TON позволяют внешним акторам взаимодействовать с сущностями блокчейна.

- Аутентифицирует владельца: отклоняет запросы, которые пытаются обработать или оплатить комиссии от имени лиц, не являющихся владельцами.
- Обеспечивает защиту от повторного использования: предотвращает повторное выполнение одного и того же запроса, например отправку активов в другой смарт-контракт.
- Инициирует произвольные взаимодействия с другими смарт-контрактами.

Стандартное решение для первой проблемы — криптография с открытым ключом: `wallet` хранит открытый ключ и проверяет, что входящее сообщение с запросом подписано соответствующим закрытым ключом, который известен только владельцу.

Решение третьей проблемы также распространено; Как правило, запрос содержит полностью сформированное внутреннее сообщение, которое `wallet` отправляет в сеть. Однако для защиты от повторного использования существует несколько различных подходов.

### Кошельки на основе Seqno

Кошельки на основе Seqno используют простейший подход к упорядочиванию сообщений. Каждое сообщение имеет специальное целое число `seqno`, которое должно совпадать со счетчиком, хранящимся в смарт-контракте `wallet`. `wallet` обновляет свой счетчик при каждом запросе, тем самым гарантируя, что один запрос не будет обработан дважды. Существует несколько версий `wallet`, которые отличаются открытыми методами: возможностью ограничивать запросы по времени истечения срока действия и возможностью иметь несколько кошельков с одним и тем же открытым ключом. Однако неотъемлемым требованием этого подхода является отправка запросов по одному, поскольку любой пропуск в последовательности `seqno` приведет к невозможности обработки всех последующих запросов.

### Высоконагруженные кошельки

Этот тип `wallet` следует подходу, основанному на хранении идентификатора непросроченных обработанных запросов в хранилище смарт-контракта. При этом подходе любой запрос проверяется на предмет дубликата уже обработанного запроса и, если обнаруживается повтор, отклоняется. Из-за истечения срока действия контракт может не хранить все запросы вечно, но он удалит те, которые не могут быть обработаны из-за ограничения срока действия. Запросы в этот `wallet` можно отправлять параллельно без помех, но этот подход требует более сложного отслеживания обработки запросов.

### Развертывание кошелька

Чтобы развернуть кошелек через TonLib, необходимо:

1. Сгенерировать пару закрытый/открытый ключ с помощью [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L244) или его функций-оберток (пример в [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). Обратите внимание, что закрытый ключ генерируется локально и не покидает хост-машину.
2. Сформировать структуру [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62), соответствующую одному из включенных `wallet`. В настоящее время доступны `wallet.v3`, `wallet.v4`, `wallet.highload.v1` и `wallet.highload.v2`.
3. Рассчитать адрес нового смарт-контракта кошелька с помощью метода [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283). Мы рекомендуем использовать ревизию по умолчанию `0`, а также развернуть кошельки в basechain `workchain=0` для более низких комиссий за обработку и хранение.
4. Отправить немного Toncoin на рассчитанный адрес. Обратите внимание, что вам нужно отправлять их в режиме `non-bounce`, так как этот адрес пока не имеет кода и не может обрабатывать входящие сообщения. Флаг `non-bounce` указывает, что даже если обработка не удалась, деньги не должны быть возвращены с сообщением о недоставке. Мы не рекомендуем использовать флаг `non-bounce` для других транзакций, особенно при переносе больших сумм, так как механизм возврата обеспечивает некоторую степень защиты от ошибок.
5. Сформируйте желаемое [действие](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), например `actionNoop` только для развертывания. Затем используйте [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) и [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300), чтобы инициировать взаимодействие с блокчейном.
6. Проверьте контракт за несколько секунд с помощью метода [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288).

:::tip
Подробнее в [руководстве по кошельку](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet)
:::

### Проверьте правильность адреса кошелька

Большинство SDK принудительно проверяют адреса (большинство проверяют их во время создания кошелька или процесса подготовки транзакции), поэтому, как правило, от вас не требуется никаких дополнительных сложных шагов.

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
Полное описание адреса на странице [адресов смарт-контракта](/v3/documentation/smart-contracts/addresses).
:::

## Работа с переводами

### Проверка транзакций контракта

Транзакции контракта можно получить с помощью [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get). Этот метод позволяет получить 10 транзакций из некоторого `last_transaction_id` и более ранних. Для обработки всех входящих транзакций необходимо выполнить следующие шаги:

1. Последний `last_transaction_id` можно получить с помощью [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get)
2. Список из 10 транзакций необходимо загрузить с помощью метода `getTransactions`.
3. Обрабатывайте транзакции с непустым источником во входящем сообщении и назначением, равным адресу аккаунта.
4. Следующие 10 транзакций должны быть загружены, и шаги 2,3,4,5 должны быть повторены, пока не будут обработаны все входящие транзакции.

### Отслеживание входящих/исходящих транзакций

Во время обработки транзакций можно отслеживать поток сообщений. Поскольку поток сообщений представляет собой DAG, достаточно получить текущую транзакцию с помощью метода [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) и найти входящую транзакцию по `out_msg` с помощью [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) или исходящие транзакции по `in_msg` с помощью [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get).

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

### Отправка платежей

:::tip
Изучите базовый пример обработки платежей из [TMA USDT Payments demo](https://github.com/ton-community/tma-usdt-payments-demo)
:::

1. Сервис должен развернуть `wallet` и поддерживать его финансирование, чтобы предотвратить уничтожение контракта из-за платы за хранение. Обратите внимание, что плата за хранение обычно составляет менее 1 Toncoin в год.
2. Сервис должен получить от пользователя `destination_address` и необязательный `comment`. Обратите внимание, что на данный момент мы рекомендуем либо запретить незавершенные исходящие платежи с тем же набором (`destination_address`, `value`, `comment`), либо правильно запланировать эти платежи; таким образом, следующий платеж будет инициирован только после подтверждения предыдущего.
3. Форма [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103) с `comment` в виде текста.
4. Форма [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113), которая содержит `destination_address`, пустой `public_key`, `amount` и `msg.dataText`.
5. Форма [Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), которая содержит набор исходящих сообщений.
6. Используйте запросы [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) и [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) для отправки исходящих платежей.
7. Сервис должен регулярно опрашивать метод [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) для контракта `wallet`. Сопоставление подтвержденных транзакций с исходящими платежами по (`destination_address`, `value`, `comment`) позволяет отмечать платежи как завершенные; обнаруживать и показывать пользователю соответствующий хэш транзакции и lt (логическое время).
8. Запросы к `v3` `высоконагруженных` кошельков имеют срок действия, равный по умолчанию 60 секундам. По истечении этого времени необработанные запросы можно безопасно повторно отправлять в сеть (см. шаги 3-6).

:::caution
Если прикрепленное `value` слишком мало, транзакция может быть прервана с ошибкой `cskip_no_gas`. В этом случае Toncoins будут успешно переведены, но логика на другой стороне не будет выполнена (TVM даже не запустится). Подробнее об ограничениях газа можно прочитать [здесь](/v3/documentation/network/configs/blockchain-configs#param-20-and-21).
:::

### Получение идентификатора транзакции

Может быть непонятно, что для получения дополнительной информации о транзакции пользователь должен сканировать блокчейн с помощью функции [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get). Невозможно получить идентификатор транзакции сразу после отправки сообщения, так как транзакция должна быть сначала подтверждена сетью блокчейна. Чтобы понять требуемый конвейер, внимательно прочтите [Отправка платежей](/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments), особенно 7-й пункт.

## Подход на основе счета-фактуры

Чтобы принимать платежи на основании прикрепленных комментариев, сервис должен

1. Развернуть контракт `wallet`.
2. Сгенерировать уникальный `invoice` для каждого пользователя. Достаточно будет строкового представления uuid32.
3. Пользователям следует дать указание отправить Тонкоин на `кошелек` сервиса с приложенным `счетом-фактурой` в качестве комментария.
4. Сервис должен регулярно опрашивать метод [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) для контракта `wallet`.
5. Для новых транзакций входящее сообщение должно быть извлечено, `комментарий` сопоставлен с базой данных, а **значение входящего сообщения** зачислено на счет пользователя.

Чтобы вычислить **значение входящего сообщения**, которое сообщение приносит в контракт, необходимо проанализировать транзакцию. Это происходит, когда сообщение попадает в контракт. Транзакция может быть получена с помощью [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L268). Для входящей транзакции кошелька правильные данные состоят из одного входящего сообщения и нуля исходящих сообщений. В противном случае либо внешнее сообщение отправляется в кошелек, и в этом случае владелец тратит Toncoin, либо кошелек не развертывается, и входящая транзакция возвращается обратно.

В любом случае, в общем случае сумма, которую сообщение приносит контракту, может быть рассчитана как стоимость входящего сообщения минус сумма значений исходящих сообщений за вычетом комиссии: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Технически представление транзакции содержит три разных поля с комиссией в названии: `fee`, `storage_fee` и `other_fee`, то есть общая комиссия, часть комиссии, связанная с расходами на хранение, и часть комиссии, связанная с обработкой транзакции. Следует использовать только первое из них.

### Счета с TON Connect

Лучше всего подходят для dApps, которым необходимо подписывать несколько платежей/транзакций в течение сеанса или необходимо поддерживать соединение с кошельком в течение некоторого времени.

- ✅ Постоянный канал связи с кошельком, информация об адресе пользователя

- ✅ Пользователям нужно только один раз отсканировать QR-код

- ✅ Можно узнать, подтвердил ли пользователь транзакцию в кошельке, отследить транзакцию по возвращенному BOC

- ✅ Готовые SDK и UI-компоненты доступны для разных платформ

- ❌ Если вам нужно отправить только один платеж, пользователю нужно выполнить два действия: подключить кошелек и подтвердить транзакцию

- ❌ Интеграция сложнее, чем ссылка ton://

<Button href="/v3/guidelines/ton-connect/overview/"
colorType="primary" sizeType={'lg'}>

Узнать больше

</Button>

### Счета со ссылкой ton://

:::warning
Ссылка Ton устарела, не используйте ее
:::

Если вам нужна простая интеграция для простого пользовательского потока, подойдет ссылка ton://. Лучше всего подходит для разовых платежей и счетов.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ Простая интеграция

- ✅ Не нужно подключать кошелек

- ❌ Пользователям нужно сканировать новый QR-код для каждого платежа

- ❌ Невозможно отследить, подписал ли пользователь транзакцию или нет

- ❌ Нет информации об адресе пользователя

- ❌ Необходимы обходные пути на платформах, где такие ссылки не кликабельны (например, сообщения от ботов для клиентов Telegram на настольных ПК)

[Узнайте больше о ссылках ton здесь](https://github.com/tonkeeper/wallet-api#payment-urls)

## Обозреватели

Обозреватель блокчейна - https://tonscan.org.

Чтобы сгенерировать ссылку на транзакцию в обозревателе, сервису необходимо получить lt (логическое время), хэш транзакции и адрес учетной записи (адрес учетной записи, для которой lt и txhash были получены с помощью метода [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get)). https://tonscan.org и https://explorer.toncoin.org/ могут затем показать страницу для этой транзакции в следующем формате:

`https://tonviewer.com/transaction/{txhash as base64url}`

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

Обратите внимание, что tonviewer и tonscan поддерживают внешний хэш сообщения вместо хэша транзакции для ссылки в проводнике. Это может быть полезно, когда вы генерируете внешнее сообщение и хотите мгновенно сгенерировать ссылку. Подробнее о транзакциях и хэшах сообщений [здесь](/v3/guidelines/dapps/cookbook#how-to-find-transaction-or-message-hash)

## Лучшие практики

### Создание кошелька

<Tabs groupId="example-create_wallet">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Создание кошелька + получение адреса кошелька](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [Создание кошелька + получение баланса](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Создание кошелька + получение баланса](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [Создание кошелька + получение адреса кошелька](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)
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

### Создание кошелька для разных шардов

При большой нагрузке блокчейн TON может разделиться на [шарды] (/v3/documentation/smart-contracts/shards/shards-intro). Простая аналогия шарда в мире Web3 — это сегмент сети.

Точно так же, как мы распределяем инфраструктуру услуг в мире Web2, чтобы она была как можно ближе к конечному пользователю, в TON мы можем развертывать контракты, которые будут находиться в том же шарде, что и кошелек пользователя или любой другой контракт, который взаимодействует с ним.

Например, DApp, который собирает плату с пользователей за будущий эирдроп, может подготовить отдельные кошельки для каждого шарда, чтобы улучшить пользовательский опыт в дни пиковой нагрузки. Чтобы достичь максимальной скорости обработки, вам нужно будет развернуть один кошелек collector на шард.

Префикс шарда `SHARD_INDEX` контракта определяется первыми 4 битами его хэша адреса. Чтобы развернуть кошелек в определенном шарде, можно использовать логику, основанную на следующем фрагменте кода:

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

В случае контракта кошелька можно использовать `subwalletId` вместо мнемоники, однако `subwalletId` не поддерживается приложениями кошелька.

После завершения развертывания вы можете выполнить обработку по следующему алгоритму:

1. Пользователь заходит на страницу DApp и запрашивает действие.
2. DApp выбирает ближайший к пользователю кошелек (соответствует 4-битному префиксу)
3. DApp предоставляет пользователю payload, отправляя его плату в выбранный кошелек.

Таким образом, вы сможете обеспечить наилучший возможный пользовательский опыт независимо от текущей загрузки сети.

### Депозиты Toncoin (получение toncoins)

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Обработка депозита Toncoins](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [Обработка депозита Toncoins на несколько кошельков](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**

<details>
<summary>Проверка депозитов</summary>

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

<summary>Проверка депозитов</summary>

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

### Вывод Toncoin (отправка toncoins)

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Вывод Toncoins из кошелька партиями](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [Вывод Toncoins из кошелька](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [Вывод Toncoins из кошелька](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Вывод Toncoins из кошелька](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

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

### Получение транзакций контракта

<Tabs groupId="example-get_transactions">
<TabItem value="JS" label="JS">

- **ton-community/ton:**
  - [Клиент с методом getTransaction](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Получение транзакций](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**
  - [Получение транзакций](https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)

</TabItem>

</Tabs>

## SDK

Полный список SDK для различных языков программирования (JS, Python, Golang и т. д.) доступен [здесь](/v3/guidelines/dapps/apis-sdks/sdk).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/cookbook.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/cookbook.mdx
================================================
import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TON Cookbook

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В процессе разработки продукта часто возникают различные вопросы, касающиеся взаимодействия с различными контрактами на TON.

Этот документ был создан для того, чтобы собрать лучшие практики всех разработчиков и поделиться ими со всеми.

## Работа с адресами контрактов

### Как конвертировать (user friendly \<-\> raw), собирать и извлекать адреса из строк?

Адрес TON однозначно идентифицирует контракт в блокчейне, указывая его workchain и хеш исходного состояния. [Используются два основных формата](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses): **raw** (workchain и хеш в HEX-формате, разделенные символом ":") и **user-friendly** (base64-кодировка с определенными флагами).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

Чтобы получить объект адреса из строки в вашем SDK, вы можете использовать следующий код:

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

### Какие флаги существуют в user-friendly адресах?

Определены два флага: **bounceable**/**non-bounceable** and **testnet**/**any-net**. Их можно легко определить, взглянув на первую букву адреса, поскольку она обозначает первые 6 бит в кодировке адреса, а флаги расположены там в соответствии с [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

| Начало адреса | Бинарная форма | Bounceable | Testnet-only |
| :-----------: | :------------: | :--------: | :----------: |
|  E...         |  000100.01     |  да        |  нет         |
|  U...         |  010100.01     |  нет       |  нет         |
|  k...         |  100100.01     |  да        |  да          |
|  0...         |  110100.01     |  нет       |  да          |

:::tip
Флаг Testnet-only вообще не отображается в блокчейне. Флаг Non-bounceable имеет значение только при использовании в качестве адреса назначения для перевода: в этом случае он [не допускает возврата](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)  отправленного сообщения; адрес в блокчейне, опять же, не содержит этого флага.
:::

Кроме того, в некоторых библиотеках вы можете встретить параметр сериализации `urlSafe`. Формат base64 не является безопасным для URL-адресов, а это значит, что некоторые символы (а именно, `+` и `/`) могут вызвать проблемы при передаче адреса в ссылке. Когда `urlSafe = true`, все символы `+` заменяются на `-`, а все символы `/` заменяются на `_`. Вы можете получить эти форматы адресов, используя следующий код:

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

### Как проверить корректность адреса TON?

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

## Стандартные кошельки в экосистеме TON

### Как перевести TON? Как отправить текстовое сообщение на другой кошелек?

#### Отправка сообщений

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

#### Развертывание контракта

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

Большинство SDK обеспечивают следующий процесс отправки сообщений из вашего кошелька:

- Вы создаете обёртку кошелька (объект в вашей программе) правильной версии (в большинстве случаев v3r2; см. также [версии кошельков](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts)), используя секретный ключ и workchain (обычно 0, что обозначает [basechain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules)).
- Вы также создаете блокчейн-обёртку, или "клиент" - объект, который будет направлять запросы к API или к лайтсерверам, в зависимости от того, что вы выберете.
- Затем вы _открываете_ контракт в блокчейн-обёртке. Это означает, что объект контракта больше не является абстрактным и представляет собой реальную учётную запись в основной или тестовой сети TON.
- После этого вы можете формировать необходимые вам сообщения и отправлять их. Вы также можете отправлять до 4 сообщений за один запрос, как описано в [расширенном руководстве](/v3/guidelines/smart-contracts/howto/wallet#sending-multiple-messages-simultaneously).

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

### Написание комментариев: длинные строки в формате snake

Иногда необходимо хранить длинные строки (или другую объемную информацию), в то время как ячейки могут вместить **максимум 1023 бита**. В этом случае можно использовать snake cells. Snake cells - это ячейки, содержащие ссылку на другую ячейку, которая, в свою очередь, содержит ссылку на другую ячейку, и так далее.

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

Во многих SDK уже есть функции для разбора и хранения длинных строк. В других случаях можно работать с такими ячейками с помощью рекурсии или оптимизировать их (метод, известный как "хвостовые вызовы" или "tail calls").

Не забывайте, что сообщение-комментарий имеет 32 нулевых бита (можно сказать, что его опкод равен 0)!

## TEP-74 (Стандарт Jetton)

### Как вычислить адрес кошелька пользователя Jetton (offchain)?

Чтобы вычислить адрес кошелька пользователя jetton, нам нужно вызвать метод "get_wallet_address" из мастер-контракта jetton с адресом пользователя. Для этой задачи можно легко использовать метод getWalletAddress из JettonMaster или вызвать мастер-контракт вручную.

:::info
В `JettonMaster` из `@ton/ton` отсутствует множество функций, но _эта_, к счастью, реализована.
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

### Как вычислить адрес кошелька пользователя Jetton (offline)?

Постоянный вызов GET-метода для получения адреса кошелька может занимать много времени и ресурсов. Если вам заранее известен код Jetton Wallet и структура его хранилища, можно определить адрес кошелька без сетевых запросов.

Код можно получить код с помощью Tonviewer. Например, адрес мастер-контракта для `jUSDT` - `EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA`. Если [перейти по этому адресу](https://tonviewer.com/EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA?section=method) и открыть вкладку Methods, то мы увидим, что там уже есть метод `get_jetton_data`. Вызвав его можно получить hex-форму ячейки с кодом Jetton Wallet:

```
b5ee9c7201021301000385000114ff00f4a413f4bcf2c80b0102016202030202cb0405001ba0f605da89a1f401f481f481a9a30201ce06070201580a0b02f70831c02497c138007434c0c05c6c2544d7c0fc07783e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7c076cf16cc8d0d0d09208403e29fa96ea68c1b088d978c4408fc06b809208405e351466ea6cc1b08978c840910c03c06f80dd6cda0841657c1ef2ea7c09c6c3cb4b01408eebcb8b1807c073817c160080900113e910c30003cb85360005c804ff833206e953080b1f833de206ef2d29ad0d30731d3ffd3fff404d307d430d0fa00fa00fa00fa00fa00fa00300008840ff2f00201580c0d020148111201f70174cfc0407e803e90087c007b51343e803e903e903534544da8548b31c17cb8b04ab0bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032481c007e401d3232c084b281f2fff274013e903d010c7e800835d270803cb8b13220060072c15401f3c59c3e809dc072dae00e02f33b51343e803e903e90353442b4cfc0407e80145468017e903e9014d771c1551cdbdc150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0325c007e401d3232c084b281f2fff2741403f1c147ac7cb8b0c33e801472a84a6d8206685401e8062849a49b1578c34975c2c070c00870802c200f1000aa13ccc88210178d4519580a02cb1fcb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25007a813a008aa005004a017a014bcf2e2c501c98040fb004300c85004fa0258cf1601cf16ccc9ed5400725269a018a1c882107362d09c2902cb1fcb3f5007fa025004cf165007cf16c9c8801001cb0527cf165004fa027101cb6a13ccc971fb0050421300748e23c8801001cb055006cf165005fa027001cb6a8210d53276db580502cb1fcb3fc972fb00925b33e24003c85004fa0258cf1601cf16ccc9ed5400eb3b51343e803e903e9035344174cfc0407e800870803cb8b0be903d01007434e7f440745458a8549631c17cb8b049b0bffcb8b0b220841ef765f7960100b2c7f2cfc07e8088f3c58073c584f2e7f27220060072c148f3c59c3e809c4072dab33260103ec01004f214013e809633c58073c5b3327b55200087200835c87b51343e803e903e9035344134c7c06103c8608405e351466e80a0841ef765f7ae84ac7cbd34cfc04c3e800c04e81408f214013e809633c58073c5b3327b5520
```

Теперь, зная код Jetton Wallet, адрес мастер-контракта Jetton и структуру хранилища, мы можем вручную вычислить адрес кошелька:

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

Полный пример можно почитать [здесь](/example-code-snippets/pythoniq/jetton-offline-address-calc-wrapper.py).

</TabItem>
</Tabs>

Большинство основных токенов используют [стандартную реализацию стандарта TEP-74](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc), поэтому их структура хранилища не отличается. Исключением являются новые [контракты Jetton-with-governance](https://github.com/ton-blockchain/stablecoin-contract) для централизованных стейблкоинов. В них разница заключается [в наличии поля статуса кошелька и отсутствии кодовой ячейки в хранилище](https://github.com/ton-blockchain/stablecoin-contract/blob/7a22416d4de61336616960473af391713e100d7b/contracts/jetton-utils.fc#L3-L12).

### Как создать сообщение для передачи jetton с комментарием?

Чтобы понять, как создать сообщение для передачи токена, мы используем [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer), в котором описан стандарт токена.

#### Перевод джеттонов

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

Конечно, всегда можно производить расчеты в неделимых единицах.
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

Если `forward_amount` ненулевое, на контракт назначения отправляется уведомление о получении джеттона, как показано в схеме в начале этого раздела. Если адрес `response_destination` не равен null, оставшиеся toncoin (они называются "излишки") отправляются на этот адрес.

:::tip
Эксплореры поддерживают комментарии в уведомлениях jetton, а также в обычных переводах TON. Их формат - 32 нулевых бита и затем текст, предпочтительно в кодировке UTF-8.
:::

:::tip
При переводах Jetton нужно внимательно учитывать комиссии и суммы, указанные в исходящих сообщениях. Например, если вы "вызываете" перевод с суммой 0.2 TON, вы не сможете переслать 0.1 TON и получить ответное сообщение с превышением 0.1 TON.
:::

## TEP-62 (стандарт NFT)

Коллекции NFT сильно отличаются друг от друга. На самом деле, контракт NFT на TON можно определить как "контракт, который имеет соответствующий get-метод и возвращает корректные метаданные". Операция перевода стандартизирована и аналогична [переводу Jetton](/v3/guidelines/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment), поэтому мы не будем углубляться в нее, а рассмотрим дополнительные возможности, предоставляемые большинством коллекций, которые вы можете встретить!

:::warning
Напоминаем, что все описанные ниже методы работы с NFT не привязаны к TEP-62. Прежде чем использовать их, пожалуйста, проверьте, будут ли ваши NFT или коллекция обрабатывать эти сообщения ожидаемым образом. В этом случае может пригодиться эмуляция приложения кошелька.
:::

### Как использовать пакетный деплой NFT?

Смарт-контракты для коллекций позволяют разместить до 250 NFT в рамках одной транзакции. Однако необходимо учитывать, что на практике этот максимум составляет около 100-130 NFT из-за ограничения стоимости вычислений в 1 ton. Чтобы это реализовать, нам нужно хранить информацию о новых NFT в словаре.

#### Пакетный минт NFT

:::info
Не определено стандартом NFT для /ton-blockchain /token-contract
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

Для начала предположим, что минимальное количество TON для платы за хранение составляет `0,05`. Это означает, что после деплоя NFT смарт-контракт коллекции отправит эту сумму TON на свой баланс. Затем мы получим массивы с владельцами новых NFT и их содержимым. После этого, используя GET-метод `get_collection_data`, получаем `next_item_index`.

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

Далее необходимо правильно рассчитать общую стоимость транзакции. Значение `0,015` было получено в результате тестирования, но оно может варьироваться в зависимости от ситуации. Это главным образом зависит от содержимого NFT, так как увеличение размера содержимого приводит к увеличению **forward fee** (комиссии за доставку).

### Как изменить владельца смарт-контракта коллекции?

Изменить владельца коллекции очень просто. Для этого нужно указать **opcode = 3**, любой query_id и адрес нового владельца:

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

### Как изменить содержимое смарт-контракта коллекции?

Чтобы изменить содержимое смарт-контракта коллекции, нужно понять, как оно хранится. Коллекция хранит всё содержимое в одной ячейке, внутри которой находятся две ячейки: **содержимое коллекции (collection content)** и **общее содержимое NFT (NFT common content)**. Первая ячейка содержит метаданные коллекции, а вторая - базовый URL для метаданных NFT.

Часто метаданные коллекции хранятся в формате, похожем на `0.json`, с последующим увеличением номера, при этом адрес перед этим файлом остается неизменным. Именно этот адрес должен храниться в NFT common content.

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

Кроме того, нам нужно включить в сообщение информацию о роялти, так как они также изменяются с использованием этого опкода. Важно отметить, что не обязательно указывать новые значения везде. Например, если нужно изменить только общее содержимое NFT (NFT common content), то все остальные значения можно оставить прежними.

## Сторонние организации: Децентрализованные биржи (DEX)

### Как отправить сообщение о свопе на DEX (DeDust)?

DEX используют разные протоколы для своей работы. В этом примере мы будем взаимодействовать с **DeDust**.

- [Документация DeDust](https://docs.dedust.io/).

DeDust предлагает два пути обмена: jetton \<-> jetton или TON \<-> jetton. У каждого из них своя схема. Для свопа вам необходимо отправить жетоны (или toncoin) в определенное **хранилище (vault)** и предоставить специальный payload. Вот схема обмена жетона на жетон или жетона на toncoin:

```tlb
swap#e3a0d482 _:SwapStep swap_params:^SwapParams = ForwardPayload;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```

Эта схема показывает, что должно быть в `forward_payload` вашего сообщения о передаче жетонов (`transfer#0f8a7ea5`).

И схема обмена toncoin на жетон:

```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```

Это схема тела перевода в **хранилище (vault)** toncoin.

Во-первых, вам необходимо узнать **vault**-адреса жетонов, которые вы будете обменивать, или **vault**-адрес toncoin. Это можно сделать с помощью get-метода `get_vault_address` контракта [**Factory**](https://docs.dedust.io/reference/factory). В качестве аргумента вам необходимо передать срез в соответствии со схемой:

```tlb
native$0000 = Asset; // for ton
jetton$0001 workchain_id:int8 address:uint256 = Asset; // for jetton
```

Также для обмена необходим адрес **пула**, который можно получить с помощью get-метода `get_pool_address`. В качестве аргументов используются срезы активов по схеме, описанной выше. В ответ оба метода возвращают срез с адресом запрашиваемого **хранилища (vault)** / **пула**.

Этого достаточно для формирования сообщения.

<Tabs groupId="code-examples">

<TabItem value="js-ton" label="JS (@ton)">
DEX используют разные протоколы для своей работы, поэтому нам необходимо ознакомиться с ключевыми понятиями и некоторыми важными компонентами, а также знать схему TL-B, чтобы правильно выполнить процесс свопа. В этом руководстве мы рассмотрим DeDust, одну из популярных DEX, полностью реализованных на TON.
В DeDust у нас есть абстрактная концепция актива, которая включает в себя все типы активов, доступных для обмена. Абстракция типов активов упрощает процесс свопа, поскольку тип актива не имеет значения, а дополнительные валюты или даже активы из других сетей при таком подходе будут легко приниматься.

Ниже приведена схема TL-B, которую DeDust представил для концепции активов.

```tlb
native$0000 = Asset; // for ton

jetton$0001 workchain_id:int8 address:uint256 = Asset; // for any jetton,address refer to jetton master address

// Upcoming, not implemented yet.
extra_currency$0010 currency_id:int32 = Asset;
```

Далее DeDust представил три компонента: хранилище (Vault), пул (Pool) и фабрику (Factory). Эти компоненты представляют собой контракты или группы контрактов и отвечают за различные части процесса свопа. Фабрика (Factory) выполняет поиск адресов других компонентов (например, хранилища и пула), а также создает другие компоненты.
Хранилище (Vault) отвечает за получение сообщений о переводе, хранение активов и информирование соответствующего пула о том, что "пользователь A хочет обменять 100 X на Y".

Пул (Pool), в свою очередь, отвечает за рассчет суммы свопа на основе заданной формулы, информируя другое хранилище, отвечающее за актив Y, указывает ему выплатить рассчитанную сумму пользователю.
Расчеты суммы свопа основаны на математической формуле, что означает, что на данный момент у нас есть два разных пула: один, известный как Volatile, работает по широко известной формуле "Constant Product": x _ y = k. А другой, известный как Stable-Swap, - оптимизирован для активов примерно одинаковой стоимости (например, USDT / USDC, TON / stTON). Он использует формулу: x3 _ y + y3 \* x = k.
Таким образом, для каждого свопа нам нужен соответствующий Vault, и он должен имплементировать специальный API, предназначенный для взаимодействия с определенным типом активов. В DeDust есть три реализации Vault: Native Vault - для работы с нативной монетой (Toncoin). Jetton Vault - для работы с жетонами и Extra-Currency Vault (в разработке) - для работы с дополнительными валютами TON.

DeDust предоставляет специальный SDk для работы с контрактами, компонентами и API, написанный на typescript.
Хватит теории, давайте настроим нашу среду, чтобы обменять один жетон на TON.

```bash
npm install --save @ton/core @ton/ton @ton/crypto

```

Нам также необходимо предоставить DeDust SDK.

```bash
npm install --save @dedust/sdk
```

Теперь нам нужно инициализировать некоторые объекты.

```typescript
import { Factory, MAINNET_FACTORY_ADDR } from "@dedust/sdk";
import { Address, TonClient4 } from "@ton/ton";

const tonClient = new TonClient4({
  endpoint: "https://mainnet-v4.tonhubapi.com",
});
const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
//The Factory contract  is used to  locate other contracts.
```

Процесс обмена состоит из нескольких этапов. Например, чтобы обменять  TON на Jetton, нам сначала нужно найти соответствующие Vault и Pool и убедиться, что они развернуты. Для нашего примера TON и SCALE код выглядит следующим образом:

```typescript
import { Asset, VaultNative } from "@dedust/sdk";

//Native vault is for TON
const tonVault = tonClient.open(await factory.getNativeVault());
//We use the factory to find our native coin (Toncoin) Vault.
```

Следующий шаг - найти соответствующий Pool, здесь (TON и SCALE)

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

Теперь нам нужно убедиться, что эти контракты существуют, поскольку отправка средств на неактивный контракт может привести к безвозвратной потере средств.

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

После этого мы можем отправлять сообщения о переводе с указанием суммы в TON.

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

Чтобы обменять токен X на Y, процесс будет таким же. Например, мы отправляем определенное количество токенов X в хранилище X, хранилище X
получает наш актив, удерживает его и сообщает пулу (X, Y), что этот адрес запрашивает обмен. После рассчета пул информирует другое хранилище, в данном случае хранилище Y, которое выпускает эквивалентное количество Y для пользователя, который запрашивает обмен.

Разница между активами заключается только в методе передачи. Например, для жетонов мы передаем их в хранилище с помощью сообщения о переводе и прикрепляем определенный forward_payload, а для нативной монеты мы отправляем в хранилище сообщение о свопе, прикрепляя соответствующее количество TON.

Это схема для TON и jetton:

```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
```

Таким образом, каждое хранилище и соответствующий ему пул предназначены для конкретных свопов и имеют специальный API, адаптированный к конкретным активам.

Это была своп TON на жетон SCALE. Процесс свопа жетона на жетон аналогичен, с той лишь разницей, что мы должны предоставить payload, описанный в схеме TL-B.

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

Создание среза актива:

```kotlin
val assetASlice = buildCell {
    storeUInt(1,4)
    storeInt(JETTON_MASTER_A.workchainId, 8)
    storeBits(JETTON_MASTER_A.address)
}.beginParse()
```

Запуск get-методов:

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

Создание и передача сообщения:

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

В этом примере показано, как обменять Toncoins на Jettons.

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

## Основы обработки сообщений

### Как анализировать транзакции аккаунта (переводы, жетоны, NFT)?

Список транзакций по счету можно получить с помощью метода API `getTransactions`. Он возвращает массив объектов `Transaction`, каждый из которых содержит множество атрибутов. Однако чаще всего используются следующие поля:

- Отправитель (Sender), тело (Body) и значение сообщения (Value of the massage), инициировавшего эту транзакцию
- Хеш транзакции и логическое время (LT)

Поля _Sender_ и _Body_ можно использовать для определения типа сообщения (обычный перевод, перевод жетонов, перевод nft и т.д.).

Ниже приведен пример, как можно получить 5 последних транзакций с любого аккаунта в блокчейне, проанализировать их в зависимости от типа и вывести в цикле.

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

Обратите внимание, что данный пример охватывает только самый простой случай со входящими сообщениями, когда достаточно получить транзакции по одному аккаунту. Если вы хотите углубиться в тему и работать с более сложными цепочками транзакций и сообщений, вам следует учитывать поле `tx.outMessages`. Оно содержит список исходящих сообщений, отправленных смарт-контрактом в результате данной транзакции. Для лучшего понимания всей логики, вы можете ознакомиться с этими статьями:

- [Обзор сообщений](/v3/documentation/smart-contracts/message-management/messages-and-transactions)
- [Внутренние сообщения](/v3/documentation/smart-contracts/message-management/internal-messages)

Более подробно эта тема рассматривается в статье ["Обработка платежей"](/v3/guidelines/dapps/asset-processing/payments-processing).

### Как найти транзакцию для конкретного результата TON Connect?

TON Connect 2 возвращает только ячейку, которая была отправлена в блокчейн, а не сгенерированный хеш транзакции (поскольку транзакция может не состояться, если внешнее сообщение потеряется или истечет время ожидания). Однако BOC позволяет нам искать именно это конкретное сообщение в истории аккаунта.

:::tip
Вы можете использовать индексатор для упрощения поиска. Предлагаемая реализация предназначена для `TonClient`, подключенного к RPC.
:::

Подготовьте функцию `retry` для попыток прослушивания блокчейна:

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

Создайте функцию-слушатель, которая будет проверять определенную транзакцию на конкретном аккаунте с определенным входящим внешним сообщением, равным телу сообщения в boc:

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

### Как узнать хеш транзакции или сообщения?

:::info
Будьте внимательны с определением хеша. Это может быть либо хеш транзакции, либо хеш сообщения. Это разные вещи.
:::

Чтобы получить хеш транзакции, нужно использовать метод `hash` транзакции. Чтобы получить хеш внешнего сообщения, нужно создать ячейку сообщения с помощью метода `storeMessage`, а затем использовать метод `hash` этой ячейки.

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

Также вы можете получить хеш сообщения при его создании. Обратите внимание, что это тот же хеш, что и хеш сообщения, отправленного для инициирования транзакции, как в предыдущем примере.

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
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/overview.mdx
================================================
import Button from '@site/src/components/button'

# Начало работы

Прежде чем погрузиться в DApps, убедитесь, что вы понимаете принципы, лежащие в основе блокчейна. Возможно, вам будут полезны наши статьи [The Open Network](/v3/concepts/dive-into-ton/introduction) и [Блокчейн блокчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).

TON DApps – это приложения без бэкенда, которые вместо него взаимодействуют с блокчейном. В большинстве случаев они работают на основе пользовательских [смарт-контрактов](/v3/documentation/smart-contracts/overview). В этой статье представлены способы обработки стандартных, доступных в TON ассетов. Вы можете их использовать как в качестве примера, так и для ускорения разработки ваших DApps.

DApps, как правило, можно написать на любом, имеющем SDK для TON, языке программирования. Наиболее частым форматом является разработка веб-сайта, в дополнение к которому создают мини-приложения Telegram.

<Button href="/v3/guidelines/dapps/tma/overview" colorType={'primary'} sizeType={'sm'}>

Постройте TMA

</Button>

<Button href="/v3/guidelines/dapps/apis-sdks/sdk" colorType="secondary" sizeType={'sm'}>

Выберите SDK

</Button>

## Курс TON: DApps

:::tip
Прежде чем приступить к изучению курса, убедитесь, что вы хорошо понимаете основы технологии блокчейн. Если у вас есть пробелы в знаниях, мы рекомендуем пройти курс [Основы блокчейна с TON](https://stepik.org/course/201294/promo) ([RU версия](https://stepik.org/course/202221/), [CHN версия](https://stepik.org/course/200976/)).
Модуль 3 охватывает базовые знания о DApp.
:::

Курс [TON Blockchain Course](https://stepik.org/course/176754/) - это полное руководство по разработке TON Blockchain.

Модули 5 и 6 полностью посвящены разработке DApps. Вы узнаете: как создать DApp, как работать с TON Connect, как использовать SDK, а также как работать непосредственно с блокчейном.

<Button href="https://stepik.org/course/176754/promo" colorType={'primary'} sizeType={'sm'}>

Ознакомиться с курсом TON Blockchain

</Button>

<Button href="https://stepik.org/course/201638/promo" colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>

<Button href="https://stepik.org/course/201855/promo" colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## Основные инструменты и ресурсы

Вот несколько ключевых ресурсов, которые понадобятся вам на протяжении всего пути разработки DApp:

1. [Приложения-кошельки](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps)
2. [Обозреватели в TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton)
3. [Типы API](/v3/guidelines/dapps/apis-sdks/api-types)
4. [SDK](/v3/guidelines/dapps/apis-sdks/sdk)
5. [Понимание тестовой сети](/v3/documentation/smart-contracts/getting-started/testnet)
6. [TON Unfreezer](https://unfreezer.ton.org/)

### Управление ассетами

Работаете с ассетами? Описанные ниже статьи покроют ключевые аспекты:

- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)
- [Обработка жетонов](/v3/guidelines/dapps/asset-processing/jettons)
- [Обработка NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [Разбор метаданных](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

### Введение в DeFi

Интересуетесь децентрализованными финансами (DeFi)? Вот как работать с различными типами активов:

- [Собственный токен: Toncoin](/v3/documentation/dapps/defi/coins)
- [Токены (FT, NFT)](/v3/documentation/dapps/defi/tokens)
- [TON Payments](/v3/documentation/dapps/defi/ton-payments)
- [Подписки на контент](/v3/documentation/dapps/defi/subscriptions)

## Учебные материалы и примеры

### Основы DeFi

- Создайте свой первый токен: [Сминтите свой первый Jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token)
- Шаг за шагом: [Пошаговое создание коллекции NFT](/v3/guidelines/dapps/tutorials/nft-minting-guide)

### Руководства по конкретным языкам

#### JavaScript

- [Процесс оплаты](https://github.com/toncenter/examples)
- [TON Bridge](https://github.com/ton-blockchain/bridge)
- [Веб-кошелек](https://github.com/toncenter/ton-wallet)
- [Бот для продажи пельменей](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

#### Python

- [Примеры проектов](https://github.com/psylopunk/pytonlib/tree/main/examples)
- [Бот-витрина магазина с оплатой в TON](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)

#### Перейдите на

- [Примеры](https://github.com/xssnick/tonutils-go/tree/master/example)

### Продвинутые темы

- [Создание простого проекта ZK на TON](/v3/guidelines/dapps/tutorials/zero-knowledge-proofs)

### Примеры кошельков

- [Стандартный кошелек для рабочего стола (C++ и Qt)](https://github.com/ton-blockchain/wallet-desktop)
- [Стандартный кошелек для Android (Java)](https://github.com/ton-blockchain/wallet-android)
- [Стандартный кошелек для iOS (Swift)](https://github.com/ton-blockchain/wallet-ios)
- [TonLib CLI (C++)](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/tonlib-cli.cpp)

## 👨‍💻 Вклад

Не хватает какого-то важного материала? Вы можете либо написать его самостоятельно, либо описать вашу проблему для сообщества.

<Button href="/v3/contribute/participate" colorType="primary" sizeType={'sm'}>

Внести вклад

</Button>

<Button href="https://github.com/ton-community/ton-docs/issues/new?assignees=&labels=feature+%3Asparkles%3A%2Ccontent+%3Afountain_pen%3A&template=suggest_tutorial.yaml&title=Suggest+a+tutorial" colorType={'secondary'} sizeType={'sm'}>

Предложить свой учебный материал

</Button>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/grants.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/grants.mdx
================================================
import Button from '@site/src/components/button'

# Гранты

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Гранты Telegram Web3

Чтобы еще больше стимулировать инновации, [TON Foundation](https://ton.foundation/en) запустил программу [грантов Telegram Web3](http://t.me/toncoin/991). Эта инициатива призвана мотивировать больше разработчиков создавать новые платформы, либо переносить существующие на TON и Telegram.

## Как принять участие?

Независимо от того, являетесь ли вы опытным бизнесом, новым стартапом или индивидуальным разработчиком, сейчас самое подходящее время принять участие. Отправьте заявку в Telegram через [этого бота](https://t.me/app_moderation_bot) и участвуйте в [программе грантов](https://t.me/trendingapps/33). Давайте вместе создавать будущее.

<Button href="https://t.me/app_moderation_bot" colorType={'primary'} sizeType={'sm'}>

Подать заявку

</Button>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/monetization.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/monetization.mdx
================================================
import Button from '@site/src/components/button'
import ThemedImage from '@theme/ThemedImage';

# Монетизация

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Wallet Pay

<br></br>
<img src="https://storage.googleapis.com/ton-strapi/reason_Card5_19eeac1401/reason_Card5_19eeac1401.png" alt="Wallet Pay illustration"/>
<br></br>
Wallet Pay - это основная платежная система для мини-приложений Telegram (TMA), поддерживающая как криптовалютные, так и фиатные транзакции. Отслеживайте статистику своих заказов и легко выводите средства.
Встроенный в экосистему Кошелька, Wallet Pay обеспечивает беспрепятственный финансовый обмен между продавцами и их клиентами.

Полезные ссылки:

- [Wallet Pay Business Support](https://t.me/WalletPay_supportbot) - это Telegram-бот для связи со службой поддержки Wallet Pay.
- [Демо-магазин](https://t.me/PineAppleDemoWPStoreBot) - это Telegram-бот для демонстрации функционала Wallet Pay. (Внимание: все платежи осуществляются в реальных активах)
- [Сообщество продавцов](https://t.me/+6TReWBEyZxI5Njli) - это группа в Telegram для обмена опытом и решениями проблем.

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

TON Connect - это протокол связи между **кошельками** и **приложениями** в TON.

**Приложения**, созданные на TON, обладают богатой функциональностью и высокой производительностью и предназначены для защиты средств пользователей с помощью смарт-контрактов. Поскольку приложения создаются с использованием децентрализованных технологий, таких как блокчейн, их обычно называют децентрализованными приложениями (dApps).

**Кошельки** представляют пользовательский интерфейс для подтверждения транзакций и надежно хранят криптографические ключи пользователей на их персональных устройствах. Такое разделение задач обеспечивает быстрое внедрение инновации и обеспечивать высокий уровень безопасности для пользователей: кошелькам не нужно самим создавать экосистемы, а приложениям не нужно брать на себя риск хранения учетных записей конечных пользователей.

Цель TON Connect - обеспечить беспрепятственный доступ пользователей к кошелькам и приложениям.

<Button href="/v3/guidelines/ton-connect/overview" colorType={'primary'} sizeType={'sm'}>

Откройте для себя TON Connect

</Button>

## Интегрируйте токены

Вы можете создать свой собственный токен на блокчейне TON и интегрировать его в свое приложение. Вы также можете интегрировать существующие токены в свое приложение.

<Button href="/v3/documentation/dapps/defi/tokens" colorType={'primary'} sizeType={'sm'}>

Разберитесь в DeFi

</Button>

## Подписки на TON

Благодаря тому, что транзакции в блокчейне TON проходят быстро, а сетевые комиссии низкие, вы можете обрабатывать повторяющиеся on-chain платежи с помощью смарт-контрактов.

Например, пользователи могут подписаться на цифровой контент (или что-либо еще), и с них будет взиматься ежемесячная плата в размере 1 TON.

<Button href="/v3/documentation/dapps/defi/subscriptions" colorType={'primary'} sizeType={'sm'}>

Читать далее

</Button>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/publishing.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/publishing.mdx
================================================
import Button from '@site/src/components/button'

# Публикация мини-приложений (TMA)

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Как разработчикам, нам важно понимать экосистему, в которой мы работаем. Telegram предоставляет уникальные возможности для разработчиков мини-приложений благодаря своей надежной платформе и обширной пользовательской базе. Эта статья расскажет Вам о доступных способах для публикации Ваших мини-приложений в Telegram.

## tApps Center

**Что такое tApps Center?** TON Foundation представил Telegram Apps Center - централизованное хранилище для Telegram-ботов и мини-приложений (TMA). Цель этой платформы - улучшить пользовательский опыт, используя интерфейс, напоминающий привычные магазины приложений.

**Широкая поддержка экосистемы**. Telegram Apps Center ориентирован не только на экосистему TON, он также приветствует приложения из других блокчейнов. Вам даже не нужна интеграция с web3, чтобы стать частью этого каталога. Такой инклюзивный подход направлен на то, чтобы сделать Telegram "универсальным приложением", аналогично таким платформам, как WeChat, где пользователи могут получить доступ к множеству услуг в рамках единого интерфейса.

<Button href="https://www.tapps.center/" colorType={'primary'} sizeType={'sm'}>

Открыть tApps Center

</Button>

### Зачем публиковать в tApps Center?

**Доступ к широкой аудитории**. Центр приложений Telegram предоставляет разработчикам прекрасную возможность продемонстрировать свои проекты широкой аудитории, что облегчает привлечение пользователей и инвесторов.

**Сила сообщества**. Подход платформы ориентирован на сообщество, поощряя сотрудничество и обмен ресурсами и знаниями.

<Button href="https://blog.ton.org/ton-ecosystem-evolved-introducing-telegram-apps-center-t-apps-center" colorType={'secondary'} sizeType={'sm'}>

Читайте больше в блоге TON

</Button>

## Запуск в Telegram

В настоящее время Telegram поддерживает шесть различных способов запуска мини-приложений: с [кнопки на клавиатуре](https://core.telegram.org/bots/webapps#keyboard-button-web-apps), с [инлайн-кнопки](https://core.telegram.org/bots/webapps#inline-button-web-apps), с [кнопки меню в боте](https://core.telegram.org/bots/webapps#launching-web-apps-from-the-menu-button), через [инлайн-режим](https://core.telegram.org/bots/webapps#inline-mode-web-apps), с [прямой ссылки](https://core.telegram.org/bots/webapps#direct-link-web-apps) - и даже из [меню вложений](https://core.telegram.org/bots/webapps#launching-web-apps-from-the-attachment-menu).

![](/img/docs/telegram-apps/publish-tg-1.jpeg)

### Кнопка на клавиатуре в мини-приложениях

**TL;DR:** Мини-приложения, запускаемые из **web_app** с [кнопки клавиатуры](https://core.telegram.org/bots/api#keyboardbutton), могут отправлять данные обратно боту в _служебном сообщении_ с помощью [Telegram.WebApp.sendData](https://core.telegram.org/bots/webapps#initializing-web-apps). Это позволяет боту получить ответ без взаимодействия с внешними серверами.

Пользователи могут взаимодействовать с ботами, используя [пользовательские клавиатуры] (https://core.telegram.org/bots#keyboards), [кнопки под сообщениями в ботах] (https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating), а также отправляя **текстовые сообщения** в свободной форме или любой из **типов вложений**, поддерживаемых Telegram: фото и видео, файлы, местоположения, контакты и опросы. Для еще большей гибкости боты могут использовать все возможности **HTML5** для создания удобных интерфейсов ввода.

Вы можете отправить  **web_app** типа [KeyboardButton](https://core.telegram.org/bots/api#keyboardbutton), который открывает мини-приложение с указанного URL.

Чтобы передать данные от пользователя обратно боту, мини-приложение может вызвать метод [Telegram.WebApp.sendData](https://core.telegram.org/bots/webapps#initializing-web-apps). Данные будут переданы боту в виде строки в служебном сообщении. После их получения бот сможет продолжить общение с пользователем.

**Полезно для:**

- **Интерфейсов ввода данных** (персонализированный календарь для выбора дат; выбор данных из списка с расширенными возможностями поиска; рандомизатор, позволяющий пользователю "крутить колесо" и выбирать один из доступных вариантов, и т.д.).
- **Повторно используемых компонентов**, которые не зависят от конкретного бота.

### Инлайн-кнопки в мини-приложениях

**TL;DR:** Для более интерактивных мини-приложений, таких как [@DurgerKingBot](https://t.me/durgerkingbot), используйте **web_app** типа [Inline KeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton), которое получает основную информацию о пользователе и может быть использовано для отправки сообщения от имени пользователя в чат с ботом.

Если одного приема текстовых данных недостаточно или нужен более продвинутый и персонализированный интерфейс, можно открыть мини-приложение с помощью **web_app** типа [Inline KeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton).

По нажатию кнопки откроется мини-приложение с URL, указанным в кнопке. В дополнение к [настройкам темы](https://core.telegram.org/bots/webapps#color-schemes) оно получит основную информацию о пользователе (ID, name, username, language_code) и уникальный идентификатор сессии, **query_id**, который позволяет отправлять сообщения от имени пользователя обратно боту.

Бот может вызвать метод Bot API [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery), чтобы отправить сообщение от пользователя обратно боту и закрыть мини-приложение. Получив сообщение, бот может продолжить общение с пользователем.

**Полезно для:**

- Полноценны веб-сервисов и любых интеграций.
- Варианты использования фактически **безграничны**.

### Запуск мини-приложений с кнопки меню

**TL;DR:** Мини-приложения можно запускать с настраиваемой кнопки меню. Это дает более быстрый способ доступа к приложению, а в остальном **аналогично** [запуску мини-приложения с инлайн-кнопки](https://core.telegram.org/bots/webapps#inline-button-web-apps).

По умолчанию в чатах с ботами всегда отображается удобная кнопка **меню**, которая обеспечивает быстрый доступ ко всем перечисленным [командам](https://core.telegram.org/bots#commands). С [Bot API 6.0](https://core.telegram.org/bots/api-changelog#april-16-2022) эта кнопка может быть использована для **запуска мини-приложения**.

Чтобы настроить кнопку меню, нужно указать текст, который кнопка должна отображать, и URL-адрес мини-приложения. Есть два способа задать эти параметры:

- Чтобы настроить кнопку для **всех пользователей**, используйте [@BotFather](https://t.me/botfather) (команда /setmenubutton или _Настройки бота > Кнопка меню_).
- Чтобы настроить кнопку как для **всех пользователей**, так и для **конкретных пользователей**, используйте метод [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton) в Bot API. Например, измените текст кнопки в зависимости от языка пользователя или покажите ссылки на различные веб-приложения в зависимости от настроек пользователя в Вашем боте.

Кроме того, веб-приложения, открываемые с помощью кнопки меню, работают точно так же, как и при [использовании инлайн-кнопок](https://core.telegram.org/bots/webapps#inline-button-web-apps).

[@DurgerKingBot](https://t.me/durgerkingbot) позволяет запускать свое мини-приложение как с инлайн-кнопки, так и с кнопки меню.

### Инлайн-режим мини-приложения

**TL;DR:** Мини-приложения, запускаемые через **web_app** типа [InlineQueryResultsButton](https://core.telegram.org/bots/api#inlinequeryresultsbutton), можно использовать в любом месте в режиме inline. Пользователи могут создавать контент в веб-интерфейсе, а затем отправлять его в текущий чат в режиме inline.

НОВОЕ. Вы можете использовать параметр _button_ в методе [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery), чтобы отобразить специальную кнопку "Switch to Mini App" ("Переключиться на мини-приложение") либо над, либо вместо результатов инлайн-запроса. Эта кнопка **откроет мини-приложение** с указанного URL. После этого вы можете вызвать метод [Telegram.WebApp.switchInlineQuery](https://core.telegram.org/bots/webapps#initializing-web-apps), чтобы отправить пользователя обратно в инлайн-режим.

Инлайн мини-приложения **не имеют доступа** к чату - они не могут читать сообщения или отправлять новые от имени пользователя. Чтобы отправить сообщение, пользователь должен быть перенаправлен в **инлайн-режим** и активно выбрать результат.

**Полезно для:**

- Полноценных веб-сервисов и интеграции в инлайн-режиме.

### Мини-приложения с прямой ссылкой

**TL;DR:** Боты мини-приложений могут быть запущены по прямой ссылке в любом чате. Они поддерживают параметр _startapp_ и учитывают текущий контекст чата.

НОВОЕ. Вы можете использовать прямые ссылки для **открытия мини-приложения** прямо в текущем чате. Если в ссылку указан непустой параметр _startapp_, он будет передан мини-приложению в поле _start_param_ и в параметре GET _tgWebAppStartParam_.

В этом режиме мини-приложения могут использовать параметры _chat_type_ и _chat_instance_ для отслеживания текущего контекста чата. Это обеспечивает поддержку **параллельного** и **совместного** использования несколькими участниками чата - для создания интерактивных досок, групповых заказов, многопользовательских игр и аналогичных приложений.

Мини-приложения, открытые по прямой ссылке, **не имеют доступа** к чату - они не могут читать сообщения или отправлять новые от имени пользователя. Чтобы отправить сообщение, пользователь должен быть перенаправлен в **инлайн-режим** и активно выбрать результат.

**Примеры**.

- https://t.me/botusername/appname
- https://t.me/botusername/appname?startapp=command

**Полезно для:**

- Полноценных веб-сервисов и интеграций, которые любой пользователь может открыть одним касанием.
- Кооперативных, многопользовательских или ориентированных на командную работу сервисов в контексте чата.

Варианты использования практически **не ограничены**.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/testing-apps.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/testing-apps.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage'

# Тестирование мини-приложений

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Использование ботов в тестовой среде разработки

Чтобы войти в тестовую среду, воспользуйтесь одним из следующих способов:

- **iOS:** нажмите 10 раз на значок Настройки > Учетные записи > Вход в другую учетную запись > Тест.
- **Telegram Desktop:** откройте ☰ Настройки > Shift + Alt + щелкните правой кнопкой мыши на 'Add Account' и выберите 'Test Server'.
- **macOS:** нажмите 10 раз на значок "Настройки", чтобы открыть меню отладки, ⌘ + нажмите "Добавить учетную запись" и войдите в систему по номеру телефона.

Тестовая среда полностью отделена от основной. Вам нужно будет создать **новый аккаунт пользователя** и **нового бота**, используя `@BotFather`.

После получения токена бота, отправляйте запросы в Bot API в следующем формате:

`https://api.telegram.org/bot<token>/test/METHOD_NAME`

**Примечание:** При работе с тестовой средой вы можете использовать HTTP-ссылки без TLS для тестирования Вашего мини-приложения.

## Режим отладки для мини-приложений

Используйте следующие инструменты для выявления проблем, связанных с вашими мини-приложениями:

### Android

- [Включить USB-отладку](https://developer.chrome.com/docs/devtools/remote-debugging/) на Вашем устройстве.
- В настройках Telegram прокрутите страницу до конца вниз, нажмите  **номер версии** два раза и удерживайте.
- Выберите _Включить отладку WebView_ в настройках отладки.
- Подключите телефон к компьютеру и откройте chrome://inspect/#devices в Chrome - вы увидите там ваше мини-приложение, когда запустите его на телефоне.

### iOS

Для отладки iOS webview требуется десктопный браузер Safari и macOS.

**На устройстве iOS:**

- Перейдите в раздел _Настройки_.
- Найдите значок Safari и нажмите на него.
- Прокрутите вниз и нажмите _Дополнительно_.
- Включите опцию _Веб-инспектор_.

**На macOS:**

- Откройте браузер Safari.
- Откройте _Настройки_ (⌘ + ,).
- Выберите вкладку _Дополнительно_.
- Отметьте внизу опцию _Показать возможности для веб-разработчиков_.

**Следующие шаги:**

- Подключите iOS-устройство к Mac с помощью кабеля.
- Откройте мини-приложение в клиенте Telegram для iOS.
- Откройте вкладку _Разработка_ в строке меню в Safari на macOS.
- Выберите подключенный iPhone.
- Опционально: выберите _Подключение по сети_ и отсоедините кабель.
- Выберите открытый URL-адрес webview в блоке _Telegram_.

### Telegram Desktop в Windows, Linux и macOS

- Загрузите и запустите последнюю версию Telegram Desktop на **Windows**, **Linux** или **macOS** (на момент написания этой статьи доступна версия 5.0.1).
- Перейдите в _Настройки > Дополнительно > Экспериментальные настройки > Включить проверку webview_.
- В Windows и Linux щелкните правой кнопкой мыши на WebView и выберите _Проверить (Inspect)_.
- На macOS Вам необходимо получить доступ к Inspect через [Меню Разработчика Safari](https://support.apple.com/en-gb/guide/safari/sfri20948/mac)
  , а функция Inspect недоступна через контекстное меню, вызываемое правой кнопки мыши.

### Telegram macOS

- Скачайте и запустите [Бета-версию](https://telegram.org/dl/macos/beta) Telegram macOS.
- Быстро нажмите 5 раз на значок "Настройки", чтобы открыть меню отладки и включить "Отладку мини-приложений".

Щелкните правой кнопкой мыши в мини-приложении и выберите _Inspect Element_.

## Тестирование с Eruda

[Eruda](https://github.com/liriliri/eruda) - это инструмент, предоставляющий веб-консоль для отладки и проверки веб-страниц на мобильных устройствах и в десктопных браузерах. Вот пошаговое руководство по использованию Eruda в проектах мини-приложений Telegram.

![1](/img/docs/telegram-apps/eruda-1.png)

### Шаг 1: Включите библиотеку Eruda

Для начала добавьте библиотеку Eruda в свой HTML-файл. Вы можете загрузить ее из CDN:

```html
<!-- Include Eruda from CDN (Recommended) -->
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
```

Или Вы можете получить его на npm.

```bash npm2yarn
npm install eruda --save
```

### Шаг 2: Инициализируйте Eruda

Затем инициализируйте Eruda при загрузке веб-страницы. Если Вы используете Eruda с CDN, сделайте следующее:

```html
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>
  // Initialize Eruda
  eruda.init();
</script>

```

Если Вы предпочитаете последние версии инструментов и пакетов, добавьте этот скрипт в свой проект:

```jsx
import eruda from 'eruda'

eruda.init()
```

### Шаг 3: Запустите Eruda

После развертывания вашего мини-приложения запустите его и просто нажмите на значок Eruda, чтобы начать отладку!

<ConceptImage style={{maxWidth:'200pt', margin: '10pt 20pt 0 0', display: 'flex-box'}} src="/img/docs/telegram-apps/eruda-2.png" />
<ConceptImage style={{maxWidth:'200pt', margin: '10pt 20pt', display: 'flex-box'}}  src="/img/docs/telegram-apps/eruda-3.png" />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/tips-and-tricks.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/guidelines/tips-and-tricks.mdx
================================================
# Советы и рекомендации

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

На этой странице Вы найдете список часто задаваемых вопросов, связанных с проблемами в TMA.

### Как решить проблему переполнения кэша в TMA?

:::tip
Помочь может только переустановка приложения Telegram.
:::

### Есть ли какие-то рекомендации по кэшированию заголовков для HTML-файлов?

:::tip
It's preferable to switch off cache in the HTML. To ensure your cache switched off, specify headers in your request according the following:

```curl
Cache-Control: no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

:::

### Что предлагается в качестве IDE для разработки TMA?

Процесс разработки в Google Chrome более удобен благодаря привычным инструментам разработки.

Вы можете взять параметры запуска мини-приложения и открыть эту ссылку в Chrome. В нашем случае проще всего получить параметры запуска из веб-версии Telegram: [https://web.telegram.org/](https://web.telegram.org/)

### Поведение при закрытии

Во многих веб-приложениях пользователи могут случайно закрыть приложение, во время прокрутки вверх. Это может произойти, если они перетянут секцию приложения слишком далеко, тем самым случайно вызвав его закрытие.

<p align="center">
    <br />
    <img width="240" src="/img/docs/telegram-apps/closing-behaviour.svg" alt="closing_behaviour_durgerking" />
    <br />
</p>

Чтобы предотвратить такое случайное закрытие, включите `closing_behavior` в TMA. Этот метод добавит диалог, в котором пользователь может либо подтвердить, либо отклонить закрытие веб-приложения.

```typescript
window.Telegram.WebApp.enableClosingConfirmation()
```

## Как указать описание для конкретного языка в TMA?

:::tip
You can configure your description with following methods:

- https://core.telegram.org/bots/api#setmydescription
- https://core.telegram.org/bots/api#setmyshortdescription

:::



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/notcoin.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/notcoin.mdx
================================================
# Notcoin

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Ссылки

- [Приложение Notcoin](https://t.me/notcoin_bot/click)
- [GitHub команды](https://github.com/OpenBuilders)
- [Фронтенд кликера Notcoin](https://github.com/OpenBuilders/notcoin-clicker)
- [Смарт-контракты Notcoin](https://github.com/OpenBuilders/notcoin-contract)

## Описание проекта

Ноткоин был создан компанией Open Builders, разработчиками на блокчейне TON. Это новаторский цифровой актив, который быстро привлек внимание онлайн-сообщества, достигнув впечатляющей отметки в 4 миллиона пользователей. В отличие от традиционных криптовалют, NotCoin сочетает в себе элементы геймификации, социального взаимодействия и цифрового дефицита для создания увлекательного пользовательского опыта. Эта инновация не только бросает вызов общепринятым представлениям о цифровых валютах, но и демонстрирует потенциал вирусного роста цифровых активов.

### Ключевые особенности

- **Геймификация**. NotCoin интегрирует в свою экосистему игровые элементы, поощряя вовлечение и участие пользователей с помощью заданий, достижений и вознаграждений. Такой подход значительно отличается от типичной модели других криптовалют, основанной на транзакциях, что делает его более доступным и приятным для широкой аудитории.
- **Социальная динамика**. Платформа использует социальные сети и создание сообществ в качестве основной части своей стратегии. Пользователи мотивированы приглашать друзей и участвовать в мероприятиях сообщества, что способствует формированию чувства принадлежности и вирусному распространению.
- **Цифровой дефицит и вознаграждения**. В NotCoin используется механика цифрового дефицита, гарантирующая, что актив остается ценным и востребованным. Это сочетается с системой вознаграждений, которая стимулирует активное участие и вклад в сообщество.
- **Инновационная технология**. Технология, лежащая в основе NotCoin, разработана с учетом масштабируемости, безопасности и простоты использования. Это гарантирует, что по мере роста платформы она останется эффективной и доступной для пользователей по всему миру.
- **Экологичность**. NotCoin сознательно относится к своему воздействию на окружающую среду, используя энергосберегающие технологии в своей работе и продвигая устойчивые практики в своем сообществе.

### Заключение

Число игроков NotCoin достигло 4 миллионов игроков, что свидетельствует об их инновационном подходе к цифровым активам. Сочетая геймификацию, социальную динамику, цифровой дефицит и передовые технологии, NotCoin установил новую парадигму в мире криптовалют. Их внимание к сообществу и экологической устойчивости еще больше выделяет их, делая не просто цифровой валютой, а движением в сторону более вовлеченной и ответственной цифровой экономики. Успех платформы свидетельствует о растущем интересе к альтернативным цифровым валютам и о потенциале массового роста в этом секторе, бросающем вызов традиционным представлениям о ценности и сообществе в цифровую эпоху.

## Front-end

В проекте представлен очень простой функционал. Компонент Notcoin - это интерактивная кнопка, которая реагирует на прикосновения пользователя с помощью анимации и динамических обновлений. Этот компонент можно использовать в различных интерактивных приложениях (играх), где необходима анимация и обратная связь с действиями пользователя.

## Смарт-контракт

### Жеттон Notcoin

Жеттон был создан на основе https://github.com/ton-blockchain/stablecoin-contract, но с удаленной функцией управления.

### Подробности

Notcoin представляет собой стандартные смарт-контракты TON jetton с дополнительным функционалом:

- Администратор jetton может изменить код jetton-minter и его полные данные.

:::warning
Эмитенту крайне важно надежно хранить закрытый ключ учетной записи администратора, чтобы избежать возможных рисков взлома. Настоятельно рекомендуется использовать двухфакторную аутентификацию кошелька в учетной записи администратора, закрытые ключи которого хранятся на разных air-gapped хостах / аппаратных кошельках.
:::

:::warning
Контракт не проверяет код и данные в сообщении об обновлении, поэтому можно нарушить контракт, если Вы отправите неверные данные или код. Поэтому Вам всегда следует проверять обновление в тестовой сети.
:::



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/overview.mdx
================================================
---
description: Мини-приложения Telegram (или TMA) - это веб-приложения, которые запускаются внутри мессенджера Telegram. Их создают с использованием веб-технологий - HTML, CSS и JavaScript.
---

import Button from '@site/src/components/button'

# Что такое мини-приложения?

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

<div style={{width: '100%', textAlign:'center', margin: '10pt auto'}}>
  <video style={{width: '100%',maxWidth: '600px', borderRadius: '10pt'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/twa.mp4" type="video/mp4" />

```
Your browser does not support the video tag.
```

</video>
</div>

Мини-приложения Telegram (или TMA) - это веб-приложения, которые запускаются внутри мессенджера Telegram. Их создают с использованием веб-технологий - HTML, CSS и JavaScript.

:::tip
Поскольку TMA являются веб-страницами и используют JavaScript, Вам необходимо выбрать [JS/TS-based SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript).
:::

Откройте доступ к **900-миллионной аудитории Telegram**. Представьте, что вы можете предложить свое приложение или услугу этой огромной базе пользователей всего одним щелчком мыши.

<Button href="/v3/guidelines/dapps/tma/tutorials/step-by-step-guide" colorType={'primary'} sizeType={'sm'}>

Пошаговое руководство

</Button>

<Button href="/v3/guidelines/dapps/tma/tutorials/app-examples" colorType={'secondary'} sizeType={'sm'}>

Смотрите примеры

</Button>

## Обзор

Telegram-боты могут полностью заменить любой вебсайт. Они поддерживают простую авторизацию, интегрированные платежи через 20 платежных систем (включая Google Pay и Apple Pay), рассылку персонализированных push-уведомлений пользователям и многое другое.

Благодаря мини-приложениям боты получают совершенно новые возможности. Разработчики ботов могут создавать бесконечно гибкие интерфейсы с помощью JavaScript, самого распространенного языка программирования в мире.

Вот несколько ключевых особенностей о мини-приложениях Telegram:

- **Интеграция в Telegram**. Мини-приложения (TMA) легко интегрируются в приложение Telegram, предоставляя пользователям единый интерфейс. Доступ к ним можно получить из чата Telegram или групповой беседы.
- **Расширенная функциональность**: Мини-приложения Telegram (TMA) могут предложить широкий спектр функциональных возможностей. Их можно использовать для различных целей, таких как игры, обмен контентом, инструменты продуктивности и многое другое. Эти приложения расширяют возможности платформы Telegram выходя за рамки базового обмена сообщениями.
- **Кроссплатформенная совместимость**: Поскольку мини-приложения Telegram работают через Интернет, они доступны в приложениях Telegram для Android, iOS, PC, Mac и Linux. Пользователи могут получить к ним доступ в один клик без необходимости дополнительных установок.
- **Взаимодействие с ботами**. Мини-приложения Telegram (TMA) часто используют ботов Telegram для обеспечения интерактивного и автоматизированного взаимодействия. Боты могут реагировать на вводимые пользователем данные, выполнять задачи и облегчать взаимодействие внутри мини-приложения.
- **Фреймворки для разработки**: Разработчики могут создавать мини-приложения Telegram (TMA), используя такие технологии веб-разработки, как HTML, CSS и JavaScript. Кроме того, Telegram предоставляет инструменты разработчика и API для создания приложений и их интеграции с платформой Telegram.
- **Возможности монетизации**. Мини-приложения Telegram (TMA) можно монетизировать различными способами, например, с помощью покупок в приложении, моделей подписки или рекламы, что делает их привлекательными для разработчиков и бизнесов.
- **Подходит для Web3**: TON SDK; TON Connect (это коммуникационный протокол, который облегчает связь между кошельками и приложениями на блокчейне TON); токены.
- **Развитие сообщества**. Telegram имеет обширное сообщество разработчиков, а также многие сторонние разработчики создают свои мини-приложения Telegram (TMA) и делятся этим с пользователями. Такой подход, основанный на сообществе, способствует инновациям и разнообразию доступных приложений.

В целом, мини-приложения Telegram (TMA) служат средством расширения возможностей работы с Telegram, предлагая дополнительные функции и услуги, а также предоставляя разработчикам возможность создавать и распространять свои приложения в экосистеме Telegram.

## Начало работы

### Документация TMA

- [Документация мини-приложений Telegram](https://docs.telegram-mini-apps.com) - документация для TWA, разработанная сообществом.
- [Документация TMA от Telegram](https://core.telegram.org/bots/webapps) - полное руководство на сайте Telegram.

### Сообщество разработчиков Telegram

Присоединяйтесь к специальному чату разработчиков Telegram, чтобы обсудить разработку мини-приложений и получить поддержку:

<Button href="https://t.me/+1mQMqTopB1FkNjIy" colorType={'primary'} sizeType={'sm'}>

Присоединяйтесь к чату

</Button>

### SDK для мини-приложений

- [twa-dev/sdk](https://github.com/twa-dev/sdk) - NPM-пакет для TMA SDK
- [twa-dev/boilerplate](https://github.com/twa-dev/Boilerplate) - еще один шаблон для нового TWA.
- [twa-dev/Mark42](https://github.com/twa-dev/Mark42) - Mark42 - это простая легко настраиваемая библиотека пользовательского интерфейса для TWA.
- [ton-defi-org/tonstarter-twa](https://github.com/ton-defi-org/tonstarter-twa) - шаблон для нового взаимодействия TWA с TON.

## Интеграция с TON Connect

Подключение кошельков пользователей с помощью протокола TON Connect. Подробнее об этом читайте здесь:

<Button href="/v3/guidelines/ton-connect/overview" colorType={'primary'} sizeType={'sm'}>

Откройте для себя TON Connect

</Button>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/app-examples.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/app-examples.mdx
================================================
import Button from '@site/src/components/button'

# Примеры мини-приложений (TMA)

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Ознакомьтесь с примерами ниже, чтобы узнать, как создать свое собственное мини-приложение Telegram.

## Пример базового TMA

<p align="center">
  <br />
    <img width="240" src="/img/docs/telegram-apps/tapps.png" alt="logo of telegram mini apps" />
      <br />
</p>

Это базовое и простое мини-приложение Telegram (TMA), реализованное с использованием простых JavaScript, HTML и CSS. Цель этого проекта - показать простой пример того, как создать простое TMA и запустить его в Telegram, не прибегая к сложным инструментам сборки или передовым библиотекам.

- Приложение доступно по прямой ссылке: [t.me/simple_telegram_mini_app_bot/app](https://t.me/simple_telegram_mini_app_bot/app)
- Или вы можете запустить приложение с помощью кнопки меню бота: [t.me/simple_telegram_mini_app_bot](https://t.me/simple_telegram_mini_app_bot)
- URL-адрес развертывания: [https://telegram-mini-apps-dev.github.io/vanilla-js-boilerplate/](https://telegram-mini-apps-dev.github.io/vanilla-js-boilerplate/)

<Button href="https://t.me/simple_telegram_mini_app_bot/app" colorType={'primary'} sizeType={'sm'}>

Открыть демо

</Button>

<Button href="https://github.com/Telegram-Mini-Apps-Dev/vanilla-js-boilerplate.git" colorType={'secondary'} sizeType={'sm'}>

GitHub

</Button>

### Особенности

- Минималистичный пользовательский интерфейс.
- Никакие внешние библиотеки или фреймворки не используется.
- Легко понять и модифицировать.

### Начало работы

#### Необходимые компоненты

Чтобы запустить этот пример, Вам понадобится обновленный веб-браузер с включенным JavaScript.

#### Установка

1. Скопируйте этот репозиторий на свой локальный компьютер:

```bash
git clone https://github.com/Telegram-Mini-Apps-Dev/vanilla-js-boilerplate.git
```

2. Перейдите в каталог проекта:

```bash
cd vanilla-js-boilerplate
```

Откройте index.html в выбранном вами редакторе кода или IDE.

### Использование

1. Откройте index.html в выбранном вами редакторе кода или IDE.
2. Внесите свои изменения.
3. Создайте свой собственный репозиторий GitHub, фиксируйте и выкладывайте свои обновления.
4. Перейдите на страницу вашего репозитория GitHub и откройте Settings. Проверьте вкладку Pages и раздел Build and deployment. Если была выбрана опция GitHub Actions, активы должны быть развернуты на Pages, и там будет URL, похожий на `https://<username>.github.io/vanilla-js-boilerplate/`. Вы можете скопировать этот URL и использовать его с ботом [BotFather](https://tg.me/BotFather), чтобы создать свой собственный TWA.

## Актуальный пример TMA

### Введение

Vite (что в переводе с французского означает "быстрый") - это инструмент для фронтенд сборки и сервер разработки, цель которого - обеспечить более быструю и компактную разработку новых веб-проектов. Мы будем использовать Vite для создания этого примера мини-приложения Telegram.

Вы можете ознакомиться с примерами проекта здесь [https://github.com/Telegram-Mini-Apps-Dev/vite-boilerplate](https://github.com/Telegram-Mini-Apps-Dev/vite-boilerplate) или воспользоваться следующими инструкциями.

### Необходимые компоненты

Мы начнем со скаффолдинга (шаблона) для Вашего проекта Vite.

С NPM:

```bash
$ npm create vite@latest
```

С Yarn:

```bash
$ yarn create vite
```

Затем следуйте подсказкам!

Или вы можете просто запустить эту команду, чтобы создать проект React с поддержкой TypeScript:

```bash
# npm 7+, extra double-dash is needed:
npm create vite my-react-telegram-web-app -- --template react-ts

# or yarn
yarn create vite my-react-telegram-web-app --template react-ts

# this will change the directory to recently created project
cd my-react-telegram-web-app
```

### Разработка мини-приложения

Теперь нам нужно запустить режим разработки проекта, выполнив следующие команды в терминале:

```bash
# npm
npm install
npm run dev --host

# or yarn
yarn
yarn dev --host
```

Параметр `--host` позволяет получить URL с IP-адресом, который вы можете использовать для тестирования в процессе разработки. Важное примечание - в режиме разработки мы будем использовать самозаверенный SSL-сертификат, что даст нам возможность протестировать наше приложение с горячей перезагрузкой только в веб-версии Telegram [https://web.telegram.org](https://web.telegram.org/a/#6549734463)/ из-за политики других платформ (iOS, Android, MacOS).

Нам нужно добавить плагин `@vitejs/plugin-basic-ssl`:

```bash npm2yarn
npm install @vitejs/plugin-basic-ssl
```

Теперь нам нужно изменить `vite.config.ts`. Добавьте импорт:

```jsx
import basicSsl from '@vitejs/plugin-basic-ssl';
```

И добавьте плагин

```jsx
export default defineConfig({
   plugins: [react(), basicSsl()]
});
```

Вы можете использовать `ngrok`, для подключения вашего локального сервера к Интернету с помощью SSL-сертификата. Вы сможете выполнять разработку с заменой горячего модуля на всех платформах Telegram. Откройте новое окно терминала и запустите:

```bash
# where 5173 is the port number from npm/yarn dev --host
ngrok http 5173
```

Также мы должны подготовить наш проект к размещению на GitHub Pages:

```jsx
export default defineConfig({
   plugins: [react(), basicSsl()],
	 build: {
	   outDir: './docs'
	 },
   base: './'
});
```

Мы будем использовать сценарий развертывания для GitHub Actions, который будет запускаться при нажатии на главную ветку. Из корня Вашего проекта:

```bash
# we are going to create GitHub Actions config for deployment
mkdir .github
cd .github
mkdir workflows
cd workflows
touch static.yml
```

Теперь добавьте эту конфигурацию в `static.yml`:

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

Не забудьте выбрать параметр GitHub Actions для Build and Deployment в Settings→Pages вашего репозитория GitHub. Теперь после каждого обновления ваш код будет разворачиваться на Pages.

![Скриншот 2023-09-11 в 22.07.44.png](/img/docs/telegram-apps/modern-1.png)

Теперь нужно добавить `@twa-dev/sdk`. Telegram распределяет SDK по [ссылке](https://core.telegram.org/bots/webapps#initializing-web-apps). Это своего рода устаревший способ работы с библиотекой. Пакет `@twa-dev/sdk` позволяет работать с SDK как с пакетом npm, так и с поддержкой TypeScript.

```bash npm2yarn
npm install @twa-dev/sdk
```

Откройте файл `/src/main.tsx` и добавьте следующее:

```tsx
import WebApp from '@twa-dev/sdk'

WebApp.ready();

ReactDOM.createRoot...
```

`WebApp.ready()` - это метод, который информирует приложение Telegram о том, что мини-приложение готово к отображению. Рекомендуется вызывать этот метод как можно раньше, как только все основные элементы интерфейса будут загружены. После вызова этого метода загрузочный плагин скрывается и мини-приложение отображается.

Затем можно добавить некоторое взаимодействие с пользователем. Перейдите в `src/App.tsx` и добавьте кнопку с предупреждением.

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

И теперь нам нужно создать Telegram бота, чтобы можно было запускать мини-приложение (TMA) в приложении мессенджера.

### Настройка бота для приложения

Чтобы подключить ваше мини-приложение к Telegram, вам нужно создать бота и настроить для него мини-приложение. Выполните следующие шаги, чтобы создать нового бота Telegram:

<Button href="/v3/guidelines/dapps/tma/tutorials/step-by-step-guide#setting-up-a-bot-for-the-app" colorType={'primary'} sizeType={'sm'}>

Настройка бота

</Button>

### Подсказки

С самозаверенным SSL-сертификатом у вас могут возникнуть проблемы с подобными предупреждениями. Нажмите кнопку "Дополнительно (Advanced)", а затем нажмите `Proceed <local dev server address here>`. Без этих шагов вы не сможете выполнять отладку в веб-версии Telegram.

![Скриншот 2023-09-11 в 18.58.24.png](/img/docs/telegram-apps/modern-2.png)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/design-guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/design-guidelines.mdx
================================================
# Рекомендации по дизайну мини-пиложений Telegram (TMA)

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Начиная с версии **6.10**, Telegram обновил цветовую палитру для веб-приложений: исправлены несколько старых цветов и добавлены новые.
:::

Для контекста вспомним историю обновлений.

Журнал изменений.

1. Обновлены `bg_color` и `secondary_bg_color`.

![](/img/docs/tma-design-guidelines/tma-design_1.png)

Причины:

- Эти цвета изначально предназначались для фона страниц, а не для элементов интерфейса.

Чтобы улучшить внешний вид ваших приложений, слегка скорректируйте использование цветовых переменных.

Выше приведен наглядный пример, который показывает, что изменится для iOS. Для Android изменений нет.

Новые цвета.
Также добавлено множество новых цветов. Большинство из них наиболее заметны на Android. Поэтому приведенные примеры будут показаны на базе Android, но актуальны для всех платформ.

![](/img/docs/tma-design-guidelines/tma-design_2.png)

Новые цвета.
Также добавлено множество новых цветов. Большинство из них наиболее заметны на Android. Поэтому приведенные примеры будут показаны на базе Android, но актуальны для всех платформ.

![](/img/docs/tma-design-guidelines/tma-design_3.png)

2. Стал доступен маркер accent_text_color, который пригодится для любых акцентных элементов в приложениях. Раньше все использовали менее подходящий темный link_color.

![](/img/docs/tma-design-guidelines/tma-design_4.png)

3. Для всех дополнительных элементов ячеек теперь лучше использовать `subtitle_text_color`. Это позволит сделать надписи более контрастными и улучшит доступность ваших приложений.

![](/img/docs/tma-design-guidelines/tma-design_5.png)

4. Для заголовков разделов карточек добавлен специальный маркер: `section_header_text_color`.

![](/img/docs/tma-design-guidelines/tma-design_6.png)

5. Для элементов, нажатие на которые приведет к разрушительному действию, теперь можно использовать `destructive_text_color` вместо пользовательских.

![](/img/docs/tma-design-guidelines/tma-design_6.png)

6. Как использовать `link_color` и `hint_color`?

<p align="center">
    <br />
    <img width="360" src="/img/docs/tma-design-guidelines/tma-design_7.png" alt="" />
    <br />
</p>

7. Как использовать `link_color` и `hint_color`?

Рекомендуется использовать их в качестве цветов подсказок под разделами, а также в качестве цвета ссылок для таких фонов - как `secondary_bg_color`.

## См. также

- [Источник](https://telegra.ph/Changes-in-Color-Variables-for-Telegram-Mini-Apps-11-20)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/step-by-step-guide.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tma/tutorials/step-by-step-guide.mdx
================================================
# Инструкция по запуску TMA

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Telegram Mini Apps (TMA) - это веб-приложения, которые запускаются внутри мессенджера Telegram. Они созданы с использованием веб-технологий - HTML, CSS и JavaScript. Telegram Mini Apps можно использовать для создания DApps, игр и других типов приложений, которые можно запускать внутри Telegram.

## Создайте свое приложение

1. Чтобы подключить Ваше мини-приложение к Telegram, разместите SDK-скрипт `telegram-web-app.js`, используя этот код:

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

2. После подключения скрипта, станет доступен объект **[window.Telegram.WebApp](https://core.telegram.org/bots/webapps#initializing-web-apps)**. Подробнее о создании Mini App с помощью [`telegram-web-app.js`](/v3/guidelines/dapps/tma/tutorials/app-examples#basic-tma-example) Вы можете прочитать здесь.

3. Современный способ подключения SDK - это NPM пакет для Telegram Mini Apps SDK:

```bash npm2yarn
npm i @twa-dev/sdk
```

Вы можете найти руководство для [`@twa-dev/sdk`](/v3/guidelines/dapps/tma/tutorials/app-example#modern-tma-example) здесь.

5. Когда Ваше мини-приложение будет готово и развернуто на веб-сервере, переходите к следующему шагу.

## Настройка бота для приложения

Чтобы подключить Ваше мини-приложение к Telegram, Вам нужно создать бота и настроить для него мини-приложение. Выполните следующие шаги, чтобы создать нового бота Telegram:

### 1. Начните чат с BotFather

- Откройте приложение Telegram или веб-версию.
- Найдите `@BotFather` через строку поиска или перейдите по ссылке [https://t.me/BotFather](https://t.me/BotFather).
- Начните чат с BotFather, нажав на кнопку `START`.

### 2. Создайте нового бота

- Отправьте команду `/newbot` в BotFather.
- BotFather попросит Вас выбрать имя для Вашего бота. Это отображаемое имя, которое может содержать пробелы.
- Далее Вам будет предложено выбрать имя пользователя для Вашего бота. Оно должно заканчиваться на `bot` (например, `sample_bot`) и быть уникальным.

### 3. Настройка Bot Mini App

- Отправьте команду `/mybots` в BotFather.
- Выберите своего бота из списка и выберите опцию **Настройки бота**.
- Выберите опцию **Кнопка меню**.
- Выберите опцию **Редактировать URL кнопки меню** и отправьте URL Вашего приложения Telegram Mini App, например, ссылку с GitHub Pages deploy.

### 4. Доступ к боту

- Теперь Вы можете искать своего бота, используя его имя пользователя в строке поиска Telegram.
- Нажмите кнопку рядом с приложением, чтобы запустить Ваше Telegram Mini App в мессенджере.
- Вы великолепны!



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/mint-your-first-token.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/mint-your-first-token.md
================================================
# Сминтите свой первый Jetton

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Добро пожаловать,  разработчик! Очень приятно видеть Вас здесь. 👋

В этой статье мы расскажем Вам о создании Вашего первого взаимозаменяемого токена (Jetton) на TON.

Чтобы сминтить токен, мы будем использовать [TON Minter](https://minter.ton.org/).

## 📖 Чему Вы научитесь

В этой статье Вы узнаете, как:

- развернуть токен с помощью Minter TON
- настроить токен
- управлять токеном и использовать его
- отредактировать параметры токена

## 📌 Подготовьтесь перед началом работы

1. Для начала Вам необходимо иметь кошелек [Tonhub](https://ton.app/wallets/tonhub-wallet) / [Tonkeeper](https://ton.app/wallets/tonkeeper) или любой другой, поддерживаемый на сервисе.
2. На Вашем балансе должно быть более 0,25 Toncoin и дополнительные средства для покрытия комиссии за блокчейн.

:::tip Совет на старте
~0,5 TON должно быть достаточно для этого урока.
:::

## 🚀 Давайте начнем!

С помощью веб-браузера откройте сервис [TON Minter](https://minter.ton.org/) / [TON Minter testnet](https://minter.ton.org/?testnet=true).

![image](/img/tutorials/jetton/jetton-main-page.png)

### Разверните жетон с помощью браузера

#### Подключите кошелек

Нажмите кнопку `Подключить кошелек`, чтобы подключить Ваш кошелек [Tonhub](https://ton.app/wallets/tonhub-wallet) или другой кошелек из представленных ниже.

#### ![image](/img/tutorials/jetton/jetton-connect-wallet.png)

**Просканируйте QR-код** в [Мобильном кошельке (Tonhub, например)](https://ton.app/wallets/tonhub-wallet)

#### Заполните пустые места соответствующей информацией

1. Название (обычно 1-3 слова).
2. Символ (обычно 3-5 заглавных символов).
3. Сумма (например, 1,000,000).
4. Описание токена (необязательно).

#### URL-адрес логотипа токена (необязательно)

![image](/img/tutorials/jetton/jetton-token-logo.png)

Если вы хотите иметь привлекательный токен, вам нужно где-нибудь разместить красивый логотип. Например:

- https://bitcoincash-example.github.io/website/logo.png

:::info
You can easily find out about the URL placement of the logo in the [repository](https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices) in the "Where is this metadata stored" paragraph.

- On-chain.
- Off-chain IPFS.
- Off-chain веб-сайт.
 :::

#### Как создать URL-адрес своего логотипа?

1. Подготовьте **256x256** PNG-изображение логотипа токена с прозрачным фоном.
2. Получите ссылку на свой логотип. Хорошим решением является [GitHub Pages](https://pages.github.com/). Давайте воспользуемся им.
3. [Создайте новый публичный репозиторий](https://docs.github.com/en/get-started/quickstart/create-a-repo) с именем `website`.
4. Загрузите подготовленное изображение в git и включите `GitHub Pages`.
 1. [Добавьте страницы GitHub в свой репозиторий](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
 2. [Загрузите свое изображение и получите ссылку](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
5. Если у вас есть возможность, мы рекомендуем купить пользовательский домен для вашего проекта, например, `bitcoincash.org`. Используйте любого продавца доменов, например [Google Domains](https://domains.google/) или [GoDaddy](https://www.godaddy.com/). Затем подключите свой пользовательский домен к репозиторию на предыдущем шаге, следуя инструкциям [здесь](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
6. Если у вас есть свой домен, ваш URL-адрес изображения должен быть `https://bitcoincash.org/logo.png` вместо `github.io`. Это устранит будущую зависимость от GitHub и позволит вам в дальнейшем сменить хостинг, что является хорошей возможностью для сохранения.

## 💸 Отправить жетоны

В правой части экрана Вы можете **отправить токены** на мультивалютные кошельки, такие как [Tonkeeper](https://tonkeeper.com/) или [Tonhub](https://ton.app/wallets/tonhub-wallet).

![image](/img/tutorials/jetton/jetton-send-tokens.png)

:::info
You also can **burn** your tokens to reduce their amount.

![image](/img/tutorials/jetton/jetton-burn-tokens.png)
:::

### 📱 Отправляйте токены с телефона с помощью Tonkeeper

Пререквизиты:

1. Чтобы отправить их, у Вас на балансе уже должны быть токены.
2. Для оплаты транзакционных сборов должно быть не менее 0,1 Тонкоина.

#### Пошаговое руководство

Затем перейдите к **Вашему токену**, установите **сумму** для отправки и введите **адрес получателя**.

![image](/img/tutorials/jetton/jetton-send-tutorial.png)

## 📚 Использование токена на сайте

Вы можете получить доступ к **полю поиска** в верхней части сайта, введя адрес токена, чтобы управлять им как владелец.

:::info
The address can be found on the right side if you are already in the owner panel, or you can find the token address when receiving an airdrop.

![image](/img/tutorials/jetton/jetton-wallet-address.png)
:::

## ✏️ Настройка жетона (токена)

С помощью языка [FunC](/v3/documentation/smart-contracts/func/overview) вы можете изменить поведение токена в вашу пользу.

Чтобы внести изменения, начните отсюда:

- https://github.com/ton-blockchain/minter-contract

### Пошаговое руководство для разработчиков

1. Убедитесь, что у Вас есть все "Зависимости и требования" из репозитория [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts).
2. Клонируйте репозиторий [minter-contract repository](https://github.com/ton-blockchain/minter-contract) и переименуйте проект.
3. Для установки необходимо открыть терминал в корневой директории и выполнить команду:

```bash npm2yarn
npm install
```

4. Редактируйте оригинальные файлы смарт-контракта таким же образом в корневом терминале. Все файлы контрактов находятся в `contracts/*.fc`

5. Создайте проект с помощью:

```bash npm2yarn
npm run build
```

Результат сборки опишет процесс создания необходимых файлов и поиска смарт-контрактов.

:::info
Просмотрите консоль, там много советов!
:::

6. Вы можете протестировать свои изменения, используя:

```bash npm2yarn
npm run test
```

7. Отредактируйте **имя** и другие метаданные токена в `build/jetton-minter.deploy.ts`, изменив объект JettonParams.

```js
// This is example data - Modify these parameters for your jetton!
// - Data is stored on-chain (except for the image data itself)
// - Owner should usually be the deploying wallet's address.
  
const jettonParams = {
 owner: Address.parse("EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2"),
 name: "MyJetton",
 symbol: "JET1",
 image: "https://www.linkpicture.com/q/download_183.png", // Image URL
 description: "My jetton",
};
```

8. Для развёртывания токена используйте следующую команду:

```bash npm2yarn
npm run deploy
```

Результат выполнения Вашего проекта:

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
 - Let's deploy the contract on-chain.
 - Deploy transaction sent successfully
 - Block explorer link: https://tonwhales.com/explorer/address/YOUR-ADDRESS
 - Waiting up to 20 seconds to check if the contract was actually deployed.
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

## Что дальше?

Если Вы хотите углубиться, прочтите эту статью Tal Kol:

- [Как и почему нужно чередовать смарт-контракты — изучаем анатомию TON Jettons](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)

Если вы хотите узнать больше о других решениях для минтинга токенов, прочитайте эту статью:

- [История массового минтинга на TON](https://blog.ton.org/history-of-mass-minting-on-ton)

## Ссылки

- Проект: https://github.com/ton-blockchain/minter-contract
- [Обработка жетонов](/v3/guidelines/dapps/asset-processing/jettons)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/nft-minting-guide.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/nft-minting-guide.md
================================================
# Пошаговое создание коллекции NFT

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## 👋 Введение

Невзаимозаменяемые токены (NFT) стали одной из самых обсуждаемых тем в мире цифрового искусства и коллекционирования. NFT - это уникальные цифровые активы, использующие технологию блокчейн для подтверждения права собственности и подлинности. Они открыли перед создателями и коллекционерами новые возможности для монетизации и торговли цифровым искусством, музыкой, видео и другими цифровым контентом. За последние годы рынок NFT стремительно вырос, а некоторые сделки достигли миллионов долларов. В этой статье мы пошагово создадим коллекцию NFT на TON.

**Вот такая прекрасная коллекция уток будет создана вами к концу этого урока:**

![](/img/tutorials/nft/collection.png)

## 🦄 Чему Вы научитесь

1. Вы создадите коллекцию NFT на TON.
2. Вы поймете, как работают NFT на TON.
3. Вы выставите NFT на продажу.
4. Вы загрузите метаданные на [pinata.cloud](https://pinata.cloud).

## 💡 Необходимые компоненты

У вас уже должен быть testnet кошелек, в котором находится не менее 2 TON. Вы можете получить testnet коины от [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

:::info Как открыть testnet-версию моего кошелька Tonkeeper?

1. Откройте настройки и нажмите 5 раз на логотип Tonkeeper внизу экрана.
2. Активируйте Dev mode.
3. Вернитесь в главное меню и создайте новый testnet-кошелек - Добавить кошелек/Добавить аккаунт Testnet.
 :::

Мы будем использовать Pinata как систему хранения IPFS, поэтому вам также нужно создать аккаунт на [pinata.cloud](https://pinata.cloud) и получить api_key & api_secreat. Официальная обучающая [документация](https://docs.pinata.cloud/account-management/api-keys) Pinata может помочь в этом. Как только вы получите эти API-токены, возвращайтесь сюда!

## 💎 Что такое NFT на TON?

Прежде чем перейти к основной части нашего руководства, необходимо понять, как NFT работают на TON в общих чертах. Неожиданно, но мы начнем с объяснения того, как NFT работают на Ethereum (ETH), чтобы понять чем реализация NFT на TON уникальна по сравнению с другими блокчейнами в этой отрасли.

### Реализация NFT на ETH

Реализация NFT на ETH крайне проста - существует 1 основной контракт коллекции, который хранит простую хэш-таблицу, содержащую данные NFT из этой коллекции. Все запросы, связанные с этой коллекцией (если какой-либо пользователь хочет передать NFT, выставить его на продажу и т.д.), отправляются именно в этот единый контракт коллекции.

![](/img/tutorials/nft/eth-collection.png)

### Проблемы такой реализации в TON

Проблемы такой реализации в контексте TON подробно описаны в [стандарте NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) в TON:

- Непредсказуемоееее потребление газа. В TON расход газа на операции со словарем зависит от точного набора ключей. Кроме того, TON - это асинхронный блокчейн. Это означает, что если Вы отправляете сообщение смарт-контракту, то вы не знаете, сколько сообщений от других пользователей дойдет до смарт-контракта раньше вашего сообщения. Таким образом, вы не знаете, каким будет размер словаря в тот момент, когда ваше сообщение достигнет смарт-контракта. Это нормально для простого взаимодействия кошелек -> смарт-контракт NFT, но неприемлемо для цепочек смарт-контрактов, например, кошелек -> смарт-контракт NFT -> аукцион -> смарт-контракт NFT. Если мы не можем предсказать расход газа, то может возникнуть ситуация, когда владелец сменился в смарт-контракте NFT, но для операции аукциона не хватило Тонкоинов. Использование смарт-контрактов без словарей дает детерминированный расход газа.

- Не масштабируется (становится узким местом). Масштабирование в TON основано на концепции шардинга, то есть автоматическом разделении сети на шардинги при высокой нагрузке. Один большой смарт-контракт популярного NFT противоречит этой концепции. В этом случае многие транзакции будут ссылаться на один смарт-контракт. Архитектура TON предусматривает использование шардинговых смарт-контрактов (см. whitepaper), но на данный момент они не реализованы.

*TL;DR Решение ETH не масштабируемо и не подходит для асинхронных блокчейнов, таких, как TON.*

### Реализация TON NFT

В TON у нас есть мастер-контракт — смарт-контракт нашей коллекции, который хранит метаданные и адрес владельца коллекции. Главное, что если мы хотим создать (минтить) новый NFT-элемент, нам нужно просто отправить сообщение этому контракту коллекции. Этот контракт коллекции затем развернет новый контракт NFT-элемента, используя данные, которые мы предоставим.

![](/img/tutorials/nft/ton-collection.png)

:::info
Вы можете ознакомиться со статьей [Обработка NFT в TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) или прочитать [стандарт NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md), если хотите более подробно изучить эту тему
:::

## ⚙ Настройка среды разработки

Давайте начнем с создания пустого проекта:

1. Создайте новую папку

```bash
mkdir MintyTON
```

2. Откройте эту папку

```bash
cd MintyTON
```

3. Инициализируем наш проект

```bash
yarn init -y
```

4. Установите typescript

```bash
yarn add typescript @types/node -D
```

5. Запуск проекта TypeScript

```bash
tsc --init
```

6. Скопируйте эту конфигурацию в файл tsconfig.json

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

7. Добавьте скрипт для сборки и запуска нашего приложения в `package.json`.

```json
"scripts": {
    "start": "tsc --skipLibCheck && node dist/app.js"
  },
```

8. Установите необходимые библиотеки

```bash
yarn add @pinata/sdk dotenv @ton/ton @ton/crypto @ton/core buffer
```

9. Создайте файл `.env` и добавьте свои собственные данные на основе этого шаблона

```
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_secret_api_key
MNEMONIC=word1 word2 word3 word4
TONCENTER_API_KEY=aslfjaskdfjasasfas
```

Вы можете получить API-ключ для toncenter у [@tonapibot](https://t.me/tonapibot) и выбрать mainnet или testnet. В переменной `MNEMONIC` храните 24 слова сид-фразы кошелька владельца коллекции.

Отлично! Теперь мы готовы начать писать код для нашего проекта.

### Напишите вспомогательные функции

Сначала давайте создадим функцию `openWallet` в файле `src/utils.ts`, которая будет открывать наш кошелек по мнемонической фразе и возвращать его publicKey и secretKey.

Мы получаем пару ключей на основе 24 слов (seed-фразы):

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

Создайте экземпляр класса для взаимодействия с toncenter:

```ts
  const toncenterBaseEndpoint: string = testnet
    ? "https://testnet.toncenter.com"
    : "https://toncenter.com";

  const client = new TonClient({
    endpoint: `${toncenterBaseEndpoint}/api/v2/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  });
```

И, наконец, откройте наш кошелек:

```ts
  const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });

  const contract = client.open(wallet);
  return { contract, keyPair };
}
```

Отлично, после этого создадим основную точку входа для нашего проекта — `src/app.ts`. Здесь мы будем использовать только что созданную функцию `openWallet` и вызывать нашу основную функцию `init`. Пока этого будет достаточно.

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

В завершение давайте создадим файл `delay.ts` в директории `src`, в котором мы создадим функцию, которая будет ждать, пока `seqno` увеличится.

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

:::info Что это такое - seqno?
Проще говоря, seqno — это просто счётчик исходящих транзакций, отправленных кошельком.
Seqno используется для предотвращения повторных атак (Replay Attacks). Когда транзакция отправляется в смарт-контракт кошелька, он сравнивает поле seqno транзакции с тем, что хранится в его памяти. Если значения совпадают, транзакция принимается, и хранимое значение seqno увеличивается на единицу. Если значения не совпадают, транзакция отклоняется. Поэтому после каждой исходящей транзакции нам нужно будет немного подождать.
:::

## 🖼 Подготовьте метаданные

Метаданные — это просто информация, которая описывает наш NFT или коллекцию. Например, это может быть имя, описание и другие атрибуты.

Во-первых, нам нужно хранить изображения наших NFT в папке `/data/images` с именами `0.png`, `1.png` и так далее для фото предметов, а также `logo.png` для аватара нашей коллекции. Вы можете легко [скачать пакет](/img/tutorials/nft/ducks.zip) с изображениями уток или добавить свои изображения в эту папку. Также мы будем хранить все наши файлы метаданных в папке `/data/metadata/`.

### Технические характеристики NFT

Большинство продуктов на TON поддерживают такие спецификации метаданных для хранения информации о коллекции NFT:

| Наименование                      | Пояснение                                                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                              | Наименование коллекции                                                                                                                                                 |
| description                       | Описание коллекции                                                                                                                                                     |
| image                             | Ссылка на изображение, которое будет отображаться как аватар. Поддерживаемые форматы ссылок: https, ipfs, TON Storage. |
| cover_image  | Ссылка на изображение, которое будет отображаться в качестве изображения обложки коллекции.                                                            |
| social_links | Список ссылок на профили проекта в социальных сетях. Используйте не более 10 ссылок.                                                   |

![image](/img/tutorials/nft/collection-metadata.png)

Основываясь на этой информации, давайте создадим собственный файл метаданных `collection.json`, который будет описывать метаданные нашей коллекции!

```json
{
  "name": "Ducks on TON",
  "description": "This collection is created for showing an example of minting NFT collection on TON. You can support creator by buying one of this NFT.",
  "social_links": ["https://t.me/DucksOnTON"]
}
```

Обратите внимание, что мы не написали параметр "image", Вы узнаете почему чуть позже, просто подождите!

После создания метаданных коллекции, нам нужно создать метаданные для наших NFT

Спецификации метаданных NFT предмета:

| Наименование                      | Пояснение                                                                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name                              | Название NFT. Рекомендуемая длина: Не более 15-30 символов                                                                                                                   |
| description                       | Описание NFT. Рекомендуемая длина: До 500 символов                                                                                                                           |
| image                             | Ссылка на изображение NFT.                                                                                                                                                                   |
| attributes                        | Атрибуты NFT. Список атрибутов, в котором указан тип_черты (имя атрибута) и значение (краткое описание атрибута). |
| lottie                            | Ссылка на JSON-файл с анимацией Lottie. Если указана, анимация Lottie с этой ссылки будет воспроизводиться на странице с NFT.                                                |
| content_url  | Ссылка на дополнительный контент.                                                                                                                                                            |
| content_type | Тип контента, добавленного через ссылку content_url. Например, файл video/mp4.                                                                          |

![image](/img/tutorials/nft/item-metadata.png)

```json
{
  "name": "Duck #00",
  "description": "What about a round of golf?",
  "attributes": [{ "trait_type": "Awesomeness", "value": "Super cool" }]
}
```

После этого вы можете создать любое количество файлов NFT-элементов с их метаданными.

### Загрузите метаданные

Теперь давайте напишем код, который загрузит наши метаданные на IPFS. Создайте файл `metadata.ts` в каталоге `src` и добавьте все необходимые импорты:

```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
```

После этого нам нужно создать функцию, которая на самом деле загрузит все файлы из нашей папки в IPFS:

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

Отлично! Давайте вернемся к главному вопросу: почему мы оставили поле "изображение" в файлах метаданных пустым? Представьте себе ситуацию, когда Вы хотите создать 1000 NFT в своей коллекции и, соответственно, должны вручную пройтись по каждому элементу и вручную вставить ссылку на свою картинку.
Это очень неудобно и неправильно, поэтому давайте напишем функцию, которая будет делать это автоматически!

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

Здесь мы сначала считываем все файлы в указанной папке:

```ts
const files = readdirSync(metadataFolderPath);
```

Выполните итерацию над каждым файлом и получите его содержимое

```ts
const filePath = path.join(metadataFolderPath, filename)
const file = await readFile(filePath);

const metadata = JSON.parse(file.toString());
```

После этого мы присваиваем значению поля image ссылку вида `ipfs://{IpfsHash}/{index}.jpg`, если это не последний файл в папке. В противном случае присваиваем ссылку `ipfs://{imagesIpfsHash}/logo.jpg` и перезаписываем файл с новыми данными.

Полный код файла metadata.ts:

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

Отлично, давайте вызовем эти методы в нашем файле app.ts.
Добавьте импорты наших функций:

```ts
import { updateMetadataFiles, uploadFolderToIPFS } from "./src/metadata";
```

Сохраните переменные с путями к папкам с метаданными или изображениями, а затем вызовите наши функции для загрузки метаданных.

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

После этого Вы можете запустить `yarn start` и увидеть ссылку на Ваши развернутые метаданные!

### Кодирование контента вне цепочки

Как будет храниться ссылка на наши метаданные в смарт-контракте? Этот вопрос можно полностью ответить с помощью [Стандарта токен-данных](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
В некоторых случаях будет недостаточно просто указать нужный флаг и предоставить ссылку в виде ASCII-символов, поэтому давайте рассмотрим вариант, при котором потребуется разделить нашу ссылку на несколько частей, используя формат с подчеркиваниями (snake format).

Сначала создайте функцию в файле `./src/utils.ts`, которая будет разбивать наш буфер на части:

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

И создайте функцию, которая свяжет все части в одну змеиную ячейку:

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

Наконец, нам нужно создать функцию, которая будет кодировать содержимое ячейки с помощью этой функции:

```ts
export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  const offChainPrefix = Buffer.from([0x01]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}
```

## 🚢 Разверните коллекцию NFT

Когда наши метаданные будут готовы и уже загружены в IPFS, мы можем приступить к развертыванию нашей коллекции!

Мы создадим файл, который будет содержать всю логику, связанную с нашей коллекцией, в файле `/contracts/NftCollection.ts`. Как всегда, начнем с импорта:

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

И объявим тип, который будет описывать данные инициализации, необходимые для нашей коллекции:

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

| Наименование         | Пояснение                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| ownerAddress         | Адрес, который будет установлен в качестве владельца нашей коллекции. Только владелец будет иметь возможность создавать новые NFT |
| royaltyPercent       | Процент от каждой суммы продажи, который будет поступать на указанный адрес                                                                       |
| royaltyAddress       | Адрес кошелька, который будет получать роялти с продаж этой коллекции NFT                                                                         |
| nextItemIndex        | Индекс, который должен быть присвоен следующему элементу NFT                                                                                      |
| collectionContentUrl | URL-адрес к метаданным коллекции                                                                                                                  |
| commonContentUrl     | Базовый URL для метаданных элементов NFT                                                                                                          |

Сначала давайте напишем приватный метод, который будет возвращать ячейку с кодом нашей коллекции.

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

В этом коде мы просто читаем ячейку из base64-представления смарт-контракта коллекции.

Хорошо, осталась только ячейка с данными инициализации нашей коллекции. По сути, нам нужно просто правильно сохранить данные из `collectionData`. Сначала нам нужно создать пустую ячейку и сохранить в ней адрес владельца коллекции и индекс следующего элемента, который будет создан. Давайте напишем следующий приватный метод:

```ts
private createDataCell(): Cell {
  const data = this.collectionData;
  const dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex, 64);
```

Затем, после этого, мы создаем пустую ячейку, которая будет хранить контент нашей коллекции, и после этого сохраняем ссылку на ячейку с закодированным контентом нашей коллекции. И сразу после этого сохраняем ссылку на `contentCell` в основной ячейке данных нашей коллекции.

```ts
const contentCell = beginCell();

const collectionContent = encodeOffChainContent(data.collectionContentUrl);

const commonContent = beginCell();
commonContent.storeBuffer(Buffer.from(data.commonContentUrl));

contentCell.storeRef(collectionContent);
contentCell.storeRef(commonContent.asCell());
dataCell.storeRef(contentCell);
```

После этого мы просто создаем ячейку с кодом NFT-элементов, которые будут созданы в нашей коллекции, и сохраняем ссылку на эту ячейку в `dataCell`

```ts
const NftItemCodeCell = Cell.fromBase64(
  "te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu"
);
dataCell.storeRef(NftItemCodeCell);
```

Параметры роялти хранятся в смарт-контракте через `royaltyFactor`, `royaltyBase` и `royaltyAddress`. Процент роялти можно вычислить по формуле `(royaltyFactor / royaltyBase) * 100%`. Таким образом, если мы знаем процент роялти (`royaltyPercent`), то не составит труда вычислить `royaltyFactor`.

```ts
const royaltyBase = 1000;
const royaltyFactor = Math.floor(data.royaltyPercent * royaltyBase);
```

После вычислений, нам нужно сохранить данные о роялти в отдельной ячейке и предоставить ссылку на эту ячейку в `dataCell`.

```ts
const royaltyCell = beginCell();
royaltyCell.storeUint(royaltyFactor, 16);
royaltyCell.storeUint(royaltyBase, 16);
royaltyCell.storeAddress(data.royaltyAddress);
dataCell.storeRef(royaltyCell);

return dataCell.endCell();
}
```

Теперь давайте напишем геттер, который будет возвращать `StateInit` нашей коллекции. Этот метод создаст ячейки для всех данных коллекции (включая данные роялти, владельца и другие параметры), а затем соберет и вернет ссылку на начальные данные (`StateInit`):

```ts
public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}
```

И геттер, который будет вычислять адрес нашей коллекции (адрес смарт-контракта в TON — это просто хэш его `StateInit`)

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

Осталось только написать метод, который развернет смарт-контракт в блокчейне!

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

Развертывание нового смарт-контракта в нашем случае — это просто отправка сообщения с нашего кошелька на адрес коллекции (который мы можем вычислить, если у нас есть `StateInit`), с его `StateInit`!

Когда владелец минтит новый NFT, коллекция принимает сообщение от владельца и отправляет новое сообщение в созданный смарт-контракт NFT (что требует оплаты комиссии), поэтому давайте напишем метод, который будет пополнять баланс коллекции в зависимости от количества NFT для минта:

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

Отлично, давайте теперь добавим несколько include в наш `app.ts`:

```ts
import { waitSeqno } from "./delay";
import { NftCollection } from "./contracts/NftCollection";
```

И добавьте несколько строк в конец функции `init()`, чтобы развернуть новую коллекцию:

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

## 🚢 Развертывание элементов NFT

Когда наша коллекция будет готова, мы сможем начать минтить наши NFT! Мы будем хранить код в `src/contracts/NftItem.ts`

Неожиданно, но теперь нам нужно вернуться в `NftCollection.ts` и добавить этот тип рядом с `collectionData` в верхней части файла.

```ts
export type mintParams = {
  queryId: number | null,
  itemOwnerAddress: Address,
  itemIndex: number,
  amount: bigint,
  commonContentUrl: string
}
```

| Наименование     | Пояснение                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| itemOwnerAddress | Адрес, который будет установлен в качестве владельца предмета                                                    |
| itemIndex        | Индекс предмета NFT                                                                                              |
| amount           | Количество TON, которое будет отправлено в NFT с развертыванием                                                  |
| commonContentUrl | Полная ссылка на URL элемента может быть сформирована как "commonContentUrl" коллекции + этот `commonContentUrl` |

И создайте метод в классе NftCollection, который будет строить тело для развертывания нашего NFT-элемента. Сначала сохраните бит, который будет указывать смарт-контракту коллекции, что мы хотим создать новый NFT. После этого просто сохраните `queryId` и индекс этого NFT-элемента.

```ts
public createMintBody(params: mintParams): Cell {
    const body = beginCell();
    body.storeUint(1, 32);
    body.storeUint(params.queryId || 0, 64);
    body.storeUint(params.itemIndex, 64);
    body.storeCoins(params.amount);
```

Позже создайте пустую ячейку и сохраните в ней адрес владельца этого NFT:

```ts
    const nftItemContent = beginCell();
    nftItemContent.storeAddress(params.itemOwnerAddress);
```

И сохраните в этой ячейке (с содержимым NFT Item) ссылку на метаданные этого элемента:

```ts
    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(params.commonContentUrl));
    nftItemContent.storeRef(uriContent.endCell());
```

Сохраните ссылку на ячейку с содержимым элемента в ячейке нашего тела:

```ts
    body.storeRef(nftItemContent.endCell());
    return body.endCell();
}
```

Отлично! Теперь мы можем вернуться к `NftItem.ts`. Все, что нам нужно сделать, это отправить сообщение в наш смарт-контракт коллекции с телом нашего NFT.

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

В конце мы напишем короткий метод, который будет получать адрес NFT по его индексу.

Начнем с создания переменной `client`, которая поможет нам вызвать метод `get` смарт-контракта коллекции.

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

Затем мы вызовем метод `get` смарт-контракта коллекции, который вернет адрес NFT в этой коллекции с заданным индексом

```ts
  const response = await client.runMethod(
    collectionAddress,
    "get_nft_address_by_index",
    [{ type: "int", value: BigInt(itemIndex) }]
  );
```

... и разобрать этот адрес!

```ts
    return response.stack.readAddress();
}
```

Теперь давайте добавим немного кода в `app.ts`, чтобы автоматизировать процесс минтинга каждого NFT:

```ts
  import { NftItem } from "./contracts/NftItem";
  import { toNano } from '@ton/core';
```

Сначала прочитайте все файлы в папке с нашими метаданными:

```ts
const files = await readdir(metadataFolderPath);
files.pop();
let index = 0;
```

Во-вторых, необходимо пополнить баланс нашей коллекции:

```ts
seqno = await collection.topUpBalance(wallet, files.length);
await waitSeqno(seqno, wallet);
console.log(`Balance top-upped`);
```

В конечном итоге нужно пройти по каждому файлу с метаданными, создать экземпляр `NftItem` и вызвать метод развертывания (deploy). После этого необходимо немного подождать, чтобы значение seqno увеличилось:

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

## 🏷 Поставьте NFT на продажу

Чтобы выставить NFT на продажу, нам нужно два смарт-контракта.

- Маркетплейс, который отвечает только за логику создания новых продаж
- Контракт продажи, который отвечает за логику покупки/отмены продажи

### Разверните торговую площадку

Создайте новый файл в директории `/contracts/NftMarketplace.ts`. Как обычно, создайте базовый класс, который будет принимать адрес владельца маркетплейса и создавать ячейку с кодом (мы будем использовать [базовую версию контракта NFT-маркетплейса](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-marketplace.fc)) этого смарт-контракта и начальные данные.

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

Давайте создадим метод, который будет вычислять адрес нашего смарт-контракта на основе StateInit:

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

После этого нам нужно создать метод, который будет разворачивать нашу торговую площадку:

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

Как видите, этот код не отличается от развертывания других смарт-контрактов (смарт-контракта nft-item, развертывания новой коллекции). Единственное отличие — вы можете заметить, что мы изначально пополняем наш маркетплейс не на 0,05 TON, а на 0,5. Почему так? Когда развертывается новый смарт-контракт продажи, маркетплейс принимает запрос, обрабатывает его и отправляет сообщение новому контракту (да, ситуация аналогична ситуации с NFT-коллекцией). Именно поэтому нам нужно немного больше TON для оплаты комиссий.

В конце давайте добавим несколько строк кода в наш файл `app.ts`, чтобы развернуть нашу торговую площадку:

```ts
import { NftMarketplace } from "./contracts/NftMarketplace";
```

А затем

```ts
console.log("Start deploy of new marketplace  ");
const marketplace = new NftMarketplace(wallet.contract.address);
seqno = await marketplace.deploy(wallet);
await waitSeqno(seqno, wallet);
console.log("Successfully deployed new marketplace");
```

### Разверните контракт на продажу

Отлично! Сейчас мы уже можем развернуть смарт-контракт для продажи наших NFT. Как это будет работать? Нам нужно развернуть новый контракт, а затем "перевести" наш NFT в контракт продажи (другими словами, нам нужно просто изменить владельца нашего NFT на контракт продажи в данных предмета). В этом уроке мы будем использовать смарт-контракт продажи [nft-fixprice-sale-v2](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v2.fc).

Создайте новый файл в `/contracts/NftSale.ts`. Прежде всего, давайте объявим новый тип, который будет описывать данные нашего смарт-контракта продажи:

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

А теперь давайте создадим класс и основной метод, который будет создавать ячейку начальных данных для нашего смарт-контракта.

```ts
export class NftSale {
  private data: GetGemsSaleData;

  constructor(data: GetGemsSaleData) {
    this.data = data;
  }
}
```

Мы начнем с создания ячейки с информацией о сборах. Нам нужно будет сохранить адрес, который будет получать сборы за маркетплейс, сумму TON, которую нужно отправить торговой площадке в качестве сбора, а также адрес, который будет получать роялти от продажи, и размер роялти.

```ts
private createDataCell(): Cell {
  const saleData = this.data;

  const feesCell = beginCell();

  feesCell.storeAddress(saleData.marketplaceFeeAddress);
  feesCell.storeCoins(saleData.marketplaceFee);
  feesCell.storeAddress(saleData.royaltyAddress);
  feesCell.storeCoins(saleData.royaltyAmount);
```

После этого мы можем создать пустую ячейку и просто сохранить в нее информацию из `saleData` в правильном порядке, а сразу после этого сохранить ссылку на ячейку с информацией о сборах:

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

Как обычно, добавим методы для получения `stateInit`, ячейки с кодом и адреса нашего смарт-контракта.

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

Осталось только сформировать сообщение, которое мы отправим нашей торговой площадке для развертывания контракта на продажу, и фактически отправить это сообщение

Прежде всего, мы создадим ячейку, которая будет хранить StateInit нашего нового контракта на продажу

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const stateInit = beginCell()
      .store(storeStateInit(this.stateInit))
      .endCell();
```

Создайте ячейку с телом для нашего сообщения. Во-первых, нужно установить оп-код в 1 (чтобы указать торговой площадке, что мы хотим развернуть новый смарт-контракт для продажи). Затем нужно сохранить количество монет, которые будут отправлены в наш новый смарт-контракт продажи. И в конце нужно сохранить две ссылки: на `StateInit` нового смарт-контракта и тело, которое будет отправлено в этот новый смарт-контракт.

```ts
  const payload = beginCell();
  payload.storeUint(1, 32);
  payload.storeCoins(toNano("0.05"));
  payload.storeRef(stateInit);
  payload.storeRef(new Cell());
```

И в конце давайте отправим наше послание:

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

Отлично! Когда смарт-контракт продажи будет развернут, все, что останется, — это изменить владельца нашего NFT на адрес этого контракта продажи.

### Передача предмета

Что значит передать предмет? Просто отправить сообщение из кошелька владельца в смарт-контракт с информацией о том, кто является новым владельцем предмета.

Перейдите в файл `NftItem.ts` и создайте новый статический метод в классе `NftItem`, который будет создавать тело для такого сообщения:

Просто создайте пустую ячейку и заполните ее данными.

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

В дополнение к оп-коду, query-id и адресу нового владельца, мы также должны хранить адрес, на который нужно отправить ответ с подтверждением успешного перевода, а также оставшуюся часть входящих монет в сообщении. Необходимо указать, сколько TON перейдет новому владельцу и будет ли он получать текстовую полезную нагрузку.

```ts
  msgBody.storeAddress(params.responseTo || null);
  msgBody.storeBit(false); // no custom payload
  msgBody.storeCoins(params.forwardAmount || 0);
  msgBody.storeBit(0); // no forward_payload 

  return msgBody.endCell();
}
```

И создайте функцию перевода для передачи NFT.

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

Отлично, теперь мы уже очень близки к завершению. Вернемся к `app.ts` и давайте получим адрес нашего Nft, который мы хотим выставить на продажу:

```ts
const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
```

Создайте переменную, которая будет хранить информацию о нашей продаже.

Добавьте в начало `app.ts`:

```ts
import { GetGemsSaleData, NftSale } from "./contracts/NftSale";
```

А потом:

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

Обратите внимание, что мы установили `nftOwnerAddress` в null, потому что если бы мы это сделали, наш контракт на продажу просто принял бы наши монеты при развертывании.

Разверните нашу продажу:

```ts
const nftSaleContract = new NftSale(saleData);
seqno = await nftSaleContract.deploy(wallet);
await waitSeqno(seqno, wallet);
```

... и перенесите его!

```ts
await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
```

Теперь мы можем запустить наш проект и наслаждаться процессом!

```
yarn start
```

Зайдите на https://testnet.getgems.io/collection/{YOUR_COLLECTION_ADDRESS_HERE} и посмотрите на эту идеальную утку!

## Заключение

Сегодня ты узнал много нового о TON и даже создал свою собственную красивую NFT коллекцию в тестовой сети! Если у тебя остались вопросы или ты заметил ошибку — не стесняйся написать автору — [@coalus](https://t.me/coalus)

## Ссылки

- [GetGems NFT-контракты](https://github.com/getgems-io/nft-contracts)
- [NFT Standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)

## Об авторе

- Coalus в [Telegram](https://t.me/coalus) или [GitHub](https://github.com/coalus)

## См. также

- [Примеры использования NFT](/v3/documentation/dapps/defi/nft)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2.md
================================================
---
description: В этой статье мы создадим простого Telegram-бота для приема платежей в TON.
---

# Бот с внутренним балансом

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этой статье мы создадим простого Telegram-бота для приема платежей в TON.

## 🦄 Как это выглядит

Бот будет выглядеть следующим образом:

![image](/img/tutorials/bot1.png)

### Исходный код

Исходники доступны на GitHub:

- https://github.com/Gusarich/ton-bot-example

## 📖 Чему Вы научитесь

Вы узнаете, как:

- Создать Telegram бота в Python3 с помощью Aiogram
- Работать с базами данных SQLITE
- Работать с открытым API TON

## ✍️ Что нужно для начала работы

Установите [Python](https://www.python.org/), если вы этого еще не сделали.

Также вам понадобятся эти библиотеки PyPi:

- aiogram
- requests

Вы можете установить их одной командой в терминале.

```bash
pip install aiogram==2.21 requests
```

## 🚀 Давайте начнем!

Создайте директорию для нашего бота с четырьмя файлами в ней:

- `bot.py`- программа для запуска Telegram бота
- `config.py` - файл конфигурации
- `db.py`- модуль для взаимодействия с базой данных sqlite3
- `ton.py` - модуль для работы с платежами в TON

Директория должна выглядеть следующим образом:

```
my_bot
├── bot.py
├── config.py
├── db.py
└── ton.py
```

Теперь давайте начнем писать код!

## Конфигурация

Давайте начнем с `config.py`, потому что он самый маленький. Нам просто нужно задать в нем несколько параметров.

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

Здесь вам нужно заполнить значения в первых трех строках:

- `BOT_TOKEN` - это ваш токен Telegram бота, который вы можете получить после [создания бота] (https://t.me/BotFather).
- `DEPOSIT_ADDRESS` - это адрес кошелька вашего проекта, который будет принимать все платежи. Вы можете просто создать новый кошелек TON и скопировать его адрес.
- `API_KEY` - это ваш API-ключ от TON Center, который вы можете получить в [этом боте](https://t.me/tonapibot).

Вы также можете выбрать, будет ли ваш бот работать в тестовой или в основной сети (4-я линия).

Это все, что касается файла конфигурации, поэтому мы можем двигаться дальше!

## База данных

Теперь давайте отредактируем файл `db.py`, который будет работать с базой данных нашего бота.

Импортируйте библиотеку sqlite3.

```python
import sqlite3
```

Инициализируйте подключение к базе данных и курсор (вы можете указать любое имя файла вместо `db.sqlite`).

```python
con = sqlite3.connect('db.sqlite')
cur = con.cursor()
```

Чтобы хранить информацию о пользователях (в нашем случае их балансы), создайте таблицу "Users" со строками User ID и Balance.

```python
cur.execute('''CREATE TABLE IF NOT EXISTS Users (
                uid INTEGER,
                balance INTEGER
            )''')
con.commit()
```

Теперь нам нужно декларировать несколько функций для работы с базой данных.

Функция `add_user` будет использоваться для вставки новых пользователей в базу данных.

```python
def add_user(uid):
    # new user always has balance = 0
    cur.execute(f'INSERT INTO Users VALUES ({uid}, 0)')
    con.commit()
```

Функция `check_user` будет использоваться для проверки того, существует ли пользователь в базе данных или нет.

```python
def check_user(uid):
    cur.execute(f'SELECT * FROM Users WHERE uid = {uid}')
    user = cur.fetchone()
    if user:
        return True
    return False
```

Функция `add_balance` будет использоваться для увеличения баланса пользователя.

```python
def add_balance(uid, amount):
    cur.execute(f'UPDATE Users SET balance = balance + {amount} WHERE uid = {uid}')
    con.commit()
```

Функция `get_balance` будет использоваться для получения баланса пользователя.

```python
def get_balance(uid):
    cur.execute(f'SELECT balance FROM Users WHERE uid = {uid}')
    balance = cur.fetchone()[0]
    return balance
```

Вот и все для файла `db.py`!

Теперь мы можем использовать эти четыре функции в других компонентах бота для работы с базой данных.

## TON Center API

В файле `ton.py` мы декларируем функцию, которая будет обрабатывать все новые депозиты, увеличивать баланс пользователей и уведомлять их.

### Метод getTransactions

Мы будем использовать TON Center API. Их документация доступна здесь:
https://toncenter.com/api/v2/.

Нам нужен метод [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get), чтобы получить информацию о последних транзакциях по данному счету.

Давайте посмотрим, что этот метод принимает в качестве входных параметров и что он возвращает.

Здесь есть только одно обязательное поле ввода `address`, но нам также нужно поле `limit`, чтобы указать, сколько транзакций мы хотим получить в ответ.

Теперь давайте попробуем запустить этот метод на сайте [TON Center](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) с любым существующим адресом кошелька, чтобы понять, что мы должны получить на выходе.

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

Итак, когда все в порядке, в поле `ok` устанавливается значение `true` и мы получаем массив `result` со списком последних транзакций `limit`. Теперь давайте рассмотрим одну единственную транзакцию:

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

Мы видим, что информация, которая может помочь нам точно идентифицировать транзакцию, хранится в поле `transaction_id`. Нам нужно поле `lt` из него, чтобы понять, какая транзакция произошла раньше, а какая позже.

Информация о передаче монеты находится в поле `in_msg`. Нам понадобятся `value` и `message` из него.

Теперь мы готовы создать обработчик платежей.

### Отправка API-запросов из кода

Давайте начнем с импорта необходимых библиотек и двух наших предыдущих файлов: `config.py` и `db.py`.

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

Давайте подумаем, как может быть реализована обработка платежей.

Мы можем вызывать API каждые несколько секунд и проверять, есть ли новые транзакции по адресу нашего кошелька.

Для этого нам нужно знать, какой была последняя обработанная транзакция. Самым простым подходом было бы просто сохранить информацию об этой транзакции в каком-нибудь файле и обновлять ее каждый раз, когда мы обрабатываем новую транзакцию.

Какую информацию о транзакции мы будем хранить в файле? На самом деле, нам нужно хранить только значение `lt` - logical time (логическое время).
С помощью этого значения мы сможем понять, какие транзакции нам нужно обработать.

Поэтому нам нужно определить новую асинхронную функцию; назовем ее `start`. Почему эта функция должна быть асинхронной? Потому что библиотека Aiogram для ботов Telegram также является асинхронной, и в дальнейшем с асинхронными функциями будет проще работать.

Вот как должна выглядеть наша функция `start`:

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

Теперь давайте напишем тело цикла while. Нам нужно вызывать TON Center API каждые несколько секунд.

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

После вызова `requests.get` у нас есть переменная `resp`, которая содержит ответ от API. `resp` - это объект, а `resp['result']` - список с последними 100 транзакциями для нашего адреса.

Теперь давайте просто пройдемся итерацией по этим транзакциям и найдем новые.

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

Как нам обработать новую транзакцию? Нам необходимо:

- понять, какой пользователь отправил его
- увеличить баланс этого пользователя
- уведомить пользователя о его депозите

Вот код, который все это сделает:

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

Давайте посмотрим на него и разберемся, что он делает.

Вся информация о передаче монеты находится в `tx['in_msg']`. Нам нужны только поля 'value' и 'message'.

Прежде всего, мы проверяем, больше ли значение нуля, и продолжаем только в том случае, если это так.

Затем мы ожидаем, что при передаче комментарий ( `tx['in_msg']['message']`) будет иметь идентификатор пользователя от нашего бота, поэтому мы проверяем, является ли он действительным номером и существует ли этот UID в нашей базе данных.

После этих простых проверок у нас есть переменная `value` с суммой депозита и переменная `uid` с идентификатором пользователя, который сделал этот депозит. Таким образом, мы можем просто добавить средства на его счет и отправить уведомление.

Также обратите внимание, что по умолчанию значение указано в нанотонах, поэтому нам нужно разделить его на 1 миллиард. Мы делаем это в соответствии с уведомлением:
`{value / 1e9:.2f}`
Здесь мы делим значение на `1e9` (1 миллиард) и оставляем только две цифры после запятой, чтобы показать его пользователю в удобном формате.

Отлично! Теперь программа может обрабатывать новые транзакции и уведомлять пользователей о депозитах. Но мы не должны забывать о сохранении `lt`, которое мы использовали ранее. Мы должны обновить последнее `lt`, потому что была обработана более новая транзакция.

Все просто:

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

И это все для файла `ton.py`!
Теперь наш бот готов на 3/4. Нам осталось только создать пользовательский интерфейс с несколькими кнопками в самом боте.

## Telegram бот

### Инициализация

Откройте файл `bot.py` и импортируйте все необходимые модули.

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

Давайте настроим ведение журнала в нашей программе, чтобы мы могли видеть, что происходит позже, для отладки.

```python
logging.basicConfig(level=logging.INFO)
```

Теперь нам нужно инициализировать bot object и dispatcher с помощью Aiogram.

```python
bot = Bot(token=config.BOT_TOKEN)
dp = Dispatcher(bot)
```

Здесь мы используем `BOT_TOKEN` из нашего файла конфигурации, который мы сделали в начале урока.

Мы инициализировали бота, но он все еще пуст. Мы должны добавить несколько функций для взаимодействия с пользователем.

### Обработчики сообщений

#### Команда /start

Начнем с обработчика команд `/start` и `/help`. Эта функция будет вызываться, когда пользователь запускает бота в первый раз, перезапускает его или использует команду `/help`.

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

Приветственное сообщение может быть любым, каким вы захотите. Кнопки клавиатуры могут быть любыми, но в данном примере они обозначены наиболее понятным для нашего бота образом: `Deposit` и `Balance`.

#### Кнопка баланса

Теперь пользователь может запустить бота и увидеть клавиатуру с двумя кнопками. Но после вызова одной из них пользователь не получит никакого ответа, потому что мы не создали для нее никакой функции.

Поэтому давайте добавим функцию запроса баланса.

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

Все довольно просто. Мы просто получаем баланс из базы данных и отправляем сообщение пользователю.

#### Кнопка Deposit

А как насчет второй кнопки `Deposit`? Вот функция для нее:

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

То, что мы делаем здесь, также легко понять.

Помните, как в файле `ton.py` мы определяли, какой пользователь сделал депозит, по комментарию с его UID? Теперь здесь, в боте, нам нужно попросить пользователя отправить транзакцию с комментарием, содержащим его UID.

### Запуск бота

Единственное, что нам теперь нужно сделать в `bot.py`, это запустить самого бота, а также выполнить функцию `start` из `ton.py`.

```python
if __name__ == '__main__':
    # Create Aiogram executor for our bot
    ex = executor.Executor(dp)

    # Launch the deposit waiter with our executor
    ex.loop.create_task(ton.start())

    # Launch the bot
    ex.start_polling()
```

На данный момент мы написали весь необходимый код для нашего бота. Если вы все сделали правильно, он должен работать, когда вы запустите его с помощью команды `python my-bot/bot.py` в терминале.

Если ваш бот работает некорректно, сравните свой код с кодом [из этого репозитория](https://github.com/Gusarich/ton-bot-example).

## Ссылки

- Сделано для TON как часть [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)
- By Gusarich ([Telegram @Gusarich](https://t.me/Gusarich), [Gusarich on GitHub](https://github.com/Gusarich))



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js.md
================================================
---
description: По итогу урока вы напишете красивого бота, который сможет принимать платежи за ваш товар прямо в TON.
---

# Бот для продажи пельменей

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этой статье мы создадим простого Telegram-бота для приема платежей в TON.

## 🦄 Как это выглядит

По окончанию урока вы напишете красивого бота, который сможет принимать платежи за ваш товар прямо в TON.

Бот будет выглядеть следующим образом:

![предварительный просмотр бота](/img/tutorials/js-bot-preview.jpg)

## 📖 Чему вы научитесь

Вы узнаете, как:

- Создать Telegram-бота в NodeJS с помощью grammY
- Работать с открытым TON Center API

> Почему мы используем grammY?
> Потому что grammY - это современный, молодой, высокоуровневый фреймворк для удобной и быстрой разработки Telegram-ботов на JS/TS/Deno. Кроме того, у grammY отличная [документация] (https://grammy.dev) и активное сообщество, которое всегда сможет вам помочь.

## ✍️ Что нужно для начала работы

Установите [NodeJS](https://nodejs.org/en/download/), если вы этого еще не сделали.

Также вам понадобятся эти библиотеки:

- grammy
- ton
- dotenv

Вы можете установить их одной командой в терминале.

```bash npm2yarn
npm install ton dotenv grammy @grammyjs/conversations
```

## 🚀 Давайте начнем!

Структура нашего проекта будет выглядеть следующим образом:

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

- `bot/start.js` и `bot/payment.js` - файлы с обработчиками для Telegram-бота
- `src/ton.js` - файл с business logic, связанной с TON
- `app.js` - файл для инициализации и запуска бота

Теперь давайте начнем писать код!

## Конфигурация

Давайте начнем с `.env`. Нам просто нужно задать в нем несколько параметров.

**.env**

```
BOT_TOKEN=
TONCENTER_TOKEN=
NETWORK=
OWNER_WALLET= 
```

Здесь вам нужно заполнить значения в первых четырех строках:

- `BOT_TOKEN` - это ваш токен Telegram-бота, который вы можете получить после [создания бота] (https://t.me/BotFather).
- `OWNER_WALLET` - это адрес кошелька вашего проекта, который будет принимать все платежи. Вы можете просто создать новый кошелек TON и скопировать его адрес.
- `API_KEY` - это ваш API-ключ от TON Center, который вы можете получить от [@tonapibot](https://t.me/tonapibot)/[@tontestnetapibot](https://t.me/tontestnetapibot) для основной и тестовой сетей, соответственно.
- `NETWORK` - это информация о том, в какой сети будет работать ваш бот - тестовой или основной.

Это все, что касается файла конфигурации, так что мы можем двигаться дальше!

## TON Center API

В файле `src/services/ton.py` мы будем декларировать функции для проверки существования транзакции и генерирования ссылок для быстрого перехода к приложению кошелька для оплаты

### Получение последних транзакций по кошельку

Наша задача - проверить доступность нужной нам транзакции с определенного кошелька.

Мы решим эту задачу следующим образом:

1. Мы получим последние транзакции, поступившие на наш кошелек. Почему именно на наш? В этом случае нам не нужно беспокоиться об адресе кошелька пользователя, нам не нужно подтверждать, что это его кошелек, нам не нужно нигде хранить этот кошелек где-либо.
2. Отсортируйте и оставьте только входящие транзакции
3. Давайте пройдемся по всем транзакциям, и каждый раз будем проверять, равны ли комментарий и сумма тем данным, которые у нас есть
4. Празднуем решение нашей проблемы🎉

#### Получение последних транзакций

Если мы используем TON Center API, то мы можем обратиться к их [документации](https://toncenter.com/api/v2/) и найти метод, который идеально решает нашу проблему - [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get).

Для получения транзакций нам достаточно одного параметра - адреса кошелька для приема платежей, но мы также будем использовать параметр limit, чтобы ограничить выдачу транзакций до 100 штук.

Давайте попробуем вызвать тестовый запрос для адреса `EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N` (кстати, это адрес TON Foundation)

```bash
curl -X 'GET' \
  'https://toncenter.com/api/v2/getTransactions?address=EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N&limit=100' \
  -H 'accept: application/json'
```

Отлично, теперь у нас есть список транзакций в ["result"], теперь давайте рассмотрим подробнее 1 транзакцию

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

Из этого json-файла мы можем понять некоторую информацию, которая может быть нам полезна:

- Это входящая транзакция, поскольку поле "out_msgs" пустое.
- Мы также можем получить комментарий к транзакции, ее отправителю и сумме транзакции.

Теперь мы готовы создать средство проверки транзакций

### Работа с TON

Давайте начнем с импорта необходимой библиотеки TON

```js
import { HttpApi, fromNano, toNano } from "ton";
```

Давайте подумаем, как проверить, отправил ли пользователь нужную нам транзакцию.

Все элементарно просто. Мы можем просто отсортировать только входящие транзакции в наш кошелек, а затем просмотреть последние 100 транзакций, и если найдется транзакция с таким же комментарием и суммой, значит, мы нашли нужную нам транзакцию!

Давайте начнем с инициализации http-клиента, для удобства работы с TON

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

Здесь мы просто генерируем url конечной точки в зависимости от того, какая сеть выбрана в конфигурации. После этого мы инициализируем http-клиент.

Итак, теперь мы можем получить последние 100 транзакций из кошелька владельца

```js
const transactions = await httpClient.getTransactions(toWallet, {
    limit: 100,
  });
```

и отфильтруйте, оставив только входящие транзакции (если out_msgs транзакции пуст, мы оставляем его)

```js
let incomingTransactions = transactions.filter(
    (tx) => Object.keys(tx.out_msgs).length === 0
  );
```

Теперь нам остается пройтись по всем транзакциям, и если комментарий и значение транзакции совпадают, мы вернем true

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

Обратите внимание, что по умолчанию значение дается в нанотонах, поэтому нам нужно разделить его на 1 миллиард, или же мы можем просто использовать метод `fromNano` из библиотеки TON.
Вот и все для функции `verifyTransactionExistance`!

Теперь мы можем создать функцию для генерации ссылки для быстрого перехода к приложению кошелька для оплаты

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

Все, что нам нужно - это просто подставить параметры транзакции в URL. Не забыв при этом передать значение транзакции в nano.

## Telegram-бот

### Инициализация

Откройте файл `app.js` и импортируйте все необходимые нам обработчики и модули.

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

Давайте настроим модуль dotenv для удобной работы с переменными окружения, которые мы задали в файле .env

```js
dotenv.config();
```

После этого мы создаем функцию, которая будет запускать наш проект. Чтобы наш бот не останавливался при возникновении ошибок, мы добавляем следующий код

```js
async function runApp() {
  console.log("Starting app...");

  // Handler of all errors, in order to prevent the bot from stopping
  process.on("uncaughtException", function (exception) {
    console.log(exception);
  });
```

Теперь инициализируйте бота и необходимые плагины

```js
  // Initialize the bot
  const bot = new Bot(process.env.BOT_TOKEN);

  // Set the initial data of our session
  bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
  // Install the conversation plugin
  bot.use(conversations());

  bot.use(createConversation(startPaymentProcess));
```

Здесь мы используем `BOT_TOKEN` из нашего файла конфигурации, который мы сделали в начале урока.

Мы инициализировали бота, но он все еще пуст. Мы должны добавить несколько функций для взаимодействия с пользователем.

```js
  // Register all handelrs
  bot.command("start", handleStart);
  bot.callbackQuery("buy", async (ctx) => {
    await ctx.conversation.enter("startPaymentProcess");
  });
  bot.callbackQuery("check_transaction", checkTransaction);
```

В ответ на команду /start, будет выполнена функция handleStart. Если пользователь нажмет на кнопку с параметром callback_data, равным "buy", мы начнем наш "conversation", который мы зарегистрировали чуть выше. А когда мы нажмем на кнопку с callback_data, равным "check_transaction", мы выполним функцию checkTransaction.

И все, что нам остается, это запустить нашего бота и вывести журнал об успешном запуске

```js
  // Start bot
  await bot.init();
  bot.start();
  console.info(`Bot @${bot.botInfo.username} is up and running`);
```

### Обработчики сообщений

#### Команда /start

Давайте начнем с обработчика команды `/start`. Эта функция будет вызвана, когда пользователь запустит бота в первый раз или перезапустит его

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

Здесь мы сначала импортируем InlineKeyboard из модуля grammy. После этого мы создаем инлайн-клавиатуру в обработчике с предложением купить пельмени и ссылкой на эту статью (здесь немного рекурсии😁).
.row() - означает перенос следующей кнопки на новую строку.
После этого мы отправляем приветственное сообщение с текстом (важно - я использую html-разметку в сообщении, чтобы украсить его) вместе с созданной клавиатурой.
Приветственное сообщение может быть любым, каким вы захотите.

#### Процесс оплаты

Как обычно, мы начнем наш файл с необходимых импортов

```js
import { InlineKeyboard } from "grammy";

import {
  generatePaymentLink,
  verifyTransactionExistance,
} from "../../services/ton.js";
```

После этого мы создадим обработчик startPaymentProcess, который мы уже зарегистрировали в app.js для выполнения при нажатии определенной кнопки

В Telegram при нажатии на инлайн-кнопку появляются крутящиеся часы, чтобы убрать их, мы ответ на callback-запрос

```js
  await ctx.answerCallbackQuery();
```

После этого нам нужно отправить пользователю картинку с пельменями, попросить его отправить количество пельменей, которые он хочет купить. И дождаться, пока он введет число.

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

Теперь мы подсчитаем общую сумму заказа и сгенерируем случайную строку, которую мы будем использовать для комментирования транзакции и добавления постфикса пельменей

```js
  // Get the total cost: multiply the number of portions by the price of the 1 portion
  const amount = count * 3;
  // Generate random comment
  const comment = Math.random().toString(36).substring(2, 8) + "dumplings";
```

И сохраняем полученные данные в сессии, чтобы потом получить их в следующем обработчике.

```js
  conversation.session.amount = amount;
  conversation.session.comment = comment;
```

Генерируем ссылки для перехода к быстрой оплате и создаем инлайн-клавиатуру

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

И отправляем наше сообщение с клавиатуры, где мы просим пользователя отправить транзакцию на адрес нашего кошелька со случайно сгенерированным комментарием

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

Теперь нам осталось создать обработчик, который будет проверять наличие транзакции

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

Все, что здесь нужно сделать, это просто проверить наличие транзакции, и если она существует, мы сообщаем об этом пользователю и сбрасываем данные в сессии

### Запуск бота

Для запуска используйте эту команду:

```bash npm2yarn
npm run app
```

Если ваш бот работает некорректно, сравните свой код с кодом [из этого репозитория](https://github.com/coalus/DumplingShopBot). Если это не помогло, не стесняйтесь написать мне в Telegram. Мой аккаунт в Telegram вы можете найти ниже

## Ссылки

- Сделано для TON как часть [ton-footsteps/58] (https://github.com/ton-society/ton-footsteps/issues/58)
- By Coalus ([Telegram @coalus](https://t.me/coalus), [Coalus на GitHub](https://github.com/coalus))
- [Источники ботов](https://github.com/coalus/DumplingShopBot)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot.md
================================================
---
description: В этой статье мы расскажем о том, как принимать платежи в боте Telegram.
---

# Бот-витрина магазина с оплатой в TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этой статье мы расскажем о том, как принимать платежи в боте Telegram.

## 📖 Чему вы научитесь

В этой статье вы узнаете, как:

- создать Telegram-бота с помощью Python + Aiogram
- работать с публичным API TON (TON Center)
- работать с базой данных SQlite

И наконец: как принимать платежи в Telegram-боте, используя знания из предыдущих шагов.

## 📚 Прежде чем мы начнем

Убедитесь, что у вас установлена последняя версия Python и установлены следующие пакеты:

- aiogram
- requests
- sqlite3

## 🚀 Давайте начнем!

Мы будем действовать по нижеприведенному порядку:

1. Работа с базой данных SQlite
2. Работа с публичным API TON (TON Center)
3. Создание Telegram-бота с помощью Python + Aiogram
4. Получаем прибыль!

Давайте создадим следующие четыре файла в директории нашего проекта:

```
telegram-bot
├── config.json
├── main.py
├── api.py
└── db.py
```

## Конфигурация

В `config.json` мы сохраним токен нашего бота и наш публичный ключ TON API.

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

В `config.json` мы решаем, какую сеть мы будем использовать: `testnet` или `mainnet`.

## База данных

### Создаем базу данных

В этом примере используется локальная база данных Sqlite.

Создайте `db.py`.

Чтобы начать работу с базой данных, нам нужно импортировать модуль sqlite3
и несколько модулей для работы со временем.

```python
import sqlite3
import datetime
import pytz
```

- `Sqlite3`-модуль для работы с базой данных sqlite
- `datetime` - модуль для работы со временем
- `pytz`- модуль для работы с часовыми поясами

Далее нам нужно создать соединение с базой данных и курсор для работы с ней:

```python
locCon = sqlite3.connect('local.db', check_same_thread=False)
cur = locCon.cursor()
```

Если база данных не существует, она будет создана автоматически.

Теперь мы можем создать таблицы. У нас их две.

#### Транзакции:

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

- `source` - адрес кошелька плательщика
- `hash`- хэш транзакции
- `value`- значение транзакции
- `comment`- комментарий к транзакции

#### Пользователи:

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

- `id` - ID пользователя Telegram
- `username` - имя пользователя Telegram
- `first_name` - имя пользователя Telegram
- `wallet`- адрес кошелька пользователя

В таблице `users` мы храним пользователей :) их Telegram ID, @логин,
имя и кошелек. Кошелек добавляется в базу данных при первом
успешном платеже.

В таблице `transactions` хранятся проверенные транзакции.
Чтобы проверить транзакцию, нам нужны хеш, источник, значение и комментарий.

Чтобы создать эти таблицы, нам нужно выполнить следующую функцию:

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

Этот код создаст таблицы, если они еще не созданы.

### Работа с базой данных

Давайте проанализируем ситуацию.
Пользователь совершил транзакцию. Как ее подтвердить? Как сделать так, чтобы одна и та же транзакция не была подтверждена дважды?

В транзакциях есть body_hash, с помощью которого мы можем легко понять, есть ли транзакция в базе данных или нет.

Мы добавляем транзакции в базу данных, в которых мы уверены. Функция `check_transaction` проверяет, есть ли найденная транзакция в базе данных или нет.

`add_v_transaction` добавляет транзакцию в таблицу транзакций.

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

`check_user` проверяет, есть ли пользователь в базе данных, и добавляет его, если нет.

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

Пользователь может сохранить кошелек в таблице. Он добавляется при первой успешной покупке. Функция `v_wallet` проверяет, есть ли у пользователя связанный с ним кошелек. Если есть, то возвращает его. Если нет, то добавляет.

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

`get_user_wallet` просто возвращает кошелек пользователя.

```python
def get_user_wallet(user_id):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    return result[0]
```

`get_user_payments` возвращает список платежей пользователя.
Эта функция проверяет, есть ли у пользователя кошелек. Если есть, то она возвращает список платежей.

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

*У нас есть возможность взаимодействовать с блокчейном, используя сторонние API, предоставляемые некоторыми участниками сети. С помощью этих сервисов разработчики могут пропустить этап запуска собственного узла и настройки API.*

### Необходимые запросы

Фактически, что нам нужно, чтобы подтвердить, что пользователь перевел нам требуемую сумму?

Нам просто нужно просмотреть последние входящие переводы на наш кошелек и найти среди них транзакцию с нужного адреса с нужной суммой (и, возможно, уникальным комментарием).
Для всего этого в TON Center есть метод `getTransactions`.

### getTransactions

По умолчанию, если мы применим эту функцию, мы получим 10 последних транзакций. Однако мы также можем указать, что нам нужно больше, но это несколько увеличит время ответа. И, скорее всего, вам не нужно так много.

Если вам нужно больше, то у каждой транзакции есть `lt` и `hash`. Вы можете просмотреть, например, 30 транзакций, и если среди них не найдется нужной, то взять `lt` и `hash` из последней и добавить их в запрос.

Таким образом, вы получаете следующие 30 транзакций и так далее.

Например, в тестовой сети есть кошелек `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5`, в нем есть несколько транзакций:

Используя запрос, мы получим ответ, содержащий две транзакции (часть информации, которая сейчас не нужна, была скрыта, полный ответ вы можете увидеть по ссылке выше).

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

Мы получили две последние транзакции с этого адреса. Добавив в запрос `lt` и `hash`, мы снова получим две транзакции. Однако вторая станет следующей в ряду. То есть, мы получим вторую и третью транзакции для этого адреса.

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

Запрос будет выглядеть [вот так](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5\&limit=2\&lt=1943166000003\&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D\&to_lt=0\&archival=true)

Нам также понадобится метод `detectAddress`.

Вот пример адреса кошелька Tonkeeper в тестовой сети: `kQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aCTb`. Если мы поищем транзакцию в проводнике, то вместо указанного выше адреса будет: `EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R`.

Этот метод возвращает нам "правильный" адрес.

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

Нам нужен `b64url`.

Этот метод позволяет нам подтвердить адрес пользователя.

По большей части, это все, что нам нужно.

### Запросы API и что с ними делать

Давайте вернемся в IDE. Создайте файл `api.py`.

Импортируйте необходимые библиотеки.

```python
import requests
import json
# We import our db module, as it will be convenient to add from here
# transactions to the database
import db
```

- `requests` - для выполнения запросов API
- `json` для работы с json
- `db` - для работы с нашей базой данных sqlite

Давайте создадим две переменные для хранения начала запросов.

```python
# This is the beginning of our requests
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"
```

Получите все API-токены и кошельки из файла config.json.

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

В зависимости от сети, мы берем необходимые данные.

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

Наша первая функция запроса `detectAddress`.

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

На входе мы имеем предполагаемый адрес, а на выходе - либо "correct" адрес, необходимый нам для дальнейшей работы, либо False.

Вы можете заметить, что в конце запроса появился API-ключ. Он нужен для того, чтобы снять ограничение на количество запросов к API. Без него мы ограничены одним запросом в секунду.

Вот следующая функция для `getTransactions`:

```python
def get_address_transactions():
    url = f"{API_BASE}getTransactions?address={WALLET}&limit=30&archival=true&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    return response['result']
```

Эта функция возвращает последние 30 транзакций в наш `WALLET`.

Здесь вы можете увидеть `archival=true`. Это необходимо для того, чтобы мы принимали транзакции только от узла с полной историей блокчейна.

На выходе мы получим список транзакций -[{0},{1},...,{29}]. Другими словами, список словарей.

И, наконец, последняя функция:

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

На вход подаются "correct" адрес кошелька, сумма и комментарий. Если предполагаемая входящая транзакция найдена, результатом будет True; в противном случае - False.

## Telegram-бот

Во-первых, давайте создадим основу для бота.

### Импорт

В этой части мы импортируем необходимые библиотеки.

Из `aiogram` нам нужны `Bot`, `Dispatcher`, `types` и `executor`.

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage` необходима для временного хранения информации.

`FSMContext`, `State` и `StatesGroup` необходимы для работы с машиной состояний.

```python
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
```

`json` необходим для работы с json-файлами. `logging` необходим для регистрации ошибок.

```python
import json
import logging
```

`api` и `db` - это наши собственные файлы, которые мы заполним позже.

```python
import db
import api
```

### Настройка конфигурации

Для удобства рекомендуется хранить такие данные, как `BOT_TOKEN` и ваши кошельки для получения платежей, в отдельном файле под названием `config.json`.

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

#### Токен бота

`BOT_TOKEN` - это токен вашего Telegram-бота от [@BotFather](https://t.me/BotFather)

#### Режим работы

В ключе `WORK_MODE` мы определим режим работы бота - тестовая или основная сеть; `testnet` или `mainnet` соответственно.

#### API-токены

API-токены для `*_API_TOKEN` можно получить в ботах [TON Center](https://toncenter.com/):

- для mainnet - [@tonapibot](https://t.me/tonapibot)
- для testnet - [@tontestnetapibot](https://t.me/tontestnetapibot)

#### Подключите конфигурацию к боту

Далее мы закончим настройку бота.

Получите токен для работы бота из `config.json` :

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

### Ведение журнала и настройка бота

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
```

### Состояния

Нам нужны состояния, чтобы разделить рабочий процесс бота на этапы. Мы можем специализировать каждый этап для выполнения определенной задачи.

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

Подробности и примеры смотрите в [документации по Aiogram](https://docs.aiogram.dev/en/latest/).

### Хендлеры сообщений

В этой части мы напишем логику взаимодействия с ботом.

Мы будем использовать два типа хендлеров:

- `message_handler` используется для обработки сообщений от пользователя.
- `callback_query_handler` используется для обработки callback от инлайн-клавиатур.

Если мы хотим обработать сообщение от пользователя, мы будем использовать `message_handler`, поместив декоратор `@dp.message_handler` над функцией. В этом случае функция будет вызываться, когда пользователь отправляет сообщение боту.

В декораторе мы можем указать условия, при которых будет вызываться функция. Например, если мы хотим, чтобы функция вызывалась только тогда, когда пользователь отправляет сообщение с текстом `/start`, то мы напишем следующее:

```
@dp.message_handler(commands=['start'])
```

Хендлеры должны быть назначены на асинхронную функцию. В этом случае мы используем синтаксис `async def`. Синтаксис `async def` используется для определения функции, которая будет вызываться асинхронно.

#### /start

Давайте начнем с хендлера команды `/start`.

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

В декораторе этого хендлера мы видим `state='*'`. Это означает, что данный хендлер будет вызван независимо от состояния бота. Если мы хотим, чтобы хендлер вызывался только тогда, когда бот находится в определенном состоянии, мы напишем `state=DataInput.firstState`. В этом случае хендлер будет вызван только тогда, когда бот будет находиться в состоянии `firstState`.

После того, как пользователь отправит команду `/start`, бот проверит, есть ли пользователь в базе данных, используя функцию `db.check_user`. Если нет, он добавит его. Эта функция также вернет значение bool, и мы можем использовать его для другого обращения к пользователю. После этого бот установит состояние `firstState`.

#### /cancel

Далее следует хендлер команды /cancel. Он необходим для возвращения в состояние `firstState`.

```python
@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("Canceled")
    await message.answer("/start to restart")
    await DataInput.firstState.set()
```

#### /buy

И, конечно же, хендлер команды `/buy`. В этом примере мы будем продавать разные виды воздуха. Для выбора типа воздуха мы будем использовать reply клавиатуру.

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

Таким образом, когда пользователь отправляет команду `/buy`, бот отправляет ему клавиатуру с вариантами типов воздуха. После того как пользователь выберет тип воздуха, бот установит состояние `secondState`.

Этот хендлер будет работать только тогда, когда установлено значение `secondState`, и будет ожидать сообщения от пользователя с типом воздуха.  В данном случае нам нужно сохранить тип воздуха, который выбрал пользователь, поэтому мы передаем FSMContext в качестве аргумента функции.

FSMContext используется для хранения данных в памяти бота. Мы можем хранить в ней любые данные, но эта память не является постоянной, поэтому если бот будет перезапущен, данные будут потеряны. Но в ней хорошо хранить временные данные.

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

Используйте...

```python
await state.update_data(air_type="Just pure 🌫")
```

...чтобы сохранить тип воздуха в FSMContext. После этого мы устанавливаем состояние в `WalletState` и просим пользователя отправить адрес своего кошелька.

Этот хендлер будет работать только тогда, когда `WalletState` установлен и будет ожидать сообщения от пользователя с адресом кошелька.

Следующий хендлер кажется очень сложным, но это не так. Сначала мы проверяем, является ли сообщение действительным адресом кошелька, используя `len(message.text) == 48`, поскольку адрес кошелька состоит из 48 символов. После этого мы используем функцию `api.detect_address`, чтобы проверить, является ли адрес действительным. Как вы помните из части, посвященной API, эта функция также возвращает "Correct" адрес, который будет сохранен в базе данных.

После этого мы получаем тип воздуха из FSMContext с помощью `await state.get_data()` и сохраняем его в переменной `user_data`.

Теперь у нас есть все данные, необходимые для процесса оплаты. Осталось только сгенерировать ссылку на оплату и отправить ее пользователю. Давайте воспользуемся инлайн-клавиатурой.

В этом примере для оплаты будут созданы три кнопки:

- для официального Кошелька TON
- для Tonhub
- для Tonkeeper

Преимущество специальных кнопок для кошельков заключается в том, что если у пользователя еще нет кошелька, то сайт предложит ему установить его.

Вы можете использовать все, что захотите.

Нам нужна кнопка, которую пользователь нажмет после транзакции, чтобы мы могли проверить, успешно ли прошла оплата.

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

Последний хендлер сообщений, который нам нужен, предназначен для команды `/me`. Он показывает платежи пользователя.

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

### Хендлеры Callback

Мы можем установить callback-данные в кнопках, которые будут отправляться боту при нажатии пользователем на кнопку. В кнопке, которую пользователь нажмет после транзакции, мы установим callback data на "check". В результате нам нужно обработать этот callback.

Callback-хендлеры очень похожи на хендлеры сообщений, но вместо `message` в качестве аргумента у них используется `types.CallbackQuery`. Декоратор функции также отличается.

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

В этом хендлере мы получаем данные пользователя из FSMContext и используем функцию `api.find_transaction`, чтобы проверить была ли транзакция успешной. Если да, то мы сохраняем адрес кошелька в базе данных и отправляем пользователю уведомление. После этого пользователь может найти свои транзакции с помощью команды `/me`.

### Последняя часть main.py

В конце не забудьте:

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

Эта часть необходима для запуска бота.
В `skip_updates=True` мы указываем, что не хотим обрабатывать старые сообщения. Но если вы хотите обрабатывать все сообщения, вы можете установить значение `False`.

:::info

Весь код `main.py` можно найти [здесь](https://github.com/LevZed/ton-payments-in-telegram-bot/blob/main/bot/main.py).

:::

## Бот запущен

Мы наконец-то сделали это! Теперь у вас должен быть работающий бот. Вы можете протестировать его!

Шаги для запуска бота:

1. Заполните файл `config.json`.
2. Запустите `main.py`.

Все файлы должны находиться в одной папке. Чтобы запустить бота, вам нужно запустить файл `main.py`. Вы можете сделать это в IDE или в терминале следующим образом:

```
python main.py
```

Если у вас возникли ошибки, вы можете проверить их в терминале. Возможно, вы что-то упустили в коде.

Пример работающего бота [@AirDealerBot](https://t.me/AirDealerBot)

![bot](/img/tutorials/apiatb-bot.png)

## Ссылки

- Сделано для TON как часть [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)
- By Lev ([Telegram @Revuza](https://t.me/revuza), [LevZed на GitHub](https://github.com/LevZed))



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/web3-game-example.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/web3-game-example.md
================================================
# Блокчейн TON для игр

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Содержание

В этом уроке мы рассмотрим, как добавить блокчейн TON в игру. Для нашего примера мы будем использовать клон Flappy Bird, написанный на Phaser, и шаг за шагом добавлять функции GameFi. В учебнике мы будем использовать короткие фрагменты кода и псевдокод, чтобы было понятнее. Кроме того, мы будем давать ссылки на реальные блоки кода, чтобы помочь Вам лучше понять. Всю реализацию можно найти в [демо-репо](https://github.com/ton-community/flappy-bird).

![Игра Flappy Bird без функций GameFi](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

Мы собираемся реализовать следующее:

- Достижения. Давайте наградим наших пользователей [SBT](/v3/concepts/glossary#sbt). Система достижений - это отличный инструмент для повышения вовлеченности пользователей.
- Игровая валюта. В блокчейне TON легко запустить свой собственный токен (жетон). Этот токен можно использовать для создания внутриигровой экономики. Наши пользователи смогут зарабатывать игровые монеты, чтобы потом тратить их.
- Игровой магазин. Мы предоставим пользователям возможность приобретать внутриигровые предметы, используя либо внутриигровую валюту, либо сами монеты TON.

## Подготовка

### Установите GameFi SDK

Сначала мы настроим игровое окружение. Для этого нам нужно установить `assets-sdk`. Этот пакет предназначен для подготовки всего, что нужно разработчикам для интеграции блокчейна в игры. lib можно использовать из CLI или из скриптов Node.js. В этом уроке мы будем придерживаться подхода CLI.

```sh
npm install -g @ton-community/assets-sdk@beta
```

### Создайте главный кошелек

Далее нам нужно создать главный кошелек. Главный кошелек - это кошелек, который мы будем использовать для чеканки жетона, коллекций, NFT, SBT и получения платежей.

```sh
assets-cli setup-env
```

Вам будет задано несколько вопросов:

| Поле      | Подсказка                                                                                                                                                                                                                                                                                                                                                 |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Сеть      | Выберите `testnet`, пока это тестовая игра.                                                                                                                                                                                                                                                                                               |
| Тип       | Выберите кошелек типа `highload-v2`, поскольку это самый лучший и производительный вариант для использования в качестве главного кошелька.                                                                                                                                                                                                |
| Хранение  | Хранилище будет использоваться для хранения файлов `NFT`/`SBT`. `Amazon S3` (централизованное) или `Pinata` (децентрализованное).  В данном руководстве мы будем использовать `Pinata`, поскольку децентрализованное хранилище будет более наглядным для Web3 игры. |
| Шлюз IPFS | Сервис откуда будут загружаться метаданные активов: `pinata`, `ipfs.io` или введите URL другого сервиса.                                                                                                                                                                                                                  |

Скрипт выводит ссылку, которую Вы можете открыть, чтобы посмотреть состояние созданного кошелька.

![Новый кошелек в статусе Nonexist](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

Как Вы можете заметить, кошелек еще не создан. Чтобы кошелек был действительно создан, нам нужно внести в него средства. В реальном сценарии Вы можете пополнить кошелек любым удобным для Вас способом, используя адрес кошелька. В нашем случае мы будем использовать [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Пожалуйста, откройте его, чтобы получить 5 тестовых монет TON.

Немного позже Вы сможете увидеть 5 TON на кошельке, а его статус станет `Uninit`. Кошелек готов. После первого использования он изменит статус на `Active`.

![Состояние кошелька после пополнения](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### Чеканьте внутриигровую валюту

Мы собираемся создать внутриигровую валюту, чтобы вознаграждать ею пользователей:

```sh
assets-cli deploy-jetton
```

Вам будет задано несколько вопросов:

| Поле             | Подсказка                                                                                                                                                                                                                                                                                |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя              | Имя токена. Например, `Flappy Jetton`.                                                                                                                                                                                                                   |
| Описание         | Например, описание токена: Яркий цифровой токен из вселенной Flappy Bird.                                                                                                                                                                                |
| Изображение      | Загрузите подготовленный [логотип жетона](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) и укажите путь к файлу. Конечно, Вы можете использовать любое изображение. |
| Символ           | `FLAP` или введите любую аббревиатуру, которую Вы хотите использовать.                                                                                                                                                                                                   |
| Десятичные числа | Сколько нулей после точки будет у Вашей валюты. Пусть в нашем случае это будет `0`.                                                                                                                                                                      |

Скрипт выводит ссылку, которую Вы можете открыть, чтобы увидеть состояние созданного жетона. Он будет иметь статус `Active`. Состояние кошелька изменит статус с `Uninit` на `Active`.

![Внутриигровая валюта / жетон](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### Создание коллекций для SBT

Для примера, в демо-игре мы будем награждать пользователей за первую и пятую игру. Таким образом, мы создадим две коллекции, чтобы помещать в них SBT, когда пользователи достигнут соответствующих условий - сыграют первый и пятый раз:

```sh
assets-cli deploy-nft-collection
```

| Поле        | Первая игра                                                                                                                                       | Пятая игра                                                                                                                                        |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| Тип         | `sbt`                                                                                                                                             | `sbt`                                                                                                                                             |
| Имя         | Flappy First Flight                                                                                                                               | Flappy High Fiver                                                                                                                                 |
| Описание    | Отпразднуйте свое первое путешествие в игре Flappy Bird!                                                                                          | Отметьте свою упорную игру с Flappy High Fiver NFT!                                                                                               |
| Изображение | Вы можете скачать [изображение](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) здесь | Вы можете скачать [изображение](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png) здесь |

Мы полностью готовы. Итак, давайте перейдем к реализации логики.

## Подключение кошелька

Процесс начинается с того, что пользователь подключает свой кошелек. Итак, давайте добавим интеграцию подключения кошелька. Для работы с блокчейном со стороны клиента нам необходимо установить GameFi SDK для Phaser:

```sh
npm install --save @ton/phaser-sdk@beta
```

Теперь давайте настроим GameFi SDK и создадим его экземпляр:

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

> Чтобы узнать больше о параметрах инициализации, прочтите [документацию библиотеки](https://github.com/ton-org/game-engines-sdk).

> Чтобы узнать, что такое `tonconnect-manifest.json`, пожалуйста, проверьте ton-connect [описание манифеста](/v3/guidelines/ton-connect/guidelines/creating-manifest).

Теперь мы готовы создать кнопку подключения кошелька. Давайте создадим сцену пользовательского интерфейса в Phaser, которая будет содержать кнопку подключения:

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

> Прочитайте, как создать [кнопку подключения](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82) и [сцену пользовательского интерфейса](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45).

Чтобы следить за тем, когда пользователь подключает или отключает свой кошелек, давайте воспользуемся следующим фрагментом кода:

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

> Чтобы узнать о более сложных сценариях, ознакомьтесь с полной реализацией [процесса подключения кошелька](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16).

Прочитайте, как может быть реализовано [управление игровым пользовательским интерфейсом](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50).

Теперь у нас подключен кошелек пользователя, и мы можем двигаться дальше.

![Кнопка подключения кошелька](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![Подтверждение подключения кошелька](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![Кошелек подключен](/img/tutorials/gamefi-flappy/wallet-connected.png)

## Реализация достижений и наград

Для реализации системы достижений и вознаграждений нам необходимо подготовить конечную точку, которая будет запрашиваться при каждой попытке пользователя.

### Конечная точка `/played`

Нам нужно создать конечную точку `/played`, которая должна выполнять следующие действия:

- получите тело запроса с адресом кошелька пользователя и начальными данными Telegram, переданными Mini App во время запуска приложения. Начальные данные необходимо разобрать, чтобы извлечь данные аутентификации и убедиться, что пользователь отправляет запрос только от своего имени.
- конечная точка должна подсчитать и сохранить количество игр, в которые сыграл пользователь.
- конечная точка должна проверить, если это первая или пятая игра для пользователя, и, если да, вознаградить пользователя соответствующим SBT.
- конечная точка должна вознаграждать пользователя 1 FLAP за каждую игру.

> Прочитайте код [конечной точки /played](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197).

### Запрос конечной точки `/played`

Каждый раз, когда птица ударяется о трубу или падает вниз, клиентский код должен вызывать конечную точку `/played`, передавая правильное тело:

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

> Прочитайте код [submitPlayer function](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10).

Давайте сыграем в первый раз и убедимся, что будем вознаграждены жетоном FLAP и SBT. Нажмите кнопку Play, пролетите через пару труб, а затем врежьтесь. Отлично, все работает!

![Награжден жетоном и SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

Сыграйте еще 4 раза, чтобы получить второй SBT, а затем откройте свой Кошелек, TON Space. Здесь находятся Ваши коллекционные предметы:

![Достижения как SBT в кошельке](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## Реализация игрового магазина

Чтобы иметь внутриигровой магазин, нам необходимо иметь два компонента. Первый - это конечная точка, которая предоставляет информацию о покупках пользователей. Второй - глобальный цикл, который следит за пользовательскими транзакциями и назначает игровые свойства их владельцам.

### Конечная точка `/purchases`

Конечная точка делает следующее:

- получает параметр `auth` с начальными данными Telegram Mini Apps.
- получает товары, которые купил пользователь, и отвечает списком товаров.

> Прочитайте код конечной точки [/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303).

### Цикл для покупок

Чтобы узнать, когда пользователи совершают платежи, нам нужно следить за транзакциями главного кошелька. Каждая транзакция должна содержать сообщение `userId`:`itemId`. Мы будем запоминать последнюю обработанную транзакцию, получать только новые, присваивать пользователям свойства, которые они купили, используя `userId` и `itemId`, переписывать хэш последней транзакции. Это будет работать в бесконечном цикле.

> Прочитайте код [цикла покупки](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110).

### Клиентская часть магазина

На стороне клиента у нас есть кнопка "Shop".

![Кнопка входа в магазин](/img/tutorials/gamefi-flappy/shop-enter-button.png)

Когда пользователь нажимает на кнопку, открывается сцена магазина. Сцена магазина содержит список товаров, которые пользователь может купить. У каждого товара есть цена и кнопка "Buy". Когда пользователь нажимает на кнопку "Buy", совершается покупка.

Открытие магазина вызовет загрузку купленных предметов и будет обновлять его каждые 10 секунд:

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> Прочитайте код [функции showShop](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191).

Теперь нам нужно реализовать саму покупку. Для этого мы сначала создадим экземпляр GameFi SDK, а затем воспользуемся методом `buyWithJetton`:

```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![Игровой товар для покупки](/img/tutorials/gamefi-flappy/purchase-item.png)
![Подтверждение покупки](/img/tutorials/gamefi-flappy/purchase-confirmation.png)
![Товар готов к использованию](/img/tutorials/gamefi-flappy/purchase-done.png)

Также можно расплатиться монетой TON:

```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## Послесловие

На этом все! Мы рассмотрели основные возможности GameFi, но SDK предоставляет больше функций, таких как трансферы между игроками, утилиты для работы с NFT и коллекциями и т.д. В будущем мы предоставим еще больше возможностей.

Чтобы узнать обо всех возможностях GameFi, которые Вы можете использовать, прочитайте документацию [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) и [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk).

Поделитесь мнением в [Обсуждениях](https://github.com/ton-org/game-engines-sdk/discussions)!

Полная реализация доступна в репозитории [flappy-bird](https://github.com/ton-community/flappy-bird).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/zero-knowledge-proofs.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/dapps/tutorials/zero-knowledge-proofs.md
================================================
# Создание простого проекта ZK на TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## 👋 Введение

**Доказательства с нулевым разглашением** (ZK) — это фундаментальный криптографический примитив, который позволяет одной стороне (доказывающей) доказать другой стороне (проверяющей), что утверждение истинно, не раскрывая никакой информации, выходящей за рамки действительности самого утверждения. Доказательства с нулевым разглашением — это мощный инструмент для создания систем, сохраняющих конфиденциальность, и использовались в различных приложениях, включая анонимные платежи, анонимные системы обмена сообщениями и не требующие доверия мосты.

:::tip Обновление TVM 2023.07
До июня 2023 года было невозможно проверить криптографические доказательства на TON. Из-за преобладания сложных вычислений за алгоритмом сопряжения потребовалось расширить функциональность TVM, добавив коды операций TVM для проведения проверки доказательств. Эта функциональность была добавлена ​​в [обновлении за июнь 2023 г.](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381) и на момент написания статьи доступна только в тестовой сети.
:::

## 🦄 В этом руководстве будут рассмотрены

1. Основы криптографии с нулевым разглашением и, в частности, zk-SNARK (Краткое неинтерактивное подтверждение знаний с нулевым разглашением - Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)
2. Инициирование церемонии доверенной установки (с использованием возможностей Tau)
3. Написание и компиляция простой схемы ZK (с использованием языка Circom)
4. Создание, развертывание и тестирование контракта FunC для проверки образца ZK-доказательства

## 🟥🟦 Объяснение доказательств ZK на примере с цветовой гаммой

Прежде чем углубиться в детали нулевого разглашения, давайте начнем с простой проблемы. Предположим, вы хотите доказать дальтонику, что можно различать цвета. Мы воспользуемся интерактивным решением для решения этой проблемы. Предположим, дальтоник (проверяющий) находит два одинаковых листка бумаги, один из которых красный 🟥, а другой синий 🟦.

Проверяющий показывает один из листков бумаги вам (доказывающему) и просит запомнить цвет. Затем проверяющий держит этот конкретный листок бумаги за спиной и либо оставляет его прежним, либо меняет его и спрашивает вас, изменился ли цвет или нет. Если вы можете заметить разницу, то вы можете видеть цвета (или вам просто повезло, потому что у вас был 50% шанс угадать правильный цвет).

Теперь, если проверяющий выполнит этот процесс 10 раз, и вы сможете заметить разницу каждый раз, то проверяющий на ~99,90234% (1 - (1/2)^10) уверен, что используются правильные цвета. Таким образом, если верификатор завершит процесс 30 раз, то верификатор будет уверен на 99,99999990686774% (1 - (1/2)^30).

Тем не менее, это интерактивное решение, и неэффективно иметь DApp, которое просит пользователей отправить 30 транзакций для подтверждения определенных данных. Поэтому необходимо неинтерактивное решение; здесь вступают в дело Zk-SNARK и Zk-STARK.

Для целей этого руководства мы рассмотрим только Zk-SNARK. Однако вы можете прочитать больше о том, как работают Zk-STARK, на [сайте StarkWare](https://starkware.co/stark/), а информацию, сравнивающую различия между Zk-SNARK и Zk-STARK, можно найти в этой [записи в блоге Panther Protocol](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/).\*\*

### 🎯 Zk-SNARK: Zero-Knowledge Succinct Non-Interactive Argument of Knowledge

Zk-SNARK — это неинтерактивная система доказательства, в которой доказывающий может продемонстрировать проверяющему, что утверждение истинно, просто предоставив одно доказательство. А проверяющий может проверить доказательство за очень короткое время. Обычно работа с Zk-SNARK состоит из трех основных этапов:

- Проведение доверенной настройки с использованием протокола [многосторонних вычислений (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation) для генерации ключей подтверждения и проверки (с использованием полномочий TAU)
- Генерация доказательства с использованием ключа подтверждающего, открытого ввода и секретного ввода (свидетеля)
- Проверка доказательства

Давайте настроим нашу среду разработки и начнем кодировать!

## ⚙ Настройка среды разработки

Давайте начнем процесс, выполнив следующие шаги:

1. Создайте новый проект под названием «simple-zk» с помощью [Blueprint](https://github.com/ton-org/blueprint), выполнив следующую команду, после этого введите имя для вашего контракта (например, ZkSimple), а затем выберите первый вариант (используя пустой контракт).

```bash
npm create ton@latest simple-zk
```

2. Далее мы клонируем [репозиторий snarkjs](https://github.com/kroist/snarkjs), настроенный для поддержки контрактов FunC

```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. Затем мы установим необходимые библиотеки для ZkSNARKs

```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```

4. Далее мы добавим следующий раздел в package.json (обратите внимание, что некоторые из кодов операций, которые мы будем использовать, пока недоступны в выпуске основной сети)

```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. Кроме того, нам нужно будет изменить версию @ton-community/sandbox, чтобы иметь возможность использовать [последние обновления TVM](https://t.me/thetontech/56)

```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```

Отлично! Теперь мы готовы начать писать наш первый проект ZK на TON!

В настоящее время у нас есть две основные папки, из которых состоит наш проект ZK:

- Папка `simple-zk`: содержит наш шаблон Blueprint, который позволит нам писать схему, контракты и тесты
- Папка `snarkjs`: содержит репозиторий snarkjs, который мы клонировали на шаге 2

## Схема Circom

Сначала давайте создадим папку `simple-zk/circuits`, а затем создадим в ней файл и добавим в него следующий код:

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

Выше мы добавили простую схему умножения. Используя эту схему, мы можем доказать, что знаем два числа, которые при умножении дают определенное число (c), не раскрывая сами соответствующие числа (a и b).

Чтобы узнать больше о языке circom, посетите [этот сайт](https://docs.circom.io/).

Далее мы создадим папку для наших файлов сборки и переместим туда данные, выполнив следующее (находясь в папке `simple-zk`):

```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 Создание доверенной настройки с полномочиями TAU

Теперь пришло время создать доверенную настройку. Для выполнения этого процесса мы воспользуемся методом [Сила Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) (который, вероятно, займет несколько минут). Давайте приступим к делу:

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

После завершения описанного выше процесса в папке build/circuits будет создан файл pot14_final.ptau, который можно использовать для написания будущих связанных схем.

:::caution Размер ограничений
Если написана более сложная схема с большим количеством ограничений, необходимо сгенерировать настройку PTAU с использованием большего параметра.
:::

Вы можете удалить ненужные файлы:

```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```

### 📜 Компиляция схемы

Теперь давайте скомпилируем схему, выполнив следующую команду из папки `build/circuits`:

```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

Теперь наша схема скомпилирована в файлы `build/circuits/circuit.sym`, `build/circuits/circuit.r1cs` и `build/circuits/circuit.wasm`.

:::info кривые altbn-128 и bls12-381
Эллиптические кривые altbn-128 и bls12-381 в настоящее время поддерживаются snarkjs. Кривая [altbn-128](https://eips.ethereum.org/EIPS/eip-197) поддерживается только в Ethereum. Однако в TON поддерживается только кривая bls12-381.
:::

Давайте проверим размер ограничений нашей схемы, введя следующую команду:

```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

Поэтому правильный результат должен быть:

```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

Теперь мы можем сгенерировать эталонный zkey, выполнив следующее:

```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

Затем мы добавим следующий вклад в zkey:

```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

Далее давайте экспортируем окончательный zkey:

```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

Теперь у нас есть наш окончательный zkey, присутствующий в файле `build/circuits/circuit_final.zkey`. Затем zkey проверяется, вводя следующее:

```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

Наконец, пришло время сгенерировать ключ проверки:

```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

Затем мы удалим ненужные файлы:

```bash
rm circuit_0000.zkey circuit_0001.zkey
```

После выполнения вышеуказанных процессов папка `build/circuits` должна отображаться следующим образом:

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

### ✅ Экспорт контракта верификатора

Последний шаг в этом разделе — сгенерировать контракт верификатора FunC, который мы будем использовать в нашем проекте ZK.

```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
```

Затем в папке `contracts` генерируется файл `verifier.fc`.

## 🚢 Развертывание контракта верификатора​

Давайте рассмотрим файл `contracts/verifier.fc` пошагово, поскольку он содержит магию ZK-SNARK:

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

Выше приведены константы, которые контракты верификаторов должны использовать для реализации проверки доказательств. Эти параметры можно найти в файле `build/circuits/verification_key.json`.

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```

Приведенные выше строки — это новые [коды операций TVM](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07#bls12-381) (BLS12-381), которые позволяют проводить проверки пар в блокчейне TON.

Функции load_data и save_data просто используются для загрузки и сохранения результатов проверки доказательств (только для целей тестирования).

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

Далее следует несколько простых функций утилит, которые используются для загрузки данных доказательства, отправленных в контракт:

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

И последняя часть — это функция groth16Verify, которая требуется для проверки действительности доказательства, отправленного в контракт.

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

Теперь необходимо отредактировать два файла в папке `wrappers`. Первый файл, требующий нашего внимания, — это файл `ZkSimple.compile.ts` (если на шаге 1 было задано другое имя для контракта, его имя будет другим). Мы поместим файл `verifier.fc` в список контрактов, которые должны быть скомпилированы.

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

Другой файл, требующий внимания, — это `ZkSimple.ts`. Сначала нам нужно добавить код операции `verify` в перечисление `Opcodes`:

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

Далее необходимо добавить функцию `sendVerify` в класс `ZkSimple`. Эта функция используется для отправки доказательства в контракт и его проверки и представлена ​​следующим образом:

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

Далее мы добавим функцию `cellFromInputList` в класс `ZkSimple`. Эта функция используется для создания ячейки из общедоступных входов, которые будут отправлены в контракт.

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

Наконец, последняя функция, которую мы добавим в класс `ZkSimple`, — это функция `getRes`. Эта функция используется для получения результата проверки доказательства.

```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

Теперь мы можем запустить требуемые тесты, необходимые для развертывания контракта. Чтобы это стало возможным, контракт должен успешно пройти тест развертывания. Запустите эту команду в корне папки `simple-zk`:

```bash
npx blueprint test
```

## 🧑‍💻 Написание тестов для верификатора

Откроем файл `ZkSimple.spec.ts` в папке `tests` и напишем тест для функции `verify`. Тест проводится следующим образом:

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

Сначала нам нужно импортировать несколько пакетов, которые мы будем использовать в тесте:

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

Заполним тест `should verify`. Сначала нам нужно будет сгенерировать доказательство.

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

Для выполнения следующего шага необходимо определить функции `g1Compressed`, `g2Compressed` и `toHexString`. Они будут использоваться для преобразования криптографического доказательства в формат, который ожидает контракт.

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

Теперь мы можем отправить криптографическое доказательство в контракт. Для этого мы будем использовать функцию sendVerify. Функция `sendVerify` ожидает 5 параметров: `pi_a`, `pi_b`, `pi_c`, `pubInputs` и `value`.

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

Вы готовы проверить свое первое доказательство на блокчейне TON? Чтобы начать этот процесс, давайте запустим тест Blueprint, введя следующее:

```bash
npx blueprint test
```

Результат должен быть следующим:

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

Чтобы проверить репозиторий, содержащий код из этого руководства, нажмите на следующую ссылку, доступной [здесь](https://github.com/SaberDoTcodeR/zk-ton-doc).

## 🏁 Заключение

В этом руководстве вы изучили следующие навыки:

- Сложности нулевого разглашения и, в частности, ZK-SNARK
- Написание и компиляция схем Circom
- Более глубокое знакомство с MPC и возможностями TAU, которые использовались для генерации ключей проверки для схемы
- Познакомились с библиотекой Snarkjs для экспорта верификатора FunC для схемы
- Познакомились с Blueprint для развертывания верификатора и написания тестов

Примечание: приведенные выше примеры научили нас, как создать простой вариант использования ZK. Тем не менее, существует широкий спектр очень сложных вариантов использования, ориентированных на ZK, которые можно реализовать в самых разных отраслях. Вот некоторые из них:

- частные системы голосования 🗳
- частные системы лотерей 🎰
- частные системы аукционов 🤝
- частные транзакции💸 (для Toncoin или Жетонов)

Если у вас возникнут вопросы или вы обнаружите какие-либо ошибки в этом руководстве, не стесняйтесь писать автору: [@saber_coder](https://t.me/saber_coder)

## 📌 Ссылки

- [Обновление TVM за июнь 2023 г.](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade)
- [SnarkJs](https://github.com/iden3/snarkjs)
- [Ответвление SnarkJs FunC](https://github.com/kroist/snarkjs)
- [Пример ZK на TON](https://github.com/SaberDoTcodeR/ton-zk-verifier)
- [Blueprint](https://github.com/ton-org/blueprint)

## 📖 Смотрите также

- [EVM-контракты TON с мостом без доверия](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel Network: протокол конфиденциальности в TON](http://github.com/saberdotcoder/tonnel-network)
- [TVM Challenge](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)

## 📬 Об авторе

- Saber в [Telegram](https://t.me/saber_coder) или [GitHub](https://github.com/saberdotcoder) или [LinkedIn](https://www.linkedin.com/in/szafarpoor/)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/get-started-with-ton.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/get-started-with-ton.mdx
================================================
import ThemedImage from '@theme/ThemedImage';
import ConceptImage from '@site/src/components/conceptImage'
import Player from '@site/src/components/player'

# Начните работу с TON

Давайте создадим с нуля ваше первое приложение на блокчейне TON. Вы сможете оценить предлагаемые блокчейном TON скорость, надежность, а также ознакомиться с основными концепциями асинхронного мышления.

:::tip Руководство для новичков
Если вы только делаете первые шаги в программировании, это руководство станет для вас отличной отправной точкой.
:::

Данный обучающий курс включает в себя **5 модулей**, а его прохождение займет примерно **45 минут**.

## 🛳 Чему вы научитесь

Из этого руководства вы поймете, на сколько просто совершать транзакции в блокчейне с помощью JavaScript. Конечно вы можете научиться это делать и без руководства, но с ним будет гораздо легче, эффективнее и понятнее.

1. Вы создадите свой собственный кошелек TON с помощью Tonkeeper
2. Воспользуетесь краном Testnet для пополнения своего тестового кошелька
3. Разберётесь в ключевых концепциях смарт-контрактов TON (адреса, ячейки)
4. Научитесь взаимодействовать с TON с помощью TypeScript SDK и API-провайдера
5. Скомпилируете свою первую транзакцию с помощью консольного приложения NFT Miner

 _И, главное – вы добудете NFT-достижение "Ракета"!!!_

Ровно так же как и первые майнеры на TON, вы будете взаимодействовать со смарт-контрактом Proof-of-Work и по завершению получите секретное вознаграждение для вашего кошелька TON. Полный вперед!

<div style={{width: '100%', maxWidth:'250pt',  textAlign: 'center', margin: '0 auto' }}>
  <video width={'300'} style={{width: '100%', maxWidth:'250pt', borderRadius: '10pt', margin: '15pt auto' }} muted={true} autoPlay={true} loop={true}>
    <source src="/files/onboarding-nft.mp4" type="video/mp4" />
Ваш браузер не поддерживает тег видео.
  </video>
</div>

Наша цель на сегодня – добыть NFT! Это достижение останется с вами _навсегда_.

В последствии, вы сможете добыть это NFT достижение даже в основной сети, mainnet. _Это стоит всего 0,05 TON!_.

### Видеоурок

Для более подробного изучения материала, ознакомьтесь с очень полезным видеоуроком от Владимира Алефмана.

<Player url="https://youtu.be/mgVUY04I_3A" />

### Майнинг на блокчейне TON

Сейчас мы разберем принципы майнинга на блокчейне TON. Этот материал позволит вам понять не только важность этого процесса, а также то, почему майнинг биткоинов помог совершить революцию в индустрии.

Хотя структура смарт-контрактов PoW Giver, определявшая начальный процесс майнинга и заложившая основу для TON, была завершена на старте, последний TON был добыт в июне 2022 года, завершим тем самым механизм распределения токенов через Proof-of-Work (PoW). Тем не менее, с нашим недавним переходом на Proof-of-Stake (PoS) эпоха стекинга в TON только начинается.

- [Погрузитесь глубже в нашу экономическую модель и майнинг на TON](https://ton.org/mining)

Теперь же давайте перейдем к первым шагам на пути к тому, чтобы стать **разработчиком на TON**, а также научиться добывать NFT. Ниже приведен пример того, что мы планируем создать в рамках курса.

<div style={{ width: '100%', textAlign: 'center', margin: '0 auto' }}>
  <video style={{ width: '100%', borderRadius: '10pt', margin: '15pt auto', maxWidth: '90%' }} muted={true} autoPlay={true}
         loop={true}>
    <source src="/files/onboarding.mp4" type="video/mp4" />

Ваш браузер не поддерживает тег видео.

</video>
</div>

Создание подобного майнера при сфокусированной работе займет около получаса.

## 🦄 Начало работы

Для начала работы, вам понадобятся следующие компоненты:

- **Кошелек**: Вам понадобится некостодиальный кошелек для хранения NFT в режиме тестовой сети.
- **Репозиторий**: Мы будем использовать готовый шаблон, созданный специально для вас.
- **Среда разработки**:  Разработчикам нужно будет выбрать в какой среде они будут майнить – локальной или облачной.

### Загрузка и создание кошелька

Для начала вам понадобится некостодиальный кошелек, который позволит вам получать и хранить ваши TON. В данном руководстве мы используем Tonkeeper. Вам необходимо будет включить режим Testnet в кошельке, для того чтобы иметь возможность получать тестовые Toncoin. Эти токены будут использованы позже для отправки финальной транзакции майнинга в смарт-контракт.

:::info
При использовании некастодиального кошелька, пользователь является владельцем кошелька, а также хранит приватный ключ самостоятельно.
:::

Чтобы загрузить и создать кошелек TON, выполните следующие простые шаги:

1. Установите приложение Tonkeeper на свой смартфон. Его можно скачать [здесь](https://Tonkeeper.com/).
2. Далее вам необходимо [включить тестовый режим](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment) в Tonkeeper.

Отлично! Теперь перейдем к разработке.

### Настройка проекта

Чтобы упростить процесс и избежать рутинных низкоуровневых задач, мы будем использовать шаблонный проект.

:::tip
Обратите внимание, что для дальнейшей работы вам потребуется [войти](https://github.com/login) в свою учётную запись GitHub.
:::

Пожалуйста, используйте шаблон [ton-onboarding-challenge](https://github.com/ton-community/ton-onboarding-challenge) для создания вашего проекта. Для этого нажмите кнопку "Use this template" и выберите вкладку "Create a new repository", как показано ниже:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/1.png?raw=true',
        dark: '/img/tutorials/onboarding/1-dark.png?raw=true',
    }}
/>
<br></br>

После выполнения этого шага, вы получите доступ к высокопроизводительному репозиторию, который станет основой вашего майнера. Поздравляем! ✨

### Среды разработки

Следующий шаг – выбрать среду разработки, которая лучше всего соответствует вашим потребностям, уровню опыта и навыкам. Как видите, этот процесс можно выполнить как в облачной, так и в локальной среде. Разработка в "облаке" часто считается более простой и легкой для начала работы. Ниже мы рассмотрим шаги, необходимые для обоих подходов.

:::tip
Убедитесь, что вы открыли репозиторий в своем профиле GitHub, созданный на основе шаблона в предыдущем шаге.
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

#### Локальные и облачные среды разработки

- Если вы не знакомы с JavaScript, работа в IDE может оказаться для вас сложной задачей, особенно если компьютер и инструменты не настроены для этого.

- Но если вы знакомы с NodeJS и Git и умеете работать с `npm`, то использовать **локальную среду разработки** может быть удобнее.

#### Облачные пространства

Если вы решили работать в облачной среде, то начать можно в пару кликов: сначала выберите вкладку _Code_, а затем нажмите кнопку _Create codespace on master_ в репозитории GitHub, как показано ниже:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/2.png?raw=true',
        dark: '/img/tutorials/onboarding/2-dark.png?raw=true',
    }}
/>
<br></br>

Затем GitHub создаст специальное облачное рабочее пространство, дающее вам доступ к VSCode Online IDE (интегрированная онлайн-среда разработки Visual Studio Code).

После получения доступа (обычно codespace запускается примерно за 30 секунд), у вас будет все необходимое для работы без установки Git, Node.js или других инструментов.

#### Локальные среды разработки

Для настройки локальной среды разработки вам потребуется доступ к трем основным инструментам:

- **Git**. Необходимый инструмент для работы с репозиториями. Скачать можно [здесь](https://git-scm.com/downloads).
- **NodeJS**. Среда выполнения JavaScript и TypeScript, обычно используемая для разработки приложений на TON. Скачать можно [здесь] (https://nodejs.org/en/download/).
- **JavaScript IDE**. Обычно используются для разработки в локальной среде. Например - Visual Studio Code ([VSCode](https://code.visualstudio.com/download)).

Чтобы приступить к работе клонируйте ваш шаблонный репозиторий с GitHub и откройте нужный репозиторий в вашей интегрированной среде разработки (IDE).

#### Выполнение скриптов

В этом руководстве мы будем запускать скрипты на TypeScript. Все команды, такие как запуск скриптов или установка модулей, выполняются через командную строку в рабочей области терминала IDE. Обычно она находится в нижней части интерфейса.

Например, если в облачном Codespaces еще не открыто рабочее пространство терминала, его можно открыть следующим образом:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/6.png?raw=true',
        dark: '/img/tutorials/onboarding/6-dark.png?raw=true',
    }}
/>
<br></br><br></br>

Вводите команды в этом окне и нажимайте Enter, чтобы выполнить их:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/4.png?raw=true',
        dark: '/img/tutorials/onboarding/4-dark.png?raw=true',
    }}
/>
<br></br><br></br>

Терминал также можно использовать как отдельное приложение. Выберите подходящую версию в зависимости от вашей IDE и операционной системы.

Отлично! Теперь вы готовы глубже погрузиться в секреты блокчейна TON. 👀

## 🎯 Подключение к TON

Итак, что потребуется для подключения к блокчейну TON?

- **Адрес смарт-контракта**  — как точка назначения. Мы будем добывать NFT из proof-of-work смарт-контракта, поэтому нам нужен его адрес, чтобы узнать текущую сложность майнинга.
- **API-провайдер**, чтобы отправлять запросы в блокчейн TON. Существует несколько [типов API](/v3/guidelines/dapps/apis-sdks/api-types) для разных задач. Мы будем использовать тестовую версию API [toncenter.com](https://toncenter.com/).
- **JavaScript SDK** (Software Development Kit или SDK — набор инструментов для разработки) — нужен, чтобы обработать адрес смарт-контракта и подготовить его для API-запроса. Подробнее про адреса TON и их обработку, можно прочитать [здесь](/v3/documentation/smart-contracts/addresses). Для выполнения этого процесса мы будем использовать [`@ton/ton`](https://github.com/ton-org/ton).

В следующем разделе мы разберем, как отправлять первые запросы в блокчейн TON через API TONCenter и `@ton/ton` для получения данных от смарт-контракта PoW.

### Адреса смарт-контрактов

Чтобы майнер работал правильно, нужно добавить два разных типа адресов смарт-контрактов:

1. **Адрес кошелька**. Он необходим, для получения вознаграждения за майнинг. В данном случае нужно использовать режим [Tonkeeper Testnet](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment).
2. **Адрес коллекции**. Необходим для корректного майнинга NFT смарт-контрактом. Для выполнения процесса, скопируйте адрес коллекции NFT под названием "TON onboarding challenge" с сайта [Getgems](https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX).

Теперь давайте откроем файл `./scripts/mine.ts` в вашем майнере и создадим функцию `mine()`, в которой определим основные константы следующим образом:

```ts title="./scripts/mine.ts"
import {Address} from '@ton/ton';

const walletAddress = Address.parse('YOUR_WALLET_ADDRESS');
const collectionAddress = Address.parse('COLLECTION_ADDRESS');

async function mine () {


}

mine();
```

#### Использование функции async mine()

В процессе создания TON NFT майнера мы будем отправлять несколько запросов к публичному API, чтобы получать ответы и передавать их в нужные части кода. Использование функции async/await значительно упростит написание кода.

#### Парсинг адресов

На TON адреса смарт-контрактов имеют разные форматы и используют множество типов флагов. В данном случае мы будем использовать _удобный для пользователя формат адреса_. Если вы хотите узнать больше о типах адресов смарт-контрактов, изучите даный [раздел](/v3/documentation/smart-contracts/addresses) в нашей документации.

Чтобы майнер работал корректно, нужно добавить два разных типа адресов смарт-контрактов, таких как:

Метод `Address.parse()`, расположенный в `@ton/ton` SDK, позволяет разработчику создать объект адреса для упрощенного преобразования адресов из одного формата в другой.

### Подключение к API-провайдеру

На этом этапе мы подключимся к TON через API-провайдера TONCenter (размещенного на toncenter.com), используя специальные команды в скрипте.

Самый простой способ - это указать тестовый эндпоинт `https://testnet.toncenter.com/api/v2/jsonRPC`.

<br></br>

<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/5.png?raw=true',
        dark: '/img/tutorials/onboarding/5-dark.png?raw=true',
    }}
/>

<br></br>

Нужно добавить `client` и `endpoint` в скрипт `./scripts/mine.ts`, используя _TonClient_ и тестовый эндпоинт Toncenter `https://testnet.toncenter.com/api/v2/jsonRPC`:

```ts title="./scripts/mine.ts"
import {Address, TonClient} from "@ton/ton"

// ... previous code

// specify endpoint for Testnet
const endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC"

// initialize ton library
const client = new TonClient({ endpoint });
```

:::info что делать в продакшене?
Лучше всего использовать провайдера RPC-узлов или запустить собственный экземпляр ton-http-api. Подробнее читайте на странице [TonCenter API](/v3/guidelines/dapps/apis-sdks/ton-http-apis).
:::

### Получение данных майнинга из блокчейна TON

Следующий шаг — получить конкретные данные о майнинге из блокчейна TON.

Откройте [файл README](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive), который поможет пройти TON-онбординг-челлендж. Актуальные данные о майнинге TON можно получить, запустив метод `get_mining_data`.

В результате мы должны получить массив с такими полями:

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

#### Запуск Get-методов смарт-контрактов на TON

С помощью `@ton/ton` можно выполнить функцию `client.runMethod(SMART_CONTRACT_ADDRESS, METHOD)`.
После запуска этой команды в консоли появится следующий вывод:

```ts title="./scripts/mine.ts"
// ... previous code

const miningData = await client.runMethod(collectionAddress, 'get_mining_data');

console.log(miningData.stack);
```

Помимо этого, для запуска скрипта необходимо ввести следующую команду [в терминале](/v3/guidelines/get-started-with-ton#running-scripts):

```bash
npm run start:script
```

:::tip
Чтобы избежать непредвиденных проблем, убедитесь, что вы выполнили все предыдущие шаги, включая ввод адресов контрактов.
:::

Отлично! Если все вышеуказанные шаги выполнены правильно, API подключится успешно, а в консоли отобразятся нужные данные. Правильный вывод будет выглядеть так:

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

Приведенный выше содержит данные о выполнении процесса в виде набора числовых (_int_) значений. Теперь наша задача — преобразовать их в более удобный для использования формат.

Нам нужно преобразовать шестнадцатеричный вывод во что-то более _удобное_.

:::info ПАРАМЕТРЫ ГАЗА НА TON

1. Чтобы лучше разобраться, как работает виртуальная машина TON (TVM - TON Virtual Machine) и _как TON обрабатывает транзакции_, изучите раздел ["Обзор TVM"](/v3/documentation/tvm/tvm-overview).
2. Если вам интересно узнать больше о комиссиях за транзакции и расходе газа на TON, загляните в [этот раздел](/v3/documentation/smart-contracts/transaction-fees/fees) нашей документации.
3. И, наконец, чтобы разобраться в точных значениях газа, необходимых для выполнения инструкций TVM, обратитесь к [этому разделу](/v3/documentation/tvm/instructions#gas-prices) документации.
   :::

А теперь давайте вернемся к руководству!

#### Числовые данные майнинга в удобном формате

В предыдущем разделе мы рассмотрели числовые (_int_) значения, необходимые для получения данных о майнинге. Перед дальнейшей обработкой, эти данные нужно перевести в более удобный и понятный формат.

Как видно из приведенного вывода, числа могут быть очень большими. Для работы с такими выводами мы будем использовать `bigint` — способ реализации больших чисел в JavaScript. `BigInt` позволяет обрабатывать числа, превышающие максимальное целочисленное значение `number`. Давайте разберем пример, чтобы лучше понять, какие _данные о майнинге_ нужны для этого процесса:

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

Как показано выше, разные компоненты _miningData_ используют стековые числа для различных параметров, о которых мы поговорим дальше. Чтобы получить нужное значение, мы воспользовались функцией `stack.readBigNumber()` которая считывает `bigint` из стека.

После завершения этого процесса мы можем вывести значения в консоль. Попробуйте запустить скрипт снова, выполнив команду:

```bash
npm run start:script
```

Вот пример вывода:

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

Давайте разберем команду Mining Data, которая используется для обработки различных параметров данных при программировании данных майнинга в блокчейне TON. К ним относятся:

- `complexity` - наиболее важный параметр для майнеров. Он определяет сложность Proof-of-Work для значений. Хеш считается найденным, _если его значение меньше сложности_.
- `lastSuccess` - это временная метка [unix timestamp](https://www.unixtimestamp.com/), фиксирующая время и дату последней майнинговой транзакции в TON. При каждом изменении last_success, майнер нужно запускать заново, так как вместе с этим изменяется и seed.
- `seed` обозначает уникальное значение, генерируемое смарт-контрактом для вычисления целевого хеша. Чтобы лучше понять этот процесс и узнать больше о том, как и почему изменяется seed, ознакомьтесь с папкой файлов проекта, используя ключевое слово ctx_seed (Ctrl+F с ключевым словом "ctx_seed").
- `targetDelta`, `minCpl` и `maxCpl` не будут использоваться в данном руководстве. Однако вы всегда можете узнать больше о том, как они используются в смарт-контрактах для расчета сложности proof-of-work, в исходных файлах коллекции вашего проекта.

Мы разобрались с различными параметрами и теперь можем использовать значения `complexity`, `lastSuccess`, `seed`, в нашем NFT майнере. Давайте перейдем к следующему разделу.

## 🛠 Подготовка NFT майнера

Всё получилось? Отлично! Идем дальше.

Мы уже подключились к TON и получили необходимые данные майнинга из блокчейна для создания NFT-майнера. Теперь давайте разберемся со следующими шагами.

В этой главе вы _подготовите сообщение для майнинга_ и _вычислите его хеш_. После этого вы _найдете хеш, который будет меньше (`<`) сложности_, полученной нами из смарт-контракта.

Вот что такое майнер! Просто, не правда ли?

### Подготовка сообщений для майнинга

Сначала мы должны подготовить сообщение для майнинга. Важно убедиться, что параметры указаны правильно. Это гарантирует корректность процесса и целостность данных.

К счастью, [файл README](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive) содержит необходимые инструкции, которые помогут нам в этом. В нем представлена таблица с нужными полями и типами ячеек (раздел "Layout of Proof of Work Cell"). Она поможет правильно настроить процесс.

:::info Что такое ячейки?
Ячейки — это структуры хранения данных в TON, выполняющие множество задач, в том числе повышение масштабируемости сети и ускорение транзакций смарт-контрактов. Мы не будем сейчас вдаваться в детали, но если вам интересно разобраться в устройстве ячеек и принципах их работы, загляните в [этот раздел](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) нашей документации.
:::

К счастью, все структуры данных, используемые в этом руководстве, уже написаны на TypeScript. Вы можете использовать объект `MineMessageParams` из _NftGiver.data.ts_, чтобы создать транзакцию с помощью _Queries_:

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

Давайте разберемся, где находятся _op_ и _data2_ из [этой таблицы](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive):

- В таблице числовое значение data1 должно совпадать со значением data2. Чтобы не заполнять значение data2, конструктор транзакций выполняет низкоуровневый процесс (см. исходный код Queries.mine()).
- Поскольку классификация `op` всегда постоянна, она уже реализована в конструкторе транзакций _Queries_ и в _OpCodes_. Вы можете найти код op, посмотрев исходный код метода `mine()`.

:::tip
Вы можете ознакомиться с исходным кодом (`../wrappers/NftGiver.ts`) — это интересно, но не обязательно.
:::

### Создание TON NFT майнеров

Теперь, когда мы подготовили сообщения для нашего майнера TON, давайте разберемся с процессом создания самого майнера. Начнем с этой строки кода:

```ts
let msg = Queries.mine(mineParams);
```

На предыдущем шаге мы скомпилировали значение `msg`. Идея майнинга заключается в том, чтобы найти хеш `msg.hash()`, который будет меньше `complexity` полученного из последнего _get_mining_data()_. Мы можем увеличивать `data1` столько раз, сколько нам нужно.

Чистый майнер будет продолжать работать бесконечно, пока `msg.hash()` будет больше `complexity` (хеш сообщения больше сложности майнинга PoW).

Вот пример выполнения кода, относящегося к `BigInt` на TypeScript:

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

Мы преобразуем хеш из `msg.hash()` в `bigint` с помощью функции `bufferToBigint()`. Это необходимо для сравнения хеша с `complexity`.

Теперь, после выполнения всех вышеописанных шагов, наш майнер будет работать правильно. Но визуально он будет иметь непривлекательный вид (попробуйте `npm run start:script`). Давайте это исправим.

#### Улучшение внешнего вида TON майнера ✨

Теперь нам нужно сделать так, чтобы майнер выглядел привлекательно! Как это сделать?

Просто следуйте дальнейшим инструкциям.

Давайте добавим следующие команды:

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

Здорово получается! Давайте выполним следующую команду:

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

Круто, не правда ли? 😏

После успешного выполнения этих команд у нас получится визуально привлекательный NFT майнер. В следующем разделе мы разберемся, как подключить кошелек и создать платежный канал для приема и отправки транзакций в блокчейне TON.

## 🎨 Подготовка транзакции

Далее разберем, как сформировать сообщение и отправить его в блокчейн через ваш [кошелек Tonkeeper](https://Tonkeeper.com/).
Эти шаги помогут вам завершить процесс **майнинга NFT** на TON.

#### Пополнение баланса кошелька через кран тестовых токенов

Чтобы продолжить, нам нужно получить несколько тестовых токенов TON. Это можно сделать через [кран Testnet по этой ссылке](https://t.me/testgiver_ton_bot).

### Использование возможностей Blueprint для транзакций

Чтобы процесс майнинга NFT прошел корректно, а пользователь мог безопасно хранить свои NFT, мы будем использовать [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript). Этот инструмент позволит нам одновременно взаимодействовать с блокчейном TON и кошельком Tonkeeper.

Для этого мы создадим и отправим транзакцию с помощью стандартной функции `run()`:

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

Давайте запустим вышеуказанный скрипт для отправки транзакции:

```bash
npm start
```

Обратите внимание, что мы используем `npm start` вместо `npm run start:script`. Это нужно для работы с blueprint (в основе используется команда `blueprint run`).

Далее, чтобы подключить ваш кошелек Tonkeeper, ответьте на вопросы, как показано ниже:

```
? Which network do you want to use?
> testnet
? Which wallet are you using?
> TON Connect compatible mobile wallet (example: Tonkeeper)
? Choose your wallet (Use arrow keys)
> Tonkeeper
```

Отсканируйте QR-код в терминале с помощью Tonkeeper, чтобы установить соединение (пока без отправки транзакции). После подключения подтвердите транзакцию в Tonkeeper.

Чувствуете, как прокачиваются ваши навыки? Еще немного — и вы станете настоящим разработчиком TON.

## ⛏ Майнинг NFT с помощью кошелька

Существует два основных способа майнинга NFT на TON:

- [Простой — майнинг NFT в тестовой сети](/v3/guidelines/get-started-with-ton#simple-nft-testnet-mining)
- [Продвинутый — майнинг NFT в основной сети](/v3/guidelines/get-started-with-ton#genuine-nft-mainnet-mining)

### Простой способ: майнинг NFT в тестовой сети

Ниже приведены шаги, которые помогут вам совершить первую тестовую транзакцию для майнинга NFT:

1. Активируйте [режим Testnet в вашем кошельке Tonkeeper](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment)
2. Введите адрес вашего кошелька testnet из Tonkeeper в переменную `walletAddress` в файле `./scripts/mine.ts`
3. Введите адрес [коллекции NFT из Testnet](https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX) в переменную `collectionAddress` в `./scripts/mine.ts`

#### Майнинг NFT "Ракета" в тестовой сети

Для успешного майнинга NFT "Ракета" в тестовой сети, выполните следующие шаги:

1. _Откройте_ кошелек Tonkeeper на вашем телефоне (в нем должны быть несколько недавно полученных токенов TON из тестовой сети).
2. _Выберите_ режим сканирования в кошельке, чтобы отсканировать QR-код.
3. _Запустите_ ваш майнер для получения корректного хеша (этот процесс занимает от 30 до 60 секунд).
4. _Следуйте_ инструкциям в диалоговом окне Blueprint.
5. _Отсканируйте_ сгенерированный QR-код из майнера.
6. _Подтвердите_ транзакцию в вашем кошельке Tonkeeper.

:::tip Финальный совет
Другие разработчики тоже могут пытаться добыть свой NFT. Если кто-то успеет раньше вас, вам придется повторить процесс. Возможно, понадобится несколько попыток, чтобы у вас все получилось.
:::

Вскоре после начала этого процесса вы успешно добудете свой первый NFT на TON. Он появится в вашем кошельке Tonkeeper.

![](/img/tutorials/onboarding/8.svg)

Теперь вы **настоящий разработчик на TON**! Вы сделали это. 🛳

### Продвинутый способ: майнинг NFT в основной сети

Если вы хотите добыть NFT в основной сети TON, следуйте этим инструкциям:

1. Активируйте режим _mainnet_ в вашем Tonkeeper (на счету должно быть не менее 0,1 TON).
2. Введите адрес кошелька _mainnet_ из Tonkeeper в переменную `walletAddress` в файле `./scripts/mine.ts`
3. Введите адрес [коллекции NFT из Mainnet](https://getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX) в переменную `collectionAddress` в файле `./scripts/mine.ts`
4. Замените **endpoint** на _Mainnet_:

```ts title="./scripts/mine.ts"
// specify endpoint for Mainnet
const endpoint = "https://toncenter.com/api/v2/jsonRPC"
```

#### Майнинг NFT ракеты в основной сети

Для успешного майнинга NFT ракеты в основной сети (аналогично как в тестовой сети) необходимо выполнить следующие шаги:

1. _Откройте_ кошелек Tonkeeper на вашем телефоне (помните, на счету должны быть токены TON).
2. _Выберите_ режим сканирования в кошельке, чтобы отсканировать QR-код.
3. _Запустите_ ваш майнер для получения корректного хеша (этот процесс занимает от 30 до 60 секунд).
4. _Следуйте_ инструкциям в диалоговом окне Blueprint.
5. _Отсканируйте_ сгенерированный QR-код из майнера.
6. _Подтвердите_ транзакцию в вашем кошельке Tonkeeper.

:::tip Финальный совет
Другие разработчики тоже могут пытаться добыть свой NFT. Если кто-то успеет раньше вас, вам придется повторить процесс. Возможно, понадобится несколько попыток, чтобы у вас все получилось.
:::

Совсем немного и вы **добудете свой NFT**, став разработчиком на блокчейне TON. Готово! Проверьте свой NFT в Tonkeeper.

<div style={{ width: '100%', textAlign: 'center', margin: '0 auto' }}>
  <video width={'300'} style={{ width: '100%', borderRadius: '10pt', margin: '15pt auto' }} muted={true} autoPlay={true} loop={true}>
    <source src="/files/onboarding-nft.mp4" type="video/mp4" />

Ваш браузер не поддерживает тег видео.

</video>
</div>

Добро пожаловать на борт, **Разработчик на TON**! Вы сделали это. 🛳

## 🧙 Что дальше?

_Сначала отдохните! Вы проделали большую работу! Теперь вы разработчик TON. Но это только начало долгого пути._

## См. также

Вы завершили онбординг-челлендж TON и успешно добыли NFT. Теперь советуем изучить материалы ниже — они подробно рассказывают о разных частях экосистемы TON:

- [Что такое блокчейн? Что такое смарт-контракт? Что такое газ?](https://blog.ton.org/what-is-blockchain)
- [TON Hello World: пошаговое руководство по написанию вашего первого смарт-контракта](https://helloworld.tonstudio.io/02-contract/)
- [Разработка смарт-контрактов: введение](/v3/documentation/smart-contracts/overview)
- [[YouTube] Ton Dev Study - FunC & Blueprint](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg)
- [Как работать со смарт-контрактами для кошельков](/v3/guidelines/smart-contracts/howto/wallet)
- [FunC Journey: Часть 1](https://blog.ton.org/func-journey)
- [Бот для продажи пельменей](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)
- [Минт вашего первого Жетона](/v3/guidelines/dapps/tutorials/mint-your-first-token)
- [Пошаговый выпуск коллекции NFT](/v3/guidelines/dapps/tutorials/nft-minting-guide)
- [Как запустить TON Site](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site)

:::info есть комментарии?
Вы - один из первых исследователей здесь. Если заметите ошибки или почувствуете, что зашли в тупик, пожалуйста, напишите ваш комментарий сюда [@SwiftAdviser](https://t.me/SwiftAdviser). Я исправлю это как можно скорее! :)
:::



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/custom-overlays.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/custom-overlays.md
================================================
# Пользовательские оверлеи

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Узлы TON взаимодействуют друг с другом, формируя подсети, называемые *оверлеями*. Существует несколько общих оверлеев, в которых участвуют узлы, например: публичные оверлеи для каждого шарда, валидаторы также участвуют в общем оверлее валидаторов и оверлеях для конкретных наборов валидаторов.

Узлы также могут быть настроены для присоединения к пользовательским оверлеям.
В настоящее время эти оверлеи используются для двух целей:

- трансляция внешних сообщений
- трансляция кандидатов на блоки.

Участие в пользовательских оверлеях позволяет избежать неопределенности публичных оверлеев и повысить надежность доставки и сократить задержки.

Каждый пользовательский оверлей имеет строго определенный список участников с заранее заданными правами, в частности право на отправку внешних сообщений и блоков. Конфигурация оверлея должна быть одинаковой на всех участвующих узлах.

Если у вас под контролем несколько узлов, целесообразно объединить их в пользовательский оверлей, где все валидаторы смогут отправлять кандидатов на блок, а все LS смогут отправлять внешние сообщения. Таким образом, LS будет синхронизироваться быстрее, в то время как скорость доставки внешних сообщений будет выше (и доставка в целом более надежной). Обратите внимание, что дополнительный оверлей вызывает дополнительную нагрузку на трафик сети.

## Пользовательские оверлеи по умолчанию

Mytonctrl использует пользовательские оверлеи по умолчанию, доступные по адресу https://ton-blockchain.github.io/fallback_custom_overlays.json. Этот оверлей используется нечасто и предназначен для экстренной ситуации при проблемах с подключением к публичному оверлею.
Чтобы прекратить участие в пользовательских оверлеях по умолчанию, выполните команды

```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```

## Создание пользовательского оверлея

### Сборка adnl адреса

Чтобы добавить валидаторы в пользовательский оверлей, вы можете использовать либо их `fullnode adnl id`, доступный с помощью `validator-console -c getconfig`, либо `validator adnl id`, который можно найти в статусе mytonctrl.
Чтобы добавить liteservers в пользовательский оверлей, вы должны использовать их `fullnode adnl id`.

### Создание файла конфигурации

Создайте файл конфигурации в формате:

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

`msg_sender_priority` определяет порядок включения внешних сообщений в блоки: сначала обрабатываются сообщения из источников более высокого приоритета. Сообщения из публичного оверлея и локального LS имеют приоритет 0.

**Обратите внимание, что все узлы, перечисленные в конфигурации, должны участвовать в оверлее (другими словами, им нужно добавить оверлей с точно такой же конфигурацией), в противном случае связь будет плохой, а трансляции прекратятся**

Существует специальное слово `@validators` для создания динамического пользовательского оверлея, который mytonctrl будет автоматически генерировать в каждом раунде, добавляя всех текущих валидаторов.

### Добавление пользовательского оверлея

Используйте команду mytonctrl для добавления пользовательского оверлея:

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

Обратите внимание, что имя и файл конфигурации должны быть одинаковыми для всех участников оверлея. Проверьте, что оверлей был создан с помощью команды mytonctrl `list_custom_overlays`.

### Режим отладки

Вы можете установить уровень детализации узла равным 4 и отфильтровать логи с помощью ключевого слова "CustomOverlay".

## Удаление пользовательского оверлея

Чтобы удалить пользовательский оверлей с узла, используйте команду mytonctrl `delete_custom_overlay <name>`. Если оверлей является динамическим (т. е. в конфигурации есть слово `@validators`), он будет удален через минуту, иначе удаление произойдет немедленно. Чтобы убедиться, что узел удалил пользовательский оверлей, выполните команды `list_custom_overlays` mytonctrl и `showcustomoverlays` validator-console.

## Низкоуровневые операции

Список команд validator-console для работы с пользовательскими оверлеями:

- `addcustomoverlay <path_to_config>` - добавить пользовательский оверлей на локальный узел. Обратите внимание, что эта конфигурация должна быть в формате отличном от конфигурации для mytonctrl:
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
- `delcustomoverlay <name>` - удалить пользовательский оверлей из узла.
- `showcustomoverlays` - показать список пользовательских оверлеев, о которых знает узел.





================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/faq.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/faq.mdx
================================================
# ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Использование каталога MyTonCtrl

MyTonCtrl является оболочкой, которая хранит свои файлы в двух местах:

1. `~/.local/share/mytonctrl/` - здесь хранятся долгосрочные файлы, такие как журналы.
2. `/tmp/mytonctrl/` - здесь хранятся временные файлы.

MyTonCtrl также включает в себя другой скрипт, mytoncore, который, в свою очередь, хранит файлы в следующих местах:

1. `~/.local/share/mytoncore/` - здесь хранятся постоянные файлы, основная конфигурация.
2. `/tmp/mytoncore/` - здесь хранятся временные файлы, параметры, используемые для выборов.

MyTonCtrl загружает исходный код для себя и валидатора в следующие каталоги:

1. `/usr/src/mytonctrl/`
2. `/usr/src/ton/`

MyTonCtrl компилирует компоненты валидатора в следующий каталог:

1. `/usr/bin/ton/`

MyTonCtrl создает рабочий каталог для валидатора здесь:

1. `/var/ton/`

---

## Если MyTonCtrl был установлен под root пользователем

Конфигурации будут храниться по-другому:

1. `/usr/local/bin/mytonctrl/`
2. `/usr/local/bin/mytoncore/`

---

## Как удалить MyTonCtrl

Запустите скрипт от имени администратора и удалите скомпилированные компоненты TON:

```bash
sudo bash /usr/src/mytonctrl/scripts/uninstall.sh
sudo rm -rf /usr/bin/ton
```

Во время этого процесса убедитесь, что у вас достаточно прав для удаления или изменения этих файлов или каталогов.

## Изменение каталога с помощью MyTonCtrl

### Изменение рабочего каталога валидатора перед установкой

Если вы хотите изменить рабочий каталог валидатора перед установкой, это можно сделать двумя способами:

1. **Создать форк проекта** - Вы можете создать форк проекта и внести в него свои изменения. Узнайте, как создать форк проекта с помощью `man git-fork`.
2. **Создать символьную ссылку** - Вы также можете создать символьную ссылку с помощью следующей команды:

   ````
   ```bash
   ln -s /opt/ton/var/ton
   ```
   ````

   Эта команда создаст ссылку `/var/ton`, которая указывает на `/opt/ton`.

### Изменение рабочего каталога валидатора после установки

Если вы хотите изменить рабочий каталог валидатора с `/var/ton/`, выполните следующие действия:

1. **Остановка служб** - Вам нужно будет остановить службы с помощью этих команд:

   ```bash
   systemctl stop validator.service
   systemctl stop mytoncore.service
   ```

2. **Перемещение файлов валидатора** - Затем вам нужно переместить файлы валидатора с помощью этой команды:

   ```bash
   mv /var/ton/* /opt/ton/
   ```

3. **Обновление путей конфигурации** - Замените пути в конфигурации, находящиеся по адресу `~/.local/share/mytoncore/mytoncore.db`.

4. **Примечание** - Опыта такого переноса нет, поэтому учтите это, когда будете двигаться дальше.

Не забудьте убедиться, что у вас есть достаточные права для внесения этих изменений или запуска этих команд.

## Понимание состояния валидатора и перезапуск валидатора в MyTonCtrl

Этот документ поможет вам понять, как подтвердить, что MyTonCtrl стал полноценным валидатором, и как перезапустить ваш валидатор.

## Перезапуск вашего валидатора

Если вам нужно перезапустить ваш валидатор, вы можете это сделать, запустив следующую команду:

```bash
systemctl restart validator.service
```

Убедитесь, что у вас достаточно прав для выполнения этих команд и внесения необходимых изменений. Всегда помните о резервном копировании важных данных перед выполнением операций, которые могут потенциально повлиять на ваш валидатор.

## См. также

- [Устранение неполадок](/v3/guidelines/nodes/nodes-troubleshooting)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-private-alerting.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-private-alerting.md
================================================
# Частный бот уведомлений MyTonCtrl

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Общие сведения

Частный бот уведомлений MyTonCtrl — это инструмент, который позволяет вам получать уведомления о состоянии вашего узла через бота Telegram.
Он является частью набора инструментов MyTonCtrl и доступен как для валидаторов, так и для liteserver. Для этого требуется создать отдельный частный бот в Telegram и настроить его в MyTonCtrl. Один бот может использоваться для мониторинга нескольких узлов.

## Настройка

Чтобы настроить бота оповещений MyTonCtrl, выполните следующие действия:

### Подготовка бота

1. Перейдите на https://t.me/BotFather и создайте бота с помощью команды `/newbot`. После этого вы получите `BotToken`.
2. Перейдите к своему боту и нажмите кнопку `Start`. Это позволит вам получать сообщения от бота.
3. Если вы хотите получать сообщения от бота в группе (чате), добавьте бота в группу и дайте ему необходимые права (сделайте администратором группы).
4. Перейдите по адресу https://t.me/getmyid_bot и нажмите кнопку `Start`. Он ответит вам с вашим `ChatId`, используйте его, если хотите получать сообщения напрямую на свой аккаунт Telegram.
   Если вы хотите получать сообщения в группе, добавьте бота в группу, и он ответит с `ChatId` группы.

### Включить бота оповещений

1. Включите `alert-bot` с помощью команды

   ```bash
   MyTonCtrl> enable_mode alert-bot
   ```

2. Включите команду

   ```bash
   MyTonCtrl> set BotToken <BotToken>
   ```

3. Включите команду

   ```bash
   MyTonCtrl> set ChatId <ChatId>
   ```

4. Проверьте, может ли бот отправлять сообщения, выполнив команду

   ```bash
   MyTonCtrl> test_alert
   ```

   Вы должны получить сообщение от бота в своем аккаунте Telegram или чате.

## Поддерживаемые оповещения

Бот оповещений MyTonCtrl поддерживает следующие оповещения:

- Баланс кошелька валидатора низкий
- Использование базы данных узла превышает 80%
- Использование базы данных узла превышает 95%
- Валидатор показал низкую эффективность в раунде
- Узел не синхронизирован
- Узел не запущен (служба не работает)
- Узел не отвечает на ADNL-соединение
- За последние 6 часов валидатор не создал ни одного блока
- Во время предыдущего раунда проверки валидатор был заблокирован
- Стейк валидатора не принят
- Стейк валидатора принят (информационное оповещение без звука)
- Стейк валидатора не возвращен
- Стейк валидатора возвращен (информационное оповещение без звука)
- Существует активное предложение в сети, которое набрало много голосов, но не было одобрено валидатором

## Включение(отключение) оповещений

Чтобы включить или отключить оповещения, используйте следующие команды:

- Чтобы включить оповещение, используйте команду `enable_alert <alert-name>`.
- Чтобы отключить оповещение, используйте команду `disable_alert <alert-name>`.
- Чтобы проверить статус оповещений, используйте команду `list_alerts`.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-prometheus.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-prometheus.mdx
================================================
# Метрики MyTonCtrl Prometheus

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

MyTonCtrl можно настроить для предоставления метрик Prometheus для мониторинга и оповещений.
Это руководство проведет вас через процесс включения метрик Prometheus в MyTonCtrl.

### Метод доставки метрик

В настоящее время MyTonCtrl может отправлять метрики только в Prometheus из соображений безопасности.
Поэтому его следует использовать с сервисом [Prometheus Pushgateway](https://github.com/prometheus/pushgateway).

## Настройка

:::caution
Для валидаторов настоятельно рекомендуется запускать Prometheus и Pushgateway на отдельном сервере.
:::

1. Установите Pushgateway

   Вы можете установить службу Pushgateway, следуя инструкциям в [официальной документации](https://github.com/prometheus/pushgateway?tab=readme-ov-file#run-it).
   Самый простой способ сделать это — через docker:

   ```bash
   docker pull prom/pushgateway
   docker run -d -p 9091:9091 prom/pushgateway
   ```

2. Настройте Prometheus

   Создайте файл `prometheus.yml`, добавив задание Pushgateway в раздел scrape_configs. Пример файла конфигурации:

   ```yaml
   global:
     scrape_interval: 15s
     evaluation_interval: 15s

   scrape_configs:
     - job_name: "prometheus"
       static_configs:
         - targets: ["localhost:9090"]

     - job_name: "pushgateway"
       honor_labels: true
       static_configs:
         - targets: ["localhost:9091"]  # or "host.docker.internal:9091" if you are using Docker
   ```

3. Установите Prometheus

   Вы можете установить Prometheus, следуя инструкциям в [официальной документации](https://prometheus.io/docs/prometheus/latest/installation/).
   Самый простой способ сделать это — через docker:

   ```bash
   docker volume create prometheus-data
   docker run -d \
     --add-host host.docker.internal:host-gateway \
     -p 9090:9090 \
     -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
     -v prometheus-data:/prometheus \
     prom/prometheus
   ```

4. Настройте MyTonCtrl

   Включите режим `prometheus` в MyTonCtrl:

   ```bash
   MyTonCtrl> enable_mode prometheus
   ```

   Установите URL-адрес Pushgateway:

   ```bash
   MyTonCtrl> set prometheus_url http://<host>:9091/metrics/job/<jobname>
   ```

   :::предупреждение
   Обратите внимание, что очень важно использовать разные имена заданий для разных узлов, если вы хотите отслеживать несколько узлов с помощью одного и того же экземпляра Prometheus.
   :::

5. Проверьте показатели

   Вы можете проверить, собирает ли Prometheus показатели, открыв веб-интерфейс Prometheus:

   ```bash
   http://<host>:9090/targets
   ```



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-remote-controller.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-remote-controller.md
================================================
# Удаленное управление MyTonCtrl

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

MyTonCtrl и ноду TON можно использовать на отдельных машинах. Есть некоторые преимущества использования этого:

- Для участия в выборах MyTonCtrl требуется закрытый ключ кошелька валидатора. Если сервер узла скомпрометирован, это может привести к несанкционированному доступу к средствам кошелька. В качестве меры безопасности MyTonCtrl может быть размещен на отдельном сервере.
- MyTonCtrl постоянно расширяет свою функциональность, что может потреблять ресурсы, критически важные для узла.
- Вероятно, в будущем крупные валидаторы смогут размещать несколько экземпляров MyTonCtrl, управляющих несколькими узлами на одном сервере.

## Настройка

Подготовьте 2 сервера: один для запуска узла TON, отвечающего требованиям, и один для запуска MyTonCtrl, который не требует много ресурсов.

1. Узел сервера:

Установите MyTonCtrl в режиме `only-node`:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -m validator -l
```

Он установит узел TON и создаст файл резервной копии, который вам необходимо загрузить и перенести на сервер контроллера:

```log
...
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start CreateSymlinks fuction
Local DB path: /home/user/.local/share/mytoncore/mytoncore.db
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start ConfigureOnlyNode function
[1/2] Copied files to /tmp/mytoncore/backupv2
[2/2] Backup successfully created in mytonctrl_backup_hostname_timestamp.tar.gz!
If you wish to use archive package to migrate node to different machine please make sure to stop validator and mytoncore on donor (this) host prior to migration.
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Backup successfully created. Use this file on the controller server with `--only-mtc` flag on installation.
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Start/restart mytoncore service
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  sleep 1 sec
[5/5] Mytonctrl installation completed
```

Обратите внимание, что у вас все еще есть доступ к консоли MyTonCtrl на этом сервере, которая вам нужна для обновления узла, просмотра метрик узла и т. д.
Кроме того, он создает службу `mytoncore`, которая используется для отправки телеметрии (если она не была отключена).
Если вы хотите вернуть управление узлом этому серверу, используйте команду

```bash
MyTonCtrl> set onlyNode false
systemctl restart mytoncore
```

2. Контроллер сервера

Установите MyTonCtrl в режиме `only-mtc`:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -p /home/user/mytonctrl_backup_hostname_timestamp.tar.gz -o
```

Выполните команду `status`, должно появиться поле `IP-адрес узла`:

```log
MyTonCtrl> status
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetValidatorWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetLocalWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetWalletFromFile function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start WalletVersion2Wallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetDbSize function
===[ Node status ]===
Node IP address: 0.0.0.0
Validator index: n/a
...
```

## Примечания

При обновлениях вам необходимо `update` и `upgrade` как сервер узла, так и сервер контроллера



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/monitoring/performance-monitoring.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/monitoring/performance-monitoring.mdx
================================================
# Мониторинг производительности

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Мониторинг производительности сервера TON

Такие инструменты, как `htop`, `iotop`, `iftop`, `dstat`, `nmon` и другие, подходят для измерения производительности в реальном времени, но их функционала не хватает для изучения проблем производительности в прошлом.

Это руководство рекомендует и объясняет, как использовать утилиту Linux sar (System Activity Report) для мониторинга производительности сервера TON.

:::tip
Эта рекомендация помогает определить, испытывает ли Ваш сервер нехватку ресурсов, а не то, что движок валидатора работает плохо.
:::

### Установка

#### Установка SAR

```bash
sudo apt-get install sysstat
```

#### Включение автоматического сбора статистики

```bash
sudo sed -i 's/false/true/g' /etc/default/sysstat
```

#### Включение сервиса

```bash
sudo systemctl enable sysstat sysstat-collect.timer sysstat-summary.timer
```

#### Запуск сервиса

```bash
sudo systemctl start sysstat sysstat-collect.timer sysstat-summary.timer
```

### Использование

По умолчанию sar собирает статистику каждые 10 минут и показывает статистику за текущий день, начиная с полуночи. Это можно проверить, запустив sar без параметров:

```bash
sar
```

Чтобы увидеть статистику за предыдущий день или за два дня до текущего, передайте число в качестве опции:

```bash
sar -1   # previous day
sar -2   # two days ago
```

Для точной даты используйте опцию f, с указанием файла определенного дня месяца. Таким образом, для 23 сентября это будет:

```bash
sar -f /var/log/sysstat/sa23
```

Какие отчеты sar нужно запускать и как их читать, чтобы выявить проблемы с производительностью?

Ниже приведен список команд sar, которые можно использовать для сбора различной системной статистики. Вы можете дополнить их приведенными выше параметрами, чтобы быстро получить отчет за нужную дату.

### Отчет о памяти

```bash
sar -rh
```

Поскольку движок валидатора TON использует функцию jemalloc, он кэширует много данных. По этой причине команда sar -rh чаще всего возвращает низкое число в колонке `%memused`.

В то же время, в колонке `kbcached` всегда будет высокое число. По той же причине Вам не стоит беспокоиться о низком количестве свободной оперативной памяти, показанном в колонке `kbmemfree`. Однако важным показателем является число, полученное из столбца `%memused`.

Если оно превышает 90%, Вам следует задуматься о добавлении большего объема оперативной памяти и следить за тем, не останавливается ли движок валидатора по причине OOM (out of memory - нехватка памяти) - лучший способ проверить это - поискать сообщения Signal в файле `/var/ton-work/log`.

Использование свопа

```bash
sar -Sh
```

Если Вы заметили, что используется своп, желательно увеличить объём оперативной памяти. В целом, команда TON Core рекомендует отключить своп.

### Отчет по процессору

```bash
sar -u
```

Если Ваш сервер в среднем использует процессор на 70% (см. колонку '%user'), это можно считать хорошим показателем.

### Отчет об использовании диска

```bash
sar -dh
```

Следите за колонкой '%util' и реагируйте соответственно, если она остается выше 90% для определенного диска.

### Сетевой отчет

```bash
sar -n DEV -h
```

или

```bash
sar -n DEV -h --iface=<interface name>
```

если Вы хотите отфильтровать результаты по имени сетевого интерфейса.

Обратить внимание на колонку `%ifutil` - она показывает использование Вашего интерфейса с учетом его максимальной скорости соединения.

Вы можете узнать, какую скорость поддерживает Ваша сетевая карта, выполнив команду:

```bash
cat /sys/class/net/<interface>/speed
```

:::info
Это не скорость соединения от провайдера.
:::

Подумайте о повышении скорости соединения, если `%ifutil` говорит об использовании выше 70%, или колонки rxkB/s и txkB/s показывают значения близкие к пропускной способности, предоставляемой Вашим провайдером.

### Сообщение о проблеме производительности

Прежде чем сообщать о проблемах с производительностью, убедитесь, что минимальные требования к узлу удовлетворены. Затем выполните следующие команды:

```bash
sar -rudh | cat && sar -n DEV -h --iface=eno1 | cat > report_today.txt
```

Для вчерашнего отчета выполните:

```bash
sar -rudh -1 | cat && sar -n DEV -h --iface=eno1 -1 | cat > report_yesterday.txt
```

Также остановите узел TON и измерьте скорость дискового ввода-вывода и скорость сети.

```bash
sudo fio --randrepeat=1 --ioengine=io_uring --direct=1 --gtod_reduce=1 --name=test --filename=/var/ton-work/testfile --bs=4096 --iodepth=1 --size=40G --readwrite=randread --numjobs=1 --group_reporting
```

Найдите значение `read: IOPS=` и отправьте его вместе с отчетом. Значение выше 10k IOPS должно считаться хорошим.

```bash
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 -
```

Скорость загрузки и выгрузки свыше 700 Мбит/с должна считаться хорошей.

При составлении отчета, пожалуйста, отправьте отчет SAR, а также результаты IOPS и скорости сети на [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).

Первоначальная версия от [@neodix](https://t.me/neodix) - Команда Ton Core, 23 сентября 2024 г.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/node-maintenance-and-security.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/node-maintenance-and-security.md
================================================
# Обслуживание и безопасность

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## <a id="introduction"></a>Введение

В этом руководстве представлена ​​базовая информация об обслуживании и защите узлов валидатора TON.

В этом документе предполагается, что валидатор установлен с использованием конфигурации и инструментов **[рекомендованных TON Foundation](/v3/guidelines/nodes/running-nodes/full-node)**, н но общие концепции применимы и к другим сценариям и могут быть полезны для опытных системных администраторов.

## <a id="maintenance"></a>Техническое обслуживание

### <a id="database-grooming"></a>Уход за базой данных

Узел TON хранит свою базу данных в пределах пути, указанного флагом `--db validator-engine`, обычно `/var/ton-work/db`. Чтобы уменьшить размер базы данных, вы можете уменьшить TTL (время жизни) некоторых сохраненных данных.

Текущие значения TTL можно найти в файле службы узла (путь по умолчанию — `/etc/systemd/system/validator.service`). Если вы используете MyTonCtrl, вы можете использовать команду `installer status`. Если какие-либо из значений не установлены, то используются стандартные значения.

### archive-ttl

`archive-ttl` - это параметр, который определяет время жизни для блоков. Стандартное значение — 604800 секунд (7 дней). Вы можете уменьшить это значение для сжатия базы данных.

```bash
MyTonCtrl> installer set_node_argument --archive-ttl <value>
```

Если вы не используете MyTonCtrl, вы можете отредактировать файл службы узла.

### state-ttl

`state-ttl` - это параметр, который определяет время жизни состояний блоков. Значение по умолчанию — 86400 секунд (24 часа). Вы можете уменьшить это значение для сжатия базы данных, но для валидаторов крайне рекомендуется использовать стандартное значение (не устанавливайте флаг).
Также это значение должно быть больше продолжительности периода валидации (значение можно найти в [15-м параметре конфигурации](https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-15)).

```bash
MyTonCtrl> installer set_node_argument --state-ttl <value>
```

Если вы не используете MyTonCtrl, вы можете отредактировать файл службы узла.

### <a id="backups"></a>Резервное копирование

Самый простой и эффективный способ сделать резервную копию валидатора — скопировать важные файлы конфигурации узла, ключи и настройки mytonctrl:

- Файл конфигурации узла: `/var/ton-work/db/config.json`
- Закрытый ключ узла: `/var/ton-work/db/keyring`
- Открытый ключ узла: `/var/ton-work/keys`
- Конфигурация и кошельки mytonctrl: `$HOME/.local/share/myton*`, где $HOME - домашний каталог пользователя, который начал установку mytonctrl **или** `/usr/local/bin/mytoncore`, если вы установили mytonctrl как root.

Этот набор — все, что вам нужно для восстановления вашего узла с нуля.

#### Снимки

Современные файловые системы, такие как ZFS, предлагают функцию снимков, большинство поставщиков облачных услуг также позволяют своим клиентам делать снимки своих машин, во время которых весь диск сохраняется для будущего использования.

Проблема с обоими методами заключается в том, что вы должны остановить узел перед выполнением снимка, невыполнение этого требования, скорее всего, приведет к повреждению базы данных с неожиданными последствиями. Многие поставщики облачных услуг также требуют, чтобы вы выключали машину перед выполнением снимка.

Такие остановки не следует выполнять часто, если вы делаете снимок своего узла раз в неделю, то в худшем случае после восстановления у вас будет узел с недельной базой данных, и вашему узлу потребуется больше времени, чтобы догнать сеть, чем для выполнения новой установки с использованием функции mytonctrl "install from dump" (флаг -d добавляется во время вызова скрипта install.sh).

### <a id="disaster-recovery"></a>Аварийное восстановление

Чтобы выполнить восстановление вашего узла на новой машине:

#### Установите mytonctrl / node

Для самого быстрого запуска узла добавьте ключ `-d` при вызове скрипта установки.

#### Переключитесь на пользователя root

```sh
sudo -s
```

#### Остановите процессы mytoncore и validator

```sh
systemctl stop validator
systemctl stop mytoncore
```

#### Примените резервные копии файлов конфигурации узла

- Файл конфигурации узла: `/var/ton-work/db/config.json`
- Закрытый ключ узла: `/var/ton-work/db/keyring`
- Открытый ключ узла: `/var/ton-work/keys`

#### <a id="set-node-ip"></a> Установите IP-адрес узла

Если у вашего нового узла другой IP-адрес, то вы должны отредактировать файл конфигурации узла `/var/ton-work/db/config.json` и установить `.addrs[0].ip` в **десятичное** значение нового IP-адреса. Вы можете использовать **[этот](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)** скрипт Python для преобразования вашего IP в десятичное значение.

#### Убедитесь, что у вас правильные разрешения на использование базы данных

```sh
chown -R validator:validator /var/ton-work/db
```

#### Примените файлы конфигурации mytonctrl из резервной копии

Замените `$HOME/.local/share/myton*`, где $HOME - домашний каталог пользователя, который начал установку mytonctrl, на резервную копию содержимого, убедитесь, что пользователь является владельцем всех копируемых файлов.

#### Запустите процессы mytoncore и validator

```sh
systemctl start validator
systemctl start mytoncore
```

## <a id="security"></a>Безопасность

### <a id="host-security"></a>Безопасность на уровне хоста

Безопасность на уровне хоста — это огромная тема, которая выходит за рамки этого документа, однако мы рекомендуем вам никогда не устанавливать mytonctrl под пользователем root, используйте учетную запись службы для обеспечения разделения привилегий.

### <a id="network-security"></a>Безопасность на сетевом уровне

Валидаторы TON — это ценные активы, которые следует защищать от внешних угроз, один из первых шагов, которые вы должны предпринять, — сделать свой узел максимально невидимым, это означает блокировку всех сетевых подключений. На узле валидатора только UDP-порт, используемый для операций узла, должен быть открыт для Интернета.

#### Инструменты

Мы будем использовать интерфейс брандмауэра **[ufw](https://help.ubuntu.com/community/UFW)**, а также JSON процессор для командной строки **[jq](https://github.com/stedolan/jq)**.

#### Управление сетями

Как оператор узла, вам необходимо сохранить полный контроль и доступ к машине, для этого вам нужен как минимум один фиксированный IP-адрес или диапазон адресов.

Мы также советуем вам настроить небольшой VPS-сервер "jumpstation" с фиксированным IP-адресом, который вы сможете использовать для доступа к заблокированным машинам, если у вас нет фиксированного IP-адреса дома/в офисе, или для добавления альтернативного способа доступа к защищенным машинам в случае потери основного IP-адреса.

#### Установите ufw и jq1

```sh
sudo apt install -y ufw jq
```

#### Базовая настройка сетевого фильтра при помощи UFW

```sh
sudo ufw default deny incoming; sudo ufw default allow outgoing
```

#### Отключение автоматического приема ICMP-запросов

```sh
sudo sed -i 's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g' /etc/ufw/before.rules
```

#### Включите полный доступ из сетей управления

```sh
sudo ufw insert 1 allow from <MANAGEMENT_NETWORK>
```

повторите указанную выше команду для каждой сети управления/адреса.

#### Откройте порт UDP узла/валидатора для общего доступа

```sh
sudo ufw allow proto udp from any to any port `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```

#### Перепроверьте сети управления

<mark>Важно</mark>: перед включением брандмауэра дважды проверьте, что вы добавили правильные адреса управления!

#### Включите брандмауэр ufw

```sh
sudo ufw enable
```

#### Проверьте состояние

Чтобы проверить состояние брандмауэра, используйте следующую команду:

```sh
    sudo ufw status numbered
```

Вот пример вывода заблокированного узла с двумя сетями управления/адресами:

```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_A>/28
[ 2] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_B>/32
[ 3] <NODE_PORT>/udp            ALLOW IN    Anywhere
[ 4] <NODE_PORT>/udp (v6)       ALLOW IN    Anywhere (v6)
```

#### Откройте порт LiteServer

```sh
sudo ufw allow proto tcp from any to any port `sudo jq -r '.liteservers[0].port' /var/ton-work/db/config.json`
```

Обратите внимание, что порт LiteServer не должен быть открыт публично на валидаторе.

#### Дополнительная информация о UFW

См. это превосходное **[руководство по ufw](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)** от Digital Ocean для получения дополнительной информации о магии ufw.

### <a id="ip-switch"></a>Переключение IP-адреса

Если вы считаете, что ваш узел подвергся атаке, вам следует рассмотреть возможность смены IP-адреса. Способ переключения зависит от вашего хостинг-провайдера; вы можете предварительно заказать второй адрес, клонировать **остановленную** виртуальную машину в другой экземпляр или настроить новый экземпляр, выполнив процесс **[аварийного восстановления](#disaster-recovery)**.

В любом случае убедитесь, что вы **[установили свой новый IP-адрес](/v3/guidelines/nodes/node-maintenance-and-security#-set-node-ip-address)** в файле конфигурации узла!



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/nodes-troubleshooting.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/nodes-troubleshooting.md
================================================
# Устранение неполадок

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом разделе содержатся ответы на наиболее часто задаваемые вопросы о работе узлов.

## Не удалось получить состояние учетной записи

```
Failed to get account state
```

Эта ошибка указывает на то, что при поиске этой учетной записи в состоянии шарда возникли проблемы.
Скорее всего, это означает, что узел liteserver синхронизируется слишком медленно, а синхронизация Masterchain обгоняет синхронизацию shardchain (Basechain). В этом случае узел знает последний блок Masterchain, но не может проверить состояние учетной записи в последнем блоке shardchain, что приводит к ошибке "Failed to get account state".

## Не удалось распаковать состояние учетной записи

```
Failed to unpack account state
```

Эта ошибка означает, что запрошенная учетная запись не существует в текущем состоянии. Это означает, что эта учетная запись одновременно не развернута и имеет нулевой баланс

## Отсутствие прогресса в синхронизации узла в течение 3 часов

Попробуйте выполнить следующие проверки:

1. Запущен ли процесс без сбоев? (Проверьте статус процесса systemd)
2. Есть ли брандмауэр между узлом и интернетом, если да, будет ли он передавать входящий трафик UDP на порт, указанный в поле `addrs[0].port` файла `/var/ton-work/db/config.json`?
3. Есть ли NAT между машиной и Интернетом? Если да, убедитесь, что IP-адрес, указанный в поле `addrs[0].ip` файла `/var/ton-work/db/config.json`, соответствует реальному публичному IP машины. Обратите внимание, что значение этого поля задается в виде подписанного INT. Для выполнения преобразований можно использовать скрипты `ip2dec` и `dec2ip`, расположенные в [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node).

## Архивный узел не синхронизирован даже через 5 дней после процесса синхронизации

Пройдитесь по контрольному списку [из этого раздела](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours).

## Возможные причины медленной синхронизации

Диск относительно слабый. Рекомендуется проверить IOPS диска (иногда хостинг-провайдеры преувеличивают эти цифры).

## Не удалось применить внешнее сообщение к текущему состоянию: Внешнее сообщение было отклонено

```
Cannot apply external message to current state : External message was not accepted
```

Эта ошибка означает, что контракт не принял внешнее сообщение. Вам нужно найти exitcode в трассировке. -13 означает, что у аккаунта недостаточно TON для принятия сообщения (или требуется больше, чем gas_credit). В случае контрактов кошельков код выхода=33 означает неверный seqno (вероятно, данные seqno, которые вы используете, устарели), код выхода=34 означает неверный subwallet_id (для старых кошельков v1/v2 это означает неверную подпись), код выхода=35 означает, что либо сообщение устарело, либо подпись неверна.

## Что означает ошибка 651?

`[Error : 651 : no nodes]` указывает на то, что ваш узел не может найти другой узел в блокчейне TON.

Иногда этот процесс может занять до 24 часов. Однако, если вы получали эту ошибку в течение нескольких дней, это означает, что ваш узел не может синхронизироваться через текущее сетевое соединение.

:::tip Решение

Оно должно разрешать входящие соединения на одном определенном порту и исходящие соединения с любого порта.
:::

## Консоль валидатора не настроена

Если Вы столкнулись с ошибкой `Validator console is not settings`, это означает, что вы запускаете MyTonCtrl от имени пользователя, отличного от того, которого вы использовали для установки.

:::tip Решение

```bash
mytonctrl
```

:::

\###Запуск MyTonCtrl от имени другого пользователя

Запуск MyTonCtrl от имени другого пользователя может вызвать следующую ошибку:

```bash
Error: expected str, bytes or os.PathLike object, not NoneType
```

Чтобы устранить эту ошибку, вы должны запустить MyTonCtrl от имени пользователя, который установил его.

## Что означает "block is not applied"?

**Вопрос:** Иногда мы получаем ошибку `block is not applied` или `block is not ready` для различных запросов - это нормально?

**Ответ:** Это нормально, обычно это означает, что вы пытались получить блок, который не достигает указанного вами узла.

**Вопрос:** Если появляется сравнительная частота, означает ли это, что где-то есть проблема?

**Ответ:** Нет. Вам нужно проверить значение "Local validator out of sync"" в mytonctrl. Если оно меньше 20 секунд, то все в порядке.

Но вам нужно помнить, что узел постоянно синхронизируется. Иногда вы можете попытаться получить блок, который не достиг указанного вами узла.

Вам нужно повторить запрос с небольшой задержкой.

## Проблема Out of Sync с флагом -d

Если вы столкнулись с проблемой, когда рассинхронизация равна временной метке после загрузки `MyTonCtrl` с флагом `-d`, возможно, дамп был установлен неправильно (или он уже устарел).

:::tip Решение
Рекомендуемое решение - переустановить `MyTonCtrl` заново с новым дампом.
:::

Если синхронизация занимает слишком много времени, возможно, возникли проблемы с дампом. Пожалуйста, [свяжитесь с нами](https://t.me/SwiftAdviser) для получения помощи.

Пожалуйста, запустите `mytonctrl` от имени пользователя, под которым вы его установили.

## Error command... timed out after 3 seconds

Эта ошибка означает, что локальный узел еще не синхронизирован (разрыв синхронизации меньше 20 секунд) и используются публичные узлы.
Публичные узлы не всегда отвечают и заканчиваются ошибкой превышения времени ожидания.

:::tip Решение
Решение проблемы — дождаться синхронизации локального узла или выполнить одну и ту же команду несколько раз перед выполнением.
:::

## Команда Status отображается без раздела локального узла

![](/img/docs/full-node/local-validator-status-absent.png)

Если в статусе узла нет раздела локального узла, обычно это означает, что что-то пошло не так во время установки и шаг создания/назначения кошелька валидатора был пропущен.
Также проверьте, указан ли кошелек валидатора.

Проверьте следующее:

```bash
mytonctrl> get validatorWalletName
```

Если validatorWalletName равен null, выполните следующее:

```bash
mytonctrl> set validatorWalletName validator_wallet_001
```

## Перенос валидатора на новый сервер

:::info
Перенесите все ключи и конфигурации со старого узла на рабочий узел и запустите его. В случае, если на новом сервере что-то пойдет не так, все равно будет источник, где все уже настроено.
:::

Лучший способ (хотя штраф за временное отсутствие валидации невелик, это можно сделать без перерыва):

1. Выполните чистую установку на новом сервере с помощью `mytonctrl` и дождитесь, пока все синхронизируется.

2. Остановите службы `mytoncore` и валидатора `services` на обеих машинах, сделайте резервные копии на исходной машине и на новой:

- 2.1 `/usr/local/bin/mytoncore/...`
- 2.2 `/home/${user}/.local/share/mytoncore/...`
- 2.3 `/var/ton-work/db/config.json`
- 2.4 `/var/ton-work/db/config.json.backup`
- 2.5 `/var/ton-work/db/keyring`
- 2.6 `/var/ton-work/keys`

3. Перенесите исходное содержимое на новый узел (замените содержимое):

- 3.1 `/usr/local/bin/mytoncore/...`
- 3.2 `/home/${user}/.local/share/mytoncore/...`
- 3.3 `/var/ton-work/db/config.json`
- 3.4 `/var/ton-work/db/keyring`
- 3.5 `/var/ton-work/keys`

4. В файле `/var/ton-work/db/config.json` замените `addrs[0].ip` на текущий IP-адрес, который был после установки (его можно увидеть в резервной копии `/ton-work/db/config.json.backup`)

5. Проверьте права доступа ко всем замененным файлам

6. На новом сервере запустите службы mytoncore и validator. Убедитесь, что узел синхронизируется и выполняет валидацию

7. Создайте резервную копию:

```bash
cp var/ton-work/db/config.json var/ton-work/db/config.json.backup
```

## Mytonctrl был установлен другим пользователем. Возможно, вам нужно запустить mtc с помощью пользователя ...

Запустите MyTonCtrl под пользователем, который использовался для его установки.

Например, наиболее распространенным случаем является попытка запуска MyTonCtrl от имени пользователя root, хотя он был установлен другим пользователем. В этом случае вам нужно войти в аккаунт пользователя, который установил Mytonctrl, и запустить MyTonCtrl от этого пользователя.

### Mytonctrl was installed by another user. Probably you need to launch mtc with `validator` user

Выполните команду `sudo chown <user_name>:<user_name> /var/ton-work/keys/*`, где `<user_name>` - это имя пользователя, который установил mytonctrl.

### Mytonctrl was installed by another user. Probably you need to launch mtc with `ubuntu` user

Кроме того, из-за этой ошибки `mytonctrl` может работать неправильно. Например, команда `status` может возвращать пустой результат.

Проверьте владельца `mytonctrl`:

```bash
ls -lh /var/ton-work/keys/
```

Если владелец — пользователь `root`, [удалите](/v3/guidelines/nodes/running-nodes/full-node#uninstall-mytonctrl) `mytonctrl` и [установите](/v3/guidelines/nodes/running-nodes/full-node#run-a-node-text) его снова **используя пользователя без прав root**.

Иначе выйдите из текущего пользователя (если используется ssh-соединение, разорвите его) и войдите в систему под правильным пользователем.

Сообщение должно исчезнуть.

## Запуск консоли MyTonCtrl прерывается после сообщения "Found new version of mytonctrl! Migrating!"

Известны два случая, когда эта ошибка появляется:

### Ошибка после обновления MytonCtrl

- Если MyTonCtrl был установлен пользователем root: удалите файл `/usr/local/bin/mytonctrl/VERSION`.
- Если MyTonCtrl был установлен не пользователем root: удалите файл `~/.local/share/mytonctrl/VERSION`.

### Ошибка во время установки MytonCtrl

`MytonCtrl` может запускаться, но узел будет работать неправильно. Пожалуйста, удалите `MytonCtrl` с вашего компьютера и установите его снова, убедитесь в решении всех ранее возникших ошибок.

## См. также

- [Часто задаваемые вопросы по MyTonCtrl](/v3/guidelines/nodes/faq)
- [Ошибки MyTonCtrl](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/overview.md
================================================
# Общие сведения

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

На этой странице собраны некоторые рекомендации, которым можно следовать для управления узлами в блокчейне TON.

- [Типы узлов в сети TON](/v3/documentation/infra/nodes/node-types)

## Запуск узла TON

- [Запуск узла валидатора](/v3/guidelines/nodes/running-nodes/validator-node)
- [Запуск полного узла](/v3/guidelines/nodes/running-nodes/full-node)
- [Запуск liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node)
- [Запуск архивного узла](/v3/guidelines/nodes/running-nodes/archive-node)

## Техническое обслуживание

Если у вас возникают проблемы с запуском узлов, рекомендуется ознакомиться с следующими статьями.

- [Устранение неполадок](/v3/guidelines/nodes/nodes-troubleshooting)
- [Техническое обслуживание и безопасность](/v3/guidelines/nodes/node-maintenance-and-security)
- [Часто задаваемые вопросы](/v3/guidelines/nodes/faq)




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/persistent-states.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/persistent-states.md
================================================
# Долгосрочные состояния

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Узлы регулярно сохраняют снимки состояний блокчейна. Каждое состояние создается на определенном блоке мастерчейна и имеет некоторые сроки действия (TTL). Блок и TTL выбираются с использованием следующего алгоритма:

Можно выбрать только ключевые блоки. Блок имеет некоторую временную метку `ts`. Существуют периоды времени длиной `2^17` секунд (приблизительно до 1,5 дней). Период блока с временной меткой `ts` равен `x = floor(ts / 2^17)`. Для создания долгосрочного состояния выбирается первый ключевой блок из каждого периода.

Срок действия (TTL) состояния из периода `x` равен `2^(18 + ctz(x))`, где `ctz(x)` - это количество конечных нулей в двоичном представлении `x` (т.е. наибольшее `y` такое, что `x` делится на `2^y`).

Это означает, что долгосрочные состояния создаются каждые 1,5 дня, половина из них имеет TTL в `2^18` секунд (3 дня), половина оставшихся состояний имеет TTL в `2^19` секунд (6 дней) и так далее.

В 2024 году следующие долгосрочные состояния будут действовать на протяжении минимум трех месяцев:

|                                                                                              Block seqno |                                          Block time |        TTL |                                       Срок действия |
| -------------------------------------------------------------------------------------------------------: | --------------------------------------------------: | ---------: | --------------------------------------------------: |
|   [8930706](https://explorer.toncoin.org/search?workchain=-1\\&shard=8000000000000000\\&seqno=8930706) | 2021-01-14 15:08:40 | 12427 дней | 2055-01-24 08:45:44 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1\\&shard=8000000000000000\\&seqno=27747086) | 2023-03-02 05:08:11 |   1553 дня | 2027-06-02 19:50:19 |
| [32638387](https://explorer.toncoin.org/search?workchain=-1\\&shard=8000000000000000\\&seqno=32638387) | 2023-09-12 09:27:36 |   388 дней | 2024-10-04 18:08:08 |
| [34835953](https://explorer.toncoin.org/search?workchain=-1\\&shard=8000000000000000\\&seqno=34835953) | 2023-12-18 11:37:48 |    194 дня | 2024-06-29 15:58:04 |
| [35893070](https://explorer.toncoin.org/search?workchain=-1\\&shard=8000000000000000\\&seqno=35893070) | 2024-02-05 00:42:50 |    97 дней | 2024-05-12 02:52:58 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1\\&shard=8000000000000000\\&seqno=36907647) | 2024-03-24 13:47:57 |   776 дней | 2026-05-10 07:09:01 |

Когда узел запускается впервые, ему необходимо загрузить долгосрочное состояние. Это реализовано в файле [validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp).

Начиная с блока init, узел загружает все новые ключевые блоки. Он выбирает самый последний ключевой блок с долгосрочным состоянием, которое еще существует (используя приведенную выше формулу), а затем загружает соответствующее состояние мастерчейна для всех шардов (или только те шарды, которые требуются для этого узла).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/archive-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/archive-node.md
================================================
# Архивный узел

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Прочитайте о [Полном узле](/v3/guidelines/nodes/running-nodes/full-node) перед этой статьей
:::

## Обзор

Архивный узел - это тип полного узла, который хранит расширенные исторические данные блокчейна. Если вы создаете обозреватель блокчейна или аналогичное приложение, которому требуется доступ к историческим данным, рекомендуется использовать архивный узел в качестве индексатора.

## Требования к ОС

Мы настоятельно рекомендуем установить mytonctrl с использованием поддерживаемых операционных систем:

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## Требования к аппаратному обеспечению

- 16 x ядерный процессор
- 128ГБ ОЗУ с исправлением ошибок (ECC)
- Твердотельный накопитель объемом 9 ТБ *или* Оборудованное хранилище с более 64 000 операций ввода/вывода в секунду (IOPS)
- Возможность подключения к сети 1 Гбит/с
- 16 ТБ/месяц трафика при пиковой нагрузке
- публичный IP-адрес (фиксированный IP-адрес)

:::info Сжатие данных
Для несжатых данных требуется 9 ТБ. 6 ТБ - это при использовании тома ZFS с включенным сжатием.
Объем данных увеличивается примерно на 0,5 ТБ и 0,25 ТБ каждый месяц, с последним обновлением в ноябре 2024 года.
:::

## Установка

### Установите ZFS и подготовьте том

Дампы поставляются в виде снимков ZFS, сжатых с помощью plzip, вам необходимо установить ZFS на вашем хосте и восстановить дамп, см. в [Документацию Oracle](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc).

Обычно рекомендуется создать отдельный пул ZFS для вашего узла на выделенном SSD-диске, это позволит вам легко управлять дисковым пространством и создавать резервные копии вашего узла.

1. Установите [zfs](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview)

```shell
sudo apt install zfsutils-linux
```

2. [Создайте пул](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool) на вашем выделенном диске объемом 4 ТБ `<disk>` и назовите его `data`

```shell
sudo zpool create data <disk>
```

3. Перед восстановлением настоятельно рекомендуем включить сжатие на родительском файловой системе ZFS, что позволит вам освободить [много места](https://www.servethehome.com/the-case-for-using-zfs-compression/). Чтобы включить сжатие для тома `data`, войдите под учетной записью root и выполните следующую команду:

```shell
sudo zfs set compression=lz4 data
```

### Установите MyTonCtrl

Пожалуйста, используйте [Запуск Полного узла](/v3/guidelines/nodes/running-nodes/full-node) чтобы **установить** и **запустить** mytonctrl.

### Запустите архивный узел

#### Подготовьте узел

1. Перед выполнением восстановления вы должны остановить validator под учетной записью root:

```shell
sudo -s
systemctl stop validator.service
```

2. Сделайте резервную копию файлов конфигурации `ton-work` (нам потребуются файлы `/var/ton-work/db/config.json`, `/var/ton-work/keys` и `/var/ton-work/db/keyring`).

```shell
mv /var/ton-work /var/ton-work.bak
```

#### Скачайте дамп

1. Запросите учетные данные `user` и `password`для получения доступа к скачиванию дампов в чате [@TONBaseChatEn](https://t.me/TONBaseChatEn) в Telegram.
2. Вот пример команды для скачивания и восстановления дампа **mainnet** с сервера ton.org:

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

Чтобы установить дамп **testnet**, используйте следующую команду:

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest_testnet.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

Размер дампа составляет примерно **4 Тб**, поэтому скачивание и восстановление могут занять несколько дней (до 4 дней). Размер дампа может увеличиваться с ростом сети.

Подготовьте и выполните команду:

1. При необходимости установите инструменты (`pv`, `plzip`)
2. Замените `<usr>` и `<pwd>` вашими учетными данными
3. Сообщите `plzip` использовать столько ядер, сколько позволяет ваша машина для ускорения извлечения (`-n`)

#### Установите дамп

1. Смонтируйте zfs:

```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```

2. Восстановите `db/config.json`, `keys` и `db/keyring` из резервной копии в `/var/ton-work`.

```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```

3. Убедитесь, что разрешения для каталогов `/var/ton-work` и `/var/ton-work/keys` предоставлены правильно:

- Владельцем каталога `/var/ton-work/db` должен быть пользователь `validator`:

```shell
chown -R validator:validator /var/ton-work/db
```

- Владельцем каталога `/var/ton-work/keys` должен быть пользователь `ubuntu`:

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

#### Обновите конфигурацию

Обновите конфигурацию узла для архивного узла.

1. Откройте файл конфигурации узла `/etc/systemd/system/validator.service`.

```shell
nano /etc/systemd/system/validator.service
```

2. Добавьте настройки хранилища для узла в строке `ExecStart`:

```shell
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
```

:::info
Пожалуйста, будьте терпеливы после запуска узла и следите за логами.
Дампы не содержат кэшей DHT, поэтому вашему узлу потребуется время для поиска других узлов и синхронизации с ними.
В зависимости от возраста снимка и скорости вашего интернет-соединения, процесс восстановления может занять у вас **от нескольких часов до нескольких дней**.
**На минимальной конфигурации этот процесс может занять до 5 дней.**
Это нормально.
:::

:::caution
Если процесс синхронизации узла уже занял 5 дней, но узел все еще не синхронизирован, вам следует проверить [раздел устранения неполадок](/v3/guidelines/nodes/nodes-troubleshooting#archive-node-is-out-of-sync-even-after-5-days-of-the-syncing-process).
:::

#### Запустите узел

1. Запустите validator, выполнив команду:

```shell
systemctl start validator.service
```

2. Откройте `mytonctrl` из *local user* и проверьте состояние узла с помощью команды `status`.

## Обслуживание узла

База данных узла требует периодической очистки (мы рекомендуем проводить ее раз в неделю), для этого, пожалуйста, выполните следующие шаги под учетной записью root:

1. Остановите процесс validator (Никогда не пропускайте этот момент!)

```shell
sudo -s
systemctl stop validator.service
```

2. Удалите старые логи

```shell
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```

4. Удалите временные файлы

```shell
rm -r /var/ton-work/db/files/packages/temp.archive.*
```

5. Запустите процесс validator

```shell
systemctl start validator.service
```

## Устранение неполадок и резервное копирование

Если по какой-то причине что-то не работает или ломается, вы всегда можете [откатиться](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) к снимку @archstate в вашей файловой системе ZFS, это исходное состояние, полученное из дампа.

1. Остановите процесс валидатора (\*\*Никогда не пропускайте это! \*\*).

```shell
sudo -s
systemctl stop validator.service
```

2. Проверьте имя моментального снимка

```shell
zfs list -t snapshot
```

3. Откатить к состоянию моментального снимка

```shell
zfs rollback data/ton-work@dumpstate
```

Если ваш узел работает нормально, вы можете удалить моментальный снимок, чтобы сэкономить место на диске, но мы рекомендуем регулярно делать снимки вашей файловой системы для целей отката, поскольку известно, что узел валидатора может повреждать данные и config.json. [zfsnap](https://www.zfsnap.org/docs.html) - это отличный инструмент для автоматизации циклической обработки снимков.

:::tip Нужна помощь?
У вас есть вопросы или вам нужна помощь? Пожалуйста, задавайте вопросы в [TON Dev Chat (РУ)](https://t.me/tondev), чтобы получить помощь сообщества. Разработчики MyTonCtrl также присутствуют там.
:::

## Советы и рекомендации

### Заставьте архивный узел не хранить блоки

Чтобы заставить узел не хранить архивные блоки, используйте значение 86400. Подробнее смотрите в разделе [set_node_argument](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#set_node_argument).

```bash
installer set_node_argument --archive-ttl 86400
```

## Поддержка

Обратитесь в службу технической поддержки по ссылке [@mytonctrl_help](https://t.me/mytonctrl_help).

## См. также

- [Типы узлов TON](/v3/documentation/infra/nodes/node-types)
- [Запуск полного узла](/v3/guidelines/nodes/running-nodes/full-node)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/full-node.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/full-node.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Полный узел

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Требования к ОС

Мы настоятельно рекомендуем установить mytonctrl с использованием поддерживаемых операционных систем:

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## Требования к аппаратному обеспечению

:::caution Использование узла на персональном локальном компьютере
Не следует запускать какой-либо тип узла на вашем персональном локальном компьютере в течение длительного времени, даже если он удовлетворяет требованиям. Узлы активно используют диски и могут быстро их повредить.
:::

### С валидатором

- 16-ядерный процессор
- 128 ГБ оперативной памяти
- Твердотельный накопитель объемом 1 ТБ _или_ Оборудованное хранилище с более 64 000 операций ввода/вывода в секунду (IOPS)
- Подключение к сети со скоростью 1 Гбит/с
- Общедоступный IP-адрес (фиксированный IP-адрес)
- Трафик 64 ТБ/месяц (100 ТБ/месяц при пиковой нагрузке)

:::info Будьте готовы к пиковым нагрузкам
Как правило, для обеспечения надежной работы с пиковыми нагрузками вам потребуется подключение со скоростью не менее 1 Гбит/с (средняя нагрузка, как ожидается, составит около 100 Мбит/с).
:::

### Переадресация портов

Все типы узлов требуют статического внешнего IP-адреса, один UDP-порт для проброса входящих соединений и все исходящие соединения должны быть открыты - узел использует случайные порты для новых исходящих соединений. Необходимо, чтобы узел был виден извне через NAT.

Это можно сделать с помощью вашего сетевого провайдера или [арендовав сервер](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) для запуска узла.

:::info
Вы можете определить открытый UDP-порт с помощью команды `netstat -tulpn`.
:::

### Рекомендованные провайдеры

TON Foundation рекомендует следующих провайдеров для запуска валидатора:

| Облачный провайдер            | Тип экземпляра                  | CPU                       | RAM      | Хранилище                                 | Сеть           | Общедоступный IP                                | Трафик         |
| ----------------------------- | ------------------------------- | ------------------------- | -------- | ----------------------------------------- | -------------- | ----------------------------------------------- | -------------- |
| GCP                           | `n2-standard-16`                | `32 vCPUs`                | `128 ГБ` | `1 ТБ NVMe SSD`                           | `16 Гбит/с`    | Зарезервируйте статический внешний IP           | `64 ТБ/месяц`. |
| Alibaba Cloud                 | `ecs.g6.4xlarge`                | `32 vCPUs`                | `128 ГБ` | `1 ТБ NVMe SSD`                           | `До 10 Гбит/с` | Выделенный Elastic IP                           | `64 ТБ/месяц`. |
| Tencent Cloud                 | `M5.4XLARGE`                    | `32 vCPUs`                | `128 ГБ` | `1 ТБ NVMe SSD`                           | `До 10 Гбит/с` | Доступ к Elastic IP                             | `64 ТБ/месяц`. |
| Vultr                         | `bare metal Intel E-2388G`      | `16 ядер / 32 потока`     | `128 ГБ` | `1,92 ТБ NVMe SSD`                        | `10 Гбит/с`    | Фиксированный IP-адрес, включенный в экземпляр  | `64 ТБ/месяц`. |
| DigitalOcean                  | `general purpose premium Intel` | `32 vCPUs`                | `128 ГБ` | `1 ТБ NVMe SSD`                           | `10 Гбит/с`    | Фиксированный IP-адрес, включенный в экземпляр  | `64 ТБ/месяц`. |
| Latitude                      | `c3.medium.x86`                 | `16 ядер / 32 потока`     | `128 ГБ` | `1,9 ТБ NVMe SSD`                         | `10 Гбит/с`    | Фиксированный IP-адрес, включенный в экземпляр  | `64 ТБ/месяц`. |
| AWS                           | `i4i.8xlarge`                   | `32 vCPUs`                | `256 ГБ` | `2 x 3,750 AWS Nitro SSD (фиксированный)` | `До 25 Гбит/с` | Выделенный Elastic IP                           | `64 ТБ/месяц`. |

:::info
**Примечание:** Цены, конфигурации и доступность могут отличаться. Рекомендуется всегда проверять официальную документацию и страницы с ценами соответствующего облачного провайдера, прежде чем принимать какие-либо решения.
:::

## Запуск узла (видео)

[//]: # "<ReactPlayer controls={true} style={{borderRadius:'10pt', margin:'15pt auto', maxWidth: '100%'}} url='/docs/files/TON_nodes.mp4' />"

Пожалуйста, ознакомьтесь с этим пошаговым видео-руководством, чтобы сразу приступить к работе:

<video style={{borderRadius:'10pt', margin:'auto', width: '100%', maxWidth: '100%'}} controls={true}>
    <source src="/files/TON_nodes.mp4" type="video/mp4" />
</video>

## Запуск узла (текст)

### Переключитесь на пользователя без root прав

:::warning
Этот шаг **необходим ** для успешной установки и использования mytonctrl — не игнорируйте создание пользователя, без root прав\*\*. Без этого шага ошибок при установке не возникнет, но mytonctrl не будет работать должным образом.
:::

Если у вас нет пользователя **без root** прав, вы можете создать его с помощью следующих шагов (в противном случае пропустите первые два шага и перейдите к третьему).

1. Войдите в систему как пользователь root и создайте нового пользователя:

```bash
sudo adduser <username>
```

2. Добавьте своего пользователя в группу sudo:

```bash
sudo usermod -aG sudo <username>
```

3. Войдите под именем нового пользователя (если вы используете ssh, **необходимо будет завершить текущую сессию и переподключиться с правильным пользователем**)

```bash
ssh <username>@<server-ip-address>
```

### Установите MyTonCtrl

Скачайте и запустите скрипт установки из учетной записи пользователя **без root** привилегий, используя права **sudo**:

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu">

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh
```

</TabItem>
  <TabItem value={'debian'} label={'Debian'}>

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
su root -c 'bash install.sh'
```

</TabItem>
</Tabs>

- `-d` - **mytonctrl** загрузит [дамп](https://dump.ton.org/) последнего состояния блокчейна.
  Это сократит время синхронизации в несколько раз.
- `-c <path>` - если вы хотите использовать для синхронизации не общедоступные liteservers. _(не обязательно)_
- `-i` - Игнорировать минимальные требования, используйте только для проверки процесса компиляции без реального использования узла.
- `-m` - Режим, может быть `validator` или `liteserver`.
- `-t` - Отключить телеметрию.

**Чтобы использовать testnet**, флагу `-c` должно быть присвоено значение `https://ton.org/testnet-global.config.json`.

Значение по умолчанию для флага `-c` равно `https://ton-blockchain.github.io/global.config.json`, что является конфигурацией по умолчанию для основной сети (mainnet).

### Запуск mytonctrl

1. Запустите консоль `MyTonCtrl` из **учетной записи локального пользователя, которая была использована при установке**:

```sh
mytonctrl
```

2. Проверьте состояние `MyTonCtrl` с помощью команды `status`:

```sh
status
```

**В testnet** вместо `status` необходимо использовать команду `status fast`.

Должны отобразиться следующие статусы:

- **mytoncore status**: Должен быть зеленым.
- **local validator status**: Должен быть также зеленым.
- **local validator out of sync**: Сначала отображается строка `n/a`. Как только вновь созданный валидатор подключится к другим валидаторам, число будет около 250 000. По мере выполнения синхронизации это число уменьшается. Когда оно падает ниже 20, валидатор считается синхронизированным.

Пример вывода команды **status**:

![status](/img/docs/nodes-validator/mytonctrl-status.png)

:::caution Убедитесь, что у вас такой же вывод для команды status
Для всех узлов должен появиться раздел **Local Validator status**.
 Если это не так, проверьте раздел [устранения неполадок](/v3/guidelines/nodes/nodes-troubleshooting#status-command-displays-without-local-node-section) и [проверьте журналы узла](/v3/guidelines/nodes/running-nodes/full-node#check-the-node-logs).
:::

Подождите, пока `Local validator out of sync` не станет меньше 20 секунд.

При запуске нового узла, даже из дампа, **необходимо подождать до 3 часов, прежде чем количество рассинхронизаций начнет уменьшаться**. Это связано с тем, что узел все еще должен установить свое положение в сети и распространить свои адреса через таблицы DHT.

### Удаление mytonctrl

Загрузите скрипт и запустите его:

```bash
sudo bash /usr/src/mytonctrl/uninstall.sh
```

### Проверьте владельца mytonctrl

Выполните:

```bash
ls -lh /var/ton-work/keys/
```

## Советы и рекомендации

### Список доступных команд

- Вы можете использовать `help`, чтобы получить список доступных команд:

![Команда Help](/img/docs/full-node/help.jpg)

### Проверьте логи mytonctrl

- Чтобы проверить логи **mytonctrl**, откройте `~/.local/share/mytoncore/mytoncore.log` для локальной учетной записи или `/usr/local/bin/mytoncore/mytoncore.log` для пользователя Root.

![Логи](/img/docs/nodes-validator/manual-ubuntu_mytoncore-log.png)

### Проверьте логи узла

В случае сбоя проверьте логи узла:

```bash
tail -f /var/ton-work/log.thread*
```

## Поддержка

Обратитесь в службу технической поддержки по ссылке [@mytonctrl_help](https://t.me/mytonctrl_help).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/liteserver-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/liteserver-node.md
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Узел Liteserver

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Прочитайте о [Полном узле](/v3/guidelines/nodes/running-nodes/full-node) перед этой статьей
:::

Когда конечная точка активирована в полном узле, узел принимает на себя роль **Liteserver**. Этот тип узла может отправлять запросы от Легких клиентов и отвечать на них, обеспечивая бесперебойное взаимодействие с блокчейном TON.

## Требования к оборудованию

По сравнению с [validator](/v3/guidelines/nodes/running-nodes/full-node#hardware-requirements), режим liteserver требует меньше ресурсов. Тем не менее, для запуска liteserver по-прежнему рекомендуется использовать мощный компьютер.

- не менее 16 ядер процессора
- не менее 128 ГБ оперативной памяти
- твердотельный накопитель объемом 1 ТБ *или* Оборудованное хранилище с более 64 000 операций ввода/вывода в секунду (IOPS)
- Подключение к сети со скоростью 1 Гбит/с
- 16 ТБ/месяц трафика при пиковой нагрузке
- общедоступный IP-адрес (*фиксированный IP-адрес*)

### Рекомендованные провайдеры

Не стесняйтесь использовать облачных провайдеров, перечисленных в разделе [Рекомендуемые провайдеры](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers).

На Hetzner и OVH запрещено запускать валидатора, но Вы можете использовать их для запуска liteserver:

- **Hetzner**: EX101, AX102
- **OVH**: RISE-4

## Установка liteserver

Если у Вас нет mytonctrl, установите его с флагом `-m liteserver`:

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

- `-d` - **mytonctrl** загрузит [дамп](https://dump.ton.org/) последнего состояния блокчейна.
  Это сократит время синхронизации в несколько раз.
- `-c <path>` - если вы хотите использовать не общедоступные liteservers для синхронизации. *(не обязательно)*
- `-i` - Игнорировать минимальные требования. Используйте только для проверки процесса компиляции без реального использования узла.
- `-m` - Режим, может быть `validator` или `liteserver`.

**Чтобы использовать testnet**, флагу `-c` должно быть присвоено значение `https://ton.org/testnet-global.config.json`.

Значение по умолчанию для флага `-c` равно `https://ton-blockchain.github.io/global.config.json`, что является конфигурацией по умолчанию для основной сети (mainnet).

Если у вас уже установлен mytonctrl, запустите:

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## Проверьте настройки брандмауэра

Сначала убедитесь, что указан правильный порт Liteserver в файле`/var/ton-work/db/config.json`. Этот порт меняется при каждой новой установке `MyTonCtrl`. Он находится в поле `port`:

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

Если вы используете облачный провайдер, вам нужно открыть этот порт в настройках брандмауэра. Например, если вы используете AWS, вам нужно открыть порт в [группе безопасности](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html).

Вот пример открытия порта в брандмауэре сервера без виртуальной машины.

### Открытие порта в брандмауэре

Мы будем использовать утилиту `ufw` ([cheatsheet](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)). Вы можете использовать ту, которая вам больше нравится.

1. Установите `ufw`, если он не установлен:

```bash
sudo apt update
sudo apt install ufw
```

2. Разрешите ssh-соединение:

```bash
sudo ufw allow ssh
```

3. Разрешите порт, указанный в файле `config.json`:

```bash
sudo ufw allow <port>
```

4. Включите брандмауэр:

```bash
sudo ufw enable
```

5. Проверьте состояние брандмауэра:

```bash
sudo ufw status
```

Таким образом, вы можете открыть порт в настройках брандмауэра вашего сервера.

## Взаимодействие с Liteserver (lite-client)

0. Создайте пустой проект на своем компьютере и вставьте `config.json` в каталог проекта. Эту конфигурацию можно получить, выполнив команду:

```bash
installer clcf # in mytonctrl
```

Это создаст `/usr/bin/ton/local.config.json` на вашем компьютере, где установлен mytonctrl. Проверьте [документацию по mytonctrl для получения дополнительной информации] (/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#clcf).

1. Установите библиотеки.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

```bash
npm i --save ton-core ton-lite-client
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

2. Инициализируйте и запросите информацию о masterchain, чтобы убедиться, что liteserver работает.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

Измените тип проекта на `module` в файле `package.json`:

```json
{
    "type": "module"
}
```

Создайте файл `index.js` со следующим содержимым:

```js
import { LiteSingleEngine } from 'ton-lite-client/dist/engines/single.js'
import { LiteRoundRobinEngine } from 'ton-lite-client/dist/engines/roundRobin.js'
import { Lite } from 'ton-lite-client/dist/.js'
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

3. Теперь вы можете взаимодействовать со своим собственным liteserver.

## См. также

- [[YouTube]инструкция по запуску liteserver]] (https://youtu.be/p5zPMkSZzPc)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/run-mytonctrl-docker.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/run-mytonctrl-docker.md
================================================
# Запуск MyTonCtrl в Docker

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Требования к аппаратному обеспечению:

- 16-ядерный процессор
- 128 ГБ оперативной памяти
- Твердотельный накопитель объемом 9 ТБ *или* Оборудованное хранилище с более 64 000 операций ввода/вывода в секунду (IOPS)
- Подключение к сети со скоростью 1 Гбит/с
- Общедоступный IP-адрес (фиксированный IP-адрес)
- 16 ТБ/месяц трафика при пиковой нагрузке

***Не рекомендуется!*** ***Только для тестирования!***

Переменная **IGNORE_MINIMAL_REQS=true** отключает проверку требований к процессору/оперативной памяти.

## Требования к программному обеспечению:

- docker-ce
- docker-ce-cli
- containerd.io
- docker-buildx-plugin
- docker-compose-plugin

  *Руководство по установке на официальном сайте [Docker](https://docs.docker.com/engine/install/)*

## Протестированные операционные системы:

- Ubuntu 20.04
- Ubuntu 22.04
- Ubuntu 24.04
- Debian 11
- Debian 12

## Запустите MyTonCtrl v2 с помощью официального образа docker:

- Извлеките образ и запустите узел с помощью MyTonCtrl

````bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-blockchain/ton-docker-ctrl:latest


## Install and start MyTonCtrl from sources:

1. Clone the last version of the repository
```bash
git clone https://github.com/ton-blockchain/ton-docker-ctrl.git
````

2. Перейдите в каталог

```bash
cd ./ton-docker-ctrl
```

3. Укажите необходимые значения в файле .env

```bash
vi .env
```

4. Начните сборку образа docker. Этот шаг включает в себя компиляцию последних версий fift, validator-engine, lite-client и других инструментов, а также установку и первичную настройку MyTonCtrl.

```bash
docker compose build ton-node
```

5. Начало MyTonCtrl

```bash
docker compose up -d
```

## Перенесите полный узел или валидатор на докеризованную версию MyTonCtrl v2

Укажите пути к бинарным файлам и исходному коду TON, а также к рабочему каталогу, но самое главное, к настройкам MyTonCtrl и кошелькам.

```bash
docker run -d --name ton-node --restart always \
-v <EXISTING_TON_WORK_FOLDER>:/var/ton-work \
-v /usr/bin/ton:/usr/bin/ton \
-v /usr/src/ton:/usr/src/ton \
-v /home/<USER>/.local/share:/usr/local/bin \
ghcr.io/ton-blockchain/ton-docker-ctrl:latest
```

## Настройка переменных:

Переменные, указанные в файле .env

- **GLOBAL_CONFIG_URL** - Сетевые настройки блокчейна TON (по умолчанию: [Testnet](https://ton.org/testnet-global.config.json))
- **MYTONCTRL_VERSION** - ветка Git, из которой собран MyTonCtrl
- **TELEMETRY** - Включение/выключение телеметрии
- **MODE** - Установите MyTonCtrl в указанный режим (validator или liteserver)
- **IGNORE_MINIMAL_REQS** - Игнорировать требования к оборудованию

## Остановка и удаление MyTonCtrl:

1. Остановить контейнер

```bash
docker compose stop
```

2. Удалить контейнер

```bash
docker compose down
```

3. Удалить контейнер с данными

```bash
docker compose down --volumes
```

## Подключение к MyTonCtrl:

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

Сразу после подключения можно проверить состояние с помощью команды `status`

```bash
MyTonCtrl> status
```

![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

Отражает список доступных команд `help`.

```bash
MyTonCtrl> help
```

## Просмотр логов MyTonCtrl:

```bash
docker compose logs
```

## Обновление MyTonCtrl и TON:

Чтобы получить последние версии TON validator и MyTonCtrl, нужно перейти в каталог с файлом docker-compose.yml и выполнить сборку

```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```

После завершения снова запустите Docker Compose

```bash
docker compose up -d
```

При подключении к MyTonCtrl выполняется автоматическая проверка на наличие обновлений. Если обновления обнаружены, отображается сообщение "*MyTonCtrl update available. Please update it with `update` command.*"

Обновление выполняется с помощью команды update, указав необходимую ветвь

```bash
MyTonCtrl> update mytonctrl2
```

## Изменение пути хранения данных:

По умолчанию TON и Mytoncore работают и хранятся в каталоге **/var/lib/docker/volumes/**

Вы можете изменить его в файле docker-compose.yml, указав требуемый путь в разделе **volumes**



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/running-a-local-ton.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/running-a-local-ton.md
================================================
# Запуск локального TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## MyLocalTon

Используя **MyLocalTon**, вы можете запустить свой собственный блокчейн TON даже на ноутбуке.

![MyLocalTon](/img/docs/mylocalton.jpeg)

## Ресурсы

MyLocalTon имеет удобный интерфейс и совместим с несколькими платформами.

- [Бинарные файлы MyLocalTon](https://github.com/neodiX42/MyLocalTon/releases)
- [Исходный код MyLocalTon](https://github.com/neodiX42/MyLocalTon)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/secure-guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/secure-guidelines.md
================================================
# Рекомендации по безопасности для узлов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Обеспечение безопасности узлов, особенно в децентрализованных сетях, таких как блокчейн или распределенные системы, имеет решающее значение для поддержания целостности, конфиденциальности и доступности данных. Рекомендации по обеспечению безопасности узлов должны касаться различных уровней, от сетевых коммуникаций до конфигурации аппаратного и программного обеспечения. Вот набор рекомендаций по обеспечению безопасности узлов:

### 1. Используйте сервер только для запуска узла TON

- Использование сервера для других задач представляет потенциальную угрозу безопасности

### 2. Регулярно обновляйте и устанавливайте исправления

- Убедитесь, что ваша система всегда обновлена с помощью последних исправлений безопасности.
- Используйте инструменты управления пакетами, такие как apt (для Debian/Ubuntu) или yum/dnf (для CentOS/Fedora), для регулярного обновления:

```bash
sudo apt update && sudo apt upgrade -y
```

- Рассмотрите возможность автоматизации обновлений системы безопасности, включив автоматическое обновление.

### 3. Используйте надежную конфигурацию SSH

- Отключите вход с Root правами: запретите доступ с правами суперпользователя по SSH. Отредактируйте файл /etc/ssh/sshd_config:

```bash
PermitRootLogin no
```

- Используйте SSH-ключи: Избегайте аутентификации по паролю и вместо этого используйте SSH-ключи.

```bash
PasswordAuthentication no
```

- Измените порт SSH по умолчанию: Перенесите SSH на нестандартный порт, это уменьшит количество автоматических атак методом перебора. Например:

```bash
Port 2222
```

- Ограничьте доступ к SSH: Разрешайте SSH только с доверенных IP-адресов с помощью правил брандмауэра

### 4. Настройте брандмауэр

- Настройте брандмауэр, чтобы разрешить только необходимые службы. Общие инструменты - это ufw (Uncomplicated Firewall) или iptables:

```bash
sudo ufw allow 22/tcp   # Allow SSH
sudo ufw allow 80/tcp   # Allow HTTP
sudo ufw allow 443/tcp  # Allow HTTPS
sudo ufw enable         # Enable firewall
```

### 5. Отслеживайте логи

- Регулярно проверяйте системные журналы для выявления подозрительной активности:
   - */var/log/auth.log* (для попыток аутентификации)
   - */var/log/syslog* или */var/log/messages*
- Рассмотрите возможность централизованного ведения журнала

### 6. Ограничьте права пользователей

- Предоставьте root права или sudo только доверенным пользователям. Используйте команду sudo с осторожностью и проведите аудит */etc/sudoers*, для ограничения доступа.
- Регулярно просматривайте учетные записи пользователей и удаляйте ненужных или неактивных пользователей.

### 7. Настройте SELinux или AppArmor

- **SELinux** (на RHEL/CentOS) и **AppArmor** (на Ubuntu/Debian) обеспечивают обязательный контроль доступа, добавляя дополнительный уровень безопасности, ограничивая доступ программ к определенным системным ресурсам.

### 8. Установите инструменты безопасности

- Используйте такие инструменты, как Lynis, для проведения регулярных проверок безопасности и выявления потенциальных уязвимостей:

```bash
sudo apt install lynis
sudo lynis audit system
```

### 9. Отключите ненужные службы

- Отключите или удалите неиспользуемые службы, чтобы свести к минимуму вероятность атаки. Например, если вам не нужны службы FTP или почты, отключите их с помощью:

```bash
sudo systemctl disable service_name
```

### 10. Используйте системы обнаружения и предотвращения вторжений (IDS/IPS)

- Установите такие инструменты, как Fail2ban, чтобы блокировать IP-адреса после слишком большого количества неудачных попыток входа в систему:

```bash
sudo apt install fail2ban
```

- Используйте AIDE (Advanced Intrusion Detection Environment) для контроля целостности файлов и обнаружения несанкционированных изменений.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/staking-with-nominator-pools.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/staking-with-nominator-pools.md
================================================
# Стейкинг с помощью номинатор-пулов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Общие сведения

С помощью смарт-контрактов TON вы можете реализовать любые механики стейкинга и депозитов, которые вам нужны.

Однако в блокчейне TON есть "втроенный стейкинг" - вы можете выдавать TON валидаторам для стейкинга и делиться вознаграждением за их работу.

Тот, кто предоставляет средства валидатору, называется **номинатором**.

Смарт-контракт, называемый [**номинатор-пул**](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), предоставляет возможность одному или нескольким номинаторам выдавать Toncoin валидатору для стейкинга и гарантирует, что валидатор сможет использовать эти Toncoin только для подтверждения транзакций. Смарт-контракт также обеспечивает распределение вознаграждений.

## Валидаторы против номинаторов

Если Вы знакомы с криптовалютами, то наверняка слышали о **валидаторах** и **номинаторах**. Эти слова часто встречаются в каналах, посвященных криптовалютам (наш канал не исключение). Теперь пришло время выяснить, кто они такие – два основных действующих лица, управляющих блокчейном.

### Валидаторы

Сначала давайте поговорим о валидаторах. Валидатор - это сетевой узел, который помогает поддерживать работу блокчейна, проверяя (или валидируя) предлагаемые блоки и записывая их в блокчейн.

Чтобы стать валидатором, вы должны соответствовать двум требованиям: иметь высокопроизводительный сервер и иметь серьезную сумму в TON (600 000), чтобы положить ее в стейк. На момент написания статьи на TON было 227 валидаторов.

### Номинаторы

:::info
Доступна новая версия номинатор-пула, подробнее читайте на страницах Единого номинатора и Контракт вестинга.
:::

Конечно, не каждый может позволить себе иметь на балансе 100 000 Toncoin - вот тут-то и вступают в игру номинаторы. Проще говоря, номинатор - это пользователь, который одалживает свои TON валидаторам. Каждый раз, когда валидатор зарабатывает вознаграждение за подтверждение блоков, оно распределяется между участниками.

Некоторое время назад компания Ton Whales запустила первый стейкинг-пул на TON с минимальным депозитом в 50 TON. Позже TON Foundation представил первый открытый номинатор-пул. Теперь пользователи могут стейкать Toncoin полностью децентрализованно, начиная с **10 000 TON**.

*Из [сообщения TON Community RUS](https://t.me/toncoin_rus/362).*

На балансе пула всегда должно быть **10 TON** - это минимальный баланс для оплаты сетевого хранения.

## Стоимость в месяц

Так как раунд валидации длится примерно ~18 часов, на каждый раунд требуется около **5 TON**, а один номинатор-пул участвует в четных и нечетных раундах валидации, то для работы пула потребуется примерно **~105 TON в месяц**.

## Как принять участие?

- [Список номинатор-пулов TON](https://tonvalidators.org/)

## Исходный код

- [Исходный код смарт-контракта Номинатор-пул](https://github.com/ton-blockchain/nominator-pool)

:::info
Теория номинаторов описана в [TON Whitepaper](https://docs.ton.org/ton.pdf), главы 2.6.3, 2.6.25.
:::



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/validator-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/nodes/running-nodes/validator-node.md
================================================
# Узел валидатора

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Минимальные требования к оборудованию

- 16-ядерный процессор
- 128 ГБ оперативной памяти
- Твердотельный накопитель объемом 1 ТБ *или* Оборудованное хранилище с более 64 000 операций ввода/вывода в секунду (IOPS)
- Подключение к сети со скоростью 1 Гбит/с
- общедоступный IP-адрес (*фиксированный IP-адрес*)
- 100 ТБ/месяц трафика при пиковой нагрузке

> Как правило, для обеспечения надежной работы с пиковыми нагрузками вам потребуется подключение со скоростью не менее 1 Гбит/с (средняя нагрузка, как ожидается, составит около 100 Мбит/с).

> Мы обращаем особое внимание валидаторов на требования к IOPS диска, это критически важно для бесперебойной работы сети.

## Переадресация портов

Для всех типов узлов требуется статический внешний IP-адрес, один UDP-порт, который должен быть перенаправлен для входящих подключений и все исходящие подключения должны быть открыты - узел использует случайные порты для новых исходящих подключений. Это необходимо, чтобы узел был виден извне через NAT.

Это можно сделать через вашего провайдера услуг связи или [аренду сервера](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers).

:::info
Используйте команду `netstat -tulpn`, чтобы определить, какой UDP-порт открыт.
:::

## Обязательное условие

### Изучите политику штрафов

Если валидатор обработал менее 90% ожидаемого количества блоков во время раунда валидации, этот валидатор будет оштрафован на 101 TON.
Узнайте больше о [политике штрафов](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).

### Запустите полный узел

Запустите [полный узел](/v3/guidelines/nodes/running-nodes/full-node) перед выполнением этого руководства.

Проверьте, что режим валидатора включен с помощью команды `status_modes`. Если это не так, выполните команду [mytonctrl enable_mode](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#enable_mode).

## Архитектура

![image](/img/nominator-pool/hot-wallet.png)

## Просмотрите список кошельков

Список доступных кошельков можно посмотреть в консоли **MyTonCtrl** с помощью команды `wl`:

```sh
wl
```

Во время установки **mytonctrl** создается кошелек **validator_wallet_001**:

![список кошельков](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

## Активация кошельков

1. Отправьте необходимое количество монет в кошелек и активируйте его.

   В последнее время (*на конец 2023 года*) приблизительные цифры были такими: минимальный стейк составлял около **340 тыс. TON** и максимальный - около **1 млн. TON**.

   Для понимания нужного количества монет проверьте текущий стейк на [tonscan.com](https://tonscan.com/validation).

   Узнайте больше о том, [как рассчитываются максимальный и минимальный стейки] (/v3/documentation/infra/nodes/validation/staking-incentives#values-of-stakes-max-effective-stake).

2. Используйте команду `vas` для отображения истории переводов:

   ```sh
   vas [wallet name]
   ```

3. Активируйте кошелек с помощью команды `aw` (имя кошелька необязательно, если аргументы не указаны, то будут активированы все доступные)

   ```sh
   aw [wallet name]
   ```

![История аккаунта](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## Теперь ваш валидатор готов

**mytoncore** автоматически участвует в выборах. Он делит баланс кошелька на две части и использует их как стейк для участия в выборах. Вы также можете вручную установить размер стейка:

```sh
set stake 50000
```

`set stake 50000` - это устанавливает размер стейка в 50 тысяч монет. Если ставка принята и наш узел становится валидатором, ставку можно вывести только во вторых выборах (в соответствии с правилами избирательного комитета).

![установка стейка](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png)

## Следуйте рекомендациям

:::caution Штрафы для некачественных валидаторов

Узнайте подробнее о [политике штрафов](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).
:::

Как валидаторы TON, убедитесь, что вы следуете этим ключевым шагам для обеспечения стабильности сети и избежания штрафов в будущем.

Ключевые действия:

1. Следуйте уведомлениям [@tonstatus](https://t.me/tonstatus), и готовьтесь к немедленным обновлениям при необходимости.
2. Убедитесь, что ваше оборудование соответствует или превышает [минимальные системные требования] (/v3/guidelines/nodes/running-nodes/validator-node#minimal-hardware-requirements).
3. Мы настоятельно просим вас использовать [mytonctrl](https://github.com/ton-blockchain/mytonctrl).
   - Обновляйте `mytonctrl` в соответствии с уведомлениями и включите телеметрию: `set sendTelemetry true`
4. Настройте панели мониторинга использования оперативной памяти, дисков, сети и процессора. Для технической помощи свяжитесь с @mytonctrl_help_bot.
5. Отслеживайте эффективность вашего валидатора с помощью панелей мониторинга.
   - Проверьте эффективность `mytonctrl` с помощью команды `check_ef`.
   - [Создайте панель мониторинга с помощью API](/v3/guidelines/nodes/running-nodes/validator-node#validation-and-effectiveness-apis).

:::info
`mytonctrl` позволяет проверить эффективность валидаторов с помощью команды `check_ef`, которая выводит данные о вашей эффективности валидатора за последний и текущий период.
Эта команда получает данные, вызывая утилиту `checkloadall`.
Убедитесь, что ваша эффективность превышает 90% (за весь период полного цикла).
:::

:::info
В случае низкой эффективности - принимайте меры для решения проблемы. Если это необходимо, свяжитесь с технической поддержкой [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).
:::

## API-интерфейсы валидации и эффективности

:::info
Пожалуйста, настройте информационные панели для мониторинга ваших валидаторов с помощью этих API.
:::

#### Отслеживание валидаторов, подвергшихся штрафам

Вы можете отслеживать валидаторов, подвергшихся штрафам, в каждом раунде с помощью [@tonstatus_notifications](https://t.me/tonstatus_notifications).

#### API для валидации

https://elections.toncenter.com/docs - используйте этот API для получения информации о текущих и прошлых раундах (циклах) валидации - время раундов, какие валидаторы участвовали в них, их ставки и т.д.

Также доступна информация о текущих и прошедших выборах (для раунда валидации).

#### API для эффективности

https://toncenter.com/api/qos/index.html#/ - используйте этот API для получения информации об эффективности валидаторов с течением времени.

Этот API анализирует информацию, полученную из catchain, и строит оценку эффективности валидатора. Этот API не использует утилиту checkloadall, но является ее альтернативой.
В отличие от `checkloadall`, который работает только в циклах валидации, в этом API вы можете установить любой временной интервал для анализа эффективности валидатора.

Рабочий процесс:

1. Передайте ADNL адрес вашего валидатора и временной интервал (`from_ts`, `to_ts`) в API. Для точного результата полезно выбирать достаточно большой интервал, например, с 18 часов назад до текущего момента.

2. Извлеките результат. Если в вашем поле процент эффективности меньше 80%, ваш валидатор работает неправильно.

3. Важно, чтобы ваш валидатор участвовал в валидации и имел один и тот же ADNL адрес на весь указанный период времени.

Например, если валидатор участвует в валидации каждый второй раунд - тогда вам нужно указывать только те интервалы, когда он участвовал в валидации. В противном случае вы получите неверное значение.

Это работает не только для валидаторов Masterchain (с индексом < 100), но и для других валидаторов (с индексом > 100).

## Поддержка

Свяжитесь с технической поддержкой [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot). Этот бот предназначен только для валидаторов и не будет помогать с вопросами для обычных узлов.

Если у вас обычный узел, обратитесь в группу: [@mytonctrl_help](https://t.me/mytonctrl_help).

## См. также

- [Запуск полного узла](/v3/guidelines/nodes/running-nodes/full-node)
- [Устранение неполадок](/v3/guidelines/nodes/nodes-troubleshooting)
- [Мотивация для стейкинга](/v3/documentation/infra/nodes/validation/staking-incentives)




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/overview.md
================================================
# Обзор

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

// TODO: необходимо написать



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/blockchain-interaction/reading-from-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/blockchain-interaction/reading-from-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import ThemedImage from "@theme/ThemedImage";
import Button from '@site/src/components/button'

# Чтение из сети

## Введение

Это руководство демонстрирует, как читать данные из блокчейна TON. Вы узнаете, как:

- Получать информацию об аккаунте
- Вызывать `get-методы`
- Получать данные о транзакциях аккаунта

В итоге вы поймёте, как взаимодействовать с [TON  API на основе HTTP](/ru/v3/guidelines/dapps/apis-sdks/ton-http-apis/). В этом руководстве используется [TON Center](https://toncenter.com/) — быстрый и надежный HTTP API для TON.

## Настройка окружения

Сначала посетите страницы установки и установите [Node.js и npm](https://nodejs.org/en/download/) для вашей ОС. Проверьте, что установка корректна, выполнив следующие команды:

```bash
node -v
npm -v
```

Версии `node` и `npm` должны быть по меньшей мере `v20` и `v10` соответственно.

## Настройка проекта

Давайте настроим структуру вашего проекта:

1. Создайте новый каталог для вашего проекта и перейдите в него.
2. Инициализируйте проект Node.js.
3. Установите необходимые зависимости.
4. Инициализируйте конфигурацию TypeScript.

Выполните эти команды в терминале:

```bash
mkdir reading-from-ton && cd reading-from-ton
npm init -y
npm install typescript ts-node @ton/ton @ton/core @ton/crypto
npx tsc --init
```

Для запуска скрипта на TypeScript, сохранённого как `script.ts` в вашей текущей директории, можно выполнить такую команду:

```bash
npx ts-node script.ts
```

## Чтение информации об аккаунте

Информация об аккаунте включает составляющие `balance`, `state`, `code` и `data`.

- `balance`: Сумма TON на счету.
- `state`: Состояние может быть одним из следующих:
  - **Nonexist**: По адресу ещё нет никаких данных.
  - **Uninit**: У адреса есть баланс, но нет кода смарт-контракта.
  - **Active**: Адрес уже активен, у него есть и код, и баланс.
  - **Frozen**: Адрес заблокирован, поскольку баланс оказался недостаточным для расходов на хранение данных.
- `code`: Код контракта в «сыром формате».
- `data`: Сериализованные данные контракта, хранящиеся в [_ячейке_](/ru/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage/).

Состояние аккаунта может быть получено с помощью метода [`getContractState`](https://testnet.toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get/).

#### Реализация

Создайте новый файл `1-get-account-state.ts`:

```typescript title="1-get-account-state.ts"
import { Address, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  const accountAddress = Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'); // Replace with any address

  // Calling method on http api
  const state = await tonClient.getContractState(accountAddress);


  console.log('State: ', state.state);
  console.log('Balance: ', state.balance);
  console.log('Data: ', state.data?.toString('hex'));
  console.log('Code: ', state.code?.toString('hex'));
}

main();
```

Запустите этот пример, используя следующую команду:

```bash
npx ts-node 1-get-account-state.ts
```

#### Ожидаемый результат

```bash
State:  active
Balance:  3722511000883n
Data:  b5ee9c7241010101002...fd1e976824402aa67b98
Code:  b5ee9c7241021401000...c9ed54696225e5
```

## Вызов get-методов

Get-методы — это специальные функции в смарт-контрактах, позволяющие наблюдать текущее состояние смарт-контракта. Их выполнение не требует оплаты комиссий и не может изменить данные смарт-контракта.

Результат вызова get-метода через TON HTTP API приходит в _стековом_ формате, и его можно десериализировать один элемент за другим с помощью `readNumber()` или схожей функции.

#### Реализация

Создайте новый файл `2-call-get-method.ts`:

```typescript title="2-call-get-method.ts"
import { Address, TonClient, TupleBuilder } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Building optional get method parameters list
  const builder = new TupleBuilder();
  builder.writeAddress(Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'));

  const accountAddress = Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy')

  // Calling http api to run get method on specific contract
  const result = await tonClient.runMethod(
    accountAddress, // address to call get method on
    'get_wallet_address', // method name
    builder.build(), // optional params list
  );

  // Deserializing get method result
  const address = result.stack.readAddress();
  console.log(address.toRawString());
}

main();
```

Запустите этот пример с помощью следующей команды:

```bash
npx ts-node 2-call-get-method.ts
```

#### Ожидаемый результат

```bash
0:25f2bf1ce8f83ed0c0fd73ea27aac77093cdcf900c750b071df7fb0288e019b2
```

Get-методы можно также вызвать с помощью Tonviewer:

1. Перейдите в раздел [get-методов](https://testnet.tonviewer.com/kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy?section=method).
2. Выберите `get_wallet_address`.
3. Вставьте адрес из примера _0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-_ в поле Slice.
4. Нажмите **Выполнить**.

Вы получите тот же адрес, который вы получили из консоли.

### Использование обёрток для простоты

Обёртки — это классы, которые упрощают взаимодействие со смарт-контрактами, превращая сложные операции с блокчейном в простые вызовы функций. Вместо того, чтобы вручную сериализировать ячейки и транзакции, вы можете просто вызвать методы вроде `jettonMaster.getWalletAddress()`, который уже выполнил эти задачи для вас. Вот пример использования оболочки, функционально эквивалентной предыдущему фрагменту кода:

```typescript
import { Address, JettonMaster, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Initializing wrappers
  const jettonMaster = tonClient.open(
    JettonMaster.create(Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy')),
  );

  // Calling get method through wrapper
  const address = jettonMaster.getWalletAddress(Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'));
  console.log(address);
}

main();
```

## Получение транзакций аккаунта

Взаимодействие с аккаунтом в блокчейне происходит с помощью [сообщений и транзакций](/v3/documentation/smart-contracts/message-management/messages-and-transactions/).

### Что такое транзакция?

Транзакция в TON состоит из следующего:

- Входящее сообщение, которое изначально обращается к контракту (существуют специальные способы обратиться)
- Действия контракта, вызванные входящим сообщением, такие как обновление хранимых  контрактом данных (опционально)
- Исходящие сообщения, которые генерируются и отправляются другим акторам (опционально)

<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2_dark.png?raw=true',
  }}
/>

### Ключевые поля транзакций

Транзакция, полученная из API, имеет следующую структуру:

```json5
{
  "@type": "raw.transaction",
  "address": {
    "@type": "accountAddress",
    "account_address": "EQD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje02Zx"
  },
  "utime": 1738588970,
  ...
  "in_msg": {
    ...
  },
  "out_msgs": [...]
}
```

- `address`: Адрес аккаунта, где осуществлялась транзакция.
- `utime`: [UNIX-время](https://www.unixtimestamp.com/) транзакции.
- `in_msg`: Входящее [сообщение](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-message/), которое инициировало транзакцию.
- `out_msgs`: Исходящие сообщения, отправленные в ходе транзакции.

### Что такое сообщение?

Сообщение представляет собой пакет данных, отправляемых между акторами (пользователями, приложениями или смарт-контрактами). Обычно оно содержит информацию, указывающую получателю на то, какие действия выполнять: например, обновление сохранённых данных или отправка нового сообщения.

<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light: '/img/docs/message-delivery/message_delivery_1.png?raw=true',
      dark: '/img/docs/message-delivery/message_delivery_1_dark.png?raw=true',
    }}
  />
</div>

### Ключевые поля сообщений

```json5
{
  "@type": "raw.message",
  "hash": "mcHdqltDAB8ODQHqtedtYQIS6MQL7x4ut+nf9tXWGqg=",
  "source": "EQAJTegD8OO-HksHfI4KVDqb7vW9Dlqi5C1FTcL1dECeosTf",
  "destination": "EQD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje02Zx",
  "value": "20000000",
  ...
  "msg_data": {
    "@type": "msg.dataRaw",
    "body": "te6cckEBAQEAAgAAAEysuc0=",
    ...
  },
  ...
}
```

- `source`: Адрес отправителя (аккаунт, который инициировал сообщение).
- `destination`: Адрес получателя (аккаунт, который будет обрабатывать сообщение).
- `value`: Количество TON (указывается в nanoTON), прикреплённое к сообщению.
- `msg_data`: Содержит тело сообщения и состояние инициализации.

#### Реализация

Создайте новый файл `3-fetch-account-transaction.ts`:

```typescript title="3-fetch-account-transaction.ts"
import { Address, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Calling method on http api
  // full api: https://testnet.toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get
  const transactions = await tonClient.getTransactions(
    Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'), // Address to fetch transactions
    {
      limit: 10,      //maximum ammount of recieved transactions
      archival: true, //search in all history
    },
  );

  const firstTx = transactions[0];
  const { inMessage } = firstTx;

  console.log('Timestamp:', firstTx.now);
  if (inMessage?.info?.type === 'internal') {
    console.log('Value:', inMessage.info.value.coins);
    console.log('Sender:', inMessage.info.src);
  }
}

main();
```

Выполните этот пример, используя следующую команду:

```bash
npx ts-node 3-fetch-account-transaction.ts
```

#### Ожидаемый результат

```bash
Timestamp: 1743516631
Value: 100000000n
Sender: EQBui16XCF61MSWauIDpVFbKAOJmjLHRxXvXeqiN9dYaIgjq
```

:::info
Более сложный пример обхода графа транзакций можно увидеть [здесь](/ru/v3/guidelines/dapps/asset-processing/payments-processing/#retrieve-incomingoutgoing-transactions).
:::

## Следующий шаг

Теперь, когда вы научились читать данные из блокчейна TON, пришло время изучить **писать данные в сеть**.

Нажмите кнопку ниже, чтобы продолжить:

<Button href="/v3/guidelines/quick-start/blockchain-interaction/writing-to-network" colorType={'primary'} sizeType={'sm'}>

  Запись в сеть

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/blockchain-interaction/writing-to-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/blockchain-interaction/writing-to-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import ThemedImage from "@theme/ThemedImage";
import Button from '@site/src/components/button'

# Запись в сеть

В предыдущем разделе вы узнали, как **читать данные** из блокчейна TON. Теперь давайте рассмотрим, как **записывать** их.

## Введение

Это руководство разъяснит вам запись данных в блокчейн TON. Вы научитесь:

- Делать транзакции
- Переводить TON и NFT

## Настройка окружения

Сначала посетите страницы установки и установите [Node.js и npm](https://nodejs.org/en/download/) для вашей ОС. Проверьте, что установка корректна, выполнив следующие команды:

```bash
node -v
npm -v
```

Версии `node` и `npm` должны быть по крайней мере `v20` и `v10` соответственно.

## Настройка проекта

Давайте настроим структуру нашего проекта:

1. Создайте новый каталог для проекта
2. Инициализируйте проект Node.js
3. Установите необходимые зависимости
4. Инициализируйте конфигурацию TypeScript.

Для этого выполните эти команды в терминале:

```bash
mkdir writing-to-ton && cd writing-to-ton
npm init -y
npm install typescript ts-node @ton/ton @ton/core @ton/crypto
npx tsc --init
```

Для запуска скриптов используйте следующую команду:

```bash
npx ts-node script.ts
```

## Отправка TON

Простейшее взаимодействие между двумя аккаунтами в блокчейне TON — это передача монеты TON. Процесс включает подготовку и подписание транзакции, а затем отправку её в блокчейн.

Обычная передача будет выглядеть следующим образом:

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

:::caution
В отличие от раздела [Чтение из сети](/ru/v3/guidelines/quick-start/blockchain-interaction/reading-from-network/), в следующих примерах понадобится ключ Toncenter API. Его можно получить с помощью [следующего руководства](/ru/v3/guidelines/dapps/apis-sdks/api-keys/).
:::

#### Реализация

Создать новый файл `1-send-ton.ts`:

```typescript title="1-send-ton.ts"
import { mnemonicToWalletKey } from "@ton/crypto";
import { comment, internal, toNano, TonClient, WalletContractV3R2, WalletContractV4, WalletContractV5R1 } from "@ton/ton";
import { SendMode } from "@ton/core";

async function main() {
  // Initializing tonClient for sending messages to blockchain
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',  //acquire it from: https://t.me/toncenter
  });

  // Using mnemonic to derive public and private keys
  // ATTENTION! Replace on your own mnemonic 24-word phrase that you get from wallet app!
  const mnemonic = "swarm trumpet innocent empty faculty banner picnic unique major taste cigar slogan health neither diary monster jar scale multiply result biology champion genuine outside".split(' ');
  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);

  // Creating wallet depending on version (v5r1 or v4 or V3R2), uncomment which version do you have
  const walletContract = WalletContractV5R1.create({ walletId: { networkGlobalId: -3 }, publicKey }); // networkGlobalId: -3 for Testnet, -239 for Mainnet
  //const walletContract = WalletContractV4.create({ workchain: 0, publicKey });
  //const walletContract = WalletContractV3R2.create({ workchain: 0, publicKey });

  // Opening wallet with tonClient, which allows to send messages to blockchain
  const wallet = tonClient.open(walletContract);

  // Retrieving seqno used for replay protection
  const seqno = await wallet.getSeqno();

  // Sending transfer
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [internal({
      to: wallet.address, // Transfer will be made to the same wallet address
      body: comment('Hello from wallet!'), // Transfer will contain comment
      value: toNano(0.05), // Amount of TON, attached to transfer
    })],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}

main();
```

Использование `API_KEY` в данном случае позволяет получить доступ к функциональности TON через `endpoint`. Запустив этот скрипт, мы аутентифицируемся в нашем кошельке через пару `публичный/приватный ключ`, созданную из `мнемонической фразы`. После подготовки транзакции мы отправили её в TON, в результате чего кошелёк посылает самому себе сообщение с текстом _'Hello from wallet!'_.

:::caution Продвинутый уровень
В большинстве сценариев `SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS` будет работать, но если вы хотите понять глубже, продолжите чтение на странице [Рецепты режимов сообщений](/ru/v3/documentation/smart-contracts/message-management/message-modes-cookbook/).
:::

Выполните этот пример, используя следующую команду:

```bash
npx ts-node 1-send-ton.ts
```

#### Ожидаемый результат

Перейдите в [Tonviewer](https://testnet.tonviewer.com/) и вставьте свой адрес в строку поиска. Вы должны увидеть перевод TON с комментарием _'Hello from wallet!'_.

## Отправка NFT

[Невзаимозаменяемые токены](/v3/guidelines/dapps/asset-processing/nft-processing/nfts/) (NFT) — это активы вроде произведения искусства, цифрового контента или видео, которые были токенизированы с помощью блокчейна. В TON NFT представлены набором смарт-контрактов:

- **NFT Collection**: хранит информацию о коллекции NFT.
- **NFT Item**: хранит информацию о конкретном NFT, которым владеет пользователь.

Чтобы отправить NFT, мы должны сначала обзавестись им. Самый простой способ это сделать — создать и развернуть свой собственный NFT с помощью [TON Tools](https://ton-collection-edit.vercel.app/deploy-nft-single). Обратите внимание, что адрес `владельца` NFT должен быть адресом вашего кошелька, чтобы вы могли выполнять операции над ним.

Основная операция [стандарта NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) в TON — `передача`. На самом деле это изменение адреса `владельца` в хранимых данных NFT на `нового владельца`: адрес другого контракта, который после этого сможет осуществлять операции с этим `экземпляром NFT`.

:::tip
Смотрите раздел «[Акторы и роли](/ru/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages#actors-and-roles)» для более концептуального описания.
:::

#### Реализация

Создать новый файл `2-send-nft.ts`:

```typescript title="2-send-nft.ts"
import { mnemonicToWalletKey } from "@ton/crypto";
import { Address, beginCell, comment, internal, toNano, TonClient, WalletContractV5R1 } from "@ton/ton";
import { SendMode } from "@ton/core";


async function main() {
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',  //acquire it from: https://t.me/toncenter
  });

  // Using mnemonic to derive public and private keys
  // ATTENTION! Replace on your own mnemonic 24-word phrase that you get from wallet app!
  const mnemonic = "swarm trumpet innocent empty faculty banner picnic unique major taste cigar slogan health neither diary monster jar scale multiply result biology champion genuine outside".split(' ');
  // Remember that it should be mnemonic of the wallet that you have made an owner of NFT

  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);
  const walletContract = WalletContractV5R1.create({ walletId: { networkGlobalId: -3 }, publicKey });
  const wallet = tonClient.open(walletContract);
  const seqno = await wallet.getSeqno();

  const nftTransferBody = beginCell()
    .storeUint(0x5fcc3d14, 32) // opcode for nft transfer
    .storeUint(0, 64) // query id
    .storeAddress(wallet.address) // address to transfer ownership to
    .storeAddress(wallet.address) // response destination
    .storeBit(0) // no custom payload
    .storeCoins(1) // forward amount - if >0, will send notification message
    .storeMaybeRef(comment('Hello from NFT!'))
    .endCell();

  //The one that you have acquired from https://ton-collection-edit.vercel.app/deploy-nft-single
  const nftAddress = Address.parse('YOUR_NFT_ADDRESS'); 
  // Sending NFT transfer
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [internal({
      to: nftAddress,
      body: nftTransferBody,
      value: toNano(0.05),
    })],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}
main();
```

Запустить этот пример, используя следующую команду:

```bash
npx ts-node 2-send-nft.ts
```

#### Ожидаемый результат

Перейдите в [Tonviewer](https://testnet.tonviewer.com/) и вставьте свой адрес в строку поиска. Вы должны увидеть передачу NFT с комментарием _'Hello from NFT!'_.

## Следующий шаг

Теперь, когда вы научились писать данные в блокчейн TON, пришло время перейти к следующему этапу — **разработке своих смарт-контрактов**. Сначала вам нужно **настроить свою среду разработки** с помощью необходимых инструментов и библиотек.

Нажмите на кнопку ниже, чтобы начать:

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/setup-environment" colorType={'primary'} sizeType={'sm'}>

  Настройка среды разработки

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Обзор Blueprint

> **Резюме:** На предыдущих этапах мы установили и настроили все инструменты, необходимые для разработки смарт-контрактов в TON, и создали наш первый шаблон проекта.

Прежде чем приступить к разработке смарт-контракта, давайте кратко опишем структуру проекта и объясним, как использовать **`Blueprint`**.

## Структура проекта

:::warning
Если вы не выбрали названия, предложенные в предыдущих шагах, то названия файлов с исходным кодом и некоторые сущности в коде могут отличаться.
:::

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```ls title="Структура проекта"
Example/
├── contracts/           # Директория с кодом смарт-контрактов
│   ├── imports/         # Импортируемые библиотеки для контрактов
│   │   └── stdlib.fc    # Стандартная библиотека для FunC
│   └── hello_world.fc   # Файл главного контракта
├── scripts/             # Скрипты для развёртывания и взаимодействия в блокчейне
│   ├── deployHelloWorld.ts     # Скрипт для развёртывания контракта
│   └── incrementHelloWorld.ts  # Скрипт для взаимодействия с контрактом
├── tests/               # Директория с тестами для локального тестирования контрактов
│   └── HelloWorld.spec.ts      # Спецификации тестов для контракта
└── wrappers/            # Обёртки на TypeScript для взаимодействия с контрактами
    ├── HelloWorld.ts           # Класс-обёртка для смарт-контракта
    └── HelloWorld.compile.ts   # Скрипт для компиляции контракта
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```ls title="Project structure"
Example/
├── contracts/           # Директория с кодом смарт-контрактов
│   └── hello_world.tolk # Файл основного контракта
├── scripts/             # Скрипты для развёртывания и взаимодействия в блокчейне
│   ├── deployHelloWorld.ts     # Скрипт для развёртывания контракта
│   └── incrementHelloWorld.ts  # Скрипт для взаимодействия с контрактом
├── tests/               # Директория с тестами для локального тестирования контрактов
│   └── HelloWorld.spec.ts      # Спецификации тестов для контракта
└── wrappers/            # Обёртки на TypeScript для взаимодействия с контрактами
    ├── HelloWorld.ts           # Класс-обёртка для смарт-контракта
    └── HelloWorld.compile.ts   # Скрипт для компиляции контракта
```
</TabItem>
</Tabs>

### `/contracts`

Эта директория содержит исходный код ваших смарт-контрактов, написанных на одном из доступных языков программирования для этой задачи.

### `/scripts`

Папка `scripts` содержит файлы на языке `TypeScript`, которые помогут вам разворачивать ваши смарт-контракты в блокчейне и взаимодействовать с ними, используя ранее реализованные обёртки.

### `/tests`

Этот каталог содержит тестовые файлы для ваших смарт-контрактов. Тестирование контрактов непосредственно в сети TON не является наилучшим вариантом, так как развёртывание требует некоторого количества времени и может приводить к потере средств. Эта тестовая площадка позволяет выполнять несколько смарт-контрактов и даже отправлять сообщения между ними в **"локальной сети"**. Тесты крайне важны, чтобы убедиться, чтобы ваши смарт-контракты действуют ожидаемым образом, до развёртывания их в сеть.

### `/wrappers`

Чтобы взаимодействовать с вашим смарт-контрактом извне блокчейна, вам нужно сериализовать и десериализовать отправленные ему сообщения. Классы категории `обёртки` разрабатывают для того, чтобы «зеркалировать» реализацию вашего смарт-контракта, делая его функциональность простой в использовании.

## Поток разработки

Почти любая разработка смарт-контракта состоит из пяти простых шагов:

1. Отредактируйте код контракта в папке `/contracts` и соберите его, запустив скрипт сборки:

```bash
npx blueprint build
```

2. Обновите обёртку смарт-контракта в папке `/wrappers`, чтобы она соответствовала изменениям в контракте.

3. Обновите тесты в папке `/tests`, чтобы убедиться в правильности новой функциональности, и запустите тестовый скрипт:

```bash
npx blueprint test
```

4. Повторите шаги 1-3, пока не достигнете желаемого результата.

5. Обновите сценарий развёртывания в папке `/scripts` и запустите его с помощью этой команды:

```bash
npx blueprint run
```

:::tip
Все примеры в этом руководстве следуют последовательности этих **1-3 шагов** с соответствующими образцами кода. **Шаг 5**, процесс развёртывания, описан в последнем разделе руководства: [Развёртывание в сети](/ru/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network/).
:::

Кроме того, вы всегда можете сгенерировать такую же структуру для другого смарт-контракта (если, например, вы хотите создать несколько контрактов, взаимодействующих друг с другом), используя следующую команду:

```bash
npx blueprint create PascalCase # Don't forget to name the contract in PascalCase
```

## Следующий шаг

Теперь всё готово: пришло время начать писать смарт-контракты. Мы начнём с базовых задач: **хранения данных** и **get-методов**.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/storage-and-get-methods" colorType={'primary'} sizeType={'sm'}>

  Хранение данных и get-методы

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";

# Развёртывание в сеть

> **Резюме:** В предыдущих этапах мы разработали и протестировали наши смарт-контракты, убедившись в их корректности.

В этой части руководства мы приступим к развёртыванию ранее разработанных смарт-контрактов и рассмотрим взаимодействие с ними в блокчейне.

## Адрес и начальное состояние

Мы уже знаем, что [адрес](/ru/v3/documentation/smart-contracts/addresses/) — это уникальный идентификатор `смарт-контракта` в сети, используемый для отправки транзакций и верификации отправителя при получении. Однако мы пока что не обсуждали, как он возникает. Стандартная формула для адресов смарт-контрактов выглядит так:

**_address = hash(state_init(code, data))_**

Адрес смарт-контракта — это хэш, вычисленный из первоначальных кода и данных смарт-контракта. Из этого простого механизма есть несколько важных следствий:

### Вы уже знаете адрес

В TON любой адрес, не имеющий данных, рассматривается в состоянии `несуществующий` (`nonexistent`). Тем не менее, когда мы создавали новый кошелёк с помощью приложения в разделе [Начало работы](/v3/guidelines/quick-start/getting-started), мы могли получить адрес **будущего** смарт-контракта нашего кошелька в приложении ещё до его развёртывания и изучить его в эксплорере.

Причина в том, что создание вашей пары ключей (**приватного** и **публичного**) с помощью **мнемонической фразы**, где второй ключ является частью первоначальных данных смарт-контракта, делает `state_init` этого контракта полностью детерминированным:

- **code** будет одной из стандартных реализаций кошелька, таких как `v5r1`.
- **data** — это `public_key` вместе с другими полями, инициализированными по умолчанию.

Это позволяет рассчитать адрес смарт-контракта будущего кошелька.

### Магический элемент хранилища

В предыдущих шагах мы сознательно не объясняли назначение `ctx_id` и `ID`, хранимых в состоянии нашего смарт-контракта, и то, почему они оставались нетронутыми во всех функциях смарт-контракта. Теперь их предназначение должно стать яснее.

Вспомним, что нельзя развернуть много разных смарт-контрактов с одним и тем же `state_init` — получится одинаковый контракт с одним адресом. Поэтому единственный способ предоставить всем вам один и тот же исходный код и **"одинаковые"** исходные данные — добавить в `state_init` отдельное поле, обеспечивающее дополнительную уникальность. В случае кошелька это даёт вам возможность использовать одну и ту же пару ключей для нескольких смарт-контрактов кошелька.

### Одно, чтоб править ими всеми

Если вы уже предположили, что поле `ID` является обязательным для любого смарт-контракта, есть и другая возможность, которая может изменить ваше мнение. Рассмотрим раздел инициализации ранее разработанного контракта `CounterInternal`:

```tact
init(id: Int, owner: Address) {
    self.id = id;
    self.counter = 0;
    self.owner = owner;
}
```

Если мы удалим поле `id` из его первоначального состояния хранилища, то сможем быть уверенными, что для определённого владельца может существовать **только один** смарт-контракт `CounterInternal`.

:::info Токены
Этот механизм играет ключевую роль в [обработке Jetton](/ru/v3/guidelines/dapps/asset-processing/jettons/). Каждый токен, не являющийся нативным (Jetton), требует наличия собственного `Jetton Wallet` для определённого владельца и, следовательно, предоставляет для него вычислимый адрес, создавая **схему звезды** с базовым кошельком в центре.
:::

## Реализация

Теперь, когда наши контракты полностью протестированы, мы готовы развернуть их в TON. В `Blueprint` этот процесс выглядит одинаково для `мейннета` и `тестнета`, а также для любого из языков в этом гайде: `FunC` и `Tolk`.

### Шаг 1: обновить скрипт установки

Скрипты установки опираются на те же обёртки, которые вы использовали в скриптах тестирования. Мы будем использовать один общий скрипт для развёртывания обоих ранее разработанных смарт-контрактов. Обновите `deployHelloWorld.ts` этим кодом:

```typescript title="/scripts/deployHelloWorld.ts"
// @version TypeScript 5.8.3
import { toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const helloWorld = provider.open(
        HelloWorld.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                ctxCounter: 0,
                ctxCounterExt: 0n,
            },
            await compile('HelloWorld')
        )
    );

    await helloWorld.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(helloWorld.address);

    console.log('ID', await helloWorld.getID());
}
```

### Шаг 2: запустите скрипт развёртывания

Вы можете запустить скрипт, введя следующую команду:

```bash
npx blueprint run deployHelloWorld
```

### Шаг 3: выберите сеть

После этого вы увидите интерактивное меню, позволяющее выбрать сеть:

```bash
? Which network do you want to use? (Use arrow keys)
  mainnet
❯ testnet
  custom
```

:::danger
Перед развёртыванием в `мейннете` убедитесь, что ваши смарт-контракты соответствуют [мерам безопасности](/ru/v3/guidelines/smart-contracts/security/overview/). Как мы уже говорили ранее, смарт-контракт `HelloWorld` им **не соответствует**.
:::

### Шаг 4: выберите приложение кошелька

Далее выберите способ доступа к вашему кошельку. Самый простой способ сделать это — использовать [TON Connect](/v3/guidelines/ton-connect/overview/) и одно из самых популярных приложений кошельков: `TonKeeper`, `MyTonWallet`, или `Tonhub`.

```bash
? Which wallet are you using? (Use arrow keys)
❯ TON Connect compatible mobile wallet (example: Tonkeeper) 
  Create a ton:// deep link 
  Mnemonic

? Choose your wallet (Use arrow keys)
❯ Tonkeeper 
  MyTonWallet 
  Tonhub
```

Наконец, отсканируйте QR-код в терминале через приложение кошелька и подключите кошелёк. После того, как вы сделали это впервые в проекте, этот шаг будет пропускаться.

Вы будете получать запрос на транзакцию в вашем приложении кошелька каждый раз, когда ваш код требует валюты для транзакции.

### Шаг 5: наблюдайте ваш смарт-контракт в сети

После того, как вы подтвердите запрос в вашем кошельке и дождётесь развёртывания, вы увидите сообщение со ссылкой на просмотр вашего недавно развёрнутого смарт-контракта в эксплорере:

```bash
Contract deployed at address EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
You can view it at https://testnet.tonscan.org/address/EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
```

**Поздравляем!** Ваш собственный `смарт-контракт` готов исполнять `get-методы` так же, как это делал ваш кошелёк в разделе [Как начать](/v3/guidelines/quick-start/getting-started#navigation-tabs/). И он может исполнять `транзакции` так же, как описано в разделе о [взаимодействии с блокчейном](/ru/v3/guidelines/quick-start/blockchain-interaction/reading-from-network) — если вы ещё его не читали, это полезно сделать, чтобы понять, как взаимодействовать со `смарт-контрактами` извне блокчейна.

:::tip
Использование Blueprint и приложений кошельков — не единственный вариант. Вы можете создать сообщение со [state_init](/ru/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) самостоятельно. Более того, вы даже можете сделать это с помощью [внутреннего сообщения](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) от смарт-контракта.
:::

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Feedback from "@site/src/components/Feedback";
import Button from '@site/src/components/button'

# Обработка сообщений

> **Резюме:** В предыдущих шагах мы изменили взаимодействие нашего смарт-контракт с `хранилищем`, `get-методы`, и изучили базовый поток разработки смарт-контрактов.

Теперь мы готовы перейти к основным функциям смарт-контрактов — **отправке и получению сообщений**. В TON сообщения используются не только для отправки валюты, но и в качестве механизма обмена данными между смарт-контрактами, что делает их ключевыми в разработке смарт-контрактов.

:::tip
Если вы застряли на некоторых примерах, вы можете найти исходный шаблон проекта со всеми изменениями, внесёнными в этом руководстве, [здесь](https://github.com/ton-community/onboarding-sandbox/tree/main/quick-start/smart-contracts/Example/contracts).
:::

---

## Внутренние сообщения

Прежде чем приступить к реализации, давайте кратко опишем основные пути и шаблоны, которые мы можем использовать для обработки внутренних сообщений.

### Акторы и роли

Поскольку TON реализует [модель акторов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/#single-actor/), довольно естественно думать об отношениях смарт-контрактов в контексте ролей, определяющих, кому можно обращаться к определённой функциональности смарт-контракта. Самые распространённые примеры ролей:

- `кто угодно`: любой контракт без специально выделенной роли.
- `владелец`: контракт, который обладает исключительным доступом к некоторым ключевым частям функциональности.

Давайте рассмотрим сигнатуру функции `recv_internal` для понимания того, как мы можем использовать это:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func
() recv_internal(int my_balance, int msg_value, cell in_msg_full, ломтик in_msg_body) нарушает
```
 - `my_balance` - смарт-контрактный баланс при начале транзакции.
 - `msg_value` - средства, полученные с сообщением.
 - `in_msg_full` - `ячейка`, включающая "заголовочные" поля сообщения.
 - `in_msg_body` - [slice](/ru/v3/documentation/smart-contracts/func/docs/types#atomic-types) содержит тело сообщения.
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk
fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice)
```
 - `myBalance` - баланс смарт-контракта при попрошайничестве транзакции.
 - `msgValue` - средства, полученные с сообщением.
 - `msgFull` - `cell` с полями "header" сообщения.
 - `msgBody` - [slice](/v3/documentation/smart-contracts/func/docs/types#atomic-types) захват сообщения payload pf.
</TabItem>
</Tabs>

:::info
Вы можете найти полное описание отправки сообщений в этом [разделе](/ru/v3/documentation/smart-contracts/message-management/sending-messages#%D0%BC%D0%B0%D0%BA%D0%B5%D1%82-%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F).
:::

Из всего этого нам сейчас интересен исходный адрес сообщения, который мы можем извлечь из ячейки `msg_full`. Получив этот адрес и сравнив его с хранимым, мы при выполнении требуемого условия можем разрешить доступ к важнейшим частям функциональности нашего смарт-контракта. Обычный подход выглядит следующим образом:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func
;; Это не часть проекта, просто пример.
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ; Разобрать адрес отправителя из in_msg_full
    см = in_msg_full. egin_parse();
    int flags = cs~load_uint(4);
    slice sender_address = cs~load_msg_addr();

    ;; check if message was send by owner
    if (equal_slices_bits(sender_address, owner_address)) {
      ;;owner operations
      return
    } else if (equal_slices_bits(sender_address, other_role_address)){
      ;;other role operations
      return
    } else {
      ;;anyone else operations
      return
    }

;;no known operation were obtained for presented role
;;0xffff is not standard exit code, but is standard practice among TON developers
throw(0xffff);
}

```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk
// This is NOT a part of the project, just an example.
fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    // Parse the sender address from in_msg_full
    var cs: slice = msgFull.beginParse();
    val flags = cs.loadMessageFlags();
    var sender_address = cs~load_msg_address();

    if (isSliceBitsEqual(sender_address, owner_address)) {
      // owner operations
      return
    } else if (isSliceBitsEqual(sender_address, other_role_address)){
      // other role operations
      return
    } else {
      // anyone else operations
      return
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}
````

</TabItem></Tabs>

### Операции

Обычный шаблон контрактов в TON — включать **32-битный код операции** в тела сообщений, который сообщает вашему контракту, какие действия необходимо выполнить:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func
;; Это не часть проекта, просто пример!
const int op::increment = 1;
const int op::decrement = 2;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ; Шаг 1: Проверим, является ли сообщение пустым
    if (in_msg_body. lice_empty?()) {
        return; ;; Ничего не делаем с пустыми сообщениями
    }

;; Step 2: Extract the operation code
int op = in_msg_body~load_uint(32);

;; Step 3-7: Handle the requested operation
if (op == op::increment) {
    increment();   ;;call to specific operation handler
    return;
} else if (op == op::decrement) {
    decrement();
    ;; Just accept the money
    return;
}

;; Unknown operation
throw(0xffff);
}

```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk
//This is NOT a part of the project, just an example!
const op::increment : int = 1;
const op::decrement : int = 2;

fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    // Step 1: Check if the message is empty
    if (slice.isEndOfSlice()) {
        return; // Nothing to do with empty messages
    }

    // Step 2: Extract the operation code
    var op = in_msg_body~load_uint(32);

    // Step 3-7: Handle the requested operation
    if (op == op::increment) {
        increment();   //call to specific operation handler
        return;
    } else if (op == op::decrement) {
        decrement();
        // Just accept the money
        return;
    }

    // Unknown operation
    throw(0xffff);
}
````

</TabItem></Tabs>

Объединяя оба этих шаблона, вы можете добиться полного описания систем ваших смарт-контрактов, обеспечив безопасное взаимодействие между ними и раскрыв полностью потенциал модели акторов в TON.

## Внешние сообщения

`Внешние сообщения` — это единственный способ обращения к логике смарт-контракта извне блокчейна. Обычно нет необходимости реализовывать его в смарт-контрактах, потому что в большинстве случаев не требуется, чтобы внешние точки входа были доступны кому-либо, кроме вас. Если вам этого достаточно, то стандартным способом будет делегировать эту ответственность отдельному актору — [кошельку](v3/documentation/smart-contracts/contracts-specs/wallet-contracts#basic-wallets/), для которого они в основном и были спроектированы.

В разработке внешних endpoints есть несколько стандартных [подходов](/v3/documentation/smart-contracts/message-management/external-messages/) и [мер безопасности](/ru/v3/guidelines/smart-contracts/security/overview/), которые сейчас для вас могут быть излишне сложными. Поэтому в этом руководстве мы реализуем увеличение раннее добавленного числа `ctx_counter_ext`.

:::danger
Эта реализация **небезопасна** и может привести к потере средств на вашем контракте. Не разворачивайте такой контракт в `мейннете`, особенно с крупной суммой средств на балансе.
:::

## Реализация

Давайте изменим наш смарт-контракт по стандартным шагам из раздела [Обзор Blueprint](/ru/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview/), чтобы он мог получать внешние сообщения.

### Шаг 1: редактирование кода смарт-контракта

Добавьте функцию `recv_external` в смарт-контракт `HelloWorld`:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
() recv_external(slice in_msg) impure {
    accept_message();
    var (ctx_id, ctx_counter, ctx_counter_ext) = load_data();

    var query_id = in_msg~load_uint(64);
    var addr = in_msg~load_msg_addr();
    var coins = in_msg~load_coins();
    var increase_by = in_msg~load_uint(32);

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(coins)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::increase, 32)
        .store_uint(query_id, 64)
        .store_uint(increase_by, 32);
    send_raw_message(msg.end_cell(), 0);

    ctx_counter_ext += increase_by;
    save_data(ctx_id, ctx_counter, ctx_counter_ext);

    return ();
}

```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/HelloWorld.tolk"
fun acceptExternalMessage(): void
    asm "ACCEPT";

fun onExternalMessage(inMsg: slice) {
    acceptExternalMessage();
    var (ctxId, ctxCounter, ctxCounterExt) = loadData();

    var queryId = inMsg.loadUint(64);
    var addr = inMsg.loadAddress();
    var coins = inMsg.loadCoins();
    var increaseBy = inMsg.loadUint(32);

    var msg = beginCell()
        .storeUint(0x18, 6)
        .storeSlice(addr)
        .storeCoins(coins)
        .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .storeUint(OP_INCREASE, 32)
        .storeUint(queryId, 64)
        .storeUint(increaseBy, 32);
    sendRawMessage(msg.endCell(), 0);

    ctxCounterExt += increaseBy;
    saveData(ctxId, ctxCounter, ctxCounterExt);

    return ();
}
````

</TabItem></Tabs>

Эта функция при получении внешнего сообщения увеличит нашу переменную `ctx_counter_ext` и отправит внутреннее сообщение на указанный адрес с операцией `increase`.

Проверьте, что код смарт-контракта верен, запустив:

```bash
npx blueprint build
```

Ожидаемый вывод должен выглядеть следующим образом:

```bash
✅ Compiled successfully! Cell BOC result:

{
  "hash": "310e49288a12dbc3c0ff56113a3535184f76c9e931662ded159e4a25be1fa28b",
  "hashBase64": "MQ5JKIoS28PA/1YROjU1GE92yekxZi3tFZ5KJb4foos=",
  "hex": "b5ee9c7241010e0100d0000114ff00f4a413f4bcf2c80b01020120020d02014803080202ce0407020120050600651b088831c02456f8007434c0cc1caa42644c383c0040f4c7f4cfcc4060841fa1d93beea5f4c7cc28163c00b817c12103fcbc2000153b513434c7f4c7f4fff4600017402c8cb1fcb1fcbffc9ed548020120090a000dbe7657800b60940201580b0c000bb5473e002b70000db63ffe002606300072f2f800f00103d33ffa40fa00d31f30c8801801cb055003cf1601fa027001cb6a82107e8764ef01cb1f12cb3f5210cb1fc970fb0013a012f0020844ca0a"
}

✅ Wrote compilation artifact to build/HelloWorld.compiled.json
```

### Шаг 2: обновить обёртку

Добавьте метод обёртки, который можно будет вызывать через наш класс обёртки для отправки внешних сообщений:

```typescript title="/wrappers/HelloWorld.ts"
async sendExternalIncrease(
    provider: ContractProvider,
    opts: {
        increaseBy: number;
        value: bigint;
        addr: Address;
        queryID?: number;
    }
) {
    const message = beginCell()
        .storeUint(opts.queryID ?? 0, 64)
        .storeAddress(opts.addr)
        .storeCoins(opts.value)
        .storeUint(opts.increaseBy, 32)
    .endCell()

    return await provider.external(message);
}
```

### Шаг 3: обновить тест

Обновите тест, чтобы убедиться, что контракт `HelloWorld` получил внешнее сообщение и обновил свои счётчики:

```typescript title="/tests/HelloWorld.spec.ts"
//@version TypeScript 5.8.3
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano} from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HelloWorld', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HelloWorld');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let helloWorld: SandboxContract<HelloWorld>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(
            HelloWorld.createFromConfig(
                {
                    id: 0,
                    ctxCounter: 0,
                    ctxCounterExt: 0n,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.sendDeploy(deployer.getSender(), toNano('1.00'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should receive external message and update counter', async () => {
        const [__, counterExtBefore] = await helloWorld.getCounters()
        const increase = 5;

        const result = await helloWorld.sendExternalIncrease({
            increaseBy: increase,
            value: toNano(0.05),
            addr: deployer.address, // Using deployer address
            queryID: 0
        });

        expect(result.transactions).toHaveTransaction({
            from: undefined, // External messages have no 'from' address
            to: helloWorld.address,
            success: true,
        });

        const [_, counterExt] = await helloWorld.getCounters()
        expect(counterExtBefore + BigInt(increase)).toBe(counterExt);
    });
});
```

{/*Этот тест описывает стандартный поток транзакций любой `многоконтрактной` системы:

1. Отправьте внешнее сообщение для обращения к логике смарт-контракта извне блокчейна.
2. Инициируйте отправку одного или нескольких внутренних сообщений другим контрактам.  
3. После получения внутреннего сообщения измените состояние контракта и повторите **шаг 2**, если требуется.

Поскольку результирующая последовательность транзакций может быть сложной для понимания, полезной практикой будет создать `диаграмму последовательности`, описывающую вашу систему. Вот пример нашего случая:

<div style={{marginBottom: '30px'}} align="center">
  <img src="/img/tutorials/quick-start/multi-contract.png" alt="Multi-contract scheme"/>
</div>*/}

Проверьте, что все примеры верны, запустив тестовый скрипт:

```bash
npx blueprint test
```

Ожидаемый вывод должен выглядеть примерно так:

```bash
 PASS  tests/HelloWorld.spec.ts
  HelloWorld
    ✓ should receive external message and update counter (251 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.841 s, estimated 2 s
Ran all test suites.

```

## Следующий шаг

Теперь, когда вы понимаете, как смарт-контракты отправляют и получают сообщения, вы можете **развернуть свой контракт** в блокчейне TON.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network" colorType={'primary'} sizeType={'sm'}>

  Развёртывание в сети

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/storage-and-get-methods.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/storage-and-get-methods.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Хранение данных и get-методы

> **Резюме:** На предыдущих этапах мы узнали, как использовать `Blueprint` и его структуру проекта.

:::tip
Если вы застрянете на любом из примеров, вы можете найти исходный шаблон проекта со всеми изменениями, сделанными в этом руководстве, [здесь](https://github.com/ton-community/onboarding-sandbox/tree/main/quick-start/smart-contracts/Example/contracts).
:::

Почти все смарт-контракты должны хранить свои `данные` между транзакциями. В этом руководстве объясняются стандартные способы управления `хранилищем` для смарт-контрактов и как использовать `get-методы` для доступа к нему извне блокчейна.

## Операции хранения в смарт-контрактах

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
Есть две основные инструкции, обеспечивающие доступ к хранилищу смарт-контракта:

- `get_data()` возвращает текущую ячейку хранения.
- `set_data()` записывает ячейку хранения.

</TabItem>
<TabItem value="Tolk" label="Tolk">
Есть две основные инструкции, обеспечивающие доступ к хранилищу смарт-контракта:

- `getContractData()` возвращает текущую \`ячейку\`\`	 хранения.
- `setContractData()` записывает `ячейку` хранения.

</TabItem></Tabs>

Давайте изучим структуру [ячейки](/ru/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), чтобы понимать, как управлять хранилищем контракта:

## Структура ячейки

Блокчейн TON использует структуру данных **Ячейка** в качестве фундаментальной единицы для хранения данных. Ячейки являются «строительными блоками» данных смарт-контрактов и обладают следующими характеристиками:

- Ячейка может хранить до 1023 бит (примерно 128 байт) данных.
- Ячейка может содержать ссылки на дочерние ячейки количеством до 4 штук.
- После своего создания Ячейка неизменяема.

Вы можете рассматривать Ячейку как следующую структуру:

```typescript
// Conceptual representation of a Cell
interface Cell {
  bits: BitString; // Up to 1023 bits
  refs: Cell[];    // Up to 4 child cells
}
```

## Реализация

Давайте изменим наш смарт-контракт в соответствии со стандартными шагами, описанными в разделе [Обзор Blueprint](/ru/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview/).

### Шаг 1: редактирование кода смарт-контракта

Если ручная сериализация и десериализация ячейки хранения становятся неудобны, стандартная практика заключается в создании двух методов-«обёрток», которые обрабатывают эту логику. Если вы не меняли код смарт-контракта, он должен включать следующие строки в `/contracts/hello_world.fc`:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
global int ctx_id;
global int ctx_counter;

;; load_data присваивает значения переменным хранения, используя хранимые данные
() load_data() impure {
    var ds = get_data().begin_parse();
    ctx_id = ds~load_uint(32);
    ctx_counter = ds~load_uint(32);
    ds.end_parse();
}

;; save_data сохраняет значения переменных хранения в постоянное хранилище в формате ячейки 
() save_data() impure {
    set_data(
        begin_cell()
            . tore_uint(ctx_id, 32)
            . tore_uint(ctx_counter, 32)
            .end_cell()
    );
}

```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
global ctxID: int;
global ctxCounter: int;

// loadData populates storage variables from persistent storage
fun loadData() {
    var ds = getContractData().beginParse();

    ctxID = ds.loadUint(32);
    ctxCounter = ds.loadUint(32);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
        .storeUint(ctxID, 32)
        .storeUint(ctxCounter, 32)
        .endCell());
}
```

</TabItem>
</Tabs>

#### Управление хранилищем

Давайте немного изменим наш пример, использовав другой распространённый подход к управлению хранением данных при разработке смарт-контрактов:

Вместо инициализации глобальных переменных мы:

1. Будем передавать элементы хранимых данных как параметры функции `save_data(members...)`.
2. Будем получать их с помощью `(members...) = get_data()`.
3. Переместим глобальные переменные `ctx_id` и `ctx_counter` в тело метода.

Также давайте добавим еще **256-битное целое число** в наше хранилище как глобальную переменную `ctx_counter_ext`. Изменённая реализация должна выглядеть следующим образом:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
(int, int, int) load_data() {
    var ds = get_data().begin_parse();
    int ctx_id = ds~load_uint(32);
    int ctx_counter = ds~load_uint(32);
    int ctx_counter_ext = ds~load_uint(256);

    ds.end_parse();

    return (ctx_id, ctx_counter, ctx_counter_ext);
}

() save_data(int ctx_id, int ctx_counter, int ctx_counter_ext) impure {
    set_data(
        begin_cell()
            . tore_uint(ctx_id, 32)
            . tore_uint(ctx_counter, 32)
            . tore_uint(ctx_counter_ext, 256)
        .end_cell()
    );
}

```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
// load_data retrieves variables from TVM storage cell
// impure because of writting into global variables
fun loadData(): (int, int, int) {
    var ds = getContractData().beginParse();

    // id is required to be able to create different instances of counters
    // since addresses in TON depend on the initial state of the contract
    var ctxID = ds.loadUint(32);
    var ctxCounter = ds.loadUint(32);
    var ctxCounterExt = ds.loadUint(256);

    ds.assertEndOfSlice();

    return (ctxID, ctxCounter, ctxCounterExt);
}

// saveData stores storage variables as a cell into persistent storage
fun saveData(ctxID: int, ctxCounter: int, ctxCounterExt: int) {
    setContractData(
        beginCell()
        .storeUint(ctxID, 32)
        .storeUint(ctxCounter, 32)
        .storeUint(ctxCounterExt, 256)
        .endCell()
    );
}
````

</TabItem></Tabs>

Не забудьте:

1. Удалить глобальные переменные `ctx_id` и `ctx_counter`
2. Обновить использование функции, скопировав членов хранилища локально, как показано здесь:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
;; load_data() on:
var (ctx_id, ctx_counter, ctx_counter_ext) = load_data();

;; save_data() on:
save_data(ctx_id, ctx_counter, ctx_counter_ext);

````
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
// loadData() on:
var (ctxID, ctxCounter, ctxCounterExt) = loadData();

// saveData() on:
saveData(ctxID, ctxCounter, ctxCounterExt);
````

</TabItem></Tabs>

#### Get-методы

Главная цель `get-методов` — предоставить внешний доступ для чтения данных хранилища с помощью удобного интерфейса. Главным образом для того, чтобы извлечь информацию, необходимую для подготовки **транзакций**.
Давайте добавим getter-функцию, которая возвращает оба значения счётчиков, сохранённые в смарт-контракте.

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world. c"
(int, int) get_counters() method_id {
    var (_, ctx_counter, ctx_counter_ext) = load_data();
    return (ctx_counter, ctx_counter_ext);
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world. olk"
get get_counters(): (int, int) {
    var (_, ctxCounter, ctxCounterExt) = loadData();
    return (ctxCounter, ctxCounterExt);
}
```
</TabItem>
</Tabs>

И не забудьте обновить переменные в get-методах, чтобы они совпадали с распаковкой из `load_data()`.

<Tabs groupId="language">
  <TabItem value="FunC" label="FunC">
    ```func title="/contracts/hello_world.fc"
    int get_counter() method_id {
    var (_, ctx_counter, _) = load_data();
    return ctx_counter;
  }

    int get_id() method_id {
    var (ctx_id, _, _) = load_data();
    return ctx_id;
  }
    ```
  </TabItem>
  <TabItem value="Tolk" label="Tolk">
    ```tolk title="/contracts/hello_world.tolk"
    get currentCounter(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxCounter;
  }

    get initialId(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxID;
  }
    ```
  </TabItem>
</Tabs>

И это все! На практике все **get-методы** следуют этому прямолинейному паттерну и не требуют дополнительной сложности. Помните, что вы можете проигнорировать возвращаемые значения, используя синтаксис заглушки `_`.

Окончательная реализация смарт-контракта:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
#include "imports/stdlib.fc";

const op::increase = "op::increase"c; ;; создайте opcode из строки, используя префикс "c", в данном случае это приводит к opcode 0x7e8764ef

(int, int, int) load_data() {
    var ds = get_data().begin_parse();

    int ctx_id = ds~load_uint(32);
    int ctx_counter = ds~load_uint(32);
    int ctx_counter_ext = ds~load_uint(256);

    ds.end_parse();

    return (ctx_id, ctx_counter, ctx_counter_ext);
}

() save_data(int ctx_id, int ctx_counter, int ctx_counter_ext) impure {
    set_data(
        begin_cell()
            . tore_uint(ctx_id, 32)
            . tore_uint(ctx_counter, 32)
            . tore_uint(ctx_counter_ext, 256)
        .end_cell()
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore all empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }

    var (ctx_id, ctx_counter, ctx_counter_ext) = load_data(); ;; here we populate the storage variables

    int op = in_msg_body~load_uint(32); ;; by convention, the first 32 bits of incoming message is the op
    int query_id = in_msg_body~load_uint(64); ;; also by convention, the next 64 bits contain the "query id", although this is not always the case

    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data(ctx_id, ctx_counter, ctx_counter_ext);
        return ();
    }

    throw(0xffff); ;; if the message contains an op that is not known to this contract, we throw
}

int get_counter() method_id {
    var (_, ctx_counter, _) = load_data();
    return ctx_counter;
}

int get_id() method_id {
    var (ctx_id, _, _) = load_data();
    return ctx_id;
}

(int, int) get_counters() method_id {
    var (_, ctx_counter, ctx_counter_ext) = load_data();
    return (ctx_counter, ctx_counter_ext);
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
const OP_INCREASE = 0x7e8764ef;  // arbitrary 32-bit number, equal to OP_INCREASE in wrappers/CounterContract.ts

fun loadData(): (int, int, int) {
    var ds = getContractData().beginParse();

    var ctxID = ds.loadUint(32);
    var ctxCounter = ds.loadUint(32);
    var ctxCounterExt = ds.loadUint(256);

    ds.assertEndOfSlice();

    return (ctxID, ctxCounter, ctxCounterExt);
}

fun saveData(ctxID: int, ctxCounter: int, ctxCounterExt: int) {
    setContractData(
        beginCell()
        .storeUint(ctxID, 32)
        .storeUint(ctxCounter, 32)
        .storeUint(ctxCounterExt, 256)
        .endCell()
    );
}

fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    if (msgBody.isEndOfSlice()) { // ignore all empty messages
        return;
    }

    var cs: slice = msgFull.beginParse();
    val flags = cs.loadMessageFlags();
    if (isMessageBounced(flags)) { // ignore all bounced messages
        return;
    }

    var (ctxID, ctxCounter, ctxCounterExt) = loadData(); // here we populate the storage variables

    val op = msgBody.loadMessageOp(); // by convention, the first 32 bits of incoming message is the op
    val queryID = msgBody.loadMessageQueryId(); // also by convention, the next 64 bits contain the "query id", although this is not always the case

    if (op == OP_INCREASE) {
        val increaseBy = msgBody.loadUint(32);
        ctxCounter += increaseBy;
        saveData(ctxID, ctxCounter, ctxCounterExt);
        return;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

get currentCounter(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxCounter;
}

get initialId(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxID;
}

get get_counters(): (int, int) {
    var (_, ctxCounter, ctxCounterExt) = loadData();
    return (ctxCounter, ctxCounterExt);
}
````

</TabItem></Tabs>

Прежде чем продолжить, проверьте ваши изменения, скомпилировав смарт-контракт:

```bash
npx blueprint build
```

Ожидаемый вывод должен выглядеть примерно так:

```bash
Build script running, compiling HelloWorld

✅ Compiled successfully! Cell BOC result:

{
  "hash": "310e49288a12dbc3c0ff56113a3535184f76c9e931662ded159e4a25be1fa28b",
  "hashBase64": "MQ5JKIoS28PA/1YROjU1GE92yekxZi3tFZ5KJb4foos=",
  "hex": "b5ee9c7241010e0100d0000114ff00f4a413f4bcf2c80b01020120020d02014803080202ce0407020120050600651b088831c02456f8007434c0cc1caa42644c383c0040f4c7f4cfcc4060841fa1d93beea5f4c7cc28163c00b817c12103fcbc2000153b513434c7f4c7f4fff4600017402c8cb1fcb1fcbffc9ed548020120090a000dbe7657800b60940201580b0c000bb5473e002b70000db63ffe002606300072f2f800f00103d33ffa40fa00d31f30c8801801cb055003cf1601fa027001cb6a82107e8764ef01cb1f12cb3f5210cb1fc970fb0013a012f0020844ca0a"
}

✅ Wrote compilation artifact to build/HelloWorld.compiled.json
```

Это означает, что HelloWorld был успешно скомпилирован. Был создан хэш и скомпилированный код был сохранён в файле `build/HelloWorld.compiled.json`.

### Шаг 2: обновить обёртку

Далее мы обновим наш класс-обёртку, чтобы он соответствовал новому подходу к хранилищу и `get-методу`. Нам необходимо:

1. Изменить функцию `helloWorldConfigToCell`.
2. Обновить тип `HelloWorldConfig`.
3. Убедиться в правильности инициализации хранилища при создании контракта.
4. Включить 256-битное поле `ctxCounterExt`, которое мы добавили ранее.

Эти изменения будут соответствовать нашим изменениям смарт-контракта.

```typescript title="/wrappers/HelloWorld.ts"
// @version TypeScript 5.8.3
export type HelloWorldConfig = {
    id: number;
    ctxCounter: number;
    ctxCounterExt: bigint;
};

export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeUint(config.ctxCounter, 32)
        .storeUint(config.ctxCounterExt, 256)
    .endCell();
}
```

Затем реализуйте метод для вызова нового гет-метода `get_counters`, который получает значения обоих счётчиков в одном запросе:

```typescript title="/HelloWorld.ts"
async getCounters(provider: ContractProvider) : Promise<[number, bigint]> {
    const result = await provider.get('get_counters', []);
    const counter = result.stack.readNumber();
    const counterExt = result.stack.readBigNumber();

    return [counter, counterExt]
}
```

### Шаг 3: обновить тесты

Наконец, давайте протестируем новую функциональность, используя нашу обновлённую обёртку:

1. Инициализируйте хранилище контракта, создав `helloWorldConfig` с тестовыми значениями.
2. Выполнить каждый `get-метод` для извлечения сохранённых данных.
3. Проверить, что значения соответствуют изначальной конфигурации.

Пример реализации:

```typescript title="/tests/HelloWorld.spec.ts"
// @version TypeScript 5.8.3
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano} from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HelloWorld', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HelloWorld');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let helloWorld: SandboxContract<HelloWorld>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(
            HelloWorld.createFromConfig(
                {
                    id: 0,
                    ctxCounter: 0,
                    ctxCounterExt: 0n,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.sendDeploy(deployer.getSender(), toNano('1.00'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should correctly initialize and return the initial data', async () => {
        // Define the expected initial values (same as in beforeEach)
        const expectedConfig = {
            id: 0,
            counter: 0,
            counterExt: 0n
        };

        // Log the initial configuration values before verification
        console.log('Initial configuration values (before deployment):');
        console.log('- ID:', expectedConfig.id);
        console.log('- Counter:', expectedConfig.counter);
        console.log('- CounterExt:', expectedConfig.counterExt);

        console.log('Retrieved values after deployment:');
        // Verify counter value
        const counter = await helloWorld.getCounter();
        console.log('- Counter:', counter);
        expect(counter).toBe(expectedConfig.counter);

        // Verify ID value
        const id = await helloWorld.getID();
        console.log('- ID:', id);
        expect(id).toBe(expectedConfig.id);

        // Verify counterExt
        const [_, counterExt] = await helloWorld.getCounters();
        console.log('- CounterExt', counterExt);
        expect(counterExt).toBe(expectedConfig.counterExt);
    });

    // ... previous tests
});
```

Теперь вы можете запустить новый тестовый скрипт с помощью этой команды:

```bash
npx blueprint test
```

Ожидаемый вывод должен выглядеть примерно так:

```bash
# "custom log messages"

 PASS  tests/HelloWorld.spec.ts
  HelloWorld
    ✓ should correctly initialize and return the initial data (431 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.591 s, estimated 6 s
```

## Следующий шаг

Вы написали свой первый смарт-контракт с помощью FunC или Tolk, протестировали его и изучили, как работают хранение данных и get-методы.

Теперь пришло время перейти к одной из самых важных частей смарт-контрактов – **обработке сообщений:** их отправке и получению.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages" colorType={'primary'} sizeType={'sm'}>

  Обработка сообщений

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/setup-environment.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/setup-environment.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Button from '@site/src/components/button'

# Настройте среду разработки

> **Резюме:** В предыдущих шагах мы изучили концепцию смарт-контракта и основные способы взаимодействия с блокчейном TON с помощью **приложений кошельков** и **эксплореров**.

Это руководство описывает основные шаги настройки вашей среды разработки смарт-контрактов с помощью **`Blueprint`** и создания базового шаблона проекта.

## Что требуется для прохождения

- Базовые навыки программирования.
- Знакомство с командной строкой.

## Настройка среды разработки

В этом руководстве мы используем [Blueprint](https://github.com/ton-org/blueprint/) и стек [Node.js](https://nodejs.org/en)/TypeScript для написания обёрток, тестов и скриптов развёртывания вашего смарт-контракта. Это обеспечивает самую лёгкую и готовую среду для разработки смарт-контрактов.

:::info

Использование нативных инструментов и языко-специфичных SDK для разработки смарт-контрактов рассмотрено в разделах документации более продвинутого уровня:

- [Компилируйте и собирайте смарт-контракты в TON](/ru/v3/documentation/archive/compile#ton-compiler/).
- [Создайте исходное состояние для развёртывания](/ru/v3/guidelines/smart-contracts/howto/wallet#creating-the-state-init-for-deployment/).
  :::

### Шаг 1: установите Node.js

Сначала посетите [страницу установки](https://nodejs.org/en/download) и выполните команды загрузки в `PowerShell` или `Bash`, в зависимости от вашей операционной системы (Windows/Linux).

Проверьте, установлены ли `npm` и `node`, с помощью следующей команды:

```bash
npm -v
node -v
```

### Шаг 2: выберите язык программирования для смарт-контрактов

В этом гайде мы приводим примеры на языках `FunC`, `Tolk` и `Tact`. Вы можете выбрать любой из них и даже комбинировать смарт-контракты на разных языках. Для дальнейшего изучения этого гайда не требуется глубокое понимание выбранного языка — достаточно будет базовых программистских знаний.

:::info
Краткий обзор языков доступен в разделе [Языки программирования](/ru/v3/documentation/smart-contracts/overview#языки-программирования)
:::

### Шаг 3: настройте Blueprint

Перейдите в родительскую директорию вашего будущего проекта и запустите следующую команду:

```bash
npm create ton@latest
```

Это запустит интерактивный скрипт для создания шаблона проекта. Вы можете ввести туда любые значения, но если хотите полностью следовать этому гайду, выберите такие:

1. **Project name** (название проекта): `Example`  
2. **First contract name** (название первого контракта): `HelloWorld`  
3. **Project template** (шаблон проекта): **simple counter contract** на `FunC`, `Tolk` или `Tact`

Наконец, измените текущую директорию на ту, которая была создана при генерации шаблона, и установите все необходимые зависимости:

```bash
cd ./Example
npm install
```

### Шаг 4 (опционально): установите поддержку в IDE или редакторе

Сообщество TON разработало плагины, которые поддерживают синтаксис в различных IDE и редакторах кода. Вы можете найти их на странице [Плагины для IDE](https://docs.ton.org/ru/v3/documentation/smart-contracts/getting-started/ide-plugins/).

Также вы можете установить плагины для IDE или редактора кода, которые поддерживают инструменты **JavaScript/TypeScript**, особенно `Jest` для отладки смарт-контрактов.

## Выберите язык программирования

Теперь, когда ваша среда настроена, выберите язык программирования, чтобы приступить:

- **FunC или Tolk**: предполагаемое время обучения 25 минут для каждого.
- **Tact**: предполагаемое время обучения 15 минут.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview" colorType="primary" sizeType={'sm'}>
  Начать с FunC или Tolk

</Button>

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview" colorType={'secondary'} sizeType={'sm'}>

  Начать с Tact

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Обзор Blueprint

> **Резюме:** На предыдущих этапах мы установили и настроили все инструменты, необходимые для разработки смарт-контрактов в TON, и создали наш первый шаблон проекта.

:::info
Мы рекомендуем установить расширение [Tact для VS Code](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact). Оно содержит подсветку синтаксиса, подсказки об ошибках, а также делает опыт разработки более гладким.
:::

Прежде чем приступить к разработке смарт-контракта, давайте кратко опишем структуру проекта и объясним, как использовать **`Blueprint`**.

## Структура проекта

:::warning
Если вы не выбрали предложенные названия на предыдущих шагах, то названия исходных файлов и некоторые сущности в коде могут отличаться.
:::

<Tabs groupId="language">
  <TabItem value="Tact" label="Tact">
    ```ls title="Структура проекта"
    Example/
    ├── contracts/           # Папка с кодом смарт-контрактов
    │   ├── hello_world.tact   # Файл основного контракта
    ├── scripts/             # Скрипты для развёртывания и взаимодействия в блокчейне 
    │   ├── deployHelloWorld.ts      # Скрипт для развёртывания контракта
    │   └── iincrementHelloWorld.ts  # Скрипт для взаимодействия с контрактом
    ├── tests/               # Папка с тестами для локального тестирования контрактов
    ├── HelloWorld.spec.ts      # Тестовые спецификации для контракта
    └── wrappers/            # Обёртки TypeScript для взаимодействия с контрактами
    ├── HelloWorld.ts            # Класс-обёртка для смарт-контракта
    └── HelloWorld.compile.ts    # Скрипт для компиляции контракта
    ```
  </TabItem>

</Tabs>

### `/contracts`

Эта папка содержит исходный код вашего контракта, написанный на одном из доступных в TON языков программирования для смарт-контрактов.

### `/scripts`

Папка `scripts` содержит файлы на языке `TypeScript`, которые помогут вам разворачивать ваши смарт-контрактами в блокчейне и взаимодействовать с ними, используя ранее реализованные обёртки.

### `/tests`

Этот каталог содержит тестовые файлы для ваших смарт-контрактов. Тестирование контрактов непосредственно в сети TON не является наилучшим вариантом, так как развёртывание требует некоторого количества времени и может приводить к потере средств. Эта тестовая площадка позволяет выполнять несколько смарт-контрактов и даже отправлять сообщения между ними в **"локальной сети"**. Тесты имеют критическое значение, чтобы до развёртывания смарт-контрактов в сеть убедиться, что они действуют ожидаемым образом.

### `/wrappers`

Чтобы взаимодействовать с вашим смарт-контрактом извне блокчейна, вам нужно сериализовать и десериализовать отправленные ему сообщения. `Обёртки` — это классы, разработанные, чтобы «зеркалировать» реализацию вашего смарт-контракта, делая его функциональность простой в использовании.

## Поток разработки

Почти любая разработка смарт-контрактов состоит из пяти простых шагов:

1. Отредактируйте код смарт-контракта в папке `/contracts` и соберите его, запустив скрипт сборки:

```bash
npx blueprint build
```

2. Обновите обёртку контракта в папке `/wrappers`, чтобы соответствовать изменениям в контракте.

3. Обновите тесты в папке `/tests`, чтобы проверить корректность новой функциональности, и запустите тестовый скрипт:

```bash
npx blueprint test
```

4. Повторите шаги 1-3, пока не достигнете желаемого результата.

5. Обновите сценарий развёртывания в папке `/scripts` и запустите его с помощью этой команды:

```bash
npx blueprint run
```

:::tip
Все примеры в этом гайде отражают последовательность **шагов 1-3** и приводят соответствующий код. А **шаг 5**, процесс развёртывания, освещён в последней части гайда: [Развёртывание в сеть](/ru/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network/).
:::

Кроме того, вы всегда можете сгенерировать такую же структуру для другого смарт-контракта (если, например, вы хотите создать несколько контрактов, взаимодействующих друг с другом), используя следующую команду:

```bash
npx blueprint create PascalCase # Don't forget to name the contract in PascalCase
```

## Следующий шаг

Теперь всё готово: пришло время начать писать смарт-контракты. Мы начнём с базовых задач: **хранения данных** и **get-методов**.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-storage-and-get-methods" colorType={'primary'} sizeType={'sm'}>

  Хранение данных и get-методы

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";

# Развёртывание в сеть

> **Резюме:** В предыдущих этапах мы разработали и протестировали наши смарт-контракты, убедившись в их корректности.

В этой части руководства мы приступим к развёртыванию ранее разработанных смарт-контрактов и рассмотрим взаимодействие с ними в блокчейне.

## Адрес и начальное состояние

Мы уже знаем, что [адрес](/ru/v3/documentation/smart-contracts/addresses/) — это уникальный идентификатор `смарт-контракта` в сети, используемый для отправки транзакций и верификации отправителя при получении. Однако мы пока что не обсуждали, как он возникает. Стандартная формула для адресов смарт-контрактов выглядит так:

**_address = hash(state_init(code, data))_**

Адрес смарт-контракта — это хэш, вычисленный из первоначальных кода и данных смарт-контракта. Из этого простого механизма есть несколько важных следствий:

### Вы уже знаете адрес

В TON любой адрес, не имеющий данных, рассматривается в состоянии `несуществующий` (`nonexistent`). Тем не менее, когда мы создавали новый кошелёк с помощью приложения в разделе [Начало работы](/v3/guidelines/quick-start/getting-started), мы могли получить адрес **будущего** смарт-контракта нашего кошелька в приложении ещё до его развёртывания и изучить его в эксплорере.

Причина в том, что создание вашей пары ключей (**приватного** и **публичного**) с помощью **мнемонической фразы**, где второй ключ является частью первоначальных данных смарт-контракта, делает `state_init` этого контракта полностью детерминированным:

- **code** будет одной из стандартных реализаций кошелька, таких как `v5r1`.
- **data** — это `public_key` вместе с другими полями, инициализированными по умолчанию.

Это позволяет рассчитать адрес смарт-контракта будущего кошелька.

### Магический элемент хранилища

В предыдущих шагах, мы сознательно не объясняли назначение `ctxID` и `ID`, хранимых в состоянии нашего смарт-контракта, и почему они оставались нетронутыми во всех функциях смарт-контракта. Теперь их предназначение должно стать яснее.

Вспомним, что нельзя развернуть много разных смарт-контрактов с одним и тем же `state_init` — получится одинаковый контракт с одним адресом. Поэтому единственный способ предоставить всем вам один и тот же исходный код и **"одинаковые"** исходные данные — добавить в `state_init` отдельное поле, обеспечивающее дополнительную уникальность. В случае кошелька это позволяет использовать одну и ту же пару ключей для развёртывания нескольких смарт-контрактов кошелька.

### Одно, чтоб править ими всеми

Если вы уже предположили, что поле `ID` является обязательным для любого смарт-контракта, есть и другая возможность, которая может изменить ваше мнение. Рассмотрим раздел инициализации ранее разработанного контракта `HelloWorld`:

```tact
init(id: Int, owner: Address) {
    self.id = id;
    self.counter = 0;
    self.owner = owner;
}
```

Если мы удалим поле `id` из его первоначального состояния хранилища, то сможем быть уверенными, что для определённого владельца может существовать **только один** смарт-контракт `HelloWorld`.

:::info Токены
Этот механизм играет ключевую роль в [обработке Jetton](/ru/v3/guidelines/dapps/asset-processing/jettons/). Каждый токен, не являющийся нативным (Jetton), требует наличия собственного `Jetton Wallet` для определённого владельца и, следовательно, предоставляет для него вычислимый адрес, создавая **схему звезды** с базовым кошельком в центре.
:::

## Реализация

Теперь, когда наши контракты полностью протестированы, мы готовы развернуть их в TON. В `Blueprint` этот процесс выглядит одинаково для `мейннета` и `тестнета`, а также для любого из языков в этом гайде: `Tact`, `FunC` и `Tolk`.

### Шаг 1: обновить скрипт установки

Скрипты установки опираются на те же обёртки, которые вы использовали в скриптах тестирования. Мы будем использовать один общий скрипт для развёртывания обоих ранее разработанных смарт-контрактов. Обновите `deployHelloWorld.ts` этим кодом:

```typescript title="/scripts/deployHelloWorld.ts"
// @version TypeScript 5.8.3
import { toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sender = provider.sender();
    if (!sender.address) {
        throw new Error('Sender address is required');
    }

    const helloWorld = provider.open(
        await HelloWorld.fromInit(0n, sender.address)
    );

    await helloWorld.send(
        sender,
        { value: toNano('0.05') },
        null
    );

    await provider.waitForDeploy(helloWorld.address);

    console.log('ID', await helloWorld.getId());
}
```

### Шаг 2: запустите скрипт развёртывания

Вы можете запустить скрипт, введя следующую команду:

```bash
npx blueprint run deployHelloWorld
```

### Шаг 3: выберите сеть

После этого вы увидите интерактивное меню, позволяющее выбрать сеть:

```bash
? Which network do you want to use? (Use arrow keys)
  mainnet
❯ testnet
  custom
```

:::danger
Перед развёртыванием в `мейннете` убедитесь, что ваши смарт-контракты соответствуют [мерам безопасности](/ru/v3/guidelines/smart-contracts/security/overview/). Как мы уже говорили ранее, смарт-контракт `HelloWorld` им **не соответствует**.
:::

### Шаг 4: выберите приложение кошелька

Далее выберите способ доступа к вашему кошельку. Самый простой способ сделать это — использовать [TON Connect](/v3/guidelines/ton-connect/overview/) и одно из самых популярных приложений кошельков: `TonKeeper`, `MyTonWallet`, или `Tonhub`.

```bash
? Which wallet are you using? (Use arrow keys)
❯ TON Connect compatible mobile wallet (example: Tonkeeper)
  Create a ton:// deep link
  Mnemonic

? Choose your wallet (Use arrow keys)
❯ Tonkeeper
  MyTonWallet
  Tonhub
```

Наконец, отсканируйте QR-код в терминале через приложение кошелька и подключите кошелёк. После того, как вы сделали это впервые в проекте, этот шаг будет пропускаться.

Вы будете получать запрос на транзакцию в вашем приложении кошелька каждый раз, когда ваш код требует валюты для транзакции.

### Шаг 5: наблюдайте ваш смарт-контракт в сети

После того, как вы подтвердите запрос в вашем кошельке и дождётесь развёртывания, вы увидите сообщение со ссылкой на просмотр вашего недавно развёрнутого смарт-контракта в эксплорере:

```bash
Contract deployed at address EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
You can view it at https://testnet.tonscan.org/address/EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
```

**Поздравляем!** Ваш собственный `смарт-контракт` готов исполнять `get-методы` так же, как это делал ваш кошелёк в разделе [Как начать](/v3/guidelines/quick-start/getting-started#navigation-tabs/). И он может исполнять `транзакции` так же, как описано в разделе о [взаимодействии с блокчейном](/ru/v3/guidelines/quick-start/blockchain-interaction/reading-from-network) — если вы ещё его не читали, это полезно сделать, чтобы понять, как взаимодействовать со `смарт-контрактами` извне блокчейна.

:::tip
Использование `Blueprint` и приложений кошельков — не единственный вариант. Вы можете создать сообщение со [state_init](/ru/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) самостоятельно. Более того, вы даже можете сделать это с помощью [внутреннего сообщения](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) от смарт-контракта.
:::

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-storage-and-get-methods.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-storage-and-get-methods.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Хранение данных и get-методы

> **Резюме:** На предыдущих этапах мы узнали, как использовать `Blueprint` и его структуру проекта.

Tact — это высокоуровневый язык программирования для блокчейна TON, ориентированный на эффективность и простоту. Он спроектирован так, чтобы быть простым в изучении и использовании, и в то же время хорошо подходить разработке смарт-контрактов. Tact — это статически типизированный язык с простым синтаксисом и мощной системой типов.

:::info
Подробнее с ним можно ознакомиться в [документации Tact](https://docs.tact-lang.org/#start/) и на сайте [Tact By Example](https://tact-by-example.org/00-hello-world/).
:::

Давайте создадим и модифицируем наш смарт-контракт по стандартным шагам, описанным в предыдущем разделе [обзор Blueprint](/ru/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview/).

## Шаг 1: редактирование кода смарт-контракта

В верхней части сгенерированного файла контракта `hello_world.tact` вы можете увидеть определение сообщения:

```tact title="/contracts/hello_world.tact"
message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}
```

Сообщение — это базовая структура для коммуникации между контрактами. Tact автоматически сериализирует и десериализирует сообщения в ячейки. Чтобы быть уверенными, что при изменении структуры сообщений опкоды сохранятся теми же, их можно добавлять так, как показано ниже:

```tact title="/contracts/hello_world.tact"
message(0x7e8764ef) Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}
```

Tact сериализует это следующим образом:

```func
begin_cell()
    .store_uint(0x7e8764ef, 32) ;; message opcode
    .store_uint(query_id, 64)
    .store_uint(amount, 32)
    .end_cell()
```

Используя эту структуру, можно отправить контракту сообщение из FunC.

#### Определение контракта

В Tact [контракт](https://docs.tact-lang.org/book/contracts/) определяют в объектно-ориентированном стиле программирования:

```tact
contract HelloWorld {
    ...
}
```

#### Хранилище контракта

Контракт может хранить переменные состояния, как показано ниже. К ним можно получить доступ с помощью [`self-ссылки`](https://docs.tact-lang.org/book/contracts/#self)

```tact
id: Int as uint32;
counter: Int as uint32;
```

Чтобы удостовериться, что только владелец контракта может взаимодействовать с конкретными функциями, добавьте поле `владелец`:

```tact title="/contracts/hello_world.tact"
id: Int as uint32;
counter: Int as uint32;
owner: Address;
```

Эти поля сериализуются аналогично структурам и хранятся в регистре данных контракта.

#### Инициализация контракта

Если вы попробуете скомпилировать контракт на данном этапе, вы столкнётесь с ошибкой: `Field "owner" is not set` («поле "владелец" не установлено»). Дело в том, что контракт должен инициализировать свои поля при развёртывании. Определите функцию [`init()`](https://docs.tact-lang.org/book/contracts/#init-function/), чтобы делать это:

```tact title="/contracts/hello_world.tact"
init(id: Int, owner: Address) {
    self.id = id;
    self.counter = 0;
    self.owner = owner;
}
```

#### Обработка сообщений

Чтобы принять сообщения от других контрактов, используйте [receiver-функцию](https://docs.tact-lang.org/book/functions/#receiver-functions). Такие функции автоматически вызывают функцию, соответствующую опкоду сообщения:

```tact title="/contracts/hello_world.tact"
receive(msg: Add) {
    self.counter += msg.amount;
    self.notify("Cashback".asComment());
}
```

Чтобы принимать сообщения с пустым телом, можно добавить receive-функцию без аргументов:

```tact title="/contracts/hello_world.tact"
receive() {
    cashback(sender())
}
```

#### Ограничение доступа

Tact также предоставляет удобные способы поделиться логикой с помощью так называемых [«черт»](https://docs.tact-lang.org/book/types/#traits)  («traits») — повторно используемых блоков кода, похожих на абстрактные классы в других языках программирования. Tact не использует классическое наследование, но черты позволяют определить общую логику без дублирования кода. Они выглядят как контракты, но не могут хранить постоянное состояние.
Например, вы можете использовать черту `Ownable`, которая предоставляет встроенные проверки собственности, чтобы убедиться, что только владелец контракта может отправлять сообщения.

```tact title="/contracts/hello_world.tact"
// Import library to use trait
import "@stdlib/ownable";

// Ownable trait introduced here
contract HelloWorld with Ownable {

    ...

    receive(msg: Add) {
        self.requireOwner();
        self.counter += msg.amount;
        self.notify("Cashback".asComment());
    }
}
```

:::info
[Проверка идентичности](https://docs.tact-lang.org/book/security-best-practices/#identity-validation) играет ключевую роль в безопасных взаимодействиях контрактов. Вы можете прочитать больше о такой проверке и её важности в документации по ссылке.
:::

#### Getter-функции

Tact поддерживает [getter functions](https://docs.tact-lang.org/book/functions/#getter-functions) для извлечения состояния контракта извне блокчейна:

:::note
Get-функцию нельзя вызвать из другого контракта.
:::

```tact title="/contracts/hello_world.tact"
get fun counter(): Int {
    return self.counter;
}
```

Обратите внимание, что геттер `owner` автоматически определяется при использовании черты `Ownable`.

#### Полный контракт

```tact title="/contracts/hello_world.tact"
import "@stdlib/ownable";

// message with opcode
message(0x7e8764ef) Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

// Contract defenition. `Ownable` is a trait to share functionality.
contract HelloWorld with Ownable {

    // storage variables
    id: Int as uint32;
    counter: Int as uint32;
    owner: Address;

    // init function.
    init(id: Int, owner: Address) {
        self.id = id;
        self.counter = 0;
        self.owner = owner;
    }

    // default(null) recieve for deploy
    receive() {
        cashback(sender())
    }

    // function to recive messages from other contracts
    receive(msg: Add) {
        // function from `Ownable` trait to assert, that only owner may call this
        self.requireOwner();
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    // getter function to be called offchain
    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}
```

Проверьте правильность кода смарт-контракта, запустив скрипт сборки:

```bash
npx blueprint build
```

Ожидаемый вывод должен выглядеть примерно так:

```bash
✅ Compiled successfully! Cell BOC result:

{
  "hash": "cdd26fef4db3a94d735a0431be2f93050c181e6b497346ededea38d8a4a21080",
  "hashBase64": "zdJv702zqU1zWgQxvi+TBQwYHmtJc0bt7eo42KSiEIA=",
  "hex": "b5ee9c7241020e010001cd00021eff00208e8130e1f4a413f4bcf2c80b010604f401d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019ad31fd31ffa4055206c139d810101d700fa405902d1017001e204925f04e002d70d1ff2e0822182107e8764efba8fab31d33fd31f596c215023db3c03a0884130f84201706ddb3cc87f01ca0055205023cb1fcb1f01cf16c9ed54e001020305040012f8425210c705f2e084001800000000436173686261636b01788210946a98b6ba8eadd33f0131c8018210aff90f5758cb1fcb3fc913f84201706ddb3cc87f01ca0055205023cb1fcb1f01cf16c9ed54e05f04f2c0820500a06d6d226eb3995b206ef2d0806f22019132e21024700304804250231036552212c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000202710709014dbe28ef6a268690000cd698fe98ffd202a903609cec08080eb807d202c816880b800f16d9e3618c08000220020378e00a0c014caa18ed44d0d200019ad31fd31ffa4055206c139d810101d700fa405902d1017001e2db3c6c310b000221014ca990ed44d0d200019ad31fd31ffa4055206c139d810101d700fa405902d1017001e2db3c6c310d000222bbeaff01"
}

✅ Wrote compilation artifact to build/HelloWorld.compiled.json
```

## Шаг 2: обновить обёртку

[Обёртки](https://docs.tact-lang.org/book/compile/#wrap-ts) облегчают взаимодействие с контрактом из TypeScript. В отличие от FunC или Tolk, они генерируются автоматически во время процесса сборки:

```typescript title="/wrappers/HelloWorld.ts"
export * from '../build/HelloWorld/tact_HelloWorld';
```

## Шаг 3: обновление тестов

Теперь давайте убедимся, что наш код смарт-контракта не выполнит задание, если мы попытаемся отправить сообщение `add` от адреса не-владельца:

- Создайте `HelloWorld`, указав владельца.
- Создайте другой смарт-контракт, который будет иметь другой адрес — "nonOwner".
- Попробуйте отправить внутреннее сообщение в `HelloWorld` и убедиться, что он выдаст ошибку с ожидаемым значением `exitCode`, а поле счетчика остаётся прежним.

Реализиация теста должна выглядеть следующим образом:

```typescript title="/tests/HelloWorld.spec.ts"
// @version TypeScript 5.8.3
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';

describe('HelloWorld Basic Tests', () => {
    let blockchain: Blockchain;
    let helloWorld: SandboxContract<HelloWorld >;
    let owner: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        // Create a new blockchain instance
        blockchain = await Blockchain.create();

        // Create an owner wallet
        owner = await blockchain.treasury('owner');

        // Deploy the contract
        helloWorld = blockchain.openContract(
            await HelloWorld .fromInit(0n, owner.address)
        );

        // Send deploy transaction
        const deployResult = await helloWorld.send(
            owner.getSender(),
            { value: toNano('1.00') },
            null
        );

        // Verify deployment was successful
        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: helloWorld.address,
            deploy: true,
            success: true
        });
    });

    it('should initialize with correct values', async () => {
        // Check initial counter value
        const initialCounter = await helloWorld.getCounter();
        expect(initialCounter).toBe(0n);

        // Check initial ID
        const id = await helloWorld.getId();
        expect(id).toBe(0n);
    });

    it('should allow owner to increment counter', async () => {
        // Get initial counter value
        const initialCounter = await helloWorld.getCounter();

        // Increment counter by 5
        const incrementAmount = 5n;
        const result = await helloWorld.send(
            owner.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Add',
                amount: incrementAmount,
                queryId: 0n
            }
        );

        // Verify transaction was successful
        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            to: helloWorld.address,
            success: true
        });

        // Check counter was incremented correctly
        const newCounter = await helloWorld.getCounter();
        expect(newCounter).toBe(initialCounter + incrementAmount);
    });

    it('should prevent non-owner from incrementing counter', async () => {
        // Create a non-owner wallet
        const nonOwner = await blockchain.treasury('nonOwner');

        // Get initial counter value
        const initialCounter = await helloWorld.getCounter();

        // Try to increment counter as non-owner
        const result = await helloWorld.send(
            nonOwner.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Add',
                amount: 5n,
                queryId: 0n
            }
        );

        // Verify transaction failed
        expect(result.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: helloWorld.address,
            success: false
        });

        // Verify counter was not changed
        const newCounter = await helloWorld.getCounter();
        expect(newCounter).toBe(initialCounter);
    });

    it('should handle multiple increments correctly', async () => {
        // Perform multiple increments
        const increments = [3n, 7n, 2n];
        let expectedCounter = 0n;

        for (const amount of increments) {
            await helloWorld.send(
                owner.getSender(),
                { value: toNano('0.05') },
                {
                    $$type: 'Add',
                    amount: amount,
                    queryId: 0n
                }
            );
            expectedCounter += amount;
        }

        // Verify final counter value
        const finalCounter = await helloWorld.getCounter();
        expect(finalCounter).toBe(expectedCounter);
    });
});


```

Не забудьте проверить правильность этого примера, запустив тестовый скрипт:

```bash
npx blueprint test
```

Ожидаемый вывод должен выглядеть примерно так:

```bash

 PASS  tests/HelloWorld.spec.ts
  HelloWorld Basic Tests
    ✓ should initialize with correct values (211 ms)
    ✓ should allow owner to increment counter (100 ms)
    ✓ should prevent non-owner from incrementing counter (152 ms)
    ✓ should handle multiple increments correctly (112 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.193 s, estimated 2 s
Ran all test suites.

```

---

## Следующий шаг

Вы написали свой первый смарт-контракт на языке Tact, протестировали его и изучили, как работают хранилище и get-методы.

Теперь пришло время **развёртывания контракта** в блокчейне TON.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network" colorType={'primary'} sizeType={'sm'}>

  Развёртывание в сети

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/getting-started.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/quick-start/getting-started.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import ThemedImage from '@theme/ThemedImage';
import MnemonicGenerator from "@site/src/components/MnemonicGenerator";
import Button from '@site/src/components/button'

# Как начать

Добро пожаловать в руководство для быстрого старта в TON-разработке! Здесь вы найдёте отправную точку для погружения в концепции TON, а также получите базовый опыт разработки приложений в экосистеме TON.

## Что требуется для прохождения 

- Базовые знания о программировании.
- Около **30 минут** времени.

> **Примечание**: Мы будем кратко объяснять ключевые концепции по мере их появления, но если вы предпочитаете более теоретический подход, можете сначала ознакомиться с ключевыми понятиями [блокчейна TON](/ru/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/).

## Чему вы научитесь

- Поймёте ключевые понятия блокчейна TON, включая `сообщения`, `смарт-контракты` и `адреса`.
- Научитесь взаимодействовать с экосистемой TON, включая кошельки и эксплореры блокчейна.
- Научитесь взаимодействовать с блокчейном TON: читать и записывать данные.
- Настроите окружение разработчика, используя `Blueprint` для разработки смарт-контрактов.
- Начнёте писать `смарт-контракты`, используя языки программирования `FunC`, `Tolk`и `Tact`.

## Концепция смарт-контрактов

Смарт-контракты можно рассматривать как программы, запущенные в блокчейне. Они следуют известной поведенческой концепции из модели [акторов](/ru/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#single-actor).

:::info
В отличие от некоторых других блокчейнов, где можно вызывать код других контрактов синхронным образом, смарт-контракт в TON — это независимая сущность, которая взаимодействует с другими смарт-контрактами на равных. Они взаимодействуют с помощью отправки сообщений друг другу, и TON спроектирован так, что обработка этих транзакций происходит асинхронно.
:::

Каждая обработка сообщения контрактом-получателем считается транзакцией, и может приводить к следующим действиям:

- Отправка новых сообщений.
- Изменение внутренних данных смарт-контракта или даже его кода.
- Изменение его баланса.

У смарт-контракта есть следующие интерфейсы для взаимодействия:

- Получение **`внутренних сообщений`** от другого смарт-контракта.
- Получение **`внешних сообщений`** извне блокчейна.
- Получение запросов к **`get-методам`** извне блокчейна.

В отличие от `внутренних` и `внешних` сообщений, обращение к `get-методам` не считается **транзакцией**. Это специальные функции смарт-контракта, не способные изменить его внутреннее состояние или выполнить любое действие, кроме запроса конкретных данных из его состояния.

:::info
Это может показаться контринтуитивным, но обращение к `get-методам` из других контрактов **невозможно**.
:::

## Взаимодействие с экосистемой TON

Прежде чем мы становиться разработчиками в TON, важно сначала стать продвинутыми пользователями. Давайте создадим наш собственный `кошелёк`, отправим несколько транзакций, и увидим результаты наших действий в блокчейне с помощью `эксплореров`.

### Шаг 1: создайте новый кошелёк с помощью приложения

Самый простой способ создать кошелёк — открыть страницу https://ton.org/wallets и выбрать одно из перечисленных приложений. Они довольно похожи, мы в данном случае выберем [Tonkeeper](https://tonkeeper.com/). Вперёд, установите его и запустите.

### Шаг 2: мейннет и тестнет

В TON есть две разных сети с названиями `мейннет` и `тестнет`, их задачи различаются:

- `Мейннет` — это основная сеть, где происходят реальные транзакции с использованием настоящей криптовалюты и экономической ценностью.
- `Тестнет` — тестовая версия блокчейна TON. Это безопасная площадка, где разработчики могут тестировать свой код без финансового риска. Она в основном используется для разработки, тестирования `смарт-контрактов` и экспериментов с новой функциональностью.

#### Получение средств

Транзакции в TON всегда требуют определённого количества средств, поскольку исполнение кода смарт-контракта требует оплаты [комиссии](/ru/v3/documentation/smart-contracts/transaction-fees/fees/). Базовые транзакции в TON очень дешёвые — около 1 цента за транзакцию. Суммы в [Toncoin](/ru/v3/documentation/dapps/defi/coins/), эквивалентной $5, хватит на сотни таких транзакций. Вот как можно обзавестись Toncoin:

- В случае с `мейннетом` получить настоящие `Toncoin` можно либо с помощью простой кнопки «Купить» в интерфейсе кошелька, либо попросив кого-то прислать их на ваш `адрес`. Вы можете скопировать адрес из приложения кошелька, обычно он расположен рядом с вашим балансом.

:::info
Не беспокойтесь, делиться своим `адресом` **совершенно безопасно**, если только вы не хотите сохранить в тайне свою связь с ним.
:::

- Для `тестнета` вы можете запросить тестовые средства в боте [Testgiver Ton Bot](https://t.me/testgiver_ton_bot) **полностью бесплатно**! После небольшого ожидания вы получите 2 `Toncoin`, которые появятся в вашем приложении кошелька.

### Шаг 3: создание кошелька в тестнете

Если вы решите использовать `тестнет`, можете сделать это следующим образом.

#### Создание мнемонической фразы

Чтобы создать ваш первый тестнет-кошелёк в Tonkeeper, можете получить мнемоническую фразу с помощью кнопки ниже. Не забудьте сохранить эту фразу!

<MnemonicGenerator />

#### Создание кошелька

Для создания кошелька в тестнете нажмите _`Кошелёк`_ -> _`Добавить кошелёк`_ -> _`Аккаунт в Testnet`_. Затем импортируйте сид-фразу, созданную на предыдущем шаге.

<div style={{display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '30px'}}>
  <br/>
  <ThemedImage
    height='600px'
    alt=""
    sources={{
      light: '/img/tutorials/quick-start/tonkeeper-light.jpg?raw=true',
      dark: '/img/tutorials/quick-start/tonkeeper-dark.jpg?raw=true',
    }}
  />
  <br/>
</div>

### Шаг 4: исследование блокчейна TON

Поздравляем! Мы создали наш первый кошелёк и впервые получили средства. Теперь давайте посмотрим, как наши действия отражены в блокчейне. Мы можем сделать это с помощью различных [эксплореров](https://ton.app/explorers/).

`Эксплорер` — это инструмент, позволяющий вам запрашивать данные из блокчейна, исследовать `смарт-контракты` в TON, и просматривать транзакции. Для наших примеров мы будем использовать [Tonviewer](https://tonviewer.com/).

:::tip
Обратите внимание, что при использовании `тестнета` вам следует вручную изменить режим работы эксплорера на вариант `Testnet`. Не забудьте, что это разные сети, которые не обмениваются информацией о транзакциях или смарт-контрактах. Следовательно, ваш созданный в `тестнете` кошелёк не будет отображаться в режиме `Mainnet`, и наоборот.
:::

Посмотрим на наш свежесозданный кошелёк с помощью `эксплорера`: скопируйте адрес кошелька из приложения и вставьте его в поисковую строку эксплорера, как на примере:

<div style={{marginBottom: '30px'}}>
  <img src="/img/tutorials/quick-start/explorer1.png" alt="Скриншот поискового интерфейса эксплорера"/>
</div>

#### Состояние адреса

Для начала посмотрим, какое [состояние адреса](/ru/v3/documentation/smart-contracts/addresses/#%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5-%D0%B0%D0%B4%D1%80%D0%B5%D1%81%D0%BE%D0%B2) у нашего смарт-контракта:

- `Nonexist`: если вы ещё не получали никакие средства на свой `адрес`, то увидите состояние по умолчанию для любого адреса, который ранее не использовался, и, следовательно, не содержит никаких данных.

<div style={{marginBottom: '30px'}}>
  <img src="/img/tutorials/quick-start/nonexist.png" alt="Скриншот состояния кошелька nonexistent"/>
</div>

- `Uninit`: Для адреса, который содержит некоторые метаданные вроде средств, однако ещё не был инициализирован развёртыванием кода или данных `смарт-контракта`.

<div style={{marginBottom: '30px'}}>
  <img src="/img/tutorials/quick-start/uninit.png" alt="Скриншот неинициализированного состояния кошелька"/>
</div>

:::info
Это может ощущаться контринтуитивным: почему ваш кошелёк находится в состоянии `неинициализирован` (`uninit`), если вы его уже создали? Тут есть важный нюанс: разница между `приложением кошелька` и `смарт-контрактом кошелька`:

- `Приложение кошелька` — это ваш офчейн-клиент для `смарт-контракта кошелька`.

- `Смарт-контракт кошелька` — это непосредственно контракт. Поскольку его развёртывание в блокчейне требует оплаты комиссий, большинство `приложений кошелька` не делают этого, пока вы не получите средства на этот адрес и попробуете осуществить первую транзакцию.
  :::

- `Active`: Это состояние развёрнутого `смарт-контракта` с положительным балансом. Для развёртывания нашего кошелька давайте отправим первую транзакцию особо важному человеку — **самому себе** — и посмотрим, как она выглядит в `блокчейне`. Откройте меню отправки в вашем приложении кошелька и переведите немного средств на свой собственный адрес, который вы скопировали ранее. В эксплорере наш контракт должен начать выглядеть примерно так:

<div style={{marginBottom: '30px'}}><img src="/img/tutorials/quick-start/active.png" alt="Скриншот кошелька в активном состоянии"/></div>

:::info
Есть также четвёртое состояние «[frozen](/ru/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee/)». Оно означает, что расходы смарт-контракта на [хранение данных](/ru/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee/) превысили его баланс. В этом состоянии смарт-контракт не может осуществлять никакие операции.
:::

Теперь наш контракт кошелька развёрнут и готов к использованию. Давайте изучим, что показывает пользовательский интерфейс:

#### Раздел с метаданными

- **Address**: Уникальный идентификатор вашего аккаунта (например, `QQB...1g6VdFEg`).
- **Balance**: Текущее количество TON.
- **Type**: Версия контракта (например, `wallet_v51r1` — определяется автоматически по коду).
- **State**: Состояние адреса. Есть четыре варианта: `nonexisting`, `uninit`, `active` и `frozen`.

#### Навигационные панели

- **History/Transactions**: Показывает недавнюю активность (например, получение средств или развёртывание контракта).
- **Code**: Показывает код смарт-контракта в «сыром» виде, скомпилированный из кода на языке `FunC`, `Tolk` или `Tact`.
- **Methods**: Позволяет выполнять `get-методы`, чтобы получать данные из постоянного хранилища контракта.

## Следующие шаги

- Теперь, когда вы освоились с приложением кошелька, сделайте следующий шаг. Создайте ещё один аккаунт, попробуйте переводить TON между ними, и посмотрите на получившиеся транзакции в эксплорере.
- Когда будете готовы, переходите к следующему шагу:

<Button href="/ru/v3/guidelines/quick-start/blockchain-interaction/reading-from-network" colorType={'primary'} sizeType={'sm'}>

  Чтение из сети

</Button>

<Feedback />



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/fee-calculation.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/fee-calculation.md
================================================
# Расчёт комиссии

Когда ваш контракт начинает обрабатывать входящее сообщение, важно проверить, достаточно ли прикрепленных к нему токенов TON для покрытия [всех типов комиссий](/v3/documentation/smart-contracts/transaction-fees/fees#elements-of-transaction-fee). Для этого необходимо рассчитать или спрогнозировать комиссию за текущую транзакцию.

В этой статье мы разберём, как рассчитывать комиссии в контрактах FunC с использованием новых опкодов (кодов операций) TVM.

:::info Подробнее об опкодах
Полный список опкодов TVM, включая упомянутые ниже, вы можете найти на странице [инструкций по TVM](/v3/documentation/tvm/instructions).
:::

## Комиссия за хранение

### Обзор

`storage fees` - это плата за размещение смарт-контракта в блокчейне. Она взимается за каждую секунду его хранения.

Для получения значений комиссии, используйте опкод `GETSTORAGEFEE` со следующими параметрами:

| Параметр                   | Описание                                                                            |
| :------------------------- | :---------------------------------------------------------------------------------- |
| cells                      | Количество ячеек контракта                                                          |
| bits                       | Количество битов контракта                                                          |
| is_mc | Флаг, принимает значение True, если источник или получатель находятся в мастерчейне |

:::info При расчете комиссии за хранение и пересылку учитываются только уникальные хеш-ячейки - то есть 3 одинаковые хеш-ячейки считаются за одну.

В частности, происходит дедупликация данных: если в разных ветвях есть несколько одинаковых подъячеек, их содержимое сохраняется только один раз.

[Подробнее о дедупликации](/v3/documentation/data-formats/tlb/library-cells).
:::

### Последовательность расчёта

У каждого контракта есть свой баланс. Можно рассчитать, сколько TON (токенов) потребуется, чтобы контракт оставался активным в течение указанного времени `seconds`, с помощью следующей функции:

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

Затем это значение можно вписать в код контракта и рассчитать актуальную комиссию за хранение следующим образом:

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

Если значение `storage_fee` задано в виде константы, **не забудьте его обновить** при изменении контракта. Поскольку не все контракты поддерживают обновление, это не обязательное требование.

## Комиссия за вычисления

### Обзор

В большинстве случаев для получения значений комиссии необходимо использовать опкод `GETGASFEE` со следующими параметрами:

| Параметр   | Описание                                                                            |
| :--------- | :---------------------------------------------------------------------------------- |
| `gas_used` | Количество газа, полученное в ходе тестов, задается в виде константы                |
| `is_mc`    | Флаг, принимает значение True, если источник или получатель находится в мастерчейне |

### Последовательность расчёта

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

Каким образом можно получить значение `gas_used`? Через тесты!

Реализуемый для вашего смарт-контракта тест должен:

1. Совершить перевод
2. Проверить, прошла ли операция успешно, и получить информацию о переводе
3. Проверить фактическое количество газа, использованное этим переводом для вычисления

Последовательность расчета контракта может зависеть от входных данных. Вам следует запускать контракт так, чтобы он потреблял максимальное количество газа. Убедитесь, что вы используете наиболее ресурсоёмкий метод вычислений.

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

## Комиссия за пересылку

### Обзор

Комиссия за пересылку взимается за исходящие сообщения.

Как правило, существует три варианта обработки комиссии за пересылку:

1. Структура сообщения детерминирована и вы можете спрогнозировать размер комиссии.
2. Структура сообщения во многом зависит от структуры входящего сообщения.
3. Вы вообще не можете спрогнозировать структуру исходящего сообщения.

### Последовательность расчёта

Если структура сообщения детерминирована, используйте опкод `GETFORWARDFEE` со следующими параметрами:

| Параметр                   | Описание                                                                                  |
| :------------------------- | :---------------------------------------------------------------------------------------- |
| cells                      | Количество ячеек                                                                          |
| bits                       | Количество битов                                                                          |
| is_mc | Флаг, принимает значение True, если источник или пункт назначения находится в мастерчейне |

:::info Для расчета комиссии за хранение и пересылку учитываются только уникальные хеш-ячейки, то есть 3 идентичные хеш-ячейки считаются как одна.

В частности, происходит дедупликация данных: если в разных ветвях встречаются одинаковые подъячейки, их содержимое сохраняется только один раз.

[Подробнее о дедупликации](/v3/documentation/data-formats/tlb/library-cells).
:::

Однако иногда исходящее сообщение сильно зависит от структуры входящего, и в таком случае спрогнозировать комиссию невозможно. Попробуйте использовать опкод `GETORIGINALFWDFEE` со следующими параметрами:

| Параметр                     | Описание                                                                                  |
| :--------------------------- | :---------------------------------------------------------------------------------------- |
| fwd_fee | Извлечено из входящего сообщения                                                          |
| is_mc   | Флаг, принимает значение True, если источник или пункт назначения находится в мастерчейне |

:::caution Будьте осторожны с опкодом `SENDMSG`.

Он расходует **непредсказуемое количество** газа.

Не используйте его без необходимости.
:::

Если опкод `GETORIGINALFWDFEE` не подходит, то можно использовать опкод `SENDMSG` со следующими параметрами:

| Параметр | Описание         |
| :------- | :--------------- |
| cells    | Количество ячеек |
| mode     | Режим сообщений  |

Режимы влияют на расчет комиссии следующим образом:

- `+1024`  не выполняет действие, а только оценивает комиссию. В других режимах сообщение отправляется на этапе выполнения действия
- `+128` подставляет значение всего баланса контракта до начала фазы вычислений (результат может быть неточным, так как расходы на газ, которые нельзя оценить заранее, не учитываются)
- `+64` подставляет весь баланс входящего сообщения в качестве исходящего значения (результат может быть неточным, так как не учитываются расходы на газ, которые нельзя оценить заранее)
- Другие режимы можно найти [на странице режимов сообщений](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)

Он создает действие вывода и возвращает комиссию за создание сообщения. Однако расходует непредсказуемое количество газа, которое нельзя вычислить формулами. Как же его рассчитать? Используйте опкод `GASCONSUMED`:

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

## См. также

- [Контракт Stablecoin с расчетом комиссии](https://github.com/ton-blockchain/stablecoin-contract)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/get-methods.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/get-methods.md
================================================
# Get-методы

:::note
Прежде чем продолжить, рекомендуется ознакомиться с основами [языка программирования FunC](/v3/documentation/smart-contracts/func/overview) на блокчейне TON. Это поможет лучше понять представленную ниже информацию.
:::

## Введение

Get-методы — это специальные функции, предназначенные для получения конкретных данных из состояния смарт-контракта. Их выполнение происходит вне блокчейна и не требует комиссии.

Эти функции встречаются во многих смарт-контрактах. Например, стандартный [смарт-контракт кошелька](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) содержит несколько get-методов: `seqno()`, `get_subwallet_id()` и `get_public_key()`. Они позволяют получать данные о кошельке из самого контракта, SDK и API.

## Шаблоны проектирования для get-методов

### Базовые шаблоны

1. **Получение отдельных данных.** Данный шаблон представляет собой набор методов, которые позволяют получить в качестве результата вызова отдельные параметры из состояния контракта. Данные методы не содержат аргументов и возвращают только одно значение.

    Например:

    ```func
    int get_balance() method_id {
        return get_data().begin_parse().preload_uint(64);
    }
    ```

2. **Получение агрегированных данных.** Ещё один распространённый шаблон - набор методов, позволяющих извлечь сразу массив данных из состояния контракта в рамках одиночного вызова. Это может быть удобно для случаев, когда для какой-то операции необходимо несколько параметров. Такие методы применяются, например, в контрактах [Jetton](#jettons) и [NFT](#nfts).

    Например:

    ```func
    (int, slice, slice, cell) get_wallet_data() method_id {
        return load_data();
    }
    ```

### Продвинутые шаблоны

1. **Получение вычисляемых данных.** В некоторых случаях искомые данные не хранятся в текущем состоянии контракта, однако могут быть вычислены, если в метод будут переданы дополнительные аргументы для расчета.

    Например:

    ```func
    slice get_wallet_address(slice owner_address) method_id {
        (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
        return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
    }
    ```

2. **Получение данных с учетом условий.** Иногда значения, которые нужно получить, зависят от каких-либо параметров, к примеру, от текущего времени.

    Например:

    ```func
    (int) get_ready_to_be_used() method_id {
        int ready? = now() >= 1686459600;
        return ready?;
    }
    ```

## Наиболее распространенные get-методы

### Стандартные кошельки

#### seqno()

```func
int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}
```

Возвращает порядковый номер транзакции в определённом кошельке. Этот метод в основном используется для [защиты от повторных отправок](/v3/guidelines/smart-contracts/howto/wallet#replay-protection---seqno).

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
    return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

- [Что такое Subwallet ID?](/v3/guidelines/smart-contracts/howto/wallet#subwallet-ids)

#### get_public_key()

```func
int get_public_key() method_id {
    var cs = get_data().begin_parse().skip_bits(64);
    return cs.preload_uint(256);
}
```

Получает публичный ключ, связанный с кошельком.

### Жетоны

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}
```

Этот метод возвращает полный набор данных, связанных с кошельком Jetton:

- (int) balance
- (slice) owner_address
- (slice) jetton_master_address
- (cell) jetton_wallet_code

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

Возвращает данные мастер-контракта Jetton, включая общий объём, адрес администратора, содержимое жетона и код кошелька.

#### get_wallet_address(slice owner_address)

```func
slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

На основе адреса владельца этот метод вычисляет и возвращает адрес его кошелька Jetton.

### NFT

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    return (init?, index, collection_address, owner_address, content);
}
```

Возвращает данные, связанные с невзаимозаменяемым токеном, включая информацию о том, был ли он инициализирован, индекс в коллекции, адрес коллекции, адрес владельца и индивидуальное содержимое.

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
    var (owner_address, next_item_index, content, _, _) = load_data();
    slice cs = content.begin_parse();
    return (next_item_index, cs~load_ref(), owner_address);
}
```

Возвращает данные о коллекции NFT, включая индекс следующего элемента для минта, содержимое коллекции и адрес владельца.

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(workchain(), state_init);
}
```

С учетом индекса, этот метод вычисляет и возвращает адрес соответствующего контракта NFT-элемента этой коллекции.

#### royalty_params()

```func
(int, int, slice) royalty_params() method_id {
    var (_, _, _, _, royalty) = load_data();
    slice rs = royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

Получает параметры роялти для NFT. Эти параметры включают процент роялти, который выплачивается первоначальному создателю при продаже NFT.

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

С учетом индекса и [индивидуального содержимого NFT](#get_nft_data), этот метод получает и возвращает объединённое общее и индивидуальное содержимое NFT.

## Как работать с get-методами

### Поиск get-методов на популярных обозревателях

#### Tonviewer

Вы можете вызвать get-методы в нижней части страницы во вкладке "Methods"

- https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=method

#### Ton.cx

Вы можете вызвать get-методы во вкладке "Get methods"

- https://ton.cx/address/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI

### Вызов get-методов из кода

В примерах ниже мы будем использовать библиотеки и инструменты JavaScript:

- Библиотека [TON](https://github.com/ton-org/ton)
- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript) SDK

Представим, что у нас есть контракт со следующим get-методом:

```func
(int) get_total() method_id {
    return get_data().begin_parse().preload_uint(32); ;; load and return the 32-bit number from the data
}
```

Этот метод возвращает значение в виде числа из данных контракта.

Приведенный ниже фрагмент кода позволяет вызвать этот get-метод в контракте, развёрнутом по известному адресу:

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

Этот код выдаст результат `Total: 123`. Число может быть другим, это просто пример.

### Тестирование get-методов

Для тестирования созданных смарт-контрактов можно использовать [Sandbox](https://github.com/ton-community/sandbox), который по умолчанию устанавливается в новые проекты Blueprint.

Сначала добавьте специальный метод в оболочку контракта, который будет выполнять get-метод и возвращать введенный результат. Допустим, ваш контракт называется *Counter*, и в нем уже реализован метод обновления значения в виде числа. Откройте `wrappers/Counter.ts` и добавьте следующий метод:

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

Этот метод выполняет get-запрос и получает результирующий стек. В контексте get-методов стек - это результат вызова метода. В данном примере кода результат представлен в виде одного числа. В более сложных случаях, когда возвращается сразу несколько значений, для обработки всего результата, можно, к примеру, несколько раз вызвать метод `readSomething`.

Теперь можно использовать этот метод в наших тестах. Перейдите в `tests/Counter.spec.ts` и добавьте новый тест:

```ts
it('should return correct number from get method', async () => {
    const caller = await blockchain.treasury('caller');
    await counter.sendNumber(caller.getSender(), toNano('0.01'), 123);
    expect(await counter.getTotal()).toEqual(123);
});
```

Проверьте, запустив `npx blueprint test` в терминале. Если все сделано правильно, тест пройдёт успешно!

## Вызов get-методов из других контрактов

Несмотря на кажущуюся очевидность, вызвать get-методы из других контрактов on-chain невозможно. Это связано с особенностями блокчейн-технологии и необходимостью консенсуса.

Во-первых, получение данных из другого шардчейна может занять время. Такая задержка способна нарушить процесс выполнения контракта, так как операции в блокчейне должны выполняться детерминированно и без задержек.

Во-вторых, достичь консенсуса среди валидаторов будет сложно. Чтобы проверить корректность транзакции, валидаторы должны вызывать один и тот же get-метод. Однако если состояние целевого контракта изменится между вызовами, результат транзакции может отличаться у разных валидаторов.

И, наконец - смарт-контракты в TON работают как чистые функции: при одинаковых входных данных они всегда возвращают одинаковый результат. Это упрощает достижение консенсуса при обработке сообщений. Если же включить в процесс выполнения метода произвольные, динамически меняющиеся данные, это нарушит детерминированность.

### Влияние на разработку

Эти ограничения означают, что один контракт не может напрямую получать данные о состоянии другого контракта через его get-методы. Отсутствие возможности использовать внешние данные в реальном времени в детерминированном потоке контракта может показаться неудобным, но именно эти ограничения обеспечивают надежность и целостность блокчейна.

### Решения и обходные пути

В блокчейне TON смарт-контракты взаимодейстсвуют с помощью сообщений, а не вызывают напрямую методы другого контракта. Целевому контракту можно отправить сообщение с запросом на выполнение определённого метода. Такие запросы обычно включают специальные [коды операций](/v3/documentation/smart-contracts/message-management/internal-messages).

Контракт, который принимает такие запросы, выполняет нужный метод и отправляет результат обратно в отдельном сообщении. Это может показаться сложным, но на практике упрощает взаимодействие между контрактами и повышает масштабируемость и производительность сети.

Этот механизм передачи сообщений - ключевой элемент работы блокчейна TON, позволяющий сети масштабироваться без сложной синхронизации между шардами.

Для эффективного взаимодействия между контрактами важно, чтобы они были разработаны так, чтобы корректно принимать и обрабатывать запросы. Включая указание методов, которые могут быть вызваны on-chain для возврата ответа.

Давайте рассмотрим простой пример:

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

В этом примере контракт получает и обрабатывает внутренние сообщения, распознает коды операций (опкоды), выполняет нужные методы и отправляет соответствующие ответы:

- Oпкод `1` обозначает запрос на обновление числа в данных контракта
- Опкод `2` обозначает запрос на получение числа из данных контракта
- Опкод `3` используется в ответном сообщении, которое вызывающий смарт-контракт должен обработать, чтобы получить результат

Для простоты мы использовали в качестве кодов операций (опкодов) простые числа 1, 2 и 3. Но для реальных проектов лучше использовать стандартные значения:

- [CRC32-хеши для опкодов](/v3/documentation/data-formats/tlb/crc32)

## Распространённые ошибки и как их избежать

1. **Неправильное использование get-методов.** Как уже упоминалось ранее, get-методы предназначены для получения данных из состояния контракта и не могут его изменять. Попытка изменить состояние контракта внутри get-метода не даст результата.

2. **Игнорирование возвращаемых типов.** Каждый get-метод должен иметь чётко определённый тип возвращаемых данных. Если метод должен возвращать данные определённого типа, убедитесь, что во всех сценариях выполнения возвращается именно этот тип. Избегайте использования несогласованных типов возвращаемых значений - это может привести к ошибкам и усложнить взаимодействие с контрактом.

3. **Ошибочное предположение о кросс-контрактных вызовах.** Распространённое заблуждение заключается в том, что get-методы можно вызывать из других контрактов on-chain. Однако, как уже говорилось, это невозможно из-за особенностей блокчейна и необходимости консенсуса. Всегда помните, что get-методы предназначены для использования off-chain, а взаимодействие между контрактами on-chain осуществляется через внутренние сообщения.

## Заключение

Get-методы - это важный инструмент для запроса данных из смарт-контрактов в блокчейне TON. Хотя у них есть свои ограничения, понимание этих ограничений и умение их обходить - ключ к эффективному использованию get-методов в ваших смарт-контрактах.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/guidelines.mdx
================================================
import Button from '@site/src/components/button'

# Обзор

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

На этой странице собраны некоторые рекомендации и лучшие практики, которым можно следовать при разработке новых смарт-контрактов на блокчейне TON.

- [Внутренние сообщения](/v3/documentation/smart-contracts/message-management/internal-messages)
- [Внешние сообщения](/v3/documentation/smart-contracts/message-management/external-messages)
- [Использование non-bounceable сообщений](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)
- [Get методы](/v3/guidelines/smart-contracts/get-methods)
- ["accept_message" effects](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects)
- [Оплата обработки запросов и отправки ответов] (/v3/documentation/smart-contracts/transaction-fees/forward-fees)
- [Как и зачем шардировать ваш смарт-контракт TON. Изучение анатомии жетонов TON](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)
- [Основатели TON Keeper, Олег Андреев и Олег Илларионов, о жетонах TON](https://www.youtube.com/watch?v=oEO29KmOpv4)

Также есть полезная [документация по смарт-контрактам](/v3/documentation/smart-contracts/overview).

## Курс TON: Разработка контрактов

Курс [TON Blockchain Course](https://stepik.org/course/176754/) - это полное руководство по разработке TON Blockchain.

- Модуль 2 посвящен **TVM, транзакциям, масштабируемости и бизнес-кейсам**.
- Модуль 3 посвящен **жизненному циклу разработки смарт-контракта**.

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Посмотреть Курс TON Blockchain

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
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice.mdx
================================================
# Руководство Airdrop Claiming

В этой статье мы рассмотрим вымышленное _решение_ для клейма, попытаемся выявить его проблемы с производительностью и решить их.
Мы сосредоточимся на взаимодействии контрактов и их влиянии на общую производительность и не будем затрагивать код, аспекты безопасности и другие нюансы.

## Claim Machine

:::info
Как работает практически любое решение для клейма?
Давайте подумаем.
:::

Пользователь отправляет некое доказательство, пруф того, что он имеет право на клейм. Разработанный алгоритм решения осуществляет проверку доказательства и при ее успешности отправляет жетоны.
В данном случае используется [доказательство Меркла](/v3/documentation/data-formats/tlb/exotic-cells#доказательство-меркла), но это вполне могут быть просто подписанные данные или любой другой метод авторизации.
Отправка жетонов осуществляется с помощью Jetton wallet и Jetton minter.
Также, нужно убедиться, что хитрые пользователи не смогут клеймить дважды – для этого необходим контракт с защитой от двойного списания.
И, наверное, заработать немного денег, не так ли? Значит потребуется, по меньшей мере, один кошелек для клейма.
Подведем итог:

### Дистрибьютор

Принимает доказательство от пользователя, проверяет его, выпускает жетоны.
State init: `(merkle_root, admin, fee_wallet_address)`.

### Двойное списание

Получает входящее сообщение, возвращает отказ в случае попытки повторного использования. Если проверка пройдена, передает сообщение дальше

### Jetton wallet

Jetton wallet, с которого токены будут отправлены _дистрибьютором_.
Jetton minter выходит за рамки этой статьи.

### Кошелек для комиссии

Любой тип контракта кошелька.

## Архитектура

### V1

Один из возможных вариантов реализации:

- Пользователь отправляет доказательство дистрибьютору
- Дистрибьютор проверяет доказательство и разворачивает смарт-контракт `двойного списания`
- Дистрибьютор передает сообщение контракту двойного списания
- Контракт двойного списания отправляет `claim_ok` дистрибьютору, если он не был развернут ранее
- Дистрибьютор отправляет комиссию за клейм на кошелек для оплаты комиссии
- Дистрибьютор отпускает жетоны пользователю



Что здесь не так? Похоже, что цикл избыточен.

### V2

Линейная структура намного лучше:

- Пользователь разворачивает контракт `двойного списания`, который в свою очередь передает доказательство дистрибьютору
- Дистрибьютор проверяет адрес отправки смарт-контракта `двойного списания` по state init `(distributor_address, user_address?)`
- Дистрибьютор проверяет доказательство и выпускает жетоны. В данном случае индекс пользователя должен быть частью доказательства.
- Дистрибьютор отправляет комиссию на кошелек для оплаты комиссии

## Оптимизация шардов

Хорошо, у нас что-то получается, однако что насчет оптимизации шардов?

### Что это такое?

Для того чтобы получить базовое представление, рекомендуется ознакомиться со статьей [Создание кошелька для разных шардов](/v3/guidelines/dapps/asset-processing/payments-processing/#создание-кошелька-для-разных-шардов).
Вкратце, шард – это четырехбитный префикс адреса контракта. Как в сетевых технологиях.
Когда контракт находится в одном сегменте сети, сообщения обрабатываются без маршрутизации, а значит гораздо быстрее.

### Идентификация адресов, которые мы можем контролировать

#### Адрес дистрибьютора

Мы полностью контролируем данные дистрибьютора, поэтому должны иметь возможность поместить их в любой шард.
Как это сделать?
Помните, что адрес смарт-контракта [определяется его состоянием](/v3/documentation/smart-contracts/addresses#идентификатор-аккаунта).
Нужно использовать некоторые поля данных контракта в качестве nonce и продолжать попытки до тех пор, пока не получим желаемый результат.
Примером хорошего nonce в реальных контрактах может быть (subwalletId/publicKey) для смарт-контракта кошелька.
Любое поле, которое можно изменить после развертывания или которое не влияет на логику контракта (как subwalletId), подойдет для этого.
Можно даже создать неиспользуемое поле специально для этой цели, как это делает [vanity-contract](https://github.com/ton-community/vanity-contract).

#### Адрес Jetton wallet

Мы не можем контролировать адрес полученного jetton wallet напрямую.
Однако, если мы контролируем адрес дистрибьютора, то можем подобрать его таким образом, чтобы jetton wallet для дистрибьютора оказался в том же шарде.
Но как это сделать? Для этого существует [данная библиотека](https://github.com/Trinketer22/turbo-wallet)!
В настоящее время она поддерживает только кошельки, но добавить поддержку произвольных контрактов достаточно просто.
Посмотрите, как это сделано для [Highload-кошелька V3](https://github.com/Trinketer22/turbo-wallet/blob/44fe7ee4300e37e052871275be8dd41035d45c3a/src/lib/contracts/HighloadWalletV3.ts#L20).

### Смарт-контракт двойное списание

Контракт двойного списания должен быть уникальным для каждого доказательства, поэтому сможем ли мы настроить его на шарде? Если подумать, то это зависит от структуры доказательства. Первое, что приходит на ум, это та же структура, что и у [mintless jetton](https://github.com/tonkeeper/TEPs2/blob/mintles/text/0177-mintless-jetton-standard.md#handlers):

```
_ amount:Coins start_from:uint48 expired_at:uint48 = AirdropItem;

_ _(HashMap 267 AirdropItem) = Airdrop;

```

К сожалению, такая настройка не подходит потому, что распределение адресов происходит случайным образом, а все поля будут иметь значимые данные.
Но ничто не мешает нам попробовать такой вариант:

```
_ amount:Coins start_from:uint48 expired_at:uint48 nonce:uint64 = AirdropItem;

_ _(HashMap 267 AirdropItem) = Airdrop;
```

или даже:

```
_ amount:Coins start_from:uint48 expired_at:uint48 addr_hash: uint256 = AirdropItem;

_ _(HashMap 64 AirdropItem) = Airdrop;

```

где 64-битный индекс может быть использован в качестве nonce, а адрес становится частью данных для верификации.
Таким образом, если данные смарт-контракта двойного списания строятся из `(distributor_address, index)`, где индекс является частью данных, мы по-прежнему имеем исходную надежность, но теперь шард адреса может настраиваться с помощью параметра index.

#### Адрес пользователя

Очевидно, что мы не контролируем адреса пользователей, не так ли?
Да, **НО** мы можем сгруппировать их таким образом, чтобы шард пользовательских адресов совпадал с шардом дистрибьюторов.
В таком случае каждый дистрибьютор будет обрабатывать _merkle root_, состоящий исключительно из пользователей его шарда.

#### Резюме

Мы можем поместить `double_spend -> dist -> dist_jetton` часть цепочки в один шард.
Для других шардов останется только `dist_jetton -> user_jetton -> user_wallet`.

### Как же развернуть такую установку

Одно из требований заключается в том, чтобы контракт _дистрибьютора_ имел обновляемый _merkle root_. Давайте выполним по шагам:

- Разверните смарт-контракт дистрибьютора в каждом шарде (0-15) – в пределах тех же шардов, что и их jetton wallet, используя начальный `merkle_root` в качестве nonce
- Сгруппируйте пользователей по шардам
- Для каждого пользователя найдите такой индекс, чтобы контракт _двойного списания_ `(distributor, index)` оказался в том же шарде, что и адрес пользователя
- Сгенерируйте _merkle roots_ с индексами из шага выше
- Обновите _дистрибьюторов_ в соответствии с _merkle roots_

Теперь все должно быть в порядке!

### V3

- Пользователь разворачивает контракт _двойного списания_ в одном шарде, используя настройку индекса
- Дистрибьютор в шарде пользователя проверяет адрес отправки `двойного списания` по state init `(distributor_address, index)`
- Дистрибьютор отправляет комиссию на кошелек для оплаты комиссии
- Дистрибьютор проверяет доказательство и выпускает жетоны через jetton wallet на том же шарде. В данном случае индекс пользователя должен быть частью доказательства

Какой недостаток у данной структуры? Давайте посмотрим внимательно. Правильно! Существует только один кошелек для комиссии – таким образом сборы комиссий скапливаются в очередь на одном шарде. Это могло бы стать катастрофой! (Интересно, случалось ли такое в реальности?)

### V4

- То же самое, что и в V3, но теперь 16 кошельков для получения комиссии, каждый из которых находится в том же шарде, что и его _дистрибьютор_
- Придется сделать адрес _кошелька для комиссии_ обновляемым



Как вам теперь? Выглядит хорошо.

## Что дальше?

Мы всегда можем пойти еще дальше.
Ознакомьтесь с кастомным смарт-контрактом [jetton wallet](https://github.com/ton-community/mintless-jetton/blob/main/contracts/jetton-utils.fc#L142), который имеет встроенную оптимизацию шардов.
В результате пользовательский jetton wallet оказывается на том же шарде, что и пользователь, с вероятностью 87%.
Но это все еще довольно-таки неизведанная территория, так что вам придется действовать самостоятельно.
Удачи с TGE!



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/compilation-instructions.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/compilation-instructions.md
================================================
# Компиляция из исходного кода

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Вы можете скачать предварительно скомпилированные двоичные файлы [здесь](/v3/documentation/archive/precompiled-binaries#1-download).

Если вы все же хотите скомпилировать исходники самостоятельно, следуйте инструкциям ниже.

:::caution
This is a simplified quick build guide.

Если ваша сборка предназначена не для домашнего использования, лучше использовать [скрипты автосборки](https://github.com/ton-blockchain/ton/tree/master/.github/workflows).
:::

## Общее

Программное обеспечение, скорее всего, будет компилироваться и правильно работать на большинстве систем Linux. Оно должно работать на macOS и даже на Windows.

1. Загрузите последнюю версию исходников TON Blockchain, доступную в репозитории GitHub https://github.com/ton-blockchain/ton/:

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2. Установите последние версии:
  - `make`
  - `cmake` 3.0.2 или более поздней версии
  - `g++` или `clang` (или другой C++14-совместимый компилятор, подходящий для вашей операционной системы)
  - `OpenSSL` 1.1.1 (включая заголовочные файлы на языке C) версии 1.1.1 или более поздней
  - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`, `liblz4-dev`.

### Ubuntu

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3. Предположим, что вы загрузили дерево исходного кода в каталог `~/ton`, где `~` - ваш домашний каталог, и создали пустой каталог `~/ton-build`:

```bash
mkdir ton-build
```

Затем выполните следующие действия в терминале Linux или MacOS:

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### MacOS

Подготовьте систему, установив необходимые системные пакеты:

```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

Используйте только что установленный clang:

```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

Скомпилируйте secp256k1:

```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```

И lz4:

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```

Установите и выберите OpenSSL 3.0:

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

Теперь вы можете скомпилировать TON:

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
Если вы компилируете на компьютере с небольшим объемом памяти (например, 1 Гб), не забудьте [создать раздел подкачки] (/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory).
:::

## Загрузка Global Config

Для таких инструментов, как Lite Client, вам необходимо загрузить сетевой Global Config.

Загрузите актуальный файл конфигурации https://ton-blockchain.github.io/global.config.json для mainnet:

```bash
wget https://ton-blockchain.github.io/global.config.json
```

или https://ton-blockchain.github.io/testnet-global.config.json для testnet:

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## Lite Client

Чтобы собрать Lite Client, выполните шаги выше: [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [загрузка config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), а затем запустите сборку:

```bash
cmake --build . --target lite-client
```

Запустите Lite Client с Global Config:

```bash
./lite-client/lite-client -C global.config.json
```

Если все установлено успешно, Lite Client подключится к специальному серверу (полноценному узлу сети TON Blockchain) и отправит на него несколько запросов.
Если вы укажете в качестве дополнительного аргумента доступный для записи каталог "database", Lite Client загрузит и сохранит блок и состояние, соответствующие самому новому мастерчейн-блоку:

```bash
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

Основную справочную информацию можно получить, набрав `help` в Lite Client. Для выхода введите `quit` или нажмите `Ctrl-C`.

## FunC

Чтобы собрать компилятор FunC из исходного кода, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) выше, и запустите сборку:

```bash
cmake --build . --target func
```

Скомпилируйте смарт-контракт FunC:

```bash
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

Чтобы собрать компилятор Fift из исходного кода, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) выше, и запустите сборку:

```bash
cmake --build . --target fift
```

Запустите скрипт Fift:

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

Чтобы собрать tonlib-cli, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [загрузка config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), а затем запустите сборку:

```bash
cmake --build . --target tonlib-cli
```

Запустите tonlib-cli с Global Config:

```bash
./tonlib/tonlib-cli -C global.config.json
```

Основную справочную информацию можно получить, набрав `help` в tonlib-cli. Для выхода введите `quit` или нажмите `Ctrl-C`.

## RLDP-HTTP-Proxy

Чтобы собрать rldp-http-proxy, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [загрузка config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), а затем запустите сборку:

```bash
cmake --build . --target rldp-http-proxy
```

Двоичный файл rldp-http-proxy будет иметь расположение:

```bash
./rldp-http-proxy/rldp-http-proxy
```

## generate-random-id

Чтобы собрать generate-random-id, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) и запустите сборку:

```bash
cmake --build . --target generate-random-id
```

Двоичный файл generate-random-id будет иметь расположение:

```bash
./utils/generate-random-id
```

## storage-daemon

Чтобы собрать storage-daemon и storage-daemon-cli, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) и запустите сборку:

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

Двоичные файлы будут иметь расположение:

```bash
./storage/storage-daemon/
```

# Компиляция старых версий TON

Выпуски TON: https://github.com/ton-blockchain/ton/tags

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

## Компиляция старых версий на Apple M1:

TON поддерживает Apple M1 с 11 июня 2022 года ([Добавить поддержку Apple M1 (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430)).

Для компиляции старых ревизий TON на Apple M1:

1. Обновите субмодуль RocksDb до версии 6.27.3
  ```bash
  cd ton/third-party/rocksdb/
  git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
  ```

2. Замените `CMakeLists.txt` в корневом каталоге на https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory.md
================================================
# Компиляция TON на компьютерах с ограниченной памятью

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution
В этом разделе описываются инструкции и руководства по взаимодействию с TON на низком уровне.
:::

Создайте раздел подкачки для компиляции TON на компьютере с малым объемом памяти (менее 1 ГБ).

## Требования

Во время компиляции C++ в системе Linux возникают следующие ошибки, приводящие к прерыванию компиляции:

```
C++: fatal error: Killed signal terminated program cc1plus compilation terminated.
```

## Решение

Это происходит из-за нехватки памяти и решается путем создания разделов подкачки.

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

Команда для удаления раздела подкачки:

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

Команда освобождения места:

```bash
sudo swapoff -a
#Detailed usage: swapoff --help
#View current memory usage: --swapoff: free -m
```



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig-js.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig-js.md
================================================
---
description: В рамках этого руководства вы научитесь разворачивать кошелек с мультиподписью, а также отправите несколько транзакций с помощью библиотеки ton
---

# Взаимодействие с кошельками с мультиподписью при помощи TypeScript

:::warning
Эта страница сильно устарела и скоро будет обновлена.
См. [multisig-contract-v2](https://github.com/ton-blockchain/multisig-contract-v2), самый новый контракт с мультиподписью на TON.
Используйте npm и не обновляйте.
:::

## Введение

Если вы не знаете, что такое мультиподписной кошелек в ​​TON, вы можете ознакомиться с этим [здесь](/v3/guidelines/smart-contracts/howto/multisig)

Выполнив эти действия, вы узнаете, как:

- Создать и развернуть кошелек с мультиподписью
- Создать, подписать и отправить транзакции с помощью этого кошелька

Мы создадим проект TypeScript и будем использовать библиотеку [ton](https://www.npmjs.com/package/ton), поэтому вам нужно сначала установить ее. Мы также будем использовать [ton-access](https://www.orbs.com/ton-access/):

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

Полный код этого руководства доступен по ссылке:

- https://github.com/Gusarich/multisig-ts-example

## Создание и развертывание кошелька с мультиподписью

Давайте создадим исходный файл, например `main.ts`. Откройте его в вашем любимом редакторе кода и следуйте этому руководству!

Сначала нам необходимо импортировать все основные компоненты

```js
import { Address, beginCell, MessageRelaxed, toNano, TonClient, WalletContractV4, MultisigWallet, MultisigOrder, MultisigOrderBuilder } from "ton";
import { KeyPair, mnemonicToPrivateKey } from 'ton-crypto';
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

Создайте экземпляр `TonClient`:

```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```

Далее нам понадобятся пары ключей для работы:

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

Существует два способа создать объект `MultisigWallet`:

- Импортировать существующий из адреса

```js
let addr: Address = Address.parse('EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE');
let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
```

- Создать новый

```js
let mw: MultisigWallet = new MultisigWallet([keyPairs[0].publicKey, keyPairs[1].publicKey], 0, 0, 1, { client });
```

Есть также два способа его развертывания

- Через внутреннее сообщение

```js
let wallet: WalletContractV4 = WalletContractV4.create({ workchain: 0, publicKey: keyPairs[4].publicKey });
//wallet should be active and have some balance
await mw.deployInternal(wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey), toNano('0.05'));
```

- Через внешнее сообщение

```js
await mw.deployExternal();
```

## Создание, подпись и отправка заявки

Для создания новой заявки нам нужен объект `MultisigOrderBuilder`.

```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```

Далее мы можем добавить в нее несколько сообщений.

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

После того как вы закончите с добавлением сообщений, преобразуйте `MultisigOrderBuilder` в `MultisigOrder`, используя метод `build()`.

```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```

Теперь давайте создадим еще одну заявку, добавим в нее сообщение, подпишем ее другим набором ключей и объединим подписи этих заявок.

```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); //Now order1b have also have all signatures from order2b
```

И, в завершение, отправим подписанную заявку:

```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

Далее нам необходимо собрать проект

```bash
yarn tsc
```

И запустить скомпилированный файл

```bash
node main.js
```

Если компиляция не выдает никаких ошибок, вы все сделали правильно! Теперь осталось проверить, прошла ли ваша транзакция успешно в любом кошельке или проводнике.

## Другие методы и свойства

Вы можете легко очистить сообщения из объектов `MultisigOrderBuilder`:

```js
order2.clearMessages();
```

Вы также можете очистить подписи из объектов `MultisigOrder`:

```js
order2b.clearSignatures();
```

И, конечно, вы можете получить внешние свойства из объектов `MultisigWallet`, `MultisigOrderBuilder` и `MultisigOrder`

- MultisigWallet:
 - `owners` - `словарь <number, Buffer>` подписей *ownerId => signature*
 - `workchain` - воркчейн, где развернут кошелек
 - `walletId` - идентификатор кошелька
 - `k` - количество подписей, необходимых для подтверждения транзакции
 - `address` - адрес кошелька
 - `provider` - экземпляр `ContractProvider`.

- MultisigOrderBuilder
 - `messages` - массив `MessageWithMode`, который будет добавлен к заявке
 - `queryId` - глобальное время, до наступления которого заявка является действительной

- MultisigOrder
 - `payload` - `Cell` с полезной нагрузкой заявки
 - `signatures` - `Dictionary <number, Buffer>` подписей *ownerId => signature*

## Ссылки

- [Низкоуровневое руководство по мультиподписи](/v3/guidelines/smart-contracts/howto/multisig)
- [Документация ton.js](https://ton-community.github.io/ton/)
- [Исходный код контракта мультиподписи](https://github.com/ton-blockchain/multisig-contract)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/multisig.md
================================================
---
description: По окончании обучения вы развернете контракт с мультиподписью в блокчейне TON.
---

# Создание простого контракта с мультиподписью с помощью fift

:::caution продвинутый уровень
Эта информация **очень низкого уровня**. Может быть сложной для понимания новичками и предназначена для продвинутых пользователей, которые хотят понять работу [fift](/v3/documentation/smart-contracts/fift/overview). Использование fift не требуется в повседневных задачах.
:::

## 💡 Общие сведения

Это руководство поможет вам узнать, как использовать ваш контракт с мультиподписью.
Напомним, что (n, k)-контракт с мультиподписью – это мультиподписной кошелек с n держателями закрытых ключей, который принимает запросы на отправку сообщений, если запрос, заявка, собирает не менее k подписей держателей.

На основе оригинального кода контракта мультиподписи и обновлений от akifoq:

- [оригинальный multisig-code.fc блокчейна TON](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig) с fift библиотекой для работы с мультиподписью.

:::tip совет для начинающих
Для тех, кто впервые работает с мультиподписью: [Что такое технология мультиподписи? (видео)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 Чему вы научитесь

- Как создать и настроить простой кошелек с мультиподписью.
- Как развернуть кошелек с мультиподписью с помощью lite-client.
- Как подписать запрос и отправить его в сообщении в блокчейн.

## ⚙ Настройте свое окружение

Прежде чем мы начнем наше путешествие, проверьте и подготовьте ваше окружение.

- Установите двоичные файлы `func`, `fift`, `lite-client` и `fiftlib` из раздела [установки](/v3/documentation/archive/precompiled-binaries).
- Клонируйте [репозиторий](https://github.com/akifoq/multisig) и откройте каталог в CLI.

```bash
git clone https://github.com/akifoq/multisig.git
cd ~/multisig
```

## 🚀 Давайте начнем!

1. Скомпилируйте код в fift.
2. Подготовьте ключи для владельцев мультиподписи.
3. Разверните контракт.
4. Взаимодействуйте с развернутым кошельком с мультиподписью в блокчейне.

### Скомпилируйте контракт

Скомпилируйте контракт в Fift с помощью:

```cpp
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```

### Подготовьте ключи владельцев мультиподписи

#### Создайте ключи участников

Чтобы создать ключ, вам нужно запустить:

```cpp
fift -s new-key.fif $KEY_NAME$
```

- Где `KEY_NAME` - это имя файла, в который будет записан закрытый ключ.

Например:

```cpp
fift -s new-key.fif multisig_key
```

Мы получим файл `multisig_key.pk` с закрытым ключом внутри.

#### Соберите открытые ключи

Также скрипт выдаст открытый ключ в формате:

```
Public key = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

Все, что после `"Public key = "`, нужно где-то сохранить!

Давайте сохраним в файле `keys.txt`. Важно, чтобы каждый открытый ключ был указан с новой строки.

### Разверните контракт

#### Разверните через lite-client

После создания всех ключей вам необходимо собрать открытые ключи в текстовый файл `keys.txt`.

Например:

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

После этого вам нужно запустить:

```cpp
fift -s new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

- `$WALLET_ID$` - номер кошелька, назначенный для текущего ключа. Рекомендуется использовать уникальный `$WALLET_ID$` для каждого нового кошелька с тем же ключом.
- `$KEYS_COUNT$` - количество ключей, необходимых для подтверждения. Обычно оно равно количеству открытых ключей

:::info Объяснение wallet_id
Можно создать много кошельков с одинаковыми ключами (ключ Алисы, ключ Боба). Что же делать, если у Алисы и Боба уже есть сокровища? Именно в таком случае `$WALLET_ID$` и выполняет свою роль.
:::

Скрипт выведет что-то вроде:

```bash
new wallet address = 0:4bbb2660097db5c72dd5e9086115010f0f8c8501e0b8fef1fe318d9de5d0e501

(Saving address to file wallet.addr)

Non-bounceable address (for init): 0QBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAbel

Bounceable address (for later access): kQBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAepg

(Saved wallet creating query to file wallet-create.boc)
```

:::info
Если у вас ошибка "public key must be 48 character long", убедитесь, что в вашем файле `keys.txt` имеет тип переноса слов в unix - LF. Например, перенос слов можно изменить с помощью редактора Sublime text.
:::

:::tip
Адрес возврата лучше сохранить — это адрес кошелька.
:::

#### Активируйте свой контракт

Вам нужно отправить немного TON в нашу недавно сгенерированную *сокровищницу*. Например, 0,5 TON. Вы можете отправить тестовые монеты через [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

После этого необходимо запустить lite-client:

```bash
lite-client -C global.config.json
```

:::info Где взять `global.config.json`?
Вы можете получить новый файл конфигурации `global.config.json` для [основной сети](https://ton.org/global-config.json) или [тестовой сети](https://ton.org/testnet-global.config.json).
:::

После запуска lite-client лучше всего запустить команду `time` в консоли lite-client, чтобы убедиться в успешном подключении:

```bash
time
```

Итак, lite-клиент работает!

Далее вам необходимо развернуть кошелек. Для этого выполните команду:

```
sendfile ./wallet-create.boc
```

После этого кошелек будет готов к работе в течение минуты.

### Взаимодействие с кошельком с мультиподписью

#### Создание запроса

Для начала вам необходимо создать запрос сообщения:

```cpp
fift -s create-msg.fif $ADDRESS$ $AMOUNT$ $MESSAGE$
```

- `$ADDRESS$` - адрес, куда отправлять монеты
- `$AMOUNT$` - количество монет
- `$MESSAGE$` - имя файла для скомпилированного сообщения.

Например:

```cpp
fift -s create-msg.fif EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB 0.1 message
```

:::tip
Чтобы добавить комментарий к вашей транзакции, используйте атрибут `-C comment`. Для получения дополнительной информации запустите файл *create-msg.fif* без параметров.
:::

#### Выберите кошелек

Далее вам необходимо выбрать кошелек, с которого вы будете отправлять монеты:

```
fift -s create-order.fif $WALLET_ID$ $MESSAGE$ -t $AWAIT_TIME$
```

Где

- `$WALLET_ID$` - это идентификатор кошелька, поддерживаемый этим контрактом с мультиподписью.
- `$AWAIT_TIME$` — Время в секундах, в течение которого смарт-контракт будет ожидать подписи от владельцев кошелька с мультиподписью для запроса.
- `$MESSAGE$` — здесь указано имя boc-файла сообщения, созданного на предыдущем шаге.

:::info
Если за время `$AWAIT_TIME$` запрос не был подписан, то валидность запроса истекает. Стандартное время ожидания составляет 2 часа (7200 секунд).
:::

Например:

```
fift -s create-order.fif 0 message -t 7200
```

Готовый файл будет сохранен в `order.boc`

:::info
`order.boc` необходимо предоставить держателям ключей, они должны его подписать.
:::

#### Подпишите свою часть

Для совершения этой операции, вам необходимо выполнить:

```bash
fift -s add-signature.fif $KEY$ $KEY_INDEX$
```

- `$KEY$` - имя файла, содержащего закрытый ключ для подписи, без расширения.
- `$KEY_INDEX$` - индекс указанного ключа в `keys.txt` (с нулевым индексом)

Например, для нашего файла `multisig_key.pk`:

```
fift -s add-signature.fif multisig_key 0
```

#### Создайте сообщение

После того, как все подписали заявку, ее нужно преобразовать в сообщение для кошелька и подписать снова с помощью следующей команды:

```
fift -s create-external-message.fif wallet $KEY$ $KEY_INDEX$
```

В этом случае будет достаточно только одной подписи владельца кошелька. Идея заключается в том, что контракт не может быть атакован имея недействительные подписи.

Например:

```
fift -s create-external-message.fif wallet multisig_key 0
```

#### Отправьте подпись в блокчейн TON

После этого вам нужно снова запустить light client:

```bash
lite-client -C global.config.json
```

Далее нам нужно только отправить нашу подпись! Для этого запустите:

```bash
sendfile wallet-query.boc
```

Если все остальные подписали запрос, он будет выполнен!

Вы сделали это, ура! 🚀🚀🚀

## См. также

- [Подробнее о кошельках с мультиподписью в TON](https://github.com/akifoq/multisig) от *[@akifoq](https://t.me/aqifoq)*
- [Кошелек с мультиподписью v2](https://github.com/ton-blockchain/multisig-contract-v2)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/nominator-pool.mdx
================================================
# Как использовать пул номинаторов

:::tip
Перед чтением этого руководства рекомендуется ознакомиться со [спецификацией Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool).
:::

## Запуск валидатора в режиме пула номинаторов

1. Настройте аппаратное обеспечение валидатора, для этого потребуется: 8 vCPUs, 128 ГБ RAM, 1 ТБ SSD, фиксированный IP-адрес и скорость канала 1 Гб/с.

   Для поддержания стабильности сети рекомендуется распределять узлы валидаторов в разных географических точках по всему миру, а не концентрировать их в одном дата-центре. Вы можете воспользоваться [этим сайтом](https://status.toncenter.com/), чтобы оценить загрузку различных локаций. Карта показывает загрузку центров обработки данных в Европе, в частности в Финляндии, Германии и Франции, поэтому использовать таких провайдеров, как Hetzner и OVH, не рекомендуется.

   > Убедитесь, что оборудование соответствует или превосходит указанные выше характеристики. Запуск валидатора на несоответствующем оборудовании негативно сказывается на работе сети и может привести к штрафам.
   >
   > Обратите внимание, что с мая 2021 года компания Hetzner запретила майнинг на своих серверах, данный запрет распространяется как на алгоритмы PoW, так и на PoS. Даже установка обычного узла может быть расценена как нарушение условий обслуживания.
   >
   > **Рекомендуемые провайдеры:** [Amazon](https://aws.amazon.com/), [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/), [Alibaba Cloud](https://alibabacloud.com/), [Latitude](https://www.latitude.sh/).

2. Установите и синхронизируйте **MyTonCtrl**, как описано в руководстве [здесь](/v3/guidelines/nodes/running-nodes/full-node#установите-mytonctrl).

   Также доступна [видео-инструкция](/v3/guidelines/nodes/running-nodes/full-node#запуск-узла-видео).

3. Переведите 1 TON на адрес кошелька валидатора. Адрес можно узнать в MyTonCtrl с помощью команды `wl`.

4. Используйте команду `aw`, чтобы активировать ваш кошелек валидатора.

5. Активируйте режим пула:

   ```bash
   enable_mode nominator-pool
   set stake null
   ```

6. Создайте два пула (для четных и нечетных раундов проверки):

   ```bash
   new_pool p1 0 1 1000 300000
   new_pool p2 0 1 1001 300000
   ```

   где:

   - `p1` – имя пула;
   - `0` % – доля вознаграждения валидатора (например, введите 40 для 40%);
   - `1` – максимальное количество номинаторов в пуле (\<= 40);
   - `1000` TON – минимальная ставка валидатора (>= 1 000 TON);
   - `300000` TON – минимальная ставка номинатора (>= 10 000 TON);

   > (!) Конфигурации пулов не обязательно должны быть одинаковыми, можно добавить 1 к минимальной ставке одного пула, чтобы сделать их разными.
   >
   > (!) Воспользуйтесь https://tonmon.xyz/, чтобы определить текущую минимальную ставку валидатора.

7. Введите `pools_list`, чтобы отобразить адреса пулов:

   ```bash
   pools_list
   Name  Status  Balance  Address
   p1    empty   0        0f98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780qIT
   p2    empty   0        0f9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV5jL
   ```

8. Отправьте по 1 TON в каждый пул и активируйте пулы:

   ```bash
   mg validator_wallet_001 0f98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780qIT 1
   mg validator_wallet_001 0f9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV5jL 1
   activate_pool p1
   activate_pool p2
   ```

9. Введите `pools_list`, чтобы отобразить пулы:

   ```bash
   pools_list
   Name  Status  Balance      Address
   p1    active  0.731199733  kf98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780v_W
   p2    active  0.731199806  kf9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV8UO
   ```

10. Откройте каждый пул по ссылке "https://tonscan.org/nominator/{address_of_pool}" и проверьте конфигурацию пула.

11. Продолжайте вносить депозит валидатора в каждый пул:

    ```bash
    deposit_to_pool validator_wallet_001 <address_of_pool_1> 1005
    deposit_to_pool validator_wallet_001 <address_of_pool_2> 1005
    ```

`1005` – это сумма депозита в TON. Имейте в виду, что за обработку депозита пулом будет вычтен 1 TON.

12. Продолжайте вносить депозит номинатора в каждый пул:

    Перейдите по ссылке на пул (из **шага 10**) и нажмите **ADD STAKE**.
    Также можно внести депозит с помощью **MyTonCtrl**, используя следующие команды:

    ```bash
    mg nominator_wallet_001 <address_of_pool_1> 300001 -C d
    mg nominator_wallet_001 <address_of_pool_2> 300001 -C d
    ```

> (!) Кошелек номинатора должен быть инициализирован в basechain (воркчейн 0).
>
> (!) Помните, что кошелек валидатора и кошелек номинатора должны храниться отдельно! Кошелек валидатора должен храниться на сервере с узлом валидатора, чтобы обеспечить обработку всех системных транзакций. Кошелек номинатора должен храниться в вашем холодном криптовалютном кошельке.
>
> Чтобы вывести депозит номинатора, отправьте транзакцию с комментарием `w` на адрес пула (приложите 1 TON для обработки транзакции). Также можно выполнить это действие с помощью **MyTonCtrl**.

13. Предложите номинаторам внести депозит в ваши пулы. Участие в валидации начнется автоматически.

    > (!) Убедитесь, что на вашем кошельке валидатора есть не менее 200 TON в месяц для оплаты комиссий.

## Конфигурация пула

Если вы собираетесь давать в долг самому себе, используйте `new_pool p1 0 1 1000 300000` (максимум 1 номинатор, доля валидаторов 0%).

Если вы создаете пул для большого количества номинаторов, то можно использовать: `new_pool p1 40 40 10000 10000` (максимум 40 номинаторов, доля валидаторов 40%, минимальная ставка участника 10 000 TON).

## Переход обычного валидатора в режим пула номинаторов

1. Введите `set stake 0`, чтобы прекратить участие в выборах.

2. Ожидайте возврата двух ваших ставок от избирателя.

3. Выполните действия из раздела [Запуск валидатора в режиме пула номинаторов](#запуск-валидатора-в-режиме-пула-номинаторов), начиная с **4-го шага** и далее.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/shard-optimization.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/shard-optimization.mdx
================================================
# Оптимизация шардов в TON

## Основы архитектуры

TON разработан для параллельной обработки множества транзакций. Эта возможность основана на [парадигме бесконечного шардинга](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm). Это означает, что как только нагрузка на группу валидаторов приближается к пределу их пропускной способности, они разделяются, шардируются. В последствии две группы валидаторов будут обрабатывать общую нагрузку независимо и параллельно. Это разделение происходит детерминированно, и то, к какой группе будут относится обрабатываемые транзакции, зависит от адреса контракта, связанного с этой транзакцией. Адреса, которые находятся близко друг к другу (имеют одинаковый префикс), будут обрабатываться в одной группе, шарде.

Когда сообщение отправляется из одного контракта в другой, есть два возможных сценария: либо оба контракта будут находиться в одном шарде, либо в разных. В первом случае текущая группа уже имеет все необходимые данные и может немедленно приступить к обработке сообщения. В ином случае сообщение должно быть направлено из одной группы в другую. Чтобы избежать потери сообщений или двойной обработки, необходим корректный учет. Это делается путем регистрации очереди исходящих сообщений из шарда отправителя в блоке мастерчейна, а затем шард получателя должен явно подтвердить, что он обработал эту очередь. Такие накладные расходы замедляют доставку сообщений между шардами, так как между блоком, в который было отправлено сообщение, и блоком, в котором оно было получено, должен быть как минимум один блок мастерчейна. Эта задержка обычно составляет около 12-13 секунд.

Поскольку транзакции на одном счете всегда обрабатываются в одном шарде, скорость транзакций в секунду (TPS) для одного счета ограничена. Это означает, что при разработке архитектуры для нового протокола массового масштабирования следует избегать центральных точек. Кроме того, если цепочка транзакций следует по одному и тому же маршруту, то шардирование ее не ускорит, так как ограничение TPS для каждого контракта в цепочке будет одинаковым. Однако из-за отсутствия задержки доставки общее время обработки цепочки будет выше.

В системе массового масштабирования компромисс между задержкой и пропускной способностью становится тем моментом, который отличает хорошие протоколы от отличных.

## Шардировать или не шардировать

Чтобы улучшить пользовательский опыт и время обработки, разработчику протоколов необходимо понимать, какие части системы могут обрабатываться параллельно и, следовательно, для повышения пропускной способности должны быть шардированы. А также какие части должны быть строго последовательны и, следовательно, при помещении их в один шард будут работать с наименьшей задержкой.

Отличным примером оптимизации пропускной способности являются жетоны. Поскольку переходы из A в B и из C в D не зависят друг от друга, их можно обрабатывать параллельно. Распределив все jetton-кошельки равномерно и случайно по адресному пространству, мы сможем добиться идеального баланса нагрузки по блокчейну. Что в свою очередь позволит достичь пропускной способности в сотни переводов в секунду (тысячи в будущем) с целевой задержкой.

Верно и обратное – если другой смарт-контракт А, который имеет дело с жетоном Х, совершает произвольную операцию, когда получает этот жетон (а контракт jetton-кошелька A — это B), то тогда размещение контракта A и его кошелька B в разных шардах не увеличит пропускную способность. В самом деле, каждый входящий перевод будет проходить через одну и ту же цепочку адресов, и каждый адрес будет узким местом. В этом случае целесообразно переместить контракты A и B в один шард, тем самым уменьшив общее время цепочки.

## Практические выводы для разработчиков смарт-контрактов

Если у вас есть один смарт-контракт, отвечающий за бизнес-логику, попробуйте развернуть несколько подобных контрактов, чтобы воспользоваться средствами параллелизации TON. Если это невозможно сделать и ваш смарт-контракт взаимодействует с предопределенным набором других смарт-контрактов (скажем, jetton-кошельков), то подумайте о том, чтобы поместить их всех в один шард. Часто это можно сделать вне сети (путем ввода конкретных адресов контрактов, чтобы все нужные jetton-кошельки имели соседние адреса), иногда такой подход допускается и внутри блокчейна.

Ожидается, что подобные улучшения производительности узлов и сети увеличат пропускную способность одного шарда, а также сократят задержку доставки. Вы так же должны их учитывать, если вы планируете делать приложение массовым. По мере присоединения большего количества пользователей, оптимизация шардов будет приобретать все большее значение. В конечном итоге это станет решающим фактором – пользователи всегда будут выбирать наиболее удобное для них приложение, то есть приложение с меньшей задержкой. Поэтому не откладывайте оптимизацию шардов вашего приложения, рассчитывая на глобальное улучшение сети. Сделайте это сейчас! Во многих случаях это может быть даже важнее оптимизации газа.

## Практические выводы для сервисов

### Депозиты

Если вы ожидаете, что скорость пополнения счета превысит, скажем, 30 переводов в секунду, желательно иметь несколько адресов, которые позволят принимать пополнения параллельно, существенно увеличивая пропускную способность. Если вам известен адрес, с которого пользователь будет вносить депозит, например, через транзакцию в TON Connect, тогда вам стоит выбрать адрес, наиболее близкий к адресу кошелька пользователя. Готовый к использованию код на Typescript для выбора ближайшего адреса может выглядеть так:

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

Если вы ожидаете депозиты жетонов, в дополнение к созданию нескольких адресов депозита, желательно оптимизировать эти адреса по шардам: выбирать такие адреса, чтобы каждый адрес депозита находился в том же шарде, что и его jetton-wallet. Генератор для таких адресов можно найти [здесь](https://github.com/Trinketer22/turbo-wallet). Выбор ближайшего адреса к пользователю также будет целесообразным.

### Вывод средств

То же самое относится и к выводу средств; если вам нужно отправлять большое количество переводов в секунду, желательно иметь несколько адресов отправки и оптимизировать их с помощью jetton-wallets, если необходимо.

## Оптимизация шардов 101

### Описание шардов в терминологии Web 2

Блокчейн TON, как и любой другой блокчейн, является сетью, поэтому имеет смысл попытаться объяснить это в терминах сети web2 (ipv4).

#### Endpoint

В общей сети endpoint — это физическое устройство, в блокчейне endpoint — это смарт-контракт.

#### Шарды

В логике web2, шард — это не более чем подсеть. Единственное отличие с этой точки зрения в том, что у IPv4 32-битная схема адресации, а у TON — 256-битная.
Таким образом, префикс шарда в адресе контракта — это часть адреса контракта, которая идентифицирует группу валидаторов, которые будут вычислять результат входящего сообщения.
С точки зрения сети, очевидно, что запрос в том же шарде сети будет обрабатываться быстрее, чем тот, который маршрутизируется в другое месте, верно?
Это аналогично использованию CDN для размещения контента ближе к конечным пользователям, в свою очередь в TON мы развертываем контракт ближе к конечным пользователям.

Если нагрузка на шард превышает [определенный уровень](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm#algorithm-for-deciding-whether-to-split-or-merge), шард разделяется. Цель состоит в том, чтобы предоставить выделенные вычислительные ресурсы загружаемому контракту и изолировать его влияние на всю сеть.
Максимальная длина префикса шарда составляет всего 4 бита, поэтому блокчейн может быть разделен максимум на 16 шардов с префиксом 0 до 15.

### Проблемы при оптимизации шардов

Давайте перейдем к практике

#### Проверка принадлежности двух адресов одному шарду

Поскольку мы знаем, что префикс шарда равен максимум 4 битам, фрагмент кода для проверки может выглядеть следующим образом:

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

Самый простой способ проверить шард адреса — посмотреть на [необработанную форму](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses#raw-address).
Для этого можно использовать [страницу адреса](https://ton.org/address/).
Давайте проверим адрес USDT, например: `EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs`.
Вы увидите `0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe` как необработанное представление, а первые 4 бита по сути являются первым шестнадцатеричным символом - `b`.
Теперь мы знаем, что минтер USDT находится в шарде `b` (шестнадцатеричном) или `11` (десятичном), если хотите.

### Как развернуть контракт на определенном шарде

Чтобы понять, как это работает, нужно понять, как адрес контракта [зависит](/v3/documentation/smart-contracts/addresses#account-id) от его кода и данных.
По сути, это SHA256 кода и данных во время развёртывания.
Зная это, единственный способ развернуть контракт с тем же кодом в другом шарде — это корректировка начальных данных. Поле данных, которое используется для изменения результирующего адреса контракта, называется _nonce_.Для таких целей можно использовать любое поле, которое: доступно для безопасного обновления после развертывания или не оказывает прямого влияния на выполнение контракта.
Одним из первых известных контрактов, в которых использовался этот принцип, является [vanity contract](https://github.com/ton-community/vanity-contract).
В нём есть поле данных `salt`, единственное назначение которого — _подбор_ собственного значения, приводящее в итоге к желаемому шаблону адреса.
Размещение контракта в определенном шарде выполняется точно так же, за исключением того, что префикс, который нужно сопоставить, намного короче.
Одним из самых простых примеров, с которого можно начать, будет контракт кошелька.

- [Создание кошелька для другого шарда](/v3/guidelines/dapps/asset-processing/payments-processing/#wallet-creation-for-different-shards), статья описывает сценарий, когда публичный ключ используется как nonce для помещения кошелька в определенный шард.
- Другие примеры - [turbo-wallet](https://github.com/Trinketer22/turbo-wallet/blob/d239c1a1ac31c7f5545c2ef3ddc909d6cbdafe24/src/lib/contracts/HighloadWalletV3.ts#L44) использующий subwalletId для [тех же](https://github.com/Trinketer22/turbo-wallet/blob/d239c1a1ac31c7f5545c2ef3ddc909d6cbdafe24/src/lib/turboWallet.ts#L80) целей.
  Вы можете довольно быстро расширить интерфейс [ShardedContract](https://github.com/Trinketer22/turbo-wallet/blob/main/src/lib/ShardedContract.ts) с помощью вашего конструктора контрактов, чтобы сделать его _шардированным_.

## Решения для массового распределения жетонов

Если вам нужно распределить жетоны среди десятков/сотней тысяч или миллионов пользователей, прочитайте эту [статью](/v3/guidelines/dapps/asset-processing/mintless-jettons). Мы предлагаем вам присмотреться к существующим, проверенным в бою сервисам. Некоторые из них имеют глубокую оптимизацию, что делает их не только преднастроенными под шардирование, но и существенно более дешевыми относительно самописных решений:

- **Mintless Jettons:** Когда вам нужно распределить жетоны во время события генерации токенов (TGE), вы можете разрешить пользователям запрашивать предопределенный эирдроп непосредственно из контракта jetton-wallets. Он дешевый, не требует дополнительных транзакций и доступен по запросу (только пользователи, которым нужно потратить жетоны сейчас, смогут их получить). [ССЫЛКА]
- **Решение от Tonapi для массовой отправки жетонов:** позволяет распределять существующие жетоны путем прямой отправки в кошельки пользователей. Проверено в бою Notcoin и DOGS (несколько миллионов переводов каждый), оптимизировано для уменьшения задержки, пропускной способности и затрат. [Массовая отправка жетонов](https://docs.tonconsole.com/tonconsole/jettons/mass-sending)
- **Решение TokenTable для децентрализованного выпуска:** позволяет пользователям запрашивать жетоны из определенных транзакций требования (пользователи платят за комиссию). Проверено в бою Avacoin и DOGS (несколько миллионов переводов), оптимизировано для увеличения пропускной способности и затрат. [Введение](https://docs.tokentable.xyz/for-tvm-developers/introduction)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/single-nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/single-nominator-pool.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Как использовать Single Nominator Pool

:::tip
Перед чтением этого руководства рекомендуется ознакомиться со [спецификацией Single Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool).
:::

### Установка single nominator

:::caution
Перед началом работы убедитесь, что вы пополнили и [активировали](/v3/guidelines/nodes/running-nodes/validator-node#активация-кошельков) кошелек валидатора.
:::

1. Включите режим _single-nominator_:

```bash
MyTonCtrl> enable_mode single-nominator
```

2. Проверьте статус режима _single-nominator_:

```bash
MyTonCtrl> status_modes
Name              Status             Description
single-nominator  enabled   Orbs's single nominator pools.
```

3. Создайте пул:

```bash
MyTonCtrl> new_single_pool <pool-name> <owner_address>
```

Если вы уже создавали пул, то его можно импортировать:

```bash
MyTonCtrl> import_pool <pool-name> <pool-addr>
```

4. Введите `pools_list`, чтобы отобразить адреса пулов:

```bash
MyTonCtrl> pools_list
Name       Status  Balance  Version   Address
test-pool  empty   0.0      spool_r2  kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

5. Активируйте пул:

```bash
MyTonCtrl> activate_single_pool <pool-name>
```

После успешной активации пула проверьте статус:

```bash
MyTonCtrl> pools_list
Name       Status  Balance  Version   Address
test-pool  active  0.99389  spool_r2  kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

Теперь можно работать с этим пулом через MyTonCtrl как с обычным пулом номинаторов.

:::info
Если средств на балансе пула достаточно для участия в обоих раундах (`balance > min_stake_amount * 2`), то MyTonCtrl автоматически примет в них участие, используя `stake = balance / 2`, если только пользователь не сделает ставку вручную, используя команду `set stake`. Такое поведение отличается от работы пула номинаторов, но похоже на ставку с помощью кошелька валидатора.
:::

## Запуск без MyTonCtrl

#### Остановка уже запущенного валидатора

Если у вас установлен MyTonCtrl и запущен валидатор:

1. Остановите валидацию и выведите все средства.

#### Подготовка

Если у вас ранее не было валидатора, выполните следующее:

1. Запустите узел в [режиме валидатора](/v3/guidelines/nodes/running-nodes/full-node) и убедитесь, что он синхронизировался.
2. Остановите валидацию и выведите все средства.

### Подготовка Single Nominator

1. Установите [Node.js](https://nodejs.org/en) 16 или более поздней версии и npm ([подробные инструкции](https://github.com/nodesource/distributions#debian-and-ubuntu-based-distributions)).

2. Установите модули `ts-node` и `arg`:

```bash
$ sudo apt install ts-node
$ sudo npm i arg -g
```

4. Создайте симлинки для компиляторов:

```bash
$ sudo ln -s /usr/bin/ton/crypto/fift /usr/local/bin/fift
$ sudo ln -s /usr/bin/ton/crypto/func /usr/local/bin/func
```

5. Запустите тест, чтобы убедиться, что все настроено правильно:

```bash
$ npm run test
```

6. Замените скрипты MyTonCtrl `nominator-pool`: https://raw.githubusercontent.com/orbs-network/single-nominator/main/mytonctrl-scripts/install-pool-scripts.sh.

### Создание Single Nominator Pool

1. Получите API-ключ Toncenter у [@tonapibot](https://t.me/tonapibot) в Telegram.
2. Установите переменные окружения:

```bash
export OWNER_ADDRESS=<owner_address>
export VALIDATOR_ADDRESS=<validator_wallet_address>
export TON_ENDPOINT=https://toncenter.com/api/v2/jsonRPC
export TON_API_KEY=<toncenter api key>
```

2. Создайте адрес с которого будет происходить развертывание:

```bash
$ npm run init-deploy-wallet
Insufficient Deployer [EQAo5U...yGgbvR] funds 0
```

3. Пополните этот адрес на 2.1 TON.
4. Разверните смарт-контракт пула, после чего вы получите адрес пула: `Ef-kC0..._WLqgs`:

```
$ npm run deploy
```

5. Преобразуйте адрес в .addr:

```
$ fift -s ./scripts/fift/str-to-addr.fif Ef-kC0..._WLqgs
```

(сохранение адреса в файл single-nominator.addr).

6. Выполните бэкап приватного ключа диплоера `./build/deploy.config.json` и `single-nominator.addr` файлов.
7. Скопируйте `single-nominator.addr` в `mytoncore/pools/single-nominator-1.addr`.
8. Отправьте ставку с адреса владельца на адрес single nominator.

### Вывод средств с Single Nominator

Использование кошельков для вывода средств с Single Nominator.
Fift:

1. Создайте запрос "withdraw.boc" с суммой:

```bash
$ fift -s ./scripts/fift/withdraw.fif <withdraw_amount>
```

2. Создайте и подпишите запрос из кошелька владельца:

```bash
$ fift -s wallet-v3.fif <my-wallet> <single_nominator_address> <sub_wallet_id> <seqno> <amount=1> -B withdraw.boc
```

3. Широковещательный запрос:

```bash
$ lite-client -C global.config.json -c 'sendfile wallet-query.boc'
tons
```

1. Создайте запрос "withdraw.boc" с суммой:

```bash
$ fift -s ./scripts/fift/withdraw.fif <withdraw_amount>
```

2. Отправьте запрос на адрес single nominator:

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

d. Откройте deeplink на телефоне владельца.

## Депозитный пул

Вы можете сделать депозит с помощью **MyTonCtrl**, используя следующую команду:

```sh
MyTonCtrl> mg <from-wallet-name> <pool-account-addr> <amount>
```

или

```sh
MyTonCtrl> deposit_to_pool <pool-addr> <amount>
```

которая пополняет пул из кошелька валидатора.

Или выполните следующие действия:

1. Перейдите на страницу пула https://tonscan.org/nominator/{pool_address}.

2. Убедитесь, что информация о пуле отображается полностью. Если у пула некорректный смарт-контракт – информации не будет.

3. Нажмите кнопку `ADD STAKE` или отсканируйте QR-код с помощью Tonkeeper или любого другого TON-кошелька.

4. После перехода в кошелек введите сумму TON и отправьте транзакцию, таким образом средства будут добавлены в стейкинг.

Если кошелек не открывается автоматически, можно отправить транзакцию вручную, скопировав адрес пула. Отправьте транзакцию через любой кошелек TON. С отправленной транзакции будет списан 1 TON в качестве комиссии за обработку депозита.

## Вывод средств

Вы можете вывести средства, используя следующую команду:

```sh
MyTonCtrl> withdraw_from_pool <pool-addr> <amount>
```

Или же создать и отправить транзакцию вручную:

<Tabs groupId="Покупка NFT">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

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

## Процесс выборов

### Настройка Single Nominator Pool

Настройте смарт-контракт Single Nominator Pool, используя [следующие](/v3/guidelines/smart-contracts/howto/single-nominator-pool#установка-single-nominator) инструкции.

### Присоединяйтесь к выборам

[Внесите](/v3/guidelines/smart-contracts/howto/single-nominator-pool#депозитный-пул) минимальную ставку в Single Nominator Pool.

**MyTonCtrl** автоматически присоединится к выборам. Вы можете установить сумму ставки, которую MyTonCtrl отправляет в [контракт Избирателя](/v3/documentation/smart-contracts/contracts-specs/governance#избиратель) ~ каждые 18 часов в Mainnet и каждые 2 часа в Testnet.

```sh
MyTonCtrl> set stake 90000
```

**Минимальную сумму ставки** можно узнать с помощью команды `status`.

![](/img/docs/single-nominator/tetsnet-conf.png)

Вы можете задать `stake` как `null`, и тогда ставка будет рассчитываться в соответствии со значением `stakePercent` (можно проверить с помощью команды `status_settings`).

Для проверки состояния выборов:

```bash
MyTonCtrl> status
```

и для Testnet:

```bash
MyTonCtrl> status fast
```

Пример вывода:

![](/img/docs/single-nominator/election-status.png)

Если выборы начались и активирован Single Nominator Pool, валидатор должен **автоматически** отправить сообщение **ElectorNewStake** контракту избирателя в начале следующего раунда.

Проверьте кошелек валидатора:

```sh
MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  995.828585374     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
```

Затем проверьте историю транзакций:

```sh
MyTonCtrl> vas kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
Address                                           Status  Balance        Version
kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct  active  995.828585374  v1r3

Code hash
c3b9bb03936742cfbb9dcdd3a5e1f3204837f613ef141f273952aa41235d289e

Time                 Coins   From/To
39 minutes ago  >>>  1.3     kf_hz3BIXrn5npis1cPX5gE9msp1nMTYKZ3l4obzc8phrBfF
```

Транзакция **ElectorNewStake** в контракте Single Nominator в истории Tonviewer:

![](/img/docs/single-nominator/new-stake.png)

В приведенном выше примере **MyTonCtrl** автоматически делает ставку в `90000` Toncoins на контракт избирателя.

### Проверка состояния валидатора

В начале следующего раунда проверьте состояние валидатора **MyTonCtrl** командой `status` (для Testnet – `status fast`).

![](/img/docs/single-nominator/status-validator.png)

Чтобы удостовериться в том, что ваш узел стал полноценным валидатором, проверьте следующие условия:

1. **Validator Efficiency** (эффективность валидатора) – эффективность локального валидатора должна быть зеленой, а не `n/a`.
2. **Validator Index** (индекс валидатора) – индекс валидатора должен быть выше, чем -1.

### Проверка прибыли

В конце раунда **MyTonCtrl** отправляет сообщение **ElectorRecoverStakeRequest** смарт-контракту избирателя. В ответ избиратель отправляет сумму TON в размере `ставка + доход` на адрес Single Nominator Pool.

![!](/img/docs/single-nominator/validator-profit.png)

Историю транзакций вашего пула можно проверить с помощью команды `vas`:

![](/img/docs/single-nominator/validator-profit-vas.png)

### Прекращение участия

Если пользователь не хочет больше принимать участие в валидации:

1. Отключите режим валидатора:

```bash
MyTonCtrl> disable_mode validator
```

2. [Выведите](/v3/guidelines/smart-contracts/howto/single-nominator-pool#вывод-средств) все средства из контракта Single Nominator Pool в кошелек владельца.

## Переход обычного валидатора в режим пула номинаторов

1. Отключите режим `validator`, чтобы прекратить участие в выборах.
2. Ожидайте возврата двух ваших ставок от избирателя.
3. Выполните следующие [шаги](/v3/guidelines/smart-contracts/howto/single-nominator-pool#установка-single-nominator).

## Клиент Single Nominator Pool

- Существует простой клиент с открытым исходным кодом для развертывания и взаимодействия с контрактом – https://github.com/orbs-network/single-nominator-client.
- Если возникнут проблемы, то вы всегда можете обратиться за поддержкой в [Telegram](https://t.me/single_nominator).

## Запуск Single Nominator Pool с Vesting-контрактом

С самого начала владелец Vesting-контракта может управлять им с помощью своего контракта кошелька.
В этой схеме мы будем управлять взаимодействием нескольких контрактов.

| Смарт-контракты               | Интерфейс для управления                              |
| ----------------------------- | ----------------------------------------------------- |
| `validator_wallet`            | MyTonCtrl                                             |
| `vesting`                     | [vesting.ton.org](https://vesting.ton.org/)           |
| `owner_wallet`                | Приложение кошелька, например: Tonkeeper, MyTonWallet |
| `single_nominator_pool`       | MyTonCtrl                                             |

- `owner_wallet` – кошелек TON, которому принадлежит `vesting`.

:::caution
Убедитесь, что вы сохранили фразу для восстановления `owner_wallet` в Vesting. Если доступ к `owner_wallet` будет утерян, то доступ к управлению средствами `vesting` будет невозможен и не сможет быть восстановлен.
:::

1. Запустите [полный узел](/v3/guidelines/nodes/running-nodes/full-node) и дождитесь синхронизации.
2. Включите режим валидатора, получите адрес wallet_v1, который был создан в результате установки – извлеките его с помощью `wl` в MyTonCtrl.
3. Отправьте 200 TON (ежемесячные расходы) на `validator_wallet`.
4. Создайте `single_nominator_pool`:

```bash
MyTonCtrl> new_single_pool <pool-name> <vesting>
```

Пример:

```
MyTonCtrl> new_single_pool my_s_pool EQD...lme-D
```

5. Активируйте `single_nominator_pool`:

```bash
MyTonCtrl> activate_single_pool <pool-name>
```

Пример:

```
MyTonCtrl> activate_single_pool my_s_pool
```

6. После получения адреса `single_nominator_pool` on-chain, попросите того, кто отправил вам Vesting-контракт внести адрес в whitelist.
7. После того, как `single_nominator_pool` будет внесен в whitelist, вы сможете отправлять заблокированные токены из `vesting`-контракта в `single_nominator_pool` с помощью [vesting.ton.org](https://vesting.ton.org/):
   - подключитесь к `owner_wallet` на [vesting.ton.org](https://vesting.ton.org/).
   - создайте тестовый депозит из `vesting`. Отправьте 10 TON в `single_nominator_pool`.
   - с помощью интерфейса [vesting.ton.org](https://vesting.ton.org/) верните остаток средств (~ 8 TON) обратно в `vesting` с сообщением `amount 0, comment w`.
   - убедитесь, что вы получили остаток на `vesting`.
8. Переведите необходимое количество TON из `vesting`-контракта в `single_nominator_pool` для обоих циклов.
9. Дождитесь голосования валидаторов.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/wallet.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/howto/wallet.md
================================================
---
description: Как работать с кошельками, сообщениями и смарт-контрактами.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Работа со смарт-контрактами кошелька

## 👋 Введение

Прежде чем приступать к разработке смарт-контрактов, важно изучить как работают кошельки и транзакции на TON. Это поможет разработчикам понять принцип взаимодействия между кошельками, сообщениями и смарт-контрактами для выполнения конкретных задач разработки.

:::tip
Перед чтением руководства рекомендуется ознакомиться со статьей [Типы контрактов кошелька](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts).
:::

Мы научимся создавать операции без использования предварительно настроенных функций, это полезно для лучшего понимания процесса разработки. Дополнительные ссылки на материалы для изучения находятся в конце каждого раздела.

## 💡 Перед началом работы

Изучение данного руководства потребует базовых знаний JavaScript и TypeScript или Golang. На балансе кошелька должно быть как минимум 3 TON (это может быть биржевой счет, некастодиальный кошелек или бот Кошелек от Telegram). Также необходимо иметь представление об [адресах в TON](/v3/documentation/smart-contracts/addresses), [ячейке](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), [блокчейне блокчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).

:::info РАЗВИТИЕ MAINNET НЕОБХОДИМО
Работа с TON Testnet часто приводит к ошибкам при развертывании, сложностям с отслеживанием транзакций и нестабильной работе сети. Большую часть разработки лучше реализовать в TON Mainnet, чтобы избежать проблем, которые могут возникнуть при попытках уменьшить количество транзакций, и понизить сборы, соответственно.
:::

## 💿 Исходный код

Все примеры кода, используемые в руководстве, можно найти в [репозитории GitHub](https://github.com/aSpite/wallet-tutorial).

## ✍️ Что нужно для начала работы

- Установленный NodeJS
- Специальные библиотеки TON: @ton/ton 13.5.1+, @ton/core 0.49.2+ и @ton/crypto 3.2.0+

**ОПЦИОНАЛЬНО**: Если вы предпочитаете использовать Go, а не JS, то для разработки на TON необходимо установить GoLand IDE и библиотеку [tonutils-go](https://github.com/xssnick/tonutils-go). Эта библиотека будет использоваться в данном руководстве для версии Go.

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

## ⚙ Настройте свое окружение

Для создания проекта TypeScript выполните следующие шаги:

1. Создайте пустую папку (мы назовем ее WalletsTutorial).
2. Откройте папку проекта с помощью CLI.
3. Используйте следующие команды для настройки проекта:

```bash
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init --rootDir src --outDir build \ --esModuleInterop --target es2020 --resolveJsonModule --lib es6 \ --module commonjs --allowJs true --noImplicitAny false --allowSyntheticDefaultImports true --strict false
```

:::info
Процесс `ts-node` запускает выполнение кода TypeScript без предварительной компиляции, а `nodemon` используется для автоматического перезапуска приложения node при обнаружении изменений файлов в директории.
:::

```json
  "files": [
    "\\",
    "\\"
  ]
```

5. Затем создайте конфигурацию `nodemon.json` в корне проекта со следующим содержанием:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```

6. Добавьте этот скрипт в `package.json` вместо "test", который добавляется при создании проекта:

```json
"start:dev": "npx nodemon"
```

7. Создайте папку `src` в корне проекта и файл `index.ts` в этой папке.
8. Далее добавьте следующий код:

```ts
async function main() {
  console.log("Hello, TON!");
}

main().finally(() => console.log("Exiting..."));
```

9. Запустите код в терминале:

```bash
npm run start:dev
```

10. В итоге в консоли появится следующий вывод:

![](/img/docs/how-to-wallet/wallet_1.png)

:::tip Blueprint
TON Community создали отличный инструмент для автоматизации всех процессов разработки (развертывание, написание контрактов, тестирование) под названием [Blueprint](https://github.com/ton-org/blueprint). Однако нам не понадобится такой мощный инструмент, поэтому следует держаться приведенных выше инструкций.
:::

**ОПЦИОНАЛЬНО:** При использовании Golang выполните следующие шаги:

1. Установите GoLand IDE.
2. Создайте папку проекта и файл `go.mod` со следующим содержанием (для выполнения этого процесса может потребоваться изменить **версию Go**, если текущая используемая версия устарела):

```
module main

go 1.20
```

3. Введите следующую команду в терминал:

```bash
go get github.com/xssnick/tonutils-go
```

4. Создайте файл `main.go` в корне проекта со следующим содержанием:

```go
package main

import (
	"log"
)

func main() {
	log.Println("Hello, TON!")
}
```

5. Измените наименование модуля в файле `go.mod` на `main`.
6. Запустите код выше до появления вывода в терминале.

:::info
Также можно использовать другую IDE, поскольку GoLand не бесплатна, но она предпочтительнее.
:::

:::warning ВАЖНО

В каждом последующем разделе руководства будут указаны только те импорты, которые необходимы для конкретного раздела кода, новые импорты нужно будет добавлять и объединять со старыми.
:::

## 🚀 Давайте начнем!

В этом разделе мы узнаем, какие кошельки (V3 и V4) чаще всего используются на блокчейне TON, и как работают их смарт-контракты. Это позволит разработчикам лучше понять различные типы сообщений на платформе TON, упростить их создание и отправку в блокчейн, научиться разворачивать кошельки и, в конечном итоге, работать с highload-кошельками.

Наша основная задача – научиться создавать сообщения, используя различные объекты и функции: @ton/ton, @ton/core, @ton/crypto (ExternalMessage, InternalMessage, Signing и т.д.), чтобы понять, как выглядят сообщения в более широких масштабах. Для этого мы будем использовать две основные версии кошелька (V3 и V4), поскольку биржи, некастодиальные кошельки и большинство пользователей используют именно эти версии.

:::note
There may be occasions in this tutorial when there is no explanation for particular details. In these cases, more details will be provided in later stages of this tutorial.

**ВАЖНО:** В данном руководстве используется [код кошелька V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc). Следует отметить, что версия 3 имеет две ревизии: R1 и R2. В настоящее время используется только вторая ревизия, поэтому, когда мы по тексту ссылаемся на V3, это означает V3R2.
:::

## 💎 Кошельки TON Blockchain

Все кошельки, работающие на блокчейне TON, являются смарт-контрактами, и все, что работает на TON функционирует как смарт-контракт. Как и в большинстве блокчейнов TON позволяет разворачивать смарт-контракты и модифицировать их для различных целей, предоставляя возможность **полной кастомизация кошелька**. В TON смарт-контракты кошелька облегчают взаимодействие между платформой и другими типами смарт-контрактов. Однако важно понимать, как происходит данное взаимодействие.

### Взаимодействие с кошельком

В блокчейне TON существует два типа сообщений: `internal` (внутренние) и `external` (внешние). Внешние сообщения позволяют отправлять сообщения в блокчейн из внешнего мира, тем самым обеспечивая связь со смарт-контрактами, которые принимают такие сообщения. Функция, отвечающая за выполнение этого процесса, выглядит следующим образом:

```func
() recv_external(slice in_msg) impure {
    ;; some code
}
```

Перед более подробным изучением кошельков давайте рассмотрим, как они принимают внешние сообщения. На TON каждый кошелек хранит `public key`, `seqno` и `subwallet_id` владельца. При получении внешнего сообщения кошелек использует метод `get_data()` для извлечения данных из хранилища. Затем проводится несколько процедур верификации и определяется, принимать сообщение или нет. Это происходит следующим образом:

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

> 💡 Полезные ссылки:
>
> ["load_bits()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> ["get_data()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#get_data)
>
> ["begin_parse()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#begin_parse)
>
> ["end_parse()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#end_parse)
>
> ["load_int()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> ["load_uint()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_uint)
>
> ["check_signature()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#check_signature)
>
> ["slice_hash()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
>
> ["accept_message()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#accept_message)

Теперь давайте рассмотрим подробнее.

### Защита от повторения – Seqno

Защита от повторения сообщений в смарт-контракте кошелька основана на `seqno` (Sequence Number) – порядковом номере, который отслеживает порядок отправляемых сообщений. Предотвращение повторения сообщений очень важно, так как дубликаты могут поставить под угрозу целостность системы. Если изучить код смарт-контракта кошелька, то `seqno` обычно обрабатывается следующим образом:

```func
throw_unless(33, msg_seqno == stored_seqno);
```

Код выше сравнивает `seqno`, пришедшее во входящем сообщении с `seqno`, которое хранится в смарт-контракте. Если значения не совпадают, то контракт возвращает ошибку с кодом завершения `33`. Таким образом, предоставление отправителем недействительного `seqno` указывает на ошибку в последовательности сообщений, смарт-контракт предотвращает дальнейшую обработку и гарантирует защиту от таких случаев.

:::note
Также важно учитывать, что внешние сообщения могут быть отправлены кем угодно. Это означает, что, если вы отправите кому-то 1 TON, кто-то другой сможет повторить это сообщение. Однако, когда seqno увеличивается, предыдущее внешнее сообщение становится недействительным, а значит никто не сможет его повторить, что предотвращает возможность кражи ваших средств.
:::

### Подпись

Как уже упоминалось ранее, смарт-контракты кошелька принимают внешние сообщения. Однако, поскольку эти сообщения приходят из внешнего мира, таким данным нельзя полностью доверять. Поэтому в каждом кошельке хранится публичный ключ владельца. Когда кошелек получает внешнее сообщение, подписанное приватным ключом владельца, смарт-контракт использует публичный ключ для проверки подписи сообщения. Это гарантирует, что сообщение пришло именно от владельца контракта.

Чтобы выполнить эту проверку кошелек сначала извлекает подпись из входящего сообщения, затем загружает публичный ключ из хранилища, и проверяет подпись с помощью следующих процедур:

```func
var signature = in_msg~load_bits(512);
var ds = get_data().begin_parse();
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
```

Если все процедуры верификации завершены корректно, смарт-контракт принимает сообщение и обрабатывает сообщение:

```func
accept_message();
```

:::info accept_message()
Поскольку внешние сообщения не содержат Toncoin, необходимых для оплаты комиссии за транзакцию, функция `accept_message()` применяет параметр `gas_credit` (в настоящее время его значение составляет 10 000 единиц газа). Это позволяет контракту производить необходимые расчеты бесплатно, если газ не превышает значение `gas_credit`. После вызова функции `accept_message()` смарт-контракт вычитает все затраты на газ (в TON) из своего баланса. Подробнее об этом процессе можно прочитать [здесь](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects).
:::

### Срок действия транзакции

Еще одним шагом, используемым для проверки действительности внешних сообщений, является поле `valid_until`. Как видно из наименования переменной, это время в UNIX до которого сообщение будет действительным. Если процесс проверки завершился неудачей, контракт завершает обработку транзакции и возвращает код завершения `35`:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
throw_if(35, valid_until <= now());
```

Этот алгоритм защищает от потенциальных ошибок, например, когда сообщение уже недействительно, но по-прежнему отправляется в блокчейн по неизвестной причине.

### Различия кошелька V3 и V4

Ключевое различие между V3 и V4 кошелька заключается в поддержке кошельком V4 `плагинов`, пользователи могут устанавливать или удалять данные плагины, которые представляют собой специализированные смарт-контракты, способные запрашивать в назначенное время определенное количество TON из смарт-контракта кошелька.

Смарт-контракты кошелька, в свою очередь, на запросы плагинов автоматически отправляют в ответ нужное количество TON без необходимости участия владельца. Эта функция отражает **модель подписки**, которая является основным назначением плагинов. Мы не будем углубляться в детали далее, поскольку это выходит за рамки данного руководства.

### Как кошельки облегчают взаимодействие со смарт-контрактами

Как мы уже говорили, смарт-контракт кошелька принимает внешние сообщения, проверяет их и обрабатывает, если все проверки пройдены. Затем контракт запускает цикл извлечения сообщений из тела внешнего сообщения, после чего создает внутренние сообщения и отправляет их в блокчейн:

```func
cs~touch();
while (cs.slice_refs()) {
    var mode = cs~load_uint(8); ;; load message mode
    send_raw_message(cs~load_ref(), mode); ;; get each new internal message as a cell with the help of load_ref() and send it
}
```

:::tip `touch()`
На TON все смарт-контракты выполняются в виртуальной машине TON (TVM), основанной на стековой процессорной архитектуре. `~ touch()` помещает переменную `cs` на вершину стека, чтобы оптимизировать выполнение кода для меньшего расхода газа.
:::

Поскольку в одной ячейке может храниться **максимум 4 ссылки**, то на одно внешнее сообщение можно отправить максимум 4 внутренних сообщения.

> 💡 Полезные ссылки:
>
> ["slice_refs()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)
>
> ["send_raw_message() и message modes" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)
>
> ["load_ref()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_ref)

## 📬 Внешние и внутренние сообщения

В этом разделе мы узнаем чуть больше о внутренних `internal` и внешних `external` сообщениях. Мы создадим и отправим сообщения в сеть, при этом постараемся свести к минимуму зависимость от заранее созданных функций.

Для упрощения задачи воспользуемся готовым кошельком. Для этого:

1. Установите [приложение кошелька](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps) (например, автор использует Tonkeeper).
2. В настройках приложения кошелька перейдите на версию V3R2.
3. Внесите 1 TON на кошелек.
4. Отправьте сообщение на другой адрес (можно отправить его себе на этот же кошелек).

В результате приложение Tonkeeper развернет смарт-контракт кошелька, который мы сможем использовать для следующих шагов.

:::note
На момент написания руководства большинство приложений-кошельков на TON по умолчанию используют кошелек V4. В этом разделе плагины не требуются, а значит будет достаточно функциональности кошелька V3. Tonkeeper позволяет пользователям выбрать нужную им версию кошелька, поэтому рекомендуется развернуть кошелек V3.
:::

### TL-B

Как упоминалось ранее, все в блокчейне TON – это смарт-контракт, состоящий из ячеек. Чтобы правильно сериализовать и десериализовать данные, нам нужны стандарты. Для этой цели был разработан `TL-B` – универсальный инструмент для описания различных типов данных, структур и последовательностей внутри ячеек.

В этом разделе мы будем работать со схемой данных [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb). Этот файл будет незаменим при дальнейшей разработке, поскольку в нем описывается, как собираются различные типы ячеек. В нашем конкретном случае там представлена подробная информация о структуре и поведении внутренних и внешних сообщений.

:::info
В данном руководстве представлена общая информация. Для получения более подробной информации изучите [документацию по TL-B](/v3/documentation/data-formats/tlb/tl-b-language).
:::

### CommonMsgInfo

Изначально каждое сообщение должно хранить `CommonMsgInfo` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L123-L130)) или `CommonMsgInfoRelaxed` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L132-L137)). Эти данные позволяют определить технические детали, относящиеся к типу и времени сообщения, адресу получателя, техническим флагам и сборам.

Читая файл `block.tlb`, можно заметить три типа CommonMsgInfo: `int_msg_info$0`, `ext_in_msg_info$10`, `ext_out_msg_info$11`. Если не углубляться в детали, то конструктор `ext_out_msg_info` – это внешнее сообщение, которое может отправляться смарт-контрактом в качестве внешнего лога. Как пример подобного формата изучите смарт-контракт [Избирателя](https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF).

В схеме [TL-B указано](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128), что **при использовании типа ext_in_msg_info доступен только CommonMsgInfo**. Это происходит потому, что такие поля сообщения, как `src`, `created_lt`, `created_at` и другие, перезаписываются валидаторами во время обработки транзакций. В данном случае поле `src` наиболее важно, поскольку при отправке сообщения адрес отправителя неизвестен, и валидаторы заполняют данное поле во время верификации. Это гарантирует, что адрес `src` достоверен и не может быть изменен.

Структура `CommonMsgInfo` поддерживает спецификацию `MsgAddress`, но так как адрес отправителя обычно неизвестен, то записывается `addr_none$00`(`00`– два нулевых бита), и в этом случае используется структура `CommonMsgInfoRelaxed`, которая поддерживает `addr_none`. Для `ext_in_msg_info` (входящие внешние сообщения) используется структура `CommonMsgInfo`, поскольку эти типы сообщений используют данные не отправителя, а [MsgAddressExt](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100), что означает отсутствие необходимости перезаписывать данные.

:::note
Числа после символа `$` – это биты, которые необходимо хранить в начале определенной структуры, для дальнейшей идентификации этих структур при чтении (десериализации).
:::

### Создание внутреннего сообщения

Внутренние сообщения используются для передачи сообщений между смарт-контрактами. При анализе контрактов, которые отправляют сообщения, включающие написание контрактов (таких как [NFT](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/nft/nft-item.fc#L51-L56) и [Jetons](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-wallet.fc#L139-L144)), часто используются следующие строки кода:

```func
var msg = begin_cell()
  .store_uint(0x18, 6) ;; or 0x10 for non-bounce
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  ;; store something as a body
```

Рассмотрим `0x18` и `0x10`, которые представляют собой шестнадцатеричные числа, расположенные следующим образом (с учетом, что нужно выделить 6 бит): `011000` и `010000`. Это означает, что приведенный выше код можно переписать следующим образом:

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

Давайте рассмотрим подробно каждый параметр:

|   Параметр   |                                                                                                                                                                                                                                                                                            Описание                                                                                                                                                                                                                                                                                           |
| :----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| IHR Disabled |              В настоящее время отключена (это означает, что мы храним значение `1`), поскольку Мгновенная Маршрутизация Гиперкуба (Instant Hypercube Routing) реализована не полностью. Опция будет необходима, когда в сети появится большое количество [шардчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#множество-accountchains-шарды). Подробнее об IHR Disabled можно прочитать в [tblkch.pdf](https://ton.org/tblkch.pdf) (глава 2)             |
|    Bounce    | При отправке сообщений в процессе обработки смарт-контракта могут возникать различные ошибки. Чтобы избежать потери TON, необходимо установить `Bounce` значение `1` (true). В этом случае, если во время обработки транзакции возникнут ошибки в контракте, то сообщение и отправленное количество TON (за вычетом комиссии) будут возвращены отправителю. Подробнее о невозвращаемых сообщениях можно прочитать [здесь](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) |
|    Bounced   |                                                                                                                                                         Возвращаемые сообщения (Bounced) – это сообщения, которые возвращаются отправителю из-за ошибки, возникшей при обработке транзакции с помощью смарт-контракта. Этот параметр сообщает о том, является ли полученное сообщение *вернувшимся*                                                                                                                                                        |
|      Src     |                                                                                                                                                                                                                                        Адрес отправителя. В этом случае записываются два нулевых бита, чтобы указать адрес `addr_none`                                                                                                                                                                                                                                        |

Следующие две строки кода:

```func
...
.store_slice(to_address)
.store_coins(amount)
...
```

- указываем получателя и количество TON для отправки.

Посмотрим на оставшиеся строки кода:

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

|         Параметр         |                                                                                                                                                                                                                 Описание                                                                                                                                                                                                                 |
| :----------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Extra currency      |                                                                                                                                                       Дополнительная валюта. Это первичная реализация существующих жетонов, и в настоящее время она не используется                                                                                                                                                      |
|          IHR fee         |                                                                Комиссия IHR. Как уже говорилось, IHR в настоящее время не используется, поэтому данная комиссия всегда равна нулю. Подробнее об этом можно прочитать в [tblkch.pdf](https://ton.org/tblkch.pdf) (3.1.8)                                                               |
|      Forwarding fee      |                                                                                                                             Комиссия за пересылку сообщения. Подробнее об этом можно прочитать [здесь](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#плата-за-пересылку)                                                                                                                             |
| Logical time of creation |                                                                                                                                                                                        Время, затраченное на создание корректной очереди сообщений                                                                                                                                                                                       |
|   UNIX time of creation  |                                                                                                                                                                                                      Время создания сообщения в UNIX                                                                                                                                                                                                     |
|        State Init        |                                  Код и исходные данные для развертывания смарт-контракта. Если бит установлен в `0`, это означает, что у нас нет State Init. Но если он установлен в `1`, то необходимо записать еще один бит, который будет указывать, хранится ли State Init в той же ячейке (`0`) или записан как ссылка (`1`)                                  |
|       Message body       | Тело сообщения. Параметр определяет, как хранится тело сообщения. Иногда тело сообщения слишком велико, чтобы поместиться в само сообщение. В этом случае его следует хранить как **ссылку**, при этом бит устанавливается в `1`, чтобы показать, что тело сообщения используется в качестве ссылки. Если бит равен `0`, тело находится в той же ячейке, что и сообщение |

Значения, описанные выше (включая `src`), за исключением битов `State Init` и `Message Body`, перезаписываются валидаторами.

:::note
Если значение числа умещается в меньшее количество бит, чем установлено, то недостающие нули добавляются к левой части значения. Например, 0x18 умещается в 5 бит -> `11000`. Однако, как было сказано выше, требуется 6 бит, тогда конечный результат принимается `011000`.
:::

Приступим к формированию сообщения, которое будет отправлено с некоторым количеством Toncoin на другой кошелек V3.
Для начала, допустим, пользователь хочет отправить 0.5 TON самому себе с текстом **Hello, TON!**. Чтобы узнать как отправить сообщение с комментарием обратитесь к [этому разделу документации](/v3/documentation/smart-contracts/func/cookbook#как-отправить-простое-сообщение).

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

Выше мы создали ячейку `InternalMessageBody`, в которой хранится тело нашего сообщения. Обратите внимание, что при хранении текста, который не помещается в одну ячейку (1023 бита), необходимо **разбить данные на несколько ячеек** в соответствии со [следующей документацией](/v3/documentation/smart-contracts/message-management/internal-messages). Однако, в нашем случае высокоуровневые библиотеки создают ячейки в соответствии с требованиями, поэтому на данном этапе об этом не стоит беспокоиться.

Затем, в соответствии с ранее изученной информацией, создается `InternalMessage`:

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

### Создание сообщения

Для начала необходимо извлечь `seqno` (порядковый номер) смарт-контракта нашего кошелька. Для этого создается `Client`, который будет использоваться для отправки запроса на выполнение GET-метода `seqno`. Также необходимо добавить seed-фразу (которую вы сохранили при создании кошелька [здесь](#-внешние-и-внутренние-сообщения)), чтобы подписать наше сообщение, выполнив следующие действия:

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

Итак, необходимо отправить `seqno`, `keys` и `internal message`. Теперь нам нужно создать [сообщение](/v3/documentation/smart-contracts/message-management/sending-messages) для нашего кошелька и сохранить данные в этом сообщении в той последовательности, которая использовалась в начале руководства. Это делается следующим образом:

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

Обратите внимание, что здесь в `toSign` не было использовано `.endCell()`. Дело в том, что в данном случае необходимо **передать содержимое toSign непосредственно в тело сообщения**. Если бы потребовалась запись ячейки, ее пришлось бы хранить в виде ссылки.

:::tip Кошелек V4
В дополнение к базовому процессу верификации, который мы изучили для смарт-контрактов кошелька V3, смарт-контракт кошелька V4 [извлекает опкод, чтобы определить, требуется простой перевод или сообщение, связанное с плагином](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L94-L100). Чтобы соответствовать этой версии, необходимо добавить функции `storeUint(0, 8)` (JS/TS), `MustStoreUInt(0, 8)` (Golang) после записи seqno и перед указанием режима транзакции.
:::

### Создание внешнего сообщения

Чтобы доставить любое внутреннее сообщение в блокчейн из внешнего мира, необходимо отправить его во внешнем сообщении. Как мы уже рассмотрели ранее, необходимо использовать только структуру `ext_in_msg_info$10`, поскольку цель в том, чтобы отправить внешнее сообщение нашему контракту. Давайте создадим внешнее сообщение, которое будет отправлено в наш кошелек:

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

|   Параметр   |                                                                                                                                               Описание                                                                                                                                               |
| :----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Src     |    Адрес отправителя. Поскольку входящее внешнее сообщение не может иметь отправителя, в нем всегда будет 2 нулевых бита (`addr_none` [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100))    |
|  Import Fee  |                                                                                                                        Комиссия для оплаты импорта входящих внешних сообщений                                                                                                                        |
|  State Init  | Начальное состояние. В отличие от внутреннего сообщения, `State Init` внутри внешнего сообщения необходимо **для развертывания контракта из внешнего мира**. `State Init`, используемый вместе с внутренним сообщением, позволяет одному контракту развернуть другой |
| Message Body |                                                                                                   Тело сообщения. Сообщение, которое должно быть отправлено в контракт на обработку                                                                                                  |

:::tip 0b10
0b10 (b – двоичный) обозначает двоичную запись. В этом процессе хранятся два бита: `1` и `0`. Таким образом, мы указываем, что это `ext_in_msg_info$10`.
:::

Теперь у нас есть готовое сообщение, которое можно отправить нашему контракту. Для этого его нужно сначала сериализовать в `BOC` ([Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)), а затем отправить с помощью следующего кода:

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

> 💡 Полезная ссылка:
>
> [Подробнее о Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)

В результате мы получили вывод нашего BOC в консоли и сообщение, отправленное на наш кошелек. Скопировав строку в кодировке base64, можно [вручную отправить наше сообщение и получить хэш с помощью toncenter](https://toncenter.com/api/v2/#/send/send_boc_return_hash_sendBocReturnHash_post).

## 👛 Развертывание кошелька

Мы изучили основы создания сообщений, которые теперь пригодятся нам для развертывания кошелька. Ранее мы разворачивали кошелек с помощью приложения кошелька, но теперь сделаем это вручную.

В этом разделе мы рассмотрим, как создать кошелек (V3) с нуля. Вы узнаете, как скомпилировать код смарт-контракта кошелька, сгенерировать мнемоническую фразу, получить адрес кошелька и развернуть кошелек с помощью внешних сообщений и State Init (инициализация состояния).

### Создание мнемоники

Первое, что необходимо для корректного создания кошелька – это получение `приватного` и `публичного` ключей. Чтобы выполнить эту задачу, необходимо сгенерировать мнемоническую seed-фразу, а затем извлечь приватный и публичный ключи с помощью криптографических библиотек.

Это делается следующим образом:

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

Приватный ключ необходим для подписания сообщений, а публичный ключ хранится в смарт-контракте кошелька.

:::danger ВАЖНО
Необходимо вывести сгенерированную мнемоническую seed-фразу в консоль, сохранить и использовать одну и ту же пару ключей при каждом запуске кода кошелька (как использовать подробно описано в предыдущем разделе).
:::

### Идентификаторы subwallet

Одно из наиболее заметных преимуществ того, что кошельки являются смарт-контрактами – это возможность создавать **огромное количество кошельков**, используя всего один приватный ключ. Это происходит потому, что адреса смарт-контрактов в блокчейне TON вычисляются с помощью нескольких факторов, включая `stateInit`. StateInit содержит `code` и `initial data` (первичные данные), которые хранятся в хранилище смарт-контрактов блокчейна.

Изменив всего один бит в `stateInit`, можно сгенерировать другой адрес. Именно поэтому изначально был создан `subwallet_id`. `subwallet_id` хранится в хранилище контрактов и может быть использован для создания множества различных кошельков (с различными идентификаторами subwallet) с помощью одного приватного ключа. Эта функциональность может быть очень полезна при интеграции различных типов кошельков с централизованными сервисами, такими как биржи.

Значение `subwallet_id` по умолчанию равно `698983191`, согласно [строке кода](https://github.com/ton-blockchain/ton/blob/4b940f8bad9c2d3bf44f196f6995963c7cee9cc3/tonlib/tonlib/TonlibClient.cpp#L2420) ниже, взятой из исходного кода TON Blockchain:

```cpp
res.wallet_id = td::as<td::uint32>(res.config.zero_state_id.root_hash.as_slice().data());
```

Информацию о блоке genesis (`zero_state`) можно получить из [файла конфигурации](https://ton.org/global-config.json). Разбираться детально в этом не обязательно, но важно помнить, что по умолчанию значение `subwallet_id` равно `698983191`.

Контракт каждого кошелька проверяет поле `subwallet_id` для внешних сообщений, чтобы избежать случаев, когда запросы были отправлены на кошелек с другим идентификатором:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(34, subwallet_id == stored_subwallet);
```

Нужно будет добавить вышеуказанное значение в `initial data` (первичные данные) контракта, поэтому переменную нужно сохранить следующим образом:

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

### Компиляция кода кошелька

Теперь, когда у нас четко определены приватный и публичный ключи, а также subwallet_id, нужно скомпилировать код кошелька. Для этого воспользуемся кодом [wallet V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) из официального репозитория.

Чтобы скомпилировать код кошелька необходимо использовать библиотеку [@ton-community/func-js](https://github.com/ton-community/func-js).
С помощью этой библиотеки можно скомпилировать код FunC и получить ячейку, содержащую этот код. Чтобы начать работу, необходимо установить библиотеку и сохранить ее в `package.json` следующим образом:

```bash
npm i --save @ton-community/func-js
```

Для компиляции кода мы будем использовать только JavaScript, поскольку библиотеки для компиляции кода основаны на JavaScript.
Однако после завершения компиляции, пока у нас есть **base64-вывод** нашей ячейки, можно использовать этот скомпилированный код в таких языках, как Go и других.

Для начала нам нужно создать два файла: `wallet_v3.fc` и `stdlib.fc`. Компилятор работает с библиотекой `stdlib.fc`. Все необходимые и базовые функции, которые соответствуют инструкциям `asm`, есть в этой библиотеке. Файл `stdlib.fc` можно скачать [здесь](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc). В файл `wallet_v3.fc` необходимо скопировать приведенный выше код.

Теперь у нас есть следующая структура для создаваемого проекта:

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
Ничего страшного, если IDE-плагин конфликтует с `() set_seed(int) impure asm "SETRAND";` в файле `stdlib.fc`.
:::

Не забудьте добавить следующую строку в начало файла `wallet_v3.fc`, чтобы указать, что ниже будут использоваться функции из `stdlib`:

```func
#include "stdlib.fc";
```

Теперь давайте напишем код для компиляции смарт-контракта и запустим его с помощью команды `npm run start:dev`:

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

В результате в терминале появится следующий вывод:

```text
Code BOC: te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==

Hash: idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

После этого можно получить ту же самую ячейку (используя вывод в кодировке base64) с помощью кода кошелька, используя другие библиотеки и языки:

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

В результате в терминале появится следующий вывод:

```text
idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

После завершения этих процессов подтверждается, что в нашей ячейке используется корректный код, поскольку хэши совпадают.

### Создание State Init для развертывания

Прежде чем создавать сообщение, важно понять, что такое State Init. Для начала пройдемся по [схеме TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143):

|             Параметр             |                                                                                                                                                                                                                                                               Описание                                                                                                                                                                                                                                                              |
| :------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| split_depth | Этот параметр предназначен для высоконагруженных смарт-контрактов, которые могут быть разделены и располагаться на нескольких [шардчейнах](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#множество-accountchains-шарды).  Более подробную информацию можно найти в [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6).  Хранится только бит `0`, поскольку он используется в рамках смарт-контракта кошелька |
|              special             |       Используется для TicTok. Эти смарт-контракты автоматически вызываются для каждого блока и не требуются для обычных смарт-контрактов. Информацию об этом можно найти в [этом разделе](/v3/documentation/data-formats/tlb/transaction-layout#tick-tock) или в [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6). В данной спецификации хранится только бит `0`, поскольку такая функция нам не требуется      |
|               code               |                                                                                                                                                                                                                                   Бит `1` означает наличие кода смарт-контракта в качестве ссылки                                                                                                                                                                                                                                   |
|               data               |                                                                                                                                                                                                                                  Бит `1` означает наличие данных смарт-контракта в качестве ссылки                                                                                                                                                                                                                                  |
|              library             |                                Библиотека, которая работает с [мастерчейном](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#мастерчейн-блокчейн-блокчейнов) и может быть использована различными смарт-контрактами. Она не будет использоваться для кошелька, поэтому бит установлен в `0`. Информацию об этом можно найти в [tblkch.pdf](https://ton.org/tblkch.pdf) (1.8.4)                               |

Далее подготовим `initial data` (первичные данные), которые будут представлены в хранилище нашего контракта сразу после развертывания:

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

На этом этапе присутствует как `code` контракта, так и `initial data`. С помощью этих данных мы можем создать наш **адрес кошелька**. Адрес кошелька зависит от `State Init`, которое включает в себя код и первичные данные.

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

Используя `State Init`, мы можем создать сообщение и отправить его в блокчейн.

:::warning
To carry out this process, **a minimum wallet balance of 0.1 TON** is required (the balance can be less, but this amount is guaranteed to be sufficient). To accomplish this, we’ll need to run the code mentioned earlier in the tutorial, obtain the correct wallet address, and send 0.1 TON to this address. Alternatively, you can send this sum manually via your wallet app before sending the deployment message itself.

Развертывание с помощью внешних сообщений представлено здесь в основном в образовательных целях, на практике гораздо удобнее [разворачивать смарт-контракты через кошельки](#развертывание-контракта-через-кошелек), что будет описано позже.
:::

Давайте начнем с создания сообщения, аналогичного тому, которое мы создали **в предыдущем разделе**:

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

После этого вы получите корректный `State Init` и `Message Body`.

### Отправка внешнего сообщения

**Основное отличие** будет заключаться в наличии внешнего сообщения, поскольку State Init хранится для того, чтобы помочь выполнить корректное развертывание контракта. Поскольку у контракта еще нет собственного кода, он не может обрабатывать никакие внутренние сообщения. Поэтому мы отправим его код и первичные данные **после того, как контракт будет успешно развернут, чтобы он смог обработать наше сообщение** с комментарием "Hello, TON!":

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

Наконец-то, мы можем отправить сообщение в блокчейн, чтобы развернуть кошелек и использовать его.

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

Обратите внимание, что мы отправили внутреннее сообщение, используя режим `3`. Если необходимо повторить развертывание одного и того же кошелька, **смарт-контракт можно уничтожить**. Для этого установите нужный режим, добавив 128 (забрать весь баланс смарт-контракта) + 32 (уничтожить смарт-контракт), что составит = `160` для извлечения оставшегося баланса TON и повторного развертывания кошелька.

Важно отметить, что для каждой новой транзакции **seqno нужно будет увеличить на единицу**.

:::info
Код контракта, который мы использовали – [верифицирован](https://tonscan.org/tx/BL9T1i5DjX1JRLUn4z9JOgOWRKWQ80pSNevis26hGvc=), пример можно посмотреть [здесь](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX#source).
:::

## 💸 Работа со смарт-контрактами кошелька

Теперь мы гораздо лучше знакомы со смарт-контрактами кошелька, с тем как они разрабатываются и используются. Мы научились разворачивать и уничтожать смарт-контракты, а также отправлять сообщения без использования предварительно настроенных библиотечных функций. В следующем разделе мы сосредоточимся на создании и отправке более сложных сообщений, чтобы применить то, что мы узнали выше.

### Отправка нескольких сообщений одновременно

Как вы, возможно, уже знаете, [одна ячейка может хранить до 1023 бит данных и до 4 ссылок](/v3/documentation/data-formats/tlb/cell-boc#cell) на другие ячейки. Ранее мы подробно описали, как внутренние сообщения извлекаются в "полном" цикле в виде ссылки, после чего отправляются в виде сообщения. Это означает, что внутри внешнего сообщения можно **хранить до 4 внутренних сообщений**. Это позволяет отправлять четыре сообщения одновременно.

Для этого необходимо создать 4 разных внутренних сообщения. Мы можем сделать это вручную или с помощью цикла – `loop`. Сначала нужно определить 3 массива: массив количества TON, массив комментариев, массив сообщений. Для сообщений нужно подготовить еще один массив – internalMessages.

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

[Режим отправки](/v3/documentation/smart-contracts/message-management/sending-messages#режимы-сообщений) для всех сообщений установлен на `mode 3`.  Однако, если требуются разные режимы, можно создать массив для выполнения различных целей.

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

Теперь давайте воспользуемся знаниями из [предыдущего раздела](#-развертывание-кошелька), чтобы создать сообщение для кошелька, которое может отправлять 4 сообщения одновременно:

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

Далее добавим сообщения, которые мы создали ранее в цикле:

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

Теперь, когда все вышеперечисленные процессы завершены, давайте **подпишем** наше сообщение, **создадим внешнее сообщение** (как описано в предыдущих разделах этого руководства) и **отправим его** в блокчейн:

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

:::info Ошибка соединения
Если возникает ошибка, связанная с подключением к lite-серверу (Golang), код должен выполняться до тех пор, пока сообщение не будет отправлено. Это происходит потому, что библиотека tonutils-go использует несколько различных lite-серверов через глобальную конфигурацию, которая была указана в коде. Однако не все lite-серверы могут принять наше соединение.
:::

После завершения данного процесса можно воспользоваться обозревателем блокчейна TON, чтобы убедиться, что кошелек отправил четыре сообщения на указанные ранее адреса.

### Передача NFT

Помимо обычных сообщений, пользователи часто отправляют друг другу NFT. К сожалению, не все библиотеки содержат методы, адаптированные для работы с этим типом смарт-контрактов. Поэтому необходимо создать код, который позволит нам выстроить сообщение для отправки NFT. Для начала давайте познакомимся с [NFT-стандартом](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) TON.

Давайте детально рассмотрим схему TL-B для [NFT Transfers](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer):

- `query_id` – Идентификатор запроса не имеет никакого значения с точки зрения обработки сообщения. Контракт NFT не подтверждает его, а только считывает. Значение идентификатора может быть полезно, когда сервис хочет присвоить каждому своему сообщению определённый ID запроса для идентификации. Поэтому мы установим его в 0.

- `response_destination` – После обработки сообщения о смене владельца появятся дополнительные TON. Они будут отправлены по этому адресу, если он указан, в противном случае останутся на балансе NFT.

- `custom_payload` – Необходимо для выполнения специфических задач и не используется с обычными NFT.

- `forward_amount` – Если значение forward_amount не равно нулю, указанное количество TON будет отправлено новому владельцу. Таким образом, новый владелец будет уведомлен о том, что он что-то получил.

- `forward_payload` – Дополнительные данные, которые могут быть отправлены новому владельцу вместе с `forward_amount`. Например, использование `forward_payload` позволяет пользователям [добавить комментарий во время передачи NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#forward_payload-format), как было отмечено в руководстве ранее. Однако, несмотря на то, что `forward_payload` написан в рамках стандарта TON для NFT, блокчейн-обозреватели не полностью поддерживают отображение различных деталей. Такая же проблема существует и при отображении жетонов.

Теперь давайте создадим само сообщение:

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

Опкод передачи NFT взят из [того же самого стандарта](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema).
Теперь давайте завершим сообщение, как было изложено в предыдущих разделах этого руководства. Корректный код, необходимый для завершения сообщения, находится в [репозитории GitHub](/v3/guidelines/smart-contracts/howto/wallet#-исходный-код).

Такую же процедуру можно выполнить и с жетонами. Подробнее читайте в TL-B-стандарте о переводе жетонов [jetton-standart](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md). На данный момент существует небольшая разница между передачей NFT и жетонов.

### GET-методы кошелька V3 и V4

Смарт-контракты часто используют [GET-методы](/v3/guidelines/smart-contracts/get-methods), однако они работают на стороне клиента, а не внутри блокчейна. GET-методы имеют множество применений и обеспечивают смарт-контрактам доступ к различным типам данных. Например, метод [get_nft_data() в смарт-контрактах NFT](https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/nft/nft-item.fc#L142-L145) позволяет пользователям получать информацию о владельце, коллекции NFT, содержимом `content`.

Ниже мы познакомимся с основными GET-методами, используемыми в [V3](https://github.com/ton-blockchain/ton/blob/e37583e5e6e8cd0aebf5142ef7d8db282f10692b/crypto/smartcont/wallet3-code.fc#L31-L41) и [V4](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L164-L198). Начнем с методов, которые одинаковы для обеих версий кошелька:

|                                       Метод                                       |                                                                                                                                                                      Описание                                                                                                                                                                      |
| :-------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                           int seqno()                          |                                                                             Необходим для получения текущего seqno и отправки сообщений с корректным значением. Этот метод вызывался довольно часто в предыдущих разделах руководства.                                                                             |
| int get_public_key() | Используется для получения публичного ключа. Метод get_public_key() не имеет широкого применения и может использоваться различными сервисами. Например, некоторые API-сервисы позволяют получить множество кошельков с одним и тем же открытым ключом |

Теперь давайте перейдем к методам, которые использует только кошелек V4:

|                                                               Метод                                                              |                                                                                                                                    Описание                                                                                                                                   |
| :------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                        int get_subwallet_id()                       |                                                                     Этот метод мы уже рассматривали ранее в руководстве, он позволяет получить subwallet_id – идентификатор subwallet                                                                    |
| int is_plugin_installed(int wc, int addr_hash) | Нужен для передачи в блокчейн данных об установке плагина. Для вызова этого метода необходимо передать [воркчейн](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#воркчейн-блокчейн-с-вашими-собственными-правилами) и хэш адреса плагина |
|                       tuple get_plugin_list()                       |                                                                                                                    Возвращает адрес установленных плагинов                                                                                                                    |

Давайте рассмотрим методы `get_public_key` и `is_plugin_installed`. Эти два метода были выбраны потому, что сначала нужно извлечь публичный ключ из данных длиной 256 бит, а затем научиться передавать *slice* – срез полученных данных, а также различные типы данных в GET-методы. Это очень удобно и должно помочь в правильном использовании данных методов.

Сначала нам нужен клиент, способный отправлять запросы. Поэтому в качестве примера мы будем использовать адрес конкретного кошелька ([EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF)):

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

Теперь нам нужно вызвать GET-метода кошелька.

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

Успешным завершением вызова будет очень большое 256-битное число, которое необходимо перевести в строку шестнадцатеричного формата. Результирующая строка для адреса кошелька, который мы указали выше, выглядит следующим образом: `430db39b13cf3cb76bfa818b6b13417b82be2c6c389170fbe06795c71996b1f8`.
Далее используем [TonAPI](https://docs.tonconsole.com/tonapi/rest-api) (метод /v1/wallet/findByPubkey), вводя полученную шестнадцатеричную строку в систему, и сразу становится ясно, что первый элемент массива в ответе будет идентифицировать наш кошелек.

Затем переходим к методу `is_plugin_installed`. В качестве примера мы будем снова использовать кошелек, который использовали ранее ([EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k](https://tonscan.org/address/EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k)) и плагин ([EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ](https://tonscan.org/address/EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ)):

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

Теперь нужно получить хэш-адрес плагина, чтобы перевести его в число и отправить в GET-метод.

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

Ответ должен быть `-1`, что будет означать, что результат истина. При необходимости можно также передать только срез и ячейку. Для этого достаточно создать `Slice` или `Cell` и передать их вместо использования BigInt, указав соответствующий тип.

### Развертывание контракта через кошелек

В предыдущей главе мы развернули кошелек: для этого мы отправили несколько TON, а затем сообщение из кошелька – для развертывания смарт-контракта. Однако этот процесс не очень широко используется с внешними сообщениями и часто применяется только для кошельков. При разработке контрактов процесс развертывания инициализируется путем отправки внутренних сообщений.

Для этого мы воспользуемся смарт-контрактом кошелька V3R2, который использовался в [предыдущей главе](/v3/guidelines/smart-contracts/howto/wallet#компиляция-кода-кошелька).
В этом случае для `subwallet_id` нужно установить значение `3` или любое другое число, необходимое для получения другого адреса при использовании того же приватного ключа (его можно менять):

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

Далее мы получим адрес из нашего контракта и создадим InternalMessage. Также добавим комментарий "Deploying..." к нашему сообщению.

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
  MustStoreRef(stateInit).           // Store State Init as a referen

[Content truncated due to size limit]


================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/overview.mdx
================================================
import Button from '@site/src/components/button'

# Общие сведения

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Эта статья нуждается в обновлении. Пожалуйста, помогите нам улучшить ее.
:::

**Эта страница содержит рекомендации, которые помогут обезопасить Ваш смарт-контракт.**

Если Вы создаете смарт-контракт, то здесь Вы можете увидеть несколько примеров того, какие ошибки могут привести Вас к потере средств:

- [TON Hack Challenge #1](https://github.com/ton-blockchain/hack-challenge-1)
  - [Выводы по результатам TON Hack Challenge](/v3/guidelines/smart-contracts/security/ton-hack-challenge-1)

## Курс TON: Безопасность

:::tip
Прежде чем погружаться в изучение безопасности на уровне разработчика, убедитесь, что Вы хорошо разбираетесь в этой теме на уровне пользователя. Для этого рекомендуется пройти курс [Основы блокчейна с TON](https://stepik.org/course/201294/promo) ([RU версия](https://stepik.org/course/202221/), [CHN версия](https://stepik.org/course/200976/)), где в модуле 5 рассматриваются основы безопасности для пользователей.
:::

Курс [TON Blockchain Course](https://stepik.org/course/176754/) - это полное руководство по разработке TON Blockchain.

Модуль 8 полностью охватывает безопасность смарт-контрактов на TON Blockchain.

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Ознакомиться с курсом TON Blockchain

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
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random-number-generation.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random-number-generation.md
================================================
# Генерация случайных чисел

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Генерация случайных чисел - распространенная задача, которая может понадобиться Вам в самых разных проектах. Возможно, Вы уже встречали функцию `random()` в документации FunC, но обратите внимание на то, что ее результат можно легко предсказать, если не использовать некоторые дополнительные приемы.

## Как кто-то может предсказать случайное число?

Компьютеры ужасны в генерировании случайной информации, поскольку все, что они делают, - это следуют инструкциям пользователей. Однако, поскольку людям часто нужны случайные числа, они придумали различные методы генерации *псевдослучайных* чисел.

Эти алгоритмы обычно требуют от Вас указать значение *seed'a*, которое будет использовано для генерации последовательности *псевдослучайных* чисел. Таким образом, если Вы запустите одну и ту же программу с одним и тем же *seed* несколько раз, Вы неизменно получите один и тот же результат. В TON *seed* для каждого блока разное.

- [Генерация случайного seed блока](/v3/guidelines/smart-contracts/security/random)

Поэтому, чтобы предсказать результат работы функции `random()` в смарт-контракте, Вам просто нужно знать текущий `seed` блока, что невозможно, если Вы не являетесь валидатором.

## Просто используйте `randomize_lt()`.

Чтобы сделать генерацию случайных чисел непредсказуемой, Вы можете добавить текущее [Логическое время](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time) к seed'y, чтобы разные транзакции имели разные seed'ы и результаты.

Просто добавьте вызов `randomize_lt()` перед генерацией случайных чисел, и Ваши случайные числа станут непредсказуемыми:

```func
randomize_lt();
int x = random(); ;; users can't predict this number
```

Однако следует учитывать, что валидаторы или коллаторы все равно могут повлиять на результат случайного числа, поскольку они определяют seed текущего блока.

## Существует ли способ защиты от манипуляций со стороны валидаторов?

Чтобы предотвратить (или хотя бы усложнить) подмену seed'a валидаторами, Вы можете использовать более сложные подходы. Например, Вы можете пропустить один блок перед генерацией случайного числа. Если пропустить один блок, seed будет меняться менее предсказуемым образом.

Пропуск блоков это не сложно. Вы можете сделать это, просто отправив сообщение в Мастерчейн и обратно в воркчейн Вашего контракта. Давайте рассмотрим простой пример!

:::caution
Не используйте этот пример контракта в реальных проектах, вместо этого напишите свой собственный.
:::

### Основной контракт в любом воркчейне

Давайте в качестве примера напишем простой лотерейный контракт. Пользователь отправит на него 1 TON и с вероятностью 50% получит 2 TON обратно.

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

Разверните этот контракт в любой нужный Вам воркчейн (возможно, Basechain), и готово!

## Является ли этот метод на 100% безопасным?

Хотя это, безусловно, помогает, все равно остается вероятность манипуляций, если злоумышленник контролирует несколько валидаторов одновременно. В этом случае они могут, с некоторой вероятностью, [повлиять](/v3/guidelines/smart-contracts/security/random#conclusion) на *seed*, от которого зависит случайное число. Даже если эта вероятность крайне мала, ее все равно стоит учитывать.

В последнем обновлении TVM введение новых значений в регистр `c7` может еще больше повысить безопасность генерации случайных чисел. В частности, обновление добавляет в регистр `c7` информацию о последних 16 блоках мастерчейна.

Информация блока мастерчейна, благодаря своей постоянно меняющейся природе, может служить дополнительным источником энтропии для генерации случайных чисел. Включив эти данные в свой алгоритм случайности, Вы сможете создавать числа, которые будет еще сложнее предсказать потенциальным злоумышленникам.

Более подробную информацию об этом обновлении TVM смотрите в разделе [Обновление TVM](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/random.md
================================================
# Генерация случайного начального значения блока

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution
Эта информация актуальна на момент написания статьи. Она может измениться при любом обновлении сети.
:::

Время от времени на TON создается лотерейный контракт. Обычно в нем используется небезопасный способ обработки случайности, так что сгенерированные значения могут быть предсказаны пользователем, и лотерея может быть сведена на нет.

Но эксплуатация слабых мест в генерации случайных чисел часто предполагает использование прокси-контракта, который пересылает сообщение, если случайное значение верно. Существуют предложения по контрактам кошельков, которые смогут выполнять произвольный код (указанный и подписанный пользователем, разумеется) onchain, но большинство популярных версий кошельков не поддерживают такую возможность. Так что, если лотерея проверяет участие игрока через контракт кошелька, является ли это безопасным?

Или этот вопрос можно сформулировать следующим образом. Можно ли включить внешнее сообщение в блок, в котором случайное значение будет точно таким, как нужно отправителю?

Конечно, отправитель никак не влияет на случайность. Но валидаторы, генерирующие блоки и включающие предложенные внешние сообщения, влияют.

## Как валидаторы влияют на начальное значение

Об этом не так много информации даже в whitepapers, поэтому большинство разработчиков оказываются в затруднении. Вот единственное упоминание о случайности блока в [TON Whitepaper](https://docs.ton.org/ton.pdf):

> Алгоритм, используемый для выбора групп задач валидаторов для каждого шарда (w, s), является детерминированным псевдослучайным. **Он использует псевдослучайные числа, внедренные валидаторами в каждый блок мастерчейна (сгенерированные в результате консенсуса с использованием пороговых подписей), для создания случайного начального значения**, а затем вычисляет, например, Hash(code(w). code(s).validator_id.rand_seed) для каждого валидатора.

Однако единственная вещь, которая гарантированно правдива и актуальна, - это код. Итак, давайте посмотрим на [collator.cpp](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/validator/impl/collator.cpp#L1590):

```cpp
  {
    // generate rand seed
    prng::rand_gen().strong_rand_bytes(rand_seed->data(), 32);
    LOG(DEBUG) << "block random seed set to " << rand_seed->to_hex();
  }
```

Это код, который генерирует случайное начальное значение для блока. Он находится в коде коллатора, потому что он необходим стороне, генерирующей блоки (и не требуется для lite-валидаторов).

Итак, как мы видим, начальные значения генерируются блоком с помощью одного валидатора или коллатора. Следующий вопрос:

## Можно ли принять решение о включении внешнего сообщения после того, как начальные значения будут известны?

Да, можно. Доказательство заключается в следующем: если внешнее сообщение импортировано, его выполнение должно быть успешным. Выполнение может зависеть от случайных значений, поэтому начальное значение блока гарантированно известно заранее.

Таким образом, существует \*\*способ взломать "небезопасный" (назовем его single-block, поскольку он не использует никакой информации из блоков после отправки сообщения) рандом, если отправитель может сотрудничать с валидатором. Даже если используется `randomize_lt()`. Валидатор может либо сгенерировать начальное значение, подходящее отправителю, либо включить в блок предложенное внешнее сообщение, которое будет удовлетворять всем условиям. Валидатор, поступающий таким образом, все равно будет считаться справедливым. В этом и заключается суть децентрализации.

И, чтобы эта статья полностью охватила тему случайности, вот еще один вопрос.

## Как начальные значения блока влияют на случайность в контрактах?

Начальное значение, сгенерированное валидатором, не используется напрямую во всех контрактах. Вместо этого оно [хешируется с адресом аккаунта](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/crypto/block/transaction.cpp#L876).

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

Затем генерируются псевдослучайные числа с помощью процедуры, описанной на странице [Инструкции TVM](/v3/documentation/tvm/instructions#F810):

> **x\{F810} RANDU256**\
> Генерирует новое псевдослучайное беззнаковое 256-битное целое число x. Алгоритм следующий: если r - старое случайное начальное значение, рассматриваемое как 32-байтовый массив (путем построения big-endian представления беззнакового 256-битного целого числа), то вычисляется его sha512(r); первые 32 байта этого хеша хранятся как новое r' случайного начального значения, а оставшиеся 32 байта возвращаются как следующее случайное значение x.

Мы можем подтвердить это, заглянув в код [подготовки контракта c7](https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.cpp#L903) (c7 - это кортеж для временных данных, в котором хранится адрес контракта, стартовый баланс, случайное начальное значение и т.д.) и [генерации самих случайных значений](https://github.com/ton-blockchain/ton/blob/master/crypto/vm/tonops.cpp#L217-L268).

## Заключение

Ни одна случайность в TON не является полностью безопасной с точки зрения непредсказуемости. Это означает, что **не может существовать идеальной лотереи**, и нельзя считать, что любая лотерея будет честной.

Обычное использование PRNG (генератор псевдослучайных чисел) может включать `randomize_lt()`, но такой контракт можно обмануть, выбрав правильные блоки для отправки ему сообщений. Предлагаемое решение - отправлять сообщения в другой воркчейн, получать ответ, пропуская блоки, и т.д... но это только снижает степень уязвимости. На самом деле, любой валидатор (то есть 1/250 блокчейна TON) может выбрать правильное время для отправки запроса лотерейному контракту так, чтобы ответ от другого воркчейна пришел в сгенерированном им блоке, после чего он волен выбрать любое начальное значение блока по своему усмотрению. Опасность возрастет, как только коллаторы появятся в mainnet, так как они никогда не смогут быть оштрафованы по стандартным жалобам, потому что они не вкладывают никаких средств в контракт Elector.

<!-- TODO: find an example contract using random without any additions, show how to find result of RANDU256 knowing block random seed (implies link on dton.io to show generated value) -->

<!-- TODO: next article. "Let's proceed to writing tool that will exploit this. It will be attached to validator and put proposed external messages in blocks satisfying some conditions - provided some fee is paid." -->



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/secure-programming.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/secure-programming.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Программирование безопасных смарт-контрактов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом разделе мы рассмотрим несколько наиболее интересных особенностей блокчейна TON, а затем пройдемся по списку лучших практик для разработчиков, программирующих смарт-контракты на FunC.

## Разделение контрактов

При разработке контрактов для EVM вы обычно разбиваете проект на несколько контрактов для удобства. В некоторых случаях можно реализовать всю функциональность в одном контракте, и даже там, где разделение контрактов было необходимо (например, пары ликвидности в Automated Market Maker), это не привело к каким-либо особым трудностям. Транзакции выполняются в полном объеме: либо всё работает, либо всё возвращается.

В TON настоятельно рекомендуется избегать "неограниченных структур данных" и [разделять один логический контракт на небольшие части](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons), каждая из которых управляет небольшим объёмом данных. Основным примером является реализация TON Jettons. Это версия TON стандарта токенов ERC-20 от Ethereum. Вкратце, у нас есть:

1. Один `jetton-minter`, который хранит `total_supply`, `minter_address` и пару ссылок: описание токена (метаданные) и `jetton_wallet_code`.
2. И множество jetton-кошельков, по одному на каждого владельца этих жетонов. В каждом таком кошельке хранится только адрес владельца, его баланс, адрес jetton-minter и ссылка на jetton_wallet_code.

Это необходимо для того, чтобы передача жетонов происходила напрямую между кошельками и не затрагивала высоконагруженные адреса, что является основой для параллельной обработки транзакций.

То есть, приготовьтесь к тому, что ваш контракт станет "группой контрактов", и они будут активно взаимодействовать друг с другом.

## Возможно частичное выполнение транзакций

В логике вашего контракта появляется новое уникальное свойство: частичное выполнение транзакций.

Например, рассмотрим поток сообщений стандартного TON Jetton:

![smart1.png](/img/docs/security-measures/secure-programming/smart1.png)

Как следует из диаграммы:

1. отправитель посылает сообщение `op::transfer` на свой кошелек (`sender_wallet`);
2. `sender_wallet` уменьшает баланс токенов;
3. `sender_wallet` отправляет сообщение `op::internal_transfer` на кошелек получателя (`destination_wallet`);
4. `destination_wallet` увеличивает свой баланс токенов;
5. `destination_wallet` отправляет `op::transfer_notification` своему владельцу (`destination`);
6. `destination_wallet` возвращает избыточный газ с сообщением `op::excesses` на `response_destination` (обычно `sender`).

Обратите внимание, если `destination_wallet` не смог обработать сообщение `op::internal_transfer` (произошло исключение или закончился газ), то этот этап и все последующие не будут выполнены. Однако первый шаг (уменьшение баланса в `sender_wallet`) будет выполнен. Результатом будет частичное выполнение транзакции, что приводит к некорректному состоянию `Jetton` и, в данном случае, потеря средств.

В худшем случае все токены могут быть украдены таким образом. Представьте, что вы сначала начисляете бонусы пользователю, а затем отправляете сообщение `op::burn` на его кошелёк Jetton, но не можете гарантировать, что сообщение `op::burn` будет успешно обработано.

## Разработчик смарт-контрактов TON должен контролировать газ

В Solidity газ не представляет особой проблемы для разработчиков контрактов. Если пользователь предоставит слишком мало газа, все будет отменено, как будто ничего не произошло (но газ не будет возвращён). Если же пользователь предоставит достаточно, то фактические расходы будут автоматически рассчитаны и вычтены из его баланса.

В TON ситуация иная:

1. Если газа недостаточно, транзакция будет выполнена частично;
2. Если газа слишком много, его излишки должны быть возвращены. Это входит в обязанности разработчика;
3. Если "группа контрактов" обменивается сообщениями, то контроль и расчёты должны производиться в каждом сообщении.

TON не может автоматически рассчитать газ. Полное выполнение транзакции со всеми последствиями может занять много времени, и к моменту завершения у пользователя может не оказаться достаточного количества тонкоинов на кошельке. Здесь снова используется принцип переноса значения (carry-value principle).

## Разработчик смарт-контрактов TON должен управлять хранилищем

Типичный обработчик сообщений в TON следует этому подходу:

```func
() handle_something(...) impure {
    (int total_supply, <a lot of vars>) = load_data();
    ... ;; do something, change data
    save_data(total_supply, <a lot of vars>);
}
```

К сожалению, мы замечаем тенденцию: `<a lot of vars>` - это настоящее перечисление всех полей данных контракта. Например:

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

Этот подход имеет ряд недостатков.

Во-первых, если вы решите добавить ещё одно поле, скажем, `is_paused`, вам нужно обновить все выражения `load_data()/save_data()` в контракте. Это не только трудоёмко, но и приводит к трудноуловимым ошибкам.

Во время недавнего аудита CertiK мы заметили, что разработчик перепутал два аргумента местами и написал:

```func
save_data(total_supply, min_amount, swap_fee, ...)
```

Без внешнего аудита, проведённого командой экспертов, обнаружить такую ошибку очень сложно. Функция использовалась редко, и оба перепутанных параметра обычно имели нулевое значение. Чтобы заметить подобную ошибку, нужно знать, что искать.

Во-вторых, существует проблема "загрязнения пространства имён". Давайте разберёмся, в чем она заключается, на другом примере из аудита. В середине функции входной параметр читается:

```func
int min_amount = in_msg_body~load_coins();
```

То есть произошло затенение поля хранения локальной переменной, и в конце функции это измененнёное значение было записано в хранилище. У злоумышленника была возможность перезаписать состояние контракта. Ситуация усугубляется тем, что FunC допускает [переобъявление переменных](/v3/documentation/smart-contracts/func/docs/statements#variable-declaration): "Это не объявление, а просто проверка во время компиляции, что min_amount имеет тип int".

И, наконец, разбор всего хранилища и его повторная упаковка при каждом вызове любой функции увеличивает стоимость газа.

## Советы

### 1. Всегда рисуйте диаграммы потока сообщений

Даже в таком простом контракте, как TON Jetton, уже есть довольно много сообщений, отправителей, получателей и фрагментов данных, содержащихся в сообщениях. А теперь представьте, как это выглядит, когда Вы разрабатываете что-то более сложное, например, децентрализованную биржу (DEX), где количество сообщений в одном рабочем процессе может превышать десять.

![smart2.png](/img/docs/security-measures/secure-programming/smart2.png)

В CertiK мы используем язык [DOT](https://en.wikipedia.org/wiki/DOT_(graph_description_language)) для описания и обновления таких диаграмм в ходе аудита. Наши аудиторы считают, что это помогает им визуализировать и понимать сложные взаимодействия внутри и между контрактами.

### 2. Избегайте сбоев и обрабатывайте отскочившие сообщения

Используя поток сообщений, сначала определите точку входа. Это сообщение, которое начинает каскад сообщений в вашей группе контрактов ("последствия"). Именно здесь необходимо проверить все (полезную нагрузку, запас газа и т. д.), чтобы свести к минимуму вероятность сбоя на последующих этапах.

Если вы не уверены, что сможете выполнить все свои планы (например, достаточно ли у пользователя токенов для завершения сделки), значит, поток сообщений, скорее всего, построен неправильно.

В последующих сообщениях (последствия) все `throw_if()/throw_unless()` будут выполнять роль утверждений, а не фактической проверки чего-либо.

Многие контракты также обрабатывают отскочившие сообщения на всякий случай.

Например, в TON Jetton, если кошелёк получателя не может принять токены (это зависит от логики получения), то кошелёк отправителя обработает отскочившее сообщение и вернёт токены на свой баланс.

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

В основном, мы рекомендуем обрабатывать отскочившие сообщения, однако их нельзя использовать в качестве средства полной защиты от неудачной обработки сообщений и неполного выполнения.

Для отправки отскочившего сообщения и его обработки требуется газ, и если отправитель не предоставил достаточного количества газа, то отскока не будет.

Во-вторых, в TON не предусмотрена цепочка переходов. Это означает, что отскочившее сообщение не может быть отправлено повторно. Например, если второе сообщение отправляется после входного сообщения, а второе инициирует третье, то входной контракт не будет знать о сбое обработки третьего сообщения. Аналогично, если обработка первого сообщения вызывает второе и третье, то сбой второго не повлияет на обработку третьего.

### 3. Ожидайте "человека посередине" в потоке сообщений

Каскад сообщений может обрабатываться в нескольких блоках. Предположим, что пока выполняется один поток сообщений, злоумышленник может параллельно инициировать второй. То есть, если какое-то условие было проверено в начале (например, достаточно ли у пользователя токенов), не следует предполагать, что на третьем этапе в том же контракте это условие все еще будет выполняться.

### 4. Используйте шаблон переноса значения

Из предыдущего параграфа следует, что сообщения между контрактами должны переносить ценности.

В том же TON Jetton это демонстрируется: `sender_wallet` вычитает баланс и отправляет его с сообщением `op::internal_transfer` на `destination_wallet`, а тот, в свою очередь, получает баланс вместе с сообщением и добавляет его к своему балансу (или возвращает обратно).

А вот пример неправильной реализации. Почему вы не можете узнать свой баланс Jetton on-chain? Потому что такой запрос не соответствует шаблону. К тому времени, когда ответ на сообщение `op::get_balance` дойдет до запрашивающего, этот баланс уже может быть потрачен кем-то другим.

В этом случае вы можете реализовать альтернативу:
![smart3.png](/img/docs/security-measures/secure-programming/smart3.png)

1. master отправляет сообщение `op::provide_balance` на кошелёк;
2. кошелёк обнуляет свой баланс и отправляет обратно `op::take_balance`;
3. master получает средства, решает, достаточно ли их, и либо использует (списывает что-то в ответ), либо отправляет обратно на кошелёк.

### 5. Возвращайте значение вместо отклонения

Из предыдущего наблюдения следует, что ваша группа контрактов часто будет получать не просто запрос, а запрос вместе со значением. Поэтому нельзя просто отказать в выполнении запроса (с помощью `throw_unless()`), нужно отправить жетоны обратно отправителю.

Например, обычное начало потока (см. поток сообщений TON Jetton):

1. `sender` отправляет сообщение `op::transfer` через `sender_wallet` на `your_contract_wallet`, указывая `forward_ton_amount` и `forward_payload` для вашего контракта;
2. `sender_wallet` отправляет сообщение `op::internal_transfer` на `your_contract_wallet`;
3. `your_contract_wallet` отправляет сообщение `op::transfer_notification` на `your_contract`, передавая `forward_ton_amount`, `forward_payload`, а также `sender_address` и `jetton_amount`;
4. И вот в вашем контракте в `handle_transfer_notification()` начинается поток.

Здесь необходимо определить, какой был запрос, достаточно ли газа для его выполнения и все ли корректно в полезной нагрузке. На этом этапе не следует использовать `throw_if()/throw_unless()`, потому что тогда жетоны просто потеряются, а запрос не будет выполнен. Стоит использовать операторы try-catch [доступны начиная с FunC v0.4.0] (/v3/documentation/smart-contracts/func/docs/statements#try-catch-statements).

Если что-то не соответствует ожиданиям вашего контракта, жетоны должны быть возвращены.

Мы обнаружили пример такой уязвимой реализации в ходе недавнего аудита.

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

Как видно, здесь "возврат" отправляется на `jettonA_wallet_address`, а не на `sender_address`. Поскольку все решения принимаются на основе анализа `in_msg_body`, злоумышленник может подделать сообщение и вывести деньги. Всегда отправляйте возврат на `sender_address`.

Если ваш контракт принимает жетоны, невозможно узнать, действительно ли пришел ожидаемый жетон или просто `op::transfer_notification` от кого-то.

Если в ваш контракт попали неожиданные или неизвестные жетоны, их также необходимо вернуть.

### 6. Рассчитайте газ и проверьте значение msg_value

Согласно нашей диаграмме потока сообщений, мы можем оценить стоимость каждого обработчика в каждом из сценариев и вставить проверку на достаточность msg_value.

Вы не можете запрашивать газ с запасом, скажем, 1 TON (это gas_limit в mainnet на дату написания статьи), потому что этот газ должен быть разделен между "последствиями". Допустим, ваш контракт отправляет три сообщения, тогда каждому можно выделить только 0,33 TON. Это означает, что они должны "запрашивать" меньше. Важно тщательно рассчитать потребление газа для всего контракта.

Все усложняется, если во время разработки ваш код начинает отправлять больше сообщений. Требования к газу необходимо перепроверять и обновлять.

### 7. Осторожно возвращайте избыточный газ

Если избыточный газ не возвращаются отправителю, средства со временем накапливаются в ваших контрактах. В принципе, это не критично, но это неоптимальная практика. Вы можете добавить функцию для очистки излишков, но такие популярные контракты, как TON Jetton, все равно возвращаются их отправителю с сообщением `op::excesses`.

В TON есть полезный механизм: `SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64`. При использовании этого режима в `send_raw_message()`, остаток газа будет передан дальше вместе с сообщением (или обратно) новому получателю. Это удобно, если поток сообщений линеен: каждый обработчик сообщений отправляет только одно сообщение. Но есть случаи, когда использовать этот механизм не рекомендуется:

1. Если в вашем контракте нет других нелинейных обработчиков. storage_fee вычитается из баланса контракта, а не из входящего газа. Это означает, что со временем storage_fee может полностью "съесть" баланс, так как все входящие средства должны быть отправлены дальше;
2. Если ваш контракт генерирует события, то есть отправляет сообщение на внешний адрес. Стоимость этого действия вычитается из баланса контракта, а не из msg_value.

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

3. Если ваш контракт присваивает значение при отправке сообщений или использует `SEND_MODE_PAY_FEES_SEPARETELY = 1`. Эти действия вычитают из баланса контракта, что означает, что возврат неиспользованного - это "работа в убыток".

В указанных случаях используется ручной приблизительный расчет излишка:

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

Помните, если баланс контракта закончится, транзакция будет выполнена частично, а этого допустить нельзя.

### 8. Используйте вложенное хранилище

Мы рекомендуем следующий подход к организации хранения:

```func
() handle_something(...) impure {
    (slice swap_data, cell liquidity_data, cell mining_data, cell discovery_data) = load_data();
    (int total_supply, int swap_fee, int min_amount, int is_stopped) = swap_data.parse_swap_data();
    …
    swap_data = pack_swap_data(total_supply + lp_amount, swap_fee, min_amount, is_stopped);
    save_data(swap_data, liquidity_data, mining_data, discovery_data);
}
```

Хранилище состоит из блоков связанных данных. Если параметр используется в каждой функции, например, `is_paused`, то он должен сразу загружаться через функцию `load_data()`. Если группа параметров нужна только в одном сценарии, то ее не нужно распаковывать, она не требует упаковки и не засоряет пространство имен.

Если структура хранилища требует изменений (обычно добавление нового поля), то придётся вносить гораздо меньше правок.

Более того, этот подход можно повторять. Если в контракте 30 полей хранения, то изначально можно разбить их на четыре группы, а затем выделить пару переменных и еще одну подгруппу из первой группы. Главное - не переусердствовать.

Обратите внимание, поскольку ячейка может хранить до 1023 бит данных и до 4 ссылок, вам все равно придётся разделить данные по разным ячейкам.

Иерархические данные - одна из главных особенностей TON, нужно использовать её по назначению.

Глобальные переменные можно использовать, особенно на этапе создания прототипа, когда не совсем очевидно, что будет храниться в контракте.

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

Таким образом, если обнаружите, что вам нужна еще одна переменная, просто добавьте новую глобальную переменную и измените `load_data()` и `save_data()`. Никаких изменений во всем контракте не потребуется. Однако, поскольку существует ограничение на количество глобальных переменных (не более 31), этот подход можно совместить с "вложенным хранилищем", рекомендованным выше.

Глобальные переменные также часто обходятся дороже, чем хранение всего в стеке. Однако это зависит от количества перестановок стека, поэтому хорошей идеей будет создать прототип с глобальными переменными и, когда структура хранения будет полностью ясна, перейти к переменным на стеке с "вложенным" шаблоном.

### 9. Используйте функцию end_parse()

Используйте `end_parse()` везде, где это возможно, при чтении данных из хранилища и из полезной нагрузки сообщения. Поскольку TON использует битовые потоки с переменным форматом данных, важно убедиться, что вы читаете столько же, сколько и записываете. Это может сэкономить вам часы отладки.

### 10. Используйте больше вспомогательных функций и избегайте магических чисел

Этот совет не является уникальным для FunC, но здесь он особенно уместен. Пишите больше обёрток, вспомогательных функций и объявляйте больше констант.

В FunC изначально заложено невероятное количество магических чисел. Если разработчик не приложит никаких усилий, чтобы ограничить их использование, результат будет примерно таким:

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

Это код из реального проекта, и он пугает новичков.

К счастью, в последних версиях FunC пара стандартных деклараций может сделать код более понятным и выразительным. Например:

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

## Ссылки

Автор оригинальной статьи: CertiK

- [Оригинальная статья](https://blog.ton.org/secure-smart-contract-programming-in-func)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/things-to-focus.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/things-to-focus.md
================================================
# На что следует обратить внимание при работе с TON Blockchain

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этой статье мы рассмотрим и обсудим элементы, которые необходимо учитывать тем, кто хочет разрабатывать приложения TON.

## Чек-лист

### 1. Коллизии имен

Переменные и функции Func могут содержать практически любой допустимый символ. Т.е. `var++`, `~bits`, `foo-bar+baz`, включая запятые, являются допустимыми именами переменных и функций.

При написании и проверке кода Func следует использовать Linter.

- [Плагины IDE](/v3/documentation/smart-contracts/getting-started/ide-plugins/)

### 2. Проверьте значения выбросов

Каждый раз, когда выполнение TVM завершается нормально, оно останавливается с кодами выхода `0` или `1`. Хотя это происходит автоматически, выполнение TVM может быть прервано неожиданным образом, если коды выхода `0` и `1` будут выброшены непосредственно командой `throw(0)` или `throw(1)`.

- [Как обрабатывать ошибки](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- [Коды выхода из TVM](/v3/documentation/tvm/tvm-exit-codes)

### 3. Func - строго типизированный язык, в структурах данных которого хранится именно то, что они должны хранить

Очень важно следить за тем, что делает код и что он может вернуть. Помните, что компилятор учитывает только сам код и только в его начальное состояние. После выполнения определенных операций сохраненные значения некоторых переменных могут измениться.

Чтение неожиданных значений переменных и вызов методов для типво данных, которые не должны иметь таких методов (или их возвращаемые значения сохраняются неправильно), являются ошибками и не пропускаются как "предупреждения" или "уведомления", а приводят к недостижимому коду. Помните, что сохранение неожиданного значения может быть допустимым, однако его чтение может вызвать проблемы, например, код ошибки 5 (целое число вне ожидаемого диапазона) может быть выброшен для целочисленной переменной.

### 4. Сообщения имеют режимы

Необходимо проверять режим сообщения, в частности, его взаимодействие с предыдущими отправленными сообщениями и платой за хранение. Возможной проблемой может быть неучет платы за хранение, в этом случае у контракта может закончиться TON, что приведет к неожиданным сбоям при отправке исходящих сообщений. Вы можете просмотреть режимы сообщений [здесь](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 5. TON полностью реализует модель акторов

Это означает, что код контракта может быть изменен. Его можно изменить либо постоянно, используя директиву TVM [`SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code), либо во время выполнения, устанавливая в реестре TVM кода новое значение ячейки до окончания выполнения.

### 6. Блокчейн TON имеет несколько фаз транзакций: фаза вычислений, фаза действий и фаза отскока.

На вычислительной фазе выполняется код смарт-контрактов, и только после этого производятся действия (отправка сообщений, модификация кода, изменение библиотек и другие). Поэтому, в отличие от блокчейнов на базе Ethereum, Вы не увидите код завершеия вычислительной фазы, если ожидаете, что отправленное сообщение завершится неудачно, так как это происходит не в вычислительной фазе, а позже, в фазе выполнения действий.

- [Транзакции и фазы](/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 7. Контракты TON являются автономными

Контракты в блокчейне могут находиться в отдельных шардах, обрабатываемых другим набором валидаторов, а это значит, что разработчик не может получить данные из других контрактов по запросу. Таким образом, любая коммуникация осуществляется асинхронно, путем отправки сообщений.

- [Отправка сообщений из смарт-контракта](/v3/documentation/smart-contracts/message-management/sending-messages)
- [Отправка сообщений из DApp](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 8. В отличие от других блокчейнов, TON не содержит сообщений о возврате, только коды выхода

Прежде чем приступить к программированию смарт-контракта TON, следует продумать дорожную карту кодов выхода для потока кода (и задокументировать ее).

### 9. Функции Func, имеющие идентификаторы method_id, имеют идентификаторы методов

Они могут быть заданы либо явно `"method_id(5)"`, либо неявно компилятором func. В этом случае их можно найти среди объявлений методов в файле ассемблера .fift. Два из них предопределены: один для приема сообщений внутри блокчейна `(0)`, обычно называемый `recv_internal`, и другой для приема сообщений извне `(-1)`, `recv_external`.

### 10. Криптоадрес TON может не содержать ни монет, ни кода

Адреса смарт-контрактов в блокчейне TON детерминированы и могут быть предварительно вычислены. TON-аккаунты, связанные с адресами, могут даже не содержать кода, что означает, что они не инициализированы (если не были развернуты) или заморожены, не имея больше ни хранилища, ни монет TON, если было отправлено сообщение со специальными флагами.

### 11. Адреса TON могут иметь три представления

Адреса TON могут иметь три представления.
Полное представление может быть либо "сырым" (`workchain:address`), либо "user-friendly". С последним чаще всего сталкиваются пользователи. Оно содержит байт метки, указывающий на то, является ли адрес `bounceable ` или `not bounceable`, и байт идентификатора воркчейна. Эту информацию следует учитывать.

- [Сырые и User-Friendly адреса](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 12. Отслеживайте недостатки в выполнении кода

В отличие от Solidity, где видимость методов настраивается вами, в случае с Func видимость ограничивается более сложным способом - либо с помощью отображения ошибок, либо через условия `if`.

### 13. Следите за газом перед отправкой bounced-сообщений

В случае, если смарт-контракт отправляет отскочившие сообщения со значением, указанным пользователем, убедитесь, что соответствующая плата за газ вычтена из возвращенной суммы, чтобы избежать потери средств.

### 14. Отслеживайте обратные вызовы и их сбои

Блокчейн TON является асинхронным. Это означает, что сообщения необязательно должны приходить последовательно. Например, когда приходит уведомление о неудачном выполнении действия, оно должно быть обработано корректно.

### 15. Проверьте, был ли отправлен флаг отскока при получении внутренних сообщений

Вы можете получать отскакивающие сообщения (уведомления об ошибках), которые следует обработать.

- [Обработка стандартных ответных сообщений](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

### 16. Напишите защиту от повторной отправки для внешних сообщений:

Существует два пользовательских решения для кошельков (смарт-контрактов, хранящих деньги пользователей): `seqno-based` (проверка счетчика, чтобы не обрабатывать сообщение дважды) и `high-load` (хранение идентификаторов процессов и сроков их действия).

- [Seqno-based кошельки](/v3/guidelines/dapps/asset-processing/payments-processing/#seqno-based-wallets)
- [High-load кошельки](/v3/guidelines/dapps/asset-processing/payments-processing/#high-load-wallets)

## Ссылки

Автор оригинальной статьи: 0xguard

- [Оригинальная статья](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/ton-hack-challenge-1.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/security/ton-hack-challenge-1.md
================================================
# Подведение итогов TON Hack Challenge

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Hack Challenge был проведен 23 октября.
В TON mainnet было развернуто несколько смарт-контрактов с искусственно созданными уязвимостями. Каждый контракт имел баланс 3000 или 5000 TON, что позволяло участникам взломать его и немедленно получить вознаграждение.

Исходный код и правила контеста были размещены на GitHub [здесь] (https://github.com/ton-blockchain/hack-challenge-1).

## Контракты

### 1. Паевой инвестиционный фонд

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда проверяйте функции на наличие модификатора [`impure`](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier).
:::

Первая задача была очень простой. Злоумышленник мог обнаружить, что функция `authorize` не является `impure `. Отсутствие этого модификатора позволяет компилятору пропускать вызовы этой функции, если она ничего не возвращает или возвращаемое значение не используется.

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. Банк

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда проверяйте наличие [изменяющих/не изменяющих](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) методов.
:::

`udict_delete_get?` вызывался с `.` вместо `~`, поэтому реальный словарь остался нетронутым.

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Используйте знаковые целые числа, если вам это действительно необходимо.
:::

Вес голоса хранился в сообщении как целое число. Злоумышленник мог отправить отрицательное значение при передаче веса голоса и получить бесконечное количество голосов.

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

### 4. Лотерея

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда рандомизируйте начальное значение перед выполнением [`rand()`](/v3/documentation/smart-contracts/func/docs/stdlib#rand)
:::

Начальное значение было получено из логического времени транзакции, и хакер может выиграть, применяя перебор логического времени в текущем блоке (потому что lt последовательно в пределах одного блока).

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

### 5. Кошелек

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Помните, что все хранится в блокчейне.
:::

Кошелек был защищен паролем, его хеш был сохранен в данных контракта. Однако блокчейн помнит все - пароль был в истории транзакций.

### 6. Сейф

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда проверяйте [отскочившие](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) сообщения.
Не забывайте об ошибках, вызванных [стандартными](/v3/documentation/smart-contracts/func/docs/stdlib/) функциями.
Сделайте свои условия максимально строгими.
:::

В сейфе есть следующий код в обработчике сообщений базы данных:

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

В сейфе нет обработчика отскоков или прокси-сообщений в базу данных, если пользователь отправляет "check". В базе данных можно установить `msg_addr_none` как адрес награды, поскольку `load_msg_address` позволяет это сделать. Мы запрашиваем проверку из сейфа, база данных пытается разобрать `msg_addr_none`, используя [`parse_std_addr`](/v3/documentation/smart-contracts/func/docs/stdlib#parse_std_addr), но это не удается. Сообщение отскакивает в сейф из базы данных, а операция не является `op_not_winner`.

### 7. Улучшенный банк

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Никогда не уничтожайте аккаунт ради забавы.
Используйте [`raw_reserve`](/v3/documentation/smart-contracts/func/docs/stdlib#raw_reserve) вместо того, чтобы отправлять деньги самому себе.
Подумайте о возможных условиях гонки.
Будьте осторожны с расходом газа при работе с hashmap.
:::

В контракте были условия гонки: вы могли внести деньги, а затем попытаться вывести их дважды с помощью параллельных сообщений. Нет гарантии, что сообщение с зарезервированными средствами будет обработано, поэтому банк может закрыться после второго вывода. После этого контракт мог быть развернут заново, и любой мог бы вывести невостребованные средства.

### 8. Dehasher

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Избегайте выполнения стороннего кода в Вашем контракте.
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

Не существует способа безопасно выполнить сторонний код в контракте, поскольку исключение [`out of gas`](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes) не может быть обработано `CATCH`. Злоумышленник просто может использовать [`COMMIT`](/v3/documentation/tvm/instructions#F80F) для любого состояния контракта и поднять `out of gas`.

## Заключение

Надеемся, эта статья прояснила некоторые неочевидные правила для разработчиков FunC.

## Ссылки

Автор оригинальной статьи: Dan Volkov

- [dvlkv на GitHub](https://github.com/dvlkv)
- [Оригинальная статья](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/overview.mdx
================================================
# Написание тестов с Blueprint

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Общие сведения

Набор инструментов для тестирования (обычно песочница) уже включен в TypeScript SDK с именем [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript). Вы можете создать демонстрационный проект и запустить тест по умолчанию, выполнив два шага:

1. Создайте новый проект Blueprint:

```bash
npm create ton@latest MyProject
```

2. Запустите тест:

```bash
cd MyProject
npx blueprint test
```

В результате вы увидите соответствующий вывод в окне терминала:

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

## Основное использование

Тестирование смарт-контрактов позволяет обеспечить безопасность, оптимизировать расход газа и исследовать крайние случаи.
Написание тестов в Blueprint (на основе [Sandbox](https://github.com/ton-org/sandbox)) выполняется путем определения произвольных действий с контрактом и сравнения результатов тестирования с ожидаемым результатом, например:

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

### Написание тестов для сложных утверждений

Базовый рабочий процесс создания теста:

1. Создайте определенную обернутую сущность `Contract` с помощью `blockchain.openContract()`.
2. Опишите действия, которые должен выполнять ваш `Contract`, и сохраните результат выполнения в переменной `res`.
3. Проверьте свойства с помощью функции `expect()` и средства сопоставления `toHaveTransaction()`.

Средство сопоставления `toHaveTransaction` ожидает объект с любой комбинацией полей из типа `FlatTransaction`, определенного со следующими свойствами

| Имя     | Тип           | Описание                                                                                                                                                                           |
| ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from    | Address?      | Адрес контракта отправителя сообщения                                                                                                                                              |
| on      | Address       | Адрес контракта получателя сообщения (альтернативное имя свойства `to`).                                                                                                           |
| value   | bigint?       | Количество Toncoin в сообщении в nanoton                                                                                                                                           |
| body    | Cell          | Тело сообщения определено как Cell                                                                                                                                                 |
| op      | number?       | Op code — это номер идентификатора операции (обычно crc32 из TL-B). Ожидается в первых 32 битах тела сообщения.                                                                    |
| success | boolean?      | Пользовательский флаг Sandbox, определяющий конечный статус определенной транзакции. True — если и фаза вычисления, и фаза действия выполнены успешно. В противном случае — False. |

Вы можете опустить поля, которые вас не интересуют, и передать функции, принимающие типы, возвращающие логические значения (`true` означает хорошо), чтобы проверить, например, диапазоны чисел, коды операций сообщения и т. д. Обратите внимание, что если поле является необязательным (например, `from?: Address`), то функция также должна принимать необязательный тип.

:::tip
Вы можете узнать весь список полей сопоставления из [документации Sandbox](https://github.com/ton-org/sandbox#test-a-transaction-with-matcher).
:::

### Специальный набор тестов

#### Extract SendMode

Чтобы получить режим отправки отправленного сообщения, вы можете использовать следующий код:

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

## Руководства

Узнайте больше о тестировании из самых ценных руководств сообщества по TON:

- [Урок 2: Тестирование FunC для смарт-контракта](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/2lesson/secondlesson.md)
- [TON Hello World часть 4: Пошаговое руководство по тестированию вашего первого смарт-контракта](https://helloworld.tonstudio.io/04-testing/)
- [TON Smart Contract Pipeline](https://dev.to/roma_i_m/ton-smart-contract-pipeline-write-simple-contract-and-compile-it-4pnh)
- [[YouTube]Шестой урок FunC & Blueprint. Gas, комиссии, тесты.](https://youtu.be/3XIpKZ6wNcg)

## Примеры

Ознакомьтесь с наборами тестов, используемыми для экосистемных контрактов TON, и учитесь на примерах.

- [тесты песочницы liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/tree/main/tests)
- [governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/config_tests/tests/)
- [JettonWallet.spec.ts](https://github.com/EmelyanenkoK/modern_jetton/blob/master/tests/JettonWallet.spec.ts)
- [governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/elector_tests/tests/complaint-test.fc)
- [MassSender.spec.ts](https://github.com/Gusarich/ton-mass-sender/blob/main/tests/MassSender.spec.ts)
- [Assurer.spec.ts](https://github.com/aSpite/dominant-assurance-contract/blob/main/tests/Assurer.spec.ts)

## См. также

- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/writing-test-examples.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/smart-contracts/testing/writing-test-examples.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Примеры написания тестов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

На этой странице показано, как писать тесты для контрактов FunC, созданных в [Blueprint SDK](https://github.com/ton-org/blueprint) ([Sandbox](https://github.com/ton-org/sandbox)).
Наборы тестов созданы для демо-контракта [fireworks](https://github.com/ton-community/fireworks-func). Fireworks - это смарт-контракт, который изначально запускается через сообщение `set_first`.

После создания нового проекта FunC с помощью `npm create ton@latest`, в директории проекта будет автоматически сгенерирован тестовый файл `tests/contract.spec.ts` для тестирования контракта:

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

Тесты запускаются с помощью следующей команды:

```bash
npx blueprint test
```

Дополнительные опции и vmLogs могут быть указаны с помощью `blockchain.verbosity`:

```typescript
blockchain.verbosity = {
    ...blockchain.verbosity,
    blockchainLogs: true,
    vmLogs: 'vm_logs_full',
    debugLogs: true,
    print: false,
}
```

## Прямые модульные тесты

Fireworks демонстрирует различные операции с отправкой сообщений в блокчейне TON.

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes-dark.svg?raw=true',
    }}
/>
<br></br>
После развертывания с сообщением `set_first` с достаточной суммой TON, он будет автоматически запущен с основными и пригодными для использования комбинациями режимов отправки.

Fireworks переразвернулся, в результате чего будет создано 3 сущности Fireworks, каждая из которых имеет свой ID(держите его в хранилище) и, как следствие, свой адрес смарт-контракта.

Для наглядности определите разные по ID экземпляры Fireworks (разные `state_init`) со следующими именами:

- 1 - Fireworks setter - сущность, которая распределяет различные опкоды запуска. Может быть расширено до четырех различных опкодов.
- 2 - Fireworks launcher-1 - экземпляр Fireworks, который запускает первый fireworks, что означает, что сообщения будут отправляться на launcher.
- 3 - Fireworks launcher-2 - экземпляр Fireworks, который запускает второй fireworks, что означает, что сообщения будут отправляться из launcher.

<details>
    <summary>Развернуть детали транзакций</summary>

index - ID транзакции в массиве `launchResult`.

- `0` - Внешний запрос к казне (Launcher), который привел к исходящему сообщению `op::set_first` с 2.5 до fireworks
- `1` - Транзакция в контракте Fireworks setter вызвана с помощью `op::set_first` и выполнена с двумя исходящими сообщениями для Fireworks Launcher-1 и Fireworks Launcher-2
- `2` - Транзакция в Fireworks launcher 1 вызвана с помощью `op::launch_first`, и выполнена с четырьмя исходящими сообщениями в Launcher.
- `3` - Транзакция в Fireworks launcher 2 вызвана с помощью `op::launch_second` и выполнена с исходящим сообщением для Launcher.
- `4` - Транзакция в Launcher с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 0`.
- `5` - Транзакция в Launcher с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 1`.
- `6` - Транзакция в Launcher с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 2`.
- `7` - Транзакция в Launcher с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 128 + 32`.
- `8` - Транзакция в Launcher с входящим сообщением от Fireworks launcher 2. Это сообщение отправлено с `send mode = 64`.

</details>

Каждый "firework" - исходящее сообщение с уникальным телом сообщения - появляется в транзакциях с ID:3 и ID:4.

Ниже приведен список тестов для каждой транзакции, ожидаемой как успешно выполненная. Транзакция[ID:0] Внешний запрос к казне (Launcher), завершившийся исходящим сообщением `op::set_first` с 2.5 к Fireworks. В случае, если Вы развернете Fireworks на блокчейне, fireworks - это Ваш кошелек.

### Транзакция ID:1 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L75) проверяет, успешно ли установлен firework, отправляя транзакцию со значением 2.5 TON.
Это простейший случай, основная цель здесь - утвердить результат свойства success транзакции в true.

Чтобы отфильтровать определенную транзакцию из массива `launhcResult.transactions`, мы можем использовать наиболее убедительные поля.
С помощью
`from` (адрес отправителя контракта), `to` (адрес получателя контракта), `op` (значение опкода) - мы получим только одну транзакцию для этой комбинации.

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id1.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id1_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция [ID:1] в контракте Fireworks Setter, вызвана через `op::set_first` и выполнена с двумя исходящими сообщениями к Fireworks launcher-1 и Fireworks launcher-2

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

### Транзакция ID:2 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L92) проверяет, успешно ли выполнена транзакция[ID:2].

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id2.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id2_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция в Fireworks launcher 1 вызвана через `op::launch_first`, и выполняется четырьмя исходящими сообщениями в Launcher.

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

В случаях, когда транзакция должна повлиять на состояние контракта, это можно указать с помощью полей `destroyed`, `endStatus`.

Полный список полей, связанных со статусом аккаунта:

- `destroyed` - `true` - если существующий контракт был уничтожен в результате выполнения определенной транзакции. В противном случае - `false`.
- `deploy` - флаг песочницы, указывающий, был ли контракт развернут во время этой транзакции. `true`, если контракт до этой транзакции не был инициализирован, а после этой транзакции стал инициализированным. В противном случае - `false`.
- `oldStatus` - статус аккаунта до выполнения транзакции. Значения: `uninitialized`, `frozen`, `active`, `non-existing`.
- `endStatus` - статус аккаунта после выполнения транзакции. Значения: `uninitialized`, `frozen`, `active`, `non-existing`.

### Транзакция ID:3 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L113) проверяет, успешно ли выполнена транзакция[ID:3].

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id3.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id3_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция [ID:3] осуществляется в Fireworks launcher 1, вызывается через `op::launch_first` и выполняется четырьмя исходящими сообщениями в Launcher.

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

### Транзакция ID:4 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L133) проверяет, успешно ли выполнена транзакция[ID:4].

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id4.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id4_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция [ID:4] осуществляется в Launcher(Deploy Wallet) с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 0` в транзакции[ID:2].

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

### Транзакция ID:5 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L152) проверяет, успешно ли выполнена транзакция[ID:5].

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id5.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id5_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция[ID:5] осуществляется в Launcher с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 1`

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

### Транзакция ID:6 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L170) проверяет, успешно ли выполнена транзакция[ID:6].

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id6.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id6_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция[ID:6] осуществляется в Launcher с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 2`

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

### Транзакция ID:7 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L188) проверяет, успешно ли выполнена транзакция[ID:7].

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id7.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id7_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция[ID:7] осуществляется в Launcher с входящим сообщением от Fireworks launcher 1. Это сообщение отправлено с `send mode = 128 + 32`

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

### Транзакция ID:8 Успешный тест

[Этот тест](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L188) проверяет, успешно ли выполнена транзакция[ID:8].

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/writing-test-examples/test-examples-schemes_id8.svg?raw=true',
        dark: '/img/docs/writing-test-examples/test-examples-schemes_id8_dark.svg?raw=true',
    }}
/>
<br></br>
Транзакция[ID:8] осуществляется в Launcher с входящим сообщением от Fireworks launcher 2. Это сообщение отправлено с `send mode = 64`

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

## Сборы за транзакции при выводе и чтении

Во время тестирования чтение информации о комиссионных может быть полезно для оптимизации контракта. Функция printTransactionFees печатает всю цепочку транзакций в удобном виде."

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

Например, в случае `launchResult` будет выведена следующая таблица:

| (index) | op             | valueIn        | valueOut       | totalFees      | outActions  |
| ------- | -------------- | -------------- | -------------- | -------------- | ----------- |
| 0       | 'N/A'          | 'N/A'          | '2.5 TON'      | '0.010605 TON' | 1           |
| 1       | '0x5720cfeb'   | '2.5 TON'      | '2.185812 TON' | '0.015836 TON' | 2           |
| 2       | '0x6efe144b'   | '1.092906 TON' | '1.081142 TON' | '0.009098 TON' | 4           |
| 3       | '0xa2e2c2dc'   | '1.092906 TON' | '1.088638 TON' | '0.003602 TON' | 1           |
| 4       | '0x0'          | '0.099 TON'    | '0 TON'        | '0.000309 TON' | 0           |
| 5       | '0x0'          | '0.1 TON'      | '0 TON'        | '0.000309 TON' | 0           |
| 6       | '0x0'          | '0.099 TON'    | '0 TON'        | '0.000309 TON' | 0           |
| 7       | '0x0'          | '0.783142 TON' | '0 TON'        | '0.000309 TON' | 0           |
| 8       | '0x0'          | '1.088638 TON' | '0 TON'        | '0.000309 TON' | 0           |

![](/img/docs/writing-test-examples/fireworks_trace_tonviewer.png?=RAW)

index - идентификатор транзакции в массиве `launchResult`.

- `0` - Внешний запрос к казне (Launcher), который привел к сообщению `op::set_first` для Fireworks
- `1` - Транзакция Fireworks, которая привела к 4 сообщениям для Launcher
- `2` - Транзакция на Launched Fireworks - 1 от Launcher, сообщение отправлено с кодом операции `op::launch_first`.
- `2` - Транзакция на Launched Fireworks - 2 от Launcher, сообщение отправлено с кодом операции `op::launch_second`.
- `4` - транзакция на Launcher с входящим сообщением от Launched Fireworks - 1, сообщение отправлено с `send mode = 0`
- `5` - Транзакция на Launcher с входящим сообщением от Launched Fireworks - 1, сообщение отправлено с `send mode = 1`
- `6` - Транзакция на Launcher с входящим сообщением от Launched Fireworks - 1, сообщение отправлено с `send mode = 2`
- `7` - Транзакция на Launcher с входящим сообщением от Launched Fireworks - 1, сообщение отправлено с `send mode = 128 + 32`
- `8` - Транзакция на Launcher с входящим сообщением от Launched Fireworks - 2, сообщение отправлено с `send mode = 64`

## Тесты комиссий за транзакции

Этот тест проверяет, соответствуют ли ожиданиям комиссионные за запуск фейерверка (launching the fireworks). Можно определить свои проверки для различных частей комиссионных сборов.

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

## Тесты пограничных случаев

В этом разделе будут приведены тестовые случаи для [кодов](/v3/documentation/tvm/tvm-exit-codes) выхода TVM, которые могут возникнуть во время обработки транзакции. Эти коды выхода находятся в самом коде блокчейна. При этом необходимо различать код выхода во время [Compute Phase](/v3/documentation/tvm/tvm-overview#compute-phase) и код выхода во время Action Phase.

Во время Compute Phase выполняется логика контракта (его код). В процессе обработки могут быть созданы различные действия. Эти действия будут обработаны в следующей фазе - Action Phase. Если Compute Phase завершилась неудачей, то Action Phase не начинается. Однако если Compute Phase прошла успешно, это не гарантирует, что Action Phase также завершится успешно.

### Compute Phase | код выхода = 0

Этот код выхода означает, что фаза вычислений транзакции была успешно завершена.

### Compute Phase | код выхода = 1

Альтернативный код выхода, обозначающий успех фазы вычислений, - `1`. Чтобы получить этот код выхода, Вам необходимо использовать [RETALT](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L20).

Следует отметить, что этот опкод должен вызываться в главной функции (например, recv_internal). Если Вы вызовете его в другой функции, то выход из этой функции будет `1`, но общий код выхода будет `0`.

### Compute Phase | код выхода = 2

TVM - это [стековая машина](/v3/documentation/tvm/tvm-overview#tvm-is-a-stack-machine). При взаимодействии с различными значениями они появляются в стеке. Если вдруг в стеке нет элементов, но какой-то опкод их требует, то будет выброшена эта ошибка.

Это может произойти при работе с опкодами напрямую, поскольку [stdlib.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) (библиотека для FunC) предполагает, что такой проблемы не возникнет.

### Compute Phase | код выхода = 3

Любой код перед выполнением становится `continuation`. Это специальный тип данных, который содержит фрагмент с кодом, стек, регистры и другие данные, необходимые для выполнения кода. При необходимости его можно запустить позже, передав необходимые параметры для начального состояния стека.

Сначала мы [построим](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L31-L32) continuation. В данном случае это просто пустой continuation, который ничего не делает. Далее, используя опкод `0 SETNUMARGS`, мы указываем, что в начале выполнения в стеке не должно быть никаких значений. Затем, используя опкод `1 -1 SETCONTARGS`, мы вызываем continuation, передавая 1 значение. Поскольку значений не должно было быть, мы получаем ошибку StackOverflow.

### Compute Phase | код выхода = 4

В TVM значение `integer` может находиться в диапазоне -2<sup>256</sup> < x < 2<sup>256</sup>. Если значение при вычислении вышло за пределы этого диапазона, то будет выброшен код выхода 4.

### Compute Phase | код выхода = 5

Если значение `integer` вышло за пределы ожидаемого диапазона, то будет выброшен код выхода 5. Например, если в функции `.store_uint()` было использовано отрицательное значение.

### Compute Phase | код выхода = 6

На более низком уровне вместо привычных имен функций используются опкоды, которые можно увидеть в [этой таблице](/v3/documentation/tvm/instructions) в HEX-формате. В этом примере мы [используем](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L25) `@addop`, который добавляет несуществующий опкод.

Эмулятор, пытаясь обработать этот опкод, не распознает его и выбрасывает код 6.

### Compute Phase | код выхода = 7

Это довольно распространенная ошибка, которая возникает при получении неправильного типа данных. В [примере](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L79-L80) речь идет о случае, когда `tuple` содержал 3 элемента, но при распаковке была попытка получить 4.

Существует множество других случаев, когда возникает эта ошибка. Вот некоторые из них:

- [не null](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L433)
- [не integer](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L441)
- [не cell](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L478)
- [не cell builder](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L500)
- [не cell slice](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L509)
- [не string](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L518)
- [не bytes chunk](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L527)
- [не continuation](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L536)
- [не box](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L545)
- [не tuple](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L554)
- [не atom](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L598)

### Compute Phase | код выхода = 8

Все данные в TON хранятся в ячейках ([cells](/v3/documentation/data-formats/tlb/cell-boc#cell)). Ячейка может хранить 1023 бита данных и 4 ссылки на другие ячейки. Если Вы попытаетесь записать более 1023 бит или более 4 ссылок, будет выброшен код выхода 8.

### Compute Phase | код выхода = 9

Если Вы попытаетесь прочитать из фрагмента (cell slice) больше данных (при чтении данных из ячейки они должны быть преобразованы к типу данных фрагмента), чем он содержит, то будет выброшен код завершения 9. Например, если в cell slice было 10 битов, а прочитано 11, или если не было ссылок на другие ссылки, но была попытка загрузить ссылку.

### Compute Phase | код выхода = 10

Эта ошибка возникает при работе со словарями ([dictionaries](/v3/documentation/smart-contracts/func/docs/stdlib/#dictionaries-primitives)). В качестве примера можно привести случай, когда значение, принадлежащее ключу [хранится в другой ячейке](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L100-L110) в виде ссылки. В этом случае для получения такого значения Вам необходимо использовать функцию `.udict_get_ref()`.

Однако ссылка на другую ячейку [должна быть только 1](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/dict.cpp#L454), а не 2, как в нашем примере:

```
root_cell
├── key
│   ├── value
│   └── value - second reference for one key
└── key
    └── value
```

Поэтому при попытке прочитать значение мы получаем код выхода 10.

**Дополнительно:** Вы также можете хранить значение рядом с ключом в словаре:

```
root_cell
├── key-value
└── key-value
```

**Примечание:** На самом деле, структура словаря (то, как данные располагаются в ячейках) сложнее, чем показано в примерах выше. Поэтому для понимания примера они упрощены.

### Вычислите фазу | код выхода = 11

Эта ошибка возникает, когда происходит что-то неизвестное. Например, при использовании опкода [SENDMSG](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages), если Вы передадите [неправильную](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L116) (например, пустую) ячейку с сообщением, то произойдет такая ошибка.

Также это происходит при попытке вызвать несуществующий метод. Часто разработчики сталкиваются с этим при вызове несуществующего метода GET.

### Compute Phase | код выхода = -14 (13)

Если для обработки Compute Phase не хватает TON, то будет выброшена эта ошибка. В enum классе `Excno`, где указаны коды выхода различных ошибок в Compute Phase, [указано значение 13](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/excno.hpp#L39).

Однако в процессе обработки к этому значению применяется операция [NOT](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1574), которая изменяет это значение на `-14`. Это сделано для того, чтобы этот код выхода нельзя было подделать, например, с помощью функции `throw`, поскольку все такие функции принимают только положительные значения кода выхода.

### Action Phase | код выхода = 32

Action Phase начинается после Compute Phase и обрабатывает действия, которые были записаны в [регистр c5](/v3/documentation/tvm/tvm-initialization#control-register-c5) во время Compute Phase. Если данные в этот регистр записаны неверно, то будет выброшен код выхода 32.

### Action Phase | код выхода = 33

На данный момент в одной транзакции может быть максимум `255` действий. Если это значение превышено, то Action Phase завершится с кодом выхода 33.

### Action Phase | код выхода = 34

Этот код выхода отвечает за большинство ошибок при работе с действиями: недействительное сообщение, неправильное действие и т.д.

### Action Phase | код выхода = 35

Во время создания части сообщения [CommonMsgInfo](/v3/guidelines/smart-contracts/howto/wallet#commonmsginfo) Вы должны указать правильный адрес источника. Он должен быть равен либо [addr_none](/v3/documentation/data-formats/tlb/msg-tlb#addr_none00), либо адресу аккаунта, который отправляет сообщение.

В коде блокчейна за это отвечает функция [check_replace_src_addr](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1985).

### Action Phase | код выхода = 36

Если адрес назначения недействителен, то будет выброшен код выхода 36. Возможные причины - несуществующий воркчейн или неправильный адрес. Все проверки можно посмотреть в [check_rewrite_dest_addr](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L2014-L2113).

### Action Phase | код выхода = 37

Этот код выхода аналогичен `-14` в Compute Phase. Здесь он означает, что не хватает баланса для отправки указанного количества TON.

### Action Phase | код выхода = 38

То же самое, что и в коде выхода `37`, но относится к отсутствию [ExtraCurrency](/v3/documentation/infra/minter-flow#extracurrency) на балансе.

### Action Phase | код выхода = 40

Если есть достаточно TON для обработки определенной части сообщения (скажем, 5 ячеек), а в сообщении 10 ячеек, будет выброшен код выхода 40.

### Action Phase | код выхода = 43

Может возникнуть, если превышено максимальное количество ячеек в библиотеке или превышена максимальная глубина дерева Меркла.

Библиотека - это ячейка, которая хранится в [Мастерчейне](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) и может использоваться всеми смарт-контрактами, если она [публичная](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1844).

:::info
Поскольку порядок строк может меняться при обновлении кода, некоторые ссылки становятся неактуальными. Поэтому все ссылки будут использовать состояние кодовой базы на момент фиксации [9728bc65b75defe4f9dcaaea0f62a22f198abe96](https://github.com/ton-blockchain/ton/tree/9728bc65b75defe4f9dcaaea0f62a22f198abe96).
:::



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-comparison.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-comparison.md
================================================
# TON Connect 2.0 против 1.0

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Connect 2.0 решает многие проблемы, которые были в TON Connect 1.0.

Протокол TON Connect 2.0 обеспечивает высочайший уровень безопасности, удобную для разработчиков среду для создания децентрализованных приложений (dApps) и упрощённый UX со взаимодействием в реальном времени.

Сравнение обеих версий приведено ниже:

|                                                      |    TON Connect v1    |                        TON&amp;nbsp;Connect&amp;nbsp;v2&amp;nbsp;                       |
| :--------------------------------------------------: | :------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------: |
|          Подключение к веб-приложениям dApps         |          ✔︎          |                                                                          ✔︎                                                                         |
|                  Отправка транзакций                 |          ✔︎          |                                                                          ✔︎                                                                         |
|            Подключение dapps через кошелек           |                      |                                                                          ✔︎                                                                         |
|                 Сканирование QR-кодов                | для каждого действия |                                                            один раз, во время подключения                                                           |
|                  Безсерверные dApps                  |                      |                                                                          ✔︎                                                                         |
|                 UX в реальном времени                |                      |                                                                          ✔︎                                                                         |
|                Переключение аккаунтов                |                      |                                                                        скоро                                                                        |
| Отправка сообщений между приложением и пользователем |                      |                                                                        скоро                                                                        |
|               Совместимость с кошельком              |       Tonkeeper      | Tonkeeper, OpenMask, MyTonWallet TonHub (скоро) и [другие](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#basics-features) |



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-business.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-business.md
================================================
# TON Connect для бизнеса

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Connect создан для настройки под потребности бизнеса, предлагая мощные функции, которые привлекают трафик и увеличивают удержание пользователей.

## Особенности продукта

- Безопасная и конфиденциальная аутентификация с контролируемым раскрытием персональных данных
- Произвольное подписание транзакций на TON в рамках одной пользовательской сессии
- Мгновенное соединение между приложениями и кошельками пользователей
- Автоматическая доступность приложений непосредственно в кошельках

## Внедрение TON Connect

### Основные шаги

Для интеграции TON Connect в свои приложения разработчики используют специализированный TON Connect SDK. Этот процесс довольно прост и при необходимости может быть выполнен с использованием соответствующей документации.

TON Connect позволяет пользователям подключать свои приложения к различным кошелькам с помощью QR-кода или универсальной ссылки для подключения. Приложения также можно открывать в кошельке с помощью встроенного расширения для браузера и очень важно следить за обновлениями и новыми функциями TON Connect, которые будут добавлены в будущем.

### Помощь разработчикам в интеграции TON Connect

1. Опишите существующий поток пользователей вашего приложения
2. Определите необходимые операции (например, авторизация транзакций, подпись сообщений)
3. Опишите нашей команде ваш технологический стек

Если вы хотите узнать больше о TON Connect и его различных услугах и возможностях, свяжитесь с TON Connect Business [разработчиком](https://t.me/tonrostislav), чтобы обсудить ваше решение.

### Общие примеры внедрения

При использовании [TON Connect SDK](https://github.com/ton-connect/sdk), подробные инструкции по интеграции TON Connect позволяют разработчикам:

- Подключать свои приложения к различным типам кошельков TON
- Авторизоваться через соответствующий адрес кошелька
- Отправлять запросы на транзакции и подписывать их в кошельке (принимать запросы)

Чтобы лучше понять возможности этого решения, ознакомьтесь с нашим демо-приложением, доступным на GitHub: [https://github.com/ton-connect/](https://github.com/ton-connect/demo-dapp)

### Текущий поддерживаемый технологический стек:

- Все веб-приложения - бессерверные и серверные
- Мобильные приложения на React-Native
- Скоро будет: SDK для мобильных приложений на Swift, Java, Kotlin

TON Connect - это открытый протокол, который можно использовать для разработки dapps с помощью любого языка программирования в любой среде разработки.

Для приложений на JavaScript (JS) сообщество разработчиков TON создало JavaScript SDK, который позволяет интегрировать TON Connect без проблем за несколько минут. В будущем будут доступны SDK для работы с другими языками программирования.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-security.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/business/ton-connect-for-security.md
================================================
# TON Connect для обеспечения безопасности

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Connect обеспечивает пользователям полный контроль над данными, которыми они делятся, что исключает утечку данных при передаче между приложением и кошельком. Для усиления этой системы кошельки и приложения используют надежные криптографические системы аутентификации, которые работают совместно.

## Безопасность пользовательских данных и средств

- В TON Connect данные пользователей шифруются от конца до конца при передаче в кошельки через мосты. Это позволяет приложениям и кошелькам использовать сторонние серверы-мосты, которые снижают вероятность кражи и манипуляции данными, значительно повышая их целостность и безопасность.
- В TON Connect предусмотрены параметры безопасности, позволяющие напрямую аутентифицировать данные пользователей с адресом их кошелька. Это позволяет пользователям использовать несколько кошельков и выбирать, какой из них будет использоваться в конкретном приложении.
- Протокол TON Connect позволяет передавать персональные данные (например, контактные данные, информацию о KYC и т.д.) при условии, что пользователь явно подтверждает передачу таких данных.

Конкретные детали и примеры кода, связанные с TON Connect и его ориентированным на безопасность дизайном, можно найти на [TON Connect GitHub] (https://github.com/ton-connect/).




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/react.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/react.mdx
================================================
# TON Connect для React

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Рекомендуемый SDK для приложений на React — это [UI React SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-react). Это компонент React, который обеспечивает высокоуровневый способ взаимодействия с TON Connect.

## Реализация

### Установка

Чтобы начать интеграцию TON Connect в ваш DApp, вам необходимо установить пакет `@tonconnect/ui-react`. Вы можете использовать npm или yarn для этого:

```bash npm2yarn
npm i @tonconnect/ui-react
```

### Инициализация TON Connect

После установки пакета вам следует создать файл `manifest.json` для вашего приложения. Более подробную информацию о том, как создать файл manifest.json, можно найти [здесь](/v3/guidelines/ton-connect/guidelines/creating-manifest).

После создания файла манифеста, импортируйте TonConnectUIProvider в корень вашего мини-приложения и передайте URL файла manifest:

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

### Подключение кошелька

Добавьте `TonConnectButton`. Кнопка TonConnect — это универсальный компонент пользовательского интерфейса для инициализации соединения. После подключения кошелька она преобразуется в меню кошелька. Рекомендуется разместить ее в правом верхнем углу вашего приложения.

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

Вы также можете добавить className и style props к кнопке. Обратите внимание, что вы не можете передать child в TonConnectButton:

```js
<TonConnectButton className="my-button-class" style={{ float: "right" }}/>
```

Более того, вы всегда можете инициировать соединение вручную с помощью хука `useTonConnectUI` и метода [openModal](https://github.com/ton-connect/sdk/tree/main/packages/ui#open-connect-modal).

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

#### Подключение к определенному кошельку

Чтобы открыть модальное окно для определенного кошелька, используйте метод `openSingleWalletModal()`. Этот метод принимает `app_name` кошелька в качестве параметра (см. файл [wallets-list.json](https://github.com/ton-blockchain/wallets-list/blob/main/wallets-v2.json)) и открывает соответствующее модальное окно кошелька. Он возвращает промис, который разрешается, когда модальное окно успешно откроется.

```tsx
<button onClick={() => tonConnectUI.openSingleWalletModal('tonwallet')}>
  Connect Wallet
</button>
```

### Перенаправления

Если вы хотите перенаправить пользователя на определенную страницу после подключения кошелька, вы можете использовать хук `useTonConnectUI` и [настроить стратегию возврата](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy).

#### Мини-приложения Telegram

Если вы хотите перенаправить пользователя на [Мини-приложение Telegram](/v3/guidelines/dapps/tma/overview) после подключения кошелька, вы можете настроить элемент `TonConnectUIProvider`:

```tsx
      <TonConnectUIProvider
            // ... other parameters
          actionsConfiguration={{
              twaReturnUrl: 'https://t.me/<YOUR_APP_NAME>'
          }}
      >
      </TonConnectUIProvider>
```

[Открыть пример на GitHub](https://github.com/ton-connect/demo-dapp-with-wallet/blob/master/src/App.tsx)

### Настройка интерфейса пользователя

Чтобы настроить [интерфейс](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation) модального окна, вы можете использовать хук `useTonConnectUI` и функцию `setOptions`. Подробнее о хуке useTonConnectUI можно почитать в разделе [Хуки](#hooks).

## Хуки

Если вы хотите использовать некоторые низкоуровневые функции TON Connect UI SDK в своем приложении React, вы можете использовать хуки из пакета `@tonconnect/ui-react`.

### useTonAddress

Используйте его для получения текущего адреса кошелька пользователя Ton. Передайте логический параметр `isUserFriendly` (по умолчанию `true`), чтобы выбрать формат адреса. Если кошелек не подключен, хук вернет пустую строку.

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

Используйте этот хук для доступа к функциям открытия и закрытия модального окна. Хук возвращает объект с текущим состоянием модального окна и методами для его открытия и закрытия.

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

Используйте этот хук для извлечения текущего кошелька TON пользователя. Если кошелек не подключен, хук вернет `null`. Объект `wallet` предоставляет общие данные, такие как адрес пользователя, провайдер, [TON proof](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users) и другие атрибуты (см. интерфейс [Wallet](https://ton-connect.github.io/sdk/interfaces/_tonconnect_sdk.Wallet.html)).

Кроме того, вы можете получить более конкретную информацию о подключенном кошельке, такую как его имя, изображение и другие атрибуты (см. интерфейс [WalletInfo](https://ton-connect.github.io/sdk/types/_tonconnect_sdk.WalletInfo.html)).

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

Используйте его для получения доступа к экземпляру `TonConnectUI` и функции обновления параметров пользовательского интерфейса.

[Подробнее о методах экземпляра TonConnectUI](https://github.com/ton-connect/sdk/tree/main/packages/ui#send-transaction)

[Подробнее о функции setOptions](https://github.com/ton-connect/sdk/tree/main/packages/ui#change-options-if-needed)

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

Показывает текущий статус процесса восстановления подключения. Вы можете использовать его для обнаружения завершения процесса восстановления подключения.

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

## Использование

Давайте рассмотрим, как использовать React UI SDK на практике.

### Отправка транзакций

Отправьте монеты TON (в nanotons) на конкретный адрес:

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

- Больше примеров здесь: [Подготовка сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages)

### Понимание статуса транзакции по хэшу

Основная идея находится в обработке платежей (используя tonweb). [См. подробнее](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)

### Дополнительная проверка (ton_proof) на Backend

:::tip
Узнайте, как подписывать и проверять сообщения: [Подпись и проверка](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
:::

Чтобы убедиться, что пользователь действительно владеет заявленным адресом, вы можете использовать `ton_proof`.

Используйте функцию `tonConnectUI.setConnectRequestParameters` для настройки параметров вашего запроса на подключение. Вы можете использовать его для:

- Состояние загрузки: Показывайте состояние загрузки, ожидая ответа от вашей серверной части.
- Состояние готовности с tonProof: Установите состояние в 'ready' и включите значение tonProof.
- Если возникла ошибка, удалите загрузчик и создайте запрос на подключение без дополнительных параметров.

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

#### Обработка результата ton_proof

Результат `ton_proof` можно найти в объекте `wallet`, когда кошелек подключен:

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

#### Структура ton_proof

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

Пример аутентификации можно найти на этой [странице](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users#react-example)

### Отключение кошелька

Вызов для отключения кошелька:

```js
const [tonConnectUI] = useTonConnectUI();

await tonConnectUI.disconnect();
```

#### Развертывание контракта

Развернуть контракт с использованием TonConnect довольно просто. Вам просто нужно получить код контракта и состояние init, сохранить его как ячейку и отправить транзакцию с предоставленным полем `stateInit`.

Обратите внимание, что `CONTRACT_CODE` и `CONTRACT_INIT_DATA` могут быть найдены в обертках.

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

## Обертки

Обертки - это классы, которые упрощают взаимодействие с контрактом, позволяя вам работать без необходимости беспокоиться о деталях реализации.

- При разработке контракта на FunC вам необходимо написать обертку самостоятельно.
- При использовании [языка Tact](https://docs.tact-lang.org) обертки автоматически генерируются для вас.

:::tip
Ознакомьтесь с документацией [blueprint](https://github.com/ton-org/blueprint) о том, как разрабатывать и развертывать контракты
:::

Давайте рассмотрим пример стандартной обертки `Blueprint` Counter и как мы можем ее использовать:

<details>
<summary>Использование обертки</summary>
Класс обертки счетчика:

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

Теперь вы можете использовать этот класс в своем компоненте React:

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

### Обертки для жетонов и NFT

Для взаимодействия с жетонами или NFT вы можете использовать [assets-sdk](https://github.com/ton-community/assets-sdk).
Этот SDK предоставляет обертки, которые упрощают взаимодействие с этими ассетами. Для практических примеров, пожалуйста, проверьте наш раздел [примеров](https://github.com/ton-community/assets-sdk/tree/main/examples).

## Документация API

[Последняя документация по API](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)

## Примеры

- Пошаговое руководство [TON Hello World](https://helloworld.tonstudio.io/03-client/) для создания простого DApp с использованием React UI.
- [Demo dApp](https://github.com/ton-connect/demo-dapp-with-react-ui) - Пример DApp с `@tonconnect/ui-react`.
- [ton.vote](https://github.com/orbs-network/ton-vote) - Пример веб-сайта React с реализацией TON Connect.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/vue.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/vue.mdx
================================================
# TON Connect для Vue

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Рекомендуемый SDK для приложений Vue — это [UI Vue SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-vue). Это компонент Vue, который обеспечивает высокоуровневый способ взаимодействия с TON Connect.

## Внедрение

### Установка

Чтобы начать интеграцию TON Connect в ваше DApp, вам необходимо установить пакет `@townsquarelabs/ui-vue`. Для этой цели вы можете использовать npm или yarn:

```bash npm2yarn
npm i @townsquarelabs/ui-vue
```

### Инициализация TON Connect

Добавьте TonConnectUIProvider в корень приложения. Вы можете указать параметры пользовательского интерфейса с помощью props.

<!-- [Просмотреть все доступные параметры](https://github.com/TownSquareXYZ/tonconnect-ui-vue/blob/aa7439073dae5f7ccda3ab10291fc4658f5d3588/src/utils/UIProvider.ts#L11) -->

Все вызовы хуков пользовательского интерфейса TonConnect и компонент `<TonConnectButton />` должны быть размещены внутри `<TonConnectUIProvider>`.

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

### Подключение кошелка

Кнопка TonConnect — это универсальный компонент пользовательского интерфейса для инициализации соединения. После подключения кошелька она преобразуется в меню кошелька. Рекомендуется разместить его в правом верхнем углу вашего приложения.

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

Вы также можете добавить `class` и `:style` props к кнопке. Обратите внимание, что вы не можете передать child в TonConnectButton.
`<TonConnectButton class="my-button-class" :style="{ float: 'right' } "/>`

### Перенаправления

Если вы хотите перенаправить пользователя на определенную страницу после подключения кошелька, вы можете использовать хук `useTonConnectUI` и [настроить стратегию возврата](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy).

#### Мини-приложения Telegram

Если вы хотите перенаправить пользователя в [Мини-приложение Telegram](/v3/guidelines/dapps/tma/overview) после подключения кошелька, вы можете настроить элемент `TonConnectUIProvider`:

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

[Подробнее читайте в документации SDK](https://github.com/ton-connect/sdk/tree/main/packages/ui#use-inside-twa-telegram-web-app)

### Настройка пользовательского интерфейса

Чтобы [настроить пользовательский интерфейс](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation) модального окна, вы можете использовать хук `useTonConnectUI` и функцию `setOptions`. Подробнее о хуке useTonConnectUI см. в разделе [Хуки](#usetonconnectui).

## Хуки

### useTonAddress

Используйте его для получения текущего адреса кошелька пользователя. Передайте логический параметр isUserFriendly для выбора формата адреса. Если кошелек не подключен, хук вернет пустую строку.

```html
<template>
  <div v-if="address">
    <span>User-friendly address: {{ userFriendlyAddress }}</span>