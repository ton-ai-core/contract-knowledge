import { Address, toNano } from '@ton/core';
import { Proxy } from '../wrappers/Proxy';
import { compile, NetworkProvider } from '@ton/blueprint';

const COLLECTION_ADDRESS = Address.parse('EQAPkxIsDFz2sm1mQv6NIVghZD7HYmA_ld7wKtovtnMNZ9lq'); //testnet
export async function run(provider: NetworkProvider) {
    const proxy = provider.open(
        Proxy.createFromConfig(
            {
                price: toNano('30'),
                refBack: toNano('4.5'),
                collectionAddress: COLLECTION_ADDRESS,
                adminAddress: provider.sender().address as Address,
            }, await compile('Proxy')
        )
    );

    await proxy.sendDeploy(provider.sender(), toNano('0.1'));

    await provider.waitForDeploy(proxy.address);
}
