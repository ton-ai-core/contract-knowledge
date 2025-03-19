import { Address, toNano } from '@ton/core';
import { Proxy } from '../wrappers/Proxy';
import { NetworkProvider } from '@ton/blueprint';

const PROXY_ADDRESS = Address.parse('EQDk5MCKONMMwXSJc6ZmnfwVmyVgt4-qfvumIK2aUlesQhVP');
export async function run(provider: NetworkProvider) {
    const proxy = provider.open(
        Proxy.createFromAddress(PROXY_ADDRESS)
    );

    await proxy.sendBuy(provider.sender(), toNano('30'), provider.sender().address as Address);
}