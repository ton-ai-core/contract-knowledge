import { Address, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { NftCollectionV3 } from '../wrappers/NftCollectionV3';

const COLLECTION_ADDRESS = Address.parse('EQAPkxIsDFz2sm1mQv6NIVghZD7HYmA_ld7wKtovtnMNZ9lq');

export async function run(provider: NetworkProvider) {
    const nftCollectionV3 = provider.open(
        NftCollectionV3.createFromAddress(COLLECTION_ADDRESS)
    );

    const secondOwnerAddress = await nftCollectionV3.getSecondOwner();

    await nftCollectionV3.sendMintNft(provider.sender(), {
        value: toNano('0.07'),
        queryId: 0,
        itemIndex: 1,
        itemOwnerAddress: Address.parse('0QAULcjDZ4TK9huUxR4Vl_Tfa8JRooU3bhvPrmHJHZIPGY9d'),
        itemContent:
            'https://raw.githubusercontent.com/r-pine/rpine-nft/master/scripts/forest-collection/items/json/6.json',
        amount: toNano('0.05'),
        editorAddress: provider.sender().address as Address,
        authorityAddress: secondOwnerAddress,
    });
}