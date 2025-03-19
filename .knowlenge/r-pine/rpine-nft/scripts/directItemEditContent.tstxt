import { Address, beginCell, Cell, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { NftItem } from '../wrappers/NftItem';

const nftItemAddress = Address.parse('EQAabeHkDXzZMze8OLxSVUBmELS7dflLs_qvozeHZLQBWKz_');
const newContentUrl = 'https://raw.githubusercontent.com/r-pine/rpine-nft/refs/heads/master/scripts/forest-collection/items/json/3.1.json';
const newAuthorityAddress = undefined;
const newRevokedAt = undefined;

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const nftItem = provider.open(
        NftItem.createFromAddress(nftItemAddress)
    );
    
    const newContentCell = beginCell()
        .storeBuffer(Buffer.from(newContentUrl))
        .endCell();

    await nftItem.sendEditContent(provider.sender(), newContentCell, newAuthorityAddress, newRevokedAt);

    ui.write('NFT content has been successfully edited!');
}