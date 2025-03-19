import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollectionV3 } from '../wrappers/NftCollectionV3';

const COLLECTION_ADDRESS = Address.parse('EQAPkxIsDFz2sm1mQv6NIVghZD7HYmA_ld7wKtovtnMNZ9lq');

export async function run(provider: NetworkProvider) {
    const nftCollection = provider.open(NftCollectionV3.createFromAddress(COLLECTION_ADDRESS));
    await nftCollection.sendDeployNftWithBaseContent(provider.sender(), 
        Address.parse('0QAULcjDZ4TK9huUxR4Vl_Tfa8JRooU3bhvPrmHJHZIPGY9d') // to address
    )
}
