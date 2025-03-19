import { Address, toNano } from '@ton/core';
import { NftCollectionV3 } from '../wrappers/NftCollectionV3';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftCollectionV3 = provider.open(
        NftCollectionV3.createFromConfig(
            {
                owner: provider.sender().address as Address,
                baseContent: 'https://raw.githubusercontent.com/r-pine/rpine-nft/master/scripts/forest-collection/items/json/',
                collectionContent: 'https://raw.githubusercontent.com/r-pine/rpine-nft/master/scripts/forest-collection/collection_mdata.json',
                commonContent: '',
                nftCode: await compile('NftItem'),
                royaltyParams: {
                    royaltyFactor: 5,
                    royaltyBase: 100,
                    royaltyAddress: provider.sender().address as Address,
                },
                secondOwner: provider.sender().address as Address //Address.parse('')
            }, 
            await compile('NftCollectionV3')
        )
    );

    await nftCollectionV3.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftCollectionV3.address);

    // run methods on `nftCollectionV3`
}
