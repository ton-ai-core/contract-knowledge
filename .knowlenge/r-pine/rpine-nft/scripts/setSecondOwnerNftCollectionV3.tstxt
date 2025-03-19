import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollectionV3 } from '../wrappers/NftCollectionV3';

// Replace with your NFT collection contract address
const COLLECTION_ADDRESS = Address.parse('EQAPkxIsDFz2sm1mQv6NIVghZD7HYmA_ld7wKtovtnMNZ9lq');
// Replace with the new second owner address
const SECOND_OWNER_ADDRESS = Address.parse('EQC7mq3O8EvQlUVyy3FPqOMEaD7qXyA9tEW7pnSedpnqhv54');

export async function run(provider: NetworkProvider) {
    const nftCollection = provider.open(NftCollectionV3.createFromAddress(COLLECTION_ADDRESS)); 

    // Send the transaction to change the second owner's address
    await nftCollection.sendChangeSecondOwner(provider.sender(), SECOND_OWNER_ADDRESS);
}
