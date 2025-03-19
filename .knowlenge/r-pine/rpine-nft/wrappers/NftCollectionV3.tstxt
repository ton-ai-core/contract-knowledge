import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, DictionaryValue, Sender, SendMode, toNano } from '@ton/core';
import { encodeOffChainContent } from './content';

export type CollectionMint = {
    amount: bigint;
    index: number;
    ownerAddress: Address;
    content: string;
    editorAddress?: Address;
    authorityAddress?: Address;
};

export const MintValue: DictionaryValue<CollectionMint> = {
    serialize(src, builder) {
        const nftContent = beginCell();
        nftContent.storeBuffer(Buffer.from(src.content));

        const nftMessage = beginCell();

        nftMessage.storeAddress(src.ownerAddress);
        nftMessage.storeRef(nftContent);
        nftMessage.storeAddress(src.editorAddress ?? new Address(0, Buffer.alloc(32)));
        nftMessage.storeAddress(src.authorityAddress ?? new Address(0, Buffer.alloc(32)));

        builder.storeCoins(src.amount);
        builder.storeRef(nftMessage);
    },

    parse() {
        return {
            amount: 0n,
            index: 0,
            content: '',
            ownerAddress: new Address(0, Buffer.alloc(32)),
            editorAddress: new Address(0, Buffer.alloc(32)),
            authorityAddress: new Address(0, Buffer.alloc(32))
        };
    }
};

export type RoyaltyParams = {
    royaltyFactor: number
    royaltyBase: number
    royaltyAddress: Address
}

export type NftCollectionV3Config = {
    owner: Address;
    baseContent: string;
    collectionContent: string;
    commonContent: string;
    nftCode: Cell;
    royaltyParams: RoyaltyParams;
    secondOwner: Address;
};

export function buildNftCollectionContentCell(collectionContent: string, commonContent: string): Cell {
    let contentCell = beginCell();
    
    let encodedCollectionContent = encodeOffChainContent(collectionContent);

    let commonContentCell = beginCell();
    commonContentCell.storeBuffer(Buffer.from(commonContent));

    contentCell.storeRef(encodedCollectionContent);
    contentCell.storeRef(commonContentCell.asCell());

    return contentCell.endCell();
}

export function nftCollectionV3ConfigToCell(config: NftCollectionV3Config): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeUint(0, 64)
        .storeStringRefTail(config.baseContent)
        .storeRef(buildNftCollectionContentCell(config.collectionContent, config.commonContent))
        .storeRef(config.nftCode)
        .storeRef(
            beginCell()
                .storeUint(config.royaltyParams.royaltyFactor, 16)
                .storeUint(config.royaltyParams.royaltyBase, 16)
                .storeAddress(config.royaltyParams.royaltyAddress)
            .endCell()
        )
        .storeAddress(config.secondOwner)
    .endCell();
}

export class NftCollectionV3 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftCollectionV3(address);
    }

    static createFromConfig(config: NftCollectionV3Config, code: Cell, workchain = 0) {
        const data = nftCollectionV3ConfigToCell(config);
        const init = { code, data };
        return new NftCollectionV3(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMintNft(provider: ContractProvider, via: Sender, 
        opts: {
            value: bigint;
            queryId?: number;
            itemIndex: number;
            itemOwnerAddress: Address;
            itemContent: string;
            amount: bigint;
            editorAddress?: Address;
            authorityAddress?: Address;
        }
    ) {
        const nftContent = beginCell();
        nftContent.storeBuffer(Buffer.from(opts.itemContent));

        const nftMessage = beginCell();

        nftMessage.storeAddress(opts.itemOwnerAddress);
        nftMessage.storeRef(nftContent);
        nftMessage.storeAddress(opts.editorAddress ?? via.address);
        nftMessage.storeAddress(opts.authorityAddress ?? await this.getSecondOwner(provider));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(1, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeUint(opts.itemIndex, 64)
                .storeCoins(opts.amount)
                .storeRef(nftMessage)
            .endCell(),
        });
    }

    async sendBatchMint(provider: ContractProvider, via: Sender,
        opts: {
            value?: bigint;
            queryId?: number;
            deployList: CollectionMint[];
            useNextItemIndex: boolean;
        }
    ) {
        if (opts.deployList.length > 250) {
            throw new Error('More than 250 items');
        }

        const dict = Dictionary.empty(Dictionary.Keys.Uint(64), MintValue);
        for (const nft of opts.deployList) {
            dict.set(nft.index, nft);
        }

        await provider.internal(via, {
            value: opts.value ?? toNano('0.05') * BigInt(dict.size) + toNano('0.03') * BigInt(dict.size),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(2, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeDict(dict)
                .storeInt(opts.useNextItemIndex ? 1 : 0, 2)
            .endCell(),
        });
    }

    async sendUpdateContent(provider: ContractProvider, via: Sender, baseContent: Cell, content: Cell, royaltyParams: Cell, queryId?: number) {
        await provider.internal(via, {
            value: toNano('0.02'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(4, 32)
                .storeUint(queryId ?? 0, 64)
                .storeRef(baseContent)
                .storeRef(content)
                .storeRef(royaltyParams)
            .endCell(),
        });
    }

    async sendWithdrawTons(provider: ContractProvider, via: Sender, queryId?: number) {
        await provider.internal(via, {
            value: toNano('0.02'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(5, 32)
                .storeUint(queryId ?? 0, 64)
            .endCell()
        });
    }

    async sendChangeSecondOwner(provider: ContractProvider, via: Sender, newSecondOwner: Address, queryId?: number) {
        await provider.internal(via, {
            value: toNano('0.02'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(6, 32)
                .storeUint(queryId ?? 0, 64)
                .storeAddress(newSecondOwner)
            .endCell()
        });
    }

    async sendDeployNftWithBaseContent(provider: ContractProvider, via: Sender, toAddress: Address, queryId?: number) {
        await provider.internal(via, {
            value: toNano('0.07'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(7, 32)
                .storeUint(queryId ?? 0, 64)
                .storeAddress(toAddress)
            .endCell()
        });
    }

    async sendWithdrawJettons(provider: ContractProvider, via: Sender, from: Address, amount: bigint, dest: Address, queryId?: number) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x768a50b2, 32)
                .storeUint(queryId ?? 0, 64)
                .storeAddress(from)
                .storeCoins(amount)
                .storeAddress(dest)
                .storeMaybeRef(null)
            .endCell(),
            value: toNano('0.1')
        });
    }

    async sendAnyMessage(provider: ContractProvider, via: Sender, message: Cell, value: bigint, queryId?: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xab69babf, 32)
                .storeUint(queryId ?? 0, 64)
                .storeRef(message)
            .endCell()
        });
    }

    async getNftAddressByIndex(provider: ContractProvider, index: bigint): Promise<Address> {
        const result = await provider.get('get_nft_address_by_index', [{ type: 'int', value: index }]);
        return result.stack.readAddress();
    }

    async getSecondOwner(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('get_second_owner_address', []);
        return result.stack.readAddress();
    }
}
