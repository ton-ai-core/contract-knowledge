import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';

export type ProxyData = {
    price: bigint
    refBack: bigint
    collectionAddress: Address
    adminAddress: Address
};

export function proxyConfigToCell(config: ProxyData): Cell {
    return beginCell()
        .storeCoins(config.price)
        .storeCoins(config.refBack)
        .storeAddress(config.collectionAddress)
        .storeAddress(config.adminAddress)
    .endCell();
}

export class Proxy implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Proxy(address);
    }

    static createFromConfig(config: ProxyData, code: Cell, workchain = 0) {
        const data = proxyConfigToCell(config);
        const init = { code, data };
        return new Proxy(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendBuy(provider: ContractProvider, via: Sender, value: bigint, refAddress?: Address, queryId?: number) {
        let body = beginCell()
            .storeUint(0xaf750d34, 32)
            .storeUint(queryId ?? 0, 64)

        if (!!refAddress) {
            body.storeAddress(refAddress || null)
        }
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: body.endCell(),
        });
    }

    async sendSetPrice(provider: ContractProvider, via: Sender, newPrice: bigint, queryId?: number) {
        await provider.internal(via, {
            value: toNano('0.02'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xf990365, 32)
                .storeUint(queryId ?? 0, 64)
                .storeCoins(newPrice)
            .endCell(),
        });
    }

    async sendSetRefBack(provider: ContractProvider, via: Sender, newRefBack: bigint, queryId?: number) {
        await provider.internal(via, {
            value: toNano('0.02'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x260af380, 32)
                .storeUint(queryId ?? 0, 64)
                .storeCoins(newRefBack)
            .endCell(),
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

    async sendWithdrawTons(provider: ContractProvider, via: Sender, dest: Address, queryId?: number) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x6d8e5e3c, 32)
                .storeUint(queryId ?? 0, 64)
                .storeAddress(dest)
            .endCell(),
            value: toNano('0.02')
        })
    }

    async getStorageData(provider: ContractProvider): Promise<ProxyData> {
        const res = (await provider.get('get_storage_data', [])).stack
        return {
            price: res.readBigNumber(),
            refBack: res.readBigNumber(),
            collectionAddress: res.readAddress(),
            adminAddress: res.readAddress()
        }
    }
}
