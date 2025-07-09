При создании Web3/блокчейн приложений возникает задача получения данных из блокчейна, например посмотреть последние транзакции аккаунта или дернуть в Гет метод контракта.

Для этой задачи можно пользоваться сервисами посредниками, которые либо индексируют блокчейн и отдают вам агрегированную информацию, либо представляют собой прокси сервис прокидывающий ваши запросы через себя. Но использование посредника может нести риски, ошибки или намеренное искажение фактов, может привести к фроду.

В TON есть сетевые протоколы, через которые можно получать информацию грубо говоря без посредника. Одним из таких протоколов является ADNL. В данном туториале, мы подключимся к Лайтсерверам и получим информацию об аккаунте через ANDL.

ADNL — это оверлейный, одноранговый, ненадежный (небольшой) протокол дейтаграмм, работающий поверх UDP в IPv4 (в будущем — IPv6), с необязательным запасным вариантом TCP, если UDP недоступен.

С помощью ANDL вы можете получать данные из блокчейна TON без посредников

## [](#h-2)Вступление

У каждого участника есть 256-битный адрес ADNL. Протокол ADNL позволяет отправлять (ненадежно) и получать дейтаграммы, используя только адреса ADNL. IP-адреса и порты скрыты протоколом ADNL.

Для установления соединения используется механизм рукопожатия. Клиент подключается к серверу с помощью TCP и отправляет пакет подтверждения ADNL, который содержит абстрактный адрес сервера, открытый ключ клиента и зашифрованные параметры сеанса AES-CTR, которые определяются клиентом.

Для подключения к Lightclients нам нужен их список:

*   Основная сеть: [https://ton.org/global.config.json](https://ton.org/global.config.json)
*   Тестовая сеть: [https://ton.org/testnet-global.config.json](https://ton.org/testnet-global.config.json)

\[Подробнее\] ([Low-Level ADNL | The Open Network](https://docs.ton.org/learn/networking/low-level-adnl)) о протоколе.

### [](#h-3)Устанавливаем библиотеки

Для запросов в TON нам понадобиться `typescript` и модулями для работы с TON.  
Для работы с Typescript нам понадобятся:

*   Node.js — среда, в которой вы будете запускать компилятор TypeScript.
*   Компилятор TypeScript — модуль Node.js, который компилирует TypeScript в JavaScript.

> Глубоко погружаться в Node.js мы не будем, инструкции по его установке есть [здесь](https://nodejs.org/en/download/):

Для удобства работы с модулями создадим файл `package.json` c помощью пакетного менеджера `npm`:

1.  В консоли перейдите в папку вашего проекта (где будем писать скрипты)
    
2.  Введите в консоли
    
    npm init
    
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

Установим модуль для работы c TON:

```
npm install ton ton-core ton-crypto
```

И конечно же

```
npm install ton-lite-client
```

## [](#h-4)Подключаемся

`ton-lite-client` мы будем использовать для подключения по ADNL к лайт серверам. Создадим файл `example.ts`, сделаем импорт библиотек и зададим функцию `main`:

```
import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address} from "ton-core";

async function main() {

}

main()
```

Библиотека использует механизм [Round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling) для распределния задач/запросов между лайтсерверами. Соответственно мы можем закинуть несколько лайтсеров к которым будем подключатся, но для простоты примера возьмем один и добавим его в массив `engines`.

Зайдем в [https://ton.org/global.config.json](https://ton.org/global.config.json) и возьмем данные по лайтсерверу.

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

IP надо представить в другом формате, для этого напишем вспомогательную функцию `intToIP` и поместим объект в массив `engine`.

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

С помощью `engine` мы можем инициализировать подключение:

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

Теперь, поскольку мы уже знаем, как генерировать пакеты TL для Lite API, мы можем запросить информацию о текущем блоке мастерчейна TON. Блок masterchain используется во многих дальнейших запросах в качестве входного параметра для указания состояния (момент), в котором нам нужна информация.

В данном туториале наша задача будет получить текущую информацию об аккаунте, а значит нам понадобиться последний блок, достанем его через `getMasterchainInfo()`:

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

Теперь получим информацию об аккаунте, возьмем аккаунт, который мы будем использовать смарт-контракт маркетплейса Getgems:

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

Запустим скрипт с помощью команды `ts-node example.ts`. Теперь в консоли мы видим инфу об аккаунте в последнем блоке в сети. Наиболее интересным для нас в будущем будет lastTx, ,благодаря этому полю можно будет достать последние транзакции, но это будет в следующих туториалах.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnlintro.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/requests/ADNL/adnlintro.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnlintro.md)

```
# ADNL Intro

При создании Web3/блокчейн приложений возникает задача получения данных из блокчейна, например посмотреть последние транзакции аккаунта или дернуть в Гет метод контракта.

Для этой задачи можно пользоваться сервисами посредниками, которые либо индексируют блокчейн и отдают вам агрегированную информацию, либо представляют собой прокси сервис прокидывающий ваши запросы через себя. Но использование посредника может нести риски, ошибки или намеренное искажение фактов, может привести к фроду.

В TON есть сетевые протоколы, через которые можно получать информацию грубо говоря без посредника. Одним из таких протоколов является ADNL. В данном туториале, мы подключимся к Лайтсерверам и получим информацию об аккаунте через ANDL.

ADNL — это оверлейный, одноранговый, ненадежный (небольшой) протокол дейтаграмм, работающий поверх UDP в IPv4 (в будущем — IPv6), с необязательным запасным вариантом TCP, если UDP недоступен.

С помощью ANDL вы можете получать данные из блокчейна TON без посредников

## Вступление

У каждого участника есть 256-битный адрес ADNL. Протокол ADNL позволяет отправлять (ненадежно) и получать дейтаграммы, используя только адреса ADNL. IP-адреса и порты скрыты протоколом ADNL.

Для установления соединения используется механизм рукопожатия. Клиент подключается к серверу с помощью TCP и отправляет пакет подтверждения ADNL, который содержит абстрактный адрес сервера, открытый ключ клиента и зашифрованные параметры сеанса AES-CTR, которые определяются клиентом.

Для подключения к Lightclients нам нужен их список:
- Основная сеть: https://ton.org/global.config.json
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnlintro.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 474

[TON Research](/)

# [Get-запросы в TON - Урок 3 Get метод через ADNL](/t/get-ton-3-get-adnl/474)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:57pm  1

# [](#get-adnl-1)Get метод через ADNL

## [](#h-2)Вступление

Частой задачей в TON является получение данных от смарт-контрактов через Get методы. В данном туториале, мы достанем данные о NFT коллекции через Get метод смарт-контракта коллекции. А также поговорим о логике продажи NFT в TON и как правильно доставать инфу о продаже.

## [](#h-3)Вступление

Так как смарт-контракт коллекции является стандартом, то мы можем посмотреть сигнатуру метода. `get_collection_data()` возвращает:

*   `next_item_index` - количество развернутых в настоящее время элементов NFT в коллекции.
*   `collection_content` - содержимое коллекции в формате, соответствующем стандарту TEP-64.
*   `owner_address` -адрес владельца коллекции, нулевой адрес, если нет владельца.

Для того, чтобы сделать запрос нужен последний блок, как его доставать мы разбирали в предыдущем туториале:

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

Возьмем адрес любой коллекции в TON, например `EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN` и вызовем его Get метод, используя полученный блок:

```
let executed = await client.runMethod(Address.parse(addrStr), 'get_collection_data', Buffer.alloc(0), master.last);
if (!executed.result) {
	return
}
```

Get методы могут принимать параметры, так как в стандартном методе `get_collection_data` параметров нет мы прокидываем `Buffer.alloc(0)` - объект нулевого размера.

В ответе мы получим стек, который надо распарсить, выглядеть это будет так:

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

Теперь можно начинать вычитывать данные, например индекс следующего элемента коллекции:

```
let next_item_index = parsed.readBigNumber();
```

А также адрес владельца и ячейку с контентом:

```
let collection_content = parsed.readCell();
let owner_address = parsed.readAddress();
```

Если вы выведите данные в консоль, вы увидете значение, адрес и ячейку, ячейка содержит в себе контент, хранение данного контента тоже описывается стандартом, хранение данных описано здесь в пункте `Content representation`, данные тут.

Самый частое представление данных, это `Offchain snake format`, давайте его и распарсим:

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

Функция `decodeOffChainContent()` проверяет по префиксу, что это оффчейн хранение контента и ‘разбирает’ ячейку превращая её в нужную нам ссылку.

## [](#h-4)Информация о продаже - логика сбора данных

Понимания как работают смарт-контракты, можно достать почти любую информацию из сети. В TON акторная модель, соответственно, чтобы понять, где взять информацию, нужно понять цепочку смарт-контрактов.

Давайте представим некую задачу и попробуем рассмотреть цепочку. Допустим мы хотим анализировать последние продажи происходящие на NFT маркетплейсе. Тогда примерно понимая как работают продажи NFT в TON(разборы смарт-контрактов тут) мы:

рассмотрим доступный нам элемент NFT и проанализируем как происходит передача владения данного элемента используя эксплорер  
рассмотрим смарт-контракт маркетплейса или иной смарт-контракт в который приходят сообщения о продажах - это даст нам список последних продаж  
разберем какие типы смарт-контрактов реализуют продажи - продавать можно аукционом, просто выставив на продажу или например сделать предложение о продаже владельцу NFT  
посмотрим в каждом типе GET-методы,т.е какую информацию возвращают смарт-контракты продажи  
из GET-методов мы получим информацию про NFT, а значит нам останется достать информацию о конкретных элементах, для этого нужно понимать, как работает стандарт  
Попробуем пройти это путь для маркетплейса Getgems, возьмем какую-нибудь NFT и двигаясь от неё попробуем найти нужную нам инфу.

Находим на маркетплейсе какую-нибудь NFT, которую уже продавали:

![](https://tonscan.org/favicon.svg) [Tonscan](https://tonscan.org/address/EQCSfecskd3PuZJ_eBa1VogJ-okmoIaUOpnWTDdqNpe2OPl7)

### [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCSfecskd3PuZJ_eBa1VogJ-okmoIaUOpnWTDdqNpe2OPl7)

Discover The Open Network ecosystem with tonscan.org — the simplest way to track transaction history, whales addresses, DApps, network stats, staking pools and more.

Посмотрим историю транзакций, видим, что есть траназакция от коллекции - т.е деплой NFT и есть смарт-контракт продажи:

![](https://tonscan.org/favicon.svg) [Tonscan](https://tonscan.org/address/EQCd205E1KdajfW29w7BRyWhiOZwZSPbirMathS8CaTEO83e)

### [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCd205E1KdajfW29w7BRyWhiOZwZSPbirMathS8CaTEO83e)

Discover The Open Network ecosystem with tonscan.org — the simplest way to track transaction history, whales addresses, DApps, network stats, staking pools and more.

Если рассмотреть смарт-контракт продажи, станет ясно, что по его логике последняя транзакция идет в смарт-контракт маркетплейса, а именно сюда:

![](https://tonscan.org/favicon.svg) [Tonscan](https://tonscan.org/address/EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS)

### [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS)

Discover The Open Network ecosystem with tonscan.org — the simplest way to track transaction history, whales addresses, DApps, network stats, staking pools and more.

Теперь у нас есть гипотеза, что если брать траназакции данного смарт-контракта, мы сможем получать информацию о продажах, но мы помним, что продажи бывают разные, полазив по смарт-контракту маркетплейса, мы найдем:

Продажи, пример: [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQCd205E1KdajfW29w7BRyWhiOZwZSPbirMathS8CaTEO83e)  
Предложения о продажах, пример: [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQBikL59x3fXgG4CYXTZBiCHiBhLOHp1cYKL4bBqTRL-5ywu)  
Продажи по аукциону, пример: [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/address/EQBLQRjs7unG_ruz3Ismly_3_aXFD_wthmbTSUtdh6te4B1e)  
Изучим Get-методы данных смарт-контрактов, рассмотрев вкладку Contract в эксполрере. Видим, что для обычных продаж и аукционов, есть метод get\_nft\_data().

Для продаж:

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

Для аукционов:

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

Заметьте первые переменные, которые возвращают методы одинаковые, значит, чтобы достать информацию, какой элемент продали, нам надо будет делать одинаковый запрос для двух этих типов. Для предложений ситуация иная, там есть метод `get_offer_data()`.

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

Из данных методов мы сможем получить адрес коллекции, адрес элемента и цену по которой произшла продажа. Теперь изучив стандарты мы можем получить информацию об элементах, которые были проданы.

Выглядеть это будет следующим образом, сначала сделаем запрос в элемент `get_nft_data()` , получим индивидуальный контент ячейки и индекс элемента. Теперь идем в смарт-контракт коллекции, там нам нужен метод `get_nft_content(int index, cell individual_content)`, который и вернет нам ячейку с контентом.

## [](#h-5)Заключение

Делать Get-запросы и доставать контент через ANDL мы умеем, осталось только научиться доставать траназакции - этим мы займемся в следующем туториале.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnlgetsale.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/requests/ADNL/adnlgetsale.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnlgetsale.md)

```
# Get метод через ADNL

## Вступление

Частой задачей в TON является получение данных от смарт-контрактов через Get методы. В данном туториале, мы достанем данные о NFT коллекции через Get метод смарт-контракта коллекции. А также поговорим о логике продажи NFT в TON и как правильно доставать инфу о продаже.

## Вступление

Так как смарт-контракт коллекции является стандартом, то мы можем посмотреть сигнатуру метода. `get_collection_data()` возвращает:

- `next_item_index` - количество развернутых в настоящее время элементов NFT в коллекции. 
- `collection_content` - содержимое коллекции в формате, соответствующем стандарту TEP-64. 
- `owner_address` -адрес владельца коллекции, нулевой адрес, если нет владельца.

Для того, чтобы сделать запрос нужен последний блок, как его доставать мы разбирали в предыдущем туториале:

	import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
	import { Address} from "ton-core";

	async function main() {
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnlgetsale.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 475

[TON Research](/)

# [Get-запросы в TON - Урок 4 Собираем последние траназакции](/t/get-ton-4/475)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 8:57pm  1

# [](#h-1)Собираем последние траназакции

Частой задачей в ТОН является получение траназакций какого-либо аккаунта. В данном туториале мы разберем как доставать транзакции аккаунта используя АДНЛ

## [](#h-2)Логическое время транзакции

В бибилотеке `ton-lite-client` есть функция `getAccountTransactions` для получения транзакций аккаунта, проблема в том, что фильтр идет по логическому времени транзакции. Соответсвенно, чтобы получить последние траназакции, сначала надо достать. Сделаем это мы с помощью `getAccountState()`:

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

Все просто - берем последний блок, и из него получаем информацию об аккаунте. Из это информации мы достанем логическое время последней траназакции и с помощью вспомогательной фукнции `bigIntToBuffer()` представим хэш в нужном нам далее формате:

```
let lastTxLt = accountState.lastTx.lt.toString()
let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)
```

Вызываем метод и получим ячейку с траназакциями:

```
let lastTxLt = accountState.lastTx.lt.toString()
let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)

let limit = 16 as number 
const temp = await client.getAccountTransactions(address,lastTxLt,lastTxHash,limit)
```

Воспользуемся функцией `loadTransction` из `ton-core` и используя логическое время представим транзакции в удобном виде:

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

## [](#h-3)Циклы и транзакции

Теперь мы можем пройтись циклом по транзакциям. Сделаем так - достанем информацию и представим её в удобно виде, информация следующая:

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

Представляем в удобном виде:

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

Далее расмотрим информацию о транзакциях, но чтобы просмотреть сообщение отправленное с транзакцией, нам понадобиться еще одна вспомогательная функция:

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

## [](#h-4)Приводим в читаемый вид

Для пример достанем информацию по транзакциям и представим их в удобном, читаемом виде:

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

В конце вы можете видеть закомментированный кусок кода, он может понадобиться вам, если вы захотите вытащить больше чем 16 траназакций за раз, так как функций getAccountTransactions, вытакскивает максимум по 16, а значит вам нужно вызывать её циклом и доставать логическое время последней траназакции каждый раз, если вы хотите больше чем 16 траназакций.

## [](#h-5)Заключение

Данная статья является последней в цикле про ADNL, надеюсь вам понравилось и вы поставите звездочку репозиторию. Больше полезных статей про ТОН [здесь](https://t.me/ton_learn).

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnltxes.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/requests/ADNL/adnltxes.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnltxes.md)

```
# Собираем последние траназакции

Частой задачей в ТОН является получение траназакций какого-либо аккаунта. В данном туториале мы разберем как доставать транзакции аккаунта используя АДНЛ 

## Логическое время транзакции

В бибилотеке `ton-lite-client` есть функция `getAccountTransactions` для получения транзакций аккаунта, проблема в том, что фильтр идет по логическому времени транзакции. Соответсвенно, чтобы получить последние траназакции, сначала надо достать. Сделаем это мы с помощью `getAccountState()`:

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
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/requests/ADNL/adnltxes.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 476

[TON Research](/)

# [Авторизация и отправка транзакций с UI за c TON Connect React UI - Урок 1 Ton Connect React ui кнопка авторизации](/t/ui-c-ton-connect-react-ui-1-ton-connect-react-ui/476)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)   February 21, 2024, 9:04pm  1

# [](#ton-connect-react-ui-1)Ton Connect React ui кнопка авторизации

TonConnect UI React — это набор пользовательского интерфейса React для TonConnect SDK. Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect в приложениях React.

Использование TonConnect UI React, позволит вам быстро создавать авторизацию и приложения на TON.

### [](#tonkeeper-2)Tonkeeper

Для того, чтобы воспользоваться, нужен кошелек на TON, ссылка на TONkeeper: [https://tonkeeper.com/](https://tonkeeper.com/)

## [](#h-3)Устанавливаем зависимости

Make a folder for your project and go into it.

```
// Windows example
mkdir tcon_folder
cd tcon_folder
```

Прежде чем начать, в вашей системе должны быть установлены `Node` и `yarn`. В нашем туториале будем использовать `vite` - инструмент настройки среды разработки. С помощью него бы сразу сделаем шаблон приложения:

```
yarn create vite react_ui_connect --template react-ts
```

Перейдем в папку с проектом:

```
cd react_ui_connect
```

Установим “базовые” зависимости:

```
yarn
```

Для работы с TON нам понадобяться:

```
yarn add ton ton-core ton-crypto
```

Если прямо сейчас вызвать библиотеки ton(например преобразовать адрес и вывести его пользователю), то вы увидите ошибку Buffer is not defined. Чтобы обойти эту проблему, установим:

```
yarn add vite-plugin-node-polyfills
```

Нужно это, чтобы решить polyfill проблему, также для её решения надо настроить конфиг `vite`. Открываем `vite.config.ts` и видим настройки шаблона:

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

Добавим в неё `vite-plugin-node-polyfills`:

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),nodePolyfills()],
})
```

Осталось установить `TON Connect react-ui`:

```
yarn add @tonconnect/ui-react
```

## [](#h-4)Манифест

Когда пользователь подключается к приложению, через `TON Connect`, кошелек показывает пользователю информацию о подключении - куда подключается пользователь. Чтобы передать эту информацию от приложения в `TON Connect` нужно сделать файл манифест, который мы будем передавать при создании подключения, между нашим приложением и кошельком.

Параметры или по-другому метаданные имеют следующие поля:

{  
“url”: “”, // required  
“name”: “”, // required  
“iconUrl”: “”, // required  
“termsOfUseUrl”: “”, // optional  
“privacyPolicyUrl”: “” // optional  
}

Хорошей практикой является размещение манифеста c метаданными в корне вашего приложения, но можно расположить и на гитхабе.

Для примера возьмем ссылку на гитхаб из репозитория с примером:

```
const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';
```

Когда у нас готов манифест, можно переходить к соединению.

## [](#h-5)Соединение

Открываем файл `src\main.tsx` и импортируем в него `TonConnectUIProvider`:

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

Добавим манифест:

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

Чтобы создать подключение, нужно обернуть наше приложение в `TonConnectUIProvider`, выглядеть это может так:

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

Теперь у нас есть подключение, его мы будем использовать для кнопки авторизации.

## [](#h-6)Кнопка авторизации

Переходим в файл `App.tsx` и удаляем все лишнее внутри первого `div` и удалим лишне лого из импорта:

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

Для создания кнопки авторизации будем использовать `TonConnect Button`. `TonConnect Button` is universal UI component for initializing connection. After wallet is connected it transforms to a wallet menu. Импортируем компонент:

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

Так как это компонент, мы можем просто вызвать его внутри функции:

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

Запустим приложение командой `yarn dev`. И введем в браузере полученную ссылку. Должны увидеть:

[![image](https://tonresear.ch/uploads/default/optimized/1X/b73a380a920d70940bd373507d4f1c9787b4d421_2_690x353.png)

image1918×982 8.79 KB

](https://tonresear.ch/uploads/default/original/1X/b73a380a920d70940bd373507d4f1c9787b4d421.png "image")

Нажмите на кнопку и вы увидеть QR и возможность выбора кошелька:

[![image](https://tonresear.ch/uploads/default/optimized/1X/7f040f8083aced5cea12c03face281addc2f5d5b_2_690x359.png)

image1920×999 41.3 KB

](https://tonresear.ch/uploads/default/original/1X/7f040f8083aced5cea12c03face281addc2f5d5b.png "image")

Выберите Tonkeeper во вкладке кошельки, QR измениться:

[![image](https://tonresear.ch/uploads/default/optimized/1X/f57ce5f920751e3a9ded228a9b885733fae8eefb_2_690x357.png)

image1915×992 43.2 KB

](https://tonresear.ch/uploads/default/original/1X/f57ce5f920751e3a9ded228a9b885733fae8eefb.png "image")

Авторизуемся с помощью Tonkeeper, кнопка измениться и будет отображать ваш адрес. В выпадающем списке будет кнопка дисконект и возможность скопировать адрес.

[![image](https://tonresear.ch/uploads/default/optimized/1X/fdb3ea5e2e6b8f3fbbc38c1ce55288cfc2935cc8_2_690x358.png)

image1904×989 19.5 KB

](https://tonresear.ch/uploads/default/original/1X/fdb3ea5e2e6b8f3fbbc38c1ce55288cfc2935cc8.png "image")

И это все с помощью одного компонента, который мы добавили одной строчкой кода. В следующем туториале, мы разберемся как после авторизации взаимодействовать со смарт-контрактами, отправляя транзакции.

## [](#h-7)Заключение

В следующей части мы добавим отправку транзакции, а также вызов Get-метода, для проверки отправки транзакции. Подобные туториалы и разборы по сети TON я пишу в свой канал - [Telegram: Contact @ton\_learn](https://t.me/ton_learn) . Буду рад вашей подписке.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/tonconnect/button.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/tonconnect/button.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/tonconnect/button.md)

```
# Ton Connect React ui кнопка авторизации

TonConnect UI React — это набор пользовательского интерфейса React для TonConnect SDK. Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect в приложениях React.

Использование TonConnect UI React, позволит вам быстро создавать авторизацию и приложения на TON.

### Tonkeeper

Для того, чтобы воспользоваться, нужен кошелек на TON, ссылка на TONkeeper: https://tonkeeper.com/

## Устанавливаем зависимости

Make a folder for your project and go into it.

	// Windows example
	mkdir tcon_folder
	cd tcon_folder
	
Прежде чем начать, в вашей системе должны быть установлены `Node` и `yarn`. В нашем туториале будем использовать `vite` - инструмент настройки среды разработки. С помощью него бы сразу сделаем шаблон приложения:

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/tonconnect/button.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 477

[TON Research](/)

# [Авторизация и отправка транзакций с UI за c TON Connect React UI - Урок 2 Ton Connect React ui отправка траназакции](/t/ui-c-ton-connect-react-ui-2-ton-connect-react-ui/477)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 9:05pm  1

# [](#ton-connect-react-ui-1)Ton Connect React ui отправка траназакции

В предыдущей части мы сделали простой сайт с авторизацией через TonConnect, давайте добавим функционал отправки транзакции.

## [](#h-2)Приступим

Чтобы отправить транзакцию через tonConnectUI, нужно воспользоваться методом sendTransaction и вроде на этом можно было бы туториал и заканчивать:

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

Но на практике задача, отправки транзакции шире:

*   транзакцию надо отправлять в контракт, данные о нем
*   транзакций много, нужен некоторая удобная абстракция для отправки
*   с транзакцией нужно отправлять payload, который нужно определять удобным образом

Для примера в данном туториале мы будем использовать контракт из предыдущего урока. TBD ссылка на него

## [](#h-3)Используем обёртку

Создаем в `src` папку контракт и файл `ContractWrapper.ts` в него копируем обертку из предыдущего урока.

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

Создадим папку для кастомных хуков `hooks` и создадим в ней первый кастомный хук `useInit` в файле `useInit.ts`:

```
import {useEffect, useState} from 'react';

export function useInit<T>(

){

}
```

В него добавим верхнеуровневую логику обработки состояния инициализации контракта:

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

Чтобы получать данные из блокчейна нужна точка подключения, воспользуемся для простоты в данном случае api toncenter, сделаем это в отдельном хуке `useTonClient.ts`

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

Наконец-то переходим к хуку, который будет взаимодействовать с нашим контрактом, создаем `useContractWrapper.ts` и сразу же импортируем туда созданные нами хуки и некоторые доп функции из уже установленных нами бибилиотек.

```
import {useEffect, useState} from 'react';
import { Address, OpenedContract} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';

export function useContractWrapper() {

}
```

Для работы с контрактом нужно подключение, создадим его с помощью хука useTonClient() и также опишем данные контракта:

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

Открываем контракт и достаем данные Get методом

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

Остается только вернуть данные контракта и его адрес:

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

Теперь идем в файл `App.ts` и импортируем хук `useContractWrapper`

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

Вызовем хук и выведем информацию, не забыв привести адрес отправителя к строке.

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

Запустите приложение с помощью команды `yarn dev`. Убедитесь, что вы видите данные смарт-контракта.

## [](#h-4)Отправляем траназакцию

Предположим, что вы делаете приложение с большим количество транзакций в разные контракты, в таком случае было бы удобно сделать один хук для отправки транзакций, в который просто прокидывались бы параметры. Несмотря на то, что наш пример простой мы так и сделаем, создаем хук `useConnection.ts`:

```
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments} from "ton-core";

export function useConnection(): {} {
	const [useTonConnectUI] = useTonConnectUI();


}
```

Он будет предполагать вызов с аргументами для транзакции и возвращать объект sender(отправка траназакции) и connected(подключен ли кошелек пользователя -  
то для удобства формирования логики ui).

import { useTonConnectUI } from “@tonconnect/ui-react”;  
import { Sender, SenderArguments} from “ton-core”;

export function useConnection(): { sender: Sender; connected: boolean} {  
const \[TonConnectUI\] = useTonConnectUI();

```
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
```

}

Поле validUntil необходимо для безопастности, чтобы при перехвате соединения, кто-нибудь не смог его отправить повторно.

Теперь нужно доработать хук `useContractWrapper.ts`, для отправки транзакции, а также обновления информации, каждые 5 секунд (время обновления блокчейна TON).

Импортируем useConnection.ts и воспользуемся им:

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

Чтобы обновление происходило каждые 5 секунд, добавим функцию `sleep()` и добавим её и получение данных из Get-метода в хук `useEffect`:

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

Осталось добавить функцию отправки внутреннего сообщения в `return`.

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

Добавим отправку траназакции на UI, переходим в файл `App.tsx` и добавляем соединение:

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

Соединение будет позволять отображать ссылку на отправку траназакции:

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

Проверим отправку траназакции - `yarn dev`

## [](#h-5)Заключение

Подобные туториалы и разборы по сети TON я пишу в свой канал - [Telegram: Contact @ton\_learn](https://t.me/ton_learn) . Буду рад вашей подписке.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/tonconnect/sendtx.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/tonconnect/sendtx.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/tonconnect/sendtx.md)

```
# Ton Connect React ui отправка траназакции

В предыдущей части мы сделали простой сайт с авторизацией через TonConnect, давайте добавим функционал отправки транзакции.

## Приступим

Чтобы отправить транзакцию через tonConnectUI, нужно воспользоваться методом sendTransaction и вроде на этом можно было бы туториал и заканчивать:

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
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/tonconnect/sendtx.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 478

[TON Research](/)

# [Golang Scripts - удобные скрипты для работы с TON - Урок 1 Создаем кошелек и деплоим смарт-контракт](/t/golang-scripts-ton-1/478)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)   February 21, 2024, 9:07pm  1

# [](#go-1)Создаем кошелек и деплоим контракт с помощью GO

## [](#h-2)Вступление

В tondev чате часто возникают вопросы про взаимодействие с TON с помощью популярных языков программирования, особенно часто встречаются вопросы про взаимодействие с NFT коллекциями и контрактами в целом. Поэтому для [ton\_learn](https://t.me/ton_learn) я решил сделать 2 урока, где мы взаимодействуем с блокчейном TON с помощью некоторых скриптов, так, чтобы читатель по итогу мог легко работать со смарт-контрактами в ТОН.

Задачи следующие:

*   в этом уроке мы сделаем заготовку с кошельком, которую будем использовать далее, а также разберемся как деплоить и взаимодействовать с контрактом из первого урока
*   в следующем уроке будем деплоить NFT коллекцию, а также подергаем Get-методы

Для работы с TON скриптами будем использовать библиотеку для GO [tonutils-go](https://github.com/xssnick/tonutils-go). Данная библиотека имеет отличный баланс между верхнеуровневостью и низкоуровневостью, таким образом она позволяет писать простые скрипты, но в тоже время не лишает нас различных возможностей работы с блокчейном TON.

Даже если вы не знакомы с GO я уверен, что данный урок и скрипты будут вам понятны, но на всякий случай в самом конце урока есть ссылки на материалы, которые позволят вам быстро освоиться с GO.

> Хочется также отметить, что данной библиотеки хорошая документация с примерами.

## [](#h-3)Создаем кошелек

Кошелек необходим нам, чтобы отправлять сообщения внутри TON (те, что приходят в recv\_internal()). По сути кошелек это смарт-контракт, способный принимать внешние сообщения (те, что recv\_external()) и отправлять внутренние. Поэтому прежде чем переходить к деплою смарт-контракта, сначала создадим кошелек.

### [](#h-4)Подключаемся к сети

Кошелек в сети TON является смарт-контрактом, чтобы задеплоить смарт-контракт в тестовую или основную сеть, нам необходимо подключиться к сети, для этого нужен её конфиг:

*   [конфиг тестовой сети](https://ton-blockchain.github.io/testnet-global.config.json)
*   [конфиг основной сети](https://ton-blockchain.github.io/global.config.json)(mainnet)

Взаимодействовать с сетью мы будем через лайтсерверы.

> Легкий клиент (англ. lite-client) — это программное обеспечение, которое подключается к полным узлам для взаимодействия с блокчейном. Они помогают пользователям получать доступ к блокчейну и взаимодействовать с ним без необходимости синхронизации всего блокчейна.

Итак, выполним подключение:

```
client := liteclient.NewConnectionPool()

configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"

err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
	panic(err)
}
api := ton.NewAPIClient(client)
```

Получаем api лайтсервера.

> Если вы посмотрите на конфиги, вы можете увидеть несколько лайтсерверов внутри, какой выбирает библиотека? - Первый с которым будет успешное соединение

### [](#seed-5)Seed фраза

Для генерации кошелька нам нужна пара публичный/приватный ключ (получать их будет с помощью Seed фразы) и структура [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L60), соответствующая одному из доступных версий кошельков.

> Seed фраза - последовательность из слов используемых для генерации ключей.

Сгенерируем seed фразу c помощью `wallet.NewSeed()` и напечатаем её, чтобы можно было скопировать и использовать кошелек в будущем.

```
seed := wallet.NewSeed()
fmt.Println("Seed phrase:")
fmt.Println(seed)
```

Эту фразу можно и нужно сохранить, чтобы использовать кошелек в будущем.

Генерируем кошелек и выводим адрес.

```
w, err := wallet.FromSeed(api, seed, wallet.V3)
if err != nil {
	log.Fatalln("FromSeed err:", err.Error())
	return
}

fmt.Println(w.Address())
```

Подробнее про разные версии кошельков можно прочитать [здесь](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md).

### [](#h-6)“Активируем” кошелек

В соответствии с [документацией](https://ton-blockchain.github.io/docs/#/payment-processing/overview?id=deploying-wallet) на полученный адрес необходимо отправить Toncoin. В тестовой сети для этого есть бот [Telegram: Contact @testgiver\_ton\_bot](https://t.me/testgiver_ton_bot) . По основной сети, приложу официальную [страницу](https://ton-blockchain.github.io/buy-toncoin).

### [](#h-7)Получаем баланс

Наш кошелек готов и чтобы получить баланс, необходимо получить текущую информацию о сети (а именно текущий блок).

```
block, err := api.CurrentMasterchainInfo(context.Background())
if err != nil {
	log.Fatalln("CurrentMasterchainInfo err:", err.Error())
	return
}
```

И далее из блока получить баланс:

```
balance, err := w.GetBalance(context.Background(), block)
if err != nil {
	log.Fatalln("GetBalance err:", err.Error())
	return
}

fmt.Println(balance)
```

Итоговый код `createwallet.go` :

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

Прежде, чем двигаться дальше вынесем генерацию кошелька по сид фразе в отдельную функцию.

### [](#h-8)Функция под кошелек

Так как у нас уже есть сид фраза, нам не надо её больше генерировать, остается только собрать кошелек.

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

Пример с генерацией кошелька с подобной функцией есть в отдельном файле `walletfunc.go`.

## [](#h-9)Деплоим смарт-контракт

### [](#hexboc-10)hexBoc смарт-контракта

Теперь, когда у нас есть кошелек с балансом Toncoin на нем, мы можем деплоить смарт-контракты. В библиотеке `tonutils-go` можно деплоить смарт-контракт в форме hexBoc. Boc это сериализованная форма смарт-контракта(bag-of-cells).

Самый простой способ перевести смарт-контракт в подобную форму — это использовать fift скрипт. Возьмем fift код из первого смарт-контракта и напишем скрипт, который переведет его в hexBoc.

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

> Если вы проходили первый урок, то Fift код контракта лежит в папке fift

Теперь скрипт, который переведет код в формат hexBOC:

```
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include

."first contract:" cr

"first.fif" include
2 boc+>B dup Bx. cr cr
```

Подробно останавливаться на fift не будет, это выходит, за рамки этого урока, отмечу только:

*   boc+>B - сериализует в формат boc
*   cr - выводит в строку значение

> Запустить скрипт можно либо с помощью знакомого нам toncli, а именно `toncli fift run` , либо как описано [здесь](https://ton-blockchain.github.io/docs/#/compile?id=fift).

Пример скрипта, находится в файле `print-hex.fif`.

По итогу мы получим:

```
B5EE9C72410104010038000114FF00F4A413F4BCF2C80B0102016202030032D020D749C120F263D31F30ED44D0D33F3001A0C8CB3FC9ED540011A1E9FBDA89A1A67E61A6614973
```

### [](#h-11)Подходим к деплою контракта

Берем нашу заготовку с кошельком `walletfunc.go` из неё сделаем скрипт деплоя контракта. Первое что сделаем, это добавим фукнцию`getContractCode()`, которая будет преобразовывать hexBOC полученный ранее в байты:

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

### [](#h-12)Процесс деплоя смарт-контракта

Для деплоя смарт-контракта, нам необходимо сформировать `StateInit`. `StateInit` это комбинация кода смарт-контракта, который у нас уже есть и данных смарт-контракта. Данные смарт-контракта, это то, что мы хотим положить в регистр `с4`, часто туда кладется адрес владельца смарт-контракта, для управления им. Примеры вы могли видеть в 9 и 10 уроках, где в `с4` хранился владелец NFT коллекции или Jetton. В нашем примере мы можем туда положить 0 или любое число, главное 64 бит, чтобы он было 64 бит, для корректной работы логики контракта. Для данных сделаем отдельную функцию:

```
func getContractData() *cell.Cell {
	data := cell.BeginCell().MustStoreUInt(2, 64).EndCell()

	return data
}
```

Их StateInit благодаря хэшированию вычисляется адрес смарт-контракта.

На полученный адрес необходимо отправить сообщение и что важно не забыть про небольшое количество TON, так как смарт-контракты должны иметь положительный баланс, чтобы иметь возможность платить за хранение и обработку своих данных в блокчейне.

Также для сообщения необходимо подготовить некоторое тело, но оно может быть и пустым в зависимости от вашей ситуации.

В `tonutils-go` вся эта логика находится внутри функции `DeployContract`, вызов её в нашем случае будет выглядеть так:

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

Параметр `true` указывает на необходимость “подождать” подтверждение отправки сообщения.

> Важно отметить, что так как адрес мы получаем хэширование, то задеплоить два раза один и тот же контракт с одинаковыми данными не получиться, сообщение просто придет в уже существующий контракт.

Итоговый код `deploycontract.go`:

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

## [](#h-13)Отправляем сообщение

Теперь давайте протестируем наш смарт-контракт, а именно отправим сообщение, после которого контракт должен будет сложить его с числом в регистре с4 и сохранить получившееся значение. Возьмем нашу заготовку с кошельком `walletfunc.go` и в неё добавим код отправки сообщения:

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

Схема сообщения все та же, что и раньше) Подробнее разобрано в 3 уроке. Отправляем мы сообщение от нашего кошелька.

## [](#get-14)Вызываем GET метод

Теперь осталось проверить про суммировались ли значения в смарт-контракте. Для этого в tonutils-go есть RunGetMethod(), в который надо передать текущий блок, адрес смарт-контракта, метод и параметры для методы.

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

Важно отметить, если вы отправите сообщение и вызовите Get контракт подряд, данные могут не успеть обновиться в блокчейне и вы можете получить старое значение. Поэтому добавляем между отправкой сообщений и Get методом, получение нового блока. И [time.Sleep](https://www.geeksforgeeks.org/time-sleep-function-in-golang-with-examples/). Либо комментируем отправку сообщения и отдельно вызываем get метод).

> В TON блоки обновляются 5 секунд.

Примерный код, находится в файле `sendandget.go`

## [](#h-15)Заключение

В следующем уроке мы будем деплоить nft коллекцию. Также хотел отметить, что у tonutil-go на их странице есть адрес для донатов.

## [](#go-16)Дополнение по GO

Собрал здесь пару ссылок, который ускорят ваше понимает скриптов из данного урока.

### [](#go-17)Установка GO

![](https://tonresear.ch/uploads/default/original/1X/68f11f1b3c0b1083db3cbb7e71ba04a723150d33.png) [go.dev](https://go.dev/)

![](https://tonresear.ch/uploads/default/optimized/1X/51823551a25fe20bbf14ab81cf96d2a06df4bde9_2_690x400.jpeg)

### [The Go Programming Language](https://go.dev/)

Go is an open source programming language that makes it simple to build secure, scalable systems.

### [](#hello-world-go-18)Hello world на GO

[https://gobyexample.com/hello-world](https://gobyexample.com/hello-world)

### [](#h-15-19)Синтаксис за 15 минут

[https://learnxinyminutes.com/docs/go/](https://learnxinyminutes.com/docs/go/)

### [](#no-required-module-20)Ошибка No required module

![](https://tonresear.ch/uploads/default/original/1X/d058236bbf509070bd0a551d5d9544ec84cc0988.png) [codesource.io – 2 Jun 22](https://codesource.io/how-to-install-github-packages-in-golang/ "01:52PM - 02 June 2022")

### [How to install GitHub packages in GoLang](https://codesource.io/how-to-install-github-packages-in-golang/)

In this article, you are going to learn how to install GitHub packages in the Go programming language. In the Go programming language

### [](#context-21)Что такое context

[https://gobyexample.com/context](https://gobyexample.com/context)

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/golang/14lesson/wallet.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/golang/14lesson/wallet.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/golang/14lesson/wallet.md)

```
# Создаем кошелек и деплоим контракт с помощью GO

## Вступление

В tondev чате часто возникают вопросы про взаимодействие с TON с помощью популярных языков программирования, особенно часто встречаются вопросы про взаимодействие с NFT коллекциями и контрактами в целом. Поэтому для [ton_learn](https://t.me/ton_learn) я решил сделать 2 урока, где мы взаимодействуем с блокчейном TON с помощью некоторых скриптов, так, чтобы читатель по итогу мог легко работать со смарт-контрактами в ТОН.

Задачи следующие:
- в этом уроке мы сделаем заготовку с кошельком, которую будем использовать далее, а также разберемся как деплоить и взаимодействовать с контрактом из первого урока
- в следующем уроке будем деплоить NFT коллекцию, а также подергаем Get-методы

Для работы с TON скриптами будем использовать библиотеку для GO [tonutils-go](https://github.com/xssnick/tonutils-go). Данная библиотека имеет отличный баланс между верхнеуровневостью и низкоуровневостью, таким образом она позволяет писать простые скрипты, но в тоже время не лишает нас различных возможностей работы с блокчейном TON.

Даже если вы не знакомы с GO я уверен, что данный урок и скрипты будут вам понятны, но на всякий случай в самом конце урока есть ссылки на материалы, которые позволят вам быстро освоиться с GO.

> Хочется также отметить, что  данной библиотеки хорошая документация с примерами.

## Создаем кошелек

Кошелек необходим нам, чтобы отправлять сообщения внутри TON (те, что приходят в recv_internal()). По сути кошелек это смарт-контракт, способный принимать внешние сообщения (те, что recv_external()) и отправлять внутренние. Поэтому прежде чем переходить к деплою смарт-контракта, сначала создадим кошелек. 

```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/golang/14lesson/wallet.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 479

[TON Research](/)

# [Golang Scripts - удобные скрипты для работы с TON - Урок 2 Создание NFT коллекции](/t/golang-scripts-ton-2-nft/479)

[Русский](/c/ru/general/50)  [General](/c/ru/general/50) 

[func](https://tonresear.ch/tag/func), [learn](https://tonresear.ch/tag/learn)

    

[IvanKriptov](https://tonresear.ch/u/IvanKriptov)  February 21, 2024, 9:08pm  1

# [](#nft-1)Деплоим NFT коллекцию

## [](#h-2)Вступление

В данном уроке мы будем деплоить NFT коллекцию с помощью библиотеки tonutils-go. Чтобы урок качественно покрывал тему деплоя NFT коллекции, мы поступим следующим образом, сначала сделаем запросы к существующий коллекции, таким образом получим примеры, что может храниться в NFT коллекции и её элементе. А потом мы создадим свою NFT коллекцию (совсем тестовую без какого-либо смысла).

Прежде чем переходить к уроку, советую посмотреть предыдущий урок, чтобы понимать, как создается кошелек и деплоятся контракты.

## [](#h-3)Получаем информацию о Коллекции и отдельном элементе

Получение информации о коллекции, предполагает выполнение GET запросов к смарт-контракту. В данном уроке, мы будет рассматривать получение информации от смарт-контрактов, соответствующих стандартам. Урок с разбором стандарта NFT [здесь](https://github.com/romanovichim/TonFunClessons_ru/blob/main/10lesson/tenthlesson.md). Сам стандарт, можно найти [здесь](https://github.com/ton-blockchain/TIPs/issues/62).

### [](#nft-4)Какую информацию можно взять по стандарту коллекции NFT

Смарт-контракт коллекции,соответствующий стандарту, должен реализовывать Get-метод `get_collection_data()` , который вернет адрес владельца коллекции, контент коллекции, и счетчик текущих NFT в коллекции. Функция выглядит так:

```
(int, cell, slice) get_collection_data() method_id {
  var (owner_address, next_item_index, content, _, _) = load_data();
  slice cs = content.begin_parse();
  return (next_item_index, cs~load_ref(), owner_address);
}
```

> load\_data() выгружает данные из регистра c4

Если бы просто выполняли, запрос в контракт, нам бы приходилсь “парсить” слайс и прочие неприятные вещи, связанные с типами. В `tonutils-go`, есть функция `GetCollectionData` в которая позволит не заморачиваться с этим, именно её мы будем использовать далее.

Для примера возьмем какую-нибудь коллекцию с какого-нибудь маркетплейса и просто проверим информацию, которую мы получим и информацию с маркетплейса.

Адрес коллекции, который я буду использовать в этом урок:

```
EQAA1yvDaDwEK5vHGOXRdtS2MbOVd1-TNy01L1S_t2HF4oLu
```

Судя по информации с маркетплейса в коллекции по этому адресу 13333 элементов, давайте проверим это

### [](#nft-go-5)Достаем информацию о NFT коллекции с помощью GO

Подключаемся к лайтсервам в основной сети:

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

> Данная коллекция есть и в тестовой сети, так что если возьмете конфиг тестовой сети, все также будет работать

Возьмем адрес и воспользуемся функцией `GetCollectionData`, чтобы вызвать метод get\_collection\_data() и преобразовать данные в читаемый

> Прежде чем вызывать `GetCollectionData` нужно установить соединеи `NewCollectionClient`

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

Теперь в `collectionData` храниться информация об коллекции, выведем с помощью библиотеки `fmt` в консоль данные из `collectionData`.

Должно вывести следующую информацию:

```
Collection addr      : EQAA1yvDaDwEK5vHGOXRdtS2MbOVd1-TNy01L1S_t2HF4oLu
	content          : http://nft.animalsredlist.com/nfts/collection.json
	owner            : EQANKN8ZnM0OzYOENTkOEg7VVgFog5fBWdCtqQro1MRmU5_2
	minted items num : 13333
```

Как мы можем видеть информация сходиться, также 13333 элементов в коллекции.

Итоговый код `nftcoldata.go`:

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

### [](#nft-6)Какую информацию можно взять по отдельному элементу NFT

Допустим мы хотим получить по адресу элемента коллекции, его контент, допустим ссылку на картинку. И вроде все должно быть просто, дергаем Get-метод и получаем информацию. НО в [соответствии со стандартом NFT в TON](https://github.com/ton-blockchain/TIPs/issues/62), таким образом мы не получим полную ссылку, а лишь часть, так называем индивидуальный контент элемента.

Чтобы получить полный контент(адрес), нужно:

*   по get-методу элемента `get_nft_data()`, получим индекс элемента и индивидуальный контент, а также признак инициализации
*   проверить проинициализирован ли элемент (Подробнее об этом в 10 уроке, где разбирается стандарт NFT)
*   если элемент инициализирован, то по get-методу коллекции `get_nft_content(int index, cell individual_content)`, получим  
    полный контент (полный адрес) по отдельному элементу

### [](#nft-go-7)Достаем информацию о NFT элементе с помощью GO

Адрес элемента, который я буду использовать ниже:

```
UQBzmkmGYAw3qNEQYddY-FjWRPJRjg7Vv2B1Dns3FrERcaRH
```

Попробуем взять информацию об этом элементе NFT.

Установим соединение с лайтсерверами:

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

Вызовем get-метод элемента `get_nft_data()` и выведем в консоль полученную информацию:

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

Помимо информации, которую мы вывели у нас также есть информация о коллекции, получить мы её можем с помощью следующего кода:

```
	// get info about our nft's collection
	collection := nft.NewCollectionClient(api, nftData.CollectionAddress)
```

Осталось проверить инициализирован ли элемент и вызвать get-метод коллекции `get_nft_content(int index, cell individual_content)`, чтобы получить ссылку на элемент.

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

Итоговый код `nftitemdata.go`:

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

По итогу должны получить следующий элемент: [https://nft.animalsredlist.com/nfts/11030.json](https://nft.animalsredlist.com/nfts/11030.json)

## [](#h-8)Деплоим смарт-контракт коллекции

После того как мы научились смотреть информацию о чужих коллекциях и элементах, попробуем задеплоить свою коллекцию и элемент в тестовой сети. Прежде чем двигаться дальше, советую пройти предыдущий урок, так как останавливаться на том как создать кошелек, создать hexBOC форму контракта и деплоить контракт в тестовую сеть здесь я разбирать не буду.

Разберем, что нужно для деплоя коллекции. Первое, что нам необходимо это hеxBOC представление контракта, второе это начальные данные для регистра `с4`.

Начнём со второго, по стандарту определим данные, которые нужно положить в `с4`. Удобно посмотреть на функцию загружающую данные из примера [контракта коллекции](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection.fc).

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

Адресом владельца пускай будет адрес кошелька, который мы будем использовать для деплоя, поэтому адрес передадим в функцию в качестве аругмента:

```
func getContractData(collectionOwnerAddr, royaltyAddr *address.Address) *cell.Cell {

}
```

Также необходимо передать адрес под роялти, который мы будем передавать в параметрах роялти. В данном примере мы не будем устанавливать какие-либо значения роялти и поэтому передадим нули. (Про параметры рояли можно почитать [здесь](https://github.com/ton-blockchain/TEPs/blob/afb3b967db3cf693f1b667f771150056d53944d5/text/0066-nft-royalty-standard.md))

```
func getContractData(collectionOwnerAddr, royaltyAddr *address.Address) *cell.Cell {

	royalty := cell.BeginCell().
		MustStoreUInt(0, 16).
		MustStoreUInt(0, 16).
		MustStoreAddr(royaltyAddr).
		EndCell()

}
```

Теперь соберем часть с контентом, он подразделяется на две ячейки `collection_content` и `common_content` в соответствии со стандартом:

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

Индекс будет равный нулю, а для кода создадим отдельную функцию `getNFTItemCode()`, которая просто будет хранить код контракта отдельного элемента в формате hexBOC. По итогу получаем:

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

Остается только задеплоить контракт:

```
addr, err := w.DeployContract(context.Background(), tlb.MustFromTON("0.02"),
	msgBody, getNFTCollectionCode(), getContractData(w.Address(), nil), true)
if err != nil {
	panic(err)
}
```

Полный код [здесь](https://github.com/xssnick/tonutils-go/blob/master/example/deploy-nft-collection/main.go).

## [](#h-9)Минт элемента в коллекцию

Добавление элемента в коллекцию называется mint. Если посмотреть на [пример контракта коллекции](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection.fc), то можно увидеть, что для минта нового элемента NFT, нужно отправить internal сообщение.

Соответственно:

*   Вызовем get-метод коллекции `get_collection_data()`, чтобы получить нужный нам индекс для минта
*   Вызовем get-метод коллекции `get_nft_address_by_index(int index)`, чтобы получить адрес NFT элемента
*   Соберем полезную нагрузку (Индекс элемента, адрес кошелька, небольшой кол-во TON для , контент)
*   Отправим сообщение на адрес смарт-контракта коллекции с нашей полезной нагрузкой

Начнем, подключаемся к лайтсерверам:

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

“Собираем” кошелек, и делаем вызов `get_collection_data()` для получения индекса:

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

> Важно использовать кошелек, адрес, которого мы положили в `c4` при деплое контракта коллекции иначе при минте, будет возникать ошибка, так как в контракте есть проверка адреса с которого можно минтить (Выглядит так: `throw_unless(401, equal_slices(sender_address, owner_address));`).

Теперь получим адрес элемента вызывав get-метод коллекции `get_nft_address_by_index(int index)`, чтобы получить адрес NFT элемента и приготовим полезную нагрузку:

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

Осталось дело за малым, отправить сообщение от кошелька в смарт-контракт коллекции и вывести данные о нашем элементе (проверим, что все прошло правильно, вызвав get-метод `get_nft_data()` - посмотрим правильная ли информация приходит).

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

Полный код [здесь](https://github.com/xssnick/tonutils-go/blob/master/example/nft-mint/main.go).

## [](#h-10)Задание

Задеплойте свою коллекцию и создайте элемент NFT в тестовой сети, после попробуйте взять информацию о коллекции и элементе, скриптами из начала урока.

## [](#h-11)Заключение

Новые уроки публикую [сюда](https://t.me/ton_learn), на [главной странице](https://github.com/romanovichim/TonFunClessons_ru) есть адрес для донатов, если вдруг вы хотите помочь выпускам новых уроков. Отдельно хочу поблагодарить разработчиков [GitHub - xssnick/tonutils-go: TON SDK Library in pure Golang for interacting with The Open Network ecosystem using native protocols, such as ADNL, RLDP and etc.](https://github.com/xssnick/tonutils-go) , которые делают большое дело.

[github.com](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/golang/15lesson/NFTCollectionDeploy.md)

#### [romanovichim/TonFunClessons\_ru/blob/main/lessons/golang/15lesson/NFTCollectionDeploy.md](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/golang/15lesson/NFTCollectionDeploy.md)

```
# Деплоим NFT коллекцию

## Вступление

В данном уроке мы будем деплоить NFT коллекцию с помощью библиотеки tonutils-go. Чтобы урок качественно покрывал тему деплоя NFT коллекции, мы поступим следующим образом, сначала сделаем запросы к существующий коллекции, таким образом получим примеры, что может храниться в NFT коллекции и её элементе. А потом мы создадим свою NFT коллекцию (совсем тестовую без какого-либо смысла).

Прежде чем переходить к уроку, советую посмотреть предыдущий урок, чтобы понимать, как создается кошелек и деплоятся контракты.

## Получаем информацию о Коллекции и отдельном элементе

Получение информации о коллекции, предполагает выполнение GET запросов к смарт-контракту. В данном уроке, мы будет рассматривать получение информации от смарт-контрактов, соответствующих стандартам. Урок с разбором стандарта NFT [здесь](https://github.com/romanovichim/TonFunClessons_ru/blob/main/10lesson/tenthlesson.md). Сам стандарт, можно найти [здесь](https://github.com/ton-blockchain/TIPs/issues/62).

### Какую информацию можно взять по стандарту коллекции NFT

Смарт-контракт коллекции,соответствующий стандарту, должен реализовывать Get-метод `get_collection_data()` , который вернет адрес владельца коллекции, контент коллекции, и счетчик текущих NFT в коллекции. Функция выглядит так:

	(int, cell, slice) get_collection_data() method_id {
	  var (owner_address, next_item_index, content, _, _) = load_data();
	  slice cs = content.begin_parse();
	  return (next_item_index, cs~load_ref(), owner_address);
```

This file has been truncated. [show original](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/golang/15lesson/NFTCollectionDeploy.md)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 489

[TON Research](/)

# [Efficient smart contract library in Tact language](/t/efficient-smart-contract-library-in-tact-language/489)

[TON Blockchain](/c/ton-blockchain/17) 

    

[Alan](https://tonresear.ch/u/Alan)  February 24, 2024, 6:43am  1

Our team has developed a new smart contract library called TonDynasty Contracts, aimed at accelerating the development of Tact language smart contracts. We provide a variety of reusable, highly customizable traits, implementing multiple TEP standards such as the jetton standard and nft standard. Developers can easily import the library and achieve customized logic requirements by using simple override functions.

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/Ton-Dynasty/tondynasty-contracts)

![](https://tonresear.ch/uploads/default/optimized/1X/dd392d32c672c63cbfa389dc20e259a6730fb8da_2_500x500.jpeg)

### [GitHub - Ton-Dynasty/tondynasty-contracts: Ton-Dynasty Contracts is a library...](https://github.com/Ton-Dynasty/tondynasty-contracts)

Ton-Dynasty Contracts is a library for efficient smart contract development by tact-lang - Ton-Dynasty/tondynasty-contracts

  3 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 49

[TON Research](/)

# [Assessing the Impact of Hetzner's Service Termination on TON Validators: A Comprehensive Analysis](/t/assessing-the-impact-of-hetzners-service-termination-on-ton-validators-a-comprehensive-analysis/49)

[TON Blockchain](/c/ton-blockchain/build-node/21)  [TON Node](/c/ton-blockchain/build-node/21) 

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 2:04pm  1

The recent announcement by Hetzner, a major hosting service provider, to terminate contractual relationships with customers from Russia due to the evolving geopolitical situation, has significant implications for the TON (The Open Network) blockchain ecosystem. Notably, a substantial portion of TON validators, estimated at around 30%, are hosted on Hetzner’s infrastructure. This development raises critical concerns and questions about the resilience and stability of the TON network, given the impending loss of a large number of validators.

This inquiry seeks to analyze and evaluate the potential impacts of Hetzner’s decision on TON validators and the broader TON network, focusing on several key aspects:

1.  **Validator Distribution and Network Decentralization**: How will Hetzner’s decision to end services for Russian-based customers affect the geographical distribution and decentralization of TON validators, considering that a significant percentage is currently hosted on Hetzner’s servers?
2.  **Network Stability and Performance**: What are the potential risks to TON’s network stability and performance, especially in terms of block validation and transaction processing, as a consequence of the sudden unavailability of a substantial number of validators?
3.  **Validator Migration and Contingency Planning**: What strategies and contingency plans can be implemented by affected TON validators to migrate their operations from Hetzner’s infrastructure to other service providers, and what challenges might they encounter in this process?
4.  **Impact on TON’s Governance and Consensus Mechanism**: How might this situation influence TON’s governance structure and consensus mechanism, especially if a significant number of validators are forced offline simultaneously?
5.  **Legal and Regulatory Implications**: What are the legal and regulatory implications of Hetzner’s decision for TON validators, and how might this influence the future regulatory landscape for blockchain networks and validators operating in geopolitically sensitive environments?
6.  **Long-term Effects on TON Ecosystem**: Beyond the immediate impacts, what long-term effects might this situation have on the TON ecosystem, including potential changes in validator dynamics, network security, and user confidence?

This analysis aims to provide a comprehensive understanding of the ramifications of Hetzner’s decision on the TON blockchain network, exploring both immediate and long-term impacts on network stability, validator operations, and overall ecosystem health.

> We regret to inform you that due to the tense geopolitical situation with Russia, we will be ending our contractual relationship with customers from Russia.  
> Political decisions have led to changes in the legal regulations that affect our business with Russian-based customers. Unfortunately, we can no longer have contracts with customers with Russian postal addresses. This will affect everyone with a Russian address stored on Hetzner Accounts.  
> After we analyze the customer databases, we will send the affected customers a notice of termination for all products and services on Friday, 15 December 2023. It will take effect from 31 January 2024. We recommend that you take appropriate measures now.  
> We very much regret the inconvenience, ask for your understanding in this challenging situation, and thank you for your continued cooperation.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 491

[TON Research](/)

# [Recently I saw an interesting game called Squid Game](/t/recently-i-saw-an-interesting-game-called-squid-game/491)

[Application](/c/application/inscription/39)  [Inscription](/c/application/inscription/39) 

    

[ASURADA](https://tonresear.ch/u/ASURADA)   February 28, 2024, 9:31pm  1

# [](#squid-tghttpstmesquidtg_bot-navigating-the-waves-of-blockchain-gaming-1)[Squid tg](https://t.me/squidtg_bot): Navigating the Waves of Blockchain Gaming

[![image](https://tonresear.ch/uploads/default/original/1X/cda31e37dc64c1569f13927f9283515ff93e9f37.jpeg)

image900×600 49.5 KB

](https://tonresear.ch/uploads/default/original/1X/cda31e37dc64c1569f13927f9283515ff93e9f37.jpeg "image")

As a passionate gamer always on the lookout for innovative experiences, I recently dove into the world of [Squid tg](https://t.me/squidtg_bot), a unique idle game that merges blockchain technology with engaging gameplay. [Squid tg](https://t.me/squidtg_bot) stands out as the first Inscription GameFi on the TON blockchain, accessible directly through Telegram. This game offers an intriguing blend of strategy and economics, where players hatch squids, spawn eggs, and trade in a dynamic marketplace.

![](https://tonresear.ch/uploads/default/original/1X/63a026631682e8a364c1dc675ff7181a6e4b8b47.gif)

[https://i.imgur.com/ACPj8G6.gif(image larger than 10 MB)](https://i.imgur.com/ACPj8G6.gif)

**The TON Blockchain Advantage**

One of the reasons [Squid tg](https://t.me/squidtg_bot) caught my attention was its integration with the TON blockchain. This choice ensures efficient, speedy, and scalable gameplay, which is crucial for a seamless experience. The integration with Telegram makes it incredibly accessible, providing a cost-effective and user-friendly environment for gamers like myself.

**Inscriptions Unveiled**

At the heart of [Squid tg](https://t.me/squidtg_bot) are Inscriptions, on-chain information that adds a unique twist to the gameplay. The TON blockchain’s high performance supports these inscriptions, ensuring low transaction costs and fast processing speeds. This integration enhances the gaming experience, making it more enjoyable and engaging.

**How to Play [Squid tg](https://t.me/squidtg_bot)?**

Getting started with [Squid tg](https://t.me/squidtg_bot) is straightforward. You need a Telegram account and a wallet within Telegram to buy and sell assets. There are two types of wallets available: Telegram’s built-in centralized wallet and the self-custody cryptocurrency wallet called TON Space. Setting up these wallets is a breeze, and once done, you’re ready to dive into the game.

[![image](https://tonresear.ch/uploads/default/original/1X/4d1cd566e5468319e710cd3aaa9f99a2efd6af45.jpeg)

image900×600 40.5 KB

](https://tonresear.ch/uploads/default/original/1X/4d1cd566e5468319e710cd3aaa9f99a2efd6af45.jpeg "image")

**Engaging in [Squid tg](https://t.me/squidtg_bot) Gameplay**

The gameplay of [Squid tg](https://t.me/squidtg_bot) is where the real fun begins. You start by minting squids during the public mint period, then hatch squids from eggs, produce more eggs, and profit by selling them. The game has strategic elements, such as deciding when to mint, spawn eggs, and sell them in the marketplace.

**Marketplace Dynamics**

The marketplace is a critical component of [Squid tg](https://t.me/squidtg_bot), where players can sell their stockpiled eggs or buy more to expand their squid empire. Both buying and selling involve a 5% fee, which adds an interesting layer to the trading strategy.

**My Experience with [Squid tg](https://t.me/squidtg_bot)**

Playing [Squid tg](https://t.me/squidtg_bot) has been an exhilarating journey. The blend of strategy, trading, and blockchain technology creates a captivating experience that keeps me coming back for more. Watching my TON balance grow as my squids thrive adds a rewarding element to the game. The evolving landscape of blockchain technology ensures that the game remains fresh and exciting.

In conclusion, [Squid tg](https://t.me/squidtg_bot) is a standout game in the blockchain gaming world. Its integration with the TON blockchain, innovative use of Inscriptions, and dynamic marketplace make it a must-try for any gamer looking for something new and exciting. Whether you’re a seasoned blockchain enthusiast or a casual gamer, [Squid tg](https://t.me/squidtg_bot) offers a unique and rewarding experience that’s worth diving into.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 495

[TON Research](/)

# [TON internal msg sending mode](/t/ton-internal-msg-sending-mode/495)

[TON Blockchain](/c/ton-blockchain/17) 

    

[andrew](https://tonresear.ch/u/andrew)   March 2, 2024, 1:09pm  1

### [](#background-1)一、Background

TON is a “message-driven” asynchronous blockchain network. Each “Message” will be accepted and processed by the designated smart contract, and the processing of each message corresponds to a “Transaction”.

While smart contracts process inbound messages, they may also send out new outbound messages, thus forming a chain of messages.

[![image](https://tonresear.ch/uploads/default/optimized/1X/038889a142af8b48333199e5045aa5ae2e364e19_2_689x136.png)

image1292×256 19.8 KB

](https://tonresear.ch/uploads/default/original/1X/038889a142af8b48333199e5045aa5ae2e364e19.png "image")

When a smart contract sends a new message, there are many issues to consider, such as:

1.  How to handle amounts attached to inbound messages? After deducting the message processing fee, do I need to refund it? How much will be refunded?
2.  If you want to abandon the current contract, how can you accurately remove the remaining balance of the contract through a message?
3.  If you want to transfer a specific amount n to a contract, how to ensure that the amount n will not be used as gas fees, causing the amount to be less than A?
4.  If you want to send multiple messages at once, and some of the notification types have lower priorities, how can you ignore the low-priority message exceptions and ensure that the high-priority messages are sent normally?

### [](#modes-and-flags-2)二、Modes and flags

In FunC’s standard library stdlib.fc, there is a core function send\_raw\_message defined as follows:

`() send_raw_message(cell msg, int mode)`

The mode is used to define the message sending mode, including whether to pay fuel fees separately and how to handle errors. When TON Virtual Machine (TVM) parses and processes messages, it will perform differentiated processing based on the value of mode.

For example, when the mode is set to 1, that is, the SendPayGasSeparately mode is used, which means that the sender’s account will pay the gas fee separately to ensure that the value of the message is completely delivered to the recipient.

What is easily confusing here is that the value of the mode parameter has two variables, namely mode and flag.

[![image](https://tonresear.ch/uploads/default/optimized/1X/4be7e9baaaa50236c93cbfdaae15a56307ffeb50_2_690x394.png)

image1760×1006 160 KB

](https://tonresear.ch/uploads/default/original/1X/4be7e9baaaa50236c93cbfdaae15a56307ffeb50.png "image")

To briefly summarize, mode and flag have different functions.

*   **mode** : Defines the basic behavior of message sending, such as whether to carry balance, whether to wait for message processing results, etc. Different values of mode represent different sending characteristics, and different values can be combined to meet specific sending requirements.
*   **flag** : As a complement to mode, it is used to adjust specific behaviors of messages, such as paying transfer fees separately or ignoring processing errors. The flag is added to the mode to construct the final message sending mode.

When using the send\_raw\_message function, it is important to choose the appropriate mode and flag combination according to your needs. As in the scenario below, you can combine them by simply adding patterns and flags together.

*   If you want to send regular messages and pay for transfers separately, use Mode 0 and Flag +1 to get mode = 1 .
*   If you want to send the entire contract balance and destroy it immediately, use Mode 128 and Flag +32 to get mode = 160 .

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 4975

[TON Research](/)

# [SNOOPYBABE \[$SBABET\] - The Open League Application](/t/snoopybabe-sbabet-the-open-league-application/4975)

[The Open League](/c/the-open-league/56) 

    

[SnoopyBabe](https://tonresear.ch/u/SnoopyBabe)   April 3, 2024, 8:10pm  1

[![1500x500](https://tonresear.ch/uploads/default/optimized/2X/3/3ddfab5f743b31e1fc8ee7bddc20bc9227687e41_2_690x230.jpeg)

1500x5001500×500 91.5 KB

](https://tonresear.ch/uploads/default/original/2X/3/3ddfab5f743b31e1fc8ee7bddc20bc9227687e41.jpeg "1500x500")

## [](#project-name-1)Project Name

SnoopyBabe

## [](#projects-website-2)Project’s Website

![](https://tonresear.ch/uploads/default/original/2X/8/89c501a3d07f147cd9ecb3570cd8246f3a2a4782.png) [SnoopyBabe is not just a meme project dedicated to the cutest living cat from...](https://snoopybabe.com/)

![](https://tonresear.ch/uploads/default/optimized/2X/a/a01ad0b6fb3fef67db4e7c29d315e3053d4d178a_2_690x388.jpeg)

### [SnoopyBabe is not just a meme project dedicated to the cutest living cat from...](https://snoopybabe.com/)

Our team is working on developing a useful ecosystem closely related to Web3. Our two tokens $SBABE (SOL) AND $SBABET (TON) will connect two networks in one big and useful ecosystem

## [](#projects-twitter-3)Project’s Twitter

[https://twitter.com/SnoopyBabe\_meme](https://twitter.com/SnoopyBabe_meme)

## [](#projects-telegram-group-4)Project’s Telegram Group:

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/snoopy_babe)

![](https://tonresear.ch/uploads/default/original/2X/9/92a0c72289010eb3e9cdc5b3f0f0881623fca631.jpeg)

### [SnoopyBabe Portal](https://t.me/snoopy_babe)

SnoopyBabe is not just a meme project. 🌆Ecosystem: SnoopyBabe TON Tools |SnoopyBabe SOL Tools |SnoopyBabe Play|New types of Web3 ecosystem coming soon 🐈 Website: https://snoopybabe.com 🐦 Twitter: https://twitter.com/SnoopyBabe\_meme

## [](#link-to-the-tokens-page-on-dyor-5)Link to the token’s page on DYOR:

![](https://tonresear.ch/uploads/default/original/2X/d/dccf25310e09f93b8643b6af50a2d9696cfe880e.png) [dyor.io](https://dyor.io/ru/token/EQBuA-_rhkzLmOktImllkrbniTh-jT4EHwS9ujv_rWvBl1Dp)

![](https://tonresear.ch/uploads/default/optimized/2X/b/b826500d1ea599b9a15cbb37efa203b130ae8664_2_690x362.jpeg)

### [SNOOPYBABE (SBABET) Token Price - DYOR.ninja](https://dyor.io/ru/token/EQBuA-_rhkzLmOktImllkrbniTh-jT4EHwS9ujv_rWvBl1Dp)

## [](#your-name-6)Your name:

Snoopybabedev

## [](#your-telegram-handle-7)Your Telegram handle:

@Snoopybabedev

## [](#other-snoopybabe-official-links-and-info-8)Other SnoopyBabe Official links and info:

## [](#blue_bookgitbook-9)![:blue_book:](https://tonresear.ch/images/emoji/twitter/blue_book.png?v=12 ":blue_book:")Gitbook:

![](https://tonresear.ch/uploads/default/optimized/2X/0/0c78b85b4e8cf8d810352e4b0c9d50ba794b6246_2_495x500.png) [docs.snoopybabe.com](https://docs.snoopybabe.com/sbabe)

![](https://tonresear.ch/uploads/default/original/2X/4/43e8cf3982ccf23723c66b50e36baeaf8dfabf2b.png)

### [Welcome to SnoopyBabe | SnoopyBabe](https://docs.snoopybabe.com/sbabe)

SnoopyBabe is launching its ecosystem and expanding its features towards WEB3. Our ecosystem will only grow: SnoopyBabe TON Tools, SnoopyBabe SOL Tools, SnoopyBabe Play, New WEB3 types coming soon

## [](#open_book-white-paper-v30-10)![:open_book:](https://tonresear.ch/images/emoji/twitter/open_book.png?v=12 ":open_book:") White Paper V3.0

[snoopybabe.com](https://snoopybabe.com/Snoopy_Whitepaper.pdf)

[](https://snoopybabe.com/Snoopy_Whitepaper.pdf)

### [Snoopy\_Whitepaper.pdf](https://snoopybabe.com/Snoopy_Whitepaper.pdf)

15.57 MB

## [](#robot-our-useful-launched-web3-ecosystem-on-ton-11)![:robot:](https://tonresear.ch/images/emoji/twitter/robot.png?v=12 ":robot:") Our Useful Launched Web3 Ecosystem on Ton:

**SnoopyBabe TON Tools:** Our bot will be useful for all investors in the TON network.  
Get customizable price change notifications for any asset on Ton, Check New Contract and you can already buy SBABET on StonFI without leaving Telegram.  
Top 3 Utilities on the TON app:

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/utilities/ton-tools-bot?id=1546)

### [TON Tools Bot - Alerts On Price Changes, Wallet's Activity And Balances,...](https://ton.app/utilities/ton-tools-bot?id=1546)

🤖 SnoopyBabe TON Tools V1.0 We have developed and are launching SnoopyBabe TON Tools. Our bot will be useful for all investors in the TON network. Investors will be able to receive customizable price change alerts to make a timely decision to sell...

**SnoopyBabe Sbabet\_bot Buy for Launchpads:** Our super useful tool is designed specifically for the B2B sector, our bot will help your project to complete your presale on any Launchpad successfully!

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/utilities/sbabet-buybot?id=1563)

### [SBABET BuyBot - BuyBot for Launchpads on TON network | TON App](https://ton.app/utilities/sbabet-buybot?id=1563)

SnoopyBabe BuyBot for Launchpads - Our super useful tool is designed specifically for the B2B sector, our bot will help your project to complete your presale on any Launchpad successfully! SnoopyBabe Sbabet\_bot Buy for Launchpads: - We customize...

## [](#chart_with_upwards_trend-sbabet-market-12)![:chart_with_upwards_trend:](https://tonresear.ch/images/emoji/twitter/chart_with_upwards_trend.png?v=12 ":chart_with_upwards_trend:") $SBABET Market:

**Ston Fi:**

![](https://tonresear.ch/uploads/default/original/2X/5/585226420d316cc1c3526fbe1ad931b4f51c0be2.png) [app.ston.fi](https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQBuA-_rhkzLmOktImllkrbniTh-jT4EHwS9ujv_rWvBl1Dp)

### [STON.fi](https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQBuA-_rhkzLmOktImllkrbniTh-jT4EHwS9ujv_rWvBl1Dp)

DEX for the TON blockchain

## [](#lock-lp-locked-1-year-13)![:lock:](https://tonresear.ch/images/emoji/twitter/lock.png?v=12 ":lock:") LP LOCKED 1 YEAR:

[https://tonraffles.app/lock/EQBcnfcZNQ21oPxs55OV2V5V6TYhPlgrL2CCyFZFdUPOYeOQ/EQCGYbS75DiLd66sEqzyzNiDmiiEKj\_t1m-km785kHxDvwd6](https://tonraffles.app/lock/EQBcnfcZNQ21oPxs55OV2V5V6TYhPlgrL2CCyFZFdUPOYeOQ/EQCGYbS75DiLd66sEqzyzNiDmiiEKj_t1m-km785kHxDvwd6)

## [](#link-other-linksinfo-14)![:link:](https://tonresear.ch/images/emoji/twitter/link.png?v=12 ":link:") OTHER LINKS&INFO:

Our project is launched on two networks SBABET (TON) and SBABE (SOLANA). Our team is working on developing a useful ecosystem closely related to Web3. We are combining two of the most promising blockchains in our large and useful ecosystem. No empty words and promises, just real working apps and announcements before their release.

**SnoopyBabe TON Tools:**

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/sbabet_tools_bot)

![](https://tonresear.ch/uploads/default/original/2X/8/86329e0f9727d9487b535126388d0b67e80fbd13.jpeg)

### [TON Tracker | SnoopyBabe Tools](https://t.me/sbabet_tools_bot)

😻 SnoopyBabe TON Tools 😼 Monitoring Alerts on price changes ⚙️ Powered by @snoopy\_babe

**SnoopyBabe Buy Bot for Launchpads:**

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/sbabet_bot)

![](https://tonresear.ch/uploads/default/original/2X/0/0fc8af2da5471437814c85d4c42ca74b3b9865ea.jpeg)

### [SBABET BuyBot](https://t.me/sbabet_bot)

🔝Sbabet\_bot Buy for Launchpads: useful Bot for all New projects on TON 👉To order: @Snoopybabeadmin or @snoopybabecto

**SnoopyBabe SOL Tools**

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/sbabe_tools_bot)

![](https://tonresear.ch/uploads/default/original/2X/d/d157b56812727b0a0fc406918684ca5f15bc48e2.jpeg)

### [SOL Tracker | SnoopyBabe Tools](https://t.me/sbabe_tools_bot)

😻 SnoopyBabe SOL Tools 😼 Monitoring Alerts on price changes ⚙️ Powered by @snoopy\_babe

## [](#metrics-15)Metrics:

![](https://tonresear.ch/uploads/default/original/2X/6/634d2ca8e408bed765ed29de6b9d29d55e817cab.png) [geckoterminal.com](https://www.geckoterminal.com/ton/pools/EQBcnfcZNQ21oPxs55OV2V5V6TYhPlgrL2CCyFZFdUPOYeOQ)

![](https://tonresear.ch/uploads/default/optimized/2X/0/06530047bfd1d6a7a8869faaa6c982a10e469424_2_690x388.png)

### [SBABET/TON - SNOOPYBABE Price on Ston.fi | GeckoTerminal](https://www.geckoterminal.com/ton/pools/EQBcnfcZNQ21oPxs55OV2V5V6TYhPlgrL2CCyFZFdUPOYeOQ)

SBABET/TON price today is $0.0002117 with a 24-hour trading volume of $48,204.04. SNOOPYBABE contract address is EQBuA...l1Dp with $82,476.39 in liquidity.

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  23 Likes

[Olivia\_Stone](https://tonresear.ch/u/Olivia_Stone) April 4, 2024, 12:10pm  2

Good project! Perfect!!!

  3 Likes

[Aarya\_Kc](https://tonresear.ch/u/Aarya_Kc) April 4, 2024, 12:49pm  3

Best of the best content.

  1 Like

[Fatema\_Tuj](https://tonresear.ch/u/Fatema_Tuj) April 4, 2024, 12:49pm  4

That’s really impressive

 

[Fatma\_Zalamboha](https://tonresear.ch/u/Fatma_Zalamboha) April 4, 2024, 12:49pm  5

It was a good time reading this valuable topic

 

[sharmita\_simu](https://tonresear.ch/u/sharmita_simu) April 4, 2024, 12:50pm  6

great to watch ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:") ![:green_heart:](https://tonresear.ch/images/emoji/twitter/green_heart.png?v=12 ":green_heart:")

 

[Targut](https://tonresear.ch/u/Targut) April 4, 2024, 12:50pm  7

Wow bes project, my favourite project best wishes for the project

 

[nethula\_lakshan](https://tonresear.ch/u/nethula_lakshan) April 4, 2024, 12:51pm  8

Amazing! I love it. Good luck!

 

[Batang\_Gamhanan](https://tonresear.ch/u/Batang_Gamhanan) April 4, 2024, 12:51pm  9

hi project will moon soon, for they are hard working ang trustworthy team.

 

[woop\_vook](https://tonresear.ch/u/woop_vook) April 4, 2024, 12:51pm  10

wow amazing and oustanding project

 

[Tina\_Dutta](https://tonresear.ch/u/Tina_Dutta) April 4, 2024, 12:51pm  11

Nice post.great information

 

[Majidu\_Khan](https://tonresear.ch/u/Majidu_Khan) April 4, 2024, 12:52pm  12

i like this project!

 

[Top\_Player](https://tonresear.ch/u/Top_Player) April 4, 2024, 12:52pm  13

nice project i like it

 

[chand\_awan](https://tonresear.ch/u/chand_awan) April 4, 2024, 12:52pm  14

This is Really Nice Project, I Just Love it

  1 Like

[Mero\_Adel](https://tonresear.ch/u/Mero_Adel) April 4, 2024, 12:52pm  15

Grate product I have seen

 

[Meliodas\_Acrman](https://tonresear.ch/u/Meliodas_Acrman) April 4, 2024, 12:52pm  16

The project is great and I see success in it from now on

 

[Armstrong.Leora](https://tonresear.ch/u/Armstrong.Leora) April 4, 2024, 12:52pm  17

Great project with strong team. Let’s create a strong community

  1 Like

[Vivek\_Kushwah](https://tonresear.ch/u/Vivek_Kushwah) April 4, 2024, 12:52pm  18

very nice project i like it very much

 

[Mohamed\_Nageeb](https://tonresear.ch/u/Mohamed_Nageeb) April 4, 2024, 12:53pm  19

amazing project it’s really imoressive

 

[Michael\_Warburton](https://tonresear.ch/u/Michael_Warburton) April 4, 2024, 12:53pm  20

SNOOPYBABE \[$SBABET\] - The Open League Application is an innovative and engaging project that brings a fresh approach to the world of sports betting. With its user-friendly interface and intuitive design, this application makes it easy for users to participate in various leagues and competitions, all while enjoying a seamless betting experience. The platform’s transparency and commitment to fair play ensure that users can trust the results and outcomes. Overall, SNOOPYBABE \[$SBABET\] offers a dynamic and enjoyable way for sports enthusiasts to engage with their favorite games and teams, making it a must-try for anyone looking for excitement in the world of sports betting

 

**[next page →](/t/snoopybabe-sbabet-the-open-league-application/4975?page=2)**

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 5

[TON Research](/)

# [Welcome to TON Research: A Professional Forum for TON Blockchain Enthusiasts](/t/welcome-to-ton-research-a-professional-forum-for-ton-blockchain-enthusiasts/5)

[General](/c/general/4) 

    

[system](https://tonresear.ch/u/system)  October 20, 2023, 2:55am  1

Welcome to TON Research, the premier forum dedicated to the TON Blockchain community! We are thrilled to have you join our ranks of professionals, developers, and enthusiasts in the ever-evolving world of TON Blockchain. Here’s how you can dive into the heart of our community:

1.  **Introduce Yourself**: Make your mark in the TON Research community! Go to [your profile](/my/preferences/account) and add a personal touch with your photo and a brief intro about yourself. Share your interests and expertise in TON Blockchain – what’s one conversation starter you’d love to be approached with?
    
2.  **Engage with the Community**: Discover the pulse of TON Research by [exploring ongoing discussions](/top). Our forum is bustling with insightful conversations, breakthrough ideas, and intriguing debates. When a post resonates with you, don’t hesitate to express your appreciation or agreement with a ![:heart:](https://tonresear.ch/images/emoji/twitter/heart.png?v=12 ":heart:")!
    
3.  **Active Participation**: Your voice matters here. Whether it’s by commenting, providing your unique viewpoint, posing thought-provoking questions, or offering constructive feedback, your contributions enrich our collective understanding. Familiarize yourself with our [Community Guidelines](/faq) to ensure your interactions are in harmony with our forum’s ethos.
    
4.  **Feedback and Support**: Got a question, suggestion, or need assistance? The [Site Feedback](/c/site-feedback/2) section is your go-to place for any inquiries or ideas you might have. Alternatively, feel free to [reach out to our admin team](/about) for more personalized support.
    

We’re excited to see the value and insights you bring to TON Research. Let’s collaboratively push the boundaries of TON Blockchain knowledge and innovation!

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 50

[TON Research](/)

# [Optimizing and Securing TON Blockchain Multisig Contract: A Technical Analysis and Improvement Suggestions](/t/optimizing-and-securing-ton-blockchain-multisig-contract-a-technical-analysis-and-improvement-suggestions/50)

[Application](/c/application/20) 

[multisig](https://tonresear.ch/tag/multisig)

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 2:05pm  1

In the domain of blockchain technology, multisignature (multisig) wallets serve as critical tools for enhancing security and flexibility in managing digital assets. The TON blockchain multisig contract, particularly in its original format, introduces specific functionalities and challenges that warrant detailed examination. Recent modifications to its FunC code and interaction scripts have aimed to address certain vulnerabilities and inefficiencies, making it imperative to understand these changes and their implications for users and developers.

This inquiry seeks to dissect and analyze the TON blockchain multisig contract, focusing on several key aspects:

1.  **Code Modifications and Their Rationale**: What specific changes were made to the original FunC code of the TON blockchain multisig contract, including the rationale behind these modifications, particularly regarding the additional checks for proposed queries and bug fixes?
2.  **Functional Overview of the (n, k)-Multisig Wallet**: Can you provide a detailed description of the (n, k)-multisig wallet’s functionality, including its unique features compared to other blockchain multisig wallets, such as the handling of orders with less than k signatures and the capability to control the wallet solely with keys?
3.  **Risk Assessment of Multisig Wallet Usage**: What are the risks associated with using the TON blockchain multisig wallet, particularly concerning the potential for out-of-gas credit exceptions due to excessive non-expired orders?
4.  **Compilation and Script Execution Procedures**: How should the multisig contract be compiled effectively, and what are the recommended practices for running the various scripts, such as new-key.fif, generate-keypairs.fif, and create-msg.fif, to ensure accurate and secure operations?
5.  **Order Creation and Signature Management**: What are the steps involved in creating a new order with create-order.fif script, adding signatures with add-signature.fif, and managing signature lists for ensuring the integrity and authenticity of orders?
6.  **External Message Creation and Order Processing**: How is the external message created using create-external-message.fif script, and what role does the private key play in this process? Additionally, what are the implications for order processing and execution within the multisig contract?
7.  **Tools for Signature and Order Verification**: What functionalities do scripts like clear-signatures.fif, show-signed-by.fif, show-msg.fif, and show-order.fif offer in terms of managing and verifying signatures and orders in the multisig contract?

This comprehensive analysis aims to explore the technical intricacies and improvements of the TON blockchain multisig contract, enhancing understanding for users and developers seeking to leverage its capabilities for secure and efficient digital asset management.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 504

[TON Research](/)

# [Awesome TON (The Open Network)](/t/awesome-ton-the-open-network/504)

[General](/c/general/4) 

    

[doge](https://tonresear.ch/u/doge)  March 3, 2024, 7:30pm  1

# [](#p-591-awesome-ton-the-open-network-1)Awesome TON (The Open Network)

[![Ton Research](https://img.shields.io/badge/TON%20Research-0098EA?style=flat&logo=discourse&label=Forum&labelColor=gray)](https://tonresear.ch) [![Telegram Foundation Group](https://img.shields.io/badge/TON%20Foundation-0098EA?logo=telegram&logoColor=white&style=flat)](https://t.me/tonblockchain) [![Twitter Group](https://img.shields.io/twitter/follow/ton_blockchain)](https://twitter.com/ton_blockchain)

Welcome to Awesome TON - a carefully curated compendium of standout libraries, tools, services, protocols, and smart contracts associated with the TON ecosystem.

* * *

## [](#p-591-official-resources-2)![:classical_building:](https://tonresear.ch/images/emoji/twitter/classical_building.png?v=12 ":classical_building:") Official Resources

*   [Documentation](https://docs.ton.org/)
*   [Community Blog](https://blog.ton.org/)
*   [Hackathons & Contests](https://ton.org/events)
*   [List of Vacancies](https://jobs.ton.org/)
*   [TON Community on Telegram](https://t.me/toncoin)

* * *

## [](#p-591-education-3)![:mortar_board:](https://tonresear.ch/images/emoji/twitter/mortar_board.png?v=12 ":mortar_board:") Education

### [](#p-591-basic-theory-4)Basic Theory

*   [The Open Network](https://docs.ton.org/learn/introduction)
*   [What is Blockchain? What is a Smart Contract? What is Gas?](https://blog.ton.org/what-is-blockchain)
*   [Smart Contract Addresses](https://docs.ton.org/learn/overviews/addresses)
*   [Six Unique Aspects of TON Blockchain for Solidity Developers](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers)
*   [TON Sites, TON WWW, TON Proxy](https://blog.ton.org/ton-sites)

### [](#p-591-youtube-educational-videos-5)YouTube Educational Videos

*   TON Development Courses
    
    *   [TON Dev Study](https://www.youtube.com/@WikiMar/playlists)
        *   English
            *   [FunC & Blueprint](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg)
            *   [TON with Fift](https://www.youtube.com/playlist?list=PLyDBPwv9EPsB47mqzF4Z9K8k6HYqPv6Px)
            *   [TON with Python](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDrQUyuHTsKRzxg6XaTPzhh)
            *   [Tact & Blueprint](https://www.youtube.com/@AlefmanVladimirEN-xb4pq/videos)
        *   Russian
            *   [FunC & Blueprint](https://www.youtube.com/playlist?list=PLyDBPwv9EPsA5vcUM2vzjQOomf264IdUZ)
            *   [TON Connect Integration](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)
            *   [TON with Python](https://www.youtube.com/playlist?list=PLyDBPwv9EPsC-7xbn8b8noZh9a1Xkg42W)
            *   [TON with GO](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCV-GifFVIQ1o3t35j1nj-u)
            *   [TON with Fift](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCYG-hR4N5FRTKUkfM8POgh)
*   Community Channels
    
    *   [TON & Company](https://www.youtube.com/@ton-company/featured)
    *   [TON Dev Moscow](https://www.youtube.com/@tondevmoscow/featured)
    *   [TON - The Open Network](https://www.youtube.com/@the_open_network/featured)
    *   [DoraHacks Workshops](https://www.youtube.com/playlist?list=PLpkpEL9gYGez8hCtzMtOabQPX9bgYLZPN)

### [](#p-591-community-tutorials-6)Community Tutorials

*   Smart Contracts
    *   [TON Speedrun](https://tonspeedrun.com/)
        *    [![:triangular_flag_on_post:](https://tonresear.ch/images/emoji/twitter/triangular_flag_on_post.png?v=12 ":triangular_flag_on_post:") Challenge 1: Simple NFT Deploy](https://github.com/romanovichim/TONQuest1)
        *    [![:triangular_flag_on_post:](https://tonresear.ch/images/emoji/twitter/triangular_flag_on_post.png?v=12 ":triangular_flag_on_post:") Challenge 2: Chatbot Contract](https://github.com/romanovichim/TONQuest2)
        *    [![:triangular_flag_on_post:](https://tonresear.ch/images/emoji/twitter/triangular_flag_on_post.png?v=12 ":triangular_flag_on_post:") Challenge 3: Jetton Vending Machine](https://github.com/romanovichim/TONQuest3)
        *    [![:triangular_flag_on_post:](https://tonresear.ch/images/emoji/twitter/triangular_flag_on_post.png?v=12 ":triangular_flag_on_post:") Challenge 4: Lottery/Raffle](https://github.com/romanovichim/TONQuest4)
        *    [![:triangular_flag_on_post:](https://tonresear.ch/images/emoji/twitter/triangular_flag_on_post.png?v=12 ":triangular_flag_on_post:") Challenge 5: Create UI to Interact with the Contract in 5 Minutes](https://github.com/romanovichim/TONQuest5)
        *    [![:triangular_flag_on_post:](https://tonresear.ch/images/emoji/twitter/triangular_flag_on_post.png?v=12 ":triangular_flag_on_post:") Challenge 6: Analyzing NFT Sales on Getgems Marketplace](https://github.com/romanovichim/TONQuest6)
    *   [Get Started with TON](https://docs.ton.org/develop/onboarding-challenge)
    *   [How to Build Your First DApp on TON](https://docs.tonxapi.com/reference/build-your-first-dapp)
    *   TON Community Hello World
        *   [Step-by-Step Guide for Working with Your First TON Wallet](https://ton-community.github.io/tutorials/01-wallet/)
        *   [Step-by-Step Guide for Writing Your First Smart Contract](https://ton-community.github.io/tutorials/02-contract/)
        *   [Step-by-Step Guide for Building Your First Web Client](https://ton-community.github.io/tutorials/03-client/)
        *   [Step-by-Step Guide for Testing Your First Smart Contract](https://ton-community.github.io/tutorials/04-testing/)
    *   [Func Journey](https://blog.ton.org/func-journey)
    *   FunC @romanovichim Lessons
        *   [TonFunClessons\_Eng](https://github.com/romanovichim/TonFunClessons_Eng)
        *   [TonFunClessons\_ru](https://github.com/romanovichim/TonFunClessons_ru)
    *   [Learn Func in 10 Minutes](https://learnxinyminutes.com/docs/func/)
    *   [How to Work with Wallet Smart Contracts](https://docs.ton.org/develop/smart-contracts/tutorials/wallet)
    *   [How to Make a Simple Multisig Contract](https://docs.ton.org/develop/smart-contracts/tutorials/multisig)
    *   [Unlocking the Power of TON with Rift Framework](https://blog.ton.org/rift-announcement)
    *   [Interact with Multisig Wallets Using TypeScript](https://docs.ton.org/develop/smart-contracts/tutorials/multisig-js)
*   FT (Jettons) & NFT
    *   [Step-by-Step NFT Collection Minting](https://docs.ton.org/develop/dapps/tutorials/collection-minting)
    *   [Mint Your First Jetton](https://docs.ton.org/develop/dapps/tutorials/jetton-minter)
*   Telegram Bot
    *   [Storefront Bot with Payments in TON](https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot)
    *   [Bot with Own Balance](https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-2)
    *   [Bot for Sales of Dumplings](https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-js)
*   TON Connect
    *   [Integration Manual](https://docs.ton.org/develop/dapps/ton-connect/integration)
    *   [Telegram Bot Integration](https://docs.ton.org/develop/dapps/ton-connect/tg-bot-integration)
    *   [Sending Messages](https://docs.ton.org/develop/dapps/ton-connect/transactions)

### [](#p-591-smart-contract-examples-7)Smart Contract Examples

*   [Smart Contract Examples](https://docs.ton.org/develop/smart-contracts/examples)

### [](#p-591-guidelines-8)Guidelines

*   Development Guidelines
    
    *   Smart Contracts
        
        *   [Development Overview](https://docs.ton.org/develop/smart-contracts/guidelines)
    *   Asset Processing
        
        *   [Payments Processing](https://docs.ton.org/develop/dapps/asset-processing/)
        *   [Jetton Processing](https://docs.ton.org/develop/dapps/asset-processing/jettons)
        *   [NFT Processing](https://docs.ton.org/develop/dapps/asset-processing/nfts)
        *   [Metadata Parsing](https://docs.ton.org/develop/dapps/asset-processing/metadata)
    *   TON Connect
        
        *   [Developer Guide](https://docs.ton.org/develop/dapps/ton-connect/developers)
        *   [Wallet Integration](https://docs.ton.org/develop/dapps/ton-connect/protocol/wallet-guidelines)
        *   [Protocol Workflow](https://docs.ton.org/develop/dapps/ton-connect/protocol/workflow)
*   API Documentation
    
    *   [Chainstack API Reference](https://docs.chainstack.com/reference/getting-started-ton) - Interactive v2/v3 API docs with examples.

* * *

## [](#p-591-get-coding-9)![:technologist:](https://tonresear.ch/images/emoji/twitter/technologist.png?v=12 ":technologist:") Get Coding

### [](#p-591-dev-tools-10)Dev Tools

*   Development
    
    *   [Blueprint](https://github.com/ton-community/blueprint/) - Development environment for smart contracts.
    *   [Rift](https://github.com/sky-ring/rift) - Python framework for smart contracts.
    *   [Tact](https://tact-lang.org/) - High-level language for smart contracts.
    *   [ton-k8s](https://github.com/disintar/ton-k8s) - Self-hosted TON network with Docker.
*   Testing
    
    *   [Testnet Faucet](https://t.me/testgiver_ton_bot) - Bot for testnet TON.
    *   [TONX Testnet Faucet](https://faucet.tonxapi.com/) - Test without real tokens.
    *   [Chainstack TON faucet](https://faucet.chainstack.com/ton-testnet-faucet) - Daily TON refills.
    *   [TON Dev Wallet](https://github.com/TonDevWallet/TonDevWallet) - Developer wallet.
*   IDE Support
    
    *   [VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)
    *   [IntelliJ IDEs Plugin](https://plugins.jetbrains.com/plugin/23382-ton)
    *   [Sublime Text Plugin](https://github.com/savva425/func_plugin_sublimetext3)
*   API Services
    
    *   [TONX API](https://www.notion.so/TONX-TONX-API-TONX-Lab-f9e86e5382604c6193a2ef2243b283fc?pvs=21) - Complete API platform with 99.99% uptime.
    *   [Chainstack](https://chainstack.com/build-better-with-ton/) - RPC nodes with geo balancing.
    *   [toncenter.com](https://toncenter.com/) - Fast and reliable HTTP API.
    *   [dton.io/graphql](https://dton.io/graphql) - GraphQL API.
    *   [tonapi.io](https://tonapi.io/) - API service.
    *   [anton.tools](https://anton.tools/) - API tools.
*   Telegram Web Apps (TWAs)
    
    *   [Official Documentation](https://core.telegram.org/bots/webapps)
    *   [Community Documentation](https://docs.telegram-mini-apps.com/)
    *   [ton-community/twa-template](https://github.com/ton-community/twa-template) - TWA template with TON.
    *   [twa-dev/boilerplate](https://github.com/twa-dev/Boilerplate) - TWA boilerplate.
    *   [twa-dev/sdk](https://github.com/twa-dev/sdk) - TWA SDK package.
    *   [twa-dev/Mark42](https://github.com/twa-dev/Mark42) - UI library for TWA.

### [](#p-591-libraries-11)Libraries

*   JavaScript/TypeScript
    
    *   [TONX.JS](https://github.com/frigatebird-studio/TONX.js) - JS integration for TONX API.
    *   [ton-core/ton](https://github.com/ton-core/ton) - Cross-platform client by ton-core.
    *   [toncenter/tonweb](https://github.com/toncenter/tonweb) - Cross-platform client by TonCenter.
    *   [orbs-network/ton-access](https://github.com/orbs-network/ton-access) - Unthrottled RPC access.
    *   [foton](https://github.com/VanishMax/foton) - Toolkit for TON dApps development.
*   Python
    
    *   [disintar/tonpy](https://github.com/disintar/tonpy) - SDK with TLB support and TVM.
    *   [yungwine/pytoniq](https://github.com/yungwine/pytoniq) - SDK with LiteClient and TLB.
    *   [tonfactory/tonsdk](https://github.com/tonfactory/tonsdk) - Cells and contract wrappers.
    *   [toncenter/pytonlib](https://github.com/toncenter/pytonlib) - Tonlib wrapper.
    *   [yungwine/TonTools](https://github.com/yungwine/TonTools) - High-level library for HTTP/ADNL.
*   Other Languages
    
    *   Go
        *   [xssnick/tonutils-go](https://github.com/xssnick/tonutils-go) - Go SDK.
        *   [tonkeeper/tongo](https://github.com/tonkeeper/tongo) - Go SDK.
        *   [ton-blockchain/tonlib-go](https://github.com/ton-blockchain/tonlib-go) - Golang TonLib wrapper.
    *   [tonutils-dart](https://github.com/novusnota/tonutils-dart) - Dart/Flutter SDK.
    *   [tonlib-rs](https://github.com/ston-fi/tonlib-rs) - Rust SDK.
    *   [SwiftyTON](https://github.com/labraburn/SwiftyTON) - Swift SDK with async/await.
    *   [node-tonlib](https://github.com/labraburn/node-tonlib) - Node.js C++ addon.
    *   [ton-kotlin](https://github.com/andreypfau/ton-kotlin) - Kotlin SDK.
    *   [TonSdk.NET](https://github.com/continuation-team/TonSdk.NET) - C# (.NET, Unity) SDK.

### [](#p-591-get-help-12)Get Help

*   Community Support
    
    *   [TON Overflow](https://answers.ton.org) - Q&A platform for developers.
    *   [TON Dev Chat](https://t.me/tondev_eng) - English developer community.
    *   [TON 开发者社区](https://t.me/tondev_zh) - Chinese developer community.
    *   [TON Разработка](https://t.me/tondev) - Russian developer community.
*   Documentation
    
    *   [TON Learn](https://docs.ton.org/learn/) - Learning resources and guides.
    *   [TON API References](https://docs.ton.org/reference/) - API documentation.

* * *

## [](#p-591-projects-13)![:card_index_dividers:](https://tonresear.ch/images/emoji/twitter/card_index_dividers.png?v=12 ":card_index_dividers:") Projects

Moved to [ton-society/ecosystem-map](https://github.com/ton-society/ecosystem-map).

* * *

## [](#p-591-authentication-14)![:globe_with_meridians:](https://tonresear.ch/images/emoji/twitter/globe_with_meridians.png?v=12 ":globe_with_meridians:") Authentication

*   [Ton Connect](https://github.com/ton-connect/) - Standard protocol for communication between wallets and apps.
*   [delab-team/connect](https://github.com/delab-team/connect) - SDK that combines multiple protocols in one modal.
*   [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk) - JS SDK for TON Connect 2.0.
*   [pytonconnect](https://pypi.org/project/pytonconnect/) - Python SDK for TON Connect 2.0.
*   [darttonconnect](https://github.com/romanovichim/dartTonconnect) - Dart SDK for TON Connect 2.0.

* * *

## [](#p-591-utilities-15)![:control_knobs:](https://tonresear.ch/images/emoji/twitter/control_knobs.png?v=12 ":control_knobs:") Utilities

*   [TonStat.com](https://www.tonstat.com/) - Key Metrics of TON Ecosystem.
*   [Tonutils Proxy](https://github.com/xssnick/Tonutils-Proxy) - User-friendly TON Proxy implementation.
*   [vaniton](https://github.com/AntonMeep/vaniton) - Vanity address generator for TON standard wallets.
*   [custon](https://github.com/TON-NFT/custon) - Custom TON wallet address generator in JavaScript.
*   [TON Grafana](https://tonmon.xyz/) - Blockchain metrics visualization tool.
*   [TON Notify Bot](https://t.me/TONNotifyBot) - Telegram bot for TON address transaction notifications.
*   [Blockchain Network Visualizer](https://github.com/qpwedev/blockchain-network-visualizer) - Tool for visualizing TON blockchain network.
*   [Anonymous Numbers Market Analytics](https://github.com/qpwedev/anonymous-numbers-market-analytics) - Fragment market Anonymous Numbers statistics bot.
*   [TON Multisender](https://ton.multisender.app/) - Tool for batch sending Jettons and TON to multiple addresses.
*   [TON Bulksender](https://ton.bulksender.app) - TON Bulksender App is a tool that lets you efficiently bulk send TON or Jettons to thousands of recipients in seconds, helping users save time by automatically generating transactions on a TON web3 wallet.

* * *

## [](#p-591-uxui-16)![:man_artist:](https://tonresear.ch/images/emoji/twitter/man_artist.png?v=12 ":man_artist:") UX/UI

*   Design Systems
    *   [TON Design System](https://github.com/designervoid/ton-design-system) - Tailwind-based components with TON branding.
    *   [TON Brand Assets](https://ton.org/brand-assets) - Official TON branding resources.

* * *

## [](#p-591-contribute-17)![:pencil2:](https://tonresear.ch/images/emoji/twitter/pencil2.png?v=12 ":pencil2:") Contribute

> Contributing to Awesome-TON

1.  Decide on the changes you want to make in the awesome-ton list.
2.  Press `.` on the `awesome-ton` page to open the online editor (VSCode).
3.  Make changes, describe them, and submit a commit as a Pull Request.
4.  Congratulations, you’re now a contributor to TON! ![:sunglasses:](https://tonresear.ch/images/emoji/twitter/sunglasses.png?v=12 ":sunglasses:")

![](https://github.githubassets.com/favicons/favicon.svg) [github.com](https://github.com/ton-community/awesome-ton/tree/main)

### [GitHub - ton-community/awesome-ton: A curated list of remarkable libraries,...](https://github.com/ton-community/awesome-ton/tree/main)

[main](https://github.com/ton-community/awesome-ton/tree/main)

A curated list of remarkable libraries, tools, services, protocols, and smart contracts related to TON. - ton-community/awesome-ton

  28 Likes

[toncoinco](https://tonresear.ch/u/toncoinco) April 19, 2024, 5:52pm  5

Thank you very much!

  8 Likes

[Howard](https://tonresear.ch/u/Howard) April 22, 2024, 5:40am  6

Thanks for sharing!!!

  6 Likes

[Promzy11](https://tonresear.ch/u/Promzy11) September 5, 2024, 4:00am  8

Amazing  
This is amazing. Thanks

  4 Likes

[Gowrishankark](https://tonresear.ch/u/Gowrishankark) September 9, 2024, 4:55am  9

Ton project is awesome and also Wcoin breaks the records along with Ton coin hoping for best launch of Wcoin

  2 Likes

[Esteemedhuman](https://tonresear.ch/u/Esteemedhuman) September 27, 2024, 5:57pm  10

This will help a lot  
And reposting this

  1 Like

[VirtualsWorlds\_Magic](https://tonresear.ch/u/VirtualsWorlds_Magic) October 27, 2024, 12:23pm  11

Hello People, Please look  
$40 ![:money_with_wings:](https://tonresear.ch/images/emoji/twitter/money_with_wings.png?v=12 ":money_with_wings:")![:gift:](https://tonresear.ch/images/emoji/twitter/gift.png?v=12 ":gift:") Referals Gaming Bonus for Mining GAME [Telegram: Contact @ClickerVWSBot](https://t.me/ClickerVWSBot) Q4 Listing All Mining Pool $VWS Mining NFTs Mining Chats  
![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Banned users will be stripped of the $40 Reward ![:x:](https://tonresear.ch/images/emoji/twitter/x.png?v=12 ":x:")

![](https://dedust.io/favicon-32x32.png) [dedust.io](https://dedust.io/swap/TON/VWS)

![](https://dedust.io/images/opengraph.jpg)

### [DeDust.io — AMM DEX on The Open Network](https://dedust.io/swap/TON/VWS)

Swap any token seamlessly with minimal fees on DeDust.io, a leading decentralized automated market maker (AMM) running on The Open Network. Your ideal trade is just a click away with DeDust.io.

![](https://dedust.io/favicon-32x32.png) [dedust.io](https://dedust.io/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

![](https://dedust.io/images/opengraph.jpg)

### [DeDust.io — AMM DEX on The Open Network](https://dedust.io/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

Swap any token seamlessly with minimal fees on DeDust.io, a leading decentralized automated market maker (AMM) running on The Open Network. Your ideal trade is just a click away with DeDust.io.

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/xrocket/cex?startapp=trade-VWS-TON)

![](https://cdn4.cdn-telegram.org/file/KnPLkROVR9yKQCd1roysSu7wNpKfoFqQdMWznXzfSnjejB-zsEUVvU1_aXhnQCa7GsD3xq22R5HYfEUvpnu2b8mFoTjxN4OYkERm3Atc4hws8QYsyp0GyytEJuLezIM2ICy-HgShsltIfTeWXc58TscJ8iXNHh9ru0UU61-gU8Hgq_6lwI702yLdUNt5Fbs-U5MlrCLqHhUk_CpIHm_0QSSNzF3FcAakp9eGOj7g2LxUwXtfUDA4e0VMpRwQHGOV5juu7a1y-maOK0JrbNrJIhCjy2bMkOtfFHL915gN1PrYGnFEOB2L38xHDHitNHx12VvzDSP-5uJjKbj9ZgOq3g.jpg)

### [xRocket](https://t.me/xrocket/cex?startapp=trade-VWS-TON)

Trade, send and receive popular cryptocurrencies

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/tapps_bot/center?startapp=app_clickervws)

![](https://cdn4.cdn-telegram.org/file/Kk30FeOgB1yJL-KxjHuZxDFaCWfFbzd5VdYBaq6K49Lfmu6aS6YF0JQkcCgUGxkusO0qV2_cUktEyc5-aCrlMfvcf3yaqCybXaVynsD-jmxxRwE_wq6FDaz8iWChya_RoAyF-VzwsF8LFaDDxH5_BJwQBgAx2LHiIDI-b62zyla-IMIZcuxyitYb16OxrrqgN0-St9pLUA0CVoMgN0A4Uaso_tbFdLrjokZJROQZK1eMqZa9rRTRGmS_YPelFOSRll29PXX6TJbXVrt1GRAKwn1jwNZHGsReP7Z9E873W4NacXIuySVHjufKxz61dtncIsVmwOaOCJyLYU_VQTudiw.jpg)

### [Telegram Apps Center](https://t.me/tapps_bot/center?startapp=app_clickervws)

Community-driven catalog of applications developed by third-party developers. Not affiliated with Telegram Messenger.

[https://ton.app/games/clicker-vws?id=2260](https://ton.app/games/clicker-vws?id=2260)

![](https://www.geckoterminal.com/images/favicon.ico) [geckoterminal.com](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

![](https://assets.geckoterminal.com/social/social-sharing.png)

### [VWS/TON - Virtuals Worlds Price on DeDust with 0.25% Fee | GeckoTerminal](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

VWS/TON price today is $0.00000009962 with a 24-hour trading volume of $4.93. Virtuals Worlds contract address is EQBfX...Y8\_h with $7,604.70 in liquidity.

[https://dexscreener.com/ton/eqcca6ja\_vzoqi76cahmumojfzbglvty-dl-k8-f9h3vuoy2](https://dexscreener.com/ton/eqcca6ja_vzoqi76cahmumojfzbglvty-dl-k8-f9h3vuoy2)  
[https://tonwiki.space/wiki/ClickerVWS](https://tonwiki.space/wiki/ClickerVWS)

  1 Like

[VirtualsWorlds\_Magic](https://tonresear.ch/u/VirtualsWorlds_Magic) October 27, 2024, 1:55pm  12

Hello People, Please look  
#Bonus for #Mining #VWSGAME [Telegram: Contact @ClickerVWSBot](https://t.me/ClickerVWSBot) #Mining #Pool #$VWS #Mining #NFTs Mining Chats ![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:")  
[Telegram: Contact @tapps\_bot](https://t.me/tapps_bot/center?startapp=app_clickervws)  
[https://ton.app/games/clicker-vws?id=2260](https://ton.app/games/clicker-vws?id=2260)  
[Telegram: Contact @MagicVipClub](https://t.me/MagicVipClub)  
[ClickerVWS - TON Wiki (En)](https://tonwiki.space/wiki/ClickerVWS)

![](https://dedust.io/favicon-32x32.png) [dedust.io](https://dedust.io/swap/TON/VWS)

![](https://dedust.io/images/opengraph.jpg)

### [DeDust.io — AMM DEX on The Open Network](https://dedust.io/swap/TON/VWS)

Swap any token seamlessly with minimal fees on DeDust.io, a leading decentralized automated market maker (AMM) running on The Open Network. Your ideal trade is just a click away with DeDust.io.

![](https://dedust.io/favicon-32x32.png) [dedust.io](https://dedust.io/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

![](https://dedust.io/images/opengraph.jpg)

### [DeDust.io — AMM DEX on The Open Network](https://dedust.io/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

Swap any token seamlessly with minimal fees on DeDust.io, a leading decentralized automated market maker (AMM) running on The Open Network. Your ideal trade is just a click away with DeDust.io.

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/xrocket/cex?startapp=trade-VWS-TON)

![](https://cdn4.cdn-telegram.org/file/KnPLkROVR9yKQCd1roysSu7wNpKfoFqQdMWznXzfSnjejB-zsEUVvU1_aXhnQCa7GsD3xq22R5HYfEUvpnu2b8mFoTjxN4OYkERm3Atc4hws8QYsyp0GyytEJuLezIM2ICy-HgShsltIfTeWXc58TscJ8iXNHh9ru0UU61-gU8Hgq_6lwI702yLdUNt5Fbs-U5MlrCLqHhUk_CpIHm_0QSSNzF3FcAakp9eGOj7g2LxUwXtfUDA4e0VMpRwQHGOV5juu7a1y-maOK0JrbNrJIhCjy2bMkOtfFHL915gN1PrYGnFEOB2L38xHDHitNHx12VvzDSP-5uJjKbj9ZgOq3g.jpg)

### [xRocket](https://t.me/xrocket/cex?startapp=trade-VWS-TON)

Trade, send and receive popular cryptocurrencies

![](https://www.geckoterminal.com/images/favicon.ico) [geckoterminal.com](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

![](https://assets.geckoterminal.com/social/social-sharing.png)

### [VWS/TON - Virtuals Worlds Price on DeDust with 0.25% Fee | GeckoTerminal](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

VWS/TON price today is $0.00000009962 with a 24-hour trading volume of $4.93. Virtuals Worlds contract address is EQBfX...Y8\_h with $7,604.70 in liquidity.

[https://dexscreener.com/ton/eqcca6ja\_vzoqi76cahmumojfzbglvty-dl-k8-f9h3vuoy2](https://dexscreener.com/ton/eqcca6ja_vzoqi76cahmumojfzbglvty-dl-k8-f9h3vuoy2)

![](https://tonscan.org/favicon.svg) [Tonscan](https://tonscan.org/ru/jetton/EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8_h#swaps)

### [Tonscan — Explore TON blockchain ecosystem](https://tonscan.org/ru/jetton/EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8_h#swaps)

Discover The Open Network ecosystem with tonscan.org — the simplest way to track transaction history, whales addresses, DApps, network stats, staking pools and more.

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/MagicNFTcollections)

![](https://cdn4.cdn-telegram.org/file/NfiKA8YOkiu-5h5hLsa-tG_BMKZbuY_NWfghNIVICln56YQo3cJYjX9nBCJQ7g_ptjl8HTZNP1YY3s-8C0B8yf9s0YULDN9r-0-iI3AFgeJAJZxyH_i8njBUnOJI8CxTE8HFfahlxuhPuP1m_YaD0xGWeb0OZuyQnWtaRKRWkgR4vv5oD-hwLQn0sfAZjFVO7c1rygtgbVJkMwFdAqAuXXI06nedSqz0jNv9ei8YANdD2WU-QZNNkobOCqL1ivsMXnwUbm3kT65bahL_NANWekhpP9NL6Vyp_jSx8J2jdq3mzGnH_2bFhsTcJ-tv6DDVL9SSsUxAl8q-0O7Oefc4Ng.jpg)

### [VWS Mining Chat EN](https://t.me/MagicNFTcollections)

https://t.me/ClickerVWSBot http://t.me/Web3VWS\_Bot https://t.me/MiningChatbot https://t.me/MagicVipClub https://t.me/miningvws https://t.me/VirtualsWorlds https://t.me/AirdropVWSbot https://t.me/AirdropNftOpensea https://t.me/MagicNftClub

[https://tonwiki.space/wiki/ClickerVWS](https://tonwiki.space/wiki/ClickerVWS)

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 505

[TON Research](/)

# [🔥 TON Ecosystem](/t/ton-ecosystem/505)

[General](/c/general/4) 

    

[doge](https://tonresear.ch/u/doge)   March 3, 2024, 7:40pm  1

[![image](https://tonresear.ch/uploads/default/optimized/1X/98cede316b1486e5662aaf35cb3e0f0e31f6731f_2_690x230.png)

image1500×500 26.8 KB

](https://tonresear.ch/uploads/default/original/1X/98cede316b1486e5662aaf35cb3e0f0e31f6731f.png "image")

# [](#project-categories-1)Project Categories

## [](#forums-2)Forums

Name

Telegram

GitHub

Twitter

Website

Ton Research

[Telegram](https://t.me/tonresear_ch)

[Twitter](https://twitter.com/ton_research)

[Website](https://tonresear.ch)

TON Overflow

[Website](https://answers.ton.org)

Stack Overflow

[Website](https://stackoverflow.com/questions/tagged/ton)

## [](#bridges-3)Bridges

Name

Telegram

GitHub

Twitter

Website

TON Bridge

[Telegram](https://t.me/toncoin)

[GitHub](https://github.com/ton-blockchain/bridge-func)

[Twitter](https://twitter.com/ton_blockchain)

[Website](https://bridge.ton.org/)

Orbit Bridge

[Telegram](https://t.me/Orbit_Chain)

[GitHub](https://github.com/orbit-chain)

[Twitter](https://twitter.com/Orbit_Chain)

[Website](https://bridge.orbitchain.io/)

XP.Network

[Telegram](https://t.me/xp_network)

[GitHub](https://github.com/XP-NETWORK)

[Twitter](https://twitter.com/xpnetwork_)

[Website](https://bridge.xp.network/)

TonTake Bridge

[Telegram](https://t.me/tontakebridgebot)

Wallet Bridge

[Telegram](https://t.me/walletbridgebot)

Layerswap

[GitHub](https://github.com/layerswap/layerswapapp)

[Twitter](https://twitter.com/layerswap)

[Website](https://www.layerswap.io/)

## [](#defi-4)DeFi

### [](#decentralized-exchanges-5)Decentralized Exchanges

Name

Telegram

GitHub

Twitter

Website

[Ston.fi](http://Ston.fi)

[Telegram](https://t.me/stonfidex)

[GitHub](https://github.com/ston-fi)

[Twitter](https://twitter.com/ston_fi)

[Website](https://ston.fi/)

[DeDust.io](http://DeDust.io)

[Telegram](https://t.me/dedust)

[GitHub](https://github.com/dedust-io)

[Twitter](https://twitter.com/dedust_io)

[Website](https://dedust.io/swap)

[Optus.fi](http://Optus.fi)

[Telegram](https://t.me/optus_fi)

[GitHub](https://github.com/optus-fi/)

[Twitter](https://twitter.com/OPTUS_dex)

[Website](https://optus.fi/)

Megaton Finance

[Telegram](https://t.me/MegatonFinanceChannel)

[GitHub](https://github.com/megaton-fi)

[Twitter](https://twitter.com/@Megaton_Fi)

[Website](https://megaton.fi/)

Storm

[Telegram](https://t.me/storm_trade_fam)

[Twitter](https://twitter.com/storm_trade_ton)

[Website](https://stormtrade.dev/trade/TON_USDT)

Flex

[Telegram](https://t.me/tonfactorychat)

[GitHub](https://github.com/tonfactory/)

[Website](https://tonflex.fi/)

ION Finance

[Telegram](https://t.me/IONFINANCE_OFFICIAL)

[GitHub](https://github.com/ion-finance)

[Twitter](https://twitter.com/Ion_Finance)

[Website](https://ionfi.xyz/)

### [](#decentralized-exchanges-for-wton-6)Decentralized Exchanges for wTON

Name

Telegram

GitHub

Twitter

Website

Dodo

[Telegram](https://t.me/dodoex_official)

[GitHub](https://github.com/DODOEX)

[Twitter](https://twitter.com/BreederDodo)

[Website](https://app.dodoex.io/swap/network/mainnet/ton/USDC)

Uniswap

[GitHub](https://github.com/Uniswap)

[Twitter](https://twitter.com/uniswap)

[Website](https://app.uniswap.org/swap?outputcurrency=0x582d872a1b094fc48f5de31d3b73f2d9be47def1)

PancakeSwap

[Telegram](https://t.me/pancakeswap)

[GitHub](https://github.com/pancakeswap)

[Twitter](https://twitter.com/pancakeswap)

[Website](https://pancakeswap.finance/swap?outputcurrency=0x76a797a59ba2c17726896976b7b3747bfd1d220f)

Nomiswap

[Telegram](https://t.me/nominex_news_ru)

[GitHub](https://github.com/nominex)

[Twitter](https://twitter.com/Nomiswap)

[Website](https://nomiswap.io/swap?outputCurrency=0x76A797A59Ba2C17726896976B7B3747BfD1d220f)

### [](#lending-and-borrowing-7)Lending and Borrowing

Name

Telegram

GitHub

Twitter

Website

Evaa Protocol

[GitHub](https://github.com/evaafi)

[Twitter](https://twitter.com/evaaprotocol)

[Website](https://app.evaa.finance/)

### [](#staking-8)Staking

Name

Telegram

GitHub

Twitter

Website

TON Whales

[Telegram](https://t.me/WhalesSupportBot)

[GitHub](https://github.com/tonwhales)

[Twitter](https://twitter.com/whalescorp)

[Website](https://tonwhales.com/)

TON Validators

[Telegram](https://t.me/ton_validators_bot)

[Website](https://tonvalidators.org/)

TON Stake

[Telegram](https://t.me/tonstake_en)

[Twitter](https://twitter.com/tonstakecom)

[Website](https://www.tonstake.com/#/)

Hipo Finance

[Telegram](https://t.me/hipo_chat)

[GitHub](https://github.com/HipoFinance)

[Twitter](https://twitter.com/hipofinance)

[Website](https://app.hipo.finance/)

TON Stake Lottery

[Telegram](https://t.me/tonstakelottery)

[Website](https://tonstakelottery.com/)

Bemo Finance

[Telegram](https://t.me/bemofinance)

[Twitter](https://twitter.com/bemo_finance)

[Website](https://www.bemo.finance/)

Tonstakers

[Telegram](https://t.me/thetonstakers)

[Twitter](https://twitter.com/tonstakers)

[Website](https://tonstakers.com/)

Stakee

[Telegram](https://t.me/stakee)

[Website](https://t.me/StakeeBot/start)

### [](#stablecoins-9)Stablecoins

Name

Telegram

GitHub

Twitter

Website

Aqua Protocol

[Telegram](https://t.me/aquaprotocolxyz)

[Twitter](https://twitter.com/aquaprotocolxyz)

[Website](https://aquaprotocol.xyz/)

## [](#launchpad-10)Launchpad

Name

Telegram

GitHub

Twitter

Website

Tonstarter

[Telegram](https://t.me/+RH50YeWT6Ps3ODUy)

[Twitter](https://twitter.com/ton_starter)

[Website](https://tonstarter.com/)

TON Gagarin World

[Telegram](https://t.me/Ton_Gagarin_World_Chat)

[Twitter](https://twitter.com/GAGARIN_World)

[Website](https://ton.gagarin.world/)

TONUP

[Telegram](https://t.me/TonUP_io)

[Twitter](https://twitter.com/TonUP_io)

[Website](https://tonup.io/launchpad/)

## [](#centralized-exchanges-11)Centralized Exchanges

Name

Telegram

GitHub

Twitter

Website

OKX

[Telegram](https://t.me/OKXOfficial_English)

[Twitter](https://twitter.com/okx)

[Website](https://www.okx.com/)

MEXC

[Telegram](https://t.me/MEXCEnglish)

[Twitter](https://twitter.com/MEXC_Official)

[Website](https://www.mexc.com/)

HTX

[Telegram](https://t.me/htxglobalofficial)

[Twitter](https://twitter.com/HTX_Global)

[Website](https://www.htx.com/)

## [](#on-ramp-12)On-Ramp

Name

Telegram

GitHub

Twitter

Website

Mercuryo

[Telegram](https://telegram.me/HRMercuryo)

[Twitter](https://twitter.com/Mercuryo_io)

[Website](https://mercuryo.io/)

NEOCRYPTO

[Website](https://neocrypto.net/)

Guardarian

[Twitter](https://twitter.com/Guardarian_com)

[Website](https://guardarian.com/buy-ton)

Bit2Me

[Telegram](https://t.me/Bit2Me_ES)

[GitHub](https://github.com/bit2me-devs)

[Twitter](https://twitter.com/Bit2Me_Global)

[Website](https://bit2me.com/buy-ton)

MoonPay

[GitHub](https://github.com/moonpay)

[Twitter](https://twitter.com/moonpay)

[Website](https://www.moonpay.com/buy)

OnRamp.money

[Telegram](https://t.me/onramp_money)

[Twitter](https://twitter.com/onrampmoney)

[Website](https://onramp.money/main/buy/?appId=1&coinCode=ton)

FinchPay

[Telegram](https://t.me/FinchPay_io)

[Twitter](https://twitter.com/FinchPay_io)

[Website](https://finchpay.io/)

Alchemy Pay

[Telegram](https://t.me/alchemy_official)

[Twitter](https://twitter.com/alchemypay)

[Website](https://alchemypay.org/)

Itez

[Twitter](https://twitter.com/Itezofficial)

[Website](https://itez.com/)

ChangeNOW

[Telegram](https://t.me/changeNOW_chat)

[GitHub](https://github.com/ChangeNow-io)

[Twitter](https://twitter.com/ChangeNOW_io)

[Website](https://changenow.io/?from=usdterc20&to=ton)

Transack

[Telegram](https://t.me/transakfinance)

[GitHub](https://github.com/Transak)

[Twitter](https://twitter.com/transak)

[Website](https://global.transak.com/)

Changelly

[Telegram](https://t.me/changelly)

[GitHub](https://github.com/changelly)

[Twitter](https://twitter.com/changelly_team)

[Website](https://changelly.com/)

## [](#explorers-13)Explorers

Name

Telegram

GitHub

Twitter

Website

Tonscan by Bastion

[Website](https://tonscan.com/)

Tonscan

[GitHub](https://github.com/catchain/tonscan)

[Website](https://tonscan.org/)

Tonviewer

[Twitter](https://twitter.com/tonappshq)

[Website](https://tonviewer.com/)

TONAPI

[Telegram](https://t.me/tonkeeper)

[GitHub](https://github.com/tonkeeper/opentonapi)

[Twitter](https://twitter.com/tonappshq)

[Website](https://tonapi.io/)

Whales Explorer

[GitHub](https://github.com/tonwhales)

[Twitter](https://twitter.com/whalescorp)

[Website](https://tonwhales.com/explorer)

M3TA

[Telegram](https://t.me/M3TA_Analytics)

[Twitter](https://twitter.com/M3TA_Analytics)

[Website](https://m3talab.io/reports/ton-telegram-open-network)

TON NFT Explorer

[Telegram](https://t.me/this_is_TON)

[Website](https://explorer.tonnft.tools/)

DTON

[Telegram](https://t.me/disintar)

[Twitter](https://twitter.com/disintar_io/)

[Website](https://dton.io/)

3xpl

[GitHub](https://github.com/3xplcom)

[Twitter](https://twitter.com/3xplcom)

[Website](https://3xpl.com/ton)

TON.sh

[Website](https://ton.sh/)

Tenere Explorer

[Telegram](https://t.me/teneretoken)

[Website](https://www.teneretoken.com/tenere-explorer)

NFTScan

[Github](https://github.com/nftscan-official)

[Twitter](https://twitter.com/nftscan_com)

[Website](https://ton.nftscan.com/)

## [](#games-14)Games

Name

Telegram

GitHub

Twitter

Website

Tonarchy

[Telegram](https://t.me/Tonarchy)

[Twitter](https://twitter.com/tonarchy)

[Website](https://tonarchy.online/)

TON Planets Mars

[Telegram](https://t.me/TONPlanets)

[Twitter](https://twitter.com/TonPlanets)

[Website](https://mars.tonplanets.com/en/)

PlayDeck

[Telegram](https://t.me/playdeckbot)

[GitHub](https://github.com/ton-play)

[Twitter](https://twitter.com/insider_ton)

[Website](https://tonplay.io/games/DZmrVk1mJ5)

Lifeblood

[Website](https://lifeblood.ru/)

Tonrare

[Telegram](https://t.me/tonrare_games)

[Website](https://tonrare.com/explore)

Stepogram

[Twitter](https://twitter.com/stepogram)

[Website](https://stepogram.com/)

PunkCity

[Telegram](https://t.me/PunkCity2094bot)

[GitHub](https://github.com/TON-Punks/punk-city-hack-a-tonx)

[Twitter](https://twitter.com/TonPunks)

Tongochi Game

[Telegram](https://t.me/TonGochi_bot)

[GitHub](https://github.com/tongochi/DEX)

[Twitter](https://twitter.com/tongochi)

Toncaps

[Telegram](https://t.me/toncapsio)

[Website](https://toncaps.io/)

Fanton

[Telegram](https://t.me/fantongamebot)

[Twitter](https://twitter.com/FantasyFanton)

[Website](https://fan-ton.com/)

BIOM Play2Earn

[Telegram](https://t.me/Biom_play2earn_bot)

Zernosklad

[Telegram](https://t.me/TonTake)

[Twitter](https://twitter.com/TonTakeGame)

[Website](https://zernosklad.com/)

TON Chess

[Telegram](https://tonplay.io/games/RDKcT26bNo)

[GitHub](https://github.com/ton-play)

[Twitter](https://twitter.com/insider_ton)

[Website](https://tonplay.io/games/RDKcT26bNo)

Instant Games

[Telegram](https://t.me/InstantGames_bot)

[Website](https://8xr.io/)

Tonlanders

[Telegram](https://t.me/tonlanders)

Escape from Zeya

[Telegram](https://t.me/tonplayinsider)

[Twitter](https://twitter.com/insider_ton)

[Website](https://tonplay.io/games/DZmrVk1mJ5)

Batte Planes

[Telegram](https://t.me/battleplanes)

Fanton Fantasy Football

[Telegram](https://t.me/FanTonGameBot)

Tongochi Game

[Telegram](https://t.me/TonGochi_bot)

CockFights Game

[Telegram](https://t.me/TonCocks)

[Twitter](https://twitter.com/Cock_Fights)

[Website](https://cock-fights.com)

Chess Zombies

[Telegram](https://t.me/chesszombieseng)

[GitHub](https://github.com/SHEDEVERstudio)

[Twitter](https://twitter.com/ShedEVERstudio)

[Website](https://chesszombies.fun)

Gatto Game

[Telegram](https://t.me/gatto_gamebot)

[Twitter](https://x.com/Gatto_game)

## [](#infra-15)Infra

### [](#web3-internet-16)Web3 Internet

Name

Telegram

GitHub

Twitter

Website

Tonkeeper

[Telegram](https://t.me/tonkeeper)

[GitHub](https://github.com/tonkeeper/wallet-api)

[Twitter](https://twitter.com/tonkeeper)

[Website](https://tonkeeper.com/)

MyTonWallet

[Telegram](https://t.me/MyTonWalletEn)

[GitHub](https://github.com/mytonwalletorg/mytonwallet)

[Website](https://mytonwallet.io/)

OpenMask

[Telegram](https://t.me/openproduct)

[GitHub](https://github.com/OpenProduct/openmask-extension)

[Twitter](https://twitter.com/openmask_wallet)

[Website](https://www.openmask.app/)

TON Search Engine

[Telegram](https://t.me/runner_ton)

[Twitter](https://twitter.com/TonxStudio)

[Website](https://ton.run/)

TON Proxy

[GitHub](https://github.com/tonwhales/ton-proxy)

[Twitter](https://twitter.com/whalescorp)

[Website](https://chrome.google.com/webstore/detail/ton-proxy/pmgpnamlibffaaigdcohddlnokolfgnc)

TON DNS

[Telegram](https://t.me/toncoin)

[GitHub](https://github.com/ton-blockchain)

[Twitter](https://twitter.com/ton_blockchain)

[Website](https://dns.ton.org/)

### [](#defi-17)DeFi

Name

Telegram

GitHub

Twitter

Website

TON Minter

[Telegram](https://t.me/+YDnoBue1Dz81ZTMy)

[GitHub](https://github.com/ton-blockchain/minter-contract)

[Twitter](https://twitter.com/ton_blockchain)

[Website](https://minter.ton.org/)

TON Locker

[GitHub](https://github.com/ton-blockchain/locker-contract)

### [](#gaming-18)Gaming

Name

Telegram

GitHub

Twitter

Website

TON Play

[Telegram](https://t.me/tonplayinsider)

[GitHub](https://github.com/ton-play)

[Twitter](https://twitter.com/insider_ton)

[Website](https://tonplay.io)

8XR

[Telegram](https://t.me/gam8s)

[Twitter](https://twitter.com/8xr_engine)

[Website](https://8xr.io/)

Cosmoton.xyz

[Website](https://cosmoton.xyz)

### [](#storage-19)Storage

Name

Telegram

GitHub

Twitter

Website

Tonbyte

[Telegram](https://t.me/tonbytecom)

[GitHub](https://github.com/tonbyte)

[Twitter](https://twitter.com/TON_Byte)

[Website](https://tonbyte.com/)

TON Torrents

[Telegram](https://t.me/tonrh)

[GitHub](https://github.com/xssnick/TON-Torrent)

TON Utils Storage

[Telegram](https://t.me/tonrh)

[GitHub](https://github.com/xssnick/tonutils-storage)

Ton.ski

[Telegram](https://t.me/searchington)

[GitHub](https://gitea.ennucore.com/agorata)

[Twitter](https://twitter.com/tonski_ton)

[Website](https://ton.ski/)

### [](#integrated-development-environment-ide-20)Integrated Development Environment (IDE)

Name

Telegram

GitHub

Twitter

Website

TON IntelliJ Plugin

[GitHub](https://github.com/ton-blockchain/intellij-ton)

[Website](https://plugins.jetbrains.com/plugin/18541-ton)

TON VS Code Plugin

[GitHub](https://github.com/ton-foundation/vscode-func)

[Website](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

Tact VS Code Plugin

[GitHub](https://github.com/tact-lang/tact-vscode)

[Website](https://marketplace.visualstudio.com/items?itemName=KonVik.tact-lang-vscode)

Neovim Plugin

[GitHub](https://github.com/cryshado/neovim-ton-dev)

Sublime Text Editor Plugin

[GitHub](https://github.com/savva425/func_plugin_sublimetext3)

Nujan IDE

[Telegram](https://t.me/Nujan_io)

[GitHub](https://github.com/nujan-io/nujan-ide)

[Twitter](https://twitter.com/nujan_io)

[Website](https://nujan.io/)

### [](#dev-tools-21)Dev Tools

Name

Telegram

GitHub

Twitter

Website

IntelliJ Idea plugin

[GitHub](https://github.com/ton-blockchain/intellij-ton)

[Website](https://plugins.jetbrains.com/plugin/18541-ton)

Tonana

[Telegram](https://t.me/tonanadao)

[GitHub](https://github.com/tonanadao)

[Twitter](https://twitter.com/Tonanadao)

[Website](https://tonana.org)

WebDeployer

[GitHub](https://github.com/ProgramCrafter/ton-qr-deployer)

[Website](https://ratingers.pythonanywhere.com/deployer/)

TON Verifier

[Telegram](https://t.me/tonverifier)

[GitHub](https://github.com/ton-blockchain/verifier)

[Website](https://verifier.ton.org)

TON Timer

[GitHub](https://github.com/ProgramCrafter/ton-stable-timer/)

[Website](https://programcrafter.github.io/ton-stable-timer)

Rift

[Website](https://rift.skyring.io)

TON NoCode SDK

[Website](https://novabloq.com/plugin/ton-connect-nocode-sdk-1679505489636x562684572799117440)

### [](#nodes-22)Nodes

Name

Telegram

GitHub

Twitter

Website

TON Admin

[Website](https://tonadmin.org/)

MyTonCtrl

[GitHub](https://github.com/ton-blockchain/mytonctrl)

### [](#oracles-23)Oracles

Name

Telegram

GitHub

Twitter

Website

Redstone Oracle

[Telegram](https://t.me/redstonefinance)

[GitHub](https://github.com/redstone-finance)

[Twitter](https://twitter.com/redstone_defi)

[Website](https://redstone.finance/)

### [](#zk-on-ton-24)Zk on TON

Name

Telegram

GitHub

Twitter

Website

ZK on TON

[Website](https://docs.ton.org/develop/dapps/tutorials/simple-zk-on-ton)

Tonnel Network

[Telegram](https://t.me/tonnel_en)

[GitHub](https://github.com/SaberDoTcodeR/Tonnel-Network)

[Twitter](https://twitter.com/tonnel_network)

[Website](https://www.tonnel.network/)

### [](#security-solutions-25)Security Solutions

Name

Telegram

GitHub

Twitter

Website

CertiK

[Telegram](https://t.me/CertiKCommunity)

[GitHub](https://github.com/CertiKProject)

[Twitter](https://twitter.com/CertiK)

[Website](https://www.certik.com/)

Trail of Bits

[GitHub](https://github.com/trailofbits)

[Twitter](https://twitter.com/trailofbits)

[Website](https://www.trailofbits.com/)

Hacken

[Telegram](https://t.me/hackenai)

[GitHub](https://github.com/hknio)

[Twitter](https://twitter.com/hackenclub)

[WebSite](https://hacken.io/)

HackenProof

[Telegram](https://t.me/hackenproof)

[GitHub](https://github.com/hackenproof)

[Twitter](https://twitter.com/HackenProof)

[WebSite](https://hackenproof.com/)

[Hexens.io](http://Hexens.io)

[GitHub](https://github.com/Hexens)

[Twitter](https://twitter.com/hexensio)

[Website](https://hexens.io/)

Quantstamp

[GitHub](https://github.com/quantstamp)

[Twitter](https://twitter.com/Quantstamp)

[Website](https://quantstamp.com/)

ScaleBit

[GitHub](https://github.com/ScaleBit)

[Twitter](https://twitter.com/scalebit_)

[Website](https://www.scalebit.xyz/)

## [](#education-26)Education

Name

Telegram

GitHub

Twitter

Website

FunC Contracts Collection

[Website](https://docs.ton.org/develop/smart-contracts/examples#func-smart-contracts)

Getgems NFT Contracts

[Telegram](https://t.me/getgems)

[GitHub](https://github.com/getgems-io/nft-contracts)

[Twitter](https://twitter.com/getgemsdotio)

[Website](http://getgems.io/)

Tact Language

[Telegram](https://t.me/tactlang)

[GitHub](https://github.com/tact-lang)

[Twitter](http://twitter.com/tact_language)

[Website](https://tact-lang.org/)

Tact by Example

[Website](https://tact-by-example.org)

Tact Template

[GitHub](https://github.com/tact-lang/tact-template)

FunC Lessons

[Telegram](https://t.me/ton_learn)

[GitHub](https://github.com/romanovichim/TonFunClessons_Eng)

Tonight.dev

[Website](https://tonight.dev/)

FunC Contracts Collection

[Website](https://docs.ton.org/develop/smart-contracts/examples#func-smart-contracts)

FunC SDK and Libraries

[Website](https://docs.ton.org/develop/smart-contracts/libraries)

TON Virtual Machine

[GitHub](https://github.com/ton-blockchain/ton/tree/master/crypto/vm)

[Website](https://docs.ton.org/learn/tvm-instructions/tvm-overview)

## [](#youtube-tutorials-27)YouTube Tutorials

Name

Telegram

YouTube

Tact & Blueprint \[en\]

[Telegram](https://t.me/alefman)

[YouTube](https://www.youtube.com/@AlefmanVladimirEN-xb4pq/videos)

Tact & Blueprint \[ru\]

[Telegram](https://t.me/alefman)

[YouTube](https://www.youtube.com/watch?v=isYBvzM-MfQ&list=PLOIvUFGfwP93tZI_WnaLyJsZlskU4ao92)

Tact Development \[ru\]

[Telegram](https://t.me/nonam3e)

[YouTube](https://www.youtube.com/watch?v=S6wlNsKUHpE&list=PLyDBPwv9EPsAJpR7R0cC4kgo7BjiMmUy7&index=1)

Mark Ohman

[Telegram](https://t.me/markokhmandev)

[YouTube](https://www.youtube.com/@markokhman)

# [](#shopping-28)Shopping

## [](#ton-payments-29)TON Payments

Name

Telegram

GitHub

Twitter

Website

Moneton

[Telegram](https://t.me/moneton_bot)

TonoGram

[Telegram](https://t.me/tonogrampremiumbot)

monomenu

[Telegram](https://t.me/monodashboardbot)

## [](#marketplaces-30)Marketplaces

Name

Telegram

GitHub

Twitter

Website

Getgems

[Telegram](https://t.me/getgems)

[GitHub](https://github.com/getgems-io)

[Twitter](https://twitter.com/getgemsdotio)

[Website](https://getgems.io/)

Fragment

[Website](https://fragment.com/)

TON Diamonds

[Telegram](https://t.me/tondiamonds)

[Twitter](https://twitter.com/TonDiamonds)

[Website](https://ton.diamonds/)

Disintar

[Telegram](https://t.me/disintar)

[Twitter](https://twitter.com/disintar_io?lang=en)

[Website](https://beta.disintar.io/)

TON Play

[Telegram](https://t.me/tonplayinsider)

[GitHub](https://github.com/ton-play)

[Twitter](https://twitter.com/insider_ton)

[Website](https://tonplay.io/)

PlayMuse

[Telegram](https://t.me/playmuseton)

[Twitter](https://twitter.com/playmuseton)

[Website](https://playmuse.org/)

# [](#nft-31)NFT

## [](#nft-services-32)NFT Services

Name

Telegram

GitHub

Twitter

Website

Ton Raffles

[Telegram](https://t.me/tonraffles)

[Twitter](https://twitter.com/TonRaffles)

[Website](https://tonraffles.org/en)

DAOLama

[Telegram](https://t.me/daolama_en)

[Twitter](https://twitter.com/daolama_ton)

[Website](https://daolama.co)

Playmuse

[Telegram](https://t.me/playmuseton)

[Twitter](https://twitter.com/playmuseton)

[Website](https://playmuse.org)

NFT TONificaror

[Telegram](https://t.me/nfttonificatorbot)

NFT Drop Calendar

[Telegram](https://t.me/tonnftdropbot)

## [](#nft-tooling-33)NFT Tooling

Name

Telegram

GitHub

Twitter

Website

GameFi SDK

[GitHub](https://github.com/ton-community/gamefi-sdk)

[Website](https://ton.org/gamefi)

Tonweb JS SDK

[GitHub](https://github.com/toncenter/tonweb)

TON Diamonds NFT Deployer

[Telegram](https://t.me/TONDiamondsBot)

[GitHub](https://github.com/tondiamonds/ton-nft-deployer)

[Twitter](https://twitter.com/TonDiamonds)

[Website](https://tondiamonds.github.io/ton-nft-deployer/)

DAOLama

[Telegram](https://t.me/daolama_en)

[Twitter](https://twitter.com/daolama_ton)

[Website](https://daolama.co/)

TON SDK

[GitHub](https://github.com/tonfactory/tonsdk)

[Website](https://pypi.org/project/tonsdk/)

TON Play Unity SDK

[GitHub](https://github.com/ton-play/tonplay-unity-sdk)

[Website](https://docs.tonplay.io/sdk/unity-sdk)

## [](#telegram-mini-apps-tooling-34)Telegram Mini Apps Tooling

Name

Telegram

GitHub

Twitter

Website

TMA Dev

[Telegram](https://t.me/twa_dev)

[GitHub](https://github.com/twa-dev)

[Website](https://core.telegram.org/bots/webapps)

Figma Design component Library

[Website](https://www.figma.com/@firststagelabs)

TMA Boilerplate

[GitHub](https://github.com/twa-dev/Boilerplate)

[Website](https://boilerplate-twa-dev.vercel.app/)

TMA React SDK

[GitHub](https://github.com/Telegram-Web-Apps/twa.js/blob/master/packages/sdk-react)

twa.js

[GitHub](https://github.com/Telegram-Web-Apps/twa.js)

## [](#compliance-35)Compliance

Name

Telegram

GitHub

Twitter

Website

BitOK

[Telegram](https://t.me/BitOK_support)

[GitHub](https://github.com/telegram-bots/BitOk)

[Twitter](https://twitter.com/Bitok_org)

[Website](https://bitok.org/)

Elliptic

[Twitter](http://www.twitter.com/elliptic)

[Website](https://www.elliptic.co/)

Chainalysis

[Telegram](https://t.me/chainalysisinc)

[GitHub](https://github.com/chainalysis)

[Twitter](https://twitter.com/chainalysis)

[Website](https://www.chainalysis.com/)

Sumsub

[GitHub](https://github.com/SumSubstance)

[Twitter](https://twitter.com/Sumsubcom)

[Website](https://sumsub.com/)

TON Guard

[Telegram](https://t.me/tonguard_bot)

[Website](https://tonguard.org/)

## [](#analytics-36)Analytics

Name

Telegram

GitHub

Twitter

Website

DefiLlama

[GitHub](https://github.com/DefiLlama)

[Twitter](https://twitter.com/DefiLlama)

[Website](https://defillama.com/)

GeckoTerminal

[Telegram](https://t.me/geckoterminal)

[Twitter](https://twitter.com/GeckoTerminal)

[Website](https://www.geckoterminal.com/ton/pools/)

re:doubt

[Telegram](https://t.me/re_doubt)

[GitHub](https://github.com/re-doubt)

[Twitter](https://twitter.com/redoubt_web3)

[Website](https://redoubt.online/)

TonStat

[Telegram](https://t.me/tonstatcom)

[Website](https://www.tonstat.com/)

Tonscan Stats

[GitHub](https://github.com/catchain/tonscan)

[Website](https://tonscan.org/stats)

Anton.tools

[Telegram](https://t.me/tonindexer)

[GitHub](https://github.com/tonindexer)

[Twitter](https://twitter.com/apachesuperset)

[Website](https://anton.tools/)

TON Radar

[Telegram](https://t.me/tonradarapp)

[GitHub](https://github.com/tonradar)

[Twitter](https://twitter.com/tonradarapp)

[Website](https://tonradar.app/)

TON DEX PnL Analyzer

[Telegram](https://t.me/ton_learn)

[Twitter](https://twitter.com/roma_i_m)

[Website](https://tonlearn.tools/)

Kattana

[Telegram](https://t.me/kattana_trade)

[GitHub](https://github.com/kattana-io)

[Twitter](https://twitter.com/kattanatrade)

[Website](https://app.kattana.io/)

dTON Forum

[Telegram](https://t.me/dtonforum)

## [](#api-providers-37)API Providers

Name

Telegram

GitHub

Twitter

Website

TON Access

[Telegram](https://t.me/OrbsNetwork)

[GitHub](https://github.com/orbs-network/)

[Twitter](https://twitter.com/orbs_network)

[Website](https://www.orbs.com/ton-access/)

Toncenter

[Telegram](https://t.me/tonapibot)

[GitHub](https://github.com/toncenter/ton-http-api)

[Website](https://toncenter.com/)

TON Hub API

[Telegram](https://t.me/WhalesSupportBot)

[GitHub](https://github.com/tonwhales)

[Twitter](https://twitter.com/whalescorp)

[Website](https://sandbox.tonhubapi.com/)

TON Console (TonAPI)

[Telegram](https://t.me/tonrostislav)

[GitHub](https://github.com/tonkeeper/tonapi)

[Website](https://tonconsole.com/)

DTON GraphQL

[Telegram](https://t.me/tvorogme)

[GitHub](https://github.com/disintar)

[Website](https://dton.io/graphql)

GetBlock

[Telegram](https://t.me/getblockio_eng)

[Twitter](https://twitter.com/getblockio)

[Website](https://getblock.io/nodes/ton/)

NOWNodes

[Telegram](https://t.me/nownodes)

[GitHub](https://github.com/NOWNodes)

[Twitter](https://twitter.com/NowNodes)

[Website](https://nownodes.io/nodes/toncoin)

TON SDKs

[Website](https://docs.ton.org/develop/dapps/apis/sdk)

TON ADNL API

[Website](https://docs.ton.org/develop/dapps/apis/adnl)

TonFura API

[Telegram](https://t.me/tonfura_ann)

[GitHub](https://github.com/tonfuraplatform)

[Twitter](https://twitter.com/ton_fura)

[Website](https://tonfura.com/)

## [](#payments-38)Payments

Name

Telegram

GitHub

Twitter

Website

Wallet Pay

[Website](https://pay.wallet.tg/)

Cryptomus

[Twitter](https://twitter.com/cryptomuscom)

[Website](https://cryptomus.com/)

iVendPay

[Telegram](https://t.me/ivendpay)

[Twitter](https://twitter.com/ivendpay)

[Website](https://ivendpay.com/)

Cryptopay

[Telegram](https://t.me/cryptopayme)

[GitHub](https://github.com/cryptopay-dev)

[Twitter](https://twitter.com/cryptopay)

[Website](https://cryptopay.me/en/)

@Tribute

[Telegram](https://t.me/tribute)

[Website](https://tribute.tg)

## [](#app-store-39)App Store

Name

Telegram

GitHub

Twitter

Website

TON App

[Telegram](https://t.me/tonapp)

[Twitter](https://twitter.com/apps_ton)

[Website](https://ton.app/)

Telegram Apps Center

[Telegram](https://t.me/trendingApps)

[Website](https://tapps.center/)

Tonscan Apps

[Telegram](https://t.me/catchain)

[Website](https://tonscan.org/apps)

## [](#socialfi-40)SocialFi

Name

Telegram

GitHub

Twitter

Website

TON Vote

[Telegram](https://t.me/TONVoteSupportGroup)

[GitHub](https://github.com/orbs-network/dao-vote)

[Website](https://ton.vote/)

NFT Access Guardian Bot

[Telegram](https://t.me/access_ton_control_bot)

Fanzee

[Telegram](https://t.me/fanzeechat)

[Twitter](https://twitter.com/fanzeelabs)

[Website](https://fanz.ee/)

Oveit

[Twitter](https://twitter.com/oveitcom)

[Website](https://cryptomus.com/)

Web3Events

[Telegram](https://t.me/web3events_eng)

[Twitter](https://twitter.com/Web3Events_ai)

[Website](https://web3events.ai/)

## [](#wallets-41)Wallets

## [](#auth-protocols-42)Auth Protocols

Name

Telegram

GitHub

Twitter

Website

TON Connect SDKs

[GitHub](https://github.com/ton-connect/)

[Website](https://docs.ton.org/develop/dapps/ton-connect/developers)

### [](#non-custodial-wallets-43)Non-Custodial Wallets

Name

Telegram

GitHub

Twitter

Website

@wallet

[Telegram](https://t.me/wallet)

[Twitter](https://twitter.com/wallet_tg)

[Website](https://wallet.tg/)

Coin98 Wallet

[Telegram](https://t.me/coin98wallet)

[GitHub](https://github.com/coin98)

[Twitter](https://twitter.com/coin98_wallet)

[Website](https://coin98.com/wallet)

iMe Wallet

[Telegram](https://t.me/ime_en)

[GitHub](https://github.com/imemessenger/)

[Twitter](https://twitter.com/ImePlatform)

[Website](https://www.imem.app/)

KaiOS Wallet

[Telegram](https://t.me/Vinayakkalra)

[GitHub](https://github.com/kaifoundry/ton-kaios-wallet)

MyTonWallet

[Telegram](https://t.me/MyTonWalletRu)

[GitHub](https://github.com/mytonwalletorg/mytonwallet)

[Website](https://mytonwallet.io/)

Tonkeeper

[Telegram](https://t.me/tonkeeper)

[GitHub](https://github.com/tonkeeper/wallet-api)

[Twitter](https://twitter.com/tonkeeper)

[Website](https://tonkeeper.com/)

Tonhub

[GitHub](https://github.com/tonwhales/wallet)

[Website](https://tonhub.com/)

TON Wallet

[Telegram](https://t.me/toncoin)

[GitHub](https://github.com/toncenter/ton-wallet)

[Website](https://wallet.ton.org/)

Trust Wallet

[Telegram](https://t.me/trust_announcements)

[GitHub](https://github.com/trustwallet)

[Twitter](https://twitter.com/TrustWallet)

[Website](https://trustwallet.com/)

OpenMask

[Telegram](https://t.me/openproduct)

[GitHub](https://github.com/OpenProduct/openmask-extension)

[Twitter](https://twitter.com/openmask_wallet)

[Website](https://www.openmask.app/)

Gemwallet

[Telegram](https://t.me/gemwallet)

[GitHub](https://github.com/gemwalletcom)

[Twitter](https://twitter.com/GemWalletApp)

[Website](https://gemwallet.com/)

Top Wallets

[Telegram](https://t.me/top_wallets)

[GitHub](https://github.com/AlexGor-dev/Top-Wallets)

[Website](https://complex-soft.com/top_wallets.html)

XTON Wallet

[Telegram](https://t.me/xtonwallet)

[GitHub](https://github.com/xtonwallet/web-extension)

[Website](https://xtonwallet.com/)

### [](#custodial-wallets-44)Custodial Wallets

Name

Telegram

GitHub

Twitter

Website

@wallet

[Telegram](https://t.me/wallet)

[Twitter](https://twitter.com/wallet_tg)

[Website](https://wallet.tg/)

Crypto Bot

[Telegram](https://t.me/CryptoBot)

TON Rocket

[Telegram](https://t.me/tonRocketBot)

Swapster

[Telegram](https://t.me/swapsterbot)

NFT Wallet

[Telegram](https://t.me/NFTWalletBot)

Wallet Explorer

[Telegram](https://t.me/WalletExplorerBot)

xJetSwap

[Telegram](https://t.me/xjetswapbot)

### [](#multisig-wallets-45)Multisig Wallets

Name

Telegram

GitHub

Twitter

Website

Tonkey

[Telegram](https://t.me/tonkeyapp)

[GitHub](https://github.com/tonkey-app)

[Twitter](https://twitter.com/TonkeyApp)

[Website](https://tonkey.app/)

TON Web Multisig

[GitHub](https://github.com/ton-blockchain/multisig-dapp)

[Website](https://ton-blockchain.github.io/multisig-dapp/)

TON CLI Multisig

[GitHub](https://github.com/akifoq/multisig)

### [](#hardware-wallets-46)Hardware Wallets

Name

Telegram

GitHub

Twitter

Website

Ledger

[GitHub](https://github.com/LedgerHQ)

[Twitter](https://twitter.com/Ledger)

[Website](https://www.ledger.com/coin/wallet/the-open-network)

Safepal

[Telegram](https://t.me/SafePal_official)

[GitHub](https://github.com/SafePalWallet)

[Twitter](https://twitter.com/iSafePal)

[Website](https://www.safepal.com/en/)

Tangem

[Telegram](https://t.me/tangem)

[GitHub](https://github.com/tangem)

[Twitter](https://twitter.com/tangem)

[Website](https://tangem.com/en/)

## [](#vpn-47)VPN

Name

Telegram

GitHub

Twitter

Website

Connecton VPN

[Telegram](https://t.me/ConnectonBot)

[GitHub](https://github.com/Connecton)

[Twitter](https://twitter.com/ConnectonVPN)

[Website](https://connecton.surf)

VPN4TON

[Telegram](https://t.me/vpn4ton_bot)

hitvpnbot

[Telegram](https://t.me/hitvpnbot)

Plume Proxy

[Telegram](https://t.me/plumeproxy_bot)

NETZ.RUN VPN

[Telegram](https://t.me/netzrun_bot)

Tako VPN

[Telegram](https://ton.app/vpn/takovpn-bot)

## [](#gambling-and-skill-based-games-48)Gambling and Skill-based games

Name

Telegram

GitHub

Twitter

Website

@Whale

[Telegram](https://t.me/Whalegames_bot)

JetTon Games

[Telegram](https://t.me/JetTon)

[Twitter](https://twitter.com/kanalabs)

Classic TON

[Website](https://classic.ton-game.com/)

Gambling Bot

[Telegram](https://t.me/ton_games_and_more)

TON Lottery

[Telegram](https://t.me/TonProject_bot)

Grand Casino TON

[Telegram](https://t.me/TG_grand_casino_bot)

TON Casino

[Website](https://toncasino.io/)

Bitsler

[Telegram](https://t.me/bitsler_casino)

[Twitter](https://twitter.com/Bitsler)

[Website](https://www.bitsler.com/)

TON Games

[Telegram](https://t.me/ton_games_and_more)

[Website](https://ton-game.com/)

FAN TON

[Telegram](https://t.me/FanTonGameBot)

[Twitter](https://twitter.com/FantasyFanton)

[Website](https://fan-ton.com/)

Prophecy Pulse

[Telegram](https://t.me/prophecypulse_bot)

[Twitter](https://twitter.com/ProphecyPulse)

[Website](https://www.prophecypulse.xyz/)

Wagmi 11

[Telegram](https://t.me/wagmi11)

[GitHub](https://github.com/wagmi11)

[Twitter](https://twitter.com/wagmi_11)

[Website](https://www.wagmi11.com/)

Panda Loto

[Telegram](https://t.me/PandaLotteryBot)

TonTogether

[Telegram](https://t.me/ton_together)

[Twitter](https://twitter.com/TogetherTON)

[Website](https://tontogether.com)

## [](#inscriptions-49)Inscriptions

Name

Telegram

GitHub

Twitter

Website

Tonano

[Telegram](https://t.me/tonanoOfficial)

[Twitter](https://twitter.com/Ton_scription)

[Website](https://tonano.io)

Shard.Zone

[Telegram](https://t.me/TonShardZone)

[Twitter](https://twitter.com/ShardMarket)

[Website](https://shard.zone)

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/ton-society/ecosystem-map)

![](https://tonresear.ch/uploads/default/optimized/1X/362e671e9fe2172a632f99e345f4dd1e16922380_2_690x345.png)

### [GitHub - ton-society/ecosystem-map: TON Ecosystem Map](https://github.com/ton-society/ecosystem-map)

TON Ecosystem Map. Contribute to ton-society/ecosystem-map development by creating an account on GitHub.

  22 Likes

[Https://t.me/tonresear\_ch](https://tonresear.ch/t/https-t-me-tonresear-ch/1110) 

[Howard](https://tonresear.ch/u/Howard)  March 19, 2024, 11:01am  4

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/ton-society/ecosystem-map?tab=readme-ov-file#pow)

![](https://tonresear.ch/uploads/default/optimized/1X/362e671e9fe2172a632f99e345f4dd1e16922380_2_690x345.png)

### [GitHub - ton-society/ecosystem-map: TON Ecosystem Map](https://github.com/ton-society/ecosystem-map?tab=readme-ov-file#pow)

TON Ecosystem Map. Contribute to ton-society/ecosystem-map development by creating an account on GitHub.

剛剛更新 POW area

  19 Likes

[fardint](https://tonresear.ch/u/fardint) March 19, 2024, 2:09pm  5

That is really helpful  
Thanks buddy

  12 Likes

[toncoinco](https://tonresear.ch/u/toncoinco) March 25, 2024, 11:27am  6

![](https://tonresear.ch/user_avatar/tonresear.ch/doge/48/17_2.png) doge:

> NFT Access Guardian Bot

NFT Access Guardian Bot not work,

this is a much needed bot, if it is possible to update it to make it work

  9 Likes

[zacalder](https://tonresear.ch/u/zacalder) May 19, 2024, 9:47pm  10

thank you thats be usefull for me gratefully

  7 Likes

[fn23](https://tonresear.ch/u/fn23) June 4, 2024, 9:05pm  11

it is very interesting to say the least

  6 Likes

[K\_sohbatzadeh](https://tonresear.ch/u/K_sohbatzadeh) June 6, 2024, 4:47am  12

![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:pray:](https://tonresear.ch/images/emoji/twitter/pray.png?v=12 ":pray:")![:pray:](https://tonresear.ch/images/emoji/twitter/pray.png?v=12 ":pray:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:palms_up_together:](https://tonresear.ch/images/emoji/twitter/palms_up_together.png?v=12 ":palms_up_together:")![:palms_up_together:](https://tonresear.ch/images/emoji/twitter/palms_up_together.png?v=12 ":palms_up_together:")![:palms_up_together:](https://tonresear.ch/images/emoji/twitter/palms_up_together.png?v=12 ":palms_up_together:")![:palms_up_together:](https://tonresear.ch/images/emoji/twitter/palms_up_together.png?v=12 ":palms_up_together:")![:palms_up_together:](https://tonresear.ch/images/emoji/twitter/palms_up_together.png?v=12 ":palms_up_together:")![:palms_up_together:](https://tonresear.ch/images/emoji/twitter/palms_up_together.png?v=12 ":palms_up_together:")![:palms_up_together:](https://tonresear.ch/images/emoji/twitter/palms_up_together.png?v=12 ":palms_up_together:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")![:clap:](https://tonresear.ch/images/emoji/twitter/clap.png?v=12 ":clap:")

  4 Likes

[Samyoo](https://tonresear.ch/u/Samyoo) June 11, 2024, 9:33pm  13

Bullish on this great ecosystem

  4 Likes

[Eddie\_Ray](https://tonresear.ch/u/Eddie_Ray) July 2, 2024, 11:11am  14

Nice Ton ecosystem

Very intresting too be on check .

  3 Likes

[VWSforever](https://tonresear.ch/u/VWSforever) July 10, 2024, 10:51am  15

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/games/clicker-vws?id=2260)

### [Clicker VWS - Clicker VWS GameFi and SocialFi DAO Telegram Community. Swap...](https://ton.app/games/clicker-vws?id=2260)

Clicker VWS Web3 Bot - https://t.me/ClickerVWSBot GameFi and SocialFi Staking VWS,TON, cNfts,NFTs. Bridge BNB TON VWS MVP Swap VWS MVP DeDust xRocket Mining Pools VWS/TON MVP/TON DeDust Mining NFTs GetGems

  6 Likes

[Esi\_1747](https://tonresear.ch/u/Esi_1747) July 29, 2024, 4:00am  16

Everybody Join the game with Bump by MMpro Trust and Tonkeeper! Start earning real money! Collect points, redeem for valuable pre-IPO assets, or sell for money. Plus, earn 10% of all points your friends collect. Don’t miss out on this opportunity to become a co-owner of major companies.  
![:fire:](https://tonresear.ch/images/emoji/twitter/fire.png?v=12 ":fire:")![:flower_playing_cards:](https://tonresear.ch/images/emoji/twitter/flower_playing_cards.png?v=12 ":flower_playing_cards:")  
Click the link to get started: [Telegram: Contact @MMproBump\_bot](https://t.me/MMproBump_bot?start=ref_318424274)

  3 Likes

[Manmalles](https://tonresear.ch/u/Manmalles) September 9, 2024, 6:20am  17

This is amazing and indeed nice project best wishes

  3 Likes

[SAKUYA](https://tonresear.ch/u/SAKUYA) September 11, 2024, 3:37pm  18

great! it is very useful for me and i can see the updates

  6 Likes

[0xMac](https://tonresear.ch/u/0xMac) September 21, 2024, 5:21am  19

hi guys, don’t know how to start a new topic. Can’t find the +new topic button ![:joy:](https://tonresear.ch/images/emoji/twitter/joy.png?v=12 ":joy:")  
Is there a level limit for that?

  1 Like

[MrZBOY](https://tonresear.ch/u/MrZBOY) September 22, 2024, 7:55am  20

@tcat on ton is more way sweet with a big move to the moon.

  2 Likes

[VirtualsWorlds\_Magic](https://tonresear.ch/u/VirtualsWorlds_Magic) October 27, 2024, 11:17am  21

$40 ![:money_with_wings:](https://tonresear.ch/images/emoji/twitter/money_with_wings.png?v=12 ":money_with_wings:")![:gift:](https://tonresear.ch/images/emoji/twitter/gift.png?v=12 ":gift:") Referals Gaming Bonus for Mining GAME @ClickerVWSbot Q4 Listing All Mining Pool $VWS Mining NFTs Mining Chats  
![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Banned users will be stripped of the $40 Reward ![:x:](https://tonresear.ch/images/emoji/twitter/x.png?v=12 ":x:")

  2 Likes

[VirtualsWorlds\_Magic](https://tonresear.ch/u/VirtualsWorlds_Magic) October 27, 2024, 11:20am  22

$40 ![:money_with_wings:](https://tonresear.ch/images/emoji/twitter/money_with_wings.png?v=12 ":money_with_wings:")![:gift:](https://tonresear.ch/images/emoji/twitter/gift.png?v=12 ":gift:") Referals Gaming Bonus for Mining GAME [Telegram: Contact @ClickerVWSBot](https://t.me/ClickerVWSBot) Q4 Listing All Mining Pool $VWS Mining NFTs Mining Chats  
![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Banned users will be stripped of the $40 Reward ![:x:](https://tonresear.ch/images/emoji/twitter/x.png?v=12 ":x:")  
[Telegram: Contact @MagicVipClub](https://t.me/MagicVipClub)

  2 Likes

[VirtualsWorlds\_Magic](https://tonresear.ch/u/VirtualsWorlds_Magic) October 27, 2024, 11:28am  23

Hello People, Please look  
$40 ![:money_with_wings:](https://tonresear.ch/images/emoji/twitter/money_with_wings.png?v=12 ":money_with_wings:")![:gift:](https://tonresear.ch/images/emoji/twitter/gift.png?v=12 ":gift:") Referals Gaming #Bonus for #Mining #VWSGAME [Telegram: Contact @ClickerVWSBot](https://t.me/ClickerVWSBot) Q4 Listing All #Mining #Pool #$VWS #Mining #NFTs Mining Chats  
![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Banned users will be stripped of the $40 #Reward ![:x:](https://tonresear.ch/images/emoji/twitter/x.png?v=12 ":x:")  
[Telegram: Contact @tapps\_bot](https://t.me/tapps_bot/center?startapp=app_clickervws)  
[https://ton.app/games/clicker-vws?id=2260](https://ton.app/games/clicker-vws?id=2260)  
[Telegram: Contact @MagicVipClub](https://t.me/MagicVipClub)  
[ClickerVWS - TON Wiki (En)](https://tonwiki.space/wiki/ClickerVWS)

![](https://dedust.io/favicon-32x32.png) [dedust.io](https://dedust.io/swap/TON/VWS)

![](https://dedust.io/images/opengraph.jpg)

### [DeDust.io — AMM DEX on The Open Network](https://dedust.io/swap/TON/VWS)

Swap any token seamlessly with minimal fees on DeDust.io, a leading decentralized automated market maker (AMM) running on The Open Network. Your ideal trade is just a click away with DeDust.io.

![](https://dedust.io/favicon-32x32.png) [dedust.io](https://dedust.io/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

![](https://dedust.io/images/opengraph.jpg)

### [DeDust.io — AMM DEX on The Open Network](https://dedust.io/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

Swap any token seamlessly with minimal fees on DeDust.io, a leading decentralized automated market maker (AMM) running on The Open Network. Your ideal trade is just a click away with DeDust.io.

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/xrocket/cex?startapp=trade-VWS-TON)

![](https://cdn4.cdn-telegram.org/file/KnPLkROVR9yKQCd1roysSu7wNpKfoFqQdMWznXzfSnjejB-zsEUVvU1_aXhnQCa7GsD3xq22R5HYfEUvpnu2b8mFoTjxN4OYkERm3Atc4hws8QYsyp0GyytEJuLezIM2ICy-HgShsltIfTeWXc58TscJ8iXNHh9ru0UU61-gU8Hgq_6lwI702yLdUNt5Fbs-U5MlrCLqHhUk_CpIHm_0QSSNzF3FcAakp9eGOj7g2LxUwXtfUDA4e0VMpRwQHGOV5juu7a1y-maOK0JrbNrJIhCjy2bMkOtfFHL915gN1PrYGnFEOB2L38xHDHitNHx12VvzDSP-5uJjKbj9ZgOq3g.jpg)

### [xRocket](https://t.me/xrocket/cex?startapp=trade-VWS-TON)

Trade, send and receive popular cryptocurrencies

![](https://www.geckoterminal.com/images/favicon.ico) [geckoterminal.com](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

![](https://assets.geckoterminal.com/social/social-sharing.png)

### [VWS/TON - Virtuals Worlds Price on DeDust with 0.25% Fee | GeckoTerminal](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

VWS/TON price today is $0.00000009962 with a 24-hour trading volume of $4.93. Virtuals Worlds contract address is EQBfX...Y8\_h with $7,604.70 in liquidity.

[https://dexscreener.com/ton/eqcca6ja\_vzoqi76cahmumojfzbglvty-dl-k8-f9h3vuoy2](https://dexscreener.com/ton/eqcca6ja_vzoqi76cahmumojfzbglvty-dl-k8-f9h3vuoy2)

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/MagicNFTcollections)

![](https://cdn4.cdn-telegram.org/file/NfiKA8YOkiu-5h5hLsa-tG_BMKZbuY_NWfghNIVICln56YQo3cJYjX9nBCJQ7g_ptjl8HTZNP1YY3s-8C0B8yf9s0YULDN9r-0-iI3AFgeJAJZxyH_i8njBUnOJI8CxTE8HFfahlxuhPuP1m_YaD0xGWeb0OZuyQnWtaRKRWkgR4vv5oD-hwLQn0sfAZjFVO7c1rygtgbVJkMwFdAqAuXXI06nedSqz0jNv9ei8YANdD2WU-QZNNkobOCqL1ivsMXnwUbm3kT65bahL_NANWekhpP9NL6Vyp_jSx8J2jdq3mzGnH_2bFhsTcJ-tv6DDVL9SSsUxAl8q-0O7Oefc4Ng.jpg)

### [VWS Mining Chat EN](https://t.me/MagicNFTcollections)

https://t.me/ClickerVWSBot http://t.me/Web3VWS\_Bot https://t.me/MiningChatbot https://t.me/MagicVipClub https://t.me/miningvws https://t.me/VirtualsWorlds https://t.me/AirdropVWSbot https://t.me/AirdropNftOpensea https://t.me/MagicNftClub

[https://tonwiki.space/wiki/ClickerVWS](https://tonwiki.space/wiki/ClickerVWS)

  2 Likes

[VWSforever](https://tonresear.ch/u/VWSforever) November 1, 2024, 11:13am  24

1 000 000 Users Referals Gaming Bonus $ for Mining @ClickerVWSbot Q4 Listing All Mining Pool VWS Mining NFTs Mining Chats✅ Reward [Telegram: Contact @ClickerVWSBot](https://t.me/ClickerVWSBot)  
[Telegram: Contact @xrocket](https://t.me/xrocket?start=mci_hUAtwAv6DVRYYvd)

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 506

[TON Research](/)

# [\[WIP\] The Open Network 白皮書 (繁中)](/t/wip-the-open-network/506)

[中文 (简繁)](/c/zh/48) 

    

[doge](https://tonresear.ch/u/doge)  March 4, 2024, 12:18pm  1

# [](#the-open-network-1)The Open Network 白皮書翻譯專案

[![建立並發布PDF](https://github.com/awesome-doge/TON_Paper/actions/workflows/build_and_release.yml/badge.svg)](https://github.com/awesome-doge/TON_Paper/actions/workflows/build_and_release.yml) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/awesome-doge/TON_Paper) ![GitHub contributors](https://img.shields.io/github/contributors/awesome-doge/TON_Paper)  
![GitHub issues](https://img.shields.io/github/issues/awesome-doge/TON_Paper) ![GitHub pull requests](https://img.shields.io/github/issues-pr/awesome-doge/TON_Paper) ![GitHub license](https://img.shields.io/github/license/awesome-doge/TON_Paper)

此專案旨在為 The Open Network 白皮書提供高品質的翻譯和編譯版本，以促進全球社群的接觸和了解。

## [](#h-2)![:open_book:](https://tonresear.ch/images/emoji/twitter/open_book.png?v=12 ":open_book:") 文件一覽

以下表格提供了每篇文件的英文和中文版本連結：

文件名稱

英文版本 (.tex)

英文版本 (.pdf)

中文版本 (.tex)

中文版本 (.pdf)

Catchain

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_catchain.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_catchain.pdf)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_catchain.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_catchain.pdf)

Fiftbase

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_fiftbase.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_fiftbase.pdf)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_fiftbase.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_fiftbase.pdf)

Tblkch

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_tblkch.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_tblkch.pdf)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_tblkch.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_tblkch.pdf)

TON

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_ton.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_ton.pdf)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_ton.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_ton.pdf)

TVM

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_tvm.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/en_tvm.pdf)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_tvm.tex)

[Link](https://github.com/awesome-doge/TON_Paper/blob/main/zh_tvm.pdf)

_注：當`.tex`文件被推送到主分支時，將由GitHub Actions工作流程自動編譯為PDF版本。_

## [](#pdf-3)![:inbox_tray:](https://tonresear.ch/images/emoji/twitter/inbox_tray.png?v=12 ":inbox_tray:") 已編譯的 PDF 版本

可在[發布區域](https://github.com/awesome-doge/TON_Paper/releases)查找已編譯的PDF文件。

## [](#h-4)![:handshake:](https://tonresear.ch/images/emoji/twitter/handshake.png?v=12 ":handshake:") 如何參與

我們歡迎並鼓勵各類型的貢獻！無論是翻譯優化或佈局修正，您的參與都是我們的寶貴資產。開始參與之前，請先參考貢獻指南。

## [](#h-5)![:scroll:](https://tonresear.ch/images/emoji/twitter/scroll.png?v=12 ":scroll:") 授權

本專案下的所有內容均已在 MIT 授權 下授權。

![](https://github.githubassets.com/favicons/favicon.svg) [github.com](https://github.com/awesome-doge/TON_Paper/tree/main)

### [GitHub - awesome-doge/TON\_Paper: The Open Network 白皮書翻譯專案](https://github.com/awesome-doge/TON_Paper/tree/main)

[main](https://github.com/awesome-doge/TON_Paper/tree/main)

The Open Network 白皮書翻譯專案. Contribute to awesome-doge/TON\_Paper development by creating an account on GitHub.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 507

[TON Research](/)

# [The Open Network 白皮书 (简体中)](/t/the-open-network/507)

[中文 (简繁)](/c/zh/48) 

    

[doge](https://tonresear.ch/u/doge)  March 4, 2024, 12:24pm  1

# [](#ton-1)Ton 区块链简体中文白皮书

## [](#h-2)说明

为了更方便国内开发者了解和学习Ton区块链，因此翻译英文版本的Ton区块链白皮书为简体中文版本。  
对应的英文版本下载链接为：[https://docs.ton.org/ton.pdf](https://docs.ton.org/ton.pdf)  
为使读者有更好的阅读体验，翻译版本对原英文版的内容可能会做非常微小的修改或增减，同时还会附带一些翻译者的解释。  
本Ton区块链简体中文白皮书由Kenetic Captital的Kojhliang编写翻译，遵循MIT协议授权。

[github.com](https://github.com/kojhliang/Ton_White_Paper_SC/blob/main/Ton%E5%8C%BA%E5%9D%97%E9%93%BE%E7%99%BD%E7%9A%AE%E4%B9%A6_%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E7%89%88.pdf)

#### [kojhliang/Ton\_White\_Paper\_SC/blob/main/Ton区块链白皮书\_简体中文版.pdf](https://github.com/kojhliang/Ton_White_Paper_SC/blob/main/Ton%E5%8C%BA%E5%9D%97%E9%93%BE%E7%99%BD%E7%9A%AE%E4%B9%A6_%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E7%89%88.pdf)

This file is binary. [show original](https://github.com/kojhliang/Ton_White_Paper_SC/blob/main/Ton%E5%8C%BA%E5%9D%97%E9%93%BE%E7%99%BD%E7%9A%AE%E4%B9%A6_%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E7%89%88.pdf)

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 509

[TON Research](/)

# [🌟 加入TON Hacker House，開啟你的Web3冒險之旅！](/t/ton-hacker-house-web3/509)

[中文 (简繁)](/c/zh/48) 

    

[QianXuesen](https://tonresear.ch/u/QianXuesen)   March 4, 2024, 4:39pm  1

![](https://tonresear.ch/uploads/default/original/1X/c2cad591381d37b7cf1e87f980d3ff220c4ab233.png) [tonhackerhouse.com](https://tonhackerhouse.com/zh-tc)

![](https://tonresear.ch/uploads/default/original/1X/4a4cc98c420d331646fefc0b2dcdb97557827c22.png)

### [TON DEV journey](https://tonhackerhouse.com/zh-tc)

TON DEV Journey 是由 TON 基金會支援的最可靠的 TON 開發工具計劃，旨在讓 TON 區塊鏈上搭建專案變得更加容易。

[![截圖 2024-02-26 晚上9.30.43](https://tonresear.ch/uploads/default/optimized/1X/797d55b23ad917affcdfc4107777df2dc420d563_2_690x322.jpeg)

截圖 2024-02-26 晚上9.30.431920×898 28 KB

](https://tonresear.ch/uploads/default/original/1X/797d55b23ad917affcdfc4107777df2dc420d563.jpeg "截圖 2024-02-26 晚上9.30.43")

![:tada:](https://tonresear.ch/images/emoji/twitter/tada.png?v=12 ":tada:") TON為全球開發者帶來激動人心的「TON DEV Journey」活動，持續三個月的精彩旅程正式啟動！![:fire:](https://tonresear.ch/images/emoji/twitter/fire.png?v=12 ":fire:") 參與者將有機會獲得免費課程、官方開發工具TonFura的專屬使用權，並爭奪超過百萬美金的生態獎金！![:moneybag:](https://tonresear.ch/images/emoji/twitter/moneybag.png?v=12 ":moneybag:")

![:earth_africa:](https://tonresear.ch/images/emoji/twitter/earth_africa.png?v=12 ":earth_africa:") 背靠Telegram全球超過8億用戶，黑馬公鏈TON正式舉辦「TON DEV Journey」活動。參與者將接受免費的扎實課程、獨家使用官方開發工具TonFura，冠軍更有機會前往香港參加TON HackerHouse！![:airplane:](https://tonresear.ch/images/emoji/twitter/airplane.png?v=12 ":airplane:")![:trophy:](https://tonresear.ch/images/emoji/twitter/trophy.png?v=12 ":trophy:")

![:date:](https://tonresear.ch/images/emoji/twitter/date.png?v=12 ":date:") **TON DEV Journey** 將涵蓋6場工作坊（台灣、香港兩地舉辦）、2天Demo Days、以及1場Hacker House。![:hammer_and_wrench:](https://tonresear.ch/images/emoji/twitter/hammer_and_wrench.png?v=12 ":hammer_and_wrench:")

### [](#ton1-1)![:rainbow:](https://tonresear.ch/images/emoji/twitter/rainbow.png?v=12 ":rainbow:") **TON開發者系列工作坊＃1 活動回顧**

2月23日，首場TON開發者系列工作坊正式拉開序幕，我們邀請到TON資深開發者 @drawesomedoge 為我們講解2024「TON生態系內重要的變化」包含：

*   可以開啟大挖礦的 $GRAM ![:gem:](https://tonresear.ch/images/emoji/twitter/gem.png?v=12 ":gem:")
*   可以挖礦的 NFT Meridian ![:framed_picture:](https://tonresear.ch/images/emoji/twitter/framed_picture.png?v=12 ":framed_picture:")
*   還有以銘文為基底的 SquidGame …等精彩內容 ![:squid:](https://tonresear.ch/images/emoji/twitter/squid.png?v=12 ":squid:")

[![image4 | 動區動趨-最具影響力的區塊鏈新聞媒體](https://tonresear.ch/uploads/default/optimized/1X/b38a2bf02e8e191f001f7c402dce9e6e69665763_2_690x460.jpeg)

image4 | 動區動趨-最具影響力的區塊鏈新聞媒體1024×683 71.1 KB

](https://tonresear.ch/uploads/default/original/1X/b38a2bf02e8e191f001f7c402dce9e6e69665763.jpeg "image4 | 動區動趨-最具影響力的區塊鏈新聞媒體")

@drawesomedoge

本場活動還有TonFura第一線開發者Andy藉由「實際案例」，如：TonKey、TonFura、ZK面臨過的情況，讓參與者更加了解現在「第一線開發者會遇到的問題有哪些」。

[![image3 | 動區動趨-最具影響力的區塊鏈新聞媒體](https://tonresear.ch/uploads/default/optimized/1X/9e30b866510cf892c245d75eedef04f230e98729_2_690x460.jpeg)

image3 | 動區動趨-最具影響力的區塊鏈新聞媒體1024×683 57 KB

](https://tonresear.ch/uploads/default/original/1X/9e30b866510cf892c245d75eedef04f230e98729.jpeg "image3 | 動區動趨-最具影響力的區塊鏈新聞媒體")

TON Workshop TW 1 活動現場

[![image2 | 動區動趨-最具影響力的區塊鏈新聞媒體](https://tonresear.ch/uploads/default/optimized/1X/dbf0bef7c70bf74ec09925f778647fb7717a5127_2_690x460.jpeg)

image2 | 動區動趨-最具影響力的區塊鏈新聞媒體1024×683 70.5 KB

](https://tonresear.ch/uploads/default/original/1X/dbf0bef7c70bf74ec09925f778647fb7717a5127.jpeg "image2 | 動區動趨-最具影響力的區塊鏈新聞媒體")

TON Workshop TW 1 活動現場

#### [](#ton-dev-workshop-2)![:dragon:](https://tonresear.ch/images/emoji/twitter/dragon.png?v=12 ":dragon:") **TON DEV Workshop 臥虎藏龍**

在實際交流後，我們發現目前至少已有三組的專案進度已達到「Go to market ready」階段，如果你正在找尋你的夥伴，絕對不要錯過本週末的Workshop，透過現場交流找到你的隊友一起來「爭取破百萬美金的生態獎金」！

### [](#ton-dev-journey-3)![:tickets:](https://tonresear.ch/images/emoji/twitter/tickets.png?v=12 ":tickets:") **報名參加TON DEV Journey**

不管你是想加入TON的潛力團隊一同開發、已經有項目希望找到資源挹注、還

是社群愛好者，想要投入TON生態，都千萬不能錯過TON DEV Journey，展開你的Web3冒險旅程。

立馬報名TON DEV Journey：[點我報名](https://lu.ma/tondevjourney) ![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")

過去的活動

#### [](#tw2-4)**開發者系列工作坊TW＃2（台灣場）**：

｜活動報名：[點我報名](https://lu.ma/tondevworkshoptw02)  
｜活動時間：3月1日 18:00～22:00  
｜活動地點：陸角空間（台北市中正區金華街17號6樓）

#### [](#lightning-talk-5)![:cloud_with_lightning:](https://tonresear.ch/images/emoji/twitter/cloud_with_lightning.png?v=12 ":cloud_with_lightning:") 閃電講「Lightning Talk」報名：

無論你是否參加了上週在台灣和香港舉行的首場活動，都可以透過工作坊的閃電講「Lightning Talk」環節，獲得TON資深開發者的「反饋和建議」，歡迎與我們分享：

*   自身開發經驗 ![:computer:](https://tonresear.ch/images/emoji/twitter/computer.png?v=12 ":computer:")
*   分享在Ton生態系看到什麼？ ![:seedling:](https://tonresear.ch/images/emoji/twitter/seedling.png?v=12 ":seedling:")
*   提出許願清單 ![:memo:](https://tonresear.ch/images/emoji/twitter/memo.png?v=12 ":memo:")
*   發表自己的產品，無論項目處於何種階段 ![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")

｜即刻前往[報名連結](https://docs.google.com/forms/d/e/1FAIpQLSej8UDfIbIzgy1dER2YmXo6lE-mP1Vpevlb5aScmfY3RxvaeA/viewform)

#### [](#hk2-6)**開發者系列工作坊HK＃2（香港線上場）**：

｜活動報名：[點我報名](https://lu.ma/tondevworkshophk02)  
｜活動時間：3月2日 19:00～22:00  
｜線上連結：[點我參加](https://lihi.cc/808o5)

### [](#dev-journey-7)![:trophy:](https://tonresear.ch/images/emoji/twitter/trophy.png?v=12 ":trophy:") **能從DEV Journey獲得什麼**

*   **獎項和認證** ：最高價值1,000,000美元的生態系統獎金，並可對接顧問及雲端服務支援，獲得TON基金會官方認證。 ![:medal_sports:](https://tonresear.ch/images/emoji/twitter/medal_sports.png?v=12 ":medal_sports:")
*   **技術資源** ：在開發過程中利用TonFura獲得技術支持和資源。 ![:wrench:](https://tonresear.ch/images/emoji/twitter/wrench.png?v=12 ":wrench:")
*   **網路和團隊建設** ：尋找潛在團隊成員，加入現有項目，或與志同道合的人建立聯繫。 ![:busts_in_silhouette:](https://tonresear.ch/images/emoji/twitter/busts_in_silhouette.png?v=12 ":busts_in_silhouette:")
*   **反饋和發展** ：著重於建立、測試和完善你的想法，特別是在產品市場契合度上獲得直接反饋。 ![:bulb:](https://tonresear.ch/images/emoji/twitter/bulb.png?v=12 ":bulb:")
*   **向專家學習** ：從TON基金會的核心工程師那裡獲得寶貴的建議和支持。 ![:books:](https://tonresear.ch/images/emoji/twitter/books.png?v=12 ":books:")

* * *

**主辦單位**：TonX Studio、TON Foundation  
**贊助單位**：TonFura、Google Cloud、TonBit  
**合作夥伴**：TONcoin.Fund、ANDROMEDA Capital、Everest Ventures Group、Existential Capital、GBV、PAKA、TempoX  
**媒體夥伴**：BlockTempo、PANews、Foresight News  
**社群夥伴**：852 Web3

![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:star2:](https://tonresear.ch/images/emoji/twitter/star2.png?v=12 ":star2:") **不要猶豫，立刻加入我們，一起開創屬於你的Web3奇蹟！** ![:star2:](https://tonresear.ch/images/emoji/twitter/star2.png?v=12 ":star2:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 51

[TON Research](/)

# [Analyzing the Nominator Pool Smart Contract in Blockchain Networks: A Technical and Functional Overview](/t/analyzing-the-nominator-pool-smart-contract-in-blockchain-networks-a-technical-and-functional-overview/51)

[TON Blockchain](/c/ton-blockchain/build-node/21)  [TON Node](/c/ton-blockchain/build-node/21) 

[nominator](https://tonresear.ch/tag/nominator)

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 2:06pm  1

The Nominator Pool Smart Contract, pivotal in managing large-scale cryptocurrency transactions, presents a sophisticated framework in blockchain networks. This contract, designed primarily for handling substantial amounts of coins, emphasizes safety and simplicity while imposing certain operational limits and structures. Understanding its intricacies involves exploring several key components and functionalities, crucial for stakeholders like nominators, validators, and developers.

The purpose of this analysis is to dissect the Nominator Pool Smart Contract, focusing on the following specific aspects:

1.  **Operational Limits and Configurations**: What are the defined limits for the Nominator Pool Smart Contract, such as the minimum nominator stake, the maximum number of nominators, and the implications of these limits on the pool’s functionality and scalability?
2.  **Fee Structure and Distribution Mechanics**: How are operational fees determined and distributed within the contract, particularly considering the high fee environment of the masterchain and the validator’s role in fee payment?
3.  **Reward Distribution Algorithm**: Can you detail the mathematical formulae and processes involved in calculating and distributing rewards among validators and nominators, including scenarios of both successful validation rewards and fines for validation failures?
4.  **Validator Responsibilities and Stake Requirements**: What are the specific responsibilities and minimum stake requirements for validators within this smart contract, and how do these factors impact the pool’s participation in validation rounds?
5.  **Nominator Interaction Protocols**: How do nominators interact with the pool through messages, and what are the protocols for depositing, voting, and withdrawing funds, including the handling of errors and non-bounceable messages?
6.  **Emergency Procedures and Operational Messages**: What emergency mechanisms are in place, such as for validator unresponsiveness, and how are operational messages like withdraw requests and voting for network config proposals managed?
7.  **Smart Contract Methods and Data Retrieval**: What are the key get-methods such as `get_pool_data`, `list_nominators`, and `get_nominator_data`, and how do they function to provide essential information about the pool’s state, nominator details, and voting data?
8.  **Integration Considerations for Wallet Applications**: What are the guidelines for integrating this smart contract into wallet applications, specifically for managing deposits, withdrawals, and tracking profits and pool information?

This comprehensive inquiry aims to offer a detailed understanding of the Nominator Pool Smart Contract’s structure, operational dynamics, and its implications for various participants within the blockchain network.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 511

[TON Research](/)

# [Erc-404来了，trc-404还会远吗？](/t/erc-404-trc-404/511)

[中文 (简繁)](/c/zh/48) 

[tep](https://tonresear.ch/tag/tep)

    

[andrew](https://tonresear.ch/u/andrew)   March 5, 2024, 1:51am  1

# [](#erc-404trc-404-1)ERC-404来了，TRC-404还会远吗？

Andrew Tonx March 04, 2024

### [](#h-2)一、背景

2024 年 2 月初，正值农历春节期间，有一个关键词 **ERC-404**，如流星一样划过 Web3 领域，然后又几乎销声匿迹了。

然而我在参加一些行业聚会以及和一些朋友交流时，居然发现好几个都在“偷偷”进行 404 相关项目的开发，所以说 ERC-404 并不是销声匿迹了，而是正在积蓄能量，相信不久会破茧化蝶并涌现新的生态。

而之所以我相信 “404 生态” 将会爆发，是因为 ERC-404 创新的“流动性”和“可拆分性”方案，极大地改善了 NFT 收藏者和市场参与者的用户体验，并真正解锁了一种新的资产类别，半同质代币 (SFT, semi-fungible tokens)。

![](https://tonresear.ch/uploads/default/original/1X/ee81d21d1c37ad5c27bb894f68d594f1389a15c4.png)

ERC-404 是一种介于 [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) 和 [ERC-721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/) 之间的试验性的代币标准。 之所以代号是 “404”，最可能的原因是 ERC-404 并没有按照以太坊 ERC 的标准去提交，因此在 ERC 标准文档库中肯定是查询不到的，所以就直接用了 HTTP 标准码的 “**404 Not Found**” 来编号，属于一种冷幽默吧。

ERC-404 的代币 Pandora 可以在 Uniswap 等平台进行交易，类似于同质化代币(FT)。 1 枚 Pandora 代币可以对应 1 枚 Pandora Replicant NFT。数学关系如下：nReplicant NFT = \[nERC404\] 其中 \[n\] 表示不大于该数的最大整数， nReplicant NFT 表示 Replicant NFT 的数量，nERC404 表示 ERC404 代币的数量。

简单举例说明：凑齐 1 整枚代币即可持有一个 NFT。例如，用户持有0.5 个代币，他拥有0 个NFT；用户持有1 个代币，他拥有1 个NFT；用户持有1.5 个代币，他拥有1 个NFT；用户持有2 个代币，他拥有2 个NFT；以此类推。通过 ERC404 标准，Pandora 实现了类似 NFT 碎片化的效果。

从经济层面来看，当用户在看好某个 NFT 系列时，可以选择持有一定量的 FT 而非完整的 NFT，这对于资金配置而言更加灵活，同时也降低了参与 NFT 投资的资金门槛。

[![](https://tonresear.ch/uploads/default/optimized/1X/0fbc33c34a7389b441ee1670f2ad414a3acdc63e_2_375x500.jpeg)

900×1200 298 KB

](https://tonresear.ch/uploads/default/original/1X/0fbc33c34a7389b441ee1670f2ad414a3acdc63e.jpeg)

ERC-404 格式的 Replicant NFT 与常见的 ERC-721 格式的 NFT 不同，Replicant NFT 有着燃烧和重新铸造的机制，当用户对 ERC-404 进行转账或交易等操作时即会触发。

整数的 ERC-404 代币会与 Replicant NFT 绑定，因此当 ERC-404 代币发生变动时，Replicant NFT 也会发生变动。

这里有两种情况：

1.  当用户出售 ERC404 代币时，用户钱包中的 Replicant NFT 会被燃烧。
2.  当用户转账时，Sender 钱包中的 ReplicantNFT 会被燃烧，然后在 Receiver 钱包重新铸造出新的 ReplicantNFT。

[![](https://tonresear.ch/uploads/default/original/1X/9005a49b2862299413a65dd7d583e930272bfe3a.png)

1300×650 21.7 KB

](https://tonresear.ch/uploads/default/original/1X/9005a49b2862299413a65dd7d583e930272bfe3a.png)

每一次重新铸造，Replicant NFT 的特征都会重新刷新，稀有度也可能随之发生变化。因此，如果用户对他的 NFT 不满意，他可以将其不断的进行转账以刷新 NFT 直至获得喜欢的 NFT。

ERC-404 旨在为以太坊区块链上的数字资产提供多功能性、原生流动性和可编程稀缺性。 ERC-404 标准虽然是非官方的和实验性的，但促进了 NFT 的所有权流转，为 NFT 领域的实验和交易开辟了新的途径。它允许在单一代币标准中实现可替代性和不可替代性的独特融合，为数字资产管理和交易中的创新应用和实用性提供了潜力。

### [](#h-3)二、人物

Pandora 团队目前为匿名状态，根据网上已有信息，其中 Acme 是 GitHub 最初提交者，从他的社交账号来看他是 Coinbase 的工程师。另外一个 Crowd Ctrl 则更加神秘。

**Acme**

*   [https://twitter.com/0xacme](https://twitter.com/0xacme)

**Crowd Ctrl**

*   [https://twitter.com/maybectrlfreak](https://twitter.com/maybectrlfreak)

### [](#h-4)三、实现标准

如下图所示，我对比了 3 个标准之间的方法和事件，因为 ERC-404 是融合了 ERC-20 和 ERC-721 标准，所以新增了很多方法，其中相对标准的方法我使用了蓝色字体标注。

基于 ERC-404 的实现逻辑和代码的复杂性，当前 ERC-404 有如下一些让人不喜的问题：

*   \*\*NFT 稀有度无差别问题：\*\*通过 FT 转账而触发的 NFT 的转移，会进行无差别转移，不考虑稀有度。
*   \*\*FT 精度问题烧毁NFT问题 ：\*\*如果 FT 从 3 变成 2.99999999，也会烧毁一个 NFT。
*   **增加 Gas 消耗问题：** 因为 ERC-404 协议本身的复杂性，导致处理 FT 和 NFT 转移时增加很多 Gas。
*   **其他竞争标准列举的问题。**

[![](https://tonresear.ch/uploads/default/optimized/1X/82503ef26ee2e258bfeb5621d9f39a9f0739ace9_2_572x500.png)

967×845 303 KB

](https://tonresear.ch/uploads/default/original/1X/82503ef26ee2e258bfeb5621d9f39a9f0739ace9.png)

### [](#h-5)四、竞争协议

因为上述的 ERC-404 潜在问题，Ethereum 开发者（代号 cygaar" 与 quit）很快推出 DN-404，其中 DN 是**Divisible NFT** 的缩写，试图解决面临的一些核心问题，特别是在效率和交易费用方面：

1.  **简化智能合约复杂度：** 透过分离 ERC-20 和 ERC-721 功能到两个独立的合约，DN-404 减少了智能合约的复杂性。这不仅使合约更容易理解和审计，还可能降低因复杂度引入漏洞的风险。
2.  **提高效率和降低交易费用：** DN-404 透过优化智能合约的结构和操作，预计能对交易费用的影响减少 20%。这是透过将原本在ERC-404 中尝试在单一合约中融合可替代和不可替代代币的功能，分割成两个分开的合约来实现的—— 一个基于ERC-20 的“基础” 合约和一个基于ERC-721 的“镜像” 合约。
3.  **（高优先级）兼容既有标准：** DN-404 的兼容设计，允许 ERC-721 “镜像” 合约，可以像标准的 ERC-721 合约一样被处理，确保了与现有支持 ERC-721 的其他协议的兼容性。这种设计支持了更广泛的生态系统整合，而不需要修改现有的基础设施来适应新的代币标准。
4.  **无缝整合流程：** 当基础ERC-20 代币被转移时，对应的镜像 NFT 会自动被铸造或销毁，这提供了一个流畅且无缝的使用者体验，并且保持了 FT 和 NFT 之间的紧密联系。
5.  极端情况优化： DN-404 旨在解决 ERC-404 在某些边缘条件下可能遇到的问题，比如重组后的 NFT 可能与其原始状态不同的问题，透过更明确的合约逻辑和操作来达成这一点。

### [](#trc-404-6)五、TRC-404？

ERC404 是一项重大创新，可为 FT 和 NFT 提供各种新的交互机制和链上新协议。它的混合性质为游戏、生成艺术、现实世界资产（RWA）等领域的大量新用例带来潜力。比如其 NFT 燃烧重铸功能在游戏等特定应用场景依然有着很大的想象力。

那 404 协议在 TON 生态是否会爆发？ 我知道的是已经有几个团队正在 TON 上开发 404 相关项目。当然基于 TON 的异步并发特性，想要混合 Jetton 和 NFT 并且保持低的 gas fee 其实蛮有挑战的一个工作，同时还需要考虑“生态兼容性和可组合性”，但是我相信不久会看到 TRC-404 全面开花。

[![](https://tonresear.ch/uploads/default/optimized/1X/3537bb3a3c6ce9939f8298d331b35001f35f105d_2_690x231.png)

1100×369 137 KB

](https://tonresear.ch/uploads/default/original/1X/3537bb3a3c6ce9939f8298d331b35001f35f105d.png)

### [](#h-7)六，参考资料

#### [](#pandora-8)Pandora

*   网站 [https://www.pandora.build/](https://www.pandora.build/)
    
*   github [GitHub - Pandora-Labs-Org/erc404](https://github.com/Pandora-Labs-Org/erc404)
    
*   𝕏: [https://twitter.com/Pandora\_ERC404](https://twitter.com/Pandora_ERC404)
    
*   Pandora Token
    
*   [Pandora price today, PANDORA to USD live price, marketcap and chart | CoinMarketCap](https://coinmarketcap.com/currencies/pandora-coin/)
    
*   Pandora NFT
    
*   [https://opensea.io/collection/pandora-replicants](https://opensea.io/collection/pandora-replicants)
    
*   [Collection | Blur](https://blur.io/collection/pandora-replicants)
    
*   [https://nftgo.io/collection/pandora/nfts](https://nftgo.io/collection/pandora/nfts)
    

#### [](#h-9)相关文章

*   [https://foresightnews.pro/article/detail/53366](https://foresightnews.pro/article/detail/53366)
*   [ERC-404 Explained](https://mercuryo.io/explore/article/erc404)
*   [DN-404: The Gas-Efficient Approach to Fractional NFT](https://tokenminds.co/blog/blockchain-development/fractional-nft)

  3 Likes

[Howard](https://tonresear.ch/u/Howard) March 19, 2024, 10:20am  2

質量很好啊！感謝分析跟解釋。

圖片準備得很好。

 

[Joey\_Xie](https://tonresear.ch/u/Joey_Xie) April 25, 2024, 2:03pm  3

看uniswap和opensea上，pandora都没流动性了，你说的那些团队还在继续开发吗？我感觉把ERC1155标准实现到Ton上是更紧急的

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 512

[TON Research](/)

# [Jetton in Tact 架构图示](/t/jetton-in-tact/512)

[中文 (简繁)](/c/zh/48) 

[learn](https://tonresear.ch/tag/learn)

    

[andrew](https://tonresear.ch/u/andrew)   March 5, 2024, 1:56am  1

下图展示了，如何通过 Tact 语言实现一个Jetton。

[![Jetton 图示 (1)](https://tonresear.ch/uploads/default/optimized/1X/7e75efab84b311c58747dae56bd04ad7ecdb31a8_2_690x495.jpeg)

Jetton 图示 (1)1920×1378 112 KB

](https://tonresear.ch/uploads/default/original/1X/7e75efab84b311c58747dae56bd04ad7ecdb31a8.jpeg "Jetton 图示 (1)")

  2 Likes

[Howard](https://tonresear.ch/u/Howard)  March 5, 2024, 2:27am  2

[![](https://tonresear.ch/uploads/default/original/1X/9d16d6d2263e1366527be9cf33d5b42604f5f087.jpeg "Jetton 代幣詳解 (ERC20) in TON | TON Blockchain")](https://www.youtube.com/watch?v=ikYavd9tZpM)

影片支持講解 jetton

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 513

[TON Research](/)

# [Something happened but we don't understand what](/t/something-happened-but-we-dont-understand-what/513)

[中文 (简繁)](/c/zh/48) 

    

[andrew](https://tonresear.ch/u/andrew)   March 5, 2024, 2:05am  1

# [](#something-happened-but-we-dont-understand-what-1)Something happened but we don’t understand what.

TON Viewer 浏览器([https://tonviewer.com](https://tonviewer.com/)) 非常简单易用，但是有时候对交易错误支持不够，比如经常是

> Something happened but we don’t understand what.

[![](https://tonresear.ch/uploads/default/optimized/1X/4feaddcf536d00defdbc5aac74a8e3c77cbba00e_2_690x227.png)

969×319 66.9 KB

](https://tonresear.ch/uploads/default/original/1X/4feaddcf536d00defdbc5aac74a8e3c77cbba00e.png)

这个时候，就需要学会看 Exit Code([TVM Exit codes | The Open Network](https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes)) 了。

[![](https://tonresear.ch/uploads/default/optimized/1X/5840e6f565a5cd52be0938b63431d44608497eab_2_690x465.jpeg)

1280×863 101 KB

](https://tonresear.ch/uploads/default/original/1X/5840e6f565a5cd52be0938b63431d44608497eab.jpeg)

如上图所示，是在 Compute Phase 返回了非 0 退出码， -14 代表 “out of gas”。

有时候，Compute Phase 返回了 0 退出码，那就是后续的 Action Phase 出现了异常。

[![](https://tonresear.ch/uploads/default/optimized/1X/ed4d7c15ea739daba8a377ecc9162bf3419785e3_2_607x500.jpeg)

1280×1053 98 KB

](https://tonresear.ch/uploads/default/original/1X/ed4d7c15ea739daba8a377ecc9162bf3419785e3.jpeg)

这个时候 tonviewer 没有更多细节了，则复制一下 交易 Hash，打开 DTON浏览器 ([https://dton.io](https://dton.io)) 用交易哈希去搜索， 看看具体 action 的错误码是什么。

如下图，是因为消息附带的 TON value 不够继续发送新消息了。

[![](https://tonresear.ch/uploads/default/optimized/1X/277b32c538dc6c0ea841d2e411c4327e43d5e8d4_2_690x458.jpeg)

1280×850 82.2 KB

](https://tonresear.ch/uploads/default/original/1X/277b32c538dc6c0ea841d2e411c4327e43d5e8d4.jpeg)

[![](https://tonresear.ch/uploads/default/optimized/1X/3537bb3a3c6ce9939f8298d331b35001f35f105d_2_690x231.png)

1100×369 137 KB

](https://tonresear.ch/uploads/default/original/1X/3537bb3a3c6ce9939f8298d331b35001f35f105d.png)

If you get gains，please give a like

Report content on this page

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 514

[TON Research](/)

# [\## ton 生态的铭文进化之路](/t/ton/514)

[中文 (简繁)](/c/zh/48) 

[learn](https://tonresear.ch/tag/learn)

    

[andrew](https://tonresear.ch/u/andrew)   March 5, 2024, 2:06am  1

# [](#ton-1)TON生态铭文进化之路

### [](#tonano-2)一、Tonano （首发龙头）

基于对 TG&TON 生态的期望，我在 2023 年底发起了 **TON心粉** 社区，争取做最棒的 TON 华语社区。

23年11月初，铭文之火燃烧到了 TON 生态，首个铭文项目 Tonano 一经推出就 … 额 … 揭开了 TON 生态的基础设施还比较“缺乏考验”的事实。

当时 **TON心粉** 也第一时间推出了自动化 Mint 的脚本，很多人都是通过这个脚本参与了 TON 生态首次大规模线上压测实验。

幸好，TON 的技术底盘足够扎实，实现了主网“动态分片”，通过增强验证节点硬件和修复一些性能问题，最终勉强通过了本次考验。

（_在这里还是要提一下，Tonano 说好的第一轮空投一直没有兑现，让人失望。_）

### [](#gram-20-3)二、Gram-20 （收费创新）

接在在23年12月，第二个TON生态铭文项目，Gram-20 也紧接着推出了。

技术实现上，和 Tonano 的将铭文信息提交到 _黑洞地址_ 或者 _个人钱包地址_ 不同， Gram-20 开始结合 TON 的智能合约去“做事情”。

不过做的这个事情让人有点失望，其原理是第一次mint的时候，给你部署一个专用合约，然后打一次要支付 0.968 TON 的手续费到这个合约， 积累到这个合约的 TON 到时候项目方会抽走。

[![](https://tonresear.ch/uploads/default/optimized/1X/3f8d87917c6d2365820b87fda261b46b4e525978_2_690x450.png)

1096×716 593 KB

](https://tonresear.ch/uploads/default/original/1X/3f8d87917c6d2365820b87fda261b46b4e525978.png)

### [](#tonot-4)三、TONOT (营销创新)

作为 TON 生态第三个铭文项目， TONOT 于2024年初推出，项目团队营销能力很强，在社交裂变和原生集成 Telegram Bot 上是下了功夫的。

但是因为一些技术问题，推出时间不是很好，最终这个项目我没有深度参与，只是试打了一些，期待后续有更多的玩法。

### [](#tbrc-5)四、TBRC (拭目以待)

TBRC 作为 TON 生态的第 4 个铭文项目，当前还处于早期“宣发”阶段，据其 Twitter 宣布，预计会在 2 月 9 日开始 mint。

我关注到这个项目是因为他们提交了一个 TEPs (TON Enhancement Proposals ), 编号 0142 TBRC-20 Inscription Token Standard，

这个 TEP-0142，将铭文和 Jetton 进行了有机结合，充分利用了 TON 智能合约消息的 Comment 属性。正如我之前的一篇文章提到， **TON 也许是最适合用来打铭文的区块链？TON 的每次交易都是一个合约调用，都有一个可选的 Comment 字段，适合放铭文信息。**

TBRC 将这个 Comment 进行标准化，除了 mint/transfer 之外，用户还可以在他们的 Jetton 钱包中列出(list/unlist)他们的代币出售方向。优点是消息可以手动构建，并且在钱包和区块浏览器中易于阅读，因此用户可以轻松检查和验证交易，从而提高便利性和安全性。

让我们一起来看看 TBRC 的表现吧！

### [](#h-6)五、结尾

TON Master Bot ([Telegram: Contact @ton\_master\_bot](https://t.me/ton_master_bot)) 新增 TBRC 菜单，并将保持更新，欢迎使用。

[![](https://tonresear.ch/uploads/default/optimized/1X/3c733f8acca629b602f8ae5cd93ede20800bc714_2_451x500.png)

1032×1144 98.5 KB

](https://tonresear.ch/uploads/default/original/1X/3c733f8acca629b602f8ae5cd93ede20800bc714.png)

欢迎关注 TON心粉 社区

T：[Telegram: Contact @tonx\_fans](https://t.me/tonx_fans)

𝕏: [https://x.com/tonx\_fans](https://x.com/tonx_fans)

[![](https://tonresear.ch/uploads/default/optimized/1X/f4a42e938af6ddb2232f91be113d3bbcba9fc114_2_690x231.png)

750×252 69 KB

](https://tonresear.ch/uploads/default/original/1X/f4a42e938af6ddb2232f91be113d3bbcba9fc114.png)

Report content on this page

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 515

[TON Research](/)

# [Tact 代码中的错误消息文本哪去了？浏览器上看不到？](/t/tact/515)

[中文 (简繁)](/c/zh/48) 

    

[andrew](https://tonresear.ch/u/andrew)   March 5, 2024, 2:09am  1

# [](#tact-1)Tact 中的错误消息文本哪去了？

群友咨询，类似以下的调用智能合约时报错返回的值“Invalid sender”，我在哪里能看到呢?

> require(ctx.sender == self.owner, “Invalid sender”); // Check sender

答案是，你在合约里面，永远看不到““Invalid sender””了 。

如果对 Tact 的行为有疑问，就打开对应的 FunC源代码，你就知道，编译后，就只剩下一个错误码了（Exit Code），对于我们自己写的代码异常，编译器会生成错误码，具体对应关系可以通过ABI文件来反推。

如果是TVM 里面的异常，看这个文档 [TVM Exit codes | The Open Network](https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes)

[![](https://tonresear.ch/uploads/default/optimized/1X/6eb95bf58c5d75fbe5c90d42c4393757edd051ce_2_690x229.png)

2502×832 332 KB

](https://tonresear.ch/uploads/default/original/1X/6eb95bf58c5d75fbe5c90d42c4393757edd051ce.png)

[![](https://tonresear.ch/uploads/default/optimized/1X/7992fa97dd5793c25f7e5d20963f0b413e877a38_2_690x183.png)

1182×314 36.3 KB

](https://tonresear.ch/uploads/default/original/1X/7992fa97dd5793c25f7e5d20963f0b413e877a38.png)

[![](https://tonresear.ch/uploads/default/optimized/1X/169e7a3be33aed3eebab871c7de99e5c7c71321d_2_401x500.png)

1080×1346 94.5 KB

](https://tonresear.ch/uploads/default/original/1X/169e7a3be33aed3eebab871c7de99e5c7c71321d.png)

比如，13或者-14，就是给的gas不够。

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 516

[TON Research](/)

# [V1.1 TON Research Update: New Features, Bug Fixes, and More! 🚀](/t/v1-1-ton-research-update-new-features-bug-fixes-and-more/516)

[Announcement](/c/announcement/5) 

    

[TonResearch](https://tonresear.ch/u/TonResearch)   March 5, 2024, 8:54am  1

Hello, Ton Research Community! We’re thrilled to bring you a host of updates that will elevate your experience on our forum. Here’s what’s new:

[![TG Announcement](https://tonresear.ch/uploads/default/optimized/1X/96625bd606107b66cb6c828cd669bea35ded0ca5_2_690x388.jpeg)

TG Announcement1800×1013 119 KB

](https://tonresear.ch/uploads/default/original/1X/96625bd606107b66cb6c828cd669bea35ded0ca5.jpeg "TG Announcement")

## [](#p-626-authentication-enhancements-1) **![:key:](https://tonresear.ch/images/emoji/twitter/key.png?v=12 ":key:") Authentication Enhancements:**

*   We’ve added **Google Sign-In**! Accessing the forum is now easier than ever with your Google account.
*   We’ve also added **GitHub Sign-In**! Developers can now conveniently log in using their GitHub credentials.

## [](#p-626-bug-fixes-2) **![:wrench:](https://tonresear.ch/images/emoji/twitter/wrench.png?v=12 ":wrench:") Bug Fixes:**

*   **OpenGraph issues** have been resolved, ensuring better link previews.
*   We’ve fixed the **mobile image display problems**, so browsing on your phones is now smoother.

## [](#p-626-localization-updates-3) **![:globe_with_meridians:](https://tonresear.ch/images/emoji/twitter/globe_with_meridians.png?v=12 ":globe_with_meridians:") Localization Updates:**

*   A **Russian section** has been added! Привет, русскоязычные пользователи!
*   A **Chinese section** has been added! 欢迎，中文用户！

## [](#p-626-new-features-4) **![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:") New Features:**

*   **Automatic Twitter bot**: Stay updated with our latest tweets via our automatic forwarding bot on [Ton Research Twitter](https://twitter.com/ton_research).
*   **Automatic Telegram channel forwarding**: Keep up with our Telegram channel updates through our automatic bot on [Ton Research Channel](https://t.me/tonresear_ch).
*   **Automatic forwarding bot** for Telegram: Follow [Ton Research Bot](https://t.me/ton_research_bot) for seamless updates.
*   **Ton Research Group**: Join our Telegram group at [Ton Research Chat](https://t.me/tonresearch_chat) for discussions and insights.
*   **Contributions to the TON ecosystem**: We’ve added TonResearch to the [TON blockchain repository](https://github.com/ton-blockchain/ton/pull/919), the [society’s ecosystem map](https://github.com/ton-society/ecosystem-map/pull/49), and the [awesome-ton list](https://github.com/ton-community/awesome-ton/pull/65).
*   **Enhanced website header**: We’ve added links for easier navigation.
*   **Improved Tags and Category settings**: Organizing and finding content is now more intuitive.
*   **Updated theme colors**: Our theme now aligns with the Telegram color palette for a more cohesive look.
*   **Added descriptions for all Categories**: Get a clearer understanding of each category’s focus.

We’re committed to continually improving the Ton Research Forum to provide you with the best platform for discussing and exploring the TON blockchain. Your feedback is invaluable to us, so please share your thoughts and suggestions.

Thank you for being a part of the Ton Research community! ![:raised_hands:](https://tonresear.ch/images/emoji/twitter/raised_hands.png?v=12 ":raised_hands:")

  2 Likes

[masoumeh\_koroushavi](https://tonresear.ch/u/masoumeh_koroushavi) March 11, 2024, 1:19am  2

(◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉) (◉‿◉)hiall

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 52

[TON Research](/)

# [Exploring the Diversity of Wallet Contracts in TON Blockchain: Versions, Features, and Use Cases](/t/exploring-the-diversity-of-wallet-contracts-in-ton-blockchain-versions-features-and-use-cases/52)

[Application](/c/application/20) 

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 2:07pm  1

The TON Blockchain stands out with its unique approach to wallet contracts, offering various versions and modifications. This diversity caters to different user needs and use cases. Our aim is to dissect these versions, understand their distinct features, and evaluate their practical applications.

1.  What are the fundamental differences between the various wallet versions (V1, V2, V3, V4) in TON Blockchain, and how do these differences impact the user experience and functionality of each wallet type?
2.  V1 wallets are noted for their simplicity but come with limitations, such as difficulty in retrieving seqno and public key, and lack of a valid\_until check. How do these limitations affect the security and usability of V1 wallets compared to later versions?
3.  V3 wallets introduced the subwallet\_id parameter, allowing multiple wallets under the same public key. Can you explain the technical mechanism behind this feature and its benefits for users managing multiple wallets?
4.  The V4 wallet version introduces plugins for extended functionality. Could you provide examples of how these plugins can be utilized in real-world applications, and what this means for the future of smart contract development on TON?
5.  Specialized wallets like high-load, lockup, and restricted wallets serve specific purposes. Can you discuss the unique features of each of these wallet types and the scenarios in which they would be most effectively used?
6.  With the variety of wallet versions available on TON, how should users or developers choose the appropriate wallet type for their specific needs? Are there guidelines or best practices for selecting and using different wallet versions?
7.  Lastly, considering the technical and functional aspects of TON’s wallet contracts, how do they compare with wallet solutions on other blockchains like Ethereum or Solana in terms of versatility, security, and ease of use?

This comprehensive discussion aims to provide a deep understanding of the TON wallet ecosystem, highlighting the technical intricacies, version-specific features, and practical applications of each wallet type. We encourage insights and experiences from developers and users within the TON community.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 53

[TON Research](/)

# [Discussing the Latest TON Virtual Machine Update: Implications for Cryptography, Arithmetic, and Smart Contracts](/t/discussing-the-latest-ton-virtual-machine-update-implications-for-cryptography-arithmetic-and-smart-contracts/53)

[TON Blockchain](/c/ton-blockchain/tvm/16)  [TVM](/c/ton-blockchain/tvm/16) 

    

[kingsman](https://tonresear.ch/u/kingsman)  January 23, 2024, 2:08pm  1

The TON Virtual Machine (TVM) has recently undergone its most significant update, introducing extended cryptography, arbitrary-precision arithmetic, and new instructions. This enhancement positions TVM as one of the most versatile virtual machines in the blockchain sphere. Let’s delve into the specifics of this update and its implications for the development of smart contracts, services, and products on TON.

1.  How does the integration of a wide range of cryptographic methods, including SHA256, SHA512, BLAKE2B, KECCAK256, KECCAK512, and various cryptographic primitives on curves like secp256k1, secp256r1, Ristretto, and BLS12-381, impact the versatility and security of TVM?
2.  Considering the new support for arbitrary-precision arithmetic operators, what are the potential applications and benefits for developers working on complex financial and mathematical smart contracts?
3.  The addition of new instructions aims to simplify smart contract creation on TON. Can you provide examples or case studies demonstrating how these instructions streamline the development process and enhance security?
4.  With the unique feature of safely running TVM inside TVM, what are the implications for testing, deployment, and scalability of smart contracts on the TON platform?
5.  Finally, how do these updates position TVM in comparison to other virtual machines used in popular blockchains like Ethereum and Bitcoin, especially in terms of attracting hardware wallet and device manufacturers for wider adoption?

This comprehensive discussion aims to explore the technical and practical aspects of the recent TVM update, encouraging contributions and insights from experts in the field of blockchain technology and cryptography.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 5537

[TON Research](/)

# [$BABYTON, THE NEW ECOSYSTEM ON TON! THE OPEN LEAGUE Application. Get to know us!](/t/babyton-the-new-ecosystem-on-ton-the-open-league-application-get-to-know-us/5537)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[BABYTON](https://tonresear.ch/u/BABYTON)   April 3, 2024, 11:55pm  1

## [](#token-name-1)Token Name

$BABY/TON

[![Babyton](https://tonresear.ch/uploads/default/optimized/2X/8/8411cbc03a04ade576b0847b9b701705766d459f_2_690x230.jpeg)

Babyton1280×427 109 KB

](https://tonresear.ch/uploads/default/original/2X/8/8411cbc03a04ade576b0847b9b701705766d459f.jpeg "Babyton")

## [](#projects-twitter-2)Project’s Twitter

[https://twitter.com/BABYTONofficial](https://twitter.com/BABYTONofficial)

## [](#link-to-the-tokens-page-on-redoubt-andor-dyor-3)Link to the token’s page on re:doubt and/or DYOR

www.babyton.pro

## [](#link-to-the-tokens-page-on-coinmarketcap-if-your-token-is-not-listed-there-write-na-4)Link to the token’s page on Coinmarketcap (if your token is not listed there, write n/a)

n/a

## [](#link-to-the-tokens-page-on-coingecko-if-your-token-is-not-listed-there-write-na-5)Link to the token’s page on Coingecko (if your token is not listed there, write n/a)

n/a

## [](#your-name-6)Your name

CrypSix

## [](#your-telegram-handle-7)Your Telegram handle (@…)

@Matrixss

## [](#any-other-links-or-details-that-you-want-to-share-8)Any other links or details that you want to share

![](https://tonresear.ch/uploads/default/original/1X/4e0ead2e015b660804a5fa1ce511f1088caa25eb.png) [dedust.io](https://dedust.io/swap/TON/EQCufgxGQN10qyhaAhvIVYjHi2pu8N-kvPhYLT_uEXuVMMbB)

![](https://tonresear.ch/uploads/default/optimized/1X/14133c0148f340feeb1631961994452e0938809a_2_690x362.jpeg)

### [DeDust.io — AMM DEX on The Open Network](https://dedust.io/swap/TON/EQCufgxGQN10qyhaAhvIVYjHi2pu8N-kvPhYLT_uEXuVMMbB)

Swap any token seamlessly with minimal fees on DeDust.io, a leading decentralized automated market maker (AMM) running on The Open Network. Your ideal trade is just a click away with DeDust.io.

[https://dexscreener.com/ton/eqdqogeacalq-lazicyzhsenppnhd46nnx6mtlmgmb8vp\_8d](https://dexscreener.com/ton/eqdqogeacalq-lazicyzhsenppnhd46nnx6mtlmgmb8vp_8d)

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/BABYTONB)

![](https://tonresear.ch/uploads/default/original/2X/c/cad86a0db3ad4444c46d05015100710a0fc875c7.jpeg)

### [BABYTON | ECOSYSTEM | X1000](https://t.me/BABYTONB)

THE FIRST BABY REPRESENTING TON, WELCOME AND PREPARE FOR THE MOON! #BABYTON https://x.com/BABYTONofficial

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  3 Likes

[Raftrak](https://tonresear.ch/u/Raftrak) April 3, 2024, 11:57pm  2

Sooo really bullish!!

  2 Likes

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) April 11, 2024, 12:34pm  3

Hello BABY team,

Thank you for taking the time to apply for The Open League Season #1.

After a thorough review, we must inform you that, unfortunately, your token does not meet our current eligibility criteria. You can find them through this [link](https://tonresear.ch/t/about-the-memecoin-leaderboard-category/1276).

Once your token aligns with these criteria, please feel free to resubmit your application for the future seasons.

We look forward to seeing your application again in the future.

Thank you.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 562

[TON Research](/)

# [Кошелёк TON в телеграме](/t/ton/562)

[Русский](/c/ru/ton-blockchain/53)  [ТОН Блокчейн](/c/ru/ton-blockchain/53) 

    

[Zolan\_Morn](https://tonresear.ch/u/Zolan_Morn)  March 6, 2024, 10:30am  1

В кошельке Ton есть функции обмена  
и полнения BTC, USDT, но нет очень практичной и самой ходовой криптовалюты LTC просьба добавить LTC.

  4 Likes

[Https://tonresear.ch/t/ton/562?u=dima\_h](https://tonresear.ch/t/https-tonresear-ch-t-ton-562-u-dima-h/13158) 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 583

[TON Research](/)

# [sTONks the tool saving time and nerves](/t/stonks-the-tool-saving-time-and-nerves/583)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[DanIsNearby](https://tonresear.ch/u/DanIsNearby)   March 6, 2024, 11:03am  1

In today’s post, we will present you a ![:robot:](https://tonresear.ch/images/emoji/twitter/robot.png?v=12 ":robot:") product that can save you time and nerves. At the end, there is also a contest waiting for you!

If you have been working on TON for some time, you have surely noticed that DEXes are not yet the most stable, and [http://ston.fi](http://ston.fi/) can play tricks.

The project we want to present to you - @tonstonks

*   solves problems with [http://ston.fi](http://ston.fi/) and dedust.

Thanks to this bot, you can buy or sell a token in less than 20 seconds by pasting the contract and choosing the amount.

This construction bypasses many problems, such as:

• problems with page loading • problems with connecting the wallet • problems with the loading time of entered data

sTONks is also very informative in addition to being fast. After pasting the CA, you will see not only the purchase buttons, but also: • MCAP • amount of TON in LP • number of holders

The TonPoland community often uses the bot especially if they want to buy a token as quickly as possible, the bot does not yet have LP sniping, but soon this should appeal to many of the sTONKs options

If you are interested in sTONks and want to save your time and make it easier to buy tokens, you can do it [here](https://t.me/stonks_sniper_bot?start=0x6E51C5973C3616A867C8A2A060CC881CA6DB811DDB4136CF33F9AD231CE56C0D) remember that this bot is a NotSelfCustodial wallet, so immediately after creating a wallet to have access to our funds, for example during technical breaks.

For the contest you can refer to [this](https://twitter.com/TonPoland/status/1765062159296274868) post  

[![image](https://tonresear.ch/uploads/default/optimized/1X/13774144cd1c9497e3e0796b6231f6a277e430ba_2_690x387.jpeg)

image1200×674 70.6 KB

](https://tonresear.ch/uploads/default/original/1X/13774144cd1c9497e3e0796b6231f6a277e430ba.jpeg "image")

  6 Likes

[DanIsNearby](https://tonresear.ch/u/DanIsNearby) March 6, 2024, 11:13am  2

If you want to join their telegram community you can do so [here](https://t.me/stonksonton)

  2 Likes

[dawid](https://tonresear.ch/u/dawid) March 6, 2024, 11:46am  3

Best trading bot on TON

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 5894

[TON Research](/)

# [Resistance Duck | $REDU Open League Application](/t/resistance-duck-redu-open-league-application/5894)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[REDU](https://tonresear.ch/u/REDU)   April 4, 2024, 3:10am  1

Resistance Duck | $REDU

$REDU - Resistance Duck

Tokenomics

100 million Supply  
Initial LP 250 $TON Burned  
Distribution - 0 Team 0 Airdrops

Utility  
On day 2 of launch the team made a partnership with $AIMAGE. Inside the $REDU Telegram is a very powerful AI image generator that the community can use to create their own images for marketing $REDU. Stickers can even be made right in the telegram. All watermarked with REDU for advertising.

Resistance Duck was created to embody, embolden and champion the vison of digital resistance that was originally conceived by Telegram and $TON chain’s founder Pavel Durov in 2018.

The Telegram Duck

The Duck is Telegram’s mascot, an all important symbol of the platform. Ducks are regularly displayed on updates and news posts, and were some of the first animated sticker packs on Telegram.

Telegram and $TON

With the recent rise in notoriety of $TON as an easy to use and versatile mode of settlement built right in to Telegram, it is only fitting that $REDU helps to help foster the community required to embolden the vison started by Durov, Telegram and $TON.

Marketing Potential

With the combination of Telegram having there favorite animal be a DUCK - The marketing potential for $REDU is built right into $TON

The team will focus heavily on twitter, targeting telegram. $TON and telegram wallet with the $REDU duck.

We have had 1 tweet already that set off a buy frenzy in $REDU and it is very early days.

Telegram Duck Tweet  
[https://x.com/telegram/status/1772343350219211248?s=20](https://x.com/telegram/status/1772343350219211248?s=20)

$REDU Has engaged in a new form of marketing, using telegrams new stories feature to reach new public marketing targets outside its own telegram.

See the Duck Tales Stories Channel Here

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/ResistanceDuck)

![](https://tonresear.ch/uploads/default/original/2X/c/cf2479730f545da8630f84944093fe1583d9f5b6.jpeg)

### [$REDU | Duck Tales](https://t.me/ResistanceDuck)

You can view and join @ResistanceDuck right away.

X  
[https://x.com/REDU\_TON](https://x.com/REDU_TON)  
Telegram

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/ResistanceDuck)

![](https://tonresear.ch/uploads/default/original/2X/c/cf2479730f545da8630f84944093fe1583d9f5b6.jpeg)

### [$REDU | Duck Tales](https://t.me/ResistanceDuck)

You can view and join @ResistanceDuck right away.

Website

![](https://tonresear.ch/uploads/default/original/2X/6/618f5098db212fd5b4716467dc8e60fdd42ded21.png) [REDU](https://www.resistanceduck.com/)

![](https://tonresear.ch/uploads/default/optimized/2X/1/16257441309acb0cc03dd02fb3433012bc51620f_2_500x500.jpeg)

### [Resistance Duck | REDU](https://www.resistanceduck.com/)

CA  
EQD9BsupQckDFRLnc1ixVnW-wbpBTVUg3smDK9mkRQ7WPc8d

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  4 Likes

[FINU](https://tonresear.ch/u/FINU) April 4, 2024, 3:50am  2

Super bullish on $REDU.  
Strategic, big moves, and partnerships very early on for a young token with an excellent narrative. Very pleased to be a part of this community.

 

[sssssn4ck](https://tonresear.ch/u/sssssn4ck) April 4, 2024, 4:19am  3

Great team, very yellow duck, gonna be big, give it a shot.

 

[Softcard](https://tonresear.ch/u/Softcard) April 4, 2024, 5:57am  4

Great early token. Active community. Could make some waves

 

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) April 12, 2024, 2:10pm  5

Hello Resistance Duck team,

Thank you for taking the time to apply for The Open League Season #1.

After a thorough review, we must inform you that, unfortunately, your product’s traction does not meet our current eligibility criteria. You can find these criteria through this [link](https://tonresear.ch/t/about-the-token-leaderboard-minor-league-category/1274).

Once the criteria are met from your side, please feel free to resubmit your application for the future seasons.

We look forward to seeing your application again in the future.

Thank you!

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 592

[TON Research](/)

# [The Open League](/t/the-open-league/592)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[DanIsNearby](https://tonresear.ch/u/DanIsNearby)   March 6, 2024, 11:19am  1

**[The Open League](https://t.me/community_bot/join?startapp=id_192-r_NDg4NDI2XzE3OTc)**

**Initial Pilot Season Kicks Off**

The Open League (TOL) is a competition for TON ecosystem projects and users. Projects acquire new and loyal users for TON, while users themselves are rewarded for their activity.

TOL will operate in six-month seasons, with the initial pilot season starting today. Each season is divided into four months of active participation, during which users earn TON-backed rewards, and a two-month blackout period.

Each season of The Open League is designed to acquire users, developing their skills and knowledge of Web3, guiding them through incentives to use TON projects. Each month of the season will include a new level of tasks to be completed for each project involved.

**Pilot Season**

This pilot season will last only 4 months, with 3 months of experiments and 1 month of blackout to prepare for Season 1! Expect experiments and changes;

Level 1 of the Pilot Season starts today and includes five projects that already have over 26 million active users per month:

*   **Soulbound Tokens (SBTs)**

Level 1 of the Pilot Season kicks off with Soul Bound Tokens (SBTs). SBTs are non-transferable, so they cannot be sold; they are awarded for completing each task.

*   **Experience Points (XP)**

Experience points will be introduced in Level 2. XP can be exchanged for TON at any time, but the exchange rate is time-dependent, so the longer you hold XP, the more they are worth until the last day of Season 2, where each XP will be worth 1 TON.

*   **XP Lottery**

XP will be awarded to users in a weekly lottery. Each SBT acts as a ticket.

[Take part now to not miss out on the chance to get yourself some cool SBTs and rewards](https://t.me/community_bot/join?startapp=id_192-r_NDg4NDI2XzE3OTc=)  

[![telegram-cloud-photo-size-4-5890922850968256340-y](https://tonresear.ch/uploads/default/optimized/1X/568dbf89db6feef06180201e7811fc9d288c103a_2_690x388.jpeg)

telegram-cloud-photo-size-4-5890922850968256340-y1280×720 54.5 KB

](https://tonresear.ch/uploads/default/original/1X/568dbf89db6feef06180201e7811fc9d288c103a.jpeg "telegram-cloud-photo-size-4-5890922850968256340-y")

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 596

[TON Research](/)

# [TINU: Your Swiss Army Knife for Navigating the TON Network](/t/tinu-your-swiss-army-knife-for-navigating-the-ton-network/596)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[DanIsNearby](https://tonresear.ch/u/DanIsNearby)   March 6, 2024, 11:26am  1

The TON Network is a vast and ever-evolving landscape, with new tokens and projects emerging all the time. As an investor, it can be difficult to keep track of all the latest developments and make informed decisions about where to put your money.

**TINU to the Rescue**

TINU is a suite of tools that helps you navigate the TON Network with confidence. With TINU, you can:

*   **Stay up-to-date on the latest trends:** The **Trending** channel shows you the latest token purchases, so you can always be on the lookout for the next big thing.
*   **Make informed investment decisions:** The **Scanner** provides you with detailed information about any token, including liquidity, whale participation, and volume. This information can help you make more informed investment decisions.
*   **Get notified about new token launches:** The **Sniffer** channel notifies you about new tokens as soon as they are launched, so you can be among the first to invest.
*   **Find the best deals:** The **BuyBot** helps you find the best deals on tokens by notifying you when there is a large purchase on a particular channel.

TINU is an essential tool for any investor who wants to be more effective and safer on the TON Network. With its comprehensive suite of tools, TINU can help you make informed investment decisions, stay up-to-date on the latest trends, and find the best deals on tokens in their apps such as :

*   **BuyBot:** The BuyBot is a Telegram bot that notifies you when there is a large purchase of a particular token on a channel. This can be a helpful tool for finding tokens that are about to experience a price increase.
*   **Scanner:** The Scanner is a tool that allows you to view detailed information about any token on the TON Network. This information includes liquidity, whale participation, volume, and more.
*   **Trending:** The Trending channel shows you the latest token purchases on the TON Network. This can be a helpful tool for finding new tokens that are gaining popularity.
*   **Sniffer:** The Sniffer channel notifies you about new tokens as soon as they are launched on the TON Network. This can be a helpful tool for finding tokens that have the potential to be big winners.

**Get Started Today!**

To learn more about TINU and how it can help you, visit their socials  
Web: [https://toninu.tech/](https://toninu.tech/)  
X : [https://x.com/toninutools](https://x.com/toninutools)  
Telegram : [Telegram: Contact @toninutools](https://t.me/toninutools)

[![image](https://tonresear.ch/uploads/default/optimized/1X/869e83b93fb6ff1c97acda3adb1aba5632a5502b_2_690x162.jpeg)

image1280×302 93.9 KB

](https://tonresear.ch/uploads/default/original/1X/869e83b93fb6ff1c97acda3adb1aba5632a5502b.jpeg "image")

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 615

[TON Research](/)

# [TON 流動性獎勵 LP Farming 你參加了嗎？](/t/ton-lp-farming/615)

[中文 (简繁)](/c/zh/48) 

    

[WhiteTEA](https://tonresear.ch/u/WhiteTEA)   March 6, 2024, 12:21pm  1

> # ​The Open League奖励活动今日开始

[![image](https://tonresear.ch/uploads/default/optimized/1X/a862681660b6f2bcb02f248aa00f3ebc44652a18_2_690x408.jpeg)

image2430×1440 320 KB

](https://tonresear.ch/uploads/default/original/1X/a862681660b6f2bcb02f248aa00f3ebc44652a18.jpeg "image")

今天标志着 The Open League 奖励活动的开始，本月将向 TON 社区发放多达 100 万个 Toncoin (TON)。在成功推出旨在将新用户介绍给各种 Web3 项目的 Web3 任务之后，DeDust 和 [STON.fi](http://STON.fi) 上选定的基于 TON 的项目代币的流动池将获得 Toncoin 奖励。

增量活动已经开始，并将持续到 2024 年 4 月 1 日。在锁定总价值（TVL）、最高利用率、每日活跃钱包和交易数量方面表现出最大吸引力的项目将在整个 3 月份获得持续奖励。最佳项目将于 2024 年 4 月 1 日获得额外的通币奖励。

**如何参与：**  
![:black_small_square:](https://tonresear.ch/images/emoji/twitter/black_small_square.png?v=12 ":black_small_square:") **DYOR**：所有入选项目均已证明其增长和需求，因此有资格获得奖励分配。但是，流动资金池存在固有风险，在参与之前充分了解这些风险至关重要。  
![:black_small_square:](https://tonresear.ch/images/emoji/twitter/black_small_square.png?v=12 ":black_small_square:") **提供流动性**： 要加入流动性池，您需要双方的代币。将您的通币换成您所选项目的代币，并将等额资金存入池中。  
![:black_small_square:](https://tonresear.ch/images/emoji/twitter/black_small_square.png?v=12 ":black_small_square:") **监控您的仓位**： 奖励金额可能会发生变化，因此监控仓位的健康状况至关重要。要注意无形损失，尤其是当你的资金池中某一方的价值大幅波动时。  
![:black_small_square:](https://tonresear.ch/images/emoji/twitter/black_small_square.png?v=12 ":black_small_square:") **赚取**： 奖励将根据您的资金池份额大小自动分配。份额越大，奖励越多。

从 DeDust 或 [STON.fi](http://STON.fi) 开始。  
请随时关注本频道的最新更新，因为奖励分配会迅速发生变化。更多详情，请查看 本博文。

官方消息：[TON Community](https://t.me/toncoin/1171)

流動性池子

獎勵數量

Farming DEX 地址

結束時間

TON/SCALE

25,000 $SCALE  
20,000 $TON

[Dedust.io](https://dedust.io/pools/EQDcm06RlreuMurm-yik9WbL6kI617B77OrSRF_ZjoCYFuny)

@April 1, 2024

TON/STON

12,000 $STON  
20,000 $TON

[STON.fi](https://app.ston.fi/pools/EQDtZHOtVWaf9UIU6rmjLPNLTGxNLNogvK5xUZlMRgZwQ4Gt)

@April 1, 2024

TON/JNANO

10,000,000 $jNANO  
20,000 $TON  
5000 $SCALE

[Dedust.io](https://dedust.io/pools/EQC6zhZtFzgTBbTQ4bG1j5Fh5bWQATtiOMdJAAO98_j1REBU)

@April 1, 2024

TON/MC

45,000 $MC  
50,000 $TON

[STON.fi](https://app.ston.fi/pools/EQCgMzlDFer3XqOnuQpELXeGSMBjV_6PWfWLElvaa3qv2ZUM)

@April 1, 2024

TON/GRAM

9,832,962 $GRAM  
30,000 $TON  
7,500 $STON

[STON.fi](https://app.ston.fi/pools/EQASBZLwa2vfdsgoDF2w96pdccBJJRxDNXXPUL7NMm0WdnMx)

@April 1, 2024

TON/JETTON

36,800 $JETTON  
“33,200 $TON”

[STON.fi](https://app.ston.fi/pools/EQATnq6W2xv10C19LNlC26xFtTV1fbzMkXmXQCWHqtv6Okf7)

@April 1, 2024

TON/RAFF

420,000 $RAFF  
30,700 $TON

[STON.fi](https://app.ston.fi/pools/EQCqFPpSLtcstURtrXLRCv9wyjfrw7_44_nwvD8JiSmSjbUI)

@April 1, 2024

TON/PUNK

33,333 $PUNK  
23,010 $TON

[STON.fi](https://app.ston.fi/pools/EQARmtrqsIf8-lk9bH8ISV_UCsG8kS3iHzC7bV8ssQAi4pvw)

@April 1, 2024

TON/FNZ

8,501,000 $FNZ  
22,148 $TON

[STON.fi](https://app.ston.fi/pools/EQAZFS5dJ8STrKcn5VnptYsoKILXbAYaDhdJJjbzUrNkDdH_)

@April 1, 2024

TON/UP

265,627 $UP  
50,000 $TON

[Dedust.io](https://dedust.io/pools/EQABy0q1lpLkU09k7srKCCjeAm32D2nZ15WtmWgb81RvjLbP)

@April 1, 2024

TON/ARBUZ

66,000 $ARBUZ  
50,000 $TON

[Dedust.io](https://dedust.io/pools/EQChrWJNhwrazRcwYZU74S0DQuqJK6FT40xk7uKNLVmjZ9Da)

@April 1, 2024

> # 各家官方頻道公告

$STON 公告  
[STON.fi](https://t.me/stonfidex/436)

$SCALE 公告  
[Dedust.io– TON DEX](https://t.me/dedust_en/81)

$MC 公告  
[TAP FANTASY Announcement](https://t.me/tapfantasy_announcement/822)

$GRAM 公告  
[Gram Base](https://t.me/grambase/520)

$UP 公告  
[TonUP ![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")](https://t.me/TonUP_io/183) 

$RAFF 公告  
[Ton Raffles En Channel](https://t.me/tonraffles_en/300)

$PUNK 公告  
[TON Punks](https://t.me/punkton/328)

$ARBUZ 公告  
[Arbuz Fest (Арбуз)](https://t.me/tonarbuz/2800)

$FNZ 公告  
[Fanzee Battles | $FNZ](https://t.me/fanzeebattles/447)

$JNANO 公告  
[Tonano Official](https://t.me/tonanoOfficial/40552)

  1 Like

[bitcat](https://tonresear.ch/u/bitcat) March 6, 2024, 12:29pm  2

参加了，期待可以拿到预期的收获，20个字

 

[WhiteTEA](https://tonresear.ch/u/WhiteTEA) March 6, 2024, 12:36pm  3

我也是第一天就參加了，第三天來看，收益蠻不錯的，特別是其中幾個高APY的項目，其中TON/UP 今天還加

LP池子

今日APY

TON/FNZ

571%

TON/PUNK

507%

TON/UP

556.6%

  1 Like

[Aska\_Kwok](https://tonresear.ch/u/Aska_Kwok) March 10, 2024, 11:55am  4

参加了raff/ton，希望有好的奖励！ ![:smiley:](https://tonresear.ch/images/emoji/twitter/smiley.png?v=12 ":smiley:")

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 689

[TON Research](/)

# [Create NFT from any Telegram message](/t/create-nft-from-any-telegram-message/689)

[General](/c/general/4) 

[learn](https://tonresear.ch/tag/learn)

    

[petrovxyz](https://tonresear.ch/u/petrovxyz)   March 6, 2024, 6:26pm  1

# [](#telegram-moments-turn-any-message-into-nft-1)Telegram Moments - turn any message into NFT

[![banner](https://tonresear.ch/uploads/default/optimized/1X/8d3be1e7267c9e18eec547413a0961e3f61b2d40_2_690x388.jpeg)

banner1920×1080 106 KB

](https://tonresear.ch/uploads/default/original/1X/8d3be1e7267c9e18eec547413a0961e3f61b2d40.jpeg "banner")

[Cheques channel](https://t.me/chequehunters) team created a [bot](https://t.me/tgmoments_bot) that **turns any messages/posts into NFTs** and gives you the opportunity to mint them ![:hugs:](https://tonresear.ch/images/emoji/twitter/hugs.png?v=12 ":hugs:"). The main idea of the project is to **save memories forever on the TON blockchain**. Bot was recently [added](https://t.me/trendingapps/206) to the official Telegram App Store.

At the moment, there is already a [collection on GetGems](https://getgems.io/collection/EQBHXYTMd9-vvj1YdmMSlXyt44GnMx6Rds9wgcjua8n5BD_L) of more than a thousand NFT messages.

  4 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 7044

[TON Research](/)

# [\[DeFi\] Payment system Tegro.Money](/t/defi-payment-system-tegro-money/7044)

[The Open League](/c/the-open-league/app-leaderboard/58)  [App League](/c/the-open-league/app-leaderboard/58) 

    

[CEOTegro](https://tonresear.ch/u/CEOTegro)   April 4, 2024, 2:53pm  1

[![image](https://tonresear.ch/uploads/default/optimized/2X/6/6b891cfc9b995900e798b742174eaae1a38ade84_2_690x388.jpeg)

image1280×720 41.8 KB

](https://tonresear.ch/uploads/default/original/2X/6/6b891cfc9b995900e798b742174eaae1a38ade84.jpeg "image")

## [](#project-name-1)Project Name

**Payment system Tegro.Money**

## [](#projects-website-2)Project’s Website

**[Tegro.Money](https://tegro.money/)**

The system for accepting online payments

## [](#projects-twitter-3)Project’s Twitter

[https://twitter.com/TegroTON](https://twitter.com/TegroTON)

## [](#projects-telegram-channelgroup-4)Project’s Telegram channel/group

[EN-channel](https://t.me/tegro_money) | [RU-channel](https://t.me/tegromoney)

## [](#metrics-5)Metrics

Our payment system primarily processes transactions rather than capturing value as in DeFi protocols. Therefore, instead of TVL, we focus on total transaction volume (TTV) as a key metric. As for the protocol fee, we charge ~0.1% per transaction.

## [](#your-name-6)Your name

Dmitry

## [](#your-telegram-handle-7)Your Telegram handle

[@CEOTegro](/u/ceotegro)

## [](#any-other-links-or-details-that-you-want-to-share-8)Any other links or details that you want to share

**TegroMoney: Payment Aggregator for Global Online Payments**

**System Overview:** TegroMoney is a leading payment aggregator that facilitates online payments from around the world, offering an easy integration method for your website or application. This system brings together various payment instruments, simplifying transaction processes for users through a unified user interface. Integration is possible across different channels, including websites, mobile apps, and even Telegram bots, making TegroMoney a versatile solution for businesses of any size.

**Key Advantages:**

*   **Low Fees**: TegroMoney offers some of the lowest commission rates in the market, making it an economical choice for businesses of all sizes.
*   **Instant Payouts**: With the instant payment system, users can receive funds immediately after transaction confirmation.
*   **No Turnover Limits**: Businesses face no transaction volume limits, providing freedom to scale operations.
*   **Support for Individuals and Bulk Payments**: The system is designed to work with individuals and execute bulk payments via API.
*   **Flexibility and Accessibility**: The ability to accept payments no-code and the absence of holds make the system highly user-friendly.
*   **Adjustable Commissions and Referral Program**: A flexible commission system and the ability to earn through new client referrals.
*   **24/7 Support**: Continuous technical support ensures the reliability and availability of the service at all times.

**Payment Methods and Functionality:** TegroMoney provides a wide range of payment options, including bank cards, contactless payments from smartphones, electronic wallets, payments at terminals and cash desks, as well as international payments and cryptocurrency transactions. Integration with Tegro Pay allows processing transactions in cryptocurrencies like Bitcoin, USDT, and Toncoin, including the option for token payments on the TON.

**Pricing Model:** Commission rates in TegroMoney are customized based on turnover, the number of connected projects, business concept, and type of connection (corporate entity, individual, or sole proprietor). This ensures optimal conditions for each client, with rates reviewed and adjusted automatically each month.

**Funds Withdrawal:** TegroMoney offers flexible solutions for fund withdrawal, including instant payments for individuals to popular payment systems and cryptocurrencies, and standard bank account transfers for corporate entities.

**Additional Services:** The system includes an [Android mobile app](https://play.google.com/store/apps/details?id=com.tegrollc.tegromoney) and integration with a [Telegram bot](https://t.me/tegropay_bot), ensuring convenience and flexibility in managing payments and monitoring transactions.

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  3 Likes

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) May 6, 2024, 11:15am  3

Hey there! Thanks for applying for the Open League. This season, there won’t be a DeFi leaderboard, but stay tuned for future seasons.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 729

[TON Research](/)

# [Разработка UI системы на кроссбокс XUY зип-худи](/t/ui-xuy/729)

[Русский](/c/ru/49) 

[learn](https://tonresear.ch/tag/learn)

    

[Kot](https://tonresear.ch/u/Kot)  March 7, 2024, 2:48am  1

Всем привет, господа. Раз всех приветствовать. Надеюсь тут будет интересно

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 7359

[TON Research](/)

# [Glint Coin\\Ton Diamonds](/t/glint-coin-ton-diamonds/7359)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[Yana\_Avdeyeva](https://tonresear.ch/u/Yana_Avdeyeva)  April 4, 2024, 6:32pm  1

## [](#glint-coin-1)Glint Coin

## [](#glint-coin-first-token-from-nft-marketplace-on-ton-with-real-utilities-the-utility-token-from-ton-diamonds-nft-marketplace-and-auction-house-22-of-marketplace-fees-shared-with-glint-coin-holders-when-trading-on-ton-diamonds-marketplace-you-can-pay-the-fees-with-glint-coin-2)Glint Coin — First token from NFT marketplace on TON with real utilities. The utility token from TON Diamonds NFT marketplace and auction house. 22% of marketplace fees shared with Glint Coin holders. When trading on TON Diamonds marketplace, you can pay the fees with Glint Coin.

## [](#total-supply-22000000-glint-coin-3)Total Supply: 22,000,000 Glint Coin.

From this moment and for the next ~6 months, every TON Diamonds NFT owner will start receiving $GLINT daily in their profile on ton.diamonds.  
At Market stage anyone can get more Glint Coin on a decentralized exchange.  
Burn TON Diamonds NFT. It will be possible to burn some TON Diamonds NFT in exchange for Glint Coin.  
Glint Staking. It will be possible to lock up a certain amount of Glint Coin and get more tokens for it.

## [](#httpsdyoriorutokeneqcbdxpecfeph2wuxi1a6qioksf-5qdjuwqlcuuktd-glinttabholders-4)[https://dyor.io/ru/token/EQCBdxpECfEPH2wUxi1a6QiOkSf-5qDjUWqLCUuKtD-GLINT?tab=holders](https://dyor.io/ru/token/EQCBdxpECfEPH2wUxi1a6QiOkSf-5qDjUWqLCUuKtD-GLINT?tab=holders)

## [](#httpscoinmarketcapcomrucurrenciesglint-coin-5)[Glint Coin (GLINT) Цена, Графики, Рыночная капитализация | CoinMarketCap](https://coinmarketcap.com/ru/currencies/glint-coin/)

## [](#httpswwwcoingeckocomruglint-coin-6)[Курс Glint Coin: График курса GLINT, капитализация и новости | CoinGecko](https://www.coingecko.com/ru/%D0%9A%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%B2%D0%B0%D0%BB%D1%8E%D1%82%D1%8B/glint-coin)

## [](#yana-7)Yana

## [](#yanna_community-8)@Yanna\_community

## [](#httpstondiamondsglint-coin-9)[Glint Coin | TON Diamonds](https://ton.diamonds/glint-coin)

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  1071 Likes

[twoh2h](https://tonresear.ch/u/twoh2h) April 4, 2024, 6:56pm  2

Strong project! Good track-record

  33 Likes

[user148](https://tonresear.ch/u/user148) April 4, 2024, 7:05pm  3

Один из сильнейших проектов на ТОНе, он обязан быть в лиге!

  24 Likes

[holypimp](https://tonresear.ch/u/holypimp) April 4, 2024, 7:09pm  4

this is a very high quality token

  18 Likes

[user334](https://tonresear.ch/u/user334) April 4, 2024, 7:09pm  5

It’s first NFT-related project for me. I like it so far. Diamonds NFT provide lots of advantages. Also, my NFT farms GLINT coins for me, its’ potential is amazing from my POV.

Looking forward for further development!

  13 Likes

[dante11211](https://tonresear.ch/u/dante11211) April 4, 2024, 7:14pm  6

Шайн брайт лайк э даймодн

  11 Likes

[user337](https://tonresear.ch/u/user337) April 4, 2024, 7:15pm  7

Один из самых стабильных и уважаемых проектов! Побольше таких как вы!

  7 Likes

[alladar](https://tonresear.ch/u/alladar) April 4, 2024, 7:28pm  8

One of the first projects on Ton blockchain, which invents innovations in the field of dex’s & marketplace.  
TON Diamonds also develops the direction of collectible works of famous artists, allowing them to enjoy all the benefits of the TON blockchain.  
I believe that in the future it is also a contender for the Top league

  7 Likes

[Kripa](https://tonresear.ch/u/Kripa) April 4, 2024, 7:34pm  9

TOP project on TOP block chain

  8 Likes

[user254](https://tonresear.ch/u/user254) April 4, 2024, 7:48pm  10

Хороший проект. Только вперёд.

  5 Likes

[rtm1887](https://tonresear.ch/u/rtm1887) April 4, 2024, 8:09pm  11

One of the most reliable projects on TON

  5 Likes

[Devtodevil](https://tonresear.ch/u/Devtodevil) April 4, 2024, 8:13pm  12

Qualified team and strong community💪

  5 Likes

[Edward\_Snowden](https://tonresear.ch/u/Edward_Snowden) April 4, 2024, 8:16pm  13

HODL. This one is good

  5 Likes

[Baroncoin](https://tonresear.ch/u/Baroncoin) April 4, 2024, 8:23pm  14

One of the most interesting projects in the TON ecosystem for me

  5 Likes

[Kriptograf](https://tonresear.ch/u/Kriptograf) April 4, 2024, 9:43pm  15

TON DIAMOND ![:+1:t2:](https://tonresear.ch/images/emoji/twitter/+1/2.png?v=12 ":+1:t2:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")  
Один из лучших проектов на Тон !!!

  5 Likes

[SERGEY\_GAVRILOV](https://tonresear.ch/u/SERGEY_GAVRILOV) April 5, 2024, 4:19am  16

Отличная команда и супер НФТ. Всем рекомендую!!!

  5 Likes

[Dam\_Brick](https://tonresear.ch/u/Dam_Brick) April 5, 2024, 6:21am  17

Great project! TON Diamonds offer a comprehensive platform for NFT trading, auctioning renowned artworks, accessing exclusive privileges, utilizing a DEX aggregator, and participating in the Glint Coin ecosystem.  
I see great future for the project.

  5 Likes

[augoeides](https://tonresear.ch/u/augoeides) April 5, 2024, 7:13am  18

Проект стоит буквально у истоков TON и уже который год вносит огромный вклад в развитие и популяризацию всего блокчейна. Ton Diamonds как никто другой заслуживают место в Лиге!

  5 Likes

[user338](https://tonresear.ch/u/user338) April 5, 2024, 7:31am  19

I joined the community recently, I haven’t fully figured it out, but it’s clear that the project is worthwhile, people who have been helping with the project for a long time with advice

  4 Likes

[suleyman](https://tonresear.ch/u/suleyman) April 5, 2024, 7:43am  20

best NFT-market in the world!

  4 Likes

**[next page →](/t/glint-coin-ton-diamonds/7359?page=2)**

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 741

[TON Research](/)

# [Поставка ликвидности на DEX](/t/dex/741)

[Русский](/c/ru/49) 

    

[Zecko](https://tonresear.ch/u/Zecko)  March 7, 2024, 8:03am  1

Доброго времени суток всем! Хотелось бы узнать ваши мнения по поводу поставок ликвидности на DEX. Я давно в TON и встречал много людей которые говорят что ликвидность приносит прибыль, и также людей кто считает обратное ! Какое ваше мнение на этот счёт? И какие тонкости вы учитываете при поставке ликвидности? На что обращаете внимание и как строите вероятность успеха или провала ?

  2 Likes

[Ruslan\_Kucherenko](https://tonresear.ch/u/Ruslan_Kucherenko)  March 8, 2024, 8:20am  2

![](https://tonresear.ch/uploads/default/original/1X/708bb4bee29432e72104ca82ee9ca669fd18e6db.png) [OKX](https://www.okx.com/ru/campaigns/ton-treasures?channelid=TON2KR)

![](https://tonresear.ch/uploads/default/optimized/1X/1bd87a7e71d20cad0a27cb256b1e073afd2af384_2_410x500.png)

### [Охота за TON сокровищами на ОКХ: Раздаем 60 000 TON & 15 000 USDT!](https://www.okx.com/ru/campaigns/ton-treasures?channelid=TON2KR)

Эксклюзивно на ОКХ: торгуйте TON, выполняйте задания и получайте призовые тикеты. Больше выполненных заданий — больше наград!

 

[Golovolastik](https://tonresear.ch/u/Golovolastik) March 9, 2024, 7:29am  4

Правы и те, и другие :)  
При росте одного актива по отношению к другому, актив давший рост переливается в первый. При падении работает противоположно. Это называют непостоянные потери. Да, при росте какого-то актива ваша прибыль будет меньше. Защититься от них можно предоставляя ликвидность по парам стейблкоин/стейблкоин - в этом случае потерь не будет вообще (не берем в расчет, то что один из стейблов может соскамиться ).  
Но не стоит забывать о том что поставщики ликвидности награждаются частью комиссий полученной при торговле этой парой другими участниками рынка. На TON много пар, который имеют большой APR.  
В данный момент на TON проходит ивент при поддержке TON Foundation с жирными наградами для поставщиков ликвидности. Если какой-то актив в паре и покажет рост, то награды компенсируют непостоянные потери.  
Лично я поставляю ликвидность участвуя в таких рода фарм ивентах - это выгодно. Долго держал ликвидность в паре TON/jUSDT из-за большого процента. Также могу отметить пару stTON/wTON - непостоянные потери тут минимальны, но опять-таки без поддержки bemo и megaton держать такую ликвидность не совсем выгодно.  
Нужно подстраиваться по ситуации и просчитывать потенциальную прибыль.Всегда можно заработать, также как и потерять.  

  1 Like

[chrisyong](https://tonresear.ch/u/chrisyong) March 10, 2024, 6:55pm  5

Спасибо за разъяснение. Правильно понимаю, что таким образом чтобы уменьшить непостоянные потери, то выгоднее всего заходить в пул когда актив вырос, а выходить из него когда курс монеты остудился?

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 743

[TON Research](/)

# [DEX liquidity and farm’s](/t/dex-liquidity-and-farm-s/743)

[Application](/c/application/dex/24)  [DEX](/c/application/dex/24) 

    

[Zecko](https://tonresear.ch/u/Zecko)  March 7, 2024, 8:11am  1

Good day, everyone! I would like to know your opinion on the supply of liquidity on DEX. I’ve been in TON for a long time and have met a lot of people who say that liquidity brings profit, and also people who think the opposite! What is your opinion on this? And what subtleties do you take into account when supplying liquidity? What do you pay attention to and how do you build the probability of success or failure?

  2 Likes

[Deliverancer](https://tonresear.ch/u/Deliverancer) March 7, 2024, 8:18am  2

hey. Liquidity is the optimum for long-term success. There is the saying “it’s the quantity that matters”. Mfg

  1 Like

[Zecko](https://tonresear.ch/u/Zecko) March 7, 2024, 1:23pm  3

It may be so, but how do you see the impact of the value of tokens on the final result of the liquidity pool?

 

[Prime\_BCH](https://tonresear.ch/u/Prime_BCH) May 10, 2024, 5:26am  4

1.  Your strength is an inspiration.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 760

[TON Research](/)

# [Tonkey v1 Retires Gracefully](/t/tonkey-v1-retires-gracefully/760)

[General](/c/general/4) 

    

[ASURADA](https://tonresear.ch/u/ASURADA)   March 7, 2024, 1:58pm  1

Embrace Tonkey v2’s Successful Operation for an Enhanced Experience!

[![image](https://tonresear.ch/uploads/default/optimized/1X/4bcdb60b01677d7ce8233f0b4d04498e5b634227_2_690x388.jpeg)

image2000×1125 131 KB

](https://tonresear.ch/uploads/default/original/1X/4bcdb60b01677d7ce8233f0b4d04498e5b634227.jpeg "image")

Dear Tonkey users,

We’re excited to announce that T**onkey v2** is now operating smoothly! With this significant achievement, it’s time for T**onkey v1** to gracefully step aside, paving the way for a new era of enhanced features and smoother functionality.

In our relentless pursuit of providing the best possible experience for our users, we’ve diligently addressed all the anticipated issues present in Tonkey v1, ensuring a seamless transition to Tonkey v2. Your satisfaction and security remain our top priorities, and we’re confident that Tonkey v2 will exceed your expectations.

The transition to Tonkey v2 is scheduled for **March 31st**, and we encourage all our users to take advantage of this opportunity to upgrade. To facilitate this process, we’ve outlined simple steps below:

1.  **Check your [Tonkey V1](https://v1.tonkey.app) Assets:** Please first check if there is a balance on Tonkey v1. If there is no balance, it means you have never used Tonkey v1! This update will not cause any problems.
2.  **Create a New Multisig Wallet**: Visit [tonkey.app](http://tonkey.app/) to create your new Multisig wallet on the tonkey v2 platform. This step is crucial to ensuring the security and integrity of your assets.
3.  **Transfer Assets**: Once your new Multisig wallet is set up, proceed to [v1.tonkey.app](http://v1.tonkey.app/) and initiate the transfer of your assets to the newly created wallet on Tonkey v2. Rest assured, our team is here to assist you every step of the way, should you encounter any difficulties during this process.

We understand that change can sometimes be daunting, but we’re confident that the transition to Tonkey v2 will be a smooth and rewarding experience for all our users. Thank you for your continued support and trust in Tonkey. We look forward to serving you better with Tonkey v2!

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 791

[TON Research](/)

# [Notcoin ishlash va sotish](/t/notcoin-ishlash-va-sotish/791)

[Application](/c/application/20) 

    

[UZB](https://tonresear.ch/u/UZB)  March 9, 2024, 9:28am  1

**Notcoin ishlash va sotish uchun nima kerak bo’ladi?**

1.  Telegram ilovasi va telefon raqamga yoqilgan hisob
2.  Notcoin boti (ushbu havola yordamida o’tish mumkin: @notcoinbot)
3.  Kamida 10 000 000 yig’ilgan tangalar (bu juda oson).
4.  Telegram hamyoni (@wallet boti orqali ochiladi).
5.  Kerak miqdorda tanga yig’ganingizdan so’ng hisobingizga 0.06 TON (1000 so’mga yaqin) solishingiz va ushbu kichik komissiyani to’lab o’zingizning tangalaringizni sotsangiz bo’ladi.
6.  Hamyoningizdan UZ kartalariga chiqarish o’rtacha 10-15 daqiqani oladi.

Kelgusida bu yo’llar yanada takommilartiriladi

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 7974

[TON Research](/)

# [Toncoin.co - Digital diamond](/t/toncoin-co-digital-diamond/7974)

[The Open League](/c/the-open-league/56) 

    

[toncoinco](https://tonresear.ch/u/toncoinco)   April 5, 2024, 6:26am  1

[Toncoin.co](http://Toncoin.co)  
Project essence:  
1.Create an additional, **independent branch of The Open Network (TON)** , a new decentralized internet based on the Level 1 blockchain.  
2.Search and analyze information **to profit in TONCOIN (Digital diamond)** , the native cryptocurrency The Open Network (TON)  
3.Do what I love, make money for a living and **help people!**

At the moment the project is at the stage of collecting investments!

![](https://tonresear.ch/uploads/default/original/2X/8/8e05b7d4611098f8aee3bebf2b73f20216b2f634.png) [Getgems](https://getgems.io/collection/EQA1KiBxlshTmu3k8aay7GkgoZcPw89Uq8Wx80RirsRRDbCg)

![](https://tonresear.ch/uploads/default/optimized/2X/a/a1d664dee6e1e95f664b153813e8355a6cd01783_2_690x162.png)

### [Toncoin.Co investors](https://getgems.io/collection/EQA1KiBxlshTmu3k8aay7GkgoZcPw89Uq8Wx80RirsRRDbCg)

Exclusive limited collection of 33 NFTs for investors: 1.INVESTOR NFT provides a unique offer - a place in a special section INVESTORS, on the site Toncoin.co you can specify a link to your project and text.

**Telegram Channel:** [@toncoinco](https://t.me/Toncoinco)  
**Contact:** [@toncoindotco](https://t.me/Toncoindotco)

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 8040

[TON Research](/)

# [This is apa yang harus saya lakukan sampe saya akan menjadi](/t/this-is-apa-yang-harus-saya-lakukan-sampe-saya-akan-menjadi/8040)

[General](/c/general/mining/47)  [Mining](/c/general/mining/47) 

[indexer](https://tonresear.ch/tag/indexer), [tep](https://tonresear.ch/tag/tep), [api](https://tonresear.ch/tag/api), [learn](https://tonresear.ch/tag/learn), [gramcoin](https://tonresear.ch/tag/gramcoin)

    

[KK\_BAJIL](https://tonresear.ch/u/KK_BAJIL)  April 5, 2024, 9:31am  1

Hallo saya harus gimana untuk melewati ini  
Agar dapat hidangan yang bagus guna menyumbang kemiskinan di wilayah saya mohon di bantu habis itu saya akan

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 8221

[TON Research](/)

# [\[DeFi\] Telegram bot Smoservicebot](/t/defi-telegram-bot-smoservicebot/8221)

[The Open League](/c/the-open-league/app-leaderboard/58)  [App League](/c/the-open-league/app-leaderboard/58) 

    

[CEOTegro](https://tonresear.ch/u/CEOTegro)   April 5, 2024, 1:37pm  1

[![image](https://tonresear.ch/uploads/default/optimized/2X/9/98a2994b3407281688b430f7b449325b63f45c80_2_690x388.jpeg)

image1280×720 48.7 KB

](https://tonresear.ch/uploads/default/original/2X/9/98a2994b3407281688b430f7b449325b63f45c80.jpeg "image")

## [](#project-name-1)Project Name

**Telegram bot Smoservicebot**

## [](#projects-website-2)Project’s Website

[Smoservice.media](https://smoservice.media/)

## [](#projects-twitter-3)Project’s Twitter

[Twitter](https://twitter.com/AskSmoService)

## [](#projects-telegram-channelgroup-4)Project’s Telegram channel/group

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/smoservice)

![](https://tonresear.ch/uploads/default/original/2X/a/a465a47aecc569d43a63f973ce275a9bd7009fd4.jpeg)

### [SMM 🏆 СМОСЕРВИС МЕДИА](https://t.me/smoservice)

Система автоматизированной рекламы и продвижения в социальных сетях❗️ Сайт SMM системы👇 https://smoservice.pro/ Предложи идею👇 https://smoservice.media/pages/ideas/ Клуб партнёров👇 https://smoservice.vc/ Профили: @smoserviceru @smoservicemedia

## [](#metrics-5)Metrics

Our service, focusing on social media promotion, does not incorporate a DeFi (Decentralized Finance) mechanism, and therefore, does not have a Total Value Locked (TVL) metric. As our platform operates primarily on social media marketing and promotion, the concept of TVL, which is prevalent in DeFi platforms to represent the total capital held in their financial contracts, is not applicable to our service model.

## [](#your-name-6)Your name

Oleg

## [](#your-telegram-handle-7)Your Telegram handle

@aleksandrovich\_pm

## [](#any-other-links-or-details-that-you-want-to-share-8)Any other links or details that you want to share

The [Telegram bot service for social media](https://t.me/smoservicebot) promotion offers a wide range of features and opportunities for users:

*   **Order Placement**: Users can easily place orders for various social media services directly through the bot, selecting the necessary parameters and options.
*   **Service Selection**: The service provides a wide assortment of SMM services, from increasing engagement to boosting follower counts.
*   **Cryptocurrency Payment**: A unique feature is the ability to pay for services using cryptocurrencies, including TON and tokens on its blockchain, ensuring convenience and security in transactions.
*   **Creating Own Bots**: Users can create personal Telegram bots for their own promotion purposes, as well as to earn from referral programs.

**Affiliate Program**:

*   Referral rewards are divided into two levels:
    *   **Level 1 Referrals**: For users you directly recruit, you receive 12% of their purchases.
    *   **Level 2 Referrals**: For users recruited by your referrals, you earn 4% of their transactions.
*   **Registration Bonus**: For each user who activates the bot via your referral link, you receive an additional fixed bonus.

**Additional Features**:

*   **Check Creation**: The platform allows the creation of checks and multi-checks for convenience in accounting and reporting.
*   **Integration with Wallets and Platforms**: Built-in integration with Wallet, Crypto bot, and [Tegro.Money](https://tegro.money/) simplifies financial management and transaction processing within the service.

This system offers a comprehensive approach to social media management and promotion, providing convenience and efficiency for users and partners.

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  2 Likes

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) May 6, 2024, 11:11am  2

Hey there! Thanks for applying for the Open League. This season, there won’t be a DeFi leaderboard, but stay tuned for future seasons.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 826

[TON Research](/)

# [My opinion is that the TonCoin blockchain should also be considered as a tourism project](/t/my-opinion-is-that-the-toncoin-blockchain-should-also-be-considered-as-a-tourism-project/826)

[General](/c/general/4) 

    

[0914](https://tonresear.ch/u/0914)  March 10, 2024, 11:36am  1

My opinion is that the TonCoin blockchain should also be considered as a tourism project

 

[0914](https://tonresear.ch/u/0914) March 11, 2024, 6:58am  2

A further explanation is to sign a memorandum of understanding with the large centers of the tourism industry to use tons in transactions and give them some tons of coins in return.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 829

[TON Research](/)

# [Stonfi dex new token](/t/stonfi-dex-new-token/829)

[TON Blockchain](/c/ton-blockchain/17) 

    

[Zecko](https://tonresear.ch/u/Zecko)  March 10, 2024, 12:02pm  1

У STONFI ожидается выпуск нового токена DISTON что ожидаете от токена? Каким видите его перспективы и будущее?  
С учётом того, что STONFI одна из лидирующих бирж, велика вероятность что они сделают полезный продукт, но время покажет истину, а мы с вами продолжим предполагать

  12 Likes

[Howard](https://tonresear.ch/u/Howard) March 13, 2024, 9:39pm  2

Hi, maybe good to share in English:

STONFI is expected to release a new token, DISTON. What are your expectations for the token? How do you see its prospects and future? Given that STONFI is one of the leading exchanges, there’s a high likelihood they will create a useful product, but time will reveal the truth, and we will continue to speculate.

Translate by ChatGPT

  7 Likes

[Toncoin-splinter](https://tonresear.ch/u/Toncoin-splinter) March 29, 2024, 2:47am  3

Хотелось бы получить на обозрение эту монету. Что бы обзор дать монеты .

С добром toncoin\_splinter.ton

UQDZ6BizsaNEDFd534m19sS33g2dMa0Ej9l4cfybi9EGYed9

  4 Likes

[termith](https://tonresear.ch/u/termith) March 30, 2024, 9:00pm  4

I think that the emergence of your own token from a crypto exchange is a completely natural process.

  3 Likes

[LektorKZ](https://tonresear.ch/u/LektorKZ) March 31, 2024, 4:05pm  5

UQD55mQaoC0TsuprUs86cdDnOpAsuetp09qthH1pmOsuVMR2

  1 Like

[Toncoin-splinter](https://tonresear.ch/u/Toncoin-splinter) April 2, 2024, 2:48am  6

Вы правы По моему мнению сегодня завтра что-то должно произойти большое событие после закрытия ноткоина

  1 Like

[Pius\_Paul](https://tonresear.ch/u/Pius_Paul) April 4, 2024, 5:15am  7

I seriously don’t expect anything less from a major Dex from a fast growing ecosystem. They have the user base and being the major dex on the Ton Blockchain, there is a higher potential for any token they launch. Investors fund will always flow into the token of any ecosystem major dex because that is easy profit especially when the ecosystem in growing in transaction volume .

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 8299

[TON Research](/)

# [$ANON - Privacy for everyone](/t/anon-privacy-for-everyone/8299)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[Msuic](https://tonresear.ch/u/Msuic)   April 5, 2024, 4:41pm  1

[![IMG_20240405_202122_537](https://tonresear.ch/uploads/default/optimized/2X/c/c9c9940f1ab62b8ab37b44316757e6c001fa00e6_2_690x229.jpeg)

IMG\_20240405\_202122\_5371280×426 10.9 KB

](https://tonresear.ch/uploads/default/original/2X/c/c9c9940f1ab62b8ab37b44316757e6c001fa00e6.jpeg "IMG_20240405_202122_537")

## [](#project-name-1)Project name:

$ANON Token

## [](#description-2)Description:

$ANON is a token launched by a closed community of owners of anonymous Telegram numbers 8 Club.

The main task of the token is to introduce the crypto world to anonymous numbers and demonstrate all the innovative opportunities offered by the fastest blockchain in the world - TON.

## [](#roadmap-3)ROADMAP:

2024 Q2

*   ![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Presale $500k hard cap
    
*   ![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") ANON will be distributed DEX pair and investors
    
*   ![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Listing on DEXs and verify token in dapps
    
*   ![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") LP tokens of lock period
    
*   ![:white_check_mark:](https://tonresear.ch/images/emoji/twitter/white_check_mark.png?v=12 ":white_check_mark:") Website, social networks
    
*   ![:hourglass_flowing_sand:](https://tonresear.ch/images/emoji/twitter/hourglass_flowing_sand.png?v=12 ":hourglass_flowing_sand:") Collaborations with other projects on the TON blockchain
    
*   ![:hourglass_flowing_sand:](https://tonresear.ch/images/emoji/twitter/hourglass_flowing_sand.png?v=12 ":hourglass_flowing_sand:") Coingecko, coinmarketcap token listing
    
*   Launching token burning programs
    
*   Development of utilities that increase the value of ANON ownership
    
*   CEX listing
    
*   Reward campaigns
    
*   Release telegram mini-game on TON blockchain
    

2024 Q3-4

*   Decentralized VPN service based on ANON and TON.
*   NFT marketplace
*   Confidential tip and donation system for content creators.
*   Collaboration with large data aggregators.
*   Collaboration with payment systems and services.
*   Hackathons and contests for developers, creating new products for the ecosystem.

2025

*   TBA

## [](#twitter-4)Twitter

[https://x.com/anonclub8](https://x.com/anonclub8)

## [](#dyor-5)DYOR

![](https://tonresear.ch/uploads/default/original/2X/7/704ea172731bcc9213ac822c14f4625bebbf71cc.png) [dyor.io](https://dyor.io/token/EQDv-yr41_CZ2urg2gfegVfa44PDPjIK9F-MilEDKDUIhlwZ)

![](https://tonresear.ch/uploads/default/optimized/2X/b/b826500d1ea599b9a15cbb37efa203b130ae8664_2_690x362.jpeg)

### [ANON (ANON) Token Price - DYOR.ninja](https://dyor.io/token/EQDv-yr41_CZ2urg2gfegVfa44PDPjIK9F-MilEDKDUIhlwZ)

The live ANON price today is 0.0000127 USD with a 24-hour trading volume of 1,840,634.87 USD. We update our ANON to USD price in real-time.

## [](#link-to-the-tokens-page-on-coinmarketcap-if-your-token-is-not-listed-there-write-na-6)Link to the token’s page on Coinmarketcap (if your token is not listed there, write n/a)

*   n/a

## [](#link-to-the-tokens-page-on-coingecko-if-your-token-is-not-listed-there-write-na-7)Link to the token’s page on Coingecko (if your token is not listed there, write n/a)

*   n/a

## [](#contact-8)CONTACT:

Denis  
@msuic171

[Telegram: Contact @anon\_club](https://t.me/anon_club)

## [](#during-the-first-day-anon-managed-to-do-9)During the first day $ANON managed to do:

*   The growth of the token by 400+%
*   Listing on Dedust and Stonfi
*   Over 8M$ Mcap ATH
*   Over 5k holders ATH
*   Over 10M$ Sum Volume

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  325 Likes

[user347](https://tonresear.ch/u/user347) April 5, 2024, 4:51pm  2

The best token! No whales, no scam only community and fun!

  79 Likes

[Video\_Maker](https://tonresear.ch/u/Video_Maker)  April 5, 2024, 4:57pm  3

cool token, good investment.  

[![IMG_20240405_195651_735](https://tonresear.ch/uploads/default/optimized/2X/7/7bcfdf4caf81eaf2b8603df6a2e2a688c70e8ac1_2_498x500.jpeg)

IMG\_20240405\_195651\_7351276×1280 237 KB

](https://tonresear.ch/uploads/default/original/2X/7/7bcfdf4caf81eaf2b8603df6a2e2a688c70e8ac1.jpeg "IMG_20240405_195651_735")

  82 Likes

[WillyWonka](https://tonresear.ch/u/WillyWonka) April 5, 2024, 4:57pm  4

$ANON is a rocket that has taken a powerful start thanks to the support of a strong community.  
A young project that has already achieved a lot and opens up great prospects for the holders!

  65 Likes

[user273](https://tonresear.ch/u/user273) April 5, 2024, 5:01pm  5

$ANON I won’t be afraid of this word, one of the not many promising tokens in the TON ecosystem that will be used soon everyone will see that the power is in the community, not in these memes that every schoolboy began to sculpt

  65 Likes

[Fisem](https://tonresear.ch/u/Fisem) April 5, 2024, 5:07pm  6

I am proud that I am a part of the ANON community.  
We will try to investigate more and more goals!  
Choose us - choose ANON.  
Undated as one!

  59 Likes

[DocPaint](https://tonresear.ch/u/DocPaint) April 5, 2024, 5:07pm  7

Best investment, good community, thank you anon club

  56 Likes

[Zebatuq](https://tonresear.ch/u/Zebatuq) April 5, 2024, 5:08pm  8

$ANON Сommunity Token #1 ![:8ball:](https://tonresear.ch/images/emoji/twitter/8ball.png?v=12 ":8ball:") ![:heart:](https://tonresear.ch/images/emoji/twitter/heart.png?v=12 ":heart:")

  54 Likes

[Vakhtang\_Brundzhadze](https://tonresear.ch/u/Vakhtang_Brundzhadze) April 5, 2024, 5:10pm  9

$ANON It is the token of a strong and influential community on the Ton blockchain. developers, creators, workers, thinkers and dreamers, various worthy people, united by the idea of mutual growth and development, mutual assistance and community support

  52 Likes

[V128S](https://tonresear.ch/u/V128S) April 5, 2024, 5:11pm  10

ANON IS THE FUTURE OF ANONYMITY! Join our community and let’s grow it together

  51 Likes

[new-balance](https://tonresear.ch/u/new-balance) April 5, 2024, 5:12pm  11

New Balance! ![:sunglasses:](https://tonresear.ch/images/emoji/twitter/sunglasses.png?v=12 ":sunglasses:")  
New Balance! ![:sunglasses:](https://tonresear.ch/images/emoji/twitter/sunglasses.png?v=12 ":sunglasses:")  
New Balance! ![:sunglasses:](https://tonresear.ch/images/emoji/twitter/sunglasses.png?v=12 ":sunglasses:")

  50 Likes

[Klover](https://tonresear.ch/u/Klover) April 5, 2024, 5:13pm  12

$ANON feels like hitting a jackpot for privacy lovers in crypto) mysterious, cool, and ready to shake things up with TON’s speed.  
It’s like of the underground gold everyone’s been searching for.

  49 Likes

[Lyrapuff](https://tonresear.ch/u/Lyrapuff) April 5, 2024, 5:16pm  13

This token seems very promising and interesting to explore and build stuff for :>

  50 Likes

[fadaf9999](https://tonresear.ch/u/fadaf9999) April 5, 2024, 5:16pm  14

**$ANON** IS THE BEST TOKEN. BEST INVESTMENT ![:moneybag:](https://tonresear.ch/images/emoji/twitter/moneybag.png?v=12 ":moneybag:") ![:moneybag:](https://tonresear.ch/images/emoji/twitter/moneybag.png?v=12 ":moneybag:") ![:moneybag:](https://tonresear.ch/images/emoji/twitter/moneybag.png?v=12 ":moneybag:")

  44 Likes

[GShark](https://tonresear.ch/u/GShark) April 5, 2024, 5:17pm  15

Nice token. Go go go

  44 Likes

[Antlitz](https://tonresear.ch/u/Antlitz) April 5, 2024, 5:18pm  16

Strong Token with smart community. Waiting for the Open League. This will be fun.

  44 Likes

[Akatsuki\_San](https://tonresear.ch/u/Akatsuki_San) April 5, 2024, 5:19pm  17

Need Lambo, thx ANON!

  47 Likes

[TIBERIOS\_UNIOS](https://tonresear.ch/u/TIBERIOS_UNIOS) April 5, 2024, 5:20pm  18

SCAM OR NOT? ANON I’VE GOT! ![:8ball:](https://tonresear.ch/images/emoji/twitter/8ball.png?v=12 ":8ball:")

  42 Likes

[AxelSton](https://tonresear.ch/u/AxelSton) April 5, 2024, 5:23pm  19

The best project is anonymous

  38 Likes

[underlower](https://tonresear.ch/u/underlower) April 5, 2024, 5:23pm  20

This is a comment of support and respect ![:heart:](https://tonresear.ch/images/emoji/twitter/heart.png?v=12 ":heart:")

  43 Likes

**[next page →](/t/anon-privacy-for-everyone/8299?page=2)**

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 830

[TON Research](/)

# [Stonfi new token](/t/stonfi-new-token/830)

[TON Blockchain](/c/ton-blockchain/17) 

    

[Zecko](https://tonresear.ch/u/Zecko)  March 10, 2024, 12:03pm  1

STONFI expects to release a new DISTON token, what do you expect from the token? How do you see his prospects and future?

Taking into account the fact that STONFI is one of the leading exchanges, it is likely that they will make a useful product, but time will tell the truth, and you and I will continue to assume

  12 Likes

[Lew](https://tonresear.ch/u/Lew) March 11, 2024, 1:16pm  2

hi, can you please tell me more about the exit, please ,the project is very interesting

  6 Likes

[Lew](https://tonresear.ch/u/Lew) March 11, 2024, 1:19pm  3

or to dump the site for this token?)

  4 Likes

[Evgeniy554](https://tonresear.ch/u/Evgeniy554) March 11, 2024, 10:37pm  4

As far as I understand, DISTON is the currency in the STONfi channel in Discord, which is awarded to active users. At the end of March, it is possible to exchange DISTON for STON if you have fulfilled several conditions: 1) the trading turnover on STONfi is more than 100 TONS, 2) a high-quality article on social networks about STONfi, for which he received an award in DISTON.

  7 Likes

[Aska\_Kwok](https://tonresear.ch/u/Aska_Kwok) March 12, 2024, 8:58am  5

As far as I know, DISTON is a coin that has a lot to do with the Discord platform, but from my experience on DC, I didn’t feel the community’s enthusiasm for it, and I encountered some difficulties in its operation, and I’m puzzled as to why this project doesn’t do it on Telegram, maybe it’s trying to expand to a social platform that is used by more people on the WEB3, but honestly, I’m currently don’t really see it as a good idea.

  3 Likes

[deli\_deli](https://tonresear.ch/u/deli_deli) March 24, 2024, 1:35am  6

آینده ای رویایی رو قطعا پیش رو خواهد داشت

  3 Likes

[elefante](https://tonresear.ch/u/elefante) April 9, 2024, 4:33am  7

i trust you ma brk…to the moon ,

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 86

[TON Research](/)

# [Exploring Gram (GRAM) on the TON Blockchain: A Comprehensive Guide](/t/exploring-gram-gram-on-the-ton-blockchain-a-comprehensive-guide/86)

[General](/c/general/mining/47)  [Mining](/c/general/mining/47) 

[gramcoin](https://tonresear.ch/tag/gramcoin)

    

[doge](https://tonresear.ch/u/doge)  January 31, 2024, 8:33am  1

**About Gram (GRAM)**

Gram (GRAM) emerges as the pioneering Proof of Work (PoW) jetton on the TON Blockchain, setting a new precedent in the realm of digital currencies. With a substantial supply of 5,000,000,000 GRAM, it initiated its journey by distributing these tokens to the PoW Givers. Now, the opportunity to mine GRAM has opened up to the broader community, offering a unique chance to engage with this innovative blockchain technology.

* * *

**Latest News and Updates**

*   **30th January 2024:** In an exciting development, a Web Mining App has been launched. This user-friendly application allows individuals to mine Grams directly through their web browsers. Interested parties can start their mining journey by visiting [here](https://gramcoin.org/mining).
*   **30th January 2024:** The mining process for GRAM is officially underway. For those eager to acquire Grams and join this digital revolution, comprehensive instructions are available [here](https://gramcoin.org/Grams-HOWTO.txt).
*   **26th January 2024:** Marking a significant milestone, the GRAM tokens have been successfully minted, paving the way for a new era in the TON Blockchain ecosystem.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 8676

[TON Research](/)

# [Проблема получения баланса](/t/topic/8676)

[Русский](/c/ru/49) 

    

[Zurlex](https://tonresear.ch/u/Zurlex)  April 6, 2024, 6:58am  1

Мне нужно создавать транзакции и получать баланс пользователя по кошельку TON в определенных токенах это возможно, если да то как?  
Через TON SDK или DTon  
TON SDK мне не помог  
DTon вроде может помочь но я не понимаю как сделан API ведь там всего 50 строк кода

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 87

[TON Research](/)

# [\[Manual\] A Step-by-Step Guide to Acquiring Grams on the TON Blockchain](/t/manual-a-step-by-step-guide-to-acquiring-grams-on-the-ton-blockchain/87)

[General](/c/general/mining/47)  [Mining](/c/general/mining/47) 

[gramcoin](https://tonresear.ch/tag/gramcoin)

    

[doge](https://tonresear.ch/u/doge)  January 31, 2024, 8:38am  1

**Introduction**

In the evolving landscape of cryptocurrency, Grams on the TON Blockchain represent an exciting opportunity. This guide aims to provide a clear and concise method for anyone looking to obtain Grams quickly and efficiently through the process of mining.

* * *

**1\. Starting with Proof-of-Work Giver Smart Contracts**

To begin mining Grams, you first need to select a “proof-of-work giver” smart contract. These contracts are categorized based on the amount of Grams they deliver - ranging from extra small givers delivering 100 Grams to large givers offering up to 100000 Grams. Here’s a list of smart contracts available:

**Extra Small Givers (100 Grams):**

*   EQCfwe95AJDfKuAoP1fBtu-un1yE7Mov-9BXaFM3lrJZwqg\_
*   EQBoATvbIa9vA7y8EUQE4tlsrrt0EhSUK4mndp49V0z7Me3M
*   EQAV3tsPXau3VJanBw4KCFaMk3l\_n3sX8NHZNgICFrR-9EGE
*   EQAR9DvLZMHo9FAVMHI1vHvL7Fi7jWgjKtUARZ2S\_nopQRYz
*   EQC10L\_\_G2SeEeM2Lw9osGyYxhoIPqJwE-8Pe7728JcmnJzW
*   EQDZJFkh12kw-zLGqKSGVDf1V2PRzedGZDFDcFml5\_0QerST
*   EQCiLN0gEiZqthGy-dKl4pi4kqWJWjRzR3Jv4jmPOtQHveDN
*   EQDB8Mo9EviBkg\_BxfNv6C2LO\_foJRXcgEF41pmQvMvnB9Jn
*   EQAidDzp6v4oe-vKFWvsV8MQzY-4VaeUFnGM3ImrKIJUIid9
*   EQAFaPmLLhXveHcw3AYIGDlHbGAbfQWlH45WGf4K4D6DNZxY

**Small Givers (1000 Grams):**

*   EQDSGvoktoIRTL6fBEK\_ysS8YvLoq3cqW2TxB\_xHviL33ex2
*   EQCvMmHhSYStEtUAEDrpV39T2GWl-0K-iqCxSSZ7I96L4yow
*   EQBvumwjKe7xlrjc22p2eLGT4UkdRnrmqmcEYT94J6ZCINmt
*   EQDEume45yzDIdSy\_Cdz7KIKZk0HyCFIr0yKdbtMyPfFUkbl
*   EQAO7jXcX-fJJZl-kphbpdhbIDUqcAiYcAr9RvVlFl38Uatt
*   EQAvheS\_G-U57CE55UlwF-3M-cc4cljbLireYCmAMe\_RHWGF
*   EQCba5q9VoYGgiGykVazOUZ49UK-1RljUeZgU6E-bW0bqF2Z
*   EQCzT8Pk1Z\_aMpNukdV-Mqwc6LNaCNDt-HD6PiaSuEeCD0hV
*   EQDglg3hI89dySlr-FR\_d1GQCMirkLZH6TPF-NeojP-DbSgY
*   EQDIDs45shbXRwhnXoFZg303PkG2CihbVvQXw1k0\_yVIqxcA

**Medium Givers (10000 Grams):**

*   EQD7VspHSNS4VSpN7QQicNgSYoJ68CmdC6oL5ZEKHSXe26Sa
*   EQC5uEgW0MkTbCRBZB72maxCZT3m14OK2FcSLVr2H\_7MTTSF
*   EQC2nD9nQNRhcfWhdBzRK-wdlTO4hGxnPFzdSxKN777tab2\_
*   EQAqd4vV0O5oGfA7bl6fVORD\_Y4PTNZG82AC2BObBux51g2w
*   EQDcOxqaWgEhN\_j6Tc4iIQNCj2dBf9AFm0S9QyouwifYo9KD
*   EQAjYs4-QKve9gtwC\_HrKNR0Eaqhze4sKUmRhRYeensX8iu3
*   EQBGhm8bNil8tw4Z2Ekk4sKD-vV-LCz7BW\_qIYCEjZpiMF6Q
*   EQCtrloCD9BHbVT7q8aXkh-JtL\_ZDvtJ5Y-eF2ahg1Ru1EUl
*   EQCWMIUBrpwl7OeyEQsOF9-ZMKCQ7fh3\_UOvM2N5y77u8uPc
*   EQD\_71XLqY8nVSf4i5pqGsCjz6EUo2kQEEQq0LUAgg6AHolO

**Large Givers (100000 Grams):**

*   EQDUIeTNcRUqsz4bugyWl4q4vg16PN2EwiyyAIEbf7\_WJZZH
*   EQC4qKAIM0Od4RFG-4MAY0dJ3j4Wrcs0jc1XeWKJURYB9KSz
*   EQC0Ssi1gl0IQKEGsCp91NeiTThdMqCzYvlX9sVLEU97rWqL
*   EQDO2\_2zkIJPqBKeE\_P1VvDYOJi1vGPgiKo0Aa6Z-bY7BeuG
*   EQADEy4zcVl-ADNMISdYSs5cVjJcHmwC9\_phXXjqNKgME7j6
*   EQDWELx3CYohD9sIjhyEIhP915kL\_3XthqruCbmcB0YTWDqQ
*   EQDdoh2hzGFHdQtiXJNPNrwA8yIGd4-sFxyuEr3z6JL5BIFi
*   EQALXKp6G-IjWTPEqFKILkqcql-43DcoPzJ21Z02abpBPaQK
*   EQBAHXFxs1ohHY2bzW9A-V0NDznkFlROkNF\_oyppxlLfsyEJ
*   EQCUwgBew9u4NwwuFsfPsXX9a69K55uFcieaHtc-c37OYDJO

Choose one of these smart contracts randomly for the mining process.

* * *

**2\. The “Mining” Process**

Mining Grams involves creating an internal message containing the “proof of work.” Follow these steps to mine effectively:

*   **Compiling the Mining Utility:** This utility is part of the TON sources available on the GitHub repository. It’s located in `./crypto/pow-miner` relative to the build directory and can be compiled with `make pow-miner`.
    
*   **Obtaining ‘Seed’ and ‘Complexity’ Parameters:** Before running the `pow-miner`, you need to know the ‘seed’ and ‘complexity’ parameters of your chosen smart contract. Use the LiteClient console to run a method like `runmethod [Chosen Giver Smart Contract Address] get_pow_params` to obtain these values.
    
*   **Running the Miner:** With the ‘seed’ and ‘complexity’ obtained, run the `pow-miner` utility with the syntax:
    
    ```
    $ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
    ```
    
    Replace placeholders with appropriate values. For example:
    
    ```
    $ crypto/pow-miner -vv -w7 -t100 [Your Wallet Address] [Seed] [Complexity] 100000000000 [Giver Smart Contract Address] mined.boc
    ```
    
*   **Handling Success or Failure:** If successful, the miner will save the proof of work in the file `mined.boc`. In case of failure, update the ‘seed’ and ‘complexity’ parameters and try again.
    
*   **Sending the Proof of Work:** Use any TON software to send an internal message containing the proof of work from `mined.boc`. If successful, your wallet’s jetton balance will increase, reflecting the acquisition of Grams.
    

* * *

**Conclusion**

Congratulations! By following these steps, you are now a proud owner of GRAM jettons. Whether for trading, investment, or other purposes, these jettons open up new possibilities within the TON Blockchain ecosystem. Happy mining!

  3 Likes

[Johnnie](https://tonresear.ch/u/Johnnie) January 31, 2024, 12:08pm  2

**GRAM Mining: A Nod to TONCOIN’s Initial Approach**

* * *

Hey everyone,

I’m excited to share some insights into GRAM’s mining process, which intriguingly mirrors the initial mining methods used by TONCOIN. It’s not just a replication; it feels more like a respectful homage to the pioneering techniques of TONCOIN.

**1\. Proof-of-Work Giver Smart Contracts:**

GRAM follows the proof-of-work protocol, utilizing various “giver” smart contracts. These contracts are categorized based on the amount of GRAMs they can dispense, ranging from extra small givers (delivering around 100 GRAMs) to large givers (capable of delivering up to 100,000 GRAMs). It’s fascinating to see the same smart contract addresses being used as in the initial TONCOIN setup. This alignment shows a clear lineage and respect for the original system.

**2\. The Mining Process:**

Mining GRAMs involves creating an internal message containing proof of work, similar to TONCOIN’s approach. You need to run a specific mining utility, which is part of the TON sources available on GitHub. Before you start mining, it’s crucial to get the “seed” and “complexity” parameters of the chosen giver smart contract. This process is done through the LiteClient console, a method that feels quite familiar to those who have experience with TONCOIN.

Once you have these parameters, you can run the mining utility. If successful, the miner will save the required proof of work into a file. In case of failure, it’s just a matter of updating the parameters and trying again - persistence is key!

**3\. The Result:**

Successful mining is rewarded with an increase in your GRAM jetton balance. This result can be exhilarating, especially after the anticipation and effort involved in the mining process.

**A Personal Reflection:**

To me, this method of mining GRAMs is more than just a technical process. It’s a tribute to the pioneering spirit of TONCOIN. Using the same mining algorithm and similar methods speaks volumes about the respect and acknowledgment of what TONCOIN has achieved.

This shared approach in mining also adds an interesting layer to the crypto community’s narrative. It’s like watching history being honored and preserved in real-time, and I’m here for it!

For more detailed information and to get started, check out [TON Blockchain’s GitHub Repository](https://github.com/ton-blockchain/ton/blob/master/doc/TestGrams-HOWTO).

Looking forward to hearing your thoughts and experiences with GRAM mining. Has anyone else noticed this connection to TONCOIN? Let’s discuss!

  2 Likes

[zzzhu12](https://tonresear.ch/u/zzzhu12) April 1, 2024, 1:53pm  3

Hi doge, thank you for the very comprehensive guide! I’m very new to programming and mining!

I have followed your other guide

[\[GPU\] Harnessing JettonGramGpuMiner: Your Guide to Mining GRAM Tokens - General / Mining - TON Research](https://tonresear.ch/t/gpu-harnessing-jettongramgpuminer-your-guide-to-mining-gram-tokens/89/1)

and downloaded the github project and run the start\_tonhub.bat but seems like its always failing so i found this guide and try to follow along is this guide a total different thing? if not where can i find the files you mention

```
 * **Compiling the Mining Utility:** This utility is part of the TON sources available on the GitHub repository. It’s located in `./crypto/pow-miner` relative to the build directory and can be compiled with `make pow-miner`.
> * **Obtaining ‘Seed’ and ‘Complexity’ Parameters:** Before running the `pow-miner`, you need to know the ‘seed’ and ‘complexity’ parameters of your chosen smart contract. Use the LiteClient console to run a method like `runmethod [Chosen Giver Smart Contract Address] get_pow_params` to obtain these values.
```

was not able to find this file. thank you in advance

  2 Likes

[Deadly\_Devil](https://tonresear.ch/u/Deadly_Devil) April 25, 2024, 12:35am  4

It’s a very good job ![:fire:](https://tonresear.ch/images/emoji/twitter/fire.png?v=12 ":fire:")![:100:](https://tonresear.ch/images/emoji/twitter/100.png?v=12 ":100:")![:100:](https://tonresear.ch/images/emoji/twitter/100.png?v=12 ":100:")![:100:](https://tonresear.ch/images/emoji/twitter/100.png?v=12 ":100:")![:100:](https://tonresear.ch/images/emoji/twitter/100.png?v=12 ":100:")![:100:](https://tonresear.ch/images/emoji/twitter/100.png?v=12 ":100:")

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 88

[TON Research](/)

# [\[CPU\] Harnessing the Power of Gramcoin Mining: A Guide to Using the Gramcoin Miner](/t/cpu-harnessing-the-power-of-gramcoin-mining-a-guide-to-using-the-gramcoin-miner/88)

[General](/c/general/mining/47)  [Mining](/c/general/mining/47) 

[gramcoin](https://tonresear.ch/tag/gramcoin)

    

[doge](https://tonresear.ch/u/doge)  January 31, 2024, 8:41am  1

**Introduction**

As the world of cryptocurrency continues to expand, the Gramcoin Miner emerges as a pivotal tool for those looking to delve into the mining of Grams, a digital asset on the TON Blockchain. This article serves as a comprehensive guide to setting up and running the Gramcoin Miner, available on [GitHub](https://github.com/qpwedev/gramcoin-miner).

* * *

**Setting Up the Gramcoin Miner**

1.  **Compiling TON from Sources:**  
    Start by compiling TON from the sources available at [TON Documentation](https://docs.ton.org/develop/howto/compile). This is the first step in preparing your system for Gramcoin mining.
    
2.  **Navigating to Build Folder:**  
    Once compiled, navigate to your build folder (`ton-build`) using the command:
    
    ```
    cd ton-build
    ```
    
3.  **Setting Environment Variables:**  
    Environment variables are crucial for the smooth functioning of the miner. Fill out all required environment variables as per the `.example.env` file. This includes API keys from TONCenter and TONConsole, your wallet address, the minter address, and your mnemonic phrase. Ensure accuracy while filling out this information.
    
    ```
    TONCENTER_API_KEY= "" # from https://t.me/tonapibot
    TONCONSOLE_BEARER= "" # from https://tonconsole.com/dashboard
    MY_ADDRESS = "Your Wallet Address" # your wallet address v4
    MINTER_ADDRESS = "Minter Address" # from https://gramcoin.org/Grams-HOWTO.txt
    MNEMONIC = "Your 24-word Mnemonic Phrase" # 24 words
    ```
    
4.  **Running the Miner:**  
    With the environment set up, run the following commands in your terminal to initiate the mining process:
    
    ```
    pnpm i
    npx ts-node main.ts
    ```
    

* * *

**Understanding the Code**

The Gramcoin Miner utilizes various packages and functions to facilitate mining. Key aspects include:

*   **TonClient and WalletContractV4:** These are used for interacting with the TON blockchain.
*   **Functions like `mnemonicToPrivateKey`:** Converts your mnemonic phrase to a private key, crucial for wallet interactions.
*   **Fetching and Parsing Parameters:** The script fetches and parses parameters required for mining from the minter address.
*   **Mining and Handling Results:** The miner runs a command to obtain mined Grams and handles the results accordingly, including error management.
*   **Transaction Process:** Upon successful mining, the script prepares and sends a transaction containing the proof of work to the blockchain.

* * *

**Continuous Mining**

The script is designed to continuously attempt mining. It repeatedly calls `runCommandAndHandleResult`, ensuring that your system constantly tries to mine Grams, thus maximizing your chances of success.

* * *

**Conclusion**

The Gramcoin Miner is a powerful tool for those interested in mining Grams on the TON Blockchain. By following this guide, you can set up and run the miner efficiently, paving the way for potentially lucrative mining endeavors. Remember to double-check your configurations and stay updated with the latest developments in the TON community for an optimized mining experience. Happy mining!

  2 Likes

[kingsman](https://tonresear.ch/u/kingsman) January 31, 2024, 10:42am  2

Thank you so much for sharing this detailed article! Just a reminder, for those who want to use Gramcoin Miner, please note that the node version must be 20 or above. This is an important requirement as lower node versions may not support required features and dependencies. Make sure you have the correct version of node installed on your system so you can successfully set up and run Gramcoin Miner. Thank you again for your contribution and look forward to seeing more information about TON Blockchain and Gramcoin!

 

[Johnnie](https://tonresear.ch/u/Johnnie) January 31, 2024, 11:03am  3

**Title: Setup Guide for TON Blockchain Node and Gramcoin Miner**

1.  **Initial Setup and Cloning Repositories**
    
    *   Begin by changing to your home directory:
        
        ```
        cd ~
        ```
        
    *   Clone the TON blockchain repository, including submodules:
        
        ```
        git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
        ```
        
2.  **Installing Necessary Dependencies**
    
    *   Update package lists:
        
        ```
        sudo apt update
        ```
        
    *   Install required dependencies:
        
        ```
        sudo apt-get install -y build-essential git cmake clang libgflags-dev zlib1g-dev libssl-dev libreadline-dev libmicrohttpd-dev pkg-config libgsl-dev python3 python3-dev python3-pip libsecp256k1-dev libsodium-dev libsecp256k1
        ```
        
3.  **Building the TON Blockchain Software**
    
    *   Create and move into the build directory:
        
        ```
        mkdir ton-build
        cd ton-build
        ```
        
    *   Set your C and C++ compilers to use clang:
        
        ```
        export CC=clang
        export CXX=clang++
        ```
        
    *   Configure and compile the TON blockchain:
        
        ```
        cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
        ```
        
4.  **Setting Up Gramcoin Miner**
    
    *   Clone the Gramcoin miner repository:
        
        ```
        git clone https://github.com/qpwedev/gramcoin-miner
        cd gramcoin-miner
        ```
        
    *   Move all files into the build directory:
        
        ```
        mv * ~/ton-build/
        ```
        
5.  **Environment Configuration**
    
    *   Open the environment configuration file:
        
        ```
        cd ..
        nano .env
        ```
        
    *   Edit the file with the following details:
        
        ```
        TONCENTER_API_KEY= "" # Obtain from https://t.me/tonapibot
        TONCONSOLE_BEARER= "" # Obtain from https://tonconsole.com/dashboard
        MY_ADDRESS = "UQAwtgXjB-Zl5MtMQPdW6BcqIGB0oTYhrSb8lsLFw0EOUJCs" # Your TON wallet address v4
        MINTER_ADDRESS = "EQDIDs45shbXRwhnXoFZg303PkG2CihbVvQXw1k0_yVIqxcA" # Refer to https://gramcoin.org/Grams-HOWTO.txt
        MNEMONIC = "bla bla bla" # Your 24-word mnemonic phrase
        ```
        
6.  **Final Steps and Miner Launch**
    
    *   Install node dependencies:
        
        ```
        pnpm i
        ```
        
    *   Start the mining process:
        
        ```
        npx ts-node main.ts
        ```
        

After completing these steps, your TON blockchain node and Gramcoin miner should be operational. Adjust the steps as needed based on your system configuration. Happy mining!

 

[doge](https://tonresear.ch/u/doge) January 31, 2024, 12:43pm  4

If the code runs smoothly, the following content will appear

```
pnpm i
npx ts-node main.ts
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 334ms
[Starting mining]
UQDbR2ArIHop4CX91nPDy5g-1Ntq2MImAGtTX8K4f8xhx513
[Sending transaction]
[Starting mining]
UQDbR2ArIHop4CX91nPDy5g-1Ntq2MImAGtTX8K4f8xhx513
[Sending transaction]
[Starting mining]
UQDbR2ArIHop4CX91nPDy5g-1Ntq2MImAGtTX8K4f8xhx513
[Sending transaction]
[Starting mining]
```

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 89

[TON Research](/)

# [\[GPU\] Harnessing JettonGramGpuMiner: Your Guide to Mining GRAM Tokens](/t/gpu-harnessing-jettongramgpuminer-your-guide-to-mining-gram-tokens/89)

[General](/c/general/mining/47)  [Mining](/c/general/mining/47) 

[gramcoin](https://tonresear.ch/tag/gramcoin)

    

[doge](https://tonresear.ch/u/doge)   January 31, 2024, 8:47am  1

# [](#setting-up-a-gram-token-miner-on-windows-a-comprehensive-guide-1)**Setting Up a GRAM Token Miner on Windows: A Comprehensive Guide**

Greetings, TON Community!

Today, I’m excited to share with you a step-by-step guide on setting up a miner for the GRAM token on your Windows machine. This guide is designed for individuals with a basic understanding of blockchain technology and those interested in contributing to the TON network’s computational power.

## [](#prerequisites-2)**Prerequisites**

Before we dive into the setup process, ensure you have the following:

*   A Windows-operated computer.
*   A GPU with CUDA or OpenCL drivers installed.
*   NodeJs installed on your system. You can download it from [NodeJs official website](https://nodejs.org/en).

## [](#step-1-configuration-3)**Step 1: Configuration**

1.  **Create a `config.txt` File:** First, create a text file named `config.txt` in your mining directory. This file will store your mnemonic (a series of words generated by your TON wallet) and optionally a TONAPI token for enhanced API stability.
    
2.  **Enter Your Mnemonic:** Open `config.txt` and enter your mnemonic in the format shown below:
    
    ```
    SEED=word1 word2 word3 ... wordN
    TONAPI_TOKEN=your_tonapi_token_here (optional)
    ```
    
    Replace `word1 word2 word3 ... wordN` with your actual mnemonic words. If you’re using TonApi as your API provider, enter your token next to `TONAPI_TOKEN=`.
    

## [](#step-2-wallet-activation-4)**Step 2: Wallet Activation**

Activate your v4r2 wallet by sending some funds to it. Then, perform a transaction to your own wallet address. This step ensures that your wallet is ready to receive mined tokens.

## [](#step-3-install-nodejs-5)**Step 3: Install NodeJs**

If you haven’t already, install NodeJs on your computer. NodeJs is essential for running the mining software. You can download it from [here](https://nodejs.org/en).

## [](#step-4-start-mining-6)**Step 4: Start Mining**

To start the mining process, open the `start_tonhub.bat` file if you’re using a CUDA GPU. For AMD GPU users, open `start_tonhub_amd.bat` instead.

### [](#tonapi-usage-7)**TonApi Usage**

Optionally, you can use TonApi ([tonconsole.com](http://tonconsole.com)) as your API provider for increased stability. However, it requires a token to operate. For a single miner, a free token is sufficient. To mine with TonApi, use the `start_tonapi_X.bat` or `start_tonapi_X.sh` files, where `X` is replaced with your GPU type.

### [](#multi-gpu-support-8)**Multi GPU Support**

For those with multiple GPUs, you can run several video cards with one script. See `start_multi_8.sh` or `start_multi_8.bat` for examples. To convert any start script to multi-GPU, replace `send_universal` with `send_multigpu` and set the `--gpu-count X` to the number of your GPUs.

## [](#conclusion-9)**Conclusion**

Mining GRAM tokens is a fantastic way to support the TON network while potentially earning rewards. This guide is intended to simplify the setup process for Windows users. If you encounter any issues or have further questions, don’t hesitate to reach out to the community for assistance.

Happy mining, and let’s contribute to the growth and security of the TON blockchain together!

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/TrueCarry/JettonGramGpuMiner)

![](https://tonresear.ch/uploads/default/optimized/1X/4c4ab3292a7ae3852bd3f331648df1e81956f447_2_690x345.png)

### [GitHub - TrueCarry/JettonGramGpuMiner](https://github.com/TrueCarry/JettonGramGpuMiner)

Contribute to TrueCarry/JettonGramGpuMiner development by creating an account on GitHub.

  1 Like

[\[Manual\] A Step-by-Step Guide to Acquiring Grams on the TON Blockchain](https://tonresear.ch/t/manual-a-step-by-step-guide-to-acquiring-grams-on-the-ton-blockchain/87/3) 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 90

[TON Research](/)

# [\[Status\] Tracking the Progress of Gram Givers: An Insightful Overview by Gusarich](/t/status-tracking-the-progress-of-gram-givers-an-insightful-overview-by-gusarich/90)

[General](/c/general/mining/47)  [Mining](/c/general/mining/47) 

[gramcoin](https://tonresear.ch/tag/gramcoin)

    

[doge](https://tonresear.ch/u/doge)   January 31, 2024, 8:58am  1

**Introduction**

In the dynamic world of cryptocurrency mining, keeping track of available resources is crucial. The Givers Monitoring tool, created with ChatGPT by Gusarich and accessible via [this link](https://gusarich.github.io/givers-monitoring/), offers a comprehensive overview of the current status of Gram Givers in the TON blockchain ecosystem.

* * *

**Current State of Gram Givers**

As of the latest update, the total balance held by all Gram Givers stands at 4,458,118,300 GRAM out of an initial 5,000,000,000 GRAM. This indicates that approximately 10.84% of the Grams have been mined so far.

* * *

**Detailed Breakdown of Givers**

The Gram Givers are categorized into four groups based on the amount of GRAM they hold: Extra Small, Small, Medium, and Large. Here’s a detailed breakdown of their current balances:

*   **Extra Small Givers:**  
    Each of these givers holds a substantial amount of Grams, ranging from 349,728,500 to 349,778,600 GRAM across ten different givers.
    
*   **Small Givers:**  
    The balances of the Small Givers are slightly lower, varying between 72,891,000 and 73,348,000 GRAM among ten givers.
    
*   **Medium Givers:**  
    These givers have more significant amounts, with balances ranging from 12,890,000 to 28,730,000 GRAM, also spread across ten different givers.
    
*   **Large Givers:**  
    Interestingly, all Large Givers currently show a balance of 0 GRAM, indicating that their reserves have been entirely mined.
    

* * *

**Implications for Miners**

This detailed overview of the Givers’ balances is instrumental for miners in strategizing their mining activities. By analyzing these balances, miners can identify which givers might offer the most lucrative mining opportunities.

* * *

**Conclusion**

The Givers Monitoring tool provides an essential service for those involved in mining Grams on the TON blockchain. By offering real-time insights into the distribution and availability of Grams, it helps miners make informed decisions, enhancing their mining efficiency. Keep an eye on this tool for ongoing updates and strategic planning in your mining endeavors.

[![截圖 2024-01-31 下午4.58.11](https://tonresear.ch/uploads/default/optimized/1X/bb35d2ad0c0367287854e4a35cebdde5be5dc6f8_2_548x500.png)

截圖 2024-01-31 下午4.58.112762×2518 437 KB

](https://tonresear.ch/uploads/default/original/1X/bb35d2ad0c0367287854e4a35cebdde5be5dc6f8.png "截圖 2024-01-31 下午4.58.11")

  2 Likes

[kingsman](https://tonresear.ch/u/kingsman)  January 31, 2024, 9:01am  2

**Interestingly the Large Givers (100000 Grams) were depleted in a very short time**

[![截圖 2024-01-31 下午5.00.28](https://tonresear.ch/uploads/default/optimized/1X/bfccef27a92ee7eecb8276a51757120f6a88ac19_2_690x324.png)

截圖 2024-01-31 下午5.00.282828×1332 198 KB

](https://tonresear.ch/uploads/default/original/1X/bfccef27a92ee7eecb8276a51757120f6a88ac19.png "截圖 2024-01-31 下午5.00.28")

  2 Likes

[Johnnie](https://tonresear.ch/u/Johnnie) January 31, 2024, 11:12am  3

"After carefully analyzing the situation, it’s evident that there’s a significant concentration of GRAM tokens in a small number of contracts. Specifically, each of the ten contracts holds 25,000,000 GRAM, amounting to a total of 250,000,000 GRAM. This is a substantial portion of the tokens, and the rapid depletion rate observed suggests a very high level of activity or transactions involving these contracts.

Here are the contract addresses in question:

1.  EQDUIeTNcRUqsz4bugyWl4q4vg16PN2EwiyyAIEbf7\_WJZZH
2.  EQC4qKAIM0Od4RFG-4MAY0dJ3j4Wrcs0jc1XeWKJURYB9KSz
3.  EQC0Ssi1gl0IQKEGsCp91NeiTThdMqCzYvlX9sVLEU97rWqL
4.  EQDO2\_2zkIJPqBKeE\_P1VvDYOJi1vGPgiKo0Aa6Z-bY7BeuG
5.  EQADEy4zcVl-ADNMISdYSs5cVjJcHmwC9\_phXXjqNKgME7j6
6.  EQDWELx3CYohD9sIjhyEIhP915kL\_3XthqruCbmcB0YTWDqQ
7.  EQDdoh2hzGFHdQtiXJNPNrwA8yIGd4-sFxyuEr3z6JL5BIFi
8.  EQALXKp6G-IjWTPEqFKILkqcql-43DcoPzJ21Z02abpBPaQK
9.  EQBAHXFxs1ohHY2bzW9A-V0NDznkFlROkNF\_oyppxlLfsyEJ
10.  EQCUwgBew9u4NwwuFsfPsXX9a69K55uFcieaHtc-c37OYDJO

Such a swift drain of resources from these contracts could have multiple implications for the network’s economy, depending on the nature of these transactions and the intent behind them. It’s crucial for the community and the network’s stakeholders to monitor these developments closely and perhaps investigate the reasons behind this sudden movement of funds. Understanding the dynamics at play here is key to maintaining the stability and integrity of the network."

  2 Likes

[Howard](https://tonresear.ch/u/Howard) February 1, 2024, 5:17am  4

any solution or suggestion about this?

If the large giver already be mined.

有什麼可行性方案嗎？

  1 Like

[doge](https://tonresear.ch/u/doge)  February 4, 2024, 7:23am  5

Now the mid-level contracts are drying up too

[![截圖 2024-02-04 下午3.22.37](https://tonresear.ch/uploads/default/optimized/1X/d75cee9db8d818f95b13199b29252d8965613900_2_690x367.png)

截圖 2024-02-04 下午3.22.371146×611 13.2 KB

](https://tonresear.ch/uploads/default/original/1X/d75cee9db8d818f95b13199b29252d8965613900.png "截圖 2024-02-04 下午3.22.37")

 

[dvnkomancer](https://tonresear.ch/u/dvnkomancer) February 15, 2024, 6:16am  6

How much 1000 GRAM blocks do we have left? And why does the monitoring not work

 

[doge](https://tonresear.ch/u/doge) February 15, 2024, 7:34am  7

You can try [https://gram.doge.tg/](https://gram.doge.tg/)

Mainly because  
[https://ton.access.orbs.network/](https://ton.access.orbs.network/) api cannot be used

 

[dvnkomancer](https://tonresear.ch/u/dvnkomancer) February 15, 2024, 7:47am  8

Thanks, I found this too – [GitHub - petrovxyz/Gram-Givers-Monitoring](https://github.com/petrovxyz/Gram-Givers-Monitoring)

It works running the html page locally.

It seems on the one you gave me the time left is not accurate, I dont think the small givers will be drained in 30 minutes, lol. I hear speculation of 3-9 days.

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 909

[TON Research](/)

# [V4.0 Tonkeeper Wallet Update: Multiple Wallets and More Exciting Features!](/t/v4-0-tonkeeper-wallet-update-multiple-wallets-and-more-exciting-features/909)

[General](/c/general/4) 

    

[Zoro](https://tonresear.ch/u/Zoro)   March 11, 2024, 8:08pm  1

Exciting news for all Tonkeeper users! The long-awaited feature of managing multiple wallets is finally here. Now, you can add an unlimited number of your own wallets, create watch-only wallets to keep your keys safe outside the device, or even keep an eye on popular addresses. To help you navigate through your wallets with ease, you can customize each one with different colors and emojis. And yes, you heard it right - you can add as many wallets as you like!

But that’s not all! Tonkeeper now also offers token price charts. Simply click on a token in your balance to track its price movements. With the crypto market heating up, this feature couldn’t have come at a better time. Stay ahead of the game by keeping an eye on market trends right from your Tonkeeper app.

Setting up a new wallet has never been easier. Say goodbye to the tedious backup process - now, it only takes two clicks to get your wallet up and running. Just set a passcode, and voilà, your wallet is ready to go. Encourage your friends to join Tonkeeper and experience the world of crypto with the convenience and security they deserve.

Moreover, we’ve made some improvements to how tokens are organized. Tokens are now sorted by balance value, making it easier for you to find what you’re looking for. And to ensure clarity, unverified tokens are now grouped separately.

So what are you waiting for? Dive into the new and improved Tonkeeper experience and enjoy managing your crypto with unparalleled ease and security.

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/tonkeeper/wallet/releases/tag/mobile-v4.0.0)

![](https://tonresear.ch/uploads/default/optimized/1X/87cb937a585194128b68c2395137e560a3943835_2_690x345.png)

### [Release v4.0.0 · tonkeeper/wallet](https://github.com/tonkeeper/wallet/releases/tag/mobile-v4.0.0)

Finally! Multiple wallets are now available in Tonkeeper. Add any number of your own wallets, add watch-only wallets to keep keys outside the device or watch popular addresses. Customize each walle...

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 9111

[TON Research](/)

# [VirtualsWorlds is a SocialFi + GameFi](/t/virtualsworlds-is-a-socialfi-gamefi/9111)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[VirtualsWorlds\_Magic](https://tonresear.ch/u/VirtualsWorlds_Magic)   April 6, 2024, 1:12pm  1

## [](#token-name-vws-virtualsworlds-1)Token Name VWS VirtualsWorlds

## [](#projects-twitter-httpxcomvirtualsworlds-2)Project’s Twitter [http://x.com/VirtualsWorlds](http://x.com/VirtualsWorlds)

## [](#link-to-the-tokens-page-on-redoubt-andor-dyor-3)Link to the token’s page on re:doubt and/or DYOR

![](https://tonresear.ch/uploads/default/original/2X/f/f05781a9b163097be3c7a12d6292143e1f363de1.png) [dyor.io](https://dyor.io/ru/token/EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8_h)

![](https://tonresear.ch/uploads/default/optimized/2X/b/b826500d1ea599b9a15cbb37efa203b130ae8664_2_690x362.jpeg)

### [VWS (Virtuals Worlds) Token Price - DYOR.ninja](https://dyor.io/ru/token/EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8_h)

The live VWS price today is 0,0000000000000136 USD with a 24-hour trading volume of 142,42 USD. We update our Virtuals Worlds to USD price in real-time.

![](https://tonresear.ch/uploads/default/original/2X/6/634d2ca8e408bed765ed29de6b9d29d55e817cab.png) [geckoterminal.com](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

![](https://tonresear.ch/uploads/default/optimized/2X/0/06530047bfd1d6a7a8869faaa6c982a10e469424_2_690x388.png)

### [Virtuals Worlds/TON - VWS Price on DeDust with 0.4% Fee | GeckoTerminal](https://www.geckoterminal.com/ton/pools/EQCCa6jA_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2)

Virtuals Worlds/TON price today is $0.0000002656 with a 24-hour trading volume of $151.68. VWS contract address is EQBfX...Y8\_h with $10,631.71 in liquidity.

## [](#link-to-the-tokens-page-on-coinmarketcap-if-your-token-is-not-listed-there-write-na-4)Link to the token’s page on Coinmarketcap (if your token is not listed there, write n/a)

The application has been sent

## [](#link-to-the-tokens-page-on-coingecko-if-your-token-is-not-listed-there-write-na-5)Link to the token’s page on Coingecko (if your token is not listed there, write n/a)

The application has been sent

## [](#your-name-selltons-6)Your name @Selltons

## [](#your-telegram-handle-magiknft-7)Your Telegram handle (@…) @MagikNFT

## [](#any-other-links-or-details-that-you-want-to-share-8)Any other links or details that you want to share ![:tada:](https://tonresear.ch/images/emoji/twitter/tada.png?v=12 ":tada:")

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/ru/jettons/EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8_h)

### [Virtuals Worlds в блокчейне TON | TON App](https://ton.app/ru/jettons/EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8_h)

Mining VWS + 17 types  Tokens VWS Payload Token mining $VWS tokens + 17 varieties of tokens  +17 different coins VWS Game Chats with + 17 types of tokens international socials https://t.me/MagicVipClub EN https://t.me/MagicNFTcollections...

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/nft/mining-nft?id=1534)

### [Mining NFT - Mining NFT https://getgems.io/virtualsworlds Mining VWS MVP...](https://ton.app/nft/mining-nft?id=1534)

VirtualsWorlds is a SocialFi + GameFi We have combined the mechanics of these two areas and created a unique product that allows people in chat to receive cryptocurrency for activity in it VWS Payload 💎 Mining  Token 🎁 + 17 🪙 VWS Game Chats...

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/utilities/vws-utilities?id=1531)

### [VWS Utilities - VirtualsWorlds is a SocialFi + GameFi VWS Payload 💎...](https://ton.app/utilities/vws-utilities?id=1531)

VirtualsWorlds is a SocialFi + GameFi We have combined the mechanics of these two areas and created a unique product that allows people in chat to receive cryptocurrency for activity in it VWS Payload 💎 Mining  Token 🎁 + 17 🪙 VWS Game Chats...

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/channels/magic-vip-people?id=1530)

### [Magic Vip People - Mining VWS...](https://ton.app/channels/magic-vip-people?id=1530)

Mining 10% 💎, rewards Premium 💰 🚀 MVP (https://dedust.io/swap/TON/MVP)  Bridge 🔶💎 TON/BNB🎁 community member  management token VWS (https://dedust.io/swap/TON/VWS) Payload 💎 Mining Token 🎁 + 17 🪙 VWS (https://dedust.io/swap/TON/VWS) Game...

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/chats/mining-vws-and-mvp?id=1529)

### [Mining VWS and MVP - Mining VWS MVP...](https://ton.app/chats/mining-vws-and-mvp?id=1529)

Mining 10% 💎, rewards Premium 💰 🚀 MVP (https://dedust.io/swap/TON/MVP)  Bridge 🔶💎 TON/BNB🎁 community member  management token VWS (https://dedust.io/swap/TON/VWS) Payload 💎 Mining Token 🎁 + 17 🪙 VWS (https://dedust.io/swap/TON/VWS) Game...

![](https://tonresear.ch/uploads/default/original/2X/4/4f25c54673bee4cccf32f6b5edac2fb78ef7cce8.png) [TON App](https://ton.app/games/vws-games?id=1532)

### [VWS Games - VWS Games Chats win 17 💎types tokens Ton blockchain | TON App](https://ton.app/games/vws-games?id=1532)

VWS Game A game where the user can build their own settlement, will be able to earn from the sale of land and real estate in the VWS NFT collections VWS Games Chats with 17 💎types of tokens Level rewards with 17 💎 types of tokens Fireworks rewards...

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/MagicVipClub)

![](https://tonresear.ch/uploads/default/original/2X/9/91f9283d966879e7d325a5bc6074fe82c693fba8.jpeg)

### [Magic Vip Club International](https://t.me/MagicVipClub)

http://t.me/Web3VWS\_Bot Mining NFTs 💎💰 https://getgems.io/virtualsworlds https://t.me/MagicNFTcollections https://t.me/miningvws https://t.me/VirtualsWorlds https://t.me/AirdropVWSbot https://t.me/MiningChatbot https://t.me/MagicVipPeople

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/MagicNFTcollections)

![](https://tonresear.ch/uploads/default/original/2X/c/c6c1f35ea64205a100fa44e7158d2c7dcaf158e1.jpeg)

### [VWS Mining Chat EN](https://t.me/MagicNFTcollections)

http://t.me/Web3VWS\_Bot https://t.me/MiningChatbot https://t.me/MagicVipClub https://t.me/miningvws https://t.me/VirtualsWorlds https://t.me/AirdropVWSbot https://t.me/AirdropNftOpensea

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/miningvws)

![](https://tonresear.ch/uploads/default/original/2X/6/60af21d51dcea8f080d468f6b9a60f895cb380d8.jpeg)

### [Mining VWS MVP](https://t.me/miningvws)

https://t.me/MagicNFTcollections x.com/VirtualsWorlds youtube.com/@magicnft Mining NFTs getgems.io/virtualsworlds https://t.me/MiningChatbot https://t.me/AirdropNftOpensea

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/VirtualsWorlds)

![](https://tonresear.ch/uploads/default/original/2X/9/9b84553c6ae8b26c38ce48a2938edcb1969d8e4d.jpeg)

### [Mining Virtuals Worlds СНГ](https://t.me/VirtualsWorlds)

Airdrop 10 000 000 $Tokens and 1 000 NFT https://t.me/MagicVipClub https://t.me/MagicNFTcollections https://t.me/miningvws https://t.me/MiningChatbot https://t.me/AirdropVWSbot https://t.me/AirdropAiNetwork\_bot https://t.me/AIRDROPNFTOPENSEA

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/AirdropVWSbot)

![](https://tonresear.ch/uploads/default/original/2X/3/3363378793e1d4d9f786d91296a116790b59595d.jpeg)

### [VWS Exchange Web3 Games BNB Bridge Domain Zone](https://t.me/AirdropVWSbot)

Airdrop 10 000 000 000 $Tokens and 1 000 000 NFT https://t.me/AirdropAiNetwork\_bot https://t.me/AirdropVWSbot

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/MiningChatbot)

![](https://tonresear.ch/uploads/default/original/2X/f/f9247e8a752d2a600455727622ffae3f5204b245.jpeg)

### [Mining's bot](https://t.me/MiningChatbot)

x.com/VirtualsWorlds youtube.com/@magicnft Mining NFTs getgems.io/virtualsworlds

![](https://tonresear.ch/uploads/default/original/2X/f/fc04a385f0a879f940c2d809c84a274ee0c70b84.png) [YouTube](https://www.youtube.com/@magicnft)

![](https://tonresear.ch/uploads/default/optimized/2X/b/bc793e815e58fe2d6802f085f4570d2450321089_2_500x500.jpeg)

### [Magic NFT](https://www.youtube.com/@magicnft)

VWS TON adress EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8\_h https://dedust.io/pools/EQCCa6jA\_VzoQi76cAHmumoJfZbglVtY-DL-k8-f9h3vUOy2 Roadmap 1. 2022 year AirDrop NFT Blockchain  ETH. MATIC. FLOW. BNB. TRX.SOLANA. OKX.  GT. 2. 2023 year...

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/MagicVipPeople)

![](https://tonresear.ch/uploads/default/original/2X/9/94cfbe3b6ed786dfa83dc5d29bd0e3316484e464.jpeg)

### [MagicVipPeople - Overview](https://github.com/MagicVipPeople)

Mining VWS MVP https://t.me/MagicNFTcollections EQBfX9KO5yIFprHWPpJp3OsX-6cjLjEJF-h5uIQE3eLJY8\_h https://dedust.io/pools/TON/VWS - MagicVipPeople

![](https://tonresear.ch/uploads/default/original/2X/f/fbcdf5ad5474c515104d0d752ab82e2db6348772.png) [facebook.com](https://www.facebook.com/MagicVipClub)

![](https://tonresear.ch/uploads/default/original/2X/1/1bdb0f7680053fb23f59a8a412fe9f5d90d0e59a.jpeg)

### [Virtuals Worlds Nfts](https://www.facebook.com/MagicVipClub)

Virtuals Worlds Nfts 已經註冊了 Facebook。加入 Facebook 來聯絡 Virtuals Worlds Nfts 及更多你可能認識的朋友。Facebook 讓人們盡情分享，將這個世界變得更開闊、聯繫更緊密。

![](https://tonresear.ch/uploads/default/original/2X/3/388ddf3c6954dee2dd245aec7bccedf035918b69.png) [instagram.com](https://www.instagram.com/magiknft/)

### [Login • Instagram](https://www.instagram.com/magiknft/)

Welcome back to Instagram. Sign in to check out what your friends, family & interests have been capturing & sharing around the world.

[http://www.tiktok.com/@spacetickets](http://www.tiktok.com/@spacetickets)

![:two:](https://tonresear.ch/images/emoji/twitter/two.png?v=12 ":two:") Mining NFTs ![:heart:](https://tonresear.ch/images/emoji/twitter/heart.png?v=12 ":heart:") NFT collections

![](https://tonresear.ch/uploads/default/original/2X/8/8e05b7d4611098f8aee3bebf2b73f20216b2f634.png) [Getgems](https://getgems.io/virtualsworlds)

![](https://tonresear.ch/uploads/default/optimized/2X/5/54729d273197f4d2a4d9f13d9912b04220b6ee63_2_690x183.jpeg)

### [Magic Vip Club](https://getgems.io/virtualsworlds)

Mining NFTs and 17 + Tokens 🚀 MVP 🎁 community member  management toke 🎁 VWS Payload Mining 17 + Tokens 💰 VWS Game Chats with 17 types of tokens Level rewards with 17 types of tokens Fireworks rewards 17 types of tokens for communicating...

[Gate.io](https://www.gate.io/nft/collection/11879/Magic-Game)

![](https://tonresear.ch/uploads/default/optimized/2X/a/ae8fed1112114ba375019c4c8c451c9412b16a39_2_500x500.jpeg)

### [Magic-Game NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/nft/collection/11879/Magic-Game)

https://opensea.io/MagicNFTcollections ✅ Magic NFT Collections is a collection of 10,000 unique Magic NFTs - Rare digital collectibles that live on the Ethereum blockchain. Your Magic Avatar serves as your Magic NFT Club Membership Card and grants...

[Gate.io](https://www.gate.io/nft/collection/11875/Mystic-Collections)

![](https://tonresear.ch/uploads/default/optimized/2X/9/9f363c9fc85460a358028e883ffdfd3d0a5a2277_2_500x500.jpeg)

### [Mystic-Collections NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/nft/collection/11875/Mystic-Collections)

Magic NFT Collections ✅ https://rarible.com/nftworldcollections META ✅ https://opensea.io/MagicNFTcollections ✅ https://rarible.com/magicnftcollections ✅ https://t.me/MagicNFTcollections Super Bonus ✅ https://opensea.io/MetaDonGalaxy...

[Gate.io](https://www.gate.io/nft/collection/11910/Virtual-Worlds)

![](https://tonresear.ch/uploads/default/optimized/2X/0/071086f73b31a93afd1cb35e50bc5193d2b02baa_2_500x500.jpeg)

### [Virtual-Worlds NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/nft/collection/11910/Virtual-Worlds)

Magic NFT Collections ✅ https://rarible.com/magicnftcollections ✅ https://opensea.io/MagicNFTcollections ✅ https://t.me/MagicNFTcollections Super Bonus ✅ https://rarible.com/nftworldcollections META ✅ https://opensea.io/MetaDonGalaxy...

[Gate.io](https://www.gate.io/en/nft/collection/19896/BTC-Dragons)

![](https://tonresear.ch/uploads/default/optimized/2X/a/a11a5884804947d3acacf974271003d7e8def780_2_500x500.jpeg)

### [BTC-Dragons NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/en/nft/collection/19896/BTC-Dragons)

https://t.me/AirdropAiNetwork\_bot https://t.me/MagicVipClub https://www.kryptoplays.space Tickets,Tokens,NFTs that do not violate the rules crypto exchanges Gate.io, Binance. A virtual ticket to space from the crypto exchanges, which provides many...

[Gate.io](https://www.gate.io/en/nft/collection/19897/Cryptocurrency-BTC-cards)

![](https://tonresear.ch/uploads/default/optimized/2X/0/0ef84151beec9771341f1dd17efd6ac42c5c00e6_2_500x500.jpeg)

### [Cryptocurrency-BTC-cards NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/en/nft/collection/19897/Cryptocurrency-BTC-cards)

Deadlines - November 17, 2024,

[Gate.io](https://www.gate.io/en/nft/collection/19895/BTC-Pandas)

![](https://tonresear.ch/uploads/default/optimized/2X/7/7e34864f519347fe9e57e19bbbefe54c7d2d2ddd_2_500x500.jpeg)

### [BTC-Pandas NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/en/nft/collection/19895/BTC-Pandas)

https://t.me/AirdropAiNetwork\_bot https://t.me/MagicVipClub https://www.kryptoplays.space Tickets,Tokens,NFTs that do not violate the rules crypto exchanges Gate.io, Binance. A virtual ticket to space from the crypto exchanges, which provides many...

[Gate.io](https://www.gate.io/en/nft/collection/18106/Earths)

![](https://tonresear.ch/uploads/default/optimized/2X/d/d0db99c697fb980867396a0caeafaed1c7f91688_2_400x500.jpeg)

### [Earths NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/en/nft/collection/18106/Earths)

https://t.me/AirdropVWSbot https://t.me/MagicNFTcollections https://t.me/AirdropAiNetwork\_bot https://t.me/MagicVipClub https://www.virtualsworlds.space https://www.kryptoplays.space Tickets,Tokens,NFTs that do not violate the rules crypto exchanges...

[Gate.io](https://www.gate.io/en/nft/collection/19995/Lions)

![](https://tonresear.ch/uploads/default/optimized/2X/8/88594e85241dd3be76e5da6177cf4021f1efee4d_2_500x500.jpeg)

### [Lions NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/en/nft/collection/19995/Lions)

NFTs that do not violate the rules crypto exchanges Gate.io, which provides many rights and privileges that do not violate the rules of the crypto exchanges. ✅ Provides access to the privileges and rewards of the project Metaverses 🛸 👑 AiNetworks...

[Gate.io](https://www.gate.io/en/nft/collection/20025/Crypto-Dragons)

![](https://tonresear.ch/uploads/default/optimized/2X/7/768cb8b088d3f33e2812af579ffe80a0139e5b07_2_500x500.jpeg)

### [Crypto-Dragons NFTs - Buy, Sell & Trade | Gate.io](https://www.gate.io/en/nft/collection/20025/Crypto-Dragons)

NFTs that do not violate the rules crypto exchanges Gate.io, which provides many rights and privileges that do not violate the rules of the crypto exchanges. Provides access to the privileges and rewards of the project Metaverses AiNetworks NFT...

![](https://tonresear.ch/uploads/default/original/2X/0/0f367684b580e15d09c892c53f0189ccde99407c.png) [rarible.com](https://rarible.com/magicnftcollections)

![](https://tonresear.ch/uploads/default/optimized/2X/0/0726cccacdf771e67298fcd42277d3c223064de6_2_690x179.jpeg)

### [Magic](https://rarible.com/magicnftcollections)

Airdrop Tokens httpst.meAirdropAiNetwork\_bot https://t.me/AirdropVWSbot Verified https://www.gate.io/en/nft/collection/12095/Virtual-Worlds-NFT ✅...

[opensea.io/MagicNFTcollections](http://opensea.io/MagicNFTcollections)

[https://virtualsworlds.online](https://virtualsworlds.online)

[drive.google.com](https://drive.google.com/file/d/1E_QESeUY3G--zBCH6pcarD4lBMy8oDyv/view)

[](https://drive.google.com/file/d/1E_QESeUY3G--zBCH6pcarD4lBMy8oDyv/view)

### [Virtuals Worlds (1).pdf](https://drive.google.com/file/d/1E_QESeUY3G--zBCH6pcarD4lBMy8oDyv/view)

Google Drive file.

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/MagicVipClub)

![](https://tonresear.ch/uploads/default/original/2X/9/91f9283d966879e7d325a5bc6074fe82c693fba8.jpeg)

### [Magic Vip Club International](https://t.me/MagicVipClub)

http://t.me/Web3VWS\_Bot Mining NFTs 💎💰 https://getgems.io/virtualsworlds https://t.me/MagicNFTcollections https://t.me/miningvws https://t.me/VirtualsWorlds https://t.me/AirdropVWSbot https://t.me/MiningChatbot https://t.me/MagicVipPeople

Mining NFTs ![:gem:](https://tonresear.ch/images/emoji/twitter/gem.png?v=12 ":gem:")![:moneybag:](https://tonresear.ch/images/emoji/twitter/moneybag.png?v=12 ":moneybag:")

![](https://tonresear.ch/uploads/default/original/2X/8/8e05b7d4611098f8aee3bebf2b73f20216b2f634.png) [Getgems](https://getgems.io/virtualsworlds)

![](https://tonresear.ch/uploads/default/optimized/2X/5/54729d273197f4d2a4d9f13d9912b04220b6ee63_2_690x183.jpeg)

### [Magic Vip Club](https://getgems.io/virtualsworlds)

Mining NFTs and 17 + Tokens 🚀 MVP 🎁 community member  management toke 🎁 VWS Payload Mining 17 + Tokens 💰 VWS Game Chats with 17 types of tokens Level rewards with 17 types of tokens Fireworks rewards 17 types of tokens for communicating...

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  16 Likes

[clean](https://tonresear.ch/u/clean) April 6, 2024, 1:24pm  2

Good and powerful project with many quality products, Mining collection of NFTs as well as mining chats

  12 Likes

[VWS Супер. Отличный проект. Каждый день розыгрыш ценных призов и nft. Дружное и сильное комьюнити. Грамотные и внимательные Админы. Проект не стоит на месте](https://tonresear.ch/t/vws-nft/11202) 

[Soulincloud](https://tonresear.ch/u/Soulincloud) April 6, 2024, 2:11pm  3

Good project! Good luck! HODL!

  12 Likes

[Lubina90](https://tonresear.ch/u/Lubina90) April 6, 2024, 2:51pm  4

Отличный, качественный проект с огромным количеством продуктов. Целая экосистема для майнинга криптомонет и с удивительными NFT коллекциями, которые отличаются не только красивым дизайном, но и предоставлением большого количества возможностей для заработка различных криптоактивов их владельцам.

  11 Likes

[Georg](https://tonresear.ch/u/Georg) April 6, 2024, 3:17pm  5

Good project, recommend participating

  8 Likes

[Scepticall\_bot](https://tonresear.ch/u/Scepticall_bot) April 6, 2024, 3:40pm  6

Проект реально топ !

  9 Likes

[Panov83](https://tonresear.ch/u/Panov83) April 6, 2024, 3:53pm  7

Ну всё я тут)… Проект мне ваш зашёл) ранее я никогда не участвовал в подобных проектах, а этот чем-то зацепил. В общем интересный проект, много заданий с хорошими наградами) нфт вообще ![:fire:](https://tonresear.ch/images/emoji/twitter/fire.png?v=12 ":fire:"), ну конечно общительный и дружелюбный чат)

  9 Likes

[Scepticall\_bot](https://tonresear.ch/u/Scepticall_bot) April 6, 2024, 3:58pm  8

Лучший чат с вознаграждениями для активных участников ! Спасибо админу)

  10 Likes

[user494](https://tonresear.ch/u/user494) April 6, 2024, 4:48pm  9

Отличный проект! Очень рад что нашел его! Светлое будущее и только высот желаю создателям !

  9 Likes

[MagicNFT](https://tonresear.ch/u/MagicNFT) April 6, 2024, 4:49pm  10

Best Mining project  
Very good NFTs  
Bonus holders  
Nice Community

  8 Likes

[Ustar](https://tonresear.ch/u/Ustar) April 6, 2024, 5:07pm  11

Интересный проект надеюсь наберёт обороты и станет популярный

  8 Likes

[Irina](https://tonresear.ch/u/Irina) April 6, 2024, 5:10pm  12

Лучший проект, получаю ежемесячно монетки проекта за приобретение Нфт и так же за общение в их чатах, поставила в ликвидность на dedust и получаю каждый день множество монет из пула ликвидности

  8 Likes

[dJorik\_samBrero](https://tonresear.ch/u/dJorik_samBrero) April 6, 2024, 5:20pm  13

Good project, play nine as well

  7 Likes

[user499](https://tonresear.ch/u/user499) April 6, 2024, 5:23pm  14

Интересный проект, в который можно выгодно вложиться и умножить капитал)

  7 Likes

[Tasa\_Orlova](https://tonresear.ch/u/Tasa_Orlova) April 6, 2024, 5:27pm  15

Давно слежу за проектом. Он постоянно развивается. Идет огромная работа.

  7 Likes

[Sofa](https://tonresear.ch/u/Sofa) April 6, 2024, 6:24pm  16

Nice Mining Project  
Super Nfts

  5 Likes

[user511](https://tonresear.ch/u/user511) April 6, 2024, 6:25pm  17

VWS ту зе мун. Скоро всё будет!

  6 Likes

[VWSforever](https://tonresear.ch/u/VWSforever) April 6, 2024, 6:34pm  18

Каждый день фаеры из тысячи монет в чатах проекта  
Заходите в телеграм сами увидите

  4 Likes

[user516](https://tonresear.ch/u/user516) April 6, 2024, 6:39pm  19

Проект Топ! Не стоит на месте!!

  5 Likes

[user518](https://tonresear.ch/u/user518) April 6, 2024, 6:44pm  20

Самый топовый проект на мой взгляд! Так держать

  5 Likes

**[next page →](/t/virtualsworlds-is-a-socialfi-gamefi/9111?page=2)**

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 92

[TON Research](/)

# [In-Depth Analysis of the TON Inscription Ecosystem](/t/in-depth-analysis-of-the-ton-inscription-ecosystem/92)

[Application](/c/application/inscription/39)  [Inscription](/c/application/inscription/39) 

[indexer](https://tonresear.ch/tag/indexer)

    

[doge](https://tonresear.ch/u/doge)  January 31, 2024, 1:46pm  1

With Telegram as the carrier, TON users have high authenticity and low acquisition costs, making it a unique existence in today’s blockchain landscape.  
Written by: Vivi, TON Foundation

# [](#from-btc-to-multi-chain-the-inscription-revolution-1)**From BTC to Multi-Chain: The Inscription Revolution**

## [](#h-11-driving-forces-behind-the-btc-inscription-boom-2)1.1 **Driving Forces Behind the BTC Inscription Boom**

1.  **Financial Foundation:** Thanks to the improvement in macro capital liquidity, approval of spot ETFs, and expectations for the 2024 BTC halving, the market identified BTC ecosystem inscriptions as a catalyst. An influx of capital ignited a bull market, with both narrative-led and value-driven projects racing to the forefront.
    
2.  **Consensus Foundation:** BTC’s consensus in the crypto realm is the strongest, which is less about the technology itself and more about the historical chronicles of cryptocurrencies. Developing products on an existing strong consensus is much simpler than creating new narratives or forging new consensuses.
    
3.  **Growth Expectations:** Financial markets are driven by expectations. The undervaluation and the imperfection of the ecosystem imply significant room for growth. Comparing the BTC ecosystem to Ethereum’s ecosystem, valued in hundreds of billions of dollars, the growth prospects for the BTC ecosystem are still very substantial. BTC is following Ethereum’s developmental path, where speculative actions have played a role, but also have brought capital and attention to the Bitcoin ecosystem. This craze also attracted numerous builders, laying the foundation for the development of the BTC track.
    
4.  **Diversity of Offerings:** Although Bitcoin’s inscription protocol mainly revolves around Ordinals, there are numerous competitors such as Atomical, Rune, SRC20, BRC420, Taproot Asset, etc., each with its advantages, application scenarios, and followers.
    
5.  **Dominance of the Leading Protocol:** Capital and liquidity are mainly concentrated in the leading inscription protocols like Ordinals, while other protocols usually have only one or a few projects with significant market value and liquidity. This still differs significantly from the previous bull market’s diversity.
    

## [](#h-12-reasons-for-the-continuing-popularity-of-multi-chain-inscriptions-3)1.2 **Reasons for the Continuing Popularity of Multi-Chain Inscriptions**

1.  **Spillover Effect:** The existence of transaction costs (miner fees) on the BTC chain acts as a barrier for many players. The prosperity of the BTC chain inscription ecosystem leads to network congestion, increasing the cost of minting inscriptions, prompting players to explore other chains for inscription projects, thus spurring the prosperity of inscription projects on other chains.
    
2.  **Low Development and Deployment Costs:** The development cost and technical requirements for inscription protocols are relatively low compared to infrastructure and most DeFi projects, which lowers the barrier for project participation. If the OP stack achieved one-click chain creation, many inscription protocols also allow for one-click deployment. Therefore, for inscription projects, the focus should be on the utility empowerment and development planning of the inscription project itself, emphasizing operations and marketing.
    
3.  **Lottery Nature of Inscriptions:** Minting inscriptions is akin to buying lottery tickets. With a plethora of targets emerging daily in the inscription protocol, liquidity is scarce. Players tend to invest small amounts, akin to purchasing lottery tickets, indicating a mindset of not wanting to miss any potential opportunity for wealth.
    
4.  **Fair Launch as a New Narrative:** Every asset has meme attributes. If a meme is a summation of a project’s mechanism, narrative, market value, background, and developmental history, then the most popular method in the secondary market currently is Fair Launch. From POW to ICO to Fair Launch, retail investors’ pursuit of an equitable participation opportunity in coin distribution has never waned. Compared to Public Sales, inscriptions epitomize this, allowing users to mint coins with minimal network Gas fees.
    

* * *

# [](#h-2-overview-of-the-ton-inscription-ecosystem-4)**2\. Overview of the TON Inscription Ecosystem**

TON, as a significant cryptocurrency public chain, has kept pace with the recent inscription frenzy. From December to January, several inscription projects emerged on TON, including inscription protocols and foundational infrastructure. Some of these projects have achieved remarkable success, contributing to the development of the TON inscription ecosystem and actively expanding into areas like mini-app front-ends, asset trading, DeFi, protocol integration, and mini-games applications.

## [](#h-21-tonano-5)2.1 **Tonano**

Tonano, the first inscription protocol deployed on the TON blockchain (TON20), had a significant impact on the TON ecosystem. The minting of the first TON20 inscription, nano (early December 2023), served as a stress test for the network’s infrastructure, due to the high number of participants and network transactions involved.

Launched on December 5, 2023, Tonano’s TON20 inscription protocol, despite no pre-launch marketing, brought substantial traffic and transaction load to the TON blockchain, causing temporary delays and congestion. The minting was paused and then resumed on December 11, 2023, completing the minting of $nano in one day. $nano brought over 20 million interactions and 37,000 unique minting addresses to the TON ecosystem.

Following the success of $nano, other TON20 inscriptions were also actively deployed. Bolt20 completed minting on December 16 with over 31,000 minters, and [Dedust.io](http://Dedust.io) attracted over 20,000 minters.

Tonano’s launch established a dual foothold in the minds of TON users and for the inscription brand itself. Looking at the BTC inscription ecosystem, the order of asset and protocol launches significantly impacts value. For example, ordi, as the first brc20 token, had a substantial influence and community consensus, aiding in its success as a leading project.

In addition to the TON20 inscription protocols (deployment, minting, querying, transferring), Tonano is also expanding its product ecosystem, launching a TON20 inscription index search, a TON20 inscription trading market, and a cross-protocol asset bridge for TON chain inscriptions. Tonano’s Marketplace has over one million dollars in transaction volume, providing necessary liquidity for TON20. The cross-protocol asset bridge enables asset exchanges between TON20 and other inscription protocols with Jetton tokens, broadening the inscription ecosystem.

Tonano plans to launch a mini-app in Q1 2024 to enhance user accessibility, consolidate its ecological status, and promote the ease and usage of inscriptions. In the future, Tonano will continue to focus on technical innovation, invest in the TON ecosystem, leverage the high concurrency and low-cost features of the TON blockchain, and utilize the 800 million-user platform of Telegram to promote widespread application of the TON network.

## [](#h-22-gram20-6)2.2 **Gram20**

Gram20, the second inscription protocol on TON, differs from TON20 with its enhanced usability and features. It is the first to use Telegram’s mini-app front-end for deploying, minting, and transferring inscriptions and has launched a trading market to provide transaction services to users. Gram20 allows for setting time intervals for minting inscriptions, penalizing early minting, and setting start times, an advancement over basic inscription protocols.

Before its launch, the Gram20 team conducted extensive marketing. Minting began on December 22, 2023, with discussions facilitated on the Odaily platform with OKX Ventures and TON DevRel managers. To ensure sustainable development, Gram20 imposed a fee on its platform for minting inscriptions, cooling community enthusiasm. The minting process lasted seven days, with completion on December 29. The fee strategy faced backlash, not due to a flawed mechanism, but because it contradicted the prevailing freemint narrative in the current inscription market.

Although gram charged a Protocol Fee for minting, the platform pledged to use these funds for future economic incentives, sustaining the GRAM project, including 50% for buybacks of GRAM tokens and 50% for infrastructure, ecosystem investments, liquidity management, team building, and marketing. Subsequently, Gram20 launched an OTC market on the Umbrella platform, drawing user attention for gram inscription trading through promotions with various institutions and KOLs.

Gram20’s market-making team is backed by diverse resources, including joint meetings and promotional campaigns with exchanges, VCs, and KOLs. As a latecomer, it gained considerable market attention, promoting exchange listings, and initiating OTC markets in collaboration with Umbrella, with protocol asset reserves for future operations.

By leveraging TG mini-apps, Gram20 initially avoided direct competition with TON-20, offering a user-friendly product aligned with TG’s mini-app strategy. Limiting mint command intervals and imposing penalties is an effective way to increase platform participation, preventing exploitation by specialized groups. Using TON smart contracts to charge users,

Gram20 innovated the Inscriptions Coin Offering (ICO) model. However, unlike traditional ICOs, the final token exchange rate can be determined by the project.

Gram20 launched a $200,000 Ecosystem Grant Program for ecological development, supporting Gram20 with wallet integration, browsers, and indexers, building a stronger ecosystem foundation. Developing inscription bridges and DEXes for DeFi, and creating Telegram Mini Apps games, Gram20 brings enriched utility to the ecosystem.

## [](#h-23-tonot-7)2.3 **TONOT**

TONOT combines the concept of inscriptions with Telegram’s social attributes, creating fair inscriptions for every community user. By binding and activating Telegram accounts, TONOT ensures the authenticity of its minting users. Each activated Telegram account can mint 500 TONOT inscriptions, with an additional 50 per new invitation, up to a maximum of 2000.

Launched on January 5, 2024, TONOT’s inscription protocol witnessed unexpectedly high user participation, leading to frontend issues. After resolution, TONOT relaunched on January 11 and completed all minting within 24 hours. $TOT brought substantial interactions to the TON ecosystem, with 61,751 unique minting addresses, a record-breaking participation level for any blockchain project.

This was achieved through TONOT’s unique invitation and minting mechanisms, requiring user association with Telegram accounts and limiting the total number of inscriptions minted by a user within a certain period. TONOT’s mechanisms made it difficult for script-using individuals to cheat, ensuring a genuinely fair and transparent minting experience – true FairMint. TONOT does not charge protocol fees, allowing all users to mint TOT inscriptions for free, significantly increasing user participation.

What practical applications does TONOT offer? According to the official product plan, TONOT aims to implement:

1.  **Staking and Mining:** Users can stake TONOT inscriptions and mine tokens from other projects within the TON ecosystem (similar to Binance Launchpool), offering additional profit opportunities and capturing the continuous growth dividends of the TON ecosystem.
    
2.  **Decentralized Identity (DID):** Users can use TONOT inscriptions to generate exclusive decentralized identity attributes (DIDs). DIDs can be used for identity verification, digital signatures, encrypted emojis, etc., making TONOT a social currency for Telegram.
    
3.  **In-Game Token Spending:** With the development of the Telegram App, TON games will become a core business of TON. TONOT plans to collaborate with over 50 games in 2024, enriching its application scenarios. In future GameFi collaborations, TONOT will serve as a spending token, allowing users to purchase virtual items and upgrade equipment within the TON ecosystem’s GameFi, encouraging free-to-play and earn.
    

TONOT is the first social inscription on the TON blockchain, with over 60,000 holders. Its integration with Telegram ensures fairness, and binding with Telegram accounts assures user authenticity. TONOT’s product plan aims to expand inscription application scenarios through inscription staking, in-game currency, and paid Telegram groups, supporting the network ecology of TON.

## [](#h-24-fairton-8)2.4 **FairTON**

FairTON is a project launch platform prioritizing fairness, community nativity, and full lifecycle. FairTON goes beyond the BRC20 inscription protocol, focusing on “native” innovation for the TON blockchain and abandoning off-chain indexers, Achilles’ heel, achieving native operation of inscriptions at the smart contract level.

**Fair Priority**  
The popularity of BTC inscriptions extended the wave of fair launches to the entire cryptocurrency ecosystem. Most inscription projects replicated the off-chain indexing solution of Bitcoin inscriptions. The technical solution for inscriptions is a compromise due to Bitcoin script limitations, not its essence. Fair and participatory token minting aligns with the original spirit of Bitcoin. Off-chain indexing not only fragments liquidity in the public chain ecosystem but also poses asset security risks, as witnessed in multiple security incidents during the development of Bitcoin inscriptions.

**Community Native**  
The community is key to the early initiation and sustainable development of Web3 projects. As one of the world’s most popular social software platforms, Telegram, with its 800 million monthly active users, far exceeds the current participants in the cryptocurrency industry. Leveraging Telegram’s native TON support and extensive social network, FairTON aims to simplify the entry barrier for individuals and projects into the Web3 domain.

**Full Lifecycle**  
FairTON is committed to innovative project launch methods and offers a range of token management solutions, including highly customizable vesting tools, anti-rug mechanisms to protect participant funds, and liquidity tools for projects.

**JettonX**  
FairTON introduced JettonX (Jetton eXtension) in the TON ecosystem, fully compatible with the existing Jetton token standard. Jetton (Russian for Token) is the ERC-20 token model on TON, supporting the creation of homogeneous tokens like USDT, the most widely adopted token standard in the TON ecosystem

. FairTON’s customizable implementation includes fair minting, lottery minting, proof-of-work minting, social fission airdrops, and traceable airdrops for project launches. Tokens launched via FairTON can seamlessly integrate into the TON ecosystem’s liquidity and on-chain infrastructure.

## [](#h-25-townsquare-9)2.5 **TownSquare**

TownSquare is dedicated to promoting mass adoption of the TON blockchain, effectively linking Telegram’s vast 800 million user base with the inherent privacy, transparency, openness, and sovereignty of the web3 world. The project focuses on developing necessary infrastructure and key applications within the TON ecosystem. TownSquare plans to launch the first decentralized open-source inscription indexer. Additionally, the team is actively engaged in exploring and developing protocols and application tools to achieve fair and secure asset insurance.

Inscription data resides on L1, but the computation process and data results are on the indexer, essentially an off-chain server, no different from a web2 website server. Inscription holdings and transaction records are all on a website server. Any issues with the indexing service can impact assets based on this service, potentially causing an entire protocol ecosystem to collapse. There have been incidents where a protocol’s indexer had bugs, resulting in unauthorized issuance, misalignment between two indexing parties, and halting the entire protocol, causing significant community losses. Therefore, decentralized indexing of inscriptions is a necessity for the TON public chain.

Decentralized indexing is akin to nodes on a public chain, with uniform code, ensuring consistent data for anyone who downloads and runs it. This eliminates the possibility of collusion in faking index data and enhances data security. Upgrading decentralized indexing code can quickly implement protocol upgrades, greatly enhancing protocol flexibility.

**Open-Source Infrastructure**  
Reflecting on BTC’s ecosystem development, inscription infrastructure includes indexers, wallet support, marketplaces, minting tools, and data analytics. After nearly a year of development, BTC’s ecosystem has flourished, while TON’s is just budding. Fortunately, community-launched projects like Tonano, Gram20, and TONOT have received positive initial responses.

For long-term development of the inscription ecosystem, infrastructure construction is essential. Different inscription standards lead to fragmented and closed indexing. Fair participation is part of the inscription narrative, and TownSquare is set to launch a fully open-source third-party indexing service, lowering the barrier for potential inscription project participants. TON ecosystem developers no longer need to develop their indexers, as running the open-source decentralized indexing program will be convenient. Unisat and IERC-20 planned decentralized indexers include incentive mechanisms, encouraging more people to build indexers and further enhancing decentralization.

**Automated Services**  
Minting inscriptions is a form of PoW (Proof of Work). In both Tonano and Gram launches, I observed significant asymmetric advantages for scientists and programmers over ordinary retail investors. TownSquare will also launch an automated inscription minting bot, making inscription minting fairer.

I look forward to TownSquare bringing protocol standards to the TON inscription ecosystem, standardizing TON inscriptions, and providing users with fairer participation methods.

* * *

Here’s the text translated and optimized in English:

* * *

# [](#h-3-conclusion-10)**3\. Conclusion**

Current inscription projects across various blockchain networks exhibit certain deficiencies:

1.  **Sustainability Issues with Free Minting:** The completely free mint approach leads to a lack of sustainability in most projects. Only a few well-funded inscription projects engage in secondary market buybacks, bear market-making costs, and stimulate trading, which represents a significant investment. Most startups struggle post-minting activities due to a lack of token incentives and sustainable fundraising capabilities. Inscription projects need to balance fair launches with sustainable development.
    
2.  **Lack of Innovation in Copycat Inscription Protocols:** Most inscription clone projects simply replicate the BRC20 data format and mechanics without considering the differences between the Bitcoin network and other general smart contract networks. To stand out in the monotonous world of inscription protocols, there needs to be innovation in technology, token economic models, and even narratives.
    
3.  **Fragmentation in the Inscription Market:** Most inscription protocols use off-chain indexing solutions, leading to a disconnect between on-chain and off-chain states. Over-reliance on centralized services limits the circulation and exchange of inscription assets, and the lack of programmable capabilities in smart contracts makes it difficult for inscription protocols to leverage blockchain’s composability and interoperability.
    

Fortunately, the TON ecosystem’s inscription projects have developed solutions to address these issues:

1.  **Innovating Social Inscription Play via Telegram’s Infrastructure:** Telegram’s mini-apps can quickly respond to a high volume of access requests and facilitate seamless on-chain transactions using the built-in official wallet @wallet or the TON network wallet TONSpace. Telegram accounts inherently protect against Sybil attacks, effectively preventing groups from “jumping the gun,” “number brushing,” and monopolizing network resources. Leveraging Telegram’s mini-apps to provide a superior product experience for Web3 users while converting Web2 users represents a better approach to achieving mass adoption.
    
    Protocols like Gram-20, TONOT, and FairTON, which integrate the advantages of Telegram and the TON network, have created innovative inscription protocol mini-app products that have been somewhat successful. For instance, the NEAT inscription project, publicly supported and endorsed by NEAR’s official founder, Illia, finalized minting at 24,600 addresses. In contrast, a purely community-driven project like TONOT, without official endorsement, still achieved a minting volume of 61,751 addresses. In an era where user and traffic reign supreme, TON users carried by Telegram boast high authenticity and low acquisition costs, making it a unique presence in today’s blockchain world.
    
2.  **Adding Smart Contract Functionality to Inscription Protocols for Programmability:** At TON network’s technical sharing sessions, I emphasized the flexibility of TON smart contracts. Protocols like Gram-20 can incorporate protocol fees directly into contracts, enabling sustainable development while also potentially covering users’ Gas Fees, realizing a true Free Mint. FairTON introduced the JettonX token framework, fully compatible with TON’s ERC20 standard Jetton, providing customizable solutions for various innovative project launch mechanisms. With the use of TON network’s smart contracts, flexible payment and launch methods are entirely achievable, brimming with imaginative possibilities.
    
3.  **The Nascent TON Blockchain Inscription Ecosystem:** Similar to the BTC inscription protocol, multiple inscription protocols have emerged on TON, including Tonano, Gram-20, TONOT, and FairTON, focusing on on-chain inscriptions, TG mini-apps, social attributes, and on-chain smart inscriptions. While BTC has seen the rise of inscription-based trading, lending, and stablecoin projects, TON’s inscription ecosystem is just emerging, with various players exploring the ecosystem to add more utility to their inscription products.
    

This concludes my public analysis report on the TON blockchain’s inscription ecosystem. I represent the TON Foundation in stating that this content does not constitute investment advice.

* * *

 

[kingsman](https://tonresear.ch/u/kingsman) February 3, 2024, 8:32am  2

**Deciphering the Inscription Ecosystem on TON: An Analytical Deep Dive**

The emergence of inscriptions on blockchain networks marks a pivotal evolution in the digital asset space, introducing a novel layer of functionality and utility. This analysis delves into the inscription phenomenon, particularly focusing on its manifestation within The Open Network (TON) ecosystem, contrasting it with its inception on the Bitcoin (BTC) blockchain. Through a comprehensive examination, this paper aims to illuminate the driving forces, challenges, and innovations shaping the inscription landscape on TON, underscoring its unique position facilitated by Telegram’s integration.

### [](#driving-forces-behind-inscription-adoption-1)Driving Forces Behind Inscription Adoption

**Factor**

**Influence on BTC**

**Influence on TON**

Financial Foundation

Spot ETFs and halving expectations catalyze interest

TON’s integration with Telegram offers low user acquisition costs

Consensus Foundation

Strongest in the crypto realm due to historical significance

Leveraging Telegram’s infrastructure for innovative social inscription play

Growth Expectations

Anticipation of ecosystem expansion and value appreciation

High expectations for utility expansion and ecosystem growth

Diversity of Offerings

Variety in inscription protocols like Ordinals, Atomical, etc.

Innovative protocols such as Tonano, Gram-20, and FairTON adding to ecosystem diversity

### [](#challenges-in-the-inscription-ecosystem-2)Challenges in the Inscription Ecosystem

**Challenge**

**Impact on Inscription Projects**

Sustainability

Free minting models struggle with post-launch sustainability due to lack of incentives and funding.

Lack of Innovation

Many projects replicate existing protocols without significant differentiation or innovation.

Market Fragmentation

Off-chain indexing and reliance on centralized services hinder asset circulation and interoperability.

### [](#tons-response-to-inscription-ecosystem-challenges-3)TON’s Response to Inscription Ecosystem Challenges

The TON blockchain, with its deep Telegram integration, presents novel solutions that address the inherent challenges faced by inscription projects on other blockchains:

*   **Social Inscription Play**: Utilizing Telegram’s infrastructure, TON inscription projects like TONOT have innovated in creating fair and community-driven models, ensuring authenticity and reducing acquisition costs.
    
*   **Smart Contract Programmability**: TON’s smart contracts offer flexibility for inscription protocols, allowing for sustainable development models and innovative project launch mechanisms. For instance, FairTON’s JettonX framework provides customizable solutions for project launches, illustrating the potential for smart contracts to enhance inscription protocol functionality.
    
*   **Infrastructure for Mass Adoption**: Projects like TownSquare aim to bridge the gap between Telegram’s vast user base and the TON blockchain, focusing on infrastructure development and key applications to facilitate easier access to inscriptions and their associated utilities.
    

### [](#concluding-insights-4)Concluding Insights

The inscription ecosystem on TON represents a burgeoning field ripe with opportunities for innovation and growth. Unlike the fragmented and often speculative nature of inscriptions on other blockchains, TON’s approach, anchored by Telegram’s massive platform, emphasizes utility, community engagement, and fairness. As the ecosystem continues to evolve, the focus on sustainable development models, coupled with the integration of smart contract programmability, positions TON as a promising venue for the future of digital inscriptions. This analysis underscores the necessity for ongoing exploration and support for the TON inscription ecosystem, recognizing its potential to redefine digital asset interactions on blockchain networks.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 9327

[TON Research](/)

# [\[DeFi\] Shardify - NFT fractionalization platform](/t/defi-shardify-nft-fractionalization-platform/9327)

[The Open League](/c/the-open-league/app-leaderboard/58)  [App League](/c/the-open-league/app-leaderboard/58) 

    

[thehbprince](https://tonresear.ch/u/thehbprince)  April 6, 2024, 3:52pm  1

## [](#project-name-shardify-1)Project Name Shardify

## [](#projects-website-httsshardifyapp-2)Project’s Website htts://shardify.app/

## [](#projects-twitter-httpstwittercomshardify_app-3)Project’s Twitter [https://twitter.com/shardify\_app/](https://twitter.com/shardify_app/)

## [](#projects-telegram-channelgroup-httpstmeshardify-4)Project’s Telegram channel/group [Telegram: Contact @shardify](https://t.me/shardify/)

## [](#metrics-5)Metrics

Please share the TVL (total value locked) of your protocol/application and the protocol fee for the last month.  
Protocols TVL is 872.2B $wNOT = 750 000 TON (floor price \* vouchers count)  
Protocols fee is ~17% => 130 000 TON

## [](#your-name-seymour-6)Your name Seymour

## [](#your-telegram-handle-thehbprince-7)Your Telegram handle thehbprince

## [](#any-other-links-or-details-that-you-want-to-share-8)Any other links or details that you want to share

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  14 Likes

[MaxQ](https://tonresear.ch/u/MaxQ) April 6, 2024, 4:56pm  2

my favorite project

$MRDN  
up up up

  7 Likes

[TRRRTL](https://tonresear.ch/u/TRRRTL) April 6, 2024, 4:58pm  3

pledged NFT and sold jeton at a higher price, especially like that the project is from Meridian DAO $MRDN

  6 Likes

[ShadeFrost](https://tonresear.ch/u/ShadeFrost) April 6, 2024, 5:08pm  4

уникальное решение в сети тон. другие до такого не додумались. пытаются выжать все возможности из сети тона.

  6 Likes

[Yust](https://tonresear.ch/u/Yust) April 6, 2024, 5:23pm  5

Если коротко, Огонь!

  6 Likes

[Mrdn](https://tonresear.ch/u/Mrdn) April 6, 2024, 6:18pm  6

Ребята пилят фишки первыми

  5 Likes

[Vc359](https://tonresear.ch/u/Vc359) April 6, 2024, 6:29pm  7

Отличный проект, интересный запуск!)

  5 Likes

[user176](https://tonresear.ch/u/user176) April 7, 2024, 2:00am  8

Топ топ топ топ топ топ

  3 Likes

[vld](https://tonresear.ch/u/vld) April 7, 2024, 7:36am  9

Meridian projects have real positive impact on TON so I guess that we not should, we **MUST** support them! ![:handshake:](https://tonresear.ch/images/emoji/twitter/handshake.png?v=12 ":handshake:")

  4 Likes

[Senya](https://tonresear.ch/u/Senya) April 7, 2024, 9:29am  10

Mrdn best team.  
Good job.  
Best future

  3 Likes

[Riyadweb](https://tonresear.ch/u/Riyadweb) April 16, 2024, 7:40pm  11

**[Analyzing the Implementation and Functionality of the Liquid Staking Pool in TON Blockchain](https://tonresear.ch/t/analyzing-the-implementation-and-functionality-of-the-liquid-staking-pool-in-ton-blockchain/36)**

  2 Likes

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) May 6, 2024, 10:41am  12

Hey there! Thanks for applying for the Open League. This season, there won’t be a DeFi leaderboard, but stay tuned for future seasons.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 9363

[TON Research](/)

# [Shardify - NFT fractionalization platform app](/t/shardify-nft-fractionalization-platform-app/9363)

[The Open League](/c/the-open-league/app-leaderboard/58)  [App League](/c/the-open-league/app-leaderboard/58) 

    

[thehbprince](https://tonresear.ch/u/thehbprince)  April 6, 2024, 4:09pm  1

## [](#project-name-shardify-1)Project Name Shardify

## [](#projects-website-httsshardifyapp-2)Project’s Website htts://shardify.app/

## [](#projects-twitter-httpstwittercomshardify_app-3)Project’s Twitter [https://twitter.com/shardify\_app/](https://twitter.com/shardify_app/)

## [](#projects-telegram-channelgroup-httpstmeshardify-4)Project’s Telegram channel/group [Telegram: Contact @shardify](https://t.me/shardify/)

## [](#metrics-5)Metrics

Attach a link or a document (of any format) that describes your current, specifically UAW (total, monthly, daily), N of tx (monthly) and Retention D1, D7, D14. Please include proofs of this traction.  
[https://tonviewer.com/EQCIXQn940RNcOk6GzSorRSiA9WZC9xUz-6lyhl6Ap6na2sh](https://tonviewer.com/EQCIXQn940RNcOk6GzSorRSiA9WZC9xUz-6lyhl6Ap6na2sh)

## [](#your-name-seymour-6)Your name: Seymour

## [](#your-telegram-handle-thehbprince-7)Your Telegram handle: thehbprince

## [](#any-other-links-or-details-that-you-want-to-share-8)Any other links or details that you want to share

![](https://telegram.org/img/website_icon.svg?4) [Telegram](https://t.me/shardify_bot/)

![](https://tonresear.ch/uploads/default/original/2X/d/de7279f763384ca0c50b6ff5d3181f5de349864f.jpeg)

### [Shardify](https://t.me/shardify_bot/)

You can contact @shardify\_bot right away.

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  11 Likes

[ShadeFrost](https://tonresear.ch/u/ShadeFrost) April 6, 2024, 5:11pm  2

странно будет если Shardify не попадет под эту категорию. потому что у них и конкурентов не существует. это не очередной обменник жетонов. а обменник nft в жетоны и наоборот

  5 Likes

[Yust](https://tonresear.ch/u/Yust) April 6, 2024, 5:22pm  3

По мне так крутой сервис, единственный в своем роде

  5 Likes

[Mrdn](https://tonresear.ch/u/Mrdn) April 6, 2024, 6:21pm  4

new generation of features, mrdn team are the best

  4 Likes

[user176](https://tonresear.ch/u/user176) April 7, 2024, 2:00am  5

Топ топ топ топ топ топ топ топ

  4 Likes

[vld](https://tonresear.ch/u/vld) April 7, 2024, 7:41am  6

Like I said before - Meridian projects have real positive impact on TON so I guess that we not should, we **MUST** support them! ![:handshake:](https://tonresear.ch/images/emoji/twitter/handshake.png?v=12 ":handshake:")![:ship:](https://tonresear.ch/images/emoji/twitter/ship.png?v=12 ":ship:")

  3 Likes

[Senya](https://tonresear.ch/u/Senya) April 7, 2024, 9:28am  7

More publicity that Shardify is a project of the Mrdn team

  3 Likes

[MaxQ](https://tonresear.ch/u/MaxQ) April 21, 2024, 1:23pm  8

My favorite gem  
$MRDN UP UP UP

 

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) May 6, 2024, 10:40am  9

Congrats on being approved to join The Open League. We hope to see your good performance and fair competition!

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 9382

[TON Research](/)

# [wNOT - Shards of Notcoin NFT bonds](/t/wnot-shards-of-notcoin-nft-bonds/9382)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[thehbprince](https://tonresear.ch/u/thehbprince)  April 6, 2024, 4:20pm  1

## [](#token-name-wnot-1)Token Name: wNOT

## [](#please-describe-your-project-and-token-utility-nft-fractionalization-pratform-user-can-get-this-token-by-putting-their-notcoin-voucher-and-trade-tokens-on-dex-2)Please describe your project and token utility: NFT fractionalization pratform. User can get this token by putting their Notcoin Voucher and trade tokens on DEX

## [](#please-describe-your-project-roadmap-for-the-next-6-12-months-shardifies-dex-with-its-own-jetton-pairs-jettons-staking-few-new-nft-pools-with-liquidity-for-lp-pools-3)Please describe your project roadmap for the next 6-12 months: shardifies dex with its own jetton pairs, jettons staking, few new NFT pools with liquidity for LP-pools.

## [](#projects-twitter-httpstwittercomshardify_app-4)Project’s Twitter [https://twitter.com/shardify\_app/](https://twitter.com/shardify_app/)

## [](#link-to-the-tokens-page-on-redoubt-andor-dyor-httpsdyoriotokeneqcixqn940rncok6gzsorrsia9wzc9xuz-6lyhl6ap6na2sh-5)Link to the token’s page on re:doubt and/or DYOR: [https://dyor.io/token/EQCIXQn940RNcOk6GzSorRSiA9WZC9xUz-6lyhl6Ap6na2sh](https://dyor.io/token/EQCIXQn940RNcOk6GzSorRSiA9WZC9xUz-6lyhl6Ap6na2sh)

## [](#link-to-the-tokens-page-on-coinmarketcap-if-your-token-is-not-listed-there-write-na-na-6)Link to the token’s page on Coinmarketcap (if your token is not listed there, write n/a) N/A

## [](#link-to-the-tokens-page-on-coingecko-if-your-token-is-not-listed-there-write-na-7)Link to the token’s page on Coingecko (if your token is not listed there, write n/a)

N/A

## [](#your-name-seymour-8)Your name Seymour

## [](#your-telegram-handle-thehbprince-9)Your Telegram handle (@…) thehbprince

## [](#any-other-links-or-details-that-you-want-to-share-10)Any other links or details that you want to share

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  11 Likes

[ShadeFrost](https://tonresear.ch/u/ShadeFrost) April 6, 2024, 5:03pm  2

Дорогу молодым! дайте развиваться и новым проектам! wNot только появился, а уже и своё утилити имеет

  4 Likes

[Mrdn](https://tonresear.ch/u/Mrdn) April 6, 2024, 6:15pm  3

А в чем утилити, можешь раскрыть?

  3 Likes

[user176](https://tonresear.ch/u/user176) April 7, 2024, 1:59am  4

Крутой продукт, мрд молодцы

  4 Likes

[vld](https://tonresear.ch/u/vld) April 7, 2024, 7:31am  5

MRDN projects have real positive impact on TON ![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")

  3 Likes

[Senya](https://tonresear.ch/u/Senya) April 7, 2024, 9:26am  6

Mrdn is just at the beginning of its journey. I am sure that this project and its entire team have a great future ahead of them

  2 Likes

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) April 18, 2024, 5:11pm  7

Congrats on being approved to join The Open League Season 1. We hope to see your good performance and fair competition!

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 94

[TON Research](/)

# [Exploring the Potential of Crypto Oracles with RedsTONe's Partnership with TON](/t/exploring-the-potential-of-crypto-oracles-with-redstones-partnership-with-ton/94)

[Application](/c/application/oracle/30)  [Oracle](/c/application/oracle/30) 

    

[doge](https://tonresear.ch/u/doge)   January 31, 2024, 2:21pm  1

_By Ivan Romanovich_

* * *

**The Emergence of New Possibilities in Blockchain Technology**

The recent partnership between RedsTONe Oracle and the TON blockchain has sparked excitement in the blockchain community. This collaboration is not just another headline; it’s a gateway to innovative projects on TON. But the question arises: beyond the common applications like cryptocurrency price predictions or lotteries, what groundbreaking projects can be created using oracles?

In this article, we delve into the practical applications of oracles in the blockchain world, focusing on their real-world utility beyond the obvious.

[![image](https://tonresear.ch/uploads/default/optimized/1X/e2aaa73df49bc9b80bc2b469e2fc5b4831460f16_2_690x389.jpeg)

image780×440 52.9 KB

](https://tonresear.ch/uploads/default/original/1X/e2aaa73df49bc9b80bc2b469e2fc5b4831460f16.jpeg "image")

**1\. Proof of Reserve: Ensuring Stability in a Volatile World**

Cryptocurrency’s inherent volatility necessitates stable assets. Stablecoins, backed by fiat currency rates or commodities, are a popular solution. However, the crux lies in ensuring these tokens genuinely represent the underlying assets. Audits, like those for USDC and USDT, often raise more questions than they answer. What exactly backs these coins, and can we trust their stability?

This is where oracles can be a game-changer. Imagine a system where token reserves are confirmed in real-time by validators through a bank’s API. This transparent mechanism can regulate the issuance or burning of stablecoins based on actual reserves, adding a layer of trust to these digital assets.

[![image](https://tonresear.ch/uploads/default/original/1X/91b0e65bc3f9f3a2597b86845598b7fb862cb93a.jpeg)

image780×440 49.2 KB

](https://tonresear.ch/uploads/default/original/1X/91b0e65bc3f9f3a2597b86845598b7fb862cb93a.jpeg "image")

**2\. Oracle Infrastructure for Automating Trading Strategies**

Automation in blockchain trading isn’t just about convenience; it’s about reliability and fault tolerance. Services like automatic portfolio rebalancing depend on continuous monitoring of blockchain changes. Oracles offer a robust infrastructure for such automation, allowing trading services to outsource their uptime and reliability challenges.

[![image](https://tonresear.ch/uploads/default/optimized/1X/031030244e5334f48f2cae195ce5e0f2ba0aeb6e_2_690x389.jpeg)

image780×440 54.3 KB

](https://tonresear.ch/uploads/default/original/1X/031030244e5334f48f2cae195ce5e0f2ba0aeb6e.jpeg "image")

A notable example is a company using Chainlink’s automation for its trading robot, demonstrating the effectiveness of on-chain event automation in a comprehensive video.

**3\. Resiliency in Decentralized Lending**

Decentralized lending protocols typically involve locking funds in smart contracts. However, high volatility can diminish the value of these funds. A novel approach is securing loans with a 110% cryptocurrency collateral, offering stablecoins in return, without a fixed repayment schedule.

This model needs constant access to USD/cryptocurrency pair values. The decentralized oracle system’s fault tolerance becomes crucial here, ensuring accuracy and preventing fraud in loan protocols.

[![image](https://tonresear.ch/uploads/default/original/1X/32eeb1c5371f091d09188f4bbd8aee021c91a5e2.jpeg)

image780×440 54.8 KB

](https://tonresear.ch/uploads/default/original/1X/32eeb1c5371f091d09188f4bbd8aee021c91a5e2.jpeg "image")

**4\. Streamlining Insurance Processes with Oracles**

In the insurance sector, oracles don’t necessarily innovate but expedite existing processes. By sourcing data from oracles, insurance companies can significantly speed up their application processing, a boon particularly for logistics.

[![image](https://tonresear.ch/uploads/default/original/1X/59df7b5536ebd5f7b5716a2c546a13a996dd2617.jpeg)

image780×442 48.6 KB

](https://tonresear.ch/uploads/default/original/1X/59df7b5536ebd5f7b5716a2c546a13a996dd2617.jpeg "image")

An example is Otonomi.ai, which uses data from oracles in their insurance claim decisions, as elaborated by their CEO in a detailed video.

**5\. Derivatives Market and Data Relevance**

In derivatives, timing and accuracy of data are paramount. Delays can be exploited for profit, making data relevance crucial. Exploring off-chain and on-chain oracle solutions in this context can shed light on how they address this challenge, as discussed in a dedicated article.

**Conclusion**

Oracles in blockchain offer more than meets the eye. Their potential lies in properties like fault tolerance and smart contract automation. The entry of oracles into the TON ecosystem heralds a new era of innovative DApps.

For those interested in TON blockchain, I have open-source lessons on creating applications on TON, available on GitHub. Also, keep an eye out for upcoming tutorials on integrating Redstone oracles with TON smart contracts.

**Stay Updated:** For the latest tutorials, join our Telegram channel at [TON Learning](https://t.me/ton_learn).

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 944

[TON Research](/)

# [A new STONfi DEX bot was released for STONfi on Telegram today](/t/a-new-stonfi-dex-bot-was-released-for-stonfi-on-telegram-today/944)

[Application](/c/application/dex/24)  [DEX](/c/application/dex/24) 

    

[Evgeniy554](https://tonresear.ch/u/Evgeniy554)  March 12, 2024, 3:43pm  1

A new STONfi DEX bot was released for STONfi on Telegram today. Explain how it differs from the STONfi bot? Why does STONfi DEX have a check mark and STONfi bot doesn’t have a check mark?

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 95

[TON Research](/)

# [Unveiling the Enhanced snarkjs with FunC Language Support for the TVM Challenge](/t/unveiling-the-enhanced-snarkjs-with-func-language-support-for-the-tvm-challenge/95)

[Application](/c/application/zk/13)  [ZK](/c/application/zk/13) 

    

[Johnnie](https://tonresear.ch/u/Johnnie)   January 31, 2024, 2:39pm  1

**Introduction**

Exciting news for developers and enthusiasts in zero-knowledge proofs and blockchain technology! The `snarkjs` tool, a cornerstone project from `iden3`, now boasts a groundbreaking update - the introduction of verifier generation in FunC language, tailored for the TVM Challenge. This integration not only enriches `snarkjs` but also marks a significant leap in cryptographic tooling.

* * *

**What is snarkjs?**

For the uninitiated, `snarkjs` is a comprehensive JavaScript and Web Assembly implementation of zkSNARK and PLONK schemes. It’s designed to simplify the process of generating zero-knowledge proofs, particularly for `circom 2.0` circuits. With this tool, users can engage in secure multi-party ceremonies like the [_powers of tau_](https://medium.com/coinmonks/announcing-the-perpetual-powers-of-tau-ceremony-to-benefit-all-zk-snark-projects-c3da86af8377) and circuit-specific ceremonies, essential for maintaining integrity in cryptographic computations.

* * *

**New Features in the TVM Challenge Update**

The latest update shines in its support for **BLS12-381** curve operations and **Keccak256** hash, key components in advanced cryptographic functions. Notably, this update allows exporting verifiers in FunC, a feature pivotal for developers working with the TVM blockchain.

To get started, simply clone the fork, install dependencies using `npm ci`, and follow the standard `snarkjs` guide. The process culminates in exporting a verifier in FunC using `node cli.js zkey export funcverifier circuit_final.zkey verifier.fc`.

* * *

**Deep Dive into snarkjs**

Beyond the TVM Challenge, `snarkjs` offers an array of functionalities:

*   **Universal Multi-party Ceremonies**: Supports both bn128 and bls12-381 curves, catering to a wide range of cryptographic needs.
*   **Compatibility**: Interoperable with Semaphore’s Perpetual Powers of Tau and other implementations, ensuring wide-ranging utility.
*   **Node.js and Browser Support**: Flexible usage in different environments, whether you’re scripting in Node.js or deploying directly in a browser.
*   **Performance**: Leveraging Web Assembly and parallel computations, it stands out for its high performance.

* * *

**Getting Started**

Beginners can easily dive into `snarkjs`:

1.  **Installation**: Ensure Node.js (v16 or later) is installed. Then, install `snarkjs` with `npm install -g snarkjs@latest`.
2.  **Basic Usage**: Explore commands and their functions using `snarkjs --help`.
3.  **Advanced Features**: For those delving deeper, the tool offers extensive capabilities from setting up ceremonies to generating proofs and verifiers.

* * *

**In Conclusion**

This update to `snarkjs` not only caters to the specific needs of the TVM Challenge but also significantly enhances the toolkit available to developers in the realm of zero-knowledge proofs and blockchain technology. It’s a testament to the evolving landscape of cryptographic tools, making complex processes more accessible and efficient.

**Join the Community**

For any queries or to connect with like-minded individuals, join our [telegram group](https://t.me/iden3io). Stay updated and contribute to the exciting world of zero-knowledge proofs!

* * *

**Acknowledgments and Licensing**

`snarkjs` is part of the iden3 project, copyrighted 2018 by the 0KIMS association and published under the GPL-3 license.

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/hrmon/snarkjs-func)

![](https://tonresear.ch/uploads/default/optimized/1X/59321dab48e9939d22861f2530d10219c4f53bcf_2_690x345.png)

### [GitHub - hrmon/snarkjs-func: zkSNARK implementation in JavaScript & WASM](https://github.com/hrmon/snarkjs-func)

zkSNARK implementation in JavaScript & WASM. Contribute to hrmon/snarkjs-func development by creating an account on GitHub.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 96

[TON Research](/)

# [Introducing Wallet Inplug-v1: A Versatile Blockchain Wallet Solution](/t/introducing-wallet-inplug-v1-a-versatile-blockchain-wallet-solution/96)

[Application](/c/application/wallet/22)  [Wallet](/c/application/wallet/22) 

    

[Johnnie](https://tonresear.ch/u/Johnnie)  January 31, 2024, 2:54pm  1

## [](#overview-1)Overview

Wallet Inplug-v1, formerly known as v5, represents a significant upgrade over its predecessor, v4, in the world of blockchain wallet technology. This custom wallet version is designed to offer enhanced functionality and flexibility for users and developers alike.

## [](#key-features-2)Key Features

1.  **Execution of Arbitrary Onchain Code:**
    *   Users can now execute a continuation on the blockchain, enhancing the wallet’s capability to predict and handle unsafe random scenarios.
2.  **Advanced Plugin Functionality:**
    *   Plugins act like small, inlined contracts and can be triggered by incoming messages.
    *   Plugins are stored as libraries in the masterchain, ensuring efficient access and execution.
3.  **Support for Multiple Key Types:**
    *   In addition to the traditional Ed25519 keys, Wallet Inplug-v1 introduces support for secp256r1 keys, broadening the wallet’s compatibility.

## [](#technical-considerations-3)Technical Considerations

*   **Inline Functionality:**
    *   All plugin functions must be either inlined or referenced using `inline_ref`. This ensures that calls remain within the plugin’s control and are executed correctly.
*   **Trust and Security in Plugins:**
    *   Despite plugins being generally trusted, it is advisable to formally verify their outgoing messages to avoid expensive validation processes and handle a wide range of cases.
*   **Continuations and Isolation:**
    *   The use of continuations in signed messages should be approached with caution. Lack of isolation in these continuations can lead to innovative use cases but also necessitates careful offchain evaluation before signing messages.
*   **Handling of Timestamps in Signed Messages:**
    *   While delayed messages can be beneficial in certain scenarios (like extending domain contracts), it’s crucial to manage the upper limit timestamps to prevent delayed message attacks.

## [](#code-integration-4)Code Integration

The Wallet Inplug-v1 is equipped with a comprehensive set of functionalities for seamless integration and interaction with blockchain networks. Here are some highlights:

*   **Contract Creation and Initialization:**
    *   Users can easily create and initialize the wallet contract with their specific parameters such as workchain, publicKey, and walletId.
*   **Balance and Seqno Queries:**
    *   Functions for querying the wallet’s balance and sequence number (seqno) are provided for effective wallet management.
*   **Plugin Management:**
    *   The wallet supports installing, invoking, and uninstalling plugins, offering users a high degree of customization and flexibility.
*   **Transaction Handling:**
    *   A variety of transaction-related functionalities are available, including sending transfers, executing code, and deploying contracts.

## [](#final-thoughts-5)Final Thoughts

Wallet Inplug-v1 stands out as a robust, versatile wallet solution in the blockchain space. Its ability to execute arbitrary onchain code, advanced plugin system, and support for multiple key types mark significant advancements in wallet technology. While embracing these new features, users and developers should also be mindful of the technical considerations and security implications outlined above.

![](https://github.githubassets.com/favicons/favicon.svg) [github.com](https://github.com/ProgramCrafter/wallet-contract/tree/main)

### [GitHub - ProgramCrafter/wallet-contract: Wallet V5 and plugin smart contracts](https://github.com/ProgramCrafter/wallet-contract/tree/main)

[main](https://github.com/ProgramCrafter/wallet-contract/tree/main)

Wallet V5 and plugin smart contracts. Contribute to ProgramCrafter/wallet-contract development by creating an account on GitHub.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 9656

[TON Research](/)

# [ALL - Community token with utilities](/t/all-community-token-with-utilities/9656)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[ALL\_TON](https://tonresear.ch/u/ALL_TON)  April 6, 2024, 6:57pm  1

## [](#token-name-all-1)Token Name - ALL

## [](#projects-twitter-na-2)Project’s Twitter - n/a

## [](#link-to-the-tokens-page-on-redoubt-andor-dyor-3)Link to the token’s page on re:doubt and/or DYOR

DYOR - [https://dyor.io/ru/token/EQDlnVo-6abJzyHlU8uB7pRjE7OIKt4HTTDPG4hfwOf5jTPg](https://dyor.io/ru/token/EQDlnVo-6abJzyHlU8uB7pRjE7OIKt4HTTDPG4hfwOf5jTPg)  
re:doubt - [https://beta.redoubt.online/feed/jettons/EQDlnVo-6abJzyHlU8uB7pRjE7OIKt4HTTDPG4hfwOf5jTPg](https://beta.redoubt.online/feed/jettons/EQDlnVo-6abJzyHlU8uB7pRjE7OIKt4HTTDPG4hfwOf5jTPg)

## [](#link-to-the-tokens-page-on-coinmarketcap-if-your-token-is-not-listed-there-write-na-na-4)Link to the token’s page on Coinmarketcap (if your token is not listed there, write n/a) - n/a

## [](#link-to-the-tokens-page-on-coingecko-if-your-token-is-not-listed-there-write-na-na-5)Link to the token’s page on Coingecko (if your token is not listed there, write n/a) - n/a

## [](#your-name-daarkdexxil-6)Your name - DaarkDexxil

## [](#your-telegram-handle-darkdeeevil-7)Your Telegram handle (@…) - @darkdeeevil

## [](#any-other-links-or-details-that-you-want-to-share-httpsallontontildaws-8)Any other links or details that you want to share [https://allonton.tilda.ws](https://allonton.tilda.ws)

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  2 Likes

[openleaguesupport](https://tonresear.ch/u/openleaguesupport) April 11, 2024, 12:36pm  2

Hello ALL team,

Thank you for taking the time to apply for The Open League Season #1.

After a thorough review, we must inform you that, unfortunately, your token does not meet our current eligibility criteria. You can find them through this [link](https://tonresear.ch/t/about-the-memecoin-leaderboard-category/1276).

Once your token aligns with these criteria, please feel free to resubmit your application for the future seasons.

We look forward to seeing your application again in the future.

Thank you.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 983

[TON Research](/)

# [Notcoin Possible Reward per 10 million](/t/notcoin-possible-reward-per-10-million/983)

[General](/c/general/4) 

    

[Notcoin](https://tonresear.ch/u/Notcoin)  March 13, 2024, 8:50am  1

What is the price per notcoin?  
What is the price per 10 Million Notcoin?  
Is there a reward for telegram premium subscribers?  
Is there a reward for number of invited Friends?  
Is there a reward for notcoin skin?

Probably Nothing

  7 Likes

[doge](https://tonresear.ch/u/doge) March 13, 2024, 8:56am  2

I also want to know.

I think everyone wants to know.

XDDDDDD

When will it be available on okx?

  3 Likes

[Aska\_Kwok](https://tonresear.ch/u/Aska_Kwok) March 13, 2024, 7:41pm  3

I’m sure the notcoin team will take into account the users who spend their gold on upgrades and buying skins, they are the ones who actually enjoy the game and not just stare at the numbers, they should be rewarded！

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 9891

[TON Research](/)

# [Супер спасибо большое](/t/topic/9891)

[Русский](/c/ru/49) 

    

[Salohiddin\_Halimov](https://tonresear.ch/u/Salohiddin_Halimov)  April 6, 2024, 9:16pm  1

Супер спасибо большое мне очень понравились я так раньше не видел

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 99

[TON Research](/)

# [Enhancing Blockchain Security and Efficiency with FrosTON: A FROST-based Threshold Signature Implementation on TON](/t/enhancing-blockchain-security-and-efficiency-with-froston-a-frost-based-threshold-signature-implementation-on-ton/99)

[Application](/c/application/20) 

    

[Johnnie](https://tonresear.ch/u/Johnnie)   February 2, 2024, 12:35pm  1

In the rapidly evolving landscape of blockchain technology, ensuring security and efficiency in transaction verification and signature processes is paramount. The FrosTON project emerges as a cutting-edge solution, leveraging the Flexible Round-Optimized Schnorr Threshold (FROST) protocol to facilitate creating and verifying threshold signatures within the TON (The Open Network) blockchain ecosystem. This article delves into the technical intricacies, applications, and implications of the FrosTON project, highlighting its potential to redefine secure and efficient blockchain operations.

**Project Overview**

FrosTON is an innovative implementation that integrates the FROST protocol with the TON blockchain to provide a secure and efficient mechanism for generating and verifying threshold signatures. Threshold signatures, by design, require a subset of participants within a larger group to approve a transaction or message, enhancing security and reducing the risk associated with single-point failures or key compromises. The FrosTON project encompasses key generation ceremonies and signing processes, which are meticulously detailed and can be practically tested using the `frost_exec.py` script provided within the repository. This script outputs integers, which are subsequently utilized in FunC for verifying the correctness of the operation, showcasing the practical application of the FrosTON project in real-world scenarios.

**Technical Foundation and Implementation**

At the core of FrosTON is the implementation of the FROST protocol, which is designed to optimize the efficiency and security of the threshold signing process. The project repository offers a comprehensive guide to building and running the necessary components, including cloning the repository, setting up a Python virtual environment, and compiling the bindings using `maturin`. The seamless integration of these components underlines the project’s commitment to providing a user-friendly and accessible platform for leveraging threshold signatures on the TON blockchain.

The practical application of FrosTON is demonstrated through the `frost_exec.py` script, which simulates the generation of a group key, the preparation of a message hash, and the creation of a Schnorr threshold signature. The script further verifies the signature to ensure its correctness, exemplifying the operational effectiveness of the FrosTON project in enhancing the security and efficiency of blockchain transactions.

**Implications and Future Directions**

The FrosTON project represents a significant advancement in the realm of blockchain security and efficiency. By integrating the FROST protocol with the TON blockchain, FrosTON not only enhances the security of transactions through threshold signatures but also optimizes the verification process, making it more efficient and cost-effective. This integration has the potential to serve as a foundational element for developing secure multi-signature wallets, smart contracts, and other cryptographic operations on the TON blockchain, thereby contributing to the broader adoption and development of secure, efficient, and scalable blockchain solutions.

In conclusion, the FrosTON project stands as a testament to the innovative application of threshold signatures within the blockchain ecosystem, offering a robust framework for secure and efficient transaction verification on the TON blockchain. As the blockchain landscape continues to evolve, projects like FrosTON pave the way for a more secure, efficient, and decentralized future.

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/alirezatabatabaeian/FrosTON)

![](https://tonresear.ch/uploads/default/optimized/1X/c094fcf569901b332cc8e469923e6e80f8977920_2_690x345.png)

### [GitHub - alirezatabatabaeian/FrosTON](https://github.com/alirezatabatabaeian/FrosTON)

Contribute to alirezatabatabaeian/FrosTON development by creating an account on GitHub.

 

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 990

[TON Research](/)

# [Who is the Founder of Notcoin and possible price per notcoin](/t/who-is-the-founder-of-notcoin-and-possible-price-per-notcoin/990)

[General](/c/general/4) 

    

[Notcoin](https://tonresear.ch/u/Notcoin)  March 13, 2024, 9:12am  1

Mr. Pavel Durov

born 10 October 1984 is a Russian-born French-Kittitian–Emirati entrepreneur who is known for founding the social networking site VK and the app Telegram Messenger.

As of 29 September 2022, his net worth is estimated at US$15.1 billion.

In 2022, he was recognized as the richest person in the United Arab Emirates, according to Forbes.

In February 2023, Forbes named him the most powerful entrepreneur in Dubai.

100million funding for 0.0001 per notcoin is achievable

  1 Like

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 992

[TON Research](/)

# [Notcoin Pre Market is Open](/t/notcoin-pre-market-is-open/992)

[General](/c/general/4) 

    

[Notcoin](https://tonresear.ch/u/Notcoin)  March 13, 2024, 9:17am  1

[Notcoin Pre-Market is open](https://getgems.io/notcoin) ![:gem:](https://tonresear.ch/images/emoji/twitter/gem.png?v=12 ":gem:")

For the first time, you can buy and sell Notcoin before the token launch.

Those who were good at mining, invited friends and were active with campaigns: you can now convert your Notcoin game balance into 10M Notcoin Vouchers (NFT) and trade them on Getgems (peer-to-peer).

Vouchers can be exchanged for $NOT after the token launch.  
Or you can wait until the token launch and convert your balance to $NOT directly.

No one knows what the price of $NOT token will be. The listing price may even be zero, so take that into account when trading vouchers.

Pre-Market supports $NOT listings through Royalties: 20% from NFT purchases go to liquidity for token listings.

**We are gradually rolling out this functionality** **to reduce the load, so** **please be patient**.

[How it works](https://notcoin.notion.site/Notcoin-Pre-Market-9cbf7ad8045f4956bb5156db5df23755?pvs=4)

Go to [Notcoin Pre-Market](https://getgems.io/notcoin) ![:gem:](https://tonresear.ch/images/emoji/twitter/gem.png?v=12 ":gem:")

  2 Likes

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



## Topic: 9984

[TON Research](/)

# [Povel Durev/TON memecoin](/t/povel-durev-ton-memecoin/9984)

[The Open League](/c/the-open-league/token-leaderboard/57)  [Token Battle](/c/the-open-league/token-leaderboard/57) 

    

[PovelDurev](https://tonresear.ch/u/PovelDurev)  April 7, 2024, 9:52am  1

Token name: durev

Durev is a memecoin on the TON network!

Website: [https://durev.xyz/](https://durev.xyz/)

Povel Durev is the greatest entrepreneur of all time in the whole world, and maybe not only in this world. He is the director of Telegrams, a company that transmits messages by air using electricity. He is the president of TON, an Internet money company. His job is to make billions of TONS. Our job is to make billions of tons of memes.

He emerged victorious from the battles with the KGB, the SEC and the whole world alone. Now it’s our time to fight for him!

$durev is created for strong-minded and good people. By buying $durev, you contribute to the improvement of the world through the appearance of tons of memes!

Durev is live on DeDust. Liquidity lock and loaded. What’s next?

1.  We’ve adding boosts for liquidity providers now. Currently, the APY is very juicy – earn more $durev and bonus tokens from partners, helping the project. It’s a win-win.
    
2.  In about a week, another listing, we’re adding liquidity on StonFi, so $durev can be bought directly inside TonKeeper. We’re also expecting a whitelist for our token from Tonkeeper soon.
    
3.  We’re preparing a Durev NFT collection. For $durev holders, there will be huge bonuses. Already talking with new memecoins for drops to NFT holders. Bullish!
    
4.  We continue to do crazy marketing with KOLs, planning AMAs with top channels, signing even more partnerships, and beginning to select a CEX for listing.
    

Project’s Twitter: [https://x.com/poveldurev](https://x.com/poveldurev)

Project’s Telegram: [https://t.me/poveldurev](https://t.me/poveldurev)

Link to the token’s page on DYOR: [https://dyor.io/ru/token/EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0](https://dyor.io/ru/token/EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0)

Link to the token’s page on Coinmarketcap: n/a

Link to the token’s page on Coingecko: n/a

Contact: Ruslan

Telegram handle: @MrUpground

By submitting the form I confirm that the data I provided is correct and I fully understand that in case of the contrary, my project will be permanently eliminated from The Open League.

  33 Likes

[sisbki](https://tonresear.ch/u/sisbki) April 7, 2024, 10:02am  2

the best project among all the launched meme coins on ton!

  10 Likes

[user560](https://tonresear.ch/u/user560) April 7, 2024, 10:03am  3

Мем который всех превзойдёт!!!

  8 Likes

[Max\_Smurffy](https://tonresear.ch/u/Max_Smurffy) April 7, 2024, 10:04am  4

IN DUREV WE TRUST?  
IN DUREV WE TRUST!

durev.xyz  
tg: [@poveldurev](/u/poveldurev)

  8 Likes

[Gemfaer](https://tonresear.ch/u/Gemfaer) April 7, 2024, 10:07am  5

Очень сильное сообщество, отличный маркетинг! Такого ещё невидел

  3 Likes

[GaussGun](https://tonresear.ch/u/GaussGun) April 7, 2024, 10:07am  6

Teh best teken in teh werld!

  3 Likes

[Gcg\_Gbhh](https://tonresear.ch/u/Gcg_Gbhh) April 7, 2024, 10:07am  7

В космос только с Дуревым, запрыгивайте)

  5 Likes

[user574](https://tonresear.ch/u/user574) April 7, 2024, 10:08am  8

Ракета гарантирована!!! Лучший мемкойн!

  5 Likes

[user575](https://tonresear.ch/u/user575) April 7, 2024, 10:08am  9

Nice!!nice nice nice!!!LFG!!

  4 Likes

[apexof](https://tonresear.ch/u/apexof) April 7, 2024, 10:08am  10

To the moon! ![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")

  4 Likes

[Alone\_Lemone](https://tonresear.ch/u/Alone_Lemone) April 7, 2024, 10:08am  11

So great memecoin ! I hope rise to the moon!

  4 Likes

[Kaleka](https://tonresear.ch/u/Kaleka) April 7, 2024, 10:09am  12

Stay calm and buy DUREV

  3 Likes

[ZeFIR](https://tonresear.ch/u/ZeFIR) April 7, 2024, 10:09am  13

The project really looks very promising. Especially considering that the team actually relaunched the token, which shows the seriousness of its intentions to develop the project.

I saw from sources that they have a large marketing budget, considering that this is just the beginning, it looks promising

  4 Likes

[bogdartem](https://tonresear.ch/u/bogdartem) April 7, 2024, 10:09am  14

Интересненько) Глянем)

  3 Likes

[Kot\_Art](https://tonresear.ch/u/Kot_Art) April 7, 2024, 10:10am  15

I think that is minimum 50x. You can buy now

This community telegram [@poveldurev](/u/poveldurev)

  3 Likes

[Nijat](https://tonresear.ch/u/Nijat) April 7, 2024, 10:10am  16

It is interesting that it is the first serious mem coin on TON and in the first day it is already compatible with the top solana coins.

  2 Likes

[Dmitriy\_Khan](https://tonresear.ch/u/Dmitriy_Khan) April 7, 2024, 10:11am  17

Yes, ETO ZESKO. LOOK AT ME BABE AND LOOOOO

  3 Likes

[Edward\_Kamalov](https://tonresear.ch/u/Edward_Kamalov) April 7, 2024, 10:11am  18

Дорогие киты! Прошу поскорее занести ваши денежки в монетку, чтобы мои тысячи тонов подлетели до луны, и я стал миллионером. Затем, когда мы встретимся в дубках, я обязательно скажу вам за это спасибо и возможно даже угощу фиником:)

  2 Likes

[german1um](https://tonresear.ch/u/german1um) April 7, 2024, 10:11am  19

This looks very promising! I’m in since the start and looking for a big upside from here, it is still early to jump in imo

  2 Likes

[snaiperde](https://tonresear.ch/u/snaiperde) April 7, 2024, 10:12am  20

![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:")![:rocket:](https://tonresear.ch/images/emoji/twitter/rocket.png?v=12 ":rocket:") $durev best Memcoin on Ton!

  2 Likes

**[next page →](/t/povel-durev-ton-memecoin/9984?page=2)**

*   [Home](/)
*   [Categories](/categories)
*   [Guidelines](/guidelines)

Powered by [Discourse](https://www.discourse.org), best viewed with JavaScript enabled



