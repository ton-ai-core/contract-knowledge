import { Address, toNano } from '@ton/core';
import { Proxy } from '../wrappers/Proxy';
import { NetworkProvider } from '@ton/blueprint';

const PROXY_ADDRESS = Address.parse('EQC7mq3O8EvQlUVyy3FPqOMEaD7qXyA9tEW7pnSedpnqhv54');

export async function run(provider: NetworkProvider) {
    const proxy = provider.open(
        Proxy.createFromAddress(PROXY_ADDRESS)
    );
    const DEST_ADDRESS = provider.sender().address as Address; //Address.parse('');
    await proxy.sendWithdrawTons(provider.sender(), DEST_ADDRESS);
}


