import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftCollectionV3 } from '../wrappers/NftCollectionV3';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftCollectionV3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftCollectionV3');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftCollectionV3: SandboxContract<NftCollectionV3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftCollectionV3 = blockchain.openContract(NftCollectionV3.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftCollectionV3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftCollectionV3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftCollectionV3 are ready to use
    });
});
