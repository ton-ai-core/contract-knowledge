import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';

export type NftItemConfig = {};

export function nftItemConfigToCell(config: NftItemConfig): Cell {
    return beginCell().endCell();
}

export class NftItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftItem(address);
    }

    static createFromConfig(config: NftItemConfig, code: Cell, workchain = 0) {
        const data = nftItemConfigToCell(config);
        const init = { code, data };
        return new NftItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendEditContent(provider: ContractProvider, via: Sender, newContent: Cell, newAuthority?: Address, newRevokedAt?: number, queryId?: number) {
        let body = beginCell()
            .storeUint(0x1a0b9d51, 32)
            .storeUint(queryId ?? 0, 64)
            .storeRef(newContent)

        if (newAuthority !== undefined) {
            body.storeAddress(newAuthority);
        }
            
        if (newRevokedAt !== undefined) {
            body.storeUint(newRevokedAt, 32);
        }
        await provider.internal(via, {
            value: toNano('0.02'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: body.endCell(),
        });
    }
}
