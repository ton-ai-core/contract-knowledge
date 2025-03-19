import { Blockchain, internal, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, Cell, toNano } from '@ton/core';
import { Proxy } from '../wrappers/Proxy';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { NftCollectionV3 } from '../wrappers/NftCollectionV3';

describe('Proxy', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Proxy');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let proxy: SandboxContract<Proxy>;

    let collection: SandboxContract<NftCollectionV3>;
    let admin: SandboxContract<TreasuryContract>;
    let buyer: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        admin = await blockchain.treasury('admin');
        buyer = await blockchain.treasury('buyer');

        collection = blockchain.openContract(
            NftCollectionV3.createFromConfig(
                {
                    owner: admin.address,
                    baseContent: 'base content',
                    collectionContent: 'collection content',
                    commonContent: 'common content',
                    nftCode: await compile('NftItem'),
                    royaltyParams: {
                        royaltyFactor: 12,
                        royaltyBase: 100,
                        royaltyAddress: buyer.address,
                    },
                    secondOwner: admin.address
                },
                await compile('NftCollectionV3')
        ));

        deployer = await blockchain.treasury('deployer');

        await collection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect((await blockchain.getContract(collection.address)).accountState?.type === 'active')

        proxy = blockchain.openContract(
            Proxy.createFromConfig(
                {
                    price: toNano('25'),
                    refBack: toNano('4.5'),
                    collectionAddress: collection.address,
                    adminAddress: admin.address,
                }, 
                code
            )
        );

        await blockchain.sendMessage(
            internal({
                from: admin.address,
                to: collection.address,
                value: toNano('0.02'),
                body: beginCell()
                    .storeUint(6, 32)
                    .storeUint(0, 64)
                    .storeAddress(proxy.address)
                .endCell()
            })
        )

        expect(await collection.getSecondOwner()).toEqualAddress(proxy.address)

        const deployResult = await proxy.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: proxy.address,
            deploy: true,
            success: true,
        });
    });

    it('should buy nft', async () => {
        const referral = await blockchain.treasury('referral')
        // await blockchain.setVerbosityForAddress(proxy.address, {
        //     'vmLogs': 'vm_logs_full',
        //     debugLogs: false,
        //     blockchainLogs: false,
        //     print: true
        // })
        const res = await proxy.sendBuy(buyer.getSender(), toNano('25.05'), referral.address)
        printTransactionFees(res.transactions)
    });
});