# GitHub Docs Parser - Part 12

            depth: levels,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
            lastIndex: 0n,
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

        const claimResult = await collection.sendClaim(deployer.getSender(), {
            index: 0n,
            data,
            proof: zhs,
            value: toNano('2'),
        });

        expect(claimResult.transactions).toHaveTransaction({
            on: collection.address,
            success: true,
        });

        printTransactionFees(claimResult.transactions);
    });

    it('should update with high levels', async () => {
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
            depth: levels,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
            lastIndex: 0n,
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

        const data2 = beginCell()
            .storeAddress(deployer.address)
            .storeRef(beginCell().storeUint(1, 8))
            .endCell();

        const updates: UpdateItem[] = [{ index: (1 << levels) + 1, value: bufferToInt(data2.hash()), depth: levels }];

        for (let i = 1; i < levels; i++) {
            updates.push({ index: (updates[i-1].index >> 1) + 1, value: zhs[i], depth: updates[i-1].depth - 1 });
        }

        const updateResult = await collection.sendUpdate(deployer.getSender(), {
            updates,
            hashes: [{ index: (1 << levels), value: bufferToInt(data.hash()) }],
            newLastIndex: 1n,
            value: toNano('1'),
        });

        expect(updateResult.transactions).toHaveTransaction({
            on: collection.address,
            success: true,
        });

        printTransactionFees(updateResult.transactions);
    });
});



================================================
FILE: tests/CollectionExotic.spec.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/tests/CollectionExotic.spec.ts
================================================
import { Blockchain, SandboxContract, printTransactionFees } from '@ton-community/sandbox';
import { Address, Cell, Dictionary, beginCell, toNano } from 'ton-core';
import { CollectionExotic } from '../wrappers/CollectionExotic';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

function convertToPrunedBranch(c: Cell): Cell {
    return new Cell({
        exotic: true,
        bits: beginCell()
            .storeUint(1, 8)
            .storeUint(1, 8)
            .storeBuffer(c.hash(0))
            .storeUint(c.depth(0), 16)
            .endCell()
            .beginParse()
            .loadBits(288),
    });
}

function convertToMerkleProof(c: Cell): Cell {
    return new Cell({
        exotic: true,
        bits: beginCell()
            .storeUint(3, 8)
            .storeBuffer(c.hash(0))
            .storeUint(c.depth(0), 16)
            .endCell()
            .beginParse()
            .loadBits(280),
        refs: [c],
    });
}

const zeroPB = new Cell({
    exotic: true,
    bits: beginCell().storeUint(1, 8).storeUint(1, 8).storeBuffer(Buffer.alloc(32)).storeUint(0, 16).endCell().beginParse().loadBits(288),
});

// function makePrunedNode(l: Cell, r: Cell): Cell {
//     return convertToPrunedBranch(beginCell().storeRef(l).storeRef(r).endCell());
// }

function makeZeroHashesDict(levels: number) {
    const dict = Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Buffer(32));
    let cur = zeroPB;
    for (let i = 0; i < levels; i++) {
        dict.set(i, cur.hash());
        cur = convertToPrunedBranch(beginCell().storeRef(cur).storeRef(cur).endCell());
    }
    return beginCell().storeDictDirect(dict).endCell();
}

describe('CollectionExotic', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('CollectionExotic');
    });

    let blockchain: Blockchain;
    let collection: SandboxContract<CollectionExotic>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
    });

    it('should claim', async () => {
        const claimer = await blockchain.treasury('claimer');

        const data = beginCell().storeAddress(claimer.address).storeRef(new Cell()).endCell();

        const tree = beginCell()
            .storeRef(beginCell()
                .storeRef(data)
                .storeRef(zeroPB))
            .storeRef(beginCell()
                .storeRef(zeroPB)
                .storeRef(zeroPB))
            .endCell();

        const merkle = convertToMerkleProof(beginCell()
            .storeRef(tree.refs[0])
            .storeRef(convertToPrunedBranch(tree.refs[1]))
            .endCell());

        const deployer = await blockchain.treasury('deployer');

        collection = blockchain.openContract(CollectionExotic.createFromConfig({
            root: BigInt('0x' + tree.hash(0).toString('hex')),
            depth: 2,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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

        const itemAddress = await collection.getItemAddress(0n);

        const claimResult = await collection.sendPremadeProof(claimer.getSender(), {
            index: 0n,
            proofCell: merkle,
        });

        expect(claimResult.transactions).toHaveTransaction({
            from: collection.address,
            on: itemAddress,
            success: true,
        });

        printTransactionFees(claimResult.transactions);
    });

    it('should update', async () => {
        const claimer = await blockchain.treasury('claimer');

        const data = beginCell().storeAddress(claimer.address).storeRef(new Cell()).endCell();

        const tree = beginCell()
            .storeRef(beginCell()
                .storeRef(data)
                .storeRef(zeroPB))
            .storeRef(beginCell()
                .storeRef(zeroPB)
                .storeRef(zeroPB))
            .endCell();

        const deployer = await blockchain.treasury('deployer');

        collection = blockchain.openContract(CollectionExotic.createFromConfig({
            root: BigInt('0x' + tree.hash(0).toString('hex')),
            depth: 2,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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

        const old = convertToMerkleProof(beginCell()
            .storeRef(beginCell().storeRef(convertToPrunedBranch(data)).storeRef(zeroPB))
            .storeRef(convertToPrunedBranch(tree.refs[1]))
            .endCell());

        const neww = convertToMerkleProof(beginCell()
            .storeRef(beginCell()
                .storeRef(convertToPrunedBranch(data))
                .storeRef(convertToPrunedBranch(data)))
            .storeRef(convertToPrunedBranch(tree.refs[1]))
            .endCell());

        const updateResult = await collection.sendPremadeUpdate(deployer.getSender(), {
            updateCell: beginCell().storeRef(old).storeRef(neww).endCell(),
        });

        expect(updateResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            success: true,
        });

        const root = await collection.getMerkleRoot();

        expect(root).toEqual(BigInt('0x' + neww.refs[0].hash(0).toString('hex')));
    });

    it('should work with high levels', async () => {
        const levels = 30;

        const deployer = await blockchain.treasury('deployer');

        const data = beginCell()
            .storeAddress(deployer.address)
            .storeRef(new Cell())
            .endCell();

        let curNode = data;
        let zeroNode = zeroPB;
        let zns = [zeroNode];
        for (let i = 0; i < levels; i++) {
            curNode = beginCell().storeRef(curNode).storeRef(zeroNode).endCell();
            zeroNode = convertToPrunedBranch(beginCell().storeRef(zeroNode).storeRef(zeroNode).endCell());
            zns.push(zeroNode);
        }

        zns.pop();

        collection = blockchain.openContract(CollectionExotic.createFromConfig({
            root: BigInt('0x' + curNode.hash(0).toString('hex')),
            depth: levels,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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

        const merkle = convertToMerkleProof(curNode);

        const claimResult = await collection.sendPremadeProof(deployer.getSender(), {
            index: 0n,
            proofCell: merkle,
        });

        expect(claimResult.transactions).toHaveTransaction({
            on: collection.address,
            success: true,
        });

        printTransactionFees(claimResult.transactions);
    });

    it('should update with high levels', async () => {
        const levels = 30;

        const deployer = await blockchain.treasury('deployer');

        const data = beginCell()
            .storeAddress(deployer.address)
            .storeRef(new Cell())
            .endCell();

        let curNode = data;
        let zeroNode = zeroPB;
        let zns = [zeroNode];
        for (let i = 0; i < levels; i++) {
            curNode = beginCell().storeRef(curNode).storeRef(zeroNode).endCell();
            zeroNode = convertToPrunedBranch(beginCell().storeRef(zeroNode).storeRef(zeroNode).endCell());
            zns.push(zeroNode);
        }

        zns.pop();

        collection = blockchain.openContract(CollectionExotic.createFromConfig({
            root: BigInt('0x' + curNode.hash(0).toString('hex')),
            depth: levels,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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

        const data2 = beginCell()
            .storeAddress(deployer.address)
            .storeRef(beginCell().storeUint(1, 8))
            .endCell();

        let old = beginCell()
            .storeRef(convertToPrunedBranch(data))
            .storeRef(zeroPB)
            .endCell();
        let neww = beginCell()
            .storeRef(convertToPrunedBranch(data))
            .storeRef(convertToPrunedBranch(data2))
            .endCell();

        for (let i = 1; i < levels; i++) {
            old = beginCell()
                .storeRef(old)
                .storeRef(zns[i])
                .endCell();
            neww = beginCell()
                .storeRef(neww)
                .storeRef(zns[i])
                .endCell();
        }

        const updateResult = await collection.sendPremadeUpdate(deployer.getSender(), {
            updateCell: beginCell().storeRef(convertToMerkleProof(old)).storeRef(convertToMerkleProof(neww)).endCell(),
            value: toNano('1'),
        });

        expect(updateResult.transactions).toHaveTransaction({
            from: deployer.address,
            on: collection.address,
            success: true,
        });

        printTransactionFees(updateResult.transactions);
    });
});



================================================
FILE: tests/CollectionExoticSbt.spec.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/tests/CollectionExoticSbt.spec.ts
================================================
import { Blockchain, SandboxContract, createShardAccount } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { CollectionExoticSbt } from '../wrappers/CollectionExoticSbt';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

describe('CollectionExoticSbt', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('CollectionExoticSbt');
    });

    let blockchain: Blockchain;
    let collectionExoticSbt: SandboxContract<CollectionExoticSbt>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        collectionExoticSbt = blockchain.openContract(CollectionExoticSbt.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await collectionExoticSbt.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: collectionExoticSbt.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and collectionExoticSbt are ready to use
    });
});



================================================
FILE: tests/CollectionNew.spec.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/tests/CollectionNew.spec.ts
================================================
import { Blockchain, SandboxContract, printTransactionFees } from '@ton-community/sandbox';
import { Cell, beginCell, toNano } from 'ton-core';
import { CollectionNew, UpdateItem } from '../wrappers/CollectionNew';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { MerkleTree, bufferToInt } from '../merkle/merkle';

const merkleHash = (a: bigint, b: bigint) => bufferToInt(beginCell().storeUint(a, 256).storeUint(b, 256).endCell().hash());

describe('Collection', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('CollectionNew');
    });

    let blockchain: Blockchain;
    let collection: SandboxContract<CollectionNew>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
    });

    it('should claim', async () => {
        const claimer = await blockchain.treasury('claimer');

        const data = beginCell().storeAddress(claimer.address).storeRef(new Cell()).endCell();
        const merkle = MerkleTree.fromLeaves([bufferToInt(data.hash()), 0n, 0n, 0n], merkleHash);

        const deployer = await blockchain.treasury('deployer');

        collection = blockchain.openContract(CollectionNew.createFromConfig({
            root: merkle.root(),
            depth: merkle.depth,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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

        collection = blockchain.openContract(CollectionNew.createFromConfig({
            root: merkle.root(),
            depth: merkle.depth,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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
            updates: upd.nodes,
            hashes: upd.proof,
        });

        printTransactionFees(updRes.transactions);

        const newRoot = await collection.getMerkleRoot();

        const merkle2 = MerkleTree.fromLeaves([1n, 2n, 3n, 4n, 5n, 6n, 7n, 0n], merkleHash);

        expect(newRoot).toEqual(merkle2.root());

        const upd2 = merkle2.generateUpdate([8n]);

        const upd2Res = await collection.sendUpdate(deployer.getSender(), {
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

        collection = blockchain.openContract(CollectionNew.createFromConfig({
            root: curHash,
            depth: levels,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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

        const claimResult = await collection.sendClaim(deployer.getSender(), {
            index: 0n,
            data,
            proof: zhs,
            value: toNano('2'),
        });

        expect(claimResult.transactions).toHaveTransaction({
            on: collection.address,
            success: true,
        });

        printTransactionFees(claimResult.transactions);
    });

    it('should update with high levels', async () => {
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

        collection = blockchain.openContract(CollectionNew.createFromConfig({
            root: curHash,
            depth: levels,
            itemCode: await compile('Item'),
            owner: deployer.address,
            content: new Cell(),
            royalty: new Cell(),
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

        const data2 = beginCell()
            .storeAddress(deployer.address)
            .storeRef(beginCell().storeUint(1, 8))
            .endCell();

        const updates: UpdateItem[] = [{ index: (1 << levels) + 1, value: bufferToInt(data2.hash()), depth: levels }];

        for (let i = 1; i < levels; i++) {
            updates.push({ index: (updates[i-1].index >> 1) + 1, value: zhs[i], depth: updates[i-1].depth - 1 });
        }

        const updateResult = await collection.sendUpdate(deployer.getSender(), {
            updates,
            hashes: [{ index: (1 << levels), value: bufferToInt(data.hash()) }],
            value: toNano('1'),
        });

        expect(updateResult.transactions).toHaveTransaction({
            on: collection.address,
            success: true,
        });

        printTransactionFees(updateResult.transactions);
    });
});



================================================
FILE: tests/Item.spec.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/tests/Item.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Item } from '../wrappers/Item';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Item', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Item');
    });

    let blockchain: Blockchain;
    let item: SandboxContract<Item>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        item = blockchain.openContract(Item.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await item.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: item.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and item are ready to use
    });
});



================================================
FILE: tests/SbtItem.spec.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/tests/SbtItem.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { SbtItem } from '../wrappers/SbtItem';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('SbtItem', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SbtItem');
    });

    let blockchain: Blockchain;
    let sbtItem: SandboxContract<SbtItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sbtItem = blockchain.openContract(SbtItem.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await sbtItem.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sbtItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sbtItem are ready to use
    });
});



================================================
FILE: wrappers/Collection.compile.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/Collection.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/collection.fc'],
};



================================================
FILE: wrappers/Collection.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/Collection.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, DictionaryValue, Sender, SendMode, toNano } from 'ton-core';

export type CollectionConfig = {
    root: bigint,
    depth: number,
    itemCode: Cell,
    owner: Address,
    content: Cell,
    royalty: Cell,
    lastIndex: bigint,
    apiVersion: number,
    apiLink: string,
};

export function collectionConfigToCell(config: CollectionConfig): Cell {
    return beginCell()
        .storeUint(config.root, 256)
        .storeUint(config.depth, 8)
        .storeRef(config.itemCode)
        .storeAddress(config.owner)
        .storeRef(config.content)
        .storeRef(config.royalty)
        .storeUint(config.lastIndex, 256)
        .storeRef(beginCell()
            .storeUint(config.apiVersion, 8)
            .storeRef(beginCell().storeStringTail(config.apiLink)))
        .endCell();
}

export type UpdateItem = { index: number, value: bigint, depth: number };

const UpdateItemValue: DictionaryValue<UpdateItem> = {
    serialize(src, builder) {
        builder.storeUint(src.index, 256).storeUint(src.value, 256)
    },
    parse(src) {
        throw '';
    },
};

export class Collection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Collection(address);
    }

    static createFromConfig(config: CollectionConfig, code: Cell, workchain = 0) {
        const data = collectionConfigToCell(config);
        const init = { code, data };
        return new Collection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendPremadeProof(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        proofCell: Cell,
        value?: bigint,
    }) {
        await provider.internal(via, {
            value: params.value ?? toNano('0.1'),
            bounce: true,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x13a3ca6, 32)
                .storeUint(params.queryId ?? 0, 64)
                .storeRef(params.proofCell)
                .endCell(),
        });
    }

    async sendClaim(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        index: bigint,
        data: Cell,
        proof: bigint[],
        value?: bigint,
    }) {
        const proofDict = Dictionary.empty(Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(256));

        for (let i = 0; i < params.proof.length; i++) {
            proofDict.set(i, params.proof[i]);
        }

        const pdb = beginCell();
        proofDict.storeDirect(pdb);

        await this.sendPremadeProof(provider, via, {
            queryId: params.queryId,
            value: params.value,
            proofCell: beginCell()
                .storeUint(params.index, 256)
                .storeRef(params.data)
                .storeRef(pdb)
                .endCell()
        });
    }

    async sendUpdate(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        newLastIndex: bigint,
        updates: UpdateItem[],
        hashes: { index: number, value: bigint }[],
        value?: bigint,
    }) {
        const updatesDict = Dictionary.empty(Dictionary.Keys.Uint(32), UpdateItemValue);
        params.updates.forEach(u => {
            updatesDict.set(u.depth, u);
        });

        const hashesDict = Dictionary.empty(Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(256));
        params.hashes.forEach(h => {
            hashesDict.set(h.index, h.value);
        });

        const udb = beginCell();
        updatesDict.storeDirect(udb);

        const hdb = beginCell();
        hashesDict.storeDirect(hdb);

        const body = beginCell()
            .storeUint(0x23cd52c, 32)
            .storeUint(params.queryId ?? 0, 64)
            .storeRef(beginCell()
                .storeUint(params.newLastIndex, 256)
                .storeRef(udb)
                .storeRef(hdb))
            .endCell();

        await provider.internal(via, {
            value: params.value ?? toNano('0.5'),
            bounce: true,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async getItemAddress(provider: ContractProvider, index: bigint) {
        const result = await provider.get('get_nft_address_by_index', [
            { type: 'int', value: index },
        ]);
        return result.stack.readAddress();
    }

    async getMerkleRoot(provider: ContractProvider) {
        const result = await provider.get('get_merkle_root', []);
        return result.stack.readBigNumber();
    }
}



================================================
FILE: wrappers/CollectionExotic.compile.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/CollectionExotic.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/collection_exotic.fc'],
};



================================================
FILE: wrappers/CollectionExotic.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/CollectionExotic.ts
================================================
import { Address, beginCell, Builder, Cell, Contract, contractAddress, ContractProvider, DictionaryValue, Sender, SendMode, toNano } from 'ton-core';

export type CollectionConfig = {
    root: bigint,
    depth: number,
    itemCode: Cell,
    owner: Address,
    content: Cell,
    royalty: Cell,
    apiVersion: number,
    apiLink: string,
};

export function collectionConfigToCell(config: CollectionConfig): Cell {
    return beginCell()
        .storeUint(config.root, 256)
        .storeUint(config.depth, 8)
        .storeRef(config.itemCode)
        .storeAddress(config.owner)
        .storeRef(config.content)
        .storeRef(config.royalty)
        .storeRef(beginCell()
            .storeUint(config.apiVersion, 8)
            .storeRef(beginCell().storeStringTail(config.apiLink)))
        .endCell();
}

export type UpdateItem = { index: number, value: bigint, depth: number };

const UpdateItemValue: DictionaryValue<UpdateItem> = {
    serialize(src, builder) {
        builder.storeUint(src.index, 256).storeUint(src.value, 256)
    },
    parse(src) {
        throw '';
    },
};

function buildUpdateCell(updates: UpdateItem[], hashes: { index: number, value: bigint }[], index: number): Cell {
    const hash = hashes.find(h => h.index === index);
    if (hash !== undefined) {
        return beginCell().storeBit(true).storeBit(true).storeUint(hash.value, 256).endCell();
    }

    const update = updates.find(u => u.index === index);
    if (update !== undefined) {
        return beginCell().storeBit(true).storeBit(false).storeUint(update.value, 256).endCell();
    }

    const left = buildUpdateCell(updates, hashes, 2*index);
    const right = buildUpdateCell(updates, hashes, 2*index+1);

    return beginCell().storeBit(false).storeRef(left).storeRef(right).endCell();
}

export class CollectionExotic implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new CollectionExotic(address);
    }

    static createFromConfig(config: CollectionConfig, code: Cell, workchain = 0) {
        const data = collectionConfigToCell(config);
        const init = { code, data };
        return new CollectionExotic(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendPremadeProof(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        index: bigint,
        proofCell: Cell,
        value?: bigint,
    }) {
        await provider.internal(via, {
            value: params.value ?? toNano('0.1'),
            bounce: true,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x13a3ca6, 32)
                .storeUint(params.queryId ?? 0, 64)
                .storeUint(params.index, 256)
                .storeRef(params.proofCell)
                .endCell(),
        });
    }

    async sendPremadeUpdate(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        updateCell: Cell,
        value?: bigint,
    }) {
        await provider.internal(via, {
            value: params.value ?? toNano('0.5'),
            bounce: true,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x23cd52c, 32)
                .storeUint(params.queryId ?? 0, 64)
                .storeRef(params.updateCell)
                .endCell(),
        });
    }

    async getItemAddress(provider: ContractProvider, index: bigint) {
        const result = await provider.get('get_nft_address_by_index', [
            { type: 'int', value: index },
        ]);
        return result.stack.readAddress();
    }

    async getMerkleRoot(provider: ContractProvider) {
        const result = await provider.get('get_merkle_root', []);
        return result.stack.readBigNumber();
    }
}



================================================
FILE: wrappers/CollectionExoticSbt.compile.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/CollectionExoticSbt.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/collection_exotic_sbt.fc'],
};



================================================
FILE: wrappers/CollectionExoticSbt.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/CollectionExoticSbt.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type CollectionExoticSbtConfig = {};

export function collectionExoticSbtConfigToCell(config: CollectionExoticSbtConfig): Cell {
    return beginCell().endCell();
}

export class CollectionExoticSbt implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new CollectionExoticSbt(address);
    }

    static createFromConfig(config: CollectionExoticSbtConfig, code: Cell, workchain = 0) {
        const data = collectionExoticSbtConfigToCell(config);
        const init = { code, data };
        return new CollectionExoticSbt(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}



================================================
FILE: wrappers/CollectionNew.compile.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/CollectionNew.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/collection_new.fc'],
};



================================================
FILE: wrappers/CollectionNew.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/CollectionNew.ts
================================================
import { Address, beginCell, Builder, Cell, Contract, contractAddress, ContractProvider, DictionaryValue, Sender, SendMode, toNano } from 'ton-core';

export type CollectionConfig = {
    root: bigint,
    depth: number,
    itemCode: Cell,
    owner: Address,
    content: Cell,
    royalty: Cell,
    apiVersion: number,
    apiLink: string,
};

export function collectionConfigToCell(config: CollectionConfig): Cell {
    return beginCell()
        .storeUint(config.root, 256)
        .storeUint(config.depth, 8)
        .storeRef(config.itemCode)
        .storeAddress(config.owner)
        .storeRef(config.content)
        .storeRef(config.royalty)
        .storeRef(beginCell()
            .storeUint(config.apiVersion, 8)
            .storeRef(beginCell().storeStringTail(config.apiLink)))
        .endCell();
}

export type UpdateItem = { index: number, value: bigint, depth: number };

const UpdateItemValue: DictionaryValue<UpdateItem> = {
    serialize(src, builder) {
        builder.storeUint(src.index, 256).storeUint(src.value, 256)
    },
    parse(src) {
        throw '';
    },
};

function buildUpdateCell(updates: UpdateItem[], hashes: { index: number, value: bigint }[], index: number): Cell {
    const hash = hashes.find(h => h.index === index);
    if (hash !== undefined) {
        return beginCell().storeBit(true).storeBit(true).storeUint(hash.value, 256).endCell();
    }

    const update = updates.find(u => u.index === index);
    if (update !== undefined) {
        return beginCell().storeBit(true).storeBit(false).storeUint(update.value, 256).endCell();
    }

    const left = buildUpdateCell(updates, hashes, 2*index);
    const right = buildUpdateCell(updates, hashes, 2*index+1);

    return beginCell().storeBit(false).storeRef(left).storeRef(right).endCell();
}

export class CollectionNew implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new CollectionNew(address);
    }

    static createFromConfig(config: CollectionConfig, code: Cell, workchain = 0) {
        const data = collectionConfigToCell(config);
        const init = { code, data };
        return new CollectionNew(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendPremadeProof(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        index: bigint,
        proofCell: Cell,
        value?: bigint,
    }) {
        await provider.internal(via, {
            value: params.value ?? toNano('0.1'),
            bounce: true,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x13a3ca6, 32)
                .storeUint(params.queryId ?? 0, 64)
                .storeUint(params.index, 256)
                .storeRef(params.proofCell)
                .endCell(),
        });
    }

    async sendClaim(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        index: bigint,
        data: Cell,
        proof: bigint[],
        value?: bigint,
    }) {
        const pb: Builder[] = params.proof.map(e => beginCell().storeUint(e, 256));
        let proofCell = new Cell();
        while (pb.length > 0) {
            proofCell = pb.pop()!.storeRef(proofCell).endCell();
        }

        await this.sendPremadeProof(provider, via, {
            queryId: params.queryId,
            value: params.value,
            index: params.index,
            proofCell: beginCell()
                .storeRef(params.data)
                .storeRef(proofCell)
                .endCell()
        });
    }

    async sendUpdate(provider: ContractProvider, via: Sender, params: {
        queryId?: bigint,
        updates: UpdateItem[],
        hashes: { index: number, value: bigint }[],
        value?: bigint,
    }) {
        const body = beginCell()
            .storeUint(0x23cd52c, 32)
            .storeUint(params.queryId ?? 0, 64)
            .storeRef(buildUpdateCell(params.updates, params.hashes, 1))
            .endCell();

        await provider.internal(via, {
            value: params.value ?? toNano('0.5'),
            bounce: true,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async getItemAddress(provider: ContractProvider, index: bigint) {
        const result = await provider.get('get_nft_address_by_index', [
            { type: 'int', value: index },
        ]);
        return result.stack.readAddress();
    }

    async getMerkleRoot(provider: ContractProvider) {
        const result = await provider.get('get_merkle_root', []);
        return result.stack.readBigNumber();
    }
}



================================================
FILE: wrappers/Item.compile.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/Item.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/item.fc'],
};



================================================
FILE: wrappers/Item.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/Item.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type ItemConfig = {};

export function itemConfigToCell(config: ItemConfig): Cell {
    return beginCell().endCell();
}

export class Item implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Item(address);
    }

    static createFromConfig(config: ItemConfig, code: Cell, workchain = 0) {
        const data = itemConfigToCell(config);
        const init = { code, data };
        return new Item(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}



================================================
FILE: wrappers/SbtItem.compile.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/SbtItem.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/sbt_item.fc'],
};



================================================
FILE: wrappers/SbtItem.ts
URL: https://github.com/ton-community/compressed-nft-contract/blob/main/wrappers/SbtItem.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type SbtItemConfig = {};

export function sbtItemConfigToCell(config: SbtItemConfig): Cell {
    return beginCell().endCell();
}

export class SbtItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SbtItem(address);
    }

    static createFromConfig(config: SbtItemConfig, code: Cell, workchain = 0) {
        const data = sbtItemConfigToCell(config);
        const init = { code, data };
        return new SbtItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}




# Repository: compressed-nft-contract
URL: https://github.com/ton-community/ton-ledger-ts
Branch: main

## Directory Structure:
```
└── compressed-nft-contract/
    ├── CHANGELOG.md
    ├── README.md
    ├── jest.config.js
    ├── package.json
    ├── source/
        ├── TonTransport.ts
        ├── index.ts
        ├── utils/
            ├── __snapshots__/
                ├── ledgerWriter.spec.ts.snap
            ├── getInit.ts
            ├── ledgerWriter.spec.ts
            ├── ledgerWriter.ts
    ├── test/
        ├── index.ts
```

## Files Content:

================================================
FILE: CHANGELOG.md
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/CHANGELOG.md
================================================
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.1] - 2024-01-17

### Fixed

- Fixed incorrect VarUInt encoding of 0 (0 nanoTON, 0 jetton units, etc)

## [0.7.0] - 2023-09-15

### Changed

- Switched `ton-core` and `ton-crypto` to `@ton/core` and `@ton/crypto`

## [6.0.0] - 2023-07-11

### Removed

- Removed `unsafe` payload format

## [5.0.0] - 2023-06-29

### Removed

- Removed `decimals` and `ticker` from `jetton-transfer` request

## [4.1.0] - 2023-06-16

### Added

- Added `signData` method along with `SignDataRequest` type

## [4.0.1] - 2023-06-16

### Fixed

- Fixed the address flags communication

## [4.0.0] - 2023-06-09

### Added

- Added payload types for NFT and Jetton transfers
- Added TON Connect 2.0 address proof request

### Removed

- Removed old payload types except for comment and unsafe

### Changed

- Updated dependencies
- Changed APDU format to be the same as the latest embedded app version (breaking change)

## [3.0.0] - 2023-01-08

### Changed

- Migration to `ton-core`

## [2.3.2]

- Update documentation



================================================
FILE: README.md
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/README.md
================================================
# TON Ledger Library

This library allows you to connect to a ledger device and with with TON from browser (only Chrome), NodeJS and React Native.

## How to install

To add library to your project execute: 

```bash
yarn add @ton-community/ton-ledger
```

## Connecting to a Device

First you need to select transport library for you environment.

Browser:
* [@ledgerhq/hw-transport-webhid](https://www.npmjs.com/package/@ledgerhq/hw-transport-webhid)
* [@ledgerhq/hw-transport-webusb](https://www.npmjs.com/package/@ledgerhq/hw-transport-webusb)

Node:
* [@ledgerhq/hw-transport-node-ble](https://www.npmjs.com/package/@ledgerhq/hw-transport-node-ble)
* [@ledgerhq/hw-transport-node-hid](https://www.npmjs.com/package/@ledgerhq/hw-transport-node-hid)
* [@ledgerhq/hw-transport-node-hid-noevents](https://www.npmjs.com/package/@ledgerhq/hw-transport-node-hid-noevents)
* [@ledgerhq/hw-transport-node-hid-singleton](https://www.npmjs.com/package/@ledgerhq/hw-transport-node-hid-singleton)

React Native:
* [@ledgerhq/hw-transport-web-ble](https://www.npmjs.com/package/@ledgerhq/hw-transport-web-ble)

After connecting to a device create a TonTransport instance:
```typescript
import { TonTransport } from '@ton-community/ton-ledger';
let transport = new TonTransport(device);
```

## Deriviation Path

For hardware wallets you need to specify deriviation path of your account for TON it is specified as:

```typescript
function pathForAccount(testnet: boolean, workchain: number, account: number) {
    let network = testnet ? 1 : 0;
    let chain = workchain === -1 ? 255 : 0;
    return [44, 607, network, chain, account, 0]; // Last zero is reserved for alternative wallet contracts
}
```

You can specify any path that starts with `[44, 607]`, but it could be incompatible with other apps.

## Get an Address and Public Key

To get an address without confimration on device you can perform next things:

```typescript
let testnet = true;
let workchain = 0;
let accountIndex = 0;
let bounceable = false;
let path = pathForAccount(testnet, workchain, accountIndex);
let response = await transport.getAddress(path, { chain, bounceable, testOnly: testnet });
let publiKey: Buffer = response.publicKey;
let address: string = response.address;
```

## Validate Address

The same as getting address, but returns address and key only when user confirms that address on the screen is correct. This method usually used after the non-confirming one and displaying address in dApp ad then requesting address validation.

```typescript
let testnet = true;
let workchain = 0;
let accountIndex = 0;
let bounceable = false;
let path = pathForAccount(testnet, workchain, accountIndex);
let response = await transport.validateAddress(path, { chain, bounceable, testOnly: testnet });
let publiKey: Buffer = response.publicKey;
let address: string = response.address;
```

## Sign simple transaction

Ledger Nanoapp works with Wallet v4 for now, we recommend you to continue to use it:

```typescript
import { WalletV4Contract, WalletV4Source } from 'ton';
import { TonPayloadFormat } from '@ton-community/ton-ledger';
import { TonClient, Address, SendMode, toNano } from 'ton-core';

let client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
let source = WalletV4Source.create({ workchain: 0, publicKey: deviceAddress.publicKey });
let contract = new WalletV4Contract(address, source);
let seqno = await contract.getSeqNo();

// Parameters
let path: number[]; // Account path from above
let to: Address = Address.parse('...'); // Destination
let amount: bigint = toNano('100'); // Send 100 TON
let sendMode = SendMode.IGNORE_ERRORS | SendMode.PAY_GAS_SEPARATLY;
let timeout = Math.floor((Date.now() / 1000) + 60);
let bounce = false;
let payload: TonPayloadFormat | null = null; // See below

// Signing on device
let signed = await transport.signTransaction(path, {
    to,
    sendMode,
    amount,
    seqno,
    timeout: Math.floor((Date.now() / 1000) + 60),
    bounce,
    payload: payload ? payload : undefined
});

// Send transaction to the network
await c.sendExternalMessage(contract, signed);

```

## Payload formats

### Transaction with a comment
Comments are limited to ASCII-only symbols and 127 letters. Anything above would be automatically downgraded to Blind Signing Mode that you want to avoid at all cost.

```typescript
const payload: TonPayloadFormat = {
    type: 'comment',
    text: 'Deposit'
};
```

### Jetton transfer

```typescript
const payload: TonPayloadFormat = {
    type: 'jetton-transfer',
    queryId: null, // null will be replaced with 0; you can pass any value of the BigInt type
    amount: 1n,
    destination: Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'),
    responseDestination: Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'),
    customPayload: null, // you can pass any value of the Cell type
    forwardAmount: 0n,
    forwardPayload: null // you can pass any value of the Cell type
};
```

### NFT transfer

```typescript
const payload: TonPayloadFormat = {
    type: 'nft-transfer',
    queryId: null, // null will be replaced with 0; you can pass any value of the BigInt type
    newOwner: Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'),
    responseDestination: Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'),
    customPayload: null, // you can pass any value of the Cell type
    forwardAmount: 0n,
    forwardPayload: null // you can pass any value of the Cell type
};
```

# License

MIT



================================================
FILE: jest.config.js
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/jest.config.js
================================================
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};


================================================
FILE: package.json
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/package.json
================================================
{
  "name": "@ton-community/ton-ledger",
  "version": "7.0.1",
  "repository": "https://github.com/ton-community/ton-ledger-ts",
  "author": "Steve Korshakov <steve@korshakov.com>",
  "license": "MIT",
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "rm -fr dist && tsc --declaration",
    "test": "jest",
    "release": "yarn test && yarn build && yarn release-it --npm.yarn1",
    "dev": "ts-node ./test/index.ts"
  },
  "peerDependencies": {
    "@ton/core": ">=0.52.2"
  },
  "devDependencies": {
    "@ledgerhq/hw-transport-node-hid": "^6.27.15",
    "@release-it/keep-a-changelog": "^3.1.0",
    "@ton/core": "^0.52.2",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.2.5",
    "jest": "^29.5.0",
    "release-it": "^15.11.0",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.5"
  },
  "dependencies": {
    "@ledgerhq/hw-transport": "^6.28.4",
    "@ton/crypto": "^3.2.0",
    "teslabot": "^1.5.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "release-it": {
    "github": {
      "release": true
    },
    "plugins": {
      "@release-it/keep-a-changelog": {
        "filename": "CHANGELOG.md"
      }
    }
  }
}



================================================
FILE: source/TonTransport.ts
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/source/TonTransport.ts
================================================
import Transport from "@ledgerhq/hw-transport";
import { Address, beginCell, Cell, contractAddress, SendMode, StateInit, storeStateInit } from "@ton/core";
import { signVerify } from '@ton/crypto';
import { AsyncLock } from 'teslabot';
import { writeAddress, writeCellRef, writeUint16, writeUint32, writeUint64, writeUint8, writeVarUInt } from "./utils/ledgerWriter";
import { getInit } from "./utils/getInit";

const LEDGER_SYSTEM = 0xB0;
const LEDGER_CLA = 0xe0;
const INS_VERSION = 0x03;
const INS_ADDRESS = 0x05;
const INS_SIGN_TX = 0x06;
const INS_PROOF = 0x08;
const INS_SIGN_DATA = 0x09;

export type TonPayloadFormat =
    | { type: 'comment', text: string }
    | { type: 'jetton-transfer', queryId: bigint | null, amount: bigint, destination: Address, responseDestination: Address, customPayload: Cell | null, forwardAmount: bigint, forwardPayload: Cell | null }
    | { type: 'nft-transfer', queryId: bigint | null, newOwner: Address, responseDestination: Address, customPayload: Cell | null, forwardAmount: bigint, forwardPayload: Cell | null }

export type SignDataRequest =
    | { type: 'plaintext', text: string }
    | { type: 'app-data', address?: Address, domain?: string, data: Cell, ext?: Cell }

function chunks(buf: Buffer, n: number): Buffer[] {
    const nc = Math.ceil(buf.length / n);
    const cs: Buffer[] = [];
    for (let i = 0; i < nc; i++) {
        cs.push(buf.subarray(i * n, (i + 1) * n));
    }
    return cs;
}

function processAddressFlags(opts?: { testOnly?: boolean, bounceable?: boolean, chain?: number }): { testOnly: boolean, bounceable: boolean, chain: number, flags: number } {
    const bounceable = opts?.bounceable ?? true;
    const testOnly = opts?.testOnly ?? false;
    const chain = opts?.chain ?? 0;

    let flags = 0x00;
    if (testOnly) {
        flags |= 0x01;
    }
    if (chain === -1) {
        flags |= 0x02;
    }

    return { bounceable, testOnly, chain, flags };
}

export class TonTransport {
    readonly transport: Transport;
    #lock = new AsyncLock();

    constructor(transport: Transport) {
        this.transport = transport;
    }

    //
    // Apps
    //

    async #getCurrentApp(): Promise<{ name: string, version: string }> {
        return this.#lock.inLock(async () => {
            let r = await this.transport.send(
                LEDGER_SYSTEM,
                0x01,
                0x00,
                0x00,
                undefined,
                [0x9000]
            );
            let data = r.slice(0, r.length - 2);
            if (data[0] !== 0x01) {
                throw Error('Invalid response');
            }
            let nameLength = data[1];
            let name = data.slice(2, 2 + nameLength).toString();
            let versionLength = data[2 + nameLength];
            let version = data.slice(3 + nameLength, 3 + nameLength + versionLength).toString();
            return { name, version };
        });
    }

    async isAppOpen() {
        return (await this.#getCurrentApp()).name === 'TON';
    }

    async getVersion(): Promise<string> {
        let loaded = await this.#doRequest(INS_VERSION, 0x00, 0x00, Buffer.alloc(0));
        const [major, minor, patch] = loaded;
        return `${major}.${minor}.${patch}`;
    }

    //
    // Operations
    //

    async getAddress(path: number[], opts?: { testOnly?: boolean, bounceable?: boolean, chain?: number }) {

        // Check path
        validatePath(path);

        // Resolve flags
        const { bounceable, testOnly, chain } = processAddressFlags(opts);

        // Get public key
        let response = await this.#doRequest(INS_ADDRESS, 0x00, 0x00, pathElementsToBuffer(path.map((v) => v + 0x80000000)));
        if (response.length !== 32) {
            throw Error('Invalid response');
        }

        // Contract
        const contract = getInit(chain, response);
        const address = contractAddress(chain, contract);

        return { address: address.toString({ bounceable, testOnly }), publicKey: response };
    }

    async validateAddress(path: number[], opts?: { testOnly?: boolean, bounceable?: boolean, chain?: number }) {

        // Check path
        validatePath(path);

        // Resolve flags
        const { bounceable, testOnly, chain, flags } = processAddressFlags(opts);

        // Get public key
        let response = await this.#doRequest(INS_ADDRESS, 0x01, flags, pathElementsToBuffer(path.map((v) => v + 0x80000000)));
        if (response.length !== 32) {
            throw Error('Invalid response');
        }

        // Contract
        const contract = getInit(chain, response);
        const address = contractAddress(chain, contract);

        return { address: address.toString({ bounceable, testOnly }), publicKey: response };
    }

    async getAddressProof(path: number[], params: { domain: string, timestamp: number, payload: Buffer }, opts?: { testOnly?: boolean, bounceable?: boolean, chain?: number }) {

        // Check path
        validatePath(path);

        let publicKey = (await this.getAddress(path)).publicKey;

        // Resolve flags
        const { flags } = processAddressFlags(opts);

        const domainBuf = Buffer.from(params.domain, 'utf-8');
        const reqBuf = Buffer.concat([
            pathElementsToBuffer(path.map((v) => v + 0x80000000)),
            writeUint8(domainBuf.length),
            domainBuf,
            writeUint64(BigInt(params.timestamp)),
            params.payload,
        ]);

        // Get public key
        let res = await this.#doRequest(INS_PROOF, 0x01, flags, reqBuf);
        let signature = res.slice(1, 1 + 64);
        let hash = res.slice(2 + 64, 2 + 64 + 32);
        if (!signVerify(hash, signature, publicKey)) {
            throw Error('Received signature is invalid');
        }

        return { signature, hash };
    }

    async signData(path: number[], req: SignDataRequest, opts?: { timestamp?: number }) {
        validatePath(path);

        const publicKey = (await this.getAddress(path)).publicKey;

        const timestamp = opts?.timestamp ?? Math.floor(Date.now() / 1000)

        let schema: number
        let data: Buffer
        let cell: Cell
        switch (req.type) {
            case 'plaintext': {
                schema = 0x754bf91b;
                data = Buffer.from(req.text, 'ascii');
                cell = beginCell().storeStringTail(req.text).endCell();
                break;
            }
            case 'app-data': {
                if (req.address === undefined && req.domain === undefined) {
                    throw new Error('At least one of `address` and `domain` must be set when using \'app-data\' request');
                }
                schema = 0x54b58535;
                let b = beginCell();
                let dp: Buffer[] = [];

                if (req.address !== undefined) {
                    b.storeBit(1);
                    b.storeAddress(req.address);
                    dp.push(writeUint8(1), writeAddress(req.address));
                } else {
                    b.storeBit(0);
                    dp.push(writeUint8(0));
                }

                if (req.domain !== undefined) {
                    b.storeBit(1);
                    let inner = beginCell();
                    req.domain.split('.').reverse().forEach(p => {
                        inner.storeBuffer(Buffer.from(p, 'ascii'));
                        inner.storeUint(0, 8);
                    });
                    b.storeRef(inner);
                    const db = Buffer.from(req.domain, 'ascii');
                    dp.push(writeUint8(1), writeUint8(db.length), db);
                } else {
                    b.storeBit(0);
                    dp.push(writeUint8(0));
                }

                b.storeRef(req.data);
                dp.push(writeCellRef(req.data));

                if (req.ext !== undefined) {
                    b.storeBit(1);
                    b.storeRef(req.ext);
                    dp.push(writeUint8(1), writeCellRef(req.ext));
                } else {
                    b.storeBit(0);
                    dp.push(writeUint8(0));
                }

                data = Buffer.concat(dp);
                cell = b.endCell();
                break;
            }
            default: {
                throw new Error(`Sign data request type '${(req as any).type}' not supported`)
            }
        }

        const commonPart = Buffer.concat([
            writeUint32(schema),
            writeUint64(BigInt(timestamp)),
        ]);

        const pkg = Buffer.concat([
            commonPart,
            data,
        ])

        await this.#doRequest(INS_SIGN_DATA, 0x00, 0x03, pathElementsToBuffer(path.map((v) => v + 0x80000000)));
        const pkgCs = chunks(pkg, 255);
        for (let i = 0; i < pkgCs.length - 1; i++) {
            await this.#doRequest(INS_SIGN_DATA, 0x00, 0x02, pkgCs[i]);
        }
        const res = await this.#doRequest(INS_SIGN_DATA, 0x00, 0x00, pkgCs[pkgCs.length-1]);

        let signature = res.subarray(1, 1 + 64);
        let hash = res.subarray(2 + 64, 2 + 64 + 32);
        if (!hash.equals(cell.hash())) {
            throw Error('Hash mismatch. Expected: ' + cell.hash().toString('hex') + ', got: ' + hash.toString('hex'));
        }
        if (!signVerify(Buffer.concat([commonPart, hash]), signature, publicKey)) {
            throw Error('Received signature is invalid');
        }

        return {
            signature,
            cell,
            timestamp,
        }
    }

    signTransaction = async (
        path: number[],
        transaction: {
            to: Address,
            sendMode: SendMode,
            seqno: number,
            timeout: number,
            bounce: boolean,
            amount: bigint,
            stateInit?: StateInit,
            payload?: TonPayloadFormat
        }
    ) => {

        // Check path
        validatePath(path);

        //
        // Fetch key
        //

        let publicKey = (await this.getAddress(path)).publicKey;

        //
        // Create package
        //

        let pkg = Buffer.concat([
            writeUint8(0), // Header
            writeUint32(transaction.seqno),
            writeUint32(transaction.timeout),
            writeVarUInt(transaction.amount),
            writeAddress(transaction.to),
            writeUint8(transaction.bounce ? 1 : 0),
            writeUint8(transaction.sendMode),
        ]);

        //
        // State init
        //

        let stateInit: Cell | null = null;
        if (transaction.stateInit) {
            stateInit = beginCell()
                .store(storeStateInit(transaction.stateInit))
                .endCell();
            pkg = Buffer.concat([
                pkg,
                writeUint8(1),
                writeUint16(stateInit.depth()),
                stateInit.hash()
            ])
        } else {
            pkg = Buffer.concat([
                pkg,
                writeUint8(0)
            ]);
        }

        //
        // Payload
        //

        let payload: Cell | null = null;
        let hints: Buffer = Buffer.concat([writeUint8(0)]);
        if (transaction.payload) {
            if (transaction.payload.type === 'comment') {
                hints = Buffer.concat([
                    writeUint8(1),
                    writeUint32(0x00),
                    writeUint16(Buffer.from(transaction.payload.text).length),
                    Buffer.from(transaction.payload.text)
                ]);
                payload = beginCell()
                    .storeUint(0, 32)
                    .storeBuffer(Buffer.from(transaction.payload.text))
                    .endCell()
            } else if (transaction.payload.type === 'jetton-transfer' || transaction.payload.type === 'nft-transfer') {
                hints = Buffer.concat([
                    writeUint8(1),
                    writeUint32(transaction.payload.type === 'jetton-transfer' ? 0x01 : 0x02)
                ]);

                let b = beginCell()
                    .storeUint(transaction.payload.type === 'jetton-transfer' ? 0x0f8a7ea5 : 0x5fcc3d14, 32);
                let d = Buffer.alloc(0);

                if (transaction.payload.queryId !== null) {
                    d = Buffer.concat([d, writeUint8(1), writeUint64(transaction.payload.queryId)]);
                    b = b.storeUint(transaction.payload.queryId, 64);
                } else {
                    d = Buffer.concat([d, writeUint8(0)]);
                    b = b.storeUint(0, 64);
                }

                if (transaction.payload.type === 'jetton-transfer') {
                    d = Buffer.concat([d, writeVarUInt(transaction.payload.amount)]);
                    b = b.storeCoins(transaction.payload.amount);

                    d = Buffer.concat([d, writeAddress(transaction.payload.destination)]);
                    b = b.storeAddress(transaction.payload.destination);
                } else {
                    d = Buffer.concat([d, writeAddress(transaction.payload.newOwner)]);
                    b = b.storeAddress(transaction.payload.newOwner);
                }

                d = Buffer.concat([d, writeAddress(transaction.payload.responseDestination)]);
                b = b.storeAddress(transaction.payload.responseDestination);

                if (transaction.payload.customPayload !== null) {
                    d = Buffer.concat([d, writeUint8(1), writeCellRef(transaction.payload.customPayload)]);
                    b = b.storeMaybeRef(transaction.payload.customPayload);
                } else {
                    d = Buffer.concat([d, writeUint8(0)]);
                    b = b.storeMaybeRef(transaction.payload.customPayload);
                }

                d = Buffer.concat([d, writeVarUInt(transaction.payload.forwardAmount)]);
                b = b.storeCoins(transaction.payload.forwardAmount);

                if (transaction.payload.forwardPayload !== null) {
                    d = Buffer.concat([d, writeUint8(1), writeCellRef(transaction.payload.forwardPayload)]);
                    b = b.storeMaybeRef(transaction.payload.forwardPayload);
                } else {
                    d = Buffer.concat([d, writeUint8(0)]);
                    b = b.storeMaybeRef(transaction.payload.forwardPayload);
                }

                payload = b.endCell();
                hints = Buffer.concat([
                    hints,
                    writeUint16(d.length),
                    d
                ])
            }
        }

        //
        // Serialize payload
        //

        if (payload) {
            pkg = Buffer.concat([
                pkg,
                writeUint8(1),
                writeUint16(payload.depth()),
                payload.hash(),
                hints
            ])
        } else {
            pkg = Buffer.concat([
                pkg,
                writeUint8(0),
                writeUint8(0)
            ]);
        }

        //
        // Send package
        //

        await this.#doRequest(INS_SIGN_TX, 0x00, 0x03, pathElementsToBuffer(path.map((v) => v + 0x80000000)));
        const pkgCs = chunks(pkg, 255);
        for (let i = 0; i < pkgCs.length - 1; i++) {
            await this.#doRequest(INS_SIGN_TX, 0x00, 0x02, pkgCs[i]);
        }
        let res = await this.#doRequest(INS_SIGN_TX, 0x00, 0x00, pkgCs[pkgCs.length-1]);

        //
        // Parse response
        //

        let orderBuilder = beginCell()
            .storeBit(0)
            .storeBit(true)
            .storeBit(transaction.bounce)
            .storeBit(false)
            .storeAddress(null)
            .storeAddress(transaction.to)
            .storeCoins(transaction.amount)
            .storeBit(false)
            .storeCoins(0)
            .storeCoins(0)
            .storeUint(0, 64)
            .storeUint(0, 32)

        // State Init
        if (stateInit) {
            orderBuilder = orderBuilder
                .storeBit(true)
                .storeBit(true) // Always in reference
                .storeRef(stateInit)
        } else {
            orderBuilder = orderBuilder
                .storeBit(false);
        }

        // Payload
        if (payload) {
            orderBuilder = orderBuilder
                .storeBit(true) // Always in reference
                .storeRef(payload)
        } else {
            orderBuilder = orderBuilder
                .storeBit(false)
        }

        // Transfer message
        let transfer = beginCell()
            .storeUint(698983191, 32)
            .storeUint(transaction.timeout, 32)
            .storeUint(transaction.seqno, 32)
            .storeUint(0, 8)
            .storeUint(transaction.sendMode, 8)
            .storeRef(orderBuilder.endCell())
            .endCell();

        // Parse result
        let signature = res.slice(1, 1 + 64);
        let hash = res.slice(2 + 64, 2 + 64 + 32);
        if (!hash.equals(transfer.hash())) {
            throw Error('Hash mismatch. Expected: ' + transfer.hash().toString('hex') + ', got: ' + hash.toString('hex'));
        }
        if (!signVerify(hash, signature, publicKey)) {
            throw Error('Received signature is invalid');
        }

        // Build a message
        return beginCell()
            .storeBuffer(signature)
            .storeSlice(transfer.beginParse())
            .endCell();
    }

    #doRequest = async (ins: number, p1: number, p2: number, data: Buffer) => {
        return this.#lock.inLock(async () => {
            let r = await this.transport.send(
                LEDGER_CLA,
                ins,
                p1,
                p2,
                data
            );
            return r.slice(0, r.length - 2);
        });
    }
}

//
// Utils
//

function validatePath(path: number[]) {
    if (path.length < 6) {
        throw Error('Path is too short');
    }
    if (path[0] !== 44) {
        throw Error('First element of a path must be 44');
    }
    if (path[1] !== 607) {
        throw Error('Second element of a path must be 607');
    }
    for (let p of path) {
        if (p >= 0x80000000) {
            throw Error('All path elements must be under 0x80000000');
        }
    }
}

function pathElementsToBuffer(paths: number[]): Buffer {
    const buffer = Buffer.alloc(1 + paths.length * 4);
    buffer[0] = paths.length;
    paths.forEach((element, index) => {
        buffer.writeUInt32BE(element, 1 + 4 * index);
    });
    return buffer;
}


================================================
FILE: source/index.ts
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/source/index.ts
================================================
export { TonPayloadFormat, TonTransport, SignDataRequest } from './TonTransport';


================================================
FILE: source/utils/__snapshots__/ledgerWriter.spec.ts.snap
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/source/utils/__snapshots__/ledgerWriter.spec.ts.snap
================================================
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`ledgerWriter should write addresses 1`] = `"000000000000000000000000000000000000000000000000000000000000000000"`;

exports[`ledgerWriter should write addresses 2`] = `"ff0000000000000000000000000000000000000000000000000000000000000000"`;

exports[`ledgerWriter should write addresses 3`] = `"004d55415f2add9082a28be6f66f9f23f9d309a788214fd8048e28013e8369e844"`;

exports[`ledgerWriter should write addresses 4`] = `"ff3b9bbfd0ad5338b9700f0833380ee17d463e51c1ae671ee6f08901bde899b202"`;

exports[`ledgerWriter should write cell refs 1`] = `"000096a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7"`;

exports[`ledgerWriter should write cell refs 2`] = `"00003fe93897158698e4d473b74414d7493716b0fc3a70310934873f0019daaccab4"`;

exports[`ledgerWriter should write cell refs 3`] = `"000187ce6f25c20fac56253dc9877fd7f847e286e2e6a4c70d20431e49c8ec12132c"`;

exports[`ledgerWriter should write cell refs 4`] = `"000210a2850c6346ec9b0e909059e0a03a794bb020e13a08d4e941cf36f59ded2951"`;

exports[`ledgerWriter should write ints 1`] = `"00"`;

exports[`ledgerWriter should write ints 2`] = `"0a"`;

exports[`ledgerWriter should write ints 3`] = `"ff"`;

exports[`ledgerWriter should write ints 4`] = `"0000"`;

exports[`ledgerWriter should write ints 5`] = `"00ff"`;

exports[`ledgerWriter should write ints 6`] = `"3018"`;

exports[`ledgerWriter should write ints 7`] = `"ffff"`;

exports[`ledgerWriter should write ints 8`] = `"00000000"`;

exports[`ledgerWriter should write ints 9`] = `"000000ff"`;

exports[`ledgerWriter should write ints 10`] = `"00003018"`;

exports[`ledgerWriter should write ints 11`] = `"0000ffff"`;

exports[`ledgerWriter should write ints 12`] = `"0756b5b3"`;

exports[`ledgerWriter should write ints 13`] = `"ffffffff"`;

exports[`ledgerWriter should write ints 14`] = `"0000000000000000"`;

exports[`ledgerWriter should write ints 15`] = `"00000000000000ff"`;

exports[`ledgerWriter should write ints 16`] = `"0000000000003018"`;

exports[`ledgerWriter should write ints 17`] = `"000000000000ffff"`;

exports[`ledgerWriter should write ints 18`] = `"000000000756b5b3"`;

exports[`ledgerWriter should write ints 19`] = `"00000000ffffffff"`;

exports[`ledgerWriter should write ints 20`] = `"00000b32af0071f8"`;

exports[`ledgerWriter should write ints 21`] = `"ffffffffffffffff"`;



================================================
FILE: source/utils/getInit.ts
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/source/utils/getInit.ts
================================================
import { Cell, beginCell } from '@ton/core';

export function getInit(workchain: number, publicKey: Buffer) {
    let code = Cell.fromBoc(Buffer.from('te6ccgECFAEAAtQAART/APSkE/S88sgLAQIBIAIDAgFIBAUE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcCASAICQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAKCwBZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEAgFYDA0AEbjJftRNDXCx+AA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA4PABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVA==', 'base64'))[0];
    let data = beginCell()
        .storeUint(0, 32) // Seqno
        .storeUint(698983191 + workchain, 32)
        .storeBuffer(publicKey)
        .storeBit(0) // Empty plugins dict
        .endCell();
    return { code, data };
}


================================================
FILE: source/utils/ledgerWriter.spec.ts
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/source/utils/ledgerWriter.spec.ts
================================================
import { Address, beginCell } from '@ton/core';
import { writeAddress, writeCellRef, writeUint16, writeUint32, writeUint64, writeUint8 } from "./ledgerWriter";

describe('ledgerWriter', () => {
    it('should write ints', () => {
        expect(writeUint8(0).toString('hex')).toMatchSnapshot();
        expect(writeUint8(10).toString('hex')).toMatchSnapshot();
        expect(writeUint8(255).toString('hex')).toMatchSnapshot();
        expect(writeUint16(0).toString('hex')).toMatchSnapshot();
        expect(writeUint16(255).toString('hex')).toMatchSnapshot();
        expect(writeUint16(12312).toString('hex')).toMatchSnapshot();
        expect(writeUint16(65535).toString('hex')).toMatchSnapshot();
        expect(writeUint32(0).toString('hex')).toMatchSnapshot();
        expect(writeUint32(255).toString('hex')).toMatchSnapshot();
        expect(writeUint32(12312).toString('hex')).toMatchSnapshot();
        expect(writeUint32(65535).toString('hex')).toMatchSnapshot();
        expect(writeUint32(123123123).toString('hex')).toMatchSnapshot();
        expect(writeUint32(4294967295).toString('hex')).toMatchSnapshot();

        expect(writeUint64(0n).toString('hex')).toMatchSnapshot();
        expect(writeUint64(255n).toString('hex')).toMatchSnapshot();
        expect(writeUint64(12312n).toString('hex')).toMatchSnapshot();
        expect(writeUint64(65535n).toString('hex')).toMatchSnapshot();
        expect(writeUint64(123123123n).toString('hex')).toMatchSnapshot();
        expect(writeUint64(4294967295n).toString('hex')).toMatchSnapshot();
        expect(writeUint64(12312312312312n).toString('hex')).toMatchSnapshot();
        expect(writeUint64(18446744073709551615n).toString('hex')).toMatchSnapshot();
    });
    it('should write addresses', () => {
        expect(writeAddress(new Address(0, Buffer.alloc(32))).toString('hex')).toMatchSnapshot();
        expect(writeAddress(new Address(-1, Buffer.alloc(32))).toString('hex')).toMatchSnapshot();
        expect(writeAddress(Address.parse('EQBNVUFfKt2QgqKL5vZvnyP50wmniCFP2ASOKAE-g2noRDlR')).toString('hex')).toMatchSnapshot();
        expect(writeAddress(Address.parse('Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY')).toString('hex')).toMatchSnapshot();
    });
    it('should write cell refs', () => {
        expect(writeCellRef(beginCell().endCell()).toString('hex')).toMatchSnapshot();
        expect(writeCellRef(beginCell().storeUint(0, 32).endCell()).toString('hex')).toMatchSnapshot();
        expect(writeCellRef(beginCell().storeUint(0, 32).storeRef(beginCell().endCell()).endCell()).toString('hex')).toMatchSnapshot();
        expect(writeCellRef(beginCell().storeUint(0, 32).storeRef(beginCell().storeRef(beginCell().endCell()).endCell()).endCell()).toString('hex')).toMatchSnapshot();
    });
});


================================================
FILE: source/utils/ledgerWriter.ts
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/source/utils/ledgerWriter.ts
================================================
import { Address, Cell, beginCell } from '@ton/core';

export function writeUint32(value: number) {
    let b = Buffer.alloc(4);
    b.writeUint32BE(value, 0);
    return b;
}

export function writeUint16(value: number) {
    let b = Buffer.alloc(2);
    b.writeUint16BE(value, 0);
    return b;
}

export function writeUint64(value: bigint) {
    return beginCell().storeUint(value, 64).endCell().beginParse().loadBuffer(8);
}

export function writeVarUInt(value: bigint) {
    const sizeBytes = value === 0n ? 0 : Math.ceil((value.toString(2).length) / 8);
    return beginCell().storeUint(sizeBytes, 8).storeUint(value, sizeBytes * 8).endCell().beginParse().loadBuffer(1 + sizeBytes);
}

export function writeUint8(value: number) {
    let b = Buffer.alloc(1);
    b[0] = value;
    return b;
}

export function writeAddress(address: Address) {
    return Buffer.concat([
        writeUint8(address.workChain === -1 ? 0xff : address.workChain),
        address.hash
    ]);
}

export function writeCellRef(ref: Cell) {
    return Buffer.concat([
        writeUint16(ref.depth()),
        ref.hash()
    ])
}


================================================
FILE: test/index.ts
URL: https://github.com/ton-community/ton-ledger-ts/blob/main/test/index.ts
================================================
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { Address, Cell, toNano } from "@ton/core";
import { TonTransport } from "../source";

(async () => {
    console.log('Connecting...');
    let device = (await TransportNodeHid.list())[0];
    let dev = await TransportNodeHid.open(device);
    let client = new TonTransport(dev);
    console.log('Getting app version');
    let version = await client.getVersion();
    console.log(version);
    let address = await client.getAddress([44, 607, 0, 0, 0, 0], { testOnly: true });
    console.log(address);

    // console.warn(new Cell().hash().toString('base64'));

    // await client.signTransaction([44, 607, 0, 0, 0, 0], {
    //     to: Address.parse('kQCSct8Hk6AUHlrma5xn_uUsvxPKyVUdEIZAyCzIht3TFTmt'),
    //     amount: toNano(1),
    //     sendMode: 0,
    //     seqno: 1,
    //     timeout: Math.floor((Date.now() / 1000) + 60),
    //     bounce: true,
    //     // payload: { type: 'create-proposal', id: 1, proposal: new Cell(), metadata: new Cell(), queryId: null }
    //     // payload: { type: 'upgrade', code: new Cell(), queryId: null, gasLimit: null }
    //     // payload: { type: 'vote-proposal', id: 1, vote: 'abstain', queryId: null }
    //     // payload: { type: 'abort-proposal', id: 1, queryId: null }
    //     payload: { type: 'change-address', index: 0, address: Address.parse('kQCSct8Hk6AUHlrma5xn_uUsvxPKyVUdEIZAyCzIht3TFTmt'), queryId: null, gasLimit: null }
    // });

    let signed = await client.signMessage([44, 607, 0, 0, 0, 0], '🚀Hello world!');
    console.log(signed);
})();



# Repository: ton-onboarding-challenge
URL: https://github.com/ton-community/ton-onboarding-challenge
Branch: master

## Directory Structure:
```
└── ton-onboarding-challenge/
    ├── README.md
    ├── contracts/
        ├── collection.fc
        ├── item.fc
        ├── op-codes.fc
        ├── params.fc
        ├── stdlib.fc
        ├── storage.fc
    ├── jest.config.ts
    ├── lib/
        ├── utils.ts
    ├── package.json
    ├── tests/
        ├── NftGiver.spec.ts
    ├── wrappers/
        ├── NftGiver.compile.ts
        ├── NftGiver.ts
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/README.md
================================================
# TON Onboarding Challenge Boilerplate

Here you can become a true TON Developer on the most advanced asynchronous blockchain in the world, The Open Network (
TON).

You can prove your talent using the most ancient and essential way in blockchains, starting from grandpa Bitcoin! As the
first miners in TON, you will go through the Proof-of-Work smart contract and finally mine a secret reward for your TON
wallet.

## Who already completed the challenge?

NFT Collection on GetGems with True TVM Developers:

- [Mainnet NFT collection](https://getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX)
- [Testnet NFT collection](https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX)

## Step-by-step (simple)

### Text tutorial

* [TON Onboarding Challenge](https://docs.ton.org/v3/guidelines/get-started-with-ton)

## Mining process (deep dive)

> Feel free to use a text version of tutorial to get help

This is a NFT collection that differs from standard NFT collections in the following aspects:

- normal NFT deployment is disabled and one can mint NFTs only by mining (similar to how PoW givers worked)
- extra get-method is added for mining info

In order to mine NFT you should send special **internal** message to collection contract with proof of work.

You can get current `pow_complexity` by calling special get-function to get mining status called `get_mining_data`

It returns a [tensor](https://docs.ton.org/v3/documentation/smart-contracts/func/docs/types#tensor-types) with the
following data:

```
( 
	int pow_complexity,
	int last_success,
	int seed,
	int target_delta,
	int min_cpl,
	int max_cpl
)
```

Note that `seed` is set to a random value after every successful NFT mint.
`pow_complexity` is also a dynamic value and could be changed from time to time.

Layout of proof of work Cell:

| Field  |   Type   |                                                                                                     Description |
|:-------|:--------:|----------------------------------------------------------------------------------------------------------------:|
| op     |  uint32  |                                                                                               Always 0x4d696e65 |
| expire |  uint32  | Unixtime of message expiration (should be some unixtime in future, but not greater than ~17 minutes in future.) |
| whom   | std_addr |                                                   Address of the miner (NFT owner would be set to this address) |
| rdata1 | uint256  |                                                                                                Some random data |
| seed   | uint128  |                                                                                                    Current seed |
| rdata2 | uint256  |                                                                                          Should equal to rdata1 |

Proof of work is considered to be valid only if:

- rdata1 equals to rdata2
- (expire - now()) < 1024
- seed is equal to current seed stored in contract
- hash of the proof of work message Cell is less than current pow_complexity (hash is compared as a big endian number)

Basically you need to find such value for `rdata1` so that hash of the Cell is less than current `pow_complexity`

After this an `internal` message with found Cell should be sent to collection with ~0.05 TON in order to mint NFT.

## Project structure

- `contracts` - source code of all the smart contracts of the project and their dependencies.
- `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
- `tests` - tests for the contracts.
- `scripts` - scripts used by the project, mainly the deployment scripts.



================================================
FILE: contracts/collection.fc
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/contracts/collection.fc
================================================
#include "stdlib.fc";
#include "storage.fc";
#include "op-codes.fc";

int ufits(int x, int bits) impure asm "UFITSX";

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

() deploy_nft_item(int item_index, cell nft_item_code, cell nft_content) impure {
    cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);
    slice nft_address = calculate_nft_item_address(0, state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(0)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_content);
    send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool packages:MsgAddress -> 011000
        .store_slice(to_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::report_royalty_params(), 32)
        .store_uint(query_id, 64)
        .store_slice(data);
    send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() mint_nft(slice cs) impure {
    var hash = slice_hash(cs);
    throw_unless(24, hash < ctx_pow_complexity);  ;; hash problem NOT solved

    var (op, expire, whom, rdata1, rseed, rdata2) = (
        cs~load_uint(32),
        cs~load_uint(32),
        cs~load_msg_addr(),
        cs~load_uint(256),
        cs~load_uint(128),
        cs~load_uint(256)
    );
    ufits(expire - now(), 10);
    throw_unless(25, (rseed == ctx_seed) & (rdata1 == rdata2));
    ;; Proof of Work correct

    randomize_lt();
    randomize(rdata1);

    ;; recompute complexity
    int delta = now() - ctx_last_success;
    if (delta > 0) {
        int factor = muldivr(delta, 1 << 128, ctx_target_delta);
        factor = min(max(factor, 7 << 125), 9 << 125);  ;; factor must be in range 7/8 .. 9/8
        ctx_pow_complexity = muldivr(ctx_pow_complexity, factor, 1 << 128);  ;; rescale complexity
        ctx_pow_complexity = min(max(ctx_pow_complexity, 1 << ctx_min_cpl), 1 << ctx_max_cpl);
    }

    ctx_last_success = now();
    ctx_seed = random() >> 128;

    deploy_nft_item(ctx_next_item_index, ctx_nft_item_code, begin_cell()
                                                            .store_slice(whom)
                                                            .store_ref(begin_cell().end_cell())
                                                            .end_cell());

    ctx_next_item_index += 1;

    store_base_data();
}

() rescale_complexity(int expire) impure inline_ref {
    load_base_data();
    int time = now();
    throw_unless(28, time > expire);
    throw_unless(29, expire > ctx_last_success);
    int delta = time - ctx_last_success;
    throw_unless(30, delta >= ctx_target_delta * 16);
    accept_message();
    int factor = muldivr(delta, 1 << 128, ctx_target_delta);
    int max_complexity = (1 << ctx_max_cpl);
    int max_factor = muldiv(max_complexity, 1 << 128, ctx_pow_complexity);
    ctx_pow_complexity = (max_factor < factor ? max_complexity : muldivr(ctx_pow_complexity, factor, 1 << 128));
    ctx_last_success = time - ctx_target_delta;
    store_base_data();
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
    load_base_data();

    if (in_msg_body.preload_uint(32) == op::mine()) {
        mint_nft(in_msg_body);
        return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, ctx_royalty_params.begin_parse());
        return ();
    }

    if (op == op::rescale_complexity()) {
        rescale_complexity(in_msg_body~load_uint(32));
        return ();
    }

    throw_unless(401, equal_slices(sender_address, ctx_owner));

    if (op == 3) { ;; change owner
        ctx_owner = in_msg_body~load_msg_addr();
        store_base_data();
        return ();
    }

    if (op == 4) { ;; change content
        ctx_content = in_msg_body~load_ref();
        ctx_royalty_params = in_msg_body~load_ref();
        store_base_data();
        return ();
    }

    throw(0xffff);
}

;; Get methods

var get_collection_data() method_id {
    load_base_data();
    slice cs = ctx_content.begin_parse();
    return (ctx_next_item_index, cs~load_ref(), ctx_owner);
}

var get_nft_address_by_index(int index) method_id {
    load_base_data();
    cell state_init = calculate_nft_item_state_init(index, ctx_nft_item_code);
    return calculate_nft_item_address(0, state_init);
}

var royalty_params() method_id {
    load_base_data();
    slice rs = ctx_royalty_params.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

var get_mining_data() method_id {
    load_base_data();
    return (
        ctx_pow_complexity,
        ctx_last_success,
        ctx_seed,
        ctx_target_delta,
        ctx_min_cpl,
        ctx_max_cpl
    );
}

var get_nft_content(int index, cell individual_nft_content) method_id {
    load_base_data();
    slice cs = ctx_content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return begin_cell()
        .store_uint(1, 8) ;; offchain tag
        .store_slice(common_content)
        .store_ref(individual_nft_content)
        .end_cell();
}



================================================
FILE: contracts/item.fc
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/contracts/item.fc
================================================
#include "stdlib.fc";
#include "params.fc";
#include "op-codes.fc";

;;
;;  TON NFT Item Smart Contract
;;

{-

    NOTE that this tokens can be transferred within the same workchain.

    This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

    1) use more expensive but universal function below to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

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
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool packages:MsgAddress -> 011000
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

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
  (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
  return (init?, index, collection_address, owner_address, content);
}


================================================
FILE: contracts/op-codes.fc
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/contracts/op-codes.fc
================================================
int op::transfer() asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned() asm "0x05138d91 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::get_static_data() asm "0x2fcb26a2 PUSHINT";
int op::report_static_data() asm "0x8b771735 PUSHINT";

int op::get_royalty_params() asm "0x693d3950 PUSHINT";
int op::report_royalty_params() asm "0xa8cb00ad PUSHINT";

int op::mine() asm "0x4d696e65 PUSHINT";
int op::rescale_complexity() asm "0x5253636c PUSHINT";



================================================
FILE: contracts/params.fc
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/contracts/params.fc
================================================
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}


================================================
FILE: contracts/stdlib.fc
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/contracts/stdlib.fc
================================================
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
    builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
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
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

;; builder store_coins(builder b, int x) asm "STVARUINT16";
;; (slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";

forall X -> X get_at(tuple t, int index) asm "INDEXVAR";
() set_rand_seed(int seed) impure asm "SETRAND";

builder store_builder_ref(builder to, builder what) asm(what to) "STBREFR";
(slice, cell) load_maybe_cell(slice s) asm(-> 1 0) "LDDICT";
(int) mod (int x, int y) asm "MOD";
builder store_coins(builder b, int x) asm "STGRAMS";
(slice, int) load_coins(slice s) asm(-> 1 0) "LDGRAMS";


================================================
FILE: contracts/storage.fc
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/contracts/storage.fc
================================================
;; default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
;;
;; storage#_
;;  owner_address:MsgAddress next_item_index:uint64
;;  ^[collection_content:^Cell common_content:^Cell]
;;  nft_item_code:^Cell
;;  royalty_params:^RoyaltyParams
;;  = Storage;

global slice ctx_owner;
global int ctx_next_item_index;
global cell ctx_content;
global cell ctx_nft_item_code;
global cell ctx_royalty_params;
global int ctx_pow_complexity;
global int ctx_last_success;
global int ctx_seed;
global int ctx_target_delta;
global int ctx_min_cpl;
global int ctx_max_cpl;


() load_base_data() impure {
    var ds = get_data().begin_parse();

    ctx_owner = ds~load_msg_addr();
    ctx_next_item_index = ds~load_uint(64);
    ctx_content = ds~load_ref();
    ctx_nft_item_code = ds~load_ref();
    ctx_royalty_params = ds~load_ref();
    ctx_pow_complexity = ds~load_uint(256);
    ctx_last_success = ds~load_uint(32);
    ctx_seed = ds~load_uint(128);
    ctx_target_delta = ds~load_uint(32);
    ctx_min_cpl = ds~load_uint(8);
    ctx_max_cpl = ds~load_uint(8);

    ds.end_parse();
}

() store_base_data() impure {
    set_data(begin_cell()
        .store_slice(ctx_owner)
        .store_uint(ctx_next_item_index, 64)
        .store_ref(ctx_content)
        .store_ref(ctx_nft_item_code)
        .store_ref(ctx_royalty_params)
        .store_uint(ctx_pow_complexity, 256)
        .store_uint(ctx_last_success, 32)
        .store_uint(ctx_seed, 128)
        .store_uint(ctx_target_delta, 32)
        .store_uint(ctx_min_cpl, 8)
        .store_uint(ctx_max_cpl, 8)
        .end_cell()
    );
}


================================================
FILE: jest.config.ts
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: lib/utils.ts
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/lib/utils.ts
================================================
import { beginCell, BitBuilder, BitReader, Cell } from '@ton/ton';

export function unixNow() {
    return Math.floor(Date.now() / 1000);
}

const OFFCHAIN_CONTENT_PREFIX = 0x01;

export function encodeOffChainContent(content: string) {
    let data = Buffer.from(content);
    let offChainPrefix = Buffer.from([OFFCHAIN_CONTENT_PREFIX]);
    data = Buffer.concat([offChainPrefix, data]);
    return makeSnakeCell(data);
}

export function decodeOffChainContent(content: Cell) {
    let data = flattenSnakeCell(content);

    let prefix = data[0];
    if (prefix !== OFFCHAIN_CONTENT_PREFIX) {
        throw new Error(`Unknown content prefix: ${prefix.toString(16)}`);
    }
    return data.subarray(1).toString();
}

export function makeSnakeCell(data: Buffer): Cell {
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

function bufferToChunks(buff: Buffer, chunkSize: number) {
    let chunks: Buffer[] = [];
    while (buff.byteLength > 0) {
        chunks.push(buff.subarray(0, chunkSize));
        buff = buff.subarray(chunkSize);
    }

    return chunks;
}



================================================
FILE: package.json
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/package.json
================================================
{
    "name": "get-started-with-ton",
    "version": "0.0.1",
    "scripts": {
        "start:script": "ts-node ./scripts/mine.ts",
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest --verbose"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.25.0",
        "@ton/sandbox": "^0.22.0",
        "@ton/test-utils": "^0.4.2",
        "@types/jest": "^29.5.14",
        "@types/node": "^22.8.7",
        "jest": "^29.7.0",
        "prettier": "^3.3.3",
        "@ton/ton": "^15.1.0",
        "@ton/core": "~0",
        "@ton/crypto": "^3.3.0",
        "ts-jest": "^29.2.5",
        "ts-node": "^10.9.2",
        "typescript": "^5.6.3"
    }
}



================================================
FILE: tests/NftGiver.spec.ts
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/tests/NftGiver.spec.ts
================================================
import { NftGiver, NftGiverConfig, OpCodes, Queries } from '../wrappers/NftGiver';
import { beginCell, Cell, contractAddress } from '@ton/ton';
import { unixNow } from '../lib/utils';
import { compile } from '@ton/blueprint';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { randomAddress } from '@ton/test-utils';

const ROYALTY_ADDRESS = randomAddress();

describe('NftGiver', () => {
    let nftGiverCode: Cell;

    beforeAll(async () => {
        nftGiverCode = await compile('NftGiver');
    });

    let blockchain: Blockchain;

    let sender: SandboxContract<TreasuryContract>;
    let owner: SandboxContract<TreasuryContract>;

    let defaultConfig: NftGiverConfig;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sender = await blockchain.treasury('sender');
        owner = await blockchain.treasury('owner');

        defaultConfig = {
            ownerAddress: owner.address,
            nextItemIndex: 777n,
            collectionContent: 'collection_content',
            commonContent: 'common_content',
            nftItemCode: Cell.EMPTY,
            royaltyParams: {
                royaltyFactor: 100n,
                royaltyBase: 200n,
                royaltyAddress: ROYALTY_ADDRESS
            },
            powComplexity: 0n,
            lastSuccess: 0n,
            seed: 0n,
            targetDelta: 15n * 60n, // 15 minutes
            minComplexity: 240n,
            maxComplexity: 252n
        };
    });

    async function deployCollection(collection: SandboxContract<NftGiver>) {
        const { transactions } = await collection.sendDeploy(sender.getSender());
        expect(transactions).toHaveTransaction({
            from: sender.address,
            to: collection.address,
            success: true,
            deploy: true
        });
    }

    it('should mine new nft', async () => {
        const receiver = randomAddress();
        const now = unixNow();
        blockchain.now = now;

        const params = {
            expire: now + 30,
            mintTo: receiver,
            data1: 0n,
            seed: defaultConfig.seed
        };
        const hash = Queries.mine(params).hash();

        const config = {
            ...defaultConfig,
            powComplexity: BigInt('0x' + hash.toString('hex')) + 1n,
            lastSuccess: BigInt(now - 30)
        };

        const collection = blockchain.openContract(NftGiver.createFromConfig(config, nftGiverCode));

        const res = await collection.sendMineNft(sender.getSender(), params);

        // As a result of mint query, collection contract should send stateInit message to NFT item contract
        let nftItemData = beginCell()
            .storeUint(config.nextItemIndex, 64)
            .storeAddress(collection.address)
            .endCell();

        expect(res.transactions).toHaveTransaction({
            success: true,
            deploy: true,
            initCode: config.nftItemCode,
            initData: nftItemData
        });

        const miningData = await collection.getMiningData();

        expect(miningData.powComplexity >= (1n << config.minComplexity)).toBeTruthy();
        expect(miningData.powComplexity <= (1n << config.maxComplexity)).toBeTruthy();
    });


    it('should not mine new nft when POW is not solved', async () => {
        const receiver = randomAddress();
        const now = unixNow();
        blockchain.now = now;

        const params = {
            expire: now + 30,
            mintTo: receiver,
            data1: 0n,
            seed: defaultConfig.seed
        };
        const hash = Queries.mine(params).hash();

        const config = {
            ...defaultConfig,
            powComplexity: BigInt('0x' + hash.toString('hex')),
            lastSuccess: BigInt(now - 30)
        };

        const collection = blockchain.openContract(NftGiver.createFromConfig(config, nftGiverCode));

        const res = await collection.sendMineNft(sender.getSender(), params);
        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: collection.address,
            success: false,
            exitCode: 24
        });
    });

    it('should rescale', async () => {
        const config = { ...defaultConfig };
        const now = unixNow();
        blockchain.now = now;

        config.lastSuccess = BigInt(now) - config.targetDelta * 16n;
        config.powComplexity = 1n << config.minComplexity;

        const collection = blockchain.openContract(NftGiver.createFromConfig(config, nftGiverCode));

        const res = await collection.sendRescaleComplexity(sender.getSender(), { expire: now - 1 });

        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: collection.address,
            success: true
        });

        const miningData = await collection.getMiningData();

        expect(miningData.powComplexity > config.powComplexity).toBeTruthy();
    });

    it('should not rescale if not enough time passed', async () => {
        const config = { ...defaultConfig };
        const now = unixNow();
        blockchain.now = now;

        config.lastSuccess = BigInt(now) - config.targetDelta * 16n + 1n; // this should make rescale fail

        const collection = blockchain.openContract(NftGiver.createFromConfig(config, nftGiverCode));

        const res = await collection.sendRescaleComplexity(sender.getSender(), { expire: now - 1 });

        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: collection.address,
            success: false,
            exitCode: 30
        });
    });

    it('should return collection data', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));
        await deployCollection(collection);

        let res = await collection.getCollectionData();

        expect(res.nextItemId).toEqual(defaultConfig.nextItemIndex);
        expect(res.collectionContent).toEqual(defaultConfig.collectionContent);
        expect(res.ownerAddress).toEqualAddress(defaultConfig.ownerAddress);
    });


    it('should return nft content', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));
        await deployCollection(collection);

        let nftContent = beginCell().storeBuffer(Buffer.from('1')).endCell();
        let res = await collection.getNftContent(0, nftContent);
        expect(res).toEqual(defaultConfig.commonContent + '1');
    });

    it('should return nft address by index', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));
        await deployCollection(collection);

        let index = 77;
        let nftAddress = await collection.getNftAddressByIndex(index);

        // Basic nft item data
        let nftItemData = beginCell()
            .storeUint(index, 64)
            .storeAddress(collection.address)
            .endCell();

        let expectedAddress = contractAddress(0, {
            code: defaultConfig.nftItemCode,
            data: nftItemData
        });

        expect(nftAddress).toEqualAddress(expectedAddress);
    });

    it('should return royalty params', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));
        await deployCollection(collection);

        let res = await collection.getRoyaltyParams();

        expect(res.royaltyBase).toEqual(defaultConfig.royaltyParams.royaltyBase);
        expect(res.royaltyFactor).toEqual(defaultConfig.royaltyParams.royaltyFactor);
        expect(res.royaltyAddress).toEqualAddress(defaultConfig.royaltyParams.royaltyAddress);
    });


    it('should not change owner from not owner', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));

        let newOwner = randomAddress();

        let res = await collection.sendChangeOwner(sender.getSender(), { newOwner });
        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: collection.address,
            success: false
        });

        let { ownerAddress } = await collection.getCollectionData();
        expect(ownerAddress).toEqualAddress(owner.address);
    });

    it('should change owner from owner', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));

        let newOwner = randomAddress();

        const res = await collection.sendChangeOwner(owner.getSender(), { newOwner });
        expect(res.transactions).toHaveTransaction({
            from: owner.address,
            to: collection.address,
            success: true
        });

        let { ownerAddress } = await collection.getCollectionData();
        expect(ownerAddress).toEqualAddress(newOwner);
    });

    it('should send royalty params', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));

        let res = await collection.sendGetRoyaltyParams(sender.getSender());
        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: collection.address,
            success: true
        });

        expect(res.transactions).toHaveTransaction({
            from: collection.address,
            to: sender.address,
            success: true,
            body: beginCell()
                .storeUint(OpCodes.GetRoyaltyParamsResponse, 32)
                .storeUint(0, 64) // queryId
                .storeUint(defaultConfig.royaltyParams.royaltyFactor, 16)
                .storeUint(defaultConfig.royaltyParams.royaltyBase, 16)
                .storeAddress(ROYALTY_ADDRESS)
                .endCell()
        });
    });

    it('should not edit content from not owner', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));

        let royaltyAddress = randomAddress();
        let res = await collection.sendEditContent(sender.getSender(), {
            collectionContent: 'new_content',
            commonContent: 'new_common_content',
            royaltyParams: {
                royaltyFactor: 150n,
                royaltyBase: 220n,
                royaltyAddress
            }
        });

        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: collection.address,
            success: false
        });
    });

    it('should edit content', async () => {
        const collection = blockchain.openContract(NftGiver.createFromConfig(defaultConfig, nftGiverCode));

        let royaltyAddress = randomAddress();
        const res = await collection.sendEditContent(owner.getSender(), {
            collectionContent: 'new_content',
            commonContent: 'new_common_content',
            royaltyParams: {
                royaltyFactor: 150n,
                royaltyBase: 220n,
                royaltyAddress
            }
        });

        expect(res.transactions).toHaveTransaction({
            from: owner.address,
            to: collection.address,
            success: true
        });

        let { collectionContent } = await collection.getCollectionData();
        expect(collectionContent).toEqual('new_content');

        let royalty = await collection.getRoyaltyParams();
        expect(royalty.royaltyBase).toEqual(220n);
        expect(royalty.royaltyFactor).toEqual(150n);
        expect(royalty.royaltyAddress).toEqualAddress(royaltyAddress);
    });

});



================================================
FILE: wrappers/NftGiver.compile.ts
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/wrappers/NftGiver.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/collection.fc'],
};



================================================
FILE: wrappers/NftGiver.ts
URL: https://github.com/ton-community/ton-onboarding-challenge/blob/master/wrappers/NftGiver.ts
================================================
import { decodeOffChainContent, encodeOffChainContent } from '../lib/utils';
import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano,
    TupleBuilder
} from '@ton/ton';

export type RoyaltyParams = {
    royaltyFactor: bigint;
    royaltyBase: bigint;
    royaltyAddress: Address;
}

export type MiningData = {
    powComplexity: bigint;
    lastSuccess: bigint;
    seed: bigint;
    targetDelta: bigint;
    minComplexity: bigint;
    maxComplexity: bigint;
}

export type NftGiverConfig = {
    ownerAddress: Address;
    nextItemIndex: number | bigint;
    collectionContent: string;
    commonContent: string;
    nftItemCode: Cell;
    royaltyParams: RoyaltyParams;
} & MiningData

// default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
//
// storage#_
//  owner_address:MsgAddress next_item_index:uint64
//  ^[collection_content:^Cell common_content:^Cell]
//  nft_item_code:^Cell
//  royalty_params:^RoyaltyParams
//  = Storage;
export function nftGiverConfigToCell(data: NftGiverConfig) {
    let collectionContent = encodeOffChainContent(data.collectionContent);

    let commonContent = beginCell()
        .storeBuffer(Buffer.from(data.commonContent))
        .endCell();

    let contentCell = beginCell()
        .storeRef(collectionContent)
        .storeRef(commonContent)
        .endCell();

    let royaltyCell = beginCell()
        .storeUint(data.royaltyParams.royaltyFactor, 16)
        .storeUint(data.royaltyParams.royaltyBase, 16)
        .storeAddress(data.royaltyParams.royaltyAddress)
        .endCell();

    return beginCell()
        .storeAddress(data.ownerAddress)
        .storeUint(data.nextItemIndex, 64)
        .storeUint(data.powComplexity, 256)
        .storeUint(data.lastSuccess, 32)
        .storeUint(data.seed, 128)
        .storeUint(data.targetDelta, 32)
        .storeUint(data.minComplexity, 8)
        .storeUint(data.maxComplexity, 8)
        .storeRef(contentCell)
        .storeRef(data.nftItemCode)
        .storeRef(royaltyCell)
        .endCell();
}

export const OpCodes = {
    ChangeOwner: 3,
    EditContent: 4,
    GetRoyaltyParams: 0x693d3950,
    GetRoyaltyParamsResponse: 0xa8cb00ad,
    Mine: 0x4d696e65,
    RescaleComplexity: 0x5253636c
};

export type MineMessageParams = {
    expire: number;
    mintTo: Address;
    data1: bigint;
    seed: bigint;
    data2?: bigint;
}

export const Queries = {
    changeOwner: (params: { queryId?: number, newOwner: Address }) => {
        return beginCell()
            .storeUint(OpCodes.ChangeOwner, 32)
            .storeUint(params.queryId ?? 0, 64)
            .storeAddress(params.newOwner)
            .endCell();
    },
    getRoyaltyParams: (params: { queryId?: number }) => {
        return beginCell()
            .storeUint(OpCodes.GetRoyaltyParams, 32)
            .storeUint(params.queryId ?? 0, 64)
            .endCell();
    },
    editContent: (params: {
        queryId?: number,
        collectionContent: string,
        commonContent: string,
        royaltyParams: RoyaltyParams
    }) => {
        let msgBody = beginCell()
            .storeUint(OpCodes.EditContent, 32)
            .storeUint(params.queryId || 0, 64);

        let royaltyCell = beginCell()
            .storeUint(params.royaltyParams.royaltyFactor, 16)
            .storeUint(params.royaltyParams.royaltyBase, 16)
            .storeAddress(params.royaltyParams.royaltyAddress)
            .endCell();

        let collectionContent = encodeOffChainContent(params.collectionContent);

        let commonContent = beginCell()
            .storeBuffer(Buffer.from(params.commonContent))
            .endCell();

        let contentCell = beginCell()
            .storeRef(collectionContent)
            .storeRef(commonContent)
            .endCell();

        return msgBody
            .storeRef(contentCell)
            .storeRef(royaltyCell)
            .endCell();
    },
    mine: (params: MineMessageParams) => beginCell()
        .storeUint(OpCodes.Mine, 32)
        .storeUint(params.expire, 32)
        .storeAddress(params.mintTo)
        .storeUint(params.data1, 256)
        .storeUint(params.seed, 128)
        .storeUint(params.data2 ?? params.data1, 256)
        .endCell(),
    rescaleComplexity: (params: { queryId?: number, expire: number }) => beginCell()
        .storeUint(OpCodes.RescaleComplexity, 32)
        .storeUint(params.queryId ?? 0, 64)
        .storeUint(params.expire, 32)
        .endCell()
};

export class NftGiver implements Contract {
    private constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {
    }

    static createFromConfig(config: NftGiverConfig, code: Cell, workchain = 0) {
        const data = nftGiverConfigToCell(config);
        const init = { code, data };
        return new NftGiver(contractAddress(workchain, init), init);
    }

    static createFromAddress(address: Address) {
        return new NftGiver(address);
    }

    async getCollectionData(provider: ContractProvider): Promise<{
        nextItemId: bigint,
        ownerAddress: Address,
        collectionContent: string
    }> {
        let { stack } = await provider.get('get_collection_data', []);

        return {
            nextItemId: stack.readBigNumber(),
            collectionContent: decodeOffChainContent(stack.readCell()),
            ownerAddress: stack.readAddress()
        };
    }

    async getNftAddressByIndex(provider: ContractProvider, index: bigint | number): Promise<Address> {
        let res = await provider.get('get_nft_address_by_index', [{ type: 'int', value: BigInt(index) }]);

        return res.stack.readAddress();
    }

    async getRoyaltyParams(provider: ContractProvider): Promise<RoyaltyParams> {
        let { stack } = await provider.get('royalty_params', []);

        return {
            royaltyFactor: stack.readBigNumber(),
            royaltyBase: stack.readBigNumber(),
            royaltyAddress: stack.readAddress()
        };
    }

    async getNftContent(provider: ContractProvider, index: number | bigint, nftIndividualContent: Cell): Promise<string> {
        const builder = new TupleBuilder();
        builder.writeNumber(index);
        builder.writeCell(nftIndividualContent);
        let { stack } = await provider.get('get_nft_content', builder.build());

        return decodeOffChainContent(stack.readCell());
    }

    async getMiningData(provider: ContractProvider): Promise<MiningData> {
        let { stack } = await provider.get('get_mining_data', []);

        return {
            powComplexity: stack.readBigNumber(),
            lastSuccess: stack.readBigNumber(),
            seed: stack.readBigNumber(),
            targetDelta: stack.readBigNumber(),
            minComplexity: stack.readBigNumber(),
            maxComplexity: stack.readBigNumber()
        };
    }

    async sendChangeOwner(provider: ContractProvider, via: Sender, params: {
        newOwner: Address,
        value?: bigint
    }) {
        return await provider.internal(via, {
            value: params.value ?? toNano(1),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            bounce: false,
            body: Queries.changeOwner(params)
        });
    }

    async sendGetRoyaltyParams(provider: ContractProvider, via: Sender, value: bigint = toNano(1)) {
        return provider.internal(via, {
            value,
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Queries.getRoyaltyParams({})
        });
    }

    async sendEditContent(provider: ContractProvider, via: Sender, params: {
        value?: bigint
        queryId?: number,
        collectionContent: string,
        commonContent: string,
        royaltyParams: RoyaltyParams,
    }) {
        return provider.internal(via, {
            value: params.value ?? toNano(1),
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Queries.editContent(params)
        });
    }

    async sendMineNft(provider: ContractProvider, via: Sender, params: {
        queryId?: number;
        value?: bigint;
    } & MineMessageParams) {
        return provider.internal(via, {
            value: params.value ?? toNano(1),
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Queries.mine(params)
        });
    }

    async sendRescaleComplexity(provider: ContractProvider, via: Sender, params: {
        queryId?: number,
        expire: number,
        value?: bigint;
    }) {
        return provider.internal(via, {
            value: params.value ?? toNano(1),
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Queries.rescaleComplexity(params)
        });
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint = toNano(1)) {
        return provider.internal(via, {
            value,
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }
}




# Repository: fireworks-func
URL: https://github.com/ton-community/fireworks-func
Branch: main

## Directory Structure:
```
└── fireworks-func/
    ├── README.md
    ├── contracts/
        ├── fireworks.fc
        ├── imports/
            ├── stdlib.fc
    ├── jest.config.ts
    ├── package.json
    ├── tests/
        ├── Fireworks.EdgeCases.spec.ts
        ├── Fireworks.spec.ts
    ├── wrappers/
        ├── Fireworks.compile.ts
        ├── Fireworks.ts
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/ton-community/fireworks-func/blob/main/README.md
================================================
# Fireworks

Special demo contract for gas fees and send modes in TON Blockchain.

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from @ton/core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run {script}` or `yarn blueprint run {script}`
scripts:
- instantFireworks (deployment and launching)
- fakeFireworks (edge cases launching)
- deployFireworks (deployment only)


### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`



================================================
FILE: contracts/fireworks.fc
URL: https://github.com/ton-community/fireworks-func/blob/main/contracts/fireworks.fc
================================================
#include "imports/stdlib.fc";

;; CONSTS
const int ONE_TON = 1000000000;

;; OP CODES
const op::launch_first = "op::launch_first"c; ;; create an opcode from string using the "c" prefix, this results in 0x7e8764ef opcode in this case
const op::launch_second = "op::launch_second"c;
const op::set_first = "op::set_first"c; ;; 0x5720cfeb
const op::faked_launch = "op::faked_launch"c; ;;0x39041457

;; COMMENTS
const slice comment_msg_0 = "send mode = 0";
const slice comment_msg_1 = "send mode = 1";
const slice comment_msg_2 = "send mode = 2";
const slice comment_msg_128+32 = "send mode = 128 + 32";
const slice comment_msg_64 = "send_mode = 64";

;; ASM functions
() return_alt() impure asm "RETALT"; ;; for alternative return
() drop() impure asm "DROP";
forall X -> (tuple) to_tuple (X x) asm "NOP";
(int, int, int, int) untuple4_int (tuple t) asm "4 UNTUPLE";
() set_c5(cell actions) impure asm "c5 POP";
() error_opcode() impure asm "x{D7FF} @addop";
() set_lib_code(cell code, int mode) impure asm "SETLIBCODE";

int send_msg(cell msg, int mode) impure asm "SENDMSG";

() stack_overflow() impure asm """
    <{
    }>CONT // c
    0 SETNUMARGS // c'
    2 PUSHINT // c' 2
    SWAP // 2 c'
    1 -1 SETCONTARGS
""";

int read_id() {
    cell data = get_data();
    slice cdata = data.begin_parse();

    int id = cdata~load_int(32);
    return id;
}

() fake_launch(slice in_msg_body) impure {
    int error = in_msg_body~load_uint(8);


    ;; Compute Phase

    if (error == 0) { ;; success
        return ();
    }
    elseif (error == 2) {
        repeat (100) {
            drop(); ;; remove 100 elements from the stack
        }
    }
    elseif (error == 3) {
        stack_overflow();
    }
    elseif (error == 4) {
        int max_uint256 = in_msg_body~load_uint(256);
        max_uint256 += 1;
        max_uint256~impure_touch();
    }
    elseif (error == 5) {
        int negative_number = in_msg_body~load_int(8);
        cell invalid_cell = begin_cell().store_uint(negative_number, 8).end_cell();
        invalid_cell~impure_touch();
    }
    elseif (error == 6) {
        error_opcode();
        return ();
    }
    elseif (error == 7) {
        tuple t3 = to_tuple([1, 2, 3]);
        (int a1, int a2, int a3, int a4) = untuple4_int(t3);
        a1~impure_touch();
    }
    elseif (error == 8) | (error == 9) {
        cell msg = in_msg_body~load_ref();
        slice cs = msg.begin_parse();

        ;; 9 exit code
        int number = cs~load_uint(2);

        ;; 8 exit code
        cell recomp = begin_cell()
        .store_uint(number, 2)
        .store_slice(cs)
        .store_uint(2, 2) ;; overflow appears if exceed 1023 bits
        .end_cell();

        set_data(recomp);
    }
    elseif (error == 10) {
        cell dict = new_dict();
        dict~udict_set(16, 3, begin_cell()
            .store_ref(
                begin_cell()
                .store_uint(123, 32)
                .end_cell())
            .store_ref(begin_cell()
                .store_uint(123, 33)
                .end_cell())
                .end_cell()
                .begin_parse());

        (cell value, int f) = dict.udict_get_ref?(16, 3);
        value~impure_touch();
    }
    elseif (error == 11) {
        send_msg(begin_cell().end_cell(), 1);
    }
    elseif (error == 13) {
        int i = 0;
        while (i < 100) {
            i += 1;
        }
        i~impure_touch();
    }


    ;; Action Phase

    elseif (error == 32) {
        cell actions = begin_cell()
            .store_uint(0x0ec3c86d, 32)
            .store_uint(0, 8)
            .end_cell();
        set_c5(actions);
    }
    elseif (error == 33) {
        cell msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(my_address())
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
        repeat(256) {
            send_raw_message(msg, 1);
        }
    }
    elseif (error == 34) {
        cell invalid_msg = begin_cell().end_cell();
        send_raw_message(invalid_msg, 0);
    }
    elseif (error == 35) {
        cell msg = begin_cell()
            .store_uint(6, 4) ;; 0110
            .store_slice("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"a) ;; source address must be zero or my address
            .store_slice(my_address())
            .store_coins(1000000000000) ;; 1000 TON
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
        send_raw_message(msg, 1);
    }
    elseif (error == 36) {
        cell msg = begin_cell()
            .store_uint(0x18, 6)
            .store_uint(3, 2) ;; 11 -> MsgAddressInt
            .store_uint(2, 8) ;; 1 -> workchain (not existing)
            .store_uint(0, 256) ;; data part
            .store_coins(1000000000000) ;; 1000 TON
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
        send_raw_message(msg, 1);
    }
    elseif (error == 37) {
        cell msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(my_address())
            .store_coins(1000000000000) ;; 1000 TON
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
        send_raw_message(msg, 1);
    }
    elseif (error == 38) {
        {-
            extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32))
                 = ExtraCurrencyCollection;

            https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L118C1-L119C44
        -}
        cell extra_dict = new_dict();
        cell extra_data = begin_cell()
            .store_uint(1, 5) ;; 5 bits for the number of bytes, 1 = 8 bits
            .store_uint(1, 8) ;; 8 bits for the amount
            .end_cell();
        extra_dict~udict_set(32, 1, extra_data.begin_parse());
        cell msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(my_address())
            .store_coins(0)
            .store_uint(1, 1)
            .store_ref(extra_dict)
            .store_uint(0, 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
        send_raw_message(msg, 1);
    }
    elseif (error == 40) {
        cell deep_body = begin_cell().end_cell();
        repeat(510) {
            deep_body = begin_cell().store_ref(deep_body).end_cell();
        }
        cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(my_address())
        .store_coins(1000)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(deep_body)
        .end_cell();
        send_raw_message(msg, 0);
    }
    elseif (error == 43) {
        int i = 0;
        cell lib = begin_cell().store_uint(i, 32).end_cell();
        repeat (500) {
            i += 1;
            cell lib2 = begin_cell().store_uint(i, 32).end_cell();
            i += 1;
            lib = begin_cell().store_uint(i, 32).store_ref(lib).store_ref(lib2).end_cell();
        }

        (int a, int b, int c) = compute_data_size(lib, 2000);
        set_lib_code(lib, 1);
    }
    else {
        throw(0xffff);
    }
}

() send_message_comment(int value, int mode, slice comment, slice destination) impure inline {
    cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(destination)
        .store_coins(value)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(0, 32)
        .store_slice(comment)
        .end_cell();

    send_raw_message(msg, mode);
}

cell build_firework(int id, int op_code, cell init_code, slice sender_address) {
    cell init_data = begin_cell()
        .store_uint(id, 32)
        .end_cell();

    ;; _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    ;;  code:(Maybe ^Cell) data:(Maybe ^Cell)
    ;;  library:(HashmapE 256 SimpleLib) = StateInit;

    cell state_init = begin_cell()
        .store_uint(0, 1) ;; no split_depth
        .store_uint(0, 1) ;; no special
        .store_uint(1, 1) ;; we have code
        .store_ref(init_code)
        .store_uint(1, 1) ;; we have data
        .store_ref(init_data)
        .store_uint(0, 1) ;; we have no library
        .end_cell();

    int state_init_hash = cell_hash(state_init);
    slice dest_address = begin_cell().store_uint(4, 3).store_int(0, 8).store_uint(state_init_hash, 256).end_cell().begin_parse();

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(dest_address)
        .store_coins(ONE_TON + ONE_TON / 10)
        ;; serialize CurrencyCollection (see below)
        .store_uint(0, 1 + 4 + 4 + 64 + 32)
        .store_uint(1, 1) ;; state_init added
        .store_uint(1, 1) ;; state_init placed in reference
        .store_ref(state_init)
        .store_uint(0,  1) ;; inplace message body flag (Either)
        .store_uint(op_code, 32)
        .store_ref(begin_cell().store_slice(sender_address).end_cell()) ;;sender address payload
        .end_cell();

    return msg;

}

;; recv_internal is the main function of the contract and is called when it receives a message from other contracts
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore all empty messages
        return ();
    }

    if (my_balance < ONE_TON) {
        throw(401); ;; not enough balance
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32); ;; by convention, the first 32 bits of incoming message is the op

    if (op == op::set_first) {
        cell init_code = in_msg_body~load_ref();
        int root_id = read_id();


        ;; build and send the first fireworks

        cell msg1 = build_firework(root_id + 1, op::launch_first, init_code, sender_address);
        send_raw_message(msg1, 0);

        ;; build and send the second fireworks

        cell msg2 = build_firework(root_id + 2, op::launch_second, init_code, sender_address);
        send_raw_message(msg2, 0);
    }

    elseif (op == op::launch_first) {
        cell addr = in_msg_body~load_ref();
        sender_address = addr.begin_parse();

        ;; prepare 4 messages

        ;; msg1 - sending 0.1 TON with mode = 0
        send_message_comment(ONE_TON / 10, 0, comment_msg_0, sender_address);

        ;; msg2 - sending 0.1 TON with mode = 1
        send_message_comment(ONE_TON / 10,  1, comment_msg_1,sender_address);

        ;; msg3 - sending 0.1 TON with mode = 2
        send_message_comment(ONE_TON / 10, 2, comment_msg_2,sender_address);

        ;; msg4 - sending remaining TON with mode = 128 + 32
        ;; 32 is the flag for destroying the contract
        send_message_comment(ONE_TON / 10, 128 + 32, comment_msg_128+32,sender_address);
    }

    elseif (op == op::launch_second) {
        cell addr = in_msg_body~load_ref();
        sender_address = addr.begin_parse();

        ;; prepare a message

        ;; msg1 - sending remaining TON with mode = 64
        send_message_comment(0, 64, comment_msg_64, sender_address);

    }

    elseif (op == op::faked_launch) {
        if (in_msg_body.preload_uint(8) == 1) {
            return_alt();
        }
        fake_launch(in_msg_body);
    }

    else {
        throw(0xffff); ;; if the message contains an op that is not known to this contract, we throw
    }

    return();
}

int get_id() method_id {
    int id = read_id();
    return id;
}


================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/ton-community/fireworks-func/blob/main/contracts/imports/stdlib.fc
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


================================================
FILE: jest.config.ts
URL: https://github.com/ton-community/fireworks-func/blob/main/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: package.json
URL: https://github.com/ton-community/fireworks-func/blob/main/package.json
================================================
{
    "name": "Fireworks",
    "version": "0.0.1",
    "scripts": {
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.24.0",
        "@ton/ton": "^15.0.0",
        "@ton/core": "~0",
        "@ton/crypto": "^3.3.0",
        "@ton/sandbox": "^0.22.0",
        "@ton/test-utils": "^0.4.2",
        "@types/jest": "^29.5.0",
        "@types/node": "^20.2.5",
        "jest": "^29.5.0",
        "prettier": "^2.8.6",
        "ts-jest": "^29.0.5",
        "ts-node": "^10.9.1",
        "typescript": "^4.9.5"
    }
}



================================================
FILE: tests/Fireworks.EdgeCases.spec.ts
URL: https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.EdgeCases.spec.ts
================================================
import { Blockchain, BlockchainSnapshot, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, beginCell } from '@ton/core';
import { ExitCode, Fireworks, OPCODES } from '../wrappers/Fireworks';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import * as fs from 'fs';

describe('Edge Cases Tests', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let fireworks: SandboxContract<Fireworks>;
    let launched_f1: SandboxContract<Fireworks>;
    let launched_f2: SandboxContract<Fireworks>;

    let launcher: SandboxContract<TreasuryContract>;
    let initialState: BlockchainSnapshot;

    beforeAll(async () => {
        code = await compile('Fireworks');

        blockchain = await Blockchain.create();
        blockchain.verbosity = {
            ...blockchain.verbosity,
            blockchainLogs: true,
            vmLogs: 'vm_logs_full',
            debugLogs: true,
            print: false,
        };

        launcher = await blockchain.treasury('launcher');

        fireworks = blockchain.openContract(
            Fireworks.createFromConfig(
                {
                    id: 0,
                },
                code
            )
        );

        launched_f1 = blockchain.openContract(
            Fireworks.createFromConfig(
                {
                    id: 1,
                },
                code
            )
        );

        launched_f2 = blockchain.openContract(
            Fireworks.createFromConfig(
                {
                    id: 2,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');
        const deployResult = await fireworks.sendDeploy(deployer.getSender(), toNano('100'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fireworks.address,
            deploy: true,
            success: true,
        });

        initialState = blockchain.snapshot();
    });

    afterEach(async () => {
        await blockchain.loadFrom(initialState);
    });

    it('compute phase | exit code = 0', async () => {
        const body = beginCell().storeUint(OPCODES.FAKED_LAUNCH, 32).storeUint(ExitCode.Success, 8).endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: true,
            exitCode: ExitCode.Success,
            // exit code = 0 | Standard successful execution exit code.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 1', async () => {
        const body = beginCell().storeUint(OPCODES.FAKED_LAUNCH, 32).storeUint(ExitCode.SuccessAlt, 8).endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: true,
            exitCode: ExitCode.SuccessAlt,
            // exit code = 1 | Alternative successful execution exit code.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 2', async () => {
        const body = beginCell().storeUint(OPCODES.FAKED_LAUNCH, 32).storeUint(ExitCode.StackUnderflow, 8).endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.StackUnderflow,
            // exit code = 2 | Stack underflow. Last op-code consumed more elements than there are on the stacks.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 3', async () => {
        const body = beginCell().storeUint(OPCODES.FAKED_LAUNCH, 32).storeUint(ExitCode.StackOverflow, 8).endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.StackOverflow,
            // exit code = 3 | Stack overflow. More values have been stored on a stack than allowed by this version of TVM.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 4', async () => {
        const maxUint256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.IntegerOverflow, 8)
            .storeUint(maxUint256, 256)
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);
        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.IntegerOverflow,
            // exit code = 4 | Integer overflow. Integer does not fit into −2256 ≤ x < 2256 or a division by zero has occurred.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 5', async () => {
        const negativeNumber = -5;
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.IntegerOutOfRange, 8)
            .storeInt(negativeNumber, 8)
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);
        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.IntegerOutOfRange,
            // exit code = 5 | Integer out of expected range.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 6', async () => {
        const body = beginCell().storeUint(OPCODES.FAKED_LAUNCH, 32).storeUint(ExitCode.InvalidOpcode, 8).endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.InvalidOpcode,
            // exit code = 6 | Invalid opcode. Instruction is unknown in the current TVM version.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 7', async () => {
        const body = beginCell().storeUint(OPCODES.FAKED_LAUNCH, 32).storeUint(ExitCode.TypeCheckError, 8).endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);
        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.TypeCheckError,
            // exit code = 7 | Type check error. An argument to a primitive is of an incorrect value type.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 8', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.CellOverflow, 8)
            .storeRef(beginCell().storeUint(1, 256).storeUint(2, 256).storeUint(3, 256).storeUint(4, 255).endCell()) // 1023 bits cell
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.CellOverflow,
            // exit code = 8 | Cell overflow.  Writing to builder is not possible since after operation there would be more than 1023 bits or 4 references.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 9', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.CellUnderflow, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.CellUnderflow,
            // exit code = 9 | Stack underflow. Last TVM op-code consumed more elements than there are on the stacks.

            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 10', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.DictionaryError, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.DictionaryError,
            // exit code = 10 | Dictionary error. Error during manipulation with dictionary (hashmaps).
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 11', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.UnknownError, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('2.0'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.UnknownError,
            // exit code = 11 | Most oftenly caused by trying to call get-method whose id wasn't found in the code (missing method_id modifier or wrong get-method name specified when trying to call it). In TVM docs its described as "Unknown error, may be thrown by user programs".
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = -14', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.OutOfGasError, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('0.003'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: ExitCode.OutOfGasErrorAlt,
            // exit code = -14 | It means out of gas error, same as 13. Negative, because it cannot be faked
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('compute phase | exit code = 0xffff', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(123, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            exitCode: 0xffff,
            // exit code = 0xffff (65535 in decimal) | This usually means that the received opcode is unknown to the contract. When writing contracts, this code is set by the developer himself.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 32', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.ActionListInvalid, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.ActionListInvalid,
            // exit code = 32 | Action list is invalid. Set during action phase if c5 register after execution contains unparsable object.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 33', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.ActionListTooLong, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.ActionListTooLong,
            // exit code = 33 | Action list is too long.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 34', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.ActionInvalid, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.ActionInvalid,
            // exit code = 34 | Action is invalid or not supported. Set during action phase if current action cannot be applied.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 35', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.InvalidSrcAddr, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.InvalidSrcAddr,
            // exit code = 35 | Invalid Source address in outbound message.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 36', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.InvalidDstAddr, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.InvalidDstAddr,
            // exit code = 36 | Invalid Destination address in outbound message.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 37', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.NotEnoughTON, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.NotEnoughTON,
            // exit code = 37 | Not enough TON. Message sends too much TON (or there is not enough TON after deducting fees).
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 38', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.NotEnoughExtraCurrencies, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.NotEnoughExtraCurrencies,
            // exit code = 38 | Not enough extra-currencies.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 40', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.NotEnoughFounds, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.NotEnoughFounds,
            // exit code = 40 | Not enough funds to process a message. This error is thrown when there is only enough gas to cover part of the message, but does not cover it completely.
            op: OPCODES.FAKED_LAUNCH,
        });
    });

    it('action phase | exit code = 43', async () => {
        const body = beginCell()
            .storeUint(OPCODES.FAKED_LAUNCH, 32)
            .storeUint(ExitCode.LibOutOfLimit, 8)
            .storeRef(beginCell().endCell())
            .endCell();
        const launchResult = await fireworks.sendBadMessage(launcher.getSender(), toNano('1'), body);

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: ExitCode.LibOutOfLimit,
            // exit code = 43 | The maximum number of cells in the library is exceeded or the maximum depth of the Merkle tree is exceeded.
            op: OPCODES.FAKED_LAUNCH,
        });
    });
});



================================================
FILE: tests/Fireworks.spec.ts
URL: https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts
================================================
import { Blockchain, BlockchainSnapshot, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, beginCell, Address } from '@ton/core';
import { Fireworks, OPCODES } from '../wrappers/Fireworks';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Direct Tests', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let fireworks: SandboxContract<Fireworks>;
    let launched_f1: SandboxContract<Fireworks>;
    let launched_f2: SandboxContract<Fireworks>;

    let launcher: SandboxContract<TreasuryContract>;
    let initialState: BlockchainSnapshot;

    beforeAll(async () => {
        code = await compile('Fireworks');

        blockchain = await Blockchain.create();
        blockchain.verbosity = {
            ...blockchain.verbosity,
            blockchainLogs: true,
            vmLogs: 'vm_logs_full',
            debugLogs: true,
            print: false,
        };

        launcher = await blockchain.treasury('launcher');

        fireworks = blockchain.openContract(
            Fireworks.createFromConfig(
                {
                    id: 0,
                },
                code
            )
        );

        launched_f1 = blockchain.openContract(
            Fireworks.createFromConfig(
                {
                    id: 1,
                },
                code
            )
        );

        launched_f2 = blockchain.openContract(
            Fireworks.createFromConfig(
                {
                    id: 2,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');
        const deployResult = await fireworks.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fireworks.address,
            deploy: true,
            success: true,
        });

        initialState = blockchain.snapshot();
    });

    afterEach(async () => {
        await blockchain.loadFrom(initialState);
    });

    it('first transaction[ID:1] should set fireworks successfully', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: true,
            op: OPCODES.SET_FIRST,
        });
    });

    it('should exist a transaction[ID:2] which launch first fireworks successfully', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: fireworks.address,
            to: launched_f1.address,
            success: true,
            op: OPCODES.LAUNCH_FIRST,
            outMessagesCount: 4,
            destroyed: true,
            endStatus: 'non-existing',
        });

        printTransactionFees(launchResult.transactions);
    });

    it('should exist a transaction[ID:3] which launch second fireworks successfully', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: fireworks.address,
            to: launched_f2.address,
            success: true,
            op: OPCODES.LAUNCH_SECOND,
            outMessagesCount: 1,
        });

        printTransactionFees(launchResult.transactions);
    });

    it('should exist a transaction[ID:4] with a comment send mode = 0', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0, 32).storeStringTail('send mode = 0').endCell(), // 0x00000000 comment opcode and encoded comment
        });
    });

    it('should exist a transaction[ID:5] with a comment send mode = 1', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0, 32).storeStringTail('send mode = 1').endCell(), // 0x00000000 comment opcode and encoded comment
        });
    });

    it('should exist a transaction[ID:6] with a comment send mode = 2', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0, 32).storeStringTail('send mode = 2').endCell(), // 0x00000000 comment opcode and encoded comment
        });
    });

    it('should exist a transaction[ID:7] with a comment send mode = 128 + 32', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0, 32).storeStringTail('send mode = 128 + 32').endCell(), // 0x00000000 comment opcode and encoded comment
        });
    });

    it('should exist a transaction[ID:8] with a comment send mode = 64', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f2.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0, 32).storeStringTail('send_mode = 64').endCell(), // 0x00000000 comment opcode and encoded comment
        });
    });

    it('transaction in fireworks failed on Action Phase because insufficient funds ', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.0'));

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode: 37,
            // exit code = Not enough TON. Message sends too much TON (or there is not enough TON after deducting fees). https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes
            op: OPCODES.SET_FIRST,
        });
    });

    it('transactions should be processed with expected fees', async () => {
        const launchResult = await fireworks.sendDeployLaunch(launcher.getSender(), toNano('2.5'));

        //totalFee
        console.log('total fees = ', launchResult.transactions[1].totalFees);

        const tx1 = launchResult.transactions[1];
        if (tx1.description.type !== 'generic') {
            throw new Error('Generic transaction expected');
        }

        //computeFee
        const computeFee =
            tx1.description.computePhase.type === 'vm' ? tx1.description.computePhase.gasFees : undefined;
        console.log('computeFee = ', computeFee);

        //actionFee
        const actionFee = tx1.description.actionPhase?.totalActionFees;
        console.log('actionFee = ', actionFee);

        if (computeFee == null || undefined || actionFee == null || undefined) {
            throw new Error('undefined fees');
        }

        //The check, if Compute Phase and Action Phase fees exceed 1 TON
        expect(computeFee + actionFee).toBeLessThan(toNano('1'));

        printTransactionFees(launchResult.transactions);

        console.log('launcher address = ', launcher.address);
        console.log('fireworks address = ', fireworks.address);
        console.log('launched_f1 address = ', launched_f1.address);
        console.log('launched_f2 address = ', launched_f2.address);
    });
});



================================================
FILE: wrappers/Fireworks.compile.ts
URL: https://github.com/ton-community/fireworks-func/blob/main/wrappers/Fireworks.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/fireworks.fc'],
};



================================================
FILE: wrappers/Fireworks.ts
URL: https://github.com/ton-community/fireworks-func/blob/main/wrappers/Fireworks.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FireworksConfig = {
    id: number;
};

export function fireworksConfigToCell(config: FireworksConfig): Cell {
    return beginCell().storeUint(config.id, 32).endCell();
}

export const OPCODES = {
    SET_FIRST: 0x5720cfeb,
    LAUNCH_FIRST: 0x6efe144b,
    LAUNCH_SECOND: 0xa2e2c2dc,
    FAKED_LAUNCH: 0x39041457,
};

export enum ExitCode {
    Success = 0,
    SuccessAlt = 1,
    StackUnderflow = 2,
    StackOverflow = 3,
    IntegerOverflow = 4,
    IntegerOutOfRange = 5,
    InvalidOpcode = 6,
    TypeCheckError = 7,
    CellOverflow = 8,
    CellUnderflow = 9,
    DictionaryError = 10,
    UnknownError = 11,
    OutOfGasError = 13,
    OutOfGasErrorAlt = -14,
    ActionListInvalid = 32,
    ActionListTooLong = 33,
    ActionInvalid = 34,
    InvalidSrcAddr = 35,
    InvalidDstAddr = 36,
    NotEnoughTON = 37,
    NotEnoughExtraCurrencies = 38,
    NotEnoughFounds = 40,
    LibOutOfLimit = 43,
}

export class Fireworks implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Fireworks(address);
    }

    static createFromConfig(config: FireworksConfig, code: Cell, workchain = 0) {
        const data = fireworksConfigToCell(config);
        const init = { code, data };
        return new Fireworks(contractAddress(workchain, init), init);
    }

    static getStateInit(config: FireworksConfig, code: Cell, workchain = 0) {
        const data = fireworksConfigToCell(config);
        const init = { code, data };
        return init;
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendDeployLaunch(provider: ContractProvider, via: Sender, value: bigint) {
        //let init = Fireworks.getStateInit();

        if (this.init === undefined) {
            throw Error('wrong init state');
        }

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(OPCODES.SET_FIRST, 32).storeRef(this.init.code).endCell(),
        });
    }

    async sendBadMessage(provider: ContractProvider, via: Sender, value: bigint, msg: Cell) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
        });
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }

    async sendLaunch(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(OPCODES.LAUNCH_FIRST, 32).endCell(),
        });
    }
}




# Repository: mintless-jetton
URL: https://github.com/ton-community/mintless-jetton
Branch: main

## Directory Structure:
```
└── mintless-jetton/
    ├── .env.example
    ├── README.md
    ├── build/
        ├── JettonMinter.compiled.json
        ├── JettonWallet.compiled.json
        ├── Librarian.compiled.json
        ├── print-hex.fif
    ├── compile.sh
    ├── contracts/
        ├── gas.fc
        ├── helpers/
            ├── librarian.func
        ├── jetton-minter.fc
        ├── jetton-utils.fc
        ├── jetton-wallet.fc
        ├── jetton.tlb
        ├── op-codes.fc
        ├── proofs.fc
        ├── stdlib.fc
        ├── test-minter.fc
        ├── workchain.fc
    ├── gasUtils.ts
    ├── jest.config.js
    ├── package.json
    ├── sandbox_tests/
        ├── Claim.spec.ts
        ├── JettonWallet.spec.ts
        ├── SameShard.spec.ts
        ├── StateInit.spec.ts
        ├── proof
        ├── utils.ts
    ├── wrappers/
        ├── JettonConstants.ts
        ├── JettonMinter.compile.ts
        ├── JettonMinter.ts
        ├── JettonMinterChecker.ts
        ├── JettonMinterTest.compile.ts
        ├── JettonMinterTest.ts
        ├── JettonWallet.compile.ts
        ├── JettonWallet.ts
        ├── JettonWalletChecker.ts
        ├── Librarian.compile.ts
        ├── Librarian.ts
        ├── ui-utils.ts
        ├── units.ts
```

## Files Content:

================================================
FILE: .env.example
URL: https://github.com/ton-community/mintless-jetton/blob/main/.env.example
================================================
WALLET_MNEMONIC=
WALLET_VERSION=v3r2


================================================
FILE: README.md
URL: https://github.com/ton-community/mintless-jetton/blob/main/README.md
================================================
# Mintless Jetton

This repository contains the reference implementation of the [TEP#177](https://github.com/ton-blockchain/TEPs/pull/177) with [TEP#176](https://github.com/ton-blockchain/TEPs/pull/176) API endpoint, an extension to the [TEP#74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) Jetton standard. It allows for Merkle-proof airdrops, enabling the minting of Jettons directly on the Jetton-Wallet contract in a decentralized manner. The implementation is designed to support large-scale airdrops without incurring high costs or placing significant load on the blockchain.

## Features

- **Merkle Proof Airdrops**: Efficiently airdrop to millions of users using a single hash storage.
- **Decentralized Claiming**: Users can claim their airdrops through a simple transaction, which mints the Jettons on demand.
- **Integration Friendly**: Designed to be transparent for user given proper support from wallets: all magic happen under the hood while user interact with unclaimed jetton the same way as with usual.

## Prior art
Made from [Jetton with governance(stablecoin)](https://github.com/ton-blockchain/stablecoin-contract) by removing governance functionality.
Also burning is allowed.

## Local Development

### Install Dependencies

`npm install`

### Compile Contracts

`npm run build`

### Run Tests

`npm run test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

use Toncenter API:

`npx blueprint run --custom https://testnet.toncenter.com/api/v2/ --custom-version v2 --custom-type testnet --custom-key <API_KEY> `

API_KEY can be obtained on https://toncenter.com or https://testnet.toncenter.com

## Examples

Check [generateTestJetton](./scripts/generateTestJetton.ts) as example of deploying mintless jetton and [claimApi.ts](./scripts/claimApi.ts) for example api endpoint. Note, `claimAPI.ts` is not intended to be used for millions of users, check https://github.com/Trinketer22/proof-machine for mass-scale example.



================================================
FILE: build/JettonMinter.compiled.json
URL: https://github.com/ton-community/mintless-jetton/blob/main/build/JettonMinter.compiled.json
================================================
{"hex":"b5ee9c7241021401000493000114ff00f4a413f4bcf2c80b0102016207020201200603020271050400cfaf16f6a2687d007d207d206a6a68bf99e836c1783872ebdb514d9c97c283b7f0ae5179029e2b6119c39462719e4f46ed8f7413e62c780a417877407e978f01a40711411b1acb773a96bdd93fa83bb5ca8435013c8c4b3ac91f4589b4780a38646583fa0064a180400085adbcf6a2687d007d207d206a6a688a2f827c1400b82a3002098a81e46581ac7d0100e78b00e78b6490e4658089fa00097a00658064fc80383a6465816503e5ffe4e8400025bd9adf6a2687d007d207d206a6a6888122f8240202cb0908001da23864658380e78b64814183fa0bc002f5d0cb434c0c05c6c238ecc200835c874c7c0608405e351466ea44c38601035c87e800c3b51343e803e903e90353534541168504d3214017e809400f3c58073c5b333327b55383e903e900c7e800c7d007e800c7e80004c5c3e0e80b4c7c04074cfc044bb51343e803e903e9035353449a084190adf41eeb8c08e496110a03f682107bdd97deba8ee53505fa00fa40f82854120770546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a144145036c85005fa025003cf1601cf16ccccc9ed54fa40d120d70b01c000b3915be30de02582102c76b973bae3023424100e0b02fc82106501f354ba8e2130335142c705f2e04902fa40d1400304c85005fa025003cf1601cf16ccccc9ed54e0248210fb88e119ba8e20313303d15131c705f2e0498b024034c85005fa025003cf1601cf16ccccc9ed54e0248210cb862902bae302302382102508d66aba8e11365f0302c705f2e049d4d4d101ed54fb04e0230d0c007682107431f221ba8e21335042c705f2e04901d18b028b024034c85005fa025003cf1601cf16ccccc9ed54e010365f068210d372158cbadc840ff2f0004634365145c705f2e049c85003cf16c9103412c85005fa025003cf1601cf16ccccc9ed5401fe355f033401fa40d2000101d195c821cf16c9916de2c8801001cb055004cf1670fa027001cb6a8210d173540001cb1f500401cb3f23fa4430c0008e35f828440470546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c9f9007074c8cb02ca07cbffc9d012cf1697316c127001cb01e2f400c980500f0004fb000044c8801001cb0501cf1670fa027001cb6a8210d53276db01cb1f0101cb3fc98042fb00019635355161c705f2e04904fa4021fa4430c000f2e14dfa00d4d120d0d31f018210178d4519baf2e0488040d721fa00fa4031fa4031fa0020d70b009ad74bc00101c001b0f2b19130e254431b12018e2191729171e2f839206e938123399120e2216e94318128099101e25023a813a0738103a370f83ca00270f83612a00170f836a07381040982100966018070f837a0bcf2b025597f1300ec82103b9aca0070fb02f828450470546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c920f9007074c8cb02ca07cbffc9d0c8801801cb0501cf1658fa02029858775003cb6bcccc9730017158cb6acce2c98011fb005005a04314c85005fa025003cf1601cf16ccccc9ed5487437a7c"}



================================================
FILE: build/JettonWallet.compiled.json
URL: https://github.com/ton-community/mintless-jetton/blob/main/build/JettonWallet.compiled.json
================================================
{"hex":"b5ee9c7241021a010004ff000114ff00f4a413f4bcf2c80b0102016202150202ca031001f5d407434c0c05c6c2396c4d7c0e00835c87b513434c0fe803e903e9034ffc07e1874c2407e18b44134c7c06103c8608405e351466e80a0841ef765f7ae84ac7cbd201035c87e800c04a81004fe107e10817232c0d4013e809633c58073c5b2fff2c2727b55383e903e900c7e800c7d007e800c7e80004c5c3e0e80a040384d31f012082100f8a7ea5ba8e85304434db3ce033228210178d4519ba8e84325adb3ce034218210595f07bcba8e843101db3ce0135f038210d372158cbadc840ff2f005080e03f604d33f0101fa00fa4021fa4430c000f2e14ded44d0d303fa00fa40fa40d3ff01f861d30901f862d1521bc705f2e049f82af8412b103759db3c6f223020f9007074c8cb02ca07cbff04fa40f4048050226e92323be30e0afa002020d70b009ad74bc00101c001b0f2b19130e25148a120c2fff2afc88210178d451909060700ac3001d0d31f0182100df602d6baf2b925f276d430f84128f02cf8235203bef2b7bbf2b814a00471b151a9a1f82fa07381051382100966018070f8375210b609208010fb02a1810090f80770f83658a01aa1103a09103401f801cb1f500a01cb3f5008fa0226cf1601cf1626fa0258cf16c9c8801801cb055004cf1770fa024013775003cb6bccccc945382191729171e2f839206e9381782e9120e2216e9431817ee09101e25023a813a0738104ad70f83ca00270f83612a00170f836a07381051382100966018070f837a0bcf2b05053fb0043030d04d6ed44d0d303fa00fa40fa40d3ff01f861d30901f862d107d33f0101fa005141a004fa40fa4053bac70520913b8ea030f82af84124544e30db3c6f2230f9007074c8cb02ca07cbffc9d0500bc7050ae20af2e04a09fa0021925f04e30d26d70b01c000b393306c33e30d5502090b0c0d01f6840f7f7026fa4431abfb531149461804c8cb035003fa0201cf1601cf16cbff208100cac8cb0f01cf1724f90025d7652582020134c8cb1712cb0fcb0fcbff8e2906a45c01cb0971f90400527001cbff71f90400abfb28b25304b9933434239130e220c02024c000b117e610235f033333227003cb09c922c8cb01120a0014f400f400cb00c9016f020060c882107362d09c01cb1f2501cb3f5004fa0258cf1658cf16c9c8801001cb0524cf1658fa02017158cb6accc98011fb00007a5054a1f82fa07381051382100966018070f837b60972fb02c8801001cb055005cf1670fa027001cb6a8210d53276db01cb1f5801cb3fc9810082fb00590032f841f84205c8cb035004fa0258cf1601cf16cbffcb09c9ed5401baed44d0d303fa00fa40fa40d3ff01f861d30901f862d106d33f0101fa00fa40f401d15141a15238c705f2e04926c2fff2afc882107bdd97de01cb1f5801cb3f01fa0221cf1658cf16c9c8801801cb0526cf1670fa02017158cb6accc9030f007ef839206e9430811804de718102f270f8380170f836a081700870f836a0bcf2b0028050fb0003f841f84205c8cb035004fa0258cf1601cf16cbffcb09c9ed5402016611140201581213002335ce7cb819f4c1c07000fcb81a3534ffcc200011007c0a962ebcb81a600029d2cf815c08085fa0537d0f97036fd006997e9979840201201617003bbfd8176a2686981fd007d207d2069ff80fc30e98480fc316899fc152098402012018190035b8a11ed44d0d303fa00fa40fa40d3ff01f861d30901f862d15f0380035b9daced44d0d303fa00fa40fa40d3ff01f861d30901f862d15f038f439324a"}


================================================
FILE: build/Librarian.compiled.json
URL: https://github.com/ton-community/mintless-jetton/blob/main/build/Librarian.compiled.json
================================================
{"hex":"b5ee9c7241010301005c000114ff00f4a413f4bcf2c80b010292d33031d0d30331fa4030ed44f80721830af94130f8075003a17ff83b028210bbf81e007ff837a08010fb02c8801001cb0558cf1670fa027001cb6ac98306fb0072fb0688fb0488ed5402020000dc6a1953"}


================================================
FILE: build/print-hex.fif
URL: https://github.com/ton-community/mintless-jetton/blob/main/build/print-hex.fif
================================================
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include


"jetton-minter.fif" include
."jetton-minter hash:" cr
dup hashB dup Bx. cr drop
."jetton-minter code:" cr
boc>B dup Bx. cr


"jetton-wallet.fif" include
."jetton-wallet hash:" cr
dup hashB dup Bx. cr drop
."jetton-wallet code:" cr
boc>B dup Bx. cr




================================================
FILE: compile.sh
URL: https://github.com/ton-community/mintless-jetton/blob/main/compile.sh
================================================
func -PA -o ./build/jetton-wallet.fif contracts/jetton-wallet.fc
func -PA -o ./build/jetton-minter.fif contracts/jetton-minter.fc
fift -s build/print-hex.fif


================================================
FILE: contracts/gas.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/gas.fc
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
const JETTON_WALLET_BITS  = 1299;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS = 3;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS  = 1197;
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

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L753](L753)
const SEND_TRANSFER_GAS_CONSUMPTION    = 30766;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L762](L762)
const RECEIVE_TRANSFER_GAS_CONSUMPTION = 32480;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1032](L1032)
const SEND_BURN_GAS_CONSUMPTION    = 6148;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1033](L1033)
const RECEIVE_BURN_GAS_CONSUMPTION = 28680;


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
    forward_init_state_overhead() + ;; additional fwd fees related to initstate in iternal_transfer
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
FILE: contracts/helpers/librarian.func
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/helpers/librarian.func
================================================
;; Simple library keeper

#include "../stdlib.fc";

const int DEFAULT_DURATION = 3600 * 24 * 365 * 100; ;; 100 years, can top-up in any time
const int ONE_TON = 1000000000;

cell empty() asm "<b b> PUSHREF";

;; https://docs.ton.org/tvm.pdf, page 138, SETLIBCODE
() set_lib_code(cell code, int mode) impure asm "SETLIBCODE";

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    slice sender = cs~load_msg_addr();


    cell lib_to_publish = get_data();

    int initial_gas = gas_consumed();
    (int order_cells, int order_bits, _) = compute_data_size(lib_to_publish, 2048);
    int size_counting_gas = gas_consumed() - initial_gas;

    int to_reserve = get_simple_compute_fee(MASTERCHAIN, size_counting_gas) +
                     get_storage_fee(MASTERCHAIN, DEFAULT_DURATION, order_bits, order_cells);
    raw_reserve(to_reserve, RESERVE_BOUNCE_ON_ACTION_FAIL);
    cell msg = begin_cell()
            .store_msg_flags_and_address_none(NON_BOUNCEABLE)
            .store_slice(sender)
            .store_coins(0)
            .store_prefix_only_body()
            .end_cell();
    send_raw_message(msg, SEND_MODE_CARRY_ALL_BALANCE);
    ;; https://docs.ton.org/tvm.pdf, page 138, SETLIBCODE
    set_lib_code(lib_to_publish, 2);  ;; if x = 2, the library is added as a public library (and becomes available to all smart contracts if the current smart contract resides in the masterchain);
    ;; brick contract
    set_code(empty());
    set_data(empty());
}



================================================
FILE: contracts/jetton-minter.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/jetton-minter.fc
================================================
;; Jetton minter smart contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

global int merkle_root;
;; storage#_ total_supply:Coins admin_address:MsgAddress next_admin_address:MsgAddress jetton_wallet_code:^Cell metadata_uri:^Cell = Storage;
(int, slice, slice, cell, cell) load_data() impure inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_coins(), ;; total_supply
        ds~load_msg_addr(), ;; admin_address
        ds~load_msg_addr(), ;; next_admin_address
        ds~load_ref(),  ;; jetton_wallet_code
        ds~load_ref()  ;; metadata url (contains snake slice without 0x0 prefix)
    );
    merkle_root = ds~load_uint(MERKLE_ROOT_SIZE);
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
        .store_uint(merkle_root, MERKLE_ROOT_SIZE)
        .end_cell()
    );
}

() send_to_jetton_wallet(slice to_address, cell jetton_wallet_code, int ton_amount, cell master_msg, int need_state_init) impure inline {
    raw_reserve(ONE_TON, RESERVE_REGULAR); ;; reserve for storage fees

    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code, merkle_root);
    builder to_wallet_address = calculate_jetton_wallet_address(state_init);

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    var msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_builder(to_wallet_address) ;; dest
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

    if (msg_flags & 1) { ;; is bounced
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
            equal_slices_bits(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code, merkle_root), sender_address)
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
            msg = msg.store_slice(calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code, merkle_root));
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

    if (op == op::drop_admin) { ;; copy from notcoin
        throw_unless(error::not_owner, equal_slices_bits(sender_address, admin_address));
        in_msg_body.end_parse();
        save_data(total_supply, address_none(), address_none(), jetton_wallet_code, metadata_uri);
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
    return create_token_onchain_metadata(content_dict);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return (total_supply, TRUE, admin_address, build_content_cell(metadata_uri.begin_parse()), jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code, merkle_root);
}

(cell, int) get_wallet_state_init_and_salt(slice owner_address) method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    [cell state_init, int salt] = calculate_jetton_wallet_properties_cheap(owner_address, my_address(), jetton_wallet_code, merkle_root);
    return (state_init, salt);
}


slice get_next_admin_address() method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return next_admin_address;
}

int get_mintless_airdrop_hashmap_root() method_id {
    load_data();
    return merkle_root;
}



================================================
FILE: contracts/jetton-utils.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/jetton-utils.fc
================================================
#include "stdlib.fc";
#include "workchain.fc";

const int STATUS_SIZE = 4;
const int MERKLE_ROOT_SIZE = 256;
const int SALT_SIZE = 10; ;; if changed, update calculate_jetton_wallet_data_hash_cheap and pack_jetton_wallet_data_hash_base (data bits size and padding)
const int ITERATION_NUM = 32; ;; should be less than 2^SALT_SIZE-1

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address, int merkle_root, int salt) inline {
    ;; Note that for
    return begin_cell()
    .store_uint(status, STATUS_SIZE)
    .store_coins(balance)
    .store_slice(owner_address)
    .store_slice(jetton_master_address)
    .store_uint(merkle_root, MERKLE_ROOT_SIZE)
    .store_uint(salt, SALT_SIZE)
    .end_cell();
}

int hash_sha256(builder b) asm "1 PUSHINT HASHEXT_SHA256";

;; Trick for gas saving originally created by @NickNekilov
int calculate_account_hash_cheap(int code_hash, int code_depth, int data_hash, int data_depth) inline {
    return begin_cell()
        ;; refs_descriptor:bits8 bits_descriptor:bits8
        .store_uint(
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 2 refs (code+data), non-exotic, zero mask
            (2 << 16) |
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 5 bit of data, bits_descriptor = 0 + 1 = 1
            (1 << 8) |
            ;; data: actual data: (split_depth, special,code, data, library) and also 3 bit for ceil number of bits
            ;; [0b00110] + [0b100]
            0x34,
            24
        )
        ;;depth descriptors
        .store_uint(code_depth, 16)
        .store_uint(data_depth, 16)
        ;; ref hashes
        .store_uint(code_hash, 256)
        .store_uint(data_hash, 256)
        .hash_sha256();
}

builder calculate_account_hash_base_slice(int code_hash, int code_depth, int data_depth) inline {
    return begin_cell()
    ;; refs_descriptor:bits8 bits_descriptor:bits8
        .store_uint(
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 2 refs (code+data), non-exotic, zero mask
            (2 << 16) |
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 5 bit of data, bits_descriptor = 0 + 1 = 1
            (1 << 8) |
            ;; data: actual data: (split_depth, special,code, data, library) and also 3 bit for ceil number of bits
            ;; [0b00110] + [0b100]
            0x34,
            24
        )
    ;;depth descriptors
        .store_uint(code_depth, 16)
        .store_uint(data_depth, 16)
    ;; ref hashes
        .store_uint(code_hash, 256);
}

int calculate_account_hash_cheap_with_base_builder(builder base_builder, int data_hash) inline {
    return base_builder
           .store_uint(data_hash, 256)
           .hash_sha256();
}

builder calculate_jetton_wallet_address(cell state_init) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}
    return begin_cell()
        .store_uint(4, 3) ;; 0b100 = addr_std$10 tag; No anycast
        .store_int(MY_WORKCHAIN, 8)
        .store_uint(cell_hash(state_init), 256);
}

builder pack_jetton_wallet_data_builder_base(int status, int balance, slice owner_address, slice jetton_master_address, int merkle_root) inline {
    return begin_cell()
        .store_uint(status, 4)
        .store_coins(balance)
        .store_slice(owner_address)
        .store_slice(jetton_master_address)
        .store_uint(merkle_root, 256);
}

builder pack_jetton_wallet_data_hash_base(builder wallet_data_base) inline {
    return begin_cell()
    ;; refs_descriptor:bits8 bits_descriptor:bits8
        .store_uint(
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 0 refs , non-exotic, zero mask
            ;;0 |
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 4+4+267+267+256+10 = 808 bit of data, bits_descriptor = 101 + 101 = 202
            202,
            16
        )
    ;;depth descriptors
        .store_builder(wallet_data_base);
}

int calculate_jetton_wallet_data_hash_cheap(builder base, int salt) inline {
    return base
           ;; salt 10 bits, no trailing bits needed
           .store_uint(salt, SALT_SIZE)
           .hash_sha256();
}

cell calculate_jetton_wallet_state_init_internal(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root, int salt) inline {
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
                jetton_master_address,
                merkle_root,
                salt)
        )
        .store_uint(0, 1) ;; Empty libraries
        .end_cell();
}

[cell, int] calculate_jetton_wallet_properties_cheap(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    int stop = false;
    int min_distance = 0xffff;
    int salt = -1;
    int min_salt = 0;
    (_, int owner_prefix) = parse_std_addr(owner_address);
    owner_prefix = owner_prefix >> (256 - 4);
    builder jetton_wallet_data_base = pack_jetton_wallet_data_builder_base(0, 0, owner_address, jetton_master_address, merkle_root);
    builder jetton_wallet_data_hash_base = pack_jetton_wallet_data_hash_base(jetton_wallet_data_base);
    builder jetton_wallet_account_hash_base = calculate_account_hash_base_slice(cell_hash(jetton_wallet_code), cell_depth(jetton_wallet_code), 0);

    do {
        salt += 1;
        int data_hash = calculate_jetton_wallet_data_hash_cheap(jetton_wallet_data_hash_base, salt);
        int account_hash = calculate_account_hash_cheap_with_base_builder(jetton_wallet_account_hash_base, data_hash);
        int wallet_prefix = account_hash >> (256 - 4);
        int distance = wallet_prefix ^ owner_prefix;
        if (distance < min_distance) {
            min_distance = distance;
            min_salt = salt;
        }
        stop = (salt == ITERATION_NUM) | (min_distance == 0);
    } until (stop);
    cell state_init = begin_cell()
        .store_uint(0, 2) ;; 0b00 - No split_depth; No special
        .store_maybe_ref(jetton_wallet_code)
        .store_maybe_ref(jetton_wallet_data_base.store_uint(min_salt, SALT_SIZE).end_cell())
        .store_uint(0, 1) ;; Empty libraries
        .end_cell();
    return [state_init, min_salt];
}

[cell, int] calculate_jetton_wallet_properties(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    int stop = false;
    int min_distance = 0xffff;
    int salt = -1;
    int min_salt = 0;
    cell state_init = null();
    cell min_state_init = null();
    (_, int owner_prefix) = parse_std_addr(owner_address);
    owner_prefix = owner_prefix >> (256 - 4);

    do {
        salt += 1;
        state_init = calculate_jetton_wallet_state_init_internal(owner_address, jetton_master_address, jetton_wallet_code, merkle_root, salt);
        int wallet_prefix = cell_hash(state_init) >> (256 - 4);
        int distance = wallet_prefix ^ owner_prefix;
        if (distance < min_distance) {
            min_distance = distance;
            min_salt = salt;
            min_state_init = state_init;
        }
        stop = (salt == ITERATION_NUM) | (min_distance == 0);
    } until (stop);
    return [min_state_init, min_salt];
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    [cell state_init, int salt] = calculate_jetton_wallet_properties_cheap(owner_address, jetton_master_address, jetton_wallet_code, merkle_root);
    return state_init;
}


slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code, merkle_root))
           .end_cell().begin_parse();
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
FILE: contracts/jetton-wallet.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/jetton-wallet.fc
================================================
;; Jetton Wallet Smart Contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";
#include "proofs.fc";

{-
  Storage

  Status == 0: airdrop not claimed
         == 1: airdrop is claimed

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt
            merkle_root:uint256 = Storage;
-}

global int merkle_root;
global int salt;

(int, int, slice, slice) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_uint(STATUS_SIZE), ;; status
        ds~load_coins(), ;; balance
        ds~load_msg_addr(), ;; owner_address
        ds~load_msg_addr() ;; jetton_master_address
    );
    merkle_root = ds~load_uint(MERKLE_ROOT_SIZE);
    salt = ds~load_uint(SALT_SIZE);
    ds.end_parse();
    return data;
}

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline {
    set_data(pack_jetton_wallet_data(status, balance, owner_address, jetton_master_address, merkle_root, salt));
}

() send_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address));

    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, my_code(), merkle_root);
    builder to_wallet_address = calculate_jetton_wallet_address(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    cell custom_payload = in_msg_body~load_maybe_ref();
    int mode = SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL;
    ifnot(custom_payload.null?()) {
        slice cps = custom_payload.begin_parse();
        int cp_op = cps~load_op();
        throw_unless(error::unknown_custom_payload, cp_op == op::merkle_airdrop_claim);
        throw_if(error::airdrop_already_claimed, status);
        cell airdrop_proof = cps~load_ref();
        (int airdrop_amount, int start_from, int expired_at) = get_airdrop_params(airdrop_proof, merkle_root, owner_address);
        int time = now();
        throw_unless(error::airdrop_not_ready, time >= start_from);
        throw_unless(error::airdrop_finished, time <= expired_at);
        balance += airdrop_amount;
        status |= 1;

        ;; first outgoing transfer can be from just deployed jetton wallet
        ;; in this case we need to reserve TON for storage
        int to_leave_on_balance = my_ton_balance - msg_value + my_storage_due();
        int to_reserve = max(to_leave_on_balance, calculate_jetton_wallet_min_storage_fee());
        raw_reserve(to_reserve, RESERVE_REGULAR | RESERVE_BOUNCE_ON_ACTION_FAIL);
        int actual_withheld = to_leave_on_balance - to_reserve;
        mode = SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_BOUNCE_ON_ACTION_FAIL;

        ;; custom payload processing is not constant gas, account for that via gas_consumed()
        msg_value -= get_compute_fee(MY_WORKCHAIN, gas_consumed()) + actual_withheld;
    }
    int forward_ton_amount = in_msg_body~load_coins();
    check_either_forward_payload(in_msg_body);
    slice either_forward_payload = in_msg_body;

    balance -= jetton_amount;
    throw_unless(error::balance_error, balance >= 0);

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
    .store_builder(to_wallet_address)
    .store_coins(0)
    .store_statinit_ref_and_body_ref(state_init, msg_body)
    .end_cell();

    check_amount_is_enough_to_transfer(msg_value , forward_ton_amount, fwd_fee);

    send_raw_message(msg, mode);

    save_data(status, balance, owner_address, jetton_master_address);
}

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    int valid_address = equal_slices_bits(jetton_master_address, sender_address);
    ifnot(valid_address) {
        valid_address = equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, my_code(), merkle_root), sender_address);
    }
    throw_unless(error::not_valid_wallet, valid_address );
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
    int is_from_owner = equal_slices_bits(owner_address, sender_address);
    throw_unless(error::not_owner, is_from_owner);
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
    if (msg_flags & 1) { ;; is bounced
        on_bounce(in_msg_body);
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();
    int fwd_fee_from_in_msg = in_msg_full_slice~retrieve_fwd_fee();
    int fwd_fee = get_original_fwd_fee(MY_WORKCHAIN, fwd_fee_from_in_msg); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_op();

    ;; outgoing transfer
    if (op == op::transfer) {
        send_jettons(in_msg_body, sender_address, my_ton_balance, msg_value, fwd_fee);
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
    (_, int balance, slice owner_address, slice jetton_master_address) = load_data();
    return (balance, owner_address, jetton_master_address, my_code());
}

int get_status() method_id {
    (int status, _, _, _) = load_data();
    return status;
}

int is_claimed() method_id {
    (int status, _, _, _) = load_data();
    return status;
}



================================================
FILE: contracts/jetton.tlb
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/jetton.tlb
================================================
hhhhhhhhhhhhhhhhhhhhhhhh//=======================================================================
// BASIC
// https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb

bool_false$0 = Bool;
bool_true$1 = Bool;

nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;


left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;

addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 9) external_address:(bits len)
             = MsgAddressExt;
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast)
   workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
   workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
_ _:MsgAddressInt = MsgAddress;
_ _:MsgAddressExt = MsgAddress;

var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
         = VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8))
        = VarInteger n;
nanograms$_ amount:(VarUInteger 16) = Grams;

_ grams:Grams = Coins;


//=======================================================================
// TEP - 74
// https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md

transfer#0f8a7ea5
  query_id:uint64
  amount:Coins
  destination:MsgAddress
  response_destination:MsgAddress
  custom_payload:(Maybe ^Cell)
  forward_ton_amount:Coins
  forward_payload:(Either Cell ^Cell)
  = JettonMsg;

burn#595f07bc
  query_id:uint64
  amount:Coins
  response_destination:MsgAddress
  custom_payload:(Maybe ^Cell)
  = JettonMsg;

transfer_notification#7362d09c
  query_id:uint64
  amount:Coins
  sender:MsgAddress
  forward_payload:(Either Cell ^Cell)
  = JettonOutMsg;

excesses#d53276db query_id:uint64 = InternalMsgBody;


internal_transfer#178d4519
  query_id:uint64
  amount:Coins
  from:MsgAddress
  response_address:MsgAddress
  forward_ton_amount:Coins
  forward_payload:(Either Cell ^Cell)
  = JettonInternalTransfer;

burn_notification#7bdd97de
  query_id:uint64
  amount:Coins
  sender:MsgAddress
  response_destination:MsgAddress
  = JettonMinterMsg;

_ _:JettonMsg = InternalMsgBody;
_ _:JettonOutMsg = InternalMsgBody;
_ _:JettonInternalTransfer = InternalMsgBody;

//=======================================================================
// TEP - 89
// https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

provide_wallet_address#2c76b973
  query_id:uint64
  owner_address:MsgAddress
  include_address:Bool
  = JettonMinterMsg;

take_wallet_address#d1735400
  query_id:uint64
  wallet_address:MsgAddress
  owner_address:(Maybe ^MsgAddress)
  = JettonMinterOutMsg;


_ _:JettonMinterMsg = InternalMsgBody;
_ _:JettonMinterOutMsg = InternalMsgBody;

//=======================================================================
// Stable

top_up#d372158c
  query_id:uint64
  = InternalMsgBody;

set_status#eed236d3
  query_id:uint64
  status:uint4
  = JettonMsg;

mint#642b7d07
  query_id:uint64
  to_address:MsgAddressInt
  ton_amount:Coins
  master_msg:^JettonInternalTransfer
  = JettonMinterMsg;

change_admin#6501f354
  query_id:uint64
  new_admin_address:MsgAddress
  = JettonMinterMsg;

drop_admin#7431f221
  query_id:uint64
  = DropAdminMsg;

claim_admin#fb88e119
  query_id:uint64
  = JettonMinterMsg;

upgrade#2508d66a
  query_id:uint64
  new_data:^Cell
  new_code:^Cell
  = JettonMinterMsg;

change_metadata_uri#cb862902
  query_id:uint64
  metadata:Cell
  = JettonMinterMsg;

// Custom Payload format
merkle_airdrop_claim#0df602d6 proof:^Cell = CustomPayload;


================================================
FILE: contracts/op-codes.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/op-codes.fc
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

const op::mint = 0x642b7d07;
const op::change_admin = 0x6501f354;
const op::claim_admin = 0xfb88e119;
const op::upgrade = 0x2508d66a;
const op::change_metadata_uri = 0xcb862902;
const op::drop_admin = 0x7431f221;
const op::merkle_airdrop_claim = 0x0df602d6; ;; TODO

;; jetton-wallet
const error::balance_error = 47;
const error::not_enough_gas = 48;
const error::invalid_message = 49;
const error::airdrop_already_claimed = 54;
const error::airdrop_not_ready = 55;
const error::airdrop_finished = 56;
const error::unknown_custom_payload = 57;
const error::non_canonical_address = 58;



================================================
FILE: contracts/proofs.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/proofs.fc
================================================
#include "stdlib.fc";
;; Copy from https://github.com/ton-community/compressed-nft-contract
(slice, int) begin_parse_exotic(cell x) asm "XCTOS";
(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

const int error::not_exotic = 103;
const int error::not_merkle_proof = 104;
const int error::wrong_hash = 105;
const int error::leaf_not_found = 108;
const int error::airdrop_not_found = 109;
const int cell_type::merkle_proof = 3;

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
;;https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L105
const int ADDRESS_SLICE_LENGTH = 2 + 1 + 8 + 256;
const int TIMESTAMP_SIZE = 48;

(int, int, int) get_airdrop_params(cell submitted_proof, int proof_root, slice owner) {
    cell airdrop = submitted_proof.check_merkle_proof(proof_root);
    (slice data, int found) = airdrop.dict_get?(ADDRESS_SLICE_LENGTH, owner);
    throw_unless(error::airdrop_not_found, found);
    int airdrop_amount = data~load_coins();
    int start_from = data~load_uint(TIMESTAMP_SIZE);
    int expired_at = data~load_uint(TIMESTAMP_SIZE);
    return (airdrop_amount, start_from, expired_at);
}


================================================
FILE: contracts/stdlib.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/stdlib.fc
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

;;; Checks whether the data parts of two slices coinside
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
    return msg_flags & 1 == 1;
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

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
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
FILE: contracts/test-minter.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/test-minter.fc
================================================
;; Jetton minter smart contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

global int merkle_root;
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
    merkle_root = ds~load_uint(MERKLE_ROOT_SIZE);
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
        .store_uint(merkle_root, MERKLE_ROOT_SIZE)
        .end_cell()
    );
}

() send_to_jetton_wallet(slice to_address, cell jetton_wallet_code, int ton_amount, cell master_msg, int need_state_init) impure inline {
    raw_reserve(ONE_TON, RESERVE_REGULAR); ;; reserve for storage fees

    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code, merkle_root);
    builder to_wallet_address = calculate_jetton_wallet_address(state_init);

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    var msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_builder(to_wallet_address) ;; dest
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

    if (msg_flags & 1) { ;; is bounced
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
            equal_slices_bits(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code, merkle_root), sender_address)
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
            msg = msg.store_slice(calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code, merkle_root));
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

    if (op == op::drop_admin) { ;; copy from notcoin
        throw_unless(error::not_owner, equal_slices_bits(sender_address, admin_address));
        in_msg_body.end_parse();
        save_data(total_supply, address_none(), address_none(), jetton_wallet_code, metadata_uri);
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
    return create_token_onchain_metadata(content_dict);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return (total_supply, TRUE, admin_address, build_content_cell(metadata_uri.begin_parse()), jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code, merkle_root);
}

(cell, int) get_wallet_state_init_and_salt_cheap(slice owner_address) method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    [cell state_init, int salt] = calculate_jetton_wallet_properties_cheap(owner_address, my_address(), jetton_wallet_code, merkle_root);
    return (state_init, salt);
}

(cell, int) get_wallet_state_init_and_salt(slice owner_address) method_id {
        (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
        [cell state_init, int salt] = calculate_jetton_wallet_properties(owner_address, my_address(), jetton_wallet_code, merkle_root);
    return (state_init, salt);
}


slice get_next_admin_address() method_id {
    (int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) = load_data();
    return next_admin_address;
}



================================================
FILE: contracts/workchain.fc
URL: https://github.com/ton-community/mintless-jetton/blob/main/contracts/workchain.fc
================================================
#include "stdlib.fc";
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
FILE: gasUtils.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/gasUtils.ts
================================================
import { Cell, Slice, toNano, beginCell, Address, Dictionary, Message, DictionaryValue, Transaction } from '@ton/core';

export type GasPrices = {
	flat_gas_limit: bigint,
	flat_gas_price: bigint,
	gas_price: bigint;
};
export type StorageValue = {
    utime_sice: number,
    bit_price_ps: bigint,
    cell_price_ps: bigint,
    mc_bit_price_ps: bigint,
    mc_cell_price_ps: bigint
};


export type MsgPrices = ReturnType<typeof configParseMsgPrices>;
export type FullFees  = ReturnType<typeof computeFwdFeesVerbose>;

export class StorageStats {
    bits: bigint;
    cells: bigint;

    constructor(bits?: number | bigint, cells?: number | bigint) {
        this.bits  = bits  !== undefined ? BigInt(bits)  : 0n;
        this.cells = cells !== undefined ? BigInt(cells) : 0n;
    }
    add(...stats: StorageStats[]) {
        let cells = this.cells, bits = this.bits;
        for (let stat of stats) {
            bits  += stat.bits;
            cells += stat.cells;
        }
        return new StorageStats(bits, cells);
    }
    sub(...stats: StorageStats[]) {
        let cells = this.cells, bits = this.bits;
        for (let stat of stats) {
            bits  -= stat.bits;
            cells -= stat.cells;
        }
        return new StorageStats(bits, cells);
    }
    addBits(bits: number | bigint) {
        return new StorageStats(this.bits + BigInt(bits), this.cells);
    }
    subBits(bits: number | bigint) {
        return new StorageStats(this.bits - BigInt(bits), this.cells);
    }
    addCells(cells: number | bigint) {
        return new StorageStats(this.bits, this.cells + BigInt(cells));
    }
    subCells(cells: number | bigint) {
        return new StorageStats(this.bits, this.cells - BigInt(cells));
    }

    toString() : string {
        return JSON.stringify({
            bits: this.bits.toString(),
            cells: this.cells.toString()
        });
    }
}

export function computedGeneric<T extends Transaction>(transaction: T) {
    if(transaction.description.type !== "generic")
        throw("Expected generic transactionaction");
    if(transaction.description.computePhase.type !== "vm")
        throw("Compute phase expected")
    return transaction.description.computePhase;
}

export function storageGeneric<T extends Transaction>(transaction: T) {
    if(transaction.description.type !== "generic")
        throw("Expected generic transactionaction");
    const storagePhase = transaction.description.storagePhase;
    if(storagePhase  === null || storagePhase === undefined)
        throw("Storage phase expected")
    return storagePhase;
}

function shr16ceil(src: bigint) {
    let rem = src % BigInt(65536);
    let res = src / 65536n; // >> BigInt(16);
    if (rem != BigInt(0)) {
        res += BigInt(1);
    }
    return res;
}

export function collectCellStats(cell: Cell, visited:Array<string>, skipRoot: boolean = false): StorageStats {
    let bits  = skipRoot ? 0n : BigInt(cell.bits.length);
    let cells = skipRoot ? 0n : 1n;
    let hash = cell.hash().toString();
    if (visited.includes(hash)) {
        // We should not account for current cell data if visited
        return new StorageStats();
    }
    else {
        visited.push(hash);
    }
    for (let ref of cell.refs) {
        let r = collectCellStats(ref, visited);
        cells += r.cells;
        bits += r.bits;
    }
    return new StorageStats(bits, cells);
}

export function getGasPrices(configRaw: Cell, workchain: 0 | -1): GasPrices {
  const config = configRaw.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());

	const ds = config.get(21 + workchain)!.beginParse();
	if(ds.loadUint(8) !== 0xd1) {
			throw new Error("Invalid flat gas prices tag!");
	}

	const flat_gas_limit = ds.loadUintBig(64);
	const flat_gas_price = ds.loadUintBig(64);

	if(ds.loadUint(8) !== 0xde) {
			throw new Error("Invalid gas prices tag!");
	}
	return {
		flat_gas_limit,
		flat_gas_price,
		gas_price: ds.preloadUintBig(64)
	};
}

export function setGasPrice(configRaw: Cell, prices: GasPrices, workchain: 0 | -1) : Cell {
  const config = configRaw.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());
  const idx    = 21 + workchain;
	const ds = config.get(idx)!;
	const tail = ds.beginParse().skip(8 + 64 + 64 + 8 + 64);

	const newPrices = beginCell().storeUint(0xd1, 8)
										.storeUint(prices.flat_gas_limit, 64)
										.storeUint(prices.flat_gas_price, 64)
										.storeUint(0xde, 8)
										.storeUint(prices.gas_price, 64)
										.storeSlice(tail)
			      			.endCell();
    config.set(idx, newPrices);

    return beginCell().storeDictDirect(config).endCell();
}

export const storageValue : DictionaryValue<StorageValue> =  {
        serialize: (src, builder) => {
            builder.storeUint(0xcc, 8)
                   .storeUint(src.utime_sice, 32)
                   .storeUint(src.bit_price_ps, 64)
                   .storeUint(src.cell_price_ps, 64)
                   .storeUint(src.mc_bit_price_ps, 64)
                   .storeUint(src.mc_cell_price_ps, 64)
        },
        parse: (src) => {
            return {
                utime_sice: src.skip(8).loadUint(32),
                bit_price_ps: src.loadUintBig(64),
                cell_price_ps: src.loadUintBig(64),
                mc_bit_price_ps: src.loadUintBig(64),
                mc_cell_price_ps: src.loadUintBig(64)
            };
        }
    };

export function getStoragePrices(configRaw: Cell) {
    const config = configRaw.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());
    const storageData = Dictionary.loadDirect(Dictionary.Keys.Uint(32),storageValue, config.get(18)!);
    const values      = storageData.values();

    return values[values.length - 1];
}
export function calcStorageFee(prices: StorageValue, stats: StorageStats, duration: bigint) {
    return shr16ceil((stats.bits * prices.bit_price_ps + stats.cells * prices.cell_price_ps) * duration) 
}
export function setStoragePrices(configRaw: Cell, prices: StorageValue) {
    const config = configRaw.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());
    const storageData = Dictionary.loadDirect(Dictionary.Keys.Uint(32),storageValue, config.get(18)!);
    storageData.set(storageData.values().length - 1, prices);
    config.set(18, beginCell().storeDictDirect(storageData).endCell());
    return beginCell().storeDictDirect(config).endCell();
}

export function computeGasFee(prices: GasPrices, gas: bigint): bigint {
    if(gas <= prices.flat_gas_limit) {
        return prices.flat_gas_price;
    }
    return prices.flat_gas_price + prices.gas_price * (gas - prices.flat_gas_limit) / 65536n
}

export function computeDefaultForwardFee(msgPrices: MsgPrices) {
    return msgPrices.lumpPrice - ((msgPrices.lumpPrice * msgPrices.firstFrac) >> BigInt(16));
}

export function computeCellForwardFees(msgPrices: MsgPrices, msg: Cell) {
    let storageStats = collectCellStats(msg, [], true);
    return computeFwdFees(msgPrices, storageStats.cells, storageStats.bits);
}
export function computeMessageForwardFees(msgPrices: MsgPrices, msg: Message)  {
    // let msg = loadMessageRelaxed(cell.beginParse());
    let storageStats = new StorageStats();

    if( msg.info.type !== "internal") {
        throw Error("Helper intended for internal messages");
    }
    const defaultFwd = computeDefaultForwardFee(msgPrices);
    // If message forward fee matches default than msg cell is flat
    if(msg.info.forwardFee == defaultFwd) {
        return {fees: msgPrices.lumpPrice, res : defaultFwd, remaining: defaultFwd, stats: storageStats};
    }
    let visited : Array<string> = [];
    // Init
    if (msg.init) {
        let addBits  = 5n; // Minimal additional bits
        let refCount = 0;
        if(msg.init.splitDepth) {
            addBits += 5n;
        }
        if(msg.init.libraries) {
            refCount++;
            storageStats = storageStats.add(collectCellStats(beginCell().storeDictDirect(msg.init.libraries).endCell(), visited, true));
        }
        if(msg.init.code) {
            refCount++;
            storageStats = storageStats.add(collectCellStats(msg.init.code, visited))
        }
        if(msg.init.data) {
            refCount++;
            storageStats = storageStats.add(collectCellStats(msg.init.data, visited));
        }
        if(refCount >= 2) { //https://github.com/ton-blockchain/ton/blob/51baec48a02e5ba0106b0565410d2c2fd4665157/crypto/block/transaction.cpp#L2079
            storageStats.cells++;
            storageStats.bits += addBits;
        }
    }
    const lumpBits  = BigInt(msg.body.bits.length);
    const bodyStats = collectCellStats(msg.body,visited, true);
    storageStats = storageStats.add(bodyStats);

    // NOTE: Extra currencies are ignored for now
    let fees = computeFwdFeesVerbose(msgPrices, BigInt(storageStats.cells), BigInt(storageStats.bits));
    // Meeh
    if(fees.remaining < msg.info.forwardFee) {
        // console.log(`Remaining ${fees.remaining} < ${msg.info.forwardFee} lump bits:${lumpBits}`);
        storageStats = storageStats.addCells(1).addBits(lumpBits);
        fees = computeFwdFeesVerbose(msgPrices, storageStats.cells, storageStats.bits);
    }
    if(fees.remaining != msg.info.forwardFee) {
        console.log("Result fees:", fees);
        console.log(msg);
        console.log(fees.remaining);
        throw(new Error("Something went wrong in fee calcuation!"));
    }
    return {fees, stats: storageStats};
}

export const configParseMsgPrices = (sc: Slice) => {

    let magic = sc.loadUint(8);

    if(magic != 0xea) {
        throw Error("Invalid message prices magic number!");
    }
    return {
        lumpPrice:sc.loadUintBig(64),
        bitPrice: sc.loadUintBig(64),
        cellPrice: sc.loadUintBig(64),
        ihrPriceFactor: sc.loadUintBig(32),
        firstFrac: sc.loadUintBig(16),
        nextFrac:  sc.loadUintBig(16)
    };
}

export const setMsgPrices = (configRaw: Cell, prices: MsgPrices, workchain: 0 | -1) => {
    const config = configRaw.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());

    const priceCell = beginCell().storeUint(0xea, 8)
                      .storeUint(prices.lumpPrice, 64)
                      .storeUint(prices.bitPrice, 64)
                      .storeUint(prices.cellPrice, 64)
                      .storeUint(prices.ihrPriceFactor, 32)
                      .storeUint(prices.firstFrac, 16)
                      .storeUint(prices.nextFrac, 16)
                     .endCell();
    config.set(25 + workchain, priceCell);

    return beginCell().storeDictDirect(config).endCell();
}

export const getMsgPrices = (configRaw: Cell, workchain: 0 | -1 ) => {

    const config = configRaw.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());

    const prices = config.get(25 + workchain);

    if(prices === undefined) {
        throw Error("No prices defined in config");
    }

    return configParseMsgPrices(prices.beginParse());
}

export function computeFwdFees(msgPrices: MsgPrices, cells: bigint, bits: bigint) {
    return msgPrices.lumpPrice + (shr16ceil((msgPrices.bitPrice * bits)
         + (msgPrices.cellPrice * cells))
    );
}

export function computeFwdFeesVerbose(msgPrices: MsgPrices, cells: bigint | number, bits: bigint | number) {
    const fees = computeFwdFees(msgPrices, BigInt(cells), BigInt(bits));

    const res = (fees * msgPrices.firstFrac) >> 16n;
    return {
        total: fees,
        res,
        remaining: fees - res
    }
}



================================================
FILE: jest.config.js
URL: https://github.com/ton-community/mintless-jetton/blob/main/jest.config.js
================================================
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
};



================================================
FILE: package.json
URL: https://github.com/ton-community/mintless-jetton/blob/main/package.json
================================================
{
    "name": "ton-stable",
    "description": "",
    "version": "0.1.0",
    "scripts": {
        "build": "npx blueprint build",
        "test": "jest",
        "deploy": "npx blueprint run",
        "prettier": "npx prettier --write '{test,contracts,build}/**/*.{ts,js,json}'"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.15.0",
        "@ton/core": "^0.56.0",
        "@ton/crypto": "^3.2.0",
        "@ton/sandbox": "0.16.0-tvmbeta.3",
        "@ton/test-utils": "^0.4.2",
        "@ton/ton": "^14.0.0",
        "@types/jest": "^29.5.4",
        "@types/node": "^20.14.13",
        "dotenv": "^16.0.0",
        "jest": "^29.6.3",
        "prettier": "^2.8.6",
        "ts-jest": "^29.0.5",
        "ts-node": "^10.9.2",
        "typescript": "^4.9.5"
    },
    "overrides": {
        "@ton-community/func-js-bin": "0.4.5-tvmbeta.3",
        "@ton-community/func-js": "0.6.3-tvmbeta.3",
        "@ton-community/sandbox": "0.16.0-tvmbeta.3"
    },
    "prettier": {
        "printWidth": 180
    },
    "mocha": {
        "require": [
            "chai",
            "ts-node/register"
        ],
        "timeout": 20000
    },
    "engines": {
        "node": ">=16.0.0"
    },
    "dependencies": {
        "@types/express": "^4.17.21",
        "express": "^4.19.2"
    }
}



================================================
FILE: sandbox_tests/Claim.spec.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/sandbox_tests/Claim.spec.ts
================================================
import { Address, beginCell, BitBuilder, Cell, Dictionary, DictionaryValue, exoticMerkleProof, exoticPruned, fromNano, storeMessage, toNano } from '@ton/core';
import { compile } from '@ton/blueprint';
import { Blockchain, BlockchainSnapshot, EmulationError, SandboxContract, TreasuryContract, internal } from '@ton/sandbox';
import '@ton/test-utils';
import {jettonContentToCell, JettonMinter} from '../wrappers/JettonMinter';
import { JettonWallet, jettonWalletConfigToCell } from '../wrappers/JettonWallet';
import { buff2bigint, getRandomInt, getRandomTon, randomAddress, testJettonInternalTransfer } from './utils';
import { Errors, Op } from '../wrappers/JettonConstants';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { calcStorageFee, collectCellStats, computedGeneric, computeFwdFeesVerbose, computeGasFee, getMsgPrices, getStoragePrices, StorageStats } from '../gasUtils';
import { findTransactionRequired } from '@ton/test-utils';

type AirdropData = {
    amount: bigint,
    start_from: number,
    expire_at: number
};

const airDropValue: DictionaryValue<AirdropData> = {
    serialize: (src, builder) => {
        builder.storeCoins(src.amount);
        builder.storeUint(src.start_from, 48);
        builder.storeUint(src.expire_at, 48);
    },
    parse: (src) => {
        return {
            amount: src.loadCoins(),
            start_from: src.loadUint(48),
            expire_at: src.loadUint(48)
        }
    }
}

function convertToMerkleProof(c: Cell): Cell {
    return beginCell()
        .storeUint(3, 8)
        .storeBuffer(c.hash(0))
        .storeUint(c.depth(0), 16)
        .storeRef(c)
        .endCell({ exotic: true });
}

function convertToMerkleUpdate(c1: Cell, c2: Cell): Cell {
    return beginCell()
        .storeUint(4, 8)
        .storeBuffer(c1.hash(0))
        .storeBuffer(c2.hash(0))
        .storeUint(c1.depth(0), 16)
        .storeUint(c2.depth(0), 16)
        .storeRef(c1)
        .storeRef(c2)
        .endCell({ exotic: true });
}

function convertToPrunedBranch(c: Cell): Cell {
    return beginCell()
        .storeUint(1, 8)
        .storeUint(1, 8)
        .storeBuffer(c.hash(0))
        .storeUint(c.depth(0), 16)
        .endCell({ exotic: true });
}

describe('Claim tests', () => {
    const AIRDROP_START = 1000;
    const AIRDROP_END   = 2000;

    let wallet_code: Cell;
    let minter_code: Cell;

    let blockchain: Blockchain;
    let initialState: BlockchainSnapshot;
    let claimedAlready: BlockchainSnapshot;
    let merkleRoot: bigint;
    let defaultContent: Cell;
    let cMaster: SandboxContract<JettonMinter>;
    let airdropData: Dictionary<Address, AirdropData>;
    let airdropCell: Cell;
    let deployer: SandboxContract<TreasuryContract>;
    let testReceiver: SandboxContract<TreasuryContract>;

    let receiverProof: Cell;

    let userWallet: (address: Address, root?: bigint) => Promise<SandboxContract<JettonWallet>>;
    let getContractData:(address: Address) => Promise<Cell>;
    let minStorage: bigint;
    // Minimal transfer cost no claim
    const minimalTransfer = toNano('0.074989413');
    // Transfer compute phase gas
    const transferNoClaim = 30766n;

    beforeAll(async () => {
        wallet_code = await compile('JettonWallet');
        minter_code = await compile('JettonMinter');

        blockchain = await Blockchain.create();
        blockchain.now = 1;
        deployer     = await blockchain.treasury('deployer');
        testReceiver = await blockchain.treasury('receiver');
        airdropData = Dictionary.empty(Dictionary.Keys.Address(), airDropValue);

        const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
        _libs.set(BigInt(`0x${wallet_code.hash().toString('hex')}`), wallet_code);
        const libs = beginCell().storeDictDirect(_libs).endCell();
        blockchain.libs = libs;
        let lib_prep = beginCell().storeUint(2,8).storeBuffer(wallet_code.hash()).endCell();
        const jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
        //
        // const others = await blockchain.createWallets(10);

        airdropData.set(testReceiver.address, {
            amount: toNano('100'),
            expire_at: AIRDROP_END,
            start_from: AIRDROP_START
        });

        /*
        for(let otherWallet of others) {
            airdropData.set(otherWallet.address, {
                amount: toNano('100'),
                expire_at: AIRDROP_END,
                start_from: AIRDROP_START
            });
        }
        */

        airdropCell   = beginCell().storeDictDirect(airdropData).endCell();
        merkleRoot    = buff2bigint(airdropCell.hash(0));
        receiverProof = airdropData.generateMerkleProof(testReceiver.address);


        defaultContent = jettonContentToCell({
                uri: 'https://some_jetton.com/meta.json'
        })
        cMaster = blockchain.openContract(JettonMinter.createFromConfig({
            admin: deployer.address,
            wallet_code,
            merkle_root: merkleRoot,
            jetton_content: defaultContent
        }, minter_code));

        const masterDeploy = await cMaster.sendDeploy(deployer.getSender(), toNano('1000'));
        expect(masterDeploy.transactions).toHaveTransaction({
            on: cMaster.address,
            from: deployer.address,
            aborted: false,
            deploy: true
        });

        blockchain.now = AIRDROP_START;

        initialState = blockchain.snapshot();

        userWallet = async (address:Address, root?: bigint) => {
           let userMinter: SandboxContract<JettonMinter>;
           if(root) {
               userMinter = blockchain.openContract(
                   JettonMinter.createFromConfig({
                       admin: deployer.address,
                       jetton_content: defaultContent,
                       wallet_code,
                       merkle_root: root
                   }, minter_code)
               );
               const smc = await blockchain.getContract(userMinter.address);
               if(smc.accountState == undefined || smc.accountState.type !== 'active') {
                   await userMinter.sendDeploy(deployer.getSender(), toNano('100'));
               }
           }
           else {
               userMinter = cMaster;
           }
           const newWallet = JettonWallet.createFromConfig({
               ownerAddress: address,
               jettonMasterAddress: userMinter.address,
               merkleRoot: root ?? merkleRoot,
               salt: await userMinter.getWalletSalt(address)
           }, wallet_code);
           return blockchain.openContract(newWallet);
       }
       getContractData = async (address: Address) => {
         const smc = await blockchain.getContract(address);
         if(!smc.account.account)
           throw new Error("Account not found")
         if(smc.account.account.storage.state.type != "active" )
           throw new Error("Atempting to get data on inactive account");
         if(!smc.account.account.storage.state.state.data)
           throw new Error("Data is not present");
         return smc.account.account.storage.state.state.data
       }
    });
    beforeEach(async () => {
        // Roll back the blockchain and airdrop state
        await blockchain.loadFrom(initialState)
        airdropData = airdropCell.beginParse().loadDictDirect(Dictionary.Keys.Address(), airDropValue);
    });

    it('should claim and transfer', async () => {
        const testJetton   = await userWallet(testReceiver.address);
        const claimPayload = JettonWallet.claimPayload(receiverProof);
        const userData     = airdropData.get(testReceiver.address)!;
        const transferAmount = getRandomTon(1, 99);

        const smc = await blockchain.getContract(testJetton.address);
        expect(smc.balance).toBe(0n);
        const res = await testJetton.sendTransfer(testReceiver.getSender(), toNano('1'),
                                                  transferAmount, deployer.address,
                                                  testReceiver.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            aborted: false,
            deploy: true
        });
        const deployerJetton = await userWallet(deployer.address);
        expect(res.transactions).toHaveTransaction({
            on: deployerJetton.address,
            from: testJetton.address,
            op: Op.internal_transfer,
            body: (b) => testJettonInternalTransfer(b!, {
                amount: transferAmount,
                from: testReceiver.address
            }),
            success: true
        });
            

        const storagePrices  = getStoragePrices(blockchain.config);
        const storageStats = new StorageStats(1299, 3);
        minStorage   = calcStorageFee(storagePrices, storageStats, BigInt(5 * 365 * 24 * 3600));

        expect(smc.balance).toEqual(minStorage);
        expect(await deployerJetton.getJettonBalance()).toEqual(transferAmount);
        expect(await testJetton.getJettonBalance()).toEqual(userData.amount - transferAmount);
        
        claimedAlready = blockchain.snapshot();
    });
    it('should not allow to claim twice', async () => {
        await blockchain.loadFrom(claimedAlready);

        const claimPayload = JettonWallet.claimPayload(receiverProof);
        const testJetton = await userWallet(testReceiver.address);
        const totalBalance = await testJetton.getJettonBalance();

        const dataBefore = await getContractData(testJetton.address);

        const res = await testJetton.sendTransfer(testReceiver.getSender(), toNano('1'),
                                                  totalBalance, deployer.address,
                                                  deployer.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            from: testReceiver.address,
            op:Op.transfer,
            success: false,
            aborted: true,
            exitCode: Errors.airdrop_already_claimed
        });

        expect(await getContractData(testJetton.address)).toEqualCell(dataBefore);
    });
    it('should accept only known custom payload', async () => {
        const testJetton = await userWallet(testReceiver.address);
        let randomOp: number;

        do {

            randomOp = getRandomInt(0, (1 << 32) - 1);

        } while(randomOp == Op.airdrop_claim);

        const ops = [Op.transfer, Op.burn, randomOp]

        for(let testOp of ops) {
            const claimPayload = beginCell().storeUint(testOp, 32).storeRef(receiverProof).endCell();
            const res = await testJetton.sendTransfer(testReceiver.getSender(), toNano('1'),
                                                      1n, deployer.address,
                                                      deployer.address, claimPayload, 1n);
            expect(res.transactions).toHaveTransaction({
                on: testJetton.address,
                from: testReceiver.address,
                aborted: true,
                success: false,
                exitCode: Errors.unknown_custom_payload
            });
        }
    });
    it('should not allow to claim before airdrop start', async () => {
        blockchain.now = AIRDROP_START - 1;
        const claimPayload = JettonWallet.claimPayload(receiverProof);
        const testJetton = await userWallet(testReceiver.address);

        const res = await testJetton.sendTransfer(testReceiver.getSender(), toNano('1'),
                                                  1n, deployer.address,
                                                  deployer.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            from: testReceiver.address,
            op:Op.transfer,
            aborted: true,
            success: false,
            exitCode: Errors.airdrop_not_ready
        });
    });
    it('should not allow to claim airdrop after it has ended', async () => {
        blockchain.now = AIRDROP_END + 1;

        const claimPayload = JettonWallet.claimPayload(receiverProof);
        const testJetton = await userWallet(testReceiver.address);

        const res = await testJetton.sendTransfer(testReceiver.getSender(), toNano('1'),
                                                  1n, deployer.address,
                                                  deployer.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            from: testReceiver.address,
            op:Op.transfer,
            aborted: true,
            success: false,
            exitCode: Errors.airdrop_finished
        });
    });
    it('claim fee should be accounted for in transfer', async () => {
        const claimPayload = JettonWallet.claimPayload(receiverProof);
        const testJetton = await userWallet(testReceiver.address);

        // Should fail, because claim cost is not accounted in minimal fee

        let res = await testJetton.sendTransfer(testReceiver.getSender(), minimalTransfer,
                                                1n, deployer.address,
                                                deployer.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            from: testReceiver.address,
            op:Op.transfer,
            aborted: true,
            success: false,
            exitCode: Errors.not_enough_gas
        });

        res = await testJetton.sendTransfer(testReceiver.getSender(), toNano('0.12'),
                                            1n, deployer.address,
                                            deployer.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            from: testReceiver.address,
            op:Op.transfer,
            success: true,
        });
    });
    it('claim fee should stay same regardless of jetton balance', async () => {
        const testJetton = await userWallet(testReceiver.address);
        const claimPayload = JettonWallet.claimPayload(receiverProof);
        await cMaster.sendMint(deployer.getSender(),
                               testReceiver.address,
                               1n);
        expect(await testJetton.getJettonBalance()).toEqual(1n);
        await deployer.send({
            to: testJetton.address,
            bounce: false,
            value: toNano('10')
        });
        const smc = await blockchain.getContract(testJetton.address);
        expect(smc.balance).toBeGreaterThanOrEqual(toNano('10'));
        const res = await testJetton.sendTransfer(testReceiver.getSender(), toNano('0.12'),
                                            1n, deployer.address,
                                            deployer.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            from: testReceiver.address,
            op:Op.transfer,
            success: true,
        });
        // Claimed - 1n sent to deployer
        expect(await testJetton.getJettonBalance()).toEqual(toNano('100'));
    });
    it('claim fee should be dynamic based on dictionary lookup cost', async () => {
        // Let's try much larger dictionary

        /*
        for(let i = 0; i < 1000; i++) {
            airdropData.set(randomAddress(), {
                amount: toNano('100'),
                start_from: AIRDROP_START,
                expire_at: AIRDROP_END
            });
        }

        const testTree = beginCell().storeDictDirect(airdropData).endCell();
        */

        const proofString = await readFile(join('sandbox_tests','proof'), {encoding: 'utf8'});
        const parts = proofString.split(',');
        const testAddress = Address.parse(parts[0]);
        const newProof = Cell.fromBase64(parts[1]);
        console.log("New proof depth:", newProof.depth(0));
        const newRoot  = buff2bigint(newProof.refs[0].hash(0));
        console.log("New root:", newRoot.toString(16));
        const claimPayload = JettonWallet.claimPayload(newProof);

        const testJetton = await userWallet(testAddress, newRoot);
        const deployerJetton = await userWallet(deployer.address, newRoot);
        const balanceBefore  = await deployerJetton.getJettonBalance();
        const testSender = blockchain.sender(testAddress);

        const transferMessage = JettonWallet.transferMessage(1n, deployer.address,
                                                             testAddress,
                                                             claimPayload, 1n);
        const msgPrices = getMsgPrices(blockchain.config, 0);
        const outMsg = internal({
            to: testJetton.address,
            from: testAddress,
            body: transferMessage,
            value: toNano('0.12'),
            stateInit: testJetton.init
        });
        if(outMsg.info.type !== 'internal') {
            throw new Error("no way");
        }
        const packed = beginCell().store(storeMessage(outMsg)).endCell();
        const stats  = collectCellStats(packed, [], true);
        const fee    = computeFwdFeesVerbose(msgPrices, stats.cells, stats.bits);
        outMsg.info.forwardFee = fee.remaining;
        let res = await blockchain.sendMessage(outMsg);

        expect(res.transactions).toHaveTransaction({
            on: testJetton.address,
            from: testAddress,
            op:Op.transfer,
            aborted: true,
            success: false,
            exitCode: Errors.not_enough_gas
        });

        outMsg.info.value.coins = toNano('1');
        res = await blockchain.sendMessage(outMsg);

        const transferTx = findTransactionRequired(res.transactions,{
            on: testJetton.address,
            from: testAddress,
            op:Op.transfer,
            success: true,
        });
        expect(await deployerJetton.getJettonBalance()).toEqual(balanceBefore + 1n);
        const claimTransferCompute = computedGeneric(transferTx);
        /*
         * Commented, because minTransferFee is measured at max
         * const gasDelta  = claimTransferCompute.gasUsed - transferNoClaim;
         * console.log(`Transfer additional gas:${gasDelta}`);
         * console.log(`Just transfer:${minimalTransfer}`);
         */
        const excess =  findTransactionRequired(res.transactions, {
            on: testAddress,
            from: deployerJetton.address,
            op: Op.excesses
        });
        const excessMsg = excess.inMessage!;
        if(excessMsg.info.type !== 'internal') {
            throw new Error("No way");
        }
        console.log(`Claim + transfer cost:${fromNano(toNano('1') - excessMsg.info.value.coins)}`);
    });
    describe('Proofs', () => {
    it('should reject proof from different root', async () => {
        const evilDude     = await blockchain.treasury('3v1l');
        const evilJetton   = await userWallet(evilDude.address);

        airdropData.set(evilDude.address, {
            amount: toNano('1000000'),
            expire_at: 1100,
            start_from: 1000
        });

        const evilProof = airdropData.generateMerkleProof(evilDude.address);
        const claimPayload = JettonWallet.claimPayload(evilProof);

        const res = await evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                                  1n, testReceiver.address,
                                                  evilDude.address, claimPayload, 1n);
        expect(res.transactions).toHaveTransaction({
            on: evilJetton.address,
            from: evilDude.address,
            op: Op.transfer,
            aborted: true,
            exitCode: Errors.wrong_hash
        });
    });
    // This one is skipped by default, because it requires @ton/core modifications to ingore hash check at cell creation level
    it.skip('should reject fake proof', async () => {
        const evilDude     = await blockchain.treasury('3v1l');
        const evilJetton   = await userWallet(evilDude.address);

        airdropData.set(evilDude.address, {
            amount: toNano('1000000'),
            expire_at: 1100,
            start_from: 1000
        });

        const evilProof  = airdropData.generateMerkleProof(evilDude.address);
        // Pruned dictionary with evil data added
        const prunedPath = evilProof.refs[0];

        const fakeProof = beginCell().storeUint(3, 8)
                                     .storeBuffer(airdropCell.hash(0))
                                     .storeUint(prunedPath.depth(0), 16)
                                     .storeRef(prunedPath)
                          .endCell({exotic: true});

        const claimPayload = JettonWallet.claimPayload(fakeProof);

        // We're checking that boc parsing would not allow to send non-valid proof
        // So it can never reach the contract
        expect(evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                       1n, testReceiver.address,
                                       evilDude.address, claimPayload, 1n)).rejects.toThrowError(/Hash mismatch/);
    });
    it('should reject ordinary cell', async () => {
        const evilDude     = await blockchain.treasury('3v1l');
        const evilJetton   = await userWallet(evilDude.address);

        airdropData.set(evilDude.address, {
            amount: toNano('1000000'),
            expire_at: 1100,
            start_from: 1000
        });

        const evilProof  = airdropData.generateMerkleProof(evilDude.address);
        // Pruned dictionary with evil data added
        const prunedPath = evilProof.refs[0];

        /* So the idea is that one could atempt to create
         Normal cell with same data structure
         Therefore this cell boc won't be checked against merkle proof standards
         and could theoreticlly reach the contract
        */
        const fakeProof = beginCell().storeBuffer(airdropCell.hash(0))
                                     .storeUint(prunedPath.depth(0), 16)
                          .endCell();

        const claimPayload = JettonWallet.claimPayload(fakeProof);

        const res = await evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                                  1n, testReceiver.address,
                                                  evilDude.address, claimPayload, 1n);
        expect(res.transactions).toHaveTransaction({
            on: evilJetton.address,
            from: evilDude.address,
            op: Op.transfer,
            success: false,
            aborted: true,
            exitCode: Errors.not_exotic
        });
    });
    it('should reject library', async () => {
        const evilDude     = await blockchain.treasury('3v1l');
        const evilJetton   = await userWallet(evilDude.address);

        airdropData.set(evilDude.address, {
            amount: toNano('1000000'),
            expire_at: 1100,
            start_from: 1000
        });

        const evilProof  = airdropData.generateMerkleProof(evilDude.address);
        // Pruned dictionary with evil data added
        const prunedPath = evilProof.refs[0];

        const fakeProof = beginCell().storeUint(2, 8)
                                     .storeBuffer(airdropCell.hash(0))
                                     .storeRef(prunedPath)
                          .endCell({exotic: true});

        const claimPayload = JettonWallet.claimPayload(fakeProof);

        const res = await evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                                  1n, testReceiver.address,
                                                  evilDude.address, claimPayload, 1n);
        expect(res.transactions).toHaveTransaction({
            on: evilJetton.address,
            from: evilDude.address,
            op: Op.transfer,
            success: false,
            aborted: true,
            exitCode: Errors.not_merkle_proof
        });
    });
    it('should reject merkle update', async () => {
        const evilDude     = await blockchain.treasury('3v1l');
        const evilJetton   = await userWallet(evilDude.address);

        // In this case we would just test different types on a valid cell
        // and make sure type error is triggered

        const merkleUpd = convertToMerkleUpdate(airdropCell, airdropCell);

        const claimPayload = JettonWallet.claimPayload(merkleUpd);
        const res = await evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                                  1n, testReceiver.address,
                                                  evilDude.address, claimPayload, 1n);
        expect(res.transactions).toHaveTransaction({
            on: evilJetton.address,
            from: evilDude.address,
            op: Op.transfer,
            success: false,
            aborted: true,
            exitCode: Errors.not_merkle_proof
        });
    });
    it('should reject pruned branch', async () => {
        /* We can't really test that on a contract level,
        * because pruned branch could only be a child of
        * MerkleProof/MerkleUpdate and not an ordinary cell
        * So, all we can do is just test that statement above is true
        */

        const evilDude     = await blockchain.treasury('3v1l');
        const evilJetton   = await userWallet(evilDude.address);

        const prunedUpd = convertToPrunedBranch(airdropCell);
        const claimPayload = JettonWallet.claimPayload(prunedUpd);

        expect(evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                                  1n, testReceiver.address,
                                                  evilDude.address, claimPayload, 1n)).rejects.toThrow(EmulationError);
    });

    it('should reject proof for non-present address', async () => {
        const evilDude     = await blockchain.treasury('3v1l');
        const evilJetton   = await userWallet(evilDude.address);
        const claimPayload = JettonWallet.claimPayload(receiverProof);

        // So someone atempted to replay proof as is

        let res = await evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                                1n, testReceiver.address,
                                                evilDude.address, claimPayload, 1n);
        expect(res.transactions).toHaveTransaction({
            on: evilJetton.address,
            from: evilDude.address,
            op: Op.transfer,
            success: false,
            aborted: true,
            // 9 will happen if pruned branch path is being used while trying to look up the value
            exitCode: (c) => c == 9 || c == Errors.airdrop_not_found
        });
        // Full tree no pruned branches, to guarantee 9 won't happen
        const fullDict = convertToMerkleProof(airdropCell);

        res = await evilJetton.sendTransfer(evilDude.getSender(), toNano('1'),
                                            1n, testReceiver.address,
                                            evilDude.address, claimPayload, 1n);

        expect(res.transactions).toHaveTransaction({
            on: evilJetton.address,
            from: evilDude.address,
            op: Op.transfer,
            success: false,
            aborted: true,
            exitCode: Errors.airdrop_not_found
        });
    });
    });
});



================================================
FILE: sandbox_tests/JettonWallet.spec.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/sandbox_tests/JettonWallet.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract, internal, BlockchainSnapshot, SendMessageResult, BlockchainTransaction } from '@ton/sandbox';
import { Cell, toNano, beginCell, Address, Transaction, storeAccountStorage, Dictionary, storeMessage, fromNano, DictionaryValue } from '@ton/core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { jettonContentToCell, JettonMinter, JettonMinterContent } from '../wrappers/JettonMinter';
import '@ton/test-utils';
import {findTransactionRequired} from '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { randomAddress, getRandomTon, differentAddress, getRandomInt } from './utils';
import { Op, Errors } from '../wrappers/JettonConstants';
import { calcStorageFee, collectCellStats, computeFwdFees, computeFwdFeesVerbose, FullFees, GasPrices, getGasPrices, getMsgPrices, getStoragePrices, computedGeneric, storageGeneric, MsgPrices, setGasPrice, setMsgPrices, setStoragePrices, StorageStats, StorageValue, computeGasFee } from '../gasUtils';
import { sha256 } from '@ton/crypto';

/*
   These tests check compliance with the TEP-74 and TEP-89,
   but also checks some implementation details.
   If you want to keep only TEP-74 and TEP-89 compliance tests,
   you need to remove/modify the following tests:
     mint tests (since minting is not covered by standard)
     exit_codes
     prove pathway
*/

//jetton params


let send_gas_fee: bigint;
let send_fwd_fee: bigint;
let receive_gas_fee: bigint;
let burn_gas_fee: bigint;
let burn_notification_fee: bigint;
let min_tons_for_storage: bigint;

describe('JettonWallet', () => {
    let jwallet_code_raw = new Cell(); // true code
    let jwallet_code = new Cell();     // library cell with reference to jwallet_code_raw
    let minter_code = new Cell();
    let blockchain: Blockchain;
    let deployer:SandboxContract<TreasuryContract>;
    let notDeployer:SandboxContract<TreasuryContract>;
    let jettonMinter:SandboxContract<JettonMinter>;
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>;
    let walletStats: StorageStats;
    let msgPrices: MsgPrices;
    let gasPrices: GasPrices;
    let storagePrices: StorageValue;
    let storageDuration: number;
    let stateInitStats: StorageStats;
    let defaultOverhead: bigint;
    let defaultContent: JettonMinterContent;

    let printTxGasStats: (name: string, trans: Transaction) => bigint;
    let estimateBodyFee: (body: Cell, force_ref: boolean, prices?: MsgPrices) => FullFees;
    let estimateBurnFwd: (prices?: MsgPrices) => bigint;
    let forwardOverhead: (prices: MsgPrices, stats: StorageStats) => bigint;
    let estimateTransferFwd: (amount: bigint, fwd_amount: bigint,
                              fwd_payload: Cell | null,
                              custom_payload: Cell | null,
                              prices?: MsgPrices) => bigint;
    let calcSendFees: (send_fee: bigint,
                       recv_fee: bigint,
                       fwd_fee: bigint,
                       fwd_amount: bigint,
                       storage_fee: bigint,
                       state_init?: bigint) => bigint;
    let testBurnFees: (fees: bigint, to: Address, amount: bigint, exp: number, custom: Cell | null, prices?:MsgPrices) => Promise<Array<BlockchainTransaction>>;
    let testSendFees: (fees: bigint,
                       fwd_amount: bigint,
                       fwd: Cell | null,
                       custom: Cell | null,
                       exp: boolean) => Promise<void>;

    beforeAll(async () => {
        jwallet_code_raw   = await compile('JettonWallet');
        minter_code    = await compile('JettonMinter');
        blockchain     = await Blockchain.create();
        blockchain.now = Math.floor(Date.now() / 1000);
        deployer       = await blockchain.treasury('deployer');
        notDeployer    = await blockchain.treasury('notDeployer');
        walletStats    = new StorageStats(1299, 3);
        msgPrices      = getMsgPrices(blockchain.config, 0);
        gasPrices      = getGasPrices(blockchain.config, 0);
        storagePrices  = getStoragePrices(blockchain.config);
        storageDuration= 5 * 365 * 24 * 3600;
        stateInitStats = new StorageStats(1197, 3);
        defaultContent = {
                           uri: 'https://some_stablecoin.org/meta.json'
                       };

        //jwallet_code is library
        const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
        _libs.set(BigInt(`0x${jwallet_code_raw.hash().toString('hex')}`), jwallet_code_raw);
        const libs = beginCell().storeDictDirect(_libs).endCell();
        blockchain.libs = libs;
        let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
        jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});

        console.log('jetton minter code hash = ', minter_code.hash().toString('hex'));
        console.log('jetton wallet code hash = ', jwallet_code.hash().toString('hex'));

        jettonMinter   = blockchain.openContract(
                   JettonMinter.createFromConfig(
                     {
                       admin: deployer.address,
                       wallet_code: jwallet_code,
                       merkle_root: 0n, // We don't care about the claim here
                       jetton_content: jettonContentToCell(defaultContent)
                     },
                     minter_code));
        userWallet = async (address:Address) => blockchain.openContract(
                          JettonWallet.createFromAddress(
                            await jettonMinter.getWalletAddress(address)
                          )
                     );

        printTxGasStats = (name, transaction) => {
            const txComputed = computedGeneric(transaction);
            console.log(`${name} used ${txComputed.gasUsed} gas`);
            console.log(`${name} gas cost: ${txComputed.gasFees}`);
            return txComputed.gasFees;
        }

        estimateBodyFee = (body, force_ref, prices) => {
            const curPrice = prices || msgPrices;
            const mockAddr = new Address(0, Buffer.alloc(32, 'A'));
            const testMsg = internal({
                from: mockAddr,
                to: mockAddr,
                value: toNano('1'),
                body
            });
            const packed = beginCell().store(storeMessage(testMsg, {forceRef: force_ref})).endCell();
            const stats  = collectCellStats(packed, [], true);
            return computeFwdFeesVerbose(prices || msgPrices,  stats.cells, stats.bits);
        }
        estimateBurnFwd = (prices) => {
            const curPrices = prices || msgPrices;
            return computeFwdFees(curPrices, 1n, 754n)
        }
        forwardOverhead     = (prices, stats) => {
            // Meh, kinda lazy way of doing that, but tests are bloated enough already
            return computeFwdFees(prices, stats.cells, stats.bits) - prices.lumpPrice;
        }
        estimateTransferFwd = (jetton_amount, fwd_amount,fwd_payload, custom_payload, prices) => {
            // Purpose is to account for the first biggest one fwd fee.
            // So, we use fwd_amount here only for body calculation

            const mockFrom = randomAddress(0);
            const mockTo   = randomAddress(0);

            const body     = JettonWallet.transferMessage(jetton_amount, mockTo,
                                                          mockFrom, custom_payload,
                                                          fwd_amount, fwd_payload);

            const curPrices = prices || msgPrices;
            const feesRes   = estimateBodyFee(body, true, curPrices);
            const reverse   = feesRes.remaining * 65536n / (65536n - curPrices.firstFrac);
            expect(reverse).toBeGreaterThanOrEqual(feesRes.total);
            return reverse;
        }

        calcSendFees = (send, recv, fwd, fwd_amount, storage, state_init) => {
            const overhead = state_init || defaultOverhead;
            const fwdTotal = fwd_amount + (fwd_amount > 0n ? fwd * 2n : fwd) + overhead;
            const execute  = send+ recv;
            return fwdTotal + send + recv + storage + 1n;
        }

        testBurnFees = async (fees, to, amount, exp, custom_payload, prices) => {
            const burnWallet = await userWallet(deployer.address);
            let initialJettonBalance   = await burnWallet.getJettonBalance();
            let initialTotalSupply     = await jettonMinter.getTotalSupply();
            let burnTxs: Array<BlockchainTransaction> = [];
            const burnBody = JettonWallet.burnMessage(amount,to, custom_payload);
            const burnSender = blockchain.sender(deployer.address);
            const sendRes  = await blockchain.sendMessage(internal({
                from: deployer.address,
                to: burnWallet.address,
                value: fees,
                forwardFee: estimateBodyFee(burnBody, false,prices || msgPrices).remaining,
                body: burnBody,
            }));
            if(exp == 0) {
                burnTxs.push(findTransactionRequired(sendRes.transactions, {
                    on: burnWallet.address,
                    from: deployer.address,
                    op: Op.burn,
                    success: true
                }));
                // We expect burn to succeed, but no excess
                burnTxs.push(findTransactionRequired(sendRes.transactions, {
                    on: jettonMinter.address,
                    from: burnWallet.address,
                    op: Op.burn_notification,
                    success: true
                })!);

                expect(await burnWallet.getJettonBalance()).toEqual(initialJettonBalance - amount);
                expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply - amount);
            } else {
                expect(sendRes.transactions).toHaveTransaction({
                    on: burnWallet.address,
                    from: deployer.address,
                    op: Op.burn,
                    success: false,
                    exitCode: exp
                });
                expect(sendRes.transactions).not.toHaveTransaction({
                    on: jettonMinter.address,
                    from: burnWallet.address,
                    op: Op.burn_notification
                });
                expect(await burnWallet.getJettonBalance()).toEqual(initialJettonBalance);
                expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply);
            }

            return burnTxs;
        }
        testSendFees = async (fees, fwd_amount, fwd_payload, custom_payload, exp) => {
            const deployerJettonWallet = await userWallet(deployer.address);
            let initialJettonBalance   = await deployerJettonWallet.getJettonBalance();
            const someUserAddr         = randomAddress(0);
            const someWallet           = await userWallet(someUserAddr);

            let jettonAmount = 1n;
            const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(),
                                                                       fees,
                                                                       jettonAmount,
                                                                       someUserAddr,
                                                                       deployer.address,
                                                                       custom_payload,
                                                                       fwd_amount,
                                                                       fwd_payload);

            if(exp) {
                expect(sendResult.transactions).toHaveTransaction({
                    on: someWallet.address,
                    op: Op.internal_transfer,
                    success: true
                });
                if(fwd_amount > 0n) {
                    expect(sendResult.transactions).toHaveTransaction({
                        on: someUserAddr,
                        from: someWallet.address,
                        op: Op.transfer_notification,
                        body: (x) => {
                            if(fwd_payload === null) {
                                return true;
                            }
                            return x!.beginParse().preloadRef().equals(fwd_payload);
                        },
                        // We do not test for success, because receiving contract would be uninitialized
                    });
                }
                expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance - jettonAmount);
                expect(await someWallet.getJettonBalance()).toEqual(jettonAmount);
            }
            else {
                expect(sendResult.transactions).toHaveTransaction({
                    on: deployerJettonWallet.address,
                    from: deployer.address,
                    op: Op.transfer,
                    aborted: true,
                    success: false,
                    exitCode: Errors.not_enough_gas
                });
                expect(sendResult.transactions).not.toHaveTransaction({
                    on: someWallet.address
                });
            }
        };

        defaultOverhead = forwardOverhead(msgPrices, stateInitStats);
    });

    // implementation detail
    it('should deploy', async () => {
        const deployResult = await jettonMinter.sendDeploy(deployer.getSender(), toNano('1'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
        });
        // Make sure it didn't bounce
        expect(deployResult.transactions).not.toHaveTransaction({
            on: deployer.address,
            from: jettonMinter.address,
            inMessageBounced: true
        });
    });
    // implementation detail
    it('minter admin should be able to mint jettons', async () => {
        //await blockchain.setVerbosityForAddress(jettonMinter.address, {blockchainLogs:true, vmLogs: 'vm_logs'});
        // can mint from deployer
        let initialTotalSupply = await jettonMinter.getTotalSupply();
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = toNano('1000.23');
        const mintResult = await jettonMinter.sendMint(deployer.getSender(), deployer.address, initialJettonBalance);

        const mintTx = findTransactionRequired(mintResult.transactions, {
            from: jettonMinter.address,
            to: deployerJettonWallet.address,
            deploy: true,
            success: true
        });

        printTxGasStats("Mint transaction:", mintTx);
		/*
		 * No excess in this jetton
        expect(mintResult.transactions).toHaveTransaction({ // excesses
            from: deployerJettonWallet.address,
            to: jettonMinter.address
        });
		*/

        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance);
        expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply + initialJettonBalance);
        initialTotalSupply += initialJettonBalance;
        // can mint from deployer again
        let additionalJettonBalance = toNano('2.31');
        await jettonMinter.sendMint(deployer.getSender(), deployer.address, additionalJettonBalance, null, null, null, toNano('0.05'), toNano('1'));
        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance + additionalJettonBalance);
        expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply + additionalJettonBalance);
        initialTotalSupply += additionalJettonBalance;
        // can mint to other address
        let otherJettonBalance = toNano('3.12');
        await jettonMinter.sendMint(deployer.getSender(), notDeployer.address, otherJettonBalance, null, null, null, toNano('0.05'), toNano('1'));
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        expect(await notDeployerJettonWallet.getJettonBalance()).toEqual(otherJettonBalance);
        expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply + otherJettonBalance);
    });

    // implementation detail
    it('not a minter admin should not be able to mint jettons', async () => {
        let initialTotalSupply = await jettonMinter.getTotalSupply();
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        const unAuthMintResult = await jettonMinter.sendMint(notDeployer.getSender(), deployer.address, toNano('777'), null, null, null, toNano('0.05'), toNano('1'));

        expect(unAuthMintResult.transactions).toHaveTransaction({
            from: notDeployer.address,
            to: jettonMinter.address,
            aborted: true,
            exitCode: Errors.not_owner, // error::unauthorized_mint_request
        });
        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance);
        expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply);
    });

    it('minter admin can change admin', async () => {
        const adminBefore = await jettonMinter.getAdminAddress();
        expect(adminBefore).toEqualAddress(deployer.address);
        let res = await jettonMinter.sendChangeAdmin(deployer.getSender(), notDeployer.address);
        expect(res.transactions).toHaveTransaction({
            from: deployer.address,
            on: jettonMinter.address,
            success: true
        });

        res = await jettonMinter.sendClaimAdmin(notDeployer.getSender());

        expect(res.transactions).toHaveTransaction({
            from: notDeployer.address,
            on: jettonMinter.address,
            success: true
        });

	const adminAfter = await jettonMinter.getAdminAddress();
        expect(adminAfter).toEqualAddress(notDeployer.address);
        await jettonMinter.sendChangeAdmin(notDeployer.getSender(), deployer.address);
        await jettonMinter.sendClaimAdmin(deployer.getSender());
        expect(await jettonMinter.getAdminAddress()).toEqualAddress(deployer.address);
    });
    it('not a minter admin can not change admin', async () => {
        const adminBefore = await jettonMinter.getAdminAddress();
        expect(adminBefore).toEqualAddress(deployer.address);
        let changeAdmin = await jettonMinter.sendChangeAdmin(notDeployer.getSender(), notDeployer.address);
        expect(await jettonMinter.getAdminAddress()).toEqualAddress(deployer.address);
        expect(changeAdmin.transactions).toHaveTransaction({
            from: notDeployer.address,
            on: jettonMinter.address,
            aborted: true,
            exitCode: Errors.not_owner, // error::unauthorized_change_admin_request
        });
    });
    it('only address specified in change admin action should be able to claim admin', async () => {
        const adminBefore = await jettonMinter.getAdminAddress();
        expect(adminBefore).toEqualAddress(deployer.address);
        let changeAdmin = await jettonMinter.sendChangeAdmin(deployer.getSender(), notDeployer.address);
        expect(changeAdmin.transactions).toHaveTransaction({
            from: deployer.address,
            on: jettonMinter.address,
            success: true
        });

        // At this point transfer_admin is set to notDeployer.address
        const sneaky = differentAddress(notDeployer.address);
        changeAdmin = await jettonMinter.sendClaimAdmin(blockchain.sender(sneaky));
        expect(changeAdmin.transactions).toHaveTransaction({
            from: sneaky,
            on: jettonMinter.address,
            success: false,
            aborted: true
        });
    });
    it('not admin should not be able to drop admin', async () => {
        const adminBefore = await jettonMinter.getAdminAddress();
        expect(adminBefore).toEqualAddress(deployer.address);

        const dropAdmin = await jettonMinter.sendDropAdmin(notDeployer.getSender());
        expect(dropAdmin.transactions).toHaveTransaction({
            on: jettonMinter.address,
            from: notDeployer.address,
            aborted: true
        });

        expect(await jettonMinter.getAdminAddress()).toEqualAddress(adminBefore!);
    });
    it('minter admin should be able to drop admin', async () => {
        const prev = blockchain.snapshot();
        const adminBefore = await jettonMinter.getAdminAddress();
        expect(adminBefore).toEqualAddress(deployer.address);

        try {
            const dropAdmin = await jettonMinter.sendDropAdmin(deployer.getSender());
            expect(dropAdmin.transactions).toHaveTransaction({
                on: jettonMinter.address,
                from: deployer.address,
                op: Op.drop_admin,
                aborted: false
            });
            expect(await jettonMinter.getAdminAddress()).toBe(null);
        } finally {
            await blockchain.loadFrom(prev);
        }
    });

    describe('Content tests', () => {
        let newContent : JettonMinterContent = {
            uri: `https://some_super_l${Buffer.alloc(200, '0')}ng_stable.org/`
        };
        const snakeString : DictionaryValue<string> = {
            serialize: function (src, builder)  {
                builder.storeUint(0, 8).storeStringTail(src);
            },
            parse: function (src)  {
                let outStr = src.loadStringTail();
                if(outStr.charCodeAt(0) !== 0) {
                    throw new Error("No snake prefix");
                }
                return outStr.substr(1);
            }
        };
        const loadContent = (data: Cell) => {
            const ds = data.beginParse();
            expect(ds.loadUint(8)).toEqual(0);
            const content = ds.loadDict(Dictionary.Keys.Buffer(32), snakeString);;
            expect(ds.remainingBits == 0 && ds.remainingRefs == 0).toBe(true);
            return content;
        }

        it('minter admin can change content', async () => {
            const oldContent = loadContent(await jettonMinter.getContent());
            expect(oldContent.get(await sha256('uri'))! === defaultContent.uri).toBe(true);
            //expect(oldContent.get(await sha256('decimals'))! === "6").toBe(true);
            let changeContent = await jettonMinter.sendChangeContent(deployer.getSender(), newContent);
            expect(changeContent.transactions).toHaveTransaction({
                on: jettonMinter.address,
                from: deployer.address,
                op: Op.change_metadata_url,
                success: true
            });
            let contentUpd  = loadContent(await jettonMinter.getContent());
            expect(contentUpd.get(await sha256('uri'))! == newContent.uri).toBe(true);
            // Update back;
            changeContent = await jettonMinter.sendChangeContent(deployer.getSender(), defaultContent);
            contentUpd  = loadContent(await jettonMinter.getContent());
            expect(oldContent.get(await sha256('uri'))! === defaultContent.uri).toBe(true);
            //expect(oldContent.get(await sha256('decimals'))! === "6").toBe(true);
        });
        it('not a minter admin can not change content', async () => {
            const oldContent = loadContent(await jettonMinter.getContent());
            let changeContent = await jettonMinter.sendChangeContent(notDeployer.getSender(), newContent);
            expect(oldContent.get(await sha256('uri'))).toEqual(defaultContent.uri);
            //expect(oldContent.get(await sha256('decimals'))).toEqual("6");

            expect(changeContent.transactions).toHaveTransaction({
                from: notDeployer.address,
                to: jettonMinter.address,
                aborted: true,
                exitCode: Errors.not_owner,
            });
        });
    });

    it('storage stats', async() => {
        const prev = blockchain.snapshot();

        const deployerJettonWallet = await userWallet(deployer.address);
        const smc   = await blockchain.getContract(deployerJettonWallet.address);
        const actualStats = collectCellStats(beginCell().store(storeAccountStorage(smc.account.account!.storage)).endCell(), []);
        console.log("Jetton wallet actual storage stats:", actualStats);
        expect(walletStats.cells).toBeGreaterThanOrEqual(actualStats.cells);
        expect(walletStats.bits).toBeGreaterThanOrEqual(actualStats.bits);
        console.log("Jetton estimated max storage stats:", walletStats);
        blockchain.now =  blockchain.now! + storageDuration;
        const res = await deployerJettonWallet.sendBurn(deployer.getSender(), toNano('1'), 0n, null, null);
        const storagePhase = storageGeneric(res.transactions[1]);
        // min_tons_for_storage = storagePhase.storageFeesCollected;
        min_tons_for_storage = calcStorageFee(storagePrices, walletStats, BigInt(storageDuration));
        await blockchain.loadFrom(prev);
    });
    it('wallet owner should be able to send jettons', async () => {
        const prev = blockchain.snapshot();
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        let initialTotalSupply = await jettonMinter.getTotalSupply();
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        const balanceBefore = (await blockchain.getContract(notDeployerJettonWallet.address)).balance;
        let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
        let sentAmount = toNano('0.5');
        let forwardAmount = toNano('0.05');
        const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.17'), //tons
               sentAmount, notDeployer.address,
               deployer.address, null, forwardAmount, null);
        expect(sendResult.transactions).toHaveTransaction({ //excesses
            on : deployer.address,
            from: notDeployerJettonWallet.address,
            op: Op.excesses,
            success: true
        });

        expect(sendResult.transactions).toHaveTransaction({ //notification
            from: notDeployerJettonWallet.address,
            to: notDeployer.address,
            value: forwardAmount
        });

        const balanceAfter = (await blockchain.getContract(notDeployerJettonWallet.address)).balance;
        // Make sure we're not draining balance
        expect(balanceAfter).toBeGreaterThanOrEqual(balanceBefore);
        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance - sentAmount);
        //sent amount should be unlocked after unlock time
        expect(await notDeployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance2 + sentAmount);
        expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply);
        await blockchain.loadFrom(prev);
    });

    it('not wallet owner should not be able to send jettons', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        let initialTotalSupply = await jettonMinter.getTotalSupply();
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
        let sentAmount = toNano('0.5');
        const sendResult = await deployerJettonWallet.sendTransfer(notDeployer.getSender(), toNano('0.1'), //tons
               sentAmount, notDeployer.address,
               deployer.address, null, toNano('0.05'), null);
        expect(sendResult.transactions).toHaveTransaction({
            from: notDeployer.address,
            to: deployerJettonWallet.address,
            aborted: true,
            exitCode: Errors.not_owner, //error::unauthorized_transfer
        });
        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance);
        expect(await notDeployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance2);
        expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply);
    });

    it('impossible to send too much jettons', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
        let sentAmount = initialJettonBalance + 1n;
        let forwardAmount = toNano('0.05');
        const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.1'), //tons
               sentAmount, notDeployer.address,
               deployer.address, null, forwardAmount, null);
        expect(sendResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: deployerJettonWallet.address,
            aborted: true,
            exitCode: Errors.balance_error, //error::not_enough_jettons
        });
        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance);
        expect(await notDeployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance2);
    });

    describe('Malformed transfer', () => {
        let sendTransferPayload: (from: Address, to: Address, payload: Cell) => Promise<SendMessageResult>;
        let assertFailTransfer: <T extends Transaction> (from: Address, to: Address, txs: Array<T>, codes: Array<number>) => void;
        beforeAll(() => {
            sendTransferPayload = async (from, to, payload) => {
                return await blockchain.sendMessage(internal({
                    from,
                    to,
                    body: payload,
                    value: toNano('1')
                }));
            };
            assertFailTransfer = (from, to, txs, codes) => {
                expect(txs).toHaveTransaction({
                    on: to,
                    from,
                    aborted: true,
                    success: false,
                    exitCode: (c) => codes.includes(c!)
                });
                expect(txs).not.toHaveTransaction({
                    from: to,
                    op: Op.internal_transfer
                });
            }
        });
        it('malfored custom payload', async () => {
            function convertToMerkleProof(c: Cell): Cell {
                return beginCell()
                    .storeUint(3, 8)
                    .storeBuffer(c.hash(0))
                    .storeUint(c.depth(0), 16)
                    .storeRef(c)
                    .endCell({ exotic: true });
            }

            const deployerJettonWallet    = await userWallet(deployer.address);
            const notDeployerJettonWallet = await userWallet(notDeployer.address);

            let sentAmount     = toNano('0.5');
            let forwardPayload = beginCell().storeUint(getRandomInt(100000, 200000), 128).endCell();
            let customPayload  = JettonWallet.claimPayload(convertToMerkleProof(beginCell().endCell()));

            let forwardTail    = beginCell().storeCoins(toNano('0.05')).storeMaybeRef(forwardPayload);
            const msgTemplate  = beginCell().storeUint(0xf8a7ea5, 32).storeUint(0, 64) // op, queryId
                                            .storeCoins(sentAmount).storeAddress(notDeployer.address)
                                            .storeAddress(deployer.address)
            let testPayload  = beginCell()
                                .storeBuilder(msgTemplate)
                                .storeBit(true)
                                .storeBuilder(forwardTail)
                               .endCell();

            let errCodes = [9, Errors.invalid_mesage, Errors.unknown_custom_payload];
            let res = await sendTransferPayload(deployer.address,
                                                deployerJettonWallet.address,
                                                testPayload);
            assertFailTransfer(deployer.address, deployerJettonWallet.address,
                       res.transactions, errCodes);

            testPayload = beginCell()
                             .storeBuilder(msgTemplate)
                             .storeBit(false)
                             .storeRef(customPayload)
                             .storeBuilder(forwardTail)
                           .endCell();
            res = await sendTransferPayload(deployer.address,
                                            deployerJettonWallet.address,
                                            testPayload);
            assertFailTransfer(deployer.address, deployerJettonWallet.address,
                       res.transactions, errCodes);
            // Now self test that we didnt screw the payloads ourselves
            testPayload = beginCell()
                             .storeBuilder(msgTemplate)
                             .storeBit(true)
                             .storeRef(customPayload)
                             .storeBuilder(forwardTail)
                           .endCell();

            res = await sendTransferPayload(deployer.address,
                                            deployerJettonWallet.address,
                                            testPayload);

            expect(res.transactions).toHaveTransaction({
                on: deployerJettonWallet.address,
                from: deployer.address,
                op: Op.transfer,
                exitCode: (code) => !errCodes.includes(code!)
            });
        });
        it('malformed forward payload', async() => {

            const deployerJettonWallet    = await userWallet(deployer.address);
            const notDeployerJettonWallet = await userWallet(notDeployer.address);

            let sentAmount     = toNano('0.5');
            let forwardAmount  = getRandomTon(0.01, 0.05); // toNano('0.05');
            let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
            let msgTemplate    = beginCell().storeUint(0xf8a7ea5, 32).storeUint(0, 64) // op, queryId
                                            .storeCoins(sentAmount).storeAddress(notDeployer.address)
                                            .storeAddress(deployer.address)
                                            .storeMaybeRef(null)
                                            .storeCoins(toNano('0.05')) // No forward payload indication
            let errCodes = [9, Errors.invalid_mesage];
            let res = await sendTransferPayload(deployer.address,
                                                deployerJettonWallet.address, msgTemplate.endCell());

            assertFailTransfer(deployer.address, deployerJettonWallet.address,
                               res.transactions,errCodes);

            // Now test that we can't send message without payload if either flag is set
            let testPayload = beginCell().storeBuilder(msgTemplate).storeBit(true).endCell();
            res =  await sendTransferPayload(deployer.address,
                                             deployerJettonWallet.address, testPayload);

            assertFailTransfer(deployer.address, deployerJettonWallet.address,
                               res.transactions,errCodes);
            // Now valid payload
            testPayload = beginCell().storeBuilder(msgTemplate).storeBit(true).storeRef(forwardPayload).endCell();

            res =  await sendTransferPayload(deployer.address,
                                             deployerJettonWallet.address, testPayload);

            expect(res.transactions).toHaveTransaction({
                from: deployer.address,
                to: deployerJettonWallet.address,
                op: Op.transfer,
                success: true,
            });
        });
    });

    it('correctly sends forward_payload', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
        let sentAmount = toNano('0.5');
        let forwardAmount = toNano('0.05');
        let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
        // Make sure payload is different, so cell load is charged for each individual payload.
        let customPayload  = null;
        // Let's use this case for fees calculation
        // Put the forward payload into custom payload, to make sure maximum possible gas used during computation
        const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.17'), //tons
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
        expect(sendResult.transactions).toHaveTransaction({ //notification
            from: notDeployerJettonWallet.address,
            to: notDeployer.address,
            value: forwardAmount,
            body: beginCell().storeUint(Op.transfer_notification, 32).storeUint(0, 64) //default queryId
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
        send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
        let mockGas = computeGasFee(gasPrices, 30766n);
        expect(mockGas).toBeGreaterThanOrEqual(send_gas_fee)
        send_gas_fee = mockGas;

        const receiveTx = findTransactionRequired(sendResult.transactions, {
            on: notDeployerJettonWallet.address,
            from: deployerJettonWallet.address,
            op: Op.internal_transfer,
            success: true
        });
        receive_gas_fee = printTxGasStats("Receive jetton", receiveTx);
        mockGas = computeGasFee(gasPrices, 32480n);
        expect(mockGas).toBeGreaterThanOrEqual(receive_gas_fee);
        receive_gas_fee = mockGas;

        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance - sentAmount);
        expect(await notDeployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance2 + sentAmount);
    });

    it('no forward_ton_amount - no forward', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
        let sentAmount = toNano('0.5');
        let forwardAmount = 0n;
        let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
        const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.1'), //tons
               sentAmount, notDeployer.address,
               deployer.address, null, forwardAmount, forwardPayload);
        expect(sendResult.transactions).toHaveTransaction({ //excesses
            from: notDeployerJettonWallet.address,
            to: deployer.address,
        });

        expect(sendResult.transactions).not.toHaveTransaction({ //no notification
            from: notDeployerJettonWallet.address,
            to: notDeployer.address
        });
        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance - sentAmount);
        expect(await notDeployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance2 + sentAmount);
    });

    it('check revert on not enough tons for forward', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        await deployer.send({value:toNano('1'), bounce:false, to: deployerJettonWallet.address});
        let sentAmount = toNano('0.1');
        let forwardAmount = toNano('0.3');
        let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
        const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), forwardAmount, // not enough tons, no tons for gas
               sentAmount, notDeployer.address,
               deployer.address, null, forwardAmount, forwardPayload);
        expect(sendResult.transactions).toHaveTransaction({
            from: deployer.address,
            on: deployerJettonWallet.address,
            aborted: true,
            exitCode: Errors.not_enough_gas, //error::not_enough_tons
        });
        // Make sure value bounced
        expect(sendResult.transactions).toHaveTransaction({
            from: deployerJettonWallet.address,
            on: deployer.address,
            inMessageBounced: true,
            success: true
        });

        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance);
    });

    describe('Transfer dynamic fees',() => {
    // implementation detail
    it('works with minimal ton amount', async () => {
        // No forward_amount and forward_
        let jettonAmount  = 1n;
        let forwardAmount = 0n;
        let minFwdFee     = estimateTransferFwd(jettonAmount, forwardAmount, null, null);
        /*
                     forward_ton_amount +
                     fwd_count * fwd_fee +
                     (2 * gas_consumption + min_tons_for_storage));
        */
        let minimalFee = calcSendFees(send_gas_fee, receive_gas_fee,
                                      minFwdFee, forwardAmount, min_tons_for_storage);
        // Off by one should faile
        await testSendFees(minimalFee - 1n, forwardAmount, null, null, false);
        // Now should succeed
        await testSendFees(minimalFee, forwardAmount, null, null, true);
        console.log("Minimal transfer fee no notification:", fromNano(minimalFee));
    });
    it('forward_payload should impact transfer fees', async () => {
        let jettonAmount  = 1n;
        let forwardAmount = 0n;
        let forwardPayload = beginCell().storeUint(0x123456789abcdef, 128).endCell();

        // We estimate without forward payload
        let minFwdFee  = estimateTransferFwd(jettonAmount, forwardAmount, null, null);
        let minimalFee = calcSendFees(send_gas_fee, receive_gas_fee, minFwdFee, forwardAmount, min_tons_for_storage);
        // Should fail
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, false);
        // We should re-estimate now
        minFwdFee  = estimateTransferFwd(jettonAmount, forwardAmount, forwardPayload, null);
        minimalFee = calcSendFees(send_gas_fee, receive_gas_fee, minFwdFee, forwardAmount, min_tons_for_storage);
        // Add succeed
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);
        // Now let's see if increase in size would impact fee.
        forwardPayload = beginCell().storeUint(getRandomInt(100000, 200000), 128).storeRef(forwardPayload).endCell();
        // Should fail now
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, false);

        minFwdFee  = estimateTransferFwd(jettonAmount, forwardAmount, forwardPayload, null);
        minimalFee = calcSendFees(send_gas_fee, receive_gas_fee, minFwdFee, forwardAmount, min_tons_for_storage);
        // And succeed again, after updating calculations
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);
        minFwdFee  = estimateTransferFwd(jettonAmount, 1n, null, null);
        minimalFee = calcSendFees(send_gas_fee, receive_gas_fee,
                                  minFwdFee, 1n, min_tons_for_storage);
        console.log(`Minimal transfer fee with notification(empty forward):${fromNano(minimalFee)}`);

        // Custom payload impacts fee, because forwardAmount is calculated based on inMsg fwdFee field
        /*
        const customPayload = beginCell().storeUint(getRandomInt(100000, 200000), 128).endCell();
        await testSendFees(minimalFee, forwardAmount, forwardPayload, customPayload, true);
        */
    });
    it('forward amount > 0 should account for forward fee twice', async () => {
        let jettonAmount  = 1n;
        let forwardAmount = toNano('0.05');
        let forwardPayload = beginCell().storeUint(0x123456789abcdef, 128).endCell();

        let minFwdFee  = estimateTransferFwd(jettonAmount, forwardAmount, forwardPayload, null);
        // We estimate without forward amount
        let minimalFee = calcSendFees(send_gas_fee, receive_gas_fee, minFwdFee, 0n, min_tons_for_storage);
        // Should fail
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, false);
        // Adding forward fee once more + forwardAmount should end up in successfull transfer
        minimalFee += minFwdFee + forwardAmount
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);
        // Make sure this is actual edge value and not just excessive amount
        // Off by one should fail
        await testSendFees(minimalFee - 1n, forwardAmount, forwardPayload, null, false);
    });
    it('forward fees should be calculated using actual config values', async () => {
        let jettonAmount  = 1n;
        let forwardAmount = toNano('0.05');
        let forwardPayload = beginCell().storeUint(0x123456789abcdef, 128).endCell();

        let minFwdFee  = estimateTransferFwd(jettonAmount, forwardAmount, forwardPayload, null);
        // We estimate everything correctly
        let minimalFee = calcSendFees(send_gas_fee, receive_gas_fee, minFwdFee, forwardAmount, min_tons_for_storage);
        // Results in the successfull transfer
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);

        const oldConfig = blockchain.config;
        const newPrices: MsgPrices = {
            ...msgPrices,
            bitPrice: msgPrices.bitPrice * 10n,
            cellPrice: msgPrices.cellPrice * 10n
        };
        blockchain.setConfig(setMsgPrices(blockchain.config,newPrices, 0));

        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, false);

        const newFwdFee = estimateTransferFwd(jettonAmount, forwardAmount, forwardPayload, null, newPrices);

        minimalFee += (newFwdFee - minFwdFee) * 2n + defaultOverhead * 9n;

        /*
         * We can't do it like this anymore, because change in forward prices
         * also may change rounding in reverse fee calculation
        // Delta is 18 times old fee because oldFee x 2 is already accounted
        // for two forward
        const newOverhead = forwardOverhead(newPrices, stateInitStats);
        minimalFee += (minFwdFee - msgPrices.lumpPrice) * 18n + defaultOverhead * 9n;
        */
        // Should succeed now
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);
        // Testing edge
        await testSendFees(minimalFee - 1n, forwardAmount, forwardPayload, null, false);
        // Rolling config back
        blockchain.setConfig(oldConfig);
    });
    it('gas fees for transfer should be calculated from actual config', async () => {
        let jettonAmount  = 1n;
        let forwardAmount = toNano('0.05');
        let forwardPayload = beginCell().storeUint(0x123456789abcdef, 128).endCell();

        let minFwdFee  = estimateTransferFwd(jettonAmount, forwardAmount, forwardPayload, null);
        // We estimate everything correctly
        let minimalFee = calcSendFees(send_gas_fee, receive_gas_fee, minFwdFee, forwardAmount, min_tons_for_storage);
        // Results in the successfull transfer
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);
        const oldConfig = blockchain.config;
        blockchain.setConfig(setGasPrice(oldConfig,{
            ...gasPrices,
            gas_price: gasPrices.gas_price * 3n
        }, 0));
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, false);
        // add gas delta
        minimalFee += (send_gas_fee - gasPrices.flat_gas_price) * 2n + (receive_gas_fee - gasPrices.flat_gas_price) * 2n;
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);
        // Test edge
        await testSendFees(minimalFee - 1n, forwardAmount, forwardPayload, null, false);
        blockchain.setConfig(oldConfig);
    });
    it('storage fee for transfer should be calculated from actual config', async () => {
        let jettonAmount  = 1n;
        let forwardAmount = toNano('0.05');
        let forwardPayload = beginCell().storeUint(0x123456789abcdef, 128).endCell();

        let minFwdFee  = estimateTransferFwd(jettonAmount, forwardAmount, forwardPayload, null);
        // We estimate everything correctly
        let minimalFee = calcSendFees(send_gas_fee, receive_gas_fee, minFwdFee, forwardAmount, min_tons_for_storage);
        // Results in the successfull transfer
        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);

        const oldConfig = blockchain.config;
        const newPrices = {
            ...storagePrices,
            bit_price_ps: storagePrices.bit_price_ps * 10n,
            cell_price_ps: storagePrices.cell_price_ps * 10n
        };

        blockchain.setConfig(setStoragePrices(oldConfig, newPrices));

        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, false);

        const newStorageFee = calcStorageFee(newPrices, walletStats, BigInt(5 * 365 * 24 * 3600));
        minimalFee +=  newStorageFee - min_tons_for_storage;;

        await testSendFees(minimalFee, forwardAmount, forwardPayload, null, true);
        // Tet edge
        await testSendFees(minimalFee - 1n, forwardAmount, forwardPayload, null, false);
        blockchain.setConfig(oldConfig);
    });
    });

    // implementation detail
    it('wallet does not accept internal_transfer not from wallet', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
/*
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
*/
        let internalTransfer = beginCell().storeUint(0x178d4519, 32).storeUint(0, 64) //default queryId
                              .storeCoins(toNano('0.01'))
                              .storeAddress(deployer.address)
                              .storeAddress(deployer.address)
                              .storeCoins(toNano('0.05'))
                              .storeUint(0, 1)
                  .endCell();
        const sendResult = await blockchain.sendMessage(internal({
                    from: notDeployer.address,
                    to: deployerJettonWallet.address,
                    body: internalTransfer,
                    value:toNano('0.3')
                }));
        expect(sendResult.transactions).toHaveTransaction({
            from: notDeployer.address,
            to: deployerJettonWallet.address,
            aborted: true,
            exitCode: Errors.not_valid_wallet, //error::unauthorized_incoming_transfer
        });
        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance);
    });

    // Yeah, you got that right
    // Wallet owner should not be able to burn it's jettons
    it('wallet owner should be able to burn jettons', async () => {
           const deployerJettonWallet = await userWallet(deployer.address);
            let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
            let initialTotalSupply = await jettonMinter.getTotalSupply();
            let burnAmount = toNano('0.01');
            const sendResult = await deployerJettonWallet.sendBurn(deployer.getSender(), toNano('0.1'), // ton amount
                                 burnAmount, deployer.address, null); // amount, response address, custom payload
            expect(sendResult.transactions).toHaveTransaction({
               from: deployer.address,
               to: deployerJettonWallet.address,
               aborted: false,
            });
            expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance-burnAmount);
            expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply-burnAmount);

            const actualSent   = printTxGasStats("Burn transaction", sendResult.transactions[1]);
            const actualRecv   = printTxGasStats("Burn notification transaction", sendResult.transactions[2]);
            burn_gas_fee          = actualSent;
            burn_notification_fee = actualRecv;
            burn_gas_fee = computeGasFee(gasPrices, 6148n);
            burn_notification_fee = computeGasFee(gasPrices, 28680n);
            expect(burn_gas_fee).toBeGreaterThanOrEqual(actualSent);
            expect(burn_notification_fee).toBeGreaterThanOrEqual(actualRecv);
    });

    it('not wallet owner should not be able to burn jettons', async () => {
              const deployerJettonWallet = await userWallet(deployer.address);
              let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
              let initialTotalSupply = await jettonMinter.getTotalSupply();
              let burnAmount = toNano('0.01');
              const sendResult = await deployerJettonWallet.sendBurn(notDeployer.getSender(), toNano('0.1'), // ton amount
                                    burnAmount, deployer.address, null); // amount, response address, custom payload
              expect(sendResult.transactions).toHaveTransaction({
                 from: notDeployer.address,
                 to: deployerJettonWallet.address,
                 aborted: true,
                 exitCode: Errors.not_owner, //error::unauthorized_transfer
                });
              expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance);
              expect(await jettonMinter.getTotalSupply()).toEqual(initialTotalSupply);
    });

    it('wallet owner can not burn more jettons than it has', async () => {
                const deployerJettonWallet = await userWallet(deployer.address);
                let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
                let initialTotalSupply = await jettonMinter.getTotalSupply();
                let burnAmount = initialJettonBalance + 1n;
                let msgValue   = toNano('1');
                await testBurnFees(msgValue, deployer.address, burnAmount, Errors.balance_error, null);
    });

    describe('Burn dynamic fees', () => {
    it('minimal burn message fee', async () => {
       let burnAmount   = toNano('0.01');
       const burnFwd    = estimateBurnFwd();
       let minimalFee   = burnFwd + burn_gas_fee + burn_notification_fee + 1n;

       // Off by one
       await testBurnFees(minimalFee - 1n, deployer.address, burnAmount, Errors.not_enough_gas, null);
       // Now should succeed
       console.log("Minimal burn fee:", fromNano(minimalFee));
       const res = await testBurnFees(minimalFee, deployer.address, burnAmount, 0, null);
    });
    // Now custom payload does impacf forward fee, because it is calculated from input message fwdFee
    it('burn custom payload should not impact fees', async () => {
       let burnAmount   = toNano('0.01');
       const customPayload = beginCell().storeUint(getRandomInt(1000, 2000), 256).endCell();
       const burnFwd    = estimateBurnFwd();
       let minimalFee   = burnFwd + burn_gas_fee + burn_notification_fee + 1n;
       await testBurnFees(minimalFee, deployer.address, burnAmount, 0, customPayload);
    });
    it('burn forward fee should be calculated from actual config values', async () => {
       let burnAmount   = toNano('0.01');
       let   burnFwd    = estimateBurnFwd();
       let minimalFee   = burnFwd + burn_gas_fee + burn_notification_fee + 1n;
       // Succeeds initally

       await testBurnFees(minimalFee, deployer.address, burnAmount, 0, null);

       const oldConfig = blockchain.config;
       const newPrices: MsgPrices  = {
           ...msgPrices,
           bitPrice: msgPrices.bitPrice * 10n,
           cellPrice: msgPrices.cellPrice * 10n
       }
       blockchain.setConfig(setMsgPrices(blockchain.config,newPrices, 0));
       // Now fail
       await testBurnFees(minimalFee, deployer.address, burnAmount, Errors.not_enough_gas, null, newPrices);
       const newFwd = estimateBurnFwd(newPrices);
       minimalFee += newFwd - burnFwd;
       // Success again
       await testBurnFees(minimalFee, deployer.address, burnAmount, 0, null, newPrices);
       // Check edge
       await testBurnFees(minimalFee - 1n, deployer.address, burnAmount, Errors.not_enough_gas, null, newPrices);
       blockchain.setConfig(oldConfig);
    });
    it('burn gas fees should be calculated from actual config values', async () => {
       let burnAmount   = toNano('0.01');
       const burnFwd    = estimateBurnFwd();
       let minimalFee   = burnFwd + burn_gas_fee + burn_notification_fee + 1n;
       // Succeeds initally
       await testBurnFees(minimalFee, deployer.address, burnAmount, 0, null);
       const oldConfig = blockchain.config;
       blockchain.setConfig(setGasPrice(oldConfig,{
           ...gasPrices,
           gas_price: gasPrices.gas_price * 3n
       }, 0));
       await testBurnFees(minimalFee, deployer.address, burnAmount, Errors.not_enough_gas, null);

       minimalFee += (burn_gas_fee - gasPrices.flat_gas_price) * 2n + (burn_notification_fee - gasPrices.flat_gas_price) * 2n;

       await testBurnFees(minimalFee, deployer.address, burnAmount, 0, null);
       // Verify edge
       await testBurnFees(minimalFee - 1n, deployer.address, burnAmount, Errors.not_enough_gas, null);
       blockchain.setConfig(oldConfig);
    });
    });

    it('minter should only accept burn messages from jetton wallets', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        const burnAmount = toNano('1');
        const burnNotification = (amount: bigint, addr: Address) => {
        return beginCell()
                .storeUint(Op.burn_notification, 32)
                .storeUint(0, 64)
                .storeCoins(amount)
                .storeAddress(addr)
                .storeAddress(deployer.address)
               .endCell();
        }

        let res = await blockchain.sendMessage(internal({
            from: deployerJettonWallet.address,
            to: jettonMinter.address,
            body: burnNotification(burnAmount, randomAddress(0)),
            value: toNano('0.1')
        }));

        expect(res.transactions).toHaveTransaction({
            from: deployerJettonWallet.address,
            to: jettonMinter.address,
            aborted: true,
            exitCode: Errors.not_valid_wallet// Unauthorized burn
        });

        res = await blockchain.sendMessage(internal({
            from: deployerJettonWallet.address,
            to: jettonMinter.address,
            body: burnNotification(burnAmount, deployer.address),
            value: toNano('0.1')
        }));

        expect(res.transactions).toHaveTransaction({
            from: deployerJettonWallet.address,
            to: jettonMinter.address,
            success: true
        });
   });

    // TEP-89
    it('report correct discovery address', async () => {
        let discoveryResult = await jettonMinter.sendDiscovery(deployer.getSender(), deployer.address, true);
        /*
          take_wallet_address#d1735400 query_id:uint64 wallet_address:MsgAddress owner_address:(Maybe ^MsgAddress) = InternalMsgBody;
        */
        const deployerJettonWallet = await userWallet(deployer.address);

        const discoveryTx = findTransactionRequired(discoveryResult.transactions, {
            from: jettonMinter.address,
            to: deployer.address,
            body: beginCell().storeUint(Op.take_wallet_address, 32).storeUint(0, 64)
                              .storeAddress(deployerJettonWallet.address)
                              .storeUint(1, 1)
                              .storeRef(beginCell().storeAddress(deployer.address).endCell())
                  .endCell()
        });

        printTxGasStats("Discovery transaction", discoveryTx);

        discoveryResult = await jettonMinter.sendDiscovery(deployer.getSender(), notDeployer.address, true);
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        expect(discoveryResult.transactions).toHaveTransaction({
            from: jettonMinter.address,
            to: deployer.address,
            body: beginCell().storeUint(Op.take_wallet_address, 32).storeUint(0, 64)
                              .storeAddress(notDeployerJettonWallet.address)
                              .storeUint(1, 1)
                              .storeRef(beginCell().storeAddress(notDeployer.address).endCell())
                  .endCell()
        });

        // do not include owner address
        discoveryResult = await jettonMinter.sendDiscovery(deployer.getSender(), notDeployer.address, false);
        expect(discoveryResult.transactions).toHaveTransaction({
            from: jettonMinter.address,
            to: deployer.address,
            body: beginCell().storeUint(Op.take_wallet_address, 32).storeUint(0, 64)
                              .storeAddress(notDeployerJettonWallet.address)
                              .storeUint(0, 1)
                  .endCell()
        });

    });

    it.skip('Minimal discovery fee', async () => {
       // 5000 gas-units + msg_forward_prices.lump_price + msg_forward_prices.cell_price = 0.0061
        const fwdFee     = 1464012n;
        const minimalFee = fwdFee + 10000000n; // toNano('0.0061');

        let discoveryResult = await jettonMinter.sendDiscovery(deployer.getSender(),
                                                                      notDeployer.address,
                                                                      false,
                                                                      minimalFee);

        expect(discoveryResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            aborted: true,
            exitCode: Errors.discovery_fee_not_matched // discovery_fee_not_matched
        });

        /*
         * Might be helpfull to have logical OR in expect lookup
         * Because here is what is stated in standard:
         * and either throw an exception if amount of incoming value is not enough to calculate wallet address
         * or response with message (sent with mode 64)
         * https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
         * At least something like
         * expect(discoveryResult.hasTransaction({such and such}) ||
         * discoveryResult.hasTransaction({yada yada})).toBeTruethy()
         */
        discoveryResult = await jettonMinter.sendDiscovery(deployer.getSender(),
                                                           notDeployer.address,
                                                           false,
                                                           minimalFee + 1n);

        expect(discoveryResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            success: true
        });

    });

    it('Correctly handles not valid address in discovery', async () =>{
        const badAddr       = randomAddress(-1);
        let discoveryResult = await jettonMinter.sendDiscovery(deployer.getSender(),
                                                               badAddr,
                                                               false);

        expect(discoveryResult.transactions).toHaveTransaction({
            from: jettonMinter.address,
            to: deployer.address,
            body: beginCell().storeUint(Op.take_wallet_address, 32).storeUint(0, 64)
                             .storeUint(0, 2) // addr_none
                             .storeUint(0, 1)
                  .endCell()

        });

        // Include address should still be available

        discoveryResult = await jettonMinter.sendDiscovery(deployer.getSender(),
                                                           badAddr,
                                                           true); // Include addr

        expect(discoveryResult.transactions).toHaveTransaction({
            from: jettonMinter.address,
            to: deployer.address,
            body: beginCell().storeUint(Op.take_wallet_address, 32).storeUint(0, 64)
                             .storeUint(0, 2) // addr_none
                             .storeUint(1, 1)
                             .storeRef(beginCell().storeAddress(badAddr).endCell())
                  .endCell()

        });
    });

    // This test consume a lot of time: 18 sec
    // and is needed only for measuring ton accruing
    /*it('jettonWallet can process 250 transfer', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        const notDeployerJettonWallet = await userWallet(notDeployer.address);
        let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
        let sentAmount = 1n, count = 250n;
        let forwardAmount = toNano('0.05');
        let sendResult: any;
        let payload = beginCell()
                          .storeUint(0x12345678, 32).storeUint(0x87654321, 32)
                          .storeRef(beginCell().storeUint(0x12345678, 32).storeUint(0x87654321, 108).endCell())
                          .storeRef(beginCell().storeUint(0x12345671, 32).storeUint(0x87654321, 240).endCell())
                          .storeRef(beginCell().storeUint(0x12345672, 32).storeUint(0x87654321, 77)
                                               .storeRef(beginCell().endCell())
                                               .storeRef(beginCell().storeUint(0x1245671, 91).storeUint(0x87654321, 32).endCell())
                                               .storeRef(beginCell().storeUint(0x2245671, 180).storeUint(0x87654321, 32).endCell())
                                               .storeRef(beginCell().storeUint(0x8245671, 255).storeUint(0x87654321, 32).endCell())
                                    .endCell())
                      .endCell();
        let initialBalance =(await blockchain.getContract(deployerJettonWallet.address)).balance;
        let initialBalance2 = (await blockchain.getContract(notDeployerJettonWallet.address)).balance;
        for(let i = 0; i < count; i++) {
            sendResult = await deployerJettonWallet.sendTransferMessage(deployer.getSender(), toNano('0.1'), //tons
                   sentAmount, notDeployer.address,
                   deployer.address, null, forwardAmount, payload);
        }
        // last chain was successful
        expect(sendResult.transactions).toHaveTransaction({ //excesses
            from: notDeployerJettonWallet.address,
            to: deployer.address,
        });
        expect(sendResult.transactions).toHaveTransaction({ //notification
            from: notDeployerJettonWallet.address,
            to: notDeployer.address,
            value: forwardAmount
        });

        expect(await deployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance - sentAmount*count);
        expect(await notDeployerJettonWallet.getJettonBalance()).toEqual(initialJettonBalance2 + sentAmount*count);

        let finalBalance =(await blockchain.getContract(deployerJettonWallet.address)).balance;
        let finalBalance2 = (await blockchain.getContract(notDeployerJettonWallet.address)).balance;

        // if it is not true, it's ok but gas_consumption constant is too high
        // and excesses of TONs will be accrued on wallet
        expect(finalBalance).toBeLessThan(initialBalance + toNano('0.001'));
        expect(finalBalance2).toBeLessThan(initialBalance2 + toNano('0.001'));
        expect(finalBalance).toBeGreaterThan(initialBalance - toNano('0.001'));
        expect(finalBalance2).toBeGreaterThan(initialBalance2 - toNano('0.001'));

    });
    */
    // implementation detail
    it('can not send to masterchain', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let sentAmount = toNano('0.5');
        let forwardAmount = toNano('0.05');
        const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.1'), //tons
               sentAmount, Address.parse("Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU"),
               deployer.address, null, forwardAmount, null);
        expect(sendResult.transactions).toHaveTransaction({ //excesses
            from: deployer.address,
            to: deployerJettonWallet.address,
            aborted: true,
            exitCode: Errors.wrong_workchain //error::wrong_workchain
        });
    });

    describe('Remove governance', () => {
        // Idea is to check that previous governance functionality is removed completely
        let testPayload: (payload: Cell, from: Address, to: Address, code: number) => Promise<SendMessageResult>;
        beforeAll(() => {
            testPayload = async (payload, from, to, code) => {
                const res = await blockchain.sendMessage(internal({
                    from,
                    to,
                    body: payload,
                    value: toNano('1')
                }));
                expect(res.transactions).toHaveTransaction({
                    on: to,
                    from,
                    aborted: code !== 0,
                    exitCode: code
                });

                return res;
            }
        });
        it('minter should not be able to force burn tokens', async () => {
            const notDeployerWallet = await userWallet(notDeployer.address);

            const burnMessage = JettonWallet.burnMessage(1n, null, null);
            const balanceBefore = await notDeployerWallet.getJettonBalance();
            expect(balanceBefore).toBeGreaterThan(0n);

            const res = await testPayload(burnMessage, jettonMinter.address, notDeployerWallet.address, Errors.not_owner);
            expect(res.transactions).not.toHaveTransaction({
                on: jettonMinter.address,
                from: notDeployerWallet.address,
                inMessageBounced: false
            });

            expect(await notDeployerWallet.getJettonBalance()).toEqual(balanceBefore);

            // Self check
            await testPayload(burnMessage, notDeployer.address, notDeployerWallet.address, 0);
            expect(await notDeployerWallet.getJettonBalance()).toEqual(balanceBefore - 1n);
        });
        it('minter should not be able to force transfer tokens', async () => {
            const testAddr = randomAddress();
            const testJetton = await userWallet(testAddr);
            const notDeployerWallet = await userWallet(notDeployer.address);
            const balanceBefore = await notDeployerWallet.getJettonBalance();
            expect(balanceBefore).toBeGreaterThan(0n);

            const transferMsg = JettonWallet.transferMessage(1n, testAddr, notDeployer.address, null, 0n, null);

            let res = await testPayload(transferMsg, jettonMinter.address, notDeployerWallet.address, Errors.not_owner);
            expect(await notDeployerWallet.getJettonBalance()).toEqual(balanceBefore);
            expect(res.transactions).not.toHaveTransaction({
                on: testJetton.address,
                from: notDeployerWallet.address
            });
            // Self check
            res = await testPayload(transferMsg, notDeployer.address, notDeployerWallet.address, 0);
            expect(await notDeployerWallet.getJettonBalance()).toEqual(balanceBefore - 1n);
            expect(await testJetton.getJettonBalance()).toBe(1n);
        });
    });

    describe('Bounces', () => {
        it('minter should restore supply on internal_transfer bounce', async () => {
            const deployerJettonWallet    = await userWallet(deployer.address);
            const mintAmount = BigInt(getRandomInt(1000, 2000));
            const mintMsg    = JettonMinter.mintMessage(deployer.address, mintAmount, null, null, null, toNano('0.1'), toNano('0.3'));

            const supplyBefore = await jettonMinter.getTotalSupply();
            const minterSmc = await blockchain.getContract(jettonMinter.address);

            // Sending message but only processing first step of tx chain
            let res = minterSmc.receiveMessage(internal({
                from: deployer.address,
                to: jettonMinter.address,
                body: mintMsg,
                value: toNano('1')
            }));

            expect(res.outMessagesCount).toEqual(1);
            const outMsgSc = res.outMessages.get(0)!.body.beginParse();
            expect(outMsgSc.preloadUint(32)).toEqual(Op.internal_transfer);
            expect(await jettonMinter.getTotalSupply()).toEqual(supplyBefore + mintAmount);

            minterSmc.receiveMessage(internal({
                from: deployerJettonWallet.address,
                to: jettonMinter.address,
                bounced: true,
                body: beginCell().storeUint(0xFFFFFFFF, 32).storeSlice(outMsgSc).endCell(),
                value: toNano('0.95')
            }));

            // Supply should change back
            expect(await jettonMinter.getTotalSupply()).toEqual(supplyBefore);
        });
        it('wallet should restore balance on internal_transfer bounce', async () => {
            const deployerJettonWallet    = await userWallet(deployer.address);
            const notDeployerJettonWallet = await userWallet(notDeployer.address);
            const balanceBefore           = await deployerJettonWallet.getJettonBalance();
            const txAmount = BigInt(getRandomInt(100, 200));
            const transferMsg = JettonWallet.transferMessage(txAmount, notDeployer.address, deployer.address, null, 0n, null);

            const walletSmc = await blockchain.getContract(deployerJettonWallet.address);

            const res = walletSmc.receiveMessage(internal({
                from: deployer.address,
                to: deployerJettonWallet.address,
                body: transferMsg,
                value: toNano('1')
            }));

            expect(res.outMessagesCount).toEqual(1);

            const outMsgSc = res.outMessages.get(0)!.body.beginParse();
            expect(outMsgSc.preloadUint(32)).toEqual(Op.internal_transfer);

            expect(await deployerJettonWallet.getJettonBalance()).toEqual(balanceBefore - txAmount);

            walletSmc.receiveMessage(internal({
                from: notDeployerJettonWallet.address,
                to: walletSmc.address,
                bounced: true,
                body: beginCell().storeUint(0xFFFFFFFF, 32).storeSlice(outMsgSc).endCell(),
                value: toNano('0.95')
            }));

            // Balance should roll back
            expect(await deployerJettonWallet.getJettonBalance()).toEqual(balanceBefore);
        });
        it('wallet should restore balance on burn_notification bounce', async () => {
            const deployerJettonWallet = await userWallet(deployer.address);
            const balanceBefore        = await deployerJettonWallet.getJettonBalance();
            const burnAmount = BigInt(getRandomInt(100, 200));

            const burnMsg   = JettonWallet.burnMessage(burnAmount, deployer.address, null);

            const walletSmc = await blockchain.getContract(deployerJettonWallet.address);

            const res = walletSmc.receiveMessage(internal({
                from: deployer.address,
                to: deployerJettonWallet.address,
                body: burnMsg,
                value: toNano('1')
            }));

            expect(res.outMessagesCount).toEqual(1);

            const outMsgSc = res.outMessages.get(0)!.body.beginParse();
            expect(outMsgSc.preloadUint(32)).toEqual(Op.burn_notification);

            expect(await deployerJettonWallet.getJettonBalance()).toEqual(balanceBefore - burnAmount);

            walletSmc.receiveMessage(internal({
                from: jettonMinter.address,
                to: walletSmc.address,
                bounced: true,
                body: beginCell().storeUint(0xFFFFFFFF, 32).storeSlice(outMsgSc).endCell(),
                value: toNano('0.95')
            }));

            // Balance should roll back
            expect(await deployerJettonWallet.getJettonBalance()).toEqual(balanceBefore);
        });
    });

    describe('Upgrade', () => {
        let prevState : BlockchainSnapshot;

        let getContractData:(address: Address) => Promise<Cell>;
        let getContractCode:(smc: Address)     => Promise<Cell>;
        beforeAll(() => {
            prevState = blockchain.snapshot();
            getContractData = async (address: Address) => {
              const smc = await blockchain.getContract(address);
              if(!smc.account.account)
                throw("Account not found")
              if(smc.account.account.storage.state.type != "active" )
                throw("Atempting to get data on inactive account");
              if(!smc.account.account.storage.state.state.data)
                throw("Data is not present");
              return smc.account.account.storage.state.state.data
            }
            getContractCode = async (address: Address) => {
              const smc = await blockchain.getContract(address);
              if(!smc.account.account)
                throw("Account not found")
              if(smc.account.account.storage.state.type != "active" )
                throw("Atempting to get code on inactive account");
              if(!smc.account.account.storage.state.state.code)
                throw("Code is not present");
              return smc.account.account.storage.state.state.code;
            }
        });

        afterAll(async () => await blockchain.loadFrom(prevState));


        it('not admin should not be able to upgrade minter', async () => {
            const codeCell = beginCell().storeUint(getRandomInt(1000, (1 << 32) - 1), 32).endCell();
            const dataCell = beginCell().storeUint(getRandomInt(1000, (1 << 32) - 1), 32).endCell();

            const codeBefore = await getContractCode(jettonMinter.address);
            const dataBefore = await getContractData(jettonMinter.address);

            const notAdmin = differentAddress(deployer.address);

            const res = await jettonMinter.sendUpgrade(blockchain.sender(notAdmin), codeCell, dataCell);

            expect(res.transactions).toHaveTransaction({
                on: jettonMinter.address,
                from: notAdmin,
                success: false,
                aborted: true
            });

            // Excessive due to transaction is aborted, but still
            expect(await getContractCode(jettonMinter.address)).toEqualCell(codeBefore);
            expect(await getContractData(jettonMinter.address)).toEqualCell(dataBefore);
        });
        it('admin should be able to upgrade minter code and data', async () => {
            const codeCell = beginCell().storeUint(getRandomInt(1000, (1 << 32) - 1), 32).endCell();
            const dataCell = beginCell().storeUint(getRandomInt(1000, (1 << 32) - 1), 32).endCell();

            const res = await jettonMinter.sendUpgrade(deployer.getSender(), codeCell, dataCell);
            expect(res.transactions).toHaveTransaction({
                on: jettonMinter.address,
                from: deployer.address,
                op: Op.upgrade,
                success: true
            });

            expect(await getContractCode(jettonMinter.address)).toEqualCell(codeCell);
            expect(await getContractData(jettonMinter.address)).toEqualCell(dataCell);
        });
    });

    // Current wallet version doesn't support those operations
    // implementation detail
    it.skip('owner can withdraw excesses', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        await deployer.send({value:toNano('1'), bounce:false, to: deployerJettonWallet.address});
        let initialBalance = (await blockchain.getContract(deployer.address)).balance;
        const withdrawResult = await deployerJettonWallet.sendWithdrawTons(deployer.getSender());
        expect(withdrawResult.transactions).toHaveTransaction({ //excesses
            from: deployerJettonWallet.address,
            to: deployer.address
        });
        let finalBalance = (await blockchain.getContract(deployer.address)).balance;
        let finalWalletBalance = (await blockchain.getContract(deployerJettonWallet.address)).balance;
        expect(finalWalletBalance).toEqual(min_tons_for_storage);
        expect(finalBalance - initialBalance).toBeGreaterThan(toNano('0.99'));
    });
    // implementation detail
    it.skip('not owner can not withdraw excesses', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        await deployer.send({value:toNano('1'), bounce:false, to: deployerJettonWallet.address});
        let initialBalance = (await blockchain.getContract(deployer.address)).balance;
        const withdrawResult = await deployerJettonWallet.sendWithdrawTons(notDeployer.getSender());
        expect(withdrawResult.transactions).not.toHaveTransaction({ //excesses
            from: deployerJettonWallet.address,
            to: deployer.address
        });
        let finalBalance = (await blockchain.getContract(deployer.address)).balance;
        let finalWalletBalance = (await blockchain.getContract(deployerJettonWallet.address)).balance;
        expect(finalWalletBalance).toBeGreaterThan(toNano('1'));
        expect(finalBalance - initialBalance).toBeLessThan(toNano('0.1'));
    });
    // implementation detail
    it.skip('owner can withdraw jettons owned by JettonWallet', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let sentAmount = toNano('0.5');
        let forwardAmount = toNano('0.05');
        await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.1'), //tons
               sentAmount, deployerJettonWallet.address,
               deployer.address, null, forwardAmount, null);
        const childJettonWallet = await userWallet(deployerJettonWallet.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        let initialChildJettonBalance = await childJettonWallet.getJettonBalance();
        expect(initialChildJettonBalance).toEqual(toNano('0.5'));
        let withdrawResult = await deployerJettonWallet.sendWithdrawJettons(deployer.getSender(), childJettonWallet.address, toNano('0.4'));
        expect(await deployerJettonWallet.getJettonBalance() - initialJettonBalance).toEqual(toNano('0.4'));
        expect(await childJettonWallet.getJettonBalance()).toEqual(toNano('0.1'));
        //withdraw the rest
        await deployerJettonWallet.sendWithdrawJettons(deployer.getSender(), childJettonWallet.address, toNano('0.1'));
    });
    // implementation detail
    it.skip('not owner can not withdraw jettons owned by JettonWallet', async () => {
        const deployerJettonWallet = await userWallet(deployer.address);
        let sentAmount = toNano('0.5');
        let forwardAmount = toNano('0.05');
        await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.1'), //tons
               sentAmount, deployerJettonWallet.address,
               deployer.address, null, forwardAmount, null);
        const childJettonWallet = await userWallet(deployerJettonWallet.address);
        let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
        let initialChildJettonBalance = await childJettonWallet.getJettonBalance();
        expect(initialChildJettonBalance).toEqual(toNano('0.5'));
        let withdrawResult = await deployerJettonWallet.sendWithdrawJettons(notDeployer.getSender(), childJettonWallet.address, toNano('0.4'));
        expect(await deployerJettonWallet.getJettonBalance() - initialJettonBalance).toEqual(toNano('0.0'));
        expect(await childJettonWallet.getJettonBalance()).toEqual(toNano('0.5'));
    });
});



================================================
FILE: sandbox_tests/SameShard.spec.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/sandbox_tests/SameShard.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract, internal, BlockchainSnapshot, SendMessageResult, BlockchainTransaction } from '@ton/sandbox';
import { Cell, toNano, beginCell, Address, Dictionary, fromNano } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { JettonMinterTest } from '../wrappers/JettonMinterTest';
import { JettonWallet } from '../wrappers/JettonWallet';
import { jettonContentToCell } from '../wrappers/JettonMinter';
import { getSecureRandomBytes } from '@ton/crypto';
import { getRandomInt } from './utils';


describe('SameShard', () => {
    let blockchain: Blockchain;
    let minter_code = new Cell();
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>;
    let merkleRoot: bigint;
    let deployer: SandboxContract<TreasuryContract>;
    let jettonMinter: SandboxContract<JettonMinterTest>;

    beforeAll(async () => {
        blockchain  = await Blockchain.create();
        minter_code = await compile('JettonMinterTest');
        const wallet_code = await compile('JettonWallet');
        deployer = await blockchain.treasury('deployer_wallet');

        const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
        _libs.set(BigInt(`0x${wallet_code.hash().toString('hex')}`), wallet_code);
        const libs = beginCell().storeDictDirect(_libs).endCell();
        blockchain.libs = libs;
        let lib_prep = beginCell().storeUint(2,8).storeBuffer(wallet_code.hash()).endCell();
        const jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
        merkleRoot   = BigInt('0x' + (await getSecureRandomBytes(32)).toString('hex'));


        const defaultContent = {
                           uri: 'https://some_stablecoin.org/meta.json'
                       };

        jettonMinter   = blockchain.openContract(
                   JettonMinterTest.createFromConfig(
                     {
                       admin: deployer.address,
                       wallet_code: jwallet_code,
                       merkle_root: merkleRoot, // We don't care about the claim here
                       jetton_content: jettonContentToCell(defaultContent)
                     },
                     minter_code));

        const deployResult = await jettonMinter.sendDeploy(deployer.getSender(), toNano('10'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            aborted: false
        });
        userWallet = async (address:Address) => blockchain.openContract(
                          JettonWallet.createFromAddress(
                            await jettonMinter.getWalletAddress(address)
                          ));
    });
    it('should mint wallet to closest to receiver shard', async () => {
        const mintAmount = toNano('1000');
        let successCount = 0;

        for(let i = 0; i < 100; i++) {
            try {
                const testAddress = new Address(0, await getSecureRandomBytes(32));
                const testJetton = await userWallet(testAddress);
                const mintResult = await jettonMinter.sendMint(deployer.getSender(), testAddress, mintAmount, null, null, null, toNano('0.05'), toNano('1'));
                expect(await testJetton.getJettonBalance()).toEqual(mintAmount);
                expect(testJetton.address.hash[0] >> 4).toEqual(testAddress.hash[0] >> 4);
                successCount++;
            } catch(e) {
            }
        }
        console.log(`Same shard mint ${successCount}/100`);
        expect(successCount).toBeGreaterThanOrEqual(80);
    });
    it('should create wallet in closest shard on transfer', async () => {
        const mintAmount = toNano('1000');
        const deployerJetton = await userWallet(deployer.address);
        const mintResult = await jettonMinter.sendMint(deployer.getSender(), deployer.address, mintAmount, null, null, null, toNano('0.05'), toNano('1'));
        let successCount = 0;

        for(let i = 0; i < 100; i++) {
            try {
                const testAddress = new Address(0, await getSecureRandomBytes(32));
                const testJetton  = await userWallet(testAddress);
                await deployerJetton.sendTransfer(deployer.getSender(),
                                                  toNano('1'),
                                                  1n,
                                                  testAddress,
                                                  deployer.address,
                                                  null,
                                                  1n,
                                                  null);
                expect(await testJetton.getJettonBalance()).toEqual(1n);
                expect(testJetton.address.hash[0] >> 4).toEqual(testAddress.hash[0] >> 4);
                successCount++;
            } catch(e) {
            }
        }
        console.log(`Same shard transfer ${successCount}/100`);
        expect(successCount).toBeGreaterThanOrEqual(80);
    });
    it('cheap and regular result should match (1000 calls)', async () => {
        for(let i = 0; i < 1000; i++) {
            const testAddress = new Address(0, await getSecureRandomBytes(32));
            const cheap       = await jettonMinter.getSaltCheap(testAddress);
            const regular     = await jettonMinter.getSalt(testAddress);
            expect(cheap.salt).toEqual(regular.salt);
            expect(cheap.state_init).toEqualCell(regular.state_init);
        }
    });
    it.skip('cheap and regular result should match in a long run (10K calls)', async () => {
        for(let i = 0; i < 10000; i++) {
            const testAddress = new Address(0, await getSecureRandomBytes(32));
            const cheap       = await jettonMinter.getSaltCheap(testAddress);
            const regular     = await jettonMinter.getSalt(testAddress);
            if(i % 1000 == 0) {
                console.log(i);
            }
            expect(cheap.salt).toEqual(regular.salt);
            expect(cheap.state_init).toEqualCell(regular.state_init);
        }
    });
});



================================================
FILE: sandbox_tests/StateInit.spec.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/sandbox_tests/StateInit.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, beginCell, Address, Dictionary, storeStateInit } from '@ton/core';
import { jettonContentToCell, JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';
import { compile } from '@ton/blueprint';
import '@ton/test-utils';
import { collectCellStats } from '../gasUtils';
import { Op, Errors } from '../wrappers/JettonConstants';

let blockchain: Blockchain;
let deployer: SandboxContract<TreasuryContract>;
let jettonMinter:SandboxContract<JettonMinter>;
let minter_code: Cell;
let wallet_code: Cell;
let jwallet_code_raw: Cell;
let jwallet_code: Cell;
let userWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>;

describe('State init tests', () => {
    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer   = await blockchain.treasury('deployer');
        jwallet_code_raw = await compile('JettonWallet');
        minter_code    = await compile('JettonMinter');

        //jwallet_code is library
        const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
        _libs.set(BigInt(`0x${jwallet_code_raw.hash().toString('hex')}`), jwallet_code_raw);
        const libs = beginCell().storeDictDirect(_libs).endCell();
        blockchain.libs = libs;
        let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
        jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});

        console.log('jetton minter code hash = ', minter_code.hash().toString('hex'));
        console.log('jetton wallet code hash = ', jwallet_code.hash().toString('hex'));

        jettonMinter   = blockchain.openContract(
                   JettonMinter.createFromConfig(
                     {
                       admin: deployer.address,
                       wallet_code: jwallet_code,
                       merkle_root: 0n, // Doesn't matter
                       jetton_content: jettonContentToCell({uri: "https://ton.org/"})
                     },
                     minter_code));

        userWallet = async (address:Address) => blockchain.openContract(
                          JettonWallet.createFromAddress(
                            await jettonMinter.getWalletAddress(address)
                          )
                     );
    });
    it('should deploy', async () => {

        //await blockchain.setVerbosityForAddress(jettonMinter.address, {blockchainLogs:true, vmLogs: 'vm_logs'});
        const deployResult = await jettonMinter.sendDeploy(deployer.getSender(), toNano('10'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
        });
        // Make sure it didn't bounce
        expect(deployResult.transactions).not.toHaveTransaction({
            on: deployer.address,
            from: jettonMinter.address,
            inMessageBounced: true
        });
    });
    it('should mint max jetton walue', async () => {
        const maxValue = (2n ** 120n) - 1n;
        const deployerWallet = await userWallet(deployer.address);
        const res = await jettonMinter.sendMint(deployer.getSender(),
                                                deployer.address,
                                                maxValue,
                                                null, null, null);
        expect(res.transactions).toHaveTransaction({
            on: deployerWallet.address,
            op: Op.internal_transfer,
            success: true,
        });

        const curBalance = await deployerWallet.getJettonBalance();
        expect(curBalance).toEqual(maxValue);
        const smc   = await blockchain.getContract(deployerWallet.address);
        if(smc.accountState === undefined)
            throw new Error("Can't access wallet account state");
        if(smc.accountState.type !== "active")
            throw new Error("Wallet account is not active");
        if(smc.account.account === undefined || smc.account.account === null)
            throw new Error("Can't access wallet account!");
        console.log("Jetton wallet max storage stats:", smc.account.account.storageStats.used);
        const state = smc.accountState.state;
        const stateCell = beginCell().store(storeStateInit(state)).endCell();
        console.log("State init stats:", collectCellStats(stateCell, []));
    });
});




================================================
FILE: sandbox_tests/proof
URL: https://github.com/ton-community/mintless-jetton/blob/main/sandbox_tests/proof
================================================
0:002249881234278e5daff4e344c00055e45f03612d2b74c2c0022136f409766f,te6cckECOgEABQ4ACUYDDBdjDfyqrzV32L9/prHrh9k4GFMIlDwFo475iQeNie0AIgEiBYFwAgI5IgEgAzgiASAENyIBIAU2IgEgBjUiASAHNCIBIAgzIgEgCTIiASAKMSIBIAswIgEgDA0oSAEB+6MKSHkVlGc7UyySPO60eoWkfIznxfc6Nnn7EBaw1VIAFSIBIA4vIgEgDy4iASAQLSIBIBESKEgBAXOnzgmsUqp1+w1eanO/nca5PGoPeAwZlz+vdbH4TY9nABAiASATLCIBIBQrIgEgFRYoSAEBZzEA+624BJAy3cR3TG2AZExR7nnFsDhA1S7zjD6YmbUADSIBIBcqIgEgGCkiASAZGihIAQGxhUvKIJyL2Ndokhyj2uBxYZCKiVuRGaT5EpWX4YdgSgAJIgEgGygiASAcJyIBIB0eKEgBARZArBBMj8qL57uuuMp+E9lOnVe+0EoHtr5OBPhxxZ4IAAQiASAfIChIAQFUxMvXS9vijdpkVJ5pSw6mAIN4gK6btblBmGRxj4YzsgACIgEgISYiAUgiJSIBICMkKEgBARGvfG1fYOmTZruY4PSOlfFU+tjPs9f8IHah/8ucVKtMAAAAX7jAkaE8cu1/pxomAAKvIvgbCWlbphYAEQm3oEuzevRqUogAAAAAAAH0AAAAAAPoQChIAQFX6IzUVkUjpcspgFNxll8Y1Y77HVJZ3ODLGViVZSYovAAAKEgBARnTekH/rOKVvOuJvfu2SWruzDlIozaZjtkzbP4tteYYAAIoSAEBLJ3x5MeVUDW7fffikrvtpixJYaEl3nHubYLM8pkkAjYABihIAQH7YW56T2ibZgeaOIDQpYgsetEHBOywRmfFiIfMXR/pXQAHKEgBAXT2pvZwlCJZdgGzNhb4OWAu8DAh8u3tobbO4p8svt84AAooSAEBSGHmJKdXRb3GXFCkDVRl02jCXAxQ1+SopOlCisxqrroACyhIAQEQYB96Ygy8VJ2N9gd1N+D9IV3QP69bO56iX/AxWLeU5gAOKEgBAT5jN52Gc6OdASJKGwNDY1xzNaZMAFRfto1O1Myqk0jiABAoSAEBRGqTrP/sUK9U4HtZzRvlQ/WgxwizJhE1lP0rcQ8e9owAEihIAQEER1tM6wao2BQ2B1FhMcsf4JrwL4jf1aDkNSCrMtK+yQAUKEgBAcGX53oiUHxcsdO6wnbn/9c3QB3UzqnBao3nS4i5Ein2ABQoSAEBlwC/UOeEmRXQHZgcZoX2VMPfjcY/n9Qf43YHWXYM8PcAFyhIAQGGb8fnfK2HbKouHsUFvTpLb966ZLt2yMMnzcE8Mb3C+wAYKEgBAeQRmcCTbB+ecnybh6lqgM13VKJP/J16XGFGE2XduH2xABkoSAEBouGuUu/X7AJGRRx5YG5Yp4Cf0Wj7P6sl8k6lzysj078AGihIAQHi3lqcXbNaeTVPtmDQ6E+AoDHq1Uw+aL+KDFO6am1GRwAbKEgBAd4pXdIA1LuQsi7tdhS9OHXqqXXVGMz+7uU+eTggISlmAB0oSAEBEwaqHVQ1mQZ36ufldwsmM2xjvcwE5Sqi6buqXm1k3XAAHihIAQHs/GrabSvzibm8RQErRJji0DhTKbZXP9ZRBry2j4va/QAeKEgBAWd54IB0Ovji/QGbHMCZ1TFkBBAwMI/FFpI6ijCLFQumACAoSAEBGcV8vt7YMrn1T421BMmN65y12BSGJ+IPfHLkV93TIBsAIZoWkmg=



================================================
FILE: sandbox_tests/utils.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/sandbox_tests/utils.ts
================================================

import { Address, toNano, Cell} from "@ton/core";

export const randomAddress = (wc: number = 0) => {
    const buf = Buffer.alloc(32);
    for (let i = 0; i < buf.length; i++) {
        buf[i] = Math.floor(Math.random() * 256);
    }
    return new Address(wc, buf);
};

export const differentAddress = (old: Address) => {
    let newAddr: Address;
    do {
        newAddr = randomAddress(old.workChain);
    } while(newAddr.equals(old));

    return newAddr;
}

const getRandom = (min:number, max:number) => {
    return Math.random() * (max - min) + min;
}

export const getRandomInt = (min: number, max: number) => {
    return Math.round(getRandom(min, max));
}

export const getRandomTon = (min:number, max:number): bigint => {
    return toNano(getRandom(min, max).toFixed(9));
}

export const buff2bigint = (buff: Buffer) : bigint => {
    return BigInt("0x" + buff.toString("hex"));
}

export type InternalTransfer = {
    from: Address | null,
    response: Address | null,
    amount: bigint,
    forwardAmount: bigint,
    payload: Cell | null
};
export type JettonTransfer = {
    to: Address,
    response_address: Address | null,
    amount: bigint,
    custom_payload: Cell | null,
    forward_amount: bigint,
    forward_payload: Cell | null
}

export const parseTransfer = (body: Cell) => {
    const ts = body.beginParse().skip(64 + 32);
    return {
        amount: ts.loadCoins(),
        to: ts.loadAddress(),
        response_address: ts.loadAddressAny(),
        custom_payload: ts.loadMaybeRef(),
        forward_amount: ts.loadCoins(),
        forward_payload: ts.loadMaybeRef()
    }
}
export const parseInternalTransfer = (body: Cell) => {

    const ts = body.beginParse().skip(64 + 32);

    return {
        amount: ts.loadCoins(),
        from: ts.loadAddressAny(),
        response: ts.loadAddressAny(),
        forwardAmount: ts.loadCoins(),
        payload: ts.loadMaybeRef()
    };
};
type JettonTransferNotification = {
    amount: bigint,
    from: Address | null,
    payload: Cell | null
}
export const parseTransferNotification = (body: Cell) => {
    const bs = body.beginParse().skip(64 + 32);
    return {
        amount: bs.loadCoins(),
        from: bs.loadAddressAny(),
        payload: bs.loadMaybeRef()
    }
}

type JettonBurnNotification = {
    amount: bigint,
    from: Address,
    response_address: Address | null,
}
export const parseBurnNotification = (body: Cell) => {
    const ds  = body.beginParse().skip(64 + 32);
    const res = {
        amount: ds.loadCoins(),
        from: ds.loadAddress(),
        response_address: ds.loadAddressAny(),
    };

    return res;
}

const testPartial = (cmp: any, match: any) => {
    for (let key in match) {
        if(!(key in cmp)) {
            throw Error(`Unknown key ${key} in ${cmp}`);
        }

        if(match[key] instanceof Address) {
            if(!(cmp[key] instanceof Address)) {
                return false
            }
            if(!(match[key] as Address).equals(cmp[key])) {
                return false
            }
        }
        else if(match[key] instanceof Cell) {
            if(!(cmp[key] instanceof Cell)) {
                return false;
            }
            if(!(match[key] as Cell).equals(cmp[key])) {
                return false;
            }
        }
        else if(match[key] !== cmp[key]){
            return false;
        }
    }
    return true;
}
export const testJettonBurnNotification = (body: Cell, match: Partial<JettonBurnNotification>) => {
    const res= parseBurnNotification(body);
    return testPartial(res, match);
}

export const testJettonTransfer = (body: Cell, match: Partial<JettonTransfer>) => {
    const res = parseTransfer(body);
    return testPartial(res, match);
}
export const testJettonInternalTransfer = (body: Cell, match: Partial<InternalTransfer>) => {
    const res = parseInternalTransfer(body);
    return testPartial(res, match);
};
export const testJettonNotification = (body: Cell, match: Partial<JettonTransferNotification>) => {
    const res = parseTransferNotification(body);
    return testPartial(res, match);
}



================================================
FILE: wrappers/JettonConstants.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonConstants.ts
================================================
export abstract class Op {
    static transfer = 0xf8a7ea5;
    static transfer_notification = 0x7362d09c;
    static internal_transfer = 0x178d4519;
    static excesses = 0xd53276db;
    static burn = 0x595f07bc;
    static burn_notification = 0x7bdd97de;

    static airdrop_claim = 0x0df602d6;
    
    static provide_wallet_address = 0x2c76b973;
    static take_wallet_address = 0xd1735400;
    static mint = 0x642b7d07;
    static change_admin = 0x6501f354;
    static claim_admin = 0xfb88e119;
    static drop_admin  = 0x7431f221;
    static upgrade = 0x2508d66a;
    static top_up = 0xd372158c;
    static change_metadata_url = 0xcb862902;
}

export abstract class Errors {
    static invalid_op = 72;
    static wrong_op = 0xffff;
    static not_owner = 73;
    static not_valid_wallet = 74;
    static wrong_workchain = 333;

    static airdrop_already_claimed = 54;
    static airdrop_not_ready = 55;
    static airdrop_finished  = 56;
    static airdrop_not_found = 109;

    static not_exotic = 103;
    static not_merkle_proof = 104;
    static wrong_hash = 105;
    static leaf_not_found = 108;

    static balance_error = 47;
    static not_enough_gas = 48;
    static invalid_mesage = 49;
    static discovery_fee_not_matched = 75;
    static unknown_custom_payload = 57;
}





================================================
FILE: wrappers/JettonMinter.compile.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonMinter.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    targets: ['contracts/jetton-minter.fc'],
};



================================================
FILE: wrappers/JettonMinter.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonMinter.ts
================================================
import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode, Slice,
    toNano
} from '@ton/core';
import {Op} from './JettonConstants';

export type JettonMinterContent = {
    uri: string
};
export type JettonMinterConfig = {
    admin: Address,
    wallet_code: Cell,
    jetton_content: Cell | JettonMinterContent,
    merkle_root: bigint
};
export type JettonMinterConfigFull = {
    supply: bigint,
    admin: Address,
    transfer_admin: Address | null,
    wallet_code: Cell,
    jetton_content: Cell | JettonMinterContent,
    merkle_root: bigint
}

export function endParse(slice: Slice) {
    if (slice.remainingBits > 0 || slice.remainingRefs > 0) {
        throw new Error('remaining bits in data');
    }
}

export function jettonMinterConfigCellToConfig(config: Cell): JettonMinterConfigFull {
    const sc = config.beginParse()
    const parsed: JettonMinterConfigFull = {
        supply: sc.loadCoins(),
        admin: sc.loadAddress(),
        transfer_admin: sc.loadMaybeAddress(),
        wallet_code: sc.loadRef(),
        jetton_content: sc.loadRef(),
        merkle_root: sc.loadUintBig(256)
    };
    endParse(sc);
    return parsed;
}

export function parseJettonMinterData(data: Cell): JettonMinterConfigFull {
    return jettonMinterConfigCellToConfig(data);
}

export function jettonMinterConfigFullToCell(config: JettonMinterConfigFull): Cell {
    const content = config.jetton_content instanceof Cell ? config.jetton_content : jettonContentToCell(config.jetton_content);
    return beginCell()
        .storeCoins(config.supply)
        .storeAddress(config.admin)
        .storeAddress(config.transfer_admin)
        .storeUint(config.merkle_root, 256)
        .storeRef(config.wallet_code)
        .storeRef(content)
        .endCell()
}

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
    const content = config.jetton_content instanceof Cell ? config.jetton_content : jettonContentToCell(config.jetton_content);
    return beginCell()
        .storeCoins(0)
        .storeAddress(config.admin)
        .storeAddress(null) // Transfer admin address
        .storeUint(config.merkle_root, 256)
        .storeRef(config.wallet_code)
        .storeRef(content)
        .endCell();
}

export function jettonContentToCell(content: JettonMinterContent) {
    return beginCell()
        .storeStringRefTail(content.uri) //Snake logic under the hood
        .endCell();
}

export class JettonMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new JettonMinter(address);
    }

    static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = {code, data};
        return new JettonMinter(contractAddress(workchain, init), init);
    }

    static createFromFullConfig(config: JettonMinterConfigFull, code: Cell, workchain = 0) {
        const data = jettonMinterConfigFullToCell(config);
        const init = {code, data};
        return new JettonMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Op.top_up, 32).storeUint(0, 64).endCell(),
        });
    }

    static mintMessage(to: Address, jetton_amount: bigint, from?: Address | null, response?: Address | null, customPayload?: Cell | null, forward_ton_amount: bigint = 0n, total_ton_amount: bigint = 0n) {
        const mintMsg = beginCell().storeUint(Op.internal_transfer, 32)
            .storeUint(0, 64)
            .storeCoins(jetton_amount)
            .storeAddress(from)
            .storeAddress(response)
            .storeCoins(forward_ton_amount)
            .storeMaybeRef(customPayload)
            .endCell();
        return beginCell().storeUint(Op.mint, 32).storeUint(0, 64) // op, queryId
            .storeAddress(to)
            .storeCoins(total_ton_amount)
            .storeRef(mintMsg)
            .endCell();
    }

    static parseMintInternalMessage(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.internal_transfer) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        const jettonAmount = slice.loadCoins();
        const fromAddress = slice.loadAddress();
        const responseAddress = slice.loadAddress();
        const forwardTonAmount = slice.loadCoins();
        const customPayload = slice.loadMaybeRef();
        endParse(slice);
        return {
            queryId,
            jettonAmount,
            fromAddress,
            responseAddress,
            forwardTonAmount,
            customPayload
        }
    }

    static parseMintMessage(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.mint) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        const toAddress = slice.loadAddress();
        const tonAmount = slice.loadCoins();
        const mintMsg = slice.loadRef();
        endParse(slice);
        return {
            queryId,
            toAddress,
            tonAmount,
            internalMessage: this.parseMintInternalMessage(mintMsg.beginParse())
        }
    }

    async sendMint(provider: ContractProvider,
                   via: Sender,
                   to: Address,
                   jetton_amount: bigint,
                   from?: Address | null,
                   response_addr?: Address | null,
                   customPayload?: Cell | null,
                   forward_ton_amount: bigint = 1n, total_ton_amount: bigint = toNano('0.2')) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.mintMessage(to, jetton_amount, from, response_addr, customPayload, forward_ton_amount, total_ton_amount),
            value: total_ton_amount + toNano('0.05'),
        });
    }

    /* provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;
    */
    static discoveryMessage(owner: Address, include_address: boolean) {
        return beginCell().storeUint(Op.provide_wallet_address, 32).storeUint(0, 64) // op, queryId
            .storeAddress(owner).storeBit(include_address)
            .endCell();
    }

    async sendDiscovery(provider: ContractProvider, via: Sender, owner: Address, include_address: boolean, value: bigint = toNano('0.1')) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.discoveryMessage(owner, include_address),
            value: value,
        });
    }

    static topUpMessage() {
        return beginCell().storeUint(Op.top_up, 32).storeUint(0, 64) // op, queryId
            .endCell();
    }

    static parseTopUp(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.top_up) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        endParse(slice);
        return {
            queryId,
        }
    }

    async sendTopUp(provider: ContractProvider, via: Sender, value: bigint = toNano('0.1')) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.topUpMessage(),
            value: value,
        });
    }

    static changeAdminMessage(newOwner: Address) {
        return beginCell().storeUint(Op.change_admin, 32).storeUint(0, 64) // op, queryId
            .storeAddress(newOwner)
            .endCell();
    }

    static parseChangeAdmin(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.change_admin) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        const newAdminAddress = slice.loadAddress();
        endParse(slice);
        return {
            queryId,
            newAdminAddress
        }
    }

    async sendChangeAdmin(provider: ContractProvider, via: Sender, newOwner: Address) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.changeAdminMessage(newOwner),
            value: toNano("0.1"),
        });
    }

    static claimAdminMessage(query_id: bigint = 0n) {
        return beginCell().storeUint(Op.claim_admin, 32).storeUint(query_id, 64).endCell();
    }

    static parseClaimAdmin(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.claim_admin) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        endParse(slice);
        return {
            queryId
        }
    }

    async sendClaimAdmin(provider: ContractProvider, via: Sender, query_id: bigint = 0n) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.claimAdminMessage(query_id),
            value: toNano('0.1')
        })
    }

    static dropAdminMessage(query_id: number | bigint) {
        return beginCell().storeUint(Op.drop_admin, 32).storeUint(query_id, 64).endCell();
    }
    static parseDropAdmin(slice: Slice) {
        const op = slice.loadUint(32);
        if(op !== Op.drop_admin) {
            throw new Error("Invalid op");
        }
        const queryId = slice.loadUint(64);
        endParse(slice);
        return {
            queryId
        }
    }
    async sendDropAdmin(provider: ContractProvider, via: Sender, value: bigint = toNano('0.05'), query_id: number | bigint = 0) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.dropAdminMessage(query_id),
            value
        });
    }


    static changeContentMessage(content: Cell | JettonMinterContent) {
        const contentString = content instanceof Cell ? content.beginParse().loadStringTail() : content.uri;
        return beginCell().storeUint(Op.change_metadata_url, 32).storeUint(0, 64) // op, queryId
            .storeStringTail(contentString)
            .endCell();
    }

    static parseChangeContent(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.change_metadata_url) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        const newMetadataUrl = slice.loadStringTail();
        endParse(slice);
        return {
            queryId,
            newMetadataUrl
        }
    }

    async sendChangeContent(provider: ContractProvider, via: Sender, content: Cell | JettonMinterContent) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.changeContentMessage(content),
            value: toNano("0.1"),
        });
    }

    static parseTransfer(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.transfer) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        const jettonAmount = slice.loadCoins();
        const toAddress = slice.loadAddress();
        const responseAddress = slice.loadAddress();
        const customPayload = slice.loadMaybeRef();
        const forwardTonAmount = slice.loadCoins();
        const inRef = slice.loadBit();
        const forwardPayload = inRef ? slice.loadRef().beginParse() : slice;
        return {
            queryId,
            jettonAmount,
            toAddress,
            responseAddress,
            customPayload,
            forwardTonAmount,
            forwardPayload
        }
    }

    static parseBurn(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.burn) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        const jettonAmount = slice.loadCoins();
        const responseAddress = slice.loadAddress();
        const customPayload = slice.loadMaybeRef();
        endParse(slice);
        return {
            queryId,
            jettonAmount,
            responseAddress,
            customPayload,
        }
    }

    static upgradeMessage(new_code: Cell, new_data: Cell, query_id: bigint | number = 0) {
        return beginCell().storeUint(Op.upgrade, 32).storeUint(query_id, 64)
            .storeRef(new_data)
            .storeRef(new_code)
            .endCell();
    }

    static parseUpgrade(slice: Slice) {
        const op = slice.loadUint(32);
        if (op !== Op.upgrade) throw new Error('Invalid op');
        const queryId = slice.loadUint(64);
        const newData = slice.loadRef();
        const newCode = slice.loadRef();
        endParse(slice);
        return {
            queryId,
            newData,
            newCode
        }
    }

    async sendUpgrade(provider: ContractProvider, via: Sender, new_code: Cell, new_data: Cell, value: bigint = toNano('0.1'), query_id: bigint | number = 0) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.upgradeMessage(new_code, new_data, query_id),
            value
        });
    }

    async getWalletAddress(provider: ContractProvider, owner: Address): Promise<Address> {
        const res = await provider.get('get_wallet_address', [{
            type: 'slice',
            cell: beginCell().storeAddress(owner).endCell()
        }])
        return res.stack.readAddress();
    }

    async getWalletSalt(provider: ContractProvider, owner: Address): Promise<bigint> {
        const res = await provider.get('get_wallet_state_init_and_salt', [{
            type: 'slice',
            cell: beginCell().storeAddress(owner).endCell()
        }])
        let stateInit = res.stack.readCell();
        return res.stack.readBigNumber();
    }

    async getJettonData(provider: ContractProvider) {
        let res = await provider.get('get_jetton_data', []);
        let totalSupply = res.stack.readBigNumber();
        let mintable = res.stack.readBoolean();
        let adminAddress = res.stack.readAddressOpt();
        let content = res.stack.readCell();
        let walletCode = res.stack.readCell();
        return {
            totalSupply,
            mintable,
            adminAddress,
            content,
            walletCode,
        };
    }

    async getTotalSupply(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        return res.totalSupply;
    }

    async getAdminAddress(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        return res.adminAddress;
    }

    async getContent(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        return res.content;
    }
    async getFullConfig(provider: ContractProvider) {
        const { code, data } = await this.getState(provider);
        return jettonMinterConfigCellToConfig(data);
    }
    async getState(provider: ContractProvider) {
        const state = await provider.getState();
        if(state.state.type !== 'active') {
            throw new Error(`Contract state is ${state.state.type}`);
        }
        if(!state.state.code) {
            throw new Error(`Constract has no code`);
        }
        if(!state.state.data) {
            throw new Error(`Constract has no data`);
        }
        return {
            code: Cell.fromBoc(state.state.code)[0],
            data: Cell.fromBoc(state.state.data)[0],
            last: state.last
        }
    }
    async getNextAdminAddress(provider: ContractProvider) {
        const res = await provider.get('get_next_admin_address', []);
        return res.stack.readAddressOpt();
    }
}



================================================
FILE: wrappers/JettonMinterChecker.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonMinterChecker.ts
================================================
import {
    addressToString,
    assert,
    base64toCell,
    equalsMsgAddresses,
    formatAddressAndUrl,
    parseContentCell,
    sendToIndex
} from "../wrappers/ui-utils";
import {Address, Cell, fromNano, OpenedContract} from "@ton/core";
import {JettonMinter, jettonMinterConfigCellToConfig, parseJettonMinterData} from "../wrappers/JettonMinter";
import {NetworkProvider, UIProvider} from "@ton/blueprint";
import {fromUnits} from "../wrappers/units";

export const checkJettonMinter = async (
    jettonMinterAddress: {
        isBounceable: boolean,
        isTestOnly: boolean,
        address: Address
    },
    jettonMinterCode: Cell,
    jettonWalletCode: Cell,
    provider: NetworkProvider,
    ui: UIProvider,
    isTestnet: boolean,
    silent: boolean
) => {

    const write = (message: string) => {
        if (!silent) {
            ui.write(message);
        }
    }

    // Account State and Data

    const result = await sendToIndex('account', {address: addressToString(jettonMinterAddress)}, provider);
    write('Contract status: ' + result.status);

    assert(result.status === 'active', "Contract not active", ui);

    if (base64toCell(result.code).equals(jettonMinterCode)) {
        write('The contract code matches the jetton-minter code from this repository');
    } else {
        throw new Error('The contract code DOES NOT match the jetton-minter code from this repository');
    }

    write('Toncoin balance on jetton-minter: ' + fromNano(result.balance) + ' TON');

    const data = base64toCell(result.data);
    const parsedData = jettonMinterConfigCellToConfig(data);

    if (parsedData.wallet_code.equals(jettonWalletCode)) {
        write('The jetton-wallet code matches the jetton-wallet code from this repository');
    } else {
        throw new Error('The jetton-wallet DOES NOT match the jetton-wallet code from this repository');
    }

    const metadataUrl: string = (parsedData.jetton_content as Cell).beginParse().loadStringTail();

    // Get-methods

    const jettonMinterContract: OpenedContract<JettonMinter> = provider.open(JettonMinter.createFromAddress(jettonMinterAddress.address));
    const getData = await jettonMinterContract.getJettonData();

    assert(getData.totalSupply === parsedData.supply, "Total supply doesn't match", ui);
    if(parsedData.admin === null) {
        assert(getData.adminAddress === null, "Admin address doesn't match", ui);
    }
    else {
        assert(getData.adminAddress!.equals(parsedData.admin), "Admin address doesn't match", ui);
    }


    let decimals: number;
    const parsedContent = await parseContentCell(getData.content);
    if (parsedContent instanceof String) {
        throw new Error('content not HashMap');
    } else {
        const contentMap: any = parsedContent;
        console.assert(contentMap['uri'], metadataUrl, "Metadata URL doesn't match");
        const decimalsString = contentMap['decimals'];
        decimals = parseInt(decimalsString);
        if (isNaN(decimals)) {
            throw new Error('invalid decimals');
        }
    }

    assert(getData.walletCode.equals(parsedData.wallet_code), "Jetton-wallet code doesn't match", ui);

    const getNextAdminAddress = await jettonMinterContract.getNextAdminAddress();
    console.assert(equalsMsgAddresses(getNextAdminAddress, parsedData.transfer_admin), "Next admin address doesn't match");

    // StateInit

    const jettonMinterContract2 = JettonMinter.createFromConfig({
        admin: parsedData.admin,
        wallet_code: jettonWalletCode,
        jetton_content: {
            uri: metadataUrl
        },
        merkle_root: parsedData.merkle_root
    }, jettonMinterCode)

    if (jettonMinterContract2.address.equals(jettonMinterAddress.address)) {
        write('StateInit matches');
    }

    // Print

    write('Decimals: ' + decimals);
    write('Total Supply: ' + fromUnits(parsedData.supply, decimals));
    write('Mintable: ' + getData.mintable);
    write(`Metadata URL: "${metadataUrl}"`);
    write('Current admin address: ' + (await formatAddressAndUrl(parsedData.admin, provider, isTestnet)));
    const nextAdminAddress = parsedData.transfer_admin;
    if (!nextAdminAddress) {
        write('Next admin address: null');
    } else {
        write('Next admin address: ' + (await formatAddressAndUrl(nextAdminAddress, provider, isTestnet)));
    }

    return {
        jettonMinterContract,
        adminAddress: parsedData.admin,
        nextAdminAddress: parsedData.transfer_admin,
        decimals
    }
}



================================================
FILE: wrappers/JettonMinterTest.compile.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonMinterTest.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    targets: ['contracts/test-minter.fc'],
};



================================================
FILE: wrappers/JettonMinterTest.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonMinterTest.ts
================================================
import { JettonMinter, JettonMinterConfig, jettonMinterConfigToCell } from './JettonMinter';
import { Address, beginCell, Cell, contractAddress, ContractProvider } from '@ton/core';

export class JettonMinterTest extends JettonMinter {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
        super(address, init);
    }
    static createFromAddress(address: Address) {
        return new JettonMinterTest(address);
    }

    static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = {code, data};
        return new JettonMinterTest(contractAddress(workchain, init), init);
    }

    async getSalt(provider: ContractProvider, owner: Address) {
        const { stack } = await provider.get('get_wallet_state_init_and_salt', [{
            type: 'slice',
            cell: beginCell().storeAddress(owner).endCell()
        }]);

        return {
            state_init: stack.readCell(),
            salt: stack.readBigNumber()
        }
    }
    async getSaltCheap(provider: ContractProvider, owner: Address) {
        const { stack } = await provider.get('get_wallet_state_init_and_salt_cheap', [{
            type: 'slice',
            cell: beginCell().storeAddress(owner).endCell()
        }]);

        return {
            state_init: stack.readCell(),
            salt: stack.readBigNumber()
        }
    }
}



================================================
FILE: wrappers/JettonWallet.compile.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonWallet.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    targets: ['contracts/jetton-wallet.fc'],
};



================================================
FILE: wrappers/JettonWallet.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonWallet.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Slice, toNano } from '@ton/core';
import { Op } from './JettonConstants';
import {endParse} from "./JettonMinter";

export type JettonWalletConfig = {
    ownerAddress: Address,
    jettonMasterAddress: Address,
    merkleRoot: bigint,
    salt: bigint,
};

export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
    return beginCell()
        .storeUint(0, 4) // status
        .storeCoins(0) // jetton balance
        .storeAddress(config.ownerAddress)
        .storeAddress(config.jettonMasterAddress)
        .storeUint(config.merkleRoot, 256)
        .storeUint(config.salt, 10)
        .endCell();
}

export function parseJettonWalletData(data: Cell) {
    const sc = data.beginParse()
    const parsed = {
        status: sc.loadUint(4),
        balance: sc.loadCoins(),
        ownerAddress: sc.loadAddress(),
        jettonMasterAddress: sc.loadAddress(),
        merkleRoot: sc.loadUint(256),
        salt: sc.loadUint(10),
    };
    endParse(sc);
    return parsed;
}

export class JettonWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonWallet(address);
    }

    static createFromConfig(config: JettonWalletConfig, code: Cell, workchain = 0) {
        const data = jettonWalletConfigToCell(config);
        const init = { code, data };
        return new JettonWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getWalletData(provider: ContractProvider) {
        let { stack } = await provider.get('get_wallet_data', []);
        return {
            balance: stack.readBigNumber(),
            owner: stack.readAddress(),
            minter: stack.readAddress(),
            wallet_code: stack.readCell()
        }
    }
    async getJettonBalance(provider: ContractProvider) {
        let state = await provider.getState();
        if (state.state.type !== 'active') {
            return 0n;
        }
        let res = await provider.get('get_wallet_data', []);
        return res.stack.readBigNumber();
    }
    async getWalletStatus(provider: ContractProvider) {
        let state = await provider.getState();
        if (state.state.type !== 'active') {
            return 0;
        }
        let res = await provider.get('get_status', []);
        return res.stack.readNumber();
    }
    static claimPayload(proof: Cell) {
        return beginCell().storeUint(Op.airdrop_claim, 32)
                          .storeRef(proof)
               .endCell();
    }
    static transferMessage(jetton_amount: bigint, to: Address,
                           responseAddress:Address | null,
                           customPayload: Cell | null,
                           forward_ton_amount: bigint,
                           forwardPayload?: Cell | Slice | null) {

        const byRef   = forwardPayload instanceof Cell;
        const transferBody = beginCell().storeUint(Op.transfer, 32).storeUint(0, 64) // op, queryId
                          .storeCoins(jetton_amount)
                          .storeAddress(to)
                          .storeAddress(responseAddress)
                          .storeMaybeRef(customPayload)
                          .storeCoins(forward_ton_amount)
                          .storeBit(byRef);

        if(byRef) {
            transferBody.storeRef(forwardPayload);
        }
        else if(forwardPayload) {
            transferBody.storeSlice(forwardPayload);
        }
        return transferBody.endCell();
    }

    async sendTransfer(provider: ContractProvider, via: Sender,
                              value: bigint,
                              jetton_amount: bigint, to: Address,
                              responseAddress:Address,
                              customPayload: Cell | null,
                              forward_ton_amount: bigint,
                              forwardPayload?: Cell | Slice | null) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonWallet.transferMessage(jetton_amount, to, responseAddress, customPayload, forward_ton_amount, forwardPayload),
            value:value
        });

    }
    /*
      burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
                    response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                    = InternalMsgBody;
    */
    static burnMessage(jetton_amount: bigint,
                       responseAddress:Address | null,
                       customPayload: Cell | null) {
        return beginCell().storeUint(Op.burn, 32).storeUint(0, 64) // op, queryId
                          .storeCoins(jetton_amount).storeAddress(responseAddress)
                          .storeMaybeRef(customPayload)
               .endCell();
    }

    async sendBurn(provider: ContractProvider, via: Sender, value: bigint,
                          jetton_amount: bigint,
                          responseAddress:Address | null,
                          customPayload: Cell | null) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonWallet.burnMessage(jetton_amount, responseAddress, customPayload),
            value:value
        });

    }
    /*
      withdraw_tons#107c49ef query_id:uint64 = InternalMsgBody;
    */
    static withdrawTonsMessage() {
        return beginCell().storeUint(0x6d8e5e3c, 32).storeUint(0, 64) // op, queryId
               .endCell();
    }

    async sendWithdrawTons(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonWallet.withdrawTonsMessage(),
            value:toNano('0.1')
        });

    }
    /*
      withdraw_jettons#10 query_id:uint64 wallet:MsgAddressInt amount:Coins = InternalMsgBody;
    */
    static withdrawJettonsMessage(from:Address, amount:bigint) {
        return beginCell().storeUint(0x768a50b2, 32).storeUint(0, 64) // op, queryId
                          .storeAddress(from)
                          .storeCoins(amount)
                          .storeMaybeRef(null)
               .endCell();
    }

    async sendWithdrawJettons(provider: ContractProvider, via: Sender, from:Address, amount:bigint) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonWallet.withdrawJettonsMessage(from, amount),
            value:toNano('0.1')
        });

    }
}



================================================
FILE: wrappers/JettonWalletChecker.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/JettonWalletChecker.ts
================================================
import {Address, Cell, fromNano, OpenedContract} from "@ton/core";
import {NetworkProvider, UIProvider} from "@ton/blueprint";
import {
    addressToString,
    assert,
    base64toCell,
    formatAddressAndUrl,
    parseContentCell,
    sendToIndex
} from "../wrappers/ui-utils";
import {JettonWallet, parseJettonWalletData} from "../wrappers/JettonWallet";
import {JettonMinter} from "../wrappers/JettonMinter";
import {fromUnits} from "../wrappers/units";

export const checkJettonWallet = async (
    jettonWalletAddress: {
        isBounceable: boolean,
        isTestOnly: boolean,
        address: Address
    },
    jettonMinterCode: Cell,
    jettonWalletCode: Cell,
    provider: NetworkProvider,
    ui: UIProvider,
    isTestnet: boolean,
    silent: boolean
) => {

    const write = (message: string) => {
        if (!silent) {
            ui.write(message);
        }
    }

    // Account State and Data

    const result = await sendToIndex('account', {address: addressToString(jettonWalletAddress)}, provider);
    write('Contract status: ' + result.status);

    assert(result.status === 'active', "Contract not active", ui);

    if (base64toCell(result.code).equals(jettonWalletCode)) {
        write('The contract code matches the jetton-wallet code from this repository');
    } else {
        throw new Error('The contract code DOES NOT match the jetton-wallet code from this repository');
    }

    write('Toncoin balance on jetton-wallet: ' + fromNano(result.balance) + ' TON');

    const data = base64toCell(result.data);
    const parsedData = parseJettonWalletData(data);

    // Check in jetton-minter

    const jettonMinterContract: OpenedContract<JettonMinter> = provider.open(JettonMinter.createFromAddress(parsedData.jettonMasterAddress));
    const jettonWalletAddress2 = await jettonMinterContract.getWalletAddress(parsedData.ownerAddress);
    assert(jettonWalletAddress2.equals(jettonWalletAddress.address), "fake jetton-minter", ui);


    const {content} = await jettonMinterContract.getJettonData();
    let decimals: number;
    const parsedContent = await parseContentCell(content);
    if (parsedContent instanceof String) {
        throw new Error('content not HashMap');
    } else {
        const contentMap: any = parsedContent;
        const decimalsString = contentMap['decimals'];
        decimals = parseInt(decimalsString);
        if (isNaN(decimals)) {
            throw new Error('invalid decimals');
        }
    }

    // Get-methods

    const jettonWalletContract: OpenedContract<JettonWallet> = provider.open(JettonWallet.createFromAddress(jettonWalletAddress.address));
    const getData = await jettonWalletContract.getWalletData();

    assert(getData.balance === parsedData.balance, "Balance doesn't match", ui);
    assert(getData.owner.equals(parsedData.ownerAddress), "Owner address doesn't match", ui);
    assert(getData.minter.equals(parsedData.jettonMasterAddress), "Jetton master address doesn't match", ui);
    assert(getData.wallet_code.equals(jettonWalletCode), "Jetton wallet code doesn't match", ui);

    // StateInit

    const jettonWalletContract2 = JettonWallet.createFromConfig({
        ownerAddress: parsedData.ownerAddress,
        jettonMasterAddress: parsedData.jettonMasterAddress
    }, jettonWalletCode);

    if (jettonWalletContract2.address.equals(jettonWalletAddress.address)) {
        write('StateInit matches');
    }

    // Print

    write('Jetton-wallet status: ' + parsedData.status);
    write('Balance: ' + fromUnits(parsedData.balance, decimals));
    write('Owner address: ' + (await formatAddressAndUrl(parsedData.ownerAddress, provider, isTestnet)));
    write('Jetton-minter address: ' + (await formatAddressAndUrl(parsedData.jettonMasterAddress, provider, isTestnet)));


    return {
        jettonWalletContract,
        jettonBalance: parsedData.balance
    }
}



================================================
FILE: wrappers/Librarian.compile.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/Librarian.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile:CompilerConfig = {
	targets: ['contracts/helpers/librarian.func']
};



================================================
FILE: wrappers/Librarian.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/Librarian.ts
================================================
import { Address, toNano, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Message, storeMessage } from '@ton/core';


export type LibrarianConfig = {
  code: Cell;
};

export function librarianConfigToCell(config: LibrarianConfig): Cell {
    return config.code;
}
export class Librarian implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY
        });
    }

    static createFromAddress(address: Address) {
        return new Librarian(address);
    }

    static createFromConfig(config: LibrarianConfig, code: Cell, workchain = -1) {
        const data = librarianConfigToCell(config);
        const init = { code, data };
        return new Librarian(contractAddress(workchain, init), init);
    }

}



================================================
FILE: wrappers/ui-utils.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/ui-utils.ts
================================================
import {NetworkProvider, sleep, UIProvider} from '@ton/blueprint';
import {Address, beginCell, Builder, Cell, Dictionary, DictionaryValue, Slice} from "@ton/core";
import {sha256} from 'ton-crypto';
import {TonClient4} from "@ton/ton";
import {base64Decode} from "@ton/sandbox/dist/utils/base64";
import {toUnits} from "./units";

export const defaultJettonKeys = ["uri", "name", "description", "image", "image_data", "symbol", "decimals", "amount_style"];
export const defaultNftKeys = ["uri", "name", "description", "image", "image_data"];

export const promptBool = async (prompt: string, options: [string, string], ui: UIProvider, choice: boolean = false) => {
    let yes = false;
    let no = false;
    let opts = options.map(o => o.toLowerCase());

    do {
        let res = (choice ? await ui.choose(prompt, options, (c: string) => c) : await ui.input(`${prompt}(${options[0]}/${options[1]})`)).toLowerCase();
        yes = res == opts[0]
        if (!yes)
            no = res == opts[1];
    } while (!(yes || no));

    return yes;
}

export const promptAddress = async (prompt: string, provider: UIProvider, fallback?: Address) => {
    let promptFinal = fallback ? prompt.replace(/:$/, '') + `(default:${fallback}):` : prompt;
    do {
        let testAddr = (await provider.input(promptFinal)).replace(/^\s+|\s+$/g, '');
        try {
            return testAddr == "" && fallback ? fallback : Address.parse(testAddr);
        } catch (e) {
            provider.write(testAddr + " is not valid!\n");
            prompt = "Please try again:";
        }
    } while (true);

};

export const promptBigInt = async (prompt: string, provider: UIProvider) => {
    do {
        try {
            return BigInt(await provider.input(prompt));
        }
        catch(e) {
            provider.write(`Unable to parse input merkle root:${e}`);
        }
    } while(true);
}

export const promptToncoin = async (prompt: string, provider: UIProvider) => {
    return promptAmount(prompt, 9, provider);
}

export const promptAmount = async (prompt: string, decimals: number, provider: UIProvider) => {
    let resAmount: bigint;
    do {
        const inputAmount = await provider.input(prompt);
        try {
            resAmount = toUnits(inputAmount, decimals);

            if (resAmount <= 0) {
                throw new Error("Please enter positive number");
            }

            return resAmount;
        } catch (e: any) {
            provider.write(e.message);
        }
    } while (true);
}

export const getLastBlock = async (provider: NetworkProvider) => {
    return (await (provider.api() as TonClient4).getLastBlock()).last.seqno;
}
export const getAccountLastTx = async (provider: NetworkProvider, address: Address) => {
    const res = await (provider.api() as TonClient4).getAccountLite(await getLastBlock(provider), address);
    if (res.account.last == null)
        throw (Error("Contract is not active"));
    return res.account.last.lt;
}
export const waitForTransaction = async (provider: NetworkProvider, address: Address, curTx: string | null, maxRetry: number, interval: number = 1000) => {
    let done = false;
    let count = 0;
    const ui = provider.ui();

    do {
        const lastBlock = await getLastBlock(provider);
        ui.write(`Awaiting transaction completion (${++count}/${maxRetry})`);
        await sleep(interval);
        const curState = await (provider.api() as TonClient4).getAccountLite(lastBlock, address);
        if (curState.account.last !== null) {
            done = curState.account.last.lt !== curTx;
        }
    } while (!done && count < maxRetry);
    return done;
}

const keysToHashMap = async (keys: string[]) => {
    let keyMap: { [key: string]: bigint } = {};
    for (let i = 0; i < keys.length; i++) {
        keyMap[keys[i]] = BigInt("0x" + (await sha256(keys[i])).toString('hex'));
    }
}

const contentValue: DictionaryValue<string> = {
    serialize: (src: string, builder: Builder) => {
        builder.storeRef(beginCell().storeUint(0, 8).storeStringTail(src).endCell());
    },
    parse: (src: Slice) => {
        const sc = src.loadRef().beginParse();
        const prefix = sc.loadUint(8);
        if (prefix == 0) {
            return sc.loadStringTail();
        } else if (prefix == 1) {
            // Not really tested, but feels like it should work
            const chunkDict = Dictionary.loadDirect(Dictionary.Keys.Uint(32), Dictionary.Values.Cell(), sc);
            return chunkDict.values().map(x => x.beginParse().loadStringTail()).join('');
        } else {
            throw (Error(`Prefix ${prefix} is not supported yet`));
        }
    }
};

export const parseContentCell = async (content: Cell) => {
    const cs = content.beginParse();
    const contentType = cs.loadUint(8);
    if (contentType == 1) {
        const noData = cs.remainingBits == 0;
        if (noData && cs.remainingRefs == 0) {
            throw new Error("No data in content cell!");
        } else {
            const contentUrl = noData ? cs.loadStringRefTail() : cs.loadStringTail();
            return contentUrl;
        }
    } else if (contentType == 0) {
        let contentKeys: string[];
        const contentDict = Dictionary.load(Dictionary.Keys.BigUint(256), contentValue, cs);
        const contentMap: { [key: string]: string } = {};

        for (const name of defaultJettonKeys) {
            // I know we should pre-compute hashed keys for known values... just not today.
            const dictKey = BigInt("0x" + (await sha256(name)).toString('hex'))
            const dictValue = contentDict.get(dictKey);
            if (dictValue !== undefined) {
                contentMap[name] = dictValue;
            }
        }
        return contentMap;
    } else {
        throw new Error(`Unknown content format indicator:${contentType}\n`);
    }
}

export const displayContentCell = async (contentCell: Cell, ui: UIProvider, jetton: boolean = true, additional?: string[]) => {
    const content = await parseContentCell(contentCell);

    if (content instanceof String) {
        ui.write(`Content metadata url:${content}\n`);
    } else {
        ui.write(`Content:${JSON.stringify(content, null, 2)}`);
    }
}

export const promptUrl = async (prompt: string, ui: UIProvider) => {
    let retry = false;
    let input = "";
    let res = "";

    do {
        input = await ui.input(prompt);
        try {
            let testUrl = new URL(input);
            res = testUrl.toString();
            retry = false;
        } catch (e) {
            ui.write(input + " doesn't look like a valid url:\n" + e);
            retry = !(await promptBool('Use anyway?(y/n)', ['y', 'n'], ui));
        }
    } while (retry);
    return input;
}

export const explorerUrl = (address: string, isTestnet: boolean) => {
    return (isTestnet ? 'https://testnet.tonscan.org/address/' : 'https://tonscan.org/address/') + address;
}

export const promptUserFriendlyAddress = async (prompt: string, provider: UIProvider, isTestnet: boolean) => {
    do {
        const s = await provider.input(prompt);
        if (Address.isFriendly(s)) {
            const address = Address.parseFriendly(s);
            if (address.isTestOnly && !isTestnet) {
                provider.write("Please enter mainnet address");
                prompt = "Please try again:";
            } else {
                return address;
            }
        } else {
            provider.write(s + " is not valid!\n");
            prompt = "Please try again:";
        }
    } while (true);
}

export const addressToString = (address: {
    isBounceable: boolean,
    isTestOnly: boolean,
    address: Address
}) => {
    return address.address.toString({
        bounceable: address.isBounceable,
        testOnly: address.isTestOnly
    })
}

export const base64toCell = (base64: string) => {
    const bytes = base64Decode(base64);
    const buffer = Buffer.from(bytes);
    return Cell.fromBoc(buffer)[0];
}

export const equalsMsgAddresses = (a: Address | null, b: Address | null) => {
    if (!a) return !b;
    if (!b) return !a;
    return a.equals(b);
}

export const sendToIndex = async (method: string, params: any, provider: NetworkProvider) => {
    const isTestnet = provider.network() !== 'mainnet';
    const mainnetRpc = 'https://toncenter.com/api/v3/';
    const testnetRpc = 'https://testnet.toncenter.com/api/v3/';
    const rpc = isTestnet ? testnetRpc : mainnetRpc;

    const apiKey = (provider.api() as any).api.parameters.apiKey!; // todo: provider.api().parameters.apiKey is undefined

    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
    };

    const response = await fetch(rpc + method + '?' + new URLSearchParams(params), {
        method: 'GET',
        headers: headers,
    });
    return response.json();
}

export const getAddressFormat = async (address: Address, provider: NetworkProvider, isTestnet: boolean) => {
    const result = await sendToIndex('wallet', {address: address}, provider);

    const nonBounceable = (result.status === "uninit") || (result.wallet_type && result.wallet_type.startsWith('wallet'));

    return {
        isBounceable: !nonBounceable,
        isTestOnly: isTestnet,
        address
    }
}

export const formatAddressAndUrl = async (address: Address, provider: NetworkProvider, isTestnet: boolean) => {
    const f = await getAddressFormat(address, provider, isTestnet);
    const addressString = addressToString(f);
    return addressString + ' ' + explorerUrl(addressString, isTestnet);
}

export const jettonWalletCodeFromLibrary = (jettonWalletCodeRaw: Cell) => {
    // https://docs.ton.org/tvm.pdf, page 30
    // Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2
    // and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
    // reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

    const libraryReferenceCell = beginCell().storeUint(2, 8).storeBuffer(jettonWalletCodeRaw.hash()).endCell();

    return new Cell({exotic: true, bits: libraryReferenceCell.bits, refs: libraryReferenceCell.refs});
}

export const assert = (condition: boolean, error: string, ui: UIProvider) => {
    if (!condition) {
        ui.write(error);
        throw new Error();
    }
}



================================================
FILE: wrappers/units.ts
URL: https://github.com/ton-community/mintless-jetton/blob/main/wrappers/units.ts
================================================

function getMultiplier(decimals: number): bigint {
    let x = 1n;
    for (let i = 0; i < decimals; i++) {
        x *= 10n;
    }
    return x;
}

export function toUnits(src: string | bigint, decimals: number): bigint {
    const MULTIPLIER = getMultiplier(decimals);

    if (typeof src === 'bigint') {
        return src * MULTIPLIER;
    } else {

        // Check sign
        let neg = false;
        while (src.startsWith('-')) {
            neg = !neg;
            src = src.slice(1);
        }

        // Split string
        if (src === '.') {
            throw Error('Invalid number');
        }
        let parts = src.split('.');
        if (parts.length > 2) {
            throw Error('Invalid number');
        }

        // Prepare parts
        let whole = parts[0];
        let frac = parts[1];
        if (!whole) {
            whole = '0';
        }
        if (!frac) {
            frac = '0';
        }
        if (frac.length > decimals && decimals != 0) {
            throw Error('Invalid number');
        }
        while (frac.length < decimals) {
            frac += '0';
        }

        // Convert
        let r = BigInt(whole) * MULTIPLIER + BigInt(frac);
        if (neg) {
            r = -r;
        }
        return r;
    }
}

export function fromUnits(src: bigint | string, decimals: number): string {
    const MULTIPLIER = getMultiplier(decimals);

    let v = BigInt(src);
    let neg = false;
    if (v < 0) {
        neg = true;
        v = -v;
    }

    // Convert fraction
    let frac = v % MULTIPLIER;
    let facStr = frac.toString();
    while (facStr.length < decimals) {
        facStr = '0' + facStr;
    }
    facStr = facStr.match(/^([0-9]*[1-9]|0)(0*)/)![1];

    // Convert whole
    let whole = v / MULTIPLIER;
    let wholeStr = whole.toString();

    // Value
    let value = `${wholeStr}${facStr === '0' ? '' : `.${facStr}`}`;
    if (neg) {
        value = '-' + value;
    }

    return value;
}



# Repository: contract-verifier-contracts
URL: https://github.com/ton-community/contract-verifier-contracts
Branch: main

## Directory Structure:
```
└── contract-verifier-contracts/
    ├── LICENSE
    ├── README.md
    ├── contracts/
        ├── imports/
            ├── params.fc
            ├── stdlib.fc
        ├── source-item-dummy.fc
        ├── source-item.fc
        ├── sources-registry-only-set-code.fc
        ├── sources-registry.fc
        ├── verifier-registry.fc
        ├── verifier-registry.tlb
    ├── package.json
    ├── test/
        ├── e2e/
            ├── e2e.ts
        ├── unit/
            ├── helpers.ts
            ├── integration.spec.ts
            ├── sources-registry.spec.ts
            ├── verifier-registry.spec.ts
    ├── wrappers/
        ├── source-item.compile.ts
        ├── source-item.ts
        ├── sources-registry-only-set-code.compile.ts
        ├── sources-registry-only-set-code.ts
        ├── sources-registry.compile.ts
        ├── sources-registry.ts
        ├── verifier-registry.compile.ts
        ├── verifier-registry.ts
```

## Files Content:

================================================
FILE: LICENSE
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/LICENSE
================================================
MIT License

Copyright (c) 2022 Orbs.com

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
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/README.md
================================================
# contract-verifier-contracts

A sources registry contract for registering a data url for a given code cell hash.
The contract accepts messages from a designated verifier registry contract.

Implementation is based on [TEP-91 suggestion](https://github.com/ton-blockchain/TEPs/pull/91).

This repo is a part of the following:
1. [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) (this repo) - Sources registry contracts which stores an on-chain proof per code cell hash.
2. [contract-verifier-backend](https://github.com/ton-community/contract-verifier-backend) - Backend for compiling FunC and returning a signature over a message containing the resulting code cell hash.
3. [contract-verifier-sdk](https://github.com/ton-community/contract-verifier-sdk) - A UI component to fetch and display sources from Ton blockchain and IPFS, including code highlighting.
4. [contract-verifier](https://github.com/ton-community/contract-verifier) - A UI app to interact with the backend, contracts and publish an on-chain proof.

## E2E tests
(e2e.ts in test/e2e)
1. Pre-deploy (using `npm run build && npm run deploy`) the sources registry contract -> change min_tons in sources_registry.fc to a small amount, otherwise tests are too costly. 
2. Provide two mnemonics via .env
3. Flows carried out:
   * (Sender: wallet1) Change admin from wallet1 to wallet2
   * (Sender: wallet2) Change verifier address from actual to zero address; then revert to actual
   * (Sender: wallet2) Set code to `sources-registry-only-set-code.fc`; then revert to original
   * (Sender: wallet2) Change admin from wallet2 to wallet1
   * (Sender: wallet1) Set source item code to `...?.fc`; then revert to original
   
   
# License
MIT



================================================
FILE: contracts/imports/params.fc
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/imports/params.fc
================================================
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}


================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
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
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";



================================================
FILE: contracts/source-item-dummy.fc
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/source-item-dummy.fc
================================================
;;
;;  Source item smart contract - DUMMY FOR TESTS
;;

#pragma version >=0.2.0;
#include "imports/stdlib.fc";

const int error::access_denied = 401;
const int error::unknown_op = 0xffff;

;;
;;  Storage
;;
;;  uint256 verifier_id
;;  uint256 verified_code_cell_hash
;;  MsgAddressInt source_item_registry
;;  cell content
;;
(int, int, int, slice, cell) load_data() {
    slice ds = get_data().begin_parse();
    var (verifier_id, verified_code_cell_hash, source_item_registry) = (ds~load_uint(256), ds~load_uint(256), ds~load_msg_addr());
    if (ds.slice_refs() > 0) {
      return (-1, verifier_id, verified_code_cell_hash, source_item_registry, ds~load_ref());
    } else {
      return (0, verifier_id, verified_code_cell_hash, source_item_registry, null()); ;; not initialized yet
    }
}

() store_data(int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) impure {
    set_data(
        begin_cell()
            .store_uint(verifier_id, 256)
            .store_uint(verified_code_cell_hash, 256)
            .store_slice(source_item_registry)
            .store_ref(content)
            .end_cell()
    );
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

    (int init?, int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) = load_data();
    if (~ init?) {
      throw_unless(error::access_denied, equal_slices(source_item_registry, sender_address));
      store_data(verifier_id, verified_code_cell_hash, source_item_registry, begin_cell().store_slice(in_msg_body).end_cell());
      return ();
    }

    throw(error::unknown_op);
}

;;
;;  GET Methods
;;
(int, int, int, slice, cell) get_dummy_data() method_id {
  (int init?, int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) = load_data();
  return (init?, verifier_id, verified_code_cell_hash, source_item_registry, content);
}


================================================
FILE: contracts/source-item.fc
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/source-item.fc
================================================
;;
;;  Source item smart contract
;;

#pragma version >=0.2.0;
#include "imports/stdlib.fc";

const int error::access_denied = 401;
const int error::unknown_op = 0xffff;

;;  Storage
;;
;;  uint256 verifier_id
;;  uint256 verified_code_cell_hash
;;  MsgAddressInt source_item_registry
;;  cell content
;;
(int, int, slice, cell) load_data() {
    slice ds = get_data().begin_parse();
    var (verifier_id, verified_code_cell_hash, source_item_registry) = (ds~load_uint(256), ds~load_uint(256), ds~load_msg_addr());
    return (verifier_id, verified_code_cell_hash, source_item_registry, ds.slice_refs_empty?() ? null() : ds~load_ref());
}

() store_data(int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) impure {
    set_data(
        begin_cell()
            .store_uint(verifier_id, 256)
            .store_uint(verified_code_cell_hash, 256)
            .store_slice(source_item_registry)
            .store_ref(content)
            .end_cell()
    );
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

    (int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) = load_data();
    throw_unless(error::access_denied, equal_slices(source_item_registry, sender_address));
    store_data(verifier_id, verified_code_cell_hash, source_item_registry, begin_cell().store_slice(in_msg_body).end_cell());
}

;;
;;  GET Methods
;;
(int, int, slice, cell) get_source_item_data() method_id {
  (int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) = load_data();
  return (verifier_id, verified_code_cell_hash, source_item_registry, content);
}


================================================
FILE: contracts/sources-registry-only-set-code.fc
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/sources-registry-only-set-code.fc
================================================
;; DUMMY CODE for tests only

;; storage scheme
;; storage#_ verifier_registry_address:MsgAddress
;;           source_item_code:^Cell
;;           = Storage;
#pragma version >=0.2.0;
#include "imports/stdlib.fc";
#include "imports/params.fc";

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

  if (op == 9988) {
    cell new_code = in_msg_body~load_ref();
    in_msg_body.end_parse();
    set_code(new_code);
    return ();
  }

  throw(203);
}

int get_am_i_replaced() method_id {
  return 742;
}


================================================
FILE: contracts/sources-registry.fc
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/sources-registry.fc
================================================
;; Sources registry smart contract (based on nft collection)

;; storage scheme
;; storage#_ 
;;           min_ton: (VarUInteger 16)
;;           max_ton: (VarUInteger 16)
;;           admin_address:MsgAddress
;;           verifier_registry_address:MsgAddress
;;           source_item_code:^Cell
;;           = Storage;
#pragma version >=0.2.0;
#include "imports/stdlib.fc";
#include "imports/params.fc";

const int op::deploy_source_item = 1002;
const int op::change_verifier_registry = 2003;
const int op::change_admin = 3004;
const int op::set_source_item_code = 4005;
const int op::set_code = 5006;
const int op::set_deployment_costs = 6007;

const int error::invalid_value = 903;
const int error::invalid_cell_code = 902;
const int error::too_much_value = 901;
const int error::not_enough_value = 900;
const int error::access_denied = 401;
const int error::verifier_id_mismatch = 402;
const int error::unknown_op = 0xffff;

const int min_tons_lower_bound = 65000000; ;; 0.065 TON

(int, int, slice, slice, cell) load_data() inline {
  var ds = get_data().begin_parse();
  return (
    ds~load_grams(), ;; min_ton
    ds~load_grams(), ;; max_ton
    ds~load_msg_addr(), ;; admin
    ds~load_msg_addr(), ;; verifier_registry_address
    ds~load_ref() ;; source_item_code
  );
}

() save_data(int min_ton, int max_ton, slice admin_address, slice verifier_registry_address, cell source_item_code) impure inline {
  set_data(begin_cell()
    .store_grams(min_ton)
    .store_grams(max_ton)
    .store_slice(admin_address)
    .store_slice(verifier_registry_address)
    .store_ref(source_item_code)
    .end_cell());
}

cell calculate_source_item_state_init(int verifier_id, int verified_code_cell_hash, cell source_item_code) {
  cell data = begin_cell().store_uint(verifier_id, 256).store_uint(verified_code_cell_hash, 256).store_slice(my_address()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(source_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_source_item_address(int wc, cell state_init) {
  return begin_cell().store_uint(4, 3)
                     .store_int(wc, 8)
                     .store_uint(cell_hash(state_init), 256)
                     .end_cell()
                     .begin_parse();
}

() deploy_source_item(int verifier_id, int verified_code_cell_hash, cell source_item_code, cell source_content) impure {
  cell state_init = calculate_source_item_state_init(verifier_id, verified_code_cell_hash, source_item_code);
  slice source_address = calculate_source_item_address(workchain(), state_init);
  var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(source_address)
            .store_coins(0)
            .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
            .store_ref(state_init)
            .store_ref(source_content);
  send_raw_message(msg.end_cell(), 64);
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
  
  var (min_tons, max_tons, admin, verifier_registry, source_item_code) = load_data();

  if (equal_slices(sender_address, verifier_registry)) {
    ;; the verifier id authenticated by the verifier registry
    slice verifier_reg_cell = in_msg_body~load_ref().begin_parse();
    int verified_verifier_id = verifier_reg_cell~load_uint(256);
    slice forwarded_message = in_msg_body~load_ref().begin_parse();

    int op = forwarded_message~load_uint(32);
    int query_id = forwarded_message~load_uint(64);

    if (op == op::deploy_source_item) {
      throw_if(error::too_much_value, msg_value > max_tons);
      throw_if(error::not_enough_value, msg_value < min_tons_lower_bound);
      throw_if(error::not_enough_value, msg_value < min_tons);
      int verifier_id = forwarded_message~load_uint(256);
      throw_unless(error::verifier_id_mismatch, verifier_id == verified_verifier_id);
      int verified_code_cell_hash = forwarded_message~load_uint(256);
      cell source_content = forwarded_message~load_ref();
      forwarded_message.end_parse();
      deploy_source_item(verifier_id, verified_code_cell_hash, source_item_code, source_content);
      return ();
    }
  }

  int op = in_msg_body~load_uint(32);
  int query_id = in_msg_body~load_uint(64);

  if (op == op::change_verifier_registry) {
    throw_unless(error::access_denied, equal_slices(sender_address, admin));
    slice new_verifier_registry = in_msg_body~load_msg_addr();
    in_msg_body.end_parse();
    save_data(min_tons, max_tons, admin, new_verifier_registry, source_item_code);
    return ();
  }
  
  if (op == op::change_admin) {
    throw_unless(error::access_denied, equal_slices(sender_address, admin));
    slice new_admin = in_msg_body~load_msg_addr();
    in_msg_body.end_parse();
    save_data(min_tons, max_tons, new_admin, verifier_registry, source_item_code);
    return ();
  }
  
  if (op == op::set_source_item_code) {
    throw_unless(error::access_denied, equal_slices(sender_address, admin));
    cell new_source_item_code = in_msg_body~load_ref();
    throw_if(error::invalid_cell_code, new_source_item_code.begin_parse().slice_empty?());
    save_data(min_tons, max_tons, admin, verifier_registry, new_source_item_code);
    in_msg_body.end_parse();
    return ();
  }

  if (op == op::set_code) {
    throw_unless(error::access_denied, equal_slices(sender_address, admin));
    cell new_code = in_msg_body~load_ref();
    throw_if(error::invalid_cell_code, new_code.begin_parse().slice_empty?());
    in_msg_body.end_parse();
    set_code(new_code);
    return ();
  }
  
  if (op == op::set_deployment_costs) {
    throw_unless(error::access_denied, equal_slices(sender_address, admin));
    int new_min_tons = in_msg_body~load_grams();
    int new_max_tons = in_msg_body~load_grams();
    throw_unless(error::invalid_value, new_min_tons >= min_tons_lower_bound);
    throw_unless(error::invalid_value, new_max_tons >= new_min_tons);
    in_msg_body.end_parse();
    save_data(new_min_tons, new_max_tons, admin, verifier_registry, source_item_code);
    return ();
  }

  throw(error::unknown_op);
}

;; Get methods
slice get_source_item_address(int verifier_id, int verified_code_cell_hash) method_id {
  var (_, _, _, _, source_item_code) = load_data();
  cell state_init = calculate_source_item_state_init(verifier_id, verified_code_cell_hash, source_item_code);
  return calculate_source_item_address(workchain(), state_init);
}

slice get_verifier_registry_address() method_id {
  var (_, _, _, verifier_registry, _) = load_data();
  return verifier_registry;
}

slice get_admin_address() method_id {
  var (_, _, admin, _, _) = load_data();
  return admin;
}

(int,int) get_deployment_costs() method_id {
  var (min_ton, max_ton, _, _, _) = load_data();
  return (min_ton, max_ton);
}


================================================
FILE: contracts/verifier-registry.fc
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/verifier-registry.fc
================================================
;; Verifier registry smart contract

#pragma version >=0.2.0;

#include "imports/stdlib.fc";

global cell storage::verifiers;
global int storage::verifiers_num;

const int const::max_verifiers = 20;

const int op::update_verifier = 0x6002d61a;
const int op::remove_verifier = 0x19fa5637;
const int op::forward_message = 0x75217758;

const slice EXIT_TEXT       = "Withdrawal and exit from the verifier registry";
const slice REGISTERED_TEXT = "You were successfully registered as a verifier";
const slice UPDATED_TEXT    = "You successfully updated verifier data";

const int   EXIT_FEE = 200000000;      ;; 0.20 TON
const int   STAKE    = 1000000000000; ;; 1000 TON

() save_data() impure inline_ref {
    set_data(begin_cell()
            .store_dict(storage::verifiers)
            .store_uint(storage::verifiers_num,8)
            .end_cell());
}

() load_data() impure inline_ref {
    slice data = get_data().begin_parse();
    storage::verifiers = data~load_dict();
    storage::verifiers_num = data~load_uint(8);
}

() send_msg(int mode, slice to, int amount, slice comment) impure inline_ref {
    var msg = begin_cell()
            .store_uint(0x10, 6) ;; non bouncable
            .store_slice(to)
            .store_coins(amount)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(begin_cell()
                    .store_uint(0, 32)
                    .store_slice(comment)
                    .end_cell());

    send_raw_message(msg.end_cell(), mode);
}

() remove_verifier(int id, slice sender_address) impure inline {
    (slice cfg, int ok) = storage::verifiers.udict_get?(256, id);
    throw_if(404, ok == 0);

    slice admin = cfg~load_msg_addr();
    ;; allow only to admin
    throw_unless(401, equal_slices(sender_address, admin));

    ;; delete from verifiers list
    (cell verifiers, _) = storage::verifiers.udict_delete?(256, id);
    storage::verifiers = verifiers;
    storage::verifiers_num -= 1;

    ;; withdraw stake + return excess from message
    send_msg(64, admin, STAKE - EXIT_FEE, EXIT_TEXT);

    save_data();
}

() update_verifier(int id, slice new_settings, slice sender_address, int balance, int coins_sent) impure inline {
    slice admin = sender_address;
    throw_if(402, new_settings.slice_depth() > 10); ;; should allow for 100 nodes, prevents storage attack

    (slice cfg, int ok) = storage::verifiers.udict_get?(256, id);
    if (ok) { ;; exists, check is admin
        admin = cfg~load_msg_addr();
        ;; allow only to admin
        throw_unless(401, equal_slices(sender_address, admin));

        ;; return excess, ignore errors
        send_msg(64 + 2, admin, 0, UPDATED_TEXT);
    } else {
        throw_if(410, coins_sent < STAKE);
        throw_if(419, storage::verifiers_num >= const::max_verifiers);

        ;; return excess. send mode 1 (contract pays for the message transfer)
        send_msg(1, admin, coins_sent - STAKE, REGISTERED_TEXT);

        storage::verifiers_num += 1;
    }

    slice new_cfg = begin_cell()
            .store_slice(admin)
            .store_slice(new_settings)
            .end_cell().begin_parse();

    storage::verifiers = storage::verifiers.udict_set(256, id, new_cfg);

    save_data();
}

() forward_message(cell msg, cell signatures, slice sender_address) impure inline {
    slice msg_data = msg.begin_parse();
    int verifier_id = msg_data~load_uint(256);
    int valid_till = msg_data~load_uint(32);

    slice source_addr = msg_data~load_msg_addr();
    throw_unless(414, equal_slices(sender_address, source_addr));

    (slice verifier, int ok) = storage::verifiers.udict_get?(256, verifier_id);
    throw_if(404, ok == 0);
    verifier~load_msg_addr(); ;; skip admin
    int quorum = verifier~load_uint(8);
    cell pub_key_endpoints = verifier.preload_dict();

    ;; check msg ttl
    throw_if(411, valid_till < now());

    int valid_signatures = 0;
    int msg_hash = msg.cell_hash();
    int done = 0;
    while (done == 0) {
        slice s = signatures.begin_parse();
        slice sign = s~load_bits(512);
        int key = s~load_uint(256);

        ;; check key in dict and remove to not allow reuse in current context for more signatures
        (cell updated_list, _, int known) = pub_key_endpoints.udict_delete_get?(256, key);
        if (known & check_signature(msg_hash, sign, key)) {
            valid_signatures += 1;
            pub_key_endpoints = updated_list;
        }

        if ((valid_signatures >= quorum) | (s.slice_refs() == 0)) {
            done = 1;
        } else {
            signatures = s.preload_ref();
        }
    }

    throw_if(413, valid_signatures < quorum);

    slice target_addr = msg_data~load_msg_addr();
    cell payload_to_forward = msg_data~load_ref();

    send_raw_message( begin_cell()
            .store_uint(0x10, 6) ;; non bouncable
            .store_slice(target_addr)
            .store_coins(0)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(
            begin_cell()
                .store_ref(begin_cell().store_uint(verifier_id, 256).end_cell())  ;; attach the verifier id so downstream contract can ensure message is from the correct source
                .store_ref(payload_to_forward)            
            .end_cell()
        )
            .end_cell(), 64);

    save_data();
}

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
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

    load_data();

    if (op == op::forward_message) {
        cell msg = in_msg_body~load_ref();
        cell signatures = in_msg_body~load_ref();

        forward_message(msg, signatures, sender_address);
        return ();
    }
    if (op == op::update_verifier) {
        int id = in_msg_body~load_uint(256);
        slice new_settings = in_msg_body;

        ;; validation
        int quorum = in_msg_body~load_uint(8); 
        throw_unless(421, quorum > 0);

        in_msg_body~load_dict(); ;; pub_key_endpoints
        slice name_ref = in_msg_body~load_ref().begin_parse(); ;; name
        throw_unless(420, string_hash(name_ref) == id);
        in_msg_body~load_ref(); ;; url ref
        in_msg_body.end_parse();

        update_verifier(id, new_settings, sender_address, balance, msg_value);
        return ();
    }
    if (op == op::remove_verifier) {
        int id = in_msg_body~load_uint(256);

        remove_verifier(id, sender_address);
        return ();
    }
    throw(0xffff);
}

(slice, cell, int) get_verifier(int id) method_id {
    load_data();

    (slice cfg, int ok) = storage::verifiers.udict_get?(256, id);
    if (ok == 0) {
        return (begin_cell().end_cell().begin_parse(), begin_cell().end_cell(), 0);
    }

    slice admin = cfg~load_msg_addr();
    cell settings = begin_cell().store_slice(cfg).end_cell();
    return (admin, settings, -1);
}

int get_verifiers_num() method_id {
    load_data();

    return storage::verifiers_num;
}

(slice) get_verifiers() method_id {
    load_data();
    return begin_cell().store_dict(storage::verifiers).end_cell().begin_parse();
}


================================================
FILE: contracts/verifier-registry.tlb
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/contracts/verifier-registry.tlb
================================================
message_description#_ verifier_id:uint256 valid_until:uint32 source_addr:MsgAddress target_addr:MsgAddress msg:^Cell = MessageDescription
message_signatures#_ {n:#} signature:(bits 512) pub_key:uint256 next:^(MessageSignatureData n) = MessageSignatureData (n + 1)
message_signatures_last#_ signature:(bits 512) pub_key:uint256 = MessageSignatureData 1
forward_message {n:#} query_id:uint64 msg:^MessageDescription signatures:^(MessageSignatureData n) = InternalMsgBody

text#_ b:bits = TextCell;
verifier_settings#_ multi_sig_threshold:uint8 pub_key_endpoints:(HashMapE 256 uint32) name:^(TextCell) marketing_url:^(TextCell) = VerifierSettings
update_verifier query_id:uint64 verifier_id:uint256 settings:VerifierSettings = InternalMsgBody

remove_verifier query_id:uint64 id:uint256 = InternalMsgBody

verifier#_ admin:MsgAddress settings:VerifierSettings = Verifier
storage#_ verifiers:(HashMapE 256 Verifier) = Storage


================================================
FILE: package.json
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/package.json
================================================
{
  "name": "tonstarter-contracts",
  "description": "",
  "version": "0.0.0",
  "license": "MIT",
  "author": "",
  "scripts": {
    "prettier": "npx prettier --write '{test,contracts,build,wrappers}/**/*.{ts,js,json}'",
    "build": "npx blueprint build source-item && npx blueprint build sources-registry && npx blueprint build verifier-registry && npx blueprint build sources-registry-only-set-code",
    "test": "node --no-experimental-fetch node_modules/mocha/bin/mocha --exit test/**/*.spec.ts"
  },
  "devDependencies": {
    "@swc/core": "^1.2.177",
    "@ton-community/blueprint": "^0.10.0",
    "@ton-community/sandbox": "^0.11.0",
    "@ton-community/test-utils": "^0.2.0",
    "@types/chai": "^4.3.0",
    "@types/inquirer": "^9.0.7",
    "@types/mocha": "^9.0.0",
    "@types/semver": "^7.3.9",
    "axios-request-throttle": "^1.0.0",
    "bigint-buffer": "^1.1.5",
    "chai": "^4.3.4",
    "dotenv": "^16.0.0",
    "fast-glob": "^3.2.11",
    "mocha": "^9.1.3",
    "prando": "^6.0.1",
    "prettier": "^2.6.2",
    "ton": "^13.4.1",
    "ton-core": "^0.49.0",
    "ton-crypto": "^3.2.0",
    "ts-node": "^10.4.0",
    "typescript": "^4.5.4"
  },
  "prettier": {
    "printWidth": 100
  },
  "mocha": {
    "require": [
      "chai",
      "ts-node/register"
    ],
    "timeout": 20000
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "dependencies": {
    "@aws-crypto/sha256-js": "^2.0.1",
    "@orbs-network/ton-gateway": "^1.3.0",
    "semver": "^7.3.7",
    "tweetnacl": "^1.0.3"
  }
}



================================================
FILE: test/e2e/e2e.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/test/e2e/e2e.ts
================================================
import dotenv from "dotenv";
import { assert } from "chai";

import {
  Address,
  Cell,
  toNano,
  TonClient,
  WalletContractV3R2,
  OpenedContract,
} from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-gateway";
import { KeyPair, mnemonicToWalletKey } from "ton-crypto";
import { compile } from "@ton-community/blueprint";

import { zeroAddress } from "../unit/helpers";
import { SourcesRegistry } from "../../wrappers/sources-registry";
import { SourcesRegistryOnlySetCode } from "../../wrappers/sources-registry-only-set-code";

dotenv.config();

const ACTUAL_VERIFIER_REGISTRY = Address.parse("EQDZeSc_Mwu7YKcjopglrDLpLZsHGD5z1TK0xzEhD5ic8kBn");

async function getWallet(tc: TonClient, mnemonic: string[]) {
  const deployerMnemonic = mnemonic.join(" "); //(await mnemonicNew(24)).join(" ");

  const walletKey = await mnemonicToWalletKey(deployerMnemonic.split(" "));
  const walletContract = tc.open(
    WalletContractV3R2.create({ publicKey: walletKey.publicKey, workchain: 0 })
  );
  return { walletContract, walletKey };
}

async function waitToVerify(wallet: WalletStruct, seqnoBefore: number) {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  while (true) {
    await sleep(2000);
    const seqnoAfter = await wallet.walletContract.getSeqno();
    if (seqnoAfter > seqnoBefore) return;
  }
}

type WalletStruct = {
  walletContract: OpenedContract<WalletContractV3R2>;
  walletKey: KeyPair;
};

async function changeVerifierRegistryTests(
  sourcesRegistryContract: OpenedContract<SourcesRegistry>,
  wallet: WalletStruct
) {
  console.log("ℹ️ Testing changeVerifierRegistry()");

  async function changeVerifier(address: Address) {
    const seqno = await wallet.walletContract.getSeqno();

    await sourcesRegistryContract.sendChangeVerifierRegistry(
      wallet.walletContract.sender(wallet.walletKey.secretKey),
      { value: toNano("0.01"), newVerifierRegistry: address }
    );

    waitToVerify(wallet, seqno);
  }

  const verifierBefore = await sourcesRegistryContract.getVerifierRegistryAddress();
  console.log("Current verifier address is: ", verifierBefore.toString());

  await changeVerifier(zeroAddress);

  const verifierAfter = await sourcesRegistryContract.getVerifierRegistryAddress();
  console.log("After change to zero addr - verifier address is: ", verifierAfter.toString());

  assert(verifierAfter.equals(zeroAddress), "verifier registry address should be zero address");

  await changeVerifier(ACTUAL_VERIFIER_REGISTRY);
  const verifierReverted = await sourcesRegistryContract.getVerifierRegistryAddress();

  assert(
    verifierReverted.equals(ACTUAL_VERIFIER_REGISTRY),
    "verifier registry address should be reverted to original address"
  );

  console.log("After revert - verifier address is: ", verifierReverted.toString());
}

async function replaceAdmin(
  sourcesRegistryContract: OpenedContract<SourcesRegistry>,
  wallet: WalletStruct,
  newAdmin: Address
) {
  console.log("ℹ️ Replacing admin");

  const adminBefore = await sourcesRegistryContract.getAdminAddress();
  console.log("Current admin is: ", adminBefore!.toString());

  const seqno = await wallet.walletContract.getSeqno();

  await sourcesRegistryContract.sendChangeAdmin(
    wallet.walletContract.sender(wallet.walletKey.secretKey),
    { value: toNano("0.01"), newAdmin }
  );
  waitToVerify(wallet, seqno);

  const adminAfter = await sourcesRegistryContract.getAdminAddress();
  console.log("After change, admin is: ", adminAfter!.toString());

  assert(adminAfter!.equals(newAdmin), "Admin should be changed to new admin");
}

async function setCodeTests(
  sourcesRegistryContract: OpenedContract<SourcesRegistry>,
  tc: TonClient,
  wallet: WalletStruct
) {
  console.log("ℹ️ Testing setCode()");
  const dumyCodeCell = await compile("sources-registry-only-set-code");
  const actualCodeCell = await compile("sources-registry");

  async function changeCode(newCode: Cell) {
    const seqno = await wallet.walletContract.getSeqno();

    await sourcesRegistryContract.sendChangeCode(
      wallet.walletContract.sender(wallet.walletKey.secretKey),
      {
        value: toNano("0.01"),
        newCode,
      }
    );

    waitToVerify(wallet, seqno);
  }

  await changeCode(dumyCodeCell);

  const changedContract = tc.open(
    SourcesRegistryOnlySetCode.createFromAddress(sourcesRegistryContract.address)
  );

  const resp = await changedContract.getAmIReplaced();

  assert(resp === BigInt(742), "Contract should be replaced");

  // Revert code
  await changeCode(actualCodeCell);
}

async function setSourceItemCodeTests(
  sourcesRegistryContract: OpenedContract<SourcesRegistry>,
  wallet: WalletStruct
) {
  console.log("ℹ️ Testing setSourceItemCode()");

  const dumyCodeCell = await compile("sources-item-dummy");
  const actualCodeCell = await compile("sources-item");

  const origSourceItem = await sourcesRegistryContract.getSourceItemAddress(
    "testverifier",
    "dummyCodeCellHash"
  );

  async function setSourceItemCode(newCode: Cell) {
    const seqno = await wallet.walletContract.getSeqno();

    await sourcesRegistryContract.sendSetSourceItemCode(
      wallet.walletContract.sender(wallet.walletKey.secretKey),
      { value: toNano("0.01"), newCode }
    );

    waitToVerify(wallet, seqno);
  }

  await setSourceItemCode(dumyCodeCell);

  const modifiedSourceItem = await sourcesRegistryContract.getSourceItemAddress(
    "testverifier",
    "dummyCodeCellHash"
  );

  assert(origSourceItem.equals(modifiedSourceItem), "Source item address should be changed");

  await setSourceItemCode(actualCodeCell);

  const originalSourceItem2 = await sourcesRegistryContract.getSourceItemAddress(
    "testverifier",
    "dummyCodeCellHash"
  );

  assert(
    origSourceItem.equals(originalSourceItem2),
    "Source item address should equal after revert"
  );
}

(async function E2E({ sourcesRegistryAddress }: { sourcesRegistryAddress: Address }) {
  const endpoint = await getHttpEndpoint();
  const tc = new TonClient({ endpoint });
  const sourcesRegistryContract = tc.open(
    SourcesRegistry.createFromAddress(sourcesRegistryAddress)
  );

  const [wallet1, wallet2] = [
    await getWallet(tc, process.env.E2E_WALLET_1!.split(" ")),
    await getWallet(tc, process.env.E2E_WALLET_2!.split(" ")),
  ];

  await replaceAdmin(sourcesRegistryContract, wallet1, wallet2.walletContract.address);
  await changeVerifierRegistryTests(sourcesRegistryContract, wallet2);
  await setCodeTests(sourcesRegistryContract, tc, wallet2);
  await replaceAdmin(sourcesRegistryContract, wallet2, wallet1.walletContract.address);
  await setSourceItemCodeTests(sourcesRegistryContract, wallet1);
})({ sourcesRegistryAddress: Address.parse("EQCFYXRqFFnXfXSnicF8vYxR7jGw4T9B3aNVpeHHVzR2jnuv") });



================================================
FILE: test/unit/helpers.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/test/unit/helpers.ts
================================================
import { createHash } from "crypto";
import Prando from "prando";
import { Address } from "ton-core";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import { toBigIntBE } from "bigint-buffer";
import { BlockchainTransaction } from "@ton-community/sandbox";

export function transactionsFrom(transactions: BlockchainTransaction[], address: Address) {
  return transactions.filter(
    (item) =>
      item.inMessage &&
      item.inMessage.info.src instanceof Address &&
      address.equals(item.inMessage.info.src)
  );
}

export const zeroAddress = new Address(0, Buffer.alloc(32, 0));

export function randomAddress(seed: string, workchain?: number) {
  const random = new Prando(seed);
  const hash = Buffer.alloc(32);
  for (let i = 0; i < hash.length; i++) {
    hash[i] = random.nextInt(0, 255);
  }
  return new Address(workchain ?? 0, hash);
}

export async function randomKeyPair() {
  let mnemonics = await mnemonicNew();
  return mnemonicToPrivateKey(mnemonics);
}

export function sha256BN(name: string) {
  return toBigIntBE(createHash("sha256").update(name).digest());
}

export function ip2num(ip: string) {
  let d = ip.split(".");
  return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
}

export function timeUnixTimeStamp(offsetMinute: number) {
  return Math.floor(Date.now() / 1000 + offsetMinute * 60);
}



================================================
FILE: test/unit/integration.spec.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/test/unit/integration.spec.ts
================================================
import { expect } from "chai";

import { toNano, Cell, contractAddress, Address, beginCell } from "ton-core";
import { KeyPair, sign } from "ton-crypto";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import { toBigIntBE } from "bigint-buffer";
import { compile } from "@ton-community/blueprint";

import { randomAddress } from "./helpers";
import { SourcesRegistry, toSha256Buffer } from "../../wrappers/sources-registry";
import { VerifierRegistry, buildMsgDescription } from "../../wrappers/verifier-registry";
import { SourceItem } from "../../wrappers/source-item";
import { genDefaultVerifierRegistryConfig } from "./verifier-registry.spec";
import { sha256BN } from "./helpers";
import { transactionsFrom } from "./helpers";

const VERIFIER_ID = "verifier1";

describe("Integration", () => {
  let keys: KeyPair[];
  let verifierRegistryCode: Cell;
  let SourceRegistryCode: Cell;
  let sourceItemCode: Cell;

  let blockchain: Blockchain;
  let sourceRegistryContract: SandboxContract<SourcesRegistry>;
  let verifierRegistryContract: SandboxContract<VerifierRegistry>;
  let admin: SandboxContract<TreasuryContract>;

  before(async () => {
    verifierRegistryCode = await compile("verifier-registry");
    SourceRegistryCode = await compile("sources-registry");
    sourceItemCode = await compile("source-item");
  });

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    blockchain.now = 1000;

    admin = await blockchain.treasury("admin");

    const verifierConfig = await genDefaultVerifierRegistryConfig(admin, 1);
    keys = verifierConfig.keys;
    verifierRegistryContract = blockchain.openContract(
      VerifierRegistry.createFromConfig(verifierRegistryCode, verifierConfig.data, 1)
    );

    const deployResult = await verifierRegistryContract.sendDeploy(admin.getSender(), toNano(100));

    expect(deployResult.transactions).to.have.transaction({
      from: admin.address,
      to: verifierRegistryContract.address,
      deploy: true,
      success: true,
    });

    sourceRegistryContract = blockchain.openContract(
      SourcesRegistry.create(
        {
          verifierRegistryAddress: verifierRegistryContract.address,
          admin: admin.address,
          sourceItemCode,
        },
        SourceRegistryCode,
      )
    );

    const deployResult2 = await sourceRegistryContract.sendDeploy(admin.getSender(), toNano(100));

    expect(deployResult2.transactions).to.have.transaction({
      from: admin.address,
      to: sourceRegistryContract.address,
      deploy: true,
      success: true,
    });
  });

  it("Updates an existing source item contract's data", async () => {
    const sender = randomAddress("someSender");
    const result = await deployFakeSource(verifierRegistryContract, sender, keys[0]);

    const outMessages = transactionsFrom(result.transactions, verifierRegistryContract.address)[0]
      .outMessages;
    const msg = outMessages.values()[0];
    const sourceItemContract = blockchain.openContract(
      SourceItem.createFromAddress(contractAddress(0, msg.init!))
    );

    const [versionBefore, urlBefore] = await readSourceItemContent(sourceItemContract);

    expect(versionBefore).to.equal(1);
    expect(urlBefore).to.equal("http://myurl.com");

    const result2 = await deployFakeSource(
      verifierRegistryContract,
      sender,
      keys[0],
      "http://changed.com",
      4
    );

    const outMessages2 = transactionsFrom(result2.transactions, verifierRegistryContract.address)[0]
      .outMessages;
    const msg2 = outMessages2.values()[0];

    const sourceItemContract2 = blockchain.openContract(
      SourceItem.createFromAddress(contractAddress(0, msg2.init!))
    );
    const [version, url] = await readSourceItemContent(sourceItemContract2);
    expect(version).to.equal(4);
    expect(url).to.equal("http://changed.com");
  });

  it("Modifies the verifier registry address and is able to deploy a source item contract", async () => {
    const alternativeVerifierConfig = await genDefaultVerifierRegistryConfig(admin, 1);
    const alternativeKp = alternativeVerifierConfig.keys[0];
    const alternativeVerifierRegistryContract = blockchain.openContract(
      VerifierRegistry.createFromConfig(verifierRegistryCode, alternativeVerifierConfig.data, 1)
    );

    await sourceRegistryContract.sendChangeVerifierRegistry(admin.getSender(), {
      newVerifierRegistry: alternativeVerifierRegistryContract.address!,
      value: toNano("0.5"),
    });

    blockchain.openContract(alternativeVerifierRegistryContract);
    await alternativeVerifierRegistryContract.sendDeploy(admin.getSender(), toNano(100));
    const sender = randomAddress("someSender");
    const result = await deployFakeSource(
      alternativeVerifierRegistryContract,
      sender,
      alternativeKp
    );

    const outMessages = transactionsFrom(
      result.transactions,
      alternativeVerifierRegistryContract.address
    )[0].outMessages;
    const msg = outMessages.values()[0];

    const sourceItemContract = blockchain.openContract(
      SourceItem.createFromAddress(contractAddress(0, msg.init!))
    );
    const [version, url] = await readSourceItemContent(sourceItemContract);

    expect(version).to.equal(1);
    expect(url).to.equal("http://myurl.com");
  });

  async function deployFakeSource(
    verifierRegistryContract: SandboxContract<VerifierRegistry>,
    sender: Address,
    kp: KeyPair,
    url = "http://myurl.com",
    version: number = 1
  ) {
    function deploySource(
      verifierId: string,
      codeCellHash: string,
      jsonURL: string,
      version: number
    ): Cell {
      return beginCell()
        .storeUint(1002, 32)
        .storeUint(0, 64)
        .storeBuffer(toSha256Buffer(verifierId))
        .storeUint(toBigIntBE(Buffer.from(codeCellHash, "base64")), 256)
        .storeRef(beginCell().storeUint(version, 8).storeBuffer(Buffer.from(jsonURL)).endCell()) // TODO support snakes
        .endCell();
    }
    const msg = deploySource(VERIFIER_ID, "XXX123", url, version);

    let desc = buildMsgDescription(
      sha256BN(VERIFIER_ID),
      1500,
      sender,
      sourceRegistryContract.address!,
      msg
    ).endCell();

    const result = verifierRegistryContract.sendForwardMessage(blockchain.sender(sender), {
      desc: desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(kp.publicKey), sign(desc.hash(), kp.secretKey)],
      ]),
      value: toNano("0.5"),
    });
    return result;
  }

  async function readSourceItemContent(
    sourceItem: SandboxContract<SourceItem>
  ): Promise<[number, string]> {
    const sourceItemData = await sourceItem.getData();
    expect(sourceItemData).to.be.instanceOf(Cell);
    const dataSlice = (sourceItemData as Cell).beginParse();
    return [dataSlice.loadUint(8), dataSlice.loadStringTail()];
  }

  it("Deploys a source item contract", async () => {
    const sender = randomAddress("someSender");
    const result = await deployFakeSource(
      verifierRegistryContract,
      sender,
      keys[0],
      "http://myurl.com",
      2
    );

    const outMessages = transactionsFrom(result.transactions, verifierRegistryContract.address)[0]
      .outMessages;
    const msg = outMessages.values()[0];

    const sourceItemContract = blockchain.openContract(
      SourceItem.createFromAddress(contractAddress(0, msg.init!))
    );
    const [version, url] = await readSourceItemContent(sourceItemContract);

    expect(version).to.equal(2);
    expect(url).to.equal("http://myurl.com");
  });
});



================================================
FILE: test/unit/sources-registry.spec.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/test/unit/sources-registry.spec.ts
================================================
import { expect } from "chai";

import { Cell, contractAddress, beginCell, toNano, Address } from "ton-core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import { compile } from "@ton-community/blueprint";

import { randomAddress } from "./helpers";
import { SourcesRegistry } from "../../wrappers/sources-registry";
import { SourceItem } from "../../wrappers/source-item";
import { transactionsFrom } from "./helpers";

const specs = [
  {
    codeCellHash: "E/XXoxbG124QU+iKxZtd5loHKjiEUTcdxcW+y7oT9Q4=",
    verifier: "my verifier",
    jsonURL: "https://myjson.com/sources.json",
  },
];

describe("Sources", () => {
  let code: Cell;
  let sourceItemCode: Cell;

  let blockchain: Blockchain;
  let sourceRegistryContract: SandboxContract<SourcesRegistry>;
  let admin: SandboxContract<TreasuryContract>;
  let verifierRegistryAddress: Address;

  before(async () => {
    code = await compile("sources-registry");
    sourceItemCode = await compile("source-item");
  });

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    blockchain.now = 1000;

    admin = await blockchain.treasury("admin");
    verifierRegistryAddress = randomAddress("verifierReg");

    sourceRegistryContract = blockchain.openContract(
      SourcesRegistry.create(
        {
          admin: admin.address,
          verifierRegistryAddress,
          sourceItemCode,
        },
        code
      )
    );

    const deployResult = await sourceRegistryContract.sendDeploy(admin.getSender(), toNano(100));

    expect(deployResult.transactions).to.have.transaction({
      from: admin.address,
      to: sourceRegistryContract.address,
      deploy: true,
      success: true,
    });
  });

  describe("Deploy source item", () => {
    it("should deploy a source contract item", async () => {
      const send = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano("0.5"),
        }
      );

      expect(send.transactions).to.have.transaction({
        from: verifierRegistryAddress,
        exitCode: 0,
      });

      let outMessages = transactionsFrom(send.transactions, verifierRegistryAddress)[0].outMessages;
      const msg = outMessages.values()[0];

      const sourceItemContract = blockchain.openContract(
        SourceItem.createFromAddress(contractAddress(0, msg.init!))
      );

      expect(await parseUrlFromGetSourceItemData(sourceItemContract)).to.equal(specs[0].jsonURL);
    });

    it("disallows a spoofed verifier id to set a deploy item", async () => {
      const send = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),

        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano("0.5"),
        },
        "spoofedVerifier"
      );

      expect(send.transactions).to.have.transaction({
        from: verifierRegistryAddress,
        exitCode: 402,
      });
    });
  });

  describe("Source item addresses", () => {
    it("returns source item address", async () => {
      const send = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano("0.5"),
        }
      );

      const childFromChain = await sourceRegistryContract.getSourceItemAddress(
        specs[0].verifier,
        specs[0].codeCellHash
      );

      let outMessages = transactionsFrom(send.transactions, verifierRegistryAddress)[0].outMessages;
      const msg = outMessages.values()[0];
      expect(msg.info.dest).to.equalAddress(childFromChain);
    });

    it("returns different source item addresses for different verifiers", async () => {
      const childFromChain = await sourceRegistryContract.getSourceItemAddress(
        specs[0].verifier,
        specs[0].codeCellHash
      );
      const childFromChain2 = await sourceRegistryContract.getSourceItemAddress(
        specs[0].verifier + 1,
        specs[0].codeCellHash
      );

      expect(childFromChain).to.not.equalAddress(childFromChain2);
    });

    it("returns different source item addresses for different code cell hashes", async () => {
      const childFromChain = await sourceRegistryContract.getSourceItemAddress(
        specs[0].verifier,
        specs[0].codeCellHash
      );
      const childFromChain2 = await sourceRegistryContract.getSourceItemAddress(
        specs[0].verifier,
        "E/XXoxbG124QU+iKxZtd5loHKjiEUTcdxcW+y7oT9ZZ="
      );

      expect(childFromChain).to.not.equalAddress(childFromChain2);
    });
  });

  describe("Set verifier registry", () => {
    it("changes the verifier registry", async () => {
      const newVerifierRegistryAddress = randomAddress("newVerifierRegistry");
      await sourceRegistryContract.sendChangeVerifierRegistry(admin.getSender(), {
        value: toNano("0.5"),
        newVerifierRegistry: newVerifierRegistryAddress,
      });

      const verifierRegistryAddress = await sourceRegistryContract.getVerifierRegistryAddress();

      expect(verifierRegistryAddress).to.equalAddress(newVerifierRegistryAddress);

      const send = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(newVerifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano("0.5"),
        }
      );
      expect(send.transactions).to.have.transaction({
        from: newVerifierRegistryAddress,
        aborted: false,
        exitCode: 0,
      });
    });

    it("disallows a non admin to change the verifier registry", async () => {
      const send = await sourceRegistryContract.sendChangeVerifierRegistry(
        blockchain.sender(randomAddress("notadmin")),
        {
          value: toNano("0.5"),
          newVerifierRegistry: randomAddress("newadmin"),
        }
      );

      expect(send.transactions).to.have.transaction({
        from: randomAddress("notadmin"),
        aborted: true,
        exitCode: 401,
      });
    });
  });

  describe("Set admin", () => {
    it("allows the admin to change admin", async () => {
      const send = await sourceRegistryContract.sendChangeAdmin(admin.getSender(), {
        value: toNano("0.5"),
        newAdmin: randomAddress("newadmin"),
      });

      const adminAddress = await sourceRegistryContract.getAdminAddress();

      expect(adminAddress).to.equalAddress(randomAddress("newadmin"));
    });

    it("disallows a non admin to change the admin", async () => {
      const send = await sourceRegistryContract.sendChangeAdmin(
        blockchain.sender(randomAddress("notadmin")),
        {
          value: toNano("0.5"),
          newAdmin: randomAddress("newadmin"),
        }
      );

      expect(send.transactions).to.have.transaction({
        from: randomAddress("notadmin"),
        aborted: true,
        exitCode: 401,
      });
    });
  });

  describe("Set code", () => {
    it("allows the admin to set code", async () => {
      const newCode = beginCell().storeBit(1).endCell();

      const send = await sourceRegistryContract.sendChangeCode(admin.getSender(), {
        value: toNano("0.5"),
        newCode,
      });
      expect(send.transactions).to.have.transaction({
        from: admin.address,
        exitCode: 0,
      });
      // expect(send.exit_code).to.equal(0);
      const code = await sourceRegistryContract.getCodeOpt();
      expect(Cell.fromBoc(code!).toString()).to.equal(newCode.toString());
    });

    it("disallows setting an empty set code", async () => {
      const newCode = beginCell().endCell();

      const send = await sourceRegistryContract.sendChangeCode(admin.getSender(), {
        value: toNano("0.5"),
        newCode,
      });

      expect(send.transactions).to.have.transaction({
        from: admin.address,
        exitCode: 902,
      });
    });

    it("disallows a non admin to set code", async () => {
      const newCode = beginCell().endCell();
      const send = await sourceRegistryContract.sendChangeCode(
        blockchain.sender(randomAddress("notadmin")),
        {
          value: toNano("0.5"),
          newCode,
        }
      );

      expect(send.transactions).to.have.transaction({
        from: randomAddress("notadmin"),
        aborted: true,
        exitCode: 401,
      });
    });
  });

  describe("Set source item code", () => {
    it("allows the admin to set source item code", async () => {
      const newCode = beginCell().storeBit(1).endCell();

      const childFromChainBefore = await sourceRegistryContract.getSourceItemAddress(
        specs[0].verifier,
        specs[0].codeCellHash
      );

      const send = await sourceRegistryContract.sendSetSourceItemCode(admin.getSender(), {
        value: toNano("0.5"),
        newCode,
      });

      expect(send.transactions).to.have.transaction({
        from: admin.address,
        exitCode: 0,
      });

      const childFromChainAfter = await sourceRegistryContract.getSourceItemAddress(
        specs[0].verifier,
        specs[0].codeCellHash
      );

      expect(childFromChainBefore).to.not.equalAddress(childFromChainAfter);
    });

    it("disallows setting an empty set source item code", async () => {
      const newCode = beginCell().endCell();

      const send = await sourceRegistryContract.sendSetSourceItemCode(admin.getSender(), {
        value: toNano("0.5"),
        newCode,
      });

      expect(send.transactions).to.have.transaction({
        from: admin.address,
        exitCode: 902,
      });
    });

    it("disallows a non admin to set source item code", async () => {
      const send = await sourceRegistryContract.sendSetSourceItemCode(
        blockchain.sender(randomAddress("notadmin")),
        {
          value: toNano("0.5"),
          newCode: new Cell(),
        }
      );

      expect(send.transactions).to.have.transaction({
        from: randomAddress("notadmin"),
        exitCode: 401,
      });
    });
  });

  describe("Deployment costs", () => {
    it("rejects deploy messages with less than min TON", async () => {
      const send = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano("0.049"),
        }
      );

      expect(send.transactions).to.have.transaction({
        from: verifierRegistryAddress,
        exitCode: 900,
      });
    });

    it("Allows changing min and max ton deployment costs", async () => {
      await sourceRegistryContract.sendSetDeploymentCosts(admin.getSender(), {
        value: toNano("0.01"),
        min: toNano(10),
        max: toNano(20),
      });

      const { min, max } = await sourceRegistryContract.getDeploymentCosts();
      expect(min).to.equal("10");
      expect(max).to.equal("20");

      const send = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano(9),
        }
      );

      expect(send.transactions).to.have.transaction({
        from: verifierRegistryAddress,
        exitCode: 900,
      });

      const send2 = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano(19),
        }
      );

      expect(send2.transactions).to.have.transaction({
        from: verifierRegistryAddress,
        exitCode: 0,
      });

      const send3 = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano("20.1"),
        }
      );

      expect(send3.transactions).to.have.transaction({
        from: verifierRegistryAddress,
        exitCode: 901,
      });
    });

    it("Rejects changing min below lower bound", async () => {
      const send = await sourceRegistryContract.sendSetDeploymentCosts(admin.getSender(), {
        value: toNano("0.01"),
        min: toNano("0.05"),
        max: toNano(20),
      });
      expect(send.transactions).to.have.transaction({
        from: admin.address,
        exitCode: 903,
      });
    });

    it("Rejects changing min/max from nonadmin", async () => {
      const send = await sourceRegistryContract.sendSetDeploymentCosts(
        blockchain.sender(randomAddress("notadmin")),
        {
          value: toNano("0.01"),
          min: toNano(10),
          max: toNano(20),
        }
      );

      expect(send.transactions).to.have.transaction({
        from: randomAddress("notadmin"),
        exitCode: 401,
      });
    });

    it("rejects deploy messages with more than max TON", async () => {
      const send = await sourceRegistryContract.sendDeploySource(
        blockchain.sender(verifierRegistryAddress),
        {
          verifierId: specs[0].verifier,
          codeCellHash: specs[0].codeCellHash,
          jsonURL: specs[0].jsonURL,
          version: 1,
          value: toNano("1.01"),
        }
      );
      expect(send.transactions).to.have.transaction({
        from: verifierRegistryAddress,
        exitCode: 901,
      });
    });
  });

  describe("No op", () => {
    it("throws on no ops", async () => {
      const notVerifier = await blockchain.treasury("non-verifier");

      const send = await sourceRegistryContract.sendNoOp(notVerifier.getSender());

      expect(send.transactions).to.have.transaction({
        from: notVerifier.address,
        exitCode: 0xffff,
      });
    });
  });
});

async function parseUrlFromGetSourceItemData(
  contract: SandboxContract<SourceItem>
): Promise<string | null> {
  const res = await contract.getData();
  if (res === null) return null;
  const sourceItemData = res.beginParse();
  sourceItemData.loadUint(8); // skip version
  return sourceItemData.loadStringTail();
}



================================================
FILE: test/unit/verifier-registry.spec.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/test/unit/verifier-registry.spec.ts
================================================
import { expect } from "chai";

import { Cell, toNano, Dictionary, Contract, beginCell } from "ton-core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import { sign, KeyPair } from "ton-crypto";
import "@ton-community/test-utils";
import { toBigIntBE } from "bigint-buffer";
import { compile } from "@ton-community/blueprint";

import { randomAddress, randomKeyPair } from "./helpers";
import {
  RegistryData,
  VerifierConfig,
  buildMsgDescription,
  VerifierRegistry,
} from "../../wrappers/verifier-registry";
import { ip2num, sha256BN } from "./helpers";
import { transactionsFrom } from "./helpers";

export async function genDefaultVerifierRegistryConfig(
  admin: SandboxContract<Contract>,
  quorum = 2
) {
  let kp = await randomKeyPair();
  let kp2 = await randomKeyPair();
  let kp3 = await randomKeyPair();
  return {
    keys: [kp, kp2, kp3],
    data: {
      verifiers: new Map<bigint, VerifierConfig>([
        [
          sha256BN("verifier1"),
          {
            admin: admin.address,
            quorum,
            name: "verifier1",
            pub_key_endpoints: new Map<bigint, number>([
              [toBigIntBE(kp.publicKey), ip2num("1.2.3.0")],
              [toBigIntBE(kp2.publicKey), ip2num("1.2.3.1")],
              [toBigIntBE(kp3.publicKey), ip2num("1.2.3.2")],
            ]),
            marketingUrl: "https://myverifier.com",
          },
        ],
      ]),
    } as RegistryData,
  };
}

describe("Verifier Registry", () => {
  let code: Cell;

  let blockchain: Blockchain;
  let verifierRegistry: SandboxContract<VerifierRegistry>;
  let admin: SandboxContract<TreasuryContract>;
  let keys: KeyPair[];

  before(async () => {
    code = await compile("verifier-registry");
  });

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    blockchain.now = 1000;

    admin = await blockchain.treasury("admin");

    let cfg = await genDefaultVerifierRegistryConfig(admin);
    keys = cfg.keys;

    verifierRegistry = blockchain.openContract(
      VerifierRegistry.createFromConfig(code, cfg.data, 1)
    );

    const deployResult = await verifierRegistry.sendDeploy(admin.getSender(), toNano("10005"));

    expect(deployResult.transactions).to.have.transaction({
      from: admin.address,
      to: verifierRegistry.address,
      deploy: true,
      success: true,
    });
  });

  it("should update verifier", async () => {
    let kp3 = await randomKeyPair();

    let res = await verifierRegistry.sendUpdateVerifier(admin.getSender(), {
      id: sha256BN("verifier1"),
      quorum: 7,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
      name: "verifier1",
      marketingUrl: "https://myverifier.com",
      value: toNano(1),
    });

    expect(res.transactions).to.have.transaction({
      from: admin.address,
      success: true,
    });

    let data = await verifierRegistry.getVerifier(sha256BN("verifier1"));
    let sets = (data.settings as Cell).beginParse();
    let quorum = sets.loadUint(8);
    let settings = sets.loadDict<bigint, number>(
      Dictionary.Keys.BigUint(256),
      Dictionary.Values.Int(32)
    );

    let ip = settings.get(toBigIntBE(kp3.publicKey));
    expect(data.admin).to.equalAddress(admin.address);
    expect(ip).to.equal(ip2num("10.0.0.1"));
    expect(quorum).to.equal(7);

    let outMessages = transactionsFrom(res.transactions, admin.address)[0].outMessages;
    let excess = outMessages.values()[0];

    expect(excess.info.dest).to.equalAddress(admin.address);
    // expect(excess.mode).to.equal(64 + 2); // TODO

    let body = excess.body.beginParse();
    expect(body.loadUint(32)).to.equal(0);
    expect(body.loadBuffer(body.remainingBits / 8).toString()).to.equal(
      "You successfully updated verifier data"
    );
  });

  it("should reject verifier updates with too large config", async () => {
    let kp3 = await randomKeyPair();

    let res = await verifierRegistry.sendUpdateVerifier(admin.getSender(), {
      id: sha256BN("verifier1"),
      quorum: 7,
      endpoints: new Map<bigint, number>(
        Array(1000)
          .fill("")
          .map((_, i) => [toBigIntBE(kp3.publicKey) - BigInt(i), ip2num("10.0.0.0")])
      ),
      name: "verifier1",
      marketingUrl: "https://myverifier.com",
      value: toNano(1),
    });

    expect(res.transactions).to.have.transaction({
      from: admin.address,
      exitCode: 402,
    });
  });

  it("should not update verifier", async () => {
    let kp3 = await randomKeyPair();
    let fakeAdmin = randomAddress("fakeAdmin");

    let res = await verifierRegistry.sendUpdateVerifier(blockchain.sender(fakeAdmin), {
      id: sha256BN("verifier1"),
      quorum: 7,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
      name: "verifier1",
      marketingUrl: "https://myverifier.com",
      value: toNano(1),
    });

    expect(res.transactions).to.have.transaction({
      from: fakeAdmin,
      exitCode: 401,
    });
  });

  it("should not add verifier", async () => {
    let kp3 = await randomKeyPair();
    let fakeAdmin = randomAddress("fakeAdmin");

    let res = await verifierRegistry.sendUpdateVerifier(blockchain.sender(fakeAdmin), {
      id: sha256BN("verifier_new"),
      quorum: 7,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
      name: "verifier_new",
      marketingUrl: "https://myverifier.com",
      value: toNano(1),
    });

    expect(res.transactions).to.have.transaction({
      from: fakeAdmin,
      exitCode: 410,
    });
  });

  it("should remove verifier", async () => {
    let res = await verifierRegistry.sendRemoveVerifier(admin.getSender(), {
      id: sha256BN("verifier1"),
      value: toNano(1),
    });

    expect(res.transactions).to.have.transaction({
      from: admin.address,
      exitCode: 0,
    });

    let outMessages = transactionsFrom(res.transactions, admin.address)[0].outMessages;
    let exit = outMessages.values()[0];

    expect(exit.info.dest).to.equalAddress(admin.address);
    expect(exit.info.type).to.equal("internal");
    if (exit.info.type === "internal") {
      expect(Number(exit.info.value.coins)).to.be.gte(
        // TODO
        Number(toNano(1000) - toNano("0.2"))
      );
    }
    // expect(exit.mode).to.equal(64); TODO

    let body = exit.body.beginParse();
    expect(body.loadUint(32)).to.equal(0);
    expect(body.loadBuffer(body.remainingBits / 8).toString()).to.equal(
      "Withdrawal and exit from the verifier registry"
    );

    // fails due to https://github.com/ton-core/ton-core/pull/28
    // let data = await verifierRegistry.getVerifier(sha256BN("verifier1"));
    // expect(data.settings).to.equal(null);

    let verifiers = await verifierRegistry.getVerifiers();
    expect(verifiers.length).to.equal(0);

    let verifiersNum = await verifierRegistry.getVerifiersNum();
    expect(verifiersNum).to.equal(0);
  });

  it("should not remove verifier", async () => {
    let fakeAdmin = randomAddress("fakeadmin");
    let res = await verifierRegistry.sendRemoveVerifier(blockchain.sender(fakeAdmin), {
      id: sha256BN("verifier1"),
      value: toNano(1),
    });

    expect(res.transactions).to.have.transaction({
      from: fakeAdmin,
      exitCode: 401,
    });
  });

  it("should not remove verifier, not found", async () => {
    let fakeAdmin = randomAddress("fakeadmin");

    let res = await verifierRegistry.sendRemoveVerifier(blockchain.sender(fakeAdmin), {
      id: BigInt(223),
      value: toNano(1),
    });

    expect(res.transactions).to.have.transaction({
      from: fakeAdmin,
      exitCode: 404,
    });
  });

  it("should forward message", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier1"), 1500, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
        [toBigIntBE(keys[1].publicKey), sign(desc.hash(), keys[1].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 0,
      aborted: false,
    });

    const outMessages = transactionsFrom(res.transactions, src)[0].outMessages;
    const excess = outMessages.values()[0];
    expect(excess.info.dest).to.equalAddress(dst);
    // expect(excess.mode).to.equal(64);

    const body = excess.body.beginParse();
    const [verifierIdCell, msgCell] = [body.loadRef().beginParse(), body.loadRef().beginParse()];
    expect(verifierIdCell.loadUintBig(256)).to.equal(sha256BN("verifier1"));
    expect(msgCell.loadUint(32)).to.equal(777);
  });

  it("should forward message, 2 out of 3 correct, quorum = 2", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier1"), 1500, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
        [toBigIntBE(keys[1].publicKey), sign(desc.hash(), keys[1].secretKey)],
        [toBigIntBE(keys[2].publicKey), sign(desc.hash(), keys[1].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 0,
      aborted: false,
    });

    let outMessages = transactionsFrom(res.transactions, src)[0].outMessages;
    let excess = outMessages.values()[0];
    expect(excess.info.dest).to.equalAddress(dst);
    // expect(excess.mode).to.equal(64); TODO

    let body = excess.body.beginParse();
    const [verifierIdCell, msgCell] = [body.loadRef().beginParse(), body.loadRef().beginParse()];
    expect(verifierIdCell.loadUintBig(256)).to.equal(sha256BN("verifier1"));
    expect(msgCell.loadUint(32)).to.equal(777);
  });

  it("should not forward message, 1 sign of 2", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier1"), 1500, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 413,
    });
  });

  it("should not forward message, 2 same signs", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier1"), 1500, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 413,
    });
  });

  it("should not forward message, no signs", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier1"), 1500, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([]),
      value: toNano(3),
    });
    expect(res.transactions).to.have.transaction({
      from: src,
      aborted: true,
    });
  });

  it("should not forward message, 2 signs, 1 invalid", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier1"), 1500, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
        [toBigIntBE(keys[1].publicKey), sign(desc.hash(), keys[0].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 413,
    });
  });

  it("should not forward message, expired", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier1"), 999, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
        [toBigIntBE(keys[1].publicKey), sign(desc.hash(), keys[1].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 411,
    });
  });

  it("should not forward message, wrong sender", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(
      sha256BN("verifier1"),
      1500,
      randomAddress("someSeed3"),
      dst,
      msgBody
    ).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
        [toBigIntBE(keys[1].publicKey), sign(desc.hash(), keys[1].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 414,
    });
  });

  it("should not forward message, unknown verifier", async () => {
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(BigInt(333), 1500, src, dst, msgBody).endCell();

    let res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(keys[0].publicKey), sign(desc.hash(), keys[0].secretKey)],
        [toBigIntBE(keys[1].publicKey), sign(desc.hash(), keys[1].secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 404,
    });
  });

  it("should add new verifier", async () => {
    let user = randomAddress("user");

    let kp3 = await randomKeyPair();

    let res = await verifierRegistry.sendUpdateVerifier(blockchain.sender(user), {
      id: sha256BN("verifier2"),
      quorum: 7,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
      name: "verifier2",
      marketingUrl: "https://myverifier.com",
      value: toNano(1005),
    });

    expect(res.transactions).to.have.transaction({
      from: user,
      exitCode: 0,
      aborted: false,
    });

    let data = await verifierRegistry.getVerifier(sha256BN("verifier2"));
    let sets = (data.settings as Cell).beginParse();
    let quorum = sets.loadUint(8);
    let settings = sets.loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Uint(32));
    let ip = settings.get(toBigIntBE(kp3.publicKey));

    expect(data.admin).to.equalAddress(user);
    expect(ip).to.equal(ip2num("10.0.0.1"));
    expect(quorum).to.equal(7);

    let outMessages = transactionsFrom(res.transactions, user)[0].outMessages;
    let excess = outMessages.values()[0];

    expect(excess.info.dest).to.equalAddress(user);
    expect(excess.info.type).to.equal("internal");
    if (excess.info.type === "internal") {
      expect(excess.info.value.coins).to.equal(toNano(5));
    }
    // expect(excess.mode).to.equal(1); TODO

    let body = excess.body.beginParse();
    expect(body.loadUint(32)).to.equal(0);
    expect(body.loadBuffer(body.remainingBits / 8).toString()).to.equal(
      "You were successfully registered as a verifier"
    );
  });

  it("shouldn't allow setting a 0 quorum", async () => {
    let user = randomAddress("user");

    let kp3 = await randomKeyPair();

    let res = await verifierRegistry.sendUpdateVerifier(blockchain.sender(user), {
      id: sha256BN("verifier2"),
      quorum: 0,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
      name: "verifier2",
      marketingUrl: "https://myverifier.com",
      value: toNano(10005),
    });

    expect(res.transactions).to.have.transaction({
      from: user,
      exitCode: 421,
      aborted: true,
    });
  });

  it("should not add new verifier, 20 limit", async () => {
    let cfg = await genDefaultVerifierRegistryConfig(admin);
    verifierRegistry = blockchain.openContract(
      VerifierRegistry.createFromConfig(code, cfg.data, 20)
    );
    await verifierRegistry.sendDeploy(admin.getSender(), toNano("10005"));

    let user = randomAddress("user");

    let kp3 = await randomKeyPair();

    let res = await verifierRegistry.sendUpdateVerifier(blockchain.sender(user), {
      id: sha256BN("verifier2"),
      quorum: 7,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
      name: "verifier2",
      marketingUrl: "https://myverifier.com",
      value: toNano(10005),
    });

    expect(res.transactions).to.have.transaction({
      from: user,
      exitCode: 419,
    });
  });

  it("full scenario", async () => {
    let user = randomAddress("user");

    let kp3 = await randomKeyPair();

    // add
    let res = await verifierRegistry.sendUpdateVerifier(blockchain.sender(user), {
      id: sha256BN("verifier2"),
      quorum: 7,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
      name: "verifier2",
      marketingUrl: "https://myverifier.com",
      value: toNano(10005),
    });

    expect(res.transactions).to.have.transaction({
      from: user,
      exitCode: 0,
      aborted: false,
    });

    let data = await verifierRegistry.getVerifier(sha256BN("verifier2"));
    let sets = (data.settings as Cell).beginParse();
    let quorum = sets.loadUint(8);
    let settings = sets.loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Uint(32));
    let ip = settings.get(toBigIntBE(kp3.publicKey));

    expect(ip).to.equal(ip2num("10.0.0.1"));
    expect(quorum).to.equal(7);

    let verifiersNum = await verifierRegistry.getVerifiersNum();
    expect(verifiersNum).to.equal(2);

    // update
    res = await verifierRegistry.sendUpdateVerifier(blockchain.sender(user), {
      id: sha256BN("verifier2"),
      quorum: 1,
      endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.2")]]),
      name: "verifier2",
      marketingUrl: "https://myverifier.com",
      value: toNano(5),
    });

    data = await verifierRegistry.getVerifier(sha256BN("verifier2"));
    sets = (data.settings as Cell).beginParse();
    quorum = sets.loadUint(8);
    settings = sets.loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Uint(32));
    ip = settings.get(toBigIntBE(kp3.publicKey));

    expect(ip).to.equal(ip2num("10.0.0.2"));
    expect(quorum).to.equal(1);

    verifiersNum = await verifierRegistry.getVerifiersNum();
    expect(verifiersNum).to.equal(2);

    // forward
    let src = randomAddress("src");
    let dst = randomAddress("dst");
    let msgBody = beginCell().storeUint(777, 32).endCell();

    let desc = buildMsgDescription(sha256BN("verifier2"), 1500, src, dst, msgBody).endCell();

    res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(kp3.publicKey), sign(desc.hash(), kp3.secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 0,
      aborted: false,
    });

    let outMessages = transactionsFrom(res.transactions, src)[0].outMessages;
    let excess = outMessages.values()[0];
    expect(excess.info.dest).to.equalAddress(dst);
    // expect(excess.mode).to.equal(64); TODO

    // remove
    res = await verifierRegistry.sendRemoveVerifier(blockchain.sender(user), {
      id: sha256BN("verifier2"),
      value: toNano(1),
    });
    expect(res.transactions).to.have.transaction({
      from: user,
      exitCode: 0,
    });

    verifiersNum = await verifierRegistry.getVerifiersNum();
    expect(verifiersNum).to.equal(1);

    // should not forward

    res = await verifierRegistry.sendRemoveVerifier(blockchain.sender(src), {
      id: sha256BN("verifier2"),
      value: toNano(1),
    });
    res = await verifierRegistry.sendForwardMessage(blockchain.sender(src), {
      desc,
      signatures: new Map<bigint, Buffer>([
        [toBigIntBE(kp3.publicKey), sign(desc.hash(), kp3.secretKey)],
      ]),
      value: toNano(3),
    });

    expect(res.transactions).to.have.transaction({
      from: src,
      exitCode: 404,
      aborted: true,
    });
  });

  it("should retrieve verifiers data", async () => {
    verifierRegistry = blockchain.openContract(
      VerifierRegistry.createFromConfig(code, { verifiers: new Map() }, 0)
    );
    await verifierRegistry.sendDeploy(admin.getSender(), toNano("10005"));

    let user = randomAddress("user");

    let kp3 = await randomKeyPair();

    const verifierConfig = [
      ["verifier1", "http://verifier1.com"],
      ["verifier2", "http://verifier2.com"],
      ["verifier3", "http://verifier3.com"],
    ];

    for (const [name, url] of verifierConfig) {
      await verifierRegistry.sendUpdateVerifier(blockchain.sender(user), {
        id: sha256BN(name),
        quorum: 7,
        endpoints: new Map<bigint, number>([[toBigIntBE(kp3.publicKey), ip2num("10.0.0.1")]]),
        name: name,
        marketingUrl: url,
        value: toNano(10005),
      });
    }

    const verifiers = await verifierRegistry.getVerifiers();
    for (const [name, url] of verifierConfig) {
      const actualVerifier = verifiers.find((v) => v.name === name)!;
      const [pub_key, ipnum] = actualVerifier.pub_key_endpoints.entries().next().value;

      expect(ipnum).to.equal(ip2num("10.0.0.1"));
      expect(pub_key.toString()).to.equal(toBigIntBE(kp3.publicKey).toString());
      expect(actualVerifier.admin).to.equalAddress(user);
      expect(actualVerifier.quorum).to.equal(7);
      expect(actualVerifier.name).to.equal(name);
      expect(actualVerifier.marketingUrl).to.equal(url);
    }
  });
});



================================================
FILE: wrappers/source-item.compile.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/source-item.compile.ts
================================================
import { CompilerConfig } from "@ton-community/blueprint";

export const compile: CompilerConfig = {
  lang: "func",
  targets: ["contracts/source-item.fc"],
};



================================================
FILE: wrappers/source-item.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/source-item.ts
================================================
import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode } from "ton-core";

export class SourceItem implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new SourceItem(address);
  }

  async sendInternalMessage(provider: ContractProvider, via: Sender, body: Cell, value: bigint) {
    await provider.internal(via, {
      value: value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async getData(provider: ContractProvider): Promise<Cell | null> {
    const result = await provider.get("get_source_item_data", []);
    result.stack.skip(3);
    return result.stack.readCellOpt();
  }
}



================================================
FILE: wrappers/sources-registry-only-set-code.compile.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/sources-registry-only-set-code.compile.ts
================================================
import { CompilerConfig } from "@ton-community/blueprint";

export const compile: CompilerConfig = {
  lang: "func",
  targets: ["contracts/sources-registry-only-set-code.fc"],
};



================================================
FILE: wrappers/sources-registry-only-set-code.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/sources-registry-only-set-code.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  ContractProvider,
  Sender,
  SendMode,
} from "ton-core";

export class SourcesRegistryOnlySetCode implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new SourcesRegistryOnlySetCode(address);
  }

  async sendChangeCode(provider: ContractProvider, via: Sender, value: bigint, newCode: Cell) {
    const body = beginCell().storeUint(9988, 32).storeUint(0, 64).storeRef(newCode).endCell();
    await provider.internal(via, {
      value: value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async getAmIReplaced(provider: ContractProvider): Promise<bigint> {
    const res = await provider.get("get_am_i_replaced", []);
    return res.stack.readBigNumber();
  }
}



================================================
FILE: wrappers/sources-registry.compile.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/sources-registry.compile.ts
================================================
import { CompilerConfig } from "@ton-community/blueprint";

export const compile: CompilerConfig = {
  lang: "func",
  targets: ["contracts/sources-registry.fc"],
};



================================================
FILE: wrappers/sources-registry.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/sources-registry.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  fromNano,
  Sender,
  SendMode,
  toNano,
} from "ton-core";

import { toBigIntBE } from "bigint-buffer";
import { Sha256 } from "@aws-crypto/sha256-js";
import { sha256BN } from "../test/unit/helpers";

export function sourceRegistryConfigToCell(params: {
  minTons: bigint;
  maxTons: bigint;
  verifierRegistryAddress: Address;
  admin: Address;
  sourceItemCode: Cell;
}): Cell {
  return beginCell()
    .storeCoins(params.minTons)
    .storeCoins(params.maxTons)
    .storeAddress(params.admin)
    .storeAddress(params.verifierRegistryAddress)
    .storeRef(params.sourceItemCode)
    .endCell();
}

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

export class SourcesRegistry implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new SourcesRegistry(address);
  }

  static create(
    params: {
      verifierRegistryAddress: Address;
      admin: Address;
      sourceItemCode: Cell;
      minTons?: bigint;
      maxTons?: bigint;
    },
    code: Cell,
    workchain = 0
  ) {
    const data = sourceRegistryConfigToCell({
      minTons: params.minTons ?? toNano("0.065"),
      maxTons: params.maxTons ?? toNano("1"),
      admin: params.admin,
      verifierRegistryAddress: params.verifierRegistryAddress,
      sourceItemCode: params.sourceItemCode,
    });
    const init = { code, data };
    return new SourcesRegistry(contractAddress(workchain, init), init);
  }

  async sendInternalMessage(provider: ContractProvider, via: Sender, body: Cell, value: bigint) {
    await provider.internal(via, {
      value: value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint, bounce = true) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
      bounce,
    });
  }

  async getSourceItemAddress(
    provider: ContractProvider,
    verifier: string,
    codeCellHash: string
  ): Promise<Address> {
    const result = await provider.get("get_source_item_address", [
      {
        type: "int",
        value: toBigIntBE(toSha256Buffer(verifier)),
      },
      {
        type: "int",
        value: toBigIntBE(Buffer.from(codeCellHash, "base64")),
      },
    ]);
    const item = result.stack.readCell();
    return item.beginParse().loadAddress()!;
  }

  async getVerifierRegistryAddress(provider: ContractProvider): Promise<Address> {
    const res = await provider.get("get_verifier_registry_address", []);
    const item = res.stack.readCell();
    return item.beginParse().loadAddress();
  }

  async getAdminAddress(provider: ContractProvider) {
    const res = await provider.get("get_admin_address", []);
    const item = res.stack.readCell();
    return item.beginParse().loadMaybeAddress();
  }

  async getCodeOpt(provider: ContractProvider) {
    const state = await provider.getState();
    if (state.state.type != "active") return null;
    return state.state.code;
  }

  async getDeploymentCosts(provider: ContractProvider) {
    const res = await provider.get("get_deployment_costs", []);
    const min = res.stack.readBigNumber();
    const max = res.stack.readBigNumber();
    return { min: fromNano(min), max: fromNano(max) };
  }

  async sendDeploySource(
    provider: ContractProvider,
    via: Sender,
    params: {
      verifierId: string;
      codeCellHash: string;
      jsonURL: string;
      version: number;
      value: bigint;
    },
    verifiedVerifierId = params.verifierId
  ) {
    const body = beginCell()
      .storeUint(1002, 32)
      .storeUint(0, 64)
      .storeBuffer(toSha256Buffer(params.verifierId))
      .storeUint(toBigIntBE(Buffer.from(params.codeCellHash, "base64")), 256)
      .storeRef(beginCell().storeUint(params.version, 8).storeStringTail(params.jsonURL).endCell()) // TODO support snakes
      .endCell();
    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeRef(beginCell().storeUint(sha256BN(verifiedVerifierId), 256).endCell())
        .storeRef(body)
        .endCell(),
    });
  }

  async sendChangeVerifierRegistry(
    provider: ContractProvider,
    via: Sender,
    params: { value: bigint; newVerifierRegistry: Address }
  ) {
    const body = beginCell()
      .storeUint(2003, 32)
      .storeUint(0, 64)
      .storeAddress(params.newVerifierRegistry)
      .endCell();
    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendChangeAdmin(
    provider: ContractProvider,
    via: Sender,
    params: { value: bigint; newAdmin: Address }
  ) {
    const body = beginCell()
      .storeUint(3004, 32)
      .storeUint(0, 64)
      .storeAddress(params.newAdmin)
      .endCell();
    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendSetSourceItemCode(
    provider: ContractProvider,
    via: Sender,
    params: { value: bigint; newCode: Cell }
  ) {
    const body = beginCell()
      .storeUint(4005, 32)
      .storeUint(0, 64)
      .storeRef(params.newCode)
      .endCell();
    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendChangeCode(
    provider: ContractProvider,
    via: Sender,
    params: { value: bigint; newCode: Cell }
  ) {
    const body = beginCell()
      .storeUint(5006, 32)
      .storeUint(0, 64)
      .storeRef(params.newCode)
      .endCell();
    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendSetDeploymentCosts(
    provider: ContractProvider,
    via: Sender,
    params: { value: bigint; min: bigint; max: bigint }
  ) {
    const body = beginCell()
      .storeUint(6007, 32)
      .storeUint(0, 64)
      .storeCoins(params.min)
      .storeCoins(params.max)
      .endCell();
    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendNoOp(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: toNano("0.5"),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(8888, 32).storeUint(0, 64).endCell(),
    });
  }
}



================================================
FILE: wrappers/verifier-registry.compile.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/verifier-registry.compile.ts
================================================
import { CompilerConfig } from "@ton-community/blueprint";

export const compile: CompilerConfig = {
  lang: "func",
  targets: ["contracts/verifier-registry.fc"],
};



================================================
FILE: wrappers/verifier-registry.ts
URL: https://github.com/ton-community/contract-verifier-contracts/blob/main/wrappers/verifier-registry.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  Dictionary,
  DictionaryValue,
  Slice,
} from "ton-core";

export type RegistryData = {
  verifiers: Map<bigint, VerifierConfig>;
};

export type VerifierConfig = {
  admin: Address;
  quorum: number;
  pub_key_endpoints: Map<bigint, number>;
  name: string;
  marketingUrl: string;
};

export const OperationCodes = {
  removeVerifier: 0x19fa5637,
  updateVerifier: 0x6002d61a,
  forwardMessage: 0x75217758,
};

export type CollectionMintItemInput = {
  passAmount: bigint;
  index: number;
  ownerAddress: Address;
  content: string;
};

function createSliceValue(): DictionaryValue<Slice> {
  return {
    serialize: (src, buidler) => {
      buidler.storeSlice(src);
    },
    parse: (src) => {
      return src;
    },
  };
}

export function buildMsgDescription(
  id: bigint,
  validTill: number,
  source: Address,
  target: Address,
  msg: Cell
) {
  let desc = beginCell();
  desc.storeUint(id, 256);
  desc.storeUint(validTill, 32);
  desc.storeAddress(source);
  desc.storeAddress(target);
  desc.storeRef(msg);

  return desc;
}

export function buildRegistryDataCell(data: RegistryData, num?: number) {
  let dataCell = beginCell();
  let e = Dictionary.empty(Dictionary.Keys.BigUint(256), createSliceValue());
  data.verifiers.forEach(function (val: VerifierConfig, key: bigint) {
    let x = beginCell().storeAddress(val.admin).storeUint(val.quorum, 8);

    let points = Dictionary.empty(Dictionary.Keys.BigUint(256), createSliceValue());
    val.pub_key_endpoints.forEach(function (eVal: number, eKey: bigint) {
      points.set(eKey, beginCell().storeUint(eVal, 32).asSlice());
    });
    x.storeDict(points);
    x.storeRef(beginCell().storeBuffer(Buffer.from(val.name)).endCell());
    x.storeRef(beginCell().storeBuffer(Buffer.from(val.marketingUrl)).endCell());
    e.set(key, x.asSlice());
  });

  if (num === undefined) {
    num = 0;
  }

  dataCell.storeDict(e).storeUint(num, 8);

  return dataCell.endCell();
}

export class VerifierRegistry implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new VerifierRegistry(address);
  }

  static createFromConfig(code: Cell, config: RegistryData, num?: number, workchain = 0) {
    let data = buildRegistryDataCell(config, num);
    const init = { code, data };
    return new VerifierRegistry(contractAddress(workchain, init), init);
  }

  async sendInternalMessage(provider: ContractProvider, via: Sender, body: Cell, value: bigint) {
    await provider.internal(via, {
      value: value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async getVerifier(
    provider: ContractProvider,
    id: bigint
  ): Promise<{ admin: Address | null; settings: Cell | null }> {
    let res = await provider.get("get_verifier", [
      {
        type: "int",
        value: id,
      },
    ]);
    const sl = res.stack.readCell();
    const settings = res.stack.readCellOpt();
    const ok = res.stack.readNumber();
    if (ok == 0) {
      return {
        admin: null,
        settings: null,
      };
    }

    return {
      admin: sl.beginParse().loadAddress(),
      settings,
    };
  }

  async getVerifiersNum(provider: ContractProvider): Promise<number> {
    let res = await provider.get("get_verifiers_num", []);
    let num = res.stack.readNumber();

    return num;
  }

  async getVerifiers(provider: ContractProvider): Promise<VerifierConfig[]> {
    let res = await provider.get("get_verifiers", []);
    const item = res.stack.readCell();
    const c = item.beginParse();
    const d = c.loadDict(Dictionary.Keys.BigUint(256), createSliceValue());

    return Array.from(d.values()).map((v) => {
      const admin = v.loadAddress()!;
      const quorom = v.loadUint(8);
      const pubKeyEndpoints = v.loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Uint(32));

      return {
        admin: admin,
        quorum: quorom,
        pub_key_endpoints: new Map<bigint, number>(
          Array.from(pubKeyEndpoints).map(([k, v]) => [k, v])
        ),
        name: v.loadRef().beginParse().loadStringTail(),
        marketingUrl: v.loadRef().beginParse().loadStringTail(),
      };
    });
  }

  async sendRemoveVerifier(
    provider: ContractProvider,
    via: Sender,
    params: { queryId?: number; id: bigint; value: bigint }
  ) {
    let msgBody = beginCell();
    msgBody.storeUint(OperationCodes.removeVerifier, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    msgBody.storeUint(params.id, 256);
    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msgBody.endCell(),
    });
  }

  async sendUpdateVerifier(
    provider: ContractProvider,
    via: Sender,
    params: {
      queryId?: number;
      id: bigint;
      quorum: number;
      endpoints: Map<bigint, number>;
      name: string;
      marketingUrl: string;
      value: bigint;
    }
  ) {
    let msgBody = beginCell();
    msgBody.storeUint(OperationCodes.updateVerifier, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    msgBody.storeUint(params.id, 256);
    msgBody.storeUint(params.quorum, 8);

    let e = Dictionary.empty(Dictionary.Keys.BigUint(256), createSliceValue());
    params.endpoints.forEach(function (val: number, key: bigint) {
      e.set(key, beginCell().storeUint(val, 32).endCell().beginParse());
    });

    msgBody.storeDict(e);
    msgBody.storeRef(beginCell().storeBuffer(Buffer.from(params.name)).endCell());
    msgBody.storeRef(beginCell().storeBuffer(Buffer.from(params.marketingUrl)).endCell());

    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msgBody.endCell(),
    });
  }

  async sendForwardMessage(
    provider: ContractProvider,
    via: Sender,
    params: { queryId?: number; desc: Cell; signatures: Map<bigint, Buffer>; value: bigint }
  ) {
    let msgBody = beginCell();
    msgBody.storeUint(OperationCodes.forwardMessage, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    msgBody.storeRef(params.desc);

    let signatures = beginCell().endCell();
    if (params.signatures.size > 0) {
      let signaturesBuilder = beginCell();
      params.signatures.forEach(function (val, key) {
        signaturesBuilder.storeBuffer(val);
        signaturesBuilder.storeUint(key, 256);

        let s = beginCell();
        s.storeRef(signaturesBuilder.endCell());
        signaturesBuilder = s;
      });
      signatures = signaturesBuilder.asSlice().loadRef();
    }

    msgBody.storeRef(signatures);

    await provider.internal(via, {
      value: params.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msgBody.endCell(),
    });
  }
}




# Repository: tact-fireworks
URL: https://github.com/ton-community/tact-fireworks
Branch: main

## Directory Structure:
```
└── tact-fireworks/
    ├── .idea/
        ├── modules.xml
        ├── tact-fireworks.iml
        ├── vcs.xml
    ├── README.md
    ├── contracts/
        ├── fireworks.tact
        ├── imports/
            ├── stdlib.fc
        ├── natives.fc
    ├── jest.config.ts
    ├── package.json
    ├── tests/
        ├── Fireworks.EdgeCases.spec.ts
        ├── Fireworks.spec.ts
    ├── wrappers/
        ├── Fireworks.compile.ts
        ├── Fireworks.ts
```

## Files Content:

================================================
FILE: .idea/modules.xml
URL: https://github.com/ton-community/tact-fireworks/blob/main/.idea/modules.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ProjectModuleManager">
    <modules>
      <module fileurl="file://$PROJECT_DIR$/.idea/tact-fireworks.iml" filepath="$PROJECT_DIR$/.idea/tact-fireworks.iml" />
    </modules>
  </component>
</project>


================================================
FILE: .idea/tact-fireworks.iml
URL: https://github.com/ton-community/tact-fireworks/blob/main/.idea/tact-fireworks.iml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<module type="WEB_MODULE" version="4">
  <component name="NewModuleRootManager">
    <content url="file://$MODULE_DIR$">
      <excludeFolder url="file://$MODULE_DIR$/.tmp" />
      <excludeFolder url="file://$MODULE_DIR$/temp" />
      <excludeFolder url="file://$MODULE_DIR$/tmp" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
  </component>
</module>


================================================
FILE: .idea/vcs.xml
URL: https://github.com/ton-community/tact-fireworks/blob/main/.idea/vcs.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="VcsDirectoryMappings">
    <mapping directory="" vcs="Git" />
  </component>
</project>


================================================
FILE: README.md
URL: https://github.com/ton-community/tact-fireworks/blob/main/README.md
================================================
# tact-fireworks

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`

### Dependencies

- [Node.js](https://nodejs.org/) with a recent version like v18, verify version with `node -v`
- IDE with TypeScript and FunC support like [Visual Studio Code](https://code.visualstudio.com/) with the [FunC plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)
- Wallet contract v3 or v4 for launching





================================================
FILE: contracts/fireworks.tact
URL: https://github.com/ton-community/tact-fireworks/blob/main/contracts/fireworks.tact
================================================
import "@stdlib/deploy";
import "@stdlib/ownable";
import "@stdlib/stoppable";
import "./natives.fc";

@name(pop_10)
native pop_10();

@name(stack_overflow)
native stack_overflow();

@name(type_check_error)
native type_check_error();

@name(set_c5)
native set_c5(c: Cell);

@name(dict_exit_10)
native dict_exit_10();

message Launch {
}
message LaunchFirst {
    queryId: Int as uint64;
    launcher: Address;
}
message LaunchSecond {
    queryId: Int as uint64;
    launcher: Address;
}
message SetFirst {
    queryId: Int as uint64;
}
message FakeLaunch {
    exitCode: Int as uint16;
}

contract Fireworks with Deployable, Ownable, Stoppable {
    id: Int as uint32;
    owner: Address;
    stopped: Bool;

    init(id: Int){
        self.id = id;
        self.owner = sender();
        self.stopped = false;
    }

    fun setFireworksByID(id: Int, mode: Int, value: Int, body: Cell) {
        let newInit: StateInit = initOf Fireworks(id);
        let newAddress: Address = contractAddress(newInit);
        //send a message
        send(SendParameters{
                to: newAddress,
                value: value,
                mode: mode,
                bounce: true,
                body: body,
                code: newInit.code,
                data: newInit.data
            }
        );
    }

    receive(msg: SetFirst){
        let id: Int = self.id();
        let body1: Cell = LaunchFirst{queryId: 0, launcher: sender()}.toCell();
        let body2: Cell = LaunchSecond{queryId: 0, launcher: sender()}.toCell();
        //set First Fireworks
        self.setFireworksByID((id + 1), 0, ton("1"), body1);
        //send LaunchSecond message
        self.setFireworksByID((id + 2), (SendRemainingBalance + SendDestroyIfZero), 0, body2);
    }

    receive(msg: LaunchFirst){
        // prepare 4 messages. wallet v4 contract limited with 4 out messages per tx.
        let dst: Address = msg.launcher;

        // msg1 - sending 0.1 TON with mode = 0
        send(SendParameters{to: dst, value: ton("0.1"), mode: 0, body: "send mode = 0".asComment()});

        // msg2 - sending 0.1 TON with mode = 1
        send(SendParameters{to: dst, value: ton("0.1"), mode: SendPayGasSeparately, body: "send mode = 1".asComment()});

        // msg3 - sending 0.1 TON with mode = 2
        send(SendParameters{to: dst, value: ton("0.1"), mode: SendIgnoreErrors, body: "send mode = 2".asComment()});

        //msg4 - sending remaining 0.1 TON with mode = 128 + 32
        send(SendParameters{to: dst, value: 0, mode: (SendRemainingBalance + SendDestroyIfZero), body: "send mode = 128 + 32".asComment()});
    }

    receive(msg: LaunchSecond){
        let dst: Address = msg.launcher;

        //msg1 mode = 64
        send(SendParameters{to: dst, value: 0, mode: SendRemainingValue, body: "send mode = 64".asComment()});
    }

    receive(msg: FakeLaunch){
        if (msg.exitCode == 0) {
            return ;
        }
        if (msg.exitCode == 2) {
            pop_10();
        }
        if (msg.exitCode == 3) {
            stack_overflow();
        }
        if (msg.exitCode == 4) {
            self.id = 1; // force not to ignore it by using storage variables
            repeat(256) {
                self.id = 2 * self.id;
            }
        }
        if (msg.exitCode == 5) {
            // option 1 -> id: Int as uint32
            self.id = 1; // force not to ignore it by using storage variables
            repeat(32) {
                self.id = 2 * self.id;
            }
            // option 2 -> according to storeUint(self: Builder, value: Int, bits: Int) function, it's not possible to use storeUint(0, 1024) becuase 0 ≤ bits ≤ 256
            let s: Slice = beginCell().storeUint(0, 257).asSlice();
        }
        if (msg.exitCode == 7) {
            type_check_error();
        }
        if (msg.exitCode == 8) {
            // according to storeUint(self: Builder, value: Int, bits: Int) function, it's not possible to use storeUint(0, 1024) becuase 0 ≤ bits ≤ 256
            let s: Slice = beginCell().storeUint(0, 256).storeUint(0, 256).storeUint(0, 256).storeUint(0, 256).asSlice();
        }
        if (msg.exitCode == 9) {
            let s: Slice = emptySlice();
            self.id = s.loadUint(1); // force not to ignore it by using storage variables
        }
        if (msg.exitCode == 10) {
            dict_exit_10();
        }
        if (msg.exitCode == 13) {
            repeat(10000) {
                self.id = self.id + 1;
            }
        }
        if (msg.exitCode == 32) {
            set_c5(beginCell().storeBool(true).endCell());
        }
        if (msg.exitCode == 34) {
            nativeSendMessage(emptyCell(), 0);
        }
        if (msg.exitCode == 37) {
            send(SendParameters{to: context().sender, value: ton("10")});
        }
        if (msg.exitCode == 130) {
            // no need to code here
        }
        if (msg.exitCode == 132) {
            self.requireOwner();
        }
        if (msg.exitCode == 133) {
            self.stopped = true;
            self.requireNotStopped();
        }
        if (msg.exitCode == 134) {
            self.id = beginCell().storeUint(0, 8).asSlice().fromBase64().preloadUint(0); // force not to ignore it by using storage variables
        }
        if (msg.exitCode == 135) {
            // copy & paste the below line in wrapper file(../build/Fireworks/tact_Firework.ts) instead of the second line of Fireworks_init() function - this is a dictionary containing another smart contract code which leads to 135 exit code
            // const __system = Cell.fromBase64('te6cckECIwEAB1EAAQHAAQEFodSXAgEU/wD0pBP0vPLICwMCAWIPBAIBIA0FAgEgDAYCAUgLBwIBIAkIAHWs3caGrS4MzmdF5eotqc1vCmiu5ihm5iaqaEpGiYzo5syoyYptJmhuDSoKamwmziqo5spNKy0NLapwQAIRrt7tnm2eNijAIAoAAiQAEbCvu1E0NIAAYACVu70YJwXOw9XSyuex6E7DnWSoUbZoJwndY1LStkfLMi068t/fFiOYJwIFXAG4BnY5TOWDquRyWyw4JwnZdOWrNOy3M6DpZtlGbopIAhG+KO7Z5tnjYowgDgACIwN+0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRTbPPLggts8IBIQARbI+EMBzH8BygBVQBEA8lBUINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEgbpUwcAHLAY4eINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8W4hL0AAHIgQEBzwDJAczJ7VQC9gGSMH/gcCHXScIflTAg1wsf3iCCEIQwhou6jtYw0x8BghCEMIaLuvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIQzBsE+AgghAF6DTmuhkTAvyO0DDTHwGCEAXoNOa68uCB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIEmwS4CCCEHKDsbi6jpQw0x8BghByg7G4uvLggdQBMds8f+DAAAHXScEhsJF/4HAXFATw+EFvJBAjXwMkbrOOF4ERTVNxxwWSMX+ZJSBu8tCAWMcF4vL0mSaBEU0CxwXy9OL4ACDIAYIQcoOxuFjLH8zJI9s8kyBus48kICBu8tCAbyIxggkxLQAjfwNwQwNtbds8IG7y0IBvIjBSQNs86FtwgwYmA39VMG1tFh4dFQEE2zweADSBAQH0hG+lwP+dIG7y0IABIG7y0IBvAuBbbQLQNPhBbyQQI18D+ENUECfbPAGBEU0CcFnIcAHLAXMBywFwAcsAEszMyfkAyHIBywFwAcsAEsoHy//J0CDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgixwXy9ANwgEBwVSBtbW3bPH8YHgDaAtD0BDBtAYIA6ksBgBD0D2+h8uCHAYIA6ksiAoAQ9BfIAcj0AMkBzHABygBAA1kg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyQKi+EFvJDAyJ26zjheBEU1ToccFkjF/mSggbvLQgFjHBeLy9JkpgRFNAscF8vTiJYEBASRZ9AxvoZIwbd9ujo8TXwNwgEBwVSBtbW3bPAHjDQF/HhoC+iTBFI72FYEBAVQQNCBulTBZ9FowlEEz9BTiA6QBggr68IChJnAGyFmCEAXoNOZQA8sfASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJQVBDMHABbW3bPOMOHhsD6jBTQds8IG6OhDAk2zzeIG7y0IBvIjFwUEOAQAPIVSCCEIQwhotQBMsfWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFoEBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsl/VTBtbds8AR0cHgA0gQEB9IxvpcD/nSBu8tCAASBu8tCAbwLgW20ANgGBAQH0eG+lwP+dIG7y0IABIG7y0IBvAuBbbQHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAfAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMArjtRNDUAfhj0gAB4wL4KNcLCoMJuvLgifpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiBIC0QHbPCIhAAgBbW1wAPr6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kAh1wsBwwCOHQEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIkjFt4gH0BNQB0IEBAdcAMBUUQzBsFUhhij0=');
            let ctx: Context = context();
            let fireworks_init: StateInit = initOf Fireworks(0);
        }
        if (msg.exitCode == 136) {
            self.owner = newAddress(1, 0); // 1 is an invalid chain_id(basechain_id : 0)
        }
        if (msg.exitCode == 137) {
            self.owner = newAddress(-1, 0); // masterchain_id : -1
        }
    }

    get fun id(): Int {
        return self.id;
    }
}


================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/ton-community/tact-fireworks/blob/main/contracts/imports/stdlib.fc
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


================================================
FILE: contracts/natives.fc
URL: https://github.com/ton-community/tact-fireworks/blob/main/contracts/natives.fc
================================================
() pop_10() impure asm "s10 POP";

() stack_overflow() impure asm """<{ }>CONT
                                0 SETNUMARGS
                                1 -1 SETCONTARGS""";

() type_check_error() impure asm """<{ }>CONT
                                0 SETNUMARGS
                                0 PUSHINT
                                1 -1 SETCONTARGS""";

() set_c5(cell actions) impure asm "c5 POP";

() dict_exit_10() impure {
    cell dict = new_dict();
    dict~idict_set(1, 0, begin_cell()
        .store_ref(
            begin_cell()
            .store_uint(0, 1)
            .end_cell())
        .store_ref(begin_cell()
            .store_uint(0, 1)
            .end_cell())
            .end_cell()
            .begin_parse());

    (cell value, _) = dict.idict_get_ref?(1, 0);
    value~impure_touch();
}


================================================
FILE: jest.config.ts
URL: https://github.com/ton-community/tact-fireworks/blob/main/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: package.json
URL: https://github.com/ton-community/tact-fireworks/blob/main/package.json
================================================
{
    "name": "tact-fireworks",
    "version": "0.0.1",
    "scripts": {
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest --verbose"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.14.2",
        "@ton/core": "^0.53.0",
        "@ton/crypto": "^3.2.0",
        "@ton/sandbox": "^0.13.1",
        "@ton/test-utils": "^0.4.2",
        "@ton/ton": "^13.9.0",
        "@types/jest": "^29.5.0",
        "@types/node": "^20.2.5",
        "jest": "^29.5.0",
        "prettier": "^3.1.0",
        "ts-jest": "^29.0.5",
        "ts-node": "^10.9.1",
        "typescript": "^5.3.2"
    },
    "dependencies": {
        "@tact-lang/compiler": "^1.1.5"
    }
}



================================================
FILE: tests/Fireworks.EdgeCases.spec.ts
URL: https://github.com/ton-community/tact-fireworks/blob/main/tests/Fireworks.EdgeCases.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton/sandbox';
import { toNano, ContractProvider, Address, Sender, Contract, } from '@ton/core';
import { Fireworks } from '../wrappers/Fireworks';
import '@ton/test-utils';

enum ExitCode {
    Success = 0,
    StackUnderflow = 2,
    StackOverflow = 3,
    IntegerOverflow = 4,
    IntegerOutOfRange = 5,
    InvalidOpcode = 6,
    TypeCheckError = 7,
    CellOverflow = 8,
    CellUnderflow = 9,
    DictionaryError = 10,
    OutOfGasError = 13, // output -> -14
    ActionListInvalid = 32,
    ActionInvalid = 34,
    NotEnoughTON = 37,
    NotEnoughExtraCurrencies = 38,
    NullReferenceException = 128,
    InvalidSerializationPrefix = 129,
    InvalidIncomingMessage = 130,
    ConstraintsError = 131,
    AccessDenied = 132,
    ContractStopped = 133, // output -> 40368
    InvalidArgument = 134,
    CodeNotFound = 135,
    InvalidAddress = 136,
    MasterchainSupportNotEnabled = 137,
}

class FakeFireworks implements Contract {
    readonly address: Address;
    constructor(address: Address) { this.address = address; }
    async send(provider: ContractProvider, via: Sender, value: bigint) { await provider.internal(via, { value }); }
}

describe('Fireworks', () => {
    let blockchain: Blockchain;
    let fireworks: SandboxContract<Fireworks>;
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        fireworks = blockchain.openContract(await Fireworks.fromInit(0n));
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await fireworks.send(deployer.getSender(), { value: toNano('2'), }, { $$type: 'Deploy', queryId: 0n, });
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fireworks.address,
            deploy: true,
            success: true,
        });
    });

    it('compute phase | exit code = 0', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.Success) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: true, exitCode: ExitCode.Success })
    });

    it('compute phase | exit code = 2', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.StackUnderflow) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.StackUnderflow });
    });

    it('compute phase | exit code = 3', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.StackOverflow) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.StackOverflow })
    });

    it('compute phase | exit code = 4', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.IntegerOverflow) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.IntegerOverflow })
    });

    it('compute phase | exit code = 5', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.IntegerOutOfRange) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.IntegerOutOfRange })
    });

    it('compute phase | exit code = 7', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.TypeCheckError) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.TypeCheckError })
    });

    it('compute phase | exit code = 8', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.CellOverflow) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.CellOverflow })
    });

    it('compute phase | exit code = 9', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.CellUnderflow) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.CellUnderflow })
    });

    it('compute phase | exit code = 10', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.DictionaryError) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.DictionaryError })
    });

    it('compute phase | exit code = 13', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.OutOfGasError) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: -14 })
    });

    it('action phase | exit code = 32', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.ActionListInvalid) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, actionResultCode: ExitCode.ActionListInvalid })
    });

    it('action phase | exit code = 34', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.ActionInvalid) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, actionResultCode: ExitCode.ActionInvalid })
    });

    it('action phase | exit code = 37', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.NotEnoughTON) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, actionResultCode: ExitCode.NotEnoughTON })
    });

    it('tact exit code | exit code = 130', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeFireworks = blockchain.openContract(new FakeFireworks(fireworks.address));
        const fakeLaunch = await fakeFireworks.send(faker.getSender(), toNano('0.05'));
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.InvalidIncomingMessage })
    });

    it('tact exit code | exit code = 132', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.AccessDenied) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.AccessDenied })
    });

    it('tact exit code | exit code = 133', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.ContractStopped) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: 40368 })
    });

    it('tact exit code | exit code = 134', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.InvalidArgument) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.InvalidArgument })
    });

    // it('tact exit code | exit code = 135', async () => {
    //     const faker = await blockchain.treasury('faker');
    //     const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.CodeNotFound) });
    //     expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.CodeNotFound })
    // });

    it('tact exit code | exit code = 136', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.InvalidAddress) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.InvalidAddress })
    });

    it('tact exit code | exit code = 137', async () => {
        const faker = await blockchain.treasury('faker');
        const fakeLaunch = await fireworks.send(faker.getSender(), { value: toNano('0.05'), }, { $$type: 'FakeLaunch', exitCode: BigInt(ExitCode.MasterchainSupportNotEnabled) });
        expect(fakeLaunch.transactions).toHaveTransaction({ from: faker.address, to: fireworks.address, success: false, exitCode: ExitCode.MasterchainSupportNotEnabled })
    });
});



================================================
FILE: tests/Fireworks.spec.ts
URL: https://github.com/ton-community/tact-fireworks/blob/main/tests/Fireworks.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
import { toNano, beginCell } from '@ton/core';
import {Fireworks, Opcodes} from '../wrappers/Fireworks';
import '@ton/test-utils';

describe('Fireworks', () => {
    let blockchain: Blockchain;
    let fireworks: SandboxContract<Fireworks>;
    let launched_f1: SandboxContract<Fireworks>;
    let launched_f2: SandboxContract<Fireworks>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        blockchain.verbosity = {
            ...blockchain.verbosity,
            blockchainLogs: true,
            vmLogs: 'vm_logs_full',
            debugLogs: true,
            print: false,
        }


        fireworks = blockchain.openContract(await Fireworks.fromInit(0n));
        launched_f1 = blockchain.openContract(await Fireworks.fromInit(1n));
        launched_f2 = blockchain.openContract(await Fireworks.fromInit(2n));


        //creating special treasury in Sandbox blockchain space. Treasury is a wallet which owned Toncoins on its balance.
        const launcher = await blockchain.treasury('deployer');

        console.log('launcher = ', launcher.address);
        console.log('Fireworks = ', fireworks.address);

        const deployResult = await fireworks.send(
            launcher.getSender(),
            {
                value: toNano('2.0'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );


        expect(deployResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            deploy: true,
            success: true,
        });
    });


    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fireworks are ready to use
    });

    it('first transaction[ID:1] should set fireworks successfully', async () => {

        const launcher = await blockchain.treasury('launcher');

        console.log('launcher = ', launcher.address);
        console.log('Fireworks = ', fireworks.address);

        const launchResult = await fireworks.send(
            launcher.getSender(),
            {
                value: toNano('2'),
            },
            {
                $$type: 'SetFirst',
                queryId: 1n
            }
        );

        console.log(printTransactionFees(launchResult.transactions));


        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: true,
            op: Opcodes.set_first
        })

    });


        it('should exist a transaction[ID:2] which launch first fireworks successfully', async () => {

            const launcher = await blockchain.treasury('launcher');

            console.log('launcher = ', launcher.address);
            console.log('Fireworks = ', fireworks.address);

            const launchResult = await fireworks.send(
                launcher.getSender(),
                {
                    value: toNano('2'),
                },
                {
                    $$type: 'SetFirst',
                    queryId: 1n
                }
            );

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


            it('should exist a transaction[ID:3] which launch second fireworks successfully', async () => {

                const launcher = await blockchain.treasury('launcher');

                console.log('launcher = ', launcher.address);
                console.log('Fireworks = ', fireworks.address);

                const launchResult = await fireworks.send(
                    launcher.getSender(),
                    {
                        value: toNano('2'),
                    },
                    {
                        $$type: 'SetFirst',
                        queryId: 1n
                    }
                );

                expect(launchResult.transactions).toHaveTransaction({
                    from: fireworks.address,
                    to: launched_f2.address,
                    success: true,
                    op: Opcodes.launch_second,
                    outMessagesCount: 1
                })

                printTransactionFees(launchResult.transactions);

            });



            it('should exist a transaction[ID:4] with a comment send mode = 0', async() => {

                const launcher = await blockchain.treasury('launcher');

                console.log('launcher = ', launcher.address);
                console.log('Fireworks = ', fireworks.address);

                const launchResult = await fireworks.send(
                    launcher.getSender(),
                    {
                        value: toNano('2'),
                    },
                    {
                        $$type: 'SetFirst',
                        queryId: 1n
                    }
                );

                expect(launchResult.transactions).toHaveTransaction({
                    from: launched_f1.address,
                    to: launcher.address,
                    success: true,
                    body: beginCell().storeUint(0,32).storeStringTail("send mode = 0").endCell() // 0x00000000 comment opcode and encoded comment

                });
            })


            it('should exist a transaction[ID:5] with a comment send mode = 1', async() => {

                const launcher = await blockchain.treasury('launcher');

                console.log('launcher = ', launcher.address);
                console.log('Fireworks = ', fireworks.address);

                const launchResult = await fireworks.send(
                    launcher.getSender(),
                    {
                        value: toNano('2'),
                    },
                    {
                        $$type: 'SetFirst',
                        queryId: 1n
                    }
                );

                expect(launchResult.transactions).toHaveTransaction({
                    from: launched_f1.address,
                    to: launcher.address,
                    success: true,
                    body: beginCell().storeUint(0,32).storeStringTail("send mode = 1").endCell() // 0x00000000 comment opcode and encoded comment
                });

            })


        it('should exist a transaction[ID:6] with a comment send mode = 2', async() => {


            const launcher = await blockchain.treasury('launcher');

            console.log('launcher = ', launcher.address);
            console.log('Fireworks = ', fireworks.address);

            const launchResult = await fireworks.send(
                launcher.getSender(),
                {
                    value: toNano('2'),
                },
                {
                    $$type: 'SetFirst',
                    queryId: 1n
                }
            );

            expect(launchResult.transactions).toHaveTransaction({
                from: launched_f1.address,
                to: launcher.address,
                success: true,
                body: beginCell().storeUint(0,32).storeStringTail("send mode = 2").endCell() // 0x00000000 comment opcode and encoded comment
            });

        })



    it('should exist a transaction[ID:7] with a comment send mode = 32 + 128', async() => {

        const launcher = await blockchain.treasury('launcher');

        console.log('launcher = ', launcher.address);
        console.log('Fireworks = ', fireworks.address);

        const launchResult = await fireworks.send(
            launcher.getSender(),
            {
                value: toNano('2'),
            },
            {
                $$type: 'SetFirst',
                queryId: 1n
            }
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f1.address,
            to: launcher.address,
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("send mode = 128 + 32").endCell() // 0x00000000 comment opcode and encoded comment
        });
    })



    it('should exist a transaction[ID:8] with a comment send mode = 64', async() => {

        const launcher = await blockchain.treasury('launcher');

        console.log('launcher = ', launcher.address);
        console.log('Fireworks = ', fireworks.address);

        const launchResult = await fireworks.send(
            launcher.getSender(),
            {
                value: toNano('2'),
            },
            {
                $$type: 'SetFirst',
                queryId: 1n
            }
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launched_f2.address,
            to: launcher.address,
            success: true,
            //TO DO find the reason why this fall
            body: beginCell().storeUint(0,32).storeStringTail("send mode = 64").endCell() // 0x00000000 comment opcode and encoded comment

        });

    })


    it('transaction in fireworks failed on Action Phase because insufficient funds ', async() => {

        const launcher = await blockchain.treasury('launcher');

        console.log('launcher = ', launcher.address);
        console.log('Fireworks = ', fireworks.address);

        const launchResult = await fireworks.send(
            launcher.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'SetFirst',
                queryId: 1n
            }
        );

        expect(launchResult.transactions).toHaveTransaction({
            from: launcher.address,
            to: fireworks.address,
            success: false,
            aborted: true,
            actionResultCode : 37,
            // exit code = Not enough TON. Message sends too much TON (or there is not enough TON after deducting fees). https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes
            op: Opcodes.set_first

        });

    })



    it('transactions should be processed with expected fees', async() => {

        const launcher = await blockchain.treasury('launcher');

        console.log('launcher = ', launcher.address);
        console.log('Fireworks = ', fireworks.address);

        const launchResult = await fireworks.send(
            launcher.getSender(),
            {
                value: toNano('2'),
            },
            {
                $$type: 'SetFirst',
                queryId: 1n
            }
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



        console.log('launcher address = ', launcher.address);
        console.log('fireworks address = ', fireworks.address);
        console.log('launched_f1 address = ', launched_f1.address);
        console.log('launched_f2 address = ', launched_f2.address);

    });

});







================================================
FILE: wrappers/Fireworks.compile.ts
URL: https://github.com/ton-community/tact-fireworks/blob/main/wrappers/Fireworks.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/fireworks.tact',
    options: {
        debug: true,
    }
};



================================================
FILE: wrappers/Fireworks.ts
URL: https://github.com/ton-community/tact-fireworks/blob/main/wrappers/Fireworks.ts
================================================
export * from '../build/Fireworks/tact_Fireworks';

export const Opcodes = {
    set_first: 0xda1e3345,
    launch_first: 0xf1c5c2b7,
    launch_second: 0x282c90a5,
    fake_launch: 0xa1477463,
};




# Repository: tact-challenge
URL: https://github.com/ton-community/tact-challenge
Branch: main

## Directory Structure:
```
└── tact-challenge/
    ├── README.md
    ├── contracts/
        ├── 1.tact
        ├── 2.tact
        ├── 3.tact
        ├── 4.tact
        ├── 5.tact
        ├── imports/
            ├── stdlib.fc
    ├── jest.config.ts
    ├── package.json
    ├── tests/
        ├── Task1.spec.ts
        ├── Task2.spec.ts
        ├── Task3.spec.ts
        ├── Task4.spec.ts
        ├── Task5.spec.ts
    ├── wrappers/
        ├── Task1.compile.ts
        ├── Task1.ts
        ├── Task2.compile.ts
        ├── Task2.ts
        ├── Task3.compile.ts
        ├── Task3.ts
        ├── Task4.compile.ts
        ├── Task4.ts
        ├── Task5.compile.ts
        ├── Task5.ts
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/ton-community/tact-challenge/blob/main/README.md
================================================
# 🏆 Welcome to Tact Challenge
### by TON Foundation

## 📝 Tasks

1. [task1](/contracts/1.tact) - Counter contract 
2. [task2](/contracts/2.tact) - Proxy contract 
3. [task3](/contracts/3.tact) - Dex contract
4. [task4](/contracts/4.tact) - NFT locker contract
5. [task5](/contracts/5.tact) - NFT random swap

Each task has two parts:

- 📋 A comment with a description of what the smart contract should do.
- 💻 The code of the smart contract with one or more functions marked as `testable`.

The goal of the contestants is to provide a code that matches the description.

Each task may give the contestant either 0 or 5 to 6 score points: 5 for all tests passed plus "gas-score" from 0 to 1 (0 for "infinite" gas consumption, 1 for 0 gas consumption, dependence is inverse exponent).

Each TVM execution is limited to 100,000,000 (hundred million) gas units.
This limit is high enough that it only rules out infinite loops. Any practical solution, regardless of how (un)optimized it is, will fit.

We ask participants not to change the signature (number, order, and types of arguments and result) of `testable` functions for us to be able to evaluate their submission.

## 📅 Solution submission guide and terms

1. **Registration Process**: Before you begin, make sure to go through the registration process via the [@smartchallengebot](https://t.me/smartchallengebot?start=true). Your solutions will not be accepted if you are not properly registered.

2. **Create a Private GitHub Repository**: Clone this repository and set it as your own private GitHub repo. **Ensuring the visibility configs are set to "private"** is crucial to safeguarding your solution.

3. **Set Your Token**: Utilize the `token` provided to you during registration in Telegram bot and set it as a secret variable called USER_TOKEN in your private repository. You can learn more about setting secret variables in the [official GitHub documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).

4. **Submit Your Solution**: When you are ready to submit your solution, simply push your code into your private repository. The code will be sent to the task review server, and GitHub actions will display the status of your submission.

5. **Solution Evaluation**: If at least one of your solutions works well, your submission will be counted. Feel free to push solutions for more tasks; GitHub actions will run your code against tests and count successful submissions. To see a detailed report on your submission, proceed to GitHub Actions tab and you will see a similar report along with possible errors if present:
<div align="center">
  
| Task ID | Compiled | Tests Passed | Points | Gas Used | Compilation Error |
|---------|:--------:|:------------:|:------:|:----------------------:|:-----------------:|
| 1 | ❌ | ❌ | 0 | N/A | [Error Details](#compilation-error-task-1) |
| 2 | ✅ | ❌ 0/6 | 0 | 0 |  |
| 3 | ✅ | ✅ 10/10 | 5.127 | 491,235,717 |  |
| 4 | ❌ | ❌ | 0 | N/A | [Error Details](#compilation-error-task-4) |
| 5 | ❌ | ❌ | 0 | N/A | [Error Details](#compilation-error-task-5) |
  
</div>

6. **Check Your Points**: To check your solution points, review the logs of the GitHub action for your latest commit. Additionally, you can find your solution points in the menu button inside of the Telegram bot.

**Best of luck with your submissions!**

## ‼️ Important rules:
- It's forbidden to use any FunC/Fift code inside of submitted Tact solutions. Participants who will have FunC/Fift code in their submissions will be disqualified. This rule applies to Tact bindings as they're using a lower level of abstraction thus compromising the nature of Tact Challenge.
- Please don't share your solution's code with anybody. If someone's submission will be suspected of using your code - both participants will be disqualified. Repeated case will cause lifetime ban from TON Smart Challenges.

## 🏆 Scoring and Prizes

Winners of the contest will receive prizes denominated in Toncoin, the native cryptocurrency of TON blockchain, which is also used as a resource for contract execution.

Each task can bring you a max of 6 points. You get 5 points for solving a task. You get an extra point if you solve it without using any gas.

**Minimum amount** of points to be eligible for the prize is **6 points**.

Prizes:
- The top 15% of participants share $10,000 in TON
- The middle 30% of participants share $10,000 in TON
- The bottom 55% of participants share $10,000 in TON

Each prize pool is shared equally among the participants in that group. In total, we're giving away $30,000 in TON prizes.

The total prize might change depending on the number of participants.

## 🚀 Getting Started with TON

New to blockchain or TON development? Start here:

- [Blockchain Basics](https://blog.ton.org/what-is-blockchain)
- [TON Intro](https://docs.ton.org/learn/introduction)
- [Developer Portal](https://ton.org/dev?filterBy=developSmartContract)

### 📘 Essential Tact Resources

Master the Tact language with these must-have materials:

- [Tact by Example](https://tact-by-example.org/)
- [Tact Docs](https://tact-lang.org/)
- [Video Tutorials](https://www.youtube.com/@AlefmanVladimirEN-xb4pq/videos)
- [Join Tact Community](https://t.me/tactlang)

Find ready-to-use smart contract examples [here](https://github.com/tact-lang/awesome-tact#-smart-contracts-examples). Explore more about Tact in the [awesome-tact repository](https://github.com/tact-lang/awesome-tact).

### 🛠️ Tools for Tact Compilation and Testing

#### For Tact Challenge

For Tact Challenge we recommend cloning current repository and follow the submission guide described above.

#### To quickstart your own Tact projects

We recommend using [tact-template](https://github.com/tact-lang/tact-template) for a smooth Tact development experience:

1. Clone the [template repo](https://github.com/tact-lang/tact-template)
2. `yarn build` to build contracts
3. `yarn test` to test contracts
4. `yarn deploy` to deploy contracts

### 🌍 TON Developers Community Chats

Stay in the loop and engage with other developers:

- [TON Dev Chat (EN)](https://t.me/tondev_eng)
- [TON Dev Chat (中文)](https://t.me/tondev_zh)
- [TON Dev Chat (РУ)](https://t.me/tondev)



================================================
FILE: contracts/1.tact
URL: https://github.com/ton-community/tact-challenge/blob/main/contracts/1.tact
================================================
import "@stdlib/deploy";

/*
  TASK 1 - Counter 
  Implement a counter contract that will have 2 opcodes ('Add' / 'Subtract'),
  which adds or subtracts the received number (int32) from the number that is stored in the state (and stores the result back in the state).
  You also need to implement one getter with the name "counter" to get the current number from the state.
*/

message Add {
  queryId: Int as uint64;
  number: Int as uint32;
}

message Subtract {
  queryId: Int as uint64;
  number: Int as uint32;
}

contract Task1 with Deployable {
    counter: Int as int32;

    init() {
      self.counter = 0;
    }

    receive(msg: Add) {
    }
    
    receive(msg: Subtract) {
    }

    get fun counter(): Int {
    }
}



================================================
FILE: contracts/2.tact
URL: https://github.com/ton-community/tact-challenge/blob/main/contracts/2.tact
================================================
import "@stdlib/deploy";

/*
  TASK 2 - Proxy 
  Create a contract that forwards all received TONs
  to the admin contract (whose address is set in init_store).
  Message from this proxy contract to the admin contract should contain:
    - Address of user who sent original message (should be stored in the outcoming body's data/bits)
    - Original message that proxy smart contract received from user (should be stored in the outcoming body's first ref)
  Also, if admin contract decides to reject message (if it sends to the proxy "Refund" message with opcode=0x44),
  proxy contract needs to forward all TONs (attached to Refund message) back to the user.
  User address will be provided in Refund message body as "sender".
  In refund transaction, it is important to have a check that the refund message came from the admin address
*/

message(0x44) Refund {
  queryId: Int as uint64;
  sender: Address;
}

contract Task2 with Deployable {
  admin: Address;

  init(admin: Address) {
    self.admin = admin;
  }
  
  receive(msg: Refund) {
  }

  receive(msg: Slice) {
  }
}



================================================
FILE: contracts/3.tact
URL: https://github.com/ton-community/tact-challenge/blob/main/contracts/3.tact
================================================
import "@stdlib/deploy";

/*
  TASK 3 - DEX
  Create a simple jetton dex contract that trades one pair of jettons: A and B.
  The price of jettons depends on the amount of jettons that smart contract has.
  Therefore, the smart contract needs to keep track of how much jettons it has.
  
  Price for the jetton A in swap B->A should be calculated by formula "amountOfJettonAOnContract * decimal / amountOfJettonBOnContract".
  Token prices must be decimalized for accuracy, so it is the prices that must be adjusted to decimal 1e9.
  Decimals are only needed for price accuracy. It should be set as 1e9.
  So, if smart contract has 10 of jetton A and 2 of jetton B, then after sending 1 jetton B you should receive 5 of jettons A.

  Example formula for amountOfAJettonToSend in B->A swap will be
  (amountOfJettonAOnContract * decimal / amountOfJettonBOnContract) * amountOfTokenBToSwap / decimal

  If smart contract pool doesn't have enough jettons to trade,
  then it should send incoming jettons back to the user. For a clearer explanation,
  let's look at the example we described above (smart contract has 10 of jetton A and 2 of jetton B).
  If user will send 3 jettons B, smart contract should reject the message (because contract does not have 3 * 5 = 15 jettons A)
  and send 3 jettons B back to the user.

  If smart contract receives a different jetton (neither A nor B) then throw an error.

  Implement a getter that returns the number of jettons in the pool and
  one more to get the price of jetton A or jetton B.
  Getters' behavior with incorrect parameter (address other than that of jetton A or B)
  is undefined (there are no such tests).
  
  Note:
  Admin can add jettons A and B just by sending them to the smart contract (we need to add initial supply to the pool for it to be functional).
  To be exact: any jettons (A or B) received from the admin are "added". Admin can't swap.
*/

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forwardPayload: Slice as remaining;
}

// To simplify the testing process and the specificity of the messages being sent, we decided to add clear default values in this transaction
message(0xf8a7ea5) TokenTransfer {
     queryId: Int as uint64; // should be 0
     amount: Int as coins; // should be amount of jettons to send
     destination: Address; // should be user address / TokenNotification.from
     responseDestination: Address?; // should be myAddress()
     customPayload: Cell?; // should be null
     forwardTonAmount: Int as coins; // should be ton("0.01")
     forwardPayload: Slice as remaining; // should be emptySlice()
}

contract Task3 with Deployable {
  owner: Address;
  aAmount: Int;
  bAmount: Int;
  jettonAddressA: Address;
  jettonAddressB: Address;
  decimal: Int;

  init(admin: Address, newJettonAddressA: Address, newJettonAddressB: Address) {
    self.owner = admin;
    self.jettonAddressA = newJettonAddressA;
    self.jettonAddressB = newJettonAddressB;
    self.aAmount = 0;
    self.bAmount = 0;
    self.decimal = 1000000000;
  }

  receive(msg: TokenNotification) {
  } 
  
  get fun price(jetton: Address): Int { 
  }
  
  get fun balance(jetton: Address): Int { 
  }
}



================================================
FILE: contracts/4.tact
URL: https://github.com/ton-community/tact-challenge/blob/main/contracts/4.tact
================================================
import "@stdlib/deploy";

/*
  TASK 4 - NFT locker
  Implement a smart contract that will lock NFT for a period of time specified by the owner.
  Smart conrtact should contain logic to process following messages and getters: 

  Messages: 
  * OwnershipAssigned
   - Recives nft + time (in a forwardPayload message as uint32) for which this nft will be locked + address of the sender of the nft (prevOwner).
   - If the smart contract already holds an nft then return the incoming nft back to the sender
  * NftWithdrawal
   - Request withdrawal of the locked nft
   - If sender is not the owner (that came from OwnershipAssigned as prevOwner address) then throw "Invalid sender" 
   - If time has not passed then send message back to the sender with the comment "NFT is still locked" according to the TON's "message with text comment" standard 
   - Otherwise (all good) send the locked nft back to the owner with all the remaining TON balance
   Note that the order of checks is important
   (in case: "sender is not the owner" and "time has not passed" at the same time, "Invalid sender" error takes priority)

  Getters:
  * time
   - get how much lock time is left
  * nft
   - get the address of the locked nft 
  * owner
   - get the owner of the locked nft (that came from OwnershipAssigned as prevOwner)
*/

message(0x05138d91) OwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Slice as remaining; 
}

message(0x5fcc3d14) Transfer { 
    queryId: Int as uint64;            
    newOwner: Address; 
    responseDestination: Address; 
    customPayload: Cell?; 
    forwardAmount: Int as coins; 
    forwardPayload: Slice as remaining; 
}

message NftWithdrawal {
  queryId: Int as uint64;
  nftAddress: Address;
}

contract Task4 with Deployable {
  seed: Int as uint128;
  
  init(seed: Int) {
    self.seed = seed; // needed to deploy multiple smart contracts copies from one admin address
  }

  receive(msg: OwnershipAssigned) {
  }

  receive(msg: NftWithdrawal) {
  }

  get fun time(): Int {
  }

  get fun nft(): Address? {
  }

  get fun owner(): Address? {
  }
}


================================================
FILE: contracts/5.tact
URL: https://github.com/ton-community/tact-challenge/blob/main/contracts/5.tact
================================================
import "@stdlib/deploy";

/*
  TASK 5 - NFT random swap 
  The smart contract contains a bunch of different NFTs.
  A user brings his NFT (sends it to the smart contract), with 2.1 TON (2 for admin's profit, 0.1 for gas) in attachment (as fee for swap).
  The smart contract randomly chooses some NFT from the available NFTs (including the newly incoming one) and gives it to the user in exchange for the brought NFT (but occasionally just returns user's NFT in some cases).
  Admin can deposit NFTs without swap logic. Any NFT received from the admin is considered deposited. Admin can't swap.
  Admin can withdraw all NFTs at once, and also all TONs collected from users as fees.
  Implement getter that will return NFT addresses held by the smart contract.
  Implement getter that will return the amount of admin`s profit collected.

  In details, the smart contract (later: SC) should have this logic:
  Messages
  * AdminWithdrawalProfit 
   - SC should check that sender is the admin / otherwise throw "Insufficient privelegies"
   - SC should send all collected fees to admin except 0.1 TON (use AdminFetchProfit message as body)
     In other words: after each such operation, the contract's balance should be equal to 0.1 TON (which are reserved for storage) and the rest should be sent to the admin
  * AdminWithdrawalAllNFTs
   - SC should check that incoming tx TON value is enough for NFT withdrawal. Specifically, at least: (1 + totalNftsHeld * 0.08) TONs. Otherwise throw "Insufficent funds"
   - SC should check that sender is the admin, throw "Invalid sender" otherwise
   - If all checks pass, SC should send NFTs one by one to the admin 
   - SC should be able to withdraw all NFTs by a single message from admin
  * OwnershipAssigned 
   - if prevOwner is the owner's (admin) address, then add NFT to the collection
   - if value of TON attached is less then 2.1 TON then stop execution and return NFT back,
     but only in case that TON attached is enough to process refund without losing TONs on the SC's balance
   - randomly select NFT to send from all the NFTs that smart contract has
   - send the selected NFT to the sender with all remaining balance (except for admin profit = fees collected from this and other swaps)
     In other words: the contract's balance should increase by exactly 2 TON, some incoming TONs will be consumed for gas and the remainings of the incoming TONs should be refunded to the sender
  
  Getters
  * profit
   - returns how much collected fees is available to withdraw for the admin (all fees minus 0.1 TON)
  * nfts
   - returns dict of held NFTs with NFT indexes (sequential numbers from 0, 1, 2 ... and up to 'totalNftsHeld-1') as keys and NFT address as values 
     the order of NFTs in this dictionary doesn't matter
*/

message AdminWithdrawalProfit {
  queryId: Int as uint64;
}

message AdminWithdrawalAllNFTs {
  queryId: Int as uint64;
}

message AdminFetchProfit {
  queryId: Int as uint64;
}

message(0x05138d91) OwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Slice as remaining; 
}

message(0x5fcc3d14) Transfer { 
    queryId: Int as uint64;            
    newOwner: Address; 
    responseDestination: Address; 
    customPayload: Cell?; 
    forwardAmount: Int as coins; 
    forwardPayload: Slice as remaining; 
}

contract Task5 with Deployable {
  seed: Int as uint128;
  owner: Address;
  
  init(seed: Int, owner: Address) {
    self.owner = owner;
    self.seed = seed; // needed to deploy multiple smart contracts copies from one admin address
  }

  receive(msg: OwnershipAssigned) {
  }

  receive(msg: AdminWithdrawalProfit) {
  }

  receive(msg: AdminWithdrawalAllNFTs) {
  }

  get fun profit(): Int { 
  }
  
  get fun nfts(): map<Int as uint16, Address> { 
  }
}



================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/ton-community/tact-challenge/blob/main/contracts/imports/stdlib.fc
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


================================================
FILE: jest.config.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: package.json
URL: https://github.com/ton-community/tact-challenge/blob/main/package.json
================================================
{
    "name": "tsc5",
    "version": "0.0.1",
    "scripts": {
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest"
    },
    "devDependencies": {
        "@ton-community/blueprint": "^0.12.0",
        "@ton-community/sandbox": "^0.11.0",
        "@ton-community/test-utils": "^0.3.0",
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
FILE: tests/Task1.spec.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/tests/Task1.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';

describe('Task1', () => {
    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        task1 = blockchain.openContract(await Task1.fromInit());
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await task1.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('test', async () => {
    });
});



================================================
FILE: tests/Task2.spec.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/tests/Task2.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Task2 } from '../wrappers/Task2';

describe('Task2', () => {
    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        task2 = blockchain.openContract(await Task2.fromInit());
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await task2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('test', async () => {
    });
});




================================================
FILE: tests/Task3.spec.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/tests/Task3.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';

describe('Task3', () => {
    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        task3 = blockchain.openContract(await Task3.fromInit());
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await task3.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('test', async () => {
    });
});





================================================
FILE: tests/Task4.spec.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/tests/Task4.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Task4 } from '../wrappers/Task4';

describe('Task4', () => {
    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        task4 = blockchain.openContract(await Task4.fromInit());
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await task4.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('test', async () => {
    });
});





================================================
FILE: tests/Task5.spec.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/tests/Task5.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Task5 } from '../wrappers/Task5';

describe('Task5', () => {
    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        task5 = blockchain.openContract(await Task5.fromInit());
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await task5.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('test', async () => {
    });
});






================================================
FILE: wrappers/Task1.compile.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task1.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/1.tact',
};



================================================
FILE: wrappers/Task1.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task1.ts
================================================
export * from '../build/Task1/tact_Task1';



================================================
FILE: wrappers/Task2.compile.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task2.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/2.tact',
};



================================================
FILE: wrappers/Task2.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task2.ts
================================================
export * from '../build/Task2/tact_Task2';



================================================
FILE: wrappers/Task3.compile.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task3.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/3.tact',
};



================================================
FILE: wrappers/Task3.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task3.ts
================================================
export * from '../build/Task3/tact_Task3';



================================================
FILE: wrappers/Task4.compile.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task4.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/4.tact',
};



================================================
FILE: wrappers/Task4.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task4.ts
================================================
export * from '../build/Task4/tact_Task4';



================================================
FILE: wrappers/Task5.compile.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task5.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/5.tact',
};



================================================
FILE: wrappers/Task5.ts
URL: https://github.com/ton-community/tact-challenge/blob/main/wrappers/Task5.ts
================================================
export * from '../build/Task5/tact_Task5';




# Repository: tact-challenge
URL: https://github.com/ton-community/nft-sdk
Branch: main

## Directory Structure:
```
└── tact-challenge/
    ├── .eslintrc.json
    ├── README.md
    ├── cli/
        ├── README.md
        ├── dist/
            ├── cli/
                ├── src/
                    ├── index.js
                    ├── index.js.map
                    ├── nftCollection.js
                    ├── nftCollection.js.map
                    ├── nftSingle.js
                    ├── nftSingle.js.map
                    ├── utils/
                        ├── createKeyPair.js
                        ├── createKeyPair.js.map
                        ├── createSender.js
                        ├── createSender.js.map
                        ├── importKeyPair.js
                        ├── importKeyPair.js.map
            ├── src/
                ├── index.js
                ├── index.js.map
                ├── storage/
                    ├── AmazonS3.js
                    ├── AmazonS3.js.map
                    ├── Pinata.js
                    ├── Pinata.js.map
                ├── ton-api/
                    ├── index.js
                    ├── index.js.map
                ├── transaction-parsing/
                    ├── EditContent.js
                    ├── EditContent.js.map
                    ├── NftTransfer.js
                    ├── NftTransfer.js.map
                    ├── RoyaltyInfo.js
                    ├── RoyaltyInfo.js.map
                    ├── TransferEditorship.js
                    ├── TransferEditorship.js.map
                    ├── index.js
                    ├── index.js.map
                ├── types/
                    ├── OffchainContent.js
                    ├── OffchainContent.js.map
                ├── utils/
                    ├── EligibleInternalTx.js
                    ├── EligibleInternalTx.js.map
                    ├── FetchAndParseTransaction.js
                    ├── FetchAndParseTransaction.js.map
                    ├── combineFunc.js
                    ├── combineFunc.js.map
                    ├── createSender.js
                    ├── createSender.js.map
                    ├── createTempFile.js
                    ├── createTempFile.js.map
                    ├── importKeyPair.js
                    ├── importKeyPair.js.map
                    ├── index.js
                    ├── index.js.map
                    ├── parseTransaction.js
                    ├── parseTransaction.js.map
                    ├── randomAddress.js
                    ├── randomAddress.js.map
                    ├── randomKeyPair.js
                    ├── randomKeyPair.js.map
                    ├── uuid.js
                    ├── uuid.js.map
                ├── wrappers/
                    ├── getgems/
                        ├── NftAuction.js
                        ├── NftAuction.js.map
                        ├── NftAuctionV2.js
                        ├── NftAuctionV2.js.map
                        ├── NftCollection.js
                        ├── NftCollection.js.map
                        ├── NftFixedPrice.js
                        ├── NftFixedPrice.js.map
                        ├── NftFixedPriceV2.js
                        ├── NftFixedPriceV2.js.map
                        ├── NftFixedPriceV3.js
                        ├── NftFixedPriceV3.js.map
                        ├── NftItem.js
                        ├── NftItem.js.map
                        ├── NftMarketplace.js
                        ├── NftMarketplace.js.map
                        ├── NftOffer.js
                        ├── NftOffer.js.map
                        ├── NftSingle.js
                        ├── NftSingle.js.map
                        ├── NftSwap.js
                        ├── NftSwap.js.map
                        ├── SbtSingle.js
                        ├── SbtSingle.js.map
                    ├── standard/
                        ├── NftItem.js
                        ├── NftItem.js.map
                        ├── NftItemRoyalty.js
                        ├── NftItemRoyalty.js.map
        ├── package.json
        ├── src/
            ├── index.ts
            ├── nftCollection.ts
            ├── nftSingle.ts
            ├── utils/
                ├── createKeyPair.ts
                ├── createSender.ts
                ├── importKeyPair.ts
    ├── docs/
        ├── .nojekyll
        ├── assets/
            ├── highlight.css
            ├── main.js
            ├── search.js
            ├── style.css
        ├── classes/
            ├── AmazonS3.html
            ├── NftAuction.html
            ├── NftAuctionV2.html
            ├── NftCollection.html
            ├── NftFixedPrice.html
            ├── NftFixedPriceV2.html
            ├── NftFixedPriceV3.html
            ├── NftItem.html
            ├── NftItemRoyalty.html
            ├── NftMarketplace.html
            ├── NftOffer.html
            ├── NftSwap.html
            ├── Pinata.html
            ├── SbtSingle.html
            ├── Storage.html
            ├── TonNftClient.html
        ├── enums/
            ├── ENDPOINT.html
        ├── functions/
            ├── TransactionParsing.parseTransaction.html
            ├── buildSignature.html
            ├── createSender.html
            ├── createTempFile.html
            ├── importKeyPair.html
            ├── isEligibleTransaction.html
            ├── loadChunkedData.html
            ├── loadChunkedRaw.html
            ├── loadContentData.html
            ├── loadFullContent.html
            ├── loadOffchainContent.html
            ├── loadOnchainContent.html
            ├── loadOnchainDict.html
            ├── loadSnakeData.html
            ├── randomAddress.html
            ├── randomKeyPair.html
            ├── storeChunkedData.html
            ├── storeChunkedRaw.html
            ├── storeFullContent.html
            ├── storeOffchainContent.html
            ├── storeOnchainContent.html
            ├── storeOnchainDict.html
            ├── storeSnakeData.html
            ├── uuid.html
        ├── index.html
        ├── interfaces/
            ├── ClientInterface.html
        ├── modules/
            ├── TransactionParsing.html
        ├── modules.html
        ├── types/
            ├── CollectionMintItemInput.html
            ├── NftAuctionData.html
            ├── NftAuctionV2Data.html
            ├── NftCollectionData.html
            ├── NftFixPriceSaleData.html
            ├── NftFixPriceSaleV2Data.html
            ├── NftFixPriceSaleV3Data.html
            ├── NftItemData.html
            ├── NftMarketplaceData.html
            ├── NftMint.html
            ├── NftOfferData.html
            ├── OwnershipTransfer.html
            ├── RoyaltyParams.html
            ├── SbtSingleData.html
            ├── SwapData.html
        ├── variables/
            ├── OperationCodes.html
            ├── SwapState.html
    ├── examples/
        ├── TonAPI.ts
        ├── assets/
            ├── 0.jpg
            ├── 0.json
        ├── deployNftCollection.ts
        ├── mintNft.ts
        ├── transaction-parsing.ts
        ├── transferNft.ts
    ├── package.json
    ├── src/
        ├── index.ts
        ├── sources/
            ├── nft-item-editable-DRAFT.fc
            ├── nft-marketplace-v2.fc
            ├── nft-sale.fc
            ├── sbt-item.fc
        ├── storage/
            ├── AmazonS3.ts
            ├── Pinata.ts
            ├── index.ts
        ├── ton-api/
            ├── TonAPI.ts
            ├── index.ts
        ├── transaction-parsing/
            ├── index.ts
        ├── types/
            ├── Content.ts
        ├── utils/
            ├── EligibleInternalTx.ts
            ├── createKeyPair.ts
            ├── createSender.ts
            ├── createTempFile.ts
            ├── importKeyPair.ts
            ├── index.ts
            ├── randomAddress.ts
            ├── randomKeyPair.ts
            ├── uuid.ts
        ├── wrappers/
            ├── getgems/
                ├── NftAuction/
                    ├── NftAuction.ts
                    ├── nft-auction/
                        ├── build.sh
                        ├── nft-auction-code.base64
                        ├── nft-auction-code.boc
                        ├── nft-auction-code.fif
                        ├── nft-auction.func
                        ├── struct/
                            ├── exit-codes.func
                            ├── get-met.func
                            ├── handles.func
                            ├── math.func
                            ├── msg-utils.func
                            ├── op-codes.func
                            ├── stdlib.fc
                            ├── storage.func
                ├── NftAuctionV2/
                    ├── NftAuctionV2.ts
                    ├── nft-auction-v2/
                        ├── build.sh
                        ├── nft-auction-v2-code.base64
                        ├── nft-auction-v2-code.boc
                        ├── nft-auction-v2-code.fif
                        ├── nft-auction-v2.func
                        ├── struct/
                            ├── exit-codes.func
                            ├── get-met.func
                            ├── handles.func
                            ├── math.func
                            ├── msg-utils.func
                            ├── op-codes.func
                            ├── stdlib.fc
                            ├── storage.func
                ├── NftCollection/
                    ├── NftCollection.ts
                    ├── nft-collection.fc
                ├── NftCollectionEditable/
                    ├── NftCollectionEditable.ts
                    ├── nft-collection-editable.fc
                ├── NftFixedPrice/
                    ├── NftFixedPrice.ts
                    ├── nft-fixprice-sale.fc
                ├── NftFixedPriceV2/
                    ├── NftFixedPriceV2.ts
                    ├── nft-fixprice-sale-v2.fc
                ├── NftFixedPriceV3/
                    ├── NftFixedPriceV3.ts
                    ├── nft-fixprice-sale-v3.fc
                ├── NftItem/
                    ├── NftItem.ts
                    ├── nft-item.fc
                ├── NftMarketplace/
                    ├── NftMarketplace.ts
                    ├── nft-marketplace.fc
                ├── NftOffer/
                    ├── NftOffer.ts
                    ├── nft-offer.fc
                ├── NftRaffle/
                    ├── NftRaffle.ts
                    ├── nft-raffle/
                        ├── build.sh
                        ├── main.func
                        ├── struct/
                            ├── constants.func
                            ├── get-methods.func
                            ├── handles.func
                            ├── stdlib.fc
                            ├── storage.func
                            ├── utils.func
                ├── NftSingle/
                    ├── NftSingle.ts
                    ├── nft-single.fc
                ├── NftSwap/
                    ├── NftSwap.ts
                    ├── nft-swap.fc
                ├── SbtSingle/
                    ├── SbtSingle.ts
                    ├── sbt-single.fc
                ├── op-codes.fc
                ├── params.fc
                ├── stdlib.fc
            ├── standard/
                ├── NftCollection.ts
                ├── NftCollectionRoyalty.ts
                ├── NftItem.ts
                ├── NftItemRoyalty.ts
```

## Files Content:

================================================
FILE: .eslintrc.json
URL: https://github.com/ton-community/nft-sdk/blob/main/.eslintrc.json
================================================
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-empty-function": "off"
    },
    "ignorePatterns": ["**/dist", "docs", "cli", "FetchAndParseTransaction.ts", "AmazonS3.ts", "transaction-parsing"]
}


================================================
FILE: README.md
URL: https://github.com/ton-community/nft-sdk/blob/main/README.md
================================================
# NFT SDK

## Description 

This SDK is designed for The Open Network, a decentralized platform that provides a high-performance blockchain infrastructure. The NFT SDK is a tool that enables developers to create and manage their own NFTs (Non-Fungible Tokens) on The Open Network.

NFTs are unique digital assets that can represent anything from art and music to collectibles and virtual real estate. The NFT SDK provides developers with the ability to create, manage, and trade these unique assets on The Open Network.

The NFT SDK provides a simple and intuitive API for developers to create and manage their NFTs. It also includes features such as metadata management, transaction support, and token ownership management. The NFT SDK is designed to be scalable, secure, and easy to use, allowing developers to focus on building their NFT projects rather than worrying about technical details.

In summary, the NFT SDK is an essential tool for developers looking to create and manage NFTs on The Open Network. It provides a powerful and flexible API that allows developers to easily create, manage, and trade unique digital assets. With the NFT SDK, developers can unleash their creativity and build exciting new applications on The Open Network.

## Feature List

- [x]  Deploy Single NFTs
- [x]  Deploy NFT Collections
- [x]  Put NFTs on Sale
- [x]  Fetch Information on NFTs, collections and sales using TonClient
- [x]  Transfer NFTs
- [x]  Work with Decentralized Storage
- [x]  CLI



================================================
FILE: cli/README.md
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/README.md
================================================
# NFT CLI Tool

A command line tool for interacting with Non-Fungible Tokens (NFTs) on the TON blockchain.

## Requirements

- Node.js 14.x or higher
- A TON wallet or private key

## Installation

1. Clone the repository or download the source code.
2. Change into the project directory.
3. Change into the `cli/` directory
4. Run `npm install` to install dependencies.
5. Run `npm run build` to build the CLI
6. Run `npm link` to use the CLI everywhere

## Usage

### Upload NFT via Pinata:
```
ton-nft-cli upload pinata [path] --apiKey [API Key] --secretApiKey [Secret API Key]
```
This command is used to upload a file to Pinata, which is an IPFS pinning service. You need to replace `[path]` with the path of the file you want to upload, and `[API Key]` and `[Secret API Key]` with your Pinata API keys. 

### Upload NFT via Amazon S3:
```
ton-nft-cli upload s3 [path] --accessKey [Access Key] --secretAccessKey [Secret Access Key] --bucketName [Bucket Name] --fileType [File Type]
```
This command is used to upload a file to Amazon S3. You need to replace `[path]` with the path of the file you want to upload, `[Access Key]` and `[Secret Access Key]` with your Amazon S3 credentials, `[Bucket Name]` with the name of your S3 bucket, and `[File Type]` with the type of the file you are uploading. 

### Get NFT collections:
```
ton-nft-cli collections [limit] [offset]
```
This command is used to get a list of NFT collections. You can optionally specify a `[limit]` to limit the number of collections returned, and an `[offset]` to skip a certain number of collections.

### Get NFT collection by address:
```
ton-nft-cli collection [Address]
```
This command is used to get an NFT collection by its address. You need to replace `[Address]` with the address of the NFT collection.

### Get NFT items from collection by address:
```
ton-nft-cli collection-items [Address] [limit] [offset]
```
This command is used to get NFT items from a collection by its address. You need to replace `[Address]` with the address of the NFT collection. You can optionally specify a `[limit]` to limit the number of items returned, and an `[offset]` to skip a certain number of items.

### Get NFT item by its address:
```
ton-nft-cli item [Address]
```
This command is used to get an NFT item by its address. You need to replace `[Address]` with the address of the NFT item.

### Create a keypair:
```
ton-nft-cli keypair create
```
This command is used to create a new keypair.

### Create a single NFT:
```
ton-nft-cli nft-single create [configPath] [secretKey]
```
This command is used to create a single NFT. You need to replace `[configPath]` with the path of the NFT single data config JSON file, and optionally `[secretKey]` with your secret key.

### Transfer an NFT:
```
ton-nft-cli nft-single transfer [destination] [configPath] [secretKey]
```
This command is used to transfer an NFT single. You need to replace `[destination]` with the destination address, `[configPath]` with the path of the transfer configuration JSON file, and `[secretKey]` with the secret key of the sender.

### Create a NFT Collection:
```
ton-nft-cli nft-collection create [configPath] [secretKey]
```
This command is used to create a NFT Collection. You need to replace `[configPath]` with the path of the NFT collection data config JSON file, and optionally `[secretKey]` with your secret key.


================================================
FILE: cli/dist/cli/src/index.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/index.js
================================================
#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const Pinata_1 = require("../../src/storage/Pinata");
const AmazonS3_1 = require("../../src/storage/AmazonS3");
const ton_api_1 = require("../../src/ton-api");
const TonAPI_1 = require("../../src/ton-api/TonAPI");
const nftSingle_1 = require("./nftSingle");
const nftCollection_1 = require("./nftCollection");
const ton_1 = require("ton");
const createKeyPair_1 = __importDefault(require("./utils/createKeyPair"));
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command('upload pinata [path]', 'Upload an NFT via Pinata', (yargs) => {
    return yargs
        .positional('path', {
        describe: 'Path to the file to be uploaded',
        type: 'string',
        default: './assets',
    })
        .option('apiKey', {
        alias: 'k',
        describe: 'API key for authentication',
        type: 'string',
        demandOption: true,
    })
        .option('secretApiKey', {
        alias: 's',
        describe: 'Secret API key for authentication',
        type: 'string',
        demandOption: true,
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.path === 'string'
        && typeof argv.apiKey === 'string'
        && typeof argv.secretApiKey == 'string') {
        console.log(`Using API key: ${argv.apiKey}`);
        console.log(`Using secret API key: ${argv.secretApiKey}`);
        let pinata = new Pinata_1.Pinata(argv.apiKey, argv.secretApiKey);
        let imagesUrls = yield pinata.uploadBulk(argv.path);
        console.log(`URLs: ${imagesUrls}`);
    }
}))
    .command('upload s3 [path]', 'Upload an NFT via Amazon S3', (yargs) => {
    return yargs
        .positional('path', {
        describe: 'Path to the file to be uploaded',
        type: 'string',
        default: './assets',
    })
        .option('accessKey', {
        alias: 'k',
        describe: 'Access key for authentication',
        type: 'string',
        demandOption: true,
    })
        .option('secretAccessKey', {
        alias: 's',
        describe: 'Secret access key for authentication',
        type: 'string',
        demandOption: true,
    })
        .option('bucketName', {
        alias: 'b',
        describe: 'Bucket Name',
        type: 'string',
        demandOption: true,
    })
        .option('fileType', {
        alias: 'f',
        describe: 'File type of the image',
        type: 'string',
        demandOption: true,
        default: "image/jpeg"
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.path === 'string'
        && typeof argv.apiKey === 'string'
        && typeof argv.secretApiKey == 'string') {
        console.log(`Using API key: ${argv.apiKey}`);
        console.log(`Using secret API key: ${argv.secretApiKey}`);
        console.log(`Using bucket name: ${argv.bucketName}`);
        let s3 = new AmazonS3_1.AmazonS3(argv.apiKey, argv.secretApiKey, argv.bucketName);
        let imagesUrls = yield s3.uploadBulk(argv.path);
        console.log(`URLs: ${imagesUrls}`);
    }
}))
    // New command for getNftCollections
    .command('collections [limit] [offset]', 'Get NFT collections', (yargs) => {
    return yargs
        .positional('limit', {
        describe: 'Maximum number of collections to return',
        type: 'number',
        default: 10,
    })
        .positional('offset', {
        describe: 'Number of collections to skip',
        type: 'number',
        default: 0,
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    const tonClient = new ton_api_1.TonNftClient(new TonAPI_1.TonAPI());
    const collections = yield tonClient.getNftCollections(argv.limit, argv.offset);
    console.log(collections);
}))
    // New command for getNftCollectionByAddress
    .command('collection <address>', 'Get NFT collection by address', (yargs) => {
    return yargs.positional('address', {
        describe: 'Collection address',
        type: 'string',
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.address === 'string') {
        const tonClient = new ton_api_1.TonNftClient(new TonAPI_1.TonAPI());
        const collection = yield tonClient.getNftCollection(argv.address);
        console.log(collection);
    }
}))
    // New command for getNftItemsFromCollectionByAddress
    .command('collection-items <address> [limit] [offset]', 'Get NFT items from collection by address', (yargs) => {
    return yargs
        .positional('address', {
        describe: 'Collection address',
        type: 'string',
    })
        .positional('limit', {
        describe: 'Maximum number of items to return',
        type: 'number',
        default: 10,
    })
        .positional('offset', {
        describe: 'Number of items to skip',
        type: 'number',
        default: 0,
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.address === 'string') {
        const tonClient = new ton_api_1.TonNftClient(new TonAPI_1.TonAPI());
        const items = yield tonClient.getNftItems(argv.address, argv.limit, argv.offset);
        console.log(items);
    }
}))
    // New command for getNftItemByAddress
    .command('item <address>', 'Get NFT item by its address', (yargs) => {
    return yargs.positional('address', {
        describe: 'Item address',
        type: 'string',
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.address === 'string') {
        const tonClient = new ton_api_1.TonNftClient(new TonAPI_1.TonAPI());
        const item = yield tonClient.getNftItem(argv.address);
        console.log(item);
    }
}))
    .command('keypair create', 'Creates Keypair', (yargs) => {
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, createKeyPair_1.default)();
}))
    .command('create nft-single <configPath> [secretKey]', 'Create a single NFT', (yargs) => {
    return yargs
        .positional('configPath', {
        describe: 'Path to the NFT single data config JSON file',
        type: 'string',
    })
        .positional('secretKey', {
        describe: 'Secret key for creating the NFT',
        type: 'string',
        default: undefined,
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.configPath === 'string') {
        const client = new ton_1.TonClient4({
            endpoint: "https://toncenter.com/api/v2/jsonRPC"
        });
        const config = require(argv.configPath);
        const options = { secretKey: argv.secretKey };
        yield (0, nftSingle_1.createNftSingle)(client, config, options);
    }
}))
    .command('nft-single transfer <destination> [configPath] [secretKey]', 'Transfer an NFT Single', (yargs) => {
    return yargs
        .positional('destination', {
        describe: 'Destination address',
        type: 'string',
    })
        .positional('configPath', {
        describe: 'Path to the transfer configuration JSON file',
        type: 'string',
        default: undefined,
    })
        .positional('secretKey', {
        describe: 'Secret key of the Sender',
        type: 'string',
        default: undefined,
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.destination === 'string') {
        const client = new ton_1.TonClient4({
            endpoint: "https://toncenter.com/api/v2/jsonRPC"
        });
        const options = { configPath: argv.configPath, secretKey: argv.secretKey };
        yield (0, nftSingle_1.transfer)(client, argv.destination, options);
    }
}))
    .command('create nft-collection <configPath> [secretKey]', 'Create a NFT Collection', (yargs) => {
    return yargs
        .positional('configPath', {
        describe: 'Path to the NFT collection data config JSON file',
        type: 'string',
    })
        .positional('secretKey', {
        describe: 'Secret key for creating the NFT',
        type: 'string',
        default: undefined,
    });
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof argv.configPath === 'string') {
        const client = new ton_1.TonClient4({
            endpoint: "https://toncenter.com/api/v2/jsonRPC"
        });
        const config = require(argv.configPath);
        const options = { secretKey: argv.secretKey };
        yield (0, nftCollection_1.createNftCollection)(client, config, options);
    }
}))
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .alias('h', 'help')
    .strict()
    .parse();
//# sourceMappingURL=index.js.map


================================================
FILE: cli/dist/cli/src/index.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/index.js.map
================================================
{"version":3,"file":"index.js","sourceRoot":"","sources":["../../../src/index.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;AAEA,kDAA0B;AAC1B,2CAAwC;AACxC,qDAA+C;AAC/C,yDAAmD;AACnD,+CAA8C;AAC9C,qDAA+C;AAE/C,2CAAqD;AACrD,mDAAmD;AACnD,6BAAiC;AACjC,0EAAkD;AAElD,IAAA,eAAK,EAAC,IAAA,iBAAO,EAAC,OAAO,CAAC,IAAI,CAAC,CAAC;KACzB,OAAO,CACN,sBAAsB,EACtB,0BAA0B,EAC1B,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK;SACT,UAAU,CAAC,MAAM,EAAE;QAClB,QAAQ,EAAE,iCAAiC;QAC3C,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,UAAU;KACpB,CAAC;SACD,MAAM,CAAC,QAAQ,EAAE;QAChB,KAAK,EAAE,GAAG;QACV,QAAQ,EAAE,4BAA4B;QACtC,IAAI,EAAE,QAAQ;QACd,YAAY,EAAE,IAAI;KACnB,CAAC;SACD,MAAM,CAAC,cAAc,EAAE;QACtB,KAAK,EAAE,GAAG;QACV,QAAQ,EAAE,mCAAmC;QAC7C,IAAI,EAAE,QAAQ;QACd,YAAY,EAAE,IAAI;KACnB,CAAC,CAAC;AACP,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,IAAI,KAAK,QAAQ;WAC1B,OAAO,IAAI,CAAC,MAAM,KAAK,QAAQ;WAC/B,OAAO,IAAI,CAAC,YAAY,IAAI,QAAQ,EACzC;QACA,OAAO,CAAC,GAAG,CAAC,kBAAkB,IAAI,CAAC,MAAM,EAAE,CAAC,CAAC;QAC7C,OAAO,CAAC,GAAG,CAAC,yBAAyB,IAAI,CAAC,YAAY,EAAE,CAAC,CAAC;QAE1D,IAAI,MAAM,GAAG,IAAI,eAAM,CAAC,IAAI,CAAC,MAAM,EAAE,IAAI,CAAC,YAAY,CAAC,CAAC;QACxD,IAAI,UAAU,GAAG,MAAM,MAAM,CAAC,UAAU,CAAC,IAAI,CAAC,IAAI,CAAC,CAAA;QAEnD,OAAO,CAAC,GAAG,CAAC,SAAS,UAAU,EAAE,CAAC,CAAA;KACnC;AACH,CAAC,CAAA,CACF;KAEA,OAAO,CACN,kBAAkB,EAClB,6BAA6B,EAC7B,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK;SACT,UAAU,CAAC,MAAM,EAAE;QAClB,QAAQ,EAAE,iCAAiC;QAC3C,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,UAAU;KACpB,CAAC;SACD,MAAM,CAAC,WAAW,EAAE;QACnB,KAAK,EAAE,GAAG;QACV,QAAQ,EAAE,+BAA+B;QACzC,IAAI,EAAE,QAAQ;QACd,YAAY,EAAE,IAAI;KACnB,CAAC;SACD,MAAM,CAAC,iBAAiB,EAAE;QACzB,KAAK,EAAE,GAAG;QACV,QAAQ,EAAE,sCAAsC;QAChD,IAAI,EAAE,QAAQ;QACd,YAAY,EAAE,IAAI;KACnB,CAAC;SACD,MAAM,CAAC,YAAY,EAAE;QACpB,KAAK,EAAE,GAAG;QACV,QAAQ,EAAE,aAAa;QACvB,IAAI,EAAC,QAAQ;QACb,YAAY,EAAE,IAAI;KACnB,CAAC;SACD,MAAM,CAAC,UAAU,EAAE;QAClB,KAAK,EAAE,GAAG;QACV,QAAQ,EAAE,wBAAwB;QAClC,IAAI,EAAE,QAAQ;QACd,YAAY,EAAE,IAAI;QAClB,OAAO,EAAE,YAAY;KACtB,CAAC,CAAC;AACP,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,IAAI,KAAK,QAAQ;WAC1B,OAAO,IAAI,CAAC,MAAM,KAAK,QAAQ;WAC/B,OAAO,IAAI,CAAC,YAAY,IAAI,QAAQ,EACzC;QACA,OAAO,CAAC,GAAG,CAAC,kBAAkB,IAAI,CAAC,MAAM,EAAE,CAAC,CAAC;QAC7C,OAAO,CAAC,GAAG,CAAC,yBAAyB,IAAI,CAAC,YAAY,EAAE,CAAC,CAAC;QAC1D,OAAO,CAAC,GAAG,CAAC,sBAAsB,IAAI,CAAC,UAAU,EAAE,CAAC,CAAC;QAErD,IAAI,EAAE,GAAG,IAAI,mBAAQ,CAAC,IAAI,CAAC,MAAM,EAAE,IAAI,CAAC,YAAY,EAAE,IAAI,CAAC,UAAU,CAAC,CAAC;QACvE,IAAI,UAAU,GAAG,MAAM,EAAE,CAAC,UAAU,CAAC,IAAI,CAAC,IAAI,CAAC,CAAA;QAE/C,OAAO,CAAC,GAAG,CAAC,SAAS,UAAU,EAAE,CAAC,CAAA;KACnC;AACH,CAAC,CAAA,CACF;IAED,oCAAoC;KACnC,OAAO,CACN,8BAA8B,EAC9B,qBAAqB,EACrB,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK;SACT,UAAU,CAAC,OAAO,EAAE;QACnB,QAAQ,EAAE,yCAAyC;QACnD,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,EAAE;KACZ,CAAC;SACD,UAAU,CAAC,QAAQ,EAAE;QACpB,QAAQ,EAAE,+BAA+B;QACzC,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,CAAC;KACX,CAAC,CAAC;AACP,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,MAAM,SAAS,GAAG,IAAI,sBAAY,CAAC,IAAI,eAAM,EAAE,CAAC,CAAC;IACjD,MAAM,WAAW,GAAG,MAAM,SAAS,CAAC,iBAAiB,CAAC,IAAI,CAAC,KAAK,EAAE,IAAI,CAAC,MAAM,CAAC,CAAC;IAC/E,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC;AAC3B,CAAC,CAAA,CACF;IACD,4CAA4C;KAC3C,OAAO,CACN,sBAAsB,EACtB,+BAA+B,EAC/B,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK,CAAC,UAAU,CAAC,SAAS,EAAE;QACjC,QAAQ,EAAE,oBAAoB;QAC9B,IAAI,EAAE,QAAQ;KACf,CAAC,CAAC;AACL,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,OAAO,KAAK,QAAQ,EAAE;QACpC,MAAM,SAAS,GAAG,IAAI,sBAAY,CAAC,IAAI,eAAM,EAAE,CAAC,CAAC;QACjD,MAAM,UAAU,GAAG,MAAM,SAAS,CAAC,gBAAgB,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC;QAClE,OAAO,CAAC,GAAG,CAAC,UAAU,CAAC,CAAC;KACzB;AACH,CAAC,CAAA,CACF;IACD,qDAAqD;KACpD,OAAO,CACN,6CAA6C,EAC7C,0CAA0C,EAC1C,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK;SACT,UAAU,CAAC,SAAS,EAAE;QACrB,QAAQ,EAAE,oBAAoB;QAC9B,IAAI,EAAE,QAAQ;KACf,CAAC;SACD,UAAU,CAAC,OAAO,EAAE;QACnB,QAAQ,EAAE,mCAAmC;QAC7C,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,EAAE;KACZ,CAAC;SACD,UAAU,CAAC,QAAQ,EAAE;QACpB,QAAQ,EAAE,yBAAyB;QACnC,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,CAAC;KACX,CAAC,CAAC;AACP,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,OAAO,KAAK,QAAQ,EAAE;QACpC,MAAM,SAAS,GAAG,IAAI,sBAAY,CAAC,IAAI,eAAM,EAAE,CAAC,CAAC;QACjD,MAAM,KAAK,GAAG,MAAM,SAAS,CAAC,WAAW,CAAC,IAAI,CAAC,OAAO,EAAE,IAAI,CAAC,KAAK,EAAE,IAAI,CAAC,MAAM,CAAC,CAAC;QACjF,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC;KACpB;AACH,CAAC,CAAA,CACF;IAED,sCAAsC;KACrC,OAAO,CACN,gBAAgB,EAChB,6BAA6B,EAC7B,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK,CAAC,UAAU,CAAC,SAAS,EAAE;QACjC,QAAQ,EAAE,cAAc;QACxB,IAAI,EAAE,QAAQ;KACf,CAAC,CAAC;AACL,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,OAAO,KAAK,QAAQ,EAAE;QACpC,MAAM,SAAS,GAAG,IAAI,sBAAY,CAAC,IAAI,eAAM,EAAE,CAAC,CAAC;QACjD,MAAM,IAAI,GAAG,MAAM,SAAS,CAAC,UAAU,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC;QACtD,OAAO,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC;KACnB;AACH,CAAC,CAAA,CACF;KAEA,OAAO,CACN,gBAAgB,EAChB,iBAAiB,EACjB,CAAC,KAAK,EAAE,EAAE;AAEV,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,MAAM,IAAA,uBAAa,GAAE,CAAC;AAC1B,CAAC,CAAA,CAAC;KAED,OAAO,CACN,4CAA4C,EAC5C,qBAAqB,EACrB,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK;SACT,UAAU,CAAC,YAAY,EAAE;QACxB,QAAQ,EAAE,8CAA8C;QACxD,IAAI,EAAE,QAAQ;KACf,CAAC;SACD,UAAU,CAAC,WAAW,EAAE;QACvB,QAAQ,EAAE,iCAAiC;QAC3C,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,SAAS;KACnB,CAAC,CAAC;AACP,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,UAAU,KAAK,QAAQ,EAAE;QACvC,MAAM,MAAM,GAAG,IAAI,gBAAU,CAAC;YAC5B,QAAQ,EAAE,sCAAsC;SACjD,CAAC,CAAC;QACH,MAAM,MAAM,GAAG,OAAO,CAAC,IAAI,CAAC,UAAU,CAAC,CAAC;QACxC,MAAM,OAAO,GAAG,EAAE,SAAS,EAAE,IAAI,CAAC,SAAS,EAAE,CAAC;QAC9C,MAAM,IAAA,2BAAe,EAAC,MAAM,EAAE,MAAM,EAAE,OAAO,CAAC,CAAC;KAChD;AACH,CAAC,CAAA,CACF;KAEA,OAAO,CACN,4DAA4D,EAC5D,wBAAwB,EACxB,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK;SACT,UAAU,CAAC,aAAa,EAAE;QACzB,QAAQ,EAAE,qBAAqB;QAC/B,IAAI,EAAE,QAAQ;KACf,CAAC;SACD,UAAU,CAAC,YAAY,EAAE;QACxB,QAAQ,EAAE,8CAA8C;QACxD,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,SAAS;KACnB,CAAC;SACD,UAAU,CAAC,WAAW,EAAE;QACvB,QAAQ,EAAE,0BAA0B;QACpC,IAAI,EAAE,QAAQ;QACd,OAAO,EAAE,SAAS;KACnB,CAAC,CAAC;AACP,CAAC,EACD,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,WAAW,KAAK,QAAQ,EAAE;QACxC,MAAM,MAAM,GAAG,IAAI,gBAAU,CAAC;YAC5B,QAAQ,EAAE,sCAAsC;SACjD,CAAC,CAAC;QAEH,MAAM,OAAO,GAAG,EAAE,UAAU,EAAE,IAAI,CAAC,UAAU,EAAE,SAAS,EAAE,IAAI,CAAC,SAAS,EAAE,CAAC;QAC3E,MAAM,IAAA,oBAAQ,EAAC,MAAM,EAAE,IAAI,CAAC,WAAW,EAAE,OAAO,CAAC,CAAC;KACnD;AACH,CAAC,CAAA,CACF;KAEA,OAAO,CACN,gDAAgD,EAChD,yBAAyB,EACzB,CAAC,KAAK,EAAE,EAAE;IACR,OAAO,KAAK;SACV,UAAU,CAAC,YAAY,EAAE;QACvB,QAAQ,EAAE,kDAAkD;QAC5D,IAAI,EAAC,QAAQ;KACd,CAAC;SACF,UAAU,CAAC,WAAW,EAAE;QACtB,QAAQ,EAAE,iCAAiC;QAC3C,IAAI,EAAC,QAAQ;QACb,OAAO,EAAE,SAAS;KACnB,CAAC,CAAC;AACH,CAAC,EACL,CAAO,IAAI,EAAE,EAAE;IACb,IAAI,OAAO,IAAI,CAAC,UAAU,KAAI,QAAQ,EAAE;QACtC,MAAM,MAAM,GAAG,IAAI,gBAAU,CAAC;YAC5B,QAAQ,EAAE,sCAAsC;SACjD,CAAC,CAAC;QACH,MAAM,MAAM,GAAG,OAAO,CAAC,IAAI,CAAC,UAAU,CAAC,CAAC;QACxC,MAAM,OAAO,GAAG,EAAE,SAAS,EAAE,IAAI,CAAC,SAAS,EAAE,CAAC;QAC9C,MAAM,IAAA,mCAAmB,EAAC,MAAM,EAAE,MAAM,EAAE,OAAO,CAAC,CAAC;KACpD;AACH,CAAC,CAAA,CACF;KAGA,aAAa,CAAC,CAAC,EAAE,gDAAgD,CAAC;KAClE,IAAI,EAAE;KACN,KAAK,CAAC,GAAG,EAAE,MAAM,CAAC;KAClB,MAAM,EAAE;KACR,KAAK,EAAE,CAAC"}


================================================
FILE: cli/dist/cli/src/nftCollection.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/nftCollection.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mint = exports.importExistingNftCollection = exports.createNftCollection = void 0;
const ton_core_1 = require("ton-core");
const NftCollection_1 = require("../../src/wrappers/getgems/NftCollection/NftCollection");
const importKeyPair_1 = __importDefault(require("./utils/importKeyPair"));
const fs_1 = require("fs");
const process_1 = require("process");
const ton_core_2 = require("ton-core");
const createSender_1 = __importDefault(require("./utils/createSender"));
function createNftCollection(client, config, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let keypair = yield (0, importKeyPair_1.default)(options === null || options === void 0 ? void 0 : options.secretKey);
        let sender = yield (0, createSender_1.default)(keypair, client);
        const nftCollection = client.open(yield NftCollection_1.NftCollection.createFromConfig(config));
        yield nftCollection.sendDeploy(sender, (0, ton_core_1.toNano)('0.05'));
        console.log(`NFT Single deployed at ${nftCollection.address}`);
        yield (0, fs_1.writeFileSync)('./NftCollection.json', JSON.stringify({
            config: config,
            address: nftCollection.address,
            init: nftCollection.init
        }));
        console.log(`Saved Config`);
        return nftCollection;
    });
}
exports.createNftCollection = createNftCollection;
function importExistingNftCollection(client, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (options === null || options === void 0 ? void 0 : options.configPath) {
            const config = JSON.parse((0, fs_1.readFileSync)(options === null || options === void 0 ? void 0 : options.configPath, 'utf-8'));
            const nftCollection = client.open(yield NftCollection_1.NftCollection.createFromAddress(config.address));
            return nftCollection;
        }
        else if ((0, fs_1.existsSync)(String(process_1.env.PATH_TO_CONFIG))) {
            const config = JSON.parse((0, fs_1.readFileSync)(String(process_1.env.PATH_TO_CONFIG), 'utf-8'));
            const nftCollection = client.open(yield NftCollection_1.NftCollection.createFromAddress(config.address));
            return nftCollection;
        }
        else {
            const nftCollection = client.open(yield NftCollection_1.NftCollection.createFromAddress((_a = options === null || options === void 0 ? void 0 : options.address) !== null && _a !== void 0 ? _a : ton_core_2.Address.parse(String(process_1.env.NFT_COLLECTION_ADDRESS))));
            return nftCollection;
        }
    });
}
exports.importExistingNftCollection = importExistingNftCollection;
function mint(client, itemOwner, collectionAddress, itemContent, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const nftCollection = yield importExistingNftCollection(client, {
            configPath: options === null || options === void 0 ? void 0 : options.configPath,
            address: collectionAddress
        });
        let keypair = yield (0, importKeyPair_1.default)(options === null || options === void 0 ? void 0 : options.secretKey);
        let sender = yield (0, createSender_1.default)(keypair, client);
        let collectionData = yield nftCollection.getCollectionData();
        let tx = yield nftCollection.sendMint(sender, {
            value: (0, ton_core_1.toNano)("0.05"),
            passAmount: (0, ton_core_1.toNano)("0"),
            itemIndex: Number(collectionData.nextItemIndex),
            itemOwnerAddress: itemOwner,
            itemContent: itemContent
        });
        console.log(`Minted NFT to ${itemOwner.toString()}`);
    });
}
exports.mint = mint;
//# sourceMappingURL=nftCollection.js.map


================================================
FILE: cli/dist/cli/src/nftCollection.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/nftCollection.js.map
================================================
{"version":3,"file":"nftCollection.js","sourceRoot":"","sources":["../../../src/nftCollection.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;AAAA,uCAAyC;AACzC,0FAAuG;AACvG,0EAAkD;AAClD,2BAA6D;AAE7D,qCAA8B;AAC9B,uCAAkC;AAElC,wEAA+C;AAE/C,SAAsB,mBAAmB,CACrC,MAAkB,EAClB,MAAyB,EACzB,OAEC;;QAED,IAAI,OAAO,GAAG,MAAM,IAAA,uBAAa,EAAC,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,SAAS,CAAC,CAAC;QAEtD,IAAI,MAAM,GAAG,MAAM,IAAA,sBAAY,EAAC,OAAO,EAAE,MAAM,CAAC,CAAA;QAGhD,MAAM,aAAa,GAAG,MAAM,CAAC,IAAI,CAC7B,MAAM,6BAAa,CAAC,gBAAgB,CAChC,MAAM,CACT,CACJ,CAAC;QAEF,MAAM,aAAa,CAAC,UAAU,CAAC,MAAM,EAAE,IAAA,iBAAM,EAAC,MAAM,CAAC,CAAC,CAAC;QAEvD,OAAO,CAAC,GAAG,CACP,0BAA0B,aAAa,CAAC,OAAO,EAAE,CACpD,CAAA;QAED,MAAM,IAAA,kBAAa,EACf,sBAAsB,EACtB,IAAI,CAAC,SAAS,CAAC;YACX,MAAM,EAAE,MAAM;YACd,OAAO,EAAE,aAAa,CAAC,OAAO;YAC9B,IAAI,EAAE,aAAa,CAAC,IAAI;SAC3B,CACJ,CAAC,CAAA;QAEF,OAAO,CAAC,GAAG,CACP,cAAc,CACjB,CAAA;QAED,OAAO,aAAa,CAAC;IACzB,CAAC;CAAA;AAtCD,kDAsCC;AAED,SAAsB,2BAA2B,CAC7C,MAAkB,EAClB,OAGC;;;QAED,IAAI,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,UAAU,EAAE;YACrB,MAAM,MAAM,GAAG,IAAI,CAAC,KAAK,CACrB,IAAA,iBAAY,EACR,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,UAAU,EACnB,OAAO,CACV,CACJ,CAAA;YAED,MAAM,aAAa,GAAG,MAAM,CAAC,IAAI,CAC7B,MAAM,6BAAa,CAAC,iBAAiB,CACjC,MAAM,CAAC,OAAO,CACjB,CACJ,CAAC;YAEF,OAAO,aAAa,CAAA;SACvB;aAAM,IAAI,IAAA,eAAU,EAAC,MAAM,CAAC,aAAG,CAAC,cAAc,CAAC,CAAC,EAAE;YAC/C,MAAM,MAAM,GAAG,IAAI,CAAC,KAAK,CAAC,IAAA,iBAAY,EAAC,MAAM,CAAC,aAAG,CAAC,cAAc,CAAC,EAAE,OAAO,CAAC,CAAC,CAAC;YAE7E,MAAM,aAAa,GAAG,MAAM,CAAC,IAAI,CAC7B,MAAM,6BAAa,CAAC,iBAAiB,CACjC,MAAM,CAAC,OAAO,CACjB,CACJ,CAAC;YAEF,OAAO,aAAa,CAAC;SACxB;aAAM;YACH,MAAM,aAAa,GAAG,MAAM,CAAC,IAAI,CAC7B,MAAM,6BAAa,CAAC,iBAAiB,CACjC,MAAA,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,OAAO,mCAAI,kBAAO,CAAC,KAAK,CAAC,MAAM,CAAC,aAAG,CAAC,sBAAsB,CAAC,CAAC,CACxE,CACJ,CAAC;YAEF,OAAO,aAAa,CAAC;SACxB;;CACJ;AAzCD,kEAyCC;AAGD,SAAsB,IAAI,CACtB,MAAkB,EAClB,SAAkB,EAClB,iBAA0B,EAC1B,WAAmB,EACnB,OAGC;;QAED,MAAM,aAAa,GAAG,MAAM,2BAA2B,CACnD,MAAM,EACN;YACI,UAAU,EAAE,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,UAAU;YAC/B,OAAO,EAAE,iBAAiB;SAC7B,CACJ,CAAC;QAEF,IAAI,OAAO,GAAG,MAAM,IAAA,uBAAa,EAC7B,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,SAAS,CACrB,CAAA;QAED,IAAI,MAAM,GAAG,MAAM,IAAA,sBAAY,EAAC,OAAO,EAAE,MAAM,CAAC,CAAC;QAEjD,IAAI,cAAc,GAAG,MAAM,aAAa,CAAC,iBAAiB,EAAE,CAAC;QAE7D,IAAI,EAAE,GAAG,MAAM,aAAa,CAAC,QAAQ,CACjC,MAAM,EACN;YACI,KAAK,EAAE,IAAA,iBAAM,EAAC,MAAM,CAAC;YACrB,UAAU,EAAE,IAAA,iBAAM,EAAC,GAAG,CAAC;YACvB,SAAS,EAAE,MAAM,CAAC,cAAc,CAAC,aAAa,CAAC;YAC/C,gBAAgB,EAAE,SAAS;YAC3B,WAAW,EAAE,WAAW;SAC3B,CACJ,CAAC;QAEF,OAAO,CAAC,GAAG,CACP,iBAAiB,SAAS,CAAC,QAAQ,EAAE,EAAE,CAC1C,CAAA;IACL,CAAC;CAAA;AAxCD,oBAwCC"}


================================================
FILE: cli/dist/cli/src/nftSingle.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/nftSingle.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.importExistingNftSingle = exports.createNftSingle = void 0;
const ton_core_1 = require("ton-core");
const NftSingle_1 = require("../../src/wrappers/getgems/NftSingle/NftSingle");
const importKeyPair_1 = __importDefault(require("./utils/importKeyPair"));
const fs_1 = require("fs");
const process_1 = require("process");
const ton_core_2 = require("ton-core");
const createSender_1 = __importDefault(require("./utils/createSender"));
function createNftSingle(client, config, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let keypair = yield (0, importKeyPair_1.default)(options === null || options === void 0 ? void 0 : options.secretKey);
        let sender = yield (0, createSender_1.default)(keypair, client);
        const nftSingle = client.open(yield NftSingle_1.NftSingle.createFromConfig(config));
        yield nftSingle.sendDeploy(sender, (0, ton_core_1.toNano)('0.05'));
        console.log(`NFT Single deployed at ${nftSingle.address}`);
        yield (0, fs_1.writeFileSync)('./nftSingle.json', JSON.stringify({
            config: config,
            address: nftSingle.address,
            init: nftSingle.init
        }));
        console.log(`Saved Config`);
        return nftSingle;
    });
}
exports.createNftSingle = createNftSingle;
function importExistingNftSingle(client, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options === null || options === void 0 ? void 0 : options.configPath) {
            const config = JSON.parse((0, fs_1.readFileSync)(options === null || options === void 0 ? void 0 : options.configPath, 'utf-8'));
            const nftSingle = client.open(yield NftSingle_1.NftSingle.createFromAddress(config.address));
            return nftSingle;
        }
        else {
            const config = JSON.parse((0, fs_1.readFileSync)(String(process_1.env.PATH_TO_CONFIG), 'utf-8'));
            const nftSingle = client.open(yield NftSingle_1.NftSingle.createFromAddress(config.address));
            return nftSingle;
        }
    });
}
exports.importExistingNftSingle = importExistingNftSingle;
function transfer(client, destination, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const nftSingle = yield importExistingNftSingle(client, options);
        let keypair = yield (0, importKeyPair_1.default)(options === null || options === void 0 ? void 0 : options.secretKey);
        let sender = yield (0, createSender_1.default)(keypair, client);
        let tx = yield nftSingle.sendTransfer(sender, {
            value: (0, ton_core_1.toNano)('0.05'),
            queryId: (0, ton_core_1.toNano)('0'),
            newOwner: ton_core_2.Address.parse(destination),
            responseDestination: sender.address,
            forwardAmount: (0, ton_core_1.toNano)('0')
        });
        console.log(`Transferred NFT from ${(_a = sender.address) === null || _a === void 0 ? void 0 : _a.toString()} to ${destination}`);
    });
}
exports.transfer = transfer;
//# sourceMappingURL=nftSingle.js.map


================================================
FILE: cli/dist/cli/src/nftSingle.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/nftSingle.js.map
================================================
{"version":3,"file":"nftSingle.js","sourceRoot":"","sources":["../../../src/nftSingle.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;AAAA,uCAAyC;AACzC,8EAAuF;AACvF,0EAAkD;AAClD,2BAAiD;AAEjD,qCAA8B;AAC9B,uCAAkC;AAElC,wEAA+C;AAE/C,SAAsB,eAAe,CACjC,MAAkB,EAClB,MAAqB,EACrB,OAEC;;QAED,IAAI,OAAO,GAAG,MAAM,IAAA,uBAAa,EAAC,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,SAAS,CAAC,CAAC;QAEtD,IAAI,MAAM,GAAG,MAAM,IAAA,sBAAY,EAAC,OAAO,EAAE,MAAM,CAAC,CAAA;QAGhD,MAAM,SAAS,GAAG,MAAM,CAAC,IAAI,CACzB,MAAM,qBAAS,CAAC,gBAAgB,CAC5B,MAAM,CACT,CACJ,CAAC;QAEF,MAAM,SAAS,CAAC,UAAU,CAAC,MAAM,EAAE,IAAA,iBAAM,EAAC,MAAM,CAAC,CAAC,CAAC;QAEnD,OAAO,CAAC,GAAG,CACP,0BAA0B,SAAS,CAAC,OAAO,EAAE,CAChD,CAAA;QAED,MAAM,IAAA,kBAAa,EACf,kBAAkB,EAClB,IAAI,CAAC,SAAS,CAAC;YACX,MAAM,EAAE,MAAM;YACd,OAAO,EAAE,SAAS,CAAC,OAAO;YAC1B,IAAI,EAAE,SAAS,CAAC,IAAI;SACvB,CACJ,CAAC,CAAA;QAEF,OAAO,CAAC,GAAG,CACP,cAAc,CACjB,CAAA;QAED,OAAO,SAAS,CAAC;IACrB,CAAC;CAAA;AAtCD,0CAsCC;AAED,SAAsB,uBAAuB,CACzC,MAAkB,EAClB,OAEC;;QAED,IAAI,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,UAAU,EAAE;YACrB,MAAM,MAAM,GAAG,IAAI,CAAC,KAAK,CACrB,IAAA,iBAAY,EACR,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,UAAU,EACnB,OAAO,CACV,CACJ,CAAA;YAED,MAAM,SAAS,GAAG,MAAM,CAAC,IAAI,CACzB,MAAM,qBAAS,CAAC,iBAAiB,CAC7B,MAAM,CAAC,OAAO,CACjB,CACJ,CAAC;YAEF,OAAO,SAAS,CAAA;SACnB;aAAM;YACH,MAAM,MAAM,GAAG,IAAI,CAAC,KAAK,CAAC,IAAA,iBAAY,EAAC,MAAM,CAAC,aAAG,CAAC,cAAc,CAAC,EAAE,OAAO,CAAC,CAAC,CAAC;YAE7E,MAAM,SAAS,GAAG,MAAM,CAAC,IAAI,CACzB,MAAM,qBAAS,CAAC,iBAAiB,CAC7B,MAAM,CAAC,OAAO,CACjB,CACJ,CAAC;YAEF,OAAO,SAAS,CAAC;SACpB;IACL,CAAC;CAAA;AAhCD,0DAgCC;AAED,SAAsB,QAAQ,CAC1B,MAAkB,EAClB,WAAmB,EACnB,OAGC;;;QAED,MAAM,SAAS,GAAG,MAAM,uBAAuB,CAC3C,MAAM,EACN,OAAO,CACV,CAAC;QAEF,IAAI,OAAO,GAAG,MAAM,IAAA,uBAAa,EAC7B,OAAO,aAAP,OAAO,uBAAP,OAAO,CAAE,SAAS,CACrB,CAAA;QAED,IAAI,MAAM,GAAG,MAAM,IAAA,sBAAY,EAAC,OAAO,EAAE,MAAM,CAAC,CAAC;QAEjD,IAAI,EAAE,GAAG,MAAM,SAAS,CAAC,YAAY,CACjC,MAAM,EACN;YACI,KAAK,EAAE,IAAA,iBAAM,EAAC,MAAM,CAAC;YACrB,OAAO,EAAE,IAAA,iBAAM,EAAC,GAAG,CAAC;YACpB,QAAQ,EAAE,kBAAO,CAAC,KAAK,CAAC,WAAW,CAAC;YACpC,mBAAmB,EAAE,MAAM,CAAC,OAAO;YACnC,aAAa,EAAE,IAAA,iBAAM,EAAC,GAAG,CAAC;SAC7B,CACJ,CAAC;QAEF,OAAO,CAAC,GAAG,CACP,wBAAwB,MAAA,MAAM,CAAC,OAAO,0CAAE,QAAQ,EAAE,OAAO,WAAW,EAAE,CACzE,CAAA;;CACJ;AAjCD,4BAiCC"}


================================================
FILE: cli/dist/cli/src/utils/createKeyPair.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/utils/createKeyPair.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeyPair = void 0;
const fs_1 = require("fs");
const ton_crypto_1 = require("ton-crypto");
function createKeyPair() {
    return __awaiter(this, void 0, void 0, function* () {
        let mnemonic = yield (0, ton_crypto_1.mnemonicNew)();
        let keypair = yield (0, ton_crypto_1.mnemonicToPrivateKey)(mnemonic);
        (0, fs_1.writeFileSync)("./keypair.json", JSON.stringify(keypair));
        (0, fs_1.writeFileSync)("./.env", `SECRET_KEY=${keypair.secretKey}`);
    });
}
exports.createKeyPair = createKeyPair;
exports.default = createKeyPair;
//# sourceMappingURL=createKeyPair.js.map


================================================
FILE: cli/dist/cli/src/utils/createKeyPair.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/utils/createKeyPair.js.map
================================================
{"version":3,"file":"createKeyPair.js","sourceRoot":"","sources":["../../../../src/utils/createKeyPair.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,2BAAmC;AACnC,2CAA4D;AAE5D,SAAsB,aAAa;;QAC/B,IAAI,QAAQ,GAAG,MAAM,IAAA,wBAAW,GAAE,CAAA;QAClC,IAAI,OAAO,GAAG,MAAM,IAAA,iCAAoB,EAAC,QAAQ,CAAC,CAAA;QAElD,IAAA,kBAAa,EACT,gBAAgB,EAChB,IAAI,CAAC,SAAS,CAAC,OAAO,CAAC,CAC1B,CAAC;QAEF,IAAA,kBAAa,EACT,QAAQ,EACR,cAAc,OAAO,CAAC,SAAS,EAAE,CACpC,CAAA;IACL,CAAC;CAAA;AAbD,sCAaC;AAED,kBAAe,aAAa,CAAC"}


================================================
FILE: cli/dist/cli/src/utils/createSender.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/utils/createSender.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSender = void 0;
const ton_1 = require("ton");
function createSender(keypair, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let wallet = ton_1.WalletContractV4.create({
            workchain: 0,
            publicKey: keypair.publicKey
        });
        let contract = client.open(wallet);
        return contract.sender(keypair.secretKey);
    });
}
exports.createSender = createSender;
exports.default = createSender;
//# sourceMappingURL=createSender.js.map


================================================
FILE: cli/dist/cli/src/utils/createSender.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/utils/createSender.js.map
================================================
{"version":3,"file":"createSender.js","sourceRoot":"","sources":["../../../../src/utils/createSender.ts"],"names":[],"mappings":";;;;;;;;;;;;AACA,6BAAmD;AAEnD,SAAsB,YAAY,CAC9B,OAAgB,EAChB,MAAkB;;QAElB,IAAI,MAAM,GAAG,sBAAgB,CAAC,MAAM,CAChC;YACI,SAAS,EAAE,CAAC;YACZ,SAAS,EAAE,OAAO,CAAC,SAAS;SAC/B,CACJ,CAAA;QAED,IAAI,QAAQ,GAAG,MAAM,CAAC,IAAI,CACtB,MAAM,CACT,CAAC;QAEF,OAAO,QAAQ,CAAC,MAAM,CAAC,OAAO,CAAC,SAAS,CAAC,CAAC;IAC9C,CAAC;CAAA;AAhBD,oCAgBC;AAED,kBAAe,YAAY,CAAC"}


================================================
FILE: cli/dist/cli/src/utils/importKeyPair.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/utils/importKeyPair.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importKeyPair = void 0;
const process_1 = require("process");
const ton_crypto_1 = require("ton-crypto");
const fs_1 = require("fs");
function importKeyPair(secretKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let keyPair;
        if (secretKey) {
            keyPair = (0, ton_crypto_1.keyPairFromSecretKey)(Buffer.from(secretKey, 'hex'));
        }
        else {
            const content = (0, fs_1.readFileSync)(String(process_1.env.SECRET_KEY), 'utf-8');
            keyPair = (0, ton_crypto_1.keyPairFromSecretKey)(Buffer.from(content, 'hex'));
        }
        return keyPair;
    });
}
exports.importKeyPair = importKeyPair;
exports.default = importKeyPair;
//# sourceMappingURL=importKeyPair.js.map


================================================
FILE: cli/dist/cli/src/utils/importKeyPair.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/cli/src/utils/importKeyPair.js.map
================================================
{"version":3,"file":"importKeyPair.js","sourceRoot":"","sources":["../../../../src/utils/importKeyPair.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,qCAA6B;AAC7B,2CAA0D;AAC1D,2BAAkC;AAElC,SAAsB,aAAa,CAC/B,SAAkB;;QAElB,IAAI,OAAgB,CAAC;QAErB,IAAI,SAAS,EAAE;YACX,OAAO,GAAG,IAAA,iCAAoB,EAAC,MAAM,CAAC,IAAI,CAAC,SAAS,EAAE,KAAK,CAAC,CAAC,CAAC;SACjE;aAAM;YACH,MAAM,OAAO,GAAG,IAAA,iBAAY,EAAC,MAAM,CAAC,aAAG,CAAC,UAAU,CAAC,EAAE,OAAO,CAAC,CAAC;YAC9D,OAAO,GAAG,IAAA,iCAAoB,EAAC,MAAM,CAAC,IAAI,CAAC,OAAO,EAAE,KAAK,CAAC,CAAC,CAAC;SAC/D;QAED,OAAO,OAAO,CAAC;IACnB,CAAC;CAAA;AAbD,sCAaC;AAED,kBAAe,aAAa,CAAC"}


================================================
FILE: cli/dist/src/index.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/index.js
================================================
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENDPOINT = exports.Pinata = exports.AmazonS3 = exports.TransactionParsing = void 0;
// Storage
const AmazonS3_1 = require("./storage/AmazonS3");
Object.defineProperty(exports, "AmazonS3", { enumerable: true, get: function () { return AmazonS3_1.AmazonS3; } });
const Pinata_1 = require("./storage/Pinata");
Object.defineProperty(exports, "Pinata", { enumerable: true, get: function () { return Pinata_1.Pinata; } });
// Wrappers
__exportStar(require("./wrappers/getgems/NftCollection"), exports);
__exportStar(require("./wrappers/getgems/NftItem"), exports);
__exportStar(require("./wrappers/getgems/SbtSingle"), exports);
__exportStar(require("./wrappers/standard/NftItemRoyalty"), exports);
__exportStar(require("./wrappers/getgems/NftAuction"), exports);
__exportStar(require("./wrappers/getgems/NftAuctionV2"), exports);
__exportStar(require("./wrappers/getgems/NftFixedPrice"), exports);
__exportStar(require("./wrappers/getgems/NftFixedPriceV2"), exports);
__exportStar(require("./wrappers/getgems/NftFixedPriceV3"), exports);
__exportStar(require("./wrappers/getgems/NftMarketplace"), exports);
__exportStar(require("./wrappers/getgems/NftOffer"), exports);
__exportStar(require("./wrappers/getgems/NftSwap"), exports);
// Utils
__exportStar(require("./utils"), exports);
// Data Encoders & Decoders
__exportStar(require("./types/OffchainContent"), exports);
// Transaction Parsing
exports.TransactionParsing = __importStar(require("./transaction-parsing/"));
__exportStar(require("./utils/FetchAndParseTransaction"), exports);
// TON API
__exportStar(require("./ton-api"), exports);
// Endpoints
var ENDPOINT;
(function (ENDPOINT) {
    ENDPOINT["MAINNET"] = "https://toncenter.com/api/v2/jsonRPC";
    ENDPOINT["TESTNET"] = "https://testnet.toncenter.com/api/v2/jsonRPC";
})(ENDPOINT = exports.ENDPOINT || (exports.ENDPOINT = {}));
//# sourceMappingURL=index.js.map


================================================
FILE: cli/dist/src/index.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/index.js.map
================================================
{"version":3,"file":"index.js","sourceRoot":"","sources":["../../../src/index.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAAA,UAAU;AACV,iDAA4C;AA4BxC,yFA5BI,mBAAQ,OA4BJ;AA3BZ,6CAAwC;AA4BpC,uFA5BI,eAAM,OA4BJ;AA1BV,WAAW;AACX,mEAAiD;AACjD,6DAA2C;AAC3C,+DAA6C;AAC7C,qEAAmD;AACnD,gEAA8C;AAC9C,kEAAgD;AAChD,mEAAiD;AACjD,qEAAmD;AACnD,qEAAmD;AACnD,oEAAkD;AAClD,8DAA4C;AAC5C,6DAA2C;AAE3C,QAAQ;AACR,0CAAwB;AAExB,2BAA2B;AAC3B,0DAAuC;AAEvC,sBAAsB;AACtB,6EAA4D;AAC5D,mEAAiD;AAOjD,UAAU;AACV,4CAA0B;AAE1B,YAAY;AACZ,IAAY,QAGX;AAHD,WAAY,QAAQ;IAChB,4DAAgD,CAAA;IAChD,oEAAwD,CAAA;AAC5D,CAAC,EAHW,QAAQ,GAAR,gBAAQ,KAAR,gBAAQ,QAGnB"}


================================================
FILE: cli/dist/src/storage/AmazonS3.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/storage/AmazonS3.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonS3 = void 0;
const aws_sdk_1 = require("aws-sdk");
const console_1 = require("console");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * AmazonS3 is a class that provides utility functions for interacting with Amazon S3.
 */
class AmazonS3 {
    /**
     * Creates an instance of the AmazonS3 class.
     * @param accessKeyId - The access key ID for your AWS account.
     * @param secretAccessKey - The secret access key for your AWS account.
     */
    constructor(accessKeyId, secretAccessKey, bucketName) {
        this.bucketName = bucketName;
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        });
    }
    /**
     * Uploads an image file to an S3 bucket.
     * @param imagePath - The path to the image file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded image.
     */
    uploadImage(imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = fs_1.default.readFileSync(imagePath);
            const params = {
                Bucket: this.bucketName,
                Key: path_1.default.basename(imagePath),
                Body: fileContent,
                ContentType: 'image/jpeg', // adjust as needed
            };
            yield this.s3.upload(params).promise();
            return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`;
        });
    }
    /**
     * Uploads multiple image files from a folder to an S3 bucket.
     * @param folderPath - The path to the folder containing the image files.
     * @returns A Promise that resolves to an array of URLs of the uploaded images.
     */
    uploadImages(folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = fs_1.default.readdirSync(folderPath);
            const uploadPromises = files.map(file => this.uploadImage(path_1.default.join(folderPath, file)));
            return Promise.all(uploadPromises);
        });
    }
    /**
     * Uploads a JSON file to an S3 bucket.
     * @param jsonPath - The path to the JSON file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded JSON file.
     */
    uploadJson(jsonPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = fs_1.default.readFileSync(jsonPath);
            const params = {
                Bucket: this.bucketName,
                Key: path_1.default.basename(jsonPath),
                Body: fileContent,
                ContentType: 'application/json', // JSON file mimetype
            };
            yield this.s3.upload(params).promise();
            return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`;
        });
    }
    /**
     * Uploads multiple JSON files from a folder to an S3 bucket.
     * @param folderPath - The path to the folder containing the JSON files.
     * @returns A Promise that resolves to an array of URLs of the uploaded JSON files.
     */
    uploadJsonBulk(folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = fs_1.default.readdirSync(folderPath);
            const uploadPromises = files.map(file => this.uploadJson(path_1.default.join(folderPath, file)));
            return Promise.all(uploadPromises);
        });
    }
    /**
     * Uploads images in bulk to IPFS using Pinata SDK in ascending order of file names and returns their URLs.
     * @param assetsFolderPath - The path to the folder containing the image and JSON files.
     * @returns A Promise that resolves to an array of two arrays:
     * - The first array contains the URLs of the uploaded images on IPFS.
     * - The second array contains the URLs of the uploaded JSON files on IPFS.
     */
    uploadBulk(assetsFolderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Read the directory
                const files = fs_1.default.readdirSync(assetsFolderPath);
                // Filter and sort image files
                const imageFiles = files
                    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
                    .sort((a, b) => parseInt(a) - parseInt(b));
                // Process image uploads in ascending order and collect their URLs
                const imageUrls = [];
                const jsonUrls = [];
                for (const imageFile of imageFiles) {
                    // Read image file
                    const imagePath = path_1.default.join(assetsFolderPath, imageFile);
                    // Upload the image to S3
                    const imageUrl = yield this.uploadImage(imagePath);
                    imageUrls.push(imageUrl);
                    // Read the JSON file with the same filename as the image
                    const jsonFilePath = path_1.default.join(assetsFolderPath, `${path_1.default.parse(imageFile).name}.json`);
                    if (fs_1.default.existsSync(jsonFilePath)) {
                        // Upload the JSON file to S3
                        const jsonUrl = yield this.uploadJson(jsonFilePath);
                        jsonUrls.push(jsonUrl);
                        console.log(`JSON file uploaded to S3: ${jsonUrl}`);
                    }
                    else {
                        (0, console_1.error)('Metadata not found for', path_1.default.parse(imageFile).name);
                    }
                }
                console.log('All images uploaded successfully!');
                return [imageUrls, jsonUrls];
            }
            catch (error) {
                console.error('Error uploading images to S3:', error);
                throw error;
            }
        });
    }
}
exports.AmazonS3 = AmazonS3;
//# sourceMappingURL=AmazonS3.js.map


================================================
FILE: cli/dist/src/storage/AmazonS3.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/storage/AmazonS3.js.map
================================================
{"version":3,"file":"AmazonS3.js","sourceRoot":"","sources":["../../../../src/storage/AmazonS3.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;AAAA,qCAA4B;AAC5B,qCAA+B;AAC/B,4CAAmB;AACnB,gDAAuB;AAGvB;;GAEG;AACH,MAAa,QAAQ;IAGjB;;;;OAIG;IACH,YACI,WAAmB,EACnB,eAAuB,EACd,UAAkB;QAAlB,eAAU,GAAV,UAAU,CAAQ;QAE3B,IAAI,CAAC,EAAE,GAAG,IAAI,YAAE,CACZ;YACI,WAAW,EAAE,WAAW;YACxB,eAAe,EAAE,eAAe;SACnC,CACJ,CAAA;IACL,CAAC;IAED;;;;OAIG;IACG,WAAW,CACb,SAAiB;;YAEjB,MAAM,WAAW,GAAG,YAAE,CAAC,YAAY,CAAC,SAAS,CAAC,CAAA;YAE9C,MAAM,MAAM,GAAG;gBACX,MAAM,EAAE,IAAI,CAAC,UAAU;gBACvB,GAAG,EAAE,cAAI,CAAC,QAAQ,CAAC,SAAS,CAAC;gBAC7B,IAAI,EAAE,WAAW;gBACjB,WAAW,EAAE,YAAY,EAAE,mBAAmB;aACjD,CAAA;YAED,MAAM,IAAI,CAAC,EAAE,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC,OAAO,EAAE,CAAA;YAEtC,OAAO,WAAW,IAAI,CAAC,UAAU,qBAAqB,MAAM,CAAC,GAAG,EAAE,CAAA;QACtE,CAAC;KAAA;IAED;;;;OAIG;IACG,YAAY,CACd,UAAkB;;YAElB,MAAM,KAAK,GAAG,YAAE,CAAC,WAAW,CAAC,UAAU,CAAC,CAAA;YACxC,MAAM,cAAc,GAAG,KAAK,CAAC,GAAG,CAAC,IAAI,CAAC,EAAE,CAAC,IAAI,CAAC,WAAW,CAAC,cAAI,CAAC,IAAI,CAAC,UAAU,EAAE,IAAI,CAAC,CAAC,CAAC,CAAA;YACvF,OAAO,OAAO,CAAC,GAAG,CAAC,cAAc,CAAC,CAAA;QACtC,CAAC;KAAA;IAED;;;;OAIG;IACG,UAAU,CACZ,QAAgB;;YAEhB,MAAM,WAAW,GAAG,YAAE,CAAC,YAAY,CAAC,QAAQ,CAAC,CAAA;YAE7C,MAAM,MAAM,GAAG;gBACX,MAAM,EAAE,IAAI,CAAC,UAAU;gBACvB,GAAG,EAAE,cAAI,CAAC,QAAQ,CAAC,QAAQ,CAAC;gBAC5B,IAAI,EAAE,WAAW;gBACjB,WAAW,EAAE,kBAAkB,EAAE,qBAAqB;aACzD,CAAA;YAED,MAAM,IAAI,CAAC,EAAE,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC,OAAO,EAAE,CAAA;YAEtC,OAAO,WAAW,IAAI,CAAC,UAAU,qBAAqB,MAAM,CAAC,GAAG,EAAE,CAAA;QACtE,CAAC;KAAA;IAED;;;;OAIG;IACG,cAAc,CAChB,UAAkB;;YAElB,MAAM,KAAK,GAAG,YAAE,CAAC,WAAW,CAAC,UAAU,CAAC,CAAA;YACxC,MAAM,cAAc,GAAG,KAAK,CAAC,GAAG,CAAC,IAAI,CAAC,EAAE,CAAC,IAAI,CAAC,UAAU,CAAC,cAAI,CAAC,IAAI,CAAC,UAAU,EAAE,IAAI,CAAC,CAAC,CAAC,CAAA;YACtF,OAAO,OAAO,CAAC,GAAG,CAAC,cAAc,CAAC,CAAA;QACtC,CAAC;KAAA;IAED;;;;;;OAMG;IACG,UAAU,CACZ,gBAAwB;;YAExB,IAAI;gBACA,qBAAqB;gBACrB,MAAM,KAAK,GAAG,YAAE,CAAC,WAAW,CAAC,gBAAgB,CAAC,CAAA;gBAE9C,8BAA8B;gBAC9B,MAAM,UAAU,GAAG,KAAK;qBACnB,MAAM,CAAC,CAAC,IAAI,EAAE,EAAE,CAAC,wBAAwB,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;qBACrD,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,EAAE,EAAE,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAA;gBAE9C,kEAAkE;gBAClE,MAAM,SAAS,GAAa,EAAE,CAAA;gBAC9B,MAAM,QAAQ,GAAa,EAAE,CAAA;gBAE7B,KAAK,MAAM,SAAS,IAAI,UAAU,EAAE;oBAChC,kBAAkB;oBAClB,MAAM,SAAS,GAAG,cAAI,CAAC,IAAI,CAAC,gBAAgB,EAAE,SAAS,CAAC,CAAA;oBAExD,yBAAyB;oBACzB,MAAM,QAAQ,GAAG,MAAM,IAAI,CAAC,WAAW,CAAC,SAAS,CAAC,CAAA;oBAClD,SAAS,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAA;oBAExB,yDAAyD;oBACzD,MAAM,YAAY,GAAG,cAAI,CAAC,IAAI,CAC1B,gBAAgB,EAChB,GAAG,cAAI,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC,IAAI,OAAO,CACvC,CAAA;oBAED,IAAI,YAAE,CAAC,UAAU,CAAC,YAAY,CAAC,EAAE;wBAC7B,6BAA6B;wBAC7B,MAAM,OAAO,GAAG,MAAM,IAAI,CAAC,UAAU,CAAC,YAAY,CAAC,CAAA;wBACnD,QAAQ,CAAC,IAAI,CAAC,OAAO,CAAC,CAAA;wBACtB,OAAO,CAAC,GAAG,CAAC,6BAA6B,OAAO,EAAE,CAAC,CAAA;qBACtD;yBAAM;wBACH,IAAA,eAAK,EAAC,wBAAwB,EAAE,cAAI,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC,IAAI,CAAC,CAAA;qBAC9D;iBACJ;gBAED,OAAO,CAAC,GAAG,CAAC,mCAAmC,CAAC,CAAA;gBAChD,OAAO,CAAC,SAAS,EAAE,QAAQ,CAAC,CAAA;aAC/B;YAAC,OAAO,KAAK,EAAE;gBACZ,OAAO,CAAC,KAAK,CAAC,+BAA+B,EAAE,KAAK,CAAC,CAAA;gBACrD,MAAM,KAAK,CAAA;aACd;QACL,CAAC;KAAA;CACJ;AAjJD,4BAiJC"}


================================================
FILE: cli/dist/src/storage/Pinata.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/storage/Pinata.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pinata = void 0;
const sdk_1 = __importDefault(require("@pinata/sdk"));
const console_1 = require("console");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Pinata is a class that provides utility functions for interacting with Pinata for IPFS integration.
 */
class Pinata {
    /**
     * Creates an instance of the Pinata class.
     * @param apiKey - The API key for Pinata.
     * @param secretApiKey - The secret API key for Pinata.
     */
    constructor(apiKey, secretApiKey) {
        this.pinata = new sdk_1.default(apiKey, secretApiKey);
    }
    /**
     * Uploads an image file to IPFS using Pinata SDK.
     * @param imagePath - The path to the image file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded image on IPFS.
     */
    uploadImage(imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = fs_1.default.createReadStream(imagePath);
            const response = yield this.pinata.pinFileToIPFS(fileContent);
            return `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;
        });
    }
    /**
     * Uploads multiple image files from a folder to IPFS using Pinata SDK.
     * @param folderPath - The path to the folder containing the image files.
     * @returns A Promise that resolves to an array of URLs of the uploaded images on IPFS.
     */
    uploadImages(folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = fs_1.default.readdirSync(folderPath);
            const uploadPromises = files.map(file => this.uploadImage(path_1.default.join(folderPath, file)));
            return Promise.all(uploadPromises);
        });
    }
    /**
     * Uploads a JSON file to IPFS using Pinata SDK.
     * @param jsonPath - The path to the JSON file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded JSON file on IPFS.
     */
    uploadJson(jsonPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = fs_1.default.readFileSync(jsonPath);
            const jsonData = JSON.parse(fileContent.toString());
            const response = yield this.pinata.pinJSONToIPFS(jsonData);
            return `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;
        });
    }
    /**
     * Uploads multiple JSON files from a folder to IPFS using Pinata SDK.
     * @param folderPath - The path to the folder containing the JSON files.
     * @returns A Promise that resolves to an array of URLs of the uploaded JSON files on IPFS.
     */
    uploadJsonBulk(folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = fs_1.default.readdirSync(folderPath);
            const uploadPromises = files.map(file => this.uploadJson(path_1.default.join(folderPath, file)));
            return Promise.all(uploadPromises);
        });
    }
    /**
     * Uploads images in bulk to IPFS using Pinata SDK in ascending order of file names and returns their URLs.
     * @param assetsFolderPath - The path to the folder containing the image and JSON files.
     * @returns A Promise that resolves to an array of two arrays:
     * - The first array contains the URLs of the uploaded images on IPFS.
     * - The second array contains the URLs of the uploaded JSON files on IPFS.
     */
    uploadBulk(assetsFolderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Read the directory
                const files = fs_1.default.readdirSync(assetsFolderPath);
                // Filter and sort image files
                const imageFiles = files
                    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
                    .sort((a, b) => parseInt(a) - parseInt(b));
                // Process image uploads in ascending order and collect their URLs
                const imageUrls = [];
                const jsonUrls = [];
                for (const imageFile of imageFiles) {
                    // Read image file
                    const imagePath = path_1.default.join(assetsFolderPath, imageFile);
                    const imageData = fs_1.default.createReadStream(imagePath);
                    // Upload the image to IPFS using Pinata SDK
                    const result = yield this.pinata.pinFileToIPFS(imageData, {
                        pinataMetadata: {
                            name: imageFile,
                        },
                    });
                    // Add the image URL to the array
                    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
                    imageUrls.push(ipfsUrl);
                    // Read the JSON file with the same filename as the image
                    const jsonFilePath = path_1.default.join(assetsFolderPath, `${path_1.default.parse(imageFile).name}.json`);
                    if (fs_1.default.existsSync(jsonFilePath)) {
                        const jsonFile = fs_1.default.readFileSync(jsonFilePath, 'utf8');
                        const jsonData = JSON.parse(jsonFile);
                        // Add the IPFS URL to the JSON data
                        jsonData.image = ipfsUrl;
                        // Write the updated JSON data to the file
                        fs_1.default.writeFileSync(jsonFilePath, JSON.stringify(jsonData));
                        // Upload the JSON file to IPFS using Pinata SDK
                        const jsonFileData = fs_1.default.createReadStream(jsonFilePath);
                        const jsonResult = yield this.pinata.pinFileToIPFS(jsonFileData, {
                            pinataMetadata: {
                                name: `${path_1.default.parse(imageFile).name}.json`,
                            },
                        });
                        const jsonUrl = `https://gateway.pinata.cloud/ipfs/${jsonResult.IpfsHash}`;
                        jsonUrls.push(jsonUrl);
                        console.log(`JSON file uploaded to IPFS: ${jsonUrl}`);
                    }
                    else {
                        (0, console_1.error)('Metadata not found for', path_1.default.parse(imageFile).name);
                    }
                }
                console.log('All images uploaded successfully!');
                return [imageUrls, jsonUrls];
            }
            catch (error) {
                console.error('Error uploading images to IPFS:', error);
                throw error;
            }
        });
    }
}
exports.Pinata = Pinata;
//# sourceMappingURL=Pinata.js.map


================================================
FILE: cli/dist/src/storage/Pinata.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/storage/Pinata.js.map
================================================
{"version":3,"file":"Pinata.js","sourceRoot":"","sources":["../../../../src/storage/Pinata.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;AAAA,sDAAsC;AACtC,qCAA+B;AAC/B,4CAAmB;AACnB,gDAAuB;AAGvB;;GAEG;AACH,MAAa,MAAM;IAGf;;;;OAIG;IACH,YACI,MAAc,EACd,YAAoB;QAEpB,IAAI,CAAC,MAAM,GAAG,IAAI,aAAY,CAAC,MAAM,EAAE,YAAY,CAAC,CAAA;IACxD,CAAC;IAED;;;;OAIG;IACG,WAAW,CAAC,SAAiB;;YAC/B,MAAM,WAAW,GAAG,YAAE,CAAC,gBAAgB,CAAC,SAAS,CAAC,CAAA;YAClD,MAAM,QAAQ,GAAG,MAAM,IAAI,CAAC,MAAM,CAAC,aAAa,CAAC,WAAW,CAAC,CAAA;YAC7D,OAAO,qCAAqC,QAAQ,CAAC,QAAQ,EAAE,CAAA;QACnE,CAAC;KAAA;IAED;;;;OAIG;IACG,YAAY,CAAC,UAAkB;;YACjC,MAAM,KAAK,GAAG,YAAE,CAAC,WAAW,CAAC,UAAU,CAAC,CAAA;YACxC,MAAM,cAAc,GAAG,KAAK,CAAC,GAAG,CAAC,IAAI,CAAC,EAAE,CAAC,IAAI,CAAC,WAAW,CAAC,cAAI,CAAC,IAAI,CAAC,UAAU,EAAE,IAAI,CAAC,CAAC,CAAC,CAAA;YACvF,OAAO,OAAO,CAAC,GAAG,CAAC,cAAc,CAAC,CAAA;QACtC,CAAC;KAAA;IAED;;;;OAIG;IACG,UAAU,CAAC,QAAgB;;YAC7B,MAAM,WAAW,GAAG,YAAE,CAAC,YAAY,CAAC,QAAQ,CAAC,CAAA;YAC7C,MAAM,QAAQ,GAAG,IAAI,CAAC,KAAK,CAAC,WAAW,CAAC,QAAQ,EAAE,CAAC,CAAA;YACnD,MAAM,QAAQ,GAAG,MAAM,IAAI,CAAC,MAAM,CAAC,aAAa,CAAC,QAAQ,CAAC,CAAA;YAC1D,OAAO,qCAAqC,QAAQ,CAAC,QAAQ,EAAE,CAAA;QACnE,CAAC;KAAA;IAED;;;;OAIG;IACG,cAAc,CAAC,UAAkB;;YACnC,MAAM,KAAK,GAAG,YAAE,CAAC,WAAW,CAAC,UAAU,CAAC,CAAA;YACxC,MAAM,cAAc,GAAG,KAAK,CAAC,GAAG,CAAC,IAAI,CAAC,EAAE,CAAC,IAAI,CAAC,UAAU,CAAC,cAAI,CAAC,IAAI,CAAC,UAAU,EAAE,IAAI,CAAC,CAAC,CAAC,CAAA;YACtF,OAAO,OAAO,CAAC,GAAG,CAAC,cAAc,CAAC,CAAA;QACtC,CAAC;KAAA;IAED;;;;;;OAMG;IACG,UAAU,CACZ,gBAAwB;;YAExB,IAAI;gBACA,qBAAqB;gBACrB,MAAM,KAAK,GAAG,YAAE,CAAC,WAAW,CAAC,gBAAgB,CAAC,CAAA;gBAE9C,8BAA8B;gBAC9B,MAAM,UAAU,GAAG,KAAK;qBACnB,MAAM,CAAC,CAAC,IAAI,EAAE,EAAE,CAAC,wBAAwB,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;qBACrD,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,EAAE,EAAE,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAA;gBAE9C,kEAAkE;gBAClE,MAAM,SAAS,GAAa,EAAE,CAAA;gBAE9B,MAAM,QAAQ,GAAa,EAAE,CAAA;gBAE7B,KAAK,MAAM,SAAS,IAAI,UAAU,EAAE;oBAChC,kBAAkB;oBAClB,MAAM,SAAS,GAAG,cAAI,CAAC,IAAI,CAAC,gBAAgB,EAAE,SAAS,CAAC,CAAA;oBACxD,MAAM,SAAS,GAAG,YAAE,CAAC,gBAAgB,CAAC,SAAS,CAAC,CAAA;oBAEhD,4CAA4C;oBAC5C,MAAM,MAAM,GAAG,MAAM,IAAI,CAAC,MAAM,CAAC,aAAa,CAAC,SAAS,EAAE;wBACtD,cAAc,EAAE;4BACZ,IAAI,EAAE,SAAS;yBAClB;qBACJ,CAAC,CAAA;oBAEF,iCAAiC;oBACjC,MAAM,OAAO,GAAG,qCAAqC,MAAM,CAAC,QAAQ,EAAE,CAAA;oBACtE,SAAS,CAAC,IAAI,CAAC,OAAO,CAAC,CAAA;oBAEvB,yDAAyD;oBACzD,MAAM,YAAY,GAAG,cAAI,CAAC,IAAI,CAC1B,gBAAgB,EAChB,GAAG,cAAI,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC,IAAI,OAAO,CACvC,CAAA;oBAED,IAAI,YAAE,CAAC,UAAU,CAAC,YAAY,CAAC,EAAE;wBAC7B,MAAM,QAAQ,GAAG,YAAE,CAAC,YAAY,CAAC,YAAY,EAAE,MAAM,CAAC,CAAA;wBACtD,MAAM,QAAQ,GAAG,IAAI,CAAC,KAAK,CAAC,QAAQ,CAAC,CAAA;wBAErC,oCAAoC;wBACpC,QAAQ,CAAC,KAAK,GAAG,OAAO,CAAA;wBAExB,0CAA0C;wBAC1C,YAAE,CAAC,aAAa,CAAC,YAAY,EAAE,IAAI,CAAC,SAAS,CAAC,QAAQ,CAAC,CAAC,CAAA;wBAExD,gDAAgD;wBAChD,MAAM,YAAY,GAAG,YAAE,CAAC,gBAAgB,CACpC,YAAY,CACf,CAAA;wBAED,MAAM,UAAU,GAAG,MAAM,IAAI,CAAC,MAAM,CAAC,aAAa,CAAC,YAAY,EAAE;4BAC7D,cAAc,EAAE;gCACZ,IAAI,EAAE,GAAG,cAAI,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC,IAAI,OAAO;6BAC7C;yBACJ,CAAC,CAAA;wBAEF,MAAM,OAAO,GAAG,qCAAqC,UAAU,CAAC,QAAQ,EAAE,CAAA;wBAC1E,QAAQ,CAAC,IAAI,CAAC,OAAO,CAAC,CAAA;wBACtB,OAAO,CAAC,GAAG,CAAC,+BAA+B,OAAO,EAAE,CAAC,CAAA;qBACxD;yBAAM;wBACH,IAAA,eAAK,EAAC,wBAAwB,EAAE,cAAI,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC,IAAI,CAAC,CAAA;qBAC9D;iBACJ;gBAED,OAAO,CAAC,GAAG,CAAC,mCAAmC,CAAC,CAAA;gBAChD,OAAO,CAAC,SAAS,EAAE,QAAQ,CAAC,CAAA;aAC/B;YAAC,OAAO,KAAK,EAAE;gBACZ,OAAO,CAAC,KAAK,CAAC,iCAAiC,EAAE,KAAK,CAAC,CAAA;gBACvD,MAAM,KAAK,CAAA;aACd;QACL,CAAC;KAAA;CACJ;AA9ID,wBA8IC"}


================================================
FILE: cli/dist/src/ton-api/index.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/ton-api/index.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonNftClient = void 0;
class TonNftClient {
    constructor(client) {
        this.client = client;
    }
    getNftCollections(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getNftCollections(limit, offset);
        });
    }
    getNftCollection(collectionAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getNftCollection(collectionAddress);
        });
    }
    getNftItems(collectionAddress, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getNftItems(collectionAddress, limit, offset);
        });
    }
    getNftItem(itemAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getNftItem(itemAddress);
        });
    }
    getTransactionsByAddress(address, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getTransactionsByAddress(address, limit);
        });
    }
}
exports.TonNftClient = TonNftClient;
//# sourceMappingURL=index.js.map


================================================
FILE: cli/dist/src/ton-api/index.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/ton-api/index.js.map
================================================
{"version":3,"file":"index.js","sourceRoot":"","sources":["../../../../src/ton-api/index.ts"],"names":[],"mappings":";;;;;;;;;;;;AAEA,MAAa,YAAY;IACrB,YACa,MAAuB;QAAvB,WAAM,GAAN,MAAM,CAAiB;IACjC,CAAC;IAEE,iBAAiB,CACnB,KAAc,EACd,MAAe;;YAEf,OAAO,MAAM,IAAI,CAAC,MAAM,CAAC,iBAAiB,CAAC,KAAK,EAAE,MAAM,CAAC,CAAA;QAC7D,CAAC;KAAA;IAEK,gBAAgB,CAClB,iBAAyB;;YAEzB,OAAO,MAAM,IAAI,CAAC,MAAM,CAAC,gBAAgB,CAAC,iBAAiB,CAAC,CAAA;QAChE,CAAC;KAAA;IAEK,WAAW,CACb,iBAAyB,EACzB,KAAc,EACd,MAAe;;YAEf,OAAO,MAAM,IAAI,CAAC,MAAM,CAAC,WAAW,CAAC,iBAAiB,EAAE,KAAK,EAAE,MAAM,CAAC,CAAA;QAC1E,CAAC;KAAA;IAEK,UAAU,CACZ,WAAmB;;YAEnB,OAAO,MAAM,IAAI,CAAC,MAAM,CAAC,UAAU,CAAC,WAAW,CAAC,CAAA;QACpD,CAAC;KAAA;IAEK,wBAAwB,CAC1B,OAAgB,EAChB,KAAc;;YAEd,OAAO,MAAM,IAAI,CAAC,MAAM,CAAC,wBAAwB,CAAC,OAAO,EAAE,KAAK,CAAC,CAAA;QACrE,CAAC;KAAA;CACJ;AAtCD,oCAsCC"}


================================================
FILE: cli/dist/src/transaction-parsing/EditContent.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/EditContent.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEditContentInfo = void 0;
const ton_core_1 = require("ton-core");
const EligibleInternalTx_1 = require("../utils/EligibleInternalTx");
function extractEditContentInfo(body) {
    var _a, _b, _c;
    return {
        queryId: body === null || body === void 0 ? void 0 : body.loadUint(64),
        from: (_a = body.inMessage) === null || _a === void 0 ? void 0 : _a.info.src,
        nftItem: (_b = body.inMessage) === null || _b === void 0 ? void 0 : _b.info.dest,
        payload: body === null || body === void 0 ? void 0 : body.loadRef(),
        value: (_c = body.inMessage) === null || _c === void 0 ? void 0 : _c.info.value.coins,
    };
}
function parseEditContentInfo(transaction) {
    var _a;
    const tx = (0, ton_core_1.loadTransaction)(transaction);
    const body = (_a = tx.inMessage) === null || _a === void 0 ? void 0 : _a.body.beginParse();
    let op;
    try {
        op = body === null || body === void 0 ? void 0 : body.loadUint(32);
    }
    catch (_b) {
        return null;
    }
    if ((0, EligibleInternalTx_1.isEligibleTransaction)(tx)) {
        return extractEditContentInfo(body);
    }
    return null;
}
exports.parseEditContentInfo = parseEditContentInfo;
//# sourceMappingURL=EditContent.js.map


================================================
FILE: cli/dist/src/transaction-parsing/EditContent.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/EditContent.js.map
================================================
{"version":3,"file":"EditContent.js","sourceRoot":"","sources":["../../../../src/transaction-parsing/EditContent.ts"],"names":[],"mappings":";;;AAAA,uCAAiE;AACjE,oEAAoE;AAWpE,SAAS,sBAAsB,CAAC,IAAS;;IACrC,OAAO;QACH,OAAO,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC;QAC3B,IAAI,EAAE,MAAA,IAAI,CAAC,SAAS,0CAAE,IAAI,CAAC,GAAG;QAC9B,OAAO,EAAE,MAAA,IAAI,CAAC,SAAS,0CAAE,IAAI,CAAC,IAAI;QAClC,OAAO,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,OAAO,EAAE;QACxB,KAAK,EAAE,MAAA,IAAI,CAAC,SAAS,0CAAE,IAAI,CAAC,KAAK,CAAC,KAAK;KAC1C,CAAC;AACJ,CAAC;AAEH,SAAgB,oBAAoB,CAChC,WAAkB;;IAElB,MAAM,EAAE,GAAG,IAAA,0BAAe,EAAC,WAAW,CAAC,CAAC;IACxC,MAAM,IAAI,GAAG,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,UAAU,EAAE,CAAC;IAE7C,IAAI,EAAE,CAAC;IAEP,IAAI;QACA,EAAE,GAAG,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC,CAAC;KAC3B;IAAC,WAAM;QACJ,OAAO,IAAI,CAAC;KACf;IAED,IAAI,IAAA,0CAAqB,EAAC,EAAE,CAAC,EAAE;QAC3B,OAAO,sBAAsB,CAAC,IAAI,CAAC,CAAA;KACtC;IAED,OAAO,IAAI,CAAC;AAChB,CAAC;AAnBD,oDAmBC"}


================================================
FILE: cli/dist/src/transaction-parsing/NftTransfer.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/NftTransfer.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNftTransferInfo = void 0;
const ton_core_1 = require("ton-core");
const EligibleInternalTx_1 = require("../utils/EligibleInternalTx");
function extractNftTransferInfo(body) {
    return {
        queryId: body === null || body === void 0 ? void 0 : body.loadUint(64),
        from: body === null || body === void 0 ? void 0 : body.info.src,
        to: body === null || body === void 0 ? void 0 : body.loadAddress(),
        value: body === null || body === void 0 ? void 0 : body.info.value.coins,
        responseTo: body === null || body === void 0 ? void 0 : body.loadAddress(),
        customPayload: body === null || body === void 0 ? void 0 : body.loadBit(),
        forwardAmount: body === null || body === void 0 ? void 0 : body.loadCoins(),
        forwardPayload: body === null || body === void 0 ? void 0 : body.loadBit(),
    };
}
function parseNftTransferInfo(transaction) {
    var _a;
    const tx = (0, ton_core_1.loadTransaction)(transaction);
    const body = (_a = tx.inMessage) === null || _a === void 0 ? void 0 : _a.body.beginParse();
    let op;
    try {
        op = body === null || body === void 0 ? void 0 : body.loadUint(32);
    }
    catch (_b) {
        return null;
    }
    if ((0, EligibleInternalTx_1.isEligibleTransaction)(tx)) {
        return extractNftTransferInfo(body);
    }
    return null;
}
exports.parseNftTransferInfo = parseNftTransferInfo;
//# sourceMappingURL=NftTransfer.js.map


================================================
FILE: cli/dist/src/transaction-parsing/NftTransfer.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/NftTransfer.js.map
================================================
{"version":3,"file":"NftTransfer.js","sourceRoot":"","sources":["../../../../src/transaction-parsing/NftTransfer.ts"],"names":[],"mappings":";;;AAAA,uCAAiE;AACjE,oEAAoE;AAapE,SAAS,sBAAsB,CAAC,IAAS;IACvC,OAAO;QACL,OAAO,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC;QAC3B,IAAI,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,GAAG;QACpB,EAAE,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,WAAW,EAAE;QACvB,KAAK,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,KAAK,CAAC,KAAK;QAC7B,UAAU,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,WAAW,EAAE;QAC/B,aAAa,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,OAAO,EAAE;QAC9B,aAAa,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,SAAS,EAAE;QAChC,cAAc,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,OAAO,EAAE;KAChC,CAAC;AACJ,CAAC;AAED,SAAgB,oBAAoB,CAClC,WAAkB;;IAElB,MAAM,EAAE,GAAG,IAAA,0BAAe,EAAC,WAAW,CAAC,CAAC;IACxC,MAAM,IAAI,GAAG,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,UAAU,EAAE,CAAC;IAE7C,IAAI,EAAE,CAAC;IACP,IAAI;QACF,EAAE,GAAG,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC,CAAC;KACzB;IAAC,WAAM;QACN,OAAO,IAAI,CAAC;KACb;IAED,IAAI,IAAA,0CAAqB,EAAC,EAAE,CAAC,EAAE;QAC7B,OAAO,sBAAsB,CAAC,IAAI,CAAC,CAAC;KACrC;IAED,OAAO,IAAI,CAAC;AACd,CAAC;AAlBD,oDAkBC"}


================================================
FILE: cli/dist/src/transaction-parsing/RoyaltyInfo.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/RoyaltyInfo.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRoyaltyInfo = void 0;
const ton_core_1 = require("ton-core");
const EligibleInternalTx_1 = require("../utils/EligibleInternalTx");
function extractRoyaltyInfo(body) {
    return {
        queryId: body === null || body === void 0 ? void 0 : body.loadUint(64),
        from: body === null || body === void 0 ? void 0 : body.info.src,
        nftItem: body === null || body === void 0 ? void 0 : body.info.dest,
        value: body === null || body === void 0 ? void 0 : body.info.value.coins,
    };
}
function parseRoyaltyInfo(transaction) {
    var _a;
    const tx = (0, ton_core_1.loadTransaction)(transaction);
    const body = (_a = tx.inMessage) === null || _a === void 0 ? void 0 : _a.body.beginParse();
    let op;
    try {
        op = body === null || body === void 0 ? void 0 : body.loadUint(32);
    }
    catch (_b) {
        return null;
    }
    if ((0, EligibleInternalTx_1.isEligibleTransaction)(tx)) {
        return extractRoyaltyInfo(body);
    }
    return null;
}
exports.parseRoyaltyInfo = parseRoyaltyInfo;
//# sourceMappingURL=RoyaltyInfo.js.map


================================================
FILE: cli/dist/src/transaction-parsing/RoyaltyInfo.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/RoyaltyInfo.js.map
================================================
{"version":3,"file":"RoyaltyInfo.js","sourceRoot":"","sources":["../../../../src/transaction-parsing/RoyaltyInfo.ts"],"names":[],"mappings":";;;AAAA,uCAA8E;AAC9E,oEAAoE;AAQpE,SAAS,kBAAkB,CAAC,IAAS;IACnC,OAAO;QACL,OAAO,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC;QAC3B,IAAI,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,GAAG;QACpB,OAAO,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,IAAI;QACxB,KAAK,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,KAAK,CAAC,KAAK;KAC9B,CAAC;AACJ,CAAC;AAED,SAAgB,gBAAgB,CAC9B,WAAkB;;IAElB,MAAM,EAAE,GAAG,IAAA,0BAAe,EAAC,WAAW,CAAC,CAAC;IACxC,MAAM,IAAI,GAAG,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,UAAU,EAAE,CAAC;IAE7C,IAAI,EAAE,CAAC;IACP,IAAI;QACF,EAAE,GAAG,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC,CAAC;KACzB;IAAC,WAAM;QACN,OAAO,IAAI,CAAC;KACb;IAED,IAAI,IAAA,0CAAqB,EAAC,EAAE,CAAC,EAAE;QAC7B,OAAO,kBAAkB,CAAC,IAAI,CAAC,CAAC;KACjC;IAED,OAAO,IAAI,CAAC;AACd,CAAC;AAlBD,4CAkBC"}


================================================
FILE: cli/dist/src/transaction-parsing/TransferEditorship.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/TransferEditorship.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTransferEditorshipInfo = void 0;
const ton_core_1 = require("ton-core");
const EligibleInternalTx_1 = require("../utils/EligibleInternalTx");
function extractTransferEditorshipInfo(body) {
    return {
        queryId: body === null || body === void 0 ? void 0 : body.loadUint(64),
        from: body === null || body === void 0 ? void 0 : body.info.src,
        nftItem: body === null || body === void 0 ? void 0 : body.info.dest,
        newEditor: body === null || body === void 0 ? void 0 : body.loadAddress(),
        responseDestination: body === null || body === void 0 ? void 0 : body.loadAddress(),
        customPayload: body === null || body === void 0 ? void 0 : body.loadMaybeRef(),
        forwardAmount: body === null || body === void 0 ? void 0 : body.loadCoins(),
        forwardPayload: body === null || body === void 0 ? void 0 : body.loadMaybeRef(),
        value: body === null || body === void 0 ? void 0 : body.info.value.coins,
    };
}
function parseTransferEditorshipInfo(transaction) {
    var _a;
    const tx = (0, ton_core_1.loadTransaction)(transaction);
    const body = (_a = tx.inMessage) === null || _a === void 0 ? void 0 : _a.body.beginParse();
    let op;
    try {
        op = body === null || body === void 0 ? void 0 : body.loadUint(32);
    }
    catch (_b) {
        return null;
    }
    if ((0, EligibleInternalTx_1.isEligibleTransaction)(tx)) {
        return extractTransferEditorshipInfo(body);
    }
    return null;
}
exports.parseTransferEditorshipInfo = parseTransferEditorshipInfo;
//# sourceMappingURL=TransferEditorship.js.map


================================================
FILE: cli/dist/src/transaction-parsing/TransferEditorship.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/TransferEditorship.js.map
================================================
{"version":3,"file":"TransferEditorship.js","sourceRoot":"","sources":["../../../../src/transaction-parsing/TransferEditorship.ts"],"names":[],"mappings":";;;AAAA,uCAKoB;AACpB,oEAAoE;AAclE,SAAS,6BAA6B,CAAC,IAAS;IAC9C,OAAO;QACL,OAAO,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC;QAC3B,IAAI,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,GAAG;QACpB,OAAO,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,IAAI;QACxB,SAAS,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,WAAW,EAAE;QAC9B,mBAAmB,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,WAAW,EAAE;QACxC,aAAa,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,YAAY,EAAE;QACnC,aAAa,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,SAAS,EAAE;QAChC,cAAc,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,YAAY,EAAE;QACpC,KAAK,EAAE,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,IAAI,CAAC,KAAK,CAAC,KAAK;KAC9B,CAAC;AACJ,CAAC;AAED,SAAgB,2BAA2B,CACzC,WAAkB;;IAElB,MAAM,EAAE,GAAG,IAAA,0BAAe,EAAC,WAAW,CAAC,CAAC;IACxC,MAAM,IAAI,GAAG,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,UAAU,EAAE,CAAC;IAE7C,IAAI,EAAE,CAAC;IACP,IAAI;QACF,EAAE,GAAG,IAAI,aAAJ,IAAI,uBAAJ,IAAI,CAAE,QAAQ,CAAC,EAAE,CAAC,CAAC;KACzB;IAAC,WAAM;QACN,OAAO,IAAI,CAAC;KACb;IAED,IAAI,IAAA,0CAAqB,EAAC,EAAE,CAAC,EAAE;QAC7B,OAAO,6BAA6B,CAAC,IAAI,CAAC,CAAC;KAC5C;IAED,OAAO,IAAI,CAAC;AACd,CAAC;AAlBD,kEAkBC"}


================================================
FILE: cli/dist/src/transaction-parsing/index.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/index.js
================================================
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./EditContent"), exports);
__exportStar(require("./NftTransfer"), exports);
__exportStar(require("./RoyaltyInfo"), exports);
__exportStar(require("./TransferEditorship"), exports);
//# sourceMappingURL=index.js.map


================================================
FILE: cli/dist/src/transaction-parsing/index.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/transaction-parsing/index.js.map
================================================
{"version":3,"file":"index.js","sourceRoot":"","sources":["../../../../src/transaction-parsing/index.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;AAAA,gDAA6B;AAC7B,gDAA6B;AAC7B,gDAA6B;AAC7B,uDAAoC"}


================================================
FILE: cli/dist/src/types/OffchainContent.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/types/OffchainContent.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeOffChainContent = exports.storeOffchainContent = exports.makeSnakeCell = void 0;
const ton_core_1 = require("ton-core");
// offchain#01 uri:Text = FullContent;
const OFF_CHAIN_CONTENT_PREFIX = 0x01;
// export function flattenSnakeCell(cell: Cell) {
//     let c: Cell|null = cell
//     let res = Buffer.alloc(0)
//     while (c) {
//         let cs = c.beginParse()
//         let data = cs.readRemainingBytes()
//         res = Buffer.concat([res, data])
//         c = c.refs[0]
//     }
//     return res
// }
function bufferToChunks(buff, chunkSize) {
    let chunks = [];
    while (buff.byteLength > 0) {
        chunks.push(buff.slice(0, chunkSize));
        buff = buff.slice(chunkSize);
    }
    return chunks;
}
function makeSnakeCell(data) {
    let chunks = bufferToChunks(data, 127);
    let rootCell = (0, ton_core_1.beginCell)();
    let curCell = rootCell;
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        curCell.storeBuffer(chunk);
        if (chunks[i + 1]) {
            let nextCell = (0, ton_core_1.beginCell)();
            curCell.storeRef(nextCell);
            curCell = nextCell;
        }
    }
    return rootCell;
}
exports.makeSnakeCell = makeSnakeCell;
// export function loadOffchainContent(content: Cell): Offchain {
//     let data = flattenSnakeCell(content)
//     let prefix = data[0]
//     if (prefix !== OFF_CHAIN_CONTENT_PREFIX) {
//         throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
//     }
//     return {
//         uri: data.slice(1).toString()
//     }
// }
function storeOffchainContent(content) {
    let data = Buffer.from(content.uri);
    let offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX]);
    data = Buffer.concat([offChainPrefix, data]);
    return (builder) => {
        builder.storeRef(makeSnakeCell(data));
    };
}
exports.storeOffchainContent = storeOffchainContent;
function encodeOffChainContent(content) {
    let data = Buffer.from(content);
    let offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX]);
    data = Buffer.concat([offChainPrefix, data]);
    return makeSnakeCell(data);
}
exports.encodeOffChainContent = encodeOffChainContent;
//# sourceMappingURL=OffchainContent.js.map


================================================
FILE: cli/dist/src/types/OffchainContent.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/types/OffchainContent.js.map
================================================
{"version":3,"file":"OffchainContent.js","sourceRoot":"","sources":["../../../../src/types/OffchainContent.ts"],"names":[],"mappings":";;;AAAA,uCAA8C;AAI9C,sCAAsC;AAEtC,MAAM,wBAAwB,GAAG,IAAI,CAAA;AAMrC,iDAAiD;AACjD,8BAA8B;AAE9B,gCAAgC;AAEhC,kBAAkB;AAClB,kCAAkC;AAClC,6CAA6C;AAC7C,2CAA2C;AAC3C,wBAAwB;AACxB,QAAQ;AAER,iBAAiB;AACjB,IAAI;AAEJ,SAAS,cAAc,CAAC,IAAY,EAAE,SAAiB;IACnD,IAAI,MAAM,GAAa,EAAE,CAAA;IACzB,OAAO,IAAI,CAAC,UAAU,GAAG,CAAC,EAAE;QACxB,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,EAAE,SAAS,CAAC,CAAC,CAAA;QACrC,IAAI,GAAG,IAAI,CAAC,KAAK,CAAC,SAAS,CAAC,CAAA;KAC/B;IACD,OAAO,MAAM,CAAA;AACjB,CAAC;AAED,SAAgB,aAAa,CAAC,IAAY;IACtC,IAAI,MAAM,GAAG,cAAc,CAAC,IAAI,EAAE,GAAG,CAAC,CAAA;IACtC,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC1B,IAAI,OAAO,GAAG,QAAQ,CAAA;IAEtB,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,MAAM,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;QACpC,IAAI,KAAK,GAAG,MAAM,CAAC,CAAC,CAAC,CAAA;QAErB,OAAO,CAAC,WAAW,CAAC,KAAK,CAAC,CAAA;QAE1B,IAAI,MAAM,CAAC,CAAC,GAAC,CAAC,CAAC,EAAE;YACb,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;YAC1B,OAAO,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAA;YAC1B,OAAO,GAAG,QAAQ,CAAA;SACrB;KACJ;IAED,OAAO,QAAQ,CAAA;AACnB,CAAC;AAlBD,sCAkBC;AAED,iEAAiE;AACjE,2CAA2C;AAE3C,2BAA2B;AAC3B,iDAAiD;AACjD,4EAA4E;AAC5E,QAAQ;AACR,eAAe;AACf,wCAAwC;AACxC,QAAQ;AACR,IAAI;AAEJ,SAAgB,oBAAoB,CAAC,OAAiB;IAClD,IAAI,IAAI,GAAG,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,GAAG,CAAC,CAAA;IACnC,IAAI,cAAc,GAAG,MAAM,CAAC,IAAI,CAAC,CAAC,wBAAwB,CAAC,CAAC,CAAA;IAC5D,IAAI,GAAG,MAAM,CAAC,MAAM,CAAC,CAAC,cAAc,EAAE,IAAI,CAAC,CAAC,CAAA;IAE5C,OAAO,CAAC,OAAgB,EAAE,EAAE;QACxB,OAAO,CAAC,QAAQ,CACZ,aAAa,CAAC,IAAI,CAAC,CACtB,CAAC;IACN,CAAC,CAAC;AACN,CAAC;AAVD,oDAUC;AAED,SAAgB,qBAAqB,CAAC,OAAe;IACjD,IAAI,IAAI,GAAG,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,CAAA;IAC/B,IAAI,cAAc,GAAG,MAAM,CAAC,IAAI,CAAC,CAAC,wBAAwB,CAAC,CAAC,CAAA;IAC5D,IAAI,GAAG,MAAM,CAAC,MAAM,CAAC,CAAC,cAAc,EAAE,IAAI,CAAC,CAAC,CAAA;IAC5C,OAAO,aAAa,CAAC,IAAI,CAAC,CAAA;AAC9B,CAAC;AALD,sDAKC"}


================================================
FILE: cli/dist/src/utils/EligibleInternalTx.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/EligibleInternalTx.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEligibleTransaction = void 0;
function isEligibleTransaction(tx) {
    var _a;
    return (((_a = tx.inMessage) === null || _a === void 0 ? void 0 : _a.info.type) == 'internal' &&
        tx.description.type == 'generic' &&
        tx.description.computePhase.type == 'vm' &&
        tx.description.computePhase.exitCode == 0);
}
exports.isEligibleTransaction = isEligibleTransaction;
//# sourceMappingURL=EligibleInternalTx.js.map


================================================
FILE: cli/dist/src/utils/EligibleInternalTx.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/EligibleInternalTx.js.map
================================================
{"version":3,"file":"EligibleInternalTx.js","sourceRoot":"","sources":["../../../../src/utils/EligibleInternalTx.ts"],"names":[],"mappings":";;;AAEA,SAAgB,qBAAqB,CAAC,EAAe;;IACjD,OAAO,CACH,CAAA,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,IAAI,KAAI,UAAU;QACrC,EAAE,CAAC,WAAW,CAAC,IAAI,IAAI,SAAS;QAChC,EAAE,CAAC,WAAW,CAAC,YAAY,CAAC,IAAI,IAAI,IAAI;QACxC,EAAE,CAAC,WAAW,CAAC,YAAY,CAAC,QAAQ,IAAI,CAAC,CAC5C,CAAA;AACL,CAAC;AAPD,sDAOC"}


================================================
FILE: cli/dist/src/utils/FetchAndParseTransaction.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/FetchAndParseTransaction.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndParseTransactionData = void 0;
const ton_core_1 = require("ton-core");
const ton_api_1 = require("../ton-api");
const parseTransaction_1 = require("./parseTransaction");
function fetchAndParseTransactionData(account, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const tonClient = new ton_api_1.TonClient();
        const transactions = yield tonClient.getTransactionsByAddress(account, limit);
        let transactions_data = [];
        for (let i = 0; i < transactions.transactions.length; i++) {
            const transaction = transactions.transactions[i];
            const parsedTransaction = yield (0, parseTransaction_1.parseTransactionData)(ton_core_1.Cell.fromBoc(Buffer.from(transaction.data, 'hex'))[0].beginParse());
            transactions_data.push(parsedTransaction);
        }
        return transactions_data;
    });
}
exports.fetchAndParseTransactionData = fetchAndParseTransactionData;
//# sourceMappingURL=FetchAndParseTransaction.js.map


================================================
FILE: cli/dist/src/utils/FetchAndParseTransaction.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/FetchAndParseTransaction.js.map
================================================
{"version":3,"file":"FetchAndParseTransaction.js","sourceRoot":"","sources":["../../../../src/utils/FetchAndParseTransaction.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAgD;AAChD,wCAAoC;AACpC,yDAAgE;AAEhE,SAAsB,4BAA4B,CAC9C,OAAgB,EAChB,KAAa;;QAEb,MAAM,SAAS,GAAG,IAAI,mBAAS,EAAE,CAAC;QAElC,MAAM,YAAY,GAAQ,MAAM,SAAS,CAAC,wBAAwB,CAC9D,OAAO,EACP,KAAK,CACR,CAAC;QAEF,IAAI,iBAAiB,GAAgB,EAAE,CAAC;QACxC,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,YAAY,CAAC,YAAY,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;YACvD,MAAM,WAAW,GAAG,YAAY,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;YAEjD,MAAM,iBAAiB,GAAG,MAAM,IAAA,uCAAoB,EAChD,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,WAAW,CAAC,IAAI,EAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,UAAU,EAAE,CACpE,CAAC;YAEF,iBAAiB,CAAC,IAAI,CAAC,iBAAiB,CAAC,CAAC;SAC7C;QAED,OAAO,iBAAiB,CAAC;IAC7B,CAAC;CAAA;AAvBD,oEAuBC"}


================================================
FILE: cli/dist/src/utils/combineFunc.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/combineFunc.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineFunc = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function combineFunc(root, paths) {
    let res = '';
    for (let path of paths) {
        res += (0, fs_1.readFileSync)((0, path_1.resolve)(root, path), 'utf-8');
        res += '\n';
    }
    return res;
}
exports.combineFunc = combineFunc;
//# sourceMappingURL=combineFunc.js.map


================================================
FILE: cli/dist/src/utils/combineFunc.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/combineFunc.js.map
================================================
{"version":3,"file":"combineFunc.js","sourceRoot":"","sources":["../../../../src/utils/combineFunc.ts"],"names":[],"mappings":";;;AAAA,2BAAgC;AAChC,+BAA6B;AAE7B,SAAgB,WAAW,CAAC,IAAY,EAAE,KAAe;IACrD,IAAI,GAAG,GAAG,EAAE,CAAA;IAEZ,KAAK,IAAI,IAAI,IAAI,KAAK,EAAE;QACpB,GAAG,IAAI,IAAA,iBAAY,EAAC,IAAA,cAAO,EAAC,IAAI,EAAE,IAAI,CAAC,EAAE,OAAO,CAAC,CAAA;QACjD,GAAG,IAAI,IAAI,CAAA;KACd;IAED,OAAO,GAAG,CAAA;AACd,CAAC;AATD,kCASC"}


================================================
FILE: cli/dist/src/utils/createSender.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/createSender.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSender = void 0;
const ton_1 = require("ton");
function createSender(keypair, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let wallet = ton_1.WalletContractV4.create({
            workchain: 0,
            publicKey: keypair.publicKey
        });
        let contract = client.open(wallet);
        return contract.sender(keypair.secretKey);
    });
}
exports.createSender = createSender;
exports.default = createSender;
//# sourceMappingURL=createSender.js.map


================================================
FILE: cli/dist/src/utils/createSender.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/createSender.js.map
================================================
{"version":3,"file":"createSender.js","sourceRoot":"","sources":["../../../../src/utils/createSender.ts"],"names":[],"mappings":";;;;;;;;;;;;AACA,6BAAmD;AAEnD,SAAsB,YAAY,CAC9B,OAAgB,EAChB,MAAkB;;QAElB,IAAI,MAAM,GAAG,sBAAgB,CAAC,MAAM,CAChC;YACI,SAAS,EAAE,CAAC;YACZ,SAAS,EAAE,OAAO,CAAC,SAAS;SAC/B,CACJ,CAAA;QAED,IAAI,QAAQ,GAAG,MAAM,CAAC,IAAI,CACtB,MAAM,CACT,CAAC;QAEF,OAAO,QAAQ,CAAC,MAAM,CAAC,OAAO,CAAC,SAAS,CAAC,CAAC;IAC9C,CAAC;CAAA;AAhBD,oCAgBC;AAED,kBAAe,YAAY,CAAC"}


================================================
FILE: cli/dist/src/utils/createTempFile.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/createTempFile.js
================================================
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTempFile = void 0;
const uuid_1 = require("./uuid");
const os = __importStar(require("os"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
function createTempFile(ext) {
    return __awaiter(this, void 0, void 0, function* () {
        let name = (0, uuid_1.uuid)();
        let fullPath = path_1.default.resolve(os.tmpdir(), name + ext);
        yield (0, promises_1.writeFile)(fullPath, Buffer.alloc(0));
        return {
            name: fullPath,
            destroy: () => __awaiter(this, void 0, void 0, function* () {
                yield (0, promises_1.unlink)(fullPath);
            })
        };
    });
}
exports.createTempFile = createTempFile;
//# sourceMappingURL=createTempFile.js.map


================================================
FILE: cli/dist/src/utils/createTempFile.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/createTempFile.js.map
================================================
{"version":3,"file":"createTempFile.js","sourceRoot":"","sources":["../../../../src/utils/createTempFile.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAAA,iCAA4B;AAC5B,uCAAyB;AACzB,gDAAwB;AACxB,0CAA8C;AAE9C,SAAsB,cAAc,CAAC,GAAW;;QAC5C,IAAI,IAAI,GAAG,IAAA,WAAI,GAAE,CAAA;QACjB,IAAI,QAAQ,GAAG,cAAI,CAAC,OAAO,CAAC,EAAE,CAAC,MAAM,EAAE,EAAE,IAAI,GAAG,GAAG,CAAC,CAAA;QACpD,MAAM,IAAA,oBAAS,EAAC,QAAQ,EAAE,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAA;QAC1C,OAAO;YACH,IAAI,EAAE,QAAQ;YACd,OAAO,EAAE,GAAU,EAAE;gBACjB,MAAM,IAAA,iBAAM,EAAC,QAAQ,CAAC,CAAA;YAC1B,CAAC,CAAA;SACJ,CAAA;IACL,CAAC;CAAA;AAVD,wCAUC"}


================================================
FILE: cli/dist/src/utils/importKeyPair.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/importKeyPair.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importKeyPair = void 0;
const process_1 = require("process");
const ton_crypto_1 = require("ton-crypto");
const fs_1 = require("fs");
function importKeyPair(secretKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let keyPair;
        if (secretKey) {
            keyPair = (0, ton_crypto_1.keyPairFromSecretKey)(Buffer.from(secretKey, 'hex'));
        }
        else {
            const content = (0, fs_1.readFileSync)(String(process_1.env.SECRET_KEY), 'utf-8');
            keyPair = (0, ton_crypto_1.keyPairFromSecretKey)(Buffer.from(content, 'hex'));
        }
        return keyPair;
    });
}
exports.importKeyPair = importKeyPair;
exports.default = importKeyPair;
//# sourceMappingURL=importKeyPair.js.map


================================================
FILE: cli/dist/src/utils/importKeyPair.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/importKeyPair.js.map
================================================
{"version":3,"file":"importKeyPair.js","sourceRoot":"","sources":["../../../../src/utils/importKeyPair.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,qCAA6B;AAC7B,2CAA0D;AAC1D,2BAAkC;AAElC,SAAsB,aAAa,CAC/B,SAAkB;;QAElB,IAAI,OAAgB,CAAC;QAErB,IAAI,SAAS,EAAE;YACX,OAAO,GAAG,IAAA,iCAAoB,EAAC,MAAM,CAAC,IAAI,CAAC,SAAS,EAAE,KAAK,CAAC,CAAC,CAAC;SACjE;aAAM;YACH,MAAM,OAAO,GAAG,IAAA,iBAAY,EAAC,MAAM,CAAC,aAAG,CAAC,UAAU,CAAC,EAAE,OAAO,CAAC,CAAC;YAC9D,OAAO,GAAG,IAAA,iCAAoB,EAAC,MAAM,CAAC,IAAI,CAAC,OAAO,EAAE,KAAK,CAAC,CAAC,CAAC;SAC/D;QAED,OAAO,OAAO,CAAC;IACnB,CAAC;CAAA;AAbD,sCAaC;AAED,kBAAe,aAAa,CAAC"}


================================================
FILE: cli/dist/src/utils/index.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/index.js
================================================
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./EligibleInternalTx"), exports);
__exportStar(require("./combineFunc"), exports);
__exportStar(require("./createTempFile"), exports);
__exportStar(require("./parseTransaction"), exports);
__exportStar(require("./randomAddress"), exports);
__exportStar(require("./randomKeyPair"), exports);
__exportStar(require("./uuid"), exports);
__exportStar(require("./importKeyPair"), exports);
__exportStar(require("./createSender"), exports);
//# sourceMappingURL=index.js.map


================================================
FILE: cli/dist/src/utils/index.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/index.js.map
================================================
{"version":3,"file":"index.js","sourceRoot":"","sources":["../../../../src/utils/index.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;AAAA,uDAAoC;AACpC,gDAA6B;AAC7B,mDAAgC;AAChC,qDAAkC;AAClC,kDAA+B;AAC/B,kDAA+B;AAC/B,yCAAsB;AACtB,kDAA+B;AAC/B,iDAA8B"}


================================================
FILE: cli/dist/src/utils/parseTransaction.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/parseTransaction.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTransactionData = void 0;
const ton_core_1 = require("ton-core");
function parseTransactionData(transaction) {
    var _a;
    const tx = (0, ton_core_1.loadTransaction)(transaction);
    if (((_a = tx.inMessage) === null || _a === void 0 ? void 0 : _a.info.type) === "internal") {
        const body = tx.inMessage.body.beginParse();
        let op;
        try {
            op = body.loadUint(32);
            console.log(op);
        }
        catch (_b) {
            return {
                type: "unknown",
                info: null,
            };
        }
        if (op === 0x5fcc3d14 &&
            tx.description.type === "generic" &&
            tx.description.computePhase.type === "vm") {
            const nftTransfer = {
                queryId: body.loadUint(64),
                from: tx.inMessage.info.src,
                to: body.loadAddress(),
                value: tx.inMessage.info.value.coins,
                responseTo: body.loadAddress(),
                customPayload: body.loadMaybeRef(),
                forwardAmount: body.loadCoins(),
                forwardPayload: body.loadMaybeRef(),
            };
            return {
                type: "transfer",
                info: nftTransfer,
            };
        }
        else if (op === 0x693d3950 &&
            tx.description.type === "generic" &&
            tx.description.computePhase.type === "vm") {
            const royaltyInfo = {
                queryId: body.loadUint(64),
                from: tx.inMessage.info.src,
                nftItem: body.loadAddress(),
                value: tx.inMessage.info.value.coins,
            };
            return {
                type: "royalty_params",
                info: royaltyInfo,
            };
        }
        else {
            return {
                type: "unknown",
                info: null
            };
        }
    }
    return {
        type: null,
        info: null,
    };
}
exports.parseTransactionData = parseTransactionData;
//# sourceMappingURL=parseTransaction.js.map


================================================
FILE: cli/dist/src/utils/parseTransaction.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/parseTransaction.js.map
================================================
{"version":3,"file":"parseTransaction.js","sourceRoot":"","sources":["../../../../src/utils/parseTransaction.ts"],"names":[],"mappings":";;;AAAA,uCAAiE;AAQjE,SAAgB,oBAAoB,CAAC,WAAkB;;IACnD,MAAM,EAAE,GAAG,IAAA,0BAAe,EAAC,WAAW,CAAC,CAAC;IAExC,IAAI,CAAA,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,IAAI,MAAK,UAAU,EAAE;QACxC,MAAM,IAAI,GAAG,EAAE,CAAC,SAAS,CAAC,IAAI,CAAC,UAAU,EAAE,CAAC;QAC5C,IAAI,EAAE,CAAC;QAEP,IAAI;YACA,EAAE,GAAG,IAAI,CAAC,QAAQ,CAAC,EAAE,CAAC,CAAC;YACvB,OAAO,CAAC,GAAG,CAAC,EAAE,CAAC,CAAA;SAClB;QAAC,WAAM;YACJ,OAAO;gBACH,IAAI,EAAE,SAAS;gBACf,IAAI,EAAE,IAAI;aACb,CAAA;SACJ;QAED,IACI,EAAE,KAAK,UAAU;YACjB,EAAE,CAAC,WAAW,CAAC,IAAI,KAAK,SAAS;YACjC,EAAE,CAAC,WAAW,CAAC,YAAY,CAAC,IAAI,KAAK,IAAI,EAC3C;YACE,MAAM,WAAW,GAAoB;gBACjC,OAAO,EAAE,IAAI,CAAC,QAAQ,CAAC,EAAE,CAAC;gBAC1B,IAAI,EAAE,EAAE,CAAC,SAAS,CAAC,IAAI,CAAC,GAAG;gBAC3B,EAAE,EAAE,IAAI,CAAC,WAAW,EAAE;gBACtB,KAAK,EAAE,EAAE,CAAC,SAAS,CAAC,IAAI,CAAC,KAAK,CAAC,KAAK;gBACpC,UAAU,EAAE,IAAI,CAAC,WAAW,EAAE;gBAC9B,aAAa,EAAE,IAAI,CAAC,YAAY,EAAE;gBAClC,aAAa,EAAE,IAAI,CAAC,SAAS,EAAE;gBAC/B,cAAc,EAAE,IAAI,CAAC,YAAY,EAAE;aACtC,CAAC;YAEF,OAAO;gBACH,IAAI,EAAE,UAAU;gBAChB,IAAI,EAAE,WAAW;aACpB,CAAC;SACL;aAAM,IACH,EAAE,KAAK,UAAU;YACjB,EAAE,CAAC,WAAW,CAAC,IAAI,KAAK,SAAS;YACjC,EAAE,CAAC,WAAW,CAAC,YAAY,CAAC,IAAI,KAAK,IAAI,EAC3C;YACE,MAAM,WAAW,GAAgB;gBAC7B,OAAO,EAAE,IAAI,CAAC,QAAQ,CAAC,EAAE,CAAC;gBAC1B,IAAI,EAAE,EAAE,CAAC,SAAS,CAAC,IAAI,CAAC,GAAG;gBAC3B,OAAO,EAAE,IAAI,CAAC,WAAW,EAAE;gBAC3B,KAAK,EAAE,EAAE,CAAC,SAAS,CAAC,IAAI,CAAC,KAAK,CAAC,KAAK;aACvC,CAAC;YAEF,OAAO;gBACH,IAAI,EAAE,gBAAgB;gBACtB,IAAI,EAAE,WAAW;aACpB,CAAC;SACL;aAAM;YACH,OAAO;gBACH,IAAI,EAAE,SAAS;gBACf,IAAI,EAAE,IAAI;aACb,CAAA;SACJ;KACJ;IAED,OAAO;QACH,IAAI,EAAE,IAAI;QACV,IAAI,EAAE,IAAI;KACb,CAAC;AACN,CAAC;AAjED,oDAiEC"}


================================================
FILE: cli/dist/src/utils/randomAddress.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/randomAddress.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomAddress = void 0;
const ton_core_1 = require("ton-core");
const crypto_1 = require("crypto");
function randomAddress() {
    return new ton_core_1.Address(0, (0, crypto_1.pseudoRandomBytes)(256 / 8));
}
exports.randomAddress = randomAddress;
//# sourceMappingURL=randomAddress.js.map


================================================
FILE: cli/dist/src/utils/randomAddress.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/randomAddress.js.map
================================================
{"version":3,"file":"randomAddress.js","sourceRoot":"","sources":["../../../../src/utils/randomAddress.ts"],"names":[],"mappings":";;;AAAA,uCAAiC;AACjC,mCAAyC;AAEzC,SAAgB,aAAa;IACzB,OAAO,IAAI,kBAAO,CAAC,CAAC,EAAE,IAAA,0BAAiB,EAAC,GAAG,GAAC,CAAC,CAAC,CAAC,CAAA;AACnD,CAAC;AAFD,sCAEC"}


================================================
FILE: cli/dist/src/utils/randomKeyPair.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/randomKeyPair.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomKeyPair = void 0;
const ton_crypto_1 = require("ton-crypto");
function randomKeyPair() {
    return __awaiter(this, void 0, void 0, function* () {
        let mnemonics = yield (0, ton_crypto_1.mnemonicNew)();
        return (0, ton_crypto_1.mnemonicToPrivateKey)(mnemonics);
    });
}
exports.randomKeyPair = randomKeyPair;
//# sourceMappingURL=randomKeyPair.js.map


================================================
FILE: cli/dist/src/utils/randomKeyPair.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/randomKeyPair.js.map
================================================
{"version":3,"file":"randomKeyPair.js","sourceRoot":"","sources":["../../../../src/utils/randomKeyPair.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,2CAA6D;AAE7D,SAAsB,aAAa;;QAC/B,IAAI,SAAS,GAAG,MAAM,IAAA,wBAAW,GAAE,CAAA;QACnC,OAAO,IAAA,iCAAoB,EAAC,SAAS,CAAC,CAAA;IAC1C,CAAC;CAAA;AAHD,sCAGC"}


================================================
FILE: cli/dist/src/utils/uuid.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/uuid.js
================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
const uuid_1 = require("uuid");
const uuid = () => (0, uuid_1.v4)();
exports.uuid = uuid;
//# sourceMappingURL=uuid.js.map


================================================
FILE: cli/dist/src/utils/uuid.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/utils/uuid.js.map
================================================
{"version":3,"file":"uuid.js","sourceRoot":"","sources":["../../../../src/utils/uuid.ts"],"names":[],"mappings":";;;AAAA,+BAAuB;AAEhB,MAAM,IAAI,GAAG,GAAG,EAAE,CAAC,IAAA,SAAE,GAAE,CAAA;AAAjB,QAAA,IAAI,QAAa"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftAuction.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftAuction.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftAuctionCodeCell = exports.NftAuctionCodeBoc = exports.buildNftAuctionDataCell = exports.NftAuction = void 0;
const ton_core_1 = require("ton-core");
class NftAuction {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftAuction(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftAuctionDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftAuctionCodeCell,
                data: data
            });
            return new NftAuction(address, 0, {
                code: exports.NftAuctionCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendCancel(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0, 32)
                    .storeBuffer(Buffer.from('cancel'))
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendStop(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0, 32)
                    .storeBuffer(Buffer.from('cancel'))
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendRepeatEndAuction(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0, 32)
                    .storeBuffer(Buffer.from('repeat_end_auction'))
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendEmergencyMessage(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const transfer = (0, ton_core_1.beginCell)();
            transfer.storeUint(0x18, 6);
            transfer.storeAddress(params.marketplaceAddress);
            transfer.storeCoins(params.coins);
            transfer.storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1);
            transfer.storeRef((0, ton_core_1.beginCell)().storeUint(555, 32).endCell());
            const transferBox = (0, ton_core_1.beginCell)();
            transferBox.storeUint(2, 8);
            transferBox.storeRef(transfer.endCell());
            const msgResend = (0, ton_core_1.beginCell)().storeUint(0, 32).storeBuffer(Buffer.from("emergency_message")).storeRef(transferBox.endCell()).endCell();
            yield provider.internal(via, {
                value: params.value,
                body: msgResend,
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getSaleData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_sale_data', []);
            // pops out saleType
            stack.pop();
            return {
                // saleType: stack.readBigNumber(),
                end: stack.readBoolean(),
                endTimestamp: stack.readBigNumber(),
                marketplaceAddress: stack.readAddressOpt(),
                nftAddress: stack.readAddressOpt(),
                nftOwnerAddress: stack.readAddressOpt(),
                lastBidAmount: stack.readBigNumber(),
                lastBidAddress: stack.readAddressOpt(),
                minStep: stack.readBigNumber(),
                marketplaceFeeAddress: stack.readAddressOpt(),
                marketplaceFeeFactor: stack.readBigNumber(),
                marketplaceFeeBase: stack.readBigNumber(),
                royaltyAddress: stack.readAddressOpt(),
                royaltyFactor: stack.readBigNumber(),
                royaltyBase: stack.readBigNumber(),
                maxBid: stack.readBigNumber(),
                minBid: stack.readBigNumber(),
                createdAt: stack.readBigNumber(),
                lastBidAt: stack.readBigNumber(),
                isCanceled: stack.readBigNumber(),
            };
        });
    }
}
exports.NftAuction = NftAuction;
function buildNftAuctionDataCell(data) {
    const feesCell = (0, ton_core_1.beginCell)();
    feesCell.storeAddress(data.marketplaceFeeAddress); // mp_fee_addr
    feesCell.storeUint(data.marketplaceFeeFactor, 32); // mp_fee_factor
    feesCell.storeUint(data.marketplaceFeeBase, 32); // mp_fee_base
    feesCell.storeAddress(data.royaltyAddress); // royalty_fee_addr
    feesCell.storeUint(data.royaltyFactor, 32); // royalty_fee_factor
    feesCell.storeUint(data.royaltyBase, 32); // royalty_fee_base
    const bidsCell = (0, ton_core_1.beginCell)();
    bidsCell.storeCoins(data.minBid); // min_bid
    bidsCell.storeCoins(data.maxBid); // max_bid
    bidsCell.storeCoins(data.minStep); // min_step
    bidsCell.storeBuffer(Buffer.from([0, 0])); // last_member
    bidsCell.storeCoins(0); // last_bid
    bidsCell.storeUint(0, 32); // last_bid_at
    bidsCell.storeUint(data.endTimestamp, 32); // end_time
    bidsCell.storeUint(data.stepTimeSeconds, 32); // step_time
    bidsCell.storeUint(data.tryStepTimeSeconds, 32); // try_step_time
    let nftCell = (0, ton_core_1.beginCell)();
    if (data.nftOwnerAddress) {
        nftCell.storeAddress(data.nftOwnerAddress);
    }
    else {
        nftCell.storeBuffer(Buffer.from([0, 0]));
    }
    nftCell.storeAddress(data.nftAddress); // nft_addr
    const storage = (0, ton_core_1.beginCell)();
    storage.storeBit(data.end); // end?
    storage.storeAddress(data.marketplaceAddress); // mp_addr
    storage.storeBit(data.activated); // activated
    storage.storeUint(data.createdAtTimestamp, 32);
    storage.storeBit(false); // is_canceled
    storage.storeRef(feesCell.endCell());
    storage.storeRef(bidsCell.endCell());
    storage.storeRef(nftCell.endCell());
    return storage.endCell();
}
exports.buildNftAuctionDataCell = buildNftAuctionDataCell;
// Nft Auction Data
exports.NftAuctionCodeBoc = 'te6cckECLgEABqIAART/APSkE/S88sgLAQIBIAIDAgFIBAUCKPIw2zyBA+74RMD/8vL4AH/4ZNs8LBkCAs4GBwIBIBwdAgEgCAkCASAaGwT1DPQ0wMBcbDyQPpAMNs8+ENSEMcF+EKwwP+Oz1vTHyHAAI0EnJlcGVhdF9lbmRfYXVjdGlvboFIgxwWwjoNb2zzgAcAAjQRZW1lcmdlbmN5X21lc3NhZ2WBSIMcFsJrUMNDTB9QwAfsA4DDg+FdSEMcFjoQxAds84PgjgLBEKCwATIIQO5rKAAGphIAFcMYED6fhW10nCAvLygQPqAdMfghAFE42REroS8vSAQNch+kAw+HZw+GJ/+GTbPBkESPhTvo8GbCHbPNs84PhCwP+OhGwh2zzg+FZSEMcF+ENSIMcFsRcRFwwEeI+4MYED6wLTHwHDABPy8otmNhbmNlbIUiDHBY6DIds83otHN0b3CBLHBfhWUiDHBbCPBNs82zyRMOLgMg0XEQ4B9oED7ItmNhbmNlbIEscFs/Ly+FHCAI5FcCCAGMjLBfhQzxb4UfoCy2rLH40KVlvdXIgYmlkIGhhcyBiZWVuIG91dGJpZCBieSBhbm90aGVyIHVzZXIugzxbJcvsA3nAg+CWCEF/MPRTIyx/LP/hWzxb4Vs8WywAh+gLLAA8BBNs8EAFMyXGAGMjLBfhXzxZw+gLLasyCCA9CQHD7AsmDBvsAf/hif/hm2zwZBPSBA+34QsD/8vL4U/gjuY8FMNs82zzg+E7CAPhOUiC+sI7V+FGORXAggBjIywX4UM8W+FH6Astqyx+NClZb3VyIGJpZCBoYXMgYmVlbiBvdXRiaWQgYnkgYW5vdGhlciB1c2VyLoM8WyXL7AN4B+HD4cfgj+HLbPOD4UxcRERICkvhRwACOPHAg+CWCEF/MPRTIyx/LP/hWzxb4Vs8WywAh+gLLAMlxgBjIywX4V88WcPoCy2rMgggPQkBw+wLJgwb7AOMOf/hi2zwTGQP8+FWh+CO5l/hT+FSg+HPe+FGOlIED6PhNUiC58vL4cfhw+CP4cts84fhR+E+gUhC5joMw2zzgcCCAGMjLBfhQzxb4UfoCy2rLH40KVlvdXIgYmlkIGhhcyBiZWVuIG91dGJpZCBieSBhbm90aGVyIHVzZXIugzxbJcvsAAfhwGRcYA/hwIPglghBfzD0UyMsfyz/4UM8W+FbPFssAggnJw4D6AssAyXGAGMjLBfhXzxaCEDuaygD6AstqzMly+wD4UfhI+EnwAyDCAJEw4w34UfhL+EzwAyDCAJEw4w2CCA9CQHD7AnAggBjIywX4Vs8WIfoCy2rLH4nPFsmDBvsAFBUWAHhwIIAYyMsF+EfPFlAD+gISy2rLH40H01hcmtldHBsYWNlIGNvbW1pc3Npb24gd2l0aGRyYXeDPFslz+wAAcHAggBjIywX4Ss8WUAP6AhLLassfjQbUm95YWx0eSBjb21taXNzaW9uIHdpdGhkcmF3gzxbJc/sAAC5QcmV2aW91cyBvd25lciB3aXRoZHJhdwCIcCCAGMjLBVADzxYh+gISy2rLH40J1lvdXIgdHJhbnNhY3Rpb24gaGFzIG5vdCBiZWVuIGFjY2VwdGVkLoM8WyYBA+wABEPhx+CP4cts8GQDQ+Ez4S/hJ+EjI+EfPFssfyx/4Ss8Wyx/LH/hV+FT4U/hSyPhN+gL4TvoC+E/6AvhQzxb4UfoCyx/LH8sfyx/I+FbPFvhXzxbJAckCyfhG+EX4RPhCyMoA+EPPFsoAyh/KAMwSzMzJ7VQAESCEDuaygCphIAANFnwAgHwAYAIBIB4fAgEgJCUCAWYgIQElupFds8+FbXScEDknAg4PhW+kSCwBEa8u7Z58KH0iQCwCASAiIwEYqrLbPPhI+En4S/hMLAFeqCzbPIIIQVVD+EL4U/hD+Ff4VvhR+FD4T/hH+Ej4SfhK+Ev4TPhO+E34RfhS+EYsAgEgJicCAW4qKwEdt++7Z58JvwnfCf8KPwpwLAIBICgpARGwybbPPhK+kSAsARGxlvbPPhH+kSAsARGvK22efCH9IkAsASWsre2efCvrpOCByTgQcHwr/SJALAH2+EFu3e1E0NIAAfhi+kAB+GPSAAH4ZNIfAfhl0gAB+GbUAdD6QAH4Z9MfAfho0x8B+Gn6QAH4atMfAfhr0x8w+GzUAdD6AAH4bfoAAfhu+gAB+G/6QAH4cPoAAfhx0x8B+HLTHwH4c9MfAfh00x8w+HXUMND6QAH4dvpALQAMMPh3f/hhRQVNYw==';
exports.NftAuctionCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftAuctionCodeBoc, 'base64'))[0];
//# sourceMappingURL=NftAuction.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftAuction.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftAuction.js.map
================================================
{"version":3,"file":"NftAuction.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftAuction.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AAEnH,MAAa,UAAU;IACnB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,UAAU,CACjB,OAAO,CACV,CAAC;IACN,CAAC;IAED,MAAM,CAAO,gBAAgB,CACzB,MAAsB;;YAGtB,IAAI,IAAI,GAAG,uBAAuB,CAAC,MAAM,CAAC,CAAC;YAC3C,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,0BAAkB;gBACxB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,UAAU,CACjB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,0BAAkB;gBACxB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,MAEzD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAC,EAAE,CAAC;qBACf,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,QAAQ,CAAC,QAA0B,EAAE,GAAW,EAAE,MAEvD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAC,EAAE,CAAC;qBACf,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,oBAAoB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAEnE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAC,EAAE,CAAC;qBACf,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;qBAC9C,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,oBAAoB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAInE;;YACG,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAC;YAC7B,QAAQ,CAAC,SAAS,CAAC,IAAI,EAAE,CAAC,CAAC,CAAA;YAC3B,QAAQ,CAAC,YAAY,CAAC,MAAM,CAAC,kBAAkB,CAAC,CAAA;YAChD,QAAQ,CAAC,UAAU,CAAC,MAAM,CAAC,KAAK,CAAC,CAAA;YACjC,QAAQ,CAAC,SAAS,CAAC,CAAC,EAAE,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,EAAE,GAAG,EAAE,GAAG,CAAC,GAAG,CAAC,CAAC,CAAA;YAClD,QAAQ,CAAC,QAAQ,CAAC,IAAA,oBAAS,GAAE,CAAC,SAAS,CAAC,GAAG,EAAC,EAAE,CAAC,CAAC,OAAO,EAAE,CAAC,CAAA;YAE1D,MAAM,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;YAC/B,WAAW,CAAC,SAAS,CAAC,CAAC,EAAE,CAAC,CAAC,CAAA;YAC3B,WAAW,CAAC,QAAQ,CAAC,QAAQ,CAAC,OAAO,EAAE,CAAC,CAAA;YAExC,MAAM,SAAS,GAAG,IAAA,oBAAS,GAAE,CAAC,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,mBAAmB,CAAC,CAAC,CAAC,QAAQ,CAAC,WAAW,CAAC,OAAO,EAAE,CAAC,CAAC,OAAO,EAAE,CAAA;YAEtI,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,SAAS;gBACf,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,WAAW,CAAC,QAA0B;;YACxC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA;YAEzD,oBAAoB;YACpB,KAAK,CAAC,GAAG,EAAE,CAAA;YAEX,OAAO;gBACH,mCAAmC;gBACnC,GAAG,EAAE,KAAK,CAAC,WAAW,EAAE;gBACxB,YAAY,EAAE,KAAK,CAAC,aAAa,EAAE;gBACnC,kBAAkB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC1C,UAAU,EAAE,KAAK,CAAC,cAAc,EAAE;gBAClC,eAAe,EAAE,KAAK,CAAC,cAAc,EAAE;gBACvC,aAAa,EAAE,KAAK,CAAC,aAAa,EAAE;gBACpC,cAAc,EAAE,KAAK,CAAC,cAAc,EAAE;gBACtC,OAAO,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC9B,qBAAqB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC7C,oBAAoB,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC3C,kBAAkB,EAAE,KAAK,CAAC,aAAa,EAAE;gBACzC,cAAc,EAAE,KAAK,CAAC,cAAc,EAAE;gBACtC,aAAa,EAAE,KAAK,CAAC,aAAa,EAAE;gBACpC,WAAW,EAAE,KAAK,CAAC,aAAa,EAAE;gBAClC,MAAM,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC7B,MAAM,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC7B,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,UAAU,EAAE,KAAK,CAAC,aAAa,EAAE;aACpC,CAAA;QACL,CAAC;KAAA;CACJ;AAxID,gCAwIC;AAgCD,SAAgB,uBAAuB,CAAC,IAAoB;IAExD,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC5B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,qBAAqB,CAAC,CAAA,CAAM,cAAc;IACrE,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,oBAAoB,EAAE,EAAE,CAAC,CAAA,CAAe,gBAAgB;IAChF,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,kBAAkB,EAAE,EAAE,CAAC,CAAA,CAAG,cAAc;IAChE,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA,CAAE,mBAAmB;IAC/D,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,EAAE,EAAE,CAAC,CAAA,CAAc,qBAAqB;IAC7E,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,WAAW,EAAE,EAAE,CAAC,CAAA,CAAG,mBAAmB;IAG9D,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC5B,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,MAAM,CAAC,CAAA,CAAO,UAAU;IACjD,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,MAAM,CAAC,CAAA,CAAO,UAAU;IACjD,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,OAAO,CAAC,CAAA,CAAO,WAAW;IACnD,QAAQ,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,CAAC,CAAC,EAAC,CAAC,CAAC,CAAC,CAAC,CAAA,CAAQ,cAAc;IAC9D,QAAQ,CAAC,UAAU,CAAC,CAAC,CAAC,CAAA,CAAO,WAAW;IACxC,QAAQ,CAAC,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC,CAAA,CAAC,cAAc;IACxC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,YAAY,EAAE,EAAE,CAAC,CAAA,CAAI,WAAW;IACxD,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA,CAAe,YAAY;IACvE,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,kBAAkB,EAAE,EAAE,CAAC,CAAA,CAAe,gBAAgB;IAG9E,IAAI,OAAO,GAAG,IAAA,oBAAS,GAAE,CAAC;IAC1B,IAAI,IAAI,CAAC,eAAe,EAAE;QACtB,OAAO,CAAC,YAAY,CAAC,IAAI,CAAC,eAAe,CAAC,CAAA;KAC7C;SAAM;QACH,OAAO,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAA;KAC3C;IACD,OAAO,CAAC,YAAY,CAAC,IAAI,CAAC,UAAU,CAAC,CAAA,CAAU,WAAW;IAG1D,MAAM,OAAO,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC3B,OAAO,CAAC,QAAQ,CAAC,IAAI,CAAC,GAAG,CAAC,CAAA,CAAK,OAAO;IACtC,OAAO,CAAC,YAAY,CAAC,IAAI,CAAC,kBAAkB,CAAC,CAAA,CAAG,UAAU;IAC1D,OAAO,CAAC,QAAQ,CAAC,IAAI,CAAC,SAAS,CAAC,CAAA,CAAI,YAAY;IAChD,OAAO,CAAC,SAAS,CAAC,IAAI,CAAC,kBAAkB,EAAE,EAAE,CAAC,CAAA;IAC9C,OAAO,CAAC,QAAQ,CAAC,KAAK,CAAC,CAAA,CAAC,cAAc;IACtC,OAAO,CAAC,QAAQ,CAAC,QAAQ,CAAC,OAAO,EAAE,CAAC,CAAA;IACpC,OAAO,CAAC,QAAQ,CAAC,QAAQ,CAAC,OAAO,EAAE,CAAC,CAAA;IACpC,OAAO,CAAC,QAAQ,CAAC,OAAO,CAAC,OAAO,EAAE,CAAC,CAAA;IAEnC,OAAO,OAAO,CAAC,OAAO,EAAE,CAAA;AAC5B,CAAC;AA3CD,0DA2CC;AAED,mBAAmB;AAEN,QAAA,iBAAiB,GAAG,kvEAAkvE,CAAA;AAEtwE,QAAA,kBAAkB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,yBAAiB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftAuctionV2.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftAuctionV2.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftAuctionV2CodeCell = exports.NftAuctionV2CodeBoc = exports.buildNftAuctionV2DataCell = exports.NftAuctionV2 = void 0;
const ton_core_1 = require("ton-core");
class NftAuctionV2 {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftAuctionV2(address);
    }
    // createFromConfig
    static createFromConfig(config) {
        let data = buildNftAuctionV2DataCell(config);
        let address = (0, ton_core_1.contractAddress)(0, {
            code: exports.NftAuctionV2CodeCell,
            data: data
        });
        return new NftAuctionV2(address, 0, {
            code: exports.NftAuctionV2CodeCell,
            data: data
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendCancel(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0, 32)
                    .storeBuffer(Buffer.from('cancel'))
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendStop(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0, 32)
                    .storeBuffer(Buffer.from('cancel'))
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getSaleData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_sale_data', []);
            // pops out saleType
            stack.pop();
            return {
                // saleType: stack.readBigNumber(),
                end: stack.readBigNumber(),
                endTimestamp: stack.readBigNumber(),
                marketplaceAddress: stack.readAddressOpt(),
                nftAddress: stack.readAddressOpt(),
                nftOwnerAddress: stack.readAddressOpt(),
                lastBidAmount: stack.readBigNumber(),
                lastBidAddress: stack.readAddressOpt(),
                minStep: stack.readBigNumber(),
                marketplaceFeeAddress: stack.readAddressOpt(),
                marketplaceFeeFactor: stack.readBigNumber(),
                marketplaceFeeBase: stack.readBigNumber(),
                royaltyAddress: stack.readAddressOpt(),
                royaltyFactor: stack.readBigNumber(),
                royaltyBase: stack.readBigNumber(),
                maxBid: stack.readBigNumber(),
                minBid: stack.readBigNumber(),
                createdAt: stack.readBigNumber(),
                lastBidAt: stack.readBigNumber(),
                isCanceled: stack.readBigNumber(),
            };
        });
    }
}
exports.NftAuctionV2 = NftAuctionV2;
function buildNftAuctionV2DataCell(data) {
    const constantCell = (0, ton_core_1.beginCell)();
    const subGasPriceFromBid = 8449000;
    constantCell.storeUint(subGasPriceFromBid, 32);
    constantCell.storeAddress(data.marketplaceAddress);
    constantCell.storeCoins(data.minBid);
    constantCell.storeCoins(data.maxBid);
    constantCell.storeCoins(data.minStep);
    constantCell.storeUint(data.stepTimeSeconds, 32); // step_time
    constantCell.storeAddress(data.nftAddress);
    constantCell.storeUint(data.createdAtTimestamp, 32);
    const feesCell = (0, ton_core_1.beginCell)();
    feesCell.storeAddress(data.marketplaceFeeAddress); // mp_fee_addr
    feesCell.storeUint(data.marketplaceFeeFactor, 32); // mp_fee_factor
    feesCell.storeUint(data.marketplaceFeeBase, 32); // mp_fee_base
    feesCell.storeAddress(data.royaltyAddress); // royalty_fee_addr
    feesCell.storeUint(data.royaltyFactor, 32); // royalty_fee_factor
    feesCell.storeUint(data.royaltyBase, 32); // royalty_fee_base
    const storage = (0, ton_core_1.beginCell)();
    storage.storeBit(data.end); // end?
    storage.storeBit(data.activated); // activated
    storage.storeBit(false); // is_canceled
    storage.storeBuffer(Buffer.from([0, 0])); // last_member
    storage.storeCoins(0); // last_bid
    storage.storeUint(0, 32); // last_bid_at
    storage.storeUint(data.endTimestamp, 32); // end_time
    if (data.nftOwnerAddress) {
        storage.storeAddress(data.nftOwnerAddress);
    }
    else {
        storage.storeBuffer(Buffer.from([0, 0]));
    }
    storage.storeRef(feesCell.endCell());
    storage.storeRef(constantCell.endCell());
    return storage.endCell();
}
exports.buildNftAuctionV2DataCell = buildNftAuctionV2DataCell;
// Data
exports.NftAuctionV2CodeBoc = 'te6cckECHQEABZMAART/APSkE/S88sgLAQIBIAIDAgFIBAUCKPIw2zyBA+74RMD/8vL4AH/4ZNs8GxwCAs4GBwKLoDhZtnm2eQQQgqqH8IXwofCH8KfwpfCd8JvwmfCX8JXwi/Cf8IwaIiYaGCIkGBYiIhYUIiAUIT4hHCD6INggtiD0INIgsRsaAgEgCAkCASAYGQT1AHQ0wMBcbDyQPpAMNs8+ELA//hDUiDHBbCO0DMx0x8hwACNBJyZXBlYXRfZW5kX2F1Y3Rpb26BSIMcFsI6DW9s84DLAAI0EWVtZXJnZW5jeV9tZXNzYWdlgUiDHBbCa1DDQ0wfUMAH7AOAw4PhTUhDHBY6EMzHbPOABgGxIKCwATIIQO5rKAAGphIAFcMYED6fhS10nCAvLygQPqAdMfghAFE42REroS8vSAQNch+kAw+HJw+GJ/+GTbPBwEhts8IMABjzgwgQPt+CP4UL7y8oED7fhCwP/y8oED8AKCEDuaygC5EvLy+FJSEMcF+ENSIMcFsfLhkwF/2zzbPOAgwAIMFQ0OAIwgxwDA/5IwcODTHzGLZjYW5jZWyCHHBZIwceCLRzdG9wghxwWSMHLgi2ZmluaXNoghxwWSMHLgi2ZGVwbG95gBxwWRc+BwAYpwIPglghBfzD0UyMsfyz/4Us8WUAPPFhLLACH6AssAyXGAGMjLBfhTzxZw+gLLasyCCA9CQHD7AsmDBvsAf/hif/hm2zwcBPyOwzAygQPt+ELA//LygQPwAYIQO5rKALny8vgj+FC+jhf4UlIQxwX4Q1IgxwWx+E1SIMcFsfLhk5n4UlIQxwXy4ZPi2zzgwAOSXwPg+ELA//gj+FC+sZdfA4ED7fLw4PhLghA7msoAoFIgvvhLwgCw4wL4UPhRofgjueMA+E4SDxARAiwCcNs8IfhtghA7msoAofhu+CP4b9s8FRIADvhQ+FGg+HADcI6VMoED6PhKUiC58vL4bvht+CP4b9s84fhO+EygUiC5l18DgQPo8vDgAnDbPAH4bfhu+CP4b9s8HBUcApT4TsAAjj1wIPglghBfzD0UyMsfyz/4Us8WUAPPFhLLACH6AssAyXGAGMjLBfhTzxZw+gLLasyCCA9CQHD7AsmDBvsA4w5/+GLbPBMcAvrbPPhOQFTwAyDCAI4rcCCAEMjLBVAHzxYi+gIWy2oVyx+L9NYXJrZXRwbGFjZSBmZWWM8WyXL7AJE04vhOQAPwAyDCAI4jcCCAEMjLBVAEzxYi+gITy2oSyx+LdSb3lhbHR5jPFsly+wCRMeKCCA9CQHD7AvhOWKEBoSDCABoUAMCOInAggBDIywX4Us8WUAP6AhLLassfi2UHJvZml0jPFsly+wCRMOJwIPglghBfzD0UyMsfyz/4Tc8WUAPPFhLLAIIImJaA+gLLAMlxgBjIywX4U88WcPoCy2rMyYMG+wAC8vhOwQGRW+D4TvhHoSKCCJiWgKFSELyZMAGCCJiWgKEBkTLijQpWW91ciBiaWQgaGFzIGJlZW4gb3V0YmlkIGJ5IGFub3RoZXIgdXNlci6ABwP+OHzCNBtBdWN0aW9uIGhhcyBiZWVuIGNhbmNlbGxlZC6DeIcIA4w8WFwA4cCCAGMjLBfhNzxZQBPoCE8tqEssfAc8WyXL7AAACWwARIIQO5rKAKmEgAB0IMAAk18DcOBZ8AIB8AGAAIPhI0PpA0x/TH/pA0x/THzAAyvhBbt3tRNDSAAH4YtIAAfhk0gAB+Gb6QAH4bfoAAfhu0x8B+G/THwH4cPpAAfhy1AH4aNQw+Gn4SdDSHwH4Z/pAAfhj+gAB+Gr6AAH4a/oAAfhs0x8B+HH6QAH4c9MfMPhlf/hhAFT4SfhI+FD4T/hG+ET4QsjKAMoAygD4Tc8W+E76Assfyx/4Us8WzMzJ7VQBqlR8';
exports.NftAuctionV2CodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftAuctionV2CodeBoc, 'base64'))[0];
//# sourceMappingURL=NftAuctionV2.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftAuctionV2.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftAuctionV2.js.map
================================================
{"version":3,"file":"NftAuctionV2.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftAuctionV2.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AAEnH,MAAa,YAAY;IACrB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAGlH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,YAAY,CACnB,OAAO,CACV,CAAC;IACN,CAAC;IAED,mBAAmB;IACnB,MAAM,CAAC,gBAAgB,CACnB,MAAwB;QAExB,IAAI,IAAI,GAAG,yBAAyB,CAAC,MAAM,CAAC,CAAC;QAC7C,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;YACI,IAAI,EAAE,4BAAoB;YAC1B,IAAI,EAAE,IAAI;SACb,CACJ,CAAA;QAED,OAAO,IAAI,YAAY,CACnB,OAAO,EACP,CAAC,EACD;YACI,IAAI,EAAE,4BAAoB;YAC1B,IAAI,EAAE,IAAI;SACb,CACJ,CAAC;IACN,CAAC;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,MAEzD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAC,EAAE,CAAC;qBACf,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,QAAQ,CAAC,QAA0B,EAAE,GAAW,EAAE,MAEvD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAC,EAAE,CAAC;qBACf,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,WAAW,CAAC,QAA0B;;YACxC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA;YAEzD,oBAAoB;YACpB,KAAK,CAAC,GAAG,EAAE,CAAA;YAEX,OAAO;gBACH,mCAAmC;gBACnC,GAAG,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC1B,YAAY,EAAE,KAAK,CAAC,aAAa,EAAE;gBACnC,kBAAkB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC1C,UAAU,EAAE,KAAK,CAAC,cAAc,EAAE;gBAClC,eAAe,EAAE,KAAK,CAAC,cAAc,EAAE;gBACvC,aAAa,EAAE,KAAK,CAAC,aAAa,EAAE;gBACpC,cAAc,EAAE,KAAK,CAAC,cAAc,EAAE;gBACtC,OAAO,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC9B,qBAAqB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC7C,oBAAoB,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC3C,kBAAkB,EAAE,KAAK,CAAC,aAAa,EAAE;gBACzC,cAAc,EAAE,KAAK,CAAC,cAAc,EAAE;gBACtC,aAAa,EAAE,KAAK,CAAC,aAAa,EAAE;gBACpC,WAAW,EAAE,KAAK,CAAC,aAAa,EAAE;gBAClC,MAAM,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC7B,MAAM,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC7B,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,UAAU,EAAE,KAAK,CAAC,aAAa,EAAE;aACpC,CAAA;QACL,CAAC;KAAA;CACJ;AAnGD,oCAmGC;AAiCD,SAAgB,yBAAyB,CAAC,IAAsB;IAE5D,MAAM,YAAY,GAAG,IAAA,oBAAS,GAAE,CAAA;IAChC,MAAM,kBAAkB,GAAG,OAAO,CAAA;IAClC,YAAY,CAAC,SAAS,CAAC,kBAAkB,EAAE,EAAE,CAAC,CAAC;IAC/C,YAAY,CAAC,YAAY,CAAC,IAAI,CAAC,kBAAkB,CAAC,CAAC;IACnD,YAAY,CAAC,UAAU,CAAC,IAAI,CAAC,MAAM,CAAC,CAAA;IACpC,YAAY,CAAC,UAAU,CAAC,IAAI,CAAC,MAAM,CAAC,CAAA;IACpC,YAAY,CAAC,UAAU,CAAC,IAAI,CAAC,OAAO,CAAC,CAAA;IACrC,YAAY,CAAC,SAAS,CAAC,IAAI,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA,CAAC,YAAY;IAC7D,YAAY,CAAC,YAAY,CAAC,IAAI,CAAC,UAAU,CAAC,CAAC;IAC3C,YAAY,CAAC,SAAS,CAAC,IAAI,CAAC,kBAAkB,EAAE,EAAE,CAAC,CAAA;IAEnD,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC5B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,qBAAqB,CAAC,CAAA,CAAM,cAAc;IACrE,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,oBAAoB,EAAE,EAAE,CAAC,CAAA,CAAe,gBAAgB;IAChF,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,kBAAkB,EAAE,EAAE,CAAC,CAAA,CAAG,cAAc;IAChE,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA,CAAE,mBAAmB;IAC/D,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,EAAE,EAAE,CAAC,CAAA,CAAc,qBAAqB;IAC7E,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,WAAW,EAAE,EAAE,CAAC,CAAA,CAAG,mBAAmB;IAG9D,MAAM,OAAO,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC3B,OAAO,CAAC,QAAQ,CAAC,IAAI,CAAC,GAAG,CAAC,CAAA,CAAC,OAAO;IAClC,OAAO,CAAC,QAAQ,CAAC,IAAI,CAAC,SAAS,CAAC,CAAA,CAAC,YAAY;IAC7C,OAAO,CAAC,QAAQ,CAAC,KAAK,CAAC,CAAA,CAAC,cAAc;IACtC,OAAO,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAA,CAAQ,cAAc;IAC9D,OAAO,CAAC,UAAU,CAAC,CAAC,CAAC,CAAA,CAAO,WAAW;IACvC,OAAO,CAAC,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC,CAAA,CAAC,cAAc;IACvC,OAAO,CAAC,SAAS,CAAC,IAAI,CAAC,YAAY,EAAE,EAAE,CAAC,CAAA,CAAI,WAAW;IACvD,IAAI,IAAI,CAAC,eAAe,EAAE;QACtB,OAAO,CAAC,YAAY,CAAC,IAAI,CAAC,eAAe,CAAC,CAAA;KAC7C;SAAM;QACH,OAAO,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAA;KAC3C;IACD,OAAO,CAAC,QAAQ,CAAC,QAAQ,CAAC,OAAO,EAAE,CAAC,CAAA;IACpC,OAAO,CAAC,QAAQ,CAAC,YAAY,CAAC,OAAO,EAAE,CAAC,CAAA;IAExC,OAAO,OAAO,CAAC,OAAO,EAAE,CAAA;AAC5B,CAAC;AAvCD,8DAuCC;AAED,OAAO;AAEM,QAAA,mBAAmB,GAAG,s4DAAs4D,CAAA;AAE55D,QAAA,oBAAoB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,2BAAmB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftCollection.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftCollection.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftCollectionCodeCell = exports.NftCollectionCodeBoc = exports.buildNftCollectionDataCell = exports.NftCollection = exports.OperationCodes = void 0;
const ton_core_1 = require("ton-core");
const OffchainContent_1 = require("../../types/OffchainContent");
exports.OperationCodes = {
    Mint: 1,
    BatchMint: 2,
    ChangeOwner: 3,
    EditContent: 4,
    GetRoyaltyParams: 0x693d3950,
    GetRoyaltyParamsResponse: 0xa8cb00ad
};
class NftCollection {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftCollection(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftCollectionDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftCollectionCodeCell,
                data: data
            });
            return new NftCollection(address, 0, {
                code: exports.NftCollectionCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendMint(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let itemContent = (0, ton_core_1.beginCell)();
            // itemContent.bits.writeString(params.itemContent)
            itemContent.storeBuffer(Buffer.from(params.itemContent)).endCell();
            let nftItemMessage = (0, ton_core_1.beginCell)();
            nftItemMessage.storeAddress(params.itemOwnerAddress);
            nftItemMessage.storeRef(itemContent).endCell();
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(1, 32)
                    .storeUint(params.queryId || 0, 64)
                    .storeUint(params.itemIndex, 64)
                    .storeCoins(params.passAmount)
                    .storeRef(nftItemMessage)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendChangeOwner(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(exports.OperationCodes.ChangeOwner, 32)
                    .storeUint(params.queryId || 0, 64)
                    .storeAddress(params.newOwner)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY
            });
        });
    }
    sendRoyaltyParams(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(exports.OperationCodes.GetRoyaltyParams, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY
            });
        });
    }
    // const { stack } = await provider.get('get_nft_address_by_index', [
    //     { type: 'int', value: index }
    // ])
    getCollectionData(provider, nextItemIndex, collectionContent, ownerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_collection_data', [
                { type: 'int', value: nextItemIndex },
                { type: 'cell', cell: collectionContent },
                { type: 'slice', cell: ownerAddress.asCell() }
            ]);
            return {
                next_item_index: stack.readBigNumber(),
                collectionContent: stack.readCellOpt(),
                owner_address: stack.readAddressOpt(),
            };
        });
    }
    getNftAddressByIndex(provider, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_nft_address_by_index', [
                { type: 'int', value: index }
            ]);
            return {
                nftAddress: stack.readAddressOpt(),
            };
        });
    }
    getNftContent(provider, index, individualContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_nft_content', [
                { type: 'int', value: index },
                { type: 'cell', cell: individualContent }
            ]);
            return {
                fullContent: stack.readCellOpt(),
            };
        });
    }
}
exports.NftCollection = NftCollection;
// default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
// storage#_ owner_address:MsgAddress next_item_index:uint64
//           ^[collection_content:^Cell common_content:^Cell]
//           nft_item_code:^Cell
//           royalty_params:^RoyaltyParams
//           = Storage;
function buildNftCollectionDataCell(data) {
    let dataCell = (0, ton_core_1.beginCell)();
    dataCell.storeAddress(data.ownerAddress);
    dataCell.storeUint(data.nextItemIndex, 64);
    let contentCell = (0, ton_core_1.beginCell)();
    let collectionContent = (0, OffchainContent_1.encodeOffChainContent)(data.collectionContent);
    let commonContent = (0, ton_core_1.beginCell)();
    commonContent.storeBuffer(Buffer.from(data.commonContent));
    // commonContent.bits.writeString(data.commonContent)
    contentCell.storeRef(collectionContent);
    contentCell.storeRef(commonContent);
    dataCell.storeRef(contentCell);
    dataCell.storeRef(data.nftItemCode);
    let royaltyCell = (0, ton_core_1.beginCell)();
    royaltyCell.storeUint(data.royaltyParams.royaltyFactor, 16);
    royaltyCell.storeUint(data.royaltyParams.royaltyBase, 16);
    royaltyCell.storeAddress(data.royaltyParams.royaltyAddress);
    dataCell.storeRef(royaltyCell);
    return dataCell.endCell();
}
exports.buildNftCollectionDataCell = buildNftCollectionDataCell;
// Data
exports.NftCollectionCodeBoc = 'te6cckECFAEAAh8AART/APSkE/S88sgLAQIBYgkCAgEgBAMAJbyC32omh9IGmf6mpqGC3oahgsQCASAIBQIBIAcGAC209H2omh9IGmf6mpqGAovgngCOAD4AsAAvtdr9qJofSBpn+pqahg2IOhph+mH/SAYQAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgLNDwoCASAMCwA9Ra8ARwIfAFd4AYyMsFWM8WUAT6AhPLaxLMzMlx+wCAIBIA4NABs+QB0yMsCEsoHy//J0IAAtAHIyz/4KM8WyXAgyMsBE/QA9ADLAMmAE59EGOASK3wAOhpgYC42Eit8H0gGADpj+mf9qJofSBpn+pqahhBCDSenKgpQF1HFBuvgoDoQQhUZYBWuEAIZGWCqALnixJ9AQpltQnlj+WfgOeLZMAgfYBwGyi544L5cMiS4ADxgRLgAXGBEuAB8YEYGYHgAkExIREAA8jhXU1DAQNEEwyFAFzxYTyz/MzMzJ7VTgXwSED/LwACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UAKY1cAPUMI43gED0lm+lII4pBqQggQD6vpPywY/egQGTIaBTJbvy9AL6ANQwIlRLMPAGI7qTAqQC3gSSbCHis+YwMlBEQxPIUAXPFhPLP8zMzMntVABgNQLTP1MTu/LhklMTugH6ANQwKBA0WfAGjhIBpENDyFAFzxYTyz/MzMzJ7VSSXwXiN0CayQ==';
exports.NftCollectionCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftCollectionCodeBoc, 'base64'))[0];
//# sourceMappingURL=NftCollection.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftCollection.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftCollection.js.map
================================================
{"version":3,"file":"NftCollection.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftCollection.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAA0H;AAC1H,iEAAoE;AAevD,QAAA,cAAc,GAAG;IAC1B,IAAI,EAAE,CAAC;IACP,SAAS,EAAE,CAAC;IACZ,WAAW,EAAE,CAAC;IACd,WAAW,EAAE,CAAC;IACd,gBAAgB,EAAE,UAAU;IAC5B,wBAAwB,EAAE,UAAU;CACvC,CAAA;AAED,MAAa,aAAa;IACtB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,aAAa,CACpB,OAAO,CACV,CAAC;IACN,CAAC;IAED,MAAM,CAAO,gBAAgB,CACzB,MAAyB;;YAGzB,IAAI,IAAI,GAAG,0BAA0B,CAAC,MAAM,CAAC,CAAC;YAC9C,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,6BAAqB;gBAC3B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,aAAa,CACpB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,6BAAqB;gBAC3B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,QAAQ,CAAC,QAA0B,EAAE,GAAW,EAAE,MAOvD;;YACG,IAAI,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;YAC7B,mDAAmD;YACnD,WAAW,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,MAAM,CAAC,WAAW,CAAC,CAAC,CAAC,OAAO,EAAE,CAAA;YAElE,IAAI,cAAc,GAAG,IAAA,oBAAS,GAAE,CAAA;YAEhC,cAAc,CAAC,YAAY,CAAC,MAAM,CAAC,gBAAgB,CAAC,CAAA;YACpD,cAAc,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAC,OAAO,EAAE,CAAA;YAE9C,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC;qBAChB,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,SAAS,CAAC,MAAM,CAAC,SAAS,EAAE,EAAE,CAAC;qBAC/B,UAAU,CAAC,MAAM,CAAC,UAAU,CAAC;qBAC7B,QAAQ,CAAC,cAAc,CAAC;qBACxB,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,eAAe,CAAC,QAA0B,EAAE,GAAW,EAAE,MAI9D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,sBAAc,CAAC,WAAW,EAAE,EAAE,CAAC;qBACzC,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,YAAY,CAAC,MAAM,CAAC,QAAQ,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,iBAAiB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGhE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,sBAAc,CAAC,gBAAgB,EAAE,EAAE,CAAC;qBAC9C,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAED,qEAAqE;IACrE,oCAAoC;IACpC,KAAK;IAEC,iBAAiB,CACnB,QAA0B,EAC1B,aAAqB,EACrB,iBAAuB,EACvB,YAAmB;;YAEnB,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,qBAAqB,EAAE;gBACxD,EAAE,IAAI,EAAE,KAAK,EAAE,KAAK,EAAE,aAAa,EAAE;gBACrC,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,iBAAiB,EAAE;gBACzC,EAAE,IAAI,EAAE,OAAO,EAAE,IAAI,EAAE,YAAY,CAAC,MAAM,EAAE,EAAE;aACjD,CAAC,CAAA;YACF,OAAO;gBACH,eAAe,EAAE,KAAK,CAAC,aAAa,EAAE;gBACtC,iBAAiB,EAAE,KAAK,CAAC,WAAW,EAAE;gBACtC,aAAa,EAAE,KAAK,CAAC,cAAc,EAAE;aACxC,CAAA;QACL,CAAC;KAAA;IAEK,oBAAoB,CACtB,QAA0B,EAC1B,KAAa;;YAEb,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,0BAA0B,EAAE;gBAC7D,EAAE,IAAI,EAAE,KAAK,EAAE,KAAK,EAAE,KAAK,EAAE;aAChC,CAAC,CAAA;YACF,OAAO;gBACH,UAAU,EAAE,KAAK,CAAC,cAAc,EAAE;aACrC,CAAA;QACL,CAAC;KAAA;IAEK,aAAa,CACf,QAA0B,EAC1B,KAAa,EACb,iBAAuB;;YAEvB,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,iBAAiB,EAAE;gBACpD,EAAE,IAAI,EAAE,KAAK,EAAE,KAAK,EAAE,KAAK,EAAE;gBAC7B,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,iBAAiB,EAAE;aAC5C,CAAC,CAAA;YACF,OAAO;gBACH,WAAW,EAAE,KAAK,CAAC,WAAW,EAAE;aACnC,CAAA;QACL,CAAC;KAAA;CAEJ;AAvJD,sCAuJC;AAaD,kGAAkG;AAClG,4DAA4D;AAC5D,6DAA6D;AAC7D,gCAAgC;AAChC,0CAA0C;AAC1C,uBAAuB;AAEvB,SAAgB,0BAA0B,CAAC,IAAuB;IAC9D,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,YAAY,CAAC,CAAA;IACxC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,EAAE,EAAE,CAAC,CAAA;IAE1C,IAAI,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE7B,IAAI,iBAAiB,GAAG,IAAA,uCAAqB,EAAC,IAAI,CAAC,iBAAiB,CAAC,CAAA;IAErE,IAAI,aAAa,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC/B,aAAa,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,aAAa,CAAC,CAAC,CAAA;IAC1D,qDAAqD;IAErD,WAAW,CAAC,QAAQ,CAAC,iBAAiB,CAAC,CAAA;IACvC,WAAW,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAA;IACnC,QAAQ,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAA;IAE9B,QAAQ,CAAC,QAAQ,CAAC,IAAI,CAAC,WAAW,CAAC,CAAA;IAEnC,IAAI,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC7B,WAAW,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,CAAC,aAAa,EAAE,EAAE,CAAC,CAAA;IAC3D,WAAW,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,CAAC,WAAW,EAAE,EAAE,CAAC,CAAA;IACzD,WAAW,CAAC,YAAY,CAAC,IAAI,CAAC,aAAa,CAAC,cAAc,CAAC,CAAA;IAC3D,QAAQ,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAA;IAE9B,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AA3BD,gEA2BC;AAED,OAAO;AAEM,QAAA,oBAAoB,GAAG,8uBAA8uB,CAAA;AAErwB,QAAA,qBAAqB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,4BAAoB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftFixedPrice.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftFixedPrice.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftFixPriceSaleCodeCell = exports.NftFixPriceSaleCodeBoc = exports.buildNftFixPriceSaleDataCell = exports.NftFixedPrice = void 0;
const ton_core_1 = require("ton-core");
class NftFixedPrice {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftFixedPrice(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftFixPriceSaleDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftFixPriceSaleCodeCell,
                data: data
            });
            return new NftFixedPrice(address, 0, {
                code: exports.NftFixPriceSaleCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    getSaleData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_sale_data', []);
            return {
                marketplaceAddress: stack.readAddressOpt(),
                nftAddress: stack.readAddressOpt(),
                nftOwnerAddress: stack.readAddressOpt(),
                fullPrice: stack.readBigNumber(),
                marketplaceFeeAddress: stack.readAddressOpt(),
                marketplaceFee: stack.readBigNumber(),
                royaltyAddress: stack.readAddressOpt(),
                royaltyAmount: stack.readBigNumber()
            };
        });
    }
}
exports.NftFixedPrice = NftFixedPrice;
function buildNftFixPriceSaleDataCell(data) {
    let feesCell = (0, ton_core_1.beginCell)();
    feesCell.storeCoins(data.marketplaceFee);
    feesCell.storeAddress(data.marketplaceFeeAddress);
    feesCell.storeAddress(data.royaltyAddress);
    feesCell.storeCoins(data.royaltyAmount);
    let dataCell = (0, ton_core_1.beginCell)();
    dataCell.storeAddress(data.marketplaceAddress);
    dataCell.storeAddress(data.nftAddress);
    dataCell.storeAddress(data.nftOwnerAddress);
    dataCell.storeCoins(data.fullPrice);
    dataCell.storeRef(feesCell);
    return dataCell.endCell();
}
exports.buildNftFixPriceSaleDataCell = buildNftFixPriceSaleDataCell;
// Data
exports.NftFixPriceSaleCodeBoc = 'te6cckECCgEAAbIAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEADegOFnaiaH0gfSB9IH0AahhofQB9IH0gfQAYCBHAgLNCAYB99G8EIHc1lACkgUCkQX3lw4QFofQB9IH0gfQAYOEAIZGWCqATniyi6UJDQqFrQilAK/QEK5bVkuP2AOEAIZGWCrGeLKAP9AQtltWS4/YA4QAhkZYKsZ4ssfQFltWS4/YA4EEEIL+YeihDADGRlgqgC54sRfQEKZbUJ5Y+JwHAC7LPyPPFlADzxYSygAh+gLKAMmBAKD7AAH30A6GmBgLjYSS+CcH0gGHaiaH0gfSB9IH0AahgRa6ThAVnHHZkbGymQ44LJL4NwKJFjgvlw+gFpj8EIAonGyIldeXD66Z+Y/SAYIBpkKALniygB54sA54sA/QFmZPaqcBNjgEybCBsimYI4eAJwA2mP6Z+YEOAAyS+FcBDAkAtsACmjEQRxA2RUAS8ATgMjQ0NDXAA449ghA7msoAE77y4clwIIIQX8w9FCGAEMjLBVAHzxYi+gIWy2oVyx8Tyz8hzxYBzxYSygAh+gLKAMmBAKD7AOBfBIQP8vCVeDe4';
exports.NftFixPriceSaleCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftFixPriceSaleCodeBoc, 'base64'))[0];
//# sourceMappingURL=NftFixedPrice.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftFixedPrice.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftFixedPrice.js.map
================================================
{"version":3,"file":"NftFixedPrice.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftFixedPrice.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AAEnH,MAAa,aAAa;IACtB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,aAAa,CACpB,OAAO,CACN,CAAC;IACV,CAAC;IAED,MAAM,CAAO,gBAAgB,CACzB,MAA2B;;YAG3B,IAAI,IAAI,GAAG,4BAA4B,CAAC,MAAM,CAAC,CAAC;YAChD,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,+BAAuB;gBAC7B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,aAAa,CACpB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,+BAAuB;gBAC7B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,WAAW,CAAC,QAA0B;;YACxC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA;YACzD,OAAO;gBACH,kBAAkB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC1C,UAAU,EAAE,KAAK,CAAC,cAAc,EAAE;gBAClC,eAAe,EAAE,KAAK,CAAC,cAAc,EAAE;gBACvC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,qBAAqB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC7C,cAAc,EAAE,KAAK,CAAC,aAAa,EAAE;gBACrC,cAAc,EAAE,KAAK,CAAC,cAAc,EAAE;gBACtC,aAAa,EAAG,KAAK,CAAC,aAAa,EAAE;aACxC,CAAA;QACL,CAAC;KAAA;CACJ;AAxDD,sCAwDC;AAeD,SAAgB,4BAA4B,CAAC,IAAyB;IAElE,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA;IACxC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,qBAAqB,CAAC,CAAA;IACjD,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA;IAC1C,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,aAAa,CAAC,CAAA;IAEvC,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,kBAAkB,CAAC,CAAA;IAC9C,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,UAAU,CAAC,CAAA;IACtC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,eAAe,CAAC,CAAA;IAC3C,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,SAAS,CAAC,CAAA;IACnC,QAAQ,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAA;IAE3B,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AAlBD,oEAkBC;AAED,OAAO;AAEM,QAAA,sBAAsB,GAAG,0lBAA0lB,CAAA;AAEnnB,QAAA,uBAAuB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,8BAAsB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftFixedPriceV2.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftFixedPriceV2.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftFixPriceSaleV2CodeCell = exports.NftFixPriceSaleV2CodeBoc = exports.buildNftFixPriceSaleV2DataCell = exports.NftFixedPriceV2 = void 0;
const ton_core_1 = require("ton-core");
class NftFixedPriceV2 {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftFixedPriceV2(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftFixPriceSaleV2DataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftFixPriceSaleV2CodeCell,
                data: data
            });
            return new NftFixedPriceV2(address, 0, {
                code: exports.NftFixPriceSaleV2CodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendCoins(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(1, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });