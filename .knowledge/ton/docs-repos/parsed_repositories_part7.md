# GitHub Docs Parser - Part 7

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

Используйте его для получения текущего кошелька пользователя Ton. Если кошелек не подключен, хук вернет null.

Посмотреть все свойства кошелька
// todo

<!-- [Интерфейс кошелька](https://ton-connect.github.io/sdk/interfaces/_tonconnect_sdk.Wallet.html) -->

<!-- [Интерфейс WalletInfo](https://ton-connect.github.io/sdk/types/_tonconnect_sdk.WalletInfo.html) -->

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

Используйте этот хук для доступа к функциям открытия и закрытия модального окна. Хук возвращает объект с текущим модальным состоянием и методами открытия и закрытия модального окна.

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

Используйте его для получения доступа к экземпляру `TonConnectUI` и функции обновления параметров пользовательского интерфейса.

[Подробнее о методах экземпляра TonConnectUI](https://github.com/ton-connect/sdk/tree/main/packages/ui#send-transaction)

[Подробнее о функции setOptions](https://github.com/ton-connect/sdk/tree/main/packages/ui#change-options-if-needed)

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

Указывает текущее состояние процесса восстановления соединения. Вы можете использовать его для обнаружения, когда процесс восстановления соединения завершен.

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

## Использование

Давайте рассмотрим, как использовать Vue UI SDK на практике.

### Отправка транзакций

Отправка монет TON (в nanotons) на определенный адрес:

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

### Понимание статуса транзакции по хэшу

Основная идея находится в обработке платежей (используется tonweb). [Подробнее](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)

### Добавьте параметры запроса подключения (ton_proof)

:::tip
Узнайте, как подписывать и проверять сообщения: [Подписание и проверка](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
:::

Используйте функцию `tonConnectUI.setConnectRequestParameters` для передачи параметров запроса на подключение.

Эта функция принимает один параметр:

Установите состояние на 'loading\\`, пока вы ждете ответа от вашего backend. Если пользователь открывает модальное окно для подключения кошелька в этот момент, он увидит загрузчик.

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const tonConnectUI = useTonConnectUI();

tonConnectUI.setConnectRequestParameters({
    state: 'loading'
});
```

или

Установите состояние на 'ready' и определите значение `tonProof`. Переданный параметр будет применен к запросу на подключение (QR и универсальная ссылка).

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

или

Удалите загрузчик, если он был включен через \\`state: 'loading' (например, вы получили ошибку вместо ответа от вашего backend). Запрос на подключение будет создан без дополнительных параметров.

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const tonConnectUI = useTonConnectUI();

tonConnectUI.setConnectRequestParameters(null);
```

Вы можете вызвать `tonConnectUI.setConnectRequestParameters` несколько раз, если ваш payload tonProof имеет ограниченное время жизни (например, вы можете обновлять параметры запроса на подключение каждые 10 минут).

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

Вы можете найти результат `ton_proof` в объекте `wallet`, когда кошелек будет подключен:

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

### Отключение кошелька

Вызов для отключения кошелька:

```js
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const [tonConnectUI] = useTonConnectUI();

await tonConnectUI.disconnect();
```

## Устранение неполадок

### Анимации не работают

Если у вас возникли проблемы с анимацией, которая не работает в вашем окружении, это может быть связано с отсутствием поддержки Web Animations API. Чтобы решить эту проблему, вы можете использовать полифил `web-animations-js`.

#### Использование npm

Чтобы установить полифилл, выполните следующую команду:

```shell
npm install web-animations-js
```

Затем импортируйте полифилл в свой проект:

```typescript
import 'web-animations-js';
```

#### Использование CDN

Кроме того, вы можете включить полифилл через CDN, добавив следующий тег script в свой HTML:

```html
<script src="https://www.unpkg.com/web-animations-js@latest/web-animations.min.js"></script>
```

Оба метода обеспечат обратную реализацию Web Animations API и должны решить проблемы с анимацией, с которыми вы сталкиваетесь.

## Примеры

- [Demo dApp](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui) - Пример DApp с `@townsquarelabs/ui-vue`.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/web.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/frameworks/web.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TON Connect для JS

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Это руководство поможет вам интегрировать TON Connect в ваше Javascript приложение для аутентификации пользователей и подтверждения транзакций.

Если вы используете React для своего DApp, взгляните на [TON Connect UI React SDK](/v3/guidelines/ton-connect/frameworks/react).

Если вы используете Vue для своего DApp, взгляните на [TON Connect UI Vue SDK](/v3/guidelines/ton-connect/frameworks/vue).

## Реализация

### Установка

<Tabs groupId="Installation">
  <TabItem value="CDN" label="CDN">
Добавьте скрипт в элемент HEAD вашего веб-сайта:
    <br/>
    <br/>

```html
<script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
```

</TabItem>
  <TabItem value="NPM" label="NPM">
    Чтобы начать интеграцию TON Connect в ваше приложение, установите пакет @tonconnect/ui:

```bash npm2yarn
npm i @tonconnect/ui
```

</TabItem>
</Tabs>

### Начало работы TON Connect

После установки пакета создайте файл `manifest.json` для вашего приложения. Более подробную информацию о том, как создать файл manifest.json, можно найти [здесь](/v3/guidelines/ton-connect/guidelines/creating-manifest).

Добавьте кнопку с идентификатором `ton-connect` для подключения к кошельку:

```html
<div id="ton-connect"></div>
```

_После этого тега_ добавьте скрипт для `tonConnectUI` в секцию `<body>` страницы вашего приложения:

```html
<script>
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
        buttonRootId: 'ton-connect'
    });
</script>
```

### Подключение к кошельку

Кнопка "Connect" (добавленная в `buttonRootId`) автоматически обрабатывает нажатия.

Но вы можете программно открыть "connect modal", например, после нажатия на пользовательскую кнопку:

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

### Перенаправления

#### Настройка стратегии возврата

Чтобы перенаправить пользователя на конкретный URL после подключения, вы можете [настроить стратегию возврата](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy).

#### Мини-приложения Telegram

Чтобы перенаправить пользователя в [Мини-приложение Telegram](/v3/guidelines/dapps/tma/overview) после подключения кошелька, используйте параметр `twaReturnUrl`:

```tsx
tonConnectUI.uiOptions = {
      twaReturnUrl: 'https://t.me/YOUR_APP_NAME'
  };
```

[Подробнее читайте в документации SDK](https://github.com/ton-connect/sdk/tree/main/packages/ui#use-inside-twa-telegram-web-app)

### Настройка пользовательского интерфейса

TonConnect UI предоставляет интерфейс, который должен быть знаком и узнаваем пользователю при использовании различных приложений. Однако разработчик приложения может изменить этот интерфейс, чтобы он соответствовал интерфейсу приложения.

- [Документация TonConnect UI](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)

## Документация SDK

- [Документация SDK](https://github.com/ton-connect/sdk/blob/main/packages/ui/README.md)
- [Последняя документация API](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

## Использование

Давайте рассмотрим пример использования TON Connect UI в приложении.

### Отправка сообщений

Вот пример отправки транзакции с использованием TON Connect UI:

```js
import TonConnectUI from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({ //connect application
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: '<YOUR_CONNECT_BUTTON_ANCHOR_ID>'
});

const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
  messages: [
        {
            address: "EQABa48hjKzg09hN_HjxOic7r8T1PleIy1dRd8NvZ3922MP0", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

- Подробнее о подготовке сообщений можно найти здесь: [Подготовка сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages).

### Понимание статуса транзакции по хэшу

Принцип описан в разделе Обработка платежей (с использованием tonweb). [Подробнее](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)

### Подпись и проверка

Узнайте, как подписывать и проверять сообщения с помощью TON Connect:

- [Подпись и проверка](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
- [Реализация пользовательского интерфейса TON Connect на GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-connect-request-parameters-ton_proof)

### Отключение кошелька

Вызов для отключения кошелька:

```js
await tonConnectUI.disconnect();
```

## См. также

- [Настройка пользовательского интерфейса](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)
- [[YouTube] TonConnect UI-React и авторизация через ton_proof](https://youtu.be/wIMbkJHv0Fs?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_&t=1747)
- [[YouTube] Разбираемся с TON Connect, подключаем авторизацию к сайту](https://www.youtube.com/watch?v=HUQ1DPfFxG4&list=PLyDBPwv9EPsAIWi8vgic9kiV3KF_wvIcz&index=4)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/creating-manifest.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/creating-manifest.md
================================================
# Создание manifest.json

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Каждому приложению нужен манифест для передачи метаданных в кошелек. Манифест — это файл JSON с именем `tonconnect-manifest.json` следующего формата:

```json
{
    "url": "<app-url>",                        // required
    "name": "<app-name>",                      // required
    "iconUrl": "<app-icon-url>",               // required
    "termsOfUseUrl": "<terms-of-use-url>",     // optional
    "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

## Пример

Ниже вы можете найти пример манифеста:

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```

## Рекомендации

- Лучшей практикой является разместить манифест в корне приложения и репозитория, например. `https://myapp.com/tonconnect-manifest.json`. Это позволяет кошельку лучше обрабатывать ваше приложение и улучшать пользовательский опыт, связанный с вашим приложением.
- Убедитесь, что файл `manifest.json` доступен через GET-запрос по его URL

## Описание полей

| Поле               | Требование    | Описание                                                                                                                                                                                                                                                                                                                           |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`              | обязательно   | URL приложения. Будет использоваться как идентификатор DApp. Будет использоваться для открытия DApp после нажатия на его значок в кошельке. Рекомендуется передавать URL без закрывающей косой черты, например, `https://mydapp.com` вместо `https://mydapp.com/`. |
| `name`             | обязательно   | Имя приложения. Может быть простым, не будет использоваться как идентификатор.                                                                                                                                                                                                                     |
| `iconUrl`          | обязательно   | URL значка приложения. Должен быть в формате PNG, ICO, .... Иконки SVG не поддерживаются. Идеально передавать URL иконку PNG размером 180x180 пикселей.                                                            |
| `termsOfUseUrl`    | необязательно | URL-адрес документа Условия использования. Необязательно для обычных приложений, но обязательно для приложений, которые размещены в списке рекомендованных приложений Tonkeeper.                                                                                                                   |
| `privacyPolicyUrl` | необязательно | URL-адрес документа Политика конфиденциальности. Необязательно для обычных приложений, но обязательно для приложений, которые размещены в списке рекомендованных приложений Tonkeeper.                                                                                                             |



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/developers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/developers.md
================================================
# TON Connect SDK

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Список SDK

:::info
Если возможно, рекомендуется использовать набор [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) для ваших dApps. Перейдите на более низкие уровни SDK или реализуйте свою версию протокола только в том случае, если это действительно необходимо для вашего продукта.
:::

Эта страница содержит список полезных библиотек для TON Connect.

- [TON Connect React](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-react)
- [TON Connect JS SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-js-sdk)
- [TON Connect Vue](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-vue)
- [TON Connect Python SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-python)
- [TON Connect Dart](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-dart)
- [TON Connect C#](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-c)
- [TON Connect Unity](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-unity)
- [TON Connect Go](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) - Пользовательский интерфейс (UI) TON Connect для React приложений

TonConnect UI React - это набор React UI для TonConnect SDK. Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect в приложениях React.

- Пример DApp с использованием `@tonconnect/ui-react`: [GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
- Пример развернутого `demo-dapp-with-react-ui`: [GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [Документация API](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)

## TON Connect JS SDK

Репозиторий TON Connect содержит следующие основные пакеты:

- [@tonconnect/ui](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-ui) - Пользовательский интерфейс (UI) TON Connect
- [@tonconnect/sdk](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-sdk) - TON Connect SDK
- [@tonconnect/protocol](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-protocol-models) - Спецификации протокола TON Connect

### TON Connect UI

TonConnect UI - это набор пользовательского интерфейса для TonConnect SDK. Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect. Он позволяет вам проще интегрировать TonConnect в ваше приложение с помощью наших элементов пользовательского интерфейса, таких как "кнопка подключения кошелька", "диалоговое окно выбора кошелька" и модальные окна подтверждения.

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [Документация API](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

Пользовательский интерфейс (UI) TON Connect является фреймворком, который позволяет разработчикам улучшить пользовательский опыт (UX) для пользователей приложений.

TON Connect можно легко интегрировать с приложениями с помощью простых элементов пользовательского интерфейса, таких как «кнопка подключения кошелька», «диалоговое окно выбора кошелька» и модальные окна подтверждения. Вот три основных примера того, как TON Connect улучшает UX в приложениях:

- Пример функциональности приложения в браузере DApp: [GitHub](https://ton-connect.github.io/demo-dapp/)
- Пример backend раздела DAppabove: [GitHub](https://github.com/ton-connect/demo-dapp-backend)
- Сервер Bridge с использованием Go: [GitHub](https://github.com/ton-connect/bridge)

Этот набор инструментов упрощает реализацию TonConnect в приложениях, созданных для блокчейна TON. Поддерживаются стандартные фреймворки frontend, а также приложения, не использующие предопределенные фреймворки.

### TON Connect SDK

Самым низкоуровневым из трех фреймворков, помогающих разработчикам интегрировать TON Connect в свои приложения, является TON Connect SDK. Он в основном используется для подключения приложений к кошелькам TON через протокол TON Connect.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### Модели протокола TON Connect

Этот пакет содержит запросы протокола, ответы протокола, модели событий и функции кодирования и декодирования. Его можно использовать для интеграции TON Connect с приложениями кошельков, написанными на TypeScript. Чтобы интегрировать TON Connect в DApp, следует использовать [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk).

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)

## TON Connect Vue

TonConnect UI Vue — это набор Vue UI для TonConnect SDK. Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect в приложениях Vue.

- Пример DApp с использованием `@townsquarelabs/ui-vue`: [GitHub](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui)
- Пример развернутого `demo-dapp-with-vue-ui`: [GitHub](https://townsquarexyz.github.io/demo-dapp-with-vue-ui/)

```bash
npm i @townsquarelabs/ui-vue
```

- [GitHub](https://github.com/TownSquareXYZ/tonconnect-ui-vue)
- [NPM](https://www.npmjs.com/package/@townsquarelabs/ui-vue)

## TON Connect Python

### pytonconnect

Python SDK для TON Connect 2.0. Аналог библиотеки `@tonconnect/sdk`.

Используйте его для подключения вашего приложения к кошелькам TON по протоколу TonConnect.

```bash
pip3 install pytonconnect
```

- [GitHub](https://github.com/XaBbl4/pytonconnect)

### ClickoTON-Foundation tonconnect

Библиотека для подключения TON Connect к приложениям Python

```bash
git clone https://github.com/ClickoTON-Foundation/tonconnect.git
pip install -e tonconnect
```

[GitHub](https://github.com/ClickoTON-Foundation/tonconnect)

## TON Connect Dart

Dart SDK для TON Connect 2.0. Аналог библиотеки `@tonconnect/sdk`.

Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect.

```bash
 $ dart pub add darttonconnect
```

- [GitHub](https://github.com/romanovichim/dartTonconnect)

## TON Connect C\\#

C# SDK для TON Connect 2.0. Аналог библиотеки `@tonconnect/sdk`.

Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect.

```bash
 $ dotnet add package TonSdk.Connect
```

- [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)

## TON Connect Go

Go SDK для TON Connect 2.0.

Используйте его для подключения вашего приложения к кошелькам TON через протокол TonConnect.

```bash
 go get github.com/cameo-engineering/tonconnect
```

- [GitHub](https://github.com/cameo-engineering/tonconnect)

## Общие вопросы и проблемы

Если у кого-либо из наших разработчиков или членов сообщества возникнут дополнительные проблемы во время внедрения TON Connect 2.0, свяжитесь с [каналом разработчиков Tonkeeper](https://t.me/tonkeeperdev).

Если у вас возникли дополнительные проблемы или вы хотите представить предложение по улучшению TON Connect 2.0, свяжитесь с нами напрямую через соответствующий [репозиторий GitHub](https://github.com/ton-connect/).

## TON Connect Unity

Ресурс Unity для TON Connect 2.0. Использует `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`.

Используйте его для интеграции протокола TonConnect с вашей игрой.

- [GitHub](https://github.com/continuation-team/unity-ton-connect)
- [Документация](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)

## См. также

- [Пошаговое руководство по созданию вашего первого веб-клиента](https://helloworld.tonstudio.io/03-client/)
- [[YouTube] TON Smart Contracts | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU\\&t=254s\\&ab_channel=AlefmanVladimir%5BEN%5D)
- [Начало работы Ton Connect](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [Руководство по интеграции](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)
- [[YouTube] TON Dev Study TON Connect Protocol [RU]] (https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/how-ton-connect-works.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/how-ton-connect-works.mdx
================================================
import Button from '@site/src/components/button'
import ThemedImage from '@theme/ThemedImage';

# Как работает TON Connect

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Connect — это протокол связи между **кошельками** и **приложениями** в TON.

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/ton-connect/ton-connect_1.svg?raw=true',
        dark: '/img/docs/ton-connect/ton-connect_1-dark.svg?raw=true',
    }}
/>
<br></br>

## Общий вид

**Приложения**, созданные на основе TON, предлагают богатую функциональность, высокую производительность и предназначены для защиты средств пользователей с помощью смарт-контрактов. Поскольку эти приложения используют децентрализованные технологии, такие как блокчейн, их обычно называют децентрализованными приложениями (dApps).

**Кошельки** предлагают пользовательский интерфейс для подтверждения транзакций и надежно хранят криптографические ключи пользователей на их персональных устройствах. Такое разделение ответственности обеспечивает быстрые инновации и высокий уровень безопасности: кошелькам не нужно создавать закрытые экосистемы, а приложениям не нужно нести риски хранения учетных записей пользователей.

TON Connect разработан для обеспечения бесперебойного взаимодействия пользователя с кошельками и приложениями.

## См. также

- [TON Connect для бизнеса](/v3/guidelines/ton-connect/business/ton-connect-for-business)
- [Безопасность TON Connect](/v3/guidelines/ton-connect/business/ton-connect-for-security)
- [TON Connect 2.0 vs 1.0](/v3/guidelines/ton-connect/business/ton-connect-comparison)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk.md
================================================
# Руководство по интеграции с JavaScript SDK

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом руководстве мы создадим пример веб-приложения, поддерживающего аутентификацию TON Connect 2.0. Это позволит выполнить проверку подписи, чтобы исключить возможность мошеннической выдачи себя за другое лицо без необходимости заключения соглашения между сторонами.

## Ссылки на документацию

1. [Документация @tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk)
2. [Протокол обмена сообщениями между кошельком и приложением](https://github.com/ton-connect/docs/blob/main/requests-responses.md)
3. [Реализация Tonkeeper на стороне кошелька](https://github.com/tonkeeper/wallet/tree/main/packages/mobile/src/tonconnect)

## Необходимые компоненты

Для обеспечения бесперебойной связи между приложениями и кошельками веб-приложение должно использовать манифест, доступный через приложения кошелька. Основным требованием к этому является обычный хост для статических файлов. Например, если разработчик хочет использовать GitHub pages или развернуть свой веб-сайт с помощью TON Sites, размещенных на его компьютере. Это означает, что веб-приложение должно быть общедоступно.

## Получение списка поддерживаемых кошельков

Чтобы увеличить общее использование блокчейна TON, необходимо, чтобы TON Connect 2.0 мог облегчать огромное количество интеграций приложений и кошельков. В последнее время и это имеет важное значение, продолжающаяся разработка TON Connect 2.0 позволила подключить Tonkeeper, TonHub, MyTonWallet и другие кошельки к различным приложениям экосистемы TON. Наша миссия — в конечном итоге разрешить обмен данными между приложениями и всеми типами кошельков, созданными на основе TON, через протокол TON Connect. В настоящее время это достигается путем включения TON Connect для загрузки обширного списка доступных кошельков, которые сейчас функционируют в экосистеме TON.

На данный момент наш пример веб-приложения позволяет следующее:

1. загружает TON Connect SDK (библиотеку, предназначенную для упрощения интеграции),
2. создает коннектор (в настоящее время без манифеста приложения),
3. загружает список поддерживаемых кошельков (из [wallets.json на GitHub](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json)).

Для изучения давайте рассмотрим HTML-страницу, описанную следующим кодом:

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

Если вы загрузите эту страницу в браузере и проверите консоль, вы можете увидеть что-то вроде этого:

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

Согласно спецификациям TON Connect 2.0, информация о приложении кошелька всегда использует следующий формат:

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

## Отображение кнопок для различных приложений кошелька

Кнопки могут различаться в зависимости от дизайна вашего веб-приложения. Текущая страница выдает следующий результат:

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

Обратите внимание на следующее:

1. Если веб-страница отображается через приложение кошелька, она устанавливает свойство параметра `embedded` в значение true. Это означает, что важно подчеркнуть этот вариант входа, поскольку он наиболее распространен.
2. Если конкретный кошелек создан с использованием только JavaScript (у него нет `bridgeUrl`) и он не установил свойство `injected` (или `embedded`, для безопасности), то он явно недоступен, и кнопку следует отключить.

## Соединение без манифеста приложения

В случае соединения без манифеста приложения, скрипт должен быть изменен следующим образом:

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

Теперь, когда описанный выше процесс выполнен, регистрируются изменения статуса (чтобы увидеть, работает ли TON Connect). Отображение модальных окон с QR-кодами для подключения выходит за рамки данного руководства. Для тестирования можно использовать расширение браузера или отправить ссылку на запрос подключения пользователю любым доступным способом (например, с помощью Telegram).
Примечание: мы пока не создали манифест приложения. В данный момент самым подходящим решением является анализ конечного результата в случае невыполнения этого требования.

### Вход с помощью Tonkeeper

Чтобы войти в Tonkeeper, создается следующая ссылка для аутентификации (см. ниже для справки):

```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```

После декодирования параметра `r` формируется следующий формат JSON:

```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

При нажатии на мобильную телефонную ссылку, Tonkeeper автоматически открывается и затем закрывается, отклоняя запрос. Кроме того, в консоли веб-приложения появляется следующая ошибка:
`Error: [TON_CONNECT_SDK_ERROR] Can't get null/tonconnect-manifest.json`.

Это указывает на то, что манифест приложения должен быть доступен для загрузки.

## Соединение с использованием манифеста приложения

Начиная с этого момента, необходимо где-то размещать пользовательские файлы (в основном tonconnect-manifest.json). В этом случае мы будем использовать манифест из другого веб-приложения. Однако это не рекомендуется для производственных сред, но разрешено для тестирования.

Следующий фрагмент кода:

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

Должен быть заменен на эту версию:

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

В новой версии выше в `window` была добавлена ​​переменная хранения `connector`, чтобы она была доступна в консоли браузера. Также был добавлен метод `restoreConnection`, чтобы пользователям не приходилось входить в систему на каждой странице веб-приложения.

### Вход с помощью Tonkeeper

Если мы отклоним наш запрос из кошелька, то в консоли появится результат `Error: [TON_CONNECT_SDK_ERROR] Wallet denied the request`.

Таким образом, пользователь может принять тот же запрос на вход, если ссылка сохранена. Это означает, что веб-приложение должно иметь возможность обрабатывать отказ в аутентификации как не окончательный, чтобы работать корректно.

После этого запрос на вход принимается и немедленно отражается в консоли браузера следующим образом:

```bash
22:40:13.887 Connection status:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

В приведенных выше результатах учитывается следующее:

1. **Account**: информация: содержит адрес (workchain+hash), сеть (mainnet/testnet) и wallet stateInit, который используется для извлечения открытого ключа.
2. **Device**: информация: содержит имя и версию приложения кошелька (имя должно совпадать с запрошенным изначально, но его можно проверить, чтобы убедиться в подлинности), а также имя платформы и список поддерживаемых функций.
3. **Provider**: содержит http -- что позволяет обрабатывать все запросы и ответы между кошельком и веб-приложениями через мост.

## Выход и запрос TonProof

Теперь мы вошли в наше мини-приложение, но... как backend узнает, что это правильная сторона? Чтобы проверить это, мы должны запросить доказательство владения кошельком.

Это можно сделать только с помощью аутентификации, поэтому мы должны выйти из системы. Поэтому мы запускаем следующий код в консоли:

```js
connector.disconnect();
```

После завершения процесса отключения будет отображаться `Connection status: null`.

Перед добавлением TonProof давайте изменим код, чтобы показать, что текущая реализация небезопасна:

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

Результаты строк кода в консоли почти идентичны тем, которые отображались при изначальном установлении соединения. Поэтому, если backend не выполняет аутентификацию пользователя правильно, как ожидалось, требуется способ проверки его корректной работы. Для этого можно действовать как TON Foundation в консоли, поэтому можно проверить легитимность балансов токенов и параметров владения токенами. Естественно, предоставленный код не изменяет никаких переменных в connector, но пользователь может использовать приложение по своему усмотрению, если только этот connector не защищен замыканием. Даже если это так, его несложно извлечь с помощью отладчика и точек останова кодирования.

Теперь, когда аутентификация пользователя была проверена, давайте перейдём к написанию кода.

## Подключение с использованием TonProof

Согласно документации SDK TON Connect, второй аргумент относится к методу `connect()`, который содержит payload, который будет обернут и подписан кошельком. Таким образом, результатом является новый код подключения:

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

Ссылка подключения:

```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```

Расширенный и упрощённый параметр `r`:

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

Далее ссылка Url-адреса отправляется на мобильное устройство и открывается с помощью Tonkeeper.

После завершения этого процесса получается следующая информация, специфичная для кошелька:

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

Давайте проверим полученную подпись. Для этого проверка подписи использует Python, поскольку он может легко взаимодействовать с backend. Библиотеки, необходимые для выполнения этого процесса, — это `pytoniq` и `pynacl`.

Далее необходимо получить открытый ключ кошелька. Для этого не используются `tonapi.io` или аналогичные сервисы, поскольку конечный результат не может быть надежно проверен. Вместо этого, это достигается путем анализа `walletStateInit`.

Кроме того, важно убедиться, что `address` и `walletStateInit` совпадают, иначе payload может быть подписан с помощью ключа кошелька, указав собственный кошелек в поле `stateInit` и другой кошелек в поле `address`.

`StateInit` состоит из двух типов ссылок: один для кода и один для данных. В этом контексте цель — извлечь открытый ключ, чтобы загрузить вторую ссылку (ссылку на данные). Затем пропускаются 8 байтов (4 байта используются для поля `seqno` и 4 для `subwallet_id` во всех современных контрактах кошельков), и загружаются следующие 32 байта (256 бит) — открытый ключ.

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

После реализации приведенного выше кода последовательности сверяемся с правильной документацией, чтобы проверить, какие параметры проверяются и подписываются с помощью ключа кошелька:

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

> При этом:
>
> - `Address` обозначает адрес кошелька, закодированный как последовательность:
>   - `workchain`: 32-битное целое число со знаком big endian;
>   - `hash`: 256-битное целое число без знака big endian;
> - `AppDomain` - это Length ++ EncodedDomainName
>   - `Length` использует 32-битное значение длины доменного имени приложения в кодировке utf-8 в байтах
>   - `EncodedDomainName` id `Length` байт доменное имя приложения в кодировке utf-8
> - `Timestamp` обозначает 64-битное время эпохи unix операции подписи
> - `Payload` обозначает двоичную строку переменной длины
> - `utf8_encode` создает простую байтовую строку без префиксов длины.

Давайте перепишем это на Python. Порядок байтов некоторых целых чисел выше не указан, поэтому необходимо рассмотреть несколько примеров. Пожалуйста, обратитесь к следующей реализации Tonkeeper, в которой подробно описаны некоторые связанные примеры: [ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42).

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

После реализации вышеуказанных параметров, если злоумышленник попытается выдать себя за пользователя и не предоставит действительную подпись, будет отображена следующая ошибка:

```bash
nacl.exceptions.BadSignatureError: Signature was forged or corrupt.
```

## Следующие шаги

При написании dApp также следует учитывать следующее:

- после успешного завершения соединения (восстановленного или нового подключения) должна отображаться кнопка `Disconnect` вместо нескольких кнопок `Connect`
- после того как пользователь отключается, нужно пересоздавать кнопки `Disconnect`
- данный код кошелька должен быть проверен, так как
  - более новые версии кошелька могут размещать открытые ключи в другом месте и создавать проблемы
  - текущий пользователь может войти, используя другой тип контракта вместо кошелька. Благодаря этому это будет содержать публичный ключ в ожидаемом месте

Удачи и получайте удовольствие от написания dApps!



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/preparing-messages.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/preparing-messages.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Подготовка сообщений

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

При использовании TON Connect вам следует создать тело сообщения для полезной нагрузки, используемой в различных транзакциях. На этой странице вы найдете наиболее подходящие примеры полезной нагрузки для использования с TON Connect SDK.

:::info
Ожидается, что вы изучите основы создания соединения TON Connect. Узнайте больше в [руководстве по интеграции](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk).
:::

## Ячейки и сериализация сообщений

Прежде чем погрузиться в создание сообщений, давайте познакомимся с концепцией ячеек, из которых состоят тела сообщений.

### Что такое ячейка?

Ячейка — это базовая структура данных в блокчейне TON. Она может хранить до `1023` бит и содержать до `4` ссылок на другие ячейки, что позволяет хранить более сложные структуры данных. Такие библиотеки, как `@ton/core` и `@ton-community/assets-sdk`, предоставляют эффективные способы обработки ячеек.

Подробнее о ячейках можно прочитать [здесь](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage).

### Создание ячейки

Чтобы создать ячейку, используйте функцию `beginCell()`. Пока ячейка "открыта", вы можете хранить различные типы данных с помощью функций `store...()`. Когда работа закончена, закройте ячейку с помощью функции `endCell()`.

```ts
import { Address, beginCell } from "@ton/ton";

const cell = beginCell()
  .storeUint(99, 64) // Stores uint 99 in 64 bits
  .storeAddress(Address.parse('[SOME_ADDR]')) // Stores an address
  .storeCoins(123) // Stores 123 as coins
  .endCell() // Closes the cell
```

### Анализ ячейки

Чтобы прочитать или проанализировать данные из ячейки, вызывается функция `beginParse()`. Вы считываете данные в том же порядке, в котором они были сохранены, используя аналогичные функции `load...()`:

```ts
const slice = cell.beginParse();
const uint = slice.loadUint(64);
const address = slice.loadAddress();
const coins = slice.loadCoins();
```

### Большие объемы данных

Каждая ячейка имеет ограничение в 1023 бита. Если вы превысите его, возникнет ошибка:

```ts
// This will fail due to overflow
const cell = beginCell()
  .storeUint(1, 256)
  .storeUint(2, 256)
  .storeUint(3, 256)
  .storeUint(4, 256) // Exceeds 1023-bit limit (256 + 256 + 256 + 256 = 1024)
  .endCell()
```

Чтобы сохранить больше данных, ячейки могут ссылаться на другие ячейки. Вы можете использовать функцию storeRef() для создания вложенных ячеек:

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

Чтобы загрузить ячейку, на которую есть ссылка (вложенную), используйте loadRef():

```ts
const slice = cell.beginParse();
const uint1 = slice.loadUint(256);
const uint2 = slice.loadUint(256);
const innerSlice = slice.loadRef().beginParse(); // Load and parse nested cell
const uint3 = innerSlice.loadUint(256);
const uint4 = innerSlice.loadUint(256);
```

### Необязательные ссылки и значения

Ячейки могут хранить необязательные значения (которые могут быть нулевыми). Они сохраняются с помощью функций `storeMaybe...()`:

```ts
const cell = beginCell()
  .storeMaybeInt(null, 64) // Optionally stores an int
  .storeMaybeInt(1, 64)
  .storeMaybeRef(null) // Optionally stores a reference
  .storeMaybeRef(beginCell()
    .storeCoins(123)
    .endCell());
```

Вы можете анализировать необязательные значения с помощью соответствующих функций loadMaybe...(). Возвращаемые значения могут быть нулевыми, поэтому не забудьте проверить их на нулевое значение!

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

### Использование assets sdk для упрощения сериализации и десериализации

Ручная обработка ячеек может быть утомительной, поэтому `@ton-community/assets-sdk` предоставляет удобные методы сериализации и десериализации сообщений.

Использование `@ton-community/assets-sdk` более читабельно и менее подвержено ошибкам.

<Tabs groupId="Сериализация/Десериализация">

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

## Примеры TON Connect JS SDK

### Шаблон транзакции

Независимо от того, какой уровень задачи решает разработчик, обычно необходимо использовать сущность коннектора из `@tonconnect/sdk` или `@tonconnect/ui`. Примеры, созданные на основе `@tonconnect/sdk` и `@tonconnect/ui`:

<Tabs groupId="Шаблон TON Connect">

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

### Обычный перевод TON

TON Connect SDK включают оболочки для отправки сообщений, что упрощает подготовку обычных переводов Toncoins между двумя кошельками в качестве транзакции по умолчанию без полезной нагрузки.

Обычный перевод TON с использованием TON Connect JS SDK может быть выполнен следующим образом:

<Tabs groupId="Обычный перевод">
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
Узнайте больше об [адресах смарт-контрактов TON](/v3/documentation/smart-contracts/addresses).
:::

Для конкретной пользовательской транзакции необходимо определить определенную полезную нагрузку.

### Передача с комментарием

Самый простой пример включает добавление полезной нагрузки с комментарием. Подробнее см. [этой странице](/v3/documentation/smart-contracts/message-management/internal-messages#simple-message-with-comment).
Перед транзакцией необходимо подготовить ячейку `body` [cell](/v3/documentation/data-formats/tlb/cell-boc) с помощью библиотеки JavaScript [@ton/ton](https://github.com/ton-org/ton).

```js
import { beginCell } from '@ton/ton'

const body = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
```

Тело транзакции создается следующим образом:

<Tabs groupId="Передача с комментарием">

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

### Отправка жетонов

`body` для отправки жетона основано на стандарте ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)). Обратите внимание, что количество знаков после запятой может различаться в зависимости от токена: например, USDT использует 6 знаков после запятой (1 USDT = 1 \* 10 \*\* 6), а TON использует 9 знаков после запятой (1 TON = 1 \* 10 \*\* 9).

:::info
Вы можете использовать библиотеку `assets-sdk` с методами из коробки (даже с `ton-connect`)
:::

<Tabs groupId="Отправка жетонов">
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

Далее выполняется отправка транзакции с этим телом в jettonWalletContract отправителя:

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

- `validUntil` - UNIX-время до сообщения valid
- `jettonWalletAddress` - Адрес JettonWallet, который определен на основе контрактов JettonMaser и Wallet
- `balance` - Целое число, количество Toncoin для оплаты газа в nanotons.
- `body` - полезная нагрузка для jettonContract

<details>
    <summary>Пример инициализации и подготовки адреса состояния кошелька жетона</summary>

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
Примечание: Для браузера вам необходимо установить полифилл для `Buffer`.
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

Или вы можете использовать контракт жетона со встроенными методами:

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

### Отправка жетона с комментарием

<Tabs groupId="Отправка жетона с комментарием">
<TabItem value="@ton/ton" label="@ton/ton">

`messageBody` для отправки жетона ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)) с комментарием. Мы должны дополнительно к обычному `body` перевода сериализовать комментарий и упаковать его в `forwardPayload`. Обратите внимание, что количество десятичных знаков может различаться в разных токенах: например, USDT использует 6 десятичных знаков (1 USDT = 1 \* 10 \*\* 6), а TON использует 9 десятичных знаков (1 TON = 1 \* 10 \*\* 9).

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

Далее выполняется отправка транзакции с этим телом в jettonWalletContract отправителя:

<Tabs groupId="Отправка жетонов">
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

- `validUntil` - UNIX-время до получения сообщения valid
- `jettonWalletAddress` - Адрес JettonWallet, определенный на основе контрактов JettonMaser и кошелька
- `balance` - целое число, сумма в тоннах монет для оплаты газа в nanotons.
- `body` - полезная нагрузка для jettonContract

<details>
  <summary>Пример инициализации и подготовки адреса Jetton Wallet</summary>

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
Примечание: для браузера необходимо установить полифил для `Buffer`.
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

### Сжигание жетонов

<Tabs groupId="Сжигание жетонов">
<TabItem value="@ton/ton" label="@ton/ton">

`body` для сжигатие жетона основано на стандарте ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)). Обратите внимание, что количество знаков после запятой может различаться в зависимости от токена: например, USDT использует 6 знаков после запятой (1 USDT = 1 \* 10 \*\* 6), а TON использует 9 знаков после запятой (1 TON = 1 \* 10 \*\* 9).

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

Сообщение помещается в следующий запрос:

<Tabs groupId="Сжигание жетонов">
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

- `jettonWalletAddress` - адрес контракта etton Wallet, который определяется на основе контрактов JettonMaser и Wallet
- `amount` - целое число, количество Toncoin для оплаты газа в nanotons.
- `body` - полезная нагрузка для кошелька jetton с кодом операции `burn#595f07bc`

</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
Примечание: для браузера необходимо установить полифил для `Buffer`.
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

Или вы можете использовать контракт жетона со встроенными методами:

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

### Передача NFT

<Tabs groupId="NFT Transfer">
<TabItem value="@ton/ton" label="@ton/ton">
Сообщение `body` должно быть выполнено следующим образом:

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

`WALLET_DST` - Address - Адрес первоначального владельца NFT для получения избыточного перевода `NFTitem `новому владельцу `NEW_OWNER_WALLET`.

<Tabs groupId="Передача NFT">
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

- `NFTitem` - Address - Адрес смарт-контракта элемента NFT, который мы хотим передать новому владельцу `NEW_OWNER_WALLET`.
- `balance` - Целое число, количество Toncoin для оплаты газа в nanotons.
- `body` - полезная нагрузка для контракта NFT

</TabItem>

<TabItem value="assets/sdk" label="assets/sdk">

:::tip
Примечание: для браузера необходимо установить полифил для `Buffer`.
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

Или вы можете использовать контракт жетона со встроенными методами:

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

### Продажа NFT (GetGems)

Вот пример подготовки сообщения и транзакции для продажи на торговой площадке GetGems, согласно контракту [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc).

Чтобы разместить NFT в контракте продажи GetGems, мы должны подготовить специальное тело сообщения `transferNftBody`, которое будет передавать NFT в специальный контракт продажи NFT.

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

Поскольку сообщение требует много шагов, весь алгоритм огромен и его можно найти здесь:

<details> 
<summary>Показать весь алгоритм для создания тела сообщения о продаже NFT</summary>

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

Подготовленный `transferNftBody` должен быть отправлен в контракт NFT Item с не менее чем 1,08 TON, для успешной обработки. Излишки будут возвращены в кошелек отправителя.

<Tabs groupId="Проджажа NFT по фиксированной цене">
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

### Покупка NFT (GetGems)

<Tabs groupId="NFT Buy tabs">
<TabItem value="@ton/ton" label="@ton/ton">

Процесс покупки NFT для контракта продажи [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) может быть выполнен с помощью обычного перевода без полезной нагрузки, единственное, что важно — это точная сумма TON, которая рассчитывается следующим образом: `buyAmount = Nftprice TON + 1.0 TON`.

<Tabs groupId="Покупка NFT">
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
Примечание: для браузера необходимо установить полифил для `Buffer`.
:::

```js
const nft = sdk.openNftSale(Address.parse("NFT_ADDRESS"));
nft.sendBuy(sdk.sender!, { queryId: BigInt(1) })
```

</TabItem>
</Tabs>

## TON Connect Python SDK

В качестве примеров на Python можно использовать [PyTonConnect](https://github.com/XaBbl4/pytonconnect) и [pytoniq](https://github.com/yungwine/pytoniq).

```python
    from pytoniq_core import Address
    from pytonconnect import TonConnect
```

:::tip
Прочитать примеры [исходного кода](https://github.com/yungwine/ton-connect-examples/blob/master/main.py).
:::

### Обычный перевод TON

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

### Перевод с комментарием

В первую очередь реализуйте сообщение с комментарием с помощью следующей функции:

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

Конечное тело транзакции для перевода с комментарием:

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
Узнайте больше об [адресах смарт-контрактов TON](/v3/documentation/smart-contracts/addresses).
:::

### Перевод жетонов

Пример функции для построения транзакции перевода жетонов. Обратите внимание, что количество знаков после запятой может различаться в разных токенах: например, USDT использует 6 знаков после запятой (1 USDT = 1 \* 10 \*\* 6), а TON использует 9 знаков после запятой (1 TON = 1 \* 10 \*\* 9).

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

Окончательное тело транзакции:

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

### Сжигание жетонов

Пример функции для построения транзакции сжигания жетонов. Обратите внимание, что количество знаков после запятой может различаться в разных токенах: например, USDT использует 6 знаков после запятой (1 USDT = 1 \* 10 \*\* 6), а TON использует 9 знаков после запятой (1 TON = 1 \* 10 \*\* 9).

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

Окончательное тело транзакции:

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

### Передача NFT

Пример функции для транзакции перевода NFT:

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

Окончательное тело транзакции:

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

### Продажа NFT (GetGems)

Вот пример подготовки сообщения и транзакции для продажи на торговой площадке GetGems в соответствии с контрактом [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc).

Чтобы разместить NFT на контракте продажи GetGems, мы должны подготовить специальное тело сообщения `transferNftBody`, которое будет переводить NFT на специальный контракт продажи NFT.

<details> 
<summary>Пример создания тела продажи NFT</summary>

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

Окончательное тело транзакции:

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

### Покупка NFT (GetGems)

Процесс покупки NFT для контракта продажи [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) может быть выполнен с помощью обычного перевода без полезной нагрузки, важна только точная сумма TON, которая рассчитывается следующим образом: `buyAmount = Nftprice TON + 1.0 TON`.

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

Примеры Go используют [tonconnect](https://github.com/cameo-engineering/tonconnect) и [tonutils-go](https://github.com/xssnick/tonutils-go).

```go
import "github.com/cameo-engineering/tonconnect"
import "github.com/xssnick/tonutils-go/address"
```

:::tip
Прочитайте примеры [tonconnect](https://github.com/cameo-engineering/tonconnect/blob/master/examples/basic/main.go) и [tonutils-go](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#how-to-use).
:::

Там вы можете узнать, как создать сеанс tonconnect и отправить транзакцию, созданную с помощью сообщений.

```go
s, _ := tonconnect.NewSession()
// create ton links
// ...
// create new message msg and transaction
boc, _ := s.SendTransaction(ctx, *tx)
```

В дальнейших примерах будут созданы только сообщения и транзакции.

### Обычный перевод TON

Пример функции для создания обычного сообщения о переводе TON:

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

Окончательное тело транзакции:

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

### Перевод с комментарием

Пример функции для создания сообщения о переводе с комментарием:

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

Окончательное тело транзакции:

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

### Перевод жетонов

Пример функции для сообщения о переводе жетонов. Обратите внимание, что количество знаков после запятой может различаться в зависимости от токена: например, USDT использует 6 знаков после запятой (1 USDT = 1 \* 10 \*\* 6), а TON использует 9 знаков после запятой (1 TON = 1 \* 10 \*\* 9).

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

Окончательное тело транзакции:

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

### Сжигание жетонов

Пример функции для сообщения о сжигани жетона. Обратите внимание, что количество знаков после запятой может различаться в зависимости от токена: например, USDT использует 6 знаков после запятой (1 USDT = 1 \* 10 \*\* 6), а TON использует 9 знаков после запятой (1 TON = 1 \* 10 \*\* 9).

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

Окончательное тело транзакции:

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

### Передача NFT

Пример функции для сообщения о передаче NFT:

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

Окончательное тело транзакции:

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

### Продажа NFT (GetGems)

Вот пример подготовки сообщения и транзакции для продажи на торговой площадке GetGems в соответствии с контрактом [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc).

Чтобы разместить NFT на контракте продажи GetGems, мы должны подготовить специальное тело сообщения `transferNftBody`, которое будет переводить NFT на специальный контракт продажи NFT.

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

Поскольку сообщение требует много шагов, весь алгоритм огромен и его можно найти здесь:

<details> 
<summary>Показать весь алгоритм для создания тела сообщения о продаже NFT</summary>

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

Окончательное тело транзакции:

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

### Покупка NFT (GetGems)

Процесс покупки NFT для контракта продажи [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) может быть выполнен с помощью обычного перевода без полезной нагрузки, важна только точная сумма TON, которая рассчитывается следующим образом: `buyAmount = Nftprice TON + 1.0 TON`.

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

## Авторы

- Примеры JavaScript, предоставленные [@aSpite](https://t.me/aspite)
- Примеры на Python предоставлены [@yunwine](https://t.me/yungwine)
- Примеры Go предоставлены [@gleb498](https://t.me/gleb498)

## См. также

- [TON Connect SDK](/v3/guidelines/ton-connect/guidelines/developers)
- [TON Connect - Отправка сообщений](/v3/guidelines/ton-connect/guidelines/sending-messages)
- [Разработка смарт-контрактов — отправка сообщений (низкий уровень)](/v3/documentation/smart-contracts/message-management/sending-messages)
- [Обработка жетонов TON](/v3/guidelines/dapps/asset-processing/jettons)
- [Обработка NFT на TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/sending-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/sending-messages.md
================================================
# Отправка сообщений

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Connect 2.0 предоставляет гораздо больше возможностей, чем просто аутентификация пользователей в DApp: вы можете отправлять исходящие сообщения через подключенные кошельки!

Вы узнаете:

- как отправлять сообщения из DApp в блокчейн
- как отправить несколько сообщений в одной транзакции
- как развернуть контракт с помощью TON Connect

## Страница для экспериментов

Мы будем использовать низкоуровневый [TON Connect SDK](https://github.com/ton-connect/sdk/tree/main/packages/sdk) на JavaScript. Мы поэкспериментируем в консоли браузера на странице, где кошелек уже подключен. Вот пример страницы:

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

Не стесняйтесь скопировать и вставить этот код в консоль вашего браузера и выполнить его.

## Отправка нескольких сообщений

### 1. Понимание задачи

Мы отправим два отдельных сообщения в одной транзакции: одно на ваш собственный адрес с 0,2 TON и одно на другой адрес кошелька с 0,1 TON.

Обратите внимание, что есть ограничение по количеству сообщений, которые можно отправить в одной транзакции:

- стандартные ([v3](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v3)/[v4](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4)) кошельки: 4 исходящих сообщения;
- highload кошельки: 255 исходящих сообщений (близко к ограничениям блокчейна).

### 2. Отправка сообщений

Запустите следующий код:

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

Вы заметите, что эта команда ничего не выводит в консоль, `null` или `undefined`, так как функции, которые ничего не возвращают, не выходят. Это означает, что `connector.sendTransaction` не завершается немедленно.

Откройте приложение кошелька, и посмотрите, почему. Там будет запрос, показывающий, что вы отправляете и куда будут отправлены монеты. Пожалуйста, одобрите его.

### 3. Получение результата

Функция завершит работу, и будет выведен результат из блокчейна:

```json
{
  boc: "te6cckEBAwEA4QAC44gBZUPZ6qi8Dtmm1cot1P175lXUARlUVwlfMM19lkERK1oCUB3RqDxAFnPpeo191X/jiimn9Bwnq3zwcU/MMjHRNN5sC5tyymBV3SJ1rjyyscAjrDDFAIV/iE+WBySEPP9wCU1NGLsfcvVgAAACSAAYHAECAGhCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWoAmJaAAAAAAAAAAAAAAAAAAAAGZCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWnMS0AAAAAAAAAAAAAAAAAAADkk4U"
}
```

BOC - это [Bag of Cells](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), способ хранения данных в TON. Теперь мы можем его расшифровать.

Расшифруйте этот BOC в инструменте по вашему выбору, и вы получите следующее дерево ячеек:

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D9641112B5A02501DD1A83C401673E97A8D7DD57FE38A29A7F41C27AB7CF0714FCC3231D134DE6C0B9B72CA6055DD2275AE3CB2B1C023AC30C500857F884F960724843CFF70094D4D18BB1F72F5600000024800181C_}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD6A00989680000000000000000000000000000}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD69CC4B40000000000000000000000000000}
```

Это сериализованное внешнее сообщение, а две ссылки — это представления исходящих сообщений.

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

Цель возврата BOC отправленной транзакции — отследить ее.

## Отправка сложных транзакций

### Сериализация ячеек

Прежде чем продолжить, давайте поговорим о формате сообщений, которые мы собираемся отправлять.

- **payload** (строка base64, необязательно): необработанный BoC из одной ячейки, закодированный в Base64.
 - мы будем использовать его для хранения текстового комментария при передаче
- **stateInit** (строка base64, необязательно): необработанный BoC из одной ячейки, закодированный в Base64.
 - мы будем использовать его для развертывания смарт-контракта

После создания сообщения вы можете сериализовать его в BOC.

```js
TonWeb.utils.bytesToBase64(await payloadCell.toBoc())
```

### Перевод с комментарием

Вы можете использовать [toncenter/tonweb](https://github.com/toncenter/tonweb) JS SDK или ваш любимый инструмент для сериализации ячеек в BOC.

Текстовый комментарий к передаче кодируется как опкод 0 (32 нулевых бита) + UTF-8 байт комментария. Вот пример того, как преобразовать его в пакет ячеек.

```js
let a = new TonWeb.boc.Cell();
a.bits.writeUint(0, 32);
a.bits.writeString("TON Connect 2 tutorial!");
let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

console.log(payload);
// te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw
```

### Развертывание смарт-контракта

Теперь мы развернем экземпляр простого [чатбота Doge](https://github.com/LaDoger/doge.fc), упомянутого как один из [примеров смарт-контрактов](/v3/documentation/smart-contracts/overview#examples-of-smart-contracts). Прежде всего, мы загружаем его код и сохраняем что-то уникальное в данных, чтобы получить наш собственный экземпляр, который не был развернут кем-то другим. Затем мы объединяем код и данные в stateInit.

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

И теперь пора отправить нашу транзакцию!

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
Получите больше примеров на странице [Подготовка сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages) для отпраки NFT и жетонов.
:::

После подтверждения мы можем увидеть нашу транзакцию завершенной на сайте [tonscan.org](https://tonscan.org/tx/pCA8LzWlCRTBc33E2y-MYC7rhUiXkhODIobrZVVGORg=).

## Что произойдет, если пользователь отклонит запрос транзакции?

Обработать отклонение запроса довольно просто, но когда вы разрабатываете какой-то проект, лучше знать заранее, что произойдет.

Когда пользователь нажимает «Cancel» во всплывающем окне в приложении кошелька, выдается исключение: `Error: [TON_CONNECT_SDK_ERROR] Wallet declined the request`. Эту ошибку можно считать окончательной (в отличие от отмены соединения) — если она была вызвана, то запрошенная транзакция точно не произойдет до следующего запроса.

## См. также

- [Подготовка сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Проверка авторизованных пользователей на стороне сервера

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

На этой странице описывается метод для backend, позволяющий убедиться, что пользователь действительно владеет заявленным адресом.

Обратите внимание, что проверка пользователя не требуется для всех DApps.

Это полезно, если вы хотите проверить пользователя, чтобы предоставить ему его личную информацию из backend.

## Как это работает?

- Пользователь начинает процесс входа.
- Сервер генерирует объект ton_proof и отправляет его в frontend.
- Frontend подписывает адрес кошелька с использованием ton_proof и получает подписанное ton_proof обратно.
- Frontend отправляет подписанное ton_proof на сервер для его проверки.

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/ton-connect/ton_proof_scheme.svg?raw=true',
        dark: '/img/docs/ton-connect/ton_proof_scheme-dark.svg?raw=true',
    }}
/>
<br></br>

## Структура ton_proof

Мы будем использовать объект TonProof, реализованный внутри connector.

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

## Проверка ton_proof на стороне сервера

1. Получите `TonProofItemReply` от пользователя.
2. Убедитесь, что полученный домен соответствует домену вашего приложения.
3. Проверьте, разрешен ли исходным сервером `TonProofItemReply.payload` и активен ли он по-прежнему.
4. Проверьте, актуален ли `timestamp` на данный момент.
5. Соберите сообщение в соответствии со [схемой сообщения](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users#concept-explanation).
6. Извлеките `public_key` либо из API (a), либо через внутреннюю логику (b)

- 6a:
  - Извлеките `{public_key, address}` из `walletStateInit` с помощью метода [TON API](https://docs.tonconsole.com/tonapi#:~:text=/v2/-,tonconnect,-/stateinit) `POST /v2/tonconnect/stateinit`.
  - Убедитесь, что адрес, извлеченный из `walletStateInit`, соответствует `address` кошелька, объявленному пользователем.
- 6b:
  - Получите public_key кошелька через [get метод](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc#L174) контракта кошелька.
  - Если контракт не активен или не имеет get_method, найденного в более старых версиях кошелька (v1-v3), то получить ключ таким образом будет невозможно. Вместо этого вам нужно будет проанализировать walletStateInit, предоставленный frontend. Убедитесь, что TonAddressItemReply.walletStateInit.hash() равен TonAddressItemReply.address.hash(), что указывает на хэш BoC.

7. Убедитесь, что `signature` из frontend правильно подписывает собранное сообщение и соответствует `public_key` адреса.

## Пример React

1. Добавьте поставщика токенов в корень вашего приложения:

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

2. Реализуйте аутентификацию на frontend с интеграцией backend:

<details>
<summary>Пример</summary>

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

## Пример backend

<details>
<summary>Проверьте, действителен ли Proof (Next.js)</summary>

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

Вы можете просмотреть наш [пример](https://github.com/ton-connect/demo-dapp-with-react-ui/tree/master/src/server), демонстрирующий ключевые методы:

- [generatePayload](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/api/generate-payload.ts): Создает payload для ton proof
- [checkProof](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/api/check-proof.ts): Проверяет proof и возвращает токен доступа.

## Концепция

Если запрашивается `TonProofItem`, кошелек подтверждает право собственности на ключ выбранной учетной записи. Подписанное сообщение привязано к:

- Уникальному префиксу для отделения сообщений от сообщений on-chain. (`ton-connect`)
- Адресу кошелька
- Домену приложения
- Временной метки подписи
- Пользовательскому payload приложения (где сервер может поместить свой nonce, идентификатор cookie, время истечения срока действия)

```
message = utf8_encode("ton-proof-item-v2/") ++
          Address ++
          AppDomain ++
          Timestamp ++
          Payload

signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
```

где:

- `Address` — это адрес кошелька, закодированный как последовательность:
- `workchain`: 32-битное целое число со знаком big endian;
- `hash`: 256-битное целое число без знака big endian;
- `AppDomain` это Length ++ EncodedDomainName

<!---->

- `Length` - это 32-битное значение длины доменного имени приложения в кодировке utf-8 в байтах
- `EncodedDomainName` id `Length` -байт доменное имя приложения в кодировке utf-8

<!---->

- `Length` - это 32-битное значение длины доменного имени приложения в кодировке utf-8 в байтах
- `EncodedDomainName` id `Length` -байт доменное имя приложения в кодировке utf-8

Примечание: payload - это ненадежные данные переменной длины. Мы помещаем ее в конец, чтобы избежать использования ненужных префиксов длины.

Подпись должна быть проверена с помощью открытого ключа:

1. Сначала попробуйте получить открытый ключ через `get_public_key` get-method на смарт-контракте, развернутом в `Address`.

2. Если смарт-контракт еще не развернут или get-метод отсутствует, то:

   1. Проанализируйте `TonAddressItemReply.walletStateInit` и получите открытый ключ из stateInit. Вы можете сравнить `walletStateInit.code` с кодом стандартных контрактов кошельков и проанализировать данные в соответствии с найденной версией кошелька.

   2. Проверьте, что `TonAddressItemReply.publicKey` равен полученному открытому ключу

   3. Проверьте, что `TonAddressItemReply.walletStateInit.hash()` равен `TonAddressItemReply.address`. `.hash()` означает хэш BoC.

### Примеры проверки доказательств TON

- Сначала попробуйте получить открытый ключ через `get_public_key` get-method на смарт-контракте, развернутом в `Address`.
- Если смарт-контракт еще не развернут или get-метод отсутствует, то:
- [Демонстрационное приложение JS](https://github.com/liketurbo/demo-dapp-backend-js)
- [Пример Python](https://github.com/XaBbl4/pytonconnect/blob/main/examples/check_proof.py)
- [Пример PHP](https://github.com/vladimirfokingithub/Ton-Connect-Proof-Php-Check)
- [Демонстрационное приложение C#](https://github.com/WinoGarcia/TonProof.NET)

## Примеры проверки доказательств TON

- [Перейти к демонстрационному приложению](https://github.com/ton-connect/demo-dapp-backend)
- [Демонстрационное приложение Rust](https://github.com/liketurbo/demo-dapp-backend-rs)
- [Демонстрационное приложение JS](https://github.com/liketurbo/demo-dapp-backend-js)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/overview.mdx
================================================
import Button from '@site/src/components/button'

# О TON Connect

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Connect — это мощный набор инструментов с открытым исходным кодом, который служит универсальным стандартом авторизации приложений в экосистеме [TON](/v3/concepts/dive-into-ton/introduction), позволяя пользователям безопасно и удобно входить в приложения и сервисы, используя свои кошельки TON вместо традиционных логинов и паролей.

<div style={{width: '100%', textAlign:'center', margin: '10pt auto'}}>
  <video style={{width: '100%',maxWidth: '600px', borderRadius: '10pt'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/TonConnect.mp4" type="video/mp4" />
    Ваш браузер не поддерживает тег видео.
  </video>
</div>

Вы можете свободно использовать один из следующих потоков для интеграции вашего приложения:

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

## Обзор

TonConnect расширяет экосистему TON, позволяя пользователям легко взаимодействовать с различными dApps, используя свои кошельки. Этот протокол направлен на обеспечение безопасного, удобного для пользователя и эффективного метода подключения, способствующего более широкому внедрению приложений и сервисов на основе TON.

### Основные функции TonConnect:

- **Бесшовная интеграция**. TonConnect проектирован для гладкой интеграции с кошельками TON и dApps. Он позволяет пользователям подключить свои кошельки к dApps всего за несколько кликов, предлагая беспрепятственный опыт.

- **Повышенная безопасность**. Безопасность является первостепенной задачей в экосистеме TON. TonConnect использует надежное шифрование и безопасные методы связи, чтобы гарантировать, что пользовательские данные и транзакции остаются защищенными в любое время.

- **Удобный для пользователя опыт**. Сосредоточившись на простоте, TonConnect упрощает взаимодействие пользователей с dApps без необходимости в обширных технических знаниях. Интуитивно понятный интерфейс протокола обеспечивает плавный путь пользователя от подключения до завершения транзакции.

- **Кросс-платформенность**. TonConnect поддерживает различные платформы, включая веб, мобильные и настольные приложения. Такая широкая совместимость гарантирует, что пользователи могут подключать свои кошельки к dApps независимо от предпочитаемого ими устройства.

- **Инструменты для разработчиков**. TonConnect предоставляет разработчикам набор инструментов и API для бесшовной интеграции протокола в их dApps. Эти ресурсы позволяют разработчикам предлагать согласованный и безопасный метод подключения на различных платформах.

- **Разработка, управляемая сообществом**. Экосистема TON выигрывает от активного сообщества разработчиков. TonConnect использует этот подход, управляемый сообществом, поощряя разработчиков вносить вклад и делиться своими инновациями, тем самым обогащая общую экосистему.

## Примеры использования для вашего DApp

Изучите эти результаты, которые экосистема TON предоставляет для превосходной интеграции DApp.

- **Трафик**. Привлекайте дополнительных пользователей через криптокошельки, которые поддерживают TON Connect.
- **Аутентификация**. Используйте кошельки пользователей TON как готовые учетные записи, устраняя необходимость в дополнительных этапах аутентификации и, таким образом, улучшая пользовательский опыт.
- **Платежи**. Быстро и безопасно обрабатывайте транзакции через блокчейн TON с использованием Toncoin или USD₮.
- **Сохранение**. Улучшайте удержание пользователей с помощью функции сохранения списка в приложении, которая позволяет пользователям отслеживать недавно открытые и избранные приложения.

## Для разработчиков кошельков

Если вы разработчик кошелька, вы можете подключить свой кошелек к TON Connect и позволить вашим пользователям взаимодействовать с приложениями TON безопасным и удобным способом, прочитайте, как [интегрировать TON Connect в ваш кошелек](/v3/guidelines/ton-connect/wallet/).

## Истории успеха

- [GetGems - Маркетплейс The Open Network](https://getgems.io/)
- [STON.fi - AMM DEX для блокчейна TON](https://ston.fi/)
- [Tonstarter](http://tonstarter.com/)

<details>
  <summary><b>Показать весь список</b></summary>

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

## Присоединяйтесь к экосистеме TON

Чтобы подключить свой сервис к экосистеме TON, вам необходимо реализовать следующее:

- **TON Connect**. Включите протокол TON Connect в свое приложение.
- **Транзакции**. Создавайте определенные сообщения транзакций с помощью библиотек TON. Погрузитесь в процесс [отправки сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages) с нашим полным руководством.
- **Платежи**. Обрабатывайте платежи через публичный API ([tonapi](https://tonapi.io/)) или собственный индексатор, например, [gobycicle](http://github.com/gobicycle/bicycle). Узнайте больше из нашего обширного руководства по [обработке активов](/v3/guidelines/dapps/asset-processing/payments-processing).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/wallet.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/ton-connect/wallet.mdx
================================================
import Button from '@site/src/components/button'

# Подключить кошелек

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Если вы разработчик кошелька, вы можете подключить свой кошелек к TON Connect, что позволит пользователям безопасно и удобно взаимодействовать с приложениями TON.

## Интеграция

Следуйте этим шагам для подключения вашего кошелька к TON Connect:

1. Внимательно прочтите [спецификацию протокола](/v3/guidelines/ton-connect/overview/).
2. Реализуйте протокол с помощью одного из [SDK](/v3/guidelines/ton-connect/guidelines/developers).
3. Добавьте свой кошелек в [список кошельков](https://github.com/ton-blockchain/wallets-list) с помощью запроса на внесение изменений.

<Button href="/v3/guidelines/ton-connect/overview/" colorType={'primary'} sizeType={'sm'}>

Начать интеграцию

</Button>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/overview.mdx
================================================
# Обзор

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Концепции

Подробнее об идеях читайте в текстах:

- [Payment Channels в TON](https://blog.ton.org/ton-payments)
- [TON DNS и домены](/v3/guidelines/web3/ton-dns/dns)
- [TON Sites, TON WWW и TON Proxy](https://blog.ton.org/ton-sites)

## Примеры использования

- [Человекочитаемые домены \*.ton для любого смарт-контракта](/v3/guidelines/web3/ton-dns/dns)
- [Подключиться к TON Sites с помощью TON Proxy] (/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy)
- [Запуск собственного TON Proxy для подключения к TON Sites] (/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)
- [Привязка своего TON-кошелька или TON-сайта к домену] (/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management)
- [Как создать поддомен с помощью смарт-контрактов TON DNS](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management#how-to-set-up-subdomains)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/dns.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/dns.md
================================================
# TON DNS и домены

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON DNS - это сервис для перевода понятных человеку доменных имен (например, test.ton или mysite.temp.ton) в адреса смарт-контрактов TON, адреса ADNL, используемые сервисами, работающими в сети TON (например, TON Sites) и т. д.

## Стандарт

[Стандарт TON DNS](https://github.com/ton-blockchain/TIPs/issues/81) описывает формат доменных имен, процесс разрешения домена, интерфейс смарт-контрактов DNS и формат записей DNS.

## SDK

Работа с TON DNS реализована в JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) и [TonLib](https://ton.org/#/apis/?id=_2-ton-api).

```js
const address: Address = await tonweb.dns.getWalletAddress('test.ton');

// or 

const address: Address = await tonweb.dns.resolve('test.ton', TonWeb.dns.DNS_CATEGORY_WALLET);
```

Также `lite-client` и `tonlib-cli` поддерживаются DNS-запросами.

## Домен первого уровня

В настоящее время только домены, заканчивающиеся на `.ton`, распознаются как допустимые домены DNS TON.

Исходный код смарт-контракта Root DNS - https://github.com/ton-blockchain/dns-contract/blob/main/func/root-dns.fc.

Это может измениться в будущем. Добавление нового домена первого уровня потребует нового смарт-контракта root DNS и общего голосования для изменения [конфигурации сети #4](https://ton.org/#/smart-contracts/governance?id=config).

## \*.ton домены

Домены \*.ton реализованы в форме NFT. Поскольку они реализуют стандарт NFT, они совместимы с обычными службами NFT (например, NFT маркетплейсами) и кошельками, которые могут отображать NFT.

Исходный код \*.ton доменов - https://github.com/ton-blockchain/dns-contract.

Резольвер доменов .ton реализует интерфейс NFT collection, а домен .ton реализует интерфейс NFT item.

Первичная продажа доменов \*.ton происходит через децентрализованный открытый аукцион на https://dns.ton.org. Исходный код - https://github.com/ton-blockchain/dns.

## Поддомены

Владелец домена может создавать поддомены, указав адрес смарт-контракта, отвечающего за разрешение поддоменов, в записи DNS `sha256("dns_next_resolver")`.

Это может быть любой смарт-контракт, реализующий стандарт DNS.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/subresolvers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-dns/subresolvers.md
================================================
# Резолверы TON DNS

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Введение

TON DNS — это мощный инструмент. Он позволяет не только назначать домены для TON сайтов/хранилищ, но и настраивать разрешение поддоменов.

## Полезные ссылки

1. [Система адресации смарт-контрактов TON](/v3/documentation/smart-contracts/addresses)
2. [TEP-0081 – Стандарт TON DNS](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md)
3. [Исходный код коллекции DNS .ton](https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz#source)
4. [Исходный код коллекции .t.me DNS](https://tonscan.org/address/EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi#source)
5. [Поисковик доменных контрактов](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source)
6. [Простой код менеджера поддоменов](https://github.com/Gusarich/simple-subdomain/blob/198485bbc9f7f6632165b7ab943902d4e125d81a/contracts/subdomain-manager.fc)

## Поисковик доменных контрактов

Поддомены имеют практическое применение. Например, в блокчейн-эксплорерах на данный момент нет способа найти доменный контракт по его названию. Давайте разберемся, как создать контракт, который позволит находить такие домены.

:::info
This contract is deployed at [EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH\_Zp](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source) and linked to `resolve-contract.ton`. To test it, you may write `<your-domain.ton>.resolve-contract.ton` in the address bar of your favourite TON explorer and get to the page of TON DNS domain contract. Subdomains and .t.me domains are supported as well.

Вы можете попытаться просмотреть код резолвера, перейдя по адресу `resolve-contract.ton.resolve-contract.ton`. Однако это не покажет вам субрезолвер (так как это отдельный смарт-контракт), а лишь страницу самого доменного контракта.
:::

### Код dnsresolve()

Некоторые повторяющиеся части опущены.

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

### Объяснение функции dnsresolve()

- Пользователь запрашивает `"stabletimer.ton.resolve-contract.ton"`.
- Приложение преобразует этот запрос в `"\0ton\0resolve-contract\0ton\0stabletimer\0"` (первый нулевой байт необязателен).
- Корневой DNS-резолвер перенаправляет запрос в коллекцию TON DNS, оставшаяся часть -`"\0resolve-contract\0ton\0stabletimer\0"`.
- Коллекция TON DNS делегирует запрос определенному домену, оставляя `"\0ton\0stabletimer\0"`.
- Доменный контракт .TON DNS передает разрешение субрезолверу, указанному редактором, поддомен - `"ton\0stabletimer\0"`.

**В этот момент вызывается dnsresolve().** Пошаговый разбор работы функции:

1. Она принимает в качестве входных данных поддомен и категорию.
2. Если в начале присутствует нулевой байт, он пропускается.
3. Она проверяет, начинается ли поддомен с `"ton\0"`. Если да, то
  1. Она пропускает первые 32 бита (поддомен = `"resolve-contract\0"`)
  2. Значение `subdomain_sfx` устанавливается на `subdomain`, и функция считывает байты до нулевого байта
  3. (subdomain = `"resolve-contract\0"`, subdomain_sfx = `""`)
  4. Нулевой байт и subdomain_sfx удаляются с конца среза поддомена subdomain (subdomain = `"resolve-contract"`)
  5. Функции slice_hash и get_ton_dns_nft_address_by_index используются для преобразования доменного имени в адрес контракта. Вы можете увидеть их в [[Subresolvers#Appendix 1. Code of resolve-contract.ton|Appendix 1]].
4. В противном случае, dnsresolve() проверяет, начинается ли поддомен с `"address\0"`. Если да, то он пропускает этот префикс и считывает адрес в формате base64.
5. Если переданный поддомен не соответствует ни одному из этих префиксов, функция указывает на неудачу, возвращая `(0, null())` (префикс с нулевыми байтами разрешен без записей DNS).
6. Затем функция проверяет, является ли суффикс поддомена пустым. Пустой суффикс означает, что запрос полностью обработан. Если суффикс пуст:
  1. dnsresolve() создает DNS-запись для подраздела "wallet" домена, используя полученный адрес контракта TON Domain.
  2. Если запрашивается категория 0 (все DNS-записи), запись оборачивается в словарь и возвращается.
  3. Если запрашивается категория "wallet"H, запись возвращается как есть.
  4. В противном случае DNS-запись для указанной категории отсутствует, поэтому функция сообщает, что разрешение прошло успешно, но результаты не найдены.
7. Если суффикс не пуст:
  1. Полученный ранее адрес контракта используется как следующий резолвер. Функция создает запись следующего резолвера, указывающую на него.
  2. `"\0ton\0stabletimer\0"` передается дальше в этот контракт: обработанные биты — это биты поддомена.

Таким образом, dnsresolve() может:

- Полностью преобразовать поддомен в DNS-запись
- Частично преобразовать его в запись резолвера для передачи разрешения другому контракту
- Вернуть результат "домен не найден" для неизвестных поддоменов

:::warning
На самом деле, синтаксический анализ адресов в формате base64 не работает: если вы попытаетесь ввести `<some-address>.address.resolve-contract.ton`, вы получите ошибку о том, что домен неправильно настроен или не существует. Причина в том, что доменные имена не чувствительны к регистру (функция, унаследованная от реального DNS) и поэтому преобразуются в нижний регистр, перенаправляя вас на какой-то несуществующий адрес.
:::

### Привязка резольвера

Теперь, когда контракт субрезолвера развернут, нам нужно привязать к нему домен, то есть изменить запись домена `dns_next_resolver`. Это можно сделать, отправив сообщение с следующей структурой TL-B в доменный контракт.

1. `change_dns_record#4eb1f0f9 query_id:uint64 record_key#19f02441ee588fdb26ee24b2568dd035c3c9206e11ab979be62e55558a1d17ff record:^[dns_next_resolver#ba93 resolver:MsgAddressInt]`

## Создание собственного менеджера поддоменов

Поддомены могут быть полезны обычным пользователям — например, для привязки нескольких проектов к одному домену или для связи с кошельками друзей.

### Данные контракта

В данных контракта необходимо хранить адрес владельца и словарь вида *domain*->*record hash*->*record value*.

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

### Обработка обновления записей

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

Мы проверяем, что входящее сообщение содержит какой-либо запрос, не является возвратным, отправлено владельцем и что запрос является `op::update_record`.

Затем мы загружаем доменное имя из сообщения. Мы не можем хранить домены в словаре в исходном виде: они могут иметь разную длину, но не-префиксные словари TVM могут содержать только ключи одинаковой длины. Поэтому мы вычисляем `string_hash(domain)` - SHA-256 доменного имени; доменное имя гарантированно содержит целое число октетов, поэтому это работает.

После этого мы обновляем запись для указанного домена и сохраняем новые данные в хранилище контракта.

### Преобразование доменов

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

Функция `dnsresolve` проверяет, содержит ли запрашиваемый поддомен целое число октетов, пропускает необязательный нулевой байт в начале среза поддомена, затем разделяет его на домен верхнего уровня и остальную часть (`test\0qwerty\0` разделяется на `test` и `qwerty\0`). Загружается словарь записей, соответствующий запрашиваемому домену.

Если есть непустой суффикс поддомена, функция возвращает количество разрешённых байтов и следующую запись резолвера, найденную по ключу `"dns_next_resolver"H`. В противном случае функция возвращает количество разрешённых байтов (то есть полную длину фрагмента) и запрошенную запись.

Существует способ улучшить эту функцию, более корректно обрабатывая ошибки, но это не является обязательным.

## Приложение 1. Код resolve-contract.ton

<details>
<summary>subresolver.fc</summary>

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
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy.md
================================================
# Подключение с TON Proxy

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Proxy совместим с обычным HTTP-прокси, поэтому вы можете использовать его непосредственно в настройках вашего браузера или операционной системы.

## Google Chrome

Следуйте инструкциям для Windows, macOS, Linux, iOS или Android, в зависимости от вашей операционной системы.

## Firefox

Настройки -> Основные -> Настройки сети -> Настроить -> Ручная настройка прокси -> HTTP прокси

В поле «HTTP прокси» введите адрес одного из публичных прокси-серверов, в поле «Порт» введите «8080» без кавычек.

Нажмите «OK».

## Safari

Следуйте инструкциям для Windows, macOS, Linux, iOS или Android, в зависимости от вашей операционной системы.

## iOS

Настройки -> Wi-Fi -> Щёлкните на текущей подключенной сети -> Настройка прокси -> Вручную

В поле «Сервер» введите адрес одного из публичных прокси-серверов, в поле «Порт» введите «8080» без кавычек.

Нажмите «Сохранить».

## Android

Настройки -> Wi-Fi -> Нажмите и удерживайте название сети Wi-Fi -> Изменить сеть -> Дополнительные параметры -> Вручную

В поле «Сервер» введите адрес одного из публичных прокси-серверов, в поле «Порт» введите «8080» без кавычек.

Нажмите «Сохранить».

## Windows

"Пуск", затем выберите Параметры > Сеть и Интернет > Прокси-сервер.

В разделе «Настройка прокси вручную», рядом с «Использовать прокси-сервер», выберите «Настройка».

В окне «Изменить прокси-сервер» сделайте следующее:

Включите «Использовать прокси-сервер».

Введите адрес одного из публичных прокси-серверов, в поле «Порт» введите «8080» без кавычек.

Нажмите «Сохранить».

## macOS

Настройки -> Сеть -> Дополнительно -> Прокси -> Веб-прокси (HTTP).

В поле «Сервер веб-прокси» введите адрес одного из публичных прокси-серверов, после двоеточия введите «8080» без кавычек.

Нажмите «OK».

## Ubuntu

Настройки -> Сеть -> Кнопка сетевого прокси -> Вручную

В поле «HTTP Proxy» введите адрес одного из публичных прокси-серверов, в поле порта введите «8080» без кавычек.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site.md
================================================
# Как открыть любой TON Site?

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этой статье мы рассмотрим наиболее распространенные способы посещения TON Sites с различных устройств.

У каждого метода есть свои плюсы и минусы, которые мы проанализируем здесь.

Мы начнем с самых простых методов и закончим более продвинутыми.

## 😄 Простые методы

### Просмотрите ton.run или tonp.io

Самый простой способ открыть TON Site - это сайты вроде [ton.run](https://ton.run). Вам не нужно ничего устанавливать или настраивать на своем устройстве - просто откройте **ton.run** или **tonp.io** и вы готовы к изучению TON Sites.

Этот метод может подойти для случайного просмотра TON Sites или для некоторых проверок, но не для регулярного использования, поскольку у него тоже есть свои недостатки:

- Вы доверяете свой интернет-трафик **ton.run**.
- Он может отключиться или сломаться в любой момент
- Он может быть заблокирован вашим интернет-провайдером

### Расширения TON Wallet и MyTonWallet

Немного сложнее, но лучше использовать расширение для браузера, которое подключит вас к TON Proxy и позволит просматривать TON Sites без каких-либо промежуточных сервисов, таких как ton.run.

В настоящее время TON Proxy уже доступен в расширении [MyTonWallet](https://mytonwallet.io/), а также скоро будет доступен в расширении [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd).

Этот способ также довольно прост, но для его применения необходимо установить расширение для браузера. Он подойдет для большинства пользователей.

## 🤓 Продвинутые методы

### Использование Tonutils-Proxy

Это самый безопасный способ доступа к TON Sites.

1. Загрузите последнюю версию [отсюда](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version)

2. Запустите и нажмите "Start Gateway"

3. Готово!

## См. также

- [Запустить реализацию на C++](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site.md
================================================
# Как создавать TON Sites

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## 👋 Введение

[TON-сайты](https://blog.ton.org/ton-sites) работают почти как обычные сайты, за исключением их установки. Для их запуска требуется несколько дополнительных действий. В этом уроке я покажу вам, как это сделать.

## 🖥 Запуск TON-сайта

Установите [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy), чтобы использовать TON Proxy для вашего сайта.

### Установка на любой дистрибутив Linux

##### Скачивание

```bash
wget https://github.com/ton-utils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### Запуск

Запустите конфигурацию домена и выполните следующие действия:

```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```

Отсканируйте QR-код из вашего терминала с помощью Tonkeeper, Tonhub или любого другого кошелька, выполните транзакцию. Ваш домен будет привязан к вашему сайту.

###### Запуск без домена

Кроме того, вы можете запускать сайт в простом режиме с доменом .adnl, если у вас нет домена .ton или .t.me:

```
./tonutils-reverse-proxy-linux-amd64
```

##### Использование

Теперь любой может открыть ваш TON-сайт, используя ADNL-адрес или домен.

Если вы хотите изменить некоторые настройки, например, URL прокси-пасса, откройте файл `config.json`, отредактируйте его и перезапустите прокси. По умолчанию URL прокси-пасса – `http://127.0.0.1:80/`

Прокси добавляет дополнительные заголовки:
`X-Adnl-Ip` – ip клиента, и `X-Adnl-Id` – adnl id клиента

### Установка на любую другую ОС

Соберите проект из исходников и запустите так же, как в шаге 2 для Linux. Для сборки требуется среда языка Go.

```bash
git clone https://github.com/tonutils/reverse-proxy.git
cd reverse-proxy
make build
```

Сборка для других операционных систем выполняется командой `make all`

## 👀 Дальнейшие шаги

### 🔍 Проверка доступности сайта

После выполнения всех шагов выбранного вами метода TON Proxy должен был запуститься. Если все прошло успешно, ваш сайт будет доступен по адресу ADNL, полученному на соответствующем шаге.

Вы можете проверить доступность сайта, открыв этот адрес с доменом `.adnl`. Также обратите внимание, что для того, чтобы сайт открылся, в вашем браузере должен быть запущен TON Proxy, например, через расширение [MyTonWallet](https://mytonwallet.io/).

## 📌 Материалы

- [Сайты TON, TON WWW и TON Proxy](https://blog.ton.org/ton-sites)
- [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy)
- Авторы: [Андрей Бурносов](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [Даниил Седов](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [Георгий Имедашвили](https://github.com/drforse)

## См. также

- [Запустить реализацию на C++](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy.md
================================================
# Запустите собственный TON-прокси

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Цель этого документа - дать краткое представление о TON Sites, которые представляют собой веб-сайты, доступные через TON Network. TON Sites могут использоваться как удобная точка входа в другие TON Services. В частности, HTML-страницы, загружаемые с TON Sites, могут содержать ссылки на URI `ton://...`, представляющие платежи, которые пользователь может выполнить, нажав на ссылку, при условии, что на устройстве пользователя установлен кошелек TON.

С технической точки зрения TON Sites очень похожи на стандартные веб-сайты, но доступ к ним осуществляется не через Интернет, а через [TON Network](/v3/concepts/dive-into-ton/ton-blockchain/ton-networking) (это оверлейная сеть внутри Интернета). Более конкретно, они используют [ADNL](/v3/documentation/network/protocols/adnl/overview) адрес (вместо более привычных адресов IPv4 или IPv6), и принимают HTTP-запросы через протокол [RLDP](/v3/documentation/network/protocols/rldp) (высокоуровневый протокол, построенный на основе ADNL, основного протокола TON Network) вместо обычного TCP/IP. Все шифрование обрабатывается ADNL, поэтому нет необходимости использовать HTTPS (т.е. TLS), если прокси-вход размещен локально на устройстве пользователя.

Для доступа к существующим сайтам и создания новых TON Sites необходимы специальные шлюзы между "обычным" интернетом и TON Network. По сути, доступ к TON Sites осуществляется с помощью HTTP->RLDP прокси, работающего локально на устройстве клиента, а их создание происходит с помощью обратного RLDP->HTTP-прокси, работающего на удаленном веб-сервере.

[Подробнее о TON Sites, WWW и прокси](https://blog.ton.org/ton-sites)

## Запуск прокси-входа

Чтобы получить доступ к существующим TON Sites, вам нужно запустить на своем компьютере RLDP-HTTP Proxy.

1. Загрузите **rldp-http-proxy** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

 Или Вы можете скомпилировать **rldp-http-proxy** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Скачать](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) глобальную конфигурацию TON.

3. Запустите **rldp-http-proxy**

 ```bash
 rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
 ```

В приведенном выше примере `8080` — это TCP-порт, который будет слушать localhost для входящих HTTP-запросов, а `3333` — это UDP-порт, который будет использоваться для всех исходящих и входящих действий RLDP и ADNL (т.е. для подключения к TON Sites через TON Network). `global.config.json` — это имя файла глобальной конфигурации TON.

Если вы все сделали правильно, прокси-вход не завершит свою работу и будет продолжать работать в терминале. Теперь его можно использовать для доступа к TON Sites. Когда он больше не нужен, вы можете завершить его работу, нажав `Ctrl-C`, или просто закрыв окно терминала.

Ваш прокси-вход будет доступен по HTTP на `localhost`, порт `8080`.

## Запуск прокси-входа на удаленном компьютере

1. Загрузите **rldp-http-proxy** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

 Или вы можете скомпилировать **rldp-http-proxy** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Скачать](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) глобальную конфигурацию TON.

3. Скачайте **generate-random-id** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

 Или вы можете скомпилировать **generate-random-id** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Создайте постоянный ANDL-адрес для вашего прокси-входа

 ```bash
 mkdir keyring

 utils/generate-random-id -m adnlid
 ```

 Вы увидите что-то похожее на это

 ```
 45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
 ```

 Это ваш недавно сгенерированный постоянный ADNL-адрес в шестнадцатеричном и удобном для пользователя формате. Соответствующий приватный ключ сохранен в файл `45061...2DB` в текущей директории. Переместите ключ в директорию keyring

 ```bash
 mv 45061C1* keyring/
 ```

5. Запустите **rldp-http-proxy**

 ```
 rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
 ```

 где `<your_public_ip>` - это ваш публичный IPv4-адрес, а `<your_adnl_address>` - это ADNL-адрес, сгенерированный в предыдущем шаге.

 Пример:

 ```
 rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
 ```

 В приведенном выше примере `8080` — это TCP-порт, который будет слушать localhost для входящих HTTP-запросов, а `3333` — это UDP-порт, который будет использоваться для всех исходящих и входящих действий RLDP и ADNL (т.е. для подключения к TON Sites через TON Network). `global.config.json` — это имя файла глобальной конфигурации TON.

Если вы все сделали правильно, прокси не завершит свою работу и будет продолжать работать в терминале. Теперь его можно использовать для доступа к TON Sites. Когда он больше не нужен, вы можете завершить его работу, нажав `Ctrl-C`, или просто закрыв окно терминала. Вы также можете запустить его как службу Unix для постоянной работы.

Ваш прокси-вход будет доступен по HTTP на `<your_public_ip>`, порт `8080`.

## Доступ к TON Sites

Теперь предположим, что у вас на компьютере запущен экземпляр RLDP-HTTP Proxy, который слушает `localhost:8080` для входящих TCP-соединений, как объяснялось [выше] (#running-an-entry-proxy-on-a-remote-computer).

Простой тест, чтобы убедиться, что все работает правильно, можно выполнить с помощью таких программ, как `curl` или `wget`. Например,

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

пытается загрузить главную страницу (TON) Site `just-for-test.ton`, используя прокси на `127.0.0.1:8080`. Если прокси запущен и работает, вы увидите что-то похожее

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

Вы также можете получить доступ к TON Sites через их ADNL-адреса, используя поддельный домен `<adnl-addr>.adnl`

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```

в настоящее время загружает ту же веб-страницу TON.

В качестве альтернативы вы можете настроить `localhost:8080` в качестве HTTP-прокси в вашем браузере. Например, если вы используете Firefox, перейдите в [Настройки] -> Общие -> Настройки сети -> Настройки -> Настроить доступ через прокси -> Ручная настройка прокси, и введите "127.0.0.1" в поле "HTTP-прокси" и "8080" в поле "Порт".

После того, как вы настроили `localhost:8080` в качестве HTTP-прокси, который будет использоваться в вашем браузере, вы можете просто ввести нужный URI, например, `http://just-for-test.ton` или `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`, в адресной строке вашего браузера и взаимодействовать с TON Site так же, как и с обычными веб-сайтами.

## Запуск TON Site

:::tip Туториал найден!
Эй! Не хотите начать с туториала для начинающих [Как запустить TON-Site?] (/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site)
:::

Большинству людей нужно просто получить доступ к существующим TON Sites, а не создавать новые. Однако если вы хотите создать такой сайт, вам нужно запустить RLDP-HTTP Proxy на своем сервере вместе с обычным программным обеспечением веб-сервера, таким как Apache или Nginx.

Мы предполагаем, что вы уже знаете, как создать обычный веб-сайт и что вы уже настроили его на своем сервере, принимающем входящие HTTP-соединения на TCP-порт `<your-server-ip>:80`, а также указали требуемое доменное имя TON Network (например, `example.ton`) как основное доменное имя или алиас для вашего веб-сайта в конфигурации веб-сервера.

1. Загрузите **rldp-http-proxy** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

 Или вы можете скомпилировать **rldp-http-proxy** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Скачать](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) глобальную конфигурацию TON.

3. Скачайте **generate-random-id** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

 Или вы можете скомпилировать **generate-random-id** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Создайте постоянный ANDL-адрес для вашего сервера

 ```bash
 mkdir keyring

 utils/generate-random-id -m adnlid
 ```

 Вы увидите что-то похожее на это

 ```bash
 45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
 ```

 Это ваш недавно сгенерированный постоянный ADNL-адрес в шестнадцатеричном и удобном для пользователя формате. Соответствующий приватный ключ сохранен в файл `45061...2DB` в текущей директории. Переместите ключ в директорию keyring

 ```bash
 mv 45061C1* keyring/
 ```

5. Убедитесь, что ваш веб-сервер принимает HTTP-запросы с доменами `.ton` и `.adnl`.

 Например, если вы используете nginx с конфигурацией `server_name example.com;`, вам нужно изменить ее на `server_name _;` или `server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;`.

6. Запустите прокси в обратном режиме

 ```bash
 rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
 ```

 где `<your_public_ip>` - это публичный IPv4-адрес вашего сервера, а `<your_adnl_address>` - это ADNL-адрес, сгенерированный в предыдущем шаге.

Если вы хотите, чтобы ваш TON Site работал постоянно, вам нужно использовать параметры `-d` и `-l <log-file>`.

Пример:

```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -L '*' -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

Если все работает правильно, RLDP-HTTP прокси будет принимать входящие HTTP-запросы из TON Network через RLDP/ADNL, работающий на UDP-порту 3333 (конечно, вы можете использовать любой другой UDP-порт, если хотите) по IPv4-адресу `<your-server-ip>` (в частности, если вы используете брандмауэр, не забудьте разрешить `rldp-http-proxy` получать и отправлять UDP-пакеты с этого порта), и он будет пересылать эти HTTP-запросы, адресованные всем хостам (если вы хотите пересылать только определенным хостам, измените `-L '*'` на `-L <your hostname>`), на TCP-порт `80` по адресу `127.0.0.1` (т.е. на ваш обычный веб-сервер).

Вы можете посетить TON Site `http://<your-adnl-address>.adnl` (`http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl` в данном примере) из браузера, запущенного на клиентской машине, как описано в разделе "Доступ к TON Sites", и проверить, действительно ли ваш TON Site доступен для публики.

Если хотите, вы можете [зарегистрировать](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management) домен TON DNS, например, 'example.ton', и создать для этого домена запись `site`, указывающую на постоянный ADNL-адрес вашего TON Site. Тогда RLDP-HTTP прокси, работающие в режиме клиента, будут распознавать http://example.ton, как указывающий на ваш ADNL-адрес, и предоставлять доступ к вашему TON Site.

Вы также можете запустить обратный прокси на отдельном сервере и установить ваш веб-сервер в качестве удаленного адреса. В этом случае используйте `-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>` вместо `-L '*'`.

Пример:

```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

В этом случае ваш обычный веб-сервер должен быть доступен на `http://333.333.333.333:80` (этот IP не будет открыт для внешнего доступа).

### Рекомендации

Поскольку анонимность будет доступна только в TON Proxy 2.0, если вы не хотите раскрывать IP-адрес своего веб-сервера, вы можете сделать это двумя способами:

- Запустите обратный прокси на отдельном сервере с флагом `-R`, как описано выше.

- Создайте дублирующий сервер с копией вашего сайта и запустите обратный прокси локально.




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management.md
================================================
# Управление сайтом и доменом

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Как открыть домен для редактирования

1. Откройте браузер Google Chrome на своем компьютере.

2. Установите расширение Google Chrome TON по этой [ссылке](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd).

3. Откройте расширение, нажмите "Импортировать кошелек" и импортируйте кошелек, в котором хранится домен.

> Фразы восстановления
>
> Ваша фраза восстановления состоит из 24 слов, которые вы записали, когда создавали свой кошелек.
>
> Если вы потеряли свою фразу восстановления, вы можете восстановить ее с помощью любого кошелька TON.
> В Tonkeeper: перейдите в Настройки > Защита кошелька > Ваш приватный ключ.
>
> Обязательно запишите эти 24 слова и храните их в надежном месте. В случае чрезвычайной ситуации вы сможете восстановить доступ к кошельку, используя только вашу фразу восстановления.
> Храните фразы восстановления строго конфиденциально. Любой, кто получит доступ к вашим фразам восстановления, будет иметь полный доступ к вашим средствам.

4. Теперь откройте ваш домен на сайте https://dns.ton.org и нажмите кнопку "Редактировать".

## Как привязать кошелек к домену

Вы можете привязать кошелек к домену, что позволит пользователям отправлять монеты на этот кошелек, указывая домен в качестве адреса получателя вместо адреса кошелька.

1. Откройте домен для редактирования, как описано выше.

2. Скопируйте адрес вашего кошелька в поле "Адрес кошелька" и нажмите "Сохранить".

3. Подтвердите отправку транзакции в расширении.

## Как привязать TON Site к домену

1. Откройте домен для редактирования, как описано выше.

2. Скопируйте ADNL-адрес вашего TON Site в формате HEX в поле "Site" и нажмите "Сохранить".

3. Подтвердите отправку транзакции в расширении.

## Как настроить поддомены

1. Создайте в сети смарт-контракт для управления поддоменами вашего веб-сайта или сервиса. Вы можете использовать готовые смарт-контракты [manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc) или [auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc), или любой другой смарт-контракт, реализующий интерфейс TON DNS.

2. Откройте домен для редактирования, как описано выше.

3. Скопируйте адрес смарт-контракта в поле "Поддомены" и нажмите "Сохранить".

4. Подтвердите отправку транзакции в расширении.





================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications.mdx
================================================
# TON Sites для приложений

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Как поддерживать TON Site в вашем приложении?

Вы можете запускать TON Sites из вашего приложения, интегрировав локальные прокси-входы в ваш продукт.

Существует готовая библиотека и следующие примеры:

- [Andriod](https://github.com/andreypfau/tonutils-proxy-android-example)
- [iOS](https://github.com/ton-blockchain/ton-proxy-swift)

:::caution
Публичные прокси-входы были запущены исключительно для ознакомления и тестирования; пожалуйста, не используйте их.
:::

## См. также

- [Подключение с помощью TON Proxy](/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-daemon.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-daemon.md
================================================
# Демон хранения

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

*Демон хранения (storage daemon) — это программа, используемая для загрузки и обмена файлами в сети TON. Другая программа `storage-daemon-cli` используется для управления уже запущенным демоном хранения из консоли.*

Текущую версию демона хранения можно найти в репозитории в ветви [Testnet](https://github.com/ton-blockchain/ton/tree/testnet).

## Требования к аппаратному обеспечению

- не менее 1 ГГц частоты и 2 ядер у процессора
- не менее 2 ГБ оперативной памяти
- не менее 2 ГБ SSD (без учета места для торрентов)
- пропускная способность сети 10 Мб/с со статическим IP

## Бинарные файлы

Вы можете скачать бинарные файлы `storage-daemon` и `storage-daemon-cli` для Linux/Windows/MacOS из [раздела сборок](https://github.com/ton-blockchain/ton/releases/latest) в GitHub-репозитории.

## Компиляция исходного кода

Вы можете самостоятельно скомпилировать `storage-daemon` и `storage-damon-cli` из файлов с исходным кодом, используя [инструкцию](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#storage-daemon).

## Ключевые понятия

- *Пакет файлов* («bag of files») или просто *Пакет* — коллекция файлов, распространяемых через хранилище TON
- Сетевая часть TON Storage основана на технологии, схожей с торрентами, поэтому термины *торрент*, *пакет файлов* и *пакет* будут использоваться как взаимозаменяемые. Однако важно отметить некоторые различия: TON Storage передает данные по протоколу [ADNL](/v3/documentation/network/protocols/adnl/overview) по протоколу [RLDP](/v3/documentation/network/protocols/rldp), каждый *пакет* распространяется через свой собственный сетевой оверлей, меркловая структура может существовать в двух вариантах — с большими чанками для эффективного скачивания и маленькими для эффективного доказательства права собственности, а для поиска пиров используется сеть [TON DHT](/v3/documentation/network/protocols/dht/ton-dht).
- *Пакет файлов* состоит из *информации о торренте* и блока данных.
- Блок данных начинается с *заголовка торрента* — структуры, содержащей список файлов с их именами и размерами. Далее в блоке данных следуют сами файлы.
- Блок данных делится на так называемые «чанки» (по умолчанию 128 КБ), и на основе SHA256-хэшей этих чанков строится *дерево Меркла* (из TVM-ячеек). Это позволяет создавать и проверять *доказательства Меркла* для отдельных фрагментов, а также эффективно воссоздавать *пакет*, обмениваясь только доказательством измененного чанка.
- *Информация о торренте* содержит *Меркловый корень* следующих данных:
    - Размер чанка (блок данных)
    - список размеров чанков
    - Хэш *дерева Меркла*
    - Описание – любой текст, указанный создателем торрента
- *Информация о торренте* сериализуется в TVM-ячейку. Хэш этой ячейки называется *BagID*, и он уникально идентифицирует *Bag*.
- *Bag meta* — это файл, содержащий *информацию о торренте* и *заголовок торрента*.\* Это аналог файлов с расширением `.torrent`.

## Запуск storage-daemon и storage-daemon-cli

### Пример команды для запуска storage-daemon:

`storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db`

- `-v` - уровень многословия (INFO)
- `-C` - глобальная конфигурация сети ([скачать глобальную конфигурацию](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config))
- `-I` - IP-адрес и порт для ADNL
- `-p` - TCP-порт для консольного интерфейса
- `-D` - каталог для базы данных демона хранения

### Управление storage-daemon-cli

Его начинают так:

```
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

- `-I` - это IP-адрес и порт демона (порт тот же, что указан в параметре `-p` выше)
- `-k` и `-p` - это приватный ключ клиента и публичный ключ сервера (аналогично `validator-engine-console`). Эти ключи генерируются при первом запуске демона и помещаются в папку `<db>/cli-keys/`.

### Список команд

Список команд `storage-daemon-cli` можно получить с помощью команды `help`.

У команд бывают позиционные параметры и флаги. Параметры с пробелами должны быть заключены в кавычки (`'` или `"`), также пробелы могут быть экранированы. Возможны и другие варианты экранирования, например:

```
create filename\ with\ spaces.txt -d "Description\nSecond line of \"description\"\nBackslash: \\"
```

Все параметры после флага `--` являются позиционными. Его можно использовать для указания имен файлов, начинающихся с тире:

```
create -d "Description" -- -filename.txt
```

`storage-daemon-cli` можно запустить в неинтерактивном режиме, передав ему команды для выполнения:

```
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## Добавление пакета файлов

Чтобы загрузить *пакет файлов*, Вам необходимо знать его `BagID` или иметь мета-файл. Следующие команды могут быть использованы для добавления *пакета* для загрузки:

```
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```

*Пакет* будет загружен в указанную директорию. Вы можете опустить этот параметр, тогда пакет будет сохранен в директории демона хранения.

:::info
Хэш указывается в шестнадцатеричной форме (длина — 64 символа).
:::

При добавлении *пакета* с помощью мета-файла информация о *пакете* будет доступна сразу: размер, описание, список файлов. При добавлении по хэшу вам придется подождать, пока эта информация будет загружена.

## Управление добавленными пакетами

- Команда `list` выводит список *пакетов*.
- `list --hashes` выводит список с полными хэшами.

Во всех последующих командах `<BagID>` — это либо хэш (шестнадцатеричный), либо порядковый номер *пакета* в рамках сессии (номер, который можно увидеть в списке, вызываемом командой `list`). Порядковые номера *пакетами* не сохраняются между перезапусками storage-daemon-cli и недоступны в неинтерактивном режиме.

### Методы

- `get <BagID>` — выводит подробную информацию о *пакете*: описание, размер, скорость загрузки, список файлов.
- `get-peers <BagID>` — выводит список пиров.
- `download-pause <BagID>`, `download-resume <BagID>` — приостанавливает или возобновляет загрузку.
- `upload-pause <BagID>`, `upload-resume <BagID>` — приостанавливает или возобновляет загрузку.
- `remove <BagID>` — удаляет *пакет*. `remove --remove-files` также удаляет все файлы из *пакета*. Обратите внимание, что если *пакет* сохранен во внутренней директории демона хранения, файлы будут удалены в любом случае.

## Частичная загрузка, Приоритеты

:::info
При добавлении *пакета* вы можете указать, какие файлы хотите загрузить из него:
:::

```
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### Приоритеты

Каждый файл в *пакете файлов* имеет приоритет — число от 0 до 255. Приоритет 0 означает, что файл не будет загружен. Флаг `--partial` устанавливает указанным файлам приоритет 1, остальным — 0.

Вы можете изменить приоритеты уже добавленному *пакету* с помощью следующих команд:

- `priority-all <BagID> <priority>` — для всех файлов.
- `priority-idx <BagID> <idx> <priority>` — для одного файла по номеру (увидеть его можно с помощью команды `get`).
- `priority-name <BagID> <name> <priority>` — для одного файла по имени.
    Приоритеты могут быть установлены еще до загрузки списка файлов.

## Создание пакета файлов

Чтобы создать *пакет* и начать его распространение, воспользуйтесь командой `create`:

```
create <path>
```

`<path>` может указывать как на отдельный файл, так и на директорию. При создании *пакета* вы можете указать описание:

```
create <path> -d "Bag of Files description"
```

После того, как *пакет* будет создан, в консоли появится подробная информация о нем (включая хэш — `BagID`, по которому *пакет* будет идентифицироваться), и демон начнет раздачу торрента. Дополнительные опции для команды `create`:

- `--no-upload` — демон не будет распространять файлы среди пиров. Загрузка может быть запущена с помощью `upload-resume`.
- `--copy` — файлы будут скопированы во внутреннюю директорию демона хранения.

Чтобы скачать *пакет*, другим пользователям достаточно знать его хэш. Вы также можете сохранить мета-файл торрента:

```
get-meta <BagID> <meta-file>
```



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-faq.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-faq.md
================================================
# FAQ по TON Storage

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Как назначить домен TON пакету файлов TON Storage

1. [Загрузите](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) пакет файлов в сеть и получите идентификатор Bag ID

2. Откройте браузер Google Chrome на своем компьютере.

3. Установите [расширение TON](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) для Google Chrome.
   Вы также можете использовать [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc).

4. Откройте расширение, нажмите «Import wallet» и импортируйте кошелек, которому принадлежит домен, используя фразу восстановления.

5. Теперь откройте Ваш домен на https://dns.ton.org и нажмите «Manage domain».

6. Скопируйте Bag ID в поле «TON Storage» и нажмите «Save».

## Как разместить статический TON-сайт в TON Storage

1. [Создайте](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) пакет из папки с файлами сайта, загрузите его в сеть и получите Bag ID. Папка должна содержать файл `index.html`.

2. Откройте браузер Google Chrome на своем компьютере.

3. Установите [расширение TON](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) для Google Chrome.
   Вы также можете использовать [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc).

4. Откройте расширение, нажмите "Import wallet" и импортируйте кошелек, которому принадлежит домен, используя фразу восстановления.

5. Теперь откройте ваш домен на https://dns.ton.org и нажмите «Manage domain».

6. Скопируйте ID вашего пакета в поле «Site», установите флажок «Host in TON Storage» и нажмите «Save».

## Как перенести содержимое TON NFT в TON Storage

Если вы использовали [стандартный смарт-контракт NFT](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection-editable.fc) для своей коллекции, вам необходимо отправить [сообщение](https://github.com/ton-blockchain/token-contract/blob/2d411595a4f25fba43997a2e140a203c140c728a/nft/nft-collection-editable.fc#L132) смарт-контракту коллекции из кошелька владельца коллекции с новым префиксом URL.

Например, если раньше префикс url был `https://mysite/my_collection/`, то новый префикс будет `tonstorage://my_bag_id/`.

## Как назначить домен TON пакету TON Storage (низкий уровень)

Вам нужно присвоить следующее значение sha256("storage") DNS-записи вашего домена TON:

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

## Как разместить статический сайт TON в TON Storage (низкий уровень)

[Создайте](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) пакет из папки с файлами сайта, загрузите его в сеть и получите Bag ID. Папка должна содержать файл `index.html`.

Вам нужно присвоить следующее значение sha256("site") DNS-записи вашего домена TON:

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-provider.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/guidelines/web3/ton-storage/storage-provider.md
================================================
# Провайдер хранилища

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

*Провайдер хранилища* — это сервис, который хранит файлы за комиссию.

## Двоичные файлы

Вы можете загрузить двоичные файлы `storage-daemon` и `storage-daemon-cli` для Linux/Windows/macOS из [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

## Компилляция из исходного кода

Вы можете скомпилировать `storage-daemon` и `storage-damon-cli` из исходников, используя эту [инструкцию](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#storage-daemon).

## Основные понятия

Он состоит из смарт-контракта, который принимает запросы на хранение и управляет платежами от клиентов, а также приложения, которое загружает и обслуживает файлы для клиентов. Вот как это работает:

1. Владелец провайдера запускает `storage-daemon`, развертывает основной смарт-контракт и настраивает параметры. Адрес контракта передается потенциальным клиентам.
2. Используя `storage-daemon`, клиент создает Bag из своих файлов и отправляет специальное внутреннее сообщение в смарт-контракт провайдера.
3. Смарт-контракт провайдера создает контракт хранения для обработки этого конкретного Bag.
4. Провайдер, обнаружив запрос в блокчейне, загружает Bag и активирует контракт хранения.
5. Затем клиент может перевести оплату за хранение на контракт хранения. Чтобы получить оплату, провайдер регулярно представляет контракт с доказательством того, что он все еще хранит Bag.
6. Если средства на контракте хранения заканчиваются, контракт считается неактивным, и поставщику больше не требуется хранить Bag. Клиент может либо пополнить контракт, либо получить свои файлы.

:::info
Клиент также может получить свои файлы в любое время, предоставив доказательство права собственности на контракт хранения. Затем контракт передаст файлы клиенту и деактивируется.
:::

## Смарт-контракт

[Исходный код смарт-контракта](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont).

## Использование провайдера клиентами

Чтобы использовать провайдера хранения, вам необходимо знать адрес его смарт-контракта. Клиент может получить параметры провайдера с помощью следующей команды в `storage-daemon-cli`:

```
get-provider-params <address>
```

### Параметры провайдера:

- Принимаются ли новые контракты на хранение.
- Минимальный и максимальный размер *Bag* (в байтах).
- Ставка — стоимость хранения. Указывается в nanoTON за мегабайт в день.
- Максимальный объем — как часто провайдер должен предоставлять доказательства хранения *Bag*.

### Запрос на хранение

Вам необходимо создать *Bag* и сгенерировать сообщение с помощью следующей команды:

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### Информация:

Выполнение этой команды может занять некоторое время для больших *Bag*. Тело сообщения будет сохранено в `<file>` (не все внутреннее сообщение). Идентификатор запроса может быть любым числом от 0 до `2^64-1`. Сообщение содержит параметры провайдера (скорость и максимальный диапазон). Эти параметры будут выведены после выполнения команды, поэтому их следует дважды проверить перед отправкой. Если владелец провайдера изменит параметры, сообщение будет отклонено, поэтому условия нового контракта на хранение будут в точности соответствовать ожиданиям клиента.

Затем клиент должен отправить сообщение с этим телом на адрес провайдера. В случае ошибки сообщение вернется к отправителю (возврат). В противном случае будет создан новый контракт на хранение, и клиент получит от него сообщение с [`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3) и тем же идентификатором запроса.

На этом этапе контракт еще не активен. Как только поставщик загрузит *Bag*, он активирует контракт на хранение, и клиент получит сообщение с [`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4) (также из контракта на хранение).

Контракт на хранение имеет `клиентский баланс` — это средства, которые клиент перевел на контракт и которые еще не были выплачены поставщику. Средства постепенно списываются с этого баланса (по ставке, равной ставке за мегабайт в день). Первоначальный баланс — это то, что клиент перевел с запросом на создание контракта хранения. Затем клиент может пополнить баланс, совершая простые переводы на контракт хранения (это можно сделать с любого адреса). Оставшийся баланс клиента возвращается get методом [`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) в качестве второго значения (`balance`).

### Контракт может быть закрыт в следующих случаях:

:::info
В случае закрытия контракта хранения клиент получает сообщение с остатком баланса и [`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6).
:::

- Сразу после создания, перед активацией, если провайдер отказывается принять контракт (превышен лимит провайдера или другие ошибки).
- Баланс клиента достигает 0.
- Провайдер может добровольно закрыть контракт.
- Клиент может добровольно закрыть контракт, отправив сообщение с [`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2) со своего адреса и любого идентификатора запроса.

## Запуск и настройка провайдера

Провайдер хранилища является частью `storage-daemon` и управляется `storage-daemon-cli`. `storage-daemon` необходимо запустить с флагом `-P`.

### Создание основного смарт-контракта

Вы можете сделать это из `storage-daemon-cli`:

```
deploy-provider
```

:::info ВАЖНО!
Для инициализации провайдера вам будет предложено отправить на указанный адрес сообщение с 1 TON, которое не подлежит возврату. Вы можете проверить, что контракт был создан, с помощью команды `get-provider-info`.
:::

По умолчанию контракт настроен на то, чтобы не принимать новые контракты на хранение. Перед его активацией вам необходимо настроить провайдера. Настройки провайдера состоят из конфигурации (хранящейся в `storage-daemon`) и параметров контракта (хранящихся в блокчейне).

### Конфигурация:

- `max contract` - максимальное количество контрактов на хранение, которые могут существовать одновременно.
- `max total size` - максимальный общий размер *Bag* в контрактах на хранение.
  Вы можете просмотреть значения конфигурации с помощью `get-provider-info` и изменить их с помощью:

```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### Параметры контракта:

- `accept` - нужно ли принимать новые контракты на хранение.
- `max file size`, `min file size` - ограничения по размеру для одного *Bag*.
- `rate` - стоимость хранения (указывается в nanoTON за мегабайт в день).
- `max span` - как часто провайдер должен будет предоставлять доказательства хранения.

Просмотреть параметры можно с помощью `get-provider-info`, а изменить их с помощью:

```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

### На это стоит обратить внимание

Примечание: в команде `set-provider-params` можно указать только часть параметров. Остальные будут взяты из текущих параметров. Поскольку данные в блокчейне не обновляются мгновенно, несколько последовательных команд `set-provider-params` могут привести к неожиданным результатам.

Рекомендуется изначально положить на баланс провайдера более 1 TON, чтобы было достаточно средств для покрытия комиссий за работу с контрактами хранения. Однако не отправляйте слишком много TON с первым невозвратным сообщением.

После установки параметра `accept` в `1` смарт-контракт начнет принимать запросы от клиентов и создавать контракты хранения, а демон хранения автоматически их обработает: загрузит и распределит *Bag*, сгенерирует доказательства хранения.

## Дальнейшая работа с провайдером

### Список существующих контрактов хранения

```
get-provider-info --contracts --balances
```

В каждом контракте хранения указаны балансы `Client$` и `Contract$`; разницу между ними можно вывести на основной контракт провайдера с помощью команды `withdraw <address>`.

Команда `withdraw-all` выведет средства со всех контрактов, у которых доступно не менее `1 TON`.

Любой контракт хранения можно закрыть с помощью команды `close-contract <address>`. Это также переведет средства на основной контракт. То же самое произойдет автоматически, когда баланс клиента закончится. Файлы *Bag* в этом случае будут удалены (если нет других контрактов, использующих тот же *Bag*).

### Перевод

Вы можете перевести средства с основного смарт-контракта на любой адрес (сумма указывается в nanoTON):

```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
Все *Bag*, хранящиеся у провайдера, доступны с помощью команды `list` и могут использоваться как обычно. Чтобы не нарушать работу провайдера, не удаляйте их и не используйте этот демон хранилища для работы с другими *Bag*.
:::



================================================
FILE: i18n/zh-CN/code.json
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/code.json
================================================
{
  "theme.ErrorPageContent.title": {
    "message": "页面已崩溃。",
    "description": "The title of the fallback page when the page crashed"
  },
  "theme.NotFound.title": {
    "message": "找不到页面",
    "description": "The title of the 404 page"
  },
  "theme.NotFound.p1": {
    "message": "我们找不到您要找的页面。",
    "description": "The first paragraph of the 404 page"
  },
  "theme.NotFound.p2": {
    "message": "请联系原始链接来源网站的所有者，并告知他们链接已损坏。",
    "description": "The 2nd paragraph of the 404 page"
  },
  "theme.admonition.note": {
    "message": "备注",
    "description": "The default label used for the Note admonition (:::note)"
  },
  "theme.admonition.tip": {
    "message": "提示",
    "description": "The default label used for the Tip admonition (:::tip)"
  },
  "theme.admonition.danger": {
    "message": "危险",
    "description": "The default label used for the Danger admonition (:::danger)"
  },
  "theme.admonition.info": {
    "message": "信息",
    "description": "The default label used for the Info admonition (:::info)"
  },
  "theme.admonition.caution": {
    "message": "警告",
    "description": "The default label used for the Caution admonition (:::caution)"
  },
  "theme.BackToTopButton.buttonAriaLabel": {
    "message": "回到顶部",
    "description": "The ARIA label for the back to top button"
  },
  "theme.blog.archive.title": {
    "message": "历史博文",
    "description": "The page & hero title of the blog archive page"
  },
  "theme.blog.archive.description": {
    "message": "历史博文",
    "description": "The page & hero description of the blog archive page"
  },
  "theme.blog.paginator.navAriaLabel": {
    "message": "博文列表分页导航",
    "description": "The ARIA label for the blog pagination"
  },
  "theme.blog.paginator.newerEntries": {
    "message": "较新的博文",
    "description": "The label used to navigate to the newer blog posts page (previous page)"
  },
  "theme.blog.paginator.olderEntries": {
    "message": "较旧的博文",
    "description": "The label used to navigate to the older blog posts page (next page)"
  },
  "theme.blog.post.paginator.navAriaLabel": {
    "message": "博文分页导航",
    "description": "The ARIA label for the blog posts pagination"
  },
  "theme.blog.post.paginator.newerPost": {
    "message": "较新一篇",
    "description": "The blog post button label to navigate to the newer/previous post"
  },
  "theme.blog.post.paginator.olderPost": {
    "message": "较旧一篇",
    "description": "The blog post button label to navigate to the older/next post"
  },
  "theme.colorToggle.ariaLabel": {
    "message": "切换浅色/暗黑模式（当前为{mode}）",
    "description": "The ARIA label for the navbar color mode toggle"
  },
  "theme.colorToggle.ariaLabel.mode.dark": {
    "message": "暗黑模式",
    "description": "The name for the dark color mode"
  },
  "theme.colorToggle.ariaLabel.mode.light": {
    "message": "浅色模式",
    "description": "The name for the light color mode"
  },
  "theme.blog.post.plurals": {
    "message": "{count} 篇博文",
    "description": "Pluralized label for \"{count} posts\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.blog.tagTitle": {
    "message": "{nPosts} 含有标签「{tagName}」",
    "description": "The title of the page for a blog tag"
  },
  "theme.tags.tagsPageLink": {
    "message": "查看所有标签",
    "description": "The label of the link targeting the tag list page"
  },
  "theme.docs.breadcrumbs.navAriaLabel": {
    "message": "页面路径",
    "description": "The ARIA label for the breadcrumbs"
  },
  "theme.docs.DocCard.categoryDescription": {
    "message": "{count} 个项目",
    "description": "The default description for a category card in the generated index about how many items this category includes"
  },
  "theme.docs.paginator.navAriaLabel": {
    "message": "文件选项卡",
    "description": "The ARIA label for the docs pagination"
  },
  "theme.docs.paginator.previous": {
    "message": "上一页",
    "description": "The label used to navigate to the previous doc"
  },
  "theme.docs.paginator.next": {
    "message": "下一页",
    "description": "The label used to navigate to the next doc"
  },
  "theme.docs.tagDocListPageTitle.nDocsTagged": {
    "message": "{count} 篇文档带有标签",
    "description": "Pluralized label for \"{count} docs tagged\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.docs.tagDocListPageTitle": {
    "message": "{nDocsTagged}「{tagName}」",
    "description": "The title of the page for a docs tag"
  },
  "theme.docs.versionBadge.label": {
    "message": "版本：{versionLabel}"
  },
  "theme.common.editThisPage": {
    "message": "编辑此页",
    "description": "The link label to edit the current page"
  },
  "theme.common.headingLinkTitle": {
    "message": "{heading}的直接链接",
    "description": "Title for link to heading"
  },
  "theme.docs.versions.unreleasedVersionLabel": {
    "message": "此为 {siteTitle} {versionLabel} 版尚未发行的文档。",
    "description": "The label used to tell the user that he's browsing an unreleased doc version"
  },
  "theme.docs.versions.unmaintainedVersionLabel": {
    "message": "此为 {siteTitle} {versionLabel} 版的文档，现已不再积极维护。",
    "description": "The label used to tell the user that he's browsing an unmaintained doc version"
  },
  "theme.docs.versions.latestVersionSuggestionLabel": {
    "message": "最新的文档请参阅 {latestVersionLink} ({versionLabel})。",
    "description": "The label used to tell the user to check the latest version"
  },
  "theme.docs.versions.latestVersionLinkLabel": {
    "message": "最新版本",
    "description": "The label used for the latest version suggestion link label"
  },
  "theme.lastUpdated.atDate": {
    "message": "于 {date} ",
    "description": "The words used to describe on which date a page has been last updated"
  },
  "theme.lastUpdated.byUser": {
    "message": "由 {user} ",
    "description": "The words used to describe by who the page has been last updated"
  },
  "theme.lastUpdated.lastUpdatedAtBy": {
    "message": "最后{byUser}{atDate}更新",
    "description": "The sentence used to display when a page has been last updated, and by who"
  },
  "theme.navbar.mobileVersionsDropdown.label": {
    "message": "选择版本",
    "description": "The label for the navbar versions dropdown on mobile view"
  },
  "theme.tags.tagsListLabel": {
    "message": "标签：",
    "description": "The label alongside a tag list"
  },
  "theme.AnnouncementBar.closeButtonAriaLabel": {
    "message": "关闭",
    "description": "The ARIA label for close button of announcement bar"
  },
  "theme.blog.sidebar.navAriaLabel": {
    "message": "最近博文导航",
    "description": "The ARIA label for recent posts in the blog sidebar"
  },
  "theme.CodeBlock.copied": {
    "message": "复制成功",
    "description": "The copied button label on code blocks"
  },
  "theme.CodeBlock.copyButtonAriaLabel": {
    "message": "复制代码到剪贴板",
    "description": "The ARIA label for copy code blocks button"
  },
  "theme.CodeBlock.copy": {
    "message": "复制",
    "description": "The copy button label on code blocks"
  },
  "theme.CodeBlock.wordWrapToggle": {
    "message": "切换自动换行",
    "description": "The title attribute for toggle word wrapping button of code block lines"
  },
  "theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel": {
    "message": "打开/收起侧边栏菜单「{label}」",
    "description": "The ARIA label to toggle the collapsible sidebar category"
  },
  "theme.NavBar.navAriaLabel": {
    "message": "主导航",
    "description": "The ARIA label for the main navigation"
  },
  "theme.blog.post.readMore": {
    "message": "阅读更多",
    "description": "The label used in blog post item excerpts to link to full blog posts"
  },
  "theme.blog.post.readMoreLabel": {
    "message": "阅读 {title} 的全文",
    "description": "The ARIA label for the link to full blog posts from excerpts"
  },
  "theme.TOCCollapsible.toggleButtonLabel": {
    "message": "本页总览",
    "description": "The label used by the button on the collapsible TOC component"
  },
  "theme.navbar.mobileLanguageDropdown.label": {
    "message": "选择语言",
    "description": "The label for the mobile language switcher dropdown"
  },
  "theme.blog.post.readingTime.plurals": {
    "message": "阅读需 {readingTime} 分钟",
    "description": "Pluralized label for \"{readingTime} min read\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.docs.breadcrumbs.home": {
    "message": "主页面",
    "description": "The ARIA label for the home page in the breadcrumbs"
  },
  "theme.docs.sidebar.collapseButtonTitle": {
    "message": "收起侧边栏",
    "description": "The title attribute for collapse button of doc sidebar"
  },
  "theme.docs.sidebar.collapseButtonAriaLabel": {
    "message": "收起侧边栏",
    "description": "The title attribute for collapse button of doc sidebar"
  },
  "theme.docs.sidebar.navAriaLabel": {
    "message": "文档侧边栏",
    "description": "The ARIA label for the sidebar navigation"
  },
  "theme.docs.sidebar.closeSidebarButtonAriaLabel": {
    "message": "关闭导航栏",
    "description": "The ARIA label for close button of mobile sidebar"
  },
  "theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel": {
    "message": "← 回到主菜单",
    "description": "The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)"
  },
  "theme.docs.sidebar.toggleSidebarButtonAriaLabel": {
    "message": "切换导航栏",
    "description": "The ARIA label for hamburger menu button of mobile navigation"
  },
  "theme.docs.sidebar.expandButtonTitle": {
    "message": "展开侧边栏",
    "description": "The ARIA label and title attribute for expand button of doc sidebar"
  },
  "theme.docs.sidebar.expandButtonAriaLabel": {
    "message": "展开侧边栏",
    "description": "The ARIA label and title attribute for expand button of doc sidebar"
  },
  "theme.SearchBar.seeAll": {
    "message": "查看全部结果"
  },
  "theme.SearchPage.documentsFound.plurals": {
    "message": "共找到 {count} 篇文档",
    "description": "Pluralized label for \"{count} documents found\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.SearchPage.existingResultsTitle": {
    "message": "“{query}” 的搜索结果",
    "description": "The search page title for non-empty query"
  },
  "theme.SearchPage.emptyResultsTitle": {
    "message": "搜索文档",
    "description": "The search page title for empty query"
  },
  "theme.SearchPage.inputPlaceholder": {
    "message": "在此输入搜索字词",
    "description": "The placeholder for search page input"
  },
  "theme.SearchPage.inputLabel": {
    "message": "搜索",
    "description": "The ARIA label for search page input"
  },
  "theme.SearchPage.algoliaLabel": {
    "message": "通过 Algolia 搜索",
    "description": "The ARIA label for Algolia mention"
  },
  "theme.SearchPage.noResultsText": {
    "message": "没有找到任何文档",
    "description": "The paragraph for empty search result"
  },
  "theme.SearchPage.fetchingNewResults": {
    "message": "正在获取新的搜索结果...",
    "description": "The paragraph for fetching new search results"
  },
  "theme.SearchBar.label": {
    "message": "搜索",
    "description": "The ARIA label and placeholder for search button"
  },
  "theme.SearchModal.searchBox.resetButtonTitle": {
    "message": "清除查询",
    "description": "The label and ARIA label for search box reset button"
  },
  "theme.SearchModal.searchBox.cancelButtonText": {
    "message": "取消",
    "description": "The label and ARIA label for search box cancel button"
  },
  "theme.SearchModal.startScreen.recentSearchesTitle": {
    "message": "最近搜索",
    "description": "The title for recent searches"
  },
  "theme.SearchModal.startScreen.noRecentSearchesText": {
    "message": "没有最近搜索",
    "description": "The text when no recent searches"
  },
  "theme.SearchModal.startScreen.saveRecentSearchButtonTitle": {
    "message": "保存这个搜索",
    "description": "The label for save recent search button"
  },
  "theme.SearchModal.startScreen.removeRecentSearchButtonTitle": {
    "message": "从历史记录中删除这个搜索",
    "description": "The label for remove recent search button"
  },
  "theme.SearchModal.startScreen.favoriteSearchesTitle": {
    "message": "收藏",
    "description": "The title for favorite searches"
  },
  "theme.SearchModal.startScreen.removeFavoriteSearchButtonTitle": {
    "message": "从收藏列表中删除这个搜索",
    "description": "The label for remove favorite search button"
  },
  "theme.SearchModal.errorScreen.titleText": {
    "message": "无法获取结果",
    "description": "The title for error screen of search modal"
  },
  "theme.SearchModal.errorScreen.helpText": {
    "message": "你可能需要检查网络连接。",
    "description": "The help text for error screen of search modal"
  },
  "theme.SearchModal.footer.selectText": {
    "message": "选中",
    "description": "The explanatory text of the action for the enter key"
  },
  "theme.SearchModal.footer.selectKeyAriaLabel": {
    "message": "Enter 键",
    "description": "The ARIA label for the Enter key button that makes the selection"
  },
  "theme.SearchModal.footer.navigateText": {
    "message": "导航",
    "description": "The explanatory text of the action for the Arrow up and Arrow down key"
  },
  "theme.SearchModal.footer.navigateUpKeyAriaLabel": {
    "message": "向上键",
    "description": "The ARIA label for the Arrow up key button that makes the navigation"
  },
  "theme.SearchModal.footer.navigateDownKeyAriaLabel": {
    "message": "向下键",
    "description": "The ARIA label for the Arrow down key button that makes the navigation"
  },
  "theme.SearchModal.footer.closeText": {
    "message": "关闭",
    "description": "The explanatory text of the action for Escape key"
  },
  "theme.SearchModal.footer.closeKeyAriaLabel": {
    "message": "Esc 键",
    "description": "The ARIA label for the Escape key button that close the modal"
  },
  "theme.SearchModal.footer.searchByText": {
    "message": "搜索提供",
    "description": "The text explain that the search is making by Algolia"
  },
  "theme.SearchModal.noResultsScreen.noResultsText": {
    "message": "没有结果：",
    "description": "The text explains that there are no results for the following search"
  },
  "theme.SearchModal.noResultsScreen.suggestedQueryText": {
    "message": "试试搜索",
    "description": "The text for the suggested query when no results are found for the following search"
  },
  "theme.SearchModal.noResultsScreen.reportMissingResultsText": {
    "message": "认为这个查询应该有结果？",
    "description": "The text for the question where the user thinks there are missing results"
  },
  "theme.SearchModal.noResultsScreen.reportMissingResultsLinkText": {
    "message": "请告知我们。",
    "description": "The text for the link to report missing results"
  },
  "theme.SearchModal.placeholder": {
    "message": "搜索文档",
    "description": "The placeholder of the input of the DocSearch pop-up modal"
  },
  "theme.Playground.result": {
    "message": "结果",
    "description": "The result label of the live codeblocks"
  },
  "theme.Playground.liveEditor": {
    "message": "实时编辑器",
    "description": "The live editor label of the live codeblocks"
  },
  "theme.SearchBar.noResultsText": {
    "message": "没有找到任何文档"
  },
  "theme.ErrorPageContent.tryAgain": {
    "message": "重试",
    "description": "The label of the button to try again rendering when the React error boundary captures an error"
  },
  "theme.common.skipToMainContent": {
    "message": "跳到主要内容",
    "description": "The skip to content label used for accessibility, allowing to rapidly navigate to main content with keyboard tab/enter navigation"
  },
  "theme.tags.tagsPageTitle": {
    "message": "标签",
    "description": "The title of the tag list page"
  }
}



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current.json
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current.json
================================================
{
  "version.label": {
    "message": "下一步",
    "description": "The label for version current"
  },
  "sidebar.learn.category.TON Blockchain": {
    "message": "TON 区块链",
    "description": "The label for category TON Blockchain in sidebar learn"
  },
  "sidebar.learn.category.TON Networking": {
    "message": "TON 网络",
    "description": "The label for category TON Networking in sidebar learn"
  },
  "sidebar.learn.category.ADNL Protocol": {
    "message": "ADNL 协议",
    "description": "The label for category ADNL Protocol in sidebar learn"
  },
  "sidebar.learn.category.TON Whitepapers": {
    "message": "TON 白皮书",
    "description": "The label for category TON Whitepapers in sidebar learn"
  },
  "sidebar.learn.link.TON Compared to Other L1s": {
    "message": "TON 与其他L1对比",
    "description": "The label for link TON Compared to Other L1s in sidebar learn, linking to https://ton.org/analysis"
  },
  "sidebar.learn.link.Open-Source and Decentralization in TON": {
    "message": "TON 开源与去中心化",
    "description": "The label for link Open-Source and Decentralization in TON in sidebar learn, linking to https://defi.org/ton/"
  },
  "sidebar.learn.link.TON": {
    "message": "TON",
    "description": "The label for link TON in sidebar learn, linking to https://docs.ton.org/ton.pdf"
  },
  "sidebar.learn.link.TON Virtual Machine": {
    "message": "TON 虚拟机",
    "description": "The label for link TON Virtual Machine in sidebar learn, linking to https://docs.ton.org/tvm.pdf"
  },
  "sidebar.learn.link.TON Blockchain": {
    "message": "TON 区块链",
    "description": "The label for link TON Blockchain in sidebar learn, linking to https://docs.ton.org/tblkch.pdf"
  },
  "sidebar.learn.link.Catchain Consensus Protocol": {
    "message": "Catchain 共识协议",
    "description": "The label for link Catchain Consensus Protocol in sidebar learn, linking to https://docs.ton.org/catchain.pdf"
  },
  "sidebar.learn.doc.Overview": {
    "message": "概览",
    "description": "The label for the doc item Overview in sidebar learn, linking to the doc learn/docs"
  },
  "sidebar.develop.category.TON Hello World series": {
    "message": "TON Hello World 系列",
    "description": "The label for category TON Hello World series in sidebar develop"
  },
  "sidebar.develop.category.Smart Contracts": {
    "message": "智能合约",
    "description": "The label for category Smart Contracts in sidebar develop"
  },
  "sidebar.develop.category.Getting Started": {
    "message": "开始",
    "description": "The label for category Getting Started in sidebar develop"
  },
  "sidebar.develop.category.Testing and Debugging": {
    "message": "测试与调试",
    "description": "The label for category Testing and Debugging in sidebar develop"
  },
  "sidebar.develop.category.Development Guidelines": {
    "message": "开发指南",
    "description": "The label for category Development Guidelines in sidebar develop"
  },
  "sidebar.develop.category.Message Management": {
    "message": "消息管理",
    "description": "The label for category Message Management in sidebar develop"
  },
  "sidebar.develop.category.Transaction Fees": {
    "message": "交易手续费",
    "description": "The label for category Transaction Fees in sidebar develop"
  },
  "sidebar.develop.category.Security Measures": {
    "message": "安全措施",
    "description": "The label for category Security Measures in sidebar develop"
  },
  "sidebar.develop.category.Core Contracts": {
    "message": "核心合约",
    "description": "The label for category Core Contracts in sidebar develop"
  },
  "sidebar.develop.category.Tutorials & Examples": {
    "message": "教程与示例",
    "description": "The label for category Tutorials & Examples in sidebar develop"
  },
  "sidebar.develop.category.DApps Development": {
    "message": "去中心化应用开发",
    "description": "The label for category DApps Development in sidebar develop"
  },
  "sidebar.develop.category.Telegram Mini Apps": {
    "message": "Telegram 小程序",
    "description": "The label for category Telegram Mini Apps in sidebar develop"
  },
  "sidebar.develop.category.Guidelines": {
    "message": "指南",
    "description": "The label for category Guidelines in sidebar develop"
  },
  "sidebar.develop.category.APIs and SDKs": {
    "message": "APIs 和 SDKs",
    "description": "The label for category APIs and SDKs in sidebar develop"
  },
  "sidebar.develop.category.DeFi Development": {
    "message": "DeFi 开发",
    "description": "The label for category DeFi Development in sidebar develop"
  },
  "sidebar.develop.category.Telegram Bot Examples": {
    "message": "Telegram 机器人示例",
    "description": "The label for category Telegram Bot Examples in sidebar develop"
  },
  "sidebar.develop.category.Integrate with TON": {
    "message": "集成 TON",
    "description": "The label for category Integrate with TON in sidebar develop"
  },
  "sidebar.develop.category.Frameworks": {
    "message": "框架",
    "description": "The label for category Frameworks in sidebar develop"
  },
  "sidebar.develop.category.Advanced": {
    "message": "高级",
    "description": "The label for category Advanced in sidebar develop"
  },
  "sidebar.develop.category.Business": {
    "message": "商务",
    "description": "The label for category Business in sidebar develop"
  },
  "sidebar.develop.category.Network Configurations": {
    "message": "网络配置",
    "description": "The label for category Network Configurations in sidebar develop"
  },
  "sidebar.develop.category.FunC language": {
    "message": "FunC 语言",
    "description": "The label for category FunC language in sidebar develop"
  },
  "sidebar.develop.category.Documentation": {
    "message": "文档",
    "description": "The label for category Documentation in sidebar develop"
  },
  "sidebar.develop.category.Fift language": {
    "message": "Fift 语言",
    "description": "The label for category Fift language in sidebar develop"
  },
  "sidebar.develop.category.TON Virtual Machine (TVM)": {
    "message": "TON 虚拟机(TVM)",
    "description": "The label for category TON Virtual Machine (TVM) in sidebar develop"
  },
  "sidebar.develop.category.Blockchain Fundamentals": {
    "message": "区块链基础",
    "description": "The label for category Blockchain Fundamentals in sidebar develop"
  },
  "sidebar.develop.category.Data Formats": {
    "message": "数据格式",
    "description": "The label for category Data Formats in sidebar develop"
  },
  "sidebar.develop.category.TL-B": {
    "message": "TL-B",
    "description": "The label for category TL-B in sidebar develop"
  },
  "sidebar.develop.category.Network Protocols": {
    "message": "网络协议",
    "description": "The label for category Network Protocols in sidebar develop"
  },
  "sidebar.develop.category.Compile from Sources": {
    "message": "从源代码编译",
    "description": "The label for category Compile from Sources in sidebar develop"
  },
  "sidebar.develop.category.Archived": {
    "message": "已归档",
    "description": "The label for category Archived in sidebar develop"
  },
  "sidebar.develop.link.Working with your wallet": {
    "message": "使用钱包",
    "description": "The label for link Working with your wallet in sidebar develop, linking to https://helloworld.tonstudio.io/01-wallet"
  },
  "sidebar.develop.link.Writing first smart contract": {
    "message": "编写第一个智能合约",
    "description": "The label for link Writing first smart contract in sidebar develop, linking to https://helloworld.tonstudio.io/02-contract"
  },
  "sidebar.develop.link.Building first web client": {
    "message": "构建第一个Web客户端",
    "description": "The label for link Building first web client in sidebar develop, linking to https://helloworld.tonstudio.io/03-client"
  },
  "sidebar.develop.link.Testing your smart contract": {
    "message": "测试智能合约",
    "description": "The label for link Testing your smart contract in sidebar develop, linking to https://helloworld.tonstudio.io/04-testing"
  },
  "sidebar.develop.link.How to shard your TON smart contract and why": {
    "message": "如何分片您的TON智能合约以及为什么",
    "description": "The label for link How to shard your TON smart contract and why in sidebar develop, linking to https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons"
  },
  "sidebar.develop.link.Wallets List": {
    "message": "钱包列表",
    "description": "The label for link Wallets List in sidebar develop, linking to https://github.com/ton-blockchain/wallets-list"
  },
  "sidebar.develop.link.TVM Instructions": {
    "message": "TVM 指令",
    "description": "The label for link TVM Instructions in sidebar develop, linking to /learn/tvm-instructions/instructions"
  },
  "sidebar.develop.doc.Get Started with TON": {
    "message": "开始使用 TON",
    "description": "The label for the doc item Get Started with TON in sidebar develop, linking to the doc develop/get-started-with-ton"
  },
  "sidebar.develop.doc.NFT Use Cases in TON": {
    "message": "TON 中的 NFT 使用案例",
    "description": "The label for the doc item NFT Use Cases in TON in sidebar develop, linking to the doc participate/nft"
  },
  "sidebar.develop.doc.NFT Minting Guide": {
    "message": "NFT 铸造指南",
    "description": "The label for the doc item NFT Minting Guide in sidebar develop, linking to the doc develop/dapps/tutorials/collection-minting"
  },
  "sidebar.develop.doc.Mint Your First Token": {
    "message": "铸造您的第一个代币",
    "description": "The label for the doc item Mint Your First Token in sidebar develop, linking to the doc develop/dapps/tutorials/jetton-minter"
  },
  "sidebar.develop.doc.Zero-Knowledge Proofs": {
    "message": "零知识证明",
    "description": "The label for the doc item Zero-Knowledge Proofs in sidebar develop, linking to the doc develop/dapps/tutorials/simple-zk-on-ton"
  },
  "sidebar.develop.doc.Web3 Game Example": {
    "message": "Web3 游戏示例",
    "description": "The label for the doc item Web3 Game Example in sidebar develop, linking to the doc develop/dapps/tutorials/building-web3-game"
  },
  "sidebar.develop.doc.React Apps": {
    "message": "React 应用",
    "description": "The label for the doc item React Apps in sidebar develop, linking to the doc develop/dapps/ton-connect/react"
  },
  "sidebar.develop.doc.HTML/JS Apps": {
    "message": "HTML/JS 应用",
    "description": "The label for the doc item HTML/JS Apps in sidebar develop, linking to the doc develop/dapps/ton-connect/web"
  },
  "sidebar.develop.doc.Telegram Bots JS": {
    "message": "Telegram 机器人(JS)",
    "description": "The label for the doc item Telegram Bots JS in sidebar develop, linking to the doc develop/dapps/ton-connect/tg-bot-integration"
  },
  "sidebar.develop.doc.Telegram Bots Python": {
    "message": "Telegram 机器人(Python)",
    "description": "The label for the doc item Telegram Bots Python in sidebar develop, linking to the doc develop/dapps/ton-connect/tg-bot-integration-py"
  },
  "sidebar.develop.doc.TON Connect Protocol": {
    "message": "TON Connect 协议",
    "description": "The label for the doc item TON Connect Protocol in sidebar develop, linking to the doc develop/dapps/ton-connect/protocol/README"
  },
  "sidebar.develop.doc.Compilation Instructions": {
    "message": "编译指南",
    "description": "The label for the doc item Compilation Instructions in sidebar develop, linking to the doc develop/howto/compile"
  },
  "sidebar.develop.doc.Instructions for low-memory machines": {
    "message": "低内存机器指南",
    "description": "The label for the doc item Instructions for low-memory machines in sidebar develop, linking to the doc develop/howto/compile-swap"
  },
  "sidebar.participate.category.Wallets in TON": {
    "message": "TON 钱包",
    "description": "The label for category Wallets in TON in sidebar participate"
  },
  "sidebar.participate.category.Cross-chain Bridges": {
    "message": "跨链桥",
    "description": "The label for category Cross-chain Bridges in sidebar participate"
  },
  "sidebar.participate.category.Blockchain Nodes": {
    "message": "区块链节点",
    "description": "The label for category Blockchain Nodes in sidebar participate"
  },
  "sidebar.participate.category.Network Infrastructure": {
    "message": "网络基础设施",
    "description": "The label for category Network Infrastructure in sidebar participate"
  },
  "sidebar.participate.category.TON DNS": {
    "message": "TON 域名系统",
    "description": "The label for category TON DNS in sidebar participate"
  },
  "sidebar.participate.category.TON Proxy & Sites": {
    "message": "TON 代理与站点",
    "description": "The label for category TON Proxy & Sites in sidebar participate"
  },
  "sidebar.participate.category.TON Storage": {
    "message": "TON 存储",
    "description": "The label for category TON Storage in sidebar participate"
  },
  "sidebar.participate.doc.Overview": {
    "message": "概览",
    "description": "The label for the doc item Overview in sidebar participate, linking to the doc participate/crosschain/overview"
  },
  "sidebar.participate.doc.Bridges Addresses": {
    "message": "桥地址",
    "description": "The label for the doc item Bridges Addresses in sidebar participate, linking to the doc participate/crosschain/bridge-addresses"
  },
  "sidebar.contribute.category.Common Rules": {
    "message": "通用规则",
    "description": "The label for category Common Rules in sidebar contribute"
  },
  "sidebar.contribute.category.Documentation": {
    "message": "文档",
    "description": "The label for category Documentation in sidebar contribute"
  },
  "sidebar.contribute.category.Tutorials": {
    "message": "教程",
    "description": "The label for category Tutorials in sidebar contribute"
  },
  "sidebar.contribute.category.Archive": {
    "message": "归档",
    "description": "The label for category Archive in sidebar contribute"
  },
  "sidebar.contribute.category.Hacktoberfest 2022": {
    "message": "Hacktoberfest 2022",
    "description": "The label for category Hacktoberfest 2022 in sidebar contribute"
  },
  "sidebar.contribute.category.Localization Program": {
    "message": "本地化系统",
    "description": "The label for category Localization Program in sidebar contribute"
  },
  "sidebar.contribute.doc.Overview": {
    "message": "概览",
    "description": "The label for the doc item Overview in sidebar contribute, linking to the doc contribute/localization-program/overview"
  },
  "sidebar.contribute.doc.How It Works": {
    "message": "工作原理",
    "description": "The label for the doc item How It Works in sidebar contribute, linking to the doc contribute/localization-program/how-it-works"
  },
  "sidebar.contribute.doc.How To Contribute": {
    "message": "如何参与贡献",
    "description": "The label for the doc item How To Contribute in sidebar contribute, linking to the doc contribute/localization-program/how-to-contribute"
  },
  "sidebar.contribute.doc.Translation Style Guide": {
    "message": "翻译风格指南",
    "description": "The label for the doc item Translation Style Guide in sidebar contribute, linking to the doc contribute/localization-program/translation-style-guide"
  }
  
}



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/academy-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/academy-overview.mdx
================================================
# 教育资源

## TON 区块链课程

:::danger
页面正在开发中.
:::

## 参见

- [TON Hello World](https://helloworld.tonstudio.io/01-wallet/)
- [[YouTube]TON 开发研究 EN ](https://www.youtube.com/@TONDevStudy)[[RU]](https://www.youtube.com/results?search_query=tondevstudy)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services.md
================================================
# 区块链服务

## 域名系统

在以太坊中，用户使用以太坊名称服务（ENS），这是一个建立在以太坊区块链之上的去中心化命名系统。

TON 区块链包含一个被称为 TON DNS 的嵌入式域名系统。这是一种去中心化服务，允许用户为其智能合约、网站或任何其他在线内容注册人类可读的域名。这种设备有助于与 TON 区块链上的去中心化应用程序（dApps）和其他资源进行交互。TON 中的 DNS 系统与传统的互联网 DNS 系统功能类似，但其去中心化的性质消除了中心化机构控制和管理域名的需要，从而降低了审查、欺诈和域名劫持的风险。

## WWW

TON WWW 是 TON 区块链的一部分，允许您直接通过区块链创建去中心化网站并与之交互。与传统网站不同，TON 上的网站可通过以 `.ton` 结尾的特殊 URL 访问，并支持 `ton://` 格式的独特超链接，允许直接从 URL 进行交易和其他操作。

TON WWW 的主要功能之一是将加密货币钱包与域名直接绑定，这样用户就可以将加密货币发送到 alice.place.ton 等地址，而无需其他详细信息。这大大简化了捐赠和支付流程，使其更加直观和便捷。

## Proxy

TON Proxy 是一款基于 TON 协议的工具，具有高度的安全性和匿名性。通过 TON Proxy 传输的所有数据都经过加密，从而保护用户的机密信息。

TON Proxy 的主要优势之一是能够绕过互联网服务提供商或政府机构实施的封锁。这使它成为需要自由访问互联网信息而不受限制的用户的重要工具。

此外，TON Proxy 还有助于加快互联网连接速度。它会自动选择负载最低的服务器，从而提高连接质量和上网速度。

## 分散式存储

以太坊不适合存储大量数据。因此，以太坊上的去中心化存储通常涉及使用分布式文件系统，以去中心化和安全的方式存储和检索数据。以太坊上一种流行的去中心化存储方法是 InterPlanetary File System（IPFS），它是一种点对点文件系统，允许用户从分布式节点网络中存储和检索文件。

TON 网络拥有自己的去中心化存储服务，由 TON 区块链用于存储区块和状态数据（快照）的存档副本，也可用于存储用户文件或平台上运行的其他服务，采用类似洪流的访问技术。最流行的使用案例是直接在 TON 存储上存储 NFT 元数据，而不使用额外的分布式文件存储服务（如 IPFS）。

## 支付服务

TON Payments 是在 TON 区块链上以零网络费用进行闪电般快速交易的解决方案。虽然 TON 区块链足以完成大多数任务，但某些应用（如 TON 代理、TON 存储或某些去中心化应用）需要更快、更低成本的小额交易。支付通道（也称为闪电网络）就是为了解决这个问题而创建的。支付通道允许双方通过在区块链上创建一个特殊的智能合约，用各自的初始余额在链外进行交易。然后，他们之间可以进行任意数量的交易，没有任何速度限制或费用。网络费用只在通道打开和关闭时收取。该技术还允许一方在另一方作弊或消失时自行关闭通道，从而保证正常运行。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains.md
================================================
# 区块链的区别

在本章中，我们将研究以太坊区块链与 TON 区块链的主要区别。分析将包括对网络架构的概述，突出它们的独特功能，并评估各自的优缺点。

从对以太坊和 TON 生态系统的概述开始，我们可以注意到这两个平台都提供了类似的参与者和服务结构，包括持有资产和进行交易的用户、保持网络正常运行和安全的验证者，以及将区块链作为其产品和服务基础的应用开发者。两个生态系统都包括托管和非托管服务，为用户提供不同程度的资产控制。

此外，值得强调的是，这两个平台都有利于创建去中心化应用程序（DApps），为开发者提供强大的开发工具和标准。

然而，尽管以太坊和 TON 在整体结构和提供的功能上有相似之处，但其关键技术方面和网络设计方法却有很大不同。这些差异为全面了解每个平台的独特优势和局限性奠定了基础，这对于寻求最大限度发挥每个网络功能的开发人员来说尤为重要。在下面的小节中，我们将更详细地探讨这些差异，重点关注网络架构、模型、交易机制和交易结算系统，为开发者提供所需的见解。

## 区块链架构

以太坊继承并扩展了比特币的基本原理，为开发者提供了创建复杂的去中心化应用程序（DApps）所需的灵活性。以太坊的独特之处在于它能为每个账户提供个性化的数据存储，使交易不仅能执行代币转账，还能通过与智能合约的交互改变区块链的状态。我们知道，这种在账户间同步交互的能力为应用开发带来了巨大的前景，但同时也提出了可扩展性的问题。以太坊网络上的每笔交易都需要节点更新和维护区块链的全部状态，这会导致显著的延迟，并随着网络利用率的提高而增加 gas 成本。

为了应对这些挑战，TON 提供了一种旨在提高可扩展性和性能的替代方法。TON 的设计初衷是为开发人员提供最大的灵活性来创建各种应用程序，它使用分片和主链的概念来优化区块创建过程。在每个 TON 分片链和主链中，平均每 5 秒钟就会生成一个新区块，从而确保交易的快速执行。与同步更新状态的以太坊不同，TON 实现了智能合约之间的异步消息传递，允许每笔交易独立并行处理，大大加快了网络上的交易处理速度。需要熟悉的章节和文章：

- [分片](/v3/documentation/smart-contracts/shards/shards-intro)
- [区块链比较文档](https://ton.org/comparison_of_blockchains.pdf)
- [区块链比较表（信息量比文档少得多，但更直观）](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)

总之，通过比较 TON 和以太坊的架构和技术基础，TON 显然具有显著优势。TON 采用创新的异步交易处理方法以及独特的分片和主链架构，展示了在不影响安全性或集中化的情况下支持每秒数百万次交易的潜力。这为该平台提供了出色的灵活性和效率，使其成为广泛应用的理想选择。

## 基于账户的模式（Account-based model）（以太坊）与演员模型（Actor Model）（TON）

在第一小节中，我们对以太坊和 TON 进行了比较，强调了它们在架构上的主要区别以及以太坊面临的主要挑战。特别值得注意的是，这些区块链在组织交互和使用模型方面采用了不同的方法。这些差异来自每个平台独特的架构选择。对于习惯使用以太坊的开发人员来说，必须深入了解这些差异，才能有效地过渡到在 TON 上进行开发。这种理解将使架构能够适应和优化智能合约在新环境中的交互。

那么，让我们回忆一下以太坊中基于账户的模型是如何工作的。以太坊使用这种模式来跟踪余额。就像银行账户一样，资金存储在账户中，而不是单个的币中。账户有两种类型：

- 外部拥有账户（EOA）--外部管理账户由用户使用公钥和私钥对控制。公用密钥允许他人向该账户发送付款。
- 合约账户--由智能合约代码而非私钥控制。由于没有私钥，合约账户无法自行启动交易。

当以太坊用户创建钱包时，当调用第一笔交易或收到第一笔资金时，外部账户会被添加到去中心化网络中所有节点的全局状态中。部署智能合约会创建一个合约账户，该账户能够根据特定条件以编程方式存储和分配资金。所有账户类型都有余额和存储空间，并能通过调用其他账户中的函数触发交易。这种结构使以太坊具备了作为可编程货币的能力。

以太坊采用同步交易处理方式，每笔交易都按照严格的顺序依次处理。这确保了区块链的状态始终保持一致，并且对网络中的所有参与者都是可预测的。所有交易都是原子性的，要么完全成功完成，要么完全失败，没有任何部分或不完全的执行。此外，当一个智能合约被调用时，它反过来又会调用另一个智能合约，这种调用在同一个交易中是即时的。但这里也有弊端，一个交易可以无限增长。同步性的负面影响仍然是超载，因为计算无法并行运行。随着合约和用户数量的增加，无法并行计算成为限制网络发展的主要因素。

现在让我们来了解一下什么是演员模型？演员模型是并行和分布式计算的一种方法，其主要元素是演员--独立的可执行代码块。这种模式最初是为集群计算而开发的，由于其扩展能力、并行性和容错性，被广泛应用于微型服务器架构，以满足现代分布式系统的需求。行为体接收和处理消息，根据消息的逻辑，通过接受本地变化或执行响应操作做出响应，还可以创建其他行为体或继续发送消息。它们是线程安全和可重入的，无需加锁，简化了任务的并行处理。这种模式非常适合构建可扩展和可靠的服务器解决方案，可提供高效的并发访问控制，并支持同步和异步消息传递。

在 TON 中，一切都由智能合约来表示，在演员模型中，智能合约也可称为演员。智能合约是一个对象，具有地址、代码、数据和余额等属性。它能够存储数据，并根据从其他智能合约接收到的指令行事。合约接收到信息并在 TVM 中执行代码进行处理后，可能会出现各种情况：

- 合约更改其属性 `code, data, balance`
- 合约可选择生成一条发送信息
- 合约进入待机模式，直至发生以下事件

脚本的结果总是创建一个事务。  事务本身是异步的，这意味着系统可以在等待过去的事务完成的同时继续处理其他事务。这为处理复杂的事务提供了更大的灵活性。有时，单个事务可能需要按特定顺序执行多个智能合约调用。由于这些调用是异步的，开发人员可以更轻松地设计和实现可能涉及多个并发操作的复杂交易流。来自以太坊的开发者需要认识到，TON 区块链中的智能合约只能通过发送异步消息来相互通信，这意味着如果需要从另一个合约请求数据，并且需要立即响应，这将是不可能的。相反，`get methods` 必须由网络外的客户端调用，就像以太坊中的钱包使用 RPC 节点（如 Infura）来请求智能合约状态一样。这是一个重要的限制，原因有几个。例如，闪贷是必须在单个区块内执行的交易，依赖于在同一交易中借款和还款的能力。这得益于以太坊 EVM 的同步性，但在 TON 中，所有交易的异步性使得执行闪电贷款变得不可行。此外，在 TON 中，为智能合约提供外部数据的 Oracles 还涉及到更复杂的设计过程。关于 Oracles 是什么以及如何在 TON 中使用 Oracles，请参阅 [此处](/v3/documentation/dapps/oracles/about_blockchain_oracles)。

## 钱包的区别

我们已经讨论过，在以太坊中，用户的钱包是根据其地址生成的，地址与公钥之间是 1 对 1 的关系。但在 TON 中，所有钱包都是智能合约，必须由用户自己部署。由于智能合约的配置方式和功能各不相同，因此钱包也有多个版本，你可以[在此](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) 阅读相关内容。由于钱包是智能合约的一种，用户可以拥有多个不同地址和初始参数的钱包。要发送交易，用户必须用自己的私钥签署信息，并将其发送到自己的钱包合约，再由钱包合约转发给特定 DApp 应用程序的智能合约。这种方法大大提高了钱包设计的灵活性，开发者可以在未来添加新版本的钱包。目前，在以太坊中，开发者们正在积极使用 gnosis 等多签名钱包（智能合约），并刚刚开始引入 ERC-4337 等所谓的 "账户抽象"，在这些钱包中，将充斥着诸如在没有原生代币的情况下发送交易、账户丢失后的恢复等功能，但值得注意的是，与以太坊中的 EOA 相比，钱包账户的使用 gas 费要昂贵得多。

## 信息和交易

两个合约之间发生的事情被称为消息--少量代币和任意数据被发送到指定地址。当消息到达合约时，合约代码会对其进行处理，合约会更新其状态，并选择性地发送新消息。合约上的所有这些操作都会被记录为事务。让我们举个例子，我们有一连串的消息，从合约`A`到合约`B`，从合约`B`到合约`C`，那么我们将有两条消息和三个事务。但最初，要改变区块链的状态，你需要一个外部信号。要调用智能合约，你需要发送一条外部消息，这条消息会发送到验证器，然后验证器将其应用到智能合约中。我们在上一小节中已经讨论过，钱包就是一个智能合约，因此外部信息通常会首先发送到钱包的智能合约，钱包会将其记录为第一笔交易，而第一笔交易通常包含实际目标合约的嵌入式信息。钱包智能合约收到消息后，会对其进行处理，并将其传递给目标合约（在我们的例子中，合约 `A` 可以是一个钱包，当它收到外部消息时，就会产生第一笔交易）。一连串的交易构成了一条链。因此，您可以看到每个智能合约都有自己的交易，这意味着每个合约都有自己的 "小区块链"（您可以[在此](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) 阅读更多相关信息），因此网络可以完全独立地处理由此产生的交易。

## Gas 系统的区别

在以太坊中，交易成本以 `gas` 衡量，它反映了交易所需的计算资源数量。`gas` 成本分为协议设定的 `base fee` 和用户为加快验证程序处理交易而增加的 `priority fee`。`total fee` = `units of gas used` \* (`base fee` + `priority fee`)。
此外，以太坊的存储基本上是免费的，这意味着数据一旦存储到区块链上，就不需要支付持续的费用。

在 TON 中，交易费用的计算很复杂，包括几种类型的费用：在区块链中存储智能合约的费用、向区块链导入消息的费用、在虚拟机上执行代码的费用、代码执行后处理操作的费用以及向 TON 区块链外发送消息的费用。gas 价格和其他一些参数可以通过在主网络上投票来改变。与以太坊不同，TON 用户不能自己设定 gas 价格。此外，开发者需要手动将剩余的 gas 资金归还给所有者，否则这些资金将一直被锁定。智能合约存储的使用也会影响价格：如果一个钱包的智能合约长时间未被使用，下一次交易的成本会更高。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func.md
================================================
# Solidity 与 FunC

智能合约开发涉及使用预定义语言，如以太坊的 Solidity 和 TON 的 FunC。
Solidity 是一种面向对象、高级、严格类型的语言，受到 C++、Python 和 JavaScript 的影响，专门用于编写在以太坊区块链平台上执行的智能合约。

FunC 也是一种高级语言，用于在 TON 区块链上对智能合约进行编程，是一种特定领域的、类似 C 语言的静态类型语言。

下文将简要分析这些语言的以下方面，即数据类型、存储、函数、流程控制结构和字典（哈希图）。

## 存储布局

Solidity 提供一种扁平存储模型，这意味着所有状态变量都存储在称为存储空间的单个连续内存块中。存储空间是一个键值存储空间，其中每个键是一个 256 位（32 字节）整数，代表存储槽编号，每个值是存储在该槽中的 256 位字。插槽从 0 开始按顺序编号，每个插槽可存储一个字。Solidity 允许程序员使用存储关键字来定义状态变量，从而指定存储布局。定义变量的顺序决定了它们在存储空间中的位置。

TON 区块链中的永久存储数据以 cell 的形式存储。Cell 在基于堆栈的 TVM 中扮演着存储器的角色。一个 cell 可以转化为一个 slice，然后通过从 slice 中加载 cell 中的数据位和对其他 cell 的引用来获取这些数据位和引用。其他 cell 的数据位和引用可以存储到构建器中，然后将构建器最终转化为新的 cell。

## 数据类型

Solidity 包含以下基本数据类型：

- Signed/Unsigned integers
- Boolean
- Addresses - 用于存储以太坊钱包或智能合约地址，通常约 20 字节。地址类型可以后缀关键字 "payable"，这就限制了它只能存储钱包地址，并使用传输和发送加密功能。
- Byte arrays --用关键字 "字节 "声明，是一个固定大小的数组，用于存储预定义的字节数，最多 32 个，通常与关键字一起声明。
- Literals - 不可更改的值，如地址、有理数和整数、字符串、统一码和十六进制数，可存储在变量中。
- Enums
- Arrays (fixed/dynamic)
- Structs
- Mappings

就 FunC 而言，主要数据类型有

- Integers
- cell  - TON 不透明数据结构的基本结构，包含多达 1 023 个比特和多达 4 个对其他 cell 的引用
- Slice 和 Builder - 用于读取和写入 cell 的特殊对象、
- Continuation --另一种包含可随时执行的 TVM 字节代码的 cell 类型
- Tuples - 是由最多 255 个元件组成的有序集合，具有任意值类型，可能是不同的。
- Tensors - 是一个有序集合，可用于大量赋值，如(int, int) a = (2, 4)。张量类型的一个特例是单位类型 () 。它表示函数不返回任何值，或者没有参数。

目前，FunC 不支持定义自定义类型。

### 另请参见

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## 声明和使用变量

Solidity 是一种静态类型语言，这意味着每个变量的类型必须在声明时指定。

```js
uint test = 1; // Declaring an unsigned variable of integer type
bool isActive = true; // Logical variable
string name = "Alice"; // String variable
```

FunC 是一种更抽象、更面向函数的语言，它支持动态类型和函数式编程风格。

```func
(int x, int y) = (1, 2); // A tuple containing two integer variables
var z = x + y; // Dynamic variable declaration 
```

### 参阅

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## 循环

Solidity 支持 `for`、`while` 和 `do { ... } while` 循环。

如果你想把一件事做 10 次，可以这样做：

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

而 FunC 支持`repeat`、`while`和`do { ... } until`循环。不支持 for 循环。如果想在 Func 上执行与上述示例相同的代码，可以使用 `repeat` 和 `while` 循环。

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

### 另请参见

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## Functions

Solidity 在处理函数声明时，兼顾了清晰性和控制性。在这种编程语言中，每个函数都以关键字 "function "开始，然后是函数名称及其参数。函数的主体用大括号括起来，明确定义了操作范围。此外，返回值用关键字 "returns "表示。Solidity的与众不同之处在于它对函数可见性的分类--函数可以被指定为 `public`, `private`, `internal`, 或 `external`，这就决定了在什么条件下它们可以被合约的其他部分或外部实体访问和调用。下面是一个在 Solidity 语言中设置全局变量 "num "的例子：

```js
function set(uint256 _num) public returns (bool) {
    num = _num;
    return true;
}
```

过渡到 FunC，FunC 程序本质上是函数声明/定义和全局变量声明的列表。FunC 函数声明通常以一个可选声明符开始，然后是返回类型和函数名称。接下来列出参数，最后以一系列指定符结束声明，如 "impure"、"inline/inline_ref "和 "method_id"。这些指定符可以调整函数的可见性、修改合约存储的能力以及内联行为。下面是一个例子，我们在 Func 语言中将存储变量作为 cell 存储到持久化存储中：

```func
() save_data(int num) impure inline {
  set_data(begin_cell()
            .store_uint(num, 32)
           .end_cell()
          );
}
```

### 另请参见

- [函数](/v3/documentation/smart-contracts/func/docs/functions)

## 流程控制结构

Solidity中提供了大多数大括号语言中的控制结构，包括if"、"else"、"while"、"do"、"for"、"break"、"continue"、"return"，以及 C 或 JavaScript 中的常用语义。

FunC 支持经典的 `if-else` 语句，以及 `ifnot`、`repeat`、`while` 和 `do/until` 循环。  此外，自 v0.4.0 起，FunC 还支持`try-catch`语句。

### 另请参见

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## Dictionaries

字典 (哈希表/映射)(hashmap/mapping) 数据结构对 Solidity 和 FunC 合约开发非常重要，因为它允许开发人员在智能合约中有效地存储和检索数据，特别是与特定密钥相关的数据，如用户余额或资产所有权。

Mapping 是 Solidity 中的一个哈希表，以键值对的形式存储数据，其中键可以是任何内置数据类型（不包括引用类型），而数据类型的值可以是任何类型。Mapping 通常用于 Solidity 和以太坊区块链，将唯一的以太坊地址与相应的值类型连接起来。在其他编程语言中，mapping 相当于字典。

在 Solidity 中，映射没有长度，也没有设置键或值的概念。映射只适用于作为存储引用类型的状态变量。当映射被初始化时，它们包括所有可能的键，并映射到字节表示全部为零的值。

与 FunC 中的映射类似的是字典或 TON 哈希表。在 TON 中，哈希表是一种由 cell 树表示的数据结构。哈希表将键映射到任意类型的值，以便快速查找和修改。在 TVM 中，哈希表的抽象表示形式是 Patricia 树或紧凑型二叉树。处理潜在的大型 cell 树会产生一些问题。每次更新操作都会构建相当数量的 cell （每构建一个 cell 耗费 500 个 gas ），这意味着如果不小心使用，这些操作可能会耗尽资源。为避免超出 gas 限制，应限制单个事务中字典更新的次数。此外，一棵包含 `N` 个键值对的二叉树包含 `N-1` 个分叉，这意味着总共至少需要 `2N-1` 个 cell 。智能合约的存储空间仅限于 `65536` 个唯一 cell ，因此字典中的最大条目数为 `32768`，如果存在重复 cell ，则条目数会稍多一些。

### 参阅

- [TON 中的字典](/v3/documentation/smart-contracts/func/docs/dictionaries)

## 智能合约通信

Solidity 和 FunC 提供了与智能合约交互的不同方法。主要区别在于合约之间的调用和交互机制。

Solidity 采用面向对象的方法，合约之间通过方法调用进行交互。这与传统面向对象编程语言中的方法调用类似。

```js
// External contract interface
interface IReceiver {
    function receiveData(uint x) external;
}

contract Sender {
    function sendData(address receiverAddress, uint x) public {
        IReceiver receiver = IReceiver(receiverAddress);
        receiver.receiveData(x);  // Direct call of the contract function
    }
}
```

在 TON 区块链生态系统中使用的 FunC 通过消息来调用智能合约并在智能合约之间进行交互。合约之间不直接调用方法，而是相互发送消息，消息中可包含数据和代码以供执行。

请看这样一个例子：智能合约发送方必须发送包含一个数字的信息，而智能合约接收方必须接收该数字并对其执行一些操作。

首先，智能合约接收方必须说明它将如何接收信息。

```func
() recv_internal(int my_balance, int msg_value, cell in_msg, slice in_msg_body) impure {
    int op = in_msg_body~load_uint(32);
    
    if (op == 1) {
        int num = in_msg_body~load_uint(32);
        ;; do some manipulations
        return ();
    }

    if (op == 2) {
        ;;...
    }
}
```

让我们详细讨论一下目的地合约中接收信息的情况：

1. `recv_internal()` - 在区块链内直接访问合约时执行该函数。例如，当一个合约访问我们的合约时。
2. 该函数接受合约余额、接收到的报文金额、包含原始报文的 cell 以及只存储接收到的报文正文的`in_msg_body`片段。
3. 我们的信息体将存储两个整数。第一个数字是一个 32 位无符号整数 `op`，用于标识要执行的 `操作`，或者要调用的智能合约的 `方法`。可以类比 Solidity，将 `op` 视为函数签名。第二个数字是我们需要执行一些操作的数字。
4. 要读取结果片 `op` 和 `我们的数字`，我们使用 `load_uint()`。
5. 接下来，我们对数字进行操作（本例中省略了这一功能）。

接下来，发送者的智能合约要正确发送信息。这可以通过 `send_raw_message` 来完成，它需要一个序列化的消息作为参数。

```func
int num = 10;
cell msg_body_cell = begin_cell().store_uint(1,32).store_uint(num,32).end_cell();

var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; in the example, we just hardcode the recipient's address
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body_cell)
        .end_cell();

send_raw_message(msg, mode);
```

让我们详细讨论一下智能合约向收件人发送信息的过程：

1. 首先，我们需要创建信息。发送的完整结构可以在 [这里](/v3/documentation/smart-contracts/message-management/sending-messages) 找到。我们不会在这里详细介绍如何组装，你可以在链接中阅读。
2. 邮件正文代表一个 cell 。在 `msg_body_cell` 中，我们要做的是：`begin_cell()` - 为未来的 cell 创建 `Builder`, 第一个 `store_uint` - 将第一个 uint 保存到 `Builder` 中（1 - 这是我们的 `op`）, 第二个 `store_uint` - 将第二个 uint 保存到 `Builder` 中（num - 这是我们要在接收合约中操作的数字）, `end_cell()` - 创建 cell 。
3. 要在信息中附加 `recv_internal` 中的正文，我们需要在信息中使用 `store_ref` 引用所收集的 cell 。
4. 发送信息

这个例子介绍了智能合约如何相互通信。

### 另请参见

- [内部信息](/v3/documentation/smart-contracts/message-management/internal-messages)
- [发送信息](/v3/documentation/smart-contracts/message-management/sending-messages)
- [不可弹回信息](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm.md
================================================
# TVM 与 EVM

以太坊虚拟机（EVM）和 TON 虚拟机（TVM）都是为运行智能合约代码而开发的基于栈的虚拟机。虽然它们有共同的特点，但也有明显的区别。

## 数据介绍

### 以太坊虚拟机 (EVM)

1. 基本数据单位

- EVM 主要在 256 位整数上运行，反映了其围绕以太坊加密功能（如 Keccak-256 散列和椭圆曲线操作）的设计。
- 数据类型主要限于整数和字节，有时也包括这些类型的数组，但所有数据类型都必须符合 256 位处理规则。

2. 状态存储

- 以太坊区块链的整个状态是 256 位地址到 256 位值的映射。这种映射保存在一种名为默克尔帕特里夏字典树（Merkle Patricia Trie，MPT）的数据结构中。
- MPT 使以太坊能够通过加密验证有效地证明区块链状态的一致性和完整性，这对于像以太坊这样的去中心化系统至关重要。

3. 数据结构限制

- 简化为 256 位字限制意味着，EVM 本身并不是为直接处理复杂或自定义数据结构而设计的。
- 开发人员往往需要在智能合约中执行额外的逻辑，以模拟更复杂的数据结构，这可能会导致 gas 成本和复杂性增加。

### TON 虚拟机（TVM）

1. 基于 Cell 的架构

- TVM 使用独特的 "bag of cells" 模型来表示数据。每个 cell 最多可包含 128 个数据字节，最多可有 4 个指向其他 cell 的引用。
- 这种结构允许 TVM 在其存储模型中直接支持任意代数数据类型和更复杂的结构，如树或有向无环图 (DAG)。

2. 灵活性和效率

- cell 模型具有极大的灵活性，使 TVM 能够比 EVM 更自然、更高效地处理各种数据结构。
- 例如，通过 cell 引用创建链接结构的能力允许动态和潜在的无限数据结构，这对于某些类型的应用（如分散式社交网络或复杂的分散式金融（DeFi）协议）至关重要。

3. 复杂数据处理

- 虚拟机架构中固有的管理复杂数据类型的能力减少了智能合约中变通实现的需要，从而有可能降低执行成本并提高执行速度。
- TVM 的设计对于需要复杂状态管理或互联数据结构的应用尤其有利，为开发人员构建复杂、可扩展的去中心化应用提供了坚实的基础。

## 堆栈机

### 以太坊虚拟机 (EVM)

- EVM 以传统的堆栈式机器方式运行，使用后进先出（LIFO）堆栈管理计算。
- 它通过推入和弹出 256 位整数来处理操作，这是堆栈中所有元素的标准大小。

### TON 虚拟机（TVM）

- TVM 也能像基于堆栈的机器一样运行，但有一个关键区别：它同时支持 257 位整数和 cell 引用。
- 这样，TVM 就能将这两种不同类型的数据推入/推出堆栈，提高直接数据操作的灵活性。

### 堆栈操作示例

假设我们想在 EVM 中将两个数字（2 和 2）相加。这个过程包括将数字推入堆栈，然后调用 "ADD "指令。结果（4）将留在堆栈顶部。

我们可以在 TVM 中以同样的方式进行这种操作。不过，让我们看看另一个例子，其中的数据结构更为复杂，例如哈希表和 cell 引用。假设我们有一个存储键值对的哈希表，其中键是整数，值是整数或 cell 引用。假设我们的哈希表包含以下条目：

```js
{
    1: 10
    2: cell_a (which contains 10)
}
```

我们希望将键 1 和键 2 的相关值相加，然后将结果存储在键 3 中。让我们来看看堆栈操作：

1. 将键 1 推入堆栈： `stack` = (1)
2. 为键 1 调用 `DICTGET`（检索与堆栈顶部键相关的值）：检索值 10。`stack` = (10)
3. 将键 2 推入堆栈： `stack` = (10, 2)
4. 为键 2 调用 `DICTGET`: 读取 Cell_A 的引用。`stack` = (10, Cell_A)
5. 从 cell _A 中载入数值：执行一条指令，从 cell 引用中载入数值。`stack` = (10, 10)
6. 调用 `ADD` 指令：执行 `ADD` 指令时，TVM 将从堆栈中取出前两个元素相加，并将结果推回堆栈。在本例中，前两个元素分别是 10 和 10。相加后，堆栈将包含结果： `stack` = (20)
7. 将键 3 推入堆栈： `stack` = (20, 3)
8. 调用 `DICTSET`：存储 20，键值为 3。更新哈希表：

```js
{
    1: 10,
    2: cell_a,
    3: 20
}
```

要在 EVM 中实现同样的功能，我们需要定义一个存储键值对的映射，以及一个直接处理映射中存储的 256 位整数的函数。
必须指出的是，EVM 利用 Solidity 支持复杂的数据结构，但这些结构是建立在 EVM 较简单的数据模型之上的，与 TVM 更富表现力的数据模型有着本质区别

## 算术运算

### 以太坊虚拟机 (EVM)

- 以太坊虚拟机（EVM）使用 256 位整数处理算术运算，这意味着加法、减法、乘法和除法等运算都是根据这种数据大小定制的。

### TON 虚拟机（TVM）

- TON 虚拟机（TVM）支持更多样化的算术运算，包括 64 位、128 位和 256 位整数（无符号和有符号）以及模运算。TVM 进一步增强了其算术功能，如乘法-移位和移位-除法等操作，这些操作对实现定点算术特别有用。这种多样性允许开发人员根据其智能合约的具体要求选择最有效的算术运算，并根据数据大小和类型提供潜在的优化。

## 溢出检查

### 以太坊虚拟机 (EVM)

- 在 EVM 中，虚拟机本身并不执行溢出检查。随着 Solidity 0.8.0 的推出，自动溢出和下溢检查被集成到语言中，以增强安全性。这些检查有助于防止与算术运算相关的常见漏洞，但需要较新版本的 Solidity，因为早期版本需要手动执行这些保护措施。

### TON 虚拟机（TVM）

- 相比之下，TVM 会自动对所有算术运算执行溢出检查，这一功能直接内置在虚拟机中。这种设计选择从本质上降低了错误风险，提高了代码的整体可靠性和安全性，从而简化了智能合约的开发。

## 密码学和散列函数

### 以太坊虚拟机 (EVM)

- EVM 支持以太坊特定的加密方案，如 secp256k1 椭圆曲线和 keccak256 哈希函数。 另外，EVM 没有内置的 Merkle 证明支持，这些证明是用于验证某个元素在集合中的成员身份的加密证明。

### TON 虚拟机（TVM）

- TVM 为预定义曲线（如 Curve25519）提供 256 位椭圆曲线加密（ECC）支持。它还支持某些椭圆曲线的 Weil 配对，这对快速实现 zk-SNARK（零知识证明）非常有用。它还支持 sha256 等常用哈希函数，为加密操作提供了更多选择。此外，TVM 还能与 Merkle 证明一起使用，提供额外的加密功能，这对某些用例（如验证区块中是否包含交易）很有帮助。

## 高级语言

### 以太坊虚拟机 (EVM)

- EVM 主要使用 Solidity 作为其高级语言，这是一种面向对象的静态类型语言，类似于 JavaScript 和 C++。此外，还有其他用于编写以太坊智能合约的语言，如 Vyper、Yul 等。

### TON 虚拟机（TVM）

- TVM 使用 FunC 作为高级语言，用于编写 TON 智能合约。它是一种程序语言，具有静态类型并支持代数数据类型。FunC 可编译为 Fift，而 Fift 又可编译为 TVM 字节码。

## 结语

总之，虽然 EVM 和 TVM 都是基于堆栈的机器，旨在执行智能合约，但 TVM 提供了更大的灵活性，支持更广泛的数据类型和结构，内置溢出检查和高级加密功能。

TVM 支持分片感知智能合约，其独特的数据表示方法使其更适合某些用例和可扩展的区块链网络。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/introduction.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/introduction.mdx
================================================
import Player from '@site/src/components/player'
import Button from '@site/src/components/button'

# 开放网络

**开放网络 The Open Network(TON)** 是一个由多个组成部分构成的去中心化和开放的互联网平台。这些组成部分包括：TON 区块链、TON DNS、TON 存储和 TON 网站。TON 区块链是连接 TON 底层基础设施的核心协议，从而形成更大的 TON 生态系统。

TON 致力于实现广泛的跨链互操作性，同时在高度可扩展的安全框架内运行。TON 的设计用于处理每秒数百万笔交易（TPS），目标是最终达到数亿用户的采用。

**TON 区块链** 被设计为一个分布式超级计算机，或称为“超级服务器”，旨在提供各种产品和服务，以助力新互联网的去中心化愿景的发展。

- 通过查看此部分了解 TON 为其用户提供的服务：[参与 TON](/participate/)
- 通过查看此部分了解 TON 区块链的技术方面 [区块链的区块链](/learn/overviews/ton-blockchain)

## 概览

要理解去中心化互联网的真正愿景以及 TON 如何对此不可避免地做出贡献，请深入学习下面的视频：

<Player url="https://www.youtube.com/watch?v=XgzHmV_nnpY" />

## TON 区块链课程

我们自豪地推出 **TON 区块链课程**，这是一个关于 TON 区块链的全面指南。该课程是为想要学习如何在 TON 区块链上创建智能合约和去中心化应用的开发者设计的。

- [区块链基础知识与 TON](https://stepik.org/course/201294/)（[RU 版本](https://stepik.org/course/202221/)，[CHN 版本](https://stepik.org/course/200976/)）

## TON 区块链课程

查看 TON 课程

它由**9个模块**组成，涵盖了TON区块链、FunC编程语言和TON虚拟机（TVM）的基础知识。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

如果你是区块链的新手，不了解这项技术为何如此革命性 — 考虑深入了解这些重要内容：

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

对于熟悉以太坊开发的人，我们撰写了两篇介绍性文章，帮助你了解 TON 的独特之处：

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## 区块链新手？

如果您是区块链的新手，不了解这项技术的革命性之处，请考虑深入了解这些重要资源：

- [什么是区块链？ 什么是智能合约？ 什么是 gas ？](https://blog.ton.org/what_is_blockchain)
- [区块链如何在荒岛上助您一臂之力](https://talkol.medium.com/why-decentralized-consensus-blockchain-is-good-for-business-5ff263468210)
- [\[YouTube\] Crypto Networks and Why They Matter](https://youtu.be/2wxtiNgXBaU)

## TON 与以太坊的关系

对于熟悉以太坊开发的人，我们撰写了两篇介绍性文章，帮助您了解 TON 在这方面的与众不同之处：

- [TON区块链的六大独特之处，让Solidity开发人员大吃一惊](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers)
- [是时候尝试新事物了：异步智能合约](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)
- [区块链比较](https://ton.org/comparison_of_blockchains.pdf)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison.md
================================================
# 区块链比较

本文件提供了 TON 与以太坊和 Solana 的对比分析。

|               | 以太坊 2.0 (ETH 2.0) | Solana (SOL)        | TON                            |
| ------------- | -------------------------------------------------------------------- | -------------------------------------- | ------------------------------ |
| **Consensus** | Proof of Stake                                                       | Proof of History                       | BFT PoS                        |
| **TPS**       | 100,000 TPS                                                          | 59,400 TPS                             | 104,715 TPS                    |
| **区块时间**      | 12 秒                                                                 | < 1 秒         | 5 秒                            |
| **最终确定区块的时间** | 10-15 分钟                                                             | ~6.4 秒 | < 6 秒 |



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains.md
================================================
# 区块链之链

:::tip
本文档中，“**智能合约**”、“**账户**”和“**Actor**”这几个术语可互换使用，用以描述区块链实体。
:::

## 单一Actor

让我们考虑一个智能合约。

在TON中，它是一个拥有`地址`、`代码`、`数据`、`余额`等属性的_事物_。换句话说，它是一个拥有一定_存储_和_行为_的对象。
行为会遵循以下模式：

- 发生某事（最常见的情况是合约收到一条消息）
- 合约根据自身属性通过在TON虚拟机中执行其`代码`来处理该事件。
- 合约修改自身属性（`代码`、`数据`等）
- 合约可选地生成传出消息
- 合约进入待机模式，直到下一个事件发生

这些步骤的组合被称为一次**交易**。重要的是，事件是依次处理的，因此_交易_是严格有序的，不能相互打断。

这种行为模式众所周知，被称为“Actor”。

### 最低层级：账户链

一系列的_交易_ `Tx1 -> Tx2 -> Tx3 -> ....` 可以被称为一条**链**。在这个例子下，它被称为**账户链 (AccountChain)**，以强调这是单个账户的_交易链_。

现在，由于处理交易的节点时不时需要协调智能合约的状态（达成关于状态的_共识_），这些_交易_被批量处理：
`[Tx1 -> Tx2] -> [Tx3 -> Tx4 -> Tx5] -> [] -> [Tx6]`。
批处理不干预排序，每个交易仍然只有一个“前一交易”和至多一个“下一交易”，但现在这个序列被切割成了**区块**。

将传入和传出消息的队列也包含在_区块_中是有益的。在这样的情况下，一个_区块_将包含决定和描述智能合约在该区块期间所发生的全部信息。

## 账户链的集合：分片链

现在让我们考虑有许多账户的情况。我们得到一些_账户链_并将它们存储在一起，这样的一组_账户链_被称为**分片链 (ShardChain)**。同样地，我们可以将**分片链**切割成**分片区块**，这些区块是个别_账户区块_的聚合。

### 分片链的动态拆分与合并

请注意，由于_分片链_由容易区分的_账户链_组成，我们可以轻松地将其分割。这样，如果我们有1个_分片链_，描述了100万个账户的事件，且每秒交易量过多，无法由一个节点处理和存储，那么我们就将该链分割（或**拆分**）为两个较小的_分片链_，每条链处理50万个账户，每条链在一组独立的节点上处理。

同样地，如果某些分片变得过于空闲，它们可以被**合并**为一个更大的分片。

显然有两个极限情况：分片只包含一个账户（因此无法进一步分割）以及当分片包含所有账户。

账户可以通过发送消息相互交互。这里会有一种特殊的路由机制，将消息从传出队列移动到相应的传入队列，并确保1) 所有消息都将被送达 2) 消息将连续送达（较早发送的消息将更早到达目的地）。

:::info 旁注
为了使分割和合并具有确定性，将账户链聚合成分片是基于账户地址的位表示。例如，地址会看起来像`(分片前缀, 地址)`这种形式。这样，分片链中的所有账户将具有完全相同的二进制前缀（例如所有地址都以`0b00101`开头）。
:::

## 区块链

包含所有账户并按照一套规则运行的所有分片的集合被称为**区块链**。

在TON中，可以有许多套规则，因此允许多个区块链同时运行，并通过发送跨链消息相互交互，就像同链的账户之间的交互一样。

### 工作链：有自己规则的区块链

如果你想自定义一组分片链的规则，你可以创建一个**工作链 (Workchain)**。一个很好的例子是创建一个基于EVM的工作链，在其上运行Solidity智能合约。

理论上，社区中的每个人都可以创建自己的工作链。事实上，构建它是一个相当复杂的任务，在此之前还要支付创建它的（昂贵）费用，并获得验证者的2/3的票数来批准创建你的工作链。

TON允许创建多达`2^32`个工作链，每个工作链则可以细分为多达`2^60`个分片。

如今，在TON中只有2个工作链：主链和基本链。

基本链用于日常交易，因为它相对便宜，而主链对于TON具有至关重要的功能，所以让我们来了解它的作用！

### 主链：区块链之链

网络需要对消息路由和交易执行进行同步。换句话说，网络中的节点需要一种方式来固定多链状态的某个“点”，并就该状态达成共识。在TON中，一个称为\*\*主链 (Masterchain)\*\*的特殊链被用于此目的。_主链_的区块包含有关系统中所有其他链的额外信息（最新的区块哈希），因此任何观察者都可以非常明确地确定单个主链区块时所有多链系统的状态。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage.md
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# 以 Cell 为数据存储

TON 中的所有内容都存储在cell( cell )中。一个cell是一个数据结构，包含：

- 高达 **1023 位** 的数据（不是字节！）
- 高达 **4 个引用** 到其他cell

位和引用不是混合存储的（它们被分开存储）。禁止循环引用：对于任何cell，其后代cell都不能将此原始cell作为引用。

因此，所有cell构成一个有向无环图（DAG）。这里有一个很好的图片来说明：

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/cells-as-data-storage/dag.png?raw=true',
        dark: '/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png?raw=true',
    }}
/>
<br></br>

## Cell 类型

目前，有 5 种类型的cell：*普通* 和 4 种 *另类*。另类类型包括以下内容：

- 裁剪分支cell
- 库引用cell
- Merkle 证明cell
- Merkle 更新cell

:::tip
了解更多有关特殊cell的信息，请参见：[**TVM 白皮书，第 3 节**](https://ton.org/tvm.pdf)。
:::

## Cell 风格

cell是一种为紧凑存储而优化的不透明对象。

特别是，它会去重数据：如果在不同分支中引用了多个等效的子cell，那它们的内容仅存储一次。然而，不透明性意味着无法直接修改或读取cell。因此，还有两种额外的cell风格：

- *Builder* 用于部分构建的cell，可以为其定义用于追加位串、整数、其他cell和引用其他cell的快速操作。
- *Slice* 用于“解剖”cell，表示部分解析的cell的剩余部分或驻留在其中的值（子cell），通过解析指令从中提取。

另一种在 TVM 中使用的特殊cell风格：

- *Continuation* 用于包含 TON 虚拟机的操作码（指令）的cell，请参阅[TVM 概览](/learn/tvm-instructions/tvm-overview)。

## 将数据序列化为 Cell

TON 中的任何对象（消息、消息队列、区块、整个区块链状态、合约代码和数据）都可以序列化为cell。

序列化的过程由 TL-B 方案描述：这是一个正式描述如何将此对象序列化为 *Builder* 或如何从 *Slice* 解析给定类型对象的方案。对于cell的 TL-B 与字节流的 TL 或 ProtoBuf 相同。

如果您想了解有关cell（反）序列化的更多详细信息，可以阅读[ cell (Cell)和 cell 包(Bag of Cells)](/develop/data-formats/cell-boc)文章。

## 参阅

- [TL-B 语言](/develop/data-formats/tl-b-language)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/security-measures.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/security-measures.md
================================================
# 安全审计

TON 区块链生态系统的安全性至关重要。以下是由知名审计公司对 TON 区块链关键部分完成的审计摘要。

## TON 区块链

对核心区块链模块进行了审核，以确保其稳健性和安全性。

**审计公司**：Trail of Bits、SlowMist、CertiK\
**审计报告**：

- [Trail of Bits：TON 区块链审计报告](https://docs.ton.org/audits/TON_Blockchain_ToB.pdf)
- [SlowMist：TON 区块链审计报告](https://docs.ton.org/audits/TON_Blockchain_SlowMist.pdf)
- [CertiK：TON 区块链审计报告](https://docs.ton.org/audits/TON_Blockchain_CertiK.pdf)
- [CertiK：TON 主链合约形式验证](https://docs.ton.org/audits/TON_Blockchain_Formal_Verification_CertiK.pdf)

## TON 区块链库（tonlib）

Zellic 于 2023 年 10 月 16 日至 11 月 17 日对 TON 进行了安全评估。在评估过程中，Zellic 对 Tonlib 的代码进行了审查，以发现安全漏洞、设计问题和安全态势中的总体弱点。

**审计公司**：Zellic\
**审计报告**：

- [Zellic：审计报告](https://docs.ton.org/audits/TON_Blockchain_tonlib_Zellic.pdf)

## TVM 和 Fift

TON 虚拟机和 Fift 编程语言。

**审计公司**：Trail of Bits\
**审计报告**：

- [Trail of Bits Audit Report - TVM & Fift](https://docs.ton.org/audits/TVM_and_Fift_ToB.pdf)

## TVM 升级 2023.07

对 TVM 升级版 2023.07 进行了安全和潜在漏洞分析。

**审计公司**：Trail of Bits\
**审计报告**：

- [Trail of Bits  审计报告 - TVM 升级](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)

---

## 漏洞悬赏计划

为了进一步加强TON生态系统的安全性，我们鼓励安全研究人员和开发人员参与[TON区块链错误赏金计划](https://github.com/ton-blockchain/bug-bounty)。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/sharding.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/sharding.md
================================================
# TON 区块链中的分片

[//]: # "TODO，这来自 gpt"

TON 区块链采用先进的分片机制来提高可扩展性和性能，使其能够高效处理大量交易。
其核心理念是将区块链分割成较小的、独立的片段，称为**分片**。这些分片可以并行处理交易，即使网络在增长，也能确保高吞吐量。

在 TON 中，分片是高度动态的。其他区块链的分片数量是固定的，而 TON 不同，它可以按需创建新的分片。
当交易负载增加时，分片会分裂，当负载减少时，分片会合并。
这种灵活性确保系统能够适应不同的工作量，同时保持效率。

主链扮演着至关重要的角色，它负责维护网络配置以及所有**工作链**和**分片链**的最终状态。
主链负责整体协调，而**工作链**则根据各自的特定规则运行，每个工作链都可以进一步拆分为分片链。
目前，只有一个工作链（**基础链**）在 TON 上运行。

TON效率的核心是**无限分片范式**，它将每个账户视为其自身 "账户链 "的一部分。
然后，这些账户链被聚合成分片链区块，从而促进高效的交易处理。

除了动态创建分片外，TON 还使用了**拆分合并**功能，使网络能够有效地应对不断变化的交易负载。该系统增强了区块链网络内的可扩展性和互动性，体现了 TON 以效率和全球一致性为重点解决常见区块链难题的方法。

## 另请参见

- [深入分片](/v3/documentation/smart-contracts/shards/shards-intro)
- [#无限分片范式](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses.md
================================================
# 智能合约地址

[//]: # "TODO，这是 gpt"

在 TON 区块链上，每个行为者（包括钱包和智能合约）都有一个地址。这些地址对于接收和发送信息和交易至关重要。智能合约地址有两种主要格式：**原始地址**和**用户友好地址**。

## 地址组成

TON 上的每个地址都由两个主要部分组成：

- **工作链 ID(Workchain ID)**：带符号的 32 位整数，表示合约属于哪个工作链（例如，"-1 "表示主链，"0 "表示基础链）。
- **账户 ID(Account ID)**：合约的唯一标识符，主链和底层链的长度一般为 256 位。

## 原始地址与用户友好地址

### 原始地址

**原始地址**只包含基本要素：

- **工作链 ID**（例如，"-1 "表示主链）
- **账户 ID**：256 位唯一标识符

示例：\
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`.

然而，原始地址有两个主要问题：

1. 它们缺乏内置的错误检查功能，这意味着复制错误可能导致资金损失。
2. 它们不支持可反弹/不可反弹选项等附加功能。

### 用户友好的地址

一个**方便用户的地址**通过以下方式解决了这些问题：

1. **Flags**：表示地址是可跳转的（针对合约）还是不可跳转的（针对钱包）。
2. \*\* Checksum\*\*：2 字节错误校验机制 (CRC16)，有助于在发送前检测错误。
3. \*\* Encoding\*\*：使用 base64 或 base64url 将原始地址转换为可读的简洁形式。

例如，同样的原始地址可以转换成用户友好的地址，如\
`kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)

用户友好型地址可防止出错，并允许在交易失败的情况下退回资金，从而使交易更加安全。

## 地址状态

TON 上的每个地址都可以处于以下状态之一：

- **Nonexist**：地址没有数据（所有地址的初始状态）。
- **Uninit**：地址有余额，但没有智能合约代码。
- **Active**：该地址已启用智能合约代码和余额。
- **Frozen**：由于存储费用超过余额，地址被锁定。

## 地址格式之间的转换

要在原始地址和用户友好型地址之间进行转换，可以使用 TON API 或 [ton.org/address](https://ton.org/address) 等开发工具。这些工具可实现无缝转换，并确保在发送交易前格式正确。

有关如何处理这些地址的更多细节，包括编码示例和事务安全性，请参阅 [Addresses Documentation](/v3/documentation/smart-contracts/addresses) 中的完整指南。

## 参阅

- [智能合约地址文档](/v3/documentation/smart-contracts/addresses)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/ton-networking.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/ton-networking.md
================================================
# TON网络

TON使用自己的点对点网络协议。

- **TON区块链使用这些协议**来传播新区块，发送和收集候选交易等。

  虽然单区块链项目（如比特币或以太坊）的网络需求相对容易满足（基本上需要构建一个点对点覆盖网络，然后通过[gossip协议](https://en.wikipedia.org/wiki/Gossip_protocol)传播所有新区块和候选交易），但多区块链项目（如TON）的要求更高（例如，必须能够仅订阅某些分片链的更新，而不一定是全部）。

- **TON生态系统服务（例如TON代理，TON网站，TON存储）运行在这些协议上。**

  一旦为支持TON区块链所需的更复杂的网络协议就位，就会发现它们可以轻松地用于不一定与区块链本身的直接相关的需求，从而为在TON生态系统中创造新服务提供了更多的可能性和灵活性。

## 参阅

- [ADNL 协议](/v3/documentation/network/protocols/adnl/overview)
- [覆盖子网](/v3/documentation/network/protocols/overlay)
- [RLDP 协议](/v3/documentation/network/protocols/rldp)
- [TON DHT 服务](/v3/documentation/network/protocols/dht/ton-dht)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton.mdx
================================================
import Player from '@site/src/components/player'

# TON 中的 Explorers

在这篇文章中，我们将考虑TONExplorers，他们的能力和特点，从开发者的角度出发。

## 什么是 Explorers？

Explorer是一个网站，允许您查看区块链中的信息，如账户余额、交易历史、区块等。

<Player url="https://www.youtube.com/watch?v=i5en19kzX6M" />

## 哪些 Explorers 存在？

在TON Explorers中，您可以区分几个类别：

- 日常使用
- 为开发者提供扩展信息
- 专业化

这种分类大体上是有条件的，一个Explorer可以同时属于几个类别。所以我们不要过多地关注这个。

## Explorers 中的地址别名

通过使用地址别名使您的服务地址更加用户友好。根据提供的指南创建拉取请求（PR）：

- [tonkeeper/ton-assets](https://github.com/tonkeeper/ton-assets) - Tonviewer.com别名
- [catchain/address-book](https://github.com/catchain/address-book)- Tonscan.org别名

## 通用功能

让我们从所有Explorers中都存在的通用功能开始。

几乎所有的Explorers都能查找关于余额、交易历史和智能合约的信息，如果部署在地址上的话。

接下来，我们将考虑几个可以归为这些类别的Explorers。

## TON Scan.org

适合日常使用的好Explorer。它提供了TON区块链的全面视图，允许用户搜索交易、地址、区块等。任何搜索都是针对公共[地址簿](https://github.com/catchain/tonscan/blob/master/src/addrbook.json)（TON基金会，OKX等）进行的。

### 特点

- **适合日常使用**
- 对开发者方便
- TON DNS支持
- 合约类型
- 合约反汇编器

### 链接

- 网址：https://tonscan.org/
- 测试网网址：https://testnet.tonscan.org/

## TON Scan.com

### 特点

- 交易聚合分析
- 交易追踪

### 链接

- 网址：https://tonscan.com/

## Ton 鲸鱼浏览器

这个Explorer比普通用户更倾向于开发者。

### 特点

- **对开发者方便**
- 合约类型
- 合约反汇编器

### 链接

- 网址：https://tonwhales.com/explorer

## Tonviewer 浏览器

这个Explorer是最新的，有自己独特的特点。
例如，追踪。这个功能允许您看到智能合约之间的整个交易序列，即使后续交易不包含您的地址。

交易信息不如TON Whales那样详细。

### 特点

- 对开发者方便
- 适合日常使用
- Jetton交易历史
- **追踪**
- TON DNS支持

### 链接

- 网址：https://tonviewer.com/
- 测试网网址：https://testnet.tonviewer.com/

## TON NFT Explorer

这个Explorer专注于NFT，但也可以作为常规Explorer使用。

查看钱包地址时，您可以找出它存储了哪些NFT，并在查看NFT时，您可以找出元数据、集合地址、所有者和交易历史。

### 特点

- 对开发者方便
- 合约类型
- **专注于NFT**

### 链接

- 网址：https://explorer.tonnft.tools/
- 测试网网址：https://testnet.explorer.tonnft.tools/

## DTON

DTON是另一个面向开发者的Explorer。它以方便的形式提供了大量的交易信息。

此外，它有一个功能，允许您逐步查看交易的 Compute Phase 。

### 特点

- 对开发者方便
- 关于 Compute Phase 的扩展信息
- 合约类型
- 合约反汇编器

### 链接

- 网址：https://dton.io/

## TON NFTscan

这个Explorer专为TON区块链上的非同质化代币（NFT）设计。它允许用户探索、跟踪和验证NFT交易、合约和元数据。

### 特点

- 对普通用户方便
- 对交易者有用的信息，如日交易量
- NFT集合排名

### 链接

- 网址：https://ton.nftscan.com/

## 想在这个列表中吗？

请给其中一个[维护者](/docs/contribute/maintainers.md)写信。

### 参考资料

- [ton.app/explorers](https://ton.app/explorers)
- [非常棒的TON库](https://github.com/ton-community/awesome-ton)
- DeFi 信息

### 链接

- URL: https://www.tonstat.com/

## 想上榜吗？

请写信给其中一位 [维护者](/v3/contribute/maintainers)。

## 参考

- [ton.app/explorers](https://ton.app/explorers)
- [Awesome TON repository](https://github.com/ton-community/awesome-ton)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/nft.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/nft.md
================================================
---
---

# NFT 用例

NFT，或非同质化代币，是一种独特的数字资产，无法被另一种相同的资产替代。本文描述了在TON区块链中已实现的NFT使用案例和方法。

阅读本文后，您将了解为什么NFT有用以及如何在您的项目中使用它们。

## 物品所有权

非同质化代币主要被认为是您可以在OpenSea或[getgems.io](https://getgems.io)等NFT市场上买卖的酷炫图片。

NFT图片和集合很有趣，帮助人们理解基于区块链的所有权概念。然而，从长远来看，NFT的关注点应该超越此，以展示它们的多种潜在用途。

## 支持艺术家

开发NFT的最初动机之一是找到一种支持艺术家的方法，通过购买以NFT集合形式存储在区块链中的他们的作品。

通过这种方式，艺术家可以通过出售新作品以及之后在市场上转售NFT时获得的版税来赚钱。

这是getgems.io或OpenSea等市场成为如今任何区块链基本基础设施的最常见原因之一。

## 将账户作为 NFT

11月，Telegram团队推出了[Fragment](https://fragment.com/)市场，任何人都可以在TON区块链上以NFT的形式购买和出售Telegram用户名或匿名号码。

此外，12月Telegram团队发布了[无SIM卡注册](https://telegram.org/blog/ultimate-privacy-topics-2-0#sign-up-without-a-sim-card)。您可以购买**虚拟电话号码**作为NFT，在Telegram Messenger中注册，确保您的隐私由TON区块链保护。

## 域名作为 NFT

TON DNS服务完全基于链上运作。如果您想在TON支持的去中心化网络中拥有像`mystore.ton`这样的域名，您需要在[DNS市场](https://dns.ton.org/)为您的钱包购买NFT域名，并支付在区块链中存储和处理数据的租赁费。

在Fragment上购买的NFT用户名也可以用于TON DNS，将其绑定到您的钱包，并使用您的username.t.me NFT作为钱包地址。

### NFT 作为您钱包的地址

每个加密领域的人都理解钱包的独特地址，如`Egbt...Ybgx`。

但如果您想从您的妈妈那里接收钱，这对于区块链大规模采用来说是一种无用的方法！

这就是为什么使用`billy.ton`这样的域名支持的钱包对于非加密领域的用户来说效果更好。

[Tonkeeper](https://tonkeeper.com/)钱包已经实现了这种方法。您现在可以去查看。

## 票务作为 NFT

NFT票提供了一种出色的解决方案，用于验证参加音乐会或会议等活动的准入。

拥有NFT票提供了几个独特的优势：

首先，NFT票无法被伪造或复制，消除了假票的欺诈性销售的可能性。这确保了买家可以信任票的真实性和卖家的合法性，让他们对所支付的内容充满信心。

其次，NFT票为收藏打开了令人兴奋的机会。作为NFT票的所有者，您可以将其存储在您的数字钱包中，并拥有来自各种活动的整个票务集合。这为音乐和艺术爱好者创造了一种新的审美和财务满足感。

第三，NFT票提供了便利性和方便性。它们可以使用数字钱包轻松转移，使用户免于亲自接收或发送票的麻烦。与朋友交换票或在二级市场上购买它们的过程变得更简单、更方便。

此外，拥有NFT票可能会带来额外的好处和特殊特权。一些艺术家或组织者可能会提供NFT票持有者独家后台访问权、与艺术家见面会或其他奖励，为NFT票持有者增添独特的文化体验。

## 授权令牌作为 NFT

将NFT用作授权令牌引入了一种革命性的授权访问权和权限的方法。

NFT代币确保了高级别的安全性，不容易被复制或伪造。这消除了未经授权的访问或假认证的风险，提供了可靠的认证。

此外，由于它们的透明性和可追踪性，NFT授权令牌的真实性和所有权可以轻松验证。这使得快速高效的验证成为可能，确保方便地访问各种平台、服务或受限内容。

还值得一提的是，NFT在管理权限方面提供了灵活性和适应性。由于NFT可以以编程方式编码特定的访问规则或属性，它们可以适应不同的授权要求。这种灵活性允许对访问级别进行细致的控制，根据需要授予或撤销权限，这在需要分层访问或临时授权限制的场景中尤为有价值。

目前提供NFT认证的服务之一是[Playmuse](https://playmuse.org/)，这是一个基于TON区块链的媒体服务。该服务旨在吸引Web3音乐家以及其他创作者。

Playmuse NFT的所有者可以进入持有者聊天室。作为这个聊天室的参与者，提供了影响服务发展方向的机会，对各种倡议进行投票，并提前接触到著名创作者的预售和NFT拍卖。

通过Telegram机器人进入聊天室，该机器人会验证用户钱包中是否有Playmuse NFT。

值得注意的是，这只是一个例子，随着TON生态系统的发展，可能会出现新的服务和技术，用于通过NFT进行认证。跟上TON领域的最新发展可以帮助识别其他提供类似认证功能的平台或开源项目。

## NFT 作为游戏中的虚拟资产

集成到游戏中的NFT允许玩家以可验证和安全的方式拥有和交易游戏内物品，这为游戏增添了额外的价值和兴奋感。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps.mdx
================================================
import Player from '@site/src/components/player'

# 钱包应用程序（面向开发者）

## 概述

本文从开发者的角度描述了钱包。最终目标是创建支持TON大规模采用的钱包应用程序。

<br></br>
<Player url="https://www.youtube.com/watch?v=OfW96enpD4Q" />
<br></br>

如果您想找到要安装的钱包，请打开[ton.org/wallets](https://ton.org/wallets)。

## 非托管软件（热）钱包

:::info
软件钱包，通常被称为热钱包，作为主机设备上的软件运行，并在其界面内存储您的私钥。大多数情况下，这些钱包是非托管的，意味着它们让您保管自己的钥匙。
:::

以下是一些TON区块链的非托管钱包：

- [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) — TON生态系统的多平台（iOS、Android、macOS、Linux、Windows）经典钱包，由TON基金会开发。
- [Tonkeeper](https://tonkeeper.com/) — 一个开源的多平台（iOS、Android、Firefox、Chrome）钱包，拥有庞大的用户基础。
- [Tonhub](https://tonhub.com/) — 一个开源（iOS、Android）的手机钱包替代品，具有先进功能（TON Whales Staking UI）。
- [OpenMask](https://www.openmask.app/) — 一个带有生物认证的开源Chrome扩展钱包。
- [MyTonWallet](https://mytonwallet.io/) — 一个开源的浏览器Web钱包和TON的浏览器扩展钱包。

### TON Wallet 

TON Wallet是面向普通用户的大规模采用区块链技术的第一步。它展示了钱包在TON区块链上应如何工作。

|                                                                                                           |
| --------------------------------------------------------------------------------------------------------- |
|               ![TON wallet](/img/docs/wallet-apps/TonWallet.png?raw=true)                                 |

#### 优点和缺点

- ✅ TON基金会开发的原始钱包。TON Wallet根据TON区块链核心开发者的愿景运作。
- ✅ 多平台架构支持。它在Linux、Windows、macOS、iOS、Android上运行，也可以作为Chrome插件使用。
- ✅ [漏洞赏金计划](https://github.com/ton-blockchain/bug-bounty)
- ❌ 很少更新。这个钱包没有所有最新功能（TON DNS地址，和wallet-v4合约不支持）。
- ❌ 当前UI已过时，比其他钱包差。

#### Ton Wallet测试环境

要将TON经典钱包切换到测试环境，您应该在浏览器中打开带有testnet参数的地址：

#### 链接

- [GitHub\*](https://github.com/ton-blockchain/wallet-ios)

  > \*每个支持的操作系统的TON Wallet客户端都放在附近的库中。

### Tonkeeper

[Tonkeeper](https://tonkeeper.com/) - 是最受欢迎的钱包，由Tonkeeper团队开发，并得到用户和开发者的积极支持。

|                                                                                                          |
| -------------------------------------------------------------------------------------------------------- |
|               ![Tonkeeper](/img/docs/wallet-apps/Tonkeeper.png?raw=true)                                 |

#### 优点和缺点

- ✅ 这个应用在用户中最受欢迎。
- ✅ 支持所有最新功能，包括用户钱包之间的原生NFT转移。
- ✅ 支持所有主要平台，如iOS和Android，也在Firefox或Chrome等流行浏览器中运行。
- ❌ 要为其源代码做出贡献需要高级技能。很多工作已经完成，新手很难添加一些重要或有用的东西。

#### Tonkeeper测试环境

##### Tonkeeper 浏览器扩展

1. 进入设置部分，多次点击 Tonkeeper 图标，直到弹出新界面。
2. 切换到 testnet。

现在，您的钱包已进入测试网络模式！

##### Tonkeeper 移动应用程序

1. 转到 "设置 "部分。
2. 向下滚动并多次快速点击 Tonkeeper 图标，直到弹出一个新的设置部分。
3. 在新设置部分的顶部启用开发模式。
4. 返回 Tonkeeper 主屏幕。
5. 点击屏幕上方的钱包名称。
6. 单击新建钱包。
7. 选择 Testnet 账户选项。
8. 输入与主网钱包相同的恢复密码。

[Tonhub](https://tonhub.com/) - 是另一个完整的TON钱包，支持基本的最新功能。Ton Whales正在迅速提升钱包的能力。

#### 链接

- [GitHub](https://github.com/tonkeeper/wallet)
- [Tonkeeper钱包API](https://github.com/tonkeeper/wallet-api)

### Tonhub

[Tonhub](https://tonhub.com/)--是另一个完全成熟的 TON 钱包，支持基本的最新功能。Ton Whales 正在迅速增强钱包的功能。

|                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![Tonhub](/img/docs/wallet-apps/Tonhub.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### 链接

- [GitHub](https://github.com/tonwhales/wallet)
- [Sandbox iOS](https://apps.apple.com/app/ton-development-wallet/id1607857373)
- [Sandbox Android](https://play.google.com/store/apps/details?id=com.tonhub.wallet.testnet)
- ❌ 不支持任何桌面平台。
- ❌需要高级技能来贡献源代码。

#### OpenMask

[OpenMask](https://www.openmask.app/) - 作为浏览器扩展，是一款开创性的工具，使用户在Web3中的交互和体验成为可能。

#### 链接

- [GitHub](https://github.com/tonwhales/wallet)
- [沙盒 iOS](https://apps.apple.com/app/ton-development-wallet/id1607857373)
- [沙盒 Android](https://play.google.com/store/apps/details?id=com.tonhub.wallet)

### OpenMask

[OpenMask](https://www.openmask.app/)--是一款开创性的工具，可作为浏览器扩展，在 Web3 中实现用户互动和体验。

|                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![OpenMask](/img/docs/wallet-apps/OpenMask.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### 链接

- [GitHub](https://github.com/OpenProduct/openmask-extension)
- [文档](https://www.openmask.app/docs/introduction)
- ❌ 目前几乎没有与 dApps 集成。
- ❌ 仅支持浏览器扩展平台。

#### MyTonWallet

[MyTonWallet](https://mytonwallet.io/) - 是TON最功能丰富的Web钱包和浏览器扩展 - 支持代币、NFT、TON DNS、TON站点、TON代理和TON魔法。

#### 链接

- [GitHub](https://github.com/OpenProduct/openmask-extension)
- [文件](https://www.openmask.app/docs/introduction)

### 我的通钱包

[MyTonWallet](https://mytonwallet.io/)--是功能最丰富的 TON 网络钱包和浏览器扩展--支持代币、NFT、TON DNS、TON 站点、TON 代理和 TON Magic。

|                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![MyTonWallet](/img/docs/wallet-apps/MyTonWallet.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### 链接

- [GitHub](https://github.com/mytonwalletorg/mytonwallet)
- [MyTonWallet Telegram](https://t.me/MyTonWalletRu)
- ✅ 支持所有主流平台（如 macOS、Linux 和 Windows），还可作为扩展程序在 Chrome 浏览器中运行。
- ❌ 不能在 Firefox 中作为扩展使用。

#### 非托管硬件（冷）钱包

1. 转到 "设置 "部分。
2. 向下滚动并点击 MyTonWallet 应用程序版本。
3. 在弹出窗口中选择环境。

#### Ledger

- [GitHub](https://github.com/mytonwalletorg/mytonwallet)
- [MyTonWallet Telegram](https://t.me/MyTonWalletRu)

## 链接

:::info
硬件钱包是一种物理设备，在远离互联网的地方存储加密货币资金的私钥。即使您使用它进行交易，钱包也会在离线环境下确认交易。这一过程有助于让您的私钥始终远离互联网风险。
:::

### SafePal

[SafePal](https://www.safepal.com/en/)是您进入快速扩张的去中心化应用程序银河系的门户。

#### 链接

- [SafePal](https://www.safepal.com/en/)官方网站
- [Ledger](https://www.ledger.com/) 官方网站。

### 托管钱包

[SafePal](https://www.safepal.com/en/)是您通向迅速扩展的去中心化应用程序星系的门户。

#### @wallet

- [SafePal](https://www.safepal.com/en/)官方网站

## 托管钱包

:::info
使用托管钱包时，用户信任其他人持有钱包的私钥。
:::

### @wallet

[@wallet](https://t.me/wallet) - 一个在 Telegram 中使用 P2P 发送和接收或交易 TON 以换取真钱的机器人。支持 Telegram Mini App UI。

|                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![wallet](/img/docs/wallet-apps/Wallet.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

### @cryptobot

[@cryptobot](https://t.me/cryptobot) - 用于存储、发送和交换 TON 的 Telegram 机器人钱包。

|                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![CryptoBot](/img/docs/wallet-apps/CryptoBot.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### 第三方集成链接

- [Crypto Pay API](https://help.crypt.bot/crypto-pay-api)

### @tonRocketBot

[@tonRocketBot](https://t.me/tonRocketBot) - 用于存储、发送和交换 TON 的 Telegram 机器人钱包。还支持 Jetton 交易。

|                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![tonrocketbot](/img/docs/wallet-apps/tonrocketbot.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; |

#### 第三方集成链接

- [Rocket exchange](https://trade.ton-rocket.com/api/)
- [Rocket pay docs](https://pay.ton-rocket.com/api/)

## 多签钱包

### 参阅

Tonkey 是一个高级项目，为 TON 区块链引入了多重签名功能。

### 链接

- https://tonkey.app/
- [GitHub](https://github.com/tonkey-app)

## 另请参见

- [什么是区块链？ 什么是智能合约？ 什么是 gas ？](https://blog.ton.org/what-is-blockchain)
- [钱包合约类型](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/educational-resources.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/educational-resources.mdx
================================================
import Button from '@site/src/components/button'

# TON 区块链课程

### 课程

#### 区块链基础知识

本课程介绍区块链基础知识，特别侧重于 TON 生态系统中的实用技能。您将了解区块链的功能及其各种应用。

本课程适合人群：初级开发人员、加密货币新手、IT 行业非技术人员、对区块链感兴趣的人。

<Button href="https://stepik.org/course/201294/promo" 
        colorType={'primary'} sizeType={'sm'}>

查看区块链基础课程

</Button>

<Button href="https://stepik.org/course/200976/promo" 
        colorType={'secondary'} sizeType={'sm'}>

中国

</Button>

<Button href="https://stepik.org/course/202221/promo" 
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

#### TON 和 Telegram 区块链课程

我们隆重推出**TON区块链课程**，这是一本关于TON区块链的综合指南。该课程专为想要学习如何以引人入胜的互动方式在 TON 区块链上创建智能合约和去中心化应用程序的开发人员而设计。

它由**9个模块**组成，涵盖了TON区块链、FunC编程语言和TON虚拟机（TVM）的基础知识。

课程对象：软件工程师、初级-高级开发人员、智能合约架构师

<Button href="https://stepik.org/course/176754/promo" 
        colorType={'primary'} sizeType={'sm'}>

查看 TON 区块链课程

</Button>

<Button href="https://stepik.org/course/201638/promo" 
        colorType={'secondary'} sizeType={'sm'}>

中国

</Button>

<Button href="https://stepik.org/course/201855/promo" 
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## 另请参见

- [TON Hello World](https://helloworld.tonstudio.io/01-wallet/)
- [[YouTube] TON Dev Study EN ](https://www.youtube.com/@TONDevStudy)[[RU]](https://www.youtube.com/results?search_query=tondevstudy)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/glossary.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/glossary.md
================================================
# 词汇表

## 介绍

在这个词汇表中，您可以找到任何与TON和加密相关的词汇

____________

## A

### Airdrop

**Airdrop** — 一种在特定参与者之间免费分发代币的活动。

### Altcoin

**Altcoin** — 所有加密货币，除了比特币以外，都被称为山寨币。

### AMA

**AMA** — 一种在线问答活动，称为“问我任何事”，项目领导回答社区关于产品或服务的问题。

### API

**API** — 应用程序编程接口，一种允许两个程序通过一系列协议进行交互的机制。

### APY

**APY** — 年百分比收益率，用于计算给定资产的年利率。

____________

## B

### Bearish

**Bearish** — 当资产价格由于投资者抛售而下降时使用的术语。（该术语通常用于描述整体市场情绪。）

### Binance

**Binance** — 按日交易量计算的全球最大的加密货币交易所。

### Bitcoin（BTC）

**Bitcoin（BTC）** — 首个具有开源代码的加密货币，也是第一个去中心化网络，为区块链技术的普及奠定了基础。

### Blockchain

**Blockchain** — 一种以区块链形式记录网络上每个事件的数据的分布式账本。

### Bloodbath

**Bloodbath** — 通常用来描述严重且持续的市场崩溃的口头用语，导致价格图表上出现多个深红条。

### BoC

**BoC** —  cell 包。通常在代码中使用。

### BoF

**BoF** — 文件袋。通常在代码中使用。

### Bot

**Bot** — 为两个生态系统编写的程序，例如开放网络和Telegram信使。在Telegram上，机器人是由软件操作的信使中的账户。

### Bridge

**Bridge** — 一种连接各种区块链以在网络之间传输代币和数据的程序。TON桥可以在此链接找到。

### Bullish

**Bullish** — 用于描述价值上升的资产的术语。（“牛市”是市场整体价值增长的相反情况。）

### Burning

**Burning** — 燃烧或从流通和总供应中移除一定数量的代币的行为，通常导致需求增加。

___________

## C

### CEX

**CEX** — 用于交易代币的中心化加密货币交易所。

### CMC

**CMC** — CoinMarketCap，一个密切关注代币价格和市值变化的加密信息聚合器。

### Coinbase

**Coinbase** — 美国最大的加密货币交易所。

### Cryptobot

**Cryptobot** — 用于在Telegram上购买、交易和出售Toncoin和其他加密货币的点对点（P2P）机器人服务，无需进行了解您的客户（KYC）验证。

### Custodial

**Custodial** — 一种加密货币钱包，其中第三方存储加密货币，而不是其真正的所有者。

___________

## D

### DApps

**DApps** — 为由节点组支持的区块链而制作的去中心化应用程序，而不是由中央服务器支持。

### DCA

**DCA** — 定期投资，一种投资策略，投资者以低但固定的价格购买加密资产，以降低风险敞口。

### Decentralization

**Decentralization** — 是TON和其他区块链的主要原则之一。没有去中心化，将无法实现Web3；因此，TON生态系统的每个元素都围绕最大化去中心化展开。

### DeFi

**DeFi** — 是传统金融的去中心化模拟，包括基于智能合约的可访问金融服务和应用程序。

### DEX

**DEX** — 去中心化交易所（DEX），用户可以在没有任何中介的情况下交易加密货币。确保安全交易所需的在线实体是区块链本身。

### Diamond hands

**Diamond hands** — 一个俚语术语，用于描述那些不打算出售其资产的投资者 — 即使市场崩溃或市场熊市。

### DNS

**DNS** — 域名系统，一种允许用户在人类可读的域名（ton.org）和机器可读的IP地址（192.0.2.44）之间进行交易的技术。

### Dolphin

**Dolphin** — 一个资本水平较低但在社区中具有影响力的投资者。

### Donate

**Donate** — 通过Telegram上的机器人服务，人们可以捐款，或内容创作者可以在Telegram上通过Toncoin进行变现。

### Dump

**Dump** — 操纵代币或加密货币价值的增加，然后卖出。

### Durov

**Durov** — Pavel Durov，一位因创办VK社交网络和Telegram信使而闻名的俄罗斯企业家。Nikolai Durov是Pavel的兄弟，参与了VK、Telegram以及TON的开发。

### DYOR

**DYOR** — 做你自己的研究，即在决定投资之前对项目、公司或加密货币进行研究的过程。

___________

## E

### EVM

**EVM** — 以太坊虚拟机，一台表现得像去中心化计算机的机器，它在每个新区块后计算以太坊区块链的状态并执行智能合约。

### Exchange

**Exchange** — 用于交易和使用其他市场工具的场所。

___________

## F

### Farming

**Farming** — 将您的加密货币资产借出以获得奖

### Fiat

**Fiat** - 中央银行或金融当局发行的常规货币。

### FOMO

**FOMO**--"害怕错过"，这是一种心理状态，当一些投资者想到可能会失去某个机会的潜在收益时，就会产生这种心理。它通常出现在牛市期间，以及交易者没有尽职尽责地分析某个项目时。

### Fungible tokens

**Fungible tokens**--在任何特定时刻都与任何其他同类代币具有相同价值的加密货币。

### FUD

**FUD**--"恐惧、不确定性和疑虑"，基于多种因素的市场情绪。

### Full Node

**Full Node** - TON 区块链上的计算机，用于同步和复制整个 TON 区块链。

### FunC

**FunC** - TON 上的智能合约语言。

___________

## G

### Gas

**Gas** - 为区块链上的交易支付的费用。

### GitHub

**GitHub** - 开发人员聚集在一起创建程序基础代码的平台。

___________

## H

### Hackathon

**Hackathon** - 程序员聚集在一起开发软件、程序、应用程序等。

### Hash

**Hash** - 通过哈希算法创建的交易数据信息。

### Hash rate

**Hash rate** - 表明网络上用于加密货币挖矿的计算能力。

### Hold

**Hold** - 保留--即不出售--投资组合中的一项或多项资产。

___________

## I

###

**ICO**--首次代币发行，这是加密项目在早期阶段吸引资金的一种方法。

### IDO

**IDO** - 首次去中心化交易所发行，是在去中心化交易所发行加密货币或代币时吸引资本的另一种方法。

### Inflation

**Inflation** - 一种货币（如美元或欧元）价值下降的过程。 Toncoin （和其他加密货币）的发行具有高度的透明度和可预测性，具有通货紧缩的特性。

___________

## K

### KYC

**KYС** - *Know Your Customer*，用户在创建加密服务账户时验证身份的过程。

___________

## L

### Launchpad

\*\* Launchpad\*\*--一个将投资者和项目聚集在一起的加密初创企业平台。TON生态系统的主要启动平台是Tonstarter。

### Liquidity pool

**Liquidity pool**--将加密资产组合在一起并冻结在智能合约中。流动池可用于去中心化交易、贷款和其他活动。

__________

## M

### Mainnet

**Mainnet** - 区块链的主网络。

### Market cap (capitalization)

**Market cap (capitalization)**--加密货币代币数量总和的总价值。

### Masterchain

**Masterchain** - 在多层区块链中，主链是最重要的。对于 TON 来说，主链是网络的主链。在区块链上进行的操作都是在主链上进行的。

### Metaverse

**Metaverse** - 一个类似电子游戏的数字宇宙，用户在其中创建化身，并与其他人或用户的数字代表互动。

### Moon

**Moon** - 一个加密术语，描述加密资产在价格图表上的垂直轨迹，即迅速增值。

__________

## N

### NFA

**NFA**--非金融建议，这个首字母缩写词被用作免责声明，以避免投资者在与他人讨论加密货币或项目时承担责任或义务。

### NFT

**NFT**--不可篡改的代币，是区块链上独一无二的数字代币，无法复制或铸造多次。

### Nominator

**分母**--向验证者提供资金的人，以便后者能够在 TON 区块链上确认区块。

### Non-custodial

**Non-custodial** - 一种加密钱包，可让所有者/用户完全控制资产。

__________

## O

### Off-ramp

**Off-ramp** - 将加密货币转换为法定货币的方法。

### On-ramp

**On-ramp** - 通过花费法币转换（购买）加密货币的方法。

### Onion routing

**Onion routing** - 一种类似于 TOR 的技术，允许在网络上进行匿名交互。所有信息都经过层层加密，就像洋葱一样。TON Proxy 就采用了这种技术。

__________

## P

### Paper hands

**Paper hands**--倾向于恐慌性抛售的投资者--缺乏经验的投资者。

### Proof-of-stake

**Proof-of-stake**--一种共识机制，用于处理区块链上新区块的交易。

### Proof-of-work

**Proof-of-work** - 一种共识算法，一方向另一方证明已花费了特定数量的计算工作。通过消耗一点能量，一方可以验证这一点。

### Proxy

**Proxy** - 计算机网络上的一种服务，允许客户端安装与其他网络服务的间接网络连接。

### Pump

**Pump** - 人为抬高加密货币或资产的价格。

### P2P

**P2P** - 点对点，用户之间的交易，无需第三方或中介的帮助。

__________

## R

### Roadmap

**Roadmap** - 一个项目的战略计划，显示其产品、服务、更新等的发布时间。

### ROI

**ROI**--投资回报率，从投资中获得的利润。

_________

## S

### SBT

**SBT** - *Soulbound token*，一种永远无法转让的 NFT，因为它包含了其所有者及其成就的信息。

### Scalability

**Scalability**--区块链网络处理复杂交易和大量交易的能力。

### SEC

**SEC** - 证券交易委员会，美国的金融监管机构。

### Shard

**Shard**--一种机制，通过分解成较小的区块链来缓解网络拥堵，从而帮助区块链网络进行扩展--TON 区块链就是这样做的。

### Smart contract

**Smart contract**--自动执行代码，在数学算法的帮助下监督和实现操作，无需人工干预。

### Spot trading

**Spot trading** - 交易金融资产赚钱。

### Stablecoin

**Stablecoin** - 一种价值稳定（通常与法定货币挂钩）且不会崩溃的加密货币。

### Staking

**Staking**--用户通过在押注证明算法中存储硬币或代币赚取被动收入的一种方式，而押注证明算法反过来又能确保区块链顺利运行。为此，他们可以获得奖励作为激励。

### Swap

**Swap** - 两种金融资产的交换，如用 Toncoin 交换 USDT。

________

## T

### TEP

**TEP** - [TON Enhancement Proposals](https://github.com/ton-blockchain/TEPs)，一套与 TON 生态系统各部分交互的标准方法。

### Testnet

**Testnet** - 在主网启动前测试项目或服务的网络。

### Ticker

**Ticker** - 交易所、交易服务或其他 DeFi 解决方案中加密货币、资产或代币的简称 - 例如，TON 表示 Toncoin。

### The Merge

**The Merge**--以太坊从工作量证明向权益证明转换的过渡过程。

### Token

**Token** - 一种数字资产形式；可具有多种功能。

### Tokenomics

**代币经济学** - 一种加密货币（或代币）的经济计划和发行策略。

### To the moon

**To the moon**--这是人们产生 FOMO 时使用的一个俗语。它指的是希望加密货币的价值迅速获得大量增值--因此它的轨迹是奔月。

### Toncoin

**Toncoin** - TON 生态系统的本地加密货币，用于开发服务以及支付费用和服务。它可以买卖和交易。

### Trading

**Trading** - 以盈利为目的买卖加密货币。

### TVL

**TVL**（锁定的总价值）--锁定的总价值表示当前在特定协议中被锁定的资产数量。

### TVM

**TVM**--Ton 虚拟机（Ton Virtual Machine），这是一种行为类似于去中心化计算机的机器，它会在每个新区块之后计算 Ton 区块链的状态，并执行智能合约。

___________

## V

### Validator

**Validator** - 在 TON 区块链上验证新区块的人。

___________

## W

### WAGMI

**WAGMI**--"我们都会成功的"，这是加密货币社区经常使用的一句话，用来表达有朝一日通过投资加密货币致富的愿望。

### Wallet

**Wallet** - 通过购买或出售加密货币和代币所需的私钥系统存储加密货币的软件。它也是 TON 生态系统中用于买卖 Toncoin 的机器人。

### Web3

**Web3**--基于区块链技术的新一代互联网，包括去中心化和代币经济。

### Whale

**Whale** - 拥有大量加密货币和代币的投资者。

### Whitelist

**Whitelist** - 授予人们特殊津贴的名单。

### White paper

**White paper** - 由项目开发人员撰写的项目主要文件。它解释了技术和项目目标。

### Watchlist

**Wаtchlist** - 可定制的加密货币列表，投资者希望跟踪其价格走势。

### Workchain

**Workchain** - 连接到主链的次级链。它们可以包含大量不同的连接链，这些链有自己的共识规则。它们还可以包含地址和交易信息以及智能合约的虚拟机。此外，它们还可以与主链兼容并相互影响。

___________

## Y

### Yield farming

**Yield farming**--在智能合约中出借或放置加密货币或代币，以赚取交易费形式的奖励。

### Yolo

**Yolo**--"你只能活一次"，这是一个俚语缩写，用来号召人们尽情享受生活，而不考虑所做努力的风险。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/auditors.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/auditors.mdx
================================================
import Button from '@site/src/components/button'

# 安全保障提供商(SAP)

:::info
通过以下质量保证提供商测试您的软件。
在 [ton.app/audit](https://ton.app/audit) 上查找更多 TON Ecosystem 审核员。
:::

## 主要 TON 区块链 SAP

- [skynet.certik.com](https://skynet.certik.com/)
- [quantstamp.com](https://quantstamp.com/)
- [softstack.io formerly Chainsulting](https://softstack.io/)
- [slowmist.com](https://slowmist.com/)
- [hexens.io](https://hexens.io/)
- [vidma.io](https://vidma.io/)
- [scalebit](https://www.scalebit.xyz/)

## 添加新的 SAP

- [TON生态系统审计员](https://ton.app/audit)
- [外包开发](/v3/concepts/qa-outsource/outsource)
- [Ton 工作](https://jobs.ton.org/jobs)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/outsource.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/outsource.mdx
================================================
import Button from '@site/src/components/button'

# 外包开发

## 外包团队列表

为您的TON项目发现第三方开发团队

- [Astralyx](#astralyx)
- [Blockczech R&D Lab](#blockczech-rd-lab)
- [Coinvent](#coinvent)
- [Coinvent](#coinvent)
- [softstack](#softstack)
- [softstack](#softstack)

### Astralyx

#### 概要

在TON及其他链开发方面拥有丰富经验的公司。您可以请我们创建设计、Telegram小程序（TMA）、网站等。

#### 工作流

- TON智能合约开发（包括审计和测试）
- Web 2.0 和 Web 3.0 开发
- 设计、艺术、为项目提供租赁线索

#### 项目

- [t.me/xjetswapbot](http://t.me/xjetswapbot)（前端，设计）
- [github.com/astralyxdev/lockup-jettons-contract](http://github.com/astralyxdev/lockup-jettons-contract)（智能合约，Web界面，测试）
- [github.com/astralyxdev/ton-proxy](http://github.com/astralyxdev/ton-proxy)（TON代理扩展，最初的之一）
- [store.devdao.io](http://store.devdao.io)（前端，设计）

#### 联系方式

[astralyx.dev](http://astralyx.dev), contact@astralyx.dev

### Blockczech R&D Lab

#### 概要

Web3.0软件公司及创业工作室，专注于基于区块链的游戏和电子竞技解决方案。

#### 工作流

- dApps
- TMA开发
- 区块链游戏
- 集成
- Telegram机器人

#### 项目

- [TCG.world](http://TCG.world)
- [cryptomeda.tech](http://cryptomeda.tech)
- [liithos.com](http://liithos.com)

#### 联系方式

- http://blockczech.io
- [@blockczech](https://t.me/blockczech)
- Telegram [@salesevacodes](https://t.me/salesevacodes)

### Coinvent

#### 概要

EvaCodes是东欧顶尖的区块链开发公司，团队位于乌克兰、亚美尼亚和波兰。公司拥有50多名熟练的开发人员，已交付60多个web3解决方案，包括web3银行解决方案、L1区块链和web3基础设施。

#### 工作流

- 智能合约
- 加密钱包
- 基于NFT的解决方案

#### 项目

- [Tonraffles Lock模块](https://tonraffles.app/lock)（智能合约，前端）
- [trush.io](https://trush.io/)

#### 联系方式

- [coinvent.dev](https://coinvent.dev)
- [@coinvent_dev](https://t.me/coinvent_dev)
- contact@coinvent.dev

### Coinvent

#### 概要

Coinvent是一个致力于创建成功项目的专业外包开发团队。他们的专长从简单的机器人到复杂的DeFi协议开发。

#### 工作流

- 智能合约
- DeFi，NFT
- dApps，Telegram小程序
- 常规Web2
- Telegram机器人
- 支持 NFT 的解决方案
- 安全代币发行

#### 项目

- [Tonraffles Lock模块](https://tonraffles.app/lock)（智能合约，前端）
- [Tonraffles NFT发行平台](https://tonraffles.app/nft/launchpad)（智能合约）
- [OOIA购物车功能](https://testnet.ooia.art/)（智能合约）
- [Monaki NFT质押](https://www.monaki.life/)（智能合约）
- [Coinlink Finance](https://coinlink.finance)
- [streamsettle.com](https://streamsettle.com/)
- [savage.app](https://savage.app/marketplace)

#### 联系方式

- [coinvent.dev](https://coinvent.dev)
- [@coinvent_dev](https://t.me/coinvent_dev)

### softstack

#### 总结

Softstack 是一家领先的 Web3 综合解决方案服务提供商，自 2017 年起专注于软件开发和智能合约审计。德国制造

#### 工作流

- 智能合约&DApp 开发
- 数字资产钱包
- Telegram 小程序和机器人

#### 项目

- [DeGods](https://degods.com)
- [tixbase](https://tixbase.com)
- [TMRW Foundation](https://tmrw.com)

#### 联系方式

- hello@softstack.io
- [softstack.io](https://softstack.io/)
- Telegram [@yannikheinze](https://t.me/yannikheinze)

### 参阅

#### 总结

Softstack 是一家领先的 Web3 综合解决方案服务提供商，自 2017 年起专注于软件开发和智能合约审计。德国制造

#### 工作流程

- 智能合约和 dApp 开发
- 数字资产钱包
- Telegram 小程序和机器人
- 网络安全(合约审计、渗透测试)

#### 项目

- [DeGods](https://degods.com)
- [tixbase](https://tixbase.com)
- [TMRW Foundation](https://tmrw.com)
- [Bitcoin.com](https://bitcoin.com)
- [Coinlink Finance](https://coinlink.finance)

#### 联系方式

- hello@softstack.io
- [softstack.io](https://softstack.io/)
- Telegram [@yannikheinze](https://t.me/yannikheinze)

## 参阅

如果您已经完全准备好成为TON生态系统的外包代理，您可以通过填写我们的表格或提交拉取请求来推广您的公司。

<Button href="https://hvmauju3.paperform.co/" colorType={'primary'} sizeType={'sm'}>

添加团队

</Button>

<Button href="https://github.com/ton-community/ton-docs/tree/main/docs/v3/concepts/qa-outsource/outsource.mdx"
        colorType="secondary" sizeType={'sm'}>

使用 PR 请求

</Button>

<br></br><br></br>

## 参阅

- [安全保证提供商](/v3/concepts/qa-outsource/auditors)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/README.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/README.md
================================================
# 如何贡献

## 确定贡献领域

有几种方法可以确定你能为 TON 文档贡献的领域：

- 加入 Telegram 中的 [TON 文档社团频道](https://t.me/+c-0fVO4XHQsyOWM8)，从维护者那里获取最新任务。
- 如果你有一个特定的关于贡献的想法，但不确定是否合适，请直接联系[文档维护者](/contribute/maintainers)确认。
- 熟悉 [TON 开发者](https://t.me/tondev_eng) 聊天中最常被问到的问题。
- 请查看 GitHub 库中的[issues](https://github.com/ton-community/ton-docs/issues)。
- 了解文档的可用的[开发奖金](https://github.com/ton-society/ton-footsteps/issues?q=documentation)。

## 简而言之

- 如果你需要在 TON 文档中添加或编辑内容，请针对 `main` 分支创建一个拉取请求。
- 文档团队将审查拉取请求或在需要时联系你。
- 库：https://github.com/ton-community/ton-docs

## 开发

### 在线一键贡献设置

你可以使用 Gitpod（一个免费的、在线的、类似 VS code 的 IDE）来进行贡献。它将一键启动并创建一个工作空间：

[![在 Gitpod 中打开](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ton-community/ton-docs)

### 代码惯例

- **最重要的是**：多多阅读文档。匹配项目的整体风格。这包括格式、文件命名、在代码中命名对象、在文档中命名事物等等。
- **对于文档来说**：编辑文档时，不要在 80 个字符处换行；相反，配置你的编辑器进行软换行。
- **语法**：在创建新提交之前，`cpell` 会自动检查拼写并建议更正错误。请在 `cspell.json` 配置中添加特定的 `words` 以将其纳入验证字典。

总的来说，不用太担心惯例问题；维护者会在审查你的代码时帮你修正它们。

### 拉取请求

你需要通过拉取请求将代码贡献回上游。你已经付出了很多努力，我们很感激。我们会尽力与你合作并审查拉取请求。

提交拉取请求时，请确保以下内容：

1. **保持你的拉取请求小**。较小的拉取请求（大约 300 行差异）更容易审查，也更有可能被合并。确保拉取请求只做一件事，否则就请拆分它。
2. **使用描述性标题**。建议遵循提交消息的惯例。
3. **测试你的更改**。在拉取请求的描述中讲述你的测试计划。

所有拉取请求都应在 `main` 分支上打开。

## 接下来的事情

TON 文档团队将监控拉取请求。请遵循上述指南帮助我们保持拉取请求的一致性。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/contribution-rules.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/contribution-rules.md
================================================
# 贡献手册

在贡献任何 docs.ton.org 页面之前，请审查以下关于常见的和重要的要求，以确保顺利的提交。

## 命名

- 确保正确使用 *THE* 在 TON 文档中至关重要。*TON Blockchain* 和 *TON Ecosystem* 是大写术语，因此，在使用时不需要 *THE*。
- 我们将 *TON* 与普通名词一起写，如果根据英语语法需要 *THE*，我们会使用它。例如："*The* TON Connect *protocol* is a..."

:::info
TON Blockchain...

TON Ecosystem...

The TON Connect protocol...
:::

请在[这里](https://ton.org/en/brand-assets)查看 TON 的品牌资产。

## 文档引用

TON 文档的每个页面应以“参阅”部分结束。在那里放置你认为与当前页面相关的页面，无需额外描述。

:::info

```
## See Also
* [TON Contribution Guidelines](/v3/contribute/contribution-rules)
* [Tutorial Styling Guidelines](/v3/contribute/tutorials/guidelines)
```

:::

## 英文帮助资源

TON 生态系统正在为全世界建设，因此，确保每个人都能理解至关重要。在这里，我们提供对想提高英语技能的初级技术写作人员有帮助的材料。

- [复数名词](https://www.grammarly.com/blog/plural-nouns/)
- [文章：A 与 An](https://owl.purdue.edu/owl/general_writing/grammar/articles_a_versus_an.html)

## 参阅

- [TON 贡献指南](/contribute/contribution-rules)
- [教程样式指南](/contribute/tutorials/guidelines)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
================================================
# 通用文档原则

为了获得最佳的用户体验和清晰度，请在创建 docs.ton.org 上的新内容时，牢记我们旨在应用于所有文档的一般性和重要要求列表。

## 为专业人士制作的文档

文档页面主要是为了文档目的而非作为教程，因此在文本中最小化使用个人示例或类比非常重要。确保内容既适合专业人士也适合非专业人士，同时仍然提供有价值的信息。

## 使用一致的格式

为了使读者更容易浏览文档，使用整个文档中一致的格式非常重要。使用标题、副标题、项目符号列表和编号列表来分隔文本，使其更易于阅读。

## 在特殊部分提供示例

提供示例可以帮助读者更好地理解内容以及如何应用它。如果你正在编写文档页面并需要引用几个示例，请在“参考资料”和“参阅”部分之前创建一个特别的“示例”部分。请不要在文档页面中混合描述和示例。
可以使用代码片段、截图或图表来阐述你的观点，使文档更具吸引力。

## 保持内容更新

由于技术或软件更新可能导致技术文档迅速过时，因此定期审查和更新文档非常重要，以确保它保持准确和与当前软件版本相关。

## 获取反馈

在发布文档之前，最好从其他贡献者或用户那里获取反馈。这可以帮助识别可能令人困惑或不清楚的地方，并允许您在文档发布之前进行改进。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/docs/schemes-guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/docs/schemes-guidelines.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# 图形解释指南

在文档中保持一致性至关重要，为此，已经制定了一个特定的标准，用于可视化智能合约中的流程。

## 图形解释符号

### 消息处理图

为了描述消息处理，建议使用类似于智能合约图的图形表示，包括交易和消息的标签。

如果交易的顺序不重要，可以省略它们的标签。这简化了图表，使其更易于阅读和理解与消息和合约相关的细节。

#### 注释基本图形

| 图形                                                                                                         | 描述            |
| ---------------------------------------------------------------------------------------------------------- | ------------- |
| ![](/img/docs/scheme-templates/message-processing-graphs/circle_for_smart_contract.svg?raw=true)           | 圆形 - 智能合约实体   |
| ![](/img/docs/scheme-templates/message-processing-graphs/rectangle_for_regular_message.svg?raw=true)       | 矩形 - 消息实体     |
| ![](/img/docs/scheme-templates/message-processing-graphs/dashed_rectgl_for_optional_message.svg?raw=true)  | 虚线矩形 - 可选消息实体 |
| ![](/img/docs/scheme-templates/message-processing-graphs/line_for_transaction.svg?raw=true)                | 交易（编号可选）      |
| ![](/img/docs/scheme-templates/message-processing-graphs/person_figure_for_actor.svg?raw=true)             | 参与者           |

- 避免使用大量不同和鲜艳的颜色。
- 使用图形的修改，例如使用虚线边框。
- 为了更好的理解，不同的交易可以用不同的线条样式（实线和虚线）显示。

#### 消息处理示例

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
  }}
/>
<br></br>

可以直接从 Visio 学习参考内容 [message-processing.vsdx](/static/schemes-visio/message-processing.vsdx)。

### 格式和颜色

#### 字体

- 图表中所有文本使用 **Inter** 字体系列。

#### 颜色 - 亮模式

- 铅笔手绘(默认主题)

#### 颜色 - 暗模式

- 字体 `#e3e3e3`
- 背景 `#232328`
- 浅色高亮（箭头和方案边界） `#058dd2`
- 深色高亮（箭头和方案边界） `#0088cc`
- 内部背景（嵌套块） `#333337`

#### 版本控制政策

- 以 SVG 格式设置文档中的图表，以确保在各种设备上的可读性。
- 在项目的 Git 库的 "/static/visio" 目录下存储原始文件，以便将来更容易修改。

### 时序图

在涉及 2-3 个actor之间的复杂和重复的通信方案时，建议使用时序图。对于消息，使用常见同步消息箭头的表示。

#### 示例

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

### 方案参考

- [message-processing.vsdx](/schemes-visio/message_processing.vsdx)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-it-works.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-it-works.md
================================================
# 工作原理

![工作原理](/img/localizationProgramGuideline/localization-program.png)

**TownSquare Labs 本地化系统**由几个关键部分组成。本章将概述该程序的运行方式，帮助您了解其工作原理以及如何有效地使用它。

在这个系统中，我们整合了多个应用程序，使其作为一个统一的整体无缝运行：

- **GitHub**：托管文档，同步上游版本库中的文档，并将翻译同步到特定分支。
- **Crowdin**：管理翻译流程，包括翻译、校对和设置语言首选项。
- **人工智能系统**：利用先进的人工智能协助翻译员，确保工作流程顺畅。
- **自定义词汇表**：为翻译员提供指导，同时确保人工智能根据项目上下文生成准确的译文。此外用户还可根据需要上传自己的词汇表。

:::info
本指南不会详细介绍整个流程，但会重点介绍使 TownSquare Labs 本地化系统独一无二的关键组成部分。您可以自行进一步了解该计划。
:::

## 通过GitHub实现文档和翻译同步

我们的版本库使用多个分支来管理文件和翻译。下面将详细解释每个特殊分支的目的和功能：

### 分支概览

- **`dev`**\
  `dev` 分支运行 GitHub Actions 来处理同步任务，你可以在 [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows) 目录中找到工作流配置。

  - **`sync-fork.yml`**：此工作流程从上游版本库同步文档。每天 00:00 运行。
  - **`sync-translations.yml`**：此工作流程将更新的翻译同步到相应的语言分支，以便在相应的语言网站上进行预览。

- **`main`**\
  这个分支通过在 `dev` 分支上运行的 GitHub Actions 与上游仓库保持同步。它也用于更新我们的打算提交给原始仓库的某些代码。

- **`l10n_main`**\
  这个分支包括了来自 `main` 分支的所有更改和 Crowdin 的翻译，这个分支中的所有修改都会定期通过使用名为 `l10n_main_[some data]` 的新子分支提交到上游仓库。

- \*\*`l10n_feat` 或者 `l10n_feat_[特定函数]**  
  这个分支将包含与翻译系统相关的代码或文档的更改。 一旦所有内容完成后，此分支中的更改将合并为`l10_main\`。

- **`[lang]_preview`**\
  这些分支被指定用于特定语言的预览，例如 `ko_preview` 用于韩语`ja_preview` 用于日语。它们允许我们在不同语言中预览网站。

`dev`分支运行 GitHub Actions 来处理同步任务。你可以在 [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows) 目录中找到工作流配置：

## 如何创建新的 Crowdin 项目

1. 登录您的 [**Crowdin 帐户**](https://accounts.crowdin.com/login)。

2. 点击菜单中的 `Create new project`。
   ![创建新项目](/img/localizationProgramGuideline/howItWorked/create-new-project.png)

3. 设置项目名称和目标语言。您可以稍后在设置中更改语言。
   ![创建项目设置](/img/localizationProgramGuideline/howItWorked/create-project-setting.png)

4. 转到刚刚创建的项目，选择`Integrations`，点击 `Add Integration` 按钮，搜索 `GitHub`，然后安装。
   ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)

5. 在 Crowdin 上配置 GitHub 集成之前，请先指定要上传到 Crowdin 的文件，以免上传不必要的文件：

   1. 在**你的 GitHub 仓库**的根目录下创建一个**crowdin.yml**文件，输入以下基本配置：

   ```yml
   project_id: <Your project id>
   preserve_hierarchy: 1
   files:
     - source: <Path of your original files>
       translation: <Path of your translated files>
   ```

   2. 获取正确的配置值：
      - **project_id**：在您的 Crowdin 项目中，转到 `Tools` 选项卡，选择 API，并在其中找到**project_id**。
        ![select-api-tool](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
        ![projectId](/img/localizationProgramGuideline/howItWorked/projectId.png)
      - **preserve_hierarchy**：是否在 Crowdin 服务器上保持 GitHub 中的目录结构。
      - **source** and **translation**：指定要上传到 Crowdin 的源文件路径(source)和翻译文件(translation)的输出路径。

        请参阅[**我们的官方配置文件**](https://github.com/TownSquareXYZ/ton-docs/blob/localization/crowdin.yml)了解示例。\
        更多详情，请参阅[**Crowdin 配置文件**](https://developer.crowdin.com/configuration-file/)。

6. 配置 Crowdin 以连接到你的 GitHub 仓库：
   1. 单击 `Add Repository` 并选择 `Source and translation files mode`。
      ![选择集成模式](/img/localizationProgramGuideline/howItWorked/select-integration-mode.png)
   2. 连接 GitHub 账户并搜索要翻译的 repo。
      ![search-repo](/img/localizationProgramGuideline/howItWorked/search-repo.png)
   3. 选择左侧的分支，这将生成一个新的分支，Crowdin 将在该分支中发布翻译。
      ![设置分支](/img/localizationProgramGuideline/howItWorked/setting-branch.png)
   4. 选择将翻译更新到 GitHub 分支的频率。其他配置可保留默认设置，然后点击保存启用集成。
      ![频率-保存](/img/localizationProgramGuideline/howItWorked/frequency-save.png)

该分支通过在 `dev` 分支上运行的 GitHub Actions 与上游版本库保持同步。它还用于更新我们打算提交到原始版本库的某些代码。

7. 此外，你可以点击 "立即同步 "按钮，在需要时同步版本库和翻译。

## 术语表

### 4.`[lang]_localization`

这些分支指定用于特定语言的预览，如 "ko_localization "用于韩语，"ja_localization "用于日语。通过它们，我们可以预览不同语言的网站。

通过维护这些分支和使用 GitHub Actions，我们有效地管理了文档和翻译更新的同步，确保我们的多语言内容始终是最新的。

您可以查看我们的 [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) 作为参考。
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

### 如何为新语言设置词汇表？

详情请参考 [**GitHub 集成文档**](https://support.crowdin.com/github-integration/)。

在 DeepL 中，只需上传您的词汇表，它就会在人工智能翻译过程中自动使用。

我们创建了[**词汇表程序**](https://github.com/TownSquareXYZ/ton-i18n-glossary)，可自动上传更新内容。

在术语表中添加术语：

1. 如果词汇表中已有英文术语，请找到要翻译的语言的相应行和列，输入译文并上传。
2. 要上传新的词汇表，请克隆项目并运行：

   - `npm i`
   - `npm run generate --<glossary name you want>`

通过**术语表**，您可以在一个地方创建、存储和管理项目特定术语，确保术语翻译的正确性和一致性。

您可以查看我们的 [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) 作为参考。
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

## 如何为新语言设置词汇表？

大多数翻译平台都支持词汇表。在 Crowdin 中，设置词汇表后，每个术语都会在编辑器中显示为下划线词。将鼠标悬停在术语上，即可查看其翻译、语篇和定义（如果已在词汇表中提供）。
![github-glossary](/img/localizationProgramGuideline/howItWorked/github-glossary.png)
![crowdin-glossary](/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png)

- **增强一致性**：人工智能翻译以最新信息为基础，提供最准确和最新的翻译。
- **速度与效率**：人工智能翻译瞬时完成，可实时处理大量内容。
- **强大的可扩展性**：人工智能系统会不断学习和改进，随着时间的推移提高翻译质量。借助所提供的词汇表，人工智能翻译可根据不同资源库的具体需求进行定制。

我们创建了[**词汇表程序**](https://github.com/TownSquareXYZ/ton-i18n-glossary)，可自动上传更新内容。

1. 在 Crowdin 菜单中选择 `Machine Translation` ，然后点击 DeepL 那一行上的`edit`。
   ![select-deepl](/img/localizationProgramGuideline/howItWorked/select-deepl.png)
2. 启用 DeepL 支持并输入 DeepL Translator API 密钥。
   > [如何获取 DeepL Translator API 密钥](https://www.deepl.com/pro-api?cta=header-pro-api)

![config-crowdin-deepl](/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png)

3. 我们的 DeepL 设置使用定制的词汇表。有关上传词汇表的详细信息，请查阅 [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) 。

4. 在 repo 中，单击 Pre-translation（预翻译）并选择 via Machine Translation（通过机器翻译）。
   ![预翻译](/img/localizationProgramGuideline/howItWorked/pre-translation.png)

5. 选择 DeepL 作为翻译引擎，选择目标语言，并选择要翻译的文件。
   ![预翻译配置](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)

**只需几步我们便完成了所有操作**



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-to-contribute.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-to-contribute.md
================================================
# 如何参与贡献

在我们努力使**TON 成为最成功的区块链**的过程中，使 TON 文档让全世界的人们都理解这一点至关重要。而本地化正是关键，我们很高兴**你**能加入这个旅程，并朝着相同的目标一起努力。

## 预备流程

**TownSquare Labs 本地化系统**向所有人开放！在开始贡献之前，您需要知晓：

1. 登录或注册您的 [**Crowdin**](https://crowdin.com) 账户。
2. 选择您要贡献的语言。
3. 请熟悉[**如何使用 Crowdin**](/contribute/localization-program/how-to-contribute)指南和[**翻译风格指南**](/contribute/localization-program/translation-style-guide)，了解使用技巧和最佳实践。
4. 使用机器翻译辅助工作，但不要完全依赖机器翻译。
5. 所有翻译结果均可在校对一小时后在网站上预览。

## 角色

以下是您在系统中可以担任的**角色**：

- **语言协调员(Language Coordinator)** - 管理指定语言的项目功能。
- **开发人员(Developer)** - 上传文件、编辑可翻译文本、连接集成和使用API。
- **校对员(Proofreader)** - 翻译和批准字符串。
- **翻译员(Translator)** - 翻译字符串并对他人添加的翻译进行投票。

我们的本地化项目托管在 [Crowdin](https://crowdin.com/project/ton-docs) 上。

:::info
Before you start contributing, **read the guidelines below** to ensure standardization and quality, making the review process much faster.

## Side-by-Side Mode

在 Crowdin 编辑器中，所有任务都以**side-by-side**模式执行。要启用此功能，请单击要处理的文件。在页面右上方，点击**Editor view**按钮，选择**side-by-side**模式，以获得更清晰的编辑器视图。\
![并排模式](/img/localizationProgramGuideline/side-by-side.png)
:::

### 语言协调员(Language Coordinator)

- **翻译和批准字符串**
- **预翻译项目内容**
- **管理项目成员和加入请求**
  ![manage-members](/img/localizationProgramGuideline/manage-members.png)
- **生成项目报告**
  ![generate-reports](/img/localizationProgramGuideline/generate-reports.png)
- **创建任务**
  ![create-tasks](/img/localizationProgramGuideline/create-tasks.png)

### 开发人员(Developer)

- **上传文件**
  1. 请复制我们的 [**仓库**](https://github.com/TownSquareXYZ/ton-docs/tree/i18n_feat)
  2. 来到以下文件 [**`src/theme/Footer/config.ts`**](https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.s).
  3. 将变量\*\*`FOOTER_COLUMN_LINKS_EN`\*\* 的值复制到\*\*`FOOTER_COLUMN_LINKS_[YOUR_LANG]`\*\*。
  4. 就如我们在 \*\*`FOTER_COLUMN_LINKS_CN`\*\*中对Mandarin 所做的那样，您也可以将 **`headerLangKey`** 和 **`langKey`** 的键值翻译成您的语言，
  5. 向\*\*`FOOTER_LINKS_TRANSLATIONS`\*\*添加一个新属性：
     - 将 **the key** 设置为您的 [**国际标准组的语言代码**](https://www.andiamo.co.uk/resources/iso-language-codes/) (注意使用**两个英语字母**, **小写**，eg：zh)。
     - **The value** 是您刚刚为您的语言创建的新变量。
  6. 您可以运行命令 **`yarn start:local [YOUR_IOS_LANG_CODE]`** 来预览您的语言的新页脚。\
     (例如\*\*`yarn start:local zh`\*\* 用于预览**汉语** 页脚)
  7. 如果一切看起来都没问题，请在 **`i18n_feat`** 分支上创建一个拉取请求。
- **编辑可翻译文本**
- **连接集成**（例如，添加 GitHub 集成）
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **使用 [Crowdin API](https://developer.crowdin.com/api/v2/)**
- **使用 [Crowdin API](https://developer.crowdin.com/api/v2/)**

### 校对员(Proofreader)

作为**校对员**，您将处理带有**蓝色进度条**的文件。
![proofread step1](/img/localizationProgramGuideline/proofread-step1.png)
点击文件进入编辑界面。

#### 让我们开始贡献吧

1. 确保您处于 [**side-by-side 模式**](#side-by-side-mode)。启用**Not Approved**过滤，查看需要校对的字符串。
   ![校对过滤器](/img/localizationProgramGuideline/proofread-filter.png)

2. 请遵守这些规则：
   - 选择带有**蓝色立方体图标**的字符串。检查每个翻译：
     - 如果**正确**，请单击 ☑️ 按钮。
     - 如果**不正确**，请移至下一行。

![校对通过](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review approved lines:

1. 使用**Approved**过滤选项。

2. 如果已批准的翻译有问题，请单击 ☑️ 按钮将其还原为需要校对的状态。
   :::

3. 要移动到下一个文件，请单击顶部的文件名，从弹出窗口中选择新文件，然后继续校对。
   ![转到下一个](/img/localizationProgramGuideline/redirect-to-next.png)

#### 预览你的成果

所有通过审核的内容都将在一小时内部署到预览网站上。请查看[**我们的仓库**](https://github.com/TownSquareXYZ/ton-docs/pulls)，查看最新 PR 中的**preview**链接。
![预览链接](/img/localizationProgramGuideline/preview-link.png)

### 翻译员(Translator)

作为一名**翻译员**，您的目标是确保翻译忠实且富有表现力，使其尽可能接近原意并易于理解。您的任务是使**蓝色进度条**达到 100%。

#### 开始翻译

请按照以下步骤成功完成翻译过程：

1. 选择尚未达到 100% 翻译的文件。
   ![翻译选择](/img/localizationProgramGuideline/translator-select.png)

2. 确保您处于 [**side-by-side 模式**](#side-by-side-mode)。通过**Untranslated**字符串进行过滤。
   ![翻译过滤器](/img/localizationProgramGuideline/translator-filter.png)

3. 您的工作区有四个部分：
   - **左上：** 根据源字符串输入您的翻译。
   - **左下：** 预览翻译文件。保持原始格式。
   - **右下：** Crowdin 建议的翻译。点击使用，但请核实准确性，尤其是链接。

4. 点击顶部的**Save**按钮保存翻译。
   ![translator save](/img/localizationProgramGuideline/translator-save.png)

5. 要移动到下一个文件，请单击顶部的文件名，然后从弹出窗口中选择新文件。
   ![转到下一个](/img/localizationProgramGuideline/redirect-to-next.png)

## 如何添加对新语言的支持

目前，我们在 Crowdin 中提供了所有需要的语言。如果您是社区管理，请按照以下步骤操作：

1. 在 [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs) 上添加一个名为 `[lang]_localization`（例如，韩语为 `ko_localization`）的新分支。
2. **请联系此仓库的 Vercel 所有者**，将新语言添加到菜单中。
3. 向开发分支创建 PR 请求。**请勿合并到开发分支**；这仅供预览之用。

完成这些步骤后，您就可以在 PR 请求中看到语言的预览。
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

当您的语言准备好在 TON 文档中展示时，请创建一个issue，我们会将您的语言设置到生产环境中。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/overview.md
================================================
# 本地化系统

本地化系统作为一个现代化的协同工作设施，旨在将 TON 相关的各种文档翻译成多种语言，使全球数十亿非英语使用者更容易访问该网站。

## 系统设计理念

![工作原理](/img/localizationProgramGuideline/localization-program.png)

该本地化系统由**TON**最密切的合作伙伴之一[**TownSquare Labs**](https://github.com/TownSquareXYZ)发起**并积极维护**。

我们致力于为多语言社区的合作创建一个开放的基础设施，以**推动 TON 进入一个更好的阶段**，经过不懈的努力我们使其做到了：

- **适用于多语言社区**\
  程序支持多种语言，确保包容性，方便来自不同语言背景的用户使用。

- **自动化开发、集成和部署**\
  通过利用自动化工具，该计划简化了开发、集成和部署流程，减少了人工操作，提高了所有本地化工作的效率和一致性。

- **将开发人员、翻译人员和校验人员的职责分离**\
  我们的方法是将开发人员、翻译人员和校验人员的职责分离，让每个角色专注于各自的特定任务。这确保了高质量的翻译和顺畅的协作，而不会出现职责重叠或冲突。

- **社区贡献奖励**
  我们为在本地化过程中做出贡献的社区成员提供奖励。这既鼓励了积极参与，又奖励了那些帮助改进程序的人，培养了主人翁意识和社区精神。

- **集成先进的人工智能系统**
  先进的人工智能系统通过提供智能建议和自动执行重复性任务，不仅提高翻译准确性和效率，也确保能以更少的工作量获得高质量的结果。

这个项目不仅仅针对单一语言的用户，我们的目标是服务**全球开发者生态**。

## 致谢

我们非常感谢数以千计的社区成员，他们是翻译计划的重要组成部分。我们希望表彰我们的翻译员，并支持他们的职业道路。我们将在不久的将来创建排行榜以表彰我们的顶级翻译员，并创建一个包含翻译计划所有贡献者名单。

## 指南和资源

如果您正在为翻译计划做出贡献或考虑参与其中，请查看以下翻译指南：

- [**翻译风格指南**](/contribute/localization-program/translation-style-guide) - 给翻译人员的说明和提示。
- [**Crowdin 指南**](https://support.crowdin.com/online-editor/) - 关于使用 Crowdin 在线编辑器和 Crowdin 部分高级功能的深入指南。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/translation-style-guide.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/translation-style-guide.md
================================================
# 翻译风格指南

此翻译风格指南包含一些最重要的指南、说明和翻译技巧，帮助我们对网站进行本地化。

本文档是一份一般性指南，并不特定于任何一种语言。

## 理解信息的精髓

当翻译 TON 文档内容时，避免直译。

重要的是翻译要抓住信息的本质。 这可能意味着改写某些短语，或者使用描述性翻译而不是逐字翻译内容。

不同的语言有不同的语法规则、约定和词序。 翻译时，请注意目标语言中句子的结构，避免按字面翻译英文源，因为这会导致句子结构和可读性差。

建议你阅读整个句子并对其进行调整以适应目标语言的惯例，而不是逐字翻译源文本。

## 正式与非正式

我们使用正式的称呼形式，这对所有访客来说始终是礼貌和适当的。

使用正式的称呼可以让我们避免听起来不官方或冒犯，并且无论访客的年龄和性别如何都可以通用。

大多数印欧语和亚非语语言使用特定性别的第二人称人称代词，以区分男性和女性。 在称呼用户或使用所有格代词时，我们可以避免假设访问者的性别，因为正式的称呼形式通常适用且一致，无论他们如何定位自己。

## 简单明了的词汇和意思

我们的目标是让尽可能多的人能够理解网站上的内容。

在大多数情况下，这可以通过使用易于理解的简短单词轻松实现。 如果你的语言中具有相同含义的某个单词有多种可能的翻译，那么最好的选择通常是清楚地反映含义的最短单词。

## 书写系统

所有内容都应使用适合你的语言的正确书写系统进行翻译，并且不应包含使用拉丁字符书写的任何单词。

翻译内容时，应确保翻译内容一致且不包含任何拉丁字符。

**以上规则不适用于通常不应翻译专有名词的语言。**

## 翻译页面元数据

某些页面包含页面上的元数据，例如“title”、“lang”、“description”、“sidebar”等。

在将新页面上传到 Crowdin 时，我们隐藏了翻译人员不应翻译的内容，这意味着 Crowdin 中翻译人员可见的所有元数据都应该被翻译。

翻译源文本为“en”的任何字符串时，请特别注意。 这表示页面可用的语言，应翻译为[你的语言的 ISO 语言代码](https://www.andiamo.co.uk/resources/iso-language-codes/)。 这些字符串应始终使用拉丁字符而不是目标语言原生的书写脚本进行翻译。

如果你不确定要使用哪种语言代码，你可以查看 Crowdin 中的翻译记忆库，或在 Crowdin 在线编辑器的页面 URL 中找到你的语言的语言代码。

使用最广泛的语言的语言代码示例：

- 英文 - en
- 简体中文 - zh-CN
- 俄语 - ru
- 韩语 - ko
- 波兰语 - pl
- 乌克兰语 - uk

## 外部文章标题

一些字符串包含外部文章的标题。 我们的大多数开发人员文档页面都包含指向外部文章的链接，以供进一步阅读。 无论文章的语言如何，都需要翻译包含文章标题的字符串，以确保以他们的语言查看页面的访问者获得更一致的用户体验。

## Crowdin 警告

Crowdin 有一个内置功能，可以在翻译人员即将出错时发出警告。 在保存翻译之前，如果你忘记在译文中加上原文中的标签、翻译了不应翻译的元素、添加了多个连续的空格、忘记结尾标点等，Crowdin 会自动提醒你。 如果你看到这样的警告，请返回并仔细检查建议的翻译。

:::warning
永远不要忽略这些警告，因为它们通常意味着有问题，或者翻译缺少源文本的关键部分。
:::

## 简短与完整形式/缩写

网站上使用了很多缩写，例如 dApp、NFT、DAO、DeFi 等。 这些缩写通常用于英语，并且大多数网站访问者都熟悉它们。

由于它们通常没有其他语言的既定翻译，处理这些和类似术语的最佳方法是提供完整形式的描述性翻译，并在括号中添加英文缩写。

不要翻译这些缩写，因为大多数人不熟悉它们，而且本地化版本对大多数访问者来说没有多大意义。

如何翻译 dApp 的示例：

- Decentralized applications (dapps) → 完整的翻译形式 (括号中为英文缩写)

## 没有既定翻译的术语

某些术语在其他语言中可能没有既定翻译，并且以原始英语术语而广为人知。 这些术语主要包括较新的概念，如工作量证明、权益证明、信标链、质押等。

虽然翻译这些术语听起来不自然，但由于英文版本也常用于其他语言，因此强烈建议将它们翻译。

翻译它们时，请随意发挥创意，使用描述性翻译，或直接按字面翻译。

**大多数术语应该翻译而不是将其中一些保留英文的原因是，随着越来越多的人开始使用TON和相关技术，这种新术语将在未来变得更加普遍。 如果我们想让来自世界各地的更多人加入这个领域，我们需要以尽可能多的语言提供易于理解的术语，即使我们需要自行创建它。**

## 按钮与行动号召

网站包含许多按钮，其翻译方式应与其他内容不同。

可以通过查看上下文屏幕截图、与大多数字符串连接或通过检查编辑器中的上下文（包括短语“button”）来识别按钮文本。

按钮的翻译应尽可能简短，以防止格式不匹配。 此外，按钮翻译应该是必要的，即呈现命令或请求。

## 翻译包容性

TON 文档的访问者来自世界各地和不同的背景。 因此，网站上的语言应该是中立的，欢迎所有人而不是排他性的。

其中一个重要方面是性别中立。 这可以通过使用正式的地址形式并避免在翻译中使用任何特定性别的词来轻松实现。

另一种形式的包容性是，尝试面向全球观众翻译，而不是面向任何国家、种族或地区。

最后，语言应该适合所有大众和年龄段的读者。

## 特定语言的翻译

翻译时，重要的是要遵循你的语言中使用的语法规则、约定和格式，而不是从源复制。 源文本遵循英语语法规则和约定，而这不适用于许多其他语言。

你应该了解你的语言规则并进行相应的翻译。 如果你需要帮助，请与我们联系，我们将帮助你找到一些有关如何在你的语言中使用这些元素的资源。

一些需要特别注意的例子：

### 标点、格式

#### 大写

- 不同语言的大小写存在巨大差异。
- 在英语中，通常将标题和名称、月份和日期、语言名称、假期等中的所有单词大写。 在许多其他语言中，这在语法上是不正确的，因为它们具有不同的大小写规则。
- 一些语言也有关于人称代词、名词和某些形容词大写的规则，这些在英语中是不大写的。

#### 间距

- 正字法规则定义了每种语言的空格使用。 因为到处都使用空格，所以这些规则是最独特的，而空格是最容易误译的元素。
- 英语和其他语言之间的一些常见间距差异：
  - 计量单位和货币前的空格（例如 USD、EUR、kB、MB）
  - 度数符号前的空格（例如°C、℉）
  - 一些标点符号前的空格，尤其是省略号 (...)
  - 斜杠前后的空格 (/)

#### 列表

- 每种语言都有一套多样化和复杂的规则来编写列表。 这些可能与英语有很大不同。
- 在某些语言中，每个新行的第一个单词需要大写，而在其他语言中，新行应该以小写字母开头。 许多语言对列表中的大小写也有不同的规则，具体取决于每行的长度。
- 这同样适用于行项目的标点符号。 列表中的结束标点可以是句点 (.)、逗号 (,) 或分号 (；)具体取决于语言

#### 引号

- 语言使用许多不同的引号。 简单地从源中复制英文引号通常是不正确的。
- 一些最常见的引号类型包括：
  - “示例文本”
  - ‘示例文本’
  - »示例文本«
  - “示例文本”
  - ‘示例文本’
  - «示例文本»

#### 连字符和破折号

- 在英语中，连字符 (-) 用于连接单词或单词的不同部分，而破折号 (-) 用于表示范围或停顿。
- 许多语言对使用连字符和破折号有不同的规则，应遵守这些规则。

### 格式

#### 数字

- 用不同语言书写数字的主要区别在于用于小数和千位的分隔符。 对于千数来说，这可以是句号、逗号或空格。 同样，一些语言使用小数点，而另一些语言使用小数点逗号。
  - 一些大数的例子：
    - 英语 - 1,000.50
    - 西班牙语 - 1.000,50
    - 法语 - 1 000,50
- 翻译数字时的另一个重要考虑因素是百分号。 它可以用不同的方式编写：100%、100 % 或 %100。
- 最后，负数可以不同地显示，具体取决于语言：-100、100-、(100) 或 [100]。

#### 日期

- 在翻译日期时，有许多基于语言的考虑因素和差异。 这些包括日期格式、分隔符、大写和前导零。 全长日期和数字日期之间也存在差异。
  - 不同日期格式的一些示例：
    - 英语（英国）(dd/mm/yyyy) – 1st January, 2022
    - 英语（美国）(mm/dd/yyyy) – January 1st, 2022
    - 中文 (yyyy-mm-dd) – 2022 年 1 月 1 日
    - 法语 (dd/mm/yyyy) – 1er janvier 2022
    - 意大利语 (dd/mm/yyyy) – 1º gennaio 2022
    - 德语 (yyyy/mm/dd) – 1. Januar 2022

#### 货币

- 由于格式、惯例和转换不同，货币转换可能具有挑战性。 作为一般规则，请保持货币与来源相同。 为了读者的利益，你可以在括号中添加你的当地货币和转换。
- 用不同语言书写货币的主要区别包括符号位置、小数逗号与小数点、间距以及缩写与符号。
  - 符号放置：美元 100或 100 美元
  - 小数逗号和。小数点：100,50$ 或 100.50$
  - 间距：100美元或 100 美元
  - 缩写和符号：100$ 或 100 USD

#### 计量单位

- 作为一般规则，请根据来源保留计量单位。 如果你所在的国家/地区使用不同的系统，你可以将转换包括在括号中。
- 除了度量单位的本地化之外，注意语言处理这些单位的方式的差异也很重要。 主要区别在于数字和单位之间的间距，可以根据语言而有所不同。 这方面的示例包括 100kB 与 100 kB 或 50ºF 与 50ºF。

## 结论

翻译时尽量不要着急。 放轻松，玩得开心！

感谢你参与翻译计划并帮助我们让更广泛的受众可以访问网站。 TON社区是全球性的，我们很高兴你也成为其中的一员！



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/maintainers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/maintainers.md
================================================
# 维护者

## 活跃团队

以下是按字母顺序排列的当前 TON 文档团队成员名单。

### Alex Golev

TON 文档维护者和 TON 基金会的 DevRel

- Telegram: [@alexgton](https://t.me/alexgton)
- GitHub: [Reveloper](https://github.com/Reveloper)

### Gusarich

Web3 开发者，[TON 开发社区](https://github.com/ton-community) 的贡献者，[TON Footsteps](https://github.com/ton-society/ton-footsteps) 和 TON 文档的维护者

- Telegram: [@Gusarich](https://t.me/Gusarich)
- GitHub: [Gusarich](https://github.com/Gusarich)

### SwiftAdviser

TON 基金会的开发者入职的管理者

- Telegram: [@SwiftAdviser](https://t.me/SwiftAdviser)
- GitHub: [SwiftAdviser](https://github.com/SwiftAdviser)

## 致谢

TON 文档最初由 [tolya-yanot](https://github.com/tolya-yanot) 和 [EmelyanenkoK](https://github.com/EmelyanenkoK) 创建。

随着时间的推移，TON 文档得益于[众多外部贡献者](https://github.com/ton-community/ton-docs/graphs/contributors)的智慧和奉献。我们向他们每个人表示衷心的感谢。

然而，我们特别要感谢以下贡献者所做的重大贡献。他们极大地丰富了我们文档的质量和深度：

- [akifoq](https://github.com/akifoq): 早期贡献
- [amnch1](https://github.com/amnch1): 修复
- [aSpite](https://github.com/aSpite): 内容
- [awesome-doge](https://github.com/awesome-doge): 早期贡献
- [coalus](https://github.com/coalus): 内容
- [delovoyhomie](https://github.com/delovoyhomie): 内容
- [krau5](https://github.com/krau5): 改进
- [LevZed](https://github.com/LevZed): 内容
- [ProgramCrafter](https://github.com/ProgramCrafter): 内容
- [siandreev](https://github.com/siandreev): 内容
- [SpyCheese](https://github.com/SpyCheese): 早期贡献
- [Tal Kol](https://github.com/talkol): 早期贡献
- [TrueCarry](https://github.com/TrueCarry): 内容
- [xssnick](https://github.com/xssnick): 内容

我们真诚地感谢每一位贡献者，感谢他们使 TON 文档成为一个丰富可靠的平台资源。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/participate.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/participate.md
================================================
# 贡献指南

这是用 TON 文档撰写教程的逐步指南。

:::tip 机会
很幸运！这是一个改善 TON 生态系统的好机会。
:::

如果你决定编写教程，你可以因杰出的贡献而获得奖励：

- **Special TON Footsteps NFT: 对 TON 最有价值的贡献**
- **TON 奖励: 作为报酬提供给被批准的高质量的贡献（如教程）**

让我们看看你如何参与贡献过程。

## 决定你想写什么

找到或编写你想描述的材料。

1. 检查带有 `tutorial` 标签的 [TON Docs GitHub 上的问题列表](https://github.com/ton-community/ton-docs/issues)。
2. *或者* 在 TON Docs GitHub 上用 [教程模板](https://github.com/ton-community/ton-docs/issues/new?assignees=\\&labels=feature+%3Asparkles%3A%2Ccontent+%3Afountain_pen%3A\\&template=suggest_tutorial.yaml\\&title=Suggest+a+tutorial)写下你自己的想法。

## 描述问题以获得奖励

编写 *ton-footstep* 来获得你的贡献资金。

1. 更详细地了解 [TON Footsteps](https://github.com/ton-society/ton-footsteps) 计划。
   1. **简而言之**：使用 [“探索者”封面文章](https://github.com/ton-society/ton-footsteps/issues/61) 作为示例。
2. 编写[你自己的footstep](https://github.com/ton-society/ton-footsteps/issues/new/choose)来参与并等待批准。
3. 在收到 `approved` 标签后开始编写你的教程。

## 编写教程

**准备工作**。尽量减少将来被要求更改的次数，从而_节省你的时间_：

1. 遵循 [教程指南](/contribute/guidelines) 并使用 [示例教程结构](/contribute/sample-tutorial) 来检查。
2. 阅读 [优秀教程原则](/contribute/principles-of-a-good-tutorial) 来编写出色的教程 :)
3. 可以从源代码中以 [铸造你的第一个 Jetton](/develop/dapps/tutorials/jetton-minter) 作为示例来找到灵感。
4. **设置环境**。[检查教程](/contribute#online-one-click-contribution-setup) 是在本地或使用 Gitpod 运行你的 fork。
5. **编写教程**。用到相应的环境，查看教程在你的 fork 上的样子。
6. **发起 Pull Request**。打开 PR 以获取维护者的反馈。
7. 合并！

## 收到奖励

1. 在 TON Docs中的 PR 合并后，请在你的 ton-footsteps 任务中进行记录。
2. 遵循指南 [如何完成 ton-footstep？](https://github.com/ton-society/ton-footsteps#how-to-complete-something-from-the-list) 完成footstep并获得奖励。
3. 在你的任务中，你将被要求提供一个钱包，从而可以给你发送奖励。
4. 获得奖励！



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/guidelines.md
================================================
# 教程样式指南

所以你决定为 TON 文档写一个教程？

我们很高兴你成为我们的贡献者之一！请仔细阅读以下指南，以确保您的教程遵循 TON 文档现有内容的样式和质量。

重要的是，您需要花些时间熟悉教程结构和如何使用标题。在提交自己的教程之前，请阅读我们的一些现有教程，并查看 [以前的拉取请求](https://github.com/ton-community/ton-docs/pulls?q=is%3Apr+is%3Aclosed)。

## 流程

:::info 重要
在你开始写作之前，*请阅读下面的指南*！它们将帮助你确保达到标准化和质量水平，这将使审查过程更加迅速。
:::

另外，请参考我们提供的[**示例教程结构**](/contribute/tutorials/sample-tutorial)。

1. 首先，在 GitHub 上分叉然后克隆 [ton-docs](https://github.com/ton-community/ton-docs/) 的库，并在您的本地代码库中创建一个新分支。
2. 书写您的教程时，请牢记质量和可读性！可以查看现有教程以明确您的目标。
3. 当准备好提交审查时，[发起一个拉取请求](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)。我们将收到通知，并开始审查过程：
   1. **请尽一切努力提交您的教程的最终稿**。一些打字错误和语法修正是可以接受的，但如果在我们能够发布教程之前需要进行重大更改，审查和要求您进行必要更改的过程将会花费更多时间。
4. 审查完您的提交后，并且您完成所有必要的更改后，我们将合并拉取请求并在 TON 文档上发布教程。此后不久，我们将与您联系安排付款！
5. 发布后，记得在社交媒体上**推广**您的教程！[文档维护者](/contribute/maintainers)可以帮助扩大这种推广，只要您与我们合作。

总而言之，工作流程如下：

1. ***分叉并克隆*** **`ton-docs`** 代码库
2. ***编写并润色*** 您的教程
3. ***提交拉取请求*** 进行审查
4. ***进行其他必要的更改***
5. 教程 ***合并并发布***
6. ***在社交媒体上推广您的教程***！

## 背景

在 "TON" 前加上 "THE" 的主要问题是，在开发 TON 文档和政策编辑期间，市场营销、供应商和开发人员等多个部门加入了讨论，以大写 "Blockchain"、"Ecosystem" 等词汇与 "TON" 结合使用，以创建一个单一系统、网络和品牌的强大形象。经过长时间的讨论，我们得出结论，为了推出强大的品牌形象，我们应该创建一个词汇和短语表，可以不使用 "THE" 并大写书写。如果可以大写，就不需要冠词。目前有两个这样的词组：TON Blockchain 和 TON Ecosystem。

对于其他 TON 模块名称，如 TON Connect、TON SDK、TON Grants等，取决于上下文。我们应用大写规则，但对于冠词规则则较为灵活。如果组件名称单独存在，最好不用冠词。然而，如果它与普通名词结合，如 TON Connect protocol，则需要冠词，因为它指的是实体协议。

至于其他词组，如 "TON + 名词"（例如，"the TON world"、"the TON community" 等），我们不限制使用冠词，因为我们期望能看到这样的一个结合。

## 一般提示

- **不要复制粘贴现有内容**。剽窃是一个严重的问题，我们不会容忍。如果教程受到现有内容的启发，请给出参照并链接到它。链接到其他教程/资源时，请尽可能使用 TON 文档的资源。
- **在 PR 中包含演示视频或视频内容**，方法是上传到 Google Drive。
- **必须清楚地解释如何从水龙头获得账户资金**，包括哪个账户能拿到资金，从哪里，以及为什么。不要假设学习者可以自行完成这项任务！
- **显示示例输出**，以终端片段或屏幕截图的形式，以帮助学习者了解预期效果。记得要修剪长输出。
- **采取错误驱动的方法**，故意遇到错误，教学习者如何调试。例如，如果您需要注资一个账户才能部署合约，请先尝试在不资助的情况下部署，观察返回的错误，然后修复错误（通过注资账户）并再次尝试。
- **添加潜在的错误和故障排除**。当然，教程不应列出所有可能的错误，但应努力捕捉重要的或最常见的错误。
- **使用 React 或 Vue** 进行客户端开发。
- **在提交 PR 之前，首先自行运行代码**，以避免其他明显的错误，并确保其按预期工作。
- **避免在教程之间包含对不同来源的外部/交叉链接**。如果您的教程较长，我们可以讨论如何将其变成更长的课程或路径。
- **提供图片或截图** 来说明复杂过程，如有需要。
- 将您的图片上传到 learn-tutorials 库的 `static` 目录——**不要** 使用外部网站的热链接，因为这可能导致图片损坏。
- **图片链接必须以 markdown 格式呈现**，您 **只能** 使用库中 `static` 目录的原始 GitHub URL：`![您图片的名称](https://raw.githubusercontent.com/ton-community/ton-docs/main/static/img/tutorials/<您图片的文件名>.png?raw=true)`
  - 记住在 URL 的末尾添加 `?raw=true`。

## 如何构建您的教程

:::info 示例教程结构
您可以随时查看[示例教程结构](/contribute/tutorials/sample-tutorial)进行了解。
:::

- **标题** 应该直接明了，概括教程的目标。不要在文档内以标题形式添加教程标题；而应使用 markdown 文档文件名。
  - *例如*：如果您的教程标题为"*Step by step guide for writing your first smart contract in FunC*"，文件名应为：\
    `step-by-step-guide-for-writing-your-first-smart-contract-in-func.md`
- 包含一个**简介**部分，用来解释*为什么*这个教程很重要，以及教程的背景是什么。不要假设这是显而易见的。
- 包含一个**必要条件**部分，用来解释任何要求*预先掌握的知识*或需要首先完成的其他现有教程，其他所需的代币等。
- 包含一个**要求**部分，用来解释在开始教程之前必须安装的任何*技术程序*，以及教程不会涵盖的内容，如 TON 钱包扩展、Node.js 等。不要列出教程中将安装的包。
- 使用**子标题**（H2: ##）来分构教程正文。使用子标题时要记住目录，并尽量保持重点。
  - 如果子标题下的内容很短（例如，只有一个段落和一个代码块），考虑使用加粗文本而不是子标题。
- 包含一个**结论**部分，总结所学内容，强化关键点，同时也为学习者完成教程表示祝贺。
- （***可选***）包含一个**接下来**部分，指向后续教程或其他资源（项目、文章等）。
- （***可选***）在最后包含一个**关于作者**部分。您的简介应包括您的 GitHub 个人资料链接（将包含您的姓名、网站等）和您的 Telegram 个人资料链接（以便用户可以联系/标记您，从而获得帮助和提问题）。
- 如果您在编写此教程时参考了其他文档、GitHub 库或其他教程，**必须** 存在一个**参考资料**部分。可实现的话，就通过添加他们的名称和文档链接来致谢（如果不是数字文档，请包括 ISBN 或其他参考方式）。

## 样式指南

- **写作措辞 -** 教程由社区贡献者为他们的同行撰写。
  - 鉴于此，我们建议在整个教程中创造一种包容和互动的语调。使用“我们”、“我们的”这样的词语。
    - *例如*："我们已经成功部署了我们的合约。"
  - 提供直接指导时，可以自由使用“你”、“你的”等。
    - *例如*："*你的文件应该看起来像这样：*"

- **在您的教程中正确使用 Markdown**。参考 [GitHub 的 markdown 指南](https://guides.github.com/features/mastering-markdown/) 以及 [示例教程结构](/contribute/tutorials/sample-tutorial)。

- **不要使用预格式化文本进行强调**，*例如*：
  - ❌ "TON 计数器 `智能合约` 名为 `counter.fc`" 是不正确的。
  - ✅ "TON 计数器 **智能合约** 名为 `counter.fc`" 是正确的。

- **不要在节标题中使用任何 markdown 格式**，*例如*：
  - ❌ # **简介** 是不正确的。
  - ✅ # 简介 是正确的。

- **解释你的代码！** 不要只让学习者盲目地复制和粘贴。
  - 函数名称、变量和常量 **必须** 在整个文档中保持一致。
  - 使用代码块开头的注释来显示代码所在的路径和文件名。*例如*：

    ```jsx
    // test-application/src/filename.jsx

    import { useEffect, useState } from 'react';

    ...
    ```

- **选择合适的语言** 用于代码块语法高亮！
  - 所有代码块 *必须* 有语法高亮。如果您不确定要应用哪种类型的语法高亮，请使用 **\`\`\\`text**。

- **不要将代码块语法用于预格式化文本**，*例如*：
  - ❌ \`filename.jsx\` 是不正确的。
  - ✅ \`filename.jsx\` 是正确的。

- **您的代码块应该有较好的注释**。注释应该简短（通常是两到三行）且有效。如果您需要更多空间来解释一段代码，请在代码块外进行。

- **记得在所有代码块前后留一个空行**。\
  *例如*：

```jsx
  
// test-application/src/filename.jsx  
  
import { useEffect, useState } from 'react';
  
```

- **使用 linter 和 prettifier** 在将代码粘贴到代码块之前。对于 JavaScript/React，我们推荐使用 `eslint`。对于代码格式化，请使用 `prettier`。
- **避免过度使用项目符号**、编号列表或复杂的文本格式。使用 **粗体** 或 *斜体* 强调是允许的，但应保持最少。

# **应用设置**

- Web3 项目通常会包含几个现有的代码库。编写教程时，请考虑到这一点。在可能的情况下，提供一个 GitHub 库作为学习者入门的起点。
- 如果您*不*使用 GitHub 库来包含教程中使用的代码，请记得向读者解释如何创建文件夹以保持良好的代码组织。
  *例如*：`mkdir example && cd example`
- 如果使用 `npm init` 来初始化项目目录，请解释提示或使用 `-y` 标志。
- 如果使用 `npm install`，请采用 `-save` 标志。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/principles-of-a-good-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/principles-of-a-good-tutorial.md
================================================
# 优秀教程的原则

这些原则最初由 [talkol](https://github.com/talkol) 提出：

- [TON Footstep #7 上的原始评论](https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181)

以下是这些要点的总结，供新贡献者参考。

## 原则

1. 整个流程应在用户的客户端上运行。不应涉及任何第三方服务。你需要做的是让用户可以简单地克隆库并立即运行它。

2. README 应该非常详细。不要假设用户知道任何事情。如果教程需要，它还应该解释如何在你的设备上安装 FunC 编译器或轻客户端。你可以从这个文档中的其他教程复制这些内容。

3. 如果可以，库应该包含用于合约的全部源代码，以便用户可以对标准代码进行小的更改。例如，Jetton 智能合约允许用户尝试自定义行为。

4. 可以的话，尽量创建一个用户友好的界面，允许用户部署或运行项目，而无需下载代码或配置任何东西。请注意，这仍然应该是单独的，并从 GitHub Pages 上获取服务，以便在用户的设备上100%运行客户端。示例：https://minter.ton.org/

5. 向用户解释每个字段选择的含义，并用最佳的例子来进行解释。

6. 解释所有需要了解的关于安全的知识。你必须解释足够多，以便创作者不会犯错误并创建危险的智能合约/机器人/网站——你正在教他们最佳的安全实践。

7. 理想情况下，库应该包含编写好的测试，向读者展示如何在你的教程背景下最好地实现它们。

8. 库应该有易于理解的编译/部署脚本。用户能够只要输入 `npm install` 就能使用它们。

9. 有时一个 GitHub 库就足够了，不需要写一篇完整的文章。只需一个 README，里面包含了库中你需要的所有代码。在这种情况下，代码应该有良好的注释，以便用户可以轻松阅读和理解它。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/sample-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/sample-tutorial.md
================================================
# 示例教程结构

## 简介

简介的标题 **必须** 为 H2: `## 简介`

这一部分是用来解释这个教程的背景和重要性，我们将在本教程中构建和学习什么。

- 像你对五岁小孩解释一样来阐述这一部分 (**[ELI5](https://www.dictionary.com/e/slang/eli5/)**)
- 用最多5-6行来解释这一切。

*例如:*

> 智能合约只是一个在TON区块链上运行的计算机程序，或者更具体地说，在其[TVM](/learn/tvm-instructions/tvm-overview)（*TON虚拟机*）上运行。合约由代码（*编译的TVM指令*）和数据（*持久状态*）组成，这些都存储在TON上的某个地址。

## 必要条件

必要条件标题 **必须** 为 H2: `## 必要条件`

这一部分是用来解释开始本教程前任何需要预先掌握的知识或需要先完成的教程。如果需要任何的代币—要在这里提及。

*例如:*

> 在这个教程中，我们将在测试网上铸造Jetton。在我们继续之前，请确保你的[测试网](/develop/smart-contracts/environment/testnet)钱包有足够的余额。

## 要求

要求标题 **必须** 为 H2: `## 要求`

**可选 :** 如果你的教程有任何视频内容，请在这一部分嵌入。

在开始教程之前需要安装的任何技术程序，以及本教程不会涉及的内容（`TON钱包扩展`、`node`等）。请不要将要安装的程序包在教程中列出。

*例如:*

- 我们需要在本教程中使用TON钱包扩展；可以从[这里](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)安装。
- 确保已安装NodeJS 12.0.1+。

## 教程正文

- 请不要使用“教程正文”作为标题，请使用与材料相关的自己的标题。
  - 如果你想不出别的，使用“开始”也是可以接受的😉
- 添加文本内容来引导读者通过你的教程，并***记得在提交教程之前校对内容***，以避免拼写和语法错误。
  - [Grammarly](http://grammarly.com)是一个可以帮助你避免语法错误的免费程序。

### 关键点

- 不要使用“教程正文”作为标题！

- \*\*保持所有子标题在H3，\*\*不要使用H4或更低。
  - 在Markdown语法中，两个井号用于H2标题: ##
  - 三个井号用于H3标题: ###

- 只在代码块中添加必要的注释。***不要***在终端输入代码块中添加#样式的注释。

- 添加所有相关的代码块：
  - ## Markdown语法的代码块由代码块开始和结束时的三个反引号组成。同时，请确保在所有代码块的反引号前后都有一个新行。*例如*：
    \`js  
    const testVariable = 'some string';  
    someFunctionCall();  
    \`

  - 所有代码块***必须***有语法高亮类型。如果不确定，使用\\`\`\\`text。

  - \\`\`\\`text用于终端输出、终端命令和纯文本。

  - \`javascript *或* `js可用于任何JavaScript代码。

  - \`typescript或`ts可用于任何TypeScript代码。

  - \\`\`\\`jsx用于ReactJS代码。

  - \\`\`\\`cpp用于Func代码。

  - 使用\\`\`\\`graphql突出显示GraphQL语法。

  - 使用\`json突出显示有效的JSON。（对于无效的JSON示例，请使用\`text。）

  - \\`\`\\`bash应*仅*用于需要#样式注释的代码块。这必须小心进行，因为在许多情况下，#字符将呈现为markdown标题。如果发生这种情况，通常目录会受到影响。

- 不要使用`预格式化文本`来强调；而是只使用**粗体**或*斜体*文本。

- 添加图片或代码块以反映预期的终端输出。

- 采取错误驱动的方法来编写你的教程。添加常见错误和故障排除步骤。*例如:*

> **由于执行`node deploy:testnet`命令时出错，无法连接到Testnet。**
>
> 让我们看看一些常见原因：

- 确保你在`.env`中生成的测试网钱包有足够的资金。如果没有，请从水龙头赠送处添加一些测试网代币。
- 如果你仍然遇到同样的问题，请向[Dev Chat](https://t.me/TonDev_eng/)中的开发者求助。

>

## 结论

结论标题 **必须** 为 H2: `## 结论`

这一部分应总结在教程中学到的内容，强调关键点，并祝贺学习者完成教程。使用最多5-6行。
*例如*:

> 我们创建了一个具有计数功能的简单新FunC合约。然后我们在链上构建并部署它，最后通过调用getter和发送消息与它进行交互。

请记住，这段代码不适用于生产；如果你想将其部署到主网，还有一些其他事项需要考虑，例如，如果代币在市场上挂牌，就禁用转移的方法等等。

>

## 参阅

下一步标题 **必须** 为 H2: `## 参阅`

使用这一部分来解释完成本教程后接下来可以做什么以继续学习。可以添加与本教程相关的推荐项目和文章。如果你正在进行任何其他高级教程，可以在这里简要提及。通常，只有来自docs.ton.org的相关页面会放在这里。

## 关于作者 *(可选)*

关于作者标题 **必须** 是 H2: `## 关于作者`

保持简短。最多一两行。你可以包括你的GitHub个人资料链接+ Telegram个人资料。请避免在这里添加你的LinkedIn或Twitter。

## 参考资料 *(可选)*

参考资料标题 **必须** 是 H2: `## 参考资料`

如果你在编写本教程时从其他文档、GitHub库或现有教程中获得了任何帮助，则***必须*** 有这一部分。

通过添加它们的名称和文档链接来致敬来源。

如果不是数字文档，请添加ISBN或其他形式的参考。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/compile.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/compile.md
================================================
# 在 TON 上编译和构建智能合约

以下是构建智能合约的库和库列表。

**简而言之:**

- 在大多数情况下，使用Blueprint SDK就足够了。
- 如果您需要更低级别的方法，可以使用ton-compiler或func-js。

## Blueprint

### 概览

TON区块链的开发环境，用于编写、测试和部署智能合约。在[Blueprint git库](https://github.com/ton-community/blueprint)中了解更多信息。

### 安装

在终端运行以下命令以创建一个新项目，并按照屏幕上的指示操作：

```bash
npm create ton@latest
```

&nbsp;

### 特点

- 构建、测试和部署智能合约的简化工作流程
- 使用您最喜欢的钱包（例如Tonkeeper）轻松部署到主网/测试网
- 在一个独立的区块链中快速测试多个智能合约，该区块链在进程中运行

### 技术栈

1. 使用https://github.com/ton-community/func-js编译FunC（无CLI）
2. 使用https://github.com/ton-community/sandbox测试智能合约
3. 使用[TON Connect 2](https://github.com/ton-connect)、[Tonhub wallet](https://tonhub.com/)或`ton://`深链接部署智能合约

### 要求

- [Node.js](https://nodejs.org)的最新版本，如v18，使用`node -v`验证版本
- 支持TypeScript和FunC的IDE，如[Visual Studio Code](https://code.visualstudio.com/)，配备[FunC插件](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

### 如何使用？

- [观看DoraHacks演示，了解使用blueprint的演示](https://www.youtube.com/watch?v=5ROXVM-Fojo)。
- 在[Blueprint库](https://github.com/ton-community/blueprint#create-a-new-project)中阅读详细的说明。

## ton-compiler

### 概览

打包的FunC编译器，用于TON智能合约：

- GitHub：[ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
- NPM：[ton-compiler](https://www.npmjs.com/package/ton-compiler)

### 安装

```bash npm2yarn
npm install ton-compiler
```

### 特点

- 多个FunC编译器版本
- 无需安装和编译TON
- 程序化和CLI接口
- 适用于cell测试

### 如何使用

这个包在项目中添加了`ton-compiler`二进制文件。

FunC编译是一个多阶段过程。其中之一是将Func编译为Fift代码，然后将其编译为二进制表示。Fift编译器已经内置了Asm.fif。

FunC标准库已被捆绑，但可以在运行时禁用。

#### 控制台使用

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debugging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to binary form and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

#### 程序化使用

```javascript
import { compileContract } from "ton-compiler";
let result = await compileContract({ code: 'source code', stdlib: true, version: 'latest' });
if (result.ok) {
  console.log(result.fift); // Compiled Fift assembler
  console.log(result.cell); // Compiled cell Buffer
} else {
  console.warn(result.logs); // Output logs
}
```

## func-js

### 概览

_Cross-platform_绑定TON FunC编译器。

它比ton-compiler更低级，所以只有在ton-compiler不适用时才使用它。

- GitHub：[ton-community/func-js](https://github.com/ton-community/func-js)
- NPM：[@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### 安装

```bash npm2yarn
npm install @ton-community/func-js
```

### 特点

- 无需编译或下载FunC二进制文件
- 在Node.js和**WEB**中都可工作（需要WASM支持）
- 直接编译为带有代码cell的BOC
- 返回汇编版本用于调试目的
- 不依赖文件系统

### 如何使用

在内部，这个包使用了FunC编译器和Fift解释器组合成单个编译为WASM的库。

简单架构：

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

内部库的源代码可以在[这里](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib)找到。

### 使用示例

```javascript
import {compileFunc, compilerVersion} from '@ton-community/func-js';
import {Cell} from 'ton';

async function main() {
    // You can get compiler version 
    let version = await compilerVersion();
    
    let result = await compileFunc({
        // Entry points of your project
        entryPoints: ['main.fc'],
        // Sources
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "main.fc": "<contractCode>",
            // Rest of the files which are included in main.fc if some
        }
    });

    if (result.status === 'error') {
        console.error(result.message)
        return;
    }

    // result.codeBoc contains base64 encoded BOC with code cell 
    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    
    // result.fiftCode contains assembly version of your code (for debug purposes)
    console.log(result.fiftCode)
}
```

请注意，项目中使用的所有FunC源文件内容都应传递给`sources`，包括：

- 入口点
- stdlib.fc（如果您使用它）
- 所有包含在入口点中的文件

### 经TON社区验证

- [ton-community/ton-compiler](/develop/smart-contracts/sdk/javascript#ton-compiler) — 用于TON智能合约的现成FunC编译器。
- [ton-community/func-js](/develop/smart-contracts/sdk/javascript#func-js) — TON FunC编译器的跨平台绑定。

### 第三方贡献者

- [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) — TON FunC智能合约编译器。
- [Termina1/tonc](https://github.com/Termina1/tonc) — TONC（TON编译器）。使用WASM，非常适合Linux。

## 其他

- [disintar/toncli](https://github.com/disintar/toncli) — 最受欢迎的方法之一。您甚至可以在Docker中使用它。
- [tonthemoon/ton](https://github.com/tonthemoon/ton) — _(封闭测试)_一行TON二进制安装程序。
- [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) — 包和CLI，根据TL-B方案生成操作码。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/README.mdx
================================================
import Button from '@site/src/components/button'

# 什么是Hacktoberfest?

<div style={{ textAlign: 'center', margin: '50px 0' }}>
  <img alt="tlb structure"
       src="/docs/img/docs/hacktoberfest.webp"
       width="100%" />
</div>

[Hacktoberfest](https://hacktoberfest.digitalocean.com/) 是一个为期一个月的庆祝活动，旨在为_开源项目_、它们的_维护者_以及整个_贡献者_社区提供庆祝活动。每年10月，开源维护者会给予新贡献者额外的关注，指导开发者完成他们的第一个拉取请求。

对于TON社区来说，这是一个共同帮助生态系统成长的时刻，所以让我们加入我们的 **Hack-TON-berfest** 派对，成为_全年第一开源生态系统_吧！

## 如何参与？

2022年Hacktoberfest的规则如下：

- **Hacktoberfest对所有人开放**！
- 9月26日至10月31日之间随时可以注册
- 可以在任何GITHUB或GITLAB项目中发起拉取请求：
  - [TON生态系统项目列表](/hacktonberfest)
  - [GitHub上的项目列表](https://github.com/topics/hacktoberfest)
- 在10月1日至10月31日期间被接受了**4**个拉取/合并请求
- 前40,000名完成Hacktoberfest的参与者（维护者和贡献者）可以在两个奖品之间选择：以他们的名义种植的树或Hacktoberfest 2022 T恤。（_来自Hacktoberfest社区_）
- 任何参与TON生态系统项目的参与者（维护者和贡献者）都将收到[**限量版Hack-TON-berfest NFT**](#what-the-rewards)。（_来自TON基金会_）

对于TON中的每个人来说，这是一个推动整个生态系统成长并从TON基金会获得酷炫奖励的机会。让我们一起努力！

## 奖励是什么？

为了激励社区为TON生态系统的开源项目做出贡献，你将能够从TON基金会获得特殊的奖励。每位参与者都将获得**限量版Hack-TON-berfest NFT**成就，作为参与的证明：

<div style={{width: '100%', textAlign:'center', margin: '0 auto'}}>
  <video width="300" style={{width: '100%', borderRadius:'10pt', margin:'15pt auto'}} muted={true} autoPlay={true} loop={true}>
    <source src="/docs/files/nft-sm.mp4" type="video/mp4" />

您的浏览器不支持视频标签。

</video>
</div>

:::info 重要信息！
TON基金会将于11月为提交给[@toncontests_bot](https://t.me/toncontests_bot)的所有钱包地址铸造一个系列。这将在计算和验证所有贡献结果之后进行。
:::

你有足够的时间参与这个活动。让我们与来自全世界的成千上万的贡献者一起构建未来的去中心化网络！

<Button href="/contribute/hacktoberfest/as-contributor"
     colorType="primary" sizeType={'lg'}>

我想成为一名贡献者

</Button>

<Button href="/contribute/hacktoberfest/as-maintainer" colorType={'secondary'} sizeType={'lg'}>

我是维护者

</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-contributor.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-contributor.md
================================================
# 作为贡献者参与

要成为获得限量版 *Hack-TON-berfest NFT* 的贡献者，请设置你自己的 [TON 钱包](https://ton.org/wallets) 并验证你的 GitHub 账户。

## 开始你的旅程

1. 从 [ton.org/wallets](https://ton.org/wallets) 页面设置任意钱包。（例如，[TON Wallet 扩展](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)。）
2. 请将你的钱包地址提供给 Telegram 中的 [@toncontests_bot](https://t.me/toncontests_bot)。
3. 在同一个机器人中验证你的 GitHub 账户。

完成这些步骤后，你就准备好完成贡献并领取 [限量版Hack-TON-berfest NFT](/contribute/hacktoberfest/#what-the-rewards) 即可。

欢迎加入俱乐部，这只是个开始！

## 第一次参与开源项目？

Hacktoberfest 是首次尝试开源贡献的绝佳场所。有很多关于如何开始的直播、帖子、指南和讨论。你将会认识许多在这个月开始他们旅程的人们！

- [初学者关于 Hacktoberfest 的基本信息](https://hacktoberfest.com/participation/#beginner-resources)
- [进行首次贡献的指南](https://dev.to/codesandboxio/how-to-make-your-first-open-source-contribution-2oim)，作者 Ceora Ford
- [练习工作流程来进行你的首次贡献](https://github.com/firstcontributions/first-contributions)
- [克服在开源贡献中的冒名顶替综合征](https://blackgirlbytes.dev/conquering-the-fear-of-contributing-to-open-source)

## 我如何为 TON 做贡献？

TON 生态系统拥有几个组织和代码库：

<span className="DocsMarkdown--button-group-content">
  <a href="/hacktonberfest"
     className="Button Button-is-docs-primary">
    寻找贡献者的项目列表
  </a>
</span>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-maintainer.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-maintainer.md
================================================
# 作为维护者参与

Hacktoberfest 活动是一年中获得社区支持的最佳时机！

如果你的代码库与TON生态系统相关，许多贡献者将会对其感兴趣。让我们帮助他们迅速投入到你的项目中！

## 准备参与派对

为了能正确借助贡献者的力量，你需要拥有一个状况良好的代码库。

遵循以下最佳实践，为你的项目准备贡献：

1. 在你的代码库中添加“hacktoberfest”主题，以**参与HACKTOBERFEST**并表明你正在寻求人们的贡献。
2. 在你的GitHub或GitLab项目中，将“hacktoberfest”标签应用于你希望贡献者帮助解决的问题。
3. 请阅读并使用TON社区提供的[对新开源维护者的基本提示](https://blog.ton.org/essential-tips-for-new-open-source-maintainers)。
4. 通过合并、留下整体认可的审查，或添加“hacktoberfest-accepted”标签，来接受合法的拉取/合并请求。
5. 通过将其标记为“垃圾邮件”，拒绝你收到的任何垃圾请求，并关闭或标记任何其他无效的贡献使其“无效”。

这里是一个完整代码库的示例：[ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)

之后，就可以将你的代码库添加到列表中。

## 维护者的奖励

作为TON生态系统中的代码库维护者，你将能够获得两种类型的奖励：

1. [Hacktoberfest 奖励套件](https://hacktoberfest.com/participation/#maintainers)（*见维护者奖励*）
2. [限量版Hack-TON-berfest NFT](/contribute/hacktoberfest/#what-the-rewards)（*请在[@toncontests_bot](https://t.me/toncontests_bot)中注册钱包地址*）

## 如何加入并被列入列表？

要参加Hack-TON-berfest，请按照此链接操作：

<span className="DocsMarkdown--button-group-content">
  <a href="https://airtable.com/shrgXIgZdBKKX64NL"
     className="Button Button-is-docs-primary">
    将代码库添加到列表中
  </a>
</span>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/mining.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/mining.md
================================================
# TON 挖矿指南

:::warning 已弃用
此信息可能已过时，不再有效。可以忽略它。
:::

## <a id="introduction"></a>简介

本文档提供了使用PoW提供者挖掘Toncoin的过程介绍。请访问[ton.org/mining](https://ton.org/mining)以获取TON挖矿的最新状态。

## <a id="quick-start"></a>快速开始

立即开始挖矿：

1. 获取[适用于挖矿的计算机](#hardware)。
2. 安装[Ubuntu](https://ubuntu.com) 20.04桌面或服务器发行版。
3. 在`lite`模式下安装[mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu)。
4. 运行`mytonctrl`中的`emi`命令，检查您的硬件和[预期挖矿收入](#faq-emi)。
5. 如果您还没有钱包地址，请使用其中一个[钱包](https://www.ton.org/wallets)创建`钱包地址`。
6. 通过在`mytonctrl`中执行`set minerAddr "..."`命令，将您的`钱包地址`定义为挖矿目标。
7. 从[ton.org/mining](https://ton.org/mining)上提供的列表中选择一个giver合约，并通过在`mytonctrl`中执行`set powAddr "..."`命令设置您的miner以挖掘它。
8. 通过在`mytonctrl`中执行`mon`命令开始挖矿。
9. 检查您计算机上的CPU负载；名为`pow-miner`的进程应使用您大部分的CPU。
10. 等待好运；第4步的输出应该告诉您挖到一个区块的大致几率。

## <a id="basics"></a>基础知识

Toncoin通过所谓的`PoW Givers`（工作量证明提供者）进行分发，它们是分配了一定数量TON的智能合约。目前，TON网络上有10个活跃的PoW giver。Giver每次分发100 TON的币。为了接收这样一个块，您的计算机需要解决giver发布的复杂数学挑战，并且要尽可能快地完成；您将与其他矿工竞争100 TON的奖励。如果有人在您之前解决了问题，您的机器所做的所有工作都将作废，新的一轮/竞赛开始。

重要的是要理解，挖矿的收益不是随着机器工作而“逐渐增加”的，而是每成功解决一个giver挑战就以100 TON的批次形式出现。这意味着，如果您的机器有在24小时内计算出一个区块的10%机会（见[快速开始](#quickStart)的第4步），那么您可能需要等待大约10天时间才能获得100 TON的奖励。

挖矿过程在很大程度上由`mytonctrl`自动化。关于挖矿过程的详细信息可以在[PoW givers](https://www.ton.org/#/howto/pow-givers)文档中找到。

## <a id="advanced"></a>高级

如果您认真对待挖矿并希望操作多台机器/矿场，那么您真的需要了解TON以及挖矿的工作原理；请参阅[HOWTO](https://ton.org/#/howto/)部分以获取深入信息。以下是一些通用建议：

- **应该**在单独的机器上运行您自己的节点/轻服务器；这将确保您的矿场不依赖于可能发生故障或无法及时处理您的查询的外部轻服务器。
- **不要**用`get_pow_params`查询轰炸公共轻服务器，如果您有高频率轮询giver状态的自定义脚本，您**必须**使用您自己的轻服务器。违反此规则的客户端可能会导致其IP在公共轻服务器上被列入黑名单。
- **应该**尝试了解[挖矿过程](https://www.ton.org/#/howto/pow-givers)的工作原理；大多数大型矿工使用自己的脚本，在多个挖矿机器的环境中提供比`mytonctrl`更多的优势。

## <a id="hardware"></a>矿工硬件

TON挖矿的总网络哈希率非常高；如果矿工希望成功，他们需要高性能的机器。在标准家用计算机和笔记本电脑上挖矿是徒劳的，我们不建议尝试。

#### CPU

支持[Intel SHA扩展](https://zh.wikipedia.org/wiki/Intel_SHA_extensions)的现代CPU是**必须的**。大多数矿工使用至少32核心和64线程的AMD EPYC或Threadripper系列机器。

#### GPU

是的！您可以使用GPU挖TON。有一个PoW矿工版本能够使用Nvidia和AMD GPU；您可以在[POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md)库中找到代码和使用说明。

目前，需要技术熟练才能使用这个，但我们正在开发更用户友好的解决方案。

#### 内存

几乎整个挖矿过程都发生在CPU的L2缓存中。这意味着内存速度和大小在挖矿性能中没有作用。一个只在一个内存通道上装有单个DIMM的双AMD EPYC系统将与占用所有通道的16个DIMM挖矿一样快地。

请注意，这**只**适用于普通挖矿过程，如果您的机器还运行全节点或其他进程，那么情况会改变！但这超出了本指南的范围。

#### 存储

以lite模式运行的普通矿工使用最少的空间，并且不在存储中存储任何数据。

#### 网络

普通矿工需要能够打开对外的互联网连接。

#### FPGA / ASIC

参见[我可以使用FPGA / ASIC吗？](#faq-hw-asic)

### <a id="hardware-cloud"></a>云算力

许多人使用AWS或Google计算云机器进行挖矿。如上所述，真正重要的是CPU。因此，我们建议AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/)或Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing)实例。

### <a id="hardware-estimates"></a>收入估算

计算收入的公式非常简单：`($total_bleed / $total_hashrate) * $your_hashrate`。这将给您**当前**的估算。您可以在[ton.org/mining](https://ton.org/mining)上找到这些变量，也可以在`mytonctrl`中使用估算挖矿收入计算器（`emi`命令）。以下是2021年8月7日使用i5-11400F CPU进行的样本输出：

```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**重要**：请注意，所提供的信息基于*执行时刻的网络哈希率*。您实际的长期收入将取决于许多因素，例如不断变化的网络哈希率、选择的giver以及好运。

## <a id="faq"></a>常见问题解答

### <a id="faq-general"></a>一般

#### <a id="faq-general-posorpow"></a>TON是PoS还是PoW网络？

TON区块链使用权益证明（Proof-of-Stake）共识。挖矿不是生成新块所必需的。

#### <a id="faq-general-pow"></a>那TON为什么是工作量证明（Proof-of-Work）？

原因是最初的50亿Toncoin被转移到临时工作量证明提供者智能合约中。
挖矿用于从这个智能合约中获取Toncoin。

#### <a id="faq-general-supply"></a>还有多少币可以挖？

最新信息可在[ton.org/mining](https://ton.org/mining)上找到，参见`bleed`图表。PoW Giver合约有其限制，一旦用户挖出所有可用的Toncoin，它们就会枯竭。

#### <a id="faq-general-mined"></a>到目前为止已经挖出多少币？

截至2021年8月，约有49亿Toncoin被挖出。

#### <a id="faq-general-whomined"></a>谁挖出了这些币？

这些币被挖到超过70,000个钱包中，这些钱包的所有者是未知的。

#### <a id="faq-general-elite"></a>开始挖矿难吗？

一点也不难。您所需要的是[合适的硬件](#hardware)和按照[快速开始](#quickStart)部分中概述的步骤操作。

#### <a id="faq-general-pissed"></a>还有其他方式挖矿吗？

是的，有一个第三方应用——[TON Miner Bot](https://t.me/TonMinerBot)。

#### <a id="faq-general-stats"></a>我在哪里可以看到挖矿统计？

[ton.org/mining](https://ton.org/mining)

#### <a id="faq-general-howmany"></a>有多少矿工？

我们无法说出这个数字。我们所知道的是网络上所有矿工的总哈希率。然而，在[ton.org/mining](https://ton.org/mining)上有图表试图估算提供近似总哈希率的某种类型机器的数量。

#### <a id="faq-general-noincome"></a>我需要Toncoin才能开始挖矿吗？

不，您不需要。任何人都可以在不拥有任何Toncoin的情况下开始挖矿。

#### <a id="faq-mining-noincome"></a>我挖了几个小时，为什么我的钱包总额没有增加，甚至没有增加1 TON？

TON在区块中是以每100进行开采的，你要么猜中一个区块并获得100 TON，要么一无所获。请参见[基础知识](#basics)。

#### <a id="faq-mining-noblocks"></a>我挖了几天，为什么看不到结果？

您检查了当前的[收入估算](#hardware-estimates)了吗？如果`Est. 24h chance to mine a block`字段小于100%，那么您需要耐心等待。另外，请注意，24小时内挖到一个块的50%几率并不自动意味着您将在2天内挖到一个块；每天分别适用50%。

#### <a id="faq-mining-pools"></a>有挖矿池吗？

截至目前，还没有挖矿池的实现，每个人都为自己挖矿。

#### <a id="faq-mining-giver"></a>我应该挖哪个giver？

您选择哪个giver并不真正重要。难度在每个giver上都会波动，所以[ton.org/mining](https://ton.org/mining)上当前最简单的giver可能在一个小时内变得最复杂。反之亦然。

### <a id="faq-hw"></a>硬件

#### <a id="faq-hw-machine"></a>更快的机器是否总是胜出？

不，所有矿工采取不同的途径来找到解决方案。更快的机器成功的概率更高，但并不保证胜利！

#### <a id="faq-hw-machine"></a>我的机器能产生多少收入？

请参见[收入估算](#hardware-estimates)。

#### <a id="faq-hw-asic"></a>我能用我的BTC/ETH装置来挖TON吗？

不，TON使用单个SHA256散列方法，与BTC、ETH等不同。为挖其他加密货币而构建的ASIC或FPGA将不起作用。

#### <a id="faq-hw-svsm"></a>一台快速机器还是几台慢机器更好？

这是有争议的。见：矿工软件为系统上的每个核心启动线程，每个核心都获得自己要处理的密钥集，所以如果您有一台能运行64线程的机器和4台能各自运行16线程的机器，那么它们将在成功方面完全相同，假设每个线程的速度相同。

然而，在现实世界中，核心数量较少的CPU通常时钟频率更高，所以您可能会用多台机器取得更好的成绩。

#### <a id="faq-hw-mc"></a>如果我运行多台机器，它们会合作吗？

不，它们不会。每台机器各自挖矿，但寻找解决方案的过程是随机的：没有机器，甚至没有单个线程（见上文）会采取相同的路径。因此，它们的哈希率加起来对你有利，而无需直接合作。

#### <a id="faq-hw-CPU"></a>我可以使用ARM CPU挖矿吗？

这取决于CPU，AWS Graviton2实例确实是非常有能力的miner，并能够在性价比方面与基于AMD EPYC的实例相媲美。

### <a id="faq-software"></a>软件

#### <a id="faq-software-os"></a>我可以使用Windows/xBSD/其他操作系统挖矿吗？

当然，[TON源代码](https://github.com/ton-blockchain/ton)已知可以在Windows、xBSD和其他操作系统上构建。然而，没有像Linux下的`mytonctrl`那样舒适的自动安装，您需要手动安装软件并创建自己的脚本。对于FreeBSD，有一个[port](https://github.com/sonofmom/freebsd_ton_port)源代码允许快速安装。

#### <a id="faq-software-node1"></a>如果我以完整节点模式运行mytonctrl，我的挖矿会变得更快吗？

计算过程本身不会变快，但如果您操作自己的完整节点/轻服务器，您将获得一些稳定性和最重要的是灵活性。

#### <a id="faq-software-node2"></a>我需要什么/如何操作一个完整节点？

这超出了本指南的范围，请参阅[完整节点howto](https://ton.org/#/howto/full-node)和/或[mytonctrl说明](https://github.com/igroman787/mytonctrl)。

#### <a id="faq-software-build"></a>你能帮我在我的操作系统上构建软件吗？

这超出了本指南的范围，请参阅[完整节点操作指南](https://ton.org/#/howto/full-node)以及[Mytonctrl安装脚本](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44)，以获取有关依赖项和过程的信息。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/pow-givers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/pow-givers.md
================================================
# POW Givers

:::warning 已弃用
此信息可能已过时，不再有用。您可以随意忽略它。
:::

本文旨在描述如何与POW Giver智能合约互动，以获得Toncoin。我们假设您已熟悉TON区块链轻客户端，如`入门`中所述，并熟悉编译轻客户端和其他软件的程序。为了获得运行验证者所需的更多Toncoin，我们还假设您熟悉`完整节点`和`验证者`页面。为了获得更多的Toncoin，您还需要一台足够强大的专用服务器来运行完整节点。获取少量的Toncoin不需要专用服务器，在家用电脑上几分钟内即可完成。

> 请注意，目前由于矿工数量众多，任何挖矿都需要大量资源。

## 1. Proof-of-Work Giver智能合约

为了防止少数恶意方收集所有Toncoin，网络的主链上部署了一种特殊的“工作量证明赠予者”智能合约。这些智能合约的地址如下：

小额赠予者（每几分钟提供10至100 Toncoin）：

- kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN
- kf8SYc83pm5JkGt0p3TQRkuiM58O9Cr3waUtR9OoFq716lN-
- kf-FV4QTxLl-7Ct3E6MqOtMt-RGXMxi27g4I645lw6MTWraV
- kf_NSzfDJI1A3rOM0GQm7xsoUXHTgmdhN5-OrGD8uwL2JMvQ
- kf8gf1PQy4u2kURl-Gz4LbS29eaN4sVdrVQkPO-JL80VhOe6
- kf8kO6K6Qh6YM4ddjRYYlvVAK7IgyW8Zet-4ZvNrVsmQ4EOF
- kf-P_TOdwcCh0AXHhBpICDMxStxHenWdLCDLNH5QcNpwMHJ8
- kf91o4NNTryJ-Cw3sDGt9OTiafmETdVFUMvylQdFPoOxIsLm
- kf9iWhwk9GwAXjtwKG-vN7rmXT3hLIT23RBY6KhVaynRrIK7
- kf8JfFUEJhhpRW80_jqD7zzQteH6EBHOzxiOhygRhBdt4z2N

大额赠予者（每天至少提供10,000 Toncoin）：

- kf8guqdIbY6kpMykR8WFeVGbZcP2iuBagXfnQuq0rGrxgE04
- kf9CxReRyaGj0vpSH0gRZkOAitm_yDHvgiMGtmvG-ZTirrMC
- kf-WXA4CX4lqyVlN4qItlQSWPFIy00NvO2BAydgC4CTeIUme
- kf8yF4oXfIj7BZgkqXM6VsmDEgCqWVSKECO1pC0LXWl399Vx
- kf9nNY69S3_heBBSUtpHRhIzjjqY0ChugeqbWcQGtGj-gQxO
- kf_wUXx-l1Ehw0kfQRgFtWKO07B6WhSqcUQZNyh4Jmj8R4zL
- kf_6keW5RniwNQYeq3DNWGcohKOwI85p-V2MsPk4v23tyO3I
- kf_NSPpF4ZQ7mrPylwk-8XQQ1qFD5evLnx5_oZVNywzOjSfh
- kf-uNWj4JmTJefr7IfjBSYQhFbd3JqtQ6cxuNIsJqDQ8SiEA
- kf8mO4l6ZB_eaMn1OqjLRrrkiBcSt7kYTvJC_dzJLdpEDKxn

> 请注意，目前所有大额赠予者已被耗尽。

前十个智能合约使愿意获取少量Toncoin的用户能够在不花费太多计算功率的情况下获得一些（通常情况下，家用电脑上几分钟的工作应该就足够了）。其余智能合约用于获取网络中运行验证者所需的更多Toncoin；通常，一天在足够强大的专用服务器上的工作应该足以获得所需金额。

> 请注意，目前由于矿工数量众多，挖掘小额赠予者也需要大量资源。

您应该随机选择这些“proof-of-work giver”智能合约中的一个（根据您的目的从这两个列表中选择），并通过类似于挖矿的程序从该智能合约中获得Toncoin。基本上，您需要呈现一个包含工作量证明和您钱包地址的外部消息给所选的“proof-of-work giver”智能合约，然后金额将被发送给您。

## 2. 挖矿过程

为了创建一个包含“工作量证明(proof-of-work)”的外部消息，您应该运行一个特殊的挖矿实用程序，从GitHub库中的TON源代码编译而成。该实用程序位于构建目录的`./crypto/pow-miner`文件中，可以通过在构建目录中输入`make pow-miner`来编译。

然而，在运行`pow-miner`之前，您需要知道所选“proof-of-work giver”智能合约的`seed`和`complexity`参数的实际值。这可以通过调用该智能合约的get方法`get_pow_params`来完成。例如，如果您使用 giver 智能合约，`kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN`，您可以简单地键入：

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

在轻客户端控制台中，并获得像这样的输出：

```...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

“result:”行中的前两个大数字分别是这个智能合约的`seed`和`complexity`。在此例中，seed是`229760179690128740373110445116482216837`，而复杂度是`53919893334301279589334030174039261347274288845081144962207220498432`。

接下来，您按如下方式调用`pow-miner`实用程序：

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

这里：

- `<num-threads>`是您希望用于挖矿的CPU核心数量。
- `<timeout-in-sec>`是矿工运行失败前的最长秒数。
- `<your-wallet-address>`是您的钱包地址（可能尚未初始化）。它要么在主链上，要么在工作链上（请注意，您需要一个主链钱包来控制验证者）。
- `<seed>`和`<complexity>`是通过运行get方法`get-pow-params`获得的最新值。
- `<pow-giver-address>`是所选proof-of-work giver智能合约的地址。
- `<boc-filename>`是成功时保存工作量证明的外部消息的输出文件的文件名。

例如，如果您的钱包地址是`kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`，您可能会运行：

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

程序将运行一段时间（在这种情况下最多100秒），并且要么成功终止（zero exit code）并将所需的工作量证明保存在文件`mined.boc`中，要么以非零 exit code 终止，如果没有找到工作量证明。

在失败的情况下，您会看到像这样的内容：

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

程序将以非零 exit code 终止。然后您必须再次获取`seed`和`complexity`（因为它们可能已经在此期间改变，因为更成功的矿工的请求已经被处理），并重新运行`pow-miner`，使用新参数重复过程，直到成功。

在成功的情况下，您会看到类似于：

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

然后，您可以使用轻客户端将外部消息从文件`mined.boc`发送到 proof-of-work giver 智能合约（您必须尽快这样做）：

```
> sendfile mined.boc
... external message status is 1
```

您可以等待几秒钟，然后检查您的钱包状态：

:::info
请注意，在此处和以下的代码、注释和/或文档中可能包含“gram”、“nanogram”等参数、方法和定义。这是原始TON代码的遗产，由Telegram开发。Gram加密货币从未发行。TON的货币是Toncoin，TON测试网的代币是Test Toncoin。
:::

```
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722498
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720869000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:100000000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F12025BC2F7F2341000001C169E9DCD0945D21DBA0004_}
last transaction lt = 7720869000001 hash = 83C15CDED025970FEF7521206E82D2396B462AADB962C7E1F4283D88A0FAB7D4
account balance is 100000000000ng
```

如果在您之前没有人发送具有此`seed`和`complexity`的有效工作量证明，proof-of-work giver 将接受您的工作量证明，这将反映在您钱包的余额中（发送外部消息后可能需要10或20秒钟才会发生；请确保多次尝试并在每次检查钱包余额之前输入`last`以刷新轻客户端状态）。如果成功，您会看到余额增加（如果之前不存在，甚至您的钱包也会以未初始化的状态被创建）。如果失败，您将不得不获得新的`seed`和`complexity`，并从头开始重复挖矿过程。

如果您幸运并且钱包的余额增加了，如果之前没有初始化，您可能想初始化钱包（有关创建钱包的更多信息可以在`逐步操作`中找到）：

```
> sendfile new-wallet-query.boc
... external message status is 1
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:1147)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722691
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720945000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:99995640998))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
            ))
        library:hme_empty))))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1206811EC2F7F23A1800001C16B0BC790945D20D1929934_}
 x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
last transaction lt = 7720945000001 hash = 73353151859661AB0202EA5D92FF409747F201D10F1E52BD0CBB93E1201676BF
account balance is 99995640998ng
```

现在您是100 Toncoin的幸运拥有者。祝贺您！

## 3. 在失败的情况下自动化挖矿过程

如果您长时间无法获得Toncoin，这可能是因为太多其他用户同时从同一个 proof-of-work giver 智能合约进行挖矿。也许您应该从上面给出的列表中选择另一个 proof-of-work giver 智能合约。或者，您可以编写一个简单的脚本，自动运行`pow-miner`，使用正确的参数一遍又一遍地运行，直到成功（通过检查`pow-miner`的 exit code 来检测），并调用带有参数`-c 'sendfile mined.boc'`的轻客户端，以便在找到后立即给他发送外部消息。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/precompiled-binaries.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/precompiled-binaries.md
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# 预编译二进制文件

:::caution 重要
您不再需要手动安装Blueprint SDK的二进制文件。
:::

Blueprint SDK已提供所有开发和测试所需的二进制文件。

<Button href="/develop/smart-contracts/sdk/javascript"
colorType="primary" sizeType={'sm'}>

迁移到Blueprint SDK

</Button>

## 预编译二进制文件

如果您不使用Blueprint SDK进行智能合约开发，您可以使用适用于您的操作系统和工具选择的预编译二进制文件。

### 先决条件

对于在本地开发TON智能合约 *无需Javascript*，您需要在您的设备上准备`func`、`fift`和`lite client`的二进制文件。

您可以从下表中下载并设置它们，或阅读TON Society的这篇文章：

- [设置TON开发环境](https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. 下载

从下表中下载二进制文件。请确保选择适合您操作系统的正确版本，并安装任何附加依赖项：

| 操作系统                               | TON二进制文件                                                                                  | fift                                                                                   | func                                                                                   | lite-client                                                                                   | 附加依赖项                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| MacOS x86-64                       | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)   |                                                                                                         |
| MacOS arm64                        | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                        |                                                                                        |                                                                                               | `brew install openssl ninja libmicrohttpd pkg-config`                                                   |
| Windows x86-64                     | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)          | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)          | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)          | 安装 [OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi) |
| Linux  x86_64 | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                                                                                         |
| Linux  arm64                       | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  |                                                                                        |                                                                                        |                                                                                               | `sudo apt install libatomic1 libssl-dev`                                                                |

### 2. 设置您的二进制文件

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children}
</span>
);

<Tabs groupId="operating-systems">
  <TabItem value="win" label="Windows">

1. 下载后，您需要`创建`一个新文件夹。例如：**`C:/Users/%USERNAME%/ton/bin`**，并将安装的文件移动到那里。

2. 要打开Windows环境变量，请按键盘上的<Highlight color="#1877F2">Win + R</Highlight>按钮，键入`sysdm.cpl`，然后按Enter键。

3. 在“*高级*”选项卡上

4. 在_“用户变量”_部分，选择“*Path*”变量，然后点击<Highlight color="#1877F2">“编辑”</Highlight>（通常需要）。

5. 要在下一个窗口中为系统变量添加新值 `(路径)`，请单击<Highlight color="#1877F2">"新建 "</Highlight>按钮。
   在新字段中，您需要指定存储先前安装的文件的文件夹路径：

```
C:\Users\%USERNAME%\ton\bin\
```

6. 在_“用户变量”_部分，选择“*Path*”变量，然后点击<Highlight color="#1877F2">“编辑”</Highlight>（通常需要）。

```bash
fift -V -and func -V -and lite-client -V
```

7. 要检查是否一切安装正确，请在终端运行（*cmd.exe*）：

   1. 下载 [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)
   2. 在机器上的某个目录（如 **`C:/Users/%USERNAME%/ton/lib/fiftlib`** ）中打开压缩包
   3. 在"*用户变量*"部分创建一个新的环境变量 "FIFTPATH"（点击 "<Highlight color="#1877F2">新建</Highlight>"按钮）。
   4. 在"*变量值*"字段中，指定文件的路径：**`/%USERNAME%/ton/lib/fiftlib`**，然后单击 "<Highlight color="#1877F2">确定</Highlight>"。完成。

:::caution important
您必须插入自己的 "用户名"，而不是 "%USERNAME%" 关键字。
:::

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

1.下载后，通过更改权限确保下载的二进制文件可执行。
```bash
chmod +x func
chmod +x fift
chmod +x lite-client
```

2.将这些二进制文件添加到路径中（或复制到 `/usr/local/bin`）也很有用，这样你就可以在任何地方访问它们。
```bash
cp ./func /usr/local/bin/func
cp ./fift /usr/local/bin/fift
cp ./lite-client /usr/local/bin/lite-client
```

3.要检查一切安装是否正确，请在终端中运行
```bash
fift -V && func -V && lite-client -V
```

4.如果打算 `使用 fift`，还需下载 [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)，在设备上的某个目录（如 `/usr/local/lib/fiftlib`）中打开该压缩包，并设置环境变量 `FIFTPATH` 指向该目录。
```
unzip fiftlib.zip
mkdir -p /usr/local/lib/fiftlib
cp fiftlib/* /usr/local/lib/fiftlib
```

:::info 嘿，你差不多完成了:)
记得设置[环境变量](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH`指向此目录。
:::

</TabItem>
</Tabs>

## 从源代码构建

如果不想依赖预编译的二进制文件，而是想自己编译二进制文件，可以按照[官方说明](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions) 进行编译。

下文提供了随时可用的要点说明：

### Linux （Ubuntu / Debian）

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

## Linux（Ubuntu / Debian）

核心团队以 [GitHub Actions](https://github.com/ton-blockchain/ton/releases/latest) 的形式为多个操作系统提供自动构建功能。

点击上面的链接，在左侧选择与你的操作系统相关的工作流，点击最近的绿色传递构建，然后在 "工件 "下下载 "ton-binaries"。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration-py.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration-py.md
================================================
import Button from '@site/src/components/button'

# Telegram 机器人的 TON Connect - Python

:::warning 弃用
本指南介绍了将 TON Connect 与 Telegram 机器人集成的过时方法。如需更安全、更现代的方法，请考虑使用 [Telegram 小程序](/v3/guidelines/dapps/tma/overview)。
:::

<Button href="https://t.me/ton_connect_example_bot" colorType={'primary'} sizeType={'sm'}>

打开演示机器人

</Button>

<Button href="https://github.com/ton-connect/demo-telegram-bot" colorType={'secondary'} sizeType={'sm'}>

查看 GitHub

</Button>

## 安装库

### 安装库

要制作机器人，我们将使用 `aiogram` 3.0 Python 库。
要开始将 TON Connect 集成到 Telegram 机器人中，你需要安装 `pytonconnect` 软件包。
要使用 TON 基元和解析用户地址，我们需要 `pytoniq-core`。
为此您可以使用 pip：

```bash
pip install aiogram pytoniq-core python-dotenv
pip install pytonconnect
```

### 设置配置

在 `.env` 文件中指定 [机器人令牌](https://t.me/BotFather) 和 TON Connect [清单文件](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) 的链接。之后在 `config.py` 中加载它们：

```dotenv
# .env

TOKEN='1111111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'  # your bot token here
MANIFEST_URL='https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json'
```

```python
# config.py

from os import environ as env

from dotenv import load_dotenv
load_dotenv()

TOKEN = env['TOKEN']
MANIFEST_URL = env['MANIFEST_URL']
```

## 创建简单的机器人

创建包含机器人主代码的 `main.py` 文件：

```python
# main.py

import sys
import logging
import asyncio

import config

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)
    

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    await message.answer(text='Hi!')

async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```

## TON Connect 存储

### TON 连接存储

让我们为 TON Connect 创建一个简单的存储空间

```python
# tc_storage.py

from pytonconnect.storage import IStorage, DefaultStorage


storage = {}


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        storage[self._get_key(key)] = value

    async def get_item(self, key: str, default_value: str = None):
        return storage.get(self._get_key(key), default_value)

    async def remove_item(self, key: str):
        storage.pop(self._get_key(key))

```

### 连接处理程序

首先，我们需要为每个用户返回不同实例的函数：

```python
# connector.py

from pytonconnect import TonConnect

import config
from tc_storage import TcStorage


def get_connector(chat_id: int):
    return TonConnect(config.MANIFEST_URL, storage=TcStorage(chat_id))

```

其次，让我们在 `command_start_handler()` 中添加连接处理程序：

```python
# main.py

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())
    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())

```

现在，对于尚未连接钱包的用户，机器人会发送一条包含所有可用钱包按钮的消息。
因此，我们需要编写函数来处理 `connect:{wallet["name"]}` 回调：

```python
# main.py

async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])
```

机器人会给用户 3 分钟时间连接钱包，之后会报告超时错误。

## 实施事务请求

让我们以 [Message builders](/v3/guidelines/ton-connect/guidelines/preparing-messages) 一文中的一个例子为例：

```python
# messages.py

from base64 import urlsafe_b64encode

from pytoniq_core import begin_cell


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

并在 `main.py` 文件中添加 `send_transaction()` 函数：

```python
# main.py

@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return
    
    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    await connector.send_transaction(
        transaction=transaction
    )
```

但我们还应该处理可能出现的错误，因此我们将 `send_transaction` 方法封装到 `try - except` 语句中：

```python
@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    ...
    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')
```

## 添加断开连接处理程序

这个函数的实现非常简单：

```python
async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')
```

目前，该项目的结构如下：

```bash
.
.env
├── config.py
├── connector.py
├── main.py
├── messages.py
└── tc_storage.py
```

而 `main.py` 看起来是这样的：

<details>
<summary>显示 main.py</summary>

```python
# main.py

import sys
import logging
import asyncio
import time

import pytonconnect.exceptions
from pytoniq_core import Address
from pytonconnect import TonConnect

import config
from messages import get_comment_message
from connector import get_connector

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)


@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())

    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())


@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return

    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')


async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])


async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```

</details>

## 添加持久存储 - Redis

### 添加永久存储 - Redis

在启动 Redis 数据库后安装用于与之交互的 python 库：

启动 Redis 数据库后，安装 python 库与之交互：

```bash
pip install redis
```

并更新 `tc_storage.py` 中的 `TcStorage` 类：

```python
import redis.asyncio as redis

client = redis.Redis(host='localhost', port=6379)


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        await client.set(name=self._get_key(key), value=value)

    async def get_item(self, key: str, default_value: str = None):
        value = await client.get(name=self._get_key(key))
        return value.decode() if value else default_value

    async def remove_item(self, key: str):
        await client.delete(self._get_key(key))
```

### 添加 QR 码

安装 python `qrcode` 软件包来生成它们：

```bash
pip install qrcode
```

更改 `connect_wallet()` 函数，使其生成 qrcode 并以照片形式发送给用户：

```python
from io import BytesIO
import qrcode
from aiogram.types import BufferedInputFile


async def connect_wallet(message: Message, wallet_name: str):
    ...
    
    img = qrcode.make(generated_url)
    stream = BytesIO()
    img.save(stream)
    file = BufferedInputFile(file=stream.getvalue(), filename='qrcode')

    await message.answer_photo(photo=file, caption='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())
    
    ...
```

## 摘要

下一步是什么？

- 您可以在机器人中添加更好的错误处理功能。
- 您可以添加开始文本和类似 `/connect_wallet`命令的内容。

## 另请参见

- [完整机器人代码](https://github.com/yungwine/ton-connect-bot)
- [准备信息](/v3/guidelines/ton-connect/guidelines/preparing-messages)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration.mdx
================================================
import Button from '@site/src/components/button'

# Telegram 机器人的 TON Connect

:::warning 弃用
本指南介绍了将 TON Connect 与 Telegram 机器人集成的过时方法。如需更安全、更现代的方法，请考虑使用 [Telegram 小程序](/v3/guidelines/dapps/tma/overview)。
:::

在本教程中，我们将使用支持 TON Connect 2.0 身份验证的 JavaScript TON Connect SDK 开发一个 Telegram 机器人示例。
本指南包括钱包连接、发送交易、检索钱包信息和断开钱包连接。

<Button href="https://t.me/ton_connect_example_bot" colorType={'primary'} sizeType={'sm'}>

打开演示机器人

</Button>

<Button href="https://github.com/ton-connect/demo-telegram-bot" colorType={'secondary'} sizeType={'sm'}>

查看 GitHub

</Button>

## 文件链接

- [TON Connect SDK 文档](https://www.npmjs.com/package/@tonconnect/sdk)

## 先决条件

- 您需要使用 [@BotFather](https://t.me/BotFather) 创建一个电报机器人，并保存其令牌。
- 应安装 Node JS（本教程中使用的是 18.1.0 版本）。
- 应安装 Docker。

## 设置依赖

### 设置依赖关系

让我们创建一个目录 `ton-connect-bot`。在那里添加以下的 package.json 文件：

创建目录 `ton-connect-bot`.在其中添加以下 package.json 文件：

```json
{
  "name": "ton-connect-bot",
  "version": "1.0.0",
  "scripts": {
    "compile": "npx rimraf dist && tsc",
    "run": "node ./dist/main.js"
  },
  "dependencies": {
    "@tonconnect/sdk": "^3.0.0-beta.1",
    "dotenv": "^16.0.3",
    "node-telegram-bot-api": "^0.61.0",
    "qrcode": "^1.5.1"
  },
  "devDependencies": {
    "@types/node-telegram-bot-api": "^0.61.4",
    "@types/qrcode": "^1.5.0",
    "rimraf": "^3.0.2",
    "typescript": "^4.9.5"
  }
}
```

运行 `npm i` 安装依赖项。

### 添加 tsconfig.json

创建 `tsconfig.json`：

<details>
<summary>tsconfig.json 代码</summary>

```json
{
  "compilerOptions": {
    "declaration": true,
    "lib": ["ESNext", "dom"],
    "resolveJsonModule": true,
    "experimentalDecorators": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "target": "es6",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "useUnknownInCatchVariables": false,
    "noUncheckedIndexedAccess": true,
    "emitDecoratorMetadata": false,
    "importHelpers": false,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "allowJs": true,
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": [
    "./tests","node_modules", "lib", "types"]
}
```

</details>

[了解有关 tsconfig.json 的更多信息](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### 添加简单的机器人代码

[了解更多关于 tonconnect-manifes.json](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest)

[查看有关 tonconnect-manifes.json 的更多信息](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest)

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, E.G 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
TELEGRAM_BOT_LINK=<YOUR TG BOT LINK HERE, E.G. https://t.me/ton_connect_example_bot>
MANIFEST_URL=https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
```

创建目录 `src`，并在其中创建文件 `bot.ts`。让我们在这里创建一个 TelegramBot 实例：

```ts
// src/bot.ts

import TelegramBot from 'node-telegram-bot-api';
import * as process from 'process';

const token = process.env.TELEGRAM_BOT_TOKEN!;

export const bot = new TelegramBot(token, { polling: true });
```

现在，我们可以在 `src` 目录中创建一个入口点文件 `main.ts` ：

```ts
// src/main.ts
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';

bot.on('message', msg => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Received your message');
});
```

目前我们有以下文件结构：

目前，我们的文件结构如下：

```text
ton-connect-bot
├── src
│   ├── bot.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## 连接钱包

我们将从获取钱包列表开始。我们只需要 http-bridge 兼容的钱包。在 `src` 中创建文件夹 `ton-connect` 并添加 `wallets.ts` 文件：
我们还定义了函数 `getWalletInfo` 来通过其 `appName` 查询详细的钱包信息。
`name` 和 `appName` 之间的区别是 `name` 是钱包的人类可读标签，而 `appName` 是钱包的唯一标识符。

我们将从获取钱包列表开始。我们只需要与 http 桥兼容的钱包。在 `src` 中创建文件夹 `ton-connect` 并在其中添加 `wallets.ts` 文件：
我们还定义了函数 `getWalletInfo`，该函数通过 `appName` 查询钱包的详细信息。
 `name` 和 `appName` 的区别在于， `name` 是钱包的可读标签，而 `appName` 是钱包的统一标识符。

```ts
// src/ton-connect/wallets.ts

import { isWalletInfoRemote, WalletInfoRemote, WalletsListManager } from '@tonconnect/sdk';

const walletsListManager = new WalletsListManager({
    cacheTTLMs: Number(process.env.WALLETS_LIST_CACHE_TTL_MS)
});

export async function getWallets(): Promise<WalletInfoRemote[]> {
    const wallets = await walletsListManager.getWallets();
    return wallets.filter(isWalletInfoRemote);
}

export async function getWalletInfo(walletAppName: string): Promise<WalletInfo | undefined> {
    const wallets = await getWallets();
    return wallets.find(wallet => wallet.appName.toLowerCase() === walletAppName.toLowerCase());
}
```

[查看关于 TonConnect 存储的详情](https://github.com/ton-connect/sdk/tree/main/packages/sdk#init-connector)

在 `ton-connect` 目录内创建 `storage.ts`：

在 `ton-connect` 目录中创建 `storage.ts`：

```ts
// src/ton-connect/storage.ts

import { IStorage } from '@tonconnect/sdk';

const storage = new Map<string, string>(); // temporary storage implementation. We will replace it with the redis later

export class TonConnectStorage implements IStorage {
  constructor(private readonly chatId: number) {} // we need to have different stores for different users

  private getKey(key: string): string {
    return this.chatId.toString() + key; // we will simply have different keys prefixes for different users
  }

  async removeItem(key: string): Promise<void> {
    storage.delete(this.getKey(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    storage.set(this.getKey(key), value);
  }

  async getItem(key: string): Promise<string | null> {
    return storage.get(this.getKey(key)) || null;
  }
}
```

我们继续实现钱包连接。
修改 `src/main.ts` 并添加 `connect` 命令。我们将在此命令处理程序中实现钱包连接。

```ts
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './ton-connect/storage';
import QRCode from 'qrcode';

bot.onText(/\/connect/, async msg => {
  const chatId = msg.chat.id;
  const wallets = await getWallets();

  const connector = new TonConnect({
    storage: new TonConnectStorage(chatId),
    manifestUrl: process.env.MANIFEST_URL
  });

  connector.onStatusChange(wallet => {
    if (wallet) {
      bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
    }
  });

  const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper')!;

  const link = connector.connect({
    bridgeUrl: tonkeeper.bridgeUrl,
    universalLink: tonkeeper.universalLink
  });
  const image = await QRCode.toBuffer(link);

  await bot.sendPhoto(chatId, image);
});
```

现在，你可以运行机器人（接着运行 `npm run compile` 和 `npm run start`）并向机器人发送 `/connect` 信息。机器人应该会回复二维码。用Tonkeeper钱包扫描它。你将在聊天中看到 `Tonkeeper wallet connected!` 的信息。

我们会在许多地方使用连接器，因此让我们将创建连接器的代码移动到一个单独的文件中：

我们将在很多地方使用连接器，因此我们将创建连接器的代码移到一个单独的文件中：

```ts
// src/ton-connect/connector.ts

import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './storage';
import * as process from 'process';

export function getConnector(chatId: number): TonConnect {
    return new TonConnect({
        manifestUrl: process.env.MANIFEST_URL,
        storage: new TonConnectStorage(chatId)
    });
}
```

并在 `src/main.ts` 中导入它

```ts
// src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import QRCode from 'qrcode';
import { getConnector } from './ton-connect/connector';

bot.onText(/\/connect/, async msg => {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper')!;

    const link = connector.connect({
        bridgeUrl: tonkeeper.bridgeUrl,
        universalLink: tonkeeper.universalLink
    });
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image);
});
```

目前，我们的文件结构如下：

```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## 添加内联键盘

### 添加内嵌键盘

为了更好的用户体验，我们打算使用 Telegram 的 `callback_query` 和 `inline_keyboard` 功能。如果你不熟悉，可以在[这里](https://core.telegram.org/bots/api#callbackquery)阅读更多。

我们将为钱包连接实现以下用户体验：

我们将为钱包连接实施以下用户体验：

```text
First screen:
<Unified QR>
<Open @wallet>, <Choose a wallet button (opens second screen)>, <Open wallet unified link>

Second screen:
<Unified QR>
<Back (opens first screen)>
<@wallet button (opens third screen)>, <Tonkeeper button (opens third screen)>, <Tonhub button (opens third screen)>, <...>

Third screen:
<Selected wallet QR>
<Back (opens second screen)>
<Open selected wallet link>
```

首先，让我们在 `main.ts` 中为 `/connect` 命令处理程序添加内联键盘

```ts
// src/main.ts
bot.onText(/\/connect/, async msg => {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(async wallet => {
        if (wallet) {
            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            bot.sendMessage(chatId, `${walletName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });
});
```

注意我们替换了 `connector.connect` 调用参数。现在我们为所有钱包生成一个统一链接。

接下来我们告诉 Telegram，在用户点击 `选择钱包` 按钮时以 `{ "method": "chose_wallet" }` 值调用 `callback_query` 处理程序。

接下来我们告诉 Telegram，在用户点击 `选择钱包` 按钮时以 `{ "method": "chose_wallet" }` 值调用 `callback_query` 处理程序。

### 添加选择钱包按钮处理程序

让我们在那里添加“选择钱包”按钮点击处理程序：

让我们在这里添加 "选择钱包 "按钮点击处理程序：

```ts
// src/connect-wallet-menu.ts

async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {
    const wallets = await getWallets();

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                wallets.map(wallet => ({
                    text: wallet.name,
                    callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName })
                })),
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({
                            method: 'universal_qr'
                        })
                    }
                ]
            ]
        },
        {
            message_id: query.message!.message_id,
            chat_id: query.message!.chat.id
        }
    );
}
```

现在我们将添加全局 `callback_query` 处理程序并在其中注册 `onChooseWalletClick`：

现在，我们将添加全局 `callback_query` 处理程序，并在其中注册 `onChooseWalletClick`：

```ts
// src/connect-wallet-menu.ts
import { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets } from './ton-connect/wallets';
import { bot } from './bot';

export const walletMenuCallbacks = { // Define buttons callbacks
    chose_wallet: onChooseWalletClick
};

bot.on('callback_query', query => { // Parse callback data and execute corresponing function
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!walletMenuCallbacks[request.method as keyof typeof walletMenuCallbacks]) {
        return;
    }

    walletMenuCallbacks[request.method as keyof typeof walletMenuCallbacks](query, request.data);
});

// ... other code from the previous ster
async function onChooseWalletClick ...
```

现在我们应该将 `connect-wallet-menu.ts` 导入到 `src/main.ts`

现在，我们应该在 `main.ts` 中添加 `connect-wallet-menu.ts` 导入

```ts
// src/main.ts

// ... other imports

import './connect-wallet-menu';

// ... other code
```

编译并运行机器人。您可以点击 "选择钱包 "按钮，机器人将取代内嵌键盘按钮！

### 添加其他按钮处理程序

首先，我们将创建一个工具函数 `editQR`。编辑消息媒体（QR 图像）有点棘手。我们需要将图像存储到文件中并将其发送到 Telegram 服务器。然后我们可以删除这个文件。

首先，我们将创建一个实用程序函数 `editQR`。编辑消息媒体（QR 图像）有点麻烦。我们需要将图片存储到文件中并发送到 Telegram 服务器。然后我们可以删除该文件。

```ts
// src/connect-wallet-menu.ts

// ... other code


async function editQR(message: TelegramBot.Message, link: string): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    await QRCode.toFile(`./${fileName}`, link);

    await bot.editMessageMedia(
        {
            type: 'photo',
            media: `attach://${fileName}`
        },
        {
            message_id: message?.message_id,
            chat_id: message?.chat.id
        }
    );

    await new Promise(r => fs.rm(`./${fileName}`, r));
}
```

在 `onOpenUniversalQRClick` 处理程序中，我们只需重新生成 QR 和 deeplink 并修改信息：

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

// ... other code
```

在 `onWalletClick` 处理程序中，我们将为选定的钱包创建特殊的 QR 和通用链接，并修改信息。

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

现在，我们必须将这些函数注册为回调函数（`walletMenuCallbacks`）：

```ts
// src/connect-wallet-menu.ts
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets } from './ton-connect/wallets';
import { bot } from './bot';
import * as fs from 'fs';
import { getConnector } from './ton-connect/connector';
import QRCode from 'qrcode';

export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

// ... other code
```

<details>
<summary>目前，src/connect-wallet-menu.ts 看起来是这样的</summary>

```ts
// src/connect-wallet-menu.ts

import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets, getWalletInfo } from './ton-connect/wallets';
import { bot } from './bot';
import { getConnector } from './ton-connect/connector';
import QRCode from 'qrcode';
import * as fs from 'fs';

export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

bot.on('callback_query', query => { // Parse callback data and execute corresponing function
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
        return;
    }

    callbacks[request.method as keyof typeof callbacks](query, request.data);
});


async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {
    const wallets = await getWallets();

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                wallets.map(wallet => ({
                    text: wallet.name,
                    callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName })
                })),
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({
                            method: 'universal_qr'
                        })
                    }
                ]
            ]
        },
        {
            message_id: query.message!.message_id,
            chat_id: query.message!.chat.id
        }
    );
}

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

async function editQR(message: TelegramBot.Message, link: string): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    await QRCode.toFile(`./${fileName}`, link);

    await bot.editMessageMedia(
        {
            type: 'photo',
            media: `attach://${fileName}`
        },
        {
            message_id: message?.message_id,
            chat_id: message?.chat.id
        }
    );

    await new Promise(r => fs.rm(`./${fileName}`, r));
}
```

</details>

您可能会注意到，我们还没有考虑到 QR 代码过期和停止连接器的问题。我们稍后会处理这个问题。

目前我们有以下文件结构：

目前，我们的文件结构如下：

```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   ├── connect-wallet-menu.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## 执行交易发送

在编写发送事务的新代码之前，我们先清理一下代码。我们将为机器人命令处理程序创建一个新文件（"/connect"、"/send_tx"...）

```ts
// src/commands-handlers.ts

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import QRCode from 'qrcode';
import TelegramBot from 'node-telegram-bot-api';
import { getConnector } from './ton-connect/connector';

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });
}
```

让我们在 `main.ts` 中导入它，并将 `connect-wallet-menu.ts` 中的 `callback_query` 入口点移到 `main.ts`：

```ts
// src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import './connect-wallet-menu';
import { handleConnectCommand } from './commands-handlers';
import { walletMenuCallbacks } from './connect-wallet-menu';

const callbacks = {
    ...walletMenuCallbacks
};

bot.on('callback_query', query => {
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
        return;
    }

    callbacks[request.method as keyof typeof callbacks](query, request.data);
});

bot.onText(/\/connect/, handleConnectCommand);
```

```ts
// src/connect-wallet-menu.ts

// ... imports


export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {

// ... other code
```

现在我们可以添加 `send_tx` 命令处理程序：

```ts
// src/commands-handlers.ts

// ... other code

export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    connector
        .sendTransaction({
            validUntil: Math.round(Date.now() / 1000) + 600, // timeout is SECONDS
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        })
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Open Wallet',
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}
```

我们来注册这个处理程序：

让我们注册这个处理程序：

```ts
// src/main.ts

// ... other code

bot.onText(/\/connect/, handleConnectCommand);

bot.onText(/\/send_tx/, handleSendTXCommand);
```

目前我们有以下文件结构：

目前，我们的文件结构如下：

```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   ├── connect-wallet-menu.ts
│   ├── commands-handlers.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## 添加断开连接和显示已连接钱包的命令

这个命令的实现非常简单：

```ts
// src/commands-handlers.ts

// ... other code

export async function handleDisconnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, "You didn't connect a wallet");
        return;
    }

    await connector.disconnect();

    await bot.sendMessage(chatId, 'Wallet has been disconnected');
}

export async function handleShowMyWalletCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, "You didn't connect a wallet");
        return;
    }

    const walletName =
        (await getWalletInfo(connector.wallet!.device.appName))?.name ||
        connector.wallet!.device.appName;


    await bot.sendMessage(
        chatId,
        `Connected wallet: ${walletName}\nYour address: ${toUserFriendlyAddress(
            connector.wallet!.account.address,
            connector.wallet!.account.chain === CHAIN.TESTNET
        )}`
    );
}
```

并注册此命令：

```ts
// src/main.ts

// ... other code

bot.onText(/\/connect/, handleConnectCommand);
bot.onText(/\/send_tx/, handleSendTXCommand);
bot.onText(/\/disconnect/, handleDisconnectCommand);
bot.onText(/\/my_wallet/, handleShowMyWalletCommand);
```

编译并运行机器人，检查上述命令是否正确。

## 优化

我们已经完成了所有基本命令。但需要注意的是，每个连接器都会一直打开 SSE 连接，直到暂停为止。
此外，我们没有处理用户多次调用 `/connect`，或调用 `/connect` 或 `/send_tx`，但没有扫描 QR 的情况。我们应该设置超时并关闭连接，以节省服务器资源。
然后通知用户 QR 或事务请求已过期。

### 发送交易优化

让我们创建一个实用程序，它可以封装一个承诺，并在指定超时后拒绝接受它：

```ts
// src/utils.ts

export const pTimeoutException = Symbol();

export function pTimeout<T>(
    promise: Promise<T>,
    time: number,
    exception: unknown = pTimeoutException
): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    return Promise.race([
        promise,
        new Promise((_r, rej) => (timer = setTimeout(rej, time, exception)))
    ]).finally(() => clearTimeout(timer)) as Promise<T>;
}
```

在 `.env` 中添加超时参数值

让我们在 `.env` 中添加一个超时参数值

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
```

现在，我们将改进 `handleSendTXCommand` 函数，并将 tx 发送包入 `pTimeout` 中。

```ts
// src/commands-handlers.ts

// export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> { ...

pTimeout(
    connector.sendTransaction({
        validUntil: Math.round(
            (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
        ),
        messages: [
            {
                amount: '1000000',
                address: '0:0000000000000000000000000000000000000000000000000000000000000000'
            }
        ]
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
)
    .then(() => {
        bot.sendMessage(chatId, `Transaction sent successfully`);
    })
    .catch(e => {
        if (e === pTimeoutException) {
            bot.sendMessage(chatId, `Transaction was not confirmed`);
            return;
        }

        if (e instanceof UserRejectsError) {
            bot.sendMessage(chatId, `You rejected the transaction`);
            return;
        }

        bot.sendMessage(chatId, `Unknown error happened`);
    })
    .finally(() => connector.pauseConnection());

// ... other code
```

<details>
<summary>完整的 handleSendTXCommand 代码</summary>

```ts
export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    pTimeout(
        connector.sendTransaction({
            validUntil: Math.round(
                (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
            ),
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        }),
        Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
    )
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e === pTimeoutException) {
                bot.sendMessage(chatId, `Transaction was not confirmed`);
                return;
            }

            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Open Wallet',
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}
```

</details>

你可以将此参数设置为 `5000`，编译并重新运行机器人，测试其行为。

您可以将该参数设置为 `5000`，编译并重新运行机器人，测试其行为。

### 优化钱包连接流程

目前，我们通过钱包连接菜单步骤在每个导航上创建一个新的连接器。
这很糟糕，因为在创建新连接器时，我们并没有关闭之前的连接器连接。
让我们改进这种行为，为用户连接创建一个缓存映射。

<details>
<summary>src/ton-connect/connector.ts 代码</summary>

```ts
// src/ton-connect/connector.ts

import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './storage';
import * as process from 'process';

type StoredConnectorData = {
    connector: TonConnect;
    timeout: ReturnType<typeof setTimeout>;
    onConnectorExpired: ((connector: TonConnect) => void)[];
};

const connectors = new Map<number, StoredConnectorData>();

export function getConnector(
    chatId: number,
    onConnectorExpired?: (connector: TonConnect) => void
): TonConnect {
    let storedItem: StoredConnectorData;
    if (connectors.has(chatId)) {
        storedItem = connectors.get(chatId)!;
        clearTimeout(storedItem.timeout);
    } else {
        storedItem = {
            connector: new TonConnect({
                manifestUrl: process.env.MANIFEST_URL,
                storage: new TonConnectStorage(chatId)
            }),
            onConnectorExpired: []
        } as unknown as StoredConnectorData;
    }

    if (onConnectorExpired) {
        storedItem.onConnectorExpired.push(onConnectorExpired);
    }

    storedItem.timeout = setTimeout(() => {
        if (connectors.has(chatId)) {
            const storedItem = connectors.get(chatId)!;
            storedItem.connector.pauseConnection();
            storedItem.onConnectorExpired.forEach(callback => callback(storedItem.connector));
            connectors.delete(chatId);
        }
    }, Number(process.env.CONNECTOR_TTL_MS));

    connectors.set(chatId, storedItem);
    return storedItem.connector;
}
```

</details>

当`getConnector`被调用时，我们检查此`chatId`（用户）是否已在缓存中存在一个存在的连接器。如果存在，我们重置清理超时并返回连接器。
这允许保持活跃用户的连接器在缓存中。如果缓存中没有连接器，我们创建一个新的，注册一个超时清理函数并返回此连接器。

为了使它工作，我们必须在`.env`中添加一个新参数

为使其正常工作，我们必须在 `.env` 中添加一个新参数

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
CONNECTOR_TTL_MS=600000
```

现在让我们在 handelConnectCommand 中使用它

<details>
<summary>src/commands-handlers.ts 代码</summary>

```ts
// src/commands-handlers.ts

import {
    CHAIN,
    isWalletInfoRemote,
    toUserFriendlyAddress,
    UserRejectsError
} from '@tonconnect/sdk';
import { bot } from './bot';
import { getWallets, getWalletInfo } from './ton-connect/wallets';
import QRCode from 'qrcode';
import TelegramBot from 'node-telegram-bot-api';
import { getConnector } from './ton-connect/connector';
import { pTimeout, pTimeoutException } from './utils';

let newConnectRequestListenersMap = new Map<number, () => void>();

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    let messageWasDeleted = false;

    newConnectRequestListenersMap.get(chatId)?.();

    const connector = getConnector(chatId, () => {
        unsubscribe();
        newConnectRequestListenersMap.delete(chatId);
        deleteMessage();
    });

    await connector.restoreConnection();
    if (connector.connected) {
        const connectedName =
            (await getWalletInfo(connector.wallet!.device.appName))?.name ||
            connector.wallet!.device.appName;

        await bot.sendMessage(
            chatId,
            `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
                connector.wallet!.account.address,
                connector.wallet!.account.chain === CHAIN.TESTNET
            )}\n\n Disconnect wallet firstly to connect a new one`
        );

        return;
    }

    const unsubscribe = connector.onStatusChange(async wallet => {
        if (wallet) {
            await deleteMessage();

            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            await bot.sendMessage(chatId, `${walletName} wallet connected successfully`);
            unsubscribe();
            newConnectRequestListenersMap.delete(chatId);
        }
    });

    const wallets = await getWallets();

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    const botMessage = await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });

    const deleteMessage = async (): Promise<void> => {
        if (!messageWasDeleted) {
            messageWasDeleted = true;
            await bot.deleteMessage(chatId, botMessage.message_id);
        }
    };

    newConnectRequestListenersMap.set(chatId, async () => {
        unsubscribe();

        await deleteMessage();

        newConnectRequestListenersMap.delete(chatId);
    });
}

// ... other code
```

</details>

现在我们应该从`connect-wallet-menu.ts`中的函数中移除`connector.onStatusChange`订阅，
因为它们使用相同的连接器实例，且在`handleConnectCommand`中一个订阅足够了。

现在，我们应该从 `connect-wallet-menu.ts` 函数中移除 `connector.onStatusChange` 订阅，
，因为它们在 `handleConnectCommand` 中使用了同一个连接器实例和一个订阅。

<details>
<summary>src/connect-wallet-menu.ts 代码</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    const wallets = await getWallets();

    const selectedWallet = wallets.find(wallet => wallet.name === data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${data}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

</details>

就是这样！编译并运行机器人，尝试调用两次 `/connect`。

### 改进与 @wallet 的互动

首先，让我们创建一些实用函数：

首先，让我们创建一些实用功能：

```ts
// src/utils.ts
import { encodeTelegramUrlParameters, isTelegramUrl } from '@tonconnect/sdk';

export const AT_WALLET_APP_NAME = 'telegram-wallet';

// ... other code
export function addTGReturnStrategy(link: string, strategy: string): string {
    const parsed = new URL(link);
    parsed.searchParams.append('ret', strategy);
    link = parsed.toString();

    const lastParam = link.slice(link.lastIndexOf('&') + 1);
    return link.slice(0, link.lastIndexOf('&')) + '-' + encodeTelegramUrlParameters(lastParam);
}

export function convertDeeplinkToUniversalLink(link: string, walletUniversalLink: string): string {
    const search = new URL(link).search;
    const url = new URL(walletUniversalLink);

    if (isTelegramUrl(walletUniversalLink)) {
        const startattach = 'tonconnect-' + encodeTelegramUrlParameters(search.slice(1));
        url.searchParams.append('startattach', startattach);
    } else {
        url.search = search;
    }

    return url.toString();
}
```

由于我们在两个地方使用通用 QR 页面创建代码，我们将其移动到单独的函数中：

由于我们在两个地方使用通用 QR 页面创建代码，因此我们将其移至单独的功能中：

```ts
// src/utils.ts

// ... other code

export async function buildUniversalKeyboard(
    link: string,
    wallets: WalletInfoRemote[]
): Promise<InlineKeyboardButton[]> {
    const atWallet = wallets.find(wallet => wallet.appName.toLowerCase() === AT_WALLET_APP_NAME);
    const atWalletLink = atWallet
        ? addTGReturnStrategy(
            convertDeeplinkToUniversalLink(link, atWallet?.universalLink),
            process.env.TELEGRAM_BOT_LINK!
        )
        : undefined;

    const keyboard = [
        {
            text: 'Choose a Wallet',
            callback_data: JSON.stringify({ method: 'chose_wallet' })
        },
        {
            text: 'Open Link',
            url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(link)}`
        }
    ];

    if (atWalletLink) {
        keyboard.unshift({
            text: '@wallet',
            url: atWalletLink
        });
    }

    return keyboard;
}
```

在此，我们为第一屏幕（通用 QR 屏幕）添加了 @wallet 的单独按钮。剩下的工作就是在
connect-wallet 菜单和命令处理程序中使用该功能：

<details>
<summary>src/connect-wallet-menu.ts 代码</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    const keyboard = await buildUniversalKeyboard(link, wallets);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [keyboard]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

// ... other code
```

</details>


<details>
<summary>src/commands-handlers.ts 代码</summary>

```ts
// src/commands-handlers.ts

// ... other code

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    let messageWasDeleted = false;

    newConnectRequestListenersMap.get(chatId)?.();

    const connector = getConnector(chatId, () => {
        unsubscribe();
        newConnectRequestListenersMap.delete(chatId);
        deleteMessage();
    });

    await connector.restoreConnection();
    if (connector.connected) {
        const connectedName =
            (await getWalletInfo(connector.wallet!.device.appName))?.name ||
            connector.wallet!.device.appName;
        await bot.sendMessage(
            chatId,
            `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
                connector.wallet!.account.address,
                connector.wallet!.account.chain === CHAIN.TESTNET
            )}\n\n Disconnect wallet firstly to connect a new one`
        );

        return;
    }

    const unsubscribe = connector.onStatusChange(async wallet => {
        if (wallet) {
            await deleteMessage();

            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            await bot.sendMessage(chatId, `${walletName} wallet connected successfully`);
            unsubscribe();
            newConnectRequestListenersMap.delete(chatId);
        }
    });

    const wallets = await getWallets();

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    const keyboard = await buildUniversalKeyboard(link, wallets);

    const botMessage = await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [keyboard]
        }
    });

    const deleteMessage = async (): Promise<void> => {
        if (!messageWasDeleted) {
            messageWasDeleted = true;
            await bot.deleteMessage(chatId, botMessage.message_id);
        }
    };

    newConnectRequestListenersMap.set(chatId, async () => {
        unsubscribe();

        await deleteMessage();

        newConnectRequestListenersMap.delete(chatId);
    });
}

// ... other code
```

</details>

现在，当用户点击第二屏（选择钱包）上的钱包按钮时，我们将正确处理 TG 链接：

<details>
<summary>src/connect-wallet-menu.ts 代码</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code


async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    let buttonLink = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    let qrLink = buttonLink;

    if (isTelegramUrl(selectedWallet.universalLink)) {
        buttonLink = addTGReturnStrategy(buttonLink, process.env.TELEGRAM_BOT_LINK!);
        qrLink = addTGReturnStrategy(qrLink, 'none');
    }

    await editQR(query.message!, qrLink);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: buttonLink
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

</details>

现在让我们在 `send transaction` 处理器中为 TG 链接添加返回策略：

现在，让我们在 "发送事务 "处理程序中为 TG 链接添加返回策略：

<details>
<summary>src/commands-handlers.ts 代码</summary>

```ts
// src/commands-handlers.ts

// ... other code

export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    pTimeout(
        connector.sendTransaction({
            validUntil: Math.round(
                (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
            ),
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        }),
        Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
    )
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e === pTimeoutException) {
                bot.sendMessage(chatId, `Transaction was not confirmed`);
                return;
            }

            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    if (isTelegramUrl(deeplink)) {
        const url = new URL(deeplink);
        url.searchParams.append('startattach', 'tonconnect');
        deeplink = addTGReturnStrategy(url.toString(), process.env.TELEGRAM_BOT_LINK!);
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `Open ${walletInfo?.name || connector.wallet!.device.appName}`,
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}

// ... other code
```

</details>

就是这样。现在用户能够使用主屏幕上的特殊按钮连接 @wallet，我们也为 TG 链接提供了适当的返回策略。

## 添加一个永久存储空间

目前，我们将 TonConnect 会话存储在 Map 对象中。但你可能希望将其存储到数据库或其他永久存储中，以便在重新启动服务器时保存会话。
我们将使用 Redis 来实现，但你可以选择任何永久存储。

### 设置 redis

[查看包详情](https://www.npmjs.com/package/redis)

要使用 redis，你必须启动 redis 服务器。我们将使用 Docker 镜像：
`docker run -p 6379:6379 -it redis/redis-stack-server:latest`

现在将 redis 连接参数添加到 `.env`。默认的 redis url 是 `redis://127.0.0.1:6379`。

现在在 `.env` 中添加 redis 连接参数。默认的 redis 网址是 `redis://127.0.0.1:6379`。

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
CONNECTOR_TTL_MS=600000
REDIS_URL=redis://127.0.0.1:6379
```

让我们将 redis 集成到 `TonConnectStorage` 中：

```ts
// src/ton-connect/storage.ts

import { IStorage } from '@tonconnect/sdk';
import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });

client.on('error', err => console.log('Redis Client Error', err));

export async function initRedisClient(): Promise<void> {
    await client.connect();
}
export class TonConnectStorage implements IStorage {
    constructor(private readonly chatId: number) {}

    private getKey(key: string): string {
        return this.chatId.toString() + key;
    }

    async removeItem(key: string): Promise<void> {
        await client.del(this.getKey(key));
    }

    async setItem(key: string, value: string): Promise<void> {
        await client.set(this.getKey(key), value);
    }

    async getItem(key: string): Promise<string | null> {
        return (await client.get(this.getKey(key))) || null;
    }
}
```

为了使其正常工作，我们必须在 `main.ts` 中等待 redis 初始化。让我们将该文件中的代码封装为一个异步函数：

```ts
// src/main.ts
// ... imports

async function main(): Promise<void> {
    await initRedisClient();

    const callbacks = {
        ...walletMenuCallbacks
    };

    bot.on('callback_query', query => {
        if (!query.data) {
            return;
        }

        let request: { method: string; data: string };

        try {
            request = JSON.parse(query.data);
        } catch {
            return;
        }

        if (!callbacks[request.method as keyof typeof callbacks]) {
            return;
        }

        callbacks[request.method as keyof typeof callbacks](query, request.data);
    });

    bot.onText(/\/connect/, handleConnectCommand);

    bot.onText(/\/send_tx/, handleSendTXCommand);

    bot.onText(/\/disconnect/, handleDisconnectCommand);

    bot.onText(/\/my_wallet/, handleShowMyWalletCommand);
}

main();
```

## 摘要

下一步是什么？

- 如果要在生产环境中运行机器人，可能需要安装和使用进程管理器，如 [pm2](https://pm2.keymetrics.io/)。
- 您可以在机器人中添加更好的错误处理功能。

## 另请参见

- [发送信息](/v3/guidelines/ton-connect/guidelines/sending-messages)
- [集成手册](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/overview.md
================================================
import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 资产处理概述

在这里您可以找到关于[TON转账如何工作](/v3/documentation/dapps/assets/overview#overview-on-messages-and-transactions)的**简短概述**、您可以在 TON 中找到哪些 [资产类型](/v3/documentation/dapps/assets/overview#digital-asset-types-on-ton)（以及您将阅读 [下一个](/v3/documentation/dapps/assets/overview#read-next)），以及如何使用您的编程语言 [与 TON 交互](/v3/documentation/dapps/assets/overview#interaction-with-ton-blockchain)、建议在进入下一页之前，先了解下面发现的所有信息。

## 消息和交易概述

TON 区块链采用完全异步的方式，涉及一些传统区块链不常见的概念。特别是，任何行为者与区块链的每次交互都由智能合约和/或外部世界之间异步传输的 [消息](/v3/documentation/smart-contracts/message-management/messages-and-transactions) 组成。每笔交易由一条传入消息和最多 255 条传出消息组成。

[这里](/v3/documentation/smart-contracts/message-management/sending-messages#types-of-messages) 全面介绍了 3 种信息类型。简而言之

- [external message](/v3/documentation/smart-contracts/message-management/external-messages):
  - `external in message`（有时也称为 `external message`）是指从区块链外部*向区块链内部*的智能合约发送的消息。
  - `external in message`（有时也称为 `external message`）是指从区块链外部*向区块链内部*的智能合约发送的消息。
- [internal message](/v3/documentation/smart-contracts/message-management/internal-messages)从一个*区块链实体*发送到*另一个*，可携带一定数量的数字资产和任意部分的数据。

任何交互的共同路径都是从向 `钱包` 智能合约发送外部消息开始的，`钱包` 智能合约使用公钥加密技术验证消息发送者的身份，负责支付费用，并发送内部区块链消息。信息队列形成定向非循环图或树状图。

例如

![](/img/docs/asset-processing/alicemsgDAG.svg)

- `Alice` 使用 [Tonkeeper](https://tonkeeper.com/) 向她的钱包发送 `external message`。
- `external message` 是 `wallet A v4` 合约的输入信息，其来源为空（不知从何而来的信息，如 [Tonkeeper](https://tonkeeper.com/)）。
- `outgoing message` 是  `wallet A v4`  合约的输出信息和 `wallet B v4` 合约的输入信息，`wallet A v4` 是来源地，`wallet B v4` 是目的地。

因此，有 2 个事务及其输入和输出信息集。

当合约将消息作为输入（由其触发）时，对其进行处理并生成或不生成外发消息作为输出的每个动作都称为 "事务"。点击 [这里 ](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-transaction)阅读更多关于事务的信息。

这种 "事务" 可以跨越一段**长**的时间。从技术上讲，具有信息队列的交易被汇总到验证器处理的区块中。TON区块链的异步性质**无法在发送消息阶段预测交易**的哈希值和逻辑时间。

区块接受的 "交易" 是最终的，不能修改。

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参见 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

智能合约为交易支付多种类型的[手续费](/v3/documentation/smart-contracts/transaction-fees/fees)（通常从收到的消息余额中支付，行为取决于[消息模式](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)）。费用金额取决于工作链配置，"主链 "上的费用最高，"基础链 "上的费用最低。

## TON 上的数字资产类型

TON 拥有三类数字资产。

- Toncoin 是网络的主要代币。它可用于区块链上的所有基本操作，例如支付
  gas 费或为验证进行押注。
- 合约资产，如代币和 NFT，类似于 ERC-20/ERC-721 标准，由任意合约管理，因此可能需要自定义处理规则。你可以在 [process NFTs](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) 和 [process Jettons](/v3/guidelines/dapps/asset-processing/jettons) 两篇文章中找到更多关于其处理的信息。
- 原生代币，是一种可以附加到网络上任何信息的特殊资产。但由于发行新原生代币的功能已经关闭，这些资产目前还没有被使用。

## 与 TON 区块链的互动

TON 区块链上的基本操作可通过 TonLib 进行。它是一个共享库，可以与 TON 节点一起编译，并通过所谓的精简版服务器（精简版客户端的服务器）公开与区块链交互的 API。TonLib 采用无信任方法，检查所有传入数据的证明；因此，无需可信数据提供者。TonLib 可用的方法在[TL 方案](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234) 中列出。这些方法可通过[wrappers](/v3/guidelines/dapps/asset-processing/payments-processing/#sdks) 作为共享库使用。

## 阅读下一页

阅读本文后，您可以查看

1. [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)，了解如何使用 "TON coins"。
2. [Jetton处理](/v3/guidelines/dapps/asset-processing/jettons) 以了解如何使用 "jettons"（有时称为 "tokens"）。
3. [NFT处理](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) 以了解如何使用 "NFT"（即 "jetton "的特殊类型）。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/usdt.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/usdt.md
================================================
import Button from '@site/src/components/button'

# USDT 处理

## Tether

稳定币是一种加密货币，其价值与另一种资产（如法定货币或黄金）1:1挂钩，以保持价格稳定。直到最近，存在一种名为jUSDT的代币，它是通过Ethereum的ERC-20代币桥接<a href="https://bridge.ton.org" target="_blank">bridge.ton.org</a>转换而来的 。然而，在[2023年4月18日](https://t.me/toncoin/824)，由 <a href="https://tether.to/en/" target="_blank">Tether</a> 公司发行的原生USD₮代币进行了公开发布。USD₮发布后，jUSDT成为了次要优先级的代币，但仍然作为USD₮的替代品或补充在服务中使用。

在 TON 区块链中，美元作为[Jetton 资产](/v3/guidelines/dapps/asset-processing/jettons) 得到支持。

:::info
要在 TON 区块链上集成 Tether 的 USD₮ 代币，请使用合约地址：
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton Processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT 支付演示</Button>

## 在 TON 上使用 USD₮ 的优势

### 无缝集成 Telegram

[TON 上的 USD₮](https://ton.org/borderless) 将无缝集成到 Telegram 中，提供独特的用户友好体验，使 TON 成为进行 USDt 交易最方便的区块链。这一整合将简化 Telegram 用户的 DeFi，使其更易于使用和理解。

### 降低交易费用

以太坊 USD₮ 转账所消耗的费用是根据网络负载动态计算的。这就是为什么交易费用会很高。

```cpp
transaction_fee = gas_used * gas_price
```

- `gas_used` 是事务执行过程中使用的 gas 量。
- 以 Gwei 为单位的 `gas_price`  gas 价格，动态计算

另一方面，如今在 TON 区块链上发送任意金额的美元的平均费用约为 0.0145 TON。即使 TON 价格上涨 100 倍，交易也将 [保持超低价](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost)。TON 的核心开发团队对 Tether 的智能合约进行了优化，使其比其他任何 Jetton 便宜三倍。

### 更快、可扩展

TON 的高吞吐量和快速确认时间使美元交易的处理速度比以往任何时候都快。

## 高级详细信息

:::caution 重要事项

参见重要 [建议](/v3/guidelines/dapps/asset-processing/jettons)。
:::

## 另请参见

- [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/coins.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/coins.md
================================================
# 原生代币：Toncoin

TON 区块链的原生加密货币是 **Toncoin**。

交易费、gas费（即智能合约消息处理费）和持久存储费用都以 Toncoin 收取。

Toncoin 用于支付成为区块链验证者所需的押金。

制作 Toncoin 支付的过程在[相应部分](/develop/dapps/asset-processing)有描述。

您可以在[网站](https://ton.org/coin)上找到在哪里购买或交换 Toncoin。

## 额外代币

TON 区块链支持多达 2^32 种内建的额外代币。

额外代币余额可以存储在每个区块链账户上，并原生地（在一个智能合约到另一个智能合约的内部消息中，您可以除了 Toncoin 数量之外，指定一个额外代币数量的哈希映射）转移到其他账户。

TLB: `extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;` - 代币 ID 和数量的哈希映射。

然而，额外代币只能像 Toncoin 那样存储和转移，并且没有自己的任意代码或功能。

注意，如果创建了大量额外代币，账户会因为需要存储它们而“膨胀”。

因此，额外代币最适合用于知名的去中心化货币（例如，Wrapped Bitcoin 或 Ether），并且创建这样的额外代币应该相当昂贵。

对于其他任务，[Jettons](/develop/dapps/defi/tokens#jettons) 更为合适。

目前，TON 区块链上尚未创建任何额外代币。TON 区块链对账户和消息完全支持额外代币，但创建它们的铸币系统合约尚未创建。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/subscriptions.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/subscriptions.md
================================================
# 内容订阅

由于 TON 区块链中的交易快速，网络费用低廉，您可以通过智能合约在链上处理定期支付。

例如，用户可以订阅数字内容（或其他任何东西）并被收取每月 1 TON 的费用。

:::tip
此内容是版本v4的钱包的特定内容。旧钱包没有此功能；它也可以在未来版本中更改。
:::

:::warning
Subscription contract requires authorization exactly once, on installation; then it can withdraw TON as it pleases. Do your own research before attaching unknown subscriptions.

另一方面，用户不能在不知情的情况下安装订阅程序。
:::

## 示例流程

- 用户使用 v4 钱包。它允许额外的智能合约，称为插件，扩展它的功能。

  在确保其功能后，用户可以批准他钱包的可信智能合约(插件)的地址。 此后，可信的智能合约可以从钱包中提取Tonco币。这类似于其他区块链中的“无限审批”。

- 每个用户和服务之间使用中间订阅智能合约作为钱包插件。

  该智能合约保证在指定周期内，用户钱包中的指定数量的 Toncoin 不会被扣除超过一次。

- 服务的后端通过向订阅智能合约发送外部消息，定期发起支付。

- 用户或服务可以决定他们不再需要订阅并终止订阅。

## 智能合约示例

- [钱包 v4 智能合约源代码](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
- [订阅智能合约源代码](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## 实现

一个良好的实现案例是通过 [@donate](https://t.me/donate) 机器人和 [Tonkeeper 钱包](https://tonkeeper.com) 对 Telegram 中私人频道的 Toncoin 进行去中心化订阅。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/tokens.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/tokens.mdx
================================================
import Button from '@site/src/components/button'

# 代币（FT, NFT）

[分布式 TON 代币概述](https://telegra.ph/Scalable-DeFi-in-TON-03-30)

> 由 TON 驱动的代币和 NFT 没有单一中心，不会造成瓶颈。
>
> 特定集合中的每个 NFT 都是一个独立的智能合约。每个用户的代币余额都存储在单独的用户钱包中。
>
> 智能合约之间直接互动，分散了整个网络的负载。
>
> 随着用户和交易数量的增长，负载仍将保持均衡，从而使网络得以扩展。

## TON 课程：Jettons 和 NFT

:::tip
在开始课程之前，请确保您已充分了解区块链技术的基础知识。如果您的知识有缺口，我们建议您参加[区块链基础知识与 TON](https://stepik.org/course/201294/promo)（[RU 版本](https://stepik.org/course/202221/), [CHN 版本](https://stepik.org/course/200976/)）课程。
模块 4 涵盖 NFT 和 Jettons 的基本知识。
:::


模块 7 完全涵盖**NFT 和 Jettons**开发。

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

查看 TON 区块链课程

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

中国

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## 教程

- [Web3 游戏教程](/v3/guidelines/dapps/tutorials/web3-game-example) - 学习如何使用 TON 区块链构建 Web3 游戏。
- [铸造您的第一个 Jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token/) - 学习如何部署和定制您的第一个 Jetton
- [[YouTube] TON Keeper 创始人 Oleg Andreev and Oleg Illarionov 谈 TON jettons](https://www.youtube.com/watch?v=oEO29KmOpv4)

### TON 速成

- [🚩 挑战 1：简单的 NFT 部署](https://github.com/romanovichim/TONQuest1)
- [🚩 挑战2：聊天机器人合约](https://github.com/romanovichim/TONQuest2)
- [🚩 挑战 3：Jetton 自动售卖机](https://github.com/romanovichim/TONQuest3)
- [🚩 挑战 4：抽奖/彩票](https://github.com/romanovichim/TONQuest4)
- [🚩 挑战 5：在 5 分钟内创建与合约交互的用户界面](https://github.com/romanovichim/TONQuest5)
- [🚩 挑战 6：分析 Getgems 市场上的 NFT 销售](https://github.com/romanovichim/TONQuest6)

## 指南

### 指南

- [TON jetton 处理](/v3/guidelines/dapps/asset-processing/jettons)
- [TON 元数据解析](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

### 标准

- [Jettons 标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)

### 智能合约

- [智能合约实现（FunC）](https://github.com/ton-blockchain/token-contract/)

### Jetton 部署器

Jettons 是 TON 区块链上的自定义可替代代币。您可以使用下面的 Jetton Deployer 示例在 TON 区块链上创建自己的代币：

- **[TON Minter](https://minter.ton.org/)** - 开放源码 Jetton Deployer dApp
- [Jetton Deployer - contracts](https://github.com/ton-defi-org/jetton-deployer-contracts) (FunC, TL-B)
- [Jetton Deployer - WebClient](https://github.com/ton-defi-org/jetton-deployer-webclient) (React, TypeScript)

### 使用 Jettons 的工具

- [NFT Jetton 销售合约](https://github.com/dvlkv/nft-jetton-sale-smc) - 支持 jetton 的 NFT 销售合约
- [Scaleton](http://scaleton.io)—查看您的自定义代币余额
- [@tegro/ton3-client](https://github.com/TegroTON/ton3-client#jettons-example)—查询 Jettons 信息的 SDK

## 标准

### 标准

- [NFT 标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [SBT（Soulbound NFT）标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md)
- [NFTRoyalty标准扩展](https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md)

### 智能合约

- [智能合约实施（FunC）](https://github.com/ton-blockchain/token-contract/)
- [Getgems NFT、销售、拍卖智能合约 (FunC)](https://github.com/getgems-io/nft-contracts)

### NFT 铸币器

- [由 TON Diamonds 提供的 NFT 部署器](https://github.com/tondiamonds/ton-nft-deployer) (TypeScript，无注释)
- [NFT 铸币示例](https://github.com/ton-foundation/token-contract/tree/main/nft/web-example) (JavaScript，带注释)
- [使用 React 的 NFT 铸币器](https://github.com/tonbuilders/tonbuilders-minter) (React，无注释)
- [NFT 部署器](https://github.com/anomaly-guard/nft-deployer) (Python，带注释)
- [使用 Golang 的 NFT 铸币器](https://github.com/xssnick/tonutils-go#nft) (Golang 库，带注释和完整示例)

### 使用 NFT 的工具

- [LiberMall/tnt](https://github.com/LiberMall/tnt)—TNT 是一个一体化命令行工具，用于在 The Open Network 上查询、编辑和铸造新的非同质化代币。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/ton-payments.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/ton-payments.md
================================================
# TON 支付

TON 支付是微支付通道的平台。

它允许即时支付，无需将所有交易提交到区块链、支付相关交易费用（例如，为消耗的燃料支付费用）以及等待五秒钟，直到确认包含有关交易的区块。

因为此类即时支付的总费用如此之低，它们可以用于游戏、API 和链下应用程序中的微支付。[查看示例](/develop/dapps/defi/ton-payments#examples)。

- [TON 上的支付](https://blog.ton.org/ton-payments)

## 支付通道

### 智能合约

- [ton-blockchain/payment-channels](https://github.com/ton-blockchain/payment-channels)

### SDK

使用支付通道，您不需要深入了解加密学。

您可以使用准备好的 SDK：

- [toncenter/tonweb](https://github.com/toncenter/tonweb) JavaScript SDK
- [toncenter/payment-channels-example](https://github.com/toncenter/payment-channels-example) - 如何使用 tonweb 的支付通道。

### 示例

在 [Hack-a-TON #1](https://ton.org/hack-a-ton-1) 获奖者中找到支付通道的使用示例：

- [grejwood/Hack-a-TON](https://github.com/Grejwood/Hack-a-TON) - OnlyTONs 支付项目（[网站](https://main.d3puvu1kvbh8ti.amplifyapp.com/)，[视频](https://www.youtube.com/watch?v=38JpX1vRNTk)）
- [nns2009/Hack-a-TON-1_Tonario](https://github.com/nns2009/Hack-a-TON-1_Tonario) - OnlyGrams 支付项目（[网站](https://onlygrams.io/)，[视频](https://www.youtube.com/watch?v=gm5-FPWn1XM)）
- [sevenzing/hack-a-ton](https://github.com/sevenzing/hack-a-ton) - TON 中的按需求支付 API 使用（[视频](https://www.youtube.com/watch?v=7lAnbyJdpOA\\&feature=youtu.be)）
- [illright/diamonds](https://github.com/illright/diamonds) - 按分钟支付学习平台（[网站](https://diamonds-ton.vercel.app/)，[视频](https://www.youtube.com/watch?v=g9wmdOjAv1s)）

## 参阅

- [支付处理](/develop/dapps/asset-processing)
- [TON Connect](/develop/dapps/ton-connect)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/about_blockchain_oracles.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/about_blockchain_oracles.md
================================================
# 关于预言机

预言机是将区块链与外部系统连接在一起的实体，允许智能合约根据现实世界的输入和输出执行。

## 区块链预言机如何工作

区块链预言机是一种专门服务，是现实世界与区块链技术之间的桥梁。它们为智能合约提供来自外部世界的相关必要信息，如汇率、支付状态甚至天气状况。这些数据有助于自动执行智能合约，而无需人工直接干预。

预言机背后的基本原则是，他们能够通过连接到各种在线资源来收集数据，从而在区块链之外运作。 虽然预言机并不是区块链本身的一部分， 它们作为可靠地将外部数据输入系统的中间人，在使其运作方面发挥着关键作用。

大多数交易工具都倾向于去中心化，以避免依赖单一数据源所带来的风险。这为系统提供了更高的安全性和可靠性，因为数据在用于智能合约之前会通过节点网络进行验证和确认。这种方法最大限度地降低了操纵和错误的风险，确保了所提供信息的准确性和时效性。

## 区块链规则的多样性

区块链按不同方面分类：操作机制、数据来源、数据方向和治理结构。 让我们看看最常见的预言机类型。

### 软件和硬件预言机

软件与演处理存储在数据库、服务器、云存储等各种数字源中的在线数据。硬件预言机将物理世界与数字世界连接起来，使用传感器和扫描仪将现实世界事件的数据传输到区块链上。

### 传入和传出的预言机

导入预言机向区块链输入信息，例如用于保险合约的天气数据。而导出预言机则将数据从区块链发送到外部世界，如交易通知。这是提高可靠性和解决单点故障问题所必需的。

### 集中式和去中心化预言机

集中式预言机由单方控制，存在安全和可靠性风险。去中心化型预言机使用多个节点来验证数据，因此更加安全可靠。

### 特定智能合约的预言机

这些预言机是为了某些智能合约而单独研制的，由于其特殊性和高昂的开发成本，这些预言机可能不那么受欢迎。

### 跨链预言机

这些用于在不同的区块链之间传输数据。当网络不兼容时使用。 有助于使用跨链交易的分散应用程序，例如将加密资产从一个网络转移到另一个网络。

## 区块链预言机的应用

区块链预言机架起了区块链数字世界与现实生活之间的桥梁，开辟了广泛的应用领域。让我们来看看区块链预言机的一些最常用的用途。

### DeFi（去中心化金融）

通过提供市场价格和加密货币数据，预言机在 DeFi 生态系统中发挥着至关重要的作用。价格指标允许 DeFi 平台将代币价值与实际资产挂钩，这对于控制流动性和确保用户头寸至关重要。这使得交易更加透明和安全，有助于提高金融交易的稳定性和可靠性。

### 保险

预言机可以自动读取和分析各种来源的数据，以确定保险事件的发生。 这使保险合约能够自动支付索偿，减少了手工处理每个案件的必要性，并加快了对保险事件的反应时间。

### 物流

在物流中使用oracles，可以让智能合约根据从车辆上的条形码扫描仪或传感器接收到的数据自动执行支付和其他操作。这可以最大限度地减少错误和延误，从而提高交付的准确性和效率。

### 随机号码生成

在智能合约中很难生成随机数，因为所有操作都必须是可复制和可预测的，这与随机性的概念相矛盾。预言机通过将外部世界的数据引入合约来解决这个问题。它们可以为游戏和彩票生成可验证的随机数，确保结果的公平性和透明度。

## TON 中的预言机列表

- [RedStone Oracles](/develop/oracles/red_stone)
- [RedStone Oracles](/v3/documentation/dapps/oracles/red_stone)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/pyth.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/pyth.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Pyth Oracles

## 如何在 TON 合约中使用实时数据

TON 上的 Pyth 价格反馈通过主 TON Pyth 智能
合约进行管理，实现与链上数据的无缝交互。在 TON，
Pyth 接收器合约中的特定功能促进了这些交互。该合约充当 Pyth
价格源的接口，处理价格数据的检索和更新。

## 安装 Pyth SDK

使用 npm 或 yarn 安装 Pyth TON SDK 和其他必要的依赖项：

```ts
   npm install @pythnetwork/pyth-ton-js @pythnetwork/hermes-client
   @ton/core @ton/ton @ton/crypto
```

   或

```ts
   yarn add @pythnetwork/pyth-ton-js @pythnetwork/hermes-client
   @ton/core @ton/ton @ton/crypto
```

## 编写客户端代码

下面的代码片段演示了如何获取价格更新、与 TON 上的 Pyth 合约交互以及更新价格馈送：

- TON Mainnet: [EQBU6k8HH6yX4Jf3d18swWbnYr31D3PJI7PgjXT-flsKHqql](https://docs.pyth.network/price-feeds/contract-addresses/ton)
- TON 测试网：[EQB4ZnrI5qsP_IUJgVJNwEGKLzZWsQOFhiaqDbD7pTt_f9oU](https://docs.pyth.network/price-feeds/contract-addresses/ton)

以下示例使用的是 testnet 合约。要使用主网，请将 `PYTH_CONTRACT_ADDRESS_TESTNET` 相应改为 `PYTH_CONTRACT_ADDRESS_MAINNET` 。 

```ts
import { TonClient, Address, WalletContractV4 } from "@ton/ton";
import { toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { HermesClient } from "@pythnetwork/hermes-client";
import {
  PythContract,
  PYTH_CONTRACT_ADDRESS_TESTNET,
  calculateUpdatePriceFeedsFee,
} from "@pythnetwork/pyth-ton-js";
const BTC_PRICE_FEED_ID =
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
async function main() {
  // Initialize TonClient
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: "your-api-key-here", // Optional
  });
  // Create PythContract instance
  const contractAddress = Address.parse(PYTH_CONTRACT_ADDRESS_TESTNET);
  const contract = client.open(PythContract.createFromAddress(contractAddress));
  // Get current guardian set index
  const guardianSetIndex = await contract.getCurrentGuardianSetIndex();
  console.log("Guardian Set Index:", guardianSetIndex);
  // Get BTC price from TON contract
  const price = await contract.getPriceUnsafe(BTC_PRICE_FEED_ID);
  console.log("BTC Price from TON contract:", price);
  // Fetch latest price updates from Hermes
  const hermesEndpoint = "https://hermes.pyth.network";
  const hermesClient = new HermesClient(hermesEndpoint);
  const priceIds = [BTC_PRICE_FEED_ID];
  const latestPriceUpdates = await hermesClient.getLatestPriceUpdates(
    priceIds,
    { encoding: "hex" }
  );
  console.log("Hermes BTC price:", latestPriceUpdates.parsed?.[0].price);
  // Prepare update data
  const updateData = Buffer.from(latestPriceUpdates.binary.data[0], "hex");
  console.log("Update data:", updateData);
  // Get update fee
  const updateFee = await contract.getUpdateFee(updateData);
  console.log("Update fee:", updateFee);
  const totalFee =
    calculateUpdatePriceFeedsFee(BigInt(updateFee)) + BigInt(updateFee);
  // Update price feeds
  const mnemonic = "your mnemonic here";
  const key = await mnemonicToPrivateKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });
  const provider = client.open(wallet);
  await contract.sendUpdatePriceFeeds(
    provider.sender(key.secretKey),
    updateData,
    totalFee
  );
  console.log("Price feeds updated successfully.");
}
main().catch(console.error);
```

该代码段的功能如下：

1. 初始化一个 `TonClient` 并创建一个 `PythContract` 实例。
2. 从 TON 合约中读取当前的守护套利指数和 BTC 价格。
3. 从Hermes获取最新价格更新。
4. 准备更新数据并计算更新费。
5. 更新 TON 合约的价格信息。

## 其他资源

您可能会发现这些额外的资源对开发您的 TON 申请很有帮助：

- [TON文档](https://ton.org/docs/)
- [Pyth Price Feed IDs](https://pyth.network/developers/price-feed-ids)
- [Pyth TON Contract](https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/ton/contracts)
- [Pyth TON SDK](https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/ton/sdk)
- [Pyth TON 示例](https://github.com/pyth-network/pyth-examples/tree/main/price_feeds/ton/sdk_js_usage)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/red_stone.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/red_stone.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# RedStone Oracles

## RedStone oracles 如何与 TON 一起工作

RedStone oracles采用另一种设计，为智能合约提供预言机数据。数据提供者不在合约存储中持续保存数据，而是在终端用户需要时才将信息引入链上。在此之前，数据一直保存在去中心化缓存层中，该层由 RedStone light 缓存网关和流数据广播协议提供支持。数据由终端用户传输至合约，终端用户应在函数调用中附加已签名的数据包。信息完整性通过签名检查在链上进行验证。

要了解更多有关 RedStone 算法设计的信息，请访问 [RedStone docs](https://docs.redstone.finance/docs/introduction)。

## 文件链接

- [Redstone TON Connector](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector)

## 智能合约

### price_manager.fc

- 用
  FunC 编写的消费 RedStone Oracle数据的 Oracle 合约示例 [price_manager.fc](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/contracts/price_manager.fc)。它需要 [TVM Upgrade 2023.07](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07)。

#### 初始化数据

如上所述，传输到合约的数据包是通过签名检查来验证的。
为达到 "签名者数量阈值"，签署所传递数据
的签名者应是初始数据中传递的 "签名者 "之一。此外，还需要
传递 `signer_count_threshold` 。

由于 TON 合约的结构，初始数据必须与合约的存储结构
进行连接，其结构如下：

```ts
  begin_cell()
    .store_uint(signer_count_threshold, 8)  /// number as passed below
    .store_uint(timestamp, TIMESTAMP_BITS)  /// initially 0 representing the epoch 0
    .store_ref(signers)                     /// serialized tuple of values passed below
  .end_cell();
```

`signers` 的值应以序列化的 `int` 的 `tuple` 形式传递。
参见 [tuple](https://github.com/ton-core/ton-core/blob/main/src/tuple/tuple.ts)。

<!-- To define the initial (storage) data for the Prices contract, use the predefined
class [PriceManagerInitData.ts](../src/price-manager/PriceManagerInitData.ts). -->

在下面的函数参数中，每个 `feed_id` 都是一个编码为 `int` 的字符串，这意味着，这是一个由字符串中特定字母的十六进制值组成的值
。例如：
`'ETH'` 为 `int` ，十六进制为`0x455448`，十进制为`4543560`，即`256*256*ord('E')+256*ord('T')+ord('H')`。

您可以使用 `feed_id=hexlify(toUtf8Bytes(feed_string))` 转换特定值或
[endpoint](https://cairo-utils-web.vercel.app/)

`feed_ids` 的值应以 `int` 的序列化 `元组` 形式传递。

`payload` 值由代表序列化 RedStone 有效载荷的字节数组打包而成。
请参阅下文 [TON RedStone payload packing](#ton-redstone-payload-packing) 部分，以及包含所有所需 `int` 长度常量的文件[constants.fc](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/contracts/redstone/constants.fc)。

#### get_prices

```func
(cell) get_prices_v2(cell data_feed_ids, cell payload) method_id;
```

该函数在链上处理作为参数传递的 `payload`
，并返回作为标识符在 `feed_ids` 中传递的每个 feed 的汇总值的 `cell`。

由于 TON API v4 中 HTTP GET 方法的长度限制，该函数是为 TON API v2 编写的。

这只是一个 `method_id` 函数--它们不会修改合约的存储空间，也不会消耗 TON。

#### OP_REDSTONE_WRITE_PRICES

无论采用哪种即时处理方式，也存在一种在链上处理 `payload` 的方法，但
会将汇总值保存/写入合约的存储空间。这些值会保存在合约的存储空间中，然后可以使用 `read_prices` 函数读取。使用 `read_timestamp` 函数可以读取上次保存/写入合约的数据的时间戳。

该方法必须以 TON 内部报文的形式调用。信息参数如下

- 一个 `int` 表示 RedStone_Write_Prices 名称，由 keccak256 散列，在 [constants.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts) 中定义为
  。
- 一个 `cell` - ref，将 `data_feed_ids` 表示为序列化的 `int`s.tuple\`.
- 一个 `cell` - 表示打包的 RedStone 有效载荷的 ref

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_WRITE_PRICES) {
        cell data_feeds_cell = in_msg_body~load_ref();
        cell payload_cell = in_msg_body~load_ref();

    // ...
    }
```

这是一条内部信息--它消耗 GAS 并修改合约的存储空间，因此必须以 TON 为单位支付。

请访问： https://ton-showroom.redstone.finance/ 了解其工作原理

#### read_prices

```func
(tuple) read_prices(tuple data_feed_ids) method_id;
```

该函数读取合约存储中的持久化值，并返回与
传递的 `feed_ids` 相对应的元组。
该函数不会修改存储空间，只能读取
使用 `write_prices` 函数保存的 "feed_ids "的汇总值。

这只是一个 `method_id` 函数--它不会修改合约的存储空间，也不会消耗 TON。

#### read_timestamp

```func
(int) read_timestamp() method_id;
```

返回使用 `OP_REDSTONE_WRITE_PRICES` 消息最后一次保存/写入合约存储空间的数据的时间戳。

这只是一个 `method_id` 函数--它不会修改合约的存储空间，也不会消耗 TON。

### price_feed.fc

由于 TON 合约的架构设计，初始数据需要与合约的存储结构相匹配。
其结构如下：

```ts
beginCell()
  .storeUint(BigInt(hexlify(toUtf8Bytes(this.feedId))), consts.DATA_FEED_ID_BS * 8)
  .storeAddress(Address.parse(this.managerAddress))
  .storeUint(0, consts.DEFAULT_NUM_VALUE_BS * 8)  /// initially 0 representing the epoch 0
  .storeUint(0, consts.TIMESTAMP_BS * 8)
  .endCell();
```

要定义价格进给合约的初始（存储）数据，请使用预定义的
类 [PriceFeedInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/price-feed/PriceFeedInitData.ts)。

#### OP_REDSTONE_FETCH_DATA

无论从网络外部读取持久化在合约中的值，
，都有可能直接在链上获取存储在合约中的 `feed_id` 值。
必须调用内部消息 `OP_REDSTONE_FETCH_DATA`。消息参数如下

- 一个 `int` 表示 `RedStone_Fetch_Data` 名称，由 keccak256 散列，在 [constants.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts) 中定义
  。
- 代表 `feed_id` 值的 `int` 。
- 代表信息的 "初始发送方 "的 "slice"，以便他们在返回交易时携带剩余的交易余额
  。

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_FETCH_DATA) {
        int feed_id = in_msg_body~load_uint(DATA_FEED_ID_BITS);
        cell initial_payload = in_msg_body~load_ref();

        // ...
    }
```

返回信息 `OP_REDSTONE_DATA_FETCHED` 会发送给发送方，其中包含 "值 "和
已保存值的 "时间戳"。然后，可在发送方中获取并处理该信息，或将其保存在
发送方的存储器中。
初始 payload 的 `ref` (`initial_payload`)会被添加为 ref，例如包含第一条信息的发件人，
，以便他们携带剩余的交易余额。

```ts
begin_cell()
  .store_uint(value, MAX_VALUE_SIZE_BITS)
  .store_uint(timestamp, TIMESTAMP_BITS)
  .store_ref(initial_payload)
  .end_cell()
```

这是一条内部信息--它消耗 GAS 并修改合约的存储空间，因此必须以 TON 为单位支付。

#### get_price_and_timestamp

```func
(int, int) get_price_and_timestamp() method_id;
```

通过发送 `OP_REDSTONE_FETCH_DATA` 消息并获取 `OP_REDSTONE_DATA_FETCHED` 消息的返回值，返回上次保存/写入适配器存储的数据值和时间戳。

这只是一个 `method_id` 函数 - 它不会修改合约的存储空间，也不会消耗 TON。

### single_feed_man.fc

#### 初始数据

与 `prices` 和 `price_feed` 初始数据类似。由于 TON 合约的架构设计，初始数据需要与合约的存储结构相匹配，其构造如下：

```ts
beginCell()
  .storeUint(BigInt(hexlify(toUtf8Bytes(this.feedId))), consts.DATA_FEED_ID_BS * 8)
  .storeUint(this.signerCountThreshold, SIGNER_COUNT_THRESHOLD_BITS)
  .storeUint(0, consts.DEFAULT_NUM_VALUE_BS * 8)
  .storeUint(0, consts.TIMESTAMP_BS * 8)
  .storeRef(serializeTuple(createTupleItems(this.signers)))
  .endCell();
```

要定义定价合约的初始（存储）数据，请使用预定义的
类 [SingleFeedManInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/single-feed-man/SingleFeedManInitData.ts) 。

类似于 `price_manager` 的合约，但只支持
单个 feed，以省略 feed 与管理器合约之间的通信需求。

#### get_price

```func
(int, int) get_price(cell payload) method_id;
```

与 `get_prices` 类似，但省略了第一个参数（`data_feed_ids`），因为在
初始化时已对其进行了配置。同时也会返回传入数据包的最小时间戳。

#### read_price_and_timestamp

```func
(int, int) read_price_and_timestamp() method_id;
```

与 `get_price_and_timestamp` 函数一样。

#### OP_REDSTONE_WRITE_PRICE

与 `OP_REDSTONE_WRITE_PRICES` 类似，但省略了第一个 (`data_feed_ids`) `cell`-引用，因为在初始化时已对其进行了配置。

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_WRITE_PRICE) {
        cell payload_cell = in_msg_body~load_ref();

        // ...
    }
```

### sample_consumer.fc

存储在 `price_feed` 中的数据的示例消费者。也适用于 `single_feed_man`。
需要传递要调用的 `price_feed`。

#### 初始数据

与 `price_feed` 初始数据类似。由于 TON 合约的架构设计，初始数据需要与合约的存储结构相匹配，其构造如下：

```ts
beginCell()
  .storeAddress(Address.parse(this.feedAddress))
  .endCell();
```

要定义价格合约的初始（存储）数据，请使用预定义的
类 [SampleConsumerInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/sample-consumer/SampleConsumerInitData.ts) 。

合约调用单个推送。

#### OP_REDSTONE_READ_DATA

可以直接在链上获取 `feed_id` 合约中存储的值。
必须调用内部消息 `OP_REDSTONE_READ_DATA`。消息参数如下

- 代表信息的 "初始发送方 "的 "slice"，以便他们在返回交易时携带剩余的交易余额
  。

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_READ_DATA) {
        cell initial_payload = in_msg_body~load_ref();

        // ...
    }
```

返回的信息 `OP_REDSTONE_DATA_READ` 会发送给发送方，其中包含 `feed_id`、`value` 和
保存值的 `timestamp`。然后，可在发送方中获取并处理该信息，或将其保存在
发送方的存储空间中。
初始 payload 的 `ref` (`initial_payload`)会被添加为 ref - 例如包含第一条信息的发送方，
，以便它们携带剩余的交易余额。

```ts
begin_cell()
  .store_uint(value, MAX_VALUE_SIZE_BITS)
  .store_uint(timestamp, TIMESTAMP_BITS)
  .store_ref(initial_payload)
  .end_cell()
```

这是一条内部信息--它消耗 GAS 并修改合约的存储空间，因此必须以 TON 为单位支付。

## TON RedStone 有效载荷包装

由于 TON [见](/v3/documentation/data-formats/tlb/cell-boc) 中 Bag-size 的限制，
，RedStone 有效载荷数据（以十六进制字符串表示）需要以更复杂的方式传递给合约。

根据[此处](https://docs.redstone.finance/img/payload.png)定义的 RedStone 有效载荷，
，数据应以 Cell 的形式传递，构建方式如下。

1. 主_支付负载_ `cell` 由以下部分组成：

   1. **数据级比特**中的元数据，由图像上的各部分组成：

     ![payload-metadata.png](/img/docs/oracles/red-stone/payload-metadata.png)

   1. 一个**参考**，包含一个以连续自然数（从 0 开始）为索引的 "udict"，该 "udict "包含 **数据包** 的 `cell` 列表。
2. 每个_数据包_ `cell`包括

   1. **数据级位**中的数据包签名：

     ![payload-metadata.png](/img/docs/oracles/red-stone/payload-metadata.png)

   1. 一个**引用**到一个 " cell "，该 " cell  "的**数据层**包含数据包其余部分的数据：

     ![payload-metadata.png](/img/docs/oracles/red-stone/data-package-data.png)

#### 目前实施的局限性

- RedStone 有效载荷必须通过明确定义数据源获取，
  导致**一个数据点** 属于**一个数据包**。
- 无符号元数据大小不得超过 `127 - (2 + 3 + 9) = 113` 字节。

#### 帮手

[create-payload-cell.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/create-payload-cell.ts)文件
中的 `createPayloadCell` 方法会检查限制条件，并如上所述准备好要发送到合约的数据。

#### 样本序列化

下图包含了针对2个数据源和2个唯一签名者的数据：
![payload-metadata.png](/img/docs/oracles/red-stone/sample-serialization.png)

## 可能出现的交易故障

- 从初始化器
  中传递的与 `addresses` 匹配的签名中恢复的签名者数量必须大于或等于构造函数中的 `signer_count_threshold` 每个进位的签名者数量。
  - 否则，它就会出现 `300` 错误，该错误的增大值为所传递的
    feed 的第一个索引，因为该索引破坏了验证。
- 数据包的时间戳相对于`block_timestamp`必须不早于 15 分钟。
  - 否则，它将抛出一个错误，错误码为 `200`，并增加以下值：首先是导致验证失败的数据包的索引值，再额外增加 `50`，如果该数据包的时间戳超出了当前时间太远。
- 内部信息消耗 gas ，必须按 TON 支付。交易成功后，可在
  上查看数据。
- 其他错误代码的定义见 [此处](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts)

## 另请参见

- [内部信息文档](/v3/documentation/smart-contracts/message-management/internal-messages)
- [RedStone数据打包](https://docs.redstone.finance/docs/smart-contract-devs/how-it-works)
- [RedStone oracles smart-contracts](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector/contracts)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tl.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tl.md
================================================
# TL

TL（类型语言）是一种用于描述数据结构的语言。

为了结构化有用的数据，在通信时使用 [TL 架构](https://github.com/ton-blockchain/ton/tree/master/tl/generate/scheme)。

TL 操作 32 位块。因此，TL 中的数据大小必须是 4 字节的倍数。
如果对象的大小不是 4 的倍数，我们需要添加所需数量的零字节，直到达到倍数。

数字始终以小端序编码。

有关 TL 的更多详情可以在 [Telegram 文档](https://core.telegram.org/mtproto/TL)中找到。

## 编码字节数组

要编码一个字节数组，我们首先需要确定其大小。
如果它少于 254 字节，则使用 1 字节作为大小的编码。如果更多，
则将 0xFE 写为第一个字节，作为大数组的指示符，其后跟随 3 字节的大小。

例如，我们编码数组 `[0xAA, 0xBB]`，其大小为 2。我们使用 1 字节
大小然后写入数据本身，我们得到 `[0x02, 0xAA, 0xBB]`，完成，但我们看到
最终大小为 3，不是 4 字节的倍数，那么我们需要添加 1 字节的填充使其达到 4。结果：`[0x02, 0xAA, 0xBB, 0x00]`。

如果我们需要编码一个大小等于例如 396 的数组，
我们这样做：396 >= 254，所以我们使用 3 字节进行大小编码和 1 字节超尺寸指示符，
我们得到：`[0xFE, 0x8C, 0x01, 0x00, 数组字节]`，396+4 = 400，是 4 的倍数，无需对齐。

## 非明显的序列化规则

通常，在架构本身之前会写入一个 4 字节前缀 - 其 ID。架构 ID 是从架构文本的 CRC32，其中 IEEE 表，同时从文本中先前删除了诸如 `;` 和括号 `()` 的符号。带有 ID 前缀的架构序列化称为 **boxed**，这使解析器能够确定在它之前出现的是哪个架构（如果有多个选项）。

如何确定是否序列化为 boxed？如果我们的架构是另一个架构的一部分，那么我们需要看字段类型是如何指定的，如果它是明确指定的，那么我们序列化时不带前缀，如果不是明确的（有很多这样的类型），那么我们需要序列化为 boxed。例子：

```tlb
pub.unenc data:bytes = PublicKey;
pub.ed25519 key:int256 = PublicKey;
pub.aes key:int256 = PublicKey;
pub.overlay name:bytes = PublicKey;
```

我们有这样的类型，如果在架构中指定了 `PublicKey`，例如 `adnl.node id:PublicKey addr_list:adnl.addressList = adnl.Node`，那么它没有明确指定，我们需要使用 ID 前缀（boxed）序列化。而如果它被指定为这样：`adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node`，那么它就是明确的，不需要前缀。

## 参考资料

*这里是 [Oleg Baranov](https://github.com/xssnick) 的[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/TL.md)。*



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/block-layout.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/block-layout.md
================================================
# 区块布局

:::info
为了最大限度地理解本页内容，强烈建议您熟悉 [TL-B 语言](/develop/data-formats/cell-boc)。
:::

区块链中的一个区块是一条新交易记录，一旦完成，就会作为这个去中心化账本的永久且不可更改的一部分被添加到区块链上。每个区块包含交易数据、时间以及对前一个区块的引用等信息，从而形成一个区块链。

TON 区块链中的区块由于系统的整体复杂性而具有相当复杂的结构。本页描述了这些区块的结构和布局。

## 区块

一个区块的原始 TL-B 方案如下：

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

让我们仔细看看每个字段。

## global_id:int32

创建此区块的网络的 ID。主网为 `-239`，测试网为 `-3`。

## info:^BlockInfo

此字段包含关于区块的信息，如其版本、序列号、标识符和其他标志位。

```tlb
block_info#9bc7a987 version:uint32
    not_master:(## 1)
    after_merge:(## 1) before_split:(## 1)
    after_split:(## 1)
    want_split:Bool want_merge:Bool
    key_block:Bool vert_seqno_incr:(## 1)
    flags:(## 8) { flags <= 1 }
    seq_no:# vert_seq_no:# { vert_seq_no >= vert_seqno_incr }
    { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no }
    shard:ShardIdent gen_utime:uint32
    start_lt:uint64 end_lt:uint64
    gen_validator_list_hash_short:uint32
    gen_catchain_seqno:uint32
    min_ref_mc_seqno:uint32
    prev_key_block_seqno:uint32
    gen_software:flags . 0?GlobalVersion
    master_ref:not_master?^BlkMasterInfo
    prev_ref:^(BlkPrevInfo after_merge)
    prev_vert_ref:vert_seqno_incr?^(BlkPrevInfo 0)
    = BlockInfo;
```

| 字段                              | 类型                                           | 描述                                    |
| ------------------------------- | -------------------------------------------- | ------------------------------------- |
| `version`                       | uint32                                       | 区块结构的版本。                              |
| `not_master`                    | (## 1)                    | 标志位，表示此区块是否为主链区块。                     |
| `after_merge`                   | (## 1)                    | 标志位，表示此区块是否在两个分片链合并后创建，因此它有两个父区块。     |
| `before_split`                  | (## 1)                    | 标志位，表示此区块是否在其分片链分裂前创建。                |
| `after_split`                   | (## 1)                    | 标志位，表示此区块是否在其分片链分裂后创建。                |
| `want_split`                    | Bool                                         | 标志位，表示是否希望分片链分裂。                      |
| `want_merge`                    | Bool                                         | 标志位，表示是否希望分片链合并。                      |
| `key_block`                     | Bool                                         | 标志位，表示此区块是否为关键区块。                     |
| `vert_seqno_incr`               | (## 1)                    | 垂直序列号的增量。                             |
| `flags`                         | (## 8)                    | 区块的附加标志位。                             |
| `seq_no`                        | #                                            | 与区块相关的序列号。                            |
| `vert_seq_no`                   | #                                            | 与区块相关的垂直序列号。                          |
| `shard`                         | ShardIdent                                   | 该块所属分片的标识符。                           |
| `gen_utime`                     | uint32                                       | 区块的生成时间。                              |
| `start_lt`                      | uint64                                       | 与区块相关的起始逻辑时间。                         |
| `end_lt`                        | uint64                                       | 与区块相关的逻辑结束时间。                         |
| `gen_validator_list_hash_short` | uint32                                       | 在生成此区块时，与验证器列表相关的简短哈希值。               |
| `gen_catchain_seqno`            | uint32                                       | [Catchain](/catchain.pdf)与此区块相关的序列号。  |
| `min_ref_mc_seqno`              | uint32                                       | 引用的主链区块的最小序列号。                        |
| `prev_key_block_seqno`          | uint32                                       | 上一个密钥块的序列号。                           |
| `gen_software`                  | GlobalVersion                                | 生成区块的软件版本。只有当 "版本 "的第一位设置为 "1 "时才会显示。 |
| `master_ref`                    | BlkMasterInfo                                | 如果区块不是主区块，则是主区块的引用。存储在引用区块中。          |
| `prev_ref`                      | BlkPrevInfo after_merge | 上一个区块的引用。存储在引用中。                      |
| `prev_vert_ref`                 | BlkPrevInfo 0                                | 垂直序列中前一个区块的引用（如果存在）。存储在引用中。           |

### value_flow:^ValueFlow

该字段表示区块内的货币流量，包括收取的费用和其他涉及货币的交易。

```tlb
value_flow#b8e48dfb ^[ from_prev_blk:CurrencyCollection
    to_next_blk:CurrencyCollection
    imported:CurrencyCollection
    exported:CurrencyCollection ]
    fees_collected:CurrencyCollection
    ^[
    fees_imported:CurrencyCollection
    recovered:CurrencyCollection
    created:CurrencyCollection
    minted:CurrencyCollection
    ] = ValueFlow;
```

| Field            | Type                                                                                | Description           |
| ---------------- | ----------------------------------------------------------------------------------- | --------------------- |
| `from_prev_blk`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表上一个区块的货币流量。         |
| `to_next_blk`    | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表货币流向下一个区块。          |
| `imported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表输入区块的货币流量。          |
| `exported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表从区块输出的货币流量。         |
| `fees_collected` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 该区块收取的费用总额。           |
| `fees_imported`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 输入区块的费用。仅在主链中为非零。     |
| `recovered`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 区块中回收的货币数量。仅在主链中为非零。  |
| `created`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 区块中创建的新货币数量。仅在主链中不为零。 |
| `minted`         | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 区块中铸造的货币数量。仅在主链中为非零。  |

## state_update:^(MERKLE_UPDATE ShardState)

该字段表示分片状态的更新。

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Field      | Type                      | Description    |
| ---------- | ------------------------- | -------------- |
| `old_hash` | bits256                   | 分片状态的旧散列值。     |
| `new_hash` | bits256                   | 分片状态的新散列值。     |
| `old`      | [ShardState](#shardstate) | 分片的旧状态。存储在引用中。 |
| `new`      | [ShardState](#shardstate) | 分片的新状态。存储在引用中。 |

### ShardState

`ShardState` 可以包含分片的相关信息，或者在分片被分割的情况下，也可以包含左右分割部分的相关信息。

```tlb
_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

### ShardState Unsplitted

```tlb
shard_state#9023afe2 global_id:int32
    shard_id:ShardIdent
    seq_no:uint32 vert_seq_no:#
    gen_utime:uint32 gen_lt:uint64
    min_ref_mc_seqno:uint32
    out_msg_queue_info:^OutMsgQueueInfo
    before_split:(## 1)
    accounts:^ShardAccounts
    ^[ overload_history:uint64 underload_history:uint64
    total_balance:CurrencyCollection
    total_validator_fees:CurrencyCollection
    libraries:(HashmapE 256 LibDescr)
    master_ref:(Maybe BlkMasterInfo) ]
    custom:(Maybe ^McStateExtra)
    = ShardStateUnsplit;
```

| Field                  | Type                                                                                | Required | Description                                   |
| ---------------------- | ----------------------------------------------------------------------------------- | -------- | --------------------------------------------- |
| `global_id`            | int32                                                                               | Yes      | 分片所属网络的 ID。`-239` 代表 mainnet，`-3` 代表 testnet。 |
| `shard_id`             | ShardIdent                                                                          | Yes      | 分片的标识符。                                       |
| `seq_no`               | uint32                                                                              | Yes      | 与此分片链相关的最新序列号。                                |
| `vert_seq_no`          | #                                                                                   | Yes      | 与此分片链相关的最新垂直序列号。                              |
| `gen_utime`            | uint32                                                                              | Yes      | 与创建分片相关的生成时间。                                 |
| `gen_lt`               | uint64                                                                              | Yes      | 与创建分片相关的逻辑时间。                                 |
| `min_ref_mc_seqno`     | uint32                                                                              | Yes      | 最新引用的主链区块的序列号。                                |
| `out_msg_queue_info`   | OutMsgQueueInfo                                                                     | Yes      | 有关此分片的输出消息队列的信息。存储在引用中。                       |
| `before_split`         | ## 1                                                                                | Yes      | 表示是否会在该分片链的下一个区块中进行拆分的标志。                     |
| `accounts`             | ShardAccounts                                                                       | Yes      | 分片中账户的状态。存储在引用中。                              |
| `overload_history`     | uint64                                                                              | Yes      | 分片过载事件的历史记录。通过分片实现负载平衡。                       |
| `underload_history`    | uint64                                                                              | Yes      | 分片负载不足事件的历史记录。用于通过分片实现负载平衡。                   |
| `total_balance`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | 分片的总余额。                                       |
| `total_validator_fees` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | 分片的验证器总费用。                                    |
| `libraries`            | HashmapE 256 LibDescr                                                               | Yes      | 该分片中库描述的哈希表。目前仅在主链中为非空。                       |
| `master_ref`           | BlkMasterInfo                                                                       | No       | 主数据块信息的引用。                                    |
| `custom`               | McStateExtra                                                                        | No       | 分片状态的自定义额外数据。该字段仅在主链中存在，包含所有特定于主链的数据。存储在引用中。  |

### ShardState Splitted

| Field   | Type                                        | Description     |
| ------- | ------------------------------------------- | --------------- |
| `left`  | [ShardStateUnsplit](#shardstate-unsplitted) | 左侧分片的状态。存储在引用中。 |
| `right` | [ShardStateUnsplit](#shardstate-unsplitted) | 右侧分片的状态。存储在引用中。 |

## extra:^BlockExtra

该字段包含有关区块的额外信息。

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| Field            | Type                          | Required | Description                              |
| ---------------- | ----------------------------- | -------- | ---------------------------------------- |
| `in_msg_descr`   | InMsgDescr                    | Yes      | 区块中传入信息的描述符。以引用形式存储。                     |
| `out_msg_descr`  | OutMsgDescr                   | Yes      | 区块中发出报文的描述符。存储在引用中。                      |
| `account_blocks` | ShardAccountBlocks            | Yes      | 区块中处理的所有交易的集合，以及分配给分片的账户状态的所有更新。以引用形式存储。 |
| `rand_seed`      | bits256                       | Yes      | 区块的随机种子。                                 |
| `created_by`     | bits256                       | Yes      | 创建区块的实体（通常是验证器的公钥）。                      |
| `custom`         | [McBlockExtra](#mcblockextra) | No       | 该字段仅出现在主链中，包含所有主链特定数据。区块的自定义额外数据。存储在引用中。 |

### McBlockExtra

该字段包含有关主链区块的额外信息。

```tlb
masterchain_block_extra#cca5
    key_block:(## 1)
    shard_hashes:ShardHashes
    shard_fees:ShardFees
    ^[ prev_blk_signatures:(HashmapE 16 CryptoSignaturePair)
    recover_create_msg:(Maybe ^InMsg)
    mint_msg:(Maybe ^InMsg) ]
    config:key_block?ConfigParams
    = McBlockExtra;
```

| Field                 | Type                            | Required | Description                            |
| --------------------- | ------------------------------- | -------- | -------------------------------------- |
| `key_block`           | ## 1                            | Yes      | 指示区块是否为关键区块的标志。                        |
| `shard_hashes`        | ShardHashes                     | Yes      | 相应分片链最新区块的哈希值。                         |
| `shard_fees`          | ShardFees                       | Yes      | 从该区块所有分片收取的费用总额。                       |
| `prev_blk_signatures` | HashmapE 16 CryptoSignaturePair | Yes      | 上一个街区的签名。                              |
| `recover_create_msg`  | InMsg                           | No       | 与收回额外货币有关的信息（如果有）。存储在引用中。              |
| `mint_msg`            | InMsg                           | No       | 与铸造额外货币有关的信息（如果有）。存储在引用中。              |
| `config`              | ConfigParams                    | No       | 此块的实际配置参数。只有设置了 `key_block` 时，该字段才会出现。 |

## 另见

- 白皮书中对 [区块布局](https://docs.ton.org/tblkch.pdf#page=96\&zoom=100,148,172)的原始描述



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/canonical-cell-serialization.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/canonical-cell-serialization.md
================================================
# 规范化cell序列化

## cell权重

`Weight`是定义每个cell在cell树中的特征，具体如下：

- 如果cell是cell树中的叶节点：`weight = 1`；
- 对于普通cell（非叶子），权重是一个总和：`cell weight = children weight + 1`；
- 如果cell是_特殊_的，其权重设为零。

以下算法解释了我们如何以及何时为每个cell分配权重以创建一个权重平衡的树。

## 权重重排序算法

每个cell都是权重平衡树，[reorder_cells()](https://github.com/ton-blockchain/ton/blob/15088bb8784eb0555469d223cd8a71b4e2711202/crypto/vm/boc.cpp#L249) 方法
基于累积子权重重新分配权重。遍历顺序是根 -> 子节点。这是一种广度优先搜索，_可能_用于保持缓存线性。它还触发哈希大小的重新计算，并对包（根）和每个树进行重新索引，为空引用设置新索引。尽管重新索引是深度优先的，可能存在某些依赖于此索引顺序的内容，正如白皮书所述，这是首选的。

要遵循原始节点的cell序列化，您应该：

- 首先，如果cell的权重尚未设置（节点在cell导入时这样做），我们将每个cell的权重设置为`1 + sum_child_weight`，其中`sum_child_weight`是其子节点权重的总和。我们添加1以使叶子具有1的权重。

- 遍历所有根，对于每个根cell：
  - 检查它的每个引用是否有一个权重小于`maximum_possible_weight - 1 + ref_index`除以根cell引用的数量，以便它们均匀地共享父权重，我们做(+ index)以确保如果语言在除法中向0取整，我们总是得到一个数学上四舍五入的数字（例如对于5 / 3，c++会返回1，但我们在这里希望2）

  - 如果一些引用违反了该规则，我们将它们添加到列表中（或更有效地创建一个位掩码，就像原始节点所做的那样），然后再次遍历这些引用，并将它们的权重限制为`weight_left / invalid_ref_count`，其中`weight_left`是`maximum_possible_weight - 1 - sum_of_valid_refs_weights`。在代码中，它可以实现为减少一个计数器变量，该变量首先初始化为`maximum_possible_weight - 1`，然后当`counter -= valid_ref_weight`时递减。因此，我们基本上在这些节点之间重新分配剩余权重（平衡它们）

- 再次遍历根，对于每个根：
  - 确保其引用的新权重总和小于`maximum_possible_weight`，检查新总和是否小于先前根cell的权重，并将其权重限制为新总和。（如果`new_sum < root_cell_weight`，则将`root_cell_weight`设置为等于`new_sum`）
  - 如果新总和高于根的权重，则它应该是一个特殊节点，其权重为0，设置它。（这里通过节点的哈希计数增加内部哈希计数）

- 再次遍历根，对于每个根：
  如果它不是特殊节点（如果其权重> 0），则通过节点的哈希计数将顶部哈希计数增加。

- 递归地重新索引树：
  - 首先，我们预访问所有根cell。如果我们之前没有预访问或访问过此节点，请递归检查其所有引用以查找特殊节点。如果我们找到一个特殊节点，我们必须在其他节点之前预访问和访问它，这意味着特殊节点的子节点将首先出现在列表中（它们的索引将是最低的）。然后我们添加其他节点的子节点（顺序最深 -> 最高）。根在列表的最后（它们有最大的索引）。因此，最终我们得到一个排序的列表，其中节点越深，其索引就越低。

`maximum_possible_weight`是常数64

## 注释

- 特殊cell没有权重（它是0）

- 确保导入时的权重适合8位（weight \<= 255）

- 内部哈希计数是所有特殊根节点的哈希计数之和

- 顶部哈希计数是所有其他（非特殊）根节点的哈希计数之和



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/cell-boc.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/cell-boc.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# cell与cell包 (BoC)

## cell

cell是TON区块链上的一种数据结构。cell能够存储多达1023位，并且可以拥有最多4个对其他cell的引用。

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-5.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-5-dark.png?raw=true',
}}
/>
<br></br>

## cell包

cell包 (BoC) 是一种将cell序列化为字节数组的格式，这一格式在 [TL-B schema](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/tl/boc.tlb#L25) 中有进一步描述。

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-6.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-6-dark.png?raw=true',
}}
/>
<br></br>

在TON上，所有东西都由cell构成，包括合约代码、存储的数据、区块等，实现了过程中的流线型和强大的灵活性。

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-4.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-4-dark.png?raw=true',
}}
/>
<br></br>

### cell序列化

让我们分析我们的第一个cell包示例：

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-7.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-7-dark.png?raw=true',
}}
/>
<br></br>

```json
1[8_] -> {
  24[0AAAAA],
  7[FE] -> {
    24[0AAAAA]
  }
}
```

在此示例中，我们有一个1位大小的根cell，它有2个链接：第一个指向一个24位cell，第二个指向一个7位cell，后者又有一个链接指向一个24位cell。

为了使此框架按预期工作，需要将cell转换为单一的字节序列。为此，首先，我们只利用唯一的cell类型，下面3个中的2个如下所示：

```json
1[8_]
24[0AAAAA]
7[FE]
```

:::note
为了只留下唯一的cell，需要进行比较。为此，我们需要比较cell的[哈希](#cell-hash)。
:::

```json
1[8_]      -> index 0 (root cell)
7[FE]      -> index 1
24[0AAAAA] -> index 2
```

现在，让我们计算上述3个cell的描述。这些描述由2个字节组成，存储了有关数据长度和数据链接数量的标志信息。

第一个字节 - **引用描述符** - 计算为 `r+8s+32l`，其中 `0 ≤ r ≤ 4` 是cell引用（链接）的数量，`0 ≤ s ≤ 1` 对于[异类](#special-exotic-cells)cell为1，对于普通cell为0，`0 ≤ l ≤ 3` 是cell的[层级](#cell-level)。

第二个字节 - **位描述符** - 等于 `floor(b / 8) + ceil (b / 8)`，其中 `0 <= b <= 1023` 是cell中的位数。这个描述符代表cell数据的完整4位组的长度（但如果不为空至少为1）。

结果是：

```json
1[8_]      -> 0201 -> 2 refs, length 1
7[FE]      -> 0101 -> 1 ref, length 1
24[0AAAAA] -> 0006 -> 0 refs, length 6
```

对于不完整的4位组的数据，在序列的末尾添加1位。这意味着它表示组的结束位，并用于确定不完整组的真实大小。让我们添加以下位：

```json
1[8_]      -> C0     -> 0b10000000->0b11000000
7[FE]      -> FF     -> 0b11111110->0b11111111
24[0AAAAA] -> 0AAAAA -> do not change (full groups)
```

现在让我们添加引用索引：

```json
0 1[8_]      -> 0201 -> refers to 2 cells with such indexes
1 7[FE]      -> 02 -> refers to cells with index 2
2 24[0AAAAA] -> no refs
```

并将其全部组合在一起：

```json
0201 C0     0201
0101 FF     02
0006 0AAAAA
```

并通过将相应的字符串连接成一个单一的字节数组来拼接它们：
`0201c002010101ff0200060aaaaa`，大小14字节。

<details>
  <summary><b>显示示例</b></summary>

```golang
func (c *Cell) descriptors() []byte {
  ceilBytes := c.bitsSz / 8
  if c.bitsSz%8 ! = 0 {
    ceilBytes++
  }

	// calc size
	ln := ceilBytes + c.bitsSz / 8

	specBit := byte(0)
	if c.special {
	  specBit = 8
	}

	return []byte{byte(len(c.refs)) + specBit + c.level*32, byte(ln)}
}
```

[来源](https://github.com/xssnick/tonutils-go/blob/3d9ee052689376061bf7e4a22037ff131183afad/tvm/cell/serialize.go#L205)

</details>

### 打包cell包

让我们打包上一节直接提到的cell。我们已经将其序列化为一个扁平的14字节数组。

因此，我们根据其[架构](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/tl/boc.tlb#L25)构建header。

```
b5ee9c72                      -> id tl-b of the BoC structure
01                            -> flags and size:(## 3), in our case the flags are all 0,
                                 and the number of bytes needed to store the number of cells is 1.
                                 we get - 0b0_0_0_00_001
01                            -> number of bytes to store the size of the serialized cells
03                            -> number of cells, 1 byte (defined by 3 bits size:(## 3), equal to 3.
01                            -> number of root cells - 1
00                            -> absent, always 0 (in current implementations)
0e                            -> size of serialized cells, 1 byte (size defined above), equal to 14
00                            -> root cell index, size 1 (determined by 3 size:(## 3) bits from header),
                                 always 0
0201c002010101ff0200060aaaaa  -> serialized cells
```

接下来，我们将上述所有内容连接成一个字节数组，得到我们最终的BoC：
`b5ee9c7201010301000e000201c002010101ff0200060aaaaa`

cell包实现示例：[序列化](https://github.com/xssnick/tonutils-go/blob/master/tvm/cell/serialize.go)，[反序列化](https://github.com/xssnick/tonutils-go/blob/master/tvm/cell/parse.go)

## 特殊cell

通常，TON上运行的cell分为两大类：普通cell和特殊cell。用户处理的大多数cell是普通cell，负责携带信息。

然而，为了实现网络的内部功能，有时需要特殊cell，并且它们用于多种目的，这取决于它们的子类型。

## cell层级

每个cell都有一个称为`Level`的属性，它由0到3的整数表示。

### 普通cell层级

普通cell的层级始终等于其所有引用的层级的最大值：

```cpp
Lvl(c) = max(Lvl(r_0), ..., Lvl(r_i), ..., Lvl(r_e))
```

其中`i`是`c`的引用索引，`e`是`c`的引用数量。

_没有引用的普通cell层级为零_

### 特殊cell层级

特殊cell对其层级的设置有不同的规则，这些规则在[此文](/develop/data-formats/exotic-cells)中有描述。

## cell哈希

在大多数情况下，用户使用的是层级为0的普通cell，它们只有一个哈希，称为 representation hash（或 hash infinity）。

层级为`Lvl(c) = l`的cell`c`，其中`1 ≤ l ≤ 3`，除了 representation hash 外，还有`l`个**"更高"**的哈希。

### 标准cell representation hash 计算

首先，我们需要计算cell表示（类似于上面描述的cell序列化）

1. 计算描述符字节
2. 添加序列化cell数据
3. 对于每个cell的引用，添加其深度
4. 对于每个cell的引用，添加其 representation hash
5. 计算结果的SHA256哈希

让我们分析以下示例：

#### 无引用的cell

```json
32[0000000F]
```

1. 描述符计算

引用描述符等于 `r+8s+32l = 0 + 0 + 0 = 0 = 00`

位描述符等于 `floor(b / 8) + ceil (b / 8) = 8 = 08`

连接这些字节，我们得到 `0008`

2. cell数据序列化

在这种情况下，我们有完整的4位组，所以我们不必向cell数据添加任何位。结果是 `0000000f`

3. 引用深度

我们跳过这部分，因为我们的cell没有任何引用

4. 引用哈希

我们跳过这部分，因为我们的cell没有任何引用

5. SHA256计算

连接前面步骤的字节，我们得到 `00080000000f`，其SHA256为 `57b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9` - 这就是cell representation hash 。

#### 带有引用的cell

```json
24[00000B] -> {
	32[0000000F],
	32[0000000F]
}
```

1. 描述符计算

引用描述符等于 `r+8s+32l = 2 + 0 + 0 = 0 = 02`

位描述符等于 `floor(b / 8) + ceil (b / 8) = 6 = 06`

连接这些字节，我们得到 `0206`

2. cell数据序列化

在这种情况下，我们有完整的4位组，所以我们不必向cell数据添加任何位。结果是 `00000b`

3. 引用深度

深度由2个字节表示。我们的cell有2个引用，每个的深度都是零，所以这一步的结果是 `00000000`。

4. 引用哈希

对于每个引用，我们添加其哈希（我们上面计算过），所以结果是 \\`57b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f957b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9

5. SHA256计算

连接前面步骤的字节，我们得到 `020600000b0000000057b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f957b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9`
，其SHA256为 `f345277cc6cfa747f001367e1e873dcfa8a936b8492431248b7a3eeafa8030e7` - 这就是cell representation hash

### 更高哈希的计算

普通cell`c`的更高哈希与其 representation hash 的计算类似，但使用其引用的更高哈希而不是它们的 representation hash。

特殊cell有其自己的计算更高哈希的规则，这些规则在[此文](/develop/data-formats/exotic-cells)中有描述。

## 参阅

[//]: # "* [原文RU](https://github.com/xssnick/ton-deep-doc/blob/master/Cells-BoC.md)"

- [特殊cell](/develop/data-formats/exotic-cells)
- [默克尔证明验证](/develop/data-formats/proofs)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/crc32.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/crc32.md
================================================
# CRC32

## 概述

CRC代表循环冗余检查，这是一种常用的方法，用于验证数字数据的完整性。它是一种用于检测在数据传输或存储过程中是否发生错误的算法。CRC生成一个数据的简短校验和或哈希，附加在数据上。当数据被接收或检索时，重新计算CRC并与原始校验和比较。如果两个校验和匹配，则假定数据未被损坏。如果它们不匹配，则表明发生了错误，需要重新发送或再次检索数据。

CRC32 IEEE版本用于TL-B方案。通过查看此[NFT操作码](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema)示例，可以更清楚地理解各种消息的TL-B计算。

## 工具

### 在线计算器

- [在线计算器示例](https://emn178.github.io/online-tools/crc32.html)
- [Tonwhales Introspection ID 生成器](https://tonwhales.com/tools/introspection-id)

### VS Code扩展

- [crc32-opcode-helper](https://marketplace.visualstudio.com/items?itemName=Gusarich.crc32-opcode-helper)

### Python

```python
import zlib
print(zlib.crc32(b'<TL-B>') & 0x7FFFFFFF)
```

### Go

```python
func main() {

	var schema = "some"

	schema = strings.ReplaceAll(schema, "(", "")
	schema = strings.ReplaceAll(schema, ")", "")
	data := []byte(schema)
	var crc = crc32.Checksum(data, crc32.MakeTable(crc32.IEEE))

	var b_data = make([]byte, 4)
	binary.BigEndian.PutUint32(b_data, crc)
	var res = hex.EncodeToString(b_data)
	fmt.Println(res)
}
```

### TypeScript

```typescript
import * as crc32 from 'crc-32';

function calculateRequestOpcode_1(str: string): string {
    return (BigInt(crc32.str(str)) & BigInt(0x7fffffff)).toString(16);
}

function calculateResponseOpcode_2(str: string): string {
    const a = BigInt(crc32.str(str));
    const b = BigInt(0x80000000);
    return ((a | b) < 0 ? (a | b) + BigInt('4294967296') : a | b).toString(16);
}
```



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/exotic-cells.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/exotic-cells.md
================================================
# 特殊cell

每个cell都有其自己的类型，由一个从 -1 到 255 的整数编码。
类型为 -1 的cell是`普通`cell，所有其他类型的cell称为`异构`或`特殊`cell。
特殊cell的类型存储在其数据的前八位中。如果特殊cell的数据位数少于八位，那么它是无效的。
目前，有 4 种特殊cell类型：

```json
{
  Prunned Branch: 1,
  Library Reference: 2,
  Merkle Proof: 3,
  Merkle Update: 4
}
```

### 裁剪分支

裁剪分支是代表已删除cell子树的cell。

它们可以有 `1 <= l <= 3` 的级别，并且包含恰好 `8 + 8 + 256 * l + 16 * l` 位。

第一个字节始终是 `01` - cell类型。第二个字节是裁剪分支级别掩码。然后是 `l * 32` 字节的已删除子树的哈希，之后是 `l * 2` 字节的已删除子树的深度。

裁剪分支cell的级别 `l` 可能被称为其德布鲁因指数(De Bruijn index)，因为它决定了裁剪分支是在构造哪个外部默克尔证明或默克尔更新时被修剪的。

裁剪分支的更高哈希存储在其数据中，可以这样获得：

```cpp
Hash_i = CellData[2 + (i * 32) : 2 + ((i + 1) * 32)]
```

### 库引用

库引用cell用于在智能合约中使用库。

它们始终具有 0 级，并包含 `8 + 256` 位。

第一个字节始终是 `02` - cell类型。接下来的 32 字节是被引用的库cell的[ representation hash ](/develop/data-formats/cell-boc#standard-cell-representation-hash-calculation)。

### 默克尔证明

默克尔证明cell用于验证cell树数据的一部分属于完整树。这种设计允许验证者不存储树的全部内容，同时仍能通过根哈希验证内容。

默克尔证明恰好有一个引用，其级别 `0 <= l <= 3` 必须是 `max(Lvl(ref) - 1, 0)`。这些cell恰好包含 `8 + 256 + 16 = 280` 位。

第一个字节始终是 `03` - cell类型。接下来的 32 字节是 `Hash_1(ref)`（如果引用级别为 0，则为 `ReprHash(ref)`）。接下来的 2 字节是被引用替换的已删除子树的深度。

默克尔证明cell的更高哈希 `Hash_i` 的计算方式类似于普通cell，但使用 `Hash_i+1(ref)` 代替 `Hash_i(ref)`。

### 默克尔更新

默克尔更新cell始终有 2 个引用，并且行为类似于两者的默克尔证明。

默克尔更新的级别 `0 <= l <= 3` 是 `max(Lvl(ref1) − 1, Lvl(ref2) − 1, 0)`。它们恰好包含 `8 + 256 + 256 + 16 + 16 = 552` 位。

第一个字节始终是 `04` - cell类型。接下来的 64 字节是 `Hash_1(ref1)` 和 `Hash_2(ref2)` - 被称为旧哈希和新哈希。然后是 4 字节，表示已删除的旧子树和新子树的实际深度。

## 简单证明验证示例

假设有一个cell `c`：

```json
24[000078] -> {
	32[0000000F] -> {
		1[80] -> {
			32[0000000E]
		},
		1[00] -> {
			32[0000000C]
		}
	},
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			512[00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064]
		}
	}
}
```

但我们只知道它的哈希 `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`，我们想证明cell `a` `267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040]` 实际上是 `c` 的一部分，而不接收整个 `c`。因此，我们要求提供者创建一个默克尔证明，将我们不感兴趣的所有分支替换为裁剪分支cell。

从 `c` 中无法到达 `a` 的第一个后代是 `ref1`：

```json
32[0000000F] -> {
	1[80] -> {
		32[0000000E]
	},
	1[00] -> {
		32[0000000C]
	}
}
```

因此，提供者计算其哈希（`ec7c1379618703592804d3a33f7e120cebe946fa78a6775f6ee2e28d80ddb7dc`），创建一个裁剪分支 `288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002]` 并用此裁剪分支替换 `ref1`。

第二个是 `512[0000000...00000000064]`，因此提供者也为此cell创建一个裁剪分支：

```json
24[000078] -> {
	288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
		}
	}
}
```

提供者发送给验证者（在此示例中是我们）的结果默克尔证明看起来是这样的：

```json
280[0344EFD0FDFFFA8F152339A0191DE1E1C5901FDCFE13798AF443640AF99616B9770003] -> {
	24[000078] -> {
		288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
		16[000B] -> {
			4[80] -> {
				267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
				288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
			}
		}
	}
}
```

当我们（验证者）得到证明cell时，我们确保其数据包含 `c` 的哈希，然后从唯一的证明引用计算 `Hash_1`：`44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`，并将其与 `c` 的哈希进行比较。

现在，当我们检查哈希是否匹配后，我们需要深入cell并验证是否存在我们感兴趣的cell `a`。

这种证明反复减少了计算负载和需要发送给或存储在验证者中的数据量。

## 参阅

- [高级证明验证示例](/develop/data-formats/proofs)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/library-cells.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/library-cells.md
================================================
# Library Cells

## 导言

TON 在 cell 中存储数据的原生特性之一是重复数据删除：在存储过程中，信息、块、事务等重复的 cell 只存储一次。这大大减少了序列化数据的大小，并允许高效存储逐步更新的数据。

出于同样的原因，TON 中的许多结构都同时具有丰富、便捷和高效的特点：块结构在许多地方都包含了每条消息的相同副本：消息队列、事务列表、Merkle更新等：由于复制没有开销，我们可以在需要的地方多次存储数据，而不必担心效率问题。

Library cells 在链上采用重复数据删除机制，允许将该技术集成到自定义智能合约中。
:::info
如果将 jetton-wallet 代码存储为 library cell  （1 个 cell 和 256+8 位，而不是 ~20 个 cell 和 6000 位），例如，包含 `init_code` 的消息的转发费用将从 0.011 TON 降至 0.003 TON。
:::

## 一般信息

让我们考虑一下从区块 1'000'000 到区块 1'000'001 的基础链步骤。虽然每个区块包含少量数据（通常少于 1000 笔交易），但整个基础链状态包含数百万个账户，由于区块链需要保持数据的完整性（特别是将整个状态的 merkle 根散列提交到区块中），因此需要更新整个状态树。

对于前几代区块链来说，这意味着通常只需跟踪最近的状态，因为为每个区块存储单独的链状态需要太多空间。但在 TON 区块链中，由于采用了重复数据删除技术，您只需为每个区块添加新的存储 cell 。这不仅能加快处理速度，还能让您高效地处理历史记录：检查余额、状态，甚至在历史记录中的任意点运行获取方法，而无需太多开销！

当我们有一系列类似的合约（例如，jetton-wallet）时，节点只需存储一次重复数据（每个 jetton-wallet 的相同代码）。Library cell 允许利用重复数据删除机制来减少存储和转发费用。

:::info 高级类比
您可以将 library cell  视为 C++ 指针：一个小 cell 指向具有（可能）多个引用的大 cell 。被引用的 cell （library cell 指向的 cell ）应该存在并在公共上下文中注册（*"已发布"*）。
:::

## Library Cell的结构

library cell 是 [exotic cell](/v3/documentation/data-formats/tlb/exotic-cells)，包含对其他静态 cell 的引用。特别是，它包含引用 cell 的 256 位哈希值。

对于 TVM 而言，library cell 的工作原理如下：每当 TVM 接收到打开 cell 到片段的命令时（TVM 指令：`CTOS`，funcC 方法：`.begin_parse()`），它就会从 Masterchain 库上下文中的 library cell 中搜索具有相应哈希值的 cell 。如果找到，则打开引用的 cell 并返回其 slice 。

打开 library cell 的费用与打开普通 cell 的费用相同，因此它可以作为静态 cell 的透明替代品，但占用的空间要小得多（因此存储和发送费用也较低）。

请注意，创建的 library cell 有可能引用另一个 library cell ，而另一个 library cell 又引用另一个 library cell ，依此类推。在这种情况下，`.begin_parse()` 将引发异常。不过，可以使用 `XLOAD` 操作码逐步解包此类库。

library cell 的另一个重要特性是，由于它包含被引用 cell 的哈希值，因此最终是对某些静态数据的引用。您不能更改该 library cell 所引用的数据。

要在主链库上下文中找到 library cell ，并因此被 library cell 引用，源 cell 需要在主链中发布。  这意味着，存在于主链中的智能合约需要将该 cell 添加到其状态中，并标记 "public=true"。这可以使用 `SETLIBCODE` 操作码来实现。

## 在智能合约中使用

由于 library cell 在除费用计算之外的所有情况下都与普通 cell 具有相同的行为，因此您可以用它来代替任何具有静态数据的 cell 。例如，您可以将 jetton-wallet 代码存储为 library cell （因此是 1 个 cell 和 256+8 位，而不是通常的 ~20 个 cell 和 6000 位），这将大大减少存储和转发费用。特别是，包含 "init_code "的 "internal_transfer "信息的转发费将从 0.011 TON 降至 0.003 TON。

### 在 library cell 中存储数据

让我们来看看将 jetton-wallet 代码存储为 library cell 以减少费用的例子。首先，我们需要将 jetton-wallet 编译成包含其代码的普通 cell 。

然后，您需要创建引用普通 cell 的 library cell 。library cell 包含 library 的 8 位标签 `0x02` 和 256 位引用 cell 哈希值。

### 在 Fift 中使用

基本上，您需要在生成器中添加标记和哈希值，然后 "将生成器作为异域 cell 关闭"。

它可以在 Fift-asm 结构中完成，如 [this](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), 将一些合约直接编译到 library cell   [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts) 的例子。

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```

### 在 @ton/ton 中使用

或者，您可以在 Blueprint 中完全通过 TypeScript 层级使用 `@ton/ton` 库构建 Library Cell ：

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

- 了解资料来源 [此处](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90)。

### 在主链库上下文中发布普通 cell

实际示例 [此处](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func)。该合约的核心是 `set_lib_code(lib_too_publish, 2);` - 它接受需要发布的普通 cell 作为输入，并接受 flag=2（表示每个人都可以使用）。

请注意，发布 cell 的合约在主链中的存储费用是在基链中的 1000 倍。因此，只有成千上万用户使用的合约才能有效使用  library cell。

### 在 Blueprint 中测试

要测试使用 library cell 的合约如何在 blueprint 中运行，需要手动将引用的 cell 添加到 blueprint 模拟器的库上下文中。具体方法如下

1. 您需要创建库上下文字典（Hashmap）"uint256->Cell"，其中 "uint256 "是相应 Cell 的哈希值。
2. 将库上下文安装到模拟器设置中。

示例 [此处](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32)。

:::info
请注意，当前的 blueprint 版本（`@ton/blueprint:0.19.0`）不会自动更新库上下文，如果在仿真过程中某些合约发布了新库，则需要手动更新。
这是 04.2024 版的实际问题，估计不久的将来会得到改进。
:::

### 获取 library cell 合约的方法

您在 library cell 中存储了 jetton-wallet 及其代码，并希望检查余额。

要检查余额，需要执行代码中的 get 方法。这包括

- 访问 library cell
- 检索引用 cell 的哈希值
- 在主链的库集合中找到有该哈希值的 cell
- 从这里开始执行代码。

在分层解决方案（LS）中，所有这些过程都在幕后进行，用户无需了解具体的代码存储方法。

但是，在本地工作时，情况就不同了。例如，如果您使用资源管理器或钱包，您可能会获取账户状态并尝试确定其类型--是 NFT、钱包、代币还是拍卖。

对于普通合约，您可以查看可用的获取方法，即接口，以了解它。或者，你可以 "窃取 "一个账户状态到我的本地伪网，并在那里执行方法。

对于 library cell  ，这是不可能的，因为它本身不包含数据。您必须手动检测并从上下文中检索必要的 cell 。这可以通过 LS（尽管绑定还不支持）或 DTon 来实现。

#### 使用 Liteserver 检索 library cell

Liteserver 在运行 get 方法时会自动设置正确的库上下文。如果想通过获取方法检测合约类型或在本地运行获取方法，则需要通过 LS 方法 [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96) 下载相应的 cell 。

#### 使用 DTon 检索 library cell

您也可以从 [dton.io/graphql](https://dton.io/graphql) 获取库：

```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```

以及特定主链区块的库列表：

```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## 另请参见

- [外来 cell ](/v3/documentation/data-formats/tlb/exotic-cells)
- [TVM Instructions](/v3/documentation/tvm/instructions)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/msg-tlb.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/msg-tlb.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# 消息 TL-B 方案

本节详细解释消息的 TL-B 方案。

## 消息 TL-B

### TL-B

主要消息 TL-B 方案声明为几个嵌套结构的组合

```tlb
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;

message$_ {X:Type} info:CommonMsgInfoRelaxed
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = MessageRelaxed X;

_ (Message Any) = MessageAny;
```

这里 `Message X` - 是常见消息结构，`MessageRelaxed X` 是带有 CommonMsgInfoRelaxed 体的附加类型，而 `Message Any` 是两者的并集。消息结构与 X:Type 统一，换句话说就是一个 Cell。根据 TL-B，如果数据能够适应 1023 位，我们可以将所有数据组合在一个cell中，或者使用带有插入符号 `^` 的引用。

序列化的 `Message X` 通过 FunC 方法 send_raw_message() 放置到动作列表中，然后智能合约执行此动作并发送消息。

### 显式序列化的定义

根据 TL-B 结构构建有效的二进制数据，我们应该进行序列化，这对每种类型都是递归定义的。这意味着，要序列化 Message X，我们需要知道如何序列化 `StateInit`、`CommonMsgInfo` 等。

我们应该根据递归链接从另一个 TL-B 方案中获取每个嵌套结构，直到顶层结构的序列化是显式的 - 每个位由布尔或类似位的类型（比特，uint，varuint）定义。

目前在常规开发中不使用的结构将在 Type 列中标记为 `*`，例如 \*Anycast 通常在序列化中被跳过。

### message$_

这是整个消息 `Message X` 的顶层 TL-B 方案：

```tlb
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;
```

| 结构        | 类型                                  | 必需      | 描述                                                                                                            |   |
| --------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- | - |
| message$_ | 构造函数                                |         | 按照构造函数规则定义。空标记 `$_` 表示我们不会在开头添加任何位                                                                            |   |
| info      | [CommonMsgInfo](#commonmsginfo)     | 必需      | 详细的消息属性定义目的地及其值。始终放置在消息的根cell中。                                                                               |   |
| init      | [StateInit](#stateinit-tl-b)        | 可选      | 通用结构，用于 TON 中初始化新合约。可以写在cell引用或根cell中。                                                                        |   |
| body      | X                                   | 必需      | 消息有效载荷。可以写在cell引用或根cell中。                                                                                     |   |

```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
```

回想一下 `Maybe` 和 `Either` 的工作方式，我们可以序列化不同的情况：

- `[CommonMsgInfo][10][StateInit][0][X]` - `Message X` 在一个cell中

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-9.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-9-dark.png?raw=true',
}}
/>
<br></br>

- `[CommonMsgInfo][11][^StateInit][1][^X]` - `Message X` 带引用

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-8.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-8-dark.png?raw=true',
}}
/>
<br></br>

## CommonMsgInfo TL-B

### CommonMsgInfo

`CommonMsgInfo` 是一系列参数的列表，定义了消息在 TON 区块链中的传递方式。

```tlb
//internal message
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddressInt dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;

//external incoming message
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
  import_fee:Grams = CommonMsgInfo;

//external outgoing message
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

### int_msg_info$0

`int_msg_info` 是内部消息的一种情况。这意味着它们可以在合约之间发送，且只能在合约之间发送。
用例 - 普通的跨合约消息。

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
//internal message
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddressInt dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

| 结构             | 类型                                        | 必需      | 描述                                                                                                                   |
| -------------- | ----------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| int_msg_info$0 | 构造函数                                      | 必需      | $0 标记意味着序列化 CommonMsgInfo 以 0 位开始描述内部消息。                                                                             |
| ihr_disabled   | 布尔                                        | 必需      | 超立方体路由标志位。                                                                                                           |
| bounce         | 布尔                                        | 必需      | 如果处理过程中出现错误，消息应该被弹回。如果消息的 flat bounce = 1，它被称为可弹回。                                                                   |
| bounced        | 布尔                                        | 必需      | 描述消息本身是弹回结果的标志位。                                                                                                     |
| src            | [MsgAddressInt](#msgaddressint-tl-b)      | 必需      | 消息发送者智能合约的地址。                                                                                                        |
| dest           | [MsgAddressInt](#msgaddressint-tl-b)      | 必需      | 消息目的地智能合约的地址。                                                                                                        |
| value          | [CurrencyCollection](#currencycollection) | 必需      | 描述货币信息的结构，包括消息中转移的总资金。                                                                                               |
| ihr_fee        | [VarUInteger 16](#varuinteger-n)          | 必需      | 超路由交付费用                                                                                                              |
| fwd_fee        | [VarUInteger 16](#varuinteger-n)          | 必需      | 验证者指定的转发消息费用                                                                                                         |
| created_lt     | uint64                                    | 必需      | 验证者指定的发送消息的逻辑时间。用于对智能合约中的动作进行排序。                                                                                     |
| created_at     | uint32                                    | 必需      | Unix 时间                                                                                                              |

### ext_in_msg_info$10

`ext_in_msg_info$10` 是外部传入消息的一种情况。这意味着这种类型的消息是从合约发送到链下空间的。\
用例 - 钱包应用请求钱包合约。

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
//external incoming message
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
  import_fee:Grams = CommonMsgInfo;
```

| Structure           | Type                                 | Required | Description                                                                                                                                                   |
| ------------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ext_out_msg_info$10 | Constructor                          | Required | `$10` 标签意味着，在序列化过程中，以 "10 "位开头的 CommonMsgInfo 描述了一条外部接收的消息。                                                                                                   |
| ihr_disabled        | Bool                                 | Required | 超级路由标志。(目前始终为真）                                                                                                                                               |
| src                 | [MsgAddressExt](#msgaddressext-tl-b) | Required | 外部发件人的地址。                                                                                                                                                     |
| dest                | [MsgAddressInt](#msgaddressint-tl-b) | Required | 智能合约信息目的地的地址。                                                                                                                                                 |
| import_fee          | [VarUInteger 16](#varuinteger-n)     | Required | 执行和传递信息的费用。                                                                                                                                                   |

### ext_out_msg_info$11

`ext_out_msg_info$11`是外部发送信息的一种情况。这意味着它们可以从合约发送到链外空间。
用例 - 日志。

```tlb
//internal message
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

| Structure           | Type                                  | Required | Description                                                                                                       |
| ------------------- | ------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| ext_out_msg_info$11 | Constructor                           | Required | `$11` 标签的意思是，在序列化过程中，以 "11 "位开头的 CommonMsgInfo 描述了一条对外发送的消息。                                                      |
| src                 | [MsgAddressInt](#msgaddressint-tl-b)  | Required | Hyper routing flag. v                                                                                             |
| dest                | [MsgAddressExt](#msgaddressext-tl-b)  | Required | TON 中用于初始化新合约的一般结构。可以写入 cell 引用或根 cell 。                                                                          |
| created_lt          | uint64                                | Required | 验证器指定的发送信息的逻辑时间。用于智能合约中的订购操作。                                                                                     |
| created_at          | uint32                                | Required | Unix time                                                                                                         |

## StateInit TL-B

StateInit 用于将初始数据交付给合约，并在合约部署时使用。

```tlb
_ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
  code:(Maybe ^Cell) data:(Maybe ^Cell)
  library:(HashmapE 256 SimpleLib) = StateInit;
```

| Structure   | Type                     | Required | Description                                                                                                                                            |
| ----------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| split_depth | (## 5)                   | Optional | 高负载合约的参数，用于定义在不同分片中分割成多个实例的行为。目前 StateInit 不使用该参数。                                                                                                     |
| special     | TickTock\*               | Optional | 用于在区块链的每个新区块中调用智能合约。仅在主链中可用。普通用户的合约无需使用它。                                                                                                              |
| code        | Cell                     | Optional | 合约的序列化代码。                                                                                                                                              |
| data        | Cell                     | Optional | 合约初始数据。                                                                                                                                                |
| library     | HashmapE 256 SimpleLib\* | Optional | 当前使用的 StatInit 不含有任何libs                                                                                                                               |

[General detailed explanations for Hashmaps](/v3/documentation/data-formats/tlb/tl-b-types#hashmap)

## MsgAddressExt TL-B

```tlb
addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 9) external_address:(bits len)
= MsgAddressExt;
```

`MsgAddress` 是地址的各种序列化方案。根据发送信息的参与者（链外或智能合约）不同，使用的结构也不同。

### addr_none$00

`addr_none$00` - 用于定义链外参与者的空地址。这意味着我们可以向没有唯一发件人地址的合约发送外部消息。

```tlb
addr_none$00 = MsgAddressExt;
```

| Structure           | Type               | Required | Description                                                                                                             |
| ------------------- | ------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| addr_none$00        | Constructor        | Required | `$00` 标记表示在序列化中，MsgAddressExt 以 "00 "位开始。这意味着整个外部地址为 `00`。                                                              |

### addr_extern$01

```tlb
addr_extern$01 len:(## 9) external_address:(bits len)
= MsgAddressExt;
```

| Structure        | Type        | Required | Description                                                                                                                                                 |
| ---------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addr_extern$01   | Constructor | Required | `$01` 标记表示在序列化中，MsgAddressExt 以 "01 "位开始，描述一个外部地址。                                                                                                          |
| len              | ## 9        | Required | 与 uintN 相同 - 表示无符号 N 位数                                                                                                                                     |
| external_address | (bits len)  | Required | 地址是 len 等于前一个 `len` 的位字符串                                                                                                                                   |

## MsgAddressInt TL-B

```tlb
addr_std$10 anycast:(Maybe Anycast)
workchain_id:int8 address:bits256  = MsgAddressInt;

addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```

### addr_std$10

```tlb
addr_std$10 anycast:(Maybe Anycast)
workchain_id:int8 address:bits256  = MsgAddressInt;
```

| Structure    | Type         | Required | Description                                                                                                                                                                 |
| ------------ | ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addr_std$10  | Constructor  | Required | `$10` 标签表示，在序列化中，MsgAddressExt 以 "10 "位开始，描述一个外部地址。                                                                                                                         |
| anycast      | Anycast\*    | Optional | 附加地址数据，目前不用于普通内部报文                                                                                                                                                          |
| workchain_id | int8         | Required | 放置目标地址智能合约的工作链。目前总是等于零。                                                                                                                                                     |
| address      | (bits256)    | Required | 智能合约账户 ID 号                                                                                                                                                                 |

### addr_std$10

```tlb
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```

| 结构           | 类型          | 必需        | 描述                                                                                                                                                                                         |
| ------------ | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| addr_std$10  | 构造函数        | 必需        | `$10` 标记意味着序列化 MsgAddressExt 以 `10` 位开始描述外部地址。                                                                                                                                             |
| anycast      | Anycast\*   | 可选        | 额外的地址数据，目前普通内部消息中未使用                                                                                                                                                                       |
| workchain_id | int8        | 必需        | 目的地地址的智能合约所在的工作链。目前始终为零。                                                                                                                                                                   |
| address      | (bits256)   | 必需        | 智能合约账户 ID 号                                                                                                                                                                                |
| address      | (bits256)   | Required  | 有效载荷地址（可以是账户 ID）                                                                                                                                                                           |

## addr_var$11

### CurrencyCollection

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
currencies$_ grams:Grams other:ExtraCurrencyCollection
= CurrencyCollection;
```

| Structure    | Type                    | Required | Description                                                                                                  |
| ------------ | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| currencies$_ | Constructor             | Required | `$_` 空标签意味着，在序列化 CurrencyCollection 时，我们不会在开头添加任何位                                                           |
| grams        | (VarUInteger 16)        | Required | Message value in nanoTons                                                                                    |
| other        | ExtraCurrencyCollection | Optional | ExtraCurrencyCollection 是专为附加货币设计的指令，通常为空。                                                                   |

- ExtraCurrencyCollection 复杂类型，通常在信息中写成空 dict

### VarUInteger n

```tlb
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
= VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8))
= VarInteger n;
```

| Structure  | Type              | Required | Description                                                                                                                                                                         |
| ---------- | ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| var_uint$_ | Constructor       | Required | `var_uint$_` 空标签意味着，在序列化 CurrencyCollection 时，我们不会在开头添加任何位                                                                                                                          |
| len        | uintN             | Required | 下一数值的参数 len 位                                                                                                                                                                       |
| value      | (uint (len \* 8)) | Optional | 以 (len \* 8) 位写入的整数 uint 值                                                                                                                                                          |

## VarUInteger n

### 常规 func 内部信息

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

### 常规函数信息简表

可以跳过总是被验证器覆盖的信息部分（用零位填充）。信息的发件人也会被跳过，序列化为 `addr_none$00`。

```func
  cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(amount)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_slice(message_body)
.end_cell();
```



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/proofs.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/proofs.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# 证明验证（低层级）

## 概述

:::caution
本节描述了与TON进行低层级交互的指令和手册。假设您已经熟悉了[特殊cell](/develop/data-formats/exotic-cells)、[TL-B 语言](/develop/data-formats/tl-b-language)并
理解了[简单证明验证](/develop/data-formats/exotic-cells#simple-proof-verifying-example)示例。
:::

本文描述了从Liteservers验证证明的高级示例。

从节点接收任何数据时，核实数据的真实性对于与区块链进行无信任交互非常重要。然而，文章仅涵盖了与Liteserver无信任通信的一部分，因为它假设您已经验证了从Liteserver（或其他任何人）收到的区块哈希。区块哈希验证更为高级，因为您需要同步关键区块和（或）检查区块签名，
将来会在另一篇文章中描述。但无论如何，即使只使用这些示例，您也降低了Liteserver发送错误数据而您相信的可能性。

## 区块头

假设我们知道一个区块ID：

```json
<TL BlockIdExt [wc=-1, shard=-9223372036854775808, seqno=31220993, root_hash=51ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406, file_hash=d4fcdc692de1a252deb379cd25774842b733e6a96525adf82b8ffc41da667bf5] >
```

我们向Liteserver请求此区块的头部。Liteserver的[响应](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tl/generate/scheme/lite_api.tl#L35)包含一个`header_proof` boc。

<details>

<summary><b>显示boc</b></summary>

```boc

b5ee9c72010207010001470009460351ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406001601241011ef55aaffffff110204050601a09bc7a98700000000040101dc65010000000100ffffffff000000000000000064b6c356000023d38ba64000000023d38ba64004886d00960007028101dc64fd01dc42bec400000003000000000000002e030098000023d38b96fdc401dc650048a3971c46472b85c8d761060a6e7ae9f13a90cdda815915a89597cfecb393a6b568807adfb3c1c5efc920907225175db61ca384e4f8b313799e3cbb8b7b4085284801018c6053c1185700c0fe4311d5cf8fa533ea0382e361a7b76d0cf299b75ac0356c000328480101741100d622b0d5264bcdb86a14e36fc8c349b82ae49e037002eb07079ead8b060015284801015720b6aefcbf406209522895faa6c0d10cc3315d90bcaf09791b19f595e86f8f0007

```

</details>

解序列化boc后，我们得到Cell：

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		288[0101741100D622B0D5264BCDB86A14E36FC8C349B82AE49E037002EB07079EAD8B060015],
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```

我们应根据区块[Tlb 方案](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L442)进行反序列化：

```python
{
  'global_id': -239,
  'info':
    {
      'version': 0,
      'not_master': 0,
      'after_merge': 0,
      'before_split': 0,
      'after_split': 0,
      'want_split': False,
      'want_merge': True,
      'key_block': False,
      'vert_seqno_incr': 0,
      'flags': 1,
      'seqno': 31220993,
      'vert_seqno': 1,
      'shard': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
      'gen_utime': 1689699158,
      'start_lt': 39391488000000,
      'end_lt': 39391488000004,
      'gen_validator_list_hash_short': 2288844950,
      'gen_catchain_seqno': 459393,
      'min_ref_mc_seqno': 31220989,
      'prev_key_block_seqno': 31212222,
      'gen_software': {'version': 3, 'capabilities': 46},
      'master_ref': None,
      'prev_ref': {'type_': 'prev_blk_info', 'prev': {'end_lt': 39391487000004, 'seqno': 31220992, 'root_hash': b'H\xa3\x97\x1cFG+\x85\xc8\xd7a\x06\nnz\xe9\xf1:\x90\xcd\xda\x81Y\x15\xa8\x95\x97\xcf\xec\xb3\x93\xa6', 'file_hash': b'\xb5h\x80z\xdf\xb3\xc1\xc5\xef\xc9 \x90r%\x17]\xb6\x1c\xa3\x84\xe4\xf8\xb3\x13y\x9e<\xbb\x8b{@\x85'}},
      'prev_vert_ref': None
    },
  'value_flow': None,
  'state_update': None,
  'extra': None
}
```

现在，我们应该检查反序列化区块中的`seqno`是否与我们所知的区块`seqno`匹配，然后计算唯一的Merkle Proof引用的hash_1，并将其与我们所知的区块哈希进行比较：

```python
assert h_proof.refs[0].get_hash(0) == block_id.root_hash
```

现在，我们可以信任该Cell包含的所有其他数据

_检查证明示例：_ [Python](https://github.com/yungwine/pytoniq-core/blob/873a96aa2256db33b8f35fbe2ab8fe8cf8ae49c7/pytoniq_core/proof/check_proof.py#L19), [Kotlin](https://github.com/andreypfau/ton-kotlin/blob/b1edc4b134e89ccf252149f27c85fd530377cebe/ton-kotlin-liteclient/src/commonMain/kotlin/CheckProofUtils.kt#L15), [C++](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/check-proof.cpp#L34)

## 完整区块

对于`liteserver.getBlock`方法，证明验证与上述相同，但它包含完整的Cells，而不是裁剪过的分支，用于[值流](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L464)、[状态更新](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L412-L413)和[区块额外信息](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L452)的方案。

## 分片区块

分片证明是指分片引用实际存储在我们提供给Liteserver的主链区块中的证明。当我们调用`liteServer.getShardInfo`、`liteServer.getAccountState`和`liteServer.runSmcMethod`方法时，我们需要检查这些证明。

让我们向Liteserver请求上面提到的主链区块的分片信息：

```python
await client.raw_get_shard_info(master, wc=0)
```

Liteserver响应包含了分片区块的BlockIdExt：

```json
<TL BlockIdExt [wc=0, shard=-9223372036854775808, seqno=36908135, root_hash=39e5cbca5bf69750b5d9897872c3a0d7a3e614e521c53e4de728fafed38dce27, file_hash=f1f0e5cdc4b8a12cf2438dcab60f4712d1dc04f3792b1d72f2500cbf640948b7] >
```

分片证明boc：

<details>

<summary><b>显示boc</b></summary>

```boc

b5ee9c72010219020004b9010009460332bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046016f0209460351ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406001611245b9023afe2ffffff1100ffffffff000000000000000001dc65010000000164b6c356000023d38ba6400401dc64fd600304050628480101affe84cdd73951bce07eeaad120d00400295220d6f66f1163b5fa8668202d72b000128480101faed0dd3ca110ada3d22980e3795d2bdf15450e9159892bbf330cdfd13a3b880016e22330000000000000000ffffffffffffffff820ce9d9c3929379c82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23519b11eddc69b7e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101deab5a5aaf79c5e24f8dcbbe51747d6804104f75f58ed5bed4702c353545c6ac00110103d0400d284801015394592e3a3f1e3bc2d4249e993d0ec1e33ca18f49533991274ebc65276cd9a5001122bf0001aaa0161d000702816000047a7172dfb88800011e8b625908200ee215f71061846393a08c682e87bc3a12aff2d246eb97a09164f5657f96f9a252ef71580fe5309a823f73f3c4c3f8ab73f5a85bbf204bfd22e68d36d0efab1818e7b428be0f1028480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b6000101db50119963380ee3280800011e9c5cb7ee0000011e9c5cb7ee29cf2e5e52dfb4ba85aecc4bc3961d06bd1f30a7290e29f26f3947d7f69c6e713f8f872e6e25c50967921c6e55b07a38968ee0279bc958eb97928065fb204a45b88000381abc00000000000000000ee327eb25b61a8a0e001343c9b67a721dcd6500202848010150fcc05bd9723571b83316a5f650be31edb131d05fdc78d271486e5d4ef077e1001928480101e5be728200b172cf7e2356cba2ae1c6e2c790be7c03cd7814c6e6fe3080b944b0011241011ef55aaffffff111213141501a09bc7a98700000000040101dc65010000000100ffffffff000000000000000064b6c356000023d38ba64000000023d38ba64004886d00960007028101dc64fd01dc42bec400000003000000000000002e16284801018c6053c1185700c0fe4311d5cf8fa533ea0382e361a7b76d0cf299b75ac0356c00032a8a0478e0f0e601ba1161ecc1395e9a0475c4f80aadbd6c483f210e96e29cf36789e432bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046016f016f1718284801015720b6aefcbf406209522895faa6c0d10cc3315d90bcaf09791b19f595e86f8f00070098000023d38b96fdc401dc650048a3971c46472b85c8d761060a6e7ae9f13a90cdda815915a89597cfecb393a6b568807adfb3c1c5efc920907225175db61ca384e4f8b313799e3cbb8b7b4085688c010378e0f0e601ba1161ecc1395e9a0475c4f80aadbd6c483f210e96e29cf36789e46492304dfb6ef9149781871464af686056a9627f882f60e3b24f8c944a75ebaf016f0014688c010332bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046da58493ccb5da3876129b0190f3c375e69e59c3ad9ff550be708999dad1f6f39016f0014

```

</details>

以及我们可以使用的`shard_descr` boc，如果我们信任Liteserver。

<details>

<summary><b>显示boc</b></summary>

```boc

b5ee9c7201010201007d0001db50119963380ee3280800011e9c5cb7ee0000011e9c5cb7ee29cf2e5e52dfb4ba85aecc4bc3961d06bd1f30a7290e29f26f3947d7f69c6e713f8f872e6e25c50967921c6e55b07a38968ee0279bc958eb97928065fb204a45b88000381abc00000000000000000ee327eb25b61a8a01001343c9b67a721dcd650020

```

</details>

分片证明boc反序列化后我们得到2个根：

```json
[<Cell 280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> 1 refs>, <Cell 280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> 1 refs>]
```

第一个是主链区块的Merkle证明，我们应该检查（使用`check_block_header`函数）：

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
			560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
			560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
		},
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```

Cell

```json
552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
    560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
    560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
}
```

是[ShardState](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L412-L413) TLB方案的Merkle更新，所以我们需要记住新的哈希。

在我们确认唯一的Merkle证明Cell引用的Hash_1与我们所知的区块哈希匹配，并记住了新的ShardState哈希后，我们检查第二个`shard proof` Cell：

```json
280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> {
	362[9023AFE2FFFFFF1100FFFFFFFF000000000000000001DC65010000000164B6C356000023D38BA6400401DC64FD40] -> {
		288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001],
		288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E],
		204[0000000000000000FFFFFFFFFFFFFFFF820CE9D9C3929379C820] -> {
			288[0101A5A7D24057D8643B2527709D986CDA3846ADCB3EDDC32D28EC21F69E17DBAAEF0001],
			288[0101DEAB5A5AAF79C5E24F8DCBBE51747D6804104F75F58ED5BED4702C353545C6AC0011]
		},
		342[CC26AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC23519B11EDDC69B7C] -> {
			9[D000] -> {
				878[50119963380EE3280800011E9C5CB7EE0000011E9C5CB7EE29CF2E5E52DFB4BA85AECC4BC3961D06BD1F30A7290E29F26F3947D7F69C6E713F8F872E6E25C50967921C6E55B07A38968EE0279BC958EB97928065FB204A45B88000381ABC00000000000000000EE327EB25B61A88] -> {
					74[43C9B67A721DCD650000]
				}
			},
			288[01015394592E3A3F1E3BC2D4249E993D0EC1E33CA18F49533991274EBC65276CD9A50011],
			766[0001AAA0161D000702816000047A7172DFB88800011E8B625908200EE215F71061846393A08C682E87BC3A12AFF2D246EB97A09164F5657F96F9A252EF71580FE5309A823F73F3C4C3F8AB73F5A85BBF204BFD22E68D36D0EFAB1818E7B428BC] -> {
				288[010150FCC05BD9723571B83316A5F650BE31EDB131D05FDC78D271486E5D4EF077E10019],
				288[0101E5BE728200B172CF7E2356CBA2AE1C6E2C790BE7C03CD7814C6E6FE3080B944B0011]
			},
			288[0101B20E36A3B36A4CDEE601106C642E90718B0A58DAF200753DBB3189F956B494B60001]
		}
	}
}
```

正如我们所见，唯一的Merkle证明引用前缀为`9023AFE2`，这是[ShardStateUnsplit](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L410)TLB方案的前缀，所以我们需要将这个引用的Hash_1与上一步中记住的进行比较：

```python
"""
Here mc_block_cell is a first shard proof root and mc_state_root is the second one.
The check_block_header_proof function returns new hash of the ShardState Merkle Update.
"""

mc_state_hash = mc_state_root[0].get_hash(0)
state_hash = check_block_header_proof(mc_block_cell[0], blk.root_hash, True)

if mc_state_hash != state_hash:
    raise ProofError('mc state hashes mismatch')
```

- _为什么？_ - 因为我们已经检查了区块头证明，这意味着我们可以信任其他Cell数据。所以现在我们信任ShardState Merkle更新的新哈希，要信任第二个Cell数据，我们需要检查哈希是否匹配。

现在，让我们反序列化第二个Cell：

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
    'seq_no': 31220993,
    'vert_seq_no': 1,
    'gen_utime': 1689699158,
    'gen_lt': 39391488000004,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001] -> 0 refs>,
    'before_split': 0,
    'accounts': <Cell 288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E] -> 0 refs>,
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2364000148715550620, 'other': None},
    'total_validator_fees': {'grams': 0, 'other': None},
    'libraries': None,
    'master_ref': None,
    'custom': {
        'shard_hashes': {
            0: {'list': [{
                    'seq_no': 36908135,
                    'reg_mc_seqno': 31220993,
                    'start_lt': 39391487000000,
                    'end_lt': 39391487000005,
                    'root_hash': b"9\xe5\xcb\xca[\xf6\x97P\xb5\xd9\x89xr\xc3\xa0\xd7\xa3\xe6\x14\xe5!\xc5>M\xe7(\xfa\xfe\xd3\x8d\xce'",
                    'file_hash': b'\xf1\xf0\xe5\xcd\xc4\xb8\xa1,\xf2C\x8d\xca\xb6\x0fG\x12\xd1\xdc\x04\xf3y+\x1dr\xf2P\x0c\xbfd\tH\xb7',
                    'before_split': False,
                    'before_merge': False,
                    'want_split': False,
                    'want_merge': True,
                    'nx_cc_updated': False,
                    'flags': 0,
                    'next_catchain_seqno': 459607,
                    'next_validator_shard': 9223372036854775808,
                    'min_ref_mc_seqno': 31220989,
                    'gen_utime': 1689699153,
                    'split_merge_at': None,
                    'fees_collected': {'grams': 1016817575, 'other': None}, 'funds_created': {'grams': 1000000000, 'other': None}
                }]
            }
        },
        'config': {'config_addr': '5555555555555555555555555555555555555555555555555555555555555555', 'config': None},
        'flags': 1,
        'validator_info': {'validator_list_hash_short': 2862618141, 'catchain_seqno': 459393, 'nx_cc_updated': False},
        'prev_blocks': None,
        'after_key_block': True,
        'last_key_block': {'end_lt': 39382372000004, 'seqno': 31212222, 'root_hash': b'\xe2\x0c0\x8crt\x11\x8d\x05\xd0\xf7\x87BU\xfeZH\xddr\xf4\x12,\x9e\xac\xaf\xf2\xdf4J]\xee+', 'file_hash': b'\x01\xfc\xa6\x13PG\xee~x\x98\x7f\x15n~\xb5\x0bw\xe4\t\x7f\xa4\\\xd1\xa6\xda\x1d\xf5c\x03\x1c\xf6\x85'},
        'block_create_stats': {'type_': 'block_create_stats', 'counters': None},
        'global_balance': {'grams': 5089971531496870767, 'other': None}
    }
}
```

由于我们信任这个Cell，我们可以信任分片区块数据（`ShardStateUnsplit` -> `custom` -> `shard_hashes` -> `0 (shrdblk wc)` -> `leaf`）。

## 账户状态

让我们证明账户`EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG`在文章开头我们开始时使用的同一个主链区块的状态。

让我们证明账户`EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG`在文章开头我们开始时使用的同一个主链区块的状态。

<details>

<details>

```boc
Proof boc:
    b5ee9c7201023d020008480100094603f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd6902190209460339e5cbca5bf69750b5d9897872c3a0d7a3e614e521c53e4de728fafed38dce27001d34235b9023afe2ffffff110000000000000000000000000002332c670000000164b6c351000023d38b96fdc501dc64fd200304052848010138f8d1c6e9f798a477d13aa26cb4d6cfe1a17949ac276b2f1e0ce037a521b9bc0001221382097522af06ffaff1f0063321d90000000000000000ffffffffffffffff825d48abc1bfebfc7bc2df8993c189361000023d38b69370401dc64fd2fa78ec529bcf9931e14f9d8b27ec1469290c0baef8256d657ce573b9679c5997431fcda6bf2d0be39344a9336cfe0ae9c844a88d2bd8022102e4012a760d4db83323130104ba9157837fd7f8f8070833231301032030fdc45f2d3838090a0b284801013e38e2548c5236a9652c45e553ced677f76550097b94138a4576f122443944d400692848010159e1a18ee4e5670306b5203912c87dffc17898f0999bd128a6965027d53b6fa40215231301013fa38088aaea2b780c0d10284801016f315f25b4a39ac12c85fea4ecfe7a83e5e59d1f059783fa0c3ef2797308806100002848010188d5f8a73382aea73dede03fc3bcda2634a717ef50e7428d5a4a44c771b014b90066231301005ecd9e51e5d22a380e0f1023130100303b3b607d7ffc781112132848010182eb0e24c842092ec2705486cbbe98de8016d55f5cff4ea910471a4c3a7a1cf1003b28480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be000028480101ca85960e3fc3dfb6d26e83ae87a837ae5c2faf7c8d43ea177393c602fadaa0300039221100e0f41ada252e2f08141528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf50000284801014fae109c41f3d5e2be0a3ff00a007f2e50a796797700d18a7aa663e531c37180002d221100e05c33225b78bce8161728480101545b5925b3ab2a8df2470fe22a5a3c9cc64e3cb24407c26167e0fbb476e05309002c221100e03480847f372168181928480101844a14c99695506e920635d18e76d9e685adee74e5fba6f6d3b371ca77e348130029220f00d0b1cce62aecc81a1b220f00c625c7e90dfc681c1d284801019ca2157c92d49b9d051388de45d07072c78a3aa65a5b05547d94e0369aa6bdee002a284801010326812b62712345473070d679bc38cdbbce58b7a2bf6c5c6f091fc8d36e81cd001f220f00c279d628dbf2081e1f220f00c0b8f29f9d04e82021284801019143abf2a72662054eda4f4949d010c897aff4383b514b387cff790408231c6c001a28480101de5072f46a0e0ecab2bbfc2cfc62a3fe200f12d5d457df833a46eb747fa004e30059220f00c03fa2ec9ad848222328480101baee90fd11a130d6d2e2ded21ae4a7b86553116015b7e7ebfc52369534d298b20017220f00c02e722bded7282425220d00ab138e7f18482627284801017f1df311101e472b1d443334d2426fd339539f558694c60e3428221dcb1a5478001628480101e1fc242c29e519f9740ca2570d85779aed0c593cc36b59119852945988e186960015220d00a21324d3ff2828292848010199fe288fdce2606d39f9b6af72f9c2643ef06e6bacc15dd72cfa84d63c9e44a40013220d00a1e877ec8ba82a2b284801019e019e92be76a5ae7aee239299f561682afbe445dc42ee57ccc31ecb427fdf42000e220d00a1db848431a82c2d284801012345b80e66c025fb62c41261b5d230616303ec47f3bb7a255872fada62a1e8bf0010220d00a1d633bc10682e2f220d00a02ca3ddc468303128480101654781e5d466ec4ca50cb2983b20170bb5d90e2e6ab83ed7d42a829651a5eec1000a219abb19e61b8190c2587677c010ce49a93364b965f7762a9810d916b082f45e080a02bc35ebaa649b46ac72e6e4d4c1293b66d58d9ed7a54902beefd97f5bff7977dd85998b3d000023c5643934413228480101edced2278013ea497dd2e286f495b4f7f8df6ea73e08e85414fc43a611c17797000b284801018282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488000828480101b3e9649d10ccb379368e81a3a7e8e49c8eb53f6acc69b0ba2ffa80082f70ee390001241011ef55aaffffff113536373802a09bc7a98700000000840102332c67000000010000000000000000000000000064b6c351000023d38b96fdc0000023d38b96fdc5d41c6e3c0007035701dc64fd01dc42bec400000003000000000000002e393a28480101cb54530ac857df730e82ee239b2150528c6e5f6ed3678eab6e1e789f0e3c7a5300032a8a04f2ad1ede336a68623ddabf36cb8fa405dbe70a38c453f711000f9a9f92592db0f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd69021902193b3c28480101d0cf03a1058c2fd6029288951051a0d82733953c1e9181a67c502ce59b180200000b0098000023d38b69370401dc64fd2fa78ec529bcf9931e14f9d8b27ec1469290c0baef8256d657ce573b9679c5997431fcda6bf2d0be39344a9336cfe0ae9c844a88d2bd8022102e4012a760d4db0098000023d38b87bb8402332c662b4e96320f9d0afb02e5d55b6b42c3349e33540620ecc07b399211fd56e4de3e2555617cdde457cd65a0ad033aafc0c6c25df716b04e455f49179668a46300db688c0103f2ad1ede336a68623ddabf36cb8fa405dbe70a38c453f711000f9a9f92592db04a4ff9713b206e420baaee4dd21febbeb426fcd9ce158db2a56dce9188fc313e0219001b688c0103f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd6987d796744ca386906016c56921370d01f72cb004a1d7c294752afe4446da07bb0219001b
State boc:
    b5ee9c720102160100033c000271c006f5bc67986e06430961d9df00433926a4cd92e597ddd8aa6043645ac20bd178222c859043259e0d9000008f1590e4d10d405786bd75534001020114ff00f4a413f4bcf2c80b030051000000e929a9a317c1b3226ce226d6d818bafe82d3633aa0f06a6c677272d1f9b760ff0d0dcf56d8400201200405020148060704f8f28308d71820d31fd31fd31f02f823bbf264ed44d0d31fd31fd3fff404d15143baf2a15151baf2a205f901541064f910f2a3f80024a4c8cb1f5240cb1f5230cbff5210f400c9ed54f80f01d30721c0009f6c519320d74a96d307d402fb00e830e021c001e30021c002e30001c0039130e30d03a4c8cb1f12cb1fcbff1213141502e6d001d0d3032171b0925f04e022d749c120925f04e002d31f218210706c7567bd22821064737472bdb0925f05e003fa403020fa4401c8ca07cbffc9d0ed44d0810140d721f404305c810108f40a6fa131b3925f07e005d33fc8258210706c7567ba923830e30d03821064737472ba925f06e30d08090201200a0b007801fa00f40430f8276f2230500aa121bef2e0508210706c7567831eb17080185004cb0526cf1658fa0219f400cb6917cb1f5260cb3f20c98040fb0006008a5004810108f45930ed44d0810140d720c801cf16f400c9ed540172b08e23821064737472831eb17080185005cb055003cf1623fa0213cb6acb1fcb3fc98040fb00925f03e20201200c0d0059bd242b6f6a2684080a06b90fa0218470d4080847a4937d29910ce6903e9ff9837812801b7810148987159f31840201580e0f0011b8c97ed44d0d70b1f8003db29dfb513420405035c87d010c00b23281f2fff274006040423d029be84c6002012010110019adce76a26840206b90eb85ffc00019af1df6a26840106b90eb858fc0006ed207fa00d4d422f90005c8ca0715cbffc9d077748018c8cb05cb0222cf165005fa0214cb6b12ccccc973fb00c84014810108f451f2a7020070810108d718fa00d33fc8542047810108f451f2a782106e6f746570748018c8cb05cb025006cf165004fa0214cb6a12cb1fcb3fc973fb0002006c810108d718fa00d33f305224810108f459f2a782106473747270748018c8cb05cb025005cf165003fa0213cb6acb1f12cb3fc973fb00000af400c9ed54
```

</details>

当我们检查了`Shard Proof`后，我们需要反序列化`proof`和`state` cells。首先，`proof`证明Cell必须有两个根：

```json

[<Cell 280[0339E5CBCA5BF69750B5D9897872C3A0D7A3E614E521C53E4DE728FAFED38DCE27001D] -> 1 refs>, <Cell 280[03F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD690219] -> 1 refs>]

```

第一个根是分片区块的Merkle证明（我们已经证明并信任它的哈希）：

```json
280[0339E5CBCA5BF69750B5D9897872C3A0D7A3E614E521C53E4DE728FAFED38DCE27001D] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000840102332C67000000010000000000000000000000000064B6C351000023D38B96FDC0000023D38B96FDC5D41C6E3C0007035701DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B69370401DC64FD2FA78EC529BCF9931E14F9D8B27EC1469290C0BAEF8256D657CE573B9679C5997431FCDA6BF2D0BE39344A9336CFE0AE9C844A88D2BD8022102E4012A760D4DB],
			608[000023D38B87BB8402332C662B4E96320F9D0AFB02E5D55B6B42C3349E33540620ECC07B399211FD56E4DE3E2555617CDDE457CD65A0AD033AAFC0C6C25DF716B04E455F49179668A46300DB]
		},
		288[0101CB54530AC857DF730E82EE239B2150528C6E5F6ED3678EAB6E1E789F0E3C7A530003],
		552[04F2AD1EDE336A68623DDABF36CB8FA405DBE70A38C453F711000F9A9F92592DB0F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD6902190219] -> {
			560[0103F2AD1EDE336A68623DDABF36CB8FA405DBE70A38C453F711000F9A9F92592DB04A4FF9713B206E420BAAEE4DD21FEBBEB426FCD9CE158DB2A56DCE9188FC313E0219001B],
			560[0103F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD6987D796744CA386906016C56921370D01F72CB004A1D7C294752AFE4446DA07BB0219001B]
		},
		288[0101D0CF03A1058C2FD6029288951051A0D82733953C1E9181A67C502CE59B180200000B]
	}
}
```

如同在`Shard Proof`验证中所做的，我们需要使用`check_block_header`函数：检查Block Cell是否有效并记住新的`StateUpdate`哈希。

如同在`Shard Proof`验证中所做的，我们需要使用`check_block_header`函数：检查Block Cell是否有效并记住新的`StateUpdate`哈希。

```python
proof_cells = Cell.from_boc(proof)
if len(proof_cells) != 2:
    raise ProofError('expected 2 root cells in account state proof')

state_cell = proof_cells[1]

state_hash = check_block_header_proof(proof_cells[0][0], shrd_blk.root_hash, True)

if state_cell[0].get_hash(0) != state_hash:
    raise ProofError('state hashes mismatch')
```

现在我们可以信任`state_cell`，它看起来是这样的：

<details>

<details>

```json
280[03F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD690219] -> {
	362[9023AFE2FFFFFF110000000000000000000000000002332C670000000164B6C351000023D38B96FDC501DC64FD00] -> {
		288[010138F8D1C6E9F798A477D13AA26CB4D6CFE1A17949AC276B2F1E0CE037A521B9BC0001],
		75[82097522AF06FFAFF1E0] -> {
			76[0104BA9157837FD7F8F0] -> {
				76[01032030FDC45F2D3830] -> {
					288[010159E1A18EE4E5670306B5203912C87DFFC17898F0999BD128A6965027D53B6FA40215],
					76[01013FA38088AAEA2B70] -> {
						288[010188D5F8A73382AEA73DEDE03FC3BCDA2634A717EF50E7428D5A4A44C771B014B90066],
						76[01005ECD9E51E5D22A30] -> {
							76[0100303B3B607D7FFC70] -> {
								288[0101CA85960E3FC3DFB6D26E83AE87A837AE5C2FAF7C8D43EA177393C602FADAA0300039],
								68[00E0F41ADA252E2F00] -> {
									288[01014FAE109C41F3D5E2BE0A3FF00A007F2E50A796797700D18A7AA663E531C37180002D],
									68[00E05C33225B78BCE0] -> {
										288[0101545B5925B3AB2A8DF2470FE22A5A3C9CC64E3CB24407C26167E0FBB476E05309002C],
										68[00E03480847F372160] -> {
											288[0101844A14C99695506E920635D18E76D9E685ADEE74E5FBA6F6D3B371CA77E348130029],
											60[00D0B1CCE62AECC0] -> {
												60[00C625C7E90DFC60] -> {
													288[01010326812B62712345473070D679BC38CDBBCE58B7A2BF6C5C6F091FC8D36E81CD001F],
													60[00C279D628DBF200] -> {
														60[00C0B8F29F9D04E0] -> {
															288[0101DE5072F46A0E0ECAB2BBFC2CFC62A3FE200F12D5D457DF833A46EB747FA004E30059],
															60[00C03FA2EC9AD840] -> {
																288[0101BAEE90FD11A130D6D2E2DED21AE4A7B86553116015B7E7EBFC52369534D298B20017],
																60[00C02E722BDED720] -> {
																	52[00AB138E7F1840] -> {
																		288[0101E1FC242C29E519F9740CA2570D85779AED0C593CC36B59119852945988E186960015],
																		52[00A21324D3FF20] -> {
																			288[010199FE288FDCE2606D39F9B6AF72F9C2643EF06E6BACC15DD72CFA84D63C9E44A40013],
																			52[00A1E877EC8BA0] -> {
																				288[01019E019E92BE76A5AE7AEE239299F561682AFBE445DC42EE57CCC31ECB427FDF42000E],
																				52[00A1DB848431A0] -> {
																					288[01012345B80E66C025FB62C41261B5D230616303EC47F3BB7A255872FADA62A1E8BF0010],
																					52[00A1D633BC1060] -> {
																						52[00A02CA3DDC460] -> {
																							616[BB19E61B8190C2587677C010CE49A93364B965F7762A9810D916B082F45E080A02BC35EBAA649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> {
																								288[01018282D13BF66B9ACE1FBF5D3ABD1C59CC46D61AF1D47AF1665D3013D8F9E474880008]
																							},
																							288[0101EDCED2278013EA497DD2E286F495B4F7F8DF6EA73E08E85414FC43A611C17797000B]
																						},
																						288[0101654781E5D466EC4CA50CB2983B20170BB5D90E2E6AB83ED7D42A829651A5EEC1000A]
																					}
																				}
																			}
																		}
																	},
																	288[01017F1DF311101E472B1D443334D2426FD339539F558694C60E3428221DCB1A54780016]
																}
															}
														},
														288[01019143ABF2A72662054EDA4F4949D010C897AFF4383B514B387CFF790408231C6C001A]
													}
												},
												288[01019CA2157C92D49B9D051388DE45D07072C78A3AA65A5B05547D94E0369AA6BDEE002A]
											}
										}
									}
								},
								288[0101D7ACBB602338C86D610F35CFB362FD76FC18B1812476B6FCA99A0678E665FCF50000]
							},
							288[010182EB0E24C842092EC2705486CBBE98DE8016D55F5CFF4EA910471A4C3A7A1CF1003B],
							288[0101ED7E26BD36EFA6D5D9B4F6AAAB9813AF0742A84244977F74FD4074C9C98908BE0000]
						},
						288[0101ED7E26BD36EFA6D5D9B4F6AAAB9813AF0742A84244977F74FD4074C9C98908BE0000]
					},
					288[01016F315F25B4A39AC12C85FEA4ECFE7A83E5E59D1F059783FA0C3EF279730880610000]
				},
				288[01013E38E2548C5236A9652C45E553CED677F76550097B94138A4576F122443944D40069],
				288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
			},
			288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
		},
		868[0000000000000000FFFFFFFFFFFFFFFF825D48ABC1BFEBFC7BC2DF8993C189361000023D38B69370401DC64FD2FA78EC529BCF9931E14F9D8B27EC1469290C0BAEF8256D657CE573B9679C5997431FCDA6BF2D0BE39344A9336CFE0AE9C844A88D2BD8022102E4012A760D4DB0] -> {
			288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
		}
	}
}
```

</details>

同样，唯一的Merkle证明引用前缀为`9023AFE2`，这是[ShardStateUnsplit](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L410)
TLB方案的前缀，所以我们要根据TLB方案进行反序列化：

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': 0, 'shard_prefix': 0},
    'seq_no': 36908135,
    'vert_seq_no': 1,
    'gen_utime': 1689699153,
    'gen_lt': 39391487000005,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[010138F8D1C6E9F798A477D13AA26CB4D6CFE1A17949AC276B2F1E0CE037A521B9BC0001] -> 0 refs>,
    'before_split': 0,
    'accounts': (
        {
            50368879097771769677871174881221998657607998794347754829932074327482686052226: {
                'account': None,
                'last_trans_hash': b'd\x9bF\xacr\xe6\xe4\xd4\xc1);f\xd5\x8d\x9e\xd7\xa5I\x02\xbe\xef\xd9\x7f[\xffyw\xdd\x85\x99\x8b=',
                'last_trans_lt': 39330697000001,
                'cell': <Cell 320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> 1 refs>
            }
        },
        [
            {'split_depth': 0, 'balance': {'grams': 5873792469, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 5991493155, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 63109456003, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 63822897549, 'other': None}},
            ...
            {'split_depth': 0, 'balance': {'grams': 21778458402704, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 54074699968483, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 2725956214994157511, 'other': None}}
        ]
    ),
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2725956214994157511, 'other': None},
    'total_validator_fees': {'grams': 37646260890702444, 'other': None},
    'libraries': None,
    'master_ref': {'master': {'end_lt': 39391484000004, 'seqno': 31220989, 'root_hash': b'/\xa7\x8e\xc5)\xbc\xf9\x93\x1e\x14\xf9\xd8\xb2~\xc1F\x92\x90\xc0\xba\xef\x82V\xd6W\xceW;\x96y\xc5\x99', 'file_hash': b't1\xfc\xdak\xf2\xd0\xbe94J\x936\xcf\xe0\xae\x9c\x84J\x88\xd2\xbd\x80"\x10.@\x12\xa7`\xd4\xdb'}},
    'custom': None
}
```

我们需要`account`字段，它具有[ShardAccounts](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L261)类型。
`ShardAccounts`是一个HashmapAugE，其中键是地址的hash_part，值具有`ShardAccount`类型，额外数据具有`DeepBalanceInfo`类型。

我们需要`account`字段，它具有[ShardAccounts](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L261)类型。
`ShardAccounts`是一个HashmapAugE，其中键是地址的hash_part，值具有`ShardAccount`类型，额外数据具有`DeepBalanceInfo`类型。

```python
{
    50368879097771769677871174881221998657607998794347754829932074327482686052226: {
        'account': None,
        'last_trans_hash': b'd\x9bF\xacr\xe6\xe4\xd4\xc1);f\xd5\x8d\x9e\xd7\xa5I\x02\xbe\xef\xd9\x7f[\xffyw\xdd\x85\x99\x8b=',
        'last_trans_lt': 39330697000001,
        'cell': <Cell 320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> 1 refs>
    }
}
```

我们需要记住`last_trans_hash`和`last_trans_lt`，因为我们可以使用它们来获取账户交易，并检查这些数据的整个Cell：

```json
320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> {
	288[01018282D13BF66B9ACE1FBF5D3ABD1C59CC46D61AF1D47AF1665D3013D8F9E474880008]
}
```

我们看到Cell是一个普通的Cell，级别为1，只有一个引用 - 被剪裁的账户数据，因此我们计算这个剪裁分支的Hash_1 - 我们可以信任的账户状态哈希：`8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`。

我们看到Cell是一个普通的Cell，级别为1，只有一个引用 - 被剪裁的账户数据，因此我们计算这个剪裁分支的Hash_1 - 我们可以信任的账户状态哈希：`8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`。

```json
449[C006F5BC67986E06430961D9DF00433926A4CD92E597DDD8AA6043645AC20BD178222C859043259E0D9000008F1590E4D10D405786BD755300] -> {
	80[FF00F4A413F4BCF2C80B] -> {
		2[00] -> {
			4[40] -> {
				920[D001D0D3032171B0925F04E022D749C120925F04E002D31F218210706C7567BD22821064737472BDB0925F05E003FA403020FA4401C8CA07CBFFC9D0ED44D0810140D721F404305C810108F40A6FA131B3925F07E005D33FC8258210706C7567BA923830E30D03821064737472BA925F06E30D] -> {
					480[01FA00F40430F8276F2230500AA121BEF2E0508210706C7567831EB17080185004CB0526CF1658FA0219F400CB6917CB1F5260CB3F20C98040FB0006],
					552[5004810108F45930ED44D0810140D720C801CF16F400C9ED540172B08E23821064737472831EB17080185005CB055003CF1623FA0213CB6ACB1FCB3FC98040FB00925F03E2]
				},
				2[00] -> {
					2[00] -> {
						4[50] -> {
							242[B29DFB513420405035C87D010C00B23281F2FFF274006040423D029BE84C40],
							2[00] -> {
								97[ADCE76A26840206B90EB85FF80],
								97[AF1DF6A26840106B90EB858F80]
							}
						},
						68[B8C97ED44D0D70B1F0]
					},
					357[BD242B6F6A2684080A06B90FA0218470D4080847A4937D29910CE6903E9FF9837812801B7810148987159F3180]
				}
			},
			992[F28308D71820D31FD31FD31F02F823BBF264ED44D0D31FD31FD3FFF404D15143BAF2A15151BAF2A205F901541064F910F2A3F80024A4C8CB1F5240CB1F5230CBFF5210F400C9ED54F80F01D30721C0009F6C519320D74A96D307D402FB00E830E021C001E30021C002E30001C0039130E30D03A4C8CB1F12CB1FCBFF] -> {
				440[D207FA00D4D422F90005C8CA0715CBFFC9D077748018C8CB05CB0222CF165005FA0214CB6B12CCCCC973FB00C84014810108F451F2A702],
				448[810108D718FA00D33FC8542047810108F451F2A782106E6F746570748018C8CB05CB025006CF165004FA0214CB6A12CB1FCB3FC973FB0002],
				432[810108D718FA00D33F305224810108F459F2A782106473747270748018C8CB05CB025005CF165003FA0213CB6ACB1F12CB3FC973FB00],
				40[F400C9ED54]
			}
		}
	},
	321[000000E929A9A317C1B3226CE226D6D818BAFE82D3633AA0F06A6C677272D1F9B760FF0D0DCF56D800]
}
```

计算其 representation hash ，并确保它与我们从被剪裁的Cell中得到的匹配：`8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`。

计算其 representation hash ，并确保它与我们从被剪裁的Cell中得到的匹配：`8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`。

```python
{
    'addr': Address<EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG>,
    'storage_stat': {'used': {'cells': 22, 'bits': 5697, 'public_cells': None}, 'last_paid': 1689502130, 'due_payment': None},
    'storage': {
        'last_trans_lt': 39330697000003,
        'balance': {'grams': 5873792469, 'other': None},
        'state': {
            'type_': 'account_active',
            'state_init': {'split_depth': None, 'special': None, 'code': <Cell 80[FF00F4A413F4BCF2C80B] -> 1 refs>, 'data': <Cell 321[000000E929A9A317C1B3226CE226D6D818BAFE82D3633AA0F06A6C677272D1F9B760FF0D0DCF56D800] -> 0 refs>, 'library': None}
        }
    }
}
```

现在我们可以信任这个账户状态数据。

## 账户交易

_检查证明示例：_ [Python](https://github.com/yungwine/pytoniq/blob/master/pytoniq/proof/check_proof.py#L87), [Kotlin](https://github.com/andreypfau/ton-kotlin/blob/b1edc4b134e89ccf252149f27c85fd530377cebe/ton-kotlin-liteclient/src/commonMain/kotlin/CheckProofUtils.kt#L37), [C++](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/check-proof.cpp#L161)

当我们从 Liteserver 接收到交易时，我们会得到带有交易量的 boc，我们要求根。每个根都是一个 cell ，我们应根据 [事务](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L263-L269) TLB 方案进行反序列化。
对于第一个交易 cell ，我们应检查其哈希值是否与我们从账户状态中获得的`last_trans_hash` 匹配。然后记住 `prev_trans_hash` 字段的值，并将其与第二个根 cell 的哈希值进行比较，以此类推。

## 大宗交易

让我们向 Liteserver 询问属于文章开头所述区块的事务。
LiteServer [response](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L46)包含`ids`字段和`proof` boc。首先，让我们对 `proof` 进行反序列化：

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		288[0101F8039FE65901BE422094ED29FA05DD4A9406708D7C54EBF7F6010F2E8A9DCBB10001],
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		288[0101741100D622B0D5264BCDB86A14E36FC8C349B82AE49E037002EB07079EAD8B060015],
		545[4A33F6FD11224E018A0801116DBA929FAA60F8B9DFB39286C07FDE613D4F158E4031612597E23F312DA061732C2DB7C7C7F0BCA6295EF25D04F46FA21A055CF213A1270A80] -> {
			288[0101E057F7AA0545EF9E6BF187542A5141298303A33BA7C9CE26C71FFD9C7D2050600004],
			6[00],
			6[80] -> {
				9[4000] -> {
					605[BFB333333333333333333333333333333333333333333333333333333333333333029999999999999999999999999999999999999999999999999999999999999999CF800008F4E2E9900000] -> {
						9[5000] -> {
							288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002]
						},
						9[4000] -> {
							288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002]
						},
						520[7239A4AED4308E2E6AC11C880CCB29DFEE407A3E94FC1EDBDD4D29AF3B5DFEEE58A9B07203A0F457150A2BF7972DA7E2A79642DEBE792E919DE5E2FC284D2B158A]
					},
					607[BF955555555555555555555555555555555555555555555555555555555555555502AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0000008F4E2E99000C0] -> {
						288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002],
						520[72899B3A210DDD28D905C583FF8559BCF73D0CF0C05C11210BD7059BAB2AB453E03524184B116C9E39D9D5293179588F4B7D8F5D8192FEFE66B9FE40A71518DBC7]
					}
				}
			},
			288[01010FC5CF36DC84BC46E7175768AB3EC0F94988D454F2C496DC1AC32E638CD3C23D0005]
		}
	}
}
```

现在，我们应该检查 "区块头证明"（以信任 cell 数据），并根据 "区块 TLB 方案 "对其进行反序列化：

```python
{
    'global_id': -239,
    'info': None,
    'value_flow': None,
    'state_update': None,
    'extra': {
        'in_msg_descr': <Cell 288[0101E057F7AA0545EF9E6BF187542A5141298303A33BA7C9CE26C71FFD9C7D2050600004] -> 0 refs>,
        'out_msg_descr': ({}, [<Slice 5[00] -> 0 refs>]),
        'account_blocks': (
            {
                23158417847463239084714197001737581570653996933128112807891516801582625927987:  {
                    'account_addr': '3333333333333333333333333333333333333333333333333333333333333333',
                    'transactions': (
                        {
                            39391488000001: <Cell 288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002] -> 0 refs>,
                            39391488000002: <Cell 288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002] -> 0 refs>
                        },
                        [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
                    ),
                    'state_update': {'old_hash': b'9\xa4\xae\xd40\x8e.j\xc1\x1c\x88\x0c\xcb)\xdf\xee@z>\x94\xfc\x1e\xdb\xddM)\xaf;]\xfe\xeeX', 'new_hash': b'\xa9\xb0r\x03\xa0\xf4W\x15\n+\xf7\x97-\xa7\xe2\xa7\x96B\xde\xbey.\x91\x9d\xe5\xe2\xfc(M+\x15\x8a'}
                },
                38597363079105398474523661669562635951089994888546854679819194669304376546645: {
                    'account_addr': '5555555555555555555555555555555555555555555555555555555555555555',
                    'transactions': (
                        {
                            39391488000003: <Cell 288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002] -> 0 refs>
                        },
                    [{'grams': 0, 'other': None}]
                    ),
                    'state_update': {'old_hash': b'\x89\x9b:!\r\xdd(\xd9\x05\xc5\x83\xff\x85Y\xbc\xf7=\x0c\xf0\xc0\\\x11!\x0b\xd7\x05\x9b\xab*\xb4S\xe0', 'new_hash': b'5$\x18K\x11l\x9e9\xd9\xd5)1yX\x8fK}\x8f]\x81\x92\xfe\xfef\xb9\xfe@\xa7\x15\x18\xdb\xc7'}
                }
            },
            [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
        ),
        'rand_seed': b'\x11"N\x01\x8a\x08\x01\x11m\xba\x92\x9f\xaa`\xf8\xb9\xdf\xb3\x92\x86\xc0\x7f\xdea=O\x15\x8e@1a%',
        'created_by': b"\x97\xe2?1-\xa0as,-\xb7\xc7\xc7\xf0\xbc\xa6)^\xf2]\x04\xf4o\xa2\x1a\x05\\\xf2\x13\xa1'\n",
        'custom': None
    }
}
```

在这种情况下，我们应该记住字段 `block` -> `extra` -> `account_blocks` 类型为 [ShardAccountBlocks](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L282),
是 HashmapAugE，其中 key 是地址 hash_part，value 是 [AccountBlock](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L277-L280) 类型，extra 是 `CurrencyCollection` 类型：

```python
{
    23158417847463239084714197001737581570653996933128112807891516801582625927987:  {
        'account_addr': '3333333333333333333333333333333333333333333333333333333333333333',
        'transactions': (
            {
                39391488000001: <Cell 288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002] -> 0 refs>,
                39391488000002: <Cell 288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002] -> 0 refs>
            },
            [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
        ),
        'state_update': {'old_hash': b'9\xa4\xae\xd40\x8e.j\xc1\x1c\x88\x0c\xcb)\xdf\xee@z>\x94\xfc\x1e\xdb\xddM)\xaf;]\xfe\xeeX', 'new_hash': b'\xa9\xb0r\x03\xa0\xf4W\x15\n+\xf7\x97-\xa7\xe2\xa7\x96B\xde\xbey.\x91\x9d\xe5\xe2\xfc(M+\x15\x8a'}
    },
    38597363079105398474523661669562635951089994888546854679819194669304376546645: {
        'account_addr': '5555555555555555555555555555555555555555555555555555555555555555',
        'transactions': (
            {
                39391488000003: <Cell 288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002] -> 0 refs>
            },
        [{'grams': 0, 'other': None}]
        ),
        'state_update': {'old_hash': b'\x89\x9b:!\r\xdd(\xd9\x05\xc5\x83\xff\x85Y\xbc\xf7=\x0c\xf0\xc0\\\x11!\x0b\xd7\x05\x9b\xab*\xb4S\xe0', 'new_hash': b'5$\x18K\x11l\x9e9\xd9\xd5)1yX\x8fK}\x8f]\x81\x92\xfe\xfef\xb9\xfe@\xa7\x15\x18\xdb\xc7'}
    }
}
```

在这个例子中，检查 `ids` 字段是不必要的，我们可以直接从账户块中取交易。
但是当你请求 [liteServer.listBlockTransactionsExt](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L80) 方法时，
你需要类似地检查证明，但在那种情况下，你确实需要比较哈希。

```python
[
    {'mode': 39, 'account': '3333333333333333333333333333333333333333333333333333333333333333', 'lt': 39391488000001, 'hash': '5ef0532af460bcf3becf1a94597c1ec04879e0f26bf58269d319121376aad473'},
    {'mode': 39, 'account': '3333333333333333333333333333333333333333333333333333333333333333', 'lt': 39391488000002, 'hash': 'b1e091fcb9df53917eaa0cae05041b3d0956242871e3ca8d6909d0aa31ff3604'},
    {'mode': 39, 'account': '5555555555555555555555555555555555555555555555555555555555555555', 'lt': 39391488000003, 'hash': '924b5992df95114196994a6d449d89e1c002cb96c14d11c4a667f843a3faf441'}
]
```

在这个例子中，检查 `ids` 字段是不必要的，我们可以直接从账户块中取交易。
但是当你请求 [liteServer.listBlockTransactionsExt](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L80) 方法时，
你需要类似地检查证明，但在那种情况下，你确实需要比较哈希。

```python
block_trs: dict = acc_block.get(int(tr['account'], 16)).transactions[0]
block_tr: Cell = block_trs.get(tr['lt'])
assert block_tr.get_hash(0) == tr['hash']
```

:::note

让我们向Liteserver请求1、4、5、7、8和15号[配置参数](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L83)（对于 [liteServer.getConfigAll](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L82) 方法，您可以获取所有参数，验证证明的方式是相同的）。
[回应](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L53)包含 `state_proof` 和 `config_proof`。

:::

## 配置

对于此cell，我们应该检查区块头证明，并记住 `StateUpdate` 的新哈希值。

现在，让我们反序列化 `config_proof` cell：

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
			560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
			560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
		},
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```

为此，我们应该检查区块头证明，并记住 "StateUpdate "新哈希值。

我们需要将此 Merkle 证明的 Hash_1 仅与我们从上面的 `check_block_header` 函数获得的哈希进行比较，这样我们才能信任此cell：

</details>

<summary><b>显示 cell </b></summary>

```json
280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> {
	362[9023AFE2FFFFFF1100FFFFFFFF000000000000000001DC65010000000164B6C356000023D38BA6400401DC64FD40] -> {
		288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001],
		288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E],
		204[0000000000000000FFFFFFFFFFFFFFFF820CE9D9C3929379C820] -> {
			288[0101A5A7D24057D8643B2527709D986CDA3846ADCB3EDDC32D28EC21F69E17DBAAEF0001],
			288[0101DEAB5A5AAF79C5E24F8DCBBE51747D6804104F75F58ED5BED4702C353545C6AC0011]
		},
		342[CC26AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC23519B11EDDC69B7C] -> {
			288[0101C7DAE90A1FCEAD235CACC318A048986B2E12D0F68C136845669E02C4E28F018D0002],
			2[00] -> {
				8[D8] -> {
					2[00] -> {
						2[00] -> {
							2[00] -> {
								2[00] -> {
									2[00] -> {
										2[00] -> {
											288[0101F89085ED347F5F928A0DF7B1271F906F6E1EF43D89B5912774C8B42D0E24AB120001],
											2[00] -> {
												256[3333333333333333333333333333333333333333333333333333333333333333]
											}
										},
										4[40] -> {
											256[0000000000000000000000000000000000000000000000000000000000000000]
										}
									},
									2[00] -> {
										2[00] -> {
											2[00] -> {
												256[E56754F83426F69B09267BD876AC97C44821345B7E266BD956A7BFBFB98DF35C]
											},
											2[00] -> {
												329[01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF800000008000000100]
											}
										},
										4[50] -> {
											1[80] -> {
												2[00] -> {
													83[BE000003BCB3670DC15540],
													83[BFFFFFFFBCBD1A94A20000]
												}
											}
										}
									}
								},
								2[00] -> {
									2[00] -> {
										2[00] -> {
											2[00] -> {
												104[C400000002000000000000002E]
											},
											288[0101C1F3C2ADA12BD901BBA1552C0C090CC3989649807C2B764D02548C1F664C20890007]
										},
										288[010187DADFBB3AE954E7F5472C46A729ED80AD087C5D9CEBB8D644D16DD73F88DF390009]
									},
									2[00] -> {
										288[01017CF937AF64AED1AB2CDD1435F8FF79F86E521320CC7B0CB30C9AAE81748124090002],
										2[00] -> {
											288[0101BEE8EB75C37500A75962E4FD99AFC62B3C9245948D2AC56061B0E21DDD6E9E840001],
											2[00] -> {
												128[00010000000080000000200000008000]
											}
										}
									}
								}
							},
							288[0101289F7704162F68EF3CC5B4865BD72067277E25B21514AB741396C54BD92294FA0009]
						},
						288[0101EF6962F43C1C86B216773B443F61829550DD9E956EE54EA3AC5C60E127DADD51000E]
					},
					288[0101112A0556A091DC4F72BD31FF2790783FB3238CE2AA41E1C137424D279664D7E3000A]
				},
				288[010124D21CF7AE96B1C55A1230E823DB0317CE24EC33E3BF2585C79605684304FAF20007]
			},
			766[0001AAA0161D000702816000047A7172DFB88800011E8B625908200EE215F71061846393A08C682E87BC3A12AFF2D246EB97A09164F5657F96F9A252EF71580FE5309A823F73F3C4C3F8AB73F5A85BBF204BFD22E68D36D0EFAB1818E7B428BC] -> {
				288[010150FCC05BD9723571B83316A5F650BE31EDB131D05FDC78D271486E5D4EF077E10019],
				288[0101E5BE728200B172CF7E2356CBA2AE1C6E2C790BE7C03CD7814C6E6FE3080B944B0011]
			},
			2[00] -> {
				83[BE000003BCB3670DC15540],
				83[BFFFFFFFBCBD1A94A20000]
			}
		}
	}
}
```

</details>

对所有参数反序列化后，我们得到：

```python
state_hash = check_block_header_proof(state_proof[0], block.root_hash, True)
if config_proof[0].get_hash(0) != state_hash:
    raise LiteClientError('hashes mismach')
```

对所有参数反序列化后，我们得到：

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
    'seq_no': 31220993,
    'vert_seq_no': 1,
    'gen_utime': 1689699158,
    'gen_lt': 39391488000004,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001] -> 0 refs>,
    'before_split': 0,
    'accounts': <Cell 288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E] -> 0 refs>,
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2364000148715550620, 'other': None},
    'total_validator_fees': {'grams': 0, 'other': None},
    'libraries': None,
    'master_ref': None,
    'custom': {
        'shard_hashes': None,
        'config': {
            'config_addr': '5555555555555555555555555555555555555555555555555555555555555555',
            'config': {
                1: <Slice 256[3333333333333333333333333333333333333333333333333333333333333333] -> 0 refs>,
                4: <Slice 256[E56754F83426F69B09267BD876AC97C44821345B7E266BD956A7BFBFB98DF35C] -> 0 refs>,
                5: <Slice 329[01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF800000008000000100] -> 0 refs>,
                7: <Slice 1[80] -> 1 refs>,
                8: <Slice 104[C400000002000000000000002E] -> 0 refs>,
                15: <Slice 128[00010000000080000000200000008000] -> 0 refs>}
            },
            'flags': 1,
            'validator_info': {'validator_list_hash_short': 2862618141, 'catchain_seqno': 459393, 'nx_cc_updated': False},
            'prev_blocks': None,
            'after_key_block': True,
            'last_key_block': {'end_lt': 39382372000004, 'seqno': 31212222, 'root_hash': b'\xe2\x0c0\x8crt\x11\x8d\x05\xd0\xf7\x87BU\xfeZH\xddr\xf4\x12,\x9e\xac\xaf\xf2\xdf4J]\xee+', 'file_hash': b'\x01\xfc\xa6\x13PG\xee~x\x98\x7f\x15n~\xb5\x0bw\xe4\t\x7f\xa4\\\xd1\xa6\xda\x1d\xf5c\x03\x1c\xf6\x85'},
            'block_create_stats': {'type_': 'block_create_stats', 'counters': None},
            'global_balance': {'grams': 5089971531496870767, 'other': {239: 666666666666, 4294967279: 1000000000000}}
    }
}
```

以 `ShardStateUnsplit` -> `custom` -> `config` -> `config` 字段为例，这是一个 Hashmap，其中 key 是一个 ConfigParam 编号，value 是一个包含参数值的 Cell。

在对所有参数进行反序列化后，我们得到了

```python
{
    1: {
        'elector_addr': b'33333333333333333333333333333333',
    },
    4: {
        'dns_root_addr': b'\xe5gT\xf84&\xf6\x9b\t&{\xd8v\xac\x97\xc4H!4[~&k\xd9V\xa7\xbf\xbf\xb9\x8d\xf3\\',
    },
    5: {
        'blackhole_addr': b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff',
        'fee_burn_nom': 1,
        'fee_burn_denom': 2
    },
    7: {
        'to_mint': {'dict': {239: 666666666666, 4294967279: 1000000000000}}
    },
    8: {
        'version': 2,
        'capabilities': 46
    },
    15: {
        'validators_elected_for': 65536,
        'elections_start_before': 32768,
        'elections_end_before': 8192,
        'stake_held_for': 32768
    }
}
```

## 另请参见

- [Exotic Cells](/v3/documentation/data-formats/tlb/exotic-cells)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-language.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-language.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# TL-B 语言

TL-B（类型语言 - 二进制）用于描述类型系统、构造函数和现有功能。例如，我们可以使用 TL-B 方案构建与 TON 区块链关联的二进制结构。特殊的 TL-B 解析器可以读取方案，将二进制数据反序列化为不同的对象。TL-B 描述了 `Cell` 对象的数据方案。如果您不熟悉 `Cells`，请阅读 [Cell & Bag of Cells(BOC)](https://docs.ton.org/develop/data-formats/cell-boc#cell) 文章。

## 概述

我们将任何一组 TL-B 构造称为 TL-B 文档。一个 TL-B 文档通常包括类型的声明（即它们的构造函数）和功能组合子。每个组合子的声明都以分号 (`;`) 结尾。

这是一个可能的组合子声明示例：

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/data-formats/tl-b-docs-2.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-2-dark.png?raw=true',
  }}
/>
<br></br>

## 构造函数

每个等式的左侧描述了定义或序列化右侧指示类型的值的方式。这样的描述以构造函数的名称开始。

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/data-formats/tl-b-docs-3.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-3-dark.png?raw=true',
  }}
/>
<br></br>

构造函数用于指定组合器的类型，包括在序列化时的状态。例如，当你想在向 TON 智能合约查询时指定一个 `op`（操作码）的时候，也可以使用构造函数。

```tlb
// ....
transfer#5fcc3d14 <...> = InternalMsgBody;
// ....
```

- 构造函数名称：`transfer`
- 构造函数前缀代码：`#5fcc3d14`

注意，每个构造函数名称后面紧跟一个可选的构造函数标签，例如 `#_` 或 `$10`，它描述了用于编码（序列化）所讨论的构造函数的位串(bitstring)。

```tlb
message#3f5476ca value:# = CoolMessage;
bool_true$0 = Bool;
bool_false$1 = Bool;
```

每个等式的左侧描述了定义或序列化右侧指示类型的值的方式。这样的描述以构造函数的名称开始，如 `message` 或 `bool_true`，紧接着是一个可选的构造函数标签，例如 `#3f5476ca` 或 `$0`，它描述了用于编码（序列化）所讨论的构造函数的位。

| 构造函数                          | 序列化                                   |
| ----------------------------- | ------------------------------------- |
| `some#3f5476ca`               | 从十六进制值序列化为 32 位 uint                  |
| `some#5fe`                    | 从十六进制值序列化为 12 位 uint                  |
| `some$0101`                   | 序列化 `0101` 原始位                        |
| `some` 或 `some#`              | 序列化 `crc32(equation) \| 0x80000000`   |
| `some#_` 或 `some$_` 或 `_`     | 不进行序列化                                |

构造函数名称（此示例中的 `some`）在代码生成中用作变量。例如：

```tlb
bool_true$1 = Bool;
bool_false$0 = Bool;
```

类型 `Bool` 有两个标签 `0` 和 `1`。代码生成伪代码可能看起来像：

```python3

class Bool:
    tags = [1, 0]
    tags_names = ['bool_true', 'bool_false']
```

如果你不想为当前构造函数定义任何名称，只需传递 `_`，例如 `_ a:(## 32) = 32Int;`

构造函数标签可以用二进制（在美元符号后）或十六进制表示法（在井号后）给出。如果未明确提供标签，则 TL-B 解析器必须通过用 CRC32 算法散列定义此构造函数的“等式”文本，并带有 `| 0x80000000` 来计算默认的 32 位构造函数标签。因此，必须通过 `#_` 或 `$_` 明确提供空标签。

此标签将用于在反序列化过程中猜测当前位串的类型。例如，我们有 1 位位串 `0`，如果我们告诉 TLB 将此位串解析为 `Bool` 类型，它将被解析为 `Bool.bool_false`。

假设我们有更复杂的示例：

```tbl
tag_a$10 val:(## 32) = A;
tag_b$00 val(## 64) = A;
```

如果我们在 TLB 类型 `A` 中解析 `1000000000000000000000000000000001`（1 和 32 个零和 1）- 首先我们需要获取前两位来定义标签。在此示例中，前两位 `10` 代表 `tag_a`。所以现在我们知道接下来的 32 位是 `val` 变量，在我们的示例中是 `1`。一些“解析”的伪代码变量可能看起来像：

```python3
A.tag = 'tag_a'
A.tag_bits = '10'
A.val = 1
```

所有构造函数名称必须是不同的，并且同一类型的构造函数标签必须构成一个前缀码（否则反序列化将不是唯一的）；即，同一类型中的任何标签都不能是任何其他标签的前缀。

每种类型的构造函数最大数量：`64`
标签的最大位数：`63`

<b>二进制示例：</b>

```tlb
example_a$10 = A;
example_b$01 = A;
example_c$11 = A;
example_d$00 = A;
```

代码生成伪代码可能看起来像：

```python3

class A:
    tags = [2, 1, 3, 0]
    tags_names = ['example_a', 'example_b', 'example_c', 'example_d']
```

<b>十六进制标签示例：</b>

```tlb
example_a#0 = A;
example_b#1 = A;
example_c#f = A;
```

代码生成伪代码可能看起来像：

```python3

class A:
    tags = [0, 1, 15]
    tags_names = ['example_a', 'example_b', 'example_c']
```

如果使用 `hex` 标签，请记住，它将以每个十六进制符号 4 位进行序列化。最大值是 63 位无符号整数。这意味着：

```tlb
a#32 a:(## 32) = AMultiTagInt;
b#1111 a:(## 32) = AMultiTagInt;
c#5FE a:(## 32) = AMultiTagInt;
d#3F5476CA a:(## 32) = AMultiTagInt;
```

| 构造函数          | 序列化                                 |
| ------------- | ----------------------------------- |
| `a#32`        | 从十六进制值序列化为 8 位 uint                 |
| `b#1111`      | 从十六进制值序列化为 16 位 uint                |
| `c#5FE`       | 从十六进制值序列化为 12 位 uint                |
| `d#3F5476CA`  | 从十六进制值序列化为 32 位 uint                |

十六进制值允许使用大写和小写。

#### 关于十六进制标签的更多信息

除了经典的十六进制标签定义外，十六进制数字后面可以跟一个下划线字符。这意味着标签等于指定的十六进制数字，但没有最低有效位。例如，有一个方案：

```tlb
vm_stk_int#0201_ value:int257 = VmStackValue;
```

实际上，标签并不等于 `0x0201`。为了计算它，我们需要从 `0x0201` 的二进制表示中删除 LSb：

```
0000001000000001 -> 000000100000000
```

因此，标签等于 15 位二进制数 `0b000000100000000`。

## 字段定义

构造函数及其可选标签后面跟着字段定义。每个字段定义的形式为 `ident:type-expr`，其中 ident 是字段名称的标识符（匿名字段用下划线替代），type-expr 是字段的类型。这里提供的类型是类型表达式，可能包括简单类型、带有适当参数的参数化类型或复杂表达式。

<b>总之，在类型中定义的所有字段总数不得超过 Cell（`1023` 位和 `4` 引用）</b>

### 简单类型

- `_ a:# = Type;` - 这里 `Type.a` 是 32 位整数
- `_ a:(## 64) = Type;` - 这里 `Type.a` 是 64 位整数
- `_ a:Owner = NFT;` - 这里 `NFT.a` 是 `Owner` 类型
- `_ a:^Owner = NFT;` - 这里 `NFT.a` 是指向 `Owner` 类型的cell引用，意味着 `Owner` 存储在下一个cell引用中。

### 匿名字段

- `_ _:# = A;` - 第一个字段是匿名的 32 位整数

### 通过引用扩展cell

```tlb
_ a:(##32) ^[ b:(##32) c:(## 32) d:(## 32)] = A;
```

- 如果出于某种原因我们想将一些字段分离到另一个cell，我们可以使用 `^[ ... ]` 语法。
  在这个示例中，`A.a` / `A.b` / `A.c` / `A.d` 是 32 位无符号整数，但 `A.a` 存储在第一个cell中，
  而 `A.b` / `A.c` / `A.d` 存储在下一个cell（1 个引用）中。

```tlb
_ ^[ a:(## 32) ^[ b:(## 32) ^[ c:(## 32) ] ] ] = A;
```

- 链式引用也是允许的。在这个示例中，每个变量（`a`、`b`、`c`）都存储在分离的cell中。

### 参数化类型

假设我们有 `IntWithObj` 类型：

```tlb
_ {X:Type} a:# b:X = IntWithObj X;
```

现在我们可以在其他类型中使用它：

```tlb
_ a:(IntWithObj uint32) = IntWithUint32;
```

### 复杂表达式

- 条件字段（仅适用于 `Nat`）（`E?T` 表示如果表达式 `E` 为真，则字段类型为 `T`）
  ```tlb
  _ a:(## 1) b:a?(## 32) = Example;
  ```
  在 `Example` 类型中，变量 `b` 仅在 `a` 为 `1` 时序列化。

- 元组创建的乘法表达式（`x * T` 表示创建类型为 `T` 的长度为 `x` 的元组）：

  ```tlb
  a$_ a:(## 32) = A;
  b$_ b:(2 * A) = B;
  ```

  ```tlb
  _ (## 1) = Bit;
  _ 2bits:(2 * Bit) = 2Bits;
  ```

- 位选择（仅适用于 `Nat`）（`E . B` 表示获取 `Nat` `E` 的位 `B`）
  ```tlb
  _ a:(## 2) b:(a . 1)?(## 32) = Example;
  ```
  在 `Example` 类型中，变量 `b` 仅在 `a` 的第二个位是 `1` 时序列化。

- 其他 `Nat` 运算符也允许（查看 `允许的约束`）

注意：您可以组合几种复杂表达式：

```tlb
_ a:(## 1) b:(## 1) c:(## 2) d:(a?(b?((c . 1)?(## 64)))) = A;
```

## 内置类型

- `#` - `Nat` 32 位无符号整数
- `## x` - `Nat` 有 `x` 位
- `#< x` - `Nat` 小于 `x` 位无符号整数，以 `lenBits(x - 1)` 位存储，最多 31 位
- `#<= x` - `Nat` 小于等于 `x` 位无符号整数，以 `lenBits(x)` 位存储，最多 32 位
- `Any` / `Cell` - cell剩余的位数和引用
- `Int` - 257 位
- `UInt` - 256 位
- `Bits` - 1023 位
- `uint1` - `uint256` - 1 - 256 位
- `int1` - `int257` - 1 - 257 位
- `bits1` - `bits1023` - 1 - 1023 位
- `uint X` / `int X` / `bits X` - 与 `uintX` 相同，但您可以在这些类型中使用参数化的 `X`

## 约束

```tlb
_ flags:(## 10) { flags <= 100 } = Flag;
```

`Nat` 字段允许在约束中使用。在这个示例中，`{ flags <= 100 }` 约束意味着 `flags` 变量小于等于 `100`。

允许的约束：`E` | `E = E` | `E <= E` | `E < E` | `E >= E` | `E > E` | `E + E` | `E * E` | `E ? E`

## 隐式字段

一些字段可能是隐式的。它们的定义被花括号（`{`、`}`）包围，表示该字段实际上并不存在于序列化中，而是必须根据其他数据（通常是正在序列化的类型的参数）推断其值。示例：

```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
```

```tlb
_ {x:#} a:(## 32) { ~x = a + 1 } = Example;
```

## 参数化类型

变量 — 即先前定义的字段的（标识符）类型 `#`（自然数）或 `Type`（类型的类型） — 可用作参数化类型的参数。序列化过程递归地根据其类型序列化每个字段，而一个值的序列化最终由表示构造器（即构造器标签）和字段值的位的串联构成。

### 自然数（`Nat`）

```tlb
_ {x:#} my_val:(## x) = A x;
```

意味着 `A` 由 `x` `Nat` 参数化。在反序列化过程中，我们将获取 `x` 位无符号整数。例如：

```tlb
_ value:(A 32) = My32UintValue;
```

意味着在 `My32UintValue` 类型的反序列化过程中，我们将获取 32 位无符号整数（因为 `32` 参数应用于 `A` 类型）。

### 类型

```tlb
_ {X:Type} my_val:(## 32) next_val:X = A X;
```

意味着 `A` 由 `X` 类型参数化。在反序列化过程中，我们将获取 32 位无符号整数，然后解析类型 `X` 的 bits&refs。

这种参数化类型的使用示例如下：

```tlb
_ bit:(## 1) = Bit;
_ 32intwbit:(A Bit) = 32IntWithBit;
```

在这个示例中，我们将类型 `Bit` 作为参数传递给 `A`。

如果您不想定义类型，但想按照这个方案进行反序列化，可以使用 `Any` 关键词：

```tlb
_ my_val:(A Any) = Example;
```

意味着如果我们反序列化 `Example` 类型，我们将获取 32 位整数，然后将cell的剩余部分（bits&refs）传递给 `my_val`。

您可以创建带有多个参数的复杂类型：

```tlb
_ {X:Type} {Y:Type} my_val:(## 32) next_val:X next_next_val:Y = A X Y;
_ bit:(## 1) = Bit;
_ a_with_two_bits:(A Bit Bit) = AWithTwoBits;
```

您也可以对此类参数化类型进行部分应用：

```tlb
_ {X:Type} {Y:Type} v1:X v2:Y = A X Y;
_ bit:(## 1) = Bit;
_ {X:Type} bits:(A Bit X) = BitA X;
```

甚至可以对参数化类型本身进行参数化：

```tlb
_ {X:Type} v1:X = A X;
_ {X:Type} d1:X = B X;
_ {X:Type} bits:(A (B X)) = AB X;
```

### 在参数化类型中使用 NAT 字段

您可以像参数那样使用先前定义的字段。序列化将在运行时确定。

一个简单的示例：

```tlb
_ a:(## 8) b:(## a) = A;
```

这意味着我们在 `a` 字段内存储了 `b` 字段的大小。因此，当我们想序列化类型 `A` 时，需要加载 `a` 字段的 8 位无符号整数，然后使用这个数字来确定 `b` 字段的大小。

这种策略也适用于参数化类型：

```tlb
_ {input:#} c:(## input) = B input;
_ a:(## 8) c_in_b:(B a) = A;
```

### 在参数化类型中使用表达式

```tlb
_ {x:#} value:(## x) = Example (x * 2);
_ _:(Example 4) = 2BitInteger;
```

在这个示例中，`Example.value` 类型在运行时确定。

在 `2BitInteger` 定义中，我们设置了 `Example 4` 类型。要确定这个类型，我们使用 `Example (x * 2)` 定义，并根据公式计算 `x`（`y = 2`，`z = 4`）：

```c++
static inline bool mul_r1(int& x, int y, int z) {
  return y && !(z % y) && (x = z / y) >= 0;
}
```

我们还可以使用加法运算符：

```tlb
_ {x:#} value:(## x) = ExampleSum (x + 3);
_ _:(ExampleSum 4) = 1BitInteger;
```

在 `1BitInteger` 定义中，我们设置了 `ExampleSum 4` 类型。要确定这个类型，我们使用 `ExampleSum (x + 3)` 定义，并根据公式计算 `x`（`y = 3`，`z = 4`）：

```c++
static inline bool add_r1(int& x, int y, int z) {
  return z >= y && (x = z - y) >= 0;
}
```

## 取反运算符（`~`）

一些“变量”的出现（即已定义的字段）前面加上波浪号（`~`）。这表明该变量的出现与默认行为相反：在等式的左侧，它意味着该变量将基于此出现推断（计算），而不是替代其先前计算的值；在右侧相反，它意味着该变量不会从正在序列化的类型中推断出来，而是将在反序列化过程中计算。换句话说，波浪号将“输入参数”转换为“输出参数”，反之亦然。

取反运算符的一个简单示例是基于另一个变量定义新变量：

```tlb
_ a:(## 32) { b:# } { ~b = a + 100 } = B_Calc_Example;
```

定义后，您可以将新变量用于传递给 `Nat` 类型：

```tlb
_ a:(## 8) { b:# } { ~b = a + 10 }
  example_dynamic_var:(## b) = B_Calc_Example;
```

`example_dynamic_var` 的大小将在运行时计算，当我们加载 `a` 变量并使用它的值来确定 `example_dynamic_var` 的大小。

或者传递给其他类型：

```tlb
_ {X:Type} a:^X = PutToRef X;
_ a:(## 32) { b:# } { ~b = a + 100 }
  my_ref: (PutToRef b) = B_Calc_Example;
```

您还可以在加法或乘法复杂表达式中使用带有取反运算符的变量定义：

```tlb
_ a:(## 32) { b:# } { ~b + 100 = a }  = B_Calc_Example;
```

```tlb
_ a:(## 32) { b:# } { ~b * 5 = a }  = B_Calc_Example;
```

### 在类型定义中使用取反运算符（`~`）

```tlb
_ {m:#} n:(## m) = Define ~n m;
_ {n_from_define:#} defined_val:(Define ~n_from_define 8) real_value:(## n_from_define) = Example;
```

假设我们有一个类 `Define ~n m`，它接受 `m` 并从 `m` 位无符号整数中加载 `n`。

在 `Example` 类型中，我们将 `Define` 类型计算出的变量存储到 `n_from_define` 中，我们也知道它是 8 位无符号整数，因为我们应用了 `Define ~n_from_define 8` 类型。现在我们可以在其他类型中使用 `n_from_define` 变量来确定序列化过程。

这种技术可以导致更复杂的类型定义（如联合体、哈希映射）。

```tlb
unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);
_ u:(Unary Any) = UnaryChain;
```

这个示例在 [TL-B 类型](https://docs.ton.org/develop/data-formats/tl-b-types#unary) 文章中有很好的解释。主要思想是 `UnaryChain` 将递归反序列化，直到达到 `unary_zero$0`（因为我们通过定义 `unary_zero$0 = Unary ~0;` 和 `X` 在运行时由 `Unary ~(n + 1)` 定义计算得知 `Unary X` 类型的最后一个元素）。

注意：`x:(Unary ~n)` 意味着 `n` 在序列化 `Unary` 类的过程中被定义。

## 特殊类型

目前，TVM允许以下cell类型：

- 普通（Ordinary）
- 裁剪分支（Prunned Branch）
- 库引用（Library Reference）
- Merkle证明（Merkle Proof）
- Merkle更新（Merkle Update）

默认情况下，所有cell都是`普通`类型。并且在tlb中描述的所有cell都是`普通`类型。

要在构造函数中允许加载特殊类型，需要在构造函数前添加`!`。

示例：

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
  old:^X new:^X = MERKLE_UPDATE X;

!merkle_proof#03 {X:Type} virtual_hash:bits256 depth:uint16 virtual_root:^X = MERKLE_PROOF X;
```

这种技术允许在打印结构时标记`SPECIAL`cell的代码生成代码，也允许正确验证带有特殊cell的结构。

## 不检查构造函数唯一性标签的同一类型多个实例

允许仅根据类型参数创建同一类型的多个实例。在这种定义方式下，不会应用构造函数标签唯一性检查。

示例：

```tlb
_ = A 1;
a$01 = A 2;
b$01 = A 3;
_ test:# = A 4;
```

意味着实际的反序列化标签将由`A`类型参数确定：

```python3
# class for type `A`
class A(TLBComplex):
    class Tag(Enum):
        a = 0
        b = 1
        cons1 = 2
        cons4 = 3

    cons_len = [2, 2, 0, 0]
    cons_tag = [1, 1, 0, 0]

    m_: int = None

    def __init__(self, m: int):
        self.m_ = m

    def get_tag(self, cs: CellSlice) -> Optional["A.Tag"]:
        tag = self.m_

        if tag == 1:
            return A.Tag.cons1

        if tag == 2:
            return A.Tag.a

        if tag == 3:
            return A.Tag.b

        if tag == 4:
            return A.Tag.cons4

        return None
```

带有多个参数的情况也是一样的：

```tlb
_ = A 1 1;
a$01 = A 2 1;
b$01 = A 3 3;
_ test:# = A 4 2;
```

请记住，当您添加参数化类型定义时，预定义类型定义（如我们示例中的 `a` 和 `b`）和参数化类型定义（如我们示例中的 `c`）之间的标签必须是唯一的：

_无效示例：_

```
a$01 = A 2 1;
b$11 = A 3 3;
c$11 {X:#} {Y:#} = A X Y;
```

_有效示例：_

```tlb
a$01 = A 2 1;
b$01 = A 3 3;
c$11 {X:#} {Y:#} = A X Y;
```

## 注释

注释与C++中的相同：

```tlb
/*
This is
a comment
*/

// This is one line comment
```

## IDE 支持

- [TL的旧版本描述](https://core.telegram.org/mtproto/TL)
- [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
- [tlbc tool](https://github.com/ton-blockchain/ton/blob/master/crypto/tl/tlbc.cpp)
- [CPP Codegen](https://github.com/ton-blockchain/ton/blob/master/crypto/tl/tlbc-gen-cpp.cpp)
- [tonpy tlb tests](https://github.com/disintar/tonpy/blob/main/src/tonpy/tests/test_tlb.py)
- [tonpy py codegen](https://github.com/disintar/ton/blob/master/crypto/tl/tlbc-gen-py.cpp)

<hr/>

文档由 [Disintar](https://dton.io/) 团队提供。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-types.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-types.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# TL-B 类型

:::caution 高级模式
此信息属于**非常底层**的内容，对新手来说可能难以理解。
因此，您可以稍后再阅读。
:::

在本节中，我们将分析复杂和非传统的类型化语言二进制（TL-B）结构。开始之前，我们建议先阅读[此文档](/develop/data-formats/tl-b-language)，以更熟悉该主题。

<img alt="tlb structure" src="/img/docs/tlb.drawio.svg" width={'100%'}/>

## 以上任一情况

```tlb
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
```

Either类型用于可能出现两种结果类型之一的情况。在这种情况下，类型选择取决于所示的前缀位。如果前缀位是0，则序列化左类型，而如果使用1前缀位，则序列化右类型。

例如，在序列化消息时使用它，当消息体要么是主cell的一部分，要么链接到另一个cell。

## Maybe

```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
```

Maybe类型与可选值一起使用。在这些情况下，如果第一位是0，则不会序列化该值（实际上被跳过），而如果值是1，则会被序列化。

## Both

```tlb
pair$_ {X:Type} {Y:Type} first:X second:Y = Both X Y;
```

Both类型变体仅与普通对一起使用，两种类型依次序列化，没有条件。

## Unary

Unary函数类型通常用于动态大小的结构，例如[hml_short](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L29)。

Unary提供两个主要选项：

```tlb
unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);
```

### Unary序列化

通常，使用`unary_zero`变体相当简单：如果第一位是0，则Unary反序列化的结果为0。

然而，`unary_succ`变体更复杂，因为它是递归加载的，具有`~(n + 1)`的值。这意味着它会顺序调用自身，直到达到`unary_zero`。换句话说，所需的值将等于一连串单位的数量。

例如，让我们分析位串`110`的序列化。

调用链如下：

```tlb
unary_succ$1 -> unary_succ$1 -> unary_zero$0
```

一旦到达`unary_zero`，值就会返回到序列化位串的末尾，类似于递归函数调用。

现在，为了更清楚地理解结果，让我们检索返回值路径，显示如下：

`0 -> ~(0 + 1) -> ~(1 + 1) -> 2`，这意味着我们将`110`序列化为`Unary 2`。

### Unary反序列化

假设我们有`Foo`类型：

```tlb
foo$_  u:(Unary 2) = Foo;
```

根据上述内容，`Foo`将被反序列化为：

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-10.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-10-dark.png?raw=true',
}}
/>
<br></br>

```tlb
foo u:(unary_succ x:(unary_succ x:(unnary_zero)))
```

## Hashmap

Hashmap复杂类型用于存储FunC智能合约代码中的字典（`dict`）。

以下TL-B结构用于序列化具有固定键长度的Hashmap：

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;

hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X)
           right:^(Hashmap n X) = HashmapNode (n + 1) X;

hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;

unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);

hme_empty$0 {n:#} {X:Type} = HashmapE n X;
hme_root$1 {n:#} {X:Type} root:^(Hashmap n X) = HashmapE n X;
```

这意味着根结构使用`HashmapE`及其两种状态之一：包括`hme_empty`或`hme_root`。

### Hashmap解析示例

例如，考虑以下以二进制形式给出的Cell。

```json
1[1] -> {
  2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
}
```

此Cell使用了`HashmapE`结构类型，并具有8位键大小，其值使用`uint16`数字框架（`HashmapE 8 uint16`）。HashmapE使用3种不同的键类型：

```
1 = 777
17 = 111
128 = 777
```

为了解析此Hashmap，我们需要预先知道使用哪种结构类型，`hme_empty`还是`hme_root`。这是通过识别`正确前缀`来确定的。hme empty变体使用一个位0（`hme_empty$0`），而hme root使用一个位1（`hme_root$1`）。读取第一位后，确定它等于一（`1[1]`），意味着它是`hme_root`变体。

现在，让我们用已知值填充结构变量，初始结果为：
`hme_root$1 {n:#} {X:Type} root:^(Hashmap 8 uint16) = HashmapE 8 uint16;`

这里已经读取了一位前缀，而`{}`中的条件不需要读取。条件`{n:#}`表示n是任何uint32数字，而`{X:Type}`表示X可以使用任何类型。

接下来需要读取的部分是`root:^(Hashmap 8 uint16)`，而`^`符号表示必须加载的链接。

```json
2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
```

#### 初始化分支解析

根据我们的架构，这是正确的`Hashmap 8 uint16`结构。接下来，我们用已知的值填充它，并得到如下结果：

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 8)
          {8 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```

如上所示，现在出现了条件变量`{l:#}`和`{m:#}`，但我们不知道这两个变量的值。此外，在读取相应的`label`之后，很明显`n`涉及等式`{n = (~m) + l}`，在这种情况下我们计算`l`和`m`，符号`~`告诉我们结果值。

为了确定`l`的值，我们必须加载`label:(HmLabel ~l uint16)`序列。如下所示，`HmLabel`有三种基本结构选项：

```tlb
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;
```

每个选项都由相应的前缀确定。目前，我们的根cell由两个零位组成，显示为：(`2[00]`)。因此，唯一合理的选项是以0开头的前缀`hml_short$0`。

用已知值填充`hml_short`：

```tlb
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= 8} s:(n * Bit) = HmLabel ~n 8
```

在这种情况下，我们不知道`n`的值，但由于它有一个`~`字符，可以计算它。为此，我们加载`len:(Unary ~n)`，[关于Unary的更多信息](#unary)。

在这种情况下，我们从`2[00]`开始，但在定义了`HmLabel`类型之后，两个位中只剩下一个。

因此，我们加载它并看到它的值是0，这意味着它显然使用了`unary_zero$0`变体。这意味着使用`HmLabel`变体的n值为零。

接下来，需要使用计算出的n值完成`hml_short`变体序列：

```tlb
hml_short$0 {m:#} {n:#} len:0 {n <= 8} s:(0 * Bit) = HmLabel 0 8
```

结果我们得到一个空的`HmLabel`，表示为s = 0，因此没有什么可以下载的。

接下来，我们用计算出的`l`值补充我们的结构，如下所示：

```tlb
hm_edge#_ {n:#} {X:Type} {l:0} {m:#} label:(HmLabel 0 8)
          {8 = (~m) + 0} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```

现在我们已经计算出`l`的值，我们可以使用等式`n = (~m) + 0`来计算`m`，即`m = n - 0`，m = n = 8。

确定所有未知值后，现在可以加载`node:(HashmapNode 8 uint16)`。

至于HashmapNode，我们有以下选项：

```tlb
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X)
           right:^(Hashmap n X) = HashmapNode (n + 1) X;
```

在这种情况下，我们不

```tlb
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap n uint16)
           right:^(Hashmap n uint16) = HashmapNode (n + 1) uint16;
```

输入已知值后，我们必须计算 `HashmapNode (n + 1) uint16`。这意味着得出的 n 值必须等于我们的参数，即 8。
要计算 n 的本地值，我们需要使用以下公式：`n = (n_local + 1)` -> `n_local = (n - 1)` -> `n_local = (8 - 1)` -> `n_local = 7`。

```tlb
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap 7 uint16)
           right:^(Hashmap 7 uint16) = HashmapNode (7 + 1) uint16;
```

既然我们知道需要上述公式，那么获得最终结果就很简单了。
接下来，我们加载左分支和右分支，并对随后的每个分支[重复该过程](#initiating-branch-parsing) 。

#### 分析加载的 Hashmap 值

继续前面的例子，我们来看看加载分支的过程是如何进行的（对于 dict 值）。

继续前面的例子，让我们来看看加载分支的过程是如何工作的（对于dict值），即`28[1011100000000000001100001001]`

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 7)
          {7 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```

接下来，因为前缀是 `10`，所以使用 `HmLabel` 变体加载 `HmLabel` 响应。

```tlb
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
```

现在，让我们来填写序列：

```tlb
hml_long$10 {m:#} n:(#<= 7) s:(n * Bit) = HmLabel ~n 7;
```

新的结构--"n:(#\<= 7)"，显然表示与数字 7 相对应的大小值，它实际上是数字 + 1 的 log2。但为了简单起见，我们可以计算写数字 7 所需的比特数。
与此相关，二进制形式的数字 7 是 `111` ；因此需要 3 位，即 `n = 3` 的值。

```tlb
hml_long$10 {m:#} n:(## 3) s:(n * Bit) = HmLabel ~n 7;
```

接下来，我们将 `n` 加载到序列中，最终结果为 `111` ，正如我们上面所提到的 = 7，巧合的是，这就是 7。接下来，我们将 `s` 加载到序列中，7 位 - `000000`。记住，`s`是密钥的一部分。

接下来我们将`n`加载到序列中，最终结果为`111`，如上所述，这与7相符。接下来，我们将`s`加载到序列中，7位 - `0000000`。记住，`s`是键的一部分。

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel 7 7)
          {7 = (~m) + 7} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```

然后我们计算 `m` 的值，`m = 7 - 7`，因此 `m 的值 = 0`。
由于 `m = 0` 的值，该结构非常适合与 HashmapNode 一起使用：

```tlb
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
```

接下来，我们代入 uint16 类型并加载数值。十进制形式的 `0000001100001001` 的剩余 16 位是 777，因此就是我们的值。

接下来我们替换我们的uint16类型并加载值。剩余的16位`0000001100001001`以十进制形式为777，因此这就是我们的值。

现在让我们恢复键，我们必须将之前计算的所有键部分的有序列表组合起来。两个相关的键部分根据使用的分支类型合并为一位。对于右分支，添加‘1’位，对于左分支添加‘0’位。如果上面有完整的HmLabel，则将其位添加到键中。

## 其他哈希表类型

既然我们已经讨论了 Hashmap 以及如何加载标准 Hashmap 类型，下面就让我们来解释一下其他 Hashmap 类型是如何工作的。

### HashmapAugE

```tlb
ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#}
  label:(HmLabel ~l n) {n = (~m) + l}
  node:(HashmapAugNode m X Y) = HashmapAug n X Y;

ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X = HashmapAugNode 0 X Y;

ahmn_fork#_ {n:#} {X:Type} {Y:Type} left:^(HashmapAug n X Y)
  right:^(HashmapAug n X Y) extra:Y = HashmapAugNode (n + 1) X Y;

ahme_empty$0 {n:#} {X:Type} {Y:Type} extra:Y
          = HashmapAugE n X Y;

ahme_root$1 {n:#} {X:Type} {Y:Type} root:^(HashmapAug n X Y)
  extra:Y = HashmapAugE n X Y;
```

`HashmapAugE` 与普通 `Hashmap` 的主要区别在于每个节点中都有一个 `extra:Y` 字段（而不仅仅是有值的叶子）。

### PfxHashmap

```tlb
phm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
           {n = (~m) + l} node:(PfxHashmapNode m X)
           = PfxHashmap n X;

phmn_leaf$0 {n:#} {X:Type} value:X = PfxHashmapNode n X;
phmn_fork$1 {n:#} {X:Type} left:^(PfxHashmap n X)
            right:^(PfxHashmap n X) = PfxHashmapNode (n + 1) X;

phme_empty$0 {n:#} {X:Type} = PfxHashmapE n X;
phme_root$1 {n:#} {X:Type} root:^(PfxHashmap n X)
            = PfxHashmapE n X;
```

PfxHashmap 与普通 Hashmap 的主要区别在于，由于存在 `phmn_leaf$0` 和 `phmn_fork$1` 节点，它可以存储不同长度的密钥。

### VarHashmap

```tlb
vhm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
           {n = (~m) + l} node:(VarHashmapNode m X)
           = VarHashmap n X;
vhmn_leaf$00 {n:#} {X:Type} value:X = VarHashmapNode n X;
vhmn_fork$01 {n:#} {X:Type} left:^(VarHashmap n X)
             right:^(VarHashmap n X) value:(Maybe X)
             = VarHashmapNode (n + 1) X;
vhmn_cont$1 {n:#} {X:Type} branch:Bit child:^(VarHashmap n X)
            value:X = VarHashmapNode (n + 1) X;

// nothing$0 {X:Type} = Maybe X;
// just$1 {X:Type} value:X = Maybe X;

vhme_empty$0 {n:#} {X:Type} = VarHashmapE n X;
vhme_root$1 {n:#} {X:Type} root:^(VarHashmap n X)
            = VarHashmapE n X;
```

VarHashmap 与普通 Hashmap 的主要区别在于，由于存在 `vhmn_leaf$00` 和 `vhmn_fork$01` 节点，它可以存储不同长度的密钥。此外，"VarHashmap "还能形成一个公共值前缀（子映射），而不需要 "vhmn_cont$1"。

### BinTree

```tlb
bta_leaf$0 {X:Type} {Y:Type} extra:Y leaf:X = BinTreeAug X Y;
bta_fork$1 {X:Type} {Y:Type} left:^(BinTreeAug X Y)
           right:^(BinTreeAug X Y) extra:Y = BinTreeAug X Y;
```

二叉树密钥生成机制的工作方式与标准化 Hashmap 框架类似，但不使用标签，只包含分支前缀。

## Addresses

TON 地址是通过使用 TL-B StateInit 结构的 sha256 散列机制形成的。这意味着可以在部署网络合约之前计算出地址。

### 序列化

标准地址（如 `EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4`）使用 base64 uri 进行字节编码。
通常，它们的长度为 36 个字节，其中最后 2 个字节是使用 XMODEM 表计算的 crc16 校验和，第一个字节代表标志，第二个字节代表工作链。
中间的 32 个字节是地址本身的数据（也称为 AccountID），通常用 int256 等模式表示。

标准地址，例如`EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4`，使用base64 uri对字节进行编码。通常它们长度为36字节，其中最后两个字节是使用XMODEM表计算的crc16校验和，而第一个字节表示标志，第二个表示工作链。中间的32字节是地址本身的数据（也称为AccountID），通常在诸如int256之类的架构中表示。

## 参考资料

_Here a [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/TL-B.md) by [Oleg Baranov](https://github.com/xssnick)._



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-ide.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-ide.md
================================================
# IDE 支持

[intellij-ton](https://github.com/andreypfau/intellij-ton) 插件支持 Fift 和 FunC 编程语言
以及类型化语言二进制 (TL-B) 格式。

[intellij-ton](https://github.com/andreypfau/intellij-ton) 插件支持 Fift 和 FunC 编程语言以及类型化语言二进制（TL-B）格式。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-tools.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-tools.md
================================================
# TL-B 工具

## TL-B 分析器

TL-B 剖析器帮助实现基本 [TL-B 类型](/v3/documentation/data-formats/tlb/tl-b-types) 的序列化。
将 TL-B 类型作为对象实现，并返回序列化的二进制数据。

| 语言         | SDK                                                                                                       | 社区                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Kotlin     | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (+ 解析`.tlb`文件) | https://t.me/tonkotlin                      |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                        | https://t.me/tonutils                       |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ 解析`.tlb`文件)             | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                 | -                                                                           |
| Python     | [ton-kotlin](https://github.com/disintar/tonpy) (+ 解析`.tlb`文件)                         | https://t.me/dtontech                       |

## TL-B Generator

[tlb-codegen](https://github.com/ton-community/tlb-codegen) 软件包允许您根据提供的 TLB 方案生成序列化和反序列化结构的 Typescript 代码。

[tonpy](https://github.com/disintar/tonpy) 软件包允许你根据提供的 TLB 方案生成序列化和反序列化结构的 Python 代码。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/transaction-layout.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/transaction-layout.md
================================================
# 交易布局

:::info
为了最大限度地理解这个页面，强烈建议您熟悉[TL-B 语言](/develop/data-formats/cell-boc)。
:::

TON 区块链运作依赖于三个关键部分：账户、消息和交易。本页面描述了交易的结构和布局。

交易是一种操作，处理与特定账户相关的进出消息，改变其状态，并可能为验证者生成费用。

## 交易

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| 字段                | 类型                                                                     | 必需 | 描述                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------- | -- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                                                | 是  | 执行交易的地址的哈希部分。[更多关于地址](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)                                                   |
| `lt`              | uint64                                                                 | 是  | 代表 *逻辑时间*。[更多关于逻辑时间](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)                  |
| `prev_trans_hash` | bits256                                                                | 是  | 该账户上一个交易的哈希。                                                                                                                                      |
| `prev_trans_lt`   | uint64                                                                 | 是  | 该账户上一个交易的 `lt`。                                                                                                                                   |
| `now`             | uint32                                                                 | 是  | 执行此交易时设置的 `now` 值。它是以秒为单位的Unix时间戳。                                                                                                                |
| `outmsg_cnt`      | uint15                                                                 | 是  | 执行此交易时创建的输出消息数量。                                                                                                                                  |
| `orig_status`     | [AccountStatus](#accountstatus)                                        | 是  | 执行交易前该账户的状态。                                                                                                                                      |
| `end_status`      | [AccountStatus](#accountstatus)                                        | 是  | 执行交易后该账户的状态。                                                                                                                                      |
| `in_msg`          | (Message Any)                                       | 否  | 触发执行交易的输入消息。存储在一个引用中。                                                                                                                             |
| `out_msgs`        | HashmapE 15 ^(Message Any)                          | 是  | 包含执行此交易时创建的输出消息列表的字典。                                                                                                                             |
| `total_fees`      | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 是  | 执行此交易时收集的总费用。它包括_Toncoin_值和可能的一些[额外代币](https://docs.ton.org/develop/dapps/defi/coins#extra-currencies)。 |
| `state_update`    | [HASH_UPDATE](#hash_update) Account               | 是  | `HASH_UPDATE` 结构。存储在一个引用中。                                                                                                                        |
| `description`     | [TransactionDescr](#transactiondescr-types)                            | 是  | 交易执行过程的详细描述。存储在一个引用中。                                                                                                                             |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

- `[00]`：账户未初始化
- `[01]`：账户被冻结
- `[10]`：账户活跃
- `[11]`：账户不存在

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Field      | Type    | Description    |
| ---------- | ------- | -------------- |
| `old_hash` | bits256 | 执行交易前账户状态的哈希值。 |
| `new_hash` | bits256 | 执行交易后账户状态的哈希值。 |

## 交易说明类型

- [Ordinary](#ordinary)
- [Storage](#storage)
- [Tick-tock](#tick-tock)
- [Split prepare](#split-prepare)
- [Split install](#split-install)
- [Merge prepare](#merge-prepare)
- [Merge install](#merge-install)

## Ordinary

这是最常见的事务类型，能满足大多数开发人员的需求。这种类型的事务只有一条传入信息，并可创建多条传出信息。

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Field          | Type           | Required | Description                                                                                          |
| -------------- | -------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `credit_first` | Bool           | Yes      | 与接收到的信息的`bounce`标志相关的标志。`credit_first = !bounce`                                                     |
| `storage_ph`   | TrStoragePhase | No       | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                  |
| `credit_ph`    | TrCreditPhase  | No       | 包含有关事务执行信用阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                   |
| `compute_ph`   | TrComputePhase | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                  |
| `action`       | TrActionPhase  | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。          |
| `aborted`      | Bool           | Yes      | 表示事务执行是否被中止。                                                                                         |
| `bounce`       | TrBouncePhase  | No       | 包含有关事务执行弹跳阶段的信息。[更多信息](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) |
| `destroyed`    | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                                     |

## Storage

验证程序可自行决定插入这种类型的事务。它们不处理任何入站信息，也不调用任何代码。它们唯一的作用是从账户中收取存储付款，影响账户的存储统计和余额。如果账户的 *Toncoin* 余额低于一定数额，该账户可能会被冻结，其代码和数据会被其组合哈希值所取代。

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Field        | Type           | Description                                                                         |
| ------------ | -------------- | ----------------------------------------------------------------------------------- |
| `storage_ph` | TrStoragePhase | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

Tick "和 "Tock "交易是为特殊系统智能合约保留的，这些合约需要在每个区块中自动调用。Tick "交易在每个主链区块开始时调用，而 "Tock "交易则在结束时调用。

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                 |
| ------------ | -------------- | -------- | ------------------------------------------------------------------------------------------- |
| `is_tock`    | Bool           | Yes      | 表示交易类型的标志。用于区分 "Tick "和 "Tock "交易                                                           |
| `storage_ph` | TrStoragePhase | Yes      | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `compute_ph` | TrComputePhase | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `action`     | TrActionPhase  | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。 |
| `aborted`    | Bool           | Yes      | 表示事务执行是否被中止。                                                                                |
| `destroyed`  | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                            |

## Split Prepare

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

拆分交易在大型智能合约上启动，需要在高负载情况下进行拆分。合约应支持这种交易类型，并管理分割过程以平衡负载。

在需要因高负载而拆分的大型智能合约上启动拆分交易。合约应支持此类型的交易并管理拆分过程以平衡负载。

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                 |
| ------------ | -------------- | -------- | ------------------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | Yes      | 有关拆分过程的信息。                                                                                  |
| `storage_ph` | TrStoragePhase | No       | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `compute_ph` | TrComputePhase | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `action`     | TrActionPhase  | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。 |
| `aborted`    | Bool           | Yes      | 表示事务执行是否被中止。                                                                                |
| `destroyed`  | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                            |

## Split install

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

拆分安装事务用于创建大型智能合约的新实例。新智能合约的状态由 [Split Prepare](#split-prepare) 事务生成。

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Field                 | Type                        | Description                                |
| --------------------- | --------------------------- | ------------------------------------------ |
| `split_info`          | SplitMergeInfo              | 关于拆分过程的信息。                                 |
| `prepare_transaction` | [Transaction](#transaction) | 有关拆分操作的 [事务准备](#split-prepare) 的信息。存储在引用中。 |
| `installed`           | Bool                        | 表示交易是否已安装。                                 |

## Merge prepare

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

合并交易是在大型智能合约上启动的，这些合约在因负载过高而被拆分后需要重新合并。合约应支持这种交易类型，并管理合并过程以平衡负载。

在需要因高负载而重新组合的大型智能合约上启动合并交易。合约应支持此类型的交易并管理合并过程以平衡负载。

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Field        | Type           | Description                                                                         |
| ------------ | -------------- | ----------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | 有关合并过程的信息。                                                                          |
| `storage_ph` | TrStoragePhase | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | 表示事务执行是否被中止。                                                                        |

## Merge install

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

合并安装事务用于合并大型智能合约的实例。[合并准备](#merge-prepare) 事务会生成促进合并的特殊信息。

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field                 | Type                        | Required | Description                                                                                 |
| --------------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Yes      | 有关合并过程的信息。                                                                                  |
| `prepare_transaction` | [Transaction](#transaction) | Yes      | 有关合并操作的 [事务准备](#merge-prepare) 的信息。存储在引用中。                                                  |
| `storage_ph`          | TrStoragePhase              | No       | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `credit_ph`           | TrCreditPhase               | No       | 包含有关事务执行信用阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)          |
| `compute_ph`          | TrComputePhase              | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `action`              | TrActionPhase               | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。 |
| `aborted`             | Bool                        | Yes      | 表示事务执行是否被中止。                                                                                |
| `destroyed`           | Bool                        | Yes      | 表示账户是否在执行过程中被销毁。                                                                            |

## 另见

- 白皮书中 [交易布局](/tblkch.pdf#page=75\&zoom=100,148,290) 的原始描述



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/faq.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/faq.md
================================================
# 常见问题解答

本节涵盖了关于TON区块链最受欢迎的问题。

## 概述

### 能分享一下关于 TON 的简要概述吗？

- [The Open Network简介](/learn/introduction)
- [TON区块链基于PoS共识](https://blog.ton.org/the-ton-blockchain-is-based-on-pos-consensus)
- [TON白皮书](/learn/docs)

### TON 与 EVM 区块链的主要相似之处和不同之处是什么？

- [从以太坊到TON](/learn/introduction#ethereum-to-ton)
- [TON、Solana和以太坊2.0的比较](https://ton.org/comparison_of_blockchains.pdf)

### TON 有测试环境吗？

- [Testnet测试网](/develop/smart-contracts/environment/testnet)

## 区块

### 获取区块信息的RPC方法是什么？

验证者生产区块。现有区块通过Liteservers可用。Liteservers通过轻客户端访问。在轻客户端之上构建了第三方工具，如钱包、浏览器、dapps等。

1. 要访问轻客户端核心，请查看我们GitHub的这个部分：[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)
2. 工作链支持跨分片活动，这意味着用户可以在同一网络中的不同分片链或工作链之间进行交互。在当前的 L2 解决方案中，跨分片操作通常比较复杂，需要额外的桥接或互操作性解决方案。例如，在 TON 中，用户可以轻松地在不同分片链之间交换代币或执行其他交易，而无需复杂的程序。
3. 可扩展性是现代区块链系统面临的主要挑战之一。在传统的 L2 解决方案中，可扩展性受到定序器容量的限制。如果 L2 上的 TPS（每秒交易量）超过排序器的容量，就会导致问题。在 TON 的工作链中，这个问题可以通过划分分片来解决。当一个分片上的负载超过其容量时，该分片会被自动划分为两个或更多分片，从而使系统几乎可以无限制地扩展。

### TON 是否需要 L2？

在任何交易成本下，总有一些应用无法承受这样的费用，但却能以更低的成本运行。同样，无论实现的延迟时间有多长，总有一些应用程序需要更低的延迟时间。因此，可以想象，最终可能需要在 TON 平台上提供 L2 解决方案，以满足这些特定要求。

## MEV

### 区块时间

*2-5秒*

此外，目前的 TON 架构缺乏确定交易费用的市场机制。佣金是固定的，不会根据交易的优先顺序发生变化，这就降低了前置运行的吸引力。由于固定的费用和交易顺序的确定性，在 TON 中进行前置运行并非易事。

## 最终确定时间

### 获取区块信息的RPC方法是什么？

验证器生成的区块。可通过 Liteservers 访问的现有区块。通过 Liteservers 访问 Lite Clients。在 Lite Client 的基础上构建第三方工具，如钱包、explorers、dapps 等。

- 要访问轻客户端核心，请查看我们GitHub的这个部分：[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

此外，这里有三个高级第三方区块浏览器：

- https://explorer.toncoin.org/last
- https://toncenter.com/
- https://tonwhales.com/explorer

如需了解更多信息，请参阅我们文档中的 [ TON 级探索者](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) 部分。

### 区块时间

*2-5秒*

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- [区块链比较文件](https://ton.org/comparison_of_blockchains.pdf)
- [区块链比较表（信息量比文档少得多，但更直观）](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### 获取交易数据的RPC方法是什么？

*小于6秒*

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- 发送者准备交易正文（消息boc）并通过轻客户端（或更高级工具）广播
- 轻客户端返回广播状态，而非执行交易的结果

### 平均区块大小

```bash
max block size param 29
max_block_bytes:2097152
```

:::info:::

### TON 上的区块布局是怎样的？

钱包合约转账的示例（低层级）：

- [区块布局](/v3/documentation/data-formats/tlb/block-layout)

## 是否可以确定交易100%完成？查询交易级数据是否足以获得这些信息？

### 获取交易数据的RPC方法是什么？

- [见上面的答复](/v3/documentation/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### TON 交易是异步的还是同步的？是否有文档显示这个系统是如何工作的？

TON区块链消息是异步的：

- 发送者准备交易正文（消息boc）并通过轻客户端（或更高级工具）广播
- 轻客户端返回广播状态，而非执行交易的结果
- 发送者通过监听目标账户（地址）状态或整个区块链状态来检查期望结果

是的，TON上可以通过两种不同的方式实现交易批量处理：

- 通过利用TON的异步特性，即向网络发送独立的交易

使用批量处理特性的合约示例（高负载钱包）：

- https://github.com/tonuniverse/highload-wallet-api

### 是否可以确定交易100%完成？查询交易级数据是否足以获得这些信息？

\*\*简短回答：\*\*要确保交易已完成，必须检查接收者的账户。

默认钱包（v3/v4）也支持在一笔交易中发送多达4条消息。

- Go: [钱包示例](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python：[使用 TON 付款的店面机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- JavaScript：[用于销售饺子的机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

### TON 的货币精度是多少？

*9位小数*

- [交易布局](/v3/documentation/data-formats/tlb/transaction-layout)

### 是否有标准化的协议用于铸造、销毁和交易中转移可替代和不可替代代币？

Jettons（代币）：

- [TEP-74：Jettons标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [分布式代币概览](https://telegra.ph/Scalable-DeFi-in-TON-03-30)

其他标准：

- https://github.com/ton-blockchain/TEPs

其他标准：

## 标准

### 是否有用 Jettons（代币）和 NFT 解析事件的示例？

在TON上，所有数据都以boc消息的形式传输。这意味着在交易中使用NFT并不是特殊事件。相反，它是发送给或从（NFT或钱包）合约接收的常规消息，就像涉及标准钱包的交易一样。

:::info
Mainnet支持的小数位数：9位。
:::

### 账户结构

要更好地理解这个过程是如何工作的，请参阅[支付处理](/develop/dapps/asset-processing/)部分。

- [智能合约地址](/learn/overviews/addresses)
- [NFT 文档](/v3/documentation/dapps/defi/tokens#nft)

Jettons（代币）：

- [智能合约地址](/learn/overviews/addresses)
- [分布式 TON 代币概述](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [可替换标记文档（Jettons）](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)

其他标准：

- https://github.com/ton-blockchain/TEPs

### 是否有用 Jettons（代币）和 NFT 解析事件的示例？

在TON上，所有数据都以boc消息的形式传输。这意味着在交易中使用NFT并不是特殊事件。相反，它是发送给或从（NFT或钱包）合约接收的常规消息，就像涉及标准钱包的交易一样。

对于**Jettons**合约必须实现[标准的接口](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)并在_get_wallet_data()_或_get_jetton_data()_方法上返回数据。

- https://docs.tonconsole.com/tonapi/rest-api

TON内有一个特殊的主链叫做Masterchain。它由网络范围内的合约组成，包括网络配置、与验证者相关的合约等：

## 是否有特殊账户（例如，由网络拥有的账户）与其他账户有不同的规则或方法？

### 地址格式是什么？

- [治理合约](/develop/smart-contracts/governance)

### 智能合约

是的，请使用TON DNS：

- [TON DNS 与域名](/v3/guidelines/web3/ton-dns/dns)

### 是否可以检测到 TON 上的合约部署事件？

- [万物皆智能合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)

### 如何判断地址是否为代币地址？

智能合约可以存在于未初始化状态，意味着其状态在区块链中不可用但合约有非零余额。初始状态本身可以稍后通过内部或外部消息发送到网络，因此可以监控这些来检测合约部署。

### 是否可以将代码重新部署到现有地址，还是必须作为新合约部署？

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

:::info
在 TON 区块链概述文章中阅读更多有关主链、工作链和分片链的信息：[区块链中的区块链](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)。
:::

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

- [治理合约](/v3/documentation/smart-contracts/contracts-specs/governance)

## 智能合约地址是否区分大小写？

### 是否可以检测到 TON 上的合约部署事件？

[TON中的一切都是智能合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)。

TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。

[了解更多关于异步智能合约](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)。

TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。

- [通过 TonLib 部署钱包](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
- [为处理查询和发送回复付费](/v3/documentation/smart-contracts/transaction-fees/forward-fees)

### 是否可以为 TON 编写 Solidity？

目前，更新智能合约的能力是一种正常做法，在大多数现代协议中都得到了广泛应用。这是因为升级功能可以修复漏洞、添加新功能并提高安全性。

但如果您在Solidity语法中添加异步消息并能够与数据进行低层级交互，那么您可以使用FunC。FunC具有大多数现代编程语言通用的语法，并专为TON上的开发设计。

1. 关注声誉良好、开发团队知名的项目。
2. 信誉良好的项目总是会进行独立的代码审计，以确保代码安全可靠。请寻找那些已由信誉良好的审计公司完成过多次审计的项目。
3. 活跃的社区和积极的反馈可以作为项目可靠性的额外指标。
4. 检查项目实施更新流程的具体方式。流程越透明、越分散，用户面临的风险就越小。

### 推荐的节点提供商用于数据提取包括：

节点提供商合作伙伴：

有时，更新的逻辑可能存在，但更改代码的权利可能被转移到一个 "空"(empty) 地址，这也会阻止更改。

### 是否可以将代码重新部署到现有地址，还是必须作为新合约部署？

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

TON社区项目目录：

### 智能合约可以被删除吗？

是的，可以是存储费累积的结果（合约余额需要达到 -1  TON 才会被删除），也可以通过发送[模式 160](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) 信息来删除。

### 智能合约地址是否区分大小写？

是的，智能合约地址是区分大小写的，因为它们是使用 [base64 算法](https://en.wikipedia.org/wiki/Base64) 生成的。  你可以在 [这里](/v3/documentation/smart-contracts/addresses) 了解有关智能合约地址的更多信息。

### Ton 虚拟机（TVM）与 EVM 兼容吗？

TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。

[了解更多关于异步智能合约](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)。

### 是否可以为 TON 编写 Solidity？

相关地，TON生态系统不支持在以太坊的Solidity编程语言中开发。

但如果您在Solidity语法中添加异步消息并能够与数据进行低层级交互，那么您可以使用FunC。FunC具有大多数现代编程语言通用的语法，并专为TON上的开发设计。

## 远程过程调用(RPC)

### 推荐的节点提供商用于数据提取包括：

API类型：

- 了解有关不同 [API 类型](/v3/guidelines/dapps/apis-sdks/api-types) （索引、HTTP 和 ADNL）的更多信息

节点提供商合作伙伴：

- https://toncenter.com/api/v2/
- [getblock.io](https://getblock.io/)
- https://www.orbs.com/ton-access/
- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api)
- [nownodes.io](https://nownodes.io/nodes)
- https://dton.io/graphql

TON社区项目目录：

- [ton.app](https://ton.app/)

### 以下提供了两个主要资源，用于获取与TON区块链公共节点端点相关的信息（适用于TON Mainnet和TON Testnet）。

- [网络配置](/v3/documentation/network/configs/network-configs)
- [示例和教程](/v3/guidelines/dapps/overview#tutorials-and-examples)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/bridge-addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/bridge-addresses.md
================================================
# 跨链桥地址

:::caution
要准确获取当前跨链桥智能合约的地址，请直接在[区块链配置](/participate/crosschain/overview#blockchain-configs)中查看。这是最安全的方式。
:::

## Toncoin主网

### 主网 TON-Ethereum Toncoin桥

封装的 TONCOIN 地址 - [0x582d872a1b094fc48f5de31d3b73f2d9be47def1](https://etherscan.io/token/0x582d872a1b094fc48f5de31d3b73f2d9be47def1)

Bridge 地址 - [Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr](https://tonscan.org/address/Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr)

Collector 地址 - [EQCuzvIOXLjH2tv35gY4tzhIvXCqZWDuK9kUhFGXKLImgxT5](https://tonscan.org/address/EQCuzvIOXLjH2tv35gY4tzhIvXCqZWDuK9kUhFGXKLImgxT5)

Governance 地址 - [Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY](https://tonscan.org/address/Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY)

### 主网 TON-BSC Toncoin桥

封装的 TONCOIN 地址 - [0x76A797A59Ba2C17726896976B7B3747BfD1d220f](https://bscscan.com/token/0x76A797A59Ba2C17726896976B7B3747BfD1d220f)

Bridge 地址 - [Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r](https://tonscan.org/address/Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r)

Collector 地址 - [EQAHI1vGuw7d4WG-CtfDrWqEPNtmUuKjKFEFeJmZaqqfWTvW](https://tonscan.org/address/EQAHI1vGuw7d4WG-CtfDrWqEPNtmUuKjKFEFeJmZaqqfWTvW)

Governance 地址 - [Ef8OvX_5ynDgbp4iqJIvWudSEanWo0qAlOjhWHtga9u2YjVp](https://tonscan.org/address/Ef8OvX_5ynDgbp4iqJIvWudSEanWo0qAlOjhWHtga9u2YjVp)

### 主网Toncoin预言机

预言机0 - [Ef_P2CJw784O1qVd8Qbn8RCQc4EgxAs8Ra-M3bDhZn3OfzRb](https://tonscan.org/address/Ef_P2CJw784O1qVd8Qbn8RCQc4EgxAs8Ra-M3bDhZn3OfzRb)

预言机1 - [Ef8DfObDUrNqz66pr_7xMbUYckUFbIIvRh1FSNeVSLWrvo1M](https://tonscan.org/address/Ef8DfObDUrNqz66pr_7xMbUYckUFbIIvRh1FSNeVSLWrvo1M)

预言机2 - [Ef8JKqx4I-XECLuVhTqeY1WMgbgTp8Ld3mzN-JUogBF4ZEW-](https://tonscan.org/address/Ef8JKqx4I-XECLuVhTqeY1WMgbgTp8Ld3mzN-JUogBF4ZEW-)

预言机3 - [Ef8voAFh-ByCeKD3SZhjMNzioqCmDOK6S6IaeefTwYmRhgsn](https://tonscan.org/address/Ef8voAFh-ByCeKD3SZhjMNzioqCmDOK6S6IaeefTwYmRhgsn)

预言机4 - [Ef_uJVTTToU8b3o7-Jr5pcUqenxWzDNYpyklvhl73KSIA17M](https://tonscan.org/address/Ef_uJVTTToU8b3o7-Jr5pcUqenxWzDNYpyklvhl73KSIA17M)

预言机5 - [Ef93olLWqh1OuBSTOnJKWZ4NwxNq_ELK55_h_laNPVwxcEro](https://tonscan.org/address/Ef93olLWqh1OuBSTOnJKWZ4NwxNq_ELK55_h_laNPVwxcEro)

预言机6 - [Ef_iUPZdKLOCrqcNpDuFGNEmiuBwMB18TBXNjDimewpDExgn](https://tonscan.org/address/Ef_iUPZdKLOCrqcNpDuFGNEmiuBwMB18TBXNjDimewpDExgn)

预言机7 - [Ef_tTGGToGmONePskH_Y6ZG-QLV9Kcg5DIXeKwBvCX4YifKa](https://tonscan.org/address/Ef_tTGGToGmONePskH_Y6ZG-QLV9Kcg5DIXeKwBvCX4YifKa)

预言机8 - [Ef94L53akPw-4gOk2uQOenUyDYLOaif2g2uRoiu1nv0cWYMC](https://tonscan.org/address/Ef94L53akPw-4gOk2uQOenUyDYLOaif2g2uRoiu1nv0cWYMC)

EVM地址: 0xC4c9bd836ab8b446519736166919e3d62491E041,0xCF4A7c26186aA41390E246FA04115A0495085Ab9,0x17DcaB1B1481610F6C7a7A98cf0370dC0EC704a6,0x32162CAaEd276E77EF63194820586C942009a962,0x039f4e886432bd4f3cb5062f9861EFef3F6aDA28,0xFf441F9889Aa475d9D3b1C638C59B84c5179846D,0x0933738699dc733C46A0D4CBEbDA2f842e1Ac7d9,0x7F2bbaaC14F0f1834E6D0219F8855A5F619Fe2C4,0xfc5c6A2d01A984ba9eab7CF87A6D169aA9720c0C.

## Toncoin测试网

### 测试网 TON-Ethereum Toncoin桥

封装的TONCOIN地址 - [0xDB15ffaf2c88F2d89Db9365a5160D5b8c9448Ea6](https://goerli.etherscan.io/token/0xDB15ffaf2c88F2d89Db9365a5160D5b8c9448Ea6)

Bridge 地址 - [Ef-56ZiqKUbtp_Ax2Qg4Vwh7yXXJCO8cNJAb229J6XXe4-aC](https://testnet.tonscan.org/address/Ef-56ZiqKUbtp_Ax2Qg4Vwh7yXXJCO8cNJAb229J6XXe4-aC)

Collector 地址 - [EQCA1W_I267-luVo9CzV7iCcrA1OO5vVeXD0QHACvBn1jIVU](https://testnet.tonscan.org/address/EQCA1W_I267-luVo9CzV7iCcrA1OO5vVeXD0QHACvBn1jIVU)

Governance 地址 - [kf-OV1dpgFVEzEmyvAETT8gnhqZ1IqHn8RzT6dmEmvnze-9n](https://testnet.tonscan.org/address/kf-OV1dpgFVEzEmyvAETT8gnhqZ1IqHn8RzT6dmEmvnze-9n)

### 测试网 TON-BSC Toncoin桥

封装的TONCOIN地址 - [0xdb15ffaf2c88f2d89db9365a5160d5b8c9448ea6](https://testnet.bscscan.com/token/0xdb15ffaf2c88f2d89db9365a5160d5b8c9448ea6)

Bridge 地址 - [Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID](https://testnet.tonscan.org/address/Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID)

Collector 地址 - [EQDBNfV4DQzSyzNMw6BCTSZSoUi-CzWcYNsfhKxoDqfrwFtS](https://testnet.tonscan.org/address/EQDBNfV4DQzSyzNMw6BCTSZSoUi-CzWcYNsfhKxoDqfrwFtS)

Governance 地址 - [kf83VnnXuaqQV1Ts2qvUr6agacM0ydOux5NNa1mcU-cEO693](https://testnet.tonscan.org/address/kf83VnnXuaqQV1Ts2qvUr6agacM0ydOux5NNa1mcU-cEO693)

### 测试网Toncoin预言机

- Oracle 0

  TON Address - [Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR](https://testnet.tonscan.org/address/Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR)

  EVM Address - 0xe54cd631c97be0767172ad16904688962d09d2fe

- Oracle 1

  TON Address - [Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu](https://testnet.tonscan.org/address/Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu)

  EVM Address - 0xeb05E1B6AC0d574eF2CF29FDf01cC0bA3D8F9Bf1

- Oracle 2

  TON Address - [Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE](https://testnet.tonscan.org/address/Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE)

  EVM Address - 0xF636f40Ebe17Fb2A1343e5EEee9D13AA90888b51

## Token Mainnet

### Token主网

Ethereum Bridge Address - [0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5](https://etherscan.io/address/0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5)

以太坊Bridge地址 - [0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5](https://etherscan.io/address/0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5)

Bridge 地址 - [Ef-1JetbPF9ubc1ga-57oHoOyDA1IShJt-BVlJnA9rrVTfrB](https://tonscan.org/address/Ef-1JetbPF9ubc1ga-57oHoOyDA1IShJt-BVlJnA9rrVTfrB)

Collector 地址 - [EQDF6fj6ydJJX_ArwxINjP-0H8zx982W4XgbkKzGvceUWvXl](https://tonscan.org/address/EQDF6fj6ydJJX_ArwxINjP-0H8zx982W4XgbkKzGvceUWvXl)

### Mainnet Token Oracles

- Oracle 0

  TON Public Key = a0993546fbeb4e8c90eeab0baa627659aee01726809707008e38d5742ea38aef

  TON Address - [Ef8WxwYOyAk-H0YGBc70gZFJc6oqUvcHywU-yJNBfSNh-GW9](https://tonscan.org/address/Ef8WxwYOyAk-H0YGBc70gZFJc6oqUvcHywU-yJNBfSNh-GW9)

  ETH Address - 0x3154E640c56D023a98890426A24D1A772f5A38B2

- Oracle 1

  TON Public Key = fe0a78726a82754b62517e4b7a492e1b1a8d4c9014955d2fa8f1345f1a3eafba

  TON Address = [Ef8CbgwhUMYn2yHU343dcezKkvme3cyFJB7SHVY3FXhU9jqj](https://tonscan.org/address/Ef8CbgwhUMYn2yHU343dcezKkvme3cyFJB7SHVY3FXhU9jqj)

  ETH Address = 0x8B06A5D37625F41eE9D9F543482b6562C657EA6F

- Oracle 2

  TON Public Key = 00164233e111509b0486df85d2743defd6e2525820ee7d341c8ad92ee68d41a6

  TON Address = [Ef-n3Vdme6nSe4FBDb3inTRF9B6lh3BbIwGlk0dDpUO5oFmH](https://tonscan.org/address/Ef-n3Vdme6nSe4FBDb3inTRF9B6lh3BbIwGlk0dDpUO5oFmH)

  ETH Address = 0x6D5E361F7E15ebA73e41904F4fB2A7d2ca045162

- Oracle 3

  TON Public Key = 9af68ce3c030e8d21aae582a155a6f5c41ad006f9f3e4aacbb0ce579982b9ebb

  TON Address = [Ef9D1-FOb82pREFPgW7AlzNlZ7f0XnvmGakW23wpWeILAum9](https://tonscan.org/address/Ef9D1-FOb82pREFPgW7AlzNlZ7f0XnvmGakW23wpWeILAum9)

  ETH Address = 0x43931B8c29e34a8C16695408CD56327F511Cf086

- Oracle 4

  TON Public Key = a4fef528b1e841f5fce752feeac0971f7df909e37ffeb3fab71c5ce8deb9f7d4

  TON Address = [Ef8TBPHHIowG5pGgSVX8n4KmOaX-EEjvnOSBRlQvVsJWP_WJ](https://tonscan.org/address/Ef8TBPHHIowG5pGgSVX8n4KmOaX-EEjvnOSBRlQvVsJWP_WJ)

  ETH Address = 0x7a0d3C42f795BA2dB707D421Add31deda9F1fEc1

- Oracle 5

  TON Public Key = 58a7ab3e3ff8281b668a86ad9fe8b72f2d14df5dcc711937915dacca1b94c07d

  TON Address = [Ef8ceN7cTemTe4ZV6AIbg5f8LsHZsYV1UaiGntvkME0KtP45](https://tonscan.org/address/Ef8ceN7cTemTe4ZV6AIbg5f8LsHZsYV1UaiGntvkME0KtP45)

  ETH Address = 0x88352632350690EF22F9a580e6B413c747c01FB2

- Oracle 6

  TON Public Key = db60c3f50cb0302b516cd42833c7e8cad8097ad94306564b057b16ace486fb07

  TON Address = [Ef8uDTu2WCcJdtuKmkDmC1yRKVxZrTp83ke5PnMECOccg3w4](https://tonscan.org/address/Ef8uDTu2WCcJdtuKmkDmC1yRKVxZrTp83ke5PnMECOccg3w4)

  ETH Address = 0xeB8975966dAF0C86721C14b8Bb7DFb89FCBB99cA

- Oracle 7

  TON Public Key = 98c037c6d3a92d9467dc62c0e3da9bb0ad08c6b3d1284d4a37c1c5c0c081c7df

  TON Address = [Ef905jDDX87nPDbTSMqFB9ILVGX1zWc66PPrNhkjHrWxAnZZ](https://tonscan.org/address/Ef905jDDX87nPDbTSMqFB9ILVGX1zWc66PPrNhkjHrWxAnZZ)

  ETH Address = 0x48Bf4a783ECFb7f9AACab68d28B06fDafF37ac43

- Oracle 8

  TON Public Key = 5503c54a1b27525376e83d6fc326090c7d9d03079f400071b8bf05de5fbba48d

  TON Address = [Ef9Ubg96xQ8jVKbl7QQJ1k8pClQLmO1Ci68nuNfbLdm9uS-x](https://tonscan.org/address/Ef9Ubg96xQ8jVKbl7QQJ1k8pClQLmO1Ci68nuNfbLdm9uS-x)

  ETH Address = 0x954AE64BB0268b06ffEFbb6f454867a5F2CB3177

## Token Testnet

### Token测试网

Ethereum Bridge Address - [0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60](https://goerli.etherscan.io/address/0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60)

以太坊 Bridge 地址 - [0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60](https://goerli.etherscan.io/address/0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60)

Bridge 地址 - [Ef-lJBALjXSSwSKiedKzriSHixwQUxJ1BxTE05Ur5AXwZVjp](https://testnet.tonscan.org/address/Ef-lJBALjXSSwSKiedKzriSHixwQUxJ1BxTE05Ur5AXwZVjp)

Collector 地址 - [EQC1ZeKX1LNrlQ4bwi3je3KVM1AoZ3rkeyHM5hv9pYzmIh4v](https://testnet.tonscan.org/address/EQC1ZeKX1LNrlQ4bwi3je3KVM1AoZ3rkeyHM5hv9pYzmIh4v)

### Testnet Token Oracles

> Same with Toncoin Testnet Bridge

- Oracle 0

  TON Address - [Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR](https://testnet.tonscan.org/address/Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR)

  EVM Address - 0xe54cd631c97be0767172ad16904688962d09d2fe

- Oracle 1

  TON Address - [Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu](https://testnet.tonscan.org/address/Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu)

  EVM Address - 0xeb05E1B6AC0d574eF2CF29FDf01cC0bA3D8F9Bf1

- Oracle 2

  TON Address - [Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE](https://testnet.tonscan.org/address/Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE)

  EVM Address - 0xF636f40Ebe17Fb2A1343e5EEee9D13AA90888b51



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/overview.md
================================================
# 跨链桥

去中心化的跨链桥在TON区块链上运行，允许您将资产从TON区块链转移到其他区块链，反之亦然。

## Toncoin 跨链桥

Toncoin 跨链桥允许您在TON区块链和以太坊区块链之间，以及TON区块链和BNB智能链之间转移Toncoin。

跨链桥由[去中心化预言机](/participate/crosschain/bridge-addresses)管理。

### 如何使用？

跨链桥的前端托管在 https://ton.org/bridge。

:::info
[跨链桥前端源代码](https://github.com/ton-blockchain/bridge)
:::

### TON-以太坊智能合约源代码

- [FunC (TON端)](https://github.com/ton-blockchain/bridge-func)
- [Solidity (以太坊端)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)

### TON-BNB智能链智能合约源代码

- [FunC (TON端)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
- [Solidity (BSC端)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)

### 区块链配置

您可以通过检查相应的配置来获取实际的跨链桥的智能合约地址和预言机地址：

TON-以太坊: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738)。

TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739)。

TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740)。

### 文档

- [跨链桥如何工作](https://github.com/ton-blockchain/TIPs/issues/24)

### 跨链路线图

- https://t.me/tonblockchain/146



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/minter-flow.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/minter-flow.md
================================================
# 额外代币铸造

## 额外代币

根据 [Ton区块链白皮书 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55)，TON区块链允许其用户定义除Toncoin之外的任意加密货币或代币，前提是满足某些条件。这些额外的加密货币由32位的_currency_ids_标识。定义的额外加密货币列表是区块链配置的一部分，存储在主链中。每个内部消息以及账户余额都包含一个`ExtraCurrencyCollection`特殊字段（附加到消息或保留在余额上的额外代币集合）：

```tlb
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

## 额外代币配置

所有应该被铸造的代币的字典，准确来说是`ExtraCurrencyCollection`，存储在`ConfigParam7`中：

```tlb
_ to_mint:ExtraCurrencyCollection = ConfigParam 7;
```

`ConfigParam 6`包含与铸造相关的数据：

```tlb
_ mint_new_price:Grams mint_add_price:Grams = ConfigParam 6;
```

`ConfigParam2`包含_Minter_的地址。

## 低层级铸币流程

在每个区块中，整合者将旧的全局余额（上一个区块结束时所有代币的全局余额）与`ConfigParam7`进行比较。如果`ConfigParam7`中任何代币的任何金额小于全局余额中的金额 - 配置无效。如果`ConfigParam7`中任何代币的任何金额高于全局余额中的金额，将创建一条铸币消息。

这条铸币消息的来源是`-1:0000000000000000000000000000000000000000000000000000000000000000`，并且_Minter_从`ConfigParam2`作为目的地，并包含`ConfigParam7`中比旧全局余额多出来的额外代币。

这里的问题是铸币消息只包含额外代币，没有TON。这意味着即使_Minter_被设置为基本智能合约（在`ConfigParam31`中呈现），铸币消息也会导致交易中止：`compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`。

## 高层级铸币流程

_Minter_智能合约在收到创建新额外代币或为现有代币铸造额外代币的请求时应：

1. 检查`ConfigParam6`中确定的费用是否可以从请求消息中扣除
2. 1. 对于现有代币：检查铸造授权（只有_所有者_可以铸造新的）
   2. 对于创建新代币：检查加密货币的id是否未被占用，并存储新代币的所有者
3. 向配置合约发送消息（此类消息应导致`ExtraCurrencyCollection`中的`ConfigParam7`添加）
4. 向`0:0000...0000`发送消息（保证在下一个或随后的区块中回弹）并带有extra_currency id

收到来自`0:0000...0000`的消息后

1. 从回弹消息中读取extra_currency id
2. 如果minter余额上有对应id的代币，将它们发送给这个代币的所有者，并附上`ok`消息
3. 否则向代币所有者发送`fail`消息

## 待解决的问题

1. 向`0:0000...0000`发送消息以延迟请求处理的方法相当粗糙。
2. 当铸造失败时，应考虑这种情况。目前看来，唯一可能的情况是代币数量为0，或者当前余额加上铸造的金额不适合`(VarUInteger 32)`
3. 如何燃烧？乍一看，没有办法。
4. 铸币费用是否应该是禁止性的？换句话说，拥有数百万额外代币是否危险？（大配置下，区块整理过程中由于不受限的字典操作导致潜在的DoS攻击?）



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-alerting.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-alerting.md
================================================
# MyTonCtrl 警报机器人

## 概述

MyTonCtrl Alert Bot 是一款允许您通过 Telegram Bot 接收节点状态通知的工具。
它是 MyTonCtrl 工具集的一部分，适用于验证器和点对点服务器。

## 设置

要设置 MyTonCtrl Alerting Bot，请按照以下步骤操作：

### 准备机器人

1. 访问 https://t.me/BotFather，使用 `/newbot`命令创建机器人。之后，你将收到一个 `BotToken`。
2. 访问您的机器人并按下 `Start` 按钮。这样您就可以从机器人接收信息了。
3. 如果想在群组（聊天）中接收机器人的消息，请将机器人添加到群组，并赋予其必要的权限（设置群组管理员）。
4. 访问 https://t.me/getmyid_bot 并按下 "Start"（开始）按钮。它会用你的 `ChatId` 回复你，如果你想直接通过你的 Telegram 账户接收消息，就用这个 `ChatId`。
   如果你想在群组中接收消息，将机器人添加到群组，它就会用群组的 `ChatId` 回复你。

### 启用警报机器人

1. 通过命令启用 `警报机器人`

   ```bash
   MyTonCtrl> enable_mode alert-bot
   ```

2. 运行命令

   ```bash
   MyTonCtrl> set BotToken <BotToken>
   ```

3. 运行命令

   ```bash
   MyTonCtrl> set ChatId <ChatId>
   ```

4. 运行命令检查机器人是否能发送信息

   ```bash
   MyTonCtrl> test_alert
   ```

   你的 Telegram 账户或聊天工具中应该会收到一条来自机器人的信息。

## 支持的警报

MyTonCtrl Alert Bot 支持以下警报：

- 验证器钱包余额不足
- 节点的数据库使用率超过 80
- 节点的数据库使用率超过 95
- 验证器在本轮中效率较低
- 节点不同步
- 节点不运行（服务中断）
- 节点未应答 ADNL 连接
- 验证器在过去 6 小时内创建了 0 个区块
- 验证器在上一轮验证中被削减

## 环境（破坏）警报

要启用或禁用警报，请使用以下命令：

- 要启用警报，请使用命令 `enable_alert<alert-name>`。
- 要禁用警报，请使用 `disable_alert<alert-name>` 命令。
- 要查看警报状态，请使用命令 `list_alerts`。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors.md
================================================
# MyTonCtrl 错误

## 概述

本文介绍了用户可能遇到的 MyTonCtrl 错误。

## 常见错误

| 错误                                                                                                    | 可能的解决方案                                                                                                                 |
| :---------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Unknown module name: `name`. Available modes: `modes` | 查看可用模式列表                                                                                                                |
| No mode named `name` found in current modes: `current_modes`                          | 检查当前模式列表                                                                                                                |
| GetWalletFromFile error: Private key not found                                        | 检查钱包名称路径                                                                                                                |
| Cannot get own IP address                                                                             | 查看 https://ifconfig.me/ip 和 https://ipinfo.io/ip 资源访问权限 |

## Liteserver 错误

| 错误                                                            | 可能的解决方案                        |
| :------------------------------------------------------------ | :----------------------------- |
| Cannot enable liteserver mode while validator mode is enabled | 使用 `disable_mode validator`    |
| LiteClient error: `error_msg`                 | 检查运行 Liteserver 的 MyTonCtrl 参数 |

## 验证器(Validator)错误

| 错误                                                                                                                  | 可能的解决方案                                                                                                                                                                                          |
| :------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ValidatorConsole error: Validator console is not settings                                           | 检查 [验证程序文章](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-setings)                                                                                                         |
| Cannot enable validator mode while liteserver mode is enabled                                                       | 使用 `disable_mode liteserver` 功能                                                                                                                                                                  |
| Validator wallet not found                                                                                          | 检查 [验证器文章](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets)                                                                                                           |
| Validator is not synchronized                                                                                       | 等待更长时间进行同步或检查 [sync troubleshouting](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours)。                                                       |
| Stake less than the minimum stake. Minimum stake: `minStake`                        | 使用[`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready)和[check stake parameters](/v3/documentation/network/configs/blockchain-configs#param-17)。 |
| Don't have enough coins. stake: `stake`, account balance: `balance` | 将您的 `balance` 充值到 `stake`。                                                                                                                                                                       |

## 提名池错误

| 错误                                                                                                                               | 可能的解决方案               |
| :------------------------------------------------------------------------------------------------------------------------------- | :-------------------- |
| CreatePool error: Pool with the same parameters already exists                                                   | 检查 `pools_list` 中的现有池 |
| create_single_pool error: Pool with the same parameters already exists | 检查 `pools_list` 中的现有池 |

## 另请参见

- [节点故障排除](/v3/guidelines/nodes/nodes-troubleshooting)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview.mdx
================================================
# MyTonCtrl

## 概述

要安装和管理自己的节点，请使用 TON 基金会开发的**MyTonCtrl**开源工具。大多数 TON 节点都是可靠的，并通过 **MyTonCtrl** 进行了测试。

[MyTonCtrl](https://github.com/ton-blockchain/mytonctrl) 是一个控制台应用程序，是对 fift、lite-client 和 validator-engine-console 的便捷封装。它专门用于简化 Linux 操作系统上的钱包、域和验证器管理任务。

我们正在积极寻求有关安装过程的反馈意见。如果您有任何问题或建议，请 [联系我们](https://t.me/Alexgton)。

## 一般命令

### help

无参数，打印帮助文本

### clear

无参数，清除控制台

### exit

无参数，从控制台退出。

### update

更新 mytonctrl。参数组合：

| Format name            | Format                                                                     | Example                                                               | Description                                                             |
| :--------------------- | :------------------------------------------------------------------------- | :-------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| No args                | `update`                                                                   | `update`                                                              | 从当前版本库更新                                                                |
| URL format             | `update [https://github.com/author/repo/tree/branch]`                      | `update https://github.com/ton-blockchain/mytonctrl/tree/test`        | 从指定 URL 更新                                                              |
| Branch Only format     | `update [BRANCH]`                                                          | `update test`                                                         | 从当前版本库的指定分支更新                                                           |
| Branch Override format | `update [https://github.com/authorName/repoName/tree/branchName] [BRANCH]` | `update https://github.com/ton-blockchain/mytonctrl/tree/master test` | 从指定存储库的第二个参数指定的分支更新                                                     |

### upgrade

更新节点。参数组合：

| Format name            | Format                                                                      | Example                                                             | Description                                                                                            |
| :--------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| No args                | `upgrade`                                                                   | `upgrade`                                                           | 从当前版本库升级                                                                                               |
| URL format             | `upgrade [https://github.com/author/repo/tree/branch]`                      | `upgrade https://github.com/ton-blockchain/ton/tree/master`         | 从指定 URL 升级                                                                                             |
| Branch Only format     | `upgrade [BRANCH]`                                                          | `upgrade master`                                                    | 从当前版本库的指定分支升级                                                                                          |
| Branch Override format | `upgrade [https://github.com/authorName/repoName/tree/branchName] [BRANCH]` | `upgrade https://github.com/ton-blockchain/ton/tree/master testnet` | 从指定版本库第二个参数指定的分支升级                                                                                     |

### status

获取当前的 mytonctrl 和节点状态。参数组合：

| Format name | Format        | Example       | Description                                                                                      |
| ----------- | ------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| No args     | `status`      | `status`      | 完整的状态报告，包括验证器效率和在线验证器。                                                                           |
| Fast        | `status fast` | `status fast` | 必须在 TestNet 上使用。状态报告不含验证器效率和在线验证器计数。                                                             |

[查看有关状态输出的更多信息](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status)

### installer

无参数，运行 TON 模块安装程序 (script /usr/src/mytonctrl/mytoninstaller.py)

### status_modes

无参数，显示 MTC 模式。

### status_settings

无参数，显示所有可用设置及其说明和值。

### enable_mode

启用特定模式。

```bash
MyTonCtrl> enable_mode <mode_name>
```

例如

```bash
MyTonCtrl> enable_mode validator
```

### disable_mode

禁用特定模式。

```bash
MyTonCtrl> disable_mode <mode_name>
```

例如

```bash
MyTonCtrl> disable_mode validator
```

### about

提供指定模式的说明

```bash
MyTonCtrl> about <mode_name>
```

例如

```bash
MyTonCtrl> about validator
```

### get

以 JSON 格式获取特定设置的值

```bash
MyTonCtrl> get <setting_name>
```

例如

```bash
MyTonCtrl> get stake
```

### set

设置指定设置的指定值。如果启用 "强制"，则跳过设置存在性检查

```bash
MyTonCtrl> set <setting> <value> [--force]
```

例如

```bash
MyTonCtrl> set stake 9000
```

### rollback

无参数，退回到 mytonctrl 1.0。无论如何，你都不应该使用 mytonctrl 1.0。

### getconfig

读取并打印由 `<config-id>` 指定的配置的 JSON 表示。

```bash
MyTonCtrl> getconfig <config_id> # config id can be omitted
```

例如

```bash
MyTonCtrl> getconfig 0
```

### get_pool_data

读取并打印由 `<pool-name>` 或 `<pool-addr>` 指定的池数据的 JSON 表示形式。

```bash
MyTonCtrl> get_pool_data <<pool-name> | <pool-addr>>
```

例如

```bash
get_pool_data pool_name # you can check possible pool names using ls /home/install_mytonctrl/.local/share/mytoncore/pools
```

## Overlays

了解更多有关 [overlays](/v3/guidelines/nodes/custom-overlays) 的信息。

### add_custom_overlay

使用 `<path_to_config>` 指定的配置，在给定的 `<name>` 中添加自定义叠加。

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

例如

```bash
add_custom_overlay custom /config.json # check link from above to know what config this command requires (/v3/guidelines/nodes/custom-overlays)
```

### list_custom_overlays

无参数，打印自定义覆盖层

### delete_custom_overlay

使用指定的 `<name>` 删除自定义叠加。

```bash
MyTonCtrl> delete_custom_overlay <name>
```

## Validator

### vo

`<offer-hash>` 所述提议的投票权

```bash
MyTonCtrl> vo <offer-hash> # use `ol` to get offers
```

### ve

无参数，投票选举

### vc

`<election-id>` 所列选举中`<complaint-hash>` 所列投诉的选票

```bash
MyTonCtrl> vc <election-id> <complaint-hash>
```

实际上，即使这样做也行得通，但应使用当前 mytonctrl 状态下的数据：

```bash
MyTonCtrl> vc 0 0
```

### check_ef

输出当前和前几轮的验证器效率数据。

**注意**：当前回合的效率数据会随着回合的进行而变得更加准确。

根据 "验证器索引"（可通过 `status` 命令接收），有三种可能的情况：

- **Validator index is in the range [0, `max_main_validators`)**:
  整轮的 "验证器效率 "必须高于 90%（今后可根据统计数据更改这一数字）；否则，可能会受到处罚（罚款）。

- **Validator index is in the range [`max_main_validators`, `max_validators`)**:
  `验证器效率` 在整轮比赛中仍应高于 90%（今后可根据统计数据更改这一数字）。目前，不会应用惩罚，但在未来的更新中可能会有所改变。

- **The user is not a validator**:
  不适用处罚，但用户也没有资格获得奖励。无 "验证器效率 "可查。这可能是由于质押过低或节点配置不正确造成的。此外，请确保 `mytonctrl` 持续运行。

阅读更多关于 `max_validators` 和 `max_main_validators` [配置参数页面](/v3/documentation/network/configs/blockchain-configs#configuration-parameters-for-the-number-of-validators-for-elections)。获取 [mainnet](https://tonviewer.com/config#16) 和 [testnet](https://testnet.tonviewer.com/config#16) 的实际值。

## Pool commands

获取更多信息[在提名者集合页面](/v3/documentation/smart-contracts/contracts-specs/nominator-poor)。

### deposit_to_pool

将指定的 `<amount>` 存入由 `<pool-addr>` 指定的池中

```bash
MyTonCtrl> deposit_to_pool <pool-addr> <amount>
```

例如

```bash
MyTonCtrl> deposit_to_pool kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX 1
```

### withdraw_from_pool

从 `<pool-addr>` 指定的池中提取指定的 `<amount>`。

```bash
MyTonCtrl> withdraw_from_pool <pool-addr> <amount>
```

例如

```bash
MyTonCtrl> withdraw_from_pool kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX 1
```

### cleanup

无参数，清理验证器数据库

### benchmark

无参数，打印包含多个测试的表格

## Single pool

获取更多信息[在单个提名者集合页面](/v3/documentation/smart-contracts/contracts-specs/nominator-poor)。

### new_single_pool

使用指定的 `<pool-name>` 和 `<owner-address>` 创建一个新的单机池。

```bash
MyTonCtrl> new_single_pool <pool-name> <owner-address>
```

例如

```bash
MyTonCtrl> new_single_pool name kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT
```

### activate_single_pool

激活由 `<pool-name>` 指定的单池

```bash
MyTonCtrl> activate_single_pool <pool-name> # pool name from above
```

## 钱包管理

### 导入钱包

MyTonCtrl 支持各种类型的类钱包合约，包括 wallet-v1、wallet-v3、[lockup-wallet](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) 等。通常，它提供了与这些合约交互的直接方法。

#### 使用私人密钥导入

如果您可以访问私人密钥，就可以轻松导入钱包：

```bash
MyTonCtrl> iw <wallet-addr> <wallet-secret-key>
```

这里，`<wallet-secret-key>` 是 base64 格式的私人密钥。

例如

```bash
MyTonCtrl> iw kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT AAAH++/ve+/vXrvv73vv73vv73vv71DWu+/vWcpA1E777+92Ijvv73vv70iV++/ve+/vUTvv70d77+9UFjvv71277+9bO+/ve+/vXgzdzzvv71i77+977+9CjLvv73vv73vv71i77+9Bu+/vV0oJe+/ve+/vUPvv73vv73vv70=
```

#### 使用助记词组导入

如果您有一个记忆短语（由 24 个单词组成的序列，如 `tattoo during ...`），请按照以下步骤操作：

1. 安装 Node.js。
2. 克隆并安装 [mnemonic2key](https://github.com/ton-blockchain/mnemonic2key)：
   ```
   git clone https://github.com/ton-blockchain/mnemonic2key.git
   cd mnemonic2key
   npm install
   ```
3. 运行以下命令，将 `word1`, `word2`... 替换为您的记忆短语，将 `address` 替换为您的钱包合约地址：
   ```
   node index.js word1 word2 ... word24 [address]
   ```
4. 脚本将生成 `wallet.pk` 和 `wallet.addr`。将它们重命名为 `imported_wallet.pk` 和 `imported_wallet.addr`。
5. 将这两个文件复制到 `~/.local/share/mytoncore/wallets/` 目录。
6. 打开 mytonctrl 控制台，使用 `wl` 命令列出钱包。
7. 确认钱包已导入并显示正确余额。
8. 现在可以使用 `mg` 命令发送资金。输入 `mg` 查看帮助文档。
   运行命令时，请记住用实际值替换占位符（`< >`内的单词）。

### 显示钱包列表

```bash
MyTonCtrl> wl
```

![](/img/docs/mytonctrl/wl.png)

### 创建新的本地钱包

您还可以创建新的空钱包：

```bash
MyTonCtrl> nw <workchain-id> <wallet-name> [<version> <subwallet>]
```

例如

```bash
MyTonCtrl> nw 0 name v3 # by default subwallet is 0x29A9A317 + workchain
```

### 激活本地钱包

如果要使用钱包，必须激活它：

```bash
MyTonCtrl> aw <wallet-name>
```

但在激活之前，请先向钱包发送 1  Toncoin ：

```bash
MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  994.776032511     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
wallet_004            uninit  0.0               v1   0    0QBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Kbs

MyTonCtrl> mg validator_wallet_001 0QBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Kbs 1
```

然后激活它：

```bash
MyTonCtrl> aw wallet_004
ActivateWallet - OK

MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  994.776032511     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
wallet_004            active  0.998256399       v1   0    kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp
```

### 获取钱包序列号

```bash
MyTonCtrl> seqno <wallet-name>
```

![](/img/docs/mytonctrl/nw.png)

### 设置钱包版本

如果使用的是交互方式与普通钱包类似的修改过的钱包，则需要使用该命令。

```bash
MyTonCtrl> swv <wallet-addr> <wallet-version>
```

例如

```bash
MyTonCtrl> swv kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT v3
```

### 导出钱包

可以获得某个钱包地址和密匙。

```bash
MyTonCtrl> ew <wallet-name>
```

![](/img/docs/mytonctrl/ew.png)

### 删除本地钱包

```bash
MyTonCtrl> dw <wallet-name>
```

![](/img/docs/mytonctrl/dw.png)

## 账户和交易命令

### 账户状态

要查看账户状态及其交易历史，请使用以下命令：

```bash
MyTonCtrl> vas <account-addr> # for example you can get address of validator wallet by wl command and use vas to get more information
```

![](/img/docs/mytonctrl/vas.png)

### 账户历史

要查看账户交易历史，请使用以下命令，并将列出的操作次数设为 "限制"：

```bash
MyTonCtrl> vah <account-addr> <limit> # limit is just unsigned integer number
```

![](/img/docs/mytonctrl/vah.png)

### 转移代币

将代币从本地钱包转入账户：

```bash
MyTonCtrl> mg <wallet-name> <account-addr | bookmark-name> <amount>
```

例如

```bash
MyTonCtrl> mg wallet_004 kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp 1
```

:::caution
传输不支持钱包版本 `v4`
:::

### 通过代理转移代币

通过代理将代币从本地钱包转入账户：

```bash
MyTonCtrl> mgtp <wallet-name> <account-addr | bookmark-name> <amount>
```

例如

```bash
MyTonCtrl> mgtp wallet_004 kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp 1
```

## 通用池命令

在 **MyTonCtrl** 中有两种集合：

1. [提名池](/v3/documentation/smart-contracts/contracts-specs/nominator-pool)
2. [单一提名池](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool)

所有这些都由以下命令集进行管理：

### 池列表

```bash
MyTonCtrl> pools_list
```

![](/img/docs/mytonctrl/test-pools-list.png)

### 删除池

```bash
MyTonCtrl> delete_pool <pool-name>
```

### 导入池

您可以在本地池列表中创建已创建的池：

```bash
MyTonCtrl> import_pool <pool-name> <pool-addr>
```

例如

```bash
MyTonCtrl> import_pool name kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

## 书签 (Bookmarks)

您可以为账户地址创建别名（书签），以简化使用。

### 创建新书签

```bash
MyTonCtrl> nb <bookmark-name> <account-addr | domain-name>
```

![](/img/docs/mytonctrl/nb.png)

### 显示书签列表

```bash
MyTonCtrl> bl
```

![](/img/docs/mytonctrl/bl.png)

### 删除书签

```bash
MyTonCtrl> db <bookmark-name> <bookmark-type>
```

![](/img/docs/mytonctrl/db.png)

## 其他 mytonctrl 命令

### ol

显示提议列表

| Format name         | Format                  | Description                                                                                        |
| ------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| No arguments        | `ol`                    | 打印已缩减哈希值的表格。                                                                                       |
| JSON output         | `ol --json`             | 打印 `data` 的 JSON 表示。                                                                               |
| Full hash output    | `ol hash`               | 打印包含完整哈希值的表格。                                                                                      |
| JSON with full hash | `ol --json hash`        | 打印 `data` 的 JSON 表示形式。在这种情况下，"hash "参数不起作用。                                                        |

### od

读取提议差异

```bash
MyTonCtrl> od [offer-hash]
```

### el

显示选举条目列表

| Format name                       | Format                              | Description                                                                    |
| --------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| No arguments                      | `el`                                | 打印已减少 ADNL、Pubkey 和 Wallet 的表格。                                                |
| Any combination of following args | `el --json adnl pubkey wallet past` | 以 JSON 表示的完整 ADNL、Pubkey、钱包和过去的选举条目。                                           |

每个 arg 的说明：

- \--json：打印数据的 JSON 表示形式。
- past：包括过去的选举条目。
- adnl：打印完整的 ADNL。
- pubkey：打印完整的 Pubkey。
- wallet：打印完整的钱包。

### vl

显示激活的验证器

| Format name                        | Format                                 | Description                                                                    |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| No arguments                       | `vl`                                   | 打印已减少 ADNL、Pubkey 和 Wallet 的表格。                                                |
| 以下参数的任意组合                          | `vl --json adnl pubkey wallet past`    | 以 JSON 表示的完整 ADNL、Pubkey、钱包和过去的验证器条目。                                          |

每个 arg 的说明：

- \--json：打印数据的 JSON 表示形式。
- past：包括过去的验证条目。
- adnl：打印完整的 ADNL。
- pubkey：打印完整的 Pubkey。
- wallet：打印完整的钱包。
- offline：不包括在线验证器。

### cl

显示投诉列表

| Format name                       | Format                | Description                                                                                                      |
| --------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| No arguments                      | `cl`                  | 打印减少 ADNL 的表格。                                                                                                   |
| 以下参数的任意组合                         | `cl --json adnl past` | 完整的 ADNL，包括以 JSON 表示的以往投诉。                                                                                       |

每个参数的说明：

- \--json：打印数据的 JSON 表示形式。
- past：包括过去的投诉。
- adnl：打印完整的 ADNL。

## Installer

本节介绍 "installer "子控制台，可通过命令

```bash
MyTonCtrl> installer
```

例如

![img.png](/img/docs/mytonctrl/installer.png)

可直接从 MyTonCtrl 控制台调用所有命令

```bash
MyTonCtrl> installer [command] [args]
```

### help

打印所有可用命令

### clear

清除终端

### exit

退出 mytoninstaller 终端

### status

打印服务状态（全节点、Mytoncore、V.console、Liteserver）和节点参数

### set_node_argument

| Format name        | Format                                      | Description                                                                                        |
| ------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 添加或替换参数            | `set_node_argument [-ARG_NAME] [ARG_VALUE]` | 添加参数或替换已存在的参数值。-ARG_NAME "必须以"-"或"--"开头                                                            |
| 删除参数               | `set_node_argument [-ARG_NAME] -d`          | 从列表中删除参数。                                                                                          |

可能的参数：

| Node argument name | Description                                                                                                                                                          | Default value                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `threads`          | 线程数                                                                                                                                                                  | `cpus count - 1`                                                                    |
| `daemonize`        |                                                                                                                                                                      | No value                                                                            |
| `global-config`    | 全局配置路径                                                                                                                                                               | `/usr/bin/ton/global.config.json`                                                   |
| `db`               | 数据库路径                                                                                                                                                                | `/var/ton-work/db/`                                                                 |
| `logname`          | 日志路径                                                                                                                                                                 | `/var/ton-work/log`                                                                 |
| `state-ttl`        | 节点保留的区块链状态的 ttl                                                                                                                                                      | 3600                                                                                |
| `archive-ttl`      | 节点存储块的 ttl。_要强制节点不存储归档块，请使用值 `86400`_                                                                                                                                | 如果在安装过程中启用了 liteserver 模式，则为 2592000，否则为 86400                                      |

例如

```bash
MyTonInstaller> set_node_argument --state-ttl 3601
```

例如

```bash
MyTonInstaller> set_node_argument --state-ttl 3601
```

### enable

启用其中一种模式，为 `ton-http-api` 创建配置

```bash
MyTonInstaller> enable <MODE_NAME>
```

模式可以有以下名称

- FN - 完整节点
- VC - 验证器控制台
- LS - 精简型服务器
- DS - DHT 服务器
- JR - Jsonrpc
- THA - TON HTTP API
- LSP - ls 代理
- TSP - TON 存储 + TON 存储提供商

例如

```bash
MyTonInstaller> enable FN
```

### update

与 mytoninstaller 的 `enable` 相同

```bash
MyTonInstaller> update FN
```

### plsc

打印 liteserver 配置

例如

```json
{
    "ip": 1111111111,
    "port": 11111,
    "id": {
        "@type": "pub.ed25519",
        "key": "UURGaaZZjsBbKHvnrBqslHerXYbMCVDKdswKNJvAHkc="
    }
}
```

### clcf

创建本地配置文件（默认情况下位于 `/usr/bin/ton/local.config.json`）。

### print_ls_proxy_config

打印 ls 代理配置

### create_ls_proxy_config_file

目前在开发阶段不做任何事

### drvcf

危险恢复验证器配置文件

### setwebpass

无参数。为网络管理界面设置密码，运行 `python3 /usr/src/mtc-jsonrpc/mtc-jsonrpc.py -p`。

## 另请参见

- [FAQ](/v3/guidelines/nodes/faq)
- [Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status.mdx
================================================
# MyTonCtrl 状态

下面是对 `status` 命令输出的解释。

![状态](/img/docs/mytonctrl/status.png)

## TON network status

### Network name

可能的值：`mainnet`, `testnet`, `unknown`。`unknown`必须永远不被打印。

### Number of validators

有两个值：一个绿色，一个黄色。绿色是在线验证器的数量，黄色是所有
验证器的数量。
必须是大于 0 的整数，MyTonCtrl 通过命令 `getconfig 34` 获取，
查看 [this (param 32-34 and-36) section](/v3/documentation/network/configs/blockchain-configs#param-32-34 and-36) 以获取更多信息。

### Number of shardchains

必须是大于 0 的整数，颜色为绿色。

### Number of offers

有两个值：一个绿色，一个黄色。绿色是 "新提案 "的数量，黄色是 "所有提案 "的数量。

### Number of complaints

有两个值：一个绿色，一个黄色。绿色是 "新投诉 "的数量，黄色是 "所有投诉 "的数量
。

### Election status

可以是绿色文本 "打开 "或黄色文本 "关闭"。

## Local validator status

### Validator Index

如果验证器指数大于或等于 0（如果激活了验证器模式，则应如此），则必须为绿色，否则为红色。

### ADNL address of local validator

仅ADNL地址。

### Local validator wallet address

用于标记的地址必须是有效的 TON 地址。 

### Local validator wallet balance

钱包的余额

### Load average

格式为 `[int]: int, int, int` 。第一个是 cpus 数量，其他代表过去 1 分钟、5 分钟和 15 分钟的平均系统负载。

### Network load average

三个整数，逻辑与 `load average` 相同：过去 1 分钟、5 分钟和 15 分钟的系统平均负载。

### Memory load

两对整数，分别是内存和 swap 的绝对和相对内存使用量。

### Disks load average

与 "内存负载 "相同，但针对所有磁盘。

### Mytoncore status

应该是绿色的，说明 Mytoncore 运行了多长时间。

### Local validator status

应为绿色，显示本地验证器的运行时间。

### Local validator out of sync

整数应小于 20（绿色）。

### Local validator last state serialization

显示停止服务的主链区块数量

### Local validator database size

绝对负载应小于 1000 GB，相对负载应小于 80%。

### Version mytonctrl

提交的哈希值和分支名称。

### Version validator

提交的哈希值和分支名称。

## TON network configuration

### Configurator address

配置器地址，更多信息请查看 [this param 0](/v3/documentation/network/configs/blockchain-configs#param-0)。

### Elector address

选举人地址，详情请查看 [this param 1](/v3/documentation/network/configs/blockchain-configs#param-1)。

### Validation period

验证周期（以秒为单位），更多信息请查看 [this param 15](/v3/documentation/network/configs/blockchain-configs#param-15)。

### Duration of elections

选举持续时间，以秒为单位，更多信息请查看 [this param 15](/v3/documentation/network/configs/blockchain-configs#param-15)。

### Hold period

以秒为单位的保持时间，更多信息请查看 [this param 15](/v3/documentation/network/configs/blockchain-configs#param-15)。

### Minimum stake

以 TON 为单位的最小质押，详情请查看 [this param 17](/v3/documentation/network/configs/blockchain-configs#param-17)。

### Maximum stake

以 TON 为单位的最大质押，详情请查看 [this param 17](/v3/documentation/network/configs/blockchain-configs#param-17)。

## TON timestamps

### TON Network Launch

当前网络（主网或测试网）启动的时间。

### Start of the Validation Cycle

验证周期开始的时间戳；如果是未来时刻，则为绿色。

### End of the Validation Cycle

验证周期结束的时间戳；如果是未来时刻，则为绿色。

### Start of Elections

选举开始的时间戳；如果是未来时刻，则为绿色。

### End of Elections

选举结束的时间戳；如果代表未来时刻，则为绿色。

### Beginning of the Next Elections

下次选举开始的时间戳；如果是未来时刻，则为绿色。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-commands.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-commands.mdx
================================================
# TON 节点命令行标志

本文档介绍运行 TON 节点时可用的各种标志和选项。每个标记都有一个短名称、一个长名称、一个默认值（如适用）以及对其功能的描述。

## 一般选项

| 选项                                                   | 说明                                                                                                                                                                                                                       | 默认值                                             | 使用方法                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `-v`, `--verbosity`                                  | 设置日志输出的冗长程度。                                                                                                                                                                                                             | `INFO` (2)                                      | `-v <level>` (e.g., `-v 2`)                                                      |
| `-V`, `--version`                                    | 显示验证引擎的构建信息。                                                                                                                                                                                                             | N/A                                             | `-V`                                                                             |
| `-h`, `--help`                                       | 打印帮助信息。                                                                                                                                                                                                                  | N/A                                             | `-h`                                                                             |
| `-C`, `--global-config`                              | 指定读取全局配置（引导节点、公共 liteservers、初始块等）的文件。                                                                                                                                                                                   | N/A                                             | `-C <file>`                                                                      |
| `-c`, `--local-config`                               | 指定用于写入/读取本地节点配置（地址、密钥等）的文件。                                                                                                                                                                                              | N/A                                             | `-c <file>`                                                                      |
| `-I`, `--ip`                                         | 指定实例的 IP 地址和端口。首次运行时使用。                                                                                                                                                                                                  | N/A                                             | `-I <ip:port>`                                                                   |
| `-D`, `--db`                                         | 指定数据库的根目录。                                                                                                                                                                                                               | N/A                                             | `-D <path>`                                                                      |
| `-f`, `--fift-dir`                                   | 指定包含 Fift 脚本的目录。                                                                                                                                                                                                         | N/A                                             | `-f <path>`                                                                      |
| `-d`, `--daemonize`                                  | 通过关闭标准输入并创建新会话，对进程进行守护进程化。                                                                                                                                                                                               | Disabled                                        | `-d`                                                                             |
| `-l`, `--logname`                                    | 指定要写入日志的日志文件。                                                                                                                                                                                                            | N/A                                             | `-l <file>`                                                                      |
| `-s`, `--state-ttl`                                  | 设置状态的 TTL（生存时间），单位为秒。                                                                                                                                                                                                    | `86400` seconds (1 day)                         | `-s <seconds>`                                                                   |
| `-m`, `--mempool-num`                                | 指定 mempool 中外部信息的最大数量。                                                                                                                                                                                                   | Unlimited                                       | `-m <number>`                                                                    |
| `-b`, `--block-ttl`                                  | 设置块的 TTL，单位为秒。                                                                                                                                                                                                           | `86400` seconds (1 day)                         | `-b <seconds>`                                                                   |
| `-A`, `--archive-ttl`                                | 设置存档数据块的 TTL（秒）。                                                                                                                                                                                                         | `604800` seconds (7 days)                       | `-A <seconds>`                                                                   |
| `-K`, `--key-proof-ttl`                              | 以秒为单位设置密钥块的 TTL。                                                                                                                                                                                                         | `315360000` seconds (10 years)                  | `-K <seconds>`                                                                   |
| `-S`, `--sync-before`                                | 在初始同步期间，下载最后给定秒数内的所有数据块。                                                                                                                                                                                                 | `3600` seconds (1 hour)                         | `-S <seconds>`                                                                   |
| `-t`, `--threads`                                    | 指定要使用的线程数。                                                                                                                                                                                                               | `7`                                             | `-t <number>`                                                                    |
| `-u`, `--user`                                       | 更改运行进程的用户。                                                                                                                                                                                                               | N/A                                             | `-u <username>`                                                                  |

## 高级选项

| 选项                                                             | 说明                                                                                                                                                                                                           | 默认值                                             | 使用方法                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--shutdown-at`                                                | 计划验证器在给定的 Unix 时间戳关闭。                                                                                                                                                                                        | N/A                                             | `--shutdown-at <timestamp>`                                                              |
| `-T`, `--truncate-db`                                          | 以指定序列号作为新的顶级主链区块序列号，截断数据库。                                                                                                                                                                                   | N/A                                             | `-T <seqno>`                                                                             |
| `-U`, `--unsafe-catchain-restore`                              | 启用缓慢而危险的 catchain 恢复方法。                                                                                                                                                                                      | Disabled                                        | `-U <catchain-seqno>`                                                                    |
| `-F`, `--unsafe-catchain-rotate`                               | 启用强力和危险的连锁轮换。                                                                                                                                                                                                | Disabled                                        | `-F <block-seqno>:<catchain-seqno>:<height>`                                             |
| `--celldb-compress-depth`                                      | 将深度为 X 的 cell 与整个子树一起存储，从而优化 CellDb。                                                                                                                                                                         | `0` (disabled)                                  | `--celldb-compress-depth <depth>`                                                        |
| `--max-archive-fd`                                             | 设置归档管理器中打开文件描述符的数量限制。`0` 表示无限制。                                                                                                                                                                              | `0` (unlimited)                                 | `--max-archive-fd <number>`                                                              |
| `--archive-preload-period`                                     | 启动时预载过去 X 秒的存档片段。                                                                                                                                                                                            | `0` seconds (disabled)                          | `--archive-preload-period <seconds>`                                                     |
| `--enable-precompiled-smc`                                     | 可执行预编译智能合约（试验性）。                                                                                                                                                                                             | Disabled                                        | `--enable-precompiled-smc`                                                               |
| `--disable-rocksdb-stats`                                      | 禁止收集 RocksDb 统计数据。                                                                                                                                                                                           | Enabled                                         | `--disable-rocksdb-stats`                                                                |
| `--nonfinal-ls`                                                | 启用对非最终完成区块的特殊本地状态 (LS) 查询。                                                                                                                                                                                   | Disabled                                        | `--nonfinal-ls`                                                                          |
| `--celldb-cache-size`                                          | 设置 CellDb 中 RocksDb 的块缓存大小，单位为字节。                                                                                                                                                                            | `1G` (1 Gigabyte)                               | `--celldb-cache-size <size>`                                                             |
| `--celldb-direct-io`                                           | 为 CellDb 中的 RocksDb 启用直接 I/O 模式（仅当缓存大小 >= 30G 时适用）。                                                                                                                                                          | Disabled                                        | `--celldb-direct-io`                                                                     |
| `--celldb-preload-all`                                         | 启动时预载 CellDb 中的所有 cell 。                                                                                                                                                                                     | Disabled                                        | `--celldb-preload-all`                                                                   |
| `--celldb-in-memory`                                           | 在内存中存储整个 celldb。对于使用默认设置的验证器，cellldb 的大小约为 80-100GB，因此 128GB 是绝对必要的，最好是 256GB。                                                                                                                               | Disabled                                        | `--celldb-in-memory`                                                                     |
| `--catchain-max-block-delay`                                   | 设置创建新的 catchain 代码块前的延迟时间，单位为秒。                                                                                                                                                                              | `0.4` seconds                                   | `--catchain-max-block-delay <seconds>`                                                   |
| `--catchain-max-block-delay-slow`                              | 设置过长回合的最大扩展 catchain block 延迟（秒）。                                                                                                                                                                            | `1.0` seconds                                   | `--catchain-max-block-delay-slow <seconds>`                                              |
| `--fast-state-serializer`                                      | 可实现更快的持久状态序列化，但需要更多内存。                                                                                                                                                                                       | Disabled                                        | `--fast-state-serializer`                                                                |

## Session 日志选项

| 选项                                                   | 说明                                                                                                                                                                                                                   | 默认值                                                   | 使用方法                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `--session-logs`                                     | 指定验证程序会话统计的文件。                                                                                                                                                                                                       | `{logname}.session-stats`                             | `--session-logs <file>`                                                |



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-types.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-types.md
================================================
import Button from '@site/src/components/button'

# TON 节点类型

深入了解开放网络（TON）的世界时，理解不同的节点类型及其功能至关重要。本文为希望与TON区块链互动的开发者详细介绍了每种节点类型。

## 全节点

TON中的**全节点**是与区块链保持同步的节点。

它保留了区块链的_当前状态_，可以包含整个区块历史或其部分。这使其成为TON区块链的支柱，促进网络的去中心化和安全。

<Button href="/participate/run-nodes/full-node"
colorType="primary" sizeType={'sm'}>

运行全节点

</Button>

## 验证者节点

当**验证者节点**持有足够数量的Toncoin作为质押代币时，它将被激活。验证者节点对网络的运行至关重要，参与新网络区块的验证。

TON基于权益证明机制运行，其中验证者在维护网络功能方面发挥着关键作用。验证者会因其贡献而[以Toncoin获得奖励](/participate/network-maintenance/staking-incentives)，激励网络参与并确保网络安全。

[作为验证者运行全节点](/participate/run-nodes/full-node#become-a-validator)

## 全节点 + Liteserver

当在全节点上激活端点时，节点将承担**Liteserver**的角色。这种节点类型可以处理并响应来自轻客户端的请求，允许与TON区块链无缝互动。

### 轻客户端：与 TON 交互的SDK

Liteservers使与轻客户端的快速通信成为可能，便于执行检索余额或提交交易等任务，而不需要完整的区块历史。

每个支持ADNL协议的SDK都可以使用`config.json`文件作为轻客户端。`config.json`文件包含了可以用来连接TON区块链的端点列表。

[选择TON SDK](/develop/dapps/apis/sdk)

每个不支持ADNL的SDK通常使用HTTP中间件来连接TON区块链。它的安全性和速度不如ADNL，但使用起来更简单。

### 与 TON 的互动：公共Liteservers（端点）

TON基金会提供了几个公共Liteservers，集成到全局配置中，可供普遍使用。这些端点，如标准钱包使用的端点，确保即使不设置个人liteserver，也能与TON区块链进行交互。

- [公共Liteserver配置 - 主网](https://ton.org/global-config.json)
- [公共Liteserver配置 - 测试网](https://ton.org/testnet-global.config.json)

在您的应用程序中使用下载的`config.json`文件与TON SDK。

#### 故障排除

##### 故障排除

如果您看到此错误，这意味着您尝试连接的liteserver不可用。解决公共liteservers问题的正确方法如下：

1. 从tontech链接下载config.json文件：

```bash
wget https://api.tontech.io/ton/wallet-mainnet.autoconf.json -O /usr/bin/ton/global.config.json
```

它会从配置文件中移除响应慢的liteservers。

2. 在您的应用程序中使用下载的`config.json`文件与TON SDK(/participate/nodes/node-types#lite-clients-the-sdks-to-interact-with-ton)。

### 作为 Liteserver 运行全节点

如果你的项目需要高度_安全_，你可以运行自己的 Liteserver。要将完整节点作为 Liteserver 运行，只需在节点配置文件中启用 Liteserver 模式即可：

[在节点中启用 Liteserver](/participate/run-nodes/full-node#enable-liteserver-mode)

## 归档节点

[在节点中启用Liteserver](/participate/run-nodes/full-node#enable-liteserver-mode)

这种节点对于创建需要完整区块链历史的区块链浏览器或其他工具至关重要。

**归档节点**本质上是存档整个区块历史的全节点。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-types.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-types.mdx
================================================
import Button from '@site/src/components/button'

# TON 节点类型

**区块链节点** 是运行TON区块链软件的设备，通常是计算机，因此参与区块链运行。
一般来说，节点确保了 TON 网络的去中心化。

节点在 TON 协议中执行不同的功能：

- **全节点** 和 **存档节点** 维护区块链区块和交易历史，使用户和客户端应用程序能够查找区块和交易，并向区块链发送新的交易；
- **验证器节点** 验证交易，确保区块链安全。

下面将详细介绍每种节点类型，以及完整节点和归档节点与客户端应用程序的交互。

## 全节点

**全节点**是 TON 区块链中的一种基本节点类型。
它们作为 TON 区块链的骨干，保存着区块历史，换句话说，就是保存着区块的_当前状态_。

与**存档节点**相比，全节点只保留对确保网络稳定性和客户端应用程序运行至关重要的最新区块链状态。
全节点对其保存的 TON 区块链状态进行_prune_（剪裁）--这意味着，对于网络而言变得不必要的早期区块会被全节点自动删除，以有效管理其数据量。

为了允许客户端应用程序查找区块和交易，以及向 TON 区块链发送新交易，全节点都配备了 liteserver 功能：请参阅下文[与 TON 节点交互](#interacting-with-ton-nodes) 。

<Button href="/v3/guidelines/nodes/running-nodes/full-node#run-a-node-video"
colorType="primary" sizeType={'sm'}>

运行全节点

</Button>

## 存档节点

**Archive 节点**是一个完整的节点，保存着 TON 区块链的整个区块历史。
此类节点是确保整个区块链历史一致性的去中心化真相点。
它们是区块链探索者和其他依赖深度交易历史的应用程序的后台。

存档节点不会修剪区块链状态，这就提高了它们的系统要求，尤其是在存储方面。
根据最新估计，全节点和验证器节点需要约 1 TB 磁盘空间，而存档节点需要约 8 TB 才能存储完整的区块链历史。

<Button href="/v3/guidelines/nodes/running-nodes/archive-node"
colorType="primary" sizeType={'sm'}>
运行存档节点
</Button>

## 验证器节点

**验证节点**或**验证者**是TON网络参与者，他们根据TON的 _Proof-of-Stake_ 机制提出新区块并验证其中的交易。
这样，验证者就为整个区块链的安全性做出了贡献。

成功参与验证过程的验证者可获得[TON 中的奖励](/v3/documentation/infra/nodes/validation/staking-incentives)。

为了有权提议和验证区块，验证者由其他参与者根据其持有的 TON 数量（换句话说，就是其质押）选举产生：验证者的 TON 质押越多，当选、为网络验证区块和获得奖励的机会就越大。
通常情况下，验证者会激励其他 TON 持有者与他们一起入股，以便从由此产生的奖励中获得被动收入。
通过这种方式，验证者确保了网络的稳定性和安全性，并促进了网络的发展。

<Button href="/v3/guidelines/nodes/running-nodes/validator-node"
colorType="primary" sizeType={'sm'}>
运行验证器节点
</Button>

## 与 TON 节点互动

TON 节点配备了_Liteserver_功能，允许外部应用程序（换句话说，_lite 客户端_）通过它们与 TON 区块链交互。
通常，liteserver 模式用于完整节点和存档节点，而验证器节点则不启用该模式，以提高验证性能。

liteserver 模式允许lite 客户端通过TON节点发送交易。 以及检索与方块和交易的信息——例如，获取和更新钱包余额。

您有两个选项允许您的 lite 客户端应用程序与 TON 区块链进行交互：

1. 要获得稳定的连接，可以在节点配置文件中启用 Liteserver 模式运行自己的全节点或归档节点。
2. 如果您没有机会在自己的 TON 节点上安装 Liteserver，可以使用 TON 基金会提供的公共 Liteservers 网。为此，请使用以下配置文件：
   - [公共 Liteserver 配置 - 主网](https://ton.org/global-config.json)
   - [公共 Liteserver 配置 - testnet](https://ton.org/testnet-global.config.json)

:::caution 在生产中使用公共 Liteservers
由于公共 Liteservers 的负载长期居高不下，它们中的大多数都有速率限制，因此不建议在生产中使用它们。
这可能会导致精简版客户端应用程序不稳定。
:::

<Button href="/v3/guidelines/nodes/running-nodes/liteserver-node"
colorType="primary" sizeType={'sm'}>
在节点中启用 Liteserver
</Button>

要与 Liteservers 交互，可以使用以下工具：

- TON [ADNL API](/v3/guidelines/dapps/apis-sdks/tton-adnl-apis) 是与区块链进行通信的最底层方式；
- TON [SDKs](/v3/guidelines/dapps/apis-sdks/sdk) 为各种编程语言提供；
- TON [基于 HTTP 的应用程序接口](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) 在您的应用程序和 Liteserver 之间提供 REST API 中间件。

<Button href="/v3/guidelines/dapps/apis-sdks/sdk"
colorType="primary" sizeType={'sm'}>
选择一个 TON SDK
</Button>



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/collators.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/collators.md
================================================
# 验证者/收集者分离

:::caution 开发中
此功能目前仅在测试网中！参与风险自负。
:::

TON区块链的关键特性是能够将交易处理分散到网络节点上，并从“每个人都检查所有交易”转变为“每笔交易由安全的验证者子集检查”。这种能力在一个工作链分裂为所需数量的*分片链*时，无限横向扩展吞吐量，使TON与其他L1网络区别开来。

然而，为了防止串谋，有必要定期轮换处理一个或另一个分片的验证者子集。同时，为了处理交易，验证者显然应该知道交易之前的分片状态。最简单的方法是要求所有验证者了解所有分片的状态。

当TON用户数量在几百万范围内且每秒交易数（TPS）在一百以下时，这种方法运行良好。然而，在未来，当TON处理每秒成千上万笔交易并服务于数亿甚至数十亿人时，没有单一服务器能够保持整个网络的实时状态。幸运的是，TON在设计时就考虑到了这种负载，并支持吞吐量和状态更新的分片。

这是通过分离两个角色实现的：

- *收集者（Collator）* - 观察网络的一部分，了解实际状态并*收集*（生成）下一个区块的行为者
- *验证者（Validator）* - 从*收集者*获得新区块，检查其有效性，并签署以实际保证正确性，否则将冒失去抵押的风险。

同时，TON的架构允许*验证者*在不实际存储区块链状态的情况下有效验证新区块，通过检查特别制作的证明。

这样，当TON的吞吐量太大而无法由单一机器处理时，网络将由部分收集者子网络组成，每个收集者只处理其能够处理的链的一部分，以及由多个安全集组成的验证者子网络，用于提交新交易。

目前，TON测试网正在测试这种*验证者*/*收集者*分离，其中一些验证者像往常一样工作，而一些验证者不为自己收集区块，而是从收集者那里接收。

# 加入“轻验证者”

新的节点软件可在[区块生成](https://github.com/SpyCheese/ton/tree/block-generation)分支中获得。

## 收集者

要创建新的收集者，您需要设置TON节点；您可以使用`-M`标志强制节点不关注它不处理的分片链。

在`validator-engine-console`中为收集者创建新密钥，将adnl类别`0`设置为此密钥，并通过命令添加收集实体：

```bash
addcollator <adnl-id> <chain-id> <shard-id>
```

例如：

```bash
newkey
addadnl <adnl-id> 0
addcollator <adnl-id> 0 -9223372036854775808
```

配置为分片 wc:shard_pfx 的收集者可以收集分片 wc:shard_pfx 及其前者和后者的区块；它还会监控所有这些分片，因为这对于收集是必需的。

收集者可以通过命令停止：

```bash
delcollator <adnl-id> 0 -9223372036854775808
```

:::info
目前网络中有一个收集者，配置\*\*-41\*\*用于宣布其adnl地址。
:::

## 验证者

要运行验证者，您需要设置TON节点，使用`--lite-validator`标志强制验证者从收集者请求新区块而不是生成它们，并设置质押过程。轻模式下的验证者从`-41`配置中获取收集者节点。

最简单的方式如下：

- 为测试网设置MyTonCtrl
- 停止验证者 `sudo systemctl stop validator`
- 更新服务文件 `sudo nano /etc/systemd/system/validator.service`：添加`--lite-validator`标志
- 重载systemctl `sudo systemctl daemon-reload`
- 启动验证者 `sudo systemctl start validator`

## 轻节点

就像收集者一样，Liteservers可以配置为只监控区块链的一部分。可以通过使用`-M`选项运行节点并在`validator-engine-console`中添加分片来实现：

```bash
addshard 0 -9223372036854775808
```

默认情况下，主链总是被监控的。分片可以使用`delshard 0 -9223372036854775808`移除。

### 轻客户端

全局配置至少应包含两个部分之一：`liteservers`和`liteservers_v2`。第一个部分包含有关所有分片状态的“全”Liteservers。第二个部分包含有关区块链某些部分的数据的“部分”liteservers。

“部分”Liteservers如下描述：

```json
"liteservers_v2": [
  {
    "ip": ...,
    "port": ...,
    "id": {
      "@type": "pub.ed25519",
      "key": "..."
    },  
    "shards": [
      {   
        "workchain": 0, 
        "shard": -9223372036854775808
      }   
    ]   
  }
  ...
]
```

Lite Client和Tonlib支持此配置，并可以为每个查询选择合适的Liteserver。请注意，每个Liteserver默认监控主链，`liteservers_v2`中的每个服务器都隐含配置为接受有关主链的查询。配置中的分片`wc:shard_pfx`表示服务器接受有关分片`wc:shard_pfx`、其前者和后者（就像收集者的配置一样）的查询。

## 完全收集的数据

默认情况下，提议新区块的验证者在验证者集合中不会附加证明“区块之前”状态的数据。这些数据应由其他验证者从本地存储的状态中获取。通过这种方式，旧节点（来自主分支）和新节点可以达成共识，但新的验证者应该关注所有网络状态。

当验证者将附有汇总数据的区块共享时，升级到新协议可以通过以下方式完成：

- 将所有验证者升级到新节点版本
- 将 [full_collated_data](https://github.com/spycheese/ton/blob/block-generation/crypto/block/block.tlb#L737) 设置为 true

# 下一步

将*验证者*和*收集者*角色分离的实际能力是实现无限吞吐量的主要里程碑，但要创建真正去中心化和抗审查的网络，有必要

- 确保*收集者*的独立性和冗余性
- 确保验证者和收集者之间的稳定和安全的互动方式
- 为收集者确立适当的财务模型，激励其持续收集新区块

目前，这些任务超出了范围。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/staking-incentives.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/staking-incentives.md
================================================
# 质押激励

## 选举和质押

TON区块链使用权益证明（PoS）共识算法，这意味着与所有PoS网络一样，网络的安全和稳定性由一组网络验证者维护。特别是，验证者提出新区块（由交易批组成）的候选人，而其他验证者通过数字签名_验证_并批准它们。

验证者是使用特殊的[选举治理合约](/develop/smart-contracts/governance#elector)选择的。在每个共识轮次中，验证者候选人发送选举申请，连同他们的质押代币和期望的_max_factor_（调节验证者每轮共识维护量的参数）。

在验证者选举过程中，治理智能合约选择下一轮验证者，并根据验证者的质押代币和_max_factor_为每个验证者分配投票权重，以最大化他们的总质押代币。在这方面，质押代币和_max_factor_越高，验证者的投票权重越高，反之亦然。

被选中的验证者被选为通过参与下一个共识轮次来保护网络。然而，与许多其他区块链不同，为实现水平扩展，每个验证者只验证网络的一部分：

对于每个分片链和主链，都有专门的验证者集合。主链验证者集合由最高投票权重的多达100个验证者组成（定义为网络参数`Config16:max_main_validators`）。

相比之下，每个分片链由一组23个验证者（定义为网络参数`Config28:shard_validators_num`）验证，并且每1000秒（网络参数`Config28:shard_validators_lifetime`）随机轮换一次。

## 质押代币的价值：最大有效质押代币

当前配置中的`max_factor`为__3__，意味着_最小_验证者的质押代币不能比_最大_验证者的质押代币多三倍。

配置参数的公式：

`max_factor` = [`max_stake_factor`](https://tonviewer.com/config#17) / [`validators_elected_for`](https://tonviewer.com/config#15)

### （简化的）选择算法

这个算法由[选举智能合约](/develop/smart-contracts/governance#elector)运行，根据验证者所承诺的质押代币选择最佳的验证者候选人。以下是它的工作原理：

1. **初始选择**：选举者考虑所有承诺超过设定最低金额（300K，如[配置](https://tonviewer.com/config#17)所述）的候选人。

2. **排序候选人**：这些候选人根据他们的质押代币从高到低进行排列。

3. **缩小范围**：
   - 如果候选人数量超过允许的最大验证者数量（[见配置](https://tonviewer.com/config#16)），质押代币最低的将被排除。
   - 然后选举者评估每个可能的候选人组，从最大组开始逐渐减小：
     - 它检查按顺序排列的顶部候选人，一个接一个地增加数量。
     - 对于每个候选人，选举者计算他们的“有效质押代币”。如果候选人的质押代币明显高于最低限额，它会被调整下来（例如，如果某人质押代币310k，最低限额为100k，但有规则限制最多三倍最低限额，那么他们的有效质押代币被视为300k）。
     - 它对这个组中所有候选人的有效质押代币进行求和。

4. **最终选择**：有效质押代币总和最高的候选人组被选举者选为验证者。

#### 验证者选择算法

根据潜在验证者的可用质押代币，确定最小和最大质押代币的最佳值，目的是最大化总质押代币的量级：

1. 选举者考虑所有质押代币高于最低限额（[配置中的300K](https://tonviewer.com/config#17)）的申请者。
2. 选举者按质押代币_降序_排序他们。
3. 如果参与者数量超过[最大验证者数量](https://tonviewer.com/config#16)，选举者将放弃列表的尾部。然后选举者执行以下操作：

   - 对于每个循环__i__从_1至N_（剩余参与者数量），它从排序列表中取出前__i__个申请。
   - 它计算有效质押代币，考虑到`max_factor`。也就是说，如果某人质押代币310k，但`max_factor`为3，列表中的最低质押代币为100k Toncoin，那么有效质押代币将是min(310k, 3\*100k) = 300k。
   - 它计算所有__i__个参与者的总有效质押代币。

一旦选举者找到这样的__i__，使得总有效质押代币最大，我们就宣布这些__i__个参与者为验证者。

## 积极激励

与所有区块链网络一样，TON上的每笔交易都需要一个称为[ gas ](https://blog.ton.org/what-is-blockchain)的计算费用，用于进行网络存储和链上交易处理。在TON上，这些费用积累在选举者合约中的奖励池中。

网络还通过向奖励池添加补贴来补贴区块创建，每个主链块1.7 TON，每个基本链块1 TON（网络参数`Config14:masterchain_block_fee`和`Config14:basechain_block_fee`）。请注意，当将基本链分割为多个分片链时，每个分片链块的补贴相应分割。这个过程允许每单位时间的补贴保持接近恒定。

:::info
TON区块链计划在2023年第二季度引入通货紧缩机制。特别是，通过网络使用产生的TON的一部分将被销毁，而不是进入奖励池。
:::

经过65536秒或约18小时的验证周期轮次（网络参数`Config15:validators_elected_for`），验证者中的质押TON并未立即释放，而是持有额外的32768秒或约9小时（网络参数`Config15:stake_held_for`）。在此期间，可以从验证者中扣除削减（对行为不端验证者的惩罚机制）罚款。在资金释放后，验证者可以提取他们在验证轮次期间累积的奖励池份额，与他们的投票_权重_成比例。

截至2023年4月，网络上所有验证者每轮共识的总奖励池约为40,000 TON，每个验证者的平均奖励约为120 TON（投票权重与累积奖励之间的最大差异约为3 TON）。

考虑到Toncoin（50亿TON）的总供应量，其年通胀率约为0.3-0.6%。

然而，这一通胀率并非始终恒定，可能会根据网络的当前状态而有所偏差。最终，在通货紧缩机制启动和网络利用率增长后，它将趋于通货紧缩。

:::info
了解当前TON区块链统计数据[这里](https://tontech.io/stats/)。
:::

## 负面激励

在TON区块链上，通常有两种方式可以对行为不端的验证者进行处罚：闲置和恶意行为；这两种行为都是被禁止的，可能会因其行为而被罚款（在所谓的削减过程中）。

如果验证者在验证轮次期间长时间不参与区块创建和交易签名，它可能会使用_标准罚款_参数被罚款。截至2023年4月，标准罚款累积为101 TON（网络参数`ConfigParam40:MisbehaviourPunishmentConfig`）。

在TON上，削减罚款（给验证者的罚款）允许任何网络参与者提出投诉，如果他们认为验证者行为不端。在此过程中，提出投诉的参与者必须附上用于选举者提交的行为不端的密码学证据。在`stake_held_for`争议解决期间，网络上的所有验证者检查投诉的有效性，并投票决定是否集体追究（同时确定行为不端证据的合法性和罚款分配）。

一旦获得66%验证者批准（通过相等的投票权重衡量），削减罚款将从验证者中扣除，并从验证者的总质押代币中提取。对于处罚和投诉解决的验证过程通常使用 MyTonCtrl 自动进行。

## 参阅

:::info
2024 年 9 月 9 日，以下对表现不佳的审定者进行处罚的制度全面实施。
:::

### 不良工作的判定

TON 随 [lite-client](https://github.com/newton-blockchain/ton/tree/master/lite-client) 工具一起提供。lite-client 中有一条 `checkloadall` 命令。
该命令分析验证器应该处理了多少数据块，以及在给定时间内实际处理了多少数据块。

如果验证器在一轮验证过程中处理的区块数少于预期的 90%，则被视为表现不佳，应受到处罚。
:::info
了解更多有关过程的技术描述[此处](https://github.com/ton-blockchain/TIPs/issues/13#issuecomment-786627474)
:::

### 投诉工作流程

- 任何人都可以提出投诉，并在正确的投诉中获得奖励。
- 投诉的验证工作由验证员负责，完全分散进行。

#### 投诉

每轮验证结束后（约 18 个小时），参与该轮验证的验证者的质押会在 Elector 智能合约上再保留约 9 个小时。
在此期间，任何人都可以对在该轮验证中表现不佳的验证者进行投诉。这发生在 Elector 智能合约的链上。

#### 投诉确认

每轮验证结束后，验证者会收到来自 Elector 智能合约的投诉列表，并通过调用 `checkloadall`对其进行双重检查。
如果投诉被验证，他们就会在链上投票支持该投诉。

这些操作内置于 `mytonctrl`，并自动执行。
如果投诉获得了 66% 验证人的投票（按权重计算），就会从验证人的股份中扣除罚金。
任何人都无法单独罚款。

[@tonstatus_notifications](https://t.me/tonstatus_notifications) - 每轮被处罚的验证者名单。

### 罚款金额

罚款金额是固定的，等于 101  TON （网络参数 `ConfigParam40:MisbehaviourPunishmentConfig`），大致相当于验证者每轮的收入。

由于 TON 的受众和交易数量增长迅速，工作质量达到最佳至关重要，因此罚款的价值可能会发生变化。

### 罚款分配

罚款在验证者之间分配，扣除网络成本，并向第一个向选举人发送正确投诉的投诉者支付小额奖励（约 8  TON ）。

### 验证器指南

为防止您的验证器节点被罚款，建议您确保硬件、监控和验证器操作设置正确。
请确保您遵守 [validator 维护指南](/v3/guidelines/nodes/running-nodes/validator-node#maintain-guidelines)。
如果您不想这样做，请考虑使用盯人服务 https://ton.org/stake。

## 参阅

- [运行验证器](/v3/guidelines/nodes/running-nodes/validator-node)
- [交易费用](/v3/documentation/smart-contracts/transaction-fees/fees)
- [什么是区块链？什么是智能合约？什么是 gas ？](https://blog.ton.org/what-is-blockchain)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/configs/blockchain-configs.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/configs/blockchain-configs.md
================================================
# 配置参数

:::info
通过 [tonviewer](https://tonviewer.com/config) 读取实时值
:::

## 👋 介绍

在这个页面上，你可以找到在TON区块链中使用的配置参数的描述。TON有一个复杂的配置，包含许多技术参数：一些被区块链本身使用，一些被生态系统使用。然而，只有少数人理解这些参数的含义。这篇文章是为了提供给用户一种简单的方式来理解这些参数及其目的。

## 💡 必要条件

本材料旨在与参数列表一起阅读。你可以在 [当前配置](https://explorer.toncoin.org/config) 中查看参数值，并且它们是如何被写入 [cells](/learn/overviews/cells) 的，在 [TL-B](/develop/data-formats/tl-b-language) 格式的 [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) 文件中有描述。

:::info
TON区块链参数末尾的二进制编码是其配置的序列化二进制表示，使得配置的存储或传输更为高效。序列化的确切细节取决于TON区块链使用的特定编码方案。
:::

## 🚀 开始吧！

所有参数都有序排列，你不会迷路。为方便起见，请使用右侧边栏进行快速导航。

## 参数 0

此参数是一个特殊智能合约的地址，该合约存储区块链的配置。配置存储在合约中，以简化其在验证者投票期间的加载和修改。

:::info
在配置参数中，只记录了地址的哈希部分，因为合约始终位于 [masterchain](/learn/overviews/ton-blockchain#masterchain-blockchain-of-blockchains)（工作链 -1）。因此，合约的完整地址将被写为 `-1:<配置参数的值>`。
:::

## 参数 1

此参数是 [Elector](/develop/smart-contracts/governance#elector) 智能合约的地址，负责任命验证者、分发奖励和对区块链参数的变更进行投票。

## 参数 2

此参数代表系统的地址，代表系统铸造新的TON并作为奖励发放给验证区块链的验证者。

:::info
如果参数 2 缺失，将使用参数 0 替代（新铸造的TON来自于配置智能合约）。
:::

## 参数 3

此参数是交易费收集者的地址。

:::info
如果参数 3 缺失（截至撰写时的情况），交易费将发送至Elector智能合约（参数 1）。
:::

## 参数 4

此参数是TON网络的根DNS合约地址。

:::info
更多详细信息可以在 [TON DNS & Domains](/participate/web3/dns) 文章中找到，并且在 [这里](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md) 有更详细的原始描述。该合约不负责销售 .ton 域名。
:::

## 参数 6

此参数负责新代币的铸造费用。

:::info
Currently, minting additional currency is not implemented and does not work. The implementation and launch of the minter are planned.

你可以在 [相关文章](/develop/research-and-development/minter-flow) 中了解更多关于问题和前景。
:::

## 参数 7

此参数存储流通中的每种额外代币的数量。数据以 [字典](/develop/data-formats/tl-b-types#hashmap-parsing-example)（二叉树；可能在TON开发过程中这种结构被错误地命名为哈希映射）`extracurrency_id -> amount` 的形式存储，数量以 `VarUint 32` - 从 `0` 到 `2^248` 的整数表示。

## 参数 8

此参数指示网络版本和验证者支持的额外功能。

:::info
验证者是区块链网络中负责创建新块和验证交易的节点。
:::

- `version`：此字段指定版本。

- `capabilities`：此字段是一组标志，用于指示某些功能或能力的存在或缺失。

因此，在更新网络时，验证者将投票改变参数 8。这样，TON网络可以在不停机的情况下进行更新。

## 参数 9

此参数包含一个强制性参数的列表（二叉树）。它确保某些配置参数始终存在，并且在参数 9 变更之前，不能通过提案被删除。

## 参数 10

此参数代表一份重要TON参数的列表（二叉树），其变更会显著影响网络，因此会举行更多的投票轮次。

## 参数 11

此参数指出更改TON配置的提案在何种条件下被接受。

- `min_tot_rounds` - 提案可应用前的最小轮次数
- `max_tot_rounds` - 达到此轮次数时提案将自动被拒绝
- `min_wins` - 所需的胜利次数（3/4的验证者按质押总和计算必须赞成）
- `max_losses` - 达到此失败次数时提案将自动被拒绝
- `min_store_sec` 和 `max_store_sec` 确定提案被存储的可能的时间间隔
- `bit_price` 和 `cell_price` 指出存储提案的一个位或一个cell的价格

## 参数 12

此参数代表TON区块链中工作链的配置。TON区块链中的工作链被设计为独立的区块链，可以并行运行，使TON能够扩展并处理大量的交易和智能合约。

## 工作链配置参数

- `enabled_since`：启用此工作链的时刻的UNIX时间戳；

- `actual_min_split`：验证者支持的此工作链的最小拆分（分片）深度；

- `min_split`：由配置设置的此工作链的最小拆分深度；

- `max_split`：此工作链的最大拆分深度；

- `basic`：一个布尔标志位（1表示真，0表示假），指示此工作链是否基础（处理TON币，基于TON虚拟机的智能合约）；

- `active`：一个布尔标志位，指示此工作链当前是否活跃；

- `accept_msgs`：一个布尔标志位，指示此工作链目前是否接受消息；

- `flags`：工作链的附加标志位（保留，当前始终为0）；

- `zerostate_root_hash` 和 `zerostate_file_hash`：工作链第一个区块的哈希；

- `version`：工作链的版本；

- `format`：工作链的格式，包括 vm_version 和 vm_mode - 那里使用的虚拟机。

## 参数 13

此参数定义了在 [Elector](/develop/smart-contracts/governance#elector) 合约中对验证者不正确操作提出投诉的成本。

## 参数 14

此参数代表TON区块链中区块创建的奖励。Nanograms是nanoTON，因此，masterchain中的区块创建奖励等于1.7 TON，而基本工作链中的区块创建奖励为1.0 TON（同时，如果工作链发生拆分，区块奖励也会拆分：如果工作链中有两个分片链，那么分片区块的奖励将是0.5 TON）。

## 参数 15

此参数包含TON区块链中不同选举阶段和验证者工作的持续时间。

对于每个验证期，都有一个等于验证开始时UNIX格式时间的 `election_id`。
你可以通过调用Elector合约的相应get方法 `active_election_id` 和 `past_election_ids` 获得当前的 `election_id`（如果选举正在进行中）或过去的一个。

## 工作链配置参数

- `validators_elected_for`：选举出的验证者集合执行其角色的秒数（一轮）。

- `elections_start_before`：当前轮次结束前多少秒将开始下一时期的选举过程。

- `elections_end_before`：当前轮次结束前多少秒将选择下一轮的验证者。

- `stake_held_for`：在轮次过期后，为处理投诉而持有验证者质押的时期。

:::info
参数中的每个值都由 `uint32` 数据类型确定。
:::

### 示例

在TON区块链中，通常将验证周期分为偶数和奇数。这些轮次相互跟随。由于下一轮的投票在前一轮进行，因此验证者需要将资金分为两个池，以有机会参与两轮。

#### 主网

当前值：

```python
constants = {
    'validators_elected_for': 65536,  # 18.2 hours
    'elections_start_before': 32768,  # 9.1 hours
    'elections_end_before': 8192,     # 2.2 hours
    'stake_held_for': 32768           # 9.1 hours
}
```

方案：

![image](/img/docs/blockchain-configs/config15-mainnet.png)

#### 如何计算周期？

假设 `election_id = validation_start = 1600032768`。那么：

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

因此，目前，一个奇偶性轮次的长度为 `1600131072 - 1600000000 = 131072秒 = 36.40888...小时`

#### 测试网

##### 当前值：

```python
constants = {
    'validators_elected_for': 7200,  # 2 hours
    'elections_start_before': 2400,  # 40 minutes
    'elections_end_before': 180,     # 3 minutes
    'stake_held_for': 900            # 15 minutes
}
```

##### 方案

![image](/img/docs/blockchain-configs/config15-testnet.png)

###### 如何计算周期？

假设 `election_id = validation_start = 160002400`。那么：

```python
election_start = election_id - constants['elections_start_before'] = 160002400 - 2400 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 160002400 - 180 = 160002220
hold_start = validation_end = election_id + constants['validators_elected_for'] = 160002400 + 7200 = 160009600
hold_end = hold_start + constants['stake_held_for'] = 160009600 + 900 = 160010500
```

因此，目前，一个奇偶性轮次的长度为 `160010500 - 1600000000 = 10500秒 = 175分钟 = 2.91666...小时`

## 参数 16

此参数代表TON区块链中验证者数量的限制。它直接被Elector智能合约使用。

### 选举中验证者数量的配置参数：

- `max_validators`：此参数代表任何给定时间可以参与网络运营的验证者的最大数量。

- `max_main_validators`：此参数代表主链验证者的最大数量。

- `min_validators`：此参数代表必须支持网络运营的最小验证者数量。

1. 验证者的最大数量应大于或等于主链验证者的最大数量。
2. 主链验证者的最大数量必须大于或等于验证者的最小数量。
3. 验证者的最小数量不得少于1。

## 参数 17

此参数代表TON区块链中的质押参数配置。在许多区块链系统中，特别是使用权益证明或委托权益证明共识算法的系统中，网络原生加密货币的所有者可以“质押”他们的代币成为验证者并获得奖励。

## 配置参数：

- `min_stake`：此参数代表有兴趣参与验证过程的一方需要质押的TON的最小金额。

- `max_stake`：此参数代表有兴趣参与验证过程的一方可以质押的TON的最大金额。

- `min_total_stake`：此参数代表被选中的验证者集合必须持有的TON的最小总金额。

- `max_stake_factor`：此参数是一个乘数，指示最大有效质押（抵押）可以超过任何其他验证者发送的最小质押的多少倍。

:::info
参数中的每个值都由 `uint32` 数据类型确定。
:::

## 参数 18

此参数代表确定TON区块链中数据存储价格的配置。这作为一种防止垃圾信息的措施，并鼓励网络维护。

### 存储费用参数的字典：

- `utime_since`：此参数提供指定价格适用的初始Unix时间戳。

- `bit_price_ps` 和 `cell_price_ps`：这些参数代表TON区块链主工作链上存储一个位或一个cell的信息65536秒的存储价格

- `mc_bit_price_ps` 和 `mc_cell_price_ps`：这些参数特别代表在TON主链上计算资源的价格，同样为65536秒

:::info

`utime_since` 接受 `uint32` 数据类型的值。

其余接受 `uint64` 数据类型的值。
:::

## 参数 20 和 21

这些参数定义了TON网络中计算的成本。任何计算的复杂性都以gas单位估计。

- `flat_gas_limit` 和 `flat_gas_price`：提供了一定数量的起始gas，价格为 `flat_gas_price`（用于抵消启动TON虚拟机的成本）。

- `gas_price`：此参数反映了网络中gas的价格，单位是每65536gas单位的nanotons。

- `gas_limit`：此参数代表每笔交易可消耗的最大gas量。

- `special_gas_limit`：此参数代表特殊（系统）合约每笔交易可消耗的gas量限制。

- `gas_credit`：此参数代表提供给交易的gas单位信用额，用于检查外部消息。

- `block_gas_limit`：此参数代表单个区块内可消耗的最大gas量。

- `freeze_due_limit` 和 `delete_due_limit`：合约被冻结和删除的累积存储费用（nanotons）的限制。

:::info
更多关于 `gas_credit` 和外部消息的其他参数的信息在 [这里](/develop/smart-contracts/guidelines/accept#external-messages) 。
:::

## 参数 22 和 23

这些参数设置了区块的限制，达到这些限制时，区块将被完成，剩余消息的回调（如果有的话）将延续到下一个区块。

### 配置参数：

- `bytes`：此部分设置了区块大小的字节限制。

- `underload`：负载不足是指分片意识到没有负载，并倾向于合并（如果相邻的分片愿意的话）。

- `soft_limit`：软限制 - 达到此限制时，内部消息停止处理。

- `hard_limit`：硬限制 - 这是绝对最大大小。

- `gas`：此部分设置了区块可以消耗的gas量限制。在区块链中，gas是计算工作的指标。对于大小（字节），负载不足、软限制和硬限制的限制方式相同。

- `lt_delta`：此部分设置了第一个交易和最后一个交易之间逻辑时间差的限制。逻辑时间是TON区块链用于事件排序的概念。对于大小（字节）和gas，负载不足、软限制和硬限制的限制方式相同。

:::info
在分片上负载不足，相应地，希望与neighbor合并的情况下，`soft_limit` 定义了一种状态，即超过此状态后内部消息停止处理，但外部消息继续处理。外部消息处理直到达到 `(soft_limit + hard_limit)/2` 的限制。
:::

## 参数 24 和 25

参数 24 代表了TON区块链主链中发送消息的成本配置。

参数 25 代表了所有其他情况下发送消息的成本配置。

### 定义转发成本的配置参数：

- `lump_price`：此参数表示转发消息的基础价格，无论其大小或复杂性如何。

- `bit_price`：此参数代表每位消息转发的成本。

- `cell_price`：此参数反映了每个cell消息转发的成本。cell是TON区块链上数据存储的基本单位。

- `ihr_price_factor`：用于计算即时超立方路由（IHR）成本的因子。
  :::info
  IHR是TON区块链网络中的一种消息传递方法，消息直接发送到接收方的分片链。
  :::

- `first_frac`：此参数定义了沿消息路线的第一次转换将使用的剩余的remainder的部分。

- `next_frac`：此参数定义了沿消息路线的后续转换将使用的剩余的remainder的部分。

## 参数 28

此参数提供了TON区块链中Catchain协议的配置。Catchain是TON中用于在验证者之间达成一致的最低层层共识协议。

### 配置参数：

- `flags`：一个通用字段，可用于设置各种二进制参数。在这种情况下，它等于0，这意味着没有设置特定的标志。

- `shuffle_mc_validators`：一个布尔值，指示是否打乱主链验证者。如果此参数设置为1，则验证者将被打乱；否则，他们不会。

- `mc_catchain_lifetime`：主链catchain组的寿命（秒）。

- `shard_catchain_lifetime`：分片链catchain组的寿命（秒）。

- `shard_validators_lifetime`：分片链验证者组的寿命（秒）。

- `shard_validators_num`：每个分片链验证组的验证者数量。

## 参数 29

此参数提供了TON区块链中catchain（[参数 28](#param-28)）上层共识协议的配置。共识协议是区块链网络的关键组成部分，确保所有节点在分布式账本的状态上达成一致。

### 配置参数：

- `flags`：一个通用字段，可用于设置各种二进制参数。在这种情况下，它等于0，这意味着没有设置特定的标志。

- `new_catchain_ids`：一个布尔值，指示是否生成新的Catchain标识符。如果此参数设置为1，则将生成新的标识符。在这种情况下，它被赋值为1，这意味着将生成新的标识符。

- `round_candidates`：共识协议每轮考虑的候选人数量。这里设置为3。

- `next_candidate_delay_ms`：在生成区块候选权转移到下一个验证者之前的延迟（毫秒）。这里设置为2000毫秒（2秒）。

- `consensus_timeout_ms`：区块共识的超时时间（毫秒）。这里设置为16000毫秒（16秒）。

- `fast_attempts`：达成共识的“快速”尝试次数。这里设置为3。

- `attempt_duration`：每次达成一致的尝试持续时间。这里设置为8。

- `catchain_max_deps`：Catchain区块的最大依赖数量。这里设置为4。

- `max_block_bytes`：区块的最大大小（字节）。这里设置为2097152字节（2MB）。

- `max_collated_bytes`：序列化的区块正确性证明的最大大小（字节）。这里设置为2097152字节（2MB）。

- `proto_version`：协议版本。这里设置为2。

- `catchain_max_blocks_coeff`：Catchain中区块生成速率的限制系数，[描述](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md)。这里设置为10000。

## 参数 31

此参数代表来自以下智能合约地址的配置，这些地址不收取gas或存储费用，可以创建tick-tok交易。这个列表通常包括治理合约。该参数以二叉树结构呈现——一个树（HashMap 256），其中键是地址的256位表示。此列表中只能出现主链中的地址。

## 参数 32、34 和 36

来自上一轮（32）、当前轮（34）和下一轮（36）的验证者列表。参数 36 负责从选举结束到轮次开始时设置。

### 配置参数：

- `cur_validators`：这是当前的验证者列表。验证者通常负责在区块链网络中验证交易。

- `utime_since` 和 `utime_until`：这些参数提供了这些验证者活跃的时间段。

- `total` 和 `main`：这些参数提供了网络中验证者的总数和验证主链的验证者数量。

- `total_weight`：这将验证者的权重加起来。

- `list`：一个验证者的树状列表 `id->validator-data`：`validator_addr`、`public_key`、`weight`、`adnl_addr`：这些参数提供了每个验证者的详细信息 - 他们在主链中的256地址、公钥、权重、ADNL地址（TON网络层使用的地址）。

## 参数 40

此参数定义了对不当行为（非验证）的惩罚结构的配置。在没有此参数的情况下，默认罚款大小为101 TON。

## 配置参数：

**`MisbehaviourPunishmentConfig`**：此数据结构定义了如何惩罚系统中的不当行为。

它包含几个字段：

- `default_flat_fine`：这部分罚款与质押大小无关。

- `default_proportional_fine`：这部分罚款与验证者的质押大小成比例。

- `severity_flat_mult`：这是应用于验证者重大违规行为的 `default_flat_fine` 值的乘数。

- `severity_proportional_mult`：这是应用于验证者重大违规行为的 `default_proportional_fine` 值的乘数。

- `unpunishable_interval`：此参数代表违规者不受惩罚的期间，以消除临时网络问题或其他异常。

- `long_interval`、`long_flat_mult`、`long_proportional_mult`：这些参数定义了一个“长”时间段及其对不当行为的持平和比例罚款的乘数。

- `medium_interval`、`medium_flat_mult`、`medium_proportional_mult`：同样，它们定义了一个“中等”时间段及其对不当行为的持平和比例罚款的乘数。

## 参数 43

此参数涉及帐户和消息的各种大小限制和其他特性。

### 配置参数：

- `max_msg_bits`：消息的最大大小（位）。

- `max_msg_cells`：消息可以占用的最大cell数（存储单位的一种形式）。

- `max_library_cells`：用于库cell的最大cell数。

- `max_vm_data_depth`：消息和账户状态中的最大cell深度。

- `max_ext_msg_size`：外部消息的最大大小（位）。

- `max_ext_msg_depth`：外部消息的最大深度。这可能是指消息内部数据结构的深度。

- `max_acc_state_cells`：帐户状态可以占用的最大cell数。

- `max_acc_state_bits`：帐户状态的最大大小（位）。

如果缺失，默认参数为：

- `max_size` = 65535
- `max_depth` = 512
- `max_msg_bits` = 1 \<\< 21
- `max_msg_cells` = 1 \<\< 13
- `max_library_cells` = 1000
- `max_vm_data_depth` = 512
- `max_acc_state_cells` = 1 \<\< 16
- `max_acc_state_bits` = (1 \<\< 16) \* 1023

:::info
您可以在源代码[这里](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h#L379)查看有关标准参数的更多详情。
:::

## 参数 44

此参数定义了被暂停的地址列表，这些地址在`suspended_until`之前不能被初始化。它仅适用于尚未启动的账户。这是稳定代币经济学的一种措施（限制早期矿工）。如果未设置 - 则没有限制。每个地址都表示为此树的一个终端节点，树状结构允许有效地检查地址在列表中的存在与否。

:::info
代币经济学的稳定进一步在“The Open Network” Telegram 频道的[官方报告](https://t.me/tonblockchain/178)中描述。
:::

## 参数 71 - 73

此参数涉及在其他网络中包装TON的桥：

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

预编译合约的更多详情请查看[本页面](/develop/smart-contracts/core-contracts/precompil)。

## 参数 71 - 73

此参数涉及在其他网络中封装TON的桥：

- ETH-TON \*\* (71)\*\*
- BSC-TON \*\* (72) \*\*
- Polygon-TON \*\* (73) \*\*

### 配置参数:

- `bridge_address`：这是接受TON以在其他网络中发行包装的TON的桥合约地址。

- `oracle_multisig_address`: 这是 bridge 管理钱包地址。 多重钱包是一种数字钱包类型，需要多方签名授权交易。 它常常被用来加强安全，Oracle充当这些方面的角色。

- `oracles`：以树形结构 `id->address` 的形式列出的预言机

- `external_chain_address`：对应外部区块链中的桥合约地址。

## 参数 79, 81 和 82

此参数涉及从其他网络中包装代币到TON网络上的代币的桥：

- ETH-TON \*\* (79) \*\*
- BSC-TON \*\* (81) \*\*
- Polygon-TON \*\* (82) \*\*

### 配置参数:

- `bridge_address` 和 `oracles_address`：这些是桥和桥管理合约（预言机多签）的区块链地址。

- `oracles`：以树形结构 `id->address` 的形式列出的预言机

- `state_flags`：状态标志。该参数负责启用/禁用不同的 bridge 功能。

- `prices`：此参数包含用于桥的不同操作或费用的价格列表或字典，例如 `bridge_burn_fee`、`bridge_mint_fee`、`wallet_min_tons_for_storage`、`wallet_gas_consumption`、`minter_min_tons_for_storage`、`discover_gas_consumption`。

- `external_chain_address`：另一区块链中的桥合约地址。

## 负参数

:::info
负参数与正参数的区别在于需要验证者的验证；它们通常没有特定分配的角色。
:::

## 下一步

在深入研究本文后，强烈建议您花时间详细研究以下文档：

- [whitepaper.pdf](https://ton.org/whitepaper.pdf) 和 [tblkch.pdf](/tblkch.pdf) 中的原始但有限的描述。

- [mc-config.h](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h)，[block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) 和 [BlockMasterConfig 类型](https://docs.evercloud.dev/reference/graphql-api/field_descriptions#blockmasterconfig-type)。

## 📖 参阅

在此页面上，您可以找到TON区块链的活动网络配置：

- 主网：https://ton.org/global-config.json
- 测试网：https://ton.org/testnet-global.config.json
- [俄语版本](https://github.com/delovoyhomie/description-config-for-TON-Blockchain/blob/main/Russian-version.md)。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/configs/config-params.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/configs/config-params.md
================================================
# 更改参数

本文档旨在简要解释TON区块链的配置参数，并提供通过大多数验证者共识更改这些参数的逐步指南。

我们假设读者已经熟悉[Fift](/develop/fift/overview)和[轻客户端](/participate/nodes/lite-client)，如[FullNode-HOWTO (低级)](/participate/nodes/full-node)和[Validator-HOWTO (低级)](/participate/nodes/validator)中所述，其中描述了验证者为配置提案投票的部分。

## 1. 配置参数

**配置参数**是影响验证者和/或TON区块链基本智能合约行为的某些值。所有配置参数的当前值存储为主链状态的特殊部分，并在需要时从当前主链状态中提取。因此，讲到配置参数的值时要考虑到某个特定的主链区块。每个分片链区块都包含对最新已知主链区块的引用；假定相应主链状态中的值对此分片链区块是有效的，并在其生成和验证过程中使用。对于主链区块，使用上一个主链区块的状态来提取有效的配置参数。因此，即使有人试图在主链区块中更改某些配置参数，这些更改也只会在下一个主链区块中生效。

每个配置参数由一个有符号的32位整数索引标识，称为**配置参数索引**或简称**索引**。配置参数的值始终是一个cell。某些配置参数可能会缺失；那时有时假定此参数的值为`Null`。还有一个**强制性**配置参数列表必须始终存在；此列表存储在配置参数`#10`中。

所有配置参数组合成一个**配置字典** - 一个带有有符号32位键（配置参数索引）和值（由一个cell引用组成）的哈希映射。换句话说，配置字典是TL-B类型的值（`HashmapE 32 ^Cell`）。实际上，所有配置参数的集合作为TL-B类型`ConfigParams`的值存储在主链状态中：

```
_ config_addr:bits256 config:^(Hashmap 32 ^Cell) = ConfigParams;
```

我们看到，除了配置字典外，`ConfigParams`还包含`config_addr` - 主链上配置智能合约的256位地址。稍后将提供有关配置智能合约的更多细节。

通过特殊的TVM寄存器`c7`，所有智能合约在其交易代码执行时都可以访问包含所有配置参数有效值的配置字典。更准确地说，当执行智能合约时，`c7`被初始化为一个元组，其唯一元素是一个包含几个执行智能合约时有用的“context”值的元组，例如当前Unix时间（如块头中所注册）。此元组的第十个条目（即，以零为基索引的索引9）包含代表配置字典的cell。因此，可以通过TVM指令`PUSH c7; FIRST; INDEX 9`或等效指令`CONFIGROOT`来访问它。事实上，特殊的TVM指令`CONFIGPARAM`和`CONFIGOPTPARAM`将前述操作与字典查找结合起来，通过其索引返回任何配置参数。我们推荐参考TVM文档以获取更多关于这些指令的详细信息。这里相关的是所有配置参数都可以从所有智能合约（主链或分片链）中轻松访问，并且智能合约可以检查并使用它们来执行特定检查。例如，智能合约可能会从配置参数中提取工作链数据存储价格，以计算存储用户提供数据的价格。

配置参数的值不是任意的。实际上，如果配置参数索引`i`为非负，则此参数的值必须是TL-B类型（`ConfigParam i`）的有效值。验证者强制执行此限制，不会接受对非负索引的配置参数的更改，除非它们是相应TL-B类型的有效值。

因此，此类参数的结构在源文件`crypto/block/block.tlb`中定义，其中为不同的`i`值定义了（`ConfigParam i`）。例如，

```
_ config_addr:bits256 = ConfigParam 0;
_ elector_addr:bits256 = ConfigParam 1;
_ dns_root_addr:bits256 = ConfigParam 4;  // root TON DNS resolver

capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
_ GlobalVersion = ConfigParam 8;  // all zero if absent
```

我们看到配置参数`#8`包含一个没有引用且恰好有104个数据位的cell。前四位必须是`11000100`，然后存储32位当前启用的“全局版本”，随后是对应当前启用能力的64位整数标志。所有配置参数的更详细描述将在TON区块链文档的附录中提供；目前，可以检查`crypto/block/block.tlb`中的TL-B方案并检查验证者源代码中不同参数的使用方式。

与具有非负索引的配置参数相反，具有负索引的配置参数可以包含任意值。至少，验证者不会对其值强加任何限制。因此，它们可用于存储重要信息（例如，某些智能合约必须开始操作的Unix时间），该信息对于块生成不是关键，但被一些基本智能合约使用。

## 2. 更改配置参数

我们已经解释了当前配置参数的值是如何存储在主链状态的特殊部分中的。它们是如何更改的？

事实上，主链中有一个特殊的智能合约称为**配置智能合约**。其地址由`ConfigParams`中的`config_addr`字段确定，我们之前已经描述过了。其数据中的第一个cell引用必须包含所有配置参数的最新副本。当生成新的主链区块时，会通过其地址`config_addr`查找配置智能合约，并从其数据的第一个cell引用中提取新的配置字典。在进行一些有效性检查后（例如，验证具有非负32位索引`i`的任何值确实是TL-B类型（`ConfigParam i`）的有效值），验证者将此新配置字典复制到包含ConfigParams的主链部分。在创建所有交易之后执行此操作，因此只检查配置智能合约中的新配置字典的最终版本。如果有效性检查失败，则“真实”的配置字典保持不变。通过这种方式，配置智能合约无法安装无效的配置参数值。如果新配置字典与当前配置字典一致，则不执行检查也不做更改。

通过这种方式，所有配置参数的更改都由配置智能合约执行，其代码决定更改配置参数的规则。当前，配置智能合约支持两种更改配置参数的模式：

1. 通过由特定私钥签名的外部消息，该私钥对应于存储在配置智能合约数据中的公钥。这是公共测试网和可能由一个实体控制的较小私有测试网络所采用的方法，因为它使运营商能够轻松更改任何配置参数的值。请注意，这个公钥可以通过一个由旧密钥签名的特殊外部消息更改，如果它被更改为零，则此机制被禁用。因此，可以在启动后立即进行微调，然后永久禁用它。
2. 通过创建“配置提案(configuration proposals)”，然后由验证者对其投票或反对。通常，配置提案必须在一个轮次中收集超过3/4的所有验证者（按权重）的投票，并且不仅在一个轮次中，而且在几个轮次中（即，连续几组验证者必须确认提议的参数更改）。这是TON区块链主网将采用的分布式治理机制。

我们希望更详细地描述第二种更改配置参数的方式。

## 3. 创建配置提案

新的**配置提案**包含以下数据：

- 要更改的配置参数的索引
- 配置参数的新值（或Null，如果要删除）
- 提案的过期Unix时间
- 标志位提案是**关键**还是非关键
- 可选的**旧值哈希**，带有当前值的cell哈希（仅当当前值具有指定哈希时，提案才能被激活）

任何在主链上拥有钱包的人都可以创建新的配置提案，前提是他支付足够的费用。但是，只有验证者可以对现有的配置提案投票或反对。

请注意，有**关键**和**普通**配置提案。关键配置提案可以更改任何配置参数，包括所谓的关键配置参数之一（关键配置参数列表存储在配置参数`#10`中，它本身是关键的）。然而，创建关键配置提案的成本更高，通常需要在更多轮次中收集更多验证者的投票（普通和关键配置提案的确切投票要求存储在关键配置参数`#11`中）。另一方面，普通配置提案更便宜，但它们不能更改关键配置参数。

为了创建新的配置提案，首先必须生成一个包含提议的新值的BoC（cell包）文件。这样做的确切方式取决于要更改的配置参数。例如，如果我们想创建包含UTF-8字符串"TEST"（即`0x54455354`）的参数`-239`，我们可以如下创建`config-param-239.boc`：调用Fift，然后输入

```
<b "TEST" $, b> 2 boc+>B "config-param-239.boc" B>file
bye
```

结果，将创建一个21字节的文件`config-param-239.boc`，包含所需值的序列化。

对于更复杂的情况，尤其是对于具有非负索引的配置参数，这种简单的方法不容易适用。我们建议使用`create-state`（在构建目录中作为`crypto/create-state`可用）而不是`fift`，并复制和编辑源文件`crypto/smartcont/gen-zerostate.fif`和`crypto/smartcont/CreateState.fif`的适当部分，通常用于创建TON区块链的零状态（对应于其他区块链架构的“创世块”）。

例如，考虑配置参数`#8`，其中包含当前启用的全局区块链版本和能力：

```
capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
_ GlobalVersion = ConfigParam 8;
```

我们可以通过运行轻客户端并输入`getconfig 8`来检查其当前值：

```
> getconfig 8
...
ConfigParam(8) = (
  (capabilities version:1 capabilities:6))

x{C4000000010000000000000006}
```

现在假设我们想要启用位`#3`（`+8`）表示的能力，即`capReportVersion`（启用时，此能力会迫使所有 collator 在其生成的块头中报告其支持的版本和能力）。因此，我们想要`version=1`和`capabilities=14`。在这个例子中，我们仍然可以猜测正确的序列化并直接通过Fift创建BoC文件。

```
x{C400000001000000000000000E} s>c 2 boc+>B "config-param8.boc" B>file
```

（结果创建了一个包含所需值的30字节文件`config-param8.boc`。）

然而，在更复杂的情况下，这可能不是一个选项，所以让我们以不同的方式做这个例子。也就是说，我们可以检查源文件`crypto/smartcont/gen-zerostate.fif`和`crypto/smartcont/CreateState.fif`中的相关部分。

```
// version capabilities --
{ <b x{c4} s, rot 32 u, swap 64 u, b> 8 config! } : config.version!
1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
```

和

```
// version capabilities
1 capCreateStats capBounceMsgBody or capReportVersion or config.version!
```

我们看到，`config.version!`没有最后的`8 config!`实际上就是我们需要的，所以我们可以创建一个临时Fift脚本，例如，`create-param8.fif`：

```
#!/usr/bin/fift -s
"TonUtil.fif" include

1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
{ <b x{c4} s, rot 32 u, swap 64 u, b> } : prepare-param8

// create new value for config param #8
1 capCreateStats capBounceMsgBody or capReportVersion or prepare-param8
// check the validity of this value
dup 8 is-valid-config? not abort"not a valid value for chosen configuration parameter"
// print
dup ."Serialized value = " <s csr.
// save into file provided as first command line argument
2 boc+>B $1 tuck B>file
."(Saved into file " type .")" cr
```

现在，如果我们运行`fift -s create-param8.fif config-param8.boc`或者更好地从构建目录运行`crypto/create-state -s create-param8.fif config-param8.boc`，我们看到以下输出：

```
Serialized value = x{C400000001000000000000000E}
(Saved into file config-param8.boc)
```

我们获得与之前相同内容的30字节文件`config-param8.boc`。

一旦我们有了一个包含配置参数所需值的文件，我们就调用目录`crypto/smartcont`中找到的脚本`create-config-proposal.fif`，带有适当的参数。同样，我们建议使用`create-state`（在构建目录中作为`crypto/create-state`可用）而不是`fift`，因为它是Fift的一个特殊扩展版本，能够进行更多与区块链相关的有效性检查：

```
$ crypto/create-state -s create-config-proposal.fif 8 config-param8.boc -x 1100000


Loading new value of configuration parameter 8 from file config-param8.boc
x{C400000001000000000000000E}

Non-critical configuration proposal will expire at 1586779536 (in 1100000 seconds)
Query id is 6810441749056454664 
resulting internal message body: x{6E5650525E838CB0000000085E9455904_}
 x{F300000008A_}
  x{C400000001000000000000000E}

B5EE9C7241010301002C0001216E5650525E838CB0000000085E9455904001010BF300000008A002001AC400000001000000000000000ECD441C3C
(a total of 104 data bits, 0 cell references -> 59 BoC data bytes)
(Saved to file config-msg-body.boc)
```

我们获得了一个要从主链上任何（钱包）智能合约以适量的Toncoin发送到配置智能合约的内部消息的正文。配置智能合约的地址可以通过在轻客户端中输入`getconfig 0`获得：

```
> getconfig 0
ConfigParam(0) = ( config_addr:x5555555555555555555555555555555555555555555555555555555555555555)
x{5555555555555555555555555555555555555555555555555555555555555555}
```

我们看到配置智能合约的地址是`-1:5555...5555`。通过运行此智能合约的适当get方法，我们可以找出创建此配置提案所需的付款金额：

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 proposal_storage_price 0 1100000 104 0

arguments:  [ 0 1100000 104 0 75077 ] 
result:  [ 2340800000 ] 
remote result (not to be trusted):  [ 2340800000 ] 
```

get方法`proposal_storage_price`的参数是关键标志位（本例中为0），此提案将处于活动状态的时间间隔（1.1百万秒），数据中的位总数（104）和cell引用（0）。后两个数量可以在`create-config-proposal.fif`的输出中看到。

我们看到，创建此提案需要支付2.3408 Toncoin。最好添加至少1.5 Tonoin到消息中以支付处理费，所以我们打算发送4 Toncoin连同请求（所有多余的Toncoin将退回）。现在我们使用`wallet.fif`（或我们正在使用的钱包对应的Fift脚本）从我们的钱包向配置智能合约创建一个携带4 Toncoin和`config-msg-body.boc`中的正文的转账。这通常看起来像：

```
$ fift -s wallet.fif my-wallet -1:5555555555555555555555555555555555555555555555555555555555555555 31 4. -B config-msg-body.boc

Transferring GR$4. to account kf9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQft = -1:5555555555555555555555555555555555555555555555555555555555555555 seqno=0x1c bounce=-1 
Body of transfer message is x{6E5650525E835154000000085E9293944_}
 x{F300000008A_}
  x{C400000001000000000000000E}

signing message: x{0000001C03}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

resulting external message: x{89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C_}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

B5EE9C724101040100CB0001CF89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C010189627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944002010BF300000008A003001AC400000001000000000000000EE1F80CD3
(Saved to file wallet-query.boc)
```

现在我们通过轻客户端发送外部消息`wallet-query.boc`。

```
> sendfile wallet-query.boc
....
external message status is 1
```

等待一段时间后，我们可以检查我们钱包的传入消息以检查来自配置智能合约的响应消息，

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 list_proposals
...
arguments:  [ 107394 ] 
result:  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
remote result (not to be trusted):  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
... caching cell FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC
```

我们可以看到，在所有活动配置建议列表中，正好有一个条目是由配对代表的。

```
[6465...6321 [1586779536 0 [8 C{FDCD...} -1] 1124...2998 () 8646...209 3 0 0]]
```

第一个数字 `6465...6321` 是配置建议的唯一标识符，等于其 256 位散列值。这对数字的第二个部分是一个元组，用于描述该配置建议的状态。元组的第一个分量是配置建议的 Unix 到期时间（`1586779546`）。第二个分量（`0`）是临界标志。接下来是配置建议本身，由三元组 `[8 C{FDCD...} -1]` 描述，其中 `8` 是要修改的配置参数的索引，`C{FDCD...}` 是包含新值的 cell （由该 cell 的哈希值表示），`-1` 是该参数旧值的可选哈希值（`-1` 表示未指定该哈希值）。接下来我们会看到一个大数字`1124...2998`，代表当前验证者集的标识符，然后是一个空列表`()`，代表迄今为止为该提案投过票的所有当前活跃验证者集，然后是`weight_remaining`，等于`8646...209`--如果该提案在这一轮还没有收集到足够的验证者票数，这个数字就是正数，否则就是负数。然后我们看到三个数字：`3 0 0`.这些数字分别是 `rounds_remaining` （该提案最多能存活三轮，即当前验证者集的变化）、 `wins`（该提案收集到的验证者票数超过所有验证者权重的 3/4 的轮数）和 `losses`（该提案未能收集到所有验证者票数的 3/4 的轮数）。

第一个数字`6465..6321`是配置提案的唯一标识符，等于其256位哈希。这对的第二个组成部分是一个元组，描述了此配置提案的状态。此元组的第一个组成部分是配置提案的过期Unix时间（`1586779546`）。第二个组成部分（`0`）是关键性标志。接下来是配置提案本身，由三元组`[8 C{FDCD...} -1]`描述，其中`8`是要修改的配置参数索引，`C{FDCD...}`是带有新值的cell（由此cell的哈希表示），`-1`是此参数旧值的可选哈希（`-1`表示未指定此哈希）。接下来我们看到一个大数字`1124...2998`，表示当前验证者集的标识符，然后是一个空列表`()`，表示到目前为止已经投票支持此提案的所有当前活跃验证者的集合，然后是`weight_remaining`等于`8646...209` - 一个正数，如果提案在本轮中还没有收集到足够的验证者投票，则为负数。然后我们看到三个数字：`3 0 0`。这些数字分别是`rounds_remaining`（此提案最多在三轮中存活，即，当前验证者集更换次数），`wins`（提案在一轮中收集到超过3/4所有验证者的投票次数）和`losses`（提案未能在一轮中收集到3/4所有验证者的投票次数）。

```
> dumpcell FDC
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
```

我们看到该值为 `x{C400000001000000000000000E}`，这确实是我们嵌入到配置建议中的值。我们甚至可以要求精简版客户端将 Cell 显示为 TL-B 类型的值（`ConfigParam 8`）。

```
> dumpcellas ConfigParam8 FDC
dumping cells as values of TLB type (ConfigParam 8)
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
(
    (capabilities version:1 capabilities:14))
```

当我们考虑其他人创建的配置建议时，这一点尤其有用。

当我们考虑由其他人创建的配置提案时，这特别有用。

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0] ] 
```

我们得到了与之前基本相同的结果，但只针对一个配置方案，而且在开始时没有配置方案的标识符。

## 4.对配置提案进行表决

一旦创建了一个配置提案，它就应该在当前一轮以及随后的几轮（选出的验证者集）中获得当前所有验证者中 3/4 以上的投票（按权重，即按质押）。这样，更改配置参数的决定不仅必须获得当前验证者组的绝大多数同意，还必须获得随后几组验证者的绝大多数同意。

一旦创建了配置提案，它就应该在当前轮次中收集到超过3/4的当前验证者（按权重，即按股权）的投票，可能还要在几个后续轮次（选举的验证者集）中。通过这种方式，更改配置参数的决定必须得到不仅是当前验证者集，而且是几个后续验证者集的显著多数的批准。

- 一个验证器的操作员会查找 "val-idx"，即其验证器在当前验证器集合中的索引（基于 0），该索引存储在配置参数 "#34 "中。
- 操作符会调用源代码树中目录 `crypto/smartcont` 中的特殊 Fift 脚本 `config-proposal-vote-req.fif` ，并将 `val-idx` 和 `config-proposal-id` 作为参数：

```
    $ fift -s config-proposal-vote-req.fif -i 0 64654898543692093106630260209820256598623953458404398631153796624848083036321
    Creating a request to vote for configuration proposal 0x8ef1603180dad5b599fa854806991a7aa9f280dbdb81d67ce1bedff9d66128a1 on behalf of validator with index 0 
    566F744500008EF1603180DAD5B599FA854806991A7AA9F280DBDB81D67CE1BEDFF9D66128A1
    Vm90RQAAjvFgMYDa1bWZ-oVIBpkaeqnygNvbgdZ84b7f-dZhKKE=
    Saved to file validator-to-sign.req
```

- 之后，投票请求必须由当前验证器的私钥签名，使用与验证器连接的`validator-engine-console`中的`sign<validator-key-id> 566F744...28A1`。这一过程与 [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) 中描述的参与验证器选举的过程类似，但这次必须使用当前激活的密钥。
- 接下来，需要调用另一个脚本 `config-proposal-signed.fif`。它的参数与 `config-proposal-req.fif` 类似，但它需要两个额外的参数：用于签署投票请求的公钥的 base64 表示和签名本身的 base64 表示。同样，这与 [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) 中描述的过程非常相似。
- 这样，就创建了包含内部信息正文的`vote-msg-body.boc`文件，其中包含对该配置提案的签名投票。
- 之后，`vote-msg-body.boc` 必须从驻留在主链上的任何智能合约（通常，将使用验证者的控制智能合约）的内部消息中携带，以及少量的 Toncoin 用于处理（通常，1.5  Toncoin 就足够了）。这与验证器选举过程中使用的程序完全类似。这通常是通过运行来实现的：

```
$ fift -s wallet.fif my_wallet_id -1:5555555555555555555555555555555555555555555555555555555555555555 1 1.5 -B vote-msg-body.boc
```

(如果使用简单钱包来控制验证器），然后从精简版客户端发送生成的文件 `wallet-query.boc`：

```
> sendfile wallet-query.boc
```

您可以监控从配置智能合约到控制智能合约的应答消息，以了解投票查询的状态。另外，您还可以通过配置智能合约的 get-method `show_proposal` 来查看配置建议的状态：

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 (0) 864691128455135209 3 0 0] ]
```

这一次，对该配置建议投过票的验证器索引列表应该是非空的，而且应该包含你的验证器索引。在本例中，该列表为 (`0`)，这意味着只有配置参数 `#34` 中索引为`0`的验证器投了票。如果列表足够大，提案状态中最后一个零的整数（`3 0 0` 中的第一个零）就会增加一个，表示该提案又赢了一次。如果获胜次数大于或等于配置参数 `#11` 中指示的值，则配置提案会被自动接受，提议的更改会立即生效。另一方面，当验证程序集发生变化时，已投票的验证程序列表将变为空，"轮数_剩余"（"3 0 0 "中的3）的值将减1，如果该值变为负数，配置建议将被销毁。如果配置提案没有被销毁，也没有在这一轮中获胜，那么 "失败次数"（"3 0 0 "中的第二个 0）就会增加。如果它大于配置参数 `#11` 中指定的值，那么配置方案就会被丢弃。  因此，所有在某一轮中未投票的验证者都默认投了反对票。

## 5.对配置提案进行表决的自动方式

与 `validator-engine-console` 的 `createelectionbid` 命令提供的参与验证选举的自动化类似，`validator-engine` 和 `validator-engine-console` 提供了一种自动化的方法来执行上一节中解释的大部分步骤，生成一个 `vote-msg-body.boc` 以供控制钱包使用。为了使用这种方法，你必须将 Fift 脚本 `config-proposal-vote-req.fif` 和 `config-proposal-vote-signed.fif` 安装到验证引擎用来查找 `validator-elect-req.fif` 和 `validator-elect-signed.fif` 的同一目录下（如 [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) 第 5 节所解释）。之后，只需运行

```
    createproposalvote 64654898543692093106630260209820256598623953458404398631153796624848083036321 vote-msg-body.boc
```

在 validator-engine-console 中创建包含内部信息正文的 `vote-msg-body.boc` 以发送给配置智能合约。

## 6.升级配置智能合约和选举人智能合约的代码

配置智能合约本身的代码或选举人智能合约的代码可能需要升级。为此，将采用与上述相同的机制。新代码将被存储在一个值 cell 的唯一引用中，该值 cell 将被提议作为配置参数"-1000"（用于升级配置智能合约）或"-1001"（用于升级电子智能合约）的新值。这些参数自称是关键参数，因此需要大量验证者投票才能更改配置智能合约（这类似于通过一部新宪法）。我们预计，此类变更将首先在测试网络中进行测试，并在公共论坛上讨论拟议的变更，然后由每个验证者操作员决定投票赞成或反对拟议的变更。

可能会发生配置智能合约本身或选举智能合约的代码需要升级的情况。为此，使用上述相同的机制。新代码需存储在值cell的唯一引用中，并且这个值cell必须被提议作为配置参数 `-1000`（用于升级配置智能合约）或 `-1001`（用于升级选举智能合约）的新值。这些参数被视为关键，因此需要很多验证者的票来更改配置智能合约（这类似于采纳新宪法）。我们期望这样的更改首先在测试网中进行测试，并在每个验证者操作员决定投票赞成或反对所提议的更改之前，在公共论坛中讨论所提议的更改。

或者，关键配置参数 `0`（配置智能合约的地址）或 `1`（选举智能合约的地址）可以更改为其他值，这些值必须对应于已经存在且正确初始化的智能合约。特别是，新的配置智能合约必须在其持久数据的第一个引用中包含一个有效的配置字典。由于正确转移更改数据（例如活跃配置提案的列表，或验证者选举的前后参与者列表）在不同的智能合约之间并不容易，所以在多数情况下，升级现有智能合约的代码而不是更改配置智能合约地址更为合适。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/configs/network-configs.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/configs/network-configs.md
================================================
# 网络配置

在本页面上，您可以找到TON区块链的活跃网络配置：

- 主网：https://ton.org/global-config.json
- 测试网：https://ton.org/testnet-global.config.json

## 参阅

- [节点类型](https://docs.ton.org/participate/nodes/node-types)
- [区块链参数配置](/develop/howto/blockchain-configs)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/adnl-tcp.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/adnl-tcp.md
================================================
# ADNL TCP - 轻服务器

这是构建TON网络中所有交互的底层协议，它可以在任何协议之上运行，但最常用于TCP和UDP之上。UDP用于节点间通信，而TCP用于与轻服务器的通信。

现在我们将分析基于TCP的ADNL，并学习如何直接与轻服务器进行交互。

在ADNL的TCP版本中，网络节点使用ed25519公钥作为地址，并使用通过椭圆曲线Diffie-Hellman过程 - ECDH获得的共享密钥建立连接。

## 数据包结构

除握手外，每个ADNL TCP数据包具有以下结构：

- 小端模式下的4字节标签大小 (N)
- 32字节随机数 [[?]](## "随机字节用于防止校验和攻击")
- (N - 64) 字节的有效载荷
- 32字节SHA256校验和，来自随机数和有效载荷

整个数据包，包括大小，均为**AES-CTR**加密。解密后，需要检查校验和是否与数据匹配，要检查，只需自己计算校验和并将结果与我们在数据包中拥有的进行比较。

握手数据包是一个例外，它以部分未加密的形式传输，并在下一章中描述。

## 建立连接

要建立连接，我们需要知道服务器的ip、端口和公钥，并生成自己的ed25519私钥和公钥。

服务器的公共数据如ip、端口和密钥可以从[全局配置](https://ton-blockchain.github.io/global.config.json)中获得。配置中的IP以数字形式出现，可以使用例如[此工具](https://www.browserling.com/tools/dec-to-ip)转换为常规形式。配置中的公钥为base64格式。

客户端生成160个随机字节，其中一些将被双方用作AES加密的基础。

由此，创建了2个永久的AES-CTR密码，握手后将被双方用来加密/解密消息。

- 密码A - 密钥为0 - 31字节，iv为64 - 79字节
- 密码B - 密钥为32 - 63字节，iv为80 - 95字节

密码应用的顺序如下：

- 服务器使用密码A加密它发送的消息。
- 客户端使用密码A解密收到的消息。
- 客户端使用密码B加密它发送的消息。
- 服务器使用密码B解密收到的消息。

要建立连接，客户端必须发送一个包含以下内容的握手数据包：

- [32字节] **服务器密钥ID** [[详情]](#获取密钥ID)
- [32字节] **我们的ed25519公钥**
- [32字节] **我们160字节的SHA256哈希**
- [160字节] **我们加密的160字节** [[详情]](#handshake-packet-data-encryption)

收到握手数据包后，服务器将执行相同的操作，接收ECDH密钥，解密160字节并创建2个永久密钥。如果一切顺利，服务器将用一个没有有效载荷的空ADNL数据包作为回应，为了解密该数据包（以及后续的数据包），我们需要使用其中一个永久密码。

从这一点开始，连接可以被视为已建立。

在建立了连接后，我们可以开始接收信息；TL语言用于序列化数据。

[更多关于TL的信息](/develop/data-formats/tl)

## Ping&Pong

最佳做法是每5秒发送一次ping数据包。这是在没有数据传输时保持连接的必要条件，否则服务器可能终止连接。

ping数据包与其他所有数据包一样，根据[上文](#packet-structure)描述的标准模式构建，并作为有效载荷携带请求ID和ping ID。

让我们找到ping请求的所需模式[此处](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L35)，并计算模式id为
`crc32_IEEE("tcp.ping random_id:long = tcp.Pong")`。转换为小端模式字节后，我们得到**9a2b084d**。

因此，我们的ADNL ping数据包将如下所示：

- 小端模式下的4字节标签大小 -> 64 + (4+8) = **76**
- 32字节随机数 -> 随机的32字节
- 4字节的ID TL模式 -> **9a2b084d**
- 8字节的请求id -> 随机的uint64数字
- 32字节的SHA256校验和，来自随机数和有效载荷

我们发送我们的数据包并等待[tcp.pong](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L23)，`random_id`将与我们在ping数据包中发送的相同。

## 从轻服务器接收信息

旨在从区块链获取信息的所有请求都包裹在[Liteserver Query](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L83)模式中，该模式又被包裹在[ADNL Query](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L22)模式中。

LiteQuery:
`liteServer.query data:bytes = Object`, id **df068c79**

ADNLQuery:
`adnl.message.query query_id:int256 query:bytes = adnl.Message`, id **7af98bb4**

LiteQuery作为`query:bytes`传递给ADNLQuery内部，最终查询作为`data:bytes`传递给LiteQuery内部。

[解析TL中的编码字节](/develop/data-formats/tl)

### getMasterchainInfo

现在，由于我们已经知道如何为Lite API生成TL数据包，我们可以请求有关当前TON masterchain块的信息。
masterchain区块在许多后续请求中用作输入参数，以指示我们需要信息的状态（时刻）。

我们正在寻找[我们需要的TL模式](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L60)，计算其ID并构建数据包：

- 小端模式下的4字节标签大小 -> 64 + (4+32+(1+4+(1+4+3)+3)) = **116**
- 32字节随机数 -> 随机的32字节
- 4字节的ID ADNLQuery模式 -> **7af98bb4**
- 32字节`query_id:int256` -> 随机的32字节
  - 1 字节数组大小 -> **12**
  - ID LiteQuery 模式的 4 个字节 -> **df068c79**
    - 1 字节数组大小 -> **4**
    - 4 个字节的 ID getMasterchainInfo 模式 -> **2ee6b589**
    - 3 个零字节填充（对齐至 8）
  - 3 个零字节填充（对齐至 16）
- 32 个字节的校验和 SHA256，来自 nonce 和 payload

数据包示例（十六进制）:

```
74000000                                                             -> packet size (116)
5fb13e11977cb5cff0fbf7f23f674d734cb7c4bf01322c5e6b928c5d8ea09cfd     -> nonce
  7af98bb4                                                           -> ADNLQuery
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4   -> query_id
    0c                                                               -> array size
    df068c79                                                         -> LiteQuery
      04                                                             -> array size
      2ee6b589                                                       -> getMasterchainInfo
      000000                                                         -> 3 bytes of padding
    000000                                                           -> 3 bytes of padding
ac2253594c86bd308ed631d57a63db4ab21279e9382e416128b58ee95897e164     -> sha256
```

我们预期收到的响应为[liteServer.masterchainInfo](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L30)，包括last:[ton.blockIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/tonlib_api.tl#L51) state_root_hash:int256 和 init:[tonNode.zeroStateIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L359)。

收到的数据包与发送的数据包同样方式进行反序列化 - 具有相同算法，但方向相反，除了响应仅被[ADNLAnswer](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L23)包裹。

解码响应后，我们得到如下形式的数据包：

```
20010000                                                                  -> packet size (288)
5558b3227092e39782bd4ff9ef74bee875ab2b0661cf17efdfcd4da4e53e78e6          -> nonce
  1684ac0f                                                                -> ADNLAnswer
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4        -> query_id (identical to request)
    b8                                                                    -> array size
    81288385                                                              -> liteServer.masterchainInfo
                                                                          last:tonNode.blockIdExt
        ffffffff                                                          -> workchain:int
        0000000000000080                                                  -> shard:long
        27405801                                                          -> seqno:int   
        e585a47bd5978f6a4fb2b56aa2082ec9deac33aaae19e78241b97522e1fb43d4  -> root_hash:int256
        876851b60521311853f59c002d46b0bd80054af4bce340787a00bd04e0123517  -> file_hash:int256
      8b4d3b38b06bb484015faf9821c3ba1c609a25b74f30e1e585b8c8e820ef0976    -> state_root_hash:int256
                                                                          init:tonNode.zeroStateIdExt 
        ffffffff                                                          -> workchain:int
        17a3a92992aabea785a7a090985a265cd31f323d849da51239737e321fb05569  -> root_hash:int256      
        5e994fcf4d425c0a6ce6a792594b7173205f740a39cd56f537defd28b48a0f6e  -> file_hash:int256
    000000                                                                -> 3 bytes of padding
520c46d1ea4daccdf27ae21750ff4982d59a30672b3ce8674195e8a23e270d21          -> sha256
```

### runSmcMethod

我们已经知道如何获取masterchain区块，所以现在我们可以调用任何轻服务器方法。
让我们分析**runSmcMethod** - 这是一个调用智能合约中的函数并返回结果的方法。在这里，我们需要了解一些新的数据类型，如[TL-B](/develop/data-formats/tl-b)、[Cell](/develop/data-formats/cell-boc#cell)和[BoC](/develop/data-formats/cell-boc#bag-of-cells)。

要执行智能合约方法，我们需要构建并发送使用TL模式的请求：

```tlb
liteServer.runSmcMethod mode:# id:tonNode.blockIdExt account:liteServer.accountId method_id:long params:bytes = liteServer.RunMethodResult
```

并等待带有模式的响应：

```tlb
liteServer.runMethodResult mode:# id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:mode.0?bytes proof:mode.0?bytes state_proof:mode.1?bytes init_c7:mode.3?bytes lib_extras:mode.4?bytes exit_code:int result:mode.2?bytes = liteServer.RunMethodResult;
```

在请求中，我们看到以下字段：

1. mode:# - uint32位掩码，指示我们希望在响应中看到的内容，例如，`result:mode.2?bytes`只有在索引为2的位设置为一时才会出现在响应中。
2. id:tonNode.blockIdExt - 我们在前一章中获得的主区块状态。
3. account:[liteServer.accountId](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L27) - 工作链和智能合约地址数据。
4. method_id:long - 8字节，其中写入了调用方法名称的crc16与XMODEM表+设置了第17位 [[计算]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16)
5. params:bytes - [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783)以[BoC](/develop/data-formats/cell-boc#bag-of-cells)序列化，其中包含调用方法的参数。[[实现示例]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/tlb/stack.go)

例如，我们只需要`result:mode.2?bytes`，那么我们的 mode 将等于0b100，即4。在响应中，我们将获得：

1. mode:# -> 发送的内容 - 4。
2. id:tonNode.blockIdExt -> 我们的主区块，针对该区块执行了方法
3. shardblk:tonNode.blockIdExt -> 托管合约账户的分片区块
4. exit_code:int -> 4字节，是执行方法时的退出代码。如果一切顺利，则为0，如果不是，则等于异常代码。
5. result:mode.2?bytes -> [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783)以[BoC](/develop/data-formats/cell-boc#bag-of-cells)序列化，其中包含方法返回的值。

让我们分析调用合约`EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4`的`a2`方法并获取结果：

FunC中的方法代码：

```func
(cell, cell) a2() method_id {
  cell a = begin_cell().store_uint(0xAABBCC8, 32).end_cell();
  cell b = begin_cell().store_uint(0xCCFFCC1, 32).end_cell();
  return (a, b);
}
```

填写我们的请求：

- `mode` = 4，我们只需要结果 -> `04000000`
- `id` = 执行getMasterchainInfo的结果
- `account` = 工作链 0 (4字节 `00000000`)，和int256 [从我们的合约地址获得](/develop/data-formats/tl-b#addresses)，即32字节 `4bdbfde5322cb2c14d7b83ea2bf0deeff610e63c2a6db7304f1368ac176193ce`
- `method_id` = 从`a2`[计算](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16)得出的id -> `0a2e010000000000`
- `params:bytes` = 我们的方法不接受输入参数，因此我们需要传递一个空栈（`000000`，cell3字节 - 栈深度0）以[BoC](/develop/data-formats/cell-boc#bag-of-cells)序列化 -> `b5ee9c72010101010005000006000000` -> 序列化为字节并得到 `10b5ee9c72410101010005000006000000000000` 0x10 - 大小，在末尾的 3 字节是填充。

我们得到的响应是：

- `mode:#` -> 不感兴趣
- `id:tonNode.blockIdExt` -> 不感兴趣
- `shardblk:tonNode.blockIdExt` -> 不感兴趣
- `exit_code:int` -> 如果执行成功则为0
- `result:mode.2?bytes` -> [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783)包含方法返回的数据，以[BoC](/develop/data-formats/cell-boc#bag-of-cells)格式提供，我们将对其进行解包。

在`result`中我们收到`b5ee9c7201010501001b000208000002030102020203030400080ccffcc1000000080aabbcc8`，这是包含数据的[BoC](/develop/data-formats/cell-boc#bag-of-cells)。当我们反序列化它时，我们得到一个cell：

```json
32[00000203] -> {
  8[03] -> {
    0[],
    32[0AABBCC8]
  },
  32[0CCFFCC1]
}
```

如果我们解析它，我们将得到2个cell类型的值，这是我们的FunC方法返回的。根cell的前3字节`000002` - 是栈的深度，即2。这意味着该方法返回了2个值。

我们继续解析，接下来的8位（1字节）是当前堆栈级别的值类型。对于某些类型，它可能需要2个字节。可能的选项可以在[schema](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L766)中看到。
在我们的案例中，我们有`03`，这意味着：

```tlb
vm_stk_cell#03 cell:^Cell = VmStackValue;
```

所以我们的值类型是 - cell，并且根据模式，它将值本身作为引用存储。但是，如果我们看看栈元素存储模式：

```tlb
vm_stk_cons#_ {n:#} rest:^(VmStackList n) tos:VmStackValue = VmStackList (n + 1);
```

我们将看到第一个链接`rest:^(VmStackList n)` - 是栈中下一个值的cell，而我们的值`tos:VmStackValue`排在第二位，所以要获得我们需要的值，我们需要读取第二个链接，即`32[0CCFFCC1]` - 这是合约返回的第一个cell。

现在我们可以深入并获取栈中的第二个元素，我们通过第一个链接，现在我们有：

```json
8[03] -> {
    0[],
    32[0AABBCC8]
  }
```

我们重复相同的过程。第一个8位 = `03` - 即又是一个cell。第二个引用是值`32[0AABBCC8]`，由于我们的栈深度为2，我们完成了遍历。总体上，我们有2个值由合约返回 - `32[0CCFFCC1]`和`32[0AABBCC8]`。

请注意，它们的顺序是相反的。调用函数时也需要以相反的顺序传递参数，与我们在FunC代码中看到的顺序相反。

[实现示例](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/ton/runmethod.go#L24)

### getAccountState

要获取账户状态数据，如余额、代码和合约数据，我们可以使用[getAccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L68)。请求需要一个[最新的主链块](#getmasterchaininfo)和账户地址。响应中，我们将接收到TL结构[AccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L38)。

让我们分析AccountState TL模式：

```tlb
liteServer.accountState id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:bytes proof:bytes state:bytes = liteServer.AccountState;
```

1. `id` - 我们的主链区块，我们从中获取了数据。
2. `shardblk` - 我们账户所在的工作链分片区块，我们从中接收数据。
3. `shard_proof` - 分片区块的Merkle证明。
4. `proof` - 账户状态的Merkle证明。
5. `state` - [BoC](/develop/data-formats/cell-boc#bag-of-cells) TL-B [账户状态模式](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L232)。

我们需要的所有数据都在state中，我们将对其进行分析。

例如，让我们获取账户`EQAhE3sLxHZpsyZ_HecMuwzvXHKLjYx4kEUehhOy2JmCcHCT`的状态，响应中的`state`将是（撰写本文时）：

```hex
b5ee9c720102350100051e000277c0021137b0bc47669b3267f1de70cbb0cef5c728b8d8c7890451e8613b2d899827026a886043179d3f6000006e233be8722201d7d239dba7d818134001020114ff00f4a413f4bcf2c80b0d021d0000000105036248628d00000000e003040201cb05060013a03128bb16000000002002012007080043d218d748bc4d4f4ff93481fd41c39945d5587b8e2aa2d8a35eaf99eee92d9ba96004020120090a0201200b0c00432c915453c736b7692b5b4c76f3a90e6aeec7a02de9876c8a5eee589c104723a18020004307776cd691fbe13e891ed6dbd15461c098b1b95c822af605be8dc331e7d45571002000433817dc8de305734b0c8a3ad05264e9765a04a39dbe03dd9973aa612a61f766d7c02000431f8c67147ceba1700d3503e54c0820f965f4f82e5210e9a3224a776c8f3fad1840200201200e0f020148101104daf220c7008e8330db3ce08308d71820f90101d307db3c22c00013a1537178f40e6fa1f29fdb3c541abaf910f2a006f40420f90101d31f5118baf2aad33f705301f00a01c20801830abcb1f26853158040f40e6fa120980ea420c20af2670edff823aa1f5340b9f2615423a3534e2a2d2b2c0202cc12130201201819020120141502016616170003d1840223f2980bc7a0737d0986d9e52ed9e013c7a21c2b2f002d00a908b5d244a824c8b5d2a5c0b5007404fc02ba1b04a0004f085ba44c78081ba44c3800740835d2b0c026b500bc02f21633c5b332781c75c8f20073c5bd0032600201201a1b02012020210115bbed96d5034705520db3c8340201481c1d0201201e1f0173b11d7420c235c6083e404074c1e08075313b50f614c81e3d039be87ca7f5c2ffd78c7e443ca82b807d01085ba4d6dc4cb83e405636cf0069006031003daeda80e800e800fa02017a0211fc8080fc80dd794ff805e47a0000e78b64c00015ae19574100d56676a1ec40020120222302014824250151b7255b678626466a4610081e81cdf431c24d845a4000331a61e62e005ae0261c0b6fee1c0b77746e102d0185b5599b6786abe06fedb1c68a2270081e8f8df4a411c4605a400031c34410021ae424bae064f613990039e2ca840090081e886052261c52261c52265c4036625ccd88302d02012026270203993828290111ac1a6d9e2f81b609402d0015adf94100cc9576a1ec1840010da936cf0557c1602d0015addc2ce0806ab33b50f6200220db3c02f265f8005043714313db3ced542d34000ad3ffd3073004a0db3c2fae5320b0f26212b102a425b3531cb9b0258100e1aa23a028bcb0f269820186a0f8010597021110023e3e308e8d11101fdb3c40d778f44310bd05e254165b5473e7561053dcdb3c54710a547abc2e2f32300020ed44d0d31fd307d307d33ff404f404d10048018e1a30d20001f2a3d307d3075003d70120f90105f90115baf2a45003e06c2170542013000c01c8cbffcb0704d6db3ced54f80f70256e5389beb198106e102d50c75f078f1b30542403504ddb3c5055a046501049103a4b0953b9db3c5054167fe2f800078325a18e2c268040f4966fa52094305303b9de208e1638393908d2000197d3073016f007059130e27f080705926c31e2b3e63006343132330060708e2903d08308d718d307f40430531678f40e6fa1f2a5d70bff544544f910f2a6ae5220b15203bd14a1236ee66c2232007e5230be8e205f03f8009322d74a9802d307d402fb0002e83270c8ca0040148040f44302f0078e1771c8cb0014cb0712cb0758cf0158cf1640138040f44301e201208e8a104510344300db3ced54925f06e234001cc8cb1fcb07cb07cb3ff400f400c9
```

[解析此BoC](/develop/data-formats/cell-boc#bag-of-cells)并获取

<details>
  <summary>large cell</summary>

```json
473[C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_] -> {
  80[FF00F4A413F4BCF2C80B] -> {
    2[0_] -> {
      4[4_] -> {
        8[CC] -> {
          2[0_] -> {
            13[D180],
            141[F2980BC7A0737D0986D9E52ED9E013C7A218] -> {
              40[D3FFD30730],
              48[01C8CBFFCB07]
            }
          },
          6[64] -> {
            178[00A908B5D244A824C8B5D2A5C0B5007404FC02BA1B048_],
            314[085BA44C78081BA44C3800740835D2B0C026B500BC02F21633C5B332781C75C8F20073C5BD00324_]
          }
        },
        2[0_] -> {
          2[0_] -> {
            84[BBED96D5034705520DB3C_] -> {
              112[C8CB1FCB07CB07CB3FF400F400C9]
            },
            4[4_] -> {
              2[0_] -> {
                241[AEDA80E800E800FA02017A0211FC8080FC80DD794FF805E47A0000E78B648_],
                81[AE19574100D56676A1EC0_]
              },
              458[B11D7420C235C6083E404074C1E08075313B50F614C81E3D039BE87CA7F5C2FFD78C7E443CA82B807D01085BA4D6DC4CB83E405636CF0069004_] -> {
                384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232]
              }
            }
          },
          2[0_] -> {
            2[0_] -> {
              323[B7255B678626466A4610081E81CDF431C24D845A4000331A61E62E005AE0261C0B6FEE1C0B77746E0_] -> {
                128[ED44D0D31FD307D307D33FF404F404D1]
              },
              531[B5599B6786ABE06FEDB1C68A2270081E8F8DF4A411C4605A400031C34410021AE424BAE064F613990039E2CA840090081E886052261C52261C52265C4036625CCD882_] -> {
                128[ED44D0D31FD307D307D33FF404F404D1]
              }
            },
            4[4_] -> {
              2[0_] -> {
                65[AC1A6D9E2F81B6090_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                },
                81[ADF94100CC9576A1EC180_]
              },
              12[993_] -> {
                50[A936CF0557C14_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                },
                82[ADDC2CE0806AB33B50F60_]
              }
            }
          }
        }
      },
      872[F220C7008E8330DB3CE08308D71820F90101D307DB3C22C00013A1537178F40E6FA1F29FDB3C541ABAF910F2A006F40420F90101D31F5118BAF2AAD33F705301F00A01C20801830ABCB1F26853158040F40E6FA120980EA420C20AF2670EDFF823AA1F5340B9F2615423A3534E] -> {
        128[DB3C02F265F8005043714313DB3CED54] -> {
          128[ED44D0D31FD307D307D33FF404F404D1],
          112[C8CB1FCB07CB07CB3FF400F400C9]
        },
        128[ED44D0D31FD307D307D33FF404F404D1],
        40[D3FFD30730],
        640[DB3C2FAE5320B0F26212B102A425B3531CB9B0258100E1AA23A028BCB0F269820186A0F8010597021110023E3E308E8D11101FDB3C40D778F44310BD05E254165B5473E7561053DCDB3C54710A547ABC] -> {
          288[018E1A30D20001F2A3D307D3075003D70120F90105F90115BAF2A45003E06C2170542013],
          48[01C8CBFFCB07],
          504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
          856[DB3CED54F80F70256E5389BEB198106E102D50C75F078F1B30542403504DDB3C5055A046501049103A4B0953B9DB3C5054167FE2F800078325A18E2C268040F4966FA52094305303B9DE208E1638393908D2000197D3073016F007059130E27F080705926C31E2B3E63006] -> {
            112[C8CB1FCB07CB07CB3FF400F400C9],
            384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232],
            504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
            128[8E8A104510344300DB3CED54925F06E2] -> {
              112[C8CB1FCB07CB07CB3FF400F400C9]
            }
          }
        }
      }
    }
  },
  114[0000000105036248628D00000000C_] -> {
    7[CA] -> {
      2[0_] -> {
        2[0_] -> {
          266[2C915453C736B7692B5B4C76F3A90E6AEEC7A02DE9876C8A5EEE589C104723A1800_],
          266[07776CD691FBE13E891ED6DBD15461C098B1B95C822AF605BE8DC331E7D45571000_]
        },
        2[0_] -> {
          266[3817DC8DE305734B0C8A3AD05264E9765A04A39DBE03DD9973AA612A61F766D7C00_],
          266[1F8C67147CEBA1700D3503E54C0820F965F4F82E5210E9A3224A776C8F3FAD18400_]
        }
      },
      269[D218D748BC4D4F4FF93481FD41C39945D5587B8E2AA2D8A35EAF99EEE92D9BA96000]
    },
    74[A03128BB16000000000_]
  }
}
```

</details>

现在我们需要根据TL-B结构解析cell：

```tlb
account_none$0 = Account;

account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```

我们的结构引用了其他结构，例如：

```tlb
anycast_info$_ depth:(#<= 30) { depth >= 1 } rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
   
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
  
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;

currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
           
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8)) = VarInteger n;
nanograms$_ amount:(VarUInteger 16) = Grams;  
           
account_uninit$00 = AccountState;
account_active$1 _:StateInit = AccountState;
account_frozen$01 state_hash:bits256 = AccountState;
```

我们可以看到，cell包含很多数据，但我们将分析主要情况并获取余额。其余的可以以类似的方式进行分析。

让我们开始解析。在根cell数据中，我们有：

```
C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_
```

转换为二进制形式并获取：

```
11000000000000100001000100110111101100001011110001000111011001101001101100110010011001111111000111011110011100001100101110110000110011101111010111000111001010001011100011011000110001111000100100000100010100011110100001100001001110110010110110001001100110000010011100000010011010101000100001100000010000110001011110011101001111110110000000000000000000000110111000100011001110111110100001110010001000100000000111010111110100100011100111011011101001111101100000011000000100110
```

让我们看看我们的主要TL-B结构，我们看到我们有两个可能的选项 - `account_none$0`或`account$1`。我们可以通过读取符号$后声明的前缀来理解我们拥有哪个选项，在我们的例子中，它是1位。如果是0，则我们拥有`account_none`，如果是1，则`account`。

我们上面的数据中的第一个bit=1，所以我们正在处理`account$1`，将使用模式：

```tlb
account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```

接下来我们有`addr:MsgAddressInt`，我们看到MsgAddressInt也有几个选项：

```tlb
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```

要理解应该使用哪一个，我们像上次一样，读取前缀位，这次我们读取2个位。我们去掉已读的位，“1000000...”剩下，我们读取前2个位得到“10”，这意味着我们正在处理`addr_std$10`。

接下来我们需要解析`anycast:(Maybe Anycast)`，Maybe意味着我们应该读取1位，如果是1，则读取Anycast，否则跳过。我们剩余的位是“00000...”，读取1位，它是0，所以我们跳过Anycast。

接下来，我们有`workchain_id:int8`，这里很简单，我们读取8个位，这将是工作链ID。我们读取接下来的8个位，全部为零，所以工作链为0。

接下来，我们读取`address:bits256`，这是地址的256个位，与`workchain_id`一样。在读取时，我们得到`21137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D8998270`的十六进制表示。

我们读取了地址`addr:MsgAddressInt`，然后我们有`storage_stat:StorageInfo`来自主结构，它的模式是：

```tlb
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
```

首先是`used:StorageUsed`，它的模式是：

```tlb
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
```

这是用于存储账户数据的cell和位的数量。每个字段都定义为`VarUInteger 7`，这意味着动态大小的uint，但最多为7位。你可以根据模式了解它是如何排列的：

```tlb
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
```

在我们的案例中，n将等于7。在len中，我们将有`(#< 7)`，这意味着可以容纳最多7的数字的位数。你可以通过将7-1=6转换为二进制形式 - `110`，我们得到3个位，所以长度len = 3个位。而value是`(uint (len * 8))`。要确定它，我们需要读取3个位的长度，得到一个数字并乘以8，这将是`value`的大小，也就是需要读取的位数以获取VarUInteger的值。

读取`cells:(VarUInteger 7)`，取我们根cell的下一个位，看接下来的16个位以理解，这是`0010011010101000`。我们读取前3个位，这是`001`，即1，我们得到大小(uint (1 \* 8))，我们得到uint 8，我们读取8个位，它将是`cells`，`00110101`，即十进制中的53。对于 `bits` 和 `public_cells`，我们做同样的操作。

我们成功读取了`used:StorageUsed`，接下来我们有`last_paid:uint32`，我们读取32个位。`due_payment:(Maybe Grams)`在这里也很简单，Maybe将是0，所以我们跳过Grams。但是，如果Maybe是1，我们可以看看Grams的`amount:(VarUInteger 16) = Grams`模式并立即理解我们已经知道如何处理这个。像上次一样，只是我们有16而不是7。

接下来我们有`storage:AccountStorage`，它的模式是：

```tlb
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;
```

我们读取`last_trans_lt:uint64`，这是64个位，存储最后一次账户交易的lt。最后是余额，由模式表示：

```tlb
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

从这里我们将读取`grams:Grams`，这将是以 nanotones 计的账户余额。
`grams:Grams`是`VarUInteger 16`，要存储16（二进制形式`10000`，减去1得到`1111`），那么我们读取前4个位，并将得到的值乘以8，然后读取接收到的位数，它是我们的余额。

让我们根据我们的数据分析剩余的位：

```
100000000111010111110100100011100111011011101001111101100000011000000100110
```

读取前4个位 - `1000`，这是8。8\*8=64，读取接下来的64个位 = `0000011101011111010010001110011101101110100111110110000001100000`，去掉额外的零位，我们得到`11101011111010010001110011101101110100111110110000001100000`，即等于`531223439883591776`，将 nano 转换为TON，我们得到`531223439.883591776`。

我们将在这里停止，因为我们已经分析了所有主要情况，其余的可以以与我们已分析的类似的方式获得。此外，关于解析TL-B的更多信息可以在[官方文档](/develop/data-formats/tl-b-language)中找到。

### 其他方法

现在，学习了所有信息，您也可以调用并处理其他轻服务器方法的响应。同样的原理 :)

## 握手的其他技术细节

### 获取密钥ID

密钥ID是序列化TL模式的SHA256哈希。

最常用的TL模式密钥是：

```tlb
pub.ed25519 key:int256 = PublicKey -- ID c6b41348
pub.aes key:int256 = PublicKey     -- ID d4adbc2d
pub.overlay name:bytes = PublicKey -- ID cb45ba34
pub.unenc data:bytes = PublicKey   -- ID 0a451fb6
pk.aes key:int256 = PrivateKey     -- ID 3751e8a5
```

例如，对于握手中使用的ED25519类型密钥，密钥ID将是
**[0xC6, 0xB4, 0x13, 0x48]** 和 **公钥**的SHA256哈希（36字节数组，前缀+密钥）

[代码示例](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L16)

### 握手数据包数据加密

握手数据包以半开放形式发送，只有160字节被加密，包含有关永久密码的信息。

要加密它们，我们需要一个AES-CTR密码，我们需要160字节的SHA256哈希和[ECDH共享密钥](#使用ECDH获取共享密钥)

密码构建如下：

- key = （公钥的0 - 15字节）+（哈希的16 - 31字节）
- iv = （哈希的0 - 3字节）+（公钥的20 - 31字节）

密码组装后，我们用它加密我们的160字节。

[代码示例](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/connection.go#L361)

### 使用ECDH获取共享密钥

要计算共享密钥，我们需要我们的私钥和服务器的公钥。

DH的本质是获取共享的密钥，而不暴露私人信息。我将给出一个这是如何发生的示例，以最简化的形式。假设我们需要生成我们和服务器之间的共享密钥，过程将如下：

1. 我们生成secret和公共数字，如**6**和**7**
2. 服务器生成secret和公共数字，如**5**和**15**
3. 我们与服务器交换公共数字，发送**7**给服务器，它发送给我们**15**。
4. 我们计算：**7^6 mod 15 = 4**
5. 服务器计算：**7^5 mod 15 = 7**
6. 我们交换收到的数字，我们给服务器**4**，它给我们**7**
7. 我们计算**7^6 mod 15 = 4**
8. 服务器计算：**4^5 mod 15 = 4**
9. 共享密钥 = **4**

为了简洁起见，将省略ECDH本身的细节。它是通过在曲线上找到一个共同点，使用两个密钥，私钥和公钥来计算的。如果感兴趣，最好单独阅读。

[代码示例](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L32)

## 参考资料

*这里是[Oleg Baranov](https://github.com/xssnick)撰写的原始文章的[链接](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-TCP-Liteserver.md)。*



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/adnl-udp.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/adnl-udp.md
================================================
# ADNL UDP - 节点间通信

ADNL通过UDP用于节点和TON组件之间的通信。它是一个低层级协议，其他更高级的TON协议（如DHT和RLDP）都是在其基础上运行的。在这篇文章中，我们将了解ADNL通过UDP在节点之间进行基本通信的工作方式。

与ADNL通过TCP不同，在UDP实现中，握手以不同的形式发生，并且使用了通道的额外层，但其他原则相似：
基于我们的私钥和预先从配置或从其他网络节点收到的对方的公钥生成加密密钥。

在ADNL的UDP版本中，连接是在从对方接收初始数据的同时建立的，如果发起方发送了'创建通道'消息，通道的密钥将被计算，并将确认通道的创建。建立通道后，进一步的通信将继续在通道内进行。

## 数据包结构和通信

### 首个数据包

让我们分析与DHT节点建立连接并获取其签名地址列表的初始化，以便了解协议的工作方式。

在[全局配置](https://ton-blockchain.github.io/global.config.json)中找到您喜欢的节点，在`dht.nodes`部分。例如：

```json
{
  "@type": "dht.node",
  "id": {
    "@type": "pub.ed25519",
    "key": "fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk="
  },
  "addr_list": {
    "@type": "adnl.addressList",
    "addrs": [
      {
        "@type": "adnl.address.udp",
        "ip": 1091897261,
        "port": 15813
      }
    ],
    "version": 0,
    "reinit_date": 0,
    "priority": 0,
    "expire_at": 0
  },
  "version": -1,
  "signature": "cmaMrV/9wuaHOOyXYjoxBnckJktJqrQZ2i+YaY3ehIyiL3LkW81OQ91vm8zzsx1kwwadGZNzgq4hI4PCB/U5Dw=="
}
```

1. 我们取其ED25519密钥`fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk`，并从base64解码。
2. 取其IP地址`1091897261`，并使用[服务](https://www.browserling.com/tools/dec-to-ip)或转换为小端字节，得到`65.21.7.173`。
3. 与端口结合，得到`65.21.7.173:15813`并建立UDP连接。

我们想要打开一个通道与节点通信并获取一些信息，主要任务是接收其签名地址列表。为此，我们将生成2个消息，第一个是[创建通道](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L129)：

```tlb
adnl.message.createChannel key:int256 date:int = adnl.Message
```

这里有两个参数 - key和date。作为date，我们将指定当前的unix时间戳。对于key，我们需要为通道专门生成一个新的ED25519私钥+公钥对，它们将用于初始化[公共加密密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。我们将在消息的`key`参数中使用生成的公钥，并暂时保存私钥。

序列化填充的TL结构，得到：

```
bbc373e6                                                         -- TL ID adnl.message.createChannel 
d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7 -- key
555c8763                                                         -- date
```

接下来，我们转到我们的主要查询 - [获取地址列表](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L198)。为此，我们首先需要序列化其TL结构：

```tlb
dht.getSignedAddressList = dht.Node
```

它没有参数，因此我们只需序列化它。它将只是它的id - `ed4879a9`。

接下来，由于这是DHT协议更高级别的请求，我们需要首先将它包裹在`adnl.message.query` TL结构中：

```tlb
adnl.message.query query_id:int256 query:bytes = adnl.Message
```

作为`query_id`，我们生成随机的32字节，作为`query`，我们使用我们的主要请求，[包裹在字节数组中](/develop/data-formats/tl#encoding-bytes-array)。
我们将得到：

```
7af98bb4                                                         -- TL ID adnl.message.query
d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875 -- query_id
04 ed4879a9 000000                                               -- query
```

### 构建数据包

所有通信都是通过数据包进行的，其内容是[TL结构](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L81)：

```tlb
adnl.packetContents 
  rand1:bytes                                     -- random 7 or 15 bytes
  flags:#                                         -- bit flags, used to determine the presence of fields further
  from:flags.0?PublicKey                          -- sender's public key
  from_short:flags.1?adnl.id.short                -- sender's ID
  message:flags.2?adnl.Message                    -- message (used if there is only one message)
  messages:flags.3?(vector adnl.Message)          -- messages (if there are > 1)
  address:flags.4?adnl.addressList                -- list of our addresses
  priority_address:flags.5?adnl.addressList       -- priority list of our addresses
  seqno:flags.6?long                              -- packet sequence number
  confirm_seqno:flags.7?long                      -- sequence number of the last packet received
  recv_addr_list_version:flags.8?int              -- address version 
  recv_priority_addr_list_version:flags.9?int     -- priority address version
  reinit_date:flags.10?int                        -- connection reinitialization date (counter reset)
  dst_reinit_date:flags.10?int                    -- connection reinitialization date from the last received packet
  signature:flags.11?bytes                        -- signature
  rand2:bytes                                     -- random 7 or 15 bytes
        = adnl.PacketContents
        
```

一旦我们序列化了所有想要发送的消息，我们就可以开始构建数据包。发送到通道的数据包与初始化通道之前发送的数据包在内容上有所不同。首先，让我们分析用于初始化的主数据包。

在通道外的初始数据交换期间，数据包的序列化内容结构前缀为对方的公钥 - 32字节。我们的公钥为32字节，数据包内容结构的序列化TL的sha256哈希 - 32字节。数据包内容使用从我们的私钥和对方的公钥（不是通道的密钥）获得的[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)进行加密。

序列化我们的数据包内容结构，然后逐字节解析：

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d9050000                                                               -- flags (0x05d9) -> 0b0000010111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 messages   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID [adnl.message.query](/)
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

序列化后 - 我们需要使用我们之前生成并保存的私有客户端（不是通道的）ED25519密钥对结果字节数组进行签名。
生成签名（大小为64字节）后，我们需要将其添加到数据包中，再次序列化，但现在在标志位中添加第11位，表示存在签名：

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d90d0000                                                               -- flags (0x0dd9) -> 0b0000110111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 message   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 b453fbcbd8e884586b464290fe07475ee0da9df0b8d191e41e44f8f42a63a710    -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   341eefe8ffdc56de73db50a25989816dda17a4ac6c2f72f49804a97ff41df502    --
   000000                                                              --
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

现在我们有一个组装好的、签名的和序列化的数据包，它是一个字节数组。
为了让接收方随后验证其完整性，我们需要计算数据包的sha256哈希。例如，让这个哈希是`408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2`。

现在让我们使用AES-CTR密码对数据包内容进行加密，使用从我们的私钥和对方的公钥（不是通道的密钥）获得的[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。

我们几乎准备好发送了，只剩下计算ED25519对等密钥的[ID](/develop/network/adnl-tcp#getting-key-id)，并将所有内容连接在一起：

```
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb  -- server Key ID
afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6  -- our public key
408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2  -- sha256 content hash (before encryption)
...                                                               -- encrypted content of the packet
```

现在我们可以通过UDP发送我们构建的数据包，并等待响应。

作为响应，我们将收到具有类似结构的数据包，但消息不同。它将包括：

```
68426d4906bafbd5fe25baf9e0608cf24fffa7eca0aece70765d64f61f82f005  -- ID of our key
2d11e4a08031ad3778c5e060569645466e52bd1bd2c7b78ddd56def1cf3760c9  -- server public key, for shared key
f32fa6286d8ae61c0588b5a03873a220a3163cad2293a5dace5f03f06681e88a  -- sha256 content hash (before encryption)
...                                                               -- the encrypted content of the packet
```

从服务器的数据包的反序列化如下：

1. 我们检查数据包中的密钥ID，以了解该数据包是为我们准备的。
2. 使用数据包中的服务器公钥和我们的私钥，我们计算共享密钥并解密数据包内容
3. 比较我们收到的sha256哈希和从解密数据获得的哈希，它们必须匹配
4. 使用`adnl.packetContents` TL模式开始反序列化数据包内容

数据包内容将如下所示：

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 985558683d58c9847b4013ec93ea28                                      -- rand1, 15 (0f) random bytes
ca0d0000                                                               -- flags (0x0dca) -> 0b0000110111001010
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb       -- from_short (because flag's first bit = 1)
02000000                                                               -- messages (present because flag's third bit = 1)
   691ddd60                                                               -- TL ID adnl.message.confirmChannel 
   db19d5f297b2b0d76ef79be91ad3ae01d8d9f80fab8981d8ed0c9d67b92be4e3       -- key (server channel public key)
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7       -- peer_key (our public channel key)
   94848863                                                               -- date
   
   1684ac0f                                                               -- TL ID adnl.message.answer 
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875       -- query_id
   90 48325384c6b413487d99e4a08031ad3778c5e060569645466e52bd5bd2c7b       -- answer (the answer to our request, we will analyze its content in an article about DHT)
      78ddd56def1cf3760c901000000e7a60d67ad071541c53d0000ee354563ee       --
      35456300000000000000009484886340d46cc50450661a205ad47bacd318c       --
      65c8fd8e8f797a87884c1bad09a11c36669babb88f75eb83781c6957bc976       --
      6a234f65b9f6e7cc9b53500fbe2c44f3b3790f000000                        --
      000000                                                              --
0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0100000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
94848863                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
ee354563                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
94848863                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 5c26a2a05e584e9d20d11fb17538692137d1f7c0a1a3c97e609ee853ea9360ab6   -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   d84263630fe02dfd41efb5cd965ce6496ac57f0e51281ab0fdce06e809c7901     --
   000000                                                              --
0f c3354d35749ffd088411599101deb2                                      -- rand2, 15 (0f) random bytes
```

服务器用两条消息回应我们：`adnl.message.confirmChannel`和`adnl.message.answer`。
对于`adnl.message.answer`，一切都很简单，这是我们请求`dht.getSignedAddressList`的回答，我们将在关于DHT的文章中分析。

让我们关注`adnl.message.confirmChannel`，这意味着对方已确认创建通道并发送给我们其公共通道密钥。现在，有了我们的私有通道密钥和对方的公共通道密钥，我们可以计算[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。

现在我们计算出共享通道密钥后，我们需要从中生成2个密钥 - 一个用于加密发出的消息，另一个用于解密传入的消息。
从中生成2个密钥相当简单，第二个密钥等于共享密钥的倒序写法。例如：

```
Shared key : AABB2233

First key: AABB2233
Second key: 3322BBAA
```

剩下的就是确定哪个密钥用于什么，我们可以通过将我们的公共通道密钥的ID与服务器通道的公钥的ID比较，将它们转换为数值形式 - uint256。这种方法用于确保服务器和客户端都确定哪个密钥用于什么。如果服务器使用第一个密钥进行加密，那么使用这种方法，客户端将始终将其用于解密。

使用条款是：

```
The server id is smaller than our id:
Encryption: First Key
Decryption: Second Key

The server id is larger than our id:
Encryption: Second Key
Decryption: First Key

If the ids are equal (nearly impossible):
Encryption: First Key
Decryption: First Key
```

[[实现示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/adnl.go#L502)

### 通道内通信

所有后续的数据包交换将在通道内发生，通道密钥将用于加密。
让我们在新创建的通道内发送相同的`dht.getSignedAddressList`请求，看看区别。

让我们使用相同的`adnl.packetContents`结构为通道构建数据包：

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f c1fbe8c4ab8f8e733de83abac17915                                      -- rand1, 15 (0f) random bytes
c4000000                                                               -- flags (0x00c4) -> 0b0000000011000100
                                                                       -- message (because second bit = 1)
7af98bb4                                                                  -- TL ID adnl.message.query
fe3c0f39a89917b7f393533d1d06b605b673ffae8bbfab210150fe9d29083c35          -- query_id
04 ed4879a9 000000                                                        -- query (our dht.getSignedAddressList packed in bytes with padding 3)
0200000000000000                                                       -- seqno (because flag's sixth bit = 1), 2 because it is our second message
0100000000000000                                                       -- confirm_seqno (flag's seventh bit = 1), 1 because it is the last seqno received from the server
07 e4092842a8ae18                                                      -- rand2, 7 (07) random bytes
```

通道内的数据包非常简单，实质上由序列（seqno）和消息本身组成。

序列化后，像上次一样，我们计算数据包的sha256哈希。然后我们使用用于通道传出数据包的密钥加密数据包。[计算](/develop/network/adnl-tcp#getting-key-id)我们传出消息的加密密钥的`pub.aes` ID，并构建我们的数据包：

```
bcd1cf47b9e657200ba21d94b822052cf553a548f51f539423c8139a83162180 -- ID of encryption key of our outgoing messages 
6185385aeee5faae7992eb350f26ba253e8c7c5fa1e3e1879d9a0666b9bd6080 -- sha256 content hash (before encryption)
...                                                              -- the encrypted content of the packet
```

我们通过UDP发送数据包，并等待响应。作为回应，我们将收到与我们发送的同类型的数据包（相同字段），但带有我们请求`dht.getSignedAddressList`的回复。

## 其他消息类型

对于基本通信，使用像`adnl.message.query`和`adnl.message.answer`这样的消息，我们在上面讨论了，但对于某些情况，也使用其他类型的消息，我们将在本节中讨论。

### adnl.message.part

此消息类型是其他可能消息类型的一部分，例如`adnl.message.answer`。当消息太大而无法通过单个UDP数据报传输时，使用此传输数据的方法。

```tlb
adnl.message.part 
hash:int256            -- sha256 hash of the original message
total_size:int         -- original message size
offset:int             -- offset according to the beginning of the original message
data:bytes             -- piece of data of the original message
   = adnl.Message;
```

因此，为了组装原始消息，我们需要获取几个部分，并根据偏移量将它们连接成一个字节数组。
然后将其作为消息处理（根据这个字节数组中的ID前缀）。

### adnl.message.custom

```tlb
adnl.message.custom data:bytes = adnl.Message;
```

当更高级别的逻辑与请求-响应格式不符时，使用此类消息，这种消息类型允许将处理完全转移到更高级别，因为消息只携带一个字节数组，没有query_id和其他字段。例如，RLDP使用此类消息，因为对许多请求只有一个响应，这种逻辑由RLDP本身控制。

### 结论

此后的通信基于本文描述的逻辑进行，但数据包的内容取决于更高级别的协议，如DHT和RLDP。

## 参考

*这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md)，作者是[Oleg Baranov](https://github.com/xssnick)。*



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/low-level-adnl.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/low-level-adnl.md
================================================
# 低层级 ADNL

抽象数据报网络层（ADNL）是 TON 的核心协议，它帮助网络节点相互通信。

## 节点身份

每个节点至少应该有一个身份，可以但不必要使用多个。每个身份是一对密钥，用于执行节点间的 Diffie-Hellman。抽象网络地址是从公钥中派生出的，方法如下：`address = SHA-256(type_id || public_key)`。注意，type_id 必须以小端格式的 uint32 序列化。

## 公钥加密系统列表

| type_id | 加密系统                |
| ---------------------------- | ------------------- |
| 0x4813b4c6                   | ed25519<sup>1</sup> |

*1. 要执行 x25519，必须以 x25519 格式生成密钥对。然而，公钥通过网络是以 ed25519 格式传输的，因此你必须将公钥从 x25519 转换为 ed25519，可在[此处](https://github.com/tonstack/adnl-rs/blob/master/src/integrations/dalek.rs#L10)找到 Rust 的转换示例，以及在[此处](https://github.com/andreypfau/curve25519-kotlin/blob/f008dbc2c0ebc3ed6ca5d3251ffb7cf48edc91e2/src/commonMain/kotlin/curve25519/MontgomeryPoint.kt#L39)找到 Kotlin 的转换示例。*

## 客户端-服务器协议（ADNL over TCP）

客户端通过 TCP 连接到服务器，并发送一个 ADNL 握手包，其中包含服务器抽象地址、客户端公钥和加密的 AES-CTR 会话参数，这些参数由客户端确定。

### 握手

首先，客户端必须使用其私钥和服务器公钥执行密钥协议（例如，x25519），同时要考虑服务器密钥的 `type_id`。然后，客户端将获得 `secret`，用于在后续步骤中加密会话密钥。

再然后，客户端必须生成 AES-CTR 会话参数，一个 16 字节的 nonce 和 32 字节的密钥，分别用于 TX（客户端->服务器）和 RX（服务器->客户端）方向，并将其序列化为一个 160 字节的缓冲区，如下所示：

| 参数                            | 大小    |
| ----------------------------- | ----- |
| rx_key   | 32 字节 |
| tx_key   | 32 字节 |
| rx_nonce | 16 字节 |
| tx_nonce | 16 字节 |
| padding                       | 64 字节 |

填充(padding)的目的未知，服务器实现并不使用。建议用随机字节填充整个 160 字节缓冲区，否则攻击者可能利用被篡改的 AES-CTR 会话参数进行主动中间人攻击。

接下来的步骤是使用上述密钥协议中的 `secret` 对会话参数进行加密。为此，必须使用 AES-256 在 CTR 模式下初始化，使用 128 位大端计数器和(key, nonce)对，计算方法如下（`aes_params` 是之前构建的 160 字节缓冲区）：

```cpp
hash = SHA-256(aes_params)
key = secret[0..16] || hash[16..32]
nonce = hash[0..4] || secret[20..32]
```

加密 `aes_params` 后，记为 `E(aes_params)`，因为不再需要 AES，所以应该移除 AES。

现在我们准备将所有信息序列化到 256 字节的握手包中，并发送给服务器：

| 参数                                                          | 大小     | 说明              |
| ----------------------------------------------------------- | ------ | --------------- |
| receiver_address                       | 32 字节  | 服务器节点身份，如相应部分所述 |
| sender_public                          | 32 字节  | 客户端公钥           |
| SHA-256(aes_params) | 32 字节  | 会话参数的完整性证明      |
| E(aes_params)       | 160 字节 | 加密的会话参数         |

服务器必须使用从密钥协议中以与客户端相同的方式派生的secret解密会话参数。然后，服务器必须执行以下检查以确认协议的安全性：

1. 服务器必须拥有 `receiver_address` 对应的私钥，否则无法执行密钥协议。
2. `SHA-256(aes_params) == SHA-256(D(E(aes_params)))`，否则密钥协议失败，双方的 `secret` 不相等。

如果这些检查中的任何一个失败，服务器将立即断开连接，不对客户端作出响应。如果所有检查通过，服务器必须向客户端发送一个空数据报（见数据报部分），以证明其拥有指定 `receiver_address` 的私钥。

### 数据报

客户端和服务器都必须分别为 TX 和 RX 方向初始化两个 AES-CTR 实例。必须使用 AES-256 在 CTR 模式下使用 128 位大端计数器。每个 AES 实例使用属于它的(key, nonce)对进行初始化，可以从握手中的 `aes_params` 中获取。

发送数据报时，节点（客户端或服务器）必须构建以下结构，加密它并发送给另一方：

| 参数     | 大小               | 说明                                      |
| ------ | ---------------- | --------------------------------------- |
| length | 4 字节（LE）         | 整个数据报的长度，不包括 `length` 字段                |
| nonce  | 32 字节            | 随机值                                     |
| buffer | `length - 64` 字节 | 实际要发送给另一方的数据                            |
| hash   | 32 字节            | \`SHA-256(nonce \\ |

整个结构必须使用相应的 AES 实例加密（客户端 -> 服务器的 TX，服务器 -> 客户端的 RX）。

接收方必须获取前 4 字节，将其解密为 `length` 字段，并准确读取 `length` 字节以获得完整的数据报。接收方可以提前开始解密和处理 `buffer`，但必须考虑到它可能被故意或偶然损坏。必须检查数据报的 `hash` 以确保 `buffer` 的完整性。如果失败，则不能发出新的数据报，连接必须断开。

会话中的第一个数据报始终由服务器在成功接受握手包后发送给客户端，其实际缓冲区为空。客户端应该对其进行解密，如果失败，则应与服务器断开连接，因为这意味着服务器没有正确遵循协议，服务器和客户端的实际会话的密钥不同。

### 通信细节

如果你想深入了解通信细节，可以阅读文章 [ADNL TCP - Liteserver](/develop/network/adnl-tcp) 查看一些示例。

### 安全考虑

#### 握手填充

TON 初始团队为什么决定将此字段包含在握手中尚不清楚。`aes_params` 的完整性受 SHA-256 哈希保护，其保密性受从 `secret` 参数派生的密钥保护。可能，他们打算在某个时点迁移到 AES-CTR。为此，规范可能会扩展以包含 `aes_params` 中的特殊值，来表示节点准备使用的更新的原语。对这样的握手的响应可能会用新旧方案解密两次，以确定另一方实际使用的方案。

#### 会话参数加密密钥派生过程

如果仅从 `secret` 参数派生加密密钥，它将是静态的，因为secret是静态的。为了为每个会话派生新的加密密钥，开发人员还使用了 `SHA-256(aes_params)`，如果 `aes_params` 是随机的，则它也是随机的。然而，使用不同子数组拼接的实际密钥派生算法是被认为有问题的。

#### 数据报 nonce

数据报中 `nonce` 字段的存在原因不明确，因为即使没有它，任何两个密文也会由于 AES 的会话绑定密钥和在 CTR 模式下的加密而不同。然而，如果 nonce 不存在或可预测，则可以执行以下攻击。CTR 加密模式将区块密码（如 AES）转换为流密码，以便执行位翻转攻击(bit-flipping attack)。如果攻击者知道属于加密数据报的明文，他们可以获得纯密钥流，将其与自己的明文进行XOR，并有效地替换节点发送的消息。缓冲区的完整性受 SHA-256 哈希保护，但攻击者也可以替换它，因为完整的明文信息意味着拥有其哈希的信息。nonce 字段存在是为了防止这种攻击，所以没有 nonce 的信息，攻击者无法替换 SHA-256。

## P2P 协议（ADNL over UDP）

详细描述可以在文章 [ADNL UDP - Internode](/develop/network/adnl-udp) 中找到。

## 参考

- [开放网络，第 80 页](https://ton.org/ton.pdf)
- [TON 中的 ADNL 实现](https://github.com/ton-blockchain/ton/tree/master/adnl)

*感谢 [hacker-volodya](https://github.com/hacker-volodya) 为社区做出的贡献！*\
*此处是 GitHub 上的[原文链接](https://github.com/tonstack/ton-docs/tree/main/ADNL)。*



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/adnl/overview.md
================================================
# ADNL 协议

实现：

- https://github.com/ton-blockchain/ton/tree/master/adnl

## 概览

TON的基石是抽象数据报网络层（ADNL）。

这是一个基于**UDP**在**IPv4**（将来是IPv6）之上运行的覆盖层、点对点、不可靠（小尺寸）数据报协议，如果UDP不可用，可以选择**TCP备选**。

## ADNL 地址

每个参与者都有一个256位的ADNL地址。

ADNL协议允许您仅使用ADNL地址发送（不可靠）和接收数据报。IP地址和端口由ADNL协议隐藏。

ADNL地址本质上等同于一个256位的ECC公钥。这个公钥可以任意生成，从而为节点创建尽可能多的不同网络身份。然而，为了接收（并解密）发给接收地址的消息，必须知道相应的私钥。

实际上，ADNL地址不是公钥本身；相反，它是一个序列化TL对象的256位SHA256哈希，该对象可以根据其构造器来描述几种类型的公钥和地址。

## 加密与安全

通常，每个发送的数据报都由发送方签名，并加密，以便只有接收方可以解密消息并通过签名来验证其完整性。

## 邻居表

通常，一个TON ADNL节点会有一些“邻居节点(neighbors)”，其中包含了其他已知节点的信息，如他们的抽象地址、公钥、IP地址和UDP端口。随着时间的推移，它将逐渐使用从这些已知节点收集的信息扩展此表。这些新信息可以是对特殊查询的回答，或有时是过时记录的移除。

ADNL允许您建立点对点的通道和隧道（一系列代理）。

还可以在ADNL之上构建类TCP的流协议。

## 参阅

- 在[低层级ADNL文章](/learn/networking/low-level-adnl)中阅读更多关于ADNL的信息
- [TON白皮书](https://docs.ton.org/ton.pdf)的第3.1章。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/dht/dht-deep-dive.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/dht/dht-deep-dive.md
================================================
# DHT

DHT代表分布式哈希表，本质上是一个分布式的键值数据库，其中网络的每个成员都可以存储某些内容，例如，关于自己的信息。

TON中的DHT实现与IPFS中使用的[Kademlia](https://codethechange.stanford.edu/guides/guide_kademlia.html)的实现本质上类似。任何网络成员都可以运行一个DHT节点，生成密钥并存储数据。为此，他需要生成一个随机ID并通知其他节点自己的存在。

为了确定在哪个节点上存储数据，使用了一种确定节点与密钥之间“距离”的算法。算法很简单：我们取节点的ID和密钥的ID，执行XOR操作。值越小，节点越近。任务是尽可能接近密钥的节点上存储密钥，以便其他网络参与者可以使用同样的算法，找到可以给出此密钥数据的节点。

## 通过密钥查找值

让我们看一个查找密钥的示例，[连接到任何DHT节点并通过ADNL UDP建立连接](/develop/network/adnl-udp#packet-structure-and-communication)。

例如，我们想找到托管foundation.ton站点的节点的地址和公钥。假设我们已经通过执行DNS合约的Get方法获得了该站点的ADNL地址。ADNL地址的十六进制表示为`516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174`。现在我们的目标是找到拥有此地址的节点的ip、端口和公钥。

为此，我们需要获取DHT密钥的ID，首先我们将填充DHT密钥模式：

```tlb
dht.key id:int256 name:bytes idx:int = dht.Key
```

`name`是密钥类型，对于ADNL地址使用“address”，例如，要搜索分片链节点 - 使用“nodes”。但密钥类型可以是任何字节数组，取决于您正在查找的值。

填写此模式，我们得到：

```
8fde67f6                                                           -- TL ID dht.key
516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174   -- our searched ADNL address
07 61646472657373                                                  -- key type, the word "address" as an TL array of bytes
00000000                                                           -- index 0 because there is only 1 key
```

接下来 - 从上面序列化的字节获取DHT密钥ID的sha256哈希。它将是`b30af0538916421b46df4ce580bf3a29316831e0c3323a7f156df0236c5b2f75`

现在我们可以开始搜索。为此，我们需要执行一个具有[模式](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L197)的查询：

```tlb
dht.findValue key:int256 k:int = dht.ValueResult
```

`key`是我们DHT密钥的id，`k`是搜索的“宽度”，它越小，搜索越精确，但可查询的潜在节点越少。TON节点的最大k为10，通常使用6。

我们填充这个结构，序列化并发送请求，使用`adnl.message.query`模式。[您可以在另一篇文章中阅读更多关于此的内容](/develop/network/adnl-udp#packet-structure-and-communication)。

作为回应，我们可以得到：

- `dht.valueNotFound` - 如果未找到值。
- `dht.valueFound` - 如果此节点上找到了值。

##### dht.valueNotFound

如果我们得到`dht.valueNotFound`，响应将包含我们请求的节点所知并且尽可能接近我们请求的密钥的节点列表。在这种情况下，我们需要连接并将收到的节点添加到我们已知的列表中。
之后，从我们已知的所有节点列表中选择最接近、可访问且尚未请求的节点，并对其进行相同的请求。如此反复，直到我们尝试了我们选择的范围内的所有节点或直到我们不再收到新节点为止。

让我们更详细地分析响应字段，使用的模式：

```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.node id:PublicKey addr_list:adnl.addressList version:int signature:bytes = dht.Node;
dht.nodes nodes:(vector dht.node) = dht.Nodes;

dht.valueNotFound nodes:dht.nodes = dht.ValueResult;
```

`dht.nodes -> nodes` - DHT节点列表（数组）。

每个节点都有一个`id`，即其公钥，通常是[pub.ed25519](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L47)，用作通过ADNL连接到节点的服务器密钥。此外，每个节点都有一个地址列表`addr_list:adnl.addressList`，版本和签名。

我们需要检查每个节点的签名，为此我们读取`signature`的值并将该字段置零（我们使其成为空字节数组）。之后 - 我们序列化TL结构`dht.node`并检查空签名。之后 - 我们使用`id`字段中的公钥检查清空之前的`signature`字段。[[实现示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L91)

从列表`addrs:(vector adnl.Address)`中，我们取地址并尝试建立ADNL UDP连接，作为服务器密钥我们使用`id`，即公钥。

为了找出与该节点的“距离” - 我们需要从`id`字段的密钥中取出[key id](/develop/network/adnl-tcp#getting-key-id)并通过节点密钥id和所需密钥的XOR操作检查距离。如果距离足够小，我们可以对此节点发出相同的请求。依此类推，直到我们找到值或没有更多新节点。

##### dht.valueFound

响应将包含值本身，完整的密钥信息，以及可选的签名（取决于值类型）。

让我们更详细地分析响应字段，使用的模式：

```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.key id:int256 name:bytes idx:int = dht.Key;

dht.updateRule.signature = dht.UpdateRule;
dht.updateRule.anybody = dht.UpdateRule;
dht.updateRule.overlayNodes = dht.UpdateRule;

dht.keyDescription key:dht.key id:PublicKey update_rule:dht.UpdateRule signature:bytes = dht.KeyDescription;

dht.value key:dht.keyDescription value:bytes ttl:int signature:bytes = dht.Value; 

dht.valueFound value:dht.Value = dht.ValueResult;
```

首先，让我们分析`key:dht.keyDescription`，它是密钥的完整描述，密钥本身以及谁以及如何可以更新值的信息。

- `key:dht.key` - 密钥必须与我们用于搜索的密钥ID的密钥相匹配。
- `id:PublicKey` - 记录所有者
- `update_rule:dht.UpdateRule` - 记录更新规则。
- - `dht.updateRule.signature` - 只有私钥所有者才能更新记录，密钥和值的`signature`都必须有效
- - `dht.updateRule.anybody` - 任何人都可以更新记录，`signature`为空且不被检查
- - `dht.updateRule.overlayNodes` - 同一overlay的节点可以更新密钥，用于找到同一overlay的节点并添加自己

###### dht.updateRule.signature

阅读密钥描述后，我们会根据`updateRule`行为。ADNL地址查找案例的类型总是`dht.updateRule.signature`。
我们以与上次相同的方式检查密钥签名，使签名成为空字节数组、序列化并检查。 之后-我们重复相同的值，即对于整个`dht.value`对象 (同时将密钥签名还原到它的位置)。

[[实现示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L331)

###### dht.updateRule.overlayNodes

用于包含有关网络中工作链和其分片的其他节点信息的键，值始终具有`overlay.nodes`的TL结构。
该值字段必须为空。

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;
```

要检查有效性，我们必须检查所有 `nodes`，并通过序列化 TL 结构，针对每个节点的 `id` 检查 `signature`：

```tlb
overlay.node.toSign id:adnl.id.short overlay:int256 version:int = overlay.node.ToSign;
```

我们可以看到，id 应替换为 adnl.id.short，即原始结构中 `id` 字段的键 id（哈希值）。序列化后，我们使用数据检查签名。

因此，我们得到了能够给我们提供所需工作链分片信息的节点的有效列表。

###### dht.updateRule.anybody

没有签名，任何人都可以更新。

#### 使用值

当一切验证完毕且 `ttl:int` 值没有过期时，我们就可以开始处理值本身，即 `value:bytes` 。对于 ADNL 地址，内部必须有一个 `adnl.addressList` 结构。
它将包含与请求的 ADNL 地址相对应的服务器的 IP 地址和端口。在我们的例子中，很可能有 1 个 `foundation.ton` 服务的 RLDP-HTTP 地址。
我们将使用 DHT 密钥信息中的 `id:PublicKey`作为服务器密钥。

建立连接后，我们就可以使用 RLDP 协议请求访问网站页面。此时 DHT 方面的任务已经完成。

### 搜索存储区块链状态的节点

DHT也用于查找存储工作链及其分片数据的节点的信息。该过程与搜索任何密钥相同，唯一的区别在于密钥本身的序列化和响应的验证，我们将在本节中分析这些点。

为了获取例如主链及其分片的数据，我们需要填充TL结构：

```
tonNode.shardPublicOverlayId workchain:int shard:long zero_state_file_hash:int256 = tonNode.ShardPublicOverlayId;
```

其中`workchain`在主链的情况下将等于-1，它的分片将等于-922337203685477580（0xFFFFFFFFFFFFFFFF），而`zero_state_file_hash`是链的零状态的哈希（file_hash），像其他数据一样，可以从全局网络配置中获取，在`"validator"`字段中

```json
"zero_state": {
  "workchain": -1,
  "shard": -9223372036854775808, 
  "seqno": 0,
  "root_hash": "F6OpKZKqvqeFp6CQmFomXNMfMj2EnaUSOXN+Mh+wVWk=",
  "file_hash": "XplPz01CXAps5qeSWUtxcyBfdAo5zVb1N979KLSKD24="
}
```

在我们填充了`tonNode.shardPublicOverlayId`后，我们序列化它并通过哈希获取密钥ID（像往常一样）。

我们需要使用结果密钥ID作为`name`来填充`pub.overlay name:bytes = PublicKey`结构，将其包裹在TL字节数组中。接下来，我们序列化它，并从中获取现在的密钥ID。

生成的 id 将是 `dht.findValue` 的密钥，而 `name` 字段的值将是 `nodes` 字样。我们重复上一节的过程，一切与上次相同，但 `updateRule` 将是 [dht.updateRule.overlayNodes](#dhtupdateruleoverlaynodes)。

```bash
dht.findValue
```

结果是，我们将得到节点的地址，如果需要，我们可以使用[overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237)方法找到此链的其他节点的地址。我们还可以从这些节点接收有关区块的所有信息。

经过验证 - 我们将获得公钥（`id`）的节点，这些节点拥有我们工作链和分片的信息。为了获取节点的ADNL地址，我们需要对每个密钥（使用哈希方法）制作ID并重复上述过程，就像`foundation.ton`域的ADNL地址一样。

*这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md)，作者是[Oleg Baranov](https://github.com/xssnick)。*

## 参考资料

*这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md)，作者是[Oleg Baranov](https://github.com/xssnick)。*



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/dht/ton-dht.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/dht/ton-dht.md
================================================
# TON 分布式哈希表（DHT）服务

实现：

- https://github.com/ton-blockchain/ton/tree/master/dht
- https://github.com/ton-blockchain/ton/tree/master/dht-server

## 概览

类 Kademlia 的分布式哈希表（DHT）在 TON 的网络部分扮演着至关重要的角色，用于定位网络中的其他节点。

TON DHT 的键是简单的 256 位整数。在大多数情况下，它们是作为 TL-序列化对象的 SHA256 计算得出。

这些 256 位键所分配的值本质上是长度有限的任意字节串。这样的字节串的解释由相应键的原像决定；
通常情况下，查找键的节点和存储键的节点都知道这一点。

在最简单的情况下，键代表某个节点的 ADNL 地址，值可以是其 IP 地址和端口。

TON DHT 的键值映射保存在 DHT 节点上。

## DHT 节点

每个 DHT 节点都有一个 256 位的 DHT 地址。与 ADNL 地址不同，DHT 地址不应该太频繁地更改，否则其他节点将无法定位它们正在寻找的键。

预计键 `K` 的值将存储在与 `K` 最近的 `S` 个 Kademlia 节点上。

Kademlia 距离 = 256 位键 `XOR` 256 位 DHT 节点地址（与地理位置无关）。

`S` 是一个小参数，例如 `S = 7`，用于提高 DHT 的可靠性（如果我们只在一个节点上保存键，即最接近 `K` 的那个，如果那个单个节点离线，那个键的值将会丢失）。

## Kademlia 路由表

任何参与 DHT 的节点通常都会维护一个 Kademlia 路由表。

它包含编号从 0 到 255 的 256 个桶。第 `i` 个桶将包含一些已知节点的信息（固定数量的“最佳”节点和可能的一些额外候选节点），这些节点与节点的地址 `a` 的 Kademlia 距离在 `2^i` 到 `2^(i+1) − 1` 之间。

这些信息包括它们的 DHT 地址、IP 地址和 UDP 端口，以及一些可用性信息，例如最后一次 ping 的时间和延迟。

当 Kademlia 节点因某些查询而了解到任何其他 Kademlia 节点时，它会将其放入其路由表的适当的桶中，首先将其作为候选者。然后，如果该桶中的一些“最佳”节点故障（例如，长时间不响应 ping 查询），它们可以被这些候选者中的一些替换。通过这种方式，Kademlia 路由表保持着填充状态。

## 键值对

可以在 TON DHT 中添加和更新键值对。

“更新规则”可能有所不同。在某些情况下，它们简单地允许用新值替换旧值，前提是新值是由所有者/创建者签名（签名必须作为值的一部分保留，以便稍后由其他节点在获取此键的值后进行检查）。
在其他情况下，旧值以某种方式影响新值。例如，它可以包含一个序列号，只有当新序列号更大时（为了防止重放攻击）才覆盖旧值。

TON DHT 不仅用于存储 ADNL 节点的 IP 地址，还用于其他目的 - 它可以存储特定 TON 存储种子的节点地址列表、包含在覆盖子网络中的节点地址列表、TON 服务的 ADNL 地址或 TON 区块链账户的 ADNL 地址等。

:::info
更多关于 TON DHT 的信息，请参阅 [DHT](/develop/network/dht) 这篇文章，或阅读 [TON 白皮书](https://docs.ton.org/ton.pdf) 的第 3.2 章。
:::



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/overlay.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/overlay.md
================================================
# 覆盖子网络

TON的架构构建方式使得许多链可以同时且独立地存在于其中 - 它们可以是私有的或公共的。
节点能够选择它们存储和处理的分片和链。
同时，由于其通用性，通信协议保持不变。像DHT、RLDP和Overlays这样的协议使这成为可能。
我们已经熟悉前两者，在本节中我们将了解Overlay是什么。

- https://github.com/ton-blockchain/ton/tree/master/overlay

## 概述

TON的架构构建方式使得许多链可以同时且独立地存在于其中 - 它们可以是私有的或公共的。
节点能够选择它们存储和处理的分片和链。
同时，由于其通用性，通信协议保持不变。像DHT、RLDP和Overlays这样的协议使这成为可能。
我们已经熟悉前两者，在本节中我们将了解Overlay是什么。

我们已经在关于DHT的文章中分析了一个查找overlay节点的例子，在[搜索存储区块链状态的节点](/develop/network/dht#search-for-nodes-that-store-the-state-of-the-blockchain)一节中。在这一节中，我们将专注于与它们的互动。

当查询DHT时，我们将获得overlay节点的地址，从中我们可以使用[overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237)查询找出这个overlay的其他节点的地址。一旦我们连接了足够数量的节点，我们就可以从它们那里接收所有区块信息和其他链事件，以及向它们发送我们的交易以供处理。

## 寻找更多邻居节点(neighbors)

让我们看一个在overlay中获取节点的例子。

为此，向任何已知的overlay节点发送`overlay.getRandomPeers`请求，序列化TL模式：

重叠子网可以是公共的，也可以是私有的。

`peers` - 应包含我们已知的节点，这样我们就不会再次得到它们，但由于我们还不知道任何节点，`peers.nodes`将是一个空数组。

## 与overlay节点的互动

overlay内的每个请求都必须以TL模式为前缀：

当查询DHT时，我们将获得overlay节点的地址，从中我们可以使用[overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237)查询找出这个overlay的其他节点的地址。一旦我们连接了足够数量的节点，我们就可以从它们那里接收所有区块信息和其他链事件，以及向它们发送我们的交易以供处理。

### 寻找更多邻居节点(neighbors)

我们需要通过简单地连接2个序列化的字节数组来连接2个序列化的模式，`overlay.query`将首先出现，其次是`overlay.getRandomPeers`。

我们将结果数组包裹在`adnl.message.query`模式中并通过ADNL发送。作为回应，我们等待`overlay.nodes` - 这将是我们可以连接的overlay节点的列表，并且如果需要，重复向新的节点发送相同的请求，直到我们获得足够的连接。

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;

overlay.getRandomPeers peers:overlay.nodes = overlay.Nodes;
```

一旦建立了连接，我们可以使用[请求](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L413) `tonNode.*`访问overlay节点。

对于此类请求，使用的是 RLDP 协议。重要的是，不要忘记 `overlay.query` 前缀--overlay中的每个查询都必须使用它。

请求本身并无异常，与我们[在有关 ADNL TCP 的文章中所做的](/develop/network/adnl-tcp#getmasterchaininfo)非常相似。

```tlb
overlay.query overlay:int256 = True;
```

`overlay`应该是overlay的id - `tonNode.ShardPublicOverlayId`模式键的id - 与我们用于搜索DHT时使用的相同。

通过传递它，我们将能够下载关于区块的完整信息，作为回应我们将收到：

我们将结果数组包裹在`adnl.message.query`模式中并通过ADNL发送。作为回应，我们等待`overlay.nodes` - 这将是我们可以连接的overlay节点的列表，并且如果需要，重复向新的节点发送相同的请求，直到我们获得足够的连接。

### 功能请求

因此，我们可以直接从节点获得信息。

对于此类请求，使用的是 RLDP 协议。重要的是，不要忘记 `overlay.query` 前缀--overlay中的每个查询都必须使用它。

*这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md)，作者是[Oleg Baranov](https://github.com/xssnick)。*

例如，"downloadBlockFull "请求使用的是我们已经熟悉的区块 ID 模式：

```tlb
tonNode.downloadBlockFull block:tonNode.blockIdExt = tonNode.DataFull;
```

通过传递它，我们将能够下载关于区块的完整信息，作为回应我们将收到：

```tlb
tonNode.dataFull id:tonNode.blockIdExt proof:bytes block:bytes is_link:Bool = tonNode.DataFull;
  or
tonNode.dataFullEmpty = tonNode.DataFull;
```

如果存在，`block`字段将包含TL-B格式的数据。

因此，我们可以直接从节点获得信息。

## 参考资料

*这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md)，作者是[Oleg Baranov](https://github.com/xssnick)。*



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/rldp.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/network/protocols/rldp.md
================================================
# RLDP

RLDP（可靠的大数据报协议）是基于ADNL UDP之上的协议，用于传输大数据块，并包括正向错误校正（FEC）算法来替代另一端的确认包。这使得在网络组件之间更高效地传输数据成为可能，但会消耗更多的流量。

- https://github.com/ton-blockchain/ton/tree/master/rldp
- https://github.com/ton-blockchain/ton/tree/master/rldp2
- https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy

## 协议

RLDP使用以下TL结构进行通信：

RLDP在TON基础设施中广泛使用，例如，从其他节点下载区块并向它们传输数据，访问TON网站和TON存储。

## 协议

当接收方收集到组装完整消息所需的`rldp.messagePart`片段时，它会将它们全部连接起来，使用FEC解码并将结果字节数组反序列化为`rldp.query`或`rldp.answer`结构之一，取决于类型（tl前缀id）。

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.roundRobin data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.online data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
rldp.confirm transfer_id:int256 part:int seqno:int = rldp.MessagePart;
rldp.complete transfer_id:int256 part:int = rldp.MessagePart;

rldp.message id:int256 data:bytes = rldp.Message;
rldp.query query_id:int256 max_answer_size:long timeout:int data:bytes = rldp.Message;
rldp.answer query_id:int256 data:bytes = rldp.Message;
```

有效的正向错误校正算法用于RLDP包括RoundRobin、Online和RaptorQ。
目前用于数据编码的是[RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf)。

当接收方收集到组装完整消息所需的`rldp.messagePart`片段时，它会将它们全部连接起来，使用FEC解码并将结果字节数组反序列化为`rldp.query`或`rldp.answer`结构之一，取决于类型（tl前缀id）。

### FEC

从块创建矩阵，并对其应用离散数学运算。这使我们能够从相同的数据创建几乎无限数量的符号。
所有符号都混合在一起，可以在不向服务器请求额外数据的情况下恢复丢失的数据包，同时使用的数据包比我们循环发送相同片段时少。

#### RaptorQ

[[RaptorQ在Golang中的实现示例]](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq)

从块创建矩阵，并对其应用离散数学运算。这使我们能够从相同的数据创建几乎无限数量的符号。
所有符号都混合在一起，可以在不向服务器请求额外数据的情况下恢复丢失的数据包，同时使用的数据包比我们循环发送相同片段时少。

为了与TON Sites互动，使用了封装在RLDP中的HTTP。托管者在任何HTTP网络服务器上运行他的站点，并在旁边启动rldp-http-proxy。TON网络中的所有请求通过RLDP协议发送到代理，代理将请求重新组装为简单的HTTP，并在本地调用原始网络服务器。

用户在他的一侧启动代理，例如，[Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy)，并使用`.ton` sites，所有流量都以相反的顺序包裹，请求发送到本地HTTP代理，它通过RLDP将它们发送到远程TON站点。

## RLDP-HTTP

为了与TON Sites互动，使用了封装在RLDP中的HTTP。托管者在任何HTTP网络服务器上运行他的站点，并在旁边启动rldp-http-proxy。TON网络中的所有请求通过RLDP协议发送到代理，代理将请求重新组装为简单的HTTP，并在本地调用原始网络服务器。

这不是纯文本形式的HTTP，一切都包裹在二进制TL中，并由代理自己解包以发送给网络服务器或浏览器。

工作方案如下：

```tlb
http.header name:string value:string = http.Header;
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;

http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

这不是纯文本形式的HTTP，一切都包裹在二进制TL中，并由代理自己解包以发送给网络服务器或浏览器。

为了了解RLDP的工作原理，让我们看一个从TON站点`foundation.ton`获取数据的示例。
假设我们已经通过调用NFT-DNS合约的Get方法获得了其ADNL地址，[使用DHT确定了RLDP服务的地址和端口](https://github.com/xssnick/ton-deep-doc/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/DHT.md)，并[通过ADNL UDP连接到它](https://github.com/xssnick/ton-deep-doc/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/ADNL-UDP-Internal.md)。

- 客户端发送`http.request`
- 服务器在接收请求时检查`Content-Length`头
- - 如果不为0，向客户端发送`http.getNextPayloadPart`请求
- - 接收到请求时，客户端发送`http.payloadPart` - 请求的正文片段，取决于`seqno`和`max_chunk_size`。
- - 服务器重复请求，递增`seqno`，直到从客户端接收到所有块，即直到接收到的最后一个块的`last:Bool`字段为真。
- 处理请求后，服务器发送`http.response`，客户端检查`Content-Length`头
- - 如果不为0，则向服务器发送`http.getNextPayloadPart`请求，并重复这些操作，就像客户端一样，反之亦然

## 请求TON站点

为了了解 RLDP 的工作原理，我们来看一个从 TON 站点 `foundation.ton` 获取数据的示例。
假设我们已经通过调用 NFT-DNS 合约的 Get 方法获得了它的 ADNL 地址，[使用 DHT 确定了 RLDP 服务的地址和端口](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md)，并[通过 ADNL UDP 与之连接](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md)。

### 向`foundation.ton`发送GET请求

为此，填写结构：

```tlb
http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
```

通过填写字段序列化`http.request`：

```
e191b161                                                           -- TL ID http.request      
116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245de471194   -- id           = {random}
03 474554                                                          -- method       = string `GET`
16 687474703a2f2f666f756e646174696f6e2e746f6e2f 00                 -- url          = string `http://foundation.ton/`
08 485454502f312e31 000000                                         -- http_version = string `HTTP/1.1`
01000000                                                           -- headers (1)
   04 486f7374 000000                                              -- name         = Host
   0e 666f756e646174696f6e2e746f6e 00                              -- value        = foundation.ton
```

现在我们需要将FEC RaptorQ算法应用到这些数据上。

```
694d798a                                                              -- TL ID rldp.query
184c01cb1a1e4dc9322e5cabe8aa2d2a0a4dd82011edaf59eb66f3d4d15b1c5c      -- query_id        = {random}
0004040000000000                                                      -- max_answer_size = 257 KB, can be any sufficient size that we accept as headers
258f9063                                                              -- timeout (unix)  = 1670418213
34 e191b161116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245   -- data (http.request)
   de4711940347455416687474703a2f2f666f756e646174696f6e2e746f6e2f00
   08485454502f312e310000000100000004486f73740000000e666f756e646174
   696f6e2e746f6e00 000000
```

### 编码和发送数据包

此外，编码器也会根据数据和符号的大小选择常量，您可以在RaptorQ的文档中了解更多，但为了不陷入数学丛林，我建议使用已实现此类编码的现成库。[[创建编码器的示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15) 和 [[符号编码示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26)。

符号按循环方式编码和发送：我们最初定义`seqno`为0，并为每个后续编码的数据包增加1。例如，如果我们有2个符号，那么我们编码并发送第一个，增加seqno 1，然后第二个并增加seqno 1，然后再次第一个并增加seqno，此时已经等于2，再增加1。如此直到我们收到对方已接受数据的消息。

现在，当我们创建了编码器，我们准备发送数据，为此我们将填写TL模式：

此外，编码器也会根据数据和符号的大小选择常量，您可以在RaptorQ的文档中了解更多，但为了不陷入数学丛林，我建议使用已实现此类编码的现成库。[[创建编码器的示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15) 和 [[符号编码示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26)。

符号按循环方式编码和发送：我们最初定义`seqno`为0，并为每个后续编码的数据包增加1。例如，如果我们有2个符号，那么我们编码并发送第一个，增加seqno 1，然后第二个并增加seqno 1，然后再次第一个并增加seqno，此时已经等于2，再增加1。如此直到我们收到对方已接受数据的消息。

序列化`rldp.messagePart`后，将其包裹在`adnl.message.custom`中并通过ADNL UDP发送。

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```

- `transfer_id` - 随机int256，对于同一数据传输中的所有messageParts相同。
- `fec_type`是`fec.raptorQ`。
- - `data_size` = 156
- - `symbol_size` = 768
- - `symbols_count` = 1
- `part`在我们的案例中始终为0，可用于达到大小限制的传输。
- `total_size` = 156。我们传输数据的大小。
- `seqno` - 对于第一个数据包将等于0，对于每个后续数据包将递增1，将用作解码和编码符号的参数。
- `data` - 我们编码的符号，大小为768字节。

序列化`rldp.messagePart`后，将其包裹在`adnl.message.custom`中并通过ADNL UDP发送。

在发送过程中，我们已经可以期待来自服务器的响应，在我们的例子中我们等待带有`http.response`的`rldp.answer`。它将以与请求发送时相同的方式以RLDP传输的形式发送给我们，但`transfer_id`将被反转（每个字节XOR 0xFF）。我们将收到包含`rldp.messagePart`的`adnl.message.custom`消息。

首先，我们需要从传输的第一个接收消息中获取FEC信息，特别是从`fec.raptorQ`消息部分结构中获取`data_size`，`symbol_size`和`symbols_count`参数。我们需要它们来初始化RaptorQ解码器。[[示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137)

### 处理来自`foundation.ton`的响应

结果将是带有与我们发送的`rldp.query`中相同query_id的`rldp.answer`消息。数据必须包含`http.response`。

首先，我们需要从传输的第一个接收消息中获取FEC信息，特别是从`fec.raptorQ`消息部分结构中获取`data_size`，`symbol_size`和`symbols_count`参数。我们需要它们来初始化RaptorQ解码器。[[示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137)

对于主要字段，我认为一切都很清楚，实质与HTTP相同。这里有趣的标志位是`no_payload`，如果它为真，则响应中没有正文，（`Content-Length` = 0）。可以认为服务器的响应已经接收。

如果`no_payload` = false，那么响应中有内容，我们需要获取它。为此，我们需要发送一个TL模式`http.getNextPayloadPart`包裹在`rldp.query`中的请求。

```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```

`id`应与我们在`http.request`中发送的相同，`seqno` - 0，对于每个下一个部分+1。`max_chunk_size`是我们准备接受的最大块大小，通常使用128 KB（131072字节）。

作为回应，我们将收到：

```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

如果`last` = true，那么我们已经到达尾部，我们可以将所有部分放在一起，获得完整的响应正文，例如html。

作为回应，我们将收到：

```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```

如果`last` = true，那么我们已经到达尾部，我们可以将所有部分放在一起，获得完整的响应正文，例如html。

## 参考资料

*这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md)，作者是[Oleg Baranov](https://github.com/xssnick)。*



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/README.mdx
================================================
import Button from '@site/src/components/button'

# 简介

在TON区块链上创建、开发和部署智能合约，需要使用[FunC编程语言](/develop/smart-contracts/#func-language)和[TON虚拟机（TVM）](/develop/smart-contracts/#ton-virtual-machine)。

## 快速开始：您的第一个智能合约

使用_Blueprint_框架编写并部署您的第一个智能合约。

Blueprint是一个用于编写、测试和部署智能合约的开发环境。
要创建一个新的演示项目，请使用以下命令：

```bash
npm create ton@latest
```

<Button href="/develop/smart-contracts/sdk/javascript" colorType="primary" sizeType={'sm'}>

阅读更多

</Button>

<Button href="https://stepik.org/course/201638/" colorType={'secondary'} sizeType={'sm'}>

TON区块链课程

</Button>

## 开始

### 有趣且简单的教程

使用我们适合初学者的指南开始您的旅程：

- [TON Hello World：逐步指导编写您的第一个智能合约](https://helloworld.tonstudio.io/02-contract/)
  - [🚩 挑战1：简单NFT部署](https://github.com/romanovichim/TONQuest1)
  - [🚩 挑战2：聊天机器人合约](https://github.com/romanovichim/TONQuest2)
  - [🚩 挑战3：Jetton自动售卖机](https://github.com/romanovichim/TONQuest3)
  - [🚩 挑战4：彩票/抽奖](https://github.com/romanovichim/TONQuest4)
  - [🚩 挑战5：在5分钟内创建与合约互动的UI](https://github.com/romanovichim/TONQuest5)
  - [🚩 挑战6：分析Getgems市场上的NFT销售](https://github.com/romanovichim/TONQuest6)

### TON 课程

我们自豪地呈现**TON区块链课程**，这是TON区块链的全面指南。该课程适用于想要学习如何在TON区块链上创建智能合约和去中心化应用的开发者。

它包括**9个模块**，涵盖了TON区块链的基础知识、智能合约开发生命周期、FunC编程和TON虚拟机（TVM）。

<Button href="https://stepik.org/course/201638/" colorType={'primary'} sizeType={'sm'}>

查看TON课程

</Button>

### 综合指南

对于喜欢详请和细节的人，请访问：

- [如何使用钱包智能合约工作](/develop/smart-contracts/tutorials/wallet)

## 智能合约示例

探索由TON社区提供的现成智能合约示例和工具。

:::info 小提示
专注于使用_FunC_编写的智能合约。通常更好的做法是关注使用FunC（_.fc）而不是低层级Fift（_.fif）语言编写的智能合约。
:::

TON上标准的智能合约示例包括钱包、选举（管理TON上的验证）和多签钱包，这些可以在学习时参考。

<Button href="/develop/smart-contracts/examples" colorType={'primary'} sizeType={'sm'}>

打开示例

</Button>

## 智能合约最佳实践

TON提供了无限可能性。来了解如何在遵循推荐指南的同时进行充分利用。

- [智能合约指南](/develop/smart-contracts/guidelines)

## TON 虚拟机（TVM）

探索运行您智能合约的引擎。

- [TVM概览](/learn/tvm-instructions/tvm-overview)

## 编程语言

### 📘 FunC

为TON智能合约量身定制的语言。

<Button href="/develop/func/overview" colorType={'primary'} sizeType={'sm'}>

FunC概览

</Button>

### 📒 Tact

类似于TypeScript和Rust的TON智能合约高级语言。

:::caution
由社区开发。谨慎使用。
:::

<Button href="https://docs.tact-lang.org/" colorType={'primary'} sizeType={'sm'}>

Tact官方网站

</Button>

<Button href="https://tact-by-example.org/"
        colorType="secondary" sizeType={'sm'}>

Tact Hello World

</Button>

### 📕 Fift（高级）

:::caution 高级水平
只适用于勇敢者！
:::

<Button href="/develop/fift/overview" colorType={'primary'} sizeType={'sm'}>

Fift概览

</Button>

## 社区工具

- [disintar/toncli](/develop/smart-contracts/sdk/toncli) — toncli是用于构建、部署和测试FunC合约的命令行界面。
- [MyLocalTON](/participate/run-nodes/local-ton) — MyLocalTON用于在您的本地环境中运行私有TON区块链。
- [tonwhales.com/tools/boc](https://tonwhales.com/tools/boc) — BOC解析器
- [tonwhales.com/tools/introspection-id](https://tonwhales.com/tools/introspection-id) — crc32生成器
- [@orbs-network/ton-access](https://www.orbs.com/ton-access/) — 去中心化API网关

## 进一步阅读

通过这些社区驱动的教育资源提高您的技能。

- [TON FunC学习路径](https://blog.ton.org/func-journey) ([俄文版](https://github.com/romanovichim/TonFunClessons_ru))
- [YouTube教程](https://www.youtube.com/@TONDevStudy) [\[俄文版\]](https://www.youtube.com/@WikiMar)

## 额外资源

- [什么是区块链？什么是智能合约？什么是gas？](https://blog.ton.org/what-is-blockchain)
- [理解交易费用](/develop/smart-contracts/fees#how-to-calculate-fees)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/addresses.md
================================================
# 智能合约地址

本节将描述TON区块链上智能合约地址的特点，并解释在TON上，actor与智能合约是如何等同的。

## 一切皆为智能合约

在TON上，智能合约是使用[Actor模型](/learn/overviews/ton-blockchain#single-actor)构建的。实际上，在TON中的actor在技术上是以智能合约的形式表示的。这意味着，即使您的钱包也是一个简单的actor（以及一个智能合约）。

通常，actor处理传入消息，改变其内部状态，并生成传出消息。这就是为什么TON区块链上的每一个actor（即智能合约）都必须有一个地址，以便能够从其他actor接收消息。

:::info 以太坊虚拟机(EVM)
在以太坊虚拟机(EVM)上，地址与智能合约完全分离。欢迎阅读Tal Kol的文章["TON 区块链的六个独特之处，会让 Solidity 开发者感到惊讶"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) 了解更多差异。
:::

## 智能合约的地址

在TON上运行的智能合约地址通常包含两个主要组成部分：

- **(workchain_id)**：代表工作链ID（一个有符号的32位整数）

- **(account_id)** 代表账户的地址（根据工作链不同，为64-512位，）

在本文档的原始地址概述部分，我们将讨论\*\*(workchain_id, account_id)\*\* 是如何呈现。

### 工作链ID和账户ID

#### 工作链ID

[正如我们之前所见](/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules)，在TON区块链上可以创建多达`2^32`个工作链。我们还注意到，32位前缀的智能合约地址用于识别并链接到不同工作链中的智能合约地址。这允许智能合约在TON区块链的不同工作链之间发送和接收消息。

如今，TON区块链中仅运行主链（workchain_id=-1）和不定期地运行基本工作链（workchain_id=0）。

它们都有256位地址，因此，我们假设workchain_id是0或-1，工作链中的地址正好是256位。

#### 账户ID

TON的所有账户ID都在主链和基本链（或基本工作链）上使用256位地址。

实际上，账户ID **(account_id)** 被定义为智能合约对象的哈希函数（专指SHA-256）。每个在TON区块链上运行的智能合约都存储两个主要组件。这些包括：

1. *编译后的代码*。智能合约的逻辑以字节码形式编译。
2. *初始状态*。合约在链上部署时的值。

最后，为了准确地推导出合约的地址，需要计算与\*\*（初始代码，初始状态）\*\* 对象相对应的哈希。目前，我们不会深入研究[TVM](/learn/tvm-instructions/tvm-overview)的工作方式，但重要的是要理解TON上的账户ID是使用这个公式确定的：
:
**account_id = hash（初始代码，初始状态）**

随着本文档的深入，我们将进一步深入技术规格和TVM及TL-B方案的概述。现在我们熟悉了**account_id**的生成以及它们与TON上智能合约地址的交互，接下来让我们解释什么是原始地址和用户友好地址。

## 原始地址和用户友好地址

在简要概述了TON上的智能合约地址是如何利用工作链和账户ID（特别是对于主链和基本链）之后，那重要的是要理解这些地址以下面两种主要格式表示：

- **原始地址**：智能合约地址的原始完整表示。
- **用户友好地址**：用户友好地址是原始地址的增强格式，有更好的安全性和易用性。
- `active` - 地址拥有智能合约代码、持久数据和余额。在此状态下，它可以在交易过程中执行一些逻辑，并更改其持久数据。当地址处于 `uninit` 状态，且有带 state_init 参数的消息传入时，它就会进入此状态（注意，要部署此地址， `state_init` 和 `code` 的哈希值必须等于地址）。
- `frozen` - 地址不能执行任何操作，此状态只包含前一状态的两个哈希值（分别是代码 cell 和状态 cell ）。当地址的存储费用超过余额时，就会进入这种状态。要解冻它，可以发送带有 `state_init` 和 `code` 的内部信息，其中存储了前面描述的哈希值和一些 Toncoin。要恢复它可能会很困难，所以你不应该允许这种情况发生。有一个解冻地址的项目，你可以在 [这里](https://unfreezer.ton.org/) 找到。

## 简单易用的地址

在简要介绍了 TON 上的智能合约地址如何利用工作链和账户 ID（具体针对主链和底层链）之后，我们有必要了解这些地址主要有两种格式：

- **原始地址**：智能合约地址的原始完整表示。
- **用户友好地址**：用户友好地址是一种原始地址的增强格式，具有更好的安全性和易用性。

下面，我们将详细介绍这两种地址类型的区别，并深入探讨 TON 使用用户友好地址的原因。

### 原始地址

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

- [十进制workchain_id\]：[64个十六进制数字的account_id\]

以下是一个使用工作链ID和账户ID的原始智能合约地址示例（表示为**workchain_id**和**account_id**）：

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

使用原始地址形式存在两个主要问题：

:::note
地址字符串中可以使用大写字母（如 'A'、'B'、'C'、'D'等）替代其小写的对应字母（如 'a'、'b'、'c' 'd'等）。
:::

#### 用户友好地址

用户友好地址是为了保护和简化在互联网上（例如，在公共消息平台上或通过电子邮件服务提供商）以及现实世界中分享地址的TON用户的体验而开发的。

1. 在使用原始地址格式时，无法在发送交易前验证地址以消除错误。
   这意味着，如果您在发送交易前不小心在地址字符串中添加或删除字符，您的交易将被发送到错误的目的地，导致资金损失。
2. 在使用原始地址格式时，无法添加像使用用户友好地址时发送交易所用的特殊标志位。
   为了帮助您更好地理解这个概念，我们将在下面解释可以使用哪些标志位。

### 用户友好的地址

用户友好地址是为了保护和简化在互联网上（例如，在公共消息平台上或通过电子邮件服务提供商）以及现实世界中分享地址的TON用户的体验而开发的。

#### 用户友好地址结构

要生成用户友好地址，开发者必须使用以下方式对所有36个字节进行编码：

1. *base64*（即数字、大小写拉丁字母、'/' 和 '+'）

   - isBounceable。表示可弹回或不可弹回的地址类型。(*0x11* 表示“可弹回”，*0x51* 表示“不可弹回”)
   - isTestnetOnly。表示仅用于测试网的地址类型。以_0x80_ 开头的地址不应被生产网络上运行的软件接受
   - isUrlSafe。表示已定义为地址的URL安全的已弃用标志位。所有地址都被认为是URL安全的。
2. *base64url*（用 '_' 和 '-' 代替 '/' 和 '+'）
3. *\[account_id - 32字节]* — 账户ID由工作链中的256位（[大端序](https://www.freecodecamp.org/news/what-is-endianness-大端-vs-little-endian/)）地址组成。
4. *\[地址验证 - 2字节]* — 在用户友好地址中，地址验证由前34个字节的CRC16-CCITT签名组成。([示例](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
   实际上，用户友好地址的验证思想与所有信用卡上使用的[Luhn算法](https://en.wikipedia.org/wiki/Luhn_algorithm)类似，以防止用户错误输入不存在的卡号。

完成这个过程后，会生成一个长度为48个非空格字符的用户友好地址。

要生成用户友好地址，开发者必须使用以下方式对所有36个字节进行编码：

- *base64*（即数字、大小写拉丁字母、'/' 和 '+'）
- *base64url*（用 '_' 和 '-' 代替 '/' 和 '+'）

例如，“测试赠予者”智能合约（一个特殊的智能合约，位于测试网主链中，向任何请求者发送2个测试代币）使用以下原始地址：

:::info DNS地址标志位
在TON上，有时使用诸如mywallet.ton之类的DNS地址，而不是原始和用户友好地址。实际上，DNS地址由用户友好地址组成，并包括所有必需的标志位，允许开发者从TON域中的DNS记录访问所有标志位。
:::

#### 用户友好地址编码示例

例如，“测试赠予者”智能合约（一个特殊的智能合约，位于测试网主链中，向任何请求者发送2个测试代币）使用以下原始地址：

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

上述“测试赠予者”的原始地址必须转换为用户友好地址形式。这可以通过使用之前介绍的base64或base64url形式来获得，如下所示：

- `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
- `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
注意，*base64* 和 *base64url* 两种形式都是有效的，都会被接受！
:::

#### 可弹回与不可弹回地址

可弹回地址标志位背后的核心思想是发件人资金的安全。

请阅读我们的文档以更好地了解[不可弹回消息](/develop/smart-contracts/guidelines/non-bouncable-messages)。

1. **bounceable=false** 标志位通常意味着接收者是一个钱包。
2. **bounceable=true** 标志位通常表示具有自己应用逻辑的自定义智能合约（例如，DEX）。在这个例子中，因为安全原因不应发送非弹回消息。

TON区块链相关的附加二进制数据采用类似的"加固型" base64 用户友好地址表示。它们根据字节标签的前4个字符来进行区分。例如，256位Ed25519公钥通过以下顺序创建的36字节序列来表示：

#### base64加固型表示

获得的36字节序列会转换为标准方式的48字符base64或base64url字符串。例如，Ed25519公钥`E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D`（通常由32字节序列表示，例如：`0xE3, 0x9E, ..., 0x7D`）通过“加固型”表示呈现如下：

- 使用_0x3E_格式的单字节标签表示公钥
- 使用_0xE6_格式的单字节标签表示Ed25519公钥
- 32字节标签含标准二进制表示的Ed25519公钥
- 2字节标签含大端序表示的前34字节的CRC16-CCITT

由此产生的 36 字节序列会按标准方式转换成 48 个字符的 base64 或 base64url 字符串。例如，Ed25519 公钥 `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D`（通常由 32 个字节组成，如  0xE3，0x9E，...，0x7D`）通过 `加固\` 表示法呈现如下：

转换用户友好和原始地址的最简单方式是使用几个TON API和其他工具，包括：

### 用户友好地址和原始地址的转换

此外，使用JavaScript为钱包转换用户友好和原始地址有两种方式：

- [使用ton.js转换地址的形式，从/到用户友好或原始形式](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
- [使用tonweb转换地址的形式，从/到用户友好或原始形式](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)
- [toncenter主网的API方法](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
- [toncenter测试网的API方法](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

还可以使用[SDKs](/develop/dapps/apis/sdk)进行类似的转换。

- [使用ton.js转换地址的形式，从/到用户友好或原始形式](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
- [使用tonweb转换地址的形式，从/到用户友好或原始形式](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

在 [TON Cookbook](/develop/dapps/cookbook#working-with-contracts-addresses) 中了解有关 TON 地址的更多示例。

### 地址示例

在 [TON Cookbook](/v3/guidelines/dapps/cookbook#working-with-contracts-addresses) 中了解有关 TON 地址的更多示例。

## 可能出现的问题

在与 TON 区块链交互时，了解将 TON 币转移到 "未激活 "钱包地址的影响至关重要。本节概述了各种情况及其结果，以明确如何处理此类交易。

### 将 Toncoin 转移到未登录地址时会发生什么？

#### 包含 `state_init` 的事务

如果您在交易中包含 `state_init`（由钱包或智能合约的代码和数据组成）。智能合约会首先使用所提供的 `state_init` 进行部署。部署完成后，将对收到的信息进行处理，类似于向已初始化的账户发送信息。

#### 未设置 `state_init` 和 `bounce` 标志的事务

信息无法传递到 `uninit` 智能合约，将被退回给发件人。在扣除消耗的 gas 费用后，剩余金额将返回发件人地址。

#### 未设置 `state_init` 和 `bounce` 标志的事务

信息无法送达，但也不会退回给发送者。相反，发送的金额会记入接收地址，增加其余额，即使钱包尚未初始化。在地址持有者部署智能钱包合约之前，它们将被存储在那里，然后他们就可以访问余额了。

#### 如何正确操作

部署钱包的最佳方法是向其地址（尚未初始化）发送一些 TON，并清除 `bounce` 标志。完成这一步后，所有者就可以使用当前未初始化地址的资金部署和初始化钱包。这一步通常发生在第一次钱包操作中。

### TON 区块链可防止错误交易

在 TON 区块链中，标准钱包和应用程序通过使用可反弹地址和不可反弹地址自动管理向未初始化地址进行交易的复杂性，[此处](#bounceable-vs-non-bounceable-addresses) 对这两种地址进行了描述。钱包在向非初始化地址发送硬币时，通常会同时向可反弹地址和不可反弹地址发送硬币而不返回。

如果需要快速获取可跳转/不可跳转形式的地址，可以 [在此](https://ton.org/address/) 进行操作。

### 定制产品的责任

如果您要在 TON 区块链上开发定制产品，就必须实施类似的检查和逻辑：

确保您的应用程序在发送资金前验证收件人地址是否已初始化。
根据地址状态，为用户智能合约使用可反弹地址，并使用自定义应用逻辑确保资金退回。钱包使用不可反弹地址。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/examples.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/examples.md
================================================
# 智能合约示例

在这个页面上，您可以找到为各种程序软件实现的TON智能合约的参考。

:::info
确保在生产环境中使用它们之前彻底测试合约。这是确保您的软件正常运行和安全的关键步骤。
:::

## FunC智能合约

### 生产环境中使用的合约

| 合约                                                                                                                                                                                                                                                                                                            | 描述                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/wallet-contract\\&name=wallet-contract)</small>                                                                                         | Wallet v4是提出用于替换v3或更早的钱包的钱包版本                                                            |
| [liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/liquid-staking-contract/\\&name=liquid-staking-contract)</small>                                                       | Liquid Staking (LSt)是一个协议，连接所有水平的TON持有者与硬件节点运营商，通过资产池参与TON区块链验证。      |
| [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/EmelyanenkoK/modern_jetton\\&name=modern_jetton)</small>                                                                                | 实现标准jetton，附加withdraw_tons和withdraw_jettons功能。 |
| [governance-contract](https://github.com/ton-blockchain/governance-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/governance-contract\\&name=governance-contract)</small>                                                                         | TON区块链核心合约`elector-code.fc`和`config-code.fc`。                                            |
| [bridge-func](https://github.com/ton-blockchain/bridge-func) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/bridge-func\\&name=bridge-func)</small>                                                                                                         | TON-EVM Toncoin桥。                                                                        |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/token-bridge-func\\&name=token-bridge-func)</small>                                                                                 | TON-EVM代币桥 - FunC智能合约。                                                                   |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal\\&name=lockup-wallet-contract/universal)</small> | Universal lockup wallet是可以存储锁定的和受限的代币的合约。                                                |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting\\&name=lockup-wallet-contract/vesting)</small>         | Vesting钱包智能合约                                                                            |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/multisig-contract\\&name=multisig-contract)</small>                                                                                 | `(n, k)`-多签名钱包是一个拥有`n`个私钥持有者的钱包，如果请求收集到至少`k`个持有者的签名，则接受发送消息的请求。                          |
| [token-contract](https://github.com/ton-blockchain/token-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/token-contract\\&name=token-contract)</small>                                                                                             | 可替代、不可替代、半可替代代币智能合约                                                                      |
| [dns-contract](https://github.com/ton-blockchain/dns-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/dns-contract\\&name=dns-contract)</small>                                                                                                     | `.ton`区域的智能合约。                                                                           |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/nominator-pool\\&name=nominator-pool)</small>                                                                                             | Nominator池智能合约                                                                           |
| [single-nominator-pool](https://github.com/orbs-network/single-nominator) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/nominator-pool\\&name=nominator-pool)</small>                                                                                      | 单一Nominator池智能合约                                                                         |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/nominator-pool\\&name=nominator-pool)</small>                                                                                         | Nominator池智能合约                                                                           |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont\\&name=storage)</small>                                       | TON存储提供商和制造合约                                                                            |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/nominator-pool\\&name=nominator-pool)</small>                                                                                         | Nominator池智能合约                                                                           |
| [ton-random](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont\\&name=storage)</small>                                    | TON存储提供商和制造合约                                                                            |

### 生态系统合约

| 合约                                                                                                                                                                                                                                                                                                                          | 描述                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [telemint](https://github.com/TelegramMessenger/telemint) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/TelegramMessenger/telemint\\&name=telemint)</small>                                                                                                                             | Telegram用户名(`nft-item.fc`)和Telegram号码(`nft-item-no-dns.fc`)合约。 |
| [WTON](https://github.com/TonoxDeFi/WTON) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/TonoxDeFi/WTON\\&name=WTON)</small>                                                                                                                                                             | 此智能合约提供了称为WTON的wrapped toncoin的实现                                                                    |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/TonoxDeFi/capped-fungible-token\\&name=capped-fungible-token)</small>                                                                                         | Jetton钱包和Jetton铸币的基本智能合约实现                                                                           |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources\\&name=getgems-io/nft-contracts)</small>                       | Getgems NFT合约                                                                                        |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-defi-org/lockup-wallet-deployment\\&name=lockup-wallet-deployment)</small>                                                                       | 部署和运行锁定合约的端到端实现                                                                                      |
| [wton-contract](https://github.com/ton-community/wton-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-community/wton-contract\\&name=wton-contract)</small>                                                                                                                 | wTON合约                                                                                               |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-community/contract-verifier-contracts\\&name=contract-verifier-contracts)</small>                                                         | 存储每个代码cell哈希的链上证明的源注册合约。                                                                             |
| [vanity-contract](https://github.com/ton-community/vanity-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-community/vanity-contract\\&name=vanity-contract)</small>                                                                                                         | 允许为任何合约“挖掘”任何合适地址的智能合约。                                                                              |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-foundation/ton-config-smc\\&name=ton-config-smc)</small>                                                                                                           | 简单的用于在TON区块链中存储版本化数据的合约。                                                                             |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func\\&name=ratelance)</small>                                                                             | Ratelance是一个自由职业平台，旨在消除潜在雇主和工作者之间的障碍。                                                                |
| [ton-forwarder.fc](https://github.com/TrueCarry/ton-contract-forwarder/blob/main/func/ton-forwarder.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/TrueCarry/ton-contract-forwarder/blob/main/func/ton-forwarder.fc\\&name=ton-forwarder.fc)</small>                 | 接受确切金额并将其转发到指定地址的合约。错误金额或后续退款时退还资金。                                                                  |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc\\&name=logger.fc)</small>                                                 | 将数据保存在本地存储中的合约。                                                                                      |
| [ton-nominators](https://github.com/tonwhales/ton-nominators) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-nominators\\&name=ton-nominators)</small>                                                                                                                     | Ton Whales Nominator池源代码。                                                                            |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-link/ton-link-contract-v3\\&name=ton-link-contract-v3)</small>                                                                                               | Ton-link允许智能合约访问区块链外的数据，同时保持数据安全。                                                                    |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/delab-team/contracts/tree/main/fungible-token\\&name=delab-team/fungible-token)</small>                                                     | DeLab TON可替代代币实现                                                                                     |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc\\&name=whitelisted-wallet.fc)</small> | 简单的白名单钱包合约                                                                                           |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/delab-team/contracts/tree/main/jetton-pool\\&name=delab-team/jetton-pool)</small>                                                                 | Jetton Pool TON智能合约旨在创建farm pools。                                                                   |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ston-fi/dex-core/tree/main/contracts\\&name=ston-fi/contracts)</small>                                                                                       | Stonfi DEX核心合约                                                                                       |
| [onda-ton](https://github.com/0xknstntn/onda-ton) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/0xknstntn/onda-ton\\&name=onda-ton)</small>                                                                                                                                             | Onda借贷池 - TON上首个借贷协议的核心智能合约                                                                          |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ProgramCrafter/ton-stable-timer\\&name=ton-stable-timer)</small>                                                                                                   | TON稳定计时器合约                                                                                           |
| [HipoFinance/contract](https://github.com/HipoFinance/contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/HipoFinance/contract\\&name=HipoFinance)</small>                                                                                                                          | hTON是TON区块链上的去中心化、无需许可的开源流动性质押协议                                                                     |

### 学习合约

| 合约                                                                                                                                                                                                                                                                                                                                                                   | 描述                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc\\&name=counter.fc)</small>                                                                          | 带有评论的counter(计数器)智能合约。 |
| [simple-distributor](https://github.com/ton-community/simple-distributor) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/ton-community/simple-distributor\\&name=simple-distributor)</small>                                                                                                                                      | 简单的TON分发器。                                |
| [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc\\&name=ping-pong.fc)</small>                                                                    | 测试以不同模式发送Toncoin的简单合约。                    |
| [ton-random](https://github.com/puppycats/ton-random) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/puppycats/ton-random\\&name=ton-random)</small>                                                                                                                                                                              | 将帮助您在链上生成随机数的两个合约。                        |
| [Blueprint simple contract](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc\\&name=simple_contract)</small>                                                                                | 示例智能合约                                    |
| [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc\\&name=jetton_minter.fc)</small> | 铸造Jettons的智能合约示例。                         |
| [Simple TON DNS Subdomain manager](https://github.com/Gusarich/simple-subdomain) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/Gusarich/simple-subdomain\\&name=Simple_TON_DNS_Subdomain_manager)</small>                                                                                                                        | TON DNS子域名管理器。                            |
| [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func) <br /> <small>🪄 [在WebIDE中运行](https://ide.ton.org/?importURL=https://github.com/disintar/sale-dapp/tree/master/func\\&name=disintar/sale-dapp)</small>                                                                                                                                | React + NFT销售DApp与FunC                    |

### TON智能挑战

#### TON智能挑战1

- https://github.com/nns2009/TON-FunC-contest-1/tree/main
- https://github.com/pyAndr3w/func-contest1-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1

#### TON智能挑战2

- https://github.com/ton-blockchain/func-contest2-solutions
- https://github.com/nns2009/TON-FunC-contest-2
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2

#### TON智能挑战3

- https://github.com/nns2009/TON-FunC-contest-3
- https://github.com/shuva10v/func-contest3-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3

#### TON智能挑战4

- https://github.com/akifoq/tsc4 (最佳优化)
- https://github.com/Gusarich/tsc4
- https://github.com/Skydev0h/tsc4
- https://github.com/aSpite/tsc4-contracts (FunC解决方案)
- [https://github.com/ProgramCrafter/tsc4](https://github.com/ProgramCrafter/tsc4/tree/c1616e12d1b449b01fdcb787a3aa8442e671371e/contracts) (FunC解决方案)

## Fift智能合约

- [CreateState.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/CreateState.fif)
- [asm-to-cpp.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/asm-to-cpp.fif)
- [auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/auto-dns.fif)
- [complaint-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-req.fif)
- [complaint-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-signed.fif)
- [config-proposal-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-req.fif)
- [config-proposal-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-signed.fif)
- [create-config-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-proposal.fif)
- [create-config-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-upgrade-proposal.fif)
- [create-elector-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-elector-upgrade-proposal.fif)
- [envelope-complaint.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/envelope-complaint.fif)
- [gen-zerostate-test.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate-test.fif)
- [gen-zerostate.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate.fif)
- [highload-wallet-v2-one.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-one.fif)
- [highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2.fif)
- [highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet.fif)
- [manual-dns-manage.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/manual-dns-manage.fif)
- [new-auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-auto-dns.fif)
- [new-highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)
- [new-highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet.fif)
- [new-manual-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-manual-dns.fif)
- [new-pinger.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pinger.fif)
- [new-pow-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pow-testgiver.fif)
- [new-restricted-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet.fif)
- [new-restricted-wallet2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet2.fif)
- [new-restricted-wallet3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet3.fif)
- [new-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-testgiver.fif)
- [new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)
- [new-wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif)
- [new-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)
- [show-addr.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/show-addr.fif)
- [testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/testgiver.fif)
- [update-config-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config-smc.fif)
- [update-config.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config.fif)
- [update-elector-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-elector-smc.fif)
- [validator-elect-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-req.fif)
- [validator-elect-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-signed.fif)
- [wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v2.fif)
- [wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif)
- [wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet.fif)
- [wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

## FunC库和帮助工具

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/elliptic-curves
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/slices
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils
- https://github.com/disintar/sale-dapp/tree/master/func

## 添加参考

如果您想分享新的智能合约示例，请为这个[页面](https://github.com/ton-community/ton-docs/tree/main/docs/develop/smart-contracts/examples.md)提交您的PR。

## 参阅

- [开发智能合约简介](/develop/smart-contracts/)
- [如何使用钱包智能合约](/develop/smart-contracts/tutorials/wallet)
- [[YouTube] Ton Dev 研究 FunC & BluePrint课程](https://www.youtube.com/watch?v=7omBDfSqGfA\\&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/governance.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/governance.md
================================================
# 治理合约

在TON中，与TVM、catchain、费用和链拓扑（以及这些参数如何存储和更新）有关的节点操作共识参数由一组特殊的智能合约控制（与前几代区块链采用的旧式和不灵活的硬编码这些参数的方式不同）。通过这种方式，TON实现了全面透明的链上治理。这组特殊合约本身受参数控制，目前包括选举人、配置合约和DNS合约，将来将通过额外的货币铸币和其他合约进行扩展。

## 选举人(Elector)

选举人智能合约控制验证轮次的更替方式、谁获得验证区块链的职责以及如何分配验证奖励。如果您想成为验证者并与选举人互动，请查看[验证者说明](https://ton.org/validator)。

选举人存储未提取的Toncoin数据在`credits`哈希表中，新的申请在`elect`哈希表中，以及关于以往选举的信息在 *past\*elections* 哈希表中（后者存储在关于验证者不当行为的 *complaints* 和_frozen\*-已完成轮次的验证者质押中，这些质押被扣留用于 `stake_held_for`（配置参数15））。选举人合约有三个目的：

- 处理验证者选举的申请
- 举行选举
- 处理验证者不当行为的报告
- 分配验证奖励

### 处理申请

要创建申请，未来的验证者需要形成一个包含相应参数（ADNL地址、公钥、`max_factor`等）的特殊消息，将其附加到一定数量的TON（称为质押），并发送给选举人。反过来，选举人检查这些参数，要么注册申请，要么立即将质押退还给发送者。请注意，只接受来自主链地址的申请。

### 举行选举

选举人是一个特殊的智能合约，可以在每个区块的开始和结束时被强制调用（所谓的Tick和Tock交易）。选举人确实在每个区块上被调用，并检查是否是举行新选举的时候。

选举过程的总体概念是考虑所有申请，特别是它们的TON数量和`max_factor`（此申请人同意做的验证工作与最弱验证者做的验证工作相比的最大比例），并按照TON数量为每个验证者设置权重，但要满足所有`max_factor`条件。

技术实现如下：

1. 选举人取出所有质押金额高于当前网络最低`min_stake`（配置参数17）的申请。
2. 按质押金额降序排列。
3. 如果参与者多于验证者的最大数量（`max_validators` 配置参数16），则舍弃名单尾部。
4. 从`1`循环到`N`（剩余参与者数量）。

- 取名单中按降序排列的第`i`个元素
- 假设第_i_个候选人将是最后一个被接受的（因此权重最低），并根据`max_factor`计算有效质押（`true_stake`）。换句话说，第_j_个（`j<i`）申请人的有效质押计算为`min(stake[i]*max_factor[j], stake[j])`。
- 计算第1个到第_i_个参与者的总有效质押（TES）。如果这个TES高于先前已知的最大TES，则将其视为当前最佳权重配置。

5. 获取当前最佳配置，即最大化利用质押的权重配置，并将其发送给配置合约（下面的配置合约）以成为新的验证者集合。
6. 将所有未使用的质押，例如那些没有成为验证者的申请人和多余的部分（如果有的话）`stake[j]-min(stake[i]*max_factor[j], stake[j])`放入`credits`表中，申请人可以从中请求拿回它们。

这样，如果我们有9个候选人，每个人有100,000和2.7的因子，最后一个参与者不会被选举：没有他，有效质押将是900,000，有他，只有9 \* 27,000 + 10,000 = 253,000。相反，如果我们有一个候选人有100,000和2.7的因子和9个参与者各有10,000，他们都将成为验证者。但是，第一个候选人只会质押10\*2.7 = 27,000 TON，多出的73,000 TON进入`credits`。

请注意，对结果验证集有一些限制（显然由TON配置参数控制），特别是`min_validators`、`max_validators`（配置参数16）、`min_stake`、`max_stake`、`min_total_stake`、`max_stake_factor`（配置参数17）。如果目前的申请无法满足这些条件，选举将被推迟。

### 报告验证者不当行为的过程

每个验证者不时被随机分配创建新区块的任务（如果验证者在几秒钟后失败，这个职责将传递给下一个验证者）。这种分配的频率由验证者的权重决定。因此，任何人都可以从上一个验证轮次获取区块，并检查生成的区块数量是否接近实际数量。统计上显著的偏差（生成的区块数量少于预期）意味着验证者的不当行为。在TON上，使用Merkle证明相对容易证明不当行为。选举人合约接受这种证明和所建议的罚款，任何愿意支付其存储费用的人都可以注册投诉。然后，当前轮次的每个验证者检查投诉，如果它是正确的，并且建议的罚款与不当行为的严重性相符，他们会为其投票。获得超过2/3的权重投票后，投诉被接受，罚款从`past_elections`对应元素的`frozen`哈希表中扣除。

### 分配验证奖励

与检查是否是进行新选举的时候一样，选举人在每个区块中都会检查是否是释放`frozen`中存储的`past_elections`的资金的时候。在相应的区块中，选举人将相应验证轮次积累的收益（gas费和区块创建奖励）按验证者权重比例分配给该轮次的验证者。之后，质押和奖励被添加到`credits`表中，选举从`past_elections`表中删除。

### 配置(Config)

配置智能合约控制TON配置参数。其逻辑决定了谁以及在什么条件下有权更改这些参数中的一些。它还实现了提案/投票机制和验证者集合滚动更新。

## 验证者集合滚动更新

一旦配置合约从选举人合约收到特殊消息，通知其新的验证者集合已经被选举出来，配置将新的验证者集合放到配置参数36（下一个验证者）。然后，在每个区块的TickTock交易期间，配置检查是否是应用新验证者集合的时候（验证者集合本身嵌入了时间`utime_since`），并将之前的集合从配置参数34（当前验证者）移动到配置参数32（之前的验证者），并从配置参数36设置到配置参数34。

### 提案/投票机制

任何愿意支付存储提案费用的人都可以通过向配置合约发送相应消息来提议更改一个或多个配置参数。反过来，当前集合中的任何验证者都可以通过用他们的私钥签署批准消息来为这个提案投票（注意相应的公钥存储在配置参数34中）。在获得或不获得3/4的投票（根据验证者权重）后，提案获胜或输掉一轮。在赢得足够多轮次的关键次数（`min_wins`配置参数11）后，提案被接受；在输掉足够多轮次的关键次数（`max_losses`配置参数11）后，它被丢弃。
请注意，一些参数被认为是关键的（关键参数集本身是配置参数配置参数10），因此需要更多轮次才能被接受。

### 提案/投票机制

任何愿意支付存储提案费用的人都可以通过向配置合约发送相应消息来提议更改一个或多个配置参数。反过来，当前集合中的任何验证者都可以通过用他们的私钥签署批准消息来为这个提案投票（注意相应的公钥存储在配置参数34中）。在获得或不获得3/4的投票（根据验证者权重）后，提案获胜或输掉一轮。在赢得足够多轮次的关键次数（`min_wins`配置参数11）后，提案被接受；在输掉足够多轮次的关键次数（`max_losses`配置参数11）后，它被丢弃。
请注意，一些参数被认为是关键的（关键参数集本身是配置参数配置参数10），因此需要更多轮次才能被接受。

验证者可以投票分配一个特殊的公钥，以便在无法通过投票机制进行时能够更新配置参数。这是网络积极发展期间必要的临时措施。预计随着网络的成熟，这种措施将逐渐淘汰。一旦开发和测试完成，密钥将被转移到多签名解决方案。一旦网络证明了其稳定性，紧急机制将被完全废除。

#### 紧急更新

紧急更新的历史：

验证者确实在2021年7月投票将该密钥分配给TON基金会（主链区块`12958364`）。请注意，这样的密钥只能用来加速配置更新。它无法干预任何链上的任何合约的代码、存储和余额。

紧急更新的历史：

- [预编译合约](/develop/smart-contracts/core-contracts/precompiled)
- 2023年3月2日，申请选举的数量增长到即使`20m`也不足以进行选举。然而，这一次由于更高的`hard_limit`，主链继续处理外部消息。紧急密钥被用于更新配置参数20 `special_gas_limit`至25m和`block_gas_limit`至27m（在区块`27747086`中）。结果，选举在下一个区块中成功进行。选举的总延迟约为6小时，除选举外，主链和基本链的功能未受影响。
- 2023年11月22日，密钥被用于[放弃自己](https://t.me/tonblockchain/221)（在区块`34312810`中）。结果，公钥被替换为32个零字节。
- 由于切换到OpenSSL实现的Ed25519签名验证，检查特殊情况[所有公钥字节都相同](https://github.com/ton-blockchain/ton/blob/7fcf26771748338038aec4e9ec543dc69afeb1fa/crypto/ellcurve/Ed25519.cpp#L57C1-L57C1)被禁用。因此，针对零公钥的检查按预期停止工作。利用这个问题，紧急密钥在12月9日[再次更新](https://t.me/tonstatus/80)（在区块`34665437`，[交易](https://tonscan.org/tx/MU%2FNmSFkC0pJiCi730Fmt6PszBooRZkzgiQMv0sExfY=)），为 nothing-in-my-sleeve字节序列`82b17caadb303d53c3286c06a6e1affc517d1bc1d3ef2e4489d18b873f5d7cd1`，这是`sha256("Not a valid curve point")`。现在，更新网络配置参数的唯一方法是通过验证者共识。

## 参阅

- [预编译合约](/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/highload-wallet.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/highload-wallet.md
================================================
# 高负载钱包

在短时间内处理大量信息时，需要使用名为 "Highload Wallet "的特殊钱包。在很长一段时间里，Highload Wallet V2 是 TON 的主要钱包，但使用时必须非常小心。否则，您可能会[锁定所有资金](https://t.me/tonstatus/88)。

[随着 Highload Wallet V3](https://github.com/ton-blockchain/Highload-wallet-contract-v3)的问世，这一问题已在合约架构层面得到解决，而且耗 gas 量更少。本章将介绍 Highload Wallet V3 的基础知识和需要记住的重要细微差别。

## 高负载钱包 v3

该钱包专为需要以极高的速度发送交易的用户设计。例如，加密货币交易所。

- [源代码](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

向 Highload v3 发送的任何给定外部报文（传输请求）都包含：

- 顶层 cell 中的签名（512 位）--其他参数位于该 cell 的 ref 中
- 子钱包 ID（32 位）
- 作为 ref 发送的消息（将被发送的序列化内部消息）
- 报文的发送模式（8 位）
- 复合查询 ID - 13 位 "位移 "和 10 位 "位数"，但 10 位位数只能到 1022，而不是 1023，而且最后一个可用的查询 ID（8388605）是为紧急情况保留的，通常不应使用
- 创建于, 或消息时间戳
- 超时

超时作为参数存储在 Highload 中，并与所有请求中的超时进行核对，因此所有请求的超时都是相同的。信息到达 Highload 钱包时的时间不应早于超时时间，或在代码中要求 `created_at > now() - timeout`。出于重放保护的目的，查询 ID 的存储时间至少为超时时间，最长可能为 2 \* 超时时间，但不应期望其存储时间超过超时时间。子钱包 ID 会与钱包中存储的 ID 进行核对。内部 ref 的哈希值与签名一起与钱包的公钥进行核对。

Highload v3 只能从任何给定的外部信息中发送 1 条信息，但它可以通过一个特殊的操作码将信息发送给自己，这样就可以在调用内部信息时设置任何操作 cell ，从而有效地使 1 条外部信息可以发送多达 254 条信息（如果在这 254 条信息中还有另一条信息发送到 Highload 钱包，那么发送的信息数量可能会更多）。

一旦所有检查都通过，Highload v3 将始终存储查询 ID（重放保护），但由于某些情况，包括但不限于以下情况，可能无法发送信息：

- **包含状态初始**（如有需要，可使用特殊操作码发送此类信息，以便在高负载钱包向自身发送内部信息后设置操作 cell ）
- 余额不足
- 无效的报文结构（包括外部输出报文--只有内部报文可以直接从外部报文发送）

Highload v3 绝不会执行包含相同 `query_id` **和** `created_at` 的多个外部请求--当它忘记任何给定的 `query_id` 时，`created_at` 条件将阻止此类信息的执行。这实际上使 `query_id` **和** `created_at` 成为 Highload v3 传输请求的 "主键"。

在迭代（递增）查询 ID 时，像递增普通数字一样，先迭代位数，然后再迭代位移，这样会更省钱（从花费的 TON 数来看）。到达最后一个查询 ID 后（请记住紧急查询 ID - 见上文），您可以将查询 ID 重置为 0，但如果 Highload 的超时时间尚未过去，则重放保护字典将满，您必须等待超时时间过去。

## 高负载钱包 V2

:::danger
建议使用 Highload wallet v3。
:::

该钱包专为需要在短时间内发送数百笔交易的用户设计。例如，加密货币交易所。

它允许你在一次智能合约调用中发送多达 254 个交易。它还使用了一种略有不同的方法来解决重放攻击，而不是 seqno，所以你可以同时多次调用这个钱包，甚至在一秒钟内发送数千个交易。

:::caution 局限性
注意，在处理高负载钱包时，需要检查并考虑以下限制。
:::

1. **存储容量限制。** 目前，合约存储容量应小于 65535 个 cell 。如果
   old_queries 的大小超过此限制，将在 ActionPhase 中抛出异常，事务将失败。
   失败的事务可以重放。
2. **gas 限制。** 目前， gas 限制为 1'000'000 GAS 单位，这意味着一个 tx 中可清理的
   旧查询次数是有限制的。如果过期查询次数较多，合约就会卡住。

这意味着不建议设置过高的过期日期：
，过期时间跨度内的查询次数不应超过 1000 次。

此外，一次交易中清理的过期查询次数应低于 100 次。

## 如何

您还可以阅读 [Highload Wallet Tutorials](/v3/guidelines/smart-contracts/howto/wallet#-high-load-wallet-v3) 一文。

钱包源代码：

- [ton/crypto/smartcont/Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/nominator-pool.mdx
================================================
# 提名池

一个名为 "提名者池 "的智能合约可以让一个或多个提名者借出 Toncoin 作为验证者的股份，并确保验证者只能将 Toncoin 用于验证。此外，智能合约还保证了奖励的分配。

## 架构

![image](/img/nominator-pool/nominator-pool.png)

## 限制

该池专为大量代币设计。

在开发过程中，主要的标准是代码的安全性和简洁性。

池不支持小额存款，也不支持在一个资金池中有大量提名人。

经测试的目标配置为：提名人最低持股量为 1 万 TON ，提名池最多有 40 个提名人。

我们强烈建议在进行此类测试之前，不要将提名人数设定为 40 人以上。

## 费用

由于该池位于费用较高的主链中，因此每轮验证将花费约 **5  TON **来运营该池。

操作费由验证人支付。

:::info
请注意，存储池余额应始终为 **10 TON** - 这是支付网络存储费的最低余额。10 TON 不能提取。
:::

## 奖励分配

在每一轮验证中，"池 "都会向 "选举人 "智能合约发送质押。

一轮验证结束后，池向选民收回资金。

通常收到的金额大于发送的金额，差额就是验证奖励。

验证器根据不可变的池参数 `validator_reward_share` 获得奖励份额。

```
validator_reward = (reward * validator_reward_share) / 10000;
nominators_reward = reward - validator_reward;
```

提名人根据其质押大小分享剩余奖励。

例如，如果池中有两个提名人，质押分别为 10 万 TON 和 30 万 TON ，那么第一个提名人将获得 "提名人奖励 "的 25%，第二个提名人将获得 "提名人奖励 "的 75%。

### 削减提名池

如果验证罚款数额较大，当收到的金额少于发出的金额时，损失将从验证者的资金中扣除。

如果验证人的资金不足，那么剩余的损失将从提名人的质押中按比例扣除。

请注意，提名池的设计方式是，验证器的资金应始终足以支付最高罚款。

## 验证员的责任

只有当验证器资金超过不可变池参数 `min_validator_stake` 时，池才能参与验证。

此外，验证器的资金必须超过对错误验证的最高罚款额。建议罚款根据网络配置计算。

否则，程序池将不会发送参与验证轮的请求。

## 提名者信息

要与提名者池互动，提名者可向池智能合约发送带有文本注释的简单消息（可从任何钱包应用程序发送）。

**信息必须以可反弹模式发送！**

如果出现错别字或无效信息，信息会弹回到发件人。

如果您在非弹跳模式下发送拼写错误的信息或无效信息，您将损失代币。

## 提名人保证金

为了让提名人存款，他需要向提名人池智能合约发送带有 Toncoin 的信息，并发送文本注释 "d"。

提名人只能从位于基链（原始地址为 "0:..."）的钱包发送信息。

 TON 币金额必须大于或等于 `min_nominator_stake + 1 TON`。

存款时扣除 1  TON ，作为存款处理佣金。

如果池当前未参与验证（"state ==0"），则存款将立即存入。

如果当前池正在参与验证（`state != 0`），则该金额将被添加到提名人的`pending_deposit_amount`（待定存款金额）中，并在当前一轮验证完成后记入贷方。

提名人随后可以发送更多的 Toncoin 来增加存款。

需要注意的是，如果提名人池中的提名人数已经达到 "max_nominators_count"（最大提名人数），那么来自新提名人的存款将被拒绝（会被退回给发件人）。

## 提名人退出

要提取资金，提名人需要向提名人池智能合约发送信息，并附上文本注释 "w "和一些用于支付网络费用的 Toncoin （1  Toncoin 即可）。除极少数情况外，信息中未使用的 TON 币将被退回。

如果提名者奖池余额中有足够的 Toncoin ，将立即提款。如果提名人池已完成一轮验证，但尚未提交新一轮验证申请，则所有资金都将计入提名人池余额。

如果提名人池余额中没有足够的 Toncoin ，则会向提名人发出 "提款请求"， Toncoin 将在本轮验证结束后被提取。

提名人只能一次性提取全部资金。不支持部分提款。

## 验证器退出

验证人可以从池中提取不属于提名人的所有代币。

## 参与者必须保管好自己的私人密钥

如果提名人丢失了存款的钱包，将无法从资金池中提取资金。

如果验证者失去了对钱包的访问权限，那么他将无法从池中提取他（验证者）的资金。

一个池参与者的钱包私钥丢失不会影响其他参与者。

## 紧急撤离

在正常运行时，验证器必须定期向提名者集群发送操作信息，例如 `process withdraw requests`, `update current validator set`, `new_stake`, `recover_stake` 。

验证软件 mytonctrl 会自动完成这项工作。

在紧急情况下，例如验证人失踪或停止履行职责，任何人都可以发送这些操作信息，从而使提名人可以提取资金。

## 网络配置提案投票

在 TON 中，网络配置更改是通过 [验证人投票](/v3/documentation/smart-contracts/contracts-specs/governance#proposalvoting-mechanism) 进行的。

在提名人库的情况下，所有参与者都可以投票，最终结果将以提名人库的名义发送。

因此，提名者池智能合约有一个内置功能，验证者和提名者可以在此功能中表明他们对特定提案的支持/反对票。

在此基础上，验证器通过验证器软件将最终投票结果发送给网络配置智能合约。

如果验证者将最终投票结果发送给网络配置智能合约，而投票结果与池中大多数人的意见不一致，在这种情况下，提名者可以离开（也将离开）这个池，转到另一个池。

由于一切都通过链上交易进行，因此这种不匹配将被存储在区块链上，每个人都能看到。

## 提名人投票

每项新的网络配置变更提案最初都会发布到 TON 基金会频道 [@tonblockchain](https://t.me/tonblockchain) 或 [@tonstatus](https://t.me/tonstatus) 上。

在本帖中，除了对提案的描述外，提案的哈希值将以 HEX 表示，例如 `D855FFBCF813E50E10BEAB902D1177529CE79785CAE913EB96A72AE8EFBCBF47`。

为了让提名人对提案投赞成票，他需要向提名人池智能合约发送一条信息，并附上文字注释 `y<HASH>`。

为了让提名人对提案投反对票，他需要向提名人池智能合约发送一条信息，并附上文字注释 `n<HASH>`。

必须在该信息中附加一定数量的代币才能支付网络费用（1 TON 即可）。信息中未使用的 TON 将被退回。

投票将在投票池合约中保存 30 天。

只有审定人和在人才库中拥有有效股份的当前提名人才能投票。

## 获取方法 `get_pool_data`

返回：

1. state - uint - 提名者当前的状态。0 - 不参与验证，1 - 发送了参与验证的 "new_stake "请求，2 - 收到了参与验证的成功确认。
2. nominators_count - uint - 当前提名池中的提名人数。
3. stake_amount_sent - nanotons - 有了这样的质押金额，赌池才会参与本轮验证。
4. validator_amount - nanotons  - 验证器拥有的硬币数量。
5. validator_address - immutable - uint - 验证器钱包地址。要获取地址，请执行 `"-1:" + dec_to_hex(validator_address)`。
6. validator_reward_share - immutable - uint - 验证器从验证中获得的奖励份额。 `validator_reward = (reward * validator_reward_share) / 10000`。  例如，设置 4000 可获得 40%。
7. max_nominators_count - immutable - uint - 提名者数量上限。
8. min_validator_stake - immutable - nanotons  - 本池中验证器的最小质押。
9. min_nominator_stake - immutable - nanotons  - 提名者在本池中的最小质押。
10. nominators - Cell - 含提名人的原始字典。
11. withdraw_requests -  cell  - 包含提名人撤回请求的原始字典。
12. stake_at - uint - 我们正在/将要参与的一轮验证的 ID。下一轮验证的预计开始时间（`utime_since`）。
13. saved_validator_set_hash - uint - 技术信息。
14. validator_set_changes_count - uint - 技术信息。
15. validator_set_change_time - uint - 技术信息。
16. stake_held_for - uint - 技术信息。
17. config_proposal_votings -  cell  - 包含配置建议投票的原始字典。

## 获取方法 `list_nominators`

返回当前提名池的提名人列表。

每个条目包括

1. address - uint - 提名者钱包地址。要获取地址，请执行 `"0:"。+ dec_to_hex(address)`。
2. amount - nanotons - 提名者当前的有效木桩。
3. pending_deposit_amount - nanotons  - 将在下一轮验证时加入提名者有效质押的存款金额。
4. withdraw_request - int - 如果 `-1`，则该提名人发出了提取全部资金的请求。

## 获取方法 `get_nominator_data`

它将提名人的地址作为参数并返回：

1. amount - nanotons - 提名者当前的有效木桩。
2. pending_deposit_amount - nanotons  - 将在下一轮验证时加入提名者有效质押的存款金额。
3. withdraw_request - int - 如果 `-1`，则该提名人发出了提取全部资金的请求。

如果提名池中没有这样的提名者，则抛出 `86` 错误。

例如，要获取地址为`EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG`的提名人，需要将地址转换为原始格式`0.EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG`：348bcf827469c5fc38541c77fdd91d4e347eac200f6f2d9fd62dc08885f0415f`, 删除 `0:`并调用`get_nominator_data 0x348bcf827469c5fc38541c77fdd91d4e347eac200f6f2d9fd62dc08885f0415f\`。

## 获取方法 `list_votes`

返回选票列表。

每个条目包括

1. proposal_hash - uint - 提案的哈希值。使用 `dec_too_hex(proposal_hash)` 将哈希值转换为 HEX 格式。
2. votes_create_time - uint - 创建此投票的时间。

## 获取方法 `list_voters`

它将提案的哈希值作为参数，并返回投票人列表：

每个条目包括

1. address - 投票人地址。要获取提名人地址，执行 `"0:"。+ dec_to_hex(address)`，如果`address = validator_address`，则执行`"-1:" + dec_to_hex(address)`。
2. support - int - 如果为 `-1`，则投 "赞成票"，否则投 "反对票"。
3. vote_time - uint - 他投票的时间。

投票结果在链外计算。

## 与钱包应用程序集成

对于存款、取款和投票，可向资金池发送简单的信息，并在信息中添加上述所需的文字注释。

发送存款时，可以将发送的金额存储在本地存储中。

发送再存款时，也将其添加到此金额中。

要找出当前利润，请调用获取方法 `get_nominator_data(your_address)`。利润将为（`金额 + 待处理存款金额 - 已存储在本地存储区的发送金额`）。

要获取数据池的信息，请调用 `get_pool_data` 和 `list_nominators` 获取方法。

## 另请参见

- [提名者池合约](https://github.com/ton-blockchain/nominator-pool)
- [如何使用提名池](/v3/guidelines/smart-contracts/howto/nominator-pool)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts.md
================================================
# 预编译合约

*预编译智能合约*是在节点中使用 C++ 实现的合约。
当验证器在这种智能合约上运行交易时，它可以执行这种实现，而不是 TVM。
这样可以提高性能，减少计算费用。

## 配置

预编译合约列表存储在主链配置中：

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

`list:(HashmapE 256 PrecompiledSmc)` 是一个映射 `(code_hash -> precomplied_smc)`。
如果在这个映射中找到了合约的代码哈希值，那么该合约就被视为*预编译*。

## 合约执行

*预编译智能合约*（即代码哈希值在 `ConfigParam 45` 中找到的任何合约）上的任何交易都会以如下方式执行：

1. 从主链配置中获取 `gas_usage` 。
2. 如果余额不足以支付 `gas_usage` gas ，则计算阶段失败，跳过原因为 `cskip_no_gas`。
3. 代码有两种执行方式：
4. 如果禁用了预编译执行或当前版本的节点中没有 C++ 实现，则 TVM 将照常运行。TVM 的 gas 限制设置为事务 gas 限制（1M  gas ）。
5. 如果预编译实现已启用且可用，则执行 C++ 实现。
6. 覆盖 [计算相位值](https://github.com/ton-blockchain/ton/blob/dd5540d69e25f08a1c63760d3afb033208d9c99b/crypto/block/block.tlb#L308)：将 `gas_used` 设为 `gas_usage`；将 `vm_steps`、`vm_init_state_hash`、`vm_final_state_hash` 设为零。
7. 计算费用基于  `gas_usage`，而非 TVM 的实际用气量。

在 TVM 中执行预编译合约时，`c7` 的第 17 个元素被设置为  `gas_usage`，可通过 "GETPRECOMPILEDGAS "指令检索。对于非预编译合约，该值为 `null`。

预编译合约的执行默认为禁用。使用 `--enable-precompiled-smc`标记运行 `validator-engine` 可启用它。

请注意，执行预编译合约的两种方式都会产生相同的事务。
因此，有 C++ 实现和没有 C++ 实现的验证器都可以安全地在网络中并存。
这样就可以向 `ConfigParam 45` 添加新条目，而无需所有验证器立即更新节点软件。

## 现有实施方案

Hic sunt dracones.

## 另请参见

- [治理合约](/v3/documentation/smart-contracts/contracts-specs/governance)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool.md
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 单一提名池

[单一提名](https://github.com/orbs-network/single-nominator) 是一个简单的防火墙 TON 智能合约，可通过冷钱包对 TON 区块链进行安全验证。该合约专为拥有足够自我权益的 TON 验证者设计，无需依赖第三方提名者权益即可自行验证。该合约为 [Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool)智能合约提供了另一种简化的实现方式，只支持单一提名人。这种实现方式的好处是更安全，因为攻击面大大缩小。这是因为需要支持多个第三方提名者的提名者池的复杂性大大降低。

## 验证器的首选解决方案

该智能合约旨在为拥有足够股份自行验证的 TON 验证者提供最佳解决方案。其他可供选择的方案有

- 使用[热钱包](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)（不安全，因为如果验证器节点被黑客攻击，需要冷钱包来防止被盗）
- 使用 [restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc)（尚未维护，存在尚未解决的攻击向量，如 gas 流失攻击）
- 使用 [Nominator Pool](https://github.com/ton-blockchain/nominator-pool)，max_nominators_count = 1（不必要的复杂性，攻击面更大）。

请参阅下文更详细的 [现有替代品比较](#Comparison-of-Existing-alternatives)。

## 官方代码哈希值

在向真实合约发送资金之前，请在 https://verifier.ton.org 中检查这一点

```
pCrmnqx2/+DkUtPU8T04ehTkbAGlqtul/B2JPmxx9bo=
```

## 架构

其架构与 [Nominator Pool](https://github.com/ton-blockchain/nominator-pool) 合约几乎相同：

![image](/img/nominator-pool/single-nominator-architecture.png)

### 分离为两个角色

- *所有者* - 冷钱包（未连接互联网的私人密钥），拥有用于定级的资金，并充当单一提名人
- *验证器* - 私钥在验证器节点上的钱包（可以签署区块，但不能窃取用于入股的资金）

### 工作流程

1. *所有者*在其安全的冷钱包中持有投注资金 (\$$$)
2. *业主*将资金 (\$$$) 存入*单一分母*合约（本合约）
3. *MyTonCtrl* 开始在连接到互联网的验证器节点上运行
4. *MyTonCtrl* 使用 *Validator* 钱包指示 *SingleNominator* 进入下一个选举周期
5. *SingleNominator* 向 *Elector* 发送一个周期的质押 (\$$$)。
6. 选举周期已经结束，股权可以收回
7. *MyTonCtrl* 使用 *Validator* 钱包指示 *SingleNominator* 从选举周期中收回质押
8. *单提名人*从*选举人*处收回上一周期的质押 (\$$$)
9. 只要 *Owner* 愿意继续验证，就重复步骤 4-8
10. *业主*从*单一分母*合约中提取资金 (\$$$) 并带回家

## 减小攻击向量

- 验证器节点需要一个热钱包来签署新区块。这个钱包本质上是不安全的，因为它的私钥与互联网相连。即使这个密钥被泄露，*验证器*也无法提取用于验证的资金。只有*所有者*才能提取这些资金。

- 即使 *Validator* 钱包被入侵，*Owner* 也可以告诉 *SingleNominator* 更改验证器地址。这将阻止攻击者与 *SingleNominator* 进一步交互。这里不存在竞赛条件，*Owner* 始终优先。

- *SingleNominator* 余额仅持有本金质押资金 - 其余额不用于支付 gas 费。进入选举周期的 gas 费存放在 *Validator* 钱包中。这可以防止入侵验证器的攻击者通过 gas 支出攻击耗尽本金。

- *SingleNominator* 验证*Validator*给出的所有操作格式，确保不会将无效信息转发给*Elector*。

- 在紧急情况下，例如 *Elector* 合约升级并更改了界面，*Owner* 仍可作为 *SingleNominator* 发送任何原始信息，以从 *Elector* 收回质押。

- 在极端紧急的情况下，*Owner* 可以设置 *SingleNominator* 的代码，并覆盖其当前逻辑，以应对不可预见的情况。

使用常规的[提名池](https://github.com/ton-blockchain/nominator-pool) 合约无法减少其中一些攻击向量，因为这将允许运行验证器的人从其提名者那里窃取资金。这在 *SingleNominator* 中不是问题，因为 *Owner* 和 *Validator* 是由同一方拥有的。

### 安全审计

完整的安全审计由 Certik 进行，可在此 repo - [Certik Audit](https://github.com/orbs-network/single-nominator/blob/main/certik-audit.pdf) 中获取。

## 现有替代品比较

假设您是一名验证员，有足够的资金自行验证，以下是您可以使用 MyTonCtrl 的其他设置：

---

### 1. 简单的热钱包

这是最简单的设置，MyTonCtrl 与持有资金的同一个 [标准钱包](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) 相连。由于该钱包连接到互联网，因此被视为热钱包。

![image](/img/nominator-pool/hot-wallet.png)

这是不安全的，因为攻击者可以获取私钥，因为它连接到了互联网。有了私钥，攻击者就可以向任何人发送定金。

---

### 2. 受限钱包

这种设置用[受限钱包](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc)取代了标准钱包，只允许向受限目的地发送外向交易，如*选举人*和所有者的地址。

![image](/img/nominator-pool/restricted-wallet.png)

受限钱包未经维护（已被提名人池取代），存在尚未解决的攻击向量，如 gas 流失攻击。由于同一个钱包的余额中既有 gas 费也有质押本金，攻击者如果泄露了私钥，就会产生交易，造成重大本金损失。此外，由于 seqno 碰撞，攻击者和所有者在尝试提款时会出现竞赛条件。

---

### 3. 提名池

[提名池](https://github.com/ton-blockchain/nominator-pool) 首次将质押所有者（提名人）与连接到互联网的验证器明确分开。这种设置可支持多达 40 个提名人在同一验证机上共同投注。

![image](/img/nominator-pool/nominator-pool.png)

由于同时支持 40 个提名人，提名人库合约过于复杂。此外，合约还必须保护提名者与合约部署者，因为它们是独立的实体。这种设置还算可以，但由于攻击面太大，很难进行全面审核。当验证者没有足够的利益来单独验证，或希望与第三方利益相关者分享利润时，该解决方案就很有意义了。

---

### 4. 单一提名

这是本版本库中实现的设置。这是一个非常简化的提名池版本，只支持一个提名人，不需要保护提名人与合约部署者，因为它们是同一个实体。

![image](/img/nominator-pool/single-nominator-architecture.png)

如果您只有一个提名人持有所有质押进行验证，这是最安全的设置。除了简单之外，该合约还为所有者提供了多种紧急保障措施，即使在*选举人*升级导致恢复赌金界面被破坏等极端情况下，也能恢复赌金。

### 仅限所有者的信息

提名人所有者可以执行 4 项操作：

#### 1. `撤回`

用于向所有者的钱包提取资金。要提取资金，所有者应发送包含以下内容的消息：操作码=0x1000（32 位）、query_id（64 位）和提取金额（存储为硬币变量）。提名人合约将以 BOUNCEABLE 标志和模式=64 发送资金。 <br/><br/>
如果所有者使用的是**热钱包**（不推荐），可使用 [withdraw-deeplink.ts](https://github.com/orbs-network/single-nominator/blob/main/scripts/ts/withdraw-deeplink.ts) 生成一个深度链接，以启动从 tonkeeper 钱包取款。 <br/>
命令行： `ts-node scripts/ts/withdraw-deeplink.ts single-nominator-addr withdraw-amount` 其中：

- single-nominator-addr 是所有者希望退出的单一提名人地址。
- withdraw-amount 是要提取的金额。提名人合约将在合约中保留 1  TON ，因此发送到所有者地址的实际金额将是请求金额和合约余额之间的最小值 - 1。<br/>
  所有者应使用装有 tonkeeper 钱包的手机运行 deeplink。<br/>

如果所有者使用的是**冷钱包**（推荐），[withdraw.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/withdraw.fif) 可用于生成包含提款操作码和提款金额的 boc 主体。 <br/>
命令行： `fift -s scripts/fif/withdraw.fif withdraw-amount` 其中 withdraw-amount 是要从提名人合约提取到所有者钱包的金额。如上所述，提名人合约中将至少保留 1  TON 。 <br/>
该脚本将生成一个 boc 正文（名为 withdraw.boc），并在所有者的钱包中签署和发送。 <br/>
所有者应在黑色电脑上运行

- 创建并签署 tx： `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B withdraw.boc`，其中 my-wallet 是所有者的 pk 文件（不带扩展名）。1 TON 的金额应足以支付费用（剩余金额将返还给所有者）。withdraw.boc 就是上面生成的 boc。
- 在能上网的电脑上运行`lite-client -C global.config.json -c 'sendfile wallet-query.boc'`发送前一步生成的 boc 文件（wallet-query.boc）。

#### 2. `更改验证器`

用于更改验证器地址。验证人只能向选举人发送 NEW_STAKE 和 RECOVER_STAKE。如果验证人私钥泄露，验证人地址也可以更改。请注意，在这种情况下，资金是安全的，因为只有所有者才能提取资金。<br/>

如果所有者使用的是**热钱包**（不推荐），可使用 [change-validator-deeplink.ts](https://github.com/orbs-network/single-nominator/blob/main/scripts/ts/change-validator-deeplink.ts) 生成一个深层链接来更改验证器地址。 <br/>
命令行： `ts-node scripts/ts/change-validator-deeplink.ts single-nominator-addr new-validator-address` 其中：

- single-nominator-addr 是单一提名人地址。
- new-validator-address（默认为 ZERO 地址）是新验证器的地址。如果您想立即禁用验证器，然后再设置新的验证器，将验证器地址设置为 ZERO 地址可能会比较方便。
  所有者应使用装有 tonkeeper 钱包的手机运行 deeplink。<br/>

如果所有者使用的是**冷钱包**（推荐），[change-validator.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/change-validator.fif) 可用于生成包含更改验证器操作码和新验证器地址的 boc 主体。 <br/>
命令行： `fift -s scripts/fif/change-validator.fif new-validator-address`。
该脚本将生成一个 boc 正文（名为 change-validator.boc），并在所有者的钱包中签名和发送。 <br/>
所有者应在黑计算机上运行

- 创建并签署 tx： `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B change-validator.boc`，其中 my-wallet 是所有者的 pk 文件（不带扩展名）。金额为 1  TON ，足够支付费用（剩余金额将退还所有者）。change-validator.boc 就是上面生成的 boc。
- 在能上网的电脑上运行`lite-client -C global.config.json -c 'sendfile wallet-query.boc'`发送前一步生成的 boc 文件（wallet-query.boc）。

#### 3. 显示原始信息

正常情况下不会使用此操作码。 <br/>
它可用于从提名人合约中发送 \*\* 任何\*\*信息（必须签署并从所有者钱包中发送）。 <br/>
例如，如果选举人合约地址意外更改，而资金仍被锁定在选举人中，则可能需要使用此操作码。在这种情况下，验证器中的 RECOVER_STAKE 将不起作用，所有者必须创建一个特定的消息。 <br/>
报文正文应包括：操作码=0x7702（32 位）、query_id（64 位）、模式（8 位）、作为原始报文发送的 cell  msg 的引用。<br/>

#### 4. 升级

这是一个紧急操作码，可能永远都不应使用。<br/>
它可用于升级提名人合约。 <br/>
报文正文应包括：操作码=0x9903（32 位）、查询码（64 位）、新 cell 代码参考。<br/>

## 另请参见

- [单一提名合约](https://github.com/orbs-network/single-nominator)
- [如何使用单一提名池](/v3/guidelines/smart-contracts/howto/single-nominator-pool)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/vesting-contract.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/vesting-contract.mdx
================================================
# 归属合约

该合约允许您锁定一定数量的Toncoin，并在指定时间内逐渐解锁。

## 归属参数

归属参数在部署期间设置且不变。

`vesting_total_amount` - 以 nanoton 为单位，锁定的Toncoin总量。

`vesting_start_time` - unix时间，归属周期的开始点，直到这一刻`vesting_total_amount`被锁定，之后根据其他参数开始解锁。

`vesting_total_duration` - 总归属持续时间，以秒为单位（例如，`31104000`表示一年）。

`unlock_period` - 解锁周期，以秒为单位（例如，`2592000`表示每月一次）。

`cliff_duration` - 初始悬崖期，以秒为单位（例如，`5184000`表示2个月）。

`vesting_sender_address` - 您可以随时将Toncoin退回到此地址（即使它们被锁定）；此地址还可以添加到白名单中。

`owner_address` - 归属发行给其的人，从此地址，他可以发起从归属合约发送Toncoin的请求。

您可以通过`get_vesting_data()` get方法获取这些参数。

参数必须满足以下条件：

```
vesting_total_duration > 0
vesting_total_duration <= 135 years (2^32 seconds)
unlock_period > 0
unlock_period <= vesting_total_duration
cliff_duration >= 0
cliff_duration < vesting_total_duration
vesting_total_duration mod unlock_period == 0
cliff_duration mod unlock_period == 0
```

尽管智能合约不检查这些条件的符合性，但在合约部署后且在发送Toncoin之前，用户可以通过get方法验证所有参数是否OK。

## 锁定

在`vesting_start_time`之前，所有`vesting_total_amount`都被锁定。

从`vesting_start_time`开始，金额开始按比例解锁。

例如，如果`vesting_total_duration`为10个月，`unlock_period`为1个月，且`vesting_total_amount`为500 TON，则每月将解锁500\*(10/100)=50 TON，10个月后将解锁全部500 TON。

如果有悬崖期，在此悬崖期内不解锁任何金额，过了悬崖期后，按上述公式解锁。

例如，如果`cliff_period`为3个月，其他参数与前例相同，则前3个月不会解锁任何金额，3个月后一次性解锁150 TON（然后每个月解锁50 TON）。

Get方法`get_locked_amount(int at_time)`允许您计算在某个时间点将锁定多少金额。

您只能将锁定的Toncoin发送到白名单地址或`vesting_sender_address`。

您可以随时随地发送已解锁的Toncoin。

## 白名单

白名单是一系列地址，即使还有Toncoin被锁定，也可以向其发送Toncoin。

Get方法`get_whitelist()`以(wc, hash_part)元组列表形式返回所有白名单地址。

Get方法`is_whitelisted(slice address)`检查此地址是否在白名单上。

`vesting_sender_address`可以随时通过`op::add_whitelist`消息向白名单添加新地址。

无法从白名单中移除地址。

此外，始终可以将锁定的代币发送到`vesting_sender_address`（无需单独添加到白名单）。

## 充值

您可以从任何地址向归属合约发送Toncoin。

## 钱包智能合约

该合约设计类似于[标准钱包V3智能合约](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)。

在其数据中，它保留`seqno`、`subwallet_id`、`public_key`，并接受相同格式的外部消息。

Get方法`seqno()`、`get_subwallet_id()`和`get_public_key()`可用。

与标准钱包不同，归属合约一次只允许发送一条消息。

## 发送

公钥的所有者可以通过外部消息发起从归属合约发送Toncoin的请求，就像在标准钱包中一样。

也可以通过从`owner_address`发送的`op::send`内部消息发起Toncoin的发送。

实际上，公钥和`owner_address`通常由同一用户拥有。

## 白名单限制

可以发送到`vesting_sender_address`的消息有以下限制：

- 仅允许`send_mode == 3`；

在大多数情况下，地址被添加到白名单中，以允许用户使用被锁定的硬币进行验证或将被锁定的硬币质押到池中。

为了避免Toncoin被盗，发送到白名单的消息有以下限制：

- 仅允许`send_mode == 3`；

- 仅允许可弹回的消息；

- 不允许附加`state_init`；

如果目的地是系统选举人地址：

- 仅允许`op::elector_new_stake`、`op::elector_recover_stake`、`op::vote_for_complaint`、`op::vote_for_proposal`操作；

如果目的地是系统配置地址：

- 仅允许`op::vote_for_proposal`操作；

对于其他目的地：

- 允许空消息和空文本消息；
- 允许以"d"、"w"、"D"、"W"开头的文本消息；
- 允许`op::single_nominator_pool_withdraw`、`op::single_nominator_pool_change_validator`、`op::ton_stakers_deposit`、`op::jetton_burn`、`op::ton_stakers_vote`、`op::vote_for_proposal`、`op::vote_for_complaint`操作；

对不在白名单上的地址没有限制。

发送未锁定的 Toncoin 时不适用任何限制，即使我们发送到白名单`vesting_sender_address`。

## 项目结构

- `contracts` - 项目所有智能合约及其依赖的源代码。
- `wrappers` - 合约的封装类（实现ton-core的`Contract`），包括任何[解]序列化原语和编译函数。
- `tests` - 合约的测试。
- `scripts` - 项目使用的脚本，主要是部署脚本。

## 如何使用

### 构建

`npx blueprint build` 或 `yarn blueprint build`

### 测试

`npx blueprint test` 或 `yarn blueprint test`

### 部署或运行其他脚本

`npx blueprint run` 或 `yarn blueprint run`

### 添加新合约

`npx blueprint create ContractName` 或 `yarn blueprint create ContractName`

## 参阅

- [单一提名者](/participate/network-maintenance/single-nominator)
- [归属合约](https://github.com/ton-blockchain/vesting-contract)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/wallet-contracts.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/contracts-specs/wallet-contracts.md
================================================
# 钱包合约类型

您可能听说过 TON 区块链上不同版本的钱包。但这些版本究竟是什么意思，它们之间有什么区别？

在本文中，我们将探讨 TON 钱包的各种版本和修改。

:::info
Before we start, there are some terms and concepts that you should be familiar with to fully understand the article:

- [消息管理](/v3/documentation/smart-contracts/message-management/messages-and-transactions)，因为这是钱包的主要功能。
- [FunC语言](/v3/documentation/smart-contracts/func/overview)，因为我们将在很大程度上依赖使用它的实现。
  :::

## 共同概念

要打破这种紧张关系，我们首先应该明白，钱包并不是 TON 生态系统中的一个特定实体。它们仍然只是由代码和数据组成的智能合约，从这个意义上说，它们与 TON 中的任何其他角色（即智能合约）都是平等的。

与您自己的定制智能合约或其他任何合约一样，钱包可以接收外部和内部信息，发送内部信息和日志，并提供 "获取 "方法。
那么问题来了：它们提供哪些功能，不同版本之间有何不同？

您可以将每个钱包版本视为提供标准外部接口的智能合约实现，允许不同的外部客户端以相同的方式与钱包进行交互。您可以在主 TON monorepo 中找到这些 FunC 和 Fift 语言的实现：

- [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/)

## 基本钱包

### 钱包 V1

这是最简单的一种。它只允许您一次发送四笔交易，而且除了您的签名和序列号外不检查任何东西。

钱包源代码：

- [ton/crypto/smartcont/wallet-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)

这个版本甚至没有在常规应用程序中使用，因为它存在一些重大问题：

- 没有从合约中获取序列号和公钥的简单方法。
- 没有 `valid_until` 检查，因此无法确保交易不会太晚确认。

第一个问题已在 `V1R2` 和 `V1R3` 中解决。`R` 代表 `修订`。通常情况下，修订版只是增加获取方法的小更新；你可以在 `new-wallet.fif` 的更改历史中找到所有这些更新。在下文中，我们将只考虑最新的修订版本。

尽管如此，由于每个后续版本都继承了前一个版本的功能，我们仍应坚持使用它，因为这将有助于我们以后版本的开发。

#### 持久内存布局

- <b>seqno</b>：32 位长序列号。
- <b>public-key</b>： 256 位长公开密钥。

#### 外部信息正文布局

1. 数据
   - <b>签名</b>：512 位长 ed25519 签名。
   - <b>msg-seqno</b>：32 位长序列号。
   - <b>(0-4)模式</b>：最多四个 8 位长整数，定义每条报文的发送模式。
2. 最多 4 次引用包含信息的 cell 。

如您所见，钱包的主要功能是提供一种从外部世界与 TON 区块链进行通信的安全方式。`seqno` 机制可以防止重放攻击，而 `Ed25519 签名` 则提供了对钱包功能的授权访问。我们将不再详细介绍这些机制，因为它们在[外部消息](/v3/documentation/smart-contracts/message-management/external-messages)文档页面中有详细描述，并且在接收外部消息的智能合约中非常常见。有效载荷数据由最多 4 个 cell 引用和相应数量的模式组成，它们将直接传输到 [send_raw_message(cell msg, int mode)](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) 方法。

:::caution
请注意，钱包不对通过它发送的内部信息进行任何验证。程序员（即外部客户端）有责任根据 [内部信息布局](http://localhost:3000/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) 对数据进行序列化。
:::

#### 退出代码

| 退出代码 | 说明                 |
| ---- | ------------------ |
| 0x21 | `序列号` 检查失败，已获得回复保护 |
| 0x22 | `Ed25519签名` 检查失败   |
| 0x0  | 标准成功执行退出代码。        |

:::info
请注意，[TVM](/v3/documentation/tvm/tvm-overview) 有[标准退出代码](/v3/documentation/tvm/tvm-exit-codes) (`0x0`-是其中之一)，因此您也可以得到其中之一，例如，如果您用完了[gas](https://docs.ton.org/develop/smart-contracts/fees)，您将得到`0xD`代码。
:::

#### Get 方法

1. int seqno() 返回当前存储的序列号。
2. int get_public_key 返回当前存储的公钥。

### 钱包 V2

钱包源代码：

- [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

该版本引入了 `valid_until` 参数，用于设置交易的时间限制，以防过迟确认。该版本也没有在 `V2R2` 中添加的获取公钥的方法。

与前一版本相比，所有不同之处都是由于添加了 `valid_until` 功能。增加了一个新的退出代码：`0x23`，表示 valid_until 检查失败。此外，外部消息体布局中还新增了一个 UNIX-time 字段，用于设置事务的时间限制。所有获取方法保持不变。

#### 外部信息正文布局

1. 数据
   - <b> signature </b>：512 位长 ed25519 签名。
   - <b>msg-seqno</b>：32 位长序列号。
   - <b>valid-until</b>：32 位长 Unix 时间整数。
   - <b>(0-4)mode</b>：最多四个 8 位长整数，定义每条报文的发送模式。
2. 最多 4 次引用包含信息的 cell 。

### 钱包 V3

该版本引入了 `subwallet_id` 参数，允许使用同一公钥创建多个钱包（因此可以只有一个种子短语和多个钱包）。和以前一样，`V3R2` 只增加了获取公钥的方法。

钱包源代码：

- [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

本质上，`subwallet_id` 只是在部署时添加到合约状态的一个数字。由于 TON 中的合约地址是其状态和代码的哈希值，因此钱包地址会随着不同的 `subwallet_id` 而改变。该版本是目前使用最广泛的版本。它涵盖了大多数使用情况，并且仍然干净、简单，与之前的版本基本相同。所有获取方法保持不变。

#### 持久内存布局

- <b>seqno</b>：32 位序列号。
- <b> subwallet </b>：32 位子钱包 ID。
- <b>public-key</b>: 256 位公开密钥。

#### 外部信息布局

1. 数据
   - <b> signature </b>：512 位 ed25519 签名。
   - <b>subwallet-id</b>：32 位子钱包 ID。
   - <b>msg-seqno</b>：32 位序列号。
   - <b>valid-until</b>：32 位 UNIX 时间整数。
   - <b>(0-4)mode</b>：最多 4 个 8 位整数，定义每个报文的发送模式。
2. 最多 4 次引用包含信息的 cell 。

#### 退出代码

| 退出代码 | 说明                          |
| ---- | --------------------------- |
| 0x23 | `valid_until` 检查失败；交易确认尝试太晚 |
| 0x23 | `Ed25519签名` 检查失败            |
| 0x21 | `seqno` 检查失败；已触发回复保护        |
| 0x22 | subwallet-id\` 与存储的标识不匹配    |
| 0x0  | 标准成功执行退出代码。                 |

### 钱包 V4

该版本保留了之前版本的所有功能，但也引入了一些非常强大的功能："插件"。

钱包源代码：

- [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

这一功能允许开发人员实现与用户钱包协同工作的复杂逻辑。例如，一个 DApp 可能会要求用户每天支付少量的硬币来使用某些功能。在这种情况下，用户需要通过签署交易在钱包上安装插件。然后，当外部信息要求时，插件将每天向目标地址发送硬币。

#### 插件

插件本质上是 TON 上的其他智能合约，开发者可以根据自己的意愿自由实现。就钱包而言，它们只是存储在钱包持久内存 [dictionary](/v3/documentation/smart-contracts/func/docs/dictionaries) 中的智能合约地址。这些插件可以申请资金，并通过向钱包发送内部信息将自己从 "允许列表 "中删除。

#### 持久内存布局

- <b>seqno</b>：32 位长序列号。
- <b>subwallet-id</b>：32 位长 subwallet-id。
- <b>public-key</b>： 256 位长公开密钥。
- <b>plugins</b>：包含插件的字典（可能为空）

#### 接收内部信息

以前所有版本的钱包都是直接接收内部信息。它们只是简单地接受来自任何发件人的资金，而忽略内部信息正文（如果存在），或者换句话说，它们只有一个空的 recv_internal 方法。不过，如前所述，第四版钱包引入了两个额外的可用操作。让我们来看看内部信息体的布局：

- <b>op-code?</b>: 32 位长操作码。这是一个可选字段；任何信息正文中包含少于 32 位的操作码、错误的操作码或未注册为插件的发件人地址，都将被视为简单转账，与之前的钱包版本类似。
- <b>query-id</b>：64 位长整数。该字段对智能合约的行为没有影响；它用于跟踪合约之间的信息链。

1. op-code = 0x706c7567，申请资金操作代码。
   - <b> TON 币</b>：VARUINT16 申请的 TON 币数量。
   - <b>extra_currencies</b>：包含所请求的额外货币数量的字典（可能为空）。
2. op-code = 0x64737472，请求从 "允许列表" 中删除插件发送方。

#### 外部信息正文布局

- <b> signature </b>：512 位长 ed25519 签名。
- <b>subwallet-id</b>：32 位长的子钱包 ID。
- <b>valid-until</b>：32 位长 Unix 时间整数。
- <b>msg-seqno</b>：32 位长序列整数。
- <b>op-code</b>：32 位长操作码。

1. op-code = 0x0，简单发送。
   - <b>(0-4)mode</b>：最多四个 8 位长整数，定义每条报文的发送模式。
   - <b>(0-4)messages</b>：包含信息的 cell 的最多四个引用。
2. op-code = 0x1，部署并安装插件。
   - <b>workchain</b>：8 位长整数。
   - <b> balance </b>：VARUINT16  Toncoin  初始余额。
   - <b>state-init</b>：包含插件初始状态的 cell 引用。
   - <b>body</b>：包含正文的 cell 引用。
3. op-code = 0x2/0x3，安装插件/删除插件。
   - <b>wc_n_address</b>：8 位长工作链 ID + 256 位长插件地址。
   - <b>balance</b>：VARUINT16  Toncoin  初始余额的金额。
   - <b>query-id</b>：64 位长整数。

如您所见，第四个版本仍通过 `0x0` 操作码提供标准功能，与之前的版本类似。`0x2` 和 `0x3` 操作允许对插件字典进行操作。请注意，在使用 `0x2` 的情况下，您需要自行部署具有该地址的插件。相比之下，`0x1` 操作码还可通过 state_init 字段处理部署过程。

:::tip
If `state_init` doesn't make much sense from its name, take a look at the following references:

- [地址- TON -区块链](/v3/documentation/smart-contracts/addresses#workchain-id-and-account-id)
- [发送部署信息](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-deploy-message-with-stateinit-only-with-stateinit-and-body)
- [internal-message-layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)
  :::

#### 退出代码

| 退出代码 | 说明                                                       |
| ---- | -------------------------------------------------------- |
| 0x24 | `valid_until` 检查失败，交易确认尝试太晚                              |
| 0x23 | `Ed25519签名` 检查失败                                         |
| 0x21 | `seqno` 检查失败，已触发回复保护                                     |
| 0x22 | `subwallet-id` 与存储的标识不匹配                                 |
| 0x27 | 插件字典操作失败（0x1-0x3 recv_external 操作码） |
| 0x50 | 申请资金不足                                                   |
| 0x0  | 标准成功执行退出代码。                                              |

#### Get 方法

1. int seqno() 返回当前存储的序列号。
2. int get_public_key() 返回当前存储的公钥。
3. int get_subwallet_id() 返回当前子钱包 ID。
4. int is_plugin_installed(int wc, int addr_hash) 检查是否已安装定义了工作链 ID 和地址散列的插件。
5. tuple get_plugin_list() 返回插件列表。

### 钱包 V5

它是目前最先进的钱包版本，由 Tonkeeper 团队开发，旨在取代 V4 并允许任意扩展。

V5 钱包标准提供了许多优势，改善了用户和商家的体验。V5 支持无 gas 交易、账户授权和恢复、使用代币和 Toncoin 进行订阅支付以及低成本的多笔转账。除了保留以前的功能（V4）外，新合约允许您一次发送多达 255 条信息。

钱包源代码：

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

TL-B 方案：

- [ton-blockchain/wallet-contract-v5/types.tlb](https://github.com/ton-blockchain/wallet-contract-v5/blob/main/types.tlb)

:::caution
与之前的钱包版本规范不同，由于本钱包版本的接口实现相对复杂，我们将依赖 [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) 方案。我们将逐一进行说明。尽管如此，我们仍然需要对其有一个基本的了解，结合钱包源代码就足够了。
:::

#### 持久内存布局

```
contract_state$_ 
    is_signature_allowed:(## 1) 
    seqno:# 
    wallet_id:(## 32) 
    public_key:(## 256) 
    extensions_dict:(HashmapE 256 int1) = ContractState;
```

正如你所看到的，"ContractState"（合约状态）与之前的版本相比，并没有发生重大变化。主要区别在于新增了 `is_signature_allowed` 1 位标志，用于限制或允许通过签名和存储的公钥进行访问。我们将在后面的主题中介绍这一变化的重要性。

#### 认证程序

```
signed_request$_             // 32 (opcode from outer)
  wallet_id:    #            // 32
  valid_until:  #            // 32
  msg_seqno:    #            // 32
  inner:        InnerRequest //
  signature:    bits512      // 512
= SignedRequest;             // Total: 688 .. 976 + ^Cell

internal_signed#73696e74 signed:SignedRequest = InternalMsgBody;

internal_extension#6578746e 
    query_id:(## 64) 
    inner:InnerRequest = InternalMsgBody;

external_signed#7369676e signed:SignedRequest = ExternalMsgBody;
```

在了解信息的实际有效载荷 `InnerRequest` 之前，我们先来看看第 5 版在身份验证过程中与之前版本有什么不同。InternalMsgBody "组合器描述了通过内部信息访问钱包操作的两种方法。第一种方法是我们在第 4 版中已经熟悉的：作为先前注册的扩展进行身份验证，其地址存储在 `extensions_dict` 中。第二种方法是通过存储的公钥和签名进行验证，类似于外部请求。

起初，这似乎是一个不必要的功能，但实际上它可以通过外部服务（智能合约）来处理请求，而这些外部服务并不是钱包扩展基础设施的一部分--这正是 V5 的关键功能。Gas-free交易就是依靠这一功能实现的。

请注意，只接收资金仍然是一种选择。实际上，任何未通过验证程序的内部信息都将被视为转账。

#### 行为

我们首先要注意的是 "InnerRequest"，我们已经在身份验证过程中看到过它。与前一版本不同的是，除了更改签名模式（即 "is_signature_allowed "标志）外，外部和内部消息都可以访问相同的功能。

```
out_list_empty$_ = OutList 0;
out_list$_ {n:#} 
    prev:^(OutList n) 
    action:OutAction = OutList (n + 1);

action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;

// Extended actions in V5:
action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);

action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;

actions$_ out_actions:(Maybe OutList) has_other_actions:(## 1) {m:#} {n:#} other_actions:(ActionList n m) = InnerRequest;
```

我们可以将 `InnerRequest` 视为两个操作列表：第一个，`OutList`，是一个可选的 cell 引用链，每个 cell 都包含一个由消息模式引导的发送消息请求。第二个列表 "ActionList "由一个单比特标志 "has_other_actions "引导，它标志着扩展操作的存在，从第一个 cell 开始，以 cell 引用链的形式继续。我们已经熟悉了前两个扩展操作：`action_add_ext` 和 `action_delete_ext`，后面是我们要从扩展字典中添加或删除的内部地址。第三个扩展动作 `action_set_signature_auth_allowed`会限制或允许通过公钥进行身份验证，从而只剩下通过扩展与钱包进行交互的方式。在私钥丢失或泄露的情况下，这一功能可能极为重要。

:::info
请注意，操作的最大数目是 255；这是通过 [c5](/v3/documentation/tvm/tvm-overview#result-of-tvm-execution) TVM 寄存器实现的结果。从技术上讲，您可以使用空的 `OutAction` 和 `ExtendedAction` 提出申请，但在这种情况下，它将类似于只是接收资金。
:::

#### 退出代码

| 退出代码 | 说明                                  |
| ---- | ----------------------------------- |
| 0x84 | 在签名禁用时尝试通过签名进行身份验证                  |
| 0x85 | `seqno` 检查失败，出现回复保护                 |
| 0x86 | `wallet-id` 与存储的不一致                 |
| 0x87 | `Ed25519签名` 检查失败                    |
| 0x88 | `valid-until` 检查失败                  |
| 0x89 | 确保 `send_mode` 为外部信息设置了 +2 位（忽略错误）。 |
| 0x8A | `external-signed` 前缀与收到的前缀不一致       |
| 0x8B | 添加扩展名操作不成功                          |
| 0x8C | 删除扩展名操作不成功                          |
| 0x8D | 不支持扩展报文前缀                           |
| 0x8E | 尝试在扩展词典为空的情况下禁用签名验证                 |
| 0x8F | 尝试将签名设置为已设置的状态                      |
| 0x90 | 尝试在禁用签名时移除最后一个扩展名                   |
| 0x91 | 扩展程序有错误的工作链                         |
| 0x92 | 尝试通过外部信息更改签名模式                      |
| 0x93 | `c5` 无效，`action_send_msg` 验证失败      |
| 0x0  | 标准成功执行退出代码。                         |

:::danger
请注意，`0x8E`、`0x90` 和 `0x92` 钱包退出代码是为了防止您无法使用钱包功能而设计的。尽管如此，您仍要记住，钱包不会检查所存储的扩展地址是否确实存在于 TON 中。您也可以部署一个初始数据为空扩展字典和受限签名模式的钱包。在这种情况下，您仍然可以通过公钥访问钱包，直到添加第一个扩展。因此，请小心处理这些情况。
:::

#### 获取方法

1. int is_signature_allowed() 返回存储的 `is_signature_allowed` 标志。
2. int seqno() 返回当前存储的序列号。
3. int get_subwallet_id() 返回当前子钱包 ID。
4. int get_public_key() 返回当前存储的公钥。
5. cell  get_extensions() 返回扩展字典。

#### 为无 gas 交易做准备

v5 钱包智能合约允许处理由所有者签署的内部信息。这也允许您进行无 gas 交易，例如，在以 USDt 本身转移 USDt 时支付网络费用。常见的方案是这样的

![image](/img/gasless.jpg)

:::tip
因此，会有一些服务（如 [Tonkeeper's Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery)）提供这种功能：它们代表用户以 TON 支付交易费用，但收取代币费用。
:::

#### 流量

1. 在发送美元转账时，用户签署一条包含两笔美元转账的信息：
   1. 美元转账至收件人地址。
   2. 向该处转入少量美元。
2. 签名后的信息通过 HTTPS 发送到服务后台。服务后台将其发送到 TON 区块链，并支付网络费用 Toncoins。

测试版无气后台 API 可在 [tonapi.io/api-v2](https://tonapi.io/api-v2) 上获取。如果您正在开发任何钱包应用程序，并对这些方法有反馈意见，请通过 [@tonapitech](https://t.me/tonapitech) 聊天工具与我们分享。

钱包源代码：

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

## 特殊钱包

有时，基本钱包的功能并不足够。这就是为什么有几种类型的专用钱包："高负载"、"锁定 "和 "受限"。

让我们一起来看看。

### 高负载钱包

在短时间内处理大量信息时，需要使用名为 "高负载钱包 "的特殊钱包。请阅读 [文章](/v3/documentation/smart-contracts/contracts-specs/highload-wallet) 了解更多信息。

### 锁定钱包

如果您出于某种原因，需要在一段时间内将钱币锁定在钱包中，而在这段时间过去之前无法提取钱币，那么就来看看锁定钱包吧。

它允许您设置不能从钱包中提取任何东西的时间。您还可以自定义设置解锁时间段，这样您就可以在这些时间段内花费一些金币。

例如：您可以创建一个钱包，该钱包将容纳 100 万金币，总归属时间为 10 年。将悬崖期限设置为一年，因此资金将在钱包创建后的第一年被锁定。然后，您可以将解锁期设置为一个月，这样每月就可以解锁 `1'000'000  TON  / 120 个月 = ~8333  TON `。

钱包源代码：

- [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### 受限钱包

该钱包的功能与普通钱包类似，但只能向一个预定义的目标地址转账。您可以在创建此钱包时设置目标地址，然后就只能将资金转入该地址。但请注意，您仍然可以向验证合约转账，因此您可以使用此钱包运行验证器。

钱包源代码：

- [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## 已知操作码

:::info
也是操作码、操作::码和操作码
:::

| 合约类型          | 十六进制代码     | OP::Code                                                                                               |
| ------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Global        | 0x00000000 | Text Comment                                                                                                                           |
| Global        | 0xffffffff | Bounce                                                                                                                                 |
| Global        | 0x2167da4b | [Encrypted Comment](/v3/documentation/smart-contracts/message-management/internal-messages#messages-with-encrypted-comments)           |
| Global        | 0xd53276db | Excesses                                                                                                                               |
| Elector       | 0x4e73744b | New Stake                                                                                                                              |
| Elector       | 0xf374484c | New Stake Confirmation                                                                                                                 |
| Elector       | 0x47657424 | Recover Stake Request                                                                                                                  |
| Elector       | 0x47657424 | Recover Stake Response                                                                                                                 |
| Wallet        | 0x0f8a7ea5 | Jetton Transfer                                                                                                                        |
| Wallet        | 0x235caf52 | [Jetton Call To](https://testnet.tonviewer.com/transaction/1567b14ad43be6416e37de56af198ced5b1201bb652f02bc302911174e826ef7)           |
| Jetton        | 0x178d4519 | Jetton Internal Transfer                                                                                                               |
| Jetton        | 0x7362d09c | Jetton Notify                                                                                                                          |
| Jetton        | 0x595f07bc | Jetton Burn                                                                                                                            |
| Jetton        | 0x7bdd97de | Jetton Burn Notification                                                                                                               |
| Jetton        | 0xeed236d3 | Jetton Set Status                                                                                                                      |
| Jetton-Minter | 0x642b7d07 | Jetton Mint                                                                                                                            |
| Jetton-Minter | 0x6501f354 | Jetton Change Admin                                                                                                                    |
| Jetton-Minter | 0xfb88e119 | Jetton Claim Admin                                                                                                                     |
| Jetton-Minter | 0x7431f221 | Jetton Drop Admin                                                                                                                      |
| Jetton-Minter | 0xcb862902 | Jetton Change Metadata                                                                                                                 |
| Jetton-Minter | 0x2508d66a | Jetton Upgrade                                                                                                                         |
| Vesting       | 0xd372158c | [Top Up](https://github.com/ton-blockchain/liquid-staking-contract/blob/be2ee6d1e746bd2bb0f13f7b21537fb30ef0bc3b/PoolConstants.ts#L28) |
| Vesting       | 0x7258a69b | Add Whitelist                                                                                                                          |
| Vesting       | 0xf258a69b | Add Whitelist Response                                                                                                                 |
| Vesting       | 0xa7733acd | Send                                                                                                                                   |
| Vesting       | 0xf7733acd | Send Response                                                                                                                          |
| Dedust        | 0x9c610de3 | Dedust Swap ExtOut                                                                                                                     |
| Dedust        | 0xe3a0d482 | Dedust Swap Jetton                                                                                                                     |
| Dedust        | 0xea06185d | Dedust Swap Internal                                                                                                                   |
| Dedust        | 0x61ee542d | Swap External                                                                                                                          |
| Dedust        | 0x72aca8aa | Swap Peer                                                                                                                              |
| Dedust        | 0xd55e4686 | Deposit Liquidity Internal                                                                                                             |
| Dedust        | 0x40e108d6 | Deposit Liquidity Jetton                                                                                                               |
| Dedust        | 0xb56b9598 | Deposit Liquidity all                                                                                                                  |
| Dedust        | 0xad4eb6f5 | Pay Out From Pool                                                                                                                      |
| Dedust        | 0x474а86са | Payout                                                                                                                                 |
| Dedust        | 0xb544f4a4 | Deposit                                                                                                                                |
| Dedust        | 0x3aa870a6 | Withdrawal                                                                                                                             |
| Dedust        | 0x21cfe02b | Create Vault                                                                                                                           |
| Dedust        | 0x97d51f2f | Create Volatile Pool                                                                                                                   |
| Dedust        | 0x166cedee | Cancel Deposit                                                                                                                         |
| StonFi        | 0x25938561 | Swap Internal                                                                                                                          |
| StonFi        | 0xf93bb43f | Payment Request                                                                                                                        |
| StonFi        | 0xfcf9e58f | Provide Liquidity                                                                                                                      |
| StonFi        | 0xc64370e5 | Swap Success                                                                                                                           |
| StonFi        | 0x45078540 | Swap Success ref                                                                                                                       |

:::info
[DeDust docs](https://docs.dedust.io/docs/swaps)

[StonFi docs](https://docs.ston.fi/docs/developer-section/architecture#calls-descriptions)
:::

## 结论

如您所见，TON 中有许多不同版本的钱包。但在大多数情况下，您只需要 `V3R2` 或 `V4R2`。如果你想获得一些附加功能，如定期解锁资金，也可以使用其中一种特殊钱包。

## 另请参见

- [使用钱包智能合约](/v3/guidelines/smart-contracts/howto/wallet)
- [基本钱包的来源](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
- [更多版本技术说明](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
- [钱包 V4 来源和详细说明](https://github.com/ton-blockchain/wallet-contract)
- [锁定钱包来源和详细说明](https://github.com/ton-blockchain/lockup-wallet-contract)
- [限制钱包来源](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
- [ TON 级 免 Gas 交易](https://medium.com/@buidlingmachine/gasless-transactions-on-ton-75469259eff2)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/fift/fift-and-tvm-assembly.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/fift/fift-and-tvm-assembly.md
================================================
# Fift 和 TVM 汇编

Fift 是一种基于堆栈的汇编编程语言，它具有 TON 特有的功能，因此可以处理cell。TVM 汇编同样是一种基于堆栈的、特定于 TON 的编程语言，它也可以处理cell。那么它们之间的区别是什么呢？

## 区别

Fift 在**编译时**执行 - FunC 代码被处理后，您的编译器构建智能合约代码 BOC 。Fift 可以有不同的形式：

```
// tuple primitives
x{6F0} @Defop(4u) TUPLE
x{6F00} @Defop NIL
x{6F01} @Defop SINGLE
x{6F02} dup @Defop PAIR @Defop CONS
```

> Asm.fif 中的 TVM 操作码定义

```
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 32 LDU NIP 256 PLDU CONDSEL  // cnt or pubk
   }>
   INC 32 THROWIF	// fail unless recv_external
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU 32 LDU 	//  signature in_msg subwallet_id valid_until msg_seqno cs
   NOW s1 s3 XCHG LEQ 35 THROWIF	//  signature in_msg subwallet_id cs msg_seqno
   c4 PUSH CTOS 32 LDU 32 LDU 256 LDU ENDS	//  signature in_msg subwallet_id cs msg_seqno stored_seqno stored_subwallet public_key
   s3 s2 XCPU EQUAL 33 THROWIFNOT	//  signature in_msg subwallet_id cs public_key stored_seqno stored_subwallet
   s4 s4 XCPU EQUAL 34 THROWIFNOT	//  signature in_msg stored_subwallet cs public_key stored_seqno
   s0 s4 XCHG HASHSU	//  signature stored_seqno stored_subwallet cs public_key msg_hash
   s0 s5 s5 XC2PU	//  public_key stored_seqno stored_subwallet cs msg_hash signature public_key
   CHKSIGNU 35 THROWIFNOT	//  public_key stored_seqno stored_subwallet cs
   ACCEPT
   WHILE:<{
     DUP SREFS	//  public_key stored_seqno stored_subwallet cs _51
   }>DO<{	//  public_key stored_seqno stored_subwallet cs
     8 LDU LDREF s0 s2 XCHG	//  public_key stored_seqno stored_subwallet cs _56 mode
     SENDRAWMSG
   }>	//  public_key stored_seqno stored_subwallet cs
   ENDS SWAP INC	//  public_key stored_subwallet seqno'
   NEWC 32 STU 32 STU 256 STU ENDC c4 POP
}>c
```

> wallet_v3_r2.fif

最后一段代码看起来像是 TVM 汇编，而且大部分确实是！这是怎么发生的？

想象一下你正在对一位实习程序员说：“现在在函数末尾添加执行这个、这个和那个的命令”。你的命令最终会出现在实习生的程序中。它们被处理了两次 - 就像这里，大写字母的操作码（SETCP0、DUP 等）同时被 Fift 和 TVM 处理。

你可以向实习生解释高级抽象，最终他会理解并能够使用它们。Fift 也是可扩展的 - 你可以定义自己的命令。事实上，Asm[Tests].fif 就是关于定义 TVM 操作码的。

另一方面，TVM 操作码在**运行时**执行 - 它们是智能合约的代码。可以把它们看作是你实习生的程序 - TVM 汇编可以做的事情较少（例如，它没有内置的数据签名原语 - 因为 TVM 在区块链中做的一切都是公开的），但它可以真正与其环境互动。

## 在智能合约中的使用

### [Fift] - 将大型 BOC 放入合约

如果你使用的是 `toncli`，这是可能的。如果你使用其他编译器构建合约，可能还有其他方法来包含大型 BOC。
编辑 `project.yaml`，使得构建智能合约代码时包含 `fift/blob.fif`：

```
contract:
  fift:
    - fift/blob.fif
  func:
    - func/code.fc
```

将 BOC 放入 `fift/blob.boc`，然后将以下代码添加到 `fift/blob.fif`：

```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

现在，你可以从智能合约中提取这个 blob：

```
cell load_blob() asm "LDBLOB";

() recv_internal() {
    send_raw_message(load_blob(), 160);
}
```

### [TVM 汇编] - 将整数转换为字符串

遗憾的是，尝试使用 Fift 原语进行 int-to-string 转换失败。

```
slice int_to_string(int x) asm "(.) $>s PUSHSLICE";
```

原因很明显：Fift 在编译时进行计算，那时还没有 `x` 可供转换。要将非常量整数转换为字符串 slice ，你需要 TVM 汇编。例如，这是 TON 智能挑战 3位 参赛者之一的代码：

```
tuple digitize_number(int value)
  asm "NIL WHILE:<{ OVER }>DO<{ SWAP TEN DIVMOD s1 s2 XCHG TPUSH }> NIP";

builder store_number(builder msg, tuple t)
  asm "WHILE:<{ DUP TLEN }>DO<{ TPOP 48 ADDCONST ROT 8 STU SWAP }> DROP";

builder store_signed(builder msg, int v) inline_ref {
  if (v < 0) {
    return msg.store_uint(45, 8).store_number(digitize_number(- v));
  } elseif (v == 0) {
    return msg.store_uint(48, 8);
  } else {
    return msg.store_number(digitize_number(v));
  }
}
```

### [TVM 汇编] - 低成本的模乘

```
int mul_mod(int a, int b, int m) inline_ref {               ;; 1232 gas units
  (_, int r) = muldivmod(a % m, b % m, m);
  return r;
}
int mul_mod_better(int a, int b, int m) inline_ref {        ;; 1110 gas units
  (_, int r) = muldivmod(a, b, m);
  return r;
}
int mul_mod_best(int a, int b, int m) asm "x{A988} s,";     ;; 65 gas units
```

`x{A988}` 是根据 [5.2 Division](/learn/tvm-instructions/instructions#52-division) 格式化的操作码：带有预乘法的除法，唯一返回的结果是第三个参数的余数。但操作码需要进入智能合约代码 - 这就是 `s,` 的作用：它将栈顶的 slice 存储到稍低的构建器中。



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/fift/fift-deep-dive.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/fift/fift-deep-dive.md
================================================
# Fift 深入解析

Fift 是一种高级的基于栈的语言，用于本地操作cell和其他 TVM 原语，主要用于将 TVM 汇编代码转换为合约代码的cell包。

:::caution
本节描述了与 TON 特有功能在**非常**低层级的交互。
需要对栈语言基础有深入理解。
:::

## 简单算术

你可以使用 Fift 解释器作为计算器，以[逆波兰表示法(reverse Polish notation)](https://en.wikipedia.org/wiki/Reverse_Polish_notation)编写表达式。

```
6 17 17 * * 289 + .
2023 ok
```

## 标准输出

```
27 emit ."[30;1mgrey text" 27 emit ."[37m"
grey text ok
```

`emit` 从栈顶取出数字，并将指定代码的 Unicode 字符打印到 stdout。
`."..."` 打印常量字符串。

## 定义函数（Fift words）

定义word的主要方式是将其效果括在大括号中，然后写 `:` 和word名称。

```
{ minmax drop } : min
{ minmax nip } : max
```

> Fift.fif

不过，还有几个*定义word*的方法，不仅仅是 `:`。它们的不同之处在于，用其中一些定义的word是**active**（在大括号内工作），而有些是**prefix**（不需要在它们之后有空格字符）：

```
{ bl word 1 2 ' (create) } "::" 1 (create)
{ bl word 0 2 ' (create) } :: :
{ bl word 2 2 ' (create) } :: :_
{ bl word 3 2 ' (create) } :: ::_
{ bl word 0 (create) } : create
```

> Fift.fif

## 条件执行

代码块（由大括号分隔）可以有条件或无条件地执行。

```
{ { ."true " } { ."false " } cond } : ?.   4 5 = ?.  4 5 < ?.
false true  ok
{ ."hello " } execute ."world"
hello world ok
```

## 循环

```
// ( l c -- l')  deletes first c elements from list l
{ ' safe-cdr swap times } : list-delete-first
```

> GetOpt.fif

循环word `times` 接受两个参数 - 我们称它们为 `cont` 和 `n` - 并执行 `cont` `n` 次。
这里 `list-delete-first` 继承 `safe-cdr` （从Lisp样式列表中删除head命令），将其放在 `c` 下面，然后 `c` 次从堆栈上的列表中删除head。

还有 `while` 和 `until` 循环word。

## 注释

```
{ 0 word drop 0 'nop } :: //
{ char " word 1 { swap { abort } if drop } } ::_ abort"
{ { bl word dup "" $= abort"comment extends after end of file" "*/" $= } until 0 'nop } :: /*
```

> Fift.fif

注释在 `Fift.fif` 中定义。单行注释以 `//` 开始，一直到行尾；多行注释以 `/*` 开始，以 `*/` 结束。

让我们理解它们为什么有效。
Fift 程序本质上是一系列word的序列，每个单词都以某种方式转换栈或定义新单词。`Fift.fif` 的第一行代码（上面所示）是新word `//` 的声明。注释必须在定义新word时也能工作，所以它们必须在嵌套环境中工作。这就是为什么它们被定义为**active**单词，通过 `::` 实现。正在创建的单词的动作列在大括号中：

1. `0`：零被推到栈上
2. `word`：此命令读取字符，直到达到栈顶的字符，并将读取的数据作为字符串推送。零是特殊情况：这里 `word` 跳过前导空格，然后读取直到当前输入行的末尾。
3. `drop`：栈顶元素（注释数据）被丢弃。
4. `0`：再次将零推到栈上 - 结果的数量，因为word是用 `::` 定义的。
5. `'nop` 推送执行令牌在调用时什么也不做。这几乎等同于 `{ nop }`。

## 使用 Fift 定义 TVM 汇编代码

```
x{00} @Defop NOP
{ 1 ' @addop does create } : @Defop
{ tuck sbitrefs @ensurebitrefs swap s, } : @addop
{ @havebitrefs ' @| ifnot } : @ensurebitrefs
{ 2 pick brembitrefs 1- 2x<= } : @havebitrefs
{ rot >= -rot <= and } : 2x<=
...
```

> Asm.fif (行顺序颠倒)

`@Defop` 负责检查是否有足够的空间放置操作码（`@havebitrefs`），如果没有，它将继续写入另一个构建器（`@|`；也称为隐式跳转）。这就是为什么你通常不想写 `x{A988} s,` 作为操作码：可能没有足够的空间放置此操作码，因此编译会失败；你应该写 `x{A988} @addop`。

您可以使用 Fift 将大型cell包纳入到合约中：

```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

此命令定义了一个操作码，当被包含在程序中时，它写入 `x{88}`（`PUSHREF`）和对提供的cell包的引用。因此，当运行 `LDBLOB` 指令时，它将cell推送到 TVM 栈上。

## 特殊功能

- Ed25519 密码学
  - newkeypair - 生成私钥-公钥对
  - priv>pub   - 从私钥生成公钥
  - ed25519_sign[_uint] - 给定数据和私钥生成签名
  - ed25519_chksign     - 检查 Ed25519 签名
- 与 TVM 的交互
  - runvmcode 及类似的 - 使用从堆栈中取得的代码 slice 调用 TVM
- 将 BOC 写入文件：
  `boc>B ".../contract.boc" B>file`

## 继续学习

- [Fift 简介](https://docs.ton.org/fiftbase.pdf) by Nikolai Durov



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/fift/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/fift/overview.mdx
================================================
import Button from '@site/src/components/button'

# 概览

Fift 是一种基于栈的通用编程语言，专为创建、调试和管理 TON 区块链智能合约而进行了优化。
Fift 专门设计用于与 TON 虚拟机（TON VM 或 TVM）和 TON 区块链进行交互。

```fift
{ ."hello " } execute ."world"
hello world ok
```

:::info
Usually, using the Fift is not required for programming smart contracts in TON. However, Sometimes, you may need to use the Fift language to solve uncommon technical challenges as part of your task.
You might be interested in:

- [TVM Retracer](https://retracer.ton.org/)
  :::

<Button href="https://blog.ton.org/introduction-to-fift"
colorType="primary" sizeType={'sm'}>

Fift 简介

</Button>

<Button href="https://www.youtube.com/watch?v=HVsveTmVowc&list=PLtUBO1QNEKwttRsAs9eacL2oCMOhWaOZs"
          colorType="secondary" sizeType={'sm'}>

尊贵的 Fift 陛下

</Button>

<br></br><br></br>

## 文档

- [Fift：简介](https://ton.org/fiftbase.pdf)
- [TON 虚拟机](/v3/documentation/tvm/tvm-overview)

## 实例

- [Fift 智能合同示例](/v3/documentation/smart-contracts/contracts-specs/examples#fift-smart-contracts)

## 教程

- [Fift简介](https://blog.ton.org/introduction-to-fift)
- [[YouTube]His majesty Fift](https://www.youtube.com/watch?v=HVsveTmVowc&list=PLtUBO1QNEKwttRsAs9eacL2oCMOhWaOZs) [[RU version](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCYG-hR4N5FRTKUkfM8POgh)] by **@MarcoDaTr0p0je**和 **@Wikimar**。

## 资料来源

- [标准智能合约脚本](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/changelog.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/changelog.md
================================================
# FunC 的历史

# 初始版本

初始版本由 Telegram 完成，并在 2020 年 5 月后停止了积极开发。我们将 2020 年 5 月的版本称为“初始版本”。

# 版本 0.1.0

发布于 [2022 年 5 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2022.05)。

在这个版本中增加了：

- [常量](/develop/func/literals_identifiers#constants)
- [扩展字符串字面量](/develop/func/literals_identifiers#string-literals)
- [Semver 编译指令](/develop/func/compiler_directives#pragma-version)
- [包含](/develop/func/compiler_directives#pragma-version)

修复：

- 修复了在 Asm.fif 中偶尔出现的错误。

# 版本 0.2.0

发布于 [2022 年 8 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2022.08)。

在这个版本中增加了：

- 不平衡的 if/else 分支（当某些分支返回而有些则不返回）

修复：

- [FunC 错误处理 while(false) 循环 #377](https://github.com/ton-blockchain/ton/issues/377)
- [FunC 错误生成 ifelse 分支的代码 #374](https://github.com/ton-blockchain/ton/issues/374)
- [FunC 在内联函数中错误返回条件 #370](https://github.com/ton-blockchain/ton/issues/370)
- [Asm.fif: 大型函数体的分割错误地干扰了内联 #375](https://github.com/ton-blockchain/ton/issues/375)

# 版本 0.3.0

发布于 [2022 年 10 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2022.10)。

在这个版本中增加了：

- [多行 asms](/develop/func/functions#multiline-asms)
- 允许对常量和 asms 的重复定义
- 允许对常量进行位操作

# 版本 0.4.0

发布于 [2023 年 1 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2023.01)。

在这个版本中增加了：

- [try/catch 语句](/develop/func/statements#try-catch-statements)
- [throw_arg 函数](/develop/func/builtins#throwing-exceptions)
- 允许就地修改和批量赋值全局变量：`a~inc()` 和 `(a, b) = (3, 5)`，其中 `a` 是全局变量

修复：

- 禁止在同一表达式中使用局部变量后对其进行模糊修改：`var x = (ds, ds~load_uint(32), ds~load_unit(64));` 是禁止的，而 `var x = (ds~load_uint(32), ds~load_unit(64), ds);` 是允许的
- 允许空的内联函数
- 修复罕见的 `while` 优化错误



================================================
FILE: i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/cookbook.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/zh-CN/docusaurus-plugin-content-docs/current/v3/documentation/smart-contracts/func/cookbook.md
================================================
# FunC 开发手册

创建 FunC 开发手册的核心原因是将所有 FunC 开发者的经验汇集在一个地方，以便未来的开发者们使用！

与 FunC 文档相比，本文更侧重于 FunC 开发者在智能合约开发过程中每天都要解决的任务。

## 基础知识

### 如何编写 if 语句

假设我们想检查某个事件是否相关。为此，我们使用标志变量。记住在 FunC 中 `true` 是 `-1` 而 `false` 是 `0`。

```func
int flag = 0; ;; false

if (flag) { 
    ;; do something
}
else {
    ;; reject the transaction
}
```

> 💡 注意
>
> 我们不需要使用 `==` 操作符，因为 `0` 的值是 `false`，所以任何其他值都将是 `true`。

> 💡 有用的链接
>
> [文档中的“If statement”](/develop/func/statements#if-statements)

### 如何编写 repeat 循环

以指数运算为例

```func
int number = 2;
int multiplier = number;
int degree = 5;

repeat(degree - 1) {

    number *= multiplier;
}
```

> 💡 有用的链接
>
> [文档中的“Repeat loop”](/develop/func/statements#repeat-loop)

### 如何编写 while 循环

当我们不知道要执行特定操作多少次时，while 循环很有用。例如，取一个 `cell`，我们知道它可以存储最多四个对其他 cell 的引用。

```func
cell inner_cell = begin_cell() ;; create a new empty builder
        .store_uint(123, 16) ;; store uint with value 123 and length 16 bits
        .end_cell(); ;; convert builder to a cell

cell message = begin_cell()
        .store_ref(inner_cell) ;; store cell as reference
        .store_ref(inner_cell)
        .end_cell();

slice msg = message.begin_parse(); ;; convert cell to slice
while (msg.slice_refs_empty?() != -1) { ;; we should remind that -1 is true
    cell inner_cell = msg~load_ref(); ;; load cell from slice msg
    ;; do something
}
```

> 💡 有用的链接
>
> [文档中的“While loop”](/develop/func/statements#while-loop)
>
> [文档中的“Cell”](/learn/overviews/cells)
>
> [文档中的“slice_refs_empty?()”](/develop/func/stdlib#slice_refs_empty)
>
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
>
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
>
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何编写 do until 循环

当我们需要循环至少运行一次时，我们使用 `do until`。

```func
int flag = 0;

do {
    ;; do something even flag is false (0) 
} until (flag == -1); ;; -1 is true
```

> 💡 有用的链接
>
> [文档中的“Until loop”](/develop/func/statements#until-loop)

### 如何确定 slice 是否为空

在处理 `slice` 之前，需要检查它是否有数据以便正确处理。我们可以使用 `slice_empty?()` 来做到这一点，但我们必须考虑到，如果有至少一个 `bit` 的数据或一个 `ref`，它将返回 `-1`（`true`）。

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_empty?()` returns `true`, because slice doesn't have any `bits` and `refs`
empty_slice.slice_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_only.slice_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false`, because slice have any `refs`
slice_with_refs_only.slice_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false`, because slice have any `bits` and `refs`
slice_with_bits_and_refs.slice_empty?();
```

> 💡 有用的链接
>
> [文档中的“slice_empty?()”](/develop/func/stdlib#slice_empty)
>
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
>
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
>
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
>
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 slice 是否为空（不含任何 bits，但可能包含 refs）

如果我们只需要检查 `bits`，不关心 `slice` 中是否有任何 `refs`，那么我们应该使用 `slice_data_empty?()`。

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_data_empty?()` returns `true`, because slice doesn't have any `bits`
empty_slice.slice_data_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_data_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_only.slice_data_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `true`, because slice doesn't have any `bits`
slice_with_refs_only.slice_data_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_and_refs.slice_data_empty?();
```

> 💡 有用的链接
>
> [文档中的“slice_data_empty?()”](/develop/func/stdlib#slice_data_empty)
>
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
>
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
>
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
>
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 slice 是否为空（没有任何 refs，但可能有 bits）

如果我们只对 `refs` 感兴趣，我们应该使用 `slice_refs_empty?()` 来检查它们的存在。

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_refs_empty?()` returns `true`, because slice doesn't have any `refs`
empty_slice.slice_refs_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_refs_empty?()` returns `true`, because slice doesn't have any `refs`
slice_with_bits_only.slice_refs_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false`, because slice have any `refs`
slice_with_refs_only.slice_refs_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false`, because slice have any `refs`
slice_with_bits_and_refs.slice_refs_empty?();
```

> 💡 有用的链接
>
> [文档中的“slice_refs_empty?()”](/develop/func/stdlib#slice_refs_empty)
>
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
>
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
>
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
>
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 cell 是否为空

要检查 `cell` 中是否有任何数据，我们应首先将其转换为 `slice`。如果我们只对 `bits` 感兴趣，应使用 `slice_data_empty?()`；如果只对 `refs` 感兴趣，则使用 `slice_refs_empty?()`。如果我们想检查是否有任何数据，无论是 `bit` 还是 `ref`，我们需要使用 `slice_empty?()`。

```func
cell cell_with_bits_and_refs = begin_cell()
    .store_uint(1337, 16)
    .store_ref(null())
    .end_cell();

;; Change `cell` type to slice with `begin_parse()`
slice cs = cell_with_bits_and_refs.begin_parse();

;; determine if slice is empty
if (cs.slice_empty?()) {
    ;; cell is empty
}
else {
    ;; cell is not empty
}
```

> 💡 有用的链接
>
> [文档中的“slice_empty?()”](/develop/func/stdlib#slice_empty)
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
>
> [文档中的“store_uint()”](/develop/func/stdlib#store_uint)
>
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
>
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 dict 是否为空

有一个 `dict_empty?()` 方法可以检查 dict 中是否有数据。这个方法相当于 `cell_null?()`，因为通常一个空的 cell 就是一个空字典。

```func
cell d = new_dict();
d~udict_set(256, 0, "hello");
d~udict_set(256, 1, "world");

if (d.dict_empty?()) { ;; Determine if dict is empty
    ;; dict is empty
}
else {
    ;; dict is not empty
}
```

> 💡 有用的链接
>
> [文档中的“dict_empty?()”](/develop/func/stdlib#dict_empty)
>
> [文档中的“new_dict()”](/develop/func/stdlib/#new_dict) 创建空字典
>
> [文档中的“dict_set()”](/develop/

### 如何确定 tuple 是否为空

在处理 `tuple` 时，重要的是始终知道里面是否有任何值可供提取。如果我们试图从一个空的 "元组 "中提取值，就会出现错误：不是有效大小的元组"，并显示 "退出代码 7"。

```func
;; Declare tlen function because it's not presented in stdlib
(int) tlen (tuple t) asm "TLEN";

() main () {
    tuple t = empty_tuple();
    t~tpush(13);
    t~tpush(37);

    if (t.tlen() == 0) {
        ;; tuple is empty
    }
    else {
        ;; tuple is not empty
    }
}
```

> 💡 Noted
>
> 我们正在声明 tlen 汇编函数。你可以在 [此处](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) 和 [list of all assembler commands](/v3/documentation/tvm/instructions) 阅读更多内容。

> 💡 注意
>
> 我们声明了 tlen 汇编函数。你可以在[这里](/develop/func/functions#assembler-function-body-definition)阅读更多，并查看[所有汇编指令列表](/learn/tvm-instructions/instructions)。
>
> 文档中的["tpush()"](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)
>
> [文档中的 "退出代码"](/v3/documentation/tvm/tvm-exit-codes)

### 如何判断 lisp 风格列表是否为空

```func
tuple numbers = null();
numbers = cons(100, numbers);

if (numbers.null?()) {
    ;; list-style list is empty
} else {
    ;; list-style list is not empty
}
```

我们使用 [cons](/v3/documentation/smart-contracts/func/docs/stdlib/#cons)函数将数字 100 添加到列表样式的列表中，因此它不是空的。

### 如何确定合约状态为空

假设我们有一个存储交易数量的 `counter`。在智能合约状态下的第一笔交易中，这个变量是不可用的，因为状态是空的，所以有必要处理这种情况。如果状态为空，我们就创建一个变量 `counter` 并保存它。

```func
;; `get_data()` will return the data cell from contract state
cell contract_data = get_data();
slice cs = contract_data.begin_parse();

if (cs.slice_empty?()) {
    ;; contract data is empty, so we create counter and save it
    int counter = 1;
    ;; create cell, add counter and save in contract state
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
else {
    ;; contract data is not empty, so we get our counter, increase it and save
    ;; we should specify correct length of our counter in bits
    int counter = cs~load_uint(32) + 1;
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
```

> 💡 Noted
>
> 我们可以通过判断 [cell is empty](/v3/documentation/smart-contracts/func/cookbook#how-to-determine-if-cell-is-empty) 来确定合约状态为空。

> 💡 注意
>
> 我们可以通过确定 [cell 是否为空](/develop/func/cookbook#how-to-determine-if-cell-is-empty) 来确定合约的状态是否为空。
>
> 文档中的["begin_parse()"](/v3/documentation/smart-contracts/func/docs/stdlib/#begin_parse)
>
> 文档中的 ["slice_empty?()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
>
> 文档中的 ["set_data?()"](/v3/documentation/smart-contracts/func/docs/stdlib#set_data)

### 如何建立内部信息 cell

如果我们想让合约发送内部邮件，首先应将其创建为 cell ，并指定技术标志、收件人地址和其他数据。

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
;; we use `op` for identifying operations
int op = 0;

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

> 💡 Noted
>
> 在本例中，我们使用字面量 `a` 来获取地址。有关字符串字面量的更多信息，请参阅 [docs](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)

> 💡 注意
>
> 在这个例子中，我们使用字面量 `a` 获取地址。你可以在[文档](/develop/func/literals_identifiers#string-literals)中找到更多关于字符串字面量的信息。

> 💡 注意
>
> 你可以在[文档](/develop/smart-contracts/messages)中找到更多信息。也可以通过这个链接跳转到[布局](/develop/smart-contracts/messages#message-layout)。
>
> [文档中的 "store_uint() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
>
> [文档中的 "store_slice() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
>
> [文档中的 "store_coins()"](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
>
> [文档中的 "end_cell()"](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
>
> [文档中的 "send_raw_message() "](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### 如何将正文作为内部报文 cell 的 ref 来包含

在标志和其他技术数据之后的报文正文中，我们可以发送 `int`, `slice` 和 `cell`。对于后者，有必要在 `store_ref()` 之前将位设置为 `1`，以表示 `cell` 将继续。

在跟着标志位和其他技术数据的消息体中，我们可以发送 `int`、`slice` 和 `cell`。在后者的情况下，在 `store_ref()` 之前必须将位设置为 `1`，以表明 `cell` 将继续传输。

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
cell message_body = begin_cell() ;; Creating a cell with message
    .store_uint(op, 32)
    .store_slice("❤")
.end_cell();
    
cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; set bit to 1 to indicate that the cell will go on
    .store_ref(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

> 💡 Noted
>
> 在本例中，我们使用字面量 `a` 来获取地址。有关字符串字面量的更多信息，请参阅 [docs](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)

> 💡 注意
>
> 在这个例子中，我们使用字面量 `a` 获取地址。你可以在[文档](/develop/func/literals_identifiers#string-literals)中找到更多关于字符串字面量的信息。

> 💡 注意
>
> 在这个例子中，我们使用node 3 接收进来的 tons 并发送确切的指定金额（amount），同时从合约余额中支付佣金并忽略错误。mode 64 用于返回所有接收到的 tons，扣除佣金，mode 128 将发送整个余额。

> 💡 注意
>
> 我们正在[构建消息](/develop/func/cookbook#how-to-build-an-internal-message-cell)，但单独添加消息体。
>
> [文档中的 "store_uint() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
>
> [文档中的 "store_slice() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
>
> [文档中的 "store_coins()"](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
>
> [文档中的 "end_cell()"](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
>
> [文档中的 "send_raw_message() "](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### 如何将正文作为片段包含在内部报文 cell 中

发送信息时，信息正文可以作为 `cell` 或 `slice` 发送。在本例中，我们在 `slice` 内发送正文信息。

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
slice message_body = "❤"; 

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
    .store_slice(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

> 💡 Noted
>
> 在本例中，我们使用字面量 `a` 来获取地址。有关字符串字面量的更多信息，请参阅 [docs](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)

> 💡 注意
>
> 在这个例子中，我们使用字面量 `a` 获取地址。你可以在[文档](/develop/func/literals_identifiers#string-literals)中找到更多关于字符串字面量的信息。

> 💡 注意
>
> 在这个例子中，我们使用 mode 3 接收进来的 tons 并发送确切的指定金额（amount），同时从合约余额中支付佣金并忽略错误。mode 64 用于返回所有接收到的 tons，扣除佣金，mode 128 将发送整个余额。

### 如何迭代 tuples（双向）

如果我们想在 FunC 中处理数组或堆栈，那么 tuple 就是必要的。首先，我们需要能够遍历值来处理它们。

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    int len = t.tlen();
    
    int i = 0;
    while (i < len) {
        int x = t.at(i);
        ;; do something with x
        i = i + 1;
    }

    i = len - 1;
    while (i >= 0) {
        int x = t.at(i);
        ;; do something with x
        i = i - 1;
    }
}
```

> 💡 Noted
>
> 我们正在声明 `tlen` 汇编函数。您可以 [在此](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) 阅读更多内容，也可以查看 [所有汇编命令列表](/v3/documentation/tvm/instructions)。
>
> 我们还声明了 `to_tuple` 函数。它只是将任何输入的数据类型更改为元组，因此使用时要小心。

### 如何使用 `asm` 关键字编写自己的函数

在使用任何功能时，我们实际上使用的是 `stdlib.fc` 内为我们预先准备好的方法。但事实上，我们还有更多的机会，我们需要学会自己编写。

当使用任何功能时，实际上我们使用的是为我们预先准备好的 `stdlib.fc` 中的方法。但事实上，我们有更多的机会可以使用，我们需要学会自己编写它们。

```func
;; ~ means it is modifying method
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP"; 
```

如果我们想知道用于迭代的 "元组 "的长度，则应使用 `TLEN` asm 指令编写一个新函数：

```func
int tuple_length (tuple t) asm "TLEN";
```

一些我们已经从 stdlib.fc 中了解到的函数示例：

```func
slice begin_parse(cell c) asm "CTOS";
builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
```

> 💡 Useful links:
>
> [文档中的 "修改方法"](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)
>
> [文档中的 "stdlib"](/v3/documentation/smart-contracts/func/docs/stdlib)
>
> [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 迭代嵌套的 n 个 tuples

有时我们想迭代嵌套的 tuples。以下示例将从头开始迭代并打印格式为 `[[2,6],[1,[3,[3,5]]], 3]` 的 tuple 中的所有项目

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> (tuple) to_tuple (X x) asm "NOP";

;; define global variable
global int max_value;

() iterate_tuple (tuple t) impure {
    repeat (t.tuple_length()) {
        var value = t~tpop();
        if (is_tuple(value)) {
            tuple tuple_value = cast_to_tuple(value);
            iterate_tuple(tuple_value);
        }
        else {
            if(value > max_value) {
                max_value = value;
            }
        }
    }
}

() main () {
    tuple t = to_tuple([[2,6], [1, [3, [3, 5]]], 3]);
    int len = t.tuple_length();
    max_value = 0; ;; reset max_value;
    iterate_tuple(t); ;; iterate tuple and find max value
    ~dump(max_value); ;; 6
}
```

> 💡 Useful links
>
> [文档中的 "全局变量"](/v3/documentation/smart-contracts/func/docs/global_variables)
>
> [文档中的"~dump"](/v3/documentation/smart-contracts/func/docs/builtins#dump-variable)
>
> [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 基本的 tuple 操作

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

() main () {
    ;; creating an empty tuple
    tuple names = empty_tuple(); 
    
    ;; push new items
    names~tpush("Naito Narihira");
    names~tpush("Shiraki Shinichi");
    names~tpush("Akamatsu Hachemon");
    names~tpush("Takaki Yuichi");
    
    ;; pop last item
    slice last_name = names~tpop();

    ;; get first item
    slice first_name = names.first();

    ;; get an item by index
    slice best_name = names.at(2);

    ;; getting the length of the list 
    int number_names = names.tlen();
}
```

### 解决 X 类问题

下面的示例检查元组中是否包含某些值，但元组包含值 X（ cell 、slice、int、tuple、int）。我们需要检查值并进行相应的转换。

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

forall X -> () resolve_type (X value) impure {
    ;; value here is of type X, since we dont know what is the exact value - we would need to check what is the value and then cast it
    
    if (is_null(value)) {
        ;; do something with the null
    }
    elseif (is_int(value)) {
        int valueAsInt = cast_to_int(value);
        ;; do something with the int
    }
    elseif (is_slice(value)) {
        slice valueAsSlice = cast_to_slice(value);
        ;; do something with the slice
    }
    elseif (is_cell(value)) {
        cell valueAsCell = cast_to_cell(value);
        ;; do something with the cell
    }
    elseif (is_tuple(value)) {
        tuple valueAsTuple = cast_to_tuple(value);
        ;; do something with the tuple
    }
}

() main () {
    ;; creating an empty tuple
    tuple stack = empty_tuple();
    ;; let's say we have tuple and do not know the exact types of them
    stack~tpush("Some text");
    stack~tpush(4);
    ;; we use var because we do not know type of value
    var value = stack~tpop();
    resolve_type(value);
}
```

> 💡 Useful links
>
> [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 如何获取当前时间

```func
int current_time = now();
  
if (current_time > 1672080143) {
    ;; do some stuff 
}
```

### 如何生成随机数

:::caution 草案

更多信息请查阅 [随机数生成](/v3/guidelines/smart-contracts/security/random-number-generation)。
:::

```func
randomize_lt(); ;; do this once

int a = rand(10);
int b = rand(1000000);
int c = random();
```

### 模数运算

例如，我们要对所有 256 个数字进行如下计算：`(xp + zp)*(xp-zp)` 。由于这些运算大多用于密码学，因此在下面的示例中，我们将使用蒙托哥马利曲线的模运算符。
请注意，xp+zp 是一个有效的变量名（中间没有空格）。

```func
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 is a prime number for montgomery curves, meaning all operations should be done against its prime
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   ;; muldivmod handles the next two lines itself
   ;; int xp+zp = (xp + zp) % prime;
   ;; int xp-zp = (xp - zp + prime) % prime;
   (_, int xp+zp*xp-zp) = muldivmod(xp + zp, xp - zp, prime);
   return xp+zp*xp-zp;
}
```

> 💡 Useful links
>
> [文档中的 "muldivmod"](/v3/documentation/tvm/instructions#A98C)

### 如何抛出错误

```func
int number = 198;

throw_if(35, number > 50); ;; the error will be triggered only if the number is greater than 50

throw_unless(39, number == 198); ;; the error will be triggered only if the number is NOT EQUAL to 198

throw(36); ;; the error will be triggered anyway
```

[标准 tvm 异常代码](/v3/documentation/tvm/tvm-exit-codes)

### 反转 tuples

由于 tuple 以堆栈的形式存储数据，有时我们必须反转 tuple 才能从另一端读取数据。

```func
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

(tuple) reverse_tuple (tuple t1) {
    tuple t2 = empty_tuple();
    repeat (t1.tuple_length()) {
        var value = t1~tpop();
        t2~tpush(value);
    }
    return t2;
}

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    tuple reversed_t = reverse_tuple(t);
    ~dump(reversed_t); ;; [10 9 8 7 6 5 4 3 2 1]
}
```

> 💡 Useful links
>
> 文档中的["tpush()"](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)

### 如何从列表中删除具有特定索引的项目

```func
int tlen (tuple t) asm "TLEN";

(tuple, ()) remove_item (tuple old_tuple, int place) {
    tuple new_tuple = empty_tuple();

    int i = 0;
    while (i < old_tuple.tlen()) {
        int el = old_tuple.at(i);
        if (i != place) {
            new_tuple~tpush(el);
        }
        i += 1;  
    }
    return (new_tuple, ());
}

() main () {
    tuple numbers = empty_tuple();

    numbers~tpush(19);
    numbers~tpush(999);
    numbers~tpush(54);

    ~dump(numbers); ;; [19 999 54]

    numbers~remove_item(1); 

    ~dump(numbers); ;; [19 54]
}
```

### 确定 slice 是否相等

我们有两种不同的方法来确定相等性。一种是基于 slice 散列，另一种是使用 SDEQ asm 指令。

```func
int are_slices_equal_1? (slice a, slice b) {
    return a.slice_hash() == b.slice_hash();
}

int are_slices_equal_2? (slice a, slice b) asm "SDEQ";

() main () {
    slice a = "Some text";
    slice b = "Some text";
    ~dump(are_slices_equal_1?(a, b)); ;; -1 = true

    a = "Text";
    ;; We use literal `a` to get valid address inside slice from string containing address
    b = "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"a;
    ~dump(are_slices_equal_2?(a, b)); ;; 0 = false
}
```

#### 判断cell是否相等

- 文档中的["slice_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
- [文档中的 "SDEQ"](/v3/documentation/tvm/instructions#C705)

### 确定 cell 是否相等

我们可以根据哈希值轻松确定 cell 是否相等。

```func
int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

() main () {
    cell a = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    cell b = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    ~dump(are_cells_equal?(a, b)); ;; -1 = true
}
```

> 💡 Useful links
>
> docs 中的["cell_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### 确定 tuples 是否相等

更高级的示例是遍历和比较每个 tuple 值。由于它们都是 X，因此我们需要检查并转换为相应的类型，如果是tuple，则进行递归遍历。

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
int are_slices_equal? (slice a, slice b) asm "SDEQ";

int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

(int) are_tuples_equal? (tuple t1, tuple t2) {
    int equal? = -1; ;; initial value to true
    
    if (t1.tuple_length() != t2.tuple_length()) {
        ;; if tuples are differ in length they cannot be equal
        return 0;
    }

    int i = t1.tuple_length();
    
    while (i > 0 & equal?) {
        var v1 = t1~tpop();
        var v2 = t2~tpop();
        
        if (is_null(t1) & is_null(t2)) {
            ;; nulls are always equal
        }
        elseif (is_int(v1) & is_int(v2)) {
            if (cast_to_int(v1) != cast_to_int(v2)) {
                equal? = 0;
            }
        }
        elseif (is_slice(v1) & is_slice(v2)) {
            if (~ are_slices_equal?(cast_to_slice(v1), cast_to_slice(v2))) {
                equal? = 0;
            }
        }
        elseif (is_cell(v1) & is_cell(v2)) {
            if (~ are_cells_equal?(cast_to_cell(v1), cast_to_cell(v2))) {
                equal? = 0;
            }
        }
        elseif (is_tuple(v1) & is_tuple(v2)) {
            ;; recursively determine nested tuples
            if (~ are_tuples_equal?(cast_to_tuple(v1), cast_to_tuple(v2))) {
                equal? = 0;
            }
        }
        else {
            equal? = 0;
        }

        i -= 1;
    }

    return equal?;
}

() main () {
    tuple t1 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);
    tuple t2 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);

    ~dump(are_tuples_equal?(t1, t2)); ;; -1 
}
```

> 💡 Useful links
>
> docs 中的["cell_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)
>
> [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 生成内部地址

当我们的合约需要部署一个新合约，但不知道他的地址时，我们需要生成一个内部地址。假设我们已经有了 `state_init` - 新合约的代码和数据。

为相应的 MsgAddressInt TLB 创建内部地址。

```func
(slice) generate_internal_address (int workchain_id, cell state_init) {
    ;; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;

    return begin_cell()
        .store_uint(2, 2) ;; addr_std$10
        .store_uint(0, 1) ;; anycast nothing
        .store_int(workchain_id, 8) ;; workchain_id: -1
        .store_uint(cell_hash(state_init), 256)
    .end_cell().begin_parse();
}

() main () {
    slice deploy_address = generate_internal_address(workchain(), state_init);
    ;; then we can deploy new contract
}
```

> 💡 Noted
>
> 在本例中，我们使用 `workchain()` 获取工作链的 ID。有关工作链 ID 的更多信息，请参阅 [docs](/v3/documentation/smart-contracts/addresses#workchain-id) 。

> 💡 Useful links
>
> docs 中的["cell_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### 生成外部地址

由于我们需要确定地址占用的位数，因此还需要[声明一个使用 `UBITSIZE` 操作码的 asm 函数](#how-to-write-own-functions-using-asm-keyword)，该函数将返回存储数字所需的最小位数。

```func
(int) ubitsize (int a) asm "UBITSIZE";

slice generate_external_address (int address) {
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    
    int address_length = ubitsize(address);
    
    return begin_cell()
        .store_uint(1, 2) ;; addr_extern$01
        .store_uint(address_length, 9)
        .store_uint(address, address_length)
    .end_cell().begin_parse();
}
```

由于我们需要确定地址所占的位数，因此还需要 [声明一个 asm 函数](#how-to-write-own-functions-using-asm-keyword)，并使用操作码 `UBITSIZE` 返回存储数字所需的最小位数。

> 💡 Useful links
>
> [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions#B603)

### 如何在本地存储中存储和加载字典

而存储字典的逻辑如下所示：

```func
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

而存储字典的逻辑就像下面的例子一样：

```func
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```

> 💡 Useful links
>
> [文档中的 "get_data()"](/v3/documentation/smart-contracts/func/docs/stdlib/#get_data)
>
> 文档中的["new_dict()"](/v3/documentation/smart-contracts/func/docs/stdlib/#new_dict)
>
> 文档中的 ["slice_empty?()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
>
> 文档中的["load_dict()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
>
> [文档中的 "~"](/v3/documentation/smart-contracts/func/docs/statements#unary-operators)

### 如何发送简单信息

我们发送带有注释的 TON 的通常方式实际上是发送一条简单的消息。要指定信息正文为 "注释"，我们应将信息文本前的 "32 位 "设置为 0。

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

> 💡 Useful links
>
> [文档中的 "消息布局"](/v3/documentation/smart-contracts/message-management/sending-messages)

### 如何用接收帐户发送信息

如果我们需要在用户和主合约之间执行任何操作，即我们需要一个代理合约，那么下面的合约示例对我们很有用。

```func
() recv_internal (slice in_msg_body) {
    {-
        This is a simple example of a proxy-contract.
        It will expect in_msg_body to contain message mode, body and destination address to be sent to.
    -}

    int mode = in_msg_body~load_uint(8); ;; first byte will contain msg mode
    slice addr = in_msg_body~load_msg_addr(); ;; then we parse the destination address
    slice body = in_msg_body; ;; everything that is left in in_msg_body will be our new message's body

    cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(100) ;; just for example
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
        .store_slice(body)
    .end_cell();
    send_raw_message(msg, mode);
}
```

> 💡 Useful links
>
> [文档中的 "消息布局"](/v3/documentation/smart-contracts/message-management/sending-messages)
>
> [文档中的"load_msg_addr() "](/v3/documentation/smart-contracts/func/docs/stdlib/#load_msg_addr)

### 如何发送包含全部余额的信息

如果我们需要发送智能合约的全部余额，那么在这种情况下，我们需要使用发送 "mode 128"。这种情况的一个例子是代理合约，它接受付款并转发给主合约。

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(0) ;; we don't care about this value right now
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 128); ;; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract
```

> 💡 Useful links
>
> [文档中的 "消息布局"](/v3/documentation/smart-contracts/message-management/sending-messages)
>
> [文档中的 "消息模式"](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### 如何发送带有长文本注释的信息

我们知道，一个 " cell "（< 1023 位）只能容纳 127 个字符。如果我们需要更多，就需要组织 snake cells 。

```func
{-
    If we want to send a message with really long comment, we should split the comment to several slices.
    Each slice should have <1023 bits of data (127 chars).
    Each slice should have a reference to the next one, forming a snake-like structure.
-}

cell body = begin_cell()
    .store_uint(0, 32) ;; zero opcode - simple message with comment
    .store_slice("long long long message...")
    .store_ref(begin_cell()
        .store_slice(" you can store string of almost any length here.")
        .store_ref(begin_cell()
            .store_slice(" just don't forget about the 127 chars limit for each slice")
        .end_cell())
    .end_cell())
.end_cell();

cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    ;; We use literal `a` to get valid address inside slice from string containing address 
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; we want to store body as a ref
    .store_ref(body)
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

> 💡 Useful links
>
> [文档中的 "内部信息"](/v3/documentation/smart-contracts/message-management/internal-messages)

### 如何从片段中只获取数据位（无参考文献）

如果我们对 "片断 "中的 "引用 "不感兴趣，那么我们可以获取一个单独的日期并使用它。

```func
slice s = begin_cell()
    .store_slice("Some data bits...")
    .store_ref(begin_cell().end_cell()) ;; some references
    .store_ref(begin_cell().end_cell()) ;; some references
.end_cell().begin_parse();

slice s_only_data = s.preload_bits(s.slice_bits());
```

> 💡 Useful links
>
> [文档中的 " slice 原语"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice-primitives)
>
> 文档中的["preload_bits()"](/v3/documentation/smart-contracts/func/docs/stdlib/#preload_bits)
>
> 文档中的["slice_bits()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_bits)

### 如何定义自己的修改方法

修改方法允许在同一变量内修改数据。这可以与其他编程语言中的引用相比较。

```func
(slice, (int)) load_digit (slice s) {
    int x = s~load_uint(8); ;; load 8 bits (one char) from slice
    x -= 48; ;; char '0' has code of 48, so we substract it to get the digit as a number
    return (s, (x)); ;; return our modified slice and loaded digit
}

() main () {
    slice s = "258";
    int c1 = s~load_digit();
    int c2 = s~load_digit();
    int c3 = s~load_digit();
    ;; here s is equal to "", and c1 = 2, c2 = 5, c3 = 8
}
```

> 💡 Useful links
>
> [文档中的 "修改方法"](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)

### 如何将字符串转换为 int

```func
;; Unoptimized variant
int pow (int a, int n) {
    int i = 0;
    int value = a;
    while (i < n - 1) {
        a *= value;
        i += 1;
    }
    return a;
}

;; Optimized variant
(int) binpow (int n, int e) {
    if (e == 0) {
        return 1;
    }
    if (e == 1) {
        return n;
    }
    int p = binpow(n, e / 2);
    p *= p;
    if ((e % 2) == 1) {
        p *= n;
    }
    return p;
}

() main () {
    int num = binpow(2, 3);
    ~dump(num); ;; 8
}
```

### 如何将 int 转换为 string

```func
slice string_number = "26052021";
int number = 0;

while (~ string_number.slice_empty?()) {
    int char = string_number~load_uint(8);
    number = (number * 10) + (char - 48); ;; we use ASCII table
}

~dump(number);
```

### 如何遍历字典

```func
int n = 261119911;
builder string = begin_cell();
tuple chars = null();
do {
    int r = n~divmod(10);
    chars = cons(r + 48, chars);
} until (n == 0);
do {
    int char = chars~list_next();
    string~store_uint(char, 8);
} until (null?(chars));

slice result = string.end_cell().begin_parse();
~dump(result);
```

### 如何迭代字典

字典在处理大量数据时非常有用。我们可以使用内置方法 `dict_get_min?` 和 `dict_get_max?` 分别获取键值的最小值和最大值。此外，我们还可以使用 `dict_get_next?` 遍历字典。

```func
cell d = new_dict();
d~udict_set(256, 1, "value 1");
d~udict_set(256, 5, "value 2");
d~udict_set(256, 12, "value 3");

;; iterate keys from small to big
(int key, slice val, int flag) = d.udict_get_min?(256);
while (flag) {
    ;; do something with pair key->val
    
    (key, val, flag) = d.udict_get_next?(256, key);
}
```

> 💡 Useful links
>
> [文档中的 "字典原语"](/v3/documentation/smart-contracts/func/docs/stdlib/#dictionaries-primitives)
>
> [文档中的 "dict_get_max?() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_max)
>
> [文档中的 "dict_get_min?() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_min)
>
> [文档中的"dict_get_next?() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)
>
> [文档中的 "dict_set() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_set)

### 如何递归遍历cell树

```func
cell names = new_dict();
names~udict_set(256, 27, "Alice");
names~udict_set(256, 25, "Bob");

names~udict_delete?(256, 27);

(slice val, int key) = names.udict_get?(256, 27);
~dump(val); ;; null() -> means that key was not found in a dictionary
```

### 如何递归遍历 cell 树

我们知道，一个 " cell  "最多可以存储 1023 位数据和 4 个引用。为了绕过这一限制，我们可以使用 cell 树，但要做到这一点，我们需要能够遍历 cell 树，以便进行适当的数据处理。

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; just some cell for example
    cell c = begin_cell()
        .store_uint(1, 16)
        .store_ref(begin_cell()
            .store_uint(2, 16)
        .end_cell())
        .store_ref(begin_cell()
            .store_uint(3, 16)
            .store_ref(begin_cell()
                .store_uint(4, 16)
            .end_cell())
            .store_ref(begin_cell()
                .store_uint(5, 16)
            .end_cell())
        .end_cell())
    .end_cell();

    ;; creating tuple with no data, which plays the role of stack
    tuple stack = null();
    ;; bring the main cell into the stack to process it in the loop
    stack~push_back(c);
    ;; do it until stack is not null
    while (~ stack.is_null()) {
        ;; get the cell from the stack and convert it to a slice to be able to process it
        slice s = stack~pop_back().begin_parse();

        ;; do something with s data

        ;; if the current slice has any refs, add them to stack
        repeat (s.slice_refs()) {
            stack~push_back(s~load_ref());
        }
    }
}
```

> [文档中的“null()”](/develop/func/stdlib/#null)
>
> [文档中的“slice_refs()”](/develop/func/stdlib/#slice_refs)
>
> [文档中的 "null() "](/v3/documentation/smart-contracts/func/docs/stdlib/#null)
>
> [文档中的 "slice_refs()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)

### 如何遍历 Lisp 类型列表

数据类型 tuple 最多可以容纳 255 个值。如果这还不够，我们应该使用 Lisp 类型的列表。我们可以将一个 tuple 放入另一个 tuple 中，从而绕过限制。

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; some example list
    tuple l = null();
    l~push_back(1);
    l~push_back(2);
    l~push_back(3);

    ;; iterating through elements
    ;; note that this iteration is in reversed order
    while (~ l.is_null()) {
        var x = l~pop_back();

        ;; do something with x
    }
}
```

> 💡 有用的链接
>
> [文档中的“Lisp风格列表”](/develop/func/stdlib/#lisp-style-lists)
>
> [文档中的“null()”](/develop/func/stdlib/#null)

### 如何发送部署消息（仅使用 stateInit 或使用 stateInit 和 body）

```func
() deploy_with_stateinit(cell message_header, cell state_init) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(0, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}

() deploy_with_stateinit_body(cell message_header, cell state_init, cell body) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(1, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .store_ref(body)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}
```

### 如何构建 stateInit cell

```func
() build_stateinit(cell init_code, cell init_data) {
  var state_init = begin_cell()
    .store_uint(0, 1) ;; split_depth:(Maybe (## 5))
    .store_uint(0, 1) ;; special:(Maybe TickTock)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(0, 1) ;; (HashmapE 256 SimpleLib)
    .store_ref(init_code)
    .store_ref(init_data)
    .end_cell();
}
```

### 如何计算合约地址（使用 stateInit）

```func
() calc_address(cell state_init) {
  var future_address = begin_cell() 
    .store_uint(2, 2) ;; addr_std$10
    .store_uint(0, 1) ;; anycast:(Maybe Anycast)
    .store_uint(0, 8) ;; workchain_id:int8
    .store_uint(cell_hash(state_init), 256) ;; address:bits256
    .end_cell();
}
```

### 如何更新智能合约逻辑

下面是一个简单的 `СounterV1` 智能合约，它具有递增计数器和更新智能合约逻辑的功能。

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);