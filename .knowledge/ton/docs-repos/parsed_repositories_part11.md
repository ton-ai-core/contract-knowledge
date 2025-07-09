# GitHub Docs Parser - Part 11

  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

---
network:testnet library:tonweb
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

---
network:mainnet library:tonweb
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.


If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

---
library:npmton
---
For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton).

---

---
library:tonweb
---
For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb).

---

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: 01-wallet/options.json
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/options.json
================================================
{
  "network": {
    "name": "Network",
    "order": 1,
    "default": "testnet",
    "options": {
      "testnet": {
        "name": "Testnet",
        "order": 1,
        "url": "https://ton.org/docs/develop/smart-contracts/environment/testnet",
        "pros": "free to use",
        "cons": "less reliable, requires special wallets"
      },
      "mainnet": {
        "name": "Mainnet",
        "url": "https://tonmon.xyz/?orgId=1&refresh=5m",
        "order": 2,
        "pros": "very reliable, fast, works with all wallets",
        "cons": "not free to use (but very cheap)"
      }
    }
  },
  "library": {
    "name": "Library",
    "order": 2,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      },
      "tonweb": {
        "name": "TonWeb (JavaScript)",
        "order": 2,
        "url": "https://github.com/toncenter/tonweb",
        "pros": "maintained by core team, supports ton services",
        "cons": "mediocre TypeScript support"
      }
    }
  }
}


================================================
FILE: 01-wallet/test/npmton/README.md
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/README.md
================================================
# Automated test for this tutorial

This directory helps us make sure that this tutorial is always working and none of the libraries it depends on has introduced breaking changes. The directory contains a simple automated test that performs all the steps and makes sure they work as expected.

If one of the steps isn't working for you, run the test and see if it passes on your machine. If it does, see where the test code is different from your code. If it doesn't, please open an issue and let us know so we can fix it asap.

The test runs weekly on CI, but you can run it manually in terminal:

```
./index.sh
```

Before running the test, create the file `.env` in the repo root with this content:
```
MNEMONIC="unfold sugar water ..."
```

This should be the 24 word mnemonic for a deployed testnet v4 wallet that contains at least 1 TON.


================================================
FILE: 01-wallet/test/npmton/index.sh
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/index.sh
================================================
set -ev
npm init --yes
npm install dotenv
npm install typescript
npx tsc --init
npm install ts-node
npm install @ton/ton @ton/crypto @ton/core
npm install @orbs-network/ton-access
npx ts-node step7.ts > step7.output.txt
diff step7.output.txt step7.expected.txt
npx ts-node step8.ts > step8.output.txt
diff step8.output.txt step8.expected.txt
npx ts-node step9.ts > step9.output.txt
diff step9.output.txt step9.expected.txt



================================================
FILE: 01-wallet/test/npmton/step7.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/step7.expected.txt
================================================
kQC9Q5w33dGVyPVVgUct_tRmYQ-JmayerW0IxN0Gf2cTtsJA
workchain: 0



================================================
FILE: 01-wallet/test/npmton/step7.ts
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/step7.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // Notice:
  // Due to limitations in GitHub Actions, we are unable to use secrets to 
  // store a secure mnemonic for the wallet during the testing of pull 
  // requests from forked repositories by our contributors. 
  // As a result, we are currently using a public wallet with an exposed mnemonic in 
  // our test files when running tests in GH Actions.
  // const mnemonic = process.env.MNEMONIC ;
  const mnemonic =
    'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';


    // open wallet v4 (notice the correct wallet version here)
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString({ testOnly: true }));

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();


================================================
FILE: 01-wallet/test/npmton/step8.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/step8.expected.txt
================================================
balance: more than 1
seqno: more than 1



================================================
FILE: 01-wallet/test/npmton/step8.ts
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/step8.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // Notice:
  // Due to limitations in GitHub Actions, we are unable to use secrets to 
  // store a secure mnemonic for the wallet during the testing of pull 
  // requests from forked repositories by our contributors. 
  // As a result, we are currently using a public wallet with an exposed mnemonic in 
  // our test files when running tests in GH Actions.
  // const mnemonic = process.env.MNEMONIC;
  const mnemonic =
    'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';

  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460'
  });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  //console.log("balance:", fromNano(balance));
  console.log("balance:", parseFloat(fromNano(balance)) >= 1 ? "more than 1" : "less than 1");

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  //console.log("seqno:", seqno);
  console.log("seqno:", seqno >= 1 ? "more than 1" : "less than 1");
}

main();


================================================
FILE: 01-wallet/test/npmton/step9.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/step9.expected.txt
================================================
transaction confirmed!



================================================
FILE: 01-wallet/test/npmton/step9.ts
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton/step9.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { retry } from "../../../helpers/retry"

async function main() {
  // Notice:
  // Due to limitations in GitHub Actions, we are unable to use secrets to 
  // store a secure mnemonic for the wallet during the testing of pull 
  // requests from forked repositories by our contributors. 
  // As a result, we are currently using a public wallet with an exposed mnemonic in 
  // our test files when running tests in GH Actions.
  // const mnemonic = process.env.MNEMONIC;
  const mnemonic =
    'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';
    
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460'
  });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON to mint NFT
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    //console.log("waiting for transaction to confirm...");
    await sleep(1500);
    await retry(async () => { currentSeqno = await walletContract.getSeqno(); }, {retries: 10, delay: 1000});
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


================================================
FILE: 01-wallet/test/tonweb/README.md
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/README.md
================================================
# Automated test for this tutorial

This directory helps us make sure that this tutorial is always working and none of the libraries it depends on has introduced breaking changes. The directory contains a simple automated test that performs all the steps and makes sure they work as expected.

If one of the steps isn't working for you, run the test and see if it passes on your machine. If it does, see where the test code is different from your code. If it doesn't, please open an issue and let us know so we can fix it asap.

The test runs weekly on CI, but you can run it manually in terminal:

```
./index.sh
```

Before running the test, create the file `.env` in the repo root with this content:
```
MNEMONIC="unfold sugar water ..."
```

This should be the 24 word mnemonic for a deployed testnet v4 wallet that contains at least 1 TON.


================================================
FILE: 01-wallet/test/tonweb/index.sh
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/index.sh
================================================
set -ev
npm init --yes
npm install dotenv
npm install typescript
npx tsc --init
npm install ts-node
npm install tonweb tonweb-mnemonic
npm install @orbs-network/ton-access
npx ts-node step7.ts > step7.output.txt
diff step7.output.txt step7.expected.txt
npx ts-node step8.ts > step8.output.txt
diff step8.output.txt step8.expected.txt
npx ts-node step9.ts > step9.output.txt
diff step9.output.txt step9.expected.txt



================================================
FILE: 01-wallet/test/tonweb/step7.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/step7.expected.txt
================================================
kQC9Q5w33dGVyPVVgUct_tRmYQ-JmayerW0IxN0Gf2cTtsJA
workchain: 0



================================================
FILE: 01-wallet/test/tonweb/step7.ts
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/step7.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  // Notice:
  // Due to limitations in GitHub Actions, we are unable to use secrets to 
  // store a secure mnemonic for the wallet during the testing of pull 
  // requests from forked repositories by our contributors. 
  // As a result, we are currently using a public wallet with an exposed mnemonic in 
  // our test files when running tests in GH Actions.
  // const mnemonic = process.env.MNEMONIC;
  const mnemonic =
    'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';

  const key = await mnemonicToKeyPair(mnemonic!.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true, true)); // last true required for testnet

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();


================================================
FILE: 01-wallet/test/tonweb/step8.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/step8.expected.txt
================================================
balance: more than 1
seqno: more than 1



================================================
FILE: 01-wallet/test/tonweb/step8.ts
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/step8.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  // Notice:
  // Due to limitations in GitHub Actions, we are unable to use secrets to 
  // store a secure mnemonic for the wallet during the testing of pull 
  // requests from forked repositories by our contributors. 
  // As a result, we are currently using a public wallet with an exposed mnemonic in 
  // our test files when running tests in GH Actions.
  // const mnemonic = process.env.MNEMONIC;
  const mnemonic =
    'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';
    
  const key = await mnemonicToKeyPair(mnemonic!.split(" "));

  // initialize ton rpc client on testnet
  const tonweb = new TonWeb(new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", { apiKey: "f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460" }));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  //console.log("balance:", TonWeb.utils.fromNano(balance));
  console.log("balance:", parseFloat(TonWeb.utils.fromNano(balance)) >= 1 ? "more than 1" : "less than 1");

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  //console.log("seqno:", seqno);
  console.log("seqno:", seqno ?? 0 >= 1 ? "more than 1" : "less than 1");
}

main();


================================================
FILE: 01-wallet/test/tonweb/step9.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/step9.expected.txt
================================================
transaction confirmed!



================================================
FILE: 01-wallet/test/tonweb/step9.ts
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb/step9.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  // Notice:
  // Due to limitations in GitHub Actions, we are unable to use secrets to 
  // store a secure mnemonic for the wallet during the testing of pull 
  // requests from forked repositories by our contributors. 
  // As a result, we are currently using a public wallet with an exposed mnemonic in 
  // our test files when running tests in GH Actions.
  // const mnemonic = process.env.MNEMONIC;
  const mnemonic =
    'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';
    
  const key = await mnemonicToKeyPair(mnemonic!.split(" "));

  // initialize ton rpc client on testnet
  const tonweb = new TonWeb(new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", { apiKey: "f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460" }));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    //console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


================================================
FILE: 02-contract/author.json
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/author.json
================================================
{
  "name": "Tal Kol",
  "image": "talkol.jpg",
  "telegram": "https://t.me/talkol",
  "twitter": "https://twitter.com/koltal"
}


================================================
FILE: 02-contract/index.md
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/index.md
================================================

# TON Hello World part 2: Step by step guide for writing your first smart contract

A smart contract is simply a computer program running on TON Blockchain - or more exactly its [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) (TON Virtual Machine). The contract is made of code (compiled TVM instructions) and data (persistent state) that are stored in some address on TON Blockchain.

In the world of blockchain, *code is law*, meaning that instead of lawyers and papers, computer instructions define in absolute terms the rules of interaction between the different users of the contract. Before engaging with any smart contract as a user, you're expected to review its code and thus understand its terms of agreement. Accordingly, we'll make an effort to make our contract as easy to read as possible, so its users could understand what they're getting into.

## Dapps - decentralized applications

Smart contracts are a key part of *decentralized apps* - a special type of application invented in the blockchain era, that does not depend on any single entity to run it. Unlike the app Uber, for example, which depends on the company Uber Inc to run it - a *decentralized Uber* would allow riders and drivers to interact directly (order, pay for and fulfill rides) without any intermediary like Uber Inc. Dapps are also unstoppable - if we don't depend on anyone specific to run them, nobody can take them down.

Dapps on TON Blockchain are usually made of 2 main projects:

* Smart contracts in the [FunC](https://ton.org/docs/develop/func/overview) programming language that are deployed on-chain - these act as the *backend server* of the app, with a *database* for persistent storage.

* Web frontend for interacting with the dapp from a web browser - this acts as the *frontend* or *client*, normally with special support for Telegram messenger in the form of a [Telegram Web App](https://core.telegram.org/bots/webapps).

Throughout this series of tutorials, we will build a full dapp together and see detailed implementations of both projects.

## Step 1: Define our first smart contract

So what are we going to build? Our smart contract will be quite simple:

Its main feature is to hold a *counter*. The counter will start at some number, and allow users to send *increment* transactions to the contract, which will in turn increase the counter value by 1. The contract will also have a getter function that will allow any user to query the current value of the counter.

In later tutorials we will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

For convenience, our development environment will rely on several clever scripts for testing, compiling and deploying our code. The most convenient language for these scripts is JavaScript, executed by an engine called Node.js. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v18. You can verify your nodejs version by running `node -v` in terminal.

You will also need a decent IDE with FunC and TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com/) - it's free and open source. Also install the [FunC Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) to add syntax highlighting for the FunC language.

## Step 3: Set up the project

Let's open a terminal in the project directory where you want to place your project. When you run the following command, be sure to choose "Counter" as the contract name and select "an empty contract (FunC)" from the list of templates. This will help prevent any issues in the future.

```console
npm create ton@latest
```

This will create a new project with a preconfigured structure, which includes a workflow for developing, testing, and deploying smart contracts using the Blueprint SDK. The project structure will initially consist of four directories: `contracts`, `wrappers`, `tests`, and `scripts`. Later on, we will also create a `build` directory.

And finally, execute the following command to open a folder, allowing us to proceed with the tutorial:

```console
cd your_project_directory
```

## Step 4: Structuring our smart contract

Much like everything else in life, smart contracts in FunC are divided into 3 sections. These sections are: *storage*, *messages* and *getters*.

The **storage** section deals with our contract's persistent data. Our contract will have to store data between calls from different users, for example the value of our *counter* variable. To write this data to state storage, we will need a write/encode function and to read this data back from state storage, we will need a read/decode function.

The **messages** section deals with messages sent to our contract. The main form of interaction with contracts on TON Blockchain is by sending them messages. We mentioned before that our contract will need to support a variety of actions like *increment*, *deposit*, *withdraw* and *transfer ownership*. All of these operations are performed by users as transactions. These operations are not read-only because they change something in the contract's persistent state.

The **getters** section deals with read-only interactions that don't change state. For example, we would want to allow users to query the value of our *counter*, so we can implement a getter for that. We've also mentioned that the contract has a special *owner*, so what about a getter to query that. Since our contract can hold money (TON coins), another useful getter could be to query the current balance.

## Step 5: Implement the Counter contract

We're about to write our first lines in FunC! Our first task would be to implement the *counter* feature of our contract.

The FunC programming language is very similar to the [C language](https://en.wikipedia.org/wiki/C_(programming_language)). It has strict types, which is a good idea, since compilation errors will help us spot contract mistakes early on. The language was designed specifically for TON Blockchain, so you will not find a lot of documentation beyond the [official FunC docs](https://ton.org/docs/develop/func/overview).

Before the first section, please remember to keep the following line of code at the beginning of the file to import the standard library, as its absence can cause issues later on.

```func
#include "imports/stdlib.fc";
```

### Storage

Let's start with the first section, *storage*, and implement two utility functions (which we will use later) for reading and writing variables to the contract's persistent state - `load_data()` and `save_data()`. The primary variable will be the counter value. We must persist this value to storage because we need to remember it between calls. The appropriate type for our counter variable is `int`. Notice [in the docs](https://ton.org/docs/develop/func/types#atomic-types) that the `int` TVM runtime type is always 257 bit long (256 bit signed) so it can hold huge huge numbers - I'm pretty sure the universe has less than 2^256 atoms in it, so you'll never have a number so large that you can't fit in it. Storing the full 257 bits in blockchain storage is somewhat wasteful because the contract pays rent proportionally to the total amount of data it keeps. To optimize costs, let's keep in persistent storage just the lowest 64 bits - capping our counter's maximum value at 2^64 which should be enough:

```func
(int) load_data() inline {                 ;; read function declaration - returns int as result
  var ds = get_data().begin_parse();       ;; load the storage cell and start parsing as a slice
  return (ds~load_uint(64));               ;; read a 64 bit unsigned int from the slice and return it
}

() save_data(int counter) impure inline {  ;; write function declaration - takes an int as arg
  set_data(begin_cell()                    ;; store the storage cell and create it with a builder
    .store_uint(counter, 64)               ;; write a 64 bit unsigned int to the builder
    .end_cell());                          ;; convert the builder to a cell
}
```

The standard library functions `get_data()` and `set_data()` are documented [here](https://ton.org/docs/develop/func/stdlib#persistent-storage-save-and-load) and load/store the storage cell. We will cover [*cells*](https://ton.org/docs/develop/func/types#atomic-types) in detail in future posts of this series. Cells are read from using the [*slice*](https://ton.org/docs/develop/func/types#atomic-types) type (an array of bits) and written to using the [*builder*](https://ton.org/docs/develop/func/types#atomic-types) type. The various methods that you see are all taken from the [standard library](https://ton.org/docs/develop/func/stdlib). Also notice two interesting function modifiers that appear in the declarations - [*inline*](https://ton.org/docs/develop/func/functions#inline-specifier) and [*impure*](https://ton.org/docs/develop/func/functions#impure-specifier).

### Messages

Let's continue to the next section, *messages*, and implement the main message handler of our contract - `recv_internal()`. This is the primary entry point of our contract. It runs whenever a message is sent as a transaction to the contract by another contract or by a user's wallet contract:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Messages sent between contracts are called [internal messages](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages). TON also supports [external messages](https://ton.org/docs/develop/smart-contracts/messages) through the handler `recv_external()`, but as a dapp developer you're never expected to use them. External messages are used for very specific cases, mainly when implementing wallet contracts, that you would normally never have to write by yourself. You can safely ignore them.

Internal messages received by the contract may be empty. This is what happens for example when somebody sends TON coins to the contract from their wallet. This is useful for funding the contract so it can pay fees. In order to be able to receive those incoming transfers we will have to return successfully when an empty message arrives.

If an incoming message is not empty, the first thing to do is read its operation type. By convention, internal messages are [encoded](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) with a 32 bit unsigned int in the beginning that acts as operation type (op for short). We are free to assign any serial numbers we want to our different ops. In this case, we've assigned the number `1` to the *increment* action, which is handled by writing back to persistent state the current value counter plus 1.

### Getters

Our last section, as you recall, is *getters*. Let's implement a simple getter that will allow users to query the counter value:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

We can choose what input arguments the getter takes as input and what output it returns as result. Also notice the function modifier appearing in the declaration - [*method_id*](https://ton.org/docs/develop/func/functions#method_id). It is customary to place `method_id` on all getters.

That's it. We completed our 3 sections and the first version of our contract is ready. To get the complete code, simply concat the 3 snippets above and replace the existing code in `contracts/counter.fc`. This will be the FunC (`.fc` file extension) source file of our contract. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc).

## Step 6: Build the counter contract

Right now, the contract is just FunC source code. To get it to run on-chain, we need to convert it to TVM [bytecode](https://ton.org/docs/learn/tvm-instructions/instructions).

In TON, we don't compile FunC directly to bytecode, but instead go through another programming language called [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). Just like FunC, Fift is another language that was designed specifically for TON Blockchain. It's a low level language that is very close to TVM opcodes. For us regular mortals, Fift is not very useful, so unless you're planning on some extra advanced things, I believe you can safely ignore it for now.

Since we're using func-js for building, it would be a good idea to create a directory where we can store the build result. To do this, open the terminal and run the following command:

```console
mkdir build
```

The func-js package contains everything we need to compile our contract to bytecode. To use it, open terminal in the project directory and run the following:

```console
npx func-js contracts/counter.fc --boc build/counter.cell
```

The build should succeed, with the output of this command being a new file - `counter.cell`. This is a binary file that finally contains the TVM bytecode in cell format that is ready to be deployed on-chain. This will actually be the only file we need for deployment moving forward (we won't need the FunC source file).

## Step 7: Prepare init data for deploying on-chain

Now that our contract has been compiled to bytecode, we can finally see it in action running on-chain. The act of uploading the bytecode to the blockchain is called *deployment*. The deployment result would be an address where the contract resides. This address will allow us to communicate with this specific contract instance later on and send it transactions.

There are two variations of TON Blockchain we can deploy to - *mainnet* and *testnet*. We covered both in the previous tutorial. Personally, I almost never deploy to testnet. There are far better ways to gain confidence that my code is working as expected. The primary of which is writing a dedicated *test suite*. We will cover this in detail in one of the next tutorials. For now, let's assume the code is working perfectly and no further debugging is required.

### Init arguments

The new address of our deployed contract in TON depends on only two things - the deployed bytecode (initial code) and the initial contract storage (initial data). You can say that the address is some derivation of the hash of both. If two different developers were to deploy the exact same code with the exact same initialization data, they would collide.

The bytecode part is easy, we have that ready as a cell in the file `counter.cell` that we compiled in step 6. Now what about the initial contract storage? As you recall, the format of our persistent storage data was decided when we implemented the function `save_data()` of our contract FunC source. Our storage layout was very simple - just one unsigned int of 64 bit holding the counter value. Therefore, to initialize our contract, we would need to generate a data cell holding some arbitrary initial uint64 value - for example the number `1`.

### Interface class

The recommended way to interact with contracts is to create a small TypeScript class that will implement the interaction interface with the contract. We're using the project structure created by Blueprint, but we're still working on low-level aspects.
Use the following code in `wrappers/Counter.ts` to create the initial data cell for deployment:

```ts
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
}
```

Notice a few interesting things about this TypeScript code. First, it depends on the package [@ton/core](https://www.npmjs.com/package/@ton/core) instead of [@ton/ton](https://www.npmjs.com/package/@ton/ton), which contains a small subset of base types and is therefore slower to change - an important feature when building a stable interface for our contract. Second, the code that creates the data cell mimics the FunC API and is almost identical to our `save_data()` FunC function. Third, we can see the derivation of the contract address from the code cell and data cell using the function `contractAddress`.

The actual deployment involves sending the first message that will cause our contract to be deployed. We can piggyback any message that is directed towards our contract. This can even be the increment message with op #1, but we will do something simpler. We will just send some TON coins to our contract (an empty message) and piggyback that. Let's make this part of our interface. Add the function `sendDeploy()` to `wrappers/Counter.ts` - this function will send the deployment message:

```ts
// export default class Counter implements Contract {

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

// }
```

In every deployment we need to send some TON coins to our contract so that its balance is not zero. Contracts need to continually pay rent fees otherwise they risk being deleted. According to the [docs](https://ton.org/docs/develop/smart-contracts/fees#storage-fee), storage fees are about 4 TON per MB per year. Since our contract stores less than 1 KB, a balance of 0.01 TON should be enough for more than 2 years. In any case you can always check this in an explorer and send more TON to the contract if it runs low.

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step7.ts).

## Step 8: Deploy the contract on-chain

Communicating with the live network for the deployment will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

The deployment is going to cost gas and should be done through a wallet that will fund it. I'm assuming that you have some familiarity with TON wallets and how they're derived from 24 word secret mnemonics. If not, be sure to follow the previous tutorial in this series.

As you recall from the previous tutorial, TON wallets can come in multiple versions. The code below relies on "wallet v4 r2", if your wallet is different, either switch [Tonkeeper](https://tonkeeper.com) through "Settings" to this version, or modify the code below to use your version. Also remember to use a wallet works with the correct network you've chosen - testnet or mainnet.

Replace the current code in `scripts/deployCounter.ts` with a script that will use the interface class we have just written:

---
network:testnet
---
```ts
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class from step 7

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

---
network:mainnet
---
```ts
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class from step 7

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

Before running this code, make sure you have enough TON in your wallet for the gas payments and the TON sent to the contract during the deploy.

Another thing to watch out for is collisions between different users of this tutorial. As you recall, if the code and initial data of two contracts are identical, they will have the same address. If all followers of this tutorial would choose initial counter value of `1` - then all of them would collide and only the first would actually deploy the contract. To make sure this doesn't happen, the code above initializes the counter value to the current number of milliseconds since the epoch (something like 1674253934361). This guarantees that your contract for deployment is unique.

To deploy a contract using our script, run the following command in the terminal and follow the on-screen instructions:

```console
npx blueprint run
```

---
network:testnet
---
If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance. A common mistake is trying to use a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the previous tutorial, check your wallet address in an [explorer](https://testnet.tonscan.org) and if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

The script will print the newly deployed contract address - mine is `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb`. You can open your address in an [explorer](https://testnet.tonscan.org) to verify that the deploy went smoothly. This is what it should look like:

---

---
network:mainnet
---
If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance. A common mistake is trying to use a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the previous tutorial, check your wallet address in an [explorer](https://tonscan.org) and if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

The script will print the newly deployed contract address - mine is `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb`. You can open your address in an [explorer](https://tonscan.org) to verify that the deploy went smoothly. This is what it should look like:

---

<img src="https://i.imgur.com/SLR7nmE.png" width=600 /><br>

Write down your deployed contract address. We're going to use it in the next step.

## Step 9: Call a getter on the deployed contract

There are two ways to interact with a smart contract - calling a getter to read data from it or sending a message that can potentially change its state (write). We should support these interactions in the contract interface class that we created in step 7.

Anyone who wants to access the contract from TypeScript would simply use this interface class. This is excellent for separation of responsibilities within your team. The developer of the contract can provide this class to the developer of the client to abstract away implementation details such as how messages should be encoded in the binary level. Let's start with the getter.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

// }
```

Notice that methods in the interface class that call getters must start with the word `get`. This prefix is a requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) TypeScript library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step9.ts).

### Executing the call

Calling a getter is free and does not cost gas. The reason is that this call is read-only, so it does not require consensus by the validators and is not stored in a block on-chain for all eternity like transaction are.

Let's create a new script called `getCounter.ts` in the `scripts` folder and use our shiny interface class to make the call. We're going to emulate a different developer interacting with our contract and since the contract is already deployed, they are likely to access it by address. Be sure to replace my deployed contract address with yours in the code below:

---
network:testnet
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
```

---

---
network:mainnet
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
```

---

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "getCounter" from the list of available scripts.

```console
npx blueprint run
```

Make a note of the current counter value. After we send the increment message in the next step we would like to confirm that this value indeed increases by 1.

Another interesting thing to remember is that getters are only accessible off-chain, for example from a JavaScript client making a call through an RPC service provider. In particular, this means that contracts cannot call getters on other contracts.

## Step 10: Send a transaction to the deployed contract

Unlike getters that are read-only, messages can write and change contract state in storage. In our contract implementation we handled messages in `recv_internal()` and assigned op #1 = *increment*. Sending messages costs gas and requires payment in TON coin. The reason is that this operation is not read-only, so it requires waiting for consensus by the validators and is stored as a transaction in a block on-chain for all eternity. We will send less TON coin this time since this action is much cheaper than the deployment.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

// }
```

As you recall, the increment message is an [internal message](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) that is encoded by convention with a 32 bit unsigned int in the beginning to describe the op and a 64 bit unsigned int after to describe the query id. The query id is relevant for messages that expect a response message to be sent back (the request and the response share the same query id).

Notice that methods in the interface class that send messages must start with the word `send`, another prefix requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step10.ts).

### Executing the send

The messages can be sent from any TON wallet, not necessarily the deployer wallet. Create a new script `sendIncrement.ts` in the `scripts` folder and use your wallet to fund the send:

---
network:testnet
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

---
network:mainnet
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "sendIncrement" from the list of available scripts.

```console
npx blueprint run
```

Notice that the message will take a few seconds to be processed by validators and will only change contract state after it has been processed. The normal wait time is a block or two, since validators need to produce a new block that contains our sent transaction. The op that was sent above is #1 = *increment*, which means that after processing, the counter value will increase by 1. Verify this by re-running the script from step 9 to print the new counter value.

Messages can be sent to our contract by other contracts. This means a different contract can increment our counter. This allows the TON ecosystem to create composable apps and protocols that build on top of each other and interact in unforeseen ways.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQA4RIS6uxt1GZkTTr19Wy423NZtcG0pRy29lg55X-qYq-Tf">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/2-smart/video.mp4" type="video/mp4">
</video>


Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACACZ_fWVyQMr&amount=50000000">here</a>:
<img src="https://i.imgur.com/GEuOQjr.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/02-contract/test).

In this tutorial we handled the build and deploy processes manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have these processes managed automatically by an awesome dev tool called [Blueprint](https://github.com/ton-community/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: 02-contract/options.json
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/options.json
================================================
{
  "network": {
    "name": "Network",
    "order": 1,
    "default": "testnet",
    "options": {
      "testnet": {
        "name": "Testnet",
        "order": 1,
        "url": "https://ton.org/docs/develop/smart-contracts/environment/testnet",
        "pros": "free to use",
        "cons": "less reliable, requires special wallets"
      },
      "mainnet": {
        "name": "Mainnet",
        "url": "https://tonmon.xyz/?orgId=1&refresh=5m",
        "order": 2,
        "pros": "very reliable, fast, works with all wallets",
        "cons": "not free to use (but very cheap)"
      }
    }
  },
  "library": {
    "name": "Library",
    "order": 2,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      }
    }
  }
}


================================================
FILE: 02-contract/test/README.md
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/README.md
================================================
# Automated test for this tutorial

This directory helps us make sure that this tutorial is always working and none of the libraries it depends on has introduced breaking changes. The directory contains a simple automated test that performs all the steps and makes sure they work as expected.

If one of the steps isn't working for you, run the test and see if it passes on your machine. If it does, see where the test code is different from your code. If it doesn't, please open an issue and let us know so we can fix it asap.

The test runs weekly on CI, but you can run it manually in terminal:

```
./index.sh
```

Before running the test, create the file `.env` in the repo root with this content:
```
MNEMONIC="unfold sugar water ..."
```

This should be the 24 word mnemonic for a deployed testnet v4 wallet that contains at least 1 TON.


================================================
FILE: 02-contract/test/counter.fc
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc
================================================
#include "imports/stdlib.fc";

;; =============== storage =============================

(int) load_data() inline {
  var ds = get_data().begin_parse();
  return (ds~load_uint(64));
}

() save_data(int counter) impure inline {
  set_data(begin_cell()
    .store_uint(counter, 64)
    .end_cell());
}

;; =============== messages =============================

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
  if (in_msg_body.slice_empty?()) {
    return ();
  }
  int op = in_msg_body~load_uint(32);
  var (counter) = load_data();
  if (op == 1) {
    save_data(counter + 1);
  }
}

;; =============== getters =============================

int counter() method_id {
  var (counter) = load_data();
  return counter;
}



================================================
FILE: 02-contract/test/counter.step10.ts
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step10.ts
================================================
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }
  
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }
  
  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }
}


================================================
FILE: 02-contract/test/counter.step7.ts
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step7.ts
================================================
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }
  
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  } 
}


================================================
FILE: 02-contract/test/counter.step9.ts
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step9.ts
================================================
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }
  
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }
  
  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }
}


================================================
FILE: 02-contract/test/deploy.step8.ts
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/deploy.step8.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import * as fs from "fs";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "./counter.step7"; // this is the interface class from step 7
import { retry } from "../../helpers/retry"

export async function run() {
  // initialize ton rpc client on testnet
  const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: "f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460" });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  // const mnemonic = process.env.MNEMONIC; // could be used mnemonic from .env file instead
  const mnemonic =
    'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    //console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    await retry(async () => { currentSeqno = await walletContract.getSeqno(); }, {retries: 10, delay: 1000});
  }
  console.log("deploy transaction confirmed!");
}

run()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



================================================
FILE: 02-contract/test/getCounter.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/getCounter.expected.txt
================================================
value: more than 1T



================================================
FILE: 02-contract/test/getCounter.ts
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/getCounter.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { TonClient, Address } from "@ton/ton";
import Counter from "./counter.step9"; // this is the interface class we just implemented
import { retry } from "../../helpers/retry"

export async function run() {
  // initialize ton rpc client on testnet
  const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: "f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460" });
  
  // open Counter instance by address
  const counterAddress = Address.parse(process.env.COUNTER_ADDRESS!.trim());
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  await sleep(1500);
  var counterValue:bigint = 0n; 
  await retry(async () => { counterValue = await counterContract.getCounter(); }, {retries: 10, delay: 1000});

  //console.log("value:", counterValue.toString());
  console.log("value:", counterValue >= 1000000000000n ? "more than 1T" : "less than 1T");
}

run()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


================================================
FILE: 02-contract/test/imports/stdlib.fc
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
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
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

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
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

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
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

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
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

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
builder store_coins(builder b, int x) asm "STGRAMS";

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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

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
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: 02-contract/test/index.sh
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/index.sh
================================================
set -ev
npm init --yes
npm install dotenv
npm install typescript
npx tsc --init -t es2020
npm install ts-node
npm install @ton-community/func-js
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
npx func-js ./imports/stdlib.fc counter.fc --boc counter.cell
npx ts-node deploy.step8.ts > deploy.step8.output.txt
COUNTER_ADDRESS=`cut -d : -s  -f 2 < deploy.step8.output.txt` npx ts-node getCounter.ts > getCounter.output.txt
diff getCounter.output.txt getCounter.expected.txt
COUNTER_ADDRESS=`cut -d : -s  -f 2 < deploy.step8.output.txt` npx ts-node sendIncrement.ts > sendIncrement.output.txt
diff sendIncrement.output.txt sendIncrement.expected.txt



================================================
FILE: 02-contract/test/sendIncrement.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/sendIncrement.expected.txt
================================================
transaction confirmed!



================================================
FILE: 02-contract/test/sendIncrement.ts
URL: https://github.com/ton-community/tutorials/blob/main/02-contract/test/sendIncrement.ts
================================================
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "./counter.step10"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: "f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460" });

  // open wallet v4 (notice the correct wallet version here)
  // const mnemonic = process.env.MNEMONIC; // could be used mnemonic from .env file instead
  const mnemonic =
  'table jungle security cargo adjust barrel dance net permit pig soap simple rabbit upgrade unique update firm between deer minor ship thought ride physical';
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse(process.env.COUNTER_ADDRESS!.trim());
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    //console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

run()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



================================================
FILE: 03-client/author.json
URL: https://github.com/ton-community/tutorials/blob/main/03-client/author.json
================================================
{
  "name": "Shahar Yakir",
  "image": "shaharyakir.jpg",
  "telegram": "https://t.me/mrbonezy",
  "twitter": "https://twitter.com/ShaharYakir"
}


================================================
FILE: 03-client/index.md
URL: https://github.com/ton-community/tutorials/blob/main/03-client/index.md
================================================

# TON Hello World part 3: Step by step guide for building your first web client

In the previous tutorial we deployed a Counter smart contract to TON Blockchain (either testnet or mainnet). This contract acts as the *backend server* of our application. In this tutorial, we will implement the *frontend* or *client* and allow end-users to access it from a web browser.

We will also recall that the appilcation that we're building is *decentralized*. Decentralized apps (dapps) have special [properties](https://defi.org/ton/#app-safety-guidelines). For example, their frontend must only run client-side. This means that we're not supposed to rely on a backend server for serving our frontend. If we had such a server, by definition it would be centralized (our end-users will not have equal access to it), and thus make our entire app centralized as well.

## Step 1: Define usage patterns

TON Blockchain is inspired by and complementary to [Telegram](https://telegram.org/) messenger. It aims for mass adoption by the next billion users. Since Telegram messenger is a mobile-first app, it makes sense that we design our dapp to be mobile-first as well.

The first usage pattern of our dapp would be through a regular web browser. Our frontend would be hosted on some domain using a service like [GitHub Pages](https://pages.github.com/). End-users would input the dapp URL in their favorite web browser and access our dapp using HTML and JavaScript. This is quite standard.

The second usage pattern is a bit more special. Since TON Blockchain complements the Telegram messenger, we will also want to embed our dapp right into the Telegram app itself. Telegram provides special API for building [Telegam Web Apps](https://core.telegram.org/bots/webapps) (TWAs). These tiny apps closely resemble websites and also rely on HTML and JavaScript. They normally run within the context of a Telegram bot and provide a sleek user experience without ever leaving the host Telegram app.

<video src="https://ton-community.github.io/tutorials/assets/twa.mp4" loop muted autoplay playsinline width=300></video><br>

During the course of this tutorial we will create a single codebase that will accomodate both usage patterns.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

Since our frontend will run inside a browser, it will be implemented in JavaScript. The most convenient runtime for developing JavaScript projects is Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

The second tool we need is an initialized TON wallet like [Tonkeeper](https://tonkeeper.com). If you don't have a wallet, please take a look at tutorial 1. The wallet will communicate with our dapp via a protocol called [TON Connect 2](https://github.com/ton-connect). If you choose a different wallet than Tonkeeper, please verify it supports this version of TON Connect. Don't forget to make sure your wallet is connected to the correct network - mainnet or testnet.

## Step 3: Set up the project

We will build our frontend with [React](https://reactjs.org/). To create our project we will rely on [Vite](https://vitejs.dev/) and its React template. Choose a name for your project, for example `my-twa`, then open terminal and run the following:

```console
npm create vite@latest my-twa -- --template react-ts
cd my-twa
npm install
```

We will need to install a few more packages that will allow us to interact with TON Blockchain. We've seen these packages in action in the previous tutorial. Run the following in terminal:

```console
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
```

Last but not least, we will need to overcome [@ton/ton](https://www.npmjs.com/package/@ton/ton) library's reliance on Nodejs `Buffer` that isn't available in the browser. We can do that by installing a polyfill. Run the following in terminal:

```console
npm install vite-plugin-node-polyfills
```

Now modify the file `vite.config.ts` so it looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
});
```

To see your empty app template, run in terminal:

```console
npm run dev
```

Then open a web browser and direct it the URL shown on-screen (like `http://localhost:5173/`).

## Step 4: Set up TON Connect

[TON Connect](https://github.com/ton-connect) is the protocol by which our app will communicate with the end-user's wallet. The TON Connect React library will provide us with some useful services like showing the end-user a list of TON Connect 2 supported wallets, querying the user's wallet for its public address and sending a transaction through the wallet.

Install the library by running in terminal:

```console
npm install @tonconnect/ui-react
```

When our app connects to the user's wallet, it will identify itself using a [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) file. The wallet will ask for the user's permission to connect to the app and display the information from the manifest. Since the manifest needs to be publicly available on the Internet, we're going to use an example one that I've deployed in advance during development. Later, when we deploy our website, we will replace the example manifest with your real one.

Modify the file `src/main.tsx` to use the TON Connect provider:

```tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
```

## Step 5: Add a Connect button to the app

The first action we're going to offer the user is to *Connect* their wallet to the app. By connecting, the user agrees to share their public wallet address with the app. This isn't very dangerous since the entire transaction history of the wallet and its balance are publicly available on-chain anyways.

Edit the file `src/App.tsx` and replace its contents with the following:

```tsx
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App
```

The only thing our new app UI will have is the Connect button. To run the app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. I'm assuming you're using the web browser on your desktop (where you're developing) and your Tonkeeper wallet is installed on your mobile device. Click "Connect Wallet" on the desktop and choose "Tonkeeper" (or any other supporting wallet you're using).

TON Connect supports both mobile-mobile user flows and desktop-mobile user flows. Since development is a desktop-mobile flow, TON Connect will rely on scanning QR codes in order to communicate with the wallet running on your mobile device. Open the Tonkeeper mobile app, tap the QR button on the top right and scan the code from your desktop screen.

If everything is wired properly, you should see a confirmation dialong in the wallet mobile app. If you approve the connection, you will see your address in the web app UI!

## Step 6: Read the counter value from the chain

It's time to interact with our Counter contract and show the current counter value. To do that, we will need the TypeScript interface class that we created in tutorial 2. This class is useful because it defines all possible interactions with the contract in a manner that abstracts implementation and encoding details. This is particularly useful when you have one developer in your team that writes the contract and a different developer that builds the frontend.

Copy `counter.ts` from tutorial 2 to `src/contracts/counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/src/contracts/counter.ts)).

The next thing we'll do is implement a general purpose React [hook](https://reactjs.org/docs/hooks-intro.html) that will assist us in initializing async objects. Create the file `src/hooks/useAsyncInitialize.ts` with the following content:

```ts
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
```

Next, we're going to create another React hook that will rely on `useAsyncInitialize` and will initialize an RPC client in our app. An RPC service provider similar to [Infura](https://infura.io) on Ethereum will allow us to query data from the chain. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Create the file `src/hooks/useTonClient.ts` with the following content:

---
network:testnet
---
```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
  );
}
```

---

---
network:mainnet
---
```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint(),
      })
  );
}
```

---

Our final hook will open the Counter contract instance on-chain by address and allow the app to access it. When our frontend developer starts working on the client, the contract should already be deployed. This means all they need to access it is the deployment address. We've done the deployment in tutorial 2 step 8. The address we got was `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb` but yours should be different.

Create the file `src/hooks/useCounterContract.ts` with the following content. Be sure to replace our deployed contract address with yours in the code below:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
```

We're almost done. Let's add some simple UI to show this information on the main app screen. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App
```

To rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see both the counter address and the counter value taken from the chain on the main screen. As you recall, we initialized the counter value to a very large value (number of milliseconds since the epoch, something like 1674271323207). Don't worry about styling, we will handle this later.

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 7: Increment the counter on-chain

The last interaction was read-only, let's change the contract state by sending a transaction. The main action our counter contract supports is *increment*. Let's add a button to the main screen that sends this transaction. As you recall, sending a transaction on-chain costs gas, so we would expect the wallet to approve this action with the user and show how much TON coin will be spent.

Before starting, we're going to add another hook that will generate a `sender` object from the TON Connect interface. This sender represents the connected wallet and will allow us to send transactions on their behalf. While we're at it, we'll also expose the wallet connection state so we can alter the UI accordingly.

Create the file `src/hooks/useTonConnect.ts` with the following content:

```ts
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}
```

The next thing we're going to do is improve our existing `useCounterContract` hook and add two small features. The first is automatic polling of the counter value every 5 seconds. This will come in handy to show the user that the value indeed changed. The second is exposing the `sendIncrement` of our interface class and wiring it to the `sender`.

Open the file `src/hooks/useCounterContract.ts` and replace its contents with:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
```

We're almost done. Let's add simple UI to allow the user to trigger the increment. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App
```

Time to rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see a new "Increment" link on the bottom of the screen. I'm assuming that you're still on desktop, make a note of the counter value and click the link.

Since your mobile Tonkeeper wallet is connected, this action should reach the Tonkeeper mobile app and cause it to display a confirmation dialog. Notice that this dialog shows the gas cost of the transaction. Approve the transaction on the mobile app. Since the app and wallet are connected, your approval should reach the app and cause it to display an indication that the transaction was sent. As you recall, new transactions must wait until they're included in a block, so this should take 5-10 seconds.

If everything is working, the counter value on screen should refresh automatically and you should see a value that is higher by one.

## Step 8: Style the app

Functionally our app is working, but we can definitely improve what it looks like. Giving a polished user experience is particularly important on TON Blockchain. We are aiming to reach mass adoption and the next billion users. We won't succeed unless our apps look as polished as the ones these users are already using.

Replace `src/index.css` with the following content:

```css
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.Disabled {
  filter: brightness(50%);
  cursor: initial;
}

.Button.Active:hover {
  filter: brightness(105%);
}

.Hint {
  color: var(--tg-theme-hint-color);
}

.Card {
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #131415;
    --tg-theme-text-color: #fff;
    --tg-theme-button-color: #32a6fb;
    --tg-theme-button-text-color: #fff;
  }

  .Card {
    background-color: var(--tg-theme-bg-color);
    filter: brightness(165%);
  }

  .CounterValue {
    border-radius: 16px;
    color: white;
    padding: 10px;
  }
}
```

As usual, to rebuild the web app, run in terminal:

```console
npm run dev
```

And refresh the web browser viewing the URL shown on-screen. Our app should look pretty now.

Up until now we used our app in a desktop-mobile flow due to the development cycle. It would be nice to try our app in a mobile-mobile flow. This means we need to open the app's web page from a mobile device. This will be much easier to do after our web app is published to the Internet.

## Step 9: Publish web app to GitHub Pages

I believe that the best place to publish dapps is [GitHub Pages](https://pages.github.com/) - not just for development but also for production. GitHub Pages is a free service for open source projects that allows them to publish static websites (HTML/CSS/JS) directly from a GitHub repo. Since all dapps should always be [open source](https://defi.org/ton/#app-safety-guidelines), all dapps qualify. GitHub Pages also supports [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), so the end result will be identical to any other production publishing service.

Another benefit of GitHub Pages is that it supports static websites only that only run client-side. There's no backend that can run code or server-side rendering. This limitation is actually a feature for dapps, because decentralized apps should never depend on backend servers as those are centralized.

The last important feature of GitHub Pages that makes it particularly appropriate for dapps is that the reliance on a git repo gives us many community governance features for free. For example, a group of maintainers can share the website deployment privilege easily because all of them have write access to the repo. Outside collaborators from the community can submit PRs and if those are merged, these community members can influence the live dapp. And lastly, if anyone from the community is unhappy with how the dapp is governed, they can always fork the GitHub repo and create their own independent client that can also be published to GitHub Pages in one click.

Let's assume that your GitHub username is `my-gituser` and that you pushed the client project to a GitHub repo named `my-twa` under this user. The GitHub URL of the repo is therefore `https://github.com/my-gituser/my-twa`. You will naturally have to replace the names in this example with the actual names that you're using.

Unless you connect a custom domain to GitHub Pages, the website will be published under the URL:

```console
https://my-gituser.github.io/my-twa
```

Since we're about to go live, it's time to use a proper TON Connect [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). This will allow us to style the initial connection dialog that appears in wallets like Tonkeeper.

Create the file `public/tonconnect-manifest.json` with this content:

```json
{
  "url": "https://my-gituser.github.io/my-twa",
  "name": "My TWA",
  "iconUrl": "https://my-gituser.github.io/my-twa/icon.png"
}
```

Replace the URL field with your webite URL and choose a short name of your dapp. For icon, create a PNG file 180x180 pixels in size and put it under `public/icon.png`.

After we publish the website, this manifest file will be available at:

```console
https://my-gituser.github.io/my-twa/tonconnect-manifest.json
```

Edit `src/main.tsx` and replace the constant `manifestUrl` with the future URL of your manifest:

```ts
const manifestUrl = 'https://my-gituser.github.io/my-twa/tonconnect-manifest.json';
```

Another step to remember is changing the `base` property of the Vite config file. If your future website is not going to be on the root of the domain (like you normally have with a custom domain), you must set `base` to the root directory of the website under the domain. In the example above, since the repo name is `my-twa` and the URL is `https://my-gituser.github.io/my-twa`, the website is published under the directory `/my-twa/` in the domain.

Let's set this in `vite.config.js`:

```ts
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/my-twa/',
});
```

Build the website for publishing by running in terminal:

```console
npm run build
```

Publishing to GitHub Pages is pretty straightforward. You would normally create a git branch named `gh-pages` in your repo that contains the static website files that were generated in the `dist` directory during the build. Then you would normally open the repo on GitHub's web UI and enable "Pages" under "Settings" (pointing the "Branch" to "gh-pages" after it is pushed).

For the exact steps, you can follow Vite's tutorial for [Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages).

Once the website is published, we can finally access it from mobile. Take your mobile device and open the URL `https://my-gituser.github.io/my-twa` in the mobile browser.

This is a good opportunity to try the mobile-mobile flow. In the mobile browser, tap on the "Connect Wallet" button and choose "Tonkeeper" (or any other supporting wallet you're using). This should switch you to the Tonkeeper mobile app where you can approve the connection. After approval, you should be switched back to the website. Now tap the "Increment" button. This should switch you to the Tonkeeper mobile app where you can approve the transaction. As you can see, in the mobile-mobile flow there are no QR codes involved since the dapp and the wallet run on the same device.

## Step 10: Publish web app as TWA in Telegram

Having our dapp accessible through a web browser is not enough. We want to make the most from the seamless integration into Telegram messenger. To feature our dapp in Telegram, we will also have to publish it as a TWA. Luckily, this is pretty easy to do.

The first step is to add the [TWA SDK](https://github.com/twa-dev) to our project. This will allow us to get theme properties while inside Telegram. Run in terminal:

```console
npm install @twa-dev/sdk
```

Then, edit `src/App.tsx` and add the following import:

```ts
import '@twa-dev/sdk';
```

Now rebuild the website for publishing by running in terminal:

```console
npm run build
```

Publish the updated website like we did in step 9, probably just by pushing it to git to the correct branch.

The final step is to create a new Telegram bot and have it showcase our website when opened. To do that we will interact with another Telegram bot called "botfather". On a device where your Telegram messenger is logged in, open [https://t.me/botfather](https://t.me/botfather) and then switch to the bot inside the Telegram app. Choose "Start".

To create a new bot select "/newbot". Choose a name for the bot and then a username according to the on-screen instructions. Make a note of the username since this is how end-users will access your TWA. Assuming that your bot username is `my_twa_bot`, it will be accessible in the Telegram chat by typing `@my_twa_bot` or through the URL [https://t.me/my_twa_bot](https://t.me/my_twa_bot). You can even purchase a premium Telegram username for your bot on the auction platform [Fragment](https://fragment.com).

Back in botfather, tap the menu button and edit your bots by selecting "/mybots". Select the bot you've just created. Select "Bot Settings" and then select "Menu Button". Now select "Configure menu button" to edit the URL and type your published website URL:

```console
https://my-gituser.github.io/my-twa
```

That's it! The bot should be ready. Start a Telegram chat with your bot via the username. Tap the menu button and voila - your published website will open inside Telegram as a TWA. Congratulations!

<img src="https://i.imgur.com/lVL1Bl0.png" width=300/><br>

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQBCaHNBo6KrAmyq6HdEB-rwxvRufrPTHd3VygbHcx4DisCt">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/3-twa/video.mp4" type="video/mp4">
</video>


Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAD0yCaOQwnT&amount=50000000">here</a>:
<img src="https://i.imgur.com/0UJOtIH.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/03-client/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new client project, you can start from a ready-made template that will save you most of the setup work:<br>[https://github.com/ton-community/twa-template](https://github.com/ton-community/twa-template)

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: 03-client/options.json
URL: https://github.com/ton-community/tutorials/blob/main/03-client/options.json
================================================
{
  "network": {
    "name": "Network",
    "order": 1,
    "default": "testnet",
    "options": {
      "testnet": {
        "name": "Testnet",
        "order": 1,
        "url": "https://ton.org/docs/develop/smart-contracts/environment/testnet",
        "pros": "free to use",
        "cons": "less reliable, requires special wallets"
      },
      "mainnet": {
        "name": "Mainnet",
        "url": "https://tonmon.xyz/?orgId=1&refresh=5m",
        "order": 2,
        "pros": "very reliable, fast, works with all wallets",
        "cons": "not free to use (but very cheap)"
      }
    }
  },
  "library": {
    "name": "Library",
    "order": 2,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      }
    }
  }
}


================================================
FILE: 03-client/test/README.md
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/README.md
================================================
# Automated test for this tutorial

This directory helps us make sure that this tutorial is always working and none of the libraries it depends on has introduced breaking changes. The directory contains a simple automated test that performs all the steps and makes sure they work as expected.

If one of the steps isn't working for you, run the test and see if it passes on your machine. If it does, see where the test code is different from your code. If it doesn't, please open an issue and let us know so we can fix it asap.

The test runs weekly on CI, but you can run it manually in terminal:

```
./index.sh
```

Before running the test, create the file `.env` in the repo root with this content:
```
MNEMONIC="unfold sugar water ..."
```

This should be the 24 word mnemonic for a deployed testnet v4 wallet that contains at least 1 TON.


================================================
FILE: 03-client/test/index.sh
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/index.sh
================================================
set -ev
rm -rf ./temp
npm create --yes vite@5.5.5 temp -- --template react-ts
cd temp
npm install
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
npm install vite-plugin-node-polyfills
cp -f ../vite.config.ts .
npm install @tonconnect/ui-react
cp -f ../src/main.tsx ./src
cp -f ../src/App.step5.tsx ./src/App.tsx
npm run build
mkdir ./src/contracts
cp -f ../src/contracts/counter.ts ./src/contracts
mkdir ./src/hooks
cp -f ../src/hooks/useAsyncInitialize.ts ./src/hooks
cp -f ../src/hooks/useTonClient.ts ./src/hooks
cp -f ../src/hooks/useCounterContract.step6.ts ./src/hooks/useCounterContract.ts
cp -f ../src/App.step6.tsx ./src/App.tsx
npm run build
cp -f ../src/hooks/useTonConnect.ts ./src/hooks
cp -f ../src/hooks/useCounterContract.step7.ts ./src/hooks/useCounterContract.ts
cp -f ../src/App.step7.tsx ./src/App.tsx
cp -f ../src/index.css ./src
cp -f ../public/tonconnect-manifest.json ./public
npm run build
npm install @twa-dev/sdk
cp -f ../src/App.step10.tsx ./src/App.tsx
npm run build


================================================
FILE: 03-client/test/public/tonconnect-manifest.json
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/public/tonconnect-manifest.json
================================================
{
  "url": "",
  "name": "Example",
  "iconUrl": ""
}


================================================
FILE: 03-client/test/src/App.step10.tsx
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/App.step10.tsx
================================================
import '@twa-dev/sdk';
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App



================================================
FILE: 03-client/test/src/App.step5.tsx
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/App.step5.tsx
================================================
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App



================================================
FILE: 03-client/test/src/App.step6.tsx
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/App.step6.tsx
================================================
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App



================================================
FILE: 03-client/test/src/App.step7.tsx
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/App.step7.tsx
================================================
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App



================================================
FILE: 03-client/test/src/contracts/counter.ts
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/contracts/counter.ts
================================================
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }
  
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }
  
  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }
}


================================================
FILE: 03-client/test/src/hooks/useAsyncInitialize.ts
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/hooks/useAsyncInitialize.ts
================================================
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}


================================================
FILE: 03-client/test/src/hooks/useCounterContract.step6.ts
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/hooks/useCounterContract.step6.ts
================================================
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  
  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}



================================================
FILE: 03-client/test/src/hooks/useCounterContract.step7.ts
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/hooks/useCounterContract.step7.ts
================================================
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
  
  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}



================================================
FILE: 03-client/test/src/hooks/useTonClient.ts
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/hooks/useTonClient.ts
================================================
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from '@ton/ton';
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
  );
}


================================================
FILE: 03-client/test/src/hooks/useTonConnect.ts
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/hooks/useTonConnect.ts
================================================
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}



================================================
FILE: 03-client/test/src/index.css
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/index.css
================================================
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.Disabled {
  filter: brightness(50%);
  cursor: initial;
}

.Button.Active:hover {
  filter: brightness(105%);
}

.Hint {
  color: var(--tg-theme-hint-color);
}

.Card {
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #131415;
    --tg-theme-text-color: #fff;
    --tg-theme-button-color: #32a6fb;
    --tg-theme-button-text-color: #fff;
  }

  .Card {
    background-color: var(--tg-theme-bg-color);
    filter: brightness(165%);
  }

  .CounterValue {
    border-radius: 16px;
    color: white;
    padding: 10px;
  }
}


================================================
FILE: 03-client/test/src/main.tsx
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/src/main.tsx
================================================
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)



================================================
FILE: 03-client/test/vite.config.ts
URL: https://github.com/ton-community/tutorials/blob/main/03-client/test/vite.config.ts
================================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/my-twa/',
});


================================================
FILE: 04-testing/author.json
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/author.json
================================================
{
  "name": "Tal Kol",
  "image": "talkol.jpg",
  "telegram": "https://t.me/talkol",
  "twitter": "https://twitter.com/koltal"
}


================================================
FILE: 04-testing/index.md
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/index.md
================================================

# TON Hello World part 4: Step by step guide for testing your first smart contract

Testing is a big part of smart contract development. Smart contracts often deal with money and we don't want any of our users losing money because the smart contract had a bug. This is why it's normally expected from smart contract developers to share an automated test suite next to their FunC implementation. Every user that wants to be convinced that the contract is working as expected is welcome to execute the test suite and see for themselves.

A thorough test suite is also a good signal to your users that you've taken your role as a contract developer seriously. I would personally be very hesitant to deposit a substantial amount of money in any contract that has no tests. Since *code is law*, any bug in the contract code is also part of the agreement, so a user wouldn't really have anyone to blame for money lost, but themselves.

Personally, I don't view testing as an afterthought taking place only when your code is complete. If done correctly, tests can be a powerful aid to the development process itself from the beginning, that will allow you to write better code faster.

## Oh so many ways to test

*Warning - this specific section is a bit more advanced than beginner, feel free to skip it directly to step 1 if you trust my judgement of how to test. If you're interested in an overly detailed overview of what other testing methodologies exist in our ecosystem please read on.*

Because testing is such as big deal in smart contract development, there's a surprising amount of tools and infrastructure in the TON ecosystem devoted to this topic. Before jumping in to the methodology that I believe in, I want to give a quick overview of the plethora of testing tools that are available out there:

1. **Deploying your contract to testnet** - Testnet is a live alternative instance of the entire TON Blockchain where TON coin isn't the real deal and is free to get. This instance is obviously not as secure as mainnet, but offers an interesting staging environment where you can play.

2. **Local blockchain with MyLocalTon** - [MyLocalTon](https://github.com/neodiX42/MyLocalTon) is a Java-based desktop executable that runs a personal local instance of TON Blockchain on your machine that you can deploy contracts to and interact with. Another way to run a local private TON network is using Kubernetes with [ton-k8s](https://github.com/disintar/ton-k8s).

3. **Writing tests in FunC** - [toncli](https://github.com/disintar/toncli) is a command-line tool written in Python that runs on your machine and supports [debug](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md) and [unit tests](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md) for FunC contracts where the tests are also written in FunC ([example](https://github.com/BorysMinaiev/func-contest-1-tests-playground/blob/main/task-1/tests/test.fc)).

4. **Bare-bones TVM with Sandbox** - [Sandbox](https://github.com/ton-org/sandbox) is a bare-bones version of just the [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) running on [WebAssembly](https://webassembly.org/) with a thin JavaScript wrapper that allows test interactions from TypeScript.

5. **Deploying beta contracts to mainnet** - This form of "testing in production" simply deploys alternative beta versions of your contracts to mainnet and uses real (not free) TON coin to play with them in a real environment. If you found a bug, you simply deploy new fixed beta versions and waste a little more money.

So which method should you choose? You definitely don't need all of them.

My team started building smart contracts on Ethereum in 2017, we've witnessed the evolution of the art of smart contract development almost from its infancy. While I'm well aware of [fundamental differences](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) between TON and the EVM, testing between the two platforms is not fundamentally different. All of the above approaches appeared on Ethereum at one point or another. And all of them practically disappeared - except two - the last two.

1. Testnets were once popular on Ethereum (funny names like Ropsten, Rinkeby and Goerli) but turned out to be a bad tradeoff between convenience and realism - they're slow and often more difficult to work with than mainnet (some wallets aren't compatible) and useless for integration tests with other contracts (eg. your contract interacts with somebody else's token) because nobody bothers to maintain up-to-date versions of their projects on testnet.

2. Local desktop versions of the entire blockchain, like [Ganache UI](https://trufflesuite.com/ganache/), proved to be too slow for unit tests and ineffective for integration tests (for the same reason as testnets). They also don't play nicely with [CI](https://docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration). People often confuse [ganache-cli](https://github.com/trufflesuite/ganache) with a local blockchain, but it is actually a bare-bones EVM implemented in JavaScript.

3. Testing Solidity with Solidity proved to be too cumbersome as smart contract languages are inherently limited and restrictive by design and efficient testing seems to flourish on freeform languages like JavaScript. Trying to code a complex expectation in Solidity or simulate a difficult scenario is just too painful.

4. Bare-bones EVM turned out to be the holy grail. Most of the testing on Ethereum today takes place on [Hardhat](https://hardhat.org/) and Hardhat is a thin wrapper around [EthereumJs](https://github.com/ethereumjs/ethereumjs-monorepo) which is an EVM implementation in JavaScript. This approach turned out to be the most convenient (ultra-fast CI-friendly unit tests) as well as realistic where it matters (live lazy-loaded [forks](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks) of mainnets for integration tests).

5. Testing in production is useful for the last mile. Ethereum has less than [5 million](https://www.fool.com/the-ascent/cryptocurrency/articles/more-people-own-ethereum-than-ever-before-heres-why/) active users yet over [40 million](https://cryptopotato.com/over-44-million-contracts-deployed-to-ethereum-since-genesis-research/) deployed contracts. The vast majority of all deployed contracts on Ethereum mainnet are beta versions that developers deployed for a few tests and then abandoned. Don't feel bad about polluting mainnet with garbage, nobody cares.

After carefully considering all available approaches, I hope I convinced you why we're going to spend 90% of our time testing with approach (4) and 10% of our time testing with approach (5). We're going to conveniently forget about the other approaches and avoid using them at all.

## Step 1: Set up the project

Since we're using TypeScript for tests, make sure [Nodejs](https://nodejs.org/) is installed by running `node -v` in terminal and the version is at least v18. If you have an old version, you can upgrade with [nvm](https://github.com/nvm-sh/nvm).

Let's create a new directory for our project. Open terminal in the project directory and run the following:

```console
npm install typescript jest @types/jest ts-jest
```

This will install TypeScript and the popular [jest](https://jestjs.io/) test runner. To configure TypeScript to run correctly, we need to create the file `tsconfig.json` and put it in the project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

And to configure jest to run correctly, we need to create the file `jest.config.js` and put it in the project root:

```js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};
```

And finally, run in terminal:

```console
npm install @ton/core @ton/sandbox @ton/test-utils
```

This will install [Sandbox](https://github.com/ton-org/sandbox) and its dependencies. Sandbox is our magical library that will emulate TON Blockchain locally by running a bare-bones version of the TVM in process. This will guarantee that our tests will be blazingly fast and completely isolated.

## Step 2: Load our contract in a test

Quick reminder, in tutorial 2, we compiled our Counter smart contract in step 6 and generated the file `counter.cell` which contains the TVM bytecode for our contract (code cell). In step 7, before deploying the contract, we initialized its persistent storage (data cell). Then, we created the TypeScript interface class `counter.ts` that combines the two to deploy our contract.

Dig into your completed tutorial 2 and copy both `counter.cell` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.cell)) and `counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.ts)) to the project root.

We're going to deploy the Counter contract in our test using the interface class in an almost identical way to how we deployed it to the actual chain in tutorial 2:

```ts
// prepare Counter's initial code and data cells for deployment
const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
const counter = Counter.createForDeploy(counterCode, initialCounterValue);
```

Notice that this time we can initialize the counter value to a simple number like 17 because we're no longer afraid of collisions. All users of this tutorial can end up with the same contract address and that's ok since Sandbox creates an isolated private blockchain.

Before we start writing tests, let's create our test skeleton. In the skeleton, before each test starts, we'll initialize a fresh instance of the entire blockchain. This instance will require a wallet with enough TON for all our gas needs (we call this a "treasury") and a deployed version of the Counter.

Create the file `step2.spec.ts` with the following content:

```ts
import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;
  
  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should run the first test", async () => {
    // currently empty, will place a test body here soon
  });
});
```

This code is remarkably similar to the deploy code we had in tutorial 2. This is the benefit of using the TypeScript interface class. No matter where we use our contract, we always access it in the same familiar way.

The only strange part in this snippet is the treasury. What is it exactly? A treasury is simply a wallet contract, very similar to the v4 wallet you used with [Tonkeeper](https://tonkeeper.com) in previous tutorials. What's useful with a treasury is that it's already pre initialized with a big TON coin balance. There's no need to fund it from a faucet.

To execute the test, run in terminal:

```console
npx jest step2
```

Our test is empty, so it should naturally pass. Notice that if we had 3 different tests (3 different `it()` clauses), the blockchain would be initialized from scratch 3 times and the Counter would be deployed 3 times. This is excellent because different tests are completely isolated from each other. If one test fails, it will not influence the others.

## Step 3: Test a getter

Now that the boilerplate is behind us, we can finally focus on writing the actual test logic. Ideally, we want to test through every execution path of our contract to make sure it's working. Let's start with something simple, our getter. Quick reminder, in tutorial 2 we implemented a getter in FunC that looked like this:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

As you recall, our test skeleton initializes our contract with a data cell via `Counter.createForDeploy()`. If the initial counter value is 17, we expect the getter to return 17 after initialization.

Copy the skeleton to a new file named `step3.spec.ts` and add the following test to it:

```ts
  it("should get counter value", async () => {
    const value = await counterContract.getCounter();
    expect(value).toEqual(17n);
  });
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step3.spec.ts).

There's something interesting to notice in the assertion at the end of the test - the `expect()`. When we compare the counter value we don't compare it to the number `17`, but to `17n`. What is this notation? The `n` signifies that the number is a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). The FunC type returned from our getter is `int`. This TVM number type is [257 bit long](https://ton.org/docs/develop/func/types?id=atomic-types) (256 signed) so it supports huge virtually unbounded numbers. The native JavaScript `number` type is limited to [64 bit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) so it cannot necessarily hold the result. We use JavaScript big numbers to work around this limitation.

To execute the test, run in terminal:

```console
npx jest step3
```

The test should pass. Try to change the expectation to verify that the returning value is `18n` and see how the test fails.

## Step 4: Test a message

While getters are read-only operations that don't change contract state, messages are used to modify state through user transactions. Reminder, we've implemented the following message handler in tutorial 2:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Let's write a test that sends a message with op #1 = *increment*. Our interface class already knows how to encode the message.

Copy the last test file to a new file named `step4.spec.ts` and add the following test to it:

```ts
  it("should increment the counter value", async () =>  {
    await counterContract.sendIncrement(wallet1.getSender());
    const counterValue = await counterContract.getCounter();
    expect(counterValue).toEqual(18n);
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step4.spec.ts).

Notice that we already know from the previous test that the counter is indeed initialized to 17, so if our message was successful, we can use the getter to get the counter value and make sure it has been incremented to 18.

To execute the test, run in terminal:

```console
npx jest step4
```

Like before, the test should pass.

## Step 5: Debug by dumping variables

Testing is fun as long as everything works as expected. But what happens when something doesn't work and you're not sure where the problem is? The most convenient method I found to debug your FunC code is to add debug prints in strategic places. This is very similar to debugging JavaScript by using `console.log(variable)` to [print](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) the value of variables.

The TVM has a special instruction for [dumping variables](https://ton.org/docs/develop/func/builtins?id=dump-variable) in debug. Run `~dump(variable_name);` in your FunC code to use it. You can also print constants by using `~dump(12345);` which can be helpful to show that the VM indeed reached a certain line.

Another useful TVM instruction can dump strings in debug. Run `~strdump(string_value);` in your FunC code to use it.

Let's try both. Let's say we're trying to send some TON coin to our contract on a message. We can do this by issuing a simple transfer from our wallet to our contract address. In FunC, this value should arrive under the `msg_value` argument of `recv_internal()`. Let's print this incoming value in FunC to make sure that it indeed works as expected. I added the debug print as the first line of our `recv_internal()` message handler from before:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
  ~dump(msg_value);                         ;; first debug print
  if (in_msg_body.slice_empty?()) { 
    return (); 
  }
  int op = in_msg_body~load_uint(32);
  var (counter) = load_data();
  if (op == 1) {
    ~strdump("increment received");         ;; second debug print
    save_data(counter + 1);
  }
}
```

The second debug print I added is whenever an op #1 = *increment* message received. This time I print a constant string instead of a variable.

Since we changed our FunC code, we'll have to rebuild the contract to see the effect and generate a new `counter.cell`. I've done this for your convenience and renamed the file to `counter.debug.cell`, it is available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.debug.cell).

Copy the original test skeleton to a new file named `step5.spec.ts` and add the following tests:

```ts
  it("should send ton coin to the contract", async () => {
    console.log("sending 7.123 TON");
    await wallet1.send({
      to: counterContract.address,
      value: toNano("7.123")
    });
  });

  it("should increment the counter value", async () =>  {
    console.log("sending increment message");
    await counterContract.sendIncrement(wallet1.getSender());
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step5.spec.ts).

Run the test and take a close look at the console output in terminal:

```console
npx jest step5
```

The console output should include something like this:

```console
  console.log
    sending 7.123 TON

  console.log
    #DEBUG#: s0 = 7123000000

  console.log
    sending increment message

  console.log
    #DEBUG#: s0 = 2000000

  console.log
    #DEBUG#: increment received
```

We can see that the debug messages are printed when the test is running. When we send some TON coin explicitly to the contract (7.123 coins), we can see that the first debug print indeed shows the expected value of `msg_value`. Since the TVM doesn't support floating points, the number is represented internally as a large integer (with 9 decimals, meaning multiplied by 10^9). On the second test, when we send the increment op, we can see both debug prints showing. This is because this message also includes a small amount of coins for gas.

If you would like to see even more verbose log output from running your contracts, you can [increase the verbosity](https://github.com/ton-org/sandbox#viewing-logs) of the `blockchain` object after creating it in beforeEach:

```ts
blockchain.verbosity = {
  print: true,
  blockchainLogs: true,
  vmLogs: "vm_logs_full",
  debugLogs: true,
}
```

## Step 6: Test in production (without testnet)

Steps 2-5 above are all part of approach (4) - where I promised to spend 90% of our testing time. These tests are very fast to run (there's nothing faster than an in-process instance of a bare-bones TVM) and are very CI-friendly. They are also free and don't require you to spend any TON coin. These tests should give you the majority of confidence that your code is actually working.

What about the remaining 10%? All of our tests so far worked inside a lab. Before we're launching our contract, we should run some tests in the wild! This is what approach (5) is all about.

From a technical perspective, this is actually the simplest approach of all. You don't need to do anything special. Get some TON coin and deploy your contract to mainnet! The process was covered in detail in tutorial 2. Then, interact with your contract manually just like your users will. This will normally depend on the dapp client we wrote in tutorial 3.

If this step is so easy, why am I devoting so much time to discuss it? Because, from my experience, most dapp developers are reluctant to do so. Instead of testing on mainnet, they prefer to work on testnet. In my eyes, this is a waste of time. Let me attempt to refute any reasons to use testnet one last time:

* *"testnet is as easy to work with as mainnet"* - False. Testnet is less reliable and isn't held to the same production standard as mainnet. It also requires special wallets and special explorers. This mess is going to cost you time to sort out. I've seen too many developers deploying their contract to testnet and then trying to inspect it with a mainnet explorer without understanding why they don't see anything deployed.

* *"mainnet is more expensive since it costs real TON coin to use"* - False. Deploying your contract to mainnet costs around 10 cents. Your time costs more. Let's say an hour of your time is only worth the minimum wage in the US (a little over $7), if working on mainnet saves you an hour, you can deploy your contract 70 times without feeling guilty that you're wasting money.

* *"testnet is a good simulation of mainnet"* - False. Nobody cares deeply about testnet since it's not a production network. Are you certain that validators on testnet are running the latest node versions? Are all config parameters like gas costs identical to mainnet? Are all contracts by other teams that you may be relying on deployed to testnet?

* *"I don't want to pollute mainnet with abandoned test contracts"* - Don't worry about it. Users won't care since the chance of them reaching your unadvertised contract address by accident is zero. Validators won't care since you paid them for this service, they enjoy the traction. Also, TON has an auto-cleanup mechanism baked in, your contract will eventually run out of gas for rent and will be destroyed automatically.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQDMLnAidBQHajOXI-wKKdyy6NjP8pgBAIGiVmSRZ9mJF1iM">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/4-testing/video.mp4" type="video/mp4">
</video>

Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAAPmEfY662P&amount=50000000">here</a>:
  <img src="https://i.imgur.com/tewJ6Wg.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/04-testing/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have an excellent skeleton created automatically by an awesome dev tool called [Blueprint](https://github.com/ton-org/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: 04-testing/options.json
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/options.json
================================================
{
  "library": {
    "name": "Library",
    "order": 1,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      }
    }
  }
}


================================================
FILE: 04-testing/test/README.md
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/README.md
================================================
# Automated test for this tutorial

This directory helps us make sure that this tutorial is always working and none of the libraries it depends on has introduced breaking changes. The directory contains a simple automated test that performs all the steps and makes sure they work as expected.

If one of the steps isn't working for you, run the test and see if it passes on your machine. If it does, see where the test code is different from your code. If it doesn't, please open an issue and let us know so we can fix it asap.

The test runs weekly on CI, but you can run it manually in terminal:

```
./index.sh
```

Before running the test, create the file `.env` in the repo root with this content:
```
MNEMONIC="unfold sugar water ..."
```

This should be the 24 word mnemonic for a deployed testnet v4 wallet that contains at least 1 TON.


================================================
FILE: 04-testing/test/counter.cell
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/counter.cell
================================================
��r ? � ������b @�l! � �0��0�D��?0�����?��T�0� �41ډ��~a


================================================
FILE: 04-testing/test/counter.debug.cell
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/counter.debug.cell
================================================
��r [ � ������b x�1� 0 � �0��0�D��?0����[�ܙ[Y[��X�Z]�Y �0���?��T�0� �41ډ��~a


================================================
FILE: 04-testing/test/counter.ts
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/counter.ts
================================================
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }
  
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }
  
  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }
}


================================================
FILE: 04-testing/test/index.sh
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/index.sh
================================================
set -ev
npm init --yes
npm install dotenv
npm install typescript jest @types/jest ts-jest
npm install @ton/core @ton/sandbox @ton/test-utils
npx jest step2
npx jest step3
npx jest step4
npx jest step5 | grep "#DEBUG#" > step5.output.txt
diff step5.output.txt step5.expected.txt


================================================
FILE: 04-testing/test/jest.config.js
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/jest.config.js
================================================
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};


================================================
FILE: 04-testing/test/step2.spec.ts
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/step2.spec.ts
================================================
import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;
  
  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should run the first test", async () => {
    // currently empty, will place a test body here soon
  });
});


================================================
FILE: 04-testing/test/step3.spec.ts
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/step3.spec.ts
================================================
import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2
import "@ton/test-utils"; // register matchers

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;
  
  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should get counter value", async () => {
    const value = await counterContract.getCounter();
    expect(value).toEqual(17n);
  });
});


================================================
FILE: 04-testing/test/step4.spec.ts
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/step4.spec.ts
================================================
import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2
import "@ton/test-utils"; // register matchers

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;
  
  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should get counter value", async () => {
    const counterValue = await counterContract.getCounter();
    expect(counterValue).toEqual(17n);
  });

  it("should increment the counter value", async () =>  {
    await counterContract.sendIncrement(wallet1.getSender());
    const counterValue = await counterContract.getCounter();
    expect(counterValue).toEqual(18n);
  })
});


================================================
FILE: 04-testing/test/step5.expected.txt
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/step5.expected.txt
================================================
    #DEBUG#: s0 = 10000000
    #DEBUG#: s0 = 7123000000
    #DEBUG#: s0 = 10000000
    #DEBUG#: s0 = 2000000
    #DEBUG#: increment received



================================================
FILE: 04-testing/test/step5.spec.ts
URL: https://github.com/ton-community/tutorials/blob/main/04-testing/test/step5.spec.ts
================================================
import * as fs from "fs";
import { Cell, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2
import "@ton/test-utils"; // register matchers

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;
  
  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.debug.cell"))[0]; // version with ~dump instruction
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should send ton coin to the contract", async () => {
    console.log("sending 7.123 TON");
    await wallet1.send({
      to: counterContract.address,
      value: toNano("7.123")
    });
  });

  it("should increment the counter value", async () =>  {
    console.log("sending increment message");
    await counterContract.sendIncrement(wallet1.getSender());
  })
});


================================================
FILE: HELP.md
URL: https://github.com/ton-community/tutorials/blob/main/HELP.md
================================================
# Something not working with this tutorial?

We're sorry you're having a hard time! Let's fix this!

If something in the tutorial isn't working, these are the possible causes:

1. **You have a typo or a mistake somewhere in your code and you didn't follow the tutorial closely enough.**

    The bottom of every tutorial contains a link to the full code of all steps (in the *Conclusion* section). The code is written as an automated test that we run a few times a week. Compare your code to the test code and try to find where you did something different.

    A common mistake is trying to send transactions from a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the first tutorial, check your wallet address in an explorer and if your wallet has a different version from "wallet v4 r2" you will need to modify the example code. Let's say for example that your version is "wallet v3 r2" and you're using [@ton/ton](https://www.npmjs.com/package/@ton/ton) library, then replace `WalletContractV4` with `WalletContractV3R2`.

2. **One of the libraries we depend on had a breaking change and the tutorial is out of date.**

    We try to make sure this doesn't happen by running the automated tests once a week. If we see that the tests stop passing, we know we need to fix something. If the automated test isn't passing, there's good chance this is what happened. See if any of the libraries changed recently and install the previous version.

3. **The tutorial has a mistake in it or is written in a confusing way.**

    This can happen, we are only human. Try to investigate the problem and suggest a change in the tutorial to make it more clear for the next person. The source code of the tutorials is available [here](https://github.com/ton-community/tutorials/) in the directories `01-wallet`, `02-contract`, etc. You can submit your proposal for an edit by submitting a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests). Start by creating a [fork](https://github.com/ton-community/tutorials/fork) and then use GitHub's web UI to [open a new PR](https://github.com/ton-community/tutorials/pulls).

4. **You are experiencing connectivity issues.**

    If you are experiencing connectivity issues while following the tutorials with errors such as:

    ```bash
    Error: exception in fetch(https://ton.access.orbs.network/mngr/nodes?npm_version=2.3.3): FetchError: request to https://ton.access.orbs.network/mngr/nodes?npm_version=2.3.3 failed, reason: read ECONNRESET
        at Nodes.
    ```

    then we need to determine if you have access to the TON Access network.

    Try the following command in your terminal:

    ```bash
    curl https://ton.access.orbs.network
    ```

    If you receive a HTML response, then you are able to access the TON Access network! This means the issue is not a connectivity one.

    Otherwise, if you received an error message from the `curl` command like this:

    ```bash
    curl: (35) Recv failure: Connection was reset
    ```

    then your connection to the TON Access network is being blocked.

    This could mean a number of things. You may be living in a sanctioned country and your government or ISP is blocking access to the TON Access network. It could also be the network you are on could be restricting access.

    To get around this issue you can use a VPN and route your traffic through a different network.

    If you are already using a VPN and still experiencing issues, then your VPN software may not be routing all network traffic from your terminal or command line editor.

    We would recommend using the following VPN software:

    - NordVPN: <https://nordvpn.com/>
    - ExpressVPN: <https://www.expressvpn.com/>
    - Nekoray: <https://github.com/MatsuriDayo/nekoray>
    - Windscribe: <https://windscribe.com/>


If you're really stuck, contact us in the following community channels:

* Submit a question in https://answers.ton.org (a StackOverflow clone dedicated to TON)
* Open an issue on the tutorials repo https://github.com/ton-community/tutorials/issues
* Come chat with us on Telegram in https://t.me/tondev_eng


================================================
FILE: LICENSE
URL: https://github.com/ton-community/tutorials/blob/main/LICENSE
================================================
MIT License

Copyright (c) 2023 TON Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



================================================
FILE: README.md
URL: https://github.com/ton-community/tutorials/blob/main/README.md
================================================
# TON Tutorials

### [01. Working with your first wallet](https://helloworld.tonstudio.io/01-wallet)
>
> Create a wallet, fund it, initialize it, see in explorer, read/write to it with code

[![01-wallet-npmton](https://github.com/ton-community/tutorials/actions/workflows/01-wallet-npmton.yml/badge.svg)](https://github.com/ton-community/tutorials/actions/workflows/01-wallet-npmton.yml) [![01-wallet-tonweb](https://github.com/ton-community/tutorials/actions/workflows/01-wallet-tonweb.yml/badge.svg)](https://github.com/ton-community/tutorials/actions/workflows/01-wallet-tonweb.yml)

### [02. Writing your first smart contract](https://helloworld.tonstudio.io/02-contract)
>
> Create a simple counter smart contract, build and deploy it, read/write to it with code

[![02-contract](https://github.com/ton-community/tutorials/actions/workflows/02-contract.yml/badge.svg)](https://github.com/ton-community/tutorials/actions/workflows/02-contract.yml)

### [03. Building your first web client](https://helloworld.tonstudio.io//03-client)
>
> Create a simple client (TWA+web) that interacts with the counter smart contract

[![03-client](https://github.com/ton-community/tutorials/actions/workflows/03-client.yml/badge.svg)](https://github.com/ton-community/tutorials/actions/workflows/03-client.yml)

### [04. Testing your first smart contract](https://helloworld.tonstudio.io/04-testing)
>
> Create a test suite for the counter smart contract to make sure it works as expected

[![04-testing](https://github.com/ton-community/tutorials/actions/workflows/04-testing.yml/badge.svg)](https://github.com/ton-community/tutorials/actions/workflows/04-testing.yml)

&nbsp;

## The Tutorial System

### Design goals

- A concise list of tutorials that help new TON developers onboard
- Allow multiple community contributors to help maintain the tutorials
- Support multiple development flavors, tools and styles side by side
- Know when tutorials break (for example due to library changes) and need fixing

### Build the tutorials

- Create the file `.env` in the project root with this content:

  ```bash
  MNEMONIC="unfold sugar water ..."
  ```

  > The official mnemonic appears in Github repo secrets since it's also used in CI. This should be the 24 word mnemonic for a deployed testnet v4 wallet that contains at least 1 TON.
- Run `./build.sh`
- Resulting files will be created in the `docs/` directory, ready for Github Pages

### Notice

> Due to limitations in GitHub Actions, we are unable to use secrets to store a secure mnemonic for the wallet during the testing of pull requests from forked repositories by our contributors. 
> As a result, we are currently using a public wallet with an exposed mnemonic in our test files when running tests in GH Actions.




================================================
FILE: build.sh
URL: https://github.com/ton-community/tutorials/blob/main/build.sh
================================================
npm init --yes
npm install ts-node
npm install typescript
npx tsc --init --target es2020
npm pkg set scripts.watch="sass -w styles.scss docs/assets/styles.css"
npm install ejs @types/ejs
npm install sass
npm install showdown @types/showdown
npx ts-node scripts/build.ts
npm run watch



================================================
FILE: docs/01-wallet/index.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 96.92 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

     TON Hello World part 1: Step by step guide for working with your first TON wallet

[

![](../assets/logo.svg)

Tutorials



](https://helloworld.tonstudio.io/01-wallet/)

### Network

![](../assets/arrow-down.svg)

-   #### Testnet
    
    [docs](https://ton.org/docs/develop/smart-contracts/environment/testnet)
    
    Pros: free to use
    
    Cons: less reliable, requires special wallets
    
-   #### Mainnet
    
    [docs](https://tonmon.xyz/?orgId=1&refresh=5m)
    
    Pros: very reliable, fast, works with all wallets
    
    Cons: not free to use (but very cheap)
    

### Library

![](../assets/arrow-down.svg)

-   #### npm ton (JavaScript)
    
    [docs](https://github.com/ton-community/ton)
    
    Pros: more popular, full TypeScript support, elegant api
    
    Cons: no support for all ton services
    
-   #### TonWeb (JavaScript)
    
    [docs](https://github.com/toncenter/tonweb)
    
    Pros: maintained by core team, supports ton services
    
    Cons: mediocre TypeScript support
    

### Tutorials

-   [01\. Working with your first wallet](https://helloworld.tonstudio.io/01-wallet)
-   [02\. Writing your first smart contract](https://helloworld.tonstudio.io/02-contract)
-   [03\. Building your first web client](https://helloworld.tonstudio.io/03-client)
-   [04\. Testing your first smart contract](https://helloworld.tonstudio.io/04-testing)

### Help

-   [Problems with this tutorial?](https://github.com/ton-community/tutorials/blob/main/HELP.md)

# TON Hello World part 1: Step by step guide for working with your first TON wallet

![](../assets/authors/talkol.jpg) by Tal Kol

[](https://t.me/talkol)[](https://twitter.com/koltal)

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - _mainnet_ and _testnet_. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The mainnet version of Tonscan is available on [https://tonscan.org](https://tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

![](https://i.imgur.com/r1POqo9.png)  

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait… isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

![](https://i.imgur.com/OdIRwvo.png)  

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

![](https://i.imgur.com/P9uuKaU.png)  

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

![](https://i.imgur.com/xsZbZ5X.png)  

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [@ton/ton](https://www.npmjs.com/package/@ton/ton) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install @ton/ton @ton/crypto @ton/core
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString());

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called _workchains_. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

**Reward:** We will send 0.05 TON to the special address to mint a secret NFT from ["TON Masters"](https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST) collection ([testnet link](https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST)). Here is how your reward looks like:

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!

# TON Hello World part 1: Step by step guide for working with your first TON wallet

![](../assets/authors/talkol.jpg) by Tal Kol

[](https://t.me/talkol)[](https://twitter.com/koltal)

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - _mainnet_ and _testnet_. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The mainnet version of Tonscan is available on [https://tonscan.org](https://tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

![](https://i.imgur.com/r1POqo9.png)  

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait… isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

![](https://i.imgur.com/OdIRwvo.png)  

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

![](https://i.imgur.com/P9uuKaU.png)  

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

![](https://i.imgur.com/xsZbZ5X.png)  

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [TonWeb](https://github.com/toncenter/tonweb) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install tonweb tonweb-mnemonic
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true));

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called _workchains_. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `tonweb.wallet.all["v4R2"]` with `tonweb.wallet.all["v3R2"]`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  console.log("balance:", TonWeb.utils.fromNano(balance));

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

**Reward:** We will send 0.05 TON to the special address to mint a secret NFT from ["TON Masters"](https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST) collection ([testnet link](https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST)). Here is how your reward looks like:

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!

# TON Hello World part 1: Step by step guide for working with your first TON wallet

![](../assets/authors/talkol.jpg) by Tal Kol

[](https://t.me/talkol)[](https://twitter.com/koltal)

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - _mainnet_ and _testnet_. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

Tonkeeper works by default on TON mainnet. If you decided to work on testnet, you will need to switch the app manually to dev mode. Open the "Settings" tab and tap 5 times quickly on the Tonkeeper Logo on the bottom. The "Dev Menu" should show up. Click on "Switch to Testnet" and make the switch. You can use this menu later to return to mainnet.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The testnet version of Tonscan is available on [https://testnet.tonscan.org](https://testnet.tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

![](https://i.imgur.com/r1POqo9.png)  

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait… isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

When using testnet, TON coins can be received for free. Using Telegram messenger, open the faucet [https://t.me/testgiver\_ton\_bot](https://t.me/testgiver_ton_bot) and request some coins from the bot by providing your wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

![](https://i.imgur.com/OdIRwvo.png)  

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

![](https://i.imgur.com/P9uuKaU.png)  

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

![](https://i.imgur.com/xsZbZ5X.png)  

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [@ton/ton](https://www.npmjs.com/package/@ton/ton) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install @ton/ton @ton/crypto @ton/core
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wal

[Content truncated due to size limit]


================================================
FILE: docs/01-wallet/mainnet-npmton.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/mainnet-npmton.html
================================================
[HTML Document converted to Markdown]

File: mainnet-npmton.html
Size: 19.88 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - _mainnet_ and _testnet_. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The mainnet version of Tonscan is available on [https://tonscan.org](https://tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

![](https://i.imgur.com/r1POqo9.png)  

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait… isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

![](https://i.imgur.com/OdIRwvo.png)  

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

![](https://i.imgur.com/P9uuKaU.png)  

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

![](https://i.imgur.com/xsZbZ5X.png)  

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [@ton/ton](https://www.npmjs.com/package/@ton/ton) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install @ton/ton @ton/crypto @ton/core
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString());

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called _workchains_. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

**Reward:** We will send 0.05 TON to the special address to mint a secret NFT from ["TON Masters"](https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST) collection ([testnet link](https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST)). Here is how your reward looks like:

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 23, Images: 4, Headings: 12, Paragraphs: 72



================================================
FILE: docs/01-wallet/mainnet-npmton.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/mainnet-npmton.md
================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - *mainnet* and *testnet*. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The mainnet version of Tonscan is available on [https://tonscan.org](https://tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

<img src="https://i.imgur.com/r1POqo9.png" width=600 /><br>

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait... isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

<img src="https://i.imgur.com/OdIRwvo.png" width=600 /><br>

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

<img src="https://i.imgur.com/P9uuKaU.png" width=600 /><br>

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

<img src="https://i.imgur.com/xsZbZ5X.png" width=600 /><br>

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [@ton/ton](https://www.npmjs.com/package/@ton/ton) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install @ton/ton @ton/crypto @ton/core
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString());

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called *workchains*. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

<strong>Reward:</strong> We will send 0.05 TON to the special address to mint a secret NFT from <a target="_blank" href="https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">"TON Masters"</a> collection  (<a target="_blank" href="https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">testnet link</a>). Here is how your reward looks like:

<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/1-wallet/video.mp4" type="video/mp4">
</video>

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/01-wallet/mainnet-tonweb.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/mainnet-tonweb.html
================================================
[HTML Document converted to Markdown]

File: mainnet-tonweb.html
Size: 19.87 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - _mainnet_ and _testnet_. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The mainnet version of Tonscan is available on [https://tonscan.org](https://tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

![](https://i.imgur.com/r1POqo9.png)  

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait… isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

![](https://i.imgur.com/OdIRwvo.png)  

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

![](https://i.imgur.com/P9uuKaU.png)  

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

![](https://i.imgur.com/xsZbZ5X.png)  

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [TonWeb](https://github.com/toncenter/tonweb) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install tonweb tonweb-mnemonic
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true));

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called _workchains_. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `tonweb.wallet.all["v4R2"]` with `tonweb.wallet.all["v3R2"]`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  console.log("balance:", TonWeb.utils.fromNano(balance));

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

**Reward:** We will send 0.05 TON to the special address to mint a secret NFT from ["TON Masters"](https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST) collection ([testnet link](https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST)). Here is how your reward looks like:

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 23, Images: 4, Headings: 12, Paragraphs: 72



================================================
FILE: docs/01-wallet/mainnet-tonweb.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/mainnet-tonweb.md
================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - *mainnet* and *testnet*. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The mainnet version of Tonscan is available on [https://tonscan.org](https://tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

<img src="https://i.imgur.com/r1POqo9.png" width=600 /><br>

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait... isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

<img src="https://i.imgur.com/OdIRwvo.png" width=600 /><br>

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

<img src="https://i.imgur.com/P9uuKaU.png" width=600 /><br>

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

<img src="https://i.imgur.com/xsZbZ5X.png" width=600 /><br>

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [TonWeb](https://github.com/toncenter/tonweb) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install tonweb tonweb-mnemonic
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true));

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called *workchains*. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `tonweb.wallet.all["v4R2"]` with `tonweb.wallet.all["v3R2"]`.
## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  console.log("balance:", TonWeb.utils.fromNano(balance));

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

<strong>Reward:</strong> We will send 0.05 TON to the special address to mint a secret NFT from <a target="_blank" href="https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">"TON Masters"</a> collection  (<a target="_blank" href="https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">testnet link</a>). Here is how your reward looks like:

<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/1-wallet/video.mp4" type="video/mp4">
</video>

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/01-wallet/options.json
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/options.json
================================================
{
  "network": {
    "name": "Network",
    "order": 1,
    "default": "testnet",
    "options": {
      "testnet": {
        "name": "Testnet",
        "order": 1,
        "url": "https://ton.org/docs/develop/smart-contracts/environment/testnet",
        "pros": "free to use",
        "cons": "less reliable, requires special wallets"
      },
      "mainnet": {
        "name": "Mainnet",
        "url": "https://tonmon.xyz/?orgId=1&refresh=5m",
        "order": 2,
        "pros": "very reliable, fast, works with all wallets",
        "cons": "not free to use (but very cheap)"
      }
    }
  },
  "library": {
    "name": "Library",
    "order": 2,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      },
      "tonweb": {
        "name": "TonWeb (JavaScript)",
        "order": 2,
        "url": "https://github.com/toncenter/tonweb",
        "pros": "maintained by core team, supports ton services",
        "cons": "mediocre TypeScript support"
      }
    }
  }
}


================================================
FILE: docs/01-wallet/testnet-npmton.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/testnet-npmton.html
================================================
[HTML Document converted to Markdown]

File: testnet-npmton.html
Size: 20.55 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - _mainnet_ and _testnet_. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

Tonkeeper works by default on TON mainnet. If you decided to work on testnet, you will need to switch the app manually to dev mode. Open the "Settings" tab and tap 5 times quickly on the Tonkeeper Logo on the bottom. The "Dev Menu" should show up. Click on "Switch to Testnet" and make the switch. You can use this menu later to return to mainnet.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The testnet version of Tonscan is available on [https://testnet.tonscan.org](https://testnet.tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

![](https://i.imgur.com/r1POqo9.png)  

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait… isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

When using testnet, TON coins can be received for free. Using Telegram messenger, open the faucet [https://t.me/testgiver\_ton\_bot](https://t.me/testgiver_ton_bot) and request some coins from the bot by providing your wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

![](https://i.imgur.com/OdIRwvo.png)  

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

![](https://i.imgur.com/P9uuKaU.png)  

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

![](https://i.imgur.com/xsZbZ5X.png)  

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [@ton/ton](https://www.npmjs.com/package/@ton/ton) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install @ton/ton @ton/crypto @ton/core
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString({ testOnly: true }));

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called _workchains_. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

**Reward:** We will send 0.05 TON to the special address to mint a secret NFT from ["TON Masters"](https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST) collection ([testnet link](https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST)). Here is how your reward looks like:

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 24, Images: 4, Headings: 12, Paragraphs: 74



================================================
FILE: docs/01-wallet/testnet-npmton.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/testnet-npmton.md
================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - *mainnet* and *testnet*. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

Tonkeeper works by default on TON mainnet. If you decided to work on testnet, you will need to switch the app manually to dev mode. Open the "Settings" tab and tap 5 times quickly on the Tonkeeper Logo on the bottom. The "Dev Menu" should show up. Click on "Switch to Testnet" and make the switch. You can use this menu later to return to mainnet.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The testnet version of Tonscan is available on [https://testnet.tonscan.org](https://testnet.tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

<img src="https://i.imgur.com/r1POqo9.png" width=600 /><br>

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait... isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

When using testnet, TON coins can be received for free. Using Telegram messenger, open the faucet [https://t.me/testgiver_ton_bot](https://t.me/testgiver_ton_bot) and request some coins from the bot by providing your wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

<img src="https://i.imgur.com/OdIRwvo.png" width=600 /><br>

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

<img src="https://i.imgur.com/P9uuKaU.png" width=600 /><br>

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

<img src="https://i.imgur.com/xsZbZ5X.png" width=600 /><br>

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [@ton/ton](https://www.npmjs.com/package/@ton/ton) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install @ton/ton @ton/crypto @ton/core
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString({ testOnly: true }));

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called *workchains*. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

<strong>Reward:</strong> We will send 0.05 TON to the special address to mint a secret NFT from <a target="_blank" href="https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">"TON Masters"</a> collection  (<a target="_blank" href="https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">testnet link</a>). Here is how your reward looks like:

<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/1-wallet/video.mp4" type="video/mp4">
</video>

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/npmton).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/01-wallet/testnet-tonweb.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/testnet-tonweb.html
================================================
[HTML Document converted to Markdown]

File: testnet-tonweb.html
Size: 20.56 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - _mainnet_ and _testnet_. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

Tonkeeper works by default on TON mainnet. If you decided to work on testnet, you will need to switch the app manually to dev mode. Open the "Settings" tab and tap 5 times quickly on the Tonkeeper Logo on the bottom. The "Dev Menu" should show up. Click on "Switch to Testnet" and make the switch. You can use this menu later to return to mainnet.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The testnet version of Tonscan is available on [https://testnet.tonscan.org](https://testnet.tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

![](https://i.imgur.com/r1POqo9.png)  

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait… isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

When using testnet, TON coins can be received for free. Using Telegram messenger, open the faucet [https://t.me/testgiver\_ton\_bot](https://t.me/testgiver_ton_bot) and request some coins from the bot by providing your wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

![](https://i.imgur.com/OdIRwvo.png)  

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

![](https://i.imgur.com/P9uuKaU.png)  

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

![](https://i.imgur.com/xsZbZ5X.png)  

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [TonWeb](https://github.com/toncenter/tonweb) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install tonweb tonweb-mnemonic
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true, true)); // last true required for testnet

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called _workchains_. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `tonweb.wallet.all["v4R2"]` with `tonweb.wallet.all["v3R2"]`.

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  console.log("balance:", TonWeb.utils.fromNano(balance));

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

**Reward:** We will send 0.05 TON to the special address to mint a secret NFT from ["TON Masters"](https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST) collection ([testnet link](https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST)). Here is how your reward looks like:

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 24, Images: 4, Headings: 12, Paragraphs: 74



================================================
FILE: docs/01-wallet/testnet-tonweb.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/01-wallet/testnet-tonweb.md
================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - *mainnet* and *testnet*. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

Tonkeeper works by default on TON mainnet. If you decided to work on testnet, you will need to switch the app manually to dev mode. Open the "Settings" tab and tap 5 times quickly on the Tonkeeper Logo on the bottom. The "Dev Menu" should show up. Click on "Switch to Testnet" and make the switch. You can use this menu later to return to mainnet.

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

The testnet version of Tonscan is available on [https://testnet.tonscan.org](https://testnet.tonscan.org) - open it and input your wallet address.

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

<img src="https://i.imgur.com/r1POqo9.png" width=600 /><br>

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait... isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

When using testnet, TON coins can be received for free. Using Telegram messenger, open the faucet [https://t.me/testgiver_ton_bot](https://t.me/testgiver_ton_bot) and request some coins from the bot by providing your wallet address.

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

<img src="https://i.imgur.com/OdIRwvo.png" width=600 /><br>

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

<img src="https://i.imgur.com/P9uuKaU.png" width=600 /><br>

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

<img src="https://i.imgur.com/xsZbZ5X.png" width=600 /><br>

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

Next, we're going to install a JavaScript package named [TonWeb](https://github.com/toncenter/tonweb) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install tonweb tonweb-mnemonic
```

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

```ts
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true, true)); // last true required for testnet

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();
```

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called *workchains*. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `tonweb.wallet.all["v4R2"]` with `tonweb.wallet.all["v3R2"]`.
## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  console.log("balance:", TonWeb.utils.fromNano(balance));

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  console.log("seqno:", seqno);
}

main();
```

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

<strong>Reward:</strong> We will send 0.05 TON to the special address to mint a secret NFT from <a target="_blank" href="https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">"TON Masters"</a> collection  (<a target="_blank" href="https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">testnet link</a>). Here is how your reward looks like:

<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/1-wallet/video.mp4" type="video/mp4">
</video>

Create a new file `step9.ts` with this content:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const seqno = await wallet.methods.seqno().call() || 0;
  await wallet.methods.transfer({
    secretKey: key.secretKey,
    toAddress: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
    amount: TonWeb.utils.toNano("0.05"), // 0.05 TON
    seqno: seqno,
    payload: "Hello", // optional comment
    sendMode: 3,
  }).send();

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await wallet.methods.seqno().call() || 0;
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Execute the script by running in terminal:

```console
npx ts-node step9.ts
```

Once the wallet signs and sends a transaction, we must wait until TON Blockchain validators insert this transaction into a new block. Since block time on TON is approx 5 seconds, it will usually take 5-10 seconds until the transaction confirms. Try looking for this outgoing transaction in the Tonscan explorer. After running the code, you will see the NFT minted in your wallet soon.

If you're getting errors in this step, please triple check that the wallet contract you're using is deployed and funded. If you're using the wrong wallet version for example, you'll end up using a wallet contract that isn't deployed and the transaction will fail.

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/01-wallet/test/tonweb).

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/02-contract/index.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/02-contract/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 83.67 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

     TON Hello World part 2: Step by step guide for writing your first smart contract

[

![](../assets/logo.svg)

Tutorials



](https://ton-community.github.io/tutorials)

### Network

![](../assets/arrow-down.svg)

-   #### Testnet
    
    [docs](https://ton.org/docs/develop/smart-contracts/environment/testnet)
    
    Pros: free to use
    
    Cons: less reliable, requires special wallets
    
-   #### Mainnet
    
    [docs](https://tonmon.xyz/?orgId=1&refresh=5m)
    
    Pros: very reliable, fast, works with all wallets
    
    Cons: not free to use (but very cheap)
    

### Library

![](../assets/arrow-down.svg)

-   #### npm ton (JavaScript)
    
    [docs](https://github.com/ton-community/ton)
    
    Pros: more popular, full TypeScript support, elegant api
    
    Cons: no support for all ton services
    

### Tutorials

-   [01\. Working with your first wallet](https://helloworld.tonstudio.io/01-wallet)
-   [02\. Writing your first smart contract](https://helloworld.tonstudio.io/02-contract)
-   [03\. Building your first web client](https://helloworld.tonstudio.io/03-client)
-   [04\. Testing your first smart contract](https://helloworld.tonstudio.io/04-testing)

### Help

-   [Problems with this tutorial?](https://github.com/ton-community/tutorials/blob/main/HELP.md)

# TON Hello World part 2: Step by step guide for writing your first smart contract

![](../assets/authors/talkol.jpg) by Tal Kol

[](https://t.me/talkol)[](https://twitter.com/koltal)

A smart contract is simply a computer program running on TON Blockchain - or more exactly its [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) (TON Virtual Machine). The contract is made of code (compiled TVM instructions) and data (persistent state) that are stored in some address on TON Blockchain.

In the world of blockchain, _code is law_, meaning that instead of lawyers and papers, computer instructions define in absolute terms the rules of interaction between the different users of the contract. Before engaging with any smart contract as a user, you're expected to review its code and thus understand its terms of agreement. Accordingly, we'll make an effort to make our contract as easy to read as possible, so its users could understand what they're getting into.

## Dapps - decentralized applications

Smart contracts are a key part of _decentralized apps_ - a special type of application invented in the blockchain era, that does not depend on any single entity to run it. Unlike the app Uber, for example, which depends on the company Uber Inc to run it - a _decentralized Uber_ would allow riders and drivers to interact directly (order, pay for and fulfill rides) without any intermediary like Uber Inc. Dapps are also unstoppable - if we don't depend on anyone specific to run them, nobody can take them down.

Dapps on TON Blockchain are usually made of 2 main projects:

-   Smart contracts in the [FunC](https://ton.org/docs/develop/func/overview) programming language that are deployed on-chain - these act as the _backend server_ of the app, with a _database_ for persistent storage.
    
-   Web frontend for interacting with the dapp from a web browser - this acts as the _frontend_ or _client_, normally with special support for Telegram messenger in the form of a [Telegram Web App](https://core.telegram.org/bots/webapps).
    

Throughout this series of tutorials, we will build a full dapp together and see detailed implementations of both projects.

## Step 1: Define our first smart contract

So what are we going to build? Our smart contract will be quite simple:

Its main feature is to hold a _counter_. The counter will start at some number, and allow users to send _increment_ transactions to the contract, which will in turn increase the counter value by 1. The contract will also have a getter function that will allow any user to query the current value of the counter.

In later tutorials we will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

For convenience, our development environment will rely on several clever scripts for testing, compiling and deploying our code. The most convenient language for these scripts is JavaScript, executed by an engine called Node.js. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v18. You can verify your nodejs version by running `node -v` in terminal.

You will also need a decent IDE with FunC and TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com/) - it's free and open source. Also install the [FunC Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) to add syntax highlighting for the FunC language.

## Step 3: Set up the project

Let's open a terminal in the project directory where you want to place your project. When you run the following command, be sure to choose "Counter" as the contract name and select "an empty contract (FunC)" from the list of templates. This will help prevent any issues in the future.

```console
npm create ton@latest
```

This will create a new project with a preconfigured structure, which includes a workflow for developing, testing, and deploying smart contracts using the Blueprint SDK. The project structure will initially consist of four directories: `contracts`, `wrappers`, `tests`, and `scripts`. Later on, we will also create a `build` directory.

And finally, execute the following command to open a folder, allowing us to proceed with the tutorial:

```console
cd your_project_directory
```

## Step 4: Structuring our smart contract

Much like everything else in life, smart contracts in FunC are divided into 3 sections. These sections are: _storage_, _messages_ and _getters_.

The **storage** section deals with our contract's persistent data. Our contract will have to store data between calls from different users, for example the value of our _counter_ variable. To write this data to state storage, we will need a write/encode function and to read this data back from state storage, we will need a read/decode function.

The **messages** section deals with messages sent to our contract. The main form of interaction with contracts on TON Blockchain is by sending them messages. We mentioned before that our contract will need to support a variety of actions like _increment_, _deposit_, _withdraw_ and _transfer ownership_. All of these operations are performed by users as transactions. These operations are not read-only because they change something in the contract's persistent state.

The **getters** section deals with read-only interactions that don't change state. For example, we would want to allow users to query the value of our _counter_, so we can implement a getter for that. We've also mentioned that the contract has a special _owner_, so what about a getter to query that. Since our contract can hold money (TON coins), another useful getter could be to query the current balance.

## Step 5: Implement the Counter contract

We're about to write our first lines in FunC! Our first task would be to implement the _counter_ feature of our contract.

The FunC programming language is very similar to the [C language](https://en.wikipedia.org/wiki/C_\(programming_language\)). It has strict types, which is a good idea, since compilation errors will help us spot contract mistakes early on. The language was designed specifically for TON Blockchain, so you will not find a lot of documentation beyond the [official FunC docs](https://ton.org/docs/develop/func/overview).

Before the first section, please remember to keep the following line of code at the beginning of the file to import the standard library, as its absence can cause issues later on.

```func
#include "imports/stdlib.fc";
```

### Storage

Let's start with the first section, _storage_, and implement two utility functions (which we will use later) for reading and writing variables to the contract's persistent state - `load_data()` and `save_data()`. The primary variable will be the counter value. We must persist this value to storage because we need to remember it between calls. The appropriate type for our counter variable is `int`. Notice [in the docs](https://ton.org/docs/develop/func/types#atomic-types) that the `int` TVM runtime type is always 257 bit long (256 bit signed) so it can hold huge huge numbers - I'm pretty sure the universe has less than 2^256 atoms in it, so you'll never have a number so large that you can't fit in it. Storing the full 257 bits in blockchain storage is somewhat wasteful because the contract pays rent proportionally to the total amount of data it keeps. To optimize costs, let's keep in persistent storage just the lowest 64 bits - capping our counter's maximum value at 2^64 which should be enough:

```func
(int) load_data() inline {                 ;; read function declaration - returns int as result
  var ds = get_data().begin_parse();       ;; load the storage cell and start parsing as a slice
  return (ds~load_uint(64));               ;; read a 64 bit unsigned int from the slice and return it
}

() save_data(int counter) impure inline {  ;; write function declaration - takes an int as arg
  set_data(begin_cell()                    ;; store the storage cell and create it with a builder
    .store_uint(counter, 64)               ;; write a 64 bit unsigned int to the builder
    .end_cell());                          ;; convert the builder to a cell
}
```

The standard library functions `get_data()` and `set_data()` are documented [here](https://ton.org/docs/develop/func/stdlib#persistent-storage-save-and-load) and load/store the storage cell. We will cover [_cells_](https://ton.org/docs/develop/func/types#atomic-types) in detail in future posts of this series. Cells are read from using the [_slice_](https://ton.org/docs/develop/func/types#atomic-types) type (an array of bits) and written to using the [_builder_](https://ton.org/docs/develop/func/types#atomic-types) type. The various methods that you see are all taken from the [standard library](https://ton.org/docs/develop/func/stdlib). Also notice two interesting function modifiers that appear in the declarations - [_inline_](https://ton.org/docs/develop/func/functions#inline-specifier) and [_impure_](https://ton.org/docs/develop/func/functions#impure-specifier).

### Messages

Let's continue to the next section, _messages_, and implement the main message handler of our contract - `recv_internal()`. This is the primary entry point of our contract. It runs whenever a message is sent as a transaction to the contract by another contract or by a user's wallet contract:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Messages sent between contracts are called [internal messages](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages). TON also supports [external messages](https://ton.org/docs/develop/smart-contracts/messages) through the handler `recv_external()`, but as a dapp developer you're never expected to use them. External messages are used for very specific cases, mainly when implementing wallet contracts, that you would normally never have to write by yourself. You can safely ignore them.

Internal messages received by the contract may be empty. This is what happens for example when somebody sends TON coins to the contract from their wallet. This is useful for funding the contract so it can pay fees. In order to be able to receive those incoming transfers we will have to return successfully when an empty message arrives.

If an incoming message is not empty, the first thing to do is read its operation type. By convention, internal messages are [encoded](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) with a 32 bit unsigned int in the beginning that acts as operation type (op for short). We are free to assign any serial numbers we want to our different ops. In this case, we've assigned the number `1` to the _increment_ action, which is handled by writing back to persistent state the current value counter plus 1.

### Getters

Our last section, as you recall, is _getters_. Let's implement a simple getter that will allow users to query the counter value:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

We can choose what input arguments the getter takes as input and what output it returns as result. Also notice the function modifier appearing in the declaration - [_method\_id_](https://ton.org/docs/develop/func/functions#method_id). It is customary to place `method_id` on all getters.

That's it. We completed our 3 sections and the first version of our contract is ready. To get the complete code, simply concat the 3 snippets above and replace the existing code in `contracts/counter.fc`. This will be the FunC (`.fc` file extension) source file of our contract. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc).

## Step 6: Build the counter contract

Right now, the contract is just FunC source code. To get it to run on-chain, we need to convert it to TVM [bytecode](https://ton.org/docs/learn/tvm-instructions/instructions).

In TON, we don't compile FunC directly to bytecode, but instead go through another programming language called [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). Just like FunC, Fift is another language that was designed specifically for TON Blockchain. It's a low level language that is very close to TVM opcodes. For us regular mortals, Fift is not very useful, so unless you're planning on some extra advanced things, I believe you can safely ignore it for now.

Since we're using func-js for building, it would be a good idea to create a directory where we can store the build result. To do this, open the terminal and run the following command:

```console
mkdir build
```

The func-js package contains everything we need to compile our contract to bytecode. To use it, open terminal in the project directory and run the following:

```console
npx func-js contracts/counter.fc --boc build/counter.cell
```

The build should succeed, with the output of this command being a new file - `counter.cell`. This is a binary file that finally contains the TVM bytecode in cell format that is ready to be deployed on-chain. This will actually be the only file we need for deployment moving forward (we won't need the FunC source file).

## Step 7: Prepare init data for deploying on-chain

Now that our contract has been compiled to bytecode, we can finally see it in action running on-chain. The act of uploading the bytecode to the blockchain is called _deployment_. The deployment result would be an address where the contract resides. This address will allow us to communicate with this specific contract instance later on and send it transactions.

There are two variations of TON Blockchain we can deploy to - _mainnet_ and _testnet_. We covered both in the previous tutorial. Personally, I almost never deploy to testnet. There are far better ways to gain confidence that my code is working as expected. The primary of which is writing a dedicated _test suite_. We will cover this in detail in one of the next tutorials. For now, let's assume the code is working perfectly and no further debugging is required.

### Init arguments

The new address of our deployed contract in TON depends on only two things - the deployed bytecode (initial code) and the initial contract storage (initial data). You can say that the address is some derivation of the hash of both. If two different developers were to deploy the exact same code with the exact same initialization data, they would collide.

The bytecode part is easy, we have that ready as a cell in the file `counter.cell` that we compiled in step 6. Now what about the initial contract storage? As you recall, the format of our persistent storage data was decided when we implemented the function `save_data()` of our contract FunC source. Our storage layout was very simple - just one unsigned int of 64 bit holding the counter value. Therefore, to initialize our contract, we would need to generate a data cell holding some arbitrary initial uint64 value - for example the number `1`.

### Interface class

The recommended way to interact with contracts is to create a small TypeScript class that will implement the interaction interface with the contract. We're using the project structure created by Blueprint, but we're still working on low-level aspects. Use the following code in `wrappers/Counter.ts` to create the initial data cell for deployment:

```ts
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
}
```

Notice a few interesting things about this TypeScript code. First, it depends on the package [@ton/core](https://www.npmjs.com/package/@ton/core) instead of [@ton/ton](https://www.npmjs.com/package/@ton/ton), which contains a small subset of base types and is therefore slower to change - an important feature when building a stable interface for our contract. Second, the code that creates the data cell mimics the FunC API and is almost identical to our `save_data()` FunC function. Third, we can see the derivation of the contract address from the code cell and data cell using the function `contractAddress`.

The actual deployment involves sending the first message that will cause our contract to be deployed. We can piggyback any message that is directed towards our contract. This can even be the increment message with op #1, but we will do something simpler. We will just send some TON coins to our contract (an empty message) and piggyback that. Let's make this part of our interface. Add the function `sendDeploy()` to `wrappers/Counter.ts` - this function will send the deployment message:

```ts
// export default class Counter implements Contract {

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

// }
```

In every deployment we need to send some TON coins to our contract so that its balance is not zero. Contracts need to continually pay rent fees otherwise they risk being deleted. According to the [docs](https://ton.org/docs/develop/smart-contracts/fees#storage-fee), storage fees are about 4 TON per MB per year. Since our contract stores less than 1 KB, a balance of 0.01 TON should be enough for more than 2 years. In any case you can always check this in an explorer and send more TON to the contract if it runs low.

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step7.ts).

## Step 8: Deploy the contract on-chain

Communicating with the live network for the deployment will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

The deployment is going to cost gas and should be done through a wallet that will fund it. I'm assuming that you have some familiarity with TON wallets and how they're derived from 24 word secret mnemonics. If not, be sure to follow the previous tutorial in this series.

As you recall from the previous tutorial, TON wallets can come in multiple versions. The code below relies on "wallet v4 r2", if your wallet is different, either switch [Tonkeeper](https://tonkeeper.com) through "Settings" to this version, or modify the code below to use your version. Also remember to use a wallet works with the correct network you've chosen - testnet or mainnet.

Replace the current code in `scripts/deployCounter.ts` with a script that will use the interface class we have just written:

```ts
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class from step 7

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Before running this code, make sure you have enough TON in your wallet for the gas payments and the TON sent to the contract during the deploy.

Another thing to watch out for is collisions between different users of this tutorial. As you recall, if the code and initial data of two contracts are identical, they will have the same address. If all followers of this tutorial would choose initial counter value of `1` - then all of them would collide and only the first would actually deploy the contract. To make sure this doesn't happen, the code above initializes the counter value to the current number of milliseconds since the epoch (something like 1674253934361). This guarantees that your contract for deployment is unique.

To deploy a contract using our script, run the following command in the terminal and follow the on-screen instructions:

```console
npx blueprint run
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance. A common mistake is trying to use a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the previous tutorial, check your wallet address in an [explorer](https://tonscan.org) and if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

The script will print the newly deployed contract address - mine is `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb`. You can open your address in an [explorer](https://tonscan.org) to verify that the deploy went smoothly. This is what it should look like:

![](https://i.imgur.com/SLR7nmE.png)  

Write down your deployed contract address. We're going to use it in the next step.

## Step 9: Call a getter on the deployed contract

There are two ways to interact with a smart contract - calling a getter to read data from it or sending a message that can potentially change its state (write). We should support these interactions in the contract interface class that we created in step 7.

Anyone who wants to access the contract from TypeScript would simply use this interface class. This is excellent for separation of responsibilities within your team. The developer of the contract can provide this class to the developer of the client to abstract away implementation details such as how messages should be encoded in the binary level. Let's start with the getter.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

// }
```

Notice that methods in the interface class that call getters must start with the word `get`. This prefix is a requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) TypeScript library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step9.ts).

### Executing the call

Calling a getter is free and does not cost gas. The reason is that this call is read-only, so it does not require consensus by the validators and is not stored in a block on-chain for all eternity like transaction are.

Let's create a new script called `getCounter.ts` in the `scripts` folder and use our shiny interface class to make the call. We're going to emulate a different developer interacting with our contract and since the contract is already deployed, they are likely to access it by address. Be sure to replace my deployed contract address with yours in the code below:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "getCounter" from the list of available scripts.

```console
npx blueprint run
```

Make a note of the current counter value. After we send the increment message in the next step we would like to confirm that this value indeed increases by 1.

Another interesting thing to remember is that getters are only accessible off-chain, for example from a JavaScript client making a call through an RPC service provider. In particular, this means that contracts cannot call getters on other contracts.

## Step 10: Send a transaction to the deployed contract

Unlike getters that are read-only, messages can write and change contract state in storage. In our contract implementation we handled messages in `recv_internal()` and assigned op #1 = _increment_. Sending messages costs gas and requires payment in TON coin. The reason is that this operation is not read-only, so it requires waiting for consensus by the validators and is stored as a transaction in a block on-chain for all eternity. We will send less TON coin this time since this action is much cheaper than the deployment.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

// }
```

As you recall, the increment message is an [internal message](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) that is encoded by convention with a 32 bit unsigned int in the beginning to describe the op and a 64 bit unsigned int after to describe the query id. The query id is relevant for messages that expect a response message to be sent back (the request and the response share the same query id).

Notice that methods in the interface class that send messages must start with the word `send`, another prefix requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step10.ts).

### Executing the send

The messages can be sent from any TON wallet, not necessarily the deployer wallet. Create a new script `sendIncrement.ts` in the `scripts` folder and use your wallet to fund the send:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "sendIncrement" from the list of available scripts.

```console
npx blueprint run
```

Notice that the message will take a few seconds to be processed by validators and will only change contract state after it has been processed. The normal wait time is a block or two, since validators need to produce a new block that contains our sent transaction. The op that was sent above is #1 = _increment_, which means that after processing, the counter value will increase by 1. Verify this by re-running the script from step 9 to print the new counter value.

Messages can be sent to our contract by other contracts. This means a different contract can increment our counter. This allows the TON ecosystem to create composable apps and protocols that build on top of each other and interact in unforeseen ways.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQA4RIS6uxt1GZkTTr19Wy423NZtcG0pRy29lg55X-qYq-Tf) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACACZ_fWVyQMr&amount=50000000): ![QR-code](https://i.imgur.com/GEuOQjr.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/02-contract/test).

In this tutorial we handled the build and deploy processes manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have these processes managed automatically by an awesome dev tool called [Blueprint](https://github.com/ton-community/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!

# TON Hello World part 2: Step by step guide for writing your first smart contract

![](../assets/authors/talkol.jpg) by Tal Kol

[](https://t.me/talkol)[](https://twitter.com/koltal)

A smart contract is simply a computer program running on TON Blockchain - or more exactly its [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) (TON Virtual Machine). The contract is made of code (compiled TVM instructions) and data (persistent state) that are stored in some address on TON Blockchain.

In the world of blockchain, _code is law_, meaning that instead of lawyers and papers, computer instructions define in absolute terms the rules of interaction between the different users of the contract. Before engaging with any smart contract as a user, you're expected to review its code and thus understand its terms of agreement. Accordingly, we'll make an effort to make our contract as easy to read as possible, so its users could understand what they're getting into.

## Dapps - decentralized applications

Smart contracts are a key part of _decentralized apps_ - a special type of application invented in the blockchain era, that does not depend on any single entity to run it. Unlike the app Uber, for example, which depends on the company Uber Inc to run it - a _decentralized Uber_ would allow riders and drivers to interact directly (order, pay for and fulfill rides) without any intermediary like Uber Inc. Dapps are also unstoppable - if we don't depend on anyone specific to run them, nobody can take them down.

Dapps on TON Blockchain are usually made of 2 main projects:

-   Smart contracts in the [FunC](https://ton.org/docs/develop/func/overview) programming language that are deployed on-chain - these act as the _backend server_ of the app, with a _database_ for persistent storage.
    
-   Web frontend for interacting with the dapp from a web browser - this acts as the _frontend_ or _client_, normally with special support for Telegram messenger in the form of a [Telegram Web App](https://core.telegram.org/bots/webapps).
    

Throughout this series of tutorials, we will build a full dapp together and see detailed implementations of both projects.

## Step 1: Define our first smart contract

So what are we going to build? Our smart contract will be quite simple:

Its main feature is to hold a _counter_. The counter will start at some number, and allow users to send _increment_ transactions to the contract, which will in turn increase the counter value by 1. The contract will also have a getter function that will allow any user to query the current value of the counter.

In later tutorials we will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

For convenience, our development environment will rely on several clever scripts for testing, compiling and deploying our code. The most convenient language for these scripts is JavaScript, executed by an engine called Node.js. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v18. You can verify your nodejs version by running `node -v` in terminal.

You will also need a decent IDE with FunC and TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com/) - it's free and open source. Also install the [FunC Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) to add syntax highlighting for the FunC language.

## Step 3: Set up the project

Let's open a terminal in the project directory where you want to place your project. When you run the following command, be sure to choose "Counter" as the contract name and select "an empty contract (FunC)" from the list of templates. This will help prevent any issues in the future.

```console
npm create ton@latest
```

This will create a new project with a preconfigured structure, which includes a workflow for developing, testing, and deploying smart contracts using the Blueprint SDK. The project structure will initially consist of four directories: `contracts`, `wrappers`, `tests`, and `scripts`. Later on, we will also create a `build` directory.

And finally, execute the following command to open a folder, allowing us to proceed with the tutorial:

```console
cd your_project_directory
```

## Step 4: Structuring our smart contract

Much like everything else in life, smart contracts in FunC are divided into 3 sections. These sections are: _storage_, _messages_ and _getters_.

The **storage** section deals with our contract's persistent data. Our contract will have to store data between calls from different users, for example the value of our _counter_ variable. To write this data to state storage, we will need a write/encode function and to read this data back from state storage, we will need a read/decode function.

The **messages** section deals with messages sent to our contract. The main form of interaction with contracts on TON Blockchain is by sending them messages. We mentioned before that our contract will need to support a variety of actions like _increment_, _deposit_, _withdraw_ and _transfer ownership_. All of these operations are performed by users as transactions. These operations are not read-only because they change something in the contract's persistent state.

The **getters** section deals with read-only interactions that don't change state. For example, we would want to allow users to query the value of our _counter_, so we can implement a getter for that. We've also mentioned that the contract has a special _owner_, so what about a getter to query that. Since our contract can hold money (TON coins), another useful getter could be to query the current balance.

## Step 5: Implement the Counter contract

We're about to write our first lines in FunC! Our first task would be to implement the _counter_ feature of our contract.

The FunC programming language is very similar to the [C language](https://en.wikipedia.org/wiki/C_\(programming_language\)). It has strict types, which is a good idea, since compilation errors will help us spot contract mistakes early on. The language was designed specifically for TON Blockchain, so you will not find a lot of documentation beyond the [official FunC docs](https://ton.org/docs/develop/func/overview).

Before the first section, please remember to keep the following line of code at the beginning of the file to import the standard library, as its absence can cause issues later on.

```func
#include "imports/stdlib.fc";
```

### Storage

Let's start with the first section, _storage_, and implement two utility functions (which we will use later) for reading and writing variables to the contract's persistent state - `load_data()` and `save_data()`. The primary variable will be the counter value. We must persist this value to storage because we need to remember it between calls. The appropriate type for our counter variable is `int`. Notice [in the docs](https://ton.org/docs/develop/func/types#atomic-types) that the `int` TVM runtime type is always 257 bit long (256 bit signed) so it can hold huge huge numbers - I'm pretty sure the universe has less than 2^256 atoms in it, so you'll never have a number so large that you can't fit in it. Storing the full 257 bits in blockchain storage is somewhat wasteful because the contract pays rent proportionally to the total amount of data it keeps. To optimize costs, let's keep in persistent storage just the lowest 64 bits - capping our counter's maximum value at 2^64 which should be enough:

```func
(int) load_data() inline {                 ;; read function declaration - returns int as result
  var ds = get_data().begin_parse();       ;; load the storage cell and start parsing as a slice
  return (ds~load_uint(64));               ;; read a 64 bit unsigned int from the slice and return it
}

() save_data(int counter) impure inline {  ;; write function declaration - takes an int as arg
  set_data(begin_cell()                    ;; store the storage cell and create it with a builder
    .store_uint(counter, 64)               ;; write a 64 bit unsigned int to the builder
    .end_cell());                          ;; convert the builder to a cell
}
```

The standard library functions `get_data()` and `set_data()` are documented [here](https://ton.org/docs/develop/func/stdlib#persistent-storage-save-and-load) and load/store the storage cell. We will cover [_cells_](https://ton.org/docs/develop/func/types#atomic-types) in detail in future posts of this series. Cells are read from using the [_slice_](https://ton.org/docs/develop/func/types#atomic-types) type (an array of bits) and written to using the [_builder_](https://ton.org/docs/develop/func/types#atomic-types) type. The various methods that you see are all taken from the [standard library](https://ton.org/docs/develop/func/stdlib). Also notice two interesting function modifiers that appear in the declarations - [_inline_](https://ton.org/docs/develop/func/functions#inline-specifier) and [_impure_](https://ton.org/docs/develop/func/functions#impure-specifier).

### Messages

Let's continue to the next section, _messages_, and implement the main message handler of our contract - `recv_internal()`. This is the primary entry point of our contract. It runs whenever a message is sent as a transaction to the contract by another contract or by a user's wallet contract:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Messages sent between contracts are called [internal messages](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages). TON also supports [external messages](https://ton.org/docs/develop/smart-contracts/messages) through the handler `recv_external()`, but as a dapp developer you're never expected to use them. External messages are used for very specific cases, mainly when implementing wallet contracts, that you would normally never have to write by yourself. You can safely ignore them.

Internal messages received by the contract may be empty. This is what happens for example when somebody sends TON coins to the contract from their wallet. This is useful for funding the contract so it can pay fees. In order to be able to receive those incoming transfers we will have to return successfully when an empty message arrives.

If an incoming message is not empty, the first thing to do is read its operation type. By convention, internal messages are [encoded](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) with a 32 bit unsigned int in the beginning that acts as operation type (op for short). We are free to assign any serial numbers we want to our different ops. In this case, we've assigned the number `1` to the _increment_ action, which is handled by writing back to persistent state the current value counter plus 1.

### Getters

Our last section, as you recall, is _getters_. Let's implement a simple getter that will allow users to query the counter value:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

We can choose what input arguments the getter takes as input and what output it returns as result. Also notice the function modifier appearing in the declaration - [_method\_id_](https://ton.org/docs/develop/func/functions#method_id). It is customary to place `method_id` on all getters.

That's it. We completed our 3 sections and the first version of our contract is ready. To get the complete code, simply concat the 3 snippets above and replace the existing code in `contracts/counter.fc`. This will be the FunC (`.fc` file extension) source file of our contract. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc).

## Step 6: Build the counter contract

Right now, the contract is just FunC source code. To get it to run on-chain, we need to convert it to TVM [bytecode](https://ton.org/docs/learn/tvm-instructions/instructions).

In TON, we don't compile FunC directly to bytecode, but instead go through another programming language called [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). Just like FunC, Fift is another language that was designed specifically for TON Blockchain. It's a low level language that is very close to TVM opcodes. For us regular mortals, Fift is not very useful, so unless you're planning on some extra advanced things, I believe you can safely ignore it for now.

Since we're using func-js for building, it would be a good idea to create a directory where we can store the build result. To do this, open the terminal and run the following command:

```console
mkdir build
```

The func-js package contains everything we need to compile our contract to bytecode. To use it, open terminal in the project directory and run the following:

```console
npx func-js contracts/counter.fc --boc build/counter.cell
```

The build should succeed, with the output of this command being a new file - `counter.cell`. This is a binary file that finally contains the TVM bytecode in cell format that is ready to be deployed on-chain. This will actually be the only file we need for deployment moving forward (we won't need the FunC source file).

## Step 7: Prepare init data for deploying on-chain

Now that our contract has been compiled to bytecode, we can finally see it in action running on-chain. T

[Content truncated due to size limit]


================================================
FILE: docs/02-contract/mainnet-npmton.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/02-contract/mainnet-npmton.html
================================================
[HTML Document converted to Markdown]

File: mainnet-npmton.html
Size: 36.77 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 2: Step by step guide for writing your first smart contract

A smart contract is simply a computer program running on TON Blockchain - or more exactly its [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) (TON Virtual Machine). The contract is made of code (compiled TVM instructions) and data (persistent state) that are stored in some address on TON Blockchain.

In the world of blockchain, _code is law_, meaning that instead of lawyers and papers, computer instructions define in absolute terms the rules of interaction between the different users of the contract. Before engaging with any smart contract as a user, you're expected to review its code and thus understand its terms of agreement. Accordingly, we'll make an effort to make our contract as easy to read as possible, so its users could understand what they're getting into.

## Dapps - decentralized applications

Smart contracts are a key part of _decentralized apps_ - a special type of application invented in the blockchain era, that does not depend on any single entity to run it. Unlike the app Uber, for example, which depends on the company Uber Inc to run it - a _decentralized Uber_ would allow riders and drivers to interact directly (order, pay for and fulfill rides) without any intermediary like Uber Inc. Dapps are also unstoppable - if we don't depend on anyone specific to run them, nobody can take them down.

Dapps on TON Blockchain are usually made of 2 main projects:

-   Smart contracts in the [FunC](https://ton.org/docs/develop/func/overview) programming language that are deployed on-chain - these act as the _backend server_ of the app, with a _database_ for persistent storage.
    
-   Web frontend for interacting with the dapp from a web browser - this acts as the _frontend_ or _client_, normally with special support for Telegram messenger in the form of a [Telegram Web App](https://core.telegram.org/bots/webapps).
    

Throughout this series of tutorials, we will build a full dapp together and see detailed implementations of both projects.

## Step 1: Define our first smart contract

So what are we going to build? Our smart contract will be quite simple:

Its main feature is to hold a _counter_. The counter will start at some number, and allow users to send _increment_ transactions to the contract, which will in turn increase the counter value by 1. The contract will also have a getter function that will allow any user to query the current value of the counter.

In later tutorials we will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

For convenience, our development environment will rely on several clever scripts for testing, compiling and deploying our code. The most convenient language for these scripts is JavaScript, executed by an engine called Node.js. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v18. You can verify your nodejs version by running `node -v` in terminal.

You will also need a decent IDE with FunC and TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com/) - it's free and open source. Also install the [FunC Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) to add syntax highlighting for the FunC language.

## Step 3: Set up the project

Let's open a terminal in the project directory where you want to place your project. When you run the following command, be sure to choose "Counter" as the contract name and select "an empty contract (FunC)" from the list of templates. This will help prevent any issues in the future.

```console
npm create ton@latest
```

This will create a new project with a preconfigured structure, which includes a workflow for developing, testing, and deploying smart contracts using the Blueprint SDK. The project structure will initially consist of four directories: `contracts`, `wrappers`, `tests`, and `scripts`. Later on, we will also create a `build` directory.

And finally, execute the following command to open a folder, allowing us to proceed with the tutorial:

```console
cd your_project_directory
```

## Step 4: Structuring our smart contract

Much like everything else in life, smart contracts in FunC are divided into 3 sections. These sections are: _storage_, _messages_ and _getters_.

The **storage** section deals with our contract's persistent data. Our contract will have to store data between calls from different users, for example the value of our _counter_ variable. To write this data to state storage, we will need a write/encode function and to read this data back from state storage, we will need a read/decode function.

The **messages** section deals with messages sent to our contract. The main form of interaction with contracts on TON Blockchain is by sending them messages. We mentioned before that our contract will need to support a variety of actions like _increment_, _deposit_, _withdraw_ and _transfer ownership_. All of these operations are performed by users as transactions. These operations are not read-only because they change something in the contract's persistent state.

The **getters** section deals with read-only interactions that don't change state. For example, we would want to allow users to query the value of our _counter_, so we can implement a getter for that. We've also mentioned that the contract has a special _owner_, so what about a getter to query that. Since our contract can hold money (TON coins), another useful getter could be to query the current balance.

## Step 5: Implement the Counter contract

We're about to write our first lines in FunC! Our first task would be to implement the _counter_ feature of our contract.

The FunC programming language is very similar to the [C language](https://en.wikipedia.org/wiki/C_\(programming_language\)). It has strict types, which is a good idea, since compilation errors will help us spot contract mistakes early on. The language was designed specifically for TON Blockchain, so you will not find a lot of documentation beyond the [official FunC docs](https://ton.org/docs/develop/func/overview).

Before the first section, please remember to keep the following line of code at the beginning of the file to import the standard library, as its absence can cause issues later on.

```func
#include "imports/stdlib.fc";
```

### Storage

Let's start with the first section, _storage_, and implement two utility functions (which we will use later) for reading and writing variables to the contract's persistent state - `load_data()` and `save_data()`. The primary variable will be the counter value. We must persist this value to storage because we need to remember it between calls. The appropriate type for our counter variable is `int`. Notice [in the docs](https://ton.org/docs/develop/func/types#atomic-types) that the `int` TVM runtime type is always 257 bit long (256 bit signed) so it can hold huge huge numbers - I'm pretty sure the universe has less than 2^256 atoms in it, so you'll never have a number so large that you can't fit in it. Storing the full 257 bits in blockchain storage is somewhat wasteful because the contract pays rent proportionally to the total amount of data it keeps. To optimize costs, let's keep in persistent storage just the lowest 64 bits - capping our counter's maximum value at 2^64 which should be enough:

```func
(int) load_data() inline {                 ;; read function declaration - returns int as result
  var ds = get_data().begin_parse();       ;; load the storage cell and start parsing as a slice
  return (ds~load_uint(64));               ;; read a 64 bit unsigned int from the slice and return it
}

() save_data(int counter) impure inline {  ;; write function declaration - takes an int as arg
  set_data(begin_cell()                    ;; store the storage cell and create it with a builder
    .store_uint(counter, 64)               ;; write a 64 bit unsigned int to the builder
    .end_cell());                          ;; convert the builder to a cell
}
```

The standard library functions `get_data()` and `set_data()` are documented [here](https://ton.org/docs/develop/func/stdlib#persistent-storage-save-and-load) and load/store the storage cell. We will cover [_cells_](https://ton.org/docs/develop/func/types#atomic-types) in detail in future posts of this series. Cells are read from using the [_slice_](https://ton.org/docs/develop/func/types#atomic-types) type (an array of bits) and written to using the [_builder_](https://ton.org/docs/develop/func/types#atomic-types) type. The various methods that you see are all taken from the [standard library](https://ton.org/docs/develop/func/stdlib). Also notice two interesting function modifiers that appear in the declarations - [_inline_](https://ton.org/docs/develop/func/functions#inline-specifier) and [_impure_](https://ton.org/docs/develop/func/functions#impure-specifier).

### Messages

Let's continue to the next section, _messages_, and implement the main message handler of our contract - `recv_internal()`. This is the primary entry point of our contract. It runs whenever a message is sent as a transaction to the contract by another contract or by a user's wallet contract:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Messages sent between contracts are called [internal messages](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages). TON also supports [external messages](https://ton.org/docs/develop/smart-contracts/messages) through the handler `recv_external()`, but as a dapp developer you're never expected to use them. External messages are used for very specific cases, mainly when implementing wallet contracts, that you would normally never have to write by yourself. You can safely ignore them.

Internal messages received by the contract may be empty. This is what happens for example when somebody sends TON coins to the contract from their wallet. This is useful for funding the contract so it can pay fees. In order to be able to receive those incoming transfers we will have to return successfully when an empty message arrives.

If an incoming message is not empty, the first thing to do is read its operation type. By convention, internal messages are [encoded](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) with a 32 bit unsigned int in the beginning that acts as operation type (op for short). We are free to assign any serial numbers we want to our different ops. In this case, we've assigned the number `1` to the _increment_ action, which is handled by writing back to persistent state the current value counter plus 1.

### Getters

Our last section, as you recall, is _getters_. Let's implement a simple getter that will allow users to query the counter value:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

We can choose what input arguments the getter takes as input and what output it returns as result. Also notice the function modifier appearing in the declaration - [_method\_id_](https://ton.org/docs/develop/func/functions#method_id). It is customary to place `method_id` on all getters.

That's it. We completed our 3 sections and the first version of our contract is ready. To get the complete code, simply concat the 3 snippets above and replace the existing code in `contracts/counter.fc`. This will be the FunC (`.fc` file extension) source file of our contract. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc).

## Step 6: Build the counter contract

Right now, the contract is just FunC source code. To get it to run on-chain, we need to convert it to TVM [bytecode](https://ton.org/docs/learn/tvm-instructions/instructions).

In TON, we don't compile FunC directly to bytecode, but instead go through another programming language called [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). Just like FunC, Fift is another language that was designed specifically for TON Blockchain. It's a low level language that is very close to TVM opcodes. For us regular mortals, Fift is not very useful, so unless you're planning on some extra advanced things, I believe you can safely ignore it for now.

Since we're using func-js for building, it would be a good idea to create a directory where we can store the build result. To do this, open the terminal and run the following command:

```console
mkdir build
```

The func-js package contains everything we need to compile our contract to bytecode. To use it, open terminal in the project directory and run the following:

```console
npx func-js contracts/counter.fc --boc build/counter.cell
```

The build should succeed, with the output of this command being a new file - `counter.cell`. This is a binary file that finally contains the TVM bytecode in cell format that is ready to be deployed on-chain. This will actually be the only file we need for deployment moving forward (we won't need the FunC source file).

## Step 7: Prepare init data for deploying on-chain

Now that our contract has been compiled to bytecode, we can finally see it in action running on-chain. The act of uploading the bytecode to the blockchain is called _deployment_. The deployment result would be an address where the contract resides. This address will allow us to communicate with this specific contract instance later on and send it transactions.

There are two variations of TON Blockchain we can deploy to - _mainnet_ and _testnet_. We covered both in the previous tutorial. Personally, I almost never deploy to testnet. There are far better ways to gain confidence that my code is working as expected. The primary of which is writing a dedicated _test suite_. We will cover this in detail in one of the next tutorials. For now, let's assume the code is working perfectly and no further debugging is required.

### Init arguments

The new address of our deployed contract in TON depends on only two things - the deployed bytecode (initial code) and the initial contract storage (initial data). You can say that the address is some derivation of the hash of both. If two different developers were to deploy the exact same code with the exact same initialization data, they would collide.

The bytecode part is easy, we have that ready as a cell in the file `counter.cell` that we compiled in step 6. Now what about the initial contract storage? As you recall, the format of our persistent storage data was decided when we implemented the function `save_data()` of our contract FunC source. Our storage layout was very simple - just one unsigned int of 64 bit holding the counter value. Therefore, to initialize our contract, we would need to generate a data cell holding some arbitrary initial uint64 value - for example the number `1`.

### Interface class

The recommended way to interact with contracts is to create a small TypeScript class that will implement the interaction interface with the contract. We're using the project structure created by Blueprint, but we're still working on low-level aspects. Use the following code in `wrappers/Counter.ts` to create the initial data cell for deployment:

```ts
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
}
```

Notice a few interesting things about this TypeScript code. First, it depends on the package [@ton/core](https://www.npmjs.com/package/@ton/core) instead of [@ton/ton](https://www.npmjs.com/package/@ton/ton), which contains a small subset of base types and is therefore slower to change - an important feature when building a stable interface for our contract. Second, the code that creates the data cell mimics the FunC API and is almost identical to our `save_data()` FunC function. Third, we can see the derivation of the contract address from the code cell and data cell using the function `contractAddress`.

The actual deployment involves sending the first message that will cause our contract to be deployed. We can piggyback any message that is directed towards our contract. This can even be the increment message with op #1, but we will do something simpler. We will just send some TON coins to our contract (an empty message) and piggyback that. Let's make this part of our interface. Add the function `sendDeploy()` to `wrappers/Counter.ts` - this function will send the deployment message:

```ts
// export default class Counter implements Contract {

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

// }
```

In every deployment we need to send some TON coins to our contract so that its balance is not zero. Contracts need to continually pay rent fees otherwise they risk being deleted. According to the [docs](https://ton.org/docs/develop/smart-contracts/fees#storage-fee), storage fees are about 4 TON per MB per year. Since our contract stores less than 1 KB, a balance of 0.01 TON should be enough for more than 2 years. In any case you can always check this in an explorer and send more TON to the contract if it runs low.

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step7.ts).

## Step 8: Deploy the contract on-chain

Communicating with the live network for the deployment will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

The deployment is going to cost gas and should be done through a wallet that will fund it. I'm assuming that you have some familiarity with TON wallets and how they're derived from 24 word secret mnemonics. If not, be sure to follow the previous tutorial in this series.

As you recall from the previous tutorial, TON wallets can come in multiple versions. The code below relies on "wallet v4 r2", if your wallet is different, either switch [Tonkeeper](https://tonkeeper.com) through "Settings" to this version, or modify the code below to use your version. Also remember to use a wallet works with the correct network you've chosen - testnet or mainnet.

Replace the current code in `scripts/deployCounter.ts` with a script that will use the interface class we have just written:

```ts
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class from step 7

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Before running this code, make sure you have enough TON in your wallet for the gas payments and the TON sent to the contract during the deploy.

Another thing to watch out for is collisions between different users of this tutorial. As you recall, if the code and initial data of two contracts are identical, they will have the same address. If all followers of this tutorial would choose initial counter value of `1` - then all of them would collide and only the first would actually deploy the contract. To make sure this doesn't happen, the code above initializes the counter value to the current number of milliseconds since the epoch (something like 1674253934361). This guarantees that your contract for deployment is unique.

To deploy a contract using our script, run the following command in the terminal and follow the on-screen instructions:

```console
npx blueprint run
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance. A common mistake is trying to use a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the previous tutorial, check your wallet address in an [explorer](https://tonscan.org) and if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

The script will print the newly deployed contract address - mine is `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb`. You can open your address in an [explorer](https://tonscan.org) to verify that the deploy went smoothly. This is what it should look like:

![](https://i.imgur.com/SLR7nmE.png)  

Write down your deployed contract address. We're going to use it in the next step.

## Step 9: Call a getter on the deployed contract

There are two ways to interact with a smart contract - calling a getter to read data from it or sending a message that can potentially change its state (write). We should support these interactions in the contract interface class that we created in step 7.

Anyone who wants to access the contract from TypeScript would simply use this interface class. This is excellent for separation of responsibilities within your team. The developer of the contract can provide this class to the developer of the client to abstract away implementation details such as how messages should be encoded in the binary level. Let's start with the getter.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

// }
```

Notice that methods in the interface class that call getters must start with the word `get`. This prefix is a requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) TypeScript library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step9.ts).

### Executing the call

Calling a getter is free and does not cost gas. The reason is that this call is read-only, so it does not require consensus by the validators and is not stored in a block on-chain for all eternity like transaction are.

Let's create a new script called `getCounter.ts` in the `scripts` folder and use our shiny interface class to make the call. We're going to emulate a different developer interacting with our contract and since the contract is already deployed, they are likely to access it by address. Be sure to replace my deployed contract address with yours in the code below:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "getCounter" from the list of available scripts.

```console
npx blueprint run
```

Make a note of the current counter value. After we send the increment message in the next step we would like to confirm that this value indeed increases by 1.

Another interesting thing to remember is that getters are only accessible off-chain, for example from a JavaScript client making a call through an RPC service provider. In particular, this means that contracts cannot call getters on other contracts.

## Step 10: Send a transaction to the deployed contract

Unlike getters that are read-only, messages can write and change contract state in storage. In our contract implementation we handled messages in `recv_internal()` and assigned op #1 = _increment_. Sending messages costs gas and requires payment in TON coin. The reason is that this operation is not read-only, so it requires waiting for consensus by the validators and is stored as a transaction in a block on-chain for all eternity. We will send less TON coin this time since this action is much cheaper than the deployment.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

// }
```

As you recall, the increment message is an [internal message](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) that is encoded by convention with a 32 bit unsigned int in the beginning to describe the op and a 64 bit unsigned int after to describe the query id. The query id is relevant for messages that expect a response message to be sent back (the request and the response share the same query id).

Notice that methods in the interface class that send messages must start with the word `send`, another prefix requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step10.ts).

### Executing the send

The messages can be sent from any TON wallet, not necessarily the deployer wallet. Create a new script `sendIncrement.ts` in the `scripts` folder and use your wallet to fund the send:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "sendIncrement" from the list of available scripts.

```console
npx blueprint run
```

Notice that the message will take a few seconds to be processed by validators and will only change contract state after it has been processed. The normal wait time is a block or two, since validators need to produce a new block that contains our sent transaction. The op that was sent above is #1 = _increment_, which means that after processing, the counter value will increase by 1. Verify this by re-running the script from step 9 to print the new counter value.

Messages can be sent to our contract by other contracts. This means a different contract can increment our counter. This allows the TON ecosystem to create composable apps and protocols that build on top of each other and interact in unforeseen ways.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQA4RIS6uxt1GZkTTr19Wy423NZtcG0pRy29lg55X-qYq-Tf) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACACZ_fWVyQMr&amount=50000000): ![QR-code](https://i.imgur.com/GEuOQjr.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/02-contract/test).

In this tutorial we handled the build and deploy processes manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have these processes managed automatically by an awesome dev tool called [Blueprint](https://github.com/ton-community/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 44, Images: 2, Headings: 23, Paragraphs: 101



================================================
FILE: docs/02-contract/mainnet-npmton.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/02-contract/mainnet-npmton.md
================================================

# TON Hello World part 2: Step by step guide for writing your first smart contract

A smart contract is simply a computer program running on TON Blockchain - or more exactly its [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) (TON Virtual Machine). The contract is made of code (compiled TVM instructions) and data (persistent state) that are stored in some address on TON Blockchain.

In the world of blockchain, *code is law*, meaning that instead of lawyers and papers, computer instructions define in absolute terms the rules of interaction between the different users of the contract. Before engaging with any smart contract as a user, you're expected to review its code and thus understand its terms of agreement. Accordingly, we'll make an effort to make our contract as easy to read as possible, so its users could understand what they're getting into.

## Dapps - decentralized applications

Smart contracts are a key part of *decentralized apps* - a special type of application invented in the blockchain era, that does not depend on any single entity to run it. Unlike the app Uber, for example, which depends on the company Uber Inc to run it - a *decentralized Uber* would allow riders and drivers to interact directly (order, pay for and fulfill rides) without any intermediary like Uber Inc. Dapps are also unstoppable - if we don't depend on anyone specific to run them, nobody can take them down.

Dapps on TON Blockchain are usually made of 2 main projects:

* Smart contracts in the [FunC](https://ton.org/docs/develop/func/overview) programming language that are deployed on-chain - these act as the *backend server* of the app, with a *database* for persistent storage.

* Web frontend for interacting with the dapp from a web browser - this acts as the *frontend* or *client*, normally with special support for Telegram messenger in the form of a [Telegram Web App](https://core.telegram.org/bots/webapps).

Throughout this series of tutorials, we will build a full dapp together and see detailed implementations of both projects.

## Step 1: Define our first smart contract

So what are we going to build? Our smart contract will be quite simple:

Its main feature is to hold a *counter*. The counter will start at some number, and allow users to send *increment* transactions to the contract, which will in turn increase the counter value by 1. The contract will also have a getter function that will allow any user to query the current value of the counter.

In later tutorials we will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

For convenience, our development environment will rely on several clever scripts for testing, compiling and deploying our code. The most convenient language for these scripts is JavaScript, executed by an engine called Node.js. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v18. You can verify your nodejs version by running `node -v` in terminal.

You will also need a decent IDE with FunC and TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com/) - it's free and open source. Also install the [FunC Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) to add syntax highlighting for the FunC language.

## Step 3: Set up the project

Let's open a terminal in the project directory where you want to place your project. When you run the following command, be sure to choose "Counter" as the contract name and select "an empty contract (FunC)" from the list of templates. This will help prevent any issues in the future.

```console
npm create ton@latest
```

This will create a new project with a preconfigured structure, which includes a workflow for developing, testing, and deploying smart contracts using the Blueprint SDK. The project structure will initially consist of four directories: `contracts`, `wrappers`, `tests`, and `scripts`. Later on, we will also create a `build` directory.

And finally, execute the following command to open a folder, allowing us to proceed with the tutorial:

```console
cd your_project_directory
```

## Step 4: Structuring our smart contract

Much like everything else in life, smart contracts in FunC are divided into 3 sections. These sections are: *storage*, *messages* and *getters*.

The **storage** section deals with our contract's persistent data. Our contract will have to store data between calls from different users, for example the value of our *counter* variable. To write this data to state storage, we will need a write/encode function and to read this data back from state storage, we will need a read/decode function.

The **messages** section deals with messages sent to our contract. The main form of interaction with contracts on TON Blockchain is by sending them messages. We mentioned before that our contract will need to support a variety of actions like *increment*, *deposit*, *withdraw* and *transfer ownership*. All of these operations are performed by users as transactions. These operations are not read-only because they change something in the contract's persistent state.

The **getters** section deals with read-only interactions that don't change state. For example, we would want to allow users to query the value of our *counter*, so we can implement a getter for that. We've also mentioned that the contract has a special *owner*, so what about a getter to query that. Since our contract can hold money (TON coins), another useful getter could be to query the current balance.

## Step 5: Implement the Counter contract

We're about to write our first lines in FunC! Our first task would be to implement the *counter* feature of our contract.

The FunC programming language is very similar to the [C language](https://en.wikipedia.org/wiki/C_(programming_language)). It has strict types, which is a good idea, since compilation errors will help us spot contract mistakes early on. The language was designed specifically for TON Blockchain, so you will not find a lot of documentation beyond the [official FunC docs](https://ton.org/docs/develop/func/overview).

Before the first section, please remember to keep the following line of code at the beginning of the file to import the standard library, as its absence can cause issues later on.

```func
#include "imports/stdlib.fc";
```

### Storage

Let's start with the first section, *storage*, and implement two utility functions (which we will use later) for reading and writing variables to the contract's persistent state - `load_data()` and `save_data()`. The primary variable will be the counter value. We must persist this value to storage because we need to remember it between calls. The appropriate type for our counter variable is `int`. Notice [in the docs](https://ton.org/docs/develop/func/types#atomic-types) that the `int` TVM runtime type is always 257 bit long (256 bit signed) so it can hold huge huge numbers - I'm pretty sure the universe has less than 2^256 atoms in it, so you'll never have a number so large that you can't fit in it. Storing the full 257 bits in blockchain storage is somewhat wasteful because the contract pays rent proportionally to the total amount of data it keeps. To optimize costs, let's keep in persistent storage just the lowest 64 bits - capping our counter's maximum value at 2^64 which should be enough:

```func
(int) load_data() inline {                 ;; read function declaration - returns int as result
  var ds = get_data().begin_parse();       ;; load the storage cell and start parsing as a slice
  return (ds~load_uint(64));               ;; read a 64 bit unsigned int from the slice and return it
}

() save_data(int counter) impure inline {  ;; write function declaration - takes an int as arg
  set_data(begin_cell()                    ;; store the storage cell and create it with a builder
    .store_uint(counter, 64)               ;; write a 64 bit unsigned int to the builder
    .end_cell());                          ;; convert the builder to a cell
}
```

The standard library functions `get_data()` and `set_data()` are documented [here](https://ton.org/docs/develop/func/stdlib#persistent-storage-save-and-load) and load/store the storage cell. We will cover [*cells*](https://ton.org/docs/develop/func/types#atomic-types) in detail in future posts of this series. Cells are read from using the [*slice*](https://ton.org/docs/develop/func/types#atomic-types) type (an array of bits) and written to using the [*builder*](https://ton.org/docs/develop/func/types#atomic-types) type. The various methods that you see are all taken from the [standard library](https://ton.org/docs/develop/func/stdlib). Also notice two interesting function modifiers that appear in the declarations - [*inline*](https://ton.org/docs/develop/func/functions#inline-specifier) and [*impure*](https://ton.org/docs/develop/func/functions#impure-specifier).

### Messages

Let's continue to the next section, *messages*, and implement the main message handler of our contract - `recv_internal()`. This is the primary entry point of our contract. It runs whenever a message is sent as a transaction to the contract by another contract or by a user's wallet contract:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Messages sent between contracts are called [internal messages](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages). TON also supports [external messages](https://ton.org/docs/develop/smart-contracts/messages) through the handler `recv_external()`, but as a dapp developer you're never expected to use them. External messages are used for very specific cases, mainly when implementing wallet contracts, that you would normally never have to write by yourself. You can safely ignore them.

Internal messages received by the contract may be empty. This is what happens for example when somebody sends TON coins to the contract from their wallet. This is useful for funding the contract so it can pay fees. In order to be able to receive those incoming transfers we will have to return successfully when an empty message arrives.

If an incoming message is not empty, the first thing to do is read its operation type. By convention, internal messages are [encoded](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) with a 32 bit unsigned int in the beginning that acts as operation type (op for short). We are free to assign any serial numbers we want to our different ops. In this case, we've assigned the number `1` to the *increment* action, which is handled by writing back to persistent state the current value counter plus 1.

### Getters

Our last section, as you recall, is *getters*. Let's implement a simple getter that will allow users to query the counter value:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

We can choose what input arguments the getter takes as input and what output it returns as result. Also notice the function modifier appearing in the declaration - [*method_id*](https://ton.org/docs/develop/func/functions#method_id). It is customary to place `method_id` on all getters.

That's it. We completed our 3 sections and the first version of our contract is ready. To get the complete code, simply concat the 3 snippets above and replace the existing code in `contracts/counter.fc`. This will be the FunC (`.fc` file extension) source file of our contract. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc).

## Step 6: Build the counter contract

Right now, the contract is just FunC source code. To get it to run on-chain, we need to convert it to TVM [bytecode](https://ton.org/docs/learn/tvm-instructions/instructions).

In TON, we don't compile FunC directly to bytecode, but instead go through another programming language called [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). Just like FunC, Fift is another language that was designed specifically for TON Blockchain. It's a low level language that is very close to TVM opcodes. For us regular mortals, Fift is not very useful, so unless you're planning on some extra advanced things, I believe you can safely ignore it for now.

Since we're using func-js for building, it would be a good idea to create a directory where we can store the build result. To do this, open the terminal and run the following command:

```console
mkdir build
```

The func-js package contains everything we need to compile our contract to bytecode. To use it, open terminal in the project directory and run the following:

```console
npx func-js contracts/counter.fc --boc build/counter.cell
```

The build should succeed, with the output of this command being a new file - `counter.cell`. This is a binary file that finally contains the TVM bytecode in cell format that is ready to be deployed on-chain. This will actually be the only file we need for deployment moving forward (we won't need the FunC source file).

## Step 7: Prepare init data for deploying on-chain

Now that our contract has been compiled to bytecode, we can finally see it in action running on-chain. The act of uploading the bytecode to the blockchain is called *deployment*. The deployment result would be an address where the contract resides. This address will allow us to communicate with this specific contract instance later on and send it transactions.

There are two variations of TON Blockchain we can deploy to - *mainnet* and *testnet*. We covered both in the previous tutorial. Personally, I almost never deploy to testnet. There are far better ways to gain confidence that my code is working as expected. The primary of which is writing a dedicated *test suite*. We will cover this in detail in one of the next tutorials. For now, let's assume the code is working perfectly and no further debugging is required.

### Init arguments

The new address of our deployed contract in TON depends on only two things - the deployed bytecode (initial code) and the initial contract storage (initial data). You can say that the address is some derivation of the hash of both. If two different developers were to deploy the exact same code with the exact same initialization data, they would collide.

The bytecode part is easy, we have that ready as a cell in the file `counter.cell` that we compiled in step 6. Now what about the initial contract storage? As you recall, the format of our persistent storage data was decided when we implemented the function `save_data()` of our contract FunC source. Our storage layout was very simple - just one unsigned int of 64 bit holding the counter value. Therefore, to initialize our contract, we would need to generate a data cell holding some arbitrary initial uint64 value - for example the number `1`.

### Interface class

The recommended way to interact with contracts is to create a small TypeScript class that will implement the interaction interface with the contract. We're using the project structure created by Blueprint, but we're still working on low-level aspects.
Use the following code in `wrappers/Counter.ts` to create the initial data cell for deployment:

```ts
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
}
```

Notice a few interesting things about this TypeScript code. First, it depends on the package [@ton/core](https://www.npmjs.com/package/@ton/core) instead of [@ton/ton](https://www.npmjs.com/package/@ton/ton), which contains a small subset of base types and is therefore slower to change - an important feature when building a stable interface for our contract. Second, the code that creates the data cell mimics the FunC API and is almost identical to our `save_data()` FunC function. Third, we can see the derivation of the contract address from the code cell and data cell using the function `contractAddress`.

The actual deployment involves sending the first message that will cause our contract to be deployed. We can piggyback any message that is directed towards our contract. This can even be the increment message with op #1, but we will do something simpler. We will just send some TON coins to our contract (an empty message) and piggyback that. Let's make this part of our interface. Add the function `sendDeploy()` to `wrappers/Counter.ts` - this function will send the deployment message:

```ts
// export default class Counter implements Contract {

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

// }
```

In every deployment we need to send some TON coins to our contract so that its balance is not zero. Contracts need to continually pay rent fees otherwise they risk being deleted. According to the [docs](https://ton.org/docs/develop/smart-contracts/fees#storage-fee), storage fees are about 4 TON per MB per year. Since our contract stores less than 1 KB, a balance of 0.01 TON should be enough for more than 2 years. In any case you can always check this in an explorer and send more TON to the contract if it runs low.

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step7.ts).

## Step 8: Deploy the contract on-chain

Communicating with the live network for the deployment will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

The deployment is going to cost gas and should be done through a wallet that will fund it. I'm assuming that you have some familiarity with TON wallets and how they're derived from 24 word secret mnemonics. If not, be sure to follow the previous tutorial in this series.

As you recall from the previous tutorial, TON wallets can come in multiple versions. The code below relies on "wallet v4 r2", if your wallet is different, either switch [Tonkeeper](https://tonkeeper.com) through "Settings" to this version, or modify the code below to use your version. Also remember to use a wallet works with the correct network you've chosen - testnet or mainnet.

Replace the current code in `scripts/deployCounter.ts` with a script that will use the interface class we have just written:

```ts
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class from step 7

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Before running this code, make sure you have enough TON in your wallet for the gas payments and the TON sent to the contract during the deploy.

Another thing to watch out for is collisions between different users of this tutorial. As you recall, if the code and initial data of two contracts are identical, they will have the same address. If all followers of this tutorial would choose initial counter value of `1` - then all of them would collide and only the first would actually deploy the contract. To make sure this doesn't happen, the code above initializes the counter value to the current number of milliseconds since the epoch (something like 1674253934361). This guarantees that your contract for deployment is unique.

To deploy a contract using our script, run the following command in the terminal and follow the on-screen instructions:

```console
npx blueprint run
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance. A common mistake is trying to use a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the previous tutorial, check your wallet address in an [explorer](https://tonscan.org) and if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

The script will print the newly deployed contract address - mine is `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb`. You can open your address in an [explorer](https://tonscan.org) to verify that the deploy went smoothly. This is what it should look like:

<img src="https://i.imgur.com/SLR7nmE.png" width=600 /><br>

Write down your deployed contract address. We're going to use it in the next step.

## Step 9: Call a getter on the deployed contract

There are two ways to interact with a smart contract - calling a getter to read data from it or sending a message that can potentially change its state (write). We should support these interactions in the contract interface class that we created in step 7.

Anyone who wants to access the contract from TypeScript would simply use this interface class. This is excellent for separation of responsibilities within your team. The developer of the contract can provide this class to the developer of the client to abstract away implementation details such as how messages should be encoded in the binary level. Let's start with the getter.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

// }
```

Notice that methods in the interface class that call getters must start with the word `get`. This prefix is a requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) TypeScript library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step9.ts).

### Executing the call

Calling a getter is free and does not cost gas. The reason is that this call is read-only, so it does not require consensus by the validators and is not stored in a block on-chain for all eternity like transaction are.

Let's create a new script called `getCounter.ts` in the `scripts` folder and use our shiny interface class to make the call. We're going to emulate a different developer interacting with our contract and since the contract is already deployed, they are likely to access it by address. Be sure to replace my deployed contract address with yours in the code below:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "getCounter" from the list of available scripts.

```console
npx blueprint run
```

Make a note of the current counter value. After we send the increment message in the next step we would like to confirm that this value indeed increases by 1.

Another interesting thing to remember is that getters are only accessible off-chain, for example from a JavaScript client making a call through an RPC service provider. In particular, this means that contracts cannot call getters on other contracts.

## Step 10: Send a transaction to the deployed contract

Unlike getters that are read-only, messages can write and change contract state in storage. In our contract implementation we handled messages in `recv_internal()` and assigned op #1 = *increment*. Sending messages costs gas and requires payment in TON coin. The reason is that this operation is not read-only, so it requires waiting for consensus by the validators and is stored as a transaction in a block on-chain for all eternity. We will send less TON coin this time since this action is much cheaper than the deployment.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

// }
```

As you recall, the increment message is an [internal message](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) that is encoded by convention with a 32 bit unsigned int in the beginning to describe the op and a 64 bit unsigned int after to describe the query id. The query id is relevant for messages that expect a response message to be sent back (the request and the response share the same query id).

Notice that methods in the interface class that send messages must start with the word `send`, another prefix requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step10.ts).

### Executing the send

The messages can be sent from any TON wallet, not necessarily the deployer wallet. Create a new script `sendIncrement.ts` in the `scripts` folder and use your wallet to fund the send:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "sendIncrement" from the list of available scripts.

```console
npx blueprint run
```

Notice that the message will take a few seconds to be processed by validators and will only change contract state after it has been processed. The normal wait time is a block or two, since validators need to produce a new block that contains our sent transaction. The op that was sent above is #1 = *increment*, which means that after processing, the counter value will increase by 1. Verify this by re-running the script from step 9 to print the new counter value.

Messages can be sent to our contract by other contracts. This means a different contract can increment our counter. This allows the TON ecosystem to create composable apps and protocols that build on top of each other and interact in unforeseen ways.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQA4RIS6uxt1GZkTTr19Wy423NZtcG0pRy29lg55X-qYq-Tf">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/2-smart/video.mp4" type="video/mp4">
</video>

Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACACZ_fWVyQMr&amount=50000000">here</a>:
<img src="https://i.imgur.com/GEuOQjr.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/02-contract/test).

In this tutorial we handled the build and deploy processes manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have these processes managed automatically by an awesome dev tool called [Blueprint](https://github.com/ton-community/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/02-contract/options.json
URL: https://github.com/ton-community/tutorials/blob/main/docs/02-contract/options.json
================================================
{
  "network": {
    "name": "Network",
    "order": 1,
    "default": "testnet",
    "options": {
      "testnet": {
        "name": "Testnet",
        "order": 1,
        "url": "https://ton.org/docs/develop/smart-contracts/environment/testnet",
        "pros": "free to use",
        "cons": "less reliable, requires special wallets"
      },
      "mainnet": {
        "name": "Mainnet",
        "url": "https://tonmon.xyz/?orgId=1&refresh=5m",
        "order": 2,
        "pros": "very reliable, fast, works with all wallets",
        "cons": "not free to use (but very cheap)"
      }
    }
  },
  "library": {
    "name": "Library",
    "order": 2,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      }
    }
  }
}


================================================
FILE: docs/02-contract/testnet-npmton.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/02-contract/testnet-npmton.html
================================================
[HTML Document converted to Markdown]

File: testnet-npmton.html
Size: 36.85 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 2: Step by step guide for writing your first smart contract

A smart contract is simply a computer program running on TON Blockchain - or more exactly its [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) (TON Virtual Machine). The contract is made of code (compiled TVM instructions) and data (persistent state) that are stored in some address on TON Blockchain.

In the world of blockchain, _code is law_, meaning that instead of lawyers and papers, computer instructions define in absolute terms the rules of interaction between the different users of the contract. Before engaging with any smart contract as a user, you're expected to review its code and thus understand its terms of agreement. Accordingly, we'll make an effort to make our contract as easy to read as possible, so its users could understand what they're getting into.

## Dapps - decentralized applications

Smart contracts are a key part of _decentralized apps_ - a special type of application invented in the blockchain era, that does not depend on any single entity to run it. Unlike the app Uber, for example, which depends on the company Uber Inc to run it - a _decentralized Uber_ would allow riders and drivers to interact directly (order, pay for and fulfill rides) without any intermediary like Uber Inc. Dapps are also unstoppable - if we don't depend on anyone specific to run them, nobody can take them down.

Dapps on TON Blockchain are usually made of 2 main projects:

-   Smart contracts in the [FunC](https://ton.org/docs/develop/func/overview) programming language that are deployed on-chain - these act as the _backend server_ of the app, with a _database_ for persistent storage.
    
-   Web frontend for interacting with the dapp from a web browser - this acts as the _frontend_ or _client_, normally with special support for Telegram messenger in the form of a [Telegram Web App](https://core.telegram.org/bots/webapps).
    

Throughout this series of tutorials, we will build a full dapp together and see detailed implementations of both projects.

## Step 1: Define our first smart contract

So what are we going to build? Our smart contract will be quite simple:

Its main feature is to hold a _counter_. The counter will start at some number, and allow users to send _increment_ transactions to the contract, which will in turn increase the counter value by 1. The contract will also have a getter function that will allow any user to query the current value of the counter.

In later tutorials we will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

For convenience, our development environment will rely on several clever scripts for testing, compiling and deploying our code. The most convenient language for these scripts is JavaScript, executed by an engine called Node.js. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v18. You can verify your nodejs version by running `node -v` in terminal.

You will also need a decent IDE with FunC and TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com/) - it's free and open source. Also install the [FunC Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) to add syntax highlighting for the FunC language.

## Step 3: Set up the project

Let's open a terminal in the project directory where you want to place your project. When you run the following command, be sure to choose "Counter" as the contract name and select "an empty contract (FunC)" from the list of templates. This will help prevent any issues in the future.

```console
npm create ton@latest
```

This will create a new project with a preconfigured structure, which includes a workflow for developing, testing, and deploying smart contracts using the Blueprint SDK. The project structure will initially consist of four directories: `contracts`, `wrappers`, `tests`, and `scripts`. Later on, we will also create a `build` directory.

And finally, execute the following command to open a folder, allowing us to proceed with the tutorial:

```console
cd your_project_directory
```

## Step 4: Structuring our smart contract

Much like everything else in life, smart contracts in FunC are divided into 3 sections. These sections are: _storage_, _messages_ and _getters_.

The **storage** section deals with our contract's persistent data. Our contract will have to store data between calls from different users, for example the value of our _counter_ variable. To write this data to state storage, we will need a write/encode function and to read this data back from state storage, we will need a read/decode function.

The **messages** section deals with messages sent to our contract. The main form of interaction with contracts on TON Blockchain is by sending them messages. We mentioned before that our contract will need to support a variety of actions like _increment_, _deposit_, _withdraw_ and _transfer ownership_. All of these operations are performed by users as transactions. These operations are not read-only because they change something in the contract's persistent state.

The **getters** section deals with read-only interactions that don't change state. For example, we would want to allow users to query the value of our _counter_, so we can implement a getter for that. We've also mentioned that the contract has a special _owner_, so what about a getter to query that. Since our contract can hold money (TON coins), another useful getter could be to query the current balance.

## Step 5: Implement the Counter contract

We're about to write our first lines in FunC! Our first task would be to implement the _counter_ feature of our contract.

The FunC programming language is very similar to the [C language](https://en.wikipedia.org/wiki/C_\(programming_language\)). It has strict types, which is a good idea, since compilation errors will help us spot contract mistakes early on. The language was designed specifically for TON Blockchain, so you will not find a lot of documentation beyond the [official FunC docs](https://ton.org/docs/develop/func/overview).

Before the first section, please remember to keep the following line of code at the beginning of the file to import the standard library, as its absence can cause issues later on.

```func
#include "imports/stdlib.fc";
```

### Storage

Let's start with the first section, _storage_, and implement two utility functions (which we will use later) for reading and writing variables to the contract's persistent state - `load_data()` and `save_data()`. The primary variable will be the counter value. We must persist this value to storage because we need to remember it between calls. The appropriate type for our counter variable is `int`. Notice [in the docs](https://ton.org/docs/develop/func/types#atomic-types) that the `int` TVM runtime type is always 257 bit long (256 bit signed) so it can hold huge huge numbers - I'm pretty sure the universe has less than 2^256 atoms in it, so you'll never have a number so large that you can't fit in it. Storing the full 257 bits in blockchain storage is somewhat wasteful because the contract pays rent proportionally to the total amount of data it keeps. To optimize costs, let's keep in persistent storage just the lowest 64 bits - capping our counter's maximum value at 2^64 which should be enough:

```func
(int) load_data() inline {                 ;; read function declaration - returns int as result
  var ds = get_data().begin_parse();       ;; load the storage cell and start parsing as a slice
  return (ds~load_uint(64));               ;; read a 64 bit unsigned int from the slice and return it
}

() save_data(int counter) impure inline {  ;; write function declaration - takes an int as arg
  set_data(begin_cell()                    ;; store the storage cell and create it with a builder
    .store_uint(counter, 64)               ;; write a 64 bit unsigned int to the builder
    .end_cell());                          ;; convert the builder to a cell
}
```

The standard library functions `get_data()` and `set_data()` are documented [here](https://ton.org/docs/develop/func/stdlib#persistent-storage-save-and-load) and load/store the storage cell. We will cover [_cells_](https://ton.org/docs/develop/func/types#atomic-types) in detail in future posts of this series. Cells are read from using the [_slice_](https://ton.org/docs/develop/func/types#atomic-types) type (an array of bits) and written to using the [_builder_](https://ton.org/docs/develop/func/types#atomic-types) type. The various methods that you see are all taken from the [standard library](https://ton.org/docs/develop/func/stdlib). Also notice two interesting function modifiers that appear in the declarations - [_inline_](https://ton.org/docs/develop/func/functions#inline-specifier) and [_impure_](https://ton.org/docs/develop/func/functions#impure-specifier).

### Messages

Let's continue to the next section, _messages_, and implement the main message handler of our contract - `recv_internal()`. This is the primary entry point of our contract. It runs whenever a message is sent as a transaction to the contract by another contract or by a user's wallet contract:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Messages sent between contracts are called [internal messages](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages). TON also supports [external messages](https://ton.org/docs/develop/smart-contracts/messages) through the handler `recv_external()`, but as a dapp developer you're never expected to use them. External messages are used for very specific cases, mainly when implementing wallet contracts, that you would normally never have to write by yourself. You can safely ignore them.

Internal messages received by the contract may be empty. This is what happens for example when somebody sends TON coins to the contract from their wallet. This is useful for funding the contract so it can pay fees. In order to be able to receive those incoming transfers we will have to return successfully when an empty message arrives.

If an incoming message is not empty, the first thing to do is read its operation type. By convention, internal messages are [encoded](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) with a 32 bit unsigned int in the beginning that acts as operation type (op for short). We are free to assign any serial numbers we want to our different ops. In this case, we've assigned the number `1` to the _increment_ action, which is handled by writing back to persistent state the current value counter plus 1.

### Getters

Our last section, as you recall, is _getters_. Let's implement a simple getter that will allow users to query the counter value:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

We can choose what input arguments the getter takes as input and what output it returns as result. Also notice the function modifier appearing in the declaration - [_method\_id_](https://ton.org/docs/develop/func/functions#method_id). It is customary to place `method_id` on all getters.

That's it. We completed our 3 sections and the first version of our contract is ready. To get the complete code, simply concat the 3 snippets above and replace the existing code in `contracts/counter.fc`. This will be the FunC (`.fc` file extension) source file of our contract. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc).

## Step 6: Build the counter contract

Right now, the contract is just FunC source code. To get it to run on-chain, we need to convert it to TVM [bytecode](https://ton.org/docs/learn/tvm-instructions/instructions).

In TON, we don't compile FunC directly to bytecode, but instead go through another programming language called [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). Just like FunC, Fift is another language that was designed specifically for TON Blockchain. It's a low level language that is very close to TVM opcodes. For us regular mortals, Fift is not very useful, so unless you're planning on some extra advanced things, I believe you can safely ignore it for now.

Since we're using func-js for building, it would be a good idea to create a directory where we can store the build result. To do this, open the terminal and run the following command:

```console
mkdir build
```

The func-js package contains everything we need to compile our contract to bytecode. To use it, open terminal in the project directory and run the following:

```console
npx func-js contracts/counter.fc --boc build/counter.cell
```

The build should succeed, with the output of this command being a new file - `counter.cell`. This is a binary file that finally contains the TVM bytecode in cell format that is ready to be deployed on-chain. This will actually be the only file we need for deployment moving forward (we won't need the FunC source file).

## Step 7: Prepare init data for deploying on-chain

Now that our contract has been compiled to bytecode, we can finally see it in action running on-chain. The act of uploading the bytecode to the blockchain is called _deployment_. The deployment result would be an address where the contract resides. This address will allow us to communicate with this specific contract instance later on and send it transactions.

There are two variations of TON Blockchain we can deploy to - _mainnet_ and _testnet_. We covered both in the previous tutorial. Personally, I almost never deploy to testnet. There are far better ways to gain confidence that my code is working as expected. The primary of which is writing a dedicated _test suite_. We will cover this in detail in one of the next tutorials. For now, let's assume the code is working perfectly and no further debugging is required.

### Init arguments

The new address of our deployed contract in TON depends on only two things - the deployed bytecode (initial code) and the initial contract storage (initial data). You can say that the address is some derivation of the hash of both. If two different developers were to deploy the exact same code with the exact same initialization data, they would collide.

The bytecode part is easy, we have that ready as a cell in the file `counter.cell` that we compiled in step 6. Now what about the initial contract storage? As you recall, the format of our persistent storage data was decided when we implemented the function `save_data()` of our contract FunC source. Our storage layout was very simple - just one unsigned int of 64 bit holding the counter value. Therefore, to initialize our contract, we would need to generate a data cell holding some arbitrary initial uint64 value - for example the number `1`.

### Interface class

The recommended way to interact with contracts is to create a small TypeScript class that will implement the interaction interface with the contract. We're using the project structure created by Blueprint, but we're still working on low-level aspects. Use the following code in `wrappers/Counter.ts` to create the initial data cell for deployment:

```ts
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
}
```

Notice a few interesting things about this TypeScript code. First, it depends on the package [@ton/core](https://www.npmjs.com/package/@ton/core) instead of [@ton/ton](https://www.npmjs.com/package/@ton/ton), which contains a small subset of base types and is therefore slower to change - an important feature when building a stable interface for our contract. Second, the code that creates the data cell mimics the FunC API and is almost identical to our `save_data()` FunC function. Third, we can see the derivation of the contract address from the code cell and data cell using the function `contractAddress`.

The actual deployment involves sending the first message that will cause our contract to be deployed. We can piggyback any message that is directed towards our contract. This can even be the increment message with op #1, but we will do something simpler. We will just send some TON coins to our contract (an empty message) and piggyback that. Let's make this part of our interface. Add the function `sendDeploy()` to `wrappers/Counter.ts` - this function will send the deployment message:

```ts
// export default class Counter implements Contract {

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

// }
```

In every deployment we need to send some TON coins to our contract so that its balance is not zero. Contracts need to continually pay rent fees otherwise they risk being deleted. According to the [docs](https://ton.org/docs/develop/smart-contracts/fees#storage-fee), storage fees are about 4 TON per MB per year. Since our contract stores less than 1 KB, a balance of 0.01 TON should be enough for more than 2 years. In any case you can always check this in an explorer and send more TON to the contract if it runs low.

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step7.ts).

## Step 8: Deploy the contract on-chain

Communicating with the live network for the deployment will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

The deployment is going to cost gas and should be done through a wallet that will fund it. I'm assuming that you have some familiarity with TON wallets and how they're derived from 24 word secret mnemonics. If not, be sure to follow the previous tutorial in this series.

As you recall from the previous tutorial, TON wallets can come in multiple versions. The code below relies on "wallet v4 r2", if your wallet is different, either switch [Tonkeeper](https://tonkeeper.com) through "Settings" to this version, or modify the code below to use your version. Also remember to use a wallet works with the correct network you've chosen - testnet or mainnet.

Replace the current code in `scripts/deployCounter.ts` with a script that will use the interface class we have just written:

```ts
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class from step 7

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Before running this code, make sure you have enough TON in your wallet for the gas payments and the TON sent to the contract during the deploy.

Another thing to watch out for is collisions between different users of this tutorial. As you recall, if the code and initial data of two contracts are identical, they will have the same address. If all followers of this tutorial would choose initial counter value of `1` - then all of them would collide and only the first would actually deploy the contract. To make sure this doesn't happen, the code above initializes the counter value to the current number of milliseconds since the epoch (something like 1674253934361). This guarantees that your contract for deployment is unique.

To deploy a contract using our script, run the following command in the terminal and follow the on-screen instructions:

```console
npx blueprint run
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance. A common mistake is trying to use a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the previous tutorial, check your wallet address in an [explorer](https://testnet.tonscan.org) and if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

The script will print the newly deployed contract address - mine is `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb`. You can open your address in an [explorer](https://testnet.tonscan.org) to verify that the deploy went smoothly. This is what it should look like:

![](https://i.imgur.com/SLR7nmE.png)  

Write down your deployed contract address. We're going to use it in the next step.

## Step 9: Call a getter on the deployed contract

There are two ways to interact with a smart contract - calling a getter to read data from it or sending a message that can potentially change its state (write). We should support these interactions in the contract interface class that we created in step 7.

Anyone who wants to access the contract from TypeScript would simply use this interface class. This is excellent for separation of responsibilities within your team. The developer of the contract can provide this class to the developer of the client to abstract away implementation details such as how messages should be encoded in the binary level. Let's start with the getter.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

// }
```

Notice that methods in the interface class that call getters must start with the word `get`. This prefix is a requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) TypeScript library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step9.ts).

### Executing the call

Calling a getter is free and does not cost gas. The reason is that this call is read-only, so it does not require consensus by the validators and is not stored in a block on-chain for all eternity like transaction are.

Let's create a new script called `getCounter.ts` in the `scripts` folder and use our shiny interface class to make the call. We're going to emulate a different developer interacting with our contract and since the contract is already deployed, they are likely to access it by address. Be sure to replace my deployed contract address with yours in the code below:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "getCounter" from the list of available scripts.

```console
npx blueprint run
```

Make a note of the current counter value. After we send the increment message in the next step we would like to confirm that this value indeed increases by 1.

Another interesting thing to remember is that getters are only accessible off-chain, for example from a JavaScript client making a call through an RPC service provider. In particular, this means that contracts cannot call getters on other contracts.

## Step 10: Send a transaction to the deployed contract

Unlike getters that are read-only, messages can write and change contract state in storage. In our contract implementation we handled messages in `recv_internal()` and assigned op #1 = _increment_. Sending messages costs gas and requires payment in TON coin. The reason is that this operation is not read-only, so it requires waiting for consensus by the validators and is stored as a transaction in a block on-chain for all eternity. We will send less TON coin this time since this action is much cheaper than the deployment.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

// }
```

As you recall, the increment message is an [internal message](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) that is encoded by convention with a 32 bit unsigned int in the beginning to describe the op and a 64 bit unsigned int after to describe the query id. The query id is relevant for messages that expect a response message to be sent back (the request and the response share the same query id).

Notice that methods in the interface class that send messages must start with the word `send`, another prefix requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step10.ts).

### Executing the send

The messages can be sent from any TON wallet, not necessarily the deployer wallet. Create a new script `sendIncrement.ts` in the `scripts` folder and use your wallet to fund the send:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "sendIncrement" from the list of available scripts.

```console
npx blueprint run
```

Notice that the message will take a few seconds to be processed by validators and will only change contract state after it has been processed. The normal wait time is a block or two, since validators need to produce a new block that contains our sent transaction. The op that was sent above is #1 = _increment_, which means that after processing, the counter value will increase by 1. Verify this by re-running the script from step 9 to print the new counter value.

Messages can be sent to our contract by other contracts. This means a different contract can increment our counter. This allows the TON ecosystem to create composable apps and protocols that build on top of each other and interact in unforeseen ways.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQA4RIS6uxt1GZkTTr19Wy423NZtcG0pRy29lg55X-qYq-Tf) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACACZ_fWVyQMr&amount=50000000): ![QR-code](https://i.imgur.com/GEuOQjr.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/02-contract/test).

In this tutorial we handled the build and deploy processes manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have these processes managed automatically by an awesome dev tool called [Blueprint](https://github.com/ton-community/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 44, Images: 2, Headings: 23, Paragraphs: 101



================================================
FILE: docs/02-contract/testnet-npmton.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/02-contract/testnet-npmton.md
================================================

# TON Hello World part 2: Step by step guide for writing your first smart contract

A smart contract is simply a computer program running on TON Blockchain - or more exactly its [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) (TON Virtual Machine). The contract is made of code (compiled TVM instructions) and data (persistent state) that are stored in some address on TON Blockchain.

In the world of blockchain, *code is law*, meaning that instead of lawyers and papers, computer instructions define in absolute terms the rules of interaction between the different users of the contract. Before engaging with any smart contract as a user, you're expected to review its code and thus understand its terms of agreement. Accordingly, we'll make an effort to make our contract as easy to read as possible, so its users could understand what they're getting into.

## Dapps - decentralized applications

Smart contracts are a key part of *decentralized apps* - a special type of application invented in the blockchain era, that does not depend on any single entity to run it. Unlike the app Uber, for example, which depends on the company Uber Inc to run it - a *decentralized Uber* would allow riders and drivers to interact directly (order, pay for and fulfill rides) without any intermediary like Uber Inc. Dapps are also unstoppable - if we don't depend on anyone specific to run them, nobody can take them down.

Dapps on TON Blockchain are usually made of 2 main projects:

* Smart contracts in the [FunC](https://ton.org/docs/develop/func/overview) programming language that are deployed on-chain - these act as the *backend server* of the app, with a *database* for persistent storage.

* Web frontend for interacting with the dapp from a web browser - this acts as the *frontend* or *client*, normally with special support for Telegram messenger in the form of a [Telegram Web App](https://core.telegram.org/bots/webapps).

Throughout this series of tutorials, we will build a full dapp together and see detailed implementations of both projects.

## Step 1: Define our first smart contract

So what are we going to build? Our smart contract will be quite simple:

Its main feature is to hold a *counter*. The counter will start at some number, and allow users to send *increment* transactions to the contract, which will in turn increase the counter value by 1. The contract will also have a getter function that will allow any user to query the current value of the counter.

In later tutorials we will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

For convenience, our development environment will rely on several clever scripts for testing, compiling and deploying our code. The most convenient language for these scripts is JavaScript, executed by an engine called Node.js. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v18. You can verify your nodejs version by running `node -v` in terminal.

You will also need a decent IDE with FunC and TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com/) - it's free and open source. Also install the [FunC Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) to add syntax highlighting for the FunC language.

## Step 3: Set up the project

Let's open a terminal in the project directory where you want to place your project. When you run the following command, be sure to choose "Counter" as the contract name and select "an empty contract (FunC)" from the list of templates. This will help prevent any issues in the future.

```console
npm create ton@latest
```

This will create a new project with a preconfigured structure, which includes a workflow for developing, testing, and deploying smart contracts using the Blueprint SDK. The project structure will initially consist of four directories: `contracts`, `wrappers`, `tests`, and `scripts`. Later on, we will also create a `build` directory.

And finally, execute the following command to open a folder, allowing us to proceed with the tutorial:

```console
cd your_project_directory
```

## Step 4: Structuring our smart contract

Much like everything else in life, smart contracts in FunC are divided into 3 sections. These sections are: *storage*, *messages* and *getters*.

The **storage** section deals with our contract's persistent data. Our contract will have to store data between calls from different users, for example the value of our *counter* variable. To write this data to state storage, we will need a write/encode function and to read this data back from state storage, we will need a read/decode function.

The **messages** section deals with messages sent to our contract. The main form of interaction with contracts on TON Blockchain is by sending them messages. We mentioned before that our contract will need to support a variety of actions like *increment*, *deposit*, *withdraw* and *transfer ownership*. All of these operations are performed by users as transactions. These operations are not read-only because they change something in the contract's persistent state.

The **getters** section deals with read-only interactions that don't change state. For example, we would want to allow users to query the value of our *counter*, so we can implement a getter for that. We've also mentioned that the contract has a special *owner*, so what about a getter to query that. Since our contract can hold money (TON coins), another useful getter could be to query the current balance.

## Step 5: Implement the Counter contract

We're about to write our first lines in FunC! Our first task would be to implement the *counter* feature of our contract.

The FunC programming language is very similar to the [C language](https://en.wikipedia.org/wiki/C_(programming_language)). It has strict types, which is a good idea, since compilation errors will help us spot contract mistakes early on. The language was designed specifically for TON Blockchain, so you will not find a lot of documentation beyond the [official FunC docs](https://ton.org/docs/develop/func/overview).

Before the first section, please remember to keep the following line of code at the beginning of the file to import the standard library, as its absence can cause issues later on.

```func
#include "imports/stdlib.fc";
```

### Storage

Let's start with the first section, *storage*, and implement two utility functions (which we will use later) for reading and writing variables to the contract's persistent state - `load_data()` and `save_data()`. The primary variable will be the counter value. We must persist this value to storage because we need to remember it between calls. The appropriate type for our counter variable is `int`. Notice [in the docs](https://ton.org/docs/develop/func/types#atomic-types) that the `int` TVM runtime type is always 257 bit long (256 bit signed) so it can hold huge huge numbers - I'm pretty sure the universe has less than 2^256 atoms in it, so you'll never have a number so large that you can't fit in it. Storing the full 257 bits in blockchain storage is somewhat wasteful because the contract pays rent proportionally to the total amount of data it keeps. To optimize costs, let's keep in persistent storage just the lowest 64 bits - capping our counter's maximum value at 2^64 which should be enough:

```func
(int) load_data() inline {                 ;; read function declaration - returns int as result
  var ds = get_data().begin_parse();       ;; load the storage cell and start parsing as a slice
  return (ds~load_uint(64));               ;; read a 64 bit unsigned int from the slice and return it
}

() save_data(int counter) impure inline {  ;; write function declaration - takes an int as arg
  set_data(begin_cell()                    ;; store the storage cell and create it with a builder
    .store_uint(counter, 64)               ;; write a 64 bit unsigned int to the builder
    .end_cell());                          ;; convert the builder to a cell
}
```

The standard library functions `get_data()` and `set_data()` are documented [here](https://ton.org/docs/develop/func/stdlib#persistent-storage-save-and-load) and load/store the storage cell. We will cover [*cells*](https://ton.org/docs/develop/func/types#atomic-types) in detail in future posts of this series. Cells are read from using the [*slice*](https://ton.org/docs/develop/func/types#atomic-types) type (an array of bits) and written to using the [*builder*](https://ton.org/docs/develop/func/types#atomic-types) type. The various methods that you see are all taken from the [standard library](https://ton.org/docs/develop/func/stdlib). Also notice two interesting function modifiers that appear in the declarations - [*inline*](https://ton.org/docs/develop/func/functions#inline-specifier) and [*impure*](https://ton.org/docs/develop/func/functions#impure-specifier).

### Messages

Let's continue to the next section, *messages*, and implement the main message handler of our contract - `recv_internal()`. This is the primary entry point of our contract. It runs whenever a message is sent as a transaction to the contract by another contract or by a user's wallet contract:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Messages sent between contracts are called [internal messages](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages). TON also supports [external messages](https://ton.org/docs/develop/smart-contracts/messages) through the handler `recv_external()`, but as a dapp developer you're never expected to use them. External messages are used for very specific cases, mainly when implementing wallet contracts, that you would normally never have to write by yourself. You can safely ignore them.

Internal messages received by the contract may be empty. This is what happens for example when somebody sends TON coins to the contract from their wallet. This is useful for funding the contract so it can pay fees. In order to be able to receive those incoming transfers we will have to return successfully when an empty message arrives.

If an incoming message is not empty, the first thing to do is read its operation type. By convention, internal messages are [encoded](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) with a 32 bit unsigned int in the beginning that acts as operation type (op for short). We are free to assign any serial numbers we want to our different ops. In this case, we've assigned the number `1` to the *increment* action, which is handled by writing back to persistent state the current value counter plus 1.

### Getters

Our last section, as you recall, is *getters*. Let's implement a simple getter that will allow users to query the counter value:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

We can choose what input arguments the getter takes as input and what output it returns as result. Also notice the function modifier appearing in the declaration - [*method_id*](https://ton.org/docs/develop/func/functions#method_id). It is customary to place `method_id` on all getters.

That's it. We completed our 3 sections and the first version of our contract is ready. To get the complete code, simply concat the 3 snippets above and replace the existing code in `contracts/counter.fc`. This will be the FunC (`.fc` file extension) source file of our contract. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.fc).

## Step 6: Build the counter contract

Right now, the contract is just FunC source code. To get it to run on-chain, we need to convert it to TVM [bytecode](https://ton.org/docs/learn/tvm-instructions/instructions).

In TON, we don't compile FunC directly to bytecode, but instead go through another programming language called [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). Just like FunC, Fift is another language that was designed specifically for TON Blockchain. It's a low level language that is very close to TVM opcodes. For us regular mortals, Fift is not very useful, so unless you're planning on some extra advanced things, I believe you can safely ignore it for now.

Since we're using func-js for building, it would be a good idea to create a directory where we can store the build result. To do this, open the terminal and run the following command:

```console
mkdir build
```

The func-js package contains everything we need to compile our contract to bytecode. To use it, open terminal in the project directory and run the following:

```console
npx func-js contracts/counter.fc --boc build/counter.cell
```

The build should succeed, with the output of this command being a new file - `counter.cell`. This is a binary file that finally contains the TVM bytecode in cell format that is ready to be deployed on-chain. This will actually be the only file we need for deployment moving forward (we won't need the FunC source file).

## Step 7: Prepare init data for deploying on-chain

Now that our contract has been compiled to bytecode, we can finally see it in action running on-chain. The act of uploading the bytecode to the blockchain is called *deployment*. The deployment result would be an address where the contract resides. This address will allow us to communicate with this specific contract instance later on and send it transactions.

There are two variations of TON Blockchain we can deploy to - *mainnet* and *testnet*. We covered both in the previous tutorial. Personally, I almost never deploy to testnet. There are far better ways to gain confidence that my code is working as expected. The primary of which is writing a dedicated *test suite*. We will cover this in detail in one of the next tutorials. For now, let's assume the code is working perfectly and no further debugging is required.

### Init arguments

The new address of our deployed contract in TON depends on only two things - the deployed bytecode (initial code) and the initial contract storage (initial data). You can say that the address is some derivation of the hash of both. If two different developers were to deploy the exact same code with the exact same initialization data, they would collide.

The bytecode part is easy, we have that ready as a cell in the file `counter.cell` that we compiled in step 6. Now what about the initial contract storage? As you recall, the format of our persistent storage data was decided when we implemented the function `save_data()` of our contract FunC source. Our storage layout was very simple - just one unsigned int of 64 bit holding the counter value. Therefore, to initialize our contract, we would need to generate a data cell holding some arbitrary initial uint64 value - for example the number `1`.

### Interface class

The recommended way to interact with contracts is to create a small TypeScript class that will implement the interaction interface with the contract. We're using the project structure created by Blueprint, but we're still working on low-level aspects.
Use the following code in `wrappers/Counter.ts` to create the initial data cell for deployment:

```ts
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
}
```

Notice a few interesting things about this TypeScript code. First, it depends on the package [@ton/core](https://www.npmjs.com/package/@ton/core) instead of [@ton/ton](https://www.npmjs.com/package/@ton/ton), which contains a small subset of base types and is therefore slower to change - an important feature when building a stable interface for our contract. Second, the code that creates the data cell mimics the FunC API and is almost identical to our `save_data()` FunC function. Third, we can see the derivation of the contract address from the code cell and data cell using the function `contractAddress`.

The actual deployment involves sending the first message that will cause our contract to be deployed. We can piggyback any message that is directed towards our contract. This can even be the increment message with op #1, but we will do something simpler. We will just send some TON coins to our contract (an empty message) and piggyback that. Let's make this part of our interface. Add the function `sendDeploy()` to `wrappers/Counter.ts` - this function will send the deployment message:

```ts
// export default class Counter implements Contract {

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

// }
```

In every deployment we need to send some TON coins to our contract so that its balance is not zero. Contracts need to continually pay rent fees otherwise they risk being deleted. According to the [docs](https://ton.org/docs/develop/smart-contracts/fees#storage-fee), storage fees are about 4 TON per MB per year. Since our contract stores less than 1 KB, a balance of 0.01 TON should be enough for more than 2 years. In any case you can always check this in an explorer and send more TON to the contract if it runs low.

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step7.ts).

## Step 8: Deploy the contract on-chain

Communicating with the live network for the deployment will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

The deployment is going to cost gas and should be done through a wallet that will fund it. I'm assuming that you have some familiarity with TON wallets and how they're derived from 24 word secret mnemonics. If not, be sure to follow the previous tutorial in this series.

As you recall from the previous tutorial, TON wallets can come in multiple versions. The code below relies on "wallet v4 r2", if your wallet is different, either switch [Tonkeeper](https://tonkeeper.com) through "Settings" to this version, or modify the code below to use your version. Also remember to use a wallet works with the correct network you've chosen - testnet or mainnet.

Replace the current code in `scripts/deployCounter.ts` with a script that will use the interface class we have just written:

```ts
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, Cell, WalletContractV4 } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class from step 7

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = Counter.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Before running this code, make sure you have enough TON in your wallet for the gas payments and the TON sent to the contract during the deploy.

Another thing to watch out for is collisions between different users of this tutorial. As you recall, if the code and initial data of two contracts are identical, they will have the same address. If all followers of this tutorial would choose initial counter value of `1` - then all of them would collide and only the first would actually deploy the contract. To make sure this doesn't happen, the code above initializes the counter value to the current number of milliseconds since the epoch (something like 1674253934361). This guarantees that your contract for deployment is unique.

To deploy a contract using our script, run the following command in the terminal and follow the on-screen instructions:

```console
npx blueprint run
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance. A common mistake is trying to use a wallet contract that isn't deployed or funded. This can happen if you're setting the wrong wallet version. As explained in the previous tutorial, check your wallet address in an [explorer](https://testnet.tonscan.org) and if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.

The script will print the newly deployed contract address - mine is `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb`. You can open your address in an [explorer](https://testnet.tonscan.org) to verify that the deploy went smoothly. This is what it should look like:

<img src="https://i.imgur.com/SLR7nmE.png" width=600 /><br>

Write down your deployed contract address. We're going to use it in the next step.

## Step 9: Call a getter on the deployed contract

There are two ways to interact with a smart contract - calling a getter to read data from it or sending a message that can potentially change its state (write). We should support these interactions in the contract interface class that we created in step 7.

Anyone who wants to access the contract from TypeScript would simply use this interface class. This is excellent for separation of responsibilities within your team. The developer of the contract can provide this class to the developer of the client to abstract away implementation details such as how messages should be encoded in the binary level. Let's start with the getter.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

// }
```

Notice that methods in the interface class that call getters must start with the word `get`. This prefix is a requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) TypeScript library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step9.ts).

### Executing the call

Calling a getter is free and does not cost gas. The reason is that this call is read-only, so it does not require consensus by the validators and is not stored in a block on-chain for all eternity like transaction are.

Let's create a new script called `getCounter.ts` in the `scripts` folder and use our shiny interface class to make the call. We're going to emulate a different developer interacting with our contract and since the contract is already deployed, they are likely to access it by address. Be sure to replace my deployed contract address with yours in the code below:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "getCounter" from the list of available scripts.

```console
npx blueprint run
```

Make a note of the current counter value. After we send the increment message in the next step we would like to confirm that this value indeed increases by 1.

Another interesting thing to remember is that getters are only accessible off-chain, for example from a JavaScript client making a call through an RPC service provider. In particular, this means that contracts cannot call getters on other contracts.

## Step 10: Send a transaction to the deployed contract

Unlike getters that are read-only, messages can write and change contract state in storage. In our contract implementation we handled messages in `recv_internal()` and assigned op #1 = *increment*. Sending messages costs gas and requires payment in TON coin. The reason is that this operation is not read-only, so it requires waiting for consensus by the validators and is stored as a transaction in a block on-chain for all eternity. We will send less TON coin this time since this action is much cheaper than the deployment.

### Interface class

Add the following to `wrappers/Counter.ts`:

```ts
// export default class Counter implements Contract {

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody
    });
  }

// }
```

As you recall, the increment message is an [internal message](https://ton.org/docs/develop/smart-contracts/guidelines/internal-messages) that is encoded by convention with a 32 bit unsigned int in the beginning to describe the op and a 64 bit unsigned int after to describe the query id. The query id is relevant for messages that expect a response message to be sent back (the request and the response share the same query id).

Notice that methods in the interface class that send messages must start with the word `send`, another prefix requirement of the [@ton/ton](https://www.npmjs.com/package/@ton/ton) library. The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/02-contract/test/counter.step10.ts).

### Executing the send

The messages can be sent from any TON wallet, not necessarily the deployer wallet. Create a new script `sendIncrement.ts` in the `scripts` folder and use your wallet to fund the send:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

As always, run the script using the terminal and follow the instructions displayed on the screen. Make sure to choose "sendIncrement" from the list of available scripts.

```console
npx blueprint run
```

Notice that the message will take a few seconds to be processed by validators and will only change contract state after it has been processed. The normal wait time is a block or two, since validators need to produce a new block that contains our sent transaction. The op that was sent above is #1 = *increment*, which means that after processing, the counter value will increase by 1. Verify this by re-running the script from step 9 to print the new counter value.

Messages can be sent to our contract by other contracts. This means a different contract can increment our counter. This allows the TON ecosystem to create composable apps and protocols that build on top of each other and interact in unforeseen ways.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQA4RIS6uxt1GZkTTr19Wy423NZtcG0pRy29lg55X-qYq-Tf">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/2-smart/video.mp4" type="video/mp4">
</video>

Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACACZ_fWVyQMr&amount=50000000">here</a>:
<img src="https://i.imgur.com/GEuOQjr.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/02-contract/test).

In this tutorial we handled the build and deploy processes manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have these processes managed automatically by an awesome dev tool called [Blueprint](https://github.com/ton-community/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/03-client/index.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/03-client/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 74.43 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

     TON Hello World part 3: Step by step guide for building your first web client

[

![](../assets/logo.svg)

Tutorials



](https://ton-community.github.io/tutorials)

### Network

![](../assets/arrow-down.svg)

-   #### Testnet
    
    [docs](https://ton.org/docs/develop/smart-contracts/environment/testnet)
    
    Pros: free to use
    
    Cons: less reliable, requires special wallets
    
-   #### Mainnet
    
    [docs](https://tonmon.xyz/?orgId=1&refresh=5m)
    
    Pros: very reliable, fast, works with all wallets
    
    Cons: not free to use (but very cheap)
    

### Library

![](../assets/arrow-down.svg)

-   #### npm ton (JavaScript)
    
    [docs](https://github.com/ton-community/ton)
    
    Pros: more popular, full TypeScript support, elegant api
    
    Cons: no support for all ton services
    

### Tutorials

-   [01\. Working with your first wallet](https://helloworld.tonstudio.io/01-wallet)
-   [02\. Writing your first smart contract](https://helloworld.tonstudio.io/02-contract)
-   [03\. Building your first web client](https://helloworld.tonstudio.io/03-client)
-   [04\. Testing your first smart contract](https://helloworld.tonstudio.io/04-testing)

### Help

-   [Problems with this tutorial?](https://github.com/ton-community/tutorials/blob/main/HELP.md)

# TON Hello World part 3: Step by step guide for building your first web client

![](../assets/authors/shaharyakir.jpg) by Shahar Yakir

[](https://t.me/mrbonezy)[](https://twitter.com/ShaharYakir)

In the previous tutorial we deployed a Counter smart contract to TON Blockchain (either testnet or mainnet). This contract acts as the _backend server_ of our application. In this tutorial, we will implement the _frontend_ or _client_ and allow end-users to access it from a web browser.

We will also recall that the appilcation that we're building is _decentralized_. Decentralized apps (dapps) have special [properties](https://defi.org/ton/#app-safety-guidelines). For example, their frontend must only run client-side. This means that we're not supposed to rely on a backend server for serving our frontend. If we had such a server, by definition it would be centralized (our end-users will not have equal access to it), and thus make our entire app centralized as well.

## Step 1: Define usage patterns

TON Blockchain is inspired by and complementary to [Telegram](https://telegram.org/) messenger. It aims for mass adoption by the next billion users. Since Telegram messenger is a mobile-first app, it makes sense that we design our dapp to be mobile-first as well.

The first usage pattern of our dapp would be through a regular web browser. Our frontend would be hosted on some domain using a service like [GitHub Pages](https://pages.github.com/). End-users would input the dapp URL in their favorite web browser and access our dapp using HTML and JavaScript. This is quite standard.

The second usage pattern is a bit more special. Since TON Blockchain complements the Telegram messenger, we will also want to embed our dapp right into the Telegram app itself. Telegram provides special API for building [Telegam Web Apps](https://core.telegram.org/bots/webapps) (TWAs). These tiny apps closely resemble websites and also rely on HTML and JavaScript. They normally run within the context of a Telegram bot and provide a sleek user experience without ever leaving the host Telegram app.

  

During the course of this tutorial we will create a single codebase that will accomodate both usage patterns.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

Since our frontend will run inside a browser, it will be implemented in JavaScript. The most convenient runtime for developing JavaScript projects is Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

The second tool we need is an initialized TON wallet like [Tonkeeper](https://tonkeeper.com). If you don't have a wallet, please take a look at tutorial 1. The wallet will communicate with our dapp via a protocol called [TON Connect 2](https://github.com/ton-connect). If you choose a different wallet than Tonkeeper, please verify it supports this version of TON Connect. Don't forget to make sure your wallet is connected to the correct network - mainnet or testnet.

## Step 3: Set up the project

We will build our frontend with [React](https://reactjs.org/). To create our project we will rely on [Vite](https://vitejs.dev/) and its React template. Choose a name for your project, for example `my-twa`, then open terminal and run the following:

```console
npm create vite@latest my-twa -- --template react-ts
cd my-twa
npm install
```

We will need to install a few more packages that will allow us to interact with TON Blockchain. We've seen these packages in action in the previous tutorial. Run the following in terminal:

```console
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
```

Last but not least, we will need to overcome [@ton/ton](https://www.npmjs.com/package/@ton/ton) library's reliance on Nodejs `Buffer` that isn't available in the browser. We can do that by installing a polyfill. Run the following in terminal:

```console
npm install vite-plugin-node-polyfills
```

Now modify the file `vite.config.ts` so it looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
});
```

To see your empty app template, run in terminal:

```console
npm run dev
```

Then open a web browser and direct it the URL shown on-screen (like `http://localhost:5173/`).

## Step 4: Set up TON Connect

[TON Connect](https://github.com/ton-connect) is the protocol by which our app will communicate with the end-user's wallet. The TON Connect React library will provide us with some useful services like showing the end-user a list of TON Connect 2 supported wallets, querying the user's wallet for its public address and sending a transaction through the wallet.

Install the library by running in terminal:

```console
npm install @tonconnect/ui-react
```

When our app connects to the user's wallet, it will identify itself using a [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) file. The wallet will ask for the user's permission to connect to the app and display the information from the manifest. Since the manifest needs to be publicly available on the Internet, we're going to use an example one that I've deployed in advance during development. Later, when we deploy our website, we will replace the example manifest with your real one.

Modify the file `src/main.tsx` to use the TON Connect provider:

```tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
```

## Step 5: Add a Connect button to the app

The first action we're going to offer the user is to _Connect_ their wallet to the app. By connecting, the user agrees to share their public wallet address with the app. This isn't very dangerous since the entire transaction history of the wallet and its balance are publicly available on-chain anyways.

Edit the file `src/App.tsx` and replace its contents with the following:

```tsx
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App
```

The only thing our new app UI will have is the Connect button. To run the app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. I'm assuming you're using the web browser on your desktop (where you're developing) and your Tonkeeper wallet is installed on your mobile device. Click "Connect Wallet" on the desktop and choose "Tonkeeper" (or any other supporting wallet you're using).

TON Connect supports both mobile-mobile user flows and desktop-mobile user flows. Since development is a desktop-mobile flow, TON Connect will rely on scanning QR codes in order to communicate with the wallet running on your mobile device. Open the Tonkeeper mobile app, tap the QR button on the top right and scan the code from your desktop screen.

If everything is wired properly, you should see a confirmation dialong in the wallet mobile app. If you approve the connection, you will see your address in the web app UI!

## Step 6: Read the counter value from the chain

It's time to interact with our Counter contract and show the current counter value. To do that, we will need the TypeScript interface class that we created in tutorial 2. This class is useful because it defines all possible interactions with the contract in a manner that abstracts implementation and encoding details. This is particularly useful when you have one developer in your team that writes the contract and a different developer that builds the frontend.

Copy `counter.ts` from tutorial 2 to `src/contracts/counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/src/contracts/counter.ts)).

The next thing we'll do is implement a general purpose React [hook](https://reactjs.org/docs/hooks-intro.html) that will assist us in initializing async objects. Create the file `src/hooks/useAsyncInitialize.ts` with the following content:

```ts
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
```

Next, we're going to create another React hook that will rely on `useAsyncInitialize` and will initialize an RPC client in our app. An RPC service provider similar to [Infura](https://infura.io) on Ethereum will allow us to query data from the chain. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Create the file `src/hooks/useTonClient.ts` with the following content:

```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint(),
      })
  );
}
```

Our final hook will open the Counter contract instance on-chain by address and allow the app to access it. When our frontend developer starts working on the client, the contract should already be deployed. This means all they need to access it is the deployment address. We've done the deployment in tutorial 2 step 8. The address we got was `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb` but yours should be different.

Create the file `src/hooks/useCounterContract.ts` with the following content. Be sure to replace our deployed contract address with yours in the code below:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
```

We're almost done. Let's add some simple UI to show this information on the main app screen. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App
```

To rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see both the counter address and the counter value taken from the chain on the main screen. As you recall, we initialized the counter value to a very large value (number of milliseconds since the epoch, something like 1674271323207). Don't worry about styling, we will handle this later.

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 7: Increment the counter on-chain

The last interaction was read-only, let's change the contract state by sending a transaction. The main action our counter contract supports is _increment_. Let's add a button to the main screen that sends this transaction. As you recall, sending a transaction on-chain costs gas, so we would expect the wallet to approve this action with the user and show how much TON coin will be spent.

Before starting, we're going to add another hook that will generate a `sender` object from the TON Connect interface. This sender represents the connected wallet and will allow us to send transactions on their behalf. While we're at it, we'll also expose the wallet connection state so we can alter the UI accordingly.

Create the file `src/hooks/useTonConnect.ts` with the following content:

```ts
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}
```

The next thing we're going to do is improve our existing `useCounterContract` hook and add two small features. The first is automatic polling of the counter value every 5 seconds. This will come in handy to show the user that the value indeed changed. The second is exposing the `sendIncrement` of our interface class and wiring it to the `sender`.

Open the file `src/hooks/useCounterContract.ts` and replace its contents with:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
```

We're almost done. Let's add simple UI to allow the user to trigger the increment. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App
```

Time to rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see a new "Increment" link on the bottom of the screen. I'm assuming that you're still on desktop, make a note of the counter value and click the link.

Since your mobile Tonkeeper wallet is connected, this action should reach the Tonkeeper mobile app and cause it to display a confirmation dialog. Notice that this dialog shows the gas cost of the transaction. Approve the transaction on the mobile app. Since the app and wallet are connected, your approval should reach the app and cause it to display an indication that the transaction was sent. As you recall, new transactions must wait until they're included in a block, so this should take 5-10 seconds.

If everything is working, the counter value on screen should refresh automatically and you should see a value that is higher by one.

## Step 8: Style the app

Functionally our app is working, but we can definitely improve what it looks like. Giving a polished user experience is particularly important on TON Blockchain. We are aiming to reach mass adoption and the next billion users. We won't succeed unless our apps look as polished as the ones these users are already using.

Replace `src/index.css` with the following content:

```css
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.Disabled {
  filter: brightness(50%);
  cursor: initial;
}

.Button.Active:hover {
  filter: brightness(105%);
}

.Hint {
  color: var(--tg-theme-hint-color);
}

.Card {
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #131415;
    --tg-theme-text-color: #fff;
    --tg-theme-button-color: #32a6fb;
    --tg-theme-button-text-color: #fff;
  }

  .Card {
    background-color: var(--tg-theme-bg-color);
    filter: brightness(165%);
  }

  .CounterValue {
    border-radius: 16px;
    color: white;
    padding: 10px;
  }
}
```

As usual, to rebuild the web app, run in terminal:

```console
npm run dev
```

And refresh the web browser viewing the URL shown on-screen. Our app should look pretty now.

Up until now we used our app in a desktop-mobile flow due to the development cycle. It would be nice to try our app in a mobile-mobile flow. This means we need to open the app's web page from a mobile device. This will be much easier to do after our web app is published to the Internet.

## Step 9: Publish web app to GitHub Pages

I believe that the best place to publish dapps is [GitHub Pages](https://pages.github.com/) - not just for development but also for production. GitHub Pages is a free service for open source projects that allows them to publish static websites (HTML/CSS/JS) directly from a GitHub repo. Since all dapps should always be [open source](https://defi.org/ton/#app-safety-guidelines), all dapps qualify. GitHub Pages also supports [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), so the end result will be identical to any other production publishing service.

Another benefit of GitHub Pages is that it supports static websites only that only run client-side. There's no backend that can run code or server-side rendering. This limitation is actually a feature for dapps, because decentralized apps should never depend on backend servers as those are centralized.

The last important feature of GitHub Pages that makes it particularly appropriate for dapps is that the reliance on a git repo gives us many community governance features for free. For example, a group of maintainers can share the website deployment privilege easily because all of them have write access to the repo. Outside collaborators from the community can submit PRs and if those are merged, these community members can influence the live dapp. And lastly, if anyone from the community is unhappy with how the dapp is governed, they can always fork the GitHub repo and create their own independent client that can also be published to GitHub Pages in one click.

Let's assume that your GitHub username is `my-gituser` and that you pushed the client project to a GitHub repo named `my-twa` under this user. The GitHub URL of the repo is therefore `https://github.com/my-gituser/my-twa`. You will naturally have to replace the names in this example with the actual names that you're using.

Unless you connect a custom domain to GitHub Pages, the website will be published under the URL:

```console
https://my-gituser.github.io/my-twa
```

Since we're about to go live, it's time to use a proper TON Connect [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). This will allow us to style the initial connection dialog that appears in wallets like Tonkeeper.

Create the file `public/tonconnect-manifest.json` with this content:

```json
{
  "url": "https://my-gituser.github.io/my-twa",
  "name": "My TWA",
  "iconUrl": "https://my-gituser.github.io/my-twa/icon.png"
}
```

Replace the URL field with your webite URL and choose a short name of your dapp. For icon, create a PNG file 180x180 pixels in size and put it under `public/icon.png`.

After we publish the website, this manifest file will be available at:

```console
https://my-gituser.github.io/my-twa/tonconnect-manifest.json
```

Edit `src/main.tsx` and replace the constant `manifestUrl` with the future URL of your manifest:

```ts
const manifestUrl = 'https://my-gituser.github.io/my-twa/tonconnect-manifest.json';
```

Another step to remember is changing the `base` property of the Vite config file. If your future website is not going to be on the root of the domain (like you normally have with a custom domain), you must set `base` to the root directory of the website under the domain. In the example above, since the repo name is `my-twa` and the URL is `https://my-gituser.github.io/my-twa`, the website is published under the directory `/my-twa/` in the domain.

Let's set this in `vite.config.js`:

```ts
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/my-twa/',
});
```

Build the website for publishing by running in terminal:

```console
npm run build
```

Publishing to GitHub Pages is pretty straightforward. You would normally create a git branch named `gh-pages` in your repo that contains the static website files that were generated in the `dist` directory during the build. Then you would normally open the repo on GitHub's web UI and enable "Pages" under "Settings" (pointing the "Branch" to "gh-pages" after it is pushed).

For the exact steps, you can follow Vite's tutorial for [Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages).

Once the website is published, we can finally access it from mobile. Take your mobile device and open the URL `https://my-gituser.github.io/my-twa` in the mobile browser.

This is a good opportunity to try the mobile-mobile flow. In the mobile browser, tap on the "Connect Wallet" button and choose "Tonkeeper" (or any other supporting wallet you're using). This should switch you to the Tonkeeper mobile app where you can approve the connection. After approval, you should be switched back to the website. Now tap the "Increment" button. This should switch you to the Tonkeeper mobile app where you can approve the transaction. As you can see, in the mobile-mobile flow there are no QR codes involved since the dapp and the wallet run on the same device.

## Step 10: Publish web app as TWA in Telegram

Having our dapp accessible through a web browser is not enough. We want to make the most from the seamless integration into Telegram messenger. To feature our dapp in Telegram, we will also have to publish it as a TWA. Luckily, this is pretty easy to do.

The first step is to add the [TWA SDK](https://github.com/twa-dev) to our project. This will allow us to get theme properties while inside Telegram. Run in terminal:

```console
npm install @twa-dev/sdk
```

Then, edit `src/App.tsx` and add the following import:

```ts
import '@twa-dev/sdk';
```

Now rebuild the website for publishing by running in terminal:

```console
npm run build
```

Publish the updated website like we did in step 9, probably just by pushing it to git to the correct branch.

The final step is to create a new Telegram bot and have it showcase our website when opened. To do that we will interact with another Telegram bot called "botfather". On a device where your Telegram messenger is logged in, open [https://t.me/botfather](https://t.me/botfather) and then switch to the bot inside the Telegram app. Choose "Start".

To create a new bot select "/newbot". Choose a name for the bot and then a username according to the on-screen instructions. Make a note of the username since this is how end-users will access your TWA. Assuming that your bot username is `my_twa_bot`, it will be accessible in the Telegram chat by typing `@my_twa_bot` or through the URL [https://t.me/my\_twa\_bot](https://t.me/my_twa_bot). You can even purchase a premium Telegram username for your bot on the auction platform [Fragment](https://fragment.com).

Back in botfather, tap the menu button and edit your bots by selecting "/mybots". Select the bot you've just created. Select "Bot Settings" and then select "Menu Button". Now select "Configure menu button" to edit the URL and type your published website URL:

```console
https://my-gituser.github.io/my-twa
```

That's it! The bot should be ready. Start a Telegram chat with your bot via the username. Tap the menu button and voila - your published website will open inside Telegram as a TWA. Congratulations!

![](https://i.imgur.com/lVL1Bl0.png)  

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQBCaHNBo6KrAmyq6HdEB-rwxvRufrPTHd3VygbHcx4DisCt) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAD0yCaOQwnT&amount=50000000): ![QR-code](https://i.imgur.com/0UJOtIH.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/03-client/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new client project, you can start from a ready-made template that will save you most of the setup work:  
[https://github.com/ton-community/twa-template](https://github.com/ton-community/twa-template)

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!

# TON Hello World part 3: Step by step guide for building your first web client

![](../assets/authors/shaharyakir.jpg) by Shahar Yakir

[](https://t.me/mrbonezy)[](https://twitter.com/ShaharYakir)

In the previous tutorial we deployed a Counter smart contract to TON Blockchain (either testnet or mainnet). This contract acts as the _backend server_ of our application. In this tutorial, we will implement the _frontend_ or _client_ and allow end-users to access it from a web browser.

We will also recall that the appilcation that we're building is _decentralized_. Decentralized apps (dapps) have special [properties](https://defi.org/ton/#app-safety-guidelines). For example, their frontend must only run client-side. This means that we're not supposed to rely on a backend server for serving our frontend. If we had such a server, by definition it would be centralized (our end-users will not have equal access to it), and thus make our entire app centralized as well.

## Step 1: Define usage patterns

TON Blockchain is inspired by and complementary to [Telegram](https://telegram.org/) messenger. It aims for mass adoption by the next billion users. Since Telegram messenger is a mobile-first app, it makes sense that we design our dapp to be mobile-first as well.

The first usage pattern of our dapp would be through a regular web browser. Our frontend would be hosted on some domain using a service like [GitHub Pages](https://pages.github.com/). End-users would input the dapp URL in their favorite web browser and access our dapp using HTML and JavaScript. This is quite standard.

The second usage pattern is a bit more special. Since TON Blockchain complements the Telegram messenger, we will also want to embed our dapp right into the Telegram app itself. Telegram provides special API for building [Telegam Web Apps](https://core.telegram.org/bots/webapps) (TWAs). These tiny apps closely resemble websites and also rely on HTML and JavaScript. They normally run within the context of a Telegram bot and provide a sleek user experience without ever leaving the host Telegram app.

  

During the course of this tutorial we will create a single codebase that will accomodate both usage patterns.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

Since our frontend will run inside a browser, it will be implemented in JavaScript. The most convenient runtime for developing JavaScript projects is Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

The second tool we need is an initialized TON wallet like [Tonkeeper](https://tonkeeper.com). If you don't have a wallet, please take a look at tutorial 1. The wallet will communicate with our dapp via a protocol called [TON Connect 2](https://github.com/ton-connect). If you choose a different wallet than Tonkeeper, please verify it supports this version of TON Connect. Don't forget to make sure your wallet is connected to the correct network - mainnet or testnet.

## Step 3: Set up the project

We will build our frontend with [React](https://reactjs.org/). To create our project we will rely on [Vite](https://vitejs.dev/) and its React template. Choose a name for your project, for example `my-twa`, then open terminal and run the following:

```console
npm create vite@latest my-twa -- --template react-ts
cd my-twa
npm install
```

We will need to install a few more packages that will allow us to interact with TON Blockchain. We've seen these packages in action in the previous tutorial. Run the following in terminal:

```console
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
```

Last but not least, we will need to overcome [@ton/ton](https://www.npmjs.com/package/@ton/ton) library's reliance on Nodejs `Buffer` that isn't available in the browser. We can do that by installing a polyfill. Run the following in terminal:

```console
npm install vite-plugin-node-polyfills
```

Now modify the file `vite.config.ts` so it looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
});
```

To see your empty app template, run in terminal:

```console
npm run dev
```

Then open a web browser and direct it the URL shown on-screen (like `http://localhost:5173/`).

## Step 4: Set up TON Connect

[TON Connect](https://github.com/ton-connect) is the protocol by which our app will communicate with the end-user's wallet. The TON Connect React library will provide us with some useful services like showing the end-user a list of TON Connect 2 supported wallets, querying the user's wallet for its public address and sending a transaction through the wallet.

Install the library by running in terminal:

```console
npm install @tonconnect/ui-react
```

When our app connects to the user's wallet, it will identify itself using a [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) file. The wallet will ask for the user's permission to connect to the app and display the information from the manifest. Since the manifest needs to be publicly available on the Internet, we're going to use an example one that I've deployed in advance during development. Later, when we deploy our website, we will replace the example manifest with your real one.

Modify the file `src/main.tsx` to use the TON Connect provider:

```tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
```

## Step 5: Add a Connect button to the app

The first action we're going to offer the user is to _Connect_ their wallet to the app. By connecting, the user agrees to share their public wallet address with the app. This isn't very dangerous since the entire transaction history of the wallet and its balance are publicly available on-chain anyways.

Edit the file `src/App.tsx` and replace its contents with the following:

```tsx
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App
```

The only thing our new app UI will have is the Connect button. To run the app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. I'm assuming you're using the web browser on your desktop (where you're developing) and your Tonkeeper wallet is installed on your mobile device. Click "Connect Wallet" on the desktop and choose "Tonkeeper" (or any other supporting wallet you're using).

TON Connect supports both mobile-mobile user flows and desktop-mobile user flows. Since development is a desktop-mobile flow, TON Connect will rely on scanning QR codes in order to communicate with the wallet running on your mobile device. Open the Tonkeeper mobile app, tap the QR button on the top right and scan the code from your desktop screen.

If everything is wired properly, you should see a confirmation dialong in the wallet mobile app. If you approve the connection, you will see your address in the web app UI!

## Step 6: Read the counter value from the chain

It's time to interact with our Counter contract and show the current counter value. To do that, we will need the TypeScript interface class that we created in tutorial 2. This class is useful because it defines all possible interactions with the contract in a manner that abstracts implementation and encoding details. This is particularly useful when you have one developer in your team that writes the contract and a different developer that builds the frontend.

Copy `counter.ts` from tutorial 2 to `src/contracts/counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/src/contracts/counter.ts)).

The next thing we'll do is implement a general purpose React [hook](https://reactjs.org/docs/hooks-intro.html) that will assist us in initializing async objects. Create the file `src/hooks/useAsyncInitialize.ts` with the following content:

```ts
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
```

Next, we're going to create another React hook that will rely on `useAsyncInitialize` and will initialize an RPC client in our app. An RPC service provider similar to [Infura](https://infura.io) on Ethereum will allow us to query data from the chain. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Create the file `src/hooks/useTonClient.ts` with the following content:

```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
  );
}
```

Our final hook will open the Counter contract instance on-chain by address and allow the app to access it. When our frontend developer starts working on the client, the contract should already be deployed. This means all they need to access it is the deployment address. We've done the deployment in tutorial 2 step 8. The address we got was `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb` but yours should be different.

Create the file `src/hooks/useCounterContract.ts` with the following content. Be sure to replace our deployed contract address with yours in the code below:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
```

We're almost done. Let's add some simple UI to show this information on the main app screen. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App
```

To rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see both the counter address and the counter value taken from the chain on the main screen. As you recall, we initialized the counter value to a very large value (number of milliseconds since the epoch, something like 1674271323207). Don't worry about styling, we will handle this later.

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 7: Increment the counter on-chain

The last interaction was read-only, let's change the contract state by sending a transaction. The main action our counter contract supports is _increment_. Let's add a button to the main screen that sends this transaction. As you recall, sending a transaction on-chain costs gas, so we would expect the wallet to approve this action with the user and show how much TON coin will be spent.

Before starting, we're going to add another hook that will generate a `sender` object from the TON Connect interface. This sender represents the connected wallet and will allow us to send transactions on their behalf. While we're at it, we'll also expose the wallet connection state so we can alter the UI accordingly.

Create the file `src/hooks/useTonConnect.ts` with the following content:

```ts
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}
```

The next thing we're going to do is improve our existing `useCounterContract` hook and add two small features. The first is automatic polling of the counter value every 5 seconds. This will come in handy to show the user that the value indeed changed. The second is exposing the `sendIncrement` of our interface class and wiring it to the `sender`.

Open the file `src/hooks/useCounterContract.ts` and replace its contents with:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
```

We're almost done. Let's add simple UI to allow the user to trigger the increment. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App
```

Time to rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see a new "Increment" link on the bottom of the screen. I'm assuming that you're still on desktop, make a note of the counter value and click the link.

Since your mobile Tonkeeper wallet is connected, this action should reach the Tonkeeper mobile app and cause it to display a confirmation dialog. Notice that this dialog shows the gas cost of the transaction. Approve the transaction on the mobile app. Since the app and wallet are connected, your approval should reach the app and cause it to display an indication that the transaction was sent. As you recall, new transactions must wait until they're included in a block, so this should take 5-10 seconds.

If everything is working, the counter value on screen should refresh automatically and you should see a value that is higher by one.

## Step 8: Style the app

Functionally our app is working, but we can definitely improve what it looks like. Giving a polished user experience is particularly important on TON Blockchain. We are aiming to reach mass adoption and the next billion users. We won't succeed unless our apps look as polished as the ones these users are already using.

Replace `src/index.css` with the following content:

```css
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button 

[Content truncated due to size limit]


================================================
FILE: docs/03-client/mainnet-npmton.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/03-client/mainnet-npmton.html
================================================
[HTML Document converted to Markdown]

File: mainnet-npmton.html
Size: 32.17 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 3: Step by step guide for building your first web client

In the previous tutorial we deployed a Counter smart contract to TON Blockchain (either testnet or mainnet). This contract acts as the _backend server_ of our application. In this tutorial, we will implement the _frontend_ or _client_ and allow end-users to access it from a web browser.

We will also recall that the appilcation that we're building is _decentralized_. Decentralized apps (dapps) have special [properties](https://defi.org/ton/#app-safety-guidelines). For example, their frontend must only run client-side. This means that we're not supposed to rely on a backend server for serving our frontend. If we had such a server, by definition it would be centralized (our end-users will not have equal access to it), and thus make our entire app centralized as well.

## Step 1: Define usage patterns

TON Blockchain is inspired by and complementary to [Telegram](https://telegram.org/) messenger. It aims for mass adoption by the next billion users. Since Telegram messenger is a mobile-first app, it makes sense that we design our dapp to be mobile-first as well.

The first usage pattern of our dapp would be through a regular web browser. Our frontend would be hosted on some domain using a service like [GitHub Pages](https://pages.github.com/). End-users would input the dapp URL in their favorite web browser and access our dapp using HTML and JavaScript. This is quite standard.

The second usage pattern is a bit more special. Since TON Blockchain complements the Telegram messenger, we will also want to embed our dapp right into the Telegram app itself. Telegram provides special API for building [Telegam Web Apps](https://core.telegram.org/bots/webapps) (TWAs). These tiny apps closely resemble websites and also rely on HTML and JavaScript. They normally run within the context of a Telegram bot and provide a sleek user experience without ever leaving the host Telegram app.

  

During the course of this tutorial we will create a single codebase that will accomodate both usage patterns.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

Since our frontend will run inside a browser, it will be implemented in JavaScript. The most convenient runtime for developing JavaScript projects is Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

The second tool we need is an initialized TON wallet like [Tonkeeper](https://tonkeeper.com). If you don't have a wallet, please take a look at tutorial 1. The wallet will communicate with our dapp via a protocol called [TON Connect 2](https://github.com/ton-connect). If you choose a different wallet than Tonkeeper, please verify it supports this version of TON Connect. Don't forget to make sure your wallet is connected to the correct network - mainnet or testnet.

## Step 3: Set up the project

We will build our frontend with [React](https://reactjs.org/). To create our project we will rely on [Vite](https://vitejs.dev/) and its React template. Choose a name for your project, for example `my-twa`, then open terminal and run the following:

```console
npm create vite@latest my-twa -- --template react-ts
cd my-twa
npm install
```

We will need to install a few more packages that will allow us to interact with TON Blockchain. We've seen these packages in action in the previous tutorial. Run the following in terminal:

```console
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
```

Last but not least, we will need to overcome [@ton/ton](https://www.npmjs.com/package/@ton/ton) library's reliance on Nodejs `Buffer` that isn't available in the browser. We can do that by installing a polyfill. Run the following in terminal:

```console
npm install vite-plugin-node-polyfills
```

Now modify the file `vite.config.ts` so it looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
});
```

To see your empty app template, run in terminal:

```console
npm run dev
```

Then open a web browser and direct it the URL shown on-screen (like `http://localhost:5173/`).

## Step 4: Set up TON Connect

[TON Connect](https://github.com/ton-connect) is the protocol by which our app will communicate with the end-user's wallet. The TON Connect React library will provide us with some useful services like showing the end-user a list of TON Connect 2 supported wallets, querying the user's wallet for its public address and sending a transaction through the wallet.

Install the library by running in terminal:

```console
npm install @tonconnect/ui-react
```

When our app connects to the user's wallet, it will identify itself using a [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) file. The wallet will ask for the user's permission to connect to the app and display the information from the manifest. Since the manifest needs to be publicly available on the Internet, we're going to use an example one that I've deployed in advance during development. Later, when we deploy our website, we will replace the example manifest with your real one.

Modify the file `src/main.tsx` to use the TON Connect provider:

```tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
```

## Step 5: Add a Connect button to the app

The first action we're going to offer the user is to _Connect_ their wallet to the app. By connecting, the user agrees to share their public wallet address with the app. This isn't very dangerous since the entire transaction history of the wallet and its balance are publicly available on-chain anyways.

Edit the file `src/App.tsx` and replace its contents with the following:

```tsx
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App
```

The only thing our new app UI will have is the Connect button. To run the app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. I'm assuming you're using the web browser on your desktop (where you're developing) and your Tonkeeper wallet is installed on your mobile device. Click "Connect Wallet" on the desktop and choose "Tonkeeper" (or any other supporting wallet you're using).

TON Connect supports both mobile-mobile user flows and desktop-mobile user flows. Since development is a desktop-mobile flow, TON Connect will rely on scanning QR codes in order to communicate with the wallet running on your mobile device. Open the Tonkeeper mobile app, tap the QR button on the top right and scan the code from your desktop screen.

If everything is wired properly, you should see a confirmation dialong in the wallet mobile app. If you approve the connection, you will see your address in the web app UI!

## Step 6: Read the counter value from the chain

It's time to interact with our Counter contract and show the current counter value. To do that, we will need the TypeScript interface class that we created in tutorial 2. This class is useful because it defines all possible interactions with the contract in a manner that abstracts implementation and encoding details. This is particularly useful when you have one developer in your team that writes the contract and a different developer that builds the frontend.

Copy `counter.ts` from tutorial 2 to `src/contracts/counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/src/contracts/counter.ts)).

The next thing we'll do is implement a general purpose React [hook](https://reactjs.org/docs/hooks-intro.html) that will assist us in initializing async objects. Create the file `src/hooks/useAsyncInitialize.ts` with the following content:

```ts
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
```

Next, we're going to create another React hook that will rely on `useAsyncInitialize` and will initialize an RPC client in our app. An RPC service provider similar to [Infura](https://infura.io) on Ethereum will allow us to query data from the chain. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Create the file `src/hooks/useTonClient.ts` with the following content:

```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint(),
      })
  );
}
```

Our final hook will open the Counter contract instance on-chain by address and allow the app to access it. When our frontend developer starts working on the client, the contract should already be deployed. This means all they need to access it is the deployment address. We've done the deployment in tutorial 2 step 8. The address we got was `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb` but yours should be different.

Create the file `src/hooks/useCounterContract.ts` with the following content. Be sure to replace our deployed contract address with yours in the code below:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
```

We're almost done. Let's add some simple UI to show this information on the main app screen. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App
```

To rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see both the counter address and the counter value taken from the chain on the main screen. As you recall, we initialized the counter value to a very large value (number of milliseconds since the epoch, something like 1674271323207). Don't worry about styling, we will handle this later.

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 7: Increment the counter on-chain

The last interaction was read-only, let's change the contract state by sending a transaction. The main action our counter contract supports is _increment_. Let's add a button to the main screen that sends this transaction. As you recall, sending a transaction on-chain costs gas, so we would expect the wallet to approve this action with the user and show how much TON coin will be spent.

Before starting, we're going to add another hook that will generate a `sender` object from the TON Connect interface. This sender represents the connected wallet and will allow us to send transactions on their behalf. While we're at it, we'll also expose the wallet connection state so we can alter the UI accordingly.

Create the file `src/hooks/useTonConnect.ts` with the following content:

```ts
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}
```

The next thing we're going to do is improve our existing `useCounterContract` hook and add two small features. The first is automatic polling of the counter value every 5 seconds. This will come in handy to show the user that the value indeed changed. The second is exposing the `sendIncrement` of our interface class and wiring it to the `sender`.

Open the file `src/hooks/useCounterContract.ts` and replace its contents with:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
```

We're almost done. Let's add simple UI to allow the user to trigger the increment. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App
```

Time to rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see a new "Increment" link on the bottom of the screen. I'm assuming that you're still on desktop, make a note of the counter value and click the link.

Since your mobile Tonkeeper wallet is connected, this action should reach the Tonkeeper mobile app and cause it to display a confirmation dialog. Notice that this dialog shows the gas cost of the transaction. Approve the transaction on the mobile app. Since the app and wallet are connected, your approval should reach the app and cause it to display an indication that the transaction was sent. As you recall, new transactions must wait until they're included in a block, so this should take 5-10 seconds.

If everything is working, the counter value on screen should refresh automatically and you should see a value that is higher by one.

## Step 8: Style the app

Functionally our app is working, but we can definitely improve what it looks like. Giving a polished user experience is particularly important on TON Blockchain. We are aiming to reach mass adoption and the next billion users. We won't succeed unless our apps look as polished as the ones these users are already using.

Replace `src/index.css` with the following content:

```css
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.Disabled {
  filter: brightness(50%);
  cursor: initial;
}

.Button.Active:hover {
  filter: brightness(105%);
}

.Hint {
  color: var(--tg-theme-hint-color);
}

.Card {
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #131415;
    --tg-theme-text-color: #fff;
    --tg-theme-button-color: #32a6fb;
    --tg-theme-button-text-color: #fff;
  }

  .Card {
    background-color: var(--tg-theme-bg-color);
    filter: brightness(165%);
  }

  .CounterValue {
    border-radius: 16px;
    color: white;
    padding: 10px;
  }
}
```

As usual, to rebuild the web app, run in terminal:

```console
npm run dev
```

And refresh the web browser viewing the URL shown on-screen. Our app should look pretty now.

Up until now we used our app in a desktop-mobile flow due to the development cycle. It would be nice to try our app in a mobile-mobile flow. This means we need to open the app's web page from a mobile device. This will be much easier to do after our web app is published to the Internet.

## Step 9: Publish web app to GitHub Pages

I believe that the best place to publish dapps is [GitHub Pages](https://pages.github.com/) - not just for development but also for production. GitHub Pages is a free service for open source projects that allows them to publish static websites (HTML/CSS/JS) directly from a GitHub repo. Since all dapps should always be [open source](https://defi.org/ton/#app-safety-guidelines), all dapps qualify. GitHub Pages also supports [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), so the end result will be identical to any other production publishing service.

Another benefit of GitHub Pages is that it supports static websites only that only run client-side. There's no backend that can run code or server-side rendering. This limitation is actually a feature for dapps, because decentralized apps should never depend on backend servers as those are centralized.

The last important feature of GitHub Pages that makes it particularly appropriate for dapps is that the reliance on a git repo gives us many community governance features for free. For example, a group of maintainers can share the website deployment privilege easily because all of them have write access to the repo. Outside collaborators from the community can submit PRs and if those are merged, these community members can influence the live dapp. And lastly, if anyone from the community is unhappy with how the dapp is governed, they can always fork the GitHub repo and create their own independent client that can also be published to GitHub Pages in one click.

Let's assume that your GitHub username is `my-gituser` and that you pushed the client project to a GitHub repo named `my-twa` under this user. The GitHub URL of the repo is therefore `https://github.com/my-gituser/my-twa`. You will naturally have to replace the names in this example with the actual names that you're using.

Unless you connect a custom domain to GitHub Pages, the website will be published under the URL:

```console
https://my-gituser.github.io/my-twa
```

Since we're about to go live, it's time to use a proper TON Connect [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). This will allow us to style the initial connection dialog that appears in wallets like Tonkeeper.

Create the file `public/tonconnect-manifest.json` with this content:

```json
{
  "url": "https://my-gituser.github.io/my-twa",
  "name": "My TWA",
  "iconUrl": "https://my-gituser.github.io/my-twa/icon.png"
}
```

Replace the URL field with your webite URL and choose a short name of your dapp. For icon, create a PNG file 180x180 pixels in size and put it under `public/icon.png`.

After we publish the website, this manifest file will be available at:

```console
https://my-gituser.github.io/my-twa/tonconnect-manifest.json
```

Edit `src/main.tsx` and replace the constant `manifestUrl` with the future URL of your manifest:

```ts
const manifestUrl = 'https://my-gituser.github.io/my-twa/tonconnect-manifest.json';
```

Another step to remember is changing the `base` property of the Vite config file. If your future website is not going to be on the root of the domain (like you normally have with a custom domain), you must set `base` to the root directory of the website under the domain. In the example above, since the repo name is `my-twa` and the URL is `https://my-gituser.github.io/my-twa`, the website is published under the directory `/my-twa/` in the domain.

Let's set this in `vite.config.js`:

```ts
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/my-twa/',
});
```

Build the website for publishing by running in terminal:

```console
npm run build
```

Publishing to GitHub Pages is pretty straightforward. You would normally create a git branch named `gh-pages` in your repo that contains the static website files that were generated in the `dist` directory during the build. Then you would normally open the repo on GitHub's web UI and enable "Pages" under "Settings" (pointing the "Branch" to "gh-pages" after it is pushed).

For the exact steps, you can follow Vite's tutorial for [Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages).

Once the website is published, we can finally access it from mobile. Take your mobile device and open the URL `https://my-gituser.github.io/my-twa` in the mobile browser.

This is a good opportunity to try the mobile-mobile flow. In the mobile browser, tap on the "Connect Wallet" button and choose "Tonkeeper" (or any other supporting wallet you're using). This should switch you to the Tonkeeper mobile app where you can approve the connection. After approval, you should be switched back to the website. Now tap the "Increment" button. This should switch you to the Tonkeeper mobile app where you can approve the transaction. As you can see, in the mobile-mobile flow there are no QR codes involved since the dapp and the wallet run on the same device.

## Step 10: Publish web app as TWA in Telegram

Having our dapp accessible through a web browser is not enough. We want to make the most from the seamless integration into Telegram messenger. To feature our dapp in Telegram, we will also have to publish it as a TWA. Luckily, this is pretty easy to do.

The first step is to add the [TWA SDK](https://github.com/twa-dev) to our project. This will allow us to get theme properties while inside Telegram. Run in terminal:

```console
npm install @twa-dev/sdk
```

Then, edit `src/App.tsx` and add the following import:

```ts
import '@twa-dev/sdk';
```

Now rebuild the website for publishing by running in terminal:

```console
npm run build
```

Publish the updated website like we did in step 9, probably just by pushing it to git to the correct branch.

The final step is to create a new Telegram bot and have it showcase our website when opened. To do that we will interact with another Telegram bot called "botfather". On a device where your Telegram messenger is logged in, open [https://t.me/botfather](https://t.me/botfather) and then switch to the bot inside the Telegram app. Choose "Start".

To create a new bot select "/newbot". Choose a name for the bot and then a username according to the on-screen instructions. Make a note of the username since this is how end-users will access your TWA. Assuming that your bot username is `my_twa_bot`, it will be accessible in the Telegram chat by typing `@my_twa_bot` or through the URL [https://t.me/my\_twa\_bot](https://t.me/my_twa_bot). You can even purchase a premium Telegram username for your bot on the auction platform [Fragment](https://fragment.com).

Back in botfather, tap the menu button and edit your bots by selecting "/mybots". Select the bot you've just created. Select "Bot Settings" and then select "Menu Button". Now select "Configure menu button" to edit the URL and type your published website URL:

```console
https://my-gituser.github.io/my-twa
```

That's it! The bot should be ready. Start a Telegram chat with your bot via the username. Tap the menu button and voila - your published website will open inside Telegram as a TWA. Congratulations!

![](https://i.imgur.com/lVL1Bl0.png)  

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQBCaHNBo6KrAmyq6HdEB-rwxvRufrPTHd3VygbHcx4DisCt) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAD0yCaOQwnT&amount=50000000): ![QR-code](https://i.imgur.com/0UJOtIH.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/03-client/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new client project, you can start from a ready-made template that will save you most of the setup work:  
[https://github.com/ton-community/twa-template](https://github.com/ton-community/twa-template)

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 32, Images: 2, Headings: 13, Paragraphs: 115



================================================
FILE: docs/03-client/mainnet-npmton.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/03-client/mainnet-npmton.md
================================================

# TON Hello World part 3: Step by step guide for building your first web client

In the previous tutorial we deployed a Counter smart contract to TON Blockchain (either testnet or mainnet). This contract acts as the *backend server* of our application. In this tutorial, we will implement the *frontend* or *client* and allow end-users to access it from a web browser.

We will also recall that the appilcation that we're building is *decentralized*. Decentralized apps (dapps) have special [properties](https://defi.org/ton/#app-safety-guidelines). For example, their frontend must only run client-side. This means that we're not supposed to rely on a backend server for serving our frontend. If we had such a server, by definition it would be centralized (our end-users will not have equal access to it), and thus make our entire app centralized as well.

## Step 1: Define usage patterns

TON Blockchain is inspired by and complementary to [Telegram](https://telegram.org/) messenger. It aims for mass adoption by the next billion users. Since Telegram messenger is a mobile-first app, it makes sense that we design our dapp to be mobile-first as well.

The first usage pattern of our dapp would be through a regular web browser. Our frontend would be hosted on some domain using a service like [GitHub Pages](https://pages.github.com/). End-users would input the dapp URL in their favorite web browser and access our dapp using HTML and JavaScript. This is quite standard.

The second usage pattern is a bit more special. Since TON Blockchain complements the Telegram messenger, we will also want to embed our dapp right into the Telegram app itself. Telegram provides special API for building [Telegam Web Apps](https://core.telegram.org/bots/webapps) (TWAs). These tiny apps closely resemble websites and also rely on HTML and JavaScript. They normally run within the context of a Telegram bot and provide a sleek user experience without ever leaving the host Telegram app.

<video src="https://ton-community.github.io/tutorials/assets/twa.mp4" loop muted autoplay playsinline width=300></video><br>

During the course of this tutorial we will create a single codebase that will accomodate both usage patterns.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

Since our frontend will run inside a browser, it will be implemented in JavaScript. The most convenient runtime for developing JavaScript projects is Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

The second tool we need is an initialized TON wallet like [Tonkeeper](https://tonkeeper.com). If you don't have a wallet, please take a look at tutorial 1. The wallet will communicate with our dapp via a protocol called [TON Connect 2](https://github.com/ton-connect). If you choose a different wallet than Tonkeeper, please verify it supports this version of TON Connect. Don't forget to make sure your wallet is connected to the correct network - mainnet or testnet.

## Step 3: Set up the project

We will build our frontend with [React](https://reactjs.org/). To create our project we will rely on [Vite](https://vitejs.dev/) and its React template. Choose a name for your project, for example `my-twa`, then open terminal and run the following:

```console
npm create vite@latest my-twa -- --template react-ts
cd my-twa
npm install
```

We will need to install a few more packages that will allow us to interact with TON Blockchain. We've seen these packages in action in the previous tutorial. Run the following in terminal:

```console
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
```

Last but not least, we will need to overcome [@ton/ton](https://www.npmjs.com/package/@ton/ton) library's reliance on Nodejs `Buffer` that isn't available in the browser. We can do that by installing a polyfill. Run the following in terminal:

```console
npm install vite-plugin-node-polyfills
```

Now modify the file `vite.config.ts` so it looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
});
```

To see your empty app template, run in terminal:

```console
npm run dev
```

Then open a web browser and direct it the URL shown on-screen (like `http://localhost:5173/`).

## Step 4: Set up TON Connect

[TON Connect](https://github.com/ton-connect) is the protocol by which our app will communicate with the end-user's wallet. The TON Connect React library will provide us with some useful services like showing the end-user a list of TON Connect 2 supported wallets, querying the user's wallet for its public address and sending a transaction through the wallet.

Install the library by running in terminal:

```console
npm install @tonconnect/ui-react
```

When our app connects to the user's wallet, it will identify itself using a [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) file. The wallet will ask for the user's permission to connect to the app and display the information from the manifest. Since the manifest needs to be publicly available on the Internet, we're going to use an example one that I've deployed in advance during development. Later, when we deploy our website, we will replace the example manifest with your real one.

Modify the file `src/main.tsx` to use the TON Connect provider:

```tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
```

## Step 5: Add a Connect button to the app

The first action we're going to offer the user is to *Connect* their wallet to the app. By connecting, the user agrees to share their public wallet address with the app. This isn't very dangerous since the entire transaction history of the wallet and its balance are publicly available on-chain anyways.

Edit the file `src/App.tsx` and replace its contents with the following:

```tsx
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App
```

The only thing our new app UI will have is the Connect button. To run the app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. I'm assuming you're using the web browser on your desktop (where you're developing) and your Tonkeeper wallet is installed on your mobile device. Click "Connect Wallet" on the desktop and choose "Tonkeeper" (or any other supporting wallet you're using).

TON Connect supports both mobile-mobile user flows and desktop-mobile user flows. Since development is a desktop-mobile flow, TON Connect will rely on scanning QR codes in order to communicate with the wallet running on your mobile device. Open the Tonkeeper mobile app, tap the QR button on the top right and scan the code from your desktop screen.

If everything is wired properly, you should see a confirmation dialong in the wallet mobile app. If you approve the connection, you will see your address in the web app UI!

## Step 6: Read the counter value from the chain

It's time to interact with our Counter contract and show the current counter value. To do that, we will need the TypeScript interface class that we created in tutorial 2. This class is useful because it defines all possible interactions with the contract in a manner that abstracts implementation and encoding details. This is particularly useful when you have one developer in your team that writes the contract and a different developer that builds the frontend.

Copy `counter.ts` from tutorial 2 to `src/contracts/counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/src/contracts/counter.ts)).

The next thing we'll do is implement a general purpose React [hook](https://reactjs.org/docs/hooks-intro.html) that will assist us in initializing async objects. Create the file `src/hooks/useAsyncInitialize.ts` with the following content:

```ts
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
```

Next, we're going to create another React hook that will rely on `useAsyncInitialize` and will initialize an RPC client in our app. An RPC service provider similar to [Infura](https://infura.io) on Ethereum will allow us to query data from the chain. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Create the file `src/hooks/useTonClient.ts` with the following content:

```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint(),
      })
  );
}
```

Our final hook will open the Counter contract instance on-chain by address and allow the app to access it. When our frontend developer starts working on the client, the contract should already be deployed. This means all they need to access it is the deployment address. We've done the deployment in tutorial 2 step 8. The address we got was `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb` but yours should be different.

Create the file `src/hooks/useCounterContract.ts` with the following content. Be sure to replace our deployed contract address with yours in the code below:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
```

We're almost done. Let's add some simple UI to show this information on the main app screen. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App
```

To rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see both the counter address and the counter value taken from the chain on the main screen. As you recall, we initialized the counter value to a very large value (number of milliseconds since the epoch, something like 1674271323207). Don't worry about styling, we will handle this later.

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 7: Increment the counter on-chain

The last interaction was read-only, let's change the contract state by sending a transaction. The main action our counter contract supports is *increment*. Let's add a button to the main screen that sends this transaction. As you recall, sending a transaction on-chain costs gas, so we would expect the wallet to approve this action with the user and show how much TON coin will be spent.

Before starting, we're going to add another hook that will generate a `sender` object from the TON Connect interface. This sender represents the connected wallet and will allow us to send transactions on their behalf. While we're at it, we'll also expose the wallet connection state so we can alter the UI accordingly.

Create the file `src/hooks/useTonConnect.ts` with the following content:

```ts
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}
```

The next thing we're going to do is improve our existing `useCounterContract` hook and add two small features. The first is automatic polling of the counter value every 5 seconds. This will come in handy to show the user that the value indeed changed. The second is exposing the `sendIncrement` of our interface class and wiring it to the `sender`.

Open the file `src/hooks/useCounterContract.ts` and replace its contents with:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
```

We're almost done. Let's add simple UI to allow the user to trigger the increment. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App
```

Time to rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see a new "Increment" link on the bottom of the screen. I'm assuming that you're still on desktop, make a note of the counter value and click the link.

Since your mobile Tonkeeper wallet is connected, this action should reach the Tonkeeper mobile app and cause it to display a confirmation dialog. Notice that this dialog shows the gas cost of the transaction. Approve the transaction on the mobile app. Since the app and wallet are connected, your approval should reach the app and cause it to display an indication that the transaction was sent. As you recall, new transactions must wait until they're included in a block, so this should take 5-10 seconds.

If everything is working, the counter value on screen should refresh automatically and you should see a value that is higher by one.

## Step 8: Style the app

Functionally our app is working, but we can definitely improve what it looks like. Giving a polished user experience is particularly important on TON Blockchain. We are aiming to reach mass adoption and the next billion users. We won't succeed unless our apps look as polished as the ones these users are already using.

Replace `src/index.css` with the following content:

```css
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.Disabled {
  filter: brightness(50%);
  cursor: initial;
}

.Button.Active:hover {
  filter: brightness(105%);
}

.Hint {
  color: var(--tg-theme-hint-color);
}

.Card {
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #131415;
    --tg-theme-text-color: #fff;
    --tg-theme-button-color: #32a6fb;
    --tg-theme-button-text-color: #fff;
  }

  .Card {
    background-color: var(--tg-theme-bg-color);
    filter: brightness(165%);
  }

  .CounterValue {
    border-radius: 16px;
    color: white;
    padding: 10px;
  }
}
```

As usual, to rebuild the web app, run in terminal:

```console
npm run dev
```

And refresh the web browser viewing the URL shown on-screen. Our app should look pretty now.

Up until now we used our app in a desktop-mobile flow due to the development cycle. It would be nice to try our app in a mobile-mobile flow. This means we need to open the app's web page from a mobile device. This will be much easier to do after our web app is published to the Internet.

## Step 9: Publish web app to GitHub Pages

I believe that the best place to publish dapps is [GitHub Pages](https://pages.github.com/) - not just for development but also for production. GitHub Pages is a free service for open source projects that allows them to publish static websites (HTML/CSS/JS) directly from a GitHub repo. Since all dapps should always be [open source](https://defi.org/ton/#app-safety-guidelines), all dapps qualify. GitHub Pages also supports [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), so the end result will be identical to any other production publishing service.

Another benefit of GitHub Pages is that it supports static websites only that only run client-side. There's no backend that can run code or server-side rendering. This limitation is actually a feature for dapps, because decentralized apps should never depend on backend servers as those are centralized.

The last important feature of GitHub Pages that makes it particularly appropriate for dapps is that the reliance on a git repo gives us many community governance features for free. For example, a group of maintainers can share the website deployment privilege easily because all of them have write access to the repo. Outside collaborators from the community can submit PRs and if those are merged, these community members can influence the live dapp. And lastly, if anyone from the community is unhappy with how the dapp is governed, they can always fork the GitHub repo and create their own independent client that can also be published to GitHub Pages in one click.

Let's assume that your GitHub username is `my-gituser` and that you pushed the client project to a GitHub repo named `my-twa` under this user. The GitHub URL of the repo is therefore `https://github.com/my-gituser/my-twa`. You will naturally have to replace the names in this example with the actual names that you're using.

Unless you connect a custom domain to GitHub Pages, the website will be published under the URL:

```console
https://my-gituser.github.io/my-twa
```

Since we're about to go live, it's time to use a proper TON Connect [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). This will allow us to style the initial connection dialog that appears in wallets like Tonkeeper.

Create the file `public/tonconnect-manifest.json` with this content:

```json
{
  "url": "https://my-gituser.github.io/my-twa",
  "name": "My TWA",
  "iconUrl": "https://my-gituser.github.io/my-twa/icon.png"
}
```

Replace the URL field with your webite URL and choose a short name of your dapp. For icon, create a PNG file 180x180 pixels in size and put it under `public/icon.png`.

After we publish the website, this manifest file will be available at:

```console
https://my-gituser.github.io/my-twa/tonconnect-manifest.json
```

Edit `src/main.tsx` and replace the constant `manifestUrl` with the future URL of your manifest:

```ts
const manifestUrl = 'https://my-gituser.github.io/my-twa/tonconnect-manifest.json';
```

Another step to remember is changing the `base` property of the Vite config file. If your future website is not going to be on the root of the domain (like you normally have with a custom domain), you must set `base` to the root directory of the website under the domain. In the example above, since the repo name is `my-twa` and the URL is `https://my-gituser.github.io/my-twa`, the website is published under the directory `/my-twa/` in the domain.

Let's set this in `vite.config.js`:

```ts
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/my-twa/',
});
```

Build the website for publishing by running in terminal:

```console
npm run build
```

Publishing to GitHub Pages is pretty straightforward. You would normally create a git branch named `gh-pages` in your repo that contains the static website files that were generated in the `dist` directory during the build. Then you would normally open the repo on GitHub's web UI and enable "Pages" under "Settings" (pointing the "Branch" to "gh-pages" after it is pushed).

For the exact steps, you can follow Vite's tutorial for [Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages).

Once the website is published, we can finally access it from mobile. Take your mobile device and open the URL `https://my-gituser.github.io/my-twa` in the mobile browser.

This is a good opportunity to try the mobile-mobile flow. In the mobile browser, tap on the "Connect Wallet" button and choose "Tonkeeper" (or any other supporting wallet you're using). This should switch you to the Tonkeeper mobile app where you can approve the connection. After approval, you should be switched back to the website. Now tap the "Increment" button. This should switch you to the Tonkeeper mobile app where you can approve the transaction. As you can see, in the mobile-mobile flow there are no QR codes involved since the dapp and the wallet run on the same device.

## Step 10: Publish web app as TWA in Telegram

Having our dapp accessible through a web browser is not enough. We want to make the most from the seamless integration into Telegram messenger. To feature our dapp in Telegram, we will also have to publish it as a TWA. Luckily, this is pretty easy to do.

The first step is to add the [TWA SDK](https://github.com/twa-dev) to our project. This will allow us to get theme properties while inside Telegram. Run in terminal:

```console
npm install @twa-dev/sdk
```

Then, edit `src/App.tsx` and add the following import:

```ts
import '@twa-dev/sdk';
```

Now rebuild the website for publishing by running in terminal:

```console
npm run build
```

Publish the updated website like we did in step 9, probably just by pushing it to git to the correct branch.

The final step is to create a new Telegram bot and have it showcase our website when opened. To do that we will interact with another Telegram bot called "botfather". On a device where your Telegram messenger is logged in, open [https://t.me/botfather](https://t.me/botfather) and then switch to the bot inside the Telegram app. Choose "Start".

To create a new bot select "/newbot". Choose a name for the bot and then a username according to the on-screen instructions. Make a note of the username since this is how end-users will access your TWA. Assuming that your bot username is `my_twa_bot`, it will be accessible in the Telegram chat by typing `@my_twa_bot` or through the URL [https://t.me/my_twa_bot](https://t.me/my_twa_bot). You can even purchase a premium Telegram username for your bot on the auction platform [Fragment](https://fragment.com).

Back in botfather, tap the menu button and edit your bots by selecting "/mybots". Select the bot you've just created. Select "Bot Settings" and then select "Menu Button". Now select "Configure menu button" to edit the URL and type your published website URL:

```console
https://my-gituser.github.io/my-twa
```

That's it! The bot should be ready. Start a Telegram chat with your bot via the username. Tap the menu button and voila - your published website will open inside Telegram as a TWA. Congratulations!

<img src="https://i.imgur.com/lVL1Bl0.png" width=300/><br>

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQBCaHNBo6KrAmyq6HdEB-rwxvRufrPTHd3VygbHcx4DisCt">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/3-twa/video.mp4" type="video/mp4">
</video>

Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAD0yCaOQwnT&amount=50000000">here</a>:
<img src="https://i.imgur.com/0UJOtIH.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/03-client/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new client project, you can start from a ready-made template that will save you most of the setup work:<br>[https://github.com/ton-community/twa-template](https://github.com/ton-community/twa-template)

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/03-client/options.json
URL: https://github.com/ton-community/tutorials/blob/main/docs/03-client/options.json
================================================
{
  "network": {
    "name": "Network",
    "order": 1,
    "default": "testnet",
    "options": {
      "testnet": {
        "name": "Testnet",
        "order": 1,
        "url": "https://ton.org/docs/develop/smart-contracts/environment/testnet",
        "pros": "free to use",
        "cons": "less reliable, requires special wallets"
      },
      "mainnet": {
        "name": "Mainnet",
        "url": "https://tonmon.xyz/?orgId=1&refresh=5m",
        "order": 2,
        "pros": "very reliable, fast, works with all wallets",
        "cons": "not free to use (but very cheap)"
      }
    }
  },
  "library": {
    "name": "Library",
    "order": 2,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      }
    }
  }
}


================================================
FILE: docs/03-client/testnet-npmton.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/03-client/testnet-npmton.html
================================================
[HTML Document converted to Markdown]

File: testnet-npmton.html
Size: 32.19 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 3: Step by step guide for building your first web client

In the previous tutorial we deployed a Counter smart contract to TON Blockchain (either testnet or mainnet). This contract acts as the _backend server_ of our application. In this tutorial, we will implement the _frontend_ or _client_ and allow end-users to access it from a web browser.

We will also recall that the appilcation that we're building is _decentralized_. Decentralized apps (dapps) have special [properties](https://defi.org/ton/#app-safety-guidelines). For example, their frontend must only run client-side. This means that we're not supposed to rely on a backend server for serving our frontend. If we had such a server, by definition it would be centralized (our end-users will not have equal access to it), and thus make our entire app centralized as well.

## Step 1: Define usage patterns

TON Blockchain is inspired by and complementary to [Telegram](https://telegram.org/) messenger. It aims for mass adoption by the next billion users. Since Telegram messenger is a mobile-first app, it makes sense that we design our dapp to be mobile-first as well.

The first usage pattern of our dapp would be through a regular web browser. Our frontend would be hosted on some domain using a service like [GitHub Pages](https://pages.github.com/). End-users would input the dapp URL in their favorite web browser and access our dapp using HTML and JavaScript. This is quite standard.

The second usage pattern is a bit more special. Since TON Blockchain complements the Telegram messenger, we will also want to embed our dapp right into the Telegram app itself. Telegram provides special API for building [Telegam Web Apps](https://core.telegram.org/bots/webapps) (TWAs). These tiny apps closely resemble websites and also rely on HTML and JavaScript. They normally run within the context of a Telegram bot and provide a sleek user experience without ever leaving the host Telegram app.

  

During the course of this tutorial we will create a single codebase that will accomodate both usage patterns.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

Since our frontend will run inside a browser, it will be implemented in JavaScript. The most convenient runtime for developing JavaScript projects is Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

The second tool we need is an initialized TON wallet like [Tonkeeper](https://tonkeeper.com). If you don't have a wallet, please take a look at tutorial 1. The wallet will communicate with our dapp via a protocol called [TON Connect 2](https://github.com/ton-connect). If you choose a different wallet than Tonkeeper, please verify it supports this version of TON Connect. Don't forget to make sure your wallet is connected to the correct network - mainnet or testnet.

## Step 3: Set up the project

We will build our frontend with [React](https://reactjs.org/). To create our project we will rely on [Vite](https://vitejs.dev/) and its React template. Choose a name for your project, for example `my-twa`, then open terminal and run the following:

```console
npm create vite@latest my-twa -- --template react-ts
cd my-twa
npm install
```

We will need to install a few more packages that will allow us to interact with TON Blockchain. We've seen these packages in action in the previous tutorial. Run the following in terminal:

```console
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
```

Last but not least, we will need to overcome [@ton/ton](https://www.npmjs.com/package/@ton/ton) library's reliance on Nodejs `Buffer` that isn't available in the browser. We can do that by installing a polyfill. Run the following in terminal:

```console
npm install vite-plugin-node-polyfills
```

Now modify the file `vite.config.ts` so it looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
});
```

To see your empty app template, run in terminal:

```console
npm run dev
```

Then open a web browser and direct it the URL shown on-screen (like `http://localhost:5173/`).

## Step 4: Set up TON Connect

[TON Connect](https://github.com/ton-connect) is the protocol by which our app will communicate with the end-user's wallet. The TON Connect React library will provide us with some useful services like showing the end-user a list of TON Connect 2 supported wallets, querying the user's wallet for its public address and sending a transaction through the wallet.

Install the library by running in terminal:

```console
npm install @tonconnect/ui-react
```

When our app connects to the user's wallet, it will identify itself using a [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) file. The wallet will ask for the user's permission to connect to the app and display the information from the manifest. Since the manifest needs to be publicly available on the Internet, we're going to use an example one that I've deployed in advance during development. Later, when we deploy our website, we will replace the example manifest with your real one.

Modify the file `src/main.tsx` to use the TON Connect provider:

```tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
```

## Step 5: Add a Connect button to the app

The first action we're going to offer the user is to _Connect_ their wallet to the app. By connecting, the user agrees to share their public wallet address with the app. This isn't very dangerous since the entire transaction history of the wallet and its balance are publicly available on-chain anyways.

Edit the file `src/App.tsx` and replace its contents with the following:

```tsx
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App
```

The only thing our new app UI will have is the Connect button. To run the app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. I'm assuming you're using the web browser on your desktop (where you're developing) and your Tonkeeper wallet is installed on your mobile device. Click "Connect Wallet" on the desktop and choose "Tonkeeper" (or any other supporting wallet you're using).

TON Connect supports both mobile-mobile user flows and desktop-mobile user flows. Since development is a desktop-mobile flow, TON Connect will rely on scanning QR codes in order to communicate with the wallet running on your mobile device. Open the Tonkeeper mobile app, tap the QR button on the top right and scan the code from your desktop screen.

If everything is wired properly, you should see a confirmation dialong in the wallet mobile app. If you approve the connection, you will see your address in the web app UI!

## Step 6: Read the counter value from the chain

It's time to interact with our Counter contract and show the current counter value. To do that, we will need the TypeScript interface class that we created in tutorial 2. This class is useful because it defines all possible interactions with the contract in a manner that abstracts implementation and encoding details. This is particularly useful when you have one developer in your team that writes the contract and a different developer that builds the frontend.

Copy `counter.ts` from tutorial 2 to `src/contracts/counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/src/contracts/counter.ts)).

The next thing we'll do is implement a general purpose React [hook](https://reactjs.org/docs/hooks-intro.html) that will assist us in initializing async objects. Create the file `src/hooks/useAsyncInitialize.ts` with the following content:

```ts
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
```

Next, we're going to create another React hook that will rely on `useAsyncInitialize` and will initialize an RPC client in our app. An RPC service provider similar to [Infura](https://infura.io) on Ethereum will allow us to query data from the chain. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Create the file `src/hooks/useTonClient.ts` with the following content:

```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
  );
}
```

Our final hook will open the Counter contract instance on-chain by address and allow the app to access it. When our frontend developer starts working on the client, the contract should already be deployed. This means all they need to access it is the deployment address. We've done the deployment in tutorial 2 step 8. The address we got was `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb` but yours should be different.

Create the file `src/hooks/useCounterContract.ts` with the following content. Be sure to replace our deployed contract address with yours in the code below:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
```

We're almost done. Let's add some simple UI to show this information on the main app screen. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App
```

To rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see both the counter address and the counter value taken from the chain on the main screen. As you recall, we initialized the counter value to a very large value (number of milliseconds since the epoch, something like 1674271323207). Don't worry about styling, we will handle this later.

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 7: Increment the counter on-chain

The last interaction was read-only, let's change the contract state by sending a transaction. The main action our counter contract supports is _increment_. Let's add a button to the main screen that sends this transaction. As you recall, sending a transaction on-chain costs gas, so we would expect the wallet to approve this action with the user and show how much TON coin will be spent.

Before starting, we're going to add another hook that will generate a `sender` object from the TON Connect interface. This sender represents the connected wallet and will allow us to send transactions on their behalf. While we're at it, we'll also expose the wallet connection state so we can alter the UI accordingly.

Create the file `src/hooks/useTonConnect.ts` with the following content:

```ts
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}
```

The next thing we're going to do is improve our existing `useCounterContract` hook and add two small features. The first is automatic polling of the counter value every 5 seconds. This will come in handy to show the user that the value indeed changed. The second is exposing the `sendIncrement` of our interface class and wiring it to the `sender`.

Open the file `src/hooks/useCounterContract.ts` and replace its contents with:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
```

We're almost done. Let's add simple UI to allow the user to trigger the increment. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App
```

Time to rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see a new "Increment" link on the bottom of the screen. I'm assuming that you're still on desktop, make a note of the counter value and click the link.

Since your mobile Tonkeeper wallet is connected, this action should reach the Tonkeeper mobile app and cause it to display a confirmation dialog. Notice that this dialog shows the gas cost of the transaction. Approve the transaction on the mobile app. Since the app and wallet are connected, your approval should reach the app and cause it to display an indication that the transaction was sent. As you recall, new transactions must wait until they're included in a block, so this should take 5-10 seconds.

If everything is working, the counter value on screen should refresh automatically and you should see a value that is higher by one.

## Step 8: Style the app

Functionally our app is working, but we can definitely improve what it looks like. Giving a polished user experience is particularly important on TON Blockchain. We are aiming to reach mass adoption and the next billion users. We won't succeed unless our apps look as polished as the ones these users are already using.

Replace `src/index.css` with the following content:

```css
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.Disabled {
  filter: brightness(50%);
  cursor: initial;
}

.Button.Active:hover {
  filter: brightness(105%);
}

.Hint {
  color: var(--tg-theme-hint-color);
}

.Card {
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #131415;
    --tg-theme-text-color: #fff;
    --tg-theme-button-color: #32a6fb;
    --tg-theme-button-text-color: #fff;
  }

  .Card {
    background-color: var(--tg-theme-bg-color);
    filter: brightness(165%);
  }

  .CounterValue {
    border-radius: 16px;
    color: white;
    padding: 10px;
  }
}
```

As usual, to rebuild the web app, run in terminal:

```console
npm run dev
```

And refresh the web browser viewing the URL shown on-screen. Our app should look pretty now.

Up until now we used our app in a desktop-mobile flow due to the development cycle. It would be nice to try our app in a mobile-mobile flow. This means we need to open the app's web page from a mobile device. This will be much easier to do after our web app is published to the Internet.

## Step 9: Publish web app to GitHub Pages

I believe that the best place to publish dapps is [GitHub Pages](https://pages.github.com/) - not just for development but also for production. GitHub Pages is a free service for open source projects that allows them to publish static websites (HTML/CSS/JS) directly from a GitHub repo. Since all dapps should always be [open source](https://defi.org/ton/#app-safety-guidelines), all dapps qualify. GitHub Pages also supports [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), so the end result will be identical to any other production publishing service.

Another benefit of GitHub Pages is that it supports static websites only that only run client-side. There's no backend that can run code or server-side rendering. This limitation is actually a feature for dapps, because decentralized apps should never depend on backend servers as those are centralized.

The last important feature of GitHub Pages that makes it particularly appropriate for dapps is that the reliance on a git repo gives us many community governance features for free. For example, a group of maintainers can share the website deployment privilege easily because all of them have write access to the repo. Outside collaborators from the community can submit PRs and if those are merged, these community members can influence the live dapp. And lastly, if anyone from the community is unhappy with how the dapp is governed, they can always fork the GitHub repo and create their own independent client that can also be published to GitHub Pages in one click.

Let's assume that your GitHub username is `my-gituser` and that you pushed the client project to a GitHub repo named `my-twa` under this user. The GitHub URL of the repo is therefore `https://github.com/my-gituser/my-twa`. You will naturally have to replace the names in this example with the actual names that you're using.

Unless you connect a custom domain to GitHub Pages, the website will be published under the URL:

```console
https://my-gituser.github.io/my-twa
```

Since we're about to go live, it's time to use a proper TON Connect [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). This will allow us to style the initial connection dialog that appears in wallets like Tonkeeper.

Create the file `public/tonconnect-manifest.json` with this content:

```json
{
  "url": "https://my-gituser.github.io/my-twa",
  "name": "My TWA",
  "iconUrl": "https://my-gituser.github.io/my-twa/icon.png"
}
```

Replace the URL field with your webite URL and choose a short name of your dapp. For icon, create a PNG file 180x180 pixels in size and put it under `public/icon.png`.

After we publish the website, this manifest file will be available at:

```console
https://my-gituser.github.io/my-twa/tonconnect-manifest.json
```

Edit `src/main.tsx` and replace the constant `manifestUrl` with the future URL of your manifest:

```ts
const manifestUrl = 'https://my-gituser.github.io/my-twa/tonconnect-manifest.json';
```

Another step to remember is changing the `base` property of the Vite config file. If your future website is not going to be on the root of the domain (like you normally have with a custom domain), you must set `base` to the root directory of the website under the domain. In the example above, since the repo name is `my-twa` and the URL is `https://my-gituser.github.io/my-twa`, the website is published under the directory `/my-twa/` in the domain.

Let's set this in `vite.config.js`:

```ts
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/my-twa/',
});
```

Build the website for publishing by running in terminal:

```console
npm run build
```

Publishing to GitHub Pages is pretty straightforward. You would normally create a git branch named `gh-pages` in your repo that contains the static website files that were generated in the `dist` directory during the build. Then you would normally open the repo on GitHub's web UI and enable "Pages" under "Settings" (pointing the "Branch" to "gh-pages" after it is pushed).

For the exact steps, you can follow Vite's tutorial for [Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages).

Once the website is published, we can finally access it from mobile. Take your mobile device and open the URL `https://my-gituser.github.io/my-twa` in the mobile browser.

This is a good opportunity to try the mobile-mobile flow. In the mobile browser, tap on the "Connect Wallet" button and choose "Tonkeeper" (or any other supporting wallet you're using). This should switch you to the Tonkeeper mobile app where you can approve the connection. After approval, you should be switched back to the website. Now tap the "Increment" button. This should switch you to the Tonkeeper mobile app where you can approve the transaction. As you can see, in the mobile-mobile flow there are no QR codes involved since the dapp and the wallet run on the same device.

## Step 10: Publish web app as TWA in Telegram

Having our dapp accessible through a web browser is not enough. We want to make the most from the seamless integration into Telegram messenger. To feature our dapp in Telegram, we will also have to publish it as a TWA. Luckily, this is pretty easy to do.

The first step is to add the [TWA SDK](https://github.com/twa-dev) to our project. This will allow us to get theme properties while inside Telegram. Run in terminal:

```console
npm install @twa-dev/sdk
```

Then, edit `src/App.tsx` and add the following import:

```ts
import '@twa-dev/sdk';
```

Now rebuild the website for publishing by running in terminal:

```console
npm run build
```

Publish the updated website like we did in step 9, probably just by pushing it to git to the correct branch.

The final step is to create a new Telegram bot and have it showcase our website when opened. To do that we will interact with another Telegram bot called "botfather". On a device where your Telegram messenger is logged in, open [https://t.me/botfather](https://t.me/botfather) and then switch to the bot inside the Telegram app. Choose "Start".

To create a new bot select "/newbot". Choose a name for the bot and then a username according to the on-screen instructions. Make a note of the username since this is how end-users will access your TWA. Assuming that your bot username is `my_twa_bot`, it will be accessible in the Telegram chat by typing `@my_twa_bot` or through the URL [https://t.me/my\_twa\_bot](https://t.me/my_twa_bot). You can even purchase a premium Telegram username for your bot on the auction platform [Fragment](https://fragment.com).

Back in botfather, tap the menu button and edit your bots by selecting "/mybots". Select the bot you've just created. Select "Bot Settings" and then select "Menu Button". Now select "Configure menu button" to edit the URL and type your published website URL:

```console
https://my-gituser.github.io/my-twa
```

That's it! The bot should be ready. Start a Telegram chat with your bot via the username. Tap the menu button and voila - your published website will open inside Telegram as a TWA. Congratulations!

![](https://i.imgur.com/lVL1Bl0.png)  

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQBCaHNBo6KrAmyq6HdEB-rwxvRufrPTHd3VygbHcx4DisCt) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAD0yCaOQwnT&amount=50000000): ![QR-code](https://i.imgur.com/0UJOtIH.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/03-client/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new client project, you can start from a ready-made template that will save you most of the setup work:  
[https://github.com/ton-community/twa-template](https://github.com/ton-community/twa-template)

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 32, Images: 2, Headings: 13, Paragraphs: 115



================================================
FILE: docs/03-client/testnet-npmton.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/03-client/testnet-npmton.md
================================================

# TON Hello World part 3: Step by step guide for building your first web client

In the previous tutorial we deployed a Counter smart contract to TON Blockchain (either testnet or mainnet). This contract acts as the *backend server* of our application. In this tutorial, we will implement the *frontend* or *client* and allow end-users to access it from a web browser.

We will also recall that the appilcation that we're building is *decentralized*. Decentralized apps (dapps) have special [properties](https://defi.org/ton/#app-safety-guidelines). For example, their frontend must only run client-side. This means that we're not supposed to rely on a backend server for serving our frontend. If we had such a server, by definition it would be centralized (our end-users will not have equal access to it), and thus make our entire app centralized as well.

## Step 1: Define usage patterns

TON Blockchain is inspired by and complementary to [Telegram](https://telegram.org/) messenger. It aims for mass adoption by the next billion users. Since Telegram messenger is a mobile-first app, it makes sense that we design our dapp to be mobile-first as well.

The first usage pattern of our dapp would be through a regular web browser. Our frontend would be hosted on some domain using a service like [GitHub Pages](https://pages.github.com/). End-users would input the dapp URL in their favorite web browser and access our dapp using HTML and JavaScript. This is quite standard.

The second usage pattern is a bit more special. Since TON Blockchain complements the Telegram messenger, we will also want to embed our dapp right into the Telegram app itself. Telegram provides special API for building [Telegam Web Apps](https://core.telegram.org/bots/webapps) (TWAs). These tiny apps closely resemble websites and also rely on HTML and JavaScript. They normally run within the context of a Telegram bot and provide a sleek user experience without ever leaving the host Telegram app.

<video src="https://ton-community.github.io/tutorials/assets/twa.mp4" loop muted autoplay playsinline width=300></video><br>

During the course of this tutorial we will create a single codebase that will accomodate both usage patterns.

## Step 2: Set up your local machine

Before we can start writing code, we need to install certain developer tools on our computer.

Since our frontend will run inside a browser, it will be implemented in JavaScript. The most convenient runtime for developing JavaScript projects is Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

The second tool we need is an initialized TON wallet like [Tonkeeper](https://tonkeeper.com). If you don't have a wallet, please take a look at tutorial 1. The wallet will communicate with our dapp via a protocol called [TON Connect 2](https://github.com/ton-connect). If you choose a different wallet than Tonkeeper, please verify it supports this version of TON Connect. Don't forget to make sure your wallet is connected to the correct network - mainnet or testnet.

## Step 3: Set up the project

We will build our frontend with [React](https://reactjs.org/). To create our project we will rely on [Vite](https://vitejs.dev/) and its React template. Choose a name for your project, for example `my-twa`, then open terminal and run the following:

```console
npm create vite@latest my-twa -- --template react-ts
cd my-twa
npm install
```

We will need to install a few more packages that will allow us to interact with TON Blockchain. We've seen these packages in action in the previous tutorial. Run the following in terminal:

```console
npm install @ton/ton @ton/core @ton/crypto
npm install @orbs-network/ton-access
```

Last but not least, we will need to overcome [@ton/ton](https://www.npmjs.com/package/@ton/ton) library's reliance on Nodejs `Buffer` that isn't available in the browser. We can do that by installing a polyfill. Run the following in terminal:

```console
npm install vite-plugin-node-polyfills
```

Now modify the file `vite.config.ts` so it looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
});
```

To see your empty app template, run in terminal:

```console
npm run dev
```

Then open a web browser and direct it the URL shown on-screen (like `http://localhost:5173/`).

## Step 4: Set up TON Connect

[TON Connect](https://github.com/ton-connect) is the protocol by which our app will communicate with the end-user's wallet. The TON Connect React library will provide us with some useful services like showing the end-user a list of TON Connect 2 supported wallets, querying the user's wallet for its public address and sending a transaction through the wallet.

Install the library by running in terminal:

```console
npm install @tonconnect/ui-react
```

When our app connects to the user's wallet, it will identify itself using a [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) file. The wallet will ask for the user's permission to connect to the app and display the information from the manifest. Since the manifest needs to be publicly available on the Internet, we're going to use an example one that I've deployed in advance during development. Later, when we deploy our website, we will replace the example manifest with your real one.

Modify the file `src/main.tsx` to use the TON Connect provider:

```tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
```

## Step 5: Add a Connect button to the app

The first action we're going to offer the user is to *Connect* their wallet to the app. By connecting, the user agrees to share their public wallet address with the app. This isn't very dangerous since the entire transaction history of the wallet and its balance are publicly available on-chain anyways.

Edit the file `src/App.tsx` and replace its contents with the following:

```tsx
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}

export default App
```

The only thing our new app UI will have is the Connect button. To run the app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. I'm assuming you're using the web browser on your desktop (where you're developing) and your Tonkeeper wallet is installed on your mobile device. Click "Connect Wallet" on the desktop and choose "Tonkeeper" (or any other supporting wallet you're using).

TON Connect supports both mobile-mobile user flows and desktop-mobile user flows. Since development is a desktop-mobile flow, TON Connect will rely on scanning QR codes in order to communicate with the wallet running on your mobile device. Open the Tonkeeper mobile app, tap the QR button on the top right and scan the code from your desktop screen.

If everything is wired properly, you should see a confirmation dialong in the wallet mobile app. If you approve the connection, you will see your address in the web app UI!

## Step 6: Read the counter value from the chain

It's time to interact with our Counter contract and show the current counter value. To do that, we will need the TypeScript interface class that we created in tutorial 2. This class is useful because it defines all possible interactions with the contract in a manner that abstracts implementation and encoding details. This is particularly useful when you have one developer in your team that writes the contract and a different developer that builds the frontend.

Copy `counter.ts` from tutorial 2 to `src/contracts/counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/src/contracts/counter.ts)).

The next thing we'll do is implement a general purpose React [hook](https://reactjs.org/docs/hooks-intro.html) that will assist us in initializing async objects. Create the file `src/hooks/useAsyncInitialize.ts` with the following content:

```ts
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
```

Next, we're going to create another React hook that will rely on `useAsyncInitialize` and will initialize an RPC client in our app. An RPC service provider similar to [Infura](https://infura.io) on Ethereum will allow us to query data from the chain. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Create the file `src/hooks/useTonClient.ts` with the following content:

```ts
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
  );
}
```

Our final hook will open the Counter contract instance on-chain by address and allow the app to access it. When our frontend developer starts working on the client, the contract should already be deployed. This means all they need to access it is the deployment address. We've done the deployment in tutorial 2 step 8. The address we got was `EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb` but yours should be different.

Create the file `src/hooks/useCounterContract.ts` with the following content. Be sure to replace our deployed contract address with yours in the code below:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
```

We're almost done. Let's add some simple UI to show this information on the main app screen. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { value, address } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}

export default App
```

To rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see both the counter address and the counter value taken from the chain on the main screen. As you recall, we initialized the counter value to a very large value (number of milliseconds since the epoch, something like 1674271323207). Don't worry about styling, we will handle this later.

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 7: Increment the counter on-chain

The last interaction was read-only, let's change the contract state by sending a transaction. The main action our counter contract supports is *increment*. Let's add a button to the main screen that sends this transaction. As you recall, sending a transaction on-chain costs gas, so we would expect the wallet to approve this action with the user and show how much TON coin will be spent.

Before starting, we're going to add another hook that will generate a `sender` object from the TON Connect interface. This sender represents the connected wallet and will allow us to send transactions on their behalf. While we're at it, we'll also expose the wallet connection state so we can alter the UI accordingly.

Create the file `src/hooks/useTonConnect.ts` with the following content:

```ts
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}
```

The next thing we're going to do is improve our existing `useCounterContract` hook and add two small features. The first is automatic polling of the counter value every 5 seconds. This will come in handy to show the user that the value indeed changed. The second is exposing the `sendIncrement` of our interface class and wiring it to the `sender`.

Open the file `src/hooks/useCounterContract.ts` and replace its contents with:

```ts
import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
```

We're almost done. Let's add simple UI to allow the user to trigger the increment. Replace `src/App.tsx` with the following content:

```ts
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App
```

Time to rebuild the web app, run in terminal:

```console
npm run dev
```

Then refresh the web browser viewing the URL shown on-screen. You should see a new "Increment" link on the bottom of the screen. I'm assuming that you're still on desktop, make a note of the counter value and click the link.

Since your mobile Tonkeeper wallet is connected, this action should reach the Tonkeeper mobile app and cause it to display a confirmation dialog. Notice that this dialog shows the gas cost of the transaction. Approve the transaction on the mobile app. Since the app and wallet are connected, your approval should reach the app and cause it to display an indication that the transaction was sent. As you recall, new transactions must wait until they're included in a block, so this should take 5-10 seconds.

If everything is working, the counter value on screen should refresh automatically and you should see a value that is higher by one.

## Step 8: Style the app

Functionally our app is working, but we can definitely improve what it looks like. Giving a polished user experience is particularly important on TON Blockchain. We are aiming to reach mass adoption and the next billion users. We won't succeed unless our apps look as polished as the ones these users are already using.

Replace `src/index.css` with the following content:

```css
:root {
  --tg-theme-bg-color: #efeff3;
  --tg-theme-button-color: #63d0f9;
  --tg-theme-button-text-color: black;
}

.App {
  height: 100vh;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.Container {
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.Button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.Disabled {
  filter: brightness(50%);
  cursor: initial;
}

.Button.Active:hover {
  filter: brightness(105%);
}

.Hint {
  color: var(--tg-theme-hint-color);
}

.Card {
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #131415;
    --tg-theme-text-color: #fff;
    --tg-theme-button-color: #32a6fb;
    --tg-theme-button-text-color: #fff;
  }

  .Card {
    background-color: var(--tg-theme-bg-color);
    filter: brightness(165%);
  }

  .CounterValue {
    border-radius: 16px;
    color: white;
    padding: 10px;
  }
}
```

As usual, to rebuild the web app, run in terminal:

```console
npm run dev
```

And refresh the web browser viewing the URL shown on-screen. Our app should look pretty now.

Up until now we used our app in a desktop-mobile flow due to the development cycle. It would be nice to try our app in a mobile-mobile flow. This means we need to open the app's web page from a mobile device. This will be much easier to do after our web app is published to the Internet.

## Step 9: Publish web app to GitHub Pages

I believe that the best place to publish dapps is [GitHub Pages](https://pages.github.com/) - not just for development but also for production. GitHub Pages is a free service for open source projects that allows them to publish static websites (HTML/CSS/JS) directly from a GitHub repo. Since all dapps should always be [open source](https://defi.org/ton/#app-safety-guidelines), all dapps qualify. GitHub Pages also supports [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), so the end result will be identical to any other production publishing service.

Another benefit of GitHub Pages is that it supports static websites only that only run client-side. There's no backend that can run code or server-side rendering. This limitation is actually a feature for dapps, because decentralized apps should never depend on backend servers as those are centralized.

The last important feature of GitHub Pages that makes it particularly appropriate for dapps is that the reliance on a git repo gives us many community governance features for free. For example, a group of maintainers can share the website deployment privilege easily because all of them have write access to the repo. Outside collaborators from the community can submit PRs and if those are merged, these community members can influence the live dapp. And lastly, if anyone from the community is unhappy with how the dapp is governed, they can always fork the GitHub repo and create their own independent client that can also be published to GitHub Pages in one click.

Let's assume that your GitHub username is `my-gituser` and that you pushed the client project to a GitHub repo named `my-twa` under this user. The GitHub URL of the repo is therefore `https://github.com/my-gituser/my-twa`. You will naturally have to replace the names in this example with the actual names that you're using.

Unless you connect a custom domain to GitHub Pages, the website will be published under the URL:

```console
https://my-gituser.github.io/my-twa
```

Since we're about to go live, it's time to use a proper TON Connect [manifest](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). This will allow us to style the initial connection dialog that appears in wallets like Tonkeeper.

Create the file `public/tonconnect-manifest.json` with this content:

```json
{
  "url": "https://my-gituser.github.io/my-twa",
  "name": "My TWA",
  "iconUrl": "https://my-gituser.github.io/my-twa/icon.png"
}
```

Replace the URL field with your webite URL and choose a short name of your dapp. For icon, create a PNG file 180x180 pixels in size and put it under `public/icon.png`.

After we publish the website, this manifest file will be available at:

```console
https://my-gituser.github.io/my-twa/tonconnect-manifest.json
```

Edit `src/main.tsx` and replace the constant `manifestUrl` with the future URL of your manifest:

```ts
const manifestUrl = 'https://my-gituser.github.io/my-twa/tonconnect-manifest.json';
```

Another step to remember is changing the `base` property of the Vite config file. If your future website is not going to be on the root of the domain (like you normally have with a custom domain), you must set `base` to the root directory of the website under the domain. In the example above, since the repo name is `my-twa` and the URL is `https://my-gituser.github.io/my-twa`, the website is published under the directory `/my-twa/` in the domain.

Let's set this in `vite.config.js`:

```ts
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/my-twa/',
});
```

Build the website for publishing by running in terminal:

```console
npm run build
```

Publishing to GitHub Pages is pretty straightforward. You would normally create a git branch named `gh-pages` in your repo that contains the static website files that were generated in the `dist` directory during the build. Then you would normally open the repo on GitHub's web UI and enable "Pages" under "Settings" (pointing the "Branch" to "gh-pages" after it is pushed).

For the exact steps, you can follow Vite's tutorial for [Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages).

Once the website is published, we can finally access it from mobile. Take your mobile device and open the URL `https://my-gituser.github.io/my-twa` in the mobile browser.

This is a good opportunity to try the mobile-mobile flow. In the mobile browser, tap on the "Connect Wallet" button and choose "Tonkeeper" (or any other supporting wallet you're using). This should switch you to the Tonkeeper mobile app where you can approve the connection. After approval, you should be switched back to the website. Now tap the "Increment" button. This should switch you to the Tonkeeper mobile app where you can approve the transaction. As you can see, in the mobile-mobile flow there are no QR codes involved since the dapp and the wallet run on the same device.

## Step 10: Publish web app as TWA in Telegram

Having our dapp accessible through a web browser is not enough. We want to make the most from the seamless integration into Telegram messenger. To feature our dapp in Telegram, we will also have to publish it as a TWA. Luckily, this is pretty easy to do.

The first step is to add the [TWA SDK](https://github.com/twa-dev) to our project. This will allow us to get theme properties while inside Telegram. Run in terminal:

```console
npm install @twa-dev/sdk
```

Then, edit `src/App.tsx` and add the following import:

```ts
import '@twa-dev/sdk';
```

Now rebuild the website for publishing by running in terminal:

```console
npm run build
```

Publish the updated website like we did in step 9, probably just by pushing it to git to the correct branch.

The final step is to create a new Telegram bot and have it showcase our website when opened. To do that we will interact with another Telegram bot called "botfather". On a device where your Telegram messenger is logged in, open [https://t.me/botfather](https://t.me/botfather) and then switch to the bot inside the Telegram app. Choose "Start".

To create a new bot select "/newbot". Choose a name for the bot and then a username according to the on-screen instructions. Make a note of the username since this is how end-users will access your TWA. Assuming that your bot username is `my_twa_bot`, it will be accessible in the Telegram chat by typing `@my_twa_bot` or through the URL [https://t.me/my_twa_bot](https://t.me/my_twa_bot). You can even purchase a premium Telegram username for your bot on the auction platform [Fragment](https://fragment.com).

Back in botfather, tap the menu button and edit your bots by selecting "/mybots". Select the bot you've just created. Select "Bot Settings" and then select "Menu Button". Now select "Configure menu button" to edit the URL and type your published website URL:

```console
https://my-gituser.github.io/my-twa
```

That's it! The bot should be ready. Start a Telegram chat with your bot via the username. Tap the menu button and voila - your published website will open inside Telegram as a TWA. Congratulations!

<img src="https://i.imgur.com/lVL1Bl0.png" width=300/><br>

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQBCaHNBo6KrAmyq6HdEB-rwxvRufrPTHd3VygbHcx4DisCt">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/3-twa/video.mp4" type="video/mp4">
</video>

Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAD0yCaOQwnT&amount=50000000">here</a>:
<img src="https://i.imgur.com/0UJOtIH.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/03-client/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new client project, you can start from a ready-made template that will save you most of the setup work:<br>[https://github.com/ton-community/twa-template](https://github.com/ton-community/twa-template)

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/04-testing/index.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/04-testing/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 33.11 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

     TON Hello World part 4: Step by step guide for testing your first smart contract

[

![](../assets/logo.svg)

Tutorials



](https://ton-community.github.io/tutorials)

### Library

![](../assets/arrow-down.svg)

-   #### npm ton (JavaScript)
    
    [docs](https://github.com/ton-community/ton)
    
    Pros: more popular, full TypeScript support, elegant api
    
    Cons: no support for all ton services
    

### Tutorials

-   [01\. Working with your first wallet](https://helloworld.tonstudio.io/01-wallet)
-   [02\. Writing your first smart contract](https://helloworld.tonstudio.io/02-contract)
-   [03\. Building your first web client](https://helloworld.tonstudio.io/03-client)
-   [04\. Testing your first smart contract](https://helloworld.tonstudio.io/04-testing)

### Help

-   [Problems with this tutorial?](https://github.com/ton-community/tutorials/blob/main/HELP.md)

# TON Hello World part 4: Step by step guide for testing your first smart contract

![](../assets/authors/talkol.jpg) by Tal Kol

[](https://t.me/talkol)[](https://twitter.com/koltal)

Testing is a big part of smart contract development. Smart contracts often deal with money and we don't want any of our users losing money because the smart contract had a bug. This is why it's normally expected from smart contract developers to share an automated test suite next to their FunC implementation. Every user that wants to be convinced that the contract is working as expected is welcome to execute the test suite and see for themselves.

A thorough test suite is also a good signal to your users that you've taken your role as a contract developer seriously. I would personally be very hesitant to deposit a substantial amount of money in any contract that has no tests. Since _code is law_, any bug in the contract code is also part of the agreement, so a user wouldn't really have anyone to blame for money lost, but themselves.

Personally, I don't view testing as an afterthought taking place only when your code is complete. If done correctly, tests can be a powerful aid to the development process itself from the beginning, that will allow you to write better code faster.

## Oh so many ways to test

_Warning - this specific section is a bit more advanced than beginner, feel free to skip it directly to step 1 if you trust my judgement of how to test. If you're interested in an overly detailed overview of what other testing methodologies exist in our ecosystem please read on._

Because testing is such as big deal in smart contract development, there's a surprising amount of tools and infrastructure in the TON ecosystem devoted to this topic. Before jumping in to the methodology that I believe in, I want to give a quick overview of the plethora of testing tools that are available out there:

1.  **Deploying your contract to testnet** - Testnet is a live alternative instance of the entire TON Blockchain where TON coin isn't the real deal and is free to get. This instance is obviously not as secure as mainnet, but offers an interesting staging environment where you can play.
    
2.  **Local blockchain with MyLocalTon** - [MyLocalTon](https://github.com/neodiX42/MyLocalTon) is a Java-based desktop executable that runs a personal local instance of TON Blockchain on your machine that you can deploy contracts to and interact with. Another way to run a local private TON network is using Kubernetes with [ton-k8s](https://github.com/disintar/ton-k8s).
    
3.  **Writing tests in FunC** - [toncli](https://github.com/disintar/toncli) is a command-line tool written in Python that runs on your machine and supports [debug](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md) and [unit tests](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md) for FunC contracts where the tests are also written in FunC ([example](https://github.com/BorysMinaiev/func-contest-1-tests-playground/blob/main/task-1/tests/test.fc)).
    
4.  **Bare-bones TVM with Sandbox** - [Sandbox](https://github.com/ton-org/sandbox) is a bare-bones version of just the [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) running on [WebAssembly](https://webassembly.org/) with a thin JavaScript wrapper that allows test interactions from TypeScript.
    
5.  **Deploying beta contracts to mainnet** - This form of "testing in production" simply deploys alternative beta versions of your contracts to mainnet and uses real (not free) TON coin to play with them in a real environment. If you found a bug, you simply deploy new fixed beta versions and waste a little more money.
    

So which method should you choose? You definitely don't need all of them.

My team started building smart contracts on Ethereum in 2017, we've witnessed the evolution of the art of smart contract development almost from its infancy. While I'm well aware of [fundamental differences](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) between TON and the EVM, testing between the two platforms is not fundamentally different. All of the above approaches appeared on Ethereum at one point or another. And all of them practically disappeared - except two - the last two.

1.  Testnets were once popular on Ethereum (funny names like Ropsten, Rinkeby and Goerli) but turned out to be a bad tradeoff between convenience and realism - they're slow and often more difficult to work with than mainnet (some wallets aren't compatible) and useless for integration tests with other contracts (eg. your contract interacts with somebody else's token) because nobody bothers to maintain up-to-date versions of their projects on testnet.
    
2.  Local desktop versions of the entire blockchain, like [Ganache UI](https://trufflesuite.com/ganache/), proved to be too slow for unit tests and ineffective for integration tests (for the same reason as testnets). They also don't play nicely with [CI](https://docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration). People often confuse [ganache-cli](https://github.com/trufflesuite/ganache) with a local blockchain, but it is actually a bare-bones EVM implemented in JavaScript.
    
3.  Testing Solidity with Solidity proved to be too cumbersome as smart contract languages are inherently limited and restrictive by design and efficient testing seems to flourish on freeform languages like JavaScript. Trying to code a complex expectation in Solidity or simulate a difficult scenario is just too painful.
    
4.  Bare-bones EVM turned out to be the holy grail. Most of the testing on Ethereum today takes place on [Hardhat](https://hardhat.org/) and Hardhat is a thin wrapper around [EthereumJs](https://github.com/ethereumjs/ethereumjs-monorepo) which is an EVM implementation in JavaScript. This approach turned out to be the most convenient (ultra-fast CI-friendly unit tests) as well as realistic where it matters (live lazy-loaded [forks](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks) of mainnets for integration tests).
    
5.  Testing in production is useful for the last mile. Ethereum has less than [5 million](https://www.fool.com/the-ascent/cryptocurrency/articles/more-people-own-ethereum-than-ever-before-heres-why/) active users yet over [40 million](https://cryptopotato.com/over-44-million-contracts-deployed-to-ethereum-since-genesis-research/) deployed contracts. The vast majority of all deployed contracts on Ethereum mainnet are beta versions that developers deployed for a few tests and then abandoned. Don't feel bad about polluting mainnet with garbage, nobody cares.
    

After carefully considering all available approaches, I hope I convinced you why we're going to spend 90% of our time testing with approach (4) and 10% of our time testing with approach (5). We're going to conveniently forget about the other approaches and avoid using them at all.

## Step 1: Set up the project

Since we're using TypeScript for tests, make sure [Nodejs](https://nodejs.org/) is installed by running `node -v` in terminal and the version is at least v18. If you have an old version, you can upgrade with [nvm](https://github.com/nvm-sh/nvm).

Let's create a new directory for our project. Open terminal in the project directory and run the following:

```console
npm install typescript jest @types/jest ts-jest
```

This will install TypeScript and the popular [jest](https://jestjs.io/) test runner. To configure TypeScript to run correctly, we need to create the file `tsconfig.json` and put it in the project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

And to configure jest to run correctly, we need to create the file `jest.config.js` and put it in the project root:

```js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};
```

And finally, run in terminal:

```console
npm install @ton/core @ton/sandbox @ton/test-utils
```

This will install [Sandbox](https://github.com/ton-org/sandbox) and its dependencies. Sandbox is our magical library that will emulate TON Blockchain locally by running a bare-bones version of the TVM in process. This will guarantee that our tests will be blazingly fast and completely isolated.

## Step 2: Load our contract in a test

Quick reminder, in tutorial 2, we compiled our Counter smart contract in step 6 and generated the file `counter.cell` which contains the TVM bytecode for our contract (code cell). In step 7, before deploying the contract, we initialized its persistent storage (data cell). Then, we created the TypeScript interface class `counter.ts` that combines the two to deploy our contract.

Dig into your completed tutorial 2 and copy both `counter.cell` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.cell)) and `counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.ts)) to the project root.

We're going to deploy the Counter contract in our test using the interface class in an almost identical way to how we deployed it to the actual chain in tutorial 2:

```ts
// prepare Counter's initial code and data cells for deployment
const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
const counter = Counter.createForDeploy(counterCode, initialCounterValue);
```

Notice that this time we can initialize the counter value to a simple number like 17 because we're no longer afraid of collisions. All users of this tutorial can end up with the same contract address and that's ok since Sandbox creates an isolated private blockchain.

Before we start writing tests, let's create our test skeleton. In the skeleton, before each test starts, we'll initialize a fresh instance of the entire blockchain. This instance will require a wallet with enough TON for all our gas needs (we call this a "treasury") and a deployed version of the Counter.

Create the file `step2.spec.ts` with the following content:

```ts
import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;

  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should run the first test", async () => {
    // currently empty, will place a test body here soon
  });
});
```

This code is remarkably similar to the deploy code we had in tutorial 2. This is the benefit of using the TypeScript interface class. No matter where we use our contract, we always access it in the same familiar way.

The only strange part in this snippet is the treasury. What is it exactly? A treasury is simply a wallet contract, very similar to the v4 wallet you used with [Tonkeeper](https://tonkeeper.com) in previous tutorials. What's useful with a treasury is that it's already pre initialized with a big TON coin balance. There's no need to fund it from a faucet.

To execute the test, run in terminal:

```console
npx jest step2
```

Our test is empty, so it should naturally pass. Notice that if we had 3 different tests (3 different `it()` clauses), the blockchain would be initialized from scratch 3 times and the Counter would be deployed 3 times. This is excellent because different tests are completely isolated from each other. If one test fails, it will not influence the others.

## Step 3: Test a getter

Now that the boilerplate is behind us, we can finally focus on writing the actual test logic. Ideally, we want to test through every execution path of our contract to make sure it's working. Let's start with something simple, our getter. Quick reminder, in tutorial 2 we implemented a getter in FunC that looked like this:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

As you recall, our test skeleton initializes our contract with a data cell via `Counter.createForDeploy()`. If the initial counter value is 17, we expect the getter to return 17 after initialization.

Copy the skeleton to a new file named `step3.spec.ts` and add the following test to it:

```ts
  it("should get counter value", async () => {
    const value = await counterContract.getCounter();
    expect(value).toEqual(17n);
  });
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step3.spec.ts).

There's something interesting to notice in the assertion at the end of the test - the `expect()`. When we compare the counter value we don't compare it to the number `17`, but to `17n`. What is this notation? The `n` signifies that the number is a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). The FunC type returned from our getter is `int`. This TVM number type is [257 bit long](https://ton.org/docs/develop/func/types?id=atomic-types) (256 signed) so it supports huge virtually unbounded numbers. The native JavaScript `number` type is limited to [64 bit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) so it cannot necessarily hold the result. We use JavaScript big numbers to work around this limitation.

To execute the test, run in terminal:

```console
npx jest step3
```

The test should pass. Try to change the expectation to verify that the returning value is `18n` and see how the test fails.

## Step 4: Test a message

While getters are read-only operations that don't change contract state, messages are used to modify state through user transactions. Reminder, we've implemented the following message handler in tutorial 2:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Let's write a test that sends a message with op #1 = _increment_. Our interface class already knows how to encode the message.

Copy the last test file to a new file named `step4.spec.ts` and add the following test to it:

```ts
  it("should increment the counter value", async () =>  {
    await counterContract.sendIncrement(wallet1.getSender());
    const counterValue = await counterContract.getCounter();
    expect(counterValue).toEqual(18n);
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step4.spec.ts).

Notice that we already know from the previous test that the counter is indeed initialized to 17, so if our message was successful, we can use the getter to get the counter value and make sure it has been incremented to 18.

To execute the test, run in terminal:

```console
npx jest step4
```

Like before, the test should pass.

## Step 5: Debug by dumping variables

Testing is fun as long as everything works as expected. But what happens when something doesn't work and you're not sure where the problem is? The most convenient method I found to debug your FunC code is to add debug prints in strategic places. This is very similar to debugging JavaScript by using `console.log(variable)` to [print](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) the value of variables.

The TVM has a special instruction for [dumping variables](https://ton.org/docs/develop/func/builtins?id=dump-variable) in debug. Run `~dump(variable_name);` in your FunC code to use it. You can also print constants by using `~dump(12345);` which can be helpful to show that the VM indeed reached a certain line.

Another useful TVM instruction can dump strings in debug. Run `~strdump(string_value);` in your FunC code to use it.

Let's try both. Let's say we're trying to send some TON coin to our contract on a message. We can do this by issuing a simple transfer from our wallet to our contract address. In FunC, this value should arrive under the `msg_value` argument of `recv_internal()`. Let's print this incoming value in FunC to make sure that it indeed works as expected. I added the debug print as the first line of our `recv_internal()` message handler from before:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
  ~dump(msg_value);                         ;; first debug print
  if (in_msg_body.slice_empty?()) { 
    return (); 
  }
  int op = in_msg_body~load_uint(32);
  var (counter) = load_data();
  if (op == 1) {
    ~strdump("increment received");         ;; second debug print
    save_data(counter + 1);
  }
}
```

The second debug print I added is whenever an op #1 = _increment_ message received. This time I print a constant string instead of a variable.

Since we changed our FunC code, we'll have to rebuild the contract to see the effect and generate a new `counter.cell`. I've done this for your convenience and renamed the file to `counter.debug.cell`, it is available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.debug.cell).

Copy the original test skeleton to a new file named `step5.spec.ts` and add the following tests:

```ts
  it("should send ton coin to the contract", async () => {
    console.log("sending 7.123 TON");
    await wallet1.send({
      to: counterContract.address,
      value: toNano("7.123")
    });
  });

  it("should increment the counter value", async () =>  {
    console.log("sending increment message");
    await counterContract.sendIncrement(wallet1.getSender());
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step5.spec.ts).

Run the test and take a close look at the console output in terminal:

```console
npx jest step5
```

The console output should include something like this:

```console
  console.log
    sending 7.123 TON

  console.log
    #DEBUG#: s0 = 7123000000

  console.log
    sending increment message

  console.log
    #DEBUG#: s0 = 2000000

  console.log
    #DEBUG#: increment received
```

We can see that the debug messages are printed when the test is running. When we send some TON coin explicitly to the contract (7.123 coins), we can see that the first debug print indeed shows the expected value of `msg_value`. Since the TVM doesn't support floating points, the number is represented internally as a large integer (with 9 decimals, meaning multiplied by 10^9). On the second test, when we send the increment op, we can see both debug prints showing. This is because this message also includes a small amount of coins for gas.

If you would like to see even more verbose log output from running your contracts, you can [increase the verbosity](https://github.com/ton-org/sandbox#viewing-logs) of the `blockchain` object after creating it in beforeEach:

```ts
blockchain.verbosity = {
  print: true,
  blockchainLogs: true,
  vmLogs: "vm_logs_full",
  debugLogs: true,
}
```

## Step 6: Test in production (without testnet)

Steps 2-5 above are all part of approach (4) - where I promised to spend 90% of our testing time. These tests are very fast to run (there's nothing faster than an in-process instance of a bare-bones TVM) and are very CI-friendly. They are also free and don't require you to spend any TON coin. These tests should give you the majority of confidence that your code is actually working.

What about the remaining 10%? All of our tests so far worked inside a lab. Before we're launching our contract, we should run some tests in the wild! This is what approach (5) is all about.

From a technical perspective, this is actually the simplest approach of all. You don't need to do anything special. Get some TON coin and deploy your contract to mainnet! The process was covered in detail in tutorial 2. Then, interact with your contract manually just like your users will. This will normally depend on the dapp client we wrote in tutorial 3.

If this step is so easy, why am I devoting so much time to discuss it? Because, from my experience, most dapp developers are reluctant to do so. Instead of testing on mainnet, they prefer to work on testnet. In my eyes, this is a waste of time. Let me attempt to refute any reasons to use testnet one last time:

-   _"testnet is as easy to work with as mainnet"_ - False. Testnet is less reliable and isn't held to the same production standard as mainnet. It also requires special wallets and special explorers. This mess is going to cost you time to sort out. I've seen too many developers deploying their contract to testnet and then trying to inspect it with a mainnet explorer without understanding why they don't see anything deployed.
    
-   _"mainnet is more expensive since it costs real TON coin to use"_ - False. Deploying your contract to mainnet costs around 10 cents. Your time costs more. Let's say an hour of your time is only worth the minimum wage in the US (a little over $7), if working on mainnet saves you an hour, you can deploy your contract 70 times without feeling guilty that you're wasting money.
    
-   _"testnet is a good simulation of mainnet"_ - False. Nobody cares deeply about testnet since it's not a production network. Are you certain that validators on testnet are running the latest node versions? Are all config parameters like gas costs identical to mainnet? Are all contracts by other teams that you may be relying on deployed to testnet?
    
-   _"I don't want to pollute mainnet with abandoned test contracts"_ - Don't worry about it. Users won't care since the chance of them reaching your unadvertised contract address by accident is zero. Validators won't care since you paid them for this service, they enjoy the traction. Also, TON has an auto-cleanup mechanism baked in, your contract will eventually run out of gas for rent and will be destroyed automatically.
    

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQDMLnAidBQHajOXI-wKKdyy6NjP8pgBAIGiVmSRZ9mJF1iM) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAAPmEfY662P&amount=50000000): ![QR-code](https://i.imgur.com/tewJ6Wg.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/04-testing/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have an excellent skeleton created automatically by an awesome dev tool called [Blueprint](https://github.com/ton-org/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!

==================================================
HTML Metadata:
Title: TON Hello World part 4: Step by step guide for testing your first smart contract

HTML Statistics:
Links: 50, Images: 4, Headings: 15, Paragraphs: 98



================================================
FILE: docs/04-testing/npmton.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/04-testing/npmton.html
================================================
[HTML Document converted to Markdown]

File: npmton.html
Size: 27.17 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

# TON Hello World part 4: Step by step guide for testing your first smart contract

Testing is a big part of smart contract development. Smart contracts often deal with money and we don't want any of our users losing money because the smart contract had a bug. This is why it's normally expected from smart contract developers to share an automated test suite next to their FunC implementation. Every user that wants to be convinced that the contract is working as expected is welcome to execute the test suite and see for themselves.

A thorough test suite is also a good signal to your users that you've taken your role as a contract developer seriously. I would personally be very hesitant to deposit a substantial amount of money in any contract that has no tests. Since _code is law_, any bug in the contract code is also part of the agreement, so a user wouldn't really have anyone to blame for money lost, but themselves.

Personally, I don't view testing as an afterthought taking place only when your code is complete. If done correctly, tests can be a powerful aid to the development process itself from the beginning, that will allow you to write better code faster.

## Oh so many ways to test

_Warning - this specific section is a bit more advanced than beginner, feel free to skip it directly to step 1 if you trust my judgement of how to test. If you're interested in an overly detailed overview of what other testing methodologies exist in our ecosystem please read on._

Because testing is such as big deal in smart contract development, there's a surprising amount of tools and infrastructure in the TON ecosystem devoted to this topic. Before jumping in to the methodology that I believe in, I want to give a quick overview of the plethora of testing tools that are available out there:

1.  **Deploying your contract to testnet** - Testnet is a live alternative instance of the entire TON Blockchain where TON coin isn't the real deal and is free to get. This instance is obviously not as secure as mainnet, but offers an interesting staging environment where you can play.
    
2.  **Local blockchain with MyLocalTon** - [MyLocalTon](https://github.com/neodiX42/MyLocalTon) is a Java-based desktop executable that runs a personal local instance of TON Blockchain on your machine that you can deploy contracts to and interact with. Another way to run a local private TON network is using Kubernetes with [ton-k8s](https://github.com/disintar/ton-k8s).
    
3.  **Writing tests in FunC** - [toncli](https://github.com/disintar/toncli) is a command-line tool written in Python that runs on your machine and supports [debug](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md) and [unit tests](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md) for FunC contracts where the tests are also written in FunC ([example](https://github.com/BorysMinaiev/func-contest-1-tests-playground/blob/main/task-1/tests/test.fc)).
    
4.  **Bare-bones TVM with Sandbox** - [Sandbox](https://github.com/ton-org/sandbox) is a bare-bones version of just the [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) running on [WebAssembly](https://webassembly.org/) with a thin JavaScript wrapper that allows test interactions from TypeScript.
    
5.  **Deploying beta contracts to mainnet** - This form of "testing in production" simply deploys alternative beta versions of your contracts to mainnet and uses real (not free) TON coin to play with them in a real environment. If you found a bug, you simply deploy new fixed beta versions and waste a little more money.
    

So which method should you choose? You definitely don't need all of them.

My team started building smart contracts on Ethereum in 2017, we've witnessed the evolution of the art of smart contract development almost from its infancy. While I'm well aware of [fundamental differences](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) between TON and the EVM, testing between the two platforms is not fundamentally different. All of the above approaches appeared on Ethereum at one point or another. And all of them practically disappeared - except two - the last two.

1.  Testnets were once popular on Ethereum (funny names like Ropsten, Rinkeby and Goerli) but turned out to be a bad tradeoff between convenience and realism - they're slow and often more difficult to work with than mainnet (some wallets aren't compatible) and useless for integration tests with other contracts (eg. your contract interacts with somebody else's token) because nobody bothers to maintain up-to-date versions of their projects on testnet.
    
2.  Local desktop versions of the entire blockchain, like [Ganache UI](https://trufflesuite.com/ganache/), proved to be too slow for unit tests and ineffective for integration tests (for the same reason as testnets). They also don't play nicely with [CI](https://docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration). People often confuse [ganache-cli](https://github.com/trufflesuite/ganache) with a local blockchain, but it is actually a bare-bones EVM implemented in JavaScript.
    
3.  Testing Solidity with Solidity proved to be too cumbersome as smart contract languages are inherently limited and restrictive by design and efficient testing seems to flourish on freeform languages like JavaScript. Trying to code a complex expectation in Solidity or simulate a difficult scenario is just too painful.
    
4.  Bare-bones EVM turned out to be the holy grail. Most of the testing on Ethereum today takes place on [Hardhat](https://hardhat.org/) and Hardhat is a thin wrapper around [EthereumJs](https://github.com/ethereumjs/ethereumjs-monorepo) which is an EVM implementation in JavaScript. This approach turned out to be the most convenient (ultra-fast CI-friendly unit tests) as well as realistic where it matters (live lazy-loaded [forks](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks) of mainnets for integration tests).
    
5.  Testing in production is useful for the last mile. Ethereum has less than [5 million](https://www.fool.com/the-ascent/cryptocurrency/articles/more-people-own-ethereum-than-ever-before-heres-why/) active users yet over [40 million](https://cryptopotato.com/over-44-million-contracts-deployed-to-ethereum-since-genesis-research/) deployed contracts. The vast majority of all deployed contracts on Ethereum mainnet are beta versions that developers deployed for a few tests and then abandoned. Don't feel bad about polluting mainnet with garbage, nobody cares.
    

After carefully considering all available approaches, I hope I convinced you why we're going to spend 90% of our time testing with approach (4) and 10% of our time testing with approach (5). We're going to conveniently forget about the other approaches and avoid using them at all.

## Step 1: Set up the project

Since we're using TypeScript for tests, make sure [Nodejs](https://nodejs.org/) is installed by running `node -v` in terminal and the version is at least v18. If you have an old version, you can upgrade with [nvm](https://github.com/nvm-sh/nvm).

Let's create a new directory for our project. Open terminal in the project directory and run the following:

```console
npm install typescript jest @types/jest ts-jest
```

This will install TypeScript and the popular [jest](https://jestjs.io/) test runner. To configure TypeScript to run correctly, we need to create the file `tsconfig.json` and put it in the project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

And to configure jest to run correctly, we need to create the file `jest.config.js` and put it in the project root:

```js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};
```

And finally, run in terminal:

```console
npm install @ton/core @ton/sandbox @ton/test-utils
```

This will install [Sandbox](https://github.com/ton-org/sandbox) and its dependencies. Sandbox is our magical library that will emulate TON Blockchain locally by running a bare-bones version of the TVM in process. This will guarantee that our tests will be blazingly fast and completely isolated.

## Step 2: Load our contract in a test

Quick reminder, in tutorial 2, we compiled our Counter smart contract in step 6 and generated the file `counter.cell` which contains the TVM bytecode for our contract (code cell). In step 7, before deploying the contract, we initialized its persistent storage (data cell). Then, we created the TypeScript interface class `counter.ts` that combines the two to deploy our contract.

Dig into your completed tutorial 2 and copy both `counter.cell` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.cell)) and `counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.ts)) to the project root.

We're going to deploy the Counter contract in our test using the interface class in an almost identical way to how we deployed it to the actual chain in tutorial 2:

```ts
// prepare Counter's initial code and data cells for deployment
const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
const counter = Counter.createForDeploy(counterCode, initialCounterValue);
```

Notice that this time we can initialize the counter value to a simple number like 17 because we're no longer afraid of collisions. All users of this tutorial can end up with the same contract address and that's ok since Sandbox creates an isolated private blockchain.

Before we start writing tests, let's create our test skeleton. In the skeleton, before each test starts, we'll initialize a fresh instance of the entire blockchain. This instance will require a wallet with enough TON for all our gas needs (we call this a "treasury") and a deployed version of the Counter.

Create the file `step2.spec.ts` with the following content:

```ts
import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;

  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should run the first test", async () => {
    // currently empty, will place a test body here soon
  });
});
```

This code is remarkably similar to the deploy code we had in tutorial 2. This is the benefit of using the TypeScript interface class. No matter where we use our contract, we always access it in the same familiar way.

The only strange part in this snippet is the treasury. What is it exactly? A treasury is simply a wallet contract, very similar to the v4 wallet you used with [Tonkeeper](https://tonkeeper.com) in previous tutorials. What's useful with a treasury is that it's already pre initialized with a big TON coin balance. There's no need to fund it from a faucet.

To execute the test, run in terminal:

```console
npx jest step2
```

Our test is empty, so it should naturally pass. Notice that if we had 3 different tests (3 different `it()` clauses), the blockchain would be initialized from scratch 3 times and the Counter would be deployed 3 times. This is excellent because different tests are completely isolated from each other. If one test fails, it will not influence the others.

## Step 3: Test a getter

Now that the boilerplate is behind us, we can finally focus on writing the actual test logic. Ideally, we want to test through every execution path of our contract to make sure it's working. Let's start with something simple, our getter. Quick reminder, in tutorial 2 we implemented a getter in FunC that looked like this:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

As you recall, our test skeleton initializes our contract with a data cell via `Counter.createForDeploy()`. If the initial counter value is 17, we expect the getter to return 17 after initialization.

Copy the skeleton to a new file named `step3.spec.ts` and add the following test to it:

```ts
  it("should get counter value", async () => {
    const value = await counterContract.getCounter();
    expect(value).toEqual(17n);
  });
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step3.spec.ts).

There's something interesting to notice in the assertion at the end of the test - the `expect()`. When we compare the counter value we don't compare it to the number `17`, but to `17n`. What is this notation? The `n` signifies that the number is a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). The FunC type returned from our getter is `int`. This TVM number type is [257 bit long](https://ton.org/docs/develop/func/types?id=atomic-types) (256 signed) so it supports huge virtually unbounded numbers. The native JavaScript `number` type is limited to [64 bit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) so it cannot necessarily hold the result. We use JavaScript big numbers to work around this limitation.

To execute the test, run in terminal:

```console
npx jest step3
```

The test should pass. Try to change the expectation to verify that the returning value is `18n` and see how the test fails.

## Step 4: Test a message

While getters are read-only operations that don't change contract state, messages are used to modify state through user transactions. Reminder, we've implemented the following message handler in tutorial 2:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Let's write a test that sends a message with op #1 = _increment_. Our interface class already knows how to encode the message.

Copy the last test file to a new file named `step4.spec.ts` and add the following test to it:

```ts
  it("should increment the counter value", async () =>  {
    await counterContract.sendIncrement(wallet1.getSender());
    const counterValue = await counterContract.getCounter();
    expect(counterValue).toEqual(18n);
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step4.spec.ts).

Notice that we already know from the previous test that the counter is indeed initialized to 17, so if our message was successful, we can use the getter to get the counter value and make sure it has been incremented to 18.

To execute the test, run in terminal:

```console
npx jest step4
```

Like before, the test should pass.

## Step 5: Debug by dumping variables

Testing is fun as long as everything works as expected. But what happens when something doesn't work and you're not sure where the problem is? The most convenient method I found to debug your FunC code is to add debug prints in strategic places. This is very similar to debugging JavaScript by using `console.log(variable)` to [print](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) the value of variables.

The TVM has a special instruction for [dumping variables](https://ton.org/docs/develop/func/builtins?id=dump-variable) in debug. Run `~dump(variable_name);` in your FunC code to use it. You can also print constants by using `~dump(12345);` which can be helpful to show that the VM indeed reached a certain line.

Another useful TVM instruction can dump strings in debug. Run `~strdump(string_value);` in your FunC code to use it.

Let's try both. Let's say we're trying to send some TON coin to our contract on a message. We can do this by issuing a simple transfer from our wallet to our contract address. In FunC, this value should arrive under the `msg_value` argument of `recv_internal()`. Let's print this incoming value in FunC to make sure that it indeed works as expected. I added the debug print as the first line of our `recv_internal()` message handler from before:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
  ~dump(msg_value);                         ;; first debug print
  if (in_msg_body.slice_empty?()) { 
    return (); 
  }
  int op = in_msg_body~load_uint(32);
  var (counter) = load_data();
  if (op == 1) {
    ~strdump("increment received");         ;; second debug print
    save_data(counter + 1);
  }
}
```

The second debug print I added is whenever an op #1 = _increment_ message received. This time I print a constant string instead of a variable.

Since we changed our FunC code, we'll have to rebuild the contract to see the effect and generate a new `counter.cell`. I've done this for your convenience and renamed the file to `counter.debug.cell`, it is available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.debug.cell).

Copy the original test skeleton to a new file named `step5.spec.ts` and add the following tests:

```ts
  it("should send ton coin to the contract", async () => {
    console.log("sending 7.123 TON");
    await wallet1.send({
      to: counterContract.address,
      value: toNano("7.123")
    });
  });

  it("should increment the counter value", async () =>  {
    console.log("sending increment message");
    await counterContract.sendIncrement(wallet1.getSender());
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step5.spec.ts).

Run the test and take a close look at the console output in terminal:

```console
npx jest step5
```

The console output should include something like this:

```console
  console.log
    sending 7.123 TON

  console.log
    #DEBUG#: s0 = 7123000000

  console.log
    sending increment message

  console.log
    #DEBUG#: s0 = 2000000

  console.log
    #DEBUG#: increment received
```

We can see that the debug messages are printed when the test is running. When we send some TON coin explicitly to the contract (7.123 coins), we can see that the first debug print indeed shows the expected value of `msg_value`. Since the TVM doesn't support floating points, the number is represented internally as a large integer (with 9 decimals, meaning multiplied by 10^9). On the second test, when we send the increment op, we can see both debug prints showing. This is because this message also includes a small amount of coins for gas.

If you would like to see even more verbose log output from running your contracts, you can [increase the verbosity](https://github.com/ton-org/sandbox#viewing-logs) of the `blockchain` object after creating it in beforeEach:

```ts
blockchain.verbosity = {
  print: true,
  blockchainLogs: true,
  vmLogs: "vm_logs_full",
  debugLogs: true,
}
```

## Step 6: Test in production (without testnet)

Steps 2-5 above are all part of approach (4) - where I promised to spend 90% of our testing time. These tests are very fast to run (there's nothing faster than an in-process instance of a bare-bones TVM) and are very CI-friendly. They are also free and don't require you to spend any TON coin. These tests should give you the majority of confidence that your code is actually working.

What about the remaining 10%? All of our tests so far worked inside a lab. Before we're launching our contract, we should run some tests in the wild! This is what approach (5) is all about.

From a technical perspective, this is actually the simplest approach of all. You don't need to do anything special. Get some TON coin and deploy your contract to mainnet! The process was covered in detail in tutorial 2. Then, interact with your contract manually just like your users will. This will normally depend on the dapp client we wrote in tutorial 3.

If this step is so easy, why am I devoting so much time to discuss it? Because, from my experience, most dapp developers are reluctant to do so. Instead of testing on mainnet, they prefer to work on testnet. In my eyes, this is a waste of time. Let me attempt to refute any reasons to use testnet one last time:

-   _"testnet is as easy to work with as mainnet"_ - False. Testnet is less reliable and isn't held to the same production standard as mainnet. It also requires special wallets and special explorers. This mess is going to cost you time to sort out. I've seen too many developers deploying their contract to testnet and then trying to inspect it with a mainnet explorer without understanding why they don't see anything deployed.
    
-   _"mainnet is more expensive since it costs real TON coin to use"_ - False. Deploying your contract to mainnet costs around 10 cents. Your time costs more. Let's say an hour of your time is only worth the minimum wage in the US (a little over $7), if working on mainnet saves you an hour, you can deploy your contract 70 times without feeling guilty that you're wasting money.
    
-   _"testnet is a good simulation of mainnet"_ - False. Nobody cares deeply about testnet since it's not a production network. Are you certain that validators on testnet are running the latest node versions? Are all config parameters like gas costs identical to mainnet? Are all contracts by other teams that you may be relying on deployed to testnet?
    
-   _"I don't want to pollute mainnet with abandoned test contracts"_ - Don't worry about it. Users won't care since the chance of them reaching your unadvertised contract address by accident is zero. Validators won't care since you paid them for this service, they enjoy the traction. Also, TON has an auto-cleanup mechanism baked in, your contract will eventually run out of gas for rent and will be destroyed automatically.
    

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the ["TON Masters"](https://getgems.io/collection/EQDMLnAidBQHajOXI-wKKdyy6NjP8pgBAIGiVmSRZ9mJF1iM) collection:

Ready to claim your reward? Simply scan the QR code below or click [here](ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAAPmEfY662P&amount=50000000): ![QR-code](https://i.imgur.com/tewJ6Wg.png)

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/04-testing/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have an excellent skeleton created automatically by an awesome dev tool called [Blueprint](https://github.com/ton-org/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!
HTML Statistics:
Links: 41, Images: 1, Headings: 10, Paragraphs: 93



================================================
FILE: docs/04-testing/npmton.md
URL: https://github.com/ton-community/tutorials/blob/main/docs/04-testing/npmton.md
================================================

# TON Hello World part 4: Step by step guide for testing your first smart contract

Testing is a big part of smart contract development. Smart contracts often deal with money and we don't want any of our users losing money because the smart contract had a bug. This is why it's normally expected from smart contract developers to share an automated test suite next to their FunC implementation. Every user that wants to be convinced that the contract is working as expected is welcome to execute the test suite and see for themselves.

A thorough test suite is also a good signal to your users that you've taken your role as a contract developer seriously. I would personally be very hesitant to deposit a substantial amount of money in any contract that has no tests. Since *code is law*, any bug in the contract code is also part of the agreement, so a user wouldn't really have anyone to blame for money lost, but themselves.

Personally, I don't view testing as an afterthought taking place only when your code is complete. If done correctly, tests can be a powerful aid to the development process itself from the beginning, that will allow you to write better code faster.

## Oh so many ways to test

*Warning - this specific section is a bit more advanced than beginner, feel free to skip it directly to step 1 if you trust my judgement of how to test. If you're interested in an overly detailed overview of what other testing methodologies exist in our ecosystem please read on.*

Because testing is such as big deal in smart contract development, there's a surprising amount of tools and infrastructure in the TON ecosystem devoted to this topic. Before jumping in to the methodology that I believe in, I want to give a quick overview of the plethora of testing tools that are available out there:

1. **Deploying your contract to testnet** - Testnet is a live alternative instance of the entire TON Blockchain where TON coin isn't the real deal and is free to get. This instance is obviously not as secure as mainnet, but offers an interesting staging environment where you can play.

2. **Local blockchain with MyLocalTon** - [MyLocalTon](https://github.com/neodiX42/MyLocalTon) is a Java-based desktop executable that runs a personal local instance of TON Blockchain on your machine that you can deploy contracts to and interact with. Another way to run a local private TON network is using Kubernetes with [ton-k8s](https://github.com/disintar/ton-k8s).

3. **Writing tests in FunC** - [toncli](https://github.com/disintar/toncli) is a command-line tool written in Python that runs on your machine and supports [debug](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md) and [unit tests](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md) for FunC contracts where the tests are also written in FunC ([example](https://github.com/BorysMinaiev/func-contest-1-tests-playground/blob/main/task-1/tests/test.fc)).

4. **Bare-bones TVM with Sandbox** - [Sandbox](https://github.com/ton-org/sandbox) is a bare-bones version of just the [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) running on [WebAssembly](https://webassembly.org/) with a thin JavaScript wrapper that allows test interactions from TypeScript.

5. **Deploying beta contracts to mainnet** - This form of "testing in production" simply deploys alternative beta versions of your contracts to mainnet and uses real (not free) TON coin to play with them in a real environment. If you found a bug, you simply deploy new fixed beta versions and waste a little more money.

So which method should you choose? You definitely don't need all of them.

My team started building smart contracts on Ethereum in 2017, we've witnessed the evolution of the art of smart contract development almost from its infancy. While I'm well aware of [fundamental differences](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) between TON and the EVM, testing between the two platforms is not fundamentally different. All of the above approaches appeared on Ethereum at one point or another. And all of them practically disappeared - except two - the last two.

1. Testnets were once popular on Ethereum (funny names like Ropsten, Rinkeby and Goerli) but turned out to be a bad tradeoff between convenience and realism - they're slow and often more difficult to work with than mainnet (some wallets aren't compatible) and useless for integration tests with other contracts (eg. your contract interacts with somebody else's token) because nobody bothers to maintain up-to-date versions of their projects on testnet.

2. Local desktop versions of the entire blockchain, like [Ganache UI](https://trufflesuite.com/ganache/), proved to be too slow for unit tests and ineffective for integration tests (for the same reason as testnets). They also don't play nicely with [CI](https://docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration). People often confuse [ganache-cli](https://github.com/trufflesuite/ganache) with a local blockchain, but it is actually a bare-bones EVM implemented in JavaScript.

3. Testing Solidity with Solidity proved to be too cumbersome as smart contract languages are inherently limited and restrictive by design and efficient testing seems to flourish on freeform languages like JavaScript. Trying to code a complex expectation in Solidity or simulate a difficult scenario is just too painful.

4. Bare-bones EVM turned out to be the holy grail. Most of the testing on Ethereum today takes place on [Hardhat](https://hardhat.org/) and Hardhat is a thin wrapper around [EthereumJs](https://github.com/ethereumjs/ethereumjs-monorepo) which is an EVM implementation in JavaScript. This approach turned out to be the most convenient (ultra-fast CI-friendly unit tests) as well as realistic where it matters (live lazy-loaded [forks](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks) of mainnets for integration tests).

5. Testing in production is useful for the last mile. Ethereum has less than [5 million](https://www.fool.com/the-ascent/cryptocurrency/articles/more-people-own-ethereum-than-ever-before-heres-why/) active users yet over [40 million](https://cryptopotato.com/over-44-million-contracts-deployed-to-ethereum-since-genesis-research/) deployed contracts. The vast majority of all deployed contracts on Ethereum mainnet are beta versions that developers deployed for a few tests and then abandoned. Don't feel bad about polluting mainnet with garbage, nobody cares.

After carefully considering all available approaches, I hope I convinced you why we're going to spend 90% of our time testing with approach (4) and 10% of our time testing with approach (5). We're going to conveniently forget about the other approaches and avoid using them at all.

## Step 1: Set up the project

Since we're using TypeScript for tests, make sure [Nodejs](https://nodejs.org/) is installed by running `node -v` in terminal and the version is at least v18. If you have an old version, you can upgrade with [nvm](https://github.com/nvm-sh/nvm).

Let's create a new directory for our project. Open terminal in the project directory and run the following:

```console
npm install typescript jest @types/jest ts-jest
```

This will install TypeScript and the popular [jest](https://jestjs.io/) test runner. To configure TypeScript to run correctly, we need to create the file `tsconfig.json` and put it in the project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

And to configure jest to run correctly, we need to create the file `jest.config.js` and put it in the project root:

```js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};
```

And finally, run in terminal:

```console
npm install @ton/core @ton/sandbox @ton/test-utils
```

This will install [Sandbox](https://github.com/ton-org/sandbox) and its dependencies. Sandbox is our magical library that will emulate TON Blockchain locally by running a bare-bones version of the TVM in process. This will guarantee that our tests will be blazingly fast and completely isolated.

## Step 2: Load our contract in a test

Quick reminder, in tutorial 2, we compiled our Counter smart contract in step 6 and generated the file `counter.cell` which contains the TVM bytecode for our contract (code cell). In step 7, before deploying the contract, we initialized its persistent storage (data cell). Then, we created the TypeScript interface class `counter.ts` that combines the two to deploy our contract.

Dig into your completed tutorial 2 and copy both `counter.cell` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.cell)) and `counter.ts` (also available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.ts)) to the project root.

We're going to deploy the Counter contract in our test using the interface class in an almost identical way to how we deployed it to the actual chain in tutorial 2:

```ts
// prepare Counter's initial code and data cells for deployment
const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
const counter = Counter.createForDeploy(counterCode, initialCounterValue);
```

Notice that this time we can initialize the counter value to a simple number like 17 because we're no longer afraid of collisions. All users of this tutorial can end up with the same contract address and that's ok since Sandbox creates an isolated private blockchain.

Before we start writing tests, let's create our test skeleton. In the skeleton, before each test starts, we'll initialize a fresh instance of the entire blockchain. This instance will require a wallet with enough TON for all our gas needs (we call this a "treasury") and a deployed version of the Counter.

Create the file `step2.spec.ts` with the following content:

```ts
import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Counter from "./counter"; // this is the interface class from tutorial 2

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let counterContract: SandboxContract<Counter>;
  
  beforeEach(async () =>  {
    // prepare Counter's initial code and data cells for deployment
    const counterCode = Cell.fromBoc(fs.readFileSync("counter.cell"))[0]; // compilation output from tutorial 2
    const initialCounterValue = 17; // no collisions possible since sandbox is a private local instance
    const counter = Counter.createForDeploy(counterCode, initialCounterValue);

    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    // deploy counter
    counterContract = blockchain.openContract(counter);
    await counterContract.sendDeploy(wallet1.getSender());
  }),

  it("should run the first test", async () => {
    // currently empty, will place a test body here soon
  });
});
```

This code is remarkably similar to the deploy code we had in tutorial 2. This is the benefit of using the TypeScript interface class. No matter where we use our contract, we always access it in the same familiar way.

The only strange part in this snippet is the treasury. What is it exactly? A treasury is simply a wallet contract, very similar to the v4 wallet you used with [Tonkeeper](https://tonkeeper.com) in previous tutorials. What's useful with a treasury is that it's already pre initialized with a big TON coin balance. There's no need to fund it from a faucet.

To execute the test, run in terminal:

```console
npx jest step2
```

Our test is empty, so it should naturally pass. Notice that if we had 3 different tests (3 different `it()` clauses), the blockchain would be initialized from scratch 3 times and the Counter would be deployed 3 times. This is excellent because different tests are completely isolated from each other. If one test fails, it will not influence the others.

## Step 3: Test a getter

Now that the boilerplate is behind us, we can finally focus on writing the actual test logic. Ideally, we want to test through every execution path of our contract to make sure it's working. Let's start with something simple, our getter. Quick reminder, in tutorial 2 we implemented a getter in FunC that looked like this:

```func
int counter() method_id {        ;; getter declaration - returns int as result
  var (counter) = load_data();   ;; call our read utility function to load value
  return counter;
}
```

As you recall, our test skeleton initializes our contract with a data cell via `Counter.createForDeploy()`. If the initial counter value is 17, we expect the getter to return 17 after initialization.

Copy the skeleton to a new file named `step3.spec.ts` and add the following test to it:

```ts
  it("should get counter value", async () => {
    const value = await counterContract.getCounter();
    expect(value).toEqual(17n);
  });
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step3.spec.ts).

There's something interesting to notice in the assertion at the end of the test - the `expect()`. When we compare the counter value we don't compare it to the number `17`, but to `17n`. What is this notation? The `n` signifies that the number is a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). The FunC type returned from our getter is `int`. This TVM number type is [257 bit long](https://ton.org/docs/develop/func/types?id=atomic-types) (256 signed) so it supports huge virtually unbounded numbers. The native JavaScript `number` type is limited to [64 bit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) so it cannot necessarily hold the result. We use JavaScript big numbers to work around this limitation.

To execute the test, run in terminal:

```console
npx jest step3
```

The test should pass. Try to change the expectation to verify that the returning value is `18n` and see how the test fails.

## Step 4: Test a message

While getters are read-only operations that don't change contract state, messages are used to modify state through user transactions. Reminder, we've implemented the following message handler in tutorial 2:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {  ;; well known function signature
  if (in_msg_body.slice_empty?()) {         ;; check if incoming message is empty (with no body)
    return ();                              ;; return successfully and accept an empty message
  }
  int op = in_msg_body~load_uint(32);       ;; parse the operation type encoded in the beginning of msg body
  var (counter) = load_data();              ;; call our read utility function to load values from storage
  if (op == 1) {                            ;; handle op #1 = increment
    save_data(counter + 1);                 ;; call our write utility function to persist values to storage
  }
}
```

Let's write a test that sends a message with op #1 = *increment*. Our interface class already knows how to encode the message.

Copy the last test file to a new file named `step4.spec.ts` and add the following test to it:

```ts
  it("should increment the counter value", async () =>  {
    await counterContract.sendIncrement(wallet1.getSender());
    const counterValue = await counterContract.getCounter();
    expect(counterValue).toEqual(18n);
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step4.spec.ts).

Notice that we already know from the previous test that the counter is indeed initialized to 17, so if our message was successful, we can use the getter to get the counter value and make sure it has been incremented to 18.

To execute the test, run in terminal:

```console
npx jest step4
```

Like before, the test should pass.

## Step 5: Debug by dumping variables

Testing is fun as long as everything works as expected. But what happens when something doesn't work and you're not sure where the problem is? The most convenient method I found to debug your FunC code is to add debug prints in strategic places. This is very similar to debugging JavaScript by using `console.log(variable)` to [print](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) the value of variables.

The TVM has a special instruction for [dumping variables](https://ton.org/docs/develop/func/builtins?id=dump-variable) in debug. Run `~dump(variable_name);` in your FunC code to use it. You can also print constants by using `~dump(12345);` which can be helpful to show that the VM indeed reached a certain line.

Another useful TVM instruction can dump strings in debug. Run `~strdump(string_value);` in your FunC code to use it.

Let's try both. Let's say we're trying to send some TON coin to our contract on a message. We can do this by issuing a simple transfer from our wallet to our contract address. In FunC, this value should arrive under the `msg_value` argument of `recv_internal()`. Let's print this incoming value in FunC to make sure that it indeed works as expected. I added the debug print as the first line of our `recv_internal()` message handler from before:

```func
() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
  ~dump(msg_value);                         ;; first debug print
  if (in_msg_body.slice_empty?()) { 
    return (); 
  }
  int op = in_msg_body~load_uint(32);
  var (counter) = load_data();
  if (op == 1) {
    ~strdump("increment received");         ;; second debug print
    save_data(counter + 1);
  }
}
```

The second debug print I added is whenever an op #1 = *increment* message received. This time I print a constant string instead of a variable.

Since we changed our FunC code, we'll have to rebuild the contract to see the effect and generate a new `counter.cell`. I've done this for your convenience and renamed the file to `counter.debug.cell`, it is available [here](https://raw.githubusercontent.com/ton-community/tutorials/main/04-testing/test/counter.debug.cell).

Copy the original test skeleton to a new file named `step5.spec.ts` and add the following tests:

```ts
  it("should send ton coin to the contract", async () => {
    console.log("sending 7.123 TON");
    await wallet1.send({
      to: counterContract.address,
      value: toNano("7.123")
    });
  });

  it("should increment the counter value", async () =>  {
    console.log("sending increment message");
    await counterContract.sendIncrement(wallet1.getSender());
  })
```

The resulting source file should look like [this](https://github.com/ton-community/tutorials/blob/main/04-testing/test/step5.spec.ts).

Run the test and take a close look at the console output in terminal:

```console
npx jest step5
```

The console output should include something like this:

```console
  console.log
    sending 7.123 TON

  console.log
    #DEBUG#: s0 = 7123000000

  console.log
    sending increment message

  console.log
    #DEBUG#: s0 = 2000000

  console.log
    #DEBUG#: increment received
```

We can see that the debug messages are printed when the test is running. When we send some TON coin explicitly to the contract (7.123 coins), we can see that the first debug print indeed shows the expected value of `msg_value`. Since the TVM doesn't support floating points, the number is represented internally as a large integer (with 9 decimals, meaning multiplied by 10^9). On the second test, when we send the increment op, we can see both debug prints showing. This is because this message also includes a small amount of coins for gas.

If you would like to see even more verbose log output from running your contracts, you can [increase the verbosity](https://github.com/ton-org/sandbox#viewing-logs) of the `blockchain` object after creating it in beforeEach:

```ts
blockchain.verbosity = {
  print: true,
  blockchainLogs: true,
  vmLogs: "vm_logs_full",
  debugLogs: true,
}
```

## Step 6: Test in production (without testnet)

Steps 2-5 above are all part of approach (4) - where I promised to spend 90% of our testing time. These tests are very fast to run (there's nothing faster than an in-process instance of a bare-bones TVM) and are very CI-friendly. They are also free and don't require you to spend any TON coin. These tests should give you the majority of confidence that your code is actually working.

What about the remaining 10%? All of our tests so far worked inside a lab. Before we're launching our contract, we should run some tests in the wild! This is what approach (5) is all about.

From a technical perspective, this is actually the simplest approach of all. You don't need to do anything special. Get some TON coin and deploy your contract to mainnet! The process was covered in detail in tutorial 2. Then, interact with your contract manually just like your users will. This will normally depend on the dapp client we wrote in tutorial 3.

If this step is so easy, why am I devoting so much time to discuss it? Because, from my experience, most dapp developers are reluctant to do so. Instead of testing on mainnet, they prefer to work on testnet. In my eyes, this is a waste of time. Let me attempt to refute any reasons to use testnet one last time:

* *"testnet is as easy to work with as mainnet"* - False. Testnet is less reliable and isn't held to the same production standard as mainnet. It also requires special wallets and special explorers. This mess is going to cost you time to sort out. I've seen too many developers deploying their contract to testnet and then trying to inspect it with a mainnet explorer without understanding why they don't see anything deployed.

* *"mainnet is more expensive since it costs real TON coin to use"* - False. Deploying your contract to mainnet costs around 10 cents. Your time costs more. Let's say an hour of your time is only worth the minimum wage in the US (a little over $7), if working on mainnet saves you an hour, you can deploy your contract 70 times without feeling guilty that you're wasting money.

* *"testnet is a good simulation of mainnet"* - False. Nobody cares deeply about testnet since it's not a production network. Are you certain that validators on testnet are running the latest node versions? Are all config parameters like gas costs identical to mainnet? Are all contracts by other teams that you may be relying on deployed to testnet?

* *"I don't want to pollute mainnet with abandoned test contracts"* - Don't worry about it. Users won't care since the chance of them reaching your unadvertised contract address by accident is zero. Validators won't care since you paid them for this service, they enjoy the traction. Also, TON has an auto-cleanup mechanism baked in, your contract will eventually run out of gas for rent and will be destroyed automatically.

## Reward

Congratulations on successfully completing this tutorial! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQDMLnAidBQHajOXI-wKKdyy6NjP8pgBAIGiVmSRZ9mJF1iM">"TON Masters"</a> collection:
<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/4-testing/video.mp4" type="video/mp4">
</video>

Ready to claim your reward? Simply scan the QR code below or click <a href="ton://transfer/EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo?bin=te6cckEBAQEABgAACAAPmEfY662P&amount=50000000">here</a>:
  <img src="https://i.imgur.com/tewJ6Wg.png" width=300 alt="QR-code" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

## Conclusion

For your convenience, all the code in this tutorial is available in executable form [here](https://github.com/ton-community/tutorials/blob/main/04-testing/test).

In this tutorial we created our project skeleton manually, mostly so we can understand what happens under the hood. When creating a new contract project, you can have an excellent skeleton created automatically by an awesome dev tool called [Blueprint](https://github.com/ton-org/blueprint). To create a new contract project with Blueprint, run in terminal and follow the on-screen instructions:

```console
npm create ton@latest
```

If you found a mistake in this tutorial, please [submit a PR](https://github.com/ton-community/tutorials/pulls) and help us fix it. This tutorial platform is fully open source and available on [https://github.com/ton-community/tutorials](https://github.com/ton-community/tutorials).

Happy coding!



================================================
FILE: docs/04-testing/options.json
URL: https://github.com/ton-community/tutorials/blob/main/docs/04-testing/options.json
================================================
{
  "library": {
    "name": "Library",
    "order": 1,
    "default": "npmton",
    "options": {
      "npmton": {
        "name": "npm ton (JavaScript)",
        "order": 1,
        "url": "https://github.com/ton-community/ton",
        "pros": "more popular, full TypeScript support, elegant api",
        "cons": "no support for all ton services"
      }
    }
  }
}


================================================
FILE: docs/CNAME
URL: https://github.com/ton-community/tutorials/blob/main/docs/CNAME
================================================
helloworld.tonstudio.io


================================================
FILE: docs/assets/arrow-down.svg
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/arrow-down.svg
================================================
[Binary file blocked: arrow-down.svg]


================================================
FILE: docs/assets/authors/shaharyakir.jpg
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/authors/shaharyakir.jpg
================================================
[Binary file blocked: shaharyakir.jpg]


================================================
FILE: docs/assets/authors/talkol.jpg
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/authors/talkol.jpg
================================================
[Binary file blocked: talkol.jpg]


================================================
FILE: docs/assets/copy.svg
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/copy.svg
================================================
[Binary file blocked: copy.svg]


================================================
FILE: docs/assets/favicon.png
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/favicon.png
================================================
[Binary file blocked: favicon.png]


================================================
FILE: docs/assets/func.min.js
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/func.min.js
================================================
// FIX FROM: https://github.com/romario333/highlightjs-func/commit/ed4f5e1ba9cf6464411e3e77b1ddbe31fe20b8d5

/*! `func` grammar compiled for Highlight.js 11.7.0 */
(()=>{var e=(()=>{"use strict"
;const e='(?!")(`([^`]+)`|((?=_)_|(?=\\{)\\{|(?=\\})\\}|(?![_`{}]))([^;,\\[\\]\\(\\)\\s~.]+))',n=/\"[^\n\"]+\"[Hhcusa]?/,t=/(-?(?!_)([\d_]+|0x[\d_a-fA-F]+)|0b[1_0]+)(?=[\s\)\],;])/
;return s=>({name:"FunC",aliases:["func"],case_insensitive:!1,keywords:{
keyword:["if","ifnot","else","elseif","elseifnot|10","while","do","until","repeat","return","impure","method_id","forall","asm","inline","inline_ref|10","const","global"],
literal:["true","false"],
type:["var","int","slice","tuple","cell","builder","cont","_"],built_in:[]},
contains:[{scope:"comment",begin:";;",end:/(?=\n)/},{scope:"comment",begin:"{-",
end:"-}",contains:["self"]},{scope:"meta",begin:/#pragma/,end:/;/,contains:[{
scope:"keyword",match:/version|not-version/},{scope:"operator",
match:s.regex.either(/>=/,/<=/,/=/,/>/,/</,/\^/)},{scope:"number",
match:/([0-9]+)(.[0-9]+)?(.[0-9]+)?/}]},{scope:"keyword",begin:/#include/,
end:/;/,contains:[{scope:"string",match:n}]},{scope:"number",match:t},{
scope:"string",match:n},{match:[/\b(const|global)\b/,/\s+/,/\w+/,/\s+/,e],
scope:{1:"keyword",5:"variable.constant"}},{scope:"function",
match:RegExp(e+"(?=[(])")},{scope:"operator",
match:s.regex.either(/<=>/,/>=/,/<=/,/!=/,/==/,/\^>>/,/~>>/,/>>/,/<</,/\/%/,/\^%/,/~%/,/\^\//,/~\//,/\+=/,/-=/,/\*=/,/\/=/,/~\/=/,/\^\/=/,/%=/,/\^%=/,/<<=/,/>>=/,/~>>=/,/\^>>=/,/&=/,/\^=/,/\|=/,/\^/,/=/,/~/,/\//,/%/,/-/,/\*/,/\+/,/>/,/</,/&/,/\|/,/:/,/\?/)
},{scope:"punctuation",match:/[\.;\(\),\[\]~\{\}]/}]})})()
;hljs.registerLanguage("func",e)})();


================================================
FILE: docs/assets/index.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 0.19 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

 Redirecting to https://helloworld.tonstudio.io/01-wallet

==================================================
HTML Metadata:
Title: Redirecting to https://helloworld.tonstudio.io/01-wallet



================================================
FILE: docs/assets/link.svg
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/link.svg
================================================
[Binary file blocked: link.svg]


================================================
FILE: docs/assets/logo.svg
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/logo.svg
================================================
[Binary file blocked: logo.svg]


================================================
FILE: docs/assets/styles.css
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/styles.css
================================================
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
.section-title, .post h2 {
  font-size: 30px;
  font-weight: 500;
  line-height: 38px;
  margin-bottom: 24px;
  margin-top: 40px;
  border-bottom: 1px solid hsl(210, 18%, 92%);
  padding-bottom: 10px;
}

.grid, .page, nav {
  max-width: 1230px;
  width: calc(100% - 60px);
}

.text, .post p {
  font-size: 18px;
  line-height: 30px;
}

a {
  color: #0099e5;
  border-bottom: 0.75px solid rgba(0, 136, 204, 0.6);
}

/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

body {
  line-height: 1;
  -webkit-text-size-adjust: 100%;
}

ol,
ul {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

* {
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
  color: #1c1e21;
}

.selectboxes {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.selectbox {
  width: 100%;
  cursor: pointer;
  position: relative;
}
.selectbox-title {
  position: absolute;
  top: 0px;
  padding: 0px 8px;
  left: 20px;
  background: #f6f8fa;
  top: -13%;
  font-size: 17px;
  font-weight: 700;
  z-index: 1;
}
.selectbox-selected {
  padding: 10px 47px 10px 25px;
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid #c0c0c0;
  border-radius: 5px;
  border-radius: 20px;
  position: relative;
  font-weight: 300;
}
.selectbox-selected img {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translate(0, -50%);
  zoom: 0.6;
}
.selectbox .options {
  display: flex;
  flex-direction: column;
  width: fit-content;
  min-width: 100%;
  max-width: 700px;
  pointer-events: none;
  opacity: 0;
  position: absolute;
  top: calc(100% + 1px);
  border-radius: 10px;
  background: white;
  overflow: hidden;
  transform: rotateX(40deg) scale(0.5);
  transform-origin: top;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
}
.selectbox .options .option {
  height: auto;
  min-height: 40px;
  padding: 17px 25px 17px 25px;
  width: 100%;
  list-style-type: unset;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.selectbox .options .option-name {
  display: flex;
  align-items: center;
  gap: 20px;
}
.selectbox .options .option-name h4 {
  font-weight: 500;
}
.selectbox .options .option a {
  margin-left: 10px;
  text-decoration: unset;
  position: relative;
  font-family: inherit;
}
.selectbox .options .option a::after {
  position: absolute;
  content: "";
  background: url("../assets/link.svg");
  width: 12px;
  height: 12px;
  object-fit: contain;
  background-size: contain;
  right: -20px;
  top: 50%;
  transform: translate(0, -50%);
}
.selectbox .options .option a:hover {
  text-decoration: underline;
}
.selectbox .options .option .text-p, .selectbox .options .option .pros *,
.selectbox .options .option .cons *, .selectbox .options .option .pros,
.selectbox .options .option .cons {
  text-align: left;
  margin-bottom: 0px;
}
.selectbox .options .option-small {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.selectbox .options .option .pros {
  opacity: 0.8;
  color: #2da44e;
  background-color: rgba(45, 164, 78, 0.1411764706);
}
.selectbox .options .option .cons {
  opacity: 0.6;
  color: #cf222e;
  background-color: rgba(207, 34, 46, 0.1411764706);
}
.selectbox .options .option .pros,
.selectbox .options .option .cons {
  padding: 3px 6px;
  border-radius: 6px;
  font-weight: 400;
  font-size: 11px;
  white-space: nowrap;
}
.selectbox .options .option .pros *,
.selectbox .options .option .cons * {
  font-size: inherit;
  margin-left: 0px !important;
  pointer-events: none;
  color: inherit;
}
.selectbox .options .option:hover {
  background: rgba(94, 117, 232, 0.1);
}
.selectbox .options .option-hidden {
  display: none;
}
.selectbox-open {
  z-index: 99;
}
.selectbox-open .options {
  transform: rotateX(0deg) scale(1);
  transition: 0.25s all;
  opacity: 1;
  pointer-events: all;
}

.posts {
  padding: 0px 0px 30px 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  order: 1;
}

.post {
  display: none;
  width: 100%;
  flex-direction: column;
}
.post ul li {
  padding-left: 45px;
  position: relative;
}
.post ul li::after {
  position: absolute;
  left: 20px;
  top: 12px;
  width: 6px;
  height: 6px;
  background: black;
  border-radius: 50%;
  content: "";
}
.post ol {
  list-style: decimal outside none;
  padding-left: 40px;
}
.post ol li {
  padding-left: 8px;
}
.post a {
  text-decoration: none;
}
.post a:hover {
  text-decoration: underline;
}
.post em {
  font-style: italic;
  font-weight: 300;
}
.post img {
  max-width: 100%;
}
.post-active {
  display: block;
}
.post strong {
  font-weight: 600;
}
.post p {
  margin-bottom: 24px;
}
.post h3 {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 24px;
}
.post h1 {
  font-size: 40px;
  line-height: 67px;
  font-weight: 600;
  margin-bottom: 30px;
}
.post .author {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 30px;
  margin-bottom: 50px;
}
.post .author img.face {
  border-radius: 100%;
  width: 40px;
  aspect-ratio: auto 40/40;
  height: 40px;
}
.post .author span {
  font-size: 15px;
  opacity: 0.6;
  margin-right: 10px;
}
.post .author .social {
  color: #0099e5;
  opacity: 0.7;
}
.post .author .social svg {
  width: 18px;
  margin-right: 5px;
}
.post code {
  background: #f6f8fa;
  padding: 7px 11px;
  line-height: 26px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono !important;
  font-size: 14px;
  border-radius: 5px;
  margin-left: 3px;
  margin-right: 3px;
}
.post .code {
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  background: #f6f8fa;
  border-radius: 7px;
  position: relative;
}
.post .code .code-placeholder {
  width: 40px;
}
.post .code-overflow {
  padding: 24px 50px 24px 24px;
  width: 100%;
  overflow: auto;
  display: flex;
}
.post .code .copy {
  position: absolute;
  left: calc(100% - 50px);
  top: 10px;
  opacity: 0;
  transition: 0.2s all;
  display: flex;
  align-items: center;
  justify-content: center;
}
.post .code .copy-success {
  padding: 2px 7px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  position: absolute;
  font-size: 12px;
  right: calc(100% + 10px);
  border-radius: 4px;
  opacity: 0;
  font-family: "Poppins", sans-serif !important;
}
.post .code .copy button {
  background: #f6f8fa;
  cursor: pointer;
  width: 38px;
  height: 38px;
  padding: 10px;
  border: unset;
  border: unset;
  position: relative;
  border-radius: 60px;
}
.post .code .copy button::after {
  background-repeat: no-repeat;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-image: url("../assets/copy.svg");
  content: "";
  background-size: contain;
  width: 60%;
  height: 60%;
}
.post .code .copy-done .copy-success {
  opacity: 1;
}
.post .code * {
  line-height: 20px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono !important;
  font-size: 14px !important;
}
.post .code .function_ {
  color: #8250df;
}
.post .code .class_ {
  color: #953800;
}
.post .code .hljs-keyword {
  color: #cf222e;
}
.post .code code {
  overflow: auto;
  width: 100%;
  padding: 0px;
  margin: 0px;
}
.post .code:hover .copy {
  opacity: 1;
}

nav {
  height: 70px;
  position: fixed;
  background: white;
  top: 0px;
  left: 50%;
  transform: translate(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
}

a.alogo:hover, a.alogo:visited, a.alogo:link, a.alogo:active {
  color: #1c1e21;
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo img {
  height: 34px;
}
.logo p {
  font-size: 18px;
  font-weight: 400;
  position: relative;
  top: 1px;
}

.page {
  max-width: 1230px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 100px;
  padding-bottom: 50px;
}

.main {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.rightcol {
  width: 330px;
  position: sticky;
  top: 70px;
  display: flex;
  flex-direction: column;
  order: 2;
}

.menu {
  background: #f6f8fa;
  border-radius: 16px;
  padding: 50px 20px 50px 20px;
}

.more {
  padding-top: 55px;
  padding-left: 16px;
}
.more h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
}
.more ul {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.more ul a {
  font-size: 14px;
  text-decoration: unset;
}
.more ul a.selected {
  text-decoration: underline;
  pointer-events: none;
}

.needhelp {
  margin-top: 40px;
  padding-left: 36px;
}
.needhelp a {
  font-size: 14px;
  text-decoration: unset;
}

@media only screen and (max-width: 900px) {
  .grid, nav, .page {
    width: calc(100% - 30px);
  }
  .page {
    padding-top: 80px;
  }
  .main {
    flex-direction: column;
    grid-area: 50px;
  }
  .menu {
    padding: 30px 20px 30px 20px;
    order: 1;
    position: unset;
    width: 100%;
    gap: 40px;
  }
  .rightcol {
    position: unset;
    width: 100%;
    max-width: 400px;
  }
  .posts {
    order: 2;
    width: 100%;
  }
  .post .section-title, .post h2 {
    font-size: 20px;
    line-height: normal;
  }
  .post h1 {
    font-size: 23px;
    line-height: 32px;
    margin-bottom: 30px;
  }
  .post p {
    font-size: 16px;
    line-height: 32px;
  }
}

/*# sourceMappingURL=styles.css.map */



================================================
FILE: docs/assets/styles.css.map
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/styles.css.map
================================================
{"version":3,"sourceRoot":"","sources":["../../styles.scss"],"names":[],"mappings":"AACQ;AAMR;EACE;EACA;EACA;EACA;EACA;EACA;EACA;;;AAGF;EACE,WAfW;EAgBX;;;AAEF;EACE;EACA;;;AAGF;EACE,OArBW;EAsBX;;;AAGF;AAAA;AAAA;AAAA;AAKA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EAiFE;EACA;EACA;EACA;EACA;EACA;;;AAEF;AACA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EAWE;;;AAEF;EACE;EACE;;;AAEJ;AAAA;EAEE;;;AAEF;AAAA;EAEE;;;AAEF;AAAA;AAAA;AAAA;EAIE;EACA;;;AAEF;EACE;EACA;;;AAGF;EACE;;;AAGF;EACE,aArKU;EAsKV,OApKW;;;AAuKb;EACE;EACA;EACA;EACA;;;AAEF;EACE;EACA;EACA;;AAEA;EACE;EACA;EACA;EACA;EACA,YA3LM;EA4LN;EACA;EACA;EACA;;AAEF;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AACA;EACE;EACA;EACA;EACA;EACA;;AAGJ;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAGA;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAEA;EACE;EACA;EACA;;AACA;EACE;;AAGJ;EACE;EACA;EACA;EACA;;AACA;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAEF;EACE;;AAGJ;AAAA;AAAA;EACE;EACA;;AAEF;EACE;EACA;EACA;;AAEF;EACE;EACA;EACA;;AAEF;EACE;EACA;EACA;;AAEF;AAAA;EAEE;EACA;EAEA;EACA;EACA;;AACA;AAAA;EAEE;EACA;EACA;EACA;;AAIJ;EACE;;AAEF;EACE;;AAIN;EACE;;AACA;EACE;EACA;EACA;EACA;;;AAKN;EACE;EACA;EACA;EACA;EACA;EACA;;;AAEF;EACE;EACA;EACA;;AAEE;EACE;EACA;;AACA;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAIN;EACE;EACA;;AACA;EACE;;AAGJ;EACE;;AAEF;EACE;;AAEF;EACE;EACA;;AAEF;EACE;;AAEF;EACE;;AAEF;EACE;;AAEF;EAEE;;AAEF;EACE;EACA;EACA;;AAEF;EACE;EACA;EACA;EACA;;AAEF;EACE;EACA;EACA;EACA;EACA;;AACA;EACE;EACA;EACA;EACA;;AAEF;EACE;EACA;EACA;;AAEF;EACE,OAxZO;EAyZP;;AACA;EACE;EACA;;AAON;EACE,YAraM;EAsaN;EACA;EACA;EAEA;EACA;EACA;EACA;;AAEF;EACE;EACA;EACA;EACA,YAnbM;EAobN;EACA;;AACA;EACE;;AAEF;EACE;EACA;EACA;EACA;;AAGF;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AACA;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAEF;EACE,YArdE;EAudF;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AACA;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAIF;EACE;;AAIN;EACE;EACA;EAEA;;AAEF;EACE;;AAEF;EACE;;AAEF;EACE;;AAEF;EACE;EACA;EACA;EACA;;AAGA;EACE;;;AAMR;EACE;EACA;EACA;EACA;EACA;EACA;EAEA;EACA;EACA;EACA;EACA;;;AAGF;EACE,OAhiBW;EAiiBX;;;AAGF;EACE;EACA;EACA;EACA;;AACA;EACE;;AAEF;EACE;EACA;EACA;EACA;;;AAIJ;EACE,WAtjBW;EAujBX;EACA;EACA;EAEA;;;AAEF;EACE;EACA;EACA;EACA;;;AAGF;EACE;EACA;EACA;EACA;EACA;EACA;;;AAGF;EACE,YAjlBQ;EAklBR;EACA;;;AAGF;EACE;EACA;;AACA;EACE;EACA;EACA;;AAEF;EACE;EACA;EACA;;AACA;EACE;EACA;;AAEF;EACE;EACA;;;AAKN;EACE;EACA;;AACA;EACE;EACA;;;AAIJ;EACE;IACE;;EAEF;IACE;;EAEF;IACE;IACA;;EAEF;IACE;IACA;IACA;IACA;IACA;;EAEF;IACE;IACA;IACA;;EAEF;IACE;IACA;;EAGA;IACE;IACA;;EAEF;IACE;IACA;IACA;;EAEF;IACE;IACA","file":"styles.css"}


================================================
FILE: docs/assets/twa.mp4
URL: https://github.com/ton-community/tutorials/blob/main/docs/assets/twa.mp4
================================================
[Binary file blocked: twa.mp4]


================================================
FILE: docs/index.html
URL: https://github.com/ton-community/tutorials/blob/main/docs/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 0.19 KB
Modified: Thu Jun 26 2025 16:13:17 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

 Redirecting to https://helloworld.tonstudio.io/01-wallet

==================================================
HTML Metadata:
Title: Redirecting to https://helloworld.tonstudio.io/01-wallet




# Repository: compressed-nft-contract
URL: https://github.com/ton-community/compressed-nft-contract
Branch: main

## Directory Structure:
```
└── compressed-nft-contract/
    ├── LICENSE
    ├── README.md
    ├── contracts/
        ├── collection.fc
        ├── collection_exotic.fc
        ├── collection_exotic_sbt.fc
        ├── collection_new.fc
        ├── imports/
            ├── op-codes.fc
            ├── params.fc
            ├── stdlib.fc
        ├── item.fc
        ├── sbt_item.fc
    ├── jest.config.ts
    ├── merkle/
        ├── merkle.ts
    ├── package.json
    ├── tests/
        ├── Collection.spec.ts
        ├── CollectionExotic.spec.ts
        ├── CollectionExoticSbt.spec.ts
        ├── CollectionNew.spec.ts
        ├── Item.spec.ts
        ├── SbtItem.spec.ts
    ├── wrappers/
        ├── Collection.compile.ts
        ├── Collection.ts
        ├── CollectionExotic.compile.ts
        ├── CollectionExotic.ts
        ├── CollectionExoticSbt.compile.ts
        ├── CollectionExoticSbt.ts
        ├── CollectionNew.compile.ts
        ├── CollectionNew.ts
        ├── Item.compile.ts
        ├── Item.ts
        ├── SbtItem.compile.ts
        ├── SbtItem.ts
```

## Files Content:

================================================
FILE: LICENSE
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/LICENSE
================================================
MIT License

Copyright (c) 2023 Ton Tech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


================================================
FILE: README.md
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/README.md
================================================
# Compressed NFT Contract

The [Augmenting API](https://github.com/ton-community/compressed-nft-api) currently uses the `CollectionNew` variant.

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

# License
[MIT](LICENSE)



================================================
FILE: contracts/collection.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/collection.fc
================================================
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global int storage::last_index;
global cell storage::api_data;

const int node_dict_key_len = 32;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::index_too_high = 102;
const int error::tree_full = 103;
const int error::malformed_updates = 104;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;

const int item_init_value = 50000000;

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::last_index = ds~load_uint(256);
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_uint(storage::last_index, 256)
        .store_ref(storage::api_data)
        .end_cell());
}

int hash_nodes(int a, int b) {
    return begin_cell().store_uint(a, 256).store_uint(b, 256).end_cell().cell_hash();
}

int get_node(cell p, int i) {
    (slice v, int ok) = p.udict_get?(node_dict_key_len, i);
    throw_unless(101, ok);
    return v.preload_uint(256);
}

(cell, ()) set_node(cell p, int i, int v) {
    p~udict_set_builder(node_dict_key_len, i, begin_cell().store_uint(v, 256));
    return (p, ());
}

int check_proof(int root, cell proof, int leaf, int leaf_index, int depth) {
    int i = 0;
    int cur = leaf;
    while (i < depth) {
        int is_right = (leaf_index >> i) & 1;
        if (is_right) {
            cur = hash_nodes(proof.get_node(i), cur);
        } else {
            cur = hash_nodes(cur, proof.get_node(i));
        }
        i += 1;
    }
    return cur == root;
}

(slice, cell) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() claim(int nft_index, cell nft_data, cell proof) impure {
    throw_if(error::index_too_high, nft_index > storage::last_index);

    throw_unless(error::bad_proof, check_proof(storage::merkle_root, proof, nft_data.cell_hash(), nft_index, storage::merkle_depth));

    (slice owner, cell content) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).end_cell()); ;; inline the nft_data?
}

() update(cell updates, int new_last_index, cell hashes) impure {
    throw_if(error::tree_full, storage::last_index >= ((1 << storage::merkle_depth) - 1));
    throw_unless(error::malformed_updates, new_last_index > storage::last_index);

    int cur_left = (storage::last_index + 1) + (1 << storage::merkle_depth);
    int i = storage::merkle_depth;
    int last_node_hash = -1;
    cell verification_hashes = hashes;
    int zero_hash = 0;
    while (i > 0) {
        (slice v, int ok) = updates.udict_get?(node_dict_key_len, i);
        if (ok) {
            int node_index = v~load_uint(256);
            int leaf_node_index = node_index << (storage::merkle_depth - i);
            throw_unless(error::malformed_updates, leaf_node_index == cur_left); ;; does this verify that node_index belongs to depth
            cur_left = leaf_node_index + (1 << (storage::merkle_depth - i));

            int new_hash = v~load_uint(256);
            last_node_hash = node_index >> 1;
            hashes~set_node(last_node_hash, hash_nodes(hashes.get_node(node_index - 1), new_hash));
            verification_hashes~set_node(last_node_hash, hash_nodes(verification_hashes.get_node(node_index - 1), zero_hash));
        } elseif (last_node_hash != -1) {
            int new_last_node_hash = last_node_hash >> 1;
            hashes~set_node(new_last_node_hash, hash_nodes(hashes.get_node(last_node_hash - 1), hashes.get_node(last_node_hash)));
            verification_hashes~set_node(new_last_node_hash, hash_nodes(verification_hashes.get_node(last_node_hash - 1), verification_hashes.get_node(last_node_hash)));
            last_node_hash = new_last_node_hash;
        }
        zero_hash = hash_nodes(zero_hash, zero_hash);

        i -= 1;
    }

    throw_unless(error::malformed_updates, cur_left == (1 << (storage::merkle_depth + 1)));
    throw_unless(error::malformed_updates, verification_hashes.get_node(1) == storage::merkle_root);

    storage::merkle_root = hashes.get_node(1);
    storage::last_index = new_last_index;

    save_data();
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

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        slice proof_data = in_msg_body~load_ref().begin_parse();
        claim(proof_data~load_uint(256), proof_data~load_ref(), proof_data~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        slice update_data = in_msg_body~load_ref().begin_parse();
        update(update_data~load_ref(), update_data~load_uint(256), update_data~load_ref());
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}



================================================
FILE: contracts/collection_exotic.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/collection_exotic.fc
================================================
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global cell storage::api_data;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::value_too_low = 102;
const int error::not_exotic = 103;
const int error::not_merkle_proof = 104;
const int error::wrong_hash = 105;
const int error::bad_update = 106;
const int error::invalid_zero_hashes = 107;
const int error::index_too_high = 108;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;

const int item_init_value = 30000000;
const int minimum_claim_value = 85000000;

const int cell_type::merkle_proof = 3;

(slice, int) begin_parse_exotic(cell x) asm "XCTOS";

cell zero_hashes_dict() asm " B{b5ee9c7241023b010004ab000201c71c010201200d020201200603020148050400412924e95a1b53a326c469c2934ef9d6d61276d45b26d175be95e0954d4ab45f8ca00041372c457f2b3c9896bb269fbf1f42e0966fb062dc8d85968ee9bc1d90ddbf5e5f600201200a0702012009080041141ae9ccd6f0c29613d6fd6a779909e34d406b6fa0d422c2b1117f91f57165dee00041117958c6c8e399b60950abd4e8c0012da388b971a3d5de2b9f512d58718a98e4e00201200c0b0041067999a06a7a50296ddd3845a4bb26ccafcfd50def3d413751a63cb54e0670cd2000413319f3ec0c7df03ce75a18abec64f8c965250a7e8a193af9a051f4ebc2f64cad60020120150e020120120f02012011100041247cc2769bb44e9a2d04e2bc8166036cd9ae1875f3bea688c175fe950d232c6da00041132b8507aa832e81f3af722b0786cd94fb5c3db44e0247a859f665ab754969b5a00201201413004118f939b4855228f5a4b965fdd0c446e9204c533179d034d198eb60fd1ef77118e000412725bce396275113929e99995a04bfe8ed9f9910430632b636c98b6fbdae50b0e00201201916020120181700410f2003946b7df8b0272279a045e9e916ae8fb0ca48f406684a3ba5611585756f20004137036394a4ad9fabf4098f700c1a2b26a2c6a4122225fbbd419a2d3d3f45206a200201201b1a004107c5c013022e6c980851802f902c24e93a3e7e6b0f93e8c21cd14ef202e770efe000413ee8a745d3d291599269536c1630915e4daddb3d5acd3a97e400e3b7303569a7600201202c1d020120251e020120221f020120212000410c9c73124c98bdef3465ecc20fd915aec03169e9796144f012a825c61bf7dac560004136b354771fae9458b017731834835d5d2017763a07d8bb3d79851dd790725689a0020120242300412bc9e953d5087aa25544752426d41f39547aa22c6073abd51261f8bb8d09c0616000411a7026bef2a1f6578b692fa5e728a570e195a0b7f562e9ef54471f102ccf0c80200201202926020120282700412b466b46039f7156683b6652fdadab78382b0d79bc1deb6cad3eb5a5350e5bb1a000412a0b55af8a33479ec565a21ba52c9c9139b3f6079b73a0e8de242fde239b9fab200201202b2a0041033ed2411b5fc91088caf7eb13da9d48842f0809bf1c37b83a7eff511ff19b0f200041163a81eada1caddedfb9cdb455e771080bb9e288b3efe5e8082050af0463d915a0020120342d020120312e020120302f00412dfbdcbddd8301f96afb72bc36dd2a57e1eb141b22eaf15e45d4d6040547c38660004107cc387c90de5176110fcc8a63a99629b3d93f0b138795b2ec3f4df9bf756be7a002012033320041139f226107c6bea682dc41b23360b2e736ae1f2ac9d33186ee539ca6c9a8c451a000413e6f4348078f15e0fd3977e7c5f5d61d417a0b0007960c5682eea515f6eaf01fe00201203835020120373600410526d4e74a28305ad88dc6f5bafb655c54075306c564211dadb5654e7b9c92a86000412b04ac54adb5437b7db87fc2373d926ddb3455784e7d91f44d0c5983c1cc87b5a00201203a3900413c92216fe16fce3d2afca7c3aca45d10e5e1d1903fe79dfd549b18600323b7c2a000410e1254b628016fc636df30b61c6fe19c7f8e8d19631954f5d218ce28106be18a205639ff04} B>boc PUSHREF ";

int zero_hash(int depth) {
    (slice data, int found) = zero_hashes_dict().udict_get?(8, depth);
    throw_unless(error::invalid_zero_hashes, found);

    return data.preload_uint(256);
}

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_ref(storage::api_data)
        .end_cell());
}

(slice, cell) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

(cell, int) extract_merkle_proof(cell proof) impure {
    (slice s, int is_exotic) = proof.begin_parse_exotic();
    throw_unless(error::not_exotic, is_exotic);

    int ty = s~load_uint(8);
    throw_unless(error::not_merkle_proof, ty == cell_type::merkle_proof);

    return (s~load_ref(), s~load_uint(256));
}

cell check_merkle_proof(cell proof, int expected_hash) impure {
    (cell inner, int hash) = proof.extract_merkle_proof();
    throw_unless(error::wrong_hash, hash == expected_hash);

    return inner;
}

cell retrieve_child(cell c, int index, int depth) {
    depth -= 1;
    while (depth >= 0) {
        slice s = c.begin_parse();
        if ((index >> depth) & 1) {
            s~load_ref();
            c = s~load_ref();
        } else {
            c = s~load_ref();
        }
        depth -= 1;
    }
    return c;
}

() claim(int nft_index, cell proof) impure {
    throw_if(error::index_too_high, nft_index >= (1 << storage::merkle_depth));

    cell struct = proof.check_merkle_proof(storage::merkle_root);
    cell nft_data = struct.retrieve_child(nft_index, storage::merkle_depth);

    (slice owner, cell content) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).end_cell());
}

() check_update(cell old, cell new, int depth) impure {
    if (old.cell_depth() == 0) {
        if (old.cell_hash() == new.cell_hash()) {
            return ();
        }

        (slice s, int is_exotic) = old.begin_parse_exotic();
        throw_unless(error::bad_update, is_exotic);

        int ty_lvl = s~load_uint(16);
        throw_unless(error::bad_update, ty_lvl == 0x0101);

        int old_hash = s~load_uint(256);
        throw_unless(error::bad_update, old_hash == zero_hash(depth));
    } else {
        slice s_old = old.begin_parse();
        slice s_new = new.begin_parse();
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
    }
}

() update(cell update) impure {
    slice s = update.begin_parse();
    cell old_merkle = s~load_ref();
    cell new_merkle = s~load_ref();

    cell old = old_merkle.check_merkle_proof(storage::merkle_root);
    (cell new, int new_hash) = new_merkle.extract_merkle_proof();

    check_update(old, new, storage::merkle_depth);

    storage::merkle_root = new_hash;

    save_data();
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

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        throw_unless(error::value_too_low, msg_value >= minimum_claim_value);

        claim(in_msg_body~load_uint(256), in_msg_body~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        update(in_msg_body~load_ref());
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}



================================================
FILE: contracts/collection_exotic_sbt.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/collection_exotic_sbt.fc
================================================
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global cell storage::api_data;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::value_too_low = 102;
const int error::not_exotic = 103;
const int error::not_merkle_proof = 104;
const int error::wrong_hash = 105;
const int error::bad_update = 106;
const int error::invalid_zero_hashes = 107;
const int error::index_too_high = 108;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;

const int item_init_value = 30000000;
const int minimum_claim_value = 85000000;

const int cell_type::merkle_proof = 3;

(slice, int) begin_parse_exotic(cell x) asm "XCTOS";

cell zero_hashes_dict() asm " B{b5ee9c7241023b010004ab000201c71c010201200d020201200603020148050400412924e95a1b53a326c469c2934ef9d6d61276d45b26d175be95e0954d4ab45f8ca00041372c457f2b3c9896bb269fbf1f42e0966fb062dc8d85968ee9bc1d90ddbf5e5f600201200a0702012009080041141ae9ccd6f0c29613d6fd6a779909e34d406b6fa0d422c2b1117f91f57165dee00041117958c6c8e399b60950abd4e8c0012da388b971a3d5de2b9f512d58718a98e4e00201200c0b0041067999a06a7a50296ddd3845a4bb26ccafcfd50def3d413751a63cb54e0670cd2000413319f3ec0c7df03ce75a18abec64f8c965250a7e8a193af9a051f4ebc2f64cad60020120150e020120120f02012011100041247cc2769bb44e9a2d04e2bc8166036cd9ae1875f3bea688c175fe950d232c6da00041132b8507aa832e81f3af722b0786cd94fb5c3db44e0247a859f665ab754969b5a00201201413004118f939b4855228f5a4b965fdd0c446e9204c533179d034d198eb60fd1ef77118e000412725bce396275113929e99995a04bfe8ed9f9910430632b636c98b6fbdae50b0e00201201916020120181700410f2003946b7df8b0272279a045e9e916ae8fb0ca48f406684a3ba5611585756f20004137036394a4ad9fabf4098f700c1a2b26a2c6a4122225fbbd419a2d3d3f45206a200201201b1a004107c5c013022e6c980851802f902c24e93a3e7e6b0f93e8c21cd14ef202e770efe000413ee8a745d3d291599269536c1630915e4daddb3d5acd3a97e400e3b7303569a7600201202c1d020120251e020120221f020120212000410c9c73124c98bdef3465ecc20fd915aec03169e9796144f012a825c61bf7dac560004136b354771fae9458b017731834835d5d2017763a07d8bb3d79851dd790725689a0020120242300412bc9e953d5087aa25544752426d41f39547aa22c6073abd51261f8bb8d09c0616000411a7026bef2a1f6578b692fa5e728a570e195a0b7f562e9ef54471f102ccf0c80200201202926020120282700412b466b46039f7156683b6652fdadab78382b0d79bc1deb6cad3eb5a5350e5bb1a000412a0b55af8a33479ec565a21ba52c9c9139b3f6079b73a0e8de242fde239b9fab200201202b2a0041033ed2411b5fc91088caf7eb13da9d48842f0809bf1c37b83a7eff511ff19b0f200041163a81eada1caddedfb9cdb455e771080bb9e288b3efe5e8082050af0463d915a0020120342d020120312e020120302f00412dfbdcbddd8301f96afb72bc36dd2a57e1eb141b22eaf15e45d4d6040547c38660004107cc387c90de5176110fcc8a63a99629b3d93f0b138795b2ec3f4df9bf756be7a002012033320041139f226107c6bea682dc41b23360b2e736ae1f2ac9d33186ee539ca6c9a8c451a000413e6f4348078f15e0fd3977e7c5f5d61d417a0b0007960c5682eea515f6eaf01fe00201203835020120373600410526d4e74a28305ad88dc6f5bafb655c54075306c564211dadb5654e7b9c92a86000412b04ac54adb5437b7db87fc2373d926ddb3455784e7d91f44d0c5983c1cc87b5a00201203a3900413c92216fe16fce3d2afca7c3aca45d10e5e1d1903fe79dfd549b18600323b7c2a000410e1254b628016fc636df30b61c6fe19c7f8e8d19631954f5d218ce28106be18a205639ff04} B>boc PUSHREF ";

int zero_hash(int depth) {
    (slice data, int found) = zero_hashes_dict().udict_get?(8, depth);
    throw_unless(error::invalid_zero_hashes, found);

    return data.preload_uint(256);
}

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_ref(storage::api_data)
        .end_cell());
}

(slice, cell, slice) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref(), ds~load_msg_addr());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

(cell, int) extract_merkle_proof(cell proof) impure {
    (slice s, int is_exotic) = proof.begin_parse_exotic();
    throw_unless(error::not_exotic, is_exotic);

    int ty = s~load_uint(8);
    throw_unless(error::not_merkle_proof, ty == cell_type::merkle_proof);

    return (s~load_ref(), s~load_uint(256));
}

cell check_merkle_proof(cell proof, int expected_hash) impure {
    (cell inner, int hash) = proof.extract_merkle_proof();
    throw_unless(error::wrong_hash, hash == expected_hash);

    return inner;
}

cell retrieve_child(cell c, int index, int depth) {
    depth -= 1;
    while (depth >= 0) {
        slice s = c.begin_parse();
        if ((index >> depth) & 1) {
            s~load_ref();
            c = s~load_ref();
        } else {
            c = s~load_ref();
        }
        depth -= 1;
    }
    return c;
}

() claim(int nft_index, cell proof) impure {
    throw_if(error::index_too_high, nft_index >= (1 << storage::merkle_depth));

    cell struct = proof.check_merkle_proof(storage::merkle_root);
    cell nft_data = struct.retrieve_child(nft_index, storage::merkle_depth);

    (slice owner, cell content, slice authority) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).store_slice(authority).end_cell());
}

() check_update(cell old, cell new, int depth) impure {
    if (old.cell_depth() == 0) {
        if (old.cell_hash() == new.cell_hash()) {
            return ();
        }

        (slice s, int is_exotic) = old.begin_parse_exotic();
        throw_unless(error::bad_update, is_exotic);

        int ty_lvl = s~load_uint(16);
        throw_unless(error::bad_update, ty_lvl == 0x0101);

        int old_hash = s~load_uint(256);
        throw_unless(error::bad_update, old_hash == zero_hash(depth));
    } else {
        slice s_old = old.begin_parse();
        slice s_new = new.begin_parse();
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
    }
}

() update(cell update) impure {
    slice s = update.begin_parse();
    cell old_merkle = s~load_ref();
    cell new_merkle = s~load_ref();

    cell old = old_merkle.check_merkle_proof(storage::merkle_root);
    (cell new, int new_hash) = new_merkle.extract_merkle_proof();

    check_update(old, new, storage::merkle_depth);

    storage::merkle_root = new_hash;

    save_data();
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

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        throw_unless(error::value_too_low, msg_value >= minimum_claim_value);

        claim(in_msg_body~load_uint(256), in_msg_body~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        update(in_msg_body~load_ref());
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}



================================================
FILE: contracts/collection_new.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/collection_new.fc
================================================
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global cell storage::api_data;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::value_too_low = 102;
const int error::index_too_high = 103;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;

const int item_init_value = 30000000;
const int minimum_claim_value = 85000000;

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_ref(storage::api_data)
        .end_cell());
}

int hash_nodes(int a, int b) {
    return begin_cell().store_uint(a, 256).store_uint(b, 256).end_cell().cell_hash();
}

int check_proof(int root, cell proof, int leaf, int leaf_index, int depth) {
    int i = 0;
    int cur = leaf;
    slice ps = proof.begin_parse();
    while (i < depth) {
        int is_right = (leaf_index >> i) & 1;
        if (is_right) {
            cur = hash_nodes(ps.preload_uint(256), cur);
        } else {
            cur = hash_nodes(cur, ps.preload_uint(256));
        }
        ps = ps.preload_ref().begin_parse();
        i += 1;
    }
    return cur == root;
}

(slice, cell) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() claim(int nft_index, cell nft_data, cell proof) impure {
    throw_if(error::index_too_high, nft_index >= (1 << storage::merkle_depth));

    throw_unless(error::bad_proof, check_proof(storage::merkle_root, proof, nft_data.cell_hash(), nft_index, storage::merkle_depth));

    (slice owner, cell content) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).end_cell());
}

(int, int) process_update(cell update, tuple zh, int depth) {
    slice cs = update.begin_parse();
    int leaf = cs~load_int(1);
    if (leaf) {
        int proof = cs~load_int(1);
        int hash = cs~load_uint(256);
        if (proof) {
            return (hash, hash);
        } else { ;; update
            return (zh.at(depth), hash);
        }
    } else {
        (int old_left, int new_left) = process_update(cs~load_ref(), zh, depth - 1);
        (int old_right, int new_right) = process_update(cs~load_ref(), zh, depth - 1);
        return (hash_nodes(old_left, old_right), hash_nodes(new_left, new_right));
    }
}

() update(cell update) impure {
    tuple zh = empty_tuple();
    zh~tpush(0);
    int i = 0;
    while (i < storage::merkle_depth - 1) {
        int prev = zh.at(i);
        zh~tpush(hash_nodes(prev, prev));
        i += 1;
    }

    (int old_hash, int new_hash) = process_update(update, zh, storage::merkle_depth);

    throw_unless(error::bad_proof, old_hash == storage::merkle_root);

    storage::merkle_root = new_hash;

    save_data();
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

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        throw_unless(error::value_too_low, msg_value >= minimum_claim_value);

        slice proof_data = in_msg_body~load_ref().begin_parse();
        claim(in_msg_body~load_uint(256), proof_data~load_ref(), proof_data~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        update(in_msg_body~load_ref());
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}



================================================
FILE: contracts/imports/op-codes.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/imports/op-codes.fc
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



================================================
FILE: contracts/imports/params.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/imports/params.fc
================================================
#include "stdlib.fc";

const int workchain = 0;

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain);
}

slice null_addr() asm "b{00} PUSHSLICE";
int flag::regular() asm "0x10 PUSHINT";
int flag::bounce() asm "0x8 PUSHINT";



================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
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
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

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
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

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
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

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
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

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
builder store_coins(builder b, int x) asm "STGRAMS";

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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

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

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";
int builder_null?(builder b) asm "ISNULL";



================================================
FILE: contracts/item.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/item.fc
================================================
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

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

    if (~ null?(payload)) {
        msg = msg.store_builder(payload);
    }

    send_raw_message(msg.end_cell(), send_mode);
}

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
    throw_unless(401, equal_slices(sender_address, owner_address));

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

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    return (init?, index, collection_address, owner_address, content);
}



================================================
FILE: contracts/sbt_item.fc
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/sbt_item.fc
================================================
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

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
        throw_unless(405, equal_slices(storage::collection_address, sender_address));

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
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

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
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

        send_msg(flag::regular(), sender_address, 0, op::excesses(), query_id, null(), 128);

        storage::owner_address = null_addr();
        storage::authority_address = null_addr();
        store_data();
        return ();
    }
    if (op == op::revoke()) {
        throw_unless(401, equal_slices(storage::authority_address, sender_address));
        throw_unless(403, storage::revoked_at == 0);

        storage::revoked_at = now();
        store_data();
        return ();
    }
    if (op == op::take_excess()) {
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

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
FILE: jest.config.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: merkle/merkle.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/merkle/merkle.ts
================================================
import { sha256_sync } from 'ton-crypto';

function hash(b: Buffer): Buffer {
    return sha256_sync(b);
}

export function bufferToInt(b: Buffer): bigint {
    return BigInt('0x' + b.toString('hex'));
}

export function hashToInt(b: Buffer): bigint {
    return bufferToInt(hash(b));
}

export class MerkleTree {
    constructor(public readonly buf: bigint[], public readonly depth: number, public readonly hash: (a: bigint, b: bigint) => bigint) {}

    static fromLeaves(leaves: bigint[], hash: (a: bigint, b: bigint) => bigint) {
        const depth = Math.log2(leaves.length);
        if (!Number.isInteger(depth)) {
            throw new Error('Bad leaves array');
        }
        const buf: bigint[] = new Array(leaves.length * 2);
        for (let i = 0; i < leaves.length; i++) {
            buf[leaves.length + i] = leaves[i];
        }
        for (let i = depth - 1; i >= 0; i--) {
            for (let j = Math.pow(2, i); j < Math.pow(2, i+1); j++) {
                buf[j] = hash(buf[2*j], buf[2*j+1]);
            }
        }
        return new MerkleTree(buf, depth, hash);
    }

    leafIdxToNodeIdx(i: number) {
        return Math.pow(2, this.depth) + i;
    }

    root() {
        return this.buf[1];
    }

    leaf(i: number) {
        return this.buf[Math.pow(2, this.depth) + i];
    }

    node(i: number) {
        return this.buf[i];
    }

    proofWithIndices(i: number) {
        const proof: { index: number, value: bigint }[] = [];
        for (let j = 0; j < this.depth; j++) {
            i ^= 1;
            proof.push({ value: this.node(i), index: i });
            i >>= 1;
        }
        return proof;
    }

    proofForNode(i: number): bigint[] {
        return this.proofWithIndices(i).map(v => v.value);
    }

    generateUpdate(leaves: bigint[]) {
        const totalLeaves = 1 << this.depth;
        if (leaves.length >= totalLeaves) {
            throw new Error('Cannot fully update the tree');
        }
        const from = totalLeaves - leaves.length;
        const nodes = leaves.map((l, i) => ({ index: totalLeaves + from + i, value: l, depth: this.depth }));
        let updated = false;
        do {
            if (nodes.length < 2) {
                break;
            }
            for (let i = 0; i < nodes.length - 1; i++) {
                if (nodes[i].depth === nodes[i+1].depth && (nodes[i].index ^ nodes[i+1].index) === 1) {
                    nodes.splice(i, 2, { index: nodes[i].index >> 1, value: this.hash(nodes[i].value, nodes[i+1].value), depth: nodes[i].depth - 1 });
                }
            }
        } while (updated);
        const proof = this.proofWithIndices(totalLeaves + from).filter(p => nodes.findIndex(n => n.index === p.index) === -1);
        return {
            nodes,
            proof,
        };
    }
}



================================================
FILE: package.json
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/package.json
================================================
{
    "name": "compressed-nft-contract",
    "version": "0.0.1",
    "license": "MIT",
    "scripts": {
        "test": "jest"
    },
    "devDependencies": {
        "@ton-community/blueprint": "^0.10.0",
        "@ton-community/sandbox": "^0.11.0",
        "@ton-community/test-utils": "^0.2.0",
        "@types/jest": "^29.5.0",
        "@types/node": "^20.2.5",
        "jest": "^29.5.0",
        "prettier": "^2.8.6",
        "ton": "^13.4.1",
        "ton-core": "^0.49.0",
        "ton-crypto": "^3.2.0",
        "ts-jest": "^29.0.5",
        "ts-node": "^10.9.1",
        "typescript": "^4.9.5"
    }
}



================================================
FILE: tests/Collection.spec.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/tests/Collection.spec.ts
================================================
import { Blockchain, SandboxContract, printTransactionFees } from '@ton-community/sandbox';
import { Cell, beginCell, toNano } from 'ton-core';
import { Collection, UpdateItem } from '../wrappers/Collection';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { MerkleTree, bufferToInt } from '../merkle/merkle';

const merkleHash = (a: bigint, b: bigint) => bufferToInt(beginCell().storeUint(a, 256).storeUint(b, 256).endCell().hash());

describe('Collection', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Collection');
    });

    let blockchain: Blockchain;
    let collection: SandboxContract<Collection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
    });

    it('should claim', async () => {
        const claimer = await blockchain.treasury('claimer');

        const data = beginCell().storeAddress(claimer.address).storeRef(new Cell()).endCell();
        const merkle = MerkleTree.fromLeaves([bufferToInt(data.hash()), 0n, 0n, 0n], merkleHash);

        const deployer = await blockchain.treasury('deployer');

        collection = blockchain.openContract(Collection.createFromConfig({
            root: merkle.root(),
            depth: merkle.depth,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
            lastIndex: BigInt(Math.pow(2, merkle.depth) - 1),
            apiVersion: 1,
            apiLink: '',
        }, code));

        const deployResult = await collection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            deploy: true,
            success: true,
        });

        (await blockchain.getContract(collection.address)).verbosity = {
            vmLogs: 'none',
            print: true,
            debugLogs: true,
            blockchainLogs: false,
        };

        const itemAddress = await collection.getItemAddress(0n);

        const claimResult = await collection.sendClaim(claimer.getSender(), {
            index: 0n, data, proof: merkle.proofForNode(4)
        });

        expect(claimResult.transactions).toHaveTransaction({
            from: collection.address,
            on: itemAddress,
            success: true,
        });

        printTransactionFees(claimResult.transactions);
    });

    it('should update', async () => {
        const merkle = MerkleTree.fromLeaves([1n, 2n, 3n, 4n, 5n, 0n, 0n, 0n], merkleHash);

        const deployer = await blockchain.treasury('deployer');

        collection = blockchain.openContract(Collection.createFromConfig({
            root: merkle.root(),
            depth: merkle.depth,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
            lastIndex: 4n,
            apiVersion: 1,
            apiLink: '',
        }, code));

        const deployResult = await collection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            deploy: true,
            success: true,
        });

        (await blockchain.getContract(collection.address)).verbosity = {
            vmLogs: 'none',
            print: true,
            debugLogs: true,
            blockchainLogs: false,
        };

        const upd = merkle.generateUpdate([6n, 7n, 0n]);

        const updRes = await collection.sendUpdate(deployer.getSender(), {
            newLastIndex: 6n,
            updates: upd.nodes,
            hashes: upd.proof,
        });

        printTransactionFees(updRes.transactions);

        const newRoot = await collection.getMerkleRoot();

        const merkle2 = MerkleTree.fromLeaves([1n, 2n, 3n, 4n, 5n, 6n, 7n, 0n], merkleHash);

        expect(newRoot).toEqual(merkle2.root());

        const upd2 = merkle2.generateUpdate([8n]);

        const upd2Res = await collection.sendUpdate(deployer.getSender(), {
            newLastIndex: 7n,
            updates: upd2.nodes,
            hashes: upd2.proof,
        });

        printTransactionFees(upd2Res.transactions);

        const newRoot2 = await collection.getMerkleRoot();

        const merkle22 = MerkleTree.fromLeaves([1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n], merkleHash);

        expect(newRoot2).toEqual(merkle22.root());
    });

    it('should work with high levels', async () => {
        const levels = 30;

        const deployer = await blockchain.treasury('deployer');

        const data = beginCell()
            .storeAddress(deployer.address)
            .storeRef(new Cell())
            .endCell();

        let curHash = bufferToInt(data.hash());
        let zeroHash = 0n;
        let zhs = [zeroHash];
        for (let i = 0; i < levels; i++) {
            curHash = merkleHash(curHash, zeroHash);
            zeroHash = merkleHash(zeroHash, zeroHash);
            zhs.push(zeroHash);
        }

        zhs.pop();

        collection = blockchain.openContract(Collection.createFromConfig({
            root: curHash,